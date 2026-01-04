// ==UserScript==
// @name        Make links to bug reports in Qt for Python Development Notes
// @namespace   Violentmonkey Scripts
// @match       https://wiki.qt.io/Qt_for_Python_Development_Notes
// @match       https://wiki.qt.io/Qt_for_Python_Development_Notes_*
// @grant       none
// @version     1.1.3
// @author      StSav012
// @description Make links to bug reports on https://wiki.qt.io/Qt_for_Python_Development_Notes page
// @downloadURL https://update.greasyfork.org/scripts/477252/Make%20links%20to%20bug%20reports%20in%20Qt%20for%20Python%20Development%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/477252/Make%20links%20to%20bug%20reports%20in%20Qt%20for%20Python%20Development%20Notes.meta.js
// ==/UserScript==

"use strict";

function bugreportsLink(bug) {
  const a = document.createElement('A');
  a.setAttribute('class', "external text");
  a.setAttribute('rel', "nofollow");
  a.setAttribute('href', 'https://bugreports.qt.io/browse/' + bug);
  a.appendChild(document.createTextNode(bug));
  return a;
}

function makeBugreportLinks(str) {
  const bugreportPattern = /\b(?:COIN|QBS|QTBUG|QT3DS|AUTOSUITE|QTJIRA|CLOUD|QTCREATORBUG|QDS|QTEXT|QTMCU|PYSIDE|QTIFW|QLS|QTPLAYGROUND|QTWEBSITE|QTQAINFRA|QSR|QTSOLBUG|QTVSADDINBUG|QTWB|VSCODEEXT)-\d+/g;
  var bugs = str.match(bugreportPattern);
  if (bugs === null) {
    return [str];
  }
  var newNodes = [];
  var textParts = str.split(bugreportPattern);
  while (textParts.length || bugs.length) {
    var text = textParts.shift();
    if (text !== undefined && text.length) {
      newNodes.push(text);
    }
    var bug = bugs.shift();
    if (bug !== undefined) {
      newNodes.push(bugreportsLink(bug));
    }
  }
  return newNodes;
}

function makeLinks(parent) {
  for (let n of parent.childNodes) {
    if (parent.tagName === 'A') {  // should be here in case `parent` changes
      return;
    }
    if (n.tagName === 'A') {
      continue;
    }
    if (n.nodeName === "#text" && n.nodeValue !== undefined) {
      n.replaceWith(...makeBugreportLinks(n.nodeValue));
    } else {
      makeLinks(n);
    }
  }
}
makeLinks(document.body);
