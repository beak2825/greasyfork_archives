// ==UserScript==
// @name         Vimeo Download Button
// @namespace    larochematthias
// @version      1.2.1
// @description  Adds a download button to the HTML5 Vimeo Player (embeded or not)
// @author       Matthias Laroche
// @license https://creativecommons.org/licenses/by/4.0/
// @include      *//vimeo.com/*
// @include      *//player.vimeo.com/video/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29728/Vimeo%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/29728/Vimeo%20Download%20Button.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // SVG icon of the download button
    // Icon made by Elegant Themes from www.flaticon.com
    // Icon pack: http://www.flaticon.com/packs/elegant-font
    // Published by: https://www.elegantthemes.com/
    // License: https://creativecommons.org/licenses/by/3.0/
    var downloadIcon =
        '<svg viewBox="0 0 455.992 455.992" width="14px" height="14px">' +
        '<polygon class="fill" points="227.996,334.394 379.993,182.397 288.795,182.397 288.795,0 167.197,0 167.744,182.397 75.999,182.397" />' +
        '<polygon class="fill" points="349.594,334.394 349.594,395.193 106.398,395.193 106.398,334.394 45.599,334.394 45.599,395.193 45.599,455.992 410.393,455.992 410.393,334.394" />' +
        '</svg>';

    function updateButton(button, link) {
        if (!link) {
            button.div.style.visibility = 'hidden';
            return;
        }
        button.a.setAttribute('href', link.url);
        button.a.setAttribute('download', (link.title || '').replace(/[\x00-\x1F"*\/:<>?\\|]+/g, ''));
        button.a.setAttribute('title', 'Download ' + link.quality + "\n" + link.title);
        button.div.style.visibility = 'visible';
        button.div.style.display = 'block';
    }

    // Create HTML div element to add to the controls bar
    function createButton(document) {
        var div = document.createElement('div');
        div.style.marginLeft = '7px';
        div.style.marginTop = '-1px';
        div.style.display = 'none';
        div.setAttribute('class', 'download');
        var a = document.createElement('a');
        a.setAttribute('target', '_blank');
        a.setAttribute('aria-label', 'Download');
        a.setAttribute('referrerpolicy', 'origin');
        a.style.outlineStyle = 'none';
        a.innerHTML = downloadIcon;
        div.appendChild(a);
        return {
            div: div,
            a: a
        };
    }

    // Syntactic sugar for getting a single node with XPath
    function getSingleNode(node, xpath) {
        var doc = node.ownerDocument || node;
        return doc.evaluate(xpath, node, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    // Syntactic sugar for XMLHttpRequest
    function ajax(url, postData, onSuccess, onError) {
        var xhr = new XMLHttpRequest();
        xhr.open(postData ? 'POST' : 'GET', url);
        if (onSuccess || onError) {
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return;
                if (xhr.status == 200 && onSuccess) onSuccess(xhr);
                if (xhr.status != 200 && onError) onError(xhr);
            };
        }
        xhr.send(postData || null);
    }


    // Get url, quality and title of the video from the config of the player
    // and then update the download button accordingly
    function updateVideoLink(button, config) {
        if (config && typeof(config) === 'object') {
            var title = config && config.video && config.video.title || '';
            var progressive = config && config.request && config.request.files && config.request.files.progressive;
            if (progressive) {
                var file = progressive.reduce(function(a, b) {
                    return (b.width || 0) > a.width ? b : a;
                }, {
                    width: -1
                });
                if (file.url) {
                    updateButton(button, {
                        url: file.url,
                        title: title,
                        quality: file.quality
                    });
                    return;
                }
            }
        }
        updateButton(button, null);
        if (config && typeof(config) === 'string') {
            // config is an URL -> download with ajax and update again with the result
            ajax(config, null, function(xhr) {
                updateVideoLink(button, JSON.parse(xhr.responseText));
            });
        }
    }

    // Called by the MutationObserver, keep adding the download button to the DOM if it disappears
    function showVideoLink(button, controls) {
        var playBar = getSingleNode(controls, "//div[contains(@class, 'play-bar')]");
        if (playBar && (button.div.parentNode != playBar || button.div.nextSibling)) {
            playBar.appendChild(button.div);
        }
    }

    // Create a link and update it with the config of the player,
    // set a MutationObserver to add the download button when the controls are ready
    // and wrap the player to intercept the loadVideo method and update the link
    function wrapVimeoPlayer(player, container, config) {
        if (!player || !container) return player;
        var controls = getSingleNode(container, "//div[@class = 'controls-wrapper']//div[@class = 'controls']");
        if (!controls) return player;
        var button = createButton(container.ownerDocument);
        var observer = new MutationObserver(function() {
            showVideoLink(button, controls);
        });
        observer.observe(controls, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
        updateVideoLink(button, config);
        showVideoLink(button, controls);
        return Object.create(player, {
            ready: {
                writable: true,
                enumerable: true,
                configurable: true,
                value: player.ready
            },
            loadVideo: {
                enumerable: true,
                configurable: false,
                get: function() {
                    return player.loadVideo && function() {
                        updateVideoLink(button, arguments && arguments[0]);
                        return player.loadVideo.apply(this, arguments);
                    };
                }
            }
        });
    }

    // Wraps a property with a callback that convert the value each time the property is set
    function wrapProperty(o, propName, callback) {
        if (o.hasOwnProperty(propName)) {
            console.log('Vimeo Download Button : Unable to wrap property ' + propName + '.');
            return;
        }
        var value;
        Object.defineProperty(o, propName, {
            get: function() {
                return value;
            },
            set: function(newValue) {
                value = callback(newValue);
            },
            enumerable: true,
            configurable: false
        });
        console.log('Vimeo Download Button : Property ' + propName + ' wrapped successfully.');
    }

    // Wrap the VimeoPlayer constructor and intercepts the arguments needed to install the download button
    wrapProperty(window, 'VimeoPlayer', function(ctr) {
        return ctr && function() {
            var container = arguments && arguments[0];
            var config = arguments && arguments[1];
            var player = ctr.apply(this, arguments);
            return wrapVimeoPlayer(player, container, config);
        };
    });
})();