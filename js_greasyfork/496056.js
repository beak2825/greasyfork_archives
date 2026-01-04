// ==UserScript==
// @name        metruyencv.com Tesseract
// @namespace   Violentmonkey Scripts
// @match       https://metruyencv.com/truyen/*
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.listValues
// @grant       GM.deleteValue
// @grant       GM.setClipboard
// @version     1.23
// @author      -
// @description Tải truyện từ metruyencv bằng cách nhận dạng những đoạn bị chuyển thành canvas

// @require     https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/5.1.0/tesseract.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.6.0/dom-to-image.min.js
// @run-at      document-idle
// @license     MIT2
// @downloadURL https://update.greasyfork.org/scripts/496056/metruyencvcom%20Tesseract.user.js
// @updateURL https://update.greasyfork.org/scripts/496056/metruyencvcom%20Tesseract.meta.js
// ==/UserScript==
let maxChapterNumber = 999999;

function sleep(ms) { return new Promise((rs) => setTimeout(rs, ms)); }

async function waitForKeyElement(el, ms = 1000, attr = false) {
  const delay = 300;
  const retry = Math.floor(ms / delay);
  await sleep(delay);
  for (let i = 0; i < retry; i++) {
    let e = document.querySelector(el);
    if (e) {
      if (attr) {
        switch (attr) {
          case 'innerHTML':
          case 'textContent':
          case 'innerText': if (e.innerText) return true; break;
          case 'value': if (e.value) return true; break;
          default: if (e.getAttribute(attr)) return true;
        }
      } else return true;
    }
    await sleep(delay);
  }
  return false;
}

function reEnableConsoleLog(c) {
  switch (c) {
    case 1: console.log = console.dir; break;
    case 2: console.log = console.info; break;
    case 3: console.log = console.debug; break;
    case 4: console.log = console.warn; break;
    default: {
      const iF = document.createElement('iframe');
      document.body.appendChild(iF);
      iF.style.display = 'none';
      window.console.log = iF.contentWindow.console.log;
    }
  }
}

async function getMainElement(el = document.body, scrollType = true) {
  const pageRect = el.getBoundingClientRect();
  const scrollHeight = window.innerHeight * .9;

  scrollTo(pageRect.left, pageRect.top);
  if (scrollType)
    for (let i = 1; i * scrollHeight < pageRect.height; i++) {
      scrollBy(0, scrollHeight);
      await sleep(300);
      pageRect = el.getBoundingClientRect();
    }
  else scrollTo({ left: pageRect.right, top: pageRect.bottom, behavior: "smooth" });

  scrollTo(Math.abs(parseInt((pageRect.width - window.innerWidth) / 2)), Math.abs(parseInt((pageRect.height - window.innerHeight) / 2)));

  let mainArr = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight / 2)

  mainArr = mainArr.filter(e => {
    if (/img|picture|video|audio|span|input|button|body|html/i.test(e.tagName)) return false;
    let eS = getComputedStyle(e);
    return eS.width.slice(0, -2) * eS.height.slice(0, -2) > pageRect.width * pageRect.height * .3
  })
  return mainArr;
}

function isChuongCuoi() { return location.href.endsWith('/chuong-cuoi') }

async function startDownload(url) {
  if (!window.location.href.startsWith('https://metruyencv.com/truyen/')) return;
  await GM.setValue('downloading', true);
  if (/^https:\/\/metruyencv\.com\/truyen\/[a-z\-\d]+\/?$/.test(window.location.href)) window.location.assign(window.location.href + '/chuong-1');
  else window.location.reload();
}

async function loadChapterContent() { //convert full content to image, orc on it
  let chapterContent = '';
  await waitForKeyElement('#load-more', 1000, 'innerText'); //vi sao de 1000, khi khong la active tab settimeout giam con 1000

  if (document.querySelectorAll('#chapter-detail canvas').length > 0) {
    let im = await domtoimage.toPng(document.querySelector('#chapter-detail'));  //800ms
    const ts = await Tesseract.createWorker('vie');
    const ret = await ts.recognize(im);  //40s-180s
    chapterContent = ret.data.text;
    ts.terminate();
  }
  else chapterContent = document.querySelector('#chapter-detail').innerText;
  return chapterContent;
}

async function getChapterContent() {
  await waitForKeyElement('#load-more', 1000, 'innerText');
  await sleep(300); //cho chac an

  let canvas = document.querySelectorAll('#chapter-detail canvas');
  if (canvas.length > 0) {
    //let img = await domtoimage.toPng(document.querySelector('#chapter-detail'));  //800ms
    const scheduler = await Tesseract.createScheduler();
    let workers = Array(navigator.hardwareConcurrency - 1);

    for (let i = 0; i < workers.length; i++) workers[i] = await Tesseract.createWorker('vie');
    workers = await Promise.all(workers.map((wk) => (scheduler.addWorker(wk))));

    let result = await Promise.all(Array.from(canvas).map((cv) => (scheduler.addJob('recognize', cv.toDataURL()))));
    result.forEach((e, i) => canvas[i].outerHTML = `<fromcanvas>${e.data.text}</fromcanvas>`);

    scheduler.terminate();
  }

  return document.querySelector('#chapter-detail')?.innerText;
}

async function finishdownload() {
  let storyName = await GM.getValue('storyName');
  await GM.deleteValue('storyName');
  await GM.deleteValue('downloading');
  let chapters = await GM.listValues();
  chapters.sort((a, b) => { parseInt(a) - parseInt(b) });
  let content = await Promise.all(chapters.map(chapter => GM.getValue(`${chapter}`)));
  await Promise.all(chapters.map(ch => GM.deleteValue(ch)));

  content = content.join('\n\n').replaceAll(/\n{1,1}/g, '\n\n').replaceAll(/\n{3,}/g, '\n\n');
  let download = document.createElement('a');
  download.href = 'data:attachment/text,' + encodeURI(content);
  download.target = '_blank';
  download.download = storyName + `(c${chapters[0]}-c${chapters.at(-1)})` + '.txt';
  download.click();
  return;
}

(async function () {
  window.scrollTo(0, 10000);
  reEnableConsoleLog();

  let arr = window.location.href.match(/^https:\/\/metruyencv\.com\/truyen\/[a-z\-\d]+\/chuong-(\d+|cuoi)/i);
  let chapterNumber = (arr && arr[1]) ? (isNaN(arr[1]) ? 0 : Number(arr[1])) : 0; //0 means 'chuong-cuoi'
  let downloading = await GM.getValue('downloading', false);

  if (downloading) {
    document.body.addEventListener('keydown', async (e) => {
      console.log(e);
      if (e.key == 'F7' || e.code == 'F7') await finishdownload();
    });

    if (isChuongCuoi() || chapterNumber == 0 || chapterNumber > maxChapterNumber) { await finishdownload(); return; }
    else {
      let chapterContent = await getChapterContent();
      const story = document.querySelector('main h1>a').textContent.trim();
      const chapterTitle = document.querySelector('main h2').textContent.trim();
      let storyName = await GM.getValue('storyName', '');
      if (storyName == '') await GM.setValue('storyName', story);
      await GM.setValue(chapterNumber.toString(), chapterTitle + '\n\n' + chapterContent);

      //move to next chapter
      document.querySelector('[data-x-bind="GoNext"]').click();
    }

  } else {  // else of if(downloading)
    await GM.deleteValue('downloading');
    const btn = document.createElement('button');
    document.body.appendChild(btn);
    btn.innerText = 'Bam de tai toan bo truyen';
    btn.onclick = startDownload;
    btn.style.border = "1px solid";
    btn.style.backgroundColor = 'red';

    console.time('Chay trong thoi gian');
    window.scrollTo(0, 10000);
    reEnableConsoleLog();
    let content = await getChapterContent();
    await GM.setClipboard(content);
    console.log(content);
    console.timeEnd('Chay trong thoi gian');
  }
})();