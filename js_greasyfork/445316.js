// ==UserScript==
// @name         贴吧本地黑名单
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  可根据发贴者ID或着回复内容关键字进行屏蔽,添加ID或关键字.请自行在代码中修改.暂无UI设置
// @author       关公说爱情
// @match        *://tieba.baidu.com/*
// @icon         https://icons.duckduckgo.com/ip2/baidu.com.ico
// @grant    GM_getValue
// @grant    GM.getValue
// @grant    GM_setValue
// @grant    GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/445316/%E8%B4%B4%E5%90%A7%E6%9C%AC%E5%9C%B0%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/445316/%E8%B4%B4%E5%90%A7%E6%9C%AC%E5%9C%B0%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==


(function() {

    //根据ID屏蔽
    let useridAry = new Array(
        "1470757930"
        ,"2473588051"
    );

    //广告的小号太多..ID屏蔽不过来了...根据回复内容关键字屏蔽
    let contentAry = new Array(
        "IOS消费完后悔了"
        ,"你自己按样式添加关键词"

    );

    $('#j_p_postlist .d_author').each(function(){
        let that = $(this).parent();
        let item = JSON.parse(that.attr("data-field"));
        if(useridAry.indexOf(item.author.user_id.toString()) > -1)
        {
            that.remove();
        }
        else if(contentAry.find(function(value) {return item.content.content.indexOf(value)>-1?true:false;}))
        {
            that.remove();
        }
        else
        {
            $(this).find('ul').append("<li><b>ID("+item.author.user_id+")</b></li>");
        }
        //console.log(item.author.user_id + "|"+ item.author.user_name + "|"+  item.author.user_nickname)
    });
})();
