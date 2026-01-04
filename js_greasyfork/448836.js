// ==UserScript==
// @name              百度搜索页面美化
// @version           0.1.2
// @description       百度搜索页面样式美化、隐藏多余内容、去广告、整体居中
// @author            asadahimeka
// @namespace         https://www.nanoka.top
// @license           MIT
// @match             *://www.baidu.com/s?*
// @match             *://ipv6.baidu.com/s?*
// @match             *://www.baidu.com/baidu?*
// @match             *://ipv6.baidu.com/baidu?*
// @source            https://github.com/asadahimeka/userscripts
// @supportURL        https://github.com/asadahimeka/userscripts/issues
// @run-at            document-start
// @noframes
// @grant             GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/448836/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/448836/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
  "use strict";
  ;
  const style = 'body {\n  zoom: 1\n}\n\n#s_main,\n.s-top-nav,\n.s-hotsearch-wrapper,\n#content_right {\n  display: none;\n}\n\n#content_left {\n  padding-left: 0 !important;\n  width: 1000px !important;\n  margin: 0 auto;\n  float: none;\n}\n\n#rs {\n  padding: 0 !important;\n  margin: 10px auto !important;\n  width: 900px !important;\n}\n\n#rs table {\n  width: 640px !important;\n}\n\n#page .page-inner {\n  padding-left: 0 !important;\n  display: block;\n  width: 900px !important;\n  margin: 0 auto !important;\n}\n\n#page a {\n  margin-right: 20px !important;\n}\n\n.wrapper_new #foot #help {\n  display: block;\n  width: 900px;\n  margin: 0 auto !important;\n  float: none !important;\n  padding-left: unset !important;\n}\n\n#content_left a,\n#rs a,\n.c-title-text,\n.c-showurl {\n  color: #3C50B4;\n  text-decoration: none !important;\n}\n\n.b2b-universal-card .official-site {\n  color: #3C50B4 !important;\n}\n\n.se_st_footer a {\n  color: #008000;\n}\n\n.m {\n  color: #666666 !important;\n}\n\nem {\n  color: #FA3232 !important;\n  text-decoration: none !important;\n}\n\n.t a,\n.c-title-text {\n  font-size: 18px !important;\n}\n\n.jy-course-pc-title .c-title-text {\n  color: #3C50B4 !important;\n}\n\nh3.c-title.c-font-medium.c-color-link.c-line-clamp2 span.c-title-text {\n  font-size: 14px !important;\n}\n\n.slowmsg {\n  left: 300px !important;\n  top: 90px !important;\n  box-shadow: none !important;\n  border: none !important;\n  background: none !important;\n}\n\na.c-text {\n  color: #ffffff !important;\n  font-size: 0.8em !important;\n}\n\n#kw {\n  font-size: 1.5em !important;\n}\n\n.search_tool_conter,\n.nums {\n  width: 900px !important;\n  margin: 0 auto !important;\n}\n\n#rs_top_new,\n.hit_top_new {\n  width: 900px !important;\n  margin: 0 auto !important;\n}\n\n.c-result-content article {\n  width: 100% !important;\n  padding: 0 !important;\n  box-shadow: none;\n}\n\n.c-result-content article:hover {\n  box-shadow: none;\n}\n\n.c-border {\n  box-shadow: none !important;\n  width: 880px;\n}\n\n.op-img-portrait-menu .op-img-portrait-text-public {\n  color: #ffffff !important;\n}\n\n.head_wrapper {\n  width: 1196px;\n  margin: 0 auto;\n  position: relative;\n}\n\n#container {\n  box-sizing: border-box;\n  width: 1000px;\n  margin: 0 auto;\n}\n\n.c-border.ec-pl-container {\n  width: 900px;\n  margin: 0 auto;\n  margin-bottom: 15px;\n  padding: 15px;\n  border-radius: 15px;\n  box-shadow: 0 0 4px #eeeeff !important;\n  border: none;\n  display: none;\n}\n\n.op-img-address-link-type {\n  margin-right: 10px;\n}\n\n.op-img-address-pbline {\n  margin-top: 10px !important;\n}\n\n.c-span18 {\n  width: 760px !important;\n}\n\n.c-span24 {\n  width: 890px !important;\n}\n\n#s_tab.s_tab {\n  padding-left: 0 !important;\n}\n\n@media screen and (min-width: 1921px) {\n  #s_tab.s_tab {\n    margin-left: -96px;\n  }\n}\n\n#s_tab.s_tab .s_tab_inner {\n  display: block;\n  box-sizing: border-box;\n  padding: 0;\n  width: 900px;\n  margin: 0 auto;\n  padding-left: 0 !important;\n}\n\n.op-img-address-link-type a {\n  margin-right: 10px !important;\n}\n\n.op-img-portrait-item-con {\n  padding: 5px;\n}\n\n.c-border .c-span6 {\n  margin-bottom: 10px;\n}\n\n.c-border .c-span-last {\n  margin-right: 10px;\n}\n\n.op-img-portrait-pic-more {\n  text-align: left !important;\n}\n\n.op_exactqa_tag_item {\n  color: #3C50B4 !important;\n}\n\nspan.op_exactqa_tag_item.op_exactqa_tag_selected.OP_LOG_BTN {\n  color: #ffffff !important;\n}\n\n.wenda-abstract-wrap {\n  margin-bottom: 0 !important;\n  border: none !important;\n}\n\n.hint_common_restop {\n  width: 900px !important;\n  margin: 0 auto !important;\n}\n\n.wenda-abstract-img-wrap {\n  display: none;\n}\n\n#content_left .c-group {\n  width: 900px !important;\n  margin-bottom: 15px !important;\n  padding: 10px 15px 15px 15px !important;\n  border: none !important;\n}\n\n.op-short-video-pc-img-group {\n  max-height: none !important;\n}\n\n.result.new-pmd,\n#content_left>.c-container.result,\n#content_left .result-op {\n  width: 900px !important;\n  word-break: break-all;\n  word-wrap: break-word;\n  box-shadow: 0 0 6px #eeeeff;\n  padding: 10px 15px 15px 15px;\n  margin: 0 auto;\n  margin-bottom: 15px;\n  border-radius: 10px;\n  transition: box-shadow 0.5s, border-radius 0.5s, margin-bottom 0.6s, padding-bottom 0.6s;\n}\n\n.result:hover,\n#content_left .result-op:hover {\n  box-shadow: 1px 1px 10px #cccccc\n}\n\n.sftip_com.sftip_blue {\n  width: 900px;\n  margin: 0 auto;\n  margin-bottom: 15px;\n  border-radius: 10px;\n  border: none;\n  background-color: #ffeeee;\n}\n\n.sftip_com span {\n  text-indent: 0 !important;\n}\n\n#header_top_bar,\n.tab-wrapper,\n#gotoPage,\np#page {\n  width: 900px !important;\n  margin: 0 auto;\n  padding-left: 0 !important;\n}\n\n#header_top_bar .nums {\n  width: 700px !important;\n}\n\n#gotoPage {\n  padding-bottom: 0;\n}\n\np#page {\n  padding: 0;\n}\n\nform.fm {\n  font-size: 11px;\n}\n\n.op-gk-topic-header-imgc,\n.op-gk-topic-banners {\n  display: none !important;\n}\n\ndiv[class$="op_rs"] {\n  width: 900px !important;\n  margin: 0 auto;\n  margin-bottom: 15px;\n}\n\ndiv[class$="op_rs_left"] {\n  width: auto;\n}\n\ntable.result-op {\n  display: block;\n  padding: 15px !important;\n  margin-bottom: 15px !important;\n}\n\n#op_wiseapp {\n  box-shadow: none !important;\n}\n\na.c-tip-icon {\n  display: none;\n}\n\n.c-border .c-span18 {\n  width: 735px !important;\n}\n\n#container.sam_newgrid {\n  margin: 0 auto !important;\n  padding-left: 0 !important;\n}\n\n.new-pmd .c-span9 {\n  width: 756px;\n}\n\n.new-pmd .c-span12 {\n  width: unset;\n}\n\nhtml,\nbody {\n  min-height: 101vh\n}\n\n.new-pmd[tpl="app/search-tool"] {\n  width: 920px;\n  margin: 0 auto;\n}\n\n[tpl="app/toptip"],\n#rs_new {\n  padding-left: 42px;\n}\n\n#page>div {\n  width: 920px;\n  margin: 0 auto;\n  padding-left: 0\n}\n\n#head {\n  background-color: rgba(255, 255, 255, 0.72);\n  backdrop-filter: blur(6px);\n}\n\n#content_left {\n  margin: 0 auto !important\n}\n\n#content_left a:hover {\n  text-decoration: underline !important;\n  color: #315efb;\n}\n\n#content_left a:visited {\n  color: #6F3381\n}\n\n.c-group-wrapper .result-op {\n  box-shadow: none !important\n}\n\n.wrapper_new .s_form {\n  padding-left: 22px !important\n}\n\n#container #content_left .result-op:hover,\n#container #content_left .result:hover {\n  box-shadow: 1px 1px 10px #cccccc\n}\n\n[class^=single-card-wrapper] {\n  box-shadow: none !important\n}\n\n#page strong {\n  margin-right: 20px !important\n}\n';
  /*! Modified from: https://greasyfork.org/zh-CN/scripts/406336 */
  function kill_baidu_ad() {
    $(document).ajaxSuccess(() => {
      GM_addStyle(style);
      $("#content_left>div").has('span:contains("\u5E7F\u544A")').remove();
      setTimeout(() => {
        $(".c-container").has('.f13>span:contains("\u5E7F\u544A")').remove();
      }, 2100);
    });
  }
  function run() {
    if (self != top)
      return;
    GM_addStyle(style);
    document.addEventListener("DOMContentLoaded", kill_baidu_ad);
  }
  run();
})();
