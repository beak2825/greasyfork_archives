// ==UserScript==
// @name         QQ邮箱文件中转站分享(改良版)
// @namespace    http://dtoo.ml
// @version      0.3
// @description  在QQ邮箱的文件中转站中显示文件分享按钮
// @author       Kytrun
// @match        https://mail.qq.com/cgi-bin/frame_html*
// @require      https://cdn.jsdelivr.net/gh/mythz/jquip/dist/jquip.all.min.js
// @downloadURL https://update.greasyfork.org/scripts/402761/QQ%E9%82%AE%E7%AE%B1%E6%96%87%E4%BB%B6%E4%B8%AD%E8%BD%AC%E7%AB%99%E5%88%86%E4%BA%AB%28%E6%94%B9%E8%89%AF%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/402761/QQ%E9%82%AE%E7%AE%B1%E6%96%87%E4%BB%B6%E4%B8%AD%E8%BD%AC%E7%AB%99%E5%88%86%E4%BA%AB%28%E6%94%B9%E8%89%AF%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var $=window.$;
    $(function () {
        var iframe = $('iframe[allowfullscreen]')[0];
        var getPrm = function (url, par) {
            var urlsearch = url.split('?');
            var pstr = urlsearch[1].split('&');
            for (var i = pstr.length - 1; i >= 0; i--) {
                var tep = pstr[i].split("=");
                if (tep[0] == par) {
                    return tep[1];
                }
            }
            return (false);
        };
        var fileBtnText = '文件中转站';
        var fileBtn;
        $("a").each(function () {
            if ($(this).text().match(fileBtnText)) {
                fileBtn = this;
            }
        });
        
        $(fileBtn).click(function () {
            setTimeout(function () {
                var iframeDocument=iframe.contentWindow.document;
                var downloadBtns = $(iframeDocument).find('a.download');
                $(downloadBtns).each(function () {
                    var li = $(this).parent();
                    var k = getPrm(this.href, 'k');
                    var code = getPrm(this.href, 'code');
                    var link = 'https://iwx.mail.qq.com/ftn/download?func=3&key='+k+'&code='+code+'&k='+k;
                    var link2 ='https://iwx.mail.qq.com/ftn/download?func=4&key='+k+'&code='+code+'&k='+k;
                    console.log(link2);
                    var shareBtn = '<a class="ft_i_action send" target="_blank" href="' + link + '" hidefocus><b style="margin: 5px;">↪</b>分享</a>';
                    var downBtn = "<a onclick='prompt(&quot;下面是直链，直接复制即可&quot;,&quot;"+link2+"&quot;)'><b style='margin: 5px;'>↪</b>直链</a>";
                    li.append(shareBtn);
                    li.append(downBtn);
                });
            }, 3000);
        });
      $().click(function(){
        
      });
    });
})();
