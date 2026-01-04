// ==UserScript==
// @name         ninja快捷查询poe编年史
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  ninja快捷查询poe编年史dd
// @author       zql
// @license      MIT
// @match        https://poe.ninja/builds/*
// @icon         https://poe.ninja/favicons/favicon-32x32.png

// @require      https://unpkg.com/jquery

// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/482880/ninja%E5%BF%AB%E6%8D%B7%E6%9F%A5%E8%AF%A2poe%E7%BC%96%E5%B9%B4%E5%8F%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/482880/ninja%E5%BF%AB%E6%8D%B7%E6%9F%A5%E8%AF%A2poe%E7%BC%96%E5%B9%B4%E5%8F%B2.meta.js
// ==/UserScript==

var css = `
button.query_btn_class {
    opacity: 0;
    position: absolute;
    left: 60px;
    /* left: var(--s1); */
    background-color: hsla(var(--emerald-800),var(--opacity-100));
    transform: translateY(-66%);
    border-radius: var(--rounded-sm);
    z-index: 100;
    top: 0px;
}
`
GM_addStyle(css);

(function() {
    var baseUrl = "https://poedb.tw/cn/";
    var filter_arr =[" Large Cluster Jewel"," Medium Cluster Jewel"," Small Cluster Jewel",
                     " Cobalt Jewel"," Crimson Jewel"," Viridian Jewel"," Prismatic Jewel",
                     " Timeless Jewel"," Murderous Eye Jewel"];

    //1秒钟检查一次
    setInterval(function () {

        //给item添加查询按钮
        add_query_btn();

    }, 1000);

    unsafeWindow.add_query_btn = function () {
        //item里面查询是否存在查询按钮，不存在即是添加
        $("div._equipment_8bh10_1 ._item-hover_8bh10_26").each(function () {
            if ($(this).children().is(".query_btn_class")) {
                return;
            }
            //定义星团珠宝名称
            let query_btn = '<button class="button query_btn_class" role="button" data-variant="plain" data-size="xsmall" onclick="equipt_query(this)">查询</button>';
            $(this).append(query_btn);
        });

        $("div._layout-cluster_hedo7_1 div div:nth-child(1)").each(function () {
            if($(this).siblings("._text_91ms6_1").length<=0){
                return;
            }
            var attr = $(this).attr("query_name");
            if(typeof attr !== typeof undefined && attr !== false){
                return;
            }
            var query_name = $(this).siblings("._text_91ms6_1").text();

            $.each(filter_arr, function (k, value) {
                var index = query_name.lastIndexOf(value);
                if(index!=-1){
                    query_name = query_name.substr(0,index);
                }
            });
            if(query_name==''){
                return;
            }
            query_name = query_name.replaceAll(' ','_');
            $(this).attr("query_name",query_name);
            //console.log(query_name);
            $(this).css("cursor","pointer");
            $(this).on('click',function(){
                var url = baseUrl + query_name;
                console.log( baseUrl + query_name);

                window.open(url);
            });
        });
    }

    unsafeWindow.equipt_query = function (e) {
       $(e).siblings(".button").click();
       //获取剪切板内容
       navigator.clipboard.readText().then(str=>{
           var prop = {};
           //物品稀有度获取
           var temp=str.match("Rarity\: (.{1,50})")
           prop.rarity=temp[1];
           //如果稀有度为传奇-Unique
           if(prop.rarity!="Unique"){
               alert('非传奇物品无法查询！');
               return false;
           }
           var temp2=str.match("Rarity\:.+?\r\n(.+?)\r\n(.+?)\r\n--------");
           if(temp2){
               prop.name=temp2[1].replaceAll(' ','_');
               prop.type=temp2[2]
           }
           var url = baseUrl + prop.name;
           window.open(url)
           //console.log(prop);
       });

    }

})();