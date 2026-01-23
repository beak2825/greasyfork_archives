// ==UserScript==
// @name         Endless Gamersky (Enhanced)
// @description  Load more results automatically based on container visibility with a loading indicator.
// @author       fluffy & Copilot & Gemini
// @namespace    kitty_the_lost@sina.com
// @include      http://*.gamersky.com/*
// @include      https://*.gamersky.com/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @version      0.1.6
// @downloadURL https://update.greasyfork.org/scripts/14183/Endless%20Gamersky%20%28Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/14183/Endless%20Gamersky%20%28Enhanced%29.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function () {

    var event_type = "scroll";
    var Mid2L_ctt = document.querySelector(".Mid2L_con, .MidLcon, .MidL_con");
    var old_scrollY = 0;
    var stop = false;
    var is_loading = false;
    var next_link = null;

    // Create the Loading Indicator Element
    var loader = document.createElement("div");
    loader.id = "eg-loader";
    loader.innerHTML = `
        <div style="padding: 20px; text-align: center; color: #666; font-family: sans-serif;">
            <span style="display: inline-block; width: 20px; height: 20px; border: 3px solid #ccc; border-top-color: #333; border-radius: 50%; animation: spin 1s linear infinite; margin-right: 10px; vertical-align: middle;"></span>
            Loading more content...
        </div>
        <style>
            @keyframes spin { to { transform: rotate(360deg); } }
        </style>
    `;
    loader.style.display = "none";

    function requestNextPage(link) {
        if (is_loading) return;
        is_loading = true;

        // Show loader
        if (Mid2L_ctt) {
            Mid2L_ctt.appendChild(loader);
            loader.style.display = "block";
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: link,
            onload: function (response) {
                var holder = document.createElement("div");
                holder.innerHTML = response.responseText;

                var my_list = holder.querySelectorAll(".page_css a");
                if (my_list.length > 0) {
                    var my_elem = my_list[my_list.length - 1];
                    if (my_elem.innerHTML != "下一页" && (my_list.length < 2 || my_list[my_list.length - 2].innerHTML != "下一页")) {
                        stop = true;
                    }
                    if (my_elem.innerHTML == "下一页") {
                        next_link = my_elem.href;
                    } else if (my_list.length > 1 && my_list[my_list.length - 2].innerHTML == "下一页") {
                        next_link = my_list[my_list.length - 2].href;
                    }
                }

                var next_content = holder.querySelector(".Mid2L_con, .MidLcon, .MidL_con");

                if (next_content) {
                    // Append only the children of the new container to the current one
                    while (next_content.firstChild) {
                        Mid2L_ctt.insertBefore(next_content.firstChild, loader);
                    }
                }

                if (stop) {
                    loader.innerHTML = "<div style='padding: 20px; text-align: center; color: #999;'>No more pages to load.</div>";
                } else {
                    loader.style.display = "none";
                }

                is_loading = false;
            }
        });
    }

    var throttleTimeout = null;
    window.addEventListener(event_type, function(e) {
        if (!throttleTimeout) {
            throttleTimeout = setTimeout(function() {
                onScroll(e);
                throttleTimeout = null;
            }, 100);
        }
    }, false);

    function onScroll(e) {
        if (stop || is_loading) return;
        if (!Mid2L_ctt) Mid2L_ctt = document.querySelector(".Mid2L_con, .MidLcon, .MidL_con");
        if (!Mid2L_ctt) return;

        var y = window.scrollY;
        var delta = e.deltaY || y - old_scrollY;
        var rect = Mid2L_ctt.getBoundingClientRect();

        // Trigger when the bottom of the main container is within 300px of the viewport bottom
        if (delta > 0 && rect.bottom <= (window.innerHeight + 800)) {
            try {
                var my_list = document.querySelectorAll(".page_css a");
                var my_elem = my_list[my_list.length - 1];
                if (my_elem && my_elem.innerHTML == "下一页") {
                    next_link = my_elem.href;
                } else if (my_list.length > 1 && my_list[my_list.length - 2].innerHTML == "下一页") {
                    next_link = my_list[my_list.length - 2].href;
                } else {
                    stop = true;
                    return;
                }
                requestNextPage(next_link);
            } catch (err) {
                console.error(err);
            }
        }
        old_scrollY = y;
    }
});