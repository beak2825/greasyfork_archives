// ==UserScript==
// @name            Endless Gamersky
// @description     Load more results automatically and endlessly. (Performance Optimized)
// @author          fluffy
// @namespace       kitty_the_lost@sina.com
// @homepageURL     https://greasyfork.org/en/scripts/14183-endless-gamersky
// @include         http://*.gamersky.com/*
// @include         https://*.gamersky.com/*
// @run-at          document-start
// @grant           GM_xmlhttpRequest
// @version         0.1.5
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
    var is_loading = false; // Prevents duplicate requests during the 100ms window

    // --- Performance Enhancement: Throttling ---
    var throttleTimeout = null;
    window.addEventListener(event_type, function(e) {
        if (!throttleTimeout) {
            throttleTimeout = setTimeout(function() {
                onScroll(e);
                throttleTimeout = null;
            }, 100); // Wait 100ms between checks
        }
    }, false);

    window.addEventListener("beforeunload", function () {
        window.scrollTo(0, 0);
    }, false);

    function requestNextPage(link) {
        if (is_loading) return;
        is_loading = true;

        console.log("request next");
        console.log(link);
        GM_xmlhttpRequest({
            method: "GET",
            url: link,
            onload: function (response) {
                var holder = document.createElement("div");
                holder.innerHTML = response.responseText;

                var my_list = holder.querySelectorAll(".page_css a"); // Check the NEW page's list
                if (my_list.length > 0) {
                    var my_elem = my_list[my_list.length - 1];
                    if (my_elem.innerHTML!="下一页" &&
                        (my_list.length < 2 || my_list[my_list.length - 2].innerHTML!="下一页")) {
                        stop = true;
                    }
                    if (my_elem.innerHTML=="下一页") {
                        next_link = my_elem.href;
                    } else if (my_list.length > 1 && my_list[my_list.length - 2].innerHTML=="下一页") {
                        next_link = my_list[my_list.length - 2].href;
                    }
                }

                var next_col = document.createElement("div");
                next_col.className = "EG_col";
                if (stop && !holder.querySelector(".Mid2L_con, .MidLcon, .MidL_con")) {
                    is_loading = false;
                    return;
                }

                next_col.appendChild(holder.querySelector(".Mid2L_con")?holder.querySelector(".Mid2L_con"):
                                     holder.querySelector(".MidLcon")?holder.querySelector(".MidLcon"):
                                     holder.querySelector(".MidL_con"));

                cols.push(next_col);
                console.log("Page no: " + cols.length);
                next_col.id = next_col.className + "_" + (cols.length - 1);

                if (!Mid2L_ctt || cols.length === 1) {
                    Mid2L_ctt = document.querySelector(".Mid2L_con")?document.querySelector(".Mid2L_con"):
                                document.querySelector(".MidLcon")?document.querySelector(".MidLcon"):
                                document.querySelector(".MidL_con");
                }
                Mid2L_ctt.appendChild(next_col);
                is_loading = false;
            }
        });
    }

    function onScroll(e) {
        if (stop || is_loading) return;

        var y = window.scrollY;
        var delta = e.deltaY || y - old_scrollY;

        if (delta > 0 && (window.innerHeight + y) >= (document.body.clientHeight - (window.innerHeight * request_pct))) {
            console.log("scroll end");

            try {
                var my_list = document.querySelectorAll(".page_css a");
                var my_elem = my_list[my_list.length - 1];
                if (my_elem.innerHTML=="下一页") {
                    next_link = my_elem.href;
                } else if (my_list.length > 1 && my_list[my_list.length - 2].innerHTML=="下一页") {
                    next_link = my_list[my_list.length - 2].href;
                } else {
                    stop=true;
                    return;
                }
                requestNextPage(next_link);
            } catch (err) {
                console.error(err.name + ": " + err.message);
            }
        }
        old_scrollY = y;
        scroll_events += 1;
    }

    console.log("eGamersky.js initialized");
});
console.log("eGamersky.js loaded");