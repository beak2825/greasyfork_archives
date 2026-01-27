// ==UserScript==
// @name         Miniflux automatically refresh feeds
// @namespace    https://reader.miniflux.app/
// @version      36
// @description  Automatically refreshes Miniflux feeds
// @author       Tehhund
// @match        *://*.miniflux.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=miniflux.app
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/464580/Miniflux%20automatically%20refresh%20feeds.user.js
// @updateURL https://update.greasyfork.org/scripts/464580/Miniflux%20automatically%20refresh%20feeds.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

// Refresh the page every hour to keep feeds updating.
setTimeout(() => { location.reload(); }, 3600000);

let apiKey = ''; // Put your API key from Miniflux here.
const rateLimit = 43200000; // Only refresh twice per day. 43200000 miliseconds = 12 hours. If a feed has an error (e.g., too many requests) its checked_at datetime still gets updated so we won't hit the feeds with too many requests.

const refreshFeeds = async () => {

  let statusDiv = document.createElement('div');
  statusDiv.style.marginBottom = "5rem";
  statusDiv.style.color = "rgb(170, 170, 170)";
  statusDiv.style.marginBottom = "1rem";
  statusDiv.style.minHeight = "5rem";
  statusDiv.id = 'statusDiv';
  document.body.appendChild(statusDiv);
  let toastDiv = statusDiv.cloneNode();
  toastDiv.id = 'toastDiv';
  document.body.appendChild(toastDiv);
  let pageLastRefreshedNode = document.createElement('div');
  pageLastRefreshedNode.id = `pageLastRefreshed`;
  pageLastRefreshedNode.textContent = `Page last refreshed at ${new Date().toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}.`;
  statusDiv.appendChild(pageLastRefreshedNode);
  let feedsLastRefreshedNode = document.createElement('div');
  feedsLastRefreshedNode.id = `feedsLastRefreshed`;
  statusDiv.appendChild(feedsLastRefreshedNode);
  let numberToRefresh = document.createElement('div');
  numberToRefresh.id = `numberToRefresh`;
  statusDiv.appendChild(numberToRefresh);
  // setTimeout(() => { toastDiv.remove(); }, 900000); // remove after 15 minutes. // Going to leave the node for now so we can see when the page was last refreshed.
  if (!apiKey) { // If the API key isn't specified, try getting it from localstorage.
    apiKey = localStorage.getItem('miniFluxRefresherApiKey');
  } else { // If we have the API key, store it in localstorage.
    localStorage.setItem('miniFluxRefresherApiKey', apiKey);
  }
  if (!apiKey) { // Indicate if an API key was found either in the code or in localstorage.
    toastDiv.innerText = 'Refresher script: Missing API key.';
    const keyInput = document.createElement('input');
    keyInput.setAttribute('type', 'text');
    keyInput.setAttribute('placeholder', 'Enter API key here');
    keyInput.style.width = "300px";
    keyInput.style.marginLeft = "10px";
    keyInput.addEventListener("keyup", ({ key }) => {
      if (key === "Enter") {
        apiKey = keyInput.value;
        localStorage.setItem('miniFluxRefresherApiKey', apiKey);
        keyInput.remove();
        setToast('API key saved. Please refresh the page to start the feed refresh process.');
      }
    });
    toastDiv.appendChild(keyInput);
  }
  setToast('Starting feed refresh process.');
  let req = await fetch('https://reader.miniflux.app/v1/feeds', { headers: { 'X-Auth-Token': apiKey } });
  let res = JSON.parse(await req.text());
  let feedsArray = res.map(currentFeed => currentFeed); // Turn JSON into an array for sorting.
  feedsArray.sort((a, b) => { return (new Date(a.checked_at) - new Date(b.checked_at)); }); // Sort from least recently checked to most recently checked so least recent gets refreshed first.
  setToast('Got list of feeds.');
  document.getElementById('feedsLastRefreshed').textContent = `Oldest feed last refreshed at ${new Date(feedsArray[0].checked_at).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}.`;
  let countOfFeedsToRefresh = 0;
  let countOfFeeds = feedsArray.length;
  for (let [index, feed] of feedsArray.entries()) {
    let lastChecked = new Date(feed.checked_at).getTime();
    if (Date.now() - lastChecked > rateLimit) {
      countOfFeedsToRefresh++;
      setToast(`${feed.title} ${feed.site_url}: It's been more than 12 hours, refresh.`);
      setTimeout(
        async () => {
          let req = await fetch(`https://reader.miniflux.app/v1/feeds/${feed.id}`, { headers: { 'X-Auth-Token': apiKey } });
          let response = JSON.parse(await req.text());
          let lastChecked = new Date(response.checked_at).getTime();
          if (Date.now() - lastChecked > rateLimit) { // Since navigating, refreshing the page, or using another device could cause duplicate refreshes, double check that each feed still hasn't been refreshed recently.
            let newNode = setToast(`Fetching ${feed.title} ${feed.site_url}.`);
            let res = await fetch(`https://reader.miniflux.app/v1/feeds/${feed.id}/refresh`, {
              method: "PUT",
              headers: { 'X-Auth-Token': apiKey }
            });
            newNode.textContent += ` Complete.`;
            countOfFeedsToRefresh--;
            setToast(`${countOfFeedsToRefresh} feeds left to refresh.`);
            document.getElementById('numberToRefresh').textContent = `${countOfFeedsToRefresh} feeds to refreshout of ${countOfFeeds}`;
          }
        }, 15000 * index); // Wait 15 seconds between refreshing feeds to avoid rate limiting.
    }
  }
  document.getElementById('numberToRefresh').textContent = `${countOfFeedsToRefresh} feeds to refresh out of ${countOfFeeds}`; // Set the status once as soon as refreshFeeds() runs. It will be updated as each feed is refreshed.
};

const setToast = (text, timeout = 4000) => {
  let newNode = document.createElement('div');
  newNode.id = `feedFetchStatus`;
  newNode.textContent = text;
  document.getElementById('toastDiv').appendChild(newNode);
  setTimeout(() => { newNode.remove(); }, timeout);
  return newNode;
};

// run once when the page is loaded.
window.addEventListener("DOMContentLoaded", refreshFeeds);