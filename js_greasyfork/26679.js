// ==UserScript==
// @name         Wes Bos Courses Duration
// @namespace    https://github.com/xaxim/
// @version      0.4
// @description  Prints course duration on console
// @author       xaxim
// @match        https://javascript30.com/account/access/*
// @match        https://es6.io/account/access/*
// @match        https://reactforbeginners.com/account/access/*
// @match        https://sublimetextbook.com/account/access/*
// @match        https://flexbox.io/account/access/*
// @match        https://commandlinepoweruser.com/account/access/*
// @match        https://learnredux.com/account/access/*
// @match        https://masteringmarkdown.com/account/access/*
// @match        https://*/account/access/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26679/Wes%20Bos%20Courses%20Duration.user.js
// @updateURL https://update.greasyfork.org/scripts/26679/Wes%20Bos%20Courses%20Duration.meta.js
// ==/UserScript==

function getWesDuration(start = 0, end) {
  const timeNodes = Array.from(document.querySelectorAll('.duration'));
  const last = end || timeNodes.length;

  const seconds = timeNodes
    .filter((node) => {
      const videoNumber = parseFloat(node.parentNode.parentNode.parentNode.querySelector('.video-number').textContent);
      return videoNumber >= start && videoNumber <= last;
    })
    .map(node => node.textContent)
    .map((timeStr) => {
      const [mins, secs] = timeStr.split(':').map(parseFloat);
      return (mins * 60) + secs;
    })
    .reduce((total, current) => total + current);

  const minsPerHour = 60;
  const secsPerHour = minsPerHour * 60;

  let secondsLeft = seconds;

  const hours = Math.floor(secondsLeft / secsPerHour);
  secondsLeft %= secsPerHour;

  const minutes = Math.floor(secondsLeft / minsPerHour);
  secondsLeft %= minsPerHour;

  /* eslint-disable */
  console.log(`Duration of this course: ${hours} hours ${minutes} minutes and ${secondsLeft} seconds`);
  /* eslint-enable */
}

getWesDuration();
