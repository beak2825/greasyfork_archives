// ==UserScript==
// @id             better-indeed
// @name           Better Indeed
// @version        1.1.1
// @namespace      https://github.com/luigia
// @author         Luigi Agcaoili
// @license        MIT - https://opensource.org/licenses/MIT
// @description    Removes bloat on Indeed by giving users the option to remove sponsored and/or Job Spotter postings
// @include        https://indeed.com/jobs?*
// @include        *indeed.com/*
// @run-at         document-end
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/371639/Better%20Indeed.user.js
// @updateURL https://update.greasyfork.org/scripts/371639/Better%20Indeed.meta.js
// ==/UserScript==
// select & edit the side bar
const filters = document.querySelector('#refineresults'),
  bar = document.createElement('div');

bar.innerHTML = `
  <h4 class="toggle-title">Toggle ads</h4>
  <input type="checkbox" id="job-spotter-checkbox">
  <label for="job-spotter-checkbox">Hide Job Spotter ads</label>
  <input type="checkbox" id="sponsored-checkbox">
  <label for="sponsored-checkbox">Hide sponsored ads</label>
`;
// add consistent styling to div
bar.style.marginBottom = '24px';
bar.style.marginLeft = '0';
bar.style.paddingLeft = '24px';
bar.style.color = '#2d2d2d';
bar.style.fontSize = '12px';
bar.style.maxWidth = '70%';
// add consistent styling to title
bar.firstElementChild.style.fontSize = '14px';
bar.firstElementChild.style.fontWeight = '500';
bar.firstElementChild.style.color = '#000';
// insert the div before the first child
filters.insertBefore(bar, filters.firstChild);
// checkbox variables
const jobSpotCb = document.querySelector('#job-spotter-checkbox'),
sponsoredCb = document.querySelector('#sponsored-checkbox');
// addEventListeners & check localStorage
window.onload = () => {
  jobSpotCb.addEventListener('change', hideJobSpot);
  sponsoredCb.addEventListener('change', hideSponsored);
  // call the function based on localStorage definitions
  let jobSpotLS = JSON.parse(localStorage.getItem(jobSpotCb.id)),
    sponsoredLS = JSON.parse(localStorage.getItem(sponsoredCb.id));

  if (jobSpotLS) {
    jobSpotCb.checked = true;
    hideJobSpot();
  }

  if (sponsoredLS) {
    sponsoredCb.checked = true;
    hideSponsored();
  }
  // re-insert pagination to the side or job posting after the pagination is moved
  // check if there is only 1 page
  // there won't be a pagination if there is only 1 page
  if (document.querySelector('.pagination')) {
    const pagination = document.querySelector('.pagination'),
      results = document.querySelector('#resultsCol');
    // add a delay as job postings aren't instantly loaded
    setTimeout(() => {
      let side = document.querySelector('#jobalerts') || document.querySelector('#vjs-header');
      side.insertBefore(pagination, side.firstChild);
    }, 200);

    // move pagination when a result card is clicked
    results.addEventListener('click', (e) => {
      setTimeout(() => {
        // currently viewing a job listing
        if (document.querySelector('#vjs-header')) {
          let vjsHeader = document.querySelector('#vjs-header');
          // add pagination as the last child in the job posting header
          vjsHeader.appendChild(pagination);
        }
        // add event listener to close button
        if (document.querySelector('#vjs-x')) {
          let close = document.querySelector('#vjs-x');
          close.addEventListener('click', (e) => {
            // move pagination back to the side if it's removed
            if (document.querySelector('#jobalerts')) {
              side = document.querySelector('#jobalerts');
              side.insertBefore(pagination, side.firstChild);
            }
          });
        }
      }, 200);
    })
  }
}

// functions
// hide job spotter postings
const hideJobSpot = (e) => {
  const linkSource = Array.from(document.querySelectorAll('.result-link-source')),
    jobSpot = [];
  // sources that include Job Spotter text are recorded
  linkSource.forEach((source) => (source.textContent == 'Job Spotter ') && jobSpot.push(source));
  // set variable in localStorage & show/hide Job Spotter postings
  if (jobSpotCb.checked) {
    localStorage.setItem(jobSpotCb.id, jobSpotCb.checked);
    (jobSpot.length > 0) && jobSpot.forEach((posting) => posting.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = 'none');
  } else {
    localStorage.removeItem(jobSpotCb.id);
    jobSpot.forEach((posting) => posting.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = 'block');
  }
}

// hide sponsored postings
const hideSponsored = (e) => {
  const lastSponsored = Array.from(document.querySelectorAll('.sjlast'));
  // set variable in localStorage & show/hide sponsored postings
  if (sponsoredCb.checked) {
    localStorage.setItem(sponsoredCb.id, sponsoredCb.checked);
    // use a loop only if there is more than one element for performance
    (lastSponsored.length === 1) ? lastSponsored[0].parentElement.style.display = 'none' : lastSponsored.forEach((section) => section.parentElement.style.display = 'none');
    // sometimes there will be a sponsored posting that is separate from other sponsored listings
    if (document.querySelector('.sjita')) {
      const singleAd = document.querySelector('.sjita');
      singleAd.style.display = 'none';
    }
  } else {
    localStorage.removeItem(sponsoredCb.id);
    (lastSponsored.length === 1) ? lastSponsored[0].parentElement.style.display = 'block' : lastSponsored.forEach((section) => section.parentElement.style.display = 'block');
    if (document.querySelector('.sjita')) {
      const singleAd = document.querySelector('.sjita');
      singleAd.style.display = 'none';
    }
  }
}

// keyboard navigation
const keyboardNav = (e) => {
  // check if there is only 1 page
  // there won't be a pagination if there is only 1 page
  if (document.querySelector('.pagination')) {
    const activePage = document.querySelector('.pagination b');
    switch (e.keyCode) {
      // left arrow key
      case 37:
        // this is not the first page
        (activePage.previousElementSibling !== null) && activePage.previousElementSibling.click();
        break;
      // right arrow key
      case 39:
        // this is not the last page
        (activePage.nextElementSibling !== null) && activePage.nextElementSibling.click();
        break;
    }
  }
}

document.onkeydown = keyboardNav;
