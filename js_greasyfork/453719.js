// ==UserScript==
// @name        Post Date Checker for mojoPortal.com
// @namespace   https://github.com/daggontale/Violentmonkey_scripts
// @match       https://www.mojoportal.com/forums*
// @grant       none
// @license     MIT
// @version     1.3
// @author      Joey Stombaugh
// @description Checks mojoportal forums for a new post and notifies if so
// @downloadURL https://update.greasyfork.org/scripts/453719/Post%20Date%20Checker%20for%20mojoPortalcom.user.js
// @updateURL https://update.greasyfork.org/scripts/453719/Post%20Date%20Checker%20for%20mojoPortalcom.meta.js
// ==/UserScript==

// Variables
var DATE_BLACKLIST = [];

// Functions

function removeDay(daysToRemove) {
	return new Date(new Date().getTime() - (8.64e+7 * daysToRemove));
}

function createNotificationNode(timeRefreshed, displayArr) {
	const notif = document.createElement('div');
	notif.classList.add('card');

	const cardTime = document.createElement('div');
	cardTime.classList.add('card__time');
	cardTime.innerText = timeRefreshed;

	const posts = document.createElement('div');
	posts.classList.add('card__body');

	if (displayArr.length == 0) {
		posts.innerHTML = 'No new posts.';
	} else {
		posts.innerHTML = displayArr;
	}

	document.body.appendChild(notif);
	notif.appendChild(cardTime);
	notif.appendChild(posts);
}

// Code

const style = document.createElement('style');
style.innerHTML = '.card{position:fixed;top:50%;transform:translate(0,-50%);right:10px;border:1px solid gray;border-radius:5px;max-width:175px;background-color: aliceblue}.card__time{font-size:larger;text-align:center;border-bottom:1px solid gray;padding:5px 5px 3px}.card__body{padding:5px}';
document.head.appendChild(style);

const dateElementNodeList = document.querySelectorAll('.fpostdate');

const dateTitleArray = Array.from(dateElementNodeList).map(element => {

  const title = element.parentNode.querySelector('.ftitle > h3 > a:nth-child(3)')?.textContent;

  return {
      title,
      date: new Date(element.textContent)
  };
});

console.log(dateTitleArray);

const datesFromYesterdayArray = dateTitleArray.filter(x => {
  return new Date(x.date) > removeDay(1) && !DATE_BLACKLIST.includes(x.date.toLocaleDateString());
});

const datesFromThisWeekArray = dateTitleArray.filter(x => {
  return new Date(x.date) > removeDay(5) && !datesFromYesterdayArray.includes(x) && !DATE_BLACKLIST.includes(x.date.toLocaleDateString());
});

const currentPosts = []
const refreshTime = new Intl.DateTimeFormat('en-US', {timeStyle: 'short', hourCycle: 'h12' }).format(Date.now());

datesFromYesterdayArray.forEach(x => currentPosts.push(`New Post to <strong>${x.title}</strong> in the last 24 hours. (${x.date.toLocaleDateString()})`));
datesFromThisWeekArray.forEach(x => currentPosts.push(`New Post to <strong>${x.title}</strong> in the past week. (${x.date.toLocaleDateString()})`));

createNotificationNode(refreshTime, currentPosts);

if (currentPosts.length != 0) {
	window.alert('New Posts!')
}

setTimeout(() => { location.reload() }, 1800000);
