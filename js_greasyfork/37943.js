// ==UserScript==
// @name         QQ空间自动点赞
// @namespace    http://www.yuyuycy.com/
// @include      http*://user.qzone.qq.com/*
// @include      http*://h5.qzone.qq.com/*
// @version      1.0.4
// @description  QQ空间自动点赞！
// @author       遇见猫
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37943/QQ%E7%A9%BA%E9%97%B4%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/37943/QQ%E7%A9%BA%E9%97%B4%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==

    //var x=5,y=10;

    var INTERVAL = 10000; //刷新间隔

    function autoClick()
    {
        var zan=document.getElementsByClassName('item qz_like_btn_v3');
        for(var i=0;i<zan.length;i++){
            if(zan[i].attributes[6].value=='like'){
                zan[i].firstChild.click();
            }
        }
        	jQuery("#feed_tab_all").each(function(index,item){
			jQuery(item).trigger('click');
		});

    }

setTimeout(function(){  //使用  setTimeout（）方法设定定时120000毫秒=2分钟，否则不刷新页面非常占内存！

window.location.reload();//页面刷新
},120000);

window.setInterval(autoClick,INTERVAL);

//window.setInterval(autoClick,2000); //2000代表两秒屏幕下滑5px；