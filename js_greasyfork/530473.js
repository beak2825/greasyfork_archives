// ==UserScript==
// @name         Old Reddit Extended (Works with RES)
// @namespace    https://old.reddit.com/
// @version      2.3.1
// @description  text vote buttons, comment expando preview with inline replies, and vote tally estimation
// @license MIT
// @author       greenwithenvy
// @match        *://old.reddit.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/530473/Old%20Reddit%20Extended%20%28Works%20with%20RES%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530473/Old%20Reddit%20Extended%20%28Works%20with%20RES%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // load external css for old.reddit styling
    const cssUrl = "https://greenwenvy.github.io/homework/ORE.css"; // update if needed
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cssUrl;
    document.head.appendChild(link);

    // load marked library for markdown parsing in comment previews
    if (!window.marked) {
        let markedScript = document.createElement('script');
        markedScript.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        document.head.appendChild(markedScript);
    }

    // helper: parse markdown text to html if possible
    function parseMarkdown(text) {
        if (window.marked) {
            return window.marked.parse(text);
        }
        return text;
    }

    // function to style text buttons
    function styleTextButton(button, hoverColor) {
        button.style.color = '#888';
        button.style.fontWeight = 'bold';
        button.style.padding = '0 3px';
        button.style.cursor = 'pointer';
        button.addEventListener('mouseenter', () => {
            button.style.color = hoverColor;
        });
        button.addEventListener('mouseleave', () => {
            if (!button.classList.contains('active')) {
                button.style.color = '#888';
            }
        });
    }

    // toggle active state of vote button
    function toggleButtonState(button, hoverColor) {
        if (button.classList.contains('active')) {
            button.classList.remove('active');
            button.style.color = '#888';
        } else {
            button.classList.add('active');
            button.style.color = hoverColor;
        }
    }

    // replace vote buttons with text buttons
    function replaceVoteButtons(post) {
        if (post.dataset.modified) return;
        post.dataset.modified = 'true';

        const upvote = post.querySelector('.arrow.up');
        const downvote = post.querySelector('.arrow.down');
        const buttonContainer = post.querySelector('.flat-list.buttons');
        const expando = post.querySelector('.comment-expando');

        if (upvote && downvote && buttonContainer) {
            const upvoteBtn = document.createElement('a');
            upvoteBtn.href = '#';
            upvoteBtn.textContent = 'upvote';
            styleTextButton(upvoteBtn, '#ff4500');

            const downvoteBtn = document.createElement('a');
            downvoteBtn.href = '#';
            downvoteBtn.textContent = 'downvote';
            styleTextButton(downvoteBtn, '#7193ff');

            upvoteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                upvote.click();
                toggleButtonState(upvoteBtn, '#ff4500');
            });
            downvoteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                downvote.click();
                toggleButtonState(downvoteBtn, '#7193ff');
            });

            if (expando) {
                expando.insertAdjacentElement('afterend', upvoteBtn);
                upvoteBtn.insertAdjacentElement('afterend', downvoteBtn);
            } else {
                buttonContainer.insertBefore(downvoteBtn, buttonContainer.firstChild);
                buttonContainer.insertBefore(upvoteBtn, buttonContainer.firstChild);
            }
        }
    }

    // process posts that already exist
    function processExistingPosts() {
        document.querySelectorAll('.thing').forEach(replaceVoteButtons);
    }
    processExistingPosts();

    // observe new posts being added dynamically
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.classList.contains('thing')) {
                    replaceVoteButtons(node);
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // add expando button for comment preview on posts
    document.querySelectorAll('.thing.link').forEach(post => {
        let commentsAnchor = post.querySelector('a.comments');
        let postUrl = commentsAnchor ? commentsAnchor.href : null;
        if (!postUrl) return;

        let expandoBtn = document.createElement('span');
        expandoBtn.textContent = '[+ preview comments]';
        expandoBtn.className = 'comment-expando';
        expandoBtn.addEventListener('click', function() {
            // toggle comment preview on/off
            let preview = expandoBtn.nextSibling;
            if (preview && preview.classList && preview.classList.contains('comment-preview')) {
                preview.remove();
                expandoBtn.textContent = '[+ preview comments]';
                return;
            }
            loadComments(expandoBtn, postUrl);
        });
        let buttonContainer = post.querySelector('.flat-list.buttons');
        if (buttonContainer) {
            buttonContainer.prepend(expandoBtn);
        }
    });

    // load comments using gm_xmlhttprequest
    function loadComments(expandoBtn, postUrl) {
        let loadingText = document.createElement('div');
        loadingText.className = 'comment-loading';
        loadingText.textContent = 'loading comments...';
        expandoBtn.after(loadingText);

        GM_xmlhttpRequest({
            method: 'GET',
            url: postUrl + '.json',
            onload: function(response) {
                loadingText.remove();
                let data = JSON.parse(response.responseText);
                let comments = data[1].data.children.filter(c => c.kind === "t1").map(c => c.data);

                let previewDiv = document.createElement('div');
                previewDiv.className = 'comment-preview';

                if (comments.length) {
                    let currentCommentIndex = 0;
                    previewDiv.innerHTML = '';
                    previewDiv.appendChild(formatComment(comments[currentCommentIndex], postUrl));

                    let nextBtn = document.createElement('span');
                    nextBtn.textContent = '[next]';
                    nextBtn.className = 'comment-next';
                    nextBtn.addEventListener('click', function() {
                        currentCommentIndex = (currentCommentIndex + 1) % comments.length;
                        previewDiv.innerHTML = '';
                        previewDiv.appendChild(formatComment(comments[currentCommentIndex], postUrl));
                        previewDiv.appendChild(nextBtn);
                    });
                    previewDiv.appendChild(nextBtn);
                } else {
                    previewDiv.innerHTML = '<p>no comments yet.</p>';
                }

                expandoBtn.textContent = '[- hide comments]';
                expandoBtn.after(previewDiv);
            }
        });
    }

    // create a dom element for a comment with extra features and inline replies
    function formatComment(comment, postUrl, depth = 0) {
        const container = document.createElement('div');
        container.className = 'comment-preview-item';
        container.style.marginBottom = '10px';
        container.style.padding = '5px';
        container.style.borderBottom = '1px dashed #ccc';

        // comment main content
        const contentP = document.createElement('p');
        contentP.style.margin = '0';
        const authorLink = document.createElement('a');
        authorLink.href = postUrl + comment.id;
        authorLink.target = '_blank';
        authorLink.className = 'comment-author';
        authorLink.style.fontWeight = 'bold';
        authorLink.textContent = comment.author;
        contentP.appendChild(authorLink);

        // add colon and markdown-parsed comment body
        const colonText = document.createTextNode(': ');
        contentP.appendChild(colonText);
        const commentTextDiv = document.createElement('div');
        commentTextDiv.innerHTML = parseMarkdown(comment.body);
        contentP.appendChild(commentTextDiv);

        // NOTE: Removed score span from content paragraph
        container.appendChild(contentP);

        // comment metadata (timestamp, edited, replies count)
        const metaP = document.createElement('p');
        metaP.style.margin = '0';
        metaP.style.fontSize = '10px';
        metaP.style.color = '#555';

        // Create score span
        const scoreSpan = document.createElement('span');
        scoreSpan.className = 'comment-score';
        scoreSpan.style.color = '#888';
        scoreSpan.textContent = `(${addCommas(comment.score)})`;

        const createdTime = new Date(comment.created_utc * 1000).toLocaleString();
        let metaText = createdTime;
        if (comment.edited && comment.edited !== false) {
            metaText += " (edited)";
        }
        let repliesCount = 0;
        if (comment.replies && comment.replies.data && comment.replies.data.children) {
            repliesCount = comment.replies.data.children.filter(child => child.kind === "t1").length;
        }
        if (repliesCount > 0 && depth === 0) {
            metaText += ` - ${repliesCount} repl${repliesCount === 1 ? 'y' : 'ies'}`;
        }

        // Add score span to metadata and then the text
        metaP.appendChild(scoreSpan);
        metaP.appendChild(document.createTextNode(' ' + metaText));
        container.appendChild(metaP);

        // if comment has image url in body, show preview
        let urlRegex = /(https?:\/\/\S+\.(jpg|jpeg|png|gif))/i;
        let match = comment.body.match(urlRegex);
        if (match) {
            const img = document.createElement('img');
            img.src = match[1];
            img.alt = "image";
            img.style.maxWidth = "200px";
            img.style.maxHeight = "200px";
            img.style.marginTop = "5px";
            img.style.border = "1px solid #ccc";
            container.appendChild(img);
        }

        // add inline "load replies" if available and if at top level (depth 0)
        if (depth === 0 && comment.replies && comment.replies.data && comment.replies.data.children.length > 0) {
            const loadRepliesBtn = document.createElement('span');
            loadRepliesBtn.textContent = ' [load replies]';
            loadRepliesBtn.style.fontSize = '10px';
            loadRepliesBtn.style.color = '#0079d3';
            loadRepliesBtn.style.cursor = 'pointer';
            loadRepliesBtn.addEventListener('click', function() {
                let existing = container.querySelector('.comment-replies');
                if (existing) {
                    existing.remove();
                    loadRepliesBtn.textContent = ' [load replies]';
                } else {
                    const repliesContainer = formatReplies(comment.replies.data.children, depth + 1);
                    container.appendChild(repliesContainer);
                    loadRepliesBtn.textContent = ' [hide replies]';
                }
            });
            container.appendChild(loadRepliesBtn);
        }

        // add upvote/downvote buttons for comment preview
        const voteContainer = document.createElement('div');
        voteContainer.style.marginTop = '5px';

        const upvoteLink = document.createElement('a');
        // append parameters so that the new tab knows to auto-vote
        upvoteLink.href = `${postUrl}${comment.id}?vote=up&cid=${comment.id}`;
        upvoteLink.textContent = 'upvote';
        upvoteLink.style.fontSize = '10px';
        upvoteLink.style.color = '#ff4500';
        upvoteLink.style.marginRight = '5px';
        upvoteLink.target = '_blank';

        const downvoteLink = document.createElement('a');
        downvoteLink.href = `${postUrl}${comment.id}?vote=down&cid=${comment.id}`;
        downvoteLink.textContent = 'downvote';
        downvoteLink.style.fontSize = '10px';
        downvoteLink.style.color = '#7193ff';
        downvoteLink.target = '_blank';

        voteContainer.appendChild(upvoteLink);
        voteContainer.appendChild(downvoteLink);
        container.appendChild(voteContainer);

        return container;
    }

    // new version of formatReplies with "load more replies" functionality
    function formatReplies(replies, depth) {
        const container = document.createElement('div');
        container.className = 'comment-replies';
        container.style.marginLeft = '20px';
        container.style.borderLeft = '1px dashed #ccc';
        container.style.paddingLeft = '5px';

        let repliesPerPage = 3;
        let currentIndex = 0;

        function loadNextReplies() {
            let loadedCount = 0;
            let existingBtn = container.querySelector('.load-more-btn');
            if (existingBtn) existingBtn.remove();

            while (currentIndex < replies.length && loadedCount < repliesPerPage) {
                const reply = replies[currentIndex];
                currentIndex++;
                if (reply.kind !== 't1') continue;
                const replyElem = formatComment(reply.data, "", depth);
                container.appendChild(replyElem);
                loadedCount++;
            }
            if (currentIndex < replies.length) {
                const loadMoreBtn = document.createElement('span');
                loadMoreBtn.textContent = ' [load more replies]';
                loadMoreBtn.className = 'load-more-btn';
                loadMoreBtn.style.fontSize = '10px';
                loadMoreBtn.style.color = '#0079d3';
                loadMoreBtn.style.cursor = 'pointer';
                loadMoreBtn.addEventListener('click', function() {
                    loadNextReplies();
                });
                container.appendChild(loadMoreBtn);
            }
        }

        loadNextReplies();
        return container;
    }

    // utility: add commas to numbers
    function addCommas(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // estimate vote breakdown and display upvote/downvote/totals
    function estimatePostScoreVotes() {
        document.querySelectorAll('.linkinfo .score').forEach(linkinfoScore => {
            const numberElement = linkinfoScore.querySelector('.number');
            if (!numberElement) return;
            const points = parseInt(numberElement.textContent.replace(/[^0-9]/g, ''), 10);
            const percentageMatch = linkinfoScore.textContent.match(/([0-9]{1,3})\s?%/);
            const percentage = percentageMatch ? parseInt(percentageMatch[1], 10) : 0;
            if (points !== 50 && percentage !== 50) {
                const upvotes = Math.round(points * percentage / (2 * percentage - 100));
                const downvotes = upvotes - points;
                const totalVotes = upvotes + downvotes;
                const css = `
                    .linkinfo .upvotes { font-size: 80%; color: orangered; margin-left: 5px; }
                    .linkinfo .downvotes { font-size: 80%; color: #5f99cf; margin-left: 5px; }
                    .linkinfo .totalvotes { font-size: 80%; margin-left: 5px; }
                `;
                const style = document.createElement('style');
                style.innerHTML = css;
                document.head.appendChild(style);
                linkinfoScore.insertAdjacentHTML('afterend', `
                    <span class="upvotes"><span class="number">${addCommas(upvotes)}</span> <span class="word">${upvotes > 1 ? 'upvotes' : 'upvote'}</span></span>
                    <span class="downvotes"><span class="number">${addCommas(downvotes)}</span> <span class="word">${downvotes > 1 ? 'downvotes' : 'downvote'}</span></span>
                    <span class="totalvotes"><span class="number">${addCommas(totalVotes)}</span> <span class="word">${totalVotes > 1 ? 'votes' : 'vote'}</span></span>
                `);
            }
        });
    }

    // add detailed upvote/downvote info to post taglines
    async function addUpvoteDownvoteInfo() {
        const linkListing = document.querySelector(".linklisting") || (document.querySelector(".Post") ? document.querySelector(".Post").parentElement : null);
        if (!linkListing) return;
        const linkDivs = linkListing.getElementsByClassName("link");
        const promises = Array.from(linkDivs).map(async (linkDiv) => {
            const commentsLink = linkDiv.querySelector(".comments");
            if (!commentsLink) return;
            const commentsPage = await httpGet(`${commentsLink.href}?limit=1&depth=1`);
            const scoreSection = /<div class=(["'])score\1[\s\S]*?<\/div>/.exec(commentsPage);
            if (!scoreSection) return;
            const scoreMatch = /<span class=(["'])number\1>([\d\,\.]*)<\/span>/.exec(scoreSection[0]);
            if (!scoreMatch) return;
            const score = parseInt(scoreMatch[2].replace(/[,\.]/g, ''), 10);
            const upvotesPercentageMatch = /\((\d+)\s*%[^\)]*\)/.exec(scoreSection[0]);
            if (!upvotesPercentageMatch) return;
            const upvotesPercentage = parseInt(upvotesPercentageMatch[1], 10);
            const upvotes = calcUpvotes(score, upvotesPercentage);
            const downvotes = upvotes !== "--" ? score - upvotes : "--";
            updateTagline(linkDiv, upvotes, downvotes, upvotesPercentage);
        });
        await Promise.all(promises);
    }

    // calculate upvotes based on score and percentage
    function calcUpvotes(score, upvotesPercentage) {
        if (score === 0) return "--";
        return Math.round(((upvotesPercentage / 100) * score) / (2 * (upvotesPercentage / 100) - 1));
    }

    // update the post tagline with vote info
    function updateTagline(linkDiv, upvotes, downvotes, upvotesPercentage) {
        const taglineParagraph = linkDiv.querySelector(".tagline") || (linkDiv.querySelector(".Post div[data-test-id='post-content']") ? linkDiv.querySelector(".Post div[data-test-id='post-content']").querySelector(".tagline") : null);
        if (!taglineParagraph) return;
        let upvoteSpan = taglineParagraph.querySelector(".res_post_ups");
        let downvoteSpan = taglineParagraph.querySelector(".res_post_downs");
        let percentageSpan = taglineParagraph.querySelector(".res_post_percentage");
        if (!upvoteSpan || !downvoteSpan || !percentageSpan) {
            const updownInfoSpan = document.createElement("span");
            upvoteSpan = createVoteSpan("res_post_ups", upvotes, "#FF8B24");
            downvoteSpan = createVoteSpan("res_post_downs", downvotes, "#9494FF");
            percentageSpan = createVoteSpan("res_post_percentage", `${upvotesPercentage}%`, "#00A000");
            updownInfoSpan.append("(", upvoteSpan, "|", downvoteSpan, "|", percentageSpan, ") ");
            taglineParagraph.insertBefore(updownInfoSpan, taglineParagraph.firstChild);
        } else {
            upvoteSpan.textContent = upvotes;
            downvoteSpan.textContent = downvotes;
            percentageSpan.textContent = `${upvotesPercentage}%`;
        }
    }

    // helper: create a vote info span
    function createVoteSpan(className, textContent, color) {
        const span = document.createElement("span");
        span.classList.add(className);
        span.style.color = color;
        span.textContent = textContent;
        return span;
    }

    // helper: perform http get request
    async function httpGet(url) {
        const response = await fetch(url);
        return response.text();
    }

    // run vote estimation and info update on window load
    window.addEventListener('load', () => {
        estimatePostScoreVotes();
        addUpvoteDownvoteInfo();
        autoVoteComment(); // check for auto vote param in url
    });

    // allow refreshing vote info with shift+P
    window.addEventListener('keydown', (event) => {
        if (event.shiftKey && event.key === 'P') {
            estimatePostScoreVotes();
            addUpvoteDownvoteInfo();
        }
    });

    // auto-vote function: if the url contains vote parameters, auto-click the corresponding arrow on the comment
    function autoVoteComment() {
        const params = new URLSearchParams(window.location.search);
        const vote = params.get('vote'); // 'up' or 'down'
        const cid = params.get('cid'); // comment id
        if (!vote || !cid) return;
        // comment element id in old reddit is typically "thing_t1_" + comment id
        const commentElem = document.getElementById('thing_t1_' + cid);
        if (!commentElem) return;
        const arrow = vote === 'up' ? commentElem.querySelector('.arrow.up') : commentElem.querySelector('.arrow.down');
        if (arrow) {
            arrow.click();
        }
    }


    // Debug mode - set to true to see console logs
    const DEBUG = false;

    // Function to log debug messages
    function debugLog(...args) {
        if (DEBUG) {
            console.log('[View Counter]', ...args);
        }
    }

    // Cache for post view data to avoid duplicate requests
    const viewCountCache = {};

    // Function to format large numbers
    function formatNumber(num) {
        if (num === null || num === undefined || num === 0) return '? views';
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M views';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K views';
        } else {
            return num + ' views';
        }
    }

    // Function to extract post ID from an element or URL
    function getPostId(element) {
        // If given an element, extract the ID from its data attributes or classes
        if (element) {
            // For RES expanded posts
            if (element.dataset.fullname) {
                return element.dataset.fullname.replace('t3_', '');
            }

            // For link IDs in classes
            const idClass = Array.from(element.classList).find(c => c.startsWith('id-t3_'));
            if (idClass) {
                return idClass.replace('id-t3_', '');
            }

            // For RES thing IDs
            const thingId = element.getAttribute('data-fullname');
            if (thingId && thingId.startsWith('t3_')) {
                return thingId.replace('t3_', '');
            }

            // From permalink
            const permalink = element.querySelector('a.permalink');
            if (permalink && permalink.href) {
                const permalinkMatch = permalink.href.match(/\/comments\/([a-z0-9]+)\//i);
                if (permalinkMatch) {
                    return permalinkMatch[1];
                }
            }
        }

        // Extract from URL (for post pages)
        const urlMatch = window.location.pathname.match(/\/comments\/([a-z0-9]+)\//i);
        return urlMatch ? urlMatch[1] : null;
    }

    // Function to fetch post data from Reddit's API
    function fetchPostData(postId, targetElements) {
        // Skip if already in cache
        if (viewCountCache[postId]) {
            targetElements.forEach(el => {
                insertViewCount(el, viewCountCache[postId]);
            });
            return;
        }

        // Create URL for JSON API - We need to use the new Reddit API endpoint for view count
        const jsonUrl = `https://www.reddit.com/by_id/t3_${postId}.json`;

        debugLog('Fetching data for post', postId, 'from', jsonUrl);

        // Fetch data using GM_xmlhttpRequest to avoid CORS issues
        GM_xmlhttpRequest({
            method: 'GET',
            url: jsonUrl,
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'application/json'
            },
            onload: function(response) {
                try {
                    // Parse the JSON response
                    const data = JSON.parse(response.responseText);

                    debugLog('Received data for post', postId, data);

                    // Extract the post data
                    const postData = data.data.children[0].data;

                    // Get the view count - it's under different properties depending on the API version
                    let viewCount = null;

                    // Check multiple possible locations
                    if (postData.view_count !== undefined) {
                        viewCount = postData.view_count;
                    } else if (postData.viewed !== undefined) {
                        viewCount = postData.viewed;
                    } else if (postData.num_views !== undefined) {
                        viewCount = postData.num_views;
                    } else if (postData.viewCount !== undefined) {
                        viewCount = postData.viewCount;
                    } else {
                        // If no view count, try to estimate it based on score and upvote ratio
                        const score = postData.score || 0;
                        const ratio = postData.upvote_ratio || 0.5;
                        const estimatedUpvotes = Math.round(score / (2 * ratio - 1));
                        // Very rough estimate: typically views are 10-100x upvotes
                        viewCount = estimatedUpvotes * 25;
                        debugLog('Estimated view count:', viewCount, 'based on score:', score, 'and ratio:', ratio);
                    }

                    debugLog('View count for post', postId, ':', viewCount);

                    // If post has no view count data, make an API call to new Reddit
                    if (!viewCount || viewCount === 0) {
                        fetchNewRedditViewCount(postId, targetElements);
                        return;
                    }

                    // Cache the result
                    viewCountCache[postId] = viewCount;

                    // Insert view count into all target elements
                    targetElements.forEach(el => {
                        insertViewCount(el, formatNumber(viewCount));
                    });
                } catch (error) {
                    console.error('Old Reddit View Counter error:', error);
                    // Still attempt to fetch from new Reddit as fallback
                    fetchNewRedditViewCount(postId, targetElements);
                }
            },
            onerror: function(error) {
                console.error('Failed to fetch post data:', error);
                fetchNewRedditViewCount(postId, targetElements);
            }
        });
    }

    // Fallback function to try fetching view count from new Reddit
    function fetchNewRedditViewCount(postId, targetElements) {
        const newRedditUrl = `https://www.reddit.com/comments/${postId}/.json`;

        debugLog('Trying new Reddit API for post', postId);

        GM_xmlhttpRequest({
            method: 'GET',
            url: newRedditUrl,
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'application/json'
            },
            onload: function(response) {
                try {
                    // Parse the JSON response
                    const data = JSON.parse(response.responseText);

                    // Extract the post data from the first element of the array
                    const postData = data[0].data.children[0].data;

                    // Try to find view count in various properties
                    let viewCount = null;

                    if (postData.view_count !== undefined && postData.view_count !== null) {
                        viewCount = postData.view_count;
                    } else if (postData.viewCount !== undefined && postData.viewCount !== null) {
                        viewCount = postData.viewCount;
                    } else if (postData.num_views !== undefined && postData.num_views !== null) {
                        viewCount = postData.num_views;
                    } else {
                        // If no direct view count, use estimates based on votes
                        const totalVotes = postData.ups + postData.downs;
                        // Views are typically 10-100x votes
                        viewCount = totalVotes * 25;
                        debugLog('Estimated view count from votes:', viewCount);
                    }

                    debugLog('New Reddit view count for post', postId, ':', viewCount);

                    if (viewCount) {
                        // Cache the result
                        viewCountCache[postId] = viewCount;

                        // Insert view count into all target elements
                        targetElements.forEach(el => {
                            insertViewCount(el, formatNumber(viewCount));
                        });
                    } else {
                        // Use a placeholder if no view count available
                        targetElements.forEach(el => {
                            insertViewCount(el, '? views');
                        });
                    }
                } catch (error) {
                    console.error('New Reddit View Counter error:', error);
                    // Use a placeholder
                    targetElements.forEach(el => {
                        insertViewCount(el, '? views');
                    });
                }
            },
            onerror: function(error) {
                console.error('Failed to fetch from New Reddit:', error);
                // Use a placeholder
                targetElements.forEach(el => {
                    insertViewCount(el, '? views');
                });
            }
        });
    }

    // Function to insert view count into the tagline
    function insertViewCount(element, formattedViews) {
        // Find the tagline within the element
        const tagline = element.querySelector('.tagline');
        if (!tagline) return;

        // Skip if already has view count
        if (tagline.querySelector('.view-count')) return;

        // Create view count element
        const viewElement = document.createElement('span');
        viewElement.className = 'view-count';
        viewElement.textContent = formattedViews;
        viewElement.style.marginRight = '6px';
        viewElement.style.color = '#888';
        viewElement.style.fontSize = '0.9em';

        // Insert at the beginning of the tagline
        tagline.insertBefore(viewElement, tagline.firstChild);
    }

    // Function to process a single post
    function processPost(postElement) {
        const postId = getPostId(postElement);
        if (!postId) {
            debugLog('Could not find post ID for element', postElement);
            return;
        }

        debugLog('Processing post', postId);
        fetchPostData(postId, [postElement]);
    }

    // Function to process all posts on the page
    function processAllPosts() {
        // Handle individual post page
        if (window.location.pathname.includes('/comments/')) {
            const postId = getPostId();
            if (!postId) return;

            const selfPost = document.querySelector('.thing.self');
            if (selfPost) {
                fetchPostData(postId, [selfPost]);
            }
            return;
        }

        // Handle post listings (frontpage, subreddit, etc.)
        const posts = document.querySelectorAll('.thing.link:not([data-processed-views])');

        posts.forEach(post => {
            // Mark as processed
            post.setAttribute('data-processed-views', 'true');

            processPost(post);
        });
    }

    // Handle RES expandos (when a post is expanded)
    function handleResExpando() {
        document.addEventListener('click', function(e) {
            // Give time for RES to expand the post
            setTimeout(() => {
                const expandedPosts = document.querySelectorAll('.res-expando-box:not([data-processed-views])');

                expandedPosts.forEach(post => {
                    post.setAttribute('data-processed-views', 'true');

                    // Find the parent post element
                    const parentPost = post.closest('.thing');
                    if (parentPost) {
                        processPost(parentPost);
                    }
                });
            }, 500);
        });
    }

    // Handle RES never-ending Reddit (when new posts are loaded)
    function handleNeverEndingReddit() {
        // Create a mutation observer to detect when new posts are added
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    // Process new posts
                    processAllPosts();
                }
            });
        });

        // Start observing the siteTable and any potential parent containers
        const container = document.getElementById('siteTable') || document.body;
        observer.observe(container, { childList: true, subtree: true });
    }

    // Main function
    function initialize() {
        debugLog('Initializing View Counter');

        // Process all current posts
        processAllPosts();

        // Handle RES expandos
        handleResExpando();

        // Handle RES never-ending Reddit
        handleNeverEndingReddit();

        // Periodically check for new posts that might not trigger the mutation observer
        setInterval(processAllPosts, 2000);
    }

    // Initialize after a short delay to ensure the page is loaded
    setTimeout(initialize, 500);
})();