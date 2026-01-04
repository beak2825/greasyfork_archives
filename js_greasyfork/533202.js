// ==UserScript==
// @name         BetterX
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  Make mentioned users more obvious! Along with several additional features.
// @author       xccd1
// @license MIT
// @match        https://x.com/*
// @match        https://pbs.twimg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533202/BetterX.user.js
// @updateURL https://update.greasyfork.org/scripts/533202/BetterX.meta.js
// ==/UserScript==


window.collectedTweets = window.collectedTweets || {};
window.collectedUsers = window.collectedUsers || [];
const tweetEventEmitter = new EventTarget();

function addTweet(tweetId, data) {
    window.collectedTweets[tweetId] = data;
    tweetEventEmitter.dispatchEvent(new CustomEvent("tweetAdded", {
        detail: {
            tweetId
        }
    }));
}

function addUser(UserName, data) {
    UserName = UserName.toLowerCase()
    window.collectedUsers[UserName] = data;
    tweetEventEmitter.dispatchEvent(new CustomEvent("userAdded", {
        detail: {
            UserName
        }
    }));
}

function twitterDateToEpoch(twitterDate) {
    if (twitterDate == "0") {
        return 0
    }
    return Math.floor(new Date(twitterDate).getTime() / 1000);
}

function handletweetdata(tweet) {
    if (!tweet) return;
    if (!tweet.legacy && tweet.tweet) {
        tweet = tweet.tweet
    }
    if (!tweet || !tweet.legacy) return;
    const tweetId = tweet.rest_id;
    const username = tweet.core?.user_results?.result?.legacy?.screen_name || '';
    const userId = tweet.core?.user_results?.result?.rest_id || '';
    const tweetText = tweet.legacy.full_text || '';
    const timestamp = twitterDateToEpoch(tweet.legacy.created_at);
    const inReplyToStatusId = tweet.legacy.in_reply_to_status_id_str || null;
    const mentionedUsers = (tweet.legacy.entities?.user_mentions || []).map(user => ({
        username: user.screen_name,
        userId: user.id_str
    }));
    const mediaUrls = (tweet.legacy?.extended_entities?.media || []).map(media => {
        if (media.type === "video" && media.video_info?.variants) {
            const bestVariant = media.video_info.variants
                .filter(variant => variant.bitrate || 0)
                .reduce((max, variant) => variant.bitrate > max.bitrate ? variant : max, {
                    bitrate: 0
                });

            return bestVariant.url;
        } else if (media.type === "animated_gif" && media.video_info?.variants) {
            const bestVariant = media.video_info.variants[0];
            return bestVariant.url;
        } else {
            return media.media_url_https;
        }
    });

    if (!window.collectedTweets[tweetId]) {
        const tweetData = {
            tweetId,
            userId,
            username,
            tweetText,
            timestamp,
            mentionedUsers,
            inReplyToStatusId,
            mediaUrls
        };

        addTweet(tweetId, tweetData);
    }
}

function handleuserjson(userjson) {
    const username = userjson.legacy.screen_name
    const id = userjson.rest_id
    const description = userjson.legacy.description
    const pinnedTweets = userjson.legacy.pinned_tweet_ids_str
    const joinDate = twitterDateToEpoch(userjson.legacy.created_at)
    const followCount = userjson.legacy.followers_count
    const friendCount = userjson.legacy.friends_count
    const favoritesCount = userjson.legacy.favourites_count
    const mediaCount = userjson.legacy.media_count
    const legacyData = userjson.legacy_extended_profile
    const name = userjson.legacy.name
    let userdata = {
        username,
        id,
        description,
        pinnedTweets,
        joinDate,
        followCount,
        friendCount,
        favoritesCount,
        mediaCount,
        legacyData,
        name
    }
    addUser(username, userdata)
}

const handlers = [{
        regex: /https:\/\/x\.com\/i\/api\/graphql\/[^/]+\/TweetDetail/,
        process: function(json) {
            const instructions = json?.data?.threaded_conversation_with_injections_v2?.instructions || [];
            instructions.forEach(instruction => {
                if (!instruction.entries) return;
                instruction.entries.forEach(entry => {
                    if (!entry.entryId) return;
                    if (entry.entryId.startsWith("tweet-")) {
                        const tweet = entry.content.itemContent.tweet_results.result;
                        if (tweet.__typename=="TweetTombstone") return;
                        handletweetdata(tweet);
                        const userjson = tweet.core.user_results.result || null;
                        if (userjson != null) {
                            handleuserjson(userjson);
                        }
                    }
                });
            });
        }
    },
    {
        regex: /https:\/\/x\.com\/i\/api\/graphql\/[^/]+\/HomeTimeline/,
        process: function(json) {
            const instructions = json.data.home.home_timeline_urt.instructions || [];
            instructions.forEach(instruction => {
                if (!instruction.entries) return;
                instruction.entries.forEach(entry => {
                    let itemcontent = entry.content.itemContent
                    if (!itemcontent) {
                        let items = entry.content.items
                        if (!items) return;
                        items.forEach(item => {
                            let itemContent = item.item.itemContent;
                            if (!itemContent || !itemContent.tweet_results) return;
                            let tweet = itemContent.tweet_results.result;
                            handletweetdata(tweet);
                            if (!tweet.core && tweet.tweet) {
                                tweet = tweet.tweet
                                if (tweet.core) {
                                    const userjson = tweet.core.user_results.result || null;
                                    if (userjson != null) {
                                        handleuserjson(userjson);
                                    }
                                } else {
                                    console.log("wtf")
                                    console.log(tweet)
                                }
                            }
                        });
                    } else {
                        let tweet = itemcontent.tweet_results.result;
                        handletweetdata(tweet);
                        if (!tweet.core && tweet.tweet) {
                            tweet = tweet.tweet
                            if (tweet.core) {
                                const userjson = tweet.core.user_results.result || null;
                                if (userjson != null) {
                                    handleuserjson(userjson);
                                }
                            } else {
                                console.log("wtf")
                                console.log(tweet)
                            }
                        }
                    }
                });
            });
        }
    },
    {
        regex: /https:\/\/x\.com\/i\/api\/graphql\/[^/]+\/UserMedia/,
        process: function(json) {
            const instructions = json.data.user.result.timeline.timeline.instructions || [];
            instructions.forEach(instruction => {
                if (instruction.type == "TimelineAddToModule") {
                    instruction.moduleItems.forEach(module => {
                        const tweet = module.item.itemContent.tweet_results.result;
                        handletweetdata(tweet);
                        const userjson = tweet.core.user_results.result || null;
                        if (userjson != null) {
                            handleuserjson(userjson);
                        }
                    });
                }
                if (!instruction.entries) return;
                instruction.entries.forEach(entry => {
                    if (entry.content.items) {
                        entry.content.items.forEach(item => {
                            const tweet = item.item.itemContent.tweet_results.result;
                            handletweetdata(tweet);
                            const userjson = tweet.core.user_results.result || null;
                            if (userjson != null) {
                                handleuserjson(userjson);
                            }
                        });
                    }
                });
            });
        }
    },
    {
        regex: /https:\/\/x\.com\/i\/api\/graphql\/[^/]+\/UserTweets/,
        process: function(json) {
            const instructions = json.data.user.result.timeline.timeline.instructions || [];
            instructions.forEach(instruction => {
                if (!instruction.entries) return;
                instruction.entries.forEach(entry => {
                    let itemcontent = entry.content.itemContent
                    if (!itemcontent) return;
                    let tweet = itemcontent.tweet_results.result;
                    handletweetdata(tweet);
                    if (!tweet.core && tweet.tweet) {
                        tweet = tweet.tweet
                        if (tweet.core) {
                            const userjson = tweet.core.user_results.result || null;
                            if (userjson != null) {
                                handleuserjson(userjson);
                            }
                        } else {
                            console.log("wtf")
                            console.log(tweet)
                        }
                    }
                });
            });
        }
    },
    {
        regex: /https:\/\/x\.com\/i\/api\/graphql\/[^/]+\/UserTweetsAndReplies/,
        process: function(json) {
            const instructions = json.data.user.result.timeline.timeline.instructions || [];
            instructions.forEach(instruction => {
                if (!instruction.entries) return;
                instruction.entries.forEach(entry => {
                    let itemcontent = entry.content.itemContent
                    if (!itemcontent) {
                        let items = entry.content.items
                        if (!items) return;
                        items.forEach(item => {
                            let itemContent = item.item.itemContent;
                            if (!itemContent || !itemContent.tweet_results) return;
                            let tweet = itemContent.tweet_results.result;
                            handletweetdata(tweet);
                            if (!tweet.core && tweet.tweet) {
                                tweet = tweet.tweet
                                if (tweet.core) {
                                    const userjson = tweet.core.user_results.result || null;
                                    if (userjson != null) {
                                        handleuserjson(userjson);
                                    }
                                } else {
                                    console.log("wtf")
                                    console.log(tweet)
                                }
                            }
                        });
                    } else {
                        let tweet = itemcontent.tweet_results.result;
                        handletweetdata(tweet);
                        if (!tweet.core && tweet.tweet) {
                            tweet = tweet.tweet
                            if (tweet.core) {
                                const userjson = tweet.core.user_results.result || null;
                                if (userjson != null) {
                                    handleuserjson(userjson);
                                }
                            } else {
                                console.log("wtf")
                                console.log(tweet)
                            }
                        }
                    }
                });
            });
        }
    },
    {
        regex: /https:\/\/x\.com\/i\/api\/graphql\/[^/]+\/UserByScreenName/,
        process: function(json) {
            const userjson = json.data.user.result || {};
            handleuserjson(userjson);
        }
    }
];

(function() {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(...args) {
        this._requestURL = args[1];
        return originalOpen.apply(this, args);
    };

    XMLHttpRequest.prototype.send = function(...args) {
        this.addEventListener('readystatechange', function() {
            if (this.readyState === 4) {
                if (this.responseType === '' || this.responseType === 'text') {
                    if (this._requestURL.includes("graphql")) {
                        if (this.responseText.includes("in_reply_to_status_id_str")) {
                            console.log(this._requestURL)
                        }
                        let response = JSON.parse(this.responseText);

                        handlers.forEach(handler => {
                            if (handler.regex.test(this._requestURL)) {
                                handler.process(response);
                            }
                        });
                    }
                }
            }
        });

        return originalSend.apply(this, args);
    };
})();

// Tweet buttons Addition

(function() {
    const updateMentionedUsers = () => {
        if (!window.location.href.includes("/status/")) {
            return;
        }
        const tweetId = window.location.pathname.split("/status/")[1].split("/")[0];

        const tweetData = window.collectedTweets[tweetId];
        if (!tweetData) {
            tweetEventEmitter.addEventListener("tweetAdded", function handler(event) {
                if (event.detail.tweetId === tweetId) {
                    tweetEventEmitter.removeEventListener("tweetAdded", handler);
                    updateMentionedUsers();
                }
            });

            return;
        }

        const findTweetElements = () => {
            let timestampLink = document.querySelector(`a[href$="/status/${tweetId}"]`);
            const modalHeader = document.querySelector(`[aria-labelledby="modal-header"]`);
            if (modalHeader) {
                timestampLink = modalHeader.querySelector(`a[href$="/status/${tweetId}"]`);
            }
            return timestampLink;
        };

        let timestampLink = findTweetElements();
        if (!timestampLink) {

            const observer = new MutationObserver(() => {
                timestampLink = findTweetElements();
                if (timestampLink) {
                    observer.disconnect();
                    updateMentionedUsers();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            return;
        }

        const tweetElement = timestampLink.closest('[data-testid="tweet"]');
        if (!tweetElement) {
            return;
        }

        const tweetDetailsDiv = timestampLink.parentElement?.parentElement;
        if (!tweetDetailsDiv) {
            return;
        }

        const mediaUrls = tweetData.mediaUrls || [];
        const linebreak = document.createElement('div');
        linebreak.style.width = "100%";

        let downloadButton = tweetDetailsDiv.querySelector('.download-button');


        if (!downloadButton) {
            downloadButton = document.createElement('div');
            downloadButton.classList.add('download-button');
            downloadButton.style.cursor = 'pointer';
            downloadButton.style.fontFamily = 'TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
            downloadButton.style.color = 'rgb(255,255,255)';
            downloadButton.style.backgroundColor = 'rgb(29, 155, 240)';
            downloadButton.style.fontSize = '14px';
            downloadButton.style.display = 'inline-block';
            downloadButton.style.marginTop = '4px';
            downloadButton.style.padding = '4px 8px';
            downloadButton.style.borderRadius = '4px';
            downloadButton.textContent = "Download";
            tweetDetailsDiv.appendChild(linebreak.cloneNode());
            tweetDetailsDiv.appendChild(downloadButton);

            downloadButton.addEventListener('click', () => {
                if (mediaUrls.length === 0) {
                    return;
                }
                mediaUrls.forEach(async (url) => {
                    if (url.includes('.jpg')) {
                        const pngUrl = url.replace('.jpg', '.png:orig');
                        const jpgUrl = url.replace('.jpg', '?format=jpg&name=orig');
                        try {
                            const response = await fetch(pngUrl, {
                                method: 'HEAD'
                            });
                            if (response.ok) {
                                window.open(pngUrl, '_blank');
                            } else {
                                window.open(jpgUrl, '_blank');
                            }
                        } catch (error) {
                            window.open(jpgUrl, '_blank');
                        }
                    } else {
                        window.open(url, '_blank');
                    }
                });
            });
        }

        const mentionedUsers = tweetData.mentionedUsers || [];
        let mentionDropdown = tweetDetailsDiv.querySelector('.mention-dropdown');
        let thepopup = document.querySelector('.mention-popup');

        if (!mentionDropdown) {
            if (thepopup) {
                thepopup.remove();
            }
            mentionDropdown = document.createElement('div');
            mentionDropdown.classList.add('mention-dropdown');
            mentionDropdown.textContent = 'Mentions';
            mentionDropdown.style.cursor = 'pointer';
            mentionDropdown.style.fontFamily = 'TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
            mentionDropdown.style.color = 'rgb(255,255,255)';
            mentionDropdown.style.backgroundColor = 'rgb(29, 155, 240)';
            mentionDropdown.style.fontSize = '14px';
            mentionDropdown.style.display = 'inline-block';
            mentionDropdown.style.marginTop = '4px';
            mentionDropdown.style.marginLeft = '10px';
            mentionDropdown.style.padding = '4px 8px';
            mentionDropdown.style.borderRadius = '4px';
            tweetDetailsDiv.appendChild(mentionDropdown);

            function makepopup() {
                if (thepopup) {
                    thepopup.remove();
                }
                const popup = document.createElement('div');
                popup.classList.add('mention-popup');
                popup.style.display = 'block';
                popup.style.position = 'fixed';
                popup.style.top = '50%';
                popup.style.left = '50%';
                popup.style.transform = 'translate(-50%, -50%)';
                popup.style.background = 'black';
                popup.style.border = '2px solid white';
                popup.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
                popup.style.borderRadius = '8px';
                popup.style.padding = '20px';
                popup.style.zIndex = '9999';
                popup.style.fontFamily = 'inherit';
                popup.style.minWidth = '200px';
                document.body.appendChild(popup);

                const closeButton = document.createElement('button');
                closeButton.textContent = 'Close';
                closeButton.style.marginTop = '10px';
                closeButton.style.cursor = 'pointer';
                closeButton.style.padding = '5px 10px';
                closeButton.style.border = 'none';
                closeButton.style.background = 'rgb(29, 155, 240)';
                closeButton.style.color = 'white';
                closeButton.style.borderRadius = '4px';
                closeButton.style.display = 'block';

                closeButton.addEventListener('click', () => {
                    document.body.removeChild(popup);
                });

                popup.appendChild(closeButton);

                thepopup = popup

                mentionedUsers.forEach(user => {
                    if (!thepopup.querySelector(`a[href="https://x.com/i/user/${user.userId}"]`)) {
                        const userElement = document.createElement('div');
                        userElement.style.padding = '5px';
                        userElement.style.cursor = 'pointer';

                        const userLink = document.createElement('a');
                        userLink.href = `https://x.com/i/user/${user.userId}`;
                        userLink.textContent = `@${user.username}`;
                        userLink.style.textDecoration = 'none';
                        userLink.style.color = "rgb(29, 155, 240)";


                        userElement.appendChild(userLink);
                        thepopup.insertBefore(userElement, thepopup.firstChild);
                    }
                });
            }

            mentionDropdown.addEventListener('click', () => {
                makepopup();
            });
        }



        let jsonButton = tweetDetailsDiv.querySelector('.json-button');

        if (!jsonButton) {
            jsonButton = document.createElement('div');
            jsonButton.classList.add('json-button');
            jsonButton.style.cursor = 'pointer';
            jsonButton.style.fontFamily = 'TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
            jsonButton.style.color = 'rgb(255,255,255)';
            jsonButton.style.backgroundColor = 'rgb(29, 155, 240)';
            jsonButton.style.fontSize = '14px';
            jsonButton.style.display = 'inline-block';
            jsonButton.style.marginTop = '4px';
            jsonButton.style.padding = '4px 8px';
            jsonButton.style.borderRadius = '4px';
            jsonButton.textContent = 'View JSON';
            tweetDetailsDiv.appendChild(linebreak.cloneNode());
            tweetDetailsDiv.appendChild(jsonButton);

            jsonButton.addEventListener('click', () => {
                const {
                    Element,
                    ...dataWithoutElement
                } = tweetData;
                const beautifiedJSON = JSON.stringify(dataWithoutElement, null, "\t");

                const jsonPopup = document.createElement('div');
                jsonPopup.style.position = 'fixed';
                jsonPopup.style.top = '50%';
                jsonPopup.style.left = '50%';
                jsonPopup.style.transform = 'translate(-50%, -50%)';
                jsonPopup.style.background = 'black';
                jsonPopup.style.border = '2px solid white';
                jsonPopup.style.borderRadius = '8px';
                jsonPopup.style.padding = '20px';
                jsonPopup.style.zIndex = '9999';
                jsonPopup.style.color = 'white';
                jsonPopup.style.fontFamily = 'monospace';
                jsonPopup.style.maxHeight = '80%';
                jsonPopup.style.overflowY = 'auto';

                jsonPopup.textContent = beautifiedJSON;

                const closeButton = document.createElement('button');
                closeButton.textContent = 'Close';
                closeButton.style.marginTop = '10px';
                closeButton.style.cursor = 'pointer';
                closeButton.style.padding = '5px 10px';
                closeButton.style.border = 'none';
                closeButton.style.background = 'rgb(29, 155, 240)';
                closeButton.style.color = 'white';
                closeButton.style.borderRadius = '4px';
                closeButton.style.display = 'block';

                closeButton.addEventListener('click', () => {
                    document.body.removeChild(jsonPopup);
                });

                jsonPopup.appendChild(closeButton);
                document.body.appendChild(jsonPopup);
            });
        }

        let archiveButton = tweetDetailsDiv.querySelector('.archive-button');

        if (!archiveButton) {
            archiveButton = document.createElement('div');
            archiveButton.classList.add('archive-button');
            archiveButton.style.cursor = 'pointer';
            archiveButton.style.fontFamily = 'TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
            archiveButton.style.color = 'rgb(255,255,255)';
            archiveButton.style.backgroundColor = '#7f7f7f';
            archiveButton.style.fontSize = '14px';
            archiveButton.style.display = 'inline-block';
            archiveButton.style.marginTop = '4px';
            archiveButton.style.marginLeft = '10px';
            archiveButton.style.padding = '4px 8px';
            archiveButton.style.borderRadius = '4px';
            archiveButton.textContent = 'View on Archive.org';
            tweetDetailsDiv.appendChild(archiveButton);

            archiveButton.addEventListener('click', () => {
                const urlParts = window.location.href.split('/');
                const baseTweetURL = urlParts.slice(0, 6).join('/');
                const archiveURL = `https://web.archive.org/web/*/${baseTweetURL}*`;
                window.open(archiveURL, '_blank');
            });
        }

    };

    let tweetUserId = null;
    const config = {
        childList: true,
        subtree: true
    };

    const observer = new MutationObserver(() => {
        const currentTweetId = window.location.pathname.split('/').pop();
        if (tweetUserId !== currentTweetId) {
            tweetUserId = currentTweetId;
            updateMentionedUsers();
        }
    });

    observer.observe(document.body, config);
    updateMentionedUsers();
})();

// Twitter profile Permalinker

(function() {
    function formatEpoch(epoch) {
        const date = new Date(epoch * 1000);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const period = hours >= 12 ? "PM" : "AM";

        const formattedHours = hours % 12 || 12;

        const suffix = (day % 10 === 1 && day !== 11) ? "st" :
            (day % 10 === 2 && day !== 12) ? "nd" :
            (day % 10 === 3 && day !== 13) ? "rd" : "th";

        return `${year} ${month} ${day}${suffix} ${formattedHours}:${minutes}:${seconds} ${period}`;
    }
    let lastusername = ""
    const updateProfileLinks = () => {
        const username = window.location.href.split('/')[3].toLowerCase();
        let getverified = document.querySelector(`[data-testid="editProfileButton"]`);
        const hometimeline = document.querySelector(`[aria-label="Home timeline"]`)
        if (!hometimeline) {
            setTimeout(updateProfileLinks, 1000);
            return;
        }

        const userData = window.collectedUsers[username];
        if (!userData) {
            tweetEventEmitter.addEventListener("userAdded", function handler(event) {
                if (event.detail.UserName === username) {
                    tweetEventEmitter.removeEventListener("userAdded", handler);
                    updateProfileLinks();
                }
            });

            return;
        }

        const userId = userData.id
        const JoindateDiv = hometimeline.querySelector('[data-testid="UserJoinDate"]');
        if (!JoindateDiv) {
            setTimeout(updateProfileLinks, 1000);
            if (getverified) {
                const UserNameDiv = document.querySelector('[data-testid="UserName"]');
                const usernameElement = UserNameDiv.querySelector('[tabindex="-1"]');
                const JoindateSpan = JoindateDiv.querySelector("span");

                if (!usernameElement) {
                    console.warn("Couldn't find the @username span on the profile page.");
                    return;
                }

                const usernameLink = document.createElement('span');
                usernameLink.textContent = `@${username}`;

                JoindateSpan.textContent = formatEpoch(userData.joinDate)

                for (const attr of usernameElement.attributes) {
                    usernameLink.setAttribute(attr.name, attr.value);
                }

                usernameElement.parentNode.replaceChild(usernameLink, usernameElement);
            }
            return;
        }

        const UserNameDiv = document.querySelector('[data-testid="UserName"]');
        const usernameElement = UserNameDiv.querySelector('[tabindex="-1"]');
        const JoindateSpan = JoindateDiv.querySelector("span");

        if (!usernameElement) {
            console.warn("Couldn't find the @username span on the profile page.");
            return;
        }

        const usernameLink = document.createElement('a');
        usernameLink.href = `https://x.com/i/user/${userId}`;
        usernameLink.textContent = `@${username}`;

        JoindateSpan.textContent = formatEpoch(userData.joinDate)

        for (const attr of usernameElement.attributes) {
            usernameLink.setAttribute(attr.name, attr.value);
        }

        usernameElement.parentNode.replaceChild(usernameLink, usernameElement);
    };

    const config = {
        childList: true,
        subtree: true
    };
    let currentPath = window.location.pathname;

    const observer = new MutationObserver(() => {
        if (currentPath !== window.location.pathname) {
            currentPath = window.location.pathname;
            updateProfileLinks();
        }
    });

    observer.observe(document.body, config);

    updateProfileLinks();
})();