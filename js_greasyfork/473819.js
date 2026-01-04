// ==UserScript==
    // @name         c.ai Neo Panel Button Interception
    // @namespace    c.ai Neo Panel TEMPLATE
    // @version      1.0
    // @description  A panel that you can view in your profile section and that will show your followers
    // @author       vishanka
    // @license      MIT
    // @match        https://*.character.ai/profile*
    // @icon         https://i.imgur.com/iH2r80g.png
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473819/cai%20Neo%20Panel%20Button%20Interception.user.js
// @updateURL https://update.greasyfork.org/scripts/473819/cai%20Neo%20Panel%20Button%20Interception.meta.js
    // ==/UserScript==


(function() {
    'use strict';

    function createPermanentpanel_Followers() {
        const panel_Followers = document.createElement('div');
        panel_Followers.id = 'followers_panel';
        panel_Followers.style.position = 'fixed';
        panel_Followers.style.bottom = '0px';
        panel_Followers.style.right = '0%';
        panel_Followers.style.width = '15%';
        panel_Followers.style.height = '100%';
        panel_Followers.style.backgroundColor = 'white';
        panel_Followers.style.borderLeft = '1px solid #ccc';
        panel_Followers.style.padding = '10px';
        panel_Followers.style.zIndex = '100';
        panel_Followers.style.direction = 'ltr';
        panel_Followers.style.overflow = 'auto';
        panel_Followers.style.display = 'block';

        // Create the button
        const loadButton = document.createElement('button');
        loadButton.textContent = 'Load Followers';
        loadButton.style.marginBottom = '10px';

        // Append the button to the panel
        panel_Followers.appendChild(loadButton);

        // Create a list to contain the follower items
        const followersList = document.createElement('ul');
        followersList.style.listStyleType = 'none';
        followersList.style.margin = '0px 0';
        followersList.style.padding = '0';

        // Add an event listener to the button
        loadButton.addEventListener('click', function() {
            var original_prototype_open = XMLHttpRequest.prototype.open;
            const intercepted_data_object_followers = {};
            console.log("followers1:", intercepted_data_object_followers.followers);
            XMLHttpRequest.prototype.open = function(method, url, async) {
            console.log("followers2:", intercepted_data_object_followers.followers);
                    this.addEventListener('load', function() {
            console.log("followers3:", intercepted_data_object_followers.followers);
                        let info = JSON.parse(this.responseText);

                        if (
                            url.startsWith('https://plus.character.ai/chat/user/followers/') ||
                            url.startsWith('https://beta.character.ai/chat/user/followers/')
                        ) {
                            intercepted_data_object_followers.followers = info.followers;
                            console.log("followers:", intercepted_data_object_followers.followers);

                            // Clear existing follower list
                            followersList.innerHTML = '';

                            let followerCount = 1; // Initialize the follower count

                            // Populate the follower list with the fetched data
                            if (intercepted_data_object_followers.followers) {
                                for (const followerItem of intercepted_data_object_followers.followers) {
                                    const listItem = document.createElement('li');

                                    const contentContainer = document.createElement('a');
                                    contentContainer.href = `https://plus.character.ai/public-profile/?username=${followerItem}`;
                                    contentContainer.target = '_blank';
                                    contentContainer.style.textDecoration = 'none';
                                    contentContainer.style.color = 'black';
                                    contentContainer.style.display = 'block';

                                    const countSpan = document.createElement('span');
                                    countSpan.textContent = `${followerCount}. `;
                                    countSpan.style.fontWeight = 'bold';
                                    countSpan.style.marginRight = '10px';

                                    if (followerCount <= 9) {
                                        countSpan.style.marginLeft = '8px';
                                    }

                                    const linkElement = document.createElement('span');
                                    linkElement.textContent = followerItem;

                                    contentContainer.appendChild(countSpan);
                                    contentContainer.appendChild(linkElement);
                                    listItem.appendChild(contentContainer);

                                    const dividerLine = document.createElement('hr');
                                    dividerLine.style.margin = '10px 0';
                                    listItem.appendChild(dividerLine);

                                    followersList.appendChild(listItem);
                                    followerCount++;
                                }
                            }
                        }
                    });

    XHR_interception_resolve(intercepted_data_object_followers);
                original_prototype_open.apply(this, [method, url, async]);
            };


            let XHR_interception_resolve;
            const XHR_interception_promise = new Promise(function(resolve, reject) {
                XHR_interception_resolve = resolve;
            });


            panel_Followers.appendChild(followersList);
        });

        document.body.appendChild(panel_Followers);
    }

    createPermanentpanel_Followers();
})();
