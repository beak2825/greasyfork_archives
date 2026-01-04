// ==UserScript==
// @name         浙江省社会人员学历提升 - 自动刷课
// @namespace    *
// @version      0.0.1
// @description  自动播放“浙江开放大学学历提升”视频
// @author       youwenqwq
// @match        https://xlts.zjlll.net/student/course/chapter*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486841/%E6%B5%99%E6%B1%9F%E7%9C%81%E7%A4%BE%E4%BC%9A%E4%BA%BA%E5%91%98%E5%AD%A6%E5%8E%86%E6%8F%90%E5%8D%87%20-%20%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/486841/%E6%B5%99%E6%B1%9F%E7%9C%81%E7%A4%BE%E4%BC%9A%E4%BA%BA%E5%91%98%E5%AD%A6%E5%8E%86%E6%8F%90%E5%8D%87%20-%20%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==



(function() {

    console.log('浙江省社会人员学历提升自动刷课,弃洞！');
    setInterval(function(){
    	 //等网站生成player之后，才能进行一系统的播放操作
        if (document.getElementById('player')){
            if (document.getElementsByClassName('xgplayer-ended').length != 0 && document.getElementsByClassName('comp-icon').length > 0){
                let tasks = document.getElementsByClassName('resource-box');
                let task = null;
                for(let i in tasks){
                    let current = tasks[i].getElementsByClassName('comp-icon');
                    console.log(current.length);
                    task = tasks[i];
                    if(current.length == 0 && task.getElementsByClassName('home').length == 0){ // 判断是否已完成，忽略home
                        console.log(task);
                        break;
                    }
                }

                task.click();
                console.log('下一课');
                location.reload();   //刷新网页以读取新的已完成标识
            }
            
        else{
            	 // 播放
                if (document.getElementsByClassName('xgplayer-playing').length != 1) {
                    document.getElementsByClassName('xgplayer-icon-play')[0].click();
                }
            }
        }
    }, 800);
})();

