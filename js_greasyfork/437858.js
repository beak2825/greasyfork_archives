// ==UserScript==
// @name Facebook remove suggested sponsored ads blocks
// @version 1.20.15
// @description Remove suggested/sponsored blocks from Facebook
// @author Sly_North
// @match https://www.facebook.com/*
// @exclude https://www.facebook.com/*/about
// @exclude https://www.facebook.com/login/*
// @exclude https://www.facebook.com/groups/*
// @exclude https://www.facebook.com/privacy/*
// @exclude https://www.facebook.com/photo/*
// @exclude https://www.facebook.com/settings/*
// @exclude https://www.facebook.com/marketplace/*
// @exclude https://www.facebook.com/*/about
// @exclude https://www.facebook.com/*/photos
// @exclude https://www.facebook.com/*/friends
// @exclude https://www.facebook.com/*/about/
// @namespace https://greasyfork.org/en/users/759669-sly-north
// @license MIT
// @grant none
// @icon https://www.facebook.com/favicon.ico
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/437858/Facebook%20remove%20suggested%20sponsored%20ads%20blocks.user.js
// @updateURL https://update.greasyfork.org/scripts/437858/Facebook%20remove%20suggested%20sponsored%20ads%20blocks.meta.js
// ==/UserScript==

console.log('Start RemoveAllSponsored Facebook');

const maxPostHeight = 800;
const maxMessageLog = 300;

// Rebuild texts that are scrambled, like "Sponsored" where each letter is in a different div, which are not present in the word letter order.
function getVisibleContent(e) {
  var t = e.innerText.replaceAll("\n","");
 
  var children = e.childNodes;
  while (children.length == 1) children = children[0].childNodes;
  var spanBottom = e.getBoundingClientRect().bottom;
  children = Array.from(children).filter((c) => c.getBoundingClientRect && c.getBoundingClientRect().top <= spanBottom);
  var a = [];
  for (var c of children) {
    var order = getComputedStyle(c).order;
    if (order && window.getComputedStyle(c).display !== 'none') {
      a[order] = c.innerText;
      // console.log(c.style.order,'=',c.innerText, ' y=',c.getBoundingClientRect().top,' vs span.bottom=', spanBottom);
    }
  }
  if (a.length == 0) a = t.split();
  var intext = a.join().replaceAll(",","").replaceAll("\n","");
  // if (a.length > 0) console.log('Array = ', intext, ' -OR- ', a.join().replaceAll(",","").replaceAll("\n",""));
  if (intext == "") intext = t;
  return intext;
}

function getWholePost(e, maxParentHeightDiff = 150) {
  let parent = e.parentElement.parentElement.parentElement.parentElement;
  let h = parent.getBoundingClientRect().height;
  if (h > maxPostHeight) return null;
  while (h < 90) {
    parent = parent.parentElement;
    h = parent.getBoundingClientRect().height;
  }
  let h2 = 0;
  const postMaxWidth = window.innerWidth*0.8;
  while (true) {
    if (!parent.parentElement) { console.warn('Err: element has no parent H=', parent.getBoundingClientRect().height); break; }
    const parentBR = parent.parentElement.getBoundingClientRect();
    h2 = parentBR.height;
    if (h2 > maxPostHeight || h2 - h > maxParentHeightDiff) break;
    if (parentBR.width > postMaxWidth && parentBR.height > window.innerHeight/2) {
      const br = e.getBoundingClientRect();
      console.log('- Fb ads - Could not find parent, was selecting whole screen from elt tag=', e.tagName, ' w=', br.width, ' h=', br.height);
      e.style.display = "block"; // Prevent this script from running again on this element. 
      return null;
    }
    parent = parent.parentElement;
    h = h2;
  }
  return parent;
}

function removeElement(type, e, parent) {
  const height = parent.getBoundingClientRect().height;
  if (height === 0 || height > maxPostHeight) {
    console.log('- Fb ads - could not find parent for ', type, ' tag= ', parent.tagName, ' H=', height, ' ', e.innerText.substring(0, maxMessageLog).replaceAll('\n',''));
    return;
  }
  console.log('- Fb ads removed: ', type, ' tag=', parent.tagName, ' H=', height, ' ',
              parent.innerText.replaceAll("\n"," ").replaceAll(/Facebook  *Facebook  */g, ""), ' from ', e.innerText.substring(0, maxMessageLog).replaceAll('\n',''));
  e.style.display = "none";
  parent.style.display = "none";
  // e.style.display = "block"; parent.style.display = "block"; parent.style.background = "red"; // Debug - in red instead of hidden
}

function RemoveAllSponsored()
{
  setTimeout(RemoveAllSponsored, 750);

  // Remove top right corner ads
  for (let e of Array.from(document.getElementsByTagName('h3')).filter((e) => {
    const br = e.getBoundingClientRect();
    return br.top < 150 && br.left > window.innerWidth*0.6 && br.width > 200 && br.width < 500 && br.height > 10 && br.height < 100;
  })) {
    let parent = e.parentElement.parentElement.parentElement;
    while (parent.parentElement.getBoundingClientRect().height < 500) parent = parent.parentElement;
    if (parent && parent.getBoundingClientRect().height > 200) {
      console.log('- Removing Fb top right ads - bounding rect: ', parent.getBoundingClientRect());
      // parent.style.background = 'red';
      parent.innerHTML = "";
    }
  }

  // Remove the "suggestion" posts
  if (document.URL.match(/facebook.com\/*(\?.*)*/) && !document.URL.match(/\/posts\//)) {
    for (tag of ['a', 'use']) {
      const maybeAds = Array.from(document.getElementsByTagName(tag)).filter(e => {
        const br = e.getBoundingClientRect();
        return !e.style.display &&  // Already filtered-out
          // e.innerText === '' && // Content must be hidden in shadow block
          br.left < window.innerWidth*0.7 && // Comment in photo view
          br.left > window.innerWidth/2 && br.width > 60 && br.width < 200 && br.top > 100;
      });
      for (let e of maybeAds) {
        const parent = getWholePost(e);
        if (!parent) { console.log(' - Fb ads sponsored element: parent element not found!'); continue; }
        if (parent.innerText.match(/Create new account/) || parent.innerText.match(/shared a memory/)) continue;
        const br = e.getBoundingClientRect();
        removeElement('sponsored post', e, parent);
      }
    }

    // "Learn more" suggestions
    const maybeAds = Array.from(document.getElementsByTagName('span')).filter(e => e.textContent === 'Learn more');
    for (let e of maybeAds) {
      const parent = getWholePost(e);
      if (!parent) { console.log(' - Fb ads sponsored element: parent element not found!'); continue; }
      removeElement('learn more', e, parent);
    }
  }

  // Unwanted elements
  var elts = Array.from(document.getElementsByTagName('span'));
  elts = elts.filter((e) => {var br = e.getBoundingClientRect(); return !e.style.display && br.bottom >= 0 && br.top <= window.innerHeight + 1000 && !e.style.display});
  elts = elts.filter((e) => {
    const t = e.innerText;
    const br = e.getBoundingClientRect();
    if (br.height === 0) return false;
    return t === 'Suggested for you' || t === 'Remember Password' || t === 'Reels and short videos' || t === 'Reels 和短视频' || t === 'Suggested for you' || t === 'People You May Know' ||
       t.match(/groups you might like/) || t.match(/groups suggested just for you/) || t === 'Follow' || t === 'Join';
  });
  for (let e of elts) {
    const parent = getWholePost(e);
    if (!parent) { console.log(' - Fb ads/block remover: parent element not found!'); continue; }
    const br = e.getBoundingClientRect();
    const parentBr = parent.getBoundingClientRect();
    if (br.height === 0 || parentBr.height > 1000 || br.top-parentBr.top > 500) { // Ignore post citing post
      // console.log(' - Fb ads/block: NOT removing tag=', e.tagName, ' H=', e.getBoundingClientRect().height, ' parent tag= ', parent.tagName, 'H=', parent.getBoundingClientRect().height, ' ', parent.innerText.replaceAll("\n", "  ").substring(0, 200));
      continue;
    }
    removeElement('ads/block', e, parent);
  }

  // Old Style - rare but still appears from time to time.
  var elts = Array.from(document.getElementsByTagName('span'));
  elts = elts.filter((e) => {
    var br = e.getBoundingClientRect();
    return e.parentElement.tagName === 'SPAN' && br.bottom >= 0 && br.top <= window.innerHeight + 1000 && !e.style.display
  });

  const keywords = [ /Sponsored/,/Commandvit/, /Sponsori/,/Reklamo/, /Publicid/,/Gesponser/, /Patrocinado/,/sugerisdos/, /贊助/, /RememberPassword/];
  var nbrSpans = elts.length;
  for (var i = elts.length - 1; i >= 0; --i)
  {
    var e = elts[i];
    var boundingRect = e.getBoundingClientRect();
    if (boundingRect.width == 0 || boundingRect.height == 0) continue; // Not visible

    var intext = getVisibleContent(e);
    if (intext.length > 0) for (k of keywords) {
      if (intext.match(k)) {
        let parent = e.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
            .parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
        parent.style.display = "none";
        e.style.display = "none";
        ++nbrRemovedAds;
        console.log('- Removing Sponsored ads span', i, '[', parent.innerText.replaceAll("\n", "  ").substring(0, 200), '] matching ', k, ' at ', intext);
        break;
      }
    }
  }
}

setTimeout(RemoveAllSponsored, 2000);
