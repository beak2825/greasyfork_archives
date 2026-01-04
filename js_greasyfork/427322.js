// ==UserScript==
// @name         旧版哔嘀影视下载链接复制
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  一键复制 bde4 所有 ed2k 下载链接
// @author       zsandianv
// @include      https://www.52bdys.com/*
// @exclude      https://www.52bdys.com/play/*
// @exclude      https://www.52bdys.com/*/play
// @icon         https://cdn.jsdelivr.net/gh/bde4admin/v3/images/favicon.png
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427322/%E6%97%A7%E7%89%88%E5%93%94%E5%98%80%E5%BD%B1%E8%A7%86%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/427322/%E6%97%A7%E7%89%88%E5%93%94%E5%98%80%E5%BD%B1%E8%A7%86%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var host = window.location.href
    var api = 'https://www.52bdys.com/downloadInfo/list?mid='
    var mid = host.match(/\d+/g)[1]
    var data
    var ed2k = []
    var magnet = []

    $.ajaxSettings.async = false;
    $.getJSON(api + mid, function(json){
        data = json
    });
    for (var i in data){
        if (!data[i].url.search('ed2k')){
            var password = ''
            if (data[i].password == 'none'){
                password = ''
            }
            ed2k.push([data[i].downloadCategory.name,data[i].url,password])
        }else if (!data[i].url.search('magnet')){
            magnet.push([data[i].downloadCategory.name,data[i].url,data[i].password])
        }
    }
    if (magnet.length != 0){
        for (i in magnet){
            html = html + format(magnet[i][0],magnet[i][1],magnet[i][2])
            console.log(1)
        }
    }
    if (ed2k.length != 0){
        ed2k.reverse()
        for (i in ed2k){
            html = html + format(ed2k[i][0],ed2k[i][1],ed2k[i][2])
            console.log(1)
        }
    }

    function format(name,url,password){
        var item = '<div class="item"><div class="content"><a class="parent"target="_blank"href="'+url+'><em class="left"style="color: red">'+name+'：</em><em class="right ui text nowrap"title="'+url+'">'+url+'</em><em style="color:red">'+password+'</em></a></div></div>'
        return item
    }
    if ($("div#download-wrapper").length == 0){
        var html = '<div id="download-wrapper"style="display: block;"><h4 class="ui teal header dividing"><div class="content">下载地址<small style="color:#db2828">（请优先使用种子文件下载）</small></div></h4><div class="ui middle aligned animated list"id="download-list">'
        html = html + '</div></div>'
        $("div.download-help").before(html)
    }

    $("div#download-wrapper .ui.teal.header.dividing .content").after('<button class="ui secondary mini button" type="submit" id="btn_submit"> 复制链接 </button>')

    $('#btn_submit').click(function(){
        var url = [];$('em.right.ui.text.nowrap').each(function(index,element){if(!element.innerText.search('ed2k')){url.push(element.innerText)}})
        var copyUrl = document.createElement('textarea');
        copyUrl.style.opacity	=0;
        copyUrl.style.position="absolute";
        copyUrl.style.left="100%";
        document.getElementById("btn_submit").appendChild(copyUrl);
        copyUrl.value = url;
        copyUrl.select();
        document.execCommand('copy')
        document.getElementById("btn_submit").removeChild(copyUrl);

    });




    // Your code here...
})();