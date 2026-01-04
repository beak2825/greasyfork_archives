// ==UserScript==
// @name Nitrotype Race Autotype
// @namespace http://tampermonkey.net/
// @version 1.3
// @description Autotypes the race text on nitrotype.com/race with realistic typing behavior, logs in, and handles breaks
// @author Claude
// @match https://www.nitrotype.com/race
// @match https://www.nitrotype.com/*
// @grant none
// @license mit
// @downloadURL https://update.greasyfork.org/scripts/490777/Nitrotype%20Race%20Autotype.user.js
// @updateURL https://update.greasyfork.org/scripts/490777/Nitrotype%20Race%20Autotype.meta.js
// ==/UserScript==

(function() {
    const findReact = (dom, traverseUp = 0) => {
    const key = Object.keys(dom).find((key) => key.startsWith("__reactFiber$"));
    const domFiber = dom[key];
    if (domFiber == null) return null;

    const getCompFiber = (fiber) => {
        let parentFiber = fiber?.return;
        while (typeof parentFiber?.type == "string") {
            parentFiber = parentFiber?.return;
        }
        return parentFiber;
    };

    let compFiber = getCompFiber(domFiber);
    for (let i = 0; i < traverseUp && compFiber; i++) {
        compFiber = getCompFiber(compFiber);
    }
    return compFiber?.stateNode;
};
'use strict';
    // Define the keyboard layout
const keyLayout = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
    [' ', ',', '.', '!', '?', '"', "'", '-', '/', ':']
];
    if (localStorage.player_token&&localStorage.userdata){
        checkGarageUrl()
    if (window.location.href=="https://www.nitrotype.com/race"){
          handleNitroTypeRace();
    }}
    else {
        const currentTime = new Date();
const hour = currentTime.getHours();
if (hour >= 8 && hour < 22) {

    checkLogin();
} else {
    console.log('Not running script outside of 8am to 10pm hours.');
}
    }




function createGUI() {
  // Create the main container
  const guiContainer = document.createElement('div');
  guiContainer.style.position = 'fixed';
  guiContainer.style.bottom = '20px';
  guiContainer.style.right = '20px';
  guiContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
  guiContainer.style.padding = '20px';
  guiContainer.style.borderRadius = '10px';
  guiContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
  guiContainer.style.zIndex = '9999';

  // Create the username input
  const usernameLabel = document.createElement('label');
  usernameLabel.textContent = 'Username:';
  const usernameInput = document.createElement('input');
  usernameInput.type = 'text';
  usernameInput.id = 'username-input';

  // Create the password input
  const passwordLabel = document.createElement('label');
  passwordLabel.textContent = 'Password:';
  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.id = 'password-input';

  // Create the WPM input
  const wpmLabel = document.createElement('label');
  wpmLabel.textContent = 'Approximate WPM:';
  const wpmInput = document.createElement('input');
  wpmInput.type = 'number';
  wpmInput.id = 'wpm-input';

  // Create the accuracy input
  const accuracyLabel = document.createElement('label');
  accuracyLabel.textContent = 'Approximate Accuracy:';
  const accuracyInput = document.createElement('input');
  accuracyInput.type = 'number';
  accuracyInput.id = 'accuracy-input';

  // Create the submit button
  const submitButton = document.createElement('button');
  submitButton.textContent = 'Submit';
  submitButton.addEventListener('click', handleSubmit);

  // Create the update button


  // Append the elements to the GUI container
  guiContainer.appendChild(usernameLabel);
  guiContainer.appendChild(usernameInput);
  guiContainer.appendChild(passwordLabel);
  guiContainer.appendChild(passwordInput);
  guiContainer.appendChild(wpmLabel);
  guiContainer.appendChild(wpmInput);
  guiContainer.appendChild(accuracyLabel);
  guiContainer.appendChild(accuracyInput);
  guiContainer.appendChild(submitButton);

  // Append the GUI container to the document
  document.body.appendChild(guiContainer);
}

function handleSubmit() {
  const usernameInput = document.getElementById('username-input');
  const passwordInput = document.getElementById('password-input');
  const wpmInput = document.getElementById('wpm-input');
  const accuracyInput = document.getElementById('accuracy-input');

  const userData = {
    username: usernameInput.value,
    password: passwordInput.value,
    wpm: wpmInput.value,
    accuracy: accuracyInput.value
  };

  // Log out the user
    localStorage.clear();
  window.location.href = "https://www.nitrotype.com/login"

  // Store the new user data in localStorage
  localStorage.setItem('userdata', JSON.stringify(userData));

  // Wait for a short delay before logging back in
  setTimeout(() => {
    checkLogin();
  }, 2000);
}
function typeText(text, element, wpm, accuracy) {
    const inputBox = findReact(element);
    if (!inputBox) {
        console.error('Input box not found.');
        return;
    }

    const handlekey = inputBox.handleKeyPress;
    if (typeof handlekey !== 'function') {
        console.error('handleKeyPress function not found.');
        return;
    }

    console.log('Typing text:', text);
    let i = 0;
    let typedText = '';

    const typeNextChar = () => {
        if (i < text.length) {
            const char = text[i].replace("\xa0", " ");
            if (typeof char === 'string' && char.length > 0) {
                const isUppercase = char === char.toUpperCase();
                const charIndex = keyLayout.reduce((index, row, rowIndex) => {
                    const colIndex = row.indexOf(isUppercase ? char : char.toLowerCase());
                    return colIndex !== -1 ? [rowIndex, colIndex] : index;
                }, [-1, -1]);

                if (charIndex[0] !== -1 && charIndex[1] !== -1) {
                    // Calculate the delay based on the provided WPM
                    const delay = (7500 / wpm) * (isUppercase ? 1.2 : 1); // Uppercase letters take slightly longer
                    const errorChance = 1 - accuracy / 100; // Error chance based on the provided accuracy

                    setTimeout(() => {
                        let typedChar;
                        if (Math.random() > errorChance) {
                            typedChar = isUppercase ? char : char.toLowerCase();
                            console.log('Typed:', typedChar);
                            handlekey("character", { keyCode: typedChar.charCodeAt(0), key: typedChar, timeStamp: Date.now(), dead: false });
                            typedText += typedChar;
                            i++;
                            typeNextChar();
                        } else {
                            // Introduce an error
                            const errorType = Math.floor(Math.random() * 4) + 1; // 1: switch, 2: add, 3: delete, 4: wrong
                           if (errorType === 1) {
                                // Switch with adjacent key
                                const switchIndex = [charIndex[0], Math.floor(Math.random() * keyLayout[charIndex[0]].length)];
                                typedChar = keyLayout[switchIndex[0]][switchIndex[1]];
                                console.log('Typed:', typedChar, 'instead of', char);
                                handlekey("character", { keyCode: typedChar.charCodeAt(0), key: typedChar, timeStamp: Date.now(), dead: false });
                                typedText += typedChar;
                                setTimeout(() => {
                                    console.log('Deleted:', typedChar);
                                    handlekey("character", { keyCode: 8, key: 'Backspace', timeStamp: Date.now(), dead: false });
                                    typedText = typedText.slice(0, -1);
                                    setTimeout(() => {
                                        console.log('Typed:', isUppercase ? char : char.toLowerCase());
                                        handlekey("character", { keyCode: (isUppercase ? char : char.toLowerCase()).charCodeAt(0), key: isUppercase ? char : char.toLowerCase(), timeStamp: Date.now(), dead: false });
                                        typedText += isUppercase ? char : char.toLowerCase();
                                        i++;
                                        typeNextChar();
                                    }, 100);
                                }, 100);
                            } else if (errorType === 2) {
                                // Add an extra character
                                const addIndex = [charIndex[0], Math.floor(Math.random() * keyLayout[charIndex[0]].length)];
                                typedChar = keyLayout[addIndex[0]][addIndex[1]];
                                console.log('Typed:', typedChar, 'instead of', char);
                                handlekey("character", { keyCode: typedChar.charCodeAt(0), key: typedChar, timeStamp: Date.now(), dead: false });
                                typedText += typedChar;
                                setTimeout(() => {
                                    console.log('Deleted:', typedChar);
                                    handlekey("character", { keyCode: 8, key: 'Backspace', timeStamp: Date.now(), dead: false });
                                    typedText = typedText.slice(0, -1);
                                    setTimeout(() => {
                                        console.log('Typed:', isUppercase ? char : char.toLowerCase());
                                        handlekey("character", { keyCode: (isUppercase ? char : char.toLowerCase()).charCodeAt(0), key: isUppercase ? char : char.toLowerCase(), timeStamp: Date.now(), dead: false });
                                        typedText += isUppercase ? char : char.toLowerCase();
                                        i++;
                                        typeNextChar();
                                    }, 100);
                                }, 100);
                            } else if (errorType === 3) {
                                // Delete the character
                                if (typedText.length > 0) {
                                    console.log('Deleted:', typedText[typedText.length - 1]);
                                    handlekey("character", { keyCode: 8, key: 'Backspace', timeStamp: Date.now(), dead: false });
                                    typedText = typedText.slice(0, -1);
                                }
                                setTimeout(() => {
                                    console.log('Typed:', isUppercase ? char : char.toLowerCase());
                                    handlekey("character", { keyCode: (isUppercase ? char : char.toLowerCase()).charCodeAt(0), key: isUppercase ? char : char.toLowerCase(), timeStamp: Date.now(), dead: false });
                                    typedText += isUppercase ? char : char.toLowerCase();
                                    i++;
                                    typeNextChar();
                                }, 100);
                            } else if (errorType === 4) {
                                // Type the wrong character
                                const wrongIndex = [Math.floor(Math.random() * keyLayout.length), Math.floor(Math.random() * keyLayout[Math.floor(Math.random() * keyLayout.length)].length)];
                                typedChar = keyLayout[wrongIndex[0]][wrongIndex[1]];
                                console.log('Typed:', typedChar, 'instead of', char);
                                handlekey("character", { keyCode: typedChar.charCodeAt(0), key: typedChar, timeStamp: Date.now(), dead: false });
                                typedText += typedChar;
                                setTimeout(() => {
                                    console.log('Deleted:', typedChar);
                                    handlekey("character", { keyCode: 8, key: 'Backspace', timeStamp: Date.now(), dead: false });
                                    typedText = typedText.slice(0, -1);
                                    setTimeout(() => {
                                        console.log('Typed:', isUppercase ? char : char.toLowerCase());
                                        handlekey("character", { keyCode: (isUppercase ? char : char.toLowerCase()).charCodeAt(0), key: isUppercase ? char : char.toLowerCase(), timeStamp: Date.now(), dead: false });
                                        typedText += isUppercase ? char : char.toLowerCase();
                                        i++;
                                        typeNextChar();
                                    }, 100);
                                }, 100);
                            }
                        }
                    }, delay);
                } else {
                    // Character not found in the keyboard layout, just type it
                    console.log('Typed:', char);
                    handlekey("character", { keyCode: char.charCodeAt(0), key: isUppercase ? char : char.toLowerCase(), timeStamp: Date.now(), dead: false });
                    typedText += isUppercase ? char : char.toLowerCase();
                    i++;
                    typeNextChar();
                }
            } else {
                console.log('Skipping invalid character:', char);
                i++;
                typeNextChar();
            }
        } else {
            console.log('Finished typing the text. Typed:', typedText);
        }
    };

    typeNextChar();
}

// Define the function to find the React component from a DOM element


    async function clickRandomButtons() {
        const rand= Math.random();
        if (rand<0.2){
    const buttonElements = document.querySelectorAll('button, a');
    const randomButtons = Array.from(buttonElements).filter(() => Math.random() < 0.5);

    for (const button of randomButtons) {
        console.log(`Clicking button: ${button.textContent.trim()}`);
        button.click();
        await delay(Math.floor(Math.random() * 1000) + 500); // Random delay between 500-1500ms
    }
        }
}





async function checkLogin() {

  const loginButton = document.querySelector('#username');

  if (loginButton) {
    console.log('Logging in...');

    // Check if userdata is available in localStorage
    const userdata = JSON.parse(localStorage.getItem('userdata'));
    if (userdata) {
      // Use the values from userdata
      const username = userdata.username;
      const password = userdata.password;

      // Fill in the username and password, and click the login button
      const usernameInput = findReact(document.querySelector("#username"));
      for (let i = 0; i < username.length; i++) {
        usernameInput.handleInputChange({ target: { value: username.slice(0, i + 1) } });
        await delay(Math.floor(Math.random() * 500) + 200); // Random delay between 200-700ms
      }

      await delay(Math.floor(Math.random() * 1000) + 500); // Random delay between 500-1500ms

      const passwordInput = findReact(document.querySelector("#password"));
      for (let i = 0; i < password.length; i++) {
        passwordInput.handleInputChange({ target: { value: password.slice(0, i + 1) } });
        await delay(Math.floor(Math.random() * 500) + 200); // Random delay between 200-700ms
        if (Math.random() < 0.1) { // 10% chance of making an error
          passwordInput.handleInputChange({ target: { value: password.slice(0, i) } });
          await delay(Math.floor(Math.random() * 500) + 200); // Random delay between 200-700ms
        }
      }

      await delay(Math.floor(Math.random() * 1000) + 500); // Random delay between 500-1500ms

      const loginButtonElement = document.querySelector("#root > div > div > main > div > section > div.row.row--xl.row--o.well--p.well--xl_p > div > div:nth-child(3) > form > button");
      loginButtonElement.click();

      await delay(5000); // Wait 5 seconds for the login to complete

      checkGarageUrl();
    } else {
      // Show the GUI if userdata is not available
     // createGUI();
    }
  } else {
    // If userdata is not available in localStorage, show the GUI
    //createGUI();
  }
}

    createGUI();
function checkGarageUrl() {
  if (window.location.href != 'https://www.nitrotype.com/race'&&window.location.href != 'https://www.nitrotype.com/login') {
    console.log('Garage page detected, clicking the "Race" button after a random delay...');
    const randomDelay = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000; // 5-10 seconds
    setTimeout(() => {
      document.querySelector('#root > div > header > div > div.header-nav.g.g--f.well.well--t > div.g-b.g-b--2of12 > a').click();
    }, randomDelay);
  } else {
    console.log('Not on the garage page, skipping the click action.');
  }
}

function handleNitroTypeRace() {
  waitForRaceTextContainer();

  // Check every 5 seconds if the race is finished
  setInterval(function() {
    const raceContainer = findReact(document.querySelector('#raceContainer'));

    if (raceContainer && raceContainer['finished']) {
      console.log('Race finished, clicking random buttons...');
      clickRandomButtons();
      setTimeout(function() {
        console.log('Clicking the "Play Again" button...');
        document.querySelector("#raceContainer > div > div.race-results.results-type > div.raceResults.raceResults--default > div.raceResults-footer.row.row--o.row--s.ptxxs.pbxs > div > div.g-b.g-b--3of12.race-results--cta > div > button").click();
      }, Math.floor(Math.random() * 3000) + 2000); // Random delay between 2-5 seconds
    }
  }, 5000);

  // Take random breaks throughout the day
  function takeRandomBreak() {
    const currentTime = new Date();
    const hour = currentTime.getHours();

    if (hour >= 8 && hour < 22) { // 8am to 10pm
      const breakDuration = Math.floor(Math.random() * (7200 - 1800 + 1)) + 1800; // 30 minutes to 2 hours
      const nextBreakDelay = Math.floor(Math.random() * (7200 - 1800 + 1)) + 1800; // 30 minutes to 2 hours

      console.log(`Taking a ${breakDuration / 60} minute break...`);
      setTimeout(function() {
        console.log('Resuming race...');
        waitForRaceTextContainer();
        setTimeout(takeRandomBreak, nextBreakDelay * 1000); // Schedule the next break
      }, breakDuration * 1000);
    } else {
      setTimeout(takeRandomBreak, 3600000); // 1 hour until next check
    }
  }

  // Start the random break cycle
  takeRandomBreak();
}

function waitForRaceTextContainer() {
    const raceTextContainer = document.querySelector('.dash-copy');
    if (raceTextContainer) {
        console.log('Race text container found.');
        const randomDelay = Math.floor(Math.random() * (6000 - 4000 + 1)) + 4000; // 4-6 seconds
        const raceText = raceTextContainer.textContent.trim();
    const userdata = JSON.parse(localStorage.getItem('userdata'));

        setTimeout(() => {
            typeText(raceText, raceTextContainer, userdata.wpm, userdata.accuracy);
        }, randomDelay);
    } else {
        console.log('Race text container not found. Retrying in 1 second...');
        setTimeout(waitForRaceTextContainer, 1000);
    }
}

// Helper function to find the React component from a DOM element

// Helper function to add a delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Check the current time and only run the script between 8am and 10pm

})();