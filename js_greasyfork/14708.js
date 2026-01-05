// ==UserScript==
// @id             qhqcz@qq.com
// @name			显示隐藏金额
// @description		可以显示网站隐藏的原始金额。
// @author         钱宏庆
// @homepageURL    https://greasyfork.org/zh-CN/scripts/14708
// @supportURL		https://greasyfork.org/zh-CN/scripts/14708/feedback
// @version        20191101.1439
// @icon         http://www.iconpng.com/download/png/47785
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_setClipboard
// @grant          GM_openInTab
// @grant          GM_xmlhttpRequest
// @grant          GM_registerMenuCommand
// @grant          GM_deleteValue
// @include       http://dz.wf-mart.*
// @include       http://sh-sup.lottemart.cn/*
// @include       http://m.wfdsj.cn/*
// @namespace https://greasyfork.org/users/9065
// @downloadURL https://update.greasyfork.org/scripts/14708/%E6%98%BE%E7%A4%BA%E9%9A%90%E8%97%8F%E9%87%91%E9%A2%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/14708/%E6%98%BE%E7%A4%BA%E9%9A%90%E8%97%8F%E9%87%91%E9%A2%9D.meta.js
// ==/UserScript==

//alert('Hello world!');

var host = window.location.host;
var isLT = host === 'sh-sup.lottemart.cn';
var isWF = host === 'm.wfdsj.cn';
var r = true;

function ltfun() {
    var tbParentElem = document.querySelector('.statusBar');
    //    var tbSubmitBtn = document.querySelector('.search');
    var tbNewDir1 = document.createElement('button');
    var tbNewDir2 = document.createElement('button');
    tbNewDir1.innerHTML = ' 切换金额显示 ';
    //    tbNewDir.className = 'button';
    //    tbNewDir.style.marginLeft = '100px';
    tbNewDir1.onclick = function () {
        var tbStars = document.querySelectorAll('input[id^=totalAmount_]');
        [].forEach.call(tbStars, function (tbStar) {
            if (tbStar.type == "hidden") {
                tbStar.type = "text";
                tbStar.disabled = "true";
            } else {
                tbStar.type = "hidden";
            }
        });
        return false;
        //        tbStar[0].click();
        //       var timer = setInterval(detection, 500);
        //        detection();
    };

    tbNewDir2.innerHTML = ' 填入门店金额 ';
    //    tbNewDir.className = 'button';
    //    tbNewDir.style.marginLeft = '100px';
    tbNewDir2.onclick = function () {
        var tbStars = document.querySelectorAll('input[id^=imp_Amount_]');
        var valImpAmount = document.querySelectorAll('input[id^=totalAmount_]');
        i = 0;
        //console.log(r);
        if (r){
        [].forEach.call(tbStars, function (tbStar) {
            tbStar.value = valImpAmount[i].value;
            i++;
            r=false;
        });
        }else{
        [].forEach.call(tbStars, function (tbStar) {
            tbStar.value = 0;
            i++;
            r=true;
        });
        }
        return false;
    };

    tbParentElem.appendChild(tbNewDir1);
    tbParentElem.appendChild(tbNewDir2);
    //tbParentElem.insertBefore(tbNewDir,tbSubmitBtn);
}

function wffun() {
    var tbParentElem = document.querySelector('[target=main1]');
    if (tbParentElem) {
    //    var tbSubmitBtn = document.querySelector('.search');
    var tbNewDir1 = document.createElement('input');
    var tbNewDir2 = document.createElement('input');
    //    tbNewDir.innerHTML = ' 显示金额 ';
    tbNewDir1.value = '显示金额';
    tbNewDir1.className = 'linkbutton2';
    tbNewDir1.type = 'submit';
    tbNewDir1.style = 'margin-bottom:2px;';
    tbNewDir1.onclick = function () {
        //console.log(2);
        var tbStars = main1.document.querySelectorAll('input[id^=G_amnt_]');
        //console.log(tbStars.length);
        [].forEach.call(tbStars, function (tbStar) {
            //console.log(3);
            tbStar.parentNode.innerHTML=tbStar.parentNode.innerHTML+tbStar.value;
            tbNewDir1.disabled = "true";

        });
        return false;
    };

    tbNewDir2.value = '填入门店金额';
    tbNewDir2.className = 'linkbutton2';
    tbNewDir2.type = 'submit';
    tbNewDir2.style = 'margin-bottom:2px;';
    //    tbNewDir.className = 'button';
    //    tbNewDir.style.marginLeft = '100px';
    tbNewDir2.onclick = function () {
        var tbStars = main1.document.querySelectorAll('input[id^=T_amnt_]');
        var valImpAmount = main1.document.querySelectorAll('input[id^=G_amnt_]');
        i = 0;
        //console.log(r);
        if (r){
        [].forEach.call(tbStars, function (tbStar) {
            tbStar.value = valImpAmount[i].value;
            i++;
            r=false;
        });
        }else{
        [].forEach.call(tbStars, function (tbStar) {
            tbStar.value = 0;
            i++;
            r=true;
        });
        }
        return false;
    };

    tbParentElem.appendChild(tbNewDir1);
    tbParentElem.appendChild(tbNewDir2);
    //tbParentElem.insertBefore(tbNewDir,tbSubmitBtn);
    }
}

if (isLT) {
    ltfun();
} else if (isWF) {
    //console.log(1);
    wffun();
}