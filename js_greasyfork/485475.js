// ==UserScript==
// @name         BlockIdiotsInGithub
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Block some idiots and their gibberish projects in search result
// @description:zh-tw  屏蔽一些傻逼
// @author       zongren
// @match        *://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485475/BlockIdiotsInGithub.user.js
// @updateURL https://update.greasyfork.org/scripts/485475/BlockIdiotsInGithub.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var shaBiList = [
        "cirosantilli",
        "codin-stuffs",
        "cheezcharmer",
        "Daravai1234",
        "tjqJ62cESiHPj6DdR6vXDAcPp",
    ]
    function isShaBi(href){
        for(var i = 0;i < shaBiList.length;i++){
            if(href.match("/"+shaBiList[i]+"/")){
                return true
            }
        }
        return false;
    }
    function deleteShaBi(){
        var searchResultList = document.querySelectorAll("[data-testid=\"results-list\"]")
        var foundShaBiList = []
        for(var i = 0;i < searchResultList.length;i++){
            var ele = searchResultList[i]
            var eleChildren = ele.children
            for(var k = 0;k < eleChildren.length;k++){
                var eleChild = eleChildren[k]
                var linkList = eleChild.getElementsByTagName("a")
                for(var j = 0;j < linkList.length;j++){
                    var linkEle = linkList[j]
                    if(linkEle.href && isShaBi(linkEle.href)){
                        foundShaBiList.push(eleChild)
                        console.log("找到一个傻逼："+linkEle.href)
                        break
                    }
                }
            }
        }
        for(var h = 0;h < foundShaBiList.length;h++){
            console.log("delete one idiot")
            foundShaBiList[h].remove()
        }
    }
    var observeDOM = (function(){
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        return function( obj, callback ){
            if( !obj || obj.nodeType !== 1 ) return;

            if( MutationObserver ){
                // define a new observer
                var mutationObserver = new MutationObserver(callback)

                // have the observer observe for changes in children
                mutationObserver.observe( obj, { childList:true, subtree:true })
                return mutationObserver
            }

            // browser support fallback
            else if( window.addEventListener ){
                obj.addEventListener('DOMNodeInserted', callback, false)
                obj.addEventListener('DOMNodeRemoved', callback, false)
            }
        }
    })()
    observeDOM(document.body, function(m){
        deleteShaBi()
    });
    console.log("start monitor idiot")
})();
