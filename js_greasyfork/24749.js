// ==UserScript==
// @name         飞机汉化
// @version      0.1
// @description  直接读取图片，不加载播放器
// @author       FeiLong
// @match        http://smp.yoedge.com/*
// @match        http://smp1.yoedge.com/*
// @grant        none
// @namespace https://greasyfork.org/users/28687
// @downloadURL https://update.greasyfork.org/scripts/24749/%E9%A3%9E%E6%9C%BA%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/24749/%E9%A3%9E%E6%9C%BA%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function get(url)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", url, false );
        xmlHttp.send( null );

        return xmlHttp.responseText;
    }
    
    //console.log(get("smp_cfg.json"));
    var jsoncode = get("smp_cfg.json");
    var json = eval('(' + jsoncode + ')');
    

    
    document.body.innerHTML = "";
    //$.each(json.pages.page,function (i,v){console.log(v);document.body.innerHTML = document.body.innerHTML + '<img width=100% src="' + v + '">';});
    //$.each(json.pages.page,function (i,v){pic[i] = v;});
    
    var pic=[];
    $.each(json.pages.page, function(key, val) { pic[pic.length] = key;  });
    pic.sort();
    $.each(pic, function(i, key) {
        console.log("key = " + json.pages.page[key]); // 访问JSON对象属性
        document.body.innerHTML = document.body.innerHTML + '<img width=100% src="' + json.pages.page[key] + '">';
    });
    
    
    /*
    // Your code here...
    function isExitsVariable(variableName) {
    try {
        if (typeof(variableName) == "undefined") {
            //alert("value is undefined"); 
            return false;
        } else {
            //alert("value is true"); 
            return true;
        }
    } catch(e) {}
    return false;
}
    if(isExitsVariable(smp))
        {document.body.innerHTML = "";for (pagename in smp.loader.pageNames){console.log(smp.controller.pages[smp.loader.pageNames[pagename]]);document.body.innerHTML = document.body.innerHTML + '<img width=100% src="' + smp.controller.pages[smp.loader.pageNames[pagename]] + '">';};}
    else
        {console.log("not in comic page");}
        */
})();