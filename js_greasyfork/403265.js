// ==UserScript==
// @name         单号复制
// @namespace    http://tampermonkey.net/
// @version      0.46
// @description  用于批量复制第三方单号
// @author       李远
// @match        https://gsp.aliexpress.com/apps/order/index*
//@require https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/403265/%E5%8D%95%E5%8F%B7%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/403265/%E5%8D%95%E5%8F%B7%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Your code here...
 GM_registerMenuCommand("复制单号",copy);
    

})();
function  Creat(){
    var tips='<div id="'+"myid"+'" style="width: 100px;height: 40px;background-color: rgb(76, 76, 76);border-radius: 2px;position: fixed;left: 50%;top:300px;transform:-50%;text-align:center;line-height:40px;color:white; z-index: 9999;"><div style="opacity: 1;">'+"复制完成"+'</div></div>';
    $('body').append(tips);

}
function  Remove(){
    var a=  $('body')[0];
    a.removeChild(document.getElementById("myid"));


}
function  toast(){
    Creat();
    setTimeout(Remove,800);
}

function execCoy(text) {

    const input = document.createElement('INPUT');
    input.style.opacity  = 0;
    input.style.position = 'absolute';
    input.style.left = '-100000px';
    document.body.appendChild(input);

    input.value = text;
    input.select();
    input.setSelectionRange(0, text.length);
    document.execCommand('copy');
    document.body.removeChild(input);
    return true;
}

unsafeWindow.copyDh=function(){

    var a=$(".row b");
    var b="";
    for(var i=0;i<a.length;i++){
        b=b+a[i].innerText;
        b+=" ";
    }
    execCoy(b);
    toast();
}
function copy(){
copyDh();
}