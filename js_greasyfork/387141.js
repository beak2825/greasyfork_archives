// ==UserScript==
// @name         HacPai摸鱼小助手
// @namespace    https://github.com/AdlerED
// @version      1.0.0
var version = "1.0.0";
// @description  https://hacpai.com/cr 摸鱼小助手，伪装成学♂习网站
// @author       Adler
// @connect      hacpai.com/cr
// @include      https://hacpai.com/cr*
// @require      https://code.jquery.com/jquery-1.11.0.min.js
// @note         19-07-04 1.0.0 初版发布，快来和我一起摸鱼吧！
// @downloadURL https://update.greasyfork.org/scripts/387141/HacPai%E6%91%B8%E9%B1%BC%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/387141/HacPai%E6%91%B8%E9%B1%BC%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    //修改标题
    document.getElementsByTagName("title")[0].innerText = 'Python 高级教程 | 菜鸟教程';

    //修改图标
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'https://static.runoob.com/images/favicon.ico';
    document.getElementsByTagName('head')[0].appendChild(link);

    //导入主css样式
    $("head").append("<link>");
    var fakeCss = $("head").children(":last");
    fakeCss.attr({
        rel: "stylesheet",
        type: "text/css",
        href:  "https://www.runoob.com/wp-content/themes/runoob/style.css?v=1.153"
    });

    //添加假标题栏
    $(".nav").after('<div class="container logo-search"><div class="col search row-search-mobile"><form action="index.php"><input class="placeholder" placeholder="搜索……" name="s" autocomplete="off"></form></div><div class="row"><div class="col logo"><h1><a href="/">菜鸟教程 -- 学的不仅是技术，更是梦想！</a></h1></div><div class="col right-list"><button class="btn btn-responsive-nav btn-inverse" data-toggle="collapse" data-target=".nav-main-collapse" id="pull" style=""><i class="fa fa-navicon"></i></button></div><div class="col search search-desktop last"><form action="//www.runoob.com/" target="_blank"><input class="placeholder" id="s" name="s" placeholder="搜索……" autocomplete="off"></form></div></div></div>');
    //删除真标题栏
    $(".nav").remove();
    //延时添加选项栏
    $('.logo-search').after('<div class="container navigation"><div class="row"><div class="col nav" style=""><ul class="pc-nav"><li><a href="//www.runoob.com/">首页</a></li><li><a href="/html/html-tutorial.html">HTML</a></li><li><a href="/css/css-tutorial.html">CSS</a></li><li><a href="/js/js-tutorial.html">JavaScript</a></li><li><a href="/jquery/jquery-tutorial.html">jQuery</a></li><li><a href="/bootstrap/bootstrap-tutorial.html">Bootstrap</a></li><li><a href="/sql/sql-tutorial.html">SQL</a></li><li><a href="/mysql/mysql-tutorial.html">MySQL</a></li><li><a href="/php/php-tutorial.html">PHP</a></li><li><a href="/python/python-tutorial.html">Python2</a></li><li><a href="/python3/python3-tutorial.html">Python3</a></li><li><a href="/cprogramming/c-tutorial.html">C</a></li><li><a href="/cplusplus/cpp-tutorial.html">C++</a></li><li><a href="/java/java-tutorial.html">Java</a></li><li><a href="/browser-history">本地书签</a></li></ul><ul class="mobile-nav"><li><a href="//www.runoob.com/">首页</a></li><li><a href="/html/html-tutorial.html">HTML</a></li><li><a href="/css/css-tutorial.html">CSS</a></li><li><a href="/js/js-tutorial.html">JS</a></li><li><a href="/browser-history">本地书签</a></li><a href="javascript:void(0)"class="search-reveal">Search</a></ul></div></div></div>');
    $(".nav").attr("style","font-size:2px;margin-bottom:10px;background-color:#96b97d;");
    //删除底色
    $("body").css({"background":"none"});

    //导入评论css样式
    $("head").append("<link>");
    var commentFakeCss = $("head").children(":last");
    commentFakeCss.attr({
        rel: "stylesheet",
        type: "text/css",
        href:  "https://www.runoob.com/wp-content/themes/runoob/assets/css/qa.css?1.42"
    });
    //导入FontAwesome
    $("head").append("<link>");
    var FACss = $("head").children(":last");
    FACss.attr({
        rel: "stylesheet",
        type: "text/css",
        href:  "https://cdn.staticfile.org/font-awesome/4.7.0/css/font-awesome.min.css"
    });

    //假评论头
    $(".content").prepend('<div class="title" id="comments">	<h2 class=""><div class="altblock">				<i style="font-size:28px;margin-top: 8px;" class="fa fa-plus-square" aria-hidden="true"></i>		</div><span class="mw-headline" id="qa_headline">255  篇笔记</span>	<span class="mw-headline" id="user_add_note" style="float:right;line-height: 62px;padding-right: 14px;"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>  写笔记</span></h2></div><br><br>');

    //设置页脚
    $("footer").html('<div class="runoob-block"><div class="runoob cf"><dl><dt>       在线实例</dt><dd>       ·<a target="_blank" href="/html/html-examples.html">HTML 实例</a></dd><dd>       ·<a target="_blank" href="/css/css-examples.html">CSS 实例</a></dd><dd>       ·<a target="_blank" href="/js/js-examples.html">JavaScript 实例</a></dd><dd>       ·<a target="_blank" href="/ajx/ajax-examples.html">Ajax 实例</a></dd><dd>       ·<a target="_blank" href="/jquery/jquery-examples.html">jQuery 实例</a></dd><dd>       ·<a target="_blank" href="/xml/xml-examples.html">XML 实例</a></dd><dd>       ·<a target="_blank" href="/java/java-examples.html">Java 实例</a></dd></dl><dl><dt>      字符集&amp;工具</dt><dd>       ·<a target="_blank" href="/charsets/html-charsets.html">HTML 字符集设置</a></dd><dd>       ·<a target="_blank" href="/tags/html-ascii.html">HTML ASCII 字符集</a></dd><dd>       ·<a target="_blank" href="/tags/ref-entities.html">HTML ISO-8859-1</a></dd><dd>       ·<a target="_blank" href="/tags/html-symbols.html">HTML 实体符号</a></dd><dd>       ·<a target="_blank" href="/tags/html-colorpicker.html">HTML 拾色器</a></dd><dd>       ·<a target="_blank" href="//c.runoob.com/front-end/53">JSON 格式化工具</a></dd></dl><dl><dt>       最新更新</dt><dd>       ·<a href="http://www.runoob.com/w3cnote/c-time-func-summary.html" title="C 语言中的 time 函数总结">C 语言中的 time...</a></dd><dd>       ·<a href="http://www.runoob.com/php/php-imagecreate.html" title="PHP imagecreate – 新建一个基于调色板的图像">PHP imagecreate...</a></dd><dd>       ·<a href="http://www.runoob.com/postgresql/postgresql-functions.html" title="PostgreSQL  常用函数">PostgreSQL  常...</a></dd><dd>       ·<a href="http://www.runoob.com/postgresql/postgresql-datetime.html" title="PostgreSQL 时间/日期函数和操作符">PostgreSQL 时间...</a></dd><dd>       ·<a href="http://www.runoob.com/postgresql/postgresql-privileges.html" title="PostgreSQL PRIVILEGES（权限）">PostgreSQL PRIV...</a></dd><dd>       ·<a href="http://www.runoob.com/postgresql/postgresql-autoincrement.html" title="PostgreSQL AUTO INCREMENT（自动增长）">PostgreSQL AUTO...</a></dd><dd>       ·<a href="http://www.runoob.com/postgresql/postgresql-sub-queries.html" title="PostgreSQL 子查询">PostgreSQL 子查询</a></dd></dl><dl><dt>       站点信息</dt><dd>       ·<a target="_blank" href="//mail.qq.com/cgi-bin/qm_share?t=qm_mailme&amp;email=ssbDyoOAgfLU3crf09venNHd3w" rel="external nofollow">意见反馈</a></dd><dd>       ·<a class="wxpopup" onclick="popFunction()">合作联系<span class="popuptext" id="myPopup">微信(注明来意)：<strong>centos5</strong></span></a></dd><dd>       ·<a target="_blank" href="/disclaimer">免责声明</a></dd><dd>       ·<a target="_blank" href="/aboutus">关于我们</a></dd><dd>       ·<a target="_blank" href="/archives">文章归档</a></dd></dl><div class="search-share"><div class="app-download"><div><strong>关注微信</strong></div></div><div class="share"><img width="128" height="128" src="https://www.runoob.com/wp-content/themes/runoob/assets/images/qrcode.png"></div></div></div></div><div class="w-1000 copyright">     Copyright © 2013-2019<strong><a href="//www.runoob.com/" target="_blank">菜鸟教程</a></strong>&nbsp;<strong><a href="//www.runoob.com/" target="_blank">runoob.com</a></strong> All Rights Reserved. 备案号：闽ICP备15012807号-1</div>');
    $("footer").attr('id', 'footer');
    $("footer").attr('class', 'mar-t50');

    //修改清风明月四个字
    $("#breezemoonInput").attr("placeholder", "查找更多教程");
    $("#breezemoonPostBtn").text("搜索");
})();