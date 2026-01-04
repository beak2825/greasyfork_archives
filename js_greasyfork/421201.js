// ==UserScript==
// @name         Fang's MCBBS Style
// @namespace    https://fang.blog.miri.site
// @version      0.1
// @description  为指定帖子添加样式
// @author       Mr_Fang
// @match        https://www.mcbbs.net/forum.php?mod=viewthread&tid=*
// @match        https://www.mcbbs.net/thread-*-1-1.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421201/Fang%27s%20MCBBS%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/421201/Fang%27s%20MCBBS%20Style.meta.js
// ==/UserScript==

(function() {
    var config = jq('.t_f:first font:last').text()
    config = config.split(';\n#');
    var status = config[0].replace(/\s/g,"").split('=')[1];

    if(status != "Enable"){
        console.log("FMS> %cFMS未添加任何样式：楼主设置该贴禁用FMS或代码块不存在", "font-weight:bold;color:red;");
        return false;
    }

    var stlye = config[1].split('=')[1].trim();
    jq("head").append('<style id="FMS">'+stlye+'</style>');
})();