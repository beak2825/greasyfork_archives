// ==UserScript==
// @name         4chan Catalog Deleted posts view (Vowels+Ordered Country) (cat count)
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Fetch and process data from 4plebs archive for 4chan, integrating detailed API calls for omitted posts and threads
// @author       You
// @match        https://boards.4chan.org/*/catalog
// @icon https://www.google.com/s2/favicons?sz=64&domain=4chan.org
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/494256/4chan%20Catalog%20Deleted%20posts%20view%20%28Vowels%2BOrdered%20Country%29%20%28cat%20count%29.user.js
// @updateURL https://update.greasyfork.org/scripts/494256/4chan%20Catalog%20Deleted%20posts%20view%20%28Vowels%2BOrdered%20Country%29%20%28cat%20count%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Script will start after a 5-second delay...');
    setTimeout(() => {
        const board = location.pathname.split('/')[1];
        fetchCurrentThreads();

function secureFetch(url, options = {}) {
    return new Promise((resolve, reject) => {
        if (typeof GM_xmlhttpRequest !== "undefined") {
            GM_xmlhttpRequest({
                method: options.method || 'GET',
                url: url,
                headers: options.headers,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        resolve({}); // Resolve with empty object on error
                    }
                },
                onerror: function(error) {
                    resolve({}); // Resolve with empty object on error
                }
            });
        } else {
            fetch(url, options).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            }).then(data => resolve(data))
              .catch(error => reject(error));
        }
    });
}

        function fetchCurrentThreads() {
            const url = `https://a.4cdn.org/${board}/catalog.json`;
            secureFetch(url).then(data => {
                const currentThreads = data.reduce((acc, page) => {
                    page.threads.forEach(thread => acc.push(thread.no));
                    return acc;
                }, []);
                const flags = data.reduce((acc, page) => {
                    page.threads.forEach(thread => {
                        if (thread.country) {
                            acc[thread.country] = (acc[thread.country] || 0) + 1;
                        }
                    });
                    return acc;
                }, {});
                const sortedCountries = Object.keys(flags).sort((a, b) => flags[b] - flags[a]);
                console.log(`Total threads found: ${currentThreads.length}`);
                console.log(`Country flags sorted by frequency: ${JSON.stringify(sortedCountries)}`);
                startSearch(currentThreads, sortedCountries);
            }).catch(console.error);
        }

        function startSearch(threadList, sortedCountries) {
            const today = new Date();
            const yesterday = new Date(today.setDate(today.getDate() - 1));
            const tomorrow = new Date(today.setDate(today.getDate() + 2));
            const startDate = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
            const endDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
            const vowels = [ 'a', 'e', 'i', 'u'];
            //const vowels = ['1', '2', '3', '4', 'a', 'e', 'i', 'u'];
            searchByVowels(vowels, startDate, endDate, threadList)
                .then(() => searchByCountries(sortedCountries, startDate, endDate, threadList))
                .catch(error => console.error('Error starting search:', error));
        }

function updateThreadStyle(threadId, deletedCount) {
    const threadElement = document.querySelector(`div#meta-${threadId}`);
    if (threadElement) {
        let deletedDisplay = threadElement.querySelector('b.deleted-count');
        if (!deletedDisplay) {
            deletedDisplay = document.createElement('b');
            deletedDisplay.className = 'deleted-count';
            deletedDisplay.style.color = 'red';
            deletedDisplay.style.fontWeight = 'bold';
            threadElement.insertAdjacentHTML('beforeend', ` / D: `);
            threadElement.appendChild(deletedDisplay);
        }
        deletedDisplay.innerHTML = deletedCount;
        console.log(`Thread ${threadId} updated with ${deletedCount} deleted posts.`);
    } else {
        console.log(`Meta element not found for thread ID: ${threadId}`);
    }
}


const globalDeletedCounts = {};

function processSearchResults(data, threadList) {
    if (!data || typeof data !== 'object' || !data[0] || !Array.isArray(data[0].posts)) {
        console.error("Data is not structured as expected:", data);
        return;
    }

    // Copy the current counts to a new object to track changes during this cycle
    const initialCounts = {...globalDeletedCounts};

    const posts = data[0].posts;
    posts.forEach(post => {
        if (threadList.includes(parseInt(post.thread_num))) {
            if (!globalDeletedCounts[post.thread_num]) {
                globalDeletedCounts[post.thread_num] = 0;
            }
            globalDeletedCounts[post.thread_num]++;  // Increment the count for this thread number
        }
    });

    // After processing all posts, update the UI and log changes where counts have been modified
    posts.forEach(post => {
        if (threadList.includes(parseInt(post.thread_num)) && globalDeletedCounts[post.thread_num] !== initialCounts[post.thread_num]) {
            updateThreadStyle(post.thread_num, globalDeletedCounts[post.thread_num]);
            console.log(`Thread ${post.thread_num}: Deleted posts updated. New count: ${globalDeletedCounts[post.thread_num]} (Previously: ${initialCounts[post.thread_num] || 0})`);
        }
    });
}



function searchByCountries(countries, startDate, endDate, threadList) {
    return new Promise((resolve, reject) => {
        const searchPromises = countries.map((country, index) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const url = `https://archive.4plebs.org/_/api/chan/search/?boards=pol&country=${country}&deleted=deleted&ghost=none&filter=image.text&type=posts&start=${startDate}&end=${endDate}&order=desc`;
                    secureFetch(url).then(data => {
                        const posts = data[0]?.posts || []; // Check if data is structured as expected
                        console.log(`Total deleted posts found for country ${country}: ${posts.length}`);
                        processSearchResults(data, threadList);
                        resolve();
                    }).catch(error => {
                        console.error(`Error searching country ${country}:`, error);
                        resolve(); // Resolve without rejecting
                    });
                }, 13000 * index);
            });
        });
        Promise.all(searchPromises).then(resolve).catch(reject);
    });
}

function searchByVowels(vowels, startDate, endDate, threadList) {
    return new Promise((resolve, reject) => {
        const searchPromises = vowels.map((vowel, index) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const url = `https://archive.4plebs.org/_/api/chan/search/?boards=${board}&text=${vowel}&deleted=deleted&filter=image.text&type=posts&start=${startDate}&end=${endDate}&order=desc`;
                    secureFetch(url).then(data => {
                        const posts = data[0]?.posts || []; // Check if data is structured as expected
                        console.log(`Total deleted posts found for vowel ${vowel}: ${posts.length}`);
                        processSearchResults(data, threadList);
                        resolve();
                    }).catch(error => {
                        console.error(`Error searching vowel ${vowel}:`, error);
                        resolve(); // Resolve without rejecting
                    });
                }, 13000 * index);
            });
        });
        Promise.all(searchPromises).then(resolve).catch(reject);
    });
}


    }, 5000); // Start the script after a 5-second delay
})();