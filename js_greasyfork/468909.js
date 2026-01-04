// ==UserScript==
// @name         （已失效）bilibili哔哩哔哩超多收藏夹管理
// @namespace    https://www.gofortime.com/
// @version      v3.0.1
// @description  当bilibili哔哩哔哩中收藏/订阅的收藏夹过多时，原本的单列有限的展示效果就变得难以使用了。所以扩大了收藏夹的展示范围。
// @author       寒隙
// @match        https://space.bilibili.com/*
// @icon
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468909/%EF%BC%88%E5%B7%B2%E5%A4%B1%E6%95%88%EF%BC%89bilibili%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%B6%85%E5%A4%9A%E6%94%B6%E8%97%8F%E5%A4%B9%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/468909/%EF%BC%88%E5%B7%B2%E5%A4%B1%E6%95%88%EF%BC%89bilibili%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%B6%85%E5%A4%9A%E6%94%B6%E8%97%8F%E5%A4%B9%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==
function comment() {
    //取消夹左浮动 让视频到夹下边
    var hxNav = document.getElementsByClassName('fav-sidenav');
    hxNav[0].style.float = 'none';
    hxNav[0].style.width = '100%';
    //取消夹超出隐藏 显示全部夹
    var hxNavSC = document.getElementById('fav-createdList-container');
    hxNavSC.style.maxHeight = 'none';
    //将夹改成横排的
    var hxNavSCGroup = document.getElementsByClassName('fav-item');
    for (var i = 0; i < hxNavSCGroup.length; i++) {
        hxNavSCGroup[i].style.width = 'auto';
        hxNavSCGroup[i].style.float = 'left';
        hxNavSCGroup[i].style.margin = '0 20px 0 20px';
    }
    //视频列表间距
    var hxVGroup = document.getElementsByClassName('small-item');
    for (var a = 0; a < hxVGroup.length; a++) {
        hxNavSCGroup[a].style.width = '200px';
    }

    //点点隐藏
    var hxDDD = document.getElementsByClassName('be-dropdown');
    for (var d = 0; d < hxDDD.length; d++) {
        hxDDD[d].style.dispaly = 'none';
    }
    //名字取消超隐
    var hxlili = document.getElementsByClassName('router-link-active');
    for (var e = 0; e < hxlili.length; e++) {
        hxlili[e].style.width = 'auto';
        hxlili[e].style.overflow = 'visible';
    }
    //更换夹
    var hxVSCZ = document.getElementsByClassName('modal-wrapper');
    for (var b = 0; b < hxVSCZ.length; b++) {
        hxVSCZ[b].style.width = '80%';
    }
    var hxVSC = document.getElementsByClassName('target-favitem');
    for (var c = 0; c < hxVSC.length; c++) {
        hxVSC[c].style.width = '20%';
        hxVSC[c].style.float = 'left';
        hxVSC[c].style.padding = '5px';
        hxVSC[c].style.margin = '0 20px 5px 20px';
        hxVSC[c].style.border = '1px solid #cdcdcd';
    }
    //夹里视频数量
    var hxnum = document.getElementsByClassName('num');
    //数量添加到标题后面
    for (var c = 0; c < hxVSC.length; c++) {
        var x = parseInt(c + 4);
        hxlili[x].innerHTML = hxlili[x].innerHTML + '☆' + hxnum[c].innerHTML;
    }
    
    for (var d = 0; d < hxnum.length; d++) {
        hxnum[d].remove();
    }
    for (var d = 0; d < hxnum.length; d++) {
        hxnum[d].remove();
    }
    for (var d = 0; d < hxnum.length; d++) {
        hxnum[d].remove();
    }
    for (var d = 0; d < hxnum.length; d++) {
        hxnum[d].remove();
    }
    for (var d = 0; d < hxnum.length; d++) {
        hxnum[d].remove();
    }
    for (var d = 0; d < hxnum.length; d++) {
        hxnum[d].remove();
    }
    for (var d = 0; d < hxnum.length; d++) {
        hxnum[d].remove();
    }
    for (var d = 0; d < hxnum.length; d++) {
        hxnum[d].remove();
    }
    for (var d = 0; d < hxnum.length; d++) {
        hxnum[d].remove();
    }
}
setTimeout(comment, 10000);