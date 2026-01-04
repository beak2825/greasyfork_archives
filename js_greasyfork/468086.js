// ==UserScript==
// @name         Hide 9GAGGER
// @name:en      Hide 9GAGGER
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hides all anonymous (9GAGGER) posts
// @description:en  Hides all anonymous (9GAGGER) posts
// @author       You
// @match        https://9gag.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=9gag.com
// @license MIT
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/468086/Hide%209GAGGER.user.js
// @updateURL https://update.greasyfork.org/scripts/468086/Hide%209GAGGER.meta.js
// ==/UserScript==

(function(win, _) {
    'use strict';
    _.parse = win.JSON.parse;
    Object.defineProperty(win.JSON, 'parse', {
        get() {
            return function(){
                let json = _.parse(...arguments);
                if ('data' in Object(json) && 'posts' in Object(json.data)){
                    json.data.posts = json.data.posts.filter(e=>{
                        if (e.creator) return true;
                        //console.log(e);
                        fetch("https://9gag.com/report", {
                            "body": `{"type":8,"entryId":"${e.id}"}`,
                            "method": "POST",
                            "mode": "cors",
                            "credentials": "include"
                        });
                        return false;
                    });
                }
                return json;
            };
        },
        set() {}
    });
})(unsafeWindow, {});