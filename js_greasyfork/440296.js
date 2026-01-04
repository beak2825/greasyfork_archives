// ==UserScript==
// @name         N站视频信息查询
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  获取 B 站视频简介中 N 站视频的实时信息，包括播放量、弹幕数、简介等，并显示在视频简介中。
// @author       ctrn43062
// @match        *://*.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @note         v0.6 优化请求逻辑，减少请求次数；请更新该版本，否则脚本将无法使用
// @note         v0.5 bug 修复
// @note         v0.4 信息格式调整为播放等数据在视频标题下；支持自定义视频数据位置
// @note         v0.3 替换跳转链接 acg.tv 为 N 视频链接
// @note         v0.2 适配旧版播放页
// @downloadURL https://update.greasyfork.org/scripts/440296/N%E7%AB%99%E8%A7%86%E9%A2%91%E4%BF%A1%E6%81%AF%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/440296/N%E7%AB%99%E8%A7%86%E9%A2%91%E4%BF%A1%E6%81%AF%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

// 修复请求失败替换原简介的bug
const REVERSE_PROXY_API = 'https://f7z1to.deta.dev'

// 视频信息是否在原视频简介前插入
// true 是
// false 否
const INSERT_INFO_BEFORE = false


function getURL() {
  return location.origin + location.pathname
}


function toLink(type, target, text) {
  const BASE_URL = 'https://www.nicovideo.jp'

  const PATHS = {
    'video': 'watch',
    'user': 'user',
    'tag': 'tag'
  }

  let href = `${BASE_URL}/${PATHS[type]}/${target}`

  return `<a href="${href}" target="_blank">${text}</a>`
}


async function getVideoInfoData(video_list) {
  const headers = {
    'x-url': getURL(),
    'x-title': encodeURIComponent(document.title),
    'content-type': 'application/json;'
  }

  try {
    console.log('[DEBUG]', 'requesting', video_list);

    return await fetch(REVERSE_PROXY_API, {
      method: 'POST',
      body: JSON.stringify(video_list),
      headers
    }).then(resp => resp.json())
  } catch (e) {
    console.log('error', e)
    return { code: -1, status: '请求接口出错: ' + e.toString(), data: [] }
  }
}


function parseVideoInfo(sm, data) {
  const xml = (new DOMParser()).parseFromString(data, 'text/xml');
  const response = xml.firstChild;

  if (response.getAttribute('status') !== 'ok') {
    // throw new Error(`Request Video Info Error:${sm}\n${response}`)
    return {
      status: `获取 ${toLink('video', sm, sm)} 数据失败，视频可能已被删除。`
    }
  }

  function _parse() {
    const user_id = response.querySelector('user_id').textContent;
    const username = response.querySelector('user_nickname').textContent;
    const title = response.querySelector('title').textContent;
    const description = response.querySelector('description').textContent.replaceAll(/(sm\d+)/g, '<a href="https://www.nicovideo.jp/watch/$1" target="_blank">$1</a>');
    const post_at = response.querySelector('first_retrieve').textContent;
    let view = +response.querySelector('view_counter').textContent;
    let comment = +response.querySelector('comment_num').textContent;
    let favorite = +response.querySelector('mylist_counter').textContent;
    const tagsEle = response.querySelectorAll('tags > tag');

    const tags = [];
    tagsEle.forEach(tagEle => {
      tags.push(tagEle.textContent);
    });

    const tags_link = tags.map(tag => toLink('tag', tag, tag)).join(' | ')

    const base = 10000;

    if (view >= base) {
      view = (view / base).toFixed(1) + '万';
    }

    if (comment >= base) {
      comment = (comment / base).toFixed(1) + '万';
    }

    if (favorite >= base) {
      favorite = (favorite / base).toFixed(1) + '万';
    }

    return {
      status: 'ok',
      title,
      description,
      post_at,
      view,
      comment,
      favorite,
      tags: tags_link,
      user_id,
      username,
      id: sm
    }
  }

  return _parse();
}


function createVideoInfoElement(info) {
  const infoEle = document.createElement('span');

  if (info['status'] !== 'ok') {
    infoEle.innerHTML = `<strong>出错了：${info['status']}</strong><br/>`;
    return infoEle;
  }

  infoEle.innerHTML = `<strong>${toLink('video', info['id'], info['id'])} 的详细信息：</strong>
        标题:
        ${info['title']}

        播放量: ${info['view']}
        评论数（弹幕数）: ${info['comment']}
        收藏量: ${info['favorite']}

        简介:
        ${info['description'] || '(无简介)'}

        投稿时间: ${(new Date(info['post_at'])).toLocaleString()}

        投稿者: ${toLink('user', info['user_id'], info['username'])}

        ${info['tags']}
    `

  return infoEle;
}


function insertVideoInfoToDesc(data) {
  const element = createVideoInfoElement(data).innerHTML;
  const container = document.querySelector('.desc-info.desc-v2 > span');

  const html = container.innerHTML
  const title = `<strong>${INSERT_INFO_BEFORE ? '原始简介：' : ''}</strong><br/>`

  if (INSERT_INFO_BEFORE) {
    container.innerHTML = element + '\n' + title + html
  } else {
    container.innerHTML = html + '<br/><br/>' + element
  }

  container.innerHTML = `<span class='nico-video'>${container.innerHTML}</span>`
}


async function setDescription(description) {
  if (!setDescription.cache) {
    setDescription.cache = {}
  }

  const cache = setDescription.cache

  const id_list = new Set(description);

  if(!id_list.size) {
    return ;
  }

  // 如果简介长度无需折叠，则不会显示展开按钮。但是加上视频详情后可能需要折叠，所以强制开启折叠按钮
  const toggleBtn = document.querySelector('.toggle-btn');
  if (toggleBtn) {
    toggleBtn.style.display = 'block';
  }

  const resp = await getVideoInfoData(id_list)

  resp.data.forEach(info => {
    const key = info.key
    const data = cache[key] || parseVideoInfo(key, info.data)
    insertVideoInfoToDesc(data)
    cache[key] = data
  })

  if (resp.code === -1) {
    insertVideoInfoToDesc(createVideoInfoElement(resp))
  }
}

function watingForPageLoaded() {
  return new Promise((resolve) => {
    const descEle = document.querySelector('.desc-info.desc-v2')
    const isOldStyle = document.querySelector('.tip-info')
    const it = setInterval(() => {
      if ((descEle.style.height || isOldStyle) && !descEle.querySelector('.nico-video')) {
        clearInterval(it)
        resolve()
      }
    }, 10);
  })
}


(function () {
  let currentURL = getURL()

  new MutationObserver(async () => {
    const url = getURL()
    if (url !== currentURL) {
      currentURL = url;
      onUrlChange();
    }
  }).observe(document.head, { subtree: true, childList: true });

  async function onUrlChange() {
    await watingForPageLoaded()
    const descriptionEle = document.querySelector('.desc-info.desc-v2 > span')
    const description = descriptionEle.textContent.match(/sm\d+/g)
    setDescription(description)
  }

  onUrlChange()
})();