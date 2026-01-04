// ==UserScript==
// @name         PTP To Radarr
// @version      1.2
// @author       DirtyCajunRice
// @namespace    DirtyCajunRice
// @description  Easily add movies to Radarr straight from PTP
// @homepage     https://passthepopcorn.me/forums.php?action=viewthread&threadid=35294
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAACTFBMVEUAAAD//////////////vu1t7j/zFCGiYz////+/v4xNjs7QEUpLjP////7+/smKzBHS09VWV1obG/////////////Z2tv/////////////////////yUdQVFg/Q0imqKp2enz19va2t7n///+XmZyTlZj/4JOOkJOEh4n/8tTY2trV1tf/9+L////r7Oz///////84PEEuMjdLT1RCRkv/zlmMj5FaXWGVl5plaGzq6+yYmpx0d3rU1dZ8f4L8/f3v7/C+wMG6u72bnaD/5qmgo6WsrrD/67mxs7XOz9H//PT///////////////////////////////////////////////82Oj//xDX/xj3/zE2JjI9SVlr/0mVdYWV4e3//1nLn5+jg4eKGiYttcHSAg4b/2XzMzc+wsrTGx8ijpqj/5KCdn6H/7cC9vsC6vL2+wMH////Q0dL/8c3k5eX/+evp6en19fXy8vL9/f3////l5ubz8/T///////////////////////////////////////////////////9YXGD/z1r/13b////c3d7HyMmqrK7s7O2Ii43/24X4+Pjy8/Opq63/7sT4+PjExcf9/f3R0tP/89bf4OHl5ubl5ebk5ebj4+Tt7u7/////////////////////////////////////////////////////wjAkKS4XHCEaHyT/wCkiJywYHiMfJSobICYhJiv/vyQeIygcIicVGh//wSz/vyctMTYSGB0KDxUSFx1vUO58AAAAsHRSTlMA5eTH5u77+uPx/fz+8uX++/r31Xkg9drSOhIJ/Pv79vb19fPz8/Pz8+vq6uno57yj/f38+/r5+fj49/f39vb19fT09PDw7+7u6+bOybimlHFgWCkeGAb+/v38+vn4+Pf39vb29vX19PTz8/Hw7e3t7Ovr6+jn5+bm5d3Y18G0sZuPi4J9ZF5EDwz5+fb19fX19PT08/Pv7ezs6+vq6ejo6Ojn3suvl5GHbFRQSjECARZmqHoAAAO5SURBVEjHjZXle9NQFMbblEFSN9Yic0UmbGMbc2FjbsBwd3d3d3d3t+ZG2yTrgH+MJPfmCQ8k3c6Hfjq/5n3Pvee9Fq0uDZw8Fg509XwabxlVDdhcqzObq2/W1h8OThy5/WKxq7HCSQHAMt7mjM7+wRH6J3Y3+HkqSsrF8KBso6voQsL+H8UZKRJDaiVSFbW7ihNZ6XfVSXJjlKV4llO+Qnlurwr1TTQVFM5kGfmPneltO/IcIKqwoKT6bvj8d2PgK+Gj5H7HbhzD8MJ8j0KTHChtdJ2YYAicTiYZMuqcilnlwrBpyzlescILa5OtH42snEgDJMnW4HI7RB6lANUK66lreBOc9B9gW6IArZjarCLurXZkxbGZsH35DxgnA1SS0jtlukpY8Zfp0IoALm8giueaAWMWR3I7cGTFz4uKFYqblYy9H28CjI3FFs/BkPskB7LizM4I9A8aA3SEpldOQcjBPDuAIy7bSHRfMAEikVhk/T70kf01UQreFt8GImgGRIZii7aMQUh7BRDU2xLNyzptDEBk5h6k61CLg+XUEWdnnTMCUMWHlk3B4UEeaHYqVhiQdnieKaBaye1AyFS/IH9EsFedMQOQrsmzNStJw/KhSJWdZgAqOnblAbSCt5dwJJ8SMAc0K/TK6ZBopUhuxlFzQLeycDaU5eOjw0dGAcTjufATbdRoAFo5EDQqUliQUJI+JwjsLWFLzU0j+bkdaKwKMPyzPJwIiNNXpyM1r/OeyZI4z+pec4Cmx2qL4U5y/NqMYfd/VeJzjQAkfo52yNtLeQHk425H+rWg2eWLRe7sQ2qep4s8Q0rZeM6s+p5BLTUkHVDFL3uKLsTBHHXnGOHJi0yiVwscWyarA8oqbEPira2pcKt/risgwuf1FX3oBRoQ/2vZdvsoUV02cQ1RcGa+RQcet8+QfrcpwOSh9dooX+V7KEZZZzGlseAdClkEbMIK81O3K43btMA4kDMMs09KbXIdg+06UD4Nxw65oQ74u8OrRdKahlDfv+l6vNKPWWGh0FvL81roWXvnWf6tD7UgG9f7C1eQMFbZpZuInm8Gcf+Z8EpbMQymt7tlBgpue0t914DFqOaH0iRq+c5Ct9W9f6ePFaD4ulWhs2avXF+WH/CC3bvUaxfg48P7kwtOQfFGNam7ygEYTuRFDr4JZU2uIjhKkxpvu+5jRfhSc2BBzr235/RRGtsoykpLFQBgAWVfdws/e9EyUl0KhjJuVK+oKW+q2nVSf6ESygoe7woEOotOTUjc9weXiUPgDnteIQAAAABJRU5ErkJggg==
// @supportURL   https://passthepopcorn.me/forums.php?action=viewthread&threadid=35294
// @match        https://passthepopcorn.me/*
// @require      https://cdn.jsdelivr.net/gh/sizzlemctwizzle/GM_config@43fd0fe4de1166f343883511e53546e87840aeaf/gm_config.js
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @copyright    2019, dirtycajunrice (https://openuserjs.org//users/dirtycajunrice)
// @license      MIT
// @grant        GM.xmlHttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.openInTab
// @grant        GM.notification
// @grant        GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/423610/PTP%20To%20Radarr.user.js
// @updateURL https://update.greasyfork.org/scripts/423610/PTP%20To%20Radarr.meta.js
// ==/UserScript==

/*=========================  Version History  ==================================

Changelog 1.2   - Changed GM_config to older version. [Latest GM_config breaks things]

Changelog 1.1   - Add more error checks @catsouce.
                  Icons updated and converted to internal data by @catsouce.

Changelog 1.0   - Ported full 'Radarr v4' changes from IMDb Scout Mod by @catsouce.

Changelog 0.92  - Add extra check for wrong API key @hulkhorgen.

Changelog 0.91  - Support for Radarr v4 by @hulkhorgen.

Changelog 0.9   - Support for Radarr dev v3.1.0.4893 by @catsouce.

Changelog 0.8.9 - Debugging code cleanup by @catsouce.

Changelog 0.8.8 - Fix for non Chrome browsers. Updated to Greasemonkey v4 API by @catsouce.

Changelog 0.8.7 - Change of url for newer Radarr (openInTab) by @varovas.

Changelog 0.8.6 - Fix by @catsouce.

Changelog 0.8.5 - Fix by @bw.

Changelog 0.8.4 - Fixed href bug for covers
                  Fixed update logic

Changelog 0.8.3 - Major internal code refactor
                  Found lingering URL sanitization missed

Changelog 0.8.2 - Fixed autoupdate trying to update non-existant buttons

Changelog 0.8.1 - Fixed "Huge view" themeChecker for Raise
                  Fixed "Huge view" in collections
                  Added AutoUpdate for "Huge view"

Changelog 0.8.0 - Added "Huge view"

Changelog 0.7.1 - Fixed bug with GM_config iframe document access logic
                  Fixed bug with themeChecker

Changelog 0.7.0 - Added AutoSync to settings
                  Update buttons after a sync (manual and auto)

Changelog 0.6.1 - Added Stylesheet checking to fix cover buttons.
                  Confirmed working on all official and supported custom stylesheets + Raise

Changelog 0.6.0 - Added error checking to help debug issues
                  Added Radarr URL sanitization

*/

GM_config.init({
    "id": "PTPToRadarr",
    "title": "PTP To Radarr Settings",
    "css": `#PTPToRadarr {background: #333333;}
            #PTPToRadarr .field_label {color: #fff;}
            #PTPToRadarr .config_header {color: #fff; padding-bottom: 10px;}
            #PTPToRadarr .reset {color: #f00; text-align: center;}
            #PTPToRadarr .config_var {text-align: center;}
            #PTPToRadarr_radarr_syncbutton_var {float: left;}
            #PTPToRadarr .reset_holder {text-align: center;}
            #PTPToRadarr_radarr_minimumavailability_var {padding-right: 95;}
            #PTPToRadarr_radarr_apikey_var {padding-left: 49;}
            #PTPToRadarr_radarr_url_var {padding-left: 69;}
            #PTPToRadarr .saveclose_buttons {margin: 16px 10px 10px; padding: 2px 12px; background-color: #e7e7e7; color: black; text-decoration: none; border: none; border-radius: 6px;}
            #PTPToRadarr_field_radarr_syncbutton {background-color: #e7e7e7; color: black; text-decoration: none; border: none; border-radius: 6px; margin-left: 10px; margin-top: 16px; height: 20px;}`,
    "events": {
        "open": function(doc) {
            let style = this.frame.style;
            style.width = "400px";
            style.height = "295px";
            style.inset = "";
            style.top = "6%";
            style.right = "6%";
            style.borderRadius = "25px";
            doc.getElementById("PTPToRadarr_buttons_holder").prepend(doc.getElementById("PTPToRadarr_radarr_syncbutton_var"));
        }
    },
    "fields": {
        "radarr_url": {
            "label": "Radarr URL",
            "type": "text",
            "default": "https://domain.tld/radarr"
        },
        "radarr_apikey": {
            "label": "Radarr API Key",
            "type": "text",
            "default": ""
        },
        "radarr_profileid": {
            "label": "Radarr Quality Profile ID",
            "type": "text",
            "default": "1"
        },
        "radarr_rootfolderpath": {
            "label": "Radarr Root Folder Path",
            "type": "text",
            "default": "/mnt/movies"
        },
        "radarr_minimumavailability":
        {
            "label": "Minimum Availability",
            "type": "select",
            "options": ["announced", "inCinemas", "released"],
            "default": "released"
        },
        "radarr_searchformovie": {
            "label": "Search for movie on request",
            "type": "checkbox",
            "default": false
        },
        "radarr_sync_interval":
        {
            "label": "AutoSync Interval (Minutes)",
            "type": "select",
            "options": ["15", "30", "60", "120", "360", "1440", "Never"],
            "default": "Never"
        },
        "radarr_syncbutton": {
            "label": "Sync Radarr Movies",
            "type": "button",
            "click": get_radarr_movies
        }
    }
});

GM.registerMenuCommand("PTP To Radarr Settings",() => GM_config.open());

let url = window.location.href;
let radarr_url = GM_config.get("radarr_url").replace(/\/$/, "");

var current_page_type = "";
if (document.getElementById("torrent-table")) {
    current_page_type = "singletorrent";
}
else {
    current_page_type = "multi";
}
if (current_page_type) {
    set_html(false);
}

let interval = GM_config.get("radarr_sync_interval");
if (interval != "Never") {
    let millisecondInterval = Number(interval) * 60000;
    window.setTimeout(() => autoSync(millisecondInterval));
    window.setInterval(() => autoSync(millisecondInterval), millisecondInterval);
}

function themeChecker () {
    let typeAThemes = ["marcel.css", "ptp-raise"];
    typeAThemes.forEach((theme) => {
        if (document.head.querySelector("[href*=\"" + theme + "\"]")) {
            return true;
        }
    });
    return false;
}

function clickswap (imdbid, titleSlug) {
    let radarr_url = GM_config.get("radarr_url").replace(/\/$/, "");
    let button = document.getElementById("ptptoradarr-" + imdbid)
    button.firstChild.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAACTFBMVEUAAAD//////////////vu1t7j/zFCGiYz////+/v4xNjs7QEUpLjP////7+/smKzBHS09VWV1obG/////////////Z2tv/////////////////////yUdQVFg/Q0imqKp2enz19va2t7n///+XmZyTlZj/4JOOkJOEh4n/8tTY2trV1tf/9+L////r7Oz///////84PEEuMjdLT1RCRkv/zlmMj5FaXWGVl5plaGzq6+yYmpx0d3rU1dZ8f4L8/f3v7/C+wMG6u72bnaD/5qmgo6WsrrD/67mxs7XOz9H//PT///////////////////////////////////////////////82Oj//xDX/xj3/zE2JjI9SVlr/0mVdYWV4e3//1nLn5+jg4eKGiYttcHSAg4b/2XzMzc+wsrTGx8ijpqj/5KCdn6H/7cC9vsC6vL2+wMH////Q0dL/8c3k5eX/+evp6en19fXy8vL9/f3////l5ubz8/T///////////////////////////////////////////////////9YXGD/z1r/13b////c3d7HyMmqrK7s7O2Ii43/24X4+Pjy8/Opq63/7sT4+PjExcf9/f3R0tP/89bf4OHl5ubl5ebk5ebj4+Tt7u7/////////////////////////////////////////////////////wjAkKS4XHCEaHyT/wCkiJywYHiMfJSobICYhJiv/vyQeIygcIicVGh//wSz/vyctMTYSGB0KDxUSFx1vUO58AAAAsHRSTlMA5eTH5u77+uPx/fz+8uX++/r31Xkg9drSOhIJ/Pv79vb19fPz8/Pz8+vq6uno57yj/f38+/r5+fj49/f39vb19fT09PDw7+7u6+bOybimlHFgWCkeGAb+/v38+vn4+Pf39vb29vX19PTz8/Hw7e3t7Ovr6+jn5+bm5d3Y18G0sZuPi4J9ZF5EDwz5+fb19fX19PT08/Pv7ezs6+vq6ejo6Ojn3suvl5GHbFRQSjECARZmqHoAAAO5SURBVEjHjZXle9NQFMbblEFSN9Yic0UmbGMbc2FjbsBwd3d3d3d3t+ZG2yTrgH+MJPfmCQ8k3c6Hfjq/5n3Pvee9Fq0uDZw8Fg509XwabxlVDdhcqzObq2/W1h8OThy5/WKxq7HCSQHAMt7mjM7+wRH6J3Y3+HkqSsrF8KBso6voQsL+H8UZKRJDaiVSFbW7ihNZ6XfVSXJjlKV4llO+Qnlurwr1TTQVFM5kGfmPneltO/IcIKqwoKT6bvj8d2PgK+Gj5H7HbhzD8MJ8j0KTHChtdJ2YYAicTiYZMuqcilnlwrBpyzlescILa5OtH42snEgDJMnW4HI7RB6lANUK66lreBOc9B9gW6IArZjarCLurXZkxbGZsH35DxgnA1SS0jtlukpY8Zfp0IoALm8giueaAWMWR3I7cGTFz4uKFYqblYy9H28CjI3FFs/BkPskB7LizM4I9A8aA3SEpldOQcjBPDuAIy7bSHRfMAEikVhk/T70kf01UQreFt8GImgGRIZii7aMQUh7BRDU2xLNyzptDEBk5h6k61CLg+XUEWdnnTMCUMWHlk3B4UEeaHYqVhiQdnieKaBaye1AyFS/IH9EsFedMQOQrsmzNStJw/KhSJWdZgAqOnblAbSCt5dwJJ8SMAc0K/TK6ZBopUhuxlFzQLeycDaU5eOjw0dGAcTjufATbdRoAFo5EDQqUliQUJI+JwjsLWFLzU0j+bkdaKwKMPyzPJwIiNNXpyM1r/OeyZI4z+pec4Cmx2qL4U5y/NqMYfd/VeJzjQAkfo52yNtLeQHk425H+rWg2eWLRe7sQ2qep4s8Q0rZeM6s+p5BLTUkHVDFL3uKLsTBHHXnGOHJi0yiVwscWyarA8oqbEPira2pcKt/risgwuf1FX3oBRoQ/2vZdvsoUV02cQ1RcGa+RQcet8+QfrcpwOSh9dooX+V7KEZZZzGlseAdClkEbMIK81O3K43btMA4kDMMs09KbXIdg+06UD4Nxw65oQ74u8OrRdKahlDfv+l6vNKPWWGh0FvL81roWXvnWf6tD7UgG9f7C1eQMFbZpZuInm8Gcf+Z8EpbMQymt7tlBgpue0t914DFqOaH0iRq+c5Ct9W9f6ePFaD4ulWhs2avXF+WH/CC3bvUaxfg48P7kwtOQfFGNam7ygEYTuRFDr4JZU2uIjhKkxpvu+5jRfhSc2BBzr235/RRGtsoykpLFQBgAWVfdws/e9EyUl0KhjJuVK+oKW+q2nVSf6ESygoe7woEOotOTUjc9weXiUPgDnteIQAAAABJRU5ErkJggg==";
    button.removeEventListener("click", new_movie_lookup, false);
    button.addEventListener("click", function () {
        GM.openInTab(radarr_url.concat("/movie/", titleSlug), "active");
    }, false);
}

function set_html (update) {
    let theme = themeChecker();
    let radarr_url = GM_config.get("radarr_url").replace(/\/$/, "");
    let coverView = document.querySelector(".cover-movie-list__container:not(.hidden)");
    let coverViewMovies = Array.from(document.getElementsByClassName("cover-movie-list__movie__rating-and-tags"));
    let listView = document.querySelector(".basic-movie-list");
    let listViewMovies = Array.from(document.getElementsByClassName("basic-movie-list__movie__ratings-and-tags"));
    let hugeView = document.querySelector(".huge-movie-list__movie");
    let hugeViewMovies = Array.from(document.getElementsByClassName("huge-movie-list__movie__ratings"));
    if (update) {
        let buttons = document.querySelectorAll("[id^=\"ptptoradarr-tt\"]");
        if (buttons.length === 0) {
            return;
        }
        buttons.forEach((button) => {
            window.setTimeout(function () {
                button.parentNode.removeChild(button);
            });
        });
    }
    if (current_page_type == "singletorrent") {
        let a = document.querySelector("[href*=\"://www.imdb.com/title/tt\"]");;
        let movie = document.querySelector(".panel__body");
        if (a) {
            buttonBuilder(movie, a.href, "single", theme);
        }
    }
    else if (current_page_type == "multi") {
        if (coverView && !coverView.classList.contains("hidden")) {
            coverViewMovies.forEach((movie) => {
                window.setTimeout(() => {
                    let a = movie.querySelector("[href*=\"://www.imdb.com/title/tt\"]");
                    if (a) {
                        buttonBuilder(movie, a.href, "medium", theme);
                    }
                });
            });
        }
        else if (listView && !listView.classList.contains("hidden")) {
            listViewMovies.forEach((movie) => {
                window.setTimeout(() => {
                    let a = movie.querySelector("[href*=\"://www.imdb.com/title/tt\"]");
                    if (a) {
                        buttonBuilder(movie, a.href, "small", theme);
                    }
                });
            });
        }
        else if (hugeView) {
            hugeViewMovies.forEach((movie) => {
                window.setTimeout(() => {
                    let a = movie.querySelector("[href*=\"://www.imdb.com/title/tt\"]");
                    if (a) {
                        buttonBuilder(movie, a.href, "large", theme);
                    }
                });
            });
        }
    }
}

async function buttonBuilder (movie, href, type, theme) {
    let radarr_url = GM_config.get("radarr_url").replace(/\/$/, "");
    let imdbid = href.match(/tt\d+/)[0];
    let exists = await check_exists(imdbid);
    let button = document.createElement("button");
    let img = document.createElement("img");
    button.id = "ptptoradarr-" + imdbid;
    button.type = type;
    Object.assign(button.style, {border: "none", backgroundColor: "transparent"});
    Object.assign(img.style, {border: "none", backgroundColor: "transparent"});
    Object.assign(img, {height: 32, width: 32});
    button.appendChild(img);
    img.imdbid = imdbid;
    if (type == "single") {
        Object.assign(button.style, {position: "absolute", top: "6%", zIndex: 10});
        movie.style.position = "relative";
        movie.prepend(button);
    }
    else if (type == "small") {
        Object.assign(img, {height: 16, width: 16});
        movie.appendChild(button);
    }
    else if (type == "medium") {
        let posterContainer = movie.closest(".cover-movie-list__movie");
        posterContainer.prepend(button);
        Object.assign(button.style, {position: "absolute", top: "3%", zIndex: 10});
        if (theme) {
            posterContainer.style.position = "relative";
        }
    }
    else if (type == "large") {
        let posterContainer = movie.closest(".huge-movie-list__movie").firstChild;
        posterContainer.prepend(button);
        Object.assign(button.style, {position: "absolute", top: "3%", zIndex: 10});
        if (theme) {
            button.style.left = "3%";
            posterContainer.style.position = "relative";
        }
    }
    if (exists) {
        img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAACTFBMVEUAAAD//////////////vu1t7j/zFCGiYz////+/v4xNjs7QEUpLjP////7+/smKzBHS09VWV1obG/////////////Z2tv/////////////////////yUdQVFg/Q0imqKp2enz19va2t7n///+XmZyTlZj/4JOOkJOEh4n/8tTY2trV1tf/9+L////r7Oz///////84PEEuMjdLT1RCRkv/zlmMj5FaXWGVl5plaGzq6+yYmpx0d3rU1dZ8f4L8/f3v7/C+wMG6u72bnaD/5qmgo6WsrrD/67mxs7XOz9H//PT///////////////////////////////////////////////82Oj//xDX/xj3/zE2JjI9SVlr/0mVdYWV4e3//1nLn5+jg4eKGiYttcHSAg4b/2XzMzc+wsrTGx8ijpqj/5KCdn6H/7cC9vsC6vL2+wMH////Q0dL/8c3k5eX/+evp6en19fXy8vL9/f3////l5ubz8/T///////////////////////////////////////////////////9YXGD/z1r/13b////c3d7HyMmqrK7s7O2Ii43/24X4+Pjy8/Opq63/7sT4+PjExcf9/f3R0tP/89bf4OHl5ubl5ebk5ebj4+Tt7u7/////////////////////////////////////////////////////wjAkKS4XHCEaHyT/wCkiJywYHiMfJSobICYhJiv/vyQeIygcIicVGh//wSz/vyctMTYSGB0KDxUSFx1vUO58AAAAsHRSTlMA5eTH5u77+uPx/fz+8uX++/r31Xkg9drSOhIJ/Pv79vb19fPz8/Pz8+vq6uno57yj/f38+/r5+fj49/f39vb19fT09PDw7+7u6+bOybimlHFgWCkeGAb+/v38+vn4+Pf39vb29vX19PTz8/Hw7e3t7Ovr6+jn5+bm5d3Y18G0sZuPi4J9ZF5EDwz5+fb19fX19PT08/Pv7ezs6+vq6ejo6Ojn3suvl5GHbFRQSjECARZmqHoAAAO5SURBVEjHjZXle9NQFMbblEFSN9Yic0UmbGMbc2FjbsBwd3d3d3d3t+ZG2yTrgH+MJPfmCQ8k3c6Hfjq/5n3Pvee9Fq0uDZw8Fg509XwabxlVDdhcqzObq2/W1h8OThy5/WKxq7HCSQHAMt7mjM7+wRH6J3Y3+HkqSsrF8KBso6voQsL+H8UZKRJDaiVSFbW7ihNZ6XfVSXJjlKV4llO+Qnlurwr1TTQVFM5kGfmPneltO/IcIKqwoKT6bvj8d2PgK+Gj5H7HbhzD8MJ8j0KTHChtdJ2YYAicTiYZMuqcilnlwrBpyzlescILa5OtH42snEgDJMnW4HI7RB6lANUK66lreBOc9B9gW6IArZjarCLurXZkxbGZsH35DxgnA1SS0jtlukpY8Zfp0IoALm8giueaAWMWR3I7cGTFz4uKFYqblYy9H28CjI3FFs/BkPskB7LizM4I9A8aA3SEpldOQcjBPDuAIy7bSHRfMAEikVhk/T70kf01UQreFt8GImgGRIZii7aMQUh7BRDU2xLNyzptDEBk5h6k61CLg+XUEWdnnTMCUMWHlk3B4UEeaHYqVhiQdnieKaBaye1AyFS/IH9EsFedMQOQrsmzNStJw/KhSJWdZgAqOnblAbSCt5dwJJ8SMAc0K/TK6ZBopUhuxlFzQLeycDaU5eOjw0dGAcTjufATbdRoAFo5EDQqUliQUJI+JwjsLWFLzU0j+bkdaKwKMPyzPJwIiNNXpyM1r/OeyZI4z+pec4Cmx2qL4U5y/NqMYfd/VeJzjQAkfo52yNtLeQHk425H+rWg2eWLRe7sQ2qep4s8Q0rZeM6s+p5BLTUkHVDFL3uKLsTBHHXnGOHJi0yiVwscWyarA8oqbEPira2pcKt/risgwuf1FX3oBRoQ/2vZdvsoUV02cQ1RcGa+RQcet8+QfrcpwOSh9dooX+V7KEZZZzGlseAdClkEbMIK81O3K43btMA4kDMMs09KbXIdg+06UD4Nxw65oQ74u8OrRdKahlDfv+l6vNKPWWGh0FvL81roWXvnWf6tD7UgG9f7C1eQMFbZpZuInm8Gcf+Z8EpbMQymt7tlBgpue0t914DFqOaH0iRq+c5Ct9W9f6ePFaD4ulWhs2avXF+WH/CC3bvUaxfg48P7kwtOQfFGNam7ygEYTuRFDr4JZU2uIjhKkxpvu+5jRfhSc2BBzr235/RRGtsoykpLFQBgAWVfdws/e9EyUl0KhjJuVK+oKW+q2nVSf6ESygoe7woEOotOTUjc9weXiUPgDnteIQAAAABJRU5ErkJggg==";
        button.addEventListener("click", function () {
            GM.openInTab(radarr_url.concat("/movie/", exists[0].titleSlug), "active");
        }, false);
    }
    else {
        img.src = "data:image/png;base64,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";
        $(button).click(function() {
           new_movie_lookup(imdbid);
        });
    }
}

function errorNotificationHandler (error, expected, errormsg) {
    let prestring = "PTPToRadar::";
    if (expected) {
        console.log(prestring + "Error: " + errormsg + " Actual Error: " + error);
        GM.notification("Error: " + errormsg);
    }
    else {
        console.log(prestring + "Unexpected Error: Please report this error in the forum. Actual Error: " + error);
        GM.notification("Unexpected Error: Please report this error in the forum. Actual Error: " + error);
    }
}

function get_radarr_movies() {
    let radarr_url = GM_config.get("radarr_url").replace(/\/$/, "");
    let radarr_apikey = GM_config.get("radarr_apikey");
    GM.xmlHttpRequest({
        method: "GET",
        url: radarr_url.concat("/api/v3/movie"),
        headers: {
            "X-Api-Key": radarr_apikey,
            "Accept": "application/json"
        },
        onload: function(response) {
            if (response.status == 200) {
                const responseJSON = JSON.parse(response.responseText);
                GM.setValue("existing_movies", JSON.stringify(responseJSON));
                let timestamp = + new Date()
                GM.setValue("last_sync_timestamp", timestamp)
                console.log("PTPToRadarr::Sync: Setting last sync timestamp to " + timestamp)
                GM.notification("Radarr Sync Complete!", "PTP To Radarr");
                set_html(true);
            } else if (response.status == 401) {
                GM.notification("Error: Invalid Radarr API Key.", "PTP To Radarr");
            } else {
                GM.notification("Error: Status " + response.status, "PTP To Radarr");
            }
        },
        onerror: function() {
          GM.notification("Request Error.\nCheck Radarr URL!", "PTP To Radarr");
        },
        onabort: function() {
          GM.notification("Request is aborted.", "PTP To Radarr");
        }
    });
}

async function check_exists (imdbid) {
    let movieliststr = await GM.getValue("existing_movies", "{}");
    let movie_list = JSON.parse(movieliststr);
    let filter = null
    try {
        filter = movie_list.filter(movie => movie.imdbId == imdbid);
    }
    catch (e) {
        if (e instanceof TypeError) {
            return false
        }
        else {
            errorNotificationHandler(e, false)
            return false
        }
    }
    if (!filter.length) {
        return false
    }
    else {
        return filter
    };
}

async function autoSync (interval) {
    let currentTimestamp = + new Date();
    let lastSyncTimestamp = await GM.getValue("last_sync_timestamp", 0);
    if (currentTimestamp - lastSyncTimestamp >= interval) {
        let notification = "It has been " + ((currentTimestamp - lastSyncTimestamp) / 60000).toFixed(1) +
            " minutes since your last sync which exceeds your threshold of " +
            (interval / 60000) + " minutes. AutoSyncing...";
        console.log(notification);
        GM.notification(notification);
        get_radarr_movies();
    }
}

function new_movie_lookup (imdbid) {
    let radarr_url = GM_config.get("radarr_url").replace(/\/$/, "");
    let radarr_apikey = GM_config.get("radarr_apikey");
    let movie = "";
    GM.xmlHttpRequest({
        method: "GET",
        url: radarr_url.concat("/api/v3/movie/lookup/imdb?imdbId=", imdbid),
        headers: {
            "X-Api-Key": radarr_apikey,
            "Accept": "application/json"
        },
        onload: function(response) {
            let responseJSON = null;
            if (!response.responseJSON) {
                if (response.status == 401) {
                    GM.notification("Error: Invalid Radarr API Key.", "PTP To Radarr");
                    return;
                } else if (!response.responseText) {
                    GM.notification("No results found.", "PTP To Radarr");
                    return;
                }
                responseJSON = JSON.parse(response.responseText);
                add_movie(responseJSON, imdbid);
            }
        },
        onerror: function() {
          GM.notification("Request Error.\nCheck Radarr URL!", "PTP To Radarr");
        },
        onabort: function() {
          GM.notification("Request is aborted.", "PTP To Radarr");
        }
    });
}

function add_movie (movie, imdbid) {
    let radarr_url = GM_config.get("radarr_url").replace(/\/$/, "");
    let radarr_apikey = GM_config.get("radarr_apikey");
    movie.qualityProfileId = parseInt(GM_config.get("radarr_profileid"));
    movie.rootFolderPath = GM_config.get("radarr_rootfolderpath");
    movie.monitored = true;
    movie.minimumAvailability = GM_config.get("radarr_minimumavailability");
    if (GM_config.get("radarr_searchformovie")) {
        movie.addOptions = {searchForMovie: true};
    } else {
        movie.addOptions = {searchForMovie: false};
    }
    GM.xmlHttpRequest({
        method: "POST",
        url: radarr_url.concat("/api/v3/movie"),
        headers: {
            "X-Api-Key": radarr_apikey,
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        data: JSON.stringify(movie),
        onload: function(response) {
            const responseJSON = JSON.parse(response.responseText);
            if (response.status == 201) {
                clickswap(imdbid, responseJSON.titleSlug);
                GM.notification(responseJSON.title + " Sucessfully sent to Radarr", "PTP To Radarr")
            } else {
                GM.notification("Error: " + responseJSON[0].errorMessage, "PTP To Radarr");
            }
        },
        onerror: function() {
          GM.notification("Request Error.\nCheck Radarr URL!", "PTP To Radarr");
        },
        onabort: function() {
          GM.notification("Request is aborted.", "PTP To Radarr");
        }
    });
}
