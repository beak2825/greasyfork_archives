// ==UserScript==
// @name         Emby Hide Media Configurable Tag
// @namespace    http://tampermonkey.net/
// @version      2.13
// @description  Add "Hide Media" and "Unhide Media" options to Emby context menu to tag/untag all versions of selected media with a configurable tag
// @author       Baiganjia
// @match        http://127.0.0.1:8886/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538387/Emby%20Hide%20Media%20Configurable%20Tag.user.js
// @updateURL https://update.greasyfork.org/scripts/538387/Emby%20Hide%20Media%20Configurable%20Tag.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const HIDE_TAG = '待批判';
    const EMBY_URL = 'http://127.0.0.1:8886'; //填你的地址
    const API_KEY = 'cc761e0a44424e639c4970dcf4b6450f';  //填你的APIKEY
    const FALLBACK_USER_ID = '00000000000000000000000000000000'; //这个应该不用改

    // Utility: Format timestamp for logs
    function getTimestamp() {
        return new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
    }

    // Utility: Get USER_ID dynamically
    function getUserId() {
        try {
            const userId = window.ApiClient?.getCurrentUserId();
            if (userId) {
                console.log(`✅ 动态获取 USER_ID: ${userId}`);
                return userId;
            }
            console.warn(`⚠️ window.ApiClient.getCurrentUserId 未定义，使用回退 USER_ID: ${FALLBACK_USER_ID}`);
            return FALLBACK_USER_ID;
        } catch (error) {
            console.warn(`❌ 获取 USER_ID 失败: ${error.message}，使用回退 USER_ID: ${FALLBACK_USER_ID}`);
            return FALLBACK_USER_ID;
        }
    }

    const USER_ID = getUserId();

    // Debounce utility
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Add "Hide Media" and "Unhide Media" options to context menu
    function addMenuOptions() {
        const actionSheet = document.querySelector('.actionSheetScroller');
        if (!actionSheet) return;

        // Add "Hide Media" option
        if (!document.querySelector('#hideMedia')) {
            const hideMenuItem = document.createElement('button');
            hideMenuItem.className = 'listItem listItem-autoactive itemAction listItemCursor listItem-hoverable actionSheetMenuItem actionSheetMenuItem-iconright';
            hideMenuItem.id = 'hideMedia';
            hideMenuItem.setAttribute('data-id', 'hideMedia');
            hideMenuItem.setAttribute('data-action', 'custom');
            hideMenuItem.innerHTML = `
                <div class="listItem-content listItem-content-bg listItemContent-touchzoom listItem-border">
                    <div class="actionSheetItemImageContainer actionSheetItemImageContainer-customsize actionSheetItemImageContainer-transparent listItemImageContainer listItemImageContainer-margin listItemImageContainer-square defaultCardBackground" style="aspect-ratio:1">
                        <i class="actionsheetMenuItemIcon listItemIcon listItemIcon-transparent md-icon listItemIcon md-icon autortl">visibility_off</i>
                    </div>
                    <div class="actionsheetListItemBody actionsheetListItemBody-iconright listItemBody listItemBody-1-lines">
                        <div class="listItemBodyText actionSheetItemText listItemBodyText-nowrap listItemBodyText-lf">隐藏媒体</div>
                    </div>
                </div>
            `;
            hideMenuItem.addEventListener('click', hideSelectedMedia);
            actionSheet.querySelector('.actionsheetScrollSlider').appendChild(hideMenuItem);
        }

        // Add "Unhide Media" option
        if (!document.querySelector('#unhideMedia')) {
            const unhideMenuItem = document.createElement('button');
            unhideMenuItem.className = 'listItem listItem-autoactive itemAction listItemCursor listItem-hoverable actionSheetMenuItem actionSheetMenuItem-iconright';
            unhideMenuItem.id = 'unhideMedia';
            unhideMenuItem.setAttribute('data-id', 'unhideMedia');
            unhideMenuItem.setAttribute('data-action', 'custom');
            unhideMenuItem.innerHTML = `
                <div class="listItem-content listItem-content-bg listItemContent-touchzoom listItem-border">
                    <div class="actionSheetItemImageContainer actionSheetItemImageContainer-customsize actionSheetItemImageContainer-transparent listItemImageContainer listItemImageContainer-margin listItemImageContainer-square defaultCardBackground" style="aspect-ratio:1">
                        <i class="actionsheetMenuItemIcon listItemIcon listItemIcon-transparent md-icon listItemIcon md-icon autortl">visibility</i>
                    </div>
                    <div class="actionsheetListItemBody actionsheetListItemBody-iconright listItemBody listItemBody-1-lines">
                        <div class="listItemBodyText actionSheetItemText listItemBodyText-nowrap listItemBodyText-lf">取消隐藏</div>
                    </div>
                </div>
            `;
            unhideMenuItem.addEventListener('click', unhideSelectedMedia);
            actionSheet.querySelector('.actionsheetScrollSlider').appendChild(unhideMenuItem);
        }
    }

    // Get related ItemIds from MediaSources
    async function getRelatedItemIds(mediaId) {
        console.group(`[${getTimestamp()}] 获取媒体 ${mediaId} 的相关 ItemIds`);
        try {
            const url = `${EMBY_URL}/Users/${USER_ID}/Items/${mediaId}?api_key=${API_KEY}&Fields=MediaSources,Name`;
            console.log('🔗 请求URL:', url);
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            if (!response.ok) {
                console.warn('❌ API响应错误:', response.status, response.statusText);
                throw new Error(`获取 MediaSources 失败: ${response.status}`);
            }
            const data = await response.json();
            console.log('📄 API响应:', JSON.stringify(data, null, 2));
            const mediaSources = data?.MediaSources || [];
            const itemIds = mediaSources.map(source => ({
                Id: source.ItemId,
                Name: source.Name,
                Type: source.Type
            }));
            if (itemIds.length === 0) {
                console.warn(`⚠️ 未找到 MediaSources for 媒体 ${mediaId}，退回到 mediaId`);
                itemIds.push({ Id: mediaId, Name: data?.Name || '未知', Type: 'Default' });
            }
            console.table('📋 相关 ItemIds:', itemIds);
            console.log(`✅ 媒体 ${mediaId} 对应的 ItemIds: ${itemIds.map(item => item.Id).join(', ')}`);
            return itemIds.map(item => item.Id);
        } catch (error) {
            console.warn(`❌ 无法获取媒体 ${mediaId} 的相关 ItemIds:`, error.message);
            return [mediaId]; // Fallback to original mediaId
        } finally {
            console.groupEnd();
        }
    }

    // Add configurable tag to a media item
    async function addTagToMedia(mediaId) {
        console.group(`[${getTimestamp()}] 为媒体 ${mediaId} 添加标签`);
        try {
            const url = `${EMBY_URL}/Items/${mediaId}/Tags/Add?api_key=${API_KEY}`;
            console.log('🔗 请求URL:', url);
            const requestBody = { Tags: [{ Name: HIDE_TAG }] };
            console.log('📤 请求体:', JSON.stringify(requestBody, null, 2));
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            if (!response.ok) {
                console.warn('❌ Tags格式响应:', response.status, response.statusText, await response.text());
                throw new Error(`添加标签失败 (Tags format): ${response.status}`);
            }
            console.log(`✅ 媒体 ${mediaId} 通过 Tags 格式成功添加“${HIDE_TAG}”标签`);
            return true;
        } catch (error) {
            console.warn(`❌ 为媒体 ${mediaId} 使用 Tags 格式添加标签失败:`, error.message);
            try {
                const fallbackUrl = `${EMBY_URL}/Items/${mediaId}/Tags/Add?api_key=${API_KEY}`;
                console.log('🔗 备用请求URL:', fallbackUrl);
                const fallbackBody = { TagItems: [HIDE_TAG] };
                console.log('📤 备用请求体:', JSON.stringify(fallbackBody, null, 2));
                const fallbackResponse = await fetch(fallbackUrl, {
                    method: 'POST',
                    headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(fallbackBody)
                });
                if (!fallbackResponse.ok) {
                    console.warn('❌ TagItems格式响应:', fallbackResponse.status, fallbackResponse.statusText, await fallbackResponse.text());
                    throw new Error(`添加标签失败 (TagItems format): ${fallbackResponse.status}`);
                }
                console.log(`✅ 媒体 ${mediaId} 通过 TagItems 格式成功添加“${HIDE_TAG}”标签`);
                return true;
            } catch (fallbackError) {
                console.error(`❌ 为媒体 ${mediaId} 添加标签失败:`, fallbackError.message);
                return false;
            }
        } finally {
            console.groupEnd();
        }
    }

    // Remove configurable tag from a media item
    async function removeTagFromMedia(mediaId) {
        console.group(`[${getTimestamp()}] 为媒体 ${mediaId} 移除标签`);
        try {
            const url = `${EMBY_URL}/Items/${mediaId}/Tags/Delete?api_key=${API_KEY}`;
            console.log('🔗 请求URL:', url);
            const requestBody = { Tags: [{ Name: HIDE_TAG, Id: "" }] };
            console.log('📤 请求体:', JSON.stringify(requestBody, null, 2));
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            if (!response.ok) {
                console.warn('❌ Tags格式响应:', response.status, response.statusText, await response.text());
                throw new Error(`移除标签失败 (Tags format): ${response.status}`);
            }
            console.log(`✅ 媒体 ${mediaId} 通过 Tags 格式成功移除“${HIDE_TAG}”标签`);
            return true;
        } catch (error) {
            console.warn(`❌ 为媒体 ${mediaId} 使用 Tags 格式移除标签失败:`, error.message);
            try {
                const fallbackUrl = `${EMBY_URL}/Items/${mediaId}/Tags/Delete?api_key=${API_KEY}`;
                console.log('🔗 备用请求URL:', fallbackUrl);
                const fallbackBody = { TagItems: [HIDE_TAG] };
                console.log('📤 备用请求体:', JSON.stringify(fallbackBody, null, 2));
                const fallbackResponse = await fetch(fallbackUrl, {
                    method: 'POST',
                    headers: {
                        'Accept': '*/*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(fallbackBody)
                });
                if (!fallbackResponse.ok) {
                    console.warn('❌ TagItems格式响应:', fallbackResponse.status, fallbackResponse.statusText, await fallbackResponse.text());
                    throw new Error(`移除标签失败 (TagItems format): ${fallbackResponse.status}`);
                }
                console.log(`✅ 媒体 ${mediaId} 通过 TagItems 格式成功移除“${HIDE_TAG}”标签`);
                return true;
            } catch (fallbackError) {
                console.error(`❌ 为媒体 ${mediaId} 移除标签失败:`, fallbackError.message);
                return false;
            }
        } finally {
            console.groupEnd();
        }
    }

    // Handle "Hide Media" action
    async function hideSelectedMedia(event) {
        console.group(`[${getTimestamp()}] 处理隐藏媒体操作`);
        const button = event.target.closest('button');
        let originalText, buttonDisabled;
        if (button) {
            originalText = button.textContent;
            button.textContent = '处理中...';
            button.disabled = true;
            buttonDisabled = true;
            console.log('🔘 按钮状态: 处理中');
        }

        try {
            let selectedItems = document.querySelectorAll('input[type=checkbox]:checked');
            let context = 'multi-select';
            if (selectedItems.length === 0) {
                const targetCard = event.target.closest('.card');
                if (targetCard) {
                    console.log('📍 右键菜单目标卡片:', targetCard.outerHTML);
                    selectedItems = [targetCard];
                    context = 'single-select';
                } else {
                    console.warn('⚠️ 未找到选中的媒体项目');
                    alert('请先选择至少一个媒体项目！');
                    return;
                }
            }

            console.log(`📊 选中的项目 (${context}): ${selectedItems.length}`);
            console.table('📋 勾选的媒体:', Array.from(selectedItems).map((item, index) => {
                const card = item.closest('.card') || item;
                const titleElement = card.querySelector('.cardText, .cardContent, [title], .listItemBodyText');
                const title = titleElement ? titleElement.textContent.trim() || titleElement.getAttribute('title') : '未知标题';
                return { Index: index + 1, Title: title };
            }));

            let successCount = 0;
            let failureCount = 0;

            const itemIdPromises = Array.from(selectedItems).map(async (item, index) => {
                console.group(`[${getTimestamp()}] 处理媒体 #${index + 1}`);
                const card = item.closest('.card') || item;
                const titleElement = card.querySelector('.cardText, .cardContent, [title], .listItemBodyText');
                const title = titleElement ? titleElement.textContent.trim() || titleElement.getAttribute('title') : '未知标题';
                console.log('📌 当前勾选的媒体:', title);
                console.log('📄 卡片HTML:', card.outerHTML);

                let mediaId;
                const img = card.querySelector('img[src*="/Items/"]');
                if (img) {
                    const match = img.src.match(/\/Items\/(\d+)/);
                    mediaId = match ? match[1] : null;
                }
                if (!mediaId) {
                    mediaId = card.getAttribute('data-id') || card.getAttribute('data-itemid') || card.getAttribute('data-mediaid');
                }
                if (!mediaId) {
                    const idElement = card.querySelector('[data-id], [data-itemid], [data-mediaid], button[data-action="link"]');
                    mediaId = idElement ? idElement.getAttribute('data-id') || idElement.getAttribute('data-itemid') || idElement.getAttribute('data-mediaid') : null;
                }
                if (!mediaId) {
                    console.warn('⚠️ 无法获取媒体ID for 媒体:', title);
                    console.groupEnd();
                    return { mediaId: null, relatedItemIds: [], title };
                }
                console.log(`📍 当前勾选的媒体ID: ${mediaId}`);
                const relatedItemIds = await getRelatedItemIds(mediaId);
                console.groupEnd();
                return { mediaId, relatedItemIds, title };
            });

            const itemIdResults = await Promise.all(itemIdPromises);
            console.table('📋 ItemIds 获取结果:', itemIdResults.map((result, index) => ({
                Index: index + 1,
                Title: result.title,
                MediaId: result.mediaId || '未获取',
                RelatedItemIds: result.relatedItemIds.join(', ') || '无'
            })));

            const tagPromises = itemIdResults.map(async ({ mediaId, relatedItemIds, title }) => {
                console.group(`[${getTimestamp()}] 为媒体 ${title} (ID: ${mediaId}) 添加标签`);
                if (!mediaId) {
                    console.warn('⚠️ 跳过: 无有效 MediaId');
                    failureCount++;
                    console.groupEnd();
                    return;
                }
                const itemIds = relatedItemIds.length > 0 ? relatedItemIds : [mediaId];
                console.log(`📊 处理的 ItemIds: ${itemIds.join(', ')}`);
                const tagResults = await Promise.all(itemIds.map(async (id) => {
                    console.log(`📍 为版本 ItemId ${id} 添加标签`);
                    const success = await addTagToMedia(id);
                    return success ? 1 : 0;
                }));
                successCount += tagResults.reduce((sum, val) => sum + val, 0);
                failureCount += itemIds.length - tagResults.reduce((sum, val) => sum + val, 0);
                console.groupEnd();
            });

            await Promise.all(tagPromises);

            console.log(`🎉 操作完成: 成功 ${successCount} 个，失败 ${failureCount} 个`);
            alert(`操作完成！成功为 ${successCount} 个媒体版本添加“${HIDE_TAG}”标签，${failureCount} 个失败。页面将自动刷新以应用隐藏效果。`);
            setTimeout(() => location.reload(), 2000);

            const actionSheet = document.querySelector('.actionSheet');
            if (actionSheet) actionSheet.remove();
        } catch (error) {
            console.error(`❌ 操作失败:`, error.message);
            alert(`操作失败: ${error.message}`);
        } finally {
            if (button && buttonDisabled) {
                button.textContent = originalText;
                button.disabled = false;
                console.log('🔘 按钮状态: 恢复');
            }
            console.groupEnd();
        }
    }

    // Handle "Unhide Media" action
    async function unhideSelectedMedia(event) {
        console.group(`[${getTimestamp()}] 处理取消隐藏媒体操作`);
        const button = event.target.closest('button');
        let originalText, buttonDisabled;
        if (button) {
            originalText = button.textContent;
            button.textContent = '处理中...';
            button.disabled = true;
            buttonDisabled = true;
            console.log('🔘 按钮状态: 处理中');
        }

        try {
            let selectedItems = document.querySelectorAll('input[type=checkbox]:checked');
            let context = 'multi-select';
            if (selectedItems.length === 0) {
                const targetCard = event.target.closest('.card');
                if (targetCard) {
                    console.log('📍 右键菜单目标卡片:', targetCard.outerHTML);
                    selectedItems = [targetCard];
                    context = 'single-select';
                } else {
                    console.warn('⚠️ 未找到选中的媒体项目');
                    alert('请先选择至少一个媒体项目！');
                    return;
                }
            }

            console.log(`📊 选中的项目 (${context}): ${selectedItems.length}`);
            console.table('📋 勾选的媒体:', Array.from(selectedItems).map((item, index) => {
                const card = item.closest('.card') || item;
                const titleElement = card.querySelector('.cardText, .cardContent, [title], .listItemBodyText');
                const title = titleElement ? titleElement.textContent.trim() || titleElement.getAttribute('title') : '未知标题';
                return { Index: index + 1, Title: title };
            }));

            let successCount = 0;
            let failureCount = 0;

            const itemIdPromises = Array.from(selectedItems).map(async (item, index) => {
                console.group(`[${getTimestamp()}] 处理媒体 #${index + 1}`);
                const card = item.closest('.card') || item;
                const titleElement = card.querySelector('.cardText, .cardContent, [title], .listItemBodyText');
                const title = titleElement ? titleElement.textContent.trim() || titleElement.getAttribute('title') : '未知标题';
                console.log('📌 当前勾选的媒体:', title);
                console.log('📄 卡片HTML:', card.outerHTML);

                let mediaId;
                const img = card.querySelector('img[src*="/Items/"]');
                if (img) {
                    const match = img.src.match(/\/Items\/(\d+)/);
                    mediaId = match ? match[1] : null;
                }
                if (!mediaId) {
                    mediaId = card.getAttribute('data-id') || card.getAttribute('data-itemid') || card.getAttribute('data-mediaid');
                }
                if (!mediaId) {
                    const idElement = card.querySelector('[data-id], [data-itemid], [data-mediaid], button[data-action="link"]');
                    mediaId = idElement ? idElement.getAttribute('data-id') || idElement.getAttribute('data-itemid') || idElement.getAttribute('data-mediaid') : null;
                }
                if (!mediaId) {
                    console.warn('⚠️ 无法获取媒体ID for 媒体:', title);
                    console.groupEnd();
                    return { mediaId: null, relatedItemIds: [], title };
                }
                console.log(`📍 当前勾选的媒体ID: ${mediaId}`);
                const relatedItemIds = await getRelatedItemIds(mediaId);
                console.groupEnd();
                return { mediaId, relatedItemIds, title };
            });

            const itemIdResults = await Promise.all(itemIdPromises);
            console.table('📋 ItemIds 获取结果:', itemIdResults.map((result, index) => ({
                Index: index + 1,
                Title: result.title,
                MediaId: result.mediaId || '未获取',
                RelatedItemIds: result.relatedItemIds.join(', ') || '无'
            })));

            const tagPromises = itemIdResults.map(async ({ mediaId, relatedItemIds, title }) => {
                console.group(`[${getTimestamp()}] 为媒体 ${title} (ID: ${mediaId}) 移除标签`);
                if (!mediaId) {
                    console.warn('⚠️ 跳过: 无有效 MediaId');
                    failureCount++;
                    console.groupEnd();
                    return;
                }
                const itemIds = relatedItemIds.length > 0 ? relatedItemIds : [mediaId];
                console.log(`📊 处理的 ItemIds: ${itemIds.join(', ')}`);
                const tagResults = await Promise.all(itemIds.map(async (id) => {
                    console.log(`📍 为版本 ItemId ${id} 移除标签`);
                    const success = await removeTagFromMedia(id);
                    return success ? 1 : 0;
                }));
                successCount += tagResults.reduce((sum, val) => sum + val, 0);
                failureCount += itemIds.length - tagResults.reduce((sum, val) => sum + val, 0);
                console.groupEnd();
            });

            await Promise.all(tagPromises);

            console.log(`🎉 操作完成: 成功 ${successCount} 个，失败 ${failureCount} 个`);
            alert(`操作完成！成功为 ${successCount} 个媒体版本移除“${HIDE_TAG}”标签，${failureCount} 个失败。页面将自动刷新以恢复显示。`);
            setTimeout(() => location.reload(), 2000);

            const actionSheet = document.querySelector('.actionSheet');
            if (actionSheet) actionSheet.remove();
        } catch (error) {
            console.error(`❌ 操作失败:`, error.message);
            alert(`操作失败: ${error.message}`);
        } finally {
            if (button && buttonDisabled) {
                button.textContent = originalText;
                button.disabled = false;
                console.log('🔘 按钮状态: 恢复');
            }
            console.groupEnd();
        }
    }

    const debouncedAddMenuOptions = debounce(addMenuOptions, 100);

    const observer = new MutationObserver(() => {
        if (document.querySelector('.actionSheet') && (!document.querySelector('#hideMedia') || !document.querySelector('#unhideMedia'))) {
            debouncedAddMenuOptions();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('click', () => {
        if (document.querySelector('.actionSheet')) {
            debouncedAddMenuOptions();
        }
    });
})();