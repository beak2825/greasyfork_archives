// ==UserScript==
// @name         115AV Helper
// @author       kyay006
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  本脚本将在免登录115的状态下，在AVMOO、JAVBUS等片库网站中基于115实现一些额外功能（前提当然是你要有会员啦）
// @description  理论上只要页面看起来跟AVMOO、JAVBUS像，脚本就支持该网站，只需自行在下方参照格式添加一条match即可
// @match        http*://avmask.com/*
// @match        http*://avmoo.com/*
// @match        http*://avsox.asia/*
// @match        http*://www.javbus.com/*
// @match        http*://www.dmmbus.us/*
// @match        http*://www.dmmbus.work/*
// @match        http*://www.dmmsee.work/*
// @match        http*://www.busjav.us/*
// @match        http*://www.buscdn.work/*
// @match        http*://www.busdmm.work/*
// @match        http*://www.seedmm.us/*
// @match        http*://www.seedmm.in/*
// @match        http*://www.cdnbus.work/*
// @match        http*://www.cdnbus.icu/*
// @domain     115.com
// @domain     btos.pw
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @grant         GM_registerMenuCommand
// @grant         GM_xmlhttpRequest
// @grant         GM_notification
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/390681/115AV%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/390681/115AV%20Helper.meta.js
// ==/UserScript==

(function() {
    var cookie = "";//★★★使用前请先在双引号中填入你的115 Cookie★★★

    var code,json;
    var site = {};
    var sites = {
        btspread:{
            result:[],//存放搜索结果
            getUrl:function (code){
                var url = "https://btsow.club/search/";
                return url + code;
            },
            matchResult:function (data){
                var magnet,name,date,size;
                var result;
                var nodes_regExp = /\<div class\=\"row\"\>([\s\S]*?)\<\/a\>/g;
                var node_regExp = /href\=\".*\/(\w+)\"\stitle\=\"(.*)\"[\s\S]*?Size\:([0-9KGMB.]+).*Date\:([0-9\-]+)/;
                var links = data.responseText.match(nodes_regExp);
                links.pop();//最后一个不是，去除
                if(links.length){
                    $.each(links,function(key,val){
                        result = val.match(node_regExp);
                        magnet = result[1];
                        name = result[2];
                        date = result[3];
                        size = result[4];
                        site.result.push(new Result(magnet,name,date,size));
                    })
                }
            }
        },
/*       bthaha:{
            getUrl:function(code){
                var url = "https://bthaha.men/search/";
                return url + code;
            },
            matchResult:function(data){
                var i,url,magnet,name,date,size;
                var results = new Array();
                var links = $(data.responseText).find("a.title");
                if(!$.isEmptyObject(links)){
                    $.each(links,function(key,val){
                        url = "https://bthaha.men/" + $(val).attr("href");
                        httpGet(url,function(){

                        })
                        results.push(new Result(magnet,name,date,size));
                    })
                }
            }
        },
        cltt:{
            result:[],
            getUrl:function (code){
                var url = "https://www.cltt13.xyz/search/";
                return url + code + "_ctime_1.html";
            },
            matchResult:function(data){
                var a,b,magnet,name,date,size;
                var results = new Array();
                var links = $(data.responseText).find('.panel-body');
                if(!$.isEmptyObject(links)){
                    $.each(links,function(key,val){
                        a = $(val).find('a');
                        magnet = a.attr('href').match(/\/(\w+).html/)[1];
                        name = a.text();
                        b = $(val).find('b');
                        date = b[0].innerText;
                        size = b[1].innerText;
                        site.result.push(new Result(magnet,name,date,size));
                    })
                }
            }
        } */
    }

    var URL_USER_INFO = "https://webapi.115.com/files/index_info";
    var URL_SEARCH = "https://webapi.115.com/files/search?cid=0&limit=50&search_value=";
    var URL_VIDEO = "http://115.com/api/video/m3u8/";
    var URL_BTSEARCH= "https://btspread.com/search/";
    var URL_ADDONETASK = "https://115.com/web/lixian/?ct=lixian&ac=add_task_url";
    var URL_ADDMULTITASK = "https://115.com/web/lixian/?ct=lixian&ac=add_task_urls";
    var URL_GETTASKLISTS = "https://115.com/web/lixian/?ct=lixian&ac=task_lists";

    if(urlMatch()){
        addMagnetSearch();
    }
    getCookieState();

    function getCookieState(){
        if(cookie == ""){
            msg("脚本中的Cookie为空\n请先在脚本中填写Cookie，否则将无法查询数据！");
        }else{
            httpGet(URL_USER_INFO,function(xhr){
                json = $.parseJSON(xhr.responseText);
                if(!json.state){
                    msg("脚本中的Cookie已过期，请重新填写！");
                }else{
                    if(urlMatch()){
                        setSingleEle($('div.container'));
                    }else{
                        $('a.movie-box').each(function(){
                            setMultiEles($(this));
                        })
                    }
                }
            })
        }
    }

    function urlMatch(){
        code = $('div.container').find("span[style='color:#CC0000;']").text();
        if(code === ""){
            return false;
        }else{
            return true;
        }
    }

    function setMultiEles(node){
        var title = node.find('div.photo-info span');
        code = title.find('date:first').text();
        searchVideo(code,function(pickcode){
            setTitleCss(title);
            addPlayBtn(pickcode,node.find('div.photo-frame'));
        })
    }

    function setSingleEle(node){
        searchVideo(code,function(pickcode){
            setTitleCss(node.find('h3:first'));
            addPlayBtn(pickcode,node.find('div.screencap'));
        })
    }

    function searchVideo(fanhao,callback){
        httpGet(URL_SEARCH + fanhao,function(xhr){
            json = $.parseJSON(xhr.responseText);
            if(!$.isEmptyObject(json.data)){
                callback(getVideo(json.data));
            }else{
                if(/\-/.test(fanhao)){
                    fanhao = fanhao.replace("-","_");
                    httpGet(URL_SEARCH + fanhao, function(xhr){
                        json = $.parseJSON(xhr.responseText);
                        if(!$.isEmptyObject(json.data)){
                            callback(getVideo(json.data));
                        }else{
                            fanhao = fanhao.replace("_","");
                            httpGet(URL_SEARCH + fanhao, function(xhr){
                                json = $.parseJSON(xhr.responseText);
                                if(!$.isEmptyObject(json.data)){
                                    callback(getVideo(json.data));
                                }
                            })
                        }
                    })
                }else{
                    fanhao = fanhao.replace("_","-");
                    httpGet(URL_SEARCH + fanhao, function(xhr){
                        json = $.parseJSON(xhr.responseText);
                        if(!$.isEmptyObject(json.data)){
                            callback(getVideo(json.data));
                        }
                    })
                }
            }
        })
    }

    function addPlayBtn(pickcode,node){
        node.append("<a class='play-box' href='javascript:;'><i class='play-ico'></i></a>");
        node.find('a.play-box').on('click',function(){
            startPlay(pickcode);
        })
    }

    function getVideo(data){
        var regExp = /avi|mp4|wmv|mkv/;
        for(var i=0;i<data.length;i++){
            if(!$.isEmptyObject(data[i].pc)){
                var name = data[i].ico;
                if(name){
                    if(name.search(regExp) >= 0){
                        return data[i].pc;
                    }
                }
            }
        }
    }

    function startPlay(pickcode){
        httpGet(URL_VIDEO + pickcode + ".m3u8",function(xhr){
            var arr = xhr.responseText.split("\n");
            arr.shift();
            arr.pop();
            var num,index,max = 0;
            for(var i=0;i<=arr.length - 2;i=i+2){
                num = Number(arr[i].match(/BANDWIDTH=(\d+)/)[1]);
                if(num == 3000000){
                    index = i;
                    break;
                }
                if(num > max){
                    index = i;
                    max = num;
                }
            }
            window.location.href = "potplayer://" + arr[index+1];
        })
    }

    function setTitleCss(ele){
        ele.css("font-weight","bold");
        ele.css("color","blue");
    }

    function httpGet(url,load,loadstart){
        GM_xmlhttpRequest({
            method:"GET",
            url:url,
            headers:{'Cookie':cookie},
            onloadstart: loadstart,
            onload:xhr => load(xhr)
        })
    }

    function httpPost(url,data,callback){
        GM_xmlhttpRequest({
            method:"POST",
            url:url,
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
                'Cookie':cookie
            },
            data:data,
            onload:xhr => callback(xhr)
        })
    }

    function msg(content){
        GM_notification(content,"油猴脚本\"115已有影片标记\"");
    }

    function msgBox(type,title,content){
        var node,box;
        //var heading = `<div class="panel-heading" style='font-size:16px'><b>`+ title +`</b></div>`;
        var heading = `<div class="msgbox-title"><span class="msgbox-close" onclick="$('#msgBox').remove()">×</span><b>`+ title +`</b></div>`;
        var body = `<div class="msgbox-body">`+ content +`</div>`;
        if(type == 0){
            box = `<div id="msgBox" class="msg-box msgbox-info"></div>`;
        }else{
            box = `<div id="msgBox" class="msg-box msgbox-danger"></div>`;
        }
        $('body').append(box);
        $('div.msg-box').append(heading);
        $('div.msg-box').append(body);
    }

    function addOffTask(text){
        if(confirm("确定添加到115离线吗？")){
            if(/\n/.test(text)){
                addMultiMagnet(text);
            }else{
                addOneMagnet(text);
            }
            $('#layer-bt').remove();
        }
    }

    function addOneMagnet(magnetLink){
        httpPost(URL_ADDONETASK,"url=" + magnetLink,function(xhr){
            json = $.parseJSON(xhr.responseText);
            if(json.state){
                alert("任务添加成功！\n刷新一下网页，如果标题变蓝，点击封面图即可播放\n如果没有，请30秒后再尝试，还是没有请换个磁链离线");
/*                 setInterval(function(){
                    getTaskStatus(magnetLink);
                },2000) */
            }else{
                alert(json.error_msg);
            }
        })
    }

    function addMultiMagnet(text){
        var err_task = new Array();
        var links = text.split('\n');
        for(var i = 0; i < links.length; i++){
            links[i] = "url[" + i + "]=" + links[i];
        }
        httpPost(URL_ADDMULTITASK,links.join("&"),function(xhr){
            json = $.parseJSON(xhr.responseText);
            if(json.state){
                $.each(json.result,function(key,val){
                    if(!val.state){
                        err_task.push(val);
                    }
                })
                if(err_task.length){
                    openErrTaskWindow(err_task);
                }else{
                    alert("所有任务添加成功！");
                }
            }else{
                alert(json.error_msg);
            }
        })
    }

    function addMagnetSearch(){
        var node = (`
            <h4>磁力链接——数据来源：<select id='bt-sites' disabled></select></h4>
            <div id='data-list' class='panel panel-default'>
                <div class="panel-heading">
                    <div class="panel-title">
                        <span>搜索结果</span>
                    </div>
                </div>
                <div class="panel-body">
                </div>
            </div>
        `);
        $('div#movie-share').remove()//删除分享节点
        $('div.container .row.movie').after(node);
        $('#bt-sites').on('change',function(){
            getMagnet(code);
        });
        loadBTSites();
        getMagnet(code);
    }

    function addSearchResult(){
        var node = $('div#data-list');
        var list =node.find('div.panel-body');
        $('select#bt-sites').removeAttr("disabled");
        list.find('span').remove();//去除“未找到磁链”字样
        if(!$.isEmptyObject(site.result)){
            $.each(site.result,function(index,val){
                list.append(
                    "<a class='btn btn-default magnet-link' href='magnet:?xt=urn:btih:"+ val.magnet +"'>"+ (val.name.length>30 ? val.name.substring(0,30) + "..." : val.name) +
                    "  <span class='label label-info'>" + val.size + " / " + val.date + "</span>"+
                    "</a>"
                )
            });
            list.find('a').on('click',function(){
                addOffTask($(this).attr('href'));
                event.returnValue=false;
            })
        }else{
            list.append("<span>没有找到相关磁链</span>");
        }
    }

    function getMagnet(code){
        var node = $('div#data-list div.panel-body');
        node.empty();//清空当前搜索结果
        site = sites[$('#bt-sites').val()];//设置当前搜索站点
        if($.isEmptyObject(site.result)){
            httpGet(site.getUrl(code),addMagnetLink,function(){node.append('<span>搜索中...</span>')});
        }else{
            addSearchResult();
        }
    }

    function loadBTSites(){
        $.each(sites,function(key,val){
            $('#bt-sites').append('<option value="' +key+'">'+key+'</option>')
        })
    }

    function addMagnetLink(data){
        site.matchResult(data);
        addSearchResult();
    }

    function openBTWindow(){
        $("body").append(`
            <div id="layer-bt" style="z-index: 101; width: 600px; height: 380px;">
                <div class="w-layer-title">新建离线任务</div>
                <div class="layui-layer-content">
                    <div id="JS_try_BT2" class="layui-layer-wrap" style="display: block;">
                        <div class="fct mt15 mb8">
                            <textarea id="dl-text" rows="9" placeholder="支持HTTP、HTTPS、FTP、磁力链和电驴链接，换行可添加多个" style="width: 550px;"></textarea>
                        </div>
                        <p class="fct" style="padding: 20px 0px;">
                            <button type="button" id='add-bt-btn'>添加</button>
                        </p>
                    </div>
                </div>
                <span class="layui-layer-setwin"><a href="javascript:;" class="layui-layer-close" onclick="$('div#layer-bt').remove()"></a></span>
                <span class="layui-layer-resize"></span>
            </div>
        `);
        $('button#add-bt-btn').on('click',function(){addOffTask($('#dl-text').val())});
    }

    function openErrTaskWindow(task){
        $("body").append(`
            <div id="err-task-window" class='msg-box msgbox-danger'>
                <div class='msgbox-title'><span class="msgbox-close" onclick="$('#err-task-window').remove()">×</span><b>以下链接离线失败</b></div>
                <div class='msgbox-body'>
                    <table class='table'>
                        <thead>
                            <th>链接</th>
                            <th>原因</th>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        `)
        var node = $('#err-task-window').find('tbody');
        $.each(task,function(key,val){
            node.append(`
                <tr>
                    <td><a href='`+ val.url +`'>`+ val.url.substring(0,30) +`...</a></td>
                    <td>`+ val.error_msg +`</td>
                </tr>
            `)
        })
    }

    function getTaskStatus(link){
        httpPost(URL_GETTASKLISTS,"page=2",function(xhr){
            json = $.parseJSON(xhr.responseText);
            if(json.state){
                $.each(json.tasks,function(key,val){
                    if(val.url === link){
                        console.log(val.percentDone)
                        if(val.status === 2){
                            location.reload();
                        }
                    }
                })
            }
        })
    }

    document.addEventListener("keydown", function(e) {
        if(e.keyCode == 120) {
            if($('div#layer-bt').length){
                $('div#layer-bt').remove();
            }else{
                openBTWindow();
            }
        }
    });

    function Result(magnet,name,size,date){
        this.magnet = magnet;
        this.name = name;
        this.size = size;
        this.date = date;
    }

    GM_addStyle(`
        div.photo-frame{
            position:relative;
        }

        a.play-box{
            display:none;
            width:100%;
            height:100%;
            position:absolute;
            top:0;
            background:rgba(207,207,207,0.5);
        }

        i.play-ico{
            width:50px;
            height:50px;
            background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACC0lEQVRoQ+2a0W2DMBCGfc956QgMkB3abtJuABMUJijZINkg3SDZIJVMkke6QSLhPMVc5QgiKwoRYIyPCL9j3cfd7/s5DOxJFjwJBxtBqGWyMiOe571MJpNvAPAYY6ssy2Zpmh6oAZTxVIJMp9OQMfalBa4gQs75jCLMI5AVY+z1NmhETPM8D3a73ZISUGMQLfgVIgZJkmwoAJmAXOJHxLkQInCtH2OQIhtKP7HLA6ErkDI7qToQkiRZ9F1unYLo+mGMRZxzdWD0smyBXPUjpYz2+73KlNVlFUSLPLStn75AFNMBEX1b+ukTpCy3DQAEXeundxCt3Jbn8znoSj8uQcoMxUKIyLShOgfRGqqRIaUCcm2oAPDZRj+kQEwMKVWQxoaUNIhuSDnn0SNrMASQa/8RQrxXnW6DAVE0eZ7Pttutfy8zI4hVK3tnc0T8FUK8Dbm0jurrk3OupjqVi3RpIeJCCOHXsS9UQdaF5a89oSEFgoh/APAxZItyREQ1tIjbHiLOM6J6w+l0CuvogKTYEfFHSukP9sNK9QMA8NvogEpGlA7U8GHeVgeuQS4NLcuy2FQHzkBUQ5NShl3pwAXIuvgpNMyRqWpoxRDbig76yEgtY2dD5OWexg2xibGjCtLY2JECMTF2rkBuf08bGzsnIMWFgVi7MGC1oZlCjndRTN9g18+PGen6jZru9w9A+YlCWMD4+gAAAABJRU5ErkJggg==);
            position:absolute;
            top:50%;
            left:50%;
            transform: translate(-50%, -50%);
        }

        div.photo-frame:hover a.play-box{
            display:block;
        }

        div.screencap:hover a.play-box{
            display:block;
        }

        #layer-bt,.msg-box{
            position: fixed;
            background: #fff;
            border-radius: 5px!important;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 1px 1px 50px rgba(0,0,0,.3);
        }

        .w-layer-title {
            height: 48px;
            line-height: 48px;
            border-radius: 5px 5px 0 0!important;
            border-bottom: 1px solid #eee;
            font-size: 16px;
            color: #333;
            overflow: hidden;
            background-color: #f8f8f8;
            padding: 0 80px 0 20px;
        }

        .layui-layer-content {
            position: relative;
        }

        .mb8 {
            margin-bottom: 8px;
        }

        .mt15 {
            margin-top: 15px;
        }

        .fct {
            text-align: center;
        }

        .layui-layer-setwin {
            position: absolute;
            right: 15px;
            top: 15px;
            font-size: 0;
            line-height: normal;
        }

        .layui-layer-close {
            display: inline-block;
            cursor: pointer;
            background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAwklEQVQ4T6WT0Q3CMAxEXzeADdiAsgGjwAYwCWxQRmEDYBIYAV1VSya100jkL4nu6XyXdPy5OmADPIAzcGvkHYALsBNA6wlsgWMDROIBeAG9AVbAvQHixXvgYwC5WILMxBJ5QA0SiiNABNGZzTza9kGXDuzOj6MzBTYTZw4Mcpqq0l4VX6OKMwd+ZunSiiNAGZgAacUlIEs7rdgD0qqm2UOIAZbEUTvjsxdA5HetqiJ972RtDtSxPtTPI6n8TEF6hfsFORY8Qcjn1/kAAAAASUVORK5CYII=);
            width: 16px;
            height: 16px;
        }

        #add-bt-btn {
            line-height: 1;
            border: 1px solid #dcdfe6;
            padding: 12px 30px;
            border-radius: 4px;
            color: #fff;
            background-color: #409eff;
            border-color: #409eff;
            font-size: 16px;
        }

        #dl-text {
            padding: 9px 11px;
            line-height: 1.6;
            border: 1px solid #e6e6e6;
            border-radius: 3px;
            background: #fff;
            color: #333;
            font-size: 14px;
            transition: border-color .15s;
            outline: 0;
            resize: none;
        }

        a.magnet-link{
            margin: 0px 10px 10px 0px;
        }

        .msg-box{
            min-width:500px;
            border:1px solid transparent;
            border-radius:4px;
        }

        .msgbox-close{
            float:right;
            cursor: pointer;
            font-size:21px;
            font-weight:700;
            line-height:1;
        }

        .msgbox-title{
            padding:10px 15px;
            border-bottom:1px solid transparent
        }

        .msgbox-body{
            padding:15px;
        }

        .msgbox-info{
            border-color:#337ab7;
        }

        .msgbox-info .msgbox-close{
            color:#fff;
        }

        .msgbox-info .msgbox-title{
            color:#fff;
            background-color:#337ab7;
            border-color:#337ab7;
        }

        .msgbox-danger{
            border-color:#ebccd1;
        }

        .msgbox-danger .msgbox-close{
            color:#a94442;
        }

        .msgbox-danger .msgbox-title{
            color:#a94442;
            background-color:#f2dede;
            border-color:#ebccd1;
        }
    `);
})();