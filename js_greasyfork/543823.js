// ==UserScript==
// @name         GeorgeBailey Reddit
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds reddit features to mafiascum
// @author       GeorgeBailey
// @match        *://*.mafiascum.net/viewtopic.php*
// @grant        GM.xmlHttpRequest
// @connect      onrender.com
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/543823/GeorgeBailey%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/543823/GeorgeBailey%20Reddit.meta.js
// ==/UserScript==

(function() {
    'use strict';

 
    const API_URL = 'https://georgebailey-reddit.onrender.com';

  
    let loggedInUserId = null;
    let votesData = {};

   
    function getLoggedInUserId() {
        const profileLink = document.querySelector('.header-profile a[href*="memberlist.php?mode=viewprofile"]');
        if (!profileLink) return null;
        const match = profileLink.href.match(/u=(\d+)/);
        return match ? match[1] : null;
    }


    function updateVoteUI(postElement) {
        const postId = postElement.id;
        const data = votesData[postId] || { up: 0, down: 0, userVote: null };

        const upvoteButton = postElement.querySelector('.ms-upvote-btn');
        const downvoteButton = postElement.querySelector('.ms-downvote-btn');
        const scoreDisplay = postElement.querySelector('.ms-vote-score');

        if (!upvoteButton || !downvoteButton || !scoreDisplay) return;

        scoreDisplay.textContent = data.up - data.down;
        upvoteButton.style.color = data.userVote === 'up' ? '#ff8b60' : '#888';
        downvoteButton.style.color = data.userVote === 'down' ? '#9494ff' : '#888';
    }


    async function fetchAllVotes() {
        return new Promise((resolve) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: `${API_URL}/votes/all`,
                onload: function(response) {
                    try {
                        const rawVotes = JSON.parse(response.responseText);
                        const processedVotes = {};
                        rawVotes.forEach(vote => {
                            const postId = vote.post_id;
                            if (!processedVotes[postId]) {
                                processedVotes[postId] = { up: 0, down: 0, userVote: null };
                            }
                            if (vote.vote_type === 'up') processedVotes[postId].up++;
                            if (vote.vote_type === 'down') processedVotes[postId].down++;
                            if (loggedInUserId && String(vote.user_id) === String(loggedInUserId)) {
                                 processedVotes[postId].userVote = vote.vote_type;
                            }
                        });
                        votesData = processedVotes;
                    } catch (e) { console.error("Failed to parse votes from server:", e); }
                    resolve();
                },
                onerror: function(response) {
                    console.error("Failed to fetch votes:", response);
                    resolve();
                }
            });
        });
    }

    function submitVote(postId, voteType) {
        if (!loggedInUserId) {
            alert('You must be logged in to vote.');
            return;
        }

        const postElement = document.getElementById(postId);
        if (!votesData[postId]) {
            votesData[postId] = { up: 0, down: 0, userVote: null };
        }

        const currentVote = votesData[postId].userVote;
        const newVote = (currentVote === voteType) ? null : voteType;


        if (currentVote === 'up') votesData[postId].up--;
        if (currentVote === 'down') votesData[postId].down--;
        if (newVote === 'up') votesData[postId].up++;
        if (newVote === 'down') votesData[postId].down++;
        votesData[postId].userVote = newVote;


        updateVoteUI(postElement);


        GM.xmlHttpRequest({
            method: "POST",
            url: `${API_URL}/vote`,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({
                post_id: postId,
                user_id: loggedInUserId,
                vote_type: newVote
            }),
            onload: function(response) {
                console.log('Vote successfully saved to server.');
            },
            onerror: function(response) {
                console.error("Failed to submit vote:", response);
      
            }
        });
    }

  
    function injectVotingControls() {
        document.querySelectorAll('.post').forEach(postElement => {
            if (postElement.querySelector('.ms-vote-container')) return;
            const postId = postElement.id;
            if (!postId) return;
            const postBody = postElement.querySelector('.postbody');
            if (!postBody) return;

            const voteContainer = document.createElement('div');
            voteContainer.classList.add('ms-vote-container');
            voteContainer.style.display = 'flex';
            voteContainer.style.alignItems = 'center';
            voteContainer.style.gap = '5px';
            voteContainer.style.marginTop = '15px';
            voteContainer.style.paddingTop = '10px';
            voteContainer.style.borderTop = '1px solid #3e3e3e';

            const upvoteButton = document.createElement('a');
            upvoteButton.href = '#';
            upvoteButton.title = 'Upvote';
            upvoteButton.classList.add('ms-upvote-btn');
            upvoteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/></svg>`;
            upvoteButton.style.cursor = 'pointer';
            upvoteButton.addEventListener('click', (e) => {
                e.preventDefault();
                submitVote(postId, 'up');
            });

            const scoreDisplay = document.createElement('span');
            scoreDisplay.classList.add('ms-vote-score');
            scoreDisplay.style.fontWeight = 'bold';
            scoreDisplay.style.color = '#ccc';
            scoreDisplay.style.minWidth = '15px';
            scoreDisplay.style.textAlign = 'center';

            const downvoteButton = document.createElement('a');
            downvoteButton.href = '#';
            downvoteButton.title = 'Downvote';
            downvoteButton.classList.add('ms-downvote-btn');
            downvoteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/></svg>`;
            downvoteButton.style.cursor = 'pointer';
            downvoteButton.addEventListener('click', (e) => {
                e.preventDefault();
                submitVote(postId, 'down');
            });

            voteContainer.appendChild(upvoteButton);
            voteContainer.appendChild(scoreDisplay);
            voteContainer.appendChild(downvoteButton);
            postBody.appendChild(voteContainer);
            updateVoteUI(postElement);
        });
    }

    async function main() {
        if (API_URL === 'https://your-app-name.onrender.com') {
            alert('hell yeah brother');
            return;
        }
        loggedInUserId = getLoggedInUserId();
        await fetchAllVotes();
        injectVotingControls();
    }

    let hasRun = false;
    const tryToRun = setInterval(() => {
        const posts = document.querySelectorAll('.post');
        if (posts.length > 0 && !hasRun) {
            hasRun = true;
            clearInterval(tryToRun);
            main();
        }
    }, 200);

})();