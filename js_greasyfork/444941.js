// ==UserScript==
// @name              九条可怜多线路
// @namespace         https://www.九条可怜.cn
// @version           1.0.46
// @description       [九条可怜双端]自用多接口多播放器多直链转换脚本,自带内嵌播放器。
// @author            九条可怜
// @icon              https://tz.九条可怜.cn/favicon.ico
// @require           https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/crypto-js/4.1.1/crypto-js.min.js
// @require           https://lib.baomitu.com/echarts/4.6.0/echarts.min.js
// @match          *://laisoyiba.com/*
// @match           *://*.youku.com/v_*
// @match           *://*.iqiyi.com/v_*
// @match           *://*.iqiyi.com/w_*
// @match           *://*.iqiyi.com/a_*
// @match           *://v.qq.com/x/cover/*
// @match           *://v.qq.com/x/page/*
// @match           *://v.qq.com/tv/*
// @match           *://*.mgtv.com/b/*
// @match           *://*.bilibili.com/video/*
// @match           *://*.bilibili.com/bangumi/play/*
// @match           *://www.acfun.cn/bangumi/*
// @match           *://www.le.com/ptv/vplay/*
// @match           *://www.wasu.cn/Play/show/*
// @match           *://vip.1905.com/play/*
// @match           *://tv.sohu.com/v/*
// @match           *://film.sohu.com/album/*
// @match           *://v.pptv.com/show/*
// @match           *://m.v.qq.com/*
// @match           *://m.iqiyi.com/v_*
// @match           *://m.iqiyi.com/w_*
// @match           *://m.iqiyi.com/a_*
// @match           *://m.youku.com/alipay_video/*
// @match           *://m.youku.com/video/*
// @match           *://m.mgtv.com/b/*
// @match           *://m.bilibili.com/video/*
// @match           *://m.bilibili.com/anime/*
// @match           *://m.bilibili.com/bangumi/play/*
// @match           *://m.le.com/vplay_*
// @match           *://vip.1905.com/m/play/*
// @match           *://www.wasu.cn/wap/*/show/*
// @match           *://m.tv.sohu.com/v.*
// @match           *://m.pptv.com/show/*
// @match         *://blog.csdn.net/*
// @match        *.ixigua.com/*

// @connect      tool.zhihupe.com
// @connect      tool.wezhicms.com
// @connect      47.99.158.118
// @connect      api.bilibili.com
// @connect      mobile.ximalaya.com
// @connect      v2.api.haodanku.com
// @connect      www.iesdouyin.com
// @connect      bijiatool-v2.manmanbuy.com
// @connect      pcweb.api.mgtv.com
// @connect      www.360fandu.cn
// @connect      pan.10zv.net
// @grant        GM_openInTab
// @grant        GM.openInTab
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
 
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_download
// @grant    GM_registerMenuCommand
// @grant    GM_unregisterMenuCommand
// @grant        unsafeWindow
// @run-at       document-end
// @license             End-User License Agreement
// @downloadURL https://update.greasyfork.org/scripts/444941/%E4%B9%9D%E6%9D%A1%E5%8F%AF%E6%80%9C%E5%A4%9A%E7%BA%BF%E8%B7%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/444941/%E4%B9%9D%E6%9D%A1%E5%8F%AF%E6%80%9C%E5%A4%9A%E7%BA%BF%E8%B7%AF.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    const config ={
        "playhref":window.location.href,
        "host":window.location.host,
        "UA":navigator.userAgent,
        "scriptInfo":GM_info.script,
        "hdapikey":"FF9529914C44",
    }
    const playList=[
        {"name":"九条可怜自建1","category":1,"url":"https://media.karendes.top/player/ec.php?code=art&if=1&url=", "showType":3},
        {"name":"九条可怜自建2","category":1,"url":"https://media.karendes.top/player/ec.php?code=ck&if=1&url=", "showType":3},
        {"name":"九条可怜自建3","category":1,"url":"https://media.karendes.top/player/ec.php?code=mui&if=1&url=", "showType":3},
        {"name":"M3U8.TV","category":1,"url":"https://jx.m3u8.tv/jiexi/?url=", "showType":3},
        {"name":"纯净/B站","category":1,"url":"https://z1.m1907.top/?eps=0&jx=", "showType":3},
        {"name":"夜幕","category":1,"url":"https://www.yemu.xyz/?url=", "showType":3},
        {"name":"高速接口","category":1,"url":"https://jx.jsonplayer.com/player/?url=", "showType":3},
        {"name":"综合/B站","category":1,"url":"https://jx.bozrc.com:4433/player/?url=", "showType":3},       
        {"name":"NNXV","category":1,"url":"https://jx.nnxv.cn/tv.php?url=", "showType":3},
        {"name":"playerjy/B站","category":1,"url":"https://jx.playerjy.com/?ads=0&url=", "showType":3},
        {"name":"云析","category":1,"url":"https://jx.yparse.com/index.php?url=", "showType":1},
        {"name":"无名","category":1,"url":"https://www.administratorw.com/video.php?url=", "showType":1},
 
        {"name":"九条可怜自建","category":2,"url":"https://media.karendes.top/player/ec.php?code=art&if=1&url=", "showType":3},
        {"name":"九条可怜自建","category":2,"url":"https://media.karendes.top/player/ec.php?code=ck&if=1&url=", "showType":3},
        {"name":"九条可怜自建","category":2,"url":"https://media.karendes.top/player/ec.php?code=mui&if=1&url", "showType":3},
        {"name":"综合/B站1","category":2,"url":"https://jx.bozrc.com:4433/player/?url=", "showType":1},
        {"name":"纯净/B站","category":2,"url":"https://z1.m1907.top/?eps=0&jx=", "showType":3},
        {"name":"夜幕","category":2,"url":"https://www.yemu.xyz/?url=", "showType":1},
        {"name":"虾米","category":2,"url":"https://jx.xmflv.com/?url=", "showType":1},
        {"name":"NNXV","category":21,"url":"https://jx.nnxv.cn/tv.php?url=", "showType":3},
        {"name":"playerjy/B站","category":2,"url":"https://jx.playerjy.com/?ads=0&url=", "showType":3},
        {"name":"云析","category":2,"url":"https://jx.yparse.com/index.php?url=", "showType":1},
        {"name":"无名","category":2,"url":"https://www.administratorw.com/video.php?url=", "showType":1},
        {"name":"M3U8.TV","category":2,"url":"https://jx.m3u8.tv/jiexi/?url=", "showType":1},
    ];
    const author = config.scriptInfo.author;
    const ZHwindow = unsafeWindow||window;
    const commonFunction = {
        Toast:function(msg, duration = 3000){
            var m = document.createElement('div');
            m.innerHTML = msg;
            m.setAttribute('id','msg');
            m.style.cssText = "max-width:60%;min-width: 150px;padding:0 14px;min-height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 9999999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
            document.body.appendChild(m);
            setTimeout(() => {
                var d = 0.5;
                m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
                m.style.opacity = '0';
                setTimeout(() => { document.body.removeChild(document.querySelector("#msg")) }, d * 1000);
            }, duration);
        },
        //兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
        GMopenInTab:function(url, open_in_background) {
            if (typeof GM_openInTab === "function") {
                GM_openInTab(url, open_in_background);
            } else {
                GM.openInTab(url, open_in_background);
            }
        },
 
        //兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
        GMgetValue:function(name, value) {
            if (typeof GM_getValue === "function") {
                return GM_getValue(name, value);
            } else {
                return GM.getValue(name, value);
            }
        },
 
        //兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
        GMsetValue:function(name, value) {
            if (typeof GM_setValue === "function") {
                GM_setValue(name, value);
            } else {
                GM.setValue(name, value);
            }
        },
 
        //兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
        GMxmlhttpRequest:function(obj) {
            if (typeof GM_xmlhttpRequest === "function") {
                GM_xmlhttpRequest(obj);
            } else {
                GM.xmlhttpRequest(obj);
            }
        },
        setItem:function(name, Value) {
            localStorage.setItem(name, Value);
        },
        getItem:function(name) {
            let StorageValue = localStorage.getItem(name);
            return StorageValue;
        },
        removeItem:function(name) {
            localStorage.removeItem(name);
        },
        GMaddStyle:function(data,id=null) {
            var addStyle = document.createElement('style');
            addStyle.textContent = data;
            addStyle.type = 'text/css';
            addStyle.id = id;
            var doc = document.head || document.documentElement;
            doc.appendChild(addStyle);
        },
        GMaddScript:function(data) {
            let script = document.createElement('script');
            script.src = data;
            var docu = document.head || document.documentElement;
            docu.appendChild(script);
        },
        GMaddlink:function(data) {
            let mylink = document.createElement('link');
            mylink.href = data;
            mylink.rel = 'stylesheet';
            var docl = document.head || document.documentElement;
            docl.appendChild(mylink);
        },
        GMopenInTab:function(url, open_in_background) {
            if (typeof GM_openInTab === "function") {
                GM_openInTab(url, open_in_background);
            } else {
                GM.openInTab(url, open_in_background);
            }
        },
        sleep:function(time) {
            return new Promise(resolve => setTimeout(resolve, time));
        },
        Commonsetinterval:function(data){
            var Count;
            var num ="";
            return new Promise(function(resolve, reject){
                Count = setInterval(function() {
                    data.forEach((item)=>{
                        var node = document.querySelector(item);
                        if(node !==null){
                            resolve(node);
                            clearInterval(Count);
                        }
                        if(num ==100){
                            clearInterval(Count);
                        }
                    })
                    num++;
 
                },200);
            });
        },
        Videosetinterval:function(data){
            var Count;
            var num ="";
            return new Promise(function(resolve, reject){
                Count = setInterval(function() {
                    for(let i=0;i < data.length;i++ ){
                        var node = document.querySelector(data[i])?.children??"";
                        if(node !==""){
                            resolve(data[i]);
                            clearInterval(Count);
                        }
                        if(num ==20){
                            clearInterval(Count);
                        }
                    }
                    num++;
                },500);
            });
        },
        menusetting:function(){
            //初始化脚本设置
            let setting = ["videosetting","Shortvideosetting","Bilibilisetting","Csdnsetting"]
            setting.forEach((item)=>{
                if(commonFunction.GMgetValue(item)==null){
                    commonFunction.GMsetValue(item,1);
                }
            })
        },
        setIntervalhost:function() {
            let playhref = window.location.href
            setInterval(function() {
                var workurl = window.location.href;
                if (playhref != workurl) {
                    console.log(workurl);
                    playhref = workurl;
                    window.location.reload();
                }
            },500);
        },
        IsPC:function() {
            var userAgentInfo = config.UA;
            var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone", "iPad", "iPod"];
            var flag = true;
            for (let i = 0; i < Agents.length; i++) {
                if (userAgentInfo.indexOf(Agents[i]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        },
        IsWap:function(){
            var com = null;
            if(config.host.indexOf('item.') > -1) {
                com = "pc";
            }else if (config.host.indexOf('m.') > -1||config.playhref.indexOf('/m/') > -1||config.playhref.indexOf('/wap/') > -1) {
                com = "wap";
            }else {
                com = "pc";
            }
            return com
        },
        Getgoodid:function(data){
            var reg = new RegExp("(^|&)" + data + "=([^&]*)(&|$)");
            var s = window.location.search.substr(1).match(reg);
            if (s != null) {
                return s[2];
            }
            return "";
        },
        geturlid:function(url) {
            var id ="";
            if (url.indexOf("?") != -1) {
                url = url.split("?")[0]
            }
            if (url.indexOf("#") != -1) {
                url = url.split("#")[0]
            }
            var text = url.split("/");
            id = text[text.length - 1];
            id = id.replace(".html", "");
            return id
        },
        request:function(method,url,headers,data=null){
            return new Promise(function(resolve, reject){
                commonFunction.GMxmlhttpRequest({
                    url: url,
                    method: method,
                    data:data,
                    headers:headers,
                    onload: function(res) {
                        var status = res.status;
                        var responseText = res.responseText;
                        if(status==200||status=='200'){
                            resolve({"result":"success", "data":responseText});
                        }else{
                            reject({"result":"error", "data":null});
                        }
                    }
                });
            })
        },
        open:function(data){
            var main = document.createElement('div');
            var width = data.area[0];
            var height = data.area[1];
            var margintop = height/2;
            var marginleft = width/2;
            var style = "z-index: 999999998;width: "+width+"px;height:"+height+"px;position: fixed;top: 50%;left: 50%;margin-left:-"+marginleft+"px;margin-top:-"+margintop+"px;"
            var btnHTML = '<a class="zhihu-layer-btn0">'+data.btn[0]+'</a><a class="zhihu-layer-btn1">'+data.btn[1]+'</a>';
            main.innerHTML = '<div class="zhihu-layer-title" style="cursor: move;">'+data.title+'</div><div class="zhihu-layer-content" >'+data.content+'</div><span class="zhihu-layer-setwin"><a class="zhihu-layer-ico zhihu-layer-close1" href="javascript:;"></a></span><div class="zhihu-layer-btn zhihu-layer-btn-c">'+btnHTML+'</div>';
            main.setAttribute('id',data.id);
            main.setAttribute('style',style);
            main.setAttribute('class',"zhihu-layer-page");
            document.body.appendChild(main);
            var shade = document.createElement('div');
            shade.setAttribute('style',"z-index: 999999997;background-color: rgb(0, 0, 0);opacity: 0.3;");
            shade.setAttribute('class',"zhihu-layer-shade");
            shade.setAttribute('id',"zhihu-layer-shade");
            shade.innerHTML =''
            document.body.appendChild(shade);
            var css = `
                    ::-webkit-scrollbar{width:6px;height:6px}
                    ::-webkit-scrollbar-track{width:6px;background:transparent}
                    ::-webkit-scrollbar-thumb{width:6px;border-radius:4px;background-color:#54be99;-webkit-transition:all 1s;transition:all 1s}
                    ::-webkit-scrollbar-corner{background-color:#54be99}
                    li{list-style:none}
                    .zhihu-form-label,.zhihu-form-select,.zhihu-input-block,.zhihu-input-inline{position:relative}
                    .zhihu-layer-shade{position:fixed;top:0;left:0;box-sizing:border-box;width:100%;height:100%;outline:0;border-radius:2px;-webkit-transition:all .3s;transition:all .3s;_height:expression(document.body.offsetHeight+"px")}
                    .zhihu-layer-page{margin:0;padding:0;background-color:#fff;border-radius:10px;box-shadow:1px 1px 50px rgba(0,0,0,.4);font-family:PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif}
                    .zhihu-layer-title{padding:0 80px 0 20px;height:50px;line-height:50px;border-bottom:1px solid #f0f0f0;border-radius:2px 2px 0 0;font-size:14px;color:#333;overflow:visible;text-overflow:ellipsis;white-space:nowrap;font-weight:700}
                    .zhihu-layer-setwin{position:absolute;right:15px;top:17px;font-size:0;line-height:normal}
                    .zhihu-layer-setwin .zhihu-layer-close1{background-position:1px -40px;cursor:pointer}
                    .zhihu-layer-setwin a{position:relative;width:16px;height:16px;margin-left:10px;font-size:12px;_overflow:hidden}
                    .zhihu-layer-btn a,.zhihu-layer-setwin a{display:inline-block;vertical-align:top}.zhihu-layer-ico{background:url(https://www.layuicdn.com/layui/css/modules/layer/default/icon.png) no-repeat}
                    .zhihu-layer-btn{text-align:right;padding:10px 15px 12px;pointer-events:auto;user-select:none;-webkit-user-select:none}
                    .zhihu-layer-btn-c{text-align:center}
                    .zhihu-layer-btn a{height:28px;line-height:28px;margin:5px 5px 0;padding:0 15px;border:1px solid #dedede;background-color:#fff;color:#333;border-radius:4px;font-weight:400;cursor:pointer;text-decoration:none}
                    .zhihu-layer-btn1{border-color:#54be99!important;background-color:#54be99!important;color:#fff!important}
                    .zhihu-form-item{margin-bottom:5px;clear:both}
                    .zhihu-form-label{float:left;display:block;padding:9px 15px;width:80px;font-weight:400;line-height:20px;text-align:right;box-sizing:content-box}
                    .zhihu-input-inline{display:inline-block;vertical-align:middle;width:190px;margin-right:10px}
                    .zhihu-input,.zhihu-select,.zhihu-textarea{height:38px;line-height:1.3;border:1px solid #eee;display:block;width:100%;padding-left:10px;background-color:#fff;color:rgba(0,0,0,.85);-webkit-appearance:none;box-sizing: border-box;border-radius: 2px!important;}
                    .zhihu-input-block{margin-left:110px;min-height:auto}
                    .zhihu-input-block p{font-size:12px;line-height:22px}
                    .zhihu-form{display:flex;margin-top:20px}
 
            `;
            commonFunction.GMaddStyle(css,"open");
            // await commonFunction.sleep(1000);
            //获取表单对象
            var zhihuform = document.querySelector('.zhihu-form');
            //保存按钮点击事件
            document.querySelector('.zhihu-layer-btn1').addEventListener('click',function() {
                data.btn1(zhihuform);
                document.body.removeChild(document.querySelector(".zhihu-layer-page"));
                document.body.removeChild(document.querySelector("#zhihu-layer-shade"));
                document.getElementsByTagName("head").item(0).removeChild(document.getElementById("open"));
            })
            //取消钮点击事件
            document.querySelector(".zhihu-layer-btn0").addEventListener('click',function() {
                document.body.removeChild(document.querySelector(".zhihu-layer-page"));
                document.body.removeChild(document.querySelector("#zhihu-layer-shade"));
                document.getElementsByTagName("head").item(0).removeChild(document.getElementById("open"));
            })
            //关闭钮点击事件
            document.querySelector(".zhihu-layer-close1").addEventListener('click',function() {
                document.body.removeChild(document.querySelector(".zhihu-layer-page"));
                document.body.removeChild(document.querySelector("#zhihu-layer-shade"));
                document.getElementsByTagName("head").item(0).removeChild(document.getElementById("open"));
            })
        },
        tab:async function(data){
            var main = document.createElement('div');
            var width = data.area[0];
            var height = data.area[1];
            var margintop = height/2;
            var marginleft = width/2;
            var style = "z-index: 999999998;width: "+width+"px;height:"+height+"px;position: fixed;top: 50%;left: 50%;margin-left:-"+marginleft+"px;margin-top:-"+margintop+"px;"
            var titleHTML ="";
            var contentHTML = "";
            var btnHTML = '<a class="zhihu-layer-btn0">'+data.btn[0]+'</a><a class="zhihu-layer-btn1">'+data.btn[1]+'</a>'
            for (let i = 0; i < data.tab.length; i++) {
                if(i === 0 ){
                    titleHTML +='<span class="tab-title zhihu-this">'+data.tab[i].title+'</span>';
                    contentHTML += '<li class="zhihu-layer-tabli zhihu-this">'+data.tab[i].content+'</li>';
                }else{
                    titleHTML +='<span class="tab-title">'+data.tab[i].title+'</span>';
                    contentHTML += '<li class="zhihu-layer-tabli ">'+data.tab[i].content+'</li>';
                }
            }
            main.innerHTML = '<div class="zhihu-layer-title" style="cursor: move;">'+titleHTML+'</div><div class="zhihu-layer-content" ><ul class="zhihu-layer-tabmain">'+contentHTML+'</ul></div><span class="zhihu-layer-setwin"><a class="zhihu-layer-ico zhihu-layer-close1" href="javascript:;"></a></span><div class="zhihu-layer-btn zhihu-layer-btn-c">'+btnHTML+'</div>';
            main.setAttribute('id',data.id);
            main.setAttribute('style',style);
            main.setAttribute('class',"zhihu-layer-tab");
            document.body.appendChild(main);
            var tabtitle = document.getElementsByClassName('tab-title');
            for (let i = 0; i < tabtitle.length; i++) {
                let tabli = document.getElementsByClassName('zhihu-layer-tabli')[i];
                tabtitle[i].addEventListener('click',function() {
                    document.querySelector(".zhihu-layer-title>.zhihu-this").classList.remove("zhihu-this");
                    this.classList.add("zhihu-this");
                    document.querySelector(".zhihu-layer-tabmain>.zhihu-this").classList.remove("zhihu-this");
                    tabli.classList.add("zhihu-this");
                });
 
            }
            var shade = document.createElement('div');
            shade.setAttribute('style',"z-index: 999999997;background-color: rgb(0, 0, 0);opacity: 0.3;");
            shade.setAttribute('class',"zhihu-layer-shade");
            shade.setAttribute('id',"");
            shade.innerHTML =''
            document.body.appendChild(shade);
            var css = `
                    ::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{width:6px;background:transparent}
                    ::-webkit-scrollbar-thumb{width:6px;border-radius:4px;background-color:#54be99;-webkit-transition:all 1s;transition:all 1s}
                    ::-webkit-scrollbar-corner{background-color:#54be99}
                    li{list-style:none}
                    .zhihu-form-label,.zhihu-form-select,.zhihu-input-block,.zhihu-input-inline{position:relative}
                    .zhihu-layer-shade{position:fixed;top:0;left:0;width:100%;height:100%;_height:expression(document.body.offsetHeight+"px")}
                    .zhihu-layer-tab{margin:0;padding:0;background-color:#fff;border-radius:10px;box-shadow:1px 1px 50px rgba(0,0,0,.4);font-family:PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif}
                    .zhihu-layer-tab *{box-sizing:content-box}
                    .zhihu-layer-title{height:50px;line-height:50px;border-bottom:1px solid #f0f0f0;border-radius:2px 2px 0 0;font-size:14px;color:#333;padding:0 80px 0 0;overflow:visible;text-overflow:ellipsis;white-space:nowrap}
                    .zhihu-layer-title span{position:relative;float:left;min-width:80px;max-width:300px;padding:0 20px;text-align:center;overflow:hidden;cursor:pointer;font-weight:700;color:#000}
                    .zhihu-layer-title span:first-child{border-left:none}.zhihu-layer-title span.zhihu-this{height:51px;border-left:1px solid #eee;border-right:1px solid #eee;background-color:#fff;z-index:10}
                    .zhihu-layer-title span:first-child.zhihu-this{border-radius:10px 0 0 0}
                    .zhihu-layer-content{position:relative;overflow:hidden;height:290px}
                    .zhihu-layer-tabmain{line-height:24px;clear:both;padding:0;margin:0}
                    .zhihu-layer-tabli{display:none;height:100%}
                    .zhihu-layer-tabmain .zhihu-this{display:block}
                    .zhihu-layer-setwin{position:absolute;right:15px;top:17px;font-size:0;line-height:normal}
                    .zhihu-layer-setwin .zhihu-layer-close1{background-position:1px -40px;cursor:pointer}
                    .zhihu-layer-setwin a{position:relative;width:16px;height:16px;margin-left:10px;font-size:12px;_overflow:hidden}
                    .zhihu-layer-btn a,.zhihu-layer-setwin a{display:inline-block;vertical-align:top}
                    .zhihu-layer-ico{background:url(https://www.layuicdn.com/layui/css/modules/layer/default/icon.png) no-repeat}
                    .zhihu-layer-btn{text-align:right;padding:10px 15px 12px;pointer-events:auto;user-select:none;-webkit-user-select:none}
                    .zhihu-layer-btn-c{text-align:center}
                    .zhihu-layer-btn a{height:28px;line-height:28px;margin:5px 5px 0;padding:0 15px;border:1px solid #dedede;background-color:#fff;color:#333;border-radius:4px;font-weight:400;cursor:pointer;text-decoration:none}
                    .zhihu-layer-btn1{border-color:#54be99!important;background-color:#54be99!important;color:#fff!important}
                    .zhihu-form-item{margin-bottom:15px;clear:both}
                    .zhihu-form-label{float:left;display:block;padding:9px 15px;width:80px;font-weight:400;line-height:20px;text-align:right}
                    .zhihu-input-block{margin-left:110px;min-height:36px;width:190px}
                    .zhihu-form input[type=checkbox],.zhihu-form input[type=radio],.zhihu-form select{display:none}
                    .zhihu-form-switch{position:relative;height:22px;line-height:22px;min-width:35px;padding:0 5px;margin-top:8px;border:1px solid #d2d2d2;border-radius:20px;cursor:pointer;background-color:#fff;-webkit-transition:.1s linear;transition:.1s linear}
                    .zhihu-form-checkbox,.zhihu-form-checkbox *,.zhihu-form-switch{display:inline-block;vertical-align:middle}
                    .zhihu-unselect{-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none}
                    .zhihu-form-switch em{position:relative;top:0;width:25px;margin-left:21px;padding:0!important;text-align:center!important;color:#999!important;font-style:normal!important;font-size:12px}
                    .zhihu-form-switch i{position:absolute;left:5px;top:3px;width:16px;height:16px;border-radius:20px;background-color:#d2d2d2;-webkit-transition:.1s linear;transition:.1s linear}
                    .zhihu-form-onswitch{border-color:#54be99;background-color:#54be99}
                    .zhihu-form-onswitch em{margin-left:5px;margin-right:21px;color:#fff!important}
                    .zhihu-form-onswitch i{left:100%;margin-left:-21px;background-color:#fff}
                    .zhihu-form-select .zhihu-input{padding-right:30px;cursor:pointer}
                    .zhihu-input,.zhihu-textarea{display:block;width:100%;padding-left:10px}
                    .zhihu-input,.zhihu-select,.zhihu-textarea{height:38px;line-height:1.3;border-width:1px!important;border-style:solid!important;background-color:#fff;color:rgba(0,0,0,.85);border-radius:2px!important}
                    .zhihu-btn,.zhihu-input,.zhihu-select,.zhihu-textarea,.zhihu-upload-button{outline:0;-webkit-appearance:none;transition:all .3s;-webkit-transition:all .3s;box-sizing:border-box;border-color:#eee!important}
                    .zhihu-form-select .zhihu-edge{position:absolute;right:10px;top:50%;margin-top:-3px;cursor:pointer;border-top:solid #c2c2c2;border-width:6px;transition:all .3s;-webkit-transition:all .3s}
                    .zhihu-edge{width:0;border:6px dashed transparent;display:inline-block}
                    .zhihu-form-selected .zhihu-edge{margin-top:-9px;-webkit-transform:rotate(180deg);transform:rotate(180deg)}
                    .zhihu-anim{-webkit-animation-duration:.3s;-webkit-animation-fill-mode:both;animation-duration:.3s;animation-fill-mode:both}
                    .zhihu-form-select dl,.zhihu-panel{box-shadow:1px 1px 4px rgb(0 0 0/8%)}
                    .zhihu-form-select dl{position:absolute;top:42px;left:0;z-index:899;display:none;overflow-y:auto;box-sizing:border-box;margin:0;padding:5px 0;max-height:300px;min-width:100%;border:1px solid #eee;border-radius:2px;background-color:#fff}
                    .zhihu-form-selected dl{display:block}
                    .zhihu-form-select dl dd,.zhihu-form-select dl dt{overflow:hidden;margin:0;padding:0 10px;text-overflow:ellipsis;white-space:nowrap;line-height:36px}
                    .zhihu-form-select dl dd{cursor:pointer}.zhihu-form-select dl dd.zhihu-select-tips{padding-left:10px!important;color:#999}
                    .zhihu-form-select dl dd.zhihu-this{background-color:#5fb878;color:#fff}
         `;
            commonFunction.GMaddStyle(css,"tab");
            await commonFunction.sleep(1000);
            //获取表单对象
            var zhihuform = document.querySelector('.zhihu-form');
            //保存按钮点击事件
            document.querySelector('.zhihu-layer-btn1').addEventListener('click',function() {
                data.btn1(zhihuform);
                document.body.removeChild(document.querySelector(".zhihu-layer-tab"));
                document.body.removeChild(document.querySelector(".zhihu-layer-shade"));
                document.getElementsByTagName("head").item(0).removeChild(document.getElementById("tab"));
            })
            //取消钮点击事件
            document.querySelector(".zhihu-layer-btn0").addEventListener('click',function() {
                document.body.removeChild(document.querySelector(".zhihu-layer-tab"));
                document.body.removeChild(document.querySelector(".zhihu-layer-shade"));
                document.getElementsByTagName("head").item(0).removeChild(document.getElementById("tab"));
            })
            //关闭钮点击事件
            document.querySelector(".zhihu-layer-close1").addEventListener('click',function() {
                document.body.removeChild(document.querySelector(".zhihu-layer-tab"));
                document.body.removeChild(document.querySelector(".zhihu-layer-shade"));
                document.getElementsByTagName("head").item(0).removeChild(document.getElementById("tab"));
            })
            //开关添加开始
            var zhihuinput = zhihuform.getElementsByClassName('checkbox');
            for (let i = 0; i < zhihuinput.length; i++) {
                let name = zhihuinput[i].getAttribute("name");
                if(name =="switch"){
                    if(zhihuinput[i].checked){
                        zhihuinput[i].insertAdjacentHTML('afterEnd', '<div class="zhihu-unselect zhihu-form-switch zhihu-form-onswitch"><em>ON</em><i></i></div>');
                    }else{
                        zhihuinput[i].insertAdjacentHTML('afterEnd', '<div class="zhihu-unselect zhihu-form-switch "><em>OFF</em><i></i></div>');
                    }
                }
            }
            //开关添加结束
            //开关点击事件开始
            var zhihuswitch = document.getElementsByClassName('zhihu-form-switch');
            for (let i = 0; i < zhihuinput.length; i++) {
                zhihuswitch[i].addEventListener('click',function() {
                    let onswitch = this.getAttribute("class");
                    if(onswitch.indexOf("zhihu-form-onswitch")!=-1){
                        this.parentNode.querySelector('input').removeAttribute("checked");
                        this.classList.remove("zhihu-form-onswitch");
                        this.innerHTML ="<em>OFF</em><i></i>"
                    }else{
                        this.parentNode.querySelector('input').setAttribute("checked",true);
                        this.classList.add("zhihu-form-onswitch");
                        this.innerHTML ="<em>ON</em><i></i>"
                    }
 
                })
            }
            //开关点击事件结束
            //下拉框添加开始
            var zhihuselect = zhihuform.getElementsByTagName('select');
            for (let i = 0; i < zhihuselect.length; i++) {
                let optionHtml ='';
                let zhihuoption = zhihuselect[i].getElementsByTagName('option');
                if(zhihuselect[i].selectedIndex < 0){
                    var Index = 0
                    }else{
                        Index = zhihuselect[i].selectedIndex;
                    }
                let selecttext = zhihuselect[i].options[Index].text;
                var selectvalue = zhihuselect[i].options[Index].value;
                for (let l = 0; l < zhihuoption.length; l++) {
                    let optionText = zhihuoption[l].innerText;
                    let optionvalue = zhihuoption[l].value;
                    if(optionvalue == selectvalue){
                        optionHtml += '<dd zhihu-value="'+optionvalue+'"  class="zhihu-select-tips zhihu-this">'+optionText+'</dd>'
                    }else{
                        optionHtml += '<dd zhihu-value="'+optionvalue+'" class="">'+optionText+'</dd>'
                    }
                }
                var selectHtml = '<div class="zhihu-unselect zhihu-form-select"><div class="zhihu-select-title"><input type="text" placeholder="直接选择或搜索选择" value="'+selecttext+'" readonly="" class="zhihu-input zhihu-unselect"><i class="zhihu-edge"></i></div><dl class="zhihu-anim" style="">'+optionHtml+'</dl></div>';
                zhihuselect[i].insertAdjacentHTML('afterEnd',selectHtml);
            }
            //下拉框添加结束
            //下拉框操作事件开始
            var zhihuunselect = document.getElementsByClassName("zhihu-form-select");
            for (let i = 0; i < zhihuunselect.length; i++) {
                //下拉框点击事件
                zhihuunselect[i].addEventListener('click',function() {
                    var selected = this.getAttribute("class");
                    if(selected.indexOf("zhihu-form-selected")!=-1){
                        this.classList.remove("zhihu-form-selected");
                    }else{
                        this.classList.add("zhihu-form-selected");
                    };
                },false);
                //下拉框选择事件
                var zhihudd = zhihuunselect[i].getElementsByTagName('dd');
                for (let l = 0; l < zhihudd.length; l++) {
                    zhihudd[l].addEventListener('click',function() {
                        var a = zhihuunselect[i].querySelector('.zhihu-this');
                        if(a){
                            a.classList.remove("zhihu-this");
                            a.classList.remove("zhihu-select-tips");
                        }
                        this.classList.add("zhihu-this");
                        this.classList.add("zhihu-select-tips");
                        console.log(this.getAttribute("zhihu-value"));
                        console.log(zhihuunselect[i].parentNode.querySelector('select'))
                        zhihuunselect[i].parentNode.querySelector('select').value = this.getAttribute("zhihu-value");
                        zhihuunselect[i].parentNode.querySelector('input').setAttribute("value",this.innerText);
                    });
                };
            }
            //下拉框操作事件结束
        },
    }
    //--------------------------------------------------------------
    const ControllerVideo = {
        //播放节点
        Playid:function(){
            var PlayidList = [
                { url:"v.qq.com", node:["#mod_player","#player-container"],adnode:["#mask_layer",".mod_vip_popup",".panel-tip-pay"],playwork:true},
                { url:"www.iqiyi.com", node:["#flashbox"],playwork:true},
                { url:"v.youku.com", node:["#player"],playwork:""},
                { url:"w.mgtv.com", node:["#mgtv-player-wrap"],playwork:true},
                { url:"www.mgtv.com", node:["#mgtv-player-wrap"],playwork:true},
                { url:"tv.sohu.com", node:["#player"],playwork:true},
                { url:"film.sohu.com", node:["#playerWrap"],playwork:true},
                { url:"www.le.com", node:["#le_playbox"],playwork:true},
                { url:"v.pptv.com", node:["#pptv_playpage_box"],playwork:""},
                { url:"vip.pptv.com", node:[".w-video"],playwork:""},
                { url:"www.wasu.cn", node:["#flashContent","#player"],playwork:""},
                { url:"www.bilibili.com", node:["#player_module"],playwork:true},
                { url:"vip.1905.com", node:["#player"],playwork:""},
                { url:"m.v.qq.com", node:["#player"],adnode:["#vipPosterContent",".at-app-banner"],playwork:true},
                { url:"m.youku.com", node:["#player"],adnode:[".callEnd_box"],playwork:""},
                { url:"m.iqiyi.com", node:[".m-video-player-wrap"],playwork:true},
                { url:"m.mgtv.com", node:[".video-area"],adnode:[".mg-down-btn",".ad-fixed-bar"],playwork:true},
                { url:"m.bilibili.com", node:["#bofqi"],playwork:true},
                { url:"m.le.com", node:["#j-player"],adnode:["#j-vipLook",".daoliu1","#j-player"],playwork:true},
                { url:"m.tv.sohu.com", node:[".player"],adnode:[".player_film_cover"],playwork:true},
                { url:"m.pptv.com", node:[".pp-details-video"],playwork:""},
            ];
            for(let i in PlayidList) { //获得窗口ID
                if (PlayidList[i].url == config.host) {
                    let Playid = ZHwindow.zhihu.playnode = PlayidList[i].node??null;
                    let playwork = ZHwindow.zhihu.playwork = PlayidList[i].playwork;
                    let adnode = PlayidList[i].adnode
                    if(adnode){
                        adnode.forEach((item)=>{
                            if(PlayidList[i].url == "m.le.com"&&item == "#j-player"){
                                var player = commonFunction.Commonsetinterval(["#j-player"]);
                                player.then(function(playernode){
                                    playernode.style.display="block";
                                });
                                return;
                            }
                            var itemnode = commonFunction.Commonsetinterval([item]);
                            itemnode.then(function(e){
                                e.parentNode.removeChild(e);
                            });
 
                        })
                    }
                    break;
                }
            }
        },
        //----------------------------------------------------------------------
        //接口列表
        Videolist:function(f){
            let ListHtml={
                "Insidehtml":"",
                "selecthtml":"",
                "mobhtml":"",
                "Outsidehtml":"",
            };
            //-----------------------------
            let v = commonFunction.GMgetValue("userplayurl");
            if(v){
                var e = v.concat(f);
            }else{
                e = f;
            }
            for (let i = 0; i < e.length; i++) {
                if (e[i].category == 1) {
                    ListHtml.Insidehtml += "<span  class='jiexi inside' id='Inside_" + i + "'  title='" + e[i].name + "' data-index='" + i + "' data-url='" + e[i].url + "'>" + e[i].name + "</span>";
                    ListHtml.selecthtml += "<option value='" +i + "' name='select' data-url='" + e[i].url + "'>" + e[i].name + "</option>"
                    if (e[i].showType == 3) {
                        ListHtml.mobhtml += "<span  class='mob-jiexi' id='mob_" + i + "'  title='" + e[i].name + "' data-index='" + i + "' data-url='" + e[i].url + "'>" + e[i].name + "</span>";
                    }
                } else {
                    ListHtml.Outsidehtml += "<span  class='jiexi outside 'title='" + e[i].name + "' data-index='" + i + "' data-url='" + e[i].url + "'>" + e[i].name + "</span>";
                }
 
            }
            //-----------------------------
            return ListHtml
        },
        //增加接口列表
        Videoaddlist:function(){
            var addListHtml="";
            //-----------------------------
            let e = commonFunction.GMgetValue("userplayurl");
            console.log(e);
            if(e != null&&e != ""&&e != undefined){
                for (let i = 0; i < e.length; i++) {
                    if(e[i].category == 1){
                        addListHtml += '<li><span>'+e[i].name+'</span><span>内部播放</span><span class="urllist">'+e[i].url+'</span><span class="delurl" data-id='+i+'>删除</span></li>';
                    }else if(e[i].category == 2){
                        addListHtml += '<li><span>'+e[i].name+'</span><span>跳转播放</span><span class="urllist">'+e[i].url+'</span><span class="delurl" data-id='+i+'>删除</span></li>';
                    }else{
                        continue;
                    }
                }
            }else{
                addListHtml = '<p style="text-align: center;margin: 20px 0;">暂无数据</p>'
            }
            //-----------------------------
            return addListHtml
        },
        //----------------------------------------------------------------------
        //电脑端
        addbtn:async function(){
            console.log(this)
            const _this = this
            // await commonFunction.sleep(3000);
            await _this.Delay();
            await _this.Playid();
            _this.CheckAutoplay();
            var css = `
                        body,html{height:100%;color:#1c1f21;font:14px/1.5 PingFang SC,微软雅黑,Microsoft YaHei,Helvetica,Helvetica Neue,Tahoma,Arial,sans-serif}
                        .elevator{position:fixed;top:55%;left:0;z-index:999999996;margin-top:-140px;padding:0 16px;border-radius:0 8px 8px 0;background:rgb(134 134 134/40%);box-shadow:1px 1px 8px 1px rgb(98 99 99/34%)}
                        .elevator a{position:relative;display:block;box-sizing:border-box;width:26px;height:56px;color:#b5b9bc;text-align:center;font-size:22px;line-height:20px}
                        .elevator a+a:after{position:absolute;top:0;left:50%;margin-left:-12px;width:24px;border:1px solid #f3f5f7;content:""}
                        .elevator a:hover{color:#14191e}
                        .elevator svg{margin:14px 0;width:28px;height:28px;color:#199b6d;font-size:24px;line-height:56px}
                        .elevator svg:hover{color:#14191e}
                        .elevator a span{display:none;padding:14px 0;color:#fff;font-size:12px;line-height:14px}
                        .elevator a:hover svg{display:none}
                        .elevator a:hover span,.jiexi{display:inline-block}
                        .jiexi{margin:0 8px 10px;padding:8px 10px;width:80px;border-radius:4px;background:hsla(0,0%,89.8%,.64);color:#505050;text-align:center;font-size:12px}
                        .jiexiselect{background:#54be99;color:#fff}.zhihu-scan{display:inline-block;margin-left:8px;width:144px;text-align:center}
                        .zhihu-scan img{margin:0 5px 10px;width:140px}.zhihu-scan h1{margin:0 0 20px;font-weight:700;font-size:18px}
                        .zhihu-scan p{margin:0;color:#666;font-size:12px;line-height:26px}
                        .addlist{margin:15px 0 0;padding:0}.addlist li{height:36px;color:#333;font-size:14px;line-height:36px}
                        .addlist li span{display:inline-block;overflow:hidden;width:100px;color:#333;text-align:center;text-overflow:ellipsis;white-space:nowrap;font-size:14px}
                        .addlist li .urllist{width:214px}
                        ::-webkit-input-placeholder{color:#999;font-size:12px;line-height:16px}
                        :-moz-placeholder,::-moz-placeholder{color:#999;font-size:12px;line-height:16px}
                        :-ms-input-placeholder{color:#999;font-size:12px;line-height:16px}
                        #zhihuplay:hover .zhihuepisode{display:inline-block}
            `;
            commonFunction.GMaddStyle(css);
            var btnhtml = '<div class="elevator" id=""><a href="javascript:;" class="elevator-msg" id="PlayMain"><svg t="1651763850342" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2320" width="200" height="200"><path d="M661.333333 665.6l51.2 12.8 42.666667-72.533333-34.133333-38.4c4.266667-21.333333 4.266667-38.4 4.266666-55.466667s0-34.133333-4.266666-51.2l34.133333-38.4-42.666667-72.533333-51.2 12.8c-25.6-21.333333-55.466667-42.666667-89.6-51.2L554.666667 256h-85.333334l-17.066666 51.2c-34.133333 8.533333-64 25.6-89.6 51.2l-51.2-12.8-42.666667 72.533333 34.133333 38.4c-4.266667 21.333333-4.266667 38.4-4.266666 55.466667s0 34.133333 4.266666 51.2l-34.133333 38.4 42.666667 72.533333 51.2-12.8c25.6 21.333333 55.466667 42.666667 89.6 51.2L469.333333 768h85.333334l17.066666-51.2c34.133333-8.533333 64-25.6 89.6-51.2z m38.4 81.066667c-21.333333 17.066667-51.2 34.133333-76.8 42.666666L597.333333 853.333333h-170.666666l-25.6-64c-29.866667-12.8-55.466667-25.6-76.8-42.666666l-68.266667 12.8-85.333333-149.333334 42.666666-51.2V512c0-17.066667 0-29.866667 4.266667-42.666667l-42.666667-51.2 85.333334-149.333333 68.266666 12.8c21.333333-17.066667 51.2-34.133333 76.8-42.666667L426.666667 170.666667h170.666666l25.6 64c29.866667 12.8 55.466667 25.6 76.8 42.666666l68.266667-12.8 85.333333 149.333334-42.666666 51.2c4.266667 12.8 4.266667 29.866667 4.266666 42.666666s0 29.866667-4.266666 42.666667l42.666666 51.2-85.333333 149.333333-68.266667-4.266666zM512 554.666667c25.6 0 42.666667-17.066667 42.666667-42.666667s-17.066667-42.666667-42.666667-42.666667-42.666667 17.066667-42.666667 42.666667 17.066667 42.666667 42.666667 42.666667z m0 85.333333c-72.533333 0-128-55.466667-128-128s55.466667-128 128-128 128 55.466667 128 128-55.466667 128-128 128z" fill="#ffffff" p-id="2321"></path></svg><span class="">解析设置</span></a><a href="javascript:;" id="addjiexi" class="elevator-faq" ><svg t="1656638904518" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7918" width="200" height="200"><path d="M469.333333 469.333333V341.333333h85.333334v128h128v85.333334h-128v128h-85.333334v-128H341.333333v-85.333334h128z m42.666667 384c-187.733333 0-341.333333-153.6-341.333333-341.333333s153.6-341.333333 341.333333-341.333333 341.333333 153.6 341.333333 341.333333-153.6 341.333333-341.333333 341.333333z m0-85.333333c140.8 0 256-115.2 256-256s-115.2-256-256-256-256 115.2-256 256 115.2 256 256 256z" fill="#ffffff" p-id="7919"></path></svg><span class="">添加接口</span></a><a href="javascript:;" id="playing" class="elevator-faq" ><svg t="1651762741797" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1235" width="200" height="200"><path d="M512 853.333333c-187.733333 0-341.333333-153.6-341.333333-341.333333s153.6-341.333333 341.333333-341.333333 341.333333 153.6 341.333333 341.333333-153.6 341.333333-341.333333 341.333333z m0-85.333333c140.8 0 256-115.2 256-256s-115.2-256-256-256-256 115.2-256 256 115.2 256 256 256z m128-256l-213.333333 128V384l213.333333 128z" fill="#ffffff" p-id="1236"></path></svg><span class="">解析播放</span></a></div>';
            document.body.insertAdjacentHTML('afterbegin', btnhtml);
            document.querySelector('#playing').onclick = function() {
                _this.autoplay();
                commonFunction.Toast(`${ZHwindow?.zhihu?.Delaytime??3}秒后自动解析视频`,`${ZHwindow?.zhihu?.Delaytime??3}`*1000);
            };
            //弹窗开始-------------------------------------------------
            document.querySelector('#PlayMain').addEventListener('click',function() {
                console.log("点击成功");
                var ListHtml = _this.Videolist(playList);
                //   console.log(ListHtml);
                var jiexi = commonFunction.getItem('AutoPlay') == 1 ? "checked": "";
                commonFunction.tab({
                    area: ['560', '400'],
                    id: "",
                    btn: ['取消', '保存设置'],
                    btnAlign: 'c',
                    tab: [{
                        title: '内嵌播放',
                        content: '<div style="margin:10px 30px 0 30px;display:flex"><div style="width:356px;display:inline-block;margin-left: -8px;height: 280px;overflow-y: scroll;" id="jiexilist">' +ListHtml.Insidehtml + '</div><div class="zhihu-scan" ><h1>内嵌播放注意事项</h1><p>内嵌播放新版B站无法使用,可以再网页右侧点击"返回旧版"或选择跳转播放。</p><p style="color: red;">除了九条可怜自建以外的接口都是互联网接口，不要傻傻的相信视频的博彩广告</p></p></div></div>'
                    },
                          {
                              title: '跳转播放',
                              content: `<div style="margin:10px 30px 0 30px;display:flex"><div style="width:356px;display:inline-block;margin-left: -8px;height: 280px;overflow-y: scroll;" id="jiexilist">${ ListHtml.Outsidehtml}</div><div class="zhihu-scan" ></div></div>`
                          },
                          {
                              title: '解析设置',
                              content: `<div style="margin:10px 30px 0 30px;display:flex"><div style="width:356px;display:inline-block;padding-right: 15px;height: 280px;overflow-y: scroll;" id="jiexilist"><form class="zhihu-form" ><div class="zhihu-form-item"><label class="zhihu-form-label">解析接口</label><div class="zhihu-input-block"><select name="selectjiexi" lay-verify="required"  id ="selectjiexi"><option value="">直接选择或搜索选择</option>${ ListHtml.selecthtml}</select></div></div><div class="zhihu-form-item"><label class="zhihu-form-label">延迟时间</label><div class="zhihu-input-block"><input type="number" placeholder="${ZHwindow.zhihu.Delaytime??3}" name="jiexitime" class="zhihu-input" style="display: inline-block;width: 100px;padding: 2px;margin-right: 10px;text-align: center;"><span style="font-size: 14px;color: #333;">秒</span></div></div><div class="zhihu-form-item"><label class="zhihu-form-label">自动解析</label><div class="zhihu-input-block"><input class="checkbox" type="checkbox" ${ jiexi} name="switch"  id="autoplay" ></div></div></form></div><div class="zhihu-scan" style="width:144px;"></div></div>`
                          }],
                    btn1: function(data) {
                        var s = data.getElementsByTagName('select');
                        for(let i= 0; i < s.length; i++ ){
                            let Index = s[i].selectedIndex;
                            let selectedid = s[i].options[Index].value;
                            let selecturl = s[i].options[Index].getAttribute("data-url");
                            commonFunction.setItem('selectedid', selectedid);
                            commonFunction.setItem('selecturl', selecturl);
 
                        }
                        var n = data.getElementsByTagName('input');
                        for(let i= 0; i <n.length; i++ ){
                            if(n[i].getAttribute("name") == "switch"){
                                let onswitch = document.querySelector("#autoplay+div").getAttribute("class");
                                if (onswitch.indexOf("zhihu-form-onswitch") != -1) {
                                    commonFunction.setItem('AutoPlay', '1');
                                    _this.autoplay();
                                    commonFunction.Toast(`${ZHwindow.zhihu.Delaytime}秒后自动解析视频`,`${ZHwindow.zhihu.Delaytime}`*1000);
                                } else {
                                    commonFunction.setItem('AutoPlay', '0');
                                }
                            }else if(n[i].getAttribute("name") == "jiexitime"){
                                let time = n[i].value;
                                if(time){
                                    commonFunction.setItem("Delaytime", time);
                                    ZHwindow.zhihu.Delaytime = time;
                                }
                            }
                        }
                    }
                });
                if (ZHwindow.zhihu.selectid != "") {
                    document.querySelector('#' + ZHwindow.zhihu.selectid).className += " jiexiselect";
                }
                if (commonFunction.getItem('selectedid') != null) {
                    document.querySelector('#selectjiexi').value = commonFunction.getItem('selectedid');
                }
                var inList = document.getElementsByClassName('inside');
                for (let i = 0; i < inList.length; i++) {
                    inList[i].addEventListener('click',function() {
                        if (commonFunction.getItem('selectid') != null) {
                            document.querySelector('#' + commonFunction.getItem('selectid')).classList.remove("jiexiselect");
                        }
                        commonFunction.Toast('开始解析视频',2000);
                        var playObjecturl = ZHwindow.zhihu.selecturl = this.getAttribute("data-url");
                        var playid = ZHwindow.zhihu.selectid = this.getAttribute("id");
                        console.log(playid);
                        this.className = "jiexi inside jiexiselect";
                        document.body.removeChild(document.querySelector(".zhihu-layer-tab"));
                        document.body.removeChild(document.querySelector(".zhihu-layer-shade"));
                        document.getElementsByTagName("head").item(0).removeChild(document.getElementById("tab"));
                        let url;
                        if(ZHwindow.zhihu.decide == true){
                            url = playObjecturl + ZHwindow.zhihu.currently_episode.playurl;
                        }else{
                            url = playObjecturl + window.location.href;
                        }
                        console.log(url);
                        _this.GoPlay(url);
                    });
                }
 
                var outList = document.getElementsByClassName('outside');
                for (let i = 0; i < outList.length; i++) {
                    outList[i].addEventListener('click',function() {
                        let playObjecturl = this.getAttribute("data-url");
                        let Outsideurl = playObjecturl + window.location.href;
                        document.body.removeChild(document.querySelector(".zhihu-layer-tab"));
                        document.body.removeChild(document.querySelector(".zhihu-layer-shade"));
                        document.getElementsByTagName("head").item(0).removeChild(document.getElementById("tab"));
                        console.log(Outsideurl);
                        window.open(Outsideurl);
                    });
                }
            });
            //弹窗结束-----------------------------------------
            //自定义接口弹窗
            document.querySelector('#addjiexi').addEventListener('click',function() {
                let e = commonFunction.GMgetValue("userplayurl");
                console.log(e);
                if(e == null||e == ""||e == undefined){
                    let arr =[];
                    commonFunction.GMsetValue("userplayurl",arr);
                }
                let addListHtml = _this.Videoaddlist();
                let addjiexihtml ="";
                addjiexihtml +='<form class="zhihu-form" style="height: 325px;margin: 10px 30px 0 30px;"><div style="width:520px;display:inline-block;height:280px;overflow-y: scroll;">'
                addjiexihtml +='<div class="zhihu-form-item"><textarea placeholder="B站,1,https://jx.m3u8.tv/jiexi/?url=&#10;B站,2,https://jx.m3u8.tv/jiexi/?url=&#10;分隔符使用英文逗号,解析名字：B站;1为内部播放,2为跳转播放,解析接口：https://jx.m3u8.tv/jiexi/?url=&#10;如需添加多个解析接口，每行设置一个" class="zhihu-input zhihu-unselect" style="min-height:100px;max-height:160px;max-width:512px;min-width:512px;padding: 10px;"></textarea>'
                addjiexihtml +='<ul class="addlist"><li><span>解析名称</span><span>播放类型</span><span class="urllist">接口地址</span><span>操作</span></li>'+addListHtml+'</ul></div></div>'
                addjiexihtml +='</form>'
                commonFunction.open({
                    area: ['580', '450'],
                    title: "添加解析接口",
                    shade: 0,
                    id:"",
                    btn: ['取消', '添加接口'],
                    content:addjiexihtml,
                    btn1: function(data) {
                        var s= data.getElementsByTagName('textarea');
                        for (var i = 0; i < s.length; i++) {
                            let jiexitext = s[i].value;
                            if(jiexitext){
                                let Alljiexitext = jiexitext.split(/[(\r\n)\r\n]+/); // 根据换行或者回车进行识别
                                Alljiexitext.forEach((item, index) => { // 删除空项
                                    if (!item) {
                                        Alljiexitext.splice(index, 1);
                                    }
                                })
                                Alljiexitext = Array.from(new Set(Alljiexitext)); // 去重
                                if(Alljiexitext){
                                    Alljiexitext.forEach((item, index) => {
                                        if (item) {
                                            let jiexiitem = item.split(/,/);
                                            let num = index+1
                                            if(jiexiitem.length == 3){
                                                if(jiexiitem[1]==1||jiexiitem[1]==2){
                                                    let j = {name:jiexiitem[0],category:jiexiitem[1],url:jiexiitem[2],showType:"1"};
                                                    let v= commonFunction.GMgetValue("userplayurl");
                                                    let l = v.push(j);
                                                    commonFunction.GMsetValue("userplayurl",v);
                                                    commonFunction.Toast("添加成功，请重新设置自动解析接口",1500)
 
                                                    console.log(v)
                                                }else{
                                                    commonFunction.Toast("第"+num+"行格式错误，请按照示例格式重新添加")
                                                }
                                            }else{
                                                commonFunction.Toast("第"+num+"行格式错误，请按照示例格式重新添加")
                                            }
 
                                        }
                                    })
                                }
                            }
                        }
 
                    }
                });
                var addurlList = document.getElementsByClassName('delurl');
                for (var u = 0; u < addurlList.length; u++) {
                    addurlList[u].addEventListener('click', function() {
                        let urlid = this.getAttribute("data-id");
                        let v= commonFunction.GMgetValue("userplayurl");
                        v.forEach((item, index) => {
                            if (index == urlid) {
                                v.splice(index, 1);
                            }
                        });
                        commonFunction.GMsetValue("userplayurl",v);
                        console.log(commonFunction.GMgetValue("userplayurl"));
                        commonFunction.Toast("删除成功，请重新设置自动解析接口",1500)
                        document.body.removeChild(document.querySelector(".zhihu-layer-page"));
                        document.body.removeChild(document.querySelector(".zhihu-layer-shade"));
                        document.getElementsByTagName("head").item(0).removeChild(document.getElementById("open"));
                        document.querySelector('#addjiexi').click();
                    });
                }
            });
            //自定义弹窗结束
        },
        //---------------------------------------------------------------------
        //手机端
        addmobbtn:async function() {
            const _this =this
            await commonFunction.sleep(1000);
            await _this.Delay();
            await _this.Playid();
            var ListHtml = _this.Videolist(playList);
            var offautohtml = '<span id="off">关闭自动解析</span><img src="data:image/png;base64,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">'
            var onautohtml = '<span id="on">开启自动解析</span><img src="data:image/png;base64,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">'
            var autohtml;
            if (commonFunction.getItem("AutoPlay") == 1) {
                autohtml = offautohtml
            } else {
                autohtml = onautohtml
            }
            var mainhtml = '<div class="mob-main"><div class="shaw"></div><div class="listmian"><div class="listmian-tit"><p>解析接口列表</p><div class="title_right" id="autobtn">' + autohtml + '</div></div><div class="list">' + ListHtml.mobhtml + '</div><p class="tips"><span class="ico">*</span><span>开启自动解析后，最后一次选择的接口即自动解析默认接口</span></p><p class="tips"><span class="ico">*</span><span>本脚本仅学习使用，解析接口收集于网络，版权问题联系接口制作者，请勿相信解析接口显示的任何广告</span></p></div></div>'
            var btnhtml = '<div><div class="elevator"><a class="elevator-msg" id="Showmain"><svg t="1651763850342" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2320" width="200" height="200"><path d="M661.333333 665.6l51.2 12.8 42.666667-72.533333-34.133333-38.4c4.266667-21.333333 4.266667-38.4 4.266666-55.466667s0-34.133333-4.266666-51.2l34.133333-38.4-42.666667-72.533333-51.2 12.8c-25.6-21.333333-55.466667-42.666667-89.6-51.2L554.666667 256h-85.333334l-17.066666 51.2c-34.133333 8.533333-64 25.6-89.6 51.2l-51.2-12.8-42.666667 72.533333 34.133333 38.4c-4.266667 21.333333-4.266667 38.4-4.266666 55.466667s0 34.133333 4.266666 51.2l-34.133333 38.4 42.666667 72.533333 51.2-12.8c25.6 21.333333 55.466667 42.666667 89.6 51.2L469.333333 768h85.333334l17.066666-51.2c34.133333-8.533333 64-25.6 89.6-51.2z m38.4 81.066667c-21.333333 17.066667-51.2 34.133333-76.8 42.666666L597.333333 853.333333h-170.666666l-25.6-64c-29.866667-12.8-55.466667-25.6-76.8-42.666666l-68.266667 12.8-85.333333-149.333334 42.666666-51.2V512c0-17.066667 0-29.866667 4.266667-42.666667l-42.666667-51.2 85.333334-149.333333 68.266666 12.8c21.333333-17.066667 51.2-34.133333 76.8-42.666667L426.666667 170.666667h170.666666l25.6 64c29.866667 12.8 55.466667 25.6 76.8 42.666666l68.266667-12.8 85.333333 149.333334-42.666666 51.2c4.266667 12.8 4.266667 29.866667 4.266666 42.666666s0 29.866667-4.266666 42.666667l42.666666 51.2-85.333333 149.333333-68.266667-4.266666zM512 554.666667c25.6 0 42.666667-17.066667 42.666667-42.666667s-17.066667-42.666667-42.666667-42.666667-42.666667 17.066667-42.666667 42.666667 17.066667 42.666667 42.666667 42.666667z m0 85.333333c-72.533333 0-128-55.466667-128-128s55.466667-128 128-128 128 55.466667 128 128-55.466667 128-128 128z" fill="#ffffff" p-id="2321"></path></svg><span class="">解析设置</span></a><a  id="playing" class="elevator-faq" target="_blank"><svg t="1651762741797" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1235" width="200" height="200"><path d="M512 853.333333c-187.733333 0-341.333333-153.6-341.333333-341.333333s153.6-341.333333 341.333333-341.333333 341.333333 153.6 341.333333 341.333333-153.6 341.333333-341.333333 341.333333z m0-85.333333c140.8 0 256-115.2 256-256s-115.2-256-256-256-256 115.2-256 256 115.2 256 256 256z m128-256l-213.333333 128V384l213.333333 128z" fill="#ffffff" p-id="1236"></path></svg><span class="">解析播放</span></a></div>' + mainhtml+'</div>';
            document.body.insertAdjacentHTML('afterbegin', btnhtml);
            var css = `
                    body, html{font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif;}
                    .elevator{position: fixed;padding: 0 10px;top: 80%;margin-top: -140px;right: 10px;z-index: 899;background: rgb(64 64 64 / 81%);box-shadow: 1px 1px 8px 1px rgb(98 99 99 / 34%);border-radius: 30px;}
                    .elevator a{position: relative;display: block;width: 26px;height: 56px;font-size: 22px;line-height: 20px;color: #b5b9bc;box-sizing: border-box;text-align: center;}
                    .elevator a+a:after{position: absolute;top: 0;left: 50%;margin-left: -12px;content: '';width: 24px;border: 1px solid #F3F5F7;}
                    .elevator a:hover{color: #14191e;}
                    .elevator .icon{font-size: 24px;line-height: 56px;color: #199b6d;width: 28px;height: 28px;margin: 14px 0;}
                    .elevator .icon:hover{color: #14191e;}
                    .elevator a span{display: none;padding: 14px 0;font-size: 12px;color: #fff;line-height: 14px;}
                    .elevator .elevator-msg:hover .icon,.elevator .elevator-faq:hover .icon,{display: none;}
                    .elevator .elevator-msg:hover span,.elevator .elevator-faq:hover span,{display: inline-block;}
                    .mob-main{display: none;}
                    .shaw{width: 100%;height: 100%;position: fixed;top: 0;left: 0;z-index: 99998;background: rgba(0,0,0,0.3);}
                    .listmian{position: fixed;width:100%;height:400px;bottom: 0;z-index: 99999;border-radius: 14px 14px 0 0;background: #fff;box-shadow: 0 -8px 10px 0 rgba(0,0,0,.09);}
                    .listmian-tit{background-color: #f5f5f5;height: 60px;position: relative;border-radius: 14px 14px 0 0;}
                    .listmian-tit p{color: #222;font-size: 18px;font-weight: 600;margin-left: 20px;line-height: 60px;float: left;}
                    .listmian-tit .title_right{float: right;margin-right: 20px;line-height: 60px;}
                    .listmian-tit .title_right span{display: inline-block;color: #222;font-size: 14px;vertical-align: middle;font-weight: 900;}
                    .title_right img{display: inline-block;width: 12px;height: 12px;margin-left: 3px;vertical-align: middle;}
                    .list{margin: 10px 20px;display:flex;flex-direction: row;flex-wrap: wrap;justify-content: space-between;height: 240px;overflow-y: scroll;align-content: flex-start}
                    .list span{display: inline-block;padding: 10px 5px;margin: 0 0 10px 0;background-color: #f6f8fa;border-radius: .07rem;min-width: 90px;text-align: center;font-size: 12px;line-height: 18px;}
                    .jiexiselect{color: #fc5531;}
                    .tips{margin: 5px 20px;}
                    .tips span{font-size: 12px;font-weight: 700;color: #333;line-height: 14px;}
                    .tips .ico{margin-right: 5px;color: #ff6022;}
 
          `;
            commonFunction.GMaddStyle(css);
            _this.CheckAutoplay();
            if (commonFunction.getItem('selectid') != null) {
                document.querySelector('#' + commonFunction.getItem('selectid')).classList.add("jiexiselect");
            }
 
            document.querySelector('#playing').addEventListener('click',function() {
                _this.autoplay();
                commonFunction.Toast('3秒后自动解析视频',3000);
 
            });
            document.querySelector('#Showmain').addEventListener('click',function() {
                document.querySelector(".mob-main").style.display = "block"
            });
            document.querySelector('.shaw').addEventListener('click',function() {
                document.querySelector(".mob-main").style.display = "none"
            })
 
            document.querySelector('#autobtn').addEventListener('click',function() {
                if (commonFunction.getItem('AutoPlay') == 1) {
                    this.innerHTML = onautohtml;
                    commonFunction.setItem('AutoPlay', '0');
                } else {
                    this.innerHTML = offautohtml;
                    commonFunction.setItem('AutoPlay', '1');
                    commonFunction.Toast('请选择自动解析接口',2000);
                };
            });
            var list = document.getElementsByClassName('mob-jiexi');
            for (var i in list) {
                list[i].addEventListener('click',function() {
                    commonFunction.Toast('开始解析视频',2000);
                    if (commonFunction.getItem('selectid') != null) {
                        document.querySelector('#' + commonFunction.getItem('selectid')).classList.remove("jiexiselect");
                    }
                    var playObjecturl = this.getAttribute("data-url");
                    var playid = this.getAttribute("id");
                    console.log(playid);
                    commonFunction.setItem('selectid', playid);
                    commonFunction.setItem('selecturl', playObjecturl);
                    this.classList.add("jiexiselect");
                    document.querySelector(".mob-main").style.display = "none";
                    let url = playObjecturl + window.location.href;
                    console.log(url);
                    _this.GoPlay(url);
                });
            }
        },
        //---------------------------------------------------------------
        //检查自动播放
        CheckAutoplay:function(jiexitime) {
            const _this = this
            if (commonFunction.getItem("AutoPlay") == 1) {
                _this.autoplay();
                commonFunction.Toast(`${ZHwindow?.zhihu?.Delaytime??3}秒后自动解析视频`,`${ZHwindow?.zhihu?.Delaytime??3}`*1000);
 
            }
        },
        //-----------------------------------------------------------------------
        //自动播放
        autoplay:async function(){
            const _this = this
            await commonFunction.sleep(`${ZHwindow?.zhihu?.Delaytime??3}`*1000);
            var f = "";
            var autoplayurl;
            if (commonFunction.getItem('selecturl') != null&&commonFunction.getItem('selecturl') != "null") {
                f = commonFunction.getItem('selecturl');
            }
            if (f != "") {
                ZHwindow.zhihu.selecturl = f;
                autoplayurl = f + config.playhref;
            } else {
                let defurl = playList[0].url;
                ZHwindow.zhihu.selecturl = defurl;
                autoplayurl = defurl + config.playhref;
            }
            _this.GoPlay(autoplayurl);
        },
        //延迟时间
        Delay:function(){
            var Delaytime = commonFunction.getItem('Delaytime') != null ? commonFunction.getItem('Delaytime'): 3;
            ZHwindow.zhihu = {
                "Delaytime":Delaytime,
                "episode":[],
                "currently_episode":"",
                "pre_episode":"",
                "next_episode":"",
                "selecturl":"",
                "selectid":"",
                "decide":false,
                "mg":false,
                "playnode":"",
                "playwork":"",
                "ismonitor":false
            }
        },
        //播放元素采集
        Getepisode:async function(){
            const Pushiqiyiepisode =()=>{
                let data = ZHwindow?.__cachePlaylist_?.main;
                if(!data) return;
                let contentType = data[0]?.contentType;
                if(!contentType) return;
                let i = 0;
                data.forEach((item,index)=>{
                    if(item.contentType ==1){
                        let json ={"index":i,"title":item.shortTitle,"playurl":item.pageUrl,"order":item.order??"" };
                        ZHwindow.zhihu.episode.push(json);
                        i++;
                    }
                });
                return ZHwindow.zhihu.episode;
            }
            const Pushqqepisode = ()=>{
                let data = ZHwindow?.__pinia?.episodeMain?.listData;
                console.log(data);
                let currentVid = ZHwindow?.__pinia?.global?.currentVid;
                console.log(currentVid);
                if(!data||!currentVid) return;
                let newdata=[];
                data.forEach((item)=>{
                    newdata.push.apply(newdata,item);
                });
                let i = 0;
                for(let index = 0;index < newdata.length;index ++){
                    if(newdata[index].item_params.is_trailer !=1){
                        let playurl = config.playhref.replace(currentVid,newdata[index].item_params.vid);
                        let json ={"index":i,"title":newdata[index].item_params.play_title??newdata[index].item_params.title,"playurl":playurl,"order":newdata[index].item_params.title??"" };
                        ZHwindow.zhihu.episode.push(json);
                        i++;
                    }
                };
                return ZHwindow.zhihu.episode;
            }
            const Pushyoukuepisode = ()=>{
                let data = ZHwindow?.playerAnthology?.list;
                let currentVid = ZHwindow?.__INITIAL_DATA__?.videoId;
                if(!data||!currentVid) return;
                let showId = ZHwindow?.__INITIAL_DATA__?.showId;
                let i = 0;
                for(let index = 0;index < data.length;index ++){
                    let seq = data[index].seq;
                    if(seq){
                        let playurl = config.playhref.replace(currentVid,data[index].encodevid).replace(showId,data[index].showId);
                        let json ={"index":i,"title":data[index].title,"playurl":playurl,"order":parseInt(seq)>1000?data[index].title:seq };
                        ZHwindow.zhihu.episode.push(json);
                        i++;
                    }
                };
                return ZHwindow.zhihu.episode;
            }
            const Pushmgepisode = () =>{
                let currentVid = ZHwindow?.__NUXT__?.data[0]?.videoInfo.vid;
                if(!currentVid) return;
                let request = commonFunction.request("GET",'https://pcweb.api.mgtv.com/episode/list?abroad=0&_support=10000000&version=5.5.35&page=1&size=50&video_id='+currentVid,null,null);
                request.then(function(resdata){
                    let obj = JSON.parse(resdata.data);
                    let count = obj.data.count;
                    if(count){
                        // console.log(page,currentVid,arr1)
                        if(count<=50){
                            var page = 1
                            }else{
                                page =Math.ceil(count/50)
                            }
                        let arr1 =[];
                        let QQPromise = new Promise(function(resolve, reject){
                            recurTest(0, page,currentVid,arr1);
                            function recurTest(j,p,currentVid,arr){
                                setTimeout(function(){
                                    if(++j <= p){
                                        let request2 = commonFunction.request("GET",'https://pcweb.api.mgtv.com/episode/list?abroad=0&_support=10000000&version=5.5.35&size=50&video_id='+currentVid+'&page='+j,null,null);
                                        request2.then(function(resdata2){
                                            let obj=JSON.parse(resdata2.data);
                                            if(obj.code == 200){
                                                let list =obj.data.list;
                                                arr1 = arr.concat(list)
                                                recurTest(j, p,currentVid,arr1);
                                                if(j==p){
                                                    resolve(arr1)
                                                };
                                            }else{
                                                commonFunction.Toast("获取下载列表失败");
                                            }
                                        });
                                    }
                                }, Math.random() * 100);
                            }
                        });
                        QQPromise.then((data) => {
                            let i = 0;
                            for(let index = 0;index < data.length;index ++){
                                let isIntact = data[index].isIntact;
                                if(isIntact != 3){
                                    let playurl = "https://"+window.location.host+data[index].url
                                    let json ={"index":i,"title":data[index].t2,"playurl":playurl,"order":parseInt(data[index].t4)>2000?data[index].t2:data[index].t1};
                                    ZHwindow.zhihu.episode.push(json);
                                    i++;
                                }
 
                            };
                        });
                    }
                });
            }
            const Pushbiliepisode = ()=>{
                let data = ZHwindow?.__INITIAL_STATE__?.epList;
                if(!data) return;
                let i = 0;
                data.forEach((item,index)=>{
                    if(item.badgeType != 1){
                        let json ={"index":i,"title":item.longTitle!=""?item.longTitle:item.titleFormat,"playurl":item.share_url,"order":item.title??"" };
                        ZHwindow.zhihu.episode.push(json);
                        i++;
                    }
                });
                return ZHwindow.zhihu.episode;
 
            }
            const episode = async (site,currentplayurl)=>{
                var episode;
                if(site == "qq"){ episode = await Pushqqepisode();}
                if(site == "iqiyi"){ episode = await Pushiqiyiepisode();}
                if(site == "youku"){ episode = await Pushyoukuepisode(currentplayurl);}
                if(site == "mg"){
                    await Pushmgepisode();await commonFunction.sleep(2000);episode = ZHwindow.zhihu.episode
                }
                if(site == "bili"){ episode = await Pushbiliepisode();currentplayurl = ZHwindow?.__INITIAL_STATE__?.epInfo?.share_url}
                console.log(episode)
                if(!episode||episode==""||!currentplayurl) return;
                for( let index = 0;index <episode.length;index++ ){
                    if(currentplayurl ==episode[index].playurl){
                        let pre_index = index - 1;
                        let next_index = index + 1;
                        ZHwindow.zhihu.currently_episode = {
                            "index":episode[index].index,
                            "title":episode[index].title,
                            "playurl":episode[index].playurl,
                            "order":episode[index].order??"",
                        };
                        if(pre_index >= 0){
                            ZHwindow.zhihu.pre_episode = {
                                "index":episode[pre_index].index,
                                "title":episode[pre_index].title,
                                "playurl":episode[pre_index].playurl,
                                "order":episode[pre_index].order??"",
                            };
                        }
                        if(next_index<episode.length){
                            ZHwindow.zhihu.next_episode = {
                                "index":episode[next_index].index,
                                "title":episode[next_index].title,
                                "playurl":episode[next_index].playurl,
                                "order":episode[next_index].order??"",
                            };
                        }
                    }
                };
                ZHwindow.zhihu.decide = true;
            }
 
            if(config.host.indexOf("www.iqiyi.com")!=-1){
                let pathname = "http://"+window.location.host+window.location.pathname
                await episode("iqiyi",pathname);
                return ZHwindow.zhihu.decide;
            }
            if(config.host.indexOf("v.qq.com")!=-1){
                await episode("qq",config.playhref);
                return ZHwindow.zhihu.decide;
            }
            if(config.host.indexOf("v.youku.com")!=-1){
                await episode("youku",config.playhref);
                return ZHwindow.zhihu.decide;
            }
            if(config.host.indexOf("www.mgtv.com")!=-1){
                let pathname = "https://"+window.location.host+window.location.pathname
                await episode("mg",pathname);
                return ZHwindow.zhihu.decide;
            }
            if(config.host.indexOf("www.bilibili.com")!=-1){
                await episode("bili","");
                return ZHwindow.zhihu.decide;
            }
 
        },
        episodeHtml:async function(){
            const _this = this
            let css =`
                 ::-webkit-scrollbar {height: 6px;width: 6px;}
                 ::-webkit-scrollbar-track {background: transparent;width: 6px;}
                 ::-webkit-scrollbar-thumb {background-color: #191a20;border-radius: 4px;-webkit-transition: all 1s;transition: all 1s;width: 6px;}
                 ::-webkit-scrollbar-corner {background-color: #191a20;}
                 .zhihuepisode{display: none;position: absolute;top: 0;left: 0;width: 100%;z-index: 9999999999;}
                 .episode_main{min-height: 160px;max-height: 250px;display: flex;justify-content: space-between;padding: 20px 20px 0 20px;box-sizing: border-box;position: relative;background: linear-gradient(rgb(0 0 0 / 73%), rgb(0 0 0 / 32%), rgb(0 0 0 / 0%));}
                 .episode_main .pre_btn{position: absolute;top: 50%;transform: translate(0,-50%);}
                 .episode_main .next_btn{position: absolute;top: 50%;transform: translate(0,-50%);right: 20px;}
                 .episode_main .btn{background: #5050507a;width: 45px;border-radius: 5px;position: relative;height: 80px;}
                 .episode_main .icon{width: 30px;height: 30px;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);}
                 .episode_main .centent{width: 100%;padding: 0 20px;margin: 0 45px;}
                 .centent .centent_header{height: 40px;line-height: 40px;}
                 .centent .title{color: #fff;font-size: 22px;font-weight: 600;width: 45%;display: inline-block;white-space: nowrap;overflow: hidden;}
                 .centent .title:first-child{margin-right:10%}
                 .centent ul{margin-top: 15px;overflow-y: auto;min-height: 80px;max-height:150px;text-align: center;}
                 .centent li{display: inline-block;margin: 0 10px 9px 0;padding: 10px 15px;background: #14161a;color: #fff;font-size: 14px;border-radius: 3px;}
                 .centent li p{overflow: hidden;white-space: nowrap;max-width: 330px;min-width: 30px;}
                 .centent li:hover p{color:#e6b673}
                 #handle_btn{text-align: center;}
                 #handle_btn .icon{height: 36px;}
                 #handle_btn .active{transform:rotate(180deg);-ms-transform:rotate(180deg);-moz-transform:rotate(180deg);-webkit-transform:rotate(180deg);-o-transform:rotate(180deg); }
             `;
            var hasepisode = true;
            if(ZHwindow.zhihu.decide == false){
                hasepisode =await _this.Getepisode();
                commonFunction.GMaddStyle(css);
            };
            if(!hasepisode )return;
            let cententHtml ="",ListHtml="",nextHtml="",currentlyHtml="";
            let episode = ZHwindow.zhihu.episode;
            episode.forEach((item,index)=>{
                let title = item.order!=""?item.order:item.title;
                if(index == ZHwindow.zhihu.currently_episode.index){ListHtml +='<li data-index="'+item.index+'" data-playurl="'+item.playurl+'" style="color:#e6b673"><p>'+title+'</p></li>'}else{ListHtml +='<li data-index="'+item.index+'" data-playurl="'+item.playurl+'"><p>'+title+'</p></li>'};
            });
            let next_episode = ZHwindow.zhihu.next_episode;
            let currently_episode = ZHwindow.zhihu.currently_episode;
            if(next_episode) nextHtml = '<span class="title" style=" text-align: right;">下一集：'+ZHwindow.zhihu.next_episode.title+'</span>'
            if(currently_episode)currentlyHtml ='<span class="title">当前播放：'+ZHwindow.zhihu.currently_episode.title+'</span>'
            cententHtml = '<div class="centent_header">'+currentlyHtml+nextHtml+'</div><div><ul style="">'+ListHtml+'</ul></div></div>'
            let mainHtml = `<div class="zhihuepisode"><div class="episode_main">
             <div class ="pre_btn" title="上一集"><div class="btn" id="pre_btn"><svg t="1660144513194" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1042" width="200" height="200" class="icon"><path d="M803.342997 87.013896a47.908827 47.908827 0 0 0 0-70.993102A61.421574 61.421574 0 0 0 723.904429 13.256823l-3.173448 2.763971L241.23323 470.949915l-2.405678 1.842647c-1.637909 1.228431-3.173448 2.559232-4.606618 3.941218-20.013196 18.938319-20.985704 48.113566-2.86634 68.075577l2.815155 2.917525 484.820954 459.945216c22.521244 21.343997 60.090773 21.343997 82.612016 0 20.013196-18.938319 20.985704-48.113566 2.86634-68.075577l-2.86634-2.968709-446.893132-423.911227L803.342997 87.013896z" p-id="1043" fill="#ffffff"></path></svg></div></div>
             <div class="centent">
             ${cententHtml}
             <div class ="next_btn"  title="下一集"><div class="btn" id="next_btn"><svg t="1660144717762" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1256" width="200" height="200" class="icon"><path d="M220.742316 86.988416a47.894798 47.894798 0 0 1 0-70.972314A61.403588 61.403588 0 0 1 300.157623 13.252941l3.172518 2.763161 479.459681 454.795906 2.353804 1.842108c1.637429 1.228072 3.172519 2.558483 4.605269 3.940064 20.058505 18.932773 20.979559 48.099477 2.91667 68.055643l-2.8655 2.91667-484.678986 459.810532a61.250079 61.250079 0 0 1-82.587825 0 47.741289 47.741289 0 0 1-2.865501-68.055643l2.865501-2.96784 446.76227-423.787094L220.742316 86.988416z" p-id="1257" fill="#ffffff"></path></svg></div></div>
             </div>
             <div id="handle_btn" title="隐藏剧集列表"><svg t="1661155380003" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2380" width="200" height="200"><path d="M512 436.7L878 648c14.3 8.3 32.7 3.3 41-11 8.3-14.3 3.3-32.7-11-41L527.8 376.5c-0.7-0.4-1.3-0.8-2-1.1-0.1 0-0.2-0.1-0.3-0.1-0.3-0.1-0.5-0.3-0.8-0.4-0.2-0.1-0.5-0.2-0.7-0.3-0.1 0-0.2-0.1-0.2-0.1-3.6-1.5-7.3-2.3-11-2.4h-1.4c-3.7 0.1-7.5 0.9-11 2.4-0.1 0-0.2 0.1-0.3 0.1-0.2 0.1-0.5 0.2-0.7 0.3-0.3 0.1-0.5 0.3-0.8 0.4-0.1 0-0.2 0.1-0.2 0.1-0.7 0.4-1.4 0.7-2 1.1L116 596c-14.3 8.3-19.2 26.7-11 41 8.3 14.3 26.7 19.2 41 11l366-211.3z" fill="#ffffff" p-id="2381"></path></svg></div>
             </div>`
            return mainHtml;
        },
        Changeepisode:function(index){
            let pre_index = index - 1;
            let next_index = index + 1;
            console.log(index,next_index)
            let episode = ZHwindow.zhihu.episode;
            ZHwindow.zhihu.currently_episode = {
                "index":episode[index].index,
                "title":episode[index].title,
                "playurl":episode[index].playurl,
                "order":episode[index].order??"",
            };
            if(pre_index >= 0){
                ZHwindow.zhihu.pre_episode = {
                    "index":episode[pre_index].index,
                    "title":episode[pre_index].title,
                    "playurl":episode[pre_index].playurl,
                    "order":episode[pre_index].order??"",
                };
            }else{ZHwindow.zhihu.pre_episode =""};
            if(next_index<episode.length){
                ZHwindow.zhihu.next_episode = {
                    "index":episode[next_index].index,
                    "title":episode[next_index].title,
                    "playurl":episode[next_index].playurl,
                    "order":episode[next_index].order??"",
                };
            }else{ZHwindow.zhihu.next_episode =""}
        },
        //-------------------------------------------
        //执行播放
        GoPlay:async function(playurl){
            const _this =this
            var PlayID = ZHwindow.zhihu.playnode;
            if(PlayID ===null){return};
            if(ZHwindow.zhihu.playwork == true && ZHwindow.zhihu.ismonitor ==false){commonFunction.setIntervalhost();ZHwindow.zhihu.ismonitor = true};
            var iframeDivCss = "width:100%;height:100%;"
            if (config.host.indexOf("m.iqiyi.com") != -1) {
                iframeDivCss += "position: absolute;top: 0;right: 0;bottom: 0;left: 0;"
            }
            let getepisodeHtml =await _this.episodeHtml();
            console.log(getepisodeHtml)
            var episodeHtml ="";
            if(getepisodeHtml)episodeHtml = getepisodeHtml;
            var videoPlayer = "<div style='" + iframeDivCss + "' id='zhihuplay'>"+episodeHtml+"<iframe id='iframe-player-zhihu' src='" + playurl + "' frameborder='0' allowfullscreen='true' width='100%' height='100%'></iframe></div>";
            var b = commonFunction.Videosetinterval(PlayID);
            b.then(function(bnode){
                document.querySelector(bnode).innerHTML = "";
                document.querySelector(bnode).innerHTML = videoPlayer;
                let pre_btn = document.querySelector("#pre_btn");
                let next_btn = document.querySelector("#next_btn");
                let handle_btn = document.querySelector("#handle_btn");
                let episodelist = document.querySelectorAll(".episode_main ul li");
                if(!episodelist)return;
                if(pre_btn){
                    pre_btn.onclick=async()=>{
                        let preurl = ZHwindow.zhihu.pre_episode.playurl;
                        let index = ZHwindow.zhihu.pre_episode.index;
                        if(index >= 0){
                            let Changeep = await _this.Changeepisode(index);
                            _this.GoPlay(ZHwindow.zhihu.selecturl+preurl);
                        }else{
                            commonFunction.Toast(`已经是第一集啦！！！`,3000);
                        }
                    }
                }
                if(next_btn){
                    next_btn.onclick=async()=>{
                        let nexturl = ZHwindow.zhihu.next_episode.playurl;
                        let index = ZHwindow.zhihu.next_episode.index;
                        if(index){
                            let Changeep = await _this.Changeepisode(index);
                            _this.GoPlay(ZHwindow.zhihu.selecturl+nexturl);
                        }else{
                            commonFunction.Toast(`已经是最后一集啦！！！`,3000);
                        }
                    }
                }
                episodelist.forEach((item,index)=>{
                    item.onclick=async()=>{
                        let currentindex = parseInt(item.getAttribute("data-index"));
                        let currentlyurl = item.getAttribute("data-playurl");
                        let Changeep = await _this.Changeepisode(currentindex);
                        _this.GoPlay(ZHwindow.zhihu.selecturl+currentlyurl);
                    }
 
                })
                if(handle_btn){
                    handle_btn.onclick=()=>{
                        let active =handle_btn.querySelector(".icon").classList.contains("active");
                        if(active ==false){
                            handle_btn.querySelector(".icon").classList.add("active");
                            handle_btn.setAttribute("titlt","展开剧集列表")
                            document.querySelector(".episode_main").style.display = "none";
                        }else{
                            handle_btn.querySelector(".icon").classList.remove("active");
                            handle_btn.setAttribute("titlt","隐藏剧集列表");
                            document.querySelector(".episode_main").style.display = "flex";
                        }
 
                    }
                }
            });
 
        }
    }
    //视频解析结束
    
    
    //短视频下载开始
    const ControllerShortvideo ={
        ShortvideoidList:function(){
            var ShortvideoidList = [
                { url:"www.ixigua.com", videoid:commonFunction.geturlid(config.playhref),nodeid:[".xg-right-grid"]},
 
            ];
            var Shortvideoid = {};
            for(var i in ShortvideoidList) { //获得窗口ID
                if (ShortvideoidList[i].url == config.host) {
                    Shortvideoid = {
                        videoid :ShortvideoidList[i].videoid,
                        nodeid :ShortvideoidList[i].nodeid
                    }
                    return Shortvideoid
                    break;
                }
            }
            if(!Shortvideoid){
                return;
            }
        },
        ToastDwon:function(videourl,filename,mode) {
            var m = document.createElement('div');
            m.innerHTML ='<h3 style="text-align: center;margin: 15px 0;font-size: 18px;font-weight: bold;"> 下载视频 </h3><div style="word-break: break-all;padding: 10px;background: #f1f1f1; font-size: 12px; height: 100px;overflow-y: scroll;box-sizing: border-box;margin-bottom: 10px;border-radius: 5px;"><p>'+videourl+'</p> </div><div style="display: flex;float: right;font-size: 14px;"><div id="close" style="margin-right: 15px;">关闭</div> <div> <a  id="videofile">下载</a></div></div><div style="float: left;font-size: 14px;"><div> <a href="'+videourl+'" target="_blank">浏览器打开</a></div></div>';
            m.setAttribute('id','dwon');
            m.style.cssText = "max-width: 480px;min-width: 150px;padding: 0 25px;height: 200px;color: #323442;line-height: 20px;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999998;background: #fff;font-size: 16px;box-shadow: 1px 1px 50px rgb(0 0 0 / 40%);font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif;";
            document.body.appendChild(m);
            document.querySelector("#close").addEventListener('click',function() {
                document.body.removeChild(document.querySelector("#dwon"))
            })
            document.querySelector("#videofile").addEventListener('click',function() {
                commonFunction.Toast("创建下载需要时间,长时间未创建，点击浏览器打开,右键另存为",4000);
                if(mode ==1){
                    GM_download({
                        url:videourl+'.mp4',
                        name: filename,
                        saveAs: true, //布尔值，显示"保存为"对话框
                        onerror: function (error) {
                            commonFunction.Toast("下载出错,点击浏览器打开手动保存",3000)
                        },
                        onprogress: (pro) => {
                        },
                        ontimeout: () => {
                            //如果此下载由于超时而失败，则要执行的回调
                            commonFunction.Toast("下载超时,点击浏览器打开手动保存",3000)
                        },
                        onload: () => {
                            commonFunction.Toast(filename+"下载完成",3000)
                        }
                    })
                }else{
                    fetch(videourl+'.mp4').then(res => res.blob()).then(blob => {
                        const a = document.createElement('a');
                        document.body.appendChild(a)
                        a.style.display = 'none'
                        const url = window.URL.createObjectURL(blob);
                        a.href = url;
                        a.download = filename;
                        a.click();
                        document.body.removeChild(a)
                        window.URL.revokeObjectURL(url);
                    });
                }
            })
        },//公共下载弹窗结束
        //西瓜视频下载开始
        xiguabtn:function() {
            setTimeout(function(){
                var Shortvideoid = ControllerShortvideo.ShortvideoidList();
                var xigua= document.querySelector(Shortvideoid.nodeid[0]);
                console.log(xigua)
                if(xigua){
 
                    let btnHTML = '<div id="downvideo" class="playerControlsItemContainer" ><div class="xgplayer-control-item control_definition common-control-item"><div class="xgplayer-control-item__entry"><div class="xgpcPlayer_textEntry"><span>下载</span></div></div></div></div>';
                    xigua.insertAdjacentHTML('afterbegin', btnHTML);
                    ControllerShortvideo.getxgvideo(Shortvideoid.videoid)
                };
            },3000);
        },
        getxgvideo:function(d){
            document.querySelector('#downvideo').addEventListener('click',function() {
                commonFunction.Toast("正在获取视频文件",1000);
                let headers = {
                    "Content-type": "application/json"
                };
                let request = commonFunction.request("POST","http://47.99.158.118/video-crack/v2/parse?content="+config.playhref,headers,null);
                request.then(function(resdata){
                    if(resdata.result == "success"){
                        let obj=JSON.parse(resdata.data);
                        if(obj.code == 0){
                            commonFunction.Toast("视频获取成功",1000)
                            ControllerShortvideo.ToastDwon(obj.data.url,d)
                        }else {
                            commonFunction.Toast("此视频不支持解析")
                        }
                    }
                })
            })
        }
        //西瓜视频下载结束
 
    }
    //短视频下载结束
    //aria2设置开始
    const Controlleraria2 = {
        aria2set:function(b){
            let css= `
            .layui-form{display: flex;margin-top: 20px;}
            .layui-form-label{box-sizing: content-box;}
            .layui-input-block p{font-size:12px}
            .layui-form-item{margin-bottom:5px}
            .layui-input-block{min-height:auto;}
            .main-left{width: 367px;}
            .zhihu-scan{width:180px;display:inline-block;text-align: center;margin-right: 40px;}
            .zhihu-scan img{width: 140px;margin: 0 5px 10px 5px;}
            .zhihu-scan h1{font-size: 18px;font-weight: bold;margin: 0px 0 20px 0;}
            .zhihu-scan p{margin: 0;color: #666;font-size: 14px;}
         `;
            commonFunction.GMaddStyle(css);
            document.querySelector("#aria2set") .addEventListener('click',function() {
                let rpc="ws://localhost:6800/jsonrpc";
                if(commonFunction.getItem("rpc")!=null){
                    rpc= commonFunction.getItem("rpc")
                }
                let token="";
                if(commonFunction.getItem("token")!=null){
                    token= commonFunction.getItem("token")
                }
                let mulu="E:\Internet Download";
                if(commonFunction.getItem("mulu")!=null&&commonFunction.getItem("mulu")!=""){
                    mulu= commonFunction.getItem("mulu")
                }
                let contenthtml ="";
                contenthtml +='<form class="zhihu-form" style="height: 325px;"><div class="main-left">'
                contenthtml +='<div class="zhihu-form-item"> <label class="zhihu-form-label">RPC地址</label><div class="zhihu-input-inline"><input name="rpc" value="'+rpc+'"  placeholder="" class="zhihu-input"></div></div>'
                contenthtml +='<div class="zhihu-form-item" style="color: #acaeb5;"><div class="zhihu-input-block"><p>Aria2配置:ws://localhost:6800/jsonrpc<br>Motrix配置:ws://localhost:16800/jsonrpc</p></div></div>'
                contenthtml +='<div class="zhihu-form-item"> <label class="zhihu-form-label">token</label><div class="zhihu-input-inline"><input name="token" value="'+token+'"  placeholder="" class="zhihu-input"></div></div>'
                contenthtml +='<div class="zhihu-form-item" style="color: #acaeb5;"><div class="zhihu-input-block"><p>没有请留空</p></div></div>'
                contenthtml +='<div class="zhihu-form-item"> <label class="zhihu-form-label">保存地址</label><div class="zhihu-input-inline"><input name="mulu" value="'+mulu+'"  placeholder="留空使用默认目录" class="zhihu-input"></div></div>'
                contenthtml +='<div class="zhihu-form-item" style="color: #acaeb5;"><div class="zhihu-input-block"><p>留空使用默认目录</p></div></div>'
                contenthtml +='<div style="font-size: 12px;color: #000;margin-left:15px;text-align: left;"><div style="line-height: 3;"></div>'
                commonFunction.open({
                    area: ['580', '450'],
                    title: "批量下载设置",
                    shade: 0,
                    id:"biliset",
                    btn: ['取消', '保存设置'],
                    content:contenthtml,
                    btn1: function(data) {
                        var n = data.getElementsByTagName('input');
                        for(let i= 0; i <n.length; i++ ){
                            if (n[i].getAttribute("name") == "rpc") {
                                commonFunction.setItem("rpc",n[i].value);
                            }
                            else if (n[i].getAttribute("name") == "token") {
                                commonFunction.setItem("token",n[i].value);
                            }
                            else if (n[i].getAttribute("name") == "mulu") {
                                commonFunction.setItem("mulu",n[i].value);
                            }
                        }
                    }
                });
            });
            document.querySelector("#all") .addEventListener('click',function() {
 
                b.forEach(function(element) {
                    element.checked = true;
 
                })
                commonFunction.Toast("已经全部选择",3000)
            });
            document.querySelector("#delall") .addEventListener('click',function() {
 
                b.forEach(function(element) {
                    element.checked = false;
                });
                commonFunction.Toast("已经全部取消选择",3000)
            });
        },
        addUri:function(u,t) {
            //配置
            return new Promise(function(resolve, reject) {
                var wsurl = commonFunction.getItem("rpc");;
                var uris = [u];
                var token="";
                var filename = t
                if(commonFunction.getItem("mulu")!=null&&commonFunction.getItem("mulu")!=""){
                    var mulu= commonFunction.getItem("mulu")
                    }else{
                        mulu ="D:/"
                    }
                var options = {
                    "dir":mulu,
                    "max-connection-per-server": "16",
                    "header": [ `User-Agent: ${config.UA}`, `Referer:https://${config.playhref}`,`Cookie: ${document.cookie}` ]
                };
                if (filename != "") {
                    options.out = filename;
                }
                var json = {
                    "id": "zhihu",
                    "jsonrpc": '2.0',
                    "method": 'aria2.addUri',
                    "params": [uris, options],
                };
                console.log(json)
                if (token != "") {
                    json.params.unshift("token:" + token); // 坑死了，必须要加在第一个
                }
                var ws = new WebSocket(wsurl);
 
                ws.onerror = event => {
                    console.log(event);
                    commonFunction.Toast('连接错误, Aria2 连接错误，请检查RPC设置！');
                };
                ws.onopen = () => { ws.send(JSON.stringify(json)); }
 
                ws.onmessage = event => {
                    let received_msg = JSON.parse(event.data);
                    console.log(received_msg);
                    if (received_msg.error !== undefined) {
                        if (received_msg.error.code === 1)commonFunction.Toast('通过RPC连接失败', '请打开控制台查看详细错误信息，返回信息：' + received_msg.error.message);
                    }
                    resolve();
                    switch (received_msg.method) {
                        case "aria2.onDownloadStart":
                            commonFunction.Toast("Aria2 发送成功, "+filename+" 已经开始下载！",1000);
                            ws.close();
                            break;
                        default:
                            break;
                    }
                };
            });
        },
        plaria2:function(i,arr){
            setTimeout(function(){
                if(++i < arr.length){
                    Controlleraria2.addUri(arr[i].url,arr[i].title)
                    Controlleraria2.plaria2(i,arr);
                    console.log(i,arr.length)
                }
            }, Math.random() * 1000);
 
        }
    };
    //aria2设置结束
    //Bilibili下载开始
    const ControllerBilibili ={
        Addlist:async function(){
            const listHtml = ()=>{
                var Bilihtml="";
                var episodes = ZHwindow?.__INITIAL_STATE__?.sections[0]?.episodes;
                if(!episodes){
                    let aid = ZHwindow?.__INITIAL_STATE__?.videoData?.aid;
                    if(!aid)return;
                    let videolist = ZHwindow?.__INITIAL_STATE__?.videoData?.pages;
                    for (let i = 0; i < videolist.length; i++) {
                        Bilihtml += '<li><a href="javascript:void(0)" class="router-link-active" ><div class="clickitem"><div class="link-content"><input  data-aid="'+aid+'" data-cid="'+videolist[i].cid+'" title="'+videolist[i].part+'" type="checkbox" style="margin-right:5px"> <span class="page-num">P'+videolist[i].page+'</span><span class="part">'+videolist[i].part+'</span></div><div class="duration bilidown" data-aid="'+aid+'" data-cid="'+videolist[i].cid+'" title="'+videolist[i].part+'">下载</div></div></a></li>';
                    }
                }else {
                    for (let i = 0; i < episodes.length; i++) {
                        Bilihtml += '<li><a href="javascript:void(0)" class="router-link-active" ><div class="clickitem"><div class="link-content"><input  data-aid="'+episodes[i].aid+'" data-cid="'+episodes[i].cid+'" title="'+episodes[i].title+'" type="checkbox" style="margin-right:5px"><span class="part">'+episodes[i].title+'</span></div><div class="duration bilidown" data-aid="'+episodes[i].aid+'" data-cid="'+episodes[i].cid+'" title="'+episodes[i].title+'">下载</div></div></a></li>';
                    }
 
                }
                return Bilihtml;
            }
            var AddBi= commonFunction.Commonsetinterval(["#danmukuBox"]);
            AddBi.then(async function(node){
                await commonFunction.sleep(3000);
                let Bilihtml = await listHtml();
                if(!Bilihtml){commonFunction.Toast("获取下载列表失败,刷新重试");return;}
                let dataV = node.attributes[2]?.name??"data-v";
                let downhtml = '<div id ="downBox" class="multi-page report-wrap-module report-scroll-module" '+dataV+' style="margin:0 0 10px 0;border-radius: 6px;background: #F1F2F3;"><div class="head-con"><div class="head-left"><h3>下载列表</h3></div><div class="head-right"><span class="next-button" id="sanlian"><span class="txt" style="color: #00a1d6;">一键三连</span></span></div></div><div class="cur-list"><ul class="list-box">'+Bilihtml+'</ul></div><div style="display: flex;justify-content: space-between;height: 42px;line-height: 42px;margin: 0px 15px;font-size: 14px;font-weight: bold;border-top: 1px solid #dadada;"><div><span style="margin-right: 20px;" id="all">全选</span><span id="delall">重置</span></div><div><span style="margin-right: 20px;" id="aria2set">设置</span><a id="pldown"><span>批量下载</span></a></div></div></div>';
                node.insertAdjacentHTML('afterEnd', downhtml);
                ControllerBilibili.bilibilidown();
            });
        },
        bilibilidown:function(){
            var inu = document.querySelector("#downBox");
            var b=inu.getElementsByTagName('input');
            Controlleraria2.aria2set(b);
            document.querySelector("#sanlian") .addEventListener('click',function() {
                console.log("一键三连");
                document.querySelector(".like").click();
                document.querySelector(".coin").click();
            });
 
            document.querySelector("#pldown") .addEventListener('click',function() {
                let passwordCode = "685958";
                if (passwordCode !=""&&passwordCode !=null) {
                    let headers = {
                        "Content-Type": "text/html; charset=utf-8"
                    };
                    let request = commonFunction.request("GET","http://tool.zhihupe.com/bdwpcs.php?m=BILIBILI&author="+"zhihu"+"&PWD="+passwordCode,headers,null);
                    request.then(function(resdata){
                        let json=JSON.parse(resdata.data);
                        if(json.error == 1){
                            let arr =[];
                            b.forEach(function(element) {
                                if(element.checked == true){
                                    let aid = element.getAttribute("data-aid");
                                    let cid = element.getAttribute("data-cid");
                                    let title = element.getAttribute("title");
                                    let json ={
                                        "aid": aid,
                                        "cid": cid,
                                        "title": title,
                                    };
                                    arr.push(json);
                                }
                            })
                            if(arr.length == 0){
                                commonFunction.Toast("请选择需要下载的视频",3000)
                            }else{
                                ControllerBilibili.bipldown(arr);
                            }
                        }else if(json.error == -2){
                            let msg =json.msg
                            commonFunction.Toast(msg);
                        }else {
                            commonFunction.Toast('服务器请求失败，请重试！');
                        }
                    })
                }
            });
            let biliList = document.getElementsByClassName('bilidown');
            console.log(biliList);
            for (var i = 0; i < biliList.length; i++) {
                biliList[i].addEventListener('click',function() {
                    let aid = this.getAttribute("data-aid");
                    let cid = this.getAttribute("data-cid");
                    let title = this.getAttribute("title");
                    let headers = {
                        "Content-type": "application/json"
                    };
                    let request = commonFunction.request("GET","https://api.bilibili.com/x/player/playurl?avid="+aid+"&cid="+cid+"&qn=112",headers,null);
                    request.then(function(resdata){
                        let obj=JSON.parse(resdata.data);
                        if(obj.code == 0){
                            window.open(obj.data.durl[0].url,false);
                            console.log(obj)
                        }else{
                            commonFunction.Toast("获取下载链接失败");
                        }
                    })
 
                });
            }
        },
        //批量下载相关代码
        bipldown:function(a){
            let pldownarr=[];
            for (var i = 0; i < a.length; i++) {
                let title = i+1+"、"+a[i].title;
                title =title.replace(/[\ |\~|\`|\=|\||\\|\;|\:|\"|\'|\,|\.|\>|\/]/g,"_");
                let headers = {
                    "Content-type": "application/json"
                };
                let request = commonFunction.request("GET","https://api.bilibili.com/x/player/playurl?avid="+a[i].aid+"&cid="+a[i].cid+"&qn=112",headers,null);
                request.then(function(resdata){
                    let obj=JSON.parse(resdata.data);
                    if(obj.code == 0){
                        let json ={
                            "url": obj.data.durl[0].url,
                            "title":title+".flv",
                        };
                        pldownarr.push(json);
                        if(pldownarr.length==a.length){
                            console.log(pldownarr);
                            Controlleraria2.plaria2(-1,pldownarr);
                        }
                    }else{
                        commonFunction.Toast("获取下载链接失败");
                    }
                })
            }
        },
 
    };
    //Bilibili下载结束
    //------------------------------------------------------------------------
    //CSDN解除开始
    const Controllercsdn = {
        blog:async function(){
            const copy =()=>{
                let copynode = document.querySelectorAll("pre");
                copynode.forEach(function(item){
                    item.style.cssText = "user-select: auto;";
                    item.querySelector("code").style.cssText = "user-select: auto;";
                    item.querySelector("code").setAttribute("onclick","mdcp.copyCode(event)");
                    item.querySelector(".hljs-button").setAttribute("class","hljs-button {2}");
                    item.querySelector(".hljs-button").setAttribute("data-title","复制");
                });
                let copybtn = document.querySelectorAll("code .hljs-button");
                copybtn.forEach(function(item){
                    item.addEventListener('click',function() {
                        setTimeout(function(){
                            item.setAttribute("data-title","复制");
                            console.log("复制")
                        },3500);
                    });
                });
                commonFunction.Toast("解除复制限制成功",500);
 
            };
            const quanwen =() =>{
                var hide = commonFunction.Commonsetinterval([".hide-article-box.text-center"]);
                hide.then(function(hidenode){
                    hidenode.parentNode.removeChild(hidenode);
                    document.getElementById("article_content").style="height: *px; ";
                    commonFunction.Toast("解除阅读全文限制成功",500);
                });
            }
            const link =()=>{
                let linknode = document.getElementById("article_content").querySelectorAll("a");
                linknode.forEach(function(item){
                    if(item.origin!= window.location.origin){
                        item.onclick =(event)=> {
                            if (event.stopPropagation) {
                                event.stopPropagation();
                            }
                            item.setAttribute("target", "_blank");
                        };
                        commonFunction.Toast("解除外链重定向限制成功",500);
                    }
                })
            }
            //去除复制小尾巴
            try {
                // 复制时保留原文格式，参考 https://greasyfork.org/en/scripts/390502-csdnremovecopyright/code
                Object.defineProperty(unsafeWindow, "articleType", {
                    value: 0,
                    writable: false,
                    configurable: false
                });
                await commonFunction.sleep(1500);
                copy();
                quanwen();
                link();
            } catch (error) {
                console.log(error)
            }
 
        }
    };
    //CSDN解除结束
    //-------------------------------------
    //脚本设置开始
    if(commonFunction.IsPC()===true){
        commonFunction.menusetting();
        // GM_deleteValue("videosetting");
        var Menu=GM_registerMenuCommand ("脚本设置", function(){
            var menulist = [
                {name:"VIP视频解析功能",value:"videosetting",set:commonFunction.GMgetValue("videosetting"),},
                {name:"短视频无水印下载功能",value:"Shortvideosetting",set:commonFunction.GMgetValue("Shortvideosetting"),},
                {name:"Bilibili无水印下载功能",value:"Bilibilisetting",set:commonFunction.GMgetValue("Bilibilisetting"),},
                {name:"CSDN优化功能",value:"Csdnsetting",set:commonFunction.GMgetValue("Csdnsetting"),},
 
            ]
            var mainHTML = ""
            for(i in menulist){
                let text = menulist[i].set===1?"关闭":"开启";
                let style =menulist[i].set===1?"border: 1px solid #cacaca;":"border: 1px solid #54be99;color: #54be99;";
                mainHTML += '<div style="display: flex;justify-content: space-between;font-size: 14px;height: 38px;line-height: 38px;"><div>'+menulist[i].name+'</div><button style="font-size: 14px;padding: 0px 10px;line-height: 18px;height: 28px;'+style+'border-radius: 5px;margin: 5px 0;background: #fff0;"  class="s" data-name="'+menulist[i].name+'" data-value="'+menulist[i].value+'">'+text+'</button></div>'
            }
 
            let m = document.createElement('div');
            m.innerHTML = '<h2 style="font-size: 18px;font-weight: bold;margin: 0 0 10px 0;line-height: 40px;">脚本功能设置</h2>'+mainHTML+'<button style="font-size: 14px;padding: 0 10px;line-height: 28px;height: 38px;border: 0;border-radius: 5px;margin: 10px 0;background: #54be99;color: #fff;width: 80px;" id="CloseMenu">关闭</button>';
            console.log(m)
            m.setAttribute('id','Menu');
            m.style.cssText = "box-shadow: 0px 0px 8px 1px rgb(98 99 99 / 34%);max-width:60%;width: 280px;padding:10px 20px;min-height: 40px;line-height: 40px;text-align: center;border-radius: 10px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 99999999;background: #fff;font-size: 16px;font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif;";
            document.body.appendChild(m);
            let s = document.getElementsByClassName("s");
            for (var i = 0; i < s.length; i++) {
                s[i].addEventListener('click',function() {
                    var name = this.getAttribute("data-value");
                    if(commonFunction.GMgetValue(name)=== 1){
                        commonFunction.GMsetValue(name,0);
                        this.innerText = "开启";
                        this.style="font-size: 14px;padding: 0px 10px;line-height: 18px;height: 28px;border: 1px solid #54be99;color: #54be99;border-radius: 5px;margin: 5px 0;background: #fff0;";
                        commonFunction.Toast(this.getAttribute("data-name")+"已关闭",1500);
                    }else{
                        commonFunction.GMsetValue(name,1);
                        this.innerText = "关闭";
                        this.style="font-size: 14px;padding: 0px 10px;line-height: 18px;height: 28px;border: 1px solid #cacaca;border-radius: 5px;margin: 5px 0;background: #fff0;";
                        commonFunction.Toast(this.getAttribute("data-name")+"已开启",1500);
                    }
                });
            }
            document.querySelector("#CloseMenu").addEventListener('click',function() {
                document.body.removeChild(document.querySelector("#Menu"));
                window.location.reload();
            })
 
        }, "h");
    }
    //脚本设置结束
    //-------------------------------------
    //IP显示
    (function IpSearch() {
        'use strict';

        const isElementLoaded = async (selector, root = document) => {
            const getElement = () => root.querySelector(selector);
            return new Promise((resolve) => {
                const element = getElement();
                if (element)
                    return resolve(element);
                const observer = new MutationObserver((_) => {
                    const element2 = getElement();
                    if (!element2)
                        return;
                    resolve(element2);
                    observer.disconnect();
                });
                observer.observe(root === document ? root.body : root, {
                    childList: true,
                    subtree: true
                });
            });
        };
        const startsWithAny = (str, prefixes) => prefixes.some((prefix) => str.startsWith(prefix));
        const getIPAddress = (replyItemEl) => {
            var _a, _b, _c, _d, _e, _f;
            const IPString = (_f = (_e = (_d = (_c = (_b = (_a = replyItemEl.className.startsWith("sub") ? replyItemEl.querySelector(".reply-content") : replyItemEl) == null ? void 0 : _a.__vnode) == null ? void 0 : _b.ctx) == null ? void 0 : _c.props) == null ? void 0 : _d.reply) == null ? void 0 : _e.reply_control) == null ? void 0 : _f.location;
            return `&nbsp;&nbsp;${IPString ?? "IP属地：未知"}`;
        };
        const insertPAddressEl = (replyItemEl) => {
            const replyInfo = replyItemEl.className.startsWith("sub") ? replyItemEl.querySelector(".sub-reply-info") : replyItemEl.querySelector(".reply-info");
            if (!replyInfo)
                throw Error("Can not detect reply info");
            replyInfo.children[0].innerHTML += getIPAddress(replyItemEl);
        };
        const isReplyItem = (el) => el instanceof HTMLDivElement && ["reply-item", "sub-reply-item"].includes(el.className);
        const observeAndInjectComments = async (root) => {
            const targetNode = await isElementLoaded(".reply-list", root);
            const observer = new MutationObserver((mutationsList) => {
                for (let mutation of mutationsList) {
                    if (mutation.type !== "childList")
                        continue;
                    mutation.addedNodes.forEach((node) => {
                        if (!isReplyItem(node))
                            return;
                        insertPAddressEl(node);
                        if (node.className.startsWith("sub"))
                            return;
                        const subReplyListEl = node.querySelector(".sub-reply-list");
                        if (!subReplyListEl)
                            return;
                        const subReplyList = Array.from(subReplyListEl.children);
                        subReplyList.pop();
                        subReplyList.map(insertPAddressEl);
                    });
                }
            });
            observer.observe(targetNode, { childList: true, subtree: true });
        };
        var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
        const hookCommentXHR = () => {
            const originalXHR = _unsafeWindow.XMLHttpRequest;
            class newXHR extends originalXHR {
                constructor() {
                    super();
                }
                open(method, url) {
                    if (url.startsWith("https://api.bilibili.com/x/v2/reply/wbi/main")) {
                        this.withCredentials = true;
                    }
                    super.open(method, url);
                }
            }
            _unsafeWindow.XMLHttpRequest = newXHR;
            console.log("hooked", originalXHR, _unsafeWindow.XMLHttpRequest);
        };
        const pageType = {
            "dynamic": Symbol("dynamic"),
            "bangumi": Symbol("bangumi")
        };
        const hookBbComment = async (type) => {
            hookCommentXHR();
            if (type === pageType.dynamic) {
                const dynBtn = await isElementLoaded(".bili-dyn-action.comment");
                if (dynBtn)
                    dynBtn.click();
                await isElementLoaded(".bb-comment");
                dynBtn.click();
            } else if (type === pageType.bangumi) {
                await isElementLoaded(".bb-comment");
            }
            const bbComment = _unsafeWindow.bbComment;
            if (!bbComment)
                throw Error("Can not detect bbComment");
            const createListCon = bbComment.prototype._createListCon;
            const createSubReplyItem = bbComment.prototype._createSubReplyItem;
            const applyHandler = (target, thisArg, args) => {
                const [item] = args;
                const result = Reflect.apply(target, thisArg, args);
                const replyTimeRegex = /<span class="reply-time">(.*?)<\/span>/;
                return result.replace(replyTimeRegex, `<span class="reply-time">$1&nbsp;&nbsp;${item.reply_control.location ?? "IP属地：未知"}</span>`);
            };
            bbComment.prototype._createListCon = new Proxy(createListCon, { apply: applyHandler });
            bbComment.prototype._createSubReplyItem = new Proxy(createSubReplyItem, { apply: applyHandler });
        };
        const matchPrefix = async (url) => {
            var _a;
            if (startsWithAny(url, [
                "https://www.bilibili.com/video/",
                // 视频
                "https://www.bilibili.com/list/",
                // 新列表
                "https://www.bilibili.com/opus/",
                // 新版单独动态页
                "https://www.bilibili.com/cheese/play/"
                // 课程页
            ])) {
                observeAndInjectComments();
            } else if (url.startsWith("https://www.bilibili.com/bangumi/play/")) {
                const isNewBangumi = !!document.querySelector("meta[name=next-head-count]");
                if (isNewBangumi) {
                    observeAndInjectComments();
                } else {
                    hookBbComment(pageType.bangumi);
                }
            } else if (url.startsWith("https://space.bilibili.com/") && url.endsWith("dynamic") || // 个人空间动态页
                       url.startsWith("https://www.bilibili.com/v/topic/detail/")) {
                hookBbComment(pageType.dynamic);
            } else if (url.startsWith("https://space.bilibili.com/")) {
                const dynamicTab = await isElementLoaded(".n-dynamic");
                dynamicTab.addEventListener("click", () => {
                    hookBbComment(pageType.dynamic);
                }, { once: true });
            } else if (url.startsWith("https://t.bilibili.com/") && location.pathname === "/") {
                const dynHome = await isElementLoaded(".bili-dyn-home--member");
                const isNewDyn = (_a = dynHome.querySelector(".bili-dyn-sidebar__btn")) == null ? void 0 : _a.innerText.startsWith("新版反馈");
                if (isNewDyn) {
                    const dynList = await isElementLoaded(".bili-dyn-list", dynHome);
                    let lastObserved;
                    const observer = new MutationObserver((mutationsList) => {
                        for (let mutation of mutationsList) {
                            if (mutation.type !== "childList" || !(mutation.target instanceof HTMLElement) || !mutation.target.classList.contains("bili-comment-container") || mutation.target === lastObserved)
                                continue;
                            observeAndInjectComments(mutation.target);
                            lastObserved = mutation.target;
                        }
                    });
                    observer.observe(dynList, { childList: true, subtree: true });
                } else {
                    hookBbComment(pageType.dynamic);
                }
            } else if (url.startsWith("https://t.bilibili.com/")) {
                const dynItem = await isElementLoaded(".bili-dyn-item");
                const isNewDyn = !!dynItem.querySelector(".bili-comment-container");
                if (isNewDyn) {
                    const commentContainer = await isElementLoaded(".bili-comment-container", dynItem);
                    observeAndInjectComments(commentContainer);
                } else {
                    hookBbComment(pageType.dynamic);
                }
            }
        };
        matchPrefix(location.href);

    })();
    //IP显示结束
    //-------------------------------------
    //统一判断运行
    if(commonFunction.GMgetValue("isuser") == 1){
        switch (config.host) {
            case 'v.qq.com':
            case 'v.youku.com':
            case 'www.iqiyi.com':
            case 'www.mgtv.com':
            case 'w.mgtv.com':
            case 'www.le.com':
            case 'film.sohu.com':
            case 'tv.sohu.com':
            case 'v.pptv.com':
                if(commonFunction.GMgetValue("videosetting")===1){
                    ControllerVideo.addbtn();
                }
                break;
            case 'www.bilibili.com':
                if(commonFunction.GMgetValue("videosetting")===1){
                    if (config.playhref.indexOf("www.bilibili.com/bangumi/play") != -1) {
                        ControllerVideo.addbtn();
                        IpSearch();//脚本2内容
                    }
                }
                if(commonFunction.GMgetValue("Bilibilisetting")===1&&config.playhref.indexOf("/video/") != -1){
                    ControllerBilibili.Addlist();
                    IpSearch();//脚本2内容
                }
                break;
            case 'www.wasu.cn':
                if(commonFunction.GMgetValue("videosetting")===1){
                    if(config.playhref.indexOf("www.wasu.cn/Play/")!=-1){
                        ControllerVideo.addbtn();
                    }else{
                        ControllerVideo.addmobbtn();
                    }
                }
                console.log('已进入华数TV')
                break;
            case 'vip.1905.com':
                if(commonFunction.GMgetValue("videosetting")===1){
                    if(config.playhref.indexOf("vip.1905.com/play/")!=-1){
                        ControllerVideo.addbtn();
                    }else{
                        ControllerVideo.addmobbtn();
                    }
                }
                console.log('已进入1905电影网')
                break;
            case 'm.v.qq.com':
            case 'm.youku.com':
            case 'm.iqiyi.com':
            case 'm.mgtv.com':
            case 'm.le.com':
            case 'm.tv.sohu.com':
            case 'm.pptv.com':
                ControllerVideo.addmobbtn();
                break;
            case 'm.bilibili.com':
                if (config.playhref.indexOf("m.bilibili.com/bangumi/play") != -1) {
                    ControllerVideo.addmobbtn();
                }
                console.log('已进入手机bilibili');
                break;
            case 'www.ixigua.com':
                console.log('已进入西瓜视频') ;
                if(commonFunction.GMgetValue("Shortvideosetting")===1)
                {
                    ControllerShortvideo.xiguabtn();
                    commonFunction.setIntervalhost();
                }
                break;
            case 'blog.csdn.net':
                console.log('已进入csdn') ;
                if(commonFunction.GMgetValue("Csdnsetting")===1)
                {
                    Controllercsdn.blog();
                }
 
                break;
        }
 
        //网站判断执行结束
    }else{
       
    }
})()