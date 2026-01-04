// ==UserScript==
// @name         Chapter counter for Map and Next Chapter choice
// @version      3.0.2
// @description  Counts and displays how many chapters each branch has inside on the map screen and when choosing your next chapter
// @author       sllypper
// @namespace    https://greasyfork.org/en/users/55535-sllypper
// @match        *://chyoa.com/story/*
// @match        *://chyoa.com/chapter/*
// @icon         https://chyoa.com/favicon.png
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.listValues
// @grant        GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/425316/Chapter%20counter%20for%20Map%20and%20Next%20Chapter%20choice.user.js
// @updateURL https://update.greasyfork.org/scripts/425316/Chapter%20counter%20for%20Map%20and%20Next%20Chapter%20choice.meta.js
// ==/UserScript==

/* Load the entire map by moving to the bottom, then click the Regenerate button. */

// runs automatically when opening a new map
let runAutomatically = true

// shows the floating buttons on the bottom-right of the page
let showFloatingButton = true
let showTogglerButton = true

// Style for the counter on the chapter pages. Use one of the below between ""
// alternative | simple | crazy | default
const cssStyle = "alternative"

/************************/

let chapterDataArray;
let chapterData;
let storyStorageId;
let pageType = getPageType()
console.log('The current page is a ' + pageType);

/************************/
(async() => {
    GM.registerMenuCommand("Get map & regenerate (experimental)", getMapAndRegenerateViaAjax, "k" )

    if (pageType == "map") {
        GM.registerMenuCommand("Regenerate map data", generateDraw, "r");
        GM.registerMenuCommand("Redraw map counters", drawChildrenCounter, "d");
        GM.registerMenuCommand("Fold read chapters", foldTopmostReadChapters, "f");
        GM.registerMenuCommand("Fold unread chapters", foldTopmostUnreadChapters, "u");

        await loadMapData()

        if (showFloatingButton) { document.body.appendChild(btnLoad()) }

        addStyleHead(".title-wrapper > .children { padding-right: 8px; }")

        if (showTogglerButton) { collapsibator() }
    }

    // /chapter/* and /story/* pages
    if (pageType == "chapter") {
        await showChapterCountOnChapterChoices()
        showChapterDate()

        // previous chapters map tree on clicking the link
        await prevMapInit()
    }

    GM.registerMenuCommand("Delete this from cache", deleteThisFromCache, "c");
    GM.registerMenuCommand("Delete entire cache", deleteEntireCache, "a");

    GM.registerMenuCommand("Get superParent Group sorted by New", () => console.log(getSuperParentGroupSortedByNew()) )

    unsafeWindow.computeParents = getSuperParentGroupSortedByNew
})();
return
/************************/

async function loadMapData() {
  if (! await attemptLoadChapterArrayFromCache() && runAutomatically) {
    // no map data on cache
    generateMap()
    drawChildrenCounter()
  } else {
    // got map data from cache
    drawChildrenCounter()
  }
}

function generateDraw() {
    generateMap()
    drawChildrenCounter()
}

function createChildrenElement(chapterCount) {
    var child = document.createElement('span')
    child.setAttribute('class', 'control-item children')
    let icon = document.createElement('i')
    icon.setAttribute('class', 'btb bt-folder')
    child.appendChild(icon);
    let count = document.createTextNode(" "+chapterCount)
    child.appendChild(count)
    return child
}

function addStyleHead(css) {
    var style = document.createElement('style');
    document.head.appendChild(style);
    style.textContent = css;
};

async function attemptLoadChapterArrayFromCache() {
  if (!storyStorageId) loadStoryPathName()
  if (! await storyIsInTheCache(storyStorageId)) {
    console.log('story not found in cache', GM.listValues(), storyStorageId);
    return false
  }

  let chapterDataJson = await GM.getValue(storyStorageId)

  chapterDataArray = JSON.parse(chapterDataJson);
  console.log("!! got map from cache");
  unsafeWindow.chapterDataArray = chapterDataArray
  console.log("Map available as a javascript array on `chapterDataArray`");

  return true
}

function deleteThisFromCache() {
    if (pageType == "map") {
        GM.deleteValue(getStoryStorageId())
    }
    let storyStorageId = getStoryStorageId()
    GM.deleteValue(storyStorageId)
}

function deleteEntireCache() {
    (GM.listValues()).forEach((value) => {
        GM.deleteValue(value)
    })
}

async function readOrGenerateMap() {
    if (! await attemptLoadChapterArrayFromCache()) generateMap()
}

function generateMap() {
    console.log("!! generating map");
    chapterDataArray = createStoryMap()
    console.log("Chapter Count = ", chapterDataArray.length);

    unsafeWindow.chapterDataArray = chapterDataArray
    console.log("Map available as a javascript array on `chapterDataArray`");

    console.log("!! assembling hierarchy tree");
    countMapChapters();
    console.log("!! done counting the children");

    // cache it
    GM.setValue(getStoryStorageId(), JSON.stringify(chapterDataArray))
}

/**
* counts and assigns the children count of all elements
*/
function countMapChapters() {
    for (const chapter of chapterDataArray) {
        // find the leaves of the tree
        if (chapter.children.length !== 0) continue;
        chapter.chapterCount = 0;

        let next = chapter.parent != null ? chapter.parent : -1;

        // rise through the branch until it can't
        while (next != -1) {
            //console.log("from", chapter.id, "to", next);
            next = countChildChaptersOf(next);
        }
        // then continue to the next chapter childless chapter
    }
    // done
}

/**
* Counts and assigns the chapterCount of the node at that index
* Aborts returning -1 if it already has been counted
* or can't because one of its children hasn't been counted yet
*
* @param {number} currIndex - The index of the node
* @returns {number} The index of the next node. -1 to abort
*/
function countChildChaptersOf(currIndex) {
    let nextIndex = -1;
    // if (currIndex > chapterDataArray.length) console.log('currIndex > chapterDataArray.length', currIndex, chapterDataArray.length);
    const currentNode = chapterDataArray[currIndex];
    if (currentNode.chapterCount != undefined) {
        // this node was already been processed
        // abort
        return nextIndex;
    }
    // sum the counts of its children
    const chapterCountSum = sumChildrenChaptersCount(currentNode);
    if (chapterCountSum === -1) {
        // one or more children haven't been processed yet
        // abort
        return nextIndex;
    }

    // on successful sum
    currentNode.chapterCount = chapterCountSum + currentNode.children.length;
    nextIndex = currentNode.parent !== null ? currentNode.parent : -1;

    return nextIndex;
}

/**
* Sums the chapterCount of all children of the attribute node
*/
function sumChildrenChaptersCount(chapterObj) {
    return chapterObj.children.reduce((acc, curr) => {
        const currentNode = chapterDataArray[curr];
        if (currentNode.chapterCount == undefined) {
            return -1;
        }
        return acc !== -1 ? acc + currentNode.chapterCount : acc;
    }, 0);
}

function drawChildrenCounter() {
    let list = document.querySelectorAll(".title-wrapper");
    if (list.length !== chapterDataArray.length) {
      console.log('Outdated data. Please regenerate the map');
      if (list.length >= chapterDataArray.length) { return }
    }

    list.forEach((elem, i) => {
        let existingChildren = elem.querySelector('.children')
        if (existingChildren) {
            // redraw
            existingChildren.remove()
        }

        let child = createChildrenElement(chapterDataArray[i].chapterCount)
        let page = elem.querySelector('.page')

        elem.insertBefore(child, page)
    })
}

// receives html dom element
// returns parsed element as an object
function createChapterObj(el) {
    const pel = {};

    let tempEl = el.querySelector(".title");

    pel.title = tempEl.textContent;
    pel.url = tempEl.href;

    // sometimes the author is empty and there's no <a> inside it
    tempEl = el.querySelector(".username > a");
    pel.author = tempEl ? tempEl.textContent : "";

    // page is completely unreliable for chapters loaded afterwards. It resets on loading
    // pel.page = el.querySelector(".page").textContent;

    // Sometimes the date is empty, but there's no issue here
    // console.log(el);
    pel.date = el.querySelector(".date").textContent;

    pel.parent = null;
    pel.children = [];
    // pel.linksTo = null;

    pel.margin = parseInt(el.style["margin-left"]);

    // link chapters don't have views, likes, or comments
    // so find out if the chapter is a link chapter or not

    const viewsEl = el.querySelector(".views");
    if (viewsEl == null) {
        pel.views = null;
        pel.likes = null;
        pel.comments = null;
        pel.isLinkChapter = 1;

        return pel;
    }

    pel.views = parseInt(viewsEl.textContent.split(",").join("")) || 0;
    pel.likes = parseInt(el.querySelector(".likes").textContent) || 0;
    pel.comments = parseInt(el.querySelector(".comments").textContent) || 0;
    pel.isLinkChapter = 0;

    return pel;
}

// final list like [ chapterObj, (...) ]
// where every element has its parent and children noted
function createStoryMap() {
    // temporary list, to get the DOM element from the page
    // let list = document.getElementsByClassName("story-map-content");
    // if (list == null || !list) return;
    // list = Array.from(list[0].children);
    let chapterElementArray = Array.from(document.querySelectorAll(".story-map-chapter"))

    let prevParentI = -1;
    const finalList = [];

    chapterElementArray.forEach((el, i) => {
    // for (const i in chapterElementArray) {
        // console.log("- Processing Chapter", i);
        // const el = chapterElementArray[i];

        // parse el and add it to the final list
        const chapterObj = createChapterObj(el);
        finalList[i] = chapterObj;
        // console.log(chapterObj);

        // now we find the parent of el

        // before checking margin
        // check if it's the first element of the list
        if (i == 0) {
            prevParentI = 0;
            // continue; // when using a for loop
            return;
        }

        // check margins

        const currElMargin = chapterObj.margin
        const prevElMargin = finalList[i-1].margin

        // check if el is child of prev el
        if (prevElMargin < currElMargin) {
            // prev el is parent
            chapterObj.parent = parseInt(i - 1);
            // add this el as child of prev element
            finalList[i - 1].children.push(parseInt(i));
            // set prev parent to prev element
            prevParentI = i - 1;
            // continue; // when using a for loop
            return;
        }

        // check if el is sibling of prev el
        if (prevElMargin == currElMargin) {
            // they share the same parent

            // prevParent is parent
            chapterObj.parent = prevParentI;
            // add this el as child of prevParent
            finalList[prevParentI].children.push(i);
            // continue; // when using a for loop
            return;
        }

        // then el must be the "uncle" of prev el
        // prevElMargin > currElMargin

        // use a loop go back through the parents from the previous node
        // to find the first element with margin smaller than self
        const selfMargin = chapterObj.margin;
        for (let j = i - 1; j >= 0; j = finalList[j].parent) {
            if (finalList[j].margin < selfMargin) {
                // found the parent: j
                const actualParentI = j;
                chapterObj.parent = actualParentI;
                // add this el as child of actual parent
                // finalList[actualParentI].children.push(chapterObj.id);
                finalList[actualParentI].children.push(i);
                // set prev parent to actual parent
                prevParentI = actualParentI;
                break;
            }
        }
    // } // when using a for loop
    })

    return finalList;
}

// button stuff

function createButton(text, action, styleStr) {
    let button = document.createElement('button');
    button.textContent = text;
    button.onclick = action;
    button.setAttribute('style', styleStr || '');
    return button;
};
function toStyleStr(obj, selector) {
    let stack = [],
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            stack.push(key + ':' + obj[key]);
        }
    }
    if (selector) {
        return selector + '{' + stack.join(';') + '}';
    }
    return stack.join(';');
};
function btnLoadCss() {
    return toStyleStr({
        'position': 'fixed',
        'bottom': 0,
        'right': 0,
        'padding': '2px',
        'margin': '0 10px 10px 0',
        'color': '#333',
        'background-color': 'rgb(246, 245, 244)',
        'z-index': '9999999999'
    })
}
function btnLoad() {
    return createButton('Regenerate', function() {
        generateDraw()
        // this.remove();
    }, btnLoadCss());
}

/* Depth Toggler */

function collapsibator() {
    const input = document.createElement('input')
    input.defaultValue = 1
    input.setAttribute('id', 'toggler-input')
    input.setAttribute('style', toStyleStr({
        // 'padding': '2px',
        'color': '#333',
        'width': '30px'
        // 'display': 'inline-block'
    }))

    const button = document.createElement('button')
    button.setAttribute('id', 'toggler-btn')
    button.textContent = 'Toggle'
    button.setAttribute('style', toStyleStr({
        'padding': '2px',
        'color': '#333',
        'background-color': 'rgb(246, 245, 244)',
        'display': 'inline-block',
        'font-size': '12px',
        'margin-left': '4px',
    }))
    button.onclick = () => {
        const level = document.getElementById('toggler-input').value
        toggleCollapsibleLevel(level)
    }

    const cont = document.createElement('div')
    cont.setAttribute('id', 'toggler-container')
    cont.setAttribute('style', toStyleStr({
        'position': 'fixed',
        'bottom': '50px',
        'right': '10px',
        'padding': '2px',
        'z-index': '9999999999'
    }))
    cont.appendChild(input)
    cont.appendChild(button)
    document.body.appendChild(cont)
}

// toggle all collapsibles from depht level "level"
function toggleCollapsibleLevel(level) {
    const chapters = Array.from(document.getElementsByClassName("story-map-chapter"));
    if (chapters == null) return;
    // if (!chapterDataArray.length) { console.error('chapterDataArray is undefined'); return; }
    if (!chapterDataArray) { console.error('chapterDataArray is undefined'); return; }

    const firstMargin = parseInt(chapters[0].style['margin-left'])
    const marginGap = parseInt(chapters[1].style['margin-left']) - firstMargin;

    for (let i = 0; i < chapterDataArray.length; i++) {
        // if (st.margin == (level*marginGap + firstMargin)) {
        if (chapterDataArray[i].margin == (level*marginGap + firstMargin)) {
            // toggle it
            const btn = chapters[i].querySelector('.btn.btn-link.collapsable.js-collapsable')
            if (btn) btn.click()

            // maybe will use this in the future for better performance???
            // wasn't able to figure it out

            // expand
            // let clazz = Array.from(chapters[i].getAttribute('class')).split(' ').filter(c=>c!="hidden")
            // chapters[i].setAttribute('class', clazz)
            // clazz = Array.from(chapters[i].querySelector(".js-collapsable > i").getAttribute('class')).split(' ').filter(c=>c!="bt-minus"&&c!="bt-plus")
            // clazz.push('bt-minus')
            // chapters[i].querySelector(".js-collapsable > i").setAttribute('class', clazz)

            // collapse

            // if (chapterDataArray[i].margin == (level*marginGap + firstMargin)) {
            //     let el = chapters[i].querySelector(".js-collapsable > i")
            //     let clazz = el.getAttribute('class').split(' ').filter(c=>c!="bt-minus").join(' ') + " bt-plus"
            //     el.setAttribute('class', clazz)
            // if (chapterDataArray[i].margin > (level*marginGap + firstMargin)) {
            //     let el = chapters[i]
            //     let clazz = el.getAttribute('class') + " hidden"
            //     el.setAttribute('class', clazz)
        }
    }
    // })
}


function getPageType() {
    let url = window.location.pathname
    // // console.log(url);
    if (url.search(/\/story\/.*\/map/) >= 0) {
        return "map"
    }
    if (url.search(/\/chapter\//) >= 0) {
        return "chapter"
    }
    if (url.search(/\/story\/.*\.[0-9]+$\/?/) >= 0) {
        // first chapter of story
        return "chapter"
    }
}

async function storyIsInTheCache(storyStorageId) {
  return ((await GM.listValues()).indexOf(storyStorageId) >= 0)
}

// get story url
// find it on cache
// get chapter url
// compare with chapters listed

async function showChapterCountOnChapterChoices() {
  let storyStorageId = getStoryStorageId()
  // check if chapterData is undefined
  // if it is, try fetching it
  if (!chapterData) {
    //fetch story data array first
    if (!chapterDataArray) if (! await attemptLoadChapterArrayFromCache()) return false;

    // fetch story data
    chapterData = await getChapterData(storyStorageId)
    if (!chapterData) return console.error('Story found but Chapter not found. Please regenerate the map.');
  }

  let nextChapterIndexList = chapterData.children

  // get chapter choices
  let chapterChoices = Array.from(document.querySelectorAll(".question-content a"))
  // Remove "Add a new chapter" link from the list (if the story is not private)
  // its link ends with "/new"
  if (chapterChoices[chapterChoices.length-1].href.search(/\/new$/) > -1) {
    chapterChoices.pop()
  }

  // prepare Count Number css style
  if (cssStyle == "crazy") { applyCrazyCSS() } else
    if (cssStyle == "alternative") { applyAlternativeCSS() }

  chapterChoices.forEach((el, i) => {
    let mapIndex = nextChapterIndexList[i]
    if (mapIndex == undefined) { return console.log('Chapter "'+el.textContent+'" not found. Please regenerate the story map.'); }
    drawLinkChapterCount(el, chapterDataArray[mapIndex], cssStyle)
  })
}

async function getChapterData() {
  if (chapterData) return chapterData;
  if (!chapterDataArray) chapterDataArray = await attemptLoadChapterArrayFromCache()
  if (!chapterDataArray) {
      throw new Error("Failed to load chapterDataArray from cache")
      // return false
  }

  // story is on cache as chapterDataArray
  // let chapterDataArray = JSON.parse(await GM.getValue(storyStorageId))

  // getting the chapter url if we're in /story/
  let chapterUrl = window.location.href
  if (chapterUrl.search(/\/story\//) > -1) {
    let els = document.querySelectorAll('.controls-left a')
    let chapterNum = els[els.length-1].href.match(/\d+\/?$/)[0]
    chapterUrl = "https://chyoa.com/chapter/Introduction."+chapterNum;
  }

  // console.log(chapterDataArray, chapterDataArray[1].url, chapterUrl);
  return chapterDataArray.find(c=>c.url==chapterUrl)
}

// Show chapter date under its Title
// assuming pageType == "chapter"
function showChapterDate() {
  if (!chapterData) return false;

  let date = document.createElement('div')
  date.textContent = chapterData.date
  document.querySelector('.meta').append(date)
}

// crazy css
function applyCrazyCSS() {
    let style = toStyleStr({
        'display': 'flex',
        'width': '55px',
        'justify-content': 'space-between',
        'align-items': 'center',
        'margin': '0 8px 0 -55px !important',
        'position': 'inherit !important',
        'float': 'left',
        'border-right': '1px solid',
        'padding': '0 8px 0 0',
        'font-family': 'monospace',
        'font-size': '14px',
        'line-height': '27px',
    }, '.question-content .chapterCount')
    addStyleHead(style)
}

function applyAlternativeCSS() {
    let style = toStyleStr({
        'position': 'absolute',
        'left': '-45px',
        'text-align': 'right',
        'width': '40px',
        'padding': '11px 0',
        'top': '0',
    }, '.question-content .chapterCount')
        + toStyleStr({
        'position': 'relative',
    }, '.question-content a')
    addStyleHead(style)
}

function drawLinkChapterCount(el, chapterObj, cssStyle = 'default') {

    const chapterCount = chapterObj.chapterCount
    const isLinkChapter = chapterObj.isLinkChapter

    let span = document.createElement('SPAN')

    if (isLinkChapter) {
        let icon = document.createElement('i')

        icon.setAttribute('class', 'btb bt-external-link')
        el.insertAdjacentElement('afterbegin',icon)

        return
    }

    span.setAttribute('class', 'chapterCount')

    if (cssStyle == 'simple') {
        span.textContent = " ("+chapterCount+")"
        el.append(span)
        return
    }

    if (cssStyle == 'alternative') {
        let icon = document.createElement('i')

        icon.setAttribute('class', 'btb bt-folder')
        span.textContent = Number(chapterCount).toString()
        el.append(span)
        el.insertAdjacentElement('afterbegin', icon)

        return
    }

    // default & carzy markup

    let icon = document.createElement('i')
    icon.setAttribute('class', 'btb bt-folder')
    span.appendChild(icon);
    let count = document.createTextNode(" "+chapterCount)
    span.append(count)

    el.insertAdjacentElement('afterbegin',span)

    // skip styling if cssStyle is set to 'crazy'
    if (cssStyle != 'crazy') {
        let color = window.getComputedStyle(el).color
        span.setAttribute('style', 'position: absolute; margin: 0 0 0 -60px; color: '+color+' !important;')
        icon.setAttribute('style', 'margin: 0 2px 0 0;')
    }
}

function loadStoryPathName() {
  storyStorageId = getStoryStorageId()
}

function getStoryStorageId() {
  if (storyStorageId) return storyStorageId;

  return getMapUrl();
}

function getMapUrl() {
    if (pageType == "map") return window.location.pathname;
    if (pageType != "chapter") {
        const errorMsg = "Unrecognizable page type"
        console.error(errorMsg);
        throw new Error(errorMsg);
    }

    // pageType is chapter
    const mapElement = [...document.querySelectorAll('.controls-left a')].find((item) => item.text.includes('Map'))
    const location = new URL(mapElement.href)
    return location.pathname
}

function foldTopmostReadChapters() {
  let ignoreList = []
  const els = Array.from(document.querySelectorAll(".story-map-chapter"))

  if (chapterDataArray.length != els.length) return false;

  // iterate all chapters
  // fold all read chapters not in the ignore list
  // put its children in the ignore list
  // put every ignored chapter children in the ignored list
  // console.log(chapterDataArray);

  for (const i in chapterDataArray) {
    if (i == 0) continue
    // console.log('in for');
    // check if chapter read && i different from 0
    if (els[i].classList.length == 1) {
      // console.log('unread chapter found');
      // if (binarySearch(i, ignoreList) == -1 && i != 0) {
      if (binarySearch(i, ignoreList) == -1) {
        console.log('success at i = ', i);
        // console.log('first unread not in ignore list, fold');
        els[i].querySelector('.btn').click()
      }
      // console.log('add children to ignored list');
      ignoreList = ignoreList.concat(chapterDataArray[i].children)
    }
  }
}

function foldTopmostUnreadChapters() {
  let ignoreList = []
  const els = Array.from(document.querySelectorAll(".story-map-chapter"))

  if (chapterDataArray.length != els.length) return false;

  for (const i in chapterDataArray) {
    if (i == 0) continue
    if (els[i].classList.length != 1) {
      if (binarySearch(i, ignoreList) == -1) {
        console.log('success at i = ', i);
        els[i].querySelector('.btn').click()
      }
      ignoreList = ignoreList.concat(chapterDataArray[i].children)
    }
  }
  console.log('ignoreList leng',ignoreList.length);
}

function binarySearch(value, list) {
  return list.find(a=>a==value) ? 1 : -1;
  let first = 0; //left endpoint
  let last = list.length - 1; //right endpoint
  let position = -1;
  let found = false;
  let middle;

  if (value < 100) console.log('search', value, list);

  while (found === false && first <= last) {
    middle = Math.floor((first + last)/2);
    if (list[middle] == value) {
      found = true;
      position = middle;
    } else if (list[middle] > value) { //if in lower half
      last = middle - 1;
    } else { //in in upper half
      first = middle + 1;
    }
  }
  return position;
}

// TODO
// index to remain in cache forever containing a story index with the number of chapters and other story stats
//   update index if the generated data has more chapters than what's on the index
// detect branches (chapters where child chapters have many chapters) and note them down
//   on chapter pages, check if it belongs to any recognizable branch and print its name on the page
// fold all topmost read chapters

// prev chapters map
// let prevMapContainer;
function prevMapShow() {
  let container = document.querySelector('.prevMapContainer')
  // if (container === null) {
  //   container = prevMapRender()
    // container = document.querySelector('.prevMapContainer')
  // }
  container.classList.toggle('show');
  // prevMapContainer.classList.toggle('show');
}



async function prevMapRender() {
  let storyStorageId = getStoryStorageId()
  // check if chapterData is undefined
  // if it is, try fetching it
  if (!chapterData) {
    //fetch story data array first
    // if (!chapterDataArray) if (!attemptLoadChapterArrayFromCache()) {
    if (!chapterDataArray) {
      if (! await attemptLoadChapterArrayFromCache()) {
        document.querySelector('.question').insertAdjacentText('afterend', 'Map data not found. Please regenerate the map.')
        return false;
      }
    }

    // fetch story data
    chapterData = getChapterData(storyStorageId)
    if (!chapterData) {
      document.querySelector('.question').insertAdjacentText('afterend', 'Unable to find Chapter in the story data. Please regenerate the mapp.')
      // return console.error('Unable to find Chapter in the story data. Please regenerate the map.');
      return false;
    }
  }

  if (document.querySelector('.prevMapContainer') === null) {
  // if (prevMapContainer === null) {
    document.querySelector('.question').insertAdjacentHTML('beforeend', '<div class="prevMapContainer"></div>')
    // prevMapContainer = document.querySelector('.prevMapContainer')
  }

  // drawThisChapter()
  drawParentTree()
}

function drawThisChapter() {
  let container = document.querySelector('.prevMapContainer')
  container.insertAdjacentHTML('beforend', '<div class="prevMap_chapter prevMap_currentChapter"><a href="'+chapterData.url+'">'+chapterData.title+'</a></div>')
}

function drawParentTree() {
  let container = document.querySelector('.prevMapContainer')

  let chapter = chapterData
  // let chapter = chapterDataArray[chapterData.parent]
  while (chapter.parent != null) {
    container.insertAdjacentHTML('afterbegin', '<div class="prevMap_chapter"><a href="'+chapter.url+'">'+chapter.title+'</a></div>')
    chapter = chapterDataArray[chapter.parent]
  }
}

async function prevMapInit() {
  document.querySelector('.controls-left').insertAdjacentHTML('beforeend','<br class="visible-xs-inline"> <a href="#" class="prevMap_button"><i class="btb bt-sitemap"></i>Prev Chapters</a>')
  let prevMapButton = document.querySelector('.prevMap_button')
  prevMapButton.addEventListener('click', function(e) {
    e.preventDefault();
    prevMapShow()
  });

  await prevMapRender()

  let style = toStyleStr({
    'display': 'none',
  }, '.prevMapContainer')
  + toStyleStr({
    'display': 'block',
  }, '.prevMapContainer.show')
  addStyleHead(style)
}

function getSuperParentGroupSortedByNew() {
    if (unsafeWindow.parentChapters) return unsafeWindow.parentChapters;

    chapterDataArray.forEach((c, i) => { c.id = i; })

    let parents = chapterDataArray.filter(c => c.parent == 0)
    let parentIds = parents.map(c => c.id)

    function computeSuperParent(chapter) {
        if (chapter.superParent) return

        if (parentIds.includes(chapter.id)) {
            chapter.superParent = chapter.id;
            return
        }

        if (parentIds.includes(chapter.parent)) {
            chapter.superParent = chapter.parent
            return chapter.superParent
        }

        chapter.superParent = getSuperParent(chapterDataArray[chapter.parent])
    }

    function getSuperParent(chapter) {
        if (!chapter.superParent) computeSuperParent(chapter)

        return chapter.superParent
    }

    chapterDataArray.slice(1).forEach(computeSuperParent)

    unsafeWindow.parentChapters = parents.map(p => {
        return {
            p: p,
            c: chapterDataArray.filter(c => c.superParent === p.id)
        }
    })

    function dateComparison(a, b) {
        let aDate = Date.parse(a.date)
        if (! aDate) aDate = 1;

        let bDate = Date.parse(b.date)
        if (! bDate) bDate = 1;

        return bDate - aDate;
    }

    unsafeWindow.parentChapters.forEach(g => g.c.sort((a, b) => {
        return dateComparison(a, b);
    }))

/*         Date.parse(b.c[0].date) - Date.parse(a.c[0].date) */
    unsafeWindow.parentChapters.sort((a, b) => {
        return dateComparison(a.c[0], b.c[0]);
    })

    return unsafeWindow.parentChapters
}

function getMapAndRegenerateViaAjax() {
    console.log("!! generating map");

    const url = getMapUrl() + '.json'
    let ajaxChapters = []

    console.log("!! url: "+url);

    function recursiveGetChaptersFromAjax(page) {
        let currentUrl = url + (page > 1 ? `?page=${page}` : '');

        console.log("!! currentUrl: "+currentUrl);

        unsafeWindow.$.get({
            url: currentUrl,
            // method: "GET",
            dataType: "json",
            headers: {
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "X-CSRF-TOKEN": unsafeWindow.Chyoa.csrf_token,
            }
        }).done(function (response) {
                // console.log(response);
                ajaxChapters = ajaxChapters.concat(Object.values(response.data.chapters))

                if (response.data.hasMorePages) {
                    recursiveGetChaptersFromAjax(page + 1)
                } else {
                    chapterDataArray = createStoryMapAjax(ajaxChapters)
                    console.log("Chapter Count = ", chapterDataArray.length);

                    unsafeWindow.chapterDataArray = chapterDataArray
                    console.log("Map available as a javascript array on `chapterDataArray`")

                    console.log("!! assembling hierarchy tree");
                    countMapChapters();
                    console.log("!! done counting the children");

                    // cache it
                    GM.setValue(getStoryStorageId(), JSON.stringify(chapterDataArray))
                }
            }
        )
    }

    // Recursivelly get all the chapters from page 1
    recursiveGetChaptersFromAjax(1);

    function createChapterObjFromAjax(obj) {
        const chapter = {
            parent: null,
            children: [],
        }

        chapter.title = obj.title
        chapter.url = obj.url
        chapter.author = obj.author
        chapter.date = obj.created_at
        chapter.margin = obj.indent

        if (chapter.views) {
            chapter.views = parseInt(obj.views.split(",").join("")) || 0;
            chapter.likes = parseInt(obj.likes) || 0;
            chapter.comments = parseInt(obj.comments) || 0;
            chapter.isLinkChapter = 0;
        } else {
            chapter.views = null;
            chapter.likes = null;
            chapter.comments = null;
            chapter.isLinkChapter = 1;
        }

        return chapter;
    }


    // final list like [ chapterObj, (...) ]
    // where every element has its parent and children noted
    function createStoryMapAjax(chapters) {

        let prevParentI = -1;
        const finalList = [];

        chapters.forEach((el, chapterIndex) => {
            // parse el and add it to the final list
            const chapterObj = createChapterObjFromAjax(el);
            finalList[chapterIndex] = chapterObj;
            // console.log(chapterObj)

            // now we find the parent of el

            // before checking margin
            // check if it's the first element of the list
            if (chapterIndex == 0) {
                prevParentI = 0;
                // continue; // when using a for loop
                return;
            }

            // check margins

            const currElMargin = chapterObj.margin
            const prevElMargin = finalList[chapterIndex-1].margin

            // check if el is child of prev el
            if (prevElMargin < currElMargin) {
                // prev el is parent
                chapterObj.parent = parseInt(chapterIndex - 1);
                // add this el as child of prev element
                finalList[chapterIndex - 1].children.push(parseInt(chapterIndex));
                // set prev parent to prev element
                prevParentI = chapterIndex - 1;
                // continue; // when using a for loop
                return;
            }

            // check if el is sibling of prev el
            if (prevElMargin == currElMargin) {
                // they share the same parent

                // prevParent is parent
                chapterObj.parent = prevParentI;
                // add this el as child of prevParent
                finalList[prevParentI].children.push(chapterIndex);
                // continue; // when using a for loop
                return;
            }

            // then el must be the "uncle" of prev el
            // prevElMargin > currElMargin

            // use a loop go back through the parents from the previous node
            // to find the first element with margin smaller than self
            const selfMargin = chapterObj.margin;
            for (let parentIndex = chapterIndex - 1; parentIndex >= 0; parentIndex = finalList[parentIndex].parent) {
                if (finalList[parentIndex].margin < selfMargin) {
                    // found the parent: parentIndex
                    const actualParentI = parentIndex;
                    chapterObj.parent = actualParentI;
                    // add this el as child of actual parent
                    // finalList[actualParentI].children.push(chapterObj.id);
                    finalList[actualParentI].children.push(chapterIndex);
                    // set prev parent to actual parent
                    prevParentI = actualParentI;
                    break;
                }
            }
        // } // when using a for loop
        })

        return finalList;
    }
}
