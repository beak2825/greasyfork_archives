// ==UserScript==
// @name         VIP视频破解（手机改）
// @namespace    shanbai
// @version      1.0.2
// @description  解析并破解各大视频站的VIP权限 —— 适配手机
// @author       shanbai
// @include       *://v.qq.com/x/*
// @include       *://m.v.qq.com/*
// @include       *://*.mgtv.com/*b/*
// @include       *://*.le.com/ptv/vplay/*
// @include       *://m.le.com/*
// @include       *://v.youku.com/v_show/*
// @include       *://m.youku.com/video/*
// @include       *://*.iqiyi.com/v_*
// @include       *://*.iqiyi.com/dianying/*
// @include       *://*.tudou.com/albumplay/*
// @include       *://*.tudou.com/listplay/*
// @include       *://*.tudou.com/programs/view/*
// @include       *://*.wasu.cn/*Play/show/id/*
// @include       *://*tv.sohu.com/*
// @include       *://*film.sohu.com/album/*
// @include       *://ddp.vip.pptv.com/vod_detail/*
// @include       *://*.pptv.com/show/*
// @include       *://*.acfun.cn/v/*
// @include       *://*.fun.tv/vplay/*
// @include       *://vip.1905.com/play/*
// @include       *://vip.pptv.com/show/*
// @include       *://v.yinyuetai.com/video/*
// @include       *://v.yinyuetai.com/playlist/*
// @include       *://*.bilibili.com/video/*
// @exclude       *?url=*
// @exclude       *?qt=*
// @exclude       *?v=*
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_openInTab
// @grant         unsafeWindow
// @grant         GM_xmlhttpRequest
// @license       MIT License
// @connect       cache.video.qiyi.com
// @downloadURL https://update.greasyfork.org/scripts/372418/VIP%E8%A7%86%E9%A2%91%E7%A0%B4%E8%A7%A3%EF%BC%88%E6%89%8B%E6%9C%BA%E6%94%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/372418/VIP%E8%A7%86%E9%A2%91%E7%A0%B4%E8%A7%A3%EF%BC%88%E6%89%8B%E6%9C%BA%E6%94%B9%EF%BC%89.meta.js
// ==/UserScript==

(function(){
    var youku ='<span style="display:block;float:left;width:5vw;height:5vw;font-size:2.5vw;color:#fff;line-height:5vw;text-align:center;border-radius:100%;box-shadow:0px 0px 3px #a9a9a9;background:#0078FF;margin:3.78vw 2.1vw;">优</span>'
    var qq ='<span style="display:block;float:left;width:5vw;height:5vw;font-size:2.5vw;color:#fff;line-height:5vw;text-align:center;border-radius:100%;box-shadow:0px 0px 3px #a9a9a9;background:#0078FF;margin:3.78vw 2.1vw;">腾</span>'
    var nothing ='<span style="display:block;float:left;width:5vw;height:5vw;font-size:2.5vw;color:#fff;line-height:5vw;text-align:center;border-radius:100%;box-shadow:0px 0px 3px #a9a9a9;background:#fd8100;margin:3.78vw 2.1vw;">综</span>'
    var apis = [
        {name: nothing + "百域阁",url: "http://api.baiyug.cn/vip/index.php?url=",title: "转圈圈就换线路"},
        {name: qq + "vParse",url: "https://api.vparse.org/?url=",title: "支持腾讯"},
        {name: qq + "猫云",url: "https://jx.maoyun.tv/index.php?id=",title: "支持腾讯"},
        {name: youku + "搜你妹",url: "http://www.sonimei.cn/?url=",title: "综合接口"}, 
        {name: nothing + "噗噗电影",url: "http://pupudy.com/play?make=url&id=",title: "综合接口，破解全网"}, 
        {name: youku + "抢先影院",url: "http://www.qxyingyuan.vip/play?make=url&id=",title: "据说优酷比较稳定"}, 
        {name: nothing + "酷绘",url: "http://appapi.svipv.kuuhui.com/svipjx/liulanqichajian/browserplugin/qhjx/qhjx.php?id=",title: "综合接口"}, 
        {name: nothing + "旋风解析",url: "http://api.xfsub.com/index.php?url=",title: "1905优先使用"}, 
        {name: nothing + "石头解析",url: "https://jiexi.071811.cc/jx.php?url=",title: "手动点播放"}, 
        {name: nothing + "无名小站",url: "http://www.sfsft.com/admin.php?url=",title: "无名小站同源"}, 
        {name: nothing + "VIP看看",url: "http://q.z.vip.totv.72du.com/?url=",title: "更换线路成功率会提高"}, 
        {name: nothing + "ODFLV",url: "http://aikan-tv.com/?url=",title: "不稳定，广告过滤软件可能有影响"}, 
        {name: nothing + "163人",url: "http://jx.api.163ren.com/vod.php?url=",title: "偶尔支持腾讯"}, 
        {name: nothing + "CKFLV",url: "http://www.0335haibo.com/tong.php?url=",title: "CKFLV云,部分站点不支持"}, 
        {name: nothing + "无名小站2",url: "http://www.wmxz.wang/video.php?url=",title: "转圈圈就换线路"}, 
        {name: nothing + "眼睛会下雨",url: "http://www.vipjiexi.com/yun.php?url=",title: "www.vipjiexi.com"}, 
        {name: youku + "1008影视",url: "http://api.1008net.com/v.php?url=",title: "据说可以看布袋游戏视频"}, 
        {name: nothing + "人人发布",url: "http://v.renrenfabu.com/jiexi.php?url=",title: "综合，多线路"},
        {name:"无名小站",url:"http://www.wmxz.wang/video.php?url=%s",title:"次选"},
        {name:"有范",url:"http://jx.918jx.com/jx.php?url=%s"},
        //{name:"石头解析(s)",url:"https://jiexi.071811.cc/jx.php?url=%s"},
        //{name:"最小品(s)",url:"https://www.zuixiaopin.com/api/cloudVideo?url=%s"},
        //{name:"妹儿云(s)",url:"https://www.yymeier.com/api.php?url=%s"},
        //{name:"那片(s)",url:"https://jxapi.nepian.com/ckparse/?url=%s"},
        {name:"百域(s)",url:"http://yun.baiyug.cn/vip/?url=%s"},
        //{name:"海播",url:"http://www.0335haibo.com/tong.php?url=%s"},
        //{name:"眼睛会下雨",url:"http://www.vipjiexi.com/yun.php?url=%s",title:"域名改成海播了，https证书也没了"},
        {name:"小海解析(s)",url:"https://ckplaer.duapp.com/hai2.php?url=%s",title:"播放器放在百度开发者平台"},
        {name:"爱看TV",url:"http://aikan-tv.com/?url=%s"},
        {name:"噗噗电影",url:"http://www.pupudy.com/splay.php?play=%s"},
        {name:"噗噗电影",url:"http://api.baiyug.cn/vip/index.php?url=%s"},
        {name:"噗噗电影",url:"http://jiexi.92fz.cn/player/vip.php?url=%s"},
        {name:"噗噗电影",url:"http://www.ibb6.com/jx/yun.php?url=%s"},
        {name:"噗噗电影",url:"http://www.ibb6.com/jiexi/?url=%s"},
        {name:"噗噗电影",url:"http://www.ibb6.com/playm3u8/?url=%s"},
        {name:"米沃",url:"http://jx.mihatv.com/miwo1.php?url=%s"},
        {name:"速度牛",url:"http://api.wlzhan.com/tong/?url=%s"},
        {name:"资源帝",url:"http://www.ziyuand.cn/jx1/jx.php?url=%s"},
        {name:"旋风解析",url:"http://api.xfsub.com/index.php?url=%s"},
        {name:"Relon",url:"http://yyygwz.com/index.php?url=%s"},
        {name:"SO视频",url:"http://parse.colaparse.cc/?url=%s"},
        {name:"5奇异",url:"http://www.jiexi.cx/5qiyi/?url=%s"},
        {name:"Moondown",url:"http://moon.moondown.net/?url=%s"},
        {name:"选片网",url:"http://jx.xuanpianwang.com/parse?url=%s"},
        {name:"云上",url:"http://www.ou522.cn/t2/1.php?url=%s"},
        {name:"强强卷",url:"http://000o.cc/jx/ty.php?url=%s"},
        {name:"Lewei369",url:"http://s1y2.com/?url=%s"},
        {name:"紫狐云",url:"http://yun.zihu.tv/api.php?url=%s"},
        {name:"土豪网",url:"http://www.tuhao13.com/yunparse/index.php?url=%s"},
        {name:"舞动秋天",url:"http://qtzr.net/s/?qt=%s"},
        {name:"97在线看",url:"http://www.97zxkan.com/jiexi/97zxkanapi.php?url=%s"},
        {name:"百域阁",url:"http://api.svip.baiyug.cn/svip/index.php?url=%s",title:"会检测是否frame,只能跳转不能嵌"},
        {name:"言朋影院",url:"http://vip.yingyanxinwen.cn/vip/index.php?url=%s",title:"会检测是否frame,只能跳转不能嵌"},
        {name:"迷失之梦",url:"http://mt2t.com/yun?url=%s",title:"这个解析站似乎不大稳定"},
        {name:"无名小站源",url:"http://www.sfsft.com/admin.php?url=%s",title:"无名小站的源"},
        {name:"VIP看看",url:"http://2.jx.72du.com/video.php?url=%s",title:"嵌了无名小站的服务"},
        {name:"歪歪电影",url:"http://www.yydy8.com/common/?url=%s",title:"嵌了47影视云的服务"},
        {name:"梦中人",url:"http://www.wpswan.com/mzr/vipparse/index.php?url=%s",title:"嵌了47影视云的服务"},
        {name:"71ki解析",url:"http://jx.71ki.com/tong.php?url=%s"},
        {name:"CloudParse",url:"http://api.cloudparse.com/?url=%s"},
        {name:"10号影院",url:"http://player.gakui.top/?url=%s"},
        {name:"PPYPP",url:"http://www.ppypp.com/yunparse/?url=%s"},
        {name:"疯狂解析",url:"http://vip.ifkdy.com/?url=%s",title:"仅是简单嵌了47影视云、小海解析等几个解析站"}
    ];
    //添加链接
    function createSelect(apis) {
        var myul = document.createElement("ul");
        myul.id = "myul";
        myul.setAttribute("style",
            "display:none;background:#fff;box-shadow:0px 1px 10px rgba(0,0,0,0.3);margin:0;padding:0 4.2vw;position:fixed;bottom:14vh;right:12vw;z-index:99999;height:80vh;overflow:scroll;border-radius:1.26vw;");
        for (var i = 0; i < apis.length; i++) {
            var myli = document.createElement("li");
            var that = this;
            myli.setAttribute("style",
                "margin:0;padding:0;display:block;list-style:none;font-size:4.2vw;width:33.6vw;text-align:left;line-height:12.6vw;letter-spacing:0;border-bottom:1px solid #f0f0f0;position:relative;overflow:hidden;text-overflow:hidden;white-space:nowrap;");
            (function (num) {
                myli.onclick = function () {
                    window.open(apis[num].url + location.href, '_blank');
                };
                myli.ontouchstart = function () {
                    this.style.cssText += "color:yellow;background:#373737;border-radius:1.26vw;";
                }
                myli.ontouchend = function () {
                    this.style.cssText += "color:black;background:transparent;border-radius:0;";
                }
            })(i);
            myli.innerHTML = apis[i].name;
            myul.appendChild(myli);
        }
        document.body.appendChild(myul);
    }
    //唤出菜单
    function createMenu() {
        var myBtn = document.createElement("div");
        myBtn.id = "myBtn";
        myBtn.innerHTML = "+";
        myBtn.setAttribute("style",
            "width:12vw;height:12vw;position:fixed;bottom:6vh;right:8vw;z-index:100000;border-radius:100%;text-align:center;line-height:12vw;box-shadow:0px 1px 10px rgba(0,0,0,0.3);font-size:8vw;background:#ffdb88;");
        myBtn.onclick = function () {
            var myul = document.getElementById("myul");
            if (myul.style.display == "none") {
                myul.style.display = "block";
                this.style.transform = "rotateZ(45deg)";
            } else {
                myul.style.display = "none";
                this.style.transform = "rotateZ(0deg)";
            }
        }
        document.body.appendChild(myBtn);
    }
    // document.addEventListener("DOMContentLoaded",function () {
        createMenu();
        createSelect(apis);
    // });
})();