// ==UserScript==
// @name        编程猫发现页搜索框添加
// @namespace   https://shequ.codemao.cn/user/15753247
// @match       https://shequ.codemao.cn/discover
// @grant       none
// @version     1.1
// @author      独立的暴风雀
// @description 编程猫发现页增加搜索作品功能
// // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453017/%E7%BC%96%E7%A8%8B%E7%8C%AB%E5%8F%91%E7%8E%B0%E9%A1%B5%E6%90%9C%E7%B4%A2%E6%A1%86%E6%B7%BB%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/453017/%E7%BC%96%E7%A8%8B%E7%8C%AB%E5%8F%91%E7%8E%B0%E9%A1%B5%E6%90%9C%E7%B4%A2%E6%A1%86%E6%B7%BB%E5%8A%A0.meta.js
// ==/UserScript==
setTimeout(()=>{
    document.querySelector("#discoverNamespace > div > div.r-discover-c-tagList--sort_cont").insertAdjacentHTML('beforebegin',`<form class="r-community--search_form r-community--small"><input type="text" placeholder="搜索作品" class="r-community--small" name="keyword"><input type="submit" style="display: none;" id="search-button"><span class="r-community--search_btn" onclick="document.querySelector('#search-button').click()"><i class="r-community--icon_search"></i></span></form>`);
    document.head.innerHTML += `<style type="text/css">
.r-community--search_form.r-community--small {
    display: inline-block;
    margin-bottom: 40px;
}
.r-community--search_form input.r-community--small {
    width: 300px;
    height: 35px;
}
.r-community--search_form .r-community--search_btn {
    width: 30px;
    height: 30px;
    cursor: pointer;
    line-height: 30px;
    text-align: center;
}
.r-community--search_form input {
    background: #f3f3f3;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    font-size: 14px;
    height: 32px;
    padding-left: 10px;
    padding-right: 40px;
}
.r-community--search_form .r-community--search_btn {
    position: absolute;
    left: 270px;
    top: 303px;
    width: 30px;
    height: 30px;
    cursor: pointer;
    line-height: 30px;
    text-align: center;
}
.r-community--search_form .r-community--search_btn .r-community--icon_search {
    display: inline-block;
    background: url(https://cdn-community.codemao.cn/community_frontend/asset/icon_sprite_1fd27.svg) no-repeat -215px -202px;
    width: 14px;
    height: 14px;
}
</style>`;
}, 2000);