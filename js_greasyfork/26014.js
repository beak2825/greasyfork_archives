// ==UserScript==
// @name        Blokowanie sponsorowanych na Facebooku
// @author   	Kacper Pawlak
// @include     https://web.facebook.com/*
// @version     1
// @description  Blokowanie sponsorowanych postów na "Facebooku"
// @grant       none
// @namespace https://greasyfork.org/users/9304
// @downloadURL https://update.greasyfork.org/scripts/26014/Blokowanie%20sponsorowanych%20na%20Facebooku.user.js
// @updateURL https://update.greasyfork.org/scripts/26014/Blokowanie%20sponsorowanych%20na%20Facebooku.meta.js
// ==/UserScript==
//thx https://greasyfork.org/en/scripts/22417-facebook-block-more-sponsors
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
        if(tem!== null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, '-?'];
    return M[0];
})();
var getClosest = function ( elem, selector ) {
    var firstChar = selector.charAt(0);
    var supports = 'classList' in document.documentElement;
    var attribute, value;
    for ( ; elem && elem !== document && elem.nodeType === 1; elem = elem.parentNode ) {
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
        if ( elem.tagName.toLowerCase() === selector ) {
            return elem;
        }
    }
    return null;
};

function process() {
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
if( (window.getComputedStyle(a, '::after').getPropertyValue('content') == '"Sponsorowane"') || a.innerHTML == 'Sponsorowane') {
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