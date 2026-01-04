// ==UserScript==
// @name         DeepL翻译记录自动保存
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  将三秒内未变化的原始文本和翻译文本上传至notion对应页面(附带tag)
// @author       ziuch
// @match        https://www.deepl.com/*
// @icon         https://static.deepl.com/img/logo/DeepL_Logo_darkBlue_v2.svg
// @grant GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459564/DeepL%E7%BF%BB%E8%AF%91%E8%AE%B0%E5%BD%95%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/459564/DeepL%E7%BF%BB%E8%AF%91%E8%AE%B0%E5%BD%95%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let token = window.localStorage.NOTION_TOKEN || ''
    let database_id = window.localStorage.NOTION_DATABASE_ID || ''
    console.log('localstorge', window.localStorage)
    console.log('token', token)

    // Your code here...
    //提示信息 封装
    function Toast(msg, is_wrong = false, duration = 3000){
        var m = document.createElement('div');
        m.innerHTML = msg;
        let backgroundColor = is_wrong ? 'rgba(229,194,102, 0.8)' : 'rgba(48,111,112, 0.8)'
        m.style.cssText=`font-size: .45rem;color: rgb(255, 255, 255);background-color: ${backgroundColor};padding: 10px 15px; margin: 5 auto; top:85px; left:50%;transform: translate(-50%, -50%); border-radius: 4px; max-width: 80%; position: absolute; z-index:9999;text-align: center;`;
        m.setAttribute("class","text-sm font-semibold text-white")
        let card = $('#dl_translator')
        card.prepend(m);
        setTimeout(function() {
            var d = 0.5;
            m.style.opacity = '0';
            setTimeout(function() { card.remove(m) }, d*1000);
        }, duration);
    }
    function SaveToRomote(text, translation, tags){
        console.log('上传成功!');
        console.log('save tags', tags);
        let data = {
            'parent': {
                "database_id": database_id
            },
            'properties':{
                "Text": {
                    'title': [
                        {
                            'text': { 'content': text, 'link': null },
                            'plain_text': text,
                        },
                    ],
                },
                "Translation": {
                    "rich_text": [
                        {
                            "text": {
                                "content": translation
                            }
                        }
                    ]
                },
                "Tags": {
                    "multi_select": tags
                }
            },
        }
        GM_xmlhttpRequest({
            method: 'POST',
            url: `https://api.notion.com/v1/pages`,
            data: JSON.stringify(data),
            headers: {
                'Authorization': 'Bearer ' + token,
                "accept": "application/json",
                "content-type": "application/json",
                "Notion-Version": "2022-06-28"
            },
            onload: response => {
                if(response.status != 200) {
                    console.log(response.response)
                    Toast(response.status + ': ' + response.responseText, true);
                    return
                }
                Toast('翻译记录自动保存成功～');
                console.log('保存成功')}
        });
    }
    let tags = []
    function GetAllTags(){
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.notion.com/v1/databases/${database_id}`,
            responseType: 'json',
            timeout: 6000,
            headers: {
                'Authorization': 'Bearer ' + token,
                "accept": "application/json",
                "Notion-Version": "2022-06-28"
            },
            onload: response => {
                if(response.status != 200) {
                    console.log(response.response)
                    Toast(response.status + ': ' + response.responseText, true);
                    return
                }
                tags = response.response.properties.Tags.multi_select.options
                Toast('获取notion标签成功～');
                AddTagSelectToPage();
            }
        });
    }
    let flag = true
    function AddTagSelectToPage(){
        if(JSON.stringify($('#headlessui-tabs-tab-3')) != '{}'){
            return
        }

        console.log('tags', tags);
        let tagCheckStr = '<form id="tagcheckbox">';
        for(let i = 0; i < tags.length; i++) {
            let tag = tags[i]
            let margin = i == 0 ? '' : "'margin-left: 5px !important'"
            tagCheckStr += `<input type="checkbox" id="${tag.id}" name="${tag.name}" style=${margin}><label style="margin-left: 3px !important; color: ${tag.color}" for="${tag.id}">${tag.name}</label>`
        }
        tagCheckStr += `<input type="checkbox" id="add_tag_checkbox" name="exart" style='margin-left: 5px !important'><input id='add_tag_input' disabled='true' style="margin-left: 5px; border: 2px solid gray; text-indent: 3px; border-radius: 10px; width: 80px" placeholder="新增标签">`
        tagCheckStr += '</form>'

        var $btn = `
        <button dl-test="doctrans-tabs-switch-docs" id="headlessui-tabs-tab-3" role="tab" type="button" aria-selected="false" tabindex="-1" data-headlessui-state="" aria-controls="panelTranslateFiles">
        <div class="cardButton--VaX9A " aria-label="标签"><div class="innerUpper--JA8Bf" tabindex="-1"><div class="logo--erUTh" tabindex="-1">
        <svg t="1675618863572" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2682" width="200" height="200"><path d="M512 910.208L910.208 512 480.832 82.624l-378.816 24.448-19.776 373.376L512 910.208zM0 512L25.472 31.36 512 0l512 512-512 512-512-512z m293.376-128.96a85.952 85.952 0 1 0 0-171.904 85.952 85.952 0 0 0 0 171.904z" fill="#296290" p-id="2683"></path></svg>
        </div>
        <div class="text--HXdGT" tabindex="-1">
        <div class="textUpper--PrWcj" tabindex="-1">选择你需要为翻译加上的标签</div>
        <div class="textLower--BYwsB" tabindex="-1">
        ${tagCheckStr}
        </div></div></div>
        <div class="innerLower--yE4_4" tabindex="-1"></div></div>
        </button>`
        let tabbar = $('#headlessui-tabs-tab-2')
        if(typeof(tabbar) == undefined) {
            return
        }
        flag = false
        tabbar.after($btn);
        $("#add_tag_checkbox").change(function(){
            let checkbox = document.getElementById('add_tag_checkbox');
            console.log('check', checkbox)
            if(checkbox.checked) {
                $('#add_tag_input').css('border', '2px solid lightblue')
                $('#add_tag_input').removeAttr("disabled");
            } else {
                $('#add_tag_input').css('border', '2px solid gray')
                $('#add_tag_input').attr("disabled","disabled");
            }
        })
    }
    let click_github = false;
    function AddSettiongToPage(){

        var $btn = `
        <button dl-test="doctrans-tabs-switch-docs" id="headlessui-tabs-tab-4" role="tab" type="button" aria-selected="false" tabindex="-1" data-headlessui-state="" aria-controls="panelTranslateFiles">
        <div class="cardButton--VaX9A " aria-label="标签"><div class="innerUpper--JA8Bf" tabindex="-1"><div class="logo--erUTh" tabindex="-1">
        <svg t="1676634043327" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2770" width="200" height="200"><path d="M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56c10.1-8.6 13.8-22.6 9.3-35.2l-0.9-2.6c-18.1-50.5-44.9-96.9-79.7-137.9l-1.8-2.1c-8.6-10.1-22.5-13.9-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85c-2.4-13.1-12.7-23.3-25.8-25.7l-2.7-0.5c-52.1-9.4-106.9-9.4-159 0l-2.7 0.5c-13.1 2.4-23.4 12.6-25.8 25.7l-15.8 85.4c-35.9 13.6-69.2 32.9-99 57.4l-81.9-29.1c-12.5-4.4-26.5-0.7-35.1 9.5l-1.8 2.1c-34.8 41.1-61.6 87.5-79.7 137.9l-0.9 2.6c-4.5 12.5-0.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1 0 19.2 1.5 38.4 4.6 57.1L99 625.5c-10.1 8.6-13.8 22.6-9.3 35.2l0.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1c8.6 10.1 22.5 13.9 35.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4c2.4 13.1 12.7 23.3 25.8 25.7l2.7 0.5c26.1 4.7 52.8 7.1 79.5 7.1 26.7 0 53.5-2.4 79.5-7.1l2.7-0.5c13.1-2.4 23.4-12.6 25.8-25.7l15.7-85c36.2-13.6 69.7-32.9 99.7-57.6l81.3 28.9c12.5 4.4 26.5 0.7 35.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l0.9-2.6c4.5-12.3 0.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1 74.7 63.9c-11.3 26.1-25.6 50.7-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3-17.9 97c-28.1 3.2-56.8 3.2-85 0l-17.9-97.2-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5 0-15.3 1.2-30.6 3.7-45.5l6.5-40-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2 31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3 17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97 38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8 92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9z" p-id="2771" fill="#296290"></path><path d="M512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176z m79.2 255.2C570 602.3 541.9 614 512 614c-29.9 0-58-11.7-79.2-32.8C411.7 560 400 531.9 400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8C612.3 444 624 472.1 624 502c0 29.9-11.7 58-32.8 79.2z" p-id="2772" fill="#296290"></path></svg>
        </div>
        <div class="text--HXdGT" tabindex="-1">
        <div class="textUpper--PrWcj" tabindex="-1">脚本配置</div>
        <div class="textLower--BYwsB" tabindex="-1">
        <div id='inner' href='https://github.com/zhiqing0205/deepl-translation-log-to-notion' style="text-decoration: underline; z-index: 999999">配置教程</div>
        </div></div></div>
        <div class="innerLower--yE4_4" tabindex="-1"></div></div>
        </button>`
        let tabbar = $('.flex.flex-row')
        console.log('tabbar', tabbar)
        if(typeof(tabbar) == undefined) {
            return
        }
        flag = false
        tabbar.append($btn);
        $("#inner").click(function(){
            click_github = true
            //location.href = 'https://github.com/zhiqing0205/deepl-translation-log-to-notion'
            window.open('https://github.com/zhiqing0205/deepl-translation-log-to-notion', "_blank")
        })
        $("#headlessui-tabs-tab-4").click(function(){
            setTimeout(() => {
                if(click_github) {
                    click_github = false
                    return
                }
                let input_token = prompt("请填入token值", token);
                let input_database_id = prompt("请填入database_id值", database_id);
                window.localStorage.NOTION_TOKEN = input_token || token
                window.localStorage.NOTION_DATABASE_ID = input_database_id || database_id
                Toast('配置成功～')
                setTimeout(location.reload(), 1000)
            }, 50)
        })
    }
    function GetSelectTags(){
        if(JSON.stringify($('#headlessui-tabs-tab-3')) == '{}'){
            Toast('获取notion标签失败，正在重试')
            GetAllTags();
            return
        }
        let checkboxes = $('#tagcheckbox')[0]
        console.log(checkboxes)
        let selected = []
        for(let i = 0; i < checkboxes.length - 2; i++) {
            let item = checkboxes[i]
            if(item.checked){
                selected.push({'name': item.name})
            }
        }
        let n = checkboxes.length;
        console.log(checkboxes)
        if(checkboxes[n - 2].checked) {
            selected.push({'name': checkboxes[n - 1].value});
        }
        return selected
    }
    let my_text = '';
    let cnt = 3;
    let saved_set = new Set();
    let show_start = true
    let last = '';
    let init = '';
    console.log('DeepL translator logs auto save script start');
    Toast('翻译记录保存脚本启动～')
    GetAllTags();
    setTimeout(AddSettiongToPage, 2500);
    setInterval(function () {
        let text = $('#source-dummydiv').text().trim();
        let translation = $('#target-dummydiv').text().trim();

        let r = {'text': text, 'translation':translation};
        let rs = JSON.stringify(r)

        if(text.length == 0 || translation.length == 0) {
            return
        }
        if(init == ''){
            init = rs;
            last = rs;
        }
        if(rs == init) {
            return
        }
        init = '-1';

        if (last != rs) {
            cnt = 3;
            last = rs;
        } else {
            cnt -= 1;
            if(cnt == 0) {
                cnt = 3;
                if(!saved_set.has(rs)) {
                    saved_set.add(rs)
                    Toast('翻译记录已自动上传～')
                    let select_tags = GetSelectTags();
                    SaveToRomote(text, translation, select_tags);
                } else {
                    console.log('chongfu', text, translation);
                }
            }
        }
    }, 1000);
})();