// ==UserScript==
// @name         TinyChat Room Sorter and Total User Count1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Sorts TinyChat rooms by number of users and displays total user count, user search, and watchlist in the upper right corner of the page.
// @author       You
// @match        *://chit.tinychat.com/rooms/popular?signature=0fcdf9b4928c2b92a5fc5bfde14bbe68*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474423/TinyChat%20Room%20Sorter%20and%20Total%20User%20Count1.user.js
// @updateURL https://update.greasyfork.org/scripts/474423/TinyChat%20Room%20Sorter%20and%20Total%20User%20Count1.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const iframeMap = new Map(); // Add iframeMap

  let watchlist = [];

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
    totalCountBox.textContent = `Total Online Users: ${totalUsers}`;
    totalCountBox.style.backgroundColor = '#f1f1f1';
    totalCountBox.style.padding = '10px';
    totalCountBox.style.border = '1px solid #ddd';
    totalCountBox.style.margin = '5px';
    totalCountBox.style.float = 'right';
    totalCountBox.style.clear = 'both';
    document.body.appendChild(totalCountBox);
    return totalCountBox;
  }

  // Helper function to create a scrollable box for a room's user list
  function createScrollableBox(roomData) {
    const roomBox = document.createElement('div');
    roomBox.className = 'user-list'; // Add a class for easy selection
    roomBox.style.backgroundColor = 'white';
    roomBox.style.color = 'black';
    roomBox.style.padding = '10px';
    roomBox.style.border = '1px solid #ddd';
    roomBox.style.overflow = 'auto';
    roomBox.style.maxHeight = '200px';

    const usersList = document.createElement('ul');

    const sortedUsers = roomData.users;

    sortedUsers.forEach((user) => {
      const userItem = createUserListItem(user);
      usersList.appendChild(userItem);
    });

    roomBox.appendChild(usersList);

    return roomBox;
  }

  // Helper function to create a hyperlink element
  function createHyperlink(url, text) {
    const link = document.createElement('a');
    link.href = url;
    link.textContent = text;
    // Add click event to load the room as a webpage when the hyperlink is clicked
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const iframe = iframeMap.get(url);
      if (!iframe) {
        const newIframe = document.createElement('iframe');
        newIframe.src = url;
        newIframe.style.width = '100%';
        newIframe.style.height = '200px'; // Set the desired height for the embedded webpage
        link.parentNode.appendChild(newIframe);
        iframeMap.set(url, newIframe);
      } else {
        iframe.style.display = iframe.style.display === 'none' ? 'block' : 'none';
      }
    });
    return link;
  }

  // Helper function to create the user search box
  function createUserSearchBox(userList) {
    const searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.placeholder = 'Search for users...';
    searchBox.style.margin = '5px';
    searchBox.addEventListener('input', function () {
      const searchTerm = searchBox.value.trim().toLowerCase();
      for (const user of userList.children) {
        if (user.textContent.toLowerCase().includes(searchTerm)) {
          user.style.display = 'block';
        } else {
          user.style.display = 'none';
        }
      }
    });
    return searchBox;
  }

  // Helper function to create the watchlist box
  function createWatchlistBox() {
    const watchlistBox = document.createElement('div');
    watchlistBox.className = 'watchlist';
    watchlistBox.style.backgroundColor = '#f1f1f1';
    watchlistBox.style.padding = '10px';
    watchlistBox.style.border = '1px solid #ddd';
    watchlistBox.style.margin = '5px';
    watchlistBox.style.float = 'right';
    watchlistBox.style.clear = 'both';

    const watchlistTitle = document.createElement('div');
    watchlistTitle.textContent = 'Watchlist';
    watchlistTitle.style.fontWeight = 'bold';
    watchlistBox.appendChild(watchlistTitle);

    const watchlistUsers = document.createElement('ul');
    watchlistBox.appendChild(watchlistUsers);

    return { box: watchlistBox, usersList: watchlistUsers };
  }

  // Function to add a user to the watchlist
  function addToWatchlist(user) {
    if (!watchlist.some((u) => u.nick === user.nick)) {
      watchlist.push(user);
      const watchlistUsers = document.querySelector('.watchlist ul');
      const userItem = createUserListItem(user);
      watchlistUsers.appendChild(userItem);
      moveUserToTop(user);
    }
  }

  // Function to remove a user from the watchlist
  function removeFromWatchlist(user) {
    watchlist = watchlist.filter((u) => u.nick !== user.nick);
    const watchlistUsers = document.querySelector('.watchlist ul');
    const userItems = watchlistUsers.querySelectorAll('li');
    for (const userItem of userItems) {
      if (userItem.textContent === `${user.nick}`) {
        watchlistUsers.removeChild(userItem);
        break;
      }
    }
  }

  // Helper function to create a user list item
  function createUserListItem(user) {
    const userItem = document.createElement('li');
    userItem.textContent = `${user.nick}`;

    // Add heart button
    const heartButton = document.createElement('span');
    heartButton.textContent = watchlist.some((u) => u.nick === user.nick) ? ' ❤️' : ' ♡';
    heartButton.style.cursor = 'pointer';
    heartButton.style.marginLeft = '5px';
    heartButton.addEventListener('click', function () {
      if (heartButton.textContent === ' ♡') {
        heartButton.textContent = ' ❤️';
        addToWatchlist(user);
      } else {
        heartButton.textContent = ' ♡';
        removeFromWatchlist(user);
      }
    });
    userItem.appendChild(heartButton);

    return userItem;
  }

  // Function to move a user to the top of the room list
  function moveUserToTop(user) {
    const allRoomLists = document.querySelectorAll('.user-list');
    for (const roomList of allRoomLists) {
      const userItems = roomList.querySelectorAll('li');
      for (const userItem of userItems) {
        if (userItem.textContent === `${user.nick}`) {
          if (userItem.classList.contains('highlighted')) {
            // Already highlighted, move it to the top
            roomList.insertBefore(userItem, roomList.firstChild);
          } else {
            // Not highlighted yet, add the class and move it to the top
            userItem.classList.add('highlighted');
            roomList.insertBefore(userItem, roomList.firstChild);
          }
          break;
        }
      }
    }
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
    const totalCountBox = displayTotalUserCount(totalUsers);

    // Create the user search box
    const allUserList = [];
    for (const roomData of sortedRooms) {
      for (const user of roomData.users) {
        allUserList.push(user);
      }
    }
    const searchBox = createUserSearchBox(totalCountBox);
    totalCountBox.appendChild(searchBox);

    // Create the watchlist box
    const { box: watchlistBox, usersList: watchlistUsers } = createWatchlistBox();
    totalCountBox.appendChild(watchlistBox);

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
      roomContainer.className = 'user-list'; // Add a class for easy selection
      roomContainer.style.backgroundColor = 'white';
      roomContainer.style.color = 'black';
      roomContainer.style.padding = '10px';
      roomContainer.style.border = '1px solid #ddd';
      roomContainer.style.overflow = 'auto';
      roomContainer.style.maxHeight = '200px';

      // Create a container for the room name
      const roomNameContainer = document.createElement('div');
      roomNameContainer.style.backgroundColor = 'white';
      roomNameContainer.style.color = 'black';
      roomNameContainer.style.textAlign = 'center';
      roomNameContainer.style.marginBottom = '10px';
      const roomName = roomData.room.replace('tinychat^', '');
      const roomLink = `https://tinychat.com/room/${encodeURIComponent(roomName)}`;
      const roomLinkElement = createHyperlink(roomLink, roomName);
      roomNameContainer.appendChild(roomLinkElement);
      roomContainer.appendChild(roomNameContainer);

      // Create a scrollable box for the user list
      const roomBox = createScrollableBox(roomData);
      roomContainer.appendChild(roomBox);

      gridContainer.appendChild(roomContainer);
    }

    document.body.appendChild(gridContainer);
    document.body.style.backgroundColor = 'black';
  }

  // Execute the main function when the page is fully loaded
  window.addEventListener('load', main);
})();
