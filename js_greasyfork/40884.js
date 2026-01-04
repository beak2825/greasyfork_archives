// ==UserScript==
// @name         Plurk no redirector
// @namespace    http://mmis1000.me/
// @version      0.1.10
// @description  try to take over the world!
// @author       You
// @match        https://www.plurk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40884/Plurk%20no%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/40884/Plurk%20no%20redirector.meta.js
// ==/UserScript==

/* global jQuery, getBody, Media */
jQuery(function() {
    // window.Media = null;

    function shouldBeExclude(el) {
        function checkStop(el) {
            return jQuery(el).is('a.ex_link') &&
                !jQuery(el).is('.pictureservices') &&
                !jQuery(el).is('.iframeembed') &&
                !jQuery(el).is('.plink') &&
                !(/^https?:\/\/[^\.]+\.plurk\.com\//).test(el.attr('href') + '');
        }

        let currentEl = jQuery(el);
        let shouldStop = checkStop(currentEl)

        while (currentEl.get(0) && !shouldStop) {
            currentEl = currentEl.parent();
            shouldStop = shouldStop || checkStop(currentEl);
        }

        console.log('check', shouldStop, shouldStop ? currentEl : el);

        if (shouldStop) {
            currentEl.attr('rel', 'noreferrer noopener')
        }

        return shouldStop;
    }

    var $body = jQuery('#layout_body');
    $body.on('click', '#layout_content a.ex_link', function(el){el.target && el.target.setAttribute('rel', 'noreferrer noopener')})

    jQuery._data(jQuery('#layout_body').get(0), 'events').click
        .map((o)=>[o.handler.toString(), o])
        // .filter((arr)=>(/hasClass\("ex_link"\)/).test(arr[0]) || (/_hideLink/).test(arr[0]))
        .forEach(function ([code, layoutBodyClickData]) {
        jQuery('#layout_body').off('click', layoutBodyClickData.handler);
        const handler = function (ev) {
            if (shouldBeExclude(ev.target)) {
                console.log('stop go plurk')
                return;
            } else {
                return layoutBodyClickData.handler.call(this, ev);
            }
        }

        if (layoutBodyClickData.selector) {
            jQuery('#layout_body').on('click', layoutBodyClickData.selector, handler)
        } else {
            jQuery('#layout_body').on('click', handler)
        }
    })

    try {
        const verticalTimelineClickData = jQuery._data(jQuery('#vert_timeline').get(0), 'events').click
        .map((o)=>[o.handler.toString(), o])
        .filter((arr)=>(/window\.open\(this\.href\)/).test(arr[0]))[0][1]

        jQuery('#vert_timeline').off('click', verticalTimelineClickData.handler)

        jQuery._data(jQuery('#vert_timeline').get(0), 'events').click
            .map((o)=>[o.handler.toString(), o])
            // .filter((arr)=>(/_hideLink/).test(arr[0]))
            .forEach(function ([code, layoutBodyClickData]) {
            jQuery('#vert_timeline').off('click', layoutBodyClickData.handler);
            const handler = function (ev) {
                if (shouldBeExclude(ev.target)) {
                    console.log('stop go plurk', ev.target)
                    return;
                } else {
                    return layoutBodyClickData.handler.call(this, ev);
                }
            }

            if (layoutBodyClickData.selector) {
                jQuery('#vert_timeline').on('click', layoutBodyClickData.selector, handler)
            } else {
                jQuery('#vert_timeline').on('click', handler)
            }
        })
    } catch (e) {
        // '#vert_timeline' does not exist
    }
    console.log('loaded')
});