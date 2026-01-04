// ==UserScript==
// @name         lizhiFM 荔枝FM 下载音乐
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  下载荔枝FM分享到音乐
// @require https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @author       Zszen
// @match        https://www.lizhi.fm/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381108/lizhiFM%20%E8%8D%94%E6%9E%9DFM%20%E4%B8%8B%E8%BD%BD%E9%9F%B3%E4%B9%90.user.js
// @updateURL https://update.greasyfork.org/scripts/381108/lizhiFM%20%E8%8D%94%E6%9E%9DFM%20%E4%B8%8B%E8%BD%BD%E9%9F%B3%E4%B9%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //console.log('123');
    loopDetect();

    function loopDetect(){
       setTimeout(function(){
           if(!player){
               loopDetect();
               return;
           }
           dealMajor();
       },500);
    }
    function dealMajor(){
        var data = null;
        try{
            data = player.getList().models;
        }catch(e){
        }
        //data.cover
        //data.url
        let bro = $('div.playlist').find('span.playlist-item-index').parent().find('span.playlist-item-user-name');
        bro.css({width:'60px'});
        let container = $("<span class='lizhi-download' style='width:160px'></span>")
        let btDownMp3 = $('<span style="width:70px;"><a class="downmp3" href="#">下载音频</a></span>');
        let btDownImg = $('<span style="width:70px;"><a class="downimg" href="#"">下载封面</a></span>');
        container.append(btDownMp3);
        container.append(btDownImg);
        bro.after(container);
        let all = $("span.lizhi-download");
        for(let i=0;i<all.length;i++){
            //console.log(all[i]);
            let a = all.eq(i).find('a.downmp3');
            a.attr('index', i);
            let b = all.eq(i).find('a.downimg');
            b.attr('index', i);
            console.log(a);
            a.on('click',function(e){
                var data = player.getList().models[e.target.getAttribute('index')].attributes;
                if(!data){
                    alert('数据出错，可能页面算法更改')
                    return;
                }
                if(!data.url){
                    reqAudioUrl(data.id,{
                        success: function(url) {
                            data.url = url;
                            window.open(url,"_blank");
                        }
                    })
                }else{
                    window.open(data.url,"_blank");
                }

                //console.log(player.getList().models[e.target.getAttribute('index')].attributes)
                //var data = player.getList().models[e.target.getAttribute('index')].attributes;
                //window.open(data.url,"_blank");
            })
            b.on('click',function(e){
                var data = player.getList().models[e.target.getAttribute('index')].attributes;
                if(!data){
                    alert('数据出错，可能页面算法更改')
                    return;
                }
                window.open(data.cover,"_blank");
            })
        }
    }

    function reqAudioUrl(audioId, opt) {
        if (opt == null) {
            opt = {}
        }
        function defaultFailHandle(res, statusCode, errorThrown) {
            available = true;
            var errMsg = "";
            if (res.rcode != null) {
                errMsg = "rcode：" + res.rcode + ", 信息：" + res.msg
            } else {
                errMsg = "状态码：" + statusCode + ", 报错：" + JSON.stringify(errorThrown)
            }
            $.sdialog({
                content: $('<div><div class="title fontYaHei bold">发生了错误</div><div><p class="text" style="margin-top: 20px;">' + errMsg + "</p></div></div>"),
                autoSize: "false",
                customClass: "wxDialog",
                width: 200,
                height: 244
            })
        }
        var failHandle = opt.fail || defaultFailHandle;
        return $.ajax({
            method: "get",
            url: "/media/url/" + audioId
        }).done(function(res) {
            if (res.rcode === 0) {
                opt.success && opt.success(res.data.url)
            } else {
                failHandle(res)
            }
        }).fail(failHandle)
    }
})();