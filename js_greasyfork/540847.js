// ==UserScript==
// @name         MyAnimeList to HiAnime Button
// @namespace    https://greasyfork.org/users/1470715
// @author       cattishly6060
// @description  Add a button that opens HiAnime
// @match        https://myanimelist.net/anime/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myanimelist.net
// @grant        none
// @version      1.2
// @license      0BSD
// @downloadURL https://update.greasyfork.org/scripts/540847/MyAnimeList%20to%20HiAnime%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/540847/MyAnimeList%20to%20HiAnime%20Button.meta.js
// ==/UserScript==

const iconImgBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAA8UExURUdwTDc1Xjg1Xjc1Xjg2XzIxVjAuUTY0XCQkUqWIpoJ3lDk3Yv7+/8jH0dOdwf+74Gpbfz88bD06aP///yqsrWcAAAAFdFJOUwAkaZbYBS65DQAAAAFiS0dEEwy7XJYAAAAHdElNRQfpBhoBORxWPBlzAAADA0lEQVRYw6WXiZqrIAxGUYGotL2S93/YK2SBuHTameCSADn8oO0nzhkbxsmHeGvBT+Pg7m308QPz4116+CS92hVi+Gh0VXGayPhN+oWI6dv8GKc/5hvC1/oPsxhC7MtuIZJHh3rBelFW0ltACOW8DTUI0evzp06tK9eQqxVyaUyaBMQj3w7dj9ludCEBbPHoHCpsSNFYV+D3VlZhMPBTj58QQ5vB72x0U70Dx3O1blxpCHGeT427TXUJgE4IsFRbZ4mDtMR1EQvcUi/eJfXL8aj2nDlmxn7Or39ic2hjBnDiUagAwQq9AV5zGy8AOO5XQmgA0Eru2ANKC9RmKArEqxcLkJYCWASwzNDkQXDU6wQIMgajDEAlkIKGgF5BfWZBWqIC1tgrA0eJQMgkgDhvy/P5XPLMgzXA1hJKizORKtieD3Z5gLgKIPPQbAagCpZHs5rQAVI33gkAjws7KAg241KBtbLsELb2GrwBXCogCT1AZ5EKIJU7labgmWPQhVzDASAZ5e44n7DJqJ67SKewzJzADKfD18Ip1Cmu8lRTgiyAwOmUkBxnGkDJSCWpAyD/G2zA3TnDiUuHZpx49G7Hoo1MFdRUJlgFqec1k+mS7yS9hthngJ3RLmEXAT2omEs9G62CPoS07P8pr21O1pwB3gP0Pdifwg3ATvoU6l/aCm8AtwpUwD6LcAPAdwqC/p/sv2cLwETlqACtgg4AKaGWXQEmOmrpFKDhHaaAejpkEpqMAw8T6CJuvQBEl4lAsb78iIdQCRtgn++db8F+rmQ23Gp72JbXsuKej7WNON5NiFJVdNQXG7iLvK/SFtr68ZA4uVHixkW9tha+JzxEoxvwwtLbsI/3b03/c6/LqhqUT80R/2D1SzP/Pj/Tp65EP3Y/VfD3uq9NuRy1ZLqWA8XFztd2L5/72HXoHc09uOLoxmnMORM659av+aaqxd22acqiWTHWN1VcbTdNtlunRqXknoeHfJnFF3baew7+m3R/tYP+QsTt7vkjFbebb9n+v6H48/b/PzXhnUwRVDrjAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDI1LTA2LTI2VDAxOjU3OjI4KzAwOjAwYrNEpgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyNS0wNi0yNlQwMTo1NzoyOCswMDowMBPu/BoAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjUtMDYtMjZUMDE6NTc6MjgrMDA6MDBE+93FAAAAAElFTkSuQmCC";

(function() {
  'use strict';

  try {
    /** @type {?HTMLDivElement} */ // for desktop
    const statusBlock = document.querySelector('.user-status-block');

    /** @type {?HTMLDivElement} */ // for mobile
    const statusFrame = document.querySelector('.status-unit-block .status-frame');

    // Create url
    const title = (document.querySelector('.title-english')?.innerText
      || document.querySelector('.title-name')?.innerText
      || "").trim();
    const query = encodeURIComponent(title);
    const url = `https://hianime.to/search?keyword=${query}`;

    if (statusBlock) {
      // for desktop
      const style = "position: absolute; padding-left: 7px; top: 4px;";
      const a = createLink(url, title, style);
      a.innerHTML = `<img class="tick" width="30" height="30" src="${iconImgBase64}">`;
      statusBlock?.appendChild(a);
    } else {
      // for mobile
      const style = "padding-right: 14px; padding-top: 4px;";
      const a = createLink(url, title, style);
      a.innerHTML = `<img class="tick" width="30" height="30" src="${iconImgBase64}">`;
      statusFrame?.appendChild(a);
    }

  } catch (err) {
    console.error(`|| ERROR (MyAnimeList to HiAnime Button):`, err); // todo log
  }

  function createLink(href, title, style) {
    const a = document.createElement('a');
    a.target = '_blank';
    a.rel = 'noreferrer,noopener';
    a.href = href;
    a.title = title;
    a.style = style;
    return a;
  }
})();
