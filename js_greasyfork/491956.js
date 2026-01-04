// ==UserScript==
// @name         Youtube Bilingual Subtitles Download
// @name:zh-CN   Youtube 双语字幕下载
// @namespace    https://github.com/FLZeng/Y2B_Biling_Subs_DL
// @version      2024-04-08-3
// @description  YouTube bilingual subtitles with download button.
// @description:zh-CN   将 Youtube 默认生成的英文字幕替换为中英双语字幕，并在侧边栏加入双语、中文、英文三种字幕 SRT 文件的下载按钮。
// @author       FLZeng
// @match        *://www.youtube.com/*
// @match        *://m.youtube.com/*
// @require      https://unpkg.com/ajax-hook@latest/dist/ajaxhook.min.js
// @run-at       document-start
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491956/Youtube%20%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/491956/Youtube%20%E5%8F%8C%E8%AF%AD%E5%AD%97%E5%B9%95%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==


// 计算字幕时间
function CalcTime(time) {
  var second = Math.floor(time / 1000);
  var minute = Math.floor(second / 60);
  var hour = Math.floor(minute / 60);
  minute = Math.floor(minute - hour * 60);
  second = Math.floor(second - minute * 60 - hour * 60 * 60);
  var ms = Math.floor(time - (second + minute * 60 + hour * 60 * 60));

  hour = '00' + hour;
  minute = '00' + minute;
  second = '00' + second;
  ms = ms + '000';

  hour = hour.substr(hour.length - 2, hour.length);
  minute = minute.substr(minute.length - 2, minute.length);
  second = second.substr(second.length - 2, second.length);
  ms = ms.substr(0, 3);

  return [hour, minute, second].join(':') + '.' + ms;
}

// 生成字幕对象列表
function GenerateSubsList(events) {
  var subs_list = [];

  function AppendText(startMs, durationMs, text) {
    var last_item = null;

    if (subs_list.length > 0) {
      var index = subs_list.length - 1;
      last_item = subs_list[index];
      if (last_item.start === startMs && last_item.end === startMs + durationMs) {
        if (!(last_item.text === '\n' && text === '\n')) {
          last_item.text += text;
        }
        subs_list[index] = last_item;
        return;
      }
    }

    last_item = {
      start: startMs,
      end: startMs + durationMs,
      text: text
    };

    subs_list.push(last_item);
  }

  var rbRubys = new Map();
  for (let i = 0; i < events.length; i++) {
    let event = events[i];
    var pParentId = event.rbRuby;
    if (pParentId !== 10) {
      pParentId = 10 < pParentId ? pParentId - 1 : pParentId;
      rbRubys.set(i, { rf: pParentId });
    }
  }

  for (let i = 0; i < events.length; i++) {
    let event = events[i];
    var startMs = event.tStartMs;
    var durationMs = event.dDurationMs;
    if (event.id) {
      continue;
    }
    if (event.dDurationMs === 0) {
      event.dDurationMs = 5e3;
    }
    var segs = event.segs;
    for (let l = 0; l < segs.length; l++) {
      var seg = segs[l];
      if (seg.utf8) {
        if (seg.utf8 === '\n' || seg.utf8 === '\n\n') {
          AppendText(0, 0, '\n');
          continue;
        }
        var pPenId = seg.pPenId;
        seg = null;
        if (rbRubys.get(pPenId) && rbRubys.get(pPenId).rf === 1) {
          if (l + 3 >= segs.length || !segs[l + 1].pPenId || !segs[l + 2].pPenId || !segs[l + 3].pPenId) {
            seg = false;
          } else {
            let pPenId = segs[l + 1].pPenId;
            (pPenId = rbRubys.get(pPenId)) && pPenId && 2 === pPenId.rf ? (pPenId = segs[l + 2].pPenId,
              pPenId = rbRubys.get(pPenId),
              !pPenId || !pPenId.rf || 3 > pPenId.rf ? seg = !1 : (pPenId = segs[l + 3].pPenId,
                seg = (pPenId = rbRubys.get(pPenId)) && pPenId.rf && 2 === pPenId.rf ? !0 : !1)) : seg = !1
          }
        }
        if (seg) {
          AppendText(startMs, startMs + durationMs, [segs[l + 1].utf8, segs[l + 2].utf8, segs[l + 3].utf8].join(' '));
        } else {
          AppendText(startMs, startMs + durationMs, segs[l].utf8);
        }
      }
    }
  }

  function GetNext(k) {
    for (var i = k + 1; i < subs_list.length; i++) {
      if (subs_list[i].start !== 0 && subs_list[i].end !== 0 && subs_list[i].text !== '\n') {
        return subs_list[i];
      }
    }
    return undefined;
  }

  var start = 0;
  var end = 0;
  for (var i = 0; i < subs_list.length; i++) {
    if (subs_list[i].start === 0 && subs_list[i].end === 0 && subs_list[i].text === '\n') {
      continue;
    }
    if (start === 0 && subs_list[i].start !== 0) {
      start = subs_list[i].start;
    }
    if (end === 0 && subs_list[i].end !== 0) {
      end = subs_list[i].end;
    }
    if (GetNext(i)) {
      subs_list[i].end = GetNext(i).start - 1;
    } else {
      subs_list[i].end = end;
    }
    start = subs_list[i].start;
    end = subs_list[i].end;
  }

  return subs_list;
}

// 生成字幕文本
function GenerateSRTString(subs_list) {
  var res = [];
  var arr = (subs_list);
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].start === 0 && arr[i].end === 0 && arr[i].text === '\n') {
      continue;
    }
    res.push((i + 1).toString());
    res.push([CalcTime(parseInt(arr[i].start)), ' --> ', CalcTime(parseInt(arr[i].end))].join(''));
    res.push(arr[i].text);
    res.push('');
  }
  return res.join('\n');
}

// 保存字幕按钮
function GenerateSaveSubButton(events, lang) {
  const btn = document.getElementById('btn_save_subs_' + lang);
  if (btn) {
    btn.remove();
  }

  const lang_dict = {'en': '英文', 'zh': '中文', 'biling': '双语'};

  var subs_list = GenerateSubsList(events);
  var srtString = GenerateSRTString(subs_list);
  var fileContent = 'data:text/plain;charset=utf-8,' + encodeURIComponent(srtString);
  var fileName = '[' + lang_dict[lang] + ']' + window.ytInitialPlayerResponse.videoDetails.title + '.srt';

  // 生成保存字幕按钮
  var saveSubLink = document.createElement('a');
  saveSubLink.id = 'btn_save_subs_' + lang;
  saveSubLink.innerText = lang_dict[lang];
  saveSubLink.setAttribute('href', fileContent);
  saveSubLink.setAttribute('download', fileName);
  saveSubLink.style = 'display: inline-block; margin: 8px 8px 8px 0px; padding: 4px 12px; border-radius: 8px; font-size: 1.4rem; line-height: 2rem; cursor: pointer; text-decoration: none; background-color: rgba(0, 0, 0, 0.05);';

  var p = document.createElement('p');
  p.innerText = '字幕下载';
  p.style = 'display: inline-block; margin: 8px 10px; font-size: 1.4rem; line-height: 2rem; font-weight: bold;';

  var panel = document.getElementById('div_downlod_str');
  var secondaryPanel = document.getElementById('secondary');
  var coltrolPanel = document.querySelector('.ytp-chrome-controls .ytp-right-controls');

  if (secondaryPanel) {
    if (panel === null) {
      panel = document.createElement('div');
      panel.id = 'div_downlod_str';
      panel.style.marginBottom = '20px';
      panel.appendChild(p);
      secondaryPanel.prepend(panel);
    }
    saveSubLink.style.color = 'rgb(15, 15, 15)';
    panel.appendChild(saveSubLink);
  } else if (coltrolPanel) {
    if (panel === null) {
      panel = document.createElement('div');
      panel.id = 'div_downlod_str';
      panel.style.position = 'absolute';
      panel.style.bottom = '100%';
      panel.style.right = '0';
      panel.style.zIndex = '999';
      panel.appendChild(p);
      coltrolPanel.prepend(panel);
    }
    saveSubLink.style.backgroundColor = 'rgba(28, 28, 28, .9)';
    saveSubLink.style.fontSize = '109%';
    p.style.fontSize = '109%';
    panel.appendChild(saveSubLink);
  }
}

function FixEventDuration(events) {
  let validEvents = events.filter(event => event.aAppend !== 1 && event.segs);
  const len = validEvents.length;
  for (let i = 0; i < len; i++) {
    let event = validEvents[i];
    if (i < len - 1 && event.tStartMs + event.dDurationMs >= validEvents[i + 1].tStartMs) {
      event.dDurationMs = validEvents[i + 1].tStartMs - event.tStartMs - 1;
    }
  }
}

function HandleSubsResponse(response) {
  // 检测浏览器首选语言，如果没有，设置为英语
  // let localeLang = navigator.language.split('-')[0] || 'en'; // 跟随 YouTube 页面所用语言
  let localeLang = 'zh';  // 取消注释此行以在此处定义您希望的语言

  let xhr = new XMLHttpRequest(); // 创建新的 XMLHttpRequest
  // 清除 xhr 请求参数中的 '&tlang=...'
  let url = response.config.url.replace(/(^|[&?])tlang=[^&]*/g, '');
  // 设置请求的字幕语言，并添加 '&translate_h00ked' 标志以避免无限循环
  url = `${url}&tlang=${localeLang}&translate_h00ked`;
  xhr.open('GET', url, false); // 打开 xhr 请求
  xhr.send(); // 发送 xhr 请求
  let enJson = null; // 声明英文 JSON 变量
  let zhJson = null; // 声明中文 JSON 变量
  let bilingJson = null; // 声明双语 JSON 变量
  if (response.response) {
    const enJsonResponse = JSON.parse(response.response);
    if (enJsonResponse.events) {
      FixEventDuration(enJsonResponse.events);
      bilingJson = enJsonResponse;
      enJson = JSON.parse(JSON.stringify(enJsonResponse));
    }
  }
  zhJson = JSON.parse(xhr.response); // 解析 xhr 响应
  FixEventDuration(zhJson.events);
  let isSingleSegEvent = true;
  for (const enJsonEvent of enJson.events) {
    if (enJsonEvent.segs && enJsonEvent.segs.length > 1) {
      isSingleSegEvent = false;
      break;
    }
  }
  console.log('isSingleSegEvent: ' + isSingleSegEvent);
  // 将默认字幕与本地语言字幕合并
  if (isSingleSegEvent) {
    // 如果片段长度相同
    for (let i = 0, len = bilingJson.events.length; i < len; i++) {
      const bilingJsonEvent = bilingJson.events[i];
      if (!bilingJsonEvent.segs) continue;
      const zhJsonEvent = zhJson.events[i];
      if (`${bilingJsonEvent.segs[0].utf8}`.trim() !== `${zhJsonEvent.segs[0].utf8}`.trim()) {
        // 避免在两者相同时合并字幕
        bilingJsonEvent.segs[0].utf8 += ('\n' + zhJsonEvent.segs[0].utf8);
      }
    }
    response.response = JSON.stringify(bilingJson); // 更新响应
  } else {
    // 如果片段长度不同（例如：自动生成的英语字幕）
    let pureZhEvents = zhJson.events.filter(event => event.aAppend !== 1 && event.segs);
    for (const bilingJsonEvent of bilingJson.events) {
      if (!bilingJsonEvent.segs || bilingJsonEvent.aAppend === 1) continue;
      let currentStart = bilingJsonEvent.tStartMs,
        currentEnd = currentStart + bilingJsonEvent.dDurationMs;
      let currentZhEvents = pureZhEvents.filter(pe => currentStart <= pe.tStartMs && pe.tStartMs < currentEnd);
      let zhLine = '';
      for (const zhEvent of currentZhEvents) {
        for (const seg of zhEvent.segs) {
          zhLine += seg.utf8;
        }
        zhLine += '﻿'; // 添加零宽空格，以避免单词粘在一起
      }
      let enLine = '';
      for (const seg of bilingJsonEvent.segs) {
        enLine += seg.utf8;
      }
      if (enLine.trim() !== zhLine.trim()) {
        bilingJsonEvent.segs[0].utf8 = enLine + '\n' + zhLine;
      } else {
        bilingJsonEvent.segs[0].utf8 = enLine;
      }
      bilingJsonEvent.segs = [bilingJsonEvent.segs[0]];
    }
    response.response = JSON.stringify(bilingJson); // 更新响应
  }
  GenerateSaveSubButton(bilingJson.events, 'biling');
  GenerateSaveSubButton(zhJson.events, 'zh');
  GenerateSaveSubButton(enJson.events, 'en');

  return response;
}

function ClickSubBtn() {
  var btn = document.querySelector('.ytp-chrome-controls .ytp-right-controls .ytp-subtitles-button');
  if (btn && btn.getAttribute('aria-pressed') !== true) {
    btn.click();
  }
}

// Hook 字幕请求
function AjaxHookSubs() {
  ah.proxy({
    onRequest: (config, handler) => {
      handler.next(config); // 处理下一个请求
    },
    onResponse: (response, handler) => {
      // 如果请求的 URL 包含 '/api/timedtext' 并且没有 '&translate_h00ked'，则为原始的字幕请求
      if (response.config.url.includes('/api/timedtext') &&
          response.config.url.includes('lang=en') &&
          response.headers["content-type"].includes('application/json') &&
          !response.config.url.includes('&translate_h00ked')) {
          response = HandleSubsResponse(response);
      }
      handler.resolve(response); // 处理响应
    }
  });

  setTimeout(ClickSubBtn, 1500);
}

/*
如果未自动加载，请切换字幕或关闭后再打开即可。默认语言为浏览器首选语言。
*/
(function () {
  // 当文档加载完成并且字幕可用时，调用 enableSubs 函数启用双语字幕
  if (document.readyState === 'complete') {
    // 如果文档已经加载完成，则启用双语字幕
    AjaxHookSubs();
  } else {
    // 如果文档尚未加载完成，添加事件监听器以在加载完成时启用双语字幕
    window.addEventListener('load', AjaxHookSubs);
  }
})();