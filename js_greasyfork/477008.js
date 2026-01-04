// ==UserScript==
// @name        hn.webtrn.cn-湘培网-湖南省事业单位工作人员管理平台-湖南开放大学-全自动看课程
// @namespace    代刷vx:shuake345
// @version      0.2
// @description  自动播放|自动切换下一课程|自动答题，代刷vx:shuake345
// @author       代刷vx:shuake345
// @match        *://hnssydw-kfkc.webtrn.cn/learnspace/*
// @match        *://hn.webtrn.cn/u/student/*
// @icon         https://www.google.com/s2/favicons?domain=webtrn.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477008/hnwebtrncn-%E6%B9%98%E5%9F%B9%E7%BD%91-%E6%B9%96%E5%8D%97%E7%9C%81%E4%BA%8B%E4%B8%9A%E5%8D%95%E4%BD%8D%E5%B7%A5%E4%BD%9C%E4%BA%BA%E5%91%98%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0-%E6%B9%96%E5%8D%97%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6-%E5%85%A8%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%AF%BE%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/477008/hnwebtrncn-%E6%B9%98%E5%9F%B9%E7%BD%91-%E6%B9%96%E5%8D%97%E7%9C%81%E4%BA%8B%E4%B8%9A%E5%8D%95%E4%BD%8D%E5%B7%A5%E4%BD%9C%E4%BA%BA%E5%91%98%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0-%E6%B9%96%E5%8D%97%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6-%E5%85%A8%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%AF%BE%E7%A8%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.alert = function() {}
	window.onbeforeunload = null
	window.confirm = function() {
		return true
	}

    var Zhuyurl = 'student/study/myCourse'
	var Chuyurl = 'play'

    document.addEventListener("visibilitychange", function() {
		console.log(document.visibilityState);
		if (document.visibilityState == "hidden") {
        //yincang
        } else if (document.visibilityState == "visible") {
			if (document.URL.search(Zhuyurl) > 1 ) {
				setTimeout(sxrefere, 1000)
			}
		}
	});
    function fhback() {
		window.history.go(-1)
	}

	function gbclose() {
		window.close()
	}

	function sxrefere() {
		window.location.reload()
	}
    function Zhuy() {
        if (document.URL.search(Zhuyurl) > 1 ) {
			document.querySelectorAll("body > div.container.clearfix.mt20 > div.my-center2R.pull-right.bd3 > div> div.my-center2RM1.pull-left > a.trans")[1].click()
            setTimeout(Starlea,2154)
			}
	}
    function Starlea(){
    document.querySelectorAll("#courseList > li > div > p > a")[0].click()
    }
    var N=new Date
    var Y=N.getFullYear ()
    setTimeout(Zhuy,3455)
    function qdjxbf(){
        console.log(Y)
        if((Y+'').substr(3)=='3'){
        var Time1=document.querySelectorAll('iframe')[2].contentWindow.document.querySelectorAll('iframe')[0].contentWindow.document.querySelector("#screen_player_time_1").innerText
        var Time2=document.querySelectorAll('iframe')[2].contentWindow.document.querySelectorAll('iframe')[0].contentWindow.document.querySelector("#screen_player_time_2").innerText
        if(Time2!=='00:00'){//no+加载
            document.querySelectorAll('iframe')[2].contentWindow.document.querySelectorAll('iframe')[0].contentWindow.document.querySelector('[class="coursespace screen-player-btn-icon icon-play-sp-fill"]').click()
        }else if(Time1==Time2 ){
            var Bofanging=document.querySelectorAll('iframe')[2].contentWindow.document.getElementsByClassName('s_point hasappend s_pointerct')[0].querySelector("div > div.item_done_icon.item_done_pos").className
            if(Bofanging=='item_done_icon item_done_pos done_icon_show'){
                if(document.querySelectorAll('iframe')[2].contentWindow.document.querySelectorAll("[class='item_done_icon item_done_pos']").length!==0){
                document.querySelectorAll('iframe')[2].contentWindow.document.querySelectorAll("[class='item_done_icon item_done_pos']")[0].click()
                }else{
                setTimeout(gbclose,1212)}
            }
            document.querySelector('div.insert_item>label>input').click()
            document.getElementById('save_btn').click()
            setTimeout(function (){document.getElementById('continue_btn').click()},2000)
        }
        if(document.getElementsByClassName('s_point s_pointerct')[0].querySelector('div.item_done_icon').className.search('show')>0){
            var imgs=document.getElementsByClassName('s_point')
            for (var i=0;i<imgs.length;i++){
                if(imgs[i].className.search('pointerct')>1){
                    imgs[i+1].click()

                }
            }
        }
        }
        
    }
    setInterval(qdjxbf,10000)

    function gb(){
        if((Y+'').substr(3)=='3'){
     var Bofanging=document.querySelectorAll('iframe')[2].contentWindow.document.getElementsByClassName('s_point hasappend s_pointerct')[0].querySelector("div > div.item_done_icon.item_done_pos").className
     if(Bofanging=='item_done_icon item_done_pos done_icon_show'){
        setTimeout(gbclose,1212)
        }
     }
    }


    function qd(){
        if(document.getElementsByClassName('layui-layer-btn0').length>0){document.getElementsByClassName('layui-layer-btn0')[0].click()}
    }
    setInterval(qd,6000)

    function qt(){
        document.getElementsByClassName('s_coursetit')[0].innerText="脚本不易，跪求右下角支持，代刷代写V：shuake345"
        var d1=document.getElementById('dumaScrollAreaId_15Area');

        var img=document.createElement("img");
        img.style="width:230px; height:230px;"
        img.src="https://img.nuannian.com/files/images/22/0921/1663766968-1460.jpg";
        d1.appendChild(img);
    }
    setTimeout(qt,100)

})();