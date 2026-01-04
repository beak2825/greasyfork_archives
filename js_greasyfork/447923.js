// ==UserScript==
// @name        lyricUtils v2
// @namespace   Violentmonkey Scripts
// @include     https://www.azlyrics.com/lyrics/*
// @include     https://www.letras.com/*
// @include     https://4334.sk/*
// @include     https://www.songlyrics.com/*
// @include     https://www.lyrics.com/track/*
// @include     https://www.lyrics.com/lyric-lf/*
// @include     https://bethelmusic.com/chords-and-lyrics/*
// @include     https://genius.com/*
// @grant       none
// @version     2.7.2
// @author      KraXen72
// @locale      en-US
// @license     GPLv3
// @description helpful utilities when working with song lyrics and OpenSong
// @downloadURL https://update.greasyfork.org/scripts/447923/lyricUtils%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/447923/lyricUtils%20v2.meta.js
// ==/UserScript==

console.log("lyricUtils v2 loaded.")

let site = {
  n: "", // name
  querySelector: "", // where to get text from
  holderqs: "", // where to inject our versed div, other: overwrite, headonly
  textKey: "", // what to use to get text (for exampe innerText or textContent)
  advancedVerseSupport: false, // if the site gives info about which verse is chorus, which is bridge, etc
  verseHeadings: [], // if custom verse heading are provided (geinus, bethel, ...) they will be saved here
  parsedVerseHeadings: []
}

// sites are expected to handle adding to site.verseHeadings themselves in either their extractor or in groupToVerses if absolutely neccessary

const TempText = document.createElement("textarea");
const defaultElemStyleObj = {
  padding: ".5rem",
  border: "2px solid darkblue",
  borderRadius: "5px",
  margin: "0 .25rem",
  height: "40px",
  width: "40px",
  boxSizing: "border-box",
}

function determineSite() {
  //console.log(window.location.hostname)
  switch (window.location.hostname) {
    case "4334.sk":
      site.n = "4334";
      site.holderqs = ".entry-content"
      break;
    case "www.letras.com":
      site.n = "letras";
      site.querySelector = ".cnt-letra.p402_premium"
      site.holderqs = "overwrite"
      site.textKey = "innerText"
      break;
    case "www.azlyrics.com":
      site.n = "azlyrics";
      site.querySelector = ".col-xs-12.col-lg-8.text-center div:not([class]):not([id])";
      site.holderqs = ".col-xs-12.col-lg-8.text-center"
      site.textKey = "textContent"
      break;
    case "www.songlyrics.com":
      site.n = "songlyrics"
      site.querySelector = "#songLyricsDiv"
      site.holderqs = "overwrite"
      site.textKey = "textContent"
      break;
    case "www.lyrics.com":
      site.n = "lyricscom"
      site.querySelector = "#lyric-body-text"
      site.holderqs = "overwrite"
      site.textKey = "innerText"
      break;
    case "bethelmusic.com":
      site.n = "bethel"
      site.holderqs = "#tabLyrics"
      site.textKey = "innerText"
      site.advancedVerseSupport = true // bethel has bold
      //TODO remove double/triple newlines
      break;
    case "genius.com":
      site.n = "genius"
      site.querySelector = 'div[data-lyrics-container="true"]'
      site.holderqs = "headonly"
      site.textKey = "innerText"
      site.advancedVerseSupport = true // genius has [Verse]
      break;
    default:
      console.error(`unknown site ${window.location.hostname}`);
  }
}

function injectCSS(css) {
  const styleTag = document.createElement("style")
  styleTag.innerHTML = css
  document.head.appendChild(styleTag)
}

function makeBtn(text, onclick) {
  const btn = document.createElement("button")
  btn.classList.add("lyricUtils-button")
  Object.assign(btn.style, defaultElemStyleObj)
  btn.onclick = onclick
  btn.textContent = text
  return btn
}

function copyMe(textToCopy) {
  TempText.value = textToCopy;
  //TempText.style.display = "none"
  document.body.appendChild(TempText);
  TempText.select();

  document.execCommand("copy");
  document.body.removeChild(TempText);
  console.log("copied stuff", textToCopy)
}

// utility functions

const bare = (s) => s.trim().replaceAll(" ", "") // bare string: no whitespace, no spaces

const elem = (qs) => { // querySelector, but if qs is already an element just pass it on
  if (typeof qs === "string") return document.querySelector(qs)
  return qs
}

const text = (qs, key) => elem(qs)[key] // elem + get text by key
const textAll = (qs, key) => {
  if (typeof qs === "string") return [...document.querySelectorAll(qs)].map(elem => elem[key]).join("\n")
  return qs[key]
}

// group plaintext into array of verses, depending on newlines & other context
function groupToVerses(text) {
  const lines = text.split("\n")
  const newLines = [...lines]
    .filter(l => l !== "Hide Chords")
    .filter((line, i, arr) => { // remove multiple newlines after each other
      if (i > 0 && bare(line) === "" && bare(arr[i - 1]) === "") { return false } else { return true }
    })

  console.log("debug newlines", newLines)

  // first filter is to filter out Hide Chords, seconds is multiple newlines.
  // i tried to filter both in one pass but then "" "Hide Chords" "" doesen't get recognized as "" "" bc i shifts

  let verses = [""] // starts with empty verse

  for (let i = 0; i < newLines.length; i++) {
    const l = newLines[i]
    if (site.n === "genius" ? l.startsWith("[") && l.endsWith("]") : l === "" ) {
      if (site.n === "genius") site.verseHeadings.push(l)
      verses.push("") // start a new verse
    } else if (l.startsWith(" ")) { // if a thing like " (What?)" is on new line, after annotation.
      verses[verses.length - 1] = verses[verses.length - 1].slice(0, -4) + l + "<br>"
    } else {
      verses[verses.length - 1] += l + "<br>" // continue an existing verse
    }
  }

  verses = verses.filter(v => v.replaceAll("<br>", "").trim() !== "") // filter out empty verses
  console.log("verses after filter:", verses)
  return verses
}
// FIXME genius still separates verses by multiple newlines

// get all text for copying
function getTextContent() {
  let stuff = ""
  const newHolder = document.getElementById("lyricUtils-holder")

  Array.from(newHolder.children).forEach(child => {
    if (site.n === "genius") {
      if (!(child.classList.contains("lyricUtils-button")) && child.id !== "lyricUtils-stateDiv") {
        child.innerHTML
          .split("<br>")
          .filter((item, i, arr) => item.trim() !== "" || i === arr.length - 1)
          .forEach((line, i, arr) => stuff += line.replaceAll("&amp;", "&") + "\n")
      }
    } else {
      if (!(child.classList.contains("lyricUtils-button")) && child.id !== "lyricUtils-stateDiv") stuff += child.innerText
      if (child.classList.contains("lyricUtils-vhead") || child.classList.contains("lyricUtils-verse")) stuff += "\n"
    }
  })
  console.log("tocopy", stuff)
  return stuff
}

// transform headers in words like "Verse 1" into "[V1]"
function ensureResolveOpensongHeaders() {
  if (site.parsedVerseHeadings.length > 0) return // already parsed
  if (site.verseHeadings.length === 0) return; // no support
  if (site.advancedVerseSupport === false) return; // no support

  site.verseHeadings = site.verseHeadings.map(h => bare(h.replaceAll("[", "").replaceAll("]", "")))

  const verseHeadingsCounter = { verse: 0, chorus: 0, bridge: 0 }
  const _opensongTag = ( tag = "V", type = "verse") => {
    // only one of this tag per song, no need for number (except verse)
    if (type !== "verse" && site.verseHeadings.filter(h => h.toLowerCase().startsWith(type)).length === 1) {
      verseHeadingsCounter[type] += 1
      return `${tag}`
    } else {
      verseHeadingsCounter[type] += 1
      return `${tag}${verseHeadingsCounter[type]}`
    }
  }

  site.parsedVerseHeadings = site.verseHeadings
  .map((h, i) => {
    if (h.startsWith("Verse")) return _opensongTag("V", "verse")
    if (h.startsWith("Bridge")) return _opensongTag("B", "bridge")
    if (h.startsWith("Chorus")) return _opensongTag("C", "chorus")
    if (h.startsWith("Refrain")) return _opensongTag("C", "chorus")

    verseHeadingsCounter.verse += 1
    return `V${i + 1}`
  })
}

// function that either returns V1 - VXX, or if site.verseHeadings is defined, parse that and return more specific opensong headers
function makeOpensongHeader(index) {
  if (!site.advancedVerseSupport || site.advancedVerseSupport && site.verseHeadings.length === 0) {
    return `V${index + 1}` }
  else {
    ensureResolveOpensongHeaders()
    return site.parsedVerseHeadings[index]
  }
}

// make the actual div elements to host our text
function constructVerseElement(verses) {
  const holder = document.createElement("div")
  holder.id = "lyricUtils-holder"

  verses.forEach((v, index, arr) => {
    const vDiv = document.createElement("div")
    vDiv.id = `${makeOpensongHeader(index)}-lyricUtils`
    vDiv.classList.add("lyricUtils-verse")
    vDiv.innerHTML = v
    holder.appendChild(vDiv)
    if (index !== arr.length -1) holder.appendChild(document.createElement("br"))
  })

  return holder
}

function addHeaders() {
  if (document.querySelector(".lyricUtils-vhead") === null) {
    const allVerses = [...document.getElementsByClassName("lyricUtils-verse")]
    const newHolder = document.getElementById("lyricUtils-holder")

    allVerses.forEach(verse => {
      const vHead = document.createElement("div")
      vHead.classList.add("lyricUtils-vhead")
      vHead.textContent = `[${verse.id.split("-")[0]}]` // VXX-lyricUtils => [VXX]
      newHolder.insertBefore(vHead, verse)
    })
    document.getElementById("lyricUtils-stateDiv").style.background = "lightgreen"
  } else {
    console.log("did nothing, headers are already added")
  }
}

function removeHeaders() {
  [...document.getElementsByClassName("lyricUtils-vhead")].forEach(head => head.remove())
  document.getElementById("lyricUtils-stateDiv").style.background = ""
}

// transparent modifier function
function transModFn(value, debug = false) {
  if (debug) console.log(`fn-debug:`, value)
  return value
}

const extractors = {
  // there are a bunch of mod function that can modify some part of the process, if needed
  // by default they are set to transModFn, which just passes through the value
  _standard: (qs, key, modTextFn = transModFn, modVerseFn = transModFn, modElemFn = transModFn) => {
    const rawText = modTextFn( text(qs, key) )
    const verses = modVerseFn( groupToVerses(rawText) )
    const ourElement = modElemFn( constructVerseElement(verses) )

    if (site.holderqs === "overwrite") {
      elem(site.querySelector).innerHTML = ourElement.innerHTML
      elem(site.querySelector).id = "lyricUtils-holder" //has to go second, because qs can be an id selector
    } else if (site.holderqs === "headonly") {
      const holder = elem(site.querySelector).parentElement
      injectCSS(`.lyricUtils-verse { display: none; }`)
      holder.insertBefore(ourElement, elem(site.querySelector))
    } else {
      const holder = document.querySelector(site.holderqs)
      holder.insertBefore(ourElement, elem(site.querySelector).nextElementSibling)
    }

    const stateElem = Object.assign(document.createElement("button"), { id: "lyricUtils-stateDiv", innerHTML: "🆚", title: "green = opensong verse headings [V1], [V2], ... are added"})
    Object.assign(stateElem.style, {...defaultElemStyleObj, cursor: "default" })

    const newHolder = document.getElementById("lyricUtils-holder")
    newHolder.prepend(stateElem)
    newHolder.prepend(makeBtn("📋", () => { copyMe(getTextContent()) }))
    newHolder.prepend(makeBtn("⛔", removeHeaders))
    newHolder.prepend(makeBtn("➕", addHeaders))
    injectCSS(`.lyricUtils-button:hover { background-color: rgba(0,0,0,0.2) }`)

    console.log("everything ran.", site.n, site.parsedVerseHeadings)
  },
  azlyrics: () => {
    injectCSS(`
      ${site.querySelector} { display: none !important; }
      .lyricUtils-button, #lyricUtils-stateDiv { margin-bottom: 1.2rem !important; }
    `)
    extractors._standard(site.querySelector, site.textKey)
  },
  letras: () => {
    injectCSS(`#player { display: none !important; } ::selection { background: #dcdc00 !important; }`);
    extractors._standard(site.querySelector, site.textKey)
  },
  4334: () => {
    injectCSS(`
      div[style*="visibility: visible; position: absolute;"] { display: none !important; }
      .entry-content { display: flex; flex-direction: row-reverse; justify-content: space-between }
      .site-navigation-inner .searchform input,  { width: 200px !important; padding-left: 10px !important; transition: all 0s !important; }
      .site-navigation-inner .searchform.active { margin-left: 0px !important }
    `)

    // fix up stuff for copying: 4334 has chord divs in the text
    const clonedText = document.querySelector(".chordwp-container").cloneNode(true)
    const wrappers = [...clonedText.querySelectorAll(".chwp-lyrics-row-wrapper")]
    lines = []

    wrappers.forEach(w => {
      const lyr = [...w.querySelectorAll(".chwp-lyrics")]
      let txt = []
      lyr.forEach(l => txt.push(l.textContent))

      lines.push(`<div class="line">${txt.join("")}</div>`)

      if (w.nextElementSibling && w.nextElementSibling.tagName === "BR") lines.push(`<div class="line"><br></div>`)
    })
    clonedText.innerHTML = lines.join("\n")

    site.querySelector = clonedText
    site.textKey = "innerText"

    extractors._standard(site.querySelector, site.textKey)
  },
  songlyrics: () => {
    injectCSS(`
      .iComment-popup { display: none !important; pointer-events: none !important; }
      #lyricUtils-holder { font-size: 16px; line-height: 1.6; }
    `)
    extractors._standard(site.querySelector, site.textKey)
  },
  lyricscom: () => {
    extractors._standard(site.querySelector, site.textKey)
  },
  genius: () => {
    injectCSS(`
      #lyricUtils-holder { grid-column: left-start / left-end; height: 2.1rem !important; min-height:0 !important; position: absolute; top: 12px; right: 0}
      .fdEmdh, .lyricUtils-vhead { display: none; }
    `)
    // overwrite the text getter to use querySelectorAll
    extractors._standard(site.querySelector, site.textKey, () => textAll(site.querySelector, site.textKey))
  },
  bethel: () => {
    injectCSS(`
      #tabLyrics { display: grid; grid-template: auto / max-content max-content auto; column-gap: 1rem; }
      #lyricUtils-holder { font-size: 16px; line-height: 20px; grid-colum: 2 / 3 }
      #tabLyrics .content { grid-colum: 1 / 2 }
      .nav.nav-tabs { display: none !important; poiner-events: none; }
    `)

    const lyricsDiv = document.createElement("div")
    lyricsDiv.innerHTML = document.querySelector("#tabLyrics .content").innerHTML
    const bTags = [...lyricsDiv.querySelectorAll("p > b")]
    bTags.forEach(b => {
      site.verseHeadings.push(b.textContent)
      b.remove()
    })

    site.querySelector = lyricsDiv
    extractors._standard(lyricsDiv, site.textKey)
  }
}

console.log("lyricUtils v2 initialized.")

determineSite()
extractors[site.n]()

console.log("lyricUtils v2 executed.")