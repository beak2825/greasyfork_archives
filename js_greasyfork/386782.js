// ==UserScript==
// @name         Komica idiot tag
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description 將WebM跟GIF以外的tag通通改成智障並失效
// @match        http://sora.komica.org/00/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386782/Komica%20idiot%20tag.user.js
// @updateURL https://update.greasyfork.org/scripts/386782/Komica%20idiot%20tag.meta.js
// ==/UserScript==

$.each($(".category").find('a'),function(index,item){
    let target = $(item).attr('href');
    if(target.substr(-15) != 'category&c=WebM' && target.substr(-14) != 'category&c=GIF'){
        $(item).text('智障');
        $(item).removeAttr('href');
    }
});
