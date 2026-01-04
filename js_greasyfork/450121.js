// ==UserScript==
// @name 清水河畔音视频播放
// @namespace bbs.uestc.edu.cn
// @license MIT
// @author ____
// @version 0.4.0
// @description 通过 HTML5 多媒体功能播放帖子中上传的音视频附件。
// @match *://bbs.uestc.edu.cn/forum.php*
// @match *://bbs-uestc-edu-cn-s.vpn.uestc.edu.cn/forum.php*
// @connect b23.tv
// @connect  bilibili.com
// @grant GM_xmlhttpRequest
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/450121/%E6%B8%85%E6%B0%B4%E6%B2%B3%E7%95%94%E9%9F%B3%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/450121/%E6%B8%85%E6%B0%B4%E6%B2%B3%E7%95%94%E9%9F%B3%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

const createElement = HTMLDocument.prototype.createElement;
const setAttribute = Element.prototype.setAttribute;

function makeAvElement(src, kind) {
  const MARGIN_TB = '0.5em';
  let media = document.createElement(kind);
  media.controls = true;
  media.src = src;
  media.style.maxWidth = '100%';
  media.style.maxHeight = '80vh';
  media.style.display = 'block';
  media.style.margin = MARGIN_TB + (kind == 'audio' ? ' 0' : ' auto');
  return media;
}
function makeAv(container, a, kind) {
  a.outerHTML = makeAvElement(a.href, kind).outerHTML;
  let outer = container.querySelector('dl.tattl');
  if (outer) {
    outer.style.width = 'auto';
    outer.style.height = 'auto';
  }
  let outer2 = container.querySelector('p.attnm');
  if (outer2) {
    outer2.style.height = 'auto';
  }
  let icon = container.querySelector('dl.tattl > dt');
  if (icon) {
    icon.style.display = 'none';
  }
}

function getRedirectUrl(url) {
  return new Promise(resolve => {
    if (window.GM_xmlhttpRequest) {
      GM_xmlhttpRequest({
        method: 'HEAD',
        url,
        onload: r => resolve(r.finalUrl),
      })
    } else {
      chrome.runtime.sendMessage({request: 'getRedirectUrl', url}).then(r => r && r.url && resolve(r.url));
    }
  });
}

function createIframe(src, extra) {
  let isPc = !!document.querySelector('#postlist');
  let el = createElement.call(document, 'iframe');
  el.style.display = 'block';
  el.style.width = isPc ? '80%' : '100%';
  el.style.aspectRatio = '16 / 9'
  el.style.margin = '0.5em auto';
  el.allowFullscreen = true;
  if (extra && extra.allow) {
    el.allow = extra.allow;
  }
  setAttribute.call(el, 'src', src);
  return el;
}

function makeBvPlayer(bv) {
  return createIframe(`https://player.bilibili.com/player.html?bvid=${encodeURIComponent(bv)}`);
}

function makeBilibiliLivePlayer(id) {
  return createIframe(`https://www.bilibili.com/blackboard/live/live-activity-player.html?cid=${id}&quality=0`, {
    allow: 'encrypted-media',
  });
}

function handleBilibiliLive(id) {
  const url = `https://live.bilibili.com/${id}`;
  return new Promise(resolve => {
    function handleResponse2(json) {
      debugger
      if (!json || !json.data || !json.data.by_room_ids) {
        resolve(makeBilibiliLivePlayer(id));
        return;
      }
      for (const [room_id, details] of Object.entries(json.data.by_room_ids)) {
        if (details && details.short_id == id) {
          resolve(makeBilibiliLivePlayer(details.room_id || room_id))
          return;
        }
      }
      resolve(makeBilibiliLivePlayer(id));
    }
    function handleResponse(text) {
      const match = text.match(/__NEPTUNE_IS_MY_WAIFU__.*?"room_id":([1-9]\d*)/);
      if (match) {
        resolve(makeBilibiliLivePlayer(match[1]));
        return;
      }

      // Handle special competition live.
      const match2 = text.match(/window\.__initialState\s*=\s*(.*)/);
      if (match2) {
        let json = match2[1];
        if (json[json.length - 1] == ';') {
          json = json.substring(0, json.length - 1);
        }
        try {
          json = JSON.parse(json)['live-non-revenue-player'][0].roomsConfig.map(room => room.roomId.substring(0));
        } catch (_) {
          resolve(makeBilibiliLivePlayer(id));
          return;
        }
        if (window.GM_xmlhttpRequest) {
          GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.live.bilibili.com/xlive/web-room/v1/index/getRoomBaseInfo?${json.map(id => 'room_ids=' + encodeURIComponent(id)).join('&')}&req_biz=web_room_componet`,
            onload: r => {
              let json;
              try {
                json = JSON.parse(r.responseText);
              } catch (_) {
                resolve(makeBilibiliLivePlayer(id));
                return;
              }
              handleResponse2(json);
            },
            onerror: _ => handleResponse2(),
          });
        } else {
          chrome.runtime.sendMessage({request: 'bilibiliGetRoomsInfo', roomIds: json}).then(json => handleResponse2(json));
        }
      } else {
        resolve(makeBilibiliLivePlayer(id));
      }
    }
    if (window.GM_xmlhttpRequest) {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        onload: r => handleResponse(r.responseText),
        onerror: _ => handleResponse(''),
      });
    } else {
      chrome.runtime.sendMessage({request: 'getUrl', url}).then(r => handleResponse(r ? r.responseText : ''));
    }
  });
}

const externalAvHandlers = [
  {
    regex: /https?:\/\/(?:b23\.tv|b23-tv-s\.vpn\.uestc\.edu\.cn(?::8118)?)\/([^/?]+)/i,
    handler: (url, match) => getRedirectUrl(`https://b23.tv/${match[1]}`).then(url => matchHandlers(url)),
  },
  {
    regex: /https?:\/\/(?:www|m)(?:\.bilibili\.com|-bilibili-com-s\.vpn\.uestc\.edu\.cn(?::8118)?)\/video\/(BV[^/?]+)/i,
    handler: (url, match) => Promise.resolve(makeBvPlayer(match[1])),
  },
  {
    regex: /https?:\/\/(?:live\.bilibili\.com|live-bilibili-com-s\.vpn\.uestc\.edu\.cn(?::8118)?)\/([0-9]+)/i,
    handler: (_, match) => handleBilibiliLive(match[1]),
  },
];

function matchHandlers(url, extra) {
  for (let {regex, handler} of externalAvHandlers) {
    let match = url.match(regex);
    if (match) {
      return handler(url, match);
    }
  }
  return Promise.reject();
}
document.addEventListener('DOMContentLoaded', _ => {
  [].forEach.call(document.querySelectorAll('#postlist ignore_js_op, .postlist .plc.cl .box.attach, .wp .vt .pbody .box.attach'), el => {
    let a = el.querySelector('a');
    if (a.href.match(/https?:\/\/.*?forum\.php\?mod=attachment&/)) {
      let fileName = a.textContent.trim();
      if (fileName.match(/\.(?:mp4|flv)/i)) {
        makeAv(el, a, 'video');
      } else if (fileName.match(/\.(?:mp3)/i)) {
        makeAv(el, a, 'audio');
      }
    }
  });
  [].forEach.call(document.querySelectorAll('#postlist embed'), embed => {
    const flashvars = embed.getAttribute('flashvars');
    if (flashvars) {
      const match = flashvars.match(/^soundFile=([^&]+)/);
      if (match) {
        embed.outerHTML = makeAvElement(decodeURIComponent(match[1]), 'audio').outerHTML;
      }
    }
  });

  [].forEach.call(document.querySelectorAll('#postlist table.plhin .t_fsz table a, .postlist .plc.cl .message a, .wp .vt .bm .pbody .postmessage a'), a => {
    matchHandlers(a.href).then(el => {
      let e = a.insertAdjacentElement('afterend', document.createElement('br'));
      e = e.insertAdjacentElement('afterend', el);
      e = e.insertAdjacentElement('afterend', document.createElement('br'));
    });
  });
});