// ==UserScript==
// @name        WME FontAwesome Converter
// @namespace   http://www.tomputtemans.com/
// @author      Tom 'Glodenox' Puttemans
// @description Converts the old FontAwesome classes to the new FontAwesome classes
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version     0.1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18539/WME%20FontAwesome%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/18539/WME%20FontAwesome%20Converter.meta.js
// ==/UserScript==

var iconRegex = new RegExp(/icon-([^\s]*)/);
// list obtained from https://github.com/FortAwesome/Font-Awesome/wiki/Upgrading-from-3.2.1-to-4
var namemap = { 'ban-circle': 'ban', 'bar-chart': 'bar-chart-o', 'beaker': 'flask', 'bell': 'bell-o', 'bell-alt': 'bell', 'bitbucket-sign': 'bitbucket-square', 'bookmark-empty': 'bookmark-o', 'building': 'building-o', 'calendar-empty': 'calendar-o', 'check-empty': 'square-o', 'check-minus': 'minus-square-o', 'check-sign': 'check-square', 'check': 'check-square-o', 'chevron-sign-down': 'chevron-down', 'chevron-sign-left': 'chevron-left', 'chevron-sign-right': 'chevron-right', 'chevron-sign-up': 'chevron-up', 'circle-arrow-down': 'arrow-circle-down', 'circle-arrow-left': 'arrow-circle-left', 'circle-arrow-right': 'arrow-circle-right', 'circle-arrow-up': 'arrow-circle-up', 'circle-blank': 'circle-o', 'cny': 'rmb', 'collapse-alt': 'minus-square-o', 'collapse-top': 'caret-square-o-up', 'collapse': 'caret-square-o-down', 'comment-alt': 'comment-o', 'comments-alt': 'comments-o', 'copy': 'files-o', 'cut': 'scissors', 'dashboard': 'tachometer', 'double-angle-down': 'angle-double-down', 'double-angle-left': 'angle-double-left', 'double-angle-right': 'angle-double-right', 'double-angle-up': 'angle-double-up', 'download': 'arrow-circle-o-down', 'download-alt': 'download', 'edit-sign': 'pencil-square', 'edit': 'pencil-square-o', 'ellipsis-horizontal': 'ellipsis-h', 'ellipsis-vertical': 'ellipsis-v', 'envelope-alt': 'envelope-o', 'exclamation-sign': 'exclamation-circle', 'expand-alt': 'plus-square-o', 'expand': 'caret-square-o-right', 'external-link-sign': 'external-link-square', 'eye-close': 'eye-slash', 'eye-open': 'eye', 'facebook-sign': 'facebook-square', 'facetime-video': 'video-camera', 'file-alt': 'file-o', 'file-text-alt': 'file-text-o', 'flag-alt': 'flag-o', 'folder-close-alt': 'folder-o', 'folder-close': 'folder', 'folder-open-alt': 'folder-open-o', 'food': 'cutlery', 'frown': 'frown-o', 'fullscreen': 'arrows-alt', 'github-sign': 'github-square', 'google-plus-sign': 'google-plus-square', 'group': 'users', 'h-sign': 'h-square', 'hand-down': 'hand-o-down', 'hand-left': 'hand-o-left', 'hand-right': 'hand-o-right', 'hand-up': 'hand-o-up', 'hdd': 'hdd-o', 'heart-empty': 'heart-o', 'hospital': 'hospital-o', 'indent-left': 'outdent', 'indent-right': 'indent', 'info-sign': 'info-circle', 'keyboard': 'keyboard-o', 'legal': 'gavel', 'lemon': 'lemon-o', 'lightbulb': 'lightbulb-o', 'linkedin-sign': 'linkedin-square', 'meh': 'meh-o', 'microphone-off': 'microphone-slash', 'minus-sign-alt': 'minus-square', 'minus-sign': 'minus-circle', 'mobile-phone': 'mobile', 'moon': 'moon-o', 'move': 'arrows', 'off': 'power-off', 'ok-circle': 'check-circle-o', 'ok-sign': 'check-circle', 'ok': 'check', 'paper-clip': 'paperclip', 'paste': 'clipboard', 'phone-sign': 'phone-square', 'picture': 'picture-o', 'pinterest-sign': 'pinterest-square', 'play-circle': 'play-circle-o', 'play-sign': 'play-circle', 'plus-sign-alt': 'plus-square', 'plus-sign': 'plus-circle', 'pushpin': 'thumb-tack', 'question-sign': 'question-circle', 'remove-circle': 'times-circle-o', 'remove-sign': 'times-circle', 'remove': 'times', 'reorder': 'bars', 'resize-full': 'expand', 'resize-horizontal': 'arrows-h', 'resize-small': 'compress', 'resize-vertical': 'arrows-v', 'rss-sign': 'rss-square', 'save': 'floppy-o', 'screenshot': 'crosshairs', 'share-alt': 'share', 'share-sign': 'share-square', 'share': 'share-square-o', 'sign-blank': 'square', 'signin': 'sign-in', 'signout': 'sign-out', 'smile': 'smile-o', 'sort-by-alphabet-alt': 'sort-alpha-desc', 'sort-by-alphabet': 'sort-alpha-asc', 'sort-by-attributes-alt': 'sort-amount-desc', 'sort-by-attributes': 'sort-amount-asc', 'sort-by-order-alt': 'sort-numeric-desc', 'sort-by-order': 'sort-numeric-asc', 'sort-down': 'sort-desc', 'sort-up': 'sort-asc', 'stackexchange': 'stack-overflow', 'star-empty': 'star-o', 'star-half-empty': 'star-half-o', 'sun': 'sun-o', 'thumbs-down-alt': 'thumbs-o-down', 'thumbs-up-alt': 'thumbs-o-up', 'time': 'clock-o', 'trash': 'trash-o', 'tumblr-sign': 'tumblr-square', 'twitter-sign': 'twitter-square', 'unlink': 'chain-broken', 'upload': 'arrow-circle-o-up', 'upload-alt': 'upload', 'warning-sign': 'exclamation-triangle', 'xing-sign': 'xing-square', 'youtube-sign': 'youtube-square', 'zoom-in': 'search-plus', 'zoom-out': 'search-minus', 'white': 'inverse', 'large': 'lg', 'fixed-width': 'fw' };

function init() {
  if (document.querySelector('#user-info') == null) {
    setTimeout(init, 400);
    return;
  }

  // Set up MutationObserver
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      //console.log(mutation);
      var addedNodes = mutation.addedNodes;
      for (var n = 0; n < addedNodes.length; n++) {
        fixFAClass(addedNodes[n]);
      }
    });
  });
  observer.observe(document.querySelector('#user-info'), {
    childList: true,
    subtree: true
  });

  // Apply to all currently available elements with 'icon-' class
  var matches = document.querySelectorAll('*[class*="icon-"]');
  for (var i = 0; i < matches.length; i++) { // NodeList result doesn't support Array methods
    fixFAClass(matches[i]);
  }
}

function fixFAClass(node) {
  // Is a fix necessary?
  try {
    if (node.nodeType !== Node.ELEMENT_NODE || !node.classList || node.classList.contains('fa') || typeof node.className !== 'string' || node.className.indexOf('icon-') !== 0) {
      // Apply to childNodes (if any)
      for (var c = 0; c < node.childNodes.length; c++) {
        fixFAClass(node.childNodes[c]);
      }
      return;
    }
  } catch (err) {
    console.log(err, node);
  }

  // Check which FA class is applied (if any)
  var result = iconRegex.exec(node.className)
  if (result !== null && result.length > 0) {
    var newFaClass = 'fa-';
    // Look up new FA class
    var replacement = namemap[result[1]];
    newFaClass += (replacement ? replacement : result[1]);
    
    // Add new class + generic fa class
    node.classList.add('fa');
    node.classList.add(newFaClass);
  }
}

init();