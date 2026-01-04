// ==UserScript==
// @name         野作NFC内部工具
// @description  网易云歌单抓取
// @namespace    http://tampermonkey.net/
// @version      0.43
// @author       You
// @match        https://music.163.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=music.163.com
// @grant        GM_xmlhttpRequest
// @connect      pnxlw.com
// @require      https://code.jquery.com/jquery-1.11.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459980/%E9%87%8E%E4%BD%9CNFC%E5%86%85%E9%83%A8%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/459980/%E9%87%8E%E4%BD%9CNFC%E5%86%85%E9%83%A8%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    //定义语言输出
    var synth = window.speechSynthesis
    var u = new SpeechSynthesisUtterance();
    //汉语
    u.lang = 'zh-CN';
    u.rate = 1;
    function speak(textToSpeak) {
        u.text = textToSpeak;
        synth.speak(u)
    }


    let iconSvg = `<svg t="1665542548643" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1837" width="40" height="40"><path d="M869.262222 188.871111v646.257778H154.737778V188.871111h714.524444M921.6 136.533333H102.4v750.933334h819.2V136.533333z" fill="#F5CF5C" p-id="1838"></path><path d="M119.466667 308.679111h785.066666v52.337778h-785.066666zM204.8 222.663111h52.337778v52.337778H204.8zM290.133333 222.663111h52.337778v52.337778h-52.337778zM375.466667 222.663111h52.337777v52.337778H375.466667zM526.791111 756.622222h-29.582222L489.244444 638.862222V438.044444h45.511112v200.817778l-7.964445 117.76z" fill="#F5CF5C" p-id="1839"></path><path d="M438.044444 506.993778h147.911112v91.022222h-147.911112z" fill="#F5CF5C" p-id="1840"></path><path d="M566.727111 756.622222h31.061333l34.247112-155.079111-59.392-35.726222-41.642667 31.744 55.864889 27.534222-20.138667 131.527111zM457.272889 756.622222l-20.138667-131.527111 55.864889-27.534222-41.642667-31.744-59.392 35.726222 34.247112 155.079111h31.061333z" fill="#F5CF5C" p-id="1841"></path></svg>`
    setTimeout(()=>{
        let iconSvg2 = `<svg t="1676343371627" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2383" width="40" height="40"><path d="M451.84 326.826667s25.6-11.52 41.813333 6.826666c16.213333 18.773333 57.6 90.453333 57.6 162.133334 0 71.68-17.92 148.053333-37.12 173.226666-18.346667 25.6-36.693333 25.6-50.773333 16.213334-13.653333-8.96-228.693333-173.226667-240.213333-177.92-11.946667-4.693333-16.213333 6.826667-4.693334 68.693333 11.52 64-7.253333 81.493333-23.466666 84.053333-15.786667 1.28-64.426667-11.52-66.986667-141.226666-2.133333-129.28 32.426667-150.186667 48.64-150.186667 30.293333 0 261.546667 207.36 277.333333 205.653333 14.08-2.133333 20.906667-90.026667-5.973333-159.573333-30.72-75.093333 3.84-87.893333 3.84-87.893333m371.626667-129.28C901.12 351.573333 896 497.493333 896 512c0 14.506667 5.12 160.426667-72.533333 314.453333 0 0-20.053333 23.466667-50.346667 9.386667-29.866667-14.08-19.626667-50.773333-19.626667-50.773333s63.146667-121.6 61.44-270.933334V512c1.706667-149.333333-61.44-273.066667-61.44-273.066667s-10.24-36.693333 19.626667-50.773333c30.293333-14.08 50.346667 9.386667 50.346667 9.386667m-150.613334 69.12c63.573333 115.626667 59.306667 230.826667 58.453334 245.333333 0.853333 14.506667 5.12 124.586667-58.453334 249.6 0 0-20.053333 23.466667-50.346666 9.386667-29.866667-14.08-19.626667-50.773333-19.626667-50.773334s40.96-58.88 47.36-206.08V512c-4.266667-148.053333-47.36-203.52-47.36-203.52s-10.24-37.12 19.626667-50.773333c30.293333-14.08 50.346667 8.96 50.346666 8.96z" fill="" p-id="2384"></path></svg>`


        let html = `<div id="zing_screen" style="max-width:300px;position:fixed;right:60px;top:200px;background:white;border-radius:10px;padding:20px;border:1px solid black;">
<div id="zing_screen_playlist">
<button id='get_desc_button' style="font-size:20px">生成歌单九宫格图<span id="jindu"></span></button>
<input id="jgg" value="4" type="number">
<br/><br/>
        <button  id='set_nfc_button' style="font-size:20px;display:flex;align-items:center">刷新到NFC写入器${iconSvg2}</button>
        <div>
        模式
          <label ><input type="radio" name="mode" value="normal" checked />网页通用</label>
          <label ><input type="radio" name="mode" value="urlScheme" />苹果/打开app</label>
        </div>
        <img src="https://oss.pnxlw.com/pnxlw/2023/03/1678264343-14611678264277_.pic_.png" style="width:200px;height:200px">
        </div>
        </div>`
        if (/playlist/.test(location.hash) ) {
            $('body').append(html)
        }

        



        $('body').append(`<iframe id="my_iframe"></iframe>`)
        function getSongs(){
            let songs = Array.from(window.frames[0].document.querySelector("tbody").children)
            console.log(songs)
            let urlMode = $("[name='mode']").filter(":checked")[0].value

            songs = songs.map((dom)=>{
                let url = dom.children[1].querySelector("a").href
                let id = new URLSearchParams(url.split("?")[1]).get("id")
                if(urlMode=='urlScheme'){
                    url = `orpheus://song/${id}/?autoplay=1`
                }
                let name = dom.children[1].querySelector("b").title
                let singer =dom.children[3].children[0].title
                let brand = dom.children[4].children[0].children[0].title
                return {
                    id,
                    name,
                    url
                }

            })
            return songs
        }


        $(document).on('click','#set_nfc_button',(e)=>{
            e.preventDefault()
            let songs = getSongs()
            let songsName = window.frames[0].document.querySelector('h2').textContent
            let authorName = window.frames[0].document.querySelector('#m-playlist').querySelector(".name").textContent.replaceAll("\n","")

            let data = {songsName,authorName,songs}
            var _data=new FormData();
            _data.append("data",JSON.stringify( {songsName,authorName,}));
            //_data.append("authorName",authorName);
            //_data.append("nfcs",songs);
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://pnxlw.com/backNfc/setNFC.php",
                data:"data="+JSON.stringify( {songsName,authorName,songs}),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                onload: function(res) {
                    console.log(JSON.stringify(data))
                    console.log(res)
                    console.log(res.responseText);
                    speak("刷新成功")
                    //这里写处理函数
                }
            });
            

        })
        $(document).on('click','#get_desc_button',(e)=>{


            e.preventDefault()
            let songsName = window.frames[0].document.querySelector('h2').textContent
            let authorName = window.frames[0].document.querySelector('#m-playlist').querySelector(".name").textContent.replaceAll("\n","")
            let songs = getSongs()
            function downloadTxt(text, fileName){
                let element = document.createElement('a')
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
                element.setAttribute('download', fileName)
                element.style.display = 'none'
                element.click()
            }
            function downloadUrl(url,filename){
                let element = document.createElement('a')
                element.setAttribute('href', url)
                element.setAttribute('download', filename)
                element.style.display = 'none'
                element.click()
            }
            function loadIframeGetAblum(i){
                if(i==songs.length){
                    //downloadTxt(JSON.stringify(songs),songsName+'-'+authorName+'.json')
                    document.getElementById("jindu").textContent=''
                    afterLoadAllFrame()
                    return
                }
                document.getElementById("jindu").textContent=parseInt(((i+1)/songs.length)*100)+'%'
                document.getElementById("my_iframe").src =songs[i].url
                document.getElementById("my_iframe").onload = ()=>{
                    let src = window.frames[2].document.querySelector(".u-cover").children[0].src.split("?")[0]
                    songs[i].album = src
                    console.log("my_iframe onload",src)
                    loadIframeGetAblum(++i)


                }

            }
            let ROW = document.getElementById("jgg").value
            let COL = document.getElementById("jgg").value
            if(parseInt(ROW)*parseInt(COL)>songs.length){
                alert("歌曲数量不够")
                return
            }

            loadIframeGetAblum(0)

            let canvas = document.createElement('canvas')
            let canvasCtx = canvas.getContext('2d');
            let PAPER_WIDTH = 4724
            let PAPER_HEIGHT = 4724
            
            let ROW_GAP = 0
            let COL_GAP = 0
            let WIDTH = (PAPER_WIDTH-(ROW_GAP*(ROW-1)))/ROW
            let HEIGHT =(PAPER_WIDTH-(COL_GAP*(COL-1)))/COL


            let drwaCount = 0







            /*function drawImageInCtx(i){
                if(i==songs.length){
                    afterDrawOver()
                    return
                }
                let image = new Image()
                image.crossOrigin = ''
                image.onload = ()=>{
                    let x = 0
                    let y = 0
                    let w = 100
                    let h = 100
                    canvasCtx.drawImage(image,x,y,w,h)
                    drawImageInCtx(++i)
                }
                image.src=songs[i].album
            }
            */

            function afterLoadAllFrame(){
                console.log('afterLoadAllFrame')
                canvas.width = ROW*WIDTH
                canvas.height = COL*HEIGHT
                let over = false

                let imageMode = 'order'
                let randomAlbum = []
                function getRandomAlbum(){
                    let index = parseInt(Math.random()*songs.length)
                    if(randomAlbum.indexOf(index)==-1){
                        randomAlbum.push(index)
                        return songs[index].album
                    }else{
                        return getRandomAlbum()
                    }
                }

                for(let r = 0;r<ROW;r++){
                    for(let c = 0;c<COL;c++){
                        if(over){
                            return
                        }
                        let index = (r*ROW)+c
                        console.log('index',index)
                        let left = r*(WIDTH+ROW_GAP)
                        let top = c*(HEIGHT+COL_GAP)
                        let image = new Image()
                        image.crossOrigin = ''
                        image.onload = ()=>{
                            canvasCtx.drawImage(image,left,top,WIDTH,HEIGHT)
                            drwaCount+=1
                            console.log('drwaCount',drwaCount)
                            if(drwaCount==ROW*COL){
                                over=true
                                afterDrawOver()
                            }
                        }
                        switch (imageMode){
                            case 'order':
                                image.src = songs[index].album
                                break
                            case 'random':
                                image.src = getRandomAlbum()
                                break


                        }

                    }
                }
            }
            function afterDrawOver(){
                console.log('afterDrawOver')
                downloadUrl(canvas.toDataURL(),songsName+'-'+authorName+'.png')
            }

            //for(let i =0;i<songs.length;i++){
            //    window.location.href = songs[i].url
            //}
            console.log(songs)
        })

    },100)





    //展开网易云歌单
    var cookie = {
        set: function(key, val, time) {
            let date = new Date();
            let expires_days = time;
            date.setTime(date.getTime() + expires_days * 24 * 3600 * 1000);
            document.cookie = key + "=" + val + ";expires=" + date.toGMTString();
        },
        get: function(key) {
            let get_cookie = document.cookie.replace(/[ ]/g, "");
            let arr_cookie = get_cookie.split(";");
            let tips;
            for (let i = 0; i < arr_cookie.length; i++) {
                let arr = arr_cookie[i].split("=");
                if (key === arr[0]) {
                    tips = arr[1];
                    break;
                }
            }
            return tips;
        },
        delete: function(key) {
            let date = new Date();
            date.setTime(date.getDate() - 1);
            document.cookie = key + "=v; expires =" + date.toGMTString();
        }
    };
    function init_Cloud_Music() {
        if (cookie.get('os') != 'pc' || cookie.get('appver') != '2.7.1.198242') {
            cookie.set('os', 'pc', 30);
            cookie.set('appver', '2.7.1.198242', 30);
            location.reload();
        }
        if (location.href.indexOf('/playlist?id=') !== -1) {
            if (document.getElementById('m-playlist')) {
                document.querySelectorAll('.soil').forEach((item) => {
                    item.parentNode.removeChild(item);
                });
            }
        }
    }
    init_Cloud_Music();

})();