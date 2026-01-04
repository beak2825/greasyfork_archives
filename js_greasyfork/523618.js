// ==UserScript==
// @name         DY用户主页视频抓取
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  主页视频检测抓取
// @author       You
// @match        https://www.douyin.com/user/*
// @match        https://www.douyin.com/discover*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://unpkg.com/axios/dist/axios.min.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      End-User License Agreement
/* globals jQuery, $, waitForKeyElements */
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/523618/DY%E7%94%A8%E6%88%B7%E4%B8%BB%E9%A1%B5%E8%A7%86%E9%A2%91%E6%8A%93%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/523618/DY%E7%94%A8%E6%88%B7%E4%B8%BB%E9%A1%B5%E8%A7%86%E9%A2%91%E6%8A%93%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
 // 自定义css
    let div_css = `
        .cyOperate{
            width: 500px;
            max-height: 700px;
            overflow-y: auto;
            padding: 15px 20px;
            background: #fff;
            border-radius: 10px;
            position: fixed;
            right: 15%;
            top: 50%;
            transform: translateY(-50%);
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 99999;
            color: #333;
            box-sizing: initial;
        }
        .cyInp input{
            width: 220px;
            height: 40px;
            padding: 0 10px;
            font-size: 14px;
            border-radius: 4px;
            border: 1px solid #aaa;
            margin-left: 20px;
        }
        .cyBtn{
            text-align: center;
        }
        .cyBtn button{
            width: 150px;
            height: 35px;
            background-color: #0096DB;
            color: #fff;
            border: 0;
            border-radius: 3px;
            cursor: pointer;
            font-size: 16px;
            letter-spacing: 3px;
        }
        .cyloading{
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            background-color: rgba(0,0,0,0.5);
            z-index: 9999999;
            display: none;
        }
        .cyloading svg{
            width: 300px;
            height: 300px;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -150px;
            margin-top: -150px;
        }
        .cyloading svg text{
            font-size: 2px;
        }
        .cyInp {
            width: 220px;
            height: 40px;
            padding: 0 10px;
            font-size: 14px;
            border-radius: 4px;
            border: 1px solid #aaa;
            margin:0 0 20px 10px;
        }
        .keyword {
           margin:20px 0;
        }
        .title {
           font-size:16px;
           font-weight:500;
           color:blue;
        }
        .h1_content{
        font-size:22px;
        font-weight:bold;
        display:none;
        }
    `
    // 引用自定义css
    GM_addStyle(div_css);

    let div = `
        <div class="cyOperate">
             <div class="h1_content"><span id="content_text"></span>将在<span id="countdown">60</span> 秒后重新加载</div>
            <div class="cyBtn">
                <button>开始抓取</button>
            </div>
        </div>
        <div class="cyloading">
            <svg
            version="1.1"
            id="dc-spinner"
            xmlns="http://www.w3.org/2000/svg"
            x="0px" y="0px"
            width:"38"
            height:"38"
            viewBox="0 0 38 38"
            preserveAspectRatio="xMinYMin meet"
            >
            <text x="7" y="21" font-family="Monaco" font-size="2px" style="letter-spacing:0.6" fill="#fff">达人抓取中，请勿关闭
            <animate
                attributeName="opacity"
                values="0;1;0" dur="1.8s"
                repeatCount="indefinite"/>
            </text>
            <path fill="#373a42" d="M20,35c-8.271,0-15-6.729-15-15S11.729,5,20,5s15,6.729,15,15S28.271,35,20,35z M20,5.203
            C11.841,5.203,5.203,11.841,5.203,20c0,8.159,6.638,14.797,14.797,14.797S34.797,28.159,34.797,20
            C34.797,11.841,28.159,5.203,20,5.203z">
            </path>
            <path fill="#373a42" d="M20,33.125c-7.237,0-13.125-5.888-13.125-13.125S12.763,6.875,20,6.875S33.125,12.763,33.125,20
            S27.237,33.125,20,33.125z M20,7.078C12.875,7.078,7.078,12.875,7.078,20c0,7.125,5.797,12.922,12.922,12.922
            S32.922,27.125,32.922,20C32.922,12.875,27.125,7.078,20,7.078z">
            </path>
            <path fill="#2AA198" stroke="#2AA198" stroke-width="0.6027" stroke-miterlimit="10" d="M5.203,20
                    c0-8.159,6.638-14.797,14.797-14.797V5C11.729,5,5,11.729,5,20s6.729,15,15,15v-0.203C11.841,34.797,5.203,28.159,5.203,20z">
            <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 20 20"
                to="360 20 20"
                calcMode="spline"
                keySplines="0.4, 0, 0.2, 1"
                keyTimes="0;1"
                dur="2s" repeatCount="indefinite" />
            </path>
            <path fill="#859900" stroke="#859900" stroke-width="0.2027" stroke-miterlimit="10" d="M7.078,20
            c0-7.125,5.797-12.922,12.922-12.922V6.875C12.763,6.875,6.875,12.763,6.875,20S12.763,33.125,20,33.125v-0.203
            C12.875,32.922,7.078,27.125,7.078,20z">
            <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 20 20"
                to="360 20 20"
                dur="1.8s"
                repeatCount="indefinite" />
            </path>
            </svg>
        </div>
    `
    $("body").append(div);
    let rex = window.location.href;
    // apiHost
    const apiHost = "https://api.oa.cyek.com/";
    const vopHost = "https://vop.cyek.com";
    const version = "1.0.4"
    // 查找抖音数据id
    function searchData(object, data) {
        for (var key in object) {
            if (object[key] == object[data]){
                // console.log(key)
                return key
            };
            for(var i in object[key]){
                // console.log(i);
                if(i == data){
                    return key;
                }
            }
        }
    }
    let intervals
    const countdown = (text,callback,time=60)=>{
        clearInterval(intervals); // 清除之前的计时器
        var countdownTimer = time;
        intervals = setInterval(function() {
            document.querySelector(".h1_content").style.display = "flex";
            document.getElementById("content_text").innerText =text;
            document.getElementById("countdown").innerText = countdownTimer;
            countdownTimer--;
            if (countdownTimer < 0) {
                clearInterval(intervals);
                document.querySelector(".h1_content").style.display = "none";
                if(callback) {
                    callback()
                }else{
                    window.location.reload();
                }
            }
        }, 1000);
    }

    function req(url,data,sucFun,specialFun){
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(data),
            onload: function(res) {
                if (res.status == 200) {
                    var text = res.responseText;
                    var json = JSON.parse(text);
                    // console.log(json);
                    if(json.code == 1000){
                        sucFun(json)
                    }else if(json.code == 1002){
                        window.close()
                    }else{
                        window.close()
                        if (typeof(specialFun) == "function") {
                            specialFun()
                        }
                    }
                }
            }
        });
    }

    function getCookie(cname)
    {
        var name = cname + "=";
        var ca = document.cookie.split(';').reverse();
        for(var i=0; i<ca.length; i++)
        {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) return c.substring(name.length,c.length);
        }
        return "";
    }
    function pageClick(page){
        console.log("点击")
        // 找到要点击的页面元素
        var elementToClick = page;
        // 创建一个点击事件
        var clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: false,
            view: unsafeWindow
        });
        elementToClick.dispatchEvent(clickEvent);
    }
    function isYesterday(timestamp) {
        const time = timestamp * 1000
        const now = new Date().getTime();
        const startOfYesterday = new Date().setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000; // 昨天零点的时间戳
        console.log("当前时间戳", time >= startOfYesterday && time < now)
        return time >= startOfYesterday && time < now;
    }
    if(rex.match(/https:\/\/www.douyin.com\/user\/*/) != null){
        const urlParams = new URLSearchParams(unsafeWindow.location.search);
        const isKeyword = urlParams.get('type');
        const id = urlParams.get('id');
        const p_id = urlParams.get('p_id');
        let link_list = []
        let all_list = []
        if(!isKeyword)return
        $(".cyloading").show()
        var token = localStorage.getItem("token");
        var originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() {
            var self = this;
            // 监听readystatechange事件，当readyState变为4时获取响应
            this.onreadystatechange = function() {
                if (self.readyState === 4) {
                    if (self.responseURL.match(/https:\/\/www.douyin.com\/aweme\/v1\/web\/aweme\/post\/*/) != null) {
                        // 在获取到响应后执行你的操作
                        if(!!!self?.response){
                        return setTimeout(()=>{
                             window.location.reload()
                         },10000)
                        }
                        let json = JSON.parse(self.response);
                        let aweme_list = json?.aweme_list
                        if(json?.min_cursor!=0)return
                        getResult(aweme_list)//处理数据
                    }
                }
            };
            // 调用原始的send方法
            originalSend.apply(this, arguments);
        };

        function getResult(list,callback){
            let videoList = list.filter(i => i?.anchor_info?.extra &&
                                        (JSON.parse(i?.anchor_info?.extra)?.[0]?.title &&
                                         JSON.parse(i?.anchor_info?.extra)?.[0]?.product_id &&
                                         JSON.parse(i?.anchor_info?.extra)?.[0]?.elastic_images?.length > 0) &&
                                        isYesterday(i?.create_time) &&
                                        ((i?.video?.height == 1920 && i?.video?.width == 1080) || (i?.video?.height == 1280 && i?.video?.width == 720)
                                        )).map(e => (
                {
                    ukey: "sec_uid",
                    uvalue: e?.author?.sec_uid,
                    title: e?.desc,
                    desc: e?.desc,
                    outside_video_id: e?.aweme_id,
                    type: e?.media_type ? e?.media_type == 4 ? 1 : 2 : 0,
                    collect_count: e?.statistics?.collect_count,
                    comment_count: e?.statistics?.comment_count,
                    digg_count: e?.statistics?.digg_count,
                    share_count: e?.statistics?.share_count,
                    cate: JSON.stringify(e?.video_tag),
                    tag: JSON.stringify(e?.text_extra),
                    cover: e?.video.cover?.url_list[0],
                    cover_list: JSON.stringify(e?.video?.cover?.url_list),
                    cover_width: e?.video?.cover.width,
                    cover_height: e?.video?.cover.height,
                    play_addr: JSON.stringify(e?.video.play_addr),
                    bit_rate: JSON.stringify(e?.video.bit_rate),
                    goods_info: e?.anchor_info?.extra || JSON.stringify([]),
                    video_dura: Math.round(Number(e?.video?.duration / 1000)) || Math.round(Number(e?.duration / 1000)),
                    video_width: e?.video.play_addr.width,
                    video_height: e?.video.play_addr.height,
                    video_size: e?.video.play_addr.data_size,
                    post_time: e?.create_time,
                }
            ))
            if (videoList.length == 0) {
                return window.close()
            }
           let saveUid = {
               "platform_id":1,
               "app_type": "tools_" + 1,
               "app_id": "1",
               "sign": "1",
               "sec_uid":videoList[0].uvalue,
               "access_token": token,
               "result": JSON.stringify(videoList)
           }
           req(apiHost+"/spider/browser/saveSearchStarResult",saveUid,function(res){
               const videoNum = document.querySelector(".MNSB3oPV").innerHTML
               console.log('发文信息上传完毕',videoList.length)
               const vList = videoList.map(item => ({ p_id, v_id: item.outside_video_id ,video_count:videoNum}))
               req(vopHost + '/ting/saveSearchInfo',{re_id: id, result: JSON.stringify(vList)},function(res){
                   console.log('发文信息保存成功：',id)
                   setTimeout(()=>{
                       window.close()
                   },3000)
           })
           })
       }
        countdown("页面",()=>window.location.reload())
    }
    if(rex.match(/https:\/\/www.douyin.com\/discover\/*/)!=null){
        const open = (keyword,id,p_id)=>{
            window.open(`${keyword}?type=keyword&id=${id}&p_id=${p_id}`)
            document.onvisibilitychange=()=>{
                if(!document.hidden){
                    getKeyword()
                }
            }
        }
        //获取关键字
        function getKeyword(){
            let searchKeyword = {
              t_id:1
            }
            clearInterval(intervals); // 清除之前的计时器
            req(vopHost + '/ting/getSearchInfo',searchKeyword,function(res){
                const {url,id,p_id} = res?.result
                if(url){
                    console.log(`==============开始进行${url}链接抓取==============`)
                    open(url,id,p_id)
                }else{
                    countdown("当前暂无关键词",()=>getKeyword(),3)
                }
            })
        }
        // 抓取达人
        $(".cyBtn button").click(function(){
            getKeyword()
        })
    }
        // 登录框拖拽
    function dragInfo(yTop,yBot){
        var _move1=false;//移动标记
        var _x1,_y1;//鼠标离控件左上角的相对位置
        $(".cyOperate").click(function(){
            //alert("click");//点击（松开后触发）
        }).mousedown(function(e){
            //console.log(e);
            _move1=true;
            _x1=e.pageX-parseInt($(".cyOperate").css("left"));
            _y1=e.pageY-parseInt($(".cyOperate").css("top"));
            // $(".operate").fadeTo(20, 0.5);//点击后开始拖动并透明显示
        });
        $(document).mousemove(function(e){
            if(_move1){
                var x=e.pageX-_x1;//移动时根据鼠标位置计算控件左上角的绝对位置
                var y=e.pageY-_y1;
                // console.log("y",y);
                if(x < 0){
                    x = 0;
                }else if(x > $(document).width() - $('.cyOperate').outerWidth(true)){ // 判断是否超出浏览器宽度
                    x = $(document).width() - $('.cyOperate').outerWidth(true)
                }
                if (y < yTop) {
                    y = yTop;
                } else if (y > $(window).height() - $('.cyOperate').outerHeight(true) + yBot) { // 判断是否超出浏览器高度
                    y = $(window).height() - $('.cyOperate').outerHeight(true) + yBot;
                }
                $(".cyOperate").css({top:y,left:x});//控件新位置
            }
        }).mouseup(function(){
            _move1=false;

            // 记录每次拖拽后位置存储
            localStorage.setItem("elLeftLogin",$(".cyOperate").css("left"));
            localStorage.setItem("elTopLogin",$(".cyOperate").css("top"));
            // $(".operate").fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明
        });
    }

    // 获取登录框拖拽后位置
    var elLeftLogin = localStorage.getItem("elLeftLogin");
    var elTopLogin = localStorage.getItem("elTopLogin");
    $(".cyOperate").css({
        "left": elLeftLogin,
        "top": elTopLogin
    })



    dragInfo(100,0)

})();