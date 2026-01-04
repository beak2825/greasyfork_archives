// ==UserScript==
// @name         CLsq
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  try to take over the world!
// @author       Febare
// @include      *://cl.*.xyz/*.html
// @run-at       document-end
// @grant        none
// @date         2021/02/21-v0.1.1 适配漫画类型
// @date         2021/02/21-v0.1.2 删除无用内容，删除下载按钮，自动复制种子编码
// @downloadURL https://update.greasyfork.org/scripts/408082/CLsq.user.js
// @updateURL https://update.greasyfork.org/scripts/408082/CLsq.meta.js
// ==/UserScript==

(function() {
    try{
        // 删除无用链接
        var f24 = document.querySelectorAll('.f24');
        for(var j = 0;j < f24.length;j++){
            f24[j].remove();
        }
//        var f16 = document.querySelectorAll('.f16');
//        for(j = 0;j < f16.length;j++){
//            f16[j].remove();
//        }
        var f18 = document.querySelectorAll('.f18');
        for(j = 0;j < f18.length;j++){
            f18[j].remove();
        }
        var f14 = document.querySelectorAll('.f14');
        for(j = 0;j < f14.length;j++){
            f14[j].remove();
        }
        var review = document.querySelectorAll(".t.t2");
        for(j = 1;j < review.length;j++){
            review[j].remove();
        }


        // 删除左侧栏
        document.querySelector('.tr1.do_not_catch>th').remove();

        // 删除无用内容
        document.querySelector("#footer").remove();
        document.querySelector("#main > form").remove();
        document.querySelector("#header > div.h.guide").remove();
        document.querySelector("#main > .t table").remove();
        $('.t3').remove();
        $('.tiptop').remove();

        // 隐藏赞
        $('.t_like').hide();

        // 删除其他第三方内容
        var quote = document.querySelectorAll('.quote');
        for(let j = 0;j < quote.length;j++){
            quote[j].remove();
        }
        var blockquote = document.querySelectorAll('blockquote');
        for(let j = 0;j < blockquote.length;j++){
            blockquote[j].remove();
        }
    }catch(e){}

    // 隐藏无用标签
    $('a').hide();
    $('h4').hide();

    // 删除无用换行
    var body = document.body;
    body.innerHTML = body.innerHTML
        .replaceAll('&nbsp;','')
        .replace('下載地址:','')
        .replace('【下载地址】','')
        .replace('===','')
        .replaceAll(/(<br>)+/g,'<br>')
        .replaceAll(/(<b><\/b>)/g,'');

    var content = document.querySelector('.tpc_content.do_not_catch');

    var contentText = content.innerText;

    var notFound = true;

    var keyword = ['【影片名称】','【影片名稱】','品番','【MP4/','FHD/','年齢 :','HD ','SD/','【漫畫名字】'];

    for(var i in keyword){

        var key = keyword[i];

        console.error('关键词：'+ key + ' - ' + content.innerHTML.search(key));
        // 插入特定标签做标记，用于滑动
        if(contentText.search(key) != -1) {
            content.innerHTML = content.innerHTML.replace(key,'<a id="main_body"></a>' + key);
            notFound = false;
            break;
        }
    }

    if(notFound){
        // 未找到关键词
        return;
    }

    // 判断是否存在【影片名称】或【影片名稱】
    if(content.innerHTML.indexOf(keyword[0])!=-1 || content.innerHTML.indexOf(keyword[1])!=-1){
        // 移除无用内容
        var start = content.innerHTML.indexOf('<a id="main_body"></a>');
        if(start != -1){
            content.innerHTML = content.innerHTML.substring(start, content.innerHTML.length);
        }
    }

    var mainBody = $('#main_body').offset().top;

    // 滑到指定标签位置
    $('html,body').animate({scrollTop:mainBody},200);

    // 改进下载体验
    var insertIndex = content.innerHTML.indexOf('http://www.rmdown.com/link.php?hash=212');

    if(insertIndex!=-1) {
        var code = content.innerHTML.substring(insertIndex + 39, insertIndex + 79);

        console.error('种子码：'+ code);

        copyToClip(code);
    }
})();

// 复制内容到粘贴板
function copyToClip(content) {
    var aux = document.createElement("input");
    aux.setAttribute("value", content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
}