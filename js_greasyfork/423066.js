// ==UserScript==
// @name         FanFiction
// @namespace    http://tampermonkey.net/
// @version      1
// @description  enable the right-left arrow to change chapter, enable the selection of text and make the text more readable
// @author       Erzak78
// @match        https://www.fanfiction.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423066/FanFiction.user.js
// @updateURL https://update.greasyfork.org/scripts/423066/FanFiction.meta.js
// ==/UserScript==

(function() {

    if(!!document.getElementById("storytext")){
        document.getElementById("storytext").style.userSelect = "text";
    }
    if(!!document.getElementById("content_wrapper")){
        document.getElementById("content_wrapper").style.width = "30%";
    }

    if(document.getElementsByClassName("timeline-Widget").length != 0){
        document.getElementsByClassName("timeline-Widget")[0].style.background="#333333";
    }

    if(document.getElementsByClassName("lc-wrapper").length != 0){
        document.getElementsByClassName("lc-wrapper")[0].children[0].style.background="#333333";
    }

    if( document.getElementsByClassName("lc").length != 0){
        document.getElementsByClassName("lc")[0].style.background = "#333333";
    }

    document.getElementById("content_parent").style.background = "#666666";
    document.getElementById("content_wrapper_inner").style.background = "rgb(51, 51, 51)";
    document.getElementById("content_wrapper_inner").style.color="#FFFFFF";

    colorLinks("#5ebfff");

    var elem = document.getElementsByClassName("reviews");
    for(var i = 0;i< elem.length;i++){
        elem[i].style.color="#f50";
    }

    elem = document.getElementsByClassName("tcat");
    for(i = 0;i< elem.length;i++){
        elem[i].style.background="#333333";
    }

    elem = document.getElementsByClassName("z-padtop2 xgray");
    for(i = 0;i< elem.length;i++){
        elem[i].style.color="#ADADAD";
    }
    document.addEventListener("keydown", keyDownTextField, false);
})();

function keyDownTextField(e) {
    var keyCode = e.keyCode;
    var url = window.location.href;
    var res = url.split("/");
    if(keyCode==39) {
        var n = document.getElementById("chap_select").length
        if(res[res.length-2]<n){
            res[res.length-2]=Number(res[res.length-2])+1;
            window.location.href = res.join("/");
        }
    } else {
        if(keyCode==37){
            if(res[res.length-2]>1){
                res[res.length-2]=Number(res[res.length-2])-1;
                window.location.href = res.join("/");
            }
        }
        if(keyCode==83){
            window.scrollBy(0,50);
        }
        if(keyCode==87){
            window.scrollBy(0,-50);
        }
    }
}

function colorLinks(hex)
{
    var links = document.getElementById("content_wrapper_inner").getElementsByTagName("a");
    for(var i=0;i<links.length;i++)
    {
        if(links[i].href)
        {
            links[i].style.color = hex;
        }
    }
}
