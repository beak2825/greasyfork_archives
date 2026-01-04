// ==UserScript==
// @name           MWI角色名片插件
// @name:en        MWI Character Card
// @namespace      http://tampermonkey.net/
// @version        1.6.9
// @license        MIT
// @description    MWI角色名片插件 - 一键生成角色名片
// @description:en MWI Character Card Plugin - Generate character cards with a single click
// @author         Windoge
// @match          https://www.milkywayidle.com/*
// @match          https://www.milkywayidlecn.com/*
// @icon           https://www.milkywayidle.com/favicon.svg
// @run-at         document-idle
// @require        https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/543862/MWI%E8%A7%92%E8%89%B2%E5%90%8D%E7%89%87%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/543862/MWI%E8%A7%92%E8%89%B2%E5%90%8D%E7%89%87%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用立即执行函数避免全局变量污染
    const MWICharacterCard = (function() {
        const isZHInGameSetting = localStorage.getItem("i18nextLng")?.toLowerCase()?.startsWith("zh"); // 获取游戏内设置语言
        let isZH = isZHInGameSetting; // MWITools 本身显示的语言默认由游戏内设置语言决定

        // 检测移动端
        function isMobile() {
            return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        }

        // 获取近战等级，兼容旧数据（使用power等级作为后备）
        function getMeleeLevel(characterSkills) {
            if (!characterSkills || !Array.isArray(characterSkills)) return 0;

            // 优先查找melee技能
            const meleeSkill = characterSkills.find(s => s.skillHrid.includes('/skills/melee'));
            if (meleeSkill) {
                return meleeSkill.level || 0;
            }

            // 如果没有melee技能，查找power技能作为兼容
            const powerSkill = characterSkills.find(s => s.skillHrid.includes('/skills/power'));
            if (powerSkill) {
                console.log('[兼容性] 使用power等级作为melee等级:', powerSkill.level);
                return powerSkill.level || 0;
            }

            return 0;
        }

        // 获取角色对象的近战等级，兼容旧数据
        function getMeleeLevelFromCharacterObj(characterObj) {
            // 如果直接有 meleeLevel 属性，优先使用
            if (characterObj.meleeLevel !== undefined) {
                return characterObj.meleeLevel;
            }

            // 如果有 powerLevel 属性，使用作为兼容
            if (characterObj.powerLevel !== undefined) {
                console.log('[兼容性] 从角色对象使用powerLevel作为meleeLevel:', characterObj.powerLevel);
                return characterObj.powerLevel;
            }

            // 如果有 characterSkills 数组，使用 getMeleeLevel 函数
            if (characterObj.characterSkills) {
                return getMeleeLevel(characterObj.characterSkills);
            }

            return 0;
        }

        // 进入队伍编辑模式
        function enterTeamEditMode(modal) {
            try {
                if (!modal) return;
                // 仅在首次进入编辑时记录原始数据，后续编辑中的重渲染不覆盖
                if (!state.teamCard.editMode || !state.teamCard.originalMembers) {
                    try {
                        state.teamCard.originalMembers = JSON.parse(JSON.stringify(state.teamCard.members));
                    } catch (e) {
                        state.teamCard.originalMembers = state.teamCard.members.slice();
                    }
                }
                state.teamCard.editMode = true;

                const container = modal.querySelector('#team-character-card');
                const maxMembers = 5;

                // 在按钮行后面插入编辑按钮（保存/取消/添加）
                const buttonRow = modal.querySelector('.button-row');
                const editBtn = modal.querySelector('.edit-team-card-btn');
                const downloadBtn = modal.querySelector('.download-team-card-btn');
                const refreshBtn = modal.querySelector('.refresh-team-card-btn');
                if (editBtn) editBtn.style.display = 'none';
                if (downloadBtn) downloadBtn.disabled = true;
                if (refreshBtn) refreshBtn.disabled = true;
                const saveBtn = document.createElement('button');
                saveBtn.className = 'save-team-card-btn';
                saveBtn.textContent = isZH ? '保存' : 'Save';
                const cancelBtn = document.createElement('button');
                cancelBtn.className = 'cancel-team-card-btn';
                cancelBtn.textContent = isZH ? '取消' : 'Cancel';
                const addBtn = document.createElement('button');
                addBtn.className = 'add-team-card-btn';
                addBtn.textContent = isZH ? '添加角色' : 'Add Member';
                buttonRow.appendChild(saveBtn);
                buttonRow.appendChild(cancelBtn);
                buttonRow.appendChild(addBtn);

                const refreshAddBtnState = () => {
                    const disabled = state.teamCard.members && state.teamCard.members.length >= maxMembers;
                    addBtn.disabled = disabled;
                };

                // 编辑时禁止卡片拦截点击，便于点击删除按钮
                container.querySelectorAll('.team-card-wrap .character-card').forEach(card => {
                    card.style.pointerEvents = 'none';
                });

                // 为每个成员添加删除按钮（包括自己）
                const wraps = container.querySelectorAll('.team-card-wrap');
                wraps.forEach((wrap, idx) => {
                    const m = state.teamCard.members[idx];
                    if (!m) return;
                    const del = document.createElement('button');
                    del.textContent = '×';
                    del.title = m.isSelf ? (isZH ? '删除自己' : 'Remove Myself') : (isZH ? '删除该队友' : 'Remove');
                    del.style.cssText = 'position:absolute; right:4px; top:4px; background:#dc3545; color:#fff; border:none; width:22px; height:22px; border-radius:50%; cursor:pointer; z-index:9999; pointer-events:auto;';
                    del.addEventListener('click', (e) => {
                        e.stopPropagation();
                        try {
                            state.teamCard.members.splice(idx, 1);
                        } catch(err) {}
                        saveTeamCardToStorage(state.teamCard.teamName, state.teamCard.members);
                        // 重渲染，强制使用 state 数据，且保持编辑模式
                        try { document.body.removeChild(modal); } catch(err) {}
                        showPartyCharacterCard({ forceState: true, openEditMode: true });
                    }, { capture: true });
                    wrap.style.position = 'relative';
                    wrap.appendChild(del);
                });

                // 添加角色
                addBtn.onclick = () => {
                    if (state.teamCard.members && state.teamCard.members.length >= maxMembers) return;
                    const promptDiv = document.createElement('div');
                    promptDiv.className = 'character-card-modal';
                    promptDiv.innerHTML = `
                        <div class="modal-content" style="max-width:95vw;width:1800px;background:#1a1a2e;border:2px solid #4a90e2;border-radius:15px;color:#fff;">
                            <button class="close-modal">&times;</button>
                            <div class="instruction-banner">${isZH ? '请输入已导出的角色数据' : 'Paste exported character data'}</div>
                            <div style="margin-bottom:10px;">
                                <label style="display:block;margin-bottom:6px;color:#4a90e2;">${isZH ? '角色名（选填）' : 'Character Name (optional)'}:</label>
                                <input class="add-member-name" placeholder="${isZH ? '如不填写，使用数据内/默认的名称' : 'Leave empty to use name from data or default'}" style="width:100%;padding:10px;background:rgba(0,0,0,0.3);border:1px solid #4a90e2;border-radius:8px;color:#fff;font-size:14px;" />
                            </div>
                            <div style="margin-bottom:8px;">
                                <label style="display:block;margin-bottom:6px;color:#4a90e2;">${isZH ? '角色数据JSON' : 'Character Data JSON'}:</label>
                                <textarea class="add-member-json" style="width:100%;height:300px;background:rgba(0,0,0,0.3);color:#fff;border:1px solid #4a90e2;border-radius:8px;padding:10px;font-family:Courier New, monospace;"></textarea>
                            </div>
                            <div class="button-row" style="margin-top:10px;">
                                <button class="import-member-btn">${isZH ? '导入' : 'Import'}</button>
                                <button class="cancel-import-btn">${isZH ? '取消' : 'Cancel'}</button>
                            </div>
                        </div>`;
                    document.body.appendChild(promptDiv);
                    const close = () => document.body.removeChild(promptDiv);
                    promptDiv.querySelector('.close-modal').onclick = close;
                    promptDiv.querySelector('.cancel-import-btn').onclick = close;
                    promptDiv.onclick = (e) => { if (e.target === promptDiv) close(); };
                    promptDiv.querySelector('.import-member-btn').onclick = () => {
                        try {
                            const txt = promptDiv.querySelector('.add-member-json').value.trim();
                            const nameInput = promptDiv.querySelector('.add-member-name').value.trim();
                            const obj = JSON.parse(txt);
                            if (!isValidCharacterData(obj)) {
                                showToastNotice(isZH ? 'JSON无效，未检测到角色数据' : 'Invalid JSON', 'error');
                                return;
                            }
                            const name = nameInput || obj.player?.name || obj.character?.name || (isZH ? '角色' : 'Character');
                            // 统一格式到 { player, abilities, characterSkills, characterHouseRoomMap, houseRooms }
                            let normalized;
                            if (obj.player) {
                                normalized = obj;
                            } else if (obj.character || obj.characterItems || obj.characterSkills) {
                                normalized = { player: { name: name, equipment: obj.characterItems || [], characterItems: obj.characterItems || [] }, abilities: obj.abilities || [], characterSkills: obj.characterSkills || [], characterHouseRoomMap: obj.characterHouseRoomMap || {}, houseRooms: obj.houseRooms || {} };
                            } else {
                                normalized = { player: obj };
                            }
                            // 确保 members 数组已初始化
                            if (!state.teamCard.members) {
                                state.teamCard.members = [];
                            }
                            state.teamCard.members.push({ name, data: normalized, isSelf: false });
                            saveTeamCardToStorage(state.teamCard.teamName, state.teamCard.members);
                            close();
                            try { document.body.removeChild(modal); } catch(err) {}
                            showPartyCharacterCard({ forceState: true, openEditMode: true });
                            showToastNotice(isZH ? '已导入角色' : 'Member imported', 'success');
                        } catch (err) {
                            showToastNotice(isZH ? 'JSON解析失败' : 'JSON parse error', 'error');
                        }
                    };
                };

                // 保存
                saveBtn.onclick = () => {
                    state.teamCard.editMode = false;
                    state.teamCard.originalMembers = null;
                    saveTeamCardToStorage(state.teamCard.teamName, state.teamCard.members);
                    showToastNotice(isZH ? '已保存' : 'Saved', 'success');
                    // 恢复按钮与交互
                    if (editBtn) editBtn.style.display = '';
                    if (downloadBtn) downloadBtn.disabled = false;
                    if (refreshBtn) refreshBtn.disabled = false;
                    container.querySelectorAll('.team-card-wrap .character-card').forEach(card => {
                        card.style.pointerEvents = '';
                    });
                    // 关闭当前编辑视图并以非编辑模式重渲染，清理删除/保存/取消按钮
                    try { document.body.removeChild(modal); } catch (e) {}
                    showPartyCharacterCard({ forceState: true });
                };

                // 取消
                cancelBtn.onclick = () => {
                    if (state.teamCard.originalMembers) {
                        // 深拷贝恢复
                        try {
                            state.teamCard.members = JSON.parse(JSON.stringify(state.teamCard.originalMembers));
                        } catch (e) {
                            state.teamCard.members = state.teamCard.originalMembers;
                        }
                        state.teamCard.editMode = false;
                        state.teamCard.originalMembers = null;
                        // 尝试写入缓存（忽略配额错误）
                        saveTeamCardToStorage(state.teamCard.teamName, state.teamCard.members);
                        // 恢复按钮与交互
                        if (editBtn) editBtn.style.display = '';
                        if (downloadBtn) downloadBtn.disabled = false;
                        if (refreshBtn) refreshBtn.disabled = false;
                        try { document.body.removeChild(modal); } catch (e) {}
                        // 强制使用内存状态渲染，避免缓存配额失败导致无法回滚
                        showPartyCharacterCard({ forceState: true });
                    }
                };

                refreshAddBtnState();
            } catch (e) {
                console.warn('进入编辑模式失败', e);
            }
        }

        // 获取当前有效的布局模式
        function getEffectiveLayoutMode() {
            return state.layoutMode.getCurrentMode();
        }

        // 切换布局模式
        function toggleLayoutMode() {
            const currentMode = getEffectiveLayoutMode();
            const newMode = currentMode === 'mobile' ? 'desktop' : 'mobile';
            state.layoutMode.forcedMode = newMode;

            // 重新生成名片并应用新布局
            refreshCharacterCard();
        }

        // 刷新角色名片布局
        function refreshCharacterCard() {
            const characterCard = document.querySelector('#character-card');
            if (!characterCard) return;

            const modal = characterCard.closest('.character-card-modal');
            if (!modal) return;

            // 获取当前数据
            // 通过检查技能槽是否有data-skill-index属性来判断是否为我的角色名片（可编辑技能）
            const isMyCharacterCard = characterCard.querySelector('.skill-panel .skill-slot[data-skill-index]') !== null;
            let characterData, characterName, characterNameElement;

            if (isMyCharacterCard) {
                // 我的角色名片
                characterData = {
                    player: {
                        name: window.characterCardWebSocketData?.characterName || (isZH ? '角色' : 'Character'),
                        equipment: window.characterCardWebSocketData?.characterItems || [],
                        characterItems: window.characterCardWebSocketData?.characterItems || [],
                        staminaLevel: window.characterCardWebSocketData?.characterSkills?.find(s => s.skillHrid.includes('/skills/stamina'))?.level || 0,
                        intelligenceLevel: window.characterCardWebSocketData?.characterSkills?.find(s => s.skillHrid.includes('/skills/intelligence'))?.level || 0,
                        attackLevel: window.characterCardWebSocketData?.characterSkills?.find(s => s.skillHrid.includes('/skills/attack'))?.level || 0,
                        meleeLevel: getMeleeLevel(window.characterCardWebSocketData?.characterSkills),
                        defenseLevel: window.characterCardWebSocketData?.characterSkills?.find(s => s.skillHrid.includes('/skills/defense'))?.level || 0,
                        rangedLevel: window.characterCardWebSocketData?.characterSkills?.find(s => s.skillHrid.includes('/skills/ranged'))?.level || 0,
                        magicLevel: window.characterCardWebSocketData?.characterSkills?.find(s => s.skillHrid.includes('/skills/magic'))?.level || 0
                    },
                    abilities: window.characterCardWebSocketData?.characterAbilities || [],
                    characterSkills: window.characterCardWebSocketData?.characterSkills || [],
                    houseRooms: window.characterCardWebSocketData?.characterHouseRoomMap || {},
                    characterHouseRoomMap: window.characterCardWebSocketData?.characterHouseRoomMap || {}
                };
                characterName = characterData.player.name;

                // 获取第一个角色名元素（我的角色）
                const characterNameDivs = document.querySelectorAll('.CharacterName_characterName__2FqyZ');
                if (characterNameDivs.length > 0) {
                    characterNameElement = characterNameDivs[0].outerHTML;
                }
            } else {
                // 他人角色名片（从剪贴板）- 使用缓存的数据
                if (!state.clipboardCharacterData) {
                    console.warn('剪贴板数据缓存为空，无法刷新布局');
                    return;
                }

                characterData = state.clipboardCharacterData.data;
                characterName = state.clipboardCharacterData.name;
                characterNameElement = state.clipboardCharacterData.nameElement;
            }

            // 重新生成名片HTML
            const newCardHTML = generateCharacterCard(characterData, characterName, characterNameElement, isMyCharacterCard);
            characterCard.outerHTML = newCardHTML;

            // 重新绑定事件监听器
            const newCharacterCard = document.querySelector('#character-card');
            if (isMyCharacterCard) {
                // 重新绑定技能槽点击事件
                const skillSlots = newCharacterCard.querySelectorAll('.skill-slot, .empty-skill-slot');
                skillSlots.forEach(slot => {
                    slot.addEventListener('click', function() {
                        const skillIndex = parseInt(this.getAttribute('data-skill-index'));
                        showSkillSelector(skillIndex);
                    });
                });
            }

            // 重新绑定布局切换按钮事件
            const layoutToggleBtn = modal.querySelector('.layout-toggle-btn');
            if (layoutToggleBtn) {
                layoutToggleBtn.onclick = toggleLayoutMode;
                // 更新按钮文本
                updateLayoutToggleButton();
            }

            // 更新模态框容器的布局类名
            updateModalLayoutClass();
        }

        // 获取布局切换按钮的文本
        function getLayoutToggleText() {
            const currentMode = getEffectiveLayoutMode();
            const currentIcon = currentMode === 'mobile' ? '📱' : '🖥';
            const nextIcon = currentMode === 'mobile' ? '🖥' : '📱';
            return `${currentIcon} → ${nextIcon}`;
        }

        // 更新布局切换按钮的显示
        function updateLayoutToggleButton() {
            const layoutToggleBtn = document.querySelector('.layout-toggle-btn');
            if (!layoutToggleBtn) return;

            const currentMode = getEffectiveLayoutMode();
            const currentIcon = currentMode === 'mobile' ? '📱' : '🖥';
            const nextIcon = currentMode === 'mobile' ? '🖥' : '📱';

            layoutToggleBtn.textContent = `${currentIcon} → ${nextIcon}`;
            layoutToggleBtn.title = isZH ?
                `当前: ${currentMode === 'mobile' ? '移动端' : 'PC端'}布局，点击切换到${currentMode === 'mobile' ? 'PC端' : '移动端'}布局` :
                `Current: ${currentMode === 'mobile' ? 'Mobile' : 'Desktop'} layout, click to switch to ${currentMode === 'mobile' ? 'Desktop' : 'Mobile'} layout`;
        }

        // 更新模态框容器的布局类名
        function updateModalLayoutClass() {
            const modalContent = document.querySelector('.character-card-modal .modal-content');
            if (!modalContent) return;

            const currentMode = getEffectiveLayoutMode();

            // 移除之前的布局类名
            modalContent.classList.remove('desktop-layout', 'mobile-layout');

            // 添加当前布局对应的类名
            if (currentMode === 'desktop') {
                modalContent.classList.add('desktop-layout');
            } else {
                modalContent.classList.add('mobile-layout');
            }
        }

        // 简化的SVG创建工具
        class CharacterCardSVGTool {
            constructor() {
                this.isLoaded = false;
                this.spriteSheets = {
                    items: null,
                    skills: null,
                    abilities: null,
                    misc: null
                };
            }

            // 动态获取SVG sprite文件路径
            async discoverSpritePaths() {
                const spritePaths = {};

                try {
                    // 方法1: 从页面中已存在的SVG use元素获取路径
                    const useElements = document.querySelectorAll('svg use[href*="/static/media/"]');
                    for (const useEl of useElements) {
                        const href = useEl.getAttribute('href');
                        if (href && href.includes('#')) {
                            const [filePath] = href.split('#');
                            if (filePath.includes('items_sprite')) {
                                spritePaths.items = filePath;
                            } else if (filePath.includes('skills_sprite')) {
                                spritePaths.skills = filePath;
                            } else if (filePath.includes('abilities_sprite')) {
                                spritePaths.abilities = filePath;
                            } else if (filePath.includes('misc_sprite')) {
                                spritePaths.misc = filePath;
                            } else if (filePath.includes('chat_icons_sprite')) {
                                spritePaths.chat_icons = filePath;
                            }
                        }
                    }

                    // 方法2: 如果方法1没有找到足够的路径，尝试从CSS中获取
                    if (Object.keys(spritePaths).length < 3) {
                        const stylesheets = Array.from(document.styleSheets);
                        for (const stylesheet of stylesheets) {
                            try {
                                const rules = Array.from(stylesheet.cssRules || stylesheet.rules || []);
                                for (const rule of rules) {
                                    if (rule.style && rule.style.backgroundImage) {
                                        const bgImage = rule.style.backgroundImage;
                                        const match = bgImage.match(/url\(['"]?([^'"]*\/static\/media\/[^'"]*\.svg)['"]?\)/);
                                        if (match) {
                                            const filePath = match[1];
                                            if (filePath.includes('items_sprite')) {
                                                spritePaths.items = filePath;
                                            } else if (filePath.includes('skills_sprite')) {
                                                spritePaths.skills = filePath;
                                            } else if (filePath.includes('abilities_sprite')) {
                                                spritePaths.abilities = filePath;
                                            } else if (filePath.includes('misc_sprite')) {
                                                spritePaths.misc = filePath;
                                            }
                                        }
                                    }
                                }
                            } catch (e) {
                                // 跨域或其他CSS访问错误，忽略
                            }
                        }
                    }

                    // 方法3: 从游戏的JavaScript代码中提取路径
                    if (Object.keys(spritePaths).length < 3) {
                        const jsPathsFound = await this.extractPathsFromJS();
                        Object.assign(spritePaths, jsPathsFound);
                    }

                    // 方法4: 如果还是没找到，尝试通过网络请求探测常见的文件名模式
                    const missingTypes = ['items', 'skills', 'abilities', 'misc'].filter(type => !spritePaths[type]);
                    if (missingTypes.length > 0) {
                        console.log('尝试通过网络请求探测SVG文件路径...');

                        // 生成可能的哈希值模式（8位十六进制）
                        const possibleHashes = await this.generatePossibleHashes();

                        for (const type of missingTypes) {
                            for (const hash of possibleHashes) {
                                const testPath = `/static/media/${type}_sprite.${hash}.svg`;
                                try {
                                    const response = await fetch(testPath, { method: 'HEAD' });
                                    if (response.ok) {
                                        spritePaths[type] = testPath;
                                        console.log(`发现 ${type} sprite: ${testPath}`);
                                        break;
                                    }
                                } catch (e) {
                                    // 继续尝试下一个
                                }
                            }
                        }
                    }

                } catch (error) {
                    console.warn('动态获取SVG路径时出错:', error);
                }

                return spritePaths;
            }

            // 从游戏的JavaScript代码中提取SVG路径
            async extractPathsFromJS() {
                const foundPaths = {};

                try {
                    // 获取所有script标签
                    const scripts = Array.from(document.querySelectorAll('script[src]'));

                    for (const script of scripts) {
                        // 只检查游戏的主要JS文件
                        if (script.src.includes('/static/js/') || script.src.includes('main.') || script.src.includes('chunk.')) {
                            try {
                                const response = await fetch(script.src);
                                const jsContent = await response.text();

                                // 搜索SVG sprite路径的模式
                                const patterns = [
                                    // 直接的路径字符串
                                    /["'](\/static\/media\/(?:items|skills|abilities|misc)_sprite\.[a-f0-9]{8,}\.svg)["']/g,
                                    // webpack模块导入
                                    /(?:items|skills|abilities|misc)_sprite["']:\s*["']([^"']+)["']/g,
                                    // React组件中的导入
                                    /from\s+["']([^"']*(?:items|skills|abilities|misc)_sprite[^"']*)["']/g
                                ];

                                for (const pattern of patterns) {
                                    let match;
                                    while ((match = pattern.exec(jsContent)) !== null) {
                                        const path = match[1];
                                        if (path.includes('items_sprite')) {
                                            foundPaths.items = path;
                                        } else if (path.includes('skills_sprite')) {
                                            foundPaths.skills = path;
                                        } else if (path.includes('abilities_sprite')) {
                                            foundPaths.abilities = path;
                                        } else if (path.includes('misc_sprite')) {
                                            foundPaths.misc = path;
                                        }
                                    }
                                }

                                // 如果找到了足够的路径，就停止搜索
                                if (Object.keys(foundPaths).length >= 3) {
                                    break;
                                }

                            } catch (e) {
                                // 跳过无法访问的脚本
                                continue;
                            }
                        }
                    }

                    if (Object.keys(foundPaths).length > 0) {
                        console.log('从JavaScript代码中发现的SVG路径:', foundPaths);
                    }

                } catch (error) {
                    console.warn('从JavaScript代码提取SVG路径时出错:', error);
                }

                return foundPaths;
            }

            // 生成可能的哈希值（基于常见的webpack哈希模式）
            async generatePossibleHashes() {
                const hashes = [];

                // 从页面中已有的静态资源URL提取哈希模式
                const allLinks = Array.from(document.querySelectorAll('link[href*="/static/"], script[src*="/static/"]'));
                const allUrls = [
                    ...allLinks.map(el => el.href || el.src),
                    ...Array.from(document.querySelectorAll('img[src*="/static/"]')).map(el => el.src)
                ];

                for (const url of allUrls) {
                    const match = url.match(/\/static\/media\/[^\/]+\.([a-f0-9]{8,})\.(?:svg|png|jpg|js|css)/);
                    if (match && match[1]) {
                        hashes.push(match[1]);
                    }
                }

                // 去重并限制数量
                return [...new Set(hashes)].slice(0, 10);
            }

            async loadSpriteSheets() {
                console.log('开始动态加载SVG sprite系统...');

                // 检查缓存的路径（避免重复检测）
                const cacheKey = 'mwi_sprite_paths_cache';
                const cachedPaths = this.getCachedSpritePaths(cacheKey);

                let discoveredPaths = {};

                if (cachedPaths && Object.keys(cachedPaths).length >= 3) {
                    console.log('使用缓存的SVG sprite路径:', cachedPaths);
                    discoveredPaths = cachedPaths;
                } else {
                    console.log('缓存无效，开始动态发现SVG sprite路径...');
                    // 动态发现sprite路径
                    discoveredPaths = await this.discoverSpritePaths();

                    // 缓存发现的路径
                    if (Object.keys(discoveredPaths).length > 0) {
                        this.cacheSpritePaths(cacheKey, discoveredPaths);
                    }
                }

                // 更新sprite路径，使用发现的路径或后备路径
                this.spriteSheets = {
                    items: discoveredPaths.items || '/static/media/items_sprite.d4d08849.svg', // 后备路径
                    skills: discoveredPaths.skills || '/static/media/skills_sprite.3bb4d936.svg',
                    abilities: discoveredPaths.abilities || '/static/media/abilities_sprite.fdd1b4de.svg',
                    misc: discoveredPaths.misc || '/static/media/misc_sprite.6fa5e97c.svg'
                };

                console.log('SVG sprite系统已初始化');
                console.log('发现的Sprite文件路径:', discoveredPaths);
                console.log('使用的Sprite文件路径:', this.spriteSheets);

                // 验证路径是否有效（仅验证发现的路径）
                let validPaths = 0;
                const pathsToValidate = Object.keys(discoveredPaths).length > 0 ?
                    Object.entries(discoveredPaths) :
                    Object.entries(this.spriteSheets).slice(0, 2); // 只验证前两个作为快速检查

                for (const [type, path] of pathsToValidate) {
                    if (path) {
                        try {
                            const response = await fetch(path, { method: 'HEAD' });
                            if (response.ok) {
                                validPaths++;
                            } else {
                                console.warn(`SVG sprite ${type} 路径无效: ${path}`);
                                // 如果发现的路径无效，清除缓存
                                if (Object.keys(discoveredPaths).length > 0) {
                                    this.clearCachedSpritePaths(cacheKey);
                                }
                            }
                        } catch (e) {
                            console.warn(`SVG sprite ${type} 路径检查失败: ${path}`);
                        }
                    }
                }

                this.isLoaded = validPaths > 0 || Object.keys(this.spriteSheets).length > 0;
                console.log(`SVG sprite系统加载${this.isLoaded ? '成功' : '失败'}，验证的有效路径: ${validPaths}/${pathsToValidate.length}`);
                return this.isLoaded;
            }

            // 缓存sprite路径
            cacheSpritePaths(cacheKey, paths) {
                try {
                    const cacheData = {
                        paths: paths,
                        timestamp: Date.now(),
                        version: window.location.href // 使用URL作为版本标识
                    };
                    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
                    console.log('SVG sprite路径已缓存');
                } catch (e) {
                    console.warn('缓存SVG sprite路径失败:', e);
                }
            }

            // 获取缓存的sprite路径
            getCachedSpritePaths(cacheKey) {
                try {
                    const cached = localStorage.getItem(cacheKey);
                    if (!cached) return null;

                    const cacheData = JSON.parse(cached);
                    const now = Date.now();
                    const cacheAge = now - cacheData.timestamp;
                    const maxAge = 24 * 60 * 60 * 1000; // 24小时

                    // 检查缓存是否过期或版本是否匹配
                    if (cacheAge > maxAge || cacheData.version !== window.location.href) {
                        localStorage.removeItem(cacheKey);
                        return null;
                    }

                    return cacheData.paths;
                } catch (e) {
                    console.warn('读取缓存的SVG sprite路径失败:', e);
                    return null;
                }
            }

            // 清除缓存的sprite路径
            clearCachedSpritePaths(cacheKey) {
                try {
                    localStorage.removeItem(cacheKey);
                    console.log('已清除SVG sprite路径缓存');
                } catch (e) {
                    console.warn('清除SVG sprite路径缓存失败:', e);
                }
            }

            // 动态获取chat_icons_sprite路径
            getChatIconsSpritePath() {
                try {
                    // 从页面中查找chat_icons_sprite的使用
                    const chatUseElements = document.querySelectorAll('svg use[href*="chat_icons_sprite"]');
                    if (chatUseElements.length > 0) {
                        const href = chatUseElements[0].getAttribute('href');
                        if (href && href.includes('#')) {
                            const [filePath] = href.split('#');
                            console.log('动态发现chat_icons_sprite路径:', filePath);
                            return filePath;
                        }
                    }

                    // 如果没找到，返回默认路径
                    console.log('未找到chat_icons_sprite，使用默认路径');
                    return '/static/media/chat_icons_sprite.61d2499f.svg';
                } catch (e) {
                    console.warn('获取chat_icons_sprite路径失败:', e);
                    return '/static/media/chat_icons_sprite.61d2499f.svg';
                }
            }

            // 创建MWI风格的SVG图标 - 直接返回HTML字符串
            createSVGIcon(itemId, options = {}) {
                const { className = 'Icon_icon__2LtL_', title = itemId, type = 'items' } = options;
                const svgHref = `${this.spriteSheets[type]}#${itemId}`;

                // 收集调试信息
                if (!state.debugInfo.firstSvgPath) {
                    state.debugInfo.firstSvgPath = svgHref;
                }
                state.debugInfo.iconCount++;

                return `<svg role="img" aria-label="${title}" class="${className}" width="100%" height="100%">
                    <use href="${svgHref}"></use>
                </svg>`;
            }

            // 后备图标
            createFallbackIcon(itemId, className, title) {
                const text = itemId.length > 6 ? itemId.substring(0, 6) : itemId;
                return `<div class="${className}" title="${title}" style="
                    width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
                    background: #4a90e2; color: white; font-size: 10px; border-radius: 4px;
                ">${text}</div>`;
            }

            hasIcon() { return this.isLoaded; }
        }

        // 技能选择器相关函数
        function showSkillSelector(skillIndex) {
            // 获取所有可用技能（包括未装备的）
            const allSkills = window.characterCardWebSocketData?.characterAbilities || [];
            const availableSkills = allSkills
                .filter(ability => ability.abilityHrid && ability.abilityHrid.startsWith("/abilities/"))
                .sort((a, b) => (a.slotNumber || 0) - (b.slotNumber || 0));

            // 创建技能选择器模态框
            const modal = document.createElement('div');
            modal.className = 'skill-selector-modal';
            modal.innerHTML = `
                <div class="skill-selector-content">
                    <div class="skill-selector-header">
                        <h3>${isZH ? '选择技能' : 'Select Skill'}</h3>
                        <button class="close-skill-selector">&times;</button>
                    </div>
                    <div class="skill-selector-grid">
                        <!-- 空按钮 -->
                        <div class="skill-option empty-skill-option" data-skill-index="${skillIndex}" data-ability-hrid="" data-level="0">
                            <div class="skill-option-icon">
                                <div class="empty-skill-icon">-</div>
                            </div>
                            <div class="skill-option-level">${isZH ? '空' : 'Empty'}</div>
                        </div>
                        ${availableSkills.map(skill => `
                            <div class="skill-option" data-skill-index="${skillIndex}" data-ability-hrid="${skill.abilityHrid}" data-level="${skill.level}">
                                <div class="skill-option-icon">
                                    ${createSvgIcon(skill.abilityHrid, 'abilities')}
                                </div>
                                <div class="skill-option-level">Lv.${skill.level}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            // 添加事件监听器
            modal.querySelector('.close-skill-selector').onclick = () => {
                document.body.removeChild(modal);
            };
            modal.onclick = (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            };

            // 添加技能选项点击事件监听器
            const skillOptions = modal.querySelectorAll('.skill-option');
            skillOptions.forEach(option => {
                option.addEventListener('click', function() {
                    const skillIndex = parseInt(this.getAttribute('data-skill-index'));
                    const abilityHrid = this.getAttribute('data-ability-hrid');
                    const level = parseInt(this.getAttribute('data-level'));
                    selectSkill(skillIndex, abilityHrid, level);
                });
            });

            document.body.appendChild(modal);
        }

        function selectSkill(skillIndex, abilityHrid, level) {
            // 更新用户选择的技能
            if (abilityHrid === "") {
                // 选择"空"选项，删除该位置的技能
                delete state.customSkills.selectedSkills[skillIndex];
            } else {
                // 选择具体技能
                state.customSkills.selectedSkills[skillIndex] = {
                    abilityHrid: abilityHrid,
                    level: level,
                    slotNumber: skillIndex + 1
                };
            }

                            // 重新生成技能面板
                const characterCard = document.querySelector('#character-card');
                if (characterCard) {
                    const skillPanel = characterCard.querySelector('.skill-panel');
                    if (skillPanel) {
                        // 重新生成技能面板内容
                        const characterData = {
                            abilities: window.characterCardWebSocketData?.characterAbilities || [],
                            characterSkills: window.characterCardWebSocketData?.characterSkills || []
                        };
                        const newSkillPanel = generateSkillPanel(characterData, true);
                        skillPanel.innerHTML = newSkillPanel.replace(/<div class="skill-panel">([\s\S]*?)<\/div>$/, '$1');

                        // 重新添加事件监听器
                        const skillSlots = skillPanel.querySelectorAll('.skill-slot, .empty-skill-slot');
                        skillSlots.forEach(slot => {
                            slot.addEventListener('click', function() {
                                const skillIndex = parseInt(this.getAttribute('data-skill-index'));
                                showSkillSelector(skillIndex);
                            });
                        });
                    }
                }

                // 确保布局切换按钮的事件监听器仍然有效
                const characterCardModal = characterCard.closest('.character-card-modal');
                if (characterCardModal) {
                    const layoutToggleBtn = characterCardModal.querySelector('.layout-toggle-btn');
                    if (layoutToggleBtn) {
                        // 重新绑定布局切换按钮事件
                        layoutToggleBtn.onclick = toggleLayoutMode;
                        // 更新按钮文本
                        updateLayoutToggleButton();
                    }
                }

            // 关闭技能选择器
            const modal = document.querySelector('.skill-selector-modal');
            if (modal) {
                document.body.removeChild(modal);
            }
        }

        // 全局版本号
        const VERSION = '1.6.6';

        // 使用闭包管理状态，避免全局变量
        const state = {
            svgTool: new CharacterCardSVGTool(),
            debugInfo: {
                firstSvgPath: null,
                iconCount: 0
            },
            observer: null,
            timer: null,
            isInitialized: false,
            // 用户自定义技能展示状态
            customSkills: {
                selectedSkills: [], // 用户选择的技能列表
                maxSkills: 8 // 最大技能数量
            },
            // 布局模式控制
            layoutMode: {
                forcedMode: null, // null=自动检测, 'desktop'=强制PC端, 'mobile'=强制移动端
                getCurrentMode: function() {
                    if (this.forcedMode) return this.forcedMode;
                    return isMobile() ? 'mobile' : 'desktop';
                }
            },
            // 缓存剪贴板角色数据，用于布局切换
            clipboardCharacterData: null,
            // 队伍名片数据
            teamCard: {
                members: [], // [{ name, data, isSelf }]
                teamName: '',
                editMode: false,
                originalMembers: null
            }
        };

        // 简化的SVG图标创建函数
        function createSvgIcon(itemHrid, iconType = null, className = 'Icon_icon__2LtL_') {
            // 自动检测图标类型和提取itemId
            let type = 'items';
            let itemId = itemHrid;

            if (itemHrid.startsWith('/items/')) {
                type = 'items';
                itemId = itemHrid.replace('/items/', '');
            } else if (itemHrid.startsWith('/abilities/')) {
                type = 'abilities';
                itemId = itemHrid.replace('/abilities/', '');
            } else if (itemHrid.startsWith('/skills/')) {
                type = 'skills';
                itemId = itemHrid.replace('/skills/', '');
            } else if (itemHrid.startsWith('/misc/')) {
                type = 'misc';
                itemId = itemHrid.replace('/misc/', '');
            } else {
                // 对于基础属性图标
                if (['stamina', 'intelligence', 'attack', 'melee', 'defense', 'ranged', 'magic'].includes(itemHrid)) {
                    type = 'skills';
                    itemId = itemHrid;
                } else {
                    itemId = itemHrid.replace("/items/", "").replace("/abilities/", "").replace("/skills/", "").replace("/misc/", "");
                }
            }

            // 如果手动指定了类型，使用指定的类型
            if (iconType) {
                type = iconType;
            }

            // 使用SVG工具创建图标
            if (state.svgTool && state.svgTool.isLoaded) {
                return state.svgTool.createSVGIcon(itemId, {
                    className: className,
                    title: itemId,
                    type: type
                });
            }

            // 后备方案
            return state.svgTool.createFallbackIcon(itemId, className, itemId);
        }

        function generateEquipmentPanel(characterObj) {
            // MWI装备槽位映射 - 使用grid位置
            const equipmentSlots = {
                "/item_locations/back": { row: 1, col: 1, name: "背部" },
                "/item_locations/head": { row: 1, col: 2, name: "头部" },
                "/item_locations/main_hand": { row: 2, col: 1, name: "主手" },
                "/item_locations/body": { row: 2, col: 2, name: "身体" },
                "/item_locations/off_hand": { row: 2, col: 3, name: "副手" },
                "/item_locations/hands": { row: 3, col: 1, name: "手部" },
                "/item_locations/legs": { row: 3, col: 2, name: "腿部" },
                "/item_locations/pouch": { row: 3, col: 3, name: "口袋" },
                "/item_locations/feet": { row: 4, col: 2, name: "脚部" },
                "/item_locations/neck": { row: 1, col: 5, name: "项链" },
                "/item_locations/earrings": { row: 2, col: 5, name: "耳环" },
                "/item_locations/ring": { row: 3, col: 5, name: "戒指" },
                "/item_locations/trinket": { row: 1, col: 3, name: "饰品" },
                "/item_locations/two_hand": { row: 2, col: 1, name: "双手" },
                "/item_locations/charm": { row: 4, col: 5, name: "护符" }
            };

            let items = characterObj.equipment || characterObj.characterItems || [];
            const equipmentMap = {};
            let hasTwoHandWeapon = false;

            // 构建装备映射
            items.forEach(item => {
                const slotInfo = equipmentSlots[item.itemLocationHrid];
                if (slotInfo) {
                    equipmentMap[item.itemLocationHrid] = item;
                    if (item.itemLocationHrid === "/item_locations/two_hand") hasTwoHandWeapon = true;
                }
            });

            // 创建MWI风格的装备面板
            let html = '<div class="equipment-panel">';
            html += `<div class="panel-title">${isZH ? '装备' : 'Equipments'}</div>`;
            html += '<div class="EquipmentPanel_playerModel__3LRB6" style="margin-top:30px">';

            // 遍历所有装备槽位
            Object.entries(equipmentSlots).forEach(([slotHrid, slotInfo]) => {
                // 如果有双手武器，跳过单手主手槽
                if (hasTwoHandWeapon && slotHrid === "/item_locations/main_hand") {
                    return;
                }

                // 如果没有双手武器，跳过双手槽
                if (!hasTwoHandWeapon && slotHrid === "/item_locations/two_hand") {
                    return;
                }

                const item = equipmentMap[slotHrid];

                html += `<div style="grid-row-start: ${slotInfo.row}; grid-column-start: ${slotInfo.col};">`;
                html += '<div class="ItemSelector_itemSelector__2eTV6">';
                html += '<div class="ItemSelector_itemContainer__3olqe">';
                html += '<div class="Item_itemContainer__x7kH1">';
                html += '<div>';

                if (item) {
                    // 有装备的槽位
                    const itemName = item.itemHrid.replace('/items/', '');
                    const enhancementLevel = item.enhancementLevel || 0;

                    html += '<div class="Item_item__2De2O Item_clickable__3viV6" style="position: relative;">';
                    html += '<div class="Item_iconContainer__5z7j4">';
                    html += createSvgIcon(item.itemHrid, 'items'); // 使用MWI的Icon类
                    html += '</div>';

                    // 强化等级 - 完全按照MWI原生格式
                    if (enhancementLevel > 0) {
                        html += `<div class="Item_enhancementLevel__19g-e enhancementProcessed enhancementLevel_${enhancementLevel}" style="z-index: 9">+${enhancementLevel}</div>`;
                    }

                    html += '</div>';
                } else {
                    // 空装备槽
                    html += '<div class="Item_item__2De2O" style="position: relative; opacity: 0.3;">';
                    html += '<div class="Item_iconContainer__5z7j4">';
                    html += `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #999; font-size: 10px;">${isZH ? '空' : 'Empty'}</div>`;
                    html += '</div>';
                    html += '</div>';
                }

                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
            });

            html += '</div>'; // EquipmentPanel_playerModel__3LRB6
            html += '</div>'; // equipment-panel

            return html;
        }

        // 从页面获取战斗等级
        function calculateCombatLevel(characterObj) {
            try {
                // 获取各项属性等级
                const stamina = characterObj.staminaLevel || 0;
                const intelligence = characterObj.intelligenceLevel || 0;
                const defense = characterObj.defenseLevel || 0;
                const attack = characterObj.attackLevel || 0;
                const melee = getMeleeLevelFromCharacterObj(characterObj);
                const ranged = characterObj.rangedLevel || 0;
                const magic = characterObj.magicLevel || 0;

                // 计算公式：战斗等级 = 0.1 * (耐力 + 智力 + 攻击 + 防御 + MAX(近战, 远程, 魔法)) + 0.5 * MAX(攻击, 防御, 近战, 远程, 魔法)
                const maxCombatSkill = Math.max(melee, ranged, magic);
                const maxAllCombat = Math.max(attack, defense, melee, ranged, magic);
                const combatLevel = Math.floor(0.1 * (stamina + intelligence + attack + defense + maxCombatSkill) + 0.5 * maxAllCombat);

                return combatLevel;
            } catch (error) {
                console.log('计算战斗等级失败:', error);
                return 0;
            }
        }

        function getCombatLevelFromPage() {
            try {
                // 查找包含战斗等级信息的元素
                const overviewTab = document.querySelector('.SharableProfile_overviewTab__W4dCV');
                if (overviewTab) {
                    // 查找包含"战斗等级:"文本的div元素
                    const combatLevelDiv = Array.from(overviewTab.querySelectorAll('div')).find(div =>
                        div.textContent && div.textContent.includes('战斗等级:')
                    );

                    if (combatLevelDiv) {
                        // 提取数字
                        const match = combatLevelDiv.textContent.match(/战斗等级:\s*(\d+)/);
                        if (match && match[1]) {
                            return parseInt(match[1]);
                        }
                    }
                }
            } catch (error) {
                console.log('获取战斗等级失败:', error);
            }
            return 0;
        }

        function generateAbilityPanel(characterObj) {
            const abilityMapping = [
                { key: "staminaLevel", name: isZH ? "耐力" : "Stamina", icon: "stamina" },
                { key: "intelligenceLevel", name: isZH ? "智力" : "Intelligence", icon: "intelligence" },
                { key: "attackLevel", name: isZH ? "攻击" : "Attack", icon: "attack" },
                { key: "meleeLevel", name: isZH ? "近战" : "Melee", icon: "melee" },
                { key: "defenseLevel", name: isZH ? "防御" : "Defense", icon: "defense" },
                { key: "rangedLevel", name: isZH ? "远程" : "Ranged", icon: "ranged" },
                { key: "magicLevel", name: isZH ? "魔法" : "Magic", icon: "magic" }
            ];

            let html = '<div class="ability-panel">';
            html += `<div class="panel-title">${isZH ? '属性等级' : 'Skills'}</div><div class="ability-list">`;

            // 添加战斗等级作为第一行
            const combatLevel = calculateCombatLevel(characterObj);
            html += `<div class="ability-row">
                <div class="ability-icon">
                    ${createSvgIcon('combat', 'misc')}
                </div>
                <span style="flex: 1;">${isZH ? '战斗' : 'Combat'}</span>
                <span class="level">Lv.${combatLevel}</span>
            </div>`;

            abilityMapping.forEach(ability => {
                let level = 0;
                if (characterObj[ability.key]) {
                    level = characterObj[ability.key];
                } else if (characterObj.characterSkills) {
                    const skillKey = ability.key.replace('Level', '');
                    if (skillKey === 'melee') {
                        // 特殊处理近战等级，使用兼容函数
                        level = getMeleeLevel(characterObj.characterSkills);
                    } else {
                        const skill = characterObj.characterSkills.find(skill => skill.skillHrid.includes(`/skills/${skillKey}`));
                        level = skill ? skill.level : 0;
                    }
                }

                html += `<div class="ability-row">
                    <div class="ability-icon">${createSvgIcon(ability.icon, 'skills')}</div>
                    <span style="flex: 1;">${ability.name}</span>
                    <span class="level">Lv.${level}</span>
                </div>`;
            });

            return html + '</div></div>';
        }

        function generateSkillPanel(data, isMyCharacter = false, options = {}) {
            const teamMode = options && options.teamMode;
            let abilities = data.abilities || data.characterSkills || [];

            let combatSkills;

            if (isMyCharacter) {
                // 团队模式：仅显示已装备技能（slotNumber>0），不显示空槽，不可编辑
                if (teamMode) {
                    combatSkills = abilities
                        .filter(ability => ability.abilityHrid && ability.abilityHrid.startsWith("/abilities/"))
                        .filter(ability => ability.slotNumber && ability.slotNumber > 0)
                        .sort((a, b) => a.slotNumber - b.slotNumber);
                    let html = '<div class="skill-panel">';
                    html += `<div class="panel-title">${isZH ? '技能等级' : 'Abilities'}</div>`;
                    html += '<div class="AbilitiesPanel_abilityGrid__-p-VF">';
                    combatSkills.forEach(selectedSkill => {
                        html += '<div>';
                        html += `<div class="Ability_ability__1njrh">`;
                        html += '<div class="Ability_iconContainer__3syNQ">';
                        html += createSvgIcon(selectedSkill.abilityHrid, 'abilities');
                        html += '</div>';
                        html += `<div class="Ability_level__1L-do">Lv.${selectedSkill.level}</div>`;
                        html += '</div>';
                        html += '</div>';
                    });
                    html += '</div>';
                    html += '</div>';
                    return html;
                }
                // 场景2：根据slotNumber筛选和排序
                combatSkills = abilities
                    .filter(ability => ability.abilityHrid && ability.abilityHrid.startsWith("/abilities/"))
                    .filter(ability => ability.slotNumber && ability.slotNumber > 0)
                    .sort((a, b) => a.slotNumber - b.slotNumber); // 按slotNumber升序排列

                // 初始化用户选择的技能（如果为空）
                if (state.customSkills.selectedSkills.length === 0) {
                    // 默认显示前5个技能
                    state.customSkills.selectedSkills = combatSkills.slice(0, 5).map(skill => ({
                        abilityHrid: skill.abilityHrid,
                        level: skill.level,
                        slotNumber: skill.slotNumber
                    }));
                }

                let html = '<div class="skill-panel">';
                html += `<div class="panel-title">${isZH ? '技能等级' : 'Abilities'}</div>`;

                // 使用MWI原生的技能网格容器
                html += '<div class="AbilitiesPanel_abilityGrid__-p-VF">';

                // 渲染用户选择的技能（最多8个）
                for (let i = 0; i < state.customSkills.maxSkills; i++) {
                    const selectedSkill = state.customSkills.selectedSkills[i];

                    if (selectedSkill) {
                        // 显示已选择的技能
                        html += '<div>';
                        html += `<div class="Ability_ability__1njrh Ability_clickable__w9HcM skill-slot" data-skill-index="${i}">`;
                        html += '<div class="Ability_iconContainer__3syNQ">';
                        html += createSvgIcon(selectedSkill.abilityHrid, 'abilities');
                        html += '</div>';
                        html += `<div class="Ability_level__1L-do">Lv.${selectedSkill.level}</div>`;
                        html += '</div>';
                        html += '</div>';
                    } else {
                        // 显示空白位置（鼠标悬停时显示虚线边框）
                        html += '<div>';
                        html += `<div class="Ability_ability__1njrh Ability_clickable__w9HcM empty-skill-slot" data-skill-index="${i}">`;
                        html += '</div>';
                        html += '</div>';
                    }
                }

                html += '</div>'; // AbilitiesPanel_abilityGrid__-p-VF
                html += '</div>'; // skill-panel

                return html;
            } else {
                // 场景1：保持原始顺序，不排序
                combatSkills = abilities
                    .filter(ability => ability.abilityHrid && ability.abilityHrid.startsWith("/abilities/"));
                // 团队模式下，如果包含 slotNumber 字段，则仅展示已装备技能
                if (teamMode) {
                    const hasSlot = combatSkills.some(a => a.slotNumber && a.slotNumber > 0);
                    if (hasSlot) {
                        combatSkills = combatSkills
                            .filter(a => a.slotNumber && a.slotNumber > 0)
                            .sort((a, b) => a.slotNumber - b.slotNumber);
                    }
                }

                let html = '<div class="skill-panel">';
                html += `<div class="panel-title">${isZH ? '技能等级' : 'Abilities'}</div>`;

                // 使用MWI原生的技能网格容器
                html += '<div class="AbilitiesPanel_abilityGrid__-p-VF">';

                // 渲染每个技能
                combatSkills.forEach(ability => {
                    const abilityId = ability.abilityHrid.replace('/abilities/', '');

                    html += '<div>';
                    html += '<div class="Ability_ability__1njrh Ability_clickable__w9HcM">';
                    html += '<div class="Ability_iconContainer__3syNQ">';
                    html += createSvgIcon(ability.abilityHrid, 'abilities'); // 使用完整的hrid
                    html += '</div>';
                    html += `<div class="Ability_level__1L-do">Lv.${ability.level}</div>`;
                    html += '</div>';
                    html += '</div>';
                });

                html += '</div>'; // AbilitiesPanel_abilityGrid__-p-VF
                html += '</div>'; // skill-panel

                return html;
            }
        }

        function generateHousePanel(data) {
            const houseRoomsMapping = [
                { hrid: "/house_rooms/dining_room", icon: "stamina", name: isZH ? "餐厅" : "Dining Room" },
                { hrid: "/house_rooms/library", icon: "intelligence", name: isZH ? "图书馆" : "Library" },
                { hrid: "/house_rooms/dojo", icon: "attack", name: isZH ? "道场" : "Dojo" },
                { hrid: "/house_rooms/gym", icon: "melee", name: isZH ? "健身房" : "Gym" },
                { hrid: "/house_rooms/armory", icon: "defense", name: isZH ? "军械库" : "Armory" },
                { hrid: "/house_rooms/archery_range", icon: "ranged", name: isZH ? "射箭场" : "Archery Range" },
                { hrid: "/house_rooms/mystical_study", icon: "magic", name: isZH ? "神秘研究室" : "Mystical Study" }
            ];

            let houseRoomMap = data.houseRooms || data.characterHouseRoomMap || {};

            let html = '<div class="house-panel">';
            html += `<div class="panel-title">${isZH ? '房屋等级' : 'House Rooms'}</div>`;

            // 使用和技能面板相同的MWI原生结构
            html += '<div class="AbilitiesPanel_abilityGrid__-p-VF">';

            // 遍历所有房屋类型
            houseRoomsMapping.forEach(houseRoom => {
                let level = 0;
                if (houseRoomMap[houseRoom.hrid]) {
                    level = typeof houseRoomMap[houseRoom.hrid] === 'object'
                        ? houseRoomMap[houseRoom.hrid].level || 0
                        : houseRoomMap[houseRoom.hrid];
                }

                // 使用和技能相同的MWI原生结构
                html += '<div>';
                html += '<div class="Ability_ability__1njrh Ability_clickable__w9HcM">';
                html += '<div class="Ability_iconContainer__3syNQ">';
                html += createSvgIcon(houseRoom.icon, 'skills'); // 使用标准的Icon类
                html += '</div>';
                // 为8级房屋添加特殊显示
                let levelText = '';
                let levelClass = 'Ability_level__1L-do';

                if (level === 8) {
                    levelText = `Lv.8`;
                    levelClass += ' house-max-level';
                } else if (level > 0) {
                    levelText = `Lv.${level}`;
                } else {
                    levelText = isZH ? '未建造' : 'Lv.0';
                }

                html += `<div class="${levelClass}">${levelText}</div>`;
                html += '</div>';
                html += '</div>';
            });

            html += '</div>'; // AbilitiesPanel_abilityGrid__-p-VF
            html += '</div>'; // house-panel

            return html;
        }

        function generateCharacterCard(data, characterName, characterNameElement = null, isMyCharacter = false, options = {}) {
            let characterObj = data.player || data;
            const equipmentPanel = generateEquipmentPanel(characterObj);

            // 创建标题栏内容
            let headerContent = '';
            if (characterNameElement) {
                // 使用从页面复制的角色信息元素
                headerContent = characterNameElement;
            } else {
                // 后备方案：使用简单的角色名
                headerContent = `<h2>${characterName}</h2>`;
            }

            // 根据当前布局模式添加相应的类名
            const currentLayoutMode = getEffectiveLayoutMode();
            const layoutClass = `layout-${currentLayoutMode}`;

            return `
                <div id="character-card" class="character-card ${layoutClass}">
                    <div class="card-header">${headerContent}</div>
                    <div class="card-content">
                        ${equipmentPanel}
                        ${generateAbilityPanel(characterObj)}
                        ${generateSkillPanel(data, isMyCharacter, options)}
                        ${generateHousePanel(data)}
                    </div>
                </div>
            `;
        }

        function createModalStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .character-card-modal {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.8); z-index: 10000; display: flex;
                    justify-content: center; align-items: center; padding: 16px; box-sizing: border-box;
                }
                .modal-content {
                    background: white; border-radius: 15px; padding: 20px;
                    max-width: 90vw; max-height: 90vh; overflow: auto; position: relative;
                    transition: max-width 0.3s ease;
                }

                /* 当强制使用桌面布局时，扩大容器尺寸 */
                .modal-content.desktop-layout {
                    max-width: 95vw;
                }

                /* 当强制使用桌面布局时，使用桌面端的完整尺寸 */
                .modal-content.desktop-layout .character-card {
                    max-width: 1000px;
                    width: auto;
                }

                /* 当强制使用移动端布局时，使用移动端的紧凑尺寸 */
                .modal-content.mobile-layout .character-card {
                    max-width: 500px;
                    width: auto;
                }
                .close-modal {
                    position: absolute; top: 10px; right: 15px; background: none;
                    border: none; font-size: 24px; cursor: pointer; color: #666; z-index: 1;
                }
                .close-modal:hover { color: #000; }
                .character-card {
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                    border: 2px solid #4a90e2; border-radius: 15px; padding: 20px; color: white;
                    font-family: 'Arial', sans-serif; max-width: 800px; margin: 0 auto;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                }
                .card-header {
                    text-align: center; margin-bottom: 20px; border-bottom: 2px solid #4a90e2;
                    padding: 8px 10px 12px 10px; min-height: 45px; display: flex;
                    align-items: center; justify-content: center;
                }
                .card-header h2 {
                    margin: 0; color: #4a90e2; font-size: 24px; text-shadow: 0 0 10px rgba(74, 144, 226, 0.5);
                }

                /* 角色信息元素在名片中的样式 */
                .card-header .CharacterName_characterName__2FqyZ {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .card-header .CharacterName_chatIcon__22lxV {
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .card-header .CharacterName_name__1amXp {
                    font-size: 20px;
                    line-height: 1.3;
                    padding: 4px 0;
                    display: inline-block;
                    vertical-align: middle;
                    margin: 0;
                    transform: translateY(-2px);
                }

                /* 修复角色名内部span标签的高度问题 */
                .card-header .CharacterName_name__1amXp span {
                    height: 24px;
                    line-height: 24px;
                    display: inline-block;
                    color: inherit;
                    text-shadow: inherit;
                    font-size: inherit;
                    font-weight: inherit;
                    vertical-align: middle;
                    overflow: visible;
                }

                .card-header .CharacterName_gameMode__2Pvw8 {
                    font-size: 14px;
                    opacity: 0.8;
                }
                .card-content {
                    display: grid; gap: 20px;
                }

                /* PC端布局 */
                .character-card.layout-desktop .card-content {
                    grid-template-columns: 1fr 0.7fr;
                    grid-template-rows: auto 1fr;
                }

                /* 移动端布局 */
                .character-card.layout-mobile .card-content {
                    grid-template-columns: 1fr;
                    grid-template-rows: auto auto auto auto;
                }
                .equipment-panel, .house-panel, .ability-panel, .skill-panel {
                    background: rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 6px;
                    border: 1px solid rgba(74, 144, 226, 0.3);
                }
                .panel-title {
                    margin: 0 0 15px 0; color: #4a90e2; font-size: 16px;
                    border-bottom: 1px solid rgba(74, 144, 226, 0.3); padding-bottom: 5px; text-align: center;
                }
                /* PC端面板位置 */
                .character-card.layout-desktop .equipment-panel { grid-column: 1; grid-row: 1; }
                .character-card.layout-desktop .ability-panel { grid-column: 2; grid-row: 1; }
                .character-card.layout-desktop .house-panel { grid-column: 1; grid-row: 2; }
                .character-card.layout-desktop .skill-panel { grid-column: 2; grid-row: 2; }

                /* 移动端面板位置 */
                .character-card.layout-mobile .equipment-panel { grid-column: 1; grid-row: 1; }
                .character-card.layout-mobile .ability-panel { grid-column: 1; grid-row: 2; }
                .character-card.layout-mobile .house-panel { grid-column: 1; grid-row: 3; }
                .character-card.layout-mobile .skill-panel { grid-column: 1; grid-row: 4; }

                /* 只为模态框内的装备面板添加网格布局，不影响游戏原生UI */
                .character-card .EquipmentPanel_playerModel__3LRB6 {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    grid-template-rows: repeat(4, auto);
                    gap: 8px;
                    padding: 10px;
                    max-width: 350px;
                    margin: 0 auto;
                }

                /* 确保装备槽的基本布局 */
                .character-card .ItemSelector_itemSelector__2eTV6 {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* 技能面板样式 - 仅作用于角色名片内 */
                .character-card .AbilitiesPanel_abilityGrid__-p-VF {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 8px;
                    padding: 10px;
                    max-height: 180px;
                    overflow-y: auto;
                }

                /* 技能项容器 */
                .character-card .Ability_ability__1njrh {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 70px;
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(74, 144, 226, 0.3);
                    transition: all 0.2s ease;
                }

                .character-card .Ability_ability__1njrh.Ability_clickable__w9HcM:hover {
                    background: rgba(74, 144, 226, 0.1);
                    border-color: #4a90e2;
                    transform: scale(1.05);
                }

                /* 技能图标容器 */
                .character-card .Ability_iconContainer__3syNQ {
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 4px;
                }

                /* 房屋等级图标容器 - 调整垂直居中 */
                .character-card .house-panel .Ability_iconContainer__3syNQ {
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 4px;
                    transform: translateY(2px);
                }

                /* 技能等级文字 */
                .character-card .Ability_level__1L-do {
                    font-size: 12px;
                    font-weight: bold;
                    color: #fff;
                    text-align: center;
                }

                /* 房屋最高等级特殊样式 */
                .character-card .house-max-level {
                    color: #ff8c00 !important;
                    font-weight: bold;
                    text-shadow: 0 0 4px rgba(255, 140, 0, 0.5);
                }
                .ability-panel { grid-column: 2; grid-row: 1; }
                .ability-list { flex: 1; }
                .ability-row {
                    display: flex; align-items: center; margin-bottom: 8px; padding: 4px; border-radius: 4px;
                }
                .ability-icon {
                    width: 30px; height: 30px; margin-right: 10px; display: flex;
                    align-items: center; justify-content: center;
                }
                .house-panel {
                    grid-column: 1;
                    grid-row: 2;
                }


                .skill-panel {
                    grid-column: 2;
                    grid-row: 2;
                }
                .level { color: #fff; font-weight: bold; }
                @media (max-width: 768px) {
                    /* 移动端模态框调整 */
                    .character-card-modal {
                        padding: 8px;
                    }

                    .modal-content {
                        max-width: 95vw;
                        max-height: 95vh;
                        padding: 12px;
                        overflow-y: auto;
                    }

                    /* 移动端布局覆盖 - 当在移动设备上且没有强制模式时 */
                    .character-card:not(.layout-desktop) .card-content {
                        grid-template-columns: 1fr !important;
                        grid-template-rows: auto auto auto auto !important;
                        gap: 12px;
                    }

                    .character-card:not(.layout-desktop) .equipment-panel { grid-column: 1 !important; grid-row: 1 !important; }
                    .character-card:not(.layout-desktop) .ability-panel { grid-column: 1 !important; grid-row: 2 !important; }
                    .character-card:not(.layout-desktop) .house-panel { grid-column: 1 !important; grid-row: 3 !important; }
                    .character-card:not(.layout-desktop) .skill-panel { grid-column: 1 !important; grid-row: 4 !important; }

                    /* 移动端面板样式调整 */
                    .equipment-panel, .house-panel, .ability-panel, .skill-panel {
                        padding: 10px;
                        margin-bottom: 4px;
                    }

                    /* 移动端装备面板调整 - 保持游戏原始布局 */
                    .character-card .EquipmentPanel_playerModel__3LRB6 {
                        gap: 6px;
                        padding: 8px;
                        max-width: 100%;
                    }

                    /* 移动端技能面板调整 - 每行4个 */
                    .character-card .ability-panel .AbilitiesPanel_abilityGrid__-p-VF {
                        grid-template-columns: repeat(4, 1fr);
                        gap: 10px;
                        padding: 12px;
                        max-height: 180px;
                    }

                    /* 移动端房屋面板调整 - 每行4个 */
                    .character-card .house-panel .AbilitiesPanel_abilityGrid__-p-VF {
                        grid-template-columns: repeat(4, 1fr);
                        gap: 8px;
                        padding: 10px;
                        max-height: 180px;
                    }

                    /* 移动端技能卡片间距调整 */
                    .character-card .ability-panel .Ability_ability__1njrh {
                        margin: 2px;
                        min-height: 75px;
                    }

                    /* 移动端房屋卡片间距调整 - 4列布局 */
                    .character-card .house-panel .Ability_ability__1njrh {
                        margin: 1px;
                        min-height: 65px;
                        font-size: 11px;
                    }

                    /* 移动端房屋等级图标容器 - 调整垂直居中 */
                    .character-card .house-panel .Ability_iconContainer__3syNQ {
                        transform: translateY(1px);
                    }

                    /* 移动端面板标题调整 */
                    .panel-title {
                        font-size: 14px;
                        margin-bottom: 8px;
                        padding-bottom: 4px;
                    }

                    /* 移动端字体调整 */
                    .character-card {
                        font-size: 12px;
                    }

                    /* 移动端指示横幅调整 */
                    .instruction-banner {
                        padding: 8px;
                        font-size: 14px;
                    }
                }

                .instruction-banner {
                    background: #17a2b8; color: white; padding: 10px; border-radius: 5px;
                    margin-bottom: 10px; font-weight: bold; text-align: center;
                }

                .download-section {
                    text-align: center; margin-bottom: 15px;
                }

                /* 统一按钮外观：下载 / 刷新 / 编辑 / 添加 */
                .download-card-btn,
                .download-team-card-btn,
                .refresh-team-card-btn,
                .edit-team-card-btn,
                .add-team-card-btn {
                    background: #17a2b8;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .download-card-btn:hover:not(:disabled),
                .download-team-card-btn:hover:not(:disabled),
                .refresh-team-card-btn:hover:not(:disabled),
                .edit-team-card-btn:hover:not(:disabled),
                .add-team-card-btn:hover:not(:disabled) {
                    background: #138496;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                }

                .download-card-btn:disabled,
                .download-team-card-btn:disabled,
                .refresh-team-card-btn:disabled,
                .edit-team-card-btn:disabled,
                .add-team-card-btn:disabled {
                    background: #6c757d; cursor: not-allowed; transform: none;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                /* 保存（绿色） */
                .save-team-card-btn {
                    background: #28a745;
                    color: #fff;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .save-team-card-btn:hover:not(:disabled) {
                    background: #218838;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                }
                .save-team-card-btn:disabled {
                    background: #6c757d; cursor: not-allowed; transform: none;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                /* 取消（红色） */
                .cancel-team-card-btn {
                    background: #dc3545;
                    color: #fff;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .cancel-team-card-btn:hover:not(:disabled) {
                    background: #c82333;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                }
                .cancel-team-card-btn:disabled {
                    background: #6c757d; cursor: not-allowed; transform: none;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                /* 布局切换按钮样式 */
                .layout-toggle-btn {
                    background: #17a2b8;
                    color: white;
                    border: none;
                    padding: 6px 10px;
                    border-radius: 4px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    font-weight: bold;
                }

                .layout-toggle-btn:hover {
                    background: #138496;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                }

                .layout-toggle-btn:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                /* 技能提示样式 */
                .skill-hint {
                    margin-top: 8px;
                    text-align: center;
                }

                .skill-hint span {
                    font-size: 12px;
                    color: #17a2b8;
                    font-style: italic;
                    background: rgba(23, 162, 184, 0.1);
                    padding: 4px 8px;
                    border-radius: 4px;
                    border: 1px solid rgba(23, 162, 184, 0.3);
                }

                /* 按钮行样式 */
                .button-row {
                    display: flex;
                    gap: 8px;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 8px;
                }

                .save-skill-config-btn,
                .load-skill-config-btn {
                    background: #17a2b8;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .save-skill-config-btn:hover,
                .load-skill-config-btn:hover {
                    background: #138496;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                }



                /* 仅为角色名片内的SVG图标添加优化，不影响游戏原生UI */
                .character-card .Icon_icon__2LtL_ {
                    width: 100%;
                    height: 100%;
                    filter: drop-shadow(0 0 2px rgba(0,0,0,0.3));
                    image-rendering: -webkit-optimize-contrast;
                    image-rendering: -moz-crisp-edges;
                    image-rendering: pixelated;
                }

                /* 空白技能槽样式 */
                .character-card .empty-skill-slot {
                    cursor: pointer;
                    border: 1px dashed rgba(74, 144, 226, 0.3);
                    background: transparent;
                    min-height: 70px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .character-card .empty-skill-slot:hover {
                    border: 1px dashed #4a90e2;
                    background: rgba(74, 144, 226, 0.1);
                }

                /* 技能选择器模态框样式 */
                .skill-selector-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    z-index: 20000;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 16px;
                    box-sizing: border-box;
                }

                .skill-selector-content {
                    background: #1a1a2e;
                    border-radius: 15px;
                    padding: 20px;
                    max-width: 80vw;
                    max-height: 80vh;
                    overflow: auto;
                    position: relative;
                    min-width: 400px;
                    border: 2px solid #4a90e2;
                }

                .skill-selector-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    border-bottom: 1px solid #4a90e2;
                    padding-bottom: 10px;
                }

                .skill-selector-header h3 {
                    margin: 0;
                    color: #fff;
                    font-size: 18px;
                }

                .close-skill-selector {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #ccc;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .close-skill-selector:hover {
                    color: #fff;
                }

                .skill-selector-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 12px;
                    max-height: 400px;
                    overflow-y: auto;
                }

                .skill-option {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 8px;
                    border: 1px solid #4a90e2;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background: rgba(255, 255, 255, 0.05);
                }

                .skill-option:hover {
                    border-color: #4a90e2;
                    background: rgba(74, 144, 226, 0.2);
                    transform: scale(1.05);
                }

                .skill-option-icon {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 4px;
                }

                .skill-option-level {
                    font-size: 11px;
                    font-weight: bold;
                    color: #fff;
                    text-align: center;
                }

                /* 空技能选项样式 */
                .skill-option.empty-skill-option {
                    border: 1px dashed #4a90e2;
                    background: rgba(255, 255, 255, 0.02);
                }

                .skill-option.empty-skill-option:hover {
                    border-color: #4a90e2;
                    background: rgba(74, 144, 226, 0.1);
                }

                .empty-skill-icon {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px dashed #4a90e2;
                    border-radius: 4px;
                    color: #4a90e2;
                    font-size: 16px;
                    font-weight: bold;
                }



                /* 移动端技能选择器调整 */
                @media (max-width: 768px) {
                    .skill-selector-content {
                        max-width: 95vw;
                        min-width: 300px;
                        padding: 15px;
                    }

                    .skill-selector-grid {
                        grid-template-columns: repeat(4, 1fr);
                        gap: 8px;
                    }

                    .skill-option {
                        padding: 6px;
                    }

                    .skill-option-icon {
                        width: 32px;
                        height: 32px;
                    }

                    .skill-option-level {
                        font-size: 10px;
                    }

                    .empty-skill-icon {
                        width: 32px;
                        height: 32px;
                        font-size: 14px;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // 队伍名片样式（单独注入，避免干扰已有样式）
        function createTeamStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .team-card-modal .modal-content { max-width: 98vw; }
                .team-name { text-align: center; color: #4a90e2; font-weight: bold; margin: 6px 0 12px 0; }
                .team-cards-container {
                    display: flex;
                    gap: 6px;
                    flex-wrap: nowrap;
                    align-items: flex-start;
                    overflow-x: auto;
                    padding-bottom: 8px;
                    justify-content: center;
                    min-height: 200px;
                }
                /* 当内容宽度超过容器时，切换到靠左显示以便滚动 */
                .team-cards-container.overflow-mode {
                    justify-content: flex-start;
                }
                .team-card-wrap { width: 320px; position: relative; }
                .team-card-wrap .character-card { position: absolute; top: 0; left: 0; transform: scale(0.8); transform-origin: top left; width: 390px; }
                .team-mode .card-header { margin-bottom: 12px; }
                .team-mode .panel-title { font-size: 14px; margin-bottom: 10px; }
                .team-mode .character-card .EquipmentPanel_playerModel__3LRB6 { gap: 6px; padding: 8px; }
                .team-hint { text-align: center; color: #4a90e2; font-size: 12px; margin: -4px 0 10px 0; opacity: 0.9; }
                /* 轻量全局提示条 */
                .toast-notice {
                    position: fixed;
                    top: 16px;
                    right: 16px;
                    padding: 8px 12px;
                    border-radius: 4px;
                    color: #fff;
                    font-size: 12px;
                    z-index: 20001;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    opacity: 0;
                    transform: translateY(-6px);
                    transition: opacity 0.2s ease, transform 0.2s ease;
                }
                .toast-notice.show { opacity: 1; transform: translateY(0); }
                .toast-success { background: #344386; }
                .toast-error { background: #4f171f; }
                .toast-info { background: #344386; }
                /* 空队伍提示样式 */
                .empty-team-placeholder {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 200px;
                    border: 2px dashed #4a90e2;
                    border-radius: 15px;
                    background: rgba(74, 144, 226, 0.1);
                    color: #4a90e2;
                    text-align: center;
                    padding: 20px;
                    margin: 10px 0;
                }
                .empty-team-placeholder .empty-icon {
                    font-size: 48px;
                    margin-bottom: 15px;
                    opacity: 0.7;
                }
                .empty-team-placeholder .empty-title {
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                .empty-team-placeholder .empty-subtitle {
                    font-size: 14px;
                    opacity: 0.8;
                }
            `;
            document.head.appendChild(style);
        }

        function adjustTeamCardWrapHeights() {
            try {
                const scale = 0.8;
                const wraps = document.querySelectorAll('.team-card-wrap');
                wraps.forEach(w => {
                    const card = w.querySelector('.character-card');
                    if (!card) return;
                    const unscaledHeight = card.offsetHeight; // layout height
                    const scaledHeight = Math.round(unscaledHeight * scale);
                    w.style.height = scaledHeight + 'px';
                });
            } catch (e) { /* ignore */ }
        }

        // 动态调整队伍名片容器的居中显示
        function adjustTeamCardsLayout() {
            try {
                const container = document.querySelector('.team-cards-container');
                if (!container) return;

                // 等待一个微任务，确保DOM更新完成
                setTimeout(() => {
                    const containerWidth = container.clientWidth;
                    const scrollWidth = container.scrollWidth;

                    // 如果内容宽度超过容器宽度，切换到靠左显示以便滚动
                    if (scrollWidth > containerWidth) {
                        container.classList.add('overflow-mode');
                    } else {
                        container.classList.remove('overflow-mode');
                    }
                }, 10);
            } catch (e) { /* ignore */ }
        }

        // 轻量提示条
        function showToastNotice(text, variant = 'success', durationMs = 1800) {
            try {
                const div = document.createElement('div');
                div.className = `toast-notice toast-${variant}`;
                div.textContent = text;
                document.body.appendChild(div);
                // 触发过渡
                requestAnimationFrame(() => div.classList.add('show'));
                setTimeout(() => {
                    try {
                        div.classList.remove('show');
                        setTimeout(() => document.body.removeChild(div), 250);
                    } catch (e) {}
                }, durationMs);
            } catch (e) {}
        }

        // 转换 WS 的 init_character_data 为名片数据
        function transformInitCharacterDataToCardData(parsedData) {
            return {
                player: {
                    name: parsedData.character?.name || parsedData.characterName || parsedData.name || (isZH ? '角色' : 'Character'),
                    equipment: parsedData.characterItems || [],
                    characterItems: parsedData.characterItems || [],
                    staminaLevel: parsedData.characterSkills?.find(s => s.skillHrid.includes('/skills/stamina'))?.level || 0,
                    intelligenceLevel: parsedData.characterSkills?.find(s => s.skillHrid.includes('/skills/intelligence'))?.level || 0,
                    attackLevel: parsedData.characterSkills?.find(s => s.skillHrid.includes('/skills/attack'))?.level || 0,
                    meleeLevel: getMeleeLevel(parsedData.characterSkills),
                    defenseLevel: parsedData.characterSkills?.find(s => s.skillHrid.includes('/skills/defense'))?.level || 0,
                    rangedLevel: parsedData.characterSkills?.find(s => s.skillHrid.includes('/skills/ranged'))?.level || 0,
                    magicLevel: parsedData.characterSkills?.find(s => s.skillHrid.includes('/skills/magic'))?.level || 0
                },
                abilities: parsedData.characterAbilities || [],
                characterSkills: parsedData.characterSkills || [],
                houseRooms: parsedData.characterHouseRoomMap || {},
                characterHouseRoomMap: parsedData.characterHouseRoomMap || {}
            };
        }

        // 将 profile_shared 存档对象转换为名片数据
        function transformProfileSharedToCardData(profileStoredObj) {
            try {
                const profile = profileStoredObj.profile;
                const characterName = profileStoredObj.characterName || profile?.sharableCharacter?.name || (isZH ? '角色' : 'Character');
                const wearableMap = profile?.wearableItemMap || {};
                const equipment = Object.values(wearableMap || {}).map(item => ({
                    itemLocationHrid: item.itemLocationHrid,
                    itemHrid: item.itemHrid,
                    enhancementLevel: item.enhancementLevel || 0
                }));
                const characterSkills = (profile?.characterSkills || []).map(s => ({
                    skillHrid: s.skillHrid,
                    level: s.level
                }));
                const levels = {
                    staminaLevel: characterSkills.find(s => s.skillHrid.includes('/skills/stamina'))?.level || 0,
                    intelligenceLevel: characterSkills.find(s => s.skillHrid.includes('/skills/intelligence'))?.level || 0,
                    attackLevel: characterSkills.find(s => s.skillHrid.includes('/skills/attack'))?.level || 0,
                    meleeLevel: getMeleeLevel(characterSkills),
                    defenseLevel: characterSkills.find(s => s.skillHrid.includes('/skills/defense'))?.level || 0,
                    rangedLevel: characterSkills.find(s => s.skillHrid.includes('/skills/ranged'))?.level || 0,
                    magicLevel: characterSkills.find(s => s.skillHrid.includes('/skills/magic'))?.level || 0
                };
                const abilities = (profile?.equippedAbilities || []).map(a => ({ abilityHrid: a?.abilityHrid || '', level: a?.level || 1 }));
                const houseMapRaw = profile?.characterHouseRoomMap || {};
                const houseRooms = {};
                try { Object.values(houseMapRaw).forEach(h => { if (h?.houseRoomHrid) houseRooms[h.houseRoomHrid] = h.level || 0; }); } catch {}
                return {
                    player: { name: characterName, equipment, characterItems: equipment, ...levels },
                    abilities,
                    characterSkills,
                    houseRooms,
                    characterHouseRoomMap: houseMapRaw
                };
            } catch (e) {
                console.warn('transformProfileSharedToCardData 失败:', e);
                return null;
            }
        }

        function getTeamNameFromPage() {
            const nameEl = document.querySelector('.Party_partyName__3XL5z');
            return nameEl ? nameEl.textContent.trim() : (isZH ? '队伍' : 'Party');
        }

        // 构建队伍成员名片数据列表
        function buildPartyCharacterDataList() {
            const list = [];
            const wsData = window.characterCardWebSocketData;
            if (!wsData || !wsData.partyInfo) {
                console.log('[队伍名片] 未检测到 partyInfo，无法构建队伍数据');
                return list;
            }
            const myId = wsData?.character?.id;
            const slotMap = wsData.partyInfo.partySlotMap || {};
            const storedProfilesStr = localStorage.getItem('profile_export_list');
            let storedProfiles = [];
            try { storedProfiles = storedProfilesStr ? JSON.parse(storedProfilesStr) : []; } catch {}

            console.log('[队伍名片] 检测到队伍成员槽位:', Object.keys(slotMap).length);
            let idx = 0;
            for (const member of Object.values(slotMap)) {
                if (!member?.characterID) continue;
                idx++;
                if (member.characterID === myId) {
                    const selfName = wsData?.character?.name || wsData.characterName || (isZH ? '角色' : 'Character');
                    console.log(`[队伍名片] 成员${idx}: 自己 (${selfName}) 使用WS数据`);
                    list.push({ name: selfName, data: transformInitCharacterDataToCardData(wsData), isSelf: true });
                } else {
                    const match = storedProfiles.find(p => p.characterID === member.characterID);
                    if (match) {
                        const cardData = transformProfileSharedToCardData(match);
                        if (cardData) {
                            console.log(`[队伍名片] 成员${idx}: ${match.characterName} 使用profile_shared存档`);
                            list.push({ name: match.characterName, data: cardData, isSelf: false });
                        } else {
                            console.log(`[队伍名片] 成员${idx}: ${member.characterID} 转换失败`);
                        }
                    } else {
                        console.log(`[队伍名片] 成员${idx}: ${member.characterID} 未找到profile_shared记录（请先在游戏中打开其资料页）`);
                        list.push({ name: isZH ? '未知成员' : 'Unknown Member', data: { player: { name: isZH ? '未知' : 'Unknown', equipment: [] }, abilities: [], characterSkills: [], houseRooms: {}, characterHouseRoomMap: {} }, isSelf: false });
                    }
                }
            }
            return list;
        }

        // 本地存储键
        const TEAM_CARD_STORAGE_KEY = 'mwi_team_card_cache_v1';

        function saveTeamCardToStorage(teamName, members) {
            try {
                const data = { teamName, members };
                localStorage.setItem(TEAM_CARD_STORAGE_KEY, JSON.stringify(data));
                console.log('[队伍名片] 已保存队伍名片数据');
            } catch (e) { console.warn('保存队伍名片失败', e); }
        }

        function loadTeamCardFromStorage() {
            try {
                const str = localStorage.getItem(TEAM_CARD_STORAGE_KEY);
                if (!str) return null;
                const obj = JSON.parse(str);
                if (!obj || !Array.isArray(obj.members)) return null;
                return obj;
            } catch (e) { return null; }
        }

        // 下载队伍名片
        async function downloadTeamCharacterCard() {
            try {
                const wrapper = document.getElementById('team-character-card');
                if (!wrapper) { alert(isZH ? '未找到队伍名片元素' : 'Team card element not found'); return; }
                const btn = document.querySelector('.download-team-card-btn');
                const originalText = btn ? btn.textContent : '';
                if (btn) { btn.textContent = isZH ? '生成中...' : 'Generating...'; btn.disabled = true; }

                // 保持与预览一致的结构，直接克隆容器
                const cloned = wrapper.cloneNode(true);
                const renderRoot = cloned;
                const spriteContents = {};
                const spriteUrls = Object.values(state.svgTool.spriteSheets);
                const needsChatSprite = renderRoot.querySelector('svg use[href*="chat_icons_sprite"]');
                if (needsChatSprite) {
                    const chatSpritePath = state.svgTool.getChatIconsSpritePath();
                    spriteUrls.push(chatSpritePath);
                }
                for (const url of spriteUrls) { const content = await loadSpriteContent(url); if (content) spriteContents[url] = content; }
                const useElements = renderRoot.querySelectorAll('svg use');
                useElements.forEach(useElement => {
                    try {
                        const href = useElement.getAttribute('href');
                        const svg = useElement.closest('svg');
                        if (!href || !href.includes('#') || !svg) return;
                        const [spriteUrl, symbolId] = href.split('#');
                        const spriteContent = spriteContents[spriteUrl];
                        if (!spriteContent || !symbolId) return;
                        const symbol = spriteContent.querySelector(`#${symbolId}`);
                        if (!symbol) return;
                        const symbolClone = symbol.cloneNode(true);
                        svg.innerHTML = '';
                        svg.setAttribute('fill', 'none');
                        const viewBox = symbol.getAttribute('viewBox');
                        if (viewBox) svg.setAttribute('viewBox', viewBox);
                        while (symbolClone.firstChild) svg.appendChild(symbolClone.firstChild);
                    } catch (e) {}
                });

                const temp = document.createElement('div');
                temp.style.position = 'absolute'; temp.style.left = '-9999px'; temp.style.top = '-9999px';
                temp.appendChild(renderRoot); document.body.appendChild(temp);
                const canvas = await html2canvas(renderRoot, { backgroundColor: '#1a1a2e', scale: 2, useCORS: true, logging: false });
                document.body.removeChild(temp);
                const a = document.createElement('a');
                a.download = `MWI_Party_Card_${Date.now()}.png`; a.href = canvas.toDataURL('image/png', 1.0);
                document.body.appendChild(a); a.click(); document.body.removeChild(a);
                if (btn) { btn.textContent = originalText; btn.disabled = false; }
                console.log('队伍名片图片已生成并下载');
            } catch (e) {
                console.error('下载队伍名片失败:', e);
                alert(isZH ? '下载队伍名片失败' : 'Failed to download team card');
                const btn = document.querySelector('.download-team-card-btn');
                if (btn) { btn.textContent = isZH ? '下载队伍名片' : 'Download Team Card'; btn.disabled = false; }
            }
        }

        // 展示队伍名片
        function showPartyCharacterCard(options = {}) {
            try {
                const { forceState = false, openEditMode = false } = options;
                let teamName = getTeamNameFromPage();
                console.log(`[队伍名片] 队伍名称: ${teamName}`);
                let members;
                if (forceState && state.teamCard.members !== undefined) {
                    // 强制使用内存状态，包括空数组
                    members = state.teamCard.members;
                    teamName = state.teamCard.teamName || teamName;
                } else {
                    const cached = loadTeamCardFromStorage();
                    if (cached && cached.members !== undefined) {
                        teamName = cached.teamName || teamName;
                        members = cached.members;
                        console.log('[队伍名片] 已从缓存加载队伍数据');
                    } else if (state.teamCard.members !== undefined) {
                        members = state.teamCard.members;
                        teamName = state.teamCard.teamName || teamName;
                    } else {
                        // 最后兜底：如果没有缓存也没有内存状态，才从当前队伍构建
                        members = buildPartyCharacterDataList();
                    }
                }
                // 移除原来的空队伍检查，允许显示空队伍
                state.teamCard.members = members || [];
                state.teamCard.teamName = teamName;

                let cardsHTML;
                if (!members || members.length === 0) {
                    // 显示空队伍提示
                    cardsHTML = `
                        <div class="empty-team-placeholder">
                            <div class="empty-icon">👥</div>
                            <div class="empty-title">${isZH ? '当前队伍为空' : 'Current team is empty'}</div>
                            <div class="empty-subtitle">${isZH ? '点击"添加角色"按钮进行添加' : 'Click "Add Member" button to add characters'}</div>
                        </div>
                    `;
                } else {
                    cardsHTML = members.map((m, idx) => {
                        const name = m.name || (isZH ? '角色' : 'Character');
                        const cardHtml = generateCharacterCard(m.data, name, null, false, { teamMode: true });
                        // 强制纵向布局：将 desktop 替换为 mobile，并缩放以适配队伍并排
                        const forcedMobile = cardHtml.replace('layout-desktop', 'layout-mobile');
                        return `<div class="team-card-wrap" data-index="${idx}"><div class="team-mode">${forcedMobile}</div></div>`;
                    }).join('');
                }
                const modal = document.createElement('div');
                modal.className = 'character-card-modal team-card-modal';
                modal.innerHTML = `
                    <div class="modal-content">
                        <button class="close-modal">&times;</button>
                        <div class="instruction-banner">${isZH ? `MWI队伍名片 (该功能目前不支持移动端)` : `MWI Party Cards (This feature is not supported on mobile devices)`}</div>
                        <div class="team-hint">${isZH ? '请先查看队友资料并刷新页面，才能正常使用队伍名片' : 'Please open teammates\' profiles in-game and refresh the page before using Party Cards.'}</div>
                        <div class="download-section">
                            <div class="button-row">
                                <button class="refresh-team-card-btn">${isZH ? '重新获取数据' : 'Refresh Data'}</button>
                                <button class="download-team-card-btn">${isZH ? '下载队伍名片' : 'Download Team Card'}</button>
                                <button class="edit-team-card-btn">${isZH ? '编辑名片' : 'Edit Cards'}</button>
                            </div>
                        </div>
                        <div class="team-name">${teamName}</div>
                        <div id="team-character-card" class="team-cards-container">${cardsHTML}</div>
                    </div>`;
                modal.querySelector('.close-modal').onclick = () => document.body.removeChild(modal);
                modal.querySelector('.download-team-card-btn').onclick = async () => {
                    try {
                        const refreshBtn = modal.querySelector('.refresh-team-card-btn');
                        const editBtn = modal.querySelector('.edit-team-card-btn');
                        if (refreshBtn) refreshBtn.disabled = true;
                        if (editBtn) editBtn.disabled = true;
                        await downloadTeamCharacterCard();
                    } finally {
                        const refreshBtn = modal.querySelector('.refresh-team-card-btn');
                        const editBtn = modal.querySelector('.edit-team-card-btn');
                        if (refreshBtn) refreshBtn.disabled = false;
                        if (editBtn) editBtn.disabled = false;
                    }
                };
                modal.querySelector('.refresh-team-card-btn').onclick = () => {
                    const newMembers = buildPartyCharacterDataList();
                    if (newMembers && newMembers.length) {
                        state.teamCard.members = newMembers;
                        state.teamCard.teamName = getTeamNameFromPage();
                        saveTeamCardToStorage(state.teamCard.teamName, newMembers);
                        try { document.body.removeChild(modal); } catch(err) {}
                        showPartyCharacterCard({ forceState: true });
                        showToastNotice(isZH ? '已重新获取队伍数据' : 'Party data refreshed', 'info');
                    } else {
                        showToastNotice(isZH ? '未获取到任何队伍数据' : 'No party data fetched', 'error');
                    }
                };
                modal.querySelector('.edit-team-card-btn').onclick = () => enterTeamEditMode(modal);
                modal.onclick = (e) => { if (e.target === modal) document.body.removeChild(modal); };
                // 监听尺寸变化，动态更新高度和布局，避免窗口尺寸变化导致空白
                let resizeTimer;
                const onResize = () => {
                    clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(() => {
                        adjustTeamCardWrapHeights();
                        adjustTeamCardsLayout();
                    }, 50);
                };
                window.addEventListener('resize', onResize);
                // 关闭时移除监听
                const removeModal = () => {
                    try { window.removeEventListener('resize', onResize); } catch(e) {}
                    try { document.body.removeChild(modal); } catch(e) {}
                };
                modal.querySelector('.close-modal').onclick = removeModal;
                modal.onclick = (e) => { if (e.target === modal) removeModal(); };
                document.body.appendChild(modal);
                // 修正队伍卡包裹高度，去掉预览底部空白
                adjustTeamCardWrapHeights();
                // 动态调整队伍名片的居中显示
                adjustTeamCardsLayout();
                if (openEditMode) {
                    enterTeamEditMode(modal);
                }
            } catch (e) {
                console.error('生成队伍名片失败:', e);
                alert(isZH ? '生成队伍名片失败' : 'Failed to show party card');
            }
        }

        async function readClipboardData() {
            try {
                const text = await navigator.clipboard.readText();
                return text;
            } catch (error) {
                console.log('无法读取剪贴板:', error);
                return null;
            }
        }

        function isValidCharacterData(data) {
            if (!data || typeof data !== 'object') return false;

            // 检查新格式 (player对象)
            if (data.player && (
                data.player.equipment ||
                data.player.characterItems ||
                data.player.staminaLevel !== undefined ||
                data.player.name
            )) {
                return true;
            }

            // 检查旧格式
            if (data.character && (data.characterSkills || data.characterItems)) {
                return true;
            }

            // 检查是否直接包含关键字段
            if (data.equipment || data.characterItems || data.characterSkills) {
                return true;
            }

            // 检查是否包含技能等级字段
            if (data.staminaLevel !== undefined || data.intelligenceLevel !== undefined ||
                data.attackLevel !== undefined || data.meleeLevel !== undefined || data.powerLevel !== undefined) {
                return true;
            }

            // 检查是否包含房屋数据
            if (data.houseRooms || data.characterHouseRoomMap) {
                return true;
            }

            // 检查是否包含能力数据
            if (data.abilities && Array.isArray(data.abilities)) {
                return true;
            }

            return false;
        }

        // 获取SVG sprite内容
        async function loadSpriteContent(spriteUrl) {
            try {
                const response = await fetch(spriteUrl);
                const svgText = await response.text();
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
                return svgDoc.documentElement;
            } catch (error) {
                console.warn('无法加载sprite:', spriteUrl, error);
                return null;
            }
        }

        // 下载名片功能
        async function downloadCharacterCard() {
            try {
                // 获取名片元素
                const cardElement = document.getElementById('character-card');
                if (!cardElement) {
                    alert(isZH ? '未找到名片元素' : 'Character card element not found');
                    return;
                }

                // 显示下载提示
                const downloadBtn = document.querySelector('.download-card-btn');
                const originalText = downloadBtn.textContent;
                downloadBtn.textContent = isZH ? '生成中...' : 'Generating...';
                downloadBtn.disabled = true;

                // 克隆名片元素用于处理
                const clonedCard = cardElement.cloneNode(true);

                // 确保克隆的元素有正确的布局类名
                const currentLayoutMode = getEffectiveLayoutMode();
                clonedCard.className = clonedCard.className.replace(/layout-(mobile|desktop)/g, '');
                clonedCard.classList.add(`layout-${currentLayoutMode}`);

                // 如果是场景2（我的角色名片），重新生成技能面板以保持自定义技能状态
                const isMyCharacterCard = cardElement.querySelector('.skill-panel .empty-skill-slot') !== null;
                if (isMyCharacterCard && state.customSkills.selectedSkills.length > 0) {
                    const skillPanel = clonedCard.querySelector('.skill-panel');
                    if (skillPanel) {
                        const characterData = {
                            abilities: window.characterCardWebSocketData?.characterAbilities || [],
                            characterSkills: window.characterCardWebSocketData?.characterSkills || []
                        };
                        const newSkillPanel = generateSkillPanel(characterData, true);
                        skillPanel.innerHTML = newSkillPanel.replace(/<div class="skill-panel">([\s\S]*?)<\/div>$/, '$1');
                    }
                }

                // 预加载所有sprite内容
                const spriteContents = {};
                const spriteUrls = Object.values(state.svgTool.spriteSheets);

                // 检查是否需要加载聊天图标sprite
                const needsChatSprite = clonedCard.querySelector('svg use[href*="chat_icons_sprite"]');
                if (needsChatSprite) {
                    const chatSpritePath = state.svgTool.getChatIconsSpritePath();
                    spriteUrls.push(chatSpritePath);
                }

                for (const url of spriteUrls) {
                    const content = await loadSpriteContent(url);
                    if (content) {
                        spriteContents[url] = content;
                    }
                }



                // 替换所有使用<use>的SVG为实际内容
                const useElements = clonedCard.querySelectorAll('svg use');

                useElements.forEach((useElement, index) => {
                    try {
                        const href = useElement.getAttribute('href');
                        const svg = useElement.closest('svg');

                        if (href && href.includes('#')) {
                            const [spriteUrl, symbolId] = href.split('#');
                            const spriteContent = spriteContents[spriteUrl];

                            if (spriteContent && symbolId) {
                                const symbol = spriteContent.querySelector(`#${symbolId}`);
                                if (symbol) {
                                    // 创建新的SVG内容
                                    const svg = useElement.closest('svg');
                                    if (svg) {
                                        const symbolClone = symbol.cloneNode(true);

                                        // 清空原SVG内容并添加symbol内容
                                        svg.innerHTML = '';

                                        // 添加fill="none"属性解决填充问题
                                        svg.setAttribute('fill', 'none');

                                        // 如果symbol有viewBox，应用到svg
                                        const viewBox = symbol.getAttribute('viewBox');
                                        if (viewBox) {
                                            svg.setAttribute('viewBox', viewBox);
                                        }

                                        // 复制symbol的所有子元素到svg
                                        while (symbolClone.firstChild) {
                                            svg.appendChild(symbolClone.firstChild);
                                        }
                                    }
                                } else {
                                    // 如果找不到symbol，创建文字替代
                                    const svg = useElement.closest('svg');
                                    if (svg) {
                                        svg.innerHTML = `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="10">${symbolId.substring(0, 3)}</text>`;
                                    }
                                }
                            } else {
                                // 如果找不到spriteContent，创建简单替代
                                const svg = useElement.closest('svg');
                                if (svg && symbolId) {
                                    const shortText = symbolId.length > 2 ? symbolId.substring(0, 2) : symbolId;
                                    svg.innerHTML = `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="8">${shortText}</text>`;
                                }
                            }
                        }
                    } catch (error) {
                        console.warn('处理SVG元素时出错:', error);
                    }
                });

                // 处理角色名样式 - 确保文字完整显示
                const characterNameDiv = clonedCard.querySelector('.CharacterName_name__1amXp');
                if (characterNameDiv) {
                    characterNameDiv.className = ''; // 清除所有class，使角色名显示为白色
                    // 应用内联样式确保文字完整显示
                    characterNameDiv.style.cssText = `
                        color: white !important;
                        font-size: 20px !important;
                        font-weight: bold !important;
                        line-height: 1.3 !important;
                        padding: 4px 0 !important;
                        display: inline-block !important;
                        vertical-align: middle !important;
                        margin: 0 !important;
                        transform: translateY(-2px) !important;
                        text-shadow: 0 0 10px rgba(74, 144, 226, 0.5) !important;
                    `;

                    // 修复内部span标签的高度问题
                    const characterNameSpan = characterNameDiv.querySelector('span');
                    if (characterNameSpan) {
                        characterNameSpan.style.cssText = `
                            height: 24px !important;
                            line-height: 24px !important;
                            display: inline-block !important;
                            color: inherit !important;
                            text-shadow: inherit !important;
                            font-size: inherit !important;
                            font-weight: inherit !important;
                            vertical-align: middle !important;
                            overflow: visible !important;
                        `;
                    }
                }

                // 检测是否为移动端设备 - 考虑用户的强制布局设置
                const finalLayoutMode = getEffectiveLayoutMode();
                const isMobileDevice = finalLayoutMode === 'mobile';

                // 内联关键样式（避免linear-gradient问题）
                const styleElement = document.createElement('style');

                // 根据有效布局模式选择不同的样式
                if (isMobileDevice) {
                    // 移动端样式 - 单列布局
                    styleElement.textContent = `
                        .character-card {
                            background: #1a1a2e !important;
                            border: 2px solid #4a90e2 !important;
                            border-radius: 15px !important;
                            padding: 15px !important;
                            color: white !important;
                            font-family: Arial, sans-serif !important;
                            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
                            max-width: 100% !important;
                            width: 350px !important;
                        }
                        .card-header {
                            text-align: center !important;
                            margin-bottom: 15px !important;
                            border-bottom: 2px solid #4a90e2 !important;
                            padding: 8px 10px 12px 10px !important;
                            min-height: 40px !important;
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                        }
                        .card-content {
                            display: grid !important;
                            grid-template-columns: 1fr !important;
                            grid-template-rows: auto auto auto auto !important;
                            gap: 15px !important;
                        }
                        .equipment-panel { grid-column: 1 !important; grid-row: 1 !important; }
                        .ability-panel { grid-column: 1 !important; grid-row: 2 !important; }
                        .house-panel { grid-column: 1 !important; grid-row: 3 !important; }
                        .skill-panel { grid-column: 1 !important; grid-row: 4 !important; }
                        .equipment-panel, .house-panel, .ability-panel, .skill-panel {
                            background: rgba(255, 255, 255, 0.1) !important;
                            border-radius: 10px !important;
                            padding: 10px !important;
                            margin-bottom: 4px !important;
                            border: 1px solid rgba(74, 144, 226, 0.3) !important;
                        }
                        .panel-title {
                            margin: 0 0 10px 0 !important;
                            color: #4a90e2 !important;
                            font-size: 14px !important;
                            border-bottom: 1px solid rgba(74, 144, 226, 0.3) !important;
                            padding-bottom: 4px !important;
                            text-align: center !important;
                        }
                        .EquipmentPanel_playerModel__3LRB6 {
                            display: grid !important;
                            grid-template-columns: repeat(5, 1fr) !important;
                            grid-template-rows: repeat(4, auto) !important;
                            gap: 6px !important;
                            padding: 8px !important;
                            max-width: 100% !important;
                            margin: 0 auto !important;
                        }
                        /* 技能面板 - 每行4个 */
                        .ability-panel .AbilitiesPanel_abilityGrid__-p-VF {
                            display: grid !important;
                            grid-template-columns: repeat(4, 1fr) !important;
                            gap: 10px !important;
                            padding: 12px !important;
                            max-height: 180px !important;
                            overflow-y: auto !important;
                        }

                        /* 房屋面板 - 每行4个 */
                        .house-panel .AbilitiesPanel_abilityGrid__-p-VF {
                            display: grid !important;
                            grid-template-columns: repeat(4, 1fr) !important;
                            gap: 8px !important;
                            padding: 10px !important;
                            max-height: 180px !important;
                            overflow-y: auto !important;
                        }
                        /* 技能卡片样式 */
                        .ability-panel .Ability_ability__1njrh {
                            margin: 2px !important;
                            min-height: 75px !important;
                        }

                        /* 房屋卡片样式 - 4列布局 */
                        .house-panel .Ability_ability__1njrh {
                            margin: 1px !important;
                            min-height: 65px !important;
                            font-size: 11px !important;
                        }
                        .level { color: #fff !important; font-weight: bold !important; font-size: 12px !important; }
                        svg { width: 100% !important; height: 100% !important; }
                    `;
                } else {
                    // 桌面端样式 - 双列布局
                    styleElement.textContent = `
                        .character-card {
                            background: #1a1a2e !important;
                            border: 2px solid #4a90e2 !important;
                            border-radius: 15px !important;
                            padding: 20px !important;
                            color: white !important;
                            font-family: Arial, sans-serif !important;
                            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
                            min-width: 700px !important;
                            width: auto !important;
                        }
                        .card-header {
                            text-align: center !important;
                            margin-bottom: 20px !important;
                            border-bottom: 2px solid #4a90e2 !important;
                            padding: 8px 10px 12px 10px !important;
                            min-height: 45px !important;
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                        }
                        .card-content {
                            display: grid !important;
                            grid-template-columns: 1fr 0.7fr !important;
                            grid-template-rows: auto 1fr !important;
                            gap: 20px !important;
                        }
                        .equipment-panel { grid-column: 1 !important; grid-row: 1 !important; }
                        .ability-panel { grid-column: 2 !important; grid-row: 1 !important; }
                        .house-panel { grid-column: 1 !important; grid-row: 2 !important; }
                        .skill-panel { grid-column: 2 !important; grid-row: 2 !important; }
                        .equipment-panel, .house-panel, .ability-panel, .skill-panel {
                            background: rgba(255, 255, 255, 0.1) !important;
                            border-radius: 10px !important;
                            padding: 15px !important;
                            border: 1px solid rgba(74, 144, 226, 0.3) !important;
                        }
                        .panel-title {
                            margin: 0 0 15px 0 !important;
                            color: #4a90e2 !important;
                            font-size: 16px !important;
                            border-bottom: 1px solid rgba(74, 144, 226, 0.3) !important;
                            padding-bottom: 5px !important;
                            text-align: center !important;
                        }
                        .EquipmentPanel_playerModel__3LRB6 {
                            display: grid !important;
                            grid-template-columns: repeat(5, 1fr) !important;
                            grid-template-rows: repeat(4, auto) !important;
                            gap: 8px !important;
                            padding: 10px !important;
                            max-width: 350px !important;
                            margin: 0 auto !important;
                        }
                        .AbilitiesPanel_abilityGrid__-p-VF {
                            display: grid !important;
                            grid-template-columns: repeat(4, 1fr) !important;
                            gap: 8px !important;
                            padding: 10px !important;
                            max-height: 180px !important;
                            overflow-y: auto !important;
                        }
                        .level { color: #fff !important; font-weight: bold !important; }
                        svg { width: 100% !important; height: 100% !important; }
                    `;
                }
                clonedCard.insertBefore(styleElement, clonedCard.firstChild);

                // 配置尺寸参数（在创建容器之前）
                // 为PC端布局确保最小宽度，避免在移动设备上展示不全
                const minWidth = isMobileDevice ? 350 : 700; // PC端布局至少需要700px宽度
                const actualWidth = Math.max(cardElement.offsetWidth, minWidth);

                // 创建临时容器
                const tempContainer = document.createElement('div');
                tempContainer.style.position = 'absolute';
                tempContainer.style.left = '-9999px';
                tempContainer.style.top = '-9999px';
                tempContainer.style.width = actualWidth + 'px'; // 确保容器有足够宽度
                tempContainer.appendChild(clonedCard);
                document.body.appendChild(tempContainer);

                // 确保克隆的名片有足够宽度来完整展示PC端布局
                if (!isMobileDevice) {
                    clonedCard.style.width = actualWidth + 'px';
                    clonedCard.style.minWidth = minWidth + 'px';
                }

                const options = {
                    backgroundColor: '#1a1a2e', // 使用纯色背景代替渐变
                    scale: isMobileDevice ? 1.5 : 2, // 移动端布局使用较小的缩放比例
                    useCORS: true,
                    allowTaint: true,
                    foreignObjectRendering: false,
                    width: actualWidth, // 使用计算出的实际宽度
                    height: isMobileDevice ? undefined : cardElement.offsetHeight, // 移动端布局自动计算高度
                    logging: false, // 关闭日志减少干扰
                    onclone: function(clonedDoc) {
                        try {
                            // 在克隆的文档中应用样式修复
                            const clonedCard = clonedDoc.querySelector('#character-card');
                            if (clonedCard) {
                                if (isMobileDevice) {
                                    // 移动端布局样式修复
                                    clonedCard.style.background = '#1a1a2e';
                                    clonedCard.style.border = '2px solid #4a90e2';
                                    clonedCard.style.borderRadius = '15px';
                                    clonedCard.style.padding = '15px';
                                    clonedCard.style.color = 'white';
                                    clonedCard.style.fontFamily = 'Arial, sans-serif';
                                    clonedCard.style.width = '350px';
                                    clonedCard.style.maxWidth = '100%';
                                } else {
                                    // 桌面端布局样式修复
                                    clonedCard.style.background = '#1a1a2e';
                                    clonedCard.style.border = '2px solid #4a90e2';
                                    clonedCard.style.borderRadius = '15px';
                                    clonedCard.style.padding = '20px';
                                    clonedCard.style.color = 'white';
                                    clonedCard.style.fontFamily = 'Arial, sans-serif';
                                    clonedCard.style.minWidth = minWidth + 'px';
                                    clonedCard.style.width = actualWidth + 'px';
                                }

                                // 确保所有文本都是白色
                                const allText = clonedCard.querySelectorAll('*');
                                allText.forEach(el => {
                                    if (el.tagName !== 'SVG' && el.tagName !== 'USE') {
                                        el.style.color = 'white';
                                    }
                                });
                            }
                        } catch (error) {
                            console.warn('处理克隆文档时出错:', error);
                        }
                    }
                };

                // 生成画布
                const canvas = await html2canvas(clonedCard, options);

                // 清理临时容器
                document.body.removeChild(tempContainer);

                // 检查画布是否有内容
                const ctx = canvas.getContext('2d');
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                let hasContent = false;

                // 检查是否有非透明像素
                for (let i = 3; i < data.length; i += 4) {
                    if (data[i] > 0) {
                        hasContent = true;
                        break;
                    }
                }

                if (!hasContent) {
                    console.warn('主要下载方法生成的图片为空，尝试备用方法...');
                    // 使用更简单的方法重试
                    const simpleOptions = {
                        backgroundColor: '#1a1a2e',
                        scale: 1,
                        useCORS: false,
                        allowTaint: true,
                        logging: false,
                        width: cardElement.offsetWidth,
                        height: cardElement.offsetHeight
                    };

                    const simpleCanvas = await html2canvas(cardElement, simpleOptions);
                    const simpleCtx = simpleCanvas.getContext('2d');
                    const simpleImageData = simpleCtx.getImageData(0, 0, simpleCanvas.width, simpleCanvas.height);
                    const simpleData = simpleImageData.data;
                    let simpleHasContent = false;

                    // 检查备用方法是否有内容
                    for (let i = 3; i < simpleData.length; i += 4) {
                        if (simpleData[i] > 0) {
                            simpleHasContent = true;
                            break;
                        }
                    }

                    if (simpleHasContent) {
                        // 备用方法成功，使用备用画布
                        const link = document.createElement('a');
                        link.download = `MWI_Character_Card_${new Date().getTime()}.png`;
                        link.href = simpleCanvas.toDataURL('image/png', 1.0);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        // 清理并恢复按钮状态
                        document.body.removeChild(tempContainer);
                        downloadBtn.textContent = originalText;
                        downloadBtn.disabled = false;
                        console.log('使用备用方法成功生成名片图片');
                        return;
                    } else {
                        throw new Error('生成的图片没有内容（主要方法和备用方法都失败）');
                    }
                }

                // 创建下载链接
                const link = document.createElement('a');
                link.download = `MWI_Character_Card_${new Date().getTime()}.png`;
                link.href = canvas.toDataURL('image/png', 1.0);

                // 触发下载
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // 恢复按钮状态
                downloadBtn.textContent = originalText;
                downloadBtn.disabled = false;

                console.log('名片图片已生成并下载');

            } catch (error) {
                console.error('下载名片失败:', error);
                alert(isZH ?
                    '下载名片失败\n\n错误信息: ' + error.message + '\n\n建议：请确保网络连接正常，并允许浏览器下载文件' :
                    'Failed to download character card\n\nError: ' + error.message + '\n\nSuggestion: Please ensure network connection and allow browser downloads');

                // 恢复按钮状态
                const downloadBtn = document.querySelector('.download-card-btn');
                if (downloadBtn) {
                    downloadBtn.textContent = isZH ? '下载名片' : 'Download Card';
                    downloadBtn.disabled = false;
                }
            }
        }



        // 自动点击导出按钮的辅助函数
        async function autoClickExportButton() {
            try {
                console.log('尝试自动点击导出按钮...');

                // 查找导出按钮的多种可能选择器
                const exportButtonSelectors = [
                    // 中文版本的按钮文本
                    'button:contains("导出人物到剪贴板")',
                    // 英文版本的按钮文本
                    'button:contains("Export to clipboard")',
                ];

                let exportButton = null;

                // 尝试通过按钮文本查找（中文和英文）
                const allButtons = document.querySelectorAll('button');
                for (const button of allButtons) {
                    const buttonText = button.textContent.trim();
                    if (buttonText.includes('导出人物到剪贴板') ||
                        buttonText.includes('Export to clipboard')) {
                        exportButton = button;
                        break;
                    }
                }

                // 如果通过文本没找到，尝试其他属性
                if (!exportButton) {
                    for (const selector of exportButtonSelectors.slice(4)) { // 跳过contains选择器
                        try {
                            exportButton = document.querySelector(selector);
                            if (exportButton) {
                                console.log('通过选择器找到导出按钮:', selector);
                                break;
                            }
                        } catch (e) {
                            // 忽略选择器错误
                        }
                    }
                }

                if (!exportButton) {
                    console.log('未找到导出按钮，将直接尝试读取剪贴板');
                    return false;
                }

                // 检查按钮是否可点击
                if (exportButton.disabled || exportButton.style.display === 'none') {
                    console.log('导出按钮不可用，将直接尝试读取剪贴板');
                    return false;
                }

                // 点击按钮
                exportButton.click();
                console.log('已点击导出按钮，等待数据导出...');

                // 等待一段时间让数据导出到剪贴板
                await new Promise(resolve => setTimeout(resolve, 500));

                return true;
            } catch (error) {
                console.log('自动点击导出按钮失败:', error);
                return false;
            }
        }

        // 使用剪贴板数据生成名片（用于查看其他角色）
        async function showCharacterCard() {
            try {
                let characterData = null;
                let dataSource = isZH ? `剪贴板数据` : `Clipboard Data`;

                // 先尝试自动点击导出按钮
                const autoExportSuccess = await autoClickExportButton();

                const clipboardText = await readClipboardData();

                if (!clipboardText) {
                    const errorMessage = autoExportSuccess ?
                        (isZH ?
                            '已尝试自动导出，但无法读取剪贴板数据\n\n请确保：\n1. 允许浏览器访问剪贴板\n2. 等待导出完成后重试' :
                            'Auto export attempted, but cannot read clipboard data\n\nPlease ensure:\n1. Allow browser to access clipboard\n2. Wait for export to complete and retry'
                        ) :
                        (isZH ?
                            '无法读取剪贴板数据\n\n请确保：\n1. 先点击"导出人物到剪贴板"按钮\n2. 允许浏览器访问剪贴板\n3. 剪贴板中有有效的角色数据' :
                            'Cannot read clipboard data\n\nPlease ensure:\n1. Click "Export to clipboard" button first\n2. Allow browser to access clipboard\n3. Valid character data in clipboard'
                        );
                    alert(errorMessage);
                    return;
                }

                try {
                    characterData = JSON.parse(clipboardText);
                } catch (error) {
                    alert(isZH ?
                        '剪贴板中的数据不是有效的JSON格式\n\n请确保先点击"导出人物到剪贴板"按钮' :
                        'Data in clipboard is not valid JSON\n\nPlease ensure you clicked "Export to clipboard" button first');
                    return;
                }

                if (!isValidCharacterData(characterData)) {
                    alert(isZH ?
                        '剪贴板中的数据不包含有效的角色信息\n\n请确保使用MWI Tools的"导出人物到剪贴板"功能' :
                        'Data in clipboard does not contain valid character information\n\nPlease ensure you use MWI Tools "Export to clipboard" feature');
                    return;
                }

                // 重置调试信息
                state.debugInfo.firstSvgPath = null;
                state.debugInfo.iconCount = 0;

                const characterName = characterData.player?.name || characterData.character?.name || (isZH ? '角色' : 'Character');

                // 查找页面中的角色信息元素 - 获取最后一个（用于查看其他角色）
                let characterNameElement = null;
                const characterNameDivs = document.querySelectorAll('.CharacterName_characterName__2FqyZ');
                if (characterNameDivs.length > 0) {
                    // 取最后一个元素（用于查看其他角色）
                    const lastCharacterNameDiv = characterNameDivs[characterNameDivs.length - 1];
                    characterNameElement = lastCharacterNameDiv.outerHTML;
                }

                // 缓存剪贴板数据，用于布局切换
                state.clipboardCharacterData = {
                    data: characterData,
                    name: characterName,
                    nameElement: characterNameElement
                };

                const modal = document.createElement('div');
                modal.className = 'character-card-modal';
                modal.innerHTML = `
                    <div class="modal-content">
                        <button class="close-modal">&times;</button>
                        <div class="instruction-banner">
                            ${isZH ?
                                `MWI角色名片插件 v${VERSION} (数据来源: ${dataSource})` :
                                `MWI Character Card Plugin v${VERSION} (Data Source: ${dataSource})`
                            }
                        </div>
                        <div class="download-section">
                            <div class="button-row">
                                <button class="download-card-btn">${isZH ? '下载名片' : 'Download Card'}</button>
                                <button class="layout-toggle-btn">${getLayoutToggleText()}</button>
                            </div>
                        </div>
                        ${generateCharacterCard(characterData, characterName, characterNameElement, false)}
                    </div>
                `;

                modal.querySelector('.close-modal').onclick = () => document.body.removeChild(modal);
                modal.querySelector('.download-card-btn').onclick = downloadCharacterCard;
                modal.querySelector('.layout-toggle-btn').onclick = toggleLayoutMode;
                modal.onclick = (e) => { if (e.target === modal) document.body.removeChild(modal); };

                // 初始化布局切换按钮显示
                updateLayoutToggleButton();

                // 初始化模态框容器布局类名
                updateModalLayoutClass();

                // 添加技能槽点击事件监听器（仅场景2需要）
                const skillSlots = modal.querySelectorAll('.skill-slot, .empty-skill-slot');
                skillSlots.forEach(slot => {
                    slot.addEventListener('click', function() {
                        const skillIndex = parseInt(this.getAttribute('data-skill-index'));
                        showSkillSelector(skillIndex);
                    });
                });

                document.body.appendChild(modal);

            } catch (error) {
                console.error('生成角色名片失败:', error);
                alert(isZH ?
                    '生成角色名片时发生错误\n\n错误信息: ' + error.message :
                    'Error occurred while generating character card\n\nError: ' + error.message);
            }
        }

        // 使用WebSocket数据生成名片（用于查看当前角色）
        async function showMyCharacterCard() {
            try {
                // 获取当前角色名
                const currentCharacterName = window.characterCardWebSocketData?.characterName ||
                    window.characterCardWebSocketData?.name ||
                    (isZH ? '角色' : 'Character');

                // 检查是否需要重置技能配置（角色切换）
                const configKey = `mwi_skill_config_${currentCharacterName}`;
                const savedConfig = localStorage.getItem(configKey);

                if (savedConfig) {
                    // 有保存的配置，检查是否匹配当前角色
                    try {
                        const configData = JSON.parse(savedConfig);
                        if (configData.characterName === currentCharacterName) {
                            // 角色匹配，保持现有配置
                            console.log(`使用保存的技能配置: ${currentCharacterName}`);
                        } else {
                            // 角色不匹配，重置配置
                            state.customSkills.selectedSkills = [];
                            console.log(`角色切换，重置技能配置: ${currentCharacterName}`);
                        }
                    } catch (error) {
                        // 配置数据错误，重置
                        state.customSkills.selectedSkills = [];
                        console.log('配置数据错误，重置技能配置');
                    }
                } else {
                    // 没有保存的配置，重置
                    state.customSkills.selectedSkills = [];
                }

                let characterData = null;
                let dataSource = isZH ? `WS数据` : `WebSocket Data`;

                // 检查是否有WebSocket数据
                if (!window.characterCardWebSocketData) {
                    alert(isZH ?
                        '未找到当前角色数据\n\n请确保：\n1. 已登录游戏\n2. 等待游戏数据加载完成\n3. 刷新页面后重试' :
                        'No current character data found\n\nPlease ensure:\n1. You are logged into the game\n2. Wait for game data to load\n3. Refresh the page and try again');
                    return;
                }

                const parsedData = window.characterCardWebSocketData;

                if (parsedData && parsedData.type === "init_character_data") {
                    // 将WebSocket数据格式转换为角色名片插件需要的格式
                    characterData = {
                        player: {
                            name: parsedData.characterName || parsedData.name || (isZH ? '角色' : 'Character'),
                            equipment: parsedData.characterItems || [],
                            characterItems: parsedData.characterItems || [],
                            staminaLevel: parsedData.characterSkills?.find(s => s.skillHrid.includes('/skills/stamina'))?.level || 0,
                            intelligenceLevel: parsedData.characterSkills?.find(s => s.skillHrid.includes('/skills/intelligence'))?.level || 0,
                            attackLevel: parsedData.characterSkills?.find(s => s.skillHrid.includes('/skills/attack'))?.level || 0,
                            meleeLevel: getMeleeLevel(parsedData.characterSkills),
                            defenseLevel: parsedData.characterSkills?.find(s => s.skillHrid.includes('/skills/defense'))?.level || 0,
                            rangedLevel: parsedData.characterSkills?.find(s => s.skillHrid.includes('/skills/ranged'))?.level || 0,
                            magicLevel: parsedData.characterSkills?.find(s => s.skillHrid.includes('/skills/magic'))?.level || 0
                        },
                        abilities: parsedData.characterAbilities || [],
                        characterSkills: parsedData.characterSkills || [],
                        houseRooms: parsedData.characterHouseRoomMap || {},
                        characterHouseRoomMap: parsedData.characterHouseRoomMap || {}
                    };
                } else {
                    alert(isZH ?
                        'WebSocket数据格式不正确\n\n请刷新页面后重试' :
                        'WebSocket data format is incorrect\n\nPlease refresh the page and try again');
                    return;
                }

                if (!isValidCharacterData(characterData)) {
                    alert(isZH ?
                        'WebSocket数据不包含有效的角色信息\n\n请刷新页面后重试' :
                        'WebSocket data does not contain valid character information\n\nPlease refresh the page and try again');
                    return;
                }

                // 重置调试信息
                state.debugInfo.firstSvgPath = null;
                state.debugInfo.iconCount = 0;

                const characterName = characterData.player?.name || characterData.character?.name || (isZH ? '角色' : 'Character');

                // 查找页面中的角色信息元素 - 获取第一个（右上角的当前用户）
                let characterNameElement = null;
                const characterNameDivs = document.querySelectorAll('.CharacterName_characterName__2FqyZ');
                if (characterNameDivs.length > 0) {
                    // 取第一个元素（右上角的当前用户）
                    const firstCharacterNameDiv = characterNameDivs[0];
                    characterNameElement = firstCharacterNameDiv.outerHTML;
                }

                const modal = document.createElement('div');
                modal.className = 'character-card-modal';
                modal.innerHTML = `
                    <div class="modal-content">
                        <button class="close-modal">&times;</button>
                        <div class="instruction-banner">
                            ${isZH ?
                                `MWI角色名片插件 v${VERSION} (数据来源: ${dataSource})` :
                                `MWI Character Card Plugin v${VERSION} (Data Source: ${dataSource})`
                            }
                        </div>
                        <div class="download-section">
                            <div class="button-row">
                                <button class="download-card-btn">${isZH ? '下载名片' : 'Download Card'}</button>
                                <button class="save-skill-config-btn">${isZH ? '保存技能配置' : 'Save Skill Config'}</button>
                                <button class="load-skill-config-btn">${isZH ? '读取技能配置' : 'Load Skill Config'}</button>
                                <button class="layout-toggle-btn">${getLayoutToggleText()}</button>
                            </div>
                            <div class="skill-hint">
                                <span>${isZH ? '💡 点击技能图标可更换/添加展示的技能' : '💡 Click skill icons to change/add displayed skills'}</span>
                            </div>
                        </div>
                        ${generateCharacterCard(characterData, characterName, characterNameElement, true)}
                    </div>
                `;

                modal.querySelector('.close-modal').onclick = () => document.body.removeChild(modal);
                modal.querySelector('.download-card-btn').onclick = downloadCharacterCard;
                modal.querySelector('.layout-toggle-btn').onclick = toggleLayoutMode;
                modal.onclick = (e) => { if (e.target === modal) document.body.removeChild(modal); };

                // 初始化布局切换按钮显示
                updateLayoutToggleButton();

                // 初始化模态框容器布局类名
                updateModalLayoutClass();

                // 添加技能配置按钮事件监听器
                modal.querySelector('.save-skill-config-btn').onclick = () => {
                    saveSkillConfig(characterName);
                };
                modal.querySelector('.load-skill-config-btn').onclick = () => {
                    loadSkillConfig(characterName);
                };

                // 添加技能槽点击事件监听器
                const skillSlots = modal.querySelectorAll('.skill-slot, .empty-skill-slot');
                skillSlots.forEach(slot => {
                    slot.addEventListener('click', function() {
                        const skillIndex = parseInt(this.getAttribute('data-skill-index'));
                        showSkillSelector(skillIndex);
                    });
                });

                document.body.appendChild(modal);

            } catch (error) {
                console.error('生成我的角色名片失败:', error);
                alert(isZH ?
                    '生成我的角色名片时发生错误\n\n错误信息: ' + error.message :
                    'Error occurred while generating my character card\n\nError: ' + error.message);
            }
        }

        function addCharacterCardButton() {
            const checkElem = () => {
                const selectedElement = document.querySelector(`div.SharableProfile_overviewTab__W4dCV`);
                if (selectedElement) {
                    clearInterval(state.timer);
                    if (selectedElement.querySelector('.character-card-btn')) return;

                    const button = document.createElement("button");
                    button.className = 'character-card-btn';
                    button.textContent = isZH ? "查看角色名片" : "View Character Card";
                    button.style.cssText = `
                        border-radius: 6px; background-color: #17a2b8; color: white;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1); border: 0px;
                        display: inline-block; cursor: pointer; transition: all 0.2s ease;
                    `;

                    // 添加hover效果
                    button.addEventListener('mouseenter', () => {
                        button.style.backgroundColor = '#138496';
                        button.style.transform = 'translateY(-1px)';
                    });

                    button.addEventListener('mouseleave', () => {
                        button.style.backgroundColor = '#17a2b8';
                        button.style.transform = 'translateY(0)';
                    });

                    button.onclick = () => {
                        showCharacterCard();
                        return false;
                    };

                    // 创建按钮容器并居中
                    const buttonContainer = document.createElement('div');
                    buttonContainer.style.cssText = 'text-align: center;';
                    buttonContainer.appendChild(button);

                    // 插入按钮容器
                    selectedElement.appendChild(buttonContainer);

                    // 修改 SharableProfile_tabsComponentContainer__2T8DG 元素的高度
                    const tabsContainer = document.querySelector('.SharableProfile_tabsComponentContainer__2T8DG');
                    if (tabsContainer) {
                        tabsContainer.style.height = '34rem';
                    }

                    console.log('角色名片按钮已添加');
                    return false;
                }
            };
            state.timer = setInterval(checkElem, 1000);
        }

        // 在右上角角色信息区域添加"我的角色名片"按钮
        function addMyCharacterCardButton() {
            const checkMyButton = () => {
                const headerNameElements = document.querySelectorAll('.Header_name__227rJ');
                if (headerNameElements.length > 0) {
                    // 找到右上角的角色信息容器
                    const headerNameElement = headerNameElements[0];

                    // 检查是否已经添加过按钮
                    if (headerNameElement.querySelector('.my-character-card-btn')) {
                        return;
                    }

                    // 创建按钮
                    const myButton = document.createElement("button");
                    myButton.className = 'my-character-card-btn';
                    myButton.textContent = isZH ? "角色名片" : "Character Card";
                    myButton.style.cssText = `
                        border-radius: 4px; height: 14px; background-color: #28a745; color: white;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.2); border: 0px; margin-left: 4px;
                        display: inline-block; padding: 0 8px; font-size: 11px; cursor: pointer;
                        transition: all 0.2s ease; vertical-align: middle;
                    `;

                    // 添加hover效果
                    myButton.addEventListener('mouseenter', () => {
                        myButton.style.backgroundColor = '#218838';
                        myButton.style.transform = 'translateY(-1px)';
                    });

                    myButton.addEventListener('mouseleave', () => {
                        myButton.style.backgroundColor = '#28a745';
                        myButton.style.transform = 'translateY(0)';
                    });

                    myButton.onclick = () => {
                        showMyCharacterCard();
                        return false;
                    };

                    // 将按钮插入到Header_name容器中
                    headerNameElement.appendChild(myButton);

                    console.log('我的角色名片按钮已添加到右上角');
                    return false;
                }
            };

            // 使用定时器检查并添加按钮
            const myButtonTimer = setInterval(checkMyButton, 1000);

            // 清理定时器（当按钮添加成功后）
            setTimeout(() => {
                clearInterval(myButtonTimer);
            }, 10000); // 10秒后停止检查
        }

        // 在队伍信息区域添加“查看队伍名片”按钮
        function addPartyCardButton() {
            const checkParty = () => {
                const optionsEl = document.querySelector('.Party_partyOptions__3HGXK');
                if (!optionsEl) return;
                if (optionsEl.querySelector('.party-card-btn')) return;

                const btn = document.createElement('button');
                btn.className = 'party-card-btn';
                btn.textContent = isZH ? '查看队伍名片（仅限桌面端）' : 'View Party Cards (Desktop Only)';
                btn.style.cssText = `
                    border-radius: 2px; background-color: #28a745; color: white;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2); border: 0px; margin-left: 8px;
                    display: inline-block; padding: 0 8px; cursor: pointer;
                    transition: all 0.2s ease; vertical-align: middle;
                `;
                btn.addEventListener('mouseenter', () => { btn.style.backgroundColor = '#218838'; btn.style.transform = 'translateY(-1px)'; });
                btn.addEventListener('mouseleave', () => { btn.style.backgroundColor = '#28a745'; btn.style.transform = 'translateY(0)'; });
                btn.onclick = () => { showPartyCharacterCard(); return false; };

                // 包装成 div 与其他 div 同级显示
                const wrapperDiv = document.createElement('div');
                wrapperDiv.style.display = 'inline-block';
                wrapperDiv.appendChild(btn);
                optionsEl.appendChild(wrapperDiv);
                console.log('队伍名片按钮已添加');
            };
            // 初次尝试与后续监听
            const timer = setInterval(() => {
                if (document.querySelector('.Party_partyOptions__3HGXK')) {
                    clearInterval(timer);
                    checkParty();
                }
            }, 1000);

            // DOM 变化时重试插入
            const partyObserver = new MutationObserver(() => checkParty());
            partyObserver.observe(document.body, { childList: true, subtree: true });
        }

                 async function init() {
             console.log(`MWI角色名片插件 v${VERSION}`);
            console.log('使用说明：');
            console.log('1. 在角色信息界面点击"查看角色名片"按钮 - 使用剪贴板数据');
            console.log('2. 在右上角点击"我的角色名片"按钮 - 使用WebSocket数据');

            createModalStyles();
            createTeamStyles();
            const spritesLoaded = await state.svgTool.loadSpriteSheets();
            console.log(`图标系统初始化${spritesLoaded ? '成功' : '失败'}，将使用${spritesLoaded ? 'MWI原版SVG图标' : '后备图标显示'}`);
            if (spritesLoaded) {
                console.log('SVG Sprite文件:', state.svgTool.spriteSheets);
            }

            // 设置WebSocket Hook
            hookWebSocket();

            // 监听角色数据可用事件
            window.addEventListener('characterDataAvailable', function(event) {
                // 静默处理事件
            });

            addCharacterCardButton();
            addMyCharacterCardButton();
            addPartyCardButton();

            // 创建一个MutationObserver来监听body的子节点变化
            state.observer = new MutationObserver((mutationsList, observer) => {
                for(const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        // 检查是否是SharableProfile_overviewTab__W4dCV的子节点变化
                        if (mutation.target.classList.contains('SharableProfile_overviewTab__W4dCV')) {
                            // 延迟执行，确保DOM更新完成
                            setTimeout(addCharacterCardButton, 100);
                        }
                    }
                }
            });
            state.observer.observe(document.body, { childList: true, subtree: true });
        }

        // 清理函数
        function cleanup() {
            if (state.observer) {
                state.observer.disconnect();
                state.observer = null;
            }
            if (state.timer) {
                clearInterval(state.timer);
                state.timer = null;
            }
        }

        // 暴露数据给其他脚本的函数
        function exposeDataToOtherScripts() {
            // 创建一个全局函数，让MWI Tools可以调用
            window.exposeMWIToolsData = function(data) {
                window.mwiToolsData = data;
            };

            // 监听来自MWI Tools的消息
            window.addEventListener('message', function(event) {
                if (event.source === window && event.data && event.data.type === 'MWI_TOOLS_DATA') {
                    window.mwiToolsData = event.data.data;
                }
            });

            // 监听localStorage变化
            window.addEventListener('storage', function(event) {
                if (event.key === 'init_character_data' && event.newValue) {
                    try {
                        const data = JSON.parse(event.newValue);
                        window.mwiToolsData = data;
                    } catch (error) {
                        // 静默处理错误
                    }
                }
            });
        }

        // WebSocket Hook函数 - 参考MWI Tools的实现
        function hookWebSocket() {
            // 检查是否已经hook过
            if (window.characterCardWebSocketHooked) {
                return;
            }

            try {
                // 获取MessageEvent.prototype.data的属性描述符
                const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
                if (!dataProperty) {
                    return;
                }

                const oriGet = dataProperty.get;

                // 重写getter
                dataProperty.get = function() {
                    const socket = this.currentTarget;

                    // 检查是否是WebSocket连接
                    if (!(socket instanceof WebSocket)) {
                        return oriGet.call(this);
                    }

                    // 检查是否是MWI的WebSocket连接
                    if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 &&
                        socket.url.indexOf("api-test.milkywayidle.com/ws") <= -1 &&
                        socket.url.indexOf("api.milkywayidlecn.com/ws") <= -1) {
                        return oriGet.call(this);
                    }

                    // 获取原始消息
                    const message = oriGet.call(this);

                    // 防止循环调用
                    Object.defineProperty(this, "data", { value: message });

                    // 处理消息
                    handleWebSocketMessage(message);

                    return message;
                };

                // 重新定义属性
                Object.defineProperty(MessageEvent.prototype, "data", dataProperty);

                // 标记已hook
                window.characterCardWebSocketHooked = true;

            } catch (error) {
                // 静默处理错误
            }
        }

        // 处理WebSocket消息
        function handleWebSocketMessage(message) {
            try {
                const obj = JSON.parse(message);

                // 处理角色数据
                if (obj && obj.type === "init_character_data") {
                    console.log('=== 检测到角色数据 ===');
                    console.log('角色名称:', obj.characterName);
                    console.log('装备数量:', obj.characterItems?.length || 0);
                    console.log('技能数量:', obj.characterSkills?.length || 0);
                    console.log('能力数量:', obj.characterAbilities?.length || 0);
                    console.log('房屋数据:', obj.characterHouseRoomMap);
                    console.log('完整数据:', obj);

                    // 存储到全局变量
                    window.mwiToolsData = obj;
                    window.characterCardWebSocketData = obj;

                    // 存储到localStorage
                    try {
                        localStorage.setItem('init_character_data', message);
                        console.log('已存储到localStorage');
                    } catch (error) {
                        console.log('localStorage存储失败:', error);
                    }

                    // 触发数据可用事件
                    window.dispatchEvent(new CustomEvent('characterDataAvailable', {
                        detail: obj
                    }));

                    console.log('=== 角色数据处理完成 ===');
                } else if (obj && obj.type === 'profile_shared') {
                    // 存储队友 profile_shared 以便队伍名片使用
                    try {
                        let listStr = localStorage.getItem('profile_export_list');
                        let list = [];
                        try { list = listStr ? JSON.parse(listStr) : []; } catch {}
                        obj.characterID = obj.profile?.characterSkills?.[0]?.characterID;
                        obj.characterName = obj.profile?.sharableCharacter?.name;
                        obj.timestamp = Date.now();
                        list = (list || []).filter(it => it.characterID !== obj.characterID);
                        list.unshift(obj);
                        if (list.length > 20) list.pop();
                        localStorage.setItem('profile_export_list', JSON.stringify(list));
                        console.log('[队伍名片] 已保存队友资料 profile_shared: ', obj.characterName);
                    } catch (e) {
                        // 静默
                    }
                } else if (obj && obj.type === 'new_battle') {
                    // 可用于后续扩展（例如消耗品等）
                    try { localStorage.setItem('new_battle', message); } catch {}
                }

            } catch (error) {
                // 静默处理解析错误，不打印日志
            }
        }

        // 在脚本卸载时清理
        window.addEventListener('unload', cleanup);

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }

        // 初始化数据暴露机制
        exposeDataToOtherScripts();

        // 保存技能配置函数
        function saveSkillConfig(characterName) {
            try {
                const configKey = `mwi_skill_config_${characterName}`;

                // 只保存技能ID和位置，不保存等级
                const simplifiedSkills = state.customSkills.selectedSkills.map((skill, index) => ({
                    abilityHrid: skill.abilityHrid,
                    position: index
                }));

                const configData = {
                    characterName: characterName,
                    selectedSkills: simplifiedSkills,
                    timestamp: Date.now()
                };

                localStorage.setItem(configKey, JSON.stringify(configData));

                // 显示成功提示
                const saveBtn = document.querySelector('.save-skill-config-btn');
                const originalText = saveBtn.textContent;
                saveBtn.textContent = isZH ? '保存成功!' : 'Saved!';
                saveBtn.style.backgroundColor = '#28a745';

                setTimeout(() => {
                    saveBtn.textContent = originalText;
                    saveBtn.style.backgroundColor = '#17a2b8';
                }, 2000);

                console.log(`技能配置已保存: ${characterName}`);
            } catch (error) {
                console.error('保存技能配置失败:', error);
                alert(isZH ? '保存技能配置失败' : 'Failed to save skill config');
            }
        }

        // 读取技能配置函数
        function loadSkillConfig(characterName) {
            try {
                const configKey = `mwi_skill_config_${characterName}`;
                const savedConfig = localStorage.getItem(configKey);

                if (!savedConfig) {
                    alert(isZH ?
                        `未找到角色 "${characterName}" 的技能配置\n\n请先保存技能配置` :
                        `No skill config found for character "${characterName}"\n\nPlease save skill config first`);
                    return false;
                }

                const configData = JSON.parse(savedConfig);

                // 验证配置数据
                if (!configData.selectedSkills || !Array.isArray(configData.selectedSkills)) {
                    alert(isZH ? '技能配置数据格式错误' : 'Invalid skill config data format');
                    return false;
                }

                // 从WebSocket数据获取最新技能信息并应用配置
                const allSkills = window.characterCardWebSocketData?.characterAbilities || [];
                const restoredSkills = [];

                configData.selectedSkills.forEach(savedSkill => {
                    if (savedSkill.abilityHrid) {
                        // 从WebSocket数据中找到对应的技能
                        const currentSkill = allSkills.find(skill =>
                            skill.abilityHrid === savedSkill.abilityHrid
                        );

                        if (currentSkill) {
                            // 使用最新的等级信息
                            restoredSkills[savedSkill.position] = {
                                abilityHrid: currentSkill.abilityHrid,
                                level: currentSkill.level,
                                slotNumber: currentSkill.slotNumber
                            };
                        }
                    }
                });

                // 应用恢复的技能配置
                state.customSkills.selectedSkills = restoredSkills;

                // 重新生成技能面板
                const characterCard = document.querySelector('#character-card');
                if (characterCard) {
                    const skillPanel = characterCard.querySelector('.skill-panel');
                    if (skillPanel) {
                        const characterData = {
                            abilities: window.characterCardWebSocketData?.characterAbilities || [],
                            characterSkills: window.characterCardWebSocketData?.characterSkills || []
                        };
                        const newSkillPanel = generateSkillPanel(characterData, true);
                        skillPanel.innerHTML = newSkillPanel.replace(/<div class="skill-panel">([\s\S]*?)<\/div>$/, '$1');

                        // 重新添加事件监听器
                        const skillSlots = skillPanel.querySelectorAll('.skill-slot, .empty-skill-slot');
                        skillSlots.forEach(slot => {
                            slot.addEventListener('click', function() {
                                const skillIndex = parseInt(this.getAttribute('data-skill-index'));
                                showSkillSelector(skillIndex);
                            });
                        });
                    }
                }

                // 显示成功提示
                const loadBtn = document.querySelector('.load-skill-config-btn');
                const originalText = loadBtn.textContent;
                loadBtn.textContent = isZH ? '读取成功!' : 'Loaded!';
                loadBtn.style.backgroundColor = '#28a745';

                setTimeout(() => {
                    loadBtn.textContent = originalText;
                    loadBtn.style.backgroundColor = '#17a2b8';
                }, 2000);

                console.log(`技能配置已读取: ${characterName}`);
                return true;
            } catch (error) {
                console.error('读取技能配置失败:', error);
                alert(isZH ? '读取技能配置失败' : 'Failed to load skill config');
                return false;
            }
        }

        // 将函数暴露到全局作用域
        if (typeof window !== 'undefined') {
            window.showSkillSelector = showSkillSelector;
            window.selectSkill = selectSkill;
        }

    })(); // 结束立即执行函数

})();