// ==UserScript==
// @name        FloatingPlayer
// @namespace   https://greasyfork.org/zh-CN/scripts/449323/
// @version     1.0.2
// @description FloatingPlayer!悬浮窗
// @author      Ylanty
// @license     GPLv3
// @match       http*://*/*
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAE7mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4xLWMwMDAgNzkuYTg3MzFiOSwgMjAyMS8wOS8wOS0wMDozNzozOCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjAgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0wNy0yM1QyMTozMzo0MiswODowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjItMDctMjlUMTY6NTk6MjgrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjItMDctMjlUMTY6NTk6MjgrMDg6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmViNWUxNzAxLTIzNTYtYWI0NS1hNThhLWNjODA2NGRiZWQzYiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDplYjVlMTcwMS0yMzU2LWFiNDUtYTU4YS1jYzgwNjRkYmVkM2IiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplYjVlMTcwMS0yMzU2LWFiNDUtYTU4YS1jYzgwNjRkYmVkM2IiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmViNWUxNzAxLTIzNTYtYWI0NS1hNThhLWNjODA2NGRiZWQzYiIgc3RFdnQ6d2hlbj0iMjAyMi0wNy0yM1QyMTozMzo0MiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIzLjAgKFdpbmRvd3MpIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoBFavEAAAJ5SURBVEiJtZZNSFRRGIYfwyKYTSudJlfa2pkCEWtRlqFtLjZabkqkP9oEZRH9oQiVuIiMAhnMZeCNfsYxSTOTCSa1UjIqghJ/R8tQR0ObmWq+Fnab6XIdnTFfOHD4zj3vc97DOffeBBFhJbXKqLj5DvnX3/Dg3STf2r30nfRwzaqixEUQkX9aer0ot95Lq+jUNiJ9O5xyML1eFP2caM0QMB0IG/8Khfu+gMj5TnHEAjEEaIZnO6TGpkr+aY/cmPKHQW6vDOY0yOGlgKICNqmSr9WynVLSNix92thMUKSsS+qsi0CiAvQrTK8X5VyHOHwRW+gZE2+uS44ulMbwFC2k3iJcTYM02Zs55B5lAGCLGcu9PByFaRTYjE5aLAn0z13slNqZYDhN52cZ290oxyLnxZRAn8Y1QKP9EUc8Y4wAZCZjvptHTZaZrL/3Jt4E+jllXVKnnbSpgEi2U0qWlUCfxtlPQ8UrqgHWrYGcFHbBAq+KeBUSQlr/R4jgfwPYVJTCNAoqMigF8M5CyxAtAInLMbaqKBtMWGqzqchIIgnAF4Qzz7kw+5O5ZQFsKsq+jew9YWW/6Y/LkxE+Xenm8oSfyd4iXHEBrCqKxYTFsZ3yzGTMAJN+qOzh5uNhWjVjTTEBtL0utVGsrbpliA+VPVROBfDpzRcFJK6aH7eqKOtNmGu2UZ5lxgIw4YdL3VQ/HaHdyHhJAHsqe7beZ21BKrmnbBSbVs/XmwZ5W9VD1XSQmWjmgPFNjnz3R2p8TuT4M7kaywfH8B7c/shDfa2hn9f2Zg64R3EvuupoW9RbhMumgi+Ab2cKOV+/M+4awPXiCy9jMdaUICv82/IbKqHswvE0TmsAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/449323/FloatingPlayer.user.js
// @updateURL https://update.greasyfork.org/scripts/449323/FloatingPlayer.meta.js
// ==/UserScript==
var run=1;
//// @noframes
(function() {
    'use strict';
    if(run>1) return;
    run++;
    var zindex=999999999;
    var maxrect=5,minrect=0.25,steprect=0.05,maxrspeed=10,fastwinds=20;
    var findedVideoElement=false,touchedVideoElement=false,floatingFlag=false,isIframe=false,isRotate=false,isFloatingbtnContainDisplay=false,isPhone=false;
    var rotate=0;
    var screenSize=1,screenSizeChange=0,screenPosition='default';
    var videoInfo={};
    var videoratio={width:0,height:0};
    var allElements={};
    var containSize={width:0,height:0};
    var cw,ch;
    var showFloatingInfoInterval=null,showSettingsT=null,showMsgT=null,onLongPress=null,doubleTouchT=null;
    var touchInfo={},mouseInfo={};
    var floatingPlayerData = {
        videoratio34: {name: '3:4',trstart:true,tr:'videoratio'},
        videoratio43: {name: '4:3'},
        videoratio916: {name: '9:16'},
        videoratio169: {name: '16:9'},
        videoratioauto: {name: '拉伸',colspan: 2},
        videoratiosource: {name: '原比',colspan: 2,trend:true},

        //videorect: {name: '&#128468;'},
        videorect_001: {name: -steprect*100+'%',value: -steprect,trstart:true,tr:'videorect'},
        videorectrange: {name: '滑动',colspan: 5,buttontype: 'range'},
        videorect001: {name: '+'+steprect*100+'%',value: steprect},
        videorectshow: {name: '100%',trend:true},

        //volume: {name: '&#128266;'},
        volume_010: {name: '-10%',value: -0.1,trstart:true,tr:'volume'},
        volumerange: {name: '滑动',colspan: 5,buttontype: 'range'},
        volume010: {name: '+10%',value: 0.1},
        volumeshow: {name: '100%',trend:true},

        //speed: {name: '倍速'},
        speed_001: {name: '-x0.1',value: -0.1,trstart:true,tr:'speed'},
        speedrange: {name: '滑动',colspan: 5,buttontype: 'range'},
        speed001: {name: '+x0.1',value: 0.1},
        speedshow: {name: 'x1.0',trend:true},

        positionlefttop: {name: '&#x25F0;',trstart:true},
        rotate: {name: '&#x21BB;',value: 90},
        volume: {name: '&#128266;'},
        speed: {name: '倍速'},
        videoratio: {name: '比例'},
        videorect: {name: '&#128468;'},
        rotate_: {name: '&#x21BA;',value: -90},
        positionrighttop: {name: '&#x25F3;',trend:true},

        progress: {name: '进度',nolistener:true,trstart:true},
        progressrange: {name: '滑动',colspan: 6,buttontype: 'range'},
        progressshow: {name: '100%',nolistener:true,trend:true},

        positionleftbottom: {name: '&#x25F1;',trstart:true},
        rewind: {name: '&#9194;'+fastwinds+'s',value: -fastwinds},
        progress_001: {name: '&#9194;1%',value: -0.01},
        play: {name: '&#9199;'},
        progress001: {name: '&#9193;1%',value: 0.01},
        fastwind: {name: '&#9193;'+fastwinds+'s',value: fastwinds},
        positioncenter: {name: '&#10696;'},
        positionrightbottom: {name: '&#x25F2;',trend:true}
    };

    findVideoElement();
    function findVideoElement(){
        //alert(document.querySelector('iframe').contentWindow.document.querySelectorAll('video'));
        //var k=0;
        var findVideoElementInterval = setInterval(function(){
            if(document.querySelector('video')){
                //alert(1);
                allElements.videoElement=document.querySelector('video');
                if(allElements.videoElement.readyState >= 2){
                    //alert(window.top===window.self);
                    allElements.floatElement=allElements.videoElement;
                    if(window.top===window.self){
                        isIframe=false;
                    }else{
                        //allElements.floatElement=window.top.document.querySelector('iframe');
                        isIframe=true;
                    }
                    allElements.floatElementContain=allElements.floatElement.parentElement;
                    findedVideoElement=true;
                    //clearInterval(findVideoElementInterval);
                    if(window.top.document.querySelector('#fptlh')) window.top.document.querySelector('#fptlh').remove();
                    window.top.document.body.insertAdjacentHTML('beforeend','<input id="fptlh" value="'+window.top.location.href+'" style="display:none;">');
                    isPhone=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                    showFloatingBtn();
                }
            }
            //k++;
            if(window.top.document.querySelector('#fptlh')){
                var fptlh=window.top.document.querySelector('#fptlh');
                if(fptlh.value==window.top.location.href) clearInterval(findVideoElementInterval);
            }
        }, 1000);
    }
    /*function findVideoElement(){
       //alert(document.querySelector('iframe').contentWindow.document.querySelectorAll('video'));
        if(document.querySelector('video')){
            //alert(1);
            allElements.videoElement=document.querySelector('video');
            if(allElements.videoElement.readyState >= 2 && allElements.videoElement.duration>=20){
                allElements.floatElement=allElements.videoElement;
                allElements.floatElementContain=allElements.floatElement.parentElement;
                findedVideoElement=true;
            }
        }else if(document.querySelector('iframe').contentWindow.document.querySelector('video')){
            //alert(2);
            allElements.videoElement=document.querySelector('iframe').contentWindow.document.querySelector('video');
            if(allElements.videoElement.readyState >= 2 && allElements.videoElement.duration>=20){
                allElements.floatElement=document.querySelector('iframe');
                //allElements.floatElement=allElements.videoElement;
                allElements.floatElementContain=allElements.floatElement.parentElement;
                findedVideoElement=true;
                isIframe=true;
            }
        }
    }*/
    function showFloatingBtn(){
        var btnCss=`<style type="text/css">.fixedscroll{position: fixed;overflow:hidden;width:100%;}
                    .floatingvideo{object-fit: fill!important;}div.dplayer-menu{display:none!important;}
                    #floatingshowmsg{z-index: `+(zindex+4)+`!important;position: fixed;text-align:center;line-height:1;font-size:30px;color: #fff;margin: 0 4px 0 0;padding: 1px 1px 1px 0;text-shadow: 1px 1px 0 rgb(0 0 0 / 70%);}
                    #floatingplayer_setting{border-collapse: separate;z-index: `+(zindex+2)+`!important;position: fixed;text-align:center;background: rgba(30, 29, 32, 0.5);}
                    .tablecss{border-spacing:0;}
                    .cellcss{width:100%;heght:100%;color: #fff;text-shadow: 1px 1px 0 rgb(0 0 0 / 70%);}</style>`;
        document.head.insertAdjacentHTML('beforeend',btnCss);
        //&#9771;&#x21BB;
        //var floatingbtnstr='<a id="floatingbtn" title="打开/关闭悬浮窗" target="_blank" class="floatingbtn" style="right:12px;bottom:40px;">&#1422;</a>';
        var floatingshowmsgstr='<span id="floatingshowmsg" class="floatingshowmsg" style="display:none;">floatingshowinfo</span>';
        var floatingcontrols=create_table('floatingplayer_setting',floatingPlayerData,8);
        var floatingbtnContainstr='<div id="floatingbtnContain">'+floatingshowmsgstr+floatingcontrols+'</div>';
        allElements.floatElementRect=allElements.floatElement.getBoundingClientRect();
        document.body.insertAdjacentHTML('beforeend',floatingbtnContainstr);
        allElements.floatingbtnContain=document.getElementById('floatingbtnContain');
        floating();
        allElements.floatingbtnContain.append(allElements.floatElement);
        /*if(isIframe){
                //allElements.floatingbtnContain=window.top.document.getElementById('floatingbtnContain');
            }else{
            //window.top.document.querySelector('head').insertAdjacentHTML('beforeend','<style type="text/css">.fixedscroll{position: fixed;overflow:hidden;width:100%;}</style>');
                //allElements.floatingbtnContain.append(allElements.floatElement);
            }*/
        allElements.floatingshowmsg=document.getElementById('floatingshowmsg');
        allElements.floatingplayer_setting=document.getElementById('floatingplayer_setting');
        allElements.floatingplayer_setting_table=document.getElementById('floatingplayer_setting_table');
        allElements.floatingbtnContain=document.getElementById('floatingbtnContain');
        if(allElements.videoElement.paused) allElements.videoElement.play();
        setEventListener();
        showFloatingInfo();
    }
    function create_table(id,data,rows) {
        var htmlTable = `<div id="`+id+`" style="display:none;overflow: auto;"><table id="`+id+`_table" border="1" cellspacing="0" class="tablecss">`;
        var datavalue='',tdInfo='',trInfo='',tdWidth='',inputInfo='';
        for (let index in data) {
            datavalue='undefined';
            tdInfo='';
            tdWidth=100/rows;
            inputInfo='';
            if (data[index].trstart) {
                trInfo='';
                if(data[index].tr) trInfo=`id="${data[index].tr}_tr" style="display:none;"`;
                htmlTable += `<tr ${trInfo}>`;
            }
            if(data[index].value) datavalue=data[index].value;
            if(data[index].colspan){
                tdInfo+=`colspan="${data[index].colspan}" `;
                tdWidth*=data[index].colspan;
            }
            if(data[index].rowspan) tdInfo+=`rowspan="${data[index].rowspan}" `;
            tdInfo+=`style="width:${tdWidth}%;height:25%;"`;
            inputInfo=`id="floatingplayer_${index}" class="cellcss" dataname="${index}" datavalue="${datavalue}" datatitle="${data[index].name}"`;
            if(data[index].buttontype){
                htmlTable += `<td ${tdInfo}><input ${inputInfo} type="range"></td>`;
            }else{
                htmlTable += `<td ${tdInfo}><div ${inputInfo}>${data[index].name}</div></td>`;
            }
            if (data[index].trend) {
                htmlTable += `</tr>`;
            }
        }
        htmlTable += `</table></div>`;
        return htmlTable;
    }
    function floating(){
        floatingFlag=floatingFlag?false:true;
        if(floatingFlag){
            videoratio.width=allElements.videoElement.videoWidth;
            videoratio.height=allElements.videoElement.videoHeight;
            allElements.floatElement.className='';
            allElements.videoElement.classList.add('floatingvideo');
            /*if(!isIframe){
                //allElements.videoElement.removeAttribute('controls');
                //allElements.videoElement.className='floatingvideo';
                allElements.videoElement.style='';
                allElements.videoElement.id='';
                //allElements.videoElement.controlsList='nofullscreen';
            }*/
            allElements.floatElement.style='';
            allElements.floatElement.style.position='fixed';
            allElements.floatElement.style.zIndex=zindex;
            if(isPhone){
                screenSize=1;
                screenPosition='lefttop';
                setFloatingVidooRect();
            }else{
                cw=window.top.document.documentElement.clientWidth;
                ch=window.top.document.documentElement.clientHeight;
                var vw=allElements.videoElement.videoWidth;
                var vh=allElements.videoElement.videoHeight;
                var vr=allElements.floatElementRect;
                var vrw=vr.width;
                var vrh=vr.height;
                var vrl=vr.left;
                var vrt=vr.top;
                var vrfw=vrw<vrh*vw/vh?vrw:vrh*vw/vh;
                var vrfh=vrh<vrw*vh/vw?vrh:vrw*vh/vw;
                var top=vrt+(vrh-vrfh)/2<0?0:(vrt+(vrh-vrfh)/2>ch-vrfh?ch-vrfh:vrt+(vrh-vrfh)/2);
                screenSize=vrfw/cw>vrfh/ch?vrfw/cw:vrfh/ch;
                //screenPosition='default';
                allElements.floatElement.style.width=vrfw+'px';
                allElements.floatElement.style.height=vrfh+'px';
                allElements.floatElement.style.left=vrl+(vrw-vrfw)/2+'px';
                allElements.floatElement.style.top=top+'px';
            }
        }
    }
    function setSettings(dataname){
        var vr=allElements.videoElement.getBoundingClientRect();
        //cw=document.documentElement.clientWidth;
        var width=1/12;
        if(dataname.substring(0,6)=='volume' || dataname.substring(0,5)=='speed' || dataname.substring(0,10)=='videoratio' || dataname.substring(0,9)=='videorect'){
            width*=4;
        }else{
            width*=3;
        }
        allElements.floatingplayer_setting.style.left=vr.left+'px';
        allElements.floatingplayer_setting.style.top=vr.top+vr.height*(1-width)+'px';
        var fer=allElements.floatingplayer_setting.getBoundingClientRect();
        if(fer.top+fer.height>ch){
            ch=document.documentElement.clientHeight;
            allElements.floatingplayer_setting.style.top=ch-fer.height+'px';
        }
        //allElements.floatingplayer_setting.style.maxWidth=vr.width+'px';
        //allElements.floatingplayer_setting.style.maxHeight=vr.height/2+'px';
        allElements.floatingplayer_setting_table.style.width=vr.width+'px';
        allElements.floatingplayer_setting_table.style.height=vr.height*width+'px';
        //console.log('fer',allElements.floatingplayer_setting.getBoundingClientRect().top);
    }
    function showSettings(dataname){
        if(showSettingsT!=null) clearTimeout(showSettingsT);
        allElements.volume_tr.style.display='none';
        allElements.speed_tr.style.display='none';
        allElements.videoratio_tr.style.display='none';
        allElements.videorect_tr.style.display='none';
        var tempdataname='';
        if((tempdataname=dataname.substring(0,6))=='volume' || (tempdataname=dataname.substring(0,5))=='speed' || (tempdataname=dataname.substring(0,10))=='videoratio' || (tempdataname=dataname.substring(0,9))=='videorect'){
            allElements[tempdataname+'_tr'].style='';
        }else{
            allElements.floatingplayer_setting.style.display='block';
        }
        setSettings(dataname);
        showFloatingInfo();
        showSettingsT = setTimeout(function() {
            showSettingsT=null;
            allElements.floatingplayer_setting.style.display='none';
            //allElements[dataname+'_tr'].style.display='none';
            setSettings('controls');
        }, 3000);
    }
    function toggleSettings(){
        if(allElements.floatingplayer_setting.style.display=='none'){
            showSettings('controls');
        }else{
            if(showSettingsT!=null) clearTimeout(showSettingsT);
            allElements.floatingplayer_setting.style.display='none';
        }
    }
    function showFloatingInfo(){
        if(showFloatingInfoInterval==null){
            showFloatingInfoInterval = setInterval(function(){
                var ct=allElements.videoElement.currentTime;
                var dt=allElements.videoElement.duration;
                //allElements.floatingplayer_time.textContent=secondsToTimeStr(ct)+'/'+secondsToTimeStr(dt);

                allElements.floatingplayer_videorectrange.value=(screenSize*100/maxrect).toFixed(0);
                allElements.floatingplayer_videorectshow.textContent=(screenSize*100).toFixed(0)+'%';

                var progressbarvalue=ct/dt*100;
                allElements.floatingplayer_progressrange.value=(progressbarvalue).toFixed(0);
                //allElements.floatingplayer_progressshow.textContent=(progressbarvalue).toFixed(0)+'%';
                allElements.floatingplayer_progress.textContent=secondsToTimeStr(ct);
                allElements.floatingplayer_progressshow.textContent=secondsToTimeStr(dt);

                var speedanyvalue=allElements.videoElement.playbackRate;
                allElements.floatingplayer_speedrange.value=(speedanyvalue*100/maxrspeed).toFixed(0);
                allElements.floatingplayer_speedshow.textContent='x'+speedanyvalue.toFixed(1);

                var volumeanyvalue=allElements.videoElement.volume;
                allElements.floatingplayer_volumerange.value=(volumeanyvalue*100).toFixed(0);
                allElements.floatingplayer_volumeshow.textContent=(volumeanyvalue*100).toFixed(0)+'%';
                if(allElements.floatingplayer_setting.style.display=='none'){
                    clearInterval(showFloatingInfoInterval);
                    showFloatingInfoInterval=null;
                }
            }, 1000);
        }
    }

    function setMsg(){
        var vr=allElements.videoElement.getBoundingClientRect();
        var left=vr.left<0?0:vr.left;
        var top=vr.top<0?0:vr.top;
        allElements.floatingshowmsg.style.left=left+'px';
        allElements.floatingshowmsg.style.top=top+'px';
    }
    function showMsg(msg){
        if(showMsgT!=null) clearTimeout(showMsgT);
        setMsg();
        allElements.floatingshowmsg.textContent=msg;
        allElements.floatingshowmsg.style.display='block';
        showMsgT = setTimeout(function() {
            showMsgT=null;
            allElements.floatingshowmsg.style.display='none';
        }, 2000);
    }

    function floatingVidooAttr(e){
        //if(isIframe) videoElement=videoElementContain.querySelector('video');
        var ele=e.target;
        var value=ele.value;
        var dataname=ele.getAttribute('dataname');
        var datavalue=ele.getAttribute('datavalue');
        var datatitle=ele.getAttribute('datatitle');
        //alert([dataname,datavalue]);
        if(datavalue!='undefined') datavalue=parseFloat(datavalue);
        if(dataname.substring(0,9)=='videorect'){
            setVideoRect(dataname,datavalue,value);
        }else if(dataname.substring(0,8)=='progress'){
            setProcess(dataname,datavalue,value);
        }else if(dataname.substring(0,5)=='speed'){
            setSpeed(dataname,datavalue,value);
        }else if(dataname.substring(0,6)=='volume'){
            setVolume(dataname,datavalue,value);
        }else if(dataname=='rewind' || dataname=='fastwind'){
            allElements.videoElement.currentTime=allElements.videoElement.currentTime+datavalue;
        }else if(dataname=='play'){
            allElements.videoElement.paused?allElements.videoElement.play():allElements.videoElement.pause();
        }else if(dataname=='rotate' || dataname=='rotate_'){
            screenSizeChange=0;
            rotate+=datavalue;
            if(rotate>=360) rotate-=360;
            else if(rotate<0) rotate+=360;
            allElements.floatElement.style.transform='rotate('+rotate+'deg)';
            //allElements.floatingcontrols.style.transform='rotate('+rotate+'deg)';
            /*floatingplayer_setting.style.transform='rotate('+rotate+'deg)';}*/
        }else if(dataname.substring(0,8)=='position'){
            screenPosition=dataname.substring(8);
            if(screenPosition=='center') screenSize=1;
            //setPosition(dataname);
        }else if(dataname.substring(0,10)=='videoratio'){
            setVideoRatio(dataname);
        }
        if(dataname=='rotate' || dataname=='rotate_' || dataname.substring(0,5)=='video' || dataname.substring(0,8)=='position'){
            setFloatingVidooRect();
        }
        showSettings(dataname);
        //setSettings(dataname);
        showMsg(datatitle);
    }
    function setVideoRect(dataname,datavalue,value){
        if(dataname=='videorect'){
            //setVideoRect();
            //showSettings(dataname);
        }else if(dataname=='videorect_001' || dataname=='videorect001'){
            var tempScreenSize=screenSize;
            screenSize+=datavalue;
            screenSize=screenSize>maxrect?maxrect:(screenSize<minrect?minrect:screenSize);
            screenSizeChange=screenSize-tempScreenSize;
        }else if(dataname=='videorectrange'){
            value=value<minrect*100/maxrect?minrect*100/maxrect:value;
            screenSizeChange=value/100*maxrect-screenSize;
            screenSize=value/100*maxrect;
        }else if(dataname=='videorectshow'){
            screenSizeChange=1-screenSize;
            screenSize=1;
            screenPosition='center';
        }
    }
    function setProcess(dataname,datavalue,value){
        if(dataname=='progress'){
            //screenSize=1;
        }else if(dataname=='progress_001' || dataname=='progress001'){
            allElements.videoElement.currentTime+=allElements.videoElement.duration*datavalue;
        }else if(dataname=='progressrange'){
            allElements.videoElement.currentTime=allElements.videoElement.duration*value/100;
        }else if(dataname=='progressshow'){
            //screenSize=1;
        }
    }
    function setSpeed(dataname,datavalue,value){
        if(dataname=='speed'){
            //showSettings(dataname);
        }else if(dataname=='speedshow'){
            allElements.videoElement.playbackRate=1;
        }else if(dataname=='speed_001' || dataname=='speed001'){
            if(allElements.videoElement.playbackRate+datavalue>maxrspeed){
                allElements.videoElement.playbackRate=maxrspeed;
            }else if(allElements.videoElement.playbackRate+datavalue<=0){
                allElements.videoElement.playbackRate=0.1;
            }else{
                allElements.videoElement.playbackRate+=datavalue;
            }
        }else if(dataname=='speedrange'){
            allElements.videoElement.playbackRate=(value/100*maxrspeed).toFixed(1);
        }
    }
    function setVolume(dataname,datavalue,value){
        if(dataname=='volume'){
            //allElements.videoElement.muted=allElements.videoElement.muted?false:true;
            //showSettings(dataname);
        }else if(dataname=='volume_010' || dataname=='volume010'){
            if(allElements.videoElement.volume+datavalue>1) allElements.videoElement.volume=1;
            else if(allElements.videoElement.volume+datavalue<0) allElements.videoElement.volume=0;
            else allElements.videoElement.volume+=datavalue;
        }else if(dataname=='volumerange'){
            allElements.videoElement.volume=value/100;
        }else if(dataname=='volumeshow'){
            allElements.videoElement.muted=false;
            allElements.videoElement.volume=1;
        }
    }
    function setVideoRatio(dataname){
        if(dataname=='videoratio'){
            //showSettings(dataname);
        }else if(dataname=='videoratiosource'){
            videoratio.width=allElements.videoElement.videoWidth;
            videoratio.height=allElements.videoElement.videoHeight;
        }else if(dataname=='videoratio34'){
            videoratio.width=3;
            videoratio.height=4;
        }else if(dataname=='videoratio43'){
            videoratio.width=4;
            videoratio.height=3;
        }else if(dataname=='videoratio916'){
            videoratio.width=9;
            videoratio.height=16;
        }else if(dataname=='videoratio169'){
            videoratio.width=16;
            videoratio.height=9;
        }else if(dataname=='videoratioauto'){
            if(rotate==90||rotate==270){
                videoratio.width=window.top.document.documentElement.clientHeight;
                videoratio.height=window.top.document.documentElement.clientWidth;
            }else{
                videoratio.width=window.top.document.documentElement.clientWidth;
                videoratio.height=window.top.document.documentElement.clientHeight;
            }
        }
    }

    function setFloatingVidooRect(){
        var left,top;
        cw=window.top.document.documentElement.clientWidth;
        ch=window.top.document.documentElement.clientHeight;

        var vw=videoratio.width;
        var vh=videoratio.height;
        var fw,fh;
        isRotate=rotate==90||rotate==270;
        if(isRotate){
            fw=(ch<cw/vh*vw?ch:cw/vh*vw);
            fh=(cw<ch/vw*vh?cw:ch/vw*vh);
        }else{
            fw=(cw<ch*vw/vh?cw:ch*vw/vh);
            fh=(ch<cw*vh/vw?ch:cw*vh/vw);
        }
        var sfw=fw*screenSize;
        var sfh=fh*screenSize;
        /*if(isIframe){
            allElements.videoElement.style.width=sfw+'px';
            allElements.videoElement.style.height=sfh+'px';
        }*/
        allElements.floatElement.style.width=sfw+'px';
        allElements.floatElement.style.height=sfh+'px';
        //var vr=floatElement.getBoundingClientRect();
        var fel=allElements.floatElement.offsetLeft;
        var fet=allElements.floatElement.offsetTop;
        var sfwh=-(sfw-sfh)/2;
        if(screenPosition=='lefttop'){
            left=isRotate?sfwh:0;
            top=isRotate?-sfwh:0;
        }else if(screenPosition=='righttop'){
            left=isRotate?cw-sfw-sfwh:cw-sfw;
            top=isRotate?-sfwh:0;
        }else if(screenPosition=='leftbottom'){
            left=isRotate?sfwh:0;
            top=isRotate?ch-sfh+sfwh:ch-sfh;
        }else if(screenPosition=='rightbottom'){
            left=isRotate?cw-sfw-sfwh:cw-sfw;
            top=isRotate?ch-sfh+sfwh:ch-sfh;
        }else if(screenPosition=='center'){
            left=(cw-sfw)/2;
            top=(ch-sfh)/2;
        }else if(screenPosition=='mousewheel'){
            left=fel-(fw*screenSizeChange)*videoInfo.cx/videoInfo.ew;
            top=fet-(fh*screenSizeChange)*videoInfo.cy/videoInfo.eh;
        }else if(screenPosition=='mousemove'){
            left=fel-(fw*screenSizeChange)/2;
            top=fet-(fh*screenSizeChange)/2;
        }else{
            left=fel;
            top=fet;
        }
        allElements.floatElement.style.left=left+'px';
        allElements.floatElement.style.top=top+'px';
    }
    function secondsToTimeStr(secs){
        secs=secs.toFixed(0);
        var hour=parseInt(secs/3600);
        var min=parseInt(secs/60)-60*hour;
        var sec=secs%60;
        var ret='';
        ret+=(hour>0?hour+':':'')+(min < 10? '0' + min : min) + ':' + (sec < 10? '0' + sec : sec);
        return ret;
    }

    function setEventListener(){
        if(isPhone){
            allElements.videoElement.addEventListener("touchstart",videoEvent,true);
        }else{
            if(!isIframe) allElements.videoElement.addEventListener("mouseover",videoEvent,true);
            allElements.videoElement.addEventListener("mousedown",videoEvent,true);
            if(!isIframe) allElements.videoElement.addEventListener("mousewheel",videoEvent,true);
        }
        for (let index in floatingPlayerData) {
            if(floatingPlayerData[index].tr) allElements[floatingPlayerData[index].tr+'_tr']=document.getElementById(floatingPlayerData[index].tr+'_tr');
            allElements['floatingplayer_'+index]=document.getElementById('floatingplayer_'+index);
            if(!floatingPlayerData[index].nolistener){
                allElements['floatingplayer_'+index].addEventListener(floatingPlayerData[index].buttontype?'input':'click', floatingVidooAttr,true);
            }
        }
    }
    function fixedscroll(type){
        if(type=='scroll'){
            if(!window.top.document.body.classList.value.includes('fixedscroll')){
                videoInfo.scrollY=window.top.scrollY;
                videoInfo.dw=window.top.document.documentElement.clientWidth;
                window.top.document.body.classList.add('fixedscroll');
                window.top.document.body.style.top = `-${videoInfo.scrollY}px`;
                window.top.document.body.style.width = `${videoInfo.dw}px`;
            }
        }else if(type=='leave'){
            if(window.top.document.body.classList.value.includes('fixedscroll')){
                window.top.document.body.classList.remove('fixedscroll');
                window.top.document.body.style.top = `0px`;
                window.top.scrollTo({top:videoInfo.scrollY});
                window.top.document.body.style.width = null;
                videoInfo.scrollY=null;
            }
        }
    }
    function videoEvent(e){
        var self=e;
        var ele=e.target;
        var etype=e.type;
        //ele.paused?ele.play():ele.play();
        if(etype=='mouseover'){
            //videoInfo.scrollY=null;
            ele.addEventListener("mouseleave",videoEvent,true);
            //showSettings();
        }else if(etype=='mousewheel'){
            fixedscroll('scroll');
            var deltaY=self.deltaY;
            videoInfo.cx=self.clientX-ele.offsetLeft;
            videoInfo.cy=self.clientY-ele.offsetTop;
            videoInfo.ew=ele.offsetWidth;
            videoInfo.eh=ele.offsetHeight;
            var tempScreenSize=screenSize;
            var tempSizeChange=deltaY<0?-steprect:(deltaY>0?steprect:0);
            screenSize+=screenSize>2?tempSizeChange*2:tempSizeChange;
            screenSize=screenSize>maxrect?maxrect:(screenSize<minrect?minrect:screenSize);
            screenSizeChange=screenSize-tempScreenSize;
            screenPosition='mousewheel';
            if(screenSizeChange!=0) setFloatingVidooRect();
            setSettings('controls');
            showMsg((screenSize*100).toFixed(0)+'%');
        }else if(etype=='touchstart' || etype=='mousedown'){
            fixedscroll('scroll');
            //cw=document.documentElement.clientWidth;
            //ch=document.documentElement.clientHeight;
            videoInfo.self=etype=='touchstart'?self.touches[0]:self;
            videoInfo.originalPlaybackRate=ele.playbackRate;
            if (onLongPress == null){
                onLongPress = setTimeout(function() {
                    if (doubleTouchT != null){
                        clearTimeout(doubleTouchT);
                        doubleTouchT = null;
                    }
                    ele.playbackRate=5.0;
                    showMsg('倍速x'+ele.playbackRate);
                }, 200);
            }
            if (doubleTouchT == null) {
                doubleTouchT = setTimeout(function () {
                    doubleTouchT = null;
                    toggleSettings();
                    //alert("single");
                }, 300)
            }else{
                clearTimeout(doubleTouchT);
                doubleTouchT = null;
                var cx=ele.offsetLeft+ele.offsetWidth/2;
                var cy=ele.offsetTop+ele.offsetHeight/2;
                var isfastwinds=false;
                if((rotate==0 && videoInfo.self.clientX>cx)||(rotate==90 && videoInfo.self.clientY>cy)||(rotate==180 && videoInfo.self.clientX<cx)||(rotate==270 && videoInfo.self.clientY<cy)){
                    isfastwinds=true;
                }
                ele.currentTime+=isfastwinds?fastwinds:-fastwinds;
                showMsg(String.fromCodePoint(isfastwinds?'0x23E9':'0x23EA')+fastwinds+'s');
            }
            videoInfo.x=allElements.floatElement.offsetLeft-videoInfo.self.clientX;
            videoInfo.y=allElements.floatElement.offsetTop-videoInfo.self.clientY;
            if(etype=='touchstart'){
                //videoInfo.startTouchFingers=e.touches.length;
                ele.addEventListener("touchend",videoEvent,true);
                ele.addEventListener("touchmove",videoEvent,true);
            }else{
                ele.addEventListener("mouseup",videoEvent,true);
                ele.addEventListener("mousemove",videoEvent,true);
            }
        }else if(etype=='touchmove' || etype=='mousemove'){
            if(onLongPress!=null){
                clearTimeout(onLongPress);
                onLongPress=null;
                ele.playbackRate=videoInfo.originalPlaybackRate;
                //showMsg(ele.playbackRate+'倍速播放');
            }
            if (doubleTouchT != null){
                clearTimeout(doubleTouchT);
                doubleTouchT = null;
            }
            //showSettings(e);
            if(!isIframe){
                screenPosition='mousemove';
                screenSizeChange=0;
                videoInfo.self=etype=='touchmove'?self.touches[0]:self;
                allElements.floatElement.style.left=videoInfo.x+videoInfo.self.clientX+'px';
                allElements.floatElement.style.top=videoInfo.y+videoInfo.self.clientY+'px';
                setSettings('controls');
                setMsg();
            }
        }else if(etype=='touchend' || etype=='mouseup' || etype=='mouseleave'){
            if(onLongPress!=null){
                clearTimeout(onLongPress);
                onLongPress=null;
                ele.playbackRate=videoInfo.originalPlaybackRate;
                //showMsg(ele.playbackRate+'倍速播放');
            }
            videoInfo.self=null;
            videoInfo.x=null;
            videoInfo.y=null;
            if(etype=='touchend'){
                ele.removeEventListener("touchmove",videoEvent,true);
                ele.removeEventListener("touchend",videoEvent,true);
            }else{
                ele.removeEventListener("mousemove",videoEvent,true);
                ele.removeEventListener("mouseup",videoEvent,true);
                if(etype=='mouseleave'){
                    ele.removeEventListener("mouseleave",videoEvent,true);
                }
            }
            fixedscroll('leave');
        }
    }

    // Your code here...
})();