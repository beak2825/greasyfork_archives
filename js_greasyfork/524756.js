// ==UserScript==
// @name         Test notifications
// @namespace    http://tampermonkey.net/
// @version      1970-1-1
// @description  test
// @author       幽月零
// @license MIT
// @match        https://sstm.moe/notifications/*
// @match        https://sstm.moe/topic/*
// @icon         https://s.sstmlt.com/board/monthly_2017_06/logo_1479532980294_5d1829.png.7c198e484115f85daaf0f04963f81954.png.418af10c64761f5ef969fe30c7992a40.png
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/524756/Test%20notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/524756/Test%20notifications.meta.js
// ==/UserScript==

(function() {
'use strict';

const ThreeDay = 259_200_000; // 86400 * 3 * 1000

function start() {
  if (window.location.pathname.split('/')[1] === 'topic') {
    topic();
  }
  else if (window.location.pathname.split('/')[1] === 'notifications') {
    notifications();
  }
}

function notifications() {
  document.querySelectorAll("li.ipsDataItem").forEach(dataItem => {
    const time = dataItem.querySelector('time');
    const dataTime = time && time.getAttribute('datetime');
    if (dataTime) {
      const timeStr = new Date(dataTime).toLocaleString(undefined, { hour12: false });
      time.textContent = timeStr;
      time.removeAttribute('title');
      time.setAttribute('data-title', timeStr);
    }

    const topicDom = dataItem.querySelector('div.ipsDataItem_main a');
    topicDom && tryGetForums(topicDom.href)
      .then(forum => {
        const mainDataItem = dataItem.querySelector('div.ipsDataItem_main');
        const forumTag = Object.assign(document.createElement('a'), {
          textContent: forum.name,
          href: forum.url
        });
        mainDataItem.appendChild(forumTag);
      })
      .catch(console.error)
    ;
  });
}

function topic() {
  const topicID = getTopicID(window.location.pathname);

  updateCache(document, topicID);
}

function updateCache(doc, topicID) {
  const {textContent: forumName, href: forumUrl} = doc.querySelector("#ipsLayout_mainArea > div.ipsPageHeader span.ipsType_light > a") || {};
  if (!forumName || !forumUrl) {
    console.error('Cannot find forum in page');
    return;
  }

  const forumID = getForumID(forumUrl);

  setTopics(topicID, forumID);
  return setForums(forumID, forumName, forumUrl);
}

function getForums() {
  return GM_getValue('forums', {});
}
function setForums(id, name, url) {
  const forums = getForums();
  if (!(id in forums)) {
    forums[id] = { name, url };
    GM_setValue('forums', forums);
  }
  return forums[id];
}

function getTopics() {
  return GM_getValue('topics', {});
}
function setTopics(topicID, forumID) {
  const topics = getTopics();
  topics[topicID] = { forumID, time: Number(new Date()) };
  GM_setValue('topics', topics);
  return topics[topicID];
}

function tryGetForums(topicUrl) {
  const topicID = getTopicID(topicUrl);
  if (!topicID) {
    return Promise.reject('Cannot find id of topic');
  }

  const topics = getTopics();
  if (topicID in topics) {
    const { forumID, time } = topics[topicID];
    if (new Date() - time < ThreeDay) {
      const forums = getForums();
      return Promise.resolve(forums[forumID]);
    }
  }

  // request new topic data
  const { origin, pathname } = new URL(topicUrl);
  return getTopic(origin + pathname, topicID);
}

const map = new Map();
// console.dir(map);
function getTopic(url, topicID) {
  if (map.has(url)) return map.get(url);

  const result = new Promise((resolve, reject) => {
    fetch(url)
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        map.delete(url);
        resolve(updateCache(doc, topicID));
      })
      .catch(reject)
    ;
  });
  map.set(url, result);
  return result;
}


function getTopicID(str) {
  const m = str.match(/topic\/(\d+)(?=-)/);
  return m ? Number(m[1]) : 0;
}

function getForumID(str) {
  const m = str.match(/forum\/(\d+)(?=-)/);
  return m ? Number(m[1]) : 0;
}


start();

})();