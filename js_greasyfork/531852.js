// ==UserScript==
// @name         Instagram Roulette
// @namespace    http://greasyfork.org/
// @version      0.1
// @description  Picks 10 random accounts from people you're following on Instagram and displays them in a new tab
// @author       Claude
// @match        https://www.instagram.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531852/Instagram%20Roulette.user.js
// @updateURL https://update.greasyfork.org/scripts/531852/Instagram%20Roulette.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // UI ele
    function createUI() {
        // Create button element
        const button = document.createElement('button');
        button.textContent = 'Pick 10 Random Follows';
        button.style.position = 'fixed';
        button.style.top = '70px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.style.padding = '8px 16px';
        button.style.backgroundColor = '#0095f6';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontWeight = 'bold';
        
        document.body.appendChild(button);
        button.addEventListener('click', clickHandler);
    }
    
    function clickHandler() {
        // Check if we're on the following page
        if (!window.location.href.includes('/following')) {
            alert('Please navigate to your "Following" list first by:\n\n1. Go to your profile\n2. Click on "Following"\n3. Wait for the list to load completely\n4. Then click this button again');
            return;
        }
        
        // Ask user to scroll to load more follows if needed, else the sampling will be bad.
        if (confirm('For best results, scroll through your following list to load more accounts before continuing.\n\nPress OK when you\'re ready to select 10 random accounts.')) {
            pickRandomFollows();
        }
    }
    
    // Pick random accounts 
    function pickRandomFollows() {
        const selectors = [
            // Try various potential selectors for username elements
            'div[role="dialog"] a[role="link"]',
            'div[role="dialog"] div[role="button"]',
            'div[role="dialog"] span[title]',
            'div[role="dialog"] a',
            'div[role="dialog"] div.x9f619 a',
            'div[role="dialog"] div.x1dm5mii',
            'div[role="dialog"] div.x1i10hfl'
        ];
        
        let followingItems = [];
  
        for (const selector of selectors) {
            const items = document.querySelectorAll(selector);
            if (items.length > 0) {
                followingItems = items;
                console.log('Found following items with selector:', selector);
                break;
            }
        }
        
        // Extract usernames
        const usernameData = [];
        followingItems.forEach(item => {
            let username = '';
            
            if (item.tagName === 'A' && item.href) {

                const match = item.href.match(/instagram\.com\/([^\/]+)/);
                if (match && match[1]) {
                    username = match[1];
                }
            } else if (item.textContent) {

                username = item.textContent.split('\n')[0].trim();
            }
            

            if (username && !username.includes(' ') && username.length > 0) {
                usernameData.push({
                    username: username,
                    element: item
                });
            }
        });
        
        // Remove duplicates
        const uniqueUsernames = [...new Set(usernameData.map(data => data.username))];
        
        if (uniqueUsernames.length === 0) {
            alert('No usernames found. This could be because:\n\n1. The following list hasn\'t fully loaded\n2. Instagram has updated their page structure\n\nTry scrolling through your following list and try again.');
            return;
        }
        
        console.log(`Found ${uniqueUsernames.length} unique usernames`);
        
        // Select 10 random usernames
        const randomUsernames = getRandomItems(uniqueUsernames, 10);
        
        // HTML --> opens in new tab
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>10 Random Instagram Follows</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #fafafa;
                    }
                    h1 {
                        color: #262626;
                        text-align: center;
                    }
                    ol {
                        background-color: white;
                        border: 1px solid #dbdbdb;
                        border-radius: 4px;
                        padding: 20px 20px 20px 40px;
                    }
                    li {
                        margin: 10px 0;
                        font-size: 16px;
                    }
                    a {
                        color: #0095f6;
                        text-decoration: none;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                    .timestamp {
                        text-align: center;
                        color: #8e8e8e;
                        font-size: 14px;
                        margin-top: 20px;
                    }
                    .note {
                        background-color: #fff9e6;
                        border: 1px solid #ffe182;
                        border-radius: 4px;
                        padding: 10px;
                        margin-top: 20px;
                        font-size: 14px;
                    }
                </style>
            </head>
            <body>
                <h1>10 Random Instagram Follows</h1>
                <ol>
                    ${randomUsernames.map(name => `<li><a href="https://www.instagram.com/${name}" target="_blank">@${name}</a></li>`).join('')}
                </ol>
                <div class="note">
                    <p>Selected from ${uniqueUsernames.length} visible accounts in your following list.</p>
                    <p>For more complete results, make sure to scroll through your entire following list before running the script.</p>
                </div>
                <p class="timestamp">Generated on ${new Date().toLocaleString()}</p>
            </body>
            </html>
        `;
        

        const blob = new Blob([htmlContent], {type: 'text/html'});
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }
    

    function getRandomItems(items, count) {
        const result = [];
        const max = Math.min(count, items.length);
        

        const availableItems = [...items];
        
        for (let i = 0; i < max; i++) {
            const randomIndex = Math.floor(Math.random() * availableItems.length);
            result.push(availableItems[randomIndex]);
            availableItems.splice(randomIndex, 1);
        }
        
        return result;
    }
    

    window.addEventListener('load', function() {
        // Small delay 
        setTimeout(createUI, 2000);
    });
})();