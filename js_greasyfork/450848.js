// ==UserScript==
// @name        三哥的视频
// @namespace    SanGe
// @version      0.4
// @description  这里应该写描述...
// @author       SanGe
// @license      AGPL License
// @match        *://*.youku.com/*
// @match        *://*.iqiyi.com/*
// @match        *://*.iq.com/*
// @match        *://*.le.com/*
// @match        *://v.qq.com/*
// @match        *://m.v.qq.com/*
// @match        *://*.tudou.com/*
// @match        *://*.mgtv.com/*
// @match        *://tv.sohu.com/*
// @match        *://film.sohu.com/*
// @match        *://*.1905.com/*
// @match        *://*.bilibili.com/*
// @match        *://*.pptv.com/*
// @match        *://*.kuaishou.com/*
// @match        *://*.ixigua.com/*
// @exclude      *://*.zhmdy.top/*
// @exclude      *://*.eggvod.cn/*
// @downloadURL https://update.greasyfork.org/scripts/450848/%E4%B8%89%E5%93%A5%E7%9A%84%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/450848/%E4%B8%89%E5%93%A5%E7%9A%84%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*--config--*/
    var Config ={
        outApiUrl:'https://www.eggvod.cn/',
        isMobile:/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent),
        iconVipTop:360,
        iconVipPosition : 'left',
        iconVipWidth : 40,
        jxCodeInfo : {'in':81516699,'code':4},
    };

    var {isMobile,
         outApiUrl,
         iconVipTop,
         iconVipPosition,
         iconVipWidth,
         jxCodeInfo,
        } = Config;

    /*--lang--*/
    var lang = {
        playVideo:'视频解析',
    };

    /*--datas--*/
    var datas = {
        jxVideo:[{isOpen:1,web:[
            {funcName:"playVideo",match:/https?:\/\/v\.qq\.com/,name:'qqPC'},
            {funcName:"playVideo", match:/https?:\/\/m\.v\.qq\.com/,name:'qqMobile'},
            {funcName:"playVideo", match:/^https?:\/\/www\.iqiyi\.com/,name:'iqiyiPc'},
            {funcName:"playVideo", match:/^https?:\/\/www\.iq\.com/},
            {funcName:"playVideo", node:".m-video-player-wrap",match:/^https?:\/\/m.iqiyi\.com/,areaClassName:'m-sliding-list'},
            {funcName:"playVideo", node:"#player",nodeType:'id',match:/m\.youku\.com\/alipay_video\/id_/},
            {funcName:"playVideo", node:"#player",nodeType:'id',match:/m\.youku\.com\/video\/id_/},
            {funcName:"playVideo", match:/^https?:\/\/.*youku\.com/},
            {funcName:"playVideo", match:/^https?:\/\/www\.bilibili\.com/},
            {funcName:"playVideo", match:/^https?:\/\/m\.bilibili\.com/},
            {funcName:"playVideo", node:".video-area",nodeType:'class',match:/m\.mgtv\.com\/b/},
            {funcName:"playVideo", match:/mgtv\.com/,areaClassName:'episode-items clearfix'},
            {funcName:"playVideo", node:".x-cover-playbtn-wrap",nodeType:'class',match:/.tv\.sohu\.com/},
            {funcName:"playVideo", node:".x-cover-playbtn-wrap",nodeType:'class',match:/m\.tv\.sohu\.com/},
            {funcName:"playVideo", node:"#playerWrap",nodeType:'id',match:/film\.sohu\.com/},
            {funcName:"playVideo", match:/tudou\.com/},
            {funcName:"playVideo", match:/le\.com/},
            {funcName:"playVideo", match:/pptv\.com/},
            {funcName:"playVideo", match:/1905\.com/},
        ]}],
        playLine:[
            {"name":"纯净1","url":"https://z1.m1907.cn/?jx=","mobile":1},
            {"name":"B站1","url":"https://jx.bozrc.com:4433/player/?url=","mobile":1},
            {"name":"爱豆","url":"https://jx.aidouer.net/?url=","mobile":1},
            {"name":"BL","url":"https://vip.bljiex.com/?v=","mobile":0},
            {"name":"冰豆","url":"https://api.qianqi.net/vip/?url=","mobile":0},
            {"name":"百域","url":"https://jx.618g.com/?url=","mobile":0},
            {"name":"CK","url":"https://www.ckplayer.vip/jiexi/?url=","mobile":0},
            {"name":"CHok","url":"https://www.gai4.com/?url=","mobile":1},
            {"name":"ckmov","url":"https://www.ckmov.vip/api.php?url="},
            {"name":"H8","url":"https://www.h8jx.com/jiexi.php?url=","mobile":0},
            {"name":"JY","url":"https://jx.playerjy.com/?url=","mobile":0},
            {"name":"解析","url":"https://ckmov.ccyjjd.com/ckmov/?url=","mobile":0},
            {"name":"解析la","url":"https://api.jiexi.la/?url=","mobile":0},
            {"name":"老板","url":"https://vip.laobandq.com/jiexi.php?url=","mobile":0},
            {"name":"乐多","url":"https://api.leduotv.com/wp-api/ifr.php?isDp=1&vid=","mobile":1},
            {"name":"MAO","url":"https://www.mtosz.com/m3u8.php?url=","mobile":0},
            {"name":"M3U8","url":"https://jx.m3u8.tv/jiexi/?url=","mobile":0},
            {"name":"诺讯","url":"https://www.nxflv.com/?url=","mobile":0},
            {"name":"OK","url":"https://okjx.cc/?url=","mobile":1},
            {"name":"PM","url":"https://www.playm3u8.cn/jiexi.php?url=","mobile":0},
            {"name":"盘古","url":"https://www.pangujiexi.cc/jiexi.php?url=","mobile":0},
            {"name":"全民","url":"https://jx.blbo.cc:4433/?url=","mobile":0},
            {"name":"七哥","url":"https://jx.mmkv.cn/tv.php?url=","mobile":0},
            {"name":"RDHK","url":"https://jx.rdhk.net/?v=","mobile":1},
            {"name":"人人迷","url":"https://jx.blbo.cc:4433/?url=","mobile":1},
            {"name":"思云","url":"https://jx.ap2p.cn/?url=","mobile":0},
            {"name":"思古3","url":"https://jsap.attakids.com/?url=","mobile":1},
            {"name":"听乐","url":"https://jx.dj6u.com/?url=","mobile":1},
            {"name":"维多","url":"https://jx.ivito.cn/?url=","mobile":0},
            {"name":"虾米","url":"https://jx.xmflv.com/?url=","mobile":0},
            {"name":"云端","url":"https://sb.5gseo.net/?url=","mobile":0},
            {"name":"云析","url":"https://jx.yparse.com/index.php?url=","mobile":0},
            {"name":"0523","url":"https://go.yh0523.cn/y.cy?url=","mobile":0},
            {"name":"17云","url":"https://www.1717yun.com/jx/ty.php?url=","mobile":0},
            {"name":"180","url":"https://jx.000180.top/jx/?url=","mobile":0},
            {"name":"4K","url":"https://jx.4kdv.com/?url=","mobile":1},
            {"name":"8090","url":"https://www.8090g.cn/?url=","mobile":0}
        ]
    };

    var {jxVideo,playLine} = datas;

    /*--create style--*/
    var domHead = document.getElementsByTagName('head')[0];
    var domStyle = document.createElement('style');
    domStyle.type = 'text/css';
    domStyle.rel = 'stylesheet';

    /*--Class--*/
    class BaseClass{
        constructor(){
        }
        createElement(dom,domId){
            var rootElement = document.body;
            var newElement = document.createElement(dom);
            newElement.id = domId;
            var newElementHtmlContent = document.createTextNode('');
            rootElement.appendChild(newElement);
            newElement.appendChild(newElementHtmlContent);
        }
        request(method,url,data){
            let request = new XMLHttpRequest();
            return new Promise((resolve,reject)=>{
                request.onreadystatechange=function(){
                    if(request.readyState==4){
                        if(request.status==200){
                            resolve(request.responseText);
                        }else{
                            reject(request.status);
                        }
                    }
                };
                request.open(method,url);
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                request.send(data);
            });
        }
        setCookie(cname,cvalue,exdays){
            var d = new Date();
            d.setTime(d.getTime()+(exdays*24*60*60*1000));
            var expires = "expires="+d.toGMTString();
            document.cookie = cname+"="+cvalue+"; "+expires;
        }
        getCookie(cname){
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i].trim();
                if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
            }
            return "";
        }
        getQueryString(e) {
            var t = new RegExp("(^|&)" + e + "=([^&]*)(&|$)");
            var a = window.location.search.substr(1).match(t);
            if (a != null) return a[2];
            return "";
        }
        getUrlParams(url){
            let reg = /([^?&+#]+)=([^?&+#]+)/g;
            let obj={};
            url.replace(reg,(res,$1,$2)=>{obj[$1]=$2;});
            return obj;
        }
        getLine(text){
            let textArr = text.split('\n');
            if(textArr.length > 0){
                let lineObj = [];
                let match = /^(.+)(https?:\/\/.+)$/;
                textArr.forEach(function(item){
                    item = item.replace(/\s*,*/g,'');
                    if(!item) return true;
                    let lineMatch = item.match(match);
                    if(lineMatch){
                        lineObj.push({'name':lineMatch[1].substring(0,4),'url':lineMatch[2]});
                    }else{
                        lineObj=[];
                        return false;
                    }
                });
                return lineObj;
            }
        }
        static getElement(css){
            return new Promise((resolve,reject)=>{
                let num = 0;
                let timer = setInterval(function(){
                    num++;
                    let dom = document.querySelector(css);
                    if(dom){
                        clearInterval(timer);
                        resolve(dom);
                    }else{
                        if(num==20){clearInterval(timer);resolve(false);}
                    }
                },300);
                });
        }
        static toast(msg,duration){
            duration=isNaN(duration)?3000:duration;
            let toastDom = document.createElement('div');
            toastDom.innerHTML = msg;
            //toastDom.style.cssText="width: 60%;min-width: 150px;opacity: 0.7;height: 30px;color: rgb(255, 255, 255);line-height: 30px;text-align: center;border-radius: 5px;position: fixed;top: 40%;left: 20%;z-index: 999999;background: rgb(0, 0, 0);font-size: 12px;";
            toastDom.style.cssText='padding:2px 15px;min-height: 36px;line-height: 36px;text-align: center;transform: translate(-50%);border-radius: 4px;color: rgb(255, 255, 255);position: fixed;top: 50%;left: 50%;z-index: 9999999;background: rgb(0, 0, 0);font-size: 16px;';
            document.body.appendChild(toastDom);
            setTimeout(function() {
                var d = 0.5;
                toastDom.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
                toastDom.style.opacity = '0';
                setTimeout(function() { document.body.removeChild(toastDom) ;}, d * 1000);
            }, duration);
        }
    }
    class PlayVideoClass extends BaseClass{
        constructor(){
            super();
        }
    }

    var allWeb = [...jxVideo];
    var nowWeb=[];
    allWeb.forEach(function(item){
        if(item.isOpen == 0)
			return true;
        item.web.forEach(function(val){
            let result = location.href.match(val.match);
            if(result){
                nowWeb.push(val);
            }
        });
    });

    if(nowWeb.length==0){
        let baseClass = new BaseClass();
        console.log('没有匹配该网站');
		return;
    }

    nowWeb.forEach(function(item){
        switch(item.funcName){
            case 'playVideo':
                playVideoFunc();
                break;
            default:
                break;
        }
    });

    function playVideoFunc(){
        var playVideoClass = new PlayVideoClass();
        if(isMobile){
            playLine = playLine.filter(function(item){
                return item.mobile;
            });
        }
        //css
        let playVideoStyle = `
.zhm_play_vidoe_icon{
padding-top:2px;cursor:pointer;
z-index:9999999;
display:block;
position:fixed;${iconVipPosition}:0px;top:${iconVipTop}px;text-align:center;overflow:visible
}
.zhm_play_video_wrap{
position:fixed;${iconVipPosition}:${iconVipWidth}px;top:${iconVipTop}px;
z-index:9999999;
overflow: hidden;
width:300px;
}
.zhm_play_video_line{
width:320px;
height:316px;
overflow-y:scroll;
overflow-x:hidden;
}
.zhm_play_vide_line_ul{
width:300px;
display: flex;
justify-content: flex-start;
flex-flow: row wrap;
list-style: none;
padding:0px;
margin:0px;
}
.zhm_play_video_line_ul_li{
padding:4px 0px;
margin:2px;
width:30%;
color:#FFF;
text-align:center;
background-color:#f24443;
box-shadow:0px 0px 10px #fff;
font-size:14px;
}
.zhm_play_video_line_ul_li:hover{
color:#260033;
background-color:#fcc0c0
}
.zhm_line_selected{
color:#260033;
background-color:#fcc0c0
}
.zhm_play_video_jx{
width:100%;
height:100%;
z-index:999999;
position: absolute;top:0px;padding:0px;
}
`;
        domStyle.appendChild(document.createTextNode(playVideoStyle));
        domHead.appendChild(domStyle);

        //template:icon,playLine;
        let playWrapHtml = "<div href='javascript:void(0)' target='_blank' style='' class='playButton zhm_play_vidoe_icon' id='zhmlogo'>";
        playWrapHtml += "<button class='iconLogo' title='点击解析' style='width:"+iconVipWidth+"px;height:"+iconVipWidth+"px; background-color:lightgray;'>Vip</button>";
        playWrapHtml += "<div class='playLineDiv zhm_play_video_wrap' style='display:none;'>"
        playWrapHtml += "<div class='zhm_play_video_line'>";
        playWrapHtml +="<div><ul class='zhm_play_vide_line_ul'>";
        /*--playLine.forEach(function(item){
            let selected = '';
            if(playVideoClass.getCookie('playLineAction') == item.url){
               selected='zhm_line_selected';
            }
            playWrapHtml +=`<li class='playLineTd zhm_play_video_line_ul_li ${selected}' url='${item.url}' >${item.name}</li>`;
        })--*/
        playWrapHtml +="</div></div></div>";
        //template:node;播放区域
        let playJxHtml = "<div class='zhm_play_video_jx'>";
        playJxHtml += "<iframe allowtransparency=true frameborder='0' scrolling='no' allowfullscreen=true allowtransparency=true name='jx_play' style='height:100%;width:100%' id='playIframe'></iframe></div>";
        //循环判断是否在播放页，是则执行下面
        let jxVideoData = [
            {funcName:"playVideo", node:".player__container" ,match:/https:\/\/v.qq.com\/x\/cover\/[a-zA-Z0-9]+.html/,areaClassName:'mod_episode',name:'qqPC'},
            {funcName:"playVideo", node:"#player-container" ,match:/https:\/\/v.qq.com\/x\/cover\/[a-zA-Z0-9]+\/[a-zA-Z0-9]+.html/,areaClassName:'mod_episode',name:'qqPC'},
            {funcName:"playVideo", node:".container-player" ,match:/v\.qq\.com\/x\/page/,areaClassName:'mod_episode'},
            {funcName:"playVideo", node:"#player",match:/m\.v\.qq\.com\/x\/m\/play\?cid/},
            {funcName:"playVideo", node:"#player",match:/m\.v\.qq\.com\/x\/play\.html\?cid=/},
            {funcName:"playVideo", node:"#player",match:/m\.v\.qq\.com\/play\.html\?cid\=/},
            {funcName:"playVideo", node:"#player",match:/m\.v\.qq\.com\/cover\/.*html/},
            {funcName:"playVideo", node:"#flashbox",match:/^https:\/\/www\.iqiyi\.com\/[vwa]\_/,areaClassName:'qy-episode-num',name:'iqiyiPc'},
            {funcName:"playVideo", node:".m-video-player-wrap",match:/^https:\/\/m.iqiyi\.com\/[vwa]\_/,areaClassName:'m-sliding-list'},
            {funcName:"playVideo", node:".intl-video-wrap",match:/^https:\/\/www\.iq\.com\/play\//,areaClassName:'m-sliding-list'},
            {funcName:"playVideo", node:"#player",match:/m\.youku\.com\/alipay_video\/id_/},
            {funcName:"playVideo", node:"#player",match:/m\.youku\.com\/video\/id_/},
            {funcName:"playVideo", node:"#player",match:/v\.youku\.com\/v_show\/id_/},
            //{funcName:"playVideo", node:".player-container",nodeType:'id',match:/www\.bilibili\.com\/video/},
            {funcName:"playVideo", node:"#bilibili-player",nodeType:'id',match:/www\.bilibili\.com\/video/,name:'biliPc',areaClassName:'video-episode-card'},
            {funcName:"playVideo", node:"#player_module",nodeType:'id',match:/www\.bilibili\.com\/bangumi/,areaClassName:'ep-list-wrapper report-wrap-module'},
            {funcName:"playVideo", node:".player-container",nodeType:'class',match:/m\.bilibili\.com\/bangumi/,areaClassName:'ep-list-pre-container no-wrap'},
            {funcName:"playVideo", node:".mplayer",nodeType:'class',match:/m\.bilibili\.com\/video\//},
            {funcName:"playVideo", node:".video-area",nodeType:'class',match:/m\.mgtv\.com\/b/},
            {funcName:"playVideo", node:"#mgtv-player-wrap",nodeType:'id',match:/mgtv\.com\/b/,areaClassName:'episode-items clearfix'},
            {funcName:"playVideo", node:".x-player",nodeType:'class',match:/tv\.sohu\.com\/v/},
            {funcName:"playVideo", node:".x-cover-playbtn-wrap",nodeType:'class',match:/m\.tv\.sohu\.com/},
            {funcName:"playVideo", node:"#playerWrap",nodeType:'id',match:/film\.sohu\.com\/album\//},
            {funcName:"playVideo", node:"#le_playbox",nodeType:'id',match:/le\.com\/ptv\/vplay\//,areaClassName:'juji_grid'},
            {funcName:"playVideo", node:"#player",nodeType:'id',match:/play\.tudou\.com\/v_show\/id_/},
            {funcName:"playVideo", node:"#pptv_playpage_box",nodeType:'id',match:/v\.pptv\.com\/show\//},
            {funcName:"playVideo", node:"#player",nodeType:'id',match:/vip\.1905.com\/play\//},
            {funcName:"playVideo", node:"#vodPlayer",nodeType:'id',match:/www\.1905.com\/vod\/play\//},
        ];
        //创建logo_icon
        playVideoClass.createElement('div','zhmIcon');
        let zhmPlay = document.getElementById('zhmIcon');
        zhmPlay.innerHTML = playWrapHtml;
        let jxVideoWeb = jxVideoData.filter(function(item){
            return location.href.match(item.match);
        })
        //选择平台
        if(isMobile){
            document.querySelector('#zhmlogo').addEventListener('click',function(){
                let jxVideoWeb = jxVideoData.filter(function(item){
                    return location.href.match(item.match);
                })
                if(jxVideoWeb.length == 0){
                    BaseClass.toast('请在视频播放页点击图标');
                }else{
                    var {funcName,match:nowMatch,node:nowNode,name:nowName} = jxVideoWeb[0];
                    let playLineDiv = document.querySelector('.zhm_play_video_wrap');
                    let playShow = playLineDiv.style.display;
                    playShow == 'none'? playLineDiv.style.display = 'block':playLineDiv.style.display = 'none';
                    var playLineTd = document.querySelectorAll('.playLineTd');
                    playLineTd.forEach(function(item){
                        item.addEventListener('click',function(){
                            playLineTd.forEach(function(e){
                                e.setAttribute('class','playLineTd zhm_play_video_line_ul_li');
                            })
                            this.setAttribute('class','playLineTd zhm_play_video_line_ul_li zhm_line_selected');
                            playVideoClass.setCookie('playLineAction',this.getAttribute('url'),30);
                            let nowWebNode = document.querySelector(nowNode);
                            if(nowWebNode){
                                nowWebNode.innerHTML = playJxHtml;
                                let playIframe = document.querySelector('#playIframe');
                                playIframe.src= item.getAttribute('url')+location.href;
                            }else{
                                console.log('视频网站结点不存在');
                            }
                        })
                    })
                    return false;
                }
            })
            document.addEventListener('click',function(e){
                let i=0;
                e.path.forEach(function(item){
                    if(item.className=='iconLogo'){
                        i=1;
                        console.log(i);
                    }
                })
                if(i==0){
                    let isShow = document.querySelector('.zhm_play_video_wrap').style.display;
                    if(isShow == 'block'){
                        document.querySelector('.zhm_play_video_wrap').style.display='none';
                    }
                }
            })
        }else{
            //是否在播放页
            if(jxVideoWeb.length == 0){
                document.querySelector('#zhmIcon').addEventListener('click',function(){
                    BaseClass.toast('请在视频播放页点击图标');
                })
            }else{
                var {funcName,match:nowMatch,node:nowNode,name:nowName} = jxVideoWeb[0];
                //鼠标经过显示线路
                document.querySelector('.playButton').onmouseover=()=>{
                    document.querySelector(".playLineDiv").style.display='block';
                }
                document.querySelector('.playButton').onmouseout=()=>{
                    document.querySelector(".playLineDiv").style.display='none';
                }
				// 点击事件
				document.querySelector('.iconLogo').addEventListener('click',function(){
                    playVideoClass.request('get',`${outApiUrl}/jxcode.php?in=${jxCodeInfo.in}&code=${jxCodeInfo.code}`).then((result)=>{
                        location.href=`${outApiUrl}/jxjx.php?lrspm=${result}&zhm_jx=${location.href}`;
                    }).cath(err=>{})
                })
                //选择线路解析播放
                var playLineTd = document.querySelectorAll('.playLineTd');
                playLineTd.forEach(function(item){
                    item.addEventListener('click',function(){
                        playLineTd.forEach(function(e){
                            e.setAttribute('class','playLineTd zhm_play_video_line_ul_li');
                        })
                        this.setAttribute('class','playLineTd zhm_play_video_line_ul_li zhm_line_selected');
                        playVideoClass.setCookie('playLineAction',this.getAttribute('url'),30);
                        let nowWebNode = document.querySelector(nowNode);
                        if(nowWebNode){
                            nowWebNode.innerHTML = playJxHtml;
                            let playIframe = document.querySelector('#playIframe');
                            playIframe.src= item.getAttribute('url')+location.href;
                        }else{
                            console.log('视频网站结点不存在');
                        }
                    })
                })
                /*--特殊处理--*/
                //优酷去广告
                if(nowNode=="#player"){
                    setTimeout(function(){
                        let youkuAd = document.querySelector('.advertise-layer');
                        let ykAd = youkuAd.lastChild;
                        ykAd.parentNode.removeChild(ykAd);
                        document.querySelector('.kui-dashboard-0').style='display:flex';
                        let playVideo = document.querySelector('.video-layer video');
                        playVideo.play();
                        let n=0;
                        //暂停
                        document.querySelector('.kui-play-icon-0').addEventListener('click',function(){
                            let video = document.querySelector('.video-layer video');
                            if(n++%2 == 0){
                                video.pause();
                            }else{
                                video.play();
                            }
                        });
                        playVideo.addEventListener('timeupdate',function(){ //播放时间改变
                            let youkuAd = document.querySelector('.advertise-layer');
                            let ykAd = youkuAd.lastChild;
                            if(ykAd){
                                ykAd.parentNode.removeChild(ykAd);
                            }
                            document.querySelector('.kui-dashboard-0').style='display:flex';
                        });
                    },3000)
                }
                //爱奇艺去广告
                if(nowNode=="#flashbox"){
                    setTimeout(function(){
                        let dom = document.querySelector('.skippable-after');
                        if(dom){
                            dom.click();
                        }
                    },3000)
                }
                //腾讯去vip弹窗
                if(nowNode=="#player-container"){
                    let n = 0;
                    let timer = setInterval(function(){
                        if(n++ < 100){
                            let panelTipVip = document.querySelector('.panel-overlay');
                            if(panelTipVip){
                                panelTipVip.style.display='none';
                                clearInterval(timer);
                            }
                        }else{
                            clearInterval(timer);
                        }
                    },100)
                    }
                //乐视选集处理
                if(nowNode == "#le_playbox"){
                    setTimeout(function(){
                        let jBlock = document.querySelectorAll('.j_block');
                        if(!jBlock) return;
                        for(let i=0;i<jBlock.length;i++){
                            let videoId = jBlock[i].getAttribute('data-vid');
                            let link = `https://www.le.com/ptv/vplay/${videoId}.html`;
                            jBlock[i].firstChild.setAttribute('href',link);
                        }
                    },3000)
                }
                //B站大会员url处理，页面class不一致
                if(nowNode == ".player-container"){

                    setTimeout(function(){

                        if(!document.querySelector('.player-container') && !document.querySelector('.bpx-player-container')){

                            nowNode = '.player-mask';

                        }else{

                            nowNode = '.bpx-player-container';
                        }

                    },3000)
                }
                //全局click监听
                document.addEventListener('click',function(e){
                    /*爱奇艺选集去广告*/
                    if(nowName=='iqiyiPc'){
                        e.path.forEach(function(item){
                            if(item.className.indexOf('select-item')!= -1){
                                setTimeout(function(){
                                    location.href=location.href;
                                },1000)
                            }
                        })
                        setTimeout(function(){
                            let dom = document.querySelector('.skippable-after');
                            if(dom){
                                dom.click();
                            }else{
                                return;
                            }
                        },5000)
                    }
                    let areaClassName = [];
                    e.path.filter(function(item){
                        if(item.className == nowWeb[0].areaClassName){
                            areaClassName=item;
                        };
                    })
                    if(areaClassName.length == 0){
                        console.log('不在选集范围');
                        return;
                    }
                    if(nowName=='qqPC'){
                        e.path.forEach(function(item){
                            if(item.className=='episode-list-rect__item' || item.className.indexOf('episode-item') != -1){
                                setTimeout(function(){
                                    location.href=location.href;
                                },1000)
                            }
                        })
                    }
                    if(nowName == 'biliPc'){
                        //在元素范围内，不用跳转，
                        let className = ['bpx-player-video-area'];//点击元素范围，范围取视频播发区域。后续有跳转错误，新增区域即可。
                        let matchNum = 0;
                        e.path.filter(function(item){
                            if(className.indexOf(item.className) != -1){
                                matchNum++;
                            }
                        })
                        if(matchNum > 0){
                            return;
                        }
                        //视频页面选集跳转
                        setTimeout(function(){
                            let videoClassName = ['video-episode-card'];//视频页面续集dom
                            e.path.filter(function(item){
                                if(videoClassName.indexOf(item.className) != -1){
                                    location.href = location.href;
                                }
                            })
                        })
                    }
                    var objLink = {};
                    e.path.forEach(function(item){
                        if(item.href){
                            objLink.href = item.href?item.href:'';
                            objLink.target = item.target?item.target:'';
                            return;
                        }
                    })
                    if(objLink.href && objLink.target != '_blank'){
                        location.href = objLink.href;
                        return;
                    }
                })
                /*腾讯视频点击其它视频跳转*/
                if(nowName=='qqPC'){
                    let figure = document.querySelectorAll('.figure');
                    let figureDetail = document.querySelectorAll('.figure_detail');
                    let listItem = [...figure,...figureDetail];
                    if(listItem.length > 0){
                        listItem.forEach(function(item){
                            item.addEventListener('click',function(){
                                let link = this.getAttribute('href');
                                if(link){
                                    location.href = link;
                                    return;
                                }
                            })
                        });
                    }
                }
            }
        }
    }

})();