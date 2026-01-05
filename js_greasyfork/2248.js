// ==UserScript==
// @name       百度音乐盒去广告
// @namespace  http://use.i.E.your.homepage/
// @version    0.2.3
// @description  突破会员限制，去除百度音乐盒广告//To remove the Ads on baidu play box
// @match      http://play.baidu.com/*
// @grant       none
// @copyright  2014/06, WangHsin-che
// @downloadURL https://update.greasyfork.org/scripts/2248/%E7%99%BE%E5%BA%A6%E9%9F%B3%E4%B9%90%E7%9B%92%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/2248/%E7%99%BE%E5%BA%A6%E9%9F%B3%E4%B9%90%E7%9B%92%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==


function run(){

var width_c4=$('.column4').width();
var right_c2=$('.column2').css('right');

$('.column3').css({'right':0});
$('.column4').css({'display':'none'});
$('.column2').css({'right':function(){return parseInt(right_c2,10)-width_c4;}});
$('.m-client-product').css({'display':'none'});
$('#pauseAd').remove();
$('.down-mobile').remove();
console.log('Ads have been removed~');
    
}

var i=0,t=window.setInterval(function(){//百度云把一些内容放到后面加载,因此我设置了一个延时循环，每隔100ms选择一下所需的元素，当所需的元素存在时，开始脚本，同时停止延时循环
	if($('#pauseAd').length>0||i>100){
                window.clearInterval(t);
		run();
	}
    i++;
    console.log('waiting');
},100);
