// ==UserScript==
// @name			DSA Debug Tools
// @namespace		COMDSPDSA
// @version			4.5
// @description		Tools for debugging DSA
// @author			Dan Overlander
// @include         *
// @require			https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=739578
// @require		    https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @require         https://greasyfork.org/scripts/40055-libraryjquerygrowl/code/libraryJQueryGrowl.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min.js
// @downloadURL https://update.greasyfork.org/scripts/40287/DSA%20Debug%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/40287/DSA%20Debug%20Tools.meta.js
// ==/UserScript==

// Since v04.4: Some general improvements in onerror.  Attempted enhancement of console methods; not working as of this writing.  Moving growl classes to tampermonkey library.
// Since v04.3: Removes Tamper Global script dependency
// Since v04.2: Updated Tampermonkey library
// Since v04.1: including PartnerUX url
// Since v04: Adjusting down the z-index of growl window
// Since v03: Modernized trigger elements
// Since v02: Tweaks
// Since v01: unversioned tm library requirement.
// Since v00: init

/*
 * tm is an object included via @require from DorkForce's Tampermonkey Assist script
 */

// Sadly, this "define a new console" bit does not seem to override the host site's console calls...
// define a new console
var console=(function(oldCons){
    return {
        log: function(text){
            oldCons.log(text);
            $.growl.notice({
                message: text,
                size: 'large',
                duration: 4800 // 3200 is default
            });
        },
        info: function (text) {
            oldCons.info(text);
            $.growl.notice({
                message: text,
                size: 'medium'
            });
        },
        warn: function (text) {
            oldCons.warn(text);
            $.growl.warning({
                message: text,
                size: 'medium'
            });
        },
        error: function (text) {
            oldCons.error(text);
            $.growl.error({
                message: text,
                size: 'large',
                delayOnHover: true
            });
        }
    };
}(window.console));
//Then redefine the old console
window.console = console;

window.onerror=function(errr){
    var copyThis = '';
    if (errr.message != null) {
        copyThis += 'Error Occurred:' + errr.message;
        if (errr.filename != null) {
            copyThis += '<br><br>in File:' + errr.filename;
            if (errr.lineno != null) {
                copyThis += '\nLine:' + errr.lineno;
                if (errr.colno != null) {
                    copyThis += '\nCol:' + errr.colno;
                }
            }
        }
    } else if (errr.srcElement != null) {
        copyThis = 'An error was originated by:<br>' + errr.srcElement.src;
    } else {
        copyThis = 'Some error occured; check the console.';
    }
    $.growl.error({
        message: copyThis,
        size: 'large',
        delayOnHover: true
    });
    return true;
};

(function() {
    'use strict';

    var TIMEOUT = 750,
		global = {
            scriptName: 'DSA Debug Tools',
            prefsName: 'debugPrefs',
            prefs: {},
            handlePrefsLocally: true,
            triggerElement: 'body',
            areClassesAdded: false,
            pageInitialized: false,
            isResetting: undefined,
            elapsedSeconds: 0,
            errorsPerSecond: 0
		},
		page = {
			initialize: function () {
				setTimeout(function () {
                    tm.addClasses();
                    tm.setTamperIcon(global);
                    //page.initOnce();
				}, TIMEOUT);
			},
            initOnce: function() {
                if (!global.pageInitialized) {
                    global.pageInitialized = true;

                    setInterval(() => {
                        global.elapsedSeconds++;
                        tm.log(global.elapsedSeconds);
                    }, 1000);


                }
            }
		};

    /*
     * Global functions
     */

    function initScript () {
        tm.getContainer({
            'el': global.triggerElement,
            'max': 100,
            'spd': 1000
        }).then(function($container){
            page.initialize();
        });
    }

    initScript();

    $(document).mousemove(function(e) {
        if (!global.isMouseMoved) {
            global.isMouseMoved = true;
            setTimeout(function() {
                global.isMouseMoved = false;
            }, TIMEOUT * 2);
            initScript();
        }
    });

    window.onresize = function(event) {
        initScript();
    };

})();