// ==UserScript==
// @name         Base64 Decoder
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Decode any Base64 encoded text strings.
// @author       cn-ml
// @match        https://fora.snahp.eu/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/412018/Base64%20Decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/412018/Base64%20Decoder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var isUrl = function(s) {
        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        return regexp.test(s);
    }

    var MultiMatchLink = function(originalstr, str, iter) {
        if (iter > 5) return undefined;
        if (str === undefined) str = originalstr;
        if (iter === undefined) iter = 1;
        // console.log("Iteration " + iter);
        try {
            var result = atob(str);
            // console.log(`Found Base64 string ${result}!`);

            if (isUrl(result)) return {text: originalstr, href: result, iter: iter};
            else return MultiMatchLink(originalstr, result, iter + 1);
        } catch (error) {
            return undefined;
        }
    }

    var getLinkReplacement = function({text: str, href: ref, iter: iter}) {
        if (iter == 1) return `<a href="${ref}" target="_blank">${str}</a>`;
        else return `<a href="${ref}" target="_blank">${str} (${iter}x B64 encoded)</a>`;
    }

    $(".content").each(function(index) {
        var domobject = $(this)[0];
        var str = domobject.innerText;
        const regex = /\b(?:[A-Za-z0-9+/]{4}){6,}(?:[A-Za-z0-9+/]{2}(?==)|[A-Za-z0-9+/]{3}(?==)|[A-Za-z0-9+/]{4})\b=*/gm;
        var replacements = [];
        let m;
        while ((m = regex.exec(str)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                // console.log(`Found match, group ${groupIndex}: ${match}`);
                var link = MultiMatchLink(match);
                console.log(`Found endoded link: ${JSON.stringify(link)}`);
                if (link !== undefined) replacements.push(link);
            });
        }

        while (replacements.length > 0) {
            var repl = replacements.pop();
            domobject.innerHTML = domobject.innerHTML.replace(repl.text, getLinkReplacement(repl));
        }
    });
})();