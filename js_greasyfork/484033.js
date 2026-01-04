// ==UserScript==
// @name         咕咕镇道具助手
// @license      MIT License
// @namespace    https://greasyfork.org/zh-CN/users/915763-zyxboy
// @version      1.2.0
// @description  咕咕镇插件：道具助手
// @author       zyxboy
// @match        https://www.guguzhen.com/*
// @match        https://www.momozhen.com/*
// @connect      www.guguzhen.com
// @connect      www.momozhen.com
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/484033/%E5%92%95%E5%92%95%E9%95%87%E9%81%93%E5%85%B7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/484033/%E5%92%95%E5%92%95%E9%95%87%E9%81%93%E5%85%B7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
/* eslint-env jquery */
/* jshint esversion:12 */
(async function() {
    'use strict'

    const g_isInSandBox = true;
    const g_version = GM_info.script.version + (g_isInSandBox ? '' : ' (RP)');
    const g_modiTime = '2025-08-23 00:50:00';

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // common utilities
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    const g_navigatorSelector = 'body > div > div.row > div.panel > div.panel-body > div';
    const g_kfUser = document.querySelector(g_navigatorSelector + ' > button.btn.btn-lg')?.innerText;
    if (!(g_kfUser?.length > 0)) {
        console.log(`道具助手(${g_version}): 咕咕镇版本不匹配或正在测试`);
        return;
    }
    console.log(`道具助手(${g_version}): ${g_kfUser}`);

    const g_exportInterfaceId = 'gugu-assistant-interface-export';
    let g_assistantInterface = null;

    function getAssistantInterfaceAsync() {
        return new Promise((resolve) => {
            if (g_assistantInterface == null) {
                let timeout = Date.now() + 5000;
                let timer = setInterval(() => {
                    if ((g_assistantInterface = document.getElementById(g_exportInterfaceId)?.assistantInterface) != null) {
                        clearInterval(timer);
                        resolve(true);
                    }
                    else if (timeout - Date.now() < 0) {
                        clearInterval(timer);
                        resolve(false);
                    }
                }, 200);
            }
            else {
                resolve(true);
            }
        });
    }
    if (!(await getAssistantInterfaceAsync())) {
        console.log('道具助手: 获取插件接口超时');
        return;
    }

    const AJAX = g_assistantInterface.httpRequest;
    const POPUP = g_assistantInterface.genericPopup;
    const PROPERTY = g_assistantInterface.equip.property;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // add-ins
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    if (window.location.pathname == AJAX.GuGuZhenRequest.user.url) {
        const propSoulPotionMeta = PROPERTY.meta.map.get(3003);
        const propRoughGemStoneMeta = PROPERTY.meta.map.get(3005);
        let requestPropertyMenu = await AJAX.getInfoAsync('omenu');
        let requestPropertyUse = await AJAX.getInfoAsync('oclick');

        function batchSoulPotion() {
            const propSoulPotionMax = 10000000000;
            const cardPropMax = {
                level : Math.min(850, parseInt(document.querySelector
                                               ('div.panel-body.fyg_f14 > p.fyg_lh40.with-padding.bg-success > span.pull-right.fyg_f18')
                                               ?.innerText ?? 0) + 200),
                quality : 11,
                slot : 7
            };

            POPUP.initialize();
            POPUP.showProgressMessage();

            let propSoulPotionCount = 0;
            let p = [];
            PROPERTY.read(
                p,
                propSoulPotionMeta.name,
                () => {
                    if (p.length == 1 && (propSoulPotionCount = p[0].amount) > 0) {
                        readCards();
                    }
                    else {
                        alert(`“${propSoulPotionMeta.alias}”数量为0或获取失败！`);
                        POPUP.close(true, true);
                    }
                });

            function readCards() {
                AJAX.begin(
                    requestPropertyMenu.request,
                    requestPropertyMenu.data.replace('"+id+"', '2').replace('"+id2', 'undefined'),
                    (response) => {
                        let div = document.createElement('div');
                        let sel = document.createElement('select');
                        div.innerHTML = response.responseText;
                        div.querySelectorAll('button.btn.btn-block.btn-success.fyg_f14.fyg_mp5')?.forEach((btn) => {
                            let param = btn.getAttribute('onclick')?.match(/\d+/g);
                            if (param?.length == 2) {
                                let op = document.createElement('option');
                                op.innerText = btn.innerText;
                                op.value = `${param[0]},${param[1]}`;
                                sel.appendChild(op);
                            }
                        });
                        if (sel.options?.length > 0) {
                            selectCard(sel);
                        }
                        else {
                            alert('卡片均达上限，无需继续提升。');
                            POPUP.close(true, true);
                        }
                    });
            }

            function selectCard(list) {
                let spMax = Math.min(propSoulPotionMax, propSoulPotionCount);
                list.style.marginLeft = '5px';
                list.style.height = '1.5em';
                list.style.width = '230px';
                list.value = list.options[0].value;

                let mainContent =
                    `<div style="margin-top:20px;font-size:15px;">
                         <div id="card-select-div" style="padding:10px;">欲提升的卡片 </div>
                         <div style="padding:10px;">
                             <input type="checkbox" id="chk-level" style="margin-right:3px;" checked />
                             <label for="chk-level" style="cursor:pointer;">等级提升至</label>
                             <input type="text" id="text-level" style="height:1.5em;width:50px;margin-left:3px;"
                                    value="${cardPropMax.level}" oninput="value=value.replace(/[\\D]/g,'');" /> 级</div>
                         <div style="padding:10px;">
                             <input type="checkbox" id="chk-quality" style="margin-right:3px;" checked />
                             <label for="chk-quality" style="cursor:pointer;">品质提升至</label>
                             <input type="text" id="text-quality" style="height:1.5em;width:50px;margin-left:3px;"
                                    value="${cardPropMax.quality}" oninput="value=value.replace(/[\\D]/g,'');" /> %</div>
                         <div style="padding:10px;">
                             <input type="checkbox" id="chk-slot" style="margin-right:3px;" checked />
                             <label for="chk-slot" style="cursor:pointer;">技能位提升至</label>
                             <input type="text" id="text-slot" style="height:1.5em;width:50px;margin-left:3px;"
                                    value="${cardPropMax.slot}" oninput="value=value.replace(/[\\D]/g,'');" /> 个</div>
                         <div style="padding:10px;">或者${propSoulPotionMeta.alias}（库存：${propSoulPotionCount}）消耗量达到 ` +
                            `<input type="text" id="text-sp" style="height:1.5em;width:50px;margin-left:3px;"
                                    value="${spMax}" oninput="value=value.replace(/[\\D]/g,'');" /></div></div>`;

                POPUP.setContent(`批量使用${propSoulPotionMeta.alias}`, mainContent);
                POPUP.querySelector('#card-select-div')?.appendChild(list);

                let chkLevel = POPUP.querySelector('#chk-level');
                let textLevel = POPUP.querySelector('#text-level');
                textLevel.onchange = (() => {
                    let v = parseInt(textLevel.value);
                    if (v > cardPropMax.level) {
                        textLevel.value = cardPropMax.level.toString();
                    }
                });

                let chkQuality = POPUP.querySelector('#chk-quality');
                let textQuality = POPUP.querySelector('#text-quality');
                textQuality.onchange = (() => {
                    let v = parseInt(textQuality.value);
                    if (v > cardPropMax.quality) {
                        textQuality.value = cardPropMax.quality.toString();
                    }
                });

                let chkSlot = POPUP.querySelector('#chk-slot');
                let textSlot = POPUP.querySelector('#text-slot');
                textSlot.onchange = (() => {
                    let v = parseInt(textSlot.value);
                    if (v > cardPropMax.slot) {
                        textSlot.value = cardPropMax.slot.toString();
                    }
                });

                let textSp = POPUP.querySelector('#text-sp');
                textSp.onchange = (() => {
                    let v = parseInt(textSp.value);
                    if (v > spMax) {
                        textSp.value = spMax.toString();
                    }
                    btnStart.disabled = (v > 0 ? '' : 'disabled');
                });

                let btnStart = POPUP.addButton(
                    '开始',
                    80,
                    () => {
                        textSp.value = (spMax = Math.min(spMax, parseInt(textSp.value))).toString();
                        if (confirm(`这将可能消耗最多 ${spMax} “${propSoulPotionMeta.alias}”，继续吗？`)) {
                            let cardName = list.options[list.selectedIndex].innerText.substring(0, 1);
                            let cardProp = list.options[list.selectedIndex].innerText.match(/\d+/g);
                            let cardCur = {
                                level : parseInt(cardProp[0]),
                                quality : parseInt(cardProp[1]),
                                slot : parseInt(cardProp[2])
                            };
                            let cardMax = {
                                level : parseInt(chkLevel.checked ? textLevel.value : 0),
                                quality : parseInt(chkQuality.checked ? textQuality.value : 0),
                                slot : parseInt(chkSlot.checked ? textSlot.value : 0)
                            };

                            POPUP.close(true, true);
                            POPUP.taskPopup.setup(
                                `“${cardName}”处理中...`,
                                260,
                                [`${propSoulPotionMeta.alias}`, '等级', '品质', '技能位'],
                                () => {
                                    AJAX.abortAll();
                                    POPUP.taskPopup.abort();
                                    POPUP.close(true, true);
                                });
                            POPUP.showModal(false);

                            let param = list.value.split(',');
                            improveCard(requestPropertyUse.data.replace('"+cn+"', param[0]).replace('"+id+"', param[1]),
                                        cardCur, cardMax, spMax);
                        }
                    });
                POPUP.addCloseButton(80);
                POPUP.setContentSize(270, 420, false);
                POPUP.showModal(true);
            }

            function improveCard(requestData, cardCur, cardMax, spMax) {
                POPUP.taskPopup.setState(0, `- ${spMax}`);
                POPUP.taskPopup.setState(1, `- ${cardCur.level} / ${cardMax.level > 0 ? cardMax.level : 'NA'}`);
                POPUP.taskPopup.setState(2, `- ${cardCur.quality} / ${cardMax.quality > 0 ? cardMax.quality : 'NA'}`);
                POPUP.taskPopup.setState(3, `- ${cardCur.slot} / ${cardMax.slot > 0 ? cardMax.slot : 'NA'}`);

                if (spMax <= 0 || compareCard(cardCur, cardMax) || POPUP.taskPopup.checkCompletion()) {
                    POPUP.close(true, true);
                    return;
                }
                AJAX.begin(
                    requestPropertyUse.request,
                    requestData,
                    (response) => {
                        let div = document.createElement('div');
                        div.innerHTML = response.responseText;
                        let card = div.innerText.match(/\d+/g);
                        if (card?.length >= 3) {
                            let v;
                            if (cardCur.level < (v = parseInt(card[0]))) {
                                cardCur.level = v;
                            }
                            if (cardCur.quality < (v = parseInt(card[1]))) {
                                cardCur.quality = v;
                            }
                            if (cardCur.slot < (v = parseInt(card[2]))) {
                                cardCur.slot = v;
                            }
                            improveCard(requestData, cardCur, cardMax, --spMax);
                        }
                        else {
                            console.log(response.responseText);
                            alert('返回信息错误，操作中断。');
                            POPUP.taskPopup.abort();
                            POPUP.close(true, true);
                        }
                    });

                function compareCard(cardCur, cardMax) {
                    let c = 0;
                    if (cardCur.level >= cardMax.level) {
                        POPUP.taskPopup.complete(1);
                        c++;
                    }
                    if (cardCur.quality >= cardMax.quality) {
                        POPUP.taskPopup.complete(2);
                        c++;
                    }
                    if (cardCur.slot >= cardMax.slot) {
                        POPUP.taskPopup.complete(3);
                        c++;
                    }
                    return (c == 3);
                }
            }
        }

        function batchRoughGemStone() {
            const propRoughGemStoneMax = 5;

            POPUP.initialize();
            POPUP.showProgressMessage();

            let propRoughGemStoneCount = 0;
            let p = [];
            PROPERTY.read(
                p,
                propRoughGemStoneMeta.name,
                () => {
                    if (p.length == 1 && (propRoughGemStoneCount = p[0].amount) > 0) {
                        readGemStones();
                    }
                    else {
                        alert(`“${propRoughGemStoneMeta.alias}”数量为0或获取失败！`);
                        POPUP.close(true, true);
                    }
                });

            function readGemStones() {
                AJAX.begin(
                    requestPropertyMenu.request,
                    requestPropertyMenu.data.replace('"+id+"', '6').replace('"+id2', 'undefined'),
                    (response) => {
                        let div = document.createElement('div');
                        let sel = document.createElement('select');
                        div.innerHTML = response.responseText;
                        div.querySelectorAll('button.btn.btn-block.fyg_mp5.fyg_f14')?.forEach((btn) => {
                            let gem = btn.innerText.match(/\d+/g);
                            if (gem?.length == 2 && parseInt(gem[0]) < parseInt(gem[1])) {
                                let param = btn.getAttribute('onclick')?.match(/\d+/g);
                                if (param?.length == 2) {
                                    let op = document.createElement('option');
                                    op.innerText = btn.innerText;
                                    op.value = `${gem[0]},${gem[1]},${param[0]},${param[1]}`;
                                    sel.appendChild(op);
                                }
                            }
                        });
                        if (sel.options?.length > 0) {
                            selectGemStone(sel);
                        }
                        else {
                            alert('宝石已满，无需继续提升。');
                            POPUP.close(true, true);
                        }
                    });
            }

            function selectGemStone(list) {
                let rgsMax = Math.min(propRoughGemStoneMax, propRoughGemStoneCount);
                let gsCur, gsMax, cnId, gsId;
                list.style.marginLeft = '5px';
                list.style.height = '1.5em';
                list.style.width = '195px';
                list.value = list.options[0].value;
                list.onchange = (() => {
                    let gem = list.value.split(',');
                    gsCur = parseInt(gem[0]);
                    gsMax = parseInt(textGem.value = gem[1]);
                    cnId = gem[2];
                    gsId = gem[3];
                    textGem.onchange();
                });

                let mainContent =
                    `<div style="margin-top:20px;font-size:15px;">
                         <div id="gem-select-div" style="padding:10px;">欲提升的宝石 </div>
                         <div style="padding:10px;">宝石数量提升至 ` +
                            `<input type="text" id="text-gem" style="height:1.5em;width:50px;margin-left:3px;"
                                    value="0" oninput="value=value.replace(/[\\D]/g,'');" /> 或者</div>
                         <div style="padding:10px;">${propRoughGemStoneMeta.alias}（库存：${propRoughGemStoneCount}）消耗量达到 ` +
                            `<input type="text" id="text-rgs" style="height:1.5em;width:50px;margin-left:3px;"
                                    value="${rgsMax}" oninput="value=value.replace(/[\\D]/g,'');" /></div></div>`;

                POPUP.setContent(`批量使用${propRoughGemStoneMeta.alias}`, mainContent);
                POPUP.querySelector('#gem-select-div')?.appendChild(list);

                let textGem = POPUP.querySelector('#text-gem');
                textGem.onchange = (() => {
                    let v = parseInt(textGem.value);
                    if (v > gsMax) {
                        textGem.value = gsMax.toString();
                    }
                    btnStart.disabled = (v > 0 ? '' : 'disabled');
                });

                let textRgs = POPUP.querySelector('#text-rgs');
                textRgs.onchange = (() => {
                    let v = parseInt(textRgs.value);
                    if (v > rgsMax) {
                        textRgs.value = rgsMax.toString();
                    }
                    btnStart.disabled = (v > 0 ? '' : 'disabled');
                });

                let btnStart = POPUP.addButton(
                    '开始',
                    80,
                    () => {
                        let gemName = list.options[list.selectedIndex].innerText.split(' ')[0];
                        textRgs.value = (rgsMax = Math.min(rgsMax, parseInt(textRgs.value))).toString();
                        if (confirm(`这将可能消耗最多 ${rgsMax} “${propRoughGemStoneMeta.alias}”以获取“${gemName}”，继续吗？`)) {
                            gsMax = parseInt(textGem.value);

                            POPUP.close(true, true);
                            POPUP.taskPopup.setup(
                                `“${gemName}”获取中...`,
                                260,
                                [`${propRoughGemStoneMeta.alias}`, `当前${gemName}`, '目标数量'],
                                () => {
                                    AJAX.abortAll();
                                    POPUP.taskPopup.abort();
                                    POPUP.close(true, true);
                                });
                            POPUP.showModal(false);

                            getGemStone(requestPropertyUse.data.replace('"+cn+"', cnId).replace('"+id+"', gsId), gsCur, gsMax, rgsMax);
                        }
                    });
                POPUP.addCloseButton(80);
                POPUP.setContentSize(170, 380, false);

                list.onchange();
                POPUP.showModal(true);
            }

            function getGemStone(requestData, gsCur, gsMax, rgsMax) {
                POPUP.taskPopup.setState(0, `- ${rgsMax}`);
                POPUP.taskPopup.setState(1, `- ${gsCur}`);
                POPUP.taskPopup.setState(2, `- ${gsMax}`);

                if (rgsMax <= 0 || gsCur >= gsMax || POPUP.taskPopup.checkCompletion()) {
                    POPUP.close(true, true);
                    return;
                }
                AJAX.begin(
                    requestPropertyUse.request,
                    requestData,
                    (response) => {
                        let div = document.createElement('div');
                        div.innerHTML = response.responseText;
                        if (div.innerText.indexOf('+1') >= 0) {
                            gsCur++;
                        }
                        else if (div.innerText.indexOf('没有收集到') < 0) {
                            alert(div.innerText);
                            POPUP.close(true, true);
                            return;
                        }
                        getGemStone(requestData, gsCur, gsMax, rgsMax - 1);
                    });
            }
        }

        function executeAssistant() {
            let timer = setInterval(() => {
                let btns = document.querySelectorAll('div.col-sm-4.fyg_tr button.btn.btn-lg');
                if (btns?.length > 0) {
                    clearInterval(timer);
                    for (let btn of btns) {
                        if (btn.innerText.indexOf('强化的卡片') >= 0) {
                            let btnBatch = document.createElement('button');
                            btnBatch.className = 'btn btn-lg';
                            btnBatch.innerHTML = '批量使用' + propSoulPotionMeta.alias;
                            btnBatch.style.width = getComputedStyle(btn).getPropertyValue('width');
                            btnBatch.style.marginTop = '1px';
                            btnBatch.onclick = (() => { batchSoulPotion(); });
                            btn.parentElement.appendChild(btnBatch);
                        }
                        else if (btn.innerText.indexOf('提升的宝石') >= 0) {
                            let btnBatch = document.createElement('button');
                            btnBatch.className = 'btn btn-lg';
                            btnBatch.innerHTML = '批量使用' + propRoughGemStoneMeta.alias;
                            btnBatch.style.width = getComputedStyle(btn).getPropertyValue('width');
                            btnBatch.style.marginTop = '1px';
                            btnBatch.onclick = (() => { batchRoughGemStone(); });
                            btn.parentElement.appendChild(btnBatch);
                        }
                    }
                }
            }, 200);
        }

        if (propSoulPotionMeta != null && propRoughGemStoneMeta != null && requestPropertyMenu != null && requestPropertyUse != null) {
            executeAssistant();
        }
        else {
            console.log('道具助手: 批量助手初始化失败');
        }
    }
    else if (window.location.pathname == AJAX.GuGuZhenRequest.beach.url) {
        let requestBeach = await AJAX.getInfoAsync('stall');
        let requestOpenBox = await AJAX.getInfoAsync('gx_sxst');
        const propEquipBoxMeta = PROPERTY.meta.map.get(3004);
        const propEquipBoxMax = 9;
        let propEquipBoxCount = 0;
        function openBox(count) {
            if (count > 0 && confirm(`这将消耗 ${count} 个“${propEquipBoxMeta.alias}”并重置海滩刷新计时，继续吗？`)) {
                POPUP.initialize();
                POPUP.showProgressMessage();
                beginOpenBox();
            }

            function beginRefreshBeach(fnPostProcess, fnParams) {
                AJAX.begin(
                    AJAX.GuGuZhenRequest.beach,
                    '',
                    (response) => {
                        AJAX.begin(
                            requestBeach.request,
                            requestBeach.data,
                            (response) => {
                                if (fnPostProcess != null) {
                                    fnPostProcess(fnParams);
                                }
                            });
                    });
            }

            function beginOpenBox() {
                POPUP.updateProgressMessage(`处理中，请稍候...（${count}）`);
                AJAX.begin(
                    requestOpenBox.request,
                    requestOpenBox.data,
                    (response) => {
                        if (response.responseText == 'ok') {
                            if (--count == 0) {
                                window.location.reload();
                            }
                            else {
                                beginRefreshBeach(beginOpenBox);
                            }
                        }
                        else {
                            alert(response.responseText);
                            window.location.reload();
                        }
                    });
            }
        }

        function executeAssistant() {
            let timer = setInterval(() => {
                if ((document.getElementById('beachall')?.firstChild?.nodeType ?? Node.ELEMENT_NODE) == Node.ELEMENT_NODE &&
                    (document.getElementById('wares')?.firstChild?.nodeType ?? Node.ELEMENT_NODE) == Node.ELEMENT_NODE) {

                    clearInterval(timer);

                    let btnBox = document.querySelector(
                        'div.col-md-12 > div.panel > div.panel-heading > div.btn-group.pull-right > button.btn.btn-success');

                    let maxOpen = Math.min(propEquipBoxMax, propEquipBoxCount);
                    let ctrlDiv = document.createElement('b');
                    ctrlDiv.innerHTML =
                        `<button type="button" class="${btnBox.className}"
                             id="btn-start">${propEquipBoxMeta.name}：库存${propEquipBoxCount}个，批量打开（1 至 ${maxOpen}）</button>` +
                        `<input type="text" id="text-box" style="width:30px;margin-left:3px;" title="打开数量"
                            value="${maxOpen}" oninput="value=value.replace(/[\\D]/g,'');" /> 个`;

                    let textBox = ctrlDiv.querySelector('#text-box');
                    textBox.disabled = (maxOpen > 0 ? '' : 'disabled');
                    textBox.onchange = (() => {
                        let v = parseInt(textBox.value);
                        if (v > maxOpen) {
                            textBox.value = (v = maxOpen).toString();
                        }
                        btnStart.disabled = (v > 0 ? '' : 'disabled');
                    });

                    let btnStart = ctrlDiv.querySelector('#btn-start');
                    btnStart.disabled = (maxOpen > 0 ? '' : 'disabled');
                    btnStart.onclick = (() => {
                        let v = parseInt(textBox.value);
                        if (v > maxOpen) {
                            textBox.value = (v = maxOpen).toString();
                        }
                        openBox(v);
                    });

                    ctrlDiv.style.marginRight = '5px';
                    ctrlDiv.style.float = 'left';
                    btnBox.parentNode.insertBefore(ctrlDiv, btnBox);

                    $(document).ajaxComplete((e, r) => {
                        if (r.status != 200) {
                            alert('沙滩助手: 网络请求失败！');
                            window.location.reload();
                        }
                    });
                }
            }, 200);
        }

        if (requestBeach != null && requestOpenBox != null && propEquipBoxMeta != null) {
            let p = [];
            PROPERTY.read(
                p,
                propEquipBoxMeta.name,
                () => {
                    if (p.length == 1 && (propEquipBoxCount = p[0].amount) > 0) {
                        executeAssistant();
                    }
                });
        }
        else {
            console.log('道具助手: 沙滩助手初始化失败');
        }
    }
    else if (window.location.pathname == AJAX.GuGuZhenRequest.equip.url) {
        const propHaloStoneMeta = PROPERTY.meta.map.get(3310);
        let requestPropertyUse = await AJAX.getInfoAsync('oclick');
        let backpacksDiv = document.getElementById('backpacks');

        function batchHaloStone(count, tab, arg1, arg2) {
            function beginHaloStone(requestData) {
                POPUP.updateProgressMessage(`处理中，请稍候...（${count}）`);
                AJAX.begin(
                    requestPropertyUse.request,
                    requestData,
                    (response) => {
                        if (--count > 0) {
                            beginHaloStone(requestData);
                        }
                        else {
                            // refresh tab state
                            eqbp(tab);
                            POPUP.close(true, true);
                        }
                    });
            }

            if (count > 0) {
                POPUP.initialize();
                POPUP.showProgressMessage();

                beginHaloStone(requestPropertyUse.data.replace('"+id+"', arg1).replace('"+id2+"', arg2));
            }
        }

        function executeAssistant() {
            let timer = setInterval(() => {
                let maskDiv = document.getElementById('equip-tab-div');
                if (maskDiv?.enableSwitchEquipSubtabs != null) {
                    clearInterval(timer);

                    if (maskDiv.enableSwitchEquipSubtabs(false)) {
                        let btn = backpacksDiv.querySelector('div > button.btn-success');
                        let div = btn?.parentElement;
                        if (div != null && !div.hasAttribute('batch-button-added')) {
                            div.setAttribute('batch-button-added', true);
                            let haloStone = [];
                            PROPERTY.read(
                                haloStone,
                                propHaloStoneMeta.name,
                                () => {
                                    if (haloStone[0]?.amount > 0) {
                                        btn.className = btn.className.replace('btn-block', '');
                                        btn.style.width = '45%';
                                        let btnBatch = btn.cloneNode(true);
                                        btnBatch.innerText = `批量使用${haloStone[0].meta.alias}（1 - ${haloStone[0].amount}）`;
                                        btnBatch.style.marginLeft = '3px';
                                        btnBatch.removeAttribute('onclick');
                                        btnBatch.onclick = (() => {
                                            let count = parseInt(txtBatch.value);
                                            let args = btn.getAttribute('onclick')?.match(/\d+/g);
                                            if (args?.length == 3 &&
                                                confirm(`这将消耗 ${count} 个“${haloStone[0].meta.alias}”，继续吗？`)) {

                                                batchHaloStone(count, parseInt(args[2]), args[0], args[1]);
                                            }
                                        });
                                        let txtBatch = document.createElement('input');
                                        txtBatch.type = 'text';
                                        txtBatch.title = `批量使用${haloStone[0].meta.alias}数量`;
                                        txtBatch.value = haloStone[0].amount.toString();
                                        txtBatch.style.height = getComputedStyle(btn).getPropertyValue('height');
                                        txtBatch.style.width = '9%';
                                        txtBatch.style.float = 'right';
                                        txtBatch.oninput = (() => {
                                            let v = parseInt(txtBatch.value = txtBatch.value.replaceAll(/[\D]/g, ''));
                                            if (v > haloStone[0].amount) {
                                                txtBatch.value = haloStone[0].amount.toString();
                                            }
                                            btnBatch.disabled = (v > 0 ? '' : 'disabled');
                                        });
                                        div.appendChild(btnBatch);
                                        div.appendChild(txtBatch);
                                    }
                                    maskDiv.enableSwitchEquipSubtabs(true);
                                });
                            return;
                        }
                    }
                }
            }, 200);
        }

        if (backpacksDiv != null && propHaloStoneMeta != null && requestPropertyUse != null) {
            let backpacksObserver = new MutationObserver(() => {
                backpacksObserver.disconnect();
                if (backpacksDiv.firstElementChild?.innerText?.indexOf('天赋光环') > 0) {
                    executeAssistant();
                }
                backpacksObserver.observe(backpacksDiv, { childList : true });
            });
            backpacksObserver.observe(backpacksDiv, { childList : true });
        }
    }
})();
