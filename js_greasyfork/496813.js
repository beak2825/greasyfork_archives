// ==UserScript==
// @name        Bookmark Twitter Users (Discrete Follow)
// @namespace   Violentmonkey Scripts
// @match       https://x.com/*
// @grant       none
// @version     1.3
// @author      -
// @description 6/2/2024, 12:07:28 AM
// @downloadURL https://update.greasyfork.org/scripts/496813/Bookmark%20Twitter%20Users%20%28Discrete%20Follow%29.user.js
// @updateURL https://update.greasyfork.org/scripts/496813/Bookmark%20Twitter%20Users%20%28Discrete%20Follow%29.meta.js
// ==/UserScript==

// svgs
const yellow = '#CF9851';
const red = '#CF5170';
const trashCan = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="15px" width="15px" version="1.1" id="_x32_" viewBox="0 0 512 512" xml:space="preserve" fill="#000000">

<g id="SVGRepo_bgCarrier" stroke-width="0"/>

<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>

<g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#ffffff;} </style> <g> <path class="st0" d="M308.229,51.853C308,23.183,284.751,0.017,256,0c-28.734,0.017-52,23.183-52.228,51.853 c-63.821,9.2-109.796,33.323-109.796,49.845v16.718c0,20.784,72.538,37.625,162.024,37.625c89.486,0,162.024-16.841,162.024-37.625 v-16.718C418.024,85.176,372.049,61.053,308.229,51.853z M256,48.065c-6.245,0-12.376,0.196-18.433,0.498 c0.735-3.715,2.547-6.996,5.144-9.616c3.445-3.437,8.049-5.494,13.289-5.51c5.257,0.017,9.845,2.073,13.306,5.51 c2.595,2.62,4.408,5.902,5.135,9.616C268.384,48.261,262.245,48.065,256,48.065z"/> <path class="st0" d="M256,178.335c-89.486,0-162.024-16.841-162.024-37.625l18.53,316.253C112.506,478.506,167.233,512,256,512 c88.767,0,143.51-33.494,143.51-55.037l18.514-316.253C418.024,161.494,345.486,178.335,256,178.335z M158.588,421.682 l-6.661-195.134c4.465,1.02,9.249,1.878,14.269,2.743l6.752,197.878C167.763,425.436,162.988,423.567,158.588,421.682z M217.176,436.98l-3.609-202.278c4.637,0.318,9.339,0.629,14.123,0.784l3.608,202.98C226.433,438.074,221.722,437.6,217.176,436.98 z M294.824,436.98c-4.547,0.62-9.339,1.094-14.196,1.486l3.608-202.98c4.784-0.155,9.494-0.466,14.123-0.784L294.824,436.98z M353.412,421.682c-4.392,1.886-9.175,3.755-14.351,5.486l6.744-197.878c5.02-0.865,9.803-1.796,14.277-2.743L353.412,421.682z"/> </g> </g>

</svg>`;
const editPencil = `
<svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 24 24" fill="none">

<g id="SVGRepo_bgCarrier" stroke-width="0"/>

<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>

<g id="SVGRepo_iconCarrier"> <path d="M17.0671 2.27157C17.5 2.09228 17.9639 2 18.4324 2C18.9009 2 19.3648 2.09228 19.7977 2.27157C20.2305 2.45086 20.6238 2.71365 20.9551 3.04493C21.2864 3.37621 21.5492 3.7695 21.7285 4.20235C21.9077 4.63519 22 5.09911 22 5.56761C22 6.03611 21.9077 6.50003 21.7285 6.93288C21.5492 7.36572 21.2864 7.75901 20.9551 8.09029L20.4369 8.60845L15.3916 3.56308L15.9097 3.04493C16.241 2.71365 16.6343 2.45086 17.0671 2.27157Z" fill="#ffffff"/> <path d="M13.9774 4.9773L3.6546 15.3001C3.53154 15.4231 3.44273 15.5762 3.39694 15.7441L2.03526 20.7369C1.94084 21.0831 2.03917 21.4534 2.29292 21.7071C2.54667 21.9609 2.91693 22.0592 3.26314 21.9648L8.25597 20.6031C8.42387 20.5573 8.57691 20.4685 8.69996 20.3454L19.0227 10.0227L13.9774 4.9773Z" fill="#ffffff"/> </g>

</svg>`;

// Add FontAwesome library
var faLink = document.createElement('link');
faLink.rel = 'stylesheet';
faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
document.head.appendChild(faLink);

// modal vars
const modal = document.createElement('div');
modal.className = 'bookmarkModal';
const modalContent = document.createElement('div');
modalContent.classList.add('bookmarkContent');
const closeModal = document.createElement('button');
closeModal.classList.add('r-37j5jr', 'closeBookmarkModal');
const bookmarkUl = document.createElement('ul');

// Execute addElement function at window load
window.onload = function() {

    const bookmarkStyle = document.createElement('style');

    // Define your CSS rules
    const css = `
      .bookmarkHover:hover {
        transform: scale(1.05);
        filter: brightness(1.5);
      }
      .bookmarkHover:active {
        transform: scale(1);
      }
      .edit-notes, .delete-bookmark {
        display: inline-block;
        cursor: pointer;
      vertical-align: middle;
      }
      .edit-notes svg, .delete-bookmark svg {
        vertical-align: middle;
        width: 15px;
        height: 15px;
      }

          .bookmarkContent {
        border-radius: 10px !important;
        border: none !important;
        align-items: center !important;

    }

    .bookmarkContent ul {
       list-style-type: none !important;
       width: 90% !important;
       padding-left: 0px !important;

    }

    .bookmarkContent li {
        background-color: #212121;
        border-radius: 10px;
        padding: 10px 15px;
    }

    .bookmarkContent .edit-notes {
        background-color: #ff742d;
        padding: 3px 5px;
        border-radius: 4px;
        color: white !important;
        margin-right: 5px;
        opacity: 30%;
        transition: all 0.3s ease;
        filter: grayscale(100%);

    }

    .bookmarkContent .delete-bookmark {
        background-color: #d71d1d;
        padding: 3px 5px;
        border-radius: 4px;
        color: white !important;
        opacity: 30%;
        filter: grayscale(100%);
        transition: all 0.3s ease;
    }

    .delete-bookmark:hover,
    .edit-notes:hover {
        opacity: 100%;
        filter: grayscale(0%);
    }

    .bookmarkContent li a {
        text-decoration: none !important;
        font-weight: bold;
        transition: all 0.3s ease;
    }

    .bookmarkContent li a:hover {
        color: white;
        box-shadow: 0px 0px 20px #fff3;
    }

    .closeBookmarkModal {
        display: none !important;

    `;

    // Set the CSS rules to the style element
    bookmarkStyle.innerHTML = css;

    // Append the style element to the document body
    document.body.appendChild(bookmarkStyle);

  // Load bookmarks from local storage
  loadBookmarks();

  // Use a setInterval to check if the sidebar is available
let checkCount = 0; // Initialize a counter variable

const checkSidebarInterval = setInterval(() => {
  const sidebarNav = document.querySelector('nav[aria-label="Primary"]');
  if (sidebarNav) {
    clearInterval(checkSidebarInterval); // Stop checking once the element is found
    addElement(sidebarNav); // Call the addElement function with the sidebarNav element
  } else {
    checkCount++; // Increment the counter
    if (checkCount >= 30) {
      clearInterval(checkSidebarInterval); // Stop checking after 30 attempts
    }
  }
}, 100); // Check every 100ms

  // add bookmark option to user actions
  // Use a setInterval to check if the user actions is available
  const checkUserActionsInterval = setInterval(() => {
    const userActionBtns = document.querySelector('div[class="css-175oi2r r-obd0qt r-18u37iz r-1w6e6rj r-1h0z5md r-dnmrzs"]');
    userActionBtns.style.cssText = `align-items: center;`;
    if (userActionBtns) {
      clearInterval(checkUserActionsInterval); // Stop checking once the element is found
      addBookmarkBtn(userActionBtns); // Call the addElement function with the sidebarNav element
    }
  }, 100); // Check every 100ms
};

// Function to load bookmarks from local storage
function loadBookmarks() {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  bookmarkUl.innerHTML = ''; // Clear the existing bookmarks

  bookmarks.forEach((bookmark, index) => {
    const newBookmark = document.createElement('li');
    newBookmark.innerHTML = `
      <p>
        <a href="${bookmark.link}">${bookmark.userName}</a>${bookmark.notes ? ` - ${bookmark.notes}` : ''}
        <span class="edit-notes bookmarkHover" style=" margin-left: 10px; color: #CF9851;" data-bookmark-index="${index}"> Edit </span>
        <span class="delete-bookmark bookmarkHover" style="color: #CF5170;" data-bookmark-index="${index}">  Delete </span>
      </p>
    `;
    bookmarkUl.appendChild(newBookmark);
  });
}

// Add event listener for edit notes and delete bookmark
bookmarkUl.addEventListener('click', function(event) {
  const target = event.target;
  if (target.classList.contains('edit-notes')) {
    editNotes(event);
  } else if (target.classList.contains('delete-bookmark')) {
    deleteBookmark(event);
  }
});


// Function to edit notes
function editNotes(event) {
  const bookmarkIndex = event.target.dataset.bookmarkIndex;
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  const newNotes = prompt("Edit notes:", bookmarks[bookmarkIndex].notes);

  if (newNotes !== null) {
    bookmarks[bookmarkIndex].notes = newNotes;
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    loadBookmarks(); // Reload bookmarks to update the UI
  }
}

// Function to delete bookmark
function deleteBookmark(event) {
  const bookmarkIndex = event.target.dataset.bookmarkIndex;
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  bookmarks.splice(bookmarkIndex, 1);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  loadBookmarks(); // Reload bookmarks to update the UI
}

// Function to add bookmark button on profiles
function addBookmarkBtn(userActionBtns) {
  const bookmarkUserBtn = document.createElement('div');
  bookmarkUserBtn.innerHTML = `
    <div class="css-175oi2r">
      <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none">

<g id="SVGRepo_bgCarrier" stroke-width="0"/>

<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>

<g id="SVGRepo_iconCarrier"> <path d="M16 6C16 8.20914 14.2091 10 12 10C9.79086 10 8 8.20914 8 6C8 3.79086 9.79086 2 12 2C14.2091 2 16 3.79086 16 6Z" fill="#ffffff"/> <path d="M15.6782 13.5028C15.2051 13.5085 14.7642 13.5258 14.3799 13.5774C13.737 13.6639 13.0334 13.8705 12.4519 14.4519C11.8705 15.0333 11.6639 15.737 11.5775 16.3799C11.4998 16.9576 11.4999 17.6635 11.5 18.414V18.586C11.4999 19.3365 11.4998 20.0424 11.5775 20.6201C11.6381 21.0712 11.7579 21.5522 12.0249 22C12.0166 22 12.0083 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C13.3262 13 14.577 13.1815 15.6782 13.5028Z" fill="#ffffff"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M13.5126 21.4874C14.0251 22 14.8501 22 16.5 22C18.1499 22 18.9749 22 19.4874 21.4874C20 20.9749 20 20.1499 20 18.5C20 16.8501 20 16.0251 19.4874 15.5126C18.9749 15 18.1499 15 16.5 15C14.8501 15 14.0251 15 13.5126 15.5126C13 16.0251 13 16.8501 13 18.5C13 20.1499 13 20.9749 13.5126 21.4874ZM15.5266 19.9765C14.8245 19.4738 14 18.8833 14 17.8598C14 16.7299 15.375 15.9285 16.5 17.0148C17.625 15.9285 19 16.7299 19 17.8598C19 18.8833 18.1755 19.4738 17.4734 19.9765C17.4005 20.0287 17.3288 20.08 17.2596 20.1308C17 20.3209 16.75 20.5 16.5 20.5C16.25 20.5 16 20.3209 15.7404 20.1308C15.6712 20.08 15.5995 20.0287 15.5266 19.9765Z" fill="#ffffff"/> </g>

</svg>
    </div>
  `;
  bookmarkUserBtn.style.cssText = `
    background-color: transparent;
    border-radius: 100%;
    font-family: TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    margin-bottom: 10px;
    margin-left: 5px;
  `;
  userActionBtns.appendChild(bookmarkUserBtn);

  bookmarkUserBtn.onclick = () => {
    addUserToBookmarks();
  };
}

function addUserToBookmarks() {
  let newBookmarkLink = window.location.href;
  let bookmarkUserName = document.querySelector('div[data-testid="UserName"] span[class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3"]').textContent;
  console.log('NEW BOOKMARK: ' + newBookmarkLink);
  populateBookmarks(newBookmarkLink, bookmarkUserName);
}

function populateBookmarks(link, bookmarkUserName) {
  let bookmarkModal = document.querySelector('.bookmarkContent');
  let notes = prompt("Add additional notes: ");
  if (notes !== null && notes !== '') {
    notes = notes;
  } else {
    notes = '';
  }

  const newBookmark = {
    link,
    userName: bookmarkUserName,
    notes
  };

  const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  bookmarks.push(newBookmark);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

  loadBookmarks(); // Reload bookmarks to update the UI
}

// Function to add the button to the sidebar
function addElement(sidebarNav) {
  console.log('NAV ' + sidebarNav);
  const bookmarkUserBtn = document.createElement('a');
  bookmarkUserBtn.classList.add('css-175oi2r', 'r-6koalj', 'r-eqz5dr', 'r-16y2uox', 'r-1habvwh', 'r-cnw61z', 'r-13qz1uu', 'r-1ny4l3l', 'r-1loqt21', '.r-1hdo0pc', '.r-o7ynqc');
  bookmarkUserBtn.innerHTML = `
  <div class="css-175oi2r r-sdzlij r-dnmrzs r-1awozwy r-18u37iz r-1777fci r-xyw6el r-o7ynqc r-6416eg">
    <div class="css-175oi2r">
<svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none">

<g id="SVGRepo_bgCarrier" stroke-width="0"/>

<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>

<g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12C22 15.7712 22 17.6569 20.8284 18.8284C19.6569 20 17.7712 20 14 20H10C6.22876 20 4.34315 20 3.17157 18.8284C2 17.6569 2 15.7712 2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4ZM13.25 9C13.25 8.58579 13.5858 8.25 14 8.25H19C19.4142 8.25 19.75 8.58579 19.75 9C19.75 9.41421 19.4142 9.75 19 9.75H14C13.5858 9.75 13.25 9.41421 13.25 9ZM14.25 12C14.25 11.5858 14.5858 11.25 15 11.25H19C19.4142 11.25 19.75 11.5858 19.75 12C19.75 12.4142 19.4142 12.75 19 12.75H15C14.5858 12.75 14.25 12.4142 14.25 12ZM15.25 15C15.25 14.5858 15.5858 14.25 16 14.25H19C19.4142 14.25 19.75 14.5858 19.75 15C19.75 15.4142 19.4142 15.75 19 15.75H16C15.5858 15.75 15.25 15.4142 15.25 15ZM11 9C11 10.1046 10.1046 11 9 11C7.89543 11 7 10.1046 7 9C7 7.89543 7.89543 7 9 7C10.1046 7 11 7.89543 11 9ZM9 17C13 17 13 16.1046 13 15C13 13.8954 11.2091 13 9 13C6.79086 13 5 13.8954 5 15C5 16.1046 5 17 9 17Z" fill="#ffffff"/> </g>

</svg>
    </div>
    <div dir="ltr" class="css-146c3p1 r-dnmrzs r-1udh08x r-3s2u2q r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-adyw6z r-135wba7 r-16dba41 r-dlybji r-nazi8o" style="text-overflow: unset; color: rgb(231, 233, 234);">
      <span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3" style="text-overflow: unset;">User Bookmarks</span>
    </div>
  </div>
  `;

  // Get the 4th to last child and insert the button after it
  const children = sidebarNav.children;
  const fourthToLastChild = children[children.length - 5];

  if (fourthToLastChild) {
    fourthToLastChild.insertAdjacentElement('afterend', bookmarkUserBtn);
  } else {
    // If there are less than 4 children, just append the button to the sidebar
    sidebarNav.appendChild(bookmarkUserBtn);
  }

  bookmarkUserBtn.onclick = () => {
    openModal();
  };
}

function openModal() {
  // create the modal
  modal.style.cssText = `
    font: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100000;
  `;

  modalContent.style.cssText = `
    font: inherit;
    position: relative;
    width: 40%;
    height: 40%;
    background-color: #161616;
    border: 1px solid rgba(255,255,255,0.5);
    border-radius: 3px;
    overflow-y: auto;
    overflow-x: none;
    padding: 20px;
    -webkit-box-shadow: 0px 0px 92px 50px rgba(0,0,0,0.55);
    -moz-box-shadow: 0px 0px 92px 50px rgba(0,0,0,0.55);
    box-shadow: 0px 0px 92px 50px rgba(0,0,0,0.55);
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    font-family: TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    place-content: start !important;
  `;

  closeModal.textContent = 'Close';
  closeModal.style.cssText = `
    font: inherit;
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #161616;
    color: white;
    border: rgba(255,255,255,0.5) 1px solid;
    border-radius: 3px;
    z-index: 1000000;
    font-family: TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  `;

  bookmarkUl.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 10px;
  `;

  closeModal.onclick = () => {
    closeModalFunc();
  };

  modalContent.appendChild(closeModal);
  modalContent.appendChild(bookmarkUl);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}

function closeModalFunc() {
  modal.style.display = 'none';
  modalContent.innerHTML = ''; // Clear the modal content
}

// Close modal when clicking outside the inner modalContent
modal.onclick = (event) => {
  if (event.target === modal) {
    closeModalFunc();
  }
};

// Prevent modal from closing when clicking inside the modalContent
modalContent.onclick = (event) => {
  event.stopPropagation();
};
