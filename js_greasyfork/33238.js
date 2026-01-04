// ==UserScript==
// @name                 时光网电影搜索
// @namespace            https://greasyfork.org/zh-CN/users/42351
// @require              https://code.jquery.com/jquery-3.2.1.min.js
// @version              0.1
// @description          在时光网添加具有下载资源的网站入口
// @author               Antecer
// @include              http*://movie.mtime.com/*
// @grant                GM_xmlhttpRequest
// @connect              gagays.xyz
// @connect              rarbt.com
// @connect              btbtt9.com
// @run-at               document-end
// @compatible           chrome 测试通过
// @compatible           firefox 未测试
// @compatible           opera 未测试
// @compatible           safari 未测试
// @downloadURL https://update.greasyfork.org/scripts/33238/%E6%97%B6%E5%85%89%E7%BD%91%E7%94%B5%E5%BD%B1%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/33238/%E6%97%B6%E5%85%89%E7%BD%91%E7%94%B5%E5%BD%B1%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

jQuery.noConflict();
(function($) { $(function() {
    // 里格式化字符串
    function formatString(str, replacements) {
        replacements = (typeof replacements === 'object') ? replacements : Array.prototype.slice.call(arguments, 1);
        return str.replace(/\{\{|\}\}|\{(\w+)\}/g, function(m, n) {
            if (m == '{{') { return '{'; }
            if (m == '}}') { return '}'; }
            return replacements[n];
        });
    }

    var siteList = {'嘎嘎影视':'http://www.gagays.xyz/movie/search?req%5Bkw%5D={0}',
                    'RARBT'   :'http://www.rarbt.com/index.php/search/index.html?search={0}',
                    'BT之家'  :'http://www.btbtt9.com/search-index-keyword-{0}.htm'
                   };
    var movieName = $("#db_head h1").text();
    var searchTab = $('<div id="searchResult" class="db_nav"><dl class="clearfix"></dl></div>');
    $('.db_nav').before(searchTab);
    $('#searchResult').hide();
    $.each(siteList, function (name,value) {
        (function (siteName,siteUrl) {
            var thisReq = GM_xmlhttpRequest ( {
                url: formatString(siteUrl,movieName),
                method: "GET",
                onload: function(response){
                    var searchOut = $(response.responseText).find('a:contains('+ movieName +')');
                    var siteDomain = siteUrl.match(/(http*:\/\/.*?)\//)[1];
                    var movieTab = '<dd><a href="{0}" target="_blank">'+siteName+'</a></dd>';
                    if(searchOut.length > 0){
                        $('#searchResult>dl').append(formatString(movieTab,siteDomain + searchOut.attr('href').replace(siteDomain,'')));
                        $('#searchResult').show();
                    }
                    thisReq.abort();
                }
            } );
        } ) (name,value);
    });
});})(jQuery);