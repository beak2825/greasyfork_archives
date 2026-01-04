// ==UserScript==
// @name         ykm_qwsp
// @namespace    全网视频解析
// @version      0.3
// @description  仅供学习，请勿商用，支持全网视频解析网页版观看会员视频等
// @author       ykm
// @match        https://v.qq.com/x/cover/*
// @match        https://v.youku.com/v_show/*
// @match        https://www.iqiyi.com/*
// @match        http://www.le.com/ptv/vplay/*
// @match        https://www.mgtv.com/b/*
// @match        https://www.bilibili.com/bangumi/play/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youku.com
// @grant        GM_download
// @grant        GM_addStyle
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/457173/ykm_qwsp.user.js
// @updateURL https://update.greasyfork.org/scripts/457173/ykm_qwsp.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let css = `
        #download_video1{
      position: fixed;
      top: 5px;
      right: 8px;
      font-size:14px;
      color:#ffffff;
      z-index: 99999;
      background: #2c26f4;
      padding: 15px 22px;
      border-radius: 5px;
    }
     #download_video2{
      position: fixed;
      top: 5px;
      right: 8px;
      font-size:18px;
      color:#ffffff;
      z-index: 99999;
      background:#f6a20a;
      padding: 15px 40px;
      border-radius: 5px;
    }
    .Card css-oyqdpg{
        display:none;
    }
    `
     GM_addStyle(css)
    const jk ='https://jx.we-vip.com/?url=';
    const urls =  window.location.href;
    const sub = urls.substring(0, urls.indexOf(".com") + 4);
    const sub1 = "https://v.qq.com";
    const sub2 = "https://v.youku.com";
    const sub3 = "https://www.iqiyi.com";
    const sub4 = "http://www.le.com";
    const sub5 = "https://www.mgtv.com";
    const sub6 = "https://www.bilibili.com";
    const url = jk + window.location.href
    const name_title = document.querySelector("title")
    const title_jic1 = name_title.innerText;
    const features = 0
    const location = 0
    if(sub ==sub1){
        const patt=new RegExp('电影','i') ;
        const result=patt.test(title_jic1);
        if(result == true){
            const name_ji = document.querySelector(".play-title__content")
            const name_jic1 = name_ji.innerText;
            const name_n1_ji = name_jic1
            const DIV = document.createElement('div')
            DIV.id = 'download_video1'
            DIV.innerHTML ='点击播放 《'+ name_jic1+'》'
            document.body.appendChild(DIV)
            document.getElementById('download_video1').addEventListener('click',function(e){
                const name_tx = name_n1_ji
                window.open (url, name_tx, features,location)
            })
        }else if(result == false ){
            //const name_ji = document.querySelector(".play-title__content")
           // const name_jic1 = name_ji.innerText;
            let DIV1 = document.createElement('div')
            DIV1.id = 'download_video2'
            DIV1.innerHTML ='点击播放 '
            document.body.appendChild(DIV1)
            document.getElementById('download_video2').addEventListener('click',function(e){
                const name_tx = '123456'
                window.open (url, name_tx, features,location)
            })
        }else {
            console.log("333333333333333");
        }
    }else if(sub ==sub2){
        const patt=new RegExp('电视剧','i') ;
        const result=patt.test(title_jic1);
        if(result == true){
            const name_nyk = document.querySelector(".subtitle>a")
            const name_n1yk = name_nyk.innerText;
            const name_jiyk = document.querySelector(".subtitle>span")
            const name_jic1yk = name_jiyk.innerText;
            const name_jiyks = name_n1yk +'-'+ name_jic1yk
            console.log(name_jiyks);
            let DIV3 = document.createElement('div')
            DIV3.id = 'download_video1'
            DIV3.innerHTML ='点击播放  《'+ name_jiyks+'》'
            document.body.appendChild(DIV3)
            document.getElementById('download_video1').addEventListener('click',function(e){
                const nameyk = name_jiyks
                window.open (url, nameyk, features,location)
            })
        }else if(result == false){
            const name_dynyk = document.querySelector(".title-width>.subtitle")
            const name_dyn1yk = name_dynyk.innerText;
            const DIV4 = document.createElement('div')
            DIV4.id = 'download_video2'
            DIV4.innerHTML ='点击播放  《'+ name_dyn1yk+'》'
            document.body.appendChild(DIV4)
            document.getElementById('download_video2').addEventListener('click',function(e){
                const nameyk = name_dyn1yk
                window.open (url, nameyk, features,location)
            })
        }else {
            console.log("333333333333333");
        }
    }else if(sub ==sub3){
        const patt=new RegExp('电影','i') ;
        const result=patt.test(title_jic1);
        if(result == true){
            const name_titles = name_title.innerText
            const atitle_jie =name_titles.indexOf("-完整版")
            const name_mz = name_titles.substring(0, atitle_jie);
            let DIV30 = document.createElement('div');
            DIV30.id = 'download_video1';
            DIV30.innerHTML ='点击播放  《'+ name_mz+'》'
            document.body.appendChild(DIV30);
            document.getElementById('download_video1').addEventListener('click',function(e){
                const name_aqy = name_mz
                window.open (url, name_aqy, features,location)
            })
        }else if(result == false){
           // const name_jiaqy = name_title.innerText
            let DIV31 = document.createElement('div');
            DIV31.id = 'download_video2';
            DIV31.innerHTML ='点击播放  '
            document.body.appendChild(DIV31);
            document.getElementById('download_video2').addEventListener('click',function(e){
                const name_aqy = '---'
                window.open (url, name_aqy, features,location)
            })
        }else {
            console.log("333333333333333");
        }
    }else if(sub ==sub4){
        const patt=new RegExp('电影','i') ;
        const result=patt.test(title_jic1);
        if(result == true){
            const name_titlels = name_title.innerText
            const atitle_jiels =name_titlels.indexOf(" - 在线观看")
            const name_mzls = name_titlels.substring(0, atitle_jiels);
            console.log(name_mzls);
            let DIV40 = document.createElement('div');
            DIV40.id = 'download_video1';
            DIV40.innerHTML ='点击播放  《'+ name_mzls+'》'
            document.body.appendChild(DIV40);
            document.getElementById('download_video1').addEventListener('click',function(e){
                const namels = name_mzls
                window.open (url, namels, features,location)
            })
        }else if(result == false){
            let DIV41 = document.createElement('div');
            DIV41.id = 'download_video2';
            DIV41.innerHTML ='点击播放 '
            document.body.appendChild(DIV41);
            document.getElementById('download_video2').addEventListener('click',function(e){
                const namels = '0'
                window.open (url, namels, features,location)
            })
        }else {
            console.log("333333333333333");
        }
    }else if(sub ==sub5){
        const patt=new RegExp('电影','i') ;
        const result=patt.test(title_jic1);
        if(result == true){
            const name_titlesmg = name_title.innerText;
            const atitle_jiemg =name_titlesmg.indexOf("-电影")
            const name_mg = name_titlesmg.substring(0, atitle_jiemg);
            let DIV51 = document.createElement('div');
            DIV51.id = 'download_video1';
            DIV51.innerHTML ='点击播放  《'+ name_mg+'》'
            document.body.appendChild(DIV51);
            document.getElementById('download_video1').addEventListener('click',function(e){
                var namemg = name_mg
                window.open (url, namemg, features,location)
            })
        }else if(result == false){
            let DIV52 = document.createElement('div');
            DIV52.id = 'download_video2';
            DIV52.innerHTML ='点击播放 '
            document.body.appendChild(DIV52);
            document.getElementById('download_video2').addEventListener('click',function(e){
                console.log(url)
                var namemg = '0'
                window.open (url, namemg, features,location)
            })
        }else {
            console.log("333333333333333");
        }
    }else if(sub ==sub6){
        const patt=new RegExp('电影','i') ;
        var result=patt.test(title_jic1);
        if(result == true){
            const name_titlesbl = name_title.innerText
            const atitle_jiebl =name_titlesbl.indexOf("-电影")
            const name_bl = name_titlesbl.substring(0, atitle_jiebl);
            const DIV60 = document.createElement('div');
            DIV60.id = 'download_video1';
            DIV60.innerHTML ='点击播放  《'+ name_bl+'》'
            document.body.appendChild(DIV60);
            document.getElementById('download_video1').addEventListener('click',function(e){
                const namebl = name_bl
                window.open (url, namebl, features,location)
            })
        }else if(result == false){
            let DIV61 = document.createElement('div');
            DIV61.id = 'download_video2';
            DIV61.innerHTML ='点击播放 '
            document.body.appendChild(DIV61);
            document.getElementById('download_video2').addEventListener('click',function(e){
                const namebl = '0'
                window.open (url, namebl, features,location)
            })
        }else {
            console.log("333333333333333");
        }
    }
})();