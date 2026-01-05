// ==UserScript==
// @name	  NF.org
// @namespace	  https://greasyfork.org/users/4390-seriousm
// @description   Direct image display
// @match         http://www.newsfilter.org/gallery/*
// @version       0.3
// @downloadURL https://update.greasyfork.org/scripts/4711/NForg.user.js
// @updateURL https://update.greasyfork.org/scripts/4711/NForg.meta.js
// ==/UserScript==

(function(){
    $('.gallery-item-small a img').each(function(ix, item){
        var re = /(.*)thumbs\/(.*)/;
        var str = item.src;
        var subst = '$1$2';
        var result = str.replace(re, subst);
        $(item).parent().attr('href', result);
    });
})();