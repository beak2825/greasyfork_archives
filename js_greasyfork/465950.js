// ==UserScript== 
// @name        No Referrer
// @description Disable HTTP referer by adding rel="noreferrer". This prevents the destination site from receiving what URL the user came from. Press Command + Shift + F to toggle Referrer Policy.
// @author      Schimon Jehudah, Adv.
// @namespace   i2p.schimon.noreferrer
// @homepageURL https://greasyfork.org/en/scripts/465950-no-referrer
// @supportURL  https://greasyfork.org/en/scripts/465950-no-referrer/feedback
// @copyright   2023 - 2024, Schimon Jehudah (http://schimon.i2p)
// @license     MIT; https://opensource.org/licenses/MIT
// @match       file:///*
// @match       *://*/*
// @exclude     devtools://*
// @version     24.04
// @run-at      document-end
// @icon        data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjRtbSIgaGVpZ2h0PSI2NG1tIiB2aWV3Qm94PSIwIDAgNjQgNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHRleHQgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgc3R5bGU9ImZvbnQtd2VpZ2h0OjQwMDtmb250LXNpemU6MTkycHg7bGluZS1oZWlnaHQ6MDt0ZXh0LWluZGVudDowO3RleHQtYWxpZ246c3RhcnQ7dGV4dC1kZWNvcmF0aW9uLXN0eWxlOnNvbGlkO3RleHQtZGVjb3JhdGlvbi1jb2xvcjojMDAwO3dyaXRpbmctbW9kZTpsci10YjtkaXJlY3Rpb246bHRyO3RleHQtb3JpZW50YXRpb246bWl4ZWQ7ZG9taW5hbnQtYmFzZWxpbmU6YXV0bztiYXNlbGluZS1zaGlmdDpiYXNlbGluZTt0ZXh0LWFuY2hvcjpzdGFydDtzaGFwZS1wYWRkaW5nOjA7c2hhcGUtbWFyZ2luOjA7aW5saW5lLXNpemU6MDtvcGFjaXR5OjE7ZmlsbDojMDAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZS13aWR0aDoxLjI3OTgyO3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxO3N0b3AtY29sb3I6IzAwMDtzdG9wLW9wYWNpdHk6MSIgeD0iMTcuMDA1MjQ1IiB5PSIzMS42NTg0MDUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00LjQzNjg1NjQgNDAuODk0OTQpIHNjYWxlKC4yNjQ1OCkiPjx0c3BhbiB4PSIxNy4wMDUyNDUiIHk9IjMxLjY1ODQwNSIgc3R5bGU9ImZvbnQtc2l6ZToxOTJweCI+8J+kqzwvdHNwYW4+PC90ZXh0Pjwvc3ZnPgo=
// @downloadURL https://update.greasyfork.org/scripts/465950/No%20Referrer.user.js
// @updateURL https://update.greasyfork.org/scripts/465950/No%20Referrer.meta.js
// ==/UserScript==

var namespace = 'i2p-schimon-noreferrer';
document.addEventListener('keyup', hotkey, false);

function hotkey(e) {
  // set hotkey Ctrl + Shift + 5
  //if (e.ctrlKey && e.shiftKey && e.which == 53) {
  // set hotkey Command + Shift + R
  //if (e.metaKey && e.shiftKey && e.which == 82) {
  // set hotkey Command + Shift + F
  if (e.metaKey && e.shiftKey && e.which == 70) {
    toggleNoReferrer();
  }
}

function toggleNoReferrer() {
  if (document.querySelector(namespace)) {
    appendNoReferrer();
    document.querySelector(namespace).remove();
  } else {
    removeNoReferrer();
    warningBar();
  }
}

function appendNoReferrer() {
  let elements = ['area', 'form'];
  for (let i = 0; i < elements.length; i++) {
    for (const element of document.querySelectorAll(elements[i])) {
      element.rel = 'nofollow noopener noreferrer';
    }
  }
  for (const element of document.querySelectorAll('link')) {
    element.referrerPolicy = 'no-referrer';
  }
  // TODO
  // Do we need array "elements"?
  // Probably not, because we handle 'a[href]' which isn't related to array "elements".
  // I think this for loop should not be here
  for (let i = 0; i < elements.length; i++) {
    for (const element of document.querySelectorAll('a[href]')) {
      // TODO CSS Selector to select a[href] which does
      // not start with hash, instead of "if" statement
      if (!element.href.startsWith(element.baseURI + '#')) {
        element.rel = 'nofollow noopener noreferrer';
      }
    }
  }
  
  // Event delegation works and requires JS enabled
  document.body.addEventListener ("click", function(e) {
    if (e.target && e.target.nodeName == "A" && e.target.href) {
      if (!e.target.href.startsWith(e.baseURI + '#') ||
          !document.querySelector(namespace)) { // TODO Test
        e.target.rel = 'nofollow noopener noreferrer';
      }
    }
  });
}

function removeNoReferrer() {
  for (const element of document.querySelectorAll('[rel="noreferrer"]')) {
    element.removeAttribute('rel');
  }
  for (const element of document.querySelectorAll('[referrerpolicy="no-referrer"]')) {
    element.removeAttribute('referrerpolicy');
  }
}

function warningBar() {
  let bar = document.createElement(namespace);
  document.body.append(bar);
  bar.innerHTML = '<b>WARNING! Referrer Policy has been <u>temporarily</u> enabled;<!-- br --> Reload page or click <code style="color: navajowhite;background: black;border-radius: 1em;padding: 3px;font-family: monospace;font-size: smaller;">Command</code> + <code style="color: navajowhite;background: black;border-radius: 1em;padding: 3px;font-family: monospace;font-size: smaller;">Shift</code> + <code style="color: navajowhite;background: black;border-radius: 1em;padding: 3px;font-family: monospace;font-size: smaller;">F</code> to restore privacy mode. (i.e. no-referrer)</b>'; // 🫵
  bar.title = 'Click to reload';
  //bar.title = 'Restore privacy mode by 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 + 𝐒𝐡𝐢𝐟𝐭 + 𝐑 or click this bar to reload page.';
  bar.id = namespace;
  bar.style.backgroundColor = 'red'; // #2c3e50 coral indianred
  bar.style.color = 'white'; // #eee navajowhite
  bar.style.fontFamily = 'system-ui';
  bar.style.right = 0;
  bar.style.left = 0;
  bar.style.top = 0;
  bar.style.zIndex = 10000000000;
  bar.style.padding = '6px'; //13px //15px //11px //9px //3px //1px
  bar.style.position = 'fixed';
  bar.style.textAlign = 'center'; // justify
  bar.style.direction = 'ltr';
  // set bar behaviour
  bar.onclick = () => {
    bar.style.display = 'none';
    location.reload();
  };
}

(function appendNoReferrerToLink() {
  // Add element <link/> with rel="noreferrer".
  // Some consider <link rel="noreferrer"/> as invalid.
  let link = document.createElement('link');
  document.head.append(link);
  link.referrerPolicy = 'no-referrer';
  link.rel = 'nofollow noopener noreferrer';
})();

appendNoReferrer();
