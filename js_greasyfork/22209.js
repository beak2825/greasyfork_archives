// ==UserScript==
// @name        removeFacebookSuggestedPosts
// @namespace   DT
// @description Remove facebook suggested posts
// @include     https://www.facebook.com/
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22209/removeFacebookSuggestedPosts.user.js
// @updateURL https://update.greasyfork.org/scripts/22209/removeFacebookSuggestedPosts.meta.js
// ==/UserScript==

var DT = {};

DT._ticking = false;

DT.main = function(){
    var spans = document.getElementsByTagName("SPAN");
    var totalSpans = spans.length;
    for(var i = 0; i < totalSpans; i++){
        var item = spans.item(i);
        if(!item) return;
        if(item.textContent === 'Suggested Post' || item.textContent ===  'Suggested Game' || item.textContent ===  'Sponsored'){
            var parent = item.parentNode.parentNode.parentNode.parentNode.parentNode;
            if(item.textContent === 'Sponsored') parent = parent.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
            if(parent){
                parent.parentNode.removeChild(parent);
                console.log('Removed ' + item.textContent);
            }
        }
    }
};

DT._tick = function(){
    if(!DT._ticking){
        window.setTimeout(function(){
            DT.main();
            DT._ticking = false;
        }, 3000);
    }
    DT._ticking = true;
};

document.addEventListener("DOMContentLoaded", DT._tick);
window.addEventListener('scroll', DT._tick);
