// ==UserScript==
// @name         tonarinoyj
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  添加部分网页
// @author       xike
// @match        https://gammaplus.takeshobo.co.jp/_files/*

// @match        https://kuragebunch.com/episode/*
// @match        https://shonenjumpplus.com/episode/*
// @match        https://comic-days.com/episode/*
// @match        https://comicbushi-web.com/episode/*
// @match        https://comicbushi-web.com/episode/*
// @match        https://tonarinoyj.jp/episode/*
// @match        https://comic-gardo.com/episode/*
// @match        https://pocket.shonenmagazine.com/episode/*

// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.5.0/jszip.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_download
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459086/tonarinoyj.user.js
// @updateURL https://update.greasyfork.org/scripts/459086/tonarinoyj.meta.js
// ==/UserScript==

(function() {
    'use strict';
    addCss();
    let msgBox=null;
    let imgUrls=[], imgCount=0, imgDownloadedCount = 0, fileNameLength=0;
    initUI();

    function initUI(){
        // 解析按钮
        const btn = document.createElement('div');
        btn.innerText = '解 析';
        btn.className = 'floating-btn';
        console.log(window.location.href)
        let webUrl = window.location.href.split('/')[2];
        console.log(webUrl)
        if (webUrl=='gammaplus.takeshobo.co.jp'){
            btn.addEventListener('click', ev=>startlisten());
            console.log('gammaplus.takeshobo.co.jp');
        }
        else {
            let w=800;
            let h=1184;
            if (webUrl=='kuragebunch.com'){
                w=832;
                h=1184;
            }
            else if( webUrl=='shonenjumpplus.com'){
                w=800;
                h=1184;
            }
            else if( webUrl=='comic-days.com')
            {
                w=830;
                h=1184;
            }
            else if( webUrl=='comicbushi-web.com')
            {
                w=1440
                h=2048
            }
            else if( webUrl=='tonarinoyj.jp')
            {
                w=800
                h=1120
            }
            else if( webUrl=='comic-gardo.com')
            {
                w=1120
                h=1600
            }
            else if( webUrl=='pocket.shonenmagazine.com')
            {
                w=960
                h=1376
            }

            btn.addEventListener('click', ev=>getAllImgType1(w,h));
        }
        document.body.append(btn);
    }

    //***************************************shonenjumpplus代码开始************************** */
    function getAllImgType1(w,h){
        console.log('start')
        let dataSrc=document.querySelector('#episode-json')
        let jsonStr=dataSrc.getAttribute('data-value')
        var jsonValue = JSON.parse(jsonStr);
        let pages=jsonValue.readableProduct.pageStructure.pages
        let imgList =new Array()
        for(var i=0;i<pages.length;i++){
            if (pages[i].src!= undefined){
                imgList.push(pages[i].src)
            }
        }
        imgUrls.length = 0;
        console.log(imgList)
        var indetCnt=0
        imgList.forEach(imgUrl=>{
            const index = indetCnt;
            indetCnt+=1
            try{
                imgUrls[index] = {
                    index:index+1,
                    url:imgUrl
                };
            }catch{
                console.log(imgUrl)
            }
        });
        imgCount = imgUrls.length;
        fileNameLength = imgCount.toString().length;
        imgDownloadedCount = 0;
        let zip = new JSZip();
        let zipName = location.href.split("/")[4];
        zipName = decodeURIComponent(zipName);
        zipName = zipName.match(/\d+/)[0] + '.zip';
        imgUrls.forEach(item=>{
            const fileName = sn(item.index)+'.jpg';
            GM_xmlhttpRequest({
                url: item.url,
                method: 'get',
                responseType :'blob',
                timeout: 105000,
                onload: res =>{
                    const reader = new  FileReader()
                    fileOrBlobToDataURL(res.response, function (dataurl){
                        let img = new Image(w,h)
                        img.src=dataurl
                        img.onload=()=>{
                            let widthofpiece=w/4
                            let heightofpiece=h/4
                            reader.readAsDataURL(res.response);
                            var canvas = document.createElement('canvas');
                            canvas.width = w;
                            canvas.height = h;
                            var context = canvas.getContext('2d');
                            for(var x = 0; x < 4; ++x) {
                                for(var y = 0; y < 4; ++y) {
                                    context.drawImage(img,y*widthofpiece,x*heightofpiece,widthofpiece,heightofpiece,x*widthofpiece,y*heightofpiece,widthofpiece,heightofpiece);
                                }
                            }
                            let data=canvas.toDataURL().replace('data:image/png;base64,','')
                            zip.file(fileName,data, { base64: true });
                            zip.generateAsync({type: 'blob'}).then(
                                content=> {
                                    showMsg(`正在下载图片：${imgDownloadedCount + 1}/${imgCount}`);
                                    if(++imgDownloadedCount >= imgCount){
                                        downloadFileByBlob(content, zipName);
                                        showMsg('');
                                    }
                                }
                            );
                        }
                    })

                },
                onerror: err=>{
                    console.log( `下载失败：【${1+item.index}】${item.url}`)
                    if(++imgDownloadedCount >= imgCount){
                        showMsg('下载无法继续',-1);
                    }
                },
                ontimeout:()=>{
                    console.log( `下载失败：【${1+item.index}】${item.url}`)
                    if(++imgDownloadedCount >= imgCount){
                        showMsg('下载无法继续',-1);
                    }
                }
            })
        });
    }

    //***************************************shonenjumpplus 代码结束 */


    //***************************************gammaplus代码开始************************** */
    function startlisten(){
        let container=document.querySelector('#menu_slidercaption')
        let len=parseInt(container.innerText.split('/')[1])
        showMsg('开始监听,请匀速滚动页面\n收集网页动态资源');
        imgCount = len;
        fileNameLength = imgCount.toString().length;
        let imgList=new Array()
        let imgId=1
        let counter=new Array(imgCount).fill(0)
        imgDownloadedCount = 0;
        let zip = new JSZip();
        let zipName = location.href.split("/")[5];
        //计数器
        let img_download=new Array(imgCount*3)
        zipName = decodeURIComponent(zipName);
        zipName = zipName + '.zip';
        //data/0009.ptimg.json
		document.onmousewheel = function (ev) {
            var down = true; // 定义一个标志，当滚轮向下滚时，执行一些操作
            down = ev.wheelDelta ? ev.wheelDelta < 0 : ev.detail > 0;
            let select='data/'+imgId.toString().padStart(4,'0')+'.ptimg.json';
            let page=document.querySelectorAll("div[data-ptimg='"+select+"'] img")
            while(page.length!=0 && imgId<=len){
                console.log(page);
                console.log("div[data-ptimg='"+select+"'] img");
                let nowPage=[]
                for(var i=0;i<3;i++){
                    nowPage[i]={
                         index:((imgId-1)*3+i),
                         url:page[i].src
                    };
                }
                downloadImgGammaplus(nowPage,img_download,counter,zip,zipName)
                imgId+=1;
                select='data/'+imgId.toString().padStart(4,'0')+'.ptimg.json';
                page=document.querySelectorAll("div[data-ptimg='"+select+"'] img")
            }
            //showMsg('正在收集第'+imgId+'图片资源,总资源数：'+len)
            if (imgId>len){
                console.log('imgId = '+imgId);
               // showMsg('收集完成，开始解析')
            }

            return true;
        }
    }
    function downloadImgGammaplus(nowPage,img_download,counter,zip,zipName){
        nowPage.forEach(item=>{
            GM_xmlhttpRequest({
                url: item.url,
                method: 'get',
                responseType :'blob',
                timeout: 105000,
                onload: res =>{
                    const reader = new FileReader()
                    fileOrBlobToDataURL(res.response, function (dataurl){
                        let img = new Image(800,1142)
                        img.src=dataurl
                        img.onload=()=>{
                            let imgId=Math.floor(item.index/3);

                            img_download[item.index]=img;
                            counter[imgId]+=1;
                            if(counter[imgId]==3){
                                let widthofpiece=844;
                                let heightofpiece=1200/3;

                                reader.readAsDataURL(res.response);
                                var canvas = document.createElement('canvas');
                                canvas.width = 844;
                                canvas.height = 1200;
                                var context = canvas.getContext('2d');
                                for(var x = 0; x < 3; ++x) {
                                    context.drawImage(img_download[imgId*3+x],0,0,widthofpiece,heightofpiece,0,x*heightofpiece,widthofpiece,heightofpiece);
                                }
                                let data=canvas.toDataURL().replace('data:image/png;base64,','');
                                console.log('第'+(imgId+1)+'张完成');
                                const fileName = sn(imgId+1)+'.jpg';
                                zip.file(fileName,data, { base64: true });
                                zip.generateAsync({type: 'blob'}).then(
                                    content=> {
                                        showMsg(`正在下载图片：${imgDownloadedCount + 1}/${imgCount}`);
                                        if(++imgDownloadedCount >= imgCount){
                                            downloadFileByBlob(content, zipName);
                                            showMsg('');
                                        }
                                    }
                                );
                            }
                        }
                    })

                },
                onerror: err=>{
                    console.log( `下载失败：【${1+item.index}】${item.url}`)
                    if(++imgDownloadedCount >= imgCount){
                        showMsg('下载无法继续',-1);
                    }
                },
                ontimeout:()=>{
                    console.log( `下载失败：【${1+item.index}】${item.url}`)
                    if(++imgDownloadedCount >= imgCount){
                        showMsg('下载无法继续',-1);
                    }
                }
            })
        });
    }

    //***************************************gammaplus 代码结束 */

    /****************************************公用函数开始**************** */
    // 将blob对象转化为其他对象
    function fileOrBlobToDataURL(obj, cb){
        var a = new FileReader();
        a.readAsDataURL(obj);
        a.onload = function (e){
            cb(e.target.result);
        };
    }
    // 利用blob下载文件
    function downloadFileByBlob(blobContent, filename) {
        const blobUrl = URL.createObjectURL(blobContent)
        const eleLink = document.createElement('a')
        eleLink.download = filename
        eleLink.style.display = 'none'
        eleLink.href = blobUrl
        eleLink.click();
    }

    function sn(index){
        return index.toString().padStart(fileNameLength, '0');
    }

    function showMsg(msg,type){
        if(msgBox == null){
            msgBox = document.createElement('div');
            msgBox.id = 'msg-box';
            document.body.append(msgBox);
        }
        msgBox.innerText = msg;
        msgBox.className=type?'showing':'err';

    }

    function addCss(){
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
        z-index:99;
        box-shadow:#0a7deb 2px 2px 6px, #0a7deb 6px 6px 19px;
        }
        .floating-div{
        position:relative;
        background: #0a7deb;
        text-align: center;
        color:white;
        cursor: pointer;
        border-radius:10px;
        border:solid #0a7deb 1px;
        padding:6px;
        display:none;
        z-index:99;
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
        z-index:99;
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
        `);
    }
})();