// ==UserScript==
// @name        CGLA Overview
// @namespace   Violentmonkey Scripts
// @match       https://www.candygirlla.com/*
// @grant       none
// @version     1.7
// @author      -
// @description Add an informational overview to each profile pic on the home page of Candy Girl LA.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/440812/CGLA%20Overview.user.js
// @updateURL https://update.greasyfork.org/scripts/440812/CGLA%20Overview.meta.js
// ==/UserScript==

async function fetchProfile(url) {
  let res = await fetch(url)
  let text = await res.text()
  let parser = new DOMParser()
  let doc = parser.parseFromString(text, 'text/html')
  let els = doc.querySelectorAll('main div[data-testid=richTextElement]')
  let profile = els[1].textContent
  return profile.replace(/\n\n/g, "\n")
}

async function fetchProfile2(url) {
  let res = await fetch(url)
  let text = await res.text()
  let parser = new DOMParser()
  let doc = parser.parseFromString(text, 'text/html')
  let els = doc.querySelectorAll('main div[data-testid=richTextElement]')
  let profile = els[1].innerHTML
  let p2 = profile.replace(/<br>/g, "\n")
  let p3 = p2.replace(/\n\n/g, "\n")
  let d2 = document.createElement('DIV')
  d2.innerHTML = p3
  return d2.innerText
}

function addProfileOverlay(a, content, className="overlay") {
  let pre = document.createElement('PRE')
  pre.className = className
  pre.innerHTML = content
  a.appendChild(pre)
}

async function waitForPassword() {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      //console.log('waiting...')
      let input = document.querySelector('input[placeholder]')
      if (input == null) {
        //console.log('done')
        clearInterval(interval)
        resolve()
      }
    }, 1000)
  })
}

async function fetchAll() {
  await waitForPassword()
  let as = document.querySelectorAll('a[data-testid=linkElement][target=_self]')
  let i = 0
  for (i = 0; i < as.length; i++) {
    let a = as[i]
    let url = new URL(a.href)
    if (url.pathname === '/') continue
    try {
      let profile = await fetchProfile(a.href)
      addProfileOverlay(a, profile)
    } catch (err) {
      console.error(err)
    }
  }
  let a2 = document.querySelectorAll('a[data-testid=gallery-item-click-action-link][target=_self]')
  for (i = 0; i < a2.length; i++) {
    let a = a2[i]
    let url = new URL(a.href)
    if (url.pathname === '/') continue
    try {
      let profile = await fetchProfile2(a.href)
      //console.log({i, url: a.href, profile})
      addProfileOverlay(a, profile, "overlay2")
    } catch (err) {
      console.error(err)
    }
  }
}

// https://stackoverflow.com/a/2481776
function getScroll() {
  if (window.pageYOffset != undefined) {
    return [pageXOffset, pageYOffset];
  } else {
    var sx, sy, d = document,
        r = d.documentElement,
        b = d.body;
    sx = r.scrollLeft || b.scrollLeft || 0;
    sy = r.scrollTop  || b.scrollTop  || 0;
    return [sx, sy];
  }
}

let css = `
#SITE_HEADER {
  opacity: 85%;
}
pre.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  margin: 1.5em;
  padding: 0.5em;
  border-radius: 8px;

  font-size: 11px;
  color: white;
  background: rgba(69, 40, 50, 0.75);
}
pre.overlay2 {
  position: absolute;
  bottom: 64px;
  left: 0;
  margin: 1.5em;
  padding: 0.5em;
  border-radius: 8px;

  font-size: 11px;
  color: white;
  background: rgba(69, 40, 50, 0.75);
}
`
let style = document.createElement("style");
style.type = "text/css";
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);

//for debugging
//unsafeWindow.fetchProfile = fetchProfile
//unsafeWindow.fetchProfile2 = fetchProfile2
//unsafeWindow.addProfileOverlay = addProfileOverlay
//unsafeWindow.fetchAll = fetchAll
//unsafeWindow.getScroll = getScroll

const wait = 3000
// click "Show More"
setTimeout(() => {
  const more = document.querySelector('button[data-testid="matrix-gallery-show-more-button"]')
  //console.log('more', more)
  if (more) {
    let pos = getScroll()
    more.click()
    window.scroll(pos[0], pos[1])
    // the click caused an unwanted and jarring scroll,
    // so I did this to cancel out that movement and scroll you back to whereever you were.
  }
}, wait - 200) // a little before fetching profiles

// fetch profile info
setTimeout(fetchAll, wait)

window.addEventListener('popstate', () => {
  if (location.pathname === '/') {
    const pres = document.querySelectorAll('pre.overlay')
    if (pres.length === 0) {
      setTimeout(fetchAll, wait)
    }
  }
})