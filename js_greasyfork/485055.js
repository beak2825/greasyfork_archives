// ==UserScript==
// @name         全网VIP视频免费破解去广告，百度文库下载,一键领取淘宝、天猫、京东、唯品会、拼多多隐藏优惠券！全网查券！【免费领取京东淘宝双11超级红包、外卖红包、出行红包】
// @namespace    http://lctnq.yhzu.cn
// @version      1.9.2
// @description  1、一键破解[B站|优酷|腾讯|乐视|爱奇艺|芒果|音悦台]等VIP视频；2、查询商家设置的隐藏优惠券，省钱开心购物，直接领取优惠券购买；3、百度文库解析下载功能。接口不好用了请反馈给我记录更新（QQ群：585709991）。
// @author       LOVEFFF
// @match        *://wenku.baidu.com/view/*
// @match   	 *://*.iqiyi.com/*
// @match   	 *://*.youku.com/*
// @match   	 *://*.v.qq.com/*
// @match   	 *://*.bilibili.com/*
// @match   	 *://*.tudou.com/*
// @match   	 *://film.sohu.com/*
// @match   	 *://*.mgtv.com/*
// @match   	 *://*.acfun.cn/v/*
// @match  	  	 *://*.56.com/*
// @match   	 *://*.pptv.com/*
// @match   	 *://*.le.com/*
// @match   	 *://*.letv.com/*
// @match   	 *://tv.sohu.com/*
// @match   	 *://vip.1905.com/play/*
// @match   	 *://v.yinyuetai.com/video/*
// @match   	 *://v.yinyuetai.com/playlist/*
// @match  	 	 *://*.fun.tv/vplay/*
// @match  		 *://*.wasu.cn/Play/show/*
// @match        *://*.kuaizhan.com/*
// @antifeature  referral-link 【应GreasyFork代码规范要求：含有优惠券查询功能的脚本必须添加此提示！脚本使用过程中无任何强制跳转等行为，代码可查，请大家放心！在此感谢大家的理解...】
// @grant        GM_openInTab
// @grant		 GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/485055/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%A0%B4%E8%A7%A3%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E4%B8%8B%E8%BD%BD%2C%E4%B8%80%E9%94%AE%E9%A2%86%E5%8F%96%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E3%80%81%E4%BA%AC%E4%B8%9C%E3%80%81%E5%94%AF%E5%93%81%E4%BC%9A%E3%80%81%E6%8B%BC%E5%A4%9A%E5%A4%9A%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%EF%BC%81%E5%85%A8%E7%BD%91%E6%9F%A5%E5%88%B8%EF%BC%81%E3%80%90%E5%85%8D%E8%B4%B9%E9%A2%86%E5%8F%96%E4%BA%AC%E4%B8%9C%E6%B7%98%E5%AE%9D%E5%8F%8C11%E8%B6%85%E7%BA%A7%E7%BA%A2%E5%8C%85%E3%80%81%E5%A4%96%E5%8D%96%E7%BA%A2%E5%8C%85%E3%80%81%E5%87%BA%E8%A1%8C%E7%BA%A2%E5%8C%85%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/485055/%E5%85%A8%E7%BD%91VIP%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%A0%B4%E8%A7%A3%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E4%B8%8B%E8%BD%BD%2C%E4%B8%80%E9%94%AE%E9%A2%86%E5%8F%96%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E3%80%81%E4%BA%AC%E4%B8%9C%E3%80%81%E5%94%AF%E5%93%81%E4%BC%9A%E3%80%81%E6%8B%BC%E5%A4%9A%E5%A4%9A%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%EF%BC%81%E5%85%A8%E7%BD%91%E6%9F%A5%E5%88%B8%EF%BC%81%E3%80%90%E5%85%8D%E8%B4%B9%E9%A2%86%E5%8F%96%E4%BA%AC%E4%B8%9C%E6%B7%98%E5%AE%9D%E5%8F%8C11%E8%B6%85%E7%BA%A7%E7%BA%A2%E5%8C%85%E3%80%81%E5%A4%96%E5%8D%96%E7%BA%A2%E5%8C%85%E3%80%81%E5%87%BA%E8%A1%8C%E7%BA%A2%E5%8C%85%E3%80%91.meta.js
// ==/UserScript==
(function() {
    GM_registerMenuCommand("首选全网查券地址",
                           function() {
        window.open("https://4kma.cn/mQ3Fr", "_blank");
    });
    GM_registerMenuCommand("备用淘宝查券地址",
                           function() {
        window.open("http://lctnq.yhzu.cn", "_blank");
    });
    GM_registerMenuCommand("外卖出行生活红包（微信扫一扫）",
                           function() {
        window.open("https://yijllnji.jutuike.cn/#/?code=YIJLLNji", "_blank");
    });
    GM_registerMenuCommand("重置地址码",
                           function() {
        const userInput = prompt('请输入重置地址码：');
        if (userInput !== null) {
            GM_setValue('urlid', userInput);
            alert("重置地址码，初始化中。。。");
            location.reload();
        }
    });
})();
(function () {
    'use strict';
    let MallID = GM_getValue('urlid');
    if (!MallID) {
        MallID = 'initialValue';
        GM_setValue('urlid', 82);
        alert("首次使用脚本，初始化中。。。");
        location.reload();
    }
    var MallUrl = "https://hdkcmsd"+MallID+".kuaizhan.com/?cid=AqHBB6m#/"
    var TBCoupon = MallUrl+"search?keyword=";
    var JDCoupon = MallUrl+"detail?platform=2&super=1&id="
    var VipCoupon = MallUrl+"detail?platform=5&itemid="
    var TBSearch = MallUrl+"search?keyword=";
    var JDSearch = MallUrl+"search?pt=2&keyword="
    var VipSearch = MallUrl+"search?pt=5&keyword="
    var NewAct = "https://m.tb.cn/h.gFs5Hue";
    var Clabel = "领取商品优惠券";
    var AllSearch = "全网搜索";
    var Rlabel = "淘宝双11超级红包";
    var WMPacket = "https://yijllnji.jutuike.cn/#/?code=YIJLLNji";
    var VQPacket = "https://kurl03.cn/6ysaN";
    var WMlabel = "外卖出行生活红包";
    var VQlabel = "京淘活动线报群";
    var WMtitle = "外卖出行生活红包（微信扫一扫）";
    var VQtitle = "京淘活动线报群";
    var TBPacket = "https://m.tb.cn/h.gFs5Hue";
    var JDPacket = "https://u.jd.com/Crq0zY6";
    var VipPacket = "https://t.vip.com/T5da9biJZ3A";
    var TBlabel = "淘宝双11超级红包";
    var JDlabel = "京东双11超级红包";
    var Viplabel = "唯品会红包";
    var TBtitle = "每天可拆1次，10月14日-11月11日";
    var JDtitle = "每天可拆3次，10月14日-11月11日";
    var Viptitle = "每天可拆1次，1月17日-1月31日";
    var ButtonSwitch = 1;
    $(document).ready(function () {
        var host = window.location.host;
        var pid = '';
        var pname = '';
        var cssSelector = '.Actions--root--hwEujgc';
        pid = location.href;
        if (host.indexOf('taobao.com') > 0) {
            pid = pid.split("id=")[1];
            pid = pid.split("&")[0];
            setTimeout(function(){pname = document.title;pname = pname.split("-淘宝网")[0];pid=pname;},1000);
            //pname = $.trim($('.tb-main-title').text());
            //pid=pname;
            //cssSelector = '.tb-action';
        } else if (host == 'chaoshi.detail.tmall.com') {
            pid = pid.split("id=")[1];
            pid = pid.split("&")[0];
            setTimeout(function(){pname = document.title;pname = pname.split("-tmall.com天猫")[0]; pid=pname;},1000);
        } else if (host.indexOf('tmall.hk') > 0) {
            pid = pid.split("id=")[1];
            pid = pid.split("&")[0];
            setTimeout(function(){pname = document.title;pname = pname.split("-tmall.com天猫")[0]; pid=pname;},1000);
        } else if (host.indexOf('tmall.com') > 0) {
            pid = pid.split("id=")[1];
            pid = pid.split("&")[0];
            setTimeout(function(){pname = document.title;pname = pname.split("-tmall.com天猫")[0]; pid=pname;},1000);
        } else if (host.indexOf('jd.com') > 0) {
            pid = window.location.pathname;
            pid = pid.split("/")[1];
            pid = pid.split(".html")[0];
            pname = $.trim($('.sku-name').text());
            cssSelector = '#choose-btns';
        }else if(host.indexOf('kuaizhan.com') > 0){
            var urlinvalid = $.trim($('.warn-label-c').text());
            if(urlinvalid=="域名不存在"){
                MallID++ ;
                if(MallID<82){
                    MallID=82;
                }
                GM_setValue("urlid", MallID);
                alert("地址码已更新为：" + MallID + "，请关闭窗口，并刷新来源页。\n如地址码有误，请在油猴菜单重置地址码。");
            }
        }else if (host.indexOf('vip.com') > 0) {
            function addGlobalStyle(css) {
                var head, style;
                head = document.getElementsByTagName('head')[0];
                if (!head) { return; }
                style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = css;
                head.appendChild(style);
            }
            addGlobalStyle(`
.comparePricess {
    display: block;
    margin-top: 6px;
    font-size: 16px;
    color: #fff;
    text-align: center;
}`);
            pid = window.location.pathname;
            pid = pid.split("-")[2];
            pid = pid.split(".html")[0];
            cssSelector = 'div#J_detail_buy';
            setTimeout(() => {
                pname = document.getElementsByTagName('title')[0].innerHTML;
                $(cssSelector).after(obtainAppendHtml(host,pid,pname));
            },
                       2000);
        }else if(host == 'wenku.baidu.com'){
            $("head").append ('<link  href="https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" type="text/css">');
            var content = document.getElementById('reader-container-inner-1');
            var wenkuLink = location.href;
            let divEle = document.getElementById('hqdiv');
            if(!divEle){
                var para = document.createElement("div");
                para.innerHTML = '<div style="position:fixed;left:10px;top:200px;width:55px;height:100px;z-index:999;" id="hqdiv"></div>';
                document.body.appendChild(para);
                $("#hqdiv").append('<ul id="hq-nav-bar" />');
            }
            $("#hq-nav-bar").append('<li class="level-one" id="hqdownload1"><i class="fa fa-download"></i><ul class="level-two"><li>下载1</li></ul></li><li class="level-one" id="hqdownload2"><i class="fa fa-arrow-circle-down"></i><ul class="level-two"><li>下载2</li></ul></li>');
            document.getElementById("hqdownload1").onclick = function() {
                window.open("http://www.html22.com/d/?url=" + wenkuLink);
            };
            document.getElementById("hqdownload2").onclick = function() {
                window.open("http://bdwk.588230.com/wk.php?urls=" + wenkuLink);
            };
            function addGlobalStyle(css) {
                var head, style;
                head = document.getElementsByTagName('head')[0];
                if (!head) { return; }
                style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = css;
                head.appendChild(style);
            }
            addGlobalStyle(`
#hq-nav-bar {
max-width: 50px;
border: 1px solid #19A97B;
border-radius: 4%;
background-color: white;
-webkit-box-shadow: -2px 3px 2px 0px rgba(5, 0, 0, 0.11);
-moz-box-shadow:    -2px 3px 2px 0px rgba(5, 0, 0, 0.11);
box-shadow:         -2px 3px 2px 0px rgba(5, 0, 0, 0.11);
}
#hq-nav-bar>li {
color: white;
margin: 0;
font-family: 'Open Sans', sans-serif;
font-size: 0.75em;
list-style: none;
}
#hq-nav-bar>li.level-one {
font-size: 1.5em;
text-align: center;
border-top: 1px solid #19A97B;
cursor: pointer;
}
#hq-nav-bar>li.level-one:first-child {
border-top: none;
}
#hq-nav-bar>li.level-one:hover {
background: rgba(255,255,255,1);
background: -moz-linear-gradient(top, rgba(255,255,255,1) 0%, rgba(246,246,246,1) 47%, rgba(233,238,242,1) 100%);
background: -webkit-gradient(left top, left bottom, color-stop(0%, rgba(255,255,255,1)), color-stop(47%, rgba(246,246,246,1)), color-stop(100%, rgba(233,238,242,1)));
background: -webkit-linear-gradient(top, rgba(255,255,255,1) 0%, rgba(246,246,246,1) 47%, rgba(233,238,242,1) 100%);
background: -o-linear-gradient(top, rgba(255,255,255,1) 0%, rgba(246,246,246,1) 47%, rgba(233,238,242,1) 100%);
background: -ms-linear-gradient(top, rgba(255,255,255,1) 0%, rgba(246,246,246,1) 47%, rgba(233,238,242,1) 100%);
background: linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(246,246,246,1) 47%, rgba(233,238,242,1) 100%);
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#e9eef2', GradientType=0 );
}
#hq-nav-bar>li.selected {
background: #3f8eb9;
-webkit-box-shadow: inset 1px 1px 10px 1px rgba(0,0,0,0.45);
-moz-box-shadow: inset 1px 1px 10px 1px rgba(0,0,0,0.45);
box-shadow: inset 1px 1px 10px 1px rgba(0,0,0,0.45);
}
#hq-nav-bar>li>i {
color: #19A97B;
margin: 25%;
}
.level-one {
position: relative;
}
.level-two {
display: none;
position: absolute;
height: 50px;
width: 100px;
background: #19A97B;
border-radius: 4px;
font-family: 'Open Sans', sans-serif;
font-size: 0.65em;
text-align: center;
}

.level-two:after {
content: '';
position: absolute;
border-style: solid;
border-width: 9px 9px 9px 0;
border-color: transparent  #19A97B;
display: block;
width: 0;
z-index: 1;
left: -9px;
top: 15px;
}

.level-two li {
margin: 15px;
}

.level-one:hover > .level-two {
display: block;
}

.level-two {
left: 130%;
top: 0;
}
`);
        } else if(location.href.indexOf('hurongnet.com')>0 || location.href.indexOf('588230.com')>0 || location.href.indexOf('bdwenku.com')>0 ){
            var newLink = location.href;
            var arr = newLink.split("?");
            newLink = arr[1];
            $("#downurl").val(newLink);
            $("#url").val(newLink);
        } else {
            const YoukuIcon = '<svg width="1.2em" height="1.2em" viewbox="0 0 72 72"><defs><circle id="youkuC1" r="5.5" style="stroke:none;;fill:#0B9BFF;"></circle><path id="youkuArow" d="m0,10 a5,5 0,0,1 0,-10 h20 a5,5 0,0,1 0,10z" style="fill:#FF4242;"></path></defs><circle cx="36" cy="36" r="30.5" style="stroke:#30B4FF;stroke-width:11;fill:none;"></circle><use x="10.5" y="19" xlink:href="#youkuC1"/><use x="61.5" y="53" xlink:href="#youkuC1"/><use x="39" y="1" transform="rotate(30)" xlink:href="#youkuArow"/><use x="-1" y="52" transform="rotate(-35)" xlink:href="#youkuArow"/></svg>';
            const VQQIcon = '<svg height="1.2em" width="1.2em" viewbox="0 0 185 170"><defs><path id="vQQ" d="M7 20Q14 -10 55 7Q100 23 145 60Q170 80 145 102Q108 138 47 165Q15 175 4 146Q-5 80 7 20"></path></defs><use style="fill:#44B9FD;" transform="translate(27,0)" xlink:href="#vQQ"></use><use style="fill:#FF9F01;" transform="translate(0,18),scale(0.8,0.75)" xlink:href="#vQQ"></use><use style="fill:#97E61B;" transform="translate(23,18),scale(0.80.75)" xlink:href="#vQQ"></use><use style="fill:#fff;" transform="translate(50,45),scale(0.4)" xlink:href="#vQQ"></use></svg>';
            const IQiyiIcon = '<img src="https://www.iqiyipic.com/common/fix/128-128-logo.png" width="16" height="16" />';
            const BiliIcon = '<img src="https://static.hdslb.com/images/favicon.ico" width="16" height="16"/>';
            const MgIcon = '<img src="https://www.mgtv.com/favicon.ico" width="16" height="16"/>';
            const TBIcon = '<img src="https://img.alicdn.com/favicon.ico" width="16" height="16"/>';
            const JDIcon = '<img src="https://www.jd.com/favicon.ico" width="16" height="16"/>';
            const VipIcon = '<img src="https://www.vip.com/favicon.ico" width="16" height="16"/>';

            function addGlobalStyle(css) {
                var head, style;
                head = document.getElementsByTagName('head')[0];
                if (!head) { return; }
                style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = css;
                head.appendChild(style);
            }
            addGlobalStyle(`
#Ful{position:fixed;top:5em;left:0;padding:0;z-index:999999;}
#Ful svg{float:right;}
#Ful img{float:right;}
.F1{position:relative;padding-right:.5em;width:2em;opacity:0.8;cursor:pointer;}
.F1:hover{opacity:2;}
.F1 span{margin:0;padding:1em .3em;background-color:#00C8FF;color:white;display:block;}
.F2,.F3{position:absolute;top:0;left:1.8em;display:none;margin:0;padding:0;}
.F2 li,.F3 li{width:10em;margin:0;padding:.15em .5em;background:#00FFFF;cursor:pointer;}
.F2 li:hover,.F3 li:hover{color:red!important;background:white;}
.F1:hover .F2,.F1:hover .F3{display:block;}
.F1 span, .F2, .F2 li, .F3, .F li{border-radius:.4em;}
`);
            var defaultapi = {
                title: "M3U8,失效请更换接口,鼠标停留出现多个接口",
                url: "https://jx.m3u8.tv/jiexi/?url="
            };
            var apis =[
                //B站新支持
                {name:"M3U8"+IQiyiIcon+MgIcon+BiliIcon+VQQIcon+YoukuIcon,url:"https://jx.m3u8.tv/jiexi/?url=",title:"优酷超清、腾讯超清、爱奇艺超清"},
                {name:"爱豆"+IQiyiIcon+MgIcon+VQQIcon+YoukuIcon,url:"https://jx.aidouer.net/?url=",title:"优酷超清、腾讯超清、爱奇艺高清、芒果超清"},
                {name:"虾米"+IQiyiIcon+MgIcon+VQQIcon+YoukuIcon,url:"https://jx.xmflv.com/?url=",title:"优酷超清、腾讯超清、爱奇艺高清、芒果超清"},
                {name:"CK"+IQiyiIcon+MgIcon+VQQIcon+YoukuIcon,url:"https://www.ckplayer.vip/jiexi/?url=",title:"优酷超清、腾讯超清、爱奇艺高清、芒果超清"},
                {name:"PM"+IQiyiIcon+MgIcon+VQQIcon+YoukuIcon,url:"https://www.playm3u8.cn/jiexi.php?url=",title:"优酷超清、腾讯超清、爱奇艺高清、芒果超清"},
                {name:"夜幕"+IQiyiIcon+MgIcon+VQQIcon+YoukuIcon,url:"https://www.yemu.xyz/?url=",title:"优酷超清、腾讯超清、爱奇艺高清、芒果超清"},
            ];
            var defaultapi2 = {
                title: "jsonplayer,失效请更换接口,鼠标停留出现多个接口",
                url: "https://jx.jsonplayer.com/player/?url="
            };
            var apis2 =[
                {name:"jsonplayer"+IQiyiIcon+MgIcon+VQQIcon,url:"https://jx.jsonplayer.com/player/?url=",title:"未测，地区不同，有的地方可以播放"},
                {name:"yangtu"+IQiyiIcon+MgIcon+VQQIcon+YoukuIcon,url:"https://jx.yangtu.top/?url=",title:"未测，地区不同，有的地方可以播放"},
                {name:"七哥"+IQiyiIcon+MgIcon+VQQIcon+YoukuIcon,url:"https://jx.nnxv.cn/tv.php?url=",title:"有广告，地区不同，有的地方可以播放"},
                {name:"BL"+IQiyiIcon+MgIcon+VQQIcon+YoukuIcon,url:"https://vip.bljiex.com/?v=",title:"未测，地区不同，有的地方可以播放"},
                {name:"180"+IQiyiIcon+MgIcon+VQQIcon+YoukuIcon,url:"https://jx.000180.top/jx/?url=",title:"未测，地区不同，有的地方可以播放"},
                {name:"无名"+IQiyiIcon+MgIcon+VQQIcon+YoukuIcon,url:"https://www.administratorw.com/video.php?url=",title:"未测，地区不同，有的地方可以播放"},
            ];
            var defaultapi3 = {
                title: Rlabel,
                url: NewAct
            };
            var apis3 =[
                {name:Rlabel+" 🧧",url:NewAct,title:TBtitle},
                {name:JDlabel+" 🧧",url:JDPacket,title:JDtitle},
                {name:AllSearch,url:"https://4kma.cn/mQ3Fr",title:AllSearch},
                {name:WMlabel,url:WMPacket,title:WMtitle},
                {name:VQlabel,url:VQPacket,title:VQtitle},
            ];
            //{name:"MUTV"+IQiyiIcon+MgIcon+VQQIcon+YoukuIcon,url:"https://jiexi.janan.net/jiexi/?url=",title:"未测，地区不同，有的地方可以播放"},
            //{name:"MAO"+IQiyiIcon+MgIcon+VQQIcon+YoukuIcon,url:"https://www.mtosz.com/m3u8.php?url",title:"未测，地区不同，有的地方可以播放"},
            //{name:"0523"+IQiyiIcon+MgIcon+VQQIcon+YoukuIcon,url:"https://go.yh0523.cn/y.cy?url=",title:"未测，地区不同，有的地方可以播放"},
            //{name:"4k"+IQiyiIcon+MgIcon+VQQIcon+YoukuIcon,url:"https://jx.4kdv.com/?url=",title:"未测，地区不同，有的地方可以播放"},
            //{name:"playerjy/B站"+IQiyiIcon+MgIcon+VQQIcon,url:"https://jx.playerjy.com/?url=",title:"未测，地区不同，有的地方可以播放"},
            //{name:"诺诺"+IQiyiIcon+MgIcon+VQQIcon+YoukuIcon,url:"https://www.ckmov.com/?url=",title:"未测，地区不同，有的地方可以播放"},
            //{name:"冰豆"+IQiyiIcon+MgIcon+VQQIcon+YoukuIcon,url:"https://api.qianqi.net/vip/?url=",title:"未测，地区不同，有的地方可以播放"},
            //{name:"8090"+IQiyiIcon+MgIcon+VQQIcon+YoukuIcon,url:"https://www.8090g.cn/?url=",title:"优酷超清、腾讯超清、爱奇艺高清、芒果超清"},
            //{name:"盘古"+IQiyiIcon+MgIcon+VQQIcon+YoukuIcon,url:"https://www.pangujiexi.cc/jiexi.php?url=",title:"优酷超清、腾讯超清、爱奇艺高清、芒果超清"},
            //{name:"NX"+IQiyiIcon+MgIcon+VQQIcon+YoukuIcon,url:"https://www.nxflv.com/?url=",title:"优酷超清、腾讯超清、爱奇艺高清、芒果超清"},
            //{name:"1717云"+IQiyiIcon+MgIcon+VQQIcon+YoukuIcon,url:"https://www.1717yun.com/jx/ty.php?url=",title:"优酷超清、腾讯超清、爱奇艺高清、芒果超清"},
            //{name:"解析啦"+IQiyiIcon+MgIcon+BiliIcon+VQQIcon+YoukuIcon,url:"https://api.jiexi.la/?url=",title:"优酷超清、腾讯超清、爱奇艺高清"},
            //{name:"云析"+IQiyiIcon+MgIcon+VQQIcon+BiliIcon+YoukuIcon,url:"https://jx.yparse.com/index.php?url=",title:"全网超清"},
            //{name:"CKMOV"+IQiyiIcon+MgIcon+VQQIcon+YoukuIcon,url:"https://www.ckmov.vip/api.php?url=",title:"优酷超清、腾讯超清、爱奇艺高清"},
            //{name:"OK"+IQiyiIcon+MgIcon+VQQIcon+BiliIcon+YoukuIcon,url:"https://okjx.cc/?url=",title:"全网超清"},
            //{name:"H8"+IQiyiIcon+MgIcon+VQQIcon+BiliIcon+YoukuIcon,url:"https://www.h8jx.com/jiexi.php?url=",title:"全网超清"},
            //{name:"ccy"+IQiyiIcon+MgIcon+VQQIcon+BiliIcon+YoukuIcon,url:"https://ckmov.ccyjjd.com/ckmov/?url=",title:"全网超清"},
            //{name:"1717"+IQiyiIcon+MgIcon+VQQIcon+YoukuIcon,url:"https://ckmov.ccyjjd.com/ckmov/?url=",title:"优酷超清、腾讯超清、爱奇艺高清、芒果超清"},
            //{name:"1907B站"+IQiyiIcon+MgIcon+BiliIcon+VQQIcon,url:"https://im1907.top/?jx=",title:"优酷超清、腾讯超清、爱奇艺高清、芒果超清"},
            window.FEL = function(div){return document.createElement(div);};
            var div = FEL("div");
            var FT1 = '', i = 0;
            var FT2 = '',j = 0;
            var FT3 = '',k = 0;
            for (i in apis) {
                FT1 += `<li data-order=${i} data-url="${apis[i].url}" title="${apis[i].title}" onclick="window.open(this.dataset.url+location.href)">${apis[i].name}</li>`;
            }
            for (j in apis2) {
                FT2 += `<li data-order=${j} data-url="${apis2[j].url}" title="${apis2[j].title}" onclick="window.open(this.dataset.url+location.href)">${apis2[j].name}</li>`;
            }
            for (k in apis3) {
                FT3 += `<li data-order=${k} data-url="${apis3[k].url}" title="${apis3[k].title}" onclick="window.open(this.dataset.url)">${apis3[k].name}</li>`;
            }
            div.innerHTML = `
<ul id="Ful">
<li class="F1"><span title="${defaultapi.title}" onclick="window.open(\'${defaultapi.url}\'+window.location.href)">▶</span><ul class="F2">${FT1}</ul></li>
<li class="F1"><span title="${defaultapi2.title}" onclick="window.open(\'${defaultapi2.url}\'+window.location.href)">①</span><ul class="F2">${FT2}</ul></li>
<li class="F1"><span title="${defaultapi3.title}" onclick="window.open(\'${defaultapi3.url}\')">🧧</span><ul class="F2">${FT3}</ul></li>
</ul>
`;
            document.body.appendChild(div);
        }
        setTimeout(function(){
            $(cssSelector).append(obtainAppendHtml(host,pid,pname));},1500);
        //,Viptitle,Clabel,NewAct,Rlabel,AllSearch,WMlabel,VQlabel,WMPacket,VQPacket,WMtitle,VQtitle,ButtonSwitch
    });
    function obtainAppendHtml(host,pid,pname) {
        var pubStyle='background: linear-gradient(90deg, rgb(255, 100, 34), rgb(255, 0, 64)); box-shadow: rgba(255, 100, 34, 0.2) 0px 9px 13px 0px; vertical-align: top;';
        var fontStyle='display: inline; font-size: 16px; font-weight: bold; color: rgb(255, 255, 255);';
        var tmallStyle='background: linear-gradient(90deg, rgb(255, 203, 0), rgb(255, 148, 2)); box-shadow: rgba(255, 203, 0, 0.2) 0px 9px 13px 0px; vertical-align: top;';
        var hkStyle='background: linear-gradient(90deg, rgb(157, 111, 250), rgb(139, 36, 220)); box-shadow: rgba(157, 111, 250, 0.2) 0px 9px 13px 0px; vertical-align: top;';
        var divClass='Actions--leftButtons--1M3KkF7';
        var buyClass='Actions--btn--3islUTb Actions--leftBtn--3kx8kg8  Actions--primaryBtn--1UPmwd4';
        var addClass='Actions--btn--3islUTb  Actions--rightBtn--3Ma6IDT  Actions--primaryBtn--1UPmwd4';
        var tbuyClass='<div class="div-inline"><div class="tb-btn-buy" style="padding-top:11px;">'
        var taddClass='<div class="div-inline"><div class="tb-btn-add" style="padding-top:11px;">'
        if (host.indexOf('taobao.com') > 0) {
             if(ButtonSwitch==1){
                return '<br/><div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="' + TBCoupon + pid + '" target="_blank"  style="'+fontStyle+'">' + Clabel + '</a></button>'
                    +'<button class="'+addClass+'" style="'+tmallStyle+'"><a href="' + TBSearch + encodeURI(pname) + '" target="_blank"  style="'+fontStyle+'">' + AllSearch + '</a></button></div>'
                    +'<div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="http://lctnq.yhzu.cn" target="_blank"  style="'+fontStyle+'">备用查券地址</a></button>'
                    +'<button class="'+addClass+'" style="'+tmallStyle+'"><a href="' + NewAct + '" target="_blank"  style="'+fontStyle+'">' + Rlabel + '</a></button></div>'
                    +'<div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="' + WMPacket + '" title="' + WMtitle + '" target="_blank"  style="'+fontStyle+'">' + WMlabel + '</a></button>'
                    +'<button class="'+addClass+'" style="'+tmallStyle+'"><a href="' + VQPacket + '" title="' + VQtitle + '" target="_blank"  style="'+fontStyle+'">' + VQlabel +  '</a></button></div>'
                    +'<div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="' + TBPacket + '" title="' + TBtitle + '" target="_blank"  style="'+fontStyle+'">' + TBlabel + '</a></button>'
                    +'<button class="'+addClass+'" style="'+tmallStyle+'"><a href="' + JDPacket + '" title="' + JDtitle + '" target="_blank"  style="'+fontStyle+'">' + JDlabel +  '</a></button></div>'
            }else{
                return'<br/><div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="' + TBCoupon + pid + '" target="_blank"  style="'+fontStyle+'">' + Clabel + '</a></button>'
                    +'<button class="'+addClass+'" style="'+tmallStyle+'"><a href="' + TBSearch + encodeURI(pname) + '" target="_blank"  style="'+fontStyle+'">' + AllSearch + '</a></button></div>'
                    +'<div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="http://lctnq.yhzu.cn" target="_blank"  style="'+fontStyle+'">备用查券地址</a></button>'
                    +'<button class="'+addClass+'" style="'+tmallStyle+'"><a href="' + NewAct + '" target="_blank"  style="'+fontStyle+'">' + Rlabel + '</a></button></div>'
                    +'<div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="' + WMPacket + '" title="' + WMtitle + '" target="_blank"  style="'+fontStyle+'">' + WMlabel + '</a></button>'
                    +'<button class="'+addClass+'" style="'+tmallStyle+'"><a href="' + VQPacket + '" title="' + VQtitle + '" target="_blank"  style="'+fontStyle+'">' + VQlabel +  '</a></button></div>'
            }
        }   else if (host == 'chaoshi.detail.tmall.com') {
            if(ButtonSwitch==1){
                return '<br/><div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="' + TBCoupon + pid + '" target="_blank"  style="'+fontStyle+'">' + Clabel + '</a></button>'
                    +'<button class="'+addClass+'" style="'+tmallStyle+'"><a href="' + TBSearch + encodeURI(pname) + '" target="_blank"  style="'+fontStyle+'">' + AllSearch + '</a></button></div>'
                    +'<div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="http://lctnq.yhzu.cn" target="_blank"  style="'+fontStyle+'">备用查券地址</a></button>'
                    +'<button class="'+addClass+'" style="'+tmallStyle+'"><a href="' + NewAct + '" target="_blank"  style="'+fontStyle+'">' + Rlabel + '</a></button></div>'
                    +'<div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="' + WMPacket + '" title="' + WMtitle + '" target="_blank"  style="'+fontStyle+'">' + WMlabel + '</a></button>'
                    +'<button class="'+addClass+'" style="'+tmallStyle+'"><a href="' + VQPacket + '" title="' + VQtitle + '" target="_blank"  style="'+fontStyle+'">' + VQlabel +  '</a></button></div>'
                    +'<div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="' + TBPacket + '" title="' + TBtitle + '" target="_blank"  style="'+fontStyle+'">' + TBlabel + '</a></button>'
                    +'<button class="'+addClass+'" style="'+tmallStyle+'"><a href="' + JDPacket + '" title="' + JDtitle + '" target="_blank"  style="'+fontStyle+'">' + JDlabel +  '</a></button></div>'
            }else{
                return'<br/><div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="' + TBCoupon + pid + '" target="_blank"  style="'+fontStyle+'">' + Clabel + '</a></button>'
                    +'<button class="'+addClass+'" style="'+tmallStyle+'"><a href="' + TBSearch + encodeURI(pname) + '" target="_blank"  style="'+fontStyle+'">' + AllSearch + '</a></button></div>'
                    +'<div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="http://lctnq.yhzu.cn" target="_blank"  style="'+fontStyle+'">备用查券地址</a></button>'
                    +'<button class="'+addClass+'" style="'+tmallStyle+'"><a href="' + NewAct + '" target="_blank"  style="'+fontStyle+'">' + Rlabel + '</a></button></div>'
                    +'<div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="' + WMPacket + '" title="' + WMtitle + '" target="_blank"  style="'+fontStyle+'">' + WMlabel + '</a></button>'
                    +'<button class="'+addClass+'" style="'+tmallStyle+'"><a href="' + VQPacket + '" title="' + VQtitle + '" target="_blank"  style="'+fontStyle+'">' + VQlabel +  '</a></button></div>'
            }
        }  else if (host.indexOf('tmall.hk') > 0) {
            if(ButtonSwitch==1){
                return '<div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="' + TBCoupon + pid + '" target="_blank"  style="'+fontStyle+'">' + Clabel + '</a></button>'
                    +'<button class="'+addClass+'" style="'+hkStyle+'"><a href="' + TBSearch + encodeURI(pname) + '" target="_blank"  style="'+fontStyle+'">' + AllSearch + '</a></button></div>'
                    +'<div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="http://lctnq.yhzu.cn" target="_blank"  style="'+fontStyle+'">备用查券地址</a></button>'
                    +'<button class="'+addClass+'" style="'+hkStyle+'"><a href="' + NewAct + '" target="_blank"  style="'+fontStyle+'">' + Rlabel + '</a></button></div>'
                    +'<div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="' + WMPacket + '" title="' + WMtitle + '" target="_blank"  style="'+fontStyle+'">' + WMlabel + '</a></button>'
                    +'<button class="'+addClass+'" style="'+hkStyle+'"><a href="' + VQPacket + '" title="' + VQtitle + '" target="_blank"  style="'+fontStyle+'">' + VQlabel +  '</a></button></div>'
                    +'<div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="' + TBPacket + '" title="' + TBtitle + '" target="_blank"  style="'+fontStyle+'">' + JDlabel + '</a></button>'
                    +'<button class="'+addClass+'" style="'+hkStyle+'"><a href="' + JDPacket + '" title="' + JDtitle + '" target="_blank"  style="'+fontStyle+'">' + JDlabel +  '</a></button></div>'
            }else{
                return '<div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="' + TBCoupon + pid + '" target="_blank"  style="'+fontStyle+'">' + Clabel + '</a></button>'
                    +'<button class="'+addClass+'" style="'+hkStyle+'"><a href="' + TBSearch + encodeURI(pname) + '" target="_blank"  style="'+fontStyle+'">' + AllSearch + '</a></button></div>'
                    +'<div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="http://lctnq.yhzu.cn" target="_blank"  style="'+fontStyle+'">备用查券地址</a></button>'
                    +'<button class="'+addClass+'" style="'+hkStyle+'"><a href="' + NewAct + '" target="_blank"  style="'+fontStyle+'">' + Rlabel + '</a></button></div>'
                    +'<div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="' + WMPacket + '" title="' + WMtitle + '" target="_blank"  style="'+fontStyle+'">' + WMlabel + '</a></button>'
                    +'<button class="'+addClass+'" style="'+hkStyle+'"><a href="' + VQPacket + '" title="' + VQtitle + '" target="_blank"  style="'+fontStyle+'">' + VQlabel +  '</a></button></div>'
            }
        } else if (host.indexOf('tmall.com') > 0) {
            if(ButtonSwitch==1){
                return '<div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="' + TBCoupon + pid + '" target="_blank"  style="'+fontStyle+'">' + Clabel + '</a></button>'
                    +'<button class="'+addClass+'" style="'+tmallStyle+'"><a href="' + TBSearch + encodeURI(pname) + '" target="_blank"  style="'+fontStyle+'">' + AllSearch + '</a></button></div>'
                    +'<div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="http://lctnq.yhzu.cn" target="_blank"  style="'+fontStyle+'">备用查券地址</a></button>'
                    +'<button class="'+addClass+'" style="'+tmallStyle+'"><a href="' + NewAct + '" target="_blank"  style="'+fontStyle+'">' + Rlabel + '</a></button></div>'
                    +'<div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="' + WMPacket + '" title="' + WMtitle + '" target="_blank"  style="'+fontStyle+'">' + WMlabel + '</a></button>'
                    +'<button class="'+addClass+'" style="'+tmallStyle+'"><a href="' + VQPacket + '" title="' + VQtitle + '" target="_blank"  style="'+fontStyle+'">' + VQlabel +  '</a></button></div>'
                    +'<div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="' + TBPacket + '" title="' + TBtitle + '" target="_blank"  style="'+fontStyle+'">' + TBlabel + '</a></button>'
                    +'<button class="'+addClass+'" style="'+tmallStyle+'"><a href="' + JDPacket + '" title="' + JDtitle + '" target="_blank"  style="'+fontStyle+'">' + JDlabel +  '</a></button></div>'
            }else{
                return '<div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="' + TBCoupon + pid + '" target="_blank"  style="'+fontStyle+'">' + Clabel + '</a></button>'
                    +'<button class="'+addClass+'" style="'+tmallStyle+'"><a href="' + TBSearch + encodeURI(pname) + '" target="_blank"  style="'+fontStyle+'">' + AllSearch + '</a></button></div>'
                    +'<div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="http://lctnq.yhzu.cn" target="_blank"  style="'+fontStyle+'">备用查券地址</a></button>'
                    +'<button class="'+addClass+'" style="'+tmallStyle+'"><a href="' + NewAct + '" target="_blank"  style="'+fontStyle+'">' + Rlabel + '</a></button></div>'
                    +'<div class="'+divClass+'" style="padding-top:3px;"><button class="'+buyClass+'" style="'+pubStyle+'"><a href="' + WMPacket + '" title="' + WMtitle + '" target="_blank"  style="'+fontStyle+'">' + WMlabel + '</a></button>'
                    +'<button class="'+addClass+'" style="'+tmallStyle+'"><a href="' + VQPacket + '" title="' + VQtitle + '" target="_blank"  style="'+fontStyle+'">' + VQlabel +  '</a></button></div>'
            }
        } else if (host.indexOf('jd.com') > 0) {
            if(ButtonSwitch==1){
                return '<a href="' + JDCoupon + pid + '" target="_blank" class="btn-special1 btn-lg">' + Clabel + '</a>'
                    +'<br/><br/><br/><a href="' + JDSearch + encodeURI(pname) + '" target="_blank" class="btn-special1 btn-lg">' + AllSearch + '</a>'
                    +'<a href="' + NewAct + '" target="_blank" class="btn-special1 btn-lg">' + Rlabel + '</a>'
                    +'<a href="' + WMPacket + '" title="' + WMtitle + '" target="_blank" class="btn-special1 btn-lg">' + WMlabel + '</a>'
                    +'<a href="' + VQPacket + '" title="' + VQtitle + '" target="_blank" class="btn-special1 btn-lg">' + VQlabel + '</a>'
                    +'<a href="' + TBPacket + '" title="' + TBtitle + '" target="_blank" class="btn-special1 btn-lg">' + TBlabel + '</a>'
                    +'<a href="' + JDPacket + '" title="' + JDtitle + '" target="_blank" class="btn-special1 btn-lg">' + JDlabel + '</a>';
            }else{
                return '<a href="' + JDCoupon + pid + '" target="_blank" class="btn-special1 btn-lg">' + Clabel + '</a>'
                    +'<br/><br/><br/><a href="' + JDSearch + encodeURI(pname) + '" target="_blank" class="btn-special1 btn-lg">' + AllSearch + '</a>'
                    +'<a href="' + NewAct + '" target="_blank" class="btn-special1 btn-lg">' + Rlabel + '</a>'
                    +'<a href="' + WMPacket + '" title="' + WMtitle + '" target="_blank" class="btn-special1 btn-lg">' + WMlabel + '</a>'
                    +'<a href="' + VQPacket + '" title="' + VQtitle + '" target="_blank" class="btn-special1 btn-lg">' + VQlabel + '</a>';
            }
        } else if (host.indexOf('vip.com') > 0) {
            return '<div id="J-button-box" class="button-box" style="margin-left:40px";><div class="ui-btn-loading-before clearfix J_cartAdd_Price">'
                + '<div class="hasComparePrice clearfix"><div class="comparePrice"><a  class="comparePricess" href="' + VipCoupon + pid + '"  target="_blank">' + Clabel + '</a></div>'
                + '<div class="finalPrice"><span class="finalPrice_price" ><a class="comparePricess" href="' + VipSearch + encodeURI(pname) + '" title="' + AllSearch + '" target="_blank">' + AllSearch + '</a></span></div>'
                + '<div class="hasComparePrice clearfix"><div class="comparePrice"><a  class="comparePricess" href="' + VQPacket + '" title="' + VQtitle + '" target="_blank" >' + VQlabel + '</a></div>'
                + '<div class="finalPrice"><span class="finalPrice_price" ><a class="comparePricess" href="' + NewAct + '" title="' + Rlabel + '" target="_blank">最新活动</a></span></div>'
                + '</div></div>';
        }
    }
})();