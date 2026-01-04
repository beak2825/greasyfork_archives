// ==UserScript==
// @name         TikTok Video Downloader
// @namespace    https://www.laconicdesigns.com
// @version      0.1
// @description  Adds a download button to tiktok.com/@profile/video pages. Click a video, the icon is added by the social media share buttons. Right click the icon, and save as. Left click takes you to the video in your browser.
// @author       Blake B
// @match        https://www.tiktok.com/@*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391936/TikTok%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/391936/TikTok%20Video%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function showDownloadButton(url_to_download) {
        if (document.body.contains(document.getElementById("blake_dl_btn")) == true) {
            document.getElementByid("blake_dl_btn").remove(); //It pulls 2 links at a time because of the one on the main page.
        }
        var elem_button = document.createElement("A"); //Anchor tag
        elem_button.setAttribute("href", url_to_download); //Download URL
        elem_button.setAttribute("id", "blake_dl_btn"); //So we can find it later
        
        //This is the icon. It's the easiest way to do this, and keep it shareable.
        elem_button.innerHTML = "<img style=\"max-width: 20px;\" src=\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjQzOC41MzNweCIgaGVpZ2h0PSI0MzguNTMzcHgiIHZpZXdCb3g9IjAgMCA0MzguNTMzIDQzOC41MzMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQzOC41MzMgNDM4LjUzMzsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPGc+DQoJCTxwYXRoIGQ9Ik00MDkuMTMzLDEwOS4yMDNjLTE5LjYwOC0zMy41OTItNDYuMjA1LTYwLjE4OS03OS43OTgtNzkuNzk2QzI5NS43MzYsOS44MDEsMjU5LjA1OCwwLDIxOS4yNzMsMA0KCQkJYy0zOS43ODEsMC03Ni40Nyw5LjgwMS0xMTAuMDYzLDI5LjQwN2MtMzMuNTk1LDE5LjYwNC02MC4xOTIsNDYuMjAxLTc5LjgsNzkuNzk2QzkuODAxLDE0Mi44LDAsMTc5LjQ4OSwwLDIxOS4yNjcNCgkJCWMwLDM5Ljc4LDkuODA0LDc2LjQ2MywyOS40MDcsMTEwLjA2MmMxOS42MDcsMzMuNTkyLDQ2LjIwNCw2MC4xODksNzkuNzk5LDc5Ljc5OGMzMy41OTcsMTkuNjA1LDcwLjI4MywyOS40MDcsMTEwLjA2MywyOS40MDcNCgkJCXM3Ni40Ny05LjgwMiwxMTAuMDY1LTI5LjQwN2MzMy41OTMtMTkuNjAyLDYwLjE4OS00Ni4yMDYsNzkuNzk1LTc5Ljc5OGMxOS42MDMtMzMuNTk2LDI5LjQwMy03MC4yODQsMjkuNDAzLTExMC4wNjINCgkJCUM0MzguNTMzLDE3OS40ODUsNDI4LjczMiwxNDIuNzk1LDQwOS4xMzMsMTA5LjIwM3ogTTM1My43NDIsMjk3LjIwOGMtMTMuODk0LDIzLjc5MS0zMi43MzYsNDIuNjMzLTU2LjUyNyw1Ni41MzQNCgkJCWMtMjMuNzkxLDEzLjg5NC00OS43NzEsMjAuODM0LTc3Ljk0NSwyMC44MzRjLTI4LjE2NywwLTU0LjE0OS02Ljk0LTc3Ljk0My0yMC44MzRjLTIzLjc5MS0xMy45MDEtNDIuNjMzLTMyLjc0My01Ni41MjctNTYuNTM0DQoJCQljLTEzLjg5Ny0yMy43OTEtMjAuODQzLTQ5Ljc3Mi0yMC44NDMtNzcuOTQxYzAtMjguMTcxLDYuOTQ5LTU0LjE1MiwyMC44NDMtNzcuOTQzYzEzLjg5MS0yMy43OTEsMzIuNzM4LTQyLjYzNyw1Ni41MjctNTYuNTMNCgkJCWMyMy43OTEtMTMuODk1LDQ5Ljc3Mi0yMC44NCw3Ny45NDMtMjAuODRjMjguMTczLDAsNTQuMTU0LDYuOTQ1LDc3Ljk0NSwyMC44NGMyMy43OTEsMTMuODk0LDQyLjYzNCwzMi43MzksNTYuNTI3LDU2LjUzDQoJCQljMTMuODk1LDIzLjc5MSwyMC44MzgsNDkuNzcyLDIwLjgzOCw3Ny45NDNDMzc0LjU4LDI0Ny40MzYsMzY3LjYzNywyNzMuNDE3LDM1My43NDIsMjk3LjIwOHoiLz4NCgkJPHBhdGggZD0iTTMxMC42MzMsMjE5LjI2N0gyNTUuODJWMTE4Ljc2M2MwLTIuNjY2LTAuODYyLTQuODUzLTIuNTczLTYuNTY3Yy0xLjcwNC0xLjcwOS0zLjg5NS0yLjU2OC02LjU1Ny0yLjU2OGgtNTQuODIzDQoJCQljLTIuNjY0LDAtNC44NTQsMC44NTktNi41NjcsMi41NjhjLTEuNzE0LDEuNzE1LTIuNTcsMy45MDEtMi41Nyw2LjU2N3YxMDAuNWgtNTQuODE5Yy00LjE4NiwwLTcuMDQyLDEuOTA1LTguNTY2LDUuNzA5DQoJCQljLTEuNTI0LDMuNjIxLTAuODU0LDYuOTQ3LDEuOTk5LDkuOTk2bDkxLjM2Myw5MS4zNjFjMi4wOTYsMS43MTEsNC4yODMsMi41NjcsNi41NjcsMi41NjdjMi4yODEsMCw0LjQ3MS0wLjg1Niw2LjU2OS0yLjU2Nw0KCQkJbDkxLjA3Ny05MS4wNzNjMS45MDItMi4yODMsMi44NTEtNC41NzYsMi44NTEtNi44NTJjMC0yLjY2Mi0wLjg1NS00Ljg1My0yLjU3My02LjU3DQoJCQlDMzE1LjQ4OSwyMjAuMTIyLDMxMy4yOTksMjE5LjI2NywzMTAuNjMzLDIxOS4yNjd6Ii8+DQoJPC9nPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=\" />"; //This needs to be set to an svg download icon
        var share_buttons = document.getElementsByClassName("_share_content");
        share_buttons[share_buttons.length - 1].appendChild(elem_button);
    }

    var element_to_observe = document.body; //I Watch Everything...
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length == 1) {
                var top_node = mutation.addedNodes[0]; // The added node
                var vid_node_total = top_node.getElementsByTagName("VIDEO").length; // Looking for <video> tags
                if (vid_node_total > 0) { //Found some
                    // console.log("Vid Nodes Found: " + vid_node_total); //This many
                    var vid_node = top_node.getElementsByTagName("VIDEO")[0]; // Got whole element
                    if (vid_node) {
                        var video_source = vid_node.getAttribute("src"); // <video src="this">
                        // console.log("Showing Download Button With a href of: " + video_source);
                        showDownloadButton(video_source); // Show the download icon.
                    }
                }
            }
            else if (mutation.addedNodes.length > 1) {
                console.log("More than 1 node added.");
            }
        });
    });
    console.log("Starting Observation...");
    observer.observe(element_to_observe, { childList: true, subtree: true });


})();