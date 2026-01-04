// ==UserScript==
// @name          bgm-hover-subject-info
// @name:zh       鼠标指向条目链接时显示更多信息
// @namespace     https://trim21.me/
// @description   鼠标指向条目链接时弹出一个悬浮窗显示条目信息
// @version       0.2.18
// @source        https://github.com/trim21/bgm-tv-userscripts
// @supportURL    https://github.com/trim21/bgm-tv-userscripts/issues
// @license       MIT
// @match         https://bgm.tv/group/topic/*
// @match         https://bangumi.tv/group/topic/*
// @match         https://chii.in/group/topic/*
// @match         https://bgm.tv/index/*
// @match         https://bangumi.tv/index/*
// @match         https://chii.in/index/*
// @match         https://bgm.tv/rakuen/topiclist
// @match         https://bangumi.tv/rakuen/topiclist
// @match         https://chii.in/rakuen/topiclist
// @require       https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @run-at        document-end
// @grant         GM_info
// @author        Trim21 <i@trim21.me>
// @downloadURL https://update.greasyfork.org/scripts/437704/bgm-hover-subject-info.user.js
// @updateURL https://update.greasyfork.org/scripts/437704/bgm-hover-subject-info.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// external "$"
const external_$_namespaceObject = $;
;// ./scripts/hover-subject-info/src/utils.ts
function getSubjectID(s) {
  if (!s?.length) return undefined;
  if (s.startsWith('#')) {
    return;
  }
  if (s.startsWith('/')) {
    s = 'https://bgm.tv' + s;
  } else {
    if (!/^https?:\/\/(bgm\.tv|chii\.in|bangumi\.tv)\//.test(s)) {
      return;
    }
  }
  const u = new URL(s);
  const path = u.pathname;

  // [ '', 'subject', '8' ]
  const split = path.split('/');
  if (split.length >= 4) {
    return undefined;
  }
  if (split[1] === 'subject') {
    return parseInt(split[2], 10);
  }
  return undefined;
}
;// ./scripts/hover-subject-info/src/index.ts


const style = `
<style>
.d-block {
  display: block;
}
.d-flex {
  display: flex;
}

#popup {
  width: 30em;
  /*height: 15em;*/
  flex: auto;
  background: white;
  border: solid 1px black;
  position: absolute;
  padding: 0.5em;
  border-radius: 0.2em;
}
.tag .name {
  /*background-color: dodgerblue;*/
  /*color: white;*/
}

.popup-tags{
  display: block;
}

.tag {
  border-radius: 0.2em;
  border: solid 1px gray;
  padding: 0 0.3em;
}

.image {
  padding-right: 2px;
}

</style>
`;
function createPopup(subject) {
  let rank = '';
  if (subject.rating.rank) {
    rank = `<p class='rateInfo'>
<span class='starstop-s'><span class='starlight stars${Math.round(subject.rating.score)}'></span></span>
 <small class='fade'>${subject.rating.score}</small> <span class='tip_j'>(${subject.rating.total}人评分)</span>
</p>`;
  }
  let tags = '';
  if (subject.tags.length) {
    tags = "<div class='popup-tags'>" + subject.tags.sort((a, b) => b.count - a.count).slice(0, 10).map(value => `<span class='tag'><span class='name'>${value.name}</span> <small>${value.count}</small></span>`).join('\n');
    tags += '</div>';
  }
  return `
<div class='d-flex'>
  <span class='image d-block'>
    <img src='${subject.images?.small}' class='cover' alt='${subject.name}'>
  </span>
  <div class='d-block'>
    <h3>${subject.name}</h3>
    <small class='grey'>${subject.name_cn}</small>
    <p class='info tip'> ${subject.summary} </p>
  </div>
</div>

${rank}

${tags}
`;
}
function main() {
  external_$_namespaceObject('head').append(style);
  external_$_namespaceObject('a').each((i, e) => {
    if (getSubjectID(external_$_namespaceObject(e).attr('href'))) {
      external_$_namespaceObject(e).on('mouseover', hoverHandler).on('mouseleave', leaveHandler);
    }
  });
}
function leaveHandler() {
  external_$_namespaceObject('#popup').remove();
  console.log('leave');
}
function hoverHandler() {
  const e = external_$_namespaceObject(this);
  const href = e.attr('href');
  if (!href) {
    return;
  }
  const subjectID = getSubjectID(href);
  if (!subjectID) {
    return;
  }
  const offset = e.offset() ?? {
    left: 0,
    top: 0
  };
  external_$_namespaceObject('body').append('<div id="popup"> loading </div>');
  const popup = external_$_namespaceObject('#popup').css({
    left: offset.left,
    top: offset.top + 40,
    position: 'absolute',
    'z-index': 1000
  });
  (async function () {
    const res = await getWithCache(subjectID);
    if (res.status > 400) {
      popup.html('not found');
      return;
    }
    const data = await res.json();
    let html = createPopup(data);
    if (res.redirected) {
      html = '条目被合并到此条目' + html;
    }
    popup.html(html);
  })().catch(console.error);
}
const c = {};
async function getWithCache(subjectID) {
  if (subjectID in c) {
    if (c[subjectID].createdAt + 1000 * 60 * 5 > new Date().getTime()) {
      // cache request in 5min
      return c[subjectID].res.clone();
    }
  }
  const res = await fetch(`https://api.bgm.tv/v0/subjects/${subjectID}`);
  c[subjectID] = {
    res: res.clone(),
    createdAt: new Date().getTime()
  };
  return res;
}
main();
/******/ })()
;