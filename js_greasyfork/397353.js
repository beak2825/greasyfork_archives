// ==UserScript==
// @name         简单动漫增强支持
// @namespace    https://greasyfork.org/zh-CN/users/390742-fjqingyou
// @version      0.1.6
// @description  简单动漫增强支持，包括：搜索位置提供指定类型资源搜索功能、磁链链接的tr属性修复为正确url地址、磁力链接添加dn属性（即display name显示名称)的支持
// @author       fjqingyou
// @match        *://www.36dm.club/*
// @match        *://www.36dm.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397353/%E7%AE%80%E5%8D%95%E5%8A%A8%E6%BC%AB%E5%A2%9E%E5%BC%BA%E6%94%AF%E6%8C%81.user.js
// @updateURL https://update.greasyfork.org/scripts/397353/%E7%AE%80%E5%8D%95%E5%8A%A8%E6%BC%AB%E5%A2%9E%E5%BC%BA%E6%94%AF%E6%8C%81.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // Your code here...

    function $id(id){
        return document.getElementById(id);
    }

    function getQueryVariable(variable){
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){
                return pair[1];
            }
        }
        return(false);
    }



    /**
     * 覆盖掉原始搜索
     */
    function overrideOriginSearch(){
        /**
         * 覆盖掉原始搜索
         */
        window.doSearch = function() {
            var topsearch = $id("topsearch");
            if(topsearch){
                var keyword = topsearch.value;
                if (!keyword || "请输入您要搜索的资源名称" == keyword) {
                    Window.alert("请输入您要搜索的资源名称");
                    return false;
                }


                var url = "/search.php?keyword=" + encodeURIComponent(keyword);

                var sort_id = $id("sort_id");
                if(sort_id !== null){
                    url += "&sort_id=" + sort_id.value;
                }

                //执行跳转
                window.location.href = url;
            }
        };
    }


    /**
     * 创建搜索类型的 dom 对象
     */
    function createSearchTypeDom(){
        //环境
        var urlSort_id = getQueryVariable("sort_id");

        //创建下拉框
        var sort_id = document.createElement("select");

        //指定下拉框属性
        sort_id.style = "float: left; height: 25px; margin-right: 5px;";
        sort_id.id = "sort_id";
        sort_id.name = "sort_id";

        //选项元素项列表
        var arrItems =[
            [0, "全部"],

            [2, "动画"],
            [7, "　　新番连载"],
            [8, "　　动画合集", true],
            [14, "　　英译动画"],

            [3, "漫画"],
            [12, "　　港台漫画"],
            [13, "　　原版日漫"],
            [16, "　　英译漫画"],

            [4, "动漫音乐"],
            [15, "　　音乐视频"],


            [5, "RAW片源"],
            [20, "　　日剧"],
            [21, "　　特摄片"],
            [22, "　　原版日剧"],
            [23, "　　英译日剧"],

            [18, "游戏"],

            [6, "其他资源"],
            [17, "　　写真集"],
            [19, "　　图集"]
        ];

        //遍历生成 option 元素
        for(var i = 0 ; i < arrItems.length; i++){
            var item = arrItems[i];
            var option = document.createElement("option");
            option.value = item[0];
            option.text = item[1];

            //默认选中项
            if(!urlSort_id){//如果没有这个参数
                if(item[2]){//如果有默认指定这个的需求
                    option.selected = true;//那么才指定
                }
            }else{//如果存在这个参数
                option.selected = urlSort_id == option.value;//那么要求一致
            }

            sort_id.appendChild(option);
        }
        return sort_id;
    }


    /**
     * 添加搜索类型选项
     */
    function addSearchTypeOption(){
        //环境
        var topsearch = $id("topsearch");
        if(topsearch === null){//如果环境还未准备就绪
            //延迟一会儿再尝试
            setTimeout(addSearchTypeOption, 100);
        }else {
            var sort_id = $id("sort_id");
            if(sort_id === null){//只有确实还没有这个元素才有必要继续
                //获取父节点
                var topsearchParent = topsearch.parentElement;

                //扩大这个元素的宽度，让它不被换行
                topsearchParent.style.width = "610px";

                //创建搜索类型节点
                sort_id = createSearchTypeDom();

                //插入搜索类型
                topsearchParent.insertBefore(sort_id, topsearch);

                //覆盖掉原始搜索
                overrideOriginSearch();
            }
        }
    }

    /**
     * 修复磁力链接的 tr 参数
     */
    function fixMagnetTr(magnetDom){
        if(magnetDom){
            var url = magnetDom.href;
            var index = url.indexOf("&tr=http://");
            if(index > -1){
                var strLeft = url.substr(0, index + 4);
                var trUrl = url.substr(index + 4);
                magnetDom.href = strLeft + encodeURIComponent(trUrl);
            }
        }
    }

    /**
     * 添加磁力链接的显示名称
     */
    function addMagnetDisplayName(magnetDom){
        if(magnetDom && !magnetDom.href.indexOf("&dn=") > -1){
            var title = document.title;
            for(var i = 0 ; i < 2; i++){
                var index = title.lastIndexOf(" - ");
                if(index > -1){
                    title = title.substr(0, index);
                }
            }

            if(title.length > 0){
                magnetDom.href += "&dn=" + encodeURIComponent(title);
            }
        }
    }

    /**
     * 增强 show 页面
     */
    function enhanceShowPage(){
        if(document.location.href.indexOf("/show-") > -1){
            var magnetDom = $id("magnet");
            if(magnetDom === null){//如果环境还未准备就绪
                //延迟一会儿再尝试
                setTimeout(enhanceShowPage, 100);
            }else{
                //修复磁力链接的 tr
                fixMagnetTr(magnetDom);

                //添加磁力链接的显示名称
                addMagnetDisplayName(magnetDom);
            }
        }

    }

    /**
     * 初始化
     */
    function init(){
        //添加搜索类型选项
        addSearchTypeOption();

        //增强 show 页面
        enhanceShowPage();
    }

    //执行初始化
    init();
})();