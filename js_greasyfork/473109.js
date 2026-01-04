// ==UserScript==
// @name         NGA艾泽拉斯国家地理 - 主题过滤器
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  根据关键字过滤NGA论坛主题
// @author       艾德帕拉丁/斩梦人天天
// @match        *://bbs.nga.cn/*
// @match        *://nga.178.com/*
// @match        *://ngabbs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nga.cn
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473109/NGA%E8%89%BE%E6%B3%BD%E6%8B%89%E6%96%AF%E5%9B%BD%E5%AE%B6%E5%9C%B0%E7%90%86%20-%20%E4%B8%BB%E9%A2%98%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/473109/NGA%E8%89%BE%E6%B3%BD%E6%8B%89%E6%96%AF%E5%9B%BD%E5%AE%B6%E5%9C%B0%E7%90%86%20-%20%E4%B8%BB%E9%A2%98%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let defaultKeywords = '';
    let keywords = '';
    let gmc = new GM_config({
        'id': 'MyConfig',
        'title': '艾泽拉斯国家地理 - 主题过滤器 - 设置',
        'fields': {
            'keywords': {
                'label': '过滤关键字',
                'type': 'text',
                'default': defaultKeywords
            }
        },
        'css': '#MyConfig_wrapper {text-align:center;} #MyConfig_field_keywords{width:30em} #MyConfig_buttons_holder{text-align:center}',
        'events':{
            'init': function () {
                keywords = this.get('keywords');
                handleFiltration();
                setupSettingButton();
            },
            'save': function () {
                keywords = this.get('keywords');
                handleFiltration();
                location.reload();
            }
        }
    });
    let arrayKeywords = null;
    let topicTable = null;
    let topicLists = null;
    let settingButtonContainer = null;
    let settingButtonTemplate = null;
    let settingButton = null;
    let intervalTimer = null;

    function resetup(){
        arrayKeywords = convertKeywordsToRegex(keywords);
        topicTable = document.querySelector('#topicrows');
        if (topicTable) {
            topicLists = Array.from(topicTable.tBodies);
        }
        settingButtonContainer = document.querySelector('#m_pbtntop .right_ table tr');
        if (settingButtonContainer){
            settingButtonTemplate = settingButtonContainer.querySelector('td')
        }
    }
    function isMatched(topicName){
        let ret = false
        arrayKeywords.forEach(function(reg, index, arr){
            if (topicName.match(reg)) {
                console.log('matched!', topicName)
                ret = true
            }
        });
        return ret
    }
    function convertKeywordsToRegex(){
        keywords = keywords.replaceAll(' ','');
        let ret = null;
        if (keywords) {
            ret = [];
            let list = keywords.replaceAll('，',',').split(',');
            list.forEach(function(item, index, arr){
                let reg = new RegExp(item, 'g');
                ret.push(reg)
            })
        }
        return ret;
    }
    function setupSettingButton(){
        if (settingButtonTemplate && topicLists) {
            settingButton = settingButtonTemplate.cloneNode();
            settingButton.innerHTML = settingButtonTemplate.innerHTML;

            let link = settingButton.querySelector('a');
            let linkText = link.querySelector('span');
            link.setAttribute('href', 'javascript:void 0');
            link.onclick = function(){gmc.open()};
            if (linkText) {
                linkText.innerText = '过滤设置';
                settingButtonContainer.insertBefore(settingButton, settingButtonTemplate);
            }else{
                settingButton = null;
            }
        }
    }
    function handleFiltration(){
        resetup()
        arrayKeywords = convertKeywordsToRegex(keywords);
        if (arrayKeywords && topicTable && topicLists && settingButtonTemplate) {
            topicLists.forEach(function(tbody, index, arr){
                let topicName = tbody.querySelector('.c2 a.topic').innerText;
                if (isMatched(topicName)){
                    topicTable.removeChild(tbody)
                }
            });
            topicLists = Array.from(topicTable.tBodies);
            let rowOneMark = true;
            topicLists.forEach(function(tbody, index, arr){
                let tr = tbody.querySelector('tr')
                tr.classList.remove('row1');
                tr.classList.remove('row2');
                if (rowOneMark) {
                    tr.classList.add('row1');
                }else{
                    tr.classList.add('row2');
                }
                rowOneMark = !rowOneMark;
            });
        }
    }
    function checkPageFresh(){
        if (settingButton != document.querySelector('#m_pbtntop .right_ table tr td')){
            handleFiltration();
            setupSettingButton();
        }
    }
    clearInterval(intervalTimer)
    intervalTimer = setInterval(function(){
        checkPageFresh()
    }, 50)

})();