// ==UserScript==
// @name         ONE漫画广告屏蔽
// @namespace    https://greasyfork.org/zh-CN/users/505018
// @iconURL      https://www.onemanhua.com/favicon.png
// @version      1.1
// @description  ONE漫画广告屏蔽插件
// @author       DreamFly
// @match        http*://*.onemanhua.com/*
// @match        http*://*.ohmanhua.com/*
// @match        http*://*.cocomanhua.com/*
// @match        http*://*.cocomanhua.com/*
// @match        http*://*.todaymanhua.com/*
// @match        http*://*.cocomanga.com/*
// @grant        chrome
// @grant        chrome.webRequest

// @downloadURL https://update.greasyfork.org/scripts/402398/ONE%E6%BC%AB%E7%94%BB%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/402398/ONE%E6%BC%AB%E7%94%BB%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var search_id = function(id){
        if (id.search('^M536099ScriptRoot') >= 0 ||
            id.search('^M572680ScriptRoot') >= 0 ||
            id.search('^rn_ad_native') >= 0 ||
            id.search('^sticky-banner') >= 0 ||
            id.search('^bidadx_tag') >= 0 ||
            id.search('^185140.') >= 0 ||
            id.search('FL$') >= 0 ||
            id.search('^bg_') >= 0 ||
            id.search('^ad') >= 0 ||
            id.search('^_tr') >=0 ||
            id.search('^wrap-fixed') >=0 ||
            id.search('^_') >= 0){
            return true
        }

        return false
    };

    var search_class = function(className){
        if (className.search('^rn_ad_native') >= 0 ||
            className.search('^sticky-banner') >= 0 ||
            className.search('^exoWdgtExit') >= 0 ||
            className.search('^website-pc-read') >= 0 ||
            className.search('^_') >= 0){
            return true
        }

        return false
    };


    //今日漫画
    var todayHandler = function() {

        if (location.hostname === 'm.todaymanhua.com')
        {
            let bodyTag = document.getElementsByTagName('body')[0]
            if (bodyTag){
                bodyTag.style.width = '65%';
                bodyTag.style.margin = '0 auto';
            }
        }
    }

    //其它处理
    var otherHandler = function() {
        //处理
        let class_names = ['kkSFH_dK', 'exoWdgtExit widget-visible', 'tb68d72c', 'website-pc-read-common', 'eww', 'vcaacd0c']
        let div_classs = document.getElementsByTagName('div')
        if (div_classs){
            for (let i = 0; i < div_classs.length; i++){
                let element = div_classs[i]
                if (element.className){
                    if (search_class(element.className)){
                        class_names.push(element.className)
                    }
                }
            }
        }

        for (let m in class_names) {
            let shades = document.getElementsByClassName(class_names[m]);
            if (shades) {
                for (let i = 0; i < shades.length; i++){
                    let shade = shades[i]
                    if (shade.style.display != 'none') {
                        shade.style.display = 'none';
                    }
                }
            }
        }

        //处理
        let element_ids = [ '_jmrzfdC1Fa', 'affMAfdw1Fa', 'wpnAskModalContainer', 'KRJXSPEA', 'NPEWFSFN',
                           'HMcoupletDivleft', 'HMcoupletDivright', 'HMRichBox', 'bg_3654164748_CqjpCvZ788',
                          'bg_content', 'ESkzQKic', 'YTYIWDJDFL', 'ZCYKACKXFL', 'fGjzhzne', 'nGCanwCN']
        let div_ids = document.getElementsByTagName('div')
        if (div_ids){
            for (let i = 0; i < div_ids.length; i++){
                let element = div_ids[i]
                if (element.id){
                    if (search_id(element.id)){
                        element_ids.push(element.id)
                    }
                }
            }
        }

        for (let j in element_ids) {
            let shade = document.getElementById(element_ids[j]);
            if (shade && shade.style.display != 'none') {
                shade.style.display = 'none';
            }
        }

       let m_class_name = document.querySelector('div>a>img');
       if (m_class_name){
           if (m_class_name.style.display != 'none') {
                m_class_name.style.display = 'none';
           }

//            m_class_name = m_class_name.parentNode;
//            if (m_class_name && m_class_name.style.display != 'none') {
//                 m_class_name.style.display = 'none';
//            }

           m_class_name = m_class_name.parentNode.parentNode;
           if (m_class_name && m_class_name.style.display != 'none') {
                m_class_name.style.display = 'none';
           }
       }

        //处理
        let tag_names = ['qq', 'lodq', 'edna', 'gynd', 'etnz', 'lhrq', 'yfhr', 'ins'];
        for (let n in tag_names) {
            let shades = document.getElementsByTagName(tag_names[n]);
            if (shades){
                for (let i = 0; i < shades.length; i++){
                    let shade = shades[i]
                    if (shade && shade.style.display != 'none') {
                        shade.style.display = 'none';
                    }
                }
            }
        }

       //删除
       let node_name = document.querySelector('#p_3472883');
       if (node_name){
           node_name.parentNode.innerHTML = "";
       }

        //保留本页
        var location_url = "";
        var location_host = ""


        if (location_url == "" || (location_host == location.hostname && location.href != location_url)){
            location_url = location.href;
            location_host = location.hostname;
        }

        if (location_host != location.hostname){
            location.href = location_url;
        }

    }

    var loop = function () {

        todayHandler();

        otherHandler();

        //开启滚动条
        if (document.body.style.overflow != 'unset'){
            document.body.style.overflow = 'unset';
        }
    };

    //定时执行
    setInterval(loop, 10);
})();