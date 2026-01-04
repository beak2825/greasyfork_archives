// ==UserScript==
// @name Custom Google Homepage with Timer and Guess the Number
// @namespace https://greasyfork.org/users/1129625
// @version 4.0
// @description Customize the Google homepage by adding buttons, a color changer feature, social media buttons, a timer, and a Guess the Number game.
// @match        *://www.google.com/*
// @match        *://www.google.co.uk/*
// @match        *://www.google.ca/*
// @match        *://www.google.fr/*
// @match        *://www.google.de/*
// @match        *://www.google.it/*
// @match        *://www.google.es/*
// @match        *://www.google.se/*
// @match        *://www.google.nl/*
// @match        *://www.google.no/*
// @match        *://www.google.dk/*
// @match        *://www.google.fi/*
// @match        *://www.google.be/*
// @match        *://www.google.ch/*
// @match        *://www.google.at/*
// @match        *://www.google.ru/*
// @match        *://www.google.com.br/*
// @match        *://www.google.com.mx/*
// @match        *://www.google.com.ar/*
// @match        *://www.google.co.jp/*
// @match        *://www.google.co.kr/*
// @match        *://www.google.com.au/*
// @match        *://www.google.com.hk/*
// @match        *://www.google.co.in/*
// @match        *://www.google.co.id/*
// @match        *://www.google.com.sg/*
// @match        *://www.google.com.my/*
// @match        *://www.google.co.th/*
// @match        *://www.google.com.ph/*
// @match        *://www.google.com.vn/*
// @match        *://www.google.com.sa/*
// @match        *://www.google.ae/*
// @match        *://www.google.co.il/*
// @match        *://www.google.com.tr/*
// @match        *://www.google.co.za/*
// @exclude *www.google.com/search?*
// @exclude *www.google.com/maps*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471098/Custom%20Google%20Homepage%20with%20Timer%20and%20Guess%20the%20Number.user.js
// @updateURL https://update.greasyfork.org/scripts/471098/Custom%20Google%20Homepage%20with%20Timer%20and%20Guess%20the%20Number.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ==================== CONFIG ====================
  const COLORS = [
    'blue', 'red', 'green', 'yellow', 'purple', 'orange', 'pink', 'teal', 'gray', 'brown',
    'skyblue', 'cyan', 'magenta', 'lime', 'indigo', 'olive', 'silver', 'maroon', 'navy'
  ];

  const SOCIAL_LINKS = [
    { name: 'YouTube', url: 'https://www.youtube.com' }, // 2005
    { name: 'Twitch', url: 'https://www.twitch.tv' },   // 2011
    { name: 'Discord', url: 'https://www.discord.com/app' }, // 2015
    { name: 'Facebook', url: 'https://www.facebook.com' }, // 2004
    { name: 'Twitter', url: 'https://www.twitter.com' }, // 2006
    { name: 'Instagram', url: 'https://www.instagram.com' }, // 2010
    { name: 'Pinterest', url: 'https://www.pinterest.com' }, // 2010
    { name: 'LinkedIn', url: 'https://www.linkedin.com' }, // 2003
    { name: 'Snapchat', url: 'https://www.snapchat.com' }, // 2011
    { name: 'TikTok', url: 'https://www.tiktok.com' }, // 2016
    { name: 'Reddit', url: 'https://www.reddit.com' } // 2005
  ];

  const FACTS = [
    'The Earth is the third planet from the Sun.',
    'Water covers about 71% of the Earth\'s surface.',
    'The Great Wall of China is visible from space.',
    'The human body is made up of approximately 60% water.',
    'The speed of light is approximately 299,792,458 meters per second.',
    'The largest ocean on Earth is the Pacific Ocean.',
    'The Eiffel Tower is located in Paris, France.',
    'The Statue of Liberty was a gift from France to the United States.',
    'The Mona Lisa was painted by Leonardo da Vinci.',
    'The planet Mars is also known as the "Red Planet".',
    'Mount Everest is the highest mountain in the world.',
    'The Amazon rainforest is the largest tropical rainforest on Earth.',
    'The Nile River is the longest river in the world.',
    'The Taj Mahal is located in Agra, India.',
    'The Great Barrier Reef is the largest coral reef system in the world.',
    'The Colosseum is located in Rome, Italy.',
    'The Sahara Desert is the largest hot desert in the world.',
    'The Sydney Opera House is located in Sydney, Australia.',
    'The polar bear is the largest species of bear.',
    'The moon is approximately 384,400 kilometers away from Earth.',
    'The Statue of Liberty\'s full name is "Liberty Enlightening the World".',
    'The Leaning Tower of Pisa is located in Pisa, Italy.',
    'The pyramids of Giza were built as tombs for the pharaohs.',
    'The Arctic is home to the North Pole.',
    'The Mediterranean Sea is connected to the Atlantic Ocean.',
    'The Galapagos Islands are located in the Pacific Ocean.',
    'The Golden Gate Bridge is located in San Francisco, California.',
    'The kangaroo is a marsupial native to Australia.',
    'The Vatican City is the smallest independent state in the world.',
    'The Red Sea is known for its diverse marine life.',
    'The Hollywood sign is located in Los Angeles, California.',
  ];

  // Common styles
  const STYLES = {
    button: 'margin-right: 10px; cursor: pointer;',
    container: 'position: fixed; background-color: #fff; padding: 10px; border-radius: 5px; font-size: 18px; font-weight: bold; z-index: 9999;',
  };

  // ==================== STATE VARIABLES ====================
  let timerInterval = null;
  let startTime = 0;
  let randomNumber = Math.floor(Math.random() * 101);
  let remainingAttempts = 6;

  // ==================== UTILITY FUNCTIONS ====================

  // Create an element with attributes and styles
  function createElement(tag, attributes = {}, styles = {}) {
    const element = document.createElement(tag);

    // Set attributes
    for (const [key, value] of Object.entries(attributes)) {
      if (key === 'textContent') {
        element.textContent = value;
      } else if (key === 'innerHTML') {
        element.innerHTML = value;
      } else {
        element.setAttribute(key, value);
      }
    }

    // Set styles
    for (const [key, value] of Object.entries(styles)) {
      element.style[key] = value;
    }

    return element;
  }

  // Apply styles to an element
  function applyStyles(element, stylesString) {
    const styles = stylesString.split(';').filter(style => style.trim());
    for (const style of styles) {
      const [property, value] = style.split(':').map(part => part.trim());
      if (property && value) {
        // Convert kebab-case to camelCase for style properties
        const camelProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        element.style[camelProperty] = value;
      }
    }
  }

  // Create a button element
  function createButton(text, url = null, onClick = null) {
    const button = createElement(url ? 'a' : 'button', { textContent: text });
    applyStyles(button, STYLES.button);

    if (url) {
      button.href = url;
    }

    if (onClick) {
      button.addEventListener('click', onClick);
    }

    return button;
  }

  // Get fact of the day
  function getFactOfTheDay() {
    const day = new Date().getDate();
    const factIndex = (day - 1) % FACTS.length;
    return FACTS[factIndex];
  }

  // Show a temporary popup message
  function showPopup(message, duration = 2000) {
    const popup = createElement('div', { textContent: message });
    applyStyles(popup, STYLES.container + 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);');

    document.body.appendChild(popup);

    setTimeout(() => {
      document.body.removeChild(popup);
    }, duration);
  }

  // ==================== BUTTON CREATION FUNCTIONS ====================

  // Create color changer button
  function createColorChangerButton() {
    return createButton('Change Color', null, () => {
      const options = COLORS.map((color, index) => `${index + 1}. ${color.charAt(0).toUpperCase() + color.slice(1)}`).join('\n');
      const color = prompt(`Select a color:\n${options}\n20. Custom Color`);

      if (color !== null) {
        if (color >= 1 && color <= 19) {
          document.body.style.backgroundColor = COLORS[color - 1];
        } else if (color == 20) {
          const customColor = prompt("Enter a custom color (HEX or RGB):");
          if (customColor !== null) {
            document.body.style.backgroundColor = customColor;
          }
        } else {
          alert("Invalid selection. Please choose a valid option.");
        }
      }
    });
  }

  // Create button with color wheel
  function createButtonWithColorWheel(text, url) {
    const container = createElement('div');
    applyStyles(container, 'display: flex; align-items: center;');

    const button = createButton(text, url);

    const colorWheelContainer = createElement('div');
    applyStyles(colorWheelContainer, 'margin-right: 10px;');

    const colorWheel = createElement('input', { type: 'color' });
    applyStyles(colorWheel, 'cursor: pointer;');
    colorWheel.addEventListener('input', (event) => {
      document.body.style.backgroundColor = event.target.value;
    });

    colorWheelContainer.appendChild(colorWheel);
    container.appendChild(button);
    container.appendChild(colorWheelContainer);

    return { container, colorWheelContainer };
  }

  // Create random number button
  function createRandomNumberButton() {
    return createButton('Random Number', null, () => {
      const randomNumber = Math.floor(Math.random() * 101);
      alert('Random Number: ' + randomNumber);
    });
  }

  // Create new fact button
  function createNewFactButton() {
    return createButton('New Fact', null, () => {
      alert('Fact of the Day: ' + getFactOfTheDay());
    });
  }

  // ==================== TIMER FUNCTIONS ====================

  // Create timer element
  function createTimerElement() {
    const timerElement = createElement('div', { textContent: '00:00:00' });
    applyStyles(timerElement, STYLES.container + 'top: 50%; left: 10px; transform: translateY(-50%);');
    return timerElement;
  }

  // Create timer controls
  function createTimerControls(timerElement) {
    const startButton = createButton('Start', null, () => startTimer(timerElement));
    const pauseButton = createButton('Pause', null, () => pauseTimer());
    const resetButton = createButton('Reset', null, () => resetTimer(timerElement));

    // Position buttons
    applyStyles(startButton, 'position: absolute; left: 32px; top: 312px;');
    applyStyles(pauseButton, 'position: absolute; left: 72px; top: 312px;');
    applyStyles(resetButton, 'position: absolute; left: 122px; top: 312px;');

    return { startButton, pauseButton, resetButton };
  }

  // Update timer display
  function updateTimer(timerElement) {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;

    const hours = Math.floor(elapsedTime / (1000 * 60 * 60)).toString().padStart(2, '0');
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000).toString().padStart(2, '0');

    timerElement.textContent = `${hours}:${minutes}:${seconds}`;
  }

  // Start the timer
  function startTimer(timerElement) {
    if (!timerInterval) {
      startTime = new Date().getTime();
      timerInterval = setInterval(() => updateTimer(timerElement), 1000);
    }
  }

  // Pause the timer
  function pauseTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  // Reset the timer
  function resetTimer(timerElement) {
    pauseTimer();
    timerElement.textContent = '00:00:00';
  }

  // ==================== GUESS THE NUMBER GAME FUNCTIONS ====================

  // Create guess the number game
  function createGuessTheNumberGame() {
    const container = createElement('div');
    applyStyles(container, STYLES.container + 'top: 50%; left: 1165px; transform: translateY(-50%);');

    container.appendChild(createElement('p', { textContent: 'Guess the Number (0-100)' }));

    const attemptsLabel = createElement('p', { textContent: 'Attempts left: ' + remainingAttempts });
    container.appendChild(attemptsLabel);

    const inputField = createElement('input', { type: 'number' });
    container.appendChild(inputField);

    const submitButton = createButton('Submit Guess', null, () => {
      checkGuess(parseInt(inputField.value), container, attemptsLabel, historyContainer);
    });
    applyStyles(submitButton, 'margin-top: 5px;');
    container.appendChild(submitButton);

    // Create guess history container
    const historyContainer = createElement('div', { textContent: 'Guess History:\n' });
    applyStyles(historyContainer, STYLES.container + 'top: 50%; left: 1100px; transform: translateY(-50%);');

    return { gameContainer: container, historyContainer };
  }

  // Check user's guess
  function checkGuess(guess, gameContainer, attemptsLabel, historyContainer) {
    if (remainingAttempts <= 0) return;

    if (isNaN(guess) || guess < 0 || guess > 100) {
      showPopup('Please enter a valid number between 0 and 100.');
      return;
    }

    remainingAttempts--;
    attemptsLabel.textContent = 'Attempts left: ' + remainingAttempts;

    // Add to guess history
    historyContainer.textContent += guess + ', ';

    if (guess === randomNumber) {
      showPopup('Congratulations! You guessed the correct number.');
      gameContainer.style.display = 'none';
    } else if (remainingAttempts === 0) {
      showPopup('Game Over. The correct number was: ' + randomNumber);
      gameContainer.style.display = 'none';
    } else if (guess < randomNumber) {
      showPopup(`Higher (Attempts left: ${remainingAttempts})`);
    } else {
      showPopup(`Lower (Attempts left: ${remainingAttempts})`);
    }
  }

  // ==================== MAIN INITIALIZATION ====================

  function init() {
    // Replace Google buttons with custom buttons
    const appsButton = document.querySelector('a.gb_d');
    if (appsButton) {
      appsButton.parentNode.replaceChild(createColorChangerButton(), appsButton);
    }

    const aboutButton = document.querySelector('a[href*="about.google"]');
    if (aboutButton) {
      aboutButton.parentNode.replaceChild(createButton('YouTube', 'https://www.youtube.com'), aboutButton);
    }

    const storeButton = document.querySelector('a[href*="store.google.com"]');
    if (storeButton) {
      const { container } = createButtonWithColorWheel('Twitch', 'https://www.twitch.tv');
      storeButton.parentNode.replaceChild(container, storeButton);
    }

    const imagesButton = document.querySelector('a[href*="google.com/imghp"]');
    if (imagesButton) {
      imagesButton.parentNode.replaceChild(createButton('Discord', 'https://www.discord.com/app'), imagesButton);
    }

    // Add social media buttons
    const colorWheelContainer = document.querySelector('div[style="margin-right: 10px;"]');
    if (colorWheelContainer) {
      let previousElement = colorWheelContainer;

      // Social media buttons in chronological release order (skipping ones we already added)
      const chronologicalSocials = [
        'LinkedIn', 'Facebook', 'Reddit', 'Twitter', 'Instagram', 'Pinterest',
        'Snapchat', 'TikTok'
      ];

      // Add social media buttons after the color wheel container
      for (const socialName of chronologicalSocials) {
        const social = SOCIAL_LINKS.find(s => s.name === socialName);
        if (social) {
          const button = createButton(social.name, social.url);
          previousElement.parentNode.insertBefore(button, previousElement.nextSibling);
          previousElement = button;
        }
      }

      // Add utility buttons
      const randomButton = createRandomNumberButton();
      previousElement.parentNode.insertBefore(randomButton, previousElement.nextSibling);
      previousElement = randomButton;

      const factButton = createNewFactButton();
      previousElement.parentNode.insertBefore(factButton, previousElement.nextSibling);
    }

    // Create and add timer
    const timerElement = createTimerElement();
    document.body.appendChild(timerElement);

    // Create timer controls
    const { startButton, pauseButton, resetButton } = createTimerControls(timerElement);
    document.body.appendChild(startButton);
    document.body.appendChild(pauseButton);
    document.body.appendChild(resetButton);

    // Create and add guess the number game
    const { gameContainer, historyContainer } = createGuessTheNumberGame();
    document.body.appendChild(gameContainer);
    document.body.appendChild(historyContainer);

    // Remove unwanted div
    const unwantedDiv = document.querySelector('div.KxwPGc.SSwjIe');
    if (unwantedDiv) {
      unwantedDiv.remove();
    }

    // Make timer stay in position during scrolling
    window.addEventListener('scroll', () => {
      const topOffset = 10;
      timerElement.style.top = `calc(50% + ${topOffset}px - ${window.scrollY}px)`;
    });
  }

  // Initialize everything
  init();
})();