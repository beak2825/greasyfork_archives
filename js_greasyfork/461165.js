// ==UserScript==
// @name         Spaceous Mastodon Helper
// @namespace    github.com/RiedleroD/userstyles-riedler
// @version      1.2.1
// @description  companion script for spaceous mastodon userstyle
// @author       Riedler
// @match        https://mas.to/*
// @match        https://fosstodon.org/*
// @match        https://mastodon.social/*
// @icon         https://mas.to/favicon.ico
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/461165/Spaceous%20Mastodon%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/461165/Spaceous%20Mastodon%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("me alive");

    function checkSideBar(post){
        let content = post.getElementsByClassName('status__content')[0];
        //get minimum height by getting 15em in px
        let divisor = 12*parseFloat(getComputedStyle(post).fontSize);
        let actionbar = post.getElementsByClassName('status__action-bar')[0];
        if(content.clientHeight>=divisor){
            actionbar.classList.add('sm__force_sidebar');
        }else{
            //if we previously added it and it changed in the meantime
            actionbar.classList.remove('sm__force_sidebar');
        }
    }
    function isPost(element){
        return element.classList!=undefined && element.classList.contains('status');
    }

    const target = document.getElementById('mastodon');
    const obconf = { attributes: false, childList: true, subtree: true };

    const callback = (mutationList, observer) => {
        for(const mutation of mutationList){
            for(let node of mutation.addedNodes){
                if(isPost(node)){
                    checkSideBar(node);
                }else{
                    //checking parents for posts
                    do{
                        node=node.parentNode;
                        if(isPost(node)){
                            checkSideBar(node);
                            return;
                        }
                    }while(node.parentNode!=undefined);
                    //checking children for posts
                    for(const e of node.getElementsByClassName('status')){
                        checkSideBar(e);
                    }
                }
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(target, obconf);
})();