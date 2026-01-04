// ==UserScript==
// @name        Bachngocsach Vip scraper
// @name:en     Bachngocsach Vip scraper
// @name:vi     Tải truyện vip bachngocsach
// @namespace   Violentmonkey Scripts
// @match       *://bachngocsach.info/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @version     1.1.0
// @author      Tác giả = tác = làm, giả là giả (dối) = làm giả
// @description Scrape novel content from bachngocsach.net.vn. Ctrl+Alt+S to start, Ctrl+Alt+C to stop.
// @description:vi Tải truyện từ bachngocsach.net.vn. Ctrl+Alt+S để bắt đầu, Ctrl+Alt+C để ngừng
// @description:en Scrape novel content from bachngocsach.net.vn. Ctrl+Alt+S to start, Ctrl+Alt+C to stop
// @license     MIT2
// @downloadURL https://update.greasyfork.org/scripts/490097/Bachngocsach%20Vip%20scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/490097/Bachngocsach%20Vip%20scraper.meta.js
// ==/UserScript==
const startKey={key:'KeyS', ctrlKey:true, altKey: true, shiftKey:false };
const stopKey= {key:'KeyC', ctrlKey:true, altKey: true, shiftKey:false };

const useEvent=false;

const sleep = (ms) => new Promise(rs => setTimeout(rs, ms));

const pressKey = (key) => window.dispatchEvent(new KeyboardEvent('keydown', { key: key, code: key, bubbles: true }));

function addUrlChangeEvent() {
  const urlchangeEvent= new Event('urlchange');
  history._pushState=history.pushState;
  history.pushState=(...args)=>{
    history._pushState(...args);
    if(!!window.onurlchange && typeof window.onurlchange =='function') window.onurlchange(); else
    window.dispatchEvent(urlchangeEvent);
  }

  window.addEventListener('popstate',()=>{
    if(!!window.onurlchange && typeof window.onurlchange =='function') window.onurlchange(); else
    window.dispatchEvent(urlchangeEvent);
  })
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

function getStyles(useRegex=true) {
  const style={};
  const styleStr=document.querySelector('style.dynamic-styles').textContent;
  if (!styleStr) return style;
  if(useRegex) {
    const reg=/\.?([0-9a-zA-Z]+?){order:([0-9]+?)}/g
    styleStr.matchAll(reg).forEach(m=>style[m[1]]=parseInt(m[2]));
  } else {
    styleStr.split('}').forEach(m=>{
      if(m=='') return;
      let s=m.split('{order:');
      if(s[0].startsWith('.')) style[s[0].slice(1)]=parseInt(s[1]); else style[s[0]]=parseInt(s[1]);
    })
  }
  return style;
}

function chapterContentByTreeWalker(el = document.body) {  //dang chay sai o day
  const textList = [];
  textList.toString = () => { return textList.reduce((s, n) => s += n.nodeValue, '') }
  const treeWalker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, (node) => {
    if (['META', 'SCRIPT', 'NOSCRIPT', 'STYLE', 'AREA', 'BASE', 'CANVAS', 'CODE', 'EMBED', 'LINK', 'MAP', 'PARAM', 'SOURCE', 'VIDEO', 'IMG', 'PICTURE', 'INPUT', 'TEXTAREA'].includes(node.parentNode?.tagName))
      return NodeFilter.FILTER_REJECT;
    return NodeFilter.FILTER_ACCEPT;
  });

  let node;
  while (node = treeWalker.nextNode())
    textList.push(node);
  return textList.toString();
}

function chapterContentByStyle() {
  console.log('Get chapter content');
  const result={};
  let t= document.querySelectorAll('main>div>.container>div>.line-clamp-1');
  result.storyName=t[0].textContent;
  result.chapterName=t[1].textContent;
  result.chapterNumber=parseInt(location.href.match(/.\/chuong-(\d+)/)[1]);

  const badText = document.querySelector('div.published-content');
  const goodText = badText?.previousElementSibling?.innerText||'';
  if (!badText) {result.chapterContent=goodText; return result;}

  let badLines = Array(badText.children.length);
  let style = getStyles();

  for (const eights of badText.children) {
    let className = eights.className.toLowerCase();
    if (!style[className]) style[className] = parseInt(getComputedStyle(eights).order);
    let badLine = Array(eights.children.length);
    for (const sixes of eights.children) {
      let tagName = sixes.tagName.toLowerCase();
      if (!style[tagName]) style[tagName] = parseInt(getComputedStyle(sixes).order);
      badLine[style[tagName]] = sixes.textContent;
    }
    badLines[style[className]] = badLine.join('');
  }
  result.chapterContent = (goodText.trim() + badLines.join('\n\n')).replaceAll(/\n{3,}/g, '\n\n').replaceAll('·', '');
  return result;
}

const getChapterContent=chapterContentByStyle;
// const getChapterContent=chapterContentByTreeWalker;

function startDownload(url) {
  console.log('Start downloading');
  GM_setValue('downloading', true);
  if (/^https:\/\/bachngocsach\.net\.vn\/truyen\/[a-z\-\d]+\/?$/.test(window.location.href)) window.location.assign(window.location.href + '/chuong-1');
  else window.location.reload();
}

async function stopDownload() {
  console.log('Stop downloading');
  let storyName = GM_getValue('storyName');
  GM_deleteValue('storyName');
  GM_deleteValue('downloading');
  let chapters = GM_listValues();
  chapters.sort((a, b) => { parseInt(a) - parseInt(b) });
  let content = await Promise.all(chapters.map(chapter => GM_getValue(`${chapter}`)));
  chapters.forEach(ch => GM_deleteValue(ch));
  content = content.join('\n\n').replaceAll(/\n{1,1}/g, '\n\n').replaceAll(/\n{3,}/g, '\n\n');

  let download = document.createElement('a');
  download.href = 'data:attachment/text,' + encodeURI(content);
  download.target = '_blank';
  download.download = storyName + `(c${chapters[0]}-c${chapters.at(-1)})` + '.txt';
  download.click();
  return;
}

function nextChapter() {
  console.log('Go to next chapter');
  if(Math.random() > .4) pressKey('ArrowRight'); //ArrowRight
  else {
    const t=document.querySelector('.container>div:nth-last-child(2)>div:first-child>a:last-of-type');
    t.scrollIntoView({behavior:'smooth'})
    t.click();
  }
}

function isLastChapter() {
  console.log('Is last chapter?');
  return document.querySelector('.container>div:nth-last-child(2)>div:first-child>a:last-of-type').href.endsWith('#');
}

async function download() {
  console.log('Downloading...');
  scrollTo({left:0,top:10000, behavior:'smooth'});
  await sleep(500+ Math.random()*600); //350 is necessary time the chapter content being loaded
  const chapter=getChapterContent();
  GM_setValue('storyName',chapter.storyName);
  GM_setValue(chapter.chapterNumber,chapter.chapterName+'\n\n'+chapter.chapterContent);
  scrollTo({left:0,top:0, behavior:'smooth'});
  await sleep(100+ Math.random()*300);
  if (isLastChapter()) await stopDownload();
  else nextChapter();
}

(async function(){
  if(window!==window.top) return;

  if (useEvent) {
    addUrlChangeEvent();
    //await sleep(1000);
    let txt=getChapterContent();
    console.log(txt.chapterContent);

    window.addEventListener('urlchange',async (e)=>{
      if (GM_getValue('downloading', undefined)) await download();
      else {
        console.log(getChapterContent().chapterContent); }
    })
  } else {
    let oldURL='';
    const observer= new MutationObserver(async (mList)=>{
      mList.forEach(async (m)=>{
        if (m.target.className?.includes('published-content')&& window.location.href!=oldURL) {
            oldURL=window.location.href;
            if (GM_getValue('downloading', false)) await download();
            else console.log(getChapterContent().chapterContent);
        }
      });
    });
    observer.observe(document.querySelector('body'), { childList: true, subtree:true });
  }

  window.addEventListener('keydown',async(e)=>{
    if (e.ctrlKey==startKey.ctrlKey && e.altKey==startKey.altKey && e.shiftKey==startKey.shiftKey && (e.key==startKey.key||e.code==startKey.key)) startDownload(location.href);
    if (e.ctrlKey==stopKey.ctrlKey && e.altKey==stopKey.altKey && e.shiftKey==stopKey.shiftKey && (e.key==stopKey.key||e.code==stopKey.key)) await stopDownload();
  })
})();