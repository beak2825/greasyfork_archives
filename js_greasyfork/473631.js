// ==UserScript==
    // @name         c.ai Neo Panel Swipes
    // @namespace    c.ai Neo Panel Swipes
    // @version      2.1
    // @description  A toggleable panel with the swipes of the current turn
    // @author       vishanka
    // @license      MIT
    // @match        https://*.character.ai/chat*
    // @icon         https://i.imgur.com/iH2r80g.png
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473631/cai%20Neo%20Panel%20Swipes.user.js
// @updateURL https://update.greasyfork.org/scripts/473631/cai%20Neo%20Panel%20Swipes.meta.js
    // ==/UserScript==



(function() {
    'use strict';

    var original_prototype_open = XMLHttpRequest.prototype.open;
    const intercepted_data_object_swipes = {};

    XMLHttpRequest.prototype.open = function(method, url, async) {
        if (
            url.startsWith('https://plus.character.ai/chat/history/continue/') ||
            url.startsWith('https://plus.character.ai/chat/character/info') ||
            url.startsWith('https://beta.character.ai/chat/history/continue/') ||
            url.startsWith('https://beta.character.ai/chat/character/info')
        ) {
            this.addEventListener('load', function() {
                let info1_swipes = JSON.parse(this.responseText);
                intercepted_data_object_swipes.external_id = info1_swipes.character.external_id;
                intercepted_data_object_swipes.name = info1_swipes.character.name;
                console.log("character_id:",intercepted_data_object_swipes.external_id);

                // Only create the toggle button and the panel once
                if (!document.getElementById('NeoPanelSwipes')) {
                    createToggleButton_NeoPanelSwipes();
                    createNeoPanelSwipes();
                }
            });

        } else if (url.startsWith(`https://neo.character.ai/chats/recent/${intercepted_data_object_swipes.external_id}`)) {
            this.addEventListener('load', function() {
                let info2_swipes = JSON.parse(this.responseText);
                intercepted_data_object_swipes.chat_id = info2_swipes.chats[0].chat_id;
                console.log("chat_id:",intercepted_data_object_swipes.chat_id);
            });
        } else if (url.startsWith(`https://neo.character.ai/turns/${intercepted_data_object_swipes.chat_id}`)) {
            this.addEventListener('load', function() {
                let info3_swipes = JSON.parse(this.responseText);
                intercepted_data_object_swipes.turn_id = info3_swipes.turns[0].turn_key.turn_id;
                intercepted_data_object_swipes.total_turns = info3_swipes.turns.length;
                console.log("turn_id:",intercepted_data_object_swipes.turn_id);
                console.log("total_turns:", intercepted_data_object_swipes.total_turns);
                // Extract data from the last turn_id if there are turns
                if (intercepted_data_object_swipes.total_turns > 0) {
                  const lastTurnIndex = intercepted_data_object_swipes.total_turns - 1;
                  const lastTurnData = info3_swipes.turns[lastTurnIndex];
                  intercepted_data_object_swipes.lastTurnId = lastTurnData.turn_key.turn_id; // Store lastTurnId in intercepted_data_object_swipes
                  console.log("Last turn_id:", intercepted_data_object_swipes.lastTurnId);
                }
                // Extract candidates for "turn 0", used for fetching limit
        if (intercepted_data_object_swipes.total_turns > 0) {
            const firstTurnData = info3_swipes.turns[0];
            intercepted_data_object_swipes.candidatesForTurn0 = firstTurnData.candidates;
            intercepted_data_object_swipes.numberOfCandidatesForTurn0 = intercepted_data_object_swipes.candidatesForTurn0.length;
            console.log("Number of candidates for turn 0:", intercepted_data_object_swipes.numberOfCandidatesForTurn0);

            intercepted_data_object_swipes.rawContents = intercepted_data_object_swipes.candidatesForTurn0.map(candidate => candidate.raw_content);
            console.log("Raw contents of candidates for turn 0:", intercepted_data_object_swipes.rawContents);


// All Styles and Functions of the List Elements

const swipes = document.createElement('div');
swipes.style.textAlign = 'left';
swipes.style.marginTop = '10px';
swipes.style.overflowWrap = 'break-word'; // Add this line
swipes.style.whiteSpace = 'pre-wrap'; // Add this line


if (intercepted_data_object_swipes.rawContents) {
    intercepted_data_object_swipes.rawContents.forEach((content, index) => {
        const contentContainer = document.createElement('div'); // Create a container for each content
        contentContainer.style.display = 'flex'; // Use flex layout
        contentContainer.style.alignItems = 'center'; // Center-align vertically
        contentContainer.style.marginBottom = '-10px'; // Add some spacing between elements
        contentContainer.style.direction = 'ltr';
        let isGreen = false; // Flag to track the background color state

        const candidateNumber = index + 1; // Adding 1 to index to make it 1-based
        const numberElement = document.createElement('span'); // Create element for candidate number
        numberElement.textContent = `${candidateNumber}.`;
        numberElement.style.marginRight = '15px'; // Add spacing between number and text
        numberElement.style.direction = 'ltr';
//        numberElement.style.alignItems = 'center';
numberElement.style.marginBottom = '15px'

        const contentElement = document.createElement('div'); // Create element for content
        contentElement.innerHTML = content;
        contentElement.style.direction = 'ltr';
        contentElement.style.color = '#958C7F';

// Changes the color of the text
const formattedContent = content.replace(/(["“”«»].*?["“”«»])/g, '<span style="color: #FFFFFF">$1</span>');
const finalContent1 = formattedContent.replace(/\*\*(.*?)\*\*/g, '<span style="font-weight: bold;">$1</span>');
const finalContent = finalContent1.replace(/\*(.*?)\*/g, '<span style="font-style: italic; color: #E0DF7F;">$1</span>');
// Use regular expressions to find text within backticks and apply formatting
const formattedBackticks_3 = finalContent.replace(/```([^`]*)```/g, '<div style="display: inline-block; margin: 0px 10px; vertical-align: middle;"><div style="color: white; font-family: Consolas, Monaco, &quot;Andale Mono&quot;, &quot;Ubuntu Mono&quot;, monospace; text-align: left; white-space: pre; word-spacing: normal; word-break: normal; overflow-wrap: normal; line-height: 1.5; font-size: 13px; tab-size: 4; hyphens: none; padding: 5px; margin: 0px; overflow: auto; background: rgb(1, 22, 39);"><code style="color: rgb(214, 222, 235); font-family: Consolas, Monaco, &quot;Andale Mono&quot;, &quot;Ubuntu Mono&quot;, monospace; text-align: left; white-space: pre-wrap; word-spacing: normal; word-break: normal; overflow-wrap: normal; line-height: 1.5; font-size: 1em; tab-size: 4; hyphens: none;">$1</code></div></div>');
const formattedBackticks_tilde = formattedBackticks_3.replace(/~~~([^`]*)~~~/g, '<div style="display: inline-block; margin: 0px 10px; vertical-align: middle;"><div style="color: white; font-family: Consolas, Monaco, &quot;Andale Mono&quot;, &quot;Ubuntu Mono&quot;, monospace; text-align: left; white-space: pre; word-spacing: normal; word-break: normal; overflow-wrap: normal; line-height: 1.5; font-size: 13px; tab-size: 4; hyphens: none; padding: 5px; margin: 0px; overflow: auto; background: rgb(1, 22, 39);"><code style="color: rgb(214, 222, 235); font-family: Consolas, Monaco, &quot;Andale Mono&quot;, &quot;Ubuntu Mono&quot;, monospace; text-align: left; white-space: pre-wrap; word-spacing: normal; word-break: normal; overflow-wrap: normal; line-height: 1.5; font-size: 1em; tab-size: 4; hyphens: none;">$1</code></div></div>');

const formattedBackticks_1 = formattedBackticks_tilde.replace(/`(?!`)(.*?)`/g, '<div style="display: inline-block; margin: 0px 10px; vertical-align: middle;"><div style="color: white; font-family: Consolas, Monaco, &quot;Andale Mono&quot;, &quot;Ubuntu Mono&quot;, monospace; text-align: left; white-space: pre; word-spacing: normal; word-break: normal; overflow-wrap: normal; line-height: 1.5; font-size: 13px; tab-size: 4; hyphens: none; padding: 5px; margin: 0px; overflow: auto; background: rgb(1, 22, 39);"><code style="color: rgb(214, 222, 235); font-family: Consolas, Monaco, &quot;Andale Mono&quot;, &quot;Ubuntu Mono&quot;, monospace; text-align: left; white-space: pre-wrap; word-spacing: normal; word-break: normal; overflow-wrap: normal; line-height: 1.5; font-size: 1em; tab-size: 4; hyphens: none;">$1</code></div></div>');

// Set the final formatted content as innerHTML
contentElement.innerHTML = formattedBackticks_1;

        contentContainer.appendChild(numberElement); // Append number element to container
        contentContainer.appendChild(contentElement); // Append content element to container


        contentContainer.addEventListener('click', (event) => {
            if (event.button === 0) {
                simulateArrowKeyPress(candidateNumber); // Call the function to simulate arrow key press
            }
        });

        contentContainer.addEventListener('dblclick', (event) => {
            if (isGreen) {
                contentContainer.style.backgroundColor = ''; // Reset to default color
            } else {
                contentContainer.style.backgroundColor = 'green';
            }
            isGreen = !isGreen; // Toggle the flag
        });

        swipes.appendChild(contentContainer); // Append the container to the swipes

        // Add a horizontal line after each content (except for the last one)
        if (index < intercepted_data_object_swipes.rawContents.length - 1) {
            const divider = document.createElement('hr');
            swipes.appendChild(divider);
        }
    });
} else {
    const errorMessage = document.createElement('p');
    errorMessage.textContent = "No raw contents available.";
    swipes.appendChild(errorMessage);
}

// Function to simulate ArrowRight key press
function simulateArrowKeyPress(steps) {
    for (let step = 0; step < 50; step++) {
        ArrowLeftKeyDown();
    }
    for (let step = 0; step < steps - 1; step++) {
        ArrowRightKeyDown();
    }
}

// Your existing ArrowRightKeyDown function
function ArrowRightKeyDown() {
    document.body.dispatchEvent(
        new KeyboardEvent('keydown', {
            bubbles: true,
            key: 'ArrowRight',
        })
    );
    console.log("Arrow right pressed");
}

// Your existing ArrowLeftKeyDown function
function ArrowLeftKeyDown() {
    document.body.dispatchEvent(
        new KeyboardEvent('keydown', {
            bubbles: true,
            key: 'ArrowLeft',
        })
    );
    console.log("Arrow left pressed");
}

NeoPanelSwipes.appendChild(swipes);



}



                XHR_interception_resolve(intercepted_data_object_swipes);
            });
        }
        original_prototype_open.apply(this, [method, url, async]);
    };

    let XHR_interception_resolve;
    const XHR_interception_promise = new Promise(function(resolve, reject) {
        XHR_interception_resolve = resolve;
    });

    XHR_interception_promise.then(function() {
        console.log("Intercepted Data:", intercepted_data_object_swipes);

    });



function createToggleButton_NeoPanelSwipes() {
    const toggleButton_NeoPanelSwipes = document.createElement('button');
    toggleButton_NeoPanelSwipes.textContent = 'Swipe List';
    toggleButton_NeoPanelSwipes.style.position = 'fixed';
    toggleButton_NeoPanelSwipes.style.bottom = '0px';
    toggleButton_NeoPanelSwipes.style.right = '0%';
    toggleButton_NeoPanelSwipes.style.backgroundColor = '#3E4040';
    toggleButton_NeoPanelSwipes.style.color = 'white';
    toggleButton_NeoPanelSwipes.style.fontWeight = 'bold';
    toggleButton_NeoPanelSwipes.style.padding = '4px';
    toggleButton_NeoPanelSwipes.style.margin = '0px';
    toggleButton_NeoPanelSwipes.style.width = '15%';
    toggleButton_NeoPanelSwipes.style.border = 'none';
    toggleButton_NeoPanelSwipes.style.borderRadius = '0px';
    toggleButton_NeoPanelSwipes.style.cursor = 'pointer';
    toggleButton_NeoPanelSwipes.style.userSelect = 'none';
    toggleButton_NeoPanelSwipes.style.zIndex = '101';
    toggleButton_NeoPanelSwipes.addEventListener('click', toggleNeoPanelSwipes);

    document.body.appendChild(toggleButton_NeoPanelSwipes);
}

function createNeoPanelSwipes() {
    const NeoPanelSwipes = document.createElement('div');
    NeoPanelSwipes.id = 'NeoPanelSwipes';
    NeoPanelSwipes.style.position = 'fixed';
    NeoPanelSwipes.style.bottom = '32px';
    NeoPanelSwipes.style.right = '0%';
    NeoPanelSwipes.style.width = '15%';
    NeoPanelSwipes.style.height = '100%';
    NeoPanelSwipes.style.backgroundColor = 'white';
    NeoPanelSwipes.style.borderLeft = '1px solid #ccc';
    NeoPanelSwipes.style.padding = '10px';
    NeoPanelSwipes.style.zIndex = '100';
    NeoPanelSwipes.style.resize = 'horizontal';
    NeoPanelSwipes.style.direction = 'rtl';
    NeoPanelSwipes.style.overflow = 'auto';
    // Set the initial display state to 'none'
    NeoPanelSwipes.style.display = 'block';




    // Add longdescription header to the panel
    const swipes_headline = document.createElement('h5');
    swipes_headline.textContent = 'Swipes';
    swipes_headline.style.marginTop = '30px';
    swipes_headline.style.textAlign = 'center';  // Center-align the text
    NeoPanelSwipes.appendChild(swipes_headline);

    // Add a horizontal line (divider)
    const divider_swipes1 = document.createElement('hr');
    NeoPanelSwipes.appendChild(divider_swipes1);

    document.body.appendChild(NeoPanelSwipes);
}

 function toggleNeoPanelSwipes() {
    const NeoPanelSwipes = document.getElementById('NeoPanelSwipes');
    if (NeoPanelSwipes.style.display === 'block') {
        NeoPanelSwipes.style.display = 'none';
    } else {
        NeoPanelSwipes.style.display = 'block';
    }
}

})();