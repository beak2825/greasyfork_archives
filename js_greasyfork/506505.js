// ==UserScript==
// @name        Anilist Audience Score
// @namespace   Violentmonkey Scripts
// @match       https://anilist.co/*
// @grant       none
// @version     1.0
// @author      dylan-dang
// @description 9/2/2024, 12:22:50 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506505/Anilist%20Audience%20Score.user.js
// @updateURL https://update.greasyfork.org/scripts/506505/Anilist%20Audience%20Score.meta.js
// ==/UserScript==

const query = `
query ($userId: Int, $userName: String, $type: MediaType) {
  MediaListCollection(userId: $userId, userName: $userName, type: $type) {
    lists {
      name
      isCustomList
      isCompletedList: isSplitCompletedList
      entries {
        ...mediaListEntry
      }
    }
  }
}

fragment mediaListEntry on MediaList {
  status
  score
  media {
    type
    format
    status(version: 2)
    episodes
    volumes
    chapters
    averageScore
    popularity
  }
}`;

const observer = new MutationObserver(onMutation)

observer.observe(document, {
  childList: true,
  subtree: true,
});


let prevPathname = '';
let prevPath = [];

function isUserpage(path) {
  return path.length === 2 && path[0].toLowerCase() === 'user';
}

function onMutation(mutList) {
  const pathname = window.location.pathname;
  const path = pathname.split('/').filter(Boolean);
  if (pathname != prevPathname) {
    // detect user navigated between two different user pages since stats element won't be readded
    if (isUserpage(prevPath) && isUserpage(path)) {
      const audienceStat = document.querySelector('#audience-score');
      refreshAudienceScore(audienceStat, {
        type: 'ANIME',
        userName: path[1],
      });
    }
    prevPathname = pathname;
    prevPath = path;
  }

  for (const mut of mutList) {
    for (const node of mut.addedNodes) {
      const stats = node.querySelector?.('.list-stats>.stats-wrap');
      if (!stats) continue;
      if (!isUserpage(path)) return;

      // clone a stat element and add audience score
      const audienceStat = stats.lastChild.cloneNode(true);
      audienceStat.id = 'audience-score'
      audienceStat.querySelector('.label').textContent = 'Audience Score'
      audienceStat.querySelector('.value').textContent = '...';
      stats.appendChild(audienceStat);

      refreshAudienceScore(audienceStat, {
        type: 'ANIME',
        userName: path[1],
      });
    }
  }
}

function refreshAudienceScore(audienceStat, variables) {
  audienceStat.querySelector('.value').textContent = '...';

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  };
  fetch('https://graphql.anilist.co', options)
    .then((res) => res.json())
    .then(({data: {MediaListCollection: {lists}}}) => {
      const completed = lists.flatMap((list) => list.entries).filter(entry => entry.status === 'COMPLETED');
      const sumAudienceScore = completed.reduce((a, b) => a + b.media.averageScore, 0);
      const avgAudienceScore = sumAudienceScore / completed.length;
      // abort if client changed page before finishing
      if (window.location.pathname.split('/').filter(Boolean)[1] != variables.userName) return;
      audienceStat.querySelector('.value').textContent = avgAudienceScore.toFixed(1);
    });
}



