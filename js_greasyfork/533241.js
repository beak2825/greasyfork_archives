// ==UserScript==
// @name         syl_yt_dlp
// @namespace    syl
// @version      1.0.0
// @description  send url to yt_dlp
// @author       syl
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.0/jszip.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.js
// @match        http*://hanime1.me/*
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_openInTab
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533241/syl_yt_dlp.user.js
// @updateURL https://update.greasyfork.org/scripts/533241/syl_yt_dlp.meta.js
// ==/UserScript==

function display_str(str_1){
    $("body").append(" <div id='flowwindow' style='right: 10px;top: 50px;background: #EEEEEE;color:#000000;overflow: auto;z-index: 9999;position: fixed;padding:5px;text-align:left;width: auto;min-width:300px;max-width:800px;height:auto;max-height:400px;scrollbars=yes;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;'>"+str_1+"</div>");
    //$("body").append(" <div id='flowwindow' style='right: 10px;top: 50px;background: #EEEEEE;color:#000000;overflow: auto;z-index: 9999;position: fixed;padding:5px;text-align:left;width: auto;min-width:200px;max-width:700px;height:auto;min-height:600px;scrollbars=yes;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;'>"+str_1+"</div>");
    function set_minsize(){
        var oDiv = document.getElementById("flowwindow");
        const width_orgin=document.documentElement.clientWidth
        var count=0
        //console.log(width_orgin)
        oDiv.ondblclick = function(){
        //oDiv.style.width = "auto";
            if(count==0){
              oDiv.style.height ="50px";
              count++
            }
            else{
              oDiv.style.height =width_orgin+"px";
              count--
            }
        }
    }
    set_minsize()
}

async function add_download_btn(){
    // var txtelement = `<input type="text" value="发送Url到ytp" id="title_ex" style="width:400px"><br />`
    // const root = document.querySelector('#flowwindow')
    // root.insertAdjacentHTML("afterbegin",txtelement)
    // document.querySelector('#title_ex').value="发送Url到ytp"

    var btnelement = `<br /><a id="SendUrlBtn" class="btn" style="width:100px;height:30px;border:2px solid red;background-color:green;color:black;margin-right: 10px" >发送URL</ a>`;
    const root = document.querySelector('#flowwindow')
    root.insertAdjacentHTML("afterbegin",btnelement)
    document.querySelector("#SendUrlBtn").innerHTML="发送URL"

    var btnelement_=document.querySelector("#SendUrlBtn")
    btnelement_.addEventListener('click', send_url_by_websocket);
}

function get_info(){
    var website=window.location.href//https://hanime1.me/watch?v=101445
    var id_pattern=/^.*\/watch\?v=(\d+)$/g
    var id=website.replace(id_pattern,"$1")
    var video_url_eles=document.querySelectorAll("#player > source")
    var max_video_size_index=0
    var max_video_size=0
    var eles_len=video_url_eles.length
    for(let i=0;i<eles_len;i++){
        var video_size=parseInt(video_url_eles[i].getAttribute("size"))
        if (video_size>max_video_size){
            max_video_size=video_size
            max_video_size_index=i
        }
    }
    var video_url=video_url_eles[max_video_size_index].src
//    var video_url=document.querySelector("#player > source:nth-child(1)").src
    var title=document.querySelector("#shareBtn-title").innerText
    var series_name=document.querySelector("#video-playlist-wrapper > div.single-icon-wrapper.video-playlist-top > h4:nth-child(1)").innerText
    var cover_url=document.querySelector("#player").getAttribute('data-poster')
    var story=document.querySelector("#player-div-wrapper > div.video-details-wrapper > div > div.video-caption-text.caption-ellipsis").innerText
    var tag_eles=document.querySelectorAll("#player-div-wrapper > div.video-details-wrapper.video-tags-wrapper > div.single-video-tag> a")
    var tag_list=[]
    tag_eles.forEach(element => {
        tag_list.push(element.innerText)
    });
    var maker=document.querySelector("#video-artist-name").innerText
    var releasedate=document.querySelector("#player-div-wrapper > div.video-details-wrapper.hidden-sm.hidden-md.hidden-lg.hidden-xl").innerText
    var data_pattern=/^.*?(\d{4}-\d{2}-\d{2})$/g
    var releasedate_str=releasedate.replace(data_pattern,"$1")
    var year=releasedate_str.slice(0,4)
    var category=document.querySelector("#player-div-wrapper > div.video-details-wrapper.desktop-inline-mobile-block > div:nth-child(1) > div > div.hidden-xs > a").innerText.trim()

//    console.log(window.location.href)
//    console.log(src)
//    console.log(name)
//    console.log(set_str)
//    console.log(cover_url_str)
//    console.log(story_str)
//    console.log(maker)
//    console.log(releasedate)//觀看次數：313.5萬次  2022-08-05
    const json_data = {
        "website":website,
        "video_url":video_url,
        "title":title,
        "series_name":series_name,
        "cover_url":cover_url,
        "story":story,
        "tag_list":tag_list,
        "maker":maker,
        "releasedate":releasedate_str,
        "year":year,
        "category":category,
        "id":id,
        }
    const jsonString = JSON.stringify(json_data);
    return jsonString
}

async function send_url_by_websocket(event){
    event.preventDefault();

    const btn = document.querySelector('#SendUrlBtn');
    const url=btn.href


    var socket;
    var ws = new WebSocket("ws://127.0.0.1:38888/test");
    socket = ws;
    function send_url(url) {
        socket.send(url);
    }
    ws.onopen = function() {
        console.log('连接成功');
//        var ele1=document.querySelector("#player > source:nth-child(1)")
//        var src=ele1.src
//        var ele2=document.querySelector("#shareBtn-title")
//        var name=ele2.innerText
//        var ele_set=document.querySelector("#video-playlist-wrapper > div.single-icon-wrapper.video-playlist-top > h4:nth-child(1)")
//        var set_str=ele_set.innerText
//        console.log(src)
//        console.log(name)
//        console.log(set_str)
//        send_url("download")
//        send_url(window.location.href)
//        send_url(src)
//        send_url(name)
        var jsonString=get_info()
        send_url(jsonString)
    };

    ws.onmessage = function(evt) {
        var received_msg = evt.data;
        console.log('recv:' + received_msg + ' 发送完成');
        btn.innerHTML=received_msg
        setTimeout(() => btn.innerHTML="发送Url", 500)
        ws.close()
    };

    ws.onclose = function() {
        var s = '断开了连接'
        console.log(s)
    };
}
async function Run() {
    display_str("发送URL到Ytp");
    await add_download_btn();
}
Run();