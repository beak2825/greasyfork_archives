// ==UserScript==
// @name         替换网页中的内容（改）
// @name:en      Replace content in a webpage(Revision)
// @name:zh-CN   替换网页中的内容（改）
// @name:zh-TW   替換網頁中的內容（改）
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  替换网页中的文本内容（改）
// @description:en     Replace text content in a webpage(Revision)
// @description:zh-CN  替换网页中的文本内容（改）
// @description:zh-TW  替換網頁中的文本內容（改）
// @author       linmii
// @editor       zesion
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395434/%E6%9B%BF%E6%8D%A2%E7%BD%91%E9%A1%B5%E4%B8%AD%E7%9A%84%E5%86%85%E5%AE%B9%EF%BC%88%E6%94%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/395434/%E6%9B%BF%E6%8D%A2%E7%BD%91%E9%A1%B5%E4%B8%AD%E7%9A%84%E5%86%85%E5%AE%B9%EF%BC%88%E6%94%B9%EF%BC%89.meta.js
// ==/UserScript==
/**
 * 已知Bug：
 *    1、在某些页面无法使用，如：Google Cloud Platform,网址：https://console.cloud.google.com/，由于工作原因，未能进行解决。
 * 
 * 
 * V1.0 2019-08-05 更新内容
 *   1. 解决模态框弹出页面无法输入的问题。
 *   2. 增加是否替换禁用文本框内容的功能
 *   3. 增加只替换文本框内容的功能
 *
 * V1.01 2019-12-31 更新内容
 *   1. 解决一个页面出现多个替换图标的问题。
 *   2. 解决在某些网页，弹窗飘到屏幕顶部无法输入的问题，如1688网站订单页面。
 */
(function () {
    'use strict';

    initCss();
    initModal();
    initRImg();
    initDialog();
    removeTagAttibute('tabindex');

    window.addEventListener("scroll", function () {
        setDialogPosition();   //重新设置弹窗的位置。
    });
})();

function initCss() {
    let lmStyle = document.createElement("style");
    lmStyle.type = "text/css";
    lmStyle.innerHTML
        = '.lm-r-button {'
        + 'padding: 10px 18px;'
        + 'font-size: 14px;'
        + 'border-radius: 4px;'
        + 'line-height: 1;'
        + 'white-space: nowrap;'
        + 'cursor: pointer;'
        + 'background: #409EFF;'
        // + 'border: 1px solid #409EFF;'
        + 'border: none;'
        + 'color: #fff;'
        + 'font-weight: 500;'
        + '}'
        + '.lm-r-button:hover {background: #66b1ff; border-color: #66b1ff; color: #fff;}'
        + '.lm-r-button:focus {background: #66b1ff; border-color: #66b1ff; color: #fff;}'
        + '.lm-r-input {'
        + '-webkit-appearance: none;'
        + 'background-color: #fff;'
        + 'background-image: none;'
        + 'border-radius: 4px;'
        + 'border: 1px solid #dcdfe6;'
        + 'box-sizing: border-box;'
        + 'color: #606266;'
        + 'display: inline-block;'
        + 'font-size: 14px;'
        + 'height: 40px;'
        + 'line-height: 40px;'
        + 'outline: none;'
        + 'padding: 0 15px;'
        + 'transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);'
        + 'width: 100%;'
        + '}'
        + '.lm-r-input:hover {border-color: #C0C4CC;}'
        + '.lm-r-input:focus {border-color: #409EFF;}';

    document.querySelector("head").appendChild(lmStyle);
}

function removeTagAttibute(attributeName){
    var allTags = '*';
    var specificTags = ['DIV', 'ARTICLE', 'INPUT'];

    var allelems = document.querySelectorAll(specificTags);
    var i,j= 0;
    for(i = 0, j = 0; i < allelems.length; i++) {
     allelems[i].removeAttribute(attributeName);
    }
}

function initRImg() {
    let rImg = document.createElement("div");
    rImg.id = "lm-r-img";
    rImg.innerText = 'R';
    rImg.style.cssText = "z-index: 999999; position: fixed; top: 0; left: 0; font-size: 14px; border-radius: 4px; background-color: #fff; width: 20px; height: 20px; text-align: center; opacity: 0.5; cursor: pointer; border: solid 1px #999999;";
    /*if (document.querySelector("body")){
        document.querySelector("body").prepend(rImg);
    }*/
    if(window.self === window.top){
        if (document.querySelector("body")){
            document.body.appendChild(rImg);
        } else {
            document.documentElement.appendChild(rImg);
        }
    }
    rImgBindEvent();
}

function initModal() {
    let lmModal = document.createElement("div");
    lmModal.id = 'lm-r-modal';
    lmModal.style.cssText = 'position: fixed; left: 0; top: 0; width: 100%; height: 100%; opacity: 0.5; background: #000; z-index: 999999; display: none;';
    lmModal.onclick = function () {
        document.querySelector("#lm-btn-close").click();
    };
    document.querySelector("body").appendChild(lmModal);
}

function initDialog() {
    let dialogDiv = document.createElement("div");
    dialogDiv.id = "lm-dialog-div";
    let htmlText = '<div><input id="lm-find-content" class="lm-r-input" id="searchTxt" placeholder="请输入查找内容(支持正则)" ></div>';
    htmlText += '<div style="margin-top: 5px;"><input id="lm-replace-content" id="replaceTxt" class="lm-r-input" placeholder="请输入替换内容"></div>';
    htmlText += '<div style="margin-top: 5px;">';
    htmlText += '<label><input type="checkbox" id="lm-replace-disabled">替换禁用文本框内容</label><br />';
    htmlText += '<button id="lm-replace-btn" class="lm-r-button">替 换</button>';
    htmlText += '<button style="margin-left: 10px;" class="lm-r-button" onclick="document.querySelector(\'#lm-find-content\').value = \'\';document.querySelector(\'#lm-replace-content\').value = \'\';">清 空</button>';
    htmlText += '<button id="lm-btn-close" style="margin-left: 10px;" class="lm-r-button" onclick="document.querySelector(\'#lm-dialog-div\').style.display = \'none\'; document.querySelector(\'#lm-r-modal\').style.display = \'none\';">关 闭</button>';
    htmlText += '</div>';
    dialogDiv.innerHTML = htmlText;
    dialogDiv.style.border = 'solid 1px grey';
    dialogDiv.style.padding = '10px';
    //dialogDiv.style.textAlign = 'center';
    dialogDiv.style.zIndex = '99999999';
    dialogDiv.style.position = 'absolute';
    dialogDiv.style.display = 'none';
    dialogDiv.style.width = '250px';
    dialogDiv.style.height = '145px';
    dialogDiv.style.background = '#fff';
    dialogDiv.style.borderRadius = '4px';
    dialogDiv.style.fontSize = '14px';
    dialogDiv.style.left = (document.documentElement.clientWidth - dialogDiv.style.width.replace('px', '')) / 2 + document.documentElement.scrollLeft + "px";
    let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    console.log(getTop());
    dialogDiv.style.top = (getTop() - dialogDiv.style.width.replace('px', '')) / 2 + scrollTop + "px";
    let body = document.querySelector("body");
    body.appendChild(dialogDiv);
    document.querySelector("#lm-replace-btn").addEventListener("click", replaceContent);
}

function replaceContent() {
    let findText = document.querySelector("#lm-find-content").value;
    let replaceText = document.querySelector("#lm-replace-content").value;
    let disabledStatus 	= document.querySelector("#lm-replace-disabled").checked;
    // && "" !== replaceText
    if ("" !== findText) {
        var list=document.getElementsByTagName("input");
        var textCount = list.length;
        var replaceCounts = 0;
        for(var i = 0;i < textCount;i++){
            //判断是否替换禁用文本框的内容
            if(true === list[i].disabled && false === disabledStatus) {
                continue;
            }
            var txt = list[i].value;
            if(list[i].type==="text" && "" !== txt && txt.indexOf(findText) >= 0){
                var ret = txt.replace(new RegExp(findText, "gm"), replaceText);
                console.log(list[i].value + " ---- " + ret);
                list[i].value=ret;
                replaceCounts++;
            } else {
                continue;
            }
        }
        alert("替换完成, 共替换 【"+(replaceCounts - 1)+"】 处文本.");
    }
    // 设置替换前的输入内容
    document.querySelector("#lm-find-content").value = findText;
    document.querySelector("#lm-replace-content").value = replaceText;
}

function rImgBindEvent() {
    let rImg = document.querySelector("#lm-r-img");
    rImg.onclick = function () {
        setDialogPosition();    //重新设置弹窗的位置。
        document.querySelector("#lm-r-modal").style.display = 'block';
        document.querySelector("#lm-dialog-div").style.display = 'block';
    };
    rImg.onmouseover = function () {
        document.querySelector("#lm-r-img").style.opacity = 1;
    };
    rImg.onmouseleave = function () {
        document.querySelector("#lm-r-img").style.opacity = 0.5;
    };
}

function closeBindEvent() {
    document.querySelector("#lm-btn-close").click();
    document.querySelector("#lm-r-modal").style.display = 'none';
}

//获取网页的高度
function getTop() {
    let dHeight = document.documentElement.clientHeight;
    let bHeight = document.body.clientHeight;
    console.log("dH:" + dHeight + " ---- bH:" + bHeight);
    return dHeight < bHeight ? dHeight : bHeight;
}

//设置弹窗的位置
function setDialogPosition() {
    let dialogDiv = document.querySelector("#lm-dialog-div");
    dialogDiv.style.left = (document.documentElement.clientWidth - dialogDiv.style.width.replace('px', '')) / 2 + document.documentElement.scrollLeft + "px";
    let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    var divTop = (getTop() - dialogDiv.style.width.replace('px', '')) / 2 + scrollTop;
    dialogDiv.style.top = (divTop < 0 ? 0 : divTop) + "px";
}