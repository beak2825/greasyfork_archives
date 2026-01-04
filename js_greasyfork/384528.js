// ==UserScript==
// @name         ForvoDDL
// @namespace    https://yveone.com/ForvoDDL
// @version      1.0.4
// @description  Download audio files directly from Forvo website without account.
// @author       YveOne (Yvonne P.)
// @license      MIT; https://opensource.org/licenses/MIT
// @include      https://*.forvo.com/*
// @include      https://audio00.forvo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384528/ForvoDDL.user.js
// @updateURL https://update.greasyfork.org/scripts/384528/ForvoDDL.meta.js
// ==/UserScript==

/*global
_SERVER_HOST
_AUDIO_HTTP_HOST
defaultProtocol
*/

(function() {
    'use strict';

    if (location.host === "audio00.forvo.com") {
        if (location.hash) {
            let [file, name] = JSON.parse(decodeURIComponent(location.hash.substr(1)));
            let a = document.createElement('a');
            a.setAttribute('href', file);
            a.setAttribute('download', name);
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
        return;
    }

    const rePlayData = /^play\((\d+),'([[A-Za-z0-9+\/=]+)?','([[A-Za-z0-9+\/=]+)?',(true|false),'([[A-Za-z0-9+\/=]+)?','([[A-Za-z0-9+\/=]+)?','([\w]+)?'\);.*?$/i;
    const selectorPlayButton = "span.play[onclick]";
    const reSearchTranslationLocation = /https\:\/\/(?:\w+\.)forvo\.com\/search-translation\/(.*?)\/(.*?)\//i;
    const reSearchLocation = /https\:\/\/(?:\w+\.)forvo\.com\/search\/(.*?)\//i;
    const reWordLocation = /https\:\/\/(?:\w+\.)forvo\.com\/word\/(.*?)\//i;
    const reUserLocation = /https\:\/\/(?:\w+\.)forvo\.com\/user\/(.*?)\/.*?\//i;
    const rePhraseLocation = /https\:\/\/(?:\w+\.)forvo\.com\/phrase\/(.*?)\//i;
    const reLangPronLocation = /https\:\/\/(?:\w+\.)forvo\.com\/languages-pronunciations\/.*?\//i;
    const reTagListLocation = /https\:\/\/(?:\w+\.)forvo\.com\/tag\/.*?\//i;


    function getPlayData(playButton) {
        let m = playButton.getAttribute("onclick").match(rePlayData);
        if (!m) {
            return false;
        }
        //m = [_, id, mp3, ogg, b, _mp3, _ogg, u]
        let id = parseInt(m[1]);
        let mp3 = defaultProtocol + "//" + _AUDIO_HTTP_HOST + "/mp3/" + atob(m[2]);
        let ogg = defaultProtocol + "//" + _AUDIO_HTTP_HOST + "/ogg/" + atob(m[3]);
        return {id, mp3, ogg};
    }

    function downloadAudio(href, filename) {
        let i = document.createElement('iframe');
        i.setAttribute('src', defaultProtocol + "//" + _AUDIO_HTTP_HOST + "#" + JSON.stringify([href, filename]));
        i.style.display = 'none';
        document.body.appendChild(i);
        setTimeout(function() {
            document.body.removeChild(i);
        }, 1000);
    }

    function decUrl(str) {
        return decodeURIComponent(str).replace(/_/g, " ");
    }

    function onclick(e) {
        let row = e.target.parentNode.parentNode;
        let playButton = row.querySelector(selectorPlayButton);
        let fileType = e.target.getAttribute("data-type");
        let audioData = getPlayData(playButton);
        let filename = `audio.${fileType}`;

        if (reSearchTranslationLocation.test(location.href)) {

            let m = location.href.match(reSearchTranslationLocation);
            let search = decUrl(m[1]);
            let lang = m[2];
            let word = row.querySelector("a.word").innerHTML;
            filename = `${search} - ${word}.${fileType}`;

        } else if (reSearchLocation.test(location.href)) {

            let search = row.querySelector("a.word").innerHTML;
            filename = `${search}.${fileType}`;

        } else if (reWordLocation.test(location.href)) {

            let m = location.href.match(reWordLocation);
            let word = decUrl(m[1]);
            let user = row.querySelector("span.ofLink").innerHTML;
            filename = `${word} (by ${user}).${fileType}`;

        } else if (reUserLocation.test(location.href)) {

            let m = location.href.match(reUserLocation);
            let user = decUrl(m[1]);
            row = row.parentNode;
            let word = row.querySelector("a.word").innerHTML;
            filename = `${word} (by ${user}).${fileType}`;

        } else if (rePhraseLocation.test(location.href)) {

            let m = location.href.match(rePhraseLocation);
            let phrase = decUrl(m[1]);
            let user = row.querySelector("span.ofLink").innerHTML;
            filename = `${phrase} (by ${user}).${fileType}`;

        } else if (reLangPronLocation.test(location.href)) {

            let m = location.href.match(reLangPronLocation);
            let word = row.querySelector("a.word").innerHTML;
            filename = `${word}.${fileType}`;

        } else if (reTagListLocation.test(location.href)) {

            let m = location.href.match(reTagListLocation);
            let word = row.querySelector("a.word").innerHTML;
            filename = `${word}.${fileType}`;



        }

        downloadAudio(audioData[fileType], filename);
    }

    function readDoc(doc) {
        Array.from(doc.querySelectorAll(selectorPlayButton)).forEach((playBtn, i) => {

            playBtn.setAttribute("style", "position: relative;");
            playBtn.parentNode.setAttribute("style", "padding-left: 0;");

            let mp3 = document.createElement("a");
            mp3.appendChild(document.createTextNode("mp3"));
            mp3.setAttribute("data-type", "mp3");
            mp3.setAttribute("style", "cursor: pointer;");
            mp3.addEventListener("click", onclick);

            let ogg = document.createElement("a");
            ogg.appendChild(document.createTextNode("ogg"));
            ogg.setAttribute("data-type", "ogg");
            ogg.setAttribute("style", "cursor: pointer;");
            ogg.addEventListener("click", onclick);

            let span = document.createElement("span");
            span.appendChild(document.createTextNode("["));
            span.appendChild(mp3);
            span.appendChild(document.createTextNode("]"));
            span.appendChild(document.createTextNode("["));
            span.appendChild(ogg);
            span.appendChild(document.createTextNode("]"));

            playBtn.parentNode.insertBefore(span, playBtn);
        });
    }

    readDoc(document);

})();
