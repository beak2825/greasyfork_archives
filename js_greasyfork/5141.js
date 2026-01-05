// ==UserScript==
// @name s/keyboard/leopard/g
// @version 3.2.1
// @description Replaces the word "keyboard" with "leopard".
// @match *://*/*
// @license License In Three Lines
// @namespace https://greasyfork.org/users/5442
// @downloadURL https://update.greasyfork.org/scripts/5141/skeyboardleopardg.user.js
// @updateURL https://update.greasyfork.org/scripts/5141/skeyboardleopardg.meta.js
// ==/UserScript==

// Copyright 2014 Stuart P. Bentley.
// This work may be used freely as long as this notice is included.
// The work is provided "as is" without warranty, express or implied.

// The pattern to match
var keyboard_pattern = /(k)(e)(y)(b)o(ard)/ig;

// which letters in "keyboard" get replaced with which in "leopard"
var leopard_subs = {
  'k': 'l', 'K': 'L',
  'y': 'o', 'Y': 'O',
  'b': 'p', 'B': 'P'
};

// construct "leopard" replacement for "keyboard" components
function replacement_leopard(match,k,e,y,b,ard) {
    return leopard_subs[k] + e +  leopard_subs[y] + leopard_subs[b] + ard;
}

// Transform all instances of "keyboard" in a string into "leopard"
function leopardize(str) {
  return str.replace(keyboard_pattern, replacement_leopard);
}

// Flag to signal that we're replacing text, so that change doesn't trigger
// another replacement (technically, that can't happen if all the instances
// of "keyboard" that would trigger a replacement have been replaced with
// "leopard", but it's still good practice)
var replacingContent = false;

function replaceTextContent(node) {
  if (~node.textContent.search(keyboard_pattern)) {

    // Flag that content is being replaced so the event it generates
    // won't trigger another replacement
    replacingContent = true;
    node.textContent = leopardize(node.textContent);
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
document.title = leopardize(document.title);
document.body.addEventListener(
  'DOMNodeInserted', insertion_listener, false);
document.body.addEventListener(
  'DOMCharacterDataModified', cdm_listener, false);
