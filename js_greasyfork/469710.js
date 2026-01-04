// ==UserScript==
// @name         火山翻译扩展助手
// @version      0.6
// @author       blankii
// @email        blankii@qq.com
// @description  0.1 使用Esc 隐藏翻译弹窗
// @description  0.2 使用·~键位加入生词本,加快变化延迟
// @description  0.3 添加键位说明，隐藏过程使用渐变动画
// @description  0.4 同时添加到扇贝生词本
// @description  0.5 可以隐藏搜索栏弹窗
// @match        *
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js
// @icon         data:image/png;base64,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
// @include      *
// @exclude      该URL地址不进行执行
// @namespace https://greasyfork.org/users/220272
// @github https://github.com/maicss/chrome-shanbay-v2/blob/master/js/const.js
// @downloadURL https://update.greasyfork.org/scripts/469710/%E7%81%AB%E5%B1%B1%E7%BF%BB%E8%AF%91%E6%89%A9%E5%B1%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/469710/%E7%81%AB%E5%B1%B1%E7%BF%BB%E8%AF%91%E6%89%A9%E5%B1%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
$(document).ready(function() {//dom结构加载完毕再执行js
    console.log("jquery ready");
    var main=function(){
        console.log("火山翻译助手正式启动");
    }
    print()
    setTimeout(function(){ main()},2000)
});
function print(){
    console.log("queencard")
}
$(document).keydown(function (event) {
    if (event.keyCode == 27) {
        setTimeout(function(){
            var dialogView= document.querySelector('volc-translate').shadowRoot.querySelector('section');
            var dialogView2= document.querySelector('volc-translate').shadowRoot.querySelector('.cohiWF');//这个标签，才行
            $(dialogView).fadeOut();
            $(dialogView2).fadeOut();
        },20)
    }
});
$(document).keydown(function (event) {
    if (event.keyCode == 49||event.keyCode ==192) {
        setTimeout(function(){
            document.querySelector('volc-translate').shadowRoot.querySelector('.star').click();
        },20)
        setTimeout(function(){
            var dialogView= document.querySelector('volc-translate').shadowRoot.querySelector('section');
            var dialogView2= document.querySelector('volc-translate').shadowRoot.querySelector('.cohiWF');
            $(dialogView).fadeOut();
            $(dialogView2).fadeOut();
        },20)
    }
});