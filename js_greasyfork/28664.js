// ==UserScript==
// @name         ModelMayham Viewer
// @namespace    daniel_watson
// @version      0.3
// @description  View images on modelmayhem that are only available for active members.
// @author       daniel_watson
// @match        http://www.modelmayhem.com/portfolio/pic/*
// @match        https://www.modelmayhem.com/portfolio/pic/*
// @downloadURL https://update.greasyfork.org/scripts/28664/ModelMayham%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/28664/ModelMayham%20Viewer.meta.js
// ==/UserScript==

function unlock() {
    'use strict';
    var check = document.getElementById('viewpic').getElementsByTagName("strong");
    var metas = document.querySelectorAll('[property="og:image"]');
    if (metas.length === 0 || check.length === 0){
        console.log("Nothing found");
        return 0;
    }
    var imgurl = "";
    for (var i = 0; i < metas.length; i++){
        imgurl = metas[i].content;
        break;
    }
    for (i = 0; i < check.length; i++) {
        var s = check[i];
        if (s.innerText.indexOf("Image Not Viewable By Non-Active Members") !== -1 || s.innerText.indexOf("Image Not Viewable By Non-Members") !== -1){
            var p = document.createElement("p");
            p.setAttribute("align","center");
            var b = document.createElement ('img');
            b.setAttribute('src', imgurl);
            b.setAttribute('border', '0');
            p.appendChild(b);
            var parent = s.parentNode;
            parent.parentNode.replaceChild(p,parent);
            break;
        }
    }
}

window.addEventListener("load", unlock);