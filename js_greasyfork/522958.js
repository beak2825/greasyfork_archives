// ==UserScript==
// @name        Random Search Rule34
// @namespace   Random Search Rule34
// @match       https://rule34.xxx/*
// @grant       none
// @version     1.0.3
// @author      Ardath
// @description Allow user to search for random page/post based on current tags in the search bar. rule34.xxx
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522958/Random%20Search%20Rule34.user.js
// @updateURL https://update.greasyfork.org/scripts/522958/Random%20Search%20Rule34.meta.js
// ==/UserScript==

// ==========================================================================================================
// ==========================================================================================================

// CSS
const style = document.createElement('style');
style.innerHTML = `

  /* Default styles for desktop */
  #random-search-button {
    display = inline-block;
    margin: 2px auto;
    width: 88%;
  }

  #random_search_checkbox {
    display: inline-block;
  }

  /* Mobile styles */
  @media screen and (max-width: 1000px) {
    #random-search-button {
      display: block;
      margin: 0 auto;
      margin-top: 15px;
      width: 100% !important;
    }

    #random_search_checkbox {
      display: block;
      margin: 15px auto;
    }

    .tag-search {
      text-align: center;
    }
  }
`;
document.head.appendChild(style);

// ==========================================================================================================
// ==========================================================================================================

// Add Random Search Button and Checkbox
function addRandomSearchButton() {

  const targetDiv = document.querySelector('.tag-search');

  const randomSearchButton = document.createElement('input');
  randomSearchButton.id = 'random-search-button';
  randomSearchButton.type = 'submit';
  randomSearchButton.value = 'Random Search';
  randomSearchButton.onclick = function() {
    randomSearchButton.disabled = true;
    randomSearchEvent();
  }

  const randomSearchCheckbox = document.createElement('input');
  randomSearchCheckbox.id = 'random_search_checkbox';
  randomSearchCheckbox.type = 'checkbox';
  randomSearchCheckbox.checked = localStorage.getItem('randomCheckboxState') === 'true';

  randomSearchCheckbox.onclick = function() {
    localStorage.setItem('randomCheckboxState', randomSearchCheckbox.checked ? 'true' : 'false');
  };

  if (targetDiv) {
    targetDiv.appendChild(randomSearchButton);
    targetDiv.appendChild(randomSearchCheckbox);
  }
}

// ==========================================================================================================
// Handle random search event when the button is clicked
// ==========================================================================================================

async function randomSearchEvent() {
  const currentTagsInput = document.querySelector('input[name="tags"]').value.trim().replace(/ /g, '+');

  let storedSearch = localStorage.getItem('random_search_tags');
  let tagsInput = storedSearch ? JSON.parse(storedSearch).tags : null;

  let lastPagePID = 0;

  // If tagsInput is stored and matches currentTagsInput, use lastPagePID
  if (tagsInput && tagsInput === currentTagsInput) {
    lastPagePID = JSON.parse(storedSearch).pid;
    console.log('Using previous search parameters => tags: ' + tagsInput + ' | pid: ' + lastPagePID);
  } else {
    // Fetch the last page PID if the tag input is different. The last page PID is used to determine how many pages for the search (PID: 0 = page 1, PID: 42 = page 2, PID: 84 = page 3, ...)
    lastPagePID = await fetchlastPagePID(currentTagsInput);
    const newSearch = { tags: currentTagsInput, pid: lastPagePID };
    localStorage.setItem('random_search_tags', JSON.stringify(newSearch));
    console.log('New search parameters saved => tags: ' + newSearch.tags + ' | pid: ' + newSearch.pid);
  }

  // Calculate the page count and select a random page
  const pageCount = Math.floor(lastPagePID / 42) + 1;
  const randomNumber = Math.floor(Math.random() * pageCount);
  const randomPid = randomNumber * 42;
  const randomPageLink = `https://rule34.xxx/index.php?page=post&s=list&tags=${currentTagsInput}&pid=${randomPid}`;


  const singlePostSearch = document.getElementById('random_search_checkbox');

  // Random post vs random page
  if (singlePostSearch.checked) {
    localStorage.setItem('randomSearch', true);
    window.location.href = await fetchRandomPost(randomPageLink) + `&tags=${currentTagsInput}`;
  } else {
    console.log(`Redirecting to random page: ${randomPid}`);
    window.location.href = randomPageLink;
  }
}

// ==========================================================================================================
// Fetch the last page PID for the current search tags
// ==========================================================================================================

async function fetchlastPagePID(tagsInput) {
  let lastPagePID = 0; // PID: 0 = page 1, PID: 42 = page 2, PID: 84 = page 3, ...

  const url = `https://rule34.xxx/index.php?page=post&s=list&tags=${tagsInput}`;

  try {
    const response = await fetch(url);
    const data = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/html");

    // Find the last page link by checking for the alt="last page" attribute
    const lastPageLink = doc.querySelector('a[alt="last page"]');

    if (lastPageLink) {
      // Extract the href attribute to get the last page PID
      const href = lastPageLink.getAttribute('href');
      lastPagePID = href.match(/pid=([0-9]+)/)[1];
      if (lastPagePID > 200000) {
        lastPagePID = 200000;
      }

    } else {
      console.error("Last page link not found.");
    }

  } catch (error) {
    console.log('Error:', error);
  }

  return lastPagePID;
}

// ==========================================================================================================
// When checkbox is checked, fetch a random post from a random page
// ==========================================================================================================

async function fetchRandomPost(randomPageLink) {
  const url = randomPageLink;
  console.log('Fetching from:', url);

  try {
    const response = await fetch(url);
    const data = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/html");

    const thumbs = doc.querySelectorAll("span.thumb[id^='s']");

    if (thumbs.length === 0) {
      console.log('No thumbnails found.');
      return;
    }

    const randomThumb = thumbs[Math.floor(Math.random() * thumbs.length)];
    return 'https://rule34.xxx/index.php?page=post&s=view&id=' + randomThumb.id.replace('s', '');
    console.log('Random post URL:', postUrl);

  } catch (error) {
    console.log('Error:', error);
  }
}

// ==========================================================================================================
//
// ==========================================================================================================

addRandomSearchButton();