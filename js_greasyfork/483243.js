// ==UserScript==
// @name         查询bangumi贴中用户观看状态
// @namespace    http://tampermonkey.net/
// @version      1.5.7
// @description  查询贴中所有用户观看某部作品的状态
// @author       Hirasawa Yui
// @run-at       document-idle
// @match        https://bangumi.tv/group/topic/*
// @match        https://bangumi.tv/subject/topic/*
// @match        https://bangumi.tv/blog/*
// @match        https://bangumi.tv/ep/*
// @match        https://bgm.tv/group/topic/*
// @match        https://bgm.tv/subject/topic/*
// @match        https://bgm.tv/blog/*
// @match        https://bgm.tv/ep/*
// @match        https://chii.in/group/topic/*
// @match        https://chii.in/subject/topic/*
// @match        https://chii.in/blog/*
// @match        https://chii.in/ep/*
// @match        https://bangumi.tv/subject_search/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483243/%E6%9F%A5%E8%AF%A2bangumi%E8%B4%B4%E4%B8%AD%E7%94%A8%E6%88%B7%E8%A7%82%E7%9C%8B%E7%8A%B6%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/483243/%E6%9F%A5%E8%AF%A2bangumi%E8%B4%B4%E4%B8%AD%E7%94%A8%E6%88%B7%E8%A7%82%E7%9C%8B%E7%8A%B6%E6%80%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let colorful = true; // 采用五彩配色方案
    let userInfoMap = new Map(); // To store results for each user ID
    let validSubjectId = false; // Flag to track if the subject ID is valid
    let autoload = false;
    let stats = {
        "want": 0,
        "norate": 0,
        "geq7": 0,
        "leq6": 0,
        "watching": 0,
        "postpone": 0,
        "gaveup": 0,
        "nowatch": 0
    }; // stats for the whole discussion board

    const ongoingFetches = new Set(); // Lock set to keep track of ongoing fetches

    // clear stats for new query
    function clearStats() {
      for (let key in stats) {
          stats[key] = 0;
      }
    }

    // Function to create or update an element with the fetched data
    function insertOrUpdateAdjacentToAnchor(anchor, siblingClass, userId, subjectId) {
        let key = `${userId}-${subjectId}`;
        let text = userInfoMap.get(key) || "No info available";

        // Find existing element or create new one
        let newElement = anchor.parentNode.querySelector('.userData');
        if (!newElement) {
            newElement = anchor.parentNode.parentNode.querySelector('.userData');
        }
        if (!newElement) {
            newElement = document.createElement('span');
            newElement.className = 'userData'; // Assign a class for easy identification
            let inserted = false;
            let nextElement = anchor.parentNode.nextSibling;
            while (nextElement) {
                if (nextElement.nodeType === 1 && nextElement.matches(siblingClass)) {
                    nextElement.parentNode.insertBefore(newElement, nextElement.nextSibling);
                    inserted = true;
                    break;
                }
                nextElement = nextElement.nextSibling;
            }
            if (!inserted) {
                anchor.parentNode.insertBefore(newElement, anchor.nextSibling);
            }
        }

        // Update text content and color
        newElement.textContent = `【${text}】`;
        newElement.style.fontSize = '12px';
        if (colorful) {
            let type = getDataFromInfoText(text).type;
            if (type === 1) { // 想看
                newElement.style.color = '#eea1cd';
            } else if (type === 2) { // 看过
                newElement.style.color = '#3ac657';
            } else if (type === 3) { // 在看
                newElement.style.color = '#24a2e6';
            } else if (type === 4) { // 搁置
                newElement.style.color = '#bf7d1f';
            } else if (type === 5) { // 抛弃
                newElement.style.color = '#b22f9c';
            } else {
                newElement.style.color = '#999';
            }
        } else {
            newElement.style.color = '#999';
        }
        newElement.style.fontWeight = 'bold';
    }

    // Fetch collection data for a specific user ID and subject ID
    async function fetchUserInfo(userId, subjectId) {
      const userSubjectKey = `${userId}-${subjectId}`;
      const url = `https://api.bgm.tv/v0/users/${userId}/collections/${subjectId}`;

      // Skip fetching if the user is already in the map with the same subjectId or subject ID is invalid
      if (!validSubjectId || userInfoMap.has(userSubjectKey) || ongoingFetches.has(userSubjectKey)) return;
      console.log(userInfoMap);

      // Add to ongoing fetches
      ongoingFetches.add(userSubjectKey);

      try {
          const response = await fetch(url);

          if (!response.ok) {
              userInfoMap.set(userSubjectKey, "TA未看过/未公开收藏该作");
              stats.nowatch += 1;
              // Remove from ongoing fetches
              ongoingFetches.delete(userSubjectKey);
              return;
          }

          const data = await response.json();

            // update stats
            switch (data.type) {
                case 1:
                    stats.want += 1;
                    break;
                case 2:
                    if (data.rate) {
                        if (data.rate >= 7) stats.geq7 += 1;
                        else stats.leq6 += 1;
                    } else {
                        stats.norate += 1;
                    }
                    break;
                case 3:
                    stats.watching += 1;
                    break;
                case 4:
                    stats.postpone += 1;
                    break;
                case 5:
                    stats.gaveup += 1;
                    break;
            }

            let infoText = getInfoTextFromData(data);
            userInfoMap.set(userSubjectKey, infoText);
        } catch (error) {
            console.error('Error fetching or processing data', error);
            userInfoMap.set(userSubjectKey, "Error fetching data");
        } finally {
            // Remove from ongoing fetches in finally block to ensure it's always cleaned up
            ongoingFetches.delete(userSubjectKey);
        }
    }

    // Convert fetched data to a user-friendly text
    function getInfoTextFromData(data) {
        if (data.type === 1) return "TA想看这部作品";
        else if (data.type === 2) return data.rate ? `TA打了${data.rate}分` : 'TA看过这部作品';
        else if (data.type === 3) return data.ep_status ? `TA看到了${data.ep_status}集` : 'TA在看这部作品';
        else if (data.type === 4) return "TA搁置了这部作品";
        else if (data.type === 5) return "TA抛弃了这部作品";
        else return "未知状态";
    }

    // convert text back to data type
    function getDataFromInfoText(text) {
        let data = { type: 0, rate: null, ep_status: null }; // default unknown data

        if (text === "TA想看这部作品") {
            data.type = 1;
        } else if (text.startsWith("TA打了") && text.endsWith("分")) {
            data.type = 2;
            data.rate = parseFloat(text.slice(3, -1)); // Extracting number from "TA打了X分"
        } else if (text.startsWith("TA看到了") && text.endsWith("集")) {
            data.type = 3;
            data.ep_status = parseInt(text.slice(4, -1)); // Extracting number from "TA看到了X集"
        } else if (text === "TA搁置了这部作品") {
            data.type = 4;
        } else if (text === "TA抛弃了这部作品") {
            data.type = 5;
        } else if (text === 'TA看过这部作品') {
            data.type = 2; // Assuming this corresponds to having seen the work without a rating
        } else if (text === 'TA在看这部作品') {
            data.type = 3; // Assuming this corresponds to watching the work without a specific episode status
        } else {
            // Unknown status, data.type remains 0
        }

        return data;
    }

    // generate stats summary text
    function generateSummary() {
        // Calculate the total of all categories
        let total = stats.want + stats.norate + stats.geq7 + stats.leq6 + stats.watching + stats.postpone + stats.gaveup + stats.nowatch;

        // Select the paragraph element
        let p = document.querySelector('#statsSummary');

        // Function to calculate percentage
        const calcPercent = (value, total) => (total > 0 ? (value / total * 100).toFixed(1) : 0);

        // Create an array of category objects with name, count, and percent
        let categories = [
            { name: "想看这部作品", count: stats.want },
            { name: "看过，未打分", count: stats.norate },
            { name: "打了7分及以上", count: stats.geq7 },
            { name: "打了6分及以下", count: stats.leq6 },
            { name: "正在看这部作品", count: stats.watching },
            { name: "搁置了这部作品", count: stats.postpone },
            { name: "抛弃了这部作品", count: stats.gaveup },
            { name: "未看过/未公开收藏这部作品", count: stats.nowatch }
        ].map(category => ({
            ...category,
            percent: calcPercent(category.count, total)
        }));

        // Sort categories by percent, descending
        categories.sort((a, b) => b.percent - a.percent);

        // Constructing the inner HTML from the sorted categories
        // Prepend the total count line
        let totalPeopleLine = `总计参与人数: ${total}人<br>`;
        p.innerHTML = totalPeopleLine + categories.map(category =>
            `${category.percent}%(${category.count}人)的人${category.name}`).join('<br>');
    }

    // Fetch subject info by subject ID
    async function fetchSubjectInfo(subjectId) {
        const url = `https://api.bgm.tv/v0/subjects/${subjectId}`;
        try {
            const response = await fetch(url);
            const div = document.querySelector('.subjectInfo');

            if (!response.ok) {
                div.textContent = "无效条目";
                validSubjectId = false; // Mark subject ID as invalid
                userInfoMap.clear(); // Clear previous info if any
                return;
            }

            const data = await response.json();
            div.textContent = `你当前正在查询所有用户观看 ${data.name} 的状态`;
            div.style.color = 'green';
            validSubjectId = true; // Mark subject ID as valid
        } catch (error) {
            console.error('Error fetching subject data', error);
        }
    }

    // insert input elements below the specified div
    function insertInputElements(postTopicDiv) {
        if (postTopicDiv) {
            const placeholder = document.createElement('div');
            const title = document.createElement('h3');
            title.textContent = '查询观看状态';
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'searchInputL';
            input.placeholder = '输入条目ID';
            input.style.maxWidth = '200px';
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = '获取信息';

            button.style.fontSize = '13px';
            button.style.border = 'none';
            button.style.background = '#4EB1D4';
            button.style.color = '#FFF';
            button.style.padding = '6px 15px';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';

            const div = document.createElement('div');
            div.className = 'subjectInfo'; // For displaying subject info
            div.id = 'current_queried_subject_info';

            // Create a paragraph element for stats summary
            let statsSummary = document.createElement('p');
            statsSummary.id = 'statsSummary';

            button.onclick = async function() {
                const subjectId = input.value.trim();
                if (!subjectId) return; // Do nothing if the subject ID is empty
                clearStats();
                await fetchSubjectInfo(subjectId);
                if (validSubjectId) { // Only process users if the subject ID is valid
                    processAllUsers(subjectId);
                }
            };

            // Create a checkbox
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = autoload; // Set the initial state of the checkbox
            let check_tag = document.createElement('span');
            check_tag.textContent = '自动加载';

            // Change listener for the checkbox
            checkbox.addEventListener('change', function() {
                autoload = checkbox.checked; // Update the switch variable
                GM_setValue('autoload', autoload); // Save the new state
            });

            const quickSearch = document.createElement('a');
            quickSearch.href = 'https://bangumi.tv/subject_search';
            quickSearch.textContent = '快速查询条目ID';
            quickSearch.style.color = 'pink';
            quickSearch.cursor = 'pointer';
            quickSearch.target = '_blank';

            const container = document.createElement('div');
            container.appendChild(placeholder);
            container.appendChild(title);
            container.appendChild(input);
            container.appendChild(button);
            container.appendChild(checkbox);
            container.appendChild(check_tag);
            container.appendChild(quickSearch);
            container.appendChild(div); // Append the div for subject info
            container.appendChild(statsSummary);
            postTopicDiv.appendChild(container);
        }
    }
    // Initialize input box and button, and handle click event
    async function init() {
        autoload = GM_getValue('autoload', false);
        let container = document.querySelector('#columnInSubjectB');
        if (!container) {
            container = document.querySelector('#columnB');
        }
        if (!container) {
            container = document.querySelector('#columnEpB');
        }
        insertInputElements(container);

        // auto load watching status for all users on page 'ep' and 'subject/topic'
        if (autoload && ['https://bangumi.tv/subject/topic/',
             'https://bgm.tv/subject/topic/',
             'https://chii.in/subject/topic/',
             'https://bangumi.tv/ep/',
             'https://bgm.tv/ep/',
             'https://chii.in/ep'].some(prefix => document.URL.startsWith(prefix))) {

            let anchor = document.querySelector('#subject_inner_info .avatar');
            const subjectId = anchor.href.split('/subject/')[1].split('/')[0];
            clearStats();
            await fetchSubjectInfo(subjectId);
            processAllUsers(subjectId);
        }

        // search page
        if (document.URL.startsWith('https://bangumi.tv/subject_search/')){
            const anchorElements = document.querySelectorAll('a.l');
            anchorElements.forEach(anchor => {
                if(anchor.href.includes('/subject/')) {
                    const subjectId = anchor.href.split('/subject/')[1].split('/')[0];
                    let newElement = document.createElement('span');
                    newElement.style.cursor = 'pointer';

                    // Add an event listener for the click event
                    newElement.addEventListener('click', function() {
                        // Copy text to clipboard logic
                        navigator.clipboard.writeText(newElement.textContent.replace(/^\(|\)$/g, '')).then(() => {
                            console.log('Text copied to clipboard');
                        }).catch(err => {
                            console.error('Error in copying text: ', err);
                        });
                    });

                    newElement.textContent = `(${subjectId})`;
                    newElement.style.color = 'red';
                    newElement.style.fontWeight = 'bold';
                    anchor.parentNode.insertBefore(newElement, anchor.nextSibling);
                }
            });
        }
        // blog page
        if (['https://bangumi.tv/blog/',
        'https://bgm.tv/blog/',
        'https://chii.in/blog/'].some(prefix => document.URL.startsWith(prefix))){
            let anchorElements = document.querySelectorAll('#related_subject_list .ll .avatar');
            anchorElements.forEach(anchor => {
                if(anchor.href.includes('/subject/')) {
                    const subjectId = anchor.href.split('/subject/')[1].split('/')[0];
                    let newElement = document.createElement('p');
                    newElement.style.cursor = 'pointer';

                    // Add an event listener for the click event
                    newElement.addEventListener('click', function() {
                        // Copy text to clipboard logic
                        navigator.clipboard.writeText(newElement.textContent.replace(/^\(|\)$/g, '')).then(() => {
                            console.log('Text copied to clipboard');
                        }).catch(err => {
                            console.error('Error in copying text: ', err);
                        });
                    });

                    newElement.textContent = `(${subjectId})`;
                    newElement.style.color = 'red';
                    newElement.style.fontWeight = 'bold';
                    anchor.parentNode.insertBefore(newElement, anchor.nextSibling);
                }
            });
        }

    }

    // Fetch user info for all users and then process anchor tags
    async function processAllUsers(subjectId) {
        const anchorElements = document.querySelectorAll('a.l');
        let fetchPromises = [];

        anchorElements.forEach(anchor => {
            if(anchor.href.includes('/user/')) {
                const userId = anchor.href.split('/user/')[1].split('/')[0];
                if (!userInfoMap.has(`${userId}-${subjectId}`)) {
                    fetchPromises.push(fetchUserInfo(userId, subjectId));
                }
            }
        });

        await Promise.all(fetchPromises);

        anchorElements.forEach(anchor => {
            if(anchor.href.includes('/user/')) {
                const userId = anchor.href.split('/user/')[1].split('/')[0];
                insertOrUpdateAdjacentToAnchor(anchor, 'span.sign.tip_j', userId, subjectId);
            }
        });

        generateSummary();

    }

    init(); // Initialize and append input box and button
})();