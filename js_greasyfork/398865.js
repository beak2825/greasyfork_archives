// ==UserScript==
// @name         I Want Bilibili Av Link
// @namespace    www.episooo.cn
// @version      1.0
// @description  Copy AV link of bilibilibili video to clipboard
// @author       episooo
// @match        *www.bilibili.com/video/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/398865/I%20Want%20Bilibili%20Av%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/398865/I%20Want%20Bilibili%20Av%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getBiliAvUrl(currentNode){
        var biliUrl = document.querySelector("meta[itemprop=url]").getAttribute('content');
        if(biliUrl==null){
            showToast('复制失败!');
            return;
        }
        //通过生成input框全选内容进行复制操作
        var transfer = document.createElement('input');
        currentNode.appendChild(transfer);
        transfer.value = biliUrl
        transfer.focus();
        transfer.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
        }
        transfer.blur();
        currentNode.removeChild(transfer);
        showToast('复制成功!');
        console.log(biliUrl);
    }
    function showToast(msg){
        var toastDiv = document.getElementById('toastDiv');
        toastDiv.innerHTML=msg;
        toastDiv.classList.remove('display-none');
        setTimeout(function(){
            document.getElementById('toastDiv').classList.add('display-none');
        },800)
    }
    var div = document.createElement("div");
    div.classList.add('copyDiv');
    div.innerHTML="复制av链接";
    div.onclick = function(){getBiliAvUrl(div)};
    var toast = document.createElement('div');
    toast.id='toastDiv';
    toast.classList.add('display-none');
    toast.classList.add('toastDiv');
    document.body.appendChild(toast);
    document.body.appendChild(div);

    GM_addStyle(`
.copyDiv {
width:80px;
padding:3px;
text-align:center;
position:fixed;
right:0px;
top:56px;
z-index:1000;
cursor:pointer;
color:rgba(0,0,0,0.5);
background:rgba(1,175,253,0.2);
transition: color 0.3s,background 0.3s;
-moz-transition:  color 0.3s,background 0.3s;
-webkit-transition:  color 0.3s,background 0.3s;
-o-transition:  color 0.3s,background 0.3s;
}
.copyDiv:hover{
color:rgba(0,0,0,1);
background:rgba(1,175,253,0.3);
}
.toastDiv{
width:80px;
padding:3px;
text-align:center;
position:fixed;
right:0px;
top:78px;
z-index:1000;
cursor:pointer;
background:white;
box-shadow: 0px 1px 5px 5px rgba(22,22,22,0.04);
transition: display 0.2s;
-moz-transition: display 0.2s;
-webkit-transition: display 0.2s;
-o-transition:  display 0.2s;
}
.display-none{
display:none;
}
`);
})();