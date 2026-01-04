// ==UserScript==
// @name         百度页面净化
// @namespace    https://sfkgroup.github.io/
// @version      0.5
// @description  这是一个屏蔽百度与其相关网页中广告与垃圾信息的脚本.
// @author       SFKgroup
// @match        http://*.baidu.com/*
// @match        https://*.baidu.com/*
// @grant        GM_log
// @icon         https://sfkgroup.github.io/images/favicon.ico
// @license      LGPL
// @downloadURL https://update.greasyfork.org/scripts/458243/%E7%99%BE%E5%BA%A6%E9%A1%B5%E9%9D%A2%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/458243/%E7%99%BE%E5%BA%A6%E9%A1%B5%E9%9D%A2%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var k = 0
    var rubbish
    var deny = ['b2b_prod','sp_hot_sale','news-realtime','short_video','game-page-profession','game-page-platform','pc-soft-accurate','pc-soft-fs','bjh_addressing','law_consult_card','pc-soft-app','lego_tpl',undefined ,null]
    function move(element){
        if (element) {
            element.remove()
        }
    }
    function move_by_attr(element,attr,value){
        if (element) {
            for (k=0;k<element.children.length;k++)
            {
               if (element.children[k].getAttribute(attr) == value){
                   element.children[k].remove()
               }
            }
        }
    }
    self.setInterval(function (){
        try{
            move(document.getElementById('s_wrap'))
            move(document.getElementById('content_right'))
            move(document.getElementById('side_box_unionAd'))
            move(document.getElementById('passport-login-pop'))
            move(document.getElementById('task-panel-wrap'))
            move(document.getElementById('aside-ads-container'))
            move(document.getElementById('bottom-ads-container'))
            move(document.querySelector("#rooot > div.pagebase.pagebase-fullmain > div.pagebase-right.pagebase-right-fullmain > div.pagebase-right-bottom.pagebase-right-bottom-fullmain > div.page > div > div.page-right > div > div.landrightbanner"))
            move(document.getElementById('s-hotsearch-wrapper'))
            move(document.getElementsByClassName("aside-inner")[0])
            move(document.getElementsByClassName("right-ad")[0])
            move(document.getElementsByClassName("bottom-recommend-wrapper")[0])
            move(document.getElementsByClassName("hot-box")[0])
            move(document.getElementsByClassName("ec_src572")[0])
            move(document.getElementsByClassName("main-content-bottom")[0])
            move(document.getElementsByClassName("aside-wrap wgt-cms-banner")[0])
            move(document.getElementsByClassName("accover-content")[0])
            move(document.querySelector("#root > div > div > div.main-lay-out-content > div > div > div:nth-child(3) > div.extra"))
            move(document.querySelector("#app > div.base-layout-content > div.base-layout-content-left > div.search-result-list-wrap"))
            move(document.querySelector("#page-main > div > div > div > div.list-header"))
            move(document.getElementById("qbrightdown-wapqbbrand"))
            move(document.getElementsByClassName("wgt-ads answerlist")[0])
            move(document.getElementsByClassName("newbest-content-meta line ff-arial")[0])
            move(document.getElementsByClassName("wgt-ads qbleftdown")[0])
            move(document.getElementsByClassName("comp-vip-pop inner-vip")[0])
            move(document.getElementsByClassName("vip-privilege vip-privilege-card-wrap new-privilege-wrap")[0])
            move(document.getElementsByClassName("vip-layer-inner")[0])
            move(document.getElementsByClassName("j_click_stats")[0])
            move(document.getElementsByClassName("aside_region app_download_box")[0])
            move(document.getElementById('pagelet_frs-aside/pagelet/aside_ad'))
            move(document.getElementById('aside-ad'))
            move(document.getElementById('branding_ads'))
            move(document.querySelector('div.c-container.ec-container'))
            move(document.querySelector("#J-union-wrapper"))
            move(document.querySelector("body > div.index-module_drawerHand__aRhcO > div"))
            move(document.querySelector("body > div.index-module_drawerHand__aRhcO"))
            move(document.querySelector("#J-lemma-main-wrapper > div:nth-child(4) > div.rightAd_ntowu"))
            move(document.querySelector("#J-bottom-recommend-wrapper"))
            move(document.querySelector("#search-right"))

            move_by_attr(document.querySelector("#tb_nav > ul > li.more-config-navtab.j_tbnav_tab"),"class",null)
            move_by_attr(document.querySelector("#imgid > div:nth-child(1) > ul"),"class","newfcImgli")
            move_by_attr(document.querySelector("#ssr-content > div._2jN0Z > div > div._2v051 > div"),"class",null)
            move_by_attr(document.querySelector("#thread_list"),"data-thread-type",null)
            move_by_attr(document.querySelector("#j_p_postlist"),"data-pid",null)
            move_by_attr(document.querySelector("#pb_content > div.right_section.right_bright"),"class",null)

            rubbish = document.querySelector("#super-frame > div > b-superframe-body > div.sfa-content > div > div.sf-image-content-page-wrap > div > div > div > div > div.sfc-image-content-listpage.sfc-image-content-page-wrap > div.sfc-image-content-waterfall > div.sfc-image-content-waterfall-vertical")
            if (rubbish){
                for (k=0;k<rubbish.children.length;k++)
                {
                    move_by_attr(rubbish.children[k],"wat-item-data-id",'no-img')
                }
            }
            rubbish = document.getElementsByClassName("sfa-results")
            if (rubbish){
                for (k=0;k<rubbish.length;k++)
                {
                    move_by_attr(rubbish[k],"data-tpl","adv_wenku_fc")
                }
            }
            rubbish = document.getElementsByClassName("blank-frame")
            if (rubbish[0]) {
                rubbish[0].remove()
                setTimeout(function (){document.querySelector('#header > div:nth-child(7)').remove()}, 300 )
            }
            var divs = document.querySelector("#content_left")
            if (divs){
                for (var i=0;i<divs.children.length;i++)
                {
                    if (deny.includes(divs.children[i].getAttribute("tpl")) && divs.children[i].getAttribute("class") != 'video_list_container content_default content1 video-no-tag' && divs.children[i].getAttribute("class") != "c-group-wrapper" && divs.children[i].nodeName == 'DIV'){
                        divs.children[i].remove()
                        //divs.children[i].setAttribute("style","filter:Gray; -webkit-filter: grayscale(100%); filter:blur(10px)")
                    } else if (divs.children[i].getAttribute("class") == 'result c-container new-pmd') {
                        divs.children[i].remove()
                        //divs.children[i].setAttribute("style","filter:Gray; -webkit-filter: grayscale(100%); filter:blur(10px)")
                    }
                }
            }
            divs = document.querySelector("#results")
            if (divs){
                for (i=0;i<divs.children.length;i++)
                {
                    if (deny.includes(divs.children[i].getAttribute("tpl")) && divs.children[i].getAttribute("class") != "col-wrap col-wrap-top" && divs.children[i].getAttribute("class") != "c-group-wrapper" && divs.children[i].getAttribute("class") != 'video_list_container content_default content1 video-no-tag' && divs.children[i].nodeName == 'DIV'){
                        divs.children[i].remove()
                        //divs.children[i].setAttribute("style","filter:Gray; -webkit-filter: grayscale(100%); filter:blur(10px)")
                    } else if (divs.children[i].getAttribute("class") == 'result c-container new-pmd') {
                        divs.children[i].remove()
                        //divs.children[i].setAttribute("style","filter:Gray; -webkit-filter: grayscale(100%); filter:blur(10px)")
                    }
                }
            }
        } catch (e) {GM_log(e)}
    },500);
})();