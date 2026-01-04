// ==UserScript==
// @name         Linux Do 个人活动信息查询
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  获取你Linux do 行为信息
// @author       Unique、King-Huiwen-of-Qin
// @match        https://linux.do/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499103/Linux%20Do%20%E4%B8%AA%E4%BA%BA%E6%B4%BB%E5%8A%A8%E4%BF%A1%E6%81%AF%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/499103/Linux%20Do%20%E4%B8%AA%E4%BA%BA%E6%B4%BB%E5%8A%A8%E4%BF%A1%E6%81%AF%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let username = '';
    let hideTimeout;
    let isQuerying = false;

    // Constants for local storage keys
    const STORAGE_KEY_COUNTS = 'timings_counts';
    const STORAGE_KEY_DATE = 'timings_date';
    const STORAGE_KEY_TOPIC = 'topic_count';

    // Utility function to check if a timestamp is from today
    function isToday(timestamp) {
        const now = new Date();
        const date = new Date(timestamp);
        return date.toDateString() === now.toDateString();
    }

    // Utility function to check if a timestamp is older than today
    function isOlderThanToday(timestamp) {
        const now = new Date();
        const date = new Date(timestamp);
        return date < new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    // Utility function to delay execution
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Function to fetch user actions with pagination and count today's actions
    async function countTodaysActions(username, filter, uniqueTopicIds = false) {
        let offset = 0;
        let actionCount = 0;
        let uniqueTopicCount = 0;
        let hasMoreData = true;
        let queryData = true;
        const topicIds = new Set();
        let firstAction = '';

        while (hasMoreData) {
            const url = `https://linux.do/user_actions.json?offset=${offset}&limit=500&username=${username}&filter=${filter}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                const userActions = data.user_actions;

                // Check if there's no more data
                if (userActions.length === 0) {
                    hasMoreData = false;
                    break;
                }
                firstAction = userActions[0];
                // Filter today's actions and update the count
                const todaysActions = userActions.filter(action => isToday(action.created_at));
                actionCount += todaysActions.length;

                if (uniqueTopicIds) {
                    todaysActions.forEach(action => {
                        if (!topicIds.has(action.topic_id)) {
                            topicIds.add(action.topic_id);
                            uniqueTopicCount++;
                        }
                    });
                }

                // Check if the earliest action is older than today to stop further requests
                const oldestAction = userActions[userActions.length - 1];
                if (isOlderThanToday(oldestAction.created_at)) {
                    hasMoreData = false;
                    break;
                }

                // Increment the offset for the next batch
                offset += 500;

                // Delay before the next request
                await delay(600);
            } catch (error) {
                console.error(`Error fetching user actions with filter ${filter}:`, error);
                hasMoreData = false;
                queryData =false;
                break;
            }
        }
        return {actionCount, uniqueTopicCount,firstAction,queryData};
    }

    // Function to fetch reactions received with pagination and count today's reactions
    async function countTodaysReactionsReceived(username) {
        let beforeReactionUserId = null;
        let reactionCount = 0;
        let hasMoreData = true;

        while (hasMoreData) {
            let url = `https://linux.do/discourse-reactions/posts/reactions-received.json?username=${username}`;
            if (beforeReactionUserId) {
                url += `&before_reaction_user_id=${beforeReactionUserId}`;
            }
            try {
                const response = await fetch(url);
                const data = await response.json();
                const reactionsReceived = data;

                // Check if there's no more data
                if (reactionsReceived.length === 0) {
                    hasMoreData = false;
                    break;
                }

                // Filter today's reactions and update the count
                const todaysReactions = reactionsReceived.filter(reaction => isToday(reaction.created_at));
                reactionCount += todaysReactions.length;

                // Check if the earliest reaction is older than today to stop further requests
                const oldestReaction = reactionsReceived[reactionsReceived.length - 1];
                if (isOlderThanToday(oldestReaction.created_at)) {
                    hasMoreData = false;
                    break;
                }

                // Update beforeReactionUserId for the next batch
                beforeReactionUserId = oldestReaction.user_id;

                // Delay before the next request
                await delay(400);
            } catch (error) {
                console.error('Error fetching reactions received:', error);
                hasMoreData = false;
                break;
            }
        }

        return reactionCount;
    }


    async function getTotalUsers() {
        const response = await fetch('https://linux.do/about.json');
        const data = await response.json();
        return data.about.stats.users_count;
    }

    async function getUsersPerPage() {
        const response = await fetch('https://linux.do/leaderboard/1.json?page=0&period=all');
        const data = await response.json();
        return data.users.length;
    }

    async function getPageData(page) {
        const response = await fetch(`https://linux.do/leaderboard/1.json?page=${page}&period=all`);
        return await response.json();
    }

    async function findUserPosition(targetName, gamificationScore) {
        const totalUsers = await getTotalUsers();
        const usersPerPage = await getUsersPerPage();
        const totalPages = Math.ceil(totalUsers / usersPerPage);
        let left = 0;
        let right = totalPages - 1;
        let position = "未查询到";

         // Helper function to normalize the first character case
    const normalizeFirstChar = (name) => {
        return name.charAt(0).toLowerCase() + name.slice(1);
    };

    const normalizedTargetName = normalizeFirstChar(targetName);

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const data = await getPageData(mid);

            if (data.users.length === 0) {
                console.log('User not found.');
                break;
            }

            const firstUserTotalScore = data.users[0].total_score;
            const lastUserTotalScore = data.users[data.users.length - 1].total_score;

            if (gamificationScore > firstUserTotalScore) {
                right = mid - 1;
            } else if (gamificationScore < lastUserTotalScore) {
                left = mid + 1;
            } else {
                // Linear search on the current page
                for (let i = 0; i < data.users.length; i++) {
                    if (normalizeFirstChar(data.users[i].username) === normalizedTargetName) {
                        position = data.users[i].position;
                        console.log(`User: ${data.users[i].username}, Position: ${position}`);
                        return position;
                    }
                }

                // Continue searching previous pages for the same score
                let tempPage = mid - 1;
                while (tempPage >= 0) {
                    const tempData = await getPageData(tempPage);
                    for (let i = tempData.users.length - 1; i >= 0; i--) {
                        if (tempData.users[i].total_score !== gamificationScore) {
                            tempPage = -1;
                            break;
                        }
                        if (tempData.users[i].username === targetName) {
                            position = tempData.users[i].position;
                            console.log(`User: ${tempData.users[i].username}, Position: ${position}`);
                            return position;
                        }
                    }
                    tempPage--;
                }

                // Continue searching next pages for the same score
                tempPage = mid + 1;
                while (tempPage < totalPages) {
                    const tempData = await getPageData(tempPage);
                    for (let i = 0; i < tempData.users.length; i++) {
                        if (tempData.users[i].total_score !== gamificationScore) {
                            tempPage = totalPages;
                            break;
                        }
                        if (tempData.users[i].username === targetName) {
                            position = tempData.users[i].position;
                            console.log(`User: ${tempData.users[i].username}, Position: ${position}`);
                            return position;
                        }
                    }
                    tempPage++;
                }
                break;
            }

            // Add delay of 0.1 seconds to prevent too many requests in a short time
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return position;
    }



    // Function to fetch reactions given with pagination and count today's reactions given
    async function countTodaysReactionsGiven(username) {
        let beforeReactionUserId = null;
        let reactionCount = 0;
        let hasMoreData = true;

        while (hasMoreData) {
            let url = `https://linux.do/discourse-reactions/posts/reactions.json?username=${username}`;
            if (beforeReactionUserId) {
                url += `&before_reaction_user_id=${beforeReactionUserId}`;
            }
            try {
                const response = await fetch(url);
                const data = await response.json();
                const reactionsGiven = data;

                // Check if there's no more data
                if (reactionsGiven.length === 0) {
                    hasMoreData = false;
                    break;
                }

                // Filter today's reactions and update the count
                const todaysReactions = reactionsGiven.filter(reaction => isToday(reaction.created_at));
                reactionCount += todaysReactions.length;

                // Check if the earliest reaction is older than today to stop further requests
                const oldestReaction = reactionsGiven[reactionsGiven.length - 1];
                if (isOlderThanToday(oldestReaction.created_at)) {
                    hasMoreData = false;
                    break;
                }

                // Update beforeReactionUserId for the next batch
                beforeReactionUserId = oldestReaction.user_id;

                // Delay before the next request
                await delay(400);
            } catch (error) {
                console.error('Error fetching reactions given:', error);
                hasMoreData = false;
                break;
            }
        }

        return reactionCount;
    }

    async function checkUserOnline(username) {
        try {
            const csrfToken = getCsrfToken();
            const url = `https://linux.do/u/${username}/card.json`;
            // 构建请求头
            const headers = new Headers();
            // 添加需要的请求头，例如认证信息等
            headers.append('Accept', 'application/json, text/javascript, */*; q=0.01');
            headers.append('Discourse-Logged-In', 'true');
            headers.append('Discourse-Present', 'true');
            headers.append('Referer', 'https://linux.do');
            headers.append('Sec-Ch-Ua', '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"');
            headers.append('Sec-Ch-Ua-Mobile', '?0');
            headers.append('Sec-Ch-Ua-Platform', '"Windows"');
            headers.append('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');
            headers.append('X-Csrf-Token', csrfToken);
            headers.append('X-Requested-With', 'XMLHttpRequest');

            // 发送请求
            const response = await fetch(url, {
                method: 'GET',
                headers: headers,
            });

            const userData = await response.json();
            const lastSeenTime = new Date(userData.user.last_seen_at);
            const currentTime = new Date();
            const timeDifference = currentTime - lastSeenTime;
            const minutesDifference = timeDifference / (1000 * 60);

            // 用户在线状态
            const isOnline = minutesDifference <= 5;

            // 用户点数
            const gamificationScore = userData.user.gamification_score;

            return {
                isOnline,
                gamificationScore
            };
        } catch (error) {
            console.error("Error checking user online status:", error);
            return {
                isOnline: false,
                gamificationScore: null
            };
        }
    }


    // Function to get the CSRF token
    function getCsrfToken() {
        const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');
        return csrfTokenMeta ? csrfTokenMeta.content : '';
    }

    // Function to fetch the username
    const getUsername = async () => {
        if (username === '') {
            // Construct headers with CSRF token
            const headers = new Headers();
            headers.append('X-Csrf-Token', getCsrfToken());
            // Make the request with CSRF token
            const response = await fetch('https://linux.do/my/summary.json', {
                method: 'GET',
                headers: headers
            });
            const newURL = response.url;
            const urlObj = new URL(newURL);
            const pathParts = urlObj.pathname.split('/');
            username = pathParts[2];
        }
    };

    // Function to count today's likes given, replies made (in distinct topics), likes received, reactions received, and reactions given and display the result
    async function countAllTodaysActions(queryUsername) {
        isQuerying = true; // Set querying flag
        button.innerText = '.......';
        button.disabled = true; // Disable the button


        const user = queryUsername || username;
        const likesGiven = await countTodaysActions(user, 1); // Assuming filter 1 is for likes given
        await delay(300);
        const repliesMadeData = await countTodaysActions(user, 5, true); // Assuming filter 5 is for replies made, unique topics
        await delay(300);
        let message;
        if(!likesGiven.queryData) {
           message = `👻这个佬友什么也没有留下~`
        }else {
          message = `
        ❤️ 送出爱心: ${likesGiven.actionCount}<br>
        💬 回复帖子: ${repliesMadeData.actionCount}<br>
        🗂️ 回复话题: ${repliesMadeData.uniqueTopicCount}
        `;
            if (queryUsername) {
                const { isOnline, gamificationScore } = await checkUserOnline(queryUsername);
                await delay(100);
                const position = await findUserPosition(queryUsername, gamificationScore);

                message += `
            <br>📟 佬友状态: ${isOnline ? '在线🙉' : '离线🙈'}
            <br>🏅 冲浪排名: ${position}
            <br>🏄 最后冲浪: <a href="https://linux.do/t/topic/${repliesMadeData.firstAction.topic_id}/${repliesMadeData.firstAction.post_number}">${repliesMadeData.firstAction.title}</a>
            `
                ;
            }
            if (!queryUsername) {
                const likesReceived = await countTodaysActions(user, 2); // Assuming filter 2 is for likes received
                await delay(300);
                const reactionsReceived = await countTodaysReactionsReceived(user); // For reactions received
                await delay(300);
                const reactionsGiven = await countTodaysReactionsGiven(user); // For reactions given

                // Load the stored data
                const timingsCount = parseInt(localStorage.getItem(STORAGE_KEY_COUNTS), 10) || 0;
                const timingsTotalTime = parseInt(localStorage.getItem('timeSpent'), 10) || 0;
                let storedTopics = (() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY_TOPIC)) || []; } catch(e) { return []; }})();


                // 将总时间转换为小时、分钟和秒
                const hours = Math.floor(timingsTotalTime / 3600);
                const minutes = Math.floor((timingsTotalTime % 3600) / 60);
                const seconds = timingsTotalTime % 3600 % 60;

                message += `
            <br>🥰 收到爱心: ${likesReceived.actionCount}<br>
            🤩 收到回应: ${reactionsReceived}<br>
            👏 给出回应: ${reactionsGiven}<br>
            📖 阅读话题: ${storedTopics.length}<br>
            ⏱️ 阅读帖子: ${timingsCount}<br>
            🕒 停留时间: ${hours}时${minutes}分${seconds}秒
            `;
            }

        }
        resultContainer.innerHTML = message; // Set the message
        resultContainer.style.display = 'block'; // Ensure the result container is visible
        isQuerying = false; // Reset querying flag
        button.innerText = '';
        button.disabled = false; // Re-enable the button
        createBeforeElement(button);

    }

    // Add input field for querying other users and result container
    const inputContainer = document.createElement('div');
    inputContainer.style.position = 'fixed';
    inputContainer.style.bottom = '-300px';
    inputContainer.style.left = '10px';
    inputContainer.style.transition = 'bottom 0.3s ease-in-out';
    inputContainer.style.backgroundColor = '#e8e8e8';
    inputContainer.style.padding = '15px';
    inputContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    inputContainer.style.borderRadius = '10px';
    inputContainer.style.fontFamily = 'Arial, sans-serif';
    inputContainer.style.fontSize = '14px';
    inputContainer.style.color = '#333';



    // 创建输入框
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '输入用户名';
    input.style.width = '160px';
    input.style.height = '40px';
    input.style.lineHeight = '28px';
    input.style.padding = '0 1rem';
    input.style.paddingLeft = '10px';
    input.style.marginRight = '10px';
    input.style.border = '2px solid transparent';
    input.style.borderRadius = '8px';
    input.style.outline = 'none';
    input.style.backgroundColor = '#f3f3f4';
    input.style.color = '#0d0c22';
    input.style.transition = '.3s ease';

    // 设置 placeholder 的样式
    const style = document.createElement('style');
    style.innerHTML = `
  .input::placeholder {
    color: #9e9ea7;
  }
  .input:focus, .input:hover {
    outline: none;
    border-color: rgba(93,24,220,0.4) !important;
    background-color: #fff;
    box-shadow: 0 0 0 4px rgb(93 24 220 / 10%) !important;
  }
`;
    document.head.appendChild(style);

    // 为输入框添加类以应用样式
    input.classList.add('input');
    inputContainer.appendChild(input);
    //document.body.appendChild(inputContainer);


    // Create and add pseudo-element effect method
    function createBeforeElement(button) {
        const buttonContent = document.createElement('span');
        buttonContent.innerText = '查询';
        buttonContent.style.position = 'relative';
        buttonContent.style.zIndex = '1';
        button.appendChild(buttonContent);
        const beforeElement = document.createElement('span');
        beforeElement.setAttribute('id', 'myBeforeElement');
        beforeElement.style.position = 'absolute';
        beforeElement.style.top = '0';
        beforeElement.style.left = '0';
        beforeElement.style.transform = 'scaleX(0)';
        beforeElement.style.transformOrigin = '0 50%';
        beforeElement.style.width = '100%';
        beforeElement.style.height = '100%';
        beforeElement.style.borderRadius = 'inherit';
        beforeElement.style.background = 'linear-gradient(82.3deg, rgba(150, 93, 233, 1) 10.8%, rgba(99, 88, 238, 1) 94.3%)';
        beforeElement.style.transition = 'all 0.475s';
        beforeElement.style.zIndex = '0';
        button.style.position = 'relative'; // 确保按钮具有相对定位
        button.insertBefore(beforeElement, button.firstChild);

        return beforeElement;
    }

    // Create button and add styles
    const button = document.createElement('button');
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.style.height = '38px';
    button.style.padding = '0 2rem';
    button.style.borderRadius = '0.5rem';
    button.style.background = '#3d3a4e';
    button.style.backgroundSize = '400%';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1';


    // Create the pseudo-element once and store it
    const beforeElement = createBeforeElement(button);

    // Function to handle hover effect
    function handleHoverEffect(isHovered) {
        const beforeElement = document.getElementById('myBeforeElement'); // 通过 ID 获取 beforeElement
        if (beforeElement) {
            beforeElement.style.transform = isHovered ? 'scaleX(1)' : 'scaleX(0)';
        }
    }

    // Add hover effect
    button.addEventListener('mouseover', () => handleHoverEffect(true));
    button.addEventListener('mouseout', () => handleHoverEffect(false));

    // Button click event
    button.onclick = async () => {
        const queryUsername = input.value.trim();
        await countAllTodaysActions(queryUsername);
        hideContainer(); // Hide the container
    };

    inputContainer.appendChild(button);

    const resultContainer = document.createElement('div');
    resultContainer.style.marginTop = '20px';
    resultContainer.style.padding = '20px';
    resultContainer.style.width = '217px';
    //resultContainer.style.border = '1px solid #ccc';
    resultContainer.style.borderRadius = '15px';
    resultContainer.style.backgroundColor = '#efefef';
    resultContainer.style.boxShadow = '8px 8px 5px #bebebe, -8px -8px 5px #ffffff';
    resultContainer.style.display = 'none';
    inputContainer.appendChild(resultContainer);

    const closeButton = document.createElement('button');
    closeButton.innerText = '清除';
    closeButton.style.display = 'block';
    closeButton.style.width = '257px'
    closeButton.style.marginTop = '20px';
    closeButton.style.padding = '10px 40px';
    closeButton.style.borderRadius = '6px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.border = '0';
    closeButton.style.backgroundColor = '#ffffff';
    closeButton.style.boxShadow = 'rgb(0 0 0 / 5%) 0 0 8px';
    closeButton.style.letterSpacing = '1.5px';
    closeButton.style.textTransform = 'uppercase';
    closeButton.style.fontSize = '15px';
    closeButton.style.transition = 'all 0.5s ease';
    closeButton.style.color = '#000'; // 添加字体颜色以便在背景色为白色时可见

    // 添加hover效果
    closeButton.onmouseover = () => {
        closeButton.style.letterSpacing = '3px';
        closeButton.style.backgroundColor = 'hsl(261deg 80% 48%)';
        closeButton.style.color = 'hsl(0, 0%, 100%)';
        closeButton.style.boxShadow = 'rgb(93 24 220) 0px 7px 29px 0px';
    };

    // 恢复到默认效果
    closeButton.onmouseout = () => {
        closeButton.style.letterSpacing = '1.5px';
        closeButton.style.backgroundColor = 'white';
        closeButton.style.color = '#000';
        closeButton.style.boxShadow = 'rgb(0 0 0 / 5%) 0 0 8px';
    };

    // 添加active效果
    closeButton.onmousedown = () => {
        closeButton.style.transform = 'translateY(10px)';
        closeButton.style.transition = '100ms';
        closeButton.style.boxShadow = 'rgb(93 24 220) 0px 0px 0px 0px';
    };

    closeButton.onmouseup = () => {
        closeButton.style.transform = 'translateY(0)';
        closeButton.style.transition = 'all 0.5s ease';
    };

    closeButton.onclick = () => {
        resultContainer.style.display = 'none';
        input.value = ''; // Clear the input field
        hideContainer(); // Hide the container
    };

    inputContainer.appendChild(closeButton);


    document.body.appendChild(inputContainer);

    // Function to show the container
    const showContainer = () => {
        clearTimeout(hideTimeout);
        inputContainer.style.bottom = '10px';
    };

    // Function to hide the container
    const hideContainer = () => {
        if (!isQuerying && !inputContainer.matches(':hover')) {
            hideTimeout = setTimeout(() => {
                inputContainer.style.bottom = '-500px';
            }, 2000);
        }
    };

    // Event listener for mouse movement
    document.addEventListener('mousemove', (e) => {
        if (e.clientY > window.innerHeight - 50 && e.clientX < 50) {
            showContainer();
            hideTimeout = setTimeout(() => {
                hideContainer();
            }, 2000); // 2秒后隐藏容器
        }
    });

    // Event listener for mouse over and out
    inputContainer.addEventListener('mouseover', () => {
        clearTimeout(hideTimeout);
    });

    inputContainer.addEventListener('mouseout', () => {
        hideTimeout = setTimeout(() => {
            hideContainer();
        }, 2000);
    });

    // Fetch the username on script load
    getUsername();

    // Check if the stored date is today
    async function resetLocalStorageIfNeeded() {
        const storedDate = localStorage.getItem(STORAGE_KEY_DATE);
        const now = new Date();

        if (!storedDate || isOlderThanToday(new Date(storedDate))) {
            // Reset the counts and times if the stored date is not today
            localStorage.setItem(STORAGE_KEY_COUNTS, '0');
            localStorage.setItem(STORAGE_KEY_TOPIC, JSON.stringify([])); // Ensure to stringify arrays
            localStorage.setItem(STORAGE_KEY_DATE, now.toISOString());
            localStorage.setItem('timeSpent', '0'); // Assuming timeSpent is a number, convert to string
            return true; // Return true if reset was performed
        }else{
            return false;
        }
    }

    // Function to handle and monitor timings request
    function handleTimingsRequest(count, topicId) {
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

        // Load the stored data
        let storedCounts = parseInt(localStorage.getItem(STORAGE_KEY_COUNTS), 10) || 0;
        const storedDate = localStorage.getItem(STORAGE_KEY_DATE) || '';
        let storedTopics = (() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY_TOPIC)) || []; } catch(e) { return []; }})();

        // Check if the stored date is today
        if (storedDate !== todayStr) {
            // If not, reset the stored data
            storedCounts = 0;
            storedTopics = [];
        }

        if (!storedTopics.includes(topicId)) {
            storedTopics.push(topicId);
        }
        // Update the stored data with the new values
        storedCounts += count;

        // Store the updated data
        localStorage.setItem(STORAGE_KEY_COUNTS, storedCounts);
        localStorage.setItem(STORAGE_KEY_DATE, todayStr);
        localStorage.setItem(STORAGE_KEY_TOPIC, JSON.stringify(storedTopics));
        // Display the stored data
        console.log(`Today's timings count: ${storedCounts}`);
    }


    (function() {
        // Save the original XMLHttpRequest open and send methods
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;

        // Overwrite the open method
        XMLHttpRequest.prototype.open = function(...args) {
            const url = args[1];
            this._url = url;
            if (url === '/topics/timings') {
                // Record start time for the request
                const xhr = this;
                const startTime = performance.now();

                // Listen for request completion
                xhr.addEventListener('readystatechange', function() {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        const endTime = performance.now();
                        const duration = endTime - startTime;
                    }
                });
            }

            // Call the original open method
            return originalXHROpen.apply(this, args);
        };

        // Overwrite the send method
        XMLHttpRequest.prototype.send = function(body) {
            // Process the request body if it's the correct URL
            if (this._url === '/topics/timings') {
                processRequestBody(body);
            }

            // Call the original send method
            return originalXHRSend.call(this, body);
        };

        // Process request body to extract timing data
        function processRequestBody(body) {
            if (typeof body === 'string') {
                try {
                    const params = new URLSearchParams(body);
                    let timings = 0;
                    let topicTime = 0;
                    let topicId = 0;
                    let topicCount = 0;

                    for (const [key, value] of params.entries()) {
                        if (key.startsWith('timings[')) {
                            timings += parseInt(value);
                            topicCount+=1;
                        }
                        if (key.startsWith('topic_time')) {
                            topicTime = parseInt(value);
                        }
                        if (key.startsWith('topic_id')) {
                            topicId = parseInt(value);
                        }
                    }
                    const count = topicCount;
                    handleTimingsRequest(count,topicId);

                } catch (error) {
                    console.error('Error processing form data:', error);
                }
            } else {
                console.error('Unknown request body type:', body);
            }
        }
    })();

    let timer;
    let timeSpent = parseInt(localStorage.getItem('timeSpent')) || 0;

    function updateLocalStorage() {
        localStorage.setItem('timeSpent', timeSpent);
    }

    function startTimer() {
        timer = setInterval(async () => {
            const istoday = await resetLocalStorageIfNeeded(); // Await the async function

            if (!istoday) {
                timeSpent += 1;
            } else {
                console.log("时间到了，开始更新");
                timeSpent = 0;
            }
            updateLocalStorage(); // Assuming this function saves timeSpent to localStorage
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
    }

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            startTimer();
        } else {
            stopTimer();
        }
    });

    window.addEventListener('load', () => {
        startTimer();
    });

    window.addEventListener('beforeunload', () => {
        stopTimer();
        updateLocalStorage();
    });
})();