// ==UserScript==
// @name         打开新文章（商周）
// @version      1.0
// @namespace    http://tampermonkey.net/
// @homepage     https://greasyfork.org/zh-CN/scripts/462889
// @description  在后台打开商业周刊新文章，会自动过滤已打开过的文章。
// @author       aanoggy
// @license      MIT
// @match        http://m.bbwc.cn
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/462889/%E6%89%93%E5%BC%80%E6%96%B0%E6%96%87%E7%AB%A0%EF%BC%88%E5%95%86%E5%91%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/462889/%E6%89%93%E5%BC%80%E6%96%B0%E6%96%87%E7%AB%A0%EF%BC%88%E5%95%86%E5%91%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取所有文章列表
    var list = document.body.innerHTML.match(/https...m.bbwc.cn.article.*?html/g);

    //debugger;
    var key = "BBWC_URL_IDS";
    var keyCache = "BBWC_URL_IDS_CACHE";
    var ids = GM_getValue(key,"");
    var idsCache = GM_getValue(keyCache,"");
    var numRepeat = 0;
    
    // 将新文章先放入CACHE，防止浏览器挂掉，后台打开页面未保存
    for (var i = 0; i < list.length; i++)
    {
        var id = list[i].match(/\d\d\d\d\/\d\d\/\d\d\/\d\d\d\d\d[\d_]+/)[0];
        if (ids.search(id+",") == -1 && idsCache.search(id+",") == -1)
        {
            // 列表逆顺添加，保证列表末尾的先打开
            idsCache = id + "," + idsCache;
        }
        else
        {
            numRepeat++;
        }
    }
    
    // 从CACHE获取并在后台打开页面
    var numOpen = 0;
    var numCache = 0;
    var idList = idsCache.split(",");
    // 清空CACHE，待重新生成
    idsCache = "";  
    for (var j = 0; j < idList.length; j++)
    {
        var id2 = idList[j];
        if (id2 == "")
        {
            continue;
        }
        
        if (numOpen < 50)
        {
            // 50个内正常打开
            var url = "https://m.bbwc.cn/article/" + id2 + ".html";
            GM_openInTab(url, true);
            ids = ids + id2 + ",";
            numOpen++;
        }
        else
        {
            // 写回Cache
            idsCache = idsCache + id2 + ",";
            numCache++;
        }
    }

    GM_setValue(key, ids);
    GM_setValue(keyCache, idsCache);

    alert("打开页面" + numOpen + "个;\n忽略页面" + numRepeat + "个;\n缓存页面" + numCache + "个。");
})();