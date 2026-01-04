// ==UserScript==
// @name         The Information | Enhanced Article Experience
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Extract and display article data from The Information.
// @author       UniverseDev
// @icon         https://www.google.com/s2/favicons?domain=theinformation.com&sz=64
// @license      GPL-3.0-or-later
// @match        https://www.theinformation.com/articles/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528918/The%20Information%20%7C%20Enhanced%20Article%20Experience.user.js
// @updateURL https://update.greasyfork.org/scripts/528918/The%20Information%20%7C%20Enhanced%20Article%20Experience.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function linkTwitterHandles(element) {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            let parent = node.parentNode;
            let insideAnchor = false;
            while (parent && parent !== element) {
                if (parent.tagName === 'A') {
                    insideAnchor = true;
                    break;
                }
                parent = parent.parentNode;
            }
            if (!insideAnchor) {
                textNodes.push(node);
            }
        }

        textNodes.forEach(textNode => {
            const text = textNode.textContent;
            const regex = /(?<!\w)@(\w{1,15})\b/g;
            let match;
            let lastIndex = 0;
            const fragments = [];

            while ((match = regex.exec(text)) !== null) {
                const before = text.substring(lastIndex, match.index);
                if (before) {
                    fragments.push(document.createTextNode(before));
                }
                const handle = match[0];
                const username = match[1];
                const a = document.createElement('a');
                a.href = `https://twitter.com/${username}`;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.textContent = handle;
                fragments.push(a);
                lastIndex = regex.lastIndex;
            }

            if (lastIndex < text.length) {
                fragments.push(document.createTextNode(text.substring(lastIndex)));
            }

            if (fragments.length > 0) {
                const parent = textNode.parentNode;
                fragments.forEach(fragment => {
                    parent.insertBefore(fragment, textNode);
                });
                parent.removeChild(textNode);
            }
        });
    }

    window.onload = function() {
        const scriptTag = document.querySelector('script[type="application/json"][data-component-name="Article"]');
        if (!scriptTag) {
            console.error('No JSON script tag found.');
            return;
        }

        let jsonData;
        try {
            jsonData = JSON.parse(scriptTag.textContent);
        } catch (e) {
            console.error('Failed to parse JSON:', e);
            return;
        }

        const displayDiv = document.createElement('div');
        displayDiv.className = 'article-display';

        const style = document.createElement('style');
        style.textContent = `
            .article-display {
                margin: 20px 20px 40px 20px;
                padding: 20px;
                background: #ffffff;
                font-family: Arial, sans-serif;
            }
            .article-picture {
                max-width: 100%;
                height: auto;
                margin-bottom: 10px;
            }
            .authors {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                margin-top: 10px;
            }
            .author {
                max-width: 300px;
                border: 1px solid #ccc;
                padding: 15px;
                border-radius: 5px;
            }
            .author img {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                margin-bottom: 10px;
            }
            .related-article {
                display: flex;
                flex-direction: column;
                margin-bottom: 20px;
                padding: 16px;
                border-top: 1px solid #ccc;
            }
            .related-article img {
                width: 100%;
                max-width: 300px;
                height: auto;
                margin-bottom: 16px;
            }
            .related-article .text {
                flex: 1;
            }
            .related-article .highlight {
                font-weight: bold;
                color: magenta;
                margin-bottom: 12px;
            }
            .related-article h4 {
                margin: 0 0 12px 0;
                font-size: 1.2em;
            }
            .related-article .meta {
                color: gray;
                font-size: 0.9em;
            }
            .related-article .excerpt {
                font-size: 0.9em;
                color: #555;
                margin-top: 10px;
            }
            .related-article .comments {
                color: #666;
                font-size: 0.9em;
                margin-top: 5px;
            }
            .json-buttons {
                display: flex;
                gap: 10px;
                margin-top: 20px;
            }
            .json-toggle-btn {
                padding: 5px 10px;
                font-size: 0.9em;
                background-color: #ffffff;
                color: #007bff;
                border: 2px solid #007bff;
                cursor: pointer;
                border-radius: 5px;
                transition: background-color 0.3s, color 0.3s;
            }
            .json-toggle-btn:hover {
                background-color: #007bff;
                color: #ffffff;
            }
            .json-data {
                display: none;
                margin-top: 20px;
                padding: 10px;
                background: #eee;
                border: 1px solid #ccc;
                white-space: pre-wrap;
                word-wrap: break-word;
                overflow-x: auto;
            }
            .article-display a {
                color: inherit;
                text-decoration: none;
            }
            .article-display a:hover {
                color: #ff00ff;
                text-decoration: none;
            }
            .exclusive {
                font-weight: bold;
                color: #ff00ff;
            }
            .exclusive-article {
                border: 2px solid #ff00ff;
                background-color: #fff0f5;
                padding: 10px;
            }
            .article-display .summary a {
                font-weight: bold;
            }
            @media (min-width: 640px) {
                .related-article {
                    flex-direction: row;
                }
                .related-article img {
                    margin-right: 24px;
                    margin-bottom: 0;
                }
            }
        `;
        document.head.appendChild(style);

        if (jsonData.article.picture && jsonData.article.id) {
            const img = document.createElement('img');
            img.src = `https://tii.imgix.net/production/articles/${jsonData.article.id}/${jsonData.article.picture}?auto=compress&fit=crop&auto=format`;
            img.alt = jsonData.article.title || 'Article Picture';
            img.className = 'article-picture';
            img.setAttribute('loading', 'lazy');
            displayDiv.appendChild(img);

            if (jsonData.article.pictureCaption) {
                const captionP = document.createElement('p');
                captionP.textContent = jsonData.article.pictureCaption;
                captionP.style.fontStyle = 'italic';
                displayDiv.appendChild(captionP);
            }
        }

        const titleH1 = document.createElement('h1');
        titleH1.textContent = jsonData.article.title || 'Untitled Article';
        if (jsonData.article.highlight && jsonData.article.highlight.startsWith('Exclusive:')) {
            const exclusiveSpan = document.createElement('span');
            exclusiveSpan.textContent = ' (Exclusive)';
            exclusiveSpan.className = 'exclusive';
            titleH1.appendChild(exclusiveSpan);
        }
        displayDiv.appendChild(titleH1);

        const publishedP = document.createElement('p');
        const publishedAt = jsonData.article.publishedAt;
        let publishedText = 'Published: ';
        if (publishedAt) {
            const publishedDate = new Date(publishedAt);
            publishedText += isNaN(publishedDate.getTime())
                ? publishedAt
                : publishedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        } else {
            publishedText += 'Not available';
        }
        publishedP.textContent = publishedText;
        publishedP.style.color = '#666';
        displayDiv.appendChild(publishedP);

        if (jsonData.article.highlight) {
            const highlightP = document.createElement('p');
            let highlightText = jsonData.article.highlight;
            if (highlightText.startsWith('Exclusive:')) {
                highlightText = '<span class="exclusive">Exclusive:</span>' + highlightText.slice(10);
            }
            highlightP.innerHTML = highlightText;
            highlightP.style.fontStyle = 'italic';
            displayDiv.appendChild(highlightP);
        }

        if (jsonData.article.authors && jsonData.article.authors.length > 0) {
            const authorsDiv = document.createElement('div');
            authorsDiv.className = 'authors';

            jsonData.article.authors.forEach(author => {
                const authorDiv = document.createElement('div');
                authorDiv.className = 'author';

                if (author.picture) {
                    const imgLink = document.createElement('a');
                    imgLink.href = `https://www.theinformation.com/u/${author.username}`;
                    imgLink.target = '_blank';
                    imgLink.rel = 'noopener noreferrer';
                    const img = document.createElement('img');
                    img.src = author.picture;
                    img.alt = author.name || 'Author Picture';
                    img.setAttribute('loading', 'lazy');
                    imgLink.appendChild(img);
                    authorDiv.appendChild(imgLink);
                }

                const nameP = document.createElement('p');
                nameP.innerHTML = `<a href="https://www.theinformation.com/u/${author.username}" target="_blank" rel="noopener noreferrer"><strong>${author.name || 'Unnamed Author'}</strong></a>`;
                const bioText = author.bio && author.bio.trim() ? author.bio : author.fullBio;

                if (author.twitter) {
                    const twitterUsername = author.twitter.replace(/^@/, '');
                    if (!bioText || !bioText.includes(`@${twitterUsername}`)) {
                        nameP.innerHTML += ` - <a href="https://twitter.com/${twitterUsername}" target="_blank" rel="noopener noreferrer">@${twitterUsername}</a>`;
                    }
                }
                authorDiv.appendChild(nameP);

                if (bioText) {
                    const bioP = document.createElement('p');
                    bioP.innerHTML = bioText;
                    linkTwitterHandles(bioP);
                    bioP.querySelectorAll('a').forEach(a => {
                        a.target = '_blank';
                        a.rel = 'noopener noreferrer';
                    });
                    authorDiv.appendChild(bioP);
                }

                authorsDiv.appendChild(authorDiv);
            });

            displayDiv.appendChild(authorsDiv);
        }

        if (jsonData.article.freeBlurb) {
            const summaryH3 = document.createElement('h3');
            summaryH3.textContent = 'Summary';
            displayDiv.appendChild(summaryH3);

            const summaryDiv = document.createElement('div');
            summaryDiv.className = 'summary';
            summaryDiv.innerHTML = jsonData.article.freeBlurb;
            summaryDiv.querySelectorAll('a').forEach(a => {
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
            });
            displayDiv.appendChild(summaryDiv);
        }

        if (jsonData.article.pickups && jsonData.article.pickups.length > 0) {
            displayDiv.appendChild(document.createElement('hr'));
            const pickupsH3 = document.createElement('h3');
            pickupsH3.textContent = jsonData.article.pickups.length > 1 ? 'Sources' : 'Source';
            displayDiv.appendChild(pickupsH3);

            const pickupsUl = document.createElement('ul');
            jsonData.article.pickups.forEach(pickup => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="${pickup.url}" target="_blank" rel="noopener noreferrer">${pickup.title}</a> (${pickup.publication})`;
                pickupsUl.appendChild(li);
            });
            displayDiv.appendChild(pickupsUl);
        }

        if (jsonData.mostPopularArticles && jsonData.mostPopularArticles.length > 0) {
            displayDiv.appendChild(document.createElement('hr'));
            const popularH3 = document.createElement('h3');
            popularH3.textContent = 'Most Popular Articles';
            displayDiv.appendChild(popularH3);

            jsonData.mostPopularArticles.forEach(article => {
                const articleDiv = document.createElement('article');
                articleDiv.className = 'related-article';

                const textDiv = document.createElement('div');
                textDiv.className = 'text';

                if (article.highlight) {
                    const highlightP = document.createElement('p');
                    highlightP.className = 'highlight';
                    let highlightText = article.highlight;
                    if (highlightText.startsWith('Exclusive:')) {
                        highlightText = '<span class="exclusive">Exclusive:</span>' + highlightText.slice(10);
                    }
                    highlightP.innerHTML = highlightText;
                    textDiv.appendChild(highlightP);
                }

                const titleH4 = document.createElement('h4');
                titleH4.innerHTML = `<a href="https://www.theinformation.com/articles/${article.slug}" target="_blank" rel="noopener noreferrer">${article.title || 'Untitled'}</a>`;
                textDiv.appendChild(titleH4);

                if (article.publishedAt) {
                    const metaP = document.createElement('p');
                    metaP.className = 'meta';
                    const publishedDate = new Date(article.publishedAt);
                    metaP.textContent = isNaN(publishedDate.getTime())
                        ? article.publishedAt
                        : publishedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                    textDiv.appendChild(metaP);
                }

                articleDiv.appendChild(textDiv);
                displayDiv.appendChild(articleDiv);
            });
        }

        if (jsonData.relatedArticles && jsonData.relatedArticles.length > 0) {
            displayDiv.appendChild(document.createElement('hr'));
            const relatedH3 = document.createElement('h3');
            relatedH3.textContent = 'Related Articles';
            displayDiv.appendChild(relatedH3);

            jsonData.relatedArticles.forEach(article => {
                const articleDiv = document.createElement('article');
                articleDiv.className = 'related-article';
                if (article.highlight && article.highlight.startsWith('Exclusive:')) {
                    articleDiv.classList.add('exclusive-article');
                }

                if (article.picture && article.id) {
                    const imgLink = document.createElement('a');
                    imgLink.href = article.url;
                    imgLink.target = '_blank';
                    imgLink.rel = 'noopener noreferrer';
                    const img = document.createElement('img');
                    img.src = `https://tii.imgix.net/production/articles/${article.id}/${article.picture}?auto=compress&fit=crop&auto=format`;
                    img.alt = article.title || 'Related Article';
                    img.setAttribute('loading', 'lazy');
                    imgLink.appendChild(img);
                    articleDiv.appendChild(imgLink);
                }

                const textDiv = document.createElement('div');
                textDiv.className = 'text';

                if (article.highlight) {
                    const highlightP = document.createElement('p');
                    highlightP.className = 'highlight';
                    let highlightText = article.highlight;
                    if (highlightText.startsWith('Exclusive:')) {
                        highlightText = '<span class="exclusive">Exclusive:</span>' + highlightText.slice(10);
                    }
                    highlightP.innerHTML = highlightText;
                    textDiv.appendChild(highlightP);
                }

                const titleH4 = document.createElement('h4');
                titleH4.innerHTML = `<a href="${article.url}" target="_blank" rel="noopener noreferrer">${article.title || 'Untitled'}</a>`;
                textDiv.appendChild(titleH4);

                if (article.authors || article.publishedAt) {
                    const metaP = document.createElement('p');
                    metaP.className = 'meta';
                    let metaText = '';
                    if (article.authors && article.authors.length > 0) {
                        metaText += 'By ' + article.authors.map(a => a.name).join(', ');
                    }
                    if (article.publishedAt) {
                        const publishedDate = new Date(article.publishedAt);
                        metaText += (metaText ? ' • ' : '') + (isNaN(publishedDate.getTime())
                            ? article.publishedAt
                            : publishedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }));
                    }
                    metaP.textContent = metaText;
                    textDiv.appendChild(metaP);
                }

                if (article.excerpt && article.excerpt.long) {
                    const excerptP = document.createElement('p');
                    excerptP.className = 'excerpt';
                    excerptP.textContent = article.excerpt.long;
                    textDiv.appendChild(excerptP);
                }

                if (article.commentCount > 0) {
                    const commentsP = document.createElement('p');
                    commentsP.className = 'comments';
                    commentsP.textContent = `${article.commentCount} comment${article.commentCount > 1 ? 's' : ''}`;
                    textDiv.appendChild(commentsP);
                }

                articleDiv.appendChild(textDiv);
                displayDiv.appendChild(articleDiv);
            });
        }

        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'json-buttons';
        const jsonButton = document.createElement('button');
        jsonButton.textContent = '{}';
        jsonButton.title = 'Toggle JSON view';
        jsonButton.className = 'json-toggle-btn';
        buttonsDiv.appendChild(jsonButton);
        displayDiv.appendChild(buttonsDiv);

        const jsonDiv = document.createElement('div');
        jsonDiv.className = 'json-data';
        const pre = document.createElement('pre');
        pre.textContent = JSON.stringify(jsonData, null, 2);
        jsonDiv.appendChild(pre);
        displayDiv.appendChild(jsonDiv);

        jsonButton.addEventListener('click', () => {
            const isHidden = jsonDiv.style.display === 'none' || jsonDiv.style.display === '';
            jsonDiv.style.display = isHidden ? 'block' : 'none';
            jsonButton.textContent = isHidden ? 'Hide JSON' : '{}';
        });

        document.body.insertBefore(displayDiv, document.body.firstChild);
    };
})();