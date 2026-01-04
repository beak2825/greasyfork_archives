// ==UserScript==
// @name Remove social sharing/following icons
// @homepage		https://greasyfork.org/en/scripts/36844-remove-social-sharing-icons
// @supportURL		https://greasyfork.org/en/scripts/36844-remove-social-sharing-icons/feedback
// @description:en Remove soical sharing/following icons and must not be the same as name. F*K pinterest BTW lol
// @version 0.2.4.1 beta
// @include *
// @exclude *facebook.com*
// @exclude *twitter.com*
// @exclude *instagram.com*
// @exclude *weibo*
// @exclude *office*
// @exclude *microsoft*
// @exclude *greasyfork*
// @exclude *youtube*
// @exclude *pinterest.com*
// @exclude *google*?*+*
// @excludd *meme*
// @noframes
// @grant none
// @run-at       document-idle
// @namespace https://greasyfork.org/users/12687
// @description Remove soical sharing icons and must not be the same as name
// @downloadURL https://update.greasyfork.org/scripts/36844/Remove%20social%20sharingfollowing%20icons.user.js
// @updateURL https://update.greasyfork.org/scripts/36844/Remove%20social%20sharingfollowing%20icons.meta.js
// ==/UserScript==


var styleEl = document.createElement('style');
styleEl.type = 'text/css';
styleEl.innerHTML = "\
div[class*=community],\
div[class^=pop],\
div[class*='-share'],\div[class*=sharing],\div[class^=share],\
div[class^=soc],\div[class^=add],\div[class^=subs],\div[class^=plus],\div[class^=follow],\
div[id^=social],\
i[class*=social],\
img[class*=social],\img[src*='facebook.'],\
img[src*='fb-'],\img[src*='FB-'],\img[src*='tweet?'],\img[src*='twe'],\img[src*='witt'],\
span[class*=sharing],\span[class*='social-'],\span[class*=twitter],\span[class*='share-'],\
a[aria-label=facebook],\a[aria-label=tumblr],\
a[href*='addthis'],\
a[href*='com/+'],\
a[href*='instagram'],\
a[href*='javascript:share'],\
a[href*='/pin'],\
a[href*='share?'],\
a[href*='/share'],\
a[href*='//plus.goo'],\a[href*='//www.faceb'],\a[href*='//twit'],\a[href*='//www.inst'],\
a[href*='tweet?'],\
a[title*='follow'],\a[lable=facebook],\a[lable=twitter],\a[lable=instagram],\
div[title*='faceb'],\div[title*='twitt'],\div[title*='insta'],\div[title*='goog'],\
a[class*='-trigger'],\a[onclick*='social']{display: none !important;}\
";
document.documentElement.appendChild(styleEl);

var styleEl2 = document.createElement('style');
styleEl2.type = 'text/css';
styleEl2.innerHTML = "\
div>li[id*='share']{display: none !important;}\
";
document.documentElement.appendChild(styleEl2);

//removes opening of share link (possible false postive)
function NoOpen(e){return 1}
this.open=NoOpen;
window.open=NoOpen;
open=NoOpen;

window.open = function(){
return;
}

//Check this for disqus removal:https://greasyfork.org/en/scripts/9578-remove-disqus-and-other-social-media-from-hindustan-times but bad/broken jsQuery
//recommended to use extensions/add-ons with icon replace.