// ==UserScript==
// @name s/force/horse/g
// @version 3.2.1
// @description Replaces the word "force" with "horse".
// @match *://*/*
// @license License In Three Lines
// @namespace https://greasyfork.org/users/5442
// @downloadURL https://update.greasyfork.org/scripts/5142/sforcehorseg.user.js
// @updateURL https://update.greasyfork.org/scripts/5142/sforcehorseg.meta.js
// ==/UserScript==

// Copyright 2014 Stuart P. Bentley.
// This work may be used freely as long as this notice is included.
// The work is provided "as is" without warranty, express or implied.

// The pattern to match
var force_pattern = /(f)(or)(c)(e)/ig;

// which letters in "force" get replaced with which in "horse"
var horse_subs = {
  'f': 'h', 'F': 'H',
  'c': 's', 'C': 'S'
};

// construct "horse" replacement for "force" components
function replacement_horse(match,f,or,c,e) {
    return horse_subs[f] + or + horse_subs[c] + e;
}

// Transform all instances of "force" in a string into "horse"
function horsify(str) {
  return str.replace(force_pattern, replacement_horse);
}

// Flag to signal that we're replacing text, so that change doesn't trigger
// another replacement (technically, that can't happen if all the instances
// of "force" that would trigger a replacement have been replaced with
// "horse", but it's still good practice)
var replacingContent = false;

function replaceTextContent(node) {
  if (~node.textContent.search(force_pattern)) {

    // Flag that content is being replaced so the event it generates
    // won't trigger another replacement
    replacingContent = true;
    node.textContent = horsify(node.textContent);
    replacingContent = false;
  }
}

function changeTextNodes(node) {
  var length, childNodes;

  // If this is a text node, attempt substitutions on it
  if (node.nodeName == '#text') {
    replaceTextContent(node);

  // If this is an ordinary content node, recurse any children
  // ("ordinary" here means a node where text content doesn't have meaning
  // beyond human text - <style> and <script> are the only nodes of this type
  // that I know of)
  } else if (node.nodeName.toLowerCase() != 'style'
    && node.nodeName.toLowerCase() != 'script') {

    childNodes = node.childNodes;
    length = childNodes.length;
    for (var i = 0; i < length; ++i) {
      changeTextNodes(childNodes[i]);
    }
  }
}

function insertion_listener(event) {
  //change any new text nodes in a node that is added to the body
  changeTextNodes(event.target);
}

function cdm_listener(event) {
  //avoid infinite loop by ignoring events triggered by replacement
  if (!replacingContent) {
    replaceTextContent(event.target);
  }
}

changeTextNodes(document.body);
document.title = horsify(document.title);
document.body.addEventListener(
  'DOMNodeInserted', insertion_listener, false);
document.body.addEventListener(
  'DOMCharacterDataModified', cdm_listener, false);
