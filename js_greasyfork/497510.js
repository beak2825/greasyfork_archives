// ==UserScript==
// @name         FC2PPV.live
// @namespace    https://greasyfork.org/zh-CN/scripts/497510-fc2ppv-live/code
// @version      0.2.2
// @description  FC2PPV.live图片修改,种子搜索
// @author       sp365
// @match        https://www.fc2ppv.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fc2ppv.live
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497510/FC2PPVlive.user.js
// @updateURL https://update.greasyfork.org/scripts/497510/FC2PPVlive.meta.js
// ==/UserScript==

(function() {

    function jsleft(obj, str) {
        var index = obj.indexOf(str);
        obj = obj.substring(0, index);
        return obj;
    }

    //JS 取右字符函数
    function jsright(obj,str){
        var index = obj.indexOf(str);
        obj = obj.substring(index + 1,obj.length);
        return obj;
    }

    function jsmid(str,b,a){
        var bds=b+'(\\S*)'+a;
        return str.match(bds)[1];
    }

    //jQuery('.section')[0].remove();
    //移除页面最上面的广告
    var se=jQuery('.section');
    var p=se.length;
    console.log(i);
    if (p>2){
        jQuery('.section')[0].remove();
    }
//替换图片
    var i;
    var id;
    var urls =jQuery('figure.image a img');
    for (i = 0; i < urls.length; i++) {
        var url = urls[i].src;
        url=jsright(url, '&file=');
        console.log(url);
        url=url.replace( 'file=','');
        console.log(url);
        jQuery('figure.image a img')[i].src=url;

        //添加磁力链接搜索链接
        console.log(i);

        id=$('figure.image a')[i].href;
        console.log(id);
        // var str=id;
        id=id.replace('20','')
        var str = id.match(/\d+/g);
        console.log(str[2]);
        //https://btsow.motorcycles/search/
        //注入搜索链接
        jQuery('.media-content')[i].innerHTML= jQuery('.media-content')[i].innerHTML+'<a target="_blank" href=https://btsow.motorcycles/search/'+str[2]+'><p class="ccc">FC2PPV'+str[2]+'</p></a>';
        var s=jQuery('.media-content')[i];
        //jQuery('figure.image a')[i].innerHTML= jQuery('figure.image a')[i].innerHTML+'<a target="_blank" href=https://btsow.motorcycles/search/'+str[2]+'><p class="ccc">FC2PPV'+str[2]+'</p></a>';
        //console.log(s);

    }
    
    function st()
    {
        document.querySelector('a.button.btn-mag.is-one-quarter').click();
    }
setTimeout(st,1000);

})();