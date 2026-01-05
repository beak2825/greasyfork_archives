// ==UserScript==
// @name        Private tabs for certain links
// @description Opens certain links in a private FF tab. Requires https://addons.mozilla.org/fr/firefox/addon/private-tab/?src=api
// @namespace   http://userscripts.org/users/399688
// @include     /https?:\/\/(np\.|www\.)reddit.com\/.*/
// @version     1.1.1
// @grant       GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/17801/Private%20tabs%20for%20certain%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/17801/Private%20tabs%20for%20certain%20links.meta.js
// ==/UserScript==
/*
Changelog:
v2.0.0
  Allows choosing the mode of operation from either inclusive or exclusive site filtering.
  Inclusive = Only open these sites in private tabs
  Exclusive = Open all sites in private tabs excluding the ones you define

v1.1.1
  MObile youtube m.youtube.com

v1.1.0
  Clicking on elements in anchors work now

v1.0.0
  Initial version for anchors
*/

/**
Do we want to INCLUDE only certain sites for privacy?
Otherwise (false) every site is private EXCLUDING certain sites
*/
var inclusiveScript = false;

/**
Site that should be included for privacy
*/
var inclusiveRegexs = [
  /^https?:\/\/((www|m)\.)?(youtu\.?be)/
]
/**
Sites that should be EXCLUDED from privacy
*/
var exclusiveRegexs = [
  /^javascript:.*/,
  /https?:\/\/(np\.|www\.)reddit.com\/.*/
]


var openInBackground = false;

/**
Gets the first element in the heirarchy that has the given tagname
*/
function getFirstParentOftag(element, tagName) {
  if (element.tagName == tagName) {
    return element;
  }
  var parent = element.parentElement;
  if (parent) {
    return getFirstParentOftag(parent, tagName);
  }
  return null;
}

/**
First class function to call a method with given args on a future given object
*/
function callWith(method, ...args) {
  return function (o) {
    var func = o[method];
    if (typeof func !== 'function') {
      message = method + ' is not a function';
      console.error(message + ' of ', o);
      throw new TypeError(message);
    }
    return func.apply(o, args);
  }
}

/**
Should we open the page in a private tab?
*/
function shouldPrivatise(href){
  if(inclusiveScript){
    return inclusiveRegexs.some(callWith('test', href));
  } else {
    return ! exclusiveRegexs.some(callWith('test', href));
  }
}

/**
Opens the link in a private tab
*/
function handler(event) {
  // Only left clicks
  if (event.button !== 0) {
    return;
  }
  // Our target might be wrapped in an <a>
  var firstA = getFirstParentOftag(event.target, 'A');
  if (!firstA) {
    return;
  }
  // Only ourlinks we wanna privatise
  var href = firstA.href;
  if (shouldPrivatise(href)) {
    var privateHref = 'private:' + href;
    GM_openInTab(privateHref, openInBackground);
    event.preventDefault();
  }
}
document.addEventListener('click', handler, true);
