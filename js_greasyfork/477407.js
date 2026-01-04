// ==UserScript==
// @name        Analysis Colorizer Mobile - chengjiyun.com
// @namespace   Violentmonkey Scripts
// @match       https://chengjiyun.com/gdsyxx/m/index.html*
// @grant       none
// @version     1.0.1
// @author      66Leo66
// @description 2023/10/14 15:29:25
// @downloadURL https://update.greasyfork.org/scripts/477407/Analysis%20Colorizer%20Mobile%20-%20chengjiyuncom.user.js
// @updateURL https://update.greasyfork.org/scripts/477407/Analysis%20Colorizer%20Mobile%20-%20chengjiyuncom.meta.js
// ==/UserScript==


function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}


function doTheJob() {
  // Find the table rows and apply changes to each child tr
    const tableRows = document.querySelectorAll('div#cj3-question-table > table > tbody > tr');
    let compactMode = true;
    tableRows.forEach(row => {
        // Apply your desired changes to each row here
        // row.style.backgroundColor = 'yellow';
        // row.style.fontWeight = 'bold';
        // Add more modifications as needed

        const maxScoreTd = row.querySelector('td:nth-child(3)');
        const gradeScoreTd = row.querySelector('td:nth-child(6)');
        const myScoreTd = row.querySelector('td:nth-child(7)');

        const maxScore = parseFloat(maxScoreTd.innerText);
        const gradeScore = parseFloat(gradeScoreTd.innerText);
        const myScore = parseFloat(myScoreTd.innerText);


        // Colorize
        if (myScore == maxScore) {
          myScoreTd.style.backgroundColor = 'GreenYellow';
        } else if (myScore == 0) {
          myScoreTd.style.backgroundColor = 'Salmon';
        } else {
          myScoreTd.style.backgroundColor = '#F8DE22';
        }


        // Optimize score display
        const myScoreContainer = document.createElement('div');
        myScoreContainer.style.display = 'flex';

        const formattedMyScore = `${myScore.toFixed(2)}/${maxScore.toFixed(2)}`;
        const scoreHolderSpan = document.createElement('span');
        scoreHolderSpan.innerHTML = `<b>${formattedMyScore}</b>`;
        scoreHolderSpan.style.flex = 'auto';

        const lostIndicatorSpan = document.createElement('span');
        lostIndicatorSpan.textContent = `(-${(maxScore-myScore).toFixed(2)})`

        myScoreContainer.append(scoreHolderSpan, lostIndicatorSpan);
        myScoreTd.replaceChildren(myScoreContainer)


        // Compare to grade
        const gradeScoreContainer = document.createElement('div');
        gradeScoreContainer.style.display = 'flex';
        const compareSpan = document.createElement('span');
        const scoreDiff = Math.abs(myScore - gradeScore).toFixed(2)
        if (myScore > gradeScore) {
          compareSpan.style.color = 'green';
          compareSpan.textContent = compactMode ? `+${scoreDiff}` : `我比年级高 ${scoreDiff} 分`;
        } else if (myScore < gradeScore) {
          compareSpan.style.color = 'red';
          compareSpan.textContent = compactMode ? `-${scoreDiff}` : `我比年级低 ${scoreDiff} 分`;
        } else {
          compareSpan.style.color = 'black';
          compareSpan.textContent = '不相上下';
        }
        const gradeScoreHolderSpan = document.createElement('span');
        gradeScoreHolderSpan.innerText = gradeScore.toFixed(2);
        gradeScoreHolderSpan.style.flex = 'auto';
        gradeScoreContainer.append(gradeScoreHolderSpan, compareSpan)
        gradeScoreTd.replaceChildren(gradeScoreContainer)
    });
}

(async function() {
    'use strict';

    // Select the target node
    const targetNode = await waitForElm('div#cj3-question-table');

    // Create a new MutationObserver instance
    const observer = new MutationObserver(function(mutationsList, observer) {
      // Check if the mutations include changes to the specific selector
      if (mutationsList.some(mutation => mutation.target.matches('div#cj3-question-table'))) {
        // The selector has changed or exists
        console.log('The selector has changed or exists.');
        doTheJob()
      }
    });

// Start observing mutations on the target node
observer.observe(targetNode, { attributes: true, childList: true, subtree: true });



})();