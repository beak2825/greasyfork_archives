// ==UserScript==
// @name        New script - edu-meta.com
// @namespace   Violentmonkey Scripts
// @match       https://www.edu-meta.com/clazz/play.php*
// @grant       none
// @version     1.0
// @author      -
// @description 2021/8/10 下午2:42:06
// @downloadURL https://update.greasyfork.org/scripts/407756/New%20script%20-%20edu-metacom.user.js
// @updateURL https://update.greasyfork.org/scripts/407756/New%20script%20-%20edu-metacom.meta.js
// ==/UserScript==
function GetQueryString(name) {
         var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
         var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
         var context = "";

     if (r != null){
     context = r[2];
     }
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
 }
var lesson_id=GetQueryString("lesson_id");
var courseid=GetQueryString("courseid");
var title=GetQueryString("title");
var rec_m3u8_url="http://metawww.img-cn-hangzhou.aliyuncs.com/courses/" + courseid + "/hls/" + lesson_id + ".m3u8"
var potplayer_rec_m3u8="potplayer://http://metawww.img-cn-hangzhou.aliyuncs.com/courses/" + courseid + "/hls/" + lesson_id + ".m3u8" ;		//快，画质较低（与网页相同）
var potplayer_rec_flv="potplayer://http://metawww.img-cn-hangzhou.aliyuncs.com/courses/" + courseid + "/record/" + lesson_id + ".flv" ;		//部分课程会出错，画质极高（码率是上者5倍左右）
var potplayer_live_rtmp="potplayer://rtmp://live.edu-meta.com/live/" + lesson_id ;		//直播_延迟小（2-3s）_可能只有ppt
var potplayer_live_m3u8="potplayer://http://live.edu-meta.com/live//" + lesson_id +".m3u8" ;		//直播_延迟大（15-30s）_全界面
// window.open( potplayer_live_rtmp );              //打开potplayer放直播
// window.open( potplayer_live_m3u8 );              //打开potplayer放直播
//window.open( potplayer_rec_m3u8);                 //打开potplayer放录播
window.open( potplayer_rec_flv );              //打开potplayer放录播
