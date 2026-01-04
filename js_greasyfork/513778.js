// ==UserScript==
// @name         消防网络学院自动学习外挂(2024年二十大解读)
// @namespace    https://wy.cfri.edu.cn/
// @version      2.0
// @description  2024年20大
// @author       风色本花
// @match        https://wy.cfri.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wy.cfri.edu.cn
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      风色本花
// @downloadURL https://update.greasyfork.org/scripts/513778/%E6%B6%88%E9%98%B2%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%A4%96%E6%8C%82%282024%E5%B9%B4%E4%BA%8C%E5%8D%81%E5%A4%A7%E8%A7%A3%E8%AF%BB%29.user.js
// @updateURL https://update.greasyfork.org/scripts/513778/%E6%B6%88%E9%98%B2%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E5%A4%96%E6%8C%82%282024%E5%B9%B4%E4%BA%8C%E5%8D%81%E5%A4%A7%E8%A7%A3%E8%AF%BB%29.meta.js
// ==/UserScript==
/*
通过定期刷新，来检查视频是否播放完毕
*/
var msk="";
var msk_index=0;
$(document).ready(function(){
    let wechat_url="https://wy.cfri.edu.cn/app-yjgb/wechat/#/study/course/detail/";
    var urls=["b2c56126-7345-4c92-9d8a-540b057e52d5","49471f32-eb87-411f-a98d-79343370b004","ea235538-f993-4641-ab20-75d3e814b071","35eccce8-a6b1-40b7-96b4-83f6ab0b1590","403fa2b2-f00c-4dfe-bec7-2025bf48c5cd","e2684bf2-05d5-4419-8680-120d71db15f2","dca547a7-fc9d-428b-a4c3-81e52f86f848","7bf6e174-728b-4065-9fa8-52c5a5a879ae","0e43ff26-99ce-4551-b57f-d30cc09eeced","0027bdc9-ccc1-44ac-b21d-4d11ca2351f7","b60b653c-52ac-444d-a413-0033d6ff2b40","8df0c541-c3de-49e1-b71a-9263f337826a","0e801f3e-0777-4946-b846-84e4c02bbee4","ae29c800-b17f-4b92-b606-40b50c3a82a9","0f0eb4d8-4414-4b9e-9fdb-00805b79c1cb","90081299-9cc0-4383-8790-05681ebdb538","72ede694-5a5b-43da-9587-4a0bce103c3b","f62b308e-a450-4be1-b0ce-1a81dc4c09ca","2c7fe737-e623-40ff-a454-94b6a85282d9","99839d36-7707-4a68-88ff-df8bcd791f6f","1aa174e9-6bf4-4a4f-bda9-3d683f5057a5"];
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

