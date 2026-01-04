// ==UserScript==
// @name         简洁极简化优酷/爱奇艺/腾讯等会员视频解析
// @namespace    xiaosu
// @version      2.11
// @description  目前只有12KB左右希望在简洁；视频页面广告请勿点击勿相信黄赌毒等有害信息；支持腾讯、优酷、爱奇艺、bilibili、搜狐、乐视、PPTV、芒果、1905等网站会员解析
// @author       xiaosu
// @license      xiaosu
// @include      *.youku.com/*
// @include      *.qq.com/*
// @include      *.sohu.com/*
// @include      *.iqiyi.com/*
// @include      *.le.com/*
// @include      *.tudou.com/*
// @include      *.mgtv.com/*
// @include      *.acfun.cn/*
// @include      *.bilibili.com/*
// @include      *.pptv.com/*
// @include      *.1905.com/*
// @include      *.baofeng.com/*
// @downloadURL https://update.greasyfork.org/scripts/449190/%E7%AE%80%E6%B4%81%E6%9E%81%E7%AE%80%E5%8C%96%E4%BC%98%E9%85%B7%E7%88%B1%E5%A5%87%E8%89%BA%E8%85%BE%E8%AE%AF%E7%AD%89%E4%BC%9A%E5%91%98%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/449190/%E7%AE%80%E6%B4%81%E6%9E%81%E7%AE%80%E5%8C%96%E4%BC%98%E9%85%B7%E7%88%B1%E5%A5%87%E8%89%BA%E8%85%BE%E8%AE%AF%E7%AD%89%E4%BC%9A%E5%91%98%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==
(function() {
    const mianColor = "#1E1E28";
    const secondColor = "#fa0606";
    const fontsColor = "#f3f1e7";
    const iconMarginLeft = 2;
    const iconMarginTop = 150;
    var iconWidth = 40;
    const iconHeight = 35;
    const iconFilletPercent = 0.3;
    var developMenuHeight = 220;
    var developMenuSecond = 0;
    const parseInterfaces =[
        {"name": "综合/B站","url": "https://jx.bozrc.com:4433/player/?url="},
        {"name": "m1907","url": "https://z1.m1907.cn/?jx="},
        {"name": "Player-JY","url": "https://jx.playerjy.com/?url="},
        {"name": "天翼","url": "https://jsap.attakids.com/?url="},
        {"name": "虾米","url": "https://jx.xmflv.com/?url="},
        {"name": "OK解析","url": "https://okjx.cc/?url="},
        {"name": "乐多","url": "https://api.leduotv.com/wp-api/ifr.php?isDp=1&vid="},
        {"name": "yparse","url": "https://jx.yparse.com/index.php?url="},
        {"name": "MAO","url": "https://www.mtosz.com/m3u8.php?url="},
        {"name": "诺讯","url": "https://www.nxflv.com/?url="},
        {"name": "M3U8TV","url": "https://jx.m3u8.tv/jiexi/?url="},
        {"name": "爱豆","url": "https://jx.aidouer.net/?url="},
        {"name": "夜幕","url": "https://www.yemu.xyz/?url="},
        {"name": "BL","url": "https://svip.bljiex.cc/?v="},
        {"name": "七彩","url": "https://www.xymav.com/?url="},
        {"name": "人人迷","url": "https://jx.blbo.cc:4433/?url="},
        {"name": "七哥","url": "https://jx.mmkv.cn/tv.php?url="},
        {"name": "铭人云","url": "https://parse.123mingren.com/?url="},
        {"name": "江湖云","url": "https://api.jhdyw.vip/?url="},
        {"name": "1717","url": "https://ckmov.ccyjjd.com/ckmov/?url="},
        {"name": "8090","url": "https://www.8090g.cn/?url="},
        {"name": "qianqi","url": "https://api.qianqi.net/vip/?url="},
        {"name": "laobandq","url": "https://vip.laobandq.com/jiexi.php?url="},
        {"name": "playm3u8","url": "https://www.playm3u8.cn/jiexi.php?url="},
        {"name": "无名小站","url": "https://www.administratorw.com/video.php?url="},
        {"name": "CK","url": "https://www.ckplayer.vip/jiexi/?url="},
        {"name": "盖世","url": "https://www.gai4.com/?url="},
        {"name": "盘古","url": "https://go.yh0523.cn/y.cy?url="},
        {"name": "全民","url": "https://jx.blbo.cc:4433/?url="},
        {"name":"百域","url": "https://jx.618g.com/?url="},
        {"name":"全民","url": "https://jx.quanmingjiexi.com/?url="},
		{"name":"游艺","url":"https://api.u1o.net/?url=", "showType":1},
		{"name":"爱豆","url":"https://jx.aidouer.net/?url=", "showType":1},
		{"name":"诺诺","url":"https://www.ckmov.com/?url=", "showType":1},
		{"name":"解析la","url":"https://api.jiexi.la/?url=", "showType":1},
		{"name":"MUTV","url":"https://jiexi.janan.net/jiexi/?url=", "showType":1},
		{"name":"盘古2","url":"https://www.pangujiexi.cc/jiexi.php?url=", "showType":1},
		{"name":"小蒋","url":"https://www.kpezp.cn/jlexi.php?url=", "showType":1},
		{"name":"星空","url":"http://60jx.com/?url=", "showType":1},
		{"name":"17云","url":"https://www.1717yun.com/jx/ty.php?url=", "showType":1},
		{"name":"奇米","url":"https://qimihe.com/?url=", "showType":1},
		{"name":"思云","url":"https://jx.ap2p.cn/?url=", "showType":1},
		{"name":"听乐","url":"https://jx.dj6u.com/?url=", "showType":1},
    ];
    const videoSites = [
        "qq.com",
        "sohu.com",
        "iqiyi.com",
        "youku.com",
        "mgtv.com",
        "le.com",
        "1905.com",
        "pptv.com",
        "bilibili.com",
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
    const mainIconStyle = "height:"+iconHeight+"px;width:"+iconWidth+"px;background:"+mianColor+";border-radius:"+(iconFilletPercent*iconWidth)+"px;box-sizing:border-box;box-shadow:-4px 4px 4px 0px rgba(0,0,0,0.4);";
    const triangleStyle = "border-left:"+(iconWidth*0.3)+"px solid "+secondColor+";border-top:"+(iconHeight*0.2)+"px solid transparent;border-bottom:"+(iconHeight*0.2)+"px solid transparent;position:absolute;right:31%;top:30%;";
    const squareStyle = "background:"+secondColor+";width:"+(iconWidth*0.26)+"px;height:"+(iconWidth*0.26)+"px;position:absolute;right:37%;top:37%;";
    const inMenuBoxStyle = "width:110%;height:110%;overflow-y:scroll;overflow-x:hidden;";
    const outMenuBoxStyle = "background:"+mianColor+";height:0px;overflow:hidden;font-size:"+(iconWidth*0.2)+"px;width:"+(iconWidth*2)+"px;position:absolute;left:0px;top:"+iconHeight+"px;box-shadow:-4px 4px 4px 0px rgba(0,0,0,0.4);border-radius:13px 0 1px 13px;transition:height "+developMenuSecond+"s;-moz-transition:height "+developMenuSecond+"s;-webkit-transition:height "+developMenuSecond+"s;-o-transition:height "+developMenuSecond+"s;";
    const MenuItemsStyle = "color:"+fontsColor+";display: block;padding:"+(iconWidth*0.12)+"px "+(iconWidth*0.12)+"px "+(iconWidth*0.12)+"px "+(iconWidth*0.2)+"px ;width:"+(iconWidth*3)+"px;";
    const IframeStyle = "frameborder='no' width='100%' height='100%' allowfullscreen='true' allowtransparency='true' frameborder='0' scrolling='no';";
    var classAndIDMap	= {
        "pc":
        {
            "qq.com":"mod_player｜tenvideo_player|player-container|player__container",
            "iqiyi.com":"flashbox",
            "youku.com":"ykPlayer",
            "mgtv.com":"mgtv-player-wrap",
            "sohu.com":"sohuplayer|x-player",
            "le.com":"fla_box",
            "1905.com":"player",
            "pptv.com":"pplive-player",
            "bilibili.com":"bilibili-player|bpx-player-container｜bilibili-player-video-wrap|player-limit-mask"
        },
        "mobile":{
            "qq.com":"mod_player｜tenvideo_player|player-container|player__container",
            "iqiyi.com":"m-box",
            "youku.com":"h5-detail-player",
            "mgtv.com":"video-area",
            "sohu.com":"sohuplayer|player-view",
            "le.com":"playB",
            "1905.com":"player",
            "pptv.com":"pp-details-video",
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
                    html += "<span class='spanStyle' style='"+MenuItemsStyle+"' url='"+parseInterfaces[i].url+"'>"+parseInterfaces[i].name+"</span>";
                }else{
                    html += "<span class='spanStyle' style='"+MenuItemsStyle+"border-bottom-style:solid;' url='"+parseInterfaces[i].url+"'>"+parseInterfaces[i].name+"</span>";
                }
            }
            html += "<br/><br/></div></div>";
            div.innerHTML = html;
            document.body.insertBefore(div,document.body.firstChild);
            div.onclick = function() {
                var dropDownBox = document.getElementById("dropDownBox").style.height;
                var mainButton = document.getElementById("mainButton");
                var triangle = document.getElementById("triangle");
                if(dropDownBox == "0px"){
                    mainButton.style.borderRadius = (iconFilletPercent*iconWidth)+"px "+(iconFilletPercent*iconWidth)+"px 0 0";
                    triangle.removeAttribute("style");
                    triangle.setAttribute("style",triangleStyle);
                    document.getElementById("dropDownBox").style.height = developMenuHeight+"px";
                }else{
                    document.getElementById("dropDownBox").style.height = "0px";
                    triangle.removeAttribute("style");
                    triangle.setAttribute("style",triangleStyle);
                    mainButton.style.borderRadius = (iconFilletPercent*iconWidth)+"px";
                }
            }
            var elements = document.getElementsByClassName("spanStyle");
            for(var j in elements){
                elements[j].onmouseover = function(){
                    this.style.background = fontsColor;
                    this.style.color = mianColor;
                }
                elements[j].onmouseout = function(){
                    this.style.background = mianColor;
                    this.style.color = fontsColor;
                }
                elements[j].onclick=function(){
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