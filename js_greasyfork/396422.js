// ==UserScript==
// @name 			Custom Ajax Download
// @description		自定义 Ajax 加载下载地址，免跳转下载文件。该脚本需要自行定制规则，非通用脚本。
// @author			极品小猫
// @version			1.0.0.2
// @namespace   	29483_CustomAjaxDownload
// @homepage		https://greasyfork.org/scripts/29483
// @supportURL		https://greasyfork.org/scripts/29483/feedback
// @icon			https://cdn.portablesoft.org/favicon.ico
// @include         https://www.fcnes.com/*
// @require			http://code.jquery.com/jquery-2.1.4.min.js
// @license     	GPL version 3
// @run-at			document-idle
// @grant			GM_addStyle
// @grant       	GM_xmlhttpRequest
// @grant           GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/396422/Custom%20Ajax%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/396422/Custom%20Ajax%20Download.meta.js
// ==/UserScript==

let webHost=location.host,
    webUrl=location.href,
    webDomain=webHost.replace(/^www\./i,''),
    HostRule={
        'fcnes.com': {
            include : /\/\w+\/\w+\/\d+.html/,
            rule : function(){
                let insertTarget = '.downcon, .yd', //获取到的下载地址插入到该目标
                    ajaxUrl = $('[href*="plus/download.php"]').attr('href'), //固定的Ajax地址
                    DownAjax = function(doc){ //Ajax成功后执行的操作
                        let GameTitle = $('.info_tit>h1').text(),
                            GameName = $('.info_tit>b').text(),
                            downloadObj=$(doc).find('[href*="plus/download.php"]');

                        downloadObj.each(function(e){
                            //var Info=$(this).text();
                            //let DownloadInfo=GameTitle+($(this).text()!=='本地下载'?" "+$(this).text():''); //对复制的游戏名标题添加版本信息
                            $(this).click(function(){
                                GM_setClipboard(GameTitle (GameName?+ " - " + GameName:""));
                            });
                            $(rule['insertTarget']).append($(this).attr({'download': GameTitle, 'title': GameTitle, 'target':'_blank'}));
                        });

                    }
                /*
            ajaxUrlArr : function(){
                $('[href*="plus/download.php"]').attr('href');
            }
            */
                var rule={'insertTarget': insertTarget, 'ajaxUrl':ajaxUrl, 'DownAjax': DownAjax};
                return rule;
            }
        }
    }

if(HostRule[webDomain]) {
    if(HostRule[webDomain]['include'].test(webUrl)) {
        let rule=HostRule[webDomain]['rule']();
        console.log(rule, HostRule[webDomain]['rule']()['ajaxUrl']);

        DownAjax(rule['ajaxUrl'], rule['DownAjax']);
    }
}

function parsetext(text) {
    var doc = null;
    try {
        doc = document.implementation.createHTMLDocument("");
        doc.documentElement.innerHTML = text;
        return doc;
    }
    catch (e) {
        alert("parse error");
    }
}

function DownAjax(urls, callback){
    GM_xmlhttpRequest({
        method: "GET",
        url: urls,
        onload: function (result) {
            callback(parsetext(result.responseText));
        }
    });
}