// ==UserScript==
// @name         Jupyter Scroll
// @namespace    http://guoquan.org/
// @version      0.3
// @description  Jupyter Notebook is a web application that allows you to create and run live code online. This script automatically scroll down the output scroll in jupyter to show the final result. This is useful when long pages of output are generated but you only want to track the latest one.
// @author       Guo Quan <guoquanscu@gmail.com>
// @homepage     https://github.com/guoquan/jupyter-scroll
// @include      /^https?://.*/notebook/
// @exclude
// @match
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15875/Jupyter%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/15875/Jupyter%20Scroll.meta.js
// ==/UserScript==

var __jupyter_scroll__ = {};
//---------------------------------
// Configuration
//---------------------------------
// Print debug information
__jupyter_scroll__.debug = false;

// Time duration for scrolling animation.
//     Set to 0 or negetive value to disable animation
__jupyter_scroll__.speed = 500;

// Exponent average rate used for estimating next trigger time
//     Set to value in (0, 1)
//     The greater it is, the lesser it looks back in the history
__jupyter_scroll__.gamma = 0.5;

// Time to trigger when estimated trigger is closer than `_.speed`
//     Set to a positive factor in (0, 1)
//     The smaller it is, the earlier it finish the next scroll
__jupyter_scroll__.early = 0.5;

// Easing function to be used during animation, if there is
//     Set to a string {'linear', 'swing'}
//     These are support defaultly in jquery.
//     Otherwise implement or include other easing functions.
//     Set to `linear` with `_.early=1` and large `_.speed` will give linear move of the output
__jupyter_scroll__.earing = 'swing';
//---------------------------------

$(function(){
    // strict mode
    'use strict';
    var _ = __jupyter_scroll__;

    if (_.debug) console.debug("setup script running");

    var last = new Date().getTime();
    var mduration = 0;
    var num_child = 0;
    var last_child_height = 0;
    var last_scroll_to = 0;

    // use the "DOMSubtreeModified" event to track the scroll box
    //$("document").off("DOMSubtreeModified")
    // bind the event to document so it can be valid for nodes loaded later
    $(document).on("DOMSubtreeModified", "div.output_scroll", function() {
        if (_.debug) console.debug("Change event triggered.");
        var start;
        if (_.debug) start = new Date().getTime();

        var scroll = $(this);
        var children = scroll.children();

        if (children.length === 0) {
            // if no children, nothing is printed and we shall sit tight
            if (_.debug) console.debug("Nothing is printed.");
            return;
        }

        var last_child = children.last();
        if (num_child === children.length && last_child_height === last_child.height()) {
            // the event will be triggered multiple times but will not change the output
            // detect and skip these false trigger
            if (_.debug) console.debug("The view is not changed.");
            return;
        }

        // update for the new view
        num_child = children.length;
        last_child_height = last_child.height();

        if (_.debug) {
            console.debug("current scroll top: " + scroll.scrollTop());
            console.debug("scroll height: " + scroll.height());
            console.debug("number of children: " + children.length);
            if (children.length > 0) {
                console.debug("last child position: " + last_child.position().top);
                console.debug("last child height: " + last_child.height());
            }
        }

        // children are the those div.output_area
        // 3 types:
        //     1) stdout stream (has a ".output_subarea.output_text" child, with ".output_stream.output_stdout"),
        //     2) stderr stream (has a ".output_subarea.output_text" child, with ".output_stream.output_stderr"), and
        //     3) error (different from stderr! has a ".output_subarea.output_text" child, with ".output_error")
        // logging uses stderr
        // if different types of output are used alternatively, many areas are generated
        // if error come out (including KeyboardInterrupt), the process will stop and no more area will be added
        // my strategy is:
        //     scroll to the very bottom if no error (only stdout and stderr),
        //     and to between error and the 2nd to the last area else-wise

        // prepare for the calculation
        var scroll_to = 0;
        // finish all animations (to get every position up-to-date)
        scroll.finish();

        if (last_child.children(".output_subarea.output_text").hasClass("output_error")) {
            // error (or anything more than this) is out
            // scroll to between the std out and the error
            // do the calculation
            scroll_to = scroll.scrollTop() + last_child.position().top - 0.5 * scroll.height();
        } else {
            // no error, but logging and std out
            // just to to end of std out
            scroll_to = scroll.scrollTop() + last_child.position().top + last_child.height() - scroll.height();
        }
        if (_.debug) console.debug("scroll_to: ", scroll_to);

        if (scroll_to > 0) {
            // estimate trigger time
            var current = new Date().getTime();
            var duration = current - last;
            last = current;
            // mean duration, to predict next trigger and finish the animation before that
            if (mduration === 0) {
                mduration = duration;
            } else {
                mduration = _.gamma * duration + (1 - _.gamma) * mduration;
            }

            if (_.debug) {
                console.debug("current trigger time: " + current);
                console.debug("duration between last two triggers: " + duration);
                console.debug("mean duration between two triggers: " + mduration);
            }

            if (_.speed > 0) {
                // do a little animation that looks more smooth
                var dure = Math.min(_.speed, mduration*_.early);
                scroll.finish().scrollTop(last_scroll_to).animate({scrollTop:scroll_to}, dure, _.earing);
                if (_.debug) console.debug("scroll duration: " + dure);
            } else {
                scroll.finish().scrollTop(scroll_to);
            }

            last_scroll_to = scroll_to;
            if (_.debug) console.debug("time cost: " + (new Date().getTime() - start));
        } else {
            if (_.debug) console.debug("Wrong scroll target. It is false trigger of the event.");
        }
    });

    if (_.debug) console.debug("setup script finished");
});
