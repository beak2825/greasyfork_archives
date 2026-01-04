// ==UserScript==
// @name         一键复制QQ群成员(GeDong)
// @namespace    http://qun.qq.com/
// @version      0.6
// @description  一键复制QQ群成员管理页所有成员的QQ号
// @forkby       ITJesse
// @author       GeDdong
// @match        http://qun.qq.com/member.html
// @match        https://qun.qq.com/member.html
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/479060/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6QQ%E7%BE%A4%E6%88%90%E5%91%98%28GeDong%29.user.js
// @updateURL https://update.greasyfork.org/scripts/479060/%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6QQ%E7%BE%A4%E6%88%90%E5%91%98%28GeDong%29.meta.js
// ==/UserScript==

var all_qq = '';
var count = 0;

function getBkn() {
    for (var e = $.cookie("skey"), t = 5381, n = 0, o = e.length; o > n; ++n) t += (t << 5) + e.charAt(n).charCodeAt();
    return 2147483647 & t;
}

function loadAll() {
    var gc = /\((\d+)\)/.exec($('#groupTit').text())[1];
    var offset = 40;
    var data = {
        gc: gc,
        st: 0,
        end: offset,
        sort: 0,
        bkn: getBkn()
    };

    $.ajax({
        url: '/cgi-bin/qun_mgr/search_group_members',
        method: 'post',
        dataType: 'json',
        data: data,
        success: function(json){
            all_qq = '';
            console.log("json.count",json.count);
            count = json.count
            console.log("count",count);
            for(var i in json.mems){
                all_qq = all_qq + json.mems[i].uin + '\n';
            }
            // all_qq = all_qq.substr(0, all_qq.length - 1);
            $('#groupMemberTit').append('<button class="add-member" id="docopy">复制QQ号</button>');

            console.log("count",count);
            while(count>data.end){
                data.st = data.end + 1;
                data.end += offset;
                $.ajax({
                    url: '/cgi-bin/qun_mgr/search_group_members',
                    method: 'post',
                    dataType: 'json',
                    data: data,
                    success: function(json){
                        for(var i in json.mems){
                            all_qq = all_qq + json.mems[i].uin + '\n';
                        }
                        // all_qq = all_qq.substr(0, all_qq.length - 1);

                    }
                });
            }
        }
    });

}

(function() {
    'use strict';

    var _doc=document.getElementsByTagName('body')[0];
    var script=document.createElement('script');
    script.setAttribute('type','text/javascript');
    script.setAttribute('src','//cdn.bootcss.com/clipboard.js/1.5.9/clipboard.min.js');
    _doc.appendChild(script);
    script.onload=script.onreadystatechange=function(){
        if(!this.readyState||this.readyState=='loaded'||this.readyState=='complete'){
            var gc = '';
            setInterval(function(){
                var new_gc = /\((\d+)\)/.exec($('#groupTit').text());
                if(new_gc && gc != new_gc[1]){
                    setTimeout(function(){
                        loadAll();
                    }, 3000);
                    gc = new_gc[1];
                }
            }, 200);
            var clipboard = new Clipboard('#docopy', {
                text: function(trigger) {
                    return all_qq;
                }
            });
            clipboard.on('success', function(e) {
                alert('复制成功');
            });
        }
        script.onload=script.onreadystatechange=null;
    };
})();
