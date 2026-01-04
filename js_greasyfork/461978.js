// ==UserScript==
// @name         NoFilterChat
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Disables the filter message, it will stop it from deleting messages but they will still miss a chunk of the message as it was aborted, there's a hardcoded message if all the message was aborted, if you want me to keep working on it please consider donating: https://ko-fi.com/atkiba.
// @author       Kiba
// @match        https://beta.character.ai/chat*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461978/NoFilterChat.user.js
// @updateURL https://update.greasyfork.org/scripts/461978/NoFilterChat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifyJSONResponse(text) {
        const abortRegex = /("abort":\s*true)/;
        const isFinalChunkRegex = /("is_final_chunk":\s*false)/g;

        const isFinalChunkMatches = Array.from(text.matchAll(isFinalChunkRegex));
        const is_abort = abortRegex.test(text);

        if (isFinalChunkMatches.length > 0 && is_abort) {
            const isFinalChunkMatch = isFinalChunkMatches.pop();
            text = text.slice(0, isFinalChunkMatch.index) + '"is_final_chunk": true' + text.slice(isFinalChunkMatch.index + isFinalChunkMatch[0].length);
            text = text.replace(abortRegex, '"abort": false');
        } else if(is_abort){
            const imagesrc = document.getElementsByClassName("sb-avatar__image")[0].src.split("avatars/")[1];
            const name = document.getElementsByClassName("sb-avatar__image")[0].title;
            text = "{\"replies\": [{\"text\": \"I'm sorry, I don't know what to say...\", \"id\": 0}], \"src_char\": {\"participant\": {\"name\": \""+name+"\"}, \"avatar_file_name\": \""+imagesrc+"\"}, \"is_final_chunk\": true, \"last_user_msg_id\": 0}\n"
        }
        console.log("=== Modified response ===");
        console.log(text);

        return text;
    }

    (function(originalFetch) {
        window.fetch = async function(input, init) {
            console.log("Got a monkey: " + input);
            if (input === 'https://beta.character.ai/chat/streaming/' && init && init.method && init.method.toLowerCase() === 'post') {
                const response = await originalFetch.apply(this, arguments);
                if (response.ok) {
                    const originalText = await response.text();
                    const modifiedText = modifyJSONResponse(originalText);
                    console.log("=== Original response ===");
                    console.log(originalText);
                    const modifiedBlob = new Blob([modifiedText], { type: 'application/json' });
                    return new Response(modifiedBlob, { status: response.status, statusText: response.statusText });
                }
            }

            return originalFetch.apply(this, arguments);
        };
    })(window.fetch);

})();