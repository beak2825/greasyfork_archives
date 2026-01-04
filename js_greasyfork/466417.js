// ==UserScript==
// @name         Obliterate 'Birthday' Button on Discord
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      CC0-1.0
// @description  Nukes the 'Birthday' button that has suddenly appeared around 16th May 2023. This is a new script because it has distinct behavior.
// @author       20kdc
// @match        https://discordapp.com/*
// @match        https://discord.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466417/Obliterate%20%27Birthday%27%20Button%20on%20Discord.user.js
// @updateURL https://update.greasyfork.org/scripts/466417/Obliterate%20%27Birthday%27%20Button%20on%20Discord.meta.js
// ==/UserScript==

/*
Written by 20kdc
To the extent possible under law, the author(s) have dedicated all copyright and related and neighboring rights to this software to the public domain worldwide. This software is distributed without any warranty.
You should have received a copy of the CC0 Public Domain Dedication along with this software. If not, see <http://creativecommons.org/publicdomain/zero/1.0/>.
*/

// Since iterating through the entire DOM would be performance suicide,
//  let's try to detect classes in ANY OTHER WAY.
var dragonequus;
dragonequus = {
    version: 5.0,
    getAllClassesLen: 0,
    getAllClassesCache: [],
    getAllClasses: function () {
        var sheets = document.styleSheets;
        if (sheets.length == dragonequus.getAllClassesLen) {
            return dragonequus.getAllClassesCache;
        }
        var workspace = [];
        var seen = {};
        for (var k = 0; k < sheets.length; k++) {
            var sheet = sheets[k];
            for (var k2 = 0; k2 < sheet.cssRules.length; k2++) {
                var rule = sheet.cssRules[k2];
                if (rule.type == CSSRule.STYLE_RULE) {
                    // .A:I .B:I, .A .B
                    var majors = rule.selectorText.split(",");
                    for (var k3 = 0; k3 < majors.length; k3++) {
                        var minors = majors[k3].split(" ");
                        for (var k4 = 0; k4 < minors.length; k4++) {
                            // Minor starts off as say .A:B
                            var minor = minors[k4];
                            // Must be class
                            if (!minor.startsWith("."))
                                continue;
                            // Cut off any : and remove .
                            var selectorBreak = minor.indexOf(":");
                            if (selectorBreak != -1) {
                                minor = minor.substring(1, selectorBreak);
                            } else {
                                minor = minor.substring(1);
                            }
                            if (seen[minor])
                                continue;
                            seen[minor] = true;
                            workspace.push(minor);
                        }
                    }
                }
            }
        }
        dragonequus.getAllClassesLen = sheets.length;
        dragonequus.getAllClassesCache = workspace;
        return workspace;
    },
    isValidDC: function (obfuscated, real) {
        if (!obfuscated.startsWith(real + "-"))
            return false;
        if (obfuscated.length != real.length + 7)
            return false;
        return true;
    },
    findAllByDiscordClass: function (name) {
        var q = [];
        var q2 = document.querySelectorAll("." + name);
        for (var k2 = 0; k2 < q2.length; k2++)
            q.push(q2[k2]);
        var classes = dragonequus.getAllClasses();
        for (var k in classes) {
            var n = classes[k];
            if (dragonequus.isValidDC(n, name)) {
                q2 = document.querySelectorAll("." + n);
                for (var k2 = 0; k2 < q2.length; k2++)
                    q.push(q2[k2]);
            }
        }
        return q;
    },
    findByDiscordClass: function (name) {
      	var all = dragonequus.findAllByDiscordClass(name);
      	if (all.length > 0)
            return all[0];
        return null;
    },
    toDiscordClasses: function (name) {
        var classes = dragonequus.getAllClasses();
        var all = [];
        for (var k in classes) {
            var n = classes[k];
            if (dragonequus.isValidDC(n, name))
                all.push(n);
        }
        all.push(name);
        return all;
    },
    toDiscordClass: function (name) {
        return dragonequus.toDiscordClasses(name)[0];
    },
    injectCSSRulesNow: function (rules) {
        var styleElm = document.createElement('style');
        console.log("dragonequus CSS:", rules);
        document.body.appendChild(styleElm);
        for (var i = 0; i < rules.length; i++)
            styleElm.sheet.insertRule(rules[i], 0);
    },
    injectCSSRules: function (getRules) {
        setTimeout(function () {
            dragonequus.injectCSSRulesNow(getRules());
        }, 1000);
    },
    injectCSSForClassScript: function (clazz, css) {
        dragonequus.injectCSSRules(function () {
            var classes = dragonequus.toDiscordClasses(clazz);
            var total = [];
            for (var i = 0; i < classes.length; i++)
                total.push("." + classes[i] + " { " + css + " }");
            return total;
        });
    },
};

// I really, really wish there was such a thing as a reverse CSS child combinator. Sort of like :target-within, but like :contains(a[href=\"/message-requests\"] { display: none; })
// Then this could be made so much better.
dragonequus.injectCSSRulesNow([
  "a[data-list-item-id*=\"activities\"][data-list-item-id*=\"private-channels\"] { display: none; }"
  // if things break
  // "a[href=\"/activities\"] { display: none; }"
]);
