// ==UserScript==
// @name            Simple Permalink JoshJMM Fork
// @namespace       https://greasyfork.org/en/scripts/28589-simple-permalink-joshjmm-fork
// @version         0.1.6.1
// @description     Shortens WME permalinks by removing any layer and filter specifications
// @author          TheLastTaterTot JoshJMM Fork
// @include         /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/.*$/
// @exclude         https://www.waze.com/*user/editor/*
// @grant           none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/28589/Simple%20Permalink%20JoshJMM%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/28589/Simple%20Permalink%20JoshJMM%20Fork.meta.js
// ==/UserScript==
/* jshint -W097 */

var initSimplePermalink = function() {
    if (!document.getElementById('kmlPLPlaceholder')) {
        var kmlKeyPresses = Array(2);

        var getKMLPermalink = function(currPl) {
            var kmlShortPL = currPl.substr(currPl.lastIndexOf('en-US/editor')).replace(/&[^&]*Filter=[^&]*|&s=(\d+)/ig,'');
            return location.origin + '/' + kmlShortPL;
        };

        var copyToClipboard = function(str) {
            var $temp = $('<input>');
            $('body').append($temp);
            $temp.val(str).select();
            document.execCommand('copy');
            $temp.remove();
        };

        var copyPLHotkeyEvent = function(e) {
            if (e.metaKey || e.ctrlKey) kmlKeyPresses[0] = true;
            if (e.which === 67) kmlKeyPresses[1] = true;
            if (kmlKeyPresses[0] && kmlKeyPresses[1]) {
                copyToClipboard(document.getElementById('aKMLPermalink').getAttribute('href'));

                document.getElementById('kmlPLTooltip').style.display = 'none';
                document.getElementById('kmlPLTooltipCopied').style.display = 'block';
                setTimeout(function() {
                    document.getElementById('kmlPLTooltipCopied').style.display = 'none';
                }, 2000);
            }
        };

        var kmlStyle = document.createElement("style");

        // Create CSS container element
        kmlStyle.type = "text/css";
        kmlStyle.id = "kml-css-container";
        kmlStyle.innerHTML = `
        .kml-pl-container { height: 25px; width: 48px; position: absolute; bottom: 0; right: 0; line-height: 24px; margin-right: 15px; margin-left: -24px; padding-left: 2px; visibility: visible; pointer-events: auto; }
        .kml-pl-container a:link, .kml-pl-container a:active, .kml-pl-container a:focus { text-decoration: none; background-image: none; outline: 0; -webkit-box-shadow: none; box-shadow: none; }
        .kml-pl-container>.fa-stack { height: 25px; width: 24px; margin-left: -2px; line-height: inherit; }
        .kml-pl-container>.fa-stack .fa-circle { font-size: 26px; line-height: 25px; bottom: 0px; }
        .kml-pl-container>.fa-stack .fa-link { font-size: 16px; line-height: 25px; bottom: 0px; }
        .kml-pl-tooltipbox { max-width: 99%; right: 0; white-space: normal; word-wrap: break-word; word-break: break-all; bottom: 25px; visibility: visible; margin-right: 15px; color: white; font-size: 8pt; background-color: transparent; pointer-events: none; position: absolute; }
        .kml-pl-tooltipbox>div { padding: 5px; border-radius: 5px; background-color: black; }
        .street-view-mode .kml-pl-container, .street-view-mode .kml-pl-tooltipbox { right: 50% !important; }`;

        document.head.appendChild(kmlStyle);

        var wazePermalinkEl = document.querySelector('.WazeControlPermalink>a.fa-link'),
            wazeCopyPlNote = wazePermalinkEl.getAttribute('data-original-title'),
            kmlCurrentPl = getKMLPermalink(wazePermalinkEl.getAttribute('href')),
            wazeControlPermalinkEl = wazePermalinkEl.parentNode,
            kmlMapPLContainer = document.createElement('div'),
            kmlPLPlaceholder = document.createElement('div'),
            kmlPermalink;

        wazePermalinkEl.id = 'wazePermalink';

        kmlMapPLContainer.id = 'kmlPL';
        kmlMapPLContainer.style.position = 'absolute';
        kmlMapPLContainer.style.width = '100%';
        kmlMapPLContainer.style.bottom = '0px';
        kmlMapPLContainer.style.right = '0px';
        kmlMapPLContainer.style.visibility = 'hidden';
        kmlMapPLContainer.style.pointerEvents = 'none';
        kmlMapPLContainer.style.zIndex = 4;
        kmlMapPLContainer.innerHTML = '<div class="kml-pl-tooltipbox"><div id="kmlPLTooltip" style="display: none;"></div><div id="kmlPLTooltipCopied" style="display: none;"></div></div>' +
                                      '<div class="kml-pl-container" style="overflow: hidden; width: 25px;"><div id="kmlPermalink" class="fa-stack"></div></div>';
        document.getElementById('map').appendChild(kmlMapPLContainer);

        kmlPLPlaceholder.id = 'kmlPLPlaceholder';
        kmlPLPlaceholder.style.float = 'right';
        kmlPLPlaceholder.style.position = 'relative';
        kmlPLPlaceholder.style.bottom = '0px';
        kmlPLPlaceholder.style.right = '0px';
        kmlPLPlaceholder.style.height = '25px';
        kmlPLPlaceholder.style.width = '25px';
        kmlPLPlaceholder.style.marginRight = '-4px';
        kmlPLPlaceholder.style.marginLeft = '-24px';
        kmlPLPlaceholder.style.backgroundColor = '#E9E9E9';
        wazeControlPermalinkEl.appendChild(kmlPLPlaceholder);

        //-------------------------
        kmlPermalink = document.getElementById('kmlPermalink');
        kmlPermalink.innerHTML = '<a id="aKMLPermalink" href="' + kmlCurrentPl + '"><span class="fa fa-circle fa-stack-1x" style="color: #59899E;"></span><span class="fa fa-link fa-stack-1x fa-inverse"></span></a>';
        //-------------------------
        // PL address popup
        document.getElementById('kmlPLTooltip').innerHTML = '<span id="tooltipKMLPermalink">' + kmlCurrentPl + '</span><p></p><b>' + wazeCopyPlNote + '</b>';
        // "Copied" popup
        document.getElementById('kmlPLTooltipCopied').innerHTML = '<b>' + I18n.translations[I18n.locale].footer.link_copied + '</b>';

        //------------------------------------------------------------------
        kmlPermalink.addEventListener('mouseenter', function(e) {
            var changedThisPl = getKMLPermalink(wazePermalinkEl.getAttribute('href'));

            document.getElementById('tooltipKMLPermalink').innerHTML = changedThisPl;
            document.getElementById('aKMLPermalink').setAttribute('href', changedThisPl);
            document.getElementById('kmlPLTooltip').style.display = 'block';
            window.addEventListener('keydown', copyPLHotkeyEvent, false);
        }, false);

        kmlPermalink.addEventListener('mouseleave', function() {
            kmlKeyPresses = Array(2);
            document.getElementById('kmlPLTooltip').style.display = 'none';
            document.getElementById('kmlPLTooltipCopied').style.display = 'none';
            window.removeEventListener('keydown', copyPLHotkeyEvent);
        }, false);

        try {
            // Hide WME permalink, but allow TB to overrule with display: none;
            wazePermalinkEl.style.visibility = 'hidden';
        } catch (err) {}
    }
};

////////////////////////////////////////////////////////////////////////////////////
function waitForWazeElement() {
    var waitCount = 0,
        maxWait = 50; //30++ seconds

    var tryInit_kmlPL = function() {
        try {
            if (waitCount < maxWait &&
                document.getElementsByClassName('WazeControlPermalink').length) {
                initSimplePermalink();
                waitCount++; //for catching returns due to an undetected error
            } else if (waitCount++ < maxWait) {
                setTimeout(tryInit_kmlPL, 25 * waitCount);
            } else {
                console.error('WMESPL:',
                    'Could not find necessary WME permalink element');
            }
        } catch (err) {
            try { //try again once more in case it failed due to another script or WME hiccup... >:]
                setTimeout(tryInit_kmlPL, 500);
            } catch (err) {
                console.error(
                    'WMESPL:',
                    'WME Simple Permalinks failed to load due to some kind of technical script error. :(');
                console.error(err);
            }
        }
    };
    tryInit_kmlPL();
}

setTimeout(waitForWazeElement,2000);
