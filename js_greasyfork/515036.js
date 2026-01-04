// ==UserScript==
// @name         Really sympathies
// @namespace    http://tampermonkey.net/
// @version      3.8
// @description  Добавляет отображение симпатий без розыгрышей через /, + отображает в профиле + отслеживает новые сообщения в темах + последние 7 дней
// @author       Lotti, Punsh, eretly
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.live
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515036/Really%20sympathies.user.js
// @updateURL https://update.greasyfork.org/scripts/515036/Really%20sympathies.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const html = document.createElement("div");

    function formatNumber(num) {
        num = Number(num);
        if (isNaN(num)) return "0";
        if (num < 10000) return num.toString();
        return num.toString().replace(/\B(?=(\d{3})(?!\d))/g, " ");
    }

    function getBaseURL() {
        return window.location.origin;
    }

    function shouldRunScript() {
        const userCounters = document.querySelector('.userCounters');
        if (userCounters) {
            const hasThumbsUpIcon = userCounters.querySelector('.userCounterIcon.fa-thumbs-up');
            if (hasThumbsUpIcon) return true;
        }

        const hasLikeIcon = document.querySelector('.like2Icon, .fa-thumbs-up');
        return !!hasLikeIcon;
    }

    function updateUserSympathies(user) {
        if (!shouldRunScript() && !user.closest('.memberCard')) {
            return;
        }

        const link = user.querySelector("span a.username");
        if (!link) return;

        const userUrl = link.getAttribute("href");

        fetch(`${getBaseURL()}/${userUrl}`).then(resul => resul.text().then(htmlText => {
            let noReaction = 0;
            html.innerHTML = htmlText;

            const countElement = html.querySelector(".count");
            if (!countElement) return;

            const reaction = Number(countElement.textContent.replace(/\s+/g, ""));

            fetch(`${getBaseURL()}/${userUrl}likes?type=gotten&content_type=post&stats=1`).then(resul => {
                resul.text().then(htmlText => {
                    html.innerHTML = htmlText;

                    const allReaction = html.querySelectorAll(".node");
                    allReaction.forEach(el => {
                        const mutedElement = el.querySelector(".muted");
                        if (mutedElement && mutedElement.textContent.toLowerCase().includes("розыгрыш")) {
                            const counterElement = el.querySelector(".counter");
                            if (counterElement) {
                                noReaction += Number(counterElement.textContent.replace(/\s+/g, ""));
                            }
                        }
                    });

                    fetch(`${getBaseURL()}/${userUrl}likes`).then(resp => resp.text().then(likesHtml => {
                        const likesContainer = document.createElement("div");
                        likesContainer.innerHTML = likesHtml;

                        const pageDescription = likesContainer.querySelector("#pageDescription");
                        let last7DaysCount = 0;

                        if (pageDescription) {
                            const statsText = pageDescription.textContent;
                            const match = statsText.match(/Набрано за последние 7 дней - (\d+)/);
                            if (match && match[1]) {
                                last7DaysCount = parseInt(match[1]);
                            }
                        }

                        const adjustedCount = reaction - noReaction;
                        const element = `<i class="userCounterIcon fas fa-heart"></i>${formatNumber(reaction)} / ${formatNumber(adjustedCount)}`;
                        const counterContainer = user.querySelector(".userCounters span") || document.createElement("span");

                        counterContainer.classList.add("userCounter", "item", "muted");
                        counterContainer.innerHTML = element;
                        if (!user.querySelector(".userCounters span")) {
                            user.appendChild(counterContainer);
                        }
                    }));
                });
            });
        }));
    }

    function updateContestUserStats() {
        const userItems = document.querySelectorAll('.memberListItem');

        userItems.forEach(item => {
            const userStatCounters = item.querySelector('.userStatCounters');
            if (!userStatCounters) return;

            const likeCounter = userStatCounters.querySelector('.counter:first-child .count');
            if (!likeCounter) return;

            const likesText = likeCounter.textContent.trim();
            const totalLikes = parseInt(likesText.replace(/\s+/g, ""));

            if (isNaN(totalLikes)) {
                console.error("Could not parse likes count:", likesText);
                return;
            }

            const usernameLink = item.querySelector('h3.username a');
            if (!usernameLink) return;

            const userUrl = usernameLink.getAttribute('href');
            if (!userUrl) return;

            fetch(`${getBaseURL()}/${userUrl}`).then(response => {
                if (!response.ok) return null;
                return response.text();
            }).then(htmlText => {
                if (!htmlText) return;

                let noReaction = 0;
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = htmlText;

                fetch(`${getBaseURL()}/${userUrl}likes?type=gotten&content_type=post&stats=1`).then(response => {
                    if (!response.ok) return null;
                    return response.text();
                }).then(likesHtml => {
                    if (!likesHtml) return;

                    tempDiv.innerHTML = likesHtml;
                    const allReaction = tempDiv.querySelectorAll(".node");

                    allReaction.forEach(el => {
                        const muted = el.querySelector(".muted");
                        if (muted && muted.textContent.toLowerCase().includes("розыгрыш")) {
                            const counter = el.querySelector(".counter");
                            if (counter) {
                                const raffleCount = parseInt(counter.textContent.replace(/\s+/g, ""));
                                if (!isNaN(raffleCount)) {
                                    noReaction += raffleCount;
                                }
                            }
                        }
                    });

                    fetch(`${getBaseURL()}/${userUrl}likes`).then(response => {
                        if (!response.ok) return null;
                        return response.text();
                    }).then(profileLikesHtml => {
                        if (!profileLikesHtml) return;

                        tempDiv.innerHTML = profileLikesHtml;
                        const pageDescription = tempDiv.querySelector("#pageDescription");
                        let last7DaysCount = 0;

                        if (pageDescription) {
                            const statsText = pageDescription.textContent;
                            const match = statsText.match(/Набрано за последние 7 дней - (\d+)/);
                            if (match && match[1]) {
                                last7DaysCount = parseInt(match[1]);
                            }
                        }

                        const adjustedCount = totalLikes - noReaction;

                        console.debug("Likes calculation:", {
                            totalLikes,
                            noReaction,
                            adjustedCount,
                            last7DaysCount
                        });

                        likeCounter.textContent = `${formatNumber(totalLikes)} / ${formatNumber(adjustedCount)}`;
                    }).catch(err => console.error("Error fetching likes page:", err));
                }).catch(err => console.error("Error fetching raffle reactions:", err));
            }).catch(err => console.error("Error fetching user profile:", err));
        });
    }

    const observer = new MutationObserver(mutations => {
        const windowDiv = `<div style="position: absolute; left: -999999px; top: -999999px; width: 100px; height: 100px; overflow: scroll;"><div style="height: 200px; width: 100%;"></div></div>`;
        const reactionElements = document.querySelectorAll(".memberCardInner");

        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].outerHTML === windowDiv) {
                const latestReaction = reactionElements[reactionElements.length - 1];
                if (!latestReaction) return;

                const usernameElement = latestReaction.querySelector(".username.NoOverlay");
                if (!usernameElement) return;

                const link = usernameElement.getAttribute("href");
                if (!link) return;

                let noReaction = 0;

                fetch(`${getBaseURL()}/${link}likes?type=gotten&content_type=post&stats=1`).then(resul => {
                    resul.text().then(htmlText => {
                        html.innerHTML = htmlText;

                        const allReaction = html.querySelectorAll(".node");
                        allReaction.forEach(el => {
                            const mutedElement = el.querySelector(".muted");
                            if (mutedElement && mutedElement.textContent.toLowerCase().includes("розыгрыш")) {
                                const counterElement = el.querySelector(".counter");
                                if (counterElement) {
                                    noReaction += Number(counterElement.textContent.replace(/\s+/g, ""));
                                }
                            }
                        });

                        fetch(`${getBaseURL()}/${link}likes`).then(resp => resp.text().then(likesHtml => {
                            const likesContainer = document.createElement("div");
                            likesContainer.innerHTML = likesHtml;

                            const pageDescription = likesContainer.querySelector("#pageDescription");
                            let last7DaysCount = 0;

                            if (pageDescription) {
                                const statsText = pageDescription.textContent;
                                const match = statsText.match(/Набрано за последние 7 дней - (\d+)/);
                                if (match && match[1]) {
                                    last7DaysCount = parseInt(match[1]);
                                }
                            }

                            const counterElement = latestReaction.querySelector("a.counter");
                            if (!counterElement) return;

                            const totalReactions = Number(counterElement.textContent.replace(/\s+/g, ""));
                            const adjustedCount = totalReactions - noReaction;
                            const element = `<i class="counterIcon likeCounterIcon"></i>${formatNumber(totalReactions)} / ${formatNumber(adjustedCount)}`;
                            counterElement.innerHTML = element;
                        }));
                    });
                });
            }

            mutation.addedNodes.forEach(node => {
                if (node.classList && node.classList.contains("message")) {
                    const user = node.querySelector(".userText");
                    if (user) updateUserSympathies(user);
                }

                if (node.classList && node.classList.contains("memberListItem") && window.location.href.includes("contest-users")) {
                    setTimeout(() => updateContestUserStats(), 500);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    document.querySelectorAll(".userText").forEach(updateUserSympathies);

    if (window.location.href.includes("contest-users")) {
        setTimeout(() => updateContestUserStats(), 1000);
    }

    function updateProfileSympathies() {
        const profileCounter = document.querySelector('a.page_counter[href$="likes"] .count');
        if (profileCounter) {
            const profileSympathies = Number(profileCounter.textContent.replace(/\s+/g, ""));
            let noReaction = 0;

            const currentPath = window.location.pathname;
            const likesPath = currentPath + (currentPath.endsWith('/') ? '' : '/') + 'likes';

            fetch(window.location.href + 'likes?type=gotten&content_type=post&stats=1').then(resul => {
                resul.text().then(htmlText => {
                    html.innerHTML = htmlText;

                    const allReaction = html.querySelectorAll(".node");
                    allReaction.forEach(el => {
                        const mutedElement = el.querySelector(".muted");
                        if (mutedElement && mutedElement.textContent.toLowerCase().includes("розыгрыш")) {
                            const counterElement = el.querySelector(".counter");
                            if (counterElement) {
                                noReaction += Number(counterElement.textContent.replace(/\s+/g, ""));
                            }
                        }
                    });

                    fetch(`${getBaseURL()}${likesPath}`).then(resp => resp.text().then(likesHtml => {
                        const likesContainer = document.createElement("div");
                        likesContainer.innerHTML = likesHtml;

                        const pageDescription = likesContainer.querySelector("#pageDescription");
                        let last7DaysCount = 0;

                        if (pageDescription) {
                            const statsText = pageDescription.textContent;
                            const match = statsText.match(/Набрано за последние 7 дней - (\d+)/);
                            if (match && match[1]) {
                                last7DaysCount = parseInt(match[1]);
                            }
                        }

                        const adjustedCount = profileSympathies - noReaction;
                        profileCounter.innerHTML = `<i class="counterIcon likeCounterIcon"></i>${formatNumber(profileSympathies)} / ${formatNumber(adjustedCount)}`;
                    }));
                });
            });
        }
    }

    updateProfileSympathies();

})();