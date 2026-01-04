// ==UserScript==
// @name         煤炭行业现代远程教育培训网挂课
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  好兄弟，我知道你很累，下班后好好休息。
// @author       You
// @match        https://www.coaledu.net/html/courseDetails.html*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/531269/%E7%85%A4%E7%82%AD%E8%A1%8C%E4%B8%9A%E7%8E%B0%E4%BB%A3%E8%BF%9C%E7%A8%8B%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%E7%BD%91%E6%8C%82%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/531269/%E7%85%A4%E7%82%AD%E8%A1%8C%E4%B8%9A%E7%8E%B0%E4%BB%A3%E8%BF%9C%E7%A8%8B%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%E7%BD%91%E6%8C%82%E8%AF%BE.meta.js
// ==/UserScript==
// 界面载入URL
//https://www.coaledu.net/html/courseDetails.html?courseID=2135
// 查询课程章节详情
//https://www.coaledu.net/course/front/permit/course/2628/directory?courseid=2628&deviceinfo={"TerminalModel":"iPhone12,1","IMEI":"3E3A8900-F3C3-4DEC-855F-6DDCE79EBB5B","AppCode":"12","AppVersion":"2.2.2","TerminalType":"ios","NetworkType":"wifi","Resolution":"414.000000*896.000000","SysVersion":"15.4"}
// 上传学习进度
//https://www.coaledu.net/course/front/course/2628/batchuploadvideoschedule?courseid=2628&datas=[{"upType":"normal","position":925,"isDrag":0,"spaceTime":30,"platform":"ios","videoType":"1","lastTime":"2022-07-31 01:06:35","watchTime":"2022-07-31 01:06:35","videoID":"15930","courseID":"2628"},{"upType":"normal","position":955,"isDrag":0,"spaceTime":30,"platform":"ios","videoType":"1","lastTime":"2022-07-31 01:07:05","watchTime":"2022-07-31 01:07:05","videoID":"15930","courseID":"2628"},{"upType":"normal","position":985,"isDrag":0,"spaceTime":30,"platform":"ios","videoType":"1","lastTime":"2022-07-31 01:07:35","watchTime":"2022-07-31 01:07:35","videoID":"15930","courseID":"2628"},{"upType":"normal","position":1015,"isDrag":0,"spaceTime":30,"platform":"ios","videoType":"1","lastTime":"2022-07-31 01:08:05","watchTime":"2022-07-31 01:08:05","videoID":"15930","courseID":"2628"},{"upType":"normal","position":1045,"isDrag":0,"spaceTime":30,"platform":"ios","videoType":"1","lastTime":"2022-07-31 01:08:35","watchTime":"2022-07-31 01:08:35","videoID":"15930","courseID":"2628"},{"upType":"normal","position":1075,"isDrag":0,"spaceTime":30,"platform":"ios","videoType":"1","lastTime":"2022-07-31 01:09:05","watchTime":"2022-07-31 01:09:05","videoID":"15930","courseID":"2628"},{"upType":"normal","position":1105,"isDrag":0,"spaceTime":30,"platform":"ios","videoType":"1","lastTime":"2022-07-31 01:09:35","watchTime":"2022-07-31 01:09:35","videoID":"15930","courseID":"2628"},{"upType":"normal","position":1135,"isDrag":0,"spaceTime":30,"platform":"ios","videoType":"1","lastTime":"2022-07-31 01:10:05","watchTime":"2022-07-31 01:10:05","videoID":"15930","courseID":"2628"},{"upType":"normal","position":1165,"isDrag":0,"spaceTime":30,"platform":"ios","videoType":"1","lastTime":"2022-07-31 01:10:35","watchTime":"2022-07-31 01:10:35","videoID":"15930","courseID":"2628"},{"upType":"normal","position":1195,"isDrag":0,"spaceTime":30,"platform":"ios","videoType":"1","lastTime":"2022-07-31 01:11:05","watchTime":"2022-07-31 01:11:05","videoID":"15930","courseID":"2628"},{"upType":"normal","position":1225,"isDrag":0,"spaceTime":30,"platform":"ios","videoType":"1","lastTime":"2022-07-31 01:11:35","watchTime":"2022-07-31 01:11:35","videoID":"15930","courseID":"2628"},{"upType":"normal","position":1255,"isDrag":0,"spaceTime":30,"platform":"ios","videoType":"1","lastTime":"2022-07-31 01:12:05","watchTime":"2022-07-31 01:12:05","videoID":"15930","courseID":"2628"},{"upType":"normal","position":1285,"isDrag":0,"spaceTime":30,"platform":"ios","videoType":"1","lastTime":"2022-07-31 01:12:35","watchTime":"2022-07-31 01:12:35","videoID":"15930","courseID":"2628"},{"upType":"normal","position":1288,"isDrag":0,"spaceTime":3,"platform":"ios","videoType":"1","lastTime":"2022-07-31 01:12:38","watchTime":"2022-07-31 01:12:38","videoID":"15930","courseID":"2628"},{"upType":"normal","position":1288,"isDrag":0,"spaceTime":3,"platform":"ios","videoType":"1","lastTime":"2022-07-31 01:12:38","watchTime":"2022-07-31 01:12:38","videoID":"15930","courseID":"2628"}]&deviceinfo={"TerminalModel":"iPhone12,1","IMEI":"3E3A8900-F3C3-4DEC-855F-6DDCE79EBB5B","AppCode":"12","AppVersion":"2.2.2","TerminalType":"ios","NetworkType":"wifi","Resolution":"414.000000*896.000000","SysVersion":"15.4"}&studyType=0


(function() {
//创建函数
//获取用户authorization
setTimeout(function() {
var iframe = document.createElement('iframe');
var auth;
iframe.onload = function()
{
    //Iframes must be appended to the DOM in order to be loaded
    //Iframes do not load immediately nor synchronously
    //now (after load) we can use iframe.contentWindow:
    //window.localStorage = iframe.contentWindow.localStorage; //you can use it, but better is like:
    var ifrLocalStorage = iframe.contentWindow.localStorage;
    //But DO NOT: "document.body.removeChild(iframe);" because after it access on 'Storage' will be denied
    auth = ifrLocalStorage.getItem('coaledu-front-token');
    console.log("#0 获取到用户登录凭证： ",auth);
};
iframe.src = 'about:blank';
document.body.appendChild(iframe);

//根据身份证计算唯一IMEI
function jCode(value) {
    var keys = "A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z";
    var kleng = keys.length;
    var kstr = keys.split("");
    var v = "",cat, cat1, cat2, cat3;
    for (var i = 0; i <value.length; i ++) {
        cat = value.charCodeAt(i);
        cat1 = cat % kleng;
        cat = (cat - cat1) / kleng;
        cat2 = cat % kleng;
        cat = (cat - cat2) / kleng;
        cat3 = cat % kleng;
        v += kstr[cat3] + kstr[cat2] + kstr[cat1];
    }
    return v;
    console.log(v);
}
//分割函数
function getStr(string,str,where){
　　var str_before = string.split(str)[0];
　　var str_after = string.split(str)[1];
　　if (where == "before"){
    return str_before;
  }else if(where =="after"){
    return str_after;
  }
}
//格式化时间
function format(dat){
    //获取年月日，时间
    var year = dat.getFullYear();
    var mon = (dat.getMonth()+1) < 10 ? "0"+(dat.getMonth()+1) : dat.getMonth()+1;
    var data = dat.getDate()  < 10 ? "0"+(dat.getDate()) : dat.getDate();
    var hour = dat.getHours()  < 10 ? "0"+(dat.getHours()) : dat.getHours();
    var min =  dat.getMinutes()  < 10 ? "0"+(dat.getMinutes()) : dat.getMinutes();
    var seon = dat.getSeconds() < 10 ? "0"+(dat.getSeconds()) : dat.getSeconds();

    var newDate = year +"-"+ mon +"-"+ data +" "+ hour +":"+ min +":"+ seon;
    return newDate;
}
//获取时间
var dat = new Date();
//格式化时间
var newDate = format(dat);

//主程序启动
var userid = document.getElementsByClassName('person-name')[0].innerText;
if(userid=="登录"){
  alert("未登录，请进行登录");
} else if(userid.indexOf('1')>=0) {

//获取课程ID
function getcourseID(){
  //并入主程序中
}
//获取章节ID
getvideoID = function (checklink){
    var lis = document.getElementsByClassName('hd')[0].getElementsByTagName('li');
    lis[1].click();
    GM_xmlhttpRequest({
        method: "GET",
        url: encodeURI(checklink),
        responseType: "json",
        timeout:15000,
        onload: function(res){
            if (res.responseText!=="") {
                var d = JSON.parse(res.responseText);
                if (d.status=="1" && d.message=="success") {
                    console.log("#5 尝试获取当前课程video信息");

                    // 处理 directorys
                    if (d.data.directorys && d.data.directorys.length !== 0) {
                        d.data.directorys.forEach(directory => {
                            // 处理直接挂在 directory 下的 videos
                            if (directory.videos && directory.videos.length) {
                                directory.videos.forEach(video => {
                                    console.log("#5 获取视频信息成功:", directory.ID, video.ID, video.length);
                                    getuploadurl(courseID, video.ID, video.length);
                                });
                            }
                            // 处理 children 中的 videos
                            if (directory.children && directory.children.length) {
                                directory.children.forEach(child => {
                                    if (child.videos && child.videos.length) {
                                        child.videos.forEach(video => {
                                            console.log("#5 获取子目录视频信息成功:", child.ID, video.ID, video.length);
                                            getuploadurl(courseID, video.ID, video.length);
                                        });
                                    }
                                });
                            }
                        });
                    }

                    // 处理独立的 videos
                    if (d.data.videos && d.data.videos.length !== 0) {
                        d.data.videos.forEach(video => {
                            console.log("#5 获取视频信息成功:", video.ID, video.length);
                            getuploadurl(courseID, video.ID, video.length);
                        });
                    }
                } else {
                    document.getElementsByClassName('con-carousel')[1].innerHTML += '<h1>This is bug2</h1>';
                    console.log("@@ this is bug2");
                }
            } else {
                document.getElementsByClassName('con-carousel')[1].innerHTML += '<h1>This is bug1</h1>';
                console.log("@@ this is bug1");
            }
        }
    });
}
getuploadurl = function(courseID,videosID,videostime){
  var videosdatas = '[{"upType":"normal","position":'+videostime+',"isDrag":0,"spaceTime":30,"platform":"ios","videoType":"1","lastTime":"'+newDate+'","watchTime":"'+newDate+'","videoID":"'+videosID+'","courseID":"'+courseID+'"}]';
  //var uploadlink = 'https://www.coaledu.net/course/front/course/'+courseID+'/batchuploadvideoschedule?courseid='+courseID+'&datas='+encodeURIComponent(videosdatas)+'&deviceinfo='+encodeURIComponent(deviceinfo)+'&studyType=0';
  //这里删除了deviceid因为Authorization加密是根据imei计算的，随机生成的imei和浏览器登录所对应的Authorization不匹配
  //如果post包含了deviceid信息，则会提示别处登录
  //如果用浏览器登陆所获的Authorization，在post的时候不提交deviceid也可以成功，所以删掉了
  var uploadlink = 'https://www.coaledu.net/course/front/course/'+courseID+'/batchuploadvideoschedule?courseid='+courseID+'&datas='+encodeURIComponent(videosdatas)+'&studyType=0';
  console.log(uploadlink);
  GM_xmlhttpRequest({
    method:"POST",
    url:uploadlink,
    responseType:"json",
    timeout:15000,
    headers: {
      "Authorization": auth,
      "User-Agent": "zhong guo mei tan jiao yu pei xun/2.2.2 (iPhone; iOS 15.4; Scale/2.00)"
    },
    onload:function(res){
      if (res.responseText!=="") {
		var d =  JSON.parse(res.responseText);
        if (d.status=="1"&&d.message=="上传视频进度成功") {
        	console.log("#6 上传当前课程video信息成功",uploadlink)
			document.getElementsByClassName('detailDet')[0].innerHTML +="学习成功<br>";
        }
      }
    }
  })
}
  url = window.location.href;
  courseID = getStr(url,'=','after');
  imei = "3E3A8900-F3C3-4DEC-855F-"+jCode(userid.substring(userid.length-4,userid.length));
  //imei ="3E3A8900-F3C3-4DEC-855F-6DDCE79EBB5B";
  deviceinfo = '{"TerminalModel":"iPhone12,1","IMEI":"'+imei+'","AppCode":"12","AppVersion":"2.2.2","TerminalType":"ios","NetworkType":"wifi","Resolution":"414.000000*896.000000","SysVersion":"15.4"}';
  console.log("#1 获取到用户账户信息：",userid);
  console.log("#2 计算出用户唯一IMEI：",imei);
  console.log("#3 计算出用户唯一DeviceInfo：",deviceinfo);
  checklink = 'https://www.coaledu.net/course/front/permit/course/'+courseID+'/directory?courseid='+courseID;
  console.log("#4 计算出当前课程章节URL：",checklink);
  document.getElementsByClassName('detailDet')[0].innerHTML +='<button onclick="getvideoID(checklink)" style="display: inline-block;border-radius: 3px;font-size: 16px;background: rgb(72,127,222);color: #fff;width: 140px;text-align: center;margin:15px;padding: 10px 20px;font-weight:bold;">加载外挂</button>';
}
}, 3000); // 延迟5000毫秒（5秒）
})();