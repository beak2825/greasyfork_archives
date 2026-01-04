// ==UserScript==
// @name         Forvo Direct Download
// @namespace    https://github.com/Artemis-chan
// @version      0.2
// @description  Download audio from forvo without going through sign up process. Right click on [ DL ] and press save.
// @author       Artemis
// @match        *://forvo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=forvo.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508491/Forvo%20Direct%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/508491/Forvo%20Direct%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var plays = document.getElementsByClassName("play")

    function trimChars (str, c) {
        var re = new RegExp("^[" + c + "]+|[" + c + "]+$", "g");
        return str.replace(re,"");
    }

    function isNull(x){
        const nul = [null, undefined, ''];
        return nul.includes(x);
    }

    function base64Decode(base64) {
        const binString = atob(base64);
        const bytesU8 = Uint8Array.from(binString, (m) => m.codePointAt(0));
        return new TextDecoder().decode(bytesU8);
    }

    function scrapeSound(b, c, e, f) {
        b = trimChars(b, '\'');
        c = trimChars(c, '\'');
        e = trimChars(e, '\'');
        f = trimChars(f, '\'');

        const _AUDIO_HTTP_HOST = "audio12.forvo.com";
        const defaultProtocol = "http:";

        if(!isNull(b))
        {
            b = defaultProtocol + '//' + _AUDIO_HTTP_HOST + '/mp3/' + base64Decode(b);
        }
        if(!isNull(c))
        {
            c = defaultProtocol + '//' + _AUDIO_HTTP_HOST + '/ogg/' + base64Decode(c);
        }
        if(!isNull(e))
        {
            e = defaultProtocol + '//' + _AUDIO_HTTP_HOST + '/audios/mp3/' + base64Decode(e);
        }
        if(!isNull(f))
        {
            f = defaultProtocol + '//' + _AUDIO_HTTP_HOST + '/audios/ogg/' + base64Decode(f);
        }

        return [b, c, e, f]
    }

    for(const play of plays)
    {
        console.log(play)
        var args = /\(\s*([^)]+?)\s*\)/.exec(play.attributes.onclick.textContent);
        if (args[1]) {
            args = args[1].split(/\s*,\s*/);
            var scrape = scrapeSound(args[1], args[2], args[4], args[5]);
            for(const s of scrape)
            {
                if(isNull(s)) continue;

                var htmlString = `<a target="_blank" href="` + s + `" download="` + trimChars(args[7], "'") + /\.([^.]+)$/.exec(s)[0] + `">[ DL ]</a>`;

                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = htmlString;

                var newElement = tempDiv.firstElementChild;

                var referenceElement = play.parentNode;
                var parentElement = referenceElement.parentNode;

                parentElement.insertBefore(newElement, referenceElement.nextSibling);
            }
            console.log(scrape)
        }
    }
})();