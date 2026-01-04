// ==UserScript==
// @name         Wanikani Forums: Easy Furigana
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Adds a button to generate ruby code for furigana from <kanji>[furigana] or <kanji>{furigana} for spoilered furigana.
// @author       Kumirei
// @include      https://community.wanikani.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382405/Wanikani%20Forums%3A%20Easy%20Furigana.user.js
// @updateURL https://update.greasyfork.org/scripts/382405/Wanikani%20Forums%3A%20Easy%20Furigana.meta.js
// ==/UserScript==
/*jshint esversion: 8 */

(function() {
    waitForClass('d-editor-input', (elems)=>{
        var elem = elems[0];
        var btn = document.createElement('button');
        btn.className = "rubyfy btn no-text btn-icon ember-view";
        btn.title = "Click to generate ruby code from <kanji>[furigana] or <kanji>{furigana} for spoilered furigana";
        btn.innerText = "R";
        btn.onclick = ()=>{
            var text = elem.value;
            text = replaceMatches(text, text.match(/<[^>]*>\[[^\]]*\]/g), (match)=>{var [kanji, furigana] = match.slice(1,-1).split('>['); return '<ruby>'+kanji+'<rp>(</rp><rt>'+furigana+'</rt><rp>)</rp></ruby>';});
            text = replaceMatches(text, text.match(/<[^>]*>\{[^\}]*\}/g), (match)=>{var [kanji, furigana] = match.slice(1,-1).split('>{'); return '<ruby>'+kanji+'<rp>(</rp><rt><span class="spoiler">'+furigana+'</span></rt><rp>)</rp></ruby>';});
            elem.value = text;
            elem.focus();
            elem.blur();
            elem.focus();
        };
        var refElem = document.getElementsByClassName('italic')[0];
        refElem.parentElement.insertBefore(btn, refElem.nextElementSibling);
    });

    function replaceMatches(text, matches, replaceFunction) {
        if (matches === null) return text;
        for (var i=0; i<matches.length; i++) {
            var str = matches[i];
            var rb = replaceFunction(str);
            str = str.replace('[', '\\[');
            str = str.replace(']', '\\]');
            var rgx = RegExp(str);
            text = text.replace(rgx, rb);
        }
        return text;
    }

    function waitForClass (className, callback) {
        var alreadyExists = 0;
        setInterval(()=>{
            var elems = document.getElementsByClassName(className);
            var found = elems.length;
            if (!alreadyExists && found) callback(elems);
            alreadyExists = found;
        }, 333);
    }
})();
