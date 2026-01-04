// ==UserScript==
// @name         英文版本自动跳中文 插件
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You

// @match        *www.php.net/manual/en*
// @match        *developer.mozilla.org/en-US/*
// @match        *eslint.org/*
// @match        *api.jquery.com/*


// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39165/%E8%8B%B1%E6%96%87%E7%89%88%E6%9C%AC%E8%87%AA%E5%8A%A8%E8%B7%B3%E4%B8%AD%E6%96%87%20%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/39165/%E8%8B%B1%E6%96%87%E7%89%88%E6%9C%AC%E8%87%AA%E5%8A%A8%E8%B7%B3%E4%B8%AD%E6%96%87%20%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';


    /*=======  edit  your  site =========*/
    var skiplist=[
        ['/api.jquery.com/','/www.jquery123.com/'],
        ['/www.php.net/manual/en/','/www.php.net/manual/zh/'],
        ['/developer.mozilla.org/en-US/','/developer.mozilla.org/zh-CN/'],
        ['/eslint.org/','/eslint.cn/'],
    ]

    /*=======  edit  your  site =========*/
     var href = window.location.href;
    function skip(source,target){
        if(href.indexOf(source)!=-1){
            href = href.replace(source,target);
            window.location.href =href;
        }
    }
    for (var i=0;i<skiplist.length;i++){
        skip(skiplist[i][0],skiplist[i][1])
    }

})();