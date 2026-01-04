// ==UserScript==
// @name        DPPVAF2025
// @namespace   io.github.poneyclairdelune.derpi2025Viewer
// @match       https://derpibooru.org/profiles/*
// @homepage    https://github.com/PoneyClairDeLune/custom-utils/blob/main/derpibooru/dppvaf2025.user.js
// @grant       none
// @version     0.3.4
// @author      -
// @description Personal score viewer for Derpibooru April Fool's 2025
// @run-at      document-idle
// @license     GNU AGPL v3.0
// @downloadURL https://update.greasyfork.org/scripts/531746/DPPVAF2025.user.js
// @updateURL https://update.greasyfork.org/scripts/531746/DPPVAF2025.meta.js
// ==/UserScript==
"use strict";

const scoreClassRender = [[25000, 'max'], [10000, 'afk'], [5000, 'sweat'], [2500, 'idk'], [1500, 's'], [900, 'a'], [600, 'b'], [400, 'c'], [250, 'd'], [100, 'e'], [0, 'f']];
const getScoreClassRender = (score, isCheater) => {
  if (isCheater) {
    return 'cheater';
  };
  for (let nibble of scoreClassRender) {
    if (score >= nibble[0]) {
      return nibble[1];
    };
  };
  return 'cheater';
};
const scoreClassTier = [[5000, 'True Gamer'], [2500, 'Diamond'], [1500, 'Platinum'], [900, 'Gold'], [400, 'Silver'], [1, 'Bronze'], [0, 'Blank']];
const getScoreClassTier = (score, isCheater) => {
  if (isCheater) {
    return "Cheetah";
  };
  for (let nibble of scoreClassTier) {
    if (score >= nibble[0]) {
      return nibble[1];
    };
  };
  return "Cheetah";
};
const achievementDetails = JSON.parse(`[{"n":"Page Loader","d":"Load any page","p":5,"i":false},{"n":"Achievement Viewer","d":"View your achievements","p":5,"i":false},{"n":"Do Nothing 1","d":"Do nothing for 5 seconds","p":5,"i":false},{"n":"Do Nothing 2","d":"Do nothing for 1 minute","p":10,"i":false},{"n":"Do Nothing 3","d":"Do nothing for 10 minutes","p":20,"i":false},{"n":"Do Nothing 4","d":"Do nothing for 30 minutes","p":100,"i":false},{"n":"Do Nothing 5","d":"Do nothing for 1 hour","p":500,"i":false},{"n":"Do Nothing 6","d":"Do nothing for 2 hours","p":1000,"i":false},{"n":"Do Nothing 7","d":"Do nothing for 6 hours","p":2500,"i":false},{"n":"Touch Grass","d":"Do nothing for a day","p":5000,"i":false},{"n":"Mouse Mover","d":"Move the mouse! Or finger.","p":5,"i":false},{"n":"Secret Achievement","d":"Very sneaky...","p":99,"i":true},{"n":"Clicker","d":"You sure love clicking something!","p":5,"i":false},{"n":"Touchscreen User","d":"You can touch! Wow!","p":5,"i":false},{"n":"The First of Many","d":"The image where the journey began","p":5,"i":false},{"n":"Nice","d":"Seks number is very funny","p":5,"i":false},{"n":"Image Viewer","d":"View any image!","p":5,"i":false},{"n":"Khajit Has the Wares","d":"...if you have the coin","p":5,"i":false},{"n":"What a bunch of losers","d":"Visit the site staff page","p":5,"i":false},{"n":"Index Get","d":"That's a lot of zeroes...","p":10,"i":false},{"n":"Resetter","d":"Reset all your achievements","p":10,"i":false},{"n":"Uploader","d":"You're gonna upload, right? Right?","p":5,"i":false},{"n":"Debater","d":"Visit the forums","p":5,"i":false},{"n":"Clicker 2","d":"Click 5 times, impressive achievement","p":5,"i":false},{"n":"Clicker 3","d":"Click 20 times, keep going...","p":10,"i":false},{"n":"Clicker 4","d":"Click 100 times, yes, more!","p":20,"i":false},{"n":"Clicker 5","d":"Click 500 times, almost there!","p":30,"i":false},{"n":"Clicker God","d":"Click 1000 times, ahh, bliss!","p":50,"i":false},{"n":"Upvoter","d":"Upvote something!","p":10,"i":false},{"n":"Upvoter 2","d":"Upvote 10 images!","p":20,"i":false},{"n":"Upvoter 3","d":"Upvote 50 images!","p":30,"i":false},{"n":"Upvoter God","d":"Upvote 100 images!","p":50,"i":false},{"n":"Mouse Mover 2","d":"Move the mouse over 1000 pixels","p":5,"i":false},{"n":"Mouse Mover 3","d":"Move the mouse over 10K pixels","p":10,"i":false},{"n":"Mouse Mover 4","d":"Move the mouse over 100K pixels","p":20,"i":false},{"n":"Mouse Mover 5","d":"Move the mouse over 1M pixels","p":30,"i":false},{"n":"The Great Mouser","d":"Move the mouse over 10M pixels","p":50,"i":false},{"n":"Mouse Mover Infinity","d":"Move the mouse a bit too hard","p":1,"i":true},{"n":"Wait, that's just the homepage","d":"Always has been","p":5,"i":false},{"n":"Home, sweet home","d":"Visit the homepage","p":5,"i":false},{"n":"Exhibitionist","d":"View the galleries list","p":5,"i":false},{"n":"Mom look I am on TV","d":"View the livestreams directory","p":5,"i":false},{"n":"Seeker","d":"Search for something!","p":5,"i":false},{"n":"Reverse Seeker","d":"Search for an image which you already have","p":5,"i":false},{"n":"Wall of Green","d":"Visit the tags directory","p":5,"i":false},{"n":"Sensational Headlines","d":"View recent comments","p":5,"i":false},{"n":"Trendy Brandy","d":"View currently trending images","p":5,"i":false},{"n":"Manuscripts of the Ancients","d":"View a static page","p":5,"i":false},{"n":"Read the Rules","d":"Seriously, read them, carefully.","p":10,"i":false},{"n":"Page Loader 2","d":"Load 5 pages","p":10,"i":false},{"n":"Page Loader 3","d":"Load 20 pages","p":15,"i":false},{"n":"Page Loader 4","d":"Load 50 pages","p":20,"i":false},{"n":"Page Loader 5","d":"Load 500 pages","p":30,"i":false},{"n":"Page Loader God","d":"Load 1000 pages","p":50,"i":false},{"n":"Faver","d":"Favorite something!","p":10,"i":false},{"n":"Faver 2","d":"Favorite 10 images!","p":20,"i":false},{"n":"Faver 3","d":"Favorite 50 images!","p":30,"i":false},{"n":"Faver God","d":"Favorite 100 images!","p":50,"i":false},{"n":"I swear I'm 18","d":"Visit the filters page","p":5,"i":false},{"n":"Private Communications","d":"Visit the private messages page","p":5,"i":false},{"n":"Latest Happenings","d":"At least these don't make that chirping noise...","p":5,"i":false},{"n":"It's you!","d":"Visit your own user profile","p":10,"i":false},{"n":"Stalker Behavior","d":"Stalk someone's user profile","p":5,"i":false},{"n":"Tag Editor","d":"Edit some tags","p":10,"i":false},{"n":"Tagger 2","d":"Edit tags 5 times","p":20,"i":false},{"n":"Tagger 3","d":"Edit tags 20 times","p":30,"i":false},{"n":"Tagger 4","d":"Edit tags 50 times","p":50,"i":false},{"n":"Tag God","d":"Edit tags 100 times","p":100,"i":false},{"n":"Eww Anthro","d":"...but seriously if you don't like it, just filter it, rather than commenting on it, you know who you are.","p":5,"i":false},{"n":"Spicy Browsing","d":"Let's hope you're not at work","p":5,"i":false},{"n":"Fearless Browsing","d":"Use the 'Everything' filter","p":5,"i":false},{"n":"Shameless Plug","d":"Locate the artist tags of the site admins","p":10,"i":false},{"n":"Furry!","d":"Fluffy critters, these things... fluffy critters","p":5,"i":false},{"n":"Gamer","d":"Input the Konami code","p":30,"i":false},{"n":"True Gamer","d":"Input the full Konami code","p":50,"i":false},{"n":"Best Pony","d":"Type the name of the best pony","p":5,"i":false},{"n":"The Other Best Pony","d":"Type the name of the ACTUAL best pony","p":10,"i":false},{"n":"Cry About It","d":"Complain about the event","p":0,"i":false},{"n":"Thanks","d":"Praise the event","p":10,"i":false},{"n":"Eww Politics","d":"Say something political","p":5,"i":false},{"n":"😳","d":"L-Lewd...","p":10,"i":false},{"n":"Pepper","d":"Spot a repper","p":10,"i":false},{"n":"Scroller","d":"Scroll the page","p":5,"i":false},{"n":"Scroller 2","d":"Scroll 1000 pixels","p":5,"i":false},{"n":"Scroller 3","d":"Scroll 10K pixels","p":15,"i":false},{"n":"Scroller 4","d":"Scroll 100K pixels","p":20,"i":false},{"n":"Scroller 5","d":"Scroll 1M pixels","p":30,"i":false},{"n":"Scroller God","d":"Scroll 10M pixels","p":50,"i":false},{"n":"Downvote = Ban","d":"Locate the artist tags of the site staff","p":10,"i":false},{"n":"Help Me","d":"Site staff provide many opportunities for contacting them","p":5,"i":false},{"n":"Thorty Dorra Plz","d":"Consider the benefits of the Derpibooru Premium subscription!","p":5,"i":false},{"n":"Upvoter Overlord","d":"Upvote 1000 images!","p":150,"i":false},{"n":"Faver Overlord","d":"Favorite 1000 images!","p":150,"i":false},{"n":"Upvoter Infinity","d":"Upvote 10000 images!","p":500,"i":false},{"n":"Faver Infinity","d":"Favorite 10000 images!","p":500,"i":false},{"n":"Tag Overlord","d":"Edit tags 250 times","p":250,"i":false},{"n":"The Living Tag","d":"Edit tags 1000 times","p":1000,"i":false},{"n":"Commenter","d":"Post a comment","p":5,"i":false},{"n":"Wall Poster","d":"If you get this achievement you are holding it wrong","p":1,"i":true},{"n":"Commenter 2","d":"Post 5 comments","p":10,"i":false},{"n":"Commenter 3","d":"Post 10 comments","p":15,"i":false},{"n":"Commenter 4","d":"Post 25 comments","p":30,"i":false},{"n":"Commenter 5","d":"Post 50 comments","p":75,"i":false},{"n":"Commenter God","d":"Post 100 comments","p":150,"i":false},{"n":"Poster","d":"Post a reply to a forum topic","p":5,"i":false},{"n":"Poster 2","d":"Post 5 replies to forum topics","p":10,"i":false},{"n":"Poster 3","d":"Post 10 replies to forum topics","p":15,"i":false},{"n":"Poster 4","d":"Post 25 replies to forum topics","p":30,"i":false},{"n":"Poster 5","d":"Post 50 replies to forum topics","p":75,"i":false},{"n":"Poster God","d":"Post 100 replies to forum topics","p":150,"i":false},{"n":"The Beginning","d":"Your journey begins! Unlock any achievement.","p":5,"i":false},{"n":"The Plot Thickens","d":"You earned enough points for a silver trophy, keep it up!","p":10,"i":false},{"n":"Getting Stronger","d":"At 900 points you are eligible for a gold trophy, you really are good at this.","p":20,"i":false},{"n":"Hard Stuck Plat","d":"Platinum trophy is obtained at 1500 points! I bet you hope you don't get stuck at this level.","p":30,"i":false},{"n":"DIAMONDS!!!","d":"Your quest has led you to obtain the diamond trophy at 2500 point!","p":50,"i":false},{"n":"The One","d":"You are the one true gamer (5000 points).","p":100,"i":false},{"n":"IT'S OVER 9000!!!","d":"Obtain more than 9000 points.","p":250,"i":false},{"n":"Journey's End","d":"Unlock every single other achievement.","p":11020,"i":false}]`);
const calculateAchievements = () => {
  let totalScore = 0;
  let isCheater = false;
  let clientSet = new Set();
  for (let e of localStorage.getItem("achievements").split(",")) {
    let achievementId = parseInt(e);
    if (Number.isNaN(e) || e === null || e === undefined) {
      continue;
    };
    let tA = achievementDetails[achievementId];
    if (tA) {
      if (tA.i) {
        console.debug(`Cheetah found: ${e} @ ${tA.p}pt (${tA.n})`);
        isCheater = true;
      };
      totalScore += tA.p;
    } else {
      console.debug(`Invalid achievement found: ${e}`);
      isCheater = true;
    };
  };
  return [totalScore, isCheater];
};
const statsDetails = {
  "ach_mousedistance": "Mouse travelled",
  "ach_scroll": "Mouse scrolled",
  "ach_mouseclicks": "Mouse clicks",
  "ach_pageloads": "Page loads",
  "ach_tagedits": "Tag edits",
  "ach_faves": "Faves",
  "ach_upvotes": "Upvotes",
  "ach_comments": "Comments",
  "ach_posts": "Forum posts"
};

const createDiv = (classList, content) => {
  let el = document.createElement("div");
  if (classList?.length > 0) {
    for (let e of classList) {
      el.classList.add(e);
    };
  };
  if (content?.length > 0) {
    for (let e of content) {
      el.append(e);
    };
  };
  return el;
};
const renderAchTree = () => {
  let renderTitle = createDiv(["block__header"]);
  renderTitle.innerHTML = `<span class="block__header__title">April Fool's 2025 Achievements Earned</span>`;
  let renderList = [], renderedAchievements = 0;
  let achList = localStorage.getItem("achievements").split(",").map((e) => {return parseInt(e)}).sort((a, b) => {return a - b;}).sort((a, b) => {return (achievementDetails[b]?.p ?? 0) - (achievementDetails[a]?.p ?? 0)});
  for (let achId of achList) {
    let achObj = achievementDetails[achId];
    if (!achObj) {
      continue;
    };
    let e0 = document.createElement("b");
    e0.append(achObj.n);
    let e = createDiv(["block__content", "alternating-color"], [e0, ` (${achObj.p} pt): ${achObj.d}`]);
    if (achObj.i) {
      e.classList.add("d2v-ach-honeypot");
    };
    renderList.push(e);
    renderedAchievements ++;
  };
  renderTitle.append(`(${renderedAchievements}/115+3)`);
  return createDiv(["block"], [renderTitle, createDiv(["block__content"], [createDiv(["block"], renderList)])]);
};
const renderStatTree = () => {
  let renderTitle = createDiv(["block__header"]);
  renderTitle.innerHTML = `<span class="block__header__title">April Fool's 2025 Statistics</span>`;
  let renderList = [];
  for (let key in statsDetails) {
    let e0 = document.createElement("b");
    e0.append(statsDetails[key]);
    renderList.push(createDiv(["block__content", "alternating-color"], [e0, `: ${localStorage.getItem(key) ?? "0"}`]));
  };
  return createDiv(["block"], [renderTitle, createDiv(["block__content"], [createDiv(["block"], renderList)])]);
};

let scoreVerdict = calculateAchievements();
let scoreMount = document.createElement("div");
scoreMount.classList.add("d2v-rank");
scoreMount.classList.add(`d2v-rank-${getScoreClassRender(... scoreVerdict)}`);
let avatarMounter = document.querySelector("div.profile-top__avatar");
let achListMounter = document.querySelector("div.column-layout__main");
if (avatarMounter.querySelector("a")) {
  scoreMount.innerHTML = `<span><b>Points</b>: ${scoreVerdict[0]}</span><br/><span><b>Rank</b>: ${getScoreClassTier(... scoreVerdict)}</span>`;
  avatarMounter.appendChild(scoreMount);
  achListMounter.appendChild(renderStatTree());
  achListMounter.appendChild(renderAchTree());
  let styles = document.createElement("style");
  styles.innerHTML = `.d2v-ach-honeypot {outline: 1px solid #f00}.d2v-rank {padding: 4px;text-align: center;color: #ddd;margin: 2px;}.d2v-rank-f {background: #317a7a;}.d2v-rank-e {background: #1a6b28;}.d2v-rank-d {background: #1d3163;}.d2v-rank-c {background: #431d63;}.d2v-rank-b {background: #631d41;}.d2v-rank-a {background: #967b02;}.d2v-rank-s {background: #c24b07;}.d2v-rank-idk {background: linear-gradient(30deg, #ad0802, #dd3502, #f08a36);}.d2v-rank-sweat {background: linear-gradient(to right, #940101, #832c04, #8f8f00, #008100, #094088, #850b85);}.d2v-rank-afk {background: linear-gradient(to right, #850b85, #6803c7, #2806bd);}@keyframes gradient {0% {background-position: 0% 50%;}50% {background-position: 100% 50%;}100% {background-position: 0% 50%;}}.d2v-rank-max{background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);background-size: 400% 400%;animation: gradient 15s ease infinite;font-weight: bold;}.d2v-rank-cheater{background: #801c26;}`;
  document.head.appendChild(styles);
};