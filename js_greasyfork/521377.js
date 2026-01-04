// ==UserScript==
// @name         番茄小说阅读辅助器
// @namespace    http://tampermonkey.net/
// @version      2.601
// @description  可以下载番茄小说内容,记录阅读位置(滚动位置),可以自动滚动,快捷书签,好用！
// @author       twjx
// @match        *://fanqienovel.com/*
// @require      https://cdn.jsdelivr.net/npm/lil-gui@0.16
// @require https://update.greasyfork.org/scripts/522780/1518758/dialog-gui.js
// @require https://update.greasyfork.org/scripts/521360/1523656/unicode1.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @license GNU AGPLv3
// @resource       swalStyle https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.css
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4Ljg3MjcgMEg1LjEyNzI3QzIuMjkwOTEgMCAwIDIuMjkwOTEgMCA1LjEyNzI3VjE4Ljg3MjdDMCAyMS43MDkxIDIuMjkwOTEgMjQgNS4xMjcyNyAyNEgxOC44NzI3QzIxLjcwOTEgMjQgMjQgMjEuNzA5MSAyNCAxOC44NzI3VjUuMTI3MjdDMjQgMi4yOTA5MSAyMS43MDkxIDAgMTguODcyNyAwWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01LjEyNzI3IDBIMTguODcyN0MyMS43MDkxIDAgMjQgMi4yOTA5MSAyNCA1LjEyNzI3VjE4Ljg3MjdDMjQgMjEuNzA5MSAyMS43MDkxIDI0IDE4Ljg3MjcgMjRINS4xMjcyN0MyLjI5MDkxIDI0IDAgMjEuNzA5MSAwIDE4Ljg3MjdWNS4xMjcyN0MwIDIuMjkwOTEgMi4yOTA5MSAwIDUuMTI3MjcgMFpNMjMuNDc1NyA1LjEyNzI3QzIzLjQ3NTcgMi41OTYzNiAyMS40MDMgMC41MjM2MzYgMTguODcyIDAuNTIzNjM2SDUuMTI2NTlDMi41OTU2OCAwLjUyMzYzNiAwLjUyMjk0OSAyLjU5NjM2IDAuNTIyOTQ5IDUuMTI3MjdWMTguODcyN0MwLjUyMjk0OSAyMS40MDM2IDIuNTk1NjggMjMuNDc2NCA1LjEyNjU5IDIzLjQ3NjRIMTguODcyQzIxLjQwMyAyMy40NzY0IDIzLjQ3NTcgMjEuNDAzNiAyMy40NzU3IDE4Ljg3MjdWNS4xMjcyN1oiIGZpbGw9IiNFNkU2RTYiLz4KPHBhdGggZD0iTTE1LjA3NjIgMFY1LjA0TDE3LjAxOCAzLjkyNzI3TDE4Ljk1OTggNS4wNFYwSDE1LjA3NjJaIiBmaWxsPSIjRUU1NTI4Ii8+CjxwYXRoIGQ9Ik0yNCAxMy45NjM2QzIxLjI1MDkgMTAuNjkwOCAxNi45MDkxIDguNTc0NDYgMTIuMDIxOCA4LjU3NDQ2QzcuMDkwOTEgOC41NzQ0NiAyLjcyNzI3IDEwLjcxMjYgMCAxNC4wMjlWMTguODcyNkMwIDIxLjcwOSAyLjI5MDkxIDIzLjk5OTkgNS4xMjcyNyAyMy45OTk5SDE4Ljg3MjdDMjEuNzA5MSAyMy45OTk5IDI0IDIxLjcwOSAyNCAxOC44NzI2VjEzLjk2MzZaIiBmaWxsPSJ1cmwoI3BhaW50MF9yYWRpYWxfNjA3XzEyNTA1KSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyLjc4NTYgMTMuODk4MkMxMi43NjM4IDEzLjAwMzcgMTIuNDE0NyAxMi41ODkxIDEyLjAwMDIgMTIuNTg5MUMxMS41NjM4IDEyLjYxMDkgMTEuMjM2NSAxMy4wMjU1IDExLjI1ODQgMTMuODk4MkMxMS4yNTg0IDE0LjgxNDYgMTIuMDQzOCAxNS44NjE4IDEyLjA0MzggMTUuODYxOEMxMi4wNDM4IDE1Ljg2MTggMTIuNzg1NiAxNC44MTQ2IDEyLjc4NTYgMTMuODk4MlpNNi4zNDk0NiAxOC42NzYzQzcuMjY1ODMgMTguNjc2MyA4LjMxMzEgMTkuNDE4MSA4LjMxMzEgMTkuNDE4MUM4LjMxMzEgMTkuNDE4MSA3LjI2NTgzIDIwLjIwMzUgNi4zNDk0NiAyMC4yMDM1QzUuNDMzMSAyMC4yMDM1IDUuMDE4NTUgMTkuODc2MyA1LjAxODU1IDE5LjQzOTlDNS4wNDAzNyAxOS4wNDcyIDUuNDU0OTIgMTguNjk4MSA2LjM0OTQ2IDE4LjY3NjNaTTE4Ljk2MSAxOS40NjE5QzE4Ljk2MSAxOS44NzY0IDE4LjU0NjUgMjAuMjI1NSAxNy42MzAxIDIwLjIyNTVDMTYuNzEzOCAyMC4yMjU1IDE1LjY2NjUgMTkuNDQwMSAxNS42NjY1IDE5LjQ0MDFDMTUuNjY2NSAxOS40NDAxIDE2LjczNTYgMTguNjc2NCAxNy42MzAxIDE4LjY5ODJDMTguNTQ2NSAxOC42OTgyIDE4Ljk2MSAxOS4wMjU1IDE4Ljk2MSAxOS40NjE5Wk0xNy4zMDIyIDE0Ljg1ODFDMTcuNjA3NiAxNS4xNjM1IDE3LjU0MjIgMTUuNjg3MiAxNi44ODc2IDE2LjM0MTdDMTYuMjMzMSAxNi45NzQ1IDE0Ljk0NTggMTcuMTcwOCAxNC45NDU4IDE3LjE3MDhDMTQuOTQ1OCAxNy4xNzA4IDE1LjE2NCAxNS44ODM1IDE1LjgxODUgMTUuMjUwOEMxNi40NzMxIDE0LjU5NjMgMTcuMDE4NSAxNC41NTI2IDE3LjMwMjIgMTQuODU4MVpNOS4wNTU2NCAxNy4xNDkyQzkuMDU1NjQgMTcuMTQ5MiA4LjgzNzQ2IDE1Ljg2MiA4LjE4MjkxIDE1LjIyOTJDNy41MjgzNiAxNC41OTY1IDYuOTgyOTEgMTQuNTUyOSA2LjY5OTI3IDE0LjgzNjVDNi40MTU2NCAxNS4xNDIgNi40NTkyNyAxNS42ODc0IDcuMTEzODIgMTYuMzIwMUM3Ljc2ODM2IDE2Ljk1MjkgOS4wNTU2NCAxNy4xNDkyIDkuMDU1NjQgMTcuMTQ5MloiIGZpbGw9IndoaXRlIi8+CjxkZWZzPgo8cmFkaWFsR3JhZGllbnQgaWQ9InBhaW50MF9yYWRpYWxfNjA3XzEyNTA1IiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDEyLjA5ODkgMjQuMjEyKSBzY2FsZSgxNC41OTg0IDkuMzgyNzcpIj4KPHN0b3Agc3RvcC1jb2xvcj0iI0NDMDUwMCIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNGRjVGMDAiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect      p9-reading-sign.fqnovelpic.com
// @connect      p3-reading-sign.fqnovelpic.com
// @downloadURL https://update.greasyfork.org/scripts/521377/%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%E9%98%85%E8%AF%BB%E8%BE%85%E5%8A%A9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/521377/%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4%E9%98%85%E8%AF%BB%E8%BE%85%E5%8A%A9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //unsafeWindow
    window.data='';
    window.num=0;
    window.alldata=[];
    window.movep=[];
    window.img=[];
    window.thedata={};
    window.sleep=async function(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    };
    window.unicode_data();
window.downloader={
    newxml:function(url,idata,num,num1,aa) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET',url);
        xhr.overrideMimeType('text/plain; charset=utf-8');
        xhr.onload = function () {
            if (xhr.status === 200) {
                let parser = new DOMParser();
                    var doc = parser.parseFromString(xhr.responseText, 'text/html')
                    var content=''                                                    /* 排除图片的元素*/
                    Array.from(doc.querySelector('.muye-reader-content div').children,).filter(e=>!e.children.length).forEach(x=>{
                        content+=downloader.decode(x.innerText+'\n')//加换行
                    })
                    idata.data.push({
                        chapter:doc.querySelector('.muye-reader-box-header').children[0].innerText,
                        chapter1:num1,
                        chapter2:num,
                        word_count:doc.querySelector('.muye-reader-box-header').children[1]==undefined ? undefined : doc.querySelector('.muye-reader-box-header').children[1].children[0].innerText.split('：')[1],
                        updated_at:doc.querySelector('.muye-reader-box-header').children[1]==undefined ? undefined : doc.querySelector('.muye-reader-box-header').children[1].children[1].innerText.split('：')[1],
                        data:content,
                    })
                    downloader.find_img(doc) == false ? (()=>{})() : (()=>{
                        img.push(downloader.find_img(doc))
                    })()
                    console.log(aa+' 机改1：'+num1+' 机改2：'+num+'下载完成')
            }
        };
        xhr.send();
    },
    decode:function(content) {
        var newdata = '';
        for (let x of content) {
            if (String(x).charCodeAt(0) in unicode_data == true) {
                newdata += unicode_data[String(x).charCodeAt(0)];
            } else {
                newdata += String(x);
            }
        }
        return newdata;
    },
    dispose:async function(children,type){
        var jdata=children.children[0].innerHTML.split('<span class="volume-dot"></span>')
        var num=1
        alldata.push({
            name:jdata[0],
            volume:jdata[0],
            allchapter:jdata[1],
            data:[]})
            console.log('卷创建完毕')
        for(let x of children.children[1].children){
            this.newxml(x.children[0].href,alldata[alldata.length-1],num,num1,x.innerText.split(' ')[0])
            num+=1
            num1+=1
            await sleep(Number(document.querySelectorAll('.widget')[2].children[0].value))//50毫秒一下最好不要，卡爆
        }
    },
    find_img:function(doc){
        var a=Array.from(doc.querySelector('.muye-reader-content').children[0].children,).filter(e=>e.children[0])
        return a.length == 0 ? false : (()=>{
            var b=[]
            a.forEach(e=>{
                b.push({
                    src:e.children[0].src || e.children[0].children[0].src,//防止扉页 版权 等类似格式不同引发的错误
                    name:this.decode(e.children[1]==true ? e.children.innerText : doc.querySelector('.muye-reader-box-header').children[0].innerText),//忘了还要解码
                    chapter:doc.querySelector('.muye-reader-box-header').children[0].innerText,
                    render:{
                        width:e.children[0].width || e.children[0].children[0].width,
                        height:e.children[0].height || e.children[0].children[0].height,
                    },
                    original:{
                        width:e.children[0].naturalWidth==undefined ? e.children[0].children[0].naturalWidth : e.children[0].naturalWidth,
                        height:e.children[0].naturalHeight==undefined ? e.children[0].children[0].naturalHeight : e.children[0].naturalHeight,
                    },
                })
            })
            return b
        })()
    },
    download:function(name, text,type) {
        if(type=='text'){
            GM_download({
                url: 'data:text/plain;charset=utf-8,' + encodeURIComponent(text),
                name: name + '.txt',
                saveAs: true,
                onload: function(){
                    console.log('下载完成')
                }
            });
        }
    },
    downloadd:async function(type){
        data=''
        console.log('正在排序...')
            window.d=0
            for(let x=0;x<alldata.length;x++){
                data+=alldata[x].name+' '+alldata[x].allchapter+'\n'
                for(let x1=0;x1<alldata[x].data.length;x1++){
                    d+=1
                    for(let x2 of alldata[x].data){
                        if(x2.chapter1==d){
                            data+='\n'+x2.chapter.includes('章') == true ? '第'+[x2.chapter,x2.chapter1,x2.chapter2][type]+'章'+x2.chapter.split('章')[1] : (()=>{return type == 0 ?x2.chapter: '第'+[x2.chapter,x2.chapter1,x2.chapter2][type]+'章 '})()+x2.chapter+(x2.word_count==undefined ? '' : `\n字数:${x2.word_count} 更新日期:${x2.updated_at}\n`)+x2.data
                        }
                    }
                }
            }
        this.download(
            unsafeWindow.__INITIAL_STATE__.page.bookName,
            unsafeWindow.__INITIAL_STATE__.page.bookName+
            '作者:'+unsafeWindow.__INITIAL_STATE__.page.author+
            '\n字数'+document.querySelector('.info-count-word').innerText.replace('\n','')+
            "\n此文件由番茄小说阅读辅助器下载https://greasyfork.org/zh-CN/scripts/521377-番茄小说阅读辅助器\n请支持正版番茄小说"
            +'\n'+data,'text')
        await sleep(1000)
        data=''
        alldata=[]
        if(await confirm('是否下载图片')==true){
            this.loadimg=new this.downloadimg()
            this.loadimg.loadimg(img.flat(Infinity))
        }
    },
    loadrecord:function(){
        document.querySelectorAll('.chapter-item').forEach((x)=>{
            var recorddata=thedata.read.read_record.filter(e=>e.chapterid==x.children[0].href.split('/')[4])
            if(recorddata.length==1){
                x.innerHTML+='<span class="tooltip">已看'+Math.round(((recorddata[0].scrolltop+window.innerHeight)/recorddata[0].scrollHeight)*100)+'%</span>'
            }else{
                x.innerHTML+='<span class="tooltip">未看</span>'
            }
        })
        console.log('tips is loaded')
    },
    addstyle:function(){
        document.querySelector('.muye').innerHTML+=`<style>
        .tooltip {
            visibility: hidden; /* 初始状态下隐藏工具提示 */
            background-color: #555;
            color: #fff;
            text-align: center;
            border-radius: 5px;
            padding: 5px 10px;
            position: absolute; /* 使用绝对定位 */
            z-index: 1; /* 确保工具提示显示在其他元素之上 */
            bottom: 125%; /* 工具提示显示在按钮上方 */
            left: 25%;
            transform: translateX(-50%);
            opacity: 0; /* 初始状态下透明度为0 */
            transition: opacity 0.3s; /* 添加过渡效果 */
        }
        .chapter-item:hover .tooltip {
            visibility: visible; /* 鼠标悬停时显示工具提示 */
            opacity: 1; /* 鼠标悬停时设置透明度为1 */
        }
        </style>`
    },
    downloadimg:function(){ //after img.flat()
        this.onloadnum=0,
        this.dataUrl=[]
        this.loadimg=function(img){
            // 使用 Object.defineProperty 监听 onloadnum 的变化
            Object.defineProperty(downloader.loadimg, 'onloadnum', {
                get: function() {
                    return this._onloadnum || 0;
                },
                set: function(value) {
                    if (typeof value !== 'number' || isNaN(value)) {
                        console.error('Invalid value for onloadnum:', value);
                        return;
                    }
                    this._onloadnum = value;
                    if (this._onloadnum === img.length) {
                        downloader.loadimg.turnimgtozip();
                    }
                },
                enumerable: true,
                configurable: true
            });
            img.forEach(x=>{
                GM_xmlhttpRequest({
                    method:  'GET',
                    url: x.src,
                    responseType: 'blob', // 返回 blob
                    onload: function(response) {
                        if (response.status === 200) {
                            //console.log(img.filter(e=>e.src==response.finalUrl))
                            downloader.loadimg.dataUrl.push({
                                name:img.filter(e=>e.src==response.finalUrl)[0].name,
                                blob:response.response,
                                chapter:img.filter(e=>e.src==response.finalUrl)[0].chapter,
                                original:img.filter(e=>e.src==response.finalUrl)[0].original,
                                render:img.filter(e=>e.src==response.finalUrl)[0].render,
                            })
                            downloader.loadimg.onloadnum+=1
                            console.log('图片'+img.filter(e=>e.src==response.finalUrl)[0].name+'下载完成')
                        }
                    },
                });
            })
        },
        this.turnimgtozip = function() {
            var zip = new JSZip();
            this.dataUrl.forEach(e => {
                if (e.blob) {
                    zip.file(e.name + '.png', e.blob, { base64: false, binary: true });
                } else {
                    console.error('Blob数据未找到:', e);
                }
            });
            zip.generateAsync({ type: "blob" }).then(function(content) {
                saveAs(content, "图片下载.zip");
            }).catch(function(err) {
                console.error('生成ZIP文件时出错:', err);
            });
        };
    }
}
    function move(){//移动模块
        var guid=gui.domElement
        gui.domElement.children[0].onmousedown=function(e) {
            if(guid.style.left==''){
                movep=[e.clientX-(window.innerWidth-275),e.clientY-0]//首次移动
            }else{
                movep=[e.clientX-Number(guid.style.left.replace('px','')),e.clientY-Number(guid.style.top.replace('px',''))]
            }
            window.onmove=true
        }
        document.onmouseup=function(e) {
            movep=[]
            window.onmove=false
            if(Number(guid.style.left.replace('px',''))<0)guid.style.left='0px';
            if(Number(guid.style.top.replace('px',''))<0)guid.style.top='0px';
            if(Number(gui.domElement.style.left.replace('px',''))+260>=windowWidth){
                gui.domElement.style.left=(windowWidth-260)+'px'
            }
        }
        document.onmousemove=function(e){
            if(window.onmove==true){
                guid.style.top=e.clientY-movep[1]+'px';
                guid.style.left=e.clientX-movep[0]+'px'
            }
        }
        guid.onmouseover=function(){
            if(!guid.children[0].innerText.includes('右'))guid.children[0].innerText+=' (右键可移动)';
        }
        guid.onmouseout=function(){
            guid.children[0].innerText='番茄阅读辅助器'
        }
    }
    window.reader={
        record:async function(){//记录阅读位置
            window.time=String(new Date).split(' ')
            var datax=thedata.read.read_record.filter(e=>e.chapterid==location.pathname.split('/')[2])
            if(datax.length==1){
                 //回忆了以前的知识
                if(thescroll.scrollTop==0){await sleep(500)}
                Object.assign(thedata.read.read_record.filter(e=>e.chapterid==location.pathname.split('/')[2])[0],{
                    date:{
                        year:time[3],
                        month:time[2],
                        time:time[4],
                        area:time[6],
                    },
                    chapterName:document.querySelector('.muye-reader-title').innerText,
                    chapterid:location.pathname.split('/')[2],
                    scrolltop:thescroll.scrollTop,
                    scrollHeight:thescroll.scrollHeight,
                })
            }else if(datax.length==0){
                thedata.read.read_record.push({
                    date:{
                        year:time[3],
                        month:time[2],
                        time:time[4],
                        area:time[6],
                    },
                    bookName:document.querySelector('.muye-reader-nav-title').innerText,
                    chapterName:document.querySelector('.muye-reader-title').innerText,
                    chapterid:location.pathname.split('/')[2],
                    scrolltop:thescroll.scrollTop,
                    scrollHeight:thescroll.scrollHeight,
                })
            }
        },
        onload:function(){//加载阅读位置
            if(thedata.read.read_record.filter(e=>e.chapterid==location.pathname.split('/')[2]).length==1){
                thescroll.scrollTop=thedata.read.read_record.filter(e=>e.chapterid==location.pathname.split('/')[2])[0].scrolltop
                console.log('记录加载')
            }
        },
        loadrecord:function(){//加载目录记录
            for(let x of document.querySelector('.reader-catalog-chapters').children){
                for(let xx of x.children){
                    if(xx.className!=='volume-header'){
                        var xxx=thedata.read.read_record.filter(e=>e.chapterid==xx.children[0].attributes[0].value)
                    if(xxx.length==1){
                        xx.children[0].innerHTML+='<p>  已看'+Math.round(((xxx[0].scrolltop+thescroll.clientHeight)/xxx[0].scrollHeight)*100)+'%</p>'
                    }}
                }
            }
            console.log('目录记录加载')
        },
        scroll:{
            load:function(theparent){
                this.scrollInterval;
                this.scrollStatus = theparent.add({ status: '已停止' }, 'status').name('滚动状态');
                this.scrollStatus.domElement.style.color = 'red';
                this.scrollSpeed = theparent.add({ speed: 1 }, 'speed').name('滚动速度');
                this.scrollSpeed.setValue(thedata.read.scroll_speed)
                this.scrollSpeedsave = theparent.add({ speedsave: false }, 'speedsave').name('保存速度').onChange(function(value) {
                    if (value==true) {
                        thedata.read.scroll_speed=reader.scroll.scrollSpeed.getValue()
                        console.log('保存速度:'+thedata.read.scroll_speed)
                        fqxsydqdata.savedata()
                    }
                });
                this.nextpage = theparent.add({ nextpage: false }, 'nextpage').name('结尾自动翻页+自动滚动').onFinishChange((value)=>{localStorage.scroll=String(value)})
                this.stopButton = theparent.add(this, 'start').name('开始自动滚动');
            },
            autoScroll:async function() {
                if (thescroll.scrollTop >= thescroll.scrollHeight - thescroll.clientHeight) {
                    console.log('滚动以至底部')
                    window.reader.scroll.stopAutoScroll();
                    if(reader.scroll.nextpage['$input'].checked==true){
                        console.log('即将开始切换')
                        await sleep(1000)
                        if(document.querySelectorAll('.byte-btn')[1].innerText.includes('下一章')==false){
                            alert('现在是最新一章了~')
                            localStorage.scroll=true
                        }
                        else document.querySelectorAll('.byte-btn')[1].click()
                    }
                }else{
                    thescroll.scrollTop += Math.round(reader.scroll.scrollSpeed.getValue())
                }
            },
            startAutoScroll:function() {
                this.scrollInterval = setInterval(this.autoScroll, 200);
                this.scrollStatus.setValue('进行中');
                this.stopButton.name('停止自动滚动');
                this.scrollStatus.domElement.style.color = 'green';
            },
            stopAutoScroll:function() {
                clearInterval(this.scrollInterval);
                this.scrollStatus.setValue('已停止');
                this.stopButton.name('开始自动滚动');
                this.scrollStatus.domElement.style.color = 'red';
            },
            "start":()=>{
                var x=reader.scroll
                if(x.scrollStatus.getValue()=='已停止'){
                    if(String(Number(x.scrollSpeed.getValue()))=='NaN'){
                        alert('滚动速度输入非数字')
                        return
                    }
                    if(x.scrollSpeed.getValue()>=1000){
                        alert('滚动速度输入过大\n如有需要请在脚本后台修改上限\n如有错误作者概不负责')
                        return
                    }
                    console.log('滚动速度:'+Math.round(x.scrollSpeed.getValue()))
                    x.startAutoScroll();
                }else{
                    x.stopAutoScroll();
                }
            }
        },
        keyboard:function(){
            document.addEventListener("keyup", function (e) {
                delete reader.mark.keydown[e.key]
            })
            document.addEventListener("keydown", function (e) {
                reader.mark.keydown[e.key]=true
                if(e.keyCode==39||e.keyCode==37){
                    document.querySelectorAll('.byte-btn')[[37,39].indexOf(e.keyCode)].click()
                    if(document.querySelectorAll('.byte-btn')[1].innerText!=='下一章' && e.keyCode==39){
                        location.pathname='/reader/'+unsafeWindow.__INITIAL_STATE__.reader.chapterData.nextItemId
                    }
                }
            });
        },
        mark:{
            keydown:{},
        },
        newbookmark:function(){
            var ele=document.createElement('div')
            this.imgurl=[
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMESURBVFhHxZe9T2JBEMBnVw5CYggY7g4TCzXa2FDYkZiACQUaNdHEf8DE1hatjDZWJgajFHYWEBu0kA8xUNgaO42FUTtz16gRg3on73aWeU8eyMEp790v2TAzhN2Z3Z3ZoQ0AmMfj+epwONwPDw9Fob+KYR4XFxffSDQdRVGcDB3o6+v7STbJwMCAQmJLGRwchO3tbUaqROdAKpVSQqEQUx0YGhoCu92OngJj5d+hXAnqnHNNrgR/g7bb21s4Pj6WtmAwCGtra29OnJ6eekiU4OKt3oF8Pi/nw3nHxsZ0c/NisWgl2TACgYAWsbpbKtxisZh6619eXkgqw9vb23+RbAptbZj5b3C3222qA11dXSQRl5eX30mUGHEJ6yEyxMmfn59/k/5f4J2dnSWSDSOZTCqjo6NykEkD09BCsmGMjIzoqp+KKFR36IA+MVtMJpORkd/c3ACO6l1geAl7e3t/kK69A2dnZ+96/S+oCxcKBRB3TdpsNhuI1Adx9DAxMeEyNPpGPD4+yjtgI73l7O/vs5OTE4a5j5Hj6O/vB7Thd06nE3hHRwc2IYaSy+UYbjsOXJjM4Pf7gd/f338h3VDwzHFU0t3dDabdAYx8dnaWtDe41Wo17TUUt74ms3ipVDKl7iOY4lNTU9p619fXn38Ns9nshwOQWSCKxIfugfpqzs3NafLu7m5DZ2oaEtEgNO1AOp1WlpeXdc+1z+cjCWBhYQFWV1eb3hGXy3XHn56e9C1KHTC6RCIBsViMLOVyvbW1xSrLttBhcXGxrhM1PaGoTg37gaWlJQWjOzo6kjouWP1WbGxswPT0tJR3dnZgcnJSiUajDXeDi77/rw6IM1bi8biU8X9CvUdKVDUmImczMzNSPz8/h8PDQwiHw/LYpFHw+qrPenZ1deXs6em5I117DasZHx+HlZWVdxevZm9vT5mfnydNj9frxWPU5mHYl2FjQLqk0onh4WFYX19vauFqNjc3lUgkQlqZmh1EB0jUoTpxcHDQ8BwbgXPV21kjcNBnEwD8AdH2P3swjPSdAAAAAElFTkSuQmCC',
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAF0SURBVFhH7ZZLjoMwDIbpLGY5Ym6ARC9TLskVWPFopd6CHRXcgBVrJrZ+05ASoC2PReeTKseOY5s4ieoYfEN+OO1KFEXRIkXHAZJJkqQ9nU4Hcib9druxfQl832dJMY/HYy9vDy5VAXVRKK65C1+Qu/FfwO4FPMAnUAF1dT6jBXEc8/Ubeog2KSAIAvvDY4IjsNgZyLKMv1wwd+GhMnIieVCw4Q0kmTzDgjzx1+v1d9dD2DQNRhq8Twqoi2BrQRiGLoZ34LdoAQQlNvtflqW7aws8z9vuIaL/AHmeQxsBHVi8BUOoNNu2gD5MPwdVVb3fgsvl8vJuue7jJZjdArj1iKJodB356DtQ1/Vz1zBNUw6gQ3YMGfOq6UzNMxxFAbWDFg4lF2BibEnG5jo4ggIqM5ZYMAsUHdOM2KEOw6sVUK3PqA3TX340JzZ2tMErB5hcqEG+NmbFgS/zTGKToUIwNY04n8/nlwsQOLMC6ur8QM7Acf4AF49hCmafcDMAAAAASUVORK5CYII=',
            ]
            ele.innerHTML=
            `<div class="reader-toolbar-item bookmark-fqxsydq">
                <img src='${document.querySelectorAll('.reader-toolbar-item')[2].children[1].innerText=='夜间'?this.imgurl[0]:this.imgurl[1]}' style="width: 22px; height: 22px; top: 6px; position: relative;">
                <div style="top: 10px; position: relative;">书签</div>
            </div>`
            document.querySelector('.reader-toolbar div').appendChild(ele)
            this.ele=ele
            this.createBookmark=function() {
                if(reader.bookmark.ele1){
                    document.body.children[8].remove();
                    reader.bookmark.ele1=undefined
                    return
                };
                var ele1=document.createElement('div')
                Object.assign(ele1.style,{
                    position: 'absolute',
                    height:'350px',
                    width:'400px',
                    maxWidth: '400px',
                    display: 'block',
                    top: '180px',
                    left: '169px',
                    transformOrigin: '100% 50% 0px',
                    backgroundColor: '#f6f6f6',
                    borderRadius:'20px',
                })
                ele1.innerHTML=
                `<div class="bookmark-title fqxsydq" style="padding: 8px; font-size: 18px; font-weight: bold; text-align: center; border-bottom: 1px solid var(--web-gray_08); height: 40px; width: 100%;">
                    书签
                    <button class="bookmark-add-button" style="float: right; margin-top: 2px; margin-right: 8px; background-color: var(--web-gray_08); color: black; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px;">添加</button>
                </div>
                <div class="bookmark-body fqxsydq" style="padding: 8px; height: 310px; overflow-y: auto; overflow-x: hidden; border-radius: 0px 0px 20px 20px; position: relative;"> <!-- 添加 position: relative; -->
                    <style>
                        .bookmark-body ul li {
                            padding: 6px;
                            margin-bottom: 3px;
                            border-bottom: 1px solid var(--web-gray_08);
                            position: relative; /* 确保子元素的绝对定位相对于当前元素 */
                            height: 36px;
                        }
                        .bookmark-body ul li:hover {
                            background-color: var(--web-gray_08);
                            /*transform: scale(1.1);*/
                            box-shadow: 0 0 5px #999;
                            display: block;
                        }
                        .tooltip:hover {
                            box-shadow: 0 0 5px #999;
                            cursor: pointer;
                        }
                        .tooltip {
                            visibility: hidden; /* 初始状态下隐藏工具提示 */
                            background-color: #555;
                            width: 120px;
                            height: 30px;
                            color: #fff;
                            text-align: center;
                            border-radius: 5px;
                            padding: 5px 10px;
                            position: absolute; /* 使用绝对定位 */
                            z-index: 1; /* 确保工具提示显示在其他元素之上 */
                            left: 50%; /* 水平居中 */
                            bottom: 5%; /* 工具提示显示在元素上方 */
                            transform: translateX(-50%); /* 调整为水平居中 */
                            opacity: 0; /* 初始状态下透明度为0 */
                            transition: opacity 0.3s; /* 添加过渡效果 */
                        }
                        .bookmark-body ul li:hover .tooltip {
                            visibility: visible; /* 鼠标悬停时显示工具提示 */
                            opacity: 1; /* 鼠标悬停时设置透明度为1 */
                        }
                    </style>
                    <ul style="list-style: none; padding: 0px; margin: 0px;">
                        <li>
                            <div>书签 : name 章节: name</div>
                            <input type="text" value="" style="position: absolute; top: 4px; left: 40px; width: 80%; height: 80%; z-index: 2; border: none; display: none;">
                            <span class="tooltip" style="left: 80px;" >传送至该章节</span>
                            <span class="tooltip" style="left: 280px;">删除该书签</span>
                        </li>
                    </ul>
                </div>`
                var text=ele1.children[1].children[1].innerHTML.replaceAll('  ','').replaceAll('\n','')
                for(let x=0;x<7;x++){
                    ele1.children[1].children[1].innerHTML+=text
                }
                var returndata1=reader.bookmark.loadBookmark()
                returndata1=='none' ? (()=>{
                    reader.bookmark.savenewmark('none')
                    returndata1=reader.bookmark.loadBookmark()
                })() : console.log('loadBookmark');
                (function(){
                    returndata1.forEach(e=>{
                        ele1.children[1].children[1].children[returndata1.indexOf(e)].children[0].innerHTML='书签 : '+e.name+' 章节: '+e.chapterName;
                    })
                    // 猎奇 html children还不能直接用filter和forEach
                    Array.from(ele1.children[1].children[1].children,)
                    .filter(e=>e.innerText.includes('章节: name')==true).forEach((x)=>{
                        x.style.display='none'
                        x.children[2].style.display='none'
                        x.children[3].style.display='none'
                    })
                })()
                ele1.children[0].children[0].addEventListener('click',(e)=>{
                    var thisele=Array.from(ele1.children[1].children[1].children,)
                    .filter(e=>e.innerText.includes('章节: name')==true)[0]
                    if(e.srcElement.innerText=='确定'){
                        thisele.children[0].innerHTML='书签 : '+thisele.children[1].value+' 章节'+unsafeWindow.__INITIAL_STATE__.reader.chapterData.title;
                        thisele.children[1].style.display='none'
                        thisele.children[2].style.display='block'
                        thisele.children[3].style.display='block'
                        var returndata2=thedata.read.bookmark.filter(e=>e.bookid==unsafeWindow.__INITIAL_STATE__.reader.chapterData.bookId)
                        returndata2.length == 1 ? (function(){
                            returndata2[0].bookmark.push({
                                name:thisele.children[1].value,
                                chapterName:unsafeWindow.__INITIAL_STATE__.reader.chapterData.title,
                                chapterid:location.pathname.split('/')[2],
                                scroll:thescroll.scrollTop/thescroll.scrollHeight,
                                time:String(new Date),
                            })
                            fqxsydqdata.savedata()
                        })() : console.log('有问题')
                        e.srcElement.innerText='添加'
                        return
                    }
                    thisele.style.display='block'
                    thisele.children[0].innerHTML='章节: name'
                    thisele.children[1].style.display='block'
                    thisele.children[1].focus()
                    e.srcElement.innerText='确定'
                },false)
                Array.from(ele1.children[1].children[1].children,).forEach(x=>{//传送至章节 加事件
                    x.children[2].addEventListener('click',(e)=>{
                        if(e.srcElement.style.display!=='none'){
                            var returndata3=thedata.read.bookmark.filter(e=>e.bookid==unsafeWindow.__INITIAL_STATE__.reader.chapterData.bookId)[0]
                            .bookmark[Array.from(ele1.children[1].children[1].children,).indexOf(e.srcElement.parentElement)]
                            window.location.search='?'+returndata3.scroll
                            window.location.pathname='/reader/'+returndata3.chapterid
                        }
                    })
                })
                document.body.appendChild(ele1)
                reader.bookmark.ele1=ele1
            }
            this.ele.addEventListener('click',this.createBookmark,false)
            this.loadBookmark=function(){
                var markdata=thedata.read.bookmark.filter(e=>e.bookid==unsafeWindow.__INITIAL_STATE__.reader.chapterData.bookId)
                if(markdata.length > 0){
                    return markdata[0].bookmark
                }
                return 'none'
            }
            this.savenewmark=function(e){
                if(e=='none'){
                    thedata.read.bookmark.push({
                        bookName:unsafeWindow.__INITIAL_STATE__.reader.chapterData.bookName,
                        bookid:unsafeWindow.__INITIAL_STATE__.reader.chapterData.bookId,
                        author:unsafeWindow.__INITIAL_STATE__.reader.chapterData.author,
                        bookmark:[
                            /*{
                                name:'',
                                chapterName:unsafeWindow.__INITIAL_STATE__.reader.chapterData.title,
                                chapterid:location.pathname.split('/')[2],
                                scroll:thescroll.scrollTop/thescroll.scrollHeight,
                                time:String(new Date),
                            },*/
                        ],
                    })
                    fqxsydqdata.savedata()
                }
            }
            this.onStringchange=function(){
                var targetNode = document.querySelectorAll('.reader-toolbar-item')[2]
                // 配置观察选项
                var config = { childList: true, characterData: true, subtree: true };
                // 创建一个观察器实例，并传入函数
                //此api性能小，不适合观察大量元素变化
                var observer = new MutationObserver(function(mutationsList) {
                    for (var mutation of mutationsList) {
                        /*if (mutation.type === 'childList') {
                            console.log('子节点发生变化:', mutation); 即图片改变
                        } else*/
                        if (mutation.type === 'characterData') {
                            //console.log('字符数据改变了:', mutation.target.nodeValue);
                            console.log('colorchange')
                            if(reader.bookmark.ele1){
                                reader.bookmark.ele1.style.backgroundColor=['日间','夜间'].indexOf(mutation.target.nodeValue) == 0 ? '#404040' : '#f2f2f2';
                            }
                            reader.bookmark.ele.children[0].children[0].src=
                            reader.bookmark.imgurl[[1,0][['日间','夜间'].indexOf(mutation.target.nodeValue)]]
                        }                        /*1,0相反*/
                    }
                });
                // 传入目标节点和配置选项开始观察
                observer.observe(targetNode, config);
            }
        }
    }
    window.fqxsydqdata={
        getdata:function(){
            if(!localStorage.fqxsydq){
                window.thedata={
                    name:'番茄阅读辅助器',
                    version:'1.540',
                    read:{
                        read_record:[],
                        last_read:{},
                        scroll_speed:1,
                        shortcut_key:{
                            changemark:'d',
                        },
                        bookmark:[

                        ],
                    },
                    download:{
                    },
                }
                this.update('bookmark')
                localStorage.fqxsydq=JSON.stringify(thedata)
            }else{
                window.thedata=JSON.parse(localStorage.fqxsydq)
                if(!thedata.read.bookmark || !thedata.read.bookmark.length){
                    window.thedata={
                        name:'番茄阅读辅助器',
                        version:'2.00',
                        read:{
                            read_record:thedata.read.read_record,
                            last_read:{},
                            scroll_speed:thedata.read.scroll_speed,
                            shortcut_key:{
                                changemark:'d',
                            },
                            bookmark:[

                            ],
                        },
                        download:{
                        },
                    }
                    this.savedata()
                    alert('原版本数据格式低，已更新，原数据删了，请重新添加书签')
                }
            }
        },
        savedata:function(){
            localStorage.fqxsydq=JSON.stringify(thedata)
        },
    }
    window.main = {
        "copybook" : async()=>{
            data=''
            img=[]
            if(Number(document.querySelectorAll('.widget')[2].children[0].value)<60){
                var b=confirm('小于60毫秒作者建议请一下后台\n开的时候玩手机就行了\n作者亲测50毫秒间隔下载也不会出错')
                if(!b==true)return;
            }
            console.log('下载模式:'+document.querySelectorAll('.widget')[1].children[0].value)
            var type=['原版','机改1','机改2'].indexOf(document.querySelectorAll('.widget')[1].children[0].value)
            document.querySelectorAll('.tooltip').forEach(x=>x.remove())
            alert('请等待提示，现开始复制\n可通过控制台查看进度\n会暂时去除显示进度功能')
            globalThis.a=document.querySelector('.page-directory-content')
            globalThis.num1=1
            for(let x of a.children){
                await downloader.dispose(x,'computer')
                await sleep(150)
            }
            await sleep(3000)
           await downloader.downloadd(type)
           downloader.loadrecord()
        },
        "loadhistory":async()=>{
            if(Object.values(thedata.read.last_read).length==3){
                if(await confirm('上次阅读书目为'+thedata.read.last_read.bookName+' 章节名称:'+thedata.read.last_read.bookName+' 点击确认即刻前往')){
                    location.href='https://fanqienovel.com/reader/'+thedata.read.last_read.chapterid
                }
            }
        },
    };
    window.gui = new lil.GUI({ title: '番茄阅读辅助器' });
    window.gui.domElement.style.userSelect = 'none';
    move()
    fqxsydqdata.getdata()
    if(location.href.includes('force_mobile=1')){
        alert('暂不支持手机排版的下载\n如使用电脑请保证长宽比例不低于1\n防止排版进入手机格式')
        return
    }
    var page1
    if(location.href.includes('/page/')){
        page1 = gui.addFolder('复制')
        page1.add(main,'copybook').name('复制本书全文 (仅支持电脑)')
        page1.add({setting:1},'setting',{'原版':1,'机改1':2,'机改2':3}).name('下载设置')
        page1.add({a:100},"a").min(1).name('下载速度')
        document.querySelectorAll('.controller')[1].innerHTML+='<div class="question">?</div>'
        document.querySelector('.question').addEventListener('click',()=>{
            alert('原版：下载原版章节\n机翻1：下载机翻1章节\n机翻2：下载机翻2章节\n机翻1效果如下\n第一卷\n第1章\n第2章\n......\n第二卷\n第100章...\n机翻2\n第一卷\n第1章\n第2章\n......\n第二卷\n第1章')
        })
        downloader.loadrecord()
        downloader.addstyle()
    }
    else if(location.href.includes('/reader/')){
        window.thescroll=document.querySelector('.muye-reader')
        reader.onload()
        window.scrollhref=location.pathname
        thescroll.onscroll=function(e){
            if(scrollhref!==location.pathname){
                reader.onload()
                window.scrollhref=location.pathname
                return
            }
            reader.record()
            fqxsydqdata.savedata()
        }
        document.querySelectorAll('.reader-toolbar-item')[1].addEventListener('click',async()=>{
            await sleep(1500)
            reader.loadrecord()
        })
        page1 = gui.addFolder('阅读')
        var page1_1 = page1.addFolder('滚动').close()
        reader.bookmark=new reader.newbookmark()//newbookmark
        reader.bookmark.onStringchange()
        reader.scroll.load(page1_1)
        reader.keyboard()
        if(localStorage.scroll=='true'){
            reader.scroll.stopButton.$button.click()
            reader.scroll.nextpage.$input.checked=true
        };
        window.onunload=function(){
            thedata.read.last_read={
                chapterid:location.pathname.split('/')[2],
                bookName:unsafeWindow.__INITIAL_STATE__.reader.chapterData.bookName,
                chapterName:document.querySelector('.muye-reader-title').innerText,
            }
            fqxsydqdata.savedata()
        }
    }
    gui.add(main,'loadhistory').name('返回上次阅读')
    gui.add({'bookshelf':()=>{location.href='https://fanqienovel.com/bookshelf'}},'bookshelf').name('返回书架')
})();