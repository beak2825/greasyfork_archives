 // ==UserScript==
// @name        WME Common Beta
// @description Try to take over the world!!!
// @namespace   
// @version     1.2
// @author      WazeUSA
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/.*$/
// @downloadURL https://update.greasyfork.org/scripts/28753/WME%20Common%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/28753/WME%20Common%20Beta.meta.js
// ==/UserScript==
 
MWAAHAAHAA
 var WMECommon = WMECommon || {};
    
    alert('loaded 0.3');
    WMECommon.EnhancedGoogleLinks = {};
    WMECommon.EnhancedGoogleLinks._googleLinkHash = {};
    WMECommon.EnhancedGoogleLinks.run = function () {
     alert('running');
        // MutationObserver will be notified when Google place ID divs are added, then update them to be hyperlinks.
        debugger;
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // Mutation is a NodeList and doesn't support forEach like an array
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var addedNode = mutation.addedNodes[i];
                    // Only fire up if it's a node
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        if(addedNode.querySelector('div .placeId')) {
                            var placeLinkDivs = $(addedNode).find('.placeId');
                            for(i=0; i<placeLinkDivs.length; i++) {
                                var placeLinkDiv = placeLinkDivs[i];
                                var placeLinkId = placeLinkDiv.innerHTML;
                                if (_googleLinkHash.hasOwnProperty(placeLinkId)) {
                                    placeLinkDiv.innerHTML = _googleLinkHash[placeLinkId];
                                }
                            }

                        }
                    }
                }
            });
        });
        observer.observe(document.getElementById('edit-panel'), { childList: true, subtree: true });
        $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
            try {
                if (originalOptions.type === "GET") {
                    if (originalOptions.url === "/maps/api/place/autocomplete/json" && !originalOptions.data.hasOwnProperty("location")) {
                        options.data = $.param($.extend(originalOptions.data, {
                            location: W.map.getCenter().transform(W.map.getProjection(), W.map.displayProjection).lat + "," + W.map.getCenter().transform(W.map.getProjection(), W.map.displayProjection).lon,
                            radius: 3200
                        }));
                    }
                }
            } catch(e) {}
        });
        $(document).ajaxSuccess(function(event, jqXHR, ajaxOptions, data) {
            try {
                var ix;
                if (ajaxOptions && ajaxOptions.hasOwnProperty("url")) {
                    if (ajaxOptions.url.startsWith("/maps/api/place/details/json")) {
                        if (data && data.hasOwnProperty("status") && data.status === "OK") {
                            if (data.hasOwnProperty("result") && data.result.hasOwnProperty("url") && data.result.hasOwnProperty("place_id")) {
                                var gpids = document.getElementsByClassName("placeId");
                                for (ix = 0; ix < gpids.length; ix++) {
                                    if (data.result.place_id === gpids[ix].innerHTML) {
                                        var html = "<a href='" + data.result.url + "' target='_wmegpid'>" + data.result.place_id + "</a>";
                                        _googleLinkHash[data.result.place_id] = html;
                                        gpids[ix].innerHTML = html;
                                    }
                                }
                            }
                        }
                    }
                    if (ajaxOptions.url.startsWith("/maps/api/place/autocomplete/json")) {
                        var uuids = document.getElementsByClassName("uuid");
                        for (ix = 0; ix < uuids.length; ix++) {
                            if (uuids[ix].className === "uuid") {
                                events = $._data(uuids[ix], "events");
                                if (events && events.hasOwnProperty("change") && events.change.length === 1) {
                                    $(uuids[ix]).change(function(event) {
                                        if (event && event.hasOwnProperty("val")) {
                                            $.get(W.Config.places_api.url.details, {placeid: event.val, key: W.Config.places_api.key});
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            } catch(e) {}
        });
    }
