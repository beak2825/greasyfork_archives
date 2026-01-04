// ==UserScript==
// @name               narrow img
// @name:zh-CN         缩小网页图片
// @namespace          daizp
// @version            0.2.0
// @description        缩小网页图片，上班摸鱼专用
// @description:zh-cn  缩小网页图片，上班摸鱼专用
// @author             daizp
// @include            *
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/420165/narrow%20img.user.js
// @updateURL https://update.greasyfork.org/scripts/420165/narrow%20img.meta.js
// ==/UserScript==

(function () {
    narrow_img();
    //页面加载完成缩小全部图片
    function narrow_img(){
        var pic = document.getElementsByTagName('img');
        for(var i=0;i<pic.length;i++){
            pic[i].setAttribute('style', 'max-height: 100px; max-width: 200px;');
            //添加鼠标经过事件
            pic[i].setAttribute("onmouseOver","big_img(this)");
            pic[i].setAttribute("onmouseOut","small_img(this)");
        }
    }
    //if(e.getAttribute("style") != null && e.getAttribute("style").indexOf("max-height") > -1) {
    //    e.removeAttribute("style");
    //}
var scriptText=`
//鼠标移入放大图片
function big_img(e){
    e.removeAttribute("style");
}
//鼠标移出缩小图片
function small_img(e){
    e.setAttribute('style', 'max-height: 100px; max-width: 200px;');
}
`;
    //感谢 https://cloud.tencent.com/developer/ask/217625 提供解决方法
    //使用此方法解决 Uncaught ReferenceError 错误
    var newScript = document.createElement("script");
    var inlineScript = document.createTextNode(scriptText);
    newScript.appendChild(inlineScript);
    document.body.appendChild(newScript);
})();