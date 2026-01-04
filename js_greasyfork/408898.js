// ==UserScript==
// @name         百度主页背景切换并且去掉推荐广告
// @namespace    https://steamcommunity.com/id/dadadayezi/
// @version      0.1.5
// @description  默认替换背景是可可萝，为了美观顺带干掉了首页的新闻推荐
// @author       ChangMenC
// @match        *://www.baidu.com
// @grant        none
// @include      *://www.baidu.com
// @downloadURL https://update.greasyfork.org/scripts/408898/%E7%99%BE%E5%BA%A6%E4%B8%BB%E9%A1%B5%E8%83%8C%E6%99%AF%E5%88%87%E6%8D%A2%E5%B9%B6%E4%B8%94%E5%8E%BB%E6%8E%89%E6%8E%A8%E8%8D%90%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/408898/%E7%99%BE%E5%BA%A6%E4%B8%BB%E9%A1%B5%E8%83%8C%E6%99%AF%E5%88%87%E6%8D%A2%E5%B9%B6%E4%B8%94%E5%8E%BB%E6%8E%89%E6%8E%A8%E8%8D%90%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
//添加背景div
$("#wrapper").before("<div class='s-skin-container s-isindex-wrap' style='background-image: url(\"http://r.photo.store.qq.com/psc?/V12ZyMgi0V4ZjH/TmEUgtj9EK6.7V8ajmQrEPy2g9KgDO8pULR7mjTEwO6aZbeEs9nm0o49zZiJfpOPzuuieO6ByOLaKwm1*J6K*3BJ6yOMxGAm*JuiVbHKZnc!/r\");'></div>");
//$("#wrapper").before("<div class='s-skin-container s-isindex-wrap' style='background-image: url(\"复制好的图片网址放在上面对应的这个位置注意在符号 \");width:1920px;height:1080px;'></div>");
//根据有朋友反馈自己做了一个背景，但是背景是根据当前窗口自适应所以导致有的图片会因为窗口大小造成缩放位移，所以在URL路径后面加上两个固定宽高的属性就可以解决分别是    ;width:1920px;height:1080px;       ,上面注释有位置参考↑
//获取到推荐新闻div的对象
var thisNode=document.getElementById("s_wrap");
//删除该div
thisNode.parentElement.removeChild(thisNode);
//删除左上角导航栏的hao123
$(function() {
    $("a").each(function() {
        $(this).text() === "hao123" && $(this).remove();
    });
});
})();