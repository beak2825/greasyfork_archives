// ==UserScript==
// @name         TaffyLunaRed
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Sorts matchat rooms by the number of users and displays the total user count in the upper right corner of the page in a box.
// @author       You
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493760/TaffyLunaRed.user.js
// @updateURL https://update.greasyfork.org/scripts/493760/TaffyLunaRed.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Helper function to parse the data from the webpage into a JSON object
  function parseRawData(rawData) {
    try {
      return JSON.parse(rawData);
    } catch (error) {
      console.error('Error parsing JSON data:', error);
      return null;
    }
  }

  // Helper function to create and display the total user count box
  function displayTotalUserCount(totalUsers) {
    const totalCountBox = document.createElement('div');
    totalCountBox.textContent = `Total Losers Online: ${totalUsers}`;
    totalCountBox.style.position = 'fixed';
    totalCountBox.style.top = '20px';
    totalCountBox.style.right = '20px';
    totalCountBox.style.backgroundColor = '#f1f1f1';
    totalCountBox.style.padding = '10px';
    totalCountBox.style.border = '1px solid #ddd';
    totalCountBox.style.zIndex = '9999';
    totalCountBox.style.textAlign = 'center'; // Center the text
    document.body.appendChild(totalCountBox);
  }

 // Helper function to create a scrollable box for a room's user list
function createScrollableBox(roomData) {
  const roomBoxContainer = document.createElement('div');
  roomBoxContainer.style.maxHeight = '200px'; // Set a fixed height for the container
  roomBoxContainer.style.overflow = 'auto'; // Enable scrolling

  const roomBox = document.createElement('div');
  roomBox.style.backgroundColor = 'black';
  roomBox.style.color = 'pink';
  roomBox.style.padding = '10px';
  roomBox.style.border = '1px solid #ddd';
  roomBox.style.textAlign = 'center'; // Center the text

  const usersList = document.createElement('ul');
  usersList.style.textAlign = 'center'; // Center the text

  const sortedUsers = roomData.users.sort((a, b) => {
    if (a.oper && !b.oper) return -1;
    if (!a.oper && b.oper) return 1;
    if (a.broadcasting && !b.broadcasting) return -1;
    if (!a.broadcasting && b.broadcasting) return 1;
    return 0;
  });

  sortedUsers.forEach((user) => {
    const userItem = document.createElement('li');
    const broadcastingStatus = user.broadcasting ? '📷' : '';
    const broadcastingStatusElement = document.createElement('b');
    broadcastingStatusElement.textContent = broadcastingStatus;
    userItem.textContent = `${user.oper && roomData.room === 'bigchaos951' ? '❤' : '卐'}${user.nick}`;
    userItem.appendChild(broadcastingStatusElement);
    usersList.appendChild(userItem);
  });

  roomBox.appendChild(usersList);
  roomBoxContainer.appendChild(roomBox);

  return roomBoxContainer;
}

  // Helper function to create a hyperlink element
  function createHyperlink(url, text, roomData) {
    const link = document.createElement('a');
    link.href = url;
    link.textContent = text;
    link.style.textAlign = 'center'; // Center the text

    link.addEventListener('click', function (event) {
      event.preventDefault();
      const roomBoxContainer = event.target.parentNode.parentNode.querySelector('div');
      const iframe = roomBoxContainer.querySelector('iframe');
      if (iframe) {
        iframe.src = url;
        iframe.style.display = 'block'; // Show the iframe
      } else {
        const newIframe = document.createElement('iframe');
        newIframe.src = url;
        newIframe.style.width = '100%';
        newIframe.style.height = '100%';
        newIframe.style.display = 'block';
        roomBoxContainer.appendChild(newIframe);
      }
    });

    return link;
  }

  // Main function to handle the userscript logic
  function main() {
    const rawDataElement = document.querySelector('body');
    if (!rawDataElement) {
      console.error('Raw data element not found in the body.');
      return;
    }

    const rawData = rawDataElement.textContent.trim();
    const data = parseRawData(rawData);
    if (!data || !data.rooms) {
      console.error('Invalid data format:', data);
      return;
    }

    const sortedRooms = data.rooms.sort((a, b) => b.total_users - a.total_users);

    // Clear existing content from the body
    document.body.textContent = '';

    // Calculate and display the total user count
    const totalUsers = sortedRooms.reduce((total, room) => total + room.total_users, 0);
    displayTotalUserCount(totalUsers);

    // Display the sorted rooms in a grid layout
    const gridContainer = document.createElement('div');
    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
    gridContainer.style.gridGap = '10px';
    gridContainer.style.marginTop = '50px';
    gridContainer.style.marginLeft = '10px';
    gridContainer.style.marginRight = '10px';

    for (const roomData of sortedRooms) {
      const roomContainer = document.createElement('div');
      roomContainer.style.backgroundColor = 'white';
      roomContainer.style.color = 'black';
      roomContainer.style.padding = '10px';
      roomContainer.style.border = '1px solid #ddd';

      // Create a container for the room name and user count
      const roomHeader = document.createElement('div');
      roomHeader.style.display = 'fixed';
      roomHeader.style.alignItems = 'center';
      roomHeader.style.justifyContent = 'space-between';
      roomHeader.style.marginBottom = '10px';

      const roomName = roomData.room.replace('tinychat^', '');
      const roomLink = `https://tinychat.com/room/${encodeURIComponent(roomName)}`;

      const linkContainer = document.createElement('div');
      linkContainer.style.flexGrow = '0';
      linkContainer.style.textAlign = 'center'; // Center the text
      const roomLinkElement = createHyperlink(roomLink, roomName, roomData);
      linkContainer.appendChild(roomLinkElement);
      roomHeader.appendChild(linkContainer);

      const userCount = document.createElement('span');
      userCount.style.fontWeight = 'bold';
      userCount.textContent = `Users: ${roomData.total_users}`;
      roomHeader.appendChild(userCount);

      roomContainer.appendChild(roomHeader);

      // Create a container for the iframe and the user list
      const contentContainer = document.createElement('div');
      contentContainer.style.textAlign = 'center'; // Center the content

      // Create a scrollable box for the user list
      const roomBox = createScrollableBox(roomData);
      contentContainer.appendChild(roomBox);

      // Create an iframe element
      const iframe = document.createElement('iframe');
      iframe.src = roomLink;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.display = 'none'; // Hide the iframe initially
      contentContainer.appendChild(iframe);
// Set iframes to be inactive until toggled on
const iframes = document.querySelectorAll('iframe');
iframes.forEach((iframe) => {
  iframe.style.pointerEvents = 'none';
  iframe.style.display = 'none';
});

  // Add event listener to toggle iframe visibility
  gridContainer.addEventListener('click', function(event) {
    if (event.target.tagName === 'A') {
      const contentContainer = event.target.parentNode.parentNode.querySelector('div');
      const existingIframe = contentContainer.querySelector('iframe');
      if (existingIframe) {
        existingIframe.remove();
      } else {
        const newIframe = document.createElement('iframe');
        newIframe.src = event.target.href;
        newIframe.style.width = '100%';
        newIframe.style.height = '100%';
        contentContainer.appendChild(newIframe);
      }
    }
  });
      roomContainer.appendChild(contentContainer);
      gridContainer.appendChild(roomContainer);
    }

    document.body.appendChild(gridContainer);
    document.body.style.backgroundColor = 'black';
    document.body.style.backgroundImage = 'url(https://i.imgur.com/CtA7X1R.gif)'; // Set the background image
  }

  // Execute the main function when the page is fully loaded
  window.addEventListener('load', main);
})();