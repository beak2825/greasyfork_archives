// ==UserScript==
// @name         HDC Selector
// @name         HDC检查器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatic add eligible torrents to rsscart. You must have a HDChina account first.
// @description  Visit https://hdchina.org/torrents.php and leave the page alone, it will be refreshed every 5 minutes to check torrents.
// @description  You can change the condicions max_size, max_seed and refresh below.
// @description  自动添加符合条件的种子到下载框。你必须先有一个HDChina的账号。
// @description  打开https://hdchina.org/torrents.php页面，窗口会每5分钟自动刷新检查是否有符合条件的种子。
// @description  你可以修改下方的添加条件max_size（最大尺寸）、max_seed（当前做种数）和refresh（刷新间隔）。
// @author       Garydz
// @match        https://hdchina.org/torrents.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376608/HDC%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/376608/HDC%20Selector.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var max_size = 10; //  only automatic add torrents < 10 GB
    var max_seed = 4;  //  and current seeders < 4
    var refresh = 5;   //  every 5 minutes
    function find_pnode(o){
        var pn = o;
        do{
            pn = pn.parentNode;
        }while(pn.className != 't_name');
        return pn;
    }
    function find_sibling(o, cls_name){
        var sn = o;
        do{
            sn = sn.nextSibling;
        }while(sn.className != cls_name);
        return sn;
    }
    function check_torrents(arr){
        var l = arr.length;
        for(var i=0;i<l;i++){
            var t = find_pnode(arr[i]);
            var bm = t.getElementsByClassName('delbookmark_rss');
            if(bm.length > 0){
                var t_size = find_sibling(t, 't_size').innerText;
                if((t_size.indexOf('MB')>0) || (t_size.indexOf('GB') && (parseInt(t_size) < max_size))){
                    var t_torrents = parseInt(find_sibling(t, 't_torrents').innerText);
                    if(t_torrents < max_seed){
                        bm[0].parentNode.click();
                    }
                }
            }
        }
    }
    var freebies = document.getElementsByClassName('pro_free');
    check_torrents(freebies);
    setTimeout("window.location.reload()", refresh*60000);
})();