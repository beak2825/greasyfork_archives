// ==UserScript==
// @name        Comments killfile for Cyanide & Happiness
// @namespace   https://pineight.com/
// @description Removes comments by users that I don't care to read
// @include     http://explosm.net/shorts/*
// @include     http://explosm.net/comics/*
// @version     2
// @grant    GM_addStyle
// @grant    GM_getValue
// @grant    GM_setValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/21794/Comments%20killfile%20for%20Cyanide%20%20Happiness.user.js
// @updateURL https://update.greasyfork.org/scripts/21794/Comments%20killfile%20for%20Cyanide%20%20Happiness.meta.js
// ==/UserScript==

/*jslint browser, fudge */
/*global window, console, GM_getValue, GM_setValue */

(function () {
    "use strict";

    // Lowercase-initial aliases to suppress "Expected 'new' before" warning
    var gm_setValue = GM_setValue;
    var gm_getValue = GM_getValue;

    var trim = (function () {
        var trimRE = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        return function (s) {
            return s.replace(trimRE, "");
        };
    }());


    var read_users_from_string = function (s) {
        var lines = s.split("\n");
        var r = {};
        lines.forEach(function (line) {
            line = trim(line);
            if (line !== "") {
                r[line] = true;
            }
        });
        return r;
    };

    var read_users_from_textarea = function () {
        var kfl = document.getElementById("pino_killfile_list");
        return read_users_from_string(kfl.value);
    };

    // Converts a NodeList object (such as the result of
    // document.querySelectorAll) into a real Array that can forEach
    var list = function (seq) {
        return Array.prototype.slice.call(seq, 0);
    };

    var go = function () {
        console.log("Applying killfile");
        var kfset = read_users_from_textarea();
        console.log("to " + Object.keys(kfset));

        var cws = list(document.querySelectorAll(".comment-wrapper"));
        cws.forEach(function (cw) {
            var cuspan = cw.querySelector(".comment-username");
            if (!cuspan) {
                return;
            }
            var username = trim(cuspan.firstChild.textContent);
            var in_kfset = Object.prototype.hasOwnProperty.call(kfset, username);
            if (!in_kfset) {
                return;
            }
            cw.innerHTML = "";
            cw.textContent = "(Ignoring comment by " + username + ")";
        });
        var usersaslines = Object.keys(kfset).join("\n");
        if (gm_setValue) {
            gm_setValue("kf_users", usersaslines);
        }
    };

    // JSLint requires that string literals be double-quoted for
    // consistency with JSON.  It also forbids turning options on
    // and off for individual statements.  This means quotation
    // marks around attribute values have to be single, which is
    // uncommon but valid.
    var buttonhtml = "<a id='pino_killfile_button' href='#pino_killfile_button'>Hide comments</a> by these users:<br><textarea cols='30' rows='5' id='pino_killfile_list'></textarea>";

    var install = function () {
        var jstr = document.querySelector("a.js-toggle-replies");
        if (!jstr) {
            return false;
        }
        var userslist = gm_getValue && gm_getValue("kf_users");
        var users = userslist
            ? read_users_from_string(userslist)
            : {};
        var kflwrap = document.createElement("div");
        var usersaslines = Object.keys(users).join("\n");
        var kfbutton = null;

        kflwrap.setAttribute("id", "pino_killfile_list_wrapper");
        kflwrap.innerHTML = buttonhtml;
        jstr.parentNode.appendChild(kflwrap);
        var kfl = document.getElementById("pino_killfile_list");
        kfl.textContent = usersaslines;
        kfbutton = document.getElementById("pino_killfile_button");
        kfbutton.addEventListener("click", go, false);
        console.log("Killfile loaded");
        return kfbutton;
    };

    // JSLint requires recursive functions to be declared explicitly
    // before being defined
    // http://stackoverflow.com/a/33788303/2738262
    var waitinstall = null;
    waitinstall = function () {
        if (!install()) {
            console.log("Killfile by PinoBatch will be installed once comments load");
            window.setTimeout(waitinstall, 10000);
        }
    };
    waitinstall();
}());
