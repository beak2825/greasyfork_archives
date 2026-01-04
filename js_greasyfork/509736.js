// ==UserScript==
// @name         YouTube Channel Playlist Button
// @namespace    https://greasyfork.org/en/users/703184-floriegl
// @version      1.4
// @description  Adds a button linking to the channel's playlist on YouTube channel pages
// @author       floriegl
// @match        https://www.youtube.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509736/YouTube%20Channel%20Playlist%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/509736/YouTube%20Channel%20Playlist%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let actionModel = undefined;
    let channelId = undefined;

    const readdObserver = new MutationObserver(() => {
        if (!document.getElementById('channel-playlist-link')) {
            addPlaylistButton();
        }
    });

    function addPlaylistButton() {
        readdObserver.disconnect();
        readdObserver.observe(actionModel, { childList: true, subtree: false });

        if (!document.getElementById('channel-playlist-link')) {
            const outerDiv = document.createElement("div");
            outerDiv.className = "ytFlexibleActionsViewModelAction";
            outerDiv.id = "channel-playlist-link";

            const buttonView = document.createElement("button-view-model");
            buttonView.className = "ytSpecButtonViewModelHost";
            outerDiv.appendChild(buttonView);

            const link = document.createElement("a");
            link.className = "yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--enable-backdrop-filter-experiment";
            link.setAttribute("aria-haspopup", "false");
            link.setAttribute("force-new-state", "true");
            link.setAttribute("aria-label", "Go to Channel Playlist");
            link.setAttribute("aria-disabled", "false");
            buttonView.appendChild(link);

            const textContent = document.createElement("div");
            textContent.className = "yt-spec-button-shape-next__button-text-content";
            textContent.textContent = "Channel Playlist";
            link.appendChild(textContent);

            const touchFeedback = document.createElement("yt-touch-feedback-shape");
            touchFeedback.setAttribute("aria-hidden", "true");
            touchFeedback.className = "yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response";
            link.appendChild(touchFeedback);

            const touchFeedbackStroke = document.createElement("div");
            touchFeedbackStroke.className = "yt-spec-touch-feedback-shape__stroke";
            touchFeedback.appendChild(touchFeedbackStroke);

            const touchFeedbackFill = document.createElement("div");
            touchFeedbackFill.className = "yt-spec-touch-feedback-shape__fill";
            touchFeedback.appendChild(touchFeedbackFill);

            const actionModelRow = actionModel.querySelector('.ytFlexibleActionsViewModelActionRow');
            if (actionModelRow) {
                outerDiv.classList.add("ytFlexibleActionsViewModelActionRowAction");
                actionModelRow.appendChild(outerDiv);
            } else {
                actionModel.appendChild(outerDiv);
            }
        }

        document.querySelector('#channel-playlist-link .yt-spec-button-shape-next').href = `/playlist?list=UU${channelId.substring(2)}`;
    }

    window.addEventListener('yt-navigate-finish', async (e) => {
         if (e.detail && e.detail.pageType === 'channel' && e.detail.endpoint && e.detail.endpoint.browseEndpoint && typeof e.detail.endpoint.browseEndpoint.browseId === 'string' && e.detail.endpoint.browseEndpoint.browseId.startsWith('UC')) {
            channelId = e.detail.endpoint.browseEndpoint.browseId;
            actionModel = document.querySelector('yt-flexible-actions-view-model');
            if (!actionModel) {
                actionModel = await new Promise((resolve) => {
                    new MutationObserver((mutations, obs) => {
                        const item = document.querySelector('yt-flexible-actions-view-model');
                        if (item) {
                            resolve(item);
                            obs.disconnect();
                        }
                    }).observe(document, { childList: true, subtree: true });
                });
            }
            addPlaylistButton();
        } else {
            channelId = null;
            readdObserver.disconnect();
        }
    });
    window.addEventListener("resize", () => {
        setTimeout(() => {
            if (actionModel !== document.querySelector('yt-flexible-actions-view-model')) {
                actionModel = document.querySelector('yt-flexible-actions-view-model');
                if (channelId && actionModel) {
                    addPlaylistButton();
                }
            }
        }, 0);
    });
})();