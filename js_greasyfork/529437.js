// ==UserScript==
// @name        Replace IGDB with cs.rin.ru for Backloggd
// @description Replaces the IGDB button on Backloggd with a cs.rin.ru downolad link
// @author      Soap
// @namespace   soap.systems
// @homepageURL https://soap.systems
// @match       *://backloggd.com/*
// @match       *://*.backloggd.com/*
// @match       *://cs.rin.ru/forum/search.php*
// @grant       GM_registerMenuCommand
// @version     1.8
// @icon        https://external-content.duckduckgo.com/ip3/www.backloggd.com.ico
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/529437/Replace%20IGDB%20with%20csrinru%20for%20Backloggd.user.js
// @updateURL https://update.greasyfork.org/scripts/529437/Replace%20IGDB%20with%20csrinru%20for%20Backloggd.meta.js
// ==/UserScript==


// OPTIONS:
// disable turbolinks-style navigation. this might make the site feel slower (though, not any slower than a normal website)
// but it fixes an issue where links sometimes won't change automatically without a refresh
// DEFAULT: true
const disableTurbolinks = true
// even with disableTurbolinks, results from searches will still open with turbolinks navigation
// this adds a right click option on Tampermonkey and an extension menu option on Violentmonky
// which will manually update the link
// DEFAULT: true
const enableContextMenu = true
// note that when the script updates you will have to reconfigure any options. shouldn't update too often though.

/*
    TODO:
    - replace url at the bottom of search pages with "Search on cs.rin.ru".
      - url replacement logic works fine for this already, just need to fix the search query constructor
    - would be nice to replace the variable-based config with a key/value type deal with GM_setValue
    - add a ProtonDB button if the "released on" section doesn't include Linux
    - scrape the IGDB link to add a gog-games.to link if it exists
    - SteamRip link? Might be kinda redundant
*/

function removeTurbolinks() {
  if (location.host == 'backloggd.com') {
    document.querySelectorAll('a').forEach(link => {
      if (link.href.startsWith('https://backloggd.com')) {
        link.setAttribute('data-turbolinks', 'false');
      }
    });
  }
}

// We have to get the game name and the right element from the IGDB link because Backloggd doesn't have any meaningful class names
function changeIgdbUrl () {
  if (location.href.startsWith('https://backloggd.com/games')) {
    const link = document.querySelector('a[href^="https://www.igdb.com/games/"]')
    const linkElement = link.parentElement

    if (linkElement) {
      let searchURL = getSearchUrl(link)
      linkElement.innerHTML = `Download on <a href="${searchURL}" target="_blank">cs.rin.ru</a>`
    }
  }
}


function getSearchUrl(link) {
  // examle IGDB link: https://backloggd.com/games/yakuza-6-the-song-of-life
  let searchQuery = link.href.split('/').pop()
  searchQuery = searchQuery.replaceAll('-', ' ')
  let searchURL = 'https://cs.rin.ru/forum/search.php?keywords=' + searchQuery + '&terms=all&author=&sc=1&sf=titleonly&sk=t&sd=d&sr=topics&st=0&ch=300&t=0&submit=Search&backloggdrinscript=true'
  return searchURL
}

function clickFirstRinLink() {
  let params = new URLSearchParams(document.location.search)
  // There's a 'backloggdrinscript' parameter added to the end of the search URL so we can detect that you got to the search page from the script
  let scriptActive = params.get('backloggdrinscript');
  if (scriptActive) {
    const topics = document.querySelectorAll('a.topictitle');

    // only redirect if there's one link in the search results
    if (topics.length === 1) {
        window.location.href = topics[0].href;
    }
  }
}

if (disableTurbolinks === true) {
  removeTurbolinks()
}

clickFirstRinLink()

if (enableContextMenu === true) {
  GM_registerMenuCommand('Replace URL', changeIgdbUrl)
}

// Backloggd uses turbolinks, so we have to re-run each time the url changes
// Will occasionally decide to not work. Refreshing fixes this but might be worth migrating to vm-url in case that works better
// https://violentmonkey.github.io/api/matching/#matching-spa-sites-like-fb-github-twitter-youtube
onUrlChange()

if (self.navigation && disableTurbolinks === false) {
  navigation.addEventListener('navigatesuccess', onUrlChange);
} else {
  let u = location.href;
  new MutationObserver(() => u !== (u = location.href) && onUrlChange())
    .observe(document, {subtree: true, childList: true});
}

function onUrlChange() {
  changeIgdbUrl()
}
