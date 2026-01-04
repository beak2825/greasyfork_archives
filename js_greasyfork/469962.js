// ==UserScript==
// @name         douyin-mobile-web
// @description  douyin mobile web
// @version      1.2.8
// @match        https://www.douyin.com/*
// @match        https://live.douyin.com/*
// @namespace    https://trim21.me/
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469962/douyin-mobile-web.user.js
// @updateURL https://update.greasyfork.org/scripts/469962/douyin-mobile-web.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 添加 CSS 样式
    GM_addStyle(`
        body {
        min-width: 100vw!important;
    }
    /*侧边栏*/
    #island_e62be {
        display: none!important;
    }
    /*搜索框右侧登录等按钮*/
    .mXmCULv9 {
        display: none;
    }
    /*搜索框*/
    .NeYeh54v.lRFgiPdH {
        justify-content: center!important;
    }
    .NeYeh54v.lRFgiPdH > .khbqOfnm {
        right: unset!important;
    }

    /*0 视频页面，可分为四种：主视频、从个人主页进入的视频、搜索的视频、右键进入详情页的视频*/
    /* 整个页面字体大小（包括从页面跳转的播放页面） */
    div[data-e2e="feed-active-video"] {
        font-size: 3vh!important
    }
    div[data-e2e="feed-active-video"] * {
        font-size: inherit!important;
    }

    /*# 视频区*/
    .wwNZW6za {
        display: none;
    }
    /*因浏览器限制，需点击打开声音*/
    .mLnbv9qu {
        width: max-content;
    }
    .mLnbv9qu > span {
        line-height: 1em;
    }
    /* 详情、搜索、主视频-展开评论后视频高度及位置 */
    .AgRYNUjK.p0FwxviO .CwuzSMFj,
    .WQ9IVUcw,
    .Kk4V1N2A {
        height: 39%!important;
        top: 0%
    }
    /*详情-展开后视频宽度*/
    .AgRYNUjK.p0FwxviO .CwuzSMFj {
        width: 100%;
    }
    /*搜索、主页、详情页、主视频- 右键菜单*/
    .gBTIKLvy > .bscr7QYw,
    .TgFPIucP > .sUBrJFBU {
        width: 60vw;
    }
    .gBTIKLvy > .bscr7QYw > *,
    .TgFPIucP > .sUBrJFBU > * {
        height: 1em;
        line-height: 1em;
    }
    /*##文案区域*/
    /*当前观看智能画质，登录即可畅享高清画质 文案隐藏*/
    .login-clarity-new {
        display: none!important;
    }
    /*搜索-登录发弹幕提醒*/
    .danmakuContainer {
        display: none;
    }
    /*文案距离底部距离*/
    .ZXLf6yJK {
        bottom: 90px!important;
    }
    /*购物提醒*/
    .ZXLf6yJK > .xgplayer-shop-anchor {
        height: auto!important;
    }
    .qDbnyhyR > div {
        line-height: 1em!important;
        max-width: none!important;
    }
    /* 视频标题宽度 */
    .tSXOCvQc {
        bottom: 5vh!important
    }
    .video-info-detail {
        padding-right: 15%!important;
        opacity: 0.5;
    }
    .video-info-mask {
        display: none
    }
    /*标题作者名*/
    #video-info-wrap div.account-name {
        max-width: 80vw!important
    }
    /*作者声明*/
    .video-info-detail .hY8lWHgA {
        height: auto;
    }
    .video-info-detail .hY8lWHgA * {
        line-height: 1em;
    }
    /*相关搜索、合集提示文案*/
    #video-info-wrap .gGGy4P66.TJvraO00 > * {
        font-size: 0.5em!important;
        line-height: 1em!important;
    }
    /*搜索-相关搜索、合集提示文案*/
    #video-info-wrap .MN8dFKun.Xg7imLcG > * {
        font-size: 0.5em!important;
        line-height: 1em!important;
    }
    /*展开按钮样式*/
    #video-info-wrap .b7Utcf8w.gNNzbQuu.hVNC9qgC.i__ROwvI {
        width: auto;
        font-size: 4vh!important;
        position: relative;
        top: -100%;
    }
    /*搜索-视频展开按钮样式*/
    #video-info-wrap ._f3D05pF.bIxG2tpm.Jn1tVXor.KFKW01cT {
        width: auto;
        font-size: 4vh!important;
        position: relative;
        top: -100%;
    }
    /*## 进度条及以下的控制按钮*/
    /*稍后再看按钮删除*/
    .xgplayer-watch-later {
        display: none!important
    }
    /*连播按钮垂直居中*/
    xg-icon.xgplayer-autoplay-setting.automatic-continuous div.xgplayer-setting-label {
        display: flex;
        align-items: center;
    }
    /*连播文字隐藏*/
    xg-icon.xgplayer-autoplay-setting.automatic-continuous span.xgplayer-setting-title {
        display: none!important;
    }
    /*TA的作品页面打开的视频的连播按钮*/
    .xgplayer-inner-autoplay.automatic-continuous > .xgplayer-icon {
        height: 60px!important;
        width: 60px!important;
    }
    .xgplayer-inner-autoplay.automatic-continuous span {
        display: none!important;
    }
    .xgplayer-inner-autoplay.automatic-continuous svg {
        height: 32px!important;
        width: 32px!important;
    }
    .xgplayer-inner-autoplay.automatic-continuous .inner-autoplay-name {
        display: none!important;
    }
    .xgplayer-inner-autoplay.automatic-continuous .inner-autoplay-item {
        width: auto!important;
    }
    .Fazh5up0 {
        display: none!important;
    }
    .YGV2M4yA > .NVMTSRau {
        padding: 0!important;
        margin: 0!important;
        justify-content: center;
        align-items: center;
        height: 52px!important;
    }
    .QVzawvXG.h7QgyCCV .NVMTSRau svg {
        height: 32px!important;
        width: 32px!important;
    }
    /*## 右侧工具条*/
    /*头像*/
    .ZgMmtbts.rXvqsizP.avatar-component-avatar-container.RrX8vYKR {
        width: 2em!important;
        height: 2em!important;
    }
    /* 搜索-头像 */
    .uUjpLYc2.k13DwHsB.O1xRgMXN,
    .YTu_A7CW.bx6jfq7y.xfVAG0BN {
        margin: 0;
    }
    /*主视频、搜索-头像上的关注按钮*/
    .nXxdBsF1,
    .E9RYG4AQ {
        display: none!important;
    }

    /* 主页、搜索、主视频-视频竖版功能按钮宽度 */
    .jkfSVWLT.immersive-player-switch-on-hide-interaction-area,
    #sliderVideo .OFZHdvpl,
    #sliderVideo div.jkfSVWLT,
    #douyin-right-container .danMuPlayerStyle .jkfSVWLT {
        font-size: 1vh!important;
        margin-bottom: 5vh!important;
    }

    /*更多（三个点）工具按钮*/
    ._bIvBpSr.kMPuAtFs.aum0ytaX.hpJHgURZ {
        display: none;
    }

    /*# 评论区*/
    /* 详情、主视频-展开评论后评论宽高及位置 */
    .AgRYNUjK.p0FwxviO .KwRNeXA3,
    #videoSideBar {
        position: absolute;
        left: 0;
        width: 100%;
        height: 61%;
        top: 39%;
    }
    /*详情-展开后评论宽度*/
    .AgRYNUjK.p0FwxviO .KwRNeXA3 > .g6weGo6f {
        width: 100%;
    }

    /*评论区关闭按钮放大*/
    .bGFLXmqd > svg {
        width: 3em!important;
        height: 3em!important;
    }
    /*搜索-评论区字体高度*/
    #merge-all-comment-container * {
        line-height: normal;
    }
    /*## TA的作品*/
    /*TA的作品作者*/
    .j5WZzJdp.dB25Roa1 {
        line-height: unset!important;
        height: auto!important;
        max-width: unset!important;
    }
    .hY8lWHgA.d2Y90CON {
        height: auto!important;
    }
    /*TA的作品字体*/
    .author-card-user-name {
        height: auto!important;
    }
    .Nu66P_ba.MDEPW30B {
        max-width: unset!important;
        line-height: 1!important;
        height: auto!important;
    }
    .author-card-user-stats {
        height: auto!important;
    }
    .B3AsdZT9.Onp3QgDp {
        height: auto!important;
    }
    .author-card-follow-btn {
        height: auto!important;
    }
    /*置顶文案*/
    .user-video-tag > span {
        height: 1em!important;
    }
    .user-video-tag > div {
        height: 1em!important;
    }
    .author-card-user-video-like > span {
        height: 1em!important;
    }
    /*下拉作品到底后正在播放按钮*/
    .user-video-playing-tag {
        width: auto!important;
        height: auto!important;
    }
    /*下拉作品到底后立即登录按钮*/
    .FfhvF97H > button {
        display: none!important;
    }
    /*作品集*/
    .aiixcCOU {
        flex-wrap: wrap;
        height: auto!important;

        width: 100%!important;
    }
    .h5BRcBRX {
        line-height: 1em!important;
    }
    /*## 相关推荐*/
    .gBDjW6kc.h8OnFt9N {
        height: auto!important;
    }
    #related-card-list-container .j5WZzJdp.xjCh3z8T {
        line-height: 1em!important;
        max-width: none!important;
    }
    #related-card-list-container div.mBOrkQmy.KjNWIr8t {
        font-size: 0.8em!important
    }
    /*## 合集*/
    /*收藏按钮*/
    .nCZYPNFP {
        display: none!important;
    }
    .TeyNCz2V {
        height: auto!important;
    }
    .TeyNCz2V h4 {
        line-height: 1em!important;
        max-width: none!important;
    }
    .TeyNCz2V p {
        line-height: 1em!important;
        max-width: none!important;
    }

    /*1 个人主页https://www.douyin.com/user/* */
    /*整体字体及宽度*/
    .lfsfx_uh.vBN4fX8S.feJVidxC {
        font-size: 3vh!important
    }
    .lfsfx_uh.vBN4fX8S.feJVidxC > div {
        width: calc(100% - 40px)!important;
    }
    .lfsfx_uh.vBN4fX8S.feJVidxC * {
        font-size: inherit!important;
        line-height: 1em!important;
    }

    /*# 个人简介部分*/
    /*头像大小*/
    .BhdsqJgJ {
        display: grid;
        place-items: center;
    }
    .BhdsqJgJ > .avatar-component-avatar-container {
        width: auto !important;
        height: auto !important
    }
    /*关注、私信、分享等按钮*/
    .SwoeMAEU {
        display: none!important
    }

    .lAAqxPDf {
        flex-wrap: wrap;
    }
    /*抖音号和ip*/
    .cOO9eQ6W {
        height: auto!important;
        flex-wrap: wrap;
    }
    /*个人介绍文案*/
    .X45g5WK0 {
        height: auto!important;
    }
    /*文案后的更多*/
    .XX4hM3FI {
        flex: 1 0 auto;
    }

    /*# 视频列表部分*/
    .GE_yTyVX {
        margin: 0 auto;
    }
    .GE_yTyVX > .J5eTQYYD {
        margin: 0;
        width: 100%!important;
    }
    /*作品 喜欢栏*/
    .GE_yTyVX .VY99MKHS {
        flex: 1 0 auto;
    }
    .GE_yTyVX .TyOzgFCS {
        flex: 1 0 auto;
    }
    /*个人头像及关注按钮*/
    .hWi4et1X.ovbAsT2X {
        display: none;
    }
    /*搜索TA的作品*/
    .Od_WDTIn.TyX3HvdZ {
        flex: 1 1 auto;
    }
    .kTWX1Ue1 {
        left: 0;
    }
    /*# 合集*/
    .chV42PC_.Q_uOVQ1u {
        width: auto!important;
    }
    .OFs0DPTA > p {
        height: auto!important;
    }
    #douyin-right-container p.UKMDZc86 {
        font-size: 2vh!important;
    }
    #douyin-right-container p.ZWVlTcVJ {
        font-size: 2vh!important;
    }
    /*展开全部*/
    .lNYhMAbF .rBtO1tap {
        width: 100%!important;
    }

    /*2 视频作品页面https://www.douyin.com/video/* */
    .HP7m07TM.playerControlHeight * {
        font-size: inherit!important;
    }
    .HP7m07TM.playerControlHeight {
        font-size: 3vh;
    }
    /*举报按钮*/
    #douyin-right-container .aryhJWD7 {
        display: none;
    }
    /*点赞等文案*/
    #douyin-right-container .YuF0Acwt {
        font-size: 0.5em!important;
    }

    /*3 直播页面https://live.douyin.com/* */
    /*抖音直播整体字体*/
    #_douyin_live_scroll_container_ {
        font-size: 3vh!important
    }
    #_douyin_live_scroll_container_ * {
        font-size: inherit!important;
        line-height: 1em!important;
    }
    /*直播视频底部工具图标大小*/
    #_douyin_live_scroll_container_ xg-icon {
        width: 5rem!important;
        height: 5rem!important;
        justify-content: center;
    }
    /*直播视频底部工具音量*/
    .xgplayer-volume > .xgplayer-icon {
        left: 50%;
        /* 将元素移动到父容器的水平中心 */
        transform: translate(-50%, -50%)!important;
        /* 将元素向左移动自身宽度的一半 */
    }
    /*直播视频底部工具播放*/
    .xgplayer-play > .xgplayer-icon {
        left: 50%;
        /* 将元素移动到父容器的水平中心 */
        transform: translate(-50%, -50%)!important;
        /* 将元素向左移动自身宽度的一半 */
    }
    /*直播视频底部工具全屏*/
    .xgplayer-fullscreen > .xgplayer-icon {
        left: 50%;
        /* 将元素移动到父容器的水平中心 */
        transform: translate(-50%, -50%)!important;
        /* 将元素向左移动自身宽度的一半 */
    }
    /*直播视频底部工具旋转*/
    .xgplayer-rotate > .xgplayer-icon {
        left: 50%;
        /* 将元素移动到父容器的水平中心 */
        transform: translate(-50%, -50%)!important;
        /* 将元素向左移动自身宽度的一半 */
    }
    #_douyin_live_scroll_container_ xg-icon svg {
        transform: scale(4);
    }
    div.sLHkIpHN[data-index="12"] {
        height: 5rem!important;
    }
    /*弹幕开关选项*/
    .oUAvfk_K {
        width: max-content!important;
    }
    .oUAvfk_K .i5Dc_A5T {
        height: 1em!important;
    }
    /*屏幕旋转提示文案*/
    .xgplayer-rotate > .xg-tips {
        display: none!important;
    }
    /*侧边栏*/
    #island_da635 {
        display: none!important;
    }
    /*直播底部礼物栏*/
    .aqK_4_5U {
        display: none!important;
    }
    /*# 全屏状态去除弹幕区*/
    .UdVKTDud.is-theater > #island_4a5da {
        display: none!important;
    }
    /*# 非全屏状态*/
    /*视频和弹幕布局*/
    .SxMeCeGo.bjSLolNw.FajI1BLp {
        flex-direction: column;
        padding-right: 0!important;
    }
    /*## 视频区*/
    .DFH1PTN6.GHbPXLO9.gy6iQuNw.__playerIsFull.__roomInfoBarInner {
        width: 100%;
    }
    /*## 弹幕区*/
    #island_4a5da {
        flex-basis: 39%;
        display: block;
    }
    /*弹幕区宽度*/
    #chatroom {
        width: 100%;
        height: 100%;
    }
    /*弹幕区：需先登录，才能开始聊天*/
    .kuew7rkS.nMPh_vWR {
        display: none!important;
    }




    /*关闭水平滚动*/
    ._bEYe5zo {
        overflow-y: unset!important;
    }
    /*搜索框*/
    .AFTy15pW {
        width: 100vw!important;
    }
    .lPytbapz {
        margin: 0 auto;
        width: 50%!important;
    }
    /*侧边栏*/
    div.N_HNXA04.KYtgzo9m {
        display: none
    }
    /*头部右侧图标*/
    .iqHX00br {
        display: none
    }
    /*个人简介*/
    .wTV10cVL {
        height: auto!important;
        flex-wrap: wrap
    }
    .eDwMD7wB {
        height: auto!important;
        flex-wrap: wrap
    }

    /*个人介绍的更多按钮不缩进*/
    .i5w9Y0wZ {
        flex-shrink: 0
    }

    /*整体字体大小*/
    ._LDrC7Wb.Smb5gBZJ {
        font-size: 2vh!important;
        line-height: 3vh!important;

        width: 100vw!important;
        margin: 0
    }
    ._LDrC7Wb.Smb5gBZJ * {
        font-size: inherit!important;
        line-height: inherit!important;
    }

    /*整体瀑布流排版*/
    .EZC0YBrG.Nfs9sicY {
        display: flex;
        flex-wrap: wrap;
    }

    .Eie04v01._Vm86aQ7.PISbKxf7 {
        flex: 0 0 calc(50% - 10px);

        margin: 5px;
    }
    /*视频文案*/
    .__0w4MvO {
        height: auto !important;
    }



    /*弹幕按钮设置*/
    div.wUFzLKZF.danmakuContainer {
        display: none!important
    }

    /*TA的作品*/
    .xgnFsawv.gk3ariuU .rrDv0xv4 svg {
        height: 2em!important;
        width: 2em!important;
    }
    .xgnFsawv .rrDv0xv4 {
        height: auto;
        margin-top: 0
    }
    .xgnFsawv.gk3ariuU .b_o0jOiZ {
        height: auto;
        top: -300px;
    }
    /*直播*/
    .tGBLU2eM.CesTJB9J {
        display: none
    }
    div[data-index="30"] {
        display: none
    }
    xg-icon[data-index="15"] {
        display: none
    }
    xg-icon[data-index="0.7"] {
        display: none
    }
    div[data-index="12"] {
        height: 32px!important
    }
    .sZpq_8QT .mC7Tdutu {
        display: none
    }
    .vBglP_gH .xg-inner-controls.xg-pos {
        flex-direction: column-reverse;
    }
    .xg-top-bar {
        flex-direction: column;
    }
    .tGBLU2eM.uLi3I6pi {
        margin: 0!important
    }
    .tGBLU2eM.bNdDEy7b {
        margin: 0!important
    }

    #relatedVideoCard {
        margin-top: 1vh;
        height: 95%
    }
    .F7ubq_7y.HfWacTUC {
        line-height: 1.2!important
    }
    .F7ubq_7y.HfWacTUC * {
        line-height: inherit!important;
    }
    .LTjSZck8 {
        line-height: 1.2!important
    }
    .LTjSZck8 * {
        line-height: inherit!important;
    }
    .comment-input-container {
        display: none
    }
    .comment-reply-expand-btn {
        height: auto!important
    }
    .comment-item-stats-container {
        height: auto!important
    }
    .comment-item-tag {
        height: auto!important
    }
    /*评论区登录提示删除*/
    #related-video-card-login-guide {
        display: none
    }
    .T3p4lV8L {
        filter: none!important
    }
    .IXR56A9B {
        width: 144px!important;
        height: 144px!important;
        position: relative!important;
        top: 144px!important;
    }
    .ojlTaq_K {
        width: 100%!important;
        height: 100%!important;
    }
    /*评论区表情包大小*/
    .nxcdnPYU {
        height: 1em!important;
        width: 1em!important;
    }
    .avatar-component-avatar-container {
        height: 1em!important;
        width: 1em!important;
    }
    /*右侧工具栏头像大小*/
    .F55pZYYH.zzYG7dwz.avatar-component-avatar-container.pXlwVyyi {
        height: 6rem!important;
        width: 6rem!important;
    }
    .YTu_A7CW.bx6jfq7y.xfVAG0BN {
        transform: scale(0.5)!important;
    }

    /*播放器进度粗细*/
    /* 视频宽度 */
    .playerContainer {
        width: 100% !important;
    }
    /*视频点击高亮框去除*/
    .xgplayer {
        cursor: unset
    }
    /* 播放器高度 */
    .xg-video-container {
        height: 100%
    }
    /* 视频功能按钮宽度 */
    .xg-inner-controls {
        height: 5vh!important;
    }
    .xgplayer-icon {
        height: auto!important;
    }
    .xg-left-grid {
        margin-right: 0!important;
    }

    xg-icon {
        width: auto!important
    }
    div > div.btn {
        width: 100px!important
    }
    .xgplayer-playback-setting {
        display: none!important
    }
    .xgplayer-playclarity-setting {
        display: none!important;
        width: 100px!important
    }
    .xgplayer-immersive-switch-setting {
        display: none!important
    }
    svg {
        width: 1.5em;
        height: 1.5em
    }
    .xccodDG4.o1olQOk8.DhEeeU3v.J8_Uj1cS.nFZmQGu5 {
        display: none!important
    }
    .hsd7joJs.reF8E9xU.haewSe6p.MwxqXGbB {
        display: none!important
    }
    .xgplayer-playswitch {
        display: none
    }
    /*去掉登录弹窗*/
    .ezAK2PYX.screen-mask.login-mask-enter-done {
        display: none!important;
    }
    .OSowUG5M.YLHY5sXH.z_yslvRI.CXxmUQNA.my9jhPXB {
        display: none!important;
    }
    /*删除上下滚动视频提示图片*/
    .I6ivXmaS {
        display: none;
    }
    /*删除验证码图片#captcha_container*/
    #vc_captcha_box > div {
        width: 100vw !important;
        font-size: 3vh!important
    }
    #vc_captcha_box > div * {
        font-size: inherit!important;
    }
    .captcha_verify_container1.style__CaptchaWrapper-sc-1gpeoge-0.zGYIR {
        width: 100vw !important;
        font-size: 3vh!important
    }
    .captcha_verify_container1.style__CaptchaWrapper-sc-1gpeoge-0.zGYIR * {
        font-size: inherit!important;
    }
    .captcha_verify_img--wrapper1.sc-VigVT.gZrivk {
        width: 95.2vw!important;
        height: 59.36vw!important;
    }
    /*删除关闭按钮*/
    .verify-bar-close--icon {
        height: 3vh!important;
        width: 3vh!important;
    }
    .captcha_verify_bar--close {
        right: 3vh!important;
    }
    /*验证码下方工具条宽高*/
    .captcha_verify_action.sc-jDwBTQ.dhdXHN div.sc-gPEVay.hdkDPH {
        line-height: initial;
    }
    .verify-captcha-submit-button {
        width: 7vh!important;
        height: 4vh!important;
        line-height: 4vh!important;
    }

      `);
    function waitForElementAndClick(selector, interval, maxAttempts) {
        let attempts = 0;

        function checkAndClick() {
            const element = document.querySelector(selector);

            if (element) {
                element.click();
                console.log(selector, 'Element found and clicked.');
            } else {
                attempts++;
                if (attempts < maxAttempts) {
                    console.log(selector, 'Element not found. Retrying in ' + interval + 'ms...');
                    setTimeout(checkAndClick, interval);
                } else {
                    console.log('Max attempts reached.' + selector, +' Element not found.');
                }
            }
        }

        checkAndClick();
    }

    // 使用示例
    if (window.location.hostname === 'live.douyin.com')
        return waitForElementAndClick('.xgplayer-fullscreen > div.xgplayer-icon', 1000, 10);

    waitForElementAndClick('.xgplayer-page-full-screen > div.xgplayer-icon', 1000, 10);

})();
