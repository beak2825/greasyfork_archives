// ==UserScript==
// @name         Wanikani Forums: Unlimited POLLer
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Lets you vote for all POLL options, even on single-choice POLLs
// @author       yamitenshi
// @include      https://community.wanikani.com/*
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/426281/Wanikani%20Forums%3A%20Unlimited%20POLLer.user.js
// @updateURL https://update.greasyfork.org/scripts/426281/Wanikani%20Forums%3A%20Unlimited%20POLLer.meta.js
// ==/UserScript==
/* jshint esversion: 8 */

function init() {
    async function doVoteRequest(postId, pollName, optionsList) {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')
            .getAttribute('content');
        const headers = new Headers();
        headers.append('X-CSRF-Token', csrfToken);
        headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        headers.append('Discourse-Present', 'true');
        headers.append('Discourse-Logged-In', 'true');
        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('Origin', 'https://community.wanikani.com');
        headers.append('Sec-Fetch-Site','same-origin');
        headers.append('Sec-Fetch-Dest','empty');
        headers.append('Sec-Fetch-Mode','cors');

        let data = 'post_id=' + encodeURIComponent(postId) +
            '&poll_name=' + encodeURIComponent(pollName);
        optionsList.forEach(function(option) { data += '&options%5B%5D=' + encodeURIComponent(option) });

        await fetch('/polls/vote', {
            method: 'PUT',
            body: data,
            headers: headers,
            referrer: window.location.href,
            mode: "cors"
        });
    }

    function addButtonToPoll(poll, postId) {
        if (poll.classList.contains('vote-all-enabled')) return;
        poll.classList.add('vote-all-enabled');

        const pollName = poll.dataset.pollName;
        const optionsList = Array.from(poll.querySelectorAll('li'))
            .map((option) => option.dataset.pollOptionId)
            .filter((option) => option != null);

        if(optionsList.length === 0) {
            return;
        }

        let button = document.createElement('BUTTON');
        button.className = 'widget-button btn btn-primary btn-icon-text';
        button.title = 'Vote for all the things';
        button.innerHTML = '<span class="d-button-label">Vote all</span>';

        button.addEventListener('click', () => doVoteRequest(postId, pollName, optionsList));
        poll.querySelector('.poll-buttons').appendChild(button);
    }

    function injectButtons(post) {
        let polls = post.querySelectorAll('.poll');

        if (polls.length === 0) return;

        const postId = post.querySelector('article').dataset.postId;

        polls.forEach(function(poll) {
            addButtonToPoll(poll, postId);
        });
    }

    const postStream = document.querySelector('.post-stream');

    const pollStreamObserver = new MutationObserver(function(mutations_list) {
        mutations_list.forEach(function(mutation) {
            mutation.addedNodes.forEach(function (added_node) {
                injectButtons(added_node);
            })
        })
    })

    pollStreamObserver.observe(
        postStream,
        {subtree: false, childList: true}
    );

    postStream.querySelectorAll('.topic-post').forEach(injectButtons);
}

if (document.readyState !== 'loading') {
    init()
} else {
    document.addEventListener('DOMContentReady', init, false);
}
