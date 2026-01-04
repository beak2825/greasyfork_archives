// ==UserScript==
// @name        夺宝岛自营
// @description zh-cn
// @namespace   paipai.jd.com
// @version     1.3.4
// @grant       none
// @include     /https?\://paipai.jd.com/*
// @require    https://greasyfork.org/scripts/31940-waitforkeyelements/code/waitForKeyElements.js?version=209282
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/404063/%E5%A4%BA%E5%AE%9D%E5%B2%9B%E8%87%AA%E8%90%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/404063/%E5%A4%BA%E5%AE%9D%E5%B2%9B%E8%87%AA%E8%90%A5.meta.js
// ==/UserScript==
// $('.gl-item');



// waitForKeyElements (
//     $('.gl-item'),
//     hideitems
// );
setInterval(function(){
	hideitems();
},500);



function hideitems() {
    var i = 0;
    console.log(i);
    var itemlist = $('.gl-item');

    for (; i < itemlist.length; i++) { 
        // console.log(itemlist.eq(i));
        content = itemlist.eq(i).text()

        // console.log(toString(itemlist[i]));
        var dp_item =content.indexOf('店铺优品');
        var ziyin =content.indexOf('自营');

        if (dp_item != -1 || ziyin == -1)
        {
            itemlist.eq(i).hide();
            console.log('hide', content, dp_item);
        }

    }
}