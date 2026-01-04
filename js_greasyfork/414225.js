// ==UserScript==
// @name         WME RTL Fix
// @description  Fix RTL issues in Waze Map Editor
// @namespace    https://greasyfork.org/users/gad_m/wme_rtl_fix
// @version      1.0.0
// @author       gad_m
// @include 	 /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @require      https://greasyfork.org/scripts/28502-jquery-ui-v1-11-4/code/jQuery%20UI%20-%20v1114.js?version=187735
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/414225/WME%20RTL%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/414225/WME%20RTL%20Fix.meta.js
// ==/UserScript==

/* global W */
/* global jQuery */

(function() {
    'use strict';

    function bootstrap(tries) {
        console.debug('wme-rtl-fix: bootstrap() tries: ' + tries);
        if (W && W.map && W.map.events) {
            console.log('wme-rtl-fix: bootstrap() done!');
            init();
        } else if (tries < 20) {
            setTimeout(function () {
                bootstrap(++tries);
            }, 1000);
        } else {
            console.error('wme-rtl-fix: bootstrap() failed to load');
        }
    }

    function init() {
        console.log('wme-rtl-fix: init()');
        W.map.events.register("moveend", null, reverseTspan);
        reverseTspan();
    }

    function reverseTspan() {
        setTimeout(function() {
            console.log('wme-rtl-fix: reverseTspan()');
            jQuery( "tspan" ).each(function() {
                var text = jQuery( this ).text();
                if (isHebrew(text)) {
                    jQuery( this ).text(text.split('').reverse().join(''));
                }
            });
        }, 3000);
    }

    function isHebrew(str) {
        return (/[\u0590-\u05FF]/).test(str);
    }

    bootstrap(1);


})();