// ==UserScript==
// @name         Lolzteam Auto Refresh
// @version      0.2
// @description  Автоматически обновляет темы в разделах
// @author       vuchaev2015
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @namespace https://greasyfork.org/users/997663
// @downloadURL https://update.greasyfork.org/scripts/470912/Lolzteam%20Auto%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/470912/Lolzteam%20Auto%20Refresh.meta.js
// ==/UserScript==

function removeUpdateFeedButton() {
    if (document.visibilityState === 'visible' && $('.discussionListItems, .UpdateFeedButton').length) {
        $('.UpdateFeedButton').remove();
    }
}

function updateDiscussionList() {
    if (document.visibilityState === 'visible' && $('.discussionListItems').length) {
        $('.DiscussionList').trigger('LoadPageWithoutCache');
        $('.forumImprovements--mask').remove();
    }
}

setInterval(removeUpdateFeedButton);
setInterval(updateDiscussionList, 5000);

const observer = new MutationObserver((mutationsList, observer) => {
    if (document.visibilityState === 'visible') {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && $('#AjaxProgress').length) {
                $('#AjaxProgress').remove();
            }
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });

