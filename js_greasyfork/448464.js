// ==UserScript==
// @name        khanacademy dark mode
// @namespace   Violentmonkey Scripts
// @match       https://www.khanacademy.org/*
// @match       https://en.khanacademy.org/*
// @grant       unsafeWindow
// @version     1.0
// @author      NarwhalKid
// @description Go into settings and turn on dark mode.
// @downloadURL https://update.greasyfork.org/scripts/448464/khanacademy%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/448464/khanacademy%20dark%20mode.meta.js
// ==/UserScript==

var count = document.createElement('a');
count.id = "count-dm";
count.style.display = 'none';
count.innerText = "1";
document.body.appendChild(count);

var detect = document.createElement('a');
detect.id = "detect-dm";
detect.style.display = 'none';
detect.innerText = "0";
document.body.appendChild(detect);

window.addEventListener('load', function () {
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
  
    function loopDarkCss(){if(getCookie('dm') == 1){
      addGlobalStyle('#outer-wrapper.white-outer-wrapper{background-color:black !important}')
      addGlobalStyle('._ey3s73n{color: #b5b5b5 !important}')
      addGlobalStyle('body{color: #b5b5b5 !important}')
      addGlobalStyle('._1x6ahvlr{color: #b5b5b5 !important}')
      addGlobalStyle('._1g7yqa9{color: #b5b5b5 !important}')
      addGlobalStyle('._172kndo{color: #b5b5b5 !important}')
      addGlobalStyle('._l8rz9z{color: #b5b5b5 !important}')
      addGlobalStyle('._1pb9y725{color: #b5b5b5 !important}')
      addGlobalStyle('._jy7x9px{color: #b5b5b5 !important}')
      addGlobalStyle('._1kr99t83{color: #b5b5b5 !important}')
      addGlobalStyle('._ckhxei{color: #b5b5b5 !important}')
      addGlobalStyle('._w68pn83{color: #b5b5b5 !important}')
      addGlobalStyle('._giiub5 path{fill: #b5b5b5 !important}')
      addGlobalStyle('._4t1yfcf{color: #b5b5b5 !important}')
      addGlobalStyle('._f34ur54{color: #b5b5b5 !important}')
      addGlobalStyle('._3q66gq{color: #b5b5b5 !important}')
      addGlobalStyle('._jgb8jjh{color: #b5b5b5 !important}')
      addGlobalStyle('._jgb8jjh{color: #b5b5b5 !important}')
      addGlobalStyle('._1745n9bz{color: #b5b5b5 !important}')
      addGlobalStyle('._qce00fs{color: #b5b5b5 !important}')
      addGlobalStyle('.widget-privacy-indicator{color: #b5b5b5 !important}')
      addGlobalStyle('.profile-widget-header{border-bottom: 2px solid rgb(255 255 255 / 16%) !important}')
      addGlobalStyle('.widget-privacy-icon{color: #b5b5b5 !important}')
      addGlobalStyle('.profile-widget-name{color: #b5b5b5 !important}')
      addGlobalStyle('.profile-widget .user-statistics-label{color: #b5b5b5 !important}')
      addGlobalStyle('._1pqvuzvb{color: #b5b5b5 !important}')
      addGlobalStyle('._16z6c32g{color: #b5b5b5 !important}')
      addGlobalStyle('._1ysxbwjs{color: #b5b5b5 !important}')
      addGlobalStyle('._1esxpnd{color: #b5b5b5 !important}')
      addGlobalStyle('._1keucx43{color: #b5b5b5 !important}')
      addGlobalStyle('#answercontent input[type=text].perseus-input-size-normal,#answercontent input[type=number].perseus-input-size-normal,.framework-perseus input[type=text].perseus-input-size-normal,.framework-perseus input[type=number].perseus-input-size-normal, .perseus-math-input.mq-editable-field.mq-math-mode{border:1px solid #000 !important;background:#222 !important;color:#FFF !important}')
      addGlobalStyle('#answercontent input[type=text].perseus-input-size-small, #answercontent input[type=number].perseus-input-size-small, .framework-perseus input[type=text].perseus-input-size-small, .framework-perseus input[type=number].perseus-input-size-small{border:1px solid #000 !important;background:#222 !important;color:#FFF !important}')
      addGlobalStyle('#tab-content-coaches .field{border:1px solid #000 !important;background:#222 !important;color:#FFF !important}')
      addGlobalStyle('input[type="text" i]{border:1px solid #000 !important;background:#222 !important;color:#FFF !important}')
      addGlobalStyle('._ycgtiz5{border:1px solid #000 !important;background:#222 !important;color:#FFF !important}')
      addGlobalStyle('._kmckazt{border:1px solid #000 !important;background:#222 !important;color:#FFF !important}')
      addGlobalStyle('._1azps1NaN{border:1px solid #000 !important;background:#222 !important;color:#FFF !important}')
      addGlobalStyle('._4jl7siNaN{border:1px solid #000 !important;background:#222 !important;color:#FFF !important}')
      addGlobalStyle('._rcut57NaN{border:1px solid #000 !important;background:#222 !important;color:#FFF !important}')
      addGlobalStyle('._14wjxigb{border:1px solid #000 !important;background:#222 !important;color:#FFF !important}')
      addGlobalStyle('._1cm2x0of{;background:#222 !important;color:#FFF !important}')
      addGlobalStyle('._xu2jcg .user-bio-edit-view textarea{border:1px solid #000 !important;background:#222 !important;color:#FFF !important}')
      addGlobalStyle('._1q19l6p3{color: #b5b5b5 !important}')
      addGlobalStyle('._pc9bder{color: #b5b5b5 !important}')
      addGlobalStyle('._1s2t3cl rect, ._1s2t3cl polygon{fill: #fff !important}')
      addGlobalStyle('._2970pgr{color: #b5b5b5 !important}')
      addGlobalStyle('.framework-perseus:not(.perseus-article):not(.perseus-mobile) .perseus-radio-option-content .perseus-renderer > .paragraph .paragraph{color: #b5b5b5 !important}')
      addGlobalStyle('._7044vkb{color: #b5b5b5 !important}')
      addGlobalStyle('._1wuiyyxf{background-color: #000 !important}')
      addGlobalStyle('._xmja1e8{background-color: #000 !important}')
      addGlobalStyle('._125m8j1{color: #b5b5b5 !important}')
      addGlobalStyle('._eg6o9to{color: #b5b5b5 !important}')
      addGlobalStyle('._1djt3vmr{color: #b5b5b5 !important}')
      addGlobalStyle('.framework-perseus:not(.perseus-article):not(.perseus-mobile) .perseus-radio-option-content .perseus-renderer > .paragraph{color: #b5b5b5 !important}')
      addGlobalStyle('._lgntti{color: #b5b5b5 !important}')
      addGlobalStyle('._lqicet{color: #b5b5b5 !important}')
      addGlobalStyle('._6pmeaej{color: #b5b5b5 !important}')
      addGlobalStyle('._12bc3sn5{background-color: #ffffff54 !important}')
      addGlobalStyle('._1gjmsdr{background-color: #ffffff54 !important}')
      addGlobalStyle('._8zepmb8{border-color: rgb(255 255 255 / 50%) !important}')
      addGlobalStyle('._19ngjj5z{color: #b5b5b5 !important}')
      addGlobalStyle('._1d4mskp div span{background-color: #fff !important}')
      addGlobalStyle('._yxmlvoe{background-color: #222222 !important}')
      addGlobalStyle('._rngbhz{background-color: #222222 !important}')
      addGlobalStyle('.framework-perseus:not(.perseus-mobile) table tr:nth-child(odd) td{background-color: #222222 !important}')
      addGlobalStyle('._16c6bd9{background-color: #222222 !important}')
      addGlobalStyle('._1c8c7sfc{background-color: #222222 !important}')
      addGlobalStyle('._1ts9uhz3{background-color: #222222 !important}')
      addGlobalStyle('._eplbrxf{background-color: #222222 !important}')
      addGlobalStyle('._12qks37{background-color: #222222 !important}')
      addGlobalStyle('._1mriweti{background-color: #222222 !important}')
      addGlobalStyle('._inf88zz{background-color: #222222 !important}')
      addGlobalStyle('._5ofz56r{background-color: #222222 !important; color: white !important;}')
      addGlobalStyle('._1vg4ur86 path{fill: #fff !important}')
      addGlobalStyle('._lhvgag5{background-color: #000 !important}')
      addGlobalStyle('._151of95k{background-color: rgb(0 0 0 / 0%) !important}')
      addGlobalStyle('._1q4g25m{background-color: rgb(0 0 0 / 0%) !important}')
      addGlobalStyle('._j3zk82z{background-color: rgb(0 0 0 / 0%) !important}')
      addGlobalStyle('.profile-widget{border: none !important}')
      addGlobalStyle('._1055xtn2{background-color: rgb(0 0 0 / 0%) !important}')
      addGlobalStyle('._1no8xwe2{background-color: rgb(0 0 0 / 0%) !important}')
      addGlobalStyle('.task-container{background-color: #000 !important}')
      addGlobalStyle('#answer_area .calculator .history{background-color: #222222 !important}')
      addGlobalStyle('._wok067{background-color: #303030 !important}')
      addGlobalStyle('._14j2uqd0{background-color: #303030 !important}')
      addGlobalStyle('.calc-row.input input{background-color: #000 !important; color: white;}')
      addGlobalStyle('.calc-row.input{background-black;}')
      addGlobalStyle('._1o51yl6 {background-color: #1a1a1a !important}')
      addGlobalStyle('._1923jcq {background-color: #1a1a1a !important}')
      addGlobalStyle('._12yy6f6l {background-color: #1a1a1a !important}')
      addGlobalStyle('.profile-widget {background-color: #1a1a1a !important}')
      addGlobalStyle('.profile-widget-header {background-color: #1a1a1a !important}')
      addGlobalStyle('._f1r4uxc {background-color: #1a1a1a !important}')
      addGlobalStyle('._nbo78u6 {background-color: #1a1a1a !important}')
      addGlobalStyle('._1lbcxvfr{color: #b5b5b5 !important}')
      addGlobalStyle('._1rio1scd{color: #0059ff !important}')
      addGlobalStyle('._kphxfbd{color: #0059ff !important}')
      addGlobalStyle('._16w7jk5{color: #0059ff !important}')
      addGlobalStyle('._h42z2xd{background-color: #000 !important}')
      addGlobalStyle('._kp2byz9{background-color: #000 !important}')
      addGlobalStyle('._nf41ds{background-color: #000 !important}')
      addGlobalStyle('._1fo6imx{background-color: #000 !important}')
      addGlobalStyle('._1ct7vg8q{background-color: #000 !important}')
      addGlobalStyle('._100bc3c{background-color: #000 !important}')
      addGlobalStyle('._zm8q9e div div{background-color: #000 !important}')
      addGlobalStyle('._z44srxq {background-color: #000 !important}')
      addGlobalStyle('._nswsiqd{background-color: #000 !important}')
      addGlobalStyle('._1lcr11{background-color: #000 !important}')
      addGlobalStyle('._1lcr11{background-color: #000 !important}')
      addGlobalStyle('._13lsa9tf{background-color: #000 !important}')
      addGlobalStyle('._tv3vhv{background-color: #000 !important}')
      addGlobalStyle('._n4d7gpg{background-color: #000 !important}')
      addGlobalStyle('._71vn8x8{background-color: #000 !important}')
      addGlobalStyle('._jp1ud6f{background-color: #000 !important}')
      addGlobalStyle('._hhlsdq{background-color: #000 !important}')
      addGlobalStyle('._1hqan4i9{background-color: #000 !important}')
      addGlobalStyle('._ghc47or{background-color: #000 !important}')
      addGlobalStyle('._4701ts{background-color: #000 !important}')
      addGlobalStyle('._91vjm8 ._rllr0t2{background-color: #000 !important}')
      addGlobalStyle('._aeiww5{background-color: #000 !important}')
      addGlobalStyle('._p3vidq9{color: #b5b5b5 !important}')
      addGlobalStyle('._1b6fblvNaN svg path{fill: #b5b5b5 !important}')
      addGlobalStyle('._1pcarpfw{background-color: #000 !important}')
      addGlobalStyle('._hs95etv{background-color: #000 !important}')
      addGlobalStyle('._fss88w4{background-color: #080808 !important}')
      addGlobalStyle('._1l44zfj{color: #b5b5b5 !important}')
      addGlobalStyle('._411h2i4{background-color: #000 !important}')
      addGlobalStyle('._3lndzp8 svg path{fill: #b5b5b5 !important}')
      addGlobalStyle('._1ld084lf{box-shadow: 0px 1px 0px rgb(255 255 255 / 16%) !important}')
      addGlobalStyle('._ax7u0n7{box-shadow: 0px -1px 0px rgb(255 255 255 / 16%) !important}')
      addGlobalStyle('._xh1c4{color: #b5b5b5 !important}')
      addGlobalStyle('._7xl9qe{color: #b5b5b5 !important}')
      addGlobalStyle('#nav-container .user-deets .empty-field, .nav-bar .user-deets .empty-field{color: #b5b5b5 !important}')
      addGlobalStyle('._1verwm58{color: #b5b5b5 !important}')
      addGlobalStyle('._pot4j9l{border-color: #fff !important}')
      addGlobalStyle('._un0iag{background-color: #fff !important}')
      addGlobalStyle('._ndmyafw ._ycgtiz5 input{color: #fff !important; border: none !important;}')
      addGlobalStyle('._ndmyafw ._kmckazt input{color: #fff !important; border: none !important;}')
      addGlobalStyle('.framework-perseus .fixed-to-responsive{background-color: #fff !important}')
      addGlobalStyle('.perseus-widget-radio .unresponsive-svg-image{background-color: #fff !important}')
      addGlobalStyle('._1ell7dku{color: #b5b5b5 !important}')
      addGlobalStyle('._1t8026xi{color: #b5b5b5 !important}')
      addGlobalStyle('.discussion-list-header a{color: #fff !important}')
      addGlobalStyle('._e296pg{background-color: #fff !important}')
      addGlobalStyle('.discussion-list-count{color: rgb(255 255 255 / 64%) !important}')
      addGlobalStyle('._1nwe4wml{color: rgb(255 255 255 / 64%) !important}')
      addGlobalStyle('._4lluki{color: rgb(255 255 255 / 64%) !important}')
      addGlobalStyle('._1dm9z55NaN{color: rgb(255 255 255 / 64%) !important}')
      addGlobalStyle('.avatar-customizer .view-select-button{color: #bfbfbf !important}')
      addGlobalStyle('.avatar-customizer .view-select-button:hover{color: #000 !important}')
      addGlobalStyle('._1d2hveg9{color: #b5b5b5 !important}')
      addGlobalStyle('.avatar-model-name{color: #b5b5b5 !important}')
      addGlobalStyle('._1utmsh47 h1, ._1utmsh47 span{color: #b5b5b5 !important}')
      addGlobalStyle('._ybk80m{color: #b5b5b5 !important}')
      addGlobalStyle('._1mi14yao{color: #b5b5b5 !important}')
      addGlobalStyle('.avatar-part-name{color: #b5b5b5 !important}')
      addGlobalStyle('.badge-count{color: #b5b5b5 !important}')
      addGlobalStyle('._gkt786u{color: #b5b5b5 !important}')
      addGlobalStyle('._18undph9{color: #b5b5b5 !important}')
      addGlobalStyle('._1ypxc3tk{background-color: #202020 !important}')
      addGlobalStyle('._1drpfg{background-color: #121212 !important}')
      addGlobalStyle('._eolar3c{color: #b5b5b5 !important}')
      addGlobalStyle('._6xyn8lv{border-right: 1px solid rgb(255 255 255 / 16%) !important}')
      addGlobalStyle('._9mrohu{border-bottom: 1px solid rgb(255 255 255 / 16%) !important}')
      addGlobalStyle('._1ngaz3r{border-bottom: 1px solid rgb(255 255 255 / 16%) !important}')
      addGlobalStyle('._kphxfbd{border-bottom: 1px solid rgb(255 255 255 / 16%) !important}')
      addGlobalStyle('#username-picker-container .modal-header{border-bottom: 1px solid rgb(255 255 255 / 16%) !important}')
      addGlobalStyle('.modal-footer{border-top: 1px solid rgb(255 255 255 / 16%) !important}')
      addGlobalStyle('._1drkx0h{border-top: 1px solid rgb(255 255 255 / 16%) !important}')
      addGlobalStyle('._1ckw276{background-color: rgb(255 255 255 / 16%) !important}')
      addGlobalStyle('._14xc9dh g g{fill: #292929 !important}')
      addGlobalStyle('.modal-footer{box-shadow: none !important}')
      addGlobalStyle('._yjuxcsq g g{fill: #292929 !important}')
      addGlobalStyle('._e4fy4z{background-color: #000 !important}')
      addGlobalStyle('#username-picker-container .modal-footer{background-color: #000 !important}')
      addGlobalStyle('#nav-container .user-info-container.large-header .user-deets:hover, #nav-container .user-info-container.large-header .avatar-pic-container:hover, .user-summary-view__points-and-badges .profile-badge-count-container:hover{background-color: #363636 !important}')
      addGlobalStyle('._xy39ea8{color: #b5b5b5 !important}')
      addGlobalStyle('._xy39ea8:hover{color: #8b8b8b !important}')
      addGlobalStyle('._1emjesp7{color: #b5b5b5 !important}')
      addGlobalStyle('._14yiarbt{background-color: #000 !important}')
      addGlobalStyle('.DayPicker{background-color: #000 !important}')
      addGlobalStyle('.modal{background-color: #000 !important}')
      addGlobalStyle('._14yiarbt{border-top: 1px solid #505050 !important;}')
      addGlobalStyle('._14yiarbt{border-bottom: 1px solid #505050 !important;}')
      addGlobalStyle('._6h1ide9{background-color: rgb(255 255 255 / 16%) !important}')
      addGlobalStyle('._19hd79zx{color: #b5b5b5 !important}')
      addGlobalStyle('._kvtdl63{color: #b5b5b5 !important}')
      addGlobalStyle('._1x6ahvlr input{color: #000 !important}')
      addGlobalStyle('#linked-accounts span{color: #b5b5b5 !important}')
      addGlobalStyle('._1q2mpu2{background: rgb(56 56 56) !important}')
      addGlobalStyle('#nav-container .user-info-container .user-info, .nav-bar .user-info-container .user-info{background: #2d2d2d !important}')
      addGlobalStyle('._4f6nmsc{background: #2d2d2d !important}')
      addGlobalStyle('#linked-accounts button span{color: #fff !important}')
      addGlobalStyle('._1v7bqtc2{background-color: #000 !important}')
      addGlobalStyle('._158ir6wt{background-color: rgb(56 56 56 / 80%) !important}')
      
    setTimeout(function(){loopDarkCss}),10}}
    loopDarkCss();
  
addGlobalStyle('._z6i8cn5{appearance:none!important;-webkit-appearance:none!important;-moz-appearance:none!important;height:16px!important;width:16px!important;min-height:16px!important;min-width:16px!important;outline:none!important;-moz-box-sizing:border-box!important;box-sizing:border-box!important;border-radius:3px!important;border-color:#1865f2!important;border-style:solid!important;border-width:2px!important;margin:0!important;background:#fff !important;}')
addGlobalStyle('._1wraj14{appearance:none!important;-webkit-appearance:none!important;-moz-appearance:none!important;height:16px!important;width:16px!important;min-height:16px!important;min-width:16px!important;outline:none!important;-moz-box-sizing:border-box!important;box-sizing:border-box!important;border-radius:3px!important;box-shadow:0 0 0 1px #ffffff, 0 0 0 3px #1865f2!important;border-style:solid!important;border-width:0!important;margin:0!important;background:#1865f2 !important;}')
addGlobalStyle('._dwdt5zr{appearance:none!important;-webkit-appearance:none!important;-moz-appearance:none!important;height:16px!important;width:16px!important;min-height:16px!important;min-width:16px!important;outline:none!important;-moz-box-sizing:border-box!important;box-sizing:border-box!important;border-radius:3px!important;box-shadow:0 0 0 1px #ffffff, 0 0 0 3px #1b50b3!important;border-style:solid!important;border-width:0!important;margin:0!important;}')
addGlobalStyle('._1jbkzq85{appearance:none!important;-webkit-appearance:none!important;-moz-appearance:none!important;height:16px!important;width:16px!important;min-height:16px!important;min-width:16px!important;outline:none!important;-moz-box-sizing:border-box!important;box-sizing:border-box!important;border-radius:3px!important;border-color:#1865f2!important;border-style:solid!important;border-width:2px!important;margin:0!important;background:#dae6fd !important;}')
addGlobalStyle('._dwdt5zr{appearance:none!important;-webkit-appearance:none!important;-moz-appearance:none!important;height:16px!important;width:16px!important;min-height:16px!important;min-width:16px!important;outline:none!important;-moz-box-sizing:border-box!important;box-sizing:border-box!important;border-radius:3px!important;box-shadow:0 0 0 1px #ffffff, 0 0 0 3px #1b50b3!important;border-style:solid!important;border-width:0!important;margin:0!important;background:#1b50b3 !important;}')
addGlobalStyle('._iveumfj{-ms-flex-item-align:start!important;-webkit-box-pack:center!important;-ms-flex-pack:center!important;-webkit-box-align:center!important;-ms-flex-align:center!important;position:relative!important;display:inline-flex!important;-webkit-align-items:center!important;align-items:center!important;-webkit-justify-content:center!important;justify-content:center!important;height:40px!important;border:none!important;border-radius:4px!important;cursor:pointer!important;outline:none!important;text-decoration:none!important;-moz-box-sizing:border-box!important;box-sizing:border-box!important;-ms-touch-action:manipulation!important;touch-action:manipulation!important;-webkit-user-select:none!important;-moz-user-select:none!important;-ms-user-select:none!important;user-select:none!important;background:#1865f2!important;color:#fff!important;box-shadow:0 0 0 1px #ffffff, 0 0 0 3px #1865f2!important;-webkit-align-self:flex-start!important;align-self:flex-start!important;margin:0!important;padding:0 16px!important;}')
addGlobalStyle('._k6lx6oo{-ms-flex-item-align:start!important;-webkit-box-pack:center!important;-ms-flex-pack:center!important;-webkit-box-align:center!important;-ms-flex-align:center!important;position:relative!important;display:inline-flex!important;-webkit-align-items:center!important;align-items:center!important;-webkit-justify-content:center!important;justify-content:center!important;height:40px!important;border:none!important;border-radius:4px!important;cursor:pointer!important;outline:none!important;text-decoration:none!important;-moz-box-sizing:border-box!important;box-sizing:border-box!important;-ms-touch-action:manipulation!important;touch-action:manipulation!important;-webkit-user-select:none!important;-moz-user-select:none!important;-ms-user-select:none!important;user-select:none!important;box-shadow:0 0 0 1px #ffffff, 0 0 0 3px #1b50b3!important;background:#1b50b3!important;color:#b5cefb!important;-webkit-align-self:flex-start!important;align-self:flex-start!important;margin:0!important;padding:0 16px!important;}')
addGlobalStyle('._1g8w7j5l{-webkit-transform-origin:50% 50%!important;-ms-transform-origin:50% 50%!important;transform-origin:50% 50%!important;-webkit-animation-name:keyframe_1syiron!important;animation-name:keyframe_1syiron!important;-webkit-animation-duration:1.1s!important;animation-duration:1.1s!important;-webkit-animation-iteration-count:infinite!important;animation-iteration-count:infinite!important;-webkit-animation-timing-function:linear!important;animation-timing-function:linear!important;fill:#fff!important;}')
addGlobalStyle('._1lizgppa{-webkit-box-pack:center!important;-ms-flex-pack:center!important;-webkit-box-direction:normal!important;-webkit-box-orient:vertical!important;-webkit-box-align:stretch!important;-ms-flex-align:stretch!important;-webkit-align-items:stretch!important;align-items:stretch!important;-moz-box-sizing:border-box!important;box-sizing:border-box!important;display:flex!important;-webkit-flex-direction:column!important;-ms-flex-direction:column!important;flex-direction:column!important;z-index:0!important;min-height:0!important;min-width:0!important;-webkit-justify-content:center!important;justify-content:center!important;position:absolute!important;border-style:solid!important;border-width:0!important;margin:0!important;padding:0!important;}')
addGlobalStyle('._jro6t0{display:flex!important;}')
addGlobalStyle('._dv8sq2l{min-height:32px!important;border:solid 1px rgba(0,0,0,0.1)!important;border-radius:4px!important;-moz-box-sizing:border-box!important;box-sizing:border-box!important;font-size:12px!important;line-height:normal!important;position:relative!important;-webkit-animation-name:keyframe_1sh8tyy!important;animation-name:keyframe_1sh8tyy!important;-webkit-animation-duration:.2s!important;animation-duration:.2s!important;-webkit-animation-iteration-count:1!important;animation-iteration-count:1!important;background-color:#1865f2!important;color:#fff!important;width:auto!important;margin-left:16px!important;margin-right:16px!important;padding:16px 36px 16px 24px !important;}')
addGlobalStyle('._xu2jcg{-webkit-box-direction:normal!important;-webkit-box-orient:vertical!important;-webkit-box-align:stretch!important;-ms-flex-align:stretch!important;-webkit-align-items:stretch!important;align-items:stretch!important;-moz-box-sizing:border-box!important;box-sizing:border-box!important;display:flex!important;-webkit-flex-direction:column!important;-ms-flex-direction:column!important;flex-direction:column!important;position:relative!important;z-index:0!important;min-height:0!important;min-width:0!important;border-style:solid!important;border-width:0!important;margin:0!important;padding:0!important;}')
addGlobalStyle('._zazqwri{position:fixed!important;z-index:1090!important;bottom:16px!important;left:50%!important;-webkit-transform:translate(-50%)!important;-ms-transform:translate(-50%)!important;transform:translate(-50%)!important;}')
addGlobalStyle('._ig0jgb{position:absolute!important;right:10px!important;top:10px!important;cursor:pointer!important;}')
  
function addedOnclick() {
  function end(oldCount){setTimeout(function(){if (document.getElementById('count-dm').innerText == oldCount){fade();}},5000);} function appear() {setTimeout(function(){document.getElementById('popup-dm').style.opacity = parseFloat(document.getElementById('popup-dm').style.opacity) + 0.1; if (document.getElementById('popup-dm').style.opacity < 1) {appear()}},10)}; function fade() {setTimeout(function(){document.getElementById('popup-dm').style.opacity = document.getElementById('popup-dm').style.opacity - 0.1;if(document.getElementById('popup-dm').style.opacity > 0){fade()} else {document.getElementById('popup-dm').remove()}},10)}; if (document.getElementById('but-dm').className != '_1q2mpu2'){document.getElementById('but-dm').className = '_1q2mpu2'; document.getElementById('span-dm').style.opacity = '0'; document.getElementById('span-dm').insertAdjacentHTML('afterend', "<div class='_1lizgppa' id='dm-load'><svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' data-test-id='button-spinner'><path fill-rule='nonzero' d='M10.598.943c-.093-.449-.362-.748-.732-.875a1.314 1.314 0 0 0-.723-.033C3.83 1.417 0 6.317 0 11.864 0 18.538 5.398 24 12 24c6.598 0 12-5.471 12-12.16a1.333 1.333 0 0 0-.154-.548c-.193-.368-.544-.606-1.023-.606-.472 0-.825.229-1.035.585-.117.2-.169.39-.189.582-.124 5.472-4.294 9.73-9.599 9.73-5.349 0-9.599-4.3-9.599-9.72 0-4.46 3.036-8.299 7.28-9.444.127-.036.291-.107.458-.232.373-.28.57-.711.46-1.244z' class='_1g8w7j5l'></path></svg></div>"); setTimeout(function(){document.getElementById('dm-load').remove(); document.getElementById('span-dm').style.opacity = '1'; if (document.getElementById('popup-dm')) {document.getElementById('popup-dm').remove();} if ([...document.querySelectorAll("div")].filter(div => div.textContent.includes("Your changes have been saved.")).length >= 3) {[...document.querySelectorAll("div")].filter(div => div.textContent.includes("Your changes have been saved."))[3].remove()}; var div = document.createElement('div'); div.id = "popup-dm"; div.style.opacity = 0; div.innerHTML = '<div class="_zazqwri"><div data-test-id="toast-ChangesSavedNotification" class="_xu2jcg"><div class="_dv8sq2l"><div class="_jro6t0"><div><div>Your changes have been saved.</div></div></div><span class="_ig0jgb" role="button" aria-label="Close" onclick="function fade() {setTimeout(function(){document.getElementById(`popup-dm`).style.opacity = document.getElementById(`popup-dm`).style.opacity - 0.1;if(document.getElementById(`popup-dm`).style.opacity > 0){fade()} else {document.getElementById(`popup-dm`).remove()}},10)} fade();"><svg width="24" height="24" viewBox="0 0 24 24" role="img" aria-label="Close Closes this module."><title>Close</title><desc>Closes this module.</desc><g stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" fill-rule="evenodd"><path d="M16,8 L8,16"></path><path d="M8,8 L16,16"></path></g></svg></span></div></div></div>'; document.getElementById('count-dm').innerText = parseInt(document.getElementById('count-dm').innerText) + 1; document.body.appendChild(div); appear(); const endVar = document.getElementById('count-dm').innerHTML; end(endVar);},500); if (document.getElementById('dark-mode').checked == true){document.cookie='dm=1;expires=Wed, 18 Dec 2026 12:00:00 GMT + ;path=/'} else {document.cookie='dm=0;expires=Wed, 18 Dec 2026 12:00:00 GMT + ;path=/'; }}
}

var url = window.location.href
var addedCheck = '<div class="_ismdrg"><div class="_xu2jcg"><div tabindex="-1" class="_ptu2hpq"><input type="checkbox" aria-invalid="false" id="dark-mode" class="_1on1hge8"><div aria-hidden="true" style="height:100%" onclick="document.getElementById(\'dark-mode\').click()" class="_xg1f1zo"></div><span class="_yu3vti8"><label for="dark-mode">Dark mode</label></span></div></div></div><div class="_ismdrg"><div class="_xu2jcg"><div tabindex="-1" class="_ptu2hpq" style="height: 0px; opacity:0;"><input type="checkbox" aria-invalid="false" id="prefers-reduced-motion2" class="_1on1hge8"><div aria-hidden="true" class="_xg1f1zo"></div><span class="_yu3vti8"><label for="prefers-reduced-motion2">Reduce motion and animations</label></span></div></div></div>'
var addedHTML = '<div class="_6h1ide9"></div><div class="_xu2jcg"><form><div class="_xu2jcg"><h2 class="_ey3s73n" translate="no">Dark mode</h2><div style="-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;-o-user-select:none;user-select:none;"><div aria-hidden="true" style="height:24px" class="_1qxywlbt"></div>' + addedCheck + '</div></form><div aria-hidden="true" class="_1qxywlbt"></div><div class="_duavrzj"><button type="button" id="but-dm" role="button" tabindex="0" aria-disabled="false" class="_1q2mpu2"><span id="span-dm" class="_1alfwn7n">Save changes</span></button></div></div></div>'


if (url == 'https://www.khanacademy.org/settings/email' || url == 'https://en.khanacademy.org/settings/email') {setTimeout(function(){
  if ([...document.querySelectorAll('._g20yn58')].filter(a => a.textContent.includes('Account')).length != 0){[...document.querySelectorAll('._g20yn58')].filter(a => a.textContent.includes('Account'))[0].onclick = function() {document.getElementById('detect-dm').innerText = "1"}}
  function loopDetect2() {setTimeout(function(){
      if (document.getElementById('detect-dm').innerText == "1" && (!document.getElementById('dark-mode'))){
        document.getElementById('detect-dm').innerText = "0"  
        location.reload();
      } else if (document.getElementById('detect-dm').innerText == "1") {
        document.getElementById('detect-dm').innerText = "0"
      }
      loopDetect2();
    }),1000}
    loopDetect2();
},2000)}
  

if (url == 'https://www.khanacademy.org/settings/account' || url == 'https://en.khanacademy.org/settings/account') {
  setTimeout(function(){
  function loop1(){setTimeout(function(){
    if ([...document.querySelectorAll("h2")].filter(h2 => h2.textContent.includes("Accessibility")).length != 0){
      Array.from(document.querySelectorAll('._xu2jcg div'))[96].parentElement.parentElement.parentElement.insertAdjacentHTML('afterend', addedHTML)
      document.getElementById('but-dm').onclick = function(){addedOnclick()};
      if (getCookie('dm') == '1') {
      document.getElementById('dark-mode').checked = true
        document.getElementById('dark-mode').insertAdjacentHTML('afterend', '<svg id="svg-dm" width="16" height="16" viewBox="0 0 16 16" class="_vouqysm"><path fill="#ffffff" d="M11.263 4.324a1 1 0 1 1 1.474 1.352l-5.5 6a1 1 0 0 1-1.505-.036l-2.5-3a1 1 0 1 1 1.536-1.28L6.536 9.48l4.727-5.157z"></path></svg>')
        document.getElementById('dark-mode').className = '_1rkxo54o';
        if ([...document.querySelectorAll('._g20yn58')].filter(a => a.textContent.includes('Account')).length != 0){[...document.querySelectorAll('._g20yn58')].filter(a => a.textContent.includes('Account'))[0].onclick = function() {document.getElementById('detect-dm').innerText = "1"}}
    }
      
      startmain()
    } else {
      loop1()
    }
  },100)
  }
  loop1()
  },2000)
  
  
  function loop2(){setTimeout(function(){
    if ([...document.querySelectorAll("h2")].filter(h2 => h2.textContent.includes("Accessibility")).length != 0){
      Array.from(document.querySelectorAll('._xu2jcg div'))[96].parentElement.parentElement.parentElement.insertAdjacentHTML('afterend', addedHTML)
      document.getElementById('but-dm').onclick = function(){addedOnclick()};
      if (getCookie('dm') == '1') {
      document.getElementById('dark-mode').checked = true
        document.getElementById('dark-mode').insertAdjacentHTML('afterend', '<svg id="svg-dm" width="16" height="16" viewBox="0 0 16 16" class="_vouqysm"><path fill="#ffffff" d="M11.263 4.324a1 1 0 1 1 1.474 1.352l-5.5 6a1 1 0 0 1-1.505-.036l-2.5-3a1 1 0 1 1 1.536-1.28L6.536 9.48l4.727-5.157z"></path></svg>')
        document.getElementById('dark-mode').className = '_1rkxo54o';
        if ([...document.querySelectorAll('._g20yn58')].filter(a => a.textContent.includes('Account')).length != 0){[...document.querySelectorAll('._g20yn58')].filter(a => a.textContent.includes('Account'))[0].onclick = function() {document.getElementById('detect-dm').innerText = "1"}}
    }
      
      startmain()
    } else {
      loop2()
    }
  }),1000}

  
  
    
  function startmain(){
    
    
    function loopDetect() {setTimeout(function(){
      if (document.getElementById('detect-dm').innerText == "1" && (!document.getElementById('dark-mode'))){
        document.getElementById('detect-dm').innerText = "0"  
        loop2()
      } else if (document.getElementById('detect-dm').innerText == "1") {
        document.getElementById('detect-dm').innerText = "0"
      }
      loopDetect();
    }),1000}
    loopDetect();
    
    function loopDelete() {setTimeout(function(){
      if ([...document.querySelectorAll("div")].filter(div => div.textContent.includes("Your changes have been saved.")).length > 11 && document.getElementById('popup-dm')) {
        document.getElementById('popup-dm').remove()
      }
      loopDelete();
    },100)}
    loopDelete();
    
    const isHover = e => e.parentElement.querySelector(':hover') === e;    
    
    

const myDiv = document.getElementById('dark-mode').parentElement.parentElement;
document.addEventListener('mousemove', function checkHover() {
  const hovered = isHover(myDiv);
  if (hovered !== checkHover.hovered) {
    if (hovered) {
      if (document.getElementById('dark-mode').checked == false) {
       document.getElementById('dark-mode').className = "_z6i8cn5" 
      } else {
        document.getElementById('dark-mode').className = "_1wraj14" 
      }
    } else {
      if (document.getElementById('dark-mode').checked == false) {
      document.getElementById('dark-mode').className = "_1on1hge8" 
      } else {
      document.getElementById('dark-mode').className = "_1rkxo54o" 
      }
    }
    checkHover.hovered = hovered;
    
  }
});
    
    function button(status) {
  if (status == 'on') {
    document.getElementById('but-dm').className = '_y7nkfm3'
  } else if (status == 'off') {
    document.getElementById('but-dm').className = '_1q2mpu2'
  } else {
    console.log('check button() call')
  }
}
    
    
    var checkbox = document.getElementById('dark-mode');

checkbox.addEventListener('change', function() {
  if (getCookie('dm') != undefined){
    if (getCookie('dm') == '1' && this.checked || getCookie('dm') == '0' && (!this.checked)) {
      button('off')
    } else {
      button('on')
    }
  } else {
    if (this.checked) {
      button('on')
    } else {
      button('off')
    }
  }
  if (this.checked) {
    document.getElementById('dark-mode').className = "_1wraj14" 
    document.getElementById('dark-mode').insertAdjacentHTML('afterend', '<svg id="svg-dm" width="16" height="16" viewBox="0 0 16 16" class="_vouqysm"><path fill="#ffffff" d="M11.263 4.324a1 1 0 1 1 1.474 1.352l-5.5 6a1 1 0 0 1-1.505-.036l-2.5-3a1 1 0 1 1 1.536-1.28L6.536 9.48l4.727-5.157z"></path></svg>')
  } else {
    document.getElementById('dark-mode').className = "_z6i8cn5"
    document.getElementById('svg-dm').remove();
  }
});
    
document.getElementById('dark-mode').parentElement.parentElement.addEventListener('mousedown', function(event) { 
    if (checkbox.className == "_z6i8cn5") {
      checkbox.className = "_1jbkzq85"
    } else if (checkbox.className == "_1wraj14") {
      checkbox.className = "_dwdt5zr"
    }
});

const myDiv2 = document.getElementById('but-dm');
document.addEventListener('mousemove', function checkHover() {
  const hovered = isHover(myDiv2);
  
    if (hovered !== checkHover.hovered) {
    if (hovered) {
      if (myDiv2.className == '_y7nkfm3'){
      document.getElementById('but-dm').className = '_iveumfj'
      }
      } else if (myDiv2.className != '_1q2mpu2') {
        document.getElementById('but-dm').className = '_y7nkfm3'
    }
    checkHover.hovered = hovered;
  }
  
});
    
document.getElementById('but-dm').parentElement.parentElement.addEventListener('mousedown', function(event) { 
    if (myDiv2.className == "_iveumfj") {
      myDiv2.className = "_k6lx6oo"
    }
    }
);
    
  
    
    

    
    
    
    
    
    
    
    
    
  }}})