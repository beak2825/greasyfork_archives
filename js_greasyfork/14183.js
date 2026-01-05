// ==UserScript==
// @name            Endless Gamersky
// @description     Load more results automatically and endlessly.
// @author          fluffy
// @oujs:author     fluffy
// @namespace       kitty_the_lost@sina.com
// @homepageURL     https://greasyfork.org/en/scripts/14183-endless-gamersky
// @supportURL
// @icon
// @include         http://*.gamersky.com/*
// @include         https://*.gamersky.com/*
// @run-at          document-start
// @grant           GM_xmlhttpRequest
// @version         0.1.4
// @downloadURL https://update.greasyfork.org/scripts/14183/Endless%20Gamersky.user.js
// @updateURL https://update.greasyfork.org/scripts/14183/Endless%20Gamersky.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function () {

    // NOTE: Options
    var request_pct = 10; // percentage of window height left on document to request next page, value must be between 0-1
    var event_type = "scroll"; // or "wheel"

    var Mid2L_ctt = document.querySelector(".Mid2L_con")?document.querySelector(".Mid2L_con"):
                    document.querySelector(".MidLcon")?document.querySelector(".MidLcon"):
                    document.querySelector(".MidL_con");
    var old_scrollY = 0;
    var scroll_events = 0;
    var next_link = null;
    var cols = [];
    var stop = false;

    window.addEventListener(event_type, onScroll, false);
    window.addEventListener("beforeunload", function () {
        window.scrollTo(0, 0);
    }, false);

    function requestNextPage(link) {
        console.log("request next");
        console.log(link);
        GM_xmlhttpRequest({
            method: "GET",
            url: link,
            onload: function (response) {
                var holder = document.createElement("div");
                holder.innerHTML = response.responseText;

				var my_list = document.querySelectorAll(".page_css a");
				var my_elem = my_list[my_list.length - 1];
                if (my_elem.innerHTML!="下一页" &&
                    my_list[my_list.length - 2].innerHTML!="下一页") {
                    stop = true;
                }
                if (my_elem.innerHTML=="下一页") {
					next_link = my_elem.href;
                } else if (my_list[my_list.length - 2].innerHTML=="下一页") {
					next_link = my_list[my_list.length - 2].href;
                }
                var next_col = document.createElement("div");
                next_col.className = "EG_col";
				if (stop) return;
                next_col.appendChild(holder.querySelector(".Mid2L_con")?holder.querySelector(".Mid2L_con"):
                                     holder.querySelector(".MidLcon")?holder.querySelector(".MidLcon"):
                                     holder.querySelector(".MidL_con"));

                cols.push(next_col);
                console.log("Page no: " + cols.length);
                next_col.id = next_col.className + "_" + (cols.length - 1); // NOTE: add unique id for every new col

                if (!Mid2L_ctt || cols.length === 1) {// NOTE: needs to be rechecked on a state reset too, and late insertation of element on google instant
                    Mid2L_ctt = document.querySelector(".Mid2L_con")?document.querySelector(".Mid2L_con"):
                                document.querySelector(".MidLcon")?document.querySelector(".MidLcon"):
                                document.querySelector(".MidL_con");
                }
                Mid2L_ctt.appendChild(next_col);
                window.addEventListener(event_type, onScroll, false);
            }
        });

    }

    function onScroll(e) {
        if (stop) {
            window.removeEventListener(event_type, onScroll, false);
            return;
        }
        var y = window.scrollY;
        var delta = e.deltaY || y - old_scrollY; // NOTE: e.deltaY for "wheel" event
        if (delta > 0 && (window.innerHeight + y) >= (document.body.clientHeight - (window.innerHeight * request_pct))) {
            console.log("scroll end");
            window.removeEventListener(event_type, onScroll, false);

            try {
				var my_list = document.querySelectorAll(".page_css a");
				var my_elem = my_list[my_list.length - 1];
                if (my_elem.innerHTML=="下一页") {
					next_link = my_elem.href;
                } else if (my_list[my_list.length - 2].innerHTML=="下一页") {
					next_link = my_list[my_list.length - 2].href;
                } else {
					stop=true;
				}
                requestNextPage(next_link);
            } catch (err) {
                console.error(err.name + ": " + err.message);
                // NOTE: recovery unnecessary, input event handles it with reset on new search
            }
        }
        old_scrollY = y;
        scroll_events += 1;
    }

    console.log("eGamersky.js initialized");
});
console.log("eGamersky.js loaded");