// ==UserScript==
// @name        Empornium ClickyTags
// @description A clickable Top 300 menu of tags.
// @namespace   Empornium
// @include     /^https://www\.empornium\.(me|sx|is)\/torrents.php\?id*/
// @include     /^https://www\.empornium\.(me|sx|is)\/upload.php/
// @version     1.1.5
// @author      vandenium
// @grant       GM_setValue
// @grant       GM_getValue
// Version
// @downloadURL https://update.greasyfork.org/scripts/430211/Empornium%20ClickyTags.user.js
// @updateURL https://update.greasyfork.org/scripts/430211/Empornium%20ClickyTags.meta.js
// ==/UserScript==
// Changelog:
// Version 1.1.5
//  - Bugfix: Check for existence of tagContainer before querying.
//  - Bugfix: Fix close icon.
// Version 1.1.4
//  - Bugfix: Update text color for better readability.
// Version 1.1.3
//  - Bugfix: Fix issue of not displaying on Upload page.
// Version 1.1.2
//  - Bugfix: Now works across all domains (was hardcoded to the .is domain)
// Version 1.1.1
//  - Remove overlooked @grant none.
// Version 1.1.0
//  - Works on Upload page now.
//  - Clicking outside of ClickyTags modal closes it.
//  - Resize modal and link.
//  - Format cache date in modal title.
// Version 1.0.0
//  - The initial version.
//  - Features
//    - Popup menu of Top 300 tags
//    - Click to toggle adding/removing tag to the tags field
//    - Indicates pre-existing tags (not selectable)
//    - Updates tag list weekly for performance
//    - Works on title and upload pages
//    - Works with Emp++ Tag Highlighter
// Future:
//  - Make configurable? Top 100, 200, 300...
//  - Track/indicate most frequently used tags

const addLink = () => {
  const link = document.createElement('a');
  link.href = '#';
  link.textContent = 'Top 300 Tags';
  link.id = 'clickytags-link';
  link.style.textDecoration = 'none';
  link.style.fontSize = '1.2em';

  link.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMenu(e);
  });

  // Place depending on page
  let target;
  let action
  if (window.location.pathname.includes('torrent')) {
    target = '#tag_container';
    action = 'append';
  } else {
    target = '#clicktags-parent-container';
    action = 'prepend';
  }
  window.setTimeout(() => {
    document.querySelector(target)[action](link);
  }, 1)

  return link;
}

const optionsKey = 'empornium-clickytags-options';
const getCache = () => {
  const cache = GM_getValue(optionsKey);
  if (cache) {
    const rawOptions = JSON.parse(cache);
    console.log('Options from GM: ', JSON.stringify(rawOptions, null, 4));
    rawOptions.date = new Date(rawOptions.date);
    return rawOptions;
  }
  // First time through
  const firstEntry = {
    date: new Date('1/1/1970'),
    tags: [],
  };
  writeToCache(firstEntry);
  return firstEntry;
}
const writeToCache = (cacheValue) => {
  console.log(`Setting cache to ${optionsKey}:`, cacheValue);
  GM_setValue(optionsKey, JSON.stringify(cacheValue));
};

const hideMenu = () => document.querySelector('#clickytags-container').remove();

function getPreviouslySelectedTags() {
  return Array.from(document.querySelectorAll('#torrent_tags_list li a[href*="torrents"]')).map(v => v.textContent);
}

const createTagContainer = (tagNames, cache) => {

  const dateOptions = {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false,
  };

  const formattedCacheDate = new Intl.DateTimeFormat('en-US', dateOptions).format(cache.date);

  const isTorrentPage = window.location.pathname.includes('torrent');

  const template = `
  
  <style>
  .flex-grid {
    display: flex;
  }
  .col {
    flex: 1;
  }
  
  a.tag {
    cursor: pointer;
    display: block;
  }
  
  span.tag-container a.selected:after {
    content: " ✔️";
  }
  
  div#clickytags-container  {
    position:absolute;
    right: ${isTorrentPage ? 0 : undefined}px;
    background-color: rgba(0, 0, 0, 0.9);
    padding: 5px;
    border: solid #333 1px;
    border-radius: 5px;
    display: none;
    width: 52%;
    color: #ccc;
  }

  div#clickytags-container a {
    color: #ccc;
  }
  
  div#clickytags-container #close {
    float: right;
    display: inline-block;
  }
  
  div#clickytags-container h3 {
    display: inline-block;
    width: 80%;
  }
  
  div#clickytags-container #close {
    line-height: 2em;
    width: 2em;
    border-radius: 20px;
    background-color: rgb(20, 20, 20, 0.9);
    text-align: center;
  }
  
  div#clickytags-container #close:hover {
    cursor: pointer;
    background-color: rgb(40, 40, 40, 0.9)
  }
  
  .previously-selected {
    pointer-events: none;
  }
  
  .previously-selected:after {
    content: " 🏷️";
  }
  
</style>
<div>
<h3>Top 300 Tags since ${formattedCacheDate} (cache refreshes weekly)</h3>
  <div id='close'>❌</div>
</div>

<div>
  <div class="flex-grid">
  <div class="col" id='col1'></div>
  <div class="col" id='col2'></div>
  <div class="col" id='col3'></div>
  <div class="col" id='col4'></div>
  <div class="col" id='col5'></div>
</div>
`;

  const tagInput = document.querySelector('#taginput');
  const div = document.createElement('div');
  div.id = 'clickytags-container';
  div.innerHTML = template;

  tagNames.forEach((tagName, i) => {
    const tagElContainer = document.createElement('span');
    tagElContainer.style.display = 'block';
    tagElContainer.classList.add('tag-container');

    const tagEl = document.createElement('a');
    tagEl.classList.add('tag');
    tagEl.innerText = tagName + ' ';
    let colSelector;
    if (i < 60) {
      colSelector = '#col1'
    } else if (i >= 60 && i < 120) {
      colSelector = '#col2'
    } else if (i >= 120 && i < 180) {
      colSelector = '#col3';
    } else if (i >= 180 && i < 240) {
      colSelector = '#col4';
    } else {
      colSelector = '#col5';
    }


    tagEl.addEventListener('click', (e) => {
      e.preventDefault();
      tagInput.value += `${tagName} `;

      if (tagEl.classList.contains('selected')) {
        tagEl.classList.remove('selected');
        tagInput.value = tagInput.value.split(' ').filter(val => val !== tagName).join(' ');
      } else {
        tagEl.classList.add('selected');
      }

    });

    tagElContainer.append(tagEl);

    div.querySelector(colSelector).appendChild(tagElContainer);
  });

  div.querySelector('#close').addEventListener('click', toggleMenu);

  return div;
};

const addToPage = (tagContainer) => {
  const parentContainer = document.createElement('div');
  parentContainer.style.width = '100%';
  parentContainer.id = 'clicktags-parent-container';

  let target;

  // Uploads page
  if (window.location.pathname.includes('upload')) {
    target = document.querySelectorAll('.uploadbody')[4].querySelectorAll('td')[1];
  } else {
    target = document.querySelector('#details_top');
  }

  tagContainer.style.display = 'none';
  tagContainer.style.right = undefined;
  parentContainer.append(tagContainer);
  target.append(parentContainer);
};


const processTags = (htmlArray, cache) => {
  let tagNamesAll = [];

  htmlArray.forEach(html => {
    const dom = stringToHTML(html);
    const tagNames = Array.from(dom.querySelectorAll('.tag_results tr.rowa a[href], .tag_results tr.rowb a[href]'))
      .map(a => a.textContent.replace(/\*/, ''));

    tagNamesAll = tagNamesAll.concat(tagNames);

  })

  const tagNamesSorted = tagNamesAll.sort();
  const tagContainer = createTagContainer(tagNamesSorted, cache);
  const link = addLink();
  addToPage(tagContainer);
  return tagNamesSorted;
}

const stringToHTML = (str) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, 'text/html');
  return doc.body;
};

const urls = [
  '/tags.php',
  '/tags.php?page=2',
  '/tags.php?page=3'
];

const addToCache = (tagNamesSorted) => {
  writeToCache({
    date: new Date(),
    tags: tagNamesSorted,
  });
};

const toggleMenu = (e) => {
  const tagMenu = document.querySelector('#clickytags-container');

  if (tagMenu.style.display === 'none') {
    tagMenu.style.display = 'block';
  } else {
    tagMenu.style.display = 'none';
  }
}

const closeMenu = () => document.querySelector('#clickytags-container').style.display = 'none';
const cache = getCache();
const now = new Date();
const refreshInterval = 604800000; // 1 week.

if (cache.date.getTime() + refreshInterval < now.getTime()) { // add to cache
  Promise.all(urls.map(u => fetch(u)))
    .then(responses => Promise.all(responses.map(res => res.text())))
    .then(htmlArray => {
      const tagNamesSorted = processTags(htmlArray, cache);
      addToCache(tagNamesSorted);
    })
} else {
  const tagContainer = createTagContainer(cache.tags, cache);
  addToPage(tagContainer);
  const link = addLink();
}

document.querySelector('body').addEventListener('keyup', (e) => {
  if (e.key === 'Escape') {
    closeMenu();
  }
});

// Close clickytags modal if clicking outside of it.
document.querySelector('body').addEventListener('click', (e) => {
  if (document.querySelector('#clickytags-container').style.display === 'none') return;

  const clickyTagContainer = e.target.closest('#clickytags-container');

  if (!clickyTagContainer && e.target.id !== 'clickytags-link') {
    closeMenu();
  }
});


// After tag section renders, update the tag container with existing tags.
if (window.location.href.search('upload') === -1) {
  window.setTimeout(() => {
    const tagContainer = document.querySelector('#clickytags-container');
    if (tagContainer) {
      const allTags = Array.from(tagContainer.querySelectorAll('span'));
      const previouslySelectedTags = getPreviouslySelectedTags();
      allTags.forEach(tagDom => {
        const tagName = tagDom.firstChild.textContent;
        if (previouslySelectedTags.includes(tagName.trim())) {
          tagDom.firstChild.classList.add('previously-selected');
        }
      });
    }
  }, 1000);
}
