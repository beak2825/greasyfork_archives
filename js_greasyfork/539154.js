// ==UserScript==
// @name         DeepDanbooru 魔法串生成器
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  基于DeepDanbooru生成nai魔法串
// @author       a1606
// @license      MIT
// @match        http://dev.kanotype.net:8003/deepdanbooru/view/general/*
// @match        http://dev.kanotype.net:8003/deepdanbooru/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @connect      translation.googleapis.com
// @connect      translate.googleapis.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539154/DeepDanbooru%20%E9%AD%94%E6%B3%95%E4%B8%B2%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/539154/DeepDanbooru%20%E9%AD%94%E6%B3%95%E4%B8%B2%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STATE = {
        roles: [],
        presets: [],
        artists: [],
        ignore: [],
        selectedRoles: new Set(),
        selectedPresets: new Set(),
        selectedArtists: new Set(),
        selectedTags: new Set(),
        googleApiKey: '',
        envs: [],
        cameras: [],
        clothes: [],
        actions: [],
        expressions: [],
        selectedEnvs: new Set(),
        selectedCameras: new Set(),
        selectedClothes: new Set(),
        selectedActions: new Set(),
        selectedExpressions: new Set(),
        others: [],
        selectedOthers: new Set(),
        subcatExpandStates: {},
        subcatOrder: {},
    };

    async function loadStorage() {
        STATE.roles = await GM_getValue('custom_roles', []);
        STATE.presets = await GM_getValue('custom_presets', []);
        STATE.artists = await GM_getValue('custom_artists', []);
        STATE.ignore = await GM_getValue('ignored_tags', []);
        STATE.selectedRoles = new Set(await GM_getValue('selected_roles', []));
        STATE.selectedPresets = new Set(await GM_getValue('selected_presets', []));
        STATE.selectedArtists = new Set(await GM_getValue('selected_artists', []));
        STATE.selectedTags = new Set(await GM_getValue('selected_tags', []));
        STATE.googleApiKey = await GM_getValue('google_api_key', '');
        STATE.envs = await GM_getValue('custom_envs', []);
        STATE.cameras = await GM_getValue('custom_cameras', []);
        STATE.clothes = await GM_getValue('custom_clothes', []);
        STATE.actions = await GM_getValue('custom_actions', []);
        STATE.expressions = await GM_getValue('custom_expressions', []);
        STATE.selectedEnvs = new Set(await GM_getValue('selected_envs', []));
        STATE.selectedCameras = new Set(await GM_getValue('selected_cameras', []));
        STATE.selectedClothes = new Set(await GM_getValue('selected_clothes', []));
        STATE.selectedActions = new Set(await GM_getValue('selected_actions', []));
        STATE.selectedExpressions = new Set(await GM_getValue('selected_expressions', []));
        STATE.others = await GM_getValue('custom_others', []);
        STATE.selectedOthers = new Set(await GM_getValue('selected_others', []));
        STATE.subcatExpandStates = await GM_getValue('subcat_expand_states', {});
        STATE.subcatOrder = await GM_getValue('subcat_order', {});
        function cleanSelectedSet(list, selectedSet) {
            const valid = new Set();
            function collect(list) {
                for (const item of list) {
                    if (typeof item === 'object' && item.__subcat && Array.isArray(item.items)) {
                        collect(item.items);
                    } else if (typeof item === 'string') {
                        valid.add(item);
                    }
                }
            }
            collect(list);
            for (const v of Array.from(selectedSet)) {
                if (!valid.has(v)) selectedSet.delete(v);
            }
        }
        cleanSelectedSet(STATE.roles, STATE.selectedRoles);
        cleanSelectedSet(STATE.presets, STATE.selectedPresets);
        cleanSelectedSet(STATE.artists, STATE.selectedArtists);
        cleanSelectedSet(STATE.envs, STATE.selectedEnvs);
        cleanSelectedSet(STATE.cameras, STATE.selectedCameras);
        cleanSelectedSet(STATE.clothes, STATE.selectedClothes);
        cleanSelectedSet(STATE.actions, STATE.selectedActions);
        cleanSelectedSet(STATE.expressions, STATE.selectedExpressions);
        cleanSelectedSet(STATE.others, STATE.selectedOthers);
    }

    async function saveStorage() {
        await GM_setValue('custom_roles', STATE.roles);
        await GM_setValue('custom_presets', STATE.presets);
        await GM_setValue('custom_artists', STATE.artists);
        await GM_setValue('ignored_tags', STATE.ignore);
        await GM_setValue('selected_roles', [...STATE.selectedRoles]);
        await GM_setValue('selected_presets', [...STATE.selectedPresets]);
        await GM_setValue('selected_artists', [...STATE.selectedArtists]);
        await GM_setValue('selected_tags', [...STATE.selectedTags]);
        await GM_setValue('google_api_key', STATE.googleApiKey);
        await GM_setValue('custom_envs', STATE.envs);
        await GM_setValue('custom_cameras', STATE.cameras);
        await GM_setValue('custom_clothes', STATE.clothes);
        await GM_setValue('custom_actions', STATE.actions);
        await GM_setValue('custom_expressions', STATE.expressions);
        await GM_setValue('selected_envs', [...STATE.selectedEnvs]);
        await GM_setValue('selected_cameras', [...STATE.selectedCameras]);
        await GM_setValue('selected_clothes', [...STATE.selectedClothes]);
        await GM_setValue('selected_actions', [...STATE.selectedActions]);
        await GM_setValue('selected_expressions', [...STATE.selectedExpressions]);
        await GM_setValue('custom_others', STATE.others);
        await GM_setValue('selected_others', [...STATE.selectedOthers]);
        await GM_setValue('subcat_expand_states', STATE.subcatExpandStates);
        await GM_setValue('subcat_order', STATE.subcatOrder);
    }

    function splitNoteAndContent(item) {
        const idx = item.indexOf('::');
        return idx !== -1 ? [item.slice(0, idx), item.slice(idx + 2)] : [null, item];
    }

    function createButtonBar(tagTable) {
        const wrapper = document.createElement('div');
        wrapper.style.margin = '10px 0';

        const copyBtn = document.createElement('button');
        copyBtn.textContent = '🧙 生成魔法串';
        copyBtn.style.marginRight = '10px';

        const settingBtn = document.createElement('button');
        settingBtn.textContent = '⚙️ 设置';

        const translateBtn = document.createElement('button');
        translateBtn.textContent = '🌐翻译Tag';
        translateBtn.style.marginLeft = '10px';
        translateBtn.onclick = () => translateTagsGoogle();

        copyBtn.onclick = () => generateMagic(tagTable);
        settingBtn.onclick = openSettingsPanel;

        wrapper.append(copyBtn, settingBtn, translateBtn);
        tagTable.parentNode.insertBefore(wrapper, tagTable);

        const saveRow = document.createElement('div');
        saveRow.style.margin = '10px 0 0 0';
        saveRow.style.display = 'flex';
        saveRow.style.alignItems = 'center';

        const noteInput = document.createElement('input');
        noteInput.type = 'text';
        noteInput.placeholder = '备注';
        noteInput.style.flex = '1';
        noteInput.style.marginRight = '8px';

        const savePresetBtn = document.createElement('button');
        savePresetBtn.textContent = '保存到预设';
        savePresetBtn.style.marginRight = '0';

        saveRow.appendChild(noteInput);
        saveRow.appendChild(savePresetBtn);
        wrapper.appendChild(saveRow);

        const selectAllRow = document.createElement('div');
        selectAllRow.style.display = 'flex';
        selectAllRow.style.alignItems = 'center';
        selectAllRow.style.margin = '4px 0 0 0';

        const selectAllCheckbox = document.createElement('input');
        selectAllCheckbox.type = 'checkbox';
        selectAllCheckbox.id = 'select-all-general';
        selectAllCheckbox.style.marginRight = '4px';

        const selectAllLabel = document.createElement('label');
        selectAllLabel.textContent = ' 全选';
        selectAllLabel.htmlFor = 'select-all-general';

        selectAllRow.appendChild(selectAllCheckbox);
        selectAllRow.appendChild(selectAllLabel);
        wrapper.appendChild(selectAllRow);

        const rows = tagTable.querySelectorAll('tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2) {
                let tag = cells[0].textContent.trim();
                if (!cells[0].querySelector('input[type="checkbox"]')) {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = true;
                    checkbox.style.marginRight = '6px';
                    cells[0].prepend(checkbox);
                    checkbox.dataset.tag = tag;

                    const groupTitle = row.closest('tbody')?.previousElementSibling?.textContent?.trim();
                    if (groupTitle === 'Character Tags' || groupTitle === 'System Tags') {
                        checkbox.checked = false;
                    }

                    for (const entry of STATE.ignore) {
                        const [, content] = splitNoteAndContent(entry);
                        if (tag === content && STATE.selectedTags.has(entry)) {
                            checkbox.checked = false;
                            break;
                        }
                    }
                }
            }
        });

        function getGeneralTagCheckboxes() {
            const tbodies = tagTable.querySelectorAll('tbody');
            for (const tbody of tbodies) {
                const title = tbody.previousElementSibling?.textContent?.trim();
                if (title === 'General Tags') {
                    return Array.from(tbody.querySelectorAll('input[type="checkbox"]'));
                }
            }
            return [];
        }

        selectAllCheckbox.onchange = function() {
            const checkboxes = getGeneralTagCheckboxes();
            checkboxes.forEach(cb => cb.checked = selectAllCheckbox.checked);
        };

        function syncSelectAllCheckbox() {
            const checkboxes = getGeneralTagCheckboxes();
            if (checkboxes.length === 0) {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = false;
                return;
            }
            const checkedCount = checkboxes.filter(cb => cb.checked).length;
            if (checkedCount === checkboxes.length) {
                selectAllCheckbox.checked = true;
                selectAllCheckbox.indeterminate = false;
            } else if (checkedCount === 0) {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = false;
            } else {
                selectAllCheckbox.checked = false;
                selectAllCheckbox.indeterminate = true;
            }
        }

        setTimeout(() => {
            const checkboxes = getGeneralTagCheckboxes();
            checkboxes.forEach(cb => {
                cb.addEventListener('change', syncSelectAllCheckbox);
            });
            syncSelectAllCheckbox();
        }, 0);
    }

    function translateTagsGoogle() {
        const rows = document.querySelectorAll('table tr');
        const tagPairs = [];
        const texts = [];

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2) {
                const tag = cells[0].textContent.trim();
                if (!tag.includes(':') && !row.querySelector('.tag-zh')) {
                    const readable = tag.replace(/_/g, ' ');
                    tagPairs.push({ tag, readable, cell: cells[0] });
                    texts.push(readable);
                }
            }
        });

        if (texts.length === 0) return;

        function fallbackTranslate() {
            const batchSize = 40;
            let completed = 0;
            let allTranslations = [];
            function handleBatch(start) {
                const batch = texts.slice(start, start + batchSize);
                if (batch.length === 0) {
                    if (allTranslations.length !== tagPairs.length) {
                        alert('备用翻译结果数量不一致');
                        return;
                    }
                    tagPairs.forEach((pair, i) => {
                        const el = document.createElement('span');
                        el.className = 'tag-zh';
                        el.textContent = `（${allTranslations[i]}）`;
                        el.style.marginLeft = '6px';
                        el.style.color = '#888';
                        el.style.fontSize = '0.9em';
                        pair.cell.appendChild(el);
                    });
                    return;
                }
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=${encodeURIComponent(batch.join('\n'))}`,
                    onload: res => {
                        try {
                            const json = JSON.parse(res.responseText);
                            const translations = json[0].map(item => item[0].replace(/\\n/g, ''));
                            allTranslations = allTranslations.concat(translations);
                            handleBatch(start + batchSize);
                        } catch (e) {
                            alert('备用Google翻译失败：' + e.message);
                        }
                    },
                    onerror: () => alert('无法连接备用Google翻译接口，请检查网络环境')
                });
            }
            handleBatch(0);
        }
        if (!STATE.googleApiKey) {
            fallbackTranslate();
            return;
        }

        GM_xmlhttpRequest({
            method: "POST",
            url: `https://translation.googleapis.com/language/translate/v2?key=${STATE.googleApiKey}`,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({
                q: texts,
                source: "en",
                target: "zh-CN",
                format: "text"
            }),
            onload: res => {
                try {
                    const json = JSON.parse(res.responseText);
                    if (json.error) throw new Error(json.error.message);

                    const translations = json.data?.translations;
                    if (!Array.isArray(translations) || translations.length !== tagPairs.length) {
                        throw new Error("翻译结果数量不一致");
                    }
                    tagPairs.forEach((pair, i) => {
                        const el = document.createElement('span');
                        el.className = 'tag-zh';
                        el.textContent = `（${translations[i].translatedText}）`;
                        el.style.marginLeft = '6px';
                        el.style.color = '#888';
                        el.style.fontSize = '0.9em';
                        pair.cell.appendChild(el);
                    });
                } catch (e) {
                    fallbackTranslate();
                }
            },
            onerror: () => {
                fallbackTranslate();
            }
        });
    }

    function shouldIgnore(tag) {
        for (const entry of STATE.ignore) {
            const [, content] = splitNoteAndContent(entry);
            const tags = content.split(',').map(t => t.trim()).filter(Boolean);
            for (const t of tags) {
                if (tag === t && STATE.selectedTags.has(entry)) {
                    return true;
                }
            }
        }
        return false;
    }

    function generateMagic(tagTable, previewOnly = false) {
        let mainSiteTagStr = '';
        if (tagTable) {
            const rows = tagTable.querySelectorAll('tr');
            const tags = [];
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 2) {
                    const checkbox = cells[0].querySelector('input[type="checkbox"]');
                    if (!checkbox) return;
                    let tag = checkbox.dataset.tag;
                    const score = cells[1].textContent.trim();
                    if (checkbox && checkbox.checked) {
                        tags.push(`${tag}:${score}`);
                    }
                }
            });
            mainSiteTagStr = tags.join(', ');
            if (mainSiteTagStr.length > 0 && !mainSiteTagStr.endsWith(',')) mainSiteTagStr += ',';
        }

        const panel = document.querySelector('#magic-settings');
        let roleStr = '', presetStr = '', artistStr = '';
        let envStr = '', cameraStr = '', clothesStr = '', actionStr = '', expressionStr = '', otherStr = '';
        if (panel) {
            const visibleManager = Array.from(panel.querySelectorAll('.draggable-item'))
                .filter(item => item.offsetParent !== null);
            const arr = [];
            visibleManager.forEach(row => {
                const checkbox = row.querySelector('input[type="checkbox"]');
                if (checkbox && checkbox.checked) {
                    const span = row.querySelector('span');
                    const textarea = row.querySelector('textarea');
                    let value = '';
                    if (span && textarea && textarea.value) value = textarea.value;
                    else if (span) value = span.textContent;
                    if (value) arr.push(value);
                }
            });
            const activeTabBtn = panel.querySelector('button[style*="background"]');
            const activeTab = activeTabBtn ? activeTabBtn.textContent : '';
            if (activeTab === '角色') roleStr = arr.join(' ');
            if (activeTab === '预设') presetStr = arr.join(' ');
            if (activeTab === '艺术家') artistStr = arr.join(' ');
            if (activeTab === '环境') envStr = arr.join(' ');
            if (activeTab === '镜头') cameraStr = arr.join(' ');
            if (activeTab === '服饰') clothesStr = arr.join(' ');
            if (activeTab === '动作') actionStr = arr.join(' ');
            if (activeTab === '表情') expressionStr = arr.join(' ');
            if (activeTab === '其他') otherStr = arr.join(' ');
        }

        if (!roleStr && STATE.selectedRoles.size > 0)
            roleStr = [...STATE.selectedRoles].map(e => splitNoteAndContent(e)[1]).join(' ');
        if (!presetStr && STATE.selectedPresets.size > 0)
            presetStr = [...STATE.selectedPresets].map(e => splitNoteAndContent(e)[1]).join(' ');
        if (!artistStr && STATE.selectedArtists.size > 0)
            artistStr = [...STATE.selectedArtists].map(e => splitNoteAndContent(e)[1]).join(' ');
        if (!envStr && STATE.selectedEnvs.size > 0)
            envStr = [...STATE.selectedEnvs].map(e => splitNoteAndContent(e)[1]).join(' ');
        if (!cameraStr && STATE.selectedCameras.size > 0)
            cameraStr = [...STATE.selectedCameras].map(e => splitNoteAndContent(e)[1]).join(' ');
        if (!clothesStr && STATE.selectedClothes.size > 0)
            clothesStr = [...STATE.selectedClothes].map(e => splitNoteAndContent(e)[1]).join(' ');
        if (!actionStr && STATE.selectedActions.size > 0)
            actionStr = [...STATE.selectedActions].map(e => splitNoteAndContent(e)[1]).join(' ');
        if (!expressionStr && STATE.selectedExpressions.size > 0)
            expressionStr = [...STATE.selectedExpressions].map(e => splitNoteAndContent(e)[1]).join(' ');
        if (!otherStr && STATE.selectedOthers.size > 0)
            otherStr = [...STATE.selectedOthers].map(e => splitNoteAndContent(e)[1]).join(' ');

        const parts = [];
        if (roleStr) parts.push(roleStr);
        if (presetStr) parts.push(presetStr);
        if (envStr) parts.push(envStr);
        if (cameraStr) parts.push(cameraStr);
        if (clothesStr) parts.push(clothesStr);
        if (actionStr) parts.push(actionStr);
        if (expressionStr) parts.push(expressionStr);
        if (otherStr) parts.push(otherStr);
        if (mainSiteTagStr) parts.push(mainSiteTagStr);
        if (artistStr) parts.push(artistStr);
        const final = parts.join('\n');

        if (!previewOnly) {
            GM_setClipboard(final);
            alert('✅ 魔法串已复制！');
        }
        return final;
    }

    function isTagVisible(tag) {
        const allCheckboxes = document.querySelectorAll('.draggable-item input[type="checkbox"]');
        for (const cb of allCheckboxes) {
            if (cb.dataset && cb.dataset.tagValue === tag && cb.checked && cb.offsetParent !== null) {
                return true;
            }
        }
        return false;
    }

    function createManager(label, key, list, selectedSet, isTextOnly = false, rerenderParent) {
        const wrapper = document.createElement('div');
        wrapper.style.margin = '10px 0';
        wrapper.classList.add('magic-manager-root');

        const subRow = document.createElement('div');
        subRow.style.display = 'flex';
        subRow.style.alignItems = 'center';
        subRow.style.marginBottom = '4px';
        const subInput = document.createElement('input');
        subInput.placeholder = '子类别';
        subInput.style.marginRight = '5px';
        subInput.style.flex = '1';
        const addSubBtn = document.createElement('button');
        addSubBtn.textContent = '添加分组';
        addSubBtn.style.width = '90px';
        addSubBtn.style.height = '30px';
        addSubBtn.onclick = async () => {
            const subName = subInput.value.trim();
            if (!subName) return;
            const subObj = { __subcat: true, name: subName, items: [] };
            list.push(subObj);
            await saveStorage();
            wrapper.append(renderSubCategory(subObj, selectedSet, list, isTextOnly, list, key));
            subInput.value = '';
        };
        subRow.append(subInput, addSubBtn);
        wrapper.append(subRow);

        const row1 = document.createElement('div');
        row1.style.display = 'flex';
        row1.style.alignItems = 'center';
        row1.style.marginBottom = '4px';
        const row2 = document.createElement('div');
        row2.style.display = 'flex';
        row2.style.alignItems = 'center';
        const noteInput = document.createElement('input');
        noteInput.placeholder = `备注`;
        noteInput.style.marginRight = '5px';
        noteInput.style.flex = '1';
        const addBtn = document.createElement('button');
        addBtn.textContent = '添加';
        addBtn.style.width = '50px';
        addBtn.style.height = '30px';
        addBtn.onclick = async () => {
            const note = noteInput.value.trim();
            const content = contentInput.value.trim();
            const final = note ? `${note}::${content}` : content;
            if (content && !list.includes(final)) {
                list.push(final);
                if (selectedSet) selectedSet.add(final);
                await saveStorage();
                ungroupedWrap.append(renderItemRow(final, selectedSet, list, isTextOnly, list));
                noteInput.value = '';
                contentInput.value = '';
            }
        };
        const contentInput = document.createElement('textarea');
        contentInput.placeholder = `内容（将作为输出 tag）`;
        contentInput.style.flex = '1';
        contentInput.style.height = '96px';
        contentInput.style.overflowY = 'scroll';
        contentInput.style.resize = 'none';
        row1.append(noteInput, addBtn);
        row2.append(contentInput);
        wrapper.append(row1, row2);

        const ungroupedWrap = document.createElement('div');
        ungroupedWrap.style.margin = '8px 0';
        ungroupedWrap.style.padding = '4px';
        ungroupedWrap.style.border = '1px dashed #ccc';
        ungroupedWrap.style.background = '#f8f8f8';
        enableTagSortingAndMoving(ungroupedWrap, list, null, key, () => {
            const root = document.querySelector('.magic-manager-root');
            if (root && root.parentNode) {
                const newManager = createManager(label, key, list, selectedSet, isTextOnly, rerenderParent);
                root.parentNode.replaceChild(newManager, root);
            }
        });
        list.forEach(item => {
            if (typeof item !== 'object') {
                ungroupedWrap.append(renderItemRow(item, selectedSet, list, isTextOnly, list));
            }
        });
        wrapper.append(ungroupedWrap);

        const subcats = list.filter(item => typeof item === 'object' && item.__subcat);
        let subcatOrderArr = [];
        if (key && STATE.subcatOrder && STATE.subcatOrder[key]) {
            subcatOrderArr = STATE.subcatOrder[key].filter(name => subcats.some(s => s.name === name));
        }
        const orderedSubcats = [
            ...subcatOrderArr.map(name => subcats.find(s => s.name === name)).filter(Boolean),
            ...subcats.filter(s => !subcatOrderArr.includes(s.name))
        ];
        const subcatSortWrap = document.createElement('div');
        subcatSortWrap.className = 'subcat-sort-wrap';
        subcatSortWrap.style.display = 'flex';
        subcatSortWrap.style.flexDirection = 'column';
        subcatSortWrap.style.gap = '0px';
        orderedSubcats.forEach(subcat => {
            subcatSortWrap.append(renderSubCategory(subcat, selectedSet, list, isTextOnly, list, key));
        });
        enableSubcatSorting(subcatSortWrap, key, list, () => {
            const root = document.querySelector('.magic-manager-root');
            if (root && root.parentNode) {
                const newManager = createManager(label, key, list, selectedSet, isTextOnly, rerenderParent);
                root.parentNode.replaceChild(newManager, root);
            }
        });
        wrapper.append(subcatSortWrap);
        return wrapper;
    }

    function renderItemRow(item, selectedSet, list, isTextOnly, rootList) {
        const row = document.createElement('div');
        row.className = 'draggable-item';
        row.draggable = true;
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.marginTop = '4px';
        row.style.flexDirection = 'column';
        row.style.border = '1px dashed #ccc';
        row.style.padding = '2px';
        row.dataset.tagValue = item;
        row.dataset.from = Array.isArray(list) && list !== rootList ? 'subcat' : 'root';
        row.addEventListener('dragstart', e => {
            if (
                e.target.tagName === 'INPUT' ||
                e.target.tagName === 'TEXTAREA' ||
                e.target.closest('input, textarea')
            ) {
                e.preventDefault();
                return false;
            }
        });
        row.addEventListener('mouseover', e => {
            if (
                e.target.tagName === 'INPUT' ||
                e.target.tagName === 'TEXTAREA' ||
                e.target.closest('input, textarea')
            ) {
                row.draggable = false;
            }
        });
        row.addEventListener('mouseout', e => {
            if (
                e.target.tagName === 'INPUT' ||
                e.target.tagName === 'TEXTAREA' ||
                e.target.closest('input, textarea')
            ) {
                row.draggable = true;
            }
        });

        const [note, content] = splitNoteAndContent(item);

        const top = document.createElement('div');
        top.style.display = 'flex';
        top.style.alignItems = 'center';
        top.style.width = '100%';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = selectedSet?.has(item);
        checkbox.disabled = isTextOnly && !selectedSet;
        checkbox.onchange = async () => {
            if (checkbox.checked) selectedSet.add(item);
            else selectedSet.delete(item);
            await saveStorage();
        };

        const label = document.createElement('span');
        label.textContent = note || content;
        label.style.margin = '0 5px';
        label.style.flex = '1';

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '▸';
        toggleBtn.style.border = 'none';
        toggleBtn.style.background = 'transparent';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.height = '24px';
        toggleBtn.style.width = '24px';
        toggleBtn.style.padding = '0';
        toggleBtn.onclick = () => {
            const expanded = toggleBtn.textContent === '▾';
            toggleBtn.textContent = expanded ? '▸' : '▾';
            detailBox.style.display = expanded ? 'none' : 'block';
        };

        const delBtn = document.createElement('button');
        delBtn.textContent = '✖';
        delBtn.style.border = 'none';
        delBtn.style.background = 'transparent';
        delBtn.style.fontSize = '10px';
        delBtn.style.width = '24px';
        delBtn.style.height = '24px';
        delBtn.onclick = async () => {
            if (!confirm(`是否要删除${note || content}？`)) return;
            const idx = list.indexOf(item);
            if (idx > -1) list.splice(idx, 1);
            selectedSet?.delete(item);
            if (rootList && Array.isArray(rootList)) {
                for (const entry of rootList) {
                    if (typeof entry === 'object' && entry.__subcat && entry.items) {
                        selectedSet?.delete(item);
                    }
                }
            }
            await saveStorage();
            row.remove();
        };

        const detailBox = document.createElement('textarea');
        detailBox.style.display = 'none';
        detailBox.style.fontSize = '12px';
        detailBox.style.color = '#333';
        detailBox.style.margin = '5px 0 0 20px';
        detailBox.style.width = '90%';
        detailBox.style.height = '96px';
        detailBox.style.overflowY = 'scroll';
        detailBox.style.resize = 'none';
        detailBox.value = content;
        detailBox.addEventListener('blur', async () => {
            let newVal = detailBox.value.trim();
            let newItem = note ? `${note}::${newVal}` : newVal;
            const idx = list.indexOf(item);
            if (idx > -1 && newItem !== item) {
                if (rootList && Array.isArray(rootList)) {
                    for (let i = 0; i < rootList.length; i++) {
                        const entry = rootList[i];
                        if (typeof entry === 'object' && entry.__subcat && Array.isArray(entry.items)) {
                            const subIdx = entry.items.indexOf(item);
                            if (subIdx > -1) entry.items.splice(subIdx, 1);
                        } else if (entry === item) {
                            rootList.splice(i, 1); i--;
                        }
                    }
                }
                list.splice(idx, 1, newItem);
                if (selectedSet) {
                    selectedSet.delete(item);
                    selectedSet.add(newItem);
                }
                await saveStorage();
                row.dataset.tagValue = newItem;
            }
        });

        top.append(checkbox, label, toggleBtn, delBtn);
        row.append(top, detailBox);

        return row;
    }

    function renderSubCategory(subObj, selectedSet, parentList, isTextOnly, rootList, key) {
        const subWrap = document.createElement('div');
        subWrap.className = 'subcat-dropzone';
        subWrap.subcatObj = subObj;
        subWrap.style.border = '1px solid #bbb';
        subWrap.style.margin = '6px 0';
        subWrap.style.padding = '4px';
        subWrap.style.background = '#fafbfc';
        subWrap.style.borderRadius = '4px';
        subWrap.style.position = 'relative';
        subWrap.draggable = false;
        const head = document.createElement('div');
        head.style.display = 'flex';
        head.style.alignItems = 'center';
        head.style.cursor = 'pointer';
        head.style.fontWeight = 'bold';
        head.style.marginBottom = '4px';
        const toggle = document.createElement('span');
        toggle.textContent = '▾';
        toggle.style.marginRight = '6px';
        let expanded = true;
        if (STATE.subcatExpandStates && typeof subObj.name === 'string') {
            if (subObj.name in STATE.subcatExpandStates) expanded = STATE.subcatExpandStates[subObj.name];
        }
        toggle.textContent = expanded ? '▾' : '▸';
        head.onclick = async () => {
            expanded = !expanded;
            toggle.textContent = expanded ? '▾' : '▸';
            body.style.display = expanded ? '' : 'none';
            if (typeof subObj.name === 'string') {
                STATE.subcatExpandStates[subObj.name] = expanded;
                await saveStorage();
            }
        };
        const name = document.createElement('span');
        name.textContent = subObj.name;
        name.style.flex = '1';
        name.style.cursor = 'grab';
        name.draggable = true;
        name.addEventListener('dragstart', e => {
            if (e.target === name) {
                subWrap.draggable = true;
                subWrap.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                window.__draggingSubcatName = subObj.name;
            } else {
                subWrap.draggable = false;
            }
        });
        name.addEventListener('dragend', e => {
            subWrap.draggable = false;
            subWrap.classList.remove('dragging');
            window.__draggingSubcatName = null;
        });
        name.addEventListener('dragover', e => {
            if (window.__draggingTagValue) {
                e.preventDefault();
                subWrap.classList.add('drag-over');
            }
        });
        name.addEventListener('dragleave', e => {
            if (window.__draggingTagValue) {
                subWrap.classList.remove('drag-over');
            }
        });
        name.addEventListener('drop', async e => {
            if (window.__draggingTagValue) {
                e.preventDefault();
                subWrap.classList.remove('drag-over');
                let allList = rootList;
                if (key && STATE && STATE[key]) allList = STATE[key];
                if (allList) {
                    for (const item of allList) {
                        if (typeof item === 'object' && item.__subcat) {
                            const idx = item.items.indexOf(window.__draggingTagValue);
                            if (idx > -1) item.items.splice(idx, 1);
                        }
                    }
                    const idxRoot = allList.indexOf(window.__draggingTagValue);
                    if (idxRoot > -1) allList.splice(idxRoot, 1);
                }
                const body = subWrap.querySelector('div');
                const target = e.target.closest('.draggable-item');
                if (body && target) {
                    const tagList = subObj.items;
                    const targetIdx = Array.from(body.querySelectorAll('.draggable-item')).indexOf(target);
                    tagList.splice(targetIdx, 0, window.__draggingTagValue);
                } else {
                    subObj.items.push(window.__draggingTagValue);
                }
                await saveStorage();
                const root = document.querySelector('.magic-manager-root');
                if (root && root.parentNode) {
                    const newManager = createManager('', key, rootList, selectedSet, isTextOnly);
                    root.parentNode.replaceChild(newManager, root);
                }
                window.__draggingTagValue = null;
                window.__draggingFromList = null;
            }
        });
        const del = document.createElement('button');
        del.textContent = '✖';
        del.style.border = 'none';
        del.style.background = 'transparent';
        del.style.fontSize = '10px';
        del.style.width = '24px';
        del.style.height = '24px';
        del.onclick = async (e) => {
            e.stopPropagation();
            if (!confirm(`是否要删除子类别 ${subObj.name}？`)) return;
            const idx = parentList.indexOf(subObj);
            if (idx > -1) parentList.splice(idx, 1);
            await saveStorage();
            subWrap.remove();
        };
        head.append(toggle, name, del);
        subWrap.append(head);

        const body = document.createElement('div');
        body.style.marginLeft = '18px';
        body.style.display = expanded ? '' : 'none';
        subObj.items.forEach(item => body.append(renderItemRow(item, selectedSet, subObj.items, isTextOnly, rootList)));
        enableTagSortingAndMoving(body, subObj.items, subObj, key, () => {
            const root = document.querySelector('.magic-manager-root');
            if (root && root.parentNode) {
                const newManager = createManager('', key, rootList, selectedSet, isTextOnly);
                root.parentNode.replaceChild(newManager, root);
            }
        });
        subWrap.append(body);
        return subWrap;
    }

    function enableTagSortingAndMoving(container, tagList, subcatObj, key, rerender) {
        let draggingElem;
        let draggingValue;
        container.addEventListener('dragstart', e => {
            if (e.target.closest('input, textarea')) return;
            if (e.target.classList.contains('draggable-item')) {
                draggingElem = e.target;
                draggingValue = e.target.dataset.tagValue;
                window.__draggingFromList = tagList;
                window.__draggingTagValue = draggingValue;
                window.__draggingSubcatName = null;
                e.dataTransfer.effectAllowed = 'move';
            }
        });
        container.addEventListener('dragover', e => {
            if (window.__draggingTagValue) {
                e.preventDefault();
                const target = e.target.closest('.draggable-item');
                if (target && target !== draggingElem) {
                    const rect = target.getBoundingClientRect();
                    const next = (e.clientY - rect.top) > rect.height / 2;
                    target.parentNode.insertBefore(draggingElem, next ? target.nextSibling : target);
                }
            }
        });
        container.addEventListener('drop', async e => {
            if (!window.__draggingTagValue) return;
            e.preventDefault();
            let allList = tagList;
            if (key && STATE && STATE[key]) allList = STATE[key];
            if (window.__draggingFromList === tagList) {
                const items = [...container.querySelectorAll('.draggable-item')].map(row => row.dataset.tagValue);
                if (subcatObj) {
                    tagList.splice(0, tagList.length, ...items);
                } else {
                    const subcats = allList.filter(item => typeof item === 'object' && item.__subcat);
                    const newList = [...items, ...subcats];
                    allList.splice(0, allList.length, ...newList);
                }
            } else {
                const fromList = window.__draggingFromList;
                if (fromList && Array.isArray(fromList)) {
                    const idx = fromList.indexOf(window.__draggingTagValue);
                    if (idx > -1) fromList.splice(idx, 1);
                }
                const target = e.target.closest('.draggable-item');
                if (target) {
                    const targetIdx = Array.from(container.querySelectorAll('.draggable-item')).indexOf(target);
                    tagList.splice(targetIdx, 0, window.__draggingTagValue);
                } else {
                    tagList.push(window.__draggingTagValue);
                }
            }
            await saveStorage();
            if (typeof rerender === 'function') rerender();
            draggingElem = null;
            draggingValue = null;
            window.__draggingFromList = null;
            window.__draggingTagValue = null;
        });
    }

    function enableSubcatSorting(container, key, list, rerender) {
        let draggingElem = null;
        container.addEventListener('dragover', e => {
            e.preventDefault();
            const target = e.target.closest('.subcat-dropzone');
            if (target && target !== draggingElem) {
                const rect = target.getBoundingClientRect();
                const next = (e.clientY - rect.top) > rect.height / 2;
                const dragging = container.querySelector('.dragging');
                if (dragging) {
                    container.insertBefore(dragging, next ? target.nextSibling : target);
                }
            }
        });
        container.addEventListener('dragstart', e => {
            if (e.target.classList.contains('subcat-dropzone')) {
                draggingElem = e.target;
            }
        });
        container.addEventListener('drop', async e => {
            e.preventDefault();
            const subcatDivs = Array.from(container.querySelectorAll('.subcat-dropzone'));
            const order = subcatDivs.map(div => div.subcatObj.name);
            if (!STATE.subcatOrder) STATE.subcatOrder = {};
            STATE.subcatOrder[key] = order;
            await saveStorage();
            if (typeof rerender === 'function') rerender();
        });
    }

    function openSettingsPanel() {
        let panel = document.querySelector('#magic-settings');
        if (panel) return panel.style.display = 'block';

        panel = document.createElement('div');
        panel.id = 'magic-settings';
        panel.style.position = 'fixed';
        panel.style.top = '50px';
        panel.style.left = '10px';
        panel.style.background = 'white';
        panel.style.border = '1px solid gray';
        panel.style.padding = '10px';
        panel.style.zIndex = '9999';
        panel.style.width = '380px';
        panel.style.maxHeight = '80vh';
        panel.style.overflow = 'auto';
        panel.style.scrollbarWidth = 'thin';
        panel.style.scrollbarColor = '#bbb #f5f5f5';
        const style = document.createElement('style');
        style.textContent = `
          #magic-settings::-webkit-scrollbar { width: 6px; background: #f5f5f5; }
          #magic-settings::-webkit-scrollbar-thumb { background: #bbb; border-radius: 4px; }
        `;
        document.head.appendChild(style);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.onclick = () => { panel.style.display = 'none'; };

        const saveAllBtn = document.createElement('button');
        saveAllBtn.textContent = '保存';
        saveAllBtn.style.marginRight = '10px';

        const clearAllBtn = document.createElement('button');
        clearAllBtn.textContent = '取消所有选中';
        clearAllBtn.style.marginRight = '10px';
        clearAllBtn.style.marginLeft = '10px';
        clearAllBtn.onclick = async () => {
            STATE.selectedRoles.clear();
            STATE.selectedPresets.clear();
            STATE.selectedArtists.clear();
            STATE.selectedTags.clear();
            STATE.selectedEnvs.clear();
            STATE.selectedCameras.clear();
            STATE.selectedClothes.clear();
            STATE.selectedActions.clear();
            STATE.selectedExpressions.clear();
            STATE.selectedOthers.clear();
            await saveStorage();
            const activeTabBtn = tabMenu.querySelector('button[style*="background"]');
            const activeTab = activeTabBtn ? activeTabBtn.textContent : '';
            contentWrapper.innerHTML = '';
            let listRef2 = STATE.roles;
            let selectedRef2 = STATE.selectedRoles;
            if (activeTab === '角色') { listRef2 = STATE.roles; selectedRef2 = STATE.selectedRoles; }
            if (activeTab === '预设') { listRef2 = STATE.presets; selectedRef2 = STATE.selectedPresets; }
            if (activeTab === '艺术家') { listRef2 = STATE.artists; selectedRef2 = STATE.selectedArtists; }
            if (activeTab === '忽略Tag') { listRef2 = STATE.ignore; selectedRef2 = STATE.selectedTags; }
            if (activeTab === '环境') { listRef2 = STATE.envs; selectedRef2 = STATE.selectedEnvs; }
            if (activeTab === '镜头') { listRef2 = STATE.cameras; selectedRef2 = STATE.selectedCameras; }
            if (activeTab === '服饰') { listRef2 = STATE.clothes; selectedRef2 = STATE.selectedClothes; }
            if (activeTab === '动作') { listRef2 = STATE.actions; selectedRef2 = STATE.selectedActions; }
            if (activeTab === '表情') { listRef2 = STATE.expressions; selectedRef2 = STATE.selectedExpressions; }
            if (activeTab === '其他') { listRef2 = STATE.others; selectedRef2 = STATE.selectedOthers; }
            contentWrapper.append(createManager(activeTab, '', listRef2, selectedRef2));
        };

        const tabMenu = document.createElement('div');
        tabMenu.style.display = 'flex';
        tabMenu.style.gap = '10px';
        tabMenu.style.marginBottom = '10px';

        const extraMenu = document.createElement('div');
        extraMenu.style.display = 'flex';
        extraMenu.style.gap = '10px';
        extraMenu.style.marginBottom = '10px';
        const extraTabs = [
            { label: '环境', key: 'custom_envs', list: STATE.envs = STATE.envs || [], selected: STATE.selectedEnvs = STATE.selectedEnvs || new Set() },
            { label: '镜头', key: 'custom_cameras', list: STATE.cameras = STATE.cameras || [], selected: STATE.selectedCameras = STATE.selectedCameras || new Set() },
            { label: '服饰', key: 'custom_clothes', list: STATE.clothes = STATE.clothes || [], selected: STATE.selectedClothes = STATE.selectedClothes || new Set() },
            { label: '动作', key: 'custom_actions', list: STATE.actions = STATE.actions || [], selected: STATE.selectedActions = STATE.selectedActions || new Set() },
            { label: '表情', key: 'custom_expressions', list: STATE.expressions = STATE.expressions || [], selected: STATE.selectedExpressions = STATE.selectedExpressions || new Set() },
            { label: '其他', key: 'custom_others', list: STATE.others = STATE.others || [], selected: STATE.selectedOthers = STATE.selectedOthers || new Set() },
        ];
        extraTabs.forEach((tab, idx) => {
            const btn = document.createElement('button');
            btn.textContent = tab.label;
            btn.style.padding = '2px 6px';
            btn.onclick = async () => {
                const activeTabBtn = tabMenu.querySelector('button[style*="background"]');
                const activeTab = activeTabBtn ? activeTabBtn.textContent : '';
                let selectedSet, listRef;
                if (activeTab === '角色') { selectedSet = STATE.selectedRoles; listRef = STATE.roles; }
                if (activeTab === '预设') { selectedSet = STATE.selectedPresets; listRef = STATE.presets; }
                if (activeTab === '艺术家') { selectedSet = STATE.selectedArtists; listRef = STATE.artists; }
                if (activeTab === '忽略Tag') { selectedSet = STATE.selectedTags; listRef = STATE.ignore; }
                extraTabs.forEach(etab => {
                    if (activeTab === etab.label) { selectedSet = etab.selected; listRef = etab.list; }
                });
                if (selectedSet && listRef) {
                    selectedSet.clear();
                    const items = contentWrapper.querySelectorAll('.draggable-item');
                    const newArr = [];
                    items.forEach(row => {
                        const checkbox = row.querySelector('input[type="checkbox"]');
                        const span = row.querySelector('span');
                        const textarea = row.querySelector('textarea');
                        let value = '';
                        if (span && textarea && textarea.value) value = span.textContent.trim() + '::' + textarea.value.trim();
                        else if (span) value = span.textContent.trim();
                        if (value) newArr.push(value);
                        if (checkbox && checkbox.checked && value) {
                            selectedSet.add(value);
                        }
                    });
                    if (activeTab === '角色') STATE.roles = newArr;
                    if (activeTab === '预设') STATE.presets = newArr;
                    if (activeTab === '艺术家') STATE.artists = newArr;
                    if (activeTab === '忽略Tag') STATE.ignore = newArr;
                    extraTabs.forEach(etab => { if (activeTab === etab.label) etab.list = newArr; });
                }
                await saveStorage();
                contentWrapper.innerHTML = '';
                contentWrapper.append(createManager(tab.label, tab.key, tab.list, tab.selected));
                [...tabMenu.children, ...extraMenu.children].forEach(b => b.style.background = '');
                btn.style.background = '#def';
            };
            extraMenu.appendChild(btn);
        });

        const contentWrapper = document.createElement('div');

        const tabs = [
            { label: '角色', key: 'custom_roles', list: STATE.roles, selected: STATE.selectedRoles },
            { label: '预设', key: 'custom_presets', list: STATE.presets, selected: STATE.selectedPresets },
            { label: '艺术家', key: 'custom_artists', list: STATE.artists, selected: STATE.selectedArtists },
            { label: '忽略Tag', key: 'ignored_tags', list: STATE.ignore, selected: STATE.selectedTags, isTextOnly: true },
            { label: 'API', key: 'google_api_key' }
        ];

        tabs.forEach((tab, idx) => {
            const btn = document.createElement('button');
            btn.textContent = tab.label;
            btn.style.padding = '2px 6px';
            btn.onclick = async () => {
                const activeTabBtn = tabMenu.querySelector('button[style*="background"]');
                const activeTab = activeTabBtn ? activeTabBtn.textContent : '';
                if (activeTab && activeTab !== 'API') {
                    let selectedSet = STATE.selectedRoles;
                    let listRef = STATE.roles;
                    if (activeTab === '角色') { selectedSet = STATE.selectedRoles; listRef = STATE.roles; }
                    if (activeTab === '预设') { selectedSet = STATE.selectedPresets; listRef = STATE.presets; }
                    if (activeTab === '艺术家') { selectedSet = STATE.selectedArtists; listRef = STATE.artists; }
                    if (activeTab === '忽略Tag') { selectedSet = STATE.selectedTags; listRef = STATE.ignore; }
                    if (selectedSet && listRef) {
                        selectedSet.clear();
                        const items = contentWrapper.querySelectorAll('.draggable-item');
                        const newArr = [];
                        items.forEach(row => {
                            const checkbox = row.querySelector('input[type="checkbox"]');
                            const span = row.querySelector('span');
                            const textarea = row.querySelector('textarea');
                            let value = '';
                            if (span && textarea && textarea.value) value = span.textContent.trim() + '::' + textarea.value.trim();
                            else if (span) value = span.textContent.trim();
                            if (value) newArr.push(value);
                            if (checkbox && checkbox.checked && value) {
                                selectedSet.add(value);
                            }
                        });
                        if (activeTab === '角色') STATE.roles = newArr;
                        if (activeTab === '预设') STATE.presets = newArr;
                        if (activeTab === '艺术家') STATE.artists = newArr;
                        if (activeTab === '忽略Tag') STATE.ignore = newArr;
                    }
                    await saveStorage();
                }
                contentWrapper.innerHTML = '';
                let listRef2 = STATE.roles;
                let selectedRef2 = STATE.selectedRoles;
                if (tab.key === 'custom_roles') { listRef2 = STATE.roles; selectedRef2 = STATE.selectedRoles; }
                if (tab.key === 'custom_presets') { listRef2 = STATE.presets; selectedRef2 = STATE.selectedPresets; }
                if (tab.key === 'custom_artists') { listRef2 = STATE.artists; selectedRef2 = STATE.selectedArtists; }
                if (tab.key === 'ignored_tags') { listRef2 = STATE.ignore; selectedRef2 = STATE.selectedTags; }
                if (tab.key === 'google_api_key') {
                    const apiDiv = document.createElement('div');
                    apiDiv.style.display = 'flex';
                    apiDiv.style.flexDirection = 'column';
                    apiDiv.style.gap = '8px';

                    const apiTip = document.createElement('div');
                    apiTip.style.marginBottom = '4px';
                    apiTip.style.color = '#555';
                    apiTip.style.fontSize = '13px';
                    apiTip.innerHTML = '输入谷歌翻译API Key<br>留空使用质量较低的免费API';

                    const input = document.createElement('input');
                    input.type = 'text';
                    input.placeholder = '请输入API Key';
                    input.value = STATE.googleApiKey || '';
                    input.style.width = '100%';

                    const saveBtn = document.createElement('button');
                    saveBtn.textContent = '保存API Key';
                    saveBtn.onclick = async () => {
                        STATE.googleApiKey = input.value.trim();
                        await saveStorage();
                        alert('API Key已保存');
                    };
                    saveBtn.style.margin = '8px 0';

                    const exportBtn = document.createElement('button');
                    exportBtn.textContent = '导出数据库';
                    exportBtn.style.margin = '8px 0';
                    exportBtn.onclick = () => {
                        const exportData = {
                            roles: STATE.roles,
                            presets: STATE.presets,
                            artists: STATE.artists,
                            ignore: STATE.ignore,
                            selectedRoles: Array.from(STATE.selectedRoles),
                            selectedPresets: Array.from(STATE.selectedPresets),
                            selectedArtists: Array.from(STATE.selectedArtists),
                            selectedTags: Array.from(STATE.selectedTags),
                            envs: STATE.envs,
                            cameras: STATE.cameras,
                            clothes: STATE.clothes,
                            actions: STATE.actions,
                            expressions: STATE.expressions,
                            selectedEnvs: Array.from(STATE.selectedEnvs),
                            selectedCameras: Array.from(STATE.selectedCameras),
                            selectedClothes: Array.from(STATE.selectedClothes),
                            selectedActions: Array.from(STATE.selectedActions),
                            selectedExpressions: Array.from(STATE.selectedExpressions),
                            others: STATE.others,
                            selectedOthers: Array.from(STATE.selectedOthers),
                            subcatExpandStates: STATE.subcatExpandStates,
                            subcatOrder: STATE.subcatOrder,
                        };
                        const json = JSON.stringify(exportData, null, 2);
                        GM_setClipboard(json);
                        const blob = new Blob([json], {type: 'application/json'});
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'DeepDanbooru_DB.json';
                        a.click();
                        setTimeout(() => URL.revokeObjectURL(url), 1000);
                        alert('数据库已复制到剪贴板并下载！');
                    };

                    const importBtn = document.createElement('button');
                    importBtn.textContent = '导入数据库';
                    importBtn.style.margin = '8px 0';
                    importBtn.onclick = async () => {
                        const fileInput = document.createElement('input');
                        fileInput.type = 'file';
                        fileInput.accept = '.json,application/json';
                        fileInput.onchange = async (e) => {
                            const file = fileInput.files[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = async function(evt) {
                                let data;
                                try {
                                    data = JSON.parse(evt.target.result);
                                } catch (e) {
                                    alert('JSON解析失败！');
                                    return;
                                }
                                function arrOr(v, def) { return Array.isArray(v) ? v : def; }
                                function setOr(v, def) { return new Set(Array.isArray(v) ? v : def); }
                                function objOr(v, def) { return (v && typeof v === 'object' && !Array.isArray(v)) ? v : def; }
                                STATE.roles = arrOr(data.roles, []);
                                STATE.presets = arrOr(data.presets, []);
                                STATE.artists = arrOr(data.artists, []);
                                STATE.ignore = arrOr(data.ignore, []);
                                STATE.selectedRoles = setOr(data.selectedRoles, []);
                                STATE.selectedPresets = setOr(data.selectedPresets, []);
                                STATE.selectedArtists = setOr(data.selectedArtists, []);
                                STATE.selectedTags = setOr(data.selectedTags, []);
                                STATE.envs = arrOr(data.envs, []);
                                STATE.cameras = arrOr(data.cameras, []);
                                STATE.clothes = arrOr(data.clothes, []);
                                STATE.actions = arrOr(data.actions, []);
                                STATE.expressions = arrOr(data.expressions, []);
                                STATE.selectedEnvs = setOr(data.selectedEnvs, []);
                                STATE.selectedCameras = setOr(data.selectedCameras, []);
                                STATE.selectedClothes = setOr(data.selectedClothes, []);
                                STATE.selectedActions = setOr(data.selectedActions, []);
                                STATE.selectedExpressions = setOr(data.selectedExpressions, []);
                                STATE.others = arrOr(data.others, []);
                                STATE.selectedOthers = setOr(data.selectedOthers, []);
                                STATE.subcatExpandStates = objOr(data.subcatExpandStates, {});
                                STATE.subcatOrder = objOr(data.subcatOrder, {});
                                await saveStorage();
                                alert('数据库导入成功！页面将自动刷新。');
                                location.reload();
                            };
                            reader.readAsText(file);
                        };
                        fileInput.click();
                    };

                    apiDiv.appendChild(apiTip);
                    apiDiv.appendChild(input);
                    apiDiv.appendChild(saveBtn);
                    apiDiv.appendChild(exportBtn);
                    apiDiv.appendChild(importBtn);
                    contentWrapper.appendChild(apiDiv);
                } else {
                    contentWrapper.append(createManager(tab.label, tab.key, listRef2, selectedRef2, tab.isTextOnly));
                }
                [...tabMenu.children, ...extraMenu.children].forEach(b => b.style.background = '');
                btn.style.background = '#def';
            };
            if (idx === 0) btn.style.background = '#def';
            tabMenu.appendChild(btn);
        });

        contentWrapper.append(createManager(tabs[0].label, tabs[0].key, tabs[0].list, tabs[0].selected));

        panel.append(tabMenu, extraMenu, contentWrapper, saveAllBtn, closeBtn, clearAllBtn);
        document.body.appendChild(panel);

        saveAllBtn.onclick = async () => {
            const activeTabBtn = tabMenu.querySelector('button[style*="background"]');
            const activeTab = activeTabBtn ? activeTabBtn.textContent : '';
            const items = contentWrapper.querySelectorAll('.draggable-item');
            const newArr = [];
            items.forEach(row => {
                const span = row.querySelector('span');
                const textarea = row.querySelector('textarea');
                if (!span) return;
                const note = span.textContent.trim();
                const content = textarea ? textarea.value.trim() : '';
                if (note && content) newArr.push(note + '::' + content);
                else if (content) newArr.push(content);
                else if (note) newArr.push(note);
            });
            if (activeTab === '角色') STATE.roles = newArr;
            if (activeTab === '预设') STATE.presets = newArr;
            if (activeTab === '艺术家') STATE.artists = newArr;
            if (activeTab === '忽略Tag') STATE.ignore = newArr;

            function cleanSet(set, arr) {
                for (const v of Array.from(set)) {
                    if (!arr.includes(v)) set.delete(v);
                }
            }
            cleanSet(STATE.selectedRoles, STATE.roles);
            cleanSet(STATE.selectedPresets, STATE.presets);
            cleanSet(STATE.selectedArtists, STATE.artists);
            cleanSet(STATE.selectedTags, STATE.ignore);

            await saveStorage();
            if (contentWrapper && contentWrapper.parentNode) {
                let foundBtn = null;
                [...tabMenu.children, ...(typeof extraMenu !== 'undefined' ? extraMenu.children : [])].forEach(b => {
                    if (b.textContent === activeTab) foundBtn = b;
                });
                if (foundBtn) foundBtn.click();
            }
            setTimeout(() => { alert('所有设置已保存！'); }, 100);
        };
    }

    function updateStateArray(arr, row, label, textarea) {
        if (!textarea) return;
        const idx = arr.findIndex(item => item.includes(label));
        if (idx > -1) {
            arr[idx] = label + (textarea.value ? '::' + textarea.value : '');
        }
    }

    async function init() {
        const isMainPage = location.pathname === '/deepdanbooru/';
        if (isMainPage) {
            await loadStorage();
            let container = document.querySelector('.container') || document.body;
            let wrapper = document.createElement('div');
            wrapper.style.margin = '20px 0';
            wrapper.style.display = 'flex';
            wrapper.style.gap = '10px';

            const copyBtn = document.createElement('button');
            copyBtn.textContent = '🧙 生成魔法串';
            copyBtn.onclick = () => {
                const final = buildMagicString();
                GM_setClipboard(final);
                alert('✅ 魔法串已复制！');
            };

            const settingBtn = document.createElement('button');
            settingBtn.textContent = '⚙️ 设置';
            settingBtn.onclick = openSettingsPanel;

            wrapper.append(copyBtn, settingBtn);
            container.insertBefore(wrapper, container.firstChild);
            return;
        }
        const container = document.querySelector('.container');
        const tagTable = container?.querySelector('table');
        if (!tagTable) return setTimeout(init, 500);
        await loadStorage();
        createButtonBar(tagTable);
    }

    function buildMagicString() {
        function collectTags(list, selectedSet, key) {
            const arr = [];
            for (const item of list) {
                if (typeof item === 'string') {
                    if (selectedSet && selectedSet.has(item)) {
                        arr.push(splitNoteAndContent(item)[1]);
                    }
                }
            }
            const subcats = list.filter(item => typeof item === 'object' && item.__subcat);
            let subcatOrderArr = [];
            if (key && STATE.subcatOrder && STATE.subcatOrder[key]) {
                subcatOrderArr = STATE.subcatOrder[key].filter(name => subcats.some(s => s.name === name));
            }
            const orderedSubcats = [
                ...subcatOrderArr.map(name => subcats.find(s => s.name === name)).filter(Boolean),
                ...subcats.filter(s => !subcatOrderArr.includes(s.name))
            ];
            for (const subcat of orderedSubcats) {
                arr.push(...collectTags(subcat.items, selectedSet, key));
            }
            return arr;
        }
        const roleStr = collectTags(STATE.roles, STATE.selectedRoles, 'custom_roles').join(' ');
        const presetStr = collectTags(STATE.presets, STATE.selectedPresets, 'custom_presets').join(' ');
        const envStr = collectTags(STATE.envs, STATE.selectedEnvs, 'custom_envs').join(' ');
        const cameraStr = collectTags(STATE.cameras, STATE.selectedCameras, 'custom_cameras').join(' ');
        const clothesStr = collectTags(STATE.clothes, STATE.selectedClothes, 'custom_clothes').join(' ');
        const actionStr = collectTags(STATE.actions, STATE.selectedActions, 'custom_actions').join(' ');
        const expressionStr = collectTags(STATE.expressions, STATE.selectedExpressions, 'custom_expressions').join(' ');
        const otherStr = collectTags(STATE.others, STATE.selectedOthers, 'custom_others').join(' ');
        const tagStr = collectTags(STATE.ignore, STATE.selectedTags, 'ignored_tags').join(', ') + (STATE.selectedTags.size ? ',' : '');
        const artistStr = collectTags(STATE.artists, STATE.selectedArtists, 'custom_artists').join(' ');
        const parts = [];
        if (roleStr) parts.push(roleStr);
        if (presetStr) parts.push(presetStr);
        if (envStr) parts.push(envStr);
        if (cameraStr) parts.push(cameraStr);
        if (clothesStr) parts.push(clothesStr);
        if (actionStr) parts.push(actionStr);
        if (expressionStr) parts.push(expressionStr);
        if (otherStr) parts.push(otherStr);
        if (tagStr) parts.push(tagStr);
        if (artistStr) parts.push(artistStr);
        return parts.join('\n');
    }

    init();
})();
