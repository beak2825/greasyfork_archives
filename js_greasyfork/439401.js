// ==UserScript==
// @name         Twitter show followers per day
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  show followers per day on each user's page right after number of followers
// @author       0x_bear
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @grant        none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @require https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439401/Twitter%20show%20followers%20per%20day.user.js
// @updateURL https://update.greasyfork.org/scripts/439401/Twitter%20show%20followers%20per%20day.meta.js
// ==/UserScript==

function showFollowersPerDay (jNode) {
    var parent = document.querySelector('div.css-1dbjc4n.r-13awgt0.r-18u37iz.r-1w6e6rj')
    var node = parent.children.item(1)
    if (parent.children.length < 3) {
        var cln = node.cloneNode(true)
        node.style.marginRight='20px'
        parent.appendChild(cln)
    } else {
        var cln = parent.children.item(2)
        cln.innerHTML = node.innerHTML
    }
    cln.innerHTML = cln.innerHTML.replace("Followers","Followers per day")
    cln.innerHTML = cln.innerHTML.replace("/followers","")

    // calculate and update number
    var joinedDate = document.evaluate("//span[contains(., 'Joined')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext().children[1].innerText.substring(7)
    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var d = new Date(joinedDate.split(' ')[1],month.indexOf(joinedDate.split(' ')[0]),15)
    var dn = new Date() //now
    var daysPassed = (dn-d)/1000/60/60/24
    var numFollowersText = cln.children[0].children[0].children[0].innerText.replace(',','')
    if (numFollowersText.search('K')>-1) {
        var numFollowers = numFollowersText.substring(0,numFollowersText.length-1)*1e3
    } else if (numFollowersText.search('M')>-1) {
        var numFollowers = numFollowersText.substring(0,numFollowersText.length-1)*1e6
    }
    else {var numFollowers = numFollowersText*1}
    cln.children[0].children[0].children[0].innerText = Math.round(numFollowers/daysPassed)
    }

waitForKeyElements ("a[href*='/followers']", showFollowersPerDay,true);

let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    onUrlChange();
  }
}).observe(document, {subtree: true, childList: true});

 function onUrlChange() {
    showFollowersPerDay();
}