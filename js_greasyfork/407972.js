// ==UserScript==
// @name            谷歌搜索结果两栏显示
// @namespace       http://tampermonkey.net/
// @version         0.3.1
// @description     搜索结果支持两栏
// @author          LGJ
// @run-at          document-start
// @include         *://encrypted.google.*/search*
// @include         *://*.google*/search*
// @include         *://*.google*/webhp*
// @grant           daiim
// @note            2020-08-01 V0.3.1 部分代码重构，增加注解，优化模块摆放位置
// @note            2020-07-31 V0.2.7 常规BUG修复
// @note            2020-07-31 V0.2.3 解决一下网页缩放带来的排版错乱问题
// @note            2020-07-31 V0.2.1 谷歌分页栏居中排版显示
// @note            2020-07-31 V0.1.3 大大减少了搜索结果排版错乱问题
// @create          2020-07-30 V0.1.0 实现谷歌搜索结果两栏展示
// @downloadURL https://update.greasyfork.org/scripts/407972/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%A4%E6%A0%8F%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/407972/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%A4%E6%A0%8F%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==


/**
建议将搜索结果显示条数显示为20条体验更佳
建议配合AdblockPlus使用，去广告效果极佳
**/


const style = `
  div.card-section,
  div#trev,
    div#rhs,
    div#tads,
    div#bottomads,
    .vspib,
    .rgsep,
    div[id="gko-srp-sp"]+div[class="col"]
{
    display: none !important;
}

/**
屏蔽地图
**/
.xERobd {
    display: none;
}

/**
屏蔽YouTube视频
**/
g-section-with-header {
    display: none!important;
}


.mw
{
    max-width: 1600px !important;
    margin: auto;
}
.col
{
    width: 100% !important;
}
#center_col
{
    margin-left: 20px !important;
    width: 100% !important;
}
.g
  {
    float: left !important;
    width: 47% !important;
    min-width: 500px;
    min-height: 130px !important;
    margin: 3px !important;
    padding: 7px !important;
    background-color: #ffffff !important;
    border: 1px solid #E5E5E5 !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }


/**工具栏居中**/
.hdtb-mn-cont {
    text-align:center !important;
    margin-left: 0px!important;
}

/**Google分页栏**/
#foot {
    float: left !important;
    width: 100% !important;
}

/**Google搜索栏**/
.big #tsf {
    width: 1000px !important;
    margin: auto !important;
}

/**网页栏**/
#hdtb-msb {
    width: 100%!important;
    justify-content: center!important;
}
#hdtb-msb-vis {
    margin-left: 0px !important;
}

/** 用时栏 **/
.WE0UJf {
    margin-left: 0px!important;
}
#result-stats{
    padding-right: 0px!important;
    position:relative!important;
    text-align:center !important;

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