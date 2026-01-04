// ==UserScript==
// @name        ERM跳转页面
// @namespace   Violentmonkey Scripts
// @match       http://cms.ds.gome.com.cn/gome-mobile-web/pageinfo/sale_pageinfo_list.do
// @match       http://cms.gome.inc/gomeCmsImgInfo/list.do
// @match       http://cms.gome.inc/gomeCmsCssJsInfo/list.do
// @match       http://cms.ds.gome.com.cn/gome-mobile-web/cmslog/cmsloginfo_keyprom_list.do
// @match       http://cxcms.ds.gome.com.cn/gome-cms-web/pageGenerator/pageList.do
// @match       http://cms.ds.gome.com.cn/gome-mobile-web/pageinfo/channel_pageinfo_list.do
// @match       http://cxcms.ds.gome.com.cn/gome-cms-web/pageTempConfig/templateList.do
// @match       http://cncms.ds.gome.com.cn/gomeCmsImgInfo/list.do
// @grant       none
// @version     1.0
// @author      -
// @description 2020/6/26 上午9:31:44
// @downloadURL https://update.greasyfork.org/scripts/412121/ERM%E8%B7%B3%E8%BD%AC%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/412121/ERM%E8%B7%B3%E8%BD%AC%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

$(document).ready(function(){
            var wyj_dom = `<div style="position: fixed;top: 40%;right: -2px;background: #009688;padding: 10px;color:#000;"><input style="width: 40px;height: 40px;margin: 2px;" class="wyj_input" type="text">
<br><button class="wyj_btn"><a href="" style="color:#000;font-weight:900;text-decoration: none;">跳转</a></button></div>`;
            // $(".bBox").append(wyj_dom)
            $("body").append(wyj_dom)
            $(".wyj_btn").click(function(){
              var inputVal = $(".wyj_input").val();
              $(this).children("a").attr("href","javascript:gotoPage("+inputVal+")")
            })
        })

