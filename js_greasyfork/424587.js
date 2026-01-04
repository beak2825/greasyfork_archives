// ==UserScript==
// @name         百度文库优化
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  鲨凋百度文库的牛皮癣！
// @author       isaacveg
// @match        *://wenku.baidu.com/view/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424587/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/424587/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==


function main(){
    var ReadAll = document.getElementsByClassName("read-all");
    if (ReadAll.length) {
        ReadAll[0].click();
    }

    var LO = document.getElementsByClassName("link-open");
    if (LO.length) {
        LO[0].click();
    }

    var ReadEnd = document.getElementsByClassName("try-end-fold-page");
    if (ReadEnd.length) {
        ReadEnd[0].style = "opacity:50%";
    }

    var PTT = document.getElementsByClassName("pay-text-link-container");
    if (PTT.length) {
        PTT[0].style = "display:none";
    }

    var DocBtnW = document.getElementsByClassName("doc-btns-wrap");
    if (DocBtnW.length) {
        DocBtnW[0].style = "display:none";
    }

    var DocInfo = document.getElementsByClassName("doc-info-right");
    if (DocInfo.length) {
        DocInfo[0].style = "display:none";
    }

    var CP = document.getElementById("color-plate");
    if (CP) {
        CP.style = "display:none";
    }

    var PTB = document.getElementsByClassName("pure-tool-btn");
    if (PTB.length) {
        PTB[0].style = "display:none";
    }
    
    var VipCard = document.getElementsByClassName("vip-card-wrap");
    if (VipCard.length) {
        VipCard[0].style = "display:none";
    }

    var CourseWrapper = document.getElementsByClassName("lazy-load");
    for(var x = 0; x < CourseWrapper.length; x=x+1){
        CourseWrapper[x].style = "display:none";
    }

    var RightChannel = document.getElementsByClassName("right-channel-wrap");
    if (RightChannel.length) {
        RightChannel[0].style = "display:none";
    }

    var SearchBar = document.getElementsByClassName("search-tab-content");
    SearchBar[0].style = "display:none";

    var RightBox = document.getElementsByClassName("right-box");
    RightBox[0].style = "display:none";

    var Bad = document.getElementsByClassName("ex-wrapper no-full-screen");
    Bad[0].style = "display:none";

    var BadC = document.getElementsByClassName("comment-wrapper");
    BadC[0].style = "display:none";

    var BottomToolBar = document.getElementsByClassName("tool-bar-wrapper");
    BottomToolBar[0].style = "display:none";

    var PriceV = document.getElementsByClassName("doc-price-voucher-wrap");
    if (PriceV.length) {
        PriceV[0].style = "display:none";
    }
}

window.onload = setTimeout(main,1500);