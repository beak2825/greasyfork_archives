// ==UserScript==
// @name         Viu一下
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  黄VIU视频下载
// @author       cw2012
// @match        https://www.viu.com/*/vod/*
// @icon         https://www.viu.com/ott/hk/v1/images/web_loading_icon.gif
// @connect      audience-pccw.viu.com
// @connect      www.viu.com
// @connect      dfp6rglgjqszk.cloudfront.net
// @connect      d1k2us671qcoau.cloudfront.net
// @connect      stream-hk.viu.com
// @require      https://cdn.jsdelivr.net/npm/toastify-js
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/431615/Viu%E4%B8%80%E4%B8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/431615/Viu%E4%B8%80%E4%B8%8B.meta.js
// ==/UserScript==

function Toast(msg,duration){
    duration=isNaN(duration)?3000:duration;
    if(typeof Toastify!='undefined'){
        Toastify({
            text: msg,
            duration: duration,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
            stopOnFocus: true, // Prevents dismissing of toast on hover
            onClick: function(){} // Callback after click
        }).showToast();
        return;
    }
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText="max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 5%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(255, 191, 0,.7);font-size: 16px;";
    document.body.appendChild(m);
    setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
    }, duration);
}

function exist(obj){
    if(typeof obj == 'undefined'){
        return false;
    }
    return !!obj;
}

(function() {
    'use strict';

    // https://www.viu.com/ott/hk/zh-hk/vod/348410/%E6%9C%88%E5%8D%87%E4%B9%8B%E6%B1%9F
    const epId = location.href.split('/')[7];
    let epList=[],duration=0;
    init();
    getInfo4Series();
    function init(){
        GM_addStyle(`
        .epList{
         background-color:#ffbf00;
         border-radius:10px;
         padding:15px;
         position:fixed;
         top:50%;
         left:15px;
         display:flex;
         flex-flow:row wrap;
         justify-content: flex-start;
         max-width:230px;
         max-height: 300px;
    overflow-y: auto;
        }
        .epList::-webkit-scrollbar{
        width:4px;
        }
        .epList::-webkit-scrollbar-thumb {
  background-color: #0cb317;
  outline: 1px solid slategrey;
}
        .epList>a{
        display:inline-flex;
        align-items:center;
            justify-content: center;
        min-width:20px;
        line-height:20px;
        margin:4px;
        padding:1px 4px;
        color: white;
        border-bottom: solid 3px #0cb317;
    cursor: pointer;
    background-color: #000;
        }
        .epList>a:hover{
        color:red;}
        .toastify{padding:12px 20px;color:#fff;display:inline-block;box-shadow:0 3px 6px -1px rgba(0,0,0,.12),0 10px 36px -4px rgba(77,96,232,.3);background:-webkit-linear-gradient(315deg,#73a5ff,#5477f5);background:linear-gradient(135deg,#73a5ff,#5477f5);position:fixed;opacity:0;transition:all .4s cubic-bezier(.215,.61,.355,1);border-radius:2px;cursor:pointer;text-decoration:none;max-width:calc(50% - 20px);z-index:2147483647}.toastify.on{opacity:1}.toast-close{opacity:.4;padding:0 5px}.toastify-right{right:15px}.toastify-left{left:15px}.toastify-top{top:-150px}.toastify-bottom{bottom:-150px}.toastify-rounded{border-radius:25px}.toastify-avatar{width:1.5em;height:1.5em;margin:-7px 5px;border-radius:2px}.toastify-center{margin-left:auto;margin-right:auto;left:0;right:0;max-width:fit-content;max-width:-moz-fit-content}@media only screen and (max-width:360px){.toastify-left,.toastify-right{margin-left:auto;margin-right:auto;left:0;right:0;max-width:fit-content}}
        `);
    }
    // 获取字幕和集数
    function getInfo4Series(){
        // 使用免费用户的账号即可
        const ga_userType = "Free";
        const ut_param = "1";
        // /ott/hk/index.php?area_id=1&language_flag_id=1&r=vod/ajax-detail&platform_flag_label=web&area_id=1&language_flag_id=1&product_id=341978&ut=1
        let url = `/ott/hk/index.php?area_id=1&language_flag_id=1&r=vod/ajax-detail&platform_flag_label=web&area_id=1&language_flag_id=1&product_id=${epId}&ut=1`;
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            success: function(json) {
                let list = json.data;
                if(!exist(list.series)){
                    Toast('请求被阻止');
                    return
                }
                list.series.product.forEach((item,index)=>epList[item.number-1]=item);
                let box = document.createElement('div');
                box.className = 'epList';
                epList.forEach((item,index)=>{
                    let a = document.createElement('a');
                    a.text = index+1;
                    a.addEventListener('click',aClicked);
                    box.append(a);
                });
                document.body.append(box);
            }
        });
    }

    function aClicked(e){
        let index = e.target.innerText - 1;
        downloadEp(index);
    }

    function downloadEp(index){
        Toast('正在分析数据')
        const ep = epList[index];
        let url = `/ott/hk/index.php?area_id=1&language_flag_id=1&r=vod/ajax-detail&platform_flag_label=web&area_id=1&language_flag_id=1&product_id=${ep.product_id}&ut=1`;
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            success: function(json) {
                let details = json.data;
                details = details.current_product;
                let subtitle,secondSubtitle;
                // 字幕
                details.subtitle.forEach(item=>{
                    if(item.name=='繁體中文'){
                        subtitle = item.url;
                        secondSubtitle = item.second_subtitle_url;
                        Toast('开始下载字幕');
                        downloadSubtitle(subtitle,secondSubtitle,index);
                    }
                });
                // 视频流
                let[free_time, is_free_premium_time,premium_time,content_user_level] = [ep.free_time, ep.is_free_premium_time,ep.premium_time,ep.user_level],
                    currentTime = Math.floor(Date.now()/1000),
                    isBlocked=false,
                    timeDiff=0,
                    extra_params='';
                if(free_time > currentTime || (is_free_premium_time == "1" && premium_time < currentTime)){
                    timeDiff = (free_time - Date.now()/1000);
                    if (timeDiff > 0){
                        isBlocked = true;
                        if (Cookies.get('operators') && Cookies.get('operators') != "null"){ // VIP member
                            isBlocked = false;
                        }
                    }
                }
                if (isBlocked){
                    extra_params = "&duration="+ 180+"&duration_start="+0;
                }else{
                    if(content_user_level == "3" || timeDiff > 0){
                        extra_params = "&identity="+Cookies.get("identity");
                    }
                }
                // https://d1k2us671qcoau.cloudfront.net/distribute_web_hk.php?ccs_product_id=df4589877af2704fb83eb077c0b7a9c4&language_flag_id=1&duration=180&duration_start=0
                let url=`https://d1k2us671qcoau.cloudfront.net/distribute_web_hk.php?ccs_product_id=${details.ccs_product_id}&language_flag_id=1${extra_params}`
                duration = parseInt(details.time_duration);
                downloadM3u8(url,index);
            }
        });
    }

    function downloadSubtitle(subtitle,secondSubtitle,index){
        index++;
        if(secondSubtitle){
            GM_download({
                url:secondSubtitle,
                name:(index<10?'0':'')+index+'-注释.srt',
                ontimeout :e=>Toast('注释字幕下载超时')
            })
        }
        GM_download({
            url:subtitle,
            name:(index<10?'0':'')+index+'.srt',
            ontimeout :e=>Toast('字幕下载超时')
        })
    }
    function downloadM3u8(url,index){
        index++;
        let name = (index<10?'0':'')+index+'.m3u8';
        GM_xmlhttpRequest({
            url:url,
            method :'get',
            responseType :'json',
            onload:res=>{
                res = res.response
                if(res.status.code!=0){
                    Toast('m3u8文件下载失败，请重试')
                    return
                }
                res = res.data.stream.url
                let resource=480,reg=/[\d]+/;
                for(let item in res){
                    let tmp= parseInt(item.match(reg)[0]);
                    if(tmp>resource){
                        resource = tmp;
                        url = res[item]
                    }
                }
                if(url.indexOf('duration_start')==-1){
                    GM_xmlhttpRequest({
                        url:url,
                        method :'get',
                        responseType :'json',
                        onload:res=>{
                            res = res.responseText;
                            let tmp = url.split('/')[7];
                            url = url.substr(0, url.indexOf(tmp));
                            downloadFreeM3u8(res, name,url);
                        }
                    });
                }else{
                    downloadVipM3u8(url,name);
                }
            }
        })
    }
    // https://stream-hk.viu.com/s/a1IGpCtu7Naro5UEoNOocg/1621007279/UD/561c233be5d000de34f0a8136e8a5481/561c233be5d000de34f0a8136e8a5481_Layer3_vod.m3u8
    // https://stream-hk.viu.com/s/a1IGpCtu7Naro5UEoNOocg/1621007279/UD/
    // 561c233be5d000de34f0a8136e8a5481/561c233be5d000de34f0a8136e8a5481_Layer3/Period1/live_00000003.ts
    function downloadFreeM3u8(str,name,url){
        const reg = /#EXTINF:[\d.]+,\n/g;
        let tmp = str.split(reg);
        str = tmp[0];
        let tsName = tmp[1];
        let vid = tsName.split('_')[0];
        let index= tsName.lastIndexOf('/');
        let preStr = tsName.substr(0,index);
        let afStr=tsName.substr(index+1).split('.')[0];
        let str2=afStr.split('_');
        if(tsName.indexOf('http')!=-1){
            for(let i=0;i<tmp.length-1;i++){
                str+=`#EXTINF:10.000000,\n${preStr}/${str2[0]}_${i.toString().padStart(str2[1].length,'0')}.ts\n`
            }
        }else{
            for(let i=0;i<tmp.length-1;i++){
                str+=`#EXTINF:10.000000,\n${url}${vid}/${preStr}/${str2[0]}_${i.toString().padStart(str2[1].length,'0')}.ts\n`
            }
        }
        str += '\n#EXT-X-ENDLIST';
        downloadTxt(str,name);
    }
    function downloadVipM3u8(url,name){
        GM_xmlhttpRequest({
            url:url,
            method :'get',
            responseType :'json',
            onload:res=>{
                res = res.responseText;
                const reg = /#EXTINF:[\d.]+,\n/g
                let tmp = res.split(reg);
                let str = tmp[0];
                tmp = tmp[1];
                let index= tmp.lastIndexOf('/');
                let preStr = tmp.substr(0,index);
                let afStr=tmp.substr(index+1).split('.')[0];
                let str2=afStr.split('_');
                for(let i=0;i<duration/10;i++){
                    str +=`#EXTINF:10.000000,\n${preStr}/${str2[0]}_${i.toString().padStart(str2[1].length,'0')}.ts\n`;
                }
                str += '\n#EXT-X-ENDLIST';
                downloadTxt(str,name);
            }
        })
    }
    function downloadTxt(text, fileName){
        let element = document.createElement('a')
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
        element.setAttribute('download', fileName)
        element.style.display = 'none'
        element.click()
    }
})();