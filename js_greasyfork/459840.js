// ==UserScript==
// @name         视频解析脚本[修改版]
// @namespace    修改样式(原作者：xiaogf)
// @version      1.12.3
// @description  请大家注意隐私安全：视频解析中的广告勿点击，不要相信黄赌毒等有害信息～支持腾讯视频、优酷视频、爱奇艺视频、bilibili视频、搜狐视频、乐视视频、PPTV视频、MGTV视频、1905视频、咪咕视频等视频解析。
// @author       修改样式(原作者：xiaogf)
// @license      xiaosu
// @include      *://v.qq.com/x/cover/*
// @include      *://m.v.qq.com/x/m/*
// @include      *://v.youku.com/*
// @include      *://m.youku.com/*
// @include      *://tv.sohu.com/v/*
// @include      *://film.sohu.com/*
// @include      *://m.tv.sohu.com/*
// @include      *://www.iqiyi.com/*
// @include      *://m.iqiyi.com/*
// @include      *://www.le.com/ptv/*
// @include      *://m.le.com/*
// @include      *://www.mgtv.com/*
// @include      *://m.mgtv.com/*
// @include      *://www.bilibili.com/bangumi/*
// @include      *://m.bilibili.com/bangumi/*
// @include      *://v.pptv.com/*
// @include      *://m.pptv.com/*
// @include      *://vip.1905.com/*
// @include      *://www.1905.com/vod/*
// @include      *://vip.1905.com/m/*
// @include      *://www.miguvideo.com/*
// @include      *://m.miguvideo.com/*
// @downloadURL https://update.greasyfork.org/scripts/459840/%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E8%84%9A%E6%9C%AC%5B%E4%BF%AE%E6%94%B9%E7%89%88%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/459840/%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E8%84%9A%E6%9C%AC%5B%E4%BF%AE%E6%94%B9%E7%89%88%5D.meta.js
// ==/UserScript==
(function() {
    const mianColor = "#1e1e28";
    const secondColor = "#fa0606";
    const clkColor = "#fa0606";
    const fontsColor = "#f3f1e7";
    const iconMarginLeft = 5;
    const iconMarginTop = 150;
    var iconWidth = 40;
    const iconHeight = 40;
    const iconFilletPercent = 0.3;
    var developMenuHeight = 220;
    var developMenuSecond = 0;
    const parseInterfaces =[
        {"name": "M1907","url": "https://z1.m1907.top/?jx="},
        {"name": "解析啦","url": "https://www.jiexila.com/?url="},
        {"name": "三七解析","url": "https://jx.777jiexi.com/player/?url="},
        {"name": "醉仙解析","url": "http://jx.zui.cm/?url="},
        {"name": "M3U8TV","url": "https://jx.m3u8.tv/jiexi/?url="},
        {"name": "虾米解析","url": "https://jx.xmflv.com/?url="},
        {"name": "盘古解析","url": "https://www.pangujiexi.cc/jiexi.php?url="},
        {"name": "1717解析","url": "https://www.1717yun.com/api/?url="},
        {"name":"冰豆解析","url":"https://bd.jx.cn/?url="},
    ];
    const videoSites = [
        "v.qq.com",
        "iqiyi.com",
        "youku.com",
        "mgtv.com",
        "sohu.com",
        "le.com",
        "1905.com",
        "pptv.com",
        "bilibili.com",
        "miguvideo.com"
    ];
    const currentUrl = document.location.href;
    if (self != top) {
        return;
    }
    var result = videoSites.some(site=>{
        if (currentUrl.match(site)) {
            return true;
        }
        return false;
    })
    if(!result){
        return;
    }
    if(iconWidth<30){
        iconWidth=30;
    }
    if(developMenuHeight<(iconWidth*2.6)){
        developMenuHeight=iconWidth*2.6;
    }
    var uaLogo="pc";
    if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        uaLogo="mobile";
    }
    const globalStyle = "cursor:pointer;position:fixed;left:"+iconMarginLeft+"px;top:"+iconMarginTop+"px;z-index:2147483647;";
    const mainIconStyle = "height:"+iconHeight+"px;width:"+iconWidth+"px;background:"+mianColor+";box-sizing:border-box;";
    const triangleStyle = "border-left:"+(iconWidth*0.3)+"px solid "+secondColor+";border-top:"+(iconHeight*0.2)+"px solid transparent;border-bottom:"+(iconHeight*0.2)+"px solid transparent;position:absolute;right:31%;top:30%;";
    const squareStyle = "background:"+secondColor+";width:"+(iconWidth*0.26)+"px;height:"+(iconWidth*0.26)+"px;position:absolute;right:37%;top:37%;";
    const inMenuBoxStyle = "width:100%;height:100%;overflow-y:scroll;overflow-x:hidden;";
    const outMenuBoxStyle = "background:"+mianColor+";height:0px;overflow:hidden;font-size:"+(iconWidth*0.35)+"px;width:"+(iconWidth*3)+"px;position:absolute;left:42px;top:0px;transition:height "+developMenuSecond+"s;-moz-transition:height "+developMenuSecond+"s;-webkit-transition:height "+developMenuSecond+"s;-o-transition:height "+developMenuSecond+"s;";
    const MenuItemsStyle = "color:"+fontsColor+";display: block;padding:"+(iconWidth*0.12)+"px "+(iconWidth*0.12)+"px "+(iconWidth*0.12)+"px "+(iconWidth*0.2)+"px;text-align:center;margin-bottom:3px;";
    const IframeStyle = "frameborder='no' width='100%' height='100%' allowfullscreen='true' allowtransparency='true' frameborder='0' scrolling='no';";
    var classAndIDMap = {
        "pc":
        {
            "v.qq.com":"mod_player｜tenvideo_player|player-container|player__container",
            "iqiyi.com":"flashbox",
            "youku.com":"ykPlayer",
            "mgtv.com":"mgtv-player-wrap",
            "sohu.com":"sohuplayer|x-player",
            "le.com":"fla_box",
            "1905.com":"player",
            "pptv.com":"pplive-player",
            "miguvideo.com":"mod-player",
            "bilibili.com":"bilibili-player|bpx-player-container｜bilibili-player-video-wrap|player-limit-mask"
        },
        "mobile":{
            "m.v.qq.com":"mod_player｜tenvideo_player|player-container|player__container",
            "iqiyi.com":"m-box",
            "youku.com":"h5-detail-player",
            "mgtv.com":"video-area",
            "sohu.com":"sohuplayer|player-view",
            "le.com":"playB",
            "1905.com":"player",
            "pptv.com":"pp-details-video",
            "miguvideo.com":"mod-player",
            "bilibili.com":"bilibili-player|bpx-player-video-wrap｜bpx-player-container｜bilibiliPlayer|player-wrapper"}
    };
    createIcon();
    document.onreadystatechange = function(){
        if(document.readyState == 'complete'){
            if(!document.getElementById("mainIcon")){
                createIcon();
            }
        }
    }
    function createIcon(){
        try{
            var div = document.createElement("div");
            div.style.cssText = globalStyle;
            div.setAttribute("id","mainIcon");
            var html = "<div id='mainButton' style='"+mainIconStyle+"'><div id='triangle' style='"+triangleStyle+"'></div></div><div id='dropDownBox' style='"+outMenuBoxStyle+"'><div style="+inMenuBoxStyle+">";
            for(var i in parseInterfaces){
                if(i==parseInterfaces.length-1){
                    html += "<span class='spanStyle' style='"+MenuItemsStyle+"border:1px solid #e2e2e2;' url='"+parseInterfaces[i].url+"'>"+parseInterfaces[i].name+"</span>";
                }else{
                    html += "<span class='spanStyle' style='"+MenuItemsStyle+"border:1px solid #e2e2e2;' url='"+parseInterfaces[i].url+"'>"+parseInterfaces[i].name+"</span>";
                }
            }
            html += "</div></div>";
            div.innerHTML = html;
            document.body.insertBefore(div,document.body.firstChild);
            div.onclick = function() {
                var dropDownBox = document.getElementById("dropDownBox").style.height;
                var mainButton = document.getElementById("mainButton");
                var triangle = document.getElementById("triangle");
                if(dropDownBox == "0px"){
                    triangle.removeAttribute("style");
                    triangle.setAttribute("style",triangleStyle);
                    document.getElementById("dropDownBox").style.height = developMenuHeight+"px";
                }else{
                    document.getElementById("dropDownBox").style.height = "0px";
                    triangle.removeAttribute("style");
                    triangle.setAttribute("style",triangleStyle);
                }
            }
            var elements = document.getElementsByClassName("spanStyle");
            for(var j in elements){
                elements[j].onclick=function(){
                    this.style.color = clkColor;
                    var parseInterface = this.getAttribute("url");
                    for(let key in classAndIDMap[uaLogo]){
                        if (document.location.href.match(key)) {
                            var values = classAndIDMap[uaLogo][key].split("|");
                            var labelType = "";
                            var class_id = "";
                            for(let value in values){
                                if(document.getElementById(values[value])){
                                    class_id = values[value];
                                    labelType = "id";
                                    break;
                                }
                                if(document.getElementsByClassName(values[value]).length>0){
                                    class_id = values[value];
                                    labelType = "class";
                                    break;
                                }
                            }
                            if(class_id!=""){
                                var iframe = "<iframe id='iframePlayBox' src='"+parseInterface+document.location.href+"' "+IframeStyle+" ></iframe>";
                                if(labelType=="id"){
                                    document.getElementById(class_id).innerHTML="";
                                    document.getElementById(class_id).innerHTML=iframe;
                                }else{
                                    document.getElementsByClassName(class_id)[0].innerHTML="";
                                    if(uaLogo=="mobile"){
                                        document.getElementsByClassName(class_id)[0].style.height="225px";
                                    }
                                    document.getElementsByClassName(class_id)[0].innerHTML=iframe;
                                }
                                return;
                            }
                        }
                    }
                }
            }
        }catch(error){
        }
    }
})();