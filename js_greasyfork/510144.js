// ==UserScript==
// @name         ripro 主题网盘粘贴助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  dddd
// @author       kk
// @match        https://www.mfzy8.cn/wp-admin/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mfzy8.cn
// @grant        none
// @require http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/510144/ripro%20%E4%B8%BB%E9%A2%98%E7%BD%91%E7%9B%98%E7%B2%98%E8%B4%B4%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/510144/ripro%20%E4%B8%BB%E9%A2%98%E7%BD%91%E7%9B%98%E7%B2%98%E8%B4%B4%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/*
比如原百度网盘分享地址为：
链接: https://pan.baidu.com/s/1m9Ie2KWQ9aNZlCuiutCzdQ 提取码: crxc
链接: https://pan.baidu.com/s/1BZKYAiTbCmfeXuSFTqYLbg?pwd=4zba 提取码: 4zba 复制这段内容后打开百度网盘手机App，操作更方便哦

粘贴进ripro主题后台资源下载地址栏，脚本会自动新增【解析】按钮，然后点击解析就自动填写到对应的地址和提取
https://www.panziye.com/java/web/6515.html
*/

(function() {
    'use strict';

    $(".csf--remove").after('<a href="javascript:;" id="parseLink" class="button button-secondary">解析</a>');
    $("#parseLink").click(
        function(){
            var $down = $('input[name="_cao_post_options[cao_downurl]"]');
            var url = $down.val();
            var splits = url.split(" ");
            $down.val(splits[1]);
            $('input[name="_cao_post_options[cao_pwd]"]').val(splits[3]);
        }
    );
})();

/*
(function() {
    'use strict';

    $("#git_download_link").after('<a href="javascript:;" id="parseLink" class="button button-secondary">解析</a>');
    $("#parseLink").click(
        function(){
            var dps = $("#git_download_link").val();
            var downs = dps.split("\n");
            var baidu = downs[0];
            var ct = downs[1];
            var cts = ct.split(";")
            $("#git_download_size").val(cts[1]);
            $("#git_download_name").val(cts[0]);
            var ctLink = cts[2]+",城通网盘";
            var baiduLink = baidu.split(" ")[1]+",百度网盘";
            $("#git_download_link").val(baiduLink+"\n"+ctLink);
        }
    );
})();


// ==UserScript==
// @name         城通网盘转短代码
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://home.ctfile.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ctfile.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var myTarget = setInterval(function(){ parse() }, 2000);
    function parse(){
        var content = $("#link_area").val();
        var parsed = content.includes("[ctfile");
        if(!parsed){
            var contents = content.split(": ")
            var filename = contents[0];
            var link = contents[1].split(" ")[0].replace("\n",'');
            var size = '';
            // 根据名称获取大小
            $('.pull-left a').each(function(){
               if($(this).text()==filename) {
                   size = $(this).parent().parent().next().text();
                   return;
               }
            });
            $("#link_area").val(filename+";"+size+";"+link);
        }
    }
})();


*/


