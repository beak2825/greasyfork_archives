// ==UserScript==
// @name         NGA Recommend Search Button
// @namespace    https://greasyfork.org/zh-CN/scripts/33356-nga-recommend-search-button
// @version      0.0.1.20170920
// @icon         http://bbs.nga.cn/favicon.ico
// @description  NGA 增加搜索精华主题按钮
// @author       AgLandy
// @include      /^https?://(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn)/.+/
// @grant        none
// @require      http://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/33356/NGA%20Recommend%20Search%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/33356/NGA%20Recommend%20Search%20Button.meta.js
// ==/UserScript==

//发布地址：http://bbs.ngacn.cc/read.php?tid=12485023

var $Q = jQuery.noConflict();

(function() {
    if(!$Q('a[title="搜索"]').length)
        return;
    $Q('a[title="搜索"]').click(function(){
        setTimeout(function(){
            $Q('button:contains("搜索用户")').after('<br><button type="button">搜索精华主题标题</button><br><button type="button">搜索精华主题标题和内容</button>');
            $Q('button:contains("搜索精华")').click(function(){
                var p = $Q(this).parent(), k = p.find(':text')[0], fcs = p.find(':radio:eq(0)')[0], fc = p.find(':radio:eq(1)')[0], fo = p.find('form')[0];
                k.value = k.value.replace(/^\s+|\s+$/g,'');
                if(!k.value)
                    return alert('请输入关键词');
                fo.method = 'post';
                fo.action = '/thread.php?key='+encodeURIComponent(k.value);
                if(fcs.checked)
                    fo.action += '&fid='+commonui.selectForum.get(4, 16).join(',');
                else if(fc.checked)
                    fo.action += '&fid='+commonui.selectForum.get(64).join(',');
                fo.action += '&recommend=1';
                if(/内容/.test(this.innerHTML))
                    fo.action += '&content=1';
                fo.submit();
            });
        },1);
    });
})();
