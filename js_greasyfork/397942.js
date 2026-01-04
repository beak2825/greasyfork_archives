// ==UserScript==
// @name         mask card helper(part1)
// @version      1.0.4
// @description  口罩小幫手
// @author       Godpriest
// @match        https://medvpn.nhi.gov.tw/*
// @grant        none
// @namespace https://greasyfork.org/users/459415
// @downloadURL https://update.greasyfork.org/scripts/397942/mask%20card%20helper%28part1%29.user.js
// @updateURL https://update.greasyfork.org/scripts/397942/mask%20card%20helper%28part1%29.meta.js
// ==/UserScript==


(function() {
    'use strict';
//抓取背景
var bg = document.getElementsByClassName("main");
//抓取title的文字
var titletext = document.getElementsByClassName("title");

//偵測F9~F7按鈕，偵測到後執行
function doc_keyUp(e)
{
    switch (e.keyCode) {
        case 120:
            if(cph_cmdReadCard()==true && cph_cmdIns()==true){
                document.cookie = "f9keep=1";
                var thisDiv = C.snapshotItem(0);
    anchorclick(thisDiv);
            }
            F9click();
            break;
        case 119:
            F8click();
            break;
        case 118:
            F7click();
            break;
        default:
            break;
    }
}
//如果完成則顯示綠色，否則正常純更改標題
if (document.cookie.split(';').filter((item) => item.includes('finish=1')).length) {
    if (document.cookie.split(';').filter((item) => item.includes('needclear=1')).length) {}else{
    document.cookie = "finish=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    titletext[0].innerHTML = '<font size="7"><font color="black"><b>上一輪過卡完成!</b></font></font>'
    bg[0].style.backgroundColor = "#33FF33";}
}else{
    titletext[0].innerHTML = '<font size="7"><font color="black"><b>防疫口罩管控系統_購買(過卡小幫手)-[F9]開始過卡，黃色畫面[F8]兒童才繼續，[F7]清除</b></font></font>'
}
if (document.cookie.split(';').filter((item) => item.includes('finish=2')).length) {
    document.cookie = "finish=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    bg[0].style.backgroundColor = "RED";
    titletext[0].innerHTML = '<font size="7"><font color="black"><b>超過可購買片數...</b></font></font>'
}

//應該是點擊按鈕用的前置function
    function anchorclick(node)
    {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window,
                       0, 0, 0, 0, 0, false, false, false, false, 0, null);
    var allowDefault = node.dispatchEvent(evt);
    }
    //偵測按鈕的前置function?
    function xpath(query) {
    return document.evaluate(query, document, null,
                             XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}
document.addEventListener('keyup', doc_keyUp, false);

    //到上面這段都好像是偵測按鈕的前置function

    //抓取id為cph_cmdReadCard(資格審核)的按鈕是否有disable元素?
    function cph_cmdReadCard(){
            var v = document.getElementById("cph_cmdReadCard").disabled ;
            return v;
        }

    //抓取id為cph_cmdIns的按鈕是否有disable元素?
    function cph_cmdIns(){
            var v = document.getElementById("cph_cmdIns").disabled ;
            return v;
        }
    //抓取id為cph_cboChilQty的按鈕是否有disable元素?
        function cph_cboChilQty(){
            var v = document.getElementById("cph_cboChilQty").disabled ;
            return v;
        }

    //A等於id為cph_cmdReadCard的按鈕
    var A =xpath("//input[@id='cph_cmdReadCard']");
    //B等於id為cph_cmdIns的按鈕
    var B =xpath("//input[@id='cph_cmdIns']");
    //B等於id為cph_cmdCln的按鈕
    var C =xpath("//input[@id='cph_cmdCln']");



    //F9購買成人口罩
    function F9click()
    {
        document.cookie = "finish=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        bg[0].style.backgroundColor = "#33FFFF";
        titletext[0].innerHTML = '<font size="7"><font color="black"><b>開始過卡...</b></font></font>'
        if(cph_cmdReadCard()==false && cph_cmdIns()==true){
        //按下[資格審核]按鈕
            var thisDiv = A.snapshotItem(0);
            anchorclick(thisDiv);
        }
}
    //F8購買兒童口罩
    function F8click(){
    if(cph_cmdReadCard()==true && cph_cmdIns()==false){
    var thisDiv = B.snapshotItem(0);
    anchorclick(thisDiv);
    bg[0].style.backgroundColor = "#ECFFFF";
    }
    }

    //檢查是否符合下一步條件
    setTimeout(function(){
        //購買完成後的部分(自動清除)
                 if (document.cookie.split(';').filter((item) => item.includes('needclear=1')).length) {
                     document.cookie = "needclear=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    var thisDiv = C.snapshotItem(0);
    anchorclick(thisDiv);
                 }
//資格審核結束後的部分
    if(cph_cmdReadCard()==true && cph_cmdIns()==false){
            //成人口罩
titletext[0].innerHTML = '<font size="7"><font color="black"><b>偵測成人or兒童口罩中...</b></font></font>'
        bg[0].style.backgroundColor = "#ECFFFF";
        if (cph_cboChilQty()==true){
            //按下[購買]
            var thisDiv4 = B.snapshotItem(0);
            anchorclick(thisDiv4);
        }else{
            //兒童口罩 直接停止
            bg[0].style.backgroundColor = "#FFFF33";
            titletext[0].innerHTML = '<font size="7"><font color="red"><b>此為兒童口罩 - 繼續請按[F8]! 改領成人請手動!</b></font></font>'
}
    }
        },300);

    //在F7後觸發清除
    function F7click(){
    var thisDiv = C.snapshotItem(0);
    anchorclick(thisDiv);
    }

    //confirm視窗回傳true
window.confirm = function confirm() {
//持續檢查是否符合下一步條件
        document.cookie = "needclear=1";
        document.cookie = "finish=1";
        return true;
}
//延遲4分鐘按下清除
setTimeout(function(){
    titletext[0].innerHTML = '<font size="7"><font color="black"><b>4分鐘閒置，即將在5秒後刷新，請稍等!</b></font></font>'
    bg[0].style.backgroundColor = "Red";
    setTimeout(function(){
    var thisDiv4 = C.snapshotItem(0);
    anchorclick(thisDiv4);
        },5000);
},240000);
    //警告(紅色)畫面繼續過卡的偵測
    if (document.cookie.split(';').filter((item) => item.includes('f9keep=1')).length) {
    setTimeout(function(){
        document.cookie = "f9keep=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        F9click();
        },500);
    }
})();