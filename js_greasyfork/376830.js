// ==UserScript==
// @name         YouTube mods
// @namespace    sami@kankaristo.fi
// @version      25.16.13
// @description  YouTube modifications.
// @author       sami@kankaristo.fi
// @match        https://www.youtube.com/*
// @grant        none
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://greasyfork.org/scripts/405927-utillibrary/code/UtilLibrary.js
// @downloadURL https://update.greasyfork.org/scripts/376830/YouTube%20mods.user.js
// @updateURL https://update.greasyfork.org/scripts/376830/YouTube%20mods.meta.js
// ==/UserScript==


Util.LOGGING_ID = "YouTube mods";


var updateCounter = parseInt(
    window.localStorage.getItem("updateCounter") || "0"
);

var controlsOnVideo = true;

var speed = 2.0;
var speedDisplay = null;

var allowVideoToPlay = true;
var allowBackgroundPlayback = false;

var notificationButtonListenerSet = false;

/**
 * List of YouTube playlists.
 *
 * Tooltips last updated on: 2026-01-19
 */
var sidebarButtons = [
    {
        "text": "Rick Beato",
        "tooltip": "94 videos = 40:00",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJfMOz4LCbrXSGHZcxUMBOJU",
        "highlight": true,
        "cssText": "background-color: black;"
    },
    {
        "text": "StumpyNubs",
        "tooltip": "684 videos = 95:20",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJciNw5ZN14K3VM74PzQIdhU",
        "highlight": true,
        "cssText": "background-color: black;"
    },
    {
        "text": "MrSteele",
        "tooltip": "590 videos = 91:56",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJc93bsImcy3_JqGUgDfXR27",
        "highlight": true,
        "cssText": "background-color: black;"
    },
    {
        "text": "Ben Eller",
        "tooltip": "398 videos = 97:37",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJe5fN8HCPb83vJ8EGbw9JGW",
        "highlight": true,
        "cssText": "background-color: black;"
    },
    {
        "text": "Brady's",
        "tooltip": "1757 videos = 356:28",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJfiZIKrRdppnpdvyqOPVpvr",
        "highlight": true,
        "cssText": "color: grey;"
    },
    {
        "text": "CrashCourse",
        "tooltip": "774 videos = 139:06",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJc94Y86dTGmOKZ7QSZbbyhi",
        "highlight": true,
        "cssText": "background-color: black;"
    },
    {
        "text": "DYKG?",
        "tooltip": "640 videos = 146:02",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJdKUn0fPtqP_7n8aWlpxRcH",
        "highlight": true,
        "cssText": "background-color: black;"
    },
    {
        "text": "ExtraCredits",
        "tooltip": "1115 videos = 244:04",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJemjERwfoxZ8O4ZkMUdtR7M",
        "highlight": true,
        "cssText": "color: grey;"
    },
    {
        "text": "JDiResta",
        "tooltip": "540 videos = 138:32",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJepkvkkhwsi74mMJVwUVqWP",
        "highlight": true
    },
    {
        "text": "JBardwell",
        "tooltip": "3620 videos = 654:33",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJdE0AbyhN5E5hLYkBwhWJQn",
        "highlight": true,
        "cssText": "background-color: black;"
    },
    {
        "text": "LastWeekTnit",
        "tooltip": "668 videos = 287:45",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJfxMTA6TMoh7tFTiDifvLAG",
        "highlight": true
    },
    {
        "text": "MKBHD",
        "tooltip": "989 videos = 168:03",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJeqTgBdsnC0jx79xu4U3vuQ",
        "highlight": true
    },
    {
        "text": "MusicIsWin",
        "tooltip": "1025 videos = 190:42",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJf3jaKjUlJb0EdIpav6eBt3",
        "highlight": true
    },
    {
        "text": "RiffsBeards",
        "tooltip": "1759 videos = 310:26",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJfVD5ZItAeDwGXvxVPBRm6e",
        "highlight": true
    },
    {
        "text": "RobChapman",
        "tooltip": "1066 videos = 333:34",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJdNhsoP4xP4M7YpMqwF1oZm",
        "highlight": true
    },
    {
        "text": "SciShow",
        "tooltip": "2593 videos = 419:59",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJeQ7JYNlifDiEwAG0WYJRyi",
        "highlight": true
    },
    {
        "text": "SpectreSound",
        "tooltip": "1221 videos = 342:50",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJfsRpDhdJ6qvKAXpnHYjrk9",
        "highlight": true
    },
    {
        "text": "SteveRamsey",
        "tooltip": "493 videos = 97:26",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJdvvVQ373b6229qcApVqu_3",
        "highlight": true
    },
    {
        "text": "ThatPedalSh",
        "tooltip": "616 videos = 624:52",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJfyfF6g87by5Wxee1BuGwOU",
        "highlight": true
    },
    {
        "text": "TotalBiscuit",
        "tooltip": "880 videos = 389:16",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJdtRw5ZPPWXYa0u6qoZrdHO",
        "highlight": true,
        "cssText": "background-color: black;"
    },
    {
        "text": "Wallimann",
        "tooltip": "460 videos = 143:56",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJcjVHfgyT6ygT8AEakrh9B8",
        "highlight": true
    },
    {
        "text": "Wisecrack",
        "tooltip": "730 videos = 208:21",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJdDUaYQjNthhpdncOIeQ1jl",
        "highlight": true,
        "cssText": "background-color: black;"
    },
    {
        "text": "Yogs",
        "tooltip": "1191 videos = 751:26",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJfOFR_tyk80nOHqVuXuDoVh",
        "highlight": true,
        "cssText": "font-weight: bold; margin: 5px 0 0 0;"
    },
    {
        "text": "Hat Films",
        "tooltip": "1860 videos = 1235:50",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJdC0yw1XlWKFaW9O2BIqeCN",
        "highlight": true
    },
    {
        "text": "Hat series",
        "tooltip": "745 videos = 223:03",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJd_DvX_TzYrVW33cL7HBh8U",
        "highlight": true,
        "cssText": "background-color: black;"
    },
    {
        "text": "Sips",
        "tooltip": "617 videos = 275:41",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJco1nFbRURYX4bJEgec3yDq",
        "highlight": true,
        "cssText": "background-color: black;"
    },
    {
        "text": "Tom",
        "tooltip": "2089 videos = 812:21",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJe4Zout6ifo0uebISiFc5im",
        "highlight": true
    },
    {
        "text": "Yogs Mine",
        "tooltip": "1566 videos = 441:09",
        "href": "https://www.youtube.com/playlist?list=PLuEqX5XqgpJcAug5_H9kptdTaiGbDqiHT",
        "highlight": true,
        "cssText": "background-color: black;"
    }
];


///
/// Get the YouTube notification button.
///
function GetNotificationButton() {
    return (
        document.querySelector("button[aria-label=Notifications]")
        || document.querySelector("button[aria-label=Ilmoitukset]")
    );
}


///
/// Focus the YouTube video.
///
function FocusVideo() {
    Util.Log("FocusVideo()");

    if (Util.InIframe()) {
        // Embedded video, don't focus
        return;
    }

    if (window.location.href.includes("watch")) {
        var video = document.getElementsByTagName("video")[0];
        video.focus();
        window.scroll(0, 0);
    }
}


///
/// Play/pause the video.
///
function VideoPlayPause() {
    Util.Log("VideoPlayPause()");

    FocusVideo();

    var video = document.getElementsByTagName("video")[0];
    if (video.paused) {
        video.play();
    }
    else {
        video.pause();
    }
}


///
/// Jump to the end of the video.
///
function VideoJumpToEnd() {
    Util.Log("VideoJumpToEnd()");

    FocusVideo();

    var video = document.getElementsByTagName("video")[0];
    video.currentTime = video.duration;
}


///
/// Jump to the start of the video.
///
function VideoJumpToStart() {
    Util.Log("VideoJumpToStart()");

    FocusVideo();

    var video = document.getElementsByTagName("video")[0];
    video.currentTime = 0;
}


///
/// Jump forward in the video.
///
function VideoJumpForward(jumpAmount) {
    Util.Log("VideoJumpForward()");

    FocusVideo();

    var video = document.getElementsByTagName("video")[0];
    video.currentTime = video.currentTime + jumpAmount;
}


///
/// Jump backward in the video.
///
function VideoJumpBackward(jumpAmount) {
    Util.Log("VideoJumpBackward()");

    FocusVideo();

    var video = document.getElementsByTagName("video")[0];
    video.currentTime = video.currentTime - jumpAmount;
}


var closeDropdowns = false;
var dropdownObserver = new MutationObserver(ObserveDropdown);
function ObserveDropdown(mutations, observer) {
    for (var mutation of mutations) {
        //Util.Log(mutation);
        //Util.Log(closeDropdowns);

        var target = mutation.target;
        const isDropdown = (
            target.tagName.toLowerCase() == "tp-yt-iron-dropdown"
        );

        if (isDropdown && closeDropdowns) {
            Util.Log("Closing dropdown");
            target.close();
        }
    }
}


///
/// Hide YouTube menus.
///
function HideYouTubeMenus(delay = 200) {
    Util.Log("HideYouTubeMenus()");

    setTimeout(
        () => {
            closeDropdowns = true;

            setTimeout(
                () => {
                    closeDropdowns = false;
                },
                1000
            );

            // TODO: Move this somewhere else?
            var dropdowns = document.getElementsByTagName("tp-yt-iron-dropdown");
            for (var dropdown of dropdowns) {
                dropdown.close();
                dropdownObserver.observe(dropdown, {attributes: true});
            }

            //FocusVideo();
        },
        delay
    );
}


///
/// Hide YouTube notification count.
///
function HideYouTubeNotificationCount() {
    Util.Log("HideYouTubeNotificationCount()");

    var notificationButton = GetNotificationButton();

    if (notificationButton == null) {
        Util.Error("Notification button not found!");
        return;
    }

    // Click the YouTube notification button to hide the red notification count icon
    notificationButton.dispatchEvent(Util.CreateClickEvent());

    // This is the surprisingly tricky bit: hide the notification menu
    HideYouTubeMenus();
}


///
/// Hide YouTube notification count across all tabs.
///
function GloballyHideYouTubeNotificationCount() {
    Util.Log("GloballyHideYouTubeNotificationCount()");

    HideYouTubeNotificationCount();

    // Increase update counter
    updateCounter += 1;
    Util.Log("Increase update counter: " + updateCounter);
    window.localStorage.setItem("updateCounter", updateCounter.toString());
}


///
/// Create buttons for "home" pages on YouTube.
///
function CreateHomeButtons() {
    Util.Log("CreateHomeButtons()");
    Util.Log("----------------------------------------------------------------------------------------------");

    var parent = document.querySelector("body");
    Util.Log("parent: ", parent);

    // Create playlists button
    var button = document.createElement("a");
    button.id = "headerPlaylistsButton";
    button.style.backgroundColor = "#444444";
    button.style.borderRadius = "50%";
    button.style.height = "10px";
    button.style.width = "10px";
    button.style.position = "fixed";
    button.style.top = "2px";
    button.style.left = "5px";
    button.style.zIndex = "1000000";
    parent.append(button);
    button.title = "PLAYLISTS";
    button.href = "https://www.youtube.com/channel/UChZg3EQN9EVjDDwxd8Cx4_w/playlists";

    // Create INBOX playlist button
    button = document.createElement("a");
    button.id = "headerInboxButton";
    button.style.backgroundColor = "#777777";
    button.style.borderRadius = "50%";
    button.style.height = "10px";
    button.style.width = "10px";
    button.style.position = "fixed";
    button.style.top = "15px";
    button.style.left = "5px";
    button.style.zIndex = "1000000";
    parent.append(button);
    button.title = "INBOX";
    button.href = "https://www.youtube.com/playlist?list=PLuEqX5XqgpJepleFG3fl9g7H53gk_K_7Z";

    // Create WATCHING playlist button
    button = document.createElement("a");
    button.id = "headerWatchingButton";
    button.style.backgroundColor = "#cdcdcd";
    button.style.borderRadius = "50%";
    button.style.height = "10px";
    button.style.width = "10px";
    button.style.position = "fixed";
    button.style.top = "28px";
    button.style.left = "5px";
    button.style.zIndex = "1000000";
    parent.append(button);
    button.title = "WATCHING";
    button.href = "https://www.youtube.com/playlist?list=PLuEqX5XqgpJfhGr0CHgKyB4lr2Yi6sA9z";

    // Create WATCHED playlist button
    button = document.createElement("a");
    button.id = "headerWatchedButton";
    button.style.backgroundColor = "#cdcd96";
    button.style.borderRadius = "50%";
    button.style.height = "10px";
    button.style.width = "10px";
    button.style.position = "fixed";
    button.style.top = "2px";
    button.style.left = (180 + 10 * 1) + "px";
    button.style.zIndex = "1000000";
    parent.append(button);
    button.title = "WATCHED";
    button.href = "https://www.youtube.com/playlist?list=PLuEqX5XqgpJd9mjK3ehcqGqtPR13wJbse";

    // Create WATCHED 2 playlist button
    button = document.createElement("a");
    button.id = "headerWatched2Button";
    button.style.backgroundColor = "#cdcd96";
    button.style.borderRadius = "50%";
    button.style.height = "10px";
    button.style.width = "10px";
    button.style.position = "fixed";
    button.style.top = "2px";
    button.style.left = (180 + 10 * 2) + "px";
    button.style.zIndex = "1000000";
    parent.append(button);
    button.title = "WATCHED 2";
    button.href = "https://www.youtube.com/playlist?list=PLuEqX5XqgpJde3cJq0JitT_1o4iQizVY8";

    // Create WATCHED 3 playlist button
    button = document.createElement("a");
    button.id = "headerWatched3Button";
    button.style.backgroundColor = "#cdcd96";
    button.style.borderRadius = "50%";
    button.style.height = "10px";
    button.style.width = "10px";
    button.style.position = "fixed";
    button.style.top = "2px";
    button.style.left = (180 + 10 * 3) + "px";
    button.style.zIndex = "1000000";
    parent.append(button);
    button.title = "WATCHED 3";
    button.href = "https://www.youtube.com/playlist?list=PLuEqX5XqgpJeqRFCuQbWJneuo7sY0xcCZ";

    // Create WATCHED 4 playlist button
    button = document.createElement("a");
    button.id = "headerWatched4Button";
    button.style.backgroundColor = "#cdcd96";
    button.style.borderRadius = "50%";
    button.style.height = "10px";
    button.style.width = "10px";
    button.style.position = "fixed";
    button.style.top = "2px";
    button.style.left = (180 + 10 * 4) + "px";
    button.style.zIndex = "1000000";
    parent.append(button);
    button.title = "WATCHED 4";
    button.href = "https://www.youtube.com/playlist?list=PLuEqX5XqgpJfPzT9QqobADlwZtcLLcu9y";

    // Create WATCHED 5 playlist button
    button = document.createElement("a");
    button.id = "headerWatched4Button";
    button.style.backgroundColor = "#cdcd96";
    button.style.borderRadius = "50%";
    button.style.height = "10px";
    button.style.width = "10px";
    button.style.position = "fixed";
    button.style.top = "2px";
    button.style.left = (180 + 10 * 5) + "px";
    button.style.zIndex = "1000000";
    parent.append(button);
    button.title = "WATCHED 5";
    button.href = "https://www.youtube.com/playlist?list=PLuEqX5XqgpJeiSIyPWHPzGrX0TNO0uerl";

    // Create WATCHED 6 playlist button
    button = document.createElement("a");
    button.id = "headerWatchedButton";
    button.style.backgroundColor = "#cdcd96";
    button.style.borderRadius = "50%";
    button.style.height = "10px";
    button.style.width = "10px";
    button.style.position = "fixed";
    button.style.top = "2px";
    button.style.left = (180 + 10 * 6) + "px";
    button.style.zIndex = "1000000";
    parent.append(button);
    button.title = "WATCHED 6";
    button.href = "https://www.youtube.com/playlist?list=PLuEqX5XqgpJeSXKN56i7Mm7yETK9uFlxA";

    // Create WATCHED 7 playlist button
    button = document.createElement("a");
    button.id = "headerWatchedButton";
    button.style.backgroundColor = "#cdcd96";
    button.style.borderRadius = "50%";
    button.style.height = "10px";
    button.style.width = "10px";
    button.style.position = "fixed";
    button.style.top = "2px";
    button.style.left = (180 + 10 * 7) + "px";
    button.style.zIndex = "1000000";
    parent.append(button);
    button.title = "WATCHED 7";
    button.href = "https://www.youtube.com/playlist?list=PLuEqX5XqgpJd43QiFDomgC7gZXwr6gGBY";

    // Create WL playlist button
    button = document.createElement("a");
    button.id = "headerWatchingButton";
    button.style.backgroundColor = "#cd9696";
    button.style.borderRadius = "50%";
    button.style.height = "10px";
    button.style.width = "10px";
    button.style.position = "fixed";
    button.style.top = "15px";
    button.style.left = "190px";
    button.style.zIndex = "1000000";
    parent.append(button);
    button.title = "WL";
    button.href = "https://www.youtube.com/playlist?list=WL";

    // Create liked videos playlist button
    button = document.createElement("a");
    button.id = "headerLikedVideosButton";
    button.style.backgroundColor = "#96cd96";
    button.style.borderRadius = "50%";
    button.style.height = "10px";
    button.style.width = "10px";
    button.style.position = "fixed";
    button.style.top = "15px";
    button.style.left = "205px";
    button.style.zIndex = "1000000";
    parent.append(button);
    button.title = "liked videos";
    button.href = "https://www.youtube.com/playlist?list=LLhZg3EQN9EVjDDwxd8Cx4_w";
}


///
/// Create a button for embedding a video.
///
function CreateEmbedButton() {
    Util.Log("CreateEmbedButton()");
    Util.Log("----------------------------------------------------------------------------------------------");

    var button = document.createElement("div");
    button.id = "embedVideoButton";
    button.style.backgroundColor = "gray";
    button.style.borderRadius = "50%";
    button.style.height = "10px";
    button.style.width = "10px";
    button.style.position = "fixed";
    button.style.top = "2px";
    button.style.left = "55px";
    button.style.zIndex = "1000000";

    var parent = document.querySelector("body");
    Util.Log("parent: ", parent);

    //parent.insertBefore(button, parent.firstChild);
    parent.append(button);
    button.title = "Embed video";

    button.addEventListener(
        "click",
        () => {
            Util.Log("Embed video");

            var href = window.location.href;
            Util.Log("URL: ", href);

            var url = new URL(href);
            var videoId = url.searchParams.get("v");

            if (href.indexOf("embed") != -1) {
                Util.Log("Unembed video");

                videoId = url.pathname.split("/")[2];

                var newHref = window.location.origin + "/watch?v=" + videoId;

                var playlistId = url.searchParams.get("playlist");

                if (playlistId != null) {
                    newHref += "&list=" + playlistId;
                }

                window.location.href = newHref;
            }
            else {
                Util.Log("Embed video");

                if (videoId != null) {
                    var newHref2 = window.location.origin + "/embed/" + videoId;

                    var playlistId2 = url.searchParams.get("list");

                    if (playlistId2 != null) {
                        newHref2 += "?playlist=" + playlistId2;
                    }

                    window.location.href = newHref2;
                }
                else {
                    Util.Error("Could not find video ID!");

                    return;
                }
            }
        }
    );
}


///
/// Initialize the "Save to..." playlist filter.
///
function InitSaveToPlaylistFilter() {
    // Call continually
    setTimeout(InitSaveToPlaylistFilter, 100);

    var filterTextbox = document.querySelector(".custom-playlist-filter-input_save-to");

    if (filterTextbox != null) {
        // Already created, do nothing
        return;
    }

    var saveToTitle = document.querySelector("#title.ytd-add-to-playlist-renderer");

    if (saveToTitle == null) {
        // 'Save to...' window not open, do nothing
        return;
    }

    Util.Log("Creating playlist filter");

    // Create input element
    filterTextbox = document.createElement("input");
    filterTextbox.type = "text";
    filterTextbox.className = "custom-playlist-filter-input custom-playlist-filter-input_save-to";
    filterTextbox.placeholder = "Filter playlists";
    filterTextbox.title = filterTextbox.placeholder;
    filterTextbox.addEventListener(
        "input",
        FilterSaveToPlaylists
    );
    var parent = saveToTitle.parentElement;
    parent.insertBefore(filterTextbox, parent.querySelector("#close-button"));

    filterTextbox.focus();
}


///
/// Filter 'Save to...' playlist list.
///
function FilterSaveToPlaylists(event) {
    Util.Log("FilterSaveToPlaylists()", event);

    var filterText = event.target.value.toLowerCase();

    // Get a list of all of the items to filter
    var items = document.querySelectorAll("ytd-playlist-add-to-option-renderer");

    var hiddenCount = 0;

    // Iterate over items, start after the first one ("Watch later")
    for (var i = 1; i < items.length; ++i) {
        var item = items[i];
        var itemText = item.textContent.trim().toLowerCase();

        //Util.Log("item: ", itemText);
        //Util.Log("filter: ", filterText);

        if (filterText == "") {
            //Util.Log("Show (filter text empty)");
            item.classList.remove("customcss-display-none");

            continue;
        }


        if (itemText.indexOf(filterText) != -1) {
            //Util.Log("Show (includes filter text)");
            item.classList.remove("customcss-display-none");
        }
        else {
            //Util.Log("Hide");
            item.classList.add("customcss-display-none");
            ++hiddenCount;
        }
    }

    Util.Log("#items: ", items.length);
    Util.Log("Hidden #items: ", hiddenCount);
}


///
/// Initialize the created playlists filter.
///
function InitCreatedPlaylistFilter() {
    // Call continually
    setTimeout(InitCreatedPlaylistFilter, 100);

    var filterTextbox = document.querySelector(".custom-playlist-filter-input_created");

    if (filterTextbox != null) {
        // Already created, do nothing
        return;
    }

    var playlistItem = document.querySelector("ytd-grid-playlist-renderer");

    var primaryItems = document.querySelector("#primary-items");

    if ((playlistItem == null) || (primaryItems == null)) {
        // No playlist items found, do nothing
        return;
    }

    Util.Log("Creating created playlists filter");

    // Create input element
    filterTextbox = document.createElement("input");
    filterTextbox.type = "text";
    filterTextbox.className = "custom-playlist-filter-input custom-playlist-filter-input_created";
    filterTextbox.placeholder = "Filter playlists";
    filterTextbox.title = filterTextbox.placeholder;
    filterTextbox.addEventListener(
        "input",
        (event) => {
            var filterText = event.target.value.toLowerCase();
            FilterCreatedPlaylists(filterText);
        }
    );

    var parent = primaryItems.parentElement;
    parent?.append(filterTextbox);

    filterTextbox.focus();
}


///
/// Filter created playlist list.
///
function FilterCreatedPlaylists(filterText) {
    Util.Log("FilterCreatedPlaylists(): ", filterText);

    // Get a list of all of the items to filter
    var items = document.querySelectorAll("ytd-grid-playlist-renderer");

    // Convert NodeList to array (for sorting)
    items = Array.prototype.slice.call(items, 0);

    // Sort playlists alphabetically
    items.sort(
        (a, b) => {
            let playlistNameA = a.querySelector("h3 a")?.getAttribute("title");
            let playlistNameB = b.querySelector("h3 a")?.getAttribute("title");

            if ((playlistNameA == "INBOX")
                || (playlistNameA == "Tykätyt videot")
                || (playlistNameA == "WATCHED")
                || (playlistNameA == "WATCHING")) {
                // Special cases, sort first
                playlistNameA = "000_" + playlistNameA;
            }
            else if (playlistNameA == "WATCHED 2") {
                // Special cases, sort last
                playlistNameA = "zzz_" + playlistNameA;
            }

            if ((playlistNameB == "INBOX")
                || (playlistNameB == "Tykätyt videot")
                || (playlistNameB == "WATCHED")
                || (playlistNameB == "WATCHING")) {
                // Special cases, sort first
                playlistNameB = "000_" + playlistNameB;
            }
            else if (playlistNameB == "WATCHED 2") {
                // Special cases, sort last
                playlistNameB = "zzz_" + playlistNameB;
            }


            return (
                (playlistNameA > playlistNameB)
                ? 1
                : (
                    (playlistNameA < playlistNameB) ? -1 : 0
                )
            );
        }
    );

    var hiddenCount = 0;

    // Iterate over items
    for (var i = 0; i < items.length; ++i) {
        var item = items[i];
        item.style.order = i;
        var itemText = item.querySelector("h3").textContent.trim().toLowerCase();
        var playlistSize = item.querySelector("ytd-thumbnail-overlay-side-panel-renderer").textContent.trim().toLowerCase();

        Util.Log("item: ", itemText);
        Util.Log("playlist size: ", playlistSize);
        Util.Log("filter: ", filterText);

        if (filterText == "") {
            //Log("Show (filter text empty)");
            item.classList.remove("customcss-display-none");

            continue;
        }


        if ((itemText.indexOf(filterText) != -1)
            || (playlistSize == filterText)) {

            //Util.Log("Show (includes filter text)");
            item.classList.remove("customcss-display-none");
        }
        else {
            //Util.Log("Hide");
            item.classList.add("customcss-display-none");
            ++hiddenCount;
        }
    }

    Util.Log("#items: ", items.length);
    Util.Log("Hidden #items: ", hiddenCount);
}


///
/// Key event listener.
///
function KeyEventListener(event) {
    //Util.Log("Caught event: ", event);

    if (event.ctrlKey && (event.key == "y")) {
        GloballyHideYouTubeNotificationCount();
    }
    else if (event.ctrlKey && event.altKey && event.shiftKey && (event.key == "P")) {
        VideoPlayPause();
    }
    else if (event.ctrlKey && event.altKey && event.shiftKey && (event.key == "E")) {
        VideoJumpToEnd();
    }
    else if (event.ctrlKey && event.altKey && event.shiftKey && (event.key == "S")) {
        VideoJumpToStart();
    }
    else if (event.ctrlKey && event.altKey && event.shiftKey && (event.key == "F")) {
        VideoJumpForward(10);
    }
    else if (event.ctrlKey && event.altKey && event.shiftKey && (event.key == "B")) {
        VideoJumpBackward(10);
    }
}


///
/// Handle a "special" click on the notification button.
///
function HandleNotificationButtonSpecialClick(event) {
    Util.Log("Notification button special click");
    Util.Log(event);

    // Prevent default click action
    event.preventDefault();
    event.stopPropagation();

    GloballyHideYouTubeNotificationCount();
}


///
/// "Fix" a playlist link (go to the playlist, not the first video in it).
///
function FixPlaylistLink(a) {
    const playlistLinkFixRegex = /watch\?v=[a-zA-Z0-9_-]+&list=/;
    a.href = a.href.replace(playlistLinkFixRegex, "playlist?list=");
}


///
/// Main update loop.
///
const updateLoopInterval = 100;
let time = 0;
function UpdateLoop() {
    //Util.Log("UpdateLoop()");
    time += updateLoopInterval;

    const shareUrlInput = document.querySelector("input#share-url")
    if (shareUrlInput) {
        if (shareUrlInput.value.includes("si=")) {
            console.log("Strip ?si=... from share URL")
            shareUrlInput.value = shareUrlInput.value.replace(/si=[a-zA-Z0-9_-]+&?/, "")
            shareUrlInput.value = shareUrlInput.value.replace(/\?$/, "")
        }
    }

    if (time <= 1000) {
        // Pause the video
        PauseVideo();
    }

    if (!Util.InIframe() && (!allowVideoToPlay || (document.hidden && !allowBackgroundPlayback))) {
        // Pause the video
        PauseVideo();
    }

    // Add video title to video controls (so I don't have to scroll down)
    var leftControls = document.querySelector(".ytp-left-controls");
    var videoTitle = document.querySelector("#info h1.title")?.textContent || "";
    var titleInControls = leftControls?.querySelector(".mod-title");
    if ((leftControls != null) && (titleInControls == null)) {
        titleInControls = document.createElement("p");
        titleInControls.className = "mod-title";
        titleInControls.style.cssText = (
            "background: black; "
            + "height: 1em; "
            + "line-height: 1em; "
            + "margin: auto 0 auto 1em; "
            + "padding: 2px; "
        );
        leftControls.append(titleInControls);
    }
    else if ((titleInControls != null) && !titleInControls.textContent.includes(videoTitle)) {
        titleInControls.textContent = videoTitle;
    }

    if (!notificationButtonListenerSet) {
        var notificationButton = GetNotificationButton();

        if (notificationButton != null) {
            notificationButton.addEventListener(
                "contextmenu",
                (event) => {
                    Util.Log("Notification button right click");
                    HandleNotificationButtonSpecialClick(event);
                }
            );
            notificationButton.addEventListener(
                "mouseup",
                (event) => {
                    Util.Log("Notification button click");
                    Util.Log(event);
                    if (event && (event.button == 1)) {
                        Util.Log("Notification button middle click");
                        HandleNotificationButtonSpecialClick(event);
                    }
                }
            );
            notificationButtonListenerSet = true;
        }
    }

    var newUpdateCounter = parseInt(
        window.localStorage.getItem("updateCounter") || "0"
    );

    if (newUpdateCounter > updateCounter) {
        Util.Log("Found higher update counter: " + newUpdateCounter);

        //PauseVideo();

        HideYouTubeNotificationCount();

        // Sync counter
        updateCounter = newUpdateCounter;
    }

    // Check if the current page is the list of playlists
    if (window.location.href.match("youtube\.com/.*/playlists$")) {
        // "Fix" video title links
        document.querySelectorAll("a#video-title").forEach(FixPlaylistLink);
        // "Fix" video thumbnail links
        document.querySelectorAll("a#thumbnail").forEach(FixPlaylistLink);
    }
}


///
/// Set video speed.
///
function SetSpeed(newSpeed,
                  video = document.getElementsByTagName("video")[0]) {
    //Util.Log("SetSpeed()");
    speed = newSpeed;

    if (speed < 0) {
        Util.Warn("Cannot set negative speed");
        speed = 0;
    }

    UpdateSpeedDisplay();

    if (video == null) {
        return;
    }

    video.playbackRate = speed;
    //FocusVideo();
}


///
/// Create speed display element.
///
function CreateSpeedDisplay(parent) {
    Util.Log("CreateSpeedDisplay()");

    speedDisplay = document.createElement("span");
    speedDisplay.style.color = "white";
    //speedDisplay.style.mixBlendMode = "difference";
    speedDisplay.style.fontSize = "1.5em";

    if (!controlsOnVideo) {
        speedDisplay.style.margin = "0 10px 0 10px";
    }

    parent.append(speedDisplay);

    // Listen for playbackRate changes
    /*/
    var video = document.getElementsByTagName("video")[0];
    video.addEventListener(
        "ratechange",
        UpdateSpeedDisplay
    );
    // */

    // First update
    UpdateSpeedDisplay();
}


///
/// Update the speed display.
///
function UpdateSpeedDisplay() {
    //Util.Log("UpdateSpeedDisplay()");

    if (speedDisplay == null) {
        return;
    }

    speedDisplay.textContent = speed.toFixed(2);
}


///
/// Create a button.
///
function CreateButton(parent, content, clickCallback) {
    //Util.Log("CreateButton()");

    var button = document.createElement("button");
    button.style.background = "none";
    button.style.border = "1px solid grey";
    button.style.color = "white";
    //button.style.mixBlendMode = "difference";
    button.style.minWidth = "35px";
    button.textContent = content;

    if (controlsOnVideo) {
        button.style.display = "block";
    }

    parent.append(button);

    // Set event listeners for click, right click and middle click
    button.addEventListener("click", clickCallback);
    button.addEventListener("contextmenu", clickCallback);
    button.addEventListener("auxclick", clickCallback);

    return button;
}


var continuationsObserver = null;

///
/// Load all playlists.
///
function LoadAllPlaylists() {
    Util.Log("LoadAllPlaylists()");

    var contents = document.querySelector("#contents");
    //var continuations = contents.querySelector("#continuations");
    var continuations = contents.querySelector("ytd-continuation-item-renderer");
    continuations.style.transformOrigin = "top";

    // Scroll down a bit (YouTube wants a mouseover on the list)
    window.scrollTo(0, 50);
    window.scrollTo(0, 0);

    var filterInput = document.querySelector(".custom-playlist-filter-input_created");
    if (filterInput != null) {
        filterInput.focus();
    }

    if (continuationsObserver == null) {
        Util.Log("Set continuationsObserver");

        continuationsObserver = new MutationObserver(
            (mutationsList) => {
                Util.Log("continuations changed");
                //Util.Log("mutationsList: ", mutationsList);

                var spinner = contents.querySelector("ytd-continuation-item-renderer");

                if (spinner == null) {
                    Util.Log("Spinner gone");
                    contents.style.transform = "scale(1.0, 1.0)";

                    // Trigger playlist sorting
                    FilterCreatedPlaylists("");
                }

                /*/
                if (continuations != null) {
                    continuations.style.transform = "scale(1.0, 1.0)";
                }
                //*/
            }
        );

        continuationsObserver.observe(
            //continuations,
            contents,
            {
                childList: true,
                subtree: true
            }
        );
    }

    if (contents.classList.contains("custom-scaled-down")) {
        contents.style.transform = "scale(1.0, 1.0)";

        if (continuations != null) {
            continuations.style.transform = "scale(1.0, 1.0)";
        }
    }
    else {
        contents.classList.add("custom-scaled-down");
        contents.style.transformOrigin = "top";
        contents.style.transform = "scale(1.0, 0.02)";

        if (continuations != null) {
            continuations.style.transform = "scale(1.0, 50.0)";
        }
    }
}

///
/// Initialize the playlist scale button.
///
function InitPlaylistScaleButton() {
    var parent = document.querySelector("#primary-items");

    if (parent == null) {
        setTimeout(InitPlaylistScaleButton, 1000);

        return;
    }

    var button = CreateButton(
        parent,
        "Load all",
        LoadAllPlaylists
    );

    button.style.position = "absolute";
    button.style.right = "13em";

    // Load all playlists
    //LoadAllPlaylists();
}


///
/// Pause the video.
///
function PauseVideo() {
    var video = document.getElementsByTagName("video")[0];

    if (video == null) {
        return;
    }

    if (video.paused) {
        // Already paused
        return;
    }

    Util.Log("PauseVideo()");

    video.pause();

    //FocusVideo();

    if (!document.hasFocus() && (video.currentTime <= 5)) {
        video.currentTime = 0;
    }
}


///
/// Play the video.
///
function PlayVideo() {
    Util.Log("PlayVideo()");

    var video = document.getElementsByTagName("video")[0];

    if (video == null) {
        return;
    }

    video.play();

    FocusVideo();

    if (!document.hasFocus() && (video.currentTime <= 5)) {
        video.currentTime = 0;
    }
}


function OnVisibilityChange() {
    Util.Log("OnVisibilityChange()");

    HideYouTubeMenus();

    if (!allowBackgroundPlayback && document.hidden) {
        PauseVideo();
    }
}


///
/// Set the playback rate of all videos.
///
function FixPlaybackRates() {
    //Util.Log("FixPlaybackRates()");

    var videos = document.getElementsByTagName("video");

    for (var video of videos) {
        SetSpeed(speed, video);
    }

    setTimeout(
        FixPlaybackRates,
        500
    );
}


///
/// Copy the video ID to the clipboard or refresh to a page with no extra URL query parameters.
///
function IdButtonClick(event) {
    Util.Log("IdButtonClick()");
    Util.Log(event.ctrlKey);

    // Prevent click from passing through the button
    event.stopPropagation();
    event.preventDefault();

    var url = new URL(window.location);
    var videoId = url.searchParams.get("v");

    if (videoId != null) {
        if (event.ctrlKey) {
            Util.Log("Removing all 'extra' query parameters from URL");
            window.location.href = "https://www.youtube.com/watch?v=" + videoId;
        }
        else {
            Util.Log("Set video ID to clipboard");
            navigator.clipboard.writeText(videoId);
        }
    }
    else {
        Util.Log("Video ID was null, doing nothing");
    }
}


///
/// Initialise controls.
///
function InitControls() {
    /*
    var controlsContainerParent = document.getElementById("info-contents");

    if (controlsOnVideo) {
        controlsContainerParent = document.getElementById("page-manager");

        if (controlsContainerParent == null) {
            controlsContainerParent = document.getElementById("player");
        }
    }
    /*/
    // */

    var video = document.getElementsByTagName("video")[0];

    var controlsContainerParent = video?.parentElement;

    if ((controlsContainerParent == null) || (video == null)) {
        // Can't init yet, try again in a while

        //Util.Log("InitControls() unsuccessful, trying again later");

        setTimeout(InitControls, 100);

        return;
    }

    Util.Log("InitControls()");

    controlsContainerParent.style.position = "relative";

    var controlsContainer = document.createElement("div");
    controlsContainer.id = "controlsContainer";
    controlsContainer.style.cssText = (
        "text-align: center;"
        + "position: absolute;"
        + "    top: 15px;"
        + "    left: 0;"
        + "z-index: 10000;"
    );

    if (controlsContainerParent.id == "player") {
        controlsContainer.style.top = "25px";
    }

    controlsContainerParent.append(controlsContainer);

    CreateSpeedDisplay(controlsContainer);

    var allowVideoToPlayButton = null;
    allowVideoToPlayButton = CreateButton(
        controlsContainer,
        "☑",
        (event) => {
            event.preventDefault();
            event.stopPropagation();

            allowVideoToPlay = !allowVideoToPlay;

            if (allowVideoToPlay) {
                allowVideoToPlayButton.textContent = "☑";
                allowVideoToPlayButton.style.background = "green";
                setTimeout(PlayVideo, 100);
            }
            else {
                allowVideoToPlayButton.textContent = "☐";
                allowVideoToPlayButton.style.background = "red";
            }
        }
    );
    allowVideoToPlayButton.style.background = "green";
    //allowVideoToPlayButton.style.mixBlendMode = "none";

    var allowBackgroundPlaybackButton = null;
    allowBackgroundPlaybackButton = CreateButton(
        controlsContainer,
        "b ☐",
        (event) => {
            event.preventDefault();
            event.stopPropagation();

            allowBackgroundPlayback = !allowBackgroundPlayback;

            if (allowBackgroundPlayback) {
                allowBackgroundPlaybackButton.textContent = "b ☑";
                allowBackgroundPlaybackButton.style.background = "green";
                // Also allow playback automatically
                allowVideoToPlay = true;
                allowVideoToPlayButton.textContent = "☑";
                allowVideoToPlayButton.style.background = "green";
                setTimeout(PlayVideo, 100);
            }
            else {
                allowBackgroundPlaybackButton.textContent = "b ☐";
                allowBackgroundPlaybackButton.style.background = "red";
            }
        }
    );
    allowBackgroundPlaybackButton.style.background = "red";
    //allowBackgroundPlaybackButton.style.mixBlendMode = "none";

    /*/
    CreateButton(
        controlsContainer,
        "-",
        () => {
            SetSpeed(speed - 0.1);
        }
    );
    CreateButton(
        controlsContainer,
        "+",
        () => {
            SetSpeed(speed + 0.1);
        }
    );
    // */
    CreateButton(
        controlsContainer,
        "1.0",
        (event) => {
            // Prevent click from passing through the button
            event.stopPropagation();
            event.preventDefault();

            SetSpeed(1.0);
        }
    );
    CreateButton(
        controlsContainer,
        "2.0",
        (event) => {
            // Prevent click from passing through the button
            event.stopPropagation();
            event.preventDefault();

            SetSpeed(2.0);
        }
    );
    /*/
    CreateButton(
        controlsContainer,
        "3.0",
        () => {
            SetSpeed(3.0);
        }
    );
    CreateButton(
        controlsContainer,
        "4.0",
        () => {
            SetSpeed(4.0);
        }
    );
    // */

    CreateButton(
        controlsContainer,
        "ID",
        IdButtonClick
    );

    // Create mouse wheel event listener (change speed by scrolling)
    controlsContainer.addEventListener(
        "wheel",
        (event) => {
            Util.Log("Changing speed with mouse wheel");
            Util.Log(event);

            // Don't scroll the page
            event.preventDefault();
            event.stopPropagation();

            if (event.deltaY < 0) {
                Util.Log("Scroll up, increase speed by 0.1");
                SetSpeed(speed + 0.1);
            }
            else if (event.deltaY > 0) {
                Util.Log("Scroll down, decrease speed by 0.1");
                SetSpeed(speed - 0.1);
            }
            else if (event.deltaX < 0) {
                Util.Log("Scroll left, decrease speed by 1.0");
                SetSpeed(speed - 1.0);
            }
            else if (event.deltaX > 0) {
                Util.Log("Scroll right, increase speed by 1.0");
                SetSpeed(speed + 1.0);
            }
        }
    );
}

///
/// Skip ads.
///
function SkipAds() {
    //Util.Log("SkipAds()");

    var buttons = document.querySelectorAll(".ytp-ad-skip-button");
    //Util.Log(buttons);

    for (var button of buttons) {
        Util.Log("Clicking skip ad button");
        button.dispatchEvent(Util.CreateClickEvent());
    }

    setTimeout(
        () => {
            SkipAds();
        },
        500
    );
}


///
/// Parse external ID from script element text content.
///
function ParseExternalId(textContent) {
    if (!textContent.includes("ytInitialData") || !textContent.includes("externalId")) {
        return null;
    }

    Util.Log("Found \"externalId\" in script element");

    Util.Log("DEBUG", "textContent:", textContent);

    // Strip the content to just JSON
    textContent = textContent.replace(/^\s*var\s+\w+\s*=\s*/, "");
    textContent = textContent.replace(/;$/, "");

    Util.Log("DEBUG", "textContent:", textContent);

    try {
        // Parse the JSON
        const data = JSON.parse(textContent);
        var externalId = data?.metadata?.channelMetadataRenderer?.externalId;
        Util.Warn("External channel ID: ", externalId);

        return externalId;
    }
    catch (e) {
        Util.Error("Failed to parse JSON:", e);
    }

    return null;
}


///
/// Create external ID element.
///
function CreateExternalIdElement(externalId) {
    if (externalId == null) {
        return;
    }

    let channelNameElement = document.querySelector("#page-header h1");
    //Util.Log("Channel name element:", channelNameElement);

    if (channelNameElement == null) {
        // Channel name element not found
        return;
    }

    let parent = channelNameElement.parentElement.parentElement;

    let existingExternalIdElement = parent.querySelector(".mod-external-id");
    if (existingExternalIdElement != null) {
        // Element has already been created
        return;
    }

    Util.Log("Creating external ID element for ID: " + externalId);

    if (window.trustedTypes.defaultPolicy == null) {
        // Without this, YouTube will block using `innerHTML`
        window.trustedTypes.createPolicy('default', {createHTML: (string, sink) => string})
    }

    let externalIdElement = document.createElement("p");
    externalIdElement.className = "mod-external-id";
    externalIdElement.innerHTML = (
        "Channel ID: "
        + "<a style=\"color: #3ea6ff;\" href=\"/channel/" + externalId + "/videos\">"
        + externalId
        + "</a>"
    );
    externalIdElement.style.color = "rgb(170, 170, 170)";
    externalIdElement.style.fontSize = "1.4em";

    parent.append(externalIdElement);
}


///
/// Sidebar "other" playlists dropdown change listener.
///
function OnSidebarDropdownChange(event) {
    const dropdownElement = event.target;
    const selectedValue = dropdownElement[dropdownElement.selectedIndex].value;
    Util.Log(`Dropdown changed value (index ${dropdownElement.selectedIndex}):`, selectedValue);

    if (dropdownElement.selectedIndex == 0) {
        return;
    }

    var selectedItem = sidebarButtons.find(button => button.text == selectedValue);
    if (selectedItem != null) {
        Util.Log("Redirecting to:", selectedItem.href);
        /*/
        window.location.href = selectedItem.href;
        /*/
        window.open(selectedItem.href);
        //*/
    }
}


///
/// Create a custom sidebar (replace the mostly useless sidebar buttons).
///
function CreateCustomSidebar() {
    const sidebar = document.querySelector("ytd-mini-guide-renderer");
    const parent = sidebar;
    //const parent = sidebar?.querySelector(".custom-sidebar-button-parent");

    if (parent == null) {
        // Not ready to create buttons
        setTimeout(CreateCustomSidebar, 100);

        return;
    }

    /**/
    let button = parent.querySelector(".custom-sidebar-button");

    if (button != null) {
        // Buttons already created
        setTimeout(CreateCustomSidebar, 100);

        return;
    }
    //*/

    Util.Log("CreateCustomSidebar()");

    //let button = null;

    const sidebarDefaultCallback = (event, sidebarButton) => {
        event.preventDefault();

        if (event.button == 1) {
            // Middle click opens in new tab
            window.open(sidebarButton.href);
        }
        else {
            // Other clicks open in current tab
            window.location.href = sidebarButton.href;
        }
    };

    var dropdownItems = [];

    for (const sidebarButton of sidebarButtons) {
        if (!sidebarButton.highlight) {
            // Add only to the dropdown menu
            dropdownItems.push(sidebarButton);

            continue;
        }

        button = CreateButton(
            parent,
            "",
            (event) => {
                if (sidebarButton.callback != null) {
                    sidebarButton.callback(event, sidebarButton);
                }
                else {
                    sidebarDefaultCallback(event, sidebarButton);
                }
            }
        );
        button.className = "custom-sidebar-button";
        button.style.cssText = (
            button.style.cssText
            + (sidebarButton.cssText || "")
        );
        button.style.border = "0";
        button.style.cursor = "pointer";
        button.style.fontSize = "12px";
        button.style.padding = "0";
        button.style.width = "72px";

        if (sidebarButton.tooltip != null) {
            button.title = sidebarButton.tooltip;
        }

        // Save text and tooltip to data attributes
        button.dataset.text = sidebarButton.text;
        button.dataset.tooltip = button.title;

        if (sidebarButton.href == window.location.href) {
            button.style.background = "#666666";
        }

        const nameDiv = document.createElement("div");
        nameDiv.className = "playlist-name";
        nameDiv.textContent = sidebarButton.text;
        button.appendChild(nameDiv);

        const countDiv = document.createElement("div");
        countDiv.className = "playlist-extra-info playlist-video-count";
        const videoCount = sidebarButton.tooltip.split(" ")[0];
        countDiv.textContent = videoCount + " videos";
        button.appendChild(countDiv);

        const timeDiv = document.createElement("div");
        timeDiv.className = "playlist-extra-info playlist-total-time";
        const totalTime = sidebarButton.tooltip.split(" = ")[1];
        timeDiv.textContent = totalTime;
        button.appendChild(timeDiv);
    }

    var dropdownElement = null;

    for (const dropdownItem of dropdownItems) {
        if (dropdownElement == null) {
            dropdownElement = document.createElement("select");
            dropdownElement.style.margin = "5px 0 0 0";
            dropdownElement.addEventListener(
                "change",
                OnSidebarDropdownChange
            );
            parent.appendChild(dropdownElement);

            var firstItem = document.createElement("option");
            firstItem.value = "other...";
            firstItem.text = "other...";
            dropdownElement.appendChild(firstItem);
        }

        var dropdownItemElement = document.createElement("option");
        dropdownItemElement.value = dropdownItem.text;
        dropdownItemElement.text = dropdownItem.text;
        dropdownElement.appendChild(dropdownItemElement);
    }

    // Call again (YouTube can delete the custom buttons after page load)
    setTimeout(CreateCustomSidebar, 1000);
}


function ShowPlaylistDurations(event) {
    if (event.repeat || event.code != "AltLeft") {
        return;
    }

    Util.Log("ShowPlaylistDurations()", event);

    var buttons = document.querySelectorAll(".custom-sidebar-button");

    buttons.forEach(
        (button) => {
            Util.Log(button);
            if (event.type == "keydown") {
                // Duration in button text, normal button text in tooltip
                button.querySelector(".playlist-name").textContent = button.dataset.tooltip.split(" ").at(-1);
                button.title = button.dataset.text;
            }
            else if (event.type == "keyup") {
                // Restore button text and tooltip
                button.querySelector(".playlist-name").textContent = button.dataset.text;
                button.title = button.dataset.tooltip;
            }
        }
    );
}


///
/// Initialize.
///
function Init() {
    Util.Log("Init()");

    setInterval(UpdateLoop, updateLoopInterval);

    document.addEventListener(
        "keydown",
        KeyEventListener,
        true
    );

    document.addEventListener(
        "keydown",
        ShowPlaylistDurations,
        true
    );
    document.addEventListener(
        "keyup",
        ShowPlaylistDurations,
        true
    );

    FixPlaybackRates();

    SkipAds();

    PauseVideo();

    InitControls();

    document.addEventListener(
        "visibilitychange",
        OnVisibilityChange
    );

    CreateCustomSidebar();
    CreateHomeButtons();
    CreateEmbedButton();

    InitSaveToPlaylistFilter();
    InitCreatedPlaylistFilter();

    InitPlaylistScaleButton();

    /*/
    const url = window.location.href;
    if (!url.includes("/channel/")
        && !url.includes("/c/")
        && !url.includes("/user/")) {

        Util.Warn("Not a channel page, not looking for channel ID");

        return;
    }
    // */

    let externalId = null;

    // Loop over current script elements
    var scriptElements = document.body.querySelectorAll("script");
    for (let scriptElement of scriptElements) {
        externalId = ParseExternalId(scriptElement.textContent);

        if (externalId != null) {
            // External ID found, stop searching for it

            break;
        }
    }

    if (externalId != null) {
        setInterval(
            () => {
                CreateExternalIdElement(externalId);
            },
            2500
        );
    }

    // Create observer for script elements that are added later
    const scriptElementObserver = new MutationObserver(
        (mutations, _) => {
            if (externalId != null) {
                // External ID was found, stop observing
                scriptElementObserver.disconnect();

                return;
            }

            for (const mutation of mutations) {
                //Util.Log("DEBUG", "mutation:", mutation);
                for (let element of mutation.addedNodes) {
                    //Util.Log("DEBUG", "Added node type:", element.nodeType);
                    if (element.nodeType == "script") {
                        externalId = ParseExternalId(element.textContent);
                        CreateExternalIdElement(externalId);

                        if (externalId != null) {
                            // External ID was found, stop observing
                            scriptElementObserver.disconnect();

                            return;
                        }
                    }
                }
            }
        }
    );

    if (externalId == null) {
        // External ID not found yet, observe
        scriptElementObserver.observe(
            document.body,
            {
                childList: true,
                subtree: false
            }
        );
    }
}


(
    () => {
        "use strict";
        Init();
    }
)();
