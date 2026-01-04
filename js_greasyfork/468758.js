// ==UserScript==
// @name         coomer-optimizer
// @namespace    https://coomer.su/
// @version      3.2.1
// @description  Improves coomer.party
// @match        https://coomer.st/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      MIT
// @run-at       document-end
// @homepage     https://greasyfork.org/en/scripts/468758-coomer-optimizer
// @downloadURL https://update.greasyfork.org/scripts/468758/coomer-optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/468758/coomer-optimizer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle('.card--dislike {border-color: hsl(0, 100%, 50%); border-style: solid; border-width: 2px; }');
    GM_addStyle('.card--nevermet {border-color: hsl(120, 100%, 20%); border-style: solid; border-width: 2px !important; }');


    /**
     * Extract the summary object from the URL
     */
    const extractSummary = function (url, orUser) {
        let m = url.match(/user\/([^\/]+)/);
        if (m) {
            let userKey = key(m[1]);
            let summary = JSON.parse(localStorage.getItem(userKey));
            if (summary && !summary.user) {
                summary.user = m[1];
            }
            // console.debug('URL: ', url, " --> key: ", userKey, " --> summary: ", summary);
            return summary ? summary : (orUser ? m[1] : summary);
        } else {
            // console.debug('URL: ', url, " --> no user");
            return false;
        }

    }

    const key = function (_usr) {
        return `copt_${_usr}`;
    }

    const getEl = function(_root_el, _tag, _class) {
        let _el;
        if (_root_el.tagName == _tag.toUpperCase() && _root_el.classList.contains(_class)) {
            _el = _root_el;
        } else if (_root_el.querySelector) {
            _el = _root_el.querySelector(`${_tag}.${_class}`);
        }
        return _el;
    }

    const rootOptimizer = function (_root) {
        let userPageURLMatch = window.location.pathname.match(/\/user\/([^/]+)$/);
        let userPostsPageURLMatch = window.location.pathname.match(/\/user\/([^/]+)\/post/);
        let artistsPageURLMatch = window.location.pathname.match(/\/artists/);
        let postsPageURLMatch = window.location.pathname.match(/\/posts/);

        //user page
        if (userPageURLMatch || userPostsPageURLMatch) {
            let pageUser = false;
            let userPageCSSPrefix = false;
            if (userPageURLMatch) {
                pageUser = userPageURLMatch[1];
                userPageCSSPrefix = 'user-header';
            } else if (userPostsPageURLMatch) {
                pageUser = userPostsPageURLMatch[1];
                userPageCSSPrefix = 'post';
            }
            console.debug(`User page detected for ${pageUser}`);

            //adding styles
            GM_addStyle('span.user-header__dislike-icon::before { content: "\uD83D\uDC4E"; }');

            let pageUserKey = key(pageUser);

            let today = new Date().toISOString().split('T')[0]; // Get the current date in ISO format

            //load or create the summary data for the user
            let summary = localStorage.getItem(pageUserKey);
            //If no summary data, we create it
            if (!summary) {
                summary = {
                    user: pageUser,
                    visits: 1,
                    previousVisit: false,
                    lastVisit: today,
                    disliked: false
                };
            } else {
                summary = JSON.parse(summary);
            }

            //Increment the number of visits if the page has been visited not today
            if (summary.lastVisit !== today) {
                summary.visits += 1;
                summary.previousVisit = summary.lastVisit;
                summary.lastVisit = today;
                if (!summary.user) {
                    summary.user = pageUser;
                }
            }

            //Store the summary
            console.debug(`User ${pageUser}:`, summary);
            localStorage.setItem(pageUserKey, JSON.stringify(summary));

            //header optimization ====================================================

            //summary text
            let summaryElement = document.createElement('span');
            if (summary.previousVisit) {
                summaryElement.textContent = `- Visited ${summary.visits} times, last visit on ${summary.previousVisit}`;
            } else {
                summaryElement.textContent = `- First time visit`;
            }

            // dislike button
            let dislikeButton = document.createElement('button');
            dislikeButton.type = 'button';
            dislikeButton.className = `${userPageCSSPrefix}__favourite`;

            let iconElement = document.createElement('span');
            iconElement.className = `${userPageCSSPrefix}__fav-icon`
            iconElement.textContent = summary.disliked ? '👍🏻' : '👎';
            dislikeButton.appendChild(iconElement);

            let textElement = document.createElement('span');
            textElement.className = `${userPageCSSPrefix}__fav-text`;
            textElement.textContent = summary.disliked ? 'Un-dislike' : 'Dislike';
            dislikeButton.appendChild(textElement);
            dislikeButton.addEventListener('click', () => {
                summary.disliked = !summary.disliked;
                localStorage.setItem(pageUserKey, JSON.stringify(summary));
                iconElement.textContent = summary.disliked ? '👍🏻' : '👎';
                textElement.textContent = summary.disliked ? 'Un-dislike' : 'Dislike';
            });

            let _summary_element, _parent_cssClass;
            if (userPageURLMatch) {
                _summary_element = document.createElement('div');
                _summary_element.appendChild(summaryElement);
                _parent_cssClass = `${userPageCSSPrefix}__info`
            } else {
                _summary_element = summaryElement;
                _parent_cssClass = `${userPageCSSPrefix}__published`
            }

            //header
            let _pardiv = getEl(_root, 'div', _parent_cssClass);
            if (_pardiv) {
                _pardiv.appendChild(_summary_element);
            }

            //actions
            let _actdiv = getEl(_root, 'div', `${userPageCSSPrefix}__actions`);
            if (_actdiv) {
                _actdiv.appendChild(dislikeButton);
            }

            // footer optimization ======================================================================

            // bottom header repeater
            let navMenu = getEl(_root, 'nav', 'post__nav-links');
            let commentSection = getEl(_root, 'footer', 'post__footer');

            if (navMenu && commentSection) {
                commentSection.appendChild(navMenu.cloneNode(true));
            }

            // user post page
            if (userPostsPageURLMatch
                && (_root.querySelectorAll || _root.tagName == 'H2')) {
                // var headers = _root.getElementsByTagName('h2');
                var headers = _root.tagName == 'H2' ? [_root] : _root.querySelectorAll('h2');
                for (var i = 0; i < headers.length; i++) {
                    if (headers[i].innerHTML == 'Downloads') {
                        let copyDownloadsButton = document.createElement('button');
                        copyDownloadsButton.type = 'button';
                        copyDownloadsButton.className = `${userPageCSSPrefix}__favourite`;

                        let textElement = document.createElement('span');
                        textElement.className = `${userPageCSSPrefix}__fav-text`;
                        textElement.textContent = 'Copy';
                        copyDownloadsButton.appendChild(textElement);
                        copyDownloadsButton.addEventListener('click', () => {
                            var attachemnts = '';
                            var c = 0;
                            document.querySelectorAll('a.post__attachment-link').forEach(l => {
                                attachemnts += l.href + '\n';
                                c++;
                            });
                            GM_setClipboard(attachemnts);
                            console.log('copied (', c, ')');
                        });

                        headers[i].appendChild(copyDownloadsButton);
                    }
                }
            }

        } else if (/* artist pages */ artistsPageURLMatch) {
            console.debug('Artist list page detected');

            let enrichUserCard = function (c) {
                let summary = extractSummary(c.href);
                if (summary) {
                    c.className += ' co-parsed';

                    let serviceLabel = c.querySelector('span.user-card__service');
                    let visitedLabel = serviceLabel.cloneNode(true);
                    visitedLabel.textContent = `# ${summary.visits}`;
                    visitedLabel.style.marginLeft = '4px';
                    visitedLabel.style.backgroundColor = 'rgb(240, 140, 207)';
                    serviceLabel.insertAdjacentElement('afterend', visitedLabel);

                    if (summary.previousVisit) {
                        let daysAfterLabel = visitedLabel.cloneNode(true);
                        let daysFromLastVisit = Math.floor((new Date() - new Date(summary.previousVisit)) / (1000 * 60 * 60 * 24));
                        daysAfterLabel.textContent = `📅 ${daysFromLastVisit}`
                        daysAfterLabel.title = `Last visit on ${summary.previousVisit}`;
                        visitedLabel.insertAdjacentElement('afterend', daysAfterLabel);
                    }

                    if (summary.disliked) {
                        c.className += ' card--dislike';
                    }
                } else {
                    c.className += ' card--nevermet';
                }
            }

            if (_root.tagName == 'A' && _root.classList.contains('user-card')) {
                enrichUserCard(_root);
            } else if (_root.querySelectorAll) {
                _root.querySelectorAll('a.user-card').forEach(card => {
                    enrichUserCard(card);
                });
            }
        } else if (/*post list pages */ postsPageURLMatch) {
            console.debug('Post list page detected');

            let enrichCard = function(card) {
                let summary = extractSummary(card.querySelector('a').href, true);
                console.debug(summary);
                if (summary) {
                    card.className += ' co-parsed';

                    //if there is a summary
                    if (summary.user) {
                        console.debug('sum', summary);
                        //replace attachment number with username
                        card.querySelector('footer > div').textContent = `${summary.user} (${summary.visits})`;

                        if (summary.disliked) {
                            card.className += ' card--dislike';
                        }
                    } else {
                        card.querySelector('footer > div').textContent = summary;
                        card.className += ' card--nevermet';
                    }
                }
            }

            if (_root.tagName == 'ARTICLE' && _root.classList.contains('post-card')) {
                enrichCard(_root);
            } else if (_root.querySelectorAll) {
                _root.querySelectorAll('article.post-card').forEach(card => {
                    enrichCard(card);
                })
            }

        }

    }

    // Create a MutationObserver to watch for changes in the DOM
    var observer = new MutationObserver(function (mutationsList, observer) {
        for (const mutation of mutationsList) {

            if (mutation.type === 'childList'
                && mutation.target
                && mutation.addedNodes.length > 0) {

                let _root = mutation.addedNodes[0];
                rootOptimizer(_root);
            }
        }
    });


    // Define the options for the observer
    const observerOptions = {
        childList: true,
        subtree: true
    };

    // Start observing the document body for changes
    observer.observe(document.body, observerOptions);

})();
