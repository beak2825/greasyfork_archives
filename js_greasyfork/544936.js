// ==UserScript==
// @name         YouTube: View Channel on Filmot
// @namespace    http://tampermonkey.net/
// @version      2025.08.08
// @description  Adds a button on channel and video watch pages, which links directly to the Filmot page of the respective channel.
// @license      MIT
// @author       provigz (Vankata453)
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=filmot.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544936/YouTube%3A%20View%20Channel%20on%20Filmot.user.js
// @updateURL https://update.greasyfork.org/scripts/544936/YouTube%3A%20View%20Channel%20on%20Filmot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastButtonChannelID = null;
    function addViewOnFilmotButton(parentDiv, channelID, marginPx = null) {
        let viewOnFilmotAction = parentDiv.querySelector("div#viewOnFilmotAction");
        if (viewOnFilmotAction && lastButtonChannelID === channelID) return;
        lastButtonChannelID = channelID;
        if (viewOnFilmotAction) {
            viewOnFilmotAction.remove();
        }

        const actionDiv = document.createElement("div");
        actionDiv.className = "yt-flexible-actions-view-model-wiz__action";
        actionDiv.id = "viewOnFilmotAction";
        if (marginPx) {
            actionDiv.style.marginLeft = `${marginPx}px`;
        }

        const buttonWrapper = document.createElement("button-view-model");
        buttonWrapper.className = "yt-spec-button-view-model";
        buttonWrapper.style.backgroundColor = "cornsilk";
        buttonWrapper.style.borderRadius = "18px";

        const link = document.createElement("a");
        link.rel = "nofollow";
        link.className = "yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--enable-backdrop-filter-experiment";
        link.href = `https://filmot.com/channel/${channelID}`;
        link.target = "_blank";
        link.setAttribute("aria-haspopup", "false");
        link.setAttribute("force-new-state", "true");
        link.setAttribute("aria-disabled", "false");
        link.setAttribute("aria-label", "View on Filmot");

        const contentDiv = document.createElement("div");
        contentDiv.className = "yt-spec-button-shape-next__button-text-content";

        const faviconImg = document.createElement("img");
        faviconImg.src = "https://www.google.com/s2/favicons?domain=filmot.com";
        faviconImg.alt = "Filmot favicon";
        faviconImg.style = "vertical-align: middle; width: 16px; height: 16px; margin-right: 5px;";

        const span = document.createElement("span");
        span.textContent = "View on Filmot";

        contentDiv.append(faviconImg, span);

        const feedbackShape = document.createElement("yt-touch-feedback-shape");
        feedbackShape.style.borderRadius = "inherit";

        const feedbackDiv = document.createElement("div");
        feedbackDiv.className = "yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response";
        feedbackDiv.setAttribute("aria-hidden", "true");

        const strokeDiv = document.createElement("div");
        strokeDiv.className = "yt-spec-touch-feedback-shape__stroke";

        const fillDiv = document.createElement("div");
        fillDiv.className = "yt-spec-touch-feedback-shape__fill";

        feedbackDiv.append(strokeDiv, fillDiv);
        feedbackShape.appendChild(feedbackDiv);

        link.append(contentDiv, feedbackShape);
        buttonWrapper.appendChild(link);
        actionDiv.appendChild(buttonWrapper);
        parentDiv.appendChild(actionDiv);
    }

    function addChannelViewOnFilmotButton() {
        let actionsModel = document.querySelector("yt-flexible-actions-view-model");
        if (!actionsModel) return;

        let channelID = null;
        const historyState = window.history.state;
        if (historyState) {
            channelID = historyState.endpoint.browseEndpoint.browseId;
        } else {
            const canonicalURLSplit = document.querySelector("link[rel='canonical']").getAttribute("href").split("/");
            channelID = canonicalURLSplit[canonicalURLSplit.length - 1];
        }
        if (!channelID) return;

        addViewOnFilmotButton(actionsModel, channelID);
    }
    function addWatchViewOnFilmotButton() {
        let channelID = null;
        const channelURLSplit = document.querySelector("div#upload-info ytd-channel-name").querySelector("a").getAttribute("href").split("/");
        if (channelURLSplit.length >= 3 && channelURLSplit[1] === "channel") {
            channelID = channelURLSplit[2];
        } else {
            // Get the ID from the "Videos" button in channel socials below description.
            channelID = document.querySelector("div#social-links").querySelector("a").getAttribute("href").split("/")[2];
        }
        if (!channelID) return;

        addViewOnFilmotButton(document.querySelector("div#owner"), channelID, 8);
    }

    document.addEventListener("yt-navigate-finish", (ev) => {
        if (!ev.detail) return;

        if (ev.detail.pageType === "channel") {
            setTimeout(addChannelViewOnFilmotButton, 500);
        } else if (ev.detail.pageType === "watch") {
            setTimeout(addWatchViewOnFilmotButton, 500);
        }
    });
    document.addEventListener("yt-page-data-updated", (ev) => {
        if (!ev.detail) return;

        if (ev.detail.pageType === "channel") {
            addChannelViewOnFilmotButton();
        } else if (ev.detail.pageType === "watch") {
            addWatchViewOnFilmotButton();
        }
    });
})();