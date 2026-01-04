// ==UserScript==
// @name         Bilibili 轴Man小助手
// @namespace    http://tampermonkey.net/
// @version      1.6.3
// @description  将评论区的轴转换至Bilibili的笔记，实现手机可点的特性
// @author       as042971
// @icon         https://experiments.sparanoid.net/favicons/v2/www.bilibili.com.ico
// @match        *://www.bilibili.com/video/av*
// @match        *://www.bilibili.com/video/BV*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/438636/Bilibili%20%E8%BD%B4Man%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/438636/Bilibili%20%E8%BD%B4Man%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 设置 useIndent = true 会在文本前增加缩进和引导线
    const useIndent = false;
    // 设置 useNewLine = true 会在文本后增加空行
    const useNewLine = false;

    const getTitle = function(bvid){
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                url: "https://api.bilibili.com/x/web-interface/view?bvid="+bvid,
                method : "GET",
                onload : function(xhr){
                    try {
                        resolve('▶️'+JSON.parse(xhr.response).data.title)
                    } catch (error) {
                        resolve("(打开二创)");
                    }
                },
                onerror : function(err) {
                    resolve("(打开二创)");
                }
            });
        });
    };
    const insertNewLine = function (quill) {
        let currentPosition = quill.getSelection(true);
        quill.insertText(currentPosition.index,'\n',
                            {'color': null, 'link': null,'bold': false ,'size': null, 'background': null},'silent');
    };
    const markTime = function (quill, cid, index, seconds, cidCount, labelTitle) {
        let currentPosition = quill.getSelection(true);
        quill.insertEmbed(currentPosition.index, 'tag', {
            'cid': cid,
            'oid_type': 0,
            'status': 0,
            'index': index,
            'seconds': seconds,
            'cidCount': cidCount,
            'key': (new Date).getTime(),
            'title': '',
            'epid': 0,
            'desc': labelTitle
        }, 'silent');
        currentPosition.index = currentPosition.index + 1;
        quill.setSelection(currentPosition);
    };
    const insertText = async function (quill, text, guide) {
        let currentPosition = quill.getSelection(true);
        if (useIndent) {
            // 插入引导线
            let guideStr = (guide)? "  └─ " : '  　　 ';
            quill.insertText(currentPosition.index, guideStr,
                                {'color': '#cccccc', 'link': null,'bold': false ,'size': null, 'background': null}, 'silent');
        }
        let type = 'norm'
        let scType = 60
        if (text.startsWith('🎤')) {
            type = 'song';
        }
        else if (text.startsWith('💃')) {
            type = 'dance';
        }
        else if (text.charAt(text.length-1) == '*') {
            if (text.charAt(text.length-2) == '*') {
                text = text.substr(0, text.length - 2);
                type = 'ex_mark';
            }
            else {
                text = text.substr(0, text.length - 1);
                type = 'mark';
            }
        }
        else if (text.endsWith('*60') || text.endsWith('*59') ) {
            type = 'sc'
            scType = 60
            text = text.substr(0, text.length - 3);
        }
        else if (text.endsWith('*120') || text.endsWith('*119') ) {
            type = 'sc'
            scType = 120
            text = text.substr(0, text.length - 4);
        }
        else if (text.endsWith('*300') || text.endsWith('*299') ) {
            type = 'sc'
            scType = 300
            text = text.substr(0, text.length - 4);
        }
        else if (text.endsWith('*1800') || text.endsWith('*1799') ) {
            type = 'sc'
            scType = 1800
            text = text.substr(0, text.length - 5);
        }
        else if (text.endsWith('*3600') || text.endsWith('*3599') ) {
            type = 'sc'
            scType = 3600
            text = text.substr(0, text.length - 5);
        }
        else if (text.endsWith('*7200') || text.endsWith('*7199') ) {
            type = 'sc'
            scType = 7200
            text = text.substr(0, text.length - 5);
        }

        // 使用正则表达式分割链接
        let parts = text.split(/(BV[A-Za-z0-9]{10})|(https:\/\/b23\.tv\/[A-Za-z0-9]{7})/g);
        for (let i = 0; i < parts.length; i++) {
            // 增加文本部分
            let part = parts[i];
            if (!part) {
                continue;
            }
            if (part.match(/BV[A-Za-z0-9]{10}/g)) {
                currentPosition = quill.getSelection(true);
                let uri = 'https://www.bilibili.com/video/'+ part;
                let title = await getTitle(part);
                quill.insertText(currentPosition.index, title,
                                    {'color': '#0b84ed', 'link': uri,'bold': false ,'size': null, 'background': null}, 'silent');
            }
            else if (part.match(/https:\/\/b23\.tv\/[A-Za-z0-9]{7}/g)) {
                currentPosition = quill.getSelection(true);
                let uri = part;
                let title = '🔗打开链接';
                quill.insertText(currentPosition.index, title,
                                    {'color': '#0b84ed', 'link': uri,'bold': false ,'size': null, 'background': null}, 'silent');
            }
            else {
                currentPosition = quill.getSelection(true);
                if (type == 'song') {
                    quill.insertText(currentPosition.index, part,
                                        {'color': '#0b84ed', 'bold': false, 'link': null, 'size': null, 'background': null}, 'silent');
                } else if (type == 'dance') {
                    quill.insertText(currentPosition.index, part,
                                        {'color': '#017001', 'bold': false, 'link': null, 'size': null, 'background': null}, 'silent');
                } else if (type == 'mark') {
                    quill.insertText(currentPosition.index, part,
                                        {'color': '#ee230d', 'bold': false, 'link': null, 'size': null, 'background': null}, 'silent');
                } else if (type == 'ex_mark') {
                    quill.insertText(currentPosition.index, part,
                                        {'color': '#ee230d', 'bold': true, 'link': null, 'size': null, 'background': null}, 'silent');
                } else if (type == 'sc') {
                    let color = null
                    if (scType == 60) {
                        color = '#0b84ed'
                    } else if (scType == 120) {
                        color = '#0176ba'
                    } else if (scType == 300) {
                        color = '#f8ba00'
                    } else if (scType == 1800) {
                        color = '#ff9201'
                    } else if (scType == 3600) {
                        color = '#ee230d'
                    } else if (scType == 7200) {
                        color = '#b41700'
                    }
                    quill.insertText(currentPosition.index, part,
                                        {'color': color, 'bold': false, 'link': null, 'size': null, 'background': null}, 'silent');
                } else {
                    quill.insertText(currentPosition.index, part,
                                        {'color': null, 'link': null, 'bold': false, 'size': null, 'background': null}, 'silent');
                }
            }
        }
        if (parts.length > 1) {
            currentPosition = quill.getSelection(true);
            quill.insertText(currentPosition.index, ' (手机端建议从评论回复中打开链接)',
                                {'color': '#cccccc', 'link': null,'bold': false ,'size': null, 'background': null}, 'silent');
        }
        insertNewLine(quill);
    };
    const textWidth = function(text){
        var span = document.createElement("span");
        span.setAttribute('class', 'ql-size-18px');
        var result = {};
        result.width = span.offsetWidth;
        span.style.visibility = "hidden";
        span.style.display = "inline-block";
        document.body.appendChild(span);
        if(typeof span.textContent != "undefined"){
            span.textContent = text;
        }else{
            span.innerText = text;
        }
        return parseFloat(window.getComputedStyle(span).width) - result.width;
    }
    const insertTitle = function(quill, title, size, background) {
        insertNewLine(quill)
        let currentPosition = quill.getSelection(true);
        quill.formatLine(currentPosition.index, currentPosition.length , 'align', '');
        // 总计240px
        let hCnt = 0;
        let wCnt = 0;
        let titleWidth = textWidth(title);
        let margin = (180 - titleWidth) / 2;
        let hSpaceWidth = textWidth(' ');
        let wSpaceWidth = textWidth('　');
        if (margin > 0) {
            wCnt = parseInt(margin / wSpaceWidth);
            margin -= wCnt * wSpaceWidth;
            hCnt = parseInt(margin / hSpaceWidth);
        }
        for (let i = 0; i < wCnt; i++) {
            title = ' ' + title + ' ';
        }
        for (let i = 0; i < wCnt; i++) {
            title = '　' + title + '　';
        }
        quill.insertText(currentPosition.index, title,
                            {'color': null, 'link': null,'bold': true, 'size': size, 'background': background }, 'silent');
        insertNewLine(quill);
        quill.formatLine(currentPosition.index, currentPosition.length , 'align', 'center');
    }
    const parseTime = function (timeStr) {
        const timePart = timeStr.split(":");
        if (timePart.length == 3) {
            return parseInt(timePart[0]) * 3600 + parseInt(timePart[1]) * 60 + parseInt(timePart[2]);
        } else {
            return parseInt(timePart[0]) * 60 + parseInt(timePart[1]);
        }
    };
    const wait1s = function () {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 1000);
        });
    };
    const insertScreenshot = async function (index, time) {
        unsafeWindow.player.seek(time - 2);
        await wait1s();
        await wait1s();
        unsafeWindow.player.pause();
        await wait1s();
        document.querySelector('.ql-capture-btn').click();
        await wait1s();
        await wait1s();
    };

    const handleTimeline = async function (inputStr, cid, index, cidCount, title, mode, labelTitle, cid2, index2, labelTitle2, deltaTime, checkMode) {
        let quill = document.querySelector('.ql-container').__quill;
        if (title != '') {
            if (title.includes('弹幕') && !title.includes('无弹幕')) {
                insertTitle(quill, title, '18px', '#73fdea');
            } else {
                insertTitle(quill, title, '18px', '#fff359');
            }
        }

        // h:mm:ss 型时间
        const timeRegex = /^(\d{1})\:([0-5]{1}\d{1})\:([0-5]{1}\d{1})$/;
        // mm:ss 型时间
        const timeRegex2 = /^([0-5]{1}\d{1})\:([0-5]{1}\d{1})$/;
        // 通过换行分隔
        const inputStrList = inputStr.split(/[\r\n]+/);
        for (let i = 0; i < inputStrList.length; i++) {
            let inputStrItem = inputStrList[i];
            let nonTimeStr = '';
            let time = -1;
            // 通过空格分隔
            const inputPart = inputStrItem.split(' ');
            for (let j = 0; j < inputPart.length; j++) {
                let currentPosition = quill.getSelection(true);
                let part = inputPart[j];
                if (part) {
                    if (timeRegex.test(part) || timeRegex2.test(part)) {
                        // 这是一个时间戳
                        // 结束上一次的非时间戳内容
                        if (nonTimeStr != '') {
                            if (nonTimeStr.startsWith('##')) {
                                insertTitle(quill, nonTimeStr.substr(2, nonTimeStr.length - 2), '16px', null);
                            }
                            else if (time != -1) {
                                markTime(quill, cid, index, time, cidCount, labelTitle);
                                let currentPosition = quill.getSelection(true);
                                if (cid2) {
                                    quill.insertText(currentPosition.index, ' ',
                                                    {'color': '#cccccc', 'link': null,'bold': false ,'size': null, 'background': null}, 'silent');
                                    markTime(quill, cid2, index2, time + deltaTime, cidCount, labelTitle2);
                                }
                                currentPosition = quill.getSelection(true);
                                quill.insertText(currentPosition.index, ' ⇙',
                                                    {'color': '#cccccc', 'link': null,'bold': false ,'size': null, 'background': null}, 'silent');
                                insertNewLine(quill);
                                if (checkMode) {
                                    await insertScreenshot(index, time);
                                }
                                await insertText(quill, nonTimeStr, true);
                                time = -1;
                            } else {
                                await insertText(quill, nonTimeStr, false);
                            }
                            if (useNewLine) {
                                insertNewLine(quill);
                            }
                            nonTimeStr = '';
                        }
                        // 标记这个时间戳
                        time = parseTime(part);
                    } else {
                        if (nonTimeStr != '') {
                            nonTimeStr += ' ';
                        }
                        nonTimeStr += part;
                    }
                }
            }
            if (nonTimeStr != '') {
                if (mode == 1 && nonTimeStr.startsWith('##')) {
                    insertTitle(quill, nonTimeStr.substr(2, nonTimeStr.length - 2), '17px', null);
                }
                else if (time != -1) {
                    markTime(quill, cid, index, time, cidCount, labelTitle);
                    let currentPosition = quill.getSelection(true);
                    if (cid2) {
                        quill.insertText(currentPosition.index, ' ',
                                        {'color': '#cccccc', 'link': null,'bold': false ,'size': null, 'background': null}, 'silent');
                        markTime(quill, cid2, index2, time + deltaTime, cidCount, labelTitle2);
                    }
                    currentPosition = quill.getSelection(true);
                    quill.insertText(currentPosition.index, ' ⇙',
                                        {'color': '#cccccc', 'link': null,'bold': false ,'size': null, 'background': null}, 'silent');
                    insertNewLine(quill);
                    if (checkMode) {
                        await insertScreenshot(index, time);
                    }
                    await insertText(quill, nonTimeStr, true);
                    time = -1;
                } else {
                    await insertText(quill, nonTimeStr, false);
                }
                if (useNewLine) {
                    insertNewLine(quill);
                }
            }
        }
        // 必须进行一次user插入，否则无法正常保存
        insertNewLine(quill);
        let currentPosition = quill.getSelection(true);
        quill.insertText(currentPosition, '', 'user');
    };
    const inject = function(toolbar) {
        let pages = unsafeWindow.__INITIAL_STATE__.videoData.pages;
        let cidCount = pages.length;
        let container = document.createElement('div');
        container.setAttribute('style', 'margin:0 10px 10px');

        // 第二行：配置分P标题和标签
        let subContainer2 = document.createElement('div');
        subContainer2.setAttribute('style', 'width: 100%; display:flex; flex-flow:row;');
        let customTitleInputContainer = document.createElement('div');
        customTitleInputContainer.setAttribute('style', 'flex:1; display:flex; flex-flow:row; min-width:200px;');
        let customTitleInput = document.createElement('input');
        customTitleInput.setAttribute('disabled', 'disabled');
        customTitleInput.setAttribute('placeholder', '自定义分p标题');
        customTitleInput.setAttribute('style', 'flex:1; display:flex; flex-flow:row; min-width:90px;');
        customTitleInputContainer.appendChild(customTitleInput);
        let customTimeLabelInput = document.createElement('input');
        customTimeLabelInput.setAttribute('placeholder', '自定义标签');
        customTimeLabelInput.setAttribute('style', 'width:90px; display:flex; flex-flow:row');
        customTitleInputContainer.appendChild(customTimeLabelInput);

        let modeSelect = document.createElement('select');
        modeSelect.setAttribute('style', 'width:150px; display:flex; flex-flow:row');
        let modeSelectOption1 = document.createElement('option');
        modeSelectOption1.innerHTML = '使用默认的分P标题';
        modeSelect.appendChild(modeSelectOption1);
        let modeSelectOption3 = document.createElement('option');
        modeSelectOption3.innerHTML = '使用自定义标题';
        modeSelect.appendChild(modeSelectOption3);
        let modeSelectOption4 = document.createElement('option');
        modeSelectOption4.innerHTML = '不添加标题';
        modeSelect.appendChild(modeSelectOption4);
        modeSelect.onchange = function() {
            if (modeSelect.selectedIndex == 1) {
                customTitleInput.removeAttribute('disabled');
            } else {
                customTitleInput.setAttribute('disabled', 'disabled');
            }
        }

        subContainer2.appendChild(modeSelect);
        subContainer2.appendChild(customTitleInputContainer);

        // 第三行（默认隐藏）：配置未上传的分P
        let subContainer1x = document.createElement('div');
        subContainer1x.setAttribute('style', 'width: 100%; display:none; flex-flow:row;');
        let subContainer1xLeft =document.createElement('div');
        subContainer1xLeft.setAttribute('style', 'width:150px; display:flex; flex-flow:row;');
        let cidIdxInput = document.createElement('input');
        cidIdxInput.setAttribute('style', 'width:50%; display:flex; flex-flow:row;');
        cidIdxInput.setAttribute('placeholder', '分P序号');
        subContainer1xLeft.appendChild(cidIdxInput);
        let cidCntInput = document.createElement('input');
        cidCntInput.setAttribute('style', 'width:50%; display:flex; flex-flow:row;');
        cidCntInput.setAttribute('placeholder', '总分P数量');
        subContainer1xLeft.appendChild(cidCntInput);
        subContainer1x.appendChild(subContainer1xLeft);
        let cidInput = document.createElement('input');
        cidInput.setAttribute('style', 'flex:1; display:flex; flex-flow:row; min-width:200px;');
        cidInput.setAttribute('placeholder', '分P的CID（从视频发布者处获知）');
        subContainer1x.appendChild(cidInput);

        // 第四行：选择额外的时间胶囊
        let subContainer3 = document.createElement('div');
        subContainer3.setAttribute('style', 'width: 100%; display:flex; flex-flow:row;');
        let pselect3 = document.createElement('select');
        pselect3.setAttribute('style', 'width:150px; display:flex; flex-flow:row;');
        pselect3.setAttribute('disabled', 'disabled');
        for (let index=0; index < pages.length; index++) {
            let pselectOption = document.createElement('option');
            pselectOption.innerHTML = pages[index].part;
            pselect3.appendChild(pselectOption);
        }
        subContainer3.appendChild(pselect3);

        let pselect3enableLine = document.createElement("li");
        pselect3enableLine.setAttribute('style', 'flex:1; display:flex; flex-flow:row; min-width:90px;');

        let deltaTimeSelector = document.createElement("input");
        deltaTimeSelector.setAttribute("type","number");
        deltaTimeSelector.setAttribute("value","0");
        deltaTimeSelector.setAttribute('style', 'width:90px; display:flex; flex-flow:row');
        deltaTimeSelector.setAttribute('disabled', 'disabled');

        let checkBox = document.createElement("input");
        checkBox.setAttribute("type","checkbox");
        checkBox.onchange = function() {
            if (checkBox.checked) {
                pselect3.removeAttribute('disabled');
                deltaTimeSelector.removeAttribute('disabled');
                customTimeLabelInput.setAttribute('disabled', 'disabled');
            } else {
                pselect3.setAttribute('disabled', 'disabled');
                deltaTimeSelector.setAttribute('disabled', 'disabled');
                customTimeLabelInput.removeAttribute('disabled');
            }
        }
        pselect3enableLine.appendChild(checkBox);
        pselect3enableLine.appendChild(document.createTextNode('第二时间胶囊'))
        subContainer3.appendChild(pselect3enableLine);
        subContainer3.appendChild(deltaTimeSelector);

        // 第一行：选择分P和轴录入
        let checkEnableLine = document.createElement("li");
        checkEnableLine.setAttribute('style', 'width:93px; display:flex; flex-flow:row');
        let checkCheckBox = document.createElement("input");
        checkCheckBox.setAttribute("type","checkbox");
        checkEnableLine.appendChild(checkCheckBox);
        checkEnableLine.appendChild(document.createTextNode('校对模式'))

        let subContainer1 = document.createElement('div');
        subContainer1.setAttribute('style', 'width: 100%; display:flex; flex-flow:row;');
        let pselect = document.createElement('select');
        pselect.setAttribute('style', 'width:150px; display:flex; flex-flow:row;');
        let defaultPselectOption = document.createElement('option');
        defaultPselectOption.innerHTML = '(当前分P)';
        pselect.appendChild(defaultPselectOption);
        for (let index=0; index < pages.length; index++) {
            let pselectOption = document.createElement('option');
            pselectOption.innerHTML = pages[index].part;
            pselect.appendChild(pselectOption);
        }
        let advancedPselectOption = document.createElement('option');
        advancedPselectOption.innerHTML = '(还未过审的分P)';
        pselect.appendChild(advancedPselectOption);
        pselect.onchange = function() {
            if (pselect.selectedIndex == 0) {
                checkCheckBox.removeAttribute('disabled');
            } else {
                checkCheckBox.setAttribute('disabled', 'disabled');
            }
            if (pselect.selectedIndex == pages.length + 1) {
                subContainer1x.style.display = 'flex';
            } else {
                subContainer1x.style.display = 'none';
            }
        }

        subContainer1.appendChild(pselect);

        let rawTimelineInputContainer = document.createElement('div');

        rawTimelineInputContainer.setAttribute('style', 'flex:1; display:flex; flex-flow:row; min-width:200px;');
        let rawTimeline = document.createElement('input');
        rawTimeline.setAttribute('style', 'flex:1; display:flex; flex-flow:row; min-width:90px;');
        rawTimeline.setAttribute('placeholder', '将轴粘贴至这里...');
        rawTimeline.oninput = async function () {
            let data = rawTimeline.value;
            rawTimeline.value = "";
            rawTimeline.setAttribute('disabled', 'disabled');
            rawTimeline.setAttribute('placeholder', '处理中，请稍后...');

            let cid = undefined;
            let index = undefined;
            let title = '';

            if (pselect.selectedIndex == 0) {
                cid = unsafeWindow.cid;
                for (index=0; index < pages.length; index++) {
                    if (pages[index].cid == cid) {
                        title = pages[index].part;
                        break;
                    }
                }
                index += 1;
            } else if (pselect.selectedIndex == pages.length + 1) {
                cid = cidInput.value;
                index = parseInt(cidIdxInput.value);
                cidCount = parseInt(cidCntInput.value);
            } else {
                index = pselect.selectedIndex;
                let item = pages[index-1];
                cid = item.cid;
                title = item.part;
            }
            let labelTitle = '';
            if (customTimeLabelInput.value) {
                labelTitle = customTimeLabelInput.value;
            }
            let cid2 = null
            let index2 = null
            let labelTitle2 = ''
            if (checkBox.checked) {
                index2 = pselect3.selectedIndex + 1;
                let item2 = pages[index2-1];
                cid2 = item2.cid;
                if (title.includes('弹幕') && !title.includes('无弹幕')) {
                labelTitle = '弹'
                } else {
                labelTitle = ''
                }
                title = title + ' / ' + item2.part
                if (item2.part.includes('弹幕') && !item2.part.includes('无弹幕')) {
                labelTitle2 = '弹'
                } else {
                labelTitle2 = ''
                }
            }

            if (customTitleInput.value && modeSelect.selectedIndex == 1) {
                title = customTitleInput.value;
            }
            if (modeSelect.selectedIndex == 2) {
                title = '';
            }

            await handleTimeline(data, cid, index, cidCount, title, modeSelect.selectedIndex, labelTitle, cid2, index2, labelTitle2, parseInt(deltaTimeSelector.value), checkCheckBox.checked && pselect.selectedIndex == 0);
            rawTimeline.removeAttribute('disabled');
            rawTimeline.setAttribute('placeholder', '将轴粘贴至这里...');
        };

        rawTimelineInputContainer.appendChild(rawTimeline);
        rawTimelineInputContainer.appendChild(checkEnableLine);
        subContainer1.appendChild(rawTimelineInputContainer);

        container.appendChild(subContainer1);
        container.appendChild(subContainer1x);
        container.appendChild(subContainer2);
        container.appendChild(subContainer3);

        toolbar.parentNode.insertBefore(container, toolbar.nextSibling);
    };
    let app = document.getElementById('app');
    let observerOptions = {
        childList: true,
        attributes: false,
        subtree: true
    };
    let observer = new MutationObserver((mutation_records) => {
        let toolbar = document.querySelector('.ql-toolbar');
        if (toolbar && toolbar.id != 'hidden-toolbar') {
            inject(toolbar);
            observer.disconnect();
        }
    });
    observer.observe(app, observerOptions);
})();

