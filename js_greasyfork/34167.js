// ==UserScript==
// @name         Fuck You Kas
// @namespace    http://anonkun.com/user/Kas
// @version      0.31
// @description  Because fuck you Kas
// @author       anon
// @include      https://anonkun.com/*
// @include      http://anonkun.com/*
// @include      https://fiction.live/*
// @include      http://fiction.live/*
// @include      https://beta.fiction.live/*
// @include      http://beta.fiction.live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34167/Fuck%20You%20Kas.user.js
// @updateURL https://update.greasyfork.org/scripts/34167/Fuck%20You%20Kas.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // If there are users you want to whitelist, you can put their names between the brackets ([]) below
    // Example: ["squiggles", "Kas"] would whitelist squiggles and Kas and display their names on their messages.
    const WhiteList = [];

    // true  => will set the names to default nick determined by the QM
    // false => will set the names to anon
    const UseDefaultNick = true;

    const events = {
        chat_message_add: {
            trigger: (...args) => {
                events.chat_message_add.callbacks.forEach(fn => { fn(...args); });
            },
            callbacks: []
        }
    };
    const onMutation = function(mutations){
        mutations.forEach(mutation => {
            const target = $(mutation.target);

            if(target.hasClass("jadeRepeat")){
                $(mutation.addedNodes).filter(".logItem").each((i,el)=>{
                    events.chat_message_add.trigger(el);
                });
            }
            if(target.hasClass("ng-scope") && mutation.addedNodes && $(mutation.addedNodes[0]).hasClass("jadeRepeat")){
                $(mutation.addedNodes[0]).find(".logItem").each((i,el)=>{
                    events.chat_message_add.trigger(el);
                });
            }
        });
    };

    const getAuthors = function(){
        return $("#storyProperties .author .name").toArray().map(v => $(v).text());
    };

    events.chat_message_add.callbacks.push((item) => {
        const el = $(item);
        const user_el = el.find(".user > a, .user > span");
        const user = user_el.text();
        const authors = getAuthors();
        if(authors.indexOf(user) == -1){
            if(WhiteList.indexOf(user) > -1) return;
            if(user === "Kas") user_el.text("Retarded Site Owner");
            else {
                const dn = $("html").data("$scope").defaultNick;
                user_el.text(UseDefaultNick && !!dn ? dn : "anon");
            }
        }
    });

    const observer = new MutationObserver(onMutation);
    observer.observe(document, {
        childList: true,
        attributes: false,
        characterData: false,
        subtree: true,
        attributeOldValue: false,
        characterDataOldValue: false,
        //attributeFilter: []
    });
    $("head").append(`<style type="text/css">.userVote{ display: none }</style>`);
})();