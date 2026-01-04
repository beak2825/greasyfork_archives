// ==UserScript==
// @name         Reddit remove relevant XKCD
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  No XKCD!
// @author       MrBloodyshadow
// @match        https://www.reddit.com/r/*/comments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33397/Reddit%20remove%20relevant%20XKCD.user.js
// @updateURL https://update.greasyfork.org/scripts/33397/Reddit%20remove%20relevant%20XKCD.meta.js
// ==/UserScript==

hasClass = function(element, clazz) {
    var classes = element.getAttribute("class").split(" ");
    for (var i = 0; i < classes.length; i++) {
        if (classes[i] === clazz) {
            return true;
        }
    }

    return false;
};

getParentWithClass = function (element, clazz){
    if(element.parentNode){
        if (hasClass(element.parentNode, clazz)){
            return element.parentNode;
        }else{
            return getParentWithClass(element.parentNode, clazz);
        }
    }
    return null; // No parent has clazz
};

removeXKCD = function(){
    var comments = document.getElementsByClassName("usertext-body may-blank-within md-container");
    for(var i = 0; i < comments.length; i++){
        var anchors = comments[i].getElementsByTagName("a");
        if(anchors.length !== 0){
            var firstLink = anchors[0].href;
            if(firstLink.startsWith("https://xkcd.com/")){
                if(anchors[0].innerHTML.toLowerCase() === "relevant xkcd"){
                    var entry = getParentWithClass(comments[i], "comment");
                    entry.parentNode.removeChild(entry);
                }
            }
        }
    }
};

(function() {
    'use strict';

    removeXKCD();
})();