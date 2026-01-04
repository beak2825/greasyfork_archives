// ==UserScript==
// @name         SaveAsZip for Discord
// @name:ja      SaveAsZip for Discord
// @name::zh-cn  SaveAsZip for Discord
// @name::zh-tw  SaveAsZip for Discord
// @description        Download post images and save as a ZIP file.
// @description:ja     投稿の画像をZIPファイルとして保存する。
// @description:zh-cn  一键下载帖子内所有图片，并保存为ZIP文件。
// @description:zh-tw  一鍵下載帖子内所有圖片，並保存為ZIP文件。
// @version      0.13
// @namespace    none
// @match        https://discord.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// @grant        none
// @license      MIT
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/481163/SaveAsZip%20for%20Discord.user.js
// @updateURL https://update.greasyfork.org/scripts/481163/SaveAsZip%20for%20Discord.meta.js
// ==/UserScript==
/* jshint esversion: 8 */

const preset_zip_name = '{username}_{datetime_local:YYYYMMDD-hhmmss}_{channel_id}_{message_id}_images.zip';

const token = getToken();
const JSZip = window.JSZip;
addStyle();
addButton();

function addButton() {
  let observer = new MutationObserver(() => findContainer());
  observer.observe(document.body, {childList: true, subtree: true});
}

function findContainer() {
  let containers = document.querySelectorAll('li div[class^="mediaAttachmentsContainer_"]:not(.zip-btn-added)');
  containers.forEach(container => addButtonTo(container));
}

function addButtonTo(container) {
  container.classList.add('zip-btn-added');
  let btn = document.createElement('span');
  btn.classList.add('saveaszip');
  if (isGroupStart(container)) btn.classList.add('group-start');
  btn.innerHTML = '<label class="down-btn"><span class="btn-text">ZIP</span></label><label class="down-speed">0KB/S</label>';
  btn.onclick = () => SaveAsZip(btn, container);
  container.appendChild(btn);
}

function isGroupStart(container) {
  let target_li = container.closest('li');
  while (true) {
    let is_group_start = target_li.querySelector(':scope > div[class*="groupStart"]');
    if (is_group_start) return true;
    target_li = target_li.previousElementSibling;
    if (!target_li) break;
    let has_media = target_li.querySelector('div[class^="mediaAttachmentsContainer_"]');
    if (has_media) break;
  }
  return false;
}

async function SaveAsZip(btn, container) {
  if (btn.classList.contains('down')) return;
  else btn.classList.add('down');
  let btn_text = btn.querySelector('.btn-text');
  let btn_speed = btn.querySelector('.down-speed');
  const status = text => (btn_text.innerText = text);
  const speeds = text => (btn_speed.innerHTML = text);
  let invalid_chars = {'\\': '＼', '\/': '／', '\|': '｜', '<': '＜', '>': '＞', ':': '：', '*': '＊', '?': '？', '"': '＂', '\u200b': '', '\u200c': '', '\u200d': '', '\u2060': '', '\ufeff': '', '🔞': ''};
  let datetime_pattern = preset_zip_name.match(/{datetime(-local)?:[^{}]+}/) ? preset_zip_name.match(/{datetime(?:-local)?:([^{}]+)}/)[1].replace(/[\\/|<>*?:"]/g, v => invalid_chars[v]) : 'YYYYMMDD-hhmmss';

  //get channel_id and message_id
  let anchor_li = container.closest('li');
  let anchor_li_is_flash = anchor_li.parentNode.classList.value.indexOf('backgroundFlash') >=0;
  let [channel_id, message_id] = anchor_li.id.split('-').slice(-2);

  //get datetime in first message
  let datetime_utc = formatDate(anchor_li.querySelector('time').getAttribute('datetime'), datetime_pattern);
  let datetime_local = formatDate(anchor_li.querySelector('time').getAttribute('datetime'), datetime_pattern, true);

  //get messages group
  let messages_group = [message_id];
  let anchor = anchor_li_is_flash ? anchor_li.parentNode : anchor_li;
  while (true) {
    let current = anchor.nextElementSibling;
    let current_is_flash = current.tagName == 'DIV' && current.classList.value.indexOf('backgroundFlash') >=0;
    if (current_is_flash) current = current.firstChild;
    if (current.tagName == 'LI' && !current.querySelector('h3')) {
      messages_group.push(current.id.split('-').pop());
      anchor = current_is_flash ? current.parentNode : current;
    } else break;
  }

  //get post json
  let url = `https://discord.com/api/v9/channels/${channel_id}/messages?limit=50&around=${message_id}`;
  let json = await (await fetch(url, {headers: {'Authorization': token}})).json();
  if (!Array.isArray(json)) return console.error('error: get json failed');
  let message = json.find(message => message.id == message_id);
  let author_id = message.author.id;
  let author_name = message.author.global_name || message.author.username;

  //extract post info
  let info = {
    channel_id: channel_id,
    message_id: message_id,
    datetime: datetime_utc,
    datetime_local: datetime_local,
    user_id: author_id,
    username: author_name
  };

  //create zip and set filename
  let zip = new JSZip();
  let zip_name = preset_zip_name.replace(/{([^{}:]+)(:[^{}]+)?}/g, (match, name) => info[name]);

  //find images
  let images = [];
  let images_size = 0, images_size_2;
  messages_group.forEach(message_id => {
    let message = json.find(message => message.id == message_id);
    if (message && message.author.id == author_id && message.attachments.length) {
      message.attachments.forEach(file => {
        if (file.content_type.indexOf('image') == 0) {
          file.message_id = message_id;
          file.timestamp = formatDate(message.timestamp, datetime_pattern);
          file.timestamp_local = formatDate(message.timestamp, datetime_pattern, true);
          images.push(file);
          images_size += file.size;
        }
      });
    }
  });
  images_size_2 = images_size < 1024000 ? Math.round(images_size / 1024) + 'KB' : (images_size / 1048576).toFixed(2) + 'MB';

  //show download speed if images size over 10MB
  let received = 0, received_2, traffic = 0, traffic_buffer = [], traffic_update;
  if (images_size >= 10485760) {
    btn.classList.add('speed');
    traffic_update = setInterval(() => {
      traffic_buffer.push(traffic);
      let speed = traffic_buffer.reduce((a, b) => a + b, 0) / traffic_buffer.length / 1024;
      received_2 = received < 1024000 ? Math.round(received / 1024) + 'KB' : (received / 1048576).toFixed(2) + 'MB';
      speeds(`${received_2} of ${images_size_2} | ${speed < 1000 ? Math.round(speed) + ' KB/s' : (speed / 1024).toFixed(2) + ' MB/s'}`);
      if (traffic_buffer.length >= 5) traffic_buffer.shift();
      traffic = 0;
    }, 1000);
  }

  //download image and add to zip
  for (let i = 0; i < images.length; i++) {
    status(`${i + 1}/${images.length}`);
    let image = images[i];
    let response = await fetch(image.url);
    let content_type = response.headers.get('content-type');
    const reader = response.body.getReader();
    let chunks = [];
    while (true) {
      const {done, value} = await reader.read();
      if (value) {
        chunks.push(value);
        received += value.length;
        traffic += value.length;
      }
      if (done) break;
    }
    let image_blob = new Blob(chunks, {type: content_type});
    zip.file(`${image.message_id}_${image.id}_${image.filename}`, image_blob);
  }

  //download completed
  speeds('');
  btn.classList.remove('speed');
  clearInterval(traffic_update);

  //save
  status('Save');
  let zip_blob = await zip.generateAsync({type: 'blob'});
  let zip_url = URL.createObjectURL(zip_blob);
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

function getToken() {
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  const token = JSON.parse(document.body.appendChild(iframe).contentWindow.localStorage.token);
  iframe.remove();
  return token;
}

function formatDate(i, o, tz) {
  let d = new Date(i);
  if (tz) d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  let v = {YYYY: d.getUTCFullYear(), YY: d.getUTCFullYear() % 100, MM: d.getUTCMonth() + 1, DD: d.getUTCDate(), hh: d.getUTCHours(), mm: d.getUTCMinutes(), ss: d.getUTCSeconds()};
  return o.replace(/(YYYY|MM|DD|hh|mm|ss)/g, n => ('0' + v[n]).substr(-n.length));
}

function addStyle() {
  let css = `
.saveaszip {position: absolute; color: white; padding: 6px 4px; z-index: 99; left: 0; top: 0;}
.saveaszip {display: flex; gap: 4px; align-items: center;}
.saveaszip:not(.group-start) {display: none;}
.saveaszip label {background: #0008; border: 1px solid #8888; border-radius: 6px; padding: 4px 12px;}
.saveaszip:hover label.down-btn {background: #000a; border-color: #fff3;}
.saveaszip.down label.down-btn {background: #000a; border-color: #fff3;}
.saveaszip.done label.down-btn {background: #060a; border-color: #fff3;}
.saveaszip label.down-speed {font-family: monospace; font-size: 14px; padding: 3px 6px;}
.saveaszip:not(.speed) label.down-speed {display: none;}
/* progress bar animation */
.saveaszip.down .down-speed {background-image: linear-gradient(-45deg, #fff2 0%, #fff2 25%, #0000 25%, #0000 50%, #fff2 50%, #fff2 75%, #0000 75%, #0000 100%); background-size: 32px 32px; animation: progress 2s linear infinite;}
@keyframes progress {0% {background-position:0 0} 100% {background-position:32px 32px}}
`;
    document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
}
