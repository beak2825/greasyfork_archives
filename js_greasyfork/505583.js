// ==UserScript==
// @name         CSC客户端名称修改
// @namespace    csc_client_name_change
// @version      0.1
// @description  修改在 十字街聊天室 的客户端名称
// @author       cmd1152
// @match        https://crosst.chat/?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crosst.chat
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505583/CSC%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%90%8D%E7%A7%B0%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/505583/CSC%E5%AE%A2%E6%88%B7%E7%AB%AF%E5%90%8D%E7%A7%B0%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

//hook ws
var hookws = window.ws.onopen;
window.ws.onopen = () => {
    //获取储存的客户端名称
    window.oldclientName = localStorage.getItem("clientName");
    //如果他有内容，就认为是之前设置的
    if (window.oldclientName !== null) window.clientName = window.oldclientName;
    //显示客户端名称要求用户编辑
    window.newclientName = window.prompt('你可以在此修改客户端名称（点击取消不修改，用 \n 代表换行，最多64字符）【无名称检测和换行检测】：',window.clientName);
    window.SaveclientName = window.clientName;
    //如果用户编辑了，就使用这个名称，并且替换关键词
    if (window.newclientName !== null) {
        window.SaveclientName = window.newclientName;
        window.clientName = window.newclientName.replace(/十字街/g,"&#21313;&#23383;&#34903;").replace(/官方/g,"&#23448;&#26041;").replace(/\\n/g,"\u2028");
        if (window.clientName.length > 64) alert(`经过绕过，你的client字段超过64字符（${window.clientName.length}，服务器将拒绝显示）`);
    }
    //保存输入的客户端名称
    localStorage.setItem("clientName",window.SaveclientName);
    //执行默认的命令
    hookws();
}