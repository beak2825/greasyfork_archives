// ==UserScript==
// @name         广东省专技网继续教育平台学习辅助工具
// @namespace    https://greasyfork.org
// @version      0.3
// @description  自动视频学习
// @author       midpoint
// @match        *://ggfw.gdhrss.gov.cn/zxpx/auc/play/player?*
// @run-at document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382999/%E5%B9%BF%E4%B8%9C%E7%9C%81%E4%B8%93%E6%8A%80%E7%BD%91%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/382999/%E5%B9%BF%E4%B8%9C%E7%9C%81%E4%B8%93%E6%8A%80%E7%BD%91%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
function geturls(urls){
    var url=$('.content-learning,.content-unstart').each(function () {
        var str;
        str=$(this).parent().attr('href');
        str=str.match(/\('(.+)'\)/);
        if(str!=null) 
        {urls.push('http://'+document.domain+str[1]);}
        else
        {urls.push(location.href);}
    });
    console.log('urls length:'+urls.length);
}

function start() {
    console.log('稍等，准备一下，几秒钟后开始学习……');
    if(typeof tm1!=="undefined") {    clearInterval(tm1); };
    if(typeof tm2!=="undefined") {    clearTimeout(tm2);  };
		var urls=[];
    geturls(urls);

    var count=0;
    var unfinish=false;
    var str='';
    if (window.top == window.self) {
        frm='<frameset cols=\'*\'>\n<frame id=\'gx\' name=\'gx\' src=\''+location.href+'\'/>';
        frm+='</frameset>';
        with(document) {
            write(frm);
            void(close());
        }
    }
    var ifr=window.frames['gx'];
    // var doc=ifr.document;
    var doc=window.frames['gx'].document;
    var tm1=setInterval(function() {
    		str=$(doc).find('.learnpercent').text();
        if(str.indexOf('完成')>0) {
            unfinish=false;
            count++;
        }
        $(doc).find('.prism-big-play-btn pause').click();
        if(unfinish || count>urls.length) return;

        unfinish=true;
        console.log('count:'+count);
        console.log('urls[count]:'+urls[count]);
        $(doc).find('#gx').src=urls[count];
        document.getElementById("gx").src=urls[count];
        if(typeof tm2!=="undefined") {    clearTimeout(tm2);  }
        var tm2=setTimeout(function() {
            //doc=ifr.document;
            doc=window.frames['gx'].document;
            $(doc).find('.prism-big-play-btn').click();
            $(doc).find('.prism-button prism-button-retry').click();
            ifr.getTimu=function(index) {
                return false;
            }
        }, 2000);
    }, 3000);
    return '祝大家快乐学习！健康生活！';
}
start();