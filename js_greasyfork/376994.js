// ==UserScript==
// @name         Make Zhihu Great Again
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @author       5night
// @require      http://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
// @require      http://cdn.bootcss.com/jquery-noty/2.2.2/packaged/jquery.noty.packaged.js
// @match        https://www.zhihu.com/topic
// @description 在知乎的话题页面加载你关注的主题的最新动态，请使用Tampermonkey安装本插件。
// @downloadURL https://update.greasyfork.org/scripts/376994/Make%20Zhihu%20Great%20Again.user.js
// @updateURL https://update.greasyfork.org/scripts/376994/Make%20Zhihu%20Great%20Again.meta.js
// ==/UserScript==
function log(x)
{
    noty({ text: JSON.parse(JSON.stringify(x)), type: 'information', layout: 'bottomRight', timeout: 3000});
}
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
// https://juejin.im/post/5ad1cab8f265da238a30e137
async function getTopicIds() {
    const result = await $.ajax({
      method: 'GET',
      url: `followed_topics?offset=0&limit=100`
    });
    const ids = result.payload.map(item => item.id);
    return ids;
  }
async function getPage(id){
    const result = await $.ajax({
        method: 'POST',
        url: `node/TopicFeedList`,
        headers: {
            "X-Xsrftoken": getCookie("_xsrf"),
        },
        data: { method: "next", params: "{\"offset\":0,\"topic_id\":" + id+ ",\"feed_type\":\"smart_feed\"}" }
    });
    const page = result.msg.join("");
    return page;
}
async function init(){
    const ids = await getTopicIds();
    const pagePromises = ids.map(id => getPage(id))
    const pages = await Promise.all(pagePromises)
    return pages;
}
function enableExpand(){
    $("body").on("click", (".zh-summary"), function(e) {
//         debugger
        $this = $(this);
        $this.after("<div class=\"feed\">" + $(this).prev().text() + "</div>")
        $this.hide();
        e.preventDefault();
        return false;
    });
}
(function() {
    "use strict";
    log("读取话题中，请稍候")
    init().then( pages => {
        $(".zh-general-list").prepend(pages);
        enableExpand();
        $("h2").css('cssText', 'font-size:16px;');
        $(".zm-topic-list-container").css('cssText', 'font-size:16px;');
        log("载入完成")
    })
})();












