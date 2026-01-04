// ==UserScript==
// @name         AtCoder HashTag Setter
// @namespace     https://atcoder.jp/
// @version      1.1
// @description  Add Twitter HashTag to share button on AtCoder
// @author       G4NP0N
// @match        https://atcoder.jp/contests/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422324/AtCoder%20HashTag%20Setter.user.js
// @updateURL https://update.greasyfork.org/scripts/422324/AtCoder%20HashTag%20Setter.meta.js
// ==/UserScript==

window.onload = function() {
    var url = location.href.split("/");
    if(url.length < 5)return;
    var contestId = location.href.replace(/-/g,"_").split("/")[4];
    var problemId;
    var txt = document.getElementsByClassName("a2a_kit")[0].getAttribute("data-a2a-title");
    txt += " #AtCoder_";
    if(url.length==7){
        if(url[5]=="tasks"){
            txt +=url[6];
        }else if(url[5]=="submissions" && url[6]!="me"){
            txt += document.querySelector("#main-container > div.row > div:nth-child(2) > div:nth-child(9) > table > tbody > tr:nth-child(2) > td > a").getAttribute("href").split("/")[4];
        }else{
            txt+=contestId;
        }
    }else{
        txt += contestId;
    }
    document.getElementsByClassName("a2a_kit")[0].setAttribute("data-a2a-title",txt);
};