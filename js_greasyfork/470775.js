// ==UserScript==
// @name            谷歌搜索结果两栏显示 Google Search Double Column Results
// @namespace       http://tampermonkey.net/
// @version         1.0.3.RELEASE
// @license         GNU GPL v3
// @description     搜索结果支持两栏
// @author          LGJ, 4Aiur
// @run-at          document-end
// @include         *://encrypted.google.*/search*
// @include         *://*.google*/search*
// @include         *://*.google*/webhp*
// @note            2023-10-12 v1.0.3.RELEASE 显示People also ask, Related searches, Video， Tiktok 等媒体结果
// @note            2023-07-14 v1.0.2.RELEASE 修复People also ask 遮挡鼠标点击的问题
// @note            2023-07-14 v1.0.0.RELEASE 修复代码不生效的问题, 适配夜间模式
// @note            2020-08-01 V0.3.1 部分代码重构，增加注解，优化模块摆放位置
// @note            2020-07-31 V0.2.7 常规BUG修复
// @note            2020-07-31 V0.2.3 解决一下网页缩放带来的排版错乱问题
// @note            2020-07-31 V0.2.1 谷歌分页栏居中排版显示
// @note            2020-07-31 V0.1.3 大大减少了搜索结果排版错乱问题
// @create          2020-07-30 V0.1.0 实现谷歌搜索结果两栏展示
// @downloadURL https://update.greasyfork.org/scripts/470775/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%A4%E6%A0%8F%E6%98%BE%E7%A4%BA%20Google%20Search%20Double%20Column%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/470775/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%A4%E6%A0%8F%E6%98%BE%E7%A4%BA%20Google%20Search%20Double%20Column%20Results.meta.js
// ==/UserScript==


/**
 * 脚本由LGJ创建, 由4Aiur接手修复
 *
建议将搜索结果显示条数显示为20条体验更佳
建议配合AdblockPlus使用，去广告效果极佳
**/


const style = `

#center_col{
    width: 100% !important;
}
.g{
    z-index: 20;
    position: relative;
    float: left !important;
    width: 47% !important;
    min-width: 500px;
    min-height: 130px !important;
    margin: 3px !important;
    padding: 7px !important;
    background-color: inherit !important;
    border: 1px solid #E5E5E5 !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

#rso .cUnQKe{
      display: inline-block;
}

`;

// 嵌入css
loadStyleString(style);

function loadStyleString(css){
    var style = document.createElement("style");
    style.type = "text/css";
    try{
        style.appendChild(document.createTextNode(css));
    } catch (ex){
        style.styleSheet.cssText = css;
    }
    document.head.appendChild(style);
}