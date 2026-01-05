// ==UserScript==
// @name        facebook block more sponsors
// @namespace   enimod
// @include     https://www.facebook.com/
// @version     2
// @description  Block Facebook news feed "sponsored" posts that hide in :after css
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22417/facebook%20block%20more%20sponsors.user.js
// @updateURL https://update.greasyfork.org/scripts/22417/facebook%20block%20more%20sponsors.meta.js
// ==/UserScript==
//thx solskido https://greasyfork.org/en/scripts/22210-facebook-unsponsored/code
//thx https://gomakethings.com/climbing-up-and-down-the-dom-tree-with-vanilla-javascript/
//thx http://stackoverflow.com/questions/2400935/browser-detection-in-javascript/2401861#2401861

var mutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
var streamSelector = 'div[id^="topnews_main_stream"]';
var storySelector = 'div[id^="hyperfeed_story_id"]';
navigator.sayswho = (function(){
    var ua= navigator.userAgent, tem,
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, '-?'];
   
    return M[0];
})();
var getClosest = function ( elem, selector ) {

    // Variables
    var firstChar = selector.charAt(0);
    var supports = 'classList' in document.documentElement;
    var attribute, value;

    // Get closest match
    for ( ; elem && elem !== document && elem.nodeType === 1; elem = elem.parentNode ) {
        // If selector is a class
        if ( firstChar === '.' ) {
            if ( supports ) {
                if ( elem.classList.contains( selector.substr(1) ) ) {
                    return elem;
                }
            } else {
                if ( new RegExp('(^|\\s)' + selector.substr(1) + '(\\s|$)').test( elem.className ) ) {
                    return elem;
                }
            }
        }
        // If selector is a tag
        if ( elem.tagName.toLowerCase() === selector ) {
            return elem;
        }
    }
    return null;
};

function process() {
    // Locate the stream every iteration to allow for FB SPA navigation which
    // replaces the stream element
    var stream = document.querySelector(streamSelector);
    if(!stream) {
        return;
    }

    var stories = stream.querySelectorAll(storySelector);
    if(!stories.length) {
        return;
    }
   if(navigator.sayswho == 'Firefox') {
       var as = document.querySelectorAll(":-moz-any(h6, h5) + div > span > a");
   } else {
      var as = document.querySelectorAll(":-webkit-any(h6, h5) + div > span > a");
   }
  for (var a of as) {
if( (window.getComputedStyle(a, '::after').getPropertyValue('content') == '"Sponsored"') || a.innerHTML == 'Sponsored') {
		var closestElem = getClosest(a, '.userContentWrapper');
		var closestElem2 = getClosest(closestElem.parentNode, '.userContentWrapper');
		if(closestElem2){
			closestElem2.remove();
		} else {
		closestElem.remove();
		}
    }
  }
}

var observer = new mutationObserver(process);
observer.observe(document.querySelector('body'), {
    'childList': true,
    'subtree': true
});


