// ==UserScript==
// @name         “暑期教师研修”专题
// @namespace    https://greasyfork.org/users/904812
// @version      1.0
// @description  国家中小学智慧教育平台“暑期教师研修”专题
// @author       弱鸟
// @match        https://www.zxx.edu.cn/*
// @grant        none
// @license      GNU Affero General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/449898/%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/449898/%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98.meta.js
// ==/UserScript==
 
(function() {
    var url = window.location.href;
    //网址
    //在有课程简介、课程大纲、课程评价那个页面的网址复制就行
    var urls = [
        "https://www.zxx.edu.cn/teacherTraining/courseIndex?channelId=1ed36ec9-bf29-4dd7-86a5-9cbd3a8cd8d7&courseId=011108e1-d6e7-40fa-ad6d-87b086c8224a&breadcrumb=2022%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9",
        "https://www.zxx.edu.cn/teacherTraining/courseIndex?channelId=1ed36ec9-bf29-4dd7-86a5-9cbd3a8cd8d7&courseId=e6e676fb-1f7d-4811-8d88-42ae78fde68c&breadcrumb=2022%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9",
        "https://www.zxx.edu.cn/teacherTraining/courseIndex?channelId=1ed36ec9-bf29-4dd7-86a5-9cbd3a8cd8d7&courseId=aca5560e-21f4-4d48-9002-989c151009ef&breadcrumb=2022%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9",
        "https://www.zxx.edu.cn/teacherTraining/courseIndex?channelId=1ed36ec9-bf29-4dd7-86a5-9cbd3a8cd8d7&courseId=36c9e754-7933-4559-b999-b718662c850c&breadcrumb=2022%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9",
        "https://www.zxx.edu.cn/teacherTraining/courseIndex?channelId=1ed36ec9-bf29-4dd7-86a5-9cbd3a8cd8d7&courseId=7b4cffa6-0320-451f-b094-f7cb82f02db9&breadcrumb=2022%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9",
    ];
    var urlsn = 0;
    var videos = 0;
    var vn = 0;
    var time = 0;
    var duration = 0;
    var state = 0;
    if(url.indexOf("teacherTrainingNav")>0){
        document.cookie="ld=0; path=/";
        window.open(urls[0]);
    }else {
        setInterval(function(){
            urlsn = cookie();
            videos = document.getElementsByClassName("resource-item resource-item-train");
            if(videos.length>0){
                if(state == 0 && vn < videos.length){
                    videos[vn].click();
                    time = 0
                    state = 1;
                }
                if(state == 1 && document.getElementsByTagName("video")[0].pause && vn < videos.length){
                    document.getElementsByTagName("video")[0].play();
                }
                duration = document.getElementsByTagName("video")[0].duration;
                time = document.getElementsByTagName("video")[0].currentTime;
                if(state == 1 && time >= duration-1 && vn < videos.length){
                    state = 0;
                    vn+=1;
                }
                //设置播放集数
                //替换videos.length为数字
                if(vn == videos.length){
                    urlsn=parseInt(urlsn)+1;
                    if(urlsn < urls.length){
                        document.cookie="ld="+urlsn+"; path=/";
                        window.open(urls[urlsn]);
                        window.close();
                    }else{
                        alert("播放结束");
                        setTimeout(function(){
                            window.close();
                        },5000);
                }
            }
        }
                    },1000);
    }
 
    function cookie (){
        var cookies = document.cookie;
        var list = cookies.split("; ");
        for(var i = 0; i < list.length; i++) {
            var arr = list[i].split("=");
            if(arr[0] == "ld")
                return arr[1];
        }
        return "";
    }
})();