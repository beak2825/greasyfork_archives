// ==UserScript==
// @name         视频记录
// @namespace    xywc-s
// @author       xywc-s
// @version      2.0.0
// @description  记录看过的视频
// @match        https://spankbang.com/*
// @match        https://*.xvideos.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spankbang.com
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @require     https://cdn.jsdelivr.net/npm/idb@7/build/umd.js
// @require      https://unpkg.com/notyf@3.10.0/notyf.min.js
// @resource     NotifyCSS https://unpkg.com/notyf@3.10.0/notyf.min.css
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450312/%E8%A7%86%E9%A2%91%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/450312/%E8%A7%86%E9%A2%91%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==
/*jshint esversion: 10 */


const NotifyCSS = GM_getResourceText("NotifyCSS");
GM_addStyle(NotifyCSS);

const notyf = new Notyf({
    position: {
        x: 'right',
        y: 'top'
      }
});



function xvideosRecord() {
  class Button {
    constructor(id, el) {
      this.btn = document.createElement('button')
      this.btn.innerHTML = '<span class="icon-f icf-plus-square"></span>'
      this.btn.onclick = () => {
        const ids = GM_getValue('xvideos', [])
        ids.push(id)
        GM_setValue('xvideos', ids)
        notyf.success('记录成功')
        el?el.remove():this.btn.remove()
      }
      return this.btn
    }
  }

  const ids = GM_getValue('xvideos', [])
  const videoBox = document.querySelector('.mozaique')

  if (videoBox) {
    const videos = videoBox.children
    for (let video of videos) {
      const v_id = video.getAttribute('data-id')
      if (!v_id) {
        video.style.display = 'none';
      }
      if (ids.includes(v_id)) {
        video.style.display = 'none';
      } else {
        const title = video.children[1].children[0]
         if(title) title.prepend(new Button(v_id, video))
      }
    }
  }
  if(html5player){
    const v_id = html5player.id_video
    if(!ids.includes(v_id)){
      const bar = document.querySelector('#v-actions .tabs')
      bar.prepend(new Button(v_id))
    }
  }
}

function spankBangRecord() {
  const storage = localStorage.getItem('ids')

  const list = document.querySelectorAll('div[id^="v_id"]')
  const v = document.querySelector('#video')

  listVideoRecord(list)
  if (v) {
      const right = document.querySelector('.right')
      console.log({right})
      if(right) right.style.display = 'none'
      mainVideoRecord(v)
  }

  function mainVideoRecord(v) {
    const vid = v.getAttribute('data-videoid')
    const title = document.querySelector('.main_content_title')
    if (storage && storage.includes(vid)) {
      // 已记录
    } else {
      const a = document.createElement('a')
      a.innerHTML =
        '<svg class="i_svg i_star"><use xlink:href="/static/desktop/gen/universal.master.6.1.00d54069.svg#star"></use></svg>'
      a.title = '记录'
      a.style.cursor = 'pointer'
      a.onclick = () => {
        localStorage.setItem('ids', storage + ',' + vid)
        notyf.success('记录成功')
        a.remove()
      }
      title.append(a)
    }
  }

  function listVideoRecord(list) {
    list.forEach((item) => {
      const listVID = item.getAttribute('data-id')
      if (storage && storage.includes(listVID)) {
        item.style.display = 'none'
      } else {
        const btn = document.createElement('span')
        btn.classList.add('b')
        btn.innerHTML =
          '<svg class="i_svg i_plus-square"><use xlink:href="/static/desktop/gen/universal.master.6.1.00d54069.svg#plus-square"></use></svg>'
        btn.onclick = () => {
          //localStorage.setItem('ids', localStorage.getItem('ids') + ',' + listVID)
          notyf.success('记录成功')
          //btn.remove()
        }
        item.querySelector('.stats').append(btn)
        item.querySelector('.stats').children[0].remove()
      }
    })
  }
}

/**
 * This creates the CSS needed to gray out the thumbnail and display the Watched text over it
 * The style element is added to the bottom of the body so it's the last style sheet processed
 * this ensures these styles take highest priority
 */
const style = document.createElement("style");
style.textContent = `img.watched {
		filter: grayscale(80%);
	}
	div.centered{
		position: absolute;
		color: white;
		height: 100%;
		width: 100%;
		transform: translate(0, -100%);
		z-index: 999;
		text-align: center;
	}
	div.centered p {
		position: relative;
		top: 40%;
		font-size: 1.5rem;
		background: rgba(0,0,0,0.5);
		display: inline;
		padding: 2%;
	}`;
document.body.appendChild(style);

class Button {
    constructor(el, db) {
        this.btn = document.createElement('button')
        this.btn.title = 'watched'
        this.btn.innerHTML = '<svg class="i_svg i_star"><use xlink:href="/static/desktop/gen/universal.master.6.1.00d54069.svg#star"></use></svg><span>watched</span>'
        this.btn.onclick = async () => {
            // todo 记录 标记
            const video = getVideo(el)
            const res = await storeVideo(video, db)
            tagImg(el)
            notyf.success('记录成功')
            this.btn.remove()
        }
        return this.btn
    }
}
/**
 * Splits a floating point number, and returns the digits from after the decimal point.
 * @param float A floating point number.
 * @returns A number.
 */
function after(float) {
    const fraction = float.toString().split('.')[1];
    return parseInt(fraction);
}
/**
 * Fetches a webpage from a given URL and returns a promise for the parsed document.
 * @param url The URL to be fetched.
 * @returns A parsed copy of the document found at URL.
 */
async function getPage(url) {
    const response = await fetch(url);
    const parser = new DOMParser();
    if (!response.ok) {
        throw new Error(`getPage: HTTP error. Status: ${response.status}`);
    }
    // We turn the response into a string representing the page as text
    // We run the text through a DOM parser, which turns it into a useable HTML document
    return parser.parseFromString(await response.text(), "text/html");
}
/**
 * Fetches all videos from the account history, and adds them to the empty database.
 * @param db The empty database to populate.
 * @returns An array of keys for the new database entries.
 */
async function buildVideoHistory(db) {
    const historyURL = "https://spankbang.com/users/history?page=";
    let pages = [];
    pages.push(await getPage(`${historyURL}1`));
    // This gets the heading that says the number of watched videos, uses regex for 1 or more numbers
    // gets the matched number as a string, converts it to the number type, then divides by 34
    const num = Number(pages[0].querySelector("div.data h2").innerText.match(/\d+/)[0]) / 34;
    const numPages = after(num) ? Math.trunc(num) + 1 : num;
    function getVideos(historyDoc) {
        const videos = Array.from(historyDoc.querySelectorAll('div[id^="v_id"]'));
        return videos.map(div => {
            const thumb = div.querySelector("a.thumb");
            const _name = div.querySelector("a.n");
            return { id: div.id, url: thumb.href, name: _name.innerText };
        });
    }
    //If history has more than 34 videos, pages will be > 1
    //We fetch all the pages concurrently.
    if (numPages > 1) {
        const urls = [];
        for (let i = 2; i <= numPages; i++) {
            urls.push(`${historyURL}${i}`);
        }
        pages = pages.concat(await Promise.all(urls.map(getPage)));
    }
    let toAdd = pages.reduce((videos, page) => videos.concat(getVideos(page)), []);
    const writeStore = db.transaction("videos", "readwrite").store;
    return Promise.all(toAdd.map(video => writeStore.put(video)));
}
/**
 * Checks the videos object store for entries, and populates it if empty.
 * @param db The database.
 * @returns The database.
 */
async function checkStoreLength(db) {
    const readStore = await db.getAllKeys("videos");
    if (readStore.length === 0) {
        await buildVideoHistory(db);
    }
    return db;
}
/**
 * Checks the database for any watched videos on the current page.
 * @param db The database containing watched history.
 * @returns The database.
 */
async function tagAsWatched(db) {
    // We check for the existance of any watched videos on the current page
    // If there are any, we move to the thumbnail and add the .watched class
    // This applys the CSS style above, and allows us to easily find the videos again
    const names = Array.from(document.querySelectorAll('div[id^="v_id"]'));
    const readStore = db.transaction("videos").store;
    const keys = await readStore.getAllKeys();
    names.forEach((e)=>{
        if (keys.includes(e.id)) {
            tagImg(e)
        }else {
            const bar = e.querySelector('.stats');
            bar && bar.prepend(new Button(e, db))
            console.log('no-tag:',e.id)
        }
    });
    return db;
}

function tagImg(e) {
    const img = e.querySelector("a picture img");
    //console.log(`Marking ${e.innerText} as watched`)
    img.classList.add("watched");
    markDiv(img)
    return img;
}

function getVideoID() {
    try {
         const div = document.querySelector("div#video");
         return `v_id_${div.dataset.videoid}`;
    }
    catch {
        throw new Error("getVideoID: div#video not found!");
    }
}
function getVideoURL() {
    try {
        return document.querySelector('meta[property="og:url"]').content;
    }
    catch {
        throw new Error("getVideoURL: meta element not found!");
    }
}
function getVideoName() {
    try {
        const heading = document.querySelector("div.left h1");
        return heading ? heading.innerText : "Untitled";
    }
    catch {
        throw new Error("getVideoName: heading element not found!");
    }
}

function getVideo(e){
    const url = e.querySelector('a').href
    const name = e.querySelector('a').title
  const video = { id: e.id, url, name}
  console.log(video)
  return video
}

async function storeVideo(video, db) {
    let writeStore = db.transaction("videos", "readwrite").store;
    return writeStore.add(video);
}

/**
 * Checks for the current video in the database, and adds it if not found.
 * @param db The database containing watched history.
 * @returns A promise for the key of the added video.
 */
async function checkStoreForVideo(db) {
    const url = `${window.location}`;
    if (!/spankbang\.com\/\w+\/video\//.test(url) &&
        !/spankbang\.com\/\w+-\w+\/playlist\//.test(url)) {
        return;
    }
    const video = { id: getVideoID(), url: "", name: "" };
    let readStore = db.transaction("videos").store;
    const lookup = await readStore.get(video.id);
    if (lookup !== undefined) {
        return;
    }
    video.url = getVideoURL();
    video.name = getVideoName();
    let writeStore = db.transaction("videos", "readwrite").store;
    return writeStore.add(video);
}
/**
 * Checks the current page for any videos marked as watched, and adds the watched text in front of them.
 * @returns An array containing the newly created Div elements
 */
function filterWatched() {
    const docQuery = Array.from(document.querySelectorAll("img.watched"));
    return (docQuery.length > 0) ? docQuery.map(markDiv) : [];
}

/**
 * MarkDiv
 */
function markDiv(e) {
    const newPara = document.createElement("p");
    newPara.textContent = "Watched";
    const newDiv = document.createElement("div");
    newDiv.classList.add("centered");
    newDiv.appendChild(newPara);
    return e.parentElement.parentElement.appendChild(newDiv);
}

/**
 * Callback function for upgrade event on openDB()
 * @param db The database
 */
function upgrade(db) {
    const store = db.createObjectStore("videos", {
        keyPath: "id",
        autoIncrement: false,
    });
    store.createIndex("url", "url", { unique: true });
}
idb.openDB("history", 1, { upgrade })
    .then(checkStoreLength)
    .then(tagAsWatched)
    .then(checkStoreForVideo)
    .catch(e => console.trace(e));

/**
const domain = location.host.split('.').at(-2)
switch (domain) {
  case 'spankbang':
    spankBangRecord()
    break;
  case 'xvideos':
    xvideosRecord();
    break;
  default: ''
    break;
}
*/