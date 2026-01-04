// ==UserScript==
// @name         hitsz xuetangx autoplay 学堂 自动播放
// @namespace    https://hitsz.xuetangx.com/lms#/video/
// @version      0.4
// @description  hitsz xuetangx 自动播放
// @author       You
// @match        https://hitsz.xuetangx.com/lms
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376035/hitsz%20xuetangx%20autoplay%20%E5%AD%A6%E5%A0%82%20%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/376035/hitsz%20xuetangx%20autoplay%20%E5%AD%A6%E5%A0%82%20%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

window.onload=(function () {

    const MAX_DELAY = 15 // 切课时的最大延迟，单位：秒

    const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))

    const start = async function () {
        console.log('hitsz学堂x助手已启动,5s后开始操作')

        /**
	*内置函数
	**/
        function getElementByXpath(path) {
            return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }
        var hasClass = (function(){
            var div = document.createElement("div") ;
            if( "classList" in div && typeof div.classList.contains === "function" ) {
                return function(elem, className){
                    return elem.classList.contains(className) ;
                } ;
            } else {
                return function(elem, className){
                    var classes = elem.className.split(/\s+/) ;
                    for(var i= 0 ; i < classes.length ; i ++) {
                        if( classes[i] === className ) {
                            return true ;
                        }
                    }
                    return false ;
                } ;
            }
        })() ;

        /**
	*防止因为页面失去焦点或者转移页面而暂停
	**/
        document.addEventListener("blur", function(){
            console.log('点击播放');
            $(video).click();
        }
                                 );
        document.addEventListener("visibilitychange", function(){
            if(document.hidden==true)
            {$(video).click();
             console.log('点击播放');}
        });
        await sleep(5000);

        var first_convert=true;
        var next_chapter=null;
        /**
     *每1s检验一次播放情况
     **/
        while (true) {
            var finish_time=getElementByXpath('//*[@id="video-box"]/div/div/div[1]/div[2]/span[2]/text()');
            var start_time=getElementByXpath('//*[@id="video-box"]/div/div/div[1]/div[2]/span[1]/text()');
            if(document.getElementsByClassName('xt_video_player_controls cf xt_video_player_controls_show')[0]!=null){var start_button=document.getElementsByClassName('xt_video_player_controls cf xt_video_player_controls_show')[0].firstChild}

            var current_chapter = document.getElementsByClassName("section-video-name video-active")[0];
        if(current_chapter)var current_chapter_click_button = current_chapter.querySelector('.element-wrap');
            var target_play_speed=$("ul.xt_video_player_common_list li:first")[0]

            const delay = Math.floor(Math.random() * MAX_DELAY * 1000) + 1000

            if (!(hasClass(target_play_speed, "xt_video_player_common_active") )) {
                console.log('提升到2.5倍速')
                console.log(target_play_speed)
                target_play_speed.click()
            }

            /*if ($('.volumeBox').find('.passVolume').width() != 0) {
				console.log('静音')
				$('.volumeIcon').click()
			}*/

            if (start_time.isEqualNode(finish_time)) {
                console.log('本节完成，' + delay / 1000 + ' 秒后将切到下一课')
                await sleep(delay)
                next_chapter_button.click();
            }

            //console.log(start_button);
            if(start_button.className=='xt_video_player_play_btn fl')
            {	start_button.click();
            }

            /**
     *点击播放列表,获取所有播放数据
     **/
            var folder1=document.getElementsByClassName('icon-plus')
            for(var i =0,len=folder1.length;i<len;i++)
            {
                folder1[i].click();
            }
            //console.log(folder1)
            var folder2=document.getElementsByClassName('el-icon-arrow-down')
            for(var j =0,length=folder2.length;i<length;i++)
            {
                folder2[i].parentNode.click()
            }
            /**
     *寻找下一个播放视频
     **/
            var video_list=document.getElementsByClassName("section-video-name");
            for(let e = 0 ; e < video_list.length ; e++) {
                if (e!=video_list.length-1&&video_list.length>1&&video_list[e].className=="section-video-name video-active"&&first_convert==true)
                {console.log(video_list[e].className)
                 console.log('当前集数(从0开始计数) 为%d',e)
                 console.log('所有可播放dom为%o',video_list);
                 next_chapter=video_list[e+1];
                 console.log('下一集数的dom为%o',next_chapter);
                 console.log('是否为第一次赋值%s',first_convert);
                 first_convert=false
                }
            };
            if(next_chapter)var next_chapter_button=next_chapter.querySelector('.element-wrap');
            //console.log(current_chapter);
            //console.log(next_chapter);
            //console.log(first_convert);
            //console.log(video_list);
            //console.log(folder2);
            await sleep(1000);
        }
    }

    start()
})









