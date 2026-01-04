// ==UserScript==
// @name         YouTube Title Fixer
// @description  Fixes a severely broken UI flaw in YouTube by removing the annoying and unnecessary "(X)" from page titles. Seriously, I have 15 tabs in a row showing "(1) ...", obscuring the actual page titles. This is just stupid.
// @author       Braden Best
// @namespace    bradenscode.nogit
// @version      1.0.3
// @match        *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/33184/YouTube%20Title%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/33184/YouTube%20Title%20Fixer.meta.js
// ==/UserScript==

/*
 * A debugging and testing interface is provided by a constant named
 * `youtube_title_fixer`. The interface can be seen near the end of the
 * code, in the frozen object.
 *
 * By default, this interface is inaccessible. The interface can be made
 * visible to the global scope by enabling `expose_interface`.
 *
 * If you plan to use the interface for anything other than testing,
 * then you may be missing the point.
 */

(function(){
    const expose_interface = false;

    const youtube_title_fixer = (function(){
        const pattern = /\(\d+\)\s+/;

        let loop;
        let delay = 1000;

        function fixit(){
            if(document.title.match(pattern) !== null)
                document.title = document.title.replace(pattern, "");
        }

        function kill(){
            clearInterval(loop);
        }

        function init(){
            loop = setInterval(fixit, delay);
        }

        function set_delay(new_delay){
            delay = new_delay;
        }

        return Object.freeze({
            fixit,
            kill,
            init,
            set_delay
        });
    }());

    youtube_title_fixer.init();

    if(expose_interface)
        window.youtube_title_fixer = youtube_title_fixer;
}());