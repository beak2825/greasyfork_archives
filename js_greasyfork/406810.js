// ==UserScript==
// @name              BILIBILI show floor number
// @name:zh           B站显示楼层
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  获取bilibili 评论区楼层数，使得浏览器版b站显示楼层
// @author       devseed
// @match        *://*.bilibili.com/*
// @icon https://i1.hdslb.com/bfs/archive/fbe90a476ec0d11b563b44b66a9cfc6d52781639.jpg@160w_100h_100Q_1c.webp
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/406810/BILIBILI%20show%20floor%20number.user.js
// @updateURL https://update.greasyfork.org/scripts/406810/BILIBILI%20show%20floor%20number.meta.js
// ==/UserScript==

(function() {
    async function replycursor(oid, root, type=1) //时间顺序，游标
    {
        return new Promise(resolve => {
            $.get("https://api.bilibili.com/x/v2/reply/reply/cursor", {
            "oid":oid,
            "type":type, //视频、专栏、话题……
            "root":root
            },
            function(resp){
                return resolve(resp)
            })
        })
    }
    async function replycursor_app(oid, max_id, size=20, sort=0, type=1) //时间顺序，游标
    {
        return new Promise(resolve => {
            $.get("https://api.bilibili.com/x/v2/reply//cursor", {
            "oid" : oid,
            "max_id": max_id, //last floor in decrease,  if "", from the last
            'size': size,
            "sort": sort,
            "type": type,
            },
            function(resp){
                return resolve(resp)
            })
        })
    }
    async function replymain(oid, next, mode, type=1) //热评
    {
        return new Promise(resolve => {
            $.get("https://api.bilibili.com/x/v2/reply/main", {
            "oid":oid,
            "next":next,
            "mode":mode,
            "type":type
            },
            function(resp){
                return resolve(resp)
            })
        })
    }

    async function reply(oid, pn, sort, type=1) //默认，无楼层
    {
        return new Promise(resolve => {
            $.get("https://api.bilibili.com/x/v2/reply", {
            "oid":oid,
            "pn":pn,
            "sort": sort,
            "type":type
            },
            function(resp){
                return resolve(resp)
            })
        })
    }

    var url_av = $('meta[property="og:url"]').attr('content');
    var last_oid = parseInt(url_av.split('/')[4].slice(2));
    var last_pn = parseInt($('div#comment div.comment-header span.current').html());
    var last_sort = parseInt($('div.tabs-order li.on').attr('data-sort'));
    var last_type = 1 //暂时只支持av，不支持ss之类的番剧，专栏，话题
    //var iii=0;

    //var comment_div = $('div#comment').get(0);
    document.addEventListener("DOMNodeInserted",async (event) => {
        if($(event.target).attr('class')!='current')
            return; //要限定唯一的，否则多个入口遇到await，标志量会变成脏数据
        url_av = $('meta[property="og:url"]').attr('content');
        var oid = parseInt(url_av.split('/')[4].slice(2));
        var pn = parseInt($('div#comment div.comment-header span.current').html());
        var sort = parseInt($('div.tabs-order li.on').attr('data-sort'));
        var type =1;

        if(oid==last_oid && pn==last_pn && sort==last_sort && type==last_type)
            return; //评论页面没变

        //console.log(event.target, oid, pn, sort)
        last_oid = oid;
        last_pn = pn;
        last_sort = sort;
        try
        {
            //iii++;
            //console.log(iii, event.target, oid, last_oid, pn, last_pn, sort, last_sort, type, last_type);

            var mode = 0;
            var resp;
            if(sort==0) mode=1;
            else if(sort==2) mode=3;

            if(sort==2) resp = await replymain(oid, pn, mode, type);//热门
            else
            {
                console.log(pn)
                if(pn==1) resp = await replymain(oid, 0, mode, type);
                else
                {
                    resp = await reply(oid, pn-1, sort, type) //取得上一页最后一项rpid
                    //console.log('reply' , resp)
                    let end = resp['data']['replies']['length'];
                    let root = resp['data']['replies'][end-1]['rpid'];
                    resp = await replycursor(oid, root, type); //取得此项floor值
                    //console.log('replycursor' , root, resp)
                    let next = resp['data']['root']['floor'];
                    //resp = await replymain(oid, next, mode, type) //搜索next值
                    resp = await replycursor_app(oid, next-1, 20, sort, type);
                }
            }

            console.log(resp)
            var replies =  resp['data']['replies']
            for (var i in replies) //添加评论
            {
                let info = $('div.[data-id="'+ replies[i]['rpid'].toString()  +'"] div.con div.info');
                info.prepend("<span>#"+ replies[i]['floor'].toString() + "</span>");
            }
        } catch (e){
            console.error('Reply eror: ', e.message);
        }
        //console.log('DOMNodeInserted end');
    });

})()