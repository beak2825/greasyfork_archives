// ==UserScript==
// @name         Reddit Links Open in Same Tab
// @namespace    ultrabenosaurus.Reddit
// @version      1.8
// @description  Enforce `target="_self"` on links within Reddit posts and messages on desktop, delevoped for next chapter links on r/HFY.
// @author       Ultrabenosaurus
// @license      GNU AGPLv3
// @source       https://greasyfork.org/en/users/437117-ultrabenosaurus?sort=name
// @match        https://www.reddit.com/r/*
// @match        https://www.reddit.com/message/*
// @match        https://old.reddit.com/r/*
// @match        https://old.reddit.com/message/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464674/Reddit%20Links%20Open%20in%20Same%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/464674/Reddit%20Links%20Open%20in%20Same%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if("https://www.reddit.com"==location.origin && -1<location.search.indexOf("share_id=")){
        location.href = location.href.replace(location.search, '').replace("www.reddit.com", "old.reddit.com");
    }

    setTimeout(function(){
        RemoveTargetFromLinks();
    }, 1000);
})();

function RemoveTargetFromLinks(){
    //console.log("RemoveTargetFromLinks", location.origin);
    var links=null;
    if("https://www.reddit.com"==location.origin){
        links=document.querySelectorAll('div[data-test-id="post-content"] div.RichTextJSON-root p > a[target="_blank"], div.content div.md-container a[href*="www.reddit.com"]');
        for (var lin in links) {
            if (links.hasOwnProperty(lin)) {
                links[lin].removeAttribute('target');
                links[lin].setAttribute('target', '_self');
            }
        }
    } else if("https://old.reddit.com"==location.origin){
        links=document.querySelectorAll('div.content div.usertext-body a[href], div.content div.md-container a[href*="www.reddit.com"]');
        for (var lin in links) {
            if (links.hasOwnProperty(lin)) {
                try{
                    var linClone=links[lin].cloneNode(true);
                    linClone.removeAttribute('target');
                    linClone.setAttribute('target', '_self');
                    //console.log(linClone.attributes.href);
                    if(-1==linClone.attributes.href.nodeValue.indexOf("/s/")){
                        if(-1<linClone.attributes.href.nodeValue.indexOf("//www.reddit.com")){
                            linClone.attributes.href.nodeValue = linClone.attributes.href.nodeValue.replace("www.reddit.com", "old.reddit.com");
                        }
                        if(-1<linClone.attributes.href.nodeValue.indexOf("//reddit.com")){
                            linClone.attributes.href.nodeValue = linClone.attributes.href.nodeValue.replace("reddit.com", "old.reddit.com");
                        }
                        if(-1<linClone.attributes.href.nodeValue.indexOf("//redd.it/")){
                            linClone.attributes.href.nodeValue = linClone.attributes.href.nodeValue.replace("redd.it", "old.reddit.com/comments");
                        }
                    }
                    links[lin].parentNode.insertBefore(linClone, links[lin]);
                    links[lin].remove();
                }catch(e){
                    console.log(e);
                }
            }
        }
    }
}