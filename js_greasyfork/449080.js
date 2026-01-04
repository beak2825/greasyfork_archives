// ==UserScript==
// @name         国资e学
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动学习国资e学视频
// @license      MIT
// @author       You
// @match        https://elearning.tcsasac.com/*
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.5.1.min.js
// @require      https://cdn.jsdelivr.net/npm/blueimp-md5@2.9.0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tcsasac.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449080/%E5%9B%BD%E8%B5%84e%E5%AD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/449080/%E5%9B%BD%E8%B5%84e%E5%AD%A6.meta.js
// ==/UserScript==
var study_css = ".egg_study_btn{outline:0;border:0;position:fixed;top:5px;left:5px;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#fff;color:#d90609;font-size:18px;font-weight:bold;text-align:center;box-shadow:0 0 9px #666777}.egg_manual_btn{transition:0.5s;outline:none;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#e3484b;color:rgb(255,255,255);font-size:18px;font-weight:bold;text-align:center;}.egg_auto_btn{transition:0.5s;outline:none;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#666777;color:rgb(255,255,255);font-size:18px;font-weight:bold;text-align:center;}.egg_setting_box{position:fixed;top:70px;left:5px;padding:12px 20px;border-radius:10px;background-color:#fff;box-shadow:0 0 9px #666777}.egg_setting_item{margin-top:5px;height:30px;width:140px;font-size:16px;display:flex;justify-items:center;justify-content:space-between}input[type='checkbox'].egg_setting_switch{cursor:pointer;margin:0;outline:0;appearance:none;-webkit-appearance:none;-moz-appearance:none;position:relative;width:40px;height:22px;background:#ccc;border-radius:50px;transition:border-color .3s,background-color .3s}input[type='checkbox'].egg_setting_switch::after{content:'';display:inline-block;width:1rem;height:1rem;border-radius:50%;background:#fff;box-shadow:0,0,2px,#999;transition:.4s;top:3px;position:absolute;left:3px}input[type='checkbox'].egg_setting_switch:checked{background:#fd5052}input[type='checkbox'].egg_setting_switch:checked::after{content:'';position:absolute;left:55%;top:3px}";
//GM_addStyle(study_css);
var palyUrl="https://elearning.tcsasac.com/#/home/courseDetail";

$(document).ready(function () {
    watchVideoStatus();
    let url = window.location.href;
    if (url == "https://elearning.tcsasac.com/#/home/homePage") {
        let ready = setInterval(function () {
           // if (document.getElementsByClassName("jss110")[0]) {
            if(true){
                clearInterval(ready);//停止定时器
                //创建"开始学习"按钮
                console.log('创建学习按钮')
                createStartButton();
            }
        }, 800);
    } else if (typeof GM_getValue("readingUrl") != 'object' && url == GM_getValue("readingUrl")) {
        try {
            let settingTemp = JSON.parse(GM_getValue('studySetting'));
            if (!settingTemp[7]) {
                createTip();//创建学习提示
            }
            reading(0);
        } catch (e) {
            createTip();//创建学习提示
            reading(0);
        }
    } else if (typeof GM_getValue("watchingUrl") != 'object' && url == GM_getValue("watchingUrl")) {
        try {
            let settingTemp = JSON.parse(GM_getValue('studySetting'));
            if (!settingTemp[7]) {
                createTip();//创建学习提示
            }
        } catch (e) {
            createTip();//创建学习提示
        }
        let randNum = 0;
        var checkVideoPlayingInterval = setInterval(function () {
            let temp = getVideoTag();
            if (temp.video) {
                if (!temp.video.muted) {
                    temp.video.muted = true;
                }
                if (temp.video.paused) {
                    temp.video.paused = false;
                   // console.log("正在尝试播放视频")
                    if (randNum == 0) {//尝试使用js的方式播放
                        try {
                            temp.video.play();//尝试使用js的方式播放
                        } catch (e) { }
                        randNum++;
                    } else {
                        try {
                            temp.pauseButton.click();//尝试点击播放按钮播放
                        } catch (e) { }
                        randNum--;
                    }
                } else {
                   // console.log("成功播放")
                    clearInterval(checkVideoPlayingInterval);
                    reading(1);
                }
            } else {
                console.log("等待加载")
            }
        }, 800);
    } else if (url.indexOf("exam") != -1 && url.indexOf("list") == -1) {
        //答题页面
        let ready = setInterval(function () {
            if (document.getElementsByClassName("title")[0]) {
                clearInterval(ready);//停止定时器
                //创建“手动答题”按钮
                createManualButton();
                //去除答题验证
                //cancelVerify();
                //开始答题
                doingExam();
            }
        }, 500);
    } else {
    }
});

//创建“开始学习”按钮和配置
function createStartButton() {    
    let body = document.getElementsByTagName("body")[0];    
    let startButton = document.createElement("button");
    startButton.setAttribute("id", "startButton");
    startButton.innerText = "开始学习";
    startButton.className = "egg_study_btn egg_menu";
    //添加事件监听
    try {// Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
        startButton.addEventListener("click", start, false);
    } catch (e) {
        try {// IE8.0及其以下版本
            startButton.attachEvent('onclick', start);
        } catch (e) {// 早期浏览器
            console.log("不学习何以强国error: 开始学习按钮绑定事件失败")
        }
    }
    //插入节点
    body.append(startButton)
}
//开始学习按钮的事件执行函数
async function start() {
    console.log('开始了');
    //视频列表dom
    var dom=$('#root div').eq(0).children("div").eq(2).children("div").children("div").children("div")
    var zy=dom.eq(1).children("ul").find("li")     //中央企业视频列表
    var df=dom.eq(2).children("ul").find("li")     //地方国资委视频列表
    var zyTitles=getTitle(zy)
    var dfTitles=getTitle(df)
    //判断本地存储是否已存在数据,并获取第一条未看视频的标题
    var unLearnTitle=checkLocalData('zy',zyTitles);
    if(unLearnTitle){
        window.localStorage.setItem('currentKey','zy');

        playVideo(unLearnTitle,zy);

    }else{
        console.log('中央视频已学完');
        unLearnTitle=checkLocalData('df',dfTitles);
        if(unLearnTitle){
           window.localStorage.setItem('currentKey','df');
           playVideo(unLearnTitle,df);
        }else{
            alert('学完了');
        }
    }
    //checkLocalData('df');
}


//获取视频列表的所有标题
function getTitle(obj){
    var titles=[];
    $.each(obj, function(key, val) {
       var title= $(val).find('.defineTitle').text()
       titles.push({title,status:false});
    });
    return titles;
}
//判断本地存储是否有内容
function checkLocalData(key,data){

    var localData=window.localStorage.getItem(key)
    if(localData){
       //存在则遍历获取第一个未看视频dom并点击进行学习
        var localData1=JSON.parse(localData);
        return getFirstVideo(data,localData1);
    }else{
        //将获取到的视频标题存入本地存储中
        window.localStorage.setItem(key,JSON.stringify(data));
        return getFirstVideo(data);
    }
}
//遍历第一个没有播放完的视频标题
function getFirstVideo(data,localData=null){
    var unLearnTitle;
    if(localData){
       //有本地数据则获取本地数据中的第一个未看视频标题

       unLearnTitle=getFirstTitlsUnLearn(localData)
       // console.log('有本地数据',unLearnTitle)
    }else{
        //没有本地数据则直接获取刚获取到的标题的第一个未看视频,即数组的第一条数据
       unLearnTitle=getFirstTitlsUnLearn(data)
     //  console.log('没数据',unLearnTitle)
    }
    return unLearnTitle
}
//遍历本地数据获取第一个未学习的视频标题
function getFirstTitlsUnLearn(obj){
    var title;
    $.each(obj, function(key, val) {
         if(val.status===false){
           //  console.log('xxx',val);
             title=val.title
             return false

         }
    });
    return title;
}
//点击列表播放视频
function playVideo(title,dom){
   $.each(dom, function(key, val) {
       var titleTemp= $(val).find('.defineTitle').text()
       if(title==titleTemp){
          // setTimeout(function(){
               let aaa=$(val).children('div').children('div.borBot').children('div').eq(0)[0].click(
                   function(e){
                       console.log('点击事件',e)
                   }
               );
           setTimeout(function(){
               watchPlaying()
           },1000)
           return false;
       }
    });
}
var playStatus;
//监听播放状态,当播放完毕后重新打开下一个未看视频
function watchPlaying(){
    if(playStatus){
     clearInterval(playStatus)
    }
   playStatus = setInterval(function () {

           let playing=window.localStorage.getItem('playing')
        //   console.log('监视当前播放状态',playing=='true');
           if(playing=='true'){
            }else{
                console.log('3秒后进入下一次点击');
                clearInterval(playStatus)
                setTimeout(function(){
                    start();
                },3000)
            }
        }, 3000);
}
//监视视频播放页面的播放状态
function watchVideoStatus(){
    window.localStorage.setItem('playing',true);   //初始化
    let ready = setInterval(function () {
           var currentUrl=window.location.href;
           if(currentUrl.indexOf (palyUrl)!==-1){
               let videoTitle=$('#course-video_html5_api').parent().parent().parent().next().children('div').eq(0).text()   //视频标题
               let videoStatus=$('#course-video_html5_api').parent().parent().next().find('span')  //视频状态文本
               let aaaaaa=videoStatus.next().text()
              
           //如果是播放页面
           let video=$('#course-video_html5_api').get(0)

           let currentTime=video.currentTime
           let paused=video.paused
           if(currentTime>100&&paused==true){

         // if(aaaaaa=='已学'){
              //判断为已学完,更新本地存储,并关闭当前页面
               console.log('学完了')
               updateStorage(videoTitle)
               window.localStorage.setItem('playing',false);
               closeWin();
           }else{
               video.play();
               window.localStorage.setItem('playing',true);
           }
          }
        }, 3000);
}
//更新本地存储数据
function updateStorage(title){
    let currentKey=window.localStorage.getItem('currentKey');
    if(!currentKey){
        alert('未获取当前播放的所属板块')
        return;
    }
    let data=window.localStorage.getItem(currentKey);
    if(!data) return;
    data=JSON.parse(data)
    $.each(data, function(key, val) {
         if(val.title===title){
             val.status=true;
             return false

         }
    });
    let newData=JSON.stringify(data)
    window.localStorage.setItem(currentKey,newData);
}

//默认情况下, chrome 只允许 window.close 关闭 window.open 打开的窗口,所以我们就要用window.open命令,在原地网页打开自身窗口再关上,就可以成功关闭了
function closeWin() {
    try {
         window.opener = window;
         var win = window.open("","_self");
         win.close();
         top.close();
    } catch (e) {
        }

}




