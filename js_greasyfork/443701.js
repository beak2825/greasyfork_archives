// ==UserScript==
// @name         抖音&快手网页端去水印视频下载
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  抖音&快手网页版添加下载按钮
// @author       爱孤行
// @license MIT
// @match        *://*kuaishou.com/*
// @require	     https://code.jquery.com/jquery-1.12.4.min.js
// @icon         https://s1.ax1x.com/2022/04/22/L2osI0.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443701/%E6%8A%96%E9%9F%B3%E5%BF%AB%E6%89%8B%E7%BD%91%E9%A1%B5%E7%AB%AF%E5%8E%BB%E6%B0%B4%E5%8D%B0%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/443701/%E6%8A%96%E9%9F%B3%E5%BF%AB%E6%89%8B%E7%BD%91%E9%A1%B5%E7%AB%AF%E5%8E%BB%E6%B0%B4%E5%8D%B0%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function() {
    'use strict';

    setInterval(function(){
        //console.log(document.getElementsByClassName('downLoadVideo'))
        createButton()
    },1500)
    function createButton(){
        if(document.getElementsByClassName('downLoadVideo').length < 1 && document.getElementsByClassName('player-video').length > 0){
            kuaishouButton();
        	//document.getElementsByClassName('downLoadVideo').length < 1 &&
        }else if(document.getElementsByClassName('downLoadVideo').length < 1 && document.getElementsByClassName('OFZHdvpl').length > 0){
        	douyinButton();
        }
    }
	function douyinButton(){
        let html = `<div class="NRiH5zYV"><div class="pBxTZJeH Qz1xVpFH"><div class="tzVl3l7w" style="height:40px;"><svg width="48" style="padding-left:10px;" height="48" xmlns="http://www.w3.org/2000/svg" class="" viewBox="0 0 48 48"><path d="M26 14l-8 8-8-8h5v-12h6v12zM15 22h-12v8h32v-8h-15zM28 26h-4v-2h6v2z"></path></svg></div><div class="hfgGrUTS" style="font-size:14px;">下载</div></div></div>`
		let div = document.createElement('div');
		div.className = 'downLoadVideo';
		div.addEventListener('click',downLoadVideo)
		div.innerHTML = html
		$('.OFZHdvpl').children().eq(3).after(div)
	}
	function kuaishouButton(){
		var button = document.createElement('button')
		button.style = "width: 56px;height: 56px;font-size: 14px;line-height: 40px;text-align: center;background: rgba(255, 255, 255,0.15);color: #fff;border-radius: 100%;cursor: pointer;border:none;position: relative;top: -200px;"
		button.innerHTML = '下载';
		button.className = 'downLoadVideo';
		button.addEventListener('click',function(){
		    downLoadVideo()
		})
		button.onmouseover = function(){
		    button.style = "width: 56px;height: 56px;font-size: 14px;line-height: 40px;text-align: center;background: rgba(255, 255, 255,0.35);color: #fff;border-radius: 100%;cursor: pointer;border:none;position: relative;top: -200px;";
		}
		button.onmouseout = function(){
		    button.style = "width: 56px;height: 56px;font-size: 14px;line-height: 40px;text-align: center;background: rgba(255, 255, 255,0.15);color: #fff;border-radius: 100%;cursor: pointer;border:none;position: relative;top: -200px;";
		}
		document.getElementsByClassName('video-switch')[0].appendChild(button)
	}
    function getUrl(){
        var url = false;
		if(document.getElementsByClassName('player-video').length > 0){
			url = document.getElementsByClassName('player-video')[0].src;
		}else if(document.getElementsByClassName('xg-video-container').length > 0){
			//url = $(".xg-video-container").children().eq(0).children()[2].src
            url = $("video").eq(0).children()[2].src
		}

        return url;
    }
    function downLoadVideo(){
        var url = getUrl();
//         console.log(url);
//         return;
        if(!url){
            alert('脚本出错，请联系作者更新')
            return;
        }
        window.open(url);
        //         var name = document.getElementsByClassName('video-info-title')[0].innerText
        //         var downLink = document.createElement('a');
        //         downLink.href = url;
        //         downLink.download = name+'.mp4';
        //         downLink.style.display = 'none';
        //         document.body.appendChild(downLink);
        //         downLink.click();
        //         document.body.removeChild(downLink);
    }
})();