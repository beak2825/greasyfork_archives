// ==UserScript==
// @name         新传媒下载
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  toggle video
// @author       cw2012
// @match        https://www.mewatch.sg/season/*
// @match        https://www.mewatch.sg/show/*
// @icon         https://static.mewatch.sg/favicon.png
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_setClipboard
// @connect      kaltura.com
// @connect      mewatch.sg
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/382346/%E6%96%B0%E4%BC%A0%E5%AA%92%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/382346/%E6%96%B0%E4%BC%A0%E5%AA%92%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    init();
    let seasonId = location.href.split('/')[4].split('-')
    seasonId = seasonId[seasonId.length - 1];

    GM_xmlhttpRequest({
        url:`https://cdn.mewatch.sg/api/page?ff=idp,ldp,rpt,cd&item_detail_expand=all&item_detail_select_season=first&lang=en&list_page_size=24&max_list_prefetch=3&path=/${location.href.split('/')[3]}/${location.href.split('/')[4]}&segments=all&sub=Anonymous&text_entry_format=html`,
        method:'get',
        onload:res=>{
            res = JSON.parse(res.responseText);
            res = res.item.episodes.items;
            getEposidesAndDownload(res)
        },
        onerror: err=>{
            console.log(err)
        }
    })
    let episodeList = []
    function getEposidesAndDownload(res){
        if(res.length){
            res.forEach((item,index)=>{
                episodeList[index] = {
                    id:item.customId ,
                    num:item.episodeNumber ,
                    subtitle:item.hasClosedCaptions ,
                    free:item.badge ?(item.badge === 'premium'):true
                }
            });
            let box = document.createElement('div');
            box.className = 'epList';
            episodeList.forEach((item,index)=>{
                let a = document.createElement('a');
                a.text = index+1;
                if(!item.free){
                    a.className = 'premium';
                }
                a.addEventListener('click',aClicked);
                box.append(a);
            })
            document.body.append(box);
        }else{
            Toast('没有获取到集数数据')
        }
    }

    function aClicked(e){
        let index = e.target.innerText - 1;
        getEposideInfoAndDownload(index+1,episodeList[index].id)
    }

    function getEposideInfoAndDownload(index,id){
        let data = {
            "1":{
                "service":"ottuser",
                "action":"anonymousLogin",
                "partnerId":"147"
            },
            "2":{
                "service":"asset",
                "action":"get",
                "id":id,
                "assetReferenceType":"media",
                "ks":"{1:result:ks}"
            },
            "3":{
                "service":"asset",
                "action":"getPlaybackContext",
                "assetId":id,
                "assetType":"media",
                "contextDataParams":{
                    "objectType":"KalturaPlaybackContextOptions",
                    "context":"PLAYBACK"
                },
                "ks":"{1:result:ks}"
            },
            "apiVersion":"5.2.6",
            "partnerId":"147"
        };
        GM_xmlhttpRequest({
            url:'https://rest-as.ott.kaltura.com/api_v3/service/multirequest',
            method:'post',
            headers:  {"Content-Type": "application/json"},
            data:JSON.stringify (data),
            onload:res=>{
                res = JSON.parse(res.responseText);
                if(res.result && !res.result.error && res.result.length){
                    res = res.result;
                    let videoUrl;
                    res.forEach((item)=>{
                        if(item.sources){
                            const sources = item.sources;
                            if(!sources.length){
                                Toast('无法获取第'+(index)+'集视频资源，可能是付费视频');
                                return;
                            }
                            sources.forEach(source=>{
                                if(source.type.endsWith('Clear') &&(source.drm.length === 0) && source.type.startsWith('DASH')){
                                    videoUrl = source.url
                                }
                            })
                        }
                    });
                    if(videoUrl){
                        GM_setClipboard(videoUrl);
                        Toast(`第${index}集地址已复制到剪切板`)
                    }else{
                        Toast(`第${index}集是加密内容`)
                    }
                }else{
                    Toast('获取分集信息失败');
                }
            }
        });
    }

    function init(){
        GM_addStyle(`
        .epList{
         background-color:#ffbf00;
         border-radius:10px;
         padding:15px;
         position:fixed;
         top:50%;
         right:15px;
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
        .epList>a.premium{
        background-color:#a5238c;
        }
        .epList>a:hover{
        color:red;}
        .toastify{padding:12px 20px;color:#fff;display:inline-block;box-shadow:0 3px 6px -1px rgba(0,0,0,.12),0 10px 36px -4px rgba(77,96,232,.3);background:-webkit-linear-gradient(315deg,#73a5ff,#5477f5);background:linear-gradient(135deg,#73a5ff,#5477f5);position:fixed;opacity:0;transition:all .4s cubic-bezier(.215,.61,.355,1);border-radius:2px;cursor:pointer;text-decoration:none;max-width:calc(50% - 20px);z-index:2147483647}.toastify.on{opacity:1}.toast-close{opacity:.4;padding:0 5px}.toastify-right{right:15px}.toastify-left{left:15px}.toastify-top{top:-150px}.toastify-bottom{bottom:-150px}.toastify-rounded{border-radius:25px}.toastify-avatar{width:1.5em;height:1.5em;margin:-7px 5px;border-radius:2px}.toastify-center{margin-left:auto;margin-right:auto;left:0;right:0;max-width:fit-content;max-width:-moz-fit-content}@media only screen and (max-width:360px){.toastify-left,.toastify-right{margin-left:auto;margin-right:auto;left:0;right:0;max-width:fit-content}}
        `);
    }
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
})();