// ==UserScript==
// @name         消防网络学院自动学习外挂(2025年第1期)
// @namespace    https://wy.cfri.edu.cn/
// @version      2025.05.12
// @description  2025年第1期(更新时间2025.05.12)
// @author       天王老子
// @match        https://wy.cfri.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wy.cfri.edu.cn
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      nadt1988
// @downloadURL https://update.greasyfork.org/scripts/455780/%E6%B6%88%E9%98%B2%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%A4%96%E6%8C%82%282025%E5%B9%B4%E7%AC%AC1%E6%9C%9F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/455780/%E6%B6%88%E9%98%B2%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%A4%96%E6%8C%82%282025%E5%B9%B4%E7%AC%AC1%E6%9C%9F%29.meta.js
// ==/UserScript==
/*
通过定期刷新，来检查视频是否播放完毕
*/
var msk="";
var msk_index=0;
$(document).ready(function(){
    let wechat_url="https://wy.cfri.edu.cn/app-yjgb/wechat/#/study/course/detail/";
    var urls=["4d6564fe-5861-44ae-a730-c3d791ae90ff","79122916-c8b7-4a25-a1a2-545ebd51b8ca","bf727e3e-bf2d-4469-bd73-76161365c448","a8373483-ffa6-4b89-b9bd-3c188bd06fb8","a9c9ce12-5bef-4bde-90a8-6213e25ed276","7d1f53e3-efec-4da7-afe7-249ab31c80d1","09628d55-fd36-4bbc-ac99-98b8a5ab890c","c7017405-03e7-49f6-b86d-d9c8c38ace16","caa7d2ae-bcf0-41f1-98d6-f99f1ea09550","fbd80dfa-f284-4b6d-940f-0bcbadc332bd","771b4b78-d7a4-476d-8942-3d5a16173942","15d1ddd0-7ead-48e9-889d-e77a7e0506de","098dcb8d-61ab-4b03-a957-b9f98f6dca05","7f00121c-b77f-4273-8523-0f535b048fff","ce5615a6-c959-446c-83fc-e7a85b5f6905","aad852a9-4d08-4539-b646-a60a2b307dea","59876ce6-34e6-42a8-be3b-b0de787ef548","a1fd3e95-b6f0-4726-a385-c3443a7a96b4","4fa73d82-df21-4694-acf2-0a84a7932d99","63b130bc-c5b6-4d92-b616-186ea1ef9042"];
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

