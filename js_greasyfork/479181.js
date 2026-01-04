// ==UserScript==
// @name         Invidify Youtube
// @namespace    http://tampermonkey.net/
// @version      1.9.0
// @description  Werbung auf Youtube umgehen, indem Video-Links direkt auf Invidious verweisen
// @author       Thomas Theiner
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/479181/Invidify%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/479181/Invidify%20Youtube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load", e => {
        console.log("INVIDIFY initialisiert");

        let configButton = document.createElement("button");
        configButton.type = "button";
        configButton.innerHTML = `<img src="https://websocket.bplaced.net/gear.png" />`;
        configButton.style.cssText = `z-index: 3000;
          background-color: #dddddd;
          position: fixed;
          top: 15px;
          left: 270px;
          border-radius: 3px;
          border-color: #dddddd;
          padding: 2px 10px 2px 10px;`;

        let newButton = document.createElement("button");
        newButton.type = "button";
        newButton.innerText = "Invidify";

        newButton.style.cssText = `z-index: 3000;
          background-color: #dddddd;
          position: fixed;
          top: 15px;
          left: 200px;
          border-radius: 3px;
          border-color: #dddddd;
          padding: 5px 10px 5px 10px;`;

        let bodyEl = document.querySelector("body");
        bodyEl.prepend(configButton);
        bodyEl.prepend(newButton);

        let instanceURL = window.localStorage.getItem("invidiousInstance");
        if(!instanceURL) {
            instanceURL = "https://iv.datura.network/";
            window.localStorage.setItem("invidiousInstance", instanceURL);
        }

        newButton.addEventListener("click", e => {

            // get the correct ytd-browse element
            let currentPage = window.location.href;

            let ytdBrowse = "home";
            let relExclude = "";
            let ytdClass = "ytd-thumbnail";

            if(currentPage.includes("feed")) {
                ytdBrowse = currentPage.match(/\/feed\/(.*)$/)[1];
                if(ytdBrowse.includes("?")) {
                    ytdBrowse = ytdBrowse.match(/(.*)\?/)[1];
                }
            } else if(currentPage.includes("/watch?v=")) {
                ytdBrowse = "";
                relExclude = "[rel]:not([rel='null'])";
            } else if(currentPage.includes("gaming")) {
                ytdBrowse = "channels";
            } else if(currentPage.includes("UCYfdidRxbB8Qhf0Nx7ioOYw")) {
                ytdBrowse = "news";
            } else if(currentPage.includes("UCEgdi0XIXXZ-qJOFPf4JSKw")) {
                ytdBrowse = "sports";
            } else if(currentPage.includes("UCtFRv9O2AHqOZjjynzrv-xg")) {
                ytdBrowse = "learning";
            } else if(currentPage.includes("UC4R8DWoMoI7CAwX8_LjQHig")) {
                ytdBrowse = "live";
            } else if(currentPage.includes("/@") || currentPage.includes("/channel/")) {
                ytdBrowse = "channels";
                if(currentPage.includes("shorts")) {
                    ytdClass = "reel-item-endpoint";
                }
            }

            console.log("currentPage:", currentPage, "Section:", ytdBrowse, "relExclude:", relExclude);

            let allLinks = ytdBrowse ? document.querySelector(`ytd-browse[page-subtype=${ytdBrowse}]`)?.querySelectorAll(`a.${ytdClass}${relExclude}`) : document.querySelector("ytd-watch-flexy").querySelectorAll(`a.${ytdClass}${relExclude}`);

            if(currentPage.includes("results")) {
                allLinks = document.querySelector("ytd-two-column-search-results-renderer").querySelectorAll(`a.${ytdClass}${relExclude}`);
            }

            console.log("allLinks", allLinks.length);

            let infoLookup = {};
            let linkCollection = new Set();
            for(let link of allLinks) {

                if(link.href.includes("/watch?v=") || link.href.includes("/shorts/")) {
                    let videoID;
                    if(link.href.includes("/watch?v=")) {
                        videoID = link.href.match(/\/watch\?v\=(.*)$/)[1];
                    }
                    if(link.href.includes("/shorts/")) {
                        videoID = link.href.match(/\/shorts\/(.*)$/)[1];
                    }

                    if(videoID.includes("&")) {
                        videoID = videoID.match(/(.*?)\&/)[1];
                    }
                    let image = link.querySelector("img");
                    if(image) {

                        if(!image.src) {
                            if(!instanceURL.includes("piped")) {
                                image.src = `${instanceURL}vi/${videoID}/maxres.jpg`;
                            } else {
                                image.src = `https://pipedimg.adminforge.de/vi/${videoID}/hq720.jpg?host=i.ytimg.com`;
                            }
                        }

                        let details = link.parentNode.parentNode.parentNode.querySelector("#details");

                        if(!details) {
                            details = link.parentNode.parentNode.querySelector(".details");

                            if(!details) {
                                details = link.parentNode.parentNode.querySelector("#meta");
                            }
                        }

                        if(!details || !details.querySelector("#video-title")) {
                            console.log("INVIDIFY: DETAILS NOT FOUND!", currentPage, videoID);

                            // could be shorts
                            if(currentPage.includes("/shorts")) {
                                console.log("Was a SHORTS video ...", videoID);
                                linkCollection.add(videoID);
                                infoLookup[videoID] = {
                                    imageSrc: image.src,
                                    title: "",
                                    channelName: "",
                                    channelLink: "",
                                    metaData: "",
                                    length: ""
                                }
                            }
                        } else {
                            linkCollection.add(videoID);

                            let title = details.querySelector("#video-title").innerText;

                            let channelInfo = details.querySelector("#channel-name");
                            let channelName = channelInfo.innerText;
                            let channelLink = channelInfo.querySelector("a")?.href;

                            let partChannelLink = channelLink?.match(/\/(\@.*)/) ? channelLink?.match(/\/(\@.*)/)[1] : channelLink?.match(/\/(channel.*)/) ? channelLink?.match(/\/(channel.*)/)[1] : channelLink?.match(/\/c\/(.*)/)[1];

                            let rowsInName = channelName.split("\n");
                            if(rowsInName.length > 1) {
                                channelName = rowsInName[2].trim();
                            }

                            let metaData = details.querySelector("#metadata-line").innerText;

                            let timeStatus = link.querySelector("#time-status")?.innerText.trim();
                            console.log(videoID, title, timeStatus, channelName, channelLink);
                            // add Info
                            infoLookup[videoID] = {
                                imageSrc: image.src,
                                title: title,
                                channelName: channelName,
                                channelLink: partChannelLink,
                                metaData: metaData,
                                length: timeStatus
                            };
                        }

                    }
                }

            }
            let videoIDs = Array.from(linkCollection);

            // prepend current videoID
            if(currentPage.includes("/watch?v=") || currentPage.includes("/shorts/")) {
                let videoID;
                if(currentPage.includes("/watch?v=")) {
                    videoID = currentPage.match(/\/watch\?v\=(.*)$/)[1];
                }
                if(currentPage.includes("/shorts/")) {
                    videoID = currentPage.match(/\/shorts\/(.*)$/)[1];
                }
                if(videoID.includes("&")) {
                    videoID = videoID.match(/(.*)\&/)[1];
                }
                videoIDs.unshift(videoID);

                let primaryVideo = document.querySelector("#primary.ytd-watch-flexy");

                let metaInfo = primaryVideo.querySelector("#below #view-count").getAttribute("aria-label") + primaryVideo.querySelector("#below #date-text").getAttribute("aria-label");
                if(primaryVideo.querySelector("#info-container #info")) {
                    metaInfo += " " + primaryVideo.querySelector("#info-container #info").innerText;
                }

                infoLookup[videoID] = {
                    imageSrc: instanceURL.includes("piped") ? `https://pipedimg.adminforge.de/vi/${videoID}/hq720.jpg?host=i.ytimg.com` : `${instanceURL}vi/${videoID}/maxres.jpg`,
                    title: primaryVideo.querySelector("#below #title").innerText,
                    channelName: primaryVideo.querySelector("#below #channel-name").innerText,
                    channelLink: primaryVideo.querySelector("#below #channel-name").querySelector("a").href.match(/\/(\@.*)/)[1],
                    metaData: metaInfo,
                    length: "-:--"
                };
            }

            // opening new window/tab
            let newWindow = window.open("", "_blank");
            let newDocument = newWindow.document;

            newDocument.body.style.cssText = `font-family: Roboto, Arial, sans-serif;`;

            let newLogoDiv = document.createElement("div");
            newLogoDiv.style.cssText = "margin-bottom: 20px;";

            let newLogoImage = document.createElement("img");
            newLogoImage.src = "https://websocket.bplaced.net/invidify.png";
            newLogoDiv.appendChild(newLogoImage);

            newDocument.body.appendChild(newLogoDiv);

            for(let videoID of videoIDs) {

                let newCard = document.createElement("div");
                newCard.style.cssText = `position: relative; margin: 10px; border-radius: 5px; width: 310px; height: 350px; display: inline-block; vertical-align: top;`;

                let newLink = newDocument.createElement("a");
                newLink.href = `${instanceURL}watch?v=${videoID}`;
                newLink.target = "_blank";
                newLink.style.cssText = "text-decoration: none; color: black;";
                newLink.title = infoLookup[videoID].title;

                let newImage = new Image();
                newImage.src = infoLookup[videoID].imageSrc;

                console.log("Hier wird das Dingen geladen");

                newImage.width = "310";
                newImage.style.cssText = "border-radius: 12px;";
                newLink.appendChild(newImage);

                newImage.onload = () => {
                    if(newImage.height === 233) {
                        newImage.onload = null;
                        newImage.src = instanceURL.includes("piped") ? `https://pipedimg.adminforge.de/vi/${videoID}/hq720.jpg?host=i.ytimg.com` : `${instanceURL}vi/${videoID}/maxres.jpg`;
                    }
                };

                if(infoLookup[videoID].length) {
                    let newTimeBox = newDocument.createElement("div");
                    newTimeBox.style.cssText = "color: white; background-color: black; border-radius: 4px; position: relative; float:right; top: -23px; padding: 2px; font-size: 0.75rem; margin-right: 5px;";
                    newTimeBox.innerText = infoLookup[videoID].length;

                    newLink.appendChild(newTimeBox);
                }

                let newTitleBox = document.createElement("div");
                newTitleBox.style.cssText = "position: relative; height: 3.2rem;";

                let newNode = document.createElement("h3");
                newNode.style.cssText = "font-size: 1.1rem; line-height: 1.5rem; font-weight: 600; max-height: 3rem; overflow: hidden; text-overflow: ellipsis; -webkit-box-orient: vertical; display: -webkit-box; -webkit-line-clamp: 2;";
                newNode.innerText = infoLookup[videoID].title;

                newTitleBox.appendChild(newNode);
                newLink.appendChild(newTitleBox);

                newCard.appendChild(newLink);

                let newChannel = document.createElement("h4");
                newChannel.style.cssText = "font-size: 0.9rem; font-weight: 100; color: #737373;";
                newChannel.innerHTML = infoLookup[videoID].channelName + "<br/>" + infoLookup[videoID].metaData;

                if(infoLookup[videoID].channelLink) {
                    let newChannelLink = document.createElement("a");
                    newChannelLink.style.cssText = "text-decoration: none;";
                    newChannelLink.target = "_blank";
                    newChannelLink.href = `${instanceURL}${infoLookup[videoID].channelLink}`;

                    newChannelLink.appendChild(newChannel);
                    newCard.appendChild(newChannelLink);
                } else {
                    newCard.appendChild(newChannel);
                }
                newDocument.body.appendChild(newCard);
            }

        }, false);

        document.addEventListener("fullscreenchange", (e) => {
            if(document.fullscreenElement) {
                newButton.style.zIndex = -1;
                configButton.style.zIndex = -1;
            } else {
                newButton.style.zIndex = 3000;
                configButton.style.zIndex = 3000;
            }
        }, false);

        let isOpen = false;

        configButton.addEventListener("click", e => {
            e.stopPropagation();

            if(!isOpen) {
                isOpen = true;
                instanceURL = window.localStorage.getItem("invidiousInstance");

                let configDiv = document.createElement("div");
                configDiv.id = "configDiv";
                configDiv.style.cssText = `z-index: 3000;
                  background-color: #f3f3f3;
                  position: fixed;
                  top: 50px;
                  left: 270px;
                  border-radius: 3px;
                  border: 1px solid #000000;
                  font-size: 1.2rem;
                  padding: 20px;`;

                let configInput = document.createElement("input");
                configInput.size = "50";
                configInput.id = "invidiousConfig";
                configInput.type = "text";
                configInput.style.cssText = "margin-bottom: 20px;";
                configInput.value = instanceURL;

                let configLabel = document.createElement("label");
                configLabel.id = "configLabel";
                configLabel.htmlFor = "invidiousConfig";
                configLabel.innerText = "Invidious Instance Domain or URL";

                let configBr = document.createElement("br");

                let configButtonDiv = document.createElement("div");
                configButtonDiv.id = "configButtons";

                let configOk = document.createElement("button");
                configOk.type = "button";
                configOk.innerText = "Ok";
                configOk.style.cssText = "margin-right: 10px;";

                let configCancel = document.createElement("button");
                configCancel.type = "button";
                configCancel.innerText = "Cancel";

                configButtonDiv.appendChild(configOk);
                configButtonDiv.appendChild(configCancel);

                configDiv.appendChild(configLabel);
                configDiv.appendChild(configBr);
                configDiv.appendChild(configInput);
                configDiv.appendChild(configButtonDiv);

                document.body.prepend(configDiv);

                function closeConfig() {
                    configDiv.parentNode.removeChild(configDiv);
                    isOpen = false;
                }

                configOk.addEventListener("click", btnE => {
                    instanceURL = configInput.value;
                    if(!instanceURL.startsWith("https://")) {
                        instanceURL = "https://" + instanceURL;
                    }
                    if(!instanceURL.endsWith("/")) {
                        instanceURL += "/";
                    }
                    window.localStorage.setItem("invidiousInstance", instanceURL);
                    closeConfig();
                }, false);

                configCancel.addEventListener("click", btnE => {
                    closeConfig();
                }, false);

                console.log("Outside click handler added!");
                document.body.addEventListener("click", e => {
                    console.log(e.target);
                    if(isOpen && e.target.id !== "configDiv" && e.target.id !== "invidiousConfig" && e.target.id !== "configButtons" && e.target.id !== "configLabel") {
                        closeConfig();
                    }
                }, false);

            }
        }, false);
    }, false);
})();