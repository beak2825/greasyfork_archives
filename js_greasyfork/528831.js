// ==UserScript==
// @name         Advanced Disboard Filter
// @namespace    https://github.com/kellofkindles
// @version      1.0
// @description  Allows you to filter discord servers from Disboard by things such as: How many members there are, what tags it has, and more.
// @license      GNU GPLv3
// @tag          utilities
// @tag          social media
// @author       Kellofkindles
// @match        https://disboard.org/servers*
// @match        https://disboard.org/search*
// @icon         https://disboard.org/favicon.ico
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/528831/Advanced%20Disboard%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/528831/Advanced%20Disboard%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
    * REMOVE_DUPLICATES: Prevents the same server from showing up in the list twice. Formatted as either 'true' or 'false'.
    * MIN_ONLINE_COUNT: Minimum number of members currently online. Formatted as any number.
    * MAX_ONLINE_COUNT: Maximum number of members currently online. Formatted as any number.
    * FILTERED_TAGS: List of which tags to hide. Formatted as comma separated lowercase strings surrounded by quotation marks all inside of 'new Set([])'.
    *
    * SERVER_DETAILS_RATE_LIMIT: How often to get the details of a server, such as total member count. Formatted as any number in ms.
    */
    const REMOVE_DUPLICATES = true;
    const MIN_ONLINE_COUNT = 0;
    const MAX_ONLINE_COUNT = 20;
    const FILTERED_TAGS = new Set(["rp","roleplay","dating","system","fandom","4chan"]);

    const SERVER_DETAILS_RATE_LIMIT = 1500;

    const seenServers = {}; // Servers which have been seen. Purely for preventing duplicates
    const cachedServers = {}; // Servers which have been checked. Clears on page refresh.
    const queuedServers = []; // A list of lists with a length of two. The first element represents the disboard URL to check, and the second is the callback

    /**
    * Adds a server to the queue of servers to check for details.
    * Will check if the server is already cached first.
    * @param serverUrl  The link to the disboard server page which contains the server's details
    * @return           An promise which resolves an object formatted as {isNew: boolean, onlineCount: number, totalCount: number}
    */
    function queueServer(serverUrl){
        return new Promise((resolve, reject) => {
            if(cachedServers[serverUrl]){
                resolve(cachedServers[serverUrl]);
            } else {
                queuedServers.push([serverUrl,resolve])
            }
        });
    }

    setInterval(() => { // Gets the details for the next serverUrl in the queue every <SERVER_DETAILS_RATE_LIMIT> ms and calls the associated callback
        if(queuedServers[0]){ // Checks if there is a server url in the queue
            let [serverUrl, resolve] = queuedServers.shift(); // Removes the first element in the queue and stores it

            // Gets the server's details. If sucessful, calls the callback. If it fails, adds the serverUrl/callback to the front of the queue
            getServerDetails(serverUrl).then(resolve).catch(() => queuedServers.unshift([serverUrl, resolve]));
        }
    }, SERVER_DETAILS_RATE_LIMIT)

    /**
    * Gets the details of a single server from a disboard URL
    * Will check if the server is already cached first.
    * @param serverUrl  The link to the disboard server page which contains the server's details
    * @return           An promise which resolves an object formatted as {isNew: boolean, onlineCount: number, totalCount: number}
    */
    function getServerDetails(serverUrl) {
        return new Promise((resolve,reject) => {
            if(serverUrl in cachedServers){ // If the server is cached, just resolve the cached server details
                resolve(cachedServers[serverUrl]);
            } else {
                fetch(serverUrl).then(request => {
                    // Makes sure the request was successful. If not, rejects the promise.
                    if(request.status === 200){
                        request.text().then((response) => {
                            let serverInfo = {
                                isNew: false,
                                onlineCount: -1,
                                totalCount: -1,
                            }

                            // Loops throught each line of the response looking for specific lines that relate to specific data
                            const lines = response.split("\n");
                            for(let i = 0; i < lines.length; i++){
                                switch(lines[i].trim()) {
                                    case '<i class="icon icon-baby-crying"></i>':
                                        serverInfo.isNew = true;
                                        break;
                                    case '<div class="online-member-count">':
                                        serverInfo.onlineCount = lines[++i].substring(
                                            lines[i].indexOf("<b>") + 3,
                                            lines[i].lastIndexOf("</b>")
                                        );
                                        break;
                                    case '<div class="member-count">':
                                        serverInfo.totalCount = lines[++i].substring(
                                            lines[i].indexOf("<b>") + 3,
                                            lines[i].lastIndexOf("</b>")
                                        );
                                        i = lines.length;
                                        break;
                                }
                            }

                            cachedServers[serverUrl] = serverInfo;
                            resolve(serverInfo);
                        });

                    } else {
                        reject();
                    }
                });
            }
        });
    }

    // Small helper method for getting the server url
    function serverUrl(element){
        return element.closest(".server-info").getElementsByClassName("server-name")[0].getElementsByTagName("a")[0].href;
    }

    // Applies the filters to the given element
    function applyFilters(element){
        Array.from(element.querySelectorAll(".listing-card > .server-header > .server-info > .server-misc > .server-online")).filter(onlineCount => { // Creates an array of online member counts, and begins to filter them
            // If any of the filters fail, remove the parent server card and do not include this server in the next loop
            if((REMOVE_DUPLICATES && serverUrl(onlineCount) in seenServers) ||
               onlineCount.innerText > MAX_ONLINE_COUNT ||
               onlineCount.innerText < MIN_ONLINE_COUNT ||
               Array.from(onlineCount.closest(".listing-card").getElementsByClassName("tag")).map(tag => tag.title).some(tag => FILTERED_TAGS.has(tag)) // Checks if the associated tags contain any of the tags in <FILTERED_TAGS>
              ){
                onlineCount.closest(".listing-card").parentElement.remove();
                seenServers[serverUrl(onlineCount)] = true; // Prevents duplicates
                return false;
            } else {
                seenServers[serverUrl(onlineCount)] = true; // Prevents duplicates
                return true; // Filters passed, include this server in the next loop
            }
        }).forEach(filtered => { // Loops through the remaining servers and adds their URLs to the queue.
            filtered.innerText += " / ?"; // Placeholder value until the real value is resolved

            // Gets the disboard URL to the server, adds it to the queue, then updates the online count to include the total member count.
            queueServer(serverUrl(filtered)).then(serverInfo => {
                filtered.innerText = serverInfo.onlineCount + " / " + serverInfo.totalCount;
            });
        });
    }

    applyFilters(document); // Intial filter

    // Applies the filter every time a new page of servers is added
    new MutationObserver(mutation => {
        applyFilters(mutation[0].addedNodes[0]);
    }).observe(document.getElementById("listings"), {childList:true});
})();