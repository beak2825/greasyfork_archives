// ==UserScript==
// @name            115Rename2025
// @namespace           http://tampermonkey.net/
// @version             1.4.1
// @description         115网盘视频整理工具：1.根据番号查询并重命名文件 2.支持javbus/avmoo查询 3.演员归档自动分类 4.可设置归档根目录 5.支持中文字幕和无码标记 6.支持文件夹归档 7.增强用户体验的通知提示 8.性能优化 9.评分同步 10.支持批量处理
// @author              db117 wusuowei111 Chunluren 
// @include             https://115.com/*
// @icon      	 https://115.com/favicon.ico
// @domain              javbus.com
// @domain              avmoo.host
// @domain              avsox.host
// @domain              javdb.com
// @domain              fc2ppvdb.com
// @connect             javdb.com
// @connect             fc2ppvdb.com
// @grant               GM_notification
// @grant               GM_xmlhttpRequest
// @grant               GM_setValue
// @grant               GM_getValue
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/532320/115Rename2025.user.js
// @updateURL https://update.greasyfork.org/scripts/532320/115Rename2025.meta.js
// ==/UserScript==

/*
 * 更新日志：
 * v1.4.1 (2024-05-xx):
 * 1. 实现多网站轮询查询功能，优先javbus，失败后查询javdb (取代原有4个改名按钮)
 * 2. 新增FC2-PPV格式支持，针对FC2视频自动到fc2ppvdb.com查询
 * 3. 改进番号提取逻辑，支持更多格式：
 *    - FC2-PPV、PPV-xxxxx等FC2系列格式
 *    - 带空格的番号格式，如"SONE- 101- UC" → "SONE-101"
 *    - 日期格式番号，如"041117_510"等
 * 4. 自动过滤文件名中的常见后缀(UC、C、U、字幕等)
 * 5. 针对不同网站查询失败情况提供更友好的错误提示
 * 6. 增强域名前缀清理，支持hhd800.com@等格式
 */

(function () {
    // 添加一个独特的标识符，确保元素唯一
    const rootInfoId = 'archive-root-info-' + Date.now();
    
    // 在执行任何操作前，先清除可能存在的所有归档根目录信息元素
    function cleanupExistingRootInfo() {
        try {
            // 清除主文档中的元素
            const mainDocElements = document.querySelectorAll('[id^="archive-root-info"]');
            if (mainDocElements.length > 0) {
                console.log(`清理主文档中发现的${mainDocElements.length}个归档根目录信息元素`);
                mainDocElements.forEach(element => element.remove());
            }
            
            // 尝试清除所有iframe中的元素
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                try {
                    if (iframe.contentDocument) {
                        const iframeElements = iframe.contentDocument.querySelectorAll('[id^="archive-root-info"]');
                        if (iframeElements.length > 0) {
                            console.log(`清理iframe中发现的${iframeElements.length}个归档根目录信息元素`);
                            iframeElements.forEach(element => element.remove());
                        }
                    }
                } catch (e) {
                    // 跨域iframe可能会抛出异常，忽略
                    console.log("无法访问iframe内容，可能是跨域限制");
                }
            });
        } catch (e) {
            console.error("清理归档根目录信息元素时出错:", e);
        }
    }
    
    // 立即执行清理
    cleanupExistingRootInfo();
    
    // 添加样式，使用更明确的选择器
    const notificationStyle = `
    <style>
        /* 归档根目录信息样式 */
        [id^="archive-root-info"] {
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 300px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 9998;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border-left: 4px solid #1890ff;
        }
        
        /* 临时通知样式 */
        .custom-notification {
            position: fixed;
            top: 80px; /* 位于根目录通知下方 */
            right: 20px;
            max-width: 300px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 9999;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateY(-10px);
        }
        .custom-notification.success {
            border-left: 4px solid #52c41a;
        }
        .custom-notification.error {
            border-left: 4px solid #f5222d;
        }
        .custom-notification.info {
            border-left: 4px solid #1890ff;
        }
        .custom-notification.show {
            opacity: 1;
            transform: translateY(0);
        }
    </style>`;
    
    // 添加样式到页面
    $('head').append(notificationStyle);
    
    // 默认使用根目录ID
    const ROOT_DIR_CID = "0"; // 115网盘根目录的ID为"0"
    // 尝试从存储中获取根目录ID，如果不存在则为null（表示未设置）
    let archiveRootCid = GM_getValue("archiveRootCid", null);
    let archiveRootName = GM_getValue("archiveRootName", null);
    
    // 简单的页面内通知函数
    window.showPageNotification = function(message, type = 'info', duration = 3000) {
        // 为不同类型通知设置不同的默认持续时间
        if (duration === 3000) {
            if (type === 'success') duration = 3000;      // 成功通知更短
            else if (type === 'error') duration = 5000;   // 错误通知更长
            else if (type === 'info') duration = 3000;    // 信息通知标准
        }
        
        const notificationId = 'custom-notification-' + Date.now();
        const notificationHtml = `<div id="${notificationId}" class="custom-notification ${type}">${message}</div>`;
        
        // 添加通知到页面
        $('body').append(notificationHtml);
        
        // 显示通知
        setTimeout(() => {
            $(`#${notificationId}`).addClass('show');
        }, 10);
        
        // 自动关闭
        setTimeout(() => {
            $(`#${notificationId}`).removeClass('show');
            setTimeout(() => {
                $(`#${notificationId}`).remove();
            }, 300);
        }, duration);
    };
    
    // 简单函数：显示归档根目录信息
    function showArchiveRootInfo() {
        // 确保清理可能存在的其他实例
        cleanupExistingRootInfo();
        
        // 根据是否设置了根目录，显示不同的信息
        let rootDirMessage;
        if (archiveRootCid && archiveRootName) {
            rootDirMessage = `当前归档根目录: "${archiveRootName}"`;
        } else {
            rootDirMessage = "当前无归档根目录，将使用115网盘根目录";
        }
        
        // 创建信息元素，使用带时间戳的ID确保唯一性
        const infoElement = $(`<div id="${rootInfoId}" class="archive-root-info">${rootDirMessage}</div>`);
        
        // 确保只添加到主文档，不添加到iframe
        if (window.self === window.top) {
            $('body').append(infoElement);
            console.log("在主文档中显示归档根目录信息: " + rootDirMessage);
        }
    }
    
    // 设置延迟计时器
    let rootInfoTimer = null;
    
    // 只在主窗口（非iframe）中显示一次
    function initializeRootInfo() {
        // 只在主窗口中初始化，避免在iframe中创建
        if (window.self !== window.top) {
            console.log("处于iframe中，跳过显示归档根目录信息");
            return;
        }
        
        // 清除可能存在的计时器
        if (rootInfoTimer) {
            clearTimeout(rootInfoTimer);
        }
        
        // 设置新的计时器
        rootInfoTimer = setTimeout(function() {
            showArchiveRootInfo();
            rootInfoTimer = null;  // 清除引用
        }, 2000);
    }
    
    // 在页面完全加载后显示
    $(window).on('load', function() {
        initializeRootInfo();
    });
    
    // 如果window.load事件已触发，直接初始化
    if (document.readyState === 'complete') {
        initializeRootInfo();
    }
    
    // 不再在document.ready时创建，避免重复
    
    // 按钮
    let rename_list = `
            <li id="rename_list">
                <a id="rename_all_multi" class="mark" href="javascript:;">改名(多网站轮询)</a>
                <a id="rename_all_multi_date" class="mark" href="javascript:;">改名(多网站轮询)_时间</a>
                <a id="archive_to_folder" class="mark" href="javascript:;">归档至文件夹</a>
                <a id="set_archive_root" class="mark" href="javascript:;">设置为归档根目录</a>
                <a id="get_javdb_rating" class="mark" href="javascript:;">获取javdb评分</a>
            </li>
        `;
    /**
     * 添加按钮的定时任务
     */
    let interval = setInterval(buttonInterval, 1000);

    // javbus
    let javbusBase = "https://www.javbus.com/";
    // 直接访问番号页面 (使用番号直接访问)
    let javbusDirectAccess = javbusBase;
    // 无码页面基础URL
    let javbusUncensoredBase = javbusBase + "uncensored/";

    // javdb
    let javdbBase = "https://javdb.com/";
    let javdbSearchBase = "https://javdb.com/search?q=";
    let javdbDirectAccess = "https://javdb.com/";

    // fc2ppvdb
    let fc2ppvdbBase = "https://fc2ppvdb.com/articles/";

    // avmoo
    // 有码
    let avmooSearch = "https://avmoo.host/cn/search/";
    // 无码
    let avmooUncensoredSearch = "https://avsox.host/cn/search/";
    'use strict';

    /**
     * 添加按钮定时任务(检测到可以添加时添加按钮)
     */
    function buttonInterval() {
        let open_dir = $("div#js_float_content li[val='open_dir']");
        if (open_dir.length !== 0 && $("li#rename_list").length === 0) {
            open_dir.before(rename_list);
            $("a#rename_all_multi").click(
                function () {
                    rename(rename_multi, false);
                });
            $("a#rename_all_multi_date").click(
                function () {
                    rename(rename_multi, true);
                });
            $("a#archive_to_folder").click(
                function () {
                    archiveToActorFolder();
                });
            $("a#set_archive_root").click(
                function () {
                    setArchiveRoot();
                });
            $("a#get_javdb_rating").click(
                function () {
                    getJavdbRating();
                });
            
            // 根据是否设置了根目录，显示不同的日志
            if (archiveRootCid) {
                console.log("添加按钮，当前归档根目录: " + archiveRootName + " (CID: " + archiveRootCid + ")");
            } else {
                console.log("添加按钮，未设置归档根目录，将使用115网盘根目录");
            }
            
            // 按钮添加时不再创建根目录信息，依赖页面加载时的创建
            console.log("按钮已添加，根目录信息状态: " + (window.rootInfoDisplayed ? "已显示" : "未显示"));
            
            // 结束定时任务
            clearInterval(interval);
        }
    }

    /**
     * 设置归档根目录
     * 获取选中的文件夹信息并保存为归档根目录
     */
    function setArchiveRoot() {
        // 获取选中的文件夹
        let selectedFolder = $("iframe[rel='wangpan']")
            .contents()
            .find("li.selected");
        
        // 检查是否只选择了一个文件夹
        if (selectedFolder.length !== 1) {
            GM_notification(getDetails("请只选择一个文件夹", "设置失败"));
            showPageNotification("请只选择一个文件夹", 'error', 3000);
            console.log("设置归档根目录失败：选择了 " + selectedFolder.length + " 个项目，请只选择一个文件夹");
            return;
        }
        
        let $item = $(selectedFolder[0]);
        // 检查是否是文件夹
        let file_type = $item.attr("file_type");
        if (file_type !== "0") {
            GM_notification(getDetails("请选择文件夹类型", "设置失败"));
            showPageNotification("请选择文件夹类型", 'error', 3000);
            console.log("设置归档根目录失败：选中的不是文件夹");
            return;
        }
        
        // 获取文件夹ID和名称
        let cid = $item.attr("cate_id");
        let name = $item.attr("title");
        
        if (cid) {
            // 保存到GM存储中
            GM_setValue("archiveRootCid", cid);
            GM_setValue("archiveRootName", name);
            
            // 更新当前变量
            archiveRootCid = cid;
            archiveRootName = name;
            
            // 更新归档根目录显示
            cleanupExistingRootInfo();
            showArchiveRootInfo();
            
            GM_notification(getDetails(name, "归档根目录设置成功"));
            showPageNotification(`归档根目录设置成功: "${name}"`, 'success', 5000);
            console.log("归档根目录设置成功: " + name + " (CID: " + cid + ")");
        } else {
            GM_notification(getDetails("无法获取文件夹ID", "设置失败"));
            showPageNotification("无法获取文件夹ID", 'error', 3000);
            console.log("设置归档根目录失败：无法获取文件夹ID");
        }
    }

    /**
     * 执行改名方法
     * @param call       回调函数
     * @param addDate   是否添加时间
     */
    function rename(call, addDate) {
        // 获取选中的文件数量
        let selectedCount = $("iframe[rel='wangpan']").contents().find("li.selected").length;
        showPageNotification(`开始处理 ${selectedCount} 个文件...`, 'info', 3000);
        
        // 记录成功处理的数量
        let successCount = 0;
        
        // 获取所有已选择的文件
        let list = $("iframe[rel='wangpan']")
            .contents()
            .find("li.selected")
            .each(function (index, v) {
                let $item = $(v);
                // 原文件名称
                let file_name = $item.attr("title");
                // 文件类型
                let file_type = $item.attr("file_type");
                
                console.log("处理文件: " + file_name);

                // 文件id
                let fid;
                // 后缀名
                let suffix;
                if (file_type === "0") {
                    // 文件夹
                    fid = $item.attr("cate_id");
                } else {
                    // 文件
                    fid = $item.attr("file_id");
                    // 处理后缀
                    let lastIndexOf = file_name.lastIndexOf('.');
                    if (lastIndexOf !== -1) {
                        suffix = file_name.substr(lastIndexOf, file_name.length);
                    }
                }

                if (fid && file_name) {
                    // 先检查是否是FC2或PPV格式的文件
                    let isFC2 = /FC2/i.test(file_name) || /PPV[-_\s]?\d{5,7}/i.test(file_name);
                    if (isFC2) {
                        console.log("检测到可能的FC2格式文件: " + file_name);
                        // 尝试直接从文件名提取FC2编号
                        let fc2Number = extractFC2Number(file_name);
                        if (fc2Number) {
                            console.log("直接从文件名提取FC2编号: " + fc2Number);
                            let fc2Code = "FC2-PPV-" + fc2Number;
                            call(fid, fc2Code, suffix, false, false, addDate, function() {
                                successCount++;
                                if (successCount === selectedCount) {
                                    showPageNotification(`所有 ${successCount} 个文件处理完成`, 'success', 5000);
                                }
                            });
                            return;
                        } else if (/PPV[-_\s]?(\d{5,7})/i.test(file_name)) {
                            // 特殊处理PPV-XXXXX格式
                            let ppvMatch = file_name.match(/PPV[-_\s]?(\d{5,7})/i);
                            if (ppvMatch && ppvMatch[1]) {
                                console.log("从PPV格式提取FC2编号: " + ppvMatch[1]);
                                let fc2Code = "FC2-PPV-" + ppvMatch[1];
                                call(fid, fc2Code, suffix, false, false, addDate, function() {
                                    successCount++;
                                    if (successCount === selectedCount) {
                                        showPageNotification(`所有 ${successCount} 个文件处理完成`, 'success', 5000);
                                    }
                                });
                                return;
                            }
                        }
                    }
                    
                    // 不是FC2格式或者提取FC2编号失败，尝试常规番号提取
                    let fh = getVideoCode(file_name);
                    if (fh) {
                        // 校验是否是中文字幕
                        let chineseCaptions = checkChineseCaptions(fh, file_name);
                        let Uncensored = checkUncensored(fh, file_name);
                        // 执行查询
                        call(fid, fh, suffix, chineseCaptions, Uncensored, addDate, function() {
                            // 成功回调
                            successCount++;
                            // 如果所有文件都处理完毕，显示总结通知
                            if (successCount === selectedCount) {
                                showPageNotification(`所有 ${successCount} 个文件处理完成`, 'success', 5000);
                            }
                        });
                    } else {
                        console.log("无法从文件名中提取到番号: " + file_name);
                    }
                }
            });
    }
    
    /**
     * 提取FC2编号
     * @param title 文件名或番号
     * @returns {string|null} FC2编号，如果不是FC2格式则返回null
     */
    function extractFC2Number(title) {
        // 格式1: FC2-PPV-1234567
        let match = title.match(/FC2[-\s]?PPV[-\s]?(\d{5,7})/i);
        if (match && match[1]) {
            return match[1];
        }
        
        // 格式2: FC2PPV_1234567 或 FC2PPV-1234567
        match = title.match(/FC2PPV[_-]?(\d{5,7})/i);
        if (match && match[1]) {
            return match[1];
        }
        
        // 格式3: 单纯的FC2 1234567
        match = title.match(/FC2\s+(\d{5,7})/i);
        if (match && match[1]) {
            return match[1];
        }
        
        // 格式4: 单纯的PPV-1234567
        match = title.match(/PPV[-_\s]?(\d{5,7})/i);
        if (match && match[1]) {
            return match[1];
        }
        
        return null;
    }
    
    /**
     * 多网站轮询查询重命名
     * 先尝试javbus，然后javdb，对于FC2-PPV格式尝试fc2ppvdb
     */
    function rename_multi(fid, fh, suffix, chineseCaptions, Uncensored, addDate, callback) {
        console.log("开始多网站轮询查询: " + fh);
        
        // 检查番号是否为FC2格式
        let isFC2 = /FC2/i.test(fh) || /^PPV-\d{5,7}$/i.test(fh);
        
        if (isFC2) {
            // 提取FC2编号
            let fc2Number;
            if (/FC2/i.test(fh)) {
                fc2Number = extractFC2Number(fh);
            } else if (/^PPV-(\d{5,7})$/i.test(fh)) {
                // 处理PPV-XXXXX格式
                let ppvMatch = fh.match(/^PPV-(\d{5,7})$/i);
                fc2Number = ppvMatch ? ppvMatch[1] : null;
            }
            
            if (fc2Number) {
                console.log("检测到FC2格式，提取编号: " + fc2Number);
                requestFC2(fid, fh, suffix, chineseCaptions, Uncensored, addDate, fc2Number, callback);
                return;
            }
        }
        
        // 首先尝试javbus
        requestMultiSource(fid, fh, suffix, chineseCaptions, Uncensored, addDate, callback, "javbus");
    }
    
    /**
     * 多来源查询处理
     * @param fid 文件ID
     * @param fh 番号
     * @param suffix 后缀
     * @param chineseCaptions 是否有中文字幕
     * @param Uncensored 是否无码
     * @param addDate 是否添加日期
     * @param callback 回调函数
     * @param source 当前尝试的来源
     */
    function requestMultiSource(fid, fh, suffix, chineseCaptions, Uncensored, addDate, callback, source) {
        if (source === "javbus") {
            console.log("尝试使用javbus查询: " + fh);
            // 使用javbus查询，如果失败则尝试javdb
            requestJavbus(fid, fh, suffix, chineseCaptions, Uncensored, addDate, javbusDirectAccess, function() {
                // 成功回调
                if (typeof callback === 'function') {
                    callback();
                }
            }, 0, function() {
                // 失败回调，尝试javdb
                console.log("javbus查询失败，尝试javdb: " + fh);
                requestMultiSource(fid, fh, suffix, chineseCaptions, Uncensored, addDate, callback, "javdb");
            });
        } else if (source === "javdb") {
            console.log("尝试使用javdb查询: " + fh);
            requestJavdb(fid, fh, suffix, chineseCaptions, Uncensored, addDate, callback);
        } else {
            // 所有来源都失败
            console.log("所有来源查询失败: " + fh);
            GM_notification(getDetails(fh, "所有来源查询失败"));
            showPageNotification(`无法在所有网站找到"${fh}"的信息`, 'error', 3000);
            if (typeof callback === 'function') {
                callback(); // 确保回调函数被执行
            }
        }
    }

    /**
     * 请求javbus,并请求115进行改名
     * @param fid               文件id
     * @param fh                番号
     * @param suffix            后缀
     * @param chineseCaptions   是否有中文字幕
     * @param Uncensored        是否无码
     * @param url               请求地址
     * @param addDate           是否添加时间
     * @param callback          成功回调
     * @param uncensoredAttempt 是否已尝试过无码查询
     * @param failCallback      失败回调
     */
    function requestJavbus(fid, fh, suffix, chineseCaptions, Uncensored, addDate, url, callback, uncensoredAttempt = 0, failCallback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url + fh,
            onload: xhr => {
                // 匹配标题
                let response = $(xhr.responseText);

                // 尝试不同方式获取标题
                let title = null;
                
                // 方法1: 从详情页面的标题获取
                let h3Title = response.find("h3");
                if (h3Title.length > 0) {
                    title = h3Title.text().trim();
                    // 删除番号部分（如果有），保留后面的标题
                    if (title.toUpperCase().indexOf(fh.toUpperCase()) === 0) {
                        title = title.substring(fh.length).trim();
                    }
                    console.log("从h3获取标题: " + title);
                }
                
                // 方法2: 如果方法1没有获取到标题，尝试从img标签获取
                if (!title || title.length === 0) {
                    title = response.find("div.photo-frame img").attr("title");
                    console.log("从img标签title属性获取标题: " + title);
                }
                
                // 方法3: 如果前两种方法都失败，尝试获取页面标题
                if (!title || title.length === 0) {
                    title = response.find("title").text().trim();
                    // 清理标题中可能的额外信息
                    if (title.indexOf(" - JavBus") > 0) {
                        title = title.substring(0, title.indexOf(" - JavBus")).trim();
                    }
                    if (title.toUpperCase().indexOf(fh.toUpperCase()) === 0) {
                        title = title.substring(fh.length).trim();
                    }
                    console.log("从页面title获取标题: " + title);
                }

                // 时间
                let date = response.find("div.photo-info date:last").html();
                
                // 如果无法通过 date:last 获取日期，尝试其他方法
                if (!date) {
                    console.log("未找到日期，尝试其他方法获取");
                    
                    // 方法1: 查找带有日期标识的元素
                    let dateLabel = response.find("p.header:contains('発売日:')").next("p");
                    if (dateLabel.length > 0) {
                        date = dateLabel.text().trim();
                        console.log("从日期标签获取到日期: " + date);
                    }
                    
                    // 方法2: 查找所有日期格式的文本
                    if (!date) {
                        let allText = response.text();
                        let dateMatch = allText.match(/\d{4}-\d{2}-\d{2}/);
                        if (dateMatch) {
                            date = dateMatch[0];
                            console.log("从页面文本匹配到日期: " + date);
                        }
                    }
                } else {
                    console.log("找到日期: " + date);
                }

                if (title && title.length > 0) {
                    console.log("最终使用标题: " + title);
                    // 构建新名称
                    let newName = buildNewName(fh, suffix, chineseCaptions, Uncensored, title);

                    // 添加时间
                    if (addDate && date) {
                        // 标准化日期格式为YYYY-MM-DD
                        if (date.match(/\d{4}-\d{2}-\d{2}/)) {
                            // 已经是标准格式
                            newName = date + "_" + newName;
                        } else if (date.match(/\d{4}\/\d{2}\/\d{2}/)) {
                            // 转换斜杠格式为连字符格式
                            newName = date.replace(/\//g, "-") + "_" + newName;
                        } else {
                            // 其他格式，尝试提取数字
                            let numbers = date.match(/\d+/g);
                            if (numbers && numbers.length >= 3) {
                                let year = numbers[0].length === 4 ? numbers[0] : "20" + numbers[0];
                                let month = numbers[1].padStart(2, "0");
                                let day = numbers[2].padStart(2, "0");
                                let formattedDate = `${year}-${month}-${day}`;
                                console.log("格式化日期: " + date + " -> " + formattedDate);
                                newName = formattedDate + "_" + newName;
                            } else {
                                // 无法格式化，使用原始日期
                        newName = date + "_" + newName;
                            }
                        }
                        console.log("添加日期后的文件名: " + newName);
                    }

                    if (newName) {
                        // 修改名称
                        send_115(fid, newName, fh, callback);
                    }
                } else if (url !== javbusUncensoredBase && uncensoredAttempt === 0) {
                    // 如果当前不是无码站点且未尝试过无码查询，则尝试一次无码查询
                    console.log("未找到标题，尝试一次无码页面查询: " + fh);
                    requestJavbus(fid, fh, suffix, chineseCaptions, Uncensored, addDate, javbusUncensoredBase, callback, 1, failCallback);
                } else {
                    // 已经尝试过无码查询或当前就是无码查询，尝试下一个来源
                    console.log("javbus查询尝试完毕，无法获取标题: " + fh);
                    
                    if (typeof failCallback === 'function') {
                        failCallback(); // 执行失败回调，尝试下一个来源
                    } else if (typeof callback === 'function') {
                        callback(); // 确保回调函数被执行
                    }
                }
            },
            onerror: xhr => {
                console.log("javbus请求失败: ", xhr);
                
                if (typeof failCallback === 'function') {
                    failCallback(); // 执行失败回调，尝试下一个来源
                } else if (typeof callback === 'function') {
                    callback(); // 确保回调函数被执行
                }
            }
        })
    }

    /**
     * 请求FC2PPV DB获取标题信息
     */
    function requestFC2(fid, fh, suffix, chineseCaptions, Uncensored, addDate, fc2Number, callback) {
        console.log("请求FC2PPV DB: " + fc2Number);
        
        // 构建查询URL
        const fc2Url = fc2ppvdbBase + fc2Number;
        console.log("FC2查询URL: " + fc2Url);
        
        // 显示查询进度通知
        showPageNotification(`正在从FC2PPVDB查询: ${fc2Number}`, 'info', 2000);
        
        GM_xmlhttpRequest({
            method: "GET",
            url: fc2Url,
            timeout: 10000, // 10秒超时
            onload: xhr => {
                try {
                    if (xhr.status !== 200) {
                        console.log(`FC2PPV DB请求返回非200状态码: ${xhr.status}`);
                        handleFC2Error(fid, fh, suffix, chineseCaptions, Uncensored, addDate, fc2Number, callback, "查询返回非200状态码");
                        return;
                    }
                    
                    let response = $(xhr.responseText);
                    
                    // 查找标题元素
                    let title = null;
                    let articleLink = response.find('a[href*="adult.contents.fc2.com"]');
                    
                    if (articleLink.length > 0) {
                        title = articleLink.text().trim();
                        console.log("从FC2PPV DB获取到标题: " + title);
                    }
                    
                    // 如果没有找到标题，尝试其他方法
                    if (!title || title.length === 0) {
                        // 尝试找到页面标题
                        title = response.find("title").text().trim();
                        if (title.includes(" - FC2PPVDB")) {
                            title = title.replace(" - FC2PPVDB", "").trim();
                        }
                        console.log("从页面标题获取标题: " + title);
                    }
                    
                    // 如果仍然没有找到标题，尝试找到任何链接或标题类元素
                    if (!title || title.length === 0) {
                        let possibleElements = response.find("h1, h2, h3, a.title");
                        if (possibleElements.length > 0) {
                            title = possibleElements.first().text().trim();
                            console.log("从其他元素获取到标题: " + title);
                        }
                    }
                    
                    // 仔细检查页面内容是否包含没有找到项目的提示
                    let pageText = response.text();
                    if (pageText.includes("No articles found") || pageText.includes("没有找到相关项目") || pageText.includes("Not Found")) {
                        console.log("FC2PPV DB页面显示未找到内容");
                        handleFC2Error(fid, fh, suffix, chineseCaptions, Uncensored, addDate, fc2Number, callback, "未找到该FC2编号的内容");
                        return;
                    }
                    
                    // 查找日期信息
                    let date = null;
                    let dateElement = response.find("time");
                    if (dateElement.length > 0) {
                        date = dateElement.attr("datetime") || dateElement.text().trim();
                        console.log("找到日期信息: " + date);
                        
                        // 尝试格式化日期
                        if (date) {
                            let dateMatch = date.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
                            if (dateMatch) {
                                date = `${dateMatch[1]}-${dateMatch[2].padStart(2, '0')}-${dateMatch[3].padStart(2, '0')}`;
                                console.log("格式化日期: " + date);
                            }
                        }
                    }
                    
                    if (title && title.length > 0) {
                        // 构建标准FC2番号格式
                        let standardFC2 = "FC2-PPV-" + fc2Number;
                        console.log("标准化FC2番号: " + standardFC2);
                        
                        // 构建新名称
                        let newName = buildNewName(standardFC2, suffix, chineseCaptions, Uncensored, title);
                        
                        // 添加时间
                        if (addDate && date) {
                            newName = date + "_" + newName;
                            console.log("添加日期后的文件名: " + newName);
                        }
                        
                        if (newName) {
                            // 修改名称
                            send_115(fid, newName, standardFC2, callback);
                            return;
                        } else {
                            // 找到标题但构建名称失败
                            console.log("构建名称失败");
                            handleFC2Error(fid, fh, suffix, chineseCaptions, Uncensored, addDate, fc2Number, callback, "构建文件名失败");
                        }
                    } else {
                        // 没有找到标题
                        console.log("FC2PPV DB未找到标题");
                        handleFC2Error(fid, fh, suffix, chineseCaptions, Uncensored, addDate, fc2Number, callback, "未找到标题信息");
                    }
                } catch (e) {
                    console.log("处理FC2PPV DB响应出错: ", e);
                    handleFC2Error(fid, fh, suffix, chineseCaptions, Uncensored, addDate, fc2Number, callback, "处理响应出错: " + e.message);
                }
            },
            onerror: xhr => {
                console.log("FC2PPV DB请求失败: ", xhr);
                // 检查是否是因为@connect权限问题
                let errorMsg = xhr.error || xhr.toString();
                if (errorMsg.includes("@connect") || errorMsg.includes("Refused to connect")) {
                    handleFC2Error(fid, fh, suffix, chineseCaptions, Uncensored, addDate, fc2Number, callback, 
                                  "fc2ppvdb.com不在@connect列表中，请更新脚本或在Tampermonkey设置中添加该域名", true);
                } else {
                    handleFC2Error(fid, fh, suffix, chineseCaptions, Uncensored, addDate, fc2Number, callback, "请求失败");
                }
            },
            ontimeout: () => {
                console.log("FC2PPV DB请求超时");
                handleFC2Error(fid, fh, suffix, chineseCaptions, Uncensored, addDate, fc2Number, callback, "请求超时");
            }
        });
    }
    
    /**
     * 处理FC2查询错误
     * 对于FC2文件，如果查询失败，不再尝试其他网站
     */
    function handleFC2Error(fid, fh, suffix, chineseCaptions, Uncensored, addDate, fc2Number, callback, errorMsg, isConnectError = false) {
        let standardFC2 = "FC2-PPV-" + fc2Number;
        
        // 如果是@connect错误，给出特殊提示
        if (isConnectError) {
            let notificationMsg = `${standardFC2}: ${errorMsg}`;
            console.log(notificationMsg);
            GM_notification(getDetails(notificationMsg, "FC2查询失败-权限问题"));
            showPageNotification(notificationMsg, 'error', 8000);
            
            // 显示详细说明
            let connectHelp = "请在Tampermonkey脚本设置中添加@connect和@domain: fc2ppvdb.com，或更新脚本版本。";
            console.log(connectHelp);
            showPageNotification(connectHelp, 'info', 10000);
            
            if (typeof callback === 'function') {
                callback(); // 确保回调函数被执行
            }
            return;
        }
        
        // 普通错误处理
        let notificationMsg = `${standardFC2}: ${errorMsg}`;
        console.log(notificationMsg);
        GM_notification(getDetails(standardFC2, "FC2查询失败"));
        showPageNotification(notificationMsg, 'error', 5000);
        
        // 对于FC2文件，查询失败就不再尝试其他网站，直接返回
        if (typeof callback === 'function') {
            callback(); // 确保回调函数被执行
        }
    }
    
    /**
     * 请求javdb获取标题信息
     */
    function requestJavdb(fid, fh, suffix, chineseCaptions, Uncensored, addDate, callback) {
        console.log("请求JavDB: " + fh);
        
        // 构建搜索URL
        const searchUrl = javdbSearchBase + fh;
        
        GM_xmlhttpRequest({
            method: "GET",
            url: searchUrl,
            onload: xhr => {
                try {
                    // 解析搜索结果页面
                let response = $(xhr.responseText);
                    
                    // 查找第一个搜索结果
                    let firstResult = response.find('.movie-list .item').first();
                    if (firstResult.length > 0) {
                        // 获取详情页链接
                        let detailLink = firstResult.find('a.box').attr('href');
                        if (detailLink) {
                            // 确保链接是完整的URL
                            if (detailLink.startsWith('/')) {
                                detailLink = javdbDirectAccess + detailLink.substring(1);
                            }
                            
                            console.log("获取到详情页链接: " + detailLink);
                            
                            // 请求详情页
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: detailLink,
                                onload: detailXhr => {
                                    try {
                                        let detailResponse = $(detailXhr.responseText);
                                        
                                        // 获取标题
                                        let title = null;
                                        
                                        // 方法1: 从h2标签获取
                                        let h2Title = detailResponse.find('h2.title');
                                        if (h2Title.length > 0) {
                                            title = h2Title.text().trim();
                                            console.log("从h2获取标题: " + title);
                                        }
                                        
                                        // 方法2: 从页面标题获取
                                        if (!title || title.length === 0) {
                                            title = detailResponse.find('title').text().trim();
                                            if (title.includes(" - JavDB")) {
                                                title = title.replace(" - JavDB", "").trim();
                                            }
                                            console.log("从页面标题获取标题: " + title);
                                        }
                                        
                                        // 获取日期
                                        let date = null;
                                        
                                        // 方法1: 查找含有发行日期的元素
                                        let dateElements = detailResponse.find('.panel-block .value');
                                        dateElements.each(function() {
                                            let text = $(this).text().trim();
                                            let dateMatch = text.match(/(\d{4}-\d{2}-\d{2})/);
                                            if (dateMatch) {
                                                date = dateMatch[0];
                                                console.log("找到日期信息: " + date);
                                                return false; // 找到日期后停止循环
                                            }
                                        });
                                        
                                        // 方法2: 在整个页面文本中查找日期格式
                                        if (!date) {
                                            let pageText = detailResponse.text();
                                            let dateMatch = pageText.match(/(\d{4}-\d{2}-\d{2})/);
                                            if (dateMatch) {
                                                date = dateMatch[0];
                                                console.log("从页面文本中匹配到日期: " + date);
                                            }
                                        }
                                        
                                        if (title && title.length > 0) {
                                            // 处理标题中可能存在的番号前缀
                                            if (title.toUpperCase().indexOf(fh.toUpperCase()) === 0) {
                                                title = title.substring(fh.length).trim();
                                                console.log("移除番号前缀后的标题: " + title);
                                            }
                                            
                        // 构建新名称
                                            let newName = buildNewName(fh, suffix, chineseCaptions, Uncensored, title);

                        // 添加时间
                        if (addDate && date) {
                            newName = date + "_" + newName;
                                                console.log("添加日期后的文件名: " + newName);
                        }

                        if (newName) {
                            // 修改名称
                                                send_115(fid, newName, fh, callback);
                                                return;
                                            }
                                        }
                                        
                                        // 如果找不到有效信息，通知失败
                                        console.log("JavDB详情页没有找到有效信息");
                                        GM_notification(getDetails(fh, "JavDB未找到有效信息"));
                                        if (typeof callback === 'function') {
                                            callback();
                                        }
                                        
                                    } catch (e) {
                                        console.log("处理JavDB详情页响应出错: ", e);
                                        GM_notification(getDetails(fh, "处理JavDB详情页出错"));
                                        if (typeof callback === 'function') {
                                            callback();
                                        }
                                    }
                                },
                                onerror: err => {
                                    console.log("JavDB详情页请求失败: ", err);
                                    GM_notification(getDetails(fh, "JavDB详情页请求失败"));
                                    if (typeof callback === 'function') {
                                        callback();
                                    }
                                }
                            });
                        } else {
                            console.log("未找到详情页链接");
                            GM_notification(getDetails(fh, "JavDB未找到详情页链接"));
                            if (typeof callback === 'function') {
                                callback();
                            }
                        }
                    } else {
                        console.log("JavDB搜索结果为空");
                        GM_notification(getDetails(fh, "JavDB搜索结果为空"));
                        if (typeof callback === 'function') {
                            callback();
                        }
                    }
                    
                } catch (e) {
                    console.log("处理JavDB搜索响应出错: ", e);
                    GM_notification(getDetails(fh, "处理JavDB搜索结果出错"));
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            },
            onerror: xhr => {
                console.log("JavDB搜索请求失败: ", xhr);
                GM_notification(getDetails(fh, "JavDB搜索请求失败"));
                if (typeof callback === 'function') {
                    callback();
                }
            }
        });
    }

    /**
     * 构建新名称
     * @param fh                番号
     * @param suffix            后缀
     * @param chineseCaptions   是否有中文字幕
     * @param title             番号标题
     * @returns {string}        新名称
     */
    function buildNewName(fh, suffix, chineseCaptions, Uncensored, title) {
        if (title) {
            let newName = String(fh);
            // 有中文字幕
            if (chineseCaptions) {
                newName = newName + "【中文字幕】";
            }
            // 有无码
            if (Uncensored) {
                newName = newName + "【无码】";
            }
            // 拼接标题
            newName = newName + " " + title;
            if (suffix) {
                // 文件保存后缀名
                newName = newName + suffix;
            }
            return newName;
        }
    }

    /**
     * 请求115接口
     * @param id 文件id
     * @param name 要修改的名称
     * @param fh 番号
     * @param callback 成功回调
     */
    function send_115(id, name, fh, callback) {
        let file_name = stringStandard(name);
        $.post("https://webapi.115.com/files/edit", {
                fid: id,
                file_name: file_name
            },
            function (data, status) {
                let result = JSON.parse(data);
                if (!result.state) {
                    GM_notification(getDetails(fh, "修改失败"));
                    showPageNotification(`${fh} 修改失败: ${result.error}`, 'error', 3000);
                    console.log("请求115接口异常: " + unescape(result.error
                        .replace(/\\(u[0-9a-fA-F]{4})/gm, '%$1')));
                } else {
                    GM_notification(getDetails(fh, "修改成功"));
                    showPageNotification(`${fh} 修改成功`, 'success', 2000);
                    console.log("修改文件名称,fh:" + fh, "name:" + file_name);
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            }
        );
    }

    /**
     * 通知参数
     * @param text 内容
     * @param title 标题
     * @returns {{text: *, title: *, timeout: number}}
     */
    function getDetails(text, title) {
        return {
            text: text,
            title: title,
            timeout: 1000
        };
    }

    /**
     * 115名称不接受(\/:*?\"<>|)
     * @param name
     */
    function stringStandard(name) {
        return name.replace(/\\/g, "")
            .replace(/\//g, " ")
            .replace(/:/g, " ")
            .replace(/\?/g, " ")
            .replace(/"/g, " ")
            .replace(/</g, " ")
            .replace(/>/g, " ")
            .replace(/\|/g, "")
            .replace(/\*/g, " ");
    }

    /**
     * 校验是否为中文字幕
     * @param fh    番号
     * @param title 标题
     */
    function checkChineseCaptions(fh, title) {
        if (title.indexOf("中文") !== -1) {
            return true;
        }
        let regExp = new RegExp(fh + "[_-](UC|C)");
        let match = title.toUpperCase().match(regExp);
        if (match) {
            return true;
        }
    }
    /**
     * 校验是否为无码
     * @param fh    番号
     * @param title 标题
     */
	function checkUncensored(fh, title) {
         if (title.indexOf("无码") !== -1) {
            return true;
        }
		let regExp = new RegExp(fh + "[_-](UC|U)");
		let match = title.toUpperCase().match(regExp);
		if (match) {
			return true; // 如果标题中包含 "-U" 或 "_U"，则返回 true，表示为无码
		}
		return false; // 默认情况下，返回 false，表示不是无码
	}
    /**
     * 获取番号
     * @param title         源标题
     * @returns {string}    提取的番号
     */
    function getVideoCode(title) {
        // 排除明显的非番号格式，如单纯的文件格式或编码格式
        const nonAvCodes = ["MP4", "MKV", "AVI", "RMVB", "WMV", "MOV", "FLV", 
                            "X264", "X265", "HEVC", "H264", "H265", "AAC", "MP3"];
        
        // 常见的后缀，需要在提取番号时移除
        const commonSuffixes = ["UC", "C", "U", "字幕"];
        
        // 处理域名前缀
        title = title.replace(/^[a-zA-Z0-9-]+\.(com|net|org|info|xyz|cc|me|tv|io)@/i, "");
        
        title = title.toUpperCase().replace("SIS001", "")
            .replace("1080P", "")
            .replace("720P", "");

        console.log("处理文件名: " + title);
        
        // 预处理：移除末尾的常见后缀
        let cleanTitle = title;
        for (let suffix of commonSuffixes) {
            let suffixPattern = new RegExp(`[-\\s_]*${suffix}\\s*$`, 'i');
            cleanTitle = cleanTitle.replace(suffixPattern, '');
        }
        
        // 移除多余的空格，简化后续处理
        cleanTitle = cleanTitle.replace(/\s+/g, ' ').trim();
        
        if (cleanTitle !== title) {
            console.log("预处理后的文件名: " + cleanTitle);
        }
        
        // 优先检查FC2格式
        // FC2-PPV-1234567 或其他FC2变种格式
        let fc2Match = cleanTitle.match(/FC2[-\s]?PPV[-\s]?(\d{5,7})/i) || 
                       cleanTitle.match(/FC2PPV[_-]?(\d{5,7})/i) ||
                       cleanTitle.match(/FC2\s+(\d{5,7})/i);
                        
        if (fc2Match && fc2Match[1]) {
            let fc2Code = "FC2-PPV-" + fc2Match[1];
            console.log("找到FC2番号: " + fc2Code);
            return fc2Code;
        }

        // 改进常规AV番号格式匹配，允许模式中有空格
        // SONE- 101 -> SONE-101
        let t = cleanTitle.match(/([A-Z]{2,6})[-\s_]*(\d{2,5})/);
        if (t && t[1] && t[2]) {
            let code = t[1] + "-" + t[2];
            console.log("从带空格格式中提取番号: " + code);
            return code;
        }
        
        // 尝试传统匹配方式
        t = cleanTitle.match(/[A-Z]{2,6}[-_]?\d{2,5}/);
        
        if (!t) {
            // 日期+编号格式，如041117_510
            t = cleanTitle.match(/\d{6}_\d{3}/);
            if (t) {
                let code = t.toString();
                // 验证日期格式是否合理
                let month = parseInt(code.substring(0, 2));
                let day = parseInt(code.substring(2, 4));
                let year = parseInt(code.substring(4, 6));
                
                // 检查日期是否在合理范围内
                if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 0 && year <= 99) {
                    console.log("找到日期格式番号: " + code);
                    return code;
                }
            }
        }
        
        if (!t) {
            // 一本道格式
            t = cleanTitle.match(/1PONDO[-_]\d{6}[-_]\d{2,4}/);
            if (t) {
                t = t.toString().replace("1PONDO_", "")
                    .replace("1PONDO-", "");
            }
        }
        
        if (!t) {
            // HEYZO格式
            t = cleanTitle.match(/HEYZO[-_]?\d{4}/);
        }
        
        if (!t) {
            // 加勒比格式
            t = cleanTitle.match(/CARIB[-_]\d{6}[-_]\d{3}/);
            if (t) {
                t = t.toString().replace("CARIB-", "")
                    .replace("CARIB_", "");
            }
        }
        
        if (!t) {
            // 东京热格式
            t = cleanTitle.match(/N[-_]\d{4}/);
        }
        
        if (!t) {
            // FC2格式 (补充检查，以防前面的优先检查没有匹配到)
            t = cleanTitle.match(/FC2[-_]?(PPV)?[-_]?\d{6,7}/i);
            if (t) {
                // 提取FC2编号
                let fc2NumMatch = t.toString().match(/\d{6,7}/);
                if (fc2NumMatch) {
                    let fc2Code = "FC2-PPV-" + fc2NumMatch[0];
                    console.log("第二次检查找到FC2番号: " + fc2Code);
                    return fc2Code;
                }
            }
        }
        
        if (!t) {
            // T28系列
            t = cleanTitle.match(/T28[-_]\d{3,4}/);
        }
        
        if (!t) {
            // 通用格式：2-5个字母后跟3-5个数字
            t = cleanTitle.match(/[A-Z]{2,5}[-_]?\d{3,5}/);
        }
        
        if (!t) {
            // 日期类型番号，如210622-001
            t = cleanTitle.match(/\d{6}[-_]\d{2,4}/);
        }
        
        // 非常宽松的匹配逻辑，只在上面都匹配不到时使用
        if (!t) {
            // 任意字母+数字组合
            t = cleanTitle.match(/[A-Z]+\d{3,5}/);
        }
        
        // 处理提取到的番号
        if (t) {
            let code = t.toString();
            
            // 检查是否为已知的非番号字符串
            if (nonAvCodes.includes(code)) {
                console.log("跳过文件格式或编码格式: " + code);
                return null;
            }
            
            // 检查番号长度是否合理（4-15字符之间）
            if (code.length < 4) {
                console.log("提取的番号过短 (" + code.length + " 字符)，不是有效番号: " + code);
                return null;
            }
            
            if (code.length > 15) {
                console.log("提取的番号过长 (" + code.length + " 字符)，不是有效番号: " + code);
                return null;
            }
            
            // 额外检查：番号必须同时包含字母和数字（日期格式除外）
            if (!/\d{6}_\d{3}/.test(code) && (!/[A-Z]/i.test(code) || !/\d/.test(code))) {
                console.log("提取的番号格式不正确 (缺少字母或数字): " + code);
                return null;
            }
            
            // 格式化番号，确保查询成功率
            // 1. 移除下划线，替换为连字符
            code = code.replace(/_/g, "-");
            
            // 2. 如果番号中没有连字符但同时包含字母和数字，在字母和数字之间添加连字符
            // 例如: STARS265 -> STARS-265
            if (!code.includes("-")) {
                let letterPartMatch = code.match(/^([A-Z]+)/);
                let numberPartMatch = code.match(/(\d+)$/);
                
                if (letterPartMatch && numberPartMatch) {
                    let letterPart = letterPartMatch[1];
                    let numberPart = numberPartMatch[1];
                    
                    // 重新构建番号，确保字母和数字之间有连字符
                    if (code === letterPart + numberPart) {
                        let newCode = letterPart + "-" + numberPart;
                        console.log("格式化番号: " + code + " -> " + newCode);
                        code = newCode;
                    }
                }
            }
            
            console.log("找到番号: " + code + " (用于查询的URL: " + javbusBase + code + ")");
            return code;
        }
        
        // 没有匹配到任何番号格式
        console.log("未找到任何番号格式: " + title);
        return null;
    }
    
    /**
     * 执行归档到演员文件夹的功能
     */
    function archiveToActorFolder() {
        // 获取选中的文件数量
        let selectedCount = $("iframe[rel='wangpan']").contents().find("li.selected").length;
        let processedCount = 0;
        let successCount = 0;
        
        // 不再显示额外的归档根目录提示
        showPageNotification(`开始处理 ${selectedCount} 个项目...`, 'info', 3000);
        
        // 获取所有已选择的文件
        $("iframe[rel='wangpan']")
            .contents()
            .find("li.selected")
            .each(function (index, v) {
                let $item = $(v);
                // 原文件名称
                let file_name = $item.attr("title");
                // 文件类型
                let file_type = $item.attr("file_type");
                
                // 根据类型获取正确的ID
                let fid;
                if (file_type === "0") {
                    // 文件夹
                    fid = $item.attr("cate_id");
                    console.log("处理文件夹: " + file_name + ", ID: " + fid);
                    
                    // 从文件夹名称中提取番号
                    let fh = getVideoCode(file_name);
                    if (fh) {
                        console.log("从文件夹名称中提取到番号: " + fh);
                        // 使用与文件相同的逻辑处理文件夹
                        requestJavbusForActor(fid, fh, function() {
                            processedCount++;
                            successCount++;
                            checkAllCompleted();
                        }, function() {
                            processedCount++;
                            checkAllCompleted();
                        });
                    } else {
                        console.log("无法从文件夹名称中提取番号: " + file_name);
                        showPageNotification(`无法从"${file_name}"提取番号`, 'error', 3000);
                        processedCount++;
                        checkAllCompleted();
                    }
                } else {
                    // 文件
                    fid = $item.attr("file_id");
                    
                    if (fid && file_name) {
                        let fh = getVideoCode(file_name);
                        if (fh) {
                            // 执行查询演员并归档
                            requestJavbusForActor(fid, fh, function() {
                                processedCount++;
                                successCount++;
                                checkAllCompleted();
                            }, function() {
                                processedCount++;
                                checkAllCompleted();
                            });
                        } else {
                            console.log("无法从文件名称中提取番号: " + file_name);
                            showPageNotification(`无法从"${file_name}"提取番号`, 'error', 3000);
                            processedCount++;
                            checkAllCompleted();
                        }
                    } else {
                        processedCount++;
                        checkAllCompleted();
                    }
                }
            });
            
        // 检查是否所有文件都处理完毕
        function checkAllCompleted() {
            if (processedCount === selectedCount) {
                if (successCount > 0) {
                    showPageNotification(`处理完成: ${successCount}/${selectedCount} 个项目成功处理`, 'success', 5000);
                } else {
                    showPageNotification(`处理完成: 没有成功处理的项目`, 'info', 5000);
                }
            }
        }
    }

    /**
     * 请求javbus获取演员信息并归档
     * @param fid 文件id
     * @param fh  番号
     * @param successCallback 成功回调
     * @param failCallback 失败回调
     */
    function requestJavbusForActor(fid, fh, successCallback, failCallback) {
        console.log("开始查询番号演员信息: " + fh);
        GM_xmlhttpRequest({
            method: "GET",
            url: javbusDirectAccess + fh,
            onload: xhr => {
                // 分析返回的HTML内容
                let response = $(xhr.responseText);
                console.log("获取到javbus页面内容，开始查找演员信息");
                
                // 打印页面中的演员相关HTML，用于调试
                let actorElements = response.find("span.genre");
                console.log("找到潜在演员元素数量: " + actorElements.length);
                
                // 查找所有演员元素
                let actresses = [];
                actorElements.each(function() {
                    let anchor = $(this).find("a[href*='/star/']");
                    if (anchor.length > 0) {
                        let actorName = anchor.text().trim();
                        let actorLink = anchor.attr("href");
                        console.log("找到演员: " + actorName + ", 链接: " + actorLink);
                        actresses.push({ name: actorName, link: actorLink });
                    }
                });
                
                if (actresses.length > 0) {
                    // 取第一个演员
                    let firstActress = actresses[0];
                    console.log("选择首位演员: " + firstActress.name + " 进行归档");
                    
                    // 查找或创建文件夹，然后移动文件
                    findOrCreateFolderAndMove(fid, firstActress.name, successCallback, failCallback);
                } else {
                    console.log("在有码页面未找到演员信息，尝试查询无码页面");
                    
                    if (javbusDirectAccess !== javbusUncensoredBase) {
                        // 尝试查询无码
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: javbusUncensoredBase + fh,
                            onload: xhrUnc => {
                                let responseUnc = $(xhrUnc.responseText);
                                console.log("获取到javbus无码页面内容，开始查找演员信息");
                                
                                // 打印页面中的演员相关HTML，用于调试
                                let actorElementsUnc = responseUnc.find("span.genre");
                                console.log("找到潜在演员元素数量(无码): " + actorElementsUnc.length);
                                
                                // 查找所有演员元素
                                let actressesUnc = [];
                                actorElementsUnc.each(function() {
                                    let anchor = $(this).find("a[href*='/star/']");
                                    if (anchor.length > 0) {
                                        let actorName = anchor.text().trim();
                                        let actorLink = anchor.attr("href");
                                        console.log("找到演员(无码): " + actorName + ", 链接: " + actorLink);
                                        actressesUnc.push({ name: actorName, link: actorLink });
                                    }
                                });
                                
                                if (actressesUnc.length > 0) {
                                    // 取第一个演员
                                    let firstActressUnc = actressesUnc[0];
                                    console.log("选择首位演员(无码): " + firstActressUnc.name + " 进行归档");
                                    
                                    // 查找或创建文件夹，然后移动文件
                                    findOrCreateFolderAndMove(fid, firstActressUnc.name, successCallback, failCallback);
                                } else {
                                    console.log("HTML内容: " + xhrUnc.responseText.substring(0, 500) + "...");
                                    GM_notification(getDetails(fh, "未找到演员信息"));
                                    console.log("在有码和无码页面均未找到演员信息: " + fh);
                                }
                            }
                        });
                    } else {
                        console.log("HTML内容: " + xhr.responseText.substring(0, 500) + "...");
                        GM_notification(getDetails(fh, "未找到演员信息"));
                        console.log("在有码页面未找到演员信息: " + fh);
                    }
                }
            },
            onerror: err => {
                console.log("请求javbus页面失败: ", err);
                GM_notification(getDetails(fh, "请求javbus页面失败"));
                showPageNotification(`请求javbus页面失败: ${fh}`, 'error', 3000);
                if (typeof failCallback === 'function') {
                    failCallback();
                }
            }
        });
    }
    
    /**
     * 查找或创建文件夹，然后移动文件
     * @param fid       文件id
     * @param actorName 演员名称
     * @param successCallback 成功回调
     * @param failCallback 失败回调
     */
    function findOrCreateFolderAndMove(fid, actorName, successCallback, failCallback) {
        console.log("开始查找或创建文件夹: " + actorName);
        
        // 使用保存的归档根目录ID，如果未设置则使用根目录
        let cid = archiveRootCid || ROOT_DIR_CID;
        let dirName = archiveRootName || "根目录";
        
        console.log("使用归档目录: " + dirName + " (CID: " + cid + ")");
        
        // 清理演员名称，确保不会因为特殊字符导致查询问题
        actorName = stringStandard(actorName);
        console.log("处理后的演员名称: " + actorName);
        
        // 首先检查目标文件夹下是否直接存在同名文件夹（列出所有子文件夹）
        $.get("https://webapi.115.com/files", {
            aid: 1,
            cid: cid,
            limit: 1000, // 获取足够多的文件/文件夹
            offset: 0,
            show_dir: 1,  // 只显示文件夹
            format: "json"
        }, function(listData) {
            let listResult = typeof listData === 'string' ? JSON.parse(listData) : listData;
            console.log("直接获取目录下的所有文件夹，开始查找匹配项");
            
            let folderFound = false;
            let targetCid = null;
            
            // 检查是否有匹配的文件夹
            if (listResult.state && listResult.data && listResult.data.length > 0) {
                console.log("发现 " + listResult.data.length + " 个文件/文件夹");
                
                // 遍历所有项目，查找匹配的文件夹 (使用some而不是forEach，可以在找到匹配项后立即中断)
                listResult.data.some(function(item) {
                    // 仅检查文件夹类型 - 115API中文件夹信息在'n'字段，不是'name'
                    // 文件夹类型可能通过'is_dir'或'm'为0或者存在'cid'而没有'fid'来判断
                    let isFolder = item.is_dir || (item.m === 0 && item.cid && !item.fid);
                    let folderName = item.n || item.name;
                    
                    if (isFolder && folderName === actorName) {
                        folderFound = true;
                        targetCid = item.cid;
                        console.log("找到完全匹配的文件夹(直接列表): " + folderName + ", ID: " + item.cid);
                        return true; // 找到匹配项，中断循环
                    }
                    return false; // 继续循环
                });
            }
            
            if (folderFound && targetCid) {
                // 文件夹存在，直接移动文件
                console.log("使用现有文件夹: " + actorName + ", ID: " + targetCid);
                moveFileToFolder(fid, targetCid, actorName, successCallback, failCallback);
            } else {
                // 如果直接列表没找到，再尝试搜索
                console.log("直接列表未找到，尝试使用搜索API查找: " + actorName);
                
                $.get("https://webapi.115.com/files/search", {
                    search_value: actorName,
                    format: "json",
                    aid: "1", // 搜索范围为115网盘
                    cid: cid, // 使用固定目录
                    file_type: "0", // 只搜索文件夹
                    limit: 1000
                }, function(data) {
                    let result = typeof data === 'string' ? JSON.parse(data) : data;
                    console.log("搜索文件夹结果，开始查找匹配项");
                    
                    let searchFolderFound = false;
                    let searchTargetCid = null;
                    
                    // 检查搜索结果
                    if (result.state && result.data && result.data.count > 0) {
                        console.log("找到 " + result.data.count + " 个可能的文件夹");
                        // 遍历搜索结果，查找完全匹配的文件夹 (使用some而不是forEach)
                        result.data.list.some(function(item) {
                            if (item.name === actorName && item.file_type === "0") {
                                searchFolderFound = true;
                                searchTargetCid = item.cid;
                                console.log("找到完全匹配的文件夹(搜索): " + item.name + ", ID: " + item.cid);
                                return true; // 找到匹配项，中断循环
                            }
                            return false; // 继续循环
                        });
                    }
                    
                    if (searchFolderFound && searchTargetCid) {
                        // 搜索找到了文件夹，使用它
                        console.log("搜索发现现有文件夹: " + actorName + ", ID: " + searchTargetCid);
                        moveFileToFolder(fid, searchTargetCid, actorName, successCallback, failCallback);
                    } else {
                        // 最后确认，再次检查目标文件夹是否存在
                        console.log("最终确认，检查文件夹是否存在: " + actorName);
                        
                        $.get("https://webapi.115.com/files", {
                            aid: 1,
                            cid: cid,
                            limit: 1000,
                            offset: 0,
                            show_dir: 1,
                            format: "json"
                        }, function(finalCheckData) {
                            let finalCheck = typeof finalCheckData === 'string' ? JSON.parse(finalCheckData) : finalCheckData;
                            
                            let finalFolderFound = false;
                            let finalTargetCid = null;
                            
                            // 最后一次检查文件夹是否存在
                            if (finalCheck.state && finalCheck.data && finalCheck.data.length > 0) {
                                // 使用some代替forEach
                                finalCheck.data.some(function(item) {
                                    // 同样更新此处的文件夹检测逻辑
                                    let isFolder = item.is_dir || (item.m === 0 && item.cid && !item.fid);
                                    let folderName = item.n || item.name;
                                    
                                    if (isFolder && folderName === actorName) {
                                        finalFolderFound = true;
                                        finalTargetCid = item.cid;
                                        console.log("最终确认找到文件夹: " + folderName + ", ID: " + item.cid);
                                        return true; // 找到匹配项，中断循环
                                    }
                                    return false; // 继续循环
                                });
                            }
                            
                            if (finalFolderFound && finalTargetCid) {
                                console.log("最终确认发现文件夹，使用它: " + actorName);
                                moveFileToFolder(fid, finalTargetCid, actorName, successCallback, failCallback);
                            } else {
                                // 文件夹确实不存在，创建新文件夹
                                console.log("多次确认后，确定需要创建新文件夹: " + actorName);
                                $.post("https://webapi.115.com/files/add", {
                                    pid: cid,
                                    cname: actorName
                                }, function(createData) {
                                    let createResult = typeof createData === 'string' ? JSON.parse(createData) : createData;
                                    console.log("创建文件夹结果: ", createResult);
                                    
                                    if (createResult.state) {
                                        // 获取新创建的文件夹cid
                                        let newFolderCid = createResult.cid;
                                        console.log("新文件夹创建成功，ID: " + newFolderCid);
                                        moveFileToFolder(fid, newFolderCid, actorName, successCallback, failCallback);
                                    } else {
                                        console.log("创建文件夹失败，响应码: " + createResult.errno + ", 错误: " + createResult.error);
                                        if (createResult.errno === 20004) {
                                            // 如果是"文件夹已存在"错误，尝试再次获取文件夹列表
                                            console.log("文件夹已存在错误，尝试最后一次查找");
                                            
                                            // 短暂延迟后再次尝试
                                            setTimeout(function() {
                                                $.get("https://webapi.115.com/files", {
                                                    aid: 1,
                                                    cid: cid,
                                                    limit: 1000,
                                                    offset: 0,
                                                    show_dir: 1,
                                                    format: "json"
                                                }, function(lastData) {
                                                    let lastCheck = typeof lastData === 'string' ? JSON.parse(lastData) : lastData;
                                                    
                                                    let foundFolder = null;
                                                    
                                                    if (lastCheck.state && lastCheck.data && lastCheck.data.length > 0) {
                                                        // 使用some代替forEach
                                                        lastCheck.data.some(function(item) {
                                                            // 同样更新此处的文件夹检测逻辑
                                                            let isFolder = item.is_dir || (item.m === 0 && item.cid && !item.fid);
                                                            let folderName = item.n || item.name;
                                                            
                                                            if (isFolder && folderName === actorName) {
                                                                foundFolder = item;
                                                                return true; // 找到匹配项，中断循环
                                                            }
                                                            return false; // 继续循环
                                                        });
                                                    }
                                                    
                                                    if (foundFolder) {
                                                        console.log("最后尝试成功找到文件夹: " + foundFolder.name + ", ID: " + foundFolder.cid);
                                                        moveFileToFolder(fid, foundFolder.cid, actorName, successCallback, failCallback);
                                                    } else {
                                                        GM_notification(getDetails(actorName, "无法找到或创建文件夹"));
                                                        console.log("所有尝试均失败，无法找到或创建文件夹: " + actorName);
                                                    }
                                                });
                                            }, 1000);
                                        } else {
                                            GM_notification(getDetails(actorName, "创建文件夹失败"));
                                            console.log("创建文件夹失败:", createResult);
                                        }
                                    }
                                }).fail(function(xhr) {
                                    console.log("创建文件夹请求失败: ", xhr.status, xhr.statusText);
                                    GM_notification(getDetails(actorName, "创建文件夹请求失败"));
                                });
                            }
                        }).fail(function(err) {
                            console.log("最终确认请求失败: ", err);
                            GM_notification(getDetails(actorName, "最终确认请求失败"));
                        });
                    }
                }).fail(function(err) {
                    console.log("搜索文件夹请求失败: ", err);
                    GM_notification(getDetails(actorName, "搜索文件夹失败"));
                });
            }
        }).fail(function(err) {
            console.log("列出文件夹请求失败: ", err);
            GM_notification(getDetails(actorName, "列出文件夹失败"));
        });
    }
    
    /**
     * 移动文件到指定文件夹
     * @param fid       文件id
     * @param targetCid 目标文件夹id
     * @param actorName 演员名称(用于通知)
     * @param successCallback 成功回调
     * @param failCallback 失败回调
     */
    function moveFileToFolder(fid, targetCid, actorName, successCallback, failCallback) {
        console.log("开始移动文件: " + fid + " 到文件夹: " + actorName + " (" + targetCid + ")");
        
        $.post("https://webapi.115.com/files/move", {
            pid: targetCid,
            fid: fid
        }, function(data) {
            let result = typeof data === 'string' ? JSON.parse(data) : data;
            console.log("移动文件结果: ", result);
            
            if (result.state) {
                GM_notification(getDetails(actorName, "归档成功"));
                showPageNotification(`文件成功归档到 ${actorName}`, 'success', 2000);
                console.log("文件已成功移动到: " + actorName);
                if (typeof successCallback === 'function') {
                    successCallback();
                }
            } else {
                // 检查是否是临时错误（如"尚未完成，请稍后再试"）
                let errorMsg = result.error || '未知错误';
                let isTemporaryError = errorMsg.includes('尚未完成') || 
                                      errorMsg.includes('请稍后再试') || 
                                      errorMsg.includes('队列已满');
                
                if (isTemporaryError) {
                    // 对于临时错误，只记录日志，不显示任何通知
                    console.log("移动文件处理中(临时状态):", errorMsg);
                    // 移除临时错误的通知
                    // showPageNotification(`归档到 ${actorName} 处理中: ${errorMsg}`, 'info', 3000);
                    
                    // 仍然调用成功回调，因为这类错误通常会在后台继续处理最终成功
                    if (typeof successCallback === 'function') {
                        successCallback();
                    }
                } else {
                    // 真正的错误才显示失败通知
                    GM_notification(getDetails(actorName, "归档失败"));
                    showPageNotification(`归档到 ${actorName} 失败: ${errorMsg}`, 'error', 3000);
                    console.log("移动文件失败:", result);
                    if (typeof failCallback === 'function') {
                        failCallback();
                    }
                }
            }
        }).fail(function(err) {
            console.log("移动文件请求失败: ", err);
            GM_notification(getDetails(actorName, "移动文件失败"));
            showPageNotification(`移动文件请求失败: ${err.statusText || '网络错误'}`, 'error', 3000);
            if (typeof failCallback === 'function') {
                failCallback();
            }
        });
    }

    /**
     * 获取javdb评分并更新115文件评分
     */
    function getJavdbRating() {
        // 获取选中的文件数量
        let selectedCount = $("iframe[rel='wangpan']").contents().find("li.selected").length;
        let processedCount = 0;
        let successCount = 0;
        
        showPageNotification(`开始处理 ${selectedCount} 个项目的评分...`, 'info', 3000);
        
        // 获取所有已选择的文件/文件夹
        $("iframe[rel='wangpan']")
            .contents()
            .find("li.selected")
            .each(function (index, v) {
                let $item = $(v);
                // 原文件名称
                let file_name = $item.attr("title");
                // 文件类型
                let file_type = $item.attr("file_type");
                
                // 根据类型获取正确的ID
                let fid;
                if (file_type === "0") {
                    // 文件夹
                    fid = $item.attr("cate_id");
                    console.log("处理文件夹评分: " + file_name + ", ID: " + fid);
                } else {
                    // 文件
                    fid = $item.attr("file_id");
                    console.log("处理文件评分: " + file_name + ", ID: " + fid);
                }

                if (fid && file_name) {
                    let fh = getVideoCode(file_name);
                    if (fh) {
                        // 执行查询评分
                        requestJavdbRating(fid, fh, file_name, function(success) {
                            processedCount++;
                            if (success) successCount++;
                            checkAllCompleted();
                        });
                    } else {
                        console.log("无法从名称中提取番号: " + file_name);
                        showPageNotification(`无法从"${file_name}"提取番号`, 'error', 3000);
                        processedCount++;
                        checkAllCompleted();
                    }
                } else {
                    processedCount++;
                    checkAllCompleted();
                }
            });
            
        // 检查是否所有文件都处理完毕
        function checkAllCompleted() {
            if (processedCount === selectedCount) {
                if (successCount > 0) {
                    showPageNotification(`评分处理完成: ${successCount}/${selectedCount} 个项目成功更新`, 'success', 5000);
                } else {
                    showPageNotification(`评分处理完成: 没有成功处理的项目`, 'info', 5000);
                }
            }
        }
    }
    
    /**
     * 请求javdb获取评分并更新115评分
     * @param fid 文件id
     * @param fh  番号
     * @param file_name 文件名
     * @param callback 回调函数，参数为是否成功
     */
    function requestJavdbRating(fid, fh, file_name, callback) {
        console.log("开始查询番号评分信息: " + fh);
        
        // 使用符合JavDB格式的搜索URL
        const searchUrl = javdbSearchBase + fh + "&f=all";
        console.log("使用搜索URL: " + searchUrl);
        
        GM_xmlhttpRequest({
            method: "GET",
            url: searchUrl,
            timeout: 10000, // 设置10秒超时
            onload: xhr => {
                let status = xhr.status;
                let responseText = xhr.responseText;
                
                if (status === 200) {
                    console.log("成功获取搜索页面，开始解析结果");
                    
                    try {
                        // 解析页面
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(responseText, "text/html");
                        
                        // 获取电影列表中的第一个项目
                        const firstItem = doc.querySelector('.movie-list .item');
                        if (firstItem) {
                            console.log("找到搜索结果的第一项");
                            
                            // 直接从item元素的score属性获取评分
                            const scoreAttr = firstItem.getAttribute('score');
                            if (scoreAttr) {
                                const rating = parseFloat(scoreAttr);
                                const userNum = firstItem.getAttribute('usernum') || '未知';
                                
                                if (!isNaN(rating)) {
                                    console.log(`获取到"${fh}"的评分: ${rating}分 (${userNum}人评价)`);
                                    
                                    // JavDB实际是5分满分制，115也是5分满分制，无需除以2转换
                                    let star115 = Math.round(rating);
                                    console.log(`转换评分: ${rating}，四舍五入为 ${star115}星`);
                                    update115Rating(fid, star115, fh, file_name, callback);
                                    return;
                                } else {
                                    console.log("评分格式不正确: " + scoreAttr);
                                }
                            } else {
                                console.log("未找到评分属性");
                                
                                // 尝试从评分文本中获取
                                const ratingElement = firstItem.querySelector('.score .value');
                                if (ratingElement) {
                                    const ratingText = ratingElement.textContent.trim();
                                    console.log("找到评分元素文本: " + ratingText);
                                    
                                    // 提取数字部分
                                    let ratingMatch = ratingText.match(/(\d+\.\d+)分/);
                                    if (ratingMatch && ratingMatch[1]) {
                                        const rating = parseFloat(ratingMatch[1]);
                                        console.log(`从评分文本提取到评分: ${rating}`);
                                        
                                        // JavDB实际是5分满分制，115也是5分满分制，无需除以2转换
                                        let star115 = Math.round(rating);
                                        console.log(`转换评分: ${rating}，四舍五入为 ${star115}星`);
                                        update115Rating(fid, star115, fh, file_name, callback);
                                        return;
                                    }
                                }
                            }
                            
                            // 如果没有在搜索结果中找到评分，获取详情页
                            const detailLink = firstItem.querySelector('a.box');
                            if (detailLink) {
                                const href = detailLink.getAttribute('href');
                                if (href) {
                                    const detailUrl = javdbBase + href.substring(1); // 去掉开头的斜杠
                                    console.log("获取到详情页链接: " + detailUrl);
                                    
                                    // 访问详情页获取评分
                                    GM_xmlhttpRequest({
                                        method: "GET",
                                        url: detailUrl,
                                        timeout: 10000,
                                        onload: detailXhr => {
                                            if (detailXhr.status === 200) {
                                                processJavdbRating(fid, fh, detailXhr.responseText, file_name, callback);
                                            } else {
                                                console.log("无法获取详情页: " + fh);
                                                showPageNotification(`无法获取"${fh}"的详情页`, 'error', 3000);
                                                callback(false);
                                            }
                                        },
                                        onerror: err => {
                                            console.log("请求详情页失败: ", err);
                                            let errorMsg = "未知错误";
                                            if (err.error) {
                                                errorMsg = err.error.substring(0, 100);
                                            }
                                            showPageNotification(`请求"${fh}"详情页失败: ${errorMsg}`, 'error', 3000);
                                            callback(false);
                                        },
                                        ontimeout: () => {
                                            console.log("请求详情页超时");
                                            showPageNotification(`请求"${fh}"详情页超时`, 'error', 3000);
                                            callback(false);
                                        }
                                    });
                                    return;
                                }
                            }
                        } else {
                            // 尝试找到任何电影列表项目
                            const anyMovieItem = doc.querySelector('.movie-list .item, div[class*="movie-list"] .item, div[id="waterfall"] .item');
                            if (anyMovieItem) {
                                console.log("找到替代的搜索结果项");
                                
                                // 直接从item元素的score属性获取评分
                                const scoreAttr = anyMovieItem.getAttribute('score');
                                if (scoreAttr) {
                                    const rating = parseFloat(scoreAttr);
                                    const userNum = anyMovieItem.getAttribute('usernum') || '未知';
                                    
                                    if (!isNaN(rating)) {
                                        console.log(`获取到"${fh}"的评分: ${rating}分 (${userNum}人评价)`);
                                        
                                        // JavDB实际是5分满分制，115也是5分满分制，无需除以2转换
                                        let star115 = Math.round(rating);
                                        console.log(`转换评分: ${rating}，四舍五入为 ${star115}星`);
                                        update115Rating(fid, star115, fh, file_name, callback);
                                        return;
                                    }
                                }
                            }
                            
                            console.log("未找到搜索结果");
                            showPageNotification(`"${fh}"在JavDB中未找到搜索结果`, 'error', 3000);
                            callback(false);
                        }
                    } catch (e) {
                        console.log("解析搜索页面出错: ", e);
                        showPageNotification(`解析"${fh}"的搜索页面出错`, 'error', 3000);
                        callback(false);
                    }
                } else {
                    console.log("搜索请求失败: " + status);
                    showPageNotification(`搜索"${fh}"失败，状态码: ${status}`, 'error', 3000);
                    callback(false);
                }
            },
            onerror: err => {
                console.log("请求javdb页面失败: ", err);
                let errorMsg = "未知错误";
                if (err.error) {
                    // 如果错误中包含域名不在@connect列表，给出明确提示
                    if (err.error.indexOf("This domain is not a part of the @connect list") !== -1) {
                        errorMsg = "JavDB域名未在@connect列表中，请更新脚本或添加域名到@connect";
                        showPageNotification("需要在脚本设置中允许访问JavDB，请检查@connect设置", 'error', 5000);
                    } else {
                        errorMsg = err.error.substring(0, 100);
                    }
                }
                
                console.log("请求错误详情: ", errorMsg);
                showPageNotification(`请求"${fh}"的JavDB页面失败: ${errorMsg}`, 'error', 3000);
                callback(false);
            },
            ontimeout: () => {
                console.log("请求javdb页面超时");
                showPageNotification(`请求"${fh}"的JavDB页面超时`, 'error', 3000);
                callback(false);
            }
        });
    }
    
    /**
     * 处理JavDB页面内容，提取评分并更新115
     * @param fid 文件id
     * @param fh 番号
     * @param responseText 页面内容
     * @param file_name 文件名
     * @param callback 回调函数
     */
    function processJavdbRating(fid, fh, responseText, file_name, callback) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(responseText, "text/html");
            
            // 尝试多种选择器来定位评分元素
            let ratingText = null;
            let ratingElement = null;
            
            // 方法1: 查找评分区域
            ratingElement = doc.querySelector('.panel-block .value');
            if (ratingElement) {
                ratingText = ratingElement.textContent.trim();
                console.log("方法1找到评分: " + ratingText);
            }
            
            // 方法2: 查找带有"分"字的元素
            if (!ratingText) {
                const allElements = doc.querySelectorAll('*');
                for (const element of allElements) {
                    const text = element.textContent.trim();
                    if (text.match(/\d+\.\d+分/) && text.indexOf('評價') > 0) {
                        ratingText = text;
                        console.log("方法2找到评分: " + ratingText);
                        break;
                    }
                }
            }
            
            // 方法3: 直接在HTML中查找评分模式
            if (!ratingText) {
                const ratingMatch = responseText.match(/(\d+\.\d+)分, 由(\d+)人評價/);
                if (ratingMatch && ratingMatch[1]) {
                    ratingText = ratingMatch[0];
                    console.log("方法3找到评分: " + ratingText);
                }
            }
            
            if (ratingText) {
                // 从评分文本中提取数字
                const ratingMatch = ratingText.match(/(\d+\.\d+)分/);
                if (ratingMatch && ratingMatch[1]) {
                    const rating = parseFloat(ratingMatch[1]);
                    
                    if (!isNaN(rating)) {
                        console.log(`获取到"${fh}"的评分: ${rating}`);
                        
                        // JavDB实际是5分满分制，115也是5分满分制，无需除以2转换
                        let star115 = Math.round(rating);
                        console.log(`转换评分: ${rating}，四舍五入为 ${star115}星`);
                        update115Rating(fid, star115, fh, file_name, callback);
                        return;
                    }
                }
            }
            
            // 如果所有方法都失败
            console.log("页面内容中未找到有效评分信息");
            showPageNotification(`未能解析"${fh}"的评分信息`, 'error', 3000);
            callback(false);
            
        } catch (e) {
            console.log("处理评分页面出错: ", e);
            showPageNotification(`处理"${fh}"的评分页面出错`, 'error', 3000);
            callback(false);
        }
    }
    
    /**
     * 更新115文件评分
     * @param fid 文件id
     * @param star 评分（1-5）
     * @param fh 番号（用于通知）
     * @param file_name 文件名（用于日志）
     * @param callback 回调函数
     */
    function update115Rating(fid, star, fh, file_name, callback) {
        console.log(`开始更新评分: 文件ID=${fid}, 番号=${fh}, 评分=${star}星`);

        // 确保星级在1-5之间
        star = Math.max(1, Math.min(5, star));
        
        // 使用有效的评分API (备用API 1)
        $.ajax({
            url: "https://webapi.115.com/files/score",
            type: "POST",
            data: {
                file_id: fid,
                score: star
            },
            dataType: "json",
            success: function(result) {
                console.log("评分API响应:", JSON.stringify(result));
                
                if (result && result.state) {
                    console.log(`成功更新评分: ${fh}, 文件: ${file_name}, 评分: ${star}星`);
                    showPageNotification(`"${fh}"评分更新为${star}星`, 'success', 2000);
                    callback(true);
                } else {
                    // 尝试备用API
                    console.log(`第一个API评分失败: ${fh}, 错误信息:`, result);
                    console.log(`尝试备用API...`);
                    
                    // 尝试备用API (备用API 2)
                    $.ajax({
                        url: "https://webapi.115.com/files/edit_property",
                        type: "POST",
                        data: {
                            file_id: fid,
                            property: "score",
                            value: star
                        },
                        dataType: "json",
                        success: function(backupResult) {
                            console.log("备用API响应:", JSON.stringify(backupResult));
                            
                            if (backupResult && backupResult.state) {
                                console.log(`备用API成功更新评分: ${fh}`);
                                showPageNotification(`"${fh}"评分更新为${star}星`, 'success', 2000);
                                callback(true);
                            } else {
                                console.log("所有评分API尝试都失败");
                                showPageNotification(`"${fh}"评分更新失败，请尝试手动评分`, 'error', 3000);
                                callback(false);
                            }
                        },
                        error: function() {
                            console.log("备用API请求失败");
                            showPageNotification(`"${fh}"评分更新失败，请尝试手动评分`, 'error', 3000);
                            callback(false);
                        }
                    });
                }
            },
            error: function(xhr) {
                console.log(`评分API请求失败: ${xhr.status}, ${xhr.statusText}`);
                
                // 尝试备用API
                $.ajax({
                    url: "https://webapi.115.com/files/edit_property",
                    type: "POST",
                    data: {
                        file_id: fid,
                        property: "score",
                        value: star
                    },
                    dataType: "json",
                    success: function(backupResult) {
                        console.log("备用API响应:", JSON.stringify(backupResult));
                        
                        if (backupResult && backupResult.state) {
                            console.log(`备用API成功更新评分: ${fh}`);
                            showPageNotification(`"${fh}"评分更新为${star}星`, 'success', 2000);
                            callback(true);
                        } else {
                            console.log("所有评分API尝试都失败");
                            showPageNotification(`"${fh}"评分更新失败，请尝试手动评分`, 'error', 3000);
                            callback(false);
                        }
                    },
                    error: function() {
                        console.log("备用API请求失败");
                        showPageNotification(`"${fh}"评分更新失败，请尝试手动评分`, 'error', 3000);
                        callback(false);
                    }
                });
            }
        });
    }
})();