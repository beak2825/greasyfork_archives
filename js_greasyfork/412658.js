// ==UserScript==
// @name         Desuarchive Yukila Link Shortcut
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Opens thread on Yuki.la
// @author       Ly
// @match        https://desuarchive.org/*
// @grant        none
// @run-at       document-end
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/412658/Desuarchive%20Yukila%20Link%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/412658/Desuarchive%20Yukila%20Link%20Shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var pageLink = document.URL;
    var pageLinkCheck = pageLink.toString().indexOf("search");
    var artigos = document.getElementsByTagName("article");
    //getting the board "id" i.e: /b/, /vr/, /r9k/ and so on...
    var brand = document.getElementById("brand");
    var brandText = brand.textContent;
    var brandArray = brandText.split("");
    var newArray = [];
    for (var i = 0; i < 7; i++) {
        if (brandText[i] !== " ") {
            newArray += brandArray.shift();
        }
    }
    var linkPt123 = newArray.toString();
    if (pageLinkCheck === -1) {
        for (var j = 0; i < artigos.length; j++) {
            var inehoff = document.getElementsByClassName("post_data");
            var linkPt0 = "https://yuki.la";
            var linkPt1 = inehoff[j].childNodes[10].href;
            var linkPt2 = linkPt1.slice(23);
            let linkPt3 = linkPt2
            .split('').reverse().join('')
            .replace('/', '')
            .split('').reverse().join('')
            var link = linkPt0 + linkPt3;
            var btn = document.createElement("a");
            btn.setAttribute("class", "bergue");
            btn.innerHTML = "Yukila";
            btn.setAttribute('target', '_blank');
            btn.setAttribute("href", link)
            btn.style.color = "black";
            btn.style.border = "1px solid rgba(0, 0, 0, 0.1)";
            btn.style.padding = "0px 3px 1px";
            btn.style.margin = "3px";
            btn.style.fontSize = "11px";
            btn.style.position = "relative";
            btn.style.top = "-1px";
            btn.style.left = "-5px";
            btn.style.textDecoration = "none";
            btn.style.fontFamily = "Verdana, Arial, sans-serif;";
            //JQuery is the only way i could make the hover effect to work
            $(".bergue").hover(function(){
                $(this).css("borderColor", "grey");
            }, function(){
                $(this).css("borderColor", "rgba(0, 0, 0, 0.1)");
            });
            inehoff[j].childNodes[18].appendChild(btn);
        }
    } else {
        for (var h = 0; h < artigos.length; h++) {
            var inehoff1 = document.getElementsByClassName("post_data");
            var linkPt01 = "https://yuki.la";
            var linkPt11 = inehoff1[h].childNodes[10].href;
            var linkPt21 = linkPt11.slice(23);
            let linkPt31 = linkPt21
            .split('').reverse().join('')
            .replace('/', '')
            .split('').reverse().join('')
            var link2 = linkPt01 + linkPt31;
            var btn2 = document.createElement("a");
            btn2.setAttribute("class", "bergue");
            btn2.innerHTML = "Yukila";
            btn2.setAttribute('target', '_blank');
            btn2.setAttribute("href", link2)
            btn2.style.color = "black";
            btn2.style.border = "1px solid rgba(0, 0, 0, 0.1)";
            btn2.style.padding = "0px 3px 1px";
            btn2.style.margin = "3px";
            btn2.style.fontSize = "11px";
            btn2.style.position = "relative";
            btn2.style.top = "-1px";
            btn2.style.left = "-5px";
            btn2.style.textDecoration = "none";
            btn2.style.fontFamily = "Verdana, Arial, sans-serif;";
            //JQuery is the only way i could make the hover effect to work
            $(".bergue").hover(function(){
                $(this).css("borderColor", "grey");
            }, function(){
                $(this).css("borderColor", "rgba(0, 0, 0, 0.1)");
            });
            var inehoff2 = document.getElementsByClassName("post_data");
            inehoff1[h].childNodes[18].appendChild(btn2);
        }
    }
})();