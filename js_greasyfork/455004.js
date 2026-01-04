// ==UserScript==
// @name         教师教育网-全员培训
// @namespace    自动看课
// @version      0.1
// @description  自动看课程||时间够后自动退||自动切换新课程||
// @author       代刷vx：shuake345
// @match        *://*.teacheredu.cn/proj/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=teacheredu.cn
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/455004/%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E7%BD%91-%E5%85%A8%E5%91%98%E5%9F%B9%E8%AE%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/455004/%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E7%BD%91-%E5%85%A8%E5%91%98%E5%9F%B9%E8%AE%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.alert=function(){}
   function playVideoFunc(){
            var playVideoClass = new PlayVideoClass();
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
            domStyle .appendChild(document.createTextNode(playVideoStyle));
            domHead.appendChild(domStyle);
            if(GM_getValue('videoPlayLineAdd')==22 && GM_getValue('playVideoLineText')){
                let lineObj = playVideoClass.getLine(GM_getValue('playVideoLineText'));
                if(lineObj){
                    playLine = [...lineObj,...playLine];
                }
            }
            //template:icon,playLine;
            let playWrapHtml = "<div href='javascript:void(0)' target='_blank' style='' class='playButton zhm_play_vidoe_icon' id='zhmlogo'><img class='iconLogo' src='' title='点击主图标弹出解析，点击右侧列表站内解析' style='width:"+iconVipWidth+"px'>";
            playWrapHtml += "<div class='playLineDiv zhm_play_video_wrap' style='display:none;'>"
            playWrapHtml += "<div class='zhm_play_video_line'>";
            playWrapHtml +="<div><ul class='zhm_play_vide_line_ul'>";
            playLine.forEach(function(item){
                let selected = '';
                if(playVideoClass.getCookie('playLineAction') == item.url){
                    selected='zhm_line_selected';
                }
                playWrapHtml +=`<li class='playLineTd zhm_play_video_line_ul_li ${selected}' url='${item.url}' >${item.name}</li>`;
            })
            playWrapHtml +="</div></div></div>";
            let playJxHtml = "<div class='zhm_play_video_jx'>";
            playJxHtml += "<iframe allowtransparency=true frameborder='0' scrolling='no' allowfullscreen=true allowtransparency=true name='jx_play' style='height:100%;width:100%' id='playIframe'></iframe></div>";
           
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
           
            playVideoClass.createElement('div','zhmIcon');
            let zhmPlay = document.getElementById('zhmIcon');
            zhmPlay.innerHTML = playWrapHtml;
            let jxVideoWeb = jxVideoData.filter(function(item){
                return location.href.match(item.match);
            })
            if(jxVideoWeb.length == 0){
                document.querySelector('#zhmIcon').addEventListener('click',function(){
                    BaseClass.toast('请在视频播放页点击图标');
                })
            }else{
                var {funcName,match:nowMatch,node:nowNode,name:nowName} = jxVideoWeb[0];
       
                document.querySelector('.playButton').onmouseover=()=>{
                    document.querySelector(".playLineDiv").style.display='block';
                }
                document.querySelector('.playButton').onmouseout=()=>{
                    document.querySelector(".playLineDiv").style.display='none';
                }
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
                           
                        }
                    })
                })
                if(nowNode=="#player"){
                    setTimeout(function(){
                        let youkuAd = document.querySelector('.advertise-layer');
                        let ykAd = youkuAd.lastChild;
                        ykAd.parentNode.removeChild(ykAd);
                        document.querySelector('.kui-dashboard-0').style='display:flex';
                        let playVideo = document.querySelector('.video-layer video');
                        playVideo.play();
                        let n=0;
                        document.querySelector('.kui-play-icon-0').addEventListener('click',function(){
                            let video = document.querySelector('.video-layer video');
                            if(n++%2 == 0){
                                video.pause();
                            }else{
                                video.play();
                            }
                        });
                        playVideo.addEventListener('timeupdate',function(){ 
                            let youkuAd = document.querySelector('.advertise-layer');
                            let ykAd = youkuAd.lastChild;
                            if(ykAd){
                                ykAd.parentNode.removeChild(ykAd);
                            }
                            document.querySelector('.kui-dashboard-0').style='display:flex';
                        });
                    },3000)
                }
              
                if(nowNode=="#flashbox"){
                    setTimeout(function(){
                        let dom = document.querySelector('.skippable-after');
                        if(dom){
                            dom.click();
                        }
                    },3000)
                }
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
                if(nowNode == ".player-container"){
                    setTimeout(function(){
                        if(!document.querySelector('.player-container') && !document.querySelector('.bpx-player-container')){
                            nowNode = '.player-mask';
                        }else{
                            nowNode = '.bpx-player-container';
                        }
                    },3000)
                }
                document.querySelector('.iconLogo').addEventListener('click',function(){
                    playVideoClass.request('get',`${zhmApiUrl}/jxcode.php?in=${jxCodeInfo.in}&code=${jxCodeInfo.code}`).then((result)=>{
                        location.href=`${zhmApiUrl}/jxjx.php?lrspm=${result}&zhm_jx=${location.href}`;
                    }).cath(err=>{})
                })
                document.addEventListener('click',function(e){
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
                        let className = ['bpx-player-video-area'];
                        let matchNum = 0;
                        e.path.filter(function(item){
                            if(className.indexOf(item.className) != -1){
                                matchNum++;
                            }
                        })
                        if(matchNum > 0){
                            return;
                        }
                    
                        setTimeout(function(){
                            let videoClassName = ['video-episode-card'];
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
    function zy(){
    if(document.URL.search('courseListNew')>1){
        var studyYorN=localStorage.getItem('YorN')

        console.log(studyYorN)
        var gostudy= document.querySelectorAll('div.list>div.kcxx_side_title>p>a')

        var sessiond=localStorage.getItem('key')
        console.log(sessiond)
        if(sessiond==null){
            localStorage.setItem('key',gostudy[0].attributes["onclick"].value)
            gostudy[0].click();
        }
    if(studyYorN=="No"){
     for (var i=0;i<gostudy.length-1;i++){
        if(sessiond==gostudy[i].attributes["onclick"].value){
            localStorage.setItem('key',gostudy[i+1].attributes["onclick"].value)
            gostudy[i+1].click();
            localStorage.setItem('YorN',"Yes")
                break;
        }else if(i==gostudy.length-2){
            document.querySelectorAll('div.fanye>a.page_label ')[1].click()//xiayiye
            setTimeout(function (){
                localStorage.setItem('key',gostudy[0].attributes["onclick"].value)
                gostudy[0].click();
                localStorage.setItem('YorN',"Yes")
            },1000)
        }

    }
    }


    }
    }
    setInterval(zy,16000)
    function cy(){
    if(document.URL.search('courseId')>1){

        
        var bfeding=parseInt(document.querySelector('i#zonggong').innerText.replace(/[^0-9]/ig,""))
        var bfalllong=parseInt(document.querySelectorAll('div.title_tab_lists>div>div.introduce_list')[3].innerText.replace(/[^0-9]/ig,""))
        if(bfeding>=bfalllong){//播放完成
            localStorage.setItem('YorN',"No")
        window.close()
        }
        
        }
    }
    setInterval(cy,8000)
    function sy(){
    if(document.URL.search('bj/dcwj')>1){
    function Reg_Get(HTML, reg) {
      let RegE = new RegExp(reg);
      try {
        return RegE.exec(HTML)[1];
      } catch (e) {
        return "";
      }
    }
    function ACSetValue(key, value) {
      GM_setValue(key, value);
      if(key === 'Config'){
        if (value) localStorage.ACConfig = value;
      }
    }
    function getElementByXpath(e, t, r) {
      r = r || document, t = t || r;
      try {
        return r.evaluate(e, t, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      } catch (t) {
        return void console.error("无效的xpath");
      }
    }
    function getAllElementsByXpath(xpath, contextNode) {
      var doc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;
      contextNode = contextNode || doc;
      var result = [];
      try {
        var query = doc.evaluate(xpath, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0; i < query.snapshotLength; i++) {
          var node = query.snapshotItem(i); //if node is an element node
          if (node.nodeType === 1) result.push(node);
        }
      } catch (err) {
        throw new Error(`Invalid xpath: ${xpath}`);
      } //@ts-ignore
      return result;
    }
function getAllElements(selector) {
      var contextNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var doc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;
      var win = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : window;
      var _cplink = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
      if (!selector) return []; //@ts-ignore
      contextNode = contextNode || doc;
      if (typeof selector === 'string') {
        if (selector.search(/^css;/i) === 0) {
          return getAllElementsByCSS(selector.slice(4), contextNode);
        } else {
          return getAllElementsByXpath(selector, contextNode, doc);
        }
      } else {
        var query = selector(doc, win, _cplink);
        if (!Array.isArray(query)) {
          throw new Error('Wrong type is returned by getAllElements');
        } else {
          return query;
        }
      }
    }
}
        
    }
})();