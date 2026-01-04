// ==UserScript==
// @name         block
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  阻止chatgpt删除结果
// @author       DarkFaMaster
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478449/block.user.js
// @updateURL https://update.greasyfork.org/scripts/478449/block.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeModeration(obj){
        if(obj.moderation_response){
            console.log('检测到moderation_response');
            delete obj.moderation_response;
        }
        if(obj.moderation_results){
            console.log('检测到moderation_results');
            delete obj.moderation_results;
        }
    }

    const json = Response.prototype.json;
    Response.prototype.json = function(){
        return new Promise((resolve) => {
            json.call(this).then(json => {
                removeModeration(json);
                resolve(json);
            });
        });
    }

    const parse = JSON.parse;
    JSON.parse = function(...args){
        const obj = parse(...args);
        removeModeration(obj);
        return obj;
    }

})();