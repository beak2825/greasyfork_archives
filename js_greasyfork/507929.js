// ==UserScript==
// @name         Add Mute User Button to Bluesky Posts Menu
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Add a "MUTE USER" button to each post's options menu on Bluesky and capture parent divs on button click
// @author       JouySandbox, Trevusimon
// @match        https://bsky.app/*
// @grant        none
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/507929/Add%20Mute%20User%20Button%20to%20Bluesky%20Posts%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/507929/Add%20Mute%20User%20Button%20to%20Bluesky%20Posts%20Menu.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let hostApi = 'https://russula.us-west.host.bsky.network'
  let token = null;
  let profileFetched = new Map(); // Set to track fetched profiles
  let DidPlcTarget = null;

  // Function to get the token directly from localStorage
  function getTokenFromLocalStorage() {
    const storedData = localStorage.getItem('BSKY_STORAGE');
    if (storedData) {
      try {
        const localStorageData = JSON.parse(storedData);
        token = localStorageData.session.currentAccount.accessJwt;
      }
      catch (error) {
        console.error('Failed to parse session data', error);
      }
    }
  }

  // Function to extract did:plc from URL
  function extractDidPlc(url) {
    const match = url.match(/did:plc:[^/]+/);
    return match ? match[0] : null;
  }

  function removeButton(buttonLabel) {
    // Find the button by aria-label
    document.querySelectorAll(`[aria-label="${buttonLabel}"]`).forEach(button => {
      // Remove the found button
      button.remove();
    });
  }

  // Function to add the "MUTE USER" button in the menu before "Mute thread"
  function addMuteButton() {
    document.querySelectorAll('[data-testid="postDropdownMuteThreadBtn"]')
    .forEach(muteThreadBtn => {
      if (!muteThreadBtn.parentNode.querySelector('.mute-user-button') && !profileFetched.get(
        DidPlcTarget)) {
        // Create the MUTE USER button div with the same style as the menu
        let muteButton = document.createElement('div');
        muteButton.setAttribute('aria-label', 'Mute user');
        muteButton.setAttribute('role', 'menuitem');
        muteButton.setAttribute('tabindex', '-1');
        muteButton.className = 'css-175oi2r r-1loqt21 r-1otgn73 mute-user-button';
        muteButton.style.flexDirection = 'row';
        muteButton.style.alignItems = 'center';
        muteButton.style.gap = '16px';
        muteButton.style.padding = '8px 10px';
        muteButton.style.borderRadius = '4px';
        muteButton.style.minHeight = '32px';
        muteButton.style.outline = '0px';
        muteButton.style.cursor = 'pointer';
        muteButton.style.transition = 'background-color 0.2s ease';

        // Add hover (highlight) on mouse over
        muteButton.onmouseover = function () {
          muteButton.style.backgroundColor = 'rgba(29, 161, 242, 0.1)';
        };
        muteButton.onmouseout = function () {
          muteButton.style.backgroundColor = '';
        };

        // Add the text "Mute User"
        let buttonText = document.createElement('div');
        buttonText.className = 'css-146c3p1';
        buttonText.style.fontSize = '14px';
        buttonText.style.letterSpacing = '0.25px';
        buttonText.style.color = 'rgb(215, 221, 228)';
        buttonText.style.flex = '1 1 0%';
        buttonText.style.fontWeight = '600';
        buttonText.style.lineHeight = '14px';
        buttonText.textContent = 'Mute User';

        // Add the emoji
        let buttonIcon = document.createElement('div');
        buttonIcon.className = 'css-175oi2r';
        buttonIcon.style.marginRight = '-2px';
        buttonIcon.style.marginLeft = '12px';
        buttonIcon.textContent = '☠️';  // Adding the emoji here

        // Add the button to the DOM before "Mute thread"
        muteButton.appendChild(buttonText);
        muteButton.appendChild(buttonIcon);
        muteThreadBtn.parentNode.insertBefore(muteButton, muteThreadBtn);

        // Function when clicking the MUTE USER button
        muteButton.onclick = () => {
          let post = muteThreadBtn.closest('.post-class'); // Adjust selector to find the post
          // let userId = post.getAttribute('data-user-id'); // Adjust to get the user ID correctly
          muteUser(DidPlcTarget);
        };
      }
    });
  }

  function addUnmuteButton() {
    document.querySelectorAll('[data-testid="postDropdownMuteThreadBtn"]')
    .forEach(muteThreadBtn => {
      if (!muteThreadBtn.parentNode.querySelector('.unmute-user-button') && profileFetched.get(DidPlcTarget)) {
        // Create the UNMUTE USER button div with the same style as the menu
        let unmuteButton = document.createElement('div');
        unmuteButton.setAttribute('aria-label', 'Unmute User');
        unmuteButton.setAttribute('role', 'menuitem');
        unmuteButton.setAttribute('tabindex', '-1');
        unmuteButton.className = 'css-175oi2r r-1loqt21 r-1otgn73 unmute-user-button';
        unmuteButton.style.flexDirection = 'row';
        unmuteButton.style.alignItems = 'center';
        unmuteButton.style.gap = '16px';
        unmuteButton.style.padding = '8px 10px';
        unmuteButton.style.borderRadius = '4px';
        unmuteButton.style.minHeight = '32px';
        unmuteButton.style.outline = '0px';
        unmuteButton.style.cursor = 'pointer';
        unmuteButton.style.transition = 'background-color 0.2s ease';

        // Add hover (highlight) on mouse over
        unmuteButton.onmouseover = function () {
          unmuteButton.style.backgroundColor = 'rgba(29, 161, 242, 0.1)';
        };
        unmuteButton.onmouseout = function () {
          unmuteButton.style.backgroundColor = '';
        };

        // Add the text "Unmute User"
        let buttonText = document.createElement('div');
        buttonText.className = 'css-146c3p1';
        buttonText.style.fontSize = '14px';
        buttonText.style.letterSpacing = '0.25px';
        buttonText.style.color = 'rgb(215, 221, 228)';
        buttonText.style.flex = '1 1 0%';
        buttonText.style.fontWeight = '600';
        buttonText.style.lineHeight = '14px';
        buttonText.textContent = 'Unmute User';

        // Add the emoji
        let buttonIcon = document.createElement('div');
        buttonIcon.className = 'css-175oi2r';
        buttonIcon.style.marginRight = '-2px';
        buttonIcon.style.marginLeft = '12px';
        buttonIcon.textContent = '😃';  // Adding the emoji here

        // Add the button to the DOM before "Mute thread"
        unmuteButton.appendChild(buttonText);
        unmuteButton.appendChild(buttonIcon);
        muteThreadBtn.parentNode.insertBefore(unmuteButton, muteThreadBtn);

        // Function when clicking the UNMUTE USER button
        unmuteButton.onclick = () => {
          let post = muteThreadBtn.closest('.post-class'); // Adjust selector to find the post
          unmuteUser(DidPlcTarget);
        };
      }
    });
  }

  // Function to mute the user
  async function muteUser(userId) {
    if (!token) {
      alert('Failed to get authorization token');
      return;
    }

    try {
      let response = await fetch(
        `${hostApi}/xrpc/app.bsky.graph.muteActor`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            actor: userId // Send the userId as "actor"
          })
        });

      if (response.ok) {
        getUserProfile(userId);
        // Update mute state in profileFetched
        profileFetched.set(userId, true);  // After muting, the user is muted

        // Remove the Mute button and add the Unmute button
        removeButton('Mute User');
        addUnmuteButton();
        alert('User muted successfully ☠️☠️☠️');
      } else {
        alert('Failed to mute user');
      }
    }
    catch (error) {
      console.error('Error muting user:', error);
    }
  }

  // Function to unmute the user
  async function unmuteUser(userId) {
    if (!token) {
      alert('Failed to get authorization token');
      return;
    }

    try {
      let response = await fetch(
        `${hostApi}/xrpc/app.bsky.graph.unmuteActor`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            actor: userId // Send the userId as "actor"
          })
        });

      if (response.ok) {
        await getUserProfile(userId);
        profileFetched.set(userId, false);
        removeButton('Unmute User');
        addMuteButton();
        alert('User unmuted successfully 😃😃😃');
      } else {
        alert('Failed to unmute user');
      }
    }
    catch (error) {
      console.error('Error unmuting user:', error);
    }
  }

  // Função para obter o perfil do usuário
  async function getUserProfile(didPlc) {
    if (!token) {
      alert('Failed to get authorization token');
      return;
    }

    try {
      const encodedDidPlc = encodeURIComponent(didPlc);
      const response = await fetch(`${hostApi}/xrpc/app.bsky.actor.getProfile?actor=${encodedDidPlc}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

      if (response.ok) {
        return await response.json();
      } else {
        console.error('Failed to fetch user profile');
      }
    }
    catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  // Function to add listeners to the dropdown buttons.
  function addDropdownButtonListeners() {
    document.querySelectorAll('[data-testid="postDropdownBtn"]').forEach(button => {
      button.addEventListener('click', async (event) => {
        // Capture the div where the button was clicked
        const divWhereButtonHasBeenClicked = button.closest('div');

        // Capture all parent divs
        const parentDivs = [];
        let selectedElement = divWhereButtonHasBeenClicked;

        while (selectedElement) {
          parentDivs.push(selectedElement);
          selectedElement = selectedElement.parentElement;
        }

        // Show the divs where the button was clicked and its parents
        //console.log('Clicked Div:', divWhereButtonHasBeenClicked);
        // console.log('Parent Divs:', parentDivs);

        // Get the HTML content of the 6th parent div
        const targetDivHtml = parentDivs[5].innerHTML;
        // console.log('Div alvo HTML:', targetDivHtml);

        // Extract did:plc from the HTML content
        const didPlc = extractDidPlc(targetDivHtml);
        // console.log('did:plc:', didPlc);

        // Get the user profile and check if the user is muted
        if (didPlc && !profileFetched.has(didPlc)) {
          let user = await getUserProfile(didPlc);
          profileFetched.set(didPlc, user.viewer.muted);
          if (user.viewer.muted) {
            addUnmuteButton();
          } else {
            addMuteButton();
          }
          DidPlcTarget = didPlc;
        } else if (didPlc && profileFetched.get(didPlc)) {
          DidPlcTarget = didPlc;
          addUnmuteButton();
        } else if (didPlc) {
          DidPlcTarget = didPlc;
          addMuteButton();
        }
      });
    });
  }

  // Capture the token from localStorage
  getTokenFromLocalStorage();

  // Add the MUTE USER button periodically
  setInterval(addMuteButton, 2000);  // Ajuste o intervalo conforme necessário
  setInterval(addUnmuteButton, 2000);  // Ajuste o intervalo conforme necessário

  // Add listeners to the dropdown buttons periodically
  setInterval(addDropdownButtonListeners, 2000);  // Ajuste o intervalo conforme necessário
})();
