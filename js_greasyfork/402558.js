// ==UserScript==
// @name         班固米马赛克瓷砖
// @version      0.1.1
// @description  https://bgm.tv/group/topic/344198
// @namespace    https://bangumi-mosaic-tile.aho.im/
// @include      /^https?:\/\/(bgm\.tv|chii\.in|bangumi\.tv)\/anime\/list\/\w+/
// @include      /^https?:\/\/(bgm\.tv|chii\.in|bangumi\.tv)\/user/.+/
// @author       Zhenye Wei
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402558/%E7%8F%AD%E5%9B%BA%E7%B1%B3%E9%A9%AC%E8%B5%9B%E5%85%8B%E7%93%B7%E7%A0%96.user.js
// @updateURL https://update.greasyfork.org/scripts/402558/%E7%8F%AD%E5%9B%BA%E7%B1%B3%E9%A9%AC%E8%B5%9B%E5%85%8B%E7%93%B7%E7%A0%96.meta.js
// ==/UserScript==

const style = `
.mosaic-tile {
  text-align: center;
  overflow-x: auto;
}
.mosaic-tile__tip {
  font-family: Courier;
  position: fixed;
  z-index: 99999;
  padding: 10px;
  font-size: 12px;
  color: #959da5;
  text-align: center;
  background: rgba(0,0,0,0.8);
  border-radius: 3px;
}
.mosaic-tile__tip::after {
  position: absolute;
  bottom: -10px;
  left: 50%;
  width: 5px;
  height: 5px;
  box-sizing: border-box;
  margin: 0 0 0 -5px;
  content: " ";
  border: 5px solid transparent;
  border-top-color: rgba(0,0,0,0.8);
}
.mosaic-tile__tip strong {
  color: #dfe2e5;
}
`;
const $style = document.createElement('style');
$style.type = 'text/css';
$style.id = 'bangumi-mosaic-tile-style';
$style.appendChild(document.createTextNode(style));
document.head.appendChild($style);

const [username, page = '', subpage = ''] = (() => {
  const { pathname } = window.location;
  if (/^\/user/.test(pathname)) {
    return pathname.match(/\/user\/(\w+)\/?(\w+)?\/?(\w+)?/).slice(1, 4);
  }
  if (/^\/anime\/list/.test(pathname)) {
    return pathname.match(/\/anime\/list\/(\w+)/).slice(1, 2).concat('subject');
  }
  return ['', '', ''];
})();

if (!username) {
  throw new Error('username is not detected');
}

function html(str) {
  const $div = document.createElement('div');
  $div.className = 'mosaic-tile';
  $div.innerHTML = str;
  return $div;
}
function insertAfter(selectors) {
  return (svg) => {
    const $el = document.querySelector(selectors);
    return $el.parentNode.insertBefore(html(svg), $el.nextSibling);
  };
}
function prependTo(selectors) {
  return (svg) => {
    const $el = document.querySelector(selectors);
    return $el.insertBefore(html(svg), $el.firstChild);
  };
}
function addTip($container) {
  const $rects = Array.prototype.slice.apply($container.querySelectorAll('svg rect'));
  $rects.forEach(($rect) => {
    const count = $rect.getAttribute('data-count');
    const date = $rect.getAttribute('data-date');
    $rect.addEventListener('mouseenter', () => {
      const $tip = document.createElement('div');
      $tip.className = 'mosaic-tile__tip';
      $tip.innerHTML = `<strong>${count}</strong> (${date})`;
      document.body.appendChild($tip);
      const tipBCR = $tip.getBoundingClientRect();
      const rectBCR = $rect.getBoundingClientRect();
      $tip.style.left = `${rectBCR.left - tipBCR.width / 2 + 6}px`;
      $tip.style.top = `${rectBCR.top - tipBCR.height - 10}px`;
    });
    $rect.addEventListener('mouseleave', () => {
      const $tip = document.querySelector('.mosaic-tile__tip');
      document.body.removeChild($tip);
    });
  });
}

const API_ORIGIN = 'https://bangumi-mosaic-tile.aho.im';
function getTimelineApi(type) {
  return `${API_ORIGIN}/users/${username}/timelines/${type}.svg`;
}
function getWikiApi(type) {
  return `${API_ORIGIN}/users/${username}/wikis/${type}.svg`;
}
function request(url) {
  return fetch(url)
    .then(res => (
      res.status >= 200 && res.status < 300
        ? res.text()
        : Promise.reject(res)
    ));
}

if (page === '') {
  request(getTimelineApi('progress'))
    .then(insertAfter('#user_home .user_box'))
    .then(addTip);
}

if (['subject', 'mono', 'blog', 'index'].includes(page)) {
  request(getTimelineApi(page))
    .then(prependTo('#columnA'))
    .then(addTip);
}

if (page === 'timeline') {
  insertAfter('#columnTimelineInnerB .TsukkmiBox')('');
  Array.prototype.slice.apply(document.querySelectorAll('#timelineTabs li a'))
    .filter($btn => $btn.search)
    .forEach(($btn) => {
      $btn.addEventListener('click', () => {
        const type = $btn.search
          .slice(1)
          .split('&')
          .map(pair => pair.split('='))
          .find(([key]) => key === 'type')
          .pop();
        request(getTimelineApi(type))
          .then((svg) => {
            const $container = document.querySelector('#columnTimelineInnerB .mosaic-tile');
            $container.innerHTML = svg;
            return $container;
          })
          .then(addTip);
      });
    });
}

if (page === 'groups') {
  request(getTimelineApi('group'))
    .then(prependTo('#columnUserSingle'))
    .then(addTip);
}

if (page === 'friends') {
  request(getTimelineApi('relation'))
    .then(prependTo('#columnUserSingle'))
    .then(addTip);
}

if (page === 'wiki') {
  request(getWikiApi(subpage || 'subject'))
    .then(prependTo('#columnA'))
    .then(addTip);
}