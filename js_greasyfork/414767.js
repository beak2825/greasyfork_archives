// ==UserScript==
// @name         Swipe Right Android Lasso Bookmarklet
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @version      1
// @description  Swipe Right on Android to Active Lasso Bookmarklet
// @match        *://*/*
// @author       Davi Cardoso
// @grant        none
// @namespace https://greasyfork.org/users/698317
// @downloadURL https://update.greasyfork.org/scripts/414767/Swipe%20Right%20Android%20Lasso%20Bookmarklet.user.js
// @updateURL https://update.greasyfork.org/scripts/414767/Swipe%20Right%20Android%20Lasso%20Bookmarklet.meta.js
// ==/UserScript==

/*!
 * swiped-events.js - v@version@
 * Pure JavaScript swipe events
 * https://github.com/john-doherty/swiped-events
 * @inspiration https://stackoverflow.com/questions/16348031/disable-scrolling-when-touch-moving-certain-element
 * @author John Doherty <www.johndoherty.info>
 * @license MIT
 */
(function (window, document) {

    'use strict';

    // patch CustomEvent to allow constructor creation (IE/Chrome)
    if (typeof window.CustomEvent !== 'function') {

        window.CustomEvent = function (event, params) {

            params = params || { bubbles: false, cancelable: false, detail: undefined };

            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        };

        window.CustomEvent.prototype = window.Event.prototype;
    }

    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);
    document.addEventListener('touchend', handleTouchEnd, false);

    var xDown = null;
    var yDown = null;
    var xDiff = null;
    var yDiff = null;
    var timeDown = null;
    var startEl = null;

    /**
     * Fires swiped event if swipe detected on touchend
     * @param {object} e - browser event object
     * @returns {void}
     */
    function handleTouchEnd(e) {

        // if the user released on a different target, cancel!
        if (startEl !== e.target) return;

        var swipeThreshold = parseInt(getNearestAttribute(startEl, 'data-swipe-threshold', '200'), 10); // default 20px
        var swipeTimeout = parseInt(getNearestAttribute(startEl, 'data-swipe-timeout', '500'), 10);    // default 500ms
        var timeDiff = Date.now() - timeDown;
        var eventType = '';
        var changedTouches = e.changedTouches || e.touches || [];

        if (Math.abs(xDiff) > Math.abs(yDiff)) { // most significant
            if (Math.abs(xDiff) > swipeThreshold && timeDiff < swipeTimeout) {
                if (xDiff > 0) {
                    eventType = 'swiped-left';
                }
                else {
                    eventType = 'swiped-right';
                }
            }
        }
        else if (Math.abs(yDiff) > swipeThreshold && timeDiff < swipeTimeout) {
            if (yDiff > 0) {
                eventType = 'swiped-up';
            }
            else {
                eventType = 'swiped-down';
            }
        }

        if (eventType !== '') {

            var eventData = {
                dir: eventType.replace(/swiped-/, ''),
                xStart: parseInt(xDown, 10),
                xEnd: parseInt((changedTouches[0] || {}).clientX || -1, 10),
                yStart: parseInt(yDown, 10),
                yEnd: parseInt((changedTouches[0] || {}).clientY || -1, 10)
            };

            // fire `swiped` event event on the element that started the swipe
            startEl.dispatchEvent(new CustomEvent('swiped', { bubbles: true, cancelable: true, detail: eventData }));

            // fire `swiped-dir` event on the element that started the swipe
            startEl.dispatchEvent(new CustomEvent(eventType, { bubbles: true, cancelable: true, detail: eventData }));
        }

        // reset values
        xDown = null;
        yDown = null;
        timeDown = null;
    }

    /**
     * Records current location on touchstart event
     * @param {object} e - browser event object
     * @returns {void}
     */
    function handleTouchStart(e) {

        // if the element has data-swipe-ignore="true" we stop listening for swipe events
        if (e.target.getAttribute('data-swipe-ignore') === 'true') return;

        startEl = e.target;

        timeDown = Date.now();
        xDown = e.touches[0].clientX;
        yDown = e.touches[0].clientY;
        xDiff = 0;
        yDiff = 0;
    }

    /**
     * Records location diff in px on touchmove event
     * @param {object} e - browser event object
     * @returns {void}
     */
    function handleTouchMove(e) {

        if (!xDown || !yDown) return;

        var xUp = e.touches[0].clientX;
        var yUp = e.touches[0].clientY;

        xDiff = xDown - xUp;
        yDiff = yDown - yUp;
    }

    /**
     * Gets attribute off HTML element or nearest parent
     * @param {object} el - HTML element to retrieve attribute from
     * @param {string} attributeName - name of the attribute
     * @param {any} defaultValue - default value to return if no match found
     * @returns {any} attribute value or defaultValue
     */
    function getNearestAttribute(el, attributeName, defaultValue) {

        // walk up the dom tree looking for data-action and data-trigger
        while (el && el !== document.documentElement) {

            var attributeValue = el.getAttribute(attributeName);

            if (attributeValue) {
                return attributeValue;
            }

            el = el.parentNode;
        }

        return defaultValue;
    }

}(window, document));

document.addEventListener('swiped-right', function(e) {sessionStorage.removeItem('openNewWindowForBookmarkLateItem'); var request = false; var isHTMLContent = true; var description = ''; var title = ''; var metaRobotContent = ''; var isRobotsMetaTagMatch = false; var isRobotsNoIndexMatch = false; try { checkMimeType(window.location.href); } catch (e) { request = false; } if (request == false) { console.log('OOPS! check content type request timeout.'); } var urlPrefix = '//www.lasso.net/go/'; var metas = document.getElementsByTagName('meta'); for (var i = 0; i < metas.length; i++) { if (metas[i].getAttribute('name') && metas[i].getAttribute('name').toLowerCase() == 'robots') { metaRobotContent = metas[i].getAttribute('content'); break; } } var array = metaRobotContent.split(','); for (var i = 0; i < array.length; i++) { if (array[i].toLowerCase().indexOf('none') > -1) isRobotsMetaTagMatch = true; if (array[i].toLowerCase().indexOf('noindex') > -1) isRobotsNoIndexMatch = true; } if (isRobotsMetaTagMatch || isRobotsNoIndexMatch) { var lassoURL = 'https:' + urlPrefix + 'lasso/view-item?url=' + encodeURIComponent(document.location) + '&title=&desc=&login=true'; } else { for (var i = 0; i < metas.length; i++) { if (metas[i].getAttribute('name') && metas[i].getAttribute('name').toLowerCase() == 'description') { description = metas[i].getAttribute('content'); break; } if (!description && metas[i].getAttribute('property') && metas[i].getAttribute('property').toLowerCase() == 'og:description') { description = metas[i].getAttribute('content'); break; } if (!description && metas[i].getAttribute('property') && metas[i].getAttribute('property').toLowerCase() == 'dc:description') { description = metas[i].getAttribute('content'); break; } } var lassoURL = 'https:' + urlPrefix + 'lasso/add-item?url=' + encodeURIComponent(document.location) + '&title=' + encodeURIComponent(document.title) + '&desc=' + encodeURIComponent(description) + '&login=true'; } document.addEventListener('securitypolicyviolation', function(e) { openNewWindow(lassoURL); }, { once: true }); try { var iframe = document.createElement('iframe'); iframe.setAttribute('id', 'vflIF'); iframe.setAttribute('src', lassoURL); iframe.setAttribute('width', '100%'); iframe.setAttribute('height', '243px'); iframe.setAttribute('align', 'top'); iframe.setAttribute('style', 'margin: 0'); iframe.setAttribute('frameBorder', '0'); iframe.setAttribute('scrolling', 'yes'); _lasso_script = document.createElement('SCRIPT'); _lasso_script.setAttribute('type', 'text/javascript'); _lasso_script.setAttribute('async', 'true'); _lasso_script.setAttribute('id', 'vflHeadScript'); _lasso_script.setAttribute('src', 'https://www.lasso.net/go//js/vflHeadScript.js?e=1000'); if (isHTMLContent && isHTMLContent == true) { if (_lasso_script.readyState) { _lasso_script.onreadystatechange = function() { if (_lasso_script.readyState == 'loaded' || _lasso_script.readyState == 'complete') { _lasso_script.onreadystatechange = null; checkVflLoad(); } }; } else { _lasso_script.onload = function() { checkVflLoad(); }; } document.getElementsByTagName('head')[0].appendChild(_lasso_script); function checkVflLoad() { if (typeof removeLasso === 'undefined') { alert('Failed to load the Lasso in this website'); } } function removeLasso() { try { document.getElementById('vflDiv').remove(); } catch (e) {} } } else { openNewWindow(lassoURL); } } catch (e) { openNewWindow(lassoURL); } function checkMimeType(theURL) { if (document.contentType != null) { request = true; if (document.contentType.indexOf('text/html') == -1) { isHTMLContent = false; } } else { if (window.XMLHttpRequest) { request = new XMLHttpRequest(); } else { request = new ActiveXObject('Microsoft.XMLHTTP'); } var isHeadSuccess = false; try { request.open('HEAD', document.location, false); request.send(null); if (request.getResponseHeader('content-type') != null) { isHeadSuccess = true; if (request.getResponseHeader('content-type').indexOf('text/html') == -1) isHTMLContent = false; else isHTMLContent = true; } } catch (e) {} if (!isHeadSuccess) { var actionURL = 'https://www.lasso.net/go/api?action=mime-type-from-URL'; var param = 'url=' + theURL; if (window.XMLHttpRequest) { request = new XMLHttpRequest(); } else { request = new ActiveXObject('Microsoft.XMLHTTP'); } request.open('POST', actionURL, false); request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); request.setRequestHeader('Accept', 'application/json'); request.send(param); content = request.responseText; var res = JSON.parse(content); var status = res.response.success; if (status && status == true) { var contentType = res.response.data.contentType; console.log(contentType); if (contentType && contentType.indexOf('text/html') == -1) isHTMLContent = false; } else { console.log('OOPS! something went wrong.') } } } } function openNewWindow(lassoURL) { newwindow = window.open(lassoURL + '&openNewWindow=true', 'fullscreen=yes', '100%'); if (newwindow) { var percentageWidth = screen.width / 100; newwindow.moveTo(percentageWidth * 13, 0); var width = screen.width - (screen.width / 100) * 26; newwindow.resizeTo(width, 466); } } })();