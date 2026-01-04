// ==UserScript==
// @name         去指定网站的广告、解除部分网站的复制粘贴限制（包含百度文库）、下载天猫超市的视频、京东比价和领卷助手、超星视频自定义倍率
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  练手项目
// @author       sky
// @match        http://m.yhdm.tv/show/*
// @match        http://m.yhdm.tv/v/*
// @match        https://wenku.baidu.com/*
// @match        https://hao.360.com/
// @match        https://hao.360.com/index.html
// @match        https://s.taobao.com/*
// @match         *://*/*
// @grant        GM_addStyle
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/406695/%E5%8E%BB%E6%8C%87%E5%AE%9A%E7%BD%91%E7%AB%99%E7%9A%84%E5%B9%BF%E5%91%8A%E3%80%81%E8%A7%A3%E9%99%A4%E9%83%A8%E5%88%86%E7%BD%91%E7%AB%99%E7%9A%84%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6%EF%BC%88%E5%8C%85%E5%90%AB%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%EF%BC%89%E3%80%81%E4%B8%8B%E8%BD%BD%E5%A4%A9%E7%8C%AB%E8%B6%85%E5%B8%82%E7%9A%84%E8%A7%86%E9%A2%91%E3%80%81%E4%BA%AC%E4%B8%9C%E6%AF%94%E4%BB%B7%E5%92%8C%E9%A2%86%E5%8D%B7%E5%8A%A9%E6%89%8B%E3%80%81%E8%B6%85%E6%98%9F%E8%A7%86%E9%A2%91%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/406695/%E5%8E%BB%E6%8C%87%E5%AE%9A%E7%BD%91%E7%AB%99%E7%9A%84%E5%B9%BF%E5%91%8A%E3%80%81%E8%A7%A3%E9%99%A4%E9%83%A8%E5%88%86%E7%BD%91%E7%AB%99%E7%9A%84%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6%EF%BC%88%E5%8C%85%E5%90%AB%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%EF%BC%89%E3%80%81%E4%B8%8B%E8%BD%BD%E5%A4%A9%E7%8C%AB%E8%B6%85%E5%B8%82%E7%9A%84%E8%A7%86%E9%A2%91%E3%80%81%E4%BA%AC%E4%B8%9C%E6%AF%94%E4%BB%B7%E5%92%8C%E9%A2%86%E5%8D%B7%E5%8A%A9%E6%89%8B%E3%80%81%E8%B6%85%E6%98%9F%E8%A7%86%E9%A2%91%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E7%8E%87.meta.js
// ==/UserScript==

(function() {
    'use strict';


//超星视频播放速率
function ChaoXingPlayRate(){
	let player = document.querySelector('video');
	let speed=player.playbackRate;
	let css ='#add{position:fixed;top:50px;right:20px;z-index:99999;background:red;border-radius:5px;padding:5px 10px;color:#fff;}';
	let css2 ='#sub{position:fixed;top:80px;right:20px;z-index:99999;background:red;border-radius:5px;padding:5px 10px;color:#fff;}';
	GM_addStyle(css);
	GM_addStyle(css2);
	let add = document.createElement('button');
	add.innerHTML='+';
	add.id='add';
	add.onclick=function(){
		speed=speed+1;
		player.playbackRate=speed;
	};
	let sub = document.createElement('button');
	sub.innerHTML='-';
	sub.id='sub'
	sub.onclick=function(){
		if(speed>=1){
			speed=speed-1;
		}
	    if(speed==0.5){
			speed=0;
		}
		player.playbackRate=speed;
	};
	document.body.appendChild(add);
	document.body.appendChild(sub);
     console.log('按钮');
}

//获取播放器
function getPlayer(){
	let css ='#add{position:fixed;top:110px;right:20px;z-index:99999;background:red;border-radius:5px;padding:5px 10px;color:#fff;}';
	GM_addStyle(css);
	let temp = document.createElement('button');
	temp.innerHTML='获取播放器';
	temp.id='getplayer'
	temp.onclick=temp.onclick=function(){
   /*     let test=document.getElementsByTagName('html')[0].innerHTML;
        alert(test);
         console.log(test);*/
		ChaoXingPlayRate();
	};
	document.body.appendChild(temp);
}

//京东返利比价小助手  使用的是开源js（我比较懒，就用别人的了：https://gitee.com/mzhren/tampermonkey/blob/master/jd.js）  安全性未知（介意的请勿使用）
function JDback(){
	 function create_link(text, href, position) {
	        if (!position) {
	            position = 0;
	        }

	        return $('<a>').css({
	            'position': 'fixed',
	            'top': (100 + 60 * position) + 'px',
	            'left': '20px',
	            'z-index': '10000',
	            'padding': '10px',
	            'border': '1px red solid',
	            'background': 'red',
	            'color': 'white'
	        }).text(text).attr({ 'href': href, 'target': '_blank' });
	    }

	    var doc = window.top.document;
	    var item_pathname = document.location.pathname;
	    var item_url = doc.location.protocol + "//" + doc.location.hostname + item_pathname;
	    var item_id = item_pathname.replace('/', '').replace('.html', '');
	    // mobile端
	    item_id = item_id.replace('product/', '');

	    var jd_union_base_url = "https://union.jd.com/proManager/index?pageNo=1&keywords=";
	    var jd_promo_url = jd_union_base_url + item_id;

	    // 慢慢买比价
	    var mmb_base_url = "http://tool.manmanbuy.com/historyLowest.aspx?url=";
	    var mmb_url = mmb_base_url + encodeURIComponent(item_url);

	    // 购物党比价
	    var gwd_base_url = 'https://www.gwdang.com/trend?url=';
	    var gwd_url = gwd_base_url + encodeURIComponent(item_url);


	    var $link1 = create_link('返利', jd_promo_url);
	    var $link2 = create_link('慢慢买比价', mmb_url, 1);
	    var $link3 = create_link('购物党比价', gwd_url, 2);
	    $('body').append($link1, $link2, $link3);
}



//下载天猫商品视频
function download_TMVideo(){
    let css ='#download_video{position:fixed;top:50px;right:20px;z-index:99999;background:red;border-radius:5px;padding:5px 10px;color:#fff;}';
    GM_addStyle(css);
	let Div = document.createElement('div');
	Div.id='download_video';
	Div.innerHTML='下载视频';
	document.body.appendChild(Div);
	document.getElementById('download_video').addEventListener('click',function(){
		let url=document.getElementsByTagName('video')[0].getAttribute('src');
        url = document.querySelector('video source').getAttribute('src');
        console.log(url);
		if(url){
            GM_download('https:'+url,'下载的天猫视频');
		}
		else{
            alert('未找到视频地址!');
        }
	});
}

function createButton(){
	let cot = document.createElement('div');
    let bt = '<input type="button" value="按钮"/>';
    cot.innerHTML=bt;
    cot.id='mybotton';
	cot.style="width:30px;height:30px;background-color:red;position: fixed;float:right;"
	document.body.appendChild(cot);
	// let bt  = document.createElement('button');
	// document.gete
}


//解除复制和粘贴
function disengage(){
	var i=0;
	var content = document.getElementsByTagName('div');
    var content2 = document.getElementsByTagName('textarea');
	for(i=0;i<content.length;i++){
		content[i].oncopy='return true';
        content[i].onpaste='return true';
	}
    for(i=0;i<content2.length;i++){
		content2[i].oncopy='return true';
        content2[i].onpaste='return true';
	}
}

//移除360首页广告
function removeAD360(){
	let content=document.getElementById('large2small');
    if(null!=content){
        console.log('ok');
        let temp = content.parentNode;
		temp.removeChild(content);
	}
	let content2 = document.getElementById('plane');
	if(null!=content2){
		let temp = content2.parentNode;
		temp.removeChild(content2);
	}
	let content3=document.getElementsByClassName('cont');
	if(content3.length>0){
        let temp = content3[0].parentNode;
		temp.removeChild(content3[0]);
	}
}
  //  addButton();
    console.log('sky脚本启动');
    disengage();
    if(window.location.href.toString().indexOf('baidu')!=-1){
		return;
	}
    if(window.location.href.toString().indexOf('//hao.360.com')!=-1){
        setTimeout(removeAD360(),1000);
        removeAD360();
		return;
	}
    if(window.location.href.toString().indexOf('tmall.com')!=-1){
        setTimeout(download_TMVideo(),1000);
		return;
	}
    if(window.location.href.toString().indexOf('tmall.com')!=-1){
        setTimeout(download_TMVideo(),1000);
		return;
	}
    if(window.location.href.toString().indexOf('jd.com')!=-1){
        setTimeout(JDback(),1000);
		return;
	}
    if(window.location.href.toString().indexOf('chaoxing.com/mycourse/studentstudy')!=-1){
        var myVar=setInterval(function(){
         console.log('开始');
		let player = document.querySelector('video');if(null!=player){
            console.log('找到');
        ChaoXingPlayRate();
		clearInterval(myVar);
	} }, 500);
//        return;
	}

     //去除http://m.yhdm.tv的广告
    if(window.location.href.toString().indexOf('http://m.yhdm.tv')!=-1){
        var playlist = document.getElementsByTagName("div");
        var i=0,index=0,index2=0;
        for(i=0;i<playlist.length;i++){
            if('listtit'==playlist[i].className&&index==0){
                index=i;
            }
            if('footer'==playlist[i].className){
                index2=i;
                break;
            }
        }
        index=index-1;
        index2=index2-1;
        playlist[index].style="display:none";
        playlist[index2].style="display:none";
        return;
    }

})();