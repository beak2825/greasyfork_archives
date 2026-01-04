// ==UserScript==
// @name        cinoreading管理平台资源下载
// @namespace   下载 cinoreading管理平台 中的媒体资源
// 
// @include     *cinoreading.cinostar.com/Admin/Video/index*
// @include     *cinoreading.cinostar.com/Admin/Diary/index*
// @include     *cinoreading.cinostar.com/Admin/Huiben/Huiben/id*
// 
// @require     https://lib.baomitu.com/downloadjs/1.4.8/download.min.js
// 
// @grant       none
// @version     1.3.1
// @author      JiuRi
// @description 2021/2/25 下午5:38:28
// @downloadURL https://update.greasyfork.org/scripts/422507/cinoreading%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E8%B5%84%E6%BA%90%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/422507/cinoreading%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E8%B5%84%E6%BA%90%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
 
function getMp4Url(id, name, type){
  $.ajax({
      type:"post",
      url:'/Cinoreading/Webservice/video_info', 
      dataType:"json",
      data:{ id:id },
      success:function(data){
        var vid = data.video.fileId;
        if(vid){
            $.getJSON('http://playvideo.qcloud.com/getplayinfo/v2/1256536491/' + vid, function(d){
                if(d){
                  //var video_name = d.videoInfo.basicInfo.name;
                  //console.log(d);
                  var video_url = d.videoInfo.sourceVideo.url;
                  // console.log(url);
                  
                  downloadfile(video_url, name, type);
                }
            })
        }
      }
  });
}

/*
 * 使用download.js 强制浏览器下载图片、视频等文件
 * @param {any} url url链接地址
 * @param {any} strFileName 文件名
 * @param {any} strMimeType 文件类型
 * dzl
 * 2020年5月8日
 */
function downloadfile(url, strFileName, strMimeType) {
  var xmlHttp = null;
  if (window.ActiveXObject) {
    // IE6, IE5 浏览器执行代码
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  } else if (window.XMLHttpRequest) {
    // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
    xmlHttp = new XMLHttpRequest();
  }
  //2.如果实例化成功，就调用open（）方法：
  if (xmlHttp != null) {
    xmlHttp.open("get", url, true);
    xmlHttp.responseType = "blob"; //关键
    xmlHttp.send();
    xmlHttp.onreadystatechange = doResult; //设置回调函数
  }
  function doResult() {
    if (xmlHttp.readyState == 4) {
      //4表示执行完成
      if (xmlHttp.status == 200) {
        //200表示执行成功
        download(xmlHttp.response, strFileName, strMimeType);
        console.log("开始下载", strFileName);
      }else{
        console.log("获取资源失败", strFileName);
      }
    }
  }
}


function _mmmInit(){  
      var btn = document.createElement("button");
      btn.style.position = "fixed";
      btn.style.right = "10px";
      btn.style.top = "100px";
      btn.innerText = "下载本页全部视频/音频";
      btn.onclick = function(){
        if(window.location.href.indexOf("Admin/Video/index") != -1 || window.location.href.indexOf("Admin/Diary/index") != -1){
          for(var i = 0; i < $("#sample_1 tbody tr").length; i++){
            var tr = $("#sample_1 tbody tr")[i];
            var videoId = $(tr).find("td:nth-child(1)").text();
            var videoName = $(tr).find("td:nth-child(2)").text();
            getMp4Url(videoId, `[${videoId}]${videoName}.mp4`, "MP4");
          }
        }else if(window.location.href.indexOf("Admin/Huiben/Huiben/id") != -1){         
          for(var i = 0; i < $("#sample_1 tbody tr").length; i++){
            var tr = $("#sample_1 tbody tr")[i];
            var id = $(tr).find("td:nth-child(1)").text();
            var name = $(tr).find("td:nth-child(4)").text();
            var mp3Url = $(tr).find("td:nth-child(3)").find("img:first").attr("data-src");
            downloadfile(mp3Url, `[${id}]${name}.mp3`, "mp3");
          }
        }
      };
      $(btn).appendTo($(".container-fluid:first"));
}

_mmmInit();
