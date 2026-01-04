// ==UserScript==
// @name         课堂派增强
// @namespace    http://tampermonkey.net/
// @version      3.4.2
// @description  看互动课件时，可用左右箭头翻页代替鼠标点击；看回放时，点击视频实现播放暂停，左右箭头快进快退，空格翻页
// @author       han
// @match        https://www.ketangpai.com/*
// @match        https://www.ncepu.ketangpai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ketangpai.com
// @grant        unsafeWindow
// @license      GPL-3.0-only

// @downloadURL https://update.greasyfork.org/scripts/442191/%E8%AF%BE%E5%A0%82%E6%B4%BE%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/442191/%E8%AF%BE%E5%A0%82%E6%B4%BE%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
(function() {
  //实现左右箭头翻页
  //https://www.ketangpai.com/#/coursewareStudy?interactid    判断当前是否为互动课件页
  if(get_currentUrl()==="https://www.ketangpai.com/#/coursewareStudy?interactid"){
      //console.log("进行了判断");
      document.addEventListener('keyup', function(e) {
          console.log();

          if (e.keyCode == 37) {
              //document.getElementsByClassName('.el-icon-caret-left')[0].click();
              document.querySelector('.el-icon-caret-left').click();
              console.log("上一页");
          }

          if (e.keyCode == 39) {
              // document.getElementsByClassName('.right')[0].click();
              document.querySelector('.el-icon-caret-right').click();
              console.log("下一页");
          }

          //console.log("1");
      });
  }

   //实现点击视频区域播放暂停
  //延时函数等待dom元素，js,视频的加载
  //https://www.ketangpai.com/#/resource_detail?courseid   判断当前是否为视频页
 // if(get_currentUrl()==="https://www.ketangpai.com/#/resource_detail?courseid"){
     // console.log("进行了判断2");
     setTimeout(() => {
      document.getElementById("vjs_video_3").addEventListener("click",function(c){//在视频区添加click事件监听
          //alert("暂停");
          //console.log("ok");
          var event =c||window.event;//获取事件对象
          var target =event.target||event.srcelement;
          if(!(document.getElementsByClassName("vjs-icon-placeholder")[0].contains(target))&&!(document.getElementsByClassName("vjs-control-bar")[0].contains(target))){//点击区域不为进度条和暂停键
              //console.log("判断点击区域");
              playpause();}
      })
      quickslow(); //快进快退
      cancelSpace();

  }, 4000);//延时4秒，可自己修改，单位ms
//}
}
)();

//播放暂停函数
function playpause() {
  //console.log('暂停函数作用');
  if (document.querySelector("video").paused) {
      document.querySelector("video").play();
      console.log("播放");
  } else { document.querySelector("video").pause();
         console.log("暂停");}
}

//获取等号前地址函数
function get_currentUrl(){
  var loc = window.location.href;//获取全部地址
  //var n1 = loc.length;         //地址的总长度
  var n = loc.indexOf("="); //取得=号的位置
  var url = loc.substr(0, n);//从=号前面的内容
  //console.log(url);
  return url;
}

//快进快退空格暂停
function quickslow(){
     window.addEventListener('keyup', (event) => {
        const keyCode = event.keyCode;
        if(keyCode==39){
            console.log("快进5秒");
            document.querySelector("video").currentTime+=5;}
        if(keyCode==37){
             console.log("快退5秒");
            document.querySelector("video").currentTime-=5;}
     }, true);
 // document.body.onkeydown = function (event) {
 // var e = window.event || event;
  //if(e.preventDefault){
   //   e.preventDefault();
      //console.log("阻止滚动");
  //    playpause();
 // }else{
 //     window.event.returnValue = false;
 // }
}

/*————————————————
版权声明：本文为CSDN博主「PrayerFaith-Depart」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/qq867263657/article/details/72122864
*/
//阻止空格滚动并暂停
function cancelSpace(){

  var s = s|| window.event;

  var elm = s.srcElement || s.target;

  var key = s.keyCode || s.charCode;

  if(key == 32){

      if(elm.tagName.toLowerCase()=="input" && elm.type.toLowerCase()=="text" || elm.tagName.toLowerCase() == "textarea"){
         // console.log("11");
          return;

      }

      if(window.event){

          s.returnValue = false;
          playpause();

      }

      else{

          s.preventDefault();
          console.log("阻止滚动");
          playpause();

      }

  }
}

document.onkeypress=cancelSpace;
/*————————————————
版权声明：本文为CSDN博主「PrayerFaith-Depart」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/qq867263657/article/details/72122864 */


