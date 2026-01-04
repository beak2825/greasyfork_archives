// ==UserScript==
// @name         Viu More
// @namespace    http://tampermonkey.net/
// @version      0.4.4.1
// @description  显示已过期的集数，尝试提供下载功能
// @author       cw2012
// @match        https://viu.tv/encore/*
// @icon         https://www.viu.com/ott/hk/v1/images/web_loading_icon.gif
// @require      https://cdn.jsdelivr.net/npm/toastify-js@1.12.0
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_setClipboard
// @connect      viu.tv
// @connect      api.viu.now.com
// @connect      now.com
// @connect      nowe.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/430324/Viu%20More.user.js
// @updateURL https://update.greasyfork.org/scripts/430324/Viu%20More.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let totalCount, isAsc, seasonTitle, subtitles=[],clips = [];

    let seasonName;
    const cookie = 'b13b2e6a06a230f8b2'; // f7da2aac5e3df01adc
    const msgBox = document.createElement('div');
    addStyle();
    init();

    function init(){
        const btn = document.createElement('div');
        btn.innerText = '解 析';
        btn.className = 'floating-btn';
        btn.addEventListener('click', ev=>{
            getSeasonEposideList();
        });
        setTimeout(()=>{
            msgBox.id = 'msg-box';
            document.querySelector('#js-nav-header').append(msgBox);
            document.querySelector('.min-h-\\[52px\\].flex.gap-x-4.px-4').append(btn);
        }, 3000);
    }

    function getSeasonEposideList(){
        seasonName = location.href.split('/')[4];
        subtitles=[];
        if(typeof document.querySelector('.min-h-\\[52px\\].flex.gap-x-4.px-4') == "undefined"){
            showMsg('请在页面加载完成后重试',0);
            return;
        }
        GM_xmlhttpRequest({
            method:'GET',
            url: `https://api.viu.tv/production/programmes/${seasonName}`,
            responseType: 'json',
            onerror:e=>{showMsg(`请求发生错误：${e}`,0)},
            onload:res=>{
                res = res.response.programme;
                totalCount = res.programmeMeta.totalEpisodeNo;
                seasonTitle = res.programmeMeta.seriesTitle;
                // 预告片
                if(res.clips.length > 0 && res.episodes.length === 0){
                    for(let item of res.clips){
                        clips.push({
                            productId: item.productId,
                            episodeNum:seasonTitle,
                            episodeNameU3: '预告片',
                            productSubtitle: ''
                        });
                    }
                    updateUiEpisodeList(clips);
                }
                else if(totalCount !== res.episodes.length){
                    // 只显示一集，说明是最后一集
                    // 这里一定是总集数和显示集数不一致才会被调用的
                    if(res.episodes.length > 1){
                        isAsc = res.episodes[0].episodeNum < res.episodes[1].episodeNum;
                    }else{
                        isAsc = false;
                    }
                    setTimeout(()=>{
                        updateUiEpisodeList(res.episodes);
                        showOutdatedEpisodeList(res.episodes);}
                               , 1000);
                }else{
                    setTimeout(()=>updateUiEpisodeList(res.episodes), 2000);
                }
            }
        });
    }

    function updateUiEpisodeList(list){
        // 先操作已显示的列表
        const listBox = document.querySelector('.overflow-y-scroll.h-full');
        const shownEpisode = listBox.querySelectorAll('.items-center>.w-full');
        shownEpisode.forEach((item, index)=>{
            let div = document.createElement('div');
            div.className = 'floating-div';
            div.innerText = '复制MPD';
            div.addEventListener('click', ev=>{
                window.event? window.event.cancelBubble = true : ev.stopPropagation();
                const productId = list[index].productId;
                if(list[index].onAirStartDate >= 1705852800000)
                    getSubtitleWithProductId(productId, list[index].episodeNum + ' ' + list[index].episodeNameU3, null);
                else
                    getSubtitleWithProductId(productId, list[index].episodeNum + ' ' + list[index].episodeNameU3, list[index].productSubtitle);
            });
            item.append(div);
        });

        setTimeout(()=>{
            const li = document.createElement('span');
            li.innerText = `共${totalCount}集`;
            li.className = 'react-tabs__tab-list';
            document.querySelector('.min-h-\\[52px\\].flex.gap-x-4.px-4').append(li);
        },500);
    }

    function showOutdatedEpisodeList(list){
        const listBox = document.querySelector('.overflow-y-scroll.h-full');
        // 添加因过期而未能显示的列表
        let len2add, firstProductId,firstEpisodeNum;
        // 正片
        if(isAsc){
            len2add = list[0].episodeNum>15?15:(list[0].episodeNum-1);
            firstProductId = parseInt(list[0].productId);
            firstEpisodeNum = list[0].episodeNum;
            let prevDiv;
            for(let i=0;i<len2add;i++){
                const div = createOutdateEpisode(firstProductId-(i+1), firstEpisodeNum - (i+1), list[0].productSubtitle);
                if(i==0){
                    listBox.insertBefore(div, listBox.firstChild);
                    prevDiv = div;
                }else{
                    listBox.insertBefore(div, prevDiv);
                    prevDiv = div;
                }
            }
        }else{
            if(list.length === 0) {
                return;
            }
            len2add = list[list.length-1].episodeNum>15?15:(list[list.length -1].episodeNum-1);
            firstProductId = parseInt(list[list.length-1].productId);
            firstEpisodeNum = list[list.length-1].episodeNum;
            for(let i=0;i<len2add;i++){
                let div = createOutdateEpisode(firstProductId-(i+1), firstEpisodeNum - (i+1), list[0].productSubtitle);
                listBox.append(div);
            }
        }
    }

    function createOutdateEpisode(id, num, subtitleList){
        let div = document.createElement('div');
        div.className = 'VideoItem outdated_episode'; //
        div.innerText =`下载第${sn(num,2)}集字幕并复制MPD文件的url`;
        div.addEventListener('click',ev=>{
            ev.stopPropagation();
            getSubtitleWithProductId(id, num, subtitleList);
        });
        return div;
    }

    function getSubtitleWithProductId(id, episodeNum, subtitleList){
        GM_xmlhttpRequest({
            method:'POST',
            url: 'https://api.viu.now.com/p8/3/getVodURL',
            headers: {
                'accept':'*/*',
                'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'},
            data: JSON.stringify({"callerReferenceNo":getTimeStamp(new Date()),"productId":id,"contentId":id,
                                  "contentType":"Vod","mode":"prod","deviceType":"ANDROID_WEB"}),
            onerror:e=>{
                showMsg('获取字幕时出错：'+e,0)
            },
            onload:res=>{
                res = JSON.parse(res.responseText);
                switch(res.responseCode){
                    case "MISSING_INPUT":
                        showMsg('输入的参数不对',0);
                        break;
                    case "GEO_CHECK_FAIL":
                        showMsg('IP不是香港的',0);
                        break;
                    case "INTERNAL_ERROR":
                        showMsg("发生错误，该视频可能已经永久下架了",0);
                        break;
                    case "SUCCESS":
                        var videoUrl = res.asset[0];
                        var m3u8Index = videoUrl.indexOf('.m3u8');
                        GM_setClipboard(`N_m3u8DL-RE.exe -mt --use-shaka-packager --tmp-dir "Downloads" --mux-after-done "format=mp4" --save-name "${episodeNum}" "${videoUrl}"`);
                        showMsg(`${m3u8Index > -1?'m3u8':'MPD'}文件的url已复制成功`,1);
                        if(subtitleList){
                            subtitleList = subtitleList.split(',');
                            subtitles=[];
                            subtitleList.forEach(item=>{
                                if(item == 'Chinese'){
                                    subtitles.push('TRD');
                                }else if(item == 'English'){
                                    subtitles.push('GBR');
                                }
                            });
                            downloadSubtitles(id,episodeNum, videoUrl, m3u8Index);
                        }
                        break;
                }
            },
            ontimeout:e=>showMsg('呵呵，超时了',0)
        });
    }

    function getTimeStamp(date){
        const timeZone = date.getTimezoneOffset() / 60;
        date.setTime(date.getTime() - timeZone * 3600 * 1000);
        return date.toISOString().replaceAll(/[-T:Z.]/g,'').substr(0,14);
    }

    const langName = {TRD:"zh", GBR:"en"};
    function downloadSubtitles(id,episodeNum, videoUrl, m3u8Index){
        GM_xmlhttpRequest({
            method:'GET',
            url:videoUrl,
            onload:()=>{
                subtitles.forEach(item=>{
                    const url = m3u8Index > -1? videoUrl.substr(0,m3u8Index) + `-${item}.srt`:`https://static.viu.tv/subtitle/${id}/${id}-${item}.srt`;
                    GM_download({
                        url: url,
                        headers:{origin:'https://viu.tv',referer:'https://viu.tv/'},
                        name:`${sn(episodeNum,2)}.${langName[item]}.srt`,
                        onerror:e=>showMsg(`${sn(episodeNum,2)}.${langName[item]}.srt  下载失败\n${url}`,0)
                    })
                });
            }
        });
    }

    function showMsg(msg,type){
        msgBox.innerText = msg;
        msgBox.className=type?'showing':'err';
        setTimeout(()=>{msgBox.className='';},type==0?4000: 2500);
        console.log(msg);
    }

    function sn(num,length){
        return num.toString().padStart(length, '0');
    }

    function addStyle(){
        GM_addStyle(`
        .floating-btn{
        position:fixed;
        background: #0a7deb;
        text-align: center;
        color:white;
        font-size:1.5em;
        cursor: pointer;
        border-radius:10px;
        border:solid #0a7deb 1px;
        padding:6px;
        top:50%;
        right:20px;
        box-shadow:#0a7deb 2px 2px 6px, #0a7deb 6px 6px 19px;
        }
        .floating-div{
        position:relative;
        background: #0a7deb;
        text-align: center;
        color:white;
        cursor: pointer;
        border-radius:5px;
        border:solid #0a7deb 1px;
        padding:1px;
        }
        .VideoItem.undefined:hover .floating-div{
        display:block;
        }
        #msg-box{
        transition:all 0.5s ease-in-out;
        font-size:15px;
        position:fixed;
        right:30px;
        top:10px;
        background: #0a7deb;
        color:white;
        border-radius:7px;
        padding:10px;
        opacity:0;
        box-shadow:#0a7deb 2px 2px 6px, #0a7deb 6px 6px 19px;
        }
        #msg-box.showing{
        opacity:1;
        top:130px;
        }
        #msg-box.err{
        background:red;
        box-shadow:red 2px 2px 6px, red 6px 6px 19px;
        opacity:1;
        top:130px;
        }
        .VideoItem.outdated_episode{
        text-align: center;
        background:#0a7deb;
        border-radius:10px;
        border:solid #0a7deb 1px ;
        padding:6px;
        margin:10px;
        color:white;
            cursor: pointer;
        }
        `);
    }
})();