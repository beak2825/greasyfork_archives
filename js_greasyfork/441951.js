// ==UserScript==
// @name Keyboard navigation and Cookie Wall skipper
// @version 1.12.16
// @author Sly_North
// @description Keyboard based navigation
// @grant none
// @run-at document-start
// @namespace Sly_North
// @include *
// require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441951/Keyboard%20navigation%20and%20Cookie%20Wall%20skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/441951/Keyboard%20navigation%20and%20Cookie%20Wall%20skipper.meta.js
// ==/UserScript==

console.log('Keyboard navigation script...');

// Click first link (tag='a' or 'span') with text matching one of 'keywords' regex
function ClickLink(tag, keywords) {
  var elts = document.getElementsByTagName(tag);
  for (var elt of elts) {
    for (var regexp of keywords) {
      if (elt.textContent.match(regexp)) {
        console.log('Clicking ', elt.textContent);
        elt.click();
        return true;
      }
    }
  }
  return false;
}

function ClickLinkByClass(classname) {
  let elts = document.getElementsByClassName(classname);
  if (elts.length > 0) elts[elts.length - 1].click();
}

// Make 'link' visibly selected.
var lastSelected; // previous selected link
function SelectLink(link, links) {
  if (lastSelected) lastSelected.style.backgroundColor = "";
  lastSelected = link;

  link.focus();
  link.style.backgroundColor = "orange";
}

// Select either link with preferred text or closer to the center.
function SelectBestLink() {
  var links = document.getElementsByTagName('a');
  var curr = document.activeElement;
  var viewport = window.visualViewport;
  var screenHeight = viewport.height;
  var midX = viewport.width/2;
  var midY = screenHeight/2;
  var minD = 1000000000;
  var best;

  var keywords = [/cliquez sur ce lien/i, /#unread/, /Discussions/];

  for (var i = 0; i < links.length; ++i) {
    var link = links[i];
    var br = link.getBoundingClientRect();
    var d = Math.abs(br.left - midX) + Math.abs(br.top - midY);
    if ((link == curr)) continue;

    // Insert here other preferred link texts.
    for (var k in keywords) {
      if (link.text.match(keywords[k])) {
     if ((br.top >= 0) && (br.top < screenHeight)) {
       // link.click();
       SelectLink(link, links);
       console.log('Select link to current page [', link.innerText, '] - boundingRect.top=', br.top);
        return;
        }
      }
    }

    // Select link to current page, if not already selected
    if (link.href == document.URL) {
      if ((br.top >= 0) && (br.top < screenHeight)) {
        // If on start, focus it, without highlighting it.
        SelectLink(link, links);
        console.log('Select link to current page [', link.innerText, '] - boundingRect.top=', br.top);
        return;
      }
    }
    // Select link closer to the center
    if (d < minD) {
      minD = d;
      best = link;
    }
  }
  if (best) {
    // If on start, focus it, without highlighting it.
    console.log("Select link", best.text);
    SelectLink(best, links);
    console.log('Select link [', link.innerText, ']');
  }
  else console.log('Could not find best link');
}

// Skip most simple cookie forms.
function SkipCookieWall() {
  // console.log('SkipCookieWall...');
  for (let tag of ['button', 'span', 'a']) {
    let elts = document.getElementsByTagName(tag);
    for (let e of elts) {
      var t = e.innerText;
      if (!t) continue;
      if (t.match(/Reject all/i) || t.match(/Tout refuser/) || t.match(/Tout rejeter/i) || t.match(/Refuser tout/i) || t.match(/Continuer sans accepter/i) ||
          t.match(/refuse tous les cookies/) || t.match(/Reject non-essential/) || t.match(/Do not accept/) || t.match(/Do not consent/) ||
          t.match(/Continue without agree/) || t.match(/Only allow essential cookies/) || t.match(/Refuse non-essential cookies/) ||
          t.match(/I Do Not Accept/i) || t.match(/Decline optional cookies/)) {
        console.log("SkipCookieWall - Clic ", t);
        e.click();
        return;
      }
    }
  }
 
  for (let e of document.getElementsByClassName('gdpr-lmd-wall')) {
    e.style.display = 'none';
  }

  // console.log('Cookie skip not found');
}

function focusSearchInput() {
  var curr = document.activeElement;
  var inputs = Array.from(document.getElementsByTagName('input')).filter((e)=>{return e.type=="text" || e.type=="search";});
  for (let i of inputs) {
    if (i == curr) continue;
    let rect = i.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      // console.log(' - Found text input');
      i.focus();
      return;
    }
  }
  console.log('focusSearchInput - did not found a search text box');
}


// Unblock the page scrolling.
function Unfreeze() {
  console.log('Unfreeze overflow');
  document.documentElement.classList.remove('fixed')
  document.body.classList.remove('content-blurred');
  document.body.classList.remove('noscroll');
  document.body.classList.remove('retention--open');
  if (document.body.style.overflow) document.body.style.overflow = "scroll";
  if (document.documentElement.style.overflow) document.documentElement.style.overflow = "scroll";

 
  // Site specifics
  document.body.classList.remove('didomi-popup-open');
  document.body.classList.remove('popin-gdpr-no-scroll');

  // NY-Times
  var siteContent = document.getElementById('site-content')
  if (siteContent) siteContent.style.position = "relative"

  // Quora
  for (let e of document.getElementsByClassName('q-box')) if (e.style.filter) e.style.filter = "";

  for (let bluredDiv of document.getElementsByClassName('content-blurred'))
    bluredDiv.classList.remove('content-blurred');
  
  // Reddit loggin + blurred background
  for (let e of document.getElementsByTagName('xpromo-nsfw-blocking-modal-desktop')) e.parentElement.remove(e);
  for (let e of document.getElementsByClassName("sidebar-grid")) e.style.filter = '';
}

function TranslateYoutubeCaptions() {
  console.log('TranslateYoutubeCaptions...');
  // $('.ytp-subtitles-button[aria-pressed="false"]').click();
  const captionButtons = document.getElementsByClassName('ytp-subtitles-button');
  if (captionButtons.length > 0 && captionButtons[0].ariaPressed==='false') captionButtons[0].click();
  // $('.ytp-settings-button').click();
  document.getElementsByClassName('ytp-settings-button')[0].click();

  // var sub = $('[role="menuitem"]:contains("Subtitles")');
  var sub = Array.from(document.getElementsByClassName('ytp-menuitem')).filter(e=>e.role==='menuitem').filter(e => e.innerText.match(/Subtitles/));
  if(!sub.length) { console.log('No subs available'); return; }
  sub[0].click();
  // var subc = $('[role="menuitemradio"]:contains("English")');
  var subc = Array.from(document.getElementsByClassName('ytp-menuitem')).filter(e=>e.role==='menuitemradio').filter(e => e.innerText.match(/English/));
  if (subc.length) {
    console.log('Enabling available English captions');
    subc[0].click();
  } else {
    // var autoTrans = $('[role="menuitemradio"]:contains("Auto-translate")');
    var autoTrans = Array.from(document.getElementsByClassName('ytp-menuitem')).filter(e=>e.role==='menuitemradio').filter(e => e.innerText.match(/Auto-translate/));
    if (!autoTrans.length) { console.log('YT autotranslate not available'); return; }
    autoTrans[0].click();
    // var autoTransC = $('[role="menuitemradio"]:contains("English")');
    var autoTransC = Array.from(document.getElementsByClassName('ytp-menuitem')).filter(e=>e.role==='menuitemradio').filter(e => e.innerText.match(/English/));
    if (!autoTransC.length) { console.log('YT autotranslate not available in English'); return; }
    autoTransC[0].click();
  }
}

// Select direction in which to look for 'best' link
function MoveSelectedElement(keyCode) {
  var dirX = 0, dirY = 0;
  var scaleX = 1; // used to allow going up/down to a link not on a straight alignement (angle > 45°)
  var maxDY = 10000000; // used to strongly limit vertical search when going left/right
  var scaleWidth = 0; // To select left/center/right of elements
  if (keyCode == 37 || keyCode == 72)      { dirX = -1; scaleWidth = 0; maxDY = 50; scaleX = 0.25; } // left
  else if (keyCode == 39 || keyCode == 76) { dirX = +1; scaleWidth = 1; maxDY = 50; scaleX = 0.25; } // right
  else if (keyCode == 38 || keyCode == 75) { dirY = -1; scaleWidth = 0.5; scaleX = 0.25; } // up
  else if (keyCode == 40 || keyCode == 74) { dirY = +1; scaleWidth = 0.5; scaleX = 0.25; } // down
  else return false;

  // Look for next link in a given direction
  var adx = Math.abs(dirX), ady = Math.abs(dirY);
  if (!lastSelected) {
    console.log('1st select best link');
    SelectBestLink();
  }
  var curr = document.activeElement;
  var currBR = curr.getBoundingClientRect();
  var currX = currBR.left + currBR.width*scaleWidth;
  var currY = currBR.top  + currBR.height/2;
  var links = document.getElementsByTagName('a');
  var best;
  var minD = 1500;

  for (var i = 0; i < links.length; ++i) {
    var link = links[i];
    if (link != curr) {
      var br2 = link.getBoundingClientRect();
      if (br2.width == 0 && br2.height == 0) continue;

      var dx = (br2.left + br2.width*scaleWidth - currX) * scaleX;
      var dy = br2.top + br2.height/2 - currY;
      var adx = Math.abs(dx);
      var ady = Math.abs(dy);
      if (ady > maxDY) continue;
      if ((adx > ady) != (dirX != 0)) continue; // Wrong angle

      var dot = dx * dirX + dy * dirY;
      if (dot <= 0) continue;
      var dist = Math.abs(dx) + Math.abs(dy);
      if (dist < minD) {
        best = link;
        minD = dist;
        // console.log("   new best link dx = ",dx," dy = ", dy, "  dist = ", dist, ' dot=', dot, 'dot/dist=', dot/dist, ' ', link.text);
      }
    }
  }

  if (best) {
    SelectLink(best, links);
    console.log('Select link [', link.innerText, ']');
  }
  return true;
}

function AdvanceSeveralPages(nbrPages) {
  let url = document.location.href;
  let currPage = url.match(/page=\d*/).join();
let newPage = Number(currPage.match(/\d\d*/).join()) + nbrPages;
  url = url.replace(/page=\d*/, "page=" + newPage);
  document.location.href = url;
}

// Listen for a few control+alt + key
document.addEventListener('keydown', function(e) {
  if (e.keyCode == 16 || e.keyCode == 17 || e.keyCode == 18 || e.keyCode == 224) return; // Ignore event for special keys Ctrl/Shift/Option

  // console.log(`Key ${e.keyCode} shift=${e.shiftKey} ctrl=${e.ctrlKey} metal=${e.metaKey}`);
  if (e.shiftKey || !e.ctrlKey || (!e.altKey && !e.metaKey)) {
  // if ((!e.shiftKey && !e.ctrlKey) || (!e.altKey && !e.metaKey)) { // For Mac, accept shift|control
    // if (e.keyCode == 37) ClickLink('button', [/arrow down/]); // Left arrow key
    // else if (e.keyCode == 39) ; // Right arrow key
    // console.log(`Ignored Key ${e.keyCode} shift=${e.shiftKey} ctrl=${e.ctrlKey} metal=${e.metaKey}`);
    return;
  }

  // Space=select best link, enter=click best link, #/del=GMail's delete old messages in trash, o[/p]=previous/next page, /=search box
  switch (e.keyCode) {
    case 32: case 220: SelectBestLink(); return; // Space
    case 13: case 90: ClickLink('a', [/cliquez sur ce lien/, /click this link/, /unread#unread/]); return; // Enter or Z
    case 46: case 51: ClickLink('span', [/^delete forever/]); return; // # or del
    case 191: focusSearchInput(); return; // '/'
    case 83: case 89: TranslateYoutubeCaptions(); return; // S or Y
    case 85: Unfreeze(); return; // U
    case 67: SkipCookieWall(); return; // C
    case 79: case 219: // O or [
      if (!ClickLink('a', [/Précédent/i, /Prev/, /Previous page/, /Older/]))
        ClickLink('i', [/ chevron_left /, /fas fa-angle-right/]);
        ClickLinkByClass('fas fa-angle-left');
      return;
    case 80: case 221: // P or ]
      if (!ClickLink('a', [/Suivant/i, /Next/, /Next page/, /Newer/]) &&
        !ClickLink('i', [/ chevron_right /]))
        ClickLinkByClass('fas fa-angle-right');
      return;
    case 222: AdvanceSeveralPages(3); return; // "/'
  }

  if (!MoveSelectedElement(e.keyCode)) {
    console.log('Key ignored:', e.keyCode);
  }
}, false);

for (let i of [500, 1000, 2000, 3000, 4000]) setTimeout(() => {
  SkipCookieWall();
  if (document.location.href.match(/forum.hardware.fr/)) {
    let e = document.getElementById('filter');
    if (e) e.checked = true;
  }
}, i);

console.log('Keyboard navigation handler ready');
