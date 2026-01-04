// ==UserScript==
// @name        Redirect Reddit www to old
// @description Redirects from www.reddit.com to corresponding old.reddit.com page
// @include     https://www.reddit.com/*
// @namespace   https://greasyfork.org/users/8233
// @license MIT
// @version 0.0.6
// @downloadURL https://update.greasyfork.org/scripts/451825/Redirect%20Reddit%20www%20to%20old.user.js
// @updateURL https://update.greasyfork.org/scripts/451825/Redirect%20Reddit%20www%20to%20old.meta.js
// ==/UserScript==


var oldurl = window.location.href;
var newurl = oldurl.replace('https://www.reddit.com/', 'https://old.reddit.com/');

// if the URL is to a media (image), gallery, notifications or poll, do not redirect, since they work only in new reddit
// if the URL are the same, do not redirect, something went wrong
// also prevents endless loops, our redirect is idempotent
if ((oldurl.indexOf('reddit.com/media') === -1) && (oldurl.indexOf('reddit.com/gallery/') === -1) && (oldurl.indexOf('reddit.com/notifications') === -1) && (oldurl.indexOf('reddit.com/poll/') === -1) && (oldurl !== newurl)) {

  	//big element over content, 30% transparent, to 
    var el = document.createElement('div');
    el.innerText = 'Redirecting to old.reddit.com';
    el.style.fontSize = '10vh';
    el.style.zIndex = 999123;
    el.style.position = 'fixed';
    el.style.left = '0';
    el.style.top = '0';
    el.style.width = '100%';
    el.style.height = '100%';
    el.style.textAlign = 'center';
    el.style.backgroundColor = 'rgba(127,127,127,0.7)';
    document.body.appendChild(el);

    window.location.href = newurl;
    //TODO: remove www. one from history or not? if yes - how?
}