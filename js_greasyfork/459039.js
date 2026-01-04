// ==UserScript==
// @name         修改网页标题脚本
// @namespace    Glen
// @version      0.2
// @description  语雀、CSDN标题修改
// @author       Glen
// @match        https://www.yuque.com/*
// @match        https://blog.csdn.net/*
// @match        https://www.toutiao.com/*
// @require https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant GM_log
// @license             End-User License Agreement
// @downloadURL https://update.greasyfork.org/scripts/459039/%E4%BF%AE%E6%94%B9%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/459039/%E4%BF%AE%E6%94%B9%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

/*
【标题修改】语雀、CSDN标题修改

【模块化设计可自由的自定义开关功能】
因相关网站页面会随时更新而可能造成的部分功能异常，
若影响到您正常使用相关网站体验，您可删除插件或者关闭插件相应功能
相关功能及代码均来自互联网及网友分享，仅供个人学习自用切勿做商用。

【2023.1.29新增】新增头条内容屏蔽

2023.1.29
新增头条内容屏蔽

   */

(function() {
    'use strict';

    // Your code here...
    window.onload = f;
    function f() {
        let hostname=location.hostname;
        let title=document.title;
        if(location.hostname == "www.yuque.com"){
         GM_log("当前是语雀:",hostname)
            document.title = title.replace("语雀","")
        }
        else if(location.hostname == "blog.csdn.net"){
            GM_log("当前是CSDN:",hostname)
           let infoNum=title.match(/消息\).*?的博客/g)
           let v2 = infoNum[0].replace("消息)", '')
           let v3 = v2.match(/_.*?的博客/g)
           let v4 = v2.replace(v3[0], "")
          document.title = v4
        }
        // 屏蔽今日头条相关内容
        else if(location.hostname == "www.toutiao.com"){
            GM_log("当前是今日头条:"+hostname);
            // 屏蔽上侧
            $("div[class='ttp-sticky-container']").hide();
            // 屏蔽左侧
            $("div[class='left-sidebar']").hide();
            // 屏蔽右侧
            $("div[class='right-sidebar']").hide();
            // 屏蔽推荐
            $("div[class='detail-end-feed']").hide();
        }

    }

})();