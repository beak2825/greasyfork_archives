// ==UserScript==
// @name         WME KYTC PL Jump (beta)
// @namespace    https://greasyfork.org/users/45389
// @version      0.1.b4
// @description  Paste a KYTC PL in the search box and click the "Jump to KYTC PL" button.
// @author       MapOMatic
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @license      GNU GPLv3
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/21736/WME%20KYTC%20PL%20Jump%20%28beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/21736/WME%20KYTC%20PL%20Jump%20%28beta%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var _alertUpdate = true;
    var _debugLevel = 0;
    var _scriptVersion = GM_info.script.version;
    var _scriptChanges = GM_info.script.name + "\nv " + _scriptVersion + "\nPaste a KYTC PL in the search box and click the 'Jump to KYTC PL' button.\n\nWhat's New\n------------------------------";
    _scriptChanges += '\n- Improved calculation of zoom level.';

    function log(message, level) {
        if (message && level <= _debugLevel) {
            console.log('KYTC PL Jump: ' + message);
        }
    }

    function processKytcPL(pl) {
        var re = /.*x1=(\d+\.\d+)\&y1=(\d+\.\d+)\&x2=(\d+\.\d+)\&y2=(\d+\.\d+)/;
        if (! re.test(pl)) {
            alert('Could not process KYTC PL.');
            return;
        }
        var kytcCoords = re.exec(pl);
        var url = 'https://kygisserver.ky.gov/arcgis/rest/services/Utilities/Geometry/GeometryServer/project?inSR=102763&outSR=3857&geometries=';
        url += kytcCoords[1] + '%2C' + kytcCoords[2] + '%2C' + kytcCoords[3] + '%2C' + kytcCoords[4] + '&transformation=&transformForward=true&f=json';
        log(url, 1);
        $.ajax({
            url: url,
            method: 'GET',
            success: function(ext) {
                var pts = $.parseJSON(ext).geometries;
                console.log(pts);
                var wazeExt = W.map.getExtent();
                var aspectRatio = (wazeExt.right - wazeExt.left) / (wazeExt.top - wazeExt.bottom);
                var centerX = (pts[0].x + pts[1].x) / 2;
                var deltaX = (pts[1].y - pts[0].y) * aspectRatio / 2;
                var extent = [centerX - deltaX,pts[0].y,centerX + deltaX,pts[1].y];
                W.map.zoomToExtent(extent);
            }
        });
    }

    function addJumpButton() {
        $('.search-query').after($('<div class="btn btn-primary" style="float:right;margin-right:-120px;height:26px;line-height:26px;padding-left:8px;padding-right:8px;padding-top:0px;">Jump to KYTC PL</div>').click(function() {
            var pl = $('.search-query').val();
            processKytcPL(pl);
        }));
    }
    function init() {
        addJumpButton();

        /* Check version and alert on update */
        if (_alertUpdate && ('undefined' === window.localStorage.kytcPlJumpVersion ||
                             _scriptVersion !== window.localStorage.kytcPlJumpVersion)) {
            alert(_scriptChanges);
            window.localStorage.kytcPlJumpVersion = _scriptVersion;
        }

        // check for changes in the edit-panel
        var searchObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // Mutation is a NodeList and doesn't support forEach like an array
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var addedNode = mutation.addedNodes[i];
                    // Only fire up if it's a node
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        var searchBox = addedNode.querySelector('.search-query');
                        if (searchBox) {
                            addJumpButton();
                        }
                    }
                }
            });
        });
        searchObserver.observe(document.getElementById('app-head'), { childList: true, subtree: true });

        log('Initialized.', 0);
    }

    function bootstrap() {
        if (W && W.loginManager &&
            W.loginManager.events.register &&
            W.map && $('.level-icon').length>0) {
            log('Initializing...', 0);
            init();
        } else {
            log('Bootstrap failed. Trying again...', 0);
            window.setTimeout(function () {
                bootstrap();
            }, 1000);
        }
    }

    log('Bootstrap...', 0);
    bootstrap();
})();