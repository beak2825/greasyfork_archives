// ==UserScript==
// @name         Bilibili下载字幕
// @namespace    https://space.bilibili.com/526552477
// @version      1.1
// @description  Bilibili下载当前视频字幕为txt文件
// @match        https://www.bilibili.com/video/av*
// @match        https://www.bilibili.com/video/BV*
// @require      https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js
// @icon         data:image/x-icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAABMLAAATCwAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A1qEAANahAADWoQAG1qEAb9ahAMvWoQD01qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD01qEAy9ahAG/WoQAG1qEAANahAADWoQAA1qEAG9ahAM/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahANDWoQAb1qEAANahAAfWoQDQ1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahANHWoQAH1qEAbtahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAG7WoQDH1qEA/9ahAP/WoQD/1qEAtdahABjWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahABvWoQC11qEA/9ahAP/WoQD/1qEAx9ahAPnWoQD/1qEA/9ahAP/WoQAZ1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahABjWoQD/1qEA/9ahAP/WoQDz1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAErWoQDn1qEA5NahAErWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAErWoQDn1qEA5NahAErWoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA59ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA59ahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA5tahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA5tahAP/WoQD/1qEA5tahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAADWoQAA1qEAANahAADWoQBJ1qEA5tahAObWoQBJ1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQBJ1qEA5tahAObWoQBJ1qEAANahAADWoQAA1qEAANahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQD/1qEA/9ahAP/WoQD/1qEA+dahAP/WoQD/1qEA/9ahABnWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAGdahAP/WoQD/1qEA/9ahAPjWoQDH1qEA/9ahAP/WoQD/1qEAttahABnWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahABnWoQC21qEA/9ahAP/WoQD/1qEAx9ahAG3WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQBt1qEABtahAM/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA0NahAAfWoQAA1qEAG9ahAM/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAM/WoQAb1qEAANahAADWoQAA1qEABtahAG7WoQDH1qEA89ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA/9ahAP/WoQD/1qEA89ahAMfWoQBu1qEABtahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAxdahAA/WoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAxdahAA/WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAAbWoQDF1qEA/9ahAP/WoQD/1qEA/9ahAMXWoQAP1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAxdahAAbWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAYtahAP/WoQD/1qEA/9ahAP/WoQDF1qEADtahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQD/1qEAY9ahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQBf1qEA/9ahAP/WoQD/1qEAxdahAA7WoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAMXWoQD/1qEA/9ahAP/WoQBf1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAATWoQCg1qEA6tahAKjWoQAO1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEAANahAADWoQAA1qEADtahAKjWoQDr1qEAoNahAATWoQAA1qEAANahAADWoQAA1qEAAP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A///////////AAAADgAAAAQAAAAAAAAAAA///wAf//+AP///wD///8A////AP///wDw/w8A8P8PAPD/DwDw/w8A8P8PAPD/DwD///8A////AH///gA///wAAAAAAAAAAAgAAAAcAAAAP8A8A/+AfgH/gP8B/4H/gf+D/8H/////8=
// @author       Steve Xu
// @connect      api.bilibili.com
// @connect      aisubtitle.hdslb.com
// @grant        GM_addStyle
// @grant GM_download
// @grant GM_xmlhttpRequest
// @license Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/480105/Bilibili%E4%B8%8B%E8%BD%BD%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/480105/Bilibili%E4%B8%8B%E8%BD%BD%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(async function () {
  'use strict';
  // 创建按钮并绑定点击事件
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '60px';
  container.style.right = '20px';
  container.style.padding = '10px';
  container.style.backgroundColor = 'white';
  container.style.border = '1px solid #ccc';
  container.style.borderRadius = '5px';
  const selectId = '__download_select_id';
  const buttonId = '__download_button_id';
  container.innerHTML = `<div>
  <label for="${selectId}">Choose Language:</label>
  <select style="width:200px;margin-bottom:10px;" name="language" required id="${selectId}">
    <option value="en" selected>English</option>
    <option value="zh">Chinese</option>
  </select>
</div>
<div>
  <button id="${buttonId}" style="border-radius: 5px;padding: 10px;color:red;width:100%;text-align:center;">Download
    Subtitle</button>
</div>`;
  document.body.appendChild(container);

  const button = document.getElementById(buttonId);
  const select = document.getElementById(selectId);
  let avid;
  let bvid;
  let listData = null;
  let detailData = {};
  let textDataCache = {};
  function getText(selector) {
    const dom = document.querySelector(selector);
    if (!dom) {
      return '';
    }
    const t = dom.textContent || '';
    return t.trim();
  }
  // 绑定按钮点击事件
  button.addEventListener('click', function () {
    handleClick();
  });

  async function handleClick() {
    try {
      const multiplePage = getText(
        '#multi_page > div.cur-list > ul > li.on > a > div > div.link-content > span.part',
      );
      const title = getText('#viewbox_report > h1');
      const textName = multiplePage || title;
      // 获取所有字幕
      const subtitleJson = await getSubtitleJSON();
      const index = subtitleJson.findIndex((v) => v.part === textName);
      const realIndex = index >= 0 ? index : 0;
      const cid = subtitleJson[realIndex].cid;

      const detailData = await getSubtitleDetail(cid);
      const subtitleItem = detailData.find((v) => v.lan.includes(select.value));
      if (!subtitleItem) {
        alert('当前视频没有找到英文字幕');
        return;
      }
      const result = await getSubtitleText(subtitleItem.subtitle_url);
      const resultList = result.map((v) => {
        return `${v.startTime} - ${v.endTime} : ${v.content.replaceAll(
          '\n',
          ' ',
        )}`;
      });
      window.saveAs(
        new Blob([resultList.join('\n')], { type: '' }),
        textName + '_' + select.value + '.txt',
      );
    } catch (error) {
      // 显示错误信息
      alert(error && error.message);
    }
  }

  async function getSubtitleDetail(cid) {
    return new Promise((resolve, reject) => {
      if (detailData[cid]) {
        resolve(detailData[cid]);
        return;
      }
      // 构造获取字幕链接的 API 链接
      let subtitleLink = 'https://api.bilibili.com/x/player/v2?';
      subtitleLink += 'cid=' + cid;
      if (avid) {
        subtitleLink += '&aid=' + avid;
      } else if (bvid) {
        subtitleLink += '&bvid=' + bvid;
      }
      subtitleLink += '&qn=32&type=&otype=json&ep_id=&fourk=1&fnver=0&fnval=16';

      // 发送获取字幕链接的请求
      GM_xmlhttpRequest({
        method: 'GET',
        url: subtitleLink,
        onload: function (subtitleResponse) {
          if (subtitleResponse.status === 200) {
            const subtitleJson = JSON.parse(subtitleResponse.responseText);
            const result = subtitleJson.data.subtitle.subtitles || [];
            detailData[cid] = result;
            resolve(result);
          } else {
            reject(new Error('获取字幕链接失败'));
          }
        },
      });
    });
  }

  // 获取视频所有字幕的 JSON 数据
  async function getSubtitleJSON() {
    return new Promise((resolve, reject) => {
      if (listData) {
        resolve(listData);
        return;
      }
      const url = window.location.href;
      const avidRegex = /\/av([0-9]+)\//;
      const bvidRegex = /\/(BV[0-9a-zA-Z]+)\/?/;
      const avidMatch = url.match(avidRegex);
      const bvidMatch = url.match(bvidRegex);
      avid = avidMatch ? avidMatch[1] : null;
      bvid = bvidMatch ? bvidMatch[1] : null;

      // 构造获取视频信息的 API 链接
      let apiLink;
      if (avid) {
        apiLink = 'https://api.bilibili.com/x/player/pagelist?aid=' + avid;
      } else if (bvid) {
        apiLink = 'https://api.bilibili.com/x/player/pagelist?bvid=' + bvid;
      }

      // 发送获取视频信息的请求
      GM_xmlhttpRequest({
        method: 'GET',
        url: apiLink,
        onload: function (response) {
          if (response.status === 200) {
            const responseJson = JSON.parse(response.responseText);
            listData = responseJson.data;
            resolve(responseJson.data);
          } else {
            reject(new Error('获取视频信息失败'));
          }
        },
      });
    });
  }

  // 发送获取字幕文件内容的请求
  function getSubtitleText(subtitleUrl) {
    return new Promise((resolve, reject) => {
      if (textDataCache[subtitleUrl]) {
        resolve(textDataCache[subtitleUrl]);
        return;
      }
      subtitleUrl = 'https://' + subtitleUrl;
      GM_xmlhttpRequest({
        method: 'GET',
        url: subtitleUrl,
        responseType: 'json',
        onload: function (response) {
          if (response.status === 200) {
            let count = 1;
            const subtitles = response.response.body;
            const subtitleText = subtitles.map((subtitle) => {
              // 部分字幕可能没有subtitle.sid参数，手动编号
              const sid = count++;
              const startTime = formatTime(subtitle.from);
              const endTime = formatTime(subtitle.to);
              return {
                sid,
                startTime,
                endTime,
                content: subtitle.content,
              };
            });
            textDataCache[subtitleUrl] = subtitleText;
            resolve(subtitleText);
          } else {
            reject(new Error('获取字幕文件内容失败'));
          }
        },
      });
    });
  }

  // 格式化时间，将秒数转化为分钟
  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return minutes + ':' + seconds;
  }
})();
