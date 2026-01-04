// ==UserScript==
// @name         FirstTampermonkey
// @namespace    http://tampermonkey.net/
// @version      0.1.3.9
// @description  hj、caoliu、91辅助工具,免费vip视频.hj禁用账户查看、收费和vip帖子资源查看
// @author       ITXZ1232
// @include        *://hj*.com/*
// @include        *://hj*.top/*
// @include        *://www.hj*.com/*
// @include        *://www.hj*.top/*
// @include        *://hai*.top/*
// @include        *://hai*.com/*
// @include        *://www.hai*.top/*
// @include        *://www.hai*.com/*
// @include        *haijiao.com/*
// @include        *://cl*.com/*
// @include        *://cla*.top/*
// @include        *://pwa*.dsp*.biz/*
// @include        *://pwa*.dsp*.co/*
// @include        *://pwa*.dsp*.me/*
// @include        *://xte*.xyz/*
// @include        *.com/user/*.html
// @include        *.com/vip/*.html
// @include        *.com/shipin/*.html
// @include        *.com/index/home.html
// @grant        GM_xmlhttpRequest
// @charset		      UTF-8
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/477080/FirstTampermonkey.user.js
// @updateURL https://update.greasyfork.org/scripts/477080/FirstTampermonkey.meta.js
// ==/UserScript==



//工具辅助
var tools={
    _this:null,
    _host:window.location.host,
    foot: null,
    key:"",
    id_next:"",
    xteVID:0,
	//true:网页端   false:油猴插件
	isWeb:false,
    Interval_Arr:[],
    //hj的广告状态：true显示状态   false隐藏
    ad:true,
    //hjvideo_url
    videoPrevUrl:"ip.hjcfcf.com",
    //创建元素
    T_CreateDom(item){
        item.TagNmae=item.TagNmae||'button';
        var dom = document.createElement(item.TagNmae);
        dom.id = (item.key || item.btn)+""+Math.random();
        dom.classList.add(item?.classname||item.TagNmae);
        dom.innerText = item.btn;
        dom.onclick = item.func||func[tools.key][item.key];
        dom.style=`
        font-size: 14px;
		padding: 7px 4px;
		margin: 5px 0px;
        `;
        //按钮追加在固定元素中
        tools.foot.append(dom)
    },
    //-请求封装
    _httpRequest(method,url,callback){

			var request=new XMLHttpRequest();
			request.open(method,url);
			request.onreadystatechange = function () {
				if (request.readyState == 4 && request.status == 200) {
					try {
						callback(request.responseText);
					} catch (error) {
					  console.log("error",error);
					}
				}
				console.log("xmlhttpRequest",request.status);
			};
			request.send();

    },
    _downloadTextFile(text, fileName) {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },
    _http(url,func){
        tools._httpRequest("get",url,func);
    },
    _httpPost(url,func){
        tools._httpRequest("post",url,func);
    },
    _isPhone() {
        var info = navigator.userAgent;
        var isPhone = /mobile/i.test(info);
        return isPhone;
    },
	showVideoUrl(param){
		param=param||{open_qq:0,query:null};
		var open_qq=param.open_qq;
		if(param.query==null){

            var _pcDetails=document.querySelector("#app > div:nth-child(2) > .details-box")?.__vue__.articleInfo;
            var _mDetails=document.querySelector("#app div.pagebox.details")?.__vue__.$parent.$children.filter(x=> x.$el._prevClass=="pagebox details")[0].details;

			var _data=(_mDetails || _pcDetails);
            var _video=_data.attachments.filter(x=>x.category=="video")[0];
            console.log("_data",_data);
			var resID=_video.id;
			var id=tools._this.$route.query.pid;
			param.query ={
				//当前帖子ID
				id: Number(resID),
				resource_type: "topic",
				//当前资源ID
				resource_id: Number(id),
				line: "normal1"
			};
		}


		if(document.querySelector("#vip_look1_"+resID)!=null){
			if(open_qq==1){
				document.querySelector("#vip_look1_"+resID).click();
			}
			return;
		}

		// tools._this.MyPostJson("/attachment",param.query,function(t){
            var t=_video;
			console.log("t.remoteUrl",t,t.remoteUrl);
			var url= (t.remoteUrl.indexOf("https://")!=-1?"" :window.location.origin )+t.remoteUrl

			tools._http(url,function(text){
                //debugger;
                var m3u8Arr=text.split("\n");
				// var videoUrl=m3u8Arr[6].replace("0.ts",".m3u8");
                var _domain="p.hjpfe1.com";
                var domain="https://"+_domain;
                var oldTsUrl= m3u8Arr[6];
                var videoUrl_ts = oldTsUrl.slice(0,oldTsUrl.indexOf('0.ts'));
                videoUrl_ts= domain +videoUrl_ts.slice(videoUrl_ts.indexOf('/hjstore'));
                var req=(url,func)=>{
                    fetch(url).then(x=> {
                        func(x.status==404);
                    })
                }
                var eArr=[];
                var sArr=[];
                var _i=0;
                function getLastNum(min,max){
                    var n= parseInt((min+max)/2);
                    var _tsUrl=videoUrl_ts+n+'.ts'
                    if(sArr.includes(n) && eArr.includes(n+1)) return successFunc(n,_i);
                    if(sArr.includes(n-1) && eArr.includes(n)) return successFunc(n-1,_i);

                    req(_tsUrl,function (isError){
                        _i++;
                        //404
                        if(isError){
                            eArr.push(n);
                            getLastNum(min,n);
                        }
                        else{
                            sArr.push(n);
                            getLastNum(n,max);
                        }
                    })
                }
                var successFunc=function(n,_i){
                    console.log("正确数字：",n,"次数：",_i);
                    console.log("执行业务逻辑...");
                    var str=m3u8Arr[4];
                    var keyUrl=str.slice(str.lastIndexOf('URI="')+5,str.indexOf('.key?'));
                    var key=keyUrl.slice(keyUrl.lastIndexOf("/")+1);
                    var c="";//str.slice(str.indexOf('.key?')+5,str.indexOf('",IV='))
                    var iv=str.slice(str.indexOf('IV=')+3);
                    var _url2= videoUrl_ts.slice(videoUrl_ts.indexOf('video/')+6).replace(/\//g,"|");
                    //sArr最后是0 表示下载m3u8文件  否则是查看m3u8文本
                    var sArr=[_url2,key,iv,n,_domain,c,0];
                    console.log(sArr);
                    var m3u8Url2="//vy.okweizhan.com/PlatformManager/pj."+encodeURIComponent(sArr.join('|'))+".m3u8";
                    url = m3u8Url2;
                    var lookUl=url.replace('0.m3u8','1.m3u8');
                    $(".ql-editor").append("<br><a id='vip_look2_"+resID+"' href='"+url+"' target=\"_blank\" style=\"font-size:18px;\">下载m3u8文件</a><br/>");

                    if(!tools._isPhone()){
                        debugger;
                        console.log("PC端...");
                        document.querySelector('.sell_line1').remove();
                        document.querySelector('.sell_line2').remove();
                        document.querySelector(".preview-title > div").textContent="(插件已破解视频-无需购买)"
                        new DPlayer({
                            container: document.querySelector(".video-div"),
                            autoplay: true,
                            lang: 'zh-cn',
                            screenshot: true, // 是否允许截图（按钮），点击可以自动将截图下载到本地
                            loop: false, // 是否自动循环
                            preload: 'auto',
                            volume: 0.7, // 初始化音量
                            mutex: true,
                            hotkey: true,
                            video: {
                                url: url,
                                type: 'customHls',
                                customType: {
                                    customHls: function(video, player) {
                                        const hls = new Hls();
                                        hls.loadSource(video.src)
                                        hls.attachMedia(video)
                                    }
                                }
                            },
                            highlight: [ // 进度条时间点高亮
                                {
                                    text: '5分',
                                    time: 300
                                },
                                {
                                    text: '10分',
                                    time: 600
                                },
                                {
                                    text: '20分',
                                    time: 1200
                                },
                                {
                                    text: '30分',
                                    time: 1800
                                },
                                {
                                    text: '40分',
                                    time: 2400
                                },
                                {
                                    text: '50分',
                                    time: 3000
                                },
                                {
                                    text: '60分',
                                    time: 3600
                                },
                                {
                                    text: '80分',
                                    time: 4800
                                },
                                {
                                    text: '90分',
                                    time: 5400
                                }

                            ]
                        })
                    }
                    else{
                        $(".ql-editor").append("<br><a id='vip_look1_"+resID+"' href='mttbrowser://url="+url+"' target=\"_blank\" style=\"font-size:18px;\">QQ浏览器看视频</a><br/>");
                        document.querySelector(".preview-btn").dataset.url=url;
                        var text2=document.querySelector(".preview-btn")?.textContent;
                        text2=text2.replace('出售内容包含','插件已解锁视频').replace('预览30秒','直接播放');
                        document.querySelector('.sell_line2').textContent="您还没有购买(插件已破解视频-无需购买)";
                        document.querySelector(".preview-btn").textContent=text2;
                    }
                    console.log("m3u8Url2",m3u8Url2);
                }

                var _timeMin=parseInt((t.video_time_length||60)/1.25);
                var _timeMax=parseInt(t.video_time_length*1.5) ||7300;
                console.log("_timeMin",_timeMin);
                console.log("_timeMax",_timeMax);
                if(document.querySelector('.sell-btn')!=null )
                    getLastNum(_timeMin,_timeMax);
                else
                    $(".ql-editor").append("<br><a id='vip_look1_"+resID+"' href=\"mttbrowser://url="+url+"\" target=\"_blank\" style=\"font-size:18px;\">QQ浏览器看视频</a><br/>");

			})
		// })
	}
}


//配置按钮
var obj ={
	"hj":[
		{
			btn: "Login",
			key: 'login'
		},
		{
            //qq浏览器打开视频
			btn: "Q-Video",
			key: 'OpenVideo'
		},
		{
            //QQ浏览器打开短视频
			btn:'Q-短视频',
			key:'openQQ'
		},
		{
			btn:'测试1',
			key:'test1'
		}
	],
	"xc":[
		{
			btn:"Login",
			key:"login"
		},
		{
            //QQ浏览器打开收费视频
			btn:"Q-Video",
			key:"openQQ",
		}
	],
	"91":[
		{
			btn:"登录",
			key:"login"
		},
		{
            //QQ浏览器打开收费视频
			btn:"Q-Video",
			key:"openQQ",
		},
		{
            //当前浏览器打开新窗口看视频
			btn:"新窗口",
			key:"openNew",
		}
	],
    xte:[
        {
            btn:"登录",
            key:"login"
        },
		{
            //QQ浏览器打开收费视频
			btn:"Q-Video",
			key:"openQQ",
		}
    ],
    maomi:[
        {
            btn:"登录",
            key:"login"
        },
		{
            //QQ浏览器打开收费视频
			btn:"Q-Video",
			key:"openQQ",
		}
    ]
}




//执行函数
var func={
    hj:{},
    xc:{},
    "91":{},
    xte:{},
    maomi:{}
};
func.maomi={
    initFunc(){
        if(window.location.pathname.toLowerCase()=='/user/login.html'){
            func.maomi.login();
        }
        for(var it of document.querySelectorAll("div[class*='gao-container']")){
            it.remove();
        }
        // for(var it of document.querySelectorAll("img[src*='https://ad.'],img[src*='.gif']")){
        //     it.parentNode.remove();
        // }
        for(var item of document.querySelectorAll("a[href*='/vip/play']")){
            var url=item.getAttribute('href');
            url=url.replace("/vip/play","/shipin/detail")
            item.setAttribute("href",url);
        }
    },
    init(){
        var _style=document.createElement('style');
        var _html=""

		_style.innerHTML =_html;

		document.body.append(_style);

        setInterval(()=>{
            func.maomi.initFunc();
        },1400);

    },
    login(){
        if(window.location.pathname.toLowerCase()!='/user/login.html'){
            window.location='/user/login.html';
        }

        setTimeout(()=>{
            document.querySelector(".form-container input[type='text']").value="zzc1024102";
            document.querySelector(".form-container input[type='password']").value="zc123456";
            document.querySelector(".form-container input[type='text']").dispatchEvent(new Event('input'));
            document.querySelector(".form-container input[type='password']").dispatchEvent(new Event('input'));
            document.querySelector(".btn-submit").click();
        },1800)

    },
    openQQ(){
       window.open("mttbrowser://url="+window.location);
    }
}

func.xte={
    initFunc(){
        if(document.querySelector("#app").__vue__.$route.path!="/Details"){
            $("a[class*=xte-play]").remove();
        }
        for(var item of document.querySelectorAll("div.templateData > div")){
            if(document.querySelector("#app").__vue__.$route.path=="/Details"){
                var xteVID=JSON.parse(document.querySelector("#app").__vue__.$route.query.category).id;
                if(tools.xteVID==xteVID)
                    continue;
                if(item.__vue__!=null  && item.__vue__?.$parent!=null){
					item.__vue__.$parent.MyData.vip_level = 3;
					item.__vue__.$parent.VIPregistration = false;
					item.__vue__.$parent.VipinsufficientLevel = false;
				}
                var i=1;
                for(var item1 of item.__vue__?.$parent?.PlayRelatedAData){
                    item1.is_vip=0;
                    item1.title="【"+i+"】"+item1.title;

                    document.querySelector(".xte-play"+i)?.remove();
                    var _url="mttbrowser://url="+item1.vod_play_url;
                    $("#app").append("<a class='xte-play"+i+"' href='javascript:window.open(\""+_url+"\")'>播放"+i+"</a>")

                    i++;
                    //console.log(item.__vue__.list);
                }
                tools.xteVID=xteVID;
            }
            else{
                if(item.__vue__?.list!=undefined)
                {
                    for(var item1 of item.__vue__.list){
                        item1.is_vip=0;
                        //console.log(item.__vue__.list);
                    }
                }else if(item.__vue__?.$parent?.list!=undefined){
                    for(var item1 of item.__vue__.$parent.list){
                        item1.is_vip=0;
                        //console.log(item.__vue__.$parent.list);
                    }
                }
            }

        }


    },
    init(){
        var _style=document.createElement('style');
        var _html=""
        for(var i=1;i<=10;i++){
            var top=210+(35*i);
            _html+=`
			.xte-play${i}{
				top: ${top}px;
				position: fixed;
				left: 0px;
                background:#fff;
                padding: 5px 10px;
                opacity: 0.5;
                color: #000;
			}
		`
        }
		_style.innerHTML =_html;

		document.body.append(_style);

        if(window.location.hash.includes("/Signin")){

            document.querySelector(".RegisterBox input[type='text']").value="zzc1024102";
            document.querySelector(".RegisterBox input[type='password']").value="zc123456";
            document.querySelector(".RegisterBox input[type='text']").dispatchEvent(new Event('input'));
            document.querySelector(".RegisterBox input[type='password']").dispatchEvent(new Event('input'));
            document.querySelector(".SigninButton_Box").click();
        }
         setInterval(()=>{
            func.xte.initFunc();
        },2000);
    },
    login(){
        tools._this.$router.push({
			path: "/Signin",
		})


        setTimeout(()=>{
            document.querySelector(".RegisterBox input[type='text']").value="zzc1024102";
            document.querySelector(".RegisterBox input[type='password']").value="zc123456";
            document.querySelector(".RegisterBox input[type='text']").dispatchEvent(new Event('input'));
            document.querySelector(".RegisterBox input[type='password']").dispatchEvent(new Event('input'));
            document.querySelector(".SigninButton_Box").click();
        },1000)

    },
    openQQ(){
        if(document.querySelector("#app").__vue__.$route.path.includes("/Details")){
            var data=document.querySelector("div>.detailsBox").__vue__.detailsdata;
            window.open("mttbrowser://url="+data.vod_play_url);
        }
    }
}

func.hj={
	initFunc:()=>{
        if(document.cookie.indexOf("token=") == -1){
            func.hj.login();
        }
        if(document.querySelector(".addbox")!=undefined){
            document.querySelector(".addbox").remove();
        }
        var _this=tools._this;
        //强改本地数据的 Vip等级
        if( _this.$store.state.userInfo.vip==0){
            _this.$store.state.userInfo={..._this.$store.getters.userInfo,gold:99999,vip:4,depositMoney:99999,diamond:99999};

        }
        //列表禁用用户-进入个人中心
        //             关注列表         分类列表
        var arr=['/user/attention','/forum/forumlist'];
        var arrkey=['.pagebox.attention','.pagebox.forumlist'];

        var _index=arr.indexOf(window.location.pathname);
        if(_index!=-1){
            var __this=$(arrkey[_index])[0].__vue__;
            __this.toUserInfo=function(A){
                //debugger;
                if(_index==2)
                    console.log("__this",__this,_index);
                this.$router.push({
                    path: "/user/userinfo",
                    query: {
                        uid: A
                    }
                })
            }
        }
        //去除置顶的官方帖子
        document.querySelectorAll(".top-topic").forEach(x=> x.parentNode.remove());

        //去除帖子中间的广告
        document.querySelectorAll(".bannerliststyle").forEach(x=> x.remove())

        if(tools._this.$route.path=="/search"){
            var i=0;
            //document.querySelector("#app > div > div.pagebox.search").__vue__.searchList1;
            //_vue.page  页数
            var _vue=document.querySelector("#app > div > div.pagebox.search").__vue__;
            var _data=_vue.searchList1||[];//document.querySelector("div.van-tabs__content > div:nth-child(1) > div")?.__vue__?.dataList||[];
            for(var item of _data){
                i++;
                if(!item.title.includes("丨")){
                    item.title=i+"丨"+item.title;
                    var _url="/post/details?pid="+item.topicId;
                    $("div.pagescroll-box div.van-tabs__content div.van-list > div:nth-child(1) > div:nth-child("+i+") >div")
                        .before("<a href='javascript:window.open(\""+_url+"\")' _blank='target' style='z-index:999;display:block;font-size:18px;margin:10px 0 10px 16px;text-align:left;'>"+i+"丨查看贴子</a>");
                }
            }
        }
        //查看禁用用户个人中心
        if(window.location.pathname=='/user/userinfo'){
            if(document.querySelector(".userinfo").__vue__.isFh){
                //关闭弹出禁用用户
                document.querySelector(".userinfo").__vue__.isFh=false;
            }
            //选中按照最新排序
            //document.querySelector(".userinfo").__vue__.active=3;
            //展开列表
            document.querySelector(".userinfo").__vue__.showlist=true;
            //$(".imgItem").addClass("imgItem2").removeClass("imgItem");
            if($(".van-dialog__message--has-title").text()=="用户涉嫌违规，账号已被封禁"){
                document.querySelector("div.van-hairline--top.van-dialog__footer > button").click();
            }
            $('.special').parent().css({"min-width":"4.4rem","font-size":"14px;","min-height":"1.6rem"});
            $('.special').addClass("special1");
            $('.special').removeClass("special");
        }
        //短视频Vip
        if(window.location.pathname=="/videoplay"){
            func.hj.ShortVideo();
        }
        if(window.location.pathname=="/post/details"){

            //隐藏-查看更多
            $(".html-bottom-box").hide();
            $(".html-box").removeClass("ishide");
            // $(".zzz-1").remove();

            var _pcDetails=document.querySelector("#app > div:nth-child(2) > .details-box")?.__vue__.articleInfo;
            var _mDetails=document.querySelector("#app div.pagebox.details")?.__vue__.$parent.$children.filter(x=> x.$el._prevClass=="pagebox details")[0].details.attachments;
			var _details=(_mDetails || _pcDetails ||[]);
            if(($(".ql-editor").html().indexOf("此处内容售价")!=-1 || _details.length>0)  && $(".ql-editor").html().indexOf("==查看收费图文")==-1 )
                func.hj.LookMoney();


            //查看视频按钮
            // tools.showVideoUrl();
            var imgAll= document.querySelectorAll(".ql-editor p img,.ql-editor > img");
            var useNum=0;
            document.querySelectorAll(".ql-editor p img,.ql-editor > img").forEach(x=>{
                if(x.hasAttribute('index'))
                    useNum++;
            })
            if(imgAll.length>0 && useNum!=imgAll.length ){
                console.log("可以创建事件");
                var i=1;
                for(var item of document.querySelectorAll(".ql-editor p img,.ql-editor > img")){
                    item.setAttribute("index",i);
                    // console.log("item",item);
                    item.onclick=function(){
                        var index=this.getAttribute("index");
                        // console.log("index",this);
                        $(".img-change-btn").remove();

                        setTimeout(function(){
                            var button="<div class='img-change-btn' style='display:flex;position: fixed;bottom: 10px;font-size:22px;width: 100%;left: 0px;z-index:9999999;justify-content: center;'>";
                            button +="<button id='prev_btn_it_hj' onclick=''>上一张</button>";
                            button +="<button id='next_btn_it_hj' onclick=''>下一张</button></div>";
                            imgAll= document.querySelectorAll(".ql-editor p img,.ql-editor > img");
                            $(".van-image-preview__index").html(index+"/"+imgAll.length );
                            document.querySelector(".van-image-preview img").setAttribute("index",index);
                            $("body").after(button);



                            var imgFunc=(n)=>{
                                var index= Number(document.querySelector(".van-image-preview img").getAttribute("index"));
                                index= index+n;
                                var imgs=document.querySelectorAll(".ql-editor p img,.ql-editor > img");
                                var maxNum=imgs.length;
                                index= index>maxNum?maxNum:index;
                                index=index<1?1:index;
                                document.querySelector(".van-image-preview img").src=imgs[index-1].src;
                                document.querySelector(".van-image-preview img").setAttribute("index",index);
                                imgs[index-1].scrollIntoView({behavior:"smooth",block:'end'});
                                $(".van-image-preview__index").html(index+"/"+maxNum );
                            }
                            document.getElementById("prev_btn_it_hj").onclick=function() {
                                imgFunc(-1);
                            }
                            document.getElementById("next_btn_it_hj").onclick=function() {
                                imgFunc(1);
                            }
                        },400)
                        var __time=setInterval(function(){
                            if($(".van-image-preview")[0] !=null &&$(".van-image-preview")[0].style.display=="none"){
                                $(".img-change-btn").remove();
                                clearInterval(__time);
                            }
                        },600);
                    }
                    i++;
                }
            }
        }

	},
	init:()=>{
		var _style=document.createElement('style');
		_style.innerHTML=`
			.disabled_look{
				width: 100%;display: block;position: absolute;margin: 0px;height: 72px;z-index: 2;text-align: center;background: #000;opacity: 0.2;line-height: 72px;font-size: 30px;
			}
            .details .mheader{
				top: 0px!important;
				z-index: 99;
				position:fixed!important;
            }
            .dplayer-video{height:88%!important;}
            .sell-btn{margin-top:50px;}
            .html-box{padding:0px!important;}
            .special1{
            height: auto!important;
            display: inline-block;
            white-space: normal;
            font-size:13px;
            }
            .list-item .t-title{font-size:13px!important;}
            .title-box .imgItem{margin:0!important;}
            .van-list{
                margin-top:18px;
            }
			.mheader{
				bottom:0px;
				top: inherit!important;
				z-index: 99;
				position:fixed!important;
			}
			.ql-editor img{
				width:100%;
                max-height: 30rem;
			}

			.zzz-top{
				top: 300px;
				position: fixed;
				right: 0px;
			}
			.zzz-buy{
				top: 335px;
				position: fixed;
				right: 0px;
			}
			.zzz-end{
				top: 370px;
				position: fixed;
				right: 0px;
			}


            #hj-page-view{width:100%!important;}
            main{width:calc(100% - 310px)!important;margin-left:135px!important;}
            aside{position: fixed;right: 0;top: 30px;background:#fff;}
            .hj-nav-second{position:fixed;top:0!important;left:0!important;}
            .home-news-content{display: flex;flex-wrap: wrap;justify-content: space-between;}
            .home-news-content .list{width:49.5%!important;padding: 6px 4px!important;}
            .home-news-content .list h4{font-size:13px!important;    margin: 5px 0px;}
            .containeradvertising{display:none;}
		`;

		document.body.append(_style);
		tools.T_CreateDom({
			btn:'Top',
			classname:"zzz-top",
			func:function(){
				document.querySelector(".title-box").scrollIntoView({behavior:"smooth",block:'center'});
			}
		})

		tools.T_CreateDom({
			btn:'Buy',
			classname:"zzz-buy",
			func:function(){
                if(document.querySelector(".sell-btn")!=null)
                    document.querySelector(".sell-btn").scrollIntoView({behavior:"smooth",block:'center'});
			}
		})
		tools.T_CreateDom({
			btn:'End',
			classname:"zzz-end",
			func:function(){
				document.querySelector(".floor-list").scrollIntoView({behavior:"smooth"});
			}
		})

		//hj页面-自动执行的代码
		var _si1=setInterval(function(){
			func.hj.initFunc();
		},2400);
        //帖子包含图片、视频、音频描述修改
		var _si2= setInterval(function(){


			var i=0;
			var data=[];
			var isUpdate;
			var splitKey="";
			var isExec=false;
            var _name="";
			var _title="title";
            if(!tools._isPhone()){
                console.log("pc端");
                if(window.location.pathname=="/home"){
                    _name="results";
                    _title="title";
                    splitKey="\r\n";
                    isExec=true;
                    data=document.querySelector("#app > div:nth-child(2) > div").__vue__.homeNews[_name];
                    isUpdate=function(info){
                         return info[_title].indexOf(splitKey)==-1;
                     }
                }
                else if(window.location.pathname.startsWith("/homepage/")){
                    _name="listData";
                    _title="title";
                    splitKey="\r\n";
                    isExec=true;
                    data=document.querySelector("#app .main_body > div").__vue__[_name];
                    isUpdate=function(info){
                         return info[_title].indexOf(splitKey)==-1;
                     }
                }
            }else{
                 if(window.location.pathname=="/home"){

                     var defaultTabName={
                         name:"list",
                         title:"title"
                     };
                     var tabArr={
                         "0":defaultTabName,
                         "1":defaultTabName,
                         "5":{
                             name:"eventList",
                             title:"title",
                         },
                         "6":{
                             name:"followList",
                             title:"title"
                         },
                         "8":defaultTabName,
                         "10":defaultTabName,
                         "11":defaultTabName,
                         "12":defaultTabName,
                         "13":defaultTabName,
                     }
                     i=document.querySelector("#home > div.indexbox > div.index-tab.van-tabs.van-tabs--line > div.van-tabs__content.van-tabs__content--animated")?.__vue__.currentIndex;
                     if(tabArr[i+""]!=undefined){
                         _name=tabArr[""+i].name;
                         _title=tabArr[""+i].title;
                         data=document.querySelector("div.van-tabs__content.van-tabs__content--animated")?.__vue__.$children[i].$children[0][_name]; //document.querySelector("div.van-tabs__content.van-tabs__content--animated > div > div:nth-child("+i+") .list-box")?.__vue__.list;
                         splitKey="<br/>";
                         isUpdate=function(info){
                             return info[_title].indexOf(splitKey)==-1;
                         }
                         isExec=true;
                     }else
                         isExec=false;

                 }
                 else if(window.location.pathname=="/forum/forumlist"){
                     i=document.querySelector("div.pagebox.forumlist > div > div.list-box > div")?.__vue__._data.currentIndex+1;
                     _name="postList";
                     _title="title";
                     data=document.querySelector("div.pagebox.forumlist div.van-tabs__content > div:nth-child("+i+") div.van-clearfix")?.__vue__[_name];
                     splitKey="\r\n";
                     isUpdate=function(info){
                         return info[_title].indexOf(splitKey)==-1  && !info.allTop;
                     }
                     isExec=true;
                 }
                 else if(window.location.pathname=="/user/userinfo"){

                     _name="forumList";
                     _title="title";

                     data=document.querySelector("#app > div > div.userinfo").__vue__.$data[_name];
                     splitKey="\r\n";
                     isUpdate=function(info){
                         return info[_title].indexOf(splitKey)==-1  && !info.allTop;
                     }
                     isExec=true;
                 }
            }
			if(!isExec)return;
            var index=0;
            var k=0;
			for(var info of data){
                k++;
				if(isUpdate(info)){

					var arr=[];
					if(info.hasPic)arr.push("图");
					if(info.hasVideo)arr.push("视");
					if(info.hasAudio)arr.push("音");

					if(arr.length==0)arr.push("文");

					var prevStr =arr.join(" + ");
					info[_title]=k+"：【"+prevStr+"】"+splitKey+info[_title];
				}
                // if(info.allTop){
                //     document.querySelectorAll(".top-topic")[index]?.parentNode.remove();
                //     k++;
                // }
                i++;
			}


		},2000)
		tools.Interval_Arr.push(_si1);
		tools.Interval_Arr.push(_si2);
	},
	login:()=>{
		tools._this.$router.push({
			path: "/login",
		})
		var _login=setInterval(function(){

			if(window.location.pathname=='/login'){
				document.querySelector(".login-form input[type='text']").value="zzc-1024_102";
				document.querySelector(".login-form input[type='password']").value="zc123456";
				document.querySelector(".login-form input[type='text']").dispatchEvent(new Event('input'));
				document.querySelector(".login-form input[type='password']").dispatchEvent(new Event('input'));
				document.querySelector(".login-btn").click();
				var _login2=setInterval(function(){
					if($(".van-dialog .van-dialog__cancel")[0]!=undefined){
						clearInterval(_login2);
						$(".van-dialog .van-dialog__cancel").click();
					}else if(window.location.pathname!='/login'){
						clearInterval(_login2);
					}
				},1000);

				clearInterval(_login);
			}
		},3000)

	},
	test1:()=>{
		window.open('mttbrowser://url=http://103.18.206.125/aspnet_client/system_web/4_0_30319/default/a.html');
	},
	LookMoney:()=>{

		if($(".ql-editor").html().indexOf("==查看收费图文")!=-1) return;

		function p() {
			var r = "ABCD*EFGHIJKLMNOPQRSTUVWX#YZabcdefghijklmnopqrstuvwxyz1234567890";
			this.encode = function(o) {
				var e, a, n, i, c, h, d = "",
					C = 0;
				for (o = t(o); C < o.length;) n = (h = o.charCodeAt(C++)) >> 2, i = (3 & h) << 4 | (e = o.charCodeAt(C++)) >> 4, c = (15 & e) << 2 | (a = o.charCodeAt(C++)) >> 6, h = 63 & a, isNaN(e) ? c = h = 64 : isNaN(a) && (h = 64), d = d + r.charAt(n) + r.charAt(i) + r.charAt(c) + r.charAt(h);
				return d
			}, this.decode = function(t) {
				var e, a, n, i, c, h, d = "",
					C = 0;
				for (t = t.replace(/[^A-Za-z0-9\*\#]/g, ""); C < t.length;) n = r.indexOf(t.charAt(C++)), e = (15 & (i = r.indexOf(t.charAt(C++)))) << 4 | (c = r.indexOf(t.charAt(C++))) >> 2, a = (3 & c) << 6 | (h = r.indexOf(t.charAt(C++))), d += String.fromCharCode(n << 2 | i >> 4), 64 != c && (d += String.fromCharCode(e)), 64 != h && (d += String.fromCharCode(a));
				return o(d)
			};
			var t = function(r) {
					r = r.replace(/\r\n/g, "\n");
					for (var t = "", o = 0; o < r.length; o++) {
						var e = r.charCodeAt(o);
						e < 128 ? t += String.fromCharCode(e) : (127 < e && e < 2048 ? t += String.fromCharCode(e >> 6 | 192) : (t += String.fromCharCode(e >> 12 | 224), t += String.fromCharCode(e >> 6 & 63 | 128)), t += String.fromCharCode(63 & e | 128))
					}
					return t
				},
				o = function(r) {
					for (var t, o, e = "", a = 0, n = 0; a < r.length;)(t = r.charCodeAt(a)) < 128 ? (e += String.fromCharCode(t), a++) : 191 < t && t < 224 ? (n = r.charCodeAt(a + 1), e += String.fromCharCode((31 & t) << 6 | 63 & n), a += 2) : (n = r.charCodeAt(a + 1), o = r.charCodeAt(a + 2), e += String.fromCharCode((15 & t) << 12 | (63 & n) << 6 | 63 & o), a += 3);
					return e
				}
		}
		try{

            var _pcDetails=document.querySelector("#app > div:nth-child(2) > .details-box")?.__vue__.articleInfo;
            var _mDetails=document.querySelector("#app > div > div.pagebox.details")?.__vue__.details;
			var d=_mDetails||_pcDetails;
            if(d==null)
            {
                alert("未找到数据");
                return;
            }

            var imgLen=d.attachments.filter(x=>x.category=="images").length;
            var videoLen=d.attachments.filter(x=>x.category=="video").length;
            var audioLen=d.attachments.filter(x=>x.category=="audio").length;
			$(".ql-editor").append("--==查看收费图文==--<br>图【" + imgLen + "个】<br>视频【" + videoLen + "个】<br>音频【" +audioLen  + "个】");
			d.attachments.forEach(function(r) {
				if ("images" == r.category) {

                    // console.log("r",r);
                    var id=r.id;
					if (d.content.indexOf(r.remoteUrl) == -1) {
						$.get(r.remoteUrl, function(r) {
							var url = (new p).decode(r);
							if($(".ql-editor").html().indexOf(url)!=-1)return;
							var img = document.createElement("img");
							img.src = url;
                            img.setAttribute("lazy","loaded");
                            img.dataset.id=id;
							$(".ql-editor").append(img)
						})
					}
				} else if ("video" == r.category) {
					//查看视频按钮
					tools.showVideoUrl();

				}else if ("audio" == r.category) {
					if (d.content.indexOf(r.remoteUrl) == -1) {
						var audio = document.createElement("audio");
						audio.src = r.remoteUrl;
						audio.controls="true";
						$(".ql-editor").append(audio);
						$(".ql-editor").append("<br><a id='novip_audio' href=\"mttbrowser://url="+r.remoteUrl+"\" target=\"_blank\" style=\"font-size:18px;\">音频查看</a><br>");

					}else if($("#novip_audio").html()==undefined)
						$(".ql-editor").append("<br><a id='novip_audio' href=\"mttbrowser://url="+r.remoteUrl+"\" target=\"_blank\" style=\"font-size:18px;\">音频查看</a><br>");
				}
			})

		}catch(error){
			console.log("报错",error);
		}
		//隐藏-查看更多
		$(".html-bottom-box").hide();
		$(".html-box").removeClass("ishide");
		// $(".zzz-1").remove();
	},
	OpenVideo:()=>{

		//查看视频按钮
		tools.showVideoUrl({open_qq:1});

	},
	ShortVideo:()=>{
		// $("#app").append("<a style=\"position: absolute;bottom: 200px;left: 0px;z-index:9999\" href=\"javascript:document.querySelector('#video_box').__vue__.$data.ischeckData={...document.querySelector('#video_box').__vue__.$data.ischeckData,vip:0,type:1};document.querySelector('#main-player > div.dplayer-video-wrap > video').setAttribute('controls','');$('#main-player > div.dplayer-video-wrap > video').removeAttr('webkit-playsinline');$('#main-player > div.dplayer-video-wrap > video').removeAttr('playsinline');\">免费播放</a>");

        //强行修改数据值
        document.querySelector('#video_box').__vue__.$data.ischeckData={...document.querySelector('#video_box').__vue__.$data.ischeckData,vip:0,type:1};
        if(document.querySelector('#main-player > div.dplayer-video-wrap > video').getAttribute('controls')==null){
            //显示控件
            document.querySelector('#main-player > div.dplayer-video-wrap > video').setAttribute('controls','');
            document.querySelector('#main-player > div.dplayer-video-wrap > video').setAttribute('autoplay','');

            //移除限制
            $('#main-player > div.dplayer-video-wrap > video').removeAttr('webkit-playsinline');
            $('#main-player > div.dplayer-video-wrap > video').removeAttr('playsinline');
        }
	},
	openQQ:()=>{
		document.querySelector("#video_box").__vue__.$data.videoList.forEach((x)=>{
			if("当前短视频ID "+x.id==document.querySelector("#video_box > div.top_row > div:nth-child(2)").textContent){
				console.log("xxxx",x);
				tools.showVideoUrl({
					open_qq:1,
					query:{
						id: x.id,
						resource_type: "video",
						resource_id: x.id,
						line: ""
					}
				});
			}
		})
	}
}



//xiaocao
func.xc={
    initFunc(){
        $(".thread_detail_ads,.my_wrap").remove();

        var isV2=window.location.pathname.startsWith("/v2");
        if(isV2){
            if(location.pathname.startsWith('/v2/thread/')){
                $(".thread_detail_content_shade").hide();
                $(".thread_detail_content_info").css({height:'auto','font-size':"18px"});
            }
            if(location.hash=="#tab=4"){
                //直接进入播放页-无需进入帖子详情
                for(var item of document.querySelectorAll(".clip_list li a[href*='v2/thread/']")){
                    item.href=item.href.replace("/thread/",'/thread-video/').replace("/view",'');
                    item.target="_blank";
                    console.log(item);
                }
            }
        }
    },
    init(){
        var _si=setInterval(function(){
            func["xc"].initFunc();
		},1600);
		tools.Interval_Arr.push(_si);
    },
    openQQ(){
        var isV2=window.location.pathname.startsWith("/v2");
        var _url=document.querySelectorAll("iframe")[0]?.getAttribute("data-src")||null;
        if(isV2){
            if(location.pathname.startsWith('/v2/thread/')){
                _url=document.querySelector("iframe").contentWindow.dp.options.video.url;
            }
            else if(location.pathname.startsWith('/v2/thread-video/')){
                _url=dp.options.video.url;
            }
        }

        if(_url==null) alert("无视频（仅支持详情页）")
        else{
			window.open("mttbrowser://url="+_url)
        }
    },
	login:()=>{
        //改成你的账号
		document.querySelector("#username").value="zzc1024102";
        //改成你的密码
		document.querySelector("#password").value="zc123456";
		document.querySelector(".wap_form_btn").click();
	}
}

//91
func["91"]={
	initFunc:()=>{
		document.querySelector(".home-screen-pwa-container")?.remove();
		document.querySelector(".van-overlay")?.remove();
		document.querySelector(".notice")?.remove();
		document.querySelector(".van-overlay")?.remove();
		document.querySelector(".preview-tip-container")?.remove();
	},
	init:()=>{
		document.querySelector("body > div:nth-child(1)").__vue__.$router.push({path:"/home"})
		var _style=document.createElement('style');
		_style.innerHTML=`
		`;
		document.body.append(_style);
		func["91"].initFunc();
		//页面-自动执行的代码
		var _si1=setInterval(function(){
			func["91"].initFunc();
		},2800);
		tools.Interval_Arr.push(_si1);
	},
	openQQ:(down)=>{
		var pathArr=["/home","/short"]
		var videoUrl="";
		var type=0;
		if(pathArr.indexOf(window.location.pathname)>=0){
			var _vue=document.querySelector(".short-video-list-container").__vue__;
			var nowVideo = _vue.list[_vue.activeIndex];
			videoUrl=nowVideo.playUrl;
			type=0;
		}
		else if(window.location.pathname.indexOf("/releasedetail")){
			var videoArr=document.querySelector("#app > div.main-container > div > div").__vue__.$data.detail.medias.filter((x)=>{
				return x.type==1;
			})
			if(videoArr.length==1){
				videoUrl=videoArr[0].media_url;
			}else{
				alert("视频数量为："+videoArr.length);
				return;
			}
			type=1;
		}else{
			alert("页面位置错误");
			return;
		}
		tools._http(videoUrl,function(data){
			var _url= data.split('\n')[6];
			_url=_url.indexOf(".ts")==-1?data.split('\n')[7]:_url;
			if(_url.indexOf("_0")!=-1){
				_url=_url.split("_0")[0]+".m3u8?"+_url.split("?")[1];
			}
			else if(_url.indexOf("0.ts")!=-1){
				_url=_url.replace("0.ts",".m3u8");
			}
			_url=_url.replace("https://p.yidian.run","https://long.longyuandingyi.com");
			if(down==0)
				window.open("https://m3u8play.com/?play="+_url)
			else
				window.open("mttbrowser://url="+_url)
		})
	},
	openNew:()=>{
		func["91"].openQQ(0);
	},
	login:()=>{
		tools._this.$router.push({
			path: "/login",
		})
		var _login=setInterval(function(){
			if(window.location.pathname=='/login'){
                //改成你的账号
				document.querySelector(".login_page input[type='text']").value="zzc-1024_102";
                //改成你的密码
				document.querySelector(".login_page input[type='password']").value="zc123456";
				document.querySelector(".login_page input[type='text']").dispatchEvent(new Event('input'));
				document.querySelector(".login_page input[type='password']").dispatchEvent(new Event('input'));
				document.querySelector(".login_btn_list > div:nth-child(2)").click();
			}
			setTimeout(function(){
				clearInterval(_login);
			},3000);
		},1000);
	},
}





function T_init(){
	tools.isWeb= typeof(GM_xmlhttpRequest)=="undefined";
    //判断来源-加载不同配置对应按钮
    var key="";
    var _host=window.location.host;
    var _pname=window.location.pathname;
    //新增预判判断来源
    if(/(hj|hai)+[a-zA-Z0-9]{1,15}\.(com|top)$/.test(_host)){
        key="hj";
    }
    else if(/pwa[0-9]{1,5}\.dsp[0-9]{1,6}\.(biz|me|co)$/.test(_host)){
        key="91";
    }
    else if(/(cla|cl|caoliu)[a-zA-Z0-9]{0,6}\.(com|top|fm|sex)$/.test(_host)){
        key="xc";
    }else if(/(xte)+[a-zA-Z0-9]{1,15}\.(xyz)$/.test(_host)){
        key="xte";
    }else if(document.querySelector("title").text.toLowerCase().includes("maomi") && _pname.endsWith(".html")){
        key="maomi";
    }
    if(key.length==0){
        console.log("不符合辅助工具对应网站-停止加载工具");
        //alert("不符合辅助工具对应网站-已停止加载工具");
        return;
    }
    var id_next=key+"_it_xz";


	var cssObj={
		hj:{
			bt:"50",
		},
		xc:{
			bt:"50",
		},
		"91":{
			bt:"72",
		},
        "xte":{
			bt:"72",
		},
        "maomi":{
			bt:"72",
		}
	}
    //创建按钮对应元素
	var foot = document.createElement('div');
    tools.foot=foot;
    //值赋给tools
    tools.key=key;
    tools.id_next=id_next;

    //执行添加操作按钮
	foot.id = 'foot_help_'+id_next;
	foot.style = `
	  position: fixed;
	  bottom:${(cssObj[key]||{bt:"72"}).bt}px;
	  right:0;
	  width: auto;
	  z-index:999;
	  min-height: 38px;
      opacity: 0.5;
	  height:38px;
	  line-height:6px;
	  background-color: #fff;
	  border-top: 2px solid red;
	  border-bottom: 2px solid red;
	`;
	if (!document.getElementById(foot.id)) {
		document.body.append(foot)
		for (let item of obj[tools.key]) {
			tools.T_CreateDom(item)
		}
		var _a= document.createElement('a');
		_a.id = 'foot_show_'+id_next;
		_a.text="关";
		_a.style = `
			position: fixed;
			  bottom:${cssObj[key].bt}px;
			  left:-3px;
			  font-size:14px;
			  z-index:9999999;
			  background:red;
			  color:#fff;
			  font-weight:bold;
			  height:auto;
			  background-color: #000;
			  border: 1px solid;
			  padding: 5px 7px;
			  border: 0px;
              border-radius: 100px;
		`;
		_a.onclick=function(){
			var display=foot.style.display || 'block';
			if(display=='block' || display==''){
				document.querySelector('#foot_help_'+id_next).style.display='none';
				_a.text='开';
			}
			else{
				document.querySelector('#foot_help_'+id_next).style.display='block';
				_a.text='关';
			}
		}
		document.body.append(_a);
		func[key].init();
	}
}



function reloadJS(){

	for(var item of tools.Interval_Arr){
		clearInterval(item);
	}

	document.querySelector("div[id*='foot_help_']").previousElementSibling.remove();
	document.querySelector("div[id*='foot_help_']").nextElementSibling.remove();
	document.querySelector("div[id*='foot_help_']").remove();

}

(function() {
    'use strict';
    // Your code here...
	Function.prototype.constructor = function(){};
    T_init();
    setInterval(function(){

        if((tools._this||"").length!=0)return;
         //获取Vue对象
        var key=tools.key;
        var _this=key=="hj" || key=="xte" ?document.querySelector("#app")?.__vue__:"";
        _this=key=="91" ?document.querySelector("body > div").__vue__:_this;
        tools._this=_this;
        // console.log("vue空-进行了赋值");

    },1800);
    setInterval(function(){
        if(document.getElementsByTagName("video").length>0){
            if(document.querySelector(".video_bs_div")!=null){
                $(".video_bs_div").show();
                return;
            }
            //START---启用3倍音量接口
            var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            var source = audioCtx.createMediaElementSource(document.getElementsByTagName("video")[0]);

            var gainNode = audioCtx.createGain();
            gainNode.gain.value = 3; //3倍音量
            source.connect(gainNode);

            gainNode.connect(audioCtx.destination);
            //END---启用3倍音量接口

            var _html="<div class='video_bs_div' style='position:fixed;top:10px;font-size:14px; right:0px;z-index:99999999;display: flex;justify-content: center;flex-direction: column;'>";
            //var arr=[0.5,1,1.5,2,2.5,3,4,5];
            // for(var i of arr){
            //     _html+="<span style='color:#fff;background:bbb;padding:5px;border: 1px solid #bbb;' onClick=\"document.getElementsByTagName('video')[0].playbackRate="+i+";document.querySelector(\'.vbd_b\').textContent=\'"+i+"倍速\'; \" >"+i+"</span>";
            // }
            _html+="<div> <input class='bs_input_range' type='range' min='0.5' max='2.5' step='0.1' value='1' style='width:230px;'>  <b class='vbd_bs' style='color: red;font-weight: bold;margin-top:5px;'>1【倍】</b>  </div>";
            _html+="<div> <input class='yl_input_range' type='range' min='0.02' max='1'step='0.02' value='0.05'  style='width:230px;'> <b class='vbd_yl' style='color: red;font-weight: bold;margin-top:5px;'>5%【音】</b></div>";
            _html+="</div>";
            $("body").append(_html);

            document.querySelector(".bs_input_range").addEventListener("change",function(){
                var n=this.value;
                document.getElementsByTagName('video')[0].playbackRate=n;
                document.querySelector('.vbd_bs').textContent=(n*1.0).toFixed(1)+"【倍】";
            })
            document.querySelector(".yl_input_range").addEventListener("change",function(){
                var n=this.value;
                document.getElementsByTagName('video')[0].volume=n;
                document.querySelector('.vbd_yl').textContent=(n*100).toFixed(0)+"%【音】";
            })

        }else{
            if(document.querySelector(".video_bs_div")!=null){
                $(".video_bs_div").hide();
            }
        }
    },1200)
})();

