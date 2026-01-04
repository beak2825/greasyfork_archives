// ==UserScript==
// @name        老司机论坛移动端适配
// @namespace   JavBus
// @include     /^http(s)?:\/\/(www.)?(jav|bus|fan|see|cdn|dmm){2}\..*\/forum.*$/
// @grant       none
// @version     1.1
// @author      TKONTR
// @license     MIT
// @description 更改老司机论坛的页面布局，使其更适合在手机上阅读
// @downloadURL https://update.greasyfork.org/scripts/461693/%E8%80%81%E5%8F%B8%E6%9C%BA%E8%AE%BA%E5%9D%9B%E7%A7%BB%E5%8A%A8%E7%AB%AF%E9%80%82%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/461693/%E8%80%81%E5%8F%B8%E6%9C%BA%E8%AE%BA%E5%9D%9B%E7%A7%BB%E5%8A%A8%E7%AB%AF%E9%80%82%E9%85%8D.meta.js
// ==/UserScript==

// 如果设备为移动端，则更换为移动端布局
if(isMobile()) {
  changeToMobileView(0.95);
}

// @scale: 页面放大倍数，根据需要调整即可，默认为 1
function changeToMobileView(scale = 1) {
  // 调整移动端视区
  let metaNode = document.createElement('meta');
  metaNode.setAttribute('name', 'viewport');
  metaNode.setAttribute('content', `width=device-width, user-scalable=no, initial-scale=${scale}, maximum-scale=${scale}, minimum-scale=${scale}`);

  // 样式详细调整
  let styleNode = document.createElement('style');
  styleNode.innerText = `
    /* 如果你有Stylus插件，可以加上 body{opacity:0} 这句代码，没有就算了 */
    body {
        opacity: 1 !important;
        transition: opacity .8s !important;
    }

    /* 导航换行 */
    div#toptb, div#toptb.jav-nav {
        min-width: 0;
        height: auto;
    }
    div#toptb.jav-nav .wp .z ul {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    /* 修改导航各元素排版 */
    div#toptb.jav-nav .wp .z ul li:first-child {
        width: 40%;
    }
    div#toptb ul div.jav-form-group {
        width: 60%;
    }
    div#toptb ul div.jav-form-group #search-input {
        width: 70%;
    }

    /* 更改导航菜单间距 */
    div#toptb .nav-title a,
    div#toptb .nav-active a {
        margin: 19px 0 0 0 !important;
        padding: 4px 10px !important;
    }

    /* 登录按钮独占一行 */
    div#toptb .login-wrap {
        width: 90%
    }

    /* 优化广告排版 */
    div#toptb + div.bcpic2 {
        width: 100%;
        height: 150px;
        overflow-x: scroll;
        background: transparent;
    }
    div#toptb + div.bcpic2 > div.ad-box {
        height: 150px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: start;
        min-width: 1180px;
        margin: 0;
    }
    div#toptb + div.bcpic2 > div.ad-box * {
        height: 100% !important;
        margin: 0;
        text-align: left;
    }


    /* 登录框优化 */
    #append_parent #fwin_login {
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        height: 100% !important;
    }
    #append_parent #fwin_login table.fwin {
        width: 100%;
        height: 100%;
    }
    #append_parent #fwin_login table.fwin tr {
        background: white;
    }
    #append_parent #fwin_login table.fwin td#fwin_content_login {
        display: flex;
        justify-content: center;
    }
    #append_parent #fwin_login table.fwin a, #append_parent #fwin_login table.fwin th {
        white-space: nowrap;
    }

    /* 注册页面优化 */
    #registerform .mtw {
        margin: 0 !important;
    }
    #registerform .mtw .rfm {
        width: 100%;
    }

    /* 面包屑导航 */
    #wp #pt {
        display: flex;
        flex-direction: column;
        height: auto;
    }
    #wp #pt > div {
        float: none;
        position: static !important;
        width: auto !important;
        height: auto !important;
        display: flex;
        justify-content: right;
        flex-wrap: wrap;
    }
    #wp #pt > div.z {
        margin-top: 5px !important;
        font-size: 16px;
    }

    /* 工具栏 */
    #wp #ct #chart {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
    }
    #wp #ct #chart > * {
        float: none;
    }
    #wp #ct #chart > p.chart {
        align-self: flex-end;
        padding-right: 10px;
        word-break: break-all;
    }
    #wp #ct #chart .y, #wp #pt div.z .y {
        font-size: 16px;
        margin-top: 14px;
        margin-right: 20px;
        margin-bottom: 10px;
        display: flex;
        flex-direction: row-reverse;
        flex-basis: 100%;
    }

    /* 页面宽度自适应 */
    #wp {
        width: 100% !important;
    }
    .wp.cl {
        width: 100% !important;
    }
    #wp #ct .mn {
        width: 100%;
    }

    #wp #ct .mn #postlist {
        padding: 0 14px !important;
        width: auto !important;
        ;
    }
    #wp #ct .mn > div {
        width: 100% !important;
        height: auto !important;
        padding: 0 !important;
    }
    #wp #ct .mn > div > div {
        clear: both;
        margin: 10px 0 !important;
        float: none !important;
        width: 100% !important;
    }

    /* 轮播优化 */
    #wp #ct #biaoqicn2 .biaoqicn_show.slidebar {
        top: 0px;
        right: 0px;
        left: auto;
        height: 100%;
        padding: 0 5px 0 45px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }
    #wp #ct #biaoqicn2 .biaoqicn_show.slidebar a {
        top: 0;
        width: 60px;
        height: 23px;
        line-height: 20px;
        opacity: .9;
        border: solid 1px grey;
    }

    #wp #ct #biaoqicn2 .biaoqicn_title {
        width: 80%;
    }
    #wp #ct #biaoqicn2 img {
        float: left;
    }

    /* 选项卡 */
    .sideMenu h3 {
        width: 100% !important;
        clear: both;
    }

    .sideMenu h3 em {
        position: absolute;
        right: 0;
        margin-right: 20px;
    }

    /* 分类区 */
    .fl.bm #category_1 td {
        float: left;
    }
    .fl.bm #category_1 td.fl_icn {
        width: 15% !important;
        padding: 20px 0 0 0;
    }
    .fl.bm #category_1 td.fl_icn + td {
        width: 65%;
        padding: 20px 0 0 0;
    }
    .fl.bm #category_1 td.fl_i {
        width: 10%;
        text-align: center;
        padding: 20px 0 0 0;
    }
    .fl.bm #category_1 td.fl_by,
    .fl.bm #category_1 td.fl_by .forumlist {
        width: 100% !important;
        max-width: 100%;
        padding: 3px 0 7px 0;
    }

    /* 热门等侧边栏 */
    .sd.sd_allbox {
        width: 100% !important;
        float: left;
    }
    .sd.sd_allbox > .main-right-box {
        width: 100%;
    }
    .sd.sd_allbox .comment-info table {
        width: 100% !important;
    }
    .biaoqi_bk_sj.biaoqi_ase-gbox .forumbky {
        width: 50%;
    }
    .main-right-box ul.main-right-kuaixu li {
        display: flex;
    }
    .main-right-box ul.main-right-kuaixu .main-right-kuaixu-txt {
        width: auto;
        padding-left: 15px;
    }
    .main-right-box ul.main-right-kuaixu .main-right-kuaixu-txt, .main-right-box ul.main-right-kuaixu .main-right-kuaixu-pic{
        float: none;
    }

    /* 帖子排序工具栏 */
    #threadlist > .th .tf .y {
        float: left;
        width: 100%;
        padding-bottom: 10px;
    }

    /* 版块主题优化 */
    #threadlist.tl th {
        width: 100%;
    }
    #threadlist .post_inforight, #threadlist .post_infolist {
        width: 100% !important;
    }
    #threadlist .post_infolist_other .time.y {
        float: left;
        margin-left: 20px;
    }

    /* 文章图片大小自适应 */
    img.zoom {
        width: 100% !important;
        height: auto !important;
    }
    div.sign > img {
        width: auto !important;
        height: 130px !important;
    }

    /* 作者交互栏 */
    .sd_allbox .biaoqi_pls, .sd_allbox .biaoqi_pls > ul {
        display: flex;
        justify-content: space-around;
        width: 100%;
    }

    /* 回复框优化 */
    #f_pst #fastpostform {
        width: 95%;
    }
    #f_pst #fastpostform .ptm {
        display: flex;
        flex-direction: column;
    }
    #f_pst #fastpostform .ptm > button {
        margin: 15px 0;
    }

    /* 页码间距调整 */
    .pgs .pg a,
    .pgs .pg strong,
    .pgs .pg label {
        margin-bottom: 10px;
    }

    /* 搜索框自适应 */
    #nv_search #scform .td_srchtxt, #nv_search #scform .td_srchtxt #scform_srchtxt {
        width: 100%;
    }

    /* 页脚自适应 */
    #nv_search #ft {
        width: 100%;
        min-width: 100%;
        margin: 0;
    }
    .jav-footer {
        min-width: 90%;
    }

    /* 搜索结果页面宽度自适应 */
    #nv_search #threadlist {
        width: 100%;
    }

    /* 返回到顶部按钮 */
    .biaoqi-fix-area, #moquu_top {
        position: fixed !important;
        right: 15px;
        bottom: 15px;
        opacity: .7;
        border: solid 2px grey;
    }
    #moquu_top:hover {
        background: url(/forum/template/javbus/images/ft/gotop.png) 0 -100px #fafafa;
    }

    /* 用户页面优化 */
    #wp > #ct {
        display: flex;
        flex-direction: column;
        background: transparent;
    }
    #wp > #ct > div {
        float: none;
        width: auto;
    }
    #wp > #ct > div.appl {
        order:-1;
        background: white;
        margin-bottom: 0;
    }
    @media (prefers-color-scheme: dark) {
        #wp > #ct > div.appl {
            background: transparent;
        }
    }
    #wp > #ct > div.appl > div.tbn > ul {
        display: flex;
        flex-direction: column;
    }
    #wp > #ct > div.appl > div.tbn > ul > li {
        padding: 0 0 0 10px;
        border-bottom: 1px solid #e6e6e6;
        width: 100%;
    }
    #wp > #ct > div.appl > div.tbn > ul > li.a {
        background: #00000004
    }
    #wp > #ct > div.mn > div.bm.bw0 {
        background: white;
    }
    @media (prefers-color-scheme: dark) {
        #wp > #ct > div.mn > div.bm.bw0 {
            background: black;
        }
    }
    #wp > #ct > div.mn > div.bm.bw0 > ul {
        display: flex;
        flex-wrap: wrap;
    }
    #wp > #ct > div.mn > div.bm.bw0 > form input, #wp > #ct > div.mn > div.bm.bw0 >  form th {
        width: auto;
        white-space: nowrap;
    }

    #wp > #ct > div.mn > div.bm.bw0 {
        overflow-x: auto;
    }
    #wp > #ct > div.mn div.bm.bw0 div.tdats {
        width: 800px !important;
    }

  `;
  document.head.appendChild(metaNode);
  document.head.appendChild(styleNode);
}

// 判断设备是否为移动端
function isMobile() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}