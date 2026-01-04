// ==UserScript==
// @name        GODTMID版b站视频下载
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  びにびに
// @author       GODTMID
// @homepage     https://github.com/Godtmid
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/*
// @match        https://www.bilibili.com/medialist/*
// @icon         http://i0.hdslb.com/bfs/archive/106d36aa2d40ccefab90805da451aca859eea20f.jpg
// @require      https://lib.baomitu.com/jquery/1.12.4/jquery.min.js
// @require      https://cdn.staticfile.org/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js
// @grant        unsafeWindow
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM.addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/429644/GODTMID%E7%89%88b%E7%AB%99%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/429644/GODTMID%E7%89%88b%E7%AB%99%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    var ydata
    var p
    var aid
    var cid
    var bvid
    var ptitle
    var title
    var pic
    var downurl
    var preurl = document.URL
    var epInfo
    var badge
    var barrageurl
    var MAXINT = 9007199254740991
    var epList
    var btnflag = false
    var count = 0
    //批量按钮点击事件参数
    //线路，质量，弹幕
    var indexArr = [0,0,0]
    var qualityArr = []
    var downloadline = ["默认线路","高速线路","其他线路"]
    var danmuTypeArr = ["无弹幕","ass弹幕","xml弹幕","双弹幕"]
    var danmuTypeArr1 = ["","ass","xml","all"]
    var originalInterfaceList = [
        {"name":"纯净解析","category":"1","url":"https://z1.m1907.cn/?jx="},
        {"name":"高速接口1","category":"1","url":"https://api.sigujx.com/?url="},
        {"name":"B站解析1","category":"1","url":"https://vip.parwix.com:4433/player/?url="},
        {"name":"B站解析2","category":"1","url":"https://www.cuan.la/m3u8.php?url="},
        {"name":"Ckplayer","category":"1","url":"https://www.ckplayer.vip/jiexi/?url="},
        {"name":"乐多资源","category":"1","url":"https://api.leduotv.com/wp-api/ifr.php?isDp=1&vid="},
        {"name":"ccyjjd","category":"1","url":"https://ckmov.ccyjjd.com/ckmov/?url="},
        {"name":"M3U8","category":"1","url":"https://jx.m3u8.tv/jiexi/?url="},
        {"name":"BL","category":"1","url":"https://vip.bljiex.com/?v="},
        {"name":"Mao解析","category":"1","url":"https://qd.hxys.tv/m3u8.php?url="},
        {"name":"盘古","category":"1","url":"https://www.pangujiexi.cc/jiexi.php?url="},
        {"name":"SSAMAO","category":"1","url":"https://www.ssamao.com/jx/?url="},
        {"name":"无极","category":"1","url":"https://da.wujiys.com/?url="},
        {"name":"618G","category":"1","url":"https://jx.618g.com/?url="},
        {"name":"ckmov","category":"1","url":"https://www.ckmov.vip/api.php?url="},
        {"name":"迪奥","category":"1","url":"https://123.1dior.cn/?url="},
        {"name":"福星","category":"1","url":"https://jx.popo520.cn/jiexi/?url="},
        {"name":"RDHK","category":"1","url":"https://jx.rdhk.net/?v="},
        {"name":"H8","category":"1","url":"https://www.h8jx.com/jiexi.php?url="},
        {"name":"解析la","category":"1","url":"https://api.jiexi.la/?url="},
        {"name":"久播","category":"1","url":"https://jx.jiubojx.com/vip.php?url="},
        {"name":"九八","category":"1","url":"https://jx.youyitv.com/?url="},
        {"name":"老板","category":"1","url":"https://vip.laobandq.com/jiexi.php?url="},
        {"name":"乐喵","category":"1","url":"https://jx.hao-zsj.cn/vip/?url="},
        {"name":"MUTV","category":"1","url":"https://jiexi.janan.net/jiexi/?url="},
        {"name":"明日","category":"1","url":"https://jx.yingxiangbao.cn/vip.php?url="},
        {"name":"磨菇","category":"1","url":"https://jx.wzslw.cn/?url="},
        {"name":"OK","category":"1","url":"https://okjx.cc/?url="},
        {"name":"维多","category":"1","url":"https://jx.ivito.cn/?url="},
        {"name":"小蒋","category":"1","url":"https://www.kpezp.cn/jlexi.php?url="},
        {"name":"小狼","category":"1","url":"https://jx.yaohuaxuan.com/?url="},
        {"name":"智能","category":"1","url":"https://vip.kurumit3.top/?v="},
        {"name":"星驰","category":"1","url":"https://vip.cjys.top/?url="},
        {"name":"星空","category":"1","url":"http://60jx.com/?url="},
        {"name":"月亮","category":"1","url":"https://api.yueliangjx.com/?url="},
        {"name":"0523","category":"1","url":"https://go.yh0523.cn/y.cy?url="},
        {"name":"云端","category":"1","url":"https://jx.ergan.top/?url="},
        {"name":"17云","category":"1","url":"https://www.1717yun.com/jx/ty.php?url="},
        {"name":"66","category":"1","url":"https://api.3jx.top/vip/?url="},
        {"name":"116","category":"1","url":"https://jx.116kan.com/?url="},
        {"name":"200","category":"1","url":"https://vip.66parse.club/?url="},
        {"name":"云析","category":"1","url":"https://jx.yparse.com/index.php?url="},
        {"name":"8090","category":"1","url":"https://www.8090g.cn/?url="},

        {"name":"纯净解析","category":"2","url":"https://z1.m1907.cn/?jx="},
        {"name":"高速接口1","category":"2","url":"https://jsap.attakids.com/?url="},
        {"name":"高速接口2","category":"2","url":"https://api.sigujx.com/?url="},
        {"name":"B站解析1","category":"2","url":"https://vip.parwix.com:4433/player/?url="},
        {"name":"B站解析2","category":"2","url":"https://www.cuan.la/m3u8.php?url="},
        {"name":"Ckplayer","category":"2","url":"https://www.ckplayer.vip/jiexi/?url="},
        {"name":"乐多资源","category":"2","url":"https://api.leduotv.com/wp-api/ifr.php?isDp=1&vid="},
        {"name":"ccyjjd","category":"2","url":"https://ckmov.ccyjjd.com/ckmov/?url="},
        {"name":"M3U8","category":"2","url":"https://jx.m3u8.tv/jiexi/?url="},
        {"name":"BL","category":"2","url":"https://vip.bljiex.com/?v="},
        {"name":"Mao解析","category":"2","url":"https://qd.hxys.tv/m3u8.php?url="}
    ];
    //批量首次下载规则改名文件标志
    var jsonflag = true
    {
        var style = `
        <style type="text/css">
         .blcolor{
            background: rgb(0 161 214);
            border-radius: 2px;
            font-size: 14px;
            box-sizing: border-bo;
            line-height: 27px;
            height: 27px;
            width: 40px;
            color: white;
            text-align: center;
         }
         .blcolor:hover{
            border: 1px solid #cc124f;
            color: deeppink;
            backgrund:#16b8d6;
         }
         .bldownbtn{
            z-index: ${MAXINT};
	        box-sizing: border-box;
	        line-height: 35px;
            height: 35px;
            width: 35px;
            border-radius: 2em;
	        font-size: 10px;
	        align-items: center;
	        justify-content: center;
	        cursor: pointer;
	        color: white;
	        background: rgb(0 161 214);
	        text-align: center;
	        position: fixed;
	        left: 10px;
	        top: 100px;
        }
        #showmsg{
            z-index: ${MAXINT};
            opacity: 0.7;
            position: fixed;
            left: 10px;
            top: 127px;
            background: azure;
            font-size: 14px;
            display:none;
            max-width: 350px;
            border-radius: 1em;
            padding: 5px 10px;
        }
        #showmsg bdo{
            word-wrap:break-word;
            color: deeppink;
            line-height: 1.5;
        }
         #showmsg label{
            font-size: 15px;
            float:left;
            line-height: 1.5;
         }
         #showmsg>div{
            margin-bottom: 10px;
         }
         #showmsg .dlbtn{
            float:left;
            width: 60px;
         }
         .clear{
            clear:left;
         }
         .batchbtn-bangumi{
            position: absolute;
            right: 0px;
            bottom: 0px;
            font-size: 4px;
            background-color: #08ab85cc;
            z-index: 10;
            cursor: pointer;
            border: none;
            color: white;
         }
         .batchbtn:active{
            background-color: yellow;
         }
         .batchbtn-video-list{
            margin-top: -25px;
            margin-left: 251px;
            line-height: 1.5;
            background: rgb(0 161 214);
            color: white;
         }
         .ep-list-progress{
            display: block;
            float: right;
            height: 42px;
            line-height: 42px;
            font-size: 12px;
            color: #999;
            margin-right: 7px;
            font-weight: 1000;
            cursor: pointer;
         }
    </style>`
        }

    $(document.head).append(style)
    initload()
    timetack()
    setTimeout(function () {
        $(".dplayer-video.dplayer-video-current").attr("src")
    }, 3000)
    function initload() {
        setTimeout(function () {
            loadDownloadBtn()
            loadBatchComponent()
            initFont()
        }, 3000)
    }

    function loadDownloadBtn(){//target="_blank"
        var html = `<div>
            <div id="bilibilidownload" class="blcolor bldownbtn">下载</div>
            <div id="showmsg">
                <div>
                    <label>图片：</label>
                    <a href="javascript:void(0)" class="blcolor cover">封面下载</a>
                    <a href="javascript:player.screenshot(true)" class="blcolor">截图</a>
                    <a href="javascript:player.screenshot(false)" class="blcolor">GIF截取</a>
                </div>
                <div>
                    <label>弹幕下载：</label>
                    <input type="hidden" class="barrage" />
                    <a href="javascript:void(0)" data-type="xml" class="blcolor barrageType">XML格式</a>
                    <a href="javascript:void(0)" data-type="ass" class="blcolor barrageType">ASS格式</a>
                </div>
                 <div>
                    <label style="line-height: 3;">本地播放说明：</label>
                    <a href="http://www.downza.cn/soft/184629.html" target="_blank" class="blcolor outerChain">b站本地播放器</a>配合XML格式弹幕食用
                    <a href="https://potplayer.en.softonic.com" target="_blank" class="blcolor outerChain">Potplayer播放器</a>配合ASS格式弹幕食用
                </div>
                <div class="title">
                    <label>标题：</label>
                    <bdo></bdo>
                </div>
                <div class="subtitle">
                    <label>当前集：</label>
                    <bdo></bdo>
                </div>
                <div class="showtime">
                    <label>时长：</label>
                    <bdo></bdo>
                </div>
                <div class="downloadInfo">
                </div>
            </div>
        `

        $(document.body).append(html)
        $( "#bilibilidownload" ).draggable({
            containment: $(document.body),
            drag: draggableback
        })

        $('#bilibilidownload').on('click', function () {
            if($("#showmsg").is(':hidden')){
                if($("#showmsg .downloadInfo").html().trim() == ''){
                    console.clear()
                    if(preurl.startsWith('https://www.bilibili.com/video')){
                        //getVideoAffectInfo()
                        getVideoData()
                    }else if(preurl.startsWith('https://www.bilibili.com/bangumi')){
                        getbangumiData()
                    }else if(preurl.startsWith('https://www.bilibili.com/medialist')){
                        getVideoDataMedialist()
                    }
                }
                $(this).text("X")
            }else{
                $(this).text("下载")
            }
            $("#showmsg").fadeToggle(1000)
        })
        $(".barrageType").on('click',function(){
            const title = $(".barrage").attr("title")
            const cid = $(".barrage").attr("data-id")
            const type = $(this).attr("data-type")
            dmdownload(type,cid,title)
        })
        $(".cover").on('click',function(){
            const title = $(this).attr("title")
            const url = $(this).attr("data-url")
            const namearr = url.split(".")
            const suffix = namearr[namearr.length-1]
            GM_download(url, `${title}.${suffix}`)
            /*GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType:"blob",
                onload: function(response) {
                    var blob = new Blob([this.response],{type: "image/jpeg"})
                    saveAs(blob, `${title}.${suffix}`)
                }
            })*/
        })
    }
    function draggableback(){
        const y = parseInt($("#bilibilidownload").css("top").replace("px",""))+30
        const x = parseInt($("#bilibilidownload").css("left").replace("px",""))
        const wx = document.documentElement.clientWidth
        const wy = document.documentElement.clientHeight
        const sx = $("#showmsg").width()
        let badge1
        try{
            badge1 = unsafeWindow.__INITIAL_STATE__.epInfo.badge
        }catch{
            badge1 = ""
        }
        const sy = badge1==""?419+30:260+30
        if(wx-x<=sx&&wy-y<=sy){
            $("#showmsg").css("top",(y-sy)+"px").css("left",(x-sx)+"px")
        }else if(wx-x<=sx){
            $("#showmsg").css("top",y+"px").css("left",(x-sx)+"px")
        }else if(wy-y<=sy){
            $("#showmsg").css("top",(y-sy)+"px").css("left",x+"px")
        }else{
            $("#showmsg").css("top",y+"px").css("left",x+"px")
        }

    }
    function dmdownload(type,cid,filename){
        GM_xmlhttpRequest({
            'method': 'GET',
            'url': `http://comment.bilibili.com/${cid}.xml`,
            'onload': function (resp) {
                const content = resp.responseText.replace(/(?:[\0-\x08\x0B\f\x0E-\x1F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g, "")
                if(type == "xml"){
                    const blob  = new Blob([content], {type: "application/xml"})
                    saveAs(blob, `${filename}.xml`)
                }else if(type == "ass"){
                    const arr = parseXML(content)
                    const ass = generateASS(setPosition(arr), {
                        'title': document.title,
                        'ori': location.href,
                    });
                    startDownload('\ufeff' + ass, filename + '.ass')
                }else if(type == "all"){
                    const blob  = new Blob([content], {type: "application/xml"})
                    saveAs(blob, `${filename}.xml`)

                    const arr = parseXML(content)
                    const ass = generateASS(setPosition(arr), {
                        'title': document.title,
                        'ori': location.href,
                    });
                    startDownload('\ufeff' + ass, filename + '.ass')
                }

                //var blob1 = new Blob([ass], {type: "application/xml"})
                //saveAs(blob1, `${filename}.ass`)
                // var i = "https://upos-sz-mirrorcoso1.bilivideo.com/upgcxcode/66/59/246355966/246355966_nb2-1-64.flv?e=ig8euxZM2rNcNbNz7WdVhwdlhbhBhwdVhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1627997482&gen=playurlv2&os=coso1bv&oi=2028683548&trid=202b30558e18460390a9f18201629fa9u&platform=pc&upsig=2f1ba21188852a7fdbc3823af5ff00a2&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,platform&mid=23203114&bvc=vod&nettype=0&orderid=2,3&agrr=0&logo=40000000"
                // saveAs(i, "dd.flv")
                // var arr = parseXML(content)
                // console.log(JSON.stringify(arr))
            }
        })
    }

    function loadBatchComponent(){
        var head
        var exitflag
        if(preurl.startsWith('https://www.bilibili.com/video')){
            head = $("#multi_page .head-left")
            exitflag = componentvideo()
        }else if(preurl.startsWith('https://www.bilibili.com/bangumi')){
            head = $("#eplist_module .list-title.clearfix")
            exitflag = componentbangumi()
        }else if(preurl.startsWith('https://www.bilibili.com/medialist')){
            head = $("#playerAuxiliary .player-auxiliary-playlist-bottom")
            //exitflag = componentMedialist()
        }else{
            return false
        }
        if(exitflag){
            return false
        }

        //批量开关
        const batchSwitchEle = `
            <div class="ep-list-progress batchSwitch"><span>批量</span></div>
        `
        //下载线路
        const linesEle = `
            <div class="ep-list-progress lines">
                <span>高速线路</span>
            </div>
        `
        //弹幕
        const barrageTypeEle = `
            <div class="ep-list-progress barrageType">
                <span>无弹幕</span>
            </div>
        `
        //视频质量
        const qualityEle = `
            <div class="ep-list-progress qualitys">
            </div>
        `
        $(head).append(batchSwitchEle).append(linesEle).append(barrageTypeEle).append(qualityEle)
        $("#multi_page .head-con").css("padding","7px")
        $("#eplist_module .list-title.clearfix").css("padding","0 7px")

        timetaskforquality()

        //下载按钮点击事件
        $(document).on('click','.batchbtn',function(){
            //"/bangumi/play/ep391743/"
            //"/video/BV1es41127PE?p=11"
            $(this).css("background","gray")
            let href = $(this).parent().find("a:first").attr("href")
            if(href.includes("bangumi")){
                batchdownloadoneForbangumi(href,this)
            }else if(href.includes("video")){
                batchdownloadoneForvideo(href)
            }else if(href.includes("medialist")){
                batchdownloadoneFormedialist(this)
            }
        })
        //下载线路选择
        $(document).on('click','.lines>span',function(){
            batchclickcommon('0',downloadline, this)
        })
        //视频质量选择
        $(document).on('click','.qualitys>span',function(){
            batchclickcommon('1',qualityArr,this)
        })
        //弹幕类型选择
        $(document).on('click','.barrageType>span',function(){
            batchclickcommon('2',danmuTypeArr,this)
        })
    }

    function batchclickcommon(index,valueArr, ele){
        ++indexArr[index] >= valueArr.length?indexArr[index]=0:{};
        $(ele).html(valueArr[indexArr[index]])
    }

    function componentvideo(){
        const batchcom =  $("#multi_page .cur-list>ul>li")
        if(!$(batchcom)[0]){
            return true
        }
        $("#multi_page .head-left>h3,.cur-page").hide()
        $('#multi_page .head-left .range-box').hide()

        //批量下载
        const batchbtns = `<button class="batchbtn batchbtn-video batchbtn-video-list part">下载</button>`

        //批量开关点击事件
        $(document).on('click','.batchSwitch',function(){
            $("#multi_page .cur-list>ul.list-box>li .duration").toggle()
            if(!btnflag){
                $(this).css("color","#00a1d6")
                $(batchcom).append(batchbtns)
                btnflag = true
            }else{
                $(this).css("color","")
                $(".batchbtn").remove()
                btnflag = false
            }
        })
        //选集分布[块分布|列表分布]
        /*$(document).on('click', '#multi_page .head-left .range-box>i', function(){
            if(btnflag){
                $(".batchbtn").remove()
                if($(this).hasClass("van-icon-general_viewmodule")){
                    $(".cur-list .module-box>li").append(batchbtns)
                }else{
                    if($(batchcom)[0]){
                        $(batchcom).append(batchbtns)
                    }
                }
            }
        })*/
    }
    function componentbangumi(){
        if(!$("#eplist_module .list-wrapper>ul>li")[0]|| $("#eplist_module .list-wrapper>ul>li:has(.badge)").length == $("#eplist_module .list-wrapper>ul>li").length){
            return true
        }
        $("#eplist_module .list-title.clearfix>h4").hide()
        //批量下载
        const batchbtns = `<button class="batchbtn batchbtn-bangumi">下载</button>`
        const dmbatchbtns = `<button class="batchbtn batchbtn-bangumi dmbtn">弹幕</button>`
        //批量开关点击事件
        $(document).on('click','.batchSwitch>span',function(){
            if(!btnflag){
                $(this).css("color","#00a1d6")
                $("#eplist_module .list-wrapper>ul>li.ep-item:not(.badge)").append(batchbtns)
                $("#eplist_module .list-wrapper>ul>li.ep-item:has(.badge)").append(dmbatchbtns)
                btnflag = true
            }else{
                $(this).css("color","")
                $(".batchbtn").remove()
                btnflag = false
            }
        })
        //选集分布[块分布|列表分布]
        $(document).on('click', '.mode-change', function(){
            if(btnflag){
                $(".batchbtn").remove()
                $("#eplist_module .list-wrapper>ul>li.ep-item:not(.badge)").append(batchbtns)
                $("#eplist_module .list-wrapper>ul>li.ep-item:has(.badge)").append(dmbatchbtns)
            }
        })
        //番剧分集列表滚动事件，渲染因滚动而消失的“下载按钮”
        $("#eplist_module .list-wrapper").scroll(function(){
            if(btnflag){
                console.log(1)
                setTimeout(function () {
                    $("#eplist_module .list-wrapper>ul>li.ep-item:not(:has(>button))").append(batchbtns)
                    $("#eplist_module .list-wrapper>ul>li.ep-item:has(.badge)").append(dmbatchbtns)
                }, 100)
            }
        })
    }
    function componentMedialist(){
        let batchcom = $("#playerAuxiliary .player-auxiliary-playlist-item")

        $("#playerAuxiliary .player-auxiliary-playlist-bottom").empty()
        //批量下载
        const batchbtns = `<button class="batchbtn" style="float:right">下载</button>`

        //批量开关点击事件
        $(document).on('click','.batchSwitch',function(event){
            $("#playerAuxiliary .bui-collapse-wrap:eq(1) div").unbind()
            if(!btnflag){
                $(this).css("color","#00a1d6")
                $(batchcom).append(batchbtns)
                btnflag = true
            }else{
                $(this).css("color","")
                $(".batchbtn").remove()
                btnflag = false
            }
            setTimeout(function () {
                $(".bui-collapse-body:eq(1)").css("height","")
            }, 500)
        })
    }
    function timetaskforquality(){
        //循环等待视频加载获取视频质量
        var qualityinterval = window.setInterval(function () {
            var tempQualitys
            if(preurl.startsWith('https://www.bilibili.com/video')){
                tempQualitys = $("ul.bui-select-list>li.bui-select-item")
            }else if(preurl.startsWith('https://www.bilibili.com/bangumi')){
                tempQualitys = $("ul.squirtle-select-list.squirtle-quality-select-list.squirtle-dialog>li")
            }
            if($(tempQualitys)[0]!=undefined){
                $(tempQualitys).each(function(){
                    let value = $(this).attr("data-value")
                    let name = $(this).text().replace(/\s/g,"").replace("登录即享","")
                    let span = `<span data-value="${value}">${name}</span>`
                    if($(this).hasClass("active")|| $(this).hasClass("bui-select-item-active")){
                        if(value > 80){
                            $(".qualitys").html(`<span data-value="64">720P高清</span>`)
                        }else{
                            $(".qualitys").html(span)
                        }
                    }
                    if(value!='0' && value < 112){
                        qualityArr.push(span)
                    }
                })
                clearInterval(qualityinterval)
            }
        }, 1000)
        }
    //定时任务
    function timetack(){
        const interval = window.setInterval(function () {
            //页面URL改变重置下载页面
            if (preurl != document.URL) {
                $('#showmsg').hide()
                $("#showmsg .downloadInfo").empty()
                preurl = document.URL
            }
            //视频网页全屏隐藏下载按钮
            if($(".bilibili-player-video-btn.bilibili-player-video-web-fullscreen").hasClass("closed")||$(".squirtle-video-pagefullscreen.squirtle-video-item").hasClass("active")){
                $('#bilibilidownload').parent().hide()
            }else{
                $('#bilibilidownload').parent().show()
            }
            if($(".dplayer-video.dplayer-video-current")[0] !=undefined){
                alert($(".dplayer-video.dplayer-video-current").attr("src"))
                clearInterval(interval)
            }
        }, 1000)
        }
    //批量下载，点击单个下载
    function batchdownloadoneForbangumi(href,This){
        const dmflag = $(This).hasClass("dmbtn")?true:false
        epList = unsafeWindow.__INITIAL_STATE__.epList
        let currentid = /\d{1,}/.exec(href)[0]
        for (let i = 0,len = epList.length; i < len; i++) {
            if(epList[i].id == currentid){
                cid = epList[i].cid
                aid = epList[i].aid
                const temptitle = epList[i].titleFormat != "" ? epList[i].titleFormat+"："+epList[i].longTitle : epList[i].longTitle
                dmdownload(danmuTypeArr1[indexArr[2]],cid,temptitle)
                dmflag?batchdownloadmodel("bangumi"):{}
                break
            }
        }
    }
    function batchdownloadoneForvideo(href){
        ydata = unsafeWindow.__INITIAL_STATE__
        cid = ydata.videoData.pages[href.split("?p=")[1]-1].cid
        const part = ydata.videoData.pages[href.split("?p=")[1]-1].part
        aid = ydata.aid
        dmdownload(danmuTypeArr1[indexArr[2]],cid,part)
        batchdownloadmodel("video")
    }
    function batchdownloadoneFormedialist(This){

    }
    function batchdownloadmodel(jsontype){
        const quality = $(".qualitys>span").attr("data-value")
        downurl = `https://api.bilibili.com/x/player/playurl?cid=${cid}&avid=${aid}&qn=${quality}`
        queryDown(downurl, 3)
        if(jsonflag){
            downloadRenameJson(jsontype)
            jsonflag = false
        }
    }
    //批量下载回调处理
    function batchback(result){
        const temp = count++
        const urls = result.data.durl[0].backup_url
        urls.push(result.data.durl[0].url)
        const url = urls[indexArr[0]]
        const tempa = `<a style="display:none" id="tempadownload${temp}" href="${url}" />`
        $(document.body).append(tempa)
        $(`#tempadownload${temp}`)[0].click()
        setTimeout(function () {
            $(`#tempadownload${temp}`).remove()
        }, 200)
    }

    //番剧电影下载
    function getbangumiData(){
        ydata = unsafeWindow.__INITIAL_STATE__
        epInfo = ydata.epInfo
        aid = epInfo.aid
        cid = epInfo.cid
        pic = epInfo.cover
        badge = epInfo.badge
        p = epInfo.i == undefined ? '1' : epInfo.i + 1
        title = $(".media-title").text()
        downurl = `https://api.bilibili.com/x/player/playurl?cid=${cid}&avid=${aid}`

        $(".barrage").attr("title",`${title}第${p}集`).attr("data-id",cid)
        $(".cover").attr("title",title).attr("data-url",pic)
        $(".title bdo").html(title)
        $(".subtitle bdo").html(`第${p}集`)

        if(badge == ''){
            queryDown(downurl, 1)
        }else{
            // $("#showmsg .downloadInfo").append(`<b style="color:red;line-height: 3;">版权原因，会员视频无法下载</b>`)
            const dhtml = `
                <a href="javascript:void(0)" id="parseBadge" class="blcolor cover">会员完美解析</a>
                <label>
                <a href="javascript:void(0)" id="badgedown" class="blcolor cover" style="display:none">下载</a>
                <br>
                <label>说明：解析有点延迟，请拖动一下进度条</label>
            `
            $("#showmsg .downloadInfo").append(dhtml)
            $("#showmsg .showtime").hide()
            var playurl
            $(document).on('click','#showmsg #parseBadge',function(event){
                $(this).text("解析中。。。").css("pointer-events","none")
                GM_xmlhttpRequest({
                    'method': 'GET',
                    'url': `https://vip.jianjians.com/beiyong/?url=`+window.location.href,
                    'onload': function (result) {
                        if(result.status == 200){
                            try{
                                const url = /url = '.*'/.exec(result.responseText)[0].split(`'`)[1]
                                playurl = decodeURIComponent(escape(window.atob(url))).replace("http","https")
                                /*if(playurl){
                                    $('#showmsg #badgedown').attr("href",playurl).show()
                                }*/
                                console.log(`会员视频链接：${playurl}`)
                                if( $(".twp-mask.twp-static")[0]){
                                    $(".twp-mask.twp-static").empty().append(`<video controls="" autoplay="" style="width:100%;height:100%" name="media"><source src="${playurl}" type="video/mp4"></video>`)
                                }

                                if($("#player_module #bilibili-player video")[0]){
                                    $("#player_module #bilibili-player video").attr("src",playurl)
                                    $(".bpx-player-toast-item").hide()
                                }
                            }catch{
                                $('#showmsg #parseBadge').text("解析出错")
                            }
                        }
                        $('#showmsg #parseBadge').text("会员完美解析").css("pointer-events",'')
                    },
                    error: function (e) {
                        $('#showmsg #parseBadge').text("解析出错")
                        console.log(e.responseText);
                    }
                })
            })
        }
    }
    //普通视频下载
    function getVideoData() {
        ydata = unsafeWindow.__INITIAL_STATE__
        p = ydata.p
        aid = ydata.videoData.aid
        cid = ydata.videoData.pages[p - 1].cid
        bvid = ydata.videoData.bvid
        ptitle = ydata.videoData.pages[p - 1].part
        title = ydata.videoData.title
        pic = ydata.videoData.pic
        downurl = `https://api.bilibili.com/x/player/playurl?cid=${cid}&bvid=${bvid}&otype=json&avid=${aid}`
        //https://api.bilibili.com/x/player/playurl?cid=85793097&bvid=BV1zb411M7NQ&qn=80&type=&otype=json&fourk=1&fnver=0&fnval=80&session=ec9e6190f71492a3899a96cbfc9c581c
        console.log("****************b站浏览器参数信息*******************")
        console.log(unsafeWindow.__INITIAL_STATE__)
        const conmsg =
              `*******************视频基本信息*********************************************************************************
** bvid：${bvid}
** 封面：${pic}
** 标题：${title}
** 当前P的标题：${ptitle}
        *******************视频基本信息*********************************************************************************
        `
        console.log(conmsg)
        $(".barrage").attr("title",title).attr("data-id",cid)
        $("#showmsg .cover").attr("title",title).attr("data-url",pic)
        $("#showmsg .title bdo").html(title)
        if($("#multi_page")[0]!=undefined){
            $("#showmsg .subtitle label:first").html(`P${p}：`)
            $("#showmsg .subtitle bdo").html(`${ptitle}`)
        }else{
            $("#showmsg .subtitle").empty()
        }
        queryDown(downurl, 1)
    }
    //普通视频下载
    function getVideoDataMedialist() {
        const ele = $(".player-auxiliary-playlist-item-active");
        aid = $(ele).attr("data-aid")
        cid = $(ele).attr("data-cid")
        bvid = $(ele).attr("data-bvid")
        title = $("#viewbox_report .video-title").attr("title")
        downurl = `https://api.bilibili.com/x/player/playurl?cid=${cid}&bvid=${bvid}&otype=json&avid=${aid}`
        //https://api.bilibili.com/x/player/playurl?cid=85793097&bvid=BV1zb411M7NQ&qn=80&type=&otype=json&fourk=1&fnver=0&fnval=80&session=ec9e6190f71492a3899a96cbfc9c581c
        console.log("****************b站浏览器参数信息*******************")
        const conmsg =
              `*******************视频基本信息*********************************************************************************
** bvid：${bvid}
** 标题：${title}
        *******************视频基本信息*********************************************************************************
        `
        console.log(conmsg)
        $(".barrage").attr("title",title).attr("data-id",cid)
        $("#showmsg .title bdo").html(title)
        $("#showmsg .subtitle").hide()
        try{
            GM_xmlhttpRequest({
                'method': 'GET',
                'url': `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`,
                'onload': function (resp) {
                    pic = JSON.parse(resp.response).data.pic
                    $("#showmsg .cover").attr("title",title).attr("data-url",pic)
                }
            })}catch{
                $("#showmsg .cover").hide()
            }
        queryDown(downurl, 1)
    }
    //普通视频下载——首次获取所有可下载视频质量
    function firstback(result) {
        console.log(`*********************************下载接口信息*********************************`)
        console.log(result)

        let downarr = result.data.accept_quality.sort((a,b)=>a-b)
        for (let v = 0,len = downarr.length; v < len; v++) {
            queryDown(`${downurl}&qn=${downarr[v]}`, 2, downarr[v])
        }
    }
    //普通视频下载——从首次获取视频质量循环获取下载链接
    function back(result, curquality) {
        const quality = result.data.quality
        if (quality != curquality) {
            return
        }
        const urls = result.data.durl[0].backup_url
        urls.push(result.data.durl[0].url)
        const timelength = result.data.timelength
        const timestr =  getTimeFormat(timelength)
        const size = result.data.durl[0].size
        const accept_description = result.data.accept_description[result.data.accept_quality.map(item => item).indexOf(quality)]
        console.log(`视频信息： ${accept_description}   ${(size / 1024 / 1024).toFixed(2)}MB   ${timestr}`)
        $("#showmsg .showtime bdo").html(timestr)

        let dmsg = `
               <div class="${quality}">
               <div>下载链接：【${accept_description}】|【${(size / 1024 / 1024).toFixed(2)}MB】</div>
               <div class="downloadways${quality}"></div>
               <div>
               <div class="clear" />
               `
        $('#showmsg .downloadInfo').append(dmsg)
        for (let i = 0,len = urls.length; i < len; i++) {
            console.log(`${downloadline[i]}：${urls[i]}`)
            $('#showmsg .downloadways'+quality+'').append(`<div class="dlbtn"><a download="${ptitle}" href="${urls[i]}" class="blcolor" target="_blank">${downloadline[i]}</a></div>`)
        }
    }
    //批量改名json
    function downloadRenameJson(type){
        var arr = []
        var pages
        if(type == "video"){
            pages = unsafeWindow.__INITIAL_STATE__.videoData.pages
            for(let i = 0,len = pages.length;i<len;i++){
                arr.push({cid:pages[i].cid,name:pages[i].part})
            }
        }else{
            var temptitle
            pages = unsafeWindow.__INITIAL_STATE__.epList
            for(let i = 0,len = pages.length;i<len;i++){
                if(pages[i].badge!=""){
                    continue
                }
                temptitle = pages[i].titleFormat != "" ? pages[i].titleFormat+"："+pages[i].longTitle : pages[i].longTitle
                arr.push({cid:pages[i].cid,name:temptitle})
            }
        }
        var str = JSON.stringify(arr)
        $(document.body).append(`<a id="downloadRenameJson" href='data:text/paint; utf-8,${str}' download="renameJson.txt"></a>`)
        $("#downloadRenameJson")[0].click()
        $("#downloadRenameJson").remove()
    }
    //时长转换
    function getTimeFormat(timelength){
        let hour = '0' + parseInt((timelength % (1000 * 60 * 60*60)) / (1000 * 60 * 60)).toString()
        let minute = parseInt((timelength % (1000 * 60 * 60)) / (1000 * 60)).toString()
        let second = parseInt((timelength % (1000 * 60)) / 1000).toString()
        minute = minute.length == 1 ? '0' + minute : minute
        second = second.length == 1 ? '0' + second : second
        return `${hour}:${minute}:${second}`
    }

    //下载ajax
    function queryDown(url, type, curquality) {
        //跨域
        $.support.cors = true
        $.ajax({
            type: "GET",
            //不带请求头，避免跨域预检请求（请求方法:OPTIONS）
            //contentType: "application/json; charset=utf-8",
            xhrFields: { withCredentials: true },//跨域
            url: url,
            success: function (result) {
                if (type == 1) {
                    firstback(result)
                } else if(type == 2){
                    back(result, curquality);
                } else if(type == 3){
                    batchback(result)
                }
            },
            error: function (e) {
                console.log(e.responseText);
            }
        });
    }
    //颜色十进制转十六进制
    function decimalColorToHTMLcolor(number) {
        //converts to a integer
        var intnumber = number - 0;
        // isolate the colors - really not necessary
        var red, green, blue;
        // needed since toString does not zero fill on left
        var template = "#000000";
        // in the MS Windows world RGB colors
        // are 0xBBGGRR because of the way Intel chips store bytes
        red = (intnumber&0x0000ff) << 16;
        green = intnumber&0x00ff00;
        blue = (intnumber&0xff0000) >>> 16;
        // mask out each color and reverse the order
        intnumber = red|green|blue;
        // toString converts a number to a hexstring
        var HTMLcolor = intnumber.toString(16);
        //template adds # for standard HTML #RRGGBB
        HTMLcolor = template.substring(0,7 - HTMLcolor.length) + HTMLcolor;
        return HTMLcolor;
    }

    //获取视频的用户打赏信息
    function getVideoAffectInfo() {
        //跨域
        $.support.cors = true
        $.ajax({
            type: "GET",
            //contentType: "application/json;charset=UTF-8",
            url: "https://api.bilibili.com/x/web-interface/archive/stat?bvid=" + bvid,
            xhrFields: { withCredentials: true },//跨域
            success: function (result) {
                console.log("===用户打赏信息===");
                console.log(result)
            },
            error: function (e) {
                console.log(e.responseText);
            }
        });
    }


    //xml弹幕转换ass插件,油猴插件名称bilibili ASS Danmaku Downloader
    {
        // 设置项
        var config = {
            'playResX': 1080,           // 屏幕分辨率宽（像素）
            'playResY': 810,           // 屏幕分辨率高（像素）
            'fontlist': [              // 字形（会自动选择最前面一个可用的）
                'Microsoft YaHei UI',
                'Microsoft YaHei',
                '文泉驿正黑',
                'STHeitiSC',
                '黑体',
            ],
            'font_size': 1.0,          // 字号（比例）
            'r2ltime': 12,              // 右到左弹幕持续时间（秒）
            'fixtime': 4,              // 固定弹幕持续时间（秒）
            'opacity': 0.7,            // 不透明度（比例）
            'space': 0,                // 弹幕间隔的最小水平距离（像素）
            'max_delay': 6,            // 最多允许延迟几秒出现弹幕
            'bottom': 0,              // 底端给字幕保留的空间（像素）
            'use_canvas': null,        // 是否使用canvas计算文本宽度（布尔值，Linux下的火狐默认否，其他默认是，Firefox bug #561361）
            'debug': false,            // 打印调试信息
        };

        var debug = config.debug ? console.log.bind(console) : function () { };

        // 将字典中的值填入字符串
        var fillStr = function (str) {
            var dict = Array.apply(Array, arguments);
            return str.replace(/{{([^}]+)}}/g, function (r, o) {
                var ret;
                dict.some(function (i) { return ret = i[o]; });
                return ret || '';
            });
        };

        // 将颜色的数值化为十六进制字符串表示
        var RRGGBB = function (color) {
            var t = Number(color).toString(16).toUpperCase();
            return (Array(7).join('0') + t).slice(-6);
        };

        // 将可见度转换为透明度
        var hexAlpha = function (opacity) {
            var alpha = Math.round(0xFF * (1 - opacity)).toString(16).toUpperCase();
            return Array(3 - alpha.length).join('0') + alpha;
        };

        // 字符串
        var funStr = function (fun) {
            return fun.toString().split(/\r\n|\n|\r/).slice(1, -1).join('\n');
        };

        // 平方和开根
        var hypot = Math.hypot ? Math.hypot.bind(Math) : function () {
            return Math.sqrt([0].concat(Array.apply(Array, arguments))
                             .reduce(function (x, y) { return x + y * y; }));
        };

        // 创建下载
        var startDownload = function (data, filename) {
            var blob = new Blob([data], { type: 'application/octet-stream' });
            var url = window.URL.createObjectURL(blob);
            var saveas = document.createElement('a');
            saveas.href = url;
            saveas.style.display = 'none';
            document.body.appendChild(saveas);
            saveas.download = filename;
            saveas.click();
            setTimeout(function () { saveas.parentNode.removeChild(saveas); }, 1000)
            document.addEventListener('unload', function () { window.URL.revokeObjectURL(url); });
        };

        // 计算文字宽度
        var calcWidth = (function () {

            // 使用Canvas计算
            var calcWidthCanvas = function () {
                var canvas = document.createElement("canvas");
                var context = canvas.getContext("2d");
                return function (fontname, text, fontsize) {
                    context.font = 'bold ' + fontsize + 'px ' + fontname;
                    return Math.ceil(context.measureText(text).width + config.space);
                };
            }

            // 使用Div计算
            var calcWidthDiv = function () {
                var d = document.createElement('div');
                d.setAttribute('style', [
                    'all: unset', 'top: -10000px', 'left: -10000px',
                    'width: auto', 'height: auto', 'position: absolute',
                    '',].join(' !important; '));
                var ld = function () { document.body.parentNode.appendChild(d); }
                if (!document.body) document.addEventListener('DOMContentLoaded', ld);
                else ld();
                return function (fontname, text, fontsize) {
                    d.textContent = text;
                    d.style.font = 'bold ' + fontsize + 'px ' + fontname;
                    return d.clientWidth + config.space;
                };
            };

            // 检查使用哪个测量文字宽度的方法
            if (config.use_canvas === null) {
                if (navigator.platform.match(/linux/i) &&
                    !navigator.userAgent.match(/chrome/i)) config.use_canvas = false;
            }
            debug('use canvas: %o', config.use_canvas !== false);
            if (config.use_canvas === false) return calcWidthDiv();
            return calcWidthCanvas();

        }());

        // 选择合适的字体
        var choseFont = function (fontlist) {
            // 检查这个字串的宽度来检查字体是否存在
            var sampleText =
                'The quick brown fox jumps over the lazy dog' +
                '7531902468' + ',.!-' + '，。：！' +
                '天地玄黄' + '則近道矣';
            // 和这些字体进行比较
            var sampleFont = [
                'monospace', 'sans-serif', 'sans',
                'Symbol', 'Arial', 'Comic Sans MS', 'Fixed', 'Terminal',
                'Times', 'Times New Roman',
                '宋体', '黑体', '文泉驿正黑', 'Microsoft YaHei'
            ];
            // 如果被检查的字体和基准字体可以渲染出不同的宽度
            // 那么说明被检查的字体总是存在的
            var diffFont = function (base, test) {
                var baseSize = calcWidth(base, sampleText, 72);
                var testSize = calcWidth(test + ',' + base, sampleText, 72);
                return baseSize !== testSize;
            };
            var validFont = function (test) {
                var valid = sampleFont.some(function (base) {
                    return diffFont(base, test);
                });
                debug('font %s: %o', test, valid);
                return valid;
            };
            // 找一个能用的字体
            var f = fontlist[fontlist.length - 1];
            fontlist = fontlist.filter(validFont);
            debug('fontlist: %o', fontlist);
            return fontlist[0] || f;
        };

        // 从备选的字体中选择一个机器上提供了的字体
        var initFont = (function () {
            var done = false;
            return function () {
                if (done) return; done = true;
                calcWidth = calcWidth.bind(window,
                                           config.font = choseFont(config.fontlist)
                                          );
            };
        }());

        var generateASS = function (danmaku, info) {
            var assHeader = fillStr(funStr(function () {/*! ASS弹幕文件文件头
[Script Info]
Title: {{title}}
Original Script: 根据 {{ori}} 的弹幕信息，由 https://github.com/tiansh/us-danmaku 生成
ScriptType: v4.00+
Collisions: Normal
PlayResX: {{playResX}}
PlayResY: {{playResY}}
Timer: 10.0000

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Fix,{{font}},25,&H{{alpha}}FFFFFF,&H{{alpha}}FFFFFF,&H{{alpha}}000000,&H{{alpha}}000000,1,0,0,0,100,100,0,0,1,2,0,2,20,20,2,0
Style: R2L,{{font}},25,&H{{alpha}}FFFFFF,&H{{alpha}}FFFFFF,&H{{alpha}}000000,&H{{alpha}}000000,1,0,0,0,100,100,0,0,1,2,0,2,20,20,2,0

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text

  */}), config, info, {'alpha': hexAlpha(config.opacity) });
            // 补齐数字开头的0
            var paddingNum = function (num, len) {
                num = '' + num;
                while (num.length < len) num = '0' + num;
                return num;
            };
            // 格式化时间
            var formatTime = function (time) {
                time = 100 * time ^ 0;
                var l = [[100, 2], [60, 2], [60, 2], [Infinity, 0]].map(function (c) {
                    var r = time % c[0];
                    time = (time - r) / c[0];
                    return paddingNum(r, c[1]);
                }).reverse();
                return l.slice(0, -1).join(':') + '.' + l[3];
            };
            // 格式化特效
            var format = (function () {
                // 适用于所有弹幕
                var common = function (line) {
                    var s = '';
                    var rgb = line.color.split(/(..)/).filter(function (x) { return x; })
                    .map(function (x) { return parseInt(x, 16); });
                    // 如果不是白色，要指定弹幕特殊的颜色
                    if (line.color !== 'FFFFFF') // line.color 是 RRGGBB 格式
                        s += '\\c&H' + line.color.split(/(..)/).reverse().join('');
                    // 如果弹幕颜色比较深，用白色的外边框
                    var dark = rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114 < 0x30;
                    if (dark) s += '\\3c&HFFFFFF';
                    if (line.size !== 25) s += '\\fs' + line.size;
                    return s;
                };
                // 适用于从右到左弹幕
                var r2l = function (line) {
                    return '\\move(' + [
                        line.poss.x, line.poss.y, line.posd.x, line.posd.y
                    ].join(',') + ')';
                };
                // 适用于固定位置弹幕
                var fix = function (line) {
                    return '\\pos(' + [
                        line.poss.x, line.poss.y
                    ].join(',') + ')';
                };
                var withCommon = function (f) {
                    return function (line) { return f(line) + common(line); };
                };
                return {
                    'R2L': withCommon(r2l),
                    'Fix': withCommon(fix),
                };
            }());
            // 转义一些字符
            var escapeAssText = function (s) {
                // "{"、"}"字符libass可以转义，但是VSFilter不可以，所以直接用全角补上
                return s.replace(/{/g, '｛').replace(/}/g, '｝').replace(/\r|\n/g, '');
            };
            // 将一行转换为ASS的事件
            var convert2Ass = function (line) {
                return 'Dialogue: ' + [
                    0,
                    formatTime(line.stime),
                    formatTime(line.dtime),
                    line.type,
                    ',20,20,2,,',
                ].join(',')
                    + '{' + format[line.type](line) + '}'
                    + escapeAssText(line.text);
            };
            return assHeader +
                danmaku.map(convert2Ass)
                .filter(function (x) { return x; })
                .join('\n');
        };

        /*

下文字母含义：
0       ||----------------------x---------------------->
           _____________________c_____________________
=        /                     wc                      \      0
|       |                   |--v--|                 wv  |  |--v--|
|    d  |--v--|               d f                 |--v--|
y |--v--|  l                                         f  |  s    _ p
|       |              VIDEO           |--v--|          |--v--| _ m
v       |              AREA            (x ^ y)          |

v: 弹幕
c: 屏幕

0: 弹幕发送
a: 可行方案

s: 开始出现
f: 出现完全
l: 开始消失
d: 消失完全

p: 上边缘（含）
m: 下边缘（不含）

w: 宽度
h: 高度
b: 底端保留

t: 时间点
u: 时间段
r: 延迟

并规定
ts := t0s + r
tf := wv / (wc + ws) * p + ts
tl := ws / (wc + ws) * p + ts
td := p + ts

*/

        // 滚动弹幕
        var normalDanmaku = (function (wc, hc, b, u, maxr) {
            return function () {
                // 初始化屏幕外面是不可用的
                var used = [
                    { 'p': -Infinity, 'm': 0, 'tf': Infinity, 'td': Infinity, 'b': false },
                    { 'p': hc, 'm': Infinity, 'tf': Infinity, 'td': Infinity, 'b': false },
                    { 'p': hc - b, 'm': hc, 'tf': Infinity, 'td': Infinity, 'b': true },
                ];
                // 检查一些可用的位置
                var available = function (hv, t0s, t0l, b) {
                    var suggestion = [];
                    // 这些上边缘总之别的块的下边缘
                    used.forEach(function (i) {
                        if (i.m > hc) return;
                        var p = i.m;
                        var m = p + hv;
                        var tas = t0s;
                        var tal = t0l;
                        // 这些块的左边缘总是这个区域里面最大的边缘
                        used.forEach(function (j) {
                            if (j.p >= m) return;
                            if (j.m <= p) return;
                            if (j.b && b) return;
                            tas = Math.max(tas, j.tf);
                            tal = Math.max(tal, j.td);
                        });
                        // 最后作为一种备选留下来
                        suggestion.push({
                            'p': p,
                            'r': Math.max(tas - t0s, tal - t0l),
                        });
                    });
                    // 根据高度排序
                    suggestion.sort(function (x, y) { return x.p - y.p; });
                    var mr = maxr;
                    // 又靠右又靠下的选择可以忽略，剩下的返回
                    suggestion = suggestion.filter(function (i) {
                        if (i.r >= mr) return false;
                        mr = i.r;
                        return true;
                    });
                    return suggestion;
                };
                // 添加一个被使用的
                var use = function (p, m, tf, td) {
                    used.push({ 'p': p, 'm': m, 'tf': tf, 'td': td, 'b': false });
                };
                // 根据时间同步掉无用的
                var syn = function (t0s, t0l) {
                    used = used.filter(function (i) { return i.tf > t0s || i.td > t0l; });
                };
                // 给所有可能的位置打分，分数是[0, 1)的
                var score = function (i) {
                    if (i.r > maxr) return -Infinity;
                    return 1 - hypot(i.r / maxr, i.p / hc) * Math.SQRT1_2;
                };
                // 添加一条
                return function (t0s, wv, hv, b) {
                    var t0l = wc / (wv + wc) * u + t0s;
                    syn(t0s, t0l);
                    var al = available(hv, t0s, t0l, b);
                    if (!al.length) return null;
                    var scored = al.map(function (i) { return [score(i), i]; });
                    var best = scored.reduce(function (x, y) {
                        return x[0] > y[0] ? x : y;
                    })[1];
                    var ts = t0s + best.r;
                    var tf = wv / (wv + wc) * u + ts;
                    var td = u + ts;
                    use(best.p, best.p + hv, tf, td);
                    return {
                        'top': best.p,
                        'time': ts,
                    };
                };
            };
        }(config.playResX, config.playResY, config.bottom, config.r2ltime, config.max_delay));

        // 顶部、底部弹幕
        var sideDanmaku = (function (hc, b, u, maxr) {
            return function () {
                var used = [
                    { 'p': -Infinity, 'm': 0, 'td': Infinity, 'b': false },
                    { 'p': hc, 'm': Infinity, 'td': Infinity, 'b': false },
                    { 'p': hc - b, 'm': hc, 'td': Infinity, 'b': true },
                ];
                // 查找可用的位置
                var fr = function (p, m, t0s, b) {
                    var tas = t0s;
                    used.forEach(function (j) {
                        if (j.p >= m) return;
                        if (j.m <= p) return;
                        if (j.b && b) return;
                        tas = Math.max(tas, j.td);
                    });
                    return { 'r': tas - t0s, 'p': p, 'm': m };
                };
                // 顶部
                var top = function (hv, t0s, b) {
                    var suggestion = [];
                    used.forEach(function (i) {
                        if (i.m > hc) return;
                        suggestion.push(fr(i.m, i.m + hv, t0s, b));
                    });
                    return suggestion;
                };
                // 底部
                var bottom = function (hv, t0s, b) {
                    var suggestion = [];
                    used.forEach(function (i) {
                        if (i.p < 0) return;
                        suggestion.push(fr(i.p - hv, i.p, t0s, b));
                    });
                    return suggestion;
                };
                var use = function (p, m, td) {
                    used.push({ 'p': p, 'm': m, 'td': td, 'b': false });
                };
                var syn = function (t0s) {
                    used = used.filter(function (i) { return i.td > t0s; });
                };
                // 挑选最好的方案：延迟小的优先，位置不重要
                var score = function (i, is_top) {
                    if (i.r > maxr) return -Infinity;
                    var f = function (p) { return is_top ? p : (hc - p); };
                    return 1 - (i.r / maxr * (31/32) + f(i.p) / hc * (1/32));
                };
                return function (t0s, hv, is_top, b) {
                    syn(t0s);
                    var al = (is_top ? top : bottom)(hv, t0s, b);
                    if (!al.length) return null;
                    var scored = al.map(function (i) { return [score(i, is_top), i]; });
                    var best = scored.reduce(function (x, y) {
                        return x[0] > y[0] ? x : y;
                    })[1];
                    use(best.p, best.m, best.r + t0s + u)
                    return { 'top': best.p, 'time': best.r + t0s };
                };
            };
        }(config.playResY, config.bottom, config.fixtime, config.max_delay));

        // 为每条弹幕安置位置
        var setPosition = function (danmaku) {
            var normal = normalDanmaku(), side = sideDanmaku();
            return danmaku
                .sort(function (x, y) { return x.time - y.time; })
                .map(function (line) {
                var font_size = Math.round(line.size * config.font_size);
                var width = calcWidth(line.text, font_size);
                switch (line.mode) {
                    case 'R2L': return (function () {
                        var pos = normal(line.time, width, font_size, line.bottom);
                        if (!pos) return null;
                        line.type = 'R2L';
                        line.stime = pos.time;
                        line.poss = {
                            'x': config.playResX + width / 2,
                            'y': pos.top + font_size,
                        };
                        line.posd = {
                            'x': -width / 2,
                            'y': pos.top + font_size,
                        };
                        line.dtime = config.r2ltime + line.stime;
                        return line;
                    }());
                    case 'TOP': case 'BOTTOM': return (function (isTop) {
                        var pos = side(line.time, font_size, isTop, line.bottom);
                        if (!pos) return null;
                        line.type = 'Fix';
                        line.stime = pos.time;
                        line.posd = line.poss = {
                            'x': Math.round(config.playResX / 2),
                            'y': pos.top + font_size,
                        };
                        line.dtime = config.fixtime + line.stime;
                        return line;
                    }(line.mode === 'TOP'));
                    default: return null;
                };
            })
                .filter(function (l) { return l; })
                .sort(function (x, y) { return x.stime - y.stime; });
        };


        // 获取xml
        var fetchXML = function (cid, callback) {
            GM_xmlhttpRequest({
                'method': 'GET',
                'url': `http://comment.bilibili.com/${cid}.xml`,
                'onload': function (resp) {
                    var content = resp.responseText.replace(/(?:[\0-\x08\x0B\f\x0E-\x1F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g, "");
                    callback(content);
                }
            });
        };

        var fetchDanmaku = function (cid, callback) {
            fetchXML(cid, function (content) {
                callback(parseXML(content));
            });
        };

        var parseXML = function (content) {
            var data = (new DOMParser()).parseFromString(content, 'text/xml');
            return Array.apply(Array, data.querySelectorAll('d')).map(function (line) {
                var info = line.getAttribute('p').split(','), text = line.textContent;
                return {
                    'text': text,
                    'time': Number(info[0]),
                    'mode': [undefined, 'R2L', 'R2L', 'R2L', 'BOTTOM', 'TOP'][Number(info[1])],
                    'size': Number(info[2]),
                    'color': RRGGBB(parseInt(info[3], 10) & 0xffffff),
                    'bottom': Number(info[5]) > 0,
                    // 'create': new Date(Number(info[4])),
                    // 'pool': Number(info[5]),
                    // 'sender': String(info[6]),
                    // 'dmid': Number(info[7]),
                };
            });
        };

        // 获取当前cid
        /*  var getCid = function (callback) {
            debug('get cid...');
            var cid = null, src = null;
            try {
                src = document.querySelector('#bofqi iframe, #moviebofqi iframe').src.replace(/^.*\?/, '');
                cid = Number(src.match(/cid=(\d+)/)[1]);
            } catch (e) { }
            if (!cid) try {
                src = document.querySelector('#bofqi embed, #moviebofqi embed').getAttribute('flashvars');
                cid = Number(src.match(/cid=(\d+)/)[1]);
            } catch (e) { }
            if (!cid) try {
                src = document.querySelector('#bofqi object param[name="flashvars"], #moviebofqi object param[name="flashvars"]').getAttribute('value');
                cid = Number(src.match(/cid=(\d+)/)[1]);
            } catch (e) { }
            if (cid) setTimeout(callback, 0, cid);
            else if (src) GM_xmlhttpRequest({
                'method': 'GET',
                'url': 'http://interface.bilibili.com/player?' + src,
                'onload': function (resp) {
                    try { cid = Number(resp.responseText.match(/<chatid>(\d+)<\/chatid>/)[1]); }
                    catch (e) { }
                    setTimeout(callback, 0, cid || undefined);
                },
                'onerror': function () { setTimeout(callback, 0); }
            }); else {
                setTimeout(getCid, 100, callback);
            }
        };*/

        // 下载的主程序
        /* var mina = function (cid0) {
            getCid(function (cid) {//
                cid = cid || cid0;
                fetchDanmaku(cid, function (danmaku) {
                    var name;
                    try { name = document.querySelector('.viewbox h1, .viewbox h2').textContent; }
                    catch (e) { name = '' + cid; }
                    debug('got xml with %d danmaku', danmaku.length);
                    var ass = generateASS(setPosition(danmaku), {
                        'title': document.title,
                        'ori': location.href,
                    });
                    startDownload('\ufeff' + ass, name + '.ass');
                });
            });
        };*/

        // 显示出下载弹幕按钮
        /*   var showButton = function (count) {
            GM_addStyle('.arc-toolbar .block.fav { margin-right: 0 } .arc-toolbar .block { padding: 0 18px; }');
            var favbar = document.querySelector('.arc-toolbar .block.fav');
            var assdown = document.createElement('div');
            assdown.innerHTML = '<div id="assdown" class="block ass"><span class="t ass_btn"><i style="display: block; width: 80px; height: 80px; background-position: 0px 0px; background-image: url(&quot;data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABVAAAABQCAMAAADImK7dAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAJnUExURf///8zMzBYWFgcHBwEBAdHR0ZycnKampgUFBejo6BcXFxgYGKGhoRUVFQkJCcrKyvT09ExMTBQUFPb29vPz8+vr6+fn5wAAAKmpqdbW1gICAhMTE0dHR/39/bKyshwcHObm5lBQUBsbG7i4uCkpKUZGRnl5eS8vL8TExAMDAywsLCgoKHFxcY+Pj/r6+uLi4khISPz8/O7u7nd3d/7+/vf392FhYfLy8tra2vX19fj4+H9/f1lZWfn5+Xh4eO3t7fv7+1JSUktLS1hYWD8/P6ysrFFRUbGxsZubm8XFxQYGBo6OjldXV29vb729vTk5OVNTU25ubrOzs6enp9DQ0IODg6ioqCoqKs7OzpCQkE9PT1tbW62trScnJ4KCgu/v70BAQMjIyFZWVtzc3DIyMj4+PuDg4ENDQ6qqqnZ2djY2NtTU1ImJibW1tWRkZF5eXnp6ek1NTbS0tGBgYHt7e4qKiuPj40lJSaWlpY2NjUJCQgoKCt/f32VlZXR0dGdnZysrK8vLy97e3pWVlR0dHRkZGXJych8fHy4uLiAgIA0NDbm5uZGRkT09PQ8PD/Hx8b+/vxEREdfX1wwMDOTk5Dg4OHV1dZ+fn8DAwE5OTlpaWtnZ2Xx8fOXl5Wtra+rq6lxcXIaGhoyMjEpKSpeXl5iYmMPDw9jY2ISEhLCwsERERHNzc6CgoGpqasbGxru7u5SUlF9fX5KSkmxsbGJiYjMzM2ZmZgsLCzo6Ouzs7MfHxzQ0NKOjo52dnbe3t4GBgcnJycLCwra2ttvb25mZmeHh4S0tLW1tbSEhIWlpaX5+fjs7O56enk6Zj1EAAAZJSURBVHja7Z33X1NXHIZPxr3BJAxJ5GoNCq4OrRUIIlSQIaKAgFtcuNBaW3fde9S66u7ee++99/6jelETECHkkiPcE57nF03y+kC+wPs5nMR7hAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIcjRPTDQm1Lfzw4cPn7I+TXe6UmLgcvrp1D6cHz58+NT1OZxpTj1mQ/vNhIPi7KP54cOHT2Gf16drPXa4L5U1at/MDx8+fOr6tFRvPOWrp+l0Z1/MDx8+fOr6hMelx/dxk2uJmtENwXKLItnzw4cPn7o+4UnxxJXTXR6RNOwsqxzcNbvqZ00LWypUyfPDhw+fur64hfHmVGDFIvfgrd00am7r55+W3oZCJUeOXPLnOgQHdYMNCvXKtpoRXfF2em9sC9xV1RnFXf/KX1xSc6D2i0K7Fmp+lvkFyQpI8AVzol/gnKAtfHK+//Dh609fe3CIuxuG9Hehnv/+cObxkV2yfMcn+63qHqp9pCTW4+XjvJpdC3W64XYbxkwJvgIj+gU2Cuzgk/T9hw9ff/oUWKEGpromnXGkd8mq1alfrbOmC4ZCxbETqx6vmsgKlRUqPnwJrFDtuoeaX+88032/hWedOGi1UGcEYifCsx/LYQ+VHDlyieyh2rRQL5yeF/PxORePWCzU3B4KNfvRO7MoVHLkyCVhof4y6qeYj795sll2oU6gUMmRI5dYodp0D3X0qLtiPr5zTB2FSi6eXPsOtH32oCdmdfpxy5qW17vPjz1PXuWXUaj3jb+XQiUXT679PRL2eZfEw0anHzfjwfm9+vx4VZ5X+SlUcqxQWaEm5wpV1h4ChUqOHLkBmqNQKVRy5MhRqBQqOXLkbFuo7KFSqOTIsQfNq/wUKjlytz3HuyT6bYVas6FsXJSygupBFCo5cqxQB9AKVdYegklgzhL/A0Pbqd6zchaFSo4cuWTP3ZYr9je/0PmeuU8HBnihcoVzfPiS3xfvmSoOK2dKPXfL5UzyKqYoVKiWLo4ieX748OFT1xfnqX/pmVZOPb3f3/me8mdsVKg9Xb5PWLl8n+z54cOHT11fXOdSa7ozLdPCVexvLdSJUxMo1Nj7r4MWvWKxUHu6wPQFKxeYlj4/fPjwqeszjc40p9/jGdZB4LkJvxnQrRwiLbVQfzgRe4V6zLXMmrCHI1DCDZdHWToxW/b88OHDp66v7d/7na4Oe7MO81YHXOaHs9Qwcgt1zalJLTHq7zVjaaFF4wJ3/XfFwUD0tOjsYPsZfaU/z7588pA1o+z54cOHT13fNcfwqFDz+3z6TQ1t2Sa1UMWR42vPfh0ozI7cLglEKZ272bW8xrJxxbeNTfXHIsvUnEO7OpwivXft1Pmlon/nhw8fPpV9QugRocPr82siMeQWqkgPnatsWpFx49bCytCkCJV7py/ozf8ZmHZpfWRhW7q4cd+MrZE+fTV3bn55v88PHz58Svuib8dyeON50ctyoeYtfTYBX0n+j8bKomt/zfpoX2jT5BtsnrOxuJfK3/+oulaohZ8dnt1QWBz5lT9Yaof54cOHT2lfRCjHt2V353sKK48mplx9vVC/ObVkWTCcHaH3vsDYprZCLZns2p1nu/nhw4dPad91oab7pPgWVuy/+Y7nZ2xPsLb+bG0r1FWZS1rkPN+i9VXmYvT8x19W23B++PDhU9pnCu8RY51pTjm+11e/O6Ltz6eeaLtGStmOlza8mKDx7/UBUd7gzS2S9HyLQq3hX387d3qZLeeHDx8+lX2mcPgYn0/XJOkC728XIu/lTU+2XSNl3raMhIUTUo/+F0prypD1fIsqjLq1RuNCm84PHz58CvuE5467XfLqWYgPD4qSA1uypfkKjKsXx8/Ml+YzC9WorWux7fzw4cOnrs8UpmSmS/SNrvC/85ZEX5lhXF0n0WcWqrvZxvPDhw+fuj6hu+T6PjAWvSHT94/RKLNPxZCQ+2zYxvPDhw+fuj7NmyrVJ95bPkWm7tJf/16R6Qvrzjo7zw8fPnzq+sSwoZpUn2hYI1W3eI9cX97GxeV2nh8+fPjU9QEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgE35H6TIvKpihtxhAAAAAElFTkSuQmCC&quot;);" class="b-icon b-icon-a b-icon-anim-ass" title="弹幕下载"></i><div class="t-right"><span class="t-right-top">弹幕下载</span><span class="t-right-bottom">' + count + '</span></div></span></div>';
            assdown = assdown.firstChild;
            favbar.parentNode.insertBefore(assdown, favbar.nextSibling);
            var timer = null, frame = 0;
            assdown.addEventListener('mouseenter', function () { frame = 0; timer = setTimeout(anim, 0); });
            assdown.addEventListener('mouseleave', function () { clearTimeout(timer); timer = null; });
            var anim = function () {
                if (frame === 16) { timer = null; return; }
                frame++;
                assdown.querySelector('i').style.backgroundPosition = '-' + (frame * 80) + 'px 0';
                setTimeout(anim, 1000 / 16);
            };
        };

        // 初始化按钮
       var initButton = (function () {
            var done = false;
            return function () {
                debug('init button');
                if (!document.querySelector('.arc-toolbar .block.fav')) return;
                getCid(function (cid) {
                    debug('cid = %o', cid);
                    if (!cid || done) return; else done = true;
                    fetchDanmaku(cid, function (danmaku) {
                        showButton(danmaku.length);
                        document.querySelector('#assdown').addEventListener('click', function (e) {
                            e.preventDefault();
                            mina(cid);
                        });
                    });
                });
            };
        }());
*/
        /*
 * Common
 */

        // 初始化
        /*  var init = function () {
            initFont();
            initButton();
        };

        if (document.body) init();
        else window.addEventListener('DOMContentLoaded', init);*/
    }
})();