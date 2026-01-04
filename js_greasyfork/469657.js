// ==UserScript==
// @name        Kbin Magazine Pop-up
// @namespace   Violentmonkey Scripts
// @match       https://kbin.social/*
// @grant       GM_getValue
// @version     1.8
// @license MIT
// @author      - solo
// @description Show magazine subscription information on hover
// @downloadURL https://update.greasyfork.org/scripts/469657/Kbin%20Magazine%20Pop-up.user.js
// @updateURL https://update.greasyfork.org/scripts/469657/Kbin%20Magazine%20Pop-up.meta.js
// ==/UserScript==

// Select all magazine URL elements
let magazineURLs = document.querySelectorAll('a.magazine-inline');


// Create a pop-up element to display the sidebar information
const popUp = document.createElement('div');
popUp.className = 'pop-up';
popUp.style.zIndex = '9999'; // Set the desired z-index value

// Apply box styling to the pop-up element
popUp.style.border = '1px solid #363434'; // Customize the border style
popUp.style.backgroundColor = '#2c2c2c'; // Customize the background color
popUp.style.padding = '10px'; // Customize the padding
popUp.style.borderRadius = '8px';
popUp.style.overflow = 'none'; // Add this line to enable scrolling
popUp.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';


// Adjust the spacing within the pop-up content
popUp.style.lineHeight = '1.0'; // Reduce line height to make content closer
popUp.style.margin = '0'; // Remove margin to reduce spacing

// Adjust the spacing for specific elements within the pop-up
popUp.querySelectorAll('p').forEach((paragraph) => {
  paragraph.style.margin = '0 0 10px'; // Adjust margin as desired
});

popUp.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
  heading.style.margin = '0 0 5px'; // Adjust margin as desired
});

popUp.querySelectorAll('ul, ol').forEach((list) => {
  list.style.margin = '0 0 5px'; // Adjust margin as desired
});

popUp.querySelectorAll('li').forEach((listItem) => {
  listItem.style.margin = '0 0 5px'; // Adjust margin as desired
});

// Function to fetch sidebar information for a given URL
async function fetchSidebarInfo(url) {
  const cachedContent = GM_getValue(url); // Check if content is cached

  if (cachedContent) {
    return cachedContent;
  } else {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const sidebarElement = doc.querySelector('section.magazine.section'); // Adjust the selector based on the structure of the sidebar on the page
      const sidebarHTML = sidebarElement.innerHTML;

      return sidebarHTML;
    } catch (error) {
      console.error('Error fetching sidebar information:', error);
      return null;
    }
  }
}

let activeMagazineURL = null;

// Function to show the popup for a specific magazine URL
function showPopUp(magazineURL) {
  // Get the URL from the magazine link
  const url = magazineURL.getAttribute('href');

    // Check if the active magazine URL is the same as the current one
  if (activeMagazineURL === url) {
    return; // Exit early if the same URL is already active
  }

     // Set the active magazine URL to the current one
  activeMagazineURL = url;


  // Fetch the sidebar information for the URL
  fetchSidebarInfo(url).then((sidebarHTML) => {
    if (sidebarHTML) {
      // Create a temporary container element to manipulate the sidebar content
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = sidebarHTML;



      if (!document.body.contains(popUp)) {
        // Clear the previous content of the pop-up
        popUp.innerHTML = '';



        // Check if an image is present
        const figureElement = tempContainer.querySelector('img');
        const headerElement = tempContainer.querySelector('header');
        const magazineName = tempContainer.querySelector('.magazine__name');
        const subscribeElement = tempContainer.querySelector('.magazine__subscribe');

        // Create the pop-up content wrapper
        const popUpContent = document.createElement('div');
        popUpContent.className = 'pop-up-content';
        popUpContent.style.display = 'flex'; // Enable flexbox layout
        popUpContent.style.alignItems = 'center'; // Center items vertically
        popUpContent.style.justifyContent = 'center'; // Center items vertically

        if (figureElement) {
          figureElement.style.maxWidth = '180px'; // Adjust the desired maximum width for the image
          figureElement.style.width = 'auto'; // Allow the image to resize while maintaining aspect ratio
          figureElement.style.borderRadius = '8px'; // Add border radius to the image
          figureElement.style.marginRight = '15px'; // Add a right margin to the image

          popUpContent.style.display = 'flex';
          popUpContent.style.justifyContent = 'flex-start';
          popUpContent.style.alignItems = 'center';

          // Append the image to the pop-up content
          popUpContent.appendChild(figureElement);
        } else {
          // No image, center the content
          popUpContent.style.justifyContent = 'center';
          popUpContent.style.alignItems = 'center';
        }

        // Create a container for the right elements
        const rightElementsContainer = document.createElement('div');
        rightElementsContainer.style.display = 'flex';
        rightElementsContainer.style.flexDirection = 'column';
        rightElementsContainer.style.justifyContent = 'flex-start';
        rightElementsContainer.style.alignItems = 'center';
        rightElementsContainer.style.marginBottom = '-20px';
        rightElementsContainer.style.marginTop = '-15px'; // Add a left margin to create space between the image and right elements

        // Move the magazine header and subscribe section to the right elements container
        if (headerElement) {
          headerElement.style.textAlign = 'center';
          headerElement.style.fontFamily = 'Arial, sans-serif';
          headerElement.style.fontSize = '12.5px';
          rightElementsContainer.appendChild(headerElement);
        }

        if (magazineName) {
          magazineName.style.fontFamily = 'Arial, sans-serif';
          magazineName.style.fontSize = '13.5px';
          magazineName.style.overflow = 'hidden';
          magazineName.style.textOverflow = 'ellipsis';
          magazineName.style.whiteSpace = 'auto';
          rightElementsContainer.appendChild(magazineName);
        }

        if (subscribeElement) {
          subscribeElement.style.marginTop = '0';
          subscribeElement.style.fontFamily = 'Arial, sans-serif';
          subscribeElement.style.fontSize = '10px';
          rightElementsContainer.appendChild(subscribeElement);
        }



        // Create a wrapper for the header and subscribe sections
        const infoWrapper = document.createElement('div');
        infoWrapper.style.display = 'flex'; // Enable flexbox layout
        infoWrapper.style.flexDirection = 'column'; // Stack items vertically
        infoWrapper.style.alignItems = 'flex-start'; // Center items vertically

        // Append the right elements container to the info wrapper
        infoWrapper.appendChild(rightElementsContainer);

        // Append the info wrapper to the pop-up content
        popUpContent.appendChild(infoWrapper);
        // Append the pop-up content to the pop-up element
        popUp.appendChild(popUpContent);


        // Add the pop-up element to the document body
        document.body.appendChild(popUp);

        // Apply fade-in animation to the pop-up
        popUp.style.opacity = '0';
        popUp.style.transition = 'opacity 0.3s';

        requestAnimationFrame(() => {
          popUp.style.opacity = '1';
        });
      }
    }
  }).catch((error) => {
    console.error('Error fetching sidebar information:', error);
  });
}


// Function to position the pop-up at the cursor position
function positionPopUp(cursorX, cursorY) {
  const popUpHeight = popUp.offsetHeight;
  const popUpWidth = popUp.offsetWidth;
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  let popUpTop = cursorY;
  let popUpLeft = cursorX;

  // Adjust the position if it exceeds the window boundaries
  if (popUpTop + popUpHeight > windowHeight) {
    popUpTop = Math.max(cursorY - popUpHeight, 0);
  }
  if (popUpLeft + popUpWidth > windowWidth) {
    popUpLeft = Math.max(cursorX - popUpWidth, 0);
  }

  // Apply the calculated position to the pop-up element
  popUp.style.position = 'fixed';
  popUp.style.top = `${popUpTop}px`;
  popUp.style.left = `${popUpLeft}px`;
}


// Function to hide the pop-up
function hidePopUp() {
  // Reset the active magazine URL
  activeMagazineURL = null;
  // Check if the pop-up is a child of the document body
  if (document.body.contains(popUp)) {
    // Check if the cursor is still inside the pop-up
    if (popUp.matches(':hover')) {
      setTimeout(hidePopUp, 1000);
      return;
    }

    // Apply fade-out animation to the pop-up
    popUp.style.opacity = '0';
    popUp.style.transition = 'opacity 0.3s';

    // Remove the pop-up element from the document body after the animation ends
    setTimeout(() => {
      if (document.body.contains(popUp)) {
        document.body.removeChild(popUp);
      }
    }, 1000);
  }
}

// Function to attach hover functionality to the magazine URLs
function attachHoverFunctionality() {
  magazineURLs.forEach((magazineURL) => {
    let hideTimeout; // Variable to store the timeout ID

    // Add event listener to show the pop-up when hovering over the magazine URL or the pop-up itself
    magazineURL.addEventListener('mouseover', () => {
      // Clear the timeout if it exists (to prevent premature hiding)
      clearTimeout(hideTimeout);

      // Set a timeout of 1000ms (1 second) before showing the pop-up
      hideTimeout = setTimeout(() => {
        showPopUp(magazineURL);
      }, 1000);

      // Function to position the pop-up within the window boundaries
      function positionPopUp() {
        const magazineURLRect = magazineURL.getBoundingClientRect();
        const popUpHeight = popUp.offsetHeight;
        const popUpWidth = popUp.offsetWidth;
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;

        let popUpTop, popUpLeft;

        if (magazineURLRect.bottom + popUpHeight > windowHeight) {
          popUpTop = Math.max(magazineURLRect.top - popUpHeight, 0);
        } else {
          popUpTop = magazineURLRect.bottom;
        }

        if (magazineURLRect.left + popUpWidth > windowWidth) {
          popUpLeft = Math.max(windowWidth - popUpWidth, 0);
        } else {
          popUpLeft = magazineURLRect.left;
        }

        // Apply the calculated position to the pop-up element
        popUp.style.position = 'fixed';
        popUp.style.top = `${popUpTop}px`;
        popUp.style.left = `${popUpLeft}px`;
      }

      positionPopUp();
    });

  // Add event listener to hide the pop-up when the cursor leaves the magazine URL or the pop-up itself
    magazineURL.addEventListener('mouseout', () => {
      // Clear the timeout to prevent the pop-up from appearing
      clearTimeout(hideTimeout);

      // Set a delay of 1000ms (1 second) before hiding the pop-up
      hideTimeout = setTimeout(() => {
        hidePopUp();
      }, 25);
    });

    // Add event listener to hide the pop-up when the cursor leaves the pop-up
    popUp.addEventListener('mouseleave', () => {
      // Set a delay of 1000ms (1 second) before hiding the pop-up
      hideTimeout = setTimeout(() => {
        hidePopUp();
      }, 25);
    });
  });
}

// Function to observe changes in the page and attach hover functionality to new magazine URLs
function observePageChanges() {
  const observer = new MutationObserver(() => {
    magazineURLs = document.querySelectorAll('a.magazine-inline');
    attachHoverFunctionality();
  });

  const config = { childList: true, subtree: true };
  observer.observe(document.body, config);
}

// Call the function to attach hover functionality to existing magazine URLs
attachHoverFunctionality();

// Call the function to observe page changes and attach hover functionality to newly added magazine URLs
observePageChanges();