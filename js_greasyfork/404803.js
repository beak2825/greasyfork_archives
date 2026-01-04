// ==UserScript==
// @name         PT Copy Seed Info
// @version      0.2
// @description  复制PT详情页的信息便于转载，简介部分自动转为 BBCode 格式，可以点击标题、副标题、详情部分进行复制，目前支持 HDHome、PTHome、南洋、柠檬、杜比、烧包、BTSchool
// @author       zhangnew
// @namespace    https://zhangnew.com/
// @homepage     https://zhangnew.com/
// @match        https://www.pthome.net/details.php?id=*
// @match        https://pt.btschool.club/details.php?id=*
// @match        https://hdhome.org/details.php?id=*
// @match        https://nanyangpt.com/details.php?id=*
// @match        https://leaguehd.com/details.php?id=*
// @match        https://www.hddolby.com/details.php?id=*
// @match        https://ptsbao.club/details.php?id=*

// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/toastr@2.1.4/toastr.min.js
// @resource toastr_css https://cdn.jsdelivr.net/npm/toastr@2.1.4/build/toastr.min.css

// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_notification
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/404803/PT%20Copy%20Seed%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/404803/PT%20Copy%20Seed%20Info.meta.js
// ==/UserScript==

GM_addStyle(GM_getResourceText('toastr_css'));
toastr.options.timeOut = 5000;

(function() {
    'use strict';

    var kdescr_origin = document.getElementById('kdescr');
    var kdescr = kdescr_origin.cloneNode(true);
    // 去掉声明部分
    var sm = kdescr.getElementsByTagName('div')[0];
    if(sm && sm.id === 'ad_torrentdetail'){
        kdescr.removeChild(sm);
    }
    if(window.location.host.indexOf('nanyangpt') > -1){
        kdescr.removeChild(kdescr.getElementsByTagName('fieldset')[0]);
    }
    if(window.location.host.indexOf('leaguehd') > -1){
        var b = kdescr.getElementsByTagName('b');
        kdescr.removeChild(b[b.length-1]);
    }
    if(window.location.host.indexOf('ptsbao') > -1){
        var fieldset = kdescr.getElementsByTagName('fieldset');
        kdescr.removeChild(fieldset[fieldset.length-1]);
        kdescr.removeChild(fieldset[fieldset.length-1]);
    }

    var BBCode = htmlToBBCode(kdescr.innerHTML);
    addCopyFun(kdescr_origin, '简介', BBCode);

    var title = document.getElementById('top');
    var title_content = title.innerHTML.split('&nbsp;')[0];
    addCopyFun(title, '标题', title_content);

    var title_2 = document.getElementsByClassName('rowfollow')[1];
    if(window.location.host.indexOf('ptsbao') > -1){
        title_2 = document.getElementsByClassName('rowfollow')[2];
    }
    var title_2_content = title_2.innerText;
    addCopyFun(title_2, '副标题', title_2_content);

    toastr.success('PT Copy Seed Info 已激活.');

    function addCopyFun(el, type, content) {
        el.addEventListener('click',(event) => {
            //toastr.info(event.target.id);
            GM_setClipboard(content);
            toastr.success(type + "：复制成功");
        });
    };

    function htmlToBBCode(html) {
        html = html.replace(/<pre(.*?)>(.*?)<\/pre>/gmi, "[code]$2[/code]");

        html = html.replace(/<h[1-7](.*?)>(.*?)<\/h[1-7]>/, "\n[h]$2[/h]\n");

        html = html.replace(/<br(.*?)>/gi, "\n");
        html = html.replace(/<textarea(.*?)>(.*?)<\/textarea>/gmi, "\[code]$2\[\/code]");
        html = html.replace(/<b>/gi, "[b]");
        html = html.replace(/<i>/gi, "[i]");
        html = html.replace(/<u>/gi, "[u]");
        html = html.replace(/<\/b>/gi, "[/b]");
        html = html.replace(/<\/i>/gi, "[/i]");
        html = html.replace(/<\/u>/gi, "[/u]");
        html = html.replace(/<em>/gi, "[b]");
        html = html.replace(/<\/em>/gi, "[/b]");

        html = html.replace(/<legend>(.*?)<\/legend>/gmi, ""); //删除"引用"两个字
        html = html.replace(/<fieldset>/gi, "[quote]"); //处理引用
        html = html.replace(/<\/fieldset>/gi, "[/quote]");

        html = html.replace(/<strong>/gi, "[b]");
        html = html.replace(/<\/strong>/gi, "[/b]");
        html = html.replace(/<cite>/gi, "[i]");
        html = html.replace(/<\/cite>/gi, "[/i]");
        html = html.replace(/<font color="(.*?)">(.*?)<\/font>/gmi, "[color=$1]$2[/color]");
        html = html.replace(/<font color=(.*?)>(.*?)<\/font>/gmi, "[color=$1]$2[/color]");
        html = html.replace(/<link(.*?)>/gi, "");
        html = html.replace(/<li(.*?)>(.*?)<\/li>/gi, "[*]$2");
        html = html.replace(/<ul(.*?)>/gi, "[list]");
        html = html.replace(/<\/ul>/gi, "[/list]");
        html = html.replace(/<div>/gi, "\n");
        html = html.replace(/<\/div>/gi, "\n");
        html = html.replace(/<td(.*?)>/gi, " ");
        html = html.replace(/<tr(.*?)>/gi, "\n");

        html = html.replace(/<img(.*?)src="(.*?)"(.*?)>/gi, "[img]$2[/img]");
        html = html.replace(/<a(.*?)href="(.*?)"(.*?)>(.*?)<\/a>/gi, "[url=$2]$4[/url]");

        html = html.replace(/<head>(.*?)<\/head>/gmi, "");
        html = html.replace(/<object>(.*?)<\/object>/gmi, "");
        html = html.replace(/<script(.*?)>(.*?)<\/script>/gmi, "");
        html = html.replace(/<style(.*?)>(.*?)<\/style>/gmi, "");
        html = html.replace(/<title>(.*?)<\/title>/gmi, "");
        html = html.replace(/<!--(.*?)-->/gmi, "\n");

        html = html.replace(/\/\//gi, "/");
        html = html.replace(/http:\//gi, "http://");
        html = html.replace(/https:\//gi, "https://");

        html = html.replace(/<(?:[^>'"]*|(['"]).*?\1)*>/gmi, "");
        html = html.replace(/\r\r/gi, "");
        html = html.replace(/\[img]\//gi, "[img]");
        html = html.replace(/\[url=\//gi, "[url=");

        html = html.replace(/(\S)\n/gi, "$1 ");

        html = html.replace(/\s&nbsp;/gi, " "); //处理简介里面的 IMDb 链接

        return html;
    };
})();