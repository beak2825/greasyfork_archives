// ==UserScript==
// @name         小説家になろう 最新話
// @description  最新の10話と前後の話数を表示する
// @version      1.1
// @namespace    none
// @match        https://*.syosetu.com/n*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508889/%E5%B0%8F%E8%AA%AC%E5%AE%B6%E3%81%AB%E3%81%AA%E3%82%8D%E3%81%86%20%E6%9C%80%E6%96%B0%E8%A9%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/508889/%E5%B0%8F%E8%AA%AC%E5%AE%B6%E3%81%AB%E3%81%AA%E3%82%8D%E3%81%86%20%E6%9C%80%E6%96%B0%E8%A9%B1.meta.js
// ==/UserScript==

add_style();
show_latest();
show_current();

function add_style() {
  let css = `
.p-eplist-ex {border: 1px solid rgba(150,150,150,0.5); background: rgba(200,200,200,0.15);}
.p-eplist-ex.scroll {width: 740px; height: 240px; margin: 15px auto; box-sizing: border-box; overflow-y: scroll; position: relative;}
.p-eplist-ex .p-eplist__chapter-title {margin: 12px 12px 6px 12px;}
.p-eplist-ex .p-eplist__sublist {display: flex; align-items: center; border: unset; margin: unset;}
.p-eplist-ex .p-eplist__sublist:hover {background: rgba(150,150,150,0.15);}
.p-eplist-ex .p-eplist__sublist .p-eplist__subtitle {flex-grow: 1; padding: 8px 16px;}
.p-eplist-ex .p-eplist__sublist .p-eplist__update {padding: 8px 0px;}

.p-eplist-ex .p-eplist__sublist.current a {font-weight: bold; pointer-events: none;}
.p-eplist-ex .p-eplist__sublist.current a:visited {color: black;}
body.js-customlayout2 .p-eplist-ex .p-eplist__sublist.current a:visited,
body.js-customlayout3 .p-eplist-ex .p-eplist__sublist.current a:visited {color: white;}
`;
  document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
}

async function show_latest() {
  let pager_box = document.querySelector('div.c-pager__pager');
  let pager_first = !document.querySelector('a.c-pager__item--first');
  if (pager_box && pager_first) {
    let last = document.querySelector('a.c-pager__item--last');
    let last_doc = await fetch_doc(last.href);
    let latest = Array.from(last_doc.querySelectorAll('.p-eplist__sublist')).slice(-10);
    if (latest.length < 10) {
      let prev = last_doc.querySelector('a.c-pager__item--before');
      let prev_doc = await fetch_doc(prev.href);
      latest = Array.from(prev_doc.querySelectorAll('.p-eplist__sublist')).slice(latest.length - 10).concat(latest);
    }
    document.querySelector('#novel_ex').insertAdjacentHTML('afterend', '<div class="p-eplist-ex"><div class="p-eplist__chapter-title">最新話</div></div>');
    while (latest.length) document.querySelector('.p-eplist-ex').appendChild(latest.pop());
  }
}

async function show_current() {
  let novel_bn = document.querySelector('.c-pager--center');
  if (novel_bn) {
    novel_bn.insertAdjacentHTML('beforebegin', '<div class="p-eplist-ex scroll"></div>');
    let novel_ep = document.querySelector('.p-eplist-ex');
    let [ncode, ep_num] = location.pathname.split('/').filter(n => n);
    let index = (ep_num - 1) % 100;
    let page = Math.ceil(ep_num / 100);
    let doc = await fetch_doc(`/${ncode}/?p=${page}`);
    let lists = Array.from(doc.querySelectorAll('.p-eplist__sublist'));
    lists[index].classList.add('current');
    if (index < 10 && ep_num > 100) {
      let doc = await fetch_doc(`/${ncode}/?p=${page - 1}`);
      lists = Array.from(doc.querySelectorAll('.p-eplist__sublist')).concat(lists);
    }
    if (index > 90 && doc.querySelector('.c-pager__item--next')) {
      let doc = await fetch_doc(`/${ncode}/?p=${page + 1}`);
      lists = lists.concat(Array.from(doc.querySelectorAll('.p-eplist__sublist')));
    }
    lists.forEach(ep => novel_ep.appendChild(ep));
    let current = document.querySelector('.current');
    novel_ep.scrollTop = current.offsetTop + current.clientHeight / 2 - novel_ep.clientHeight / 2;
  }
}

async function fetch_doc(url) {
  let text = await (await fetch(url, {credentials: "same-origin"})).text();
  let doc = new DOMParser().parseFromString(text, 'text/html');
  return doc;
}
