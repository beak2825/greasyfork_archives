// ==UserScript==
// @name         Bus Video
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Bus Video For Me
// @author       Opeee
// @include      *://*javbus.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javbus.com
// @license      MIT

// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/449667/Bus%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/449667/Bus%20Video.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clog(e){
        console.log(e);
    }

    function request(url , referrerStr, timeoutInt) {
        return new Promise((resolve,reject) => {
            console.log(`[BV] request：${url}`);
            GM_xmlhttpRequest({
                url,
                method: 'GET',
                headers:  {
                    "Cache-Control": "no-cache",
                    referrer: referrerStr
                },
                timeout: timeoutInt > 0 ? timeoutInt : 20000,
                onload: response => {
                    //console.log(url + " reqTime:" + (new Date() - time1));
                    response.loadstuts = true;
                    resolve(response);
                },
                onabort: response =>{
                    //console.log(url + " abort");
                    response.loadstuts = false;
                    resolve(response);
                },
                onerror: response =>{
                    //console.log(url + " error");
                    //console.log(response);
                    response.loadstuts = false;
                    resolve(response);
                },
                ontimeout: response =>{
                    //console.log(`${url} ${timeoutInt}ms timeout`);
                    response.loadstuts = false;
                    response.finalUrl = url;
                    resolve(response);
                },
            });
        });
    }


    function parsetext(text) {
        try {
            let doc = document.implementation.createHTMLDocument('');
            doc.documentElement.innerHTML = text;
            return doc;
        }
        catch (e) {
            alert('parse error');
        }
    }


    let avid = '';
    function init(){
        avid = $('.info .header')[0].nextElementSibling.textContent;
        console.log('[BV] avid ',avid);

        $('.row.movie').after(`
        <div id="video-dmm">
          <div class="video-box"></div>
          <div class="video-list">Loading List</div>
        </div>`);

        GM_addStyle(`
           #video-dmm{padding:15px!important;background:#000;color:#fff;}
           #video-dmm .video-box{display:none;}
           #video-dmm .video-box video{width:100%;}
           #video-dmm .video-box .control{margin-bottom:10px;}
           #video-dmm .video-box .control button.mr10{margin-right:10px;}
           #video-dmm .video-list{}
           #video-dmm .item{display:inline-block;padding:0 5px 5px 0;}
           #video-dmm .item img{display:block;width:90px;}
           #video-dmm .item span{display:block;width:90px;line-height:22px;overflow:hidden;font-size:10px;background:#FEBE00;padding:0 5px;color:#000;}
        `);
    }

    function getVideoList(){
        let promise1 = request('https://www.dmm.co.jp/mono/dvd/-/search/=/searchstr=' + avid+ "/",15000);
        return promise1.then((result) => {
            if (!result.loadstuts) return ;
            let doc = parsetext(result.responseText);
            // 查找包含avid番号的a标签数组,忽略大小写
            let arr = $(doc).find(`#list .tmb a`);

            console.log('[BV] getVideoList',arr);

            if(arr.length>0){
                $('.video-list').html('');
            }
            for (let i = 0; i < arr.length; i++) {
                let uparams = arr[i].href.split('/');
                let cid = uparams.find( x => x.indexOf('cid=')==0 );
                cid=cid.replace('cid=','');
                console.log('[BV] cid',cid);
                let img = $(parsetext(arr[i].innerHTML)).find('img').attr('src');

                $('.video-list').append( `<div class="item" data-cid="${cid}" >
                  <img src="${img}" />
                  <span title="DMM:${cid}">D:${cid}</span>
                </div>`)
            }

            $('.video-list .item').bind('click',(e)=>{
                addVideo(e.currentTarget.dataset.cid)
            })


        });

    }

    function addVideo(cid){
        console.log('[BV] addVideo',cid);
        $('.video-box').html('');

        let url =`https://www.dmm.co.jp/service/digitalapi/-/html5_player/=/cid=${cid}/mtype=AhRVShI_/service=mono/floor=dvd/mode=/`

        let promise1 = request(url,15000);
        return promise1.then((result) => {
            if (!result.loadstuts) return ;
            let doc = parsetext(result.responseText);
            let script = $(doc).find(`#dmmplayer`)[0].nextElementSibling.textContent;
            let params = script.match(/const args =(.*?);/);
            params = JSON.parse(params[1]);
            console.log('[BV] vUrl', params.src);
            let _video = document.createElement("video");
            _video.id='video_player';
            _video.controls='controls';
            _video.autoplay='autoplay';
            _video.volume=0.3;
            _video.muted = GM_getValue('muted',true);
            _video.src = params.src;

            let mutedIcon = _video.muted?'🔇':'🔊';

            $('.video-box').append(_video).show();
            $('.video-box').append(`<div class="btn-toolbar control">
              <div class="btn-group btn-group-sm">
                <div class="btn btn-default play mr10">▶️ 播放</div>
              </div>
              <div class="btn-group btn-group-sm">
                <div class="btn btn-default mute mr10">${mutedIcon}</div>
              </div>
              <div class="btn-group btn-group-sm">
                <div class="btn btn-default t1"> -5s </div>
                <div class="btn btn-default t2 mr10"> +5s </div>
              </div>
              <div class="btn-group btn-group-sm">
                <div class="btn btn-default x5"> x0.5 </div>
                <div class="btn btn-default x10"> x1 </div>
                <div class="btn btn-default x20 mr10"> x2 </div>
              </div>
              <div class="btn-group btn-group-sm">
                <div class="btn btn-default reset">❌ 关闭</div>
              </div>
            </div>`);

            $('.video-box .control .mute').bind('click',()=>{
                let state = _video.muted;
                GM_setValue('muted',!state);
                _video.muted=!state;
                if(state){
                    $('.video-box .control .mute').html('🔊');
                }else{
                    $('.video-box .control .mute').html('🔇');
                }
            });

            $('.video-box .control .play').bind('click',()=>{
                let state = _video.paused;
                if(state){
                    _video.play();
                    $('.video-box .control .play').html('⏸️ 停止');
                }else{
                    _video.pause();
                    $('.video-box .control .play').html('▶️ 播放');
                }
            });

            $('.video-box .control .t1').bind('click',()=>{
                _video.currentTime -=5;
            });

            $('.video-box .control .t2').bind('click',()=>{
                _video.currentTime +=5;
            });

            $('.video-box .control .x5').bind('click',()=>{
                _video.playbackRate=0.5;
            });

            $('.video-box .control .x10').bind('click',()=>{
                _video.playbackRate=1;
            });

            $('.video-box .control .x20').bind('click',()=>{
                _video.playbackRate=2;
            });

            $('.video-box .control .reset').bind('click',()=>{
                $('.video-box').hide().html('');
            });

        });
    }


    function main(){
        console.log('[BV] Running');
        init();
        getVideoList();
    }


    if($('.info .header')[0]){
        setTimeout(function(){
            main();
        },500)
    }

})();