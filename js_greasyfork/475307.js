// ==UserScript==
// @name        c.ai Neo Panel Favorites Panel
// @namespace   c.ai Neo Panel Favorites Panel
// @match       https://*.character.ai/
// @version      1.1
// @license      MIT
// @description  Adds a Favorites Panel on the main page
// @author       vishanka
// @icon         https://i.imgur.com/iH2r80g.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475307/cai%20Neo%20Panel%20Favorites%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/475307/cai%20Neo%20Panel%20Favorites%20Panel.meta.js
// ==/UserScript==


(function() {
    'use strict';


    // Function to add the separator
    function addSeparator() {
        // Check if the separator has already been added
        if (document.getElementById('mySeparator')) {
            return;
        }

        // Create a div element for the separator
        var separator = document.createElement('div');
        separator.style.position = 'relative';
        separator.id = 'mySeparator';
        separator.style.width = '100%';
        separator.style.margin = '16px';
        separator.style.height = '2px';
        separator.style.background = 'rgb(204, 204, 204)';
        separator.style['--darkreader-inline-bgcolor'] = '#3f4141';
        separator.style['--darkreader-inline-bgimage'] = 'none';

        // Find the .navbar-nav element (replace with a more specific selector if needed)
//        var continueChatting_bar = document.querySelector('.pt-3 > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)');
if (window.innerWidth <= 768) {
  var continueChatting_bar = document.querySelector('#discover-page > div > div > div > div:nth-child(1) > div:nth-child(2)');
} else {
  // Use a different selector for larger screens
var continueChatting_bar = document.querySelector('.pt-3 > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)');
}


        if (continueChatting_bar) {
            // Insert the separator before the text panel
            continueChatting_bar.appendChild(separator);
        } else {
            console.error('Element with class "navbar-nav" not found.');
        }
    }

function addFavorites_Headline() {
    // Check if the "Favorites" headline has already been added
    if (document.getElementById('myFavoritesHeadline')) {
        return;
    }

    // Create a div element for the "Favorites" headline
    var favoritesHeadline = document.createElement('div');
    favoritesHeadline.textContent = 'Favorites'; // Set the text content

    // You can style the headline here if needed
    favoritesHeadline.style.fontWeight = '500';
    favoritesHeadline.style.fontSize = '16px';
    favoritesHeadline.style.marginTop = '-5px'; // Adjust the margin as needed
    favoritesHeadline.style.marginBottom = '15px'; // Adjust the margin as needed
    favoritesHeadline.id = 'myFavoritesHeadline'; // Set an ID to check for its existence later

    // Find the parent element where you want to insert the headline
//    var parentElement = document.querySelector('.pt-3 > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)');
if (window.innerWidth <= 768) {
  var parentElement = document.querySelector("#discover-page > div > div > div > div:nth-child(1) > div:nth-child(2)");
} else {
  // Use a different selector for larger screens
var parentElement = document.querySelector('.pt-3 > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)');
}


    if (parentElement) {
        // Append the "Favorites" headline to the parent element
        parentElement.appendChild(favoritesHeadline);
    } else {
        console.error('Parent element not found.');
    }
}


    // Call the addSeparator function initially
addSeparator();
addFavorites_Headline();

    // Function to add the text panel
function addfavoritesPanel() {
    // Check if the text panel has already been added
    if (document.getElementById('myfavoritesPanel')) {
        return;
    }

    // Create a div element for the text panel
    var favoritesPanel = document.createElement('div');
    favoritesPanel.id = 'myfavoritesPanel';
    favoritesPanel.style.position = 'relative';
    favoritesPanel.style.width = '100%'; // Set a fixed width
    favoritesPanel.style.overflowX = 'auto'; // Enable horizontal scrolling

    // Find the .navbar-nav element (replace with a more specific selector if needed)
if (window.innerWidth <= 768) {
  var continueChatting_bar = document.querySelector('#discover-page > div > div > div > div:nth-child(1) > div:nth-child(2)');
} else {
  // Use a different selector for larger screens
var continueChatting_bar = document.querySelector('.pt-3 > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)');
}
    if (continueChatting_bar) {
        // Append the text panel to .navbar-nav
        continueChatting_bar.appendChild(favoritesPanel);

        // Retrieve data from local storage
        var interceptionData = JSON.parse(localStorage.getItem('interception_data_generate_turn'));

        if (interceptionData && Array.isArray(interceptionData)) {
            // Create a container for the columns
            var columnsContainer = document.createElement('div');
            columnsContainer.className = 'columns-container';

            // Set CSS to make columns display from left to right
            columnsContainer.style.display = 'flex';
            columnsContainer.style.flexDirection = 'row';
//            columnsContainer.style.overflow = 'hidden';

            // Create individual columns for each entry in local storage
    // Create individual columns for each entry in local storage
// Reverse the interceptionData array to show the last entry first
interceptionData.reverse();

interceptionData.forEach(function (entry) {
const isDarkMode = document.documentElement.getAttribute('data-darkreader-scheme') === 'dark';

const backgroundColor = isDarkMode ? '#2B2C2D' : '#F3F0F0';
const fontColor = isDarkMode ? '#C8C5BE' : '#262626';
// Create a link (<a>) element for each entry
var link = document.createElement('a');
link.href = `chat2?char=${entry.external_id}`;
link.target = '_blank'; // Open in a new tab
link.style.textDecoration = 'none'; // Remove underlines
link.style.color = fontColor;

// Create a column for each entry
var column = document.createElement('div');
column.className = 'favorite-column';
column.style.width = '180px';
column.style.height = '180px';
column.style.backgroundColor = backgroundColor; // Set the background color based on dark mode
column.style.borderRadius = '10px';
column.style.paddingTop = '12px';

    // Create elements for "name" and "avatar_file_name"
    var nameElement = document.createElement('div');
    var avatarElement = document.createElement('img');
    avatarElement.style.width = '108px';

    // Center the image within the avatar element
    avatarElement.style.display = 'block';
    avatarElement.style.margin = '0 auto'; // Center horizontally
    avatarElement.style.marginBottom = '10px';
    avatarElement.style.borderRadius = '10px';

    nameElement.style.textAlign = 'center';
    nameElement.style.fontWeight = 'bold';
    nameElement.style.fontSize = '14px';
    nameElement.textContent = entry.name;
    if (entry.avatar_file_name) {
        avatarElement.src = `https://characterai.io/i/400/static/avatars/${entry.avatar_file_name}`;
    } else {
        avatarElement.src = 'https://i.imgur.com/G19HeCH.png';
    }

    // Add spacing between the avatar and name elements
    nameElement.style.marginTop = '5px';

    // Append elements to the column
    column.appendChild(avatarElement);
    column.appendChild(nameElement);

    // Add spacing between columns if needed
    column.style.marginRight = '5px';

    // Append the column to the link (<a>) element
    link.appendChild(column);

    // Append the link to the columns container
    columnsContainer.appendChild(link);
});


            // Append the columns container to the favorites panel
            favoritesPanel.appendChild(columnsContainer);

        } else {
            console.error('No valid data found in local storage.');
        }
    } else {
        console.error('Element with class "navbar-nav" not found.');
    }

}



    // Call the addfavoritesPanel function initially
    addfavoritesPanel();

// Create a MutationObserver to check for changes in the DOM
const observer = new MutationObserver(function(mutationsList) {
    for (var mutation of mutationsList) {
        if (mutation.type === 'childList') {
            // If the DOM has changed, call addSeparator and addfavoritesPanel again
            addSeparator();
            addFavorites_Headline();
            addfavoritesPanel();
        }
    }
});

// Observe changes in the entire document's subtree
observer.observe(document, { subtree: true, childList: true });

// Disconnect the observer after 5 seconds
/*setTimeout(function() {
    observer.disconnect();
console.log('Mutation Observer for Favorites disconnected');
}, 5000);
*/

})();