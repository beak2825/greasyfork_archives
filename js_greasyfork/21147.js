// ==UserScript==
// @name        Games Done Quick Schedule Enhancer
// @namespace   FichteFoll
// @author      FichteFoll
// @description Highlights currently active Event on GDQ schedule and adds an anchor. Also non-AM/PM timestamps.
// @include     https://gamesdonequick.com/schedule*
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21147/Games%20Done%20Quick%20Schedule%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/21147/Games%20Done%20Quick%20Schedule%20Enhancer.meta.js
// ==/UserScript==

/* jshint esversion: 6, strict: true */
/* globals moment */

$(function() {
    'use strict';
    const DATE_FORMAT = "dddd, MMMM Do";
    const TIME_FORMAT = "LT";

    const ACTIVE_CSS = {"background-color": "lightcoral", "transition": "400ms"};
    const RESET_CSS = {"background-color": ""};


    // Parse times (in combination with split-days)
    // and add them as .data('time').
    // Also better display format.
    let lastDateString = null;
    $("tbody .start-time, tbody .day-split").each(function (index) {
        const $this = $(this);
        if (this.nodeName == 'TR') {
            // tr.day-split
            lastDateString = $this.find("td").html();
        }
        else {
            if (!lastDateString) {
                // TODO if js disabled
                console.log("no date for this element; maybe js disabled?");
                console.log(this);
                return;
            }

            // parse time
            const timeString = $this.html();
            const time = moment(`${lastDateString} ${timeString}`, `${DATE_FORMAT} ${TIME_FORMAT}`);
            // console.log(time);
            $this.data('time', time.format()); // and store it

            // write better format
            $this.html(time.format("HH:mm"));
        }
    });


    let $currentEvent = null;
    let $currentAnchor = null;

    /**
     * Update currently active event.
     *
     * @return
     */
    function onTick() {
        console.log("checking for event update");
        const now = moment();
        const elements = $("tbody .start-time");

        for (let i = 0; i + 1 < elements.length; ++i) {
            const $elem = $(elements[i]);
            const $newElem = $(elements[i + 1]);

            if (moment($elem.data('time')) < now && now < moment($newElem.data('time'))) {
                const $newCurrentEvent = $elem.parent();
                if ($currentEvent != $newCurrentEvent) {
                    if ($currentEvent) {
                        $currentEvent.css(RESET_CSS);
                        $currentEvent.next(".second-row").css(RESET_CSS);
                        $currentAnchor.detach();
                    }
                    $currentEvent = $newCurrentEvent;
                    $currentEvent.css(ACTIVE_CSS);
                    $currentEvent.next(".second-row").css(ACTIVE_CSS);
                    $currentAnchor = $('<a name="current" />').insertBefore($currentEvent);
                    console.log("new active event");
                    console.log($newCurrentEvent);
                    return;
                }
            }
        }

        // nothing found, GDQ event is over
        $currentEvent.removeClass("currentEvent");
        console.log("no active event found");
        $currentEvent = null;
    }

    // do it every minute
    setInterval(onTick, 60 * 1000);
    onTick();


    /* // doesn't do anything useful over the default
    function onHashChange() {
        if ($currentEvent && location.hash == "#current") {
            let offset = $currentEvent.offset().top;
            offset -= window.innerHeight * 0.4;
            if (Math.abs(offset - window.screenY) > window.innerHeight) {
                console.log("scrolling...");
                window.scrollTo(0, offset);
                // $('html, body').animate({
                //     scrollTop: offset,
                // });
            }
            // not reliable:
            // $currentEvent[0].scrollIntoView({block: 'end', behavior: 'smooth'}); // gecko
            // $currentEvent[0].scrollIntoViewIfNeeded(false); // webkit
        }
    }
    // onHashChange();
    // doesn't do anything; browser overrides
    // window.addEventListener('hashchange', onHashChange);
    */

    // add link to "#current" anchor
    const $button = $('<a class="well extra-spacing" style="display: block; margin: 0px 0px 20px;" href="#current">Jump to current event</a>');
    $("h4").after($button);
});
