// ==UserScript==
// @name        Atse (crash) data collector
// @namespace   Violentmonkey Scripts
// @match       https://csgoatse.com/crash
// @grant       none
// @version     1.2
// @author      - Chinakomba
// @description 2/3/2021, 10:47:15 PM
// @downloadURL https://update.greasyfork.org/scripts/421160/Atse%20%28crash%29%20data%20collector.user.js
// @updateURL https://update.greasyfork.org/scripts/421160/Atse%20%28crash%29%20data%20collector.meta.js
// ==/UserScript==


// Wait for page to fully load. Prevents the history from being sent multiple times if refreshing.
setTimeout(() => {
  // Catch all errors so atse doesnt get data about us.
  try {
      const STATS = {
      sum: 0,
      num: 0,
      addSum: (value) => { this.sum += value; this.num++ },
      avg: () => { return this.sum/this.num },
    }
    // Converts a roll (13,4x) to a number (13.4)
    const rollToNum = (roll) => { return Number(roll.replace("x", "").replace(",", "."))};

    const sendData = (data) => {
        const value = data.roll;
        fetch('https://chasmgames.com/atse?roll='+value, {
          method: 'POST', // or 'PUT'
          mode: 'no-cors',
          headers: {
            'Content-Type': 'x-www-form-urlencoded',
          },
        }).catch((error) => {
          console.error("Failed sending data to server", error);
        });
    };

    // Select the node that will be observed for mutations
    const targetNode = document.getElementById('history-list');

    // Options for the observer (which mutations to observe)
    const configas = { childList: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // return early if there was a node removed
                if(mutation.removedNodes[0]) return;
                const node = mutation.addedNodes[0];

                if(!node) {
                  console.log("node was supposedly empty - ", mutation);
                  return;
                }
                const value = rollToNum(node.innerText);
                STATS.addSum(value);
                //console.log(`Rolled: ${value}\nAverage: ${STATS.avg()}\nTotal rolls: ${STATS.num}`);
                const data = {roll: value};
                sendData(data);
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, configas);
  } catch(err) {
    console.log("error in atse crash data collector", err);
  }
}, 5000); 
