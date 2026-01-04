// ==UserScript==
// @name        西瓜堂Down-西瓜视频下载工具
// @namespace   Violentmonkey Scripts
// @match       https://www.ixigua.com/*
// @grant       none
// @version     1.0
// @license     MIT
// @author      堂哥哥
// @description 2023/06/23 15:06
// @downloadURL https://update.greasyfork.org/scripts/469452/%E8%A5%BF%E7%93%9C%E5%A0%82Down-%E8%A5%BF%E7%93%9C%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/469452/%E8%A5%BF%E7%93%9C%E5%A0%82Down-%E8%A5%BF%E7%93%9C%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
let isInit = false;

// 初始化
function HTMLInit() {
    // 如果是西瓜视频则加载迅雷的js
    var g = document.createElement('script');
    var s = document.getElementsByTagName('script')[0];
    g.setAttribute("src", "https://open.thunderurl.com/thunder-link.js");
    s.parentNode.insertBefore(g, s);
    isInit = true;
}

var _wr = function(type) {
    var orig = history[type];
    return function() {
        var rv = orig.apply(this, arguments);
        var e = new Event(type);
        e.arguments = arguments;
        window.dispatchEvent(e);
        return rv;
    };
};
history.pushState = _wr('pushState');
// 监听事件history的pushState事件
window.addEventListener('pushState', function(e) {
    console.log("网页地址存在变换")
    xiguaChange();
});




// 迅雷下载
function xunleiDownload(url,name){
    thunderLink.newTask({
        tasks: [{
            name: name, // 指定下载文件名（含扩展名）。【若不填此项，将根据下载 URL 自动获取文件名】
            url: url // 指定下载地址【必填项】
        }]
    });
}
// json转换
var safetyParse = (str) => {
    try {
        return JSON.parse(str);
    } catch (error) {
        return null;
    }
};


var getXiGuaVideoInfo = async () => {
    let data = null;
    try {
        console.log("window.location.href is "+ window.location.href);
        const res = await fetch(window.location.href);
        const str = await res.text();
        // console.log("res is --------------",res)
        // console.log(str)
        data = safetyParse(
            str.match(/window?._SSR_HYDRATED_DATA=([\d\D]+?)<\/script>/)[1].replaceAll("undefined", "null")
        );
        // console.log("data is -----------",data)
        // console.log(data)
    }catch (e){
        console.log(e)
    }
    finally {
        return data;
    }
}

async function handlerVideoData(){
    let downloadOption = [];
    let ids = [];
    const data = await getXiGuaVideoInfo();
    if(data == null){
        return null;
    }
    const videoResource = data?.anyVideo?.gidInformation?.packerData?.video?.videoResource || data?.anyVideo?.gidInformation?.packerData?.videoResource;
    const videoList = Object.values(videoResource?.normal?.video_list ?? {}).sort(
        (a, b) => b?.vheight - a?.vheight
    );
    for (var index in videoList) {
        let video = videoList[index];
        // console.log("video is -------------");
        // console.log(video);

        let url = atob(video.main_url);
        // // 添加点击事件
        let fileName = data.anyVideo.gidInformation.packerData.video.title + "." + video.vtype;
        // 为了保留文件名称，后续下载重新处理
        fileName = fileName.replaceAll(" ", "-空格-");
        let id = "downBtId"+video.definition;
        let downloadData = {id: id,mainUrl: url,videoResolution: video.definition,fileName: fileName}
        ids.push(id);
        downloadOption.push(downloadData)
    }


    let returnData = {
        downloadOption,
        ids
    }
    return returnData;
}

async function createXiguaVideoDownload(){
    let downloadOption = [];
    let handlerDatas = await handlerVideoData();
    if(handlerDatas == null){
        return null;
    }
    downloadOption = handlerDatas.downloadOption;



    let rightGrid = document.querySelector('.xg-right-grid');

    let playControl = rightGrid.querySelector('div:nth-of-type(2)');

    let control = playControl.cloneNode(true);


    let isDownControleId = null;

    try {
        isDownControleId = playControl.querySelector('#downControleId');
    }catch (e){
        console.log(e)
    }


    let entry= control.querySelector('.xgplayer-control-item__entry');

    entry.innerHTML = '<div class="xgpcPlayer_textEntry"><span id="downControleId">下载</span></div>';

    let popover = control.querySelector('.xgplayer-control-item__popover');

    let downloadList = '<ul>';

    downloadOption.forEach(function(item){
        try {
            downloadList += `<li tabindex="0" role="menuitemradio" aria-checked="false" id="${item.id}"  data-downUrl=${item.mainUrl}  data-downTitle=${item.fileName}>${item.videoResolution}</li>`;
        }catch (e){
            console.log("没有数据");
        }

    })

    downloadList += '</ul>';

    popover.innerHTML = downloadList;

    try {
        if(isDownControleId != null){
            playControl.replaceWith(control);

        }else {
            playControl.before(control);
        }
    }catch (e){
        console.log(e)
    }



    let divDom = document.createElement('div');

    divDom.style="width: 80px; height: 140px;position:absolute;bottom:40px;left:20px;z-index:-1";

    control.appendChild(divDom);

    control.onmouseover=function(){

        popover.style.display='block';

    }

    control.onmouseout=function(){
        popover.style.display='none';
    }
    return handlerDatas.ids;
}

/*--Class--*/
class BaseClass{


    createElement(dom,domId){

        var rootElement = document.body;

        var newElement = document.createElement(dom);

        newElement.id = domId;

        var newElementHtmlContent = document.createTextNode('');

        rootElement.appendChild(newElement);

        newElement.appendChild(newElementHtmlContent);

    }

    static getElement(css){

        return new Promise((resolve,reject)=>{

            let num = 0;

            let timer = setInterval(function(){

                num++

                let dom = document.querySelector(css);

                if(dom){

                    clearInterval(timer);

                    resolve(dom);

                }else{

                    if(num==20){clearInterval(timer);resolve(false);}
                }

            },300)

        })


    }


}

async function loadingXigua() {
    try{
        var _this = this;
        if (document.location.toString() !== "https://www.ixigua.com/") {
            if(!isInit){
                HTMLInit();
            }
            window.addEventListener('load',function(){
                getControls();
            })

        }
    }catch (e){
        console.log(e);
    }
}

async function xiguaChange() {
    var _this = this;
    if (document.location.toString() !== "https://www.ixigua.com/") {
        if(!isInit){
            HTMLInit();
        }
        getControls();
    }
}

async function getControls(){
    let videoDom = await BaseClass.getElement('video');

    if(!videoDom){
        console.log('没有找到DOM');return;

    }

    let ids = await createXiguaVideoDownload();
    ids.forEach(function(id){
        let jsId = "#" + id;
        document.querySelector(jsId).addEventListener('click',function(eve){
            console.log("-------------------有点击下载-------------------");
            console.log(eve.target.dataset);
            let fileName = eve.target.dataset.downtitle;
            fileName = fileName.replaceAll("-空格-", " ");
            // 转换回原来的文件名称
            xunleiDownload(eve.target.dataset.downurl,fileName);

        })
    })


}
loadingXigua();


