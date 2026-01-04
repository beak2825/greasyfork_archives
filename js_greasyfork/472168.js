// ==UserScript==
// @name         SaveAsZip for Patreon
// @name:ja      SaveAsZip for Patreon
// @name::zh-cn  SaveAsZip for Patreon
// @name::zh-tw  SaveAsZip for Patreon
// @description  Download post images and save as a ZIP file.
// @description:ja  投稿の画像をZIPファイルとして保存する。
// @description:zh-cn  一键下载帖子内所有图片，并保存为ZIP文件。
// @description:zh-tw  一鍵下載帖子内所有圖片，並保存為ZIP文件。
// @version      1.17
// @namespace    none
// @match        https://*.patreon.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472168/SaveAsZip%20for%20Patreon.user.js
// @updateURL https://update.greasyfork.org/scripts/472168/SaveAsZip%20for%20Patreon.meta.js
// ==/UserScript==
/* jshint esversion: 8 */

let preset_zip_name = '{user_name}_{user_id}_{post_id}_{created}_{post_title}_images.zip';

const JSZip = window.JSZip;
const is_post_page = location.pathname.indexOf('/posts/') == 0;
const is_user_page = location.pathname == '/user' || location.pathname.split('/').pop() == 'posts' || !is_post_page && document.querySelector('main#renderPageContentWrapper');
let observer;

addStyle();
addButton();

function addButton() {
  if (is_post_page) findPostsIn(document);
  else if (is_user_page) {
    observer = new MutationObserver(() => findPostsList());
    observer.observe(document.body, {childList: true, subtree: true});
  }
}

function findPostsList() {
  let posts_list = document.querySelector('div[data-tag="all-posts-layout"], div[data-tag="post-stream-container"]');
  if (posts_list) {
    observer.disconnect();
    //monitor tab change in user page
    observer.observe(posts_list.parentNode.parentNode, {childList: true, subtree: false});
    findPostsIn(posts_list);
    if (is_user_page) {
      //on load more posts
      let observer_list = new MutationObserver(ms => ms.forEach(m => {
        if (m.addedNodes.length) findPostsIn(m.addedNodes[0]);
      }));
      observer_list.observe(posts_list, {childList: true});
      //on change post list
      let is_stream = posts_list.dataset.tag == 'post-stream-container';
      new MutationObserver(ms => ms.forEach(m => {
        if (m.addedNodes.length && (is_stream ? m.addedNodes[0].tagName == 'UL' : m.addedNodes[0].dataset.tag == 'all-posts-layout')) {
          findPostsIn(m.addedNodes[0]);
          observer_list.disconnect();
          observer_list.observe(m.addedNodes[0], {childList: true});
        }
      })).observe(is_stream ? posts_list.querySelector(':scope>div:last-child') : posts_list.parentNode, {childList: true});
    }
  }
}

function findPostsIn(doc) {
  let posts = doc.querySelectorAll('div[data-tag="post-card"], div[data-tag="post"]');
  posts.forEach(post => {
    let has_images = post.querySelector('div[data-tag="chip-container"]');
    let is_visible = !post.querySelector('a[href^="/checkout/"]');
    if (has_images && is_visible) addButtonTo(post);
  });
}

function addButtonTo(post) {
  let btn = document.createElement('div');
  btn.classList.add('saveaszip');
  btn.innerHTML = '<label><span class="btn-icon">📥</span><span class="btn-text">ZIP</span></label>';
  btn.onclick = () => SaveAsZip(btn, post);
  let btn_group = post.querySelector('div[data-tag="chip-container"]').parentNode;
  btn_group.appendChild(btn);
  //prevent removal of zip button
  //in some case, zip button will remove on comments loaded, reason are unknown for now.
  if (is_post_page) {
    new MutationObserver(ms => ms.forEach(m => {
      if (m.removedNodes.length && m.removedNodes[0] == btn) btn_group.appendChild(btn);
    })).observe(post, {childList: true, subtree: true});
  }
}

async function SaveAsZip(btn, post) {
  if (btn.classList.contains('down')) return;
  else btn.classList.add('down');
  let btn_text = btn.querySelector('.btn-text');
  const status = text => (btn_text.innerText = text);
  //get post json
  let post_info = window.patreon && window.patreon.bootstrap.post; //post page
  if (!post_info) {
    let post_href = post.querySelector('a[href^="/posts/"]').href;
    let post_page = await (await fetch(post_href)).text();
    let post_data = post_page.match(/{"props".*?(?=<\/script>)/);
    if (post_data) post_info = JSON.parse(post_data).props.pageProps.bootstrapEnvelope.bootstrap.post;
    else return console.error('get post_info failed');
  }
  //extract post info
  let invalid_chars = {'\\': '＼', '/': '／', '|': '｜', '<': '＜', '>': '＞', ':': '：', '*': '＊', '?': '？', '"': '＂'};
  let info = {};
  info.post_id = post_info.data.id;
  info.post_title = post_info.data.attributes.title.replace(/[\/|<>:*?"\u200d]/g, v => invalid_chars[v] || '');
  info.user_id = post_info.included.find(i => i.type == 'user').id;
  info.user_name = post_info.included.find(i => i.type == 'campaign').attributes.name.replace(/[\/|<>:*?"\u200d]/g, v => invalid_chars[v] || '');
  let created_format = preset_zip_name.match(/{created:[^{}]+}/) ? preset_zip_name.match(/{created:([^{}]+)}/)[1] : 'YYYY-MM-DD';
  info.created = formatDate(post_info.data.attributes.created_at, created_format);
  //create zip and set filename
  let zip = new JSZip();
  let zip_name = preset_zip_name.replace(/{([^{}:]+)(:[^{}]+)?}/g, (match, name) => info[name]);
  //zip.file('post_content.txt', post.data.attributes.content);
  //find images
  let images = post_info.included.filter(i => i.type == 'media');
  let image_order = post_info.data.attributes.post_metadata.image_order;
  for (let i = 0; i < images.length; i++) {
    status(`${i + 1} / ${images.length}`);
    //download image and add to zip
    let image = images[i];
    let order = ('000' + (image_order ? image_order.indexOf(image.id) + 1 : i + 1)).slice(-3);
    let image_blob = await (await fetch(image.attributes.download_url)).blob();
    zip.file(`${order}_${image.id}_${image.attributes.file_name}`, image_blob);
  }
  //save
  status('Save');
  let zip_blob = await zip.generateAsync({type: 'blob'});
  let zip_url = URL.createObjectURL(zip_blob);
  //GM_download has some bug in tampermonkey, browser will freeze few second each download
  //GM_download({url: zip_url, name: zip_name, onload: () => URL.revokeObjectURL(zip_url)});
  let link = document.createElement('a');
  link.href = zip_url;
  link.download = zip_name;
  link.dispatchEvent(new MouseEvent('click'));
  setTimeout(() => URL.revokeObjectURL(zip_url), 100);
  //done
  btn.classList.remove('down');
  btn.classList.add('done');
  status('Done');
}

function formatDate(i, o) {
  let d = new Date(i);
  let v = {
    YYYY: d.getUTCFullYear().toString(),
    MM: d.getUTCMonth() + 1,
    DD: d.getUTCDate(),
    hh: d.getUTCHours(),
    mm: d.getUTCMinutes()
  };
  return o.replace(/(YYYY|MM|DD|hh|mm)/g, n => ('0' + v[n]).substr(-n.length));
}

function addStyle() {
  let css = `
.saveaszip {display: inline-flex; gap: 2px; margin-left: 8px; vertical-align: top;}
.saveaszip label {display: inline-flex; gap: 6px; align-items: center;}
.saveaszip label {background: #0008; border: 1px solid #0000; border-radius: 4px; height: 26px; padding: 0px 6px;}
.saveaszip label span {color: white; font-size: 14px; line-height: 1.3;}
.saveaszip label span.btn-icon {color: #0000; text-shadow: white 0 0;}
.saveaszip:hover label {background: #000a; border-color: #fff3;}
.saveaszip.done label:nth-child(1) {background: #060a; border-color: #fff3;}
.saveaszip.down label:nth-child(1) {background: #000a; border-color: #fff3;}
/* progress bar animation */
.saveaszip.down label:nth-child(1) {background-image: linear-gradient(-45deg, #fff2 0%, #fff2 25%, #0000 25%, #0000 50%, #fff2 50%, #fff2 75%, #0000 75%, #0000 100%); background-size: 32px 32px; animation: progress 2s linear infinite;}
@keyframes progress {0% {background-position:0 0} 100% {background-position:32px 32px}}
`;
  document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
}