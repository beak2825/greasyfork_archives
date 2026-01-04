// ==UserScript==
// @name        WeLoMa Japanese Title
// @name:ja     WeLoMa 日本語の作品名
// @description    Replace the title to japanese.
// @description:ja 作品名を日本語に置き換える
// @version     1.01
// @author      none
// @namespace   none
// @match       https://weloma.art/manga-list*
// @match       https://weloma.art/*/
// @exclude     https://weloma.art/*/*/
// @match       https://rawinu.com/manga-*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/521987/WeLoMa%20Japanese%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/521987/WeLoMa%20Japanese%20Title.meta.js
// ==/UserScript==

let site = location.hostname.replace(/\./g, '_');

if (location.pathname.indexOf('/manga-list') == 0) {
  Array.from(document.querySelectorAll('.thumb-item-flow')).map(async item => {
    let id = item.querySelector('div[data-id]').dataset.id;
    let text = await (await fetch(`/app/manga/controllers/cont.pop.php?action=pop&id=${id}`)).text();
    let doc = new DOMParser().parseFromString(text, "text/html");
    item.querySelector('.series-title a').innerHTML = find_title(doc.querySelector('.group p'), doc.querySelector('.pop_title'));

    // Fix the chapter omitted issue on thumbnail.
    //   Replace [Last chapte...] to [Chap 5]
    if (site == 'weloma_art') {
      item.querySelector('.chapter-title a').innerHTML = item.querySelector('.chapter-title').title;
    }
    if (site == 'rawinu_com') {
      let item_a = item.querySelector('a');
      item_a.href = item_a.href.replace('/manga/', '/manga-').replace(/\/chapter-\d+(\.\d+)?/, '');
      item.querySelector('.chapter-title a').innerHTML = item.querySelector('.chapter-title').innerHTML.replace('Last chapter:', 'Chap ');
    }
  });
} else {
  let info = document.querySelector('.manga-info');
  if (info) document.title = find_title(info.querySelector('li'), info.querySelector('h3'));
}

function find_title(text, title) {
  let titles = text.innerText.replace('Other names: ', '').replace('Updating', '').split(',').filter(i => i.trim());
  let trimed = titles.filter(i => i.replace(/[\u0000-\u303d]/gi, '') !== '');
  let has_kana = trimed.filter(i => i.match(/[\u3041-\u3096\u30A1-\u30FA]/));
  return has_kana[0] || trimed[0] || titles[0] || title.innerText.toLowerCase().replace(/\b\w/g, i => i.toUpperCase());
}