// ==UserScript==
// @name         blockr
// @namespace    MxyZhFMEUsKpdvTcHnBHtzPUeB3hQG
// @description  Block multiple tumblrs at once.
// @version      0.1
// @grant        none
// @include      *tumblr.com/settings/blog/*
// @downloadURL https://update.greasyfork.org/scripts/27338/blockr.user.js
// @updateURL https://update.greasyfork.org/scripts/27338/blockr.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // Return array of string values, or NULL if CSV string not well formed.
    function CSVtoArray(text) {
        var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
        var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
        // Return NULL if input string is not well formed CSV string.
        if (!re_valid.test(text)) return null;
        var a = [];                     // Initialize array to receive values.
        text.replace(re_value, // "Walk" the string using replace with callback.
            function(m0, m1, m2, m3) {
                // Remove backslash from \' in single quoted values.
                if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
                // Remove backslash from \" in double quoted values.
                else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
                else if (m3 !== undefined) a.push(m3);
                return ''; // Return empty string.
            });
        // Handle special case of empty last value.
        if (/,\s*$/.test(text)) a.push('');
        a = a.filter(function(entry) { return /\S/.test(entry); });
        return a;
    }
    // actually do the blocking
    var toBlockStr = prompt('Please enter a list of blogs to block, separated by commas.', '');
    if (!!toBlockStr) {
        var toBlock = CSVtoArray(toBlockStr);
        for (var i = 0; i < toBlock.length; i++) {
          var t = new Tumblr.Prima.Models.Tumblelog({
            name: toBlock[i]
          });
          t.block();
        }
        alert('Finished blocking.');
    }
})();
