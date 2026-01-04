// ==UserScript==
// @name         YouTube Playlist Export (YAYTools)
// @namespace    YAYLISTS
// @version      0.2.0
// @description  Shows a list of the playlist video names/channels/URLs with timestamps in plaintext to be easily copied
// @author       Chris
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @include      https://www.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/497035/YouTube%20Playlist%20Export%20%28YAYTools%29.user.js
// @updateURL https://update.greasyfork.org/scripts/497035/YouTube%20Playlist%20Export%20%28YAYTools%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Script started");

    // Config variables with default values
    var getVideoTitle = GM_getValue("getVideoTitle", true);
    var getVideoChannel = GM_getValue("getVideoChannel", false);
    var getVideoURL = GM_getValue("getVideoURL", false);
    var showTimestamps = GM_getValue("showTimestamps", false);
    var videoListSeperator = GM_getValue("videoListSeperator", "|:|");

    var listCreationAllowed = true;
    var urlAtLastCheck = "";

    // URL change detection
    setInterval(function(){
        if (urlAtLastCheck !== window.location.href) {
            console.log("URL has changed to", window.location.href);
            urlAtLastCheck = window.location.href;
            if (urlAtLastCheck.includes("/playlist?list=")) {
                InsertButtonASAP();
            }
        }
    }, 100);

    // Insert the export button into the YouTube interface
    function InsertButtonASAP() {
        console.log("InsertButtonASAP called");
        let buttonInsertInterval = setInterval(function(){
            const buttonContainer = document.querySelector("tp-yt-paper-listbox#items");
            if (document.getElementById("exportPlainTextList") === null && buttonContainer) {
                console.log("Inserting export button...");
                
                let div = document.createElement('tp-yt-paper-item');
                div.id = 'exportPlainTextList';
                div.setAttribute('role', 'option');
                div.style.cursor = 'pointer';
                div.style.height = '36px';
                div.style.lineHeight = '36px'; // Ensures vertical alignment
                div.style.width = '100%';
                div.style.display = 'flex';
                div.style.alignItems = 'center';
                div.style.padding = '0 12px 0 16px';
                div.style.boxSizing = 'border-box';

                let icon = document.createElement('yt-icon');
                icon.setAttribute('slot', 'start-icon');
                icon.style.marginRight = '16px';

                let img = document.createElement('img');
                img.src = 'https://i.imgur.com/7SYt028.png';
                img.style.height = '24px';
                img.style.width = '24px';
                img.style.filter = 'invert(1)'; // Ensures the icon is white
                img.style.marginRight = '16px';

                let span = document.createElement('span');
                span.textContent = 'Get Tracklist';
                span.style.color = '#F1F1F1'; // Ensure the text is white
                span.style.whiteSpace = 'nowrap';
                span.style.fontSize = '14px'; // Fixed size
                span.style.fontFamily = 'Roboto, Arial, sans-serif'; // Matches YouTube's font
                span.style.fontWeight = '400';

                div.appendChild(icon);
                div.appendChild(img);
                div.appendChild(span);

                div.addEventListener('click', ScrollUntillAllVisible);
                buttonContainer.insertBefore(div, buttonContainer.firstChild);

                // Add hover effect
                div.addEventListener('mouseenter', function() {
                    div.style.backgroundColor = 'var(--yt-spec-10-percent-layer)';
                });
                div.addEventListener('mouseleave', function() {
                    div.style.backgroundColor = '';
                });

                clearInterval(buttonInsertInterval);
                console.log("Button inserted successfully");
            } else {
                console.log("Button not inserted yet, retrying...");
            }
        }, 100);
    }

    function ScrollUntillAllVisible() {
        if (!listCreationAllowed) {
            console.log("List creation not allowed, exiting ScrollUntillAllVisible");
            return;
        }

        console.log("Scrolling until all videos are visible...");
        document.querySelector("ytd-browse[page-subtype='playlist']").click();

        listCreationAllowed = false;

        let message = document.createElement('p');
        message.id = "listBuildMessage";
        message.style.color = "red";
        message.style.fontSize = "1.33em";
        message.textContent = "Getting list... please click out of the popup to continue autoscrolling...";

        document.querySelector("#exportPlainTextList").insertAdjacentElement('afterend', message);

        let scrollInterval = setInterval(function(){
            if (document.querySelector("ytd-continuation-item-renderer.ytd-playlist-video-list-renderer")) {
                window.scrollTo(0, document.body.scrollHeight);
            } else {
                console.log("All videos visible, stopping scroll");
                document.querySelector("#listBuildMessage").remove();
                DisplayListOptions();
                clearInterval(scrollInterval);
            }
        }, 100);
    }

    function DisplayListOptions() {
        console.log("Displaying list options");

        let container = document.createElement('div');
        container.id = "listDisplayContainer";
        container.style.position = 'fixed';
        container.style.zIndex = '9999';
        container.style.margin = '0 auto';
        container.style.backgroundColor = '#464646';
        container.style.padding = '10px';
        container.style.borderRadius = '5px';
        container.style.left = '0';
        container.style.right = '0';
        container.style.maxWidth = '100vw';
        container.style.width = '1200px';
        container.style.height = '900px';
        container.style.maxHeight = '90vh';
        container.style.top = '5vh';
        container.style.resize = 'both';
        container.style.overflow = 'hidden';

        let header = document.createElement('p');
        header.style.textAlign = "center";

        let title = document.createElement('span');
        title.style.fontSize = "21px";
        title.style.fontWeight = "bold";
        title.style.color = "#d9d9d9";
        title.textContent = "Select options";

        let closeButton = document.createElement('button');
        closeButton.id = "closeTheListThing";
        closeButton.textContent = "X";
        closeButton.style.float = 'right';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.backgroundColor = 'RGBA(255,255,255,0.25)';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '17px';
        closeButton.style.borderRadius = '10px';
        closeButton.style.height = '25px';
        closeButton.style.width = '25px';
        closeButton.style.cursor = 'pointer';

        closeButton.addEventListener('click', function(){
            console.log("Closing list display container");
            document.querySelector("#listDisplayContainer").remove();
            listCreationAllowed = true;
        });

        header.appendChild(title);
        header.appendChild(closeButton);

        let textarea = document.createElement('textarea');
        textarea.style.display = "none";
        textarea.style.boxSizing = 'border-box';
        textarea.style.width = '100%';
        textarea.style.margin = '10px 0';
        textarea.style.height = 'calc(100% - 40px)';
        textarea.style.backgroundColor = '#262626';
        textarea.style.border = 'none';
        textarea.style.color = '#EEE';
        textarea.style.borderRadius = '5px';
        textarea.style.resize = 'none';

        let optionsList = document.createElement('ul');
        optionsList.id = "listDisplayOptions";
        optionsList.style.listStyle = "none";
        optionsList.style.fontSize = "12px";
        optionsList.style.scale = "1.4";
        optionsList.style.color = "#d9d9d9";
        optionsList.style.width = "fit-content";
        optionsList.style.margin = "40px auto";

        let createCheckboxOption = (id, text, isChecked) => {
            let listItem = document.createElement('li');
            let label = document.createElement('label');

            let checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.id = id;
            checkbox.name = id;
            checkbox.checked = isChecked;
            label.appendChild(checkbox);

            label.appendChild(document.createTextNode(" " + text));

            listItem.appendChild(label);
            return listItem;
        };

        optionsList.appendChild(createCheckboxOption("getVideoTitleCB", "Get titles", getVideoTitle));
        optionsList.appendChild(createCheckboxOption("getVideoChannelCB", "Get channel names", getVideoChannel));
        optionsList.appendChild(createCheckboxOption("getVideoURLCB", "Get URLs", getVideoURL));
        optionsList.appendChild(createCheckboxOption("showTimestampsCB", "Show timestamps", showTimestamps));

        let listItem = document.createElement('li');
        let separatorLabel = document.createElement('label');
        separatorLabel.textContent = " Name/Author/URL separator: ";

        let separatorInput = document.createElement('input');
        separatorInput.type = "text";
        separatorInput.style.width = "40px";
        separatorInput.style.textAlign = "center";
        separatorInput.id = "videoListSeperatorInput";
        separatorInput.name = "videoListSeperatorInput";
        separatorInput.value = videoListSeperator;

        separatorLabel.appendChild(separatorInput);
        listItem.appendChild(separatorLabel);
        optionsList.appendChild(listItem);

        let getListButton = document.createElement('button');
        getListButton.id = "listDisplayGetListButton";
        getListButton.style.position = "relative";
        getListButton.style.margin = "10px 0";
        getListButton.style.fontSize = "13px";
        getListButton.style.left = "50%";
        getListButton.style.transform = "translateX(-50%)";
        getListButton.textContent = "Get list";

        getListButton.addEventListener('click', BuildAndDisplayList);
        optionsList.appendChild(document.createElement('li').appendChild(getListButton));

        container.appendChild(header);
        container.appendChild(textarea);
        container.appendChild(optionsList);

        document.body.appendChild(container);

        document.querySelector("#getVideoTitleCB").addEventListener('change', function() {
            getVideoTitle = this.checked;
            GM_setValue("getVideoTitle", getVideoTitle);
        });
        document.querySelector("#getVideoChannelCB").addEventListener('change', function() {
            getVideoChannel = this.checked;
            GM_setValue("getVideoChannel", getVideoChannel);
        });
        document.querySelector("#getVideoURLCB").addEventListener('change', function() {
            getVideoURL = this.checked;
            GM_setValue("getVideoURL", getVideoURL);
        });
        document.querySelector("#showTimestampsCB").addEventListener('change', function() {
            showTimestamps = this.checked;
            GM_setValue("showTimestamps", showTimestamps);
        });
        document.querySelector("#videoListSeperatorInput").addEventListener('change', function() {
            videoListSeperator = this.value;
            GM_setValue("videoListSeperator", videoListSeperator);
        });
    }

    function BuildAndDisplayList() {
        console.log("Building and displaying list");

        document.querySelector("#listDisplayOptions").style.display = "none";
        document.querySelector("#listDisplayContainer > textarea").style.display = "block";

        let videoTitleArr = [];
        let videoChannelArr = [];
        let videoURLArr = [];
        let videoDurationArr = [];
        let videoCount = 0;

        document.querySelectorAll("ytd-playlist-video-renderer #content").forEach(function(el){
            if(getVideoTitle)
                videoTitleArr.push(el.querySelector("#video-title").getAttribute("title"));

            if(getVideoURL)
                videoURLArr.push("https://www.youtube.com" + el.querySelector("#video-title").getAttribute("href").split("&")[0]);

            if(getVideoChannel)
                videoChannelArr.push(el.querySelector("#channel-name yt-formatted-string.ytd-channel-name > a").textContent);

            let durationText = el.querySelector("span.ytd-thumbnail-overlay-time-status-renderer").textContent.trim();
            let durationParts = durationText.split(":").map(Number);
            let durationSeconds = 0;
            if (durationParts.length === 3) {
                durationSeconds = durationParts[0] * 3600 + durationParts[1] * 60 + durationParts[2];
            } else if (durationParts.length === 2) {
                durationSeconds = durationParts[0] * 60 + durationParts[1];
            } else if (durationParts.length === 1) {
                durationSeconds = durationParts[0];
            }
            videoDurationArr.push(durationSeconds);

            videoCount++;
        });

        let list = "";
        let totalSeconds = 0;

        function formatTime(seconds) {
            let hrs = Math.floor(seconds / 3600);
            let mins = Math.floor((seconds % 3600) / 60);
            let secs = seconds % 60;
            return (hrs > 0 ? (hrs < 10 ? "0" + hrs : hrs) + ":" : "") +
                   (mins < 10 ? "0" + mins : mins) + ":" +
                   (secs < 10 ? "0" + secs : secs);
        }

        for(let i = 0; i < videoCount; i++) {
            if(showTimestamps)
                list += formatTime(totalSeconds) + " ";

            if(getVideoTitle)
                list += videoTitleArr[i];

            if(getVideoChannel)
                list += (getVideoTitle ? " "+videoListSeperator+" " : "") + videoChannelArr[i];

            if(getVideoURL)
                list += (getVideoTitle || getVideoChannel ? " "+videoListSeperator+" " : "") + videoURLArr[i];

            list += "\n";

            totalSeconds += videoDurationArr[i];
        }

        document.querySelector("#listDisplayContainer > textarea").value = list;
        console.log("List built successfully");
    }

    function addGlobalStyle(css) {
        console.log("Adding global style");

        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        head.appendChild(style);
    }
})();
