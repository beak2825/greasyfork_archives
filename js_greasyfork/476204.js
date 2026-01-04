// ==UserScript==
// @name         v2ex tag
// @namespace    https://greasyfork.org/zh-CN/scripts/476204-v2ex-tag
// @version      0.23
// @description  v2ex用户标记,纯本地，不联网
// @author       yatzh 
// @match        *://*.v2ex.com/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476204/v2ex%20tag.user.js
// @updateURL https://update.greasyfork.org/scripts/476204/v2ex%20tag.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
     /* 
       代码来自 yatzh https://greasyfork.org/zh-CN/scripts/437891-v2ex-user-tag 
       修改下样式，别人@也展示 tag

  */
     


 
    // store key | 加上版本号，方便后续更改存储格式
    const TAG_JSON_STR_STORE_KEY = 'plugin.user_tag.tag_json_str.v0.1';
    const TAG_STYLE = '';
    const TAG_EDIT_CONTAINER_STYLE = 'background:#7e57c2; padding:5px; border-radius:10px';
    const TAG_EDIT_LABEL_STYLE = 'color:white;font-size:16px;margin:5px;';



    const TAG_CLASS = "utagclass"
    GM_addStyle(`
     .${TAG_CLASS}{
        color:#f1441d;
        font-weight:600;
        font-size:1.1em;
        
        font-style:italic;
        letter-spacing:3px;
        padding:2px 5px;
        margin:1px 3px;
     }
     /* 回复@ */
     .atcls{

        color:#41b349;
        font-weight:500;
        font-size:1.0em;


     }
     .${TAG_CLASS}::before{
        content:"#";
     }

    `)

    function getTagMap() {
        let tagJsonStr = GM_getValue(TAG_JSON_STR_STORE_KEY, "{}");
        return JSON.parse(tagJsonStr);
        // return {"zw1one" : "标签A,标签B", "Jooooooooo" : "", "Illusionary": "112"};
    }



    function saveTagMap(tagMap) {
        GM_setValue(TAG_JSON_STR_STORE_KEY, JSON.stringify(tagMap));
    }

 
    function tagUserName(username, tagMap ,isAt) {
        if (tagMap[username.innerText]) {
            let tagValue = tagMap[username.innerText];
            let userTags = tagValue.split(',');
            for (let userTag of userTags) {
                let oneTag = document.createElement('span');
                oneTag.textContent = userTag;
                oneTag.setAttribute('style', TAG_STYLE);
                oneTag.setAttribute('class', isAt ? "utagclass atcls":"utagclass");
                username.append(oneTag)
            }
        }
    }
 
    // let url = document.URL;
    let path = location.pathname
    let tagMap = getTagMap();
 
    if (path == '/' || path.startsWith('/go/') || path.startsWith('/tag/')) {
        // 首页及类首页
        let home_list = document.getElementsByClassName('topic_info');
        let len = home_list.length;
        for (let i = 0; i < len; i++) {
            let username = path === '/' || path.startsWith('/tag/') ? home_list[i].children[2] : home_list[i].children[0];
            tagUserName(username, tagMap);
        }
    } else if (path.startsWith('/t/')) {
        // 帖子详情页
 
        // 主题
        let opUsername = document.getElementsByTagName('small')[0].children[0];
        tagUserName(opUsername, tagMap);
        // 回复
        let comments = document.getElementsByClassName('cell');
        for (let i = 0; i < comments.length; i++) {
            if (comments[i].id.substring(0, 2) != 'r_') {
                continue;
            }
            let username = comments[i].getElementsByTagName('strong')[0];
            tagUserName(username, tagMap);
        }

        var arrR =  document.querySelectorAll(".reply_content > a")
        if(arrR && arrR.length){
            arrR.forEach(e=>{
                if(/\/member\//.test(e.getAttribute("href"))){
                    tagUserName(e, tagMap,1);
            }
    })
}


    } else if (path.startsWith('/member/')) {
        // 个人主页
        let username = document.getElementsByTagName('h1')[0];
        // 标签编辑
        let usernameStr = username.innerText;
        tagUserName(username, tagMap);
 
        
        let editContainer = document.createElement('div');
        editContainer.setAttribute('style', TAG_EDIT_CONTAINER_STYLE);
 
        let editLabel = document.createElement('span');
        editLabel.setAttribute('style', TAG_EDIT_LABEL_STYLE);
        editLabel.innerText = "标签编辑：";
        editContainer.appendChild(editLabel);
 
        let editTagContent = document.createElement('textarea');
        editTagContent.setAttribute('id', 'editTagContent');
        editTagContent.setAttribute('style', 'width:90%; height:50px');
        editTagContent.setAttribute('placeholder', '标签，英文逗号分割，如： sb,zz');
        editTagContent.value = tagMap[usernameStr] ? tagMap[usernameStr] : "";
        editContainer.appendChild(editTagContent);

        
        let saveBtn = document.createElement('input');
        saveBtn.setAttribute('type', 'button');
        saveBtn.setAttribute('id', 'saveBtn');
        saveBtn.setAttribute('value', '保存标签');
        saveBtn.setAttribute('class', 'normal button');
        editContainer.appendChild(saveBtn);
 
        document.getElementsByTagName('h1')[0].parentElement.appendChild(editContainer);
        document.getElementById('saveBtn').onclick = function() {
            let newTagContent = editTagContent.value;
            if (1 || confirm('确认要保存？[' + usernameStr + ']的标签[' + newTagContent + ']？')) {
                tagMap[usernameStr] = newTagContent;
                saveTagMap(tagMap);
                location.reload();
            }
        };
    }
})();

