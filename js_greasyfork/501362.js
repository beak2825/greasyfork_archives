// ==UserScript==
// @name         MyDealz Kommentar Suche
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Durchsuche die Kommentare auf MyDealz indem Du Alt+S drückst.
// @author       MyDealz Community
// @match        https://www.mydealz.de/deals/*
// @match        https://www.mydealz.de/diskussion/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mydealz.de
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501362/MyDealz%20Kommentar%20Suche.user.js
// @updateURL https://update.greasyfork.org/scripts/501362/MyDealz%20Kommentar%20Suche.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = 'https://www.mydealz.de/graphql';

    function extractThreadId() {
        const mainElement = document.getElementById('main');
        if (mainElement) {
            const dataAttribute = mainElement.getAttribute('data-t-d');
            if (dataAttribute) {
                const dataObject = JSON.parse(dataAttribute.replace(/&quot;/g, '"'));
                return dataObject.threadId;
            }
        }
        return null;
    }

    const threadId = extractThreadId();

    function cleanHTML(raw_html) {
        return raw_html.replace(/<.*?>/g, '');
    }

    function createSearchForm(title) {
        return `<div style="padding:20px 0;">
                    <h2 style="margin:0;margin-left:20px;">In den Kommentaren zu '${title}' suchen</h2>
                    <input type="text" id="searchTerm" placeholder="Suchbegriff eingeben" style="width:70%;padding:10px;margin-bottom:10px;margin-left:20px;margin-right:10px;">
                    <button id="searchButton">Suchen</button>
                </div>
                <div id="results"></div>`;
    }

    async function searchComments() {
        const searchTerm = this.document.getElementById('searchTerm').value;
        this.document.getElementById('results').innerHTML = '<div class="spinner" style="margin-top:20px;margin-left:20px;">Suche läuft...</div>';
        try {
            const allData = await fetchDataAndReplies();
            const filteredComments = allData.filter(comment =>
                cleanHTML(comment.preparedHtmlContent).toLowerCase().includes(searchTerm.toLowerCase()) ||
                (comment.replies && comment.replies.some(reply => cleanHTML(reply.preparedHtmlContent).toLowerCase().includes(searchTerm.toLowerCase())))
            );

            if (filteredComments.length === 0) {
                this.document.getElementById('results').innerHTML = '<div class="comments-container" style="margin-top:20px;margin-left:20px;"><span class="text--b size--all-xl size--fromW3-xxl">Keine Kommentare gefunden, die den Suchbegriff enthalten.</span></div>';
                return;
            }

            const commentsHTML = generateCommentsHTML(filteredComments, searchTerm);
            this.document.getElementById('results').innerHTML = `<div class="comments-container" style="margin-top:20px;margin-left:20px;"><span class="text--b size--all-xl size--fromW3-xxl">${filteredComments.length} gefundene Kommentare mit '${searchTerm}'</span>${commentsHTML}</div>`;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function generateCommentsHTML(comments, searchTerm) {
        let html = '';

        function generateRepliesHTML(replies, searchTerm) {
            let repliesHTML = '';
            for (const reply of replies) {
                const cleanContent = cleanHTML(reply.preparedHtmlContent);
                if (cleanContent.toLowerCase().includes(searchTerm.toLowerCase())) {
                    const highlightedContent = cleanContent.replace(new RegExp(searchTerm, 'gi'), match => `<b>${match}</b>`);
                    const usernameLink = `🔗 ${reply.user.username}`;
                    repliesHTML += `<div class="reply" style="padding:10px;margin-top:5px;background-color:#FFFFFF;">
                                        <div class="reply-content" style="margin-bottom:5px;">
                                            <a href="https://www.mydealz.de/comments/permalink/${reply.commentId}" class="reply-username" style="font-weight:bold;">${usernameLink}</a> ${reply.createdAt}: ${highlightedContent}
                                        </div>
                                    </div>`;
                }
            }
            return repliesHTML;
        }

        for (const comment of comments) {
            const cleanContent = cleanHTML(comment.preparedHtmlContent);
            if (cleanContent.toLowerCase().includes(searchTerm.toLowerCase())) {
                const highlightedContent = cleanContent.replace(new RegExp(searchTerm, 'gi'), match => `<b>${match}</b>`);
                const usernameLink = `🔗 ${comment.user.username}`;
                html += `<div class="comment" style="padding:10px;margin-bottom:10px;background-color:#FFFFFF;">
                            <div class="comment-content" style="margin-bottom:5px;">
                                <a href="https://www.mydealz.de/comments/permalink/${comment.commentId}" class="comment-username" style="font-weight:bold;">${usernameLink}</a> ${comment.createdAt}: ${highlightedContent}
                            </div>
                        </div>`;
            } else if (comment.replies) {
                html += generateRepliesHTML(comment.replies, searchTerm);
            }
        }
        return html;
    }

    async function fetchGraphQLData(query, variables) {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables })
        });

        if (response.status === 429) {
            console.log('Too many requests. Waiting 10 seconds.');
            await new Promise(resolve => setTimeout(resolve, 10000));
            return fetchGraphQLData(query, variables);
        }

        const responseData = await response.json();
        if (responseData.errors) {
            throw new Error(responseData.errors[0].message);
        }

        return responseData.data.comments;
    }

    async function fetchReplies(commentId) {
        const graphqlQueryReplies = {
            query: `query comments($filter: CommentFilter!, $limit: Int, $page: Int) {
                        comments(filter: $filter, limit: $limit, page: $page) {
                            items {
                                commentId
                                preparedHtmlContent
                                user {
                                    userId
                                    username
                                }
                                replyCount
                                createdAt
                                parentReply {
                                    user {
                                        username
                                    }
                                }
                            }
                            pagination {
                                current
                                next
                            }
                        }
                    }`,
            variables: {
                filter: { mainCommentId: commentId, threadId: { eq: threadId }, order: { direction: "Ascending" } },
                page: 1,
                limit: 100
            }
        };
        return fetchAllPages(graphqlQueryReplies.query, graphqlQueryReplies.variables);
    }

    async function fetchAllPages(query, variables) {
        let currentPage = 1;
        let allData = [];
        while (true) {
            const data = await fetchGraphQLData(query, { ...variables, page: currentPage });
            allData.push(...data.items);
            if (data.pagination.next) {
                currentPage++;
            } else {
                break;
            }
        }
        return allData;
    }

    async function fetchDataAndReplies() {
        const graphqlQuery = {
            query: `query comments($filter: CommentFilter!, $limit: Int, $page: Int) {
                        comments(filter: $filter, limit: $limit, page: $page) {
                            items {
                                commentId
                                preparedHtmlContent
                                user {
                                    userId
                                    username
                                }
                                replyCount
                                createdAt
                            }
                            pagination {
                                current
                                next
                            }
                        }
                    }`,
            variables: {
                filter: { threadId: { eq: threadId }, order: { direction: "Ascending" } },
                page: 1,
                limit: 100
            }
        };

        const allComments = await fetchAllPages(graphqlQuery.query, graphqlQuery.variables);
        for (const comment of allComments) {
            if (comment.replyCount !== 0) {
                const replies = await fetchReplies(comment.commentId);
                comment.replies = replies;
            }
        }
        return allComments;
    }

    function handleKeydown(e) {
        e = window.event ? event : e;
        if (e.keyCode == 83 && e.altKey) {
            console.log("Comment search opened");
            const searchTerm = prompt("Suchbegriff eingeben:");
            if (!searchTerm) {
                alert("Kein Suchbegriff eingegeben. Das Skript wird beendet.");
                return;
            }

            const title = document.title.replace(" | mydealz", "");
            const newWindow = window.open('', '_blank');

            if (newWindow) {
                newWindow.document.write('<html><head><title>Kommentar-Suche</title><style>body{margin:0;padding:0;}#header{background-color:#005293;height:56px;display:flex;align-items:center;width:100%;}#header img{height:40px;margin-left:20px;}#results{margin-top:20px;padding:0 20px;}h2,input,button{margin-left:20px;}</style></head><body><div id="header"><img src="https://www.mydealz.de/assets/img/logo/default-light_d4b86.svg" alt="mydealz logo"></div>' + createSearchForm(title) + '</body></html>');
                newWindow.document.close();

                newWindow.addEventListener('load', function() {
                    newWindow.searchComments = searchComments.bind(newWindow);
                    newWindow.document.getElementById('searchTerm').value = searchTerm;
                    newWindow.searchComments();
                });
            }
        }
    }

    document.addEventListener('keydown', handleKeydown, false);
})();
