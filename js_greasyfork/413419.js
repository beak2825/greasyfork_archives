// ==UserScript==
// @name         知乎用戶頁展示用戶ID
// @namespace    show_zhihu_user_id
// @version      0.1
// @description  在知乎的用戶頁的用戶名下方顯示一個用戶IDa
// @author       EvilRecluse
// @match        *://www.zhihu.com/people/*
// @match        *://www.zhihu.com/org/*
// @grant        none
// @create    2020-10-15
// @lastmodified  2020-10-16
// @downloadURL https://update.greasyfork.org/scripts/413419/%E7%9F%A5%E4%B9%8E%E7%94%A8%E6%88%B6%E9%A0%81%E5%B1%95%E7%A4%BA%E7%94%A8%E6%88%B6ID.user.js
// @updateURL https://update.greasyfork.org/scripts/413419/%E7%9F%A5%E4%B9%8E%E7%94%A8%E6%88%B6%E9%A0%81%E5%B1%95%E7%A4%BA%E7%94%A8%E6%88%B6ID.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 页面的<script>中有json的用户信息
    var html_info = document.getElementById('js-initialData').text;
    html_info = html_info.replace(/\\u[\s\S]{4}/g, "/");
    html_info = JSON.parse(html_info);
    var _id = Object.values(html_info.initialState.entities.users)[0].id;
    // 添加頁面元素
    document.getElementsByClassName("ProfileHeader-title")[0].insertAdjacentHTML(
        'beforeend',
        '</br><button id="truely_id_btn" class="VoteButton VoteButton--up">ID：<span>'+ _id +'</span></button>');

    // 為顯示ID的按鈕添加點擊複製功能
    document.getElementById('truely_id_btn').addEventListener(
        'click',
        function (){
            var input = document.createElement('input');
            input.setAttribute('id', 'for_copy_id');
            input.setAttribute('value', _id);
            document.body.appendChild(input);
            document.getElementById('for_copy_id').select();
            input.setSelectionRange(0, 9999);
            if (document.execCommand('copy')){
                document.execCommand('copy');
                document.getElementById('truely_id_btn').setAttribute("class","Button Button--grey Button--withIcon Button--withLabel");
            }else{
                console.log('fail');}
            input.remove();});

})();


