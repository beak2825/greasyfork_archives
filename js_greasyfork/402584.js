// ==UserScript==
// @name         你b首页太乱了
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  移除首页不喜欢的内容
// @author       rtmacha
// @match        https://www.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402584/%E4%BD%A0b%E9%A6%96%E9%A1%B5%E5%A4%AA%E4%B9%B1%E4%BA%86.user.js
// @updateURL https://update.greasyfork.org/scripts/402584/%E4%BD%A0b%E9%A6%96%E9%A1%B5%E5%A4%AA%E4%B9%B1%E4%BA%86.meta.js
// ==/UserScript==
window.addEventListener('load', function() {
    // your code here
    

    try{
        document.getElementById("elevator").style.display="none";// 电梯
        document.getElementById("bili_report_douga").style.display="none";// 推广
        document.getElementById("bili_report_game").style.display="none";// 游戏
        document.getElementById("bili_report_technology").style.display="none";// 科技
        document.getElementById("bili_report_digital").style.display="none";// 数码
        document.getElementById("bili_report_digital").style.display="none";// 影视
        document.getElementById("bili_report_cinephile").style.display="none";// 数码
        document.getElementById("bili_report_documentary").style.display="none";// 纪录片
        document.getElementById("bili_report_teleplay").style.display="none";// 电视剧
        document.getElementById("bili_information").style.display="none";// 资讯
        document.getElementById("bili_read").style.display="none";// 专栏

        document.getElementById("bili_report_guochuang").style.display="none";//国创
        document.getElementById("bili_report_live").style.display="none";//直播
        document.getElementById("bili_report_dance").style.display="none";//舞蹈
        document.getElementById("bili_report_kichiku").style.display="none";//鬼畜
        document.getElementById("bili_report_ent").style.display="none";//娱乐
        document.getElementById("bili_report_life").style.display="none";//生活
        document.getElementById("bili_report_fashion").style.display="none";//时尚
        document.getElementById("bili_report_ad").style.display="none";//广告
        document.getElementById("bili_report_read").style.display="none";//专栏
        
        /*
        这里采用移除方式，滚动后display属性会被清除掉，因此直接将该模块移除。
    */
        //document.getElementsByClassName("mascot")[0].style.display="none";// 空中课堂

        document.getElementsByClassName("contact-help")[0].style.display="none";// 联系客服
    }
    catch(error){
        console.log(error);
    }
    setTimeout(function(){
        //document.getElementsByClassName("content")[0].style.backgroundColor='rgba(255, 255, 255, 0.5)';
        try{
            document.getElementsByClassName("partner b-footer-wrap")[0].style.display="none";//强制信息
            document.getElementsByClassName("mascot")[0].remove();// 左下角小电视
        }catch(err){}
        try{document.getElementsByClassName("contact-help")[0].remove();// 联络客服
           }catch(err){}
        try{document.getElementById("bili_report_spe_rec").style.display="none";//特别推荐
           }catch(err){}
        try{
            document.getElementById("live_recommand_report").style.display="none"; // 尝试删除推荐直播域
        }
        catch(err)
        {
            console.log(err);
        }
        try{document.getElementById("activity_vote").style.display="none";} // 尝试删除投票域}
        catch(err){}

    },3000)
}, false);
(function() {
    'use strict';
    document.getElementById("reportFirst2").style.display="none";// 推广

})();