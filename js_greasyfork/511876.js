// ==UserScript==
// @name        LinkedIn - Remove Reactions, Suggested Posts, Promoted Posts
// @namespace   MadManMoon Scripts
// @match       https://www.linkedin.com/*
// @grant       none
// @version     2.0
// @license     MIT
// @author      MadManMoon
// @description This removes any feed posts that are a reaction other than a comment or repost, plus promoted content. Video removal is currently being reconsidered.
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require     https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/511876/LinkedIn%20-%20Remove%20Reactions%2C%20Suggested%20Posts%2C%20Promoted%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/511876/LinkedIn%20-%20Remove%20Reactions%2C%20Suggested%20Posts%2C%20Promoted%20Posts.meta.js
// ==/UserScript==

// Check Url For Queries
const UrlHasQueries = (location.search !== null && location.search !== '');
// Reverse that value
const UrlIsNormal = !UrlHasQueries;

// Remove LinkedIn Reactions
VM.observe(document.body, () => {
  // Current Reaction Filters
  var LiReacshunz = [
    "likes this",
    "loves this",
    "supports this",
    "celebrates this",
    "finds this funny",
    "finds this insightful",
    "liked a contribution"
  ];
  // Join reactions into usable set of CSS selectors
  var LiReactzNodez = LiReacshunz.join('"), div.relative[data-id^="urn:li:activity:"] * span.update-components-header__text-view:contains("');
  // Set Mutation Observer Node
  const $node = $('div.relative[data-id^="urn:li:activity:"] * span.update-components-header__text-view:contains("'+LiReactzNodez+'")');
  // Run if mutation observer hits
  if ($node.length) {
    // Run if URL doesn't have queries (ie. is a user defined LI page)
    if (UrlIsNormal){
      // For each valid node
      $node.each(function(){
        // Get the nearest identifiable parent item node in the list
        let LiRelativeNode = $(this).closest('div:has( > div.relative[data-id^="urn:li:activity"] )');
        // Remove the previous marker
        $(LiRelativeNode).prev('h2.feed-skip-link__container').remove ();
        // Remove the parent div
        $(LiRelativeNode).remove ();
      });
    }
    // disconnect observer - This is disabled as if you disconnect it will not recognise new items on infinite scroll content
    // return true;
  }
});

// Remove LinkedIn Videos and Promoted
// I have temporarily removed the 'videos' part of this as I am having a think about it.
// Promoted: a[aria-label~="Promoted"]
// ...
// Video: div.update-components-linkedin-video.feed-shared-update-v2__content.feed-shared-update-v2__content--simplification
VM.observe(document.body, () => {
  const $node = $('span[class*="update-components-actor"][class*="description"]:has( > span[aria-hidden="true"], > span.visually-hidden ) > span[aria-hidden="true"]').filter(function() {return $.trim($(this).text().toLowerCase()) === 'promoted' || $.trim($(this).text().toLowerCase()).slice(0,11) === 'promoted by';});
  if ($node.length) {
    if (UrlIsNormal){
      $node.each(function(){
        let LiRelativeNode = $(this).closest('div:has( > div.relative[data-id^="urn:li:activity"] )');
        $(LiRelativeNode).prev('h2.feed-skip-link__container').remove ();
        $(LiRelativeNode).remove ();
      });
    }
    // disconnect observer - This is disabled as if you disconnect it will not recognise new items on infinite scroll content
    // return true;
  }
});

// Remove 'suggested' pop-unders such as "Check out other posts from MadManMoon"
VM.observe(document.body, () => {
  const $node = $('div[class^="feed-shared-update-attachments"], div[class*=" feed-shared-update-attachments"]');
  if ($node.length) {
    if (UrlIsNormal){
      $node.each(function(){
        $(this).remove ();
      });
    }
    // disconnect observer - This is disabled as if you disconnect it will not recognise new items on infinite scroll content
    // return true;
  }
});