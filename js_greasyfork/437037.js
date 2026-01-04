// ==UserScript==
// @name         auto 1.0（打包版）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  How to make everything automatic!
// @author       @jljiu
// @match        *://*/*
// @match        *:///*
// @require      https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js

// @require      https://cdn.jsdelivr.net/npm/sweetalert2@10.15.6/dist/sweetalert2.min.js
// @resource     swalStyle https://cdn.jsdelivr.net/npm/@sweetalert2/theme-dark@3/dark.css
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @license      jljiu
// @downloadURL https://update.greasyfork.org/scripts/437037/auto%2010%EF%BC%88%E6%89%93%E5%8C%85%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/437037/auto%2010%EF%BC%88%E6%89%93%E5%8C%85%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==
// @grant        none

// @require      https://happy-stack.netlify.app/url/function.js
// @require      https://happy-stack.netlify.app/url/qq_email.js
// @require      https://happy-stack.netlify.app/url/auto.js

console.log('GM_listValues',GM_listValues()) //输出所有已经存储的数据（以数组形式）
let gmList = GM_listValues();
for (var i=0;i<gmList.length;i++){
    console.log(gmList[i]+":"+GM_getValue(gmList[i])); //遍历所有已经存储的数据，以键值对的形式
    //GM_deleteValue(gmList[i]); //删除所有已经存储的数据
}

try_catch_if(
    function xx(){
        window.newTab = GM_openInTab('https://www.baidu.com', { active: false, insert: true, setParent :true }); // 打开新的tab
        console.log(newTab); //可以在控制台看到它有返回值
        setTimeout(function(){
            console.log("time："+GM_getValue('time'));
            newTab.close();
        },2950);
    },
    function xx(){
       return currentUrl.match(/https:\/\/www.element3ds.com/i)[0]=="https://www.element3ds.com"
    }
);

//新的标签页捕获数据
try_catch_if(
    function xx(){
        setTime6(function(){
            let time = $('[name="tj_settingicon"]').html(); //想要捕获的数据
            GM_setValue('time',time);
        });
    },
    function xx(){
       return currentUrl.match(/https:\/\/www.baidu.com/i)[0]=="https://www.baidu.com"
    }
);


//微元素签到
try_catch(function(){
    // 微元素签到点击事件
    $('.zzza_hall_bottom_right_yjan_btn').click();
    $('.tit>.ico-remove.close-pn').click();
    $('#zzza_go').click();
});
try_catch_if(
    //微元素获取签到信息
    function xx(){
        let jiangli = $('.zzza_hall_top_left_infor li:nth-child(2) span:nth-child(2)').html();
        let tianshu = $('.zzza_hall_top_left_infor li:nth-child(3) span:nth-child(2)').html();
        let qdxx = "签到奖励："+jiangli+' ,已持续 '+tianshu+" 天";
        alert(qdxx);
    },
    function xx(){
        return document.URL=="https://www.element3ds.com/plugin.php?id=yinxingfei_zzza:yinxingfei_zzza_hall&yjjs=yes"
    }
);
