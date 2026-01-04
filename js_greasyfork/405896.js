// ==UserScript==
// @name         学习通网易云评论
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  学习通自动水网易云热评，每秒一条
// @author       zhoujunbo
// @match        *://*.chaoxing.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405896/%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%BD%91%E6%98%93%E4%BA%91%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/405896/%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%BD%91%E6%98%93%E4%BA%91%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

function form_rep_submit2(topicId,clazzid,cpi,ut){
    var content = $("#" + topicId).val();
    var img=$("#images_img_"+topicId).find("img");
    var str="";
    for(var i=0;i<img.size();i++){
        var imgsrc=img[i];
        if(i==img.size()){
            str=str+imgsrc.src.replace("100_100","origin");
        }else{
            str=str+imgsrc.src.replace("100_100","origin")+",";
        }
    }
    if((content==""||content=="回复话题:"||content.trim()=='')&&str==""){
        alert("请输入回复内容！");
        return false;
    }
    if(typeof(cpi) == "undefined" || cpi == ""){
        cpi = 0;
    }
    if(typeof(ut) == "undefined" ){
        ut = "t";
    }
    var allAttachment = getAllNoticeAttachment();
    jQuery.ajax({
        type: "post",
        url : "/bbscircle/addreply",
        dataType:'html',
        data: {
            clazzid : clazzid,
            topicId : topicId,
            content : content,
            files : str,
            cpi : cpi,
            ut : ut,
            attachmentFile:allAttachment,
            openc : getOpenc()
        },
        success: function(data){
            if (data.indexOf('error') == 0) {
                alert(data.replace('error;',''));
                return;
            }

        }
    });
}
var i = 1;
setInterval(function() {$.ajax({
    url:"https://api.oioweb.cn/api/wyypl.php",
    type:'get',
    success:function(res){
        console.log("《"+res.SongName+"》"+"--热评---"+res.Comment+res.SongPic);
        document.getElementsByClassName("hfInp")[0].innerHTML="《"+res.SongName+"》"+"--热评---"+"\n"+res.Comment;
        var bigImg = document.createElement("img");		//创建一个img元素
        bigImg.src=res.SongPic;
        document.getElementsByClassName('tlPic')[0].appendChild(bigImg)
        $(".grenBtn")[0].click();
        document.getElementsByClassName('tlPic')[0].removeChild(bigImg )
        console.log("----"+i+"---"+new Date());
        i++;
    }
})
                       }
            , 1000);
