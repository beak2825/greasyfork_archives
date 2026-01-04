// ==UserScript==
// @name         Youtube Anti Video Watch Confirmation
// @namespace    http://tampermonkey.net/
// @version      0.0.07
// @description  Automatically Removes The Annoying "Do You Still Want To Watch This Video" Confirmation
// @author       rafa_br34#9060
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432120/Youtube%20Anti%20Video%20Watch%20Confirmation.user.js
// @updateURL https://update.greasyfork.org/scripts/432120/Youtube%20Anti%20Video%20Watch%20Confirmation.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function RandStr(Size) {
        var Result = '';
        var Characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var CharactersLength = Characters.length;
        for ( var i = 0; i < Size; i++ ) {
            Result += Characters.charAt(Math.floor(Math.random() *
                                                   CharactersLength));
        }
        return Result;
    }
    var Name = RandStr(150);
    EventTarget.prototype[Name] = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener)
    {
        //style-scope yt-confirm-dialog-renderer style-blue-text size-default
        //if (this.getAttribute && this.getAttribute("class") == "style-scope ytd-topbar-logo-renderer") {
        //    console.log(this,listener)
        //    var DummyEvent = new Event(type,{});
        //    listener(DummyEvent);
        //}
        //if (this.getAttribute) {
        //console.log(this.getAttribute("class"))
        //}

        return this[Name](type, listener);
    };

    var Target = document.getElementsByTagName("body")[0];
    var Observer = new MutationObserver(function(Mutations,Observer) {
        Mutations.forEach(function(Mutation) {
            // style-scope yt-confirm-dialog-renderer style-blue-text size-default
            // Confirmation Box Class ^^
            if (!Mutation.target || !Mutation.target.getAttribute) {
                return;
            }
            if (Mutation.target.getAttribute("class") == "style-scope yt-confirm-dialog-renderer style-blue-text size-default") {
                //Mutation.target.remove();
                console.log(Mutation.target.getAttribute("class"));//.className);
                Mutation.target.click();
            }
        });
    });
    console.log(Target);
    const Config = { attributes: true, childList: true, characterData: true, subtree: true };
    Observer.observe(Target, Config);
    //observer.disconnect();*/
})();