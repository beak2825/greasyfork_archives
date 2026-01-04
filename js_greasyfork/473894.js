// ==UserScript==
// @name         c.ai Neo panel Followers_Test_Mobile
// @namespace    c.ai Neo panel Followers
// @version      1.5
// @description  A Followers Panel that you can view in your profile section and that will show your Followers
// @author       Vishanka
// @license      MIT
// @match        https://*.character.ai/*
// @icon         https://i.imgur.com/iH2r80g.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473894/cai%20Neo%20panel%20Followers_Test_Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/473894/cai%20Neo%20panel%20Followers_Test_Mobile.meta.js
// ==/UserScript==


(function () {
    'use strict';

    var original_prototype_open = XMLHttpRequest.prototype.open;
    const intercepted_data_object_followers = {};
    const intercepted_data_object_following = {};

XMLHttpRequest.prototype.open = function (method, url, async) {
    if (
        url.startsWith('https://plus.character.ai/chat/user/followers/') ||
        url.startsWith('https://beta.character.ai/chat/user/followers/')
    ) {
        this.addEventListener('load', function () {
            let info = JSON.parse(this.responseText);
            intercepted_data_object_followers.followers = info.followers;
            console.log("followers:", intercepted_data_object_followers.followers);
        });
    } else if (
        url.startsWith('https://plus.character.ai/chat/user/following/') ||
        url.startsWith('https://beta.character.ai/chat/user/following/')
    ) {
        this.addEventListener('load', function () {
            let info = JSON.parse(this.responseText);
            intercepted_data_object_following.following = info.following;
            console.log("following:", intercepted_data_object_following.following);

        });
    }

    // Call the original open function
    original_prototype_open.apply(this, [method, url, async]);
};

    let XHR_interception_resolve;
    const XHR_interception_promise = new Promise(function (resolve, reject) {
        XHR_interception_resolve = resolve;
    });





// ====================== NEW TAB CONTENT ================================
function createPanelFollowers(display, data) {
    const panelFollowers = document.createElement('div');
    panelFollowers.style.width = '100%';
    panelFollowers.style.position = 'fixed';
    panelFollowers.style.display = display;
    panelFollowers.style.height = 'calc(100vh - 260px)'; // Adjust for any fixed heights on the page
    panelFollowers.style.overflowY = 'auto'; // Make panel scrollable
    panelFollowers.style.left = '50%';
    panelFollowers.style.transform = 'translateX(-55%)';

    // Hide the scrollbar
    panelFollowers.style.webkitOverflowScrolling = 'touch'; // For smooth scrolling on iOS devices
    panelFollowers.style.scrollbarWidth = 'none'; // Firefox
    panelFollowers.style.msOverflowStyle = 'none'; // Internet Explorer and Edge

    // Webkit-based browsers (Chrome, Safari)
    panelFollowers.style.cssText += `
        ::-webkit-scrollbar {
            width: 0;
            background: transparent; /* You can set a background color here if you want */
        }
    `;


    // Media query for screens smaller than 768px (adjust the breakpoint as needed)
    const mediaQuery = window.matchMedia('(max-width: 768px)');

// Function to handle responsive height
function handleResponsiveHeight() {
    if (mediaQuery.matches) {
        // On small screens, set the height to 92% of the viewport height
        panelFollowers.style.height = 'calc(92vh - 260px)'; // Adjust the height as needed
    } else {
        // On larger screens, set the height as before
        panelFollowers.style.height = 'calc(100vh - 260px)';
    }
}
// Initial call to set the height based on screen size
handleResponsiveHeight();

// Add an event listener for changes in screen size
mediaQuery.addListener(handleResponsiveHeight);





    // Add an event listener to disable background scrolling on mouseover
    panelFollowers.addEventListener('mouseover', () => {
        document.body.style.overflow = 'hidden'; // Disable background scrolling
    });

    // Add an event listener to enable background scrolling on mouseout
    panelFollowers.addEventListener('mouseout', () => {
        document.body.style.overflow = 'auto'; // Enable background scrolling
    });

    // Generate the content for the followers list
let content = '<ul style="list-style-type: none; display: flex; flex-direction: column; justify-content: center; align-items: center;">'; // Center vertically

// Check if the page is in dark mode
const isDarkMode = document.documentElement.getAttribute('data-darkreader-scheme') === 'dark';

if (data.followers && data.followers.length > 0) {
    for (let i = 0; i < data.followers.length; i++) {
        const followerItem = data.followers[i];
        const followerURL = `https://plus.character.ai/public-profile/?username=${encodeURIComponent(followerItem)}`;

        // Apply different font color based on dark mode
        const fontColor = isDarkMode ? '#C8C5BE' : '#262626';
        const boxShadowColor = isDarkMode ? '#161717' : '#C8C5BE';

        // Add a box shadow around each list item with the appropriate color
        content += `<li style="margin-top: 10px; margin-bottom: 10px; box-shadow: 0px 0px 5px 0px ${boxShadowColor}; width: 200px; font-size: 17px; text-align: center; border-radius: 6px;">`;
        content += `<a href="${followerURL}" class="follower-link" target="_blank" style="text-decoration: none; color: ${fontColor}; cursor: pointer; display: block;">${followerItem}</a></li>`;
    }
}
 else {
        content += '<li>No followers data available.</li>';
    }
    content += '</ul>';

    // Set the panelFollowers innerHTML with the generated content
    panelFollowers.innerHTML = content;

    return panelFollowers;
}

// ====================== FOLLOWING ================================
function createPanelFollowing(display, data) {
    const panelFollowing = document.createElement('div');
    panelFollowing.style.width = '100%';
    panelFollowing.style.position = 'fixed';
    panelFollowing.style.display = display;
    panelFollowing.style.height = 'calc(100vh - 260px)'; // Adjust for any fixed heights on the page
    panelFollowing.style.overflowY = 'auto'; // Make panel scrollable
    panelFollowing.style.left = '50%';
    panelFollowing.style.transform = 'translateX(-55%)';


    // Hide the scrollbar
    panelFollowing.style.webkitOverflowScrolling = 'touch'; // For smooth scrolling on iOS devices
    panelFollowing.style.scrollbarWidth = 'none'; // Firefox
    panelFollowing.style.msOverflowStyle = 'none'; // Internet Explorer and Edge

    // Webkit-based browsers (Chrome, Safari)
    panelFollowing.style.cssText += `
        ::-webkit-scrollbar {
            width: 0;
            background: transparent; /* You can set a background color here if you want */
        }
    `;

    // Media query for screens smaller than 768px (adjust the breakpoint as needed)
    const mediaQuery = window.matchMedia('(max-width: 768px)');
// Function to handle responsive height
function handleResponsiveHeight() {
    if (mediaQuery.matches) {
        // On small screens, set the height to 92% of the viewport height
        panelFollowing.style.height = 'calc(92vh - 260px)'; // Adjust the height as needed
    } else {
        // On larger screens, set the height as before
        panelFollowing.style.height = 'calc(100vh - 260px)';
    }
}
// Initial call to set the height based on screen size
handleResponsiveHeight();

// Add an event listener for changes in screen size
mediaQuery.addListener(handleResponsiveHeight);





    // Add an event listener to disable background scrolling on mouseover
    panelFollowing.addEventListener('mouseover', () => {
        document.body.style.overflow = 'hidden'; // Disable background scrolling
    });

    // Add an event listener to enable background scrolling on mouseout
    panelFollowing.addEventListener('mouseout', () => {
        document.body.style.overflow = 'auto'; // Enable background scrolling
    });

    // Generate the content for the followers list
    let content = '<ul style="list-style-type: none; display: flex; flex-direction: column; justify-content: center; align-items: center;">'; // Center vertically
// Check if the page is in dark mode
const isDarkMode = document.documentElement.getAttribute('data-darkreader-scheme') === 'dark';
    if (data.following && data.following.length > 0) {
        for (let i = 0; i < data.following.length; i++) {
            const followingItem = data.following[i];
            const followingURL = `https://plus.character.ai/public-profile/?username=${encodeURIComponent(followingItem)}`;
        // Apply different font color based on dark mode
        const fontColor = isDarkMode ? '#C8C5BE' : '#262626';
        const boxShadowColor = isDarkMode ? '#161717' : '#C8C5BE';
            // Add a black box shadow around each list item
            content += `<li style="margin-top: 10px; margin-bottom: 10px; box-shadow: 0px 0px 5px 0px ${boxShadowColor}; width: 200px; font-size: 17px; text-align: center; border-radius: 6px;">`;
            content += `<a href="${followingURL}" class="follower-link" target="_blank" style="text-decoration: none; color: ${fontColor}; cursor: pointer; display: block;">${followingItem}</a></li>`;
        }
    } else {
        content += '<li>No following data available.</li>';
    }
    content += '</ul>';

    // Set the panelFollowers innerHTML with the generated content
    panelFollowing.innerHTML = content;

    return panelFollowing;
}

// ====================== END FOLLOWING ================================




// ======= FOLLOWERS

// Function to check if the target element exists and make it clickable
let isListGenerated = false;
let panelFollowers; // Declare panelFollowers at a higher scope

function checkAndMakeClickable() {
    const targetElement = document.querySelector("div.col-4:nth-child(2)");
    if (targetElement) {
        targetElement.style.cursor = 'pointer';
        targetElement.addEventListener('click', handleElementClick);
    }

    // Find all elements with the class "active nav-link"
    const activeNavLinks = document.querySelectorAll('.active.nav-link');
    activeNavLinks.forEach(link => {
        link.addEventListener('click', hideListAndButton);
    });

// Find all elements with the class "nav-link"
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', hideListAndButton);
});

}

// ===============END FOLLOWERS

// =============== FOLLOWING

// Function to check if the target element exists and make it clickable
let isListGenerated1 = false;
let panelFollowing; // Declare panelFollowers at a higher scope

function checkAndMakeClickable1() {
    const targetElement1 = document.querySelector("div.col-4:nth-child(1)");
    if (targetElement1) {
        targetElement1.style.cursor = 'pointer';
        targetElement1.addEventListener('click', handleElementClick1);
    }

    // Find all elements with the class "active nav-link"
    const activeNavLinks = document.querySelectorAll('.active.nav-link');
    activeNavLinks.forEach(link => {
        link.addEventListener('click', hideListAndButton);
    });

// Find all elements with the class "nav-link"
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', hideListAndButton);
});

}


// ============ END FOLLOWING


// Add an event listener for the target element inside your handleElementClick function
function handleElementClick() {
    // Find the div.col-12.profile-characters element and hide it
    const profileCharacters = document.querySelector('div.tab-pane.active');

    // Hide the div.col-12.profile-characters element
    if (profileCharacters) {
        profileCharacters.style.display = 'none';
    }

if (panelFollowing) {
        panelFollowing.style.display = 'none';
        isListGenerated1 = false;
}

    if (!isListGenerated) {
        panelFollowers = createPanelFollowers('block', intercepted_data_object_followers);


        // Find the first element with the class "nav.nav-tabs" in the document
        const targetElement = document.querySelector('.nav.nav-tabs');

        // Add the new panel container below the target element
        if (targetElement) {
            targetElement.insertAdjacentElement('afterend', panelFollowers);
        }

        isListGenerated = true;
    }
}

// =============== FOLLOWING
function handleElementClick1() {
    // Find the div.col-12.profile-characters element and hide it
    const profileCharacters1 = document.querySelector('div.tab-pane.active');

    // Hide the div.col-12.profile-characters element
    if (profileCharacters1) {
        profileCharacters1.style.display = 'none';
    }

if (panelFollowers) {
        panelFollowers.style.display = 'none';
        isListGenerated = false;
}

    if (!isListGenerated1) {
        panelFollowing = createPanelFollowing('block', intercepted_data_object_following);

        // Find the first element with the class "nav.nav-tabs" in the document
        const targetElement1 = document.querySelector('.nav.nav-tabs');

        // Add the new panel container below the target element
        if (targetElement1) {
            targetElement1.insertAdjacentElement('afterend', panelFollowing);
        }

        isListGenerated1 = true;
    }
}
// ============ END FOLLOWING






// Function to hide the list and button
function hideListAndButton() {
    const profileCharacters = document.querySelector('div.tab-pane.active');
    if (panelFollowers) {
        profileCharacters.style.display = 'block';
        panelFollowers.style.display = 'none';
        panelFollowing.style.display = 'none';
        isListGenerated = false;
        isListGenerated1 = false; // Reset the flag when hiding the panel
    }
}



// Observe changes in the document and call checkAndMakeClickable() whenever mutations occur
const observer = new MutationObserver(checkAndMakeClickable);
observer.observe(document, { subtree: true, childList: true });

// Initially check and make the element clickable
checkAndMakeClickable();

// Observe changes in the document and call checkAndMakeClickable() whenever mutations occur
const observer1 = new MutationObserver(checkAndMakeClickable1);
observer1.observe(document, { subtree: true, childList: true });

// Initially check and make the element clickable
checkAndMakeClickable1();





// Define a function to handle responsive layout for a panel
function handleResponsivePanel(panel, mediaQuery) {

    // Function to set responsive height
    function setResponsiveHeight() {
        if (mediaQuery.matches) {
            // On small screens, set the height to 92% of the viewport height
            panel.style.height = 'calc(92vh - 260px)'; // Adjust the height as needed
        } else {
            // On larger screens, set the height as before
            panel.style.height = 'calc(100vh - 260px)';
        }
    }

    // Initial calls to set width and height based on screen size
    setResponsiveHeight();

    // Add event listeners for changes in screen size
    mediaQuery.addListener(setResponsiveHeight);
}

// Media query for screens smaller than 768px (adjust the breakpoint as needed)
const mediaQuery = window.matchMedia('(max-width: 768px)');

// Call the function for panelFollowers
handleResponsivePanel(panelFollowers, mediaQuery);

// Call the function for panelFollowing
handleResponsivePanel(panelFollowing, mediaQuery);


})();