// ==UserScript==
// @name     Minds.com - hide reminds
// @version  1
// @grant    none
// @require  https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @match    https://www.minds.com/*
// @author   monnef
// @description Hides reminds.
// @namespace   monnef.eu
// @downloadURL https://update.greasyfork.org/scripts/404868/Mindscom%20-%20hide%20reminds.user.js
// @updateURL https://update.greasyfork.org/scripts/404868/Mindscom%20-%20hide%20reminds.meta.js
// ==/UserScript==

const isRemind = (_, e) => $('.m-activityOwnerBlockremindIcon, .m-activityOwnerBlock__remindIcon', e).length !== 0;

const work = () => {
  const toHide = $('m-newsfeedentity, m-activity').filter(isRemind);
  toHide.css('display', 'none');
};

$(() => setInterval(work, 1000));

console.log('reminds hider started');
