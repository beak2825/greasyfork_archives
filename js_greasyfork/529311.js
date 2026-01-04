// ==UserScript==
// @name         AtCoder Time Limit Highlighter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlight execution time limit if it's not 2 seconds
// @author       hyoka7
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529311/AtCoder%20Time%20Limit%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/529311/AtCoder%20Time%20Limit%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Function to find the execution time limit
    function findTimeLimit() {
        // Get all problem text
        const problemElements = document.querySelectorAll('.part > section > p');
        
        // Look for the execution time limit text
        for (const element of problemElements) {
            const text = element.textContent;
            
            // Check if the text contains "実行時間制限："
            if (text.includes('実行時間制限：')) {
                // Extract the number before "sec"
                const match = text.match(/実行時間制限：(\d+(\.\d+)?)秒/);
                if (match) {
                    return {
                        element: element,
                        value: parseFloat(match[1])
                    };
                }
            }
        }
        
        return null;
    }
    
    // Find the time limit info
    const timeLimit = findTimeLimit();
    
    // If found and not equal to 2, highlight it
    if (timeLimit && timeLimit.value !== 2) {
        // Create a span to wrap the time limit
        const textContent = timeLimit.element.innerHTML;
        const newContent = textContent.replace(
            /(実行時間制限：)(\d+(\.\d+)?)秒/,
            '$1<span style="background-color: yellow; color: red; font-weight: bold; padding: 2px 4px;">$2秒</span>'
        );
        
        // Update the content
        timeLimit.element.innerHTML = newContent;
        
        // Also add a note at the top of the page
        const warningDiv = document.createElement('div');
        warningDiv.style.backgroundColor = '#ffdddd';
        warningDiv.style.color = '#cc0000';
        warningDiv.style.padding = '10px';
        warningDiv.style.margin = '10px 0';
        warningDiv.style.borderRadius = '5px';
        warningDiv.style.fontWeight = 'bold';
        warningDiv.textContent = `注意: この問題の実行時間制限は ${timeLimit.value} 秒です`;
        
        // Insert at the top of the problem statement
        const problemStatement = document.querySelector('.col-sm-12');
        if (problemStatement) {
            problemStatement.insertBefore(warningDiv, problemStatement.firstChild);
        }
        
        console.log(`Time limit is ${timeLimit.value} seconds - highlighted!`);
    } else {
        console.log(`Time limit is ${timeLimit ? timeLimit.value : 'not found'} seconds - no highlighting needed`);
    }
})();