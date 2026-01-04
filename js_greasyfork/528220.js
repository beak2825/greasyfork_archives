// ==UserScript==
// @name         Really sympathies Full Stat
// @namespace    http://tampermonkey.net/
// @version      3.8
// @description  Добавляет отображение симпатий без розыгрышей через /, + отображает в профиле + отслеживает новые сообщения в темах + последние 7 дней + лайки и последние 7 дней
// @author       Lotti, Punsh, eretly
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.live
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528220/Really%20sympathies%20Full%20Stat.user.js
// @updateURL https://update.greasyfork.org/scripts/528220/Really%20sympathies%20Full%20Stat.meta.js
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
        if (shouldRunScript()) return;

        const link = user.querySelector("span a.username");
        if (!link) return;

        const userUrl = link.getAttribute("href");
        if (!userUrl) return;

        const tempDiv = document.createElement('div');

        fetch(`${getBaseURL()}${userUrl}`)
            .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
            .then(htmlText => {
            tempDiv.innerHTML = htmlText;
            const countElement = tempDiv.querySelector(".count");
            if (!countElement) throw new Error('Count element not found');

            const reaction = Number(countElement.textContent.replace(/\s+/g, ""));
            if (isNaN(reaction)) throw new Error('Invalid reaction count');

            return fetch(`${getBaseURL()}${userUrl}likes?type=gotten&content_type=post&stats=1`)
                .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
                .then(raffleHtml => {
                tempDiv.innerHTML = raffleHtml;
                let noReaction = 0;
                const raffleNodes = tempDiv.querySelectorAll(".node");

                raffleNodes.forEach(el => {
                    const mutedElement = el.querySelector(".muted");
                    if (mutedElement && mutedElement.textContent.toLowerCase().includes("розыгрыш")) {
                        const counterElement = el.querySelector(".counter");
                        if (counterElement) {
                            const raffleCount = Number(counterElement.textContent.replace(/\s+/g, ""));
                            if (!isNaN(raffleCount)) {
                                noReaction += raffleCount;
                            }
                        }
                    }
                });

                return fetch(`${getBaseURL()}${userUrl}likes`)
                    .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.text();
                })
                    .then(likesHtml => {
                    tempDiv.innerHTML = likesHtml;
                    const pageDescription = tempDiv.querySelector("#pageDescription");
                    let last7DaysCount = 0;

                    if (pageDescription) {
                        const statsText = pageDescription.textContent;
                        const match = statsText.match(/Набрано за последние 7 дней - (\d+)/);
                        if (match && match[1]) {
                            last7DaysCount = parseInt(match[1]);
                        }
                    }

                    const adjustedCount = reaction - noReaction;
                    const element = `<i class="userCounterIcon fas fa-heart"></i>${formatNumber(reaction)} / ${formatNumber(adjustedCount)} / ${formatNumber(last7DaysCount)}`;
                    const counterContainer = user.querySelector(".userCounters span") || document.createElement("span");

                    counterContainer.classList.add("userCounter", "item", "muted");
                    counterContainer.innerHTML = element;

                    const existingCounters = user.querySelectorAll('.userCounter');
                    if (existingCounters.length > 1) {
                        existingCounters.forEach((counter, index) => {
                            if (index > 0) counter.remove();
                        });
                    }

                    if (!user.querySelector(".userCounter")) {
                        user.querySelector(".userCounters").appendChild(counterContainer);
                    }
                });
            });
        })
            .catch(error => {
            console.error('Error updating user sympathies:', error);
            const element = `<i class="userCounterIcon fas fa-heart"></i>${formatNumber(reaction)} / - / -`;
            const counterContainer = user.querySelector(".userCounters span") || document.createElement("span");
            counterContainer.classList.add("userCounter", "item", "muted");
            counterContainer.innerHTML = element;
            if (!user.querySelector(".userCounter")) {
                user.querySelector(".userCounters").appendChild(counterContainer);
            }
        });
    }

    function updateUserLikes2(user) {
        if (!shouldRunScript()) return;

        const link = user.querySelector("span a.username");
        if (!link) return;

        const userUrl = link.getAttribute("href");

        fetch(`${getBaseURL()}/${userUrl}`)
            .then(resul => resul.text())
            .then(htmlText => {
            const html = document.createElement("div");
            html.innerHTML = htmlText;

            const likesElement = html.querySelector('a.page_counter[href$="likes2"]');
            if (!likesElement) {
                console.log("Элемент с лайками (likes2) не найден на странице пользователя.");
                return;
            }

            const countElement = likesElement.querySelector(".count");
            if (!countElement) {
                console.log("Элемент .count не найден внутри элемента с лайками.");
                return;
            }

            const likes2 = Number(countElement.textContent.replace(/\s+/g, ""));

            fetch(`${getBaseURL()}/${userUrl}likes2`)
                .then(resp => resp.text())
                .then(likes2Html => {
                const likes2Container = document.createElement("div");
                likes2Container.innerHTML = likes2Html;

                const pageDescription = likes2Container.querySelector("#pageDescription");
                let last7DaysCount = 0;

                if (pageDescription) {
                    const statsText = pageDescription.textContent;
                    const match = statsText.match(/Набрано за последние 7 дней - (\d+)/);
                    if (match && match[1]) {
                        last7DaysCount = parseInt(match[1]);
                    }
                }

                const element = `<i class="userCounterIcon fas fa-thumbs-up"></i>${formatNumber(likes2)} / ${formatNumber(last7DaysCount)}`;
                const counterContainer = user.querySelector(".userCounters span") || document.createElement("span");

                counterContainer.classList.add("userCounter", "item", "muted");
                counterContainer.innerHTML = element;
                if (!user.querySelector(".userCounters span")) {
                    user.querySelector(".userCounters").appendChild(counterContainer);
                }
            });
        })
            .catch(error => {
            console.error("Ошибка при обработке страницы пользователя:", error);
        });
    }

    function initUserCounters(user) {
        if (shouldRunScript()) {
            updateUserLikes2(user);
        } else {
            updateUserSympathies(user);
        }
    }

    const users = document.querySelectorAll('.user');
    users.forEach(user => initUserCounters(user));

    // Розыгрыши симпы
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

                        likeCounter.textContent = `${formatNumber(totalLikes)} / ${formatNumber(adjustedCount)} / ${formatNumber(last7DaysCount)}`;
                    }).catch(err => console.error("Error fetching likes page:", err));
                }).catch(err => console.error("Error fetching raffle reactions:", err));
            }).catch(err => console.error("Error fetching user profile:", err));
        });
    }

    // Розыгрыши лайки
    function updateContestUserLikes2() {
        const userItems = document.querySelectorAll('.memberListItem');

        userItems.forEach(item => {
            const userStatCounters = item.querySelector('.userStatCounters');
            if (!userStatCounters) return;

            const like2Counter = userStatCounters.querySelector('.counter:nth-child(2) .count');
            if (!like2Counter) return;

            const likes2Text = like2Counter.textContent.trim();
            const totalLikes2 = parseInt(likes2Text.replace(/\s+/g, ""));

            if (isNaN(totalLikes2)) {
                console.error("Could not parse likes2 count:", likes2Text);
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

                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = htmlText;

                fetch(`${getBaseURL()}/${userUrl}likes2`).then(response => {
                    if (!response.ok) return null;
                    return response.text();
                }).then(likes2Html => {
                    if (!likes2Html) return;

                    tempDiv.innerHTML = likes2Html;
                    const pageDescription = tempDiv.querySelector("#pageDescription");
                    let last7DaysCount = 0;

                    if (pageDescription) {
                        const statsText = pageDescription.textContent;
                        const match = statsText.match(/Набрано за последние 7 дней - (\d+)/);
                        if (match && match[1]) {
                            last7DaysCount = parseInt(match[1]);
                        }
                    }

                    like2Counter.textContent = `${formatNumber(totalLikes2)} / ${formatNumber(last7DaysCount)}`;
                }).catch(err => console.error("Error fetching likes2 page:", err));
            }).catch(err => console.error("Error fetching user profile:", err));
        });
    }


    // Мини профиль (обсервер)
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.classList && node.classList.contains("message")) {
                    const user = node.querySelector(".userText");
                    if (user) {
                        updateUserSympathies(user);
                        updateUserLikes2(user);
                    }
                }

                if (node.classList && node.classList.contains("memberListItem") && window.location.href.includes("contest-users")) {
                    setTimeout(() => {
                        updateContestUserStats();
                        updateContestUserLikes2();
                    }, 10);
                }

                if (node.classList && (node.classList.contains("memberCard") || node.classList.contains("memberCardInner"))) {
                    processMemberCard(node);
                } else if (node.nodeType === 1) {
                    const memberCards = node.querySelectorAll(".memberCard, .memberCardInner");
                    memberCards.forEach(card => {
                        processMemberCard(card);
                    });
                }
            });
        });
    });

    function processMemberCard(card) {
        const usernameElement = card.querySelector(".username.NoOverlay, .username a");
        if (!usernameElement) return;

        const link = usernameElement.getAttribute("href");
        if (!link) return;

        updateMemberCardStats(card, link);
    }

    // Симпы и лайки мини профиль
    function updateMemberCardStats(card, userLink) {
        const stats = {
            likes: {
                totalReactions: 0,
                noReaction: 0,
                last7DaysCount: 0,
                processed: false
            },
            likes2: {
                totalReactions: 0,
                noReaction: 0,
                last7DaysCount: 0,
                processed: false
            }
        };

        const likeCounter = card.querySelector("a.counter[href$='likes'] .count");
        const likes2Counter = card.querySelector("a.counter[href$='likes2'] .count");

        if (likeCounter) {
            stats.likes.totalReactions = Number(likeCounter.textContent.replace(/\s+/g, "")) || 0;
        }

        if (likes2Counter) {
            stats.likes2.totalReactions = Number(likes2Counter.textContent.replace(/\s+/g, "")) || 0;
        }

        fetch(`${getBaseURL()}/${userLink}`).then(response => {
            if (!response.ok) return null;
            return response.text();
        }).then(profileHtml => {
            if (!profileHtml) return;

            fetchLikesData('likes');
            fetchLikesData('likes2');

        }).catch(err => console.error("Error fetching user profile:", err));

        function fetchLikesData(likesType) {
            fetch(`${getBaseURL()}/${userLink}${likesType}?type=gotten&content_type=post&stats=1`).then(resul => {
                return resul.text();
            }).then(htmlText => {
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = htmlText;
                const allReaction = tempDiv.querySelectorAll(".node");

                allReaction.forEach(el => {
                    const mutedElement = el.querySelector(".muted");
                    if (mutedElement && mutedElement.textContent.toLowerCase().includes("розыгрыш")) {
                        const counterElement = el.querySelector(".counter");
                        if (counterElement) {
                            stats[likesType].noReaction += Number(counterElement.textContent.replace(/\s+/g, ""));
                        }
                    }
                });

                fetch(`${getBaseURL()}/${userLink}${likesType}`).then(resp => {
                    return resp.text();
                }).then(likesHtml => {
                    const likesContainer = document.createElement("div");
                    likesContainer.innerHTML = likesHtml;

                    const pageDescription = likesContainer.querySelector("#pageDescription");
                    if (pageDescription) {
                        const statsText = pageDescription.textContent;
                        const match = statsText.match(/Набрано за последние 7 дней - (\d+)/);
                        if (match && match[1]) {
                            stats[likesType].last7DaysCount = parseInt(match[1]);
                        }
                    }

                    stats[likesType].processed = true;

                    updateUIIfReady();

                }).catch(err => console.error(`Error fetching ${likesType} page:`, err));
            }).catch(err => console.error(`Error fetching raffle reactions for ${likesType}:`, err));
        }

        function updateUIIfReady() {
            if (!stats.likes.processed || !stats.likes2.processed) {
                return; // Ждем, пока оба будут готовы
            }

            if (likeCounter) {
                const adjustedCount = stats.likes.totalReactions - stats.likes.noReaction;
                likeCounter.innerHTML = `${formatNumber(stats.likes.totalReactions)} / ${formatNumber(adjustedCount)} / ${formatNumber(stats.likes.last7DaysCount)}`;
            }

            if (likes2Counter) {
                const adjustedCount2 = stats.likes2.totalReactions - stats.likes2.noReaction;
                likes2Counter.innerHTML = `${formatNumber(stats.likes2.totalReactions)} / ${formatNumber(stats.likes2.last7DaysCount)}`;
            }
        }
    }

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    document.querySelectorAll(".userText").forEach(user => {
        updateUserSympathies(user);
        updateUserLikes2(user);
    });

    if (window.location.href.includes("contest-users")) {
        setTimeout(() => {
            updateContestUserStats();
            updateContestUserLikes2();
        }, 200);
    }


    // Профиль симпы
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
                        profileCounter.innerHTML = `<i class="counterIcon likeCounterIcon"></i>${formatNumber(profileSympathies)} / ${formatNumber(adjustedCount)} / ${formatNumber(last7DaysCount)}`;
                    }));
                });
            });
        }
    }

    // Профиль лайки
    function updateProfileLikes2() {
        const profileCounter = document.querySelector('a.page_counter[href$="likes2"] .count');
        if (profileCounter) {
            const profileLikes2 = Number(profileCounter.textContent.replace(/\s+/g, ""));

            const currentPath = window.location.pathname;
            const likes2Path = currentPath + (currentPath.endsWith('/') ? '' : '/') + 'likes2';

            fetch(`${getBaseURL()}${likes2Path}`).then(resp => resp.text().then(likes2Html => {
                const likes2Container = document.createElement("div");
                likes2Container.innerHTML = likes2Html;

                const pageDescription = likes2Container.querySelector("#pageDescription");
                let last7DaysCount = 0;

                if (pageDescription) {
                    const statsText = pageDescription.textContent;
                    const match = statsText.match(/Набрано за последние 7 дней - (\d+)/);
                    if (match && match[1]) {
                        last7DaysCount = parseInt(match[1]);
                    }
                }

                profileCounter.innerHTML = `<i class="counterIcon like2Icon"></i>${formatNumber(profileLikes2)} / ${formatNumber(last7DaysCount)}`;
            }));
        }
    }

    updateProfileSympathies();
    updateProfileLikes2();

})();