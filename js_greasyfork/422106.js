// ==UserScript==
// @name         perf on standings
// @namespace    https://twitter.com/koyumeishi_
// @version      0.2
// @description  display performance color on the standings
// @author       koyumeishi
// @match        https://atcoder.jp/contests/*/standings
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422106/perf%20on%20standings.user.js
// @updateURL https://update.greasyfork.org/scripts/422106/perf%20on%20standings.meta.js
// ==/UserScript==

let results = {};

const getPerfColor = (perf) => {
  perf = Math.max(0, perf);
  const colors = ['#b3b3b3', // gray
                  '#b79f8b', // brown
                  '#d6ffd6', // green
                  '#d1ffff', // cyan
                  '#dfdfff', // blue
                  '#ffffd4', // yellow
                  '#ffe0c4', // orange
                  '#ffc8c8', // red
                  "linear-gradient(to bottom right, silver, white)", // silver
                  "linear-gradient(to bottom right, gold, white)", // gold
                 ];
  return colors[ Math.min(Math.floor(perf/400), 9) ];
};

(function() {
  'use strict';

  const p = new Promise( (resolve, reject) => {
    let req = new XMLHttpRequest();
    req.open('GET', 'results/json');
    req.onload = () => {
      // console.log(req.responseText);
      if(req.status !== 200){
        reject();
        return;
      }
      resolve(req.responseText);
    };

    req.send();
  });

  const draw = () => {
    [...document.getElementsByClassName('standings-username')].forEach(td => {
      const userScreenName = td.getElementsByClassName('username').item(0).textContent.trim();
      // console.log(userScreenName);
      // console.log(userScreenName in results);
      if(userScreenName in results){
        td.previousElementSibling.style['background'] = getPerfColor(results[userScreenName]);
        td.previousElementSibling.setAttribute('title', `Performance: ${results[userScreenName]}`);
      }
    });
  };

  const startObserve = () => {
    // mutation observer
    const target = document.getElementById('vue-standings');

    const observer = new MutationObserver(records => {
      observer.disconnect();
      draw();
      console.log("restart observe");
      setTimeout(startObserve, 100);
    })

    observer.observe(target, {
      characterData: true,
      childList: true,
      subtree: true,
    });
  };

  p.then((t) => {
    const j = JSON.parse(t);
    j.filter(x => x.IsRated).forEach(x => {results[x.UserScreenName] = x.Performance;});
    // console.log(j);
    // console.log(results);

    // fire
    draw();
    startObserve();
  });

})();