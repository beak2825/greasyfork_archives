// ==UserScript==
// @name         消防网络学院自动学习外挂(2024第1期)
// @namespace    https://wy.cfri.edu.cn/
// @version      1.0
// @description  第1期
// @author       风色本花
// @match        https://wy.cfri.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cfri.edu.cn
// @grant        none

// @license      nadt1988
// @downloadURL https://update.greasyfork.org/scripts/500901/%E6%B6%88%E9%98%B2%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%A4%96%E6%8C%82%282024%E7%AC%AC1%E6%9C%9F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/500901/%E6%B6%88%E9%98%B2%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%A4%96%E6%8C%82%282024%E7%AC%AC1%E6%9C%9F%29.meta.js
// ==/UserScript==
/*
通过定期刷新，来检查视频是否播放完毕
*/
var msk="";
var msk_index=0;
$(document).ready(function(){
    let wechat_url="https://wy.cfri.edu.cn/app-yjgb/wechat/#/study/course/detail/";
    var urls=["8592d3a7-3c0a-48e2-ac24-518105a74eae","3716b887-b1f4-4759-a72a-b3aac9a22b24","1a253326-fe45-49ed-aef5-b4220199929d","ef62dbd5-851b-4ba3-a2c4-58086a63c2e5","f20a190d-937d-47e2-a93d-f18005950a22","ed0c4287-a6ef-41bb-baef-2008366686bc","665b7057-0e1d-4cd3-b0db-4b5cdf8cd094","9f7b5463-451e-422a-9b4b-67c3c510e8c9","f62acfb5-7626-4f1b-82e6-da8e2d882a9e"];
    //在顶部添加一个div，用户引导用户
    var welcome_div=$("<div style='width:120px;height:30px;background-color:red;position:absolute;top:5px;left:5px;z-index:9999;line-height:30px;color:white;font-size:10pt;border-radius:10px;text-align:center;'><a href='"+wechat_url+urls[0]+"' style='color:yellow'>自学外挂</a></div>");
    var btn=$("<input type='button' id='mskbtn' value='暂停' style='margin-left:10px;'/>");
    var workdiv=$("<div id='workdiv' style='width:50%;position:absolute;top:15%;left:25%;background-color:#f8f8f8;border-radius:10px;height:15%;text-align:center;font-size:11pt;vertical-align:middle;opacity:0.9'><br><br>自学中.........</div>");
    $("body").append(welcome_div);
    msk=window.setInterval(function(){
        //学习
        autoStudy(urls,wechat_url);
    },1000*5);
});

function autoStudy(urls,wechat_url){
    var url=window.location.href;
    if(url.indexOf("score-detail")!=-1){
        window.history.go(-1);
    }
    for(var i=0;i<urls.length;i++){
        if(url==wechat_url+urls[i]){
            checkStudyStatus(i,urls);
        }
    }
}


/*
检查当前页面学习状态
*/
function checkStudyStatus(current_index,urls){
    var find_item=0;
    var study_list=jQuery(".c-info-cata").find("li");
       for(var i=0;i<study_list.length;i++){
           var temp=study_list.eq(i);
           if(temp.hasClass("finishOn")){
              find_item++;
           }
       }
    console.log("目前播放完成视频："+find_item+"个，剩余："+(study_list.length-find_item-1)+"个");
    if(study_list.length-find_item<=1){
        if(urls.length-current_index!=1){
            temp=current_index+1;
            window.location.href="https://wy.cfri.edu.cn/app-yjgb/wechat/#/study/course/detail/"+urls[temp];
            //window.location.reload();
        }else{
            window.location.href="https://wy.cfri.edu.cn/app-yjgb/wechat/#/profile/mycourse";
        }
    }

}

