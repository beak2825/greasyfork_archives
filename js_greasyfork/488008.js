// ==UserScript==
// @name         NightCafé Better Inbox Styling
// @namespace    http://tampermonkey.net/
// @version      2024-02-23
// @description  Highlights unread messages in a better way
// @author       Rokker
// @match        https://creator.nightcafe.studio/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nightcafe.studio
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488008/NightCaf%C3%A9%20Better%20Inbox%20Styling.user.js
// @updateURL https://update.greasyfork.org/scripts/488008/NightCaf%C3%A9%20Better%20Inbox%20Styling.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let unreadCssClassLight = null;
    let unreadCssClassDark = null;
    const unreadStyleLight = '{ font-weight: 500; border-left: 2px solid dodgerblue; padding-left: 10px; }';
    const unreadStyleDark = '{ font-weight: 500; border-left: 2px solid dodgerblue; padding-left: 10px; }';
    const unreadColorLight = 'rgb(37, 43, 48)';
    const unreadColorDark = 'rgb(222, 226, 227)';


    const findUnreadCssClass = () => {
        //Get first message element
        let firstElement = document.querySelector('.modal-body [data-testid="InboxMessage"]');
        if(!firstElement){
            //No messages in view, return
            return;
        }

        //Get message siblings
        let siblings = [firstElement];
        let currentElement = firstElement;
        while (currentElement = currentElement.nextSibling) {
            if (currentElement.nodeType === 3) continue; // text node
            siblings.push(currentElement);
        }

        //Detect available classes
        let classes = [...new Set(siblings.map(element => element.firstElementChild.classList[0]))]; //Stupid assumption here that first element is the <a>. Fix later.

        //Identify class for unread messages Light
        if(!unreadCssClassLight){
            unreadCssClassLight = classes.find((className)=>{
                let element = document.getElementsByClassName(className)[0];
                if(element){
                    return unreadColorLight === getComputedStyle(element).color;
                }
            });
            if(unreadCssClassLight){
                document.styleSheets[0].insertRule(`.${unreadCssClassLight} ${unreadStyleLight}`);
            }
        }
        //Identify class for unread messages Dark
        if(!unreadCssClassDark){
            unreadCssClassDark = classes.find((className)=>{
                let element = document.getElementsByClassName(className)[0];
                if(element){
                    return unreadColorDark === getComputedStyle(element).color;
                }
            });
            if(unreadCssClassDark){
                document.styleSheets[0].insertRule(`.${unreadCssClassDark} ${unreadStyleDark}`);
            }
        }
    }


    const interval = setInterval(()=>{
        findUnreadCssClass();

        if(unreadCssClassLight && unreadCssClassDark){
            clearInterval(interval);
            return;
        }
    }, 100);
})();