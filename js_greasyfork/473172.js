// ==UserScript==
// @name     acfunlivedanmake
// @description acfunlivedanmaku
// @namespace syachiku
// @author       syachiku
// @match        https://live.acfun.cn/live/*
// @run-at document-end
// @grant   GM_addStyle
// @grant GM_getResourceURL
// @grant   GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @version  1.1.0
// @require https://cdn.jsdelivr.net/npm/qs@6.9.4/dist/qs.min.js
// @require https://cdn.jsdelivr.net/npm/uuid@8.3.2/dist/umd/uuidv4.min.js
// @require https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js
// @require https://cdn.jsdelivr.net/npm/moment@2.18.1/min/moment.min.js
// @require https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.min.js
// @require https://cdn.jsdelivr.net/npm/element-ui@2.15.1/lib/index.js
// @require https://cdn.jsdelivr.net/npm/file-saver@2.0.2/dist/FileSaver.min.js
// @require https://cdn.jsdelivr.net/npm/exceljs@4.2.1/dist/exceljs.min.js
// @require https://cdn.jsdelivr.net/npm/clipboard-polyfill@2.5.4/build/clipboard-polyfill.min.js
// @require https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require https://cdn.jsdelivr.net/npm/keymaster@1.6.2/keymaster.min.js
// @require https://cdn.jsdelivr.net/npm/easy-danmaku-js@1.0.6/demo/easy-Danmaku.min.js
// @require https://cdn.jsdelivr.net/npm/jquery-countdown@2.2.0/dist/jquery.countdown.min.js
// @require https://cdn.jsdelivr.net/npm/hotkeys-js@3.7.3/dist/hotkeys.min.js
// @downloadURL https://update.greasyfork.org/scripts/473172/acfunlivedanmake.user.js
// @updateURL https://update.greasyfork.org/scripts/473172/acfunlivedanmake.meta.js
// ==/UserScript==



;(async function(){

    const config = {
      UID : parseInt(window.location.href.split('/').pop()),
      TOKEN : null,
      ACFUN_SERVER : 'https://www.acfun.cn',
      ACFUNLIVE_SERVER : 'https://live.acfun.cn',
      URLS : {
        USER : {
          INFO : '/user/info',
        },
        ACFUN_USER : {
          VUP : '/user/acfun_user_info_simplified',
          INFO : '/rest/pc-direct/user/userInfo',
          SPACE : '/u'
        },
        DOUGA : {
          COMMENT : '/rest/pc-direct/comment/list',
          VIDEO : '/v',
          ARTICLE : '/a',
          BANGUMI : '/bangumi'
        },
      },
      RESPONSE : {
        FIELD : {
          STATUS : 'code',
          MSG : 'message',
          DATA : 'data',
        },
        STATUS : {
          SUCCESS : 200,
        }
      }
    };
  
    const css = `
      /* base html */
      #header,#footer,
      .main>.list-container.outer-wrapper,
      .main>.list-container.outer-wrapper:before,
      .container-live>.left,
      .live-feed-watching,
      .container-live-feed-messages:before
      {display:none!important}
      #app>.main,
      .player-outer-wrapper,
      .player-outer-wrapper>.container-live,
      .player-outer-wrapper>.container-live>.container-live-feed.right,
      .player-outer-wrapper>.container-live>.container-live-feed.right>.live-feed,
      .player-outer-wrapper>.container-live>.container-live-feed.right>.live-feed>.container-live-feed-messages,
      .player-outer-wrapper>.container-live>.container-live-feed.right>.live-feed>.container-live-feed-messages>.live-feed-messages
      {
        display:block!important;
        position:fixed!important;
        width:100%!important;
        height:100%!important;
        margin:0!important;
        padding:0!important;
        border:0!important;
        top:0!important;
        bottom:0!important;
        word-break:break-all!important;
      }
      .live-feed-input{
        display : none !important;
      }
  
      @keyframes scaleDraw {  /*定义关键帧、scaleDrew是需要绑定到选择器的关键帧名称*/
              0%{
                  transform: scale(1);  /*开始为原始大小*/
              }
              25%{
                  transform: scale(1.5); /*放大1.1倍*/
              }
              50%{
                  transform: scale(1);
              }
              75%{
                  transform: scale(1.5);
              }
          }
        .scale-anime{
              -webkit-animation: scaleDraw 5s ease-in-out;
          }
  
      .container-live-feed-messages-acfunlive:before{
        display:none!important;
      }
      .container-live-feed-messages-acfunlive{
        display:block!important;
        position:fixed!important;
        width:100%!important;
        height:100%!important;
        margin:0!important;
        padding:0!important;
        border:0!important;
        top:0!important;
        bottom:0!important;
        word-break:break-all!important;
      }
  
      .container-live-feed-messages-acfunlive .live-message-container.live-message-container-vertical{
        height: 100%;
        overflow-y: auto;
      }
      .container-live-feed-messages-acfunlive .live-message-container.live-message-container-horizontal{
        width: 100%;
        height: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        display : flex;
        flex-direction: column;
        flex-wrap: wrap;
      }
      .container-live-feed-messages-acfunlive .live-message-container.live-message-container-vertical.active::-webkit-scrollbar{
        width: 10px;
        height: 1px;
      }
      .container-live-feed-messages-acfunlive .live-message-container.live-message-container-vertical.inactive::-webkit-scrollbar{
        display:none;
      }
      .container-live-feed-messages-acfunlive .live-message-container.live-message-container-vertical::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: #535353;
      }
      .container-live-feed-messages-acfunlive .live-message-container.live-message-container-vertical::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 10px;
        background: #EDEDED;
      }
  
      .container-live-feed-messages-acfunlive .live-message-container.live-message-container-horizontal.active::-webkit-scrollbar{
        height: 10px;
        width: 1px;
      }
      .container-live-feed-messages-acfunlive .live-message-container.live-message-container-horizontal.inactive::-webkit-scrollbar{
        display:none;
      }
      .container-live-feed-messages-acfunlive .live-message-container.live-message-container-horizontal::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: #535353;
      }
      .container-live-feed-messages-acfunlive .live-message-container.live-message-container-horizontal::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 10px;
        background: #EDEDED;
      }
  
      .container-live-feed-messages-acfunlive .live-message-container .live-message-popup{
        display:flex;
        padding: 7px;
        width: 100%;
      }
      .container-live-feed-messages-acfunlive .live-message-container .live-message-popup .live-message-popup-right{
        margin-left : 5px;
        width: 90%;
      }
  
      @keyframes clippath{
        0%, 100% {clip-path: inset(0 0 100% 0);}
        25% {clip-path: inset(0 100% 0 0);}
        50% {clip-path: inset(100% 0 0 0);}
        75% {clip-path: inset(0 0 0 100%);}
      }
      .container-live-feed-messages-acfunlive .live-message-container .live-message-popup .live-message-border-flow{
        position: relative;
      }
  
  
      .live-message-border-flow .border-flow-item::before,.live-message-border-flow .border-flow-item::after{
        content: "";
        position: absolute;
        transition: all .5s;
        animation: clippath 3s infinite linear;
      }
      .live-message-border-flow .border-flow-item::after{
        animation: clippath 3s -1.5s infinite linear;
      }
  
      .container-live-feed-messages-acfunlive .live-message-container .live-message-popup .live-message-danmaku{
        margin-top: 3px;
        padding: 5px 12px 5px 12px;
        box-sizing: border-box;
        word-break: break-all;
        cursor: pointer;
      }
      .container-live-feed-messages-acfunlive .live-message-container .live-message-popup .live-message-danmaku .live-message-douga{
        margin-top: 10px;
      }
      .container-live-feed-messages-acfunlive .live-message-container .live-message-popup .live-message-danmaku .live-message-douga .el-card{
        background: transparent;
        border: transparent;
        box-shadow: 0px 2px 12px rgba(0, 0, 0, 30%);
        border-radius: 0px;
      }
      .container-live-feed-messages-acfunlive .live-message-container .live-message-popup .live-message-danmaku .live-message-douga .el-card__body{
        padding: 10px;
      }
      .container-live-feed-messages-acfunlive .live-message-container .live-message-popup .live-message-danmaku .live-message-douga .douga-info{
      }
      .container-live-feed-messages-acfunlive .live-message-container .live-message-popup .live-message-danmaku .live-message-douga .douga-info .douga-info-right{
        height : 100%;
        display:flex;
        flex-direction:column;
        justify-content:space-between;
      }
      .container-live-feed-messages-acfunlive .live-message-container .live-message-popup .live-message-danmaku .live-message-douga .douga-info .cover{
        display:inline-block;
        border-radius : 4px;
      }
      .container-live-feed-messages-acfunlive .live-message-container .live-message-popup .live-message-danmaku .live-message-douga .douga-info .cover >img{
        object-fit:cover;
          display: block;
          height: 100%;
          vertical-align: middle;
      }
      .container-live-feed-messages-acfunlive .live-message-container .live-message-popup .live-message-danmaku .live-message-douga .douga-info .title-container{
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
      .container-live-feed-messages-acfunlive .live-message-container .live-message-popup .live-message-danmaku .live-message-douga .douga-info.article .title{
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .container-live-feed-messages-acfunlive .live-message-container .live-message-popup .live-message-danmaku .live-message-douga .douga-info.article .description{
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        filter : invert(100%);
      }
      .container-live-feed-messages-acfunlive .live-message-container .live-message-popup .live-message-danmaku .live-message-douga .douga-info .up{
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .container-live-feed-messages-acfunlive .live-message-container .live-message-popup .live-message-danmaku .live-message-douga .douga-info .play-count{
      }
      .container-live-feed-messages-acfunlive .live-message-container .live-message-popup .live-message-gift{
        width: max-content;
        display: table-cell;
          margin-top: 3px;
          padding: 5px 12px 5px 12px;
          box-sizing: border-box;
          word-break: break-all;
      }
      .container-live-feed-messages-acfunlive .live-message-container .live-message-popup .live-message-gift .live-message-gift-count{
          pointer-events: none;
          display: inline-block;
      }
  
      .user-info-badge{
          border-radius: 4px;
          padding-left: 4px;
          padding-right: 4px;
          color: white;
      }
      .user-info-badge-green{
          background-image: linear-gradient(30deg, #14bd5a, #40E584, #01b54c);
      }
      .user-info-badge-blue{
          background-image: linear-gradient(30deg, #32A9DE, #4fbdef, #0e9ada);
      }
      .user-info-badge-orange{
          background-image: linear-gradient(30deg, #eb9f19, #e6a01b, #f19b00);
      }
      .user-info-badge-red{
          background-image: linear-gradient(30deg, #d43535, #e25537, #e94a47);
      }
      .user-info-badge-purple{
          background-image: linear-gradient(30deg, #4801FF, #7918F2, #AC32E4);
      }
      .user-info-badge-black{
          background-image: linear-gradient(30deg, #5e659d, #5e659d, #3c4270);
      }
      .user-info-badge-vup{
          background-image: linear-gradient(30deg, #32A9DE, #4fbdef, #0e9ada);
      }
      .user-info-username{
      }
  
  
      .container-live-feed-messages-acfunlive .live-message-container .live-message-inline{
        text-align : center;
        display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
      }
  
      .container-live-feed-messages-acfunlive .live-feed-dropmenu.live-feed-dropmenu-horizontal{
        display:block;
        position:absolute;
        top : 50px;
        left : 50px;
        z-index : 999999;
      }
      .container-live-feed-messages-acfunlive .live-feed-dropmenu.live-feed-dropmenu-vertical{
        display:block;
        position:absolute;
        top : 50px;
        right : 50px;
        z-index : 999999;
      }
  
      /*.live-feed-input:hover{
          opacity : 1;
      }*/
  
      @font-face{
        font-family:element-icons;
        src:url('https://cdn.jsdelivr.net/npm/element-ui@2.15.1/lib/theme-chalk/fonts/element-icons.ttf');
      }
  
      .lottery-form-dialog {
        z-index : 999999;
        height: 400px;
      }
  
      .lottery-form-dialog .el-dialog__body{
        height : 80%;
        overflow-y: auto;
      }
  
      .lottery-form .gift-selector .el-select-dropdown__item{
        height : 40px;
        line-height : 40px;
      }
  
      .lottery-form .el-divider{
        margin-top : 40px;
      }
      .lottery-form .el-divider .el-divider__text{
        color : #409EFF;
      }
      .lottery-form .douga-list-wrapper{
        overflow:auto;
        height:200px;
      }
  
      .lottery-form .douga-list-wrapper .douga-list .douga-list-item.video .douga-info{
        height : 100px;
      }
      .lottery-form .douga-list-wrapper .douga-list .douga-list-item.article .douga-info{
        height : 60px;
      }
      .lottery-form .douga-list-wrapper .douga-list .douga-list-item .douga-info .douga-info-right{
        height : 100%;
        display:flex;
        flex-direction:column;
        justify-content:space-between;
      }
      .lottery-form .douga-list-wrapper .douga-list .douga-list-item .cover{
        display:inline-block;
        height:100px;
        width:177px;
        line-height:100px;
        border-radius : 4px;
      }
      .lottery-form .douga-list-wrapper .douga-list .douga-list-item .cover >img{
        object-fit:cover;
          display: block;
          height: 100%;
          vertical-align: middle;
      }
      .lottery-form .douga-list-wrapper .douga-list .douga-list-item.video .title{
        height:60px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        font-weight : bold;
      }
      .lottery-form .douga-list-wrapper .douga-list .douga-list-item.article .title{
        height:40px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-decoration : underline;
        font-weight : bold;
      }
      .lottery-form .douga-list-wrapper .douga-list .douga-list-item .el-card:hover{
        background-color : #409effb0;
        cursor:pointer;
        color : white;
      }
      .lottery-form .douga-list-wrapper .douga-list .douga-list-item.active .el-timeline-item__tail{
        border-left: 2px solid #409EFF;
      }
      .lottery-form .douga-list-wrapper .douga-list .douga-list-item.active .el-timeline-item__node{
        background-color : #409EFF;
      }
      .lottery-form .douga-list-wrapper .douga-list .douga-list-item.active .el-card{
        color : white;
        background-color : #409eff;
      }
  
      .lottery-table .lottery-status-finish{
        background: #8aec53;
      }
  
      .lottery-table-dialog{
        z-index : 999999;
      }
  
      .lottery-table-dialog .el-dialog__body{
        height : 80%;
        overflow-y: auto;
      }
  
      .user-table-dialog{
        z-index : 999999;
      }
  
      .user-table-dialog .el-dialog__body{
        height : 80%;
        overflow-y: auto;
      }
  
  
      .lottery-countdown-dialog{
        z-index : 999999;
        background-color : rgba(0,0,0,0) !important;
        box-shadow : none !important;
      }
      .lottery-countdown-dialog button[data-setter] {
          outline: none;
          background: transparent;
          border: none;
          font-family: 'Roboto';
          font-weight: 300;
          font-size: 18px;
          width: 25px;
          height: 30px;
          color: #409EFF;
          cursor: pointer;
      }
      .lottery-countdown-dialog button[data-setter]:hover {
          opacity: 0.5;
      }
      .lottery-countdown-dialog .container {
          position: relative;
          top: 30px;
          width: 300px;
          margin: 0 auto;
      }
      .lottery-countdown-dialog .setters {
          position: absolute;
          left: 85px;
          top: 75px;
      }
      .lottery-countdown-dialog .minutes-set {
          float: left;
          margin-right: 28px;
      }
      .lottery-countdown-dialog .seconds-set {
          float: right;
      }
      .lottery-countdown-dialog .controlls {
          position: absolute;
          left: 75px;
          top: 105px;
          text-align: center;
      }
      .lottery-countdown-dialog .display-remain-time {
          font-family: 'Roboto';
          font-weight: bold;
          font-size: 65px;
          color: #409EFF;
      }
      .lottery-countdown-dialog #pause {
          outline: none;
          background: transparent;
          border: none;
          margin-top: 10px;
          width: 50px;
          height: 50px;
          position: relative;
      }
      .lottery-countdown-dialog .play::before {
          display: block;
          content: "";
          position: absolute;
          top: 8px;
          left: 16px;
          border-top: 15px solid transparent;
          border-bottom: 15px solid transparent;
          border-left: 22px solid #409EFF;
      }
      .lottery-countdown-dialog .pause::after {
          content: "";
          position: absolute;
          top: 8px;
          left: 12px;
          width: 15px;
          height: 30px;
          background-color: transparent;
          border-radius: 1px;
          border: 5px solid #409EFF;
          border-top: none;
          border-bottom: none;
      }
      .lottery-countdown-dialog #pause:hover {
          opacity: 0.8;
      }
      .lottery-countdown-dialog .e-c-base {
          fill: none;
          stroke: #B6B6B6;
          stroke-width: 15px;
      }
      .lottery-countdown-dialog .e-c-progress {
          fill: none;
          stroke: #409EFF;
          stroke-width: 15px;
          transition: stroke-dashoffset 0.7s;
      }
      .lottery-countdown-dialog .e-c-pointer {
          fill: #FFF;
          stroke: #409EFF;
          stroke-width: 2px;
      }
      .lottery-countdown-dialog #e-pointer {
          transition: transform 0.7s;
      }
  
      .lottery-start-dialog{
        z-index : 999999;
      }
      .lottery-start-dialog .el-carousel__item{
        background-color: #99a9bf;
        opacity: 0.75;
        margin: 0;
        display:flex;
        width : 250px;
        justify-content:center;
        align-items:center;
        flex-direction:column;
      }
  
      .lottery-start-dialog .el-dialog__header{
        display:none;
      }
      .lottery-start-dialog .el-carousel__item.highlight{
        background-color: gold;
      }
      .lottery-start-dialog .el-carousel__item .nickname{
        font-size : 20px;
        color : white;
        text-shadow : 0px 2px 2px black, 0px -2px 2px black, 2px 0px 2px black, -2px 0px 2px black, 2px 2px 2px black, -2px -2px 2px black, 2px -2px 2px black, -2px 2px 2px black;
        font-weight: bold;
      }
  
      .login-form-dialog {
        z-index : 999999;
        height: 400px;
      }
  
      .audio-form-dialog {
        z-index : 999999;
        height: 400px;
      }
  
      .audio-form-dialog .el-dialog__body{
        height : 80%;
        overflow-y: auto;
      }
  
      .interaction-form-dialog {
        z-index : 999999;
        height: 400px;
      }
  
      .interaction-form-dialog .el-dialog__body{
        height : 80%;
        overflow-y: auto;
      }
  
      .interaction-form .el-divider .el-divider__text{
        color : #409EFF;
      }
  
  
      .guess-form-dialog {
        z-index : 999999;
        height: 400px;
      }
  
      .guess-form-dialog .el-dialog__body{
        height : 100%;
        overflow-y: auto;
      }
  
      .guess-start-dialog {
        z-index : 999999;
        height: 400px;
      }
  
      .guess-start-dialog .el-dialog__body{
        height : 100%;
        overflow-y: auto;
      }
  
      .guess-danmaku-dialog {
        z-index : 999999;
        height: 400px;
      }
  
      .guess-danmaku-dialog .el-dialog__body{
        height : 100%;
        overflow-y: auto;
      }
  
      .guess-danmaku-dialog .guess-danmaku-container{
        height : 100%;
        width : 100%;
      }
  
      .guess-danmaku-dialog .guess-danmaku-danmu{
        display : flex;
        color: rgb(255, 255, 255);
          font-size: 25px;
          font-family: buding;
          text-shadow: rgb(0 0 0) 0px 1px 1px, rgb(0 0 0) 0px -1px 1px, rgb(0 0 0) 1px 0px 1px, rgb(0 0 0) -1px 0px 1px, rgb(0 0 0) 1px 1px 1px, rgb(0 0 0) -1px -1px 1px, rgb(0 0 0) 1px -1px 1px, rgb(0 0 0) -1px 1px 1px;
        cursor : pointer;
      }
  
      .guess-danmaku-dialog .guess-danmaku-danmu.is-select{
        border : 1px solid red;
      }
  
      .guess-danmaku-dialog .guess-danmaku-danmu >img{
        width : 20px;
        height : 20px;
        border-radius : 10px;
      }
  
  
      .guess-table-dialog {
        z-index : 999999;
        height: 400px;
      }
      .guess-table-dialog .el-dialog__body{
        height : 100%;
        overflow-y: auto;
      }
  
    `;
  
    GM_addStyle(css);
    var audio = null;
  
  
  
    // 检查token是否存在
    var token = await GM_getValue("token");
    if(token){
      config.TOKEN = token;
    }
  
  
    // 禁止播放视频
    function disableVideos(){
      window.setInterval(function(){
        let videoEles = document.querySelectorAll('video');
        for(let videoEle of videoEles){
          videoEle.src = null;
        }
      }, 500);
  
    }
  
    // 是否为空
    function isNullOrEmpty(val){
      return _.isUndefined(val) || _.isNull(val) || _.isNaN(val) || (((_.isObject(val) && !_.isDate(val)) || _.isArray(val) || _.isString(val)) && _.isEmpty(val))
    }
  
    // 通用请求
    function commonRequrest(url, method, form, raw, callback, headers){
      var isSuccess = false;
      var data = null;
      if(!headers){
        headers = {};
      }
  
      if(!raw){
  
        if(method == 'post'){
  
          headers['Content-Type'] = 'application/x-www-form-urlencoded';
          if(form){
            form = Qs.stringify(form);
          }
  
        }
  
      }
  
      if(method == 'get' && form){
        form = Qs.stringify(form);
        url += '?' + form;
      }
  
      // 获取了token
      if(config.TOKEN){
        headers['Authorization'] = `Token ${config.TOKEN}`;
      }
  
      GM_xmlhttpRequest({
        synchronous : !_.isFunction(callback),
        method : method,
        url : url,
        data : form,
        headers : headers,
        onload : function(res){
  
          // 200
          if(res.status==200){
            if(raw){
              callback(true, res.responseText);
            }
            else{
              res = JSON.parse(res.responseText);
              isSuccess = res[config.RESPONSE.FIELD.STATUS] == config.RESPONSE.STATUS.SUCCESS;
              data = res[config.RESPONSE.FIELD.DATA];
  
              if(_.isFunction(callback)){
                callback(isSuccess, data);
              }
            }
          }
          else{
            if(_.isFunction(callback)){
              callback(isSuccess, data);
            }
          }
        },
        onerror : function(){
          if(_.isFunction(callback)){
            callback(isSuccess, data);
          }
        },
        onabort : function(){
          if(_.isFunction(callback)){
            callback(isSuccess, data);
          }
        },
      });
  
      return [isSuccess, data];
    }
  
    function formatText(text, params){
  
      for(var key in params){
        text = text.replace(new RegExp('\\$\\{'+ key +'\\}', 'g'), params[key]);
      }
  
      return text;
  
    }
  
    function addCssResource(url){
  
      commonRequrest(url, 'get', null, true, function(isSuccess, css){
        if(isSuccess){
          GM_addStyle(css);
        }
      })
    }
  
    // 添加element-ui样式
    addCssResource('https://cdn.jsdelivr.net/npm/element-ui@2.15.1/lib/theme-chalk/index.css');
  
  
    class CallbackManager{
      constructor(feedback){
        this.callbacks = {};
        this.callbackGroupMapper = {};
      }
  
      register(group, func, params, first){
        if(!(group in this.callbacks)){
          this.callbacks[group] = [];
        }
  
        var callback = {
          id : uuidv4(),
          func : func,
          params : params
        };
  
        // 添加到最前
        if(first){
          this.callbacks[group].splice(0, 0, callback);
        }
        else{
          this.callbacks[group].push(callback);
        }
        this.callbackGroupMapper[callback.id] = group;
  
        return callback.id;
  
      }
  
      cancel(handler){
  
        if(!(handler in this.callbackGroupMapper) || !(this.callbackGroupMapper[handler] in this.callbacks)){
          return;
        }
  
        var findIndex = _.findIndex(this.callbacks[this.callbackGroupMapper[handler]], {id:handler});
        if(findIndex==-1){
          return;
        }
  
        this.callbacks[this.callbackGroupMapper[handler]].splice(findIndex, 1);
        delete this.callbackGroupMapper[handler];
  
      }
  
      feed(group, data){
  
        if(!(group in this.callbacks)){
          return;
        }
  
  
  
        this.callbacks[group].forEach(function(callback){
  
          callback.func(data, callback.params);
  
        });
  
  
      }
  
    }
  
    var callbackManager = new CallbackManager();
  
  
    const acSeriesPattern = /[aA][aAbBcC][=号]?\s*(\d+)/;
    function extractAcSeries(text){
      var match = text.match(acSeriesPattern);
      if(match){
        return parseInt(match[match.length-1]);
      }
      else{
        return null;
      }
    }
    const giftPattern = /送出((?<count>\d+)个)?(?<name>.+)/;
    function extractGift(text){
      var match = text.match(giftPattern);
      if(match){
        return {
          name : match.groups.name,
          count : match.groups.count?parseInt(match.groups.count):1,
        };
      }
      else{
        return null;
      }
    }
    const modalClassNamePattern = /medal-lv-(?<level>\d+)/;
    function extractLevel(text){
      var match = text.match(modalClassNamePattern);
      if(match){
        return parseInt(match.groups.level);
      }
      else{
        return null;
      }
    }
    const commandPattern = /^\/(?<command>[^s]+)\s+(?<text>[^s]+)$/;
    function extractCommand(text){
      var match = text.match(commandPattern);
      if(match){
        return match.groups;
      }
      else{
        return null;
      }
    }
  
  
    var userInfo = {};
  
    var vupInfo = {};
  
    var refreshTimeoutHandler = null;
  
    // 开始
    function start(){
  
    
        // 监听弹幕添加
        var messageContainer = document.querySelector('.live-feed-messages');
        var observer = new MutationObserver(function(mutations, observer){
  
  
          // 遍历改变
          mutations.forEach(function(mutation){
            // 子节点发生变化
            if(mutation.type == 'childList'){
  
              if(refreshTimeoutHandler){
                window.clearTimeout(refreshTimeoutHandler);
              }
  
              // 3分钟内没接收到信息，刷新
              refreshTimeoutHandler = window.setTimeout(()=>window.location.reload(), 3 * 60 * 1000);
  
              // 遍历新增节点
              mutation.addedNodes.forEach(function(node){
  
                // 获取用户名元素
                var userEle = node.querySelector('.nickname');
                var userName = userEle.innerText;
                var uid = null;
                var badgeName = null;
                var badgeLevel = null;
                var badgeColor = null;
  
                // 查看是否有徽章
                var badgeContainerEle = node.querySelector('.medal-wrapper');
                if(badgeContainerEle){
  
                  badgeName = badgeContainerEle.querySelector('.medal-name').innerText;
  
                  badgeContainerEle.classList.forEach(function(className){
  
                    if(extractLevel(className)!=null){
                      badgeLevel = extractLevel(className);
                    }
  
                  });
  
                  if(badgeLevel >= 1 && badgeLevel <= 3){
                    badgeColor = 'green';
                  }
                  else if(badgeLevel >= 4 && badgeLevel <= 6){
                    badgeColor = 'blue';
                  }
                  else if(badgeLevel >= 7 && badgeLevel <= 9){
                    badgeColor = 'orange';
                  }
                  else if(badgeLevel >= 10 && badgeLevel <= 12){
                    badgeColor = 'red';
                  }
                  else if(badgeLevel >= 13 && badgeLevel <= 15){
                    badgeColor = 'purple';
                  }
                  else if(badgeLevel >= 16 && badgeLevel <= 20){
                    badgeColor = 'black';
                  }
  
  
                }
  
                if(userEle && userEle.attributes['data-user-id']){
                  uid = parseInt(userEle.attributes['data-user-id'].value);
                }
  
                var interaction = {
                  id : uuidv4(),
                  sendTime : new Date(),
                };
                // 弹幕
                if(node.classList.contains('comment')){
                  interaction.type = 'danmaku';
                  interaction.content = _.trimStart(node.querySelector('.comment-text').innerText, '：');
                }
                // 送礼
                else if(node.classList.contains('gift')){
                  var giftText = userEle.nextElementSibling.innerText;
                  var gift = extractGift(giftText);
  
                  interaction.type = 'gift';
                  interaction.giftName = gift.name;
                  interaction.giftCount = gift.count;
                }
                // 点赞
                else if(node.classList.contains('like')){
                  interaction.type = 'like';
                }
                // 进入直播间
                else if(node.classList.contains('user-enter')){
                  interaction.type = 'enterroom';
                }
                // 关注了主播
                else if(node.classList.contains('follow')){
                  interaction.type = 'follow';
                }
                // 加入守护团
                else if(node.classList.contains('join-club')){
                  interaction.type = 'joinclub';
                }
  
                // vup
                if(uid in vupInfo){
                  addBadgeToUser(userEle);
                }
  
                if(uid in userInfo){
                  callbackManager.feed('message', {
                    uid : uid,
                    vup : uid in vupInfo,
                    userName : userName,
                    badgeName : badgeName,
                    badgeLevel : badgeLevel,
                    badgeColor : badgeColor,
                    photo : userInfo[uid].photo,
                    interaction : interaction,
                  });
  
                }
                else{
                  // 获取用户信息
                  commonRequrest(config.ACFUNLIVE_SERVER + config.URLS.ACFUN_USER.INFO + `?userId=${uid}`, 'get', null, true, function(isSuccess, data){
  
                    var photo = null;
                    if(data){
                      data = JSON.parse(data);
                      if(data.result == 0){
                        photo = data.profile.headUrl;
                      }
                    }
                    userInfo[uid] = {
                      userName : userName,
                      photo : photo,
                    };
  
                    callbackManager.feed('message', {
                      uid : uid,
                      vup : uid in vupInfo,
                      userName : userName,
                      photo : userInfo[uid].photo,
                      badgeName : badgeName,
                      badgeLevel : badgeLevel,
                      badgeColor : badgeColor,
                      interaction : interaction,
                    });
  
                  });
                }
  
              });
            }
          });
        });
        observer.observe(messageContainer, {childList:true});
  
    }
  
  
    // 加载Vue实例
    function loadVue(){
  
      var vue = null;
  
      // 获取礼物列表
      var giftList = [];
      var giftContainerEles = document.querySelectorAll('.item-gift');
      giftContainerEles.forEach(function(giftContainerEle, giftIndex){
        var gift = {
          index : giftIndex,
          id : giftContainerEle.attributes['data-gift-id'].value,
          name : giftContainerEle.querySelector('.name').textContent,
          price : _.parseInt(giftContainerEle.attributes['data-gift-price'].value),
          img : giftContainerEle.querySelector('img').attributes['src'].value,
        };
  
        // 设置香蕉的价格为0
        if(gift.name == '香蕉'){
          gift.price = 0;
        }
  
        giftList.push(gift);
  
      });
  
      // 无法获取礼物列表
      if(giftList.length==0){
        return;
      }
  
      // 将礼物按照AC币排序
      giftList = _.sortBy(giftList, ['price', 'index']);
      // 隐藏原有弹幕
      document.querySelector('.container-live-feed-messages').style.setProperty('display', 'none', 'important');
  
  
      // 添加悬浮菜单
      // 容器
      var containerEle = document.querySelector('.container-live-feed .live-feed');
      // 悬浮菜单元素
      var menuEle = document.createElement('div');
  
      menuEle.className = 'container-live-feed-messages-acfunlive';
      menuEle.innerHTML = `
  
        <div :class="{'live-message-container':true, 'active':mouseOn, 'inactive':!mouseOn, 'live-message-container-horizontal':interactionFormData.direction=='horizontal', 'live-message-container-vertical':interactionFormData.direction!='horizontal'}" :style="backgroundStyle">
  
          <template v-for="message in messageData">
  
            <!--弹幕-->
            <template v-if="message.interaction.type=='danmaku' && message.interaction.content">
              <div class="live-message-popup" :style="danmakuMessageContainerStyle" :key="message.interaction.id">
                <div class="live-message-popup-left">
                  <el-avatar shape="circle" fit="fill" :size="userPhotoSize" :src="message.photo"></el-avatar>
                </div>
                <div class="live-message-popup-right">
                  <div class="user-info-container">
                    <span class="user-info-badge user-info-badge-vup" :style="userBadgeStyle" v-if="message.vup">VUP</span>
                    <span :style="userBadgeStyle" :class="{'user-info-badge':true,'user-info-badge-black':message.badgeColor=='black','user-info-badge-purple':message.badgeColor=='purple','user-info-badge-red':message.badgeColor=='red','user-info-badge-orange':message.badgeColor=='orange','user-info-badge-blue':message.badgeColor=='blue','user-info-badge-green':message.badgeColor=='green'}" v-if="message.badgeName">LV.{{message.badgeLevel}} {{message.badgeName}}</span>
                    <span class="user-info-username" :style="userNameMessageStyle">{{message.userName}}</span>
                  </div>
                  <div :class="danmakuMessageClass.concat([!lastDanmakuMessage || message.interaction.id == lastDanmakuMessage.interaction.id?'active':'inactive'])" :style="danmakuMessageStyle">
                    <div class="border-flow-item" :style="borderFlowItemStyle"></div>
                    <span @click="clickMessage(message)">{{message.interaction.content}}</span>
                    <div class="live-message-douga" @click="clickMessage(message, true)" v-if="message.interaction.douga">
                      <el-card  :title="message.interaction.douga.title" :style="danmakuDougaMessageStyle">
                        <el-row :class="{'douga-info':true, 'article':message.interaction.douga.type == 'article', 'video':['video', 'bangumi'].indexOf(message.interaction.douga.type) != -1}" :style="danmakuDougaContainerStyle">
  
                          <template v-if="message.interaction.douga.type == 'video'">
                            <div class="douga-info-left" :style="danmakuDougaLeftColStyle">
                              <span class="cover" :style="danmakuDougaCoverStyle">
                                <img :src="message.interaction.douga.cover">
                              </span>
                            </div>
                            <div class="douga-info-right" :style="danmakuDougaRightColStyle">
                              <div class="title-container" :style="danmakuDougaTitleStyle"><span>{{message.interaction.douga.title}}</span></div>
                              <div class="info" :style="danmakuDougaInfoStyle">
                                <p class="up"><span>up主：</span><span>{{message.interaction.douga.userName}}</span></p>
                                <p class="play-count" :style="danmakuDougaInfoStyle">播放量：<span>{{message.interaction.douga.playCountText}}</span></p>
                              </div>
                            </div>
                          </template>
  
                          <template v-if="message.interaction.douga.type == 'article'">
                            <div class="title-container" :style="danmakuDougaTitleStyle">
                              <p class="title">{{message.interaction.douga.title}}</p>
                              <p class="description" :style="danmakuDougaDescriptionStyle">{{message.interaction.douga.description}}</p>
                            </div>
  
                            <div class="info" :style="danmakuDougaInfoStyle">
                              <p class="up"><span>up主：</span><span>{{message.interaction.douga.userName}}</span></p>
                              <p class="play-count" :style="danmakuDougaInfoStyle">访问量：<span>{{message.interaction.douga.playCountText}}</span></p>
                            </div>
                          </template>
  
                          <template v-if="message.interaction.douga.type == 'bangumi'">
                            <div class="douga-info-left" :style="danmakuDougaLeftColStyle">
                              <span class="cover" :style="danmakuDougaCoverStyle">
                                <img :src="message.interaction.douga.cover">
                              </span>
                            </div>
                            <div class="douga-info-right" :style="danmakuDougaRightColStyle">
                              <div class="title-container" :style="danmakuDougaTitleStyle">
                                <el-tag effect="dark" type="danger" v-if="message.interaction.douga.acfunOnly">A站独播</el-tag>
                                <span>{{message.interaction.douga.title}}</span>
                              </div>
                              <div class="info" :style="danmakuDougaInfoStyle">
                                <p class="stow-count" :style="danmakuDougaInfoStyle">追番人数：<span>{{message.interaction.douga.stowCountText}}</span></p>
                                <p class="play-count" :style="danmakuDougaInfoStyle">播放量：<span>{{message.interaction.douga.playCountText}}</span></p>
                              </div>
                            </div>
                          </template>
                        </el-row>
                      </el-card>
  
                    </div>
                  </div>
  
                </div>
              </div>
  
            </template>
  
            <!--点赞-->
            <template v-if="message.interaction.type=='like' && message.interaction.content">
              <div class="live-message-inline" :style="likeMessageContainerStyle" :key="message.interaction.id">
                <span :style="likeMessageStyle">
                  <span v-if="message.vup">【VUP】</span>
                  <span class="user-info-username">{{message.userName}}</span>
                  <span>{{message.interaction.content}}</span>
                </span>
              </div>
  
            </template>
  
            <!--礼物-->
            <template v-if="message.interaction.type=='gift' && message.interaction.content">
              <div class="live-message-popup" :style="giftMessageContainerStyle" :key="message.interaction.id">
                <div class="live-message-popup-left">
                  <el-avatar shape="circle" fit="fill" :size="userPhotoSize" :src="message.photo"></el-avatar>
                </div>
                <div class="live-message-popup-right">
                  <div class="user-info-container">
                    <span :style="userBadgeStyle" class="user-info-badge user-info-badge-vup" v-if="message.vup">VUP</span>
                    <span :style="userBadgeStyle" :class="{'user-info-badge':true,'user-info-badge-black':message.badgeColor=='black','user-info-badge-purple':message.badgeColor=='purple','user-info-badge-red':message.badgeColor=='red','user-info-badge-orange':message.badgeColor=='orange','user-info-badge-blue':message.badgeColor=='blue','user-info-badge-green':message.badgeColor=='green'}" v-if="message.badgeName">LV.{{message.badgeLevel}} {{message.badgeName}}</span>
                    <span class="user-info-username" :style="userNameMessageStyle">{{message.userName}}</span>
                  </div>
                  <div class="live-message-gift" :style="giftMessageStyle">
                    <span >{{message.interaction.content}}</span>
                    <el-avatar shape="square" :size="giftImageSize" fit="fill" :src="giftNameMapper[message.interaction.giftName].img" style="background-color:transparent;vertical-align:bottom;"></el-avatar>
                    <span :class="{'live-message-gift-count':true, 'scale-anime':message.interaction.doAnime}" v-if="message.interaction.giftCount>0" :style="giftCountStyle">
                      x{{message.interaction.giftCount}}
                    </span>
                  </div>
                </div>
              </div>
  
            </template>
  
            <!--进入直播间-->
            <template v-if="message.interaction.type=='enterroom' && message.interaction.content">
              <div class="live-message-inline" :style="enterroomMessageContainerStyle" :key="message.interaction.id">
                <span :style="enterroomMessageStyle">
                  <span v-if="message.vup">【VUP】</span>
                  <span class="user-info-username">{{message.userName}}</span>
                  <span class="live-message-enterroom">{{message.interaction.content}}</span>
                </span>
              </div>
  
            </template>
  
            <!--关注-->
            <template v-if="message.interaction.type=='follow' && message.interaction.content">
              <div class="live-message-inline" :style="followMessageContainerStyle" :key="message.interaction.id">
                <span :style="followMessageStyle">
                  <span v-if="message.vup">【VUP】</span>
                  <span class="user-info-username">{{message.userName}}</span>
                  <span class="live-message-follow">{{message.interaction.content}}</span>
                </span>
              </div>
  
            </template>
  
            <!--加入守护团-->
            <template v-if="message.interaction.type=='joinclub' && message.interaction.content">
              <div class="live-message-inline" :style="joinclubMessageContainerStyle" :key="message.interaction.id">
                <span :style="joinclubMessageStyle">
                  <span v-if="message.vup">【VUP】</span>
                  <span class="user-info-username">{{message.userName}}</span>
                  <span class="live-message-joinclub">{{message.interaction.content}}</span>
                </span>
              </div>
  
            </template>
  
          </template>
  
  
        </div>
  
        <div :class="{'live-feed-dropmenu':true, 'live-feed-dropmenu-horizontal':interactionFormData.direction=='horizontal','live-feed-dropmenu-vertical':interactionFormData.direction!='horizontal'}">
          <el-dropdown trigger="click" @command="handleDropdownMenuClick">
            <span class="el-dropdown-link" style="font-size:32px;">
              <i class="el-icon-menu"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-edit" command="editInteraction">弹幕编辑</el-dropdown-item>
              <el-dropdown-item>
                <el-dropdown trigger="hover" placement="right-start"  trigger="click" @command="handleDropdownMenuClick">
                  <span class="el-icon-lollipop">
                    直播抽奖<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-circle-plus" command="newLottery">添加抽奖</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-info" command="lotteryTable">查看抽奖</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-download" command="exportLottery">导出名单</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-dropdown-item>
              <!-- 
              <el-dropdown-item>
                <el-dropdown trigger="hover" placement="right-start"  trigger="click" @command="handleDropdownMenuClick">
                  <span class="el-icon-chat-dot-round">
                    直播竞猜<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-circle-plus" command="newGuess">添加竞猜</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-info" command="guessTable">查看竞猜</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-download" command="exportGuess">导出名单</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-dropdown-item>
              -->
              <el-dropdown-item icon="el-icon-notebook-1" command="help">帮助文档</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
  
          <el-dialog v-dialog-drag title="查看抽奖" :visible.sync="lotteryTableDialogVisible" :modal="false" width="550px" custom-class="lottery-table-dialog" :close-on-click-modal="false">
            <el-table :data="lotteryTableData" style="width: 100%" class="lottery-table" :row-class-name="lotteryTableRowClassName">
              <el-table-column prop="name" label="奖品名称" :width="150">
              </el-table-column>
              <el-table-column prop="startTimeText" label="开奖时间" :width="100">
              </el-table-column>
              <el-table-column label="操作" :width="250">
                <template slot-scope="scope">
                  <el-button type="text" @click="handleLotteryModify(scope.row)">编辑</el-button>
                  <el-button type="text" @click="handleLotteryCopy(scope.row)">复制</el-button>
                  <el-button type="text" @click="handleLotteryCandidatesCheck(scope.row)" v-if="scope.row.status == '未开始'">查看候选名单</el-button>
                  <el-button type="text" @click="handleLotteryWinnersCheck(scope.row)" v-if="scope.row.status == '已结束'">查看中奖名单</el-button>
                </template>
              </el-table-column>
  
            </el-table>
  
          </el-dialog>
  
          <el-dialog v-dialog-drag :title="lotteryFormDialogTitle" :visible.sync="lotteryFormDialogVisible" :modal="false" width="550px" custom-class="lottery-form-dialog" :close-on-click-modal="false">
            <el-form :model="lotteryFormData" class="lottery-form" ref="form" :rules="lotteryFormRules" @submit.native.prevent  v-loading="lotteryFormData.loading" :element-loading-text="lotteryFormData.loadingText" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
              <el-form-item label="奖品名称" label-width="130px" prop="name">
                <el-input v-model="lotteryFormData.name" autocomplete="off" style="width:100%;"></el-input>
              </el-form-item>
              <el-form-item>
                <el-col :span="11">
                  <el-form-item label="抽奖倒计时（秒）" label-width="130px" prop="countdown">
                    <el-input-number size="medium" v-model="lotteryFormData.countdown" :min="0" controls-position="right" style="width:100%;"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="13">
                  <el-form-item label="开奖时间" label-width="100px" prop="startTime">
                    <el-time-picker v-model="lotteryFormData.startTime" :picker-options="timePickerOptions" style="width:100%;">
                    </el-time-picker>
                  </el-form-item>
                </el-row>
              </el-form-item>
              <el-form-item label="互斥抽奖" label-width="130px" prop="mutualLotteryList">
                <el-select v-model="lotteryFormData.mutualLotteryList" multiple placeholder="请选择互斥的抽奖" style="width:100%;">
                  <el-option
                    :value="lottery.id"
                    :label="lottery.name"
                    :key="lottery.id"
                    v-if="lottery.id != lotteryFormData.id"
                    v-for="lottery in lotteryTableData"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <!--
              <el-form-item label="抽奖权重" label-width="130px" prop="weight">
                <el-switch v-model="lotteryFormData.weight" active-text="加权" inactive-text="等权">
                </el-switch>
              </el-form-item>
              -->
  
              <el-form-item>
                <el-col :span="13">
                  <el-form-item label="牌子名称" label-width="130px" prop="medalName">
                    <el-input v-model="lotteryFormData.medalName" autocomplete="off" style="width:100%;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="牌子等级" label-width="130px" prop="medalLevel">
                    <el-input-number v-model="lotteryFormData.medalLevel" autocomplete="off"  :min="0" controls-position="right" style="width:100%;"></el-input-number>
                  </el-form-item>
                </el-col>
              </el-form-item>
  
              <el-form-item label="抽奖来源" label-width="130px" prop="source">
                <el-radio-group v-model="lotteryFormData.source" style="width:100%;">
                  <el-radio label="livestream">直播间抽奖</el-radio>
                  <el-radio label="douga">稿件抽奖</el-radio>
                </el-radio-group>
              </el-form-item>
  
  
              <template v-if="lotteryFormData.source == 'livestream'">
  
                <el-form-item label="抽奖参与方式" label-width="130px" prop="joinMethod">
                  <el-checkbox-group v-model="lotteryFormData.joinMethod" style="width:100%;">
                    <el-checkbox label="danmaku">弹幕</el-checkbox>
                    <el-checkbox label="gift">礼物</el-checkbox>
                    <el-checkbox label="like">点赞</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
  
                <!-- 弹幕 -->
                <template v-if="lotteryFormData.joinMethod.indexOf('danmaku')!=-1">
                  <el-form-item label="抽奖参与关键词" label-width="130px" prop="joinKeyword">
                    <el-input v-model="lotteryFormData.joinKeyword" autocomplete="off" style="width:100%;" placeholder="请输入参与抽奖的弹幕关键词"></el-input>
                  </el-form-item>
                </template>
  
                <!-- 礼物 -->
                <template v-if="lotteryFormData.joinMethod.indexOf('gift')!=-1">
                  <el-form-item label="抽奖参与礼物" label-width="130px" prop="joinGiftList">
                    <el-select v-model="lotteryFormData.joinGiftList" multiple placeholder="请选择礼物" popper-class="gift-selector" style="width:100%;">
                      <el-option
                        :label="gift.name"
                        :value="gift.id"
                        :key="gift.id"
                        v-for="gift in giftList"
                      >
                        <el-row>
                          <el-col :span="8">
                            <el-avatar shape="square" :size="40" fit="fill" :src="gift.img" style="background-color:white;"></el-avatar>
                          </el-col>
                          <el-col :span="6" :offset="4">
                            <span>{{gift.name}}</span>
                          </el-col>
                          <el-col :span="6">
                            <span v-if="gift.price>0">（{{gift.price}}AC币）</span>
                          </el-col>
                        </el-row>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </template>
              <template v-else-if="lotteryFormData.source == 'douga'">
  
                <el-form-item label="抽奖稿件类型" label-width="130px" prop="dougaType">
                  <el-radio-group v-model="lotteryFormData.dougaType" style="width:100%;" @change="refreshDougaList">
                    <el-radio label="video">视频投稿</el-radio>
                    <el-radio label="article">文章投稿</el-radio>
                  </el-radio-group>
                </el-form-item>
  
                <!--
                <el-form-item label="抽奖参与方式" label-width="130px" prop="joinMethod">
                  <el-checkbox-group v-model="lotteryFormData.joinMethod" style="width:100%;">
                    <el-checkbox label="comment">评论</el-checkbox>
                    <el-checkbox label="subcomment">楼中楼</el-checkbox>
                    <el-checkbox label="floor">指定楼层</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                 -->
  
                <el-divider>请选取参与抽奖的稿件</el-divider>
  
                <el-row class="douga-list-wrapper">
                  <el-timeline class="douga-list" v-infinite-scroll="getDougaList" :infinite-scroll-disabled="lotteryFormData.dougaListDisabled">
                    <el-timeline-item :class="{'douga-list-item':true,'active':lotteryFormData.dougaListActiveIndex == dougaIndex, 'video':lotteryFormData.dougaType == 'video', 'article' : lotteryFormData.dougaType == 'article'}" :timestamp="douga.uploadDateText" placement="top" v-for="(douga, dougaIndex) in lotteryFormData.dougaList" :key="douga.id">
                      <el-card  :title="douga.title" @click.native="handleDougaListItemClick(dougaIndex)">
                        <el-row class="douga-info">
  
                          <template v-if="lotteryFormData.dougaType == 'video'">
                            <el-col :span="12" class="douga-info-left">
                              <span class="cover">
                                <img :src="douga.cover" @click.stop="handleDougaListItemDetailClick(dougaIndex)">
                              </span>
                            </el-col>
                            <el-col :span="12"  class="douga-info-right">
                              <p class="title"><span>{{douga.title}}</span></p>
                              <p class="play-count">播放量：<span>{{douga.playCountText}}</span></p>
                            </el-col>
                          </template>
  
                          <template v-if="lotteryFormData.dougaType == 'article'">
                            <p class="title"><span @click.stop="handleDougaListItemDetailClick(dougaIndex)">{{douga.title}}</span></p>
                            <p class="play-count">访问量：<span>{{douga.playCountText}}</span></p>
                          </template>
  
                        </el-row>
                      </el-card>
                    </el-timeline-item>
                  </el-timeline>
  
                  <p v-if="lotteryFormData.dougaListLoading">...正在加载投稿稿件...</p>
                  <p v-if="lotteryFormData.dougaListNoMore">加载完毕</p>
                </el-row>
  
  
  
              </template>
  
              <el-form-item style="display:flex;justify-content:center;">
                <el-button type="primary" @click="handleLotteryFormSubmit">立即创建</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
  
  
          <el-dialog v-dialog-drag :title="userTableDialogTitle" :visible.sync="userTableDialogVisible" :modal="false" width="550px" custom-class="user-table-dialog" :close-on-click-modal="false">
            <el-table :data="userTableData" style="width: 100%" class="user-table">
              <el-table-column prop="userName" label="用户名" :width="300">
                <template slot-scope="scope">
                  <el-avatar shape="circle" fit="fill" size="40" :src="scope.row.photo"></el-avatar>
                  <span>{{scope.row.userName}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="uid" label="用户uid" :width="150">
              </el-table-column>
  
  
            </el-table>
  
          </el-dialog>
  
          <el-dialog v-dialog-drag :visible.sync="lotteryCountdownDialogVisible" :modal="false" width="550px" custom-class="lottery-countdown-dialog" :close-on-click-modal="false" :show-close="false">
            <div class="container">
               <div class="circle">
                  <svg width="300" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
                     <g transform="translate(110,110)">
                        <circle r="100" class="e-c-base"/>
                        <g transform="rotate(-90)">
                           <circle r="100" class="e-c-progress"/>
                           <g id="e-pointer">
                              <circle cx="100" cy="0" r="15" class="e-c-pointer"/>
                           </g>
                        </g>
                     </g>
                  </svg>
               </div>
               <div class="controlls">
                  <div class="display-remain-time">{{activeLottery.countdownText}}</div>
               </div>
            </div>
          </el-dialog>
  
          <el-dialog v-dialog-drag :visible.sync="lotteryStartDialogVisible" :modal="false" width="550px" custom-class="lottery-start-dialog" :close-on-click-modal="false" :destroy-on-close="true" :show-close="false">
            <el-row v-if="activeLottery!=null && activeLottery.name" style="text-align:center;margin-bottom:20px;">
              <p style="font-size:30px;font-weight:bold;">{{activeLottery.name}}</p>
              <p>
                <span>已中奖人数：<span style="color:#409EFF;font-weight:bold;">{{activeLottery.winnerCount}}</span>名</span>
                <span style="margin-left:20px;">候选人数：<span style="color:#409EFF;font-weight:bold;">{{activeLottery.startCandidates.length}}</span>人</span>
              </p>
            </el-row>
            <el-row class="carousel-container" v-if="activeLottery!=null && activeLottery.name">
              <el-carousel ref="carousel" type="card" height="200px" indicator-position="none" arrow="never" :autoplay="false">
                <el-carousel-item v-for="candidate in activeLottery.startCandidates" :class="candidate.highlight?'highlight':''">
                    <el-row>
                      <el-avatar shape="square" :size="120" fit="fill" :src="candidate.photo"></el-avatar>
                    </el-row>
                    <el-row>
                      <span class="nickname" style="cursor:pointer;">{{candidate.userName}}</span>
                    </el-row>
                    <el-row>
                      <span :style="userBadgeStyle" :class="{'user-info-badge':true,'user-info-badge-black':candidate.medalColor=='black','user-info-badge-purple':candidate.medalColor=='purple','user-info-badge-red':candidate.medalColor=='red','user-info-badge-orange':candidate.medalColor=='orange','user-info-badge-blue':candidate.medalColor=='blue','user-info-badge-green':candidate.medalColor=='green'}" v-if="candidate.medalName">LV.{{candidate.medalLevel}} {{candidate.medalName}}</span>
                    </el-row>
                </el-carousel-item>
              </el-carousel>
            </el-row>
            <el-row style="text-align:center;margin-top:20px;" v-if="!activeLottery.rolling && activeLottery.activeIndex!=null && activeLottery.activeIndex!=-1">
              <el-tag type="warning" effect="dark" v-if="userInfo[activeLottery.startCandidates[activeLottery.activeIndex].uid].hasEnterroom">进入直播间</el-tag>
              <el-tag type="warning" effect="dark" v-if="userInfo[activeLottery.startCandidates[activeLottery.activeIndex].uid].hasLike">点赞</el-tag>
              <el-tag type="warning" effect="dark" v-if="userInfo[activeLottery.startCandidates[activeLottery.activeIndex].uid].hasDanmaku">弹幕</el-tag>
              <el-tag type="warning" effect="dark" v-if="userInfo[activeLottery.startCandidates[activeLottery.activeIndex].uid].hasGift">礼物</el-tag>
              <el-tag type="warning" effect="dark" v-if="userInfo[activeLottery.startCandidates[activeLottery.activeIndex].uid].hasFollow">关注</el-tag>
            </el-row>
            <el-row style="text-align:center;margin-top:20px;">
              <el-button-group v-if="!activeLottery.rolling">
                <el-button type="primary" icon="el-icon-refresh-left" @click="activeLottery.nextFunc(false)">重新抽选</el-button>
                <el-button type="primary" icon="el-icon-right" @click="activeLottery.nextFunc(true)">继续抽选</el-button>
                <el-button type="primary" icon="el-icon-check" @click="activeLottery.finishFunc()">结束抽选</el-button>
              <el-button-group>
            </el-row>
          </el-dialog>
  
          <el-dialog v-dialog-drag title="弹幕预设" :visible.sync="interactionPresetDialogVisible" :modal="false" width="550px" custom-class="interaction-preset-dialog" :close-on-click-modal="false">
  
            <el-row style="display:flex;justify-content:end;">
              <el-button icon="el-icon-circle-plus-outline" type="primary" @click="handleInteractionFormOpen()">新增预设</el-button>
            </el-row>
            <!-- 预设 -->
            <el-table :data="interactionPreset" style="width: 100%" class="interaction-preset-table" border ref="interactionPresetTable" height="200">
              <el-table-column prop="index" label="序号" min-width="10%">
              </el-table-column>
              <el-table-column prop="name" label="名称" min-width="45%">
              </el-table-column>
              <el-table-column prop="hotkey" label="热键" min-width="20%">
              </el-table-column>
              <el-table-column label="操作" min-width="25%">
                <template slot-scope="scope">
                  <el-button type="text" @click="handleInteractionFormOpen(scope.row)">编辑</el-button>
                  <el-button type="text" @click="removeInteractionPreset(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
          <el-dialog v-dialog-drag title="弹幕编辑" :visible.sync="interactionFormDialogVisible" :modal="false" width="550px" custom-class="interaction-form-dialog" :close-on-click-modal="false" :destroy-on-close="true">
            <el-form :model="interactionFormData" class="interaction-form" ref="interactionForm" :rules="interactionFormRules" @submit.native.prevent>
  
              <!--
              <el-form-item label="是否启动" label-width="130px" prop="enable">
                <el-switch v-model="interactionFormData.enable" active-text="启动" inactive-text="不启动">
                </el-switch>
              </el-form-item>
              -->
  
              <template v-if="interactionFormData.enable">
                <!-- 排版 -->
                <!--<el-divider>排版配置</el-divider>
                <el-form-item label="排版方向" label-width="130px" prop="direction">
                  <el-select v-model="interactionFormData.direction" style="width:100%;">
                    <el-option value="vertical" label="纵版" key="vertical"></el-option>
                    <el-option value="horizontal" label="横版" key="horizontal"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="弹幕/礼物单列显示" label-width="130px" prop="displayNotWrap">
                  <el-switch v-model="interactionFormData.displayNotWrap" active-text="是" inactive-text="否">
                  </el-switch>
                </el-form-item>-->
                <!-- 历史 -->
                <!-- <el-divider>互动历史配置</el-divider>
                -->
                <!-- 全局 -->
                <el-divider>全局配置</el-divider>
                <el-form-item>
                  <el-form-item label="预设名称" label-width="130px" prop="name">
                    <el-input v-model="interactionFormData.name" autocomplete="off" style="width:100%;" placeholder="请输入预设名称"></el-input>
                  </el-form-item>
                </el-form-item>
                <el-form-item>
                  <el-col :span="11">
                    <el-form-item label="背景颜色" label-width="130px" prop="backgroundColor">
                      <el-color-picker v-model="interactionFormData.backgroundColor" show-alpha style="width:100%;" :predefine="predefineColors"></el-color-picker>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item label="互动信息保留" label-width="130px" prop="historyMinutes">
                  <el-input-number size="medium" v-model="interactionFormData.historyMinutes" :min="1" controls-position="right" style="width:30%;"></el-input-number>
                  <span>分钟</span>
                </el-form-item>
                <el-form-item label="互动信息保留" label-width="130px" prop="historyCount">
                  <el-input-number size="medium" v-model="interactionFormData.historyCount" :min="1" controls-position="right" style="width:30%;"></el-input-number>
                  <span>条</span>
                </el-form-item>
                <el-form-item style="display:flex;justify-content:center;">
                  <el-button type="primary" @click="handleInteractionFormInit">重置为默认配置</el-button>
                </el-form-item>
                <!-- 边框 -->
                <el-divider>边框配置</el-divider>
                <el-form-item>
                  <el-col :span="11">
                    <el-form-item label="边框宽度" label-width="130px" prop="borderWidth">
                      <el-select v-model="interactionFormData.borderWidth" style="width:100%;">
                        <el-option value="auto" label="自适应" key="auto"></el-option>
                        <el-option value="fixed" label="定宽" key="fixed"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="13">
                    <el-form-item label="边框形状" label-width="100px" prop="borderShape">
                      <el-select v-model="interactionFormData.borderShape" style="width:100%;">
                        <el-option value="rect" label="矩形" key="rect"></el-option>
                        <el-option value="round" label="圆角矩形" key="round"></el-option>
                        <el-option value="flow" label="流动矩形" key="flow"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item>
                  <el-col :span="11">
                    <el-form-item label="边框颜色" label-width="130px" prop="borderColor">
                      <el-color-picker v-model="interactionFormData.borderColor" show-alpha style="width:100%;" :predefine="predefineColors"></el-color-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="13">
                    <el-form-item label="边框大小" label-width="100px" prop="borderSize">
                      <el-input-number size="medium" v-model="interactionFormData.borderSize" :min="0" controls-position="right" style="width:100%;"></el-input-number>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <!-- 用户名 -->
                <!-- 字体 -->
                <el-divider>字体配置</el-divider>
                <el-form-item label="字体名称" label-width="130px" prop="fontFamily">
                  <el-cascader v-model="interactionFormData.fontFamily" :options="fontOptions" style="width:100%;" @change="handleFontSelectChange">
                  </elcascader>
                </el-form-item>
                <!-- 用户名 -->
                <el-divider>用户名配置</el-divider>
                <el-form-item>
                  <el-col :span="11">
                    <el-form-item label="字体颜色" label-width="130px" prop="userNameFontColor">
                      <el-color-picker v-model="interactionFormData.userNameFontColor" show-alpha style="width:100%;" :predefine="predefineColors"></el-color-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="13">
                    <el-form-item label="字体大小" label-width="100px" prop="userNameFontSize">
                      <el-input-number size="medium" v-model="interactionFormData.userNameFontSize" :min="0" controls-position="right" style="width:100%;"></el-input-number>
                    </el-form-item>
                  </el-row>
                </el-form-item>
                <el-form-item>
                  <el-col :span="11">
                    <el-form-item label="阴影颜色" label-width="130px" prop="userNameFontShadowColor">
                      <el-color-picker v-model="interactionFormData.userNameFontShadowColor" show-alpha style="width:100%;" :predefine="predefineColors"></el-color-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="13">
                    <el-form-item label="阴影大小" label-width="100px" prop="userNameFontShadowSize">
                      <el-input-number size="medium" v-model="interactionFormData.userNameFontShadowSize" :min="0" controls-position="right" style="width:100%;"></el-input-number>
                    </el-form-item>
                  </el-row>
                </el-form-item>
  
                <!-- 弹幕 -->
                <el-divider>弹幕信息配置</el-divider>
                <el-form-item>
                  <el-col :span="11">
                    <el-form-item label="背景颜色" label-width="130px" prop="danmakuBackgroundColor">
                      <el-color-picker v-model="interactionFormData.danmakuBackgroundColor" show-alpha style="width:100%;" :predefine="predefineColors"></el-color-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="13">
                    <el-form-item label="渐变为" label-width="100px" prop="danmakuBackgroundGradientColor">
                      <el-color-picker v-model="interactionFormData.danmakuBackgroundGradientColor" show-alpha style="width:100%;" :predefine="predefineColors"></el-color-picker>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item>
                  <el-col :span="11">
                    <el-form-item label="字体颜色" label-width="130px" prop="danmakuFontColor">
                      <el-color-picker v-model="interactionFormData.danmakuFontColor" show-alpha style="width:100%;" :predefine="predefineColors"></el-color-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="13">
                    <el-form-item label="字体大小" label-width="100px" prop="danmakuFontSize">
                      <el-input-number size="medium" v-model="interactionFormData.danmakuFontSize" :min="0" controls-position="right" style="width:100%;"></el-input-number>
                    </el-form-item>
                  </el-row>
                </el-form-item>
                <el-form-item>
                  <el-col :span="11">
                    <el-form-item label="阴影颜色" label-width="130px" prop="danmakuFontShadowColor">
                      <el-color-picker v-model="interactionFormData.danmakuFontShadowColor" show-alpha style="width:100%;" :predefine="predefineColors"></el-color-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="13">
                    <el-form-item label="阴影大小" label-width="100px" prop="danmakuFontShadowSize">
                      <el-input-number size="medium" v-model="interactionFormData.danmakuFontShadowSize" :min="0" controls-position="right" style="width:100%;"></el-input-number>
                    </el-form-item>
                  </el-row>
                </el-form-item>
                <el-form-item>
                  <el-col :span="11">
                    <el-form-item label="稿件背景颜色" label-width="130px" prop="danmakuDougaBackgroundColor">
                      <el-color-picker v-model="interactionFormData.danmakuDougaBackgroundColor" show-alpha style="width:100%;" :predefine="predefineColors"></el-color-picker>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item style="display:flex;justify-content:center;">
                  <el-button type="primary" @click="pushTestDanmakuMessage">测试一下</el-button>
                </el-form-item>
  
                <!-- 礼物 -->
                <el-divider>礼物信息配置</el-divider>
                <el-form-item>
                  <el-col :span="11">
                    <el-form-item label="背景颜色" label-width="130px" prop="giftBackgroundColor">
                      <el-color-picker v-model="interactionFormData.giftBackgroundColor" show-alpha style="width:100%;" :predefine="predefineColors"></el-color-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="13">
                    <el-form-item label="渐变为" label-width="100px" prop="giftBackgroundGradientColor">
                      <el-color-picker v-model="interactionFormData.giftBackgroundGradientColor" show-alpha style="width:100%;" :predefine="predefineColors"></el-color-picker>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item label="礼物信息" label-width="130px" prop="giftFormat">
                  <el-input v-model="interactionFormData.giftFormat" autocomplete="off" style="width:100%;" placeholder="请输入参与抽奖的弹幕关键词"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-col :span="11">
                    <el-form-item label="字体颜色" label-width="130px" prop="giftFontColor">
                      <el-color-picker v-model="interactionFormData.giftFontColor" show-alpha style="width:100%;" :predefine="predefineColors"></el-color-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="13">
                    <el-form-item label="字体大小" label-width="100px" prop="giftFontSize">
                      <el-input-number size="medium" v-model="interactionFormData.giftFontSize" :min="0" controls-position="right" style="width:100%;"></el-input-number>
                    </el-form-item>
                  </el-row>
                </el-form-item>
                <el-form-item>
                  <el-col :span="11">
                    <el-form-item label="阴影颜色" label-width="130px" prop="giftFontShadowColor">
                      <el-color-picker v-model="interactionFormData.giftFontShadowColor" show-alpha style="width:100%;" :predefine="predefineColors"></el-color-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="13">
                    <el-form-item label="阴影大小" label-width="100px" prop="giftFontShadowSize">
                      <el-input-number size="medium" v-model="interactionFormData.giftFontShadowSize" :min="0" controls-position="right" style="width:100%;"></el-input-number>
                    </el-form-item>
                  </el-row>
                </el-form-item>
                <el-form-item style="display:flex;justify-content:center;">
                  <el-button type="primary" @click="pushTestGiftMessage">测试一下</el-button>
                </el-form-item>
  
                <!-- 点赞 -->
                <el-divider>点赞信息配置</el-divider>
                <el-form-item label="点赞信息" label-width="130px" prop="likeFormat">
                  <el-input v-model="interactionFormData.likeFormat" autocomplete="off" style="width:100%;" placeholder="请输入参与抽奖的弹幕关键词"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-col :span="11">
                    <el-form-item label="字体颜色" label-width="130px" prop="likeFontColor">
                      <el-color-picker v-model="interactionFormData.likeFontColor" show-alpha style="width:100%;" :predefine="predefineColors"></el-color-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="13">
                    <el-form-item label="字体大小" label-width="100px" prop="likeFontSize">
                      <el-input-number size="medium" v-model="interactionFormData.likeFontSize" :min="0" controls-position="right" style="width:100%;"></el-input-number>
                    </el-form-item>
                  </el-row>
                </el-form-item>
                <el-form-item>
                  <el-col :span="11">
                    <el-form-item label="阴影颜色" label-width="130px" prop="likeFontShadowColor">
                      <el-color-picker v-model="interactionFormData.likeFontShadowColor" show-alpha style="width:100%;" :predefine="predefineColors"></el-color-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="13">
                    <el-form-item label="阴影大小" label-width="100px" prop="likeFontShadowSize">
                      <el-input-number size="medium" v-model="interactionFormData.likeFontShadowSize" :min="0" controls-position="right" style="width:100%;"></el-input-number>
                    </el-form-item>
                  </el-row>
                </el-form-item>
                <el-form-item style="display:flex;justify-content:center;">
                  <el-button type="primary" @click="pushTestLikeMessage">测试一下</el-button>
                </el-form-item>
  
  
                <!-- 进入直播间 -->
                <el-divider>进入直播间信息配置</el-divider>
                <el-form-item label="进入直播间信息" label-width="130px" prop="enterroomFormat">
                  <el-input v-model="interactionFormData.enterroomFormat" autocomplete="off" style="width:100%;" placeholder="请输入参与抽奖的弹幕关键词"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-col :span="11">
                    <el-form-item label="字体颜色" label-width="130px" prop="enterroomFontColor">
                      <el-color-picker v-model="interactionFormData.enterroomFontColor" show-alpha style="width:100%;" :predefine="predefineColors"></el-color-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="13">
                    <el-form-item label="字体大小" label-width="100px" prop="enterroomFontSize">
                      <el-input-number size="medium" v-model="interactionFormData.enterroomFontSize" :min="0" controls-position="right" style="width:100%;"></el-input-number>
                    </el-form-item>
                  </el-row>
                </el-form-item>
                <el-form-item>
                  <el-col :span="11">
                    <el-form-item label="阴影颜色" label-width="130px" prop="enterroomFontShadowColor">
                      <el-color-picker v-model="interactionFormData.enterroomFontShadowColor" show-alpha style="width:100%;" :predefine="predefineColors"></el-color-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="13">
                    <el-form-item label="阴影大小" label-width="100px" prop="enterroomFontShadowSize">
                      <el-input-number size="medium" v-model="interactionFormData.enterroomFontShadowSize" :min="0" controls-position="right" style="width:100%;"></el-input-number>
                    </el-form-item>
                  </el-row>
                </el-form-item>
                <el-form-item style="display:flex;justify-content:center;">
                  <el-button type="primary" @click="pushTestEnterRoomMessage">测试一下</el-button>
                </el-form-item>
  
                <!-- 关注 -->
                <el-divider>关注信息配置</el-divider>
                <el-form-item label="关注信息" label-width="130px" prop="followFormat">
                  <el-input v-model="interactionFormData.followFormat" autocomplete="off" style="width:100%;" placeholder="请输入参与抽奖的弹幕关键词"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-col :span="11">
                    <el-form-item label="字体颜色" label-width="130px" prop="followFontColor">
                      <el-color-picker v-model="interactionFormData.followFontColor" show-alpha style="width:100%;" :predefine="predefineColors"></el-color-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="13">
                    <el-form-item label="字体大小" label-width="100px" prop="followFontSize">
                      <el-input-number size="medium" v-model="interactionFormData.followFontSize" :min="0" controls-position="right" style="width:100%;"></el-input-number>
                    </el-form-item>
                  </el-row>
                </el-form-item>
                <el-form-item>
                  <el-col :span="11">
                    <el-form-item label="阴影颜色" label-width="130px" prop="followFontShadowColor">
                      <el-color-picker v-model="interactionFormData.followFontShadowColor" show-alpha style="width:100%;" :predefine="predefineColors"></el-color-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="13">
                    <el-form-item label="阴影大小" label-width="100px" prop="followFontShadowSize">
                      <el-input-number size="medium" v-model="interactionFormData.followFontShadowSize" :min="0" controls-position="right" style="width:100%;"></el-input-number>
                    </el-form-item>
                  </el-row>
                </el-form-item>
                <el-form-item style="display:flex;justify-content:center;">
                  <el-button type="primary" @click="pushTestFollowMessage">测试一下</el-button>
                </el-form-item>
  
                <!-- 加入守护团 -->
                <el-divider>加入守护团信息配置</el-divider>
                <el-form-item label="加入守护团信息" label-width="130px" prop="joinclubFormat">
                  <el-input v-model="interactionFormData.joinclubFormat" autocomplete="off" style="width:100%;" placeholder="请输入参与抽奖的弹幕关键词"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-col :span="11">
                    <el-form-item label="字体颜色" label-width="130px" prop="joinclubFontColor">
                      <el-color-picker v-model="interactionFormData.joinclubFontColor" show-alpha style="width:100%;" :predefine="predefineColors"></el-color-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="13">
                    <el-form-item label="字体大小" label-width="100px" prop="joinclubFontSize">
                      <el-input-number size="medium" v-model="interactionFormData.joinclubFontSize" :min="0" controls-position="right" style="width:100%;"></el-input-number>
                    </el-form-item>
                  </el-row>
                </el-form-item>
                <el-form-item>
                  <el-col :span="11">
                    <el-form-item label="阴影颜色" label-width="130px" prop="joinclubFontShadowColor">
                      <el-color-picker v-model="interactionFormData.joinclubFontShadowColor" show-alpha style="width:100%;" :predefine="predefineColors"></el-color-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="13">
                    <el-form-item label="阴影大小" label-width="100px" prop="joinclubFontShadowSize">
                      <el-input-number size="medium" v-model="interactionFormData.joinclubFontShadowSize" :min="0" controls-position="right" style="width:100%;"></el-input-number>
                    </el-form-item>
                  </el-row>
                </el-form-item>
                <el-form-item style="display:flex;justify-content:center;">
                  <el-button type="primary" @click="pushTestJoinClubMessage">测试一下</el-button>
                </el-form-item>
              </template>
  
  
              <el-form-item style="display:flex;justify-content:center;">
                <el-button type="primary" @click="handleInteractionFormSubmit">提交</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
  
  
          <el-dialog v-dialog-drag title="添加竞猜" :visible.sync="guessFormDialogVisible" :modal="false" width="550px" custom-class="guess-form-dialog" :close-on-click-modal="false">
            <el-form :model="guessFormData" class="guess-form" ref="form" :rules="guessFormRules" @submit.native.prevent>
              <el-form-item label="竞猜标题" label-width="150px" prop="title">
                <el-input v-model="guessFormData.title" autocomplete="off" style="width:100%;"></el-input>
              </el-form-item>
              <el-form-item label="竞猜问题挑选方式" label-width="150px" prop="chooseWay">
                <el-radio-group v-model="guessFormData.chooseWay" style="width:100%;">
                  <el-radio label="manual">手动挑选</el-radio>
                  <el-radio label="random">随机挑选</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="竞猜问题挑选倒计时" label-width="150px" prop="countdown">
                <el-input-number size="medium" v-model="guessFormData.countdown" :min="0" controls-position="right" style="width:50%;"></el-input-number><span>（秒，0表示不做限制）</span>
              </el-form-item>
              <el-form-item label="总共可竞猜次数" label-width="150px" prop="maxGuess">
                <el-input-number size="medium" v-model="guessFormData.maxGuess" :min="0" controls-position="right" style="width:50%;"></el-input-number><span>（0表示不做限制）</span>
              </el-form-item>
              <el-form-item label="每个用户可竞猜次数" label-width="150px" prop="maxGuessPerUser">
                <el-input-number size="medium" v-model="guessFormData.maxGuessPerUser" :min="0" controls-position="right" style="width:50%;"></el-input-number><span>（0表示不做限制）</span>
              </el-form-item>
              <el-form-item label="总共可狙击次数" label-width="150px" prop="maxDirectGuess">
                <el-input-number size="medium" v-model="guessFormData.maxDirectGuess" :min="0" controls-position="right" style="width:50%;"></el-input-number><span>（0表示不做限制）</span>
              </el-form-item>
              <el-form-item label="每个用户可狙击次数" label-width="150px" prop="maxDirectGuessPerUser">
                <el-input-number size="medium" v-model="guessFormData.maxDirectGuessPerUser" :min="0" controls-position="right" style="width:50%;"></el-input-number><span>（0表示不做限制）</span>
              </el-form-item>
  
              <el-form-item style="display:flex;justify-content:center;">
                <el-button type="primary" @click="handleGuessFormSubmit">立即创建</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
  
          <el-dialog ref="guessStartDialog" v-dialog-drag title="竞猜详情" :visible.sync="guessStartDialogVisible" :modal="false" width="1000px" custom-class="guess-start-dialog" :close-on-click-modal="false" @closed="handleGuessStartDialogClose">
            <template v-if="activeGuess">
              <el-row>
                <span>{{activeGuess.displayDirectGuess?'狙击':'竞猜'}}问题列表</span>
                <el-button type="primary" @click="handleGuessDanmakuSubmit" size="small" v-if="activeGuess.status == '进行中' && (activeGuess.maxGuess==0 || activeGuess.maxGuess > activeGuess.guessList.length)">开始下一个问题</el-button>
                <el-button type="primary" @click="activeGuess.displayDirectGuess = !activeGuess.displayDirectGuess" size="small">{{activeGuess.displayDirectGuess?'隐藏狙击问题':'显示狙击问题'}}</el-button>
                <el-button type="primary" @click="activeGuess.onlyDisplayMatch = !activeGuess.onlyDisplayMatch" size="small">{{activeGuess.onlyDisplayMatch?'显示未命中问题':'隐藏未命中问题'}}</el-button>
              </el-row>
              <el-table :data="activeGuessGuessListData" style="width: 100%" class="guess-list-table" border ref="guessListTable" height="330">
                <el-table-column prop="index" label="序号" min-width="5%">
                </el-table-column>
                <el-table-column prop="userName" label="用户" min-width="25%">
                  <template slot-scope="scope">
                    <el-avatar shape="circle" fit="fill" size="40" :src="scope.row.photo"></el-avatar>
                    <span>{{scope.row.userName}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="guess" label="问题" min-width="60%">
                </el-table-column>
                <el-table-column prop="isValid" label="是否命中" min-width="10%">
                  <template slot-scope="scope">
                    <i class="el-icon-check" v-if="scope.row.isValid==true" style="font-size:50px;color:#409EFF;"></i>
                    <i class="el-icon-close" v-if="scope.row.isValid==false" style="font-size:50px;color:#F56C6C;"></i>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-dialog>
  
          <el-dialog ref="guessDanmakuDialog" v-dialog-drag :visible.sync="guessDanmakuDialogVisible" :modal="false" width="550px" custom-class="guess-danmaku-dialog" :close-on-click-modal="false" :destroy-on-close="true" @closed="handleGuessDanmakuDialogClose">
            <template slot="title">
              <el-row type="flex">
                <span class="el-dialog__title">弹幕竞猜</span>
                <span style="font-size:16px;color:#303133" v-show="activeGuess && activeGuess.chooseWay == 'random'">
                  <span>（倒计时</span>
                  <span style="background-color:#66b1ff;color:white;border-radius:5px;font-weight:bold;" id="guess-danmaku-countdown-text"></span>
                  <span>）</span>
                </span>
  
              </el-row>
            </template>
            <el-row class="guess-danmaku-container">
            </el-row>
          </el-dialog>
  
          <el-dialog v-dialog-drag title="查看竞猜" :visible.sync="guessTableDialogVisible" :modal="false" width="1000px" custom-class="guess-table-dialog" :close-on-click-modal="false">
            <el-table :data="guessTableData" style="width: 100%" class="guess-table" >
              <el-table-column prop="title" label="竞猜标题" min-width="50%">
              </el-table-column>
              <el-table-column prop="status" label="状态" min-width="10%">
              </el-table-column>
              <el-table-column prop="winner" label="狙击成功用户" min-width="30%">
                <template slot-scope="scope">
                  <template v-if="scope.row.winner">
                    <el-avatar shape="circle" fit="fill" size="40" :src="scope.row.winner.photo"></el-avatar>
                    <span>{{scope.row.winner.userName}}</span>
                  </template>
                  <span v-else></span>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="10%">
                <template slot-scope="scope">
                  <el-button type="text" @click="openGuessStartDialog(scope.row)">进入竞猜</el-button>
                </template>
              </el-table-column>
  
            </el-table>
  
          </el-dialog>
  
  
          <div id="douga-result" style="display:none;"></div>
        </div>
  
  
  
      `;
      containerEle.append(menuEle);
  
      // 对话框拖动指令
      Vue.directive('dialog-drag', function(el, binding, vnode, oldVnode) {
  
        // 弹框可拉伸最小宽高
        const minWidth = 400
        const minHeight = 300
  
        // 初始非全屏
        let isFullScreen = false
  
        // 当前顶部高度
        let nowMarginTop = 0
  
        // 获取弹框头部（这部分可双击全屏）
        const dialogHeaderEl = el.querySelector('.el-dialog__header')
  
        // 弹窗
        const dragDom = el.querySelector('.el-dialog')
  
        // 给弹窗加上overflow auto；不然缩小时框内的标签可能超出dialog；
        dragDom.style.overflow = 'hidden'
  
        // 清除选择头部文字效果
        // dialogHeaderEl.onselectstart = new Function("return false");
  
        // 头部加上可拖动cursor
        dialogHeaderEl.style.cursor = 'move'
  
        // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
        const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)
        const moveDown = e => {
          // 鼠标按下，计算当前元素距离可视区的距离
          const disX = e.clientX - dialogHeaderEl.offsetLeft
          const disY = e.clientY - dialogHeaderEl.offsetTop
  
          // 获取到的值带px 正则匹配替换
          let styL, styT
  
          // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
  
          if (sty.left.includes('%')) {
            styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
            styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
          } else {
            styL = +sty.left.replace(/\px/g, '')
            styT = +sty.top.replace(/\px/g, '')
          }
  
          document.onmousemove = function(e) {
            // 通过事件委托，计算移动的距离
            const l = e.clientX - disX
            const t = e.clientY - disY
  
            // 移动当前元素
            dragDom.style.left = `${l + styL}px`
            dragDom.style.top = `${t + styT}px`
  
            // 将此时的位置传出去
            // binding.value({x:e.pageX,y:e.pageY})
          }
  
          document.onmouseup = function(e) {
            document.onmousemove = null
            document.onmouseup = null
          }
        }
  
        dialogHeaderEl.onmousedown = moveDown
        // 当前宽高
        let nowWidth = 0
        // let nowHight = 0
        // 双击头部全屏效果
        dialogHeaderEl.ondblclick = e => {
          if (isFullScreen === false) {
            // nowHight = dragDom.clientHeight
            nowWidth = dragDom.clientWidth
            nowMarginTop = dragDom.style.marginTop
  
            dragDom.style.left = 0
            dragDom.style.top = 0
            dragDom.style.height = '100VH'
            dragDom.style.width = '100VW'
            dragDom.style.marginTop = 0
  
            isFullScreen = true
  
            dialogHeaderEl.style.cursor = 'initial'
            dialogHeaderEl.onmousedown = null
          } else {
            dragDom.style.height = 'auto'
            dragDom.style.width = nowWidth + 'px'
            dragDom.style.marginTop = nowMarginTop
  
            isFullScreen = false
  
            dialogHeaderEl.style.cursor = 'move'
            dialogHeaderEl.onmousedown = moveDown
          }
        }
  
        dragDom.onmousemove = function(e) {
          // let moveE = e
  
          if (
            e.clientX > dragDom.offsetLeft + dragDom.clientWidth - 10 ||
            dragDom.offsetLeft + 10 > e.clientX
          ) {
            dragDom.style.cursor = 'w-resize'
          } else if (
            el.scrollTop + e.clientY >
            dragDom.offsetTop + dragDom.clientHeight - 10
          ) {
            dragDom.style.cursor = 's-resize'
          } else {
            dragDom.style.cursor = 'default'
  
            dragDom.onmousedown = null
          }
  
          dragDom.onmousedown = e => {
            const clientX = e.clientX
            const clientY = e.clientY
            const elW = dragDom.clientWidth
            const elH = dragDom.clientHeight
            const EloffsetLeft = dragDom.offsetLeft
            const EloffsetTop = dragDom.offsetTop
  
            dragDom.style.userSelect = 'none'
  
            const ELscrollTop = el.scrollTop
  
            // 判断点击的位置是不是为头部
            if (
              clientX > EloffsetLeft &&
              clientX < EloffsetLeft + elW &&
              clientY > EloffsetTop &&
              clientY < EloffsetTop + 100
            ) {
              // 如果是头部在此就不做任何动作，以上有绑定dialogHeaderEl.onmousedown = moveDown;
            } else {
              document.onmousemove = function(e) {
                // 移动时禁用默认事件
                e.preventDefault()
  
                // 左侧鼠标拖拽位置
                if (clientX > EloffsetLeft && clientX < EloffsetLeft + 10) {
                  // 往左拖拽
                  if (clientX > e.clientX) {
                    dragDom.style.width = elW + (clientX - e.clientX) * 2 + 'px'
                  }
  
                  // 往右拖拽
                  if (clientX < e.clientX) {
                    if (dragDom.clientWidth < minWidth) {
                    } else {
                      dragDom.style.width = elW - (e.clientX - clientX) * 2 + 'px'
                    }
                  }
                }
  
                // 右侧鼠标拖拽位置
                if (
                  clientX > EloffsetLeft + elW - 10 &&
                  clientX < EloffsetLeft + elW
                ) {
                  // 往左拖拽
                  if (clientX > e.clientX) {
                    if (dragDom.clientWidth < minWidth) {
                    } else {
                      dragDom.style.width = elW - (clientX - e.clientX) * 2 + 'px'
                    }
                  }
  
                  // 往右拖拽
                  if (clientX < e.clientX) {
                    dragDom.style.width = elW + (e.clientX - clientX) * 2 + 'px'
                  }
                }
  
                // 底部鼠标拖拽位置
                if (
                  ELscrollTop + clientY > EloffsetTop + elH - 20 &&
                  ELscrollTop + clientY < EloffsetTop + elH
                ) {
                  // 往上拖拽
                  if (clientY > e.clientY) {
                    if (dragDom.clientHeight < minHeight) {
                    } else {
                      dragDom.style.height = elH - (clientY - e.clientY) * 2 + 'px'
                    }
                  }
  
                  // 往下拖拽
                  if (clientY < e.clientY) {
                    dragDom.style.height = elH + (e.clientY - clientY) * 2 + 'px'
                  }
                }
              }
  
              // 拉伸结束
              document.onmouseup = function(e) {
                document.onmousemove = null
  
                document.onmouseup = null
  
                vue.onDialogResize(dragDom);
              }
            }
          }
        }
      });
  
  
      Vue.use(ELEMENT);
      Vue.prototype.$message = ELEMENT.Message;
  
      if(!document.querySelector('.container-live-feed-messages-acfunlive')){
        return false;
      }
  
      // 初始化实例
      vue = new Vue({
          el : '.container-live-feed-messages-acfunlive',
          components : {
          },
          data : function(){
  
            var vue = this;
  
            var lotteryFormDataDefault = {
              joinMethod : [],
              weight : false,
              joinGiftList : [],
              mutualLotteryList : [],
              countdown : 10,
              status : '未开始',
              candidates : {},
              winners : [],
              startCandidates : [],
              medalName : '',
              medalLevel : 0,
              source : 'livestream',
              dougaType : 'video',
              dougaList : [],
              dougaListPage : 1,
              dougaListDisabled : false,
              dougaListLoading : false,
              dougaListNoMore : false,
              dougaListActiveIndex : null,
              loading : false,
              rolling : false,
              loadingText : '',
              winnerCount : 0,
            };
  
            var guessFormDataDefault = {
              title : '',
              countdown : 20,
              chooseWay : 'random',
              status : '进行中',
              maxGuess : 0,
              maxGuessPerUser : 0,
              maxQuestionPerUser : 0,
              maxDirectGuess : 0,
              maxDirectGuessPerUser : 1,
              guessList : [],
              matchGuessList : [],
              directGuessList : [],
              guessIndex : 1,
              displayDirectGuess : false,
              onlyDisplayMatch : false,
            };
  
            var interactionFormDataInit = {
  
              enable : true,
              historyMinutes : 10,
              historyCount : 200,
              direction : 'vertical',
              displayNotWrap : false,
              fontFamily : ['default', 'inherit'],
              userNameFontSize : 18,
              userNameFontColor : 'rgba(255, 69, 0, 1)',
              userNameFontShadowColor : 'rgba(0, 0, 0, 1)',
              userNameFontShadowSize : 1,
              danmakuBackgroundColor : 'rgba(30, 144, 255, 1)',
              danmakuBackgroundGradientColor : 'rgba(30, 144, 255, 1)',
              danmakuFontSize : 25,
              danmakuFontColor : 'rgba(255, 255, 255, 1)',
              danmakuFontShadowColor : 'rgba(0, 0, 0, 1)',
              danmakuFontShadowSize : 1,
              danmakuDougaBackgroundColor: 'rgba(255, 255, 255, 1)',
              giftBackgroundColor: 'rgba(255, 166, 104, 1)',
              giftBackgroundGradientColor: 'rgba(252, 91, 108, 1)',
              giftFormat : '送出了${礼物名称}',
              giftFontSize : 25,
              giftFontColor : 'rgba(255, 176, 35, 1)',
              giftFontShadowColor : 'rgba(0, 0, 0, 1)',
              giftFontShadowSize : 1,
              likeFormat : '点赞了',
              likeFontSize : 18,
              likeFontColor : 'rgba(255, 0, 0, 1)',
              likeFontShadowColor : 'rgba(255, 255, 255, 1)',
              likeFontShadowSize : 2,
              enterroomFormat : '进入直播间',
              enterroomFontSize : 18,
              enterroomFontColor : 'rgba(30, 144, 255, 1)',
              enterroomFontShadowColor : '#FFF',
              enterroomFontShadowSize : 2,
              followFormat : '关注了主播',
              followFontSize : 20,
              followFontColor : 'rgba(199, 21, 133, 1)',
              followFontShadowColor : 'rgba(255, 255, 255, 1)',
              followFontShadowSize : 2,
              joinclubFormat : '加入主播的守护团',
              joinclubFontSize : 20,
              joinclubFontColor : 'rgba(199, 21, 133, 1)',
              joinclubFontShadowColor : 'rgba(255, 255, 255, 1)',
              joinclubFontShadowSize : 2,
  
              backgroundColor: 'rgba(0, 204, 0, 1)',
  
              borderShape: 'round',
              borderWidth: 'auto',
              borderSize: 2,
              borderColor: 'rgba(30, 144, 255, 1)',
            };
  
            return {
  
              messageData : [],
              lastDanmakuMessage : null,
              userInfo : userInfo,
  
              uid : config.UID,
  
              loginFormDialogVisible : false,
              lotteryTableDialogVisible : false,
              lotteryFormDialogVisible : false,
              userTableDialogVisible : false,
              lotteryCountdownDialogVisible : false,
              lotteryStartDialogVisible : false,
              lotteryFormDialogTitle : '',
              userTableDialogTitle : '',
              audioFormDialogVisible : false,
              interactionFormDialogVisible : false,
              interactionPresetDialogVisible: false,
  
              loginFormData : {
                token : '',
              },
              loginFormRules : {
                token : [{
                  required : true, message : '请输入口令', trigger : 'blur',
                }],
              },
  
              lotteryFormDataDefault : _.cloneDeep(lotteryFormDataDefault),
              lotteryFormData : _.cloneDeep(lotteryFormDataDefault),
              lotteryFormRules : {
                name : [{
                  required : true, message : '请输入奖品名称', trigger : 'blur',
                }],
                countdown : [{
                  required : true, message : '请输入抽奖倒计时', trigger : 'blur',
                }],
                startTime : [{
                  required : true, message : '请设置开奖时间', trigger : 'blur',
                },{
                  trigger : 'blur',
                  message : '开奖时间与当前时间差距低于1分钟',
                  validator : function(rule, value, callback){
                    if(value && moment(value, 'HH:mm:ss').subtract(1, 'minutes') < moment()){
                      callback(new Error(rule.message));
                    }
                    else{
                      callback();
                    }
                  },
                },],
                /*joinMethod : [{
                  required : true, message : '请设置抽奖参与方式', trigger : 'blur',
                },{
                  trigger : 'blur',
                  message : '请选择至少一个抽奖参与方式',
                  validator : function(rule, value, callback){
                    if(value.length==0){
                      callback(new Error(rule.message));
                    }
                    else{
                      callback();
                    }
                  },
                }],*/
                /*joinKeyword : [{
                  trigger : 'blur',
                  message : '请输入参与抽奖的弹幕关键词',
                  validator : function(rule, value, callback){
                    // 抽奖参与方式为弹幕
                    if(vue.lotteryFormData.joinMethod == 'danmaku' && !value){
                      callback(new Error(rule.message));
                    }else{
                      callback();
                    }
                  },
                }],*/
                /*joinGiftList : [{
                  trigger : 'blur',
                  message : '请选择参与抽奖的礼物，至少一个',
                  validator : function(rule, value, callback){
                    // 抽奖参与方式为礼物
                    if(vue.lotteryFormData.joinMethod == 'gift' && (!value || value.length==0)){
                      callback(new Error(rule.message));
                    }else{
                      callback();
                    }
                  },
                }],*/
              },
              giftList : giftList,
              giftNameMapper : {},
  
              lotteryTableData : [],
  
              userTableData : [],
  
              // 时间筛选范围，为当前时间至23:59:59
              timePickerOptions : {
                selectableRange : `${moment().format("HH:mm:ss")} - 23:59:59`,
                "value-format" : 'HH:mm:ss',
              },
  
              // 当前活跃抽奖
              activeLottery : {},
  
              // 可选语音
              audioVoiceOptions : null,
              // 语速
              speechRateMarks : {
                250 : '更慢',
                500 : '默认',
                750 : '更快',
              },
              speechVolumeMarks : {
                25 : '更小',
                50 : '默认',
                75 : '更大',
              },
              // 语音配置表单规则
              audioFormRules : {
  
              },
              // 语音配置表单数据
              audioFormData : {
  
                voice : ['general', 'Xiaoyun'],
                enable : false,
                speechRate : 500,
                speechVolume : 50,
                joinMethod : ['danmaku', 'gift', 'follow'],
                danmakuFormat : '${用户名}说${弹幕内容}',
                likeFormat : '${用户名}点赞了',
                giftFormat : '${用户名}送出${礼物数量}个${礼物名称}',
                enterroomFormat : '${用户名}进入直播间',
                followFormat : '${用户名}关注了主播',
                danmakuTimeout : 0,
                likeTimeout : 0,
                giftTimeout : 2,
                enterroomTimeout : 0,
                followTimeout : 0,
  
                consumeing : false,
                interactions : [],
                messageBuffer : {},
  
              },
  
  
              // 弹幕配置表单规则
              interactionFormRules : {},
              interactionFormDataInit: interactionFormDataInit,
              // 弹幕配置表单数据
              interactionFormData : {
                index: null,
                name: "",
                ..._.cloneDeep(interactionFormDataInit)
              },
  
  
              // 竞猜表单
              guessFormDialogVisible : false,
              guessFormDataDefault : _.cloneDeep(guessFormDataDefault),
              guessFormData : _.cloneDeep(guessFormDataDefault),
              guessFormRules : {
                title : [{
                  required : true, message : '竞猜标题不可为空', trigger : 'blur',
                }],
                countdown : [{
                  trigger : 'blur',
                  message : '竞猜挑选方式为“随机挑选”时，竞猜挑选倒计时至少为10（秒）',
                  validator : function(rule, value, callback){
                    if(vue.guessFormData.chooseWay == 'random' && value < 10){
                      callback(new Error(rule.message));
                    }
                    else{
                      callback();
                    }
                  },
                }],
              },
  
              // 当前活跃竞猜
              activeGuess : null,
  
              // 竞猜表格
              guessTableDialogVisible : false,
              guessTableData : [],
  
              // 开始竞猜
              guessStartDialogVisible : false,
  
              // 弹幕竞猜
              guessDanmakuDialogVisible : false,
  
              // 请求acfun用户投稿时使用
              reqId : 1,
  
              // 鼠标悬浮状态
              mouseOn : false,
  
              // 预定义颜色
              predefineColors : [
                '#ff4500',
                '#ff8c00',
                '#ffd700',
                '#90ee90',
                '#00ced1',
                '#1e90ff',
                '#c71585',
                'rgba(255, 69, 0, 0.68)',
                'rgb(255, 120, 0)',
                'hsv(51, 100, 98)',
                'hsva(120, 40, 94, 0.5)',
                'hsl(181, 100%, 37%)',
                'hsla(209, 100%, 56%, 0.73)',
                '#c7158577'
              ],
  
  
              // 字体选项
              fontOptions : null,
  
              // 下载过的字体
              downloadedFonts : {},
  
              // 弹幕配置
              danmaku : null,
  
              candidateInfoCallbacks : [],
              isGettingCandidate : false,
  
              // 弹幕配置预设值
              interactionPreset : [
              ],
  
            };
          },
          methods : {
            filter : _.filter,
            // 下拉菜单点击回调
            handleDropdownMenuClick : function(command){
  
              var vue = this;
  
              // 添加抽奖
              if(command=='newLottery'){
                this.addOrUpdateLottery();
              }
              // 查看抽奖表格
              else if(command=='lotteryTable'){
                this.lotteryTableDialogVisible = true;
              }
              // 导出中奖名单
              else if(command=='exportLottery'){
                this.exportLottery();
              }
              // 添加竞猜
              else if(command=='newGuess'){
                this.guessFormDialogVisible = true;
              }
              // 查看竞猜表格
              else if(command=='guessTable'){
                this.guessTableDialogVisible = true;
              }
              // 弹幕编辑
              else if(command=='editInteraction'){
                this.interactionPresetDialogVisible = true;
              }
              // 帮助手册
              else if(command == 'help'){
                window.open('https://docs.qq.com/doc/DZXF2aFJWb0FxR3N4', '_blank');
              }
            },
            // 对话框大小修改
            onDialogResize : function(diagDom){
  
  
            },
  
            // 抽奖表单提交回调
            handleLotteryFormSubmit : function(){
  
              var vue = this;
  
              function addOrUpdateLottery(){
  
                var isNew = !vue.lotteryFormData.id;
                // 设置状态
                vue.lotteryFormData.status = '未开始';
                // 设置开奖时间文字
                vue.lotteryFormData.startTimeText = moment(vue.lotteryFormData.startTime).format('HH:mm:ss');
                // 备选
                vue.lotteryFormData.candidates = {};
                vue.lotteryFormData.startCandidates = [];
                // 获奖者
                vue.lotteryFormData.winners = [];
  
                // 新增抽奖
                if(!vue.lotteryFormData.id){
  
                  // 添加id
                  vue.lotteryFormData.id = uuidv4();
  
                  vue.lotteryTableData.splice(0, 0, vue.lotteryFormData);
  
                }
  
                // 注册抽奖回调
                vue.registerLotteryCallback(vue.lotteryFormData);
  
                vue.lotteryFormDialogVisible = false;
  
                vue.$message({
                  message : isNew?'添加抽奖成功':'修改抽奖信息成功',
                  type : 'info',
                  duration : 2000,
                });
              }
  
              this.$refs.form.validate((valid) => {
                // 通过校验
                if(valid){
  
                  // 如果是稿件抽奖，查看是否有选中稿件
                  if(this.lotteryFormData.source == 'douga' && this.lotteryFormData.dougaListActiveIndex==null){
  
                    this.$message({
                      message : '请选择稿件',
                      type : 'error',
                    });
  
                    return;
                  }
  
                  // 稿件抽奖
                  if(this.lotteryFormData.source=='douga'){
  
                    var processMessage = null;;
  
                    // 获取稿件评论
                    this.getCommentList(this.lotteryFormData.dougaList[this.lotteryFormData.dougaListActiveIndex], true, function(isSuccess, isFinish, commentCount, page, totalPage){
  
                      // 错误
                      if(!isSuccess){
  
                        vue.lotteryFormData.loading = false;
  
                        vue.$message({
                          message : '获取稿件评论信息错误',
                          type : 'error',
                        });
                      }
  
                      else{
  
                        // 开始加载
                        vue.lotteryFormData.loadingText = `正在加载 ${page}/${totalPage} 页评论`;
                        vue.lotteryFormData.loading = true;
  
                        // 加载完毕
                        if(isFinish){
  
                          vue.lotteryFormData.loading = false;
                          addOrUpdateLottery();
  
                        }
  
  
                      }
  
  
                    });
  
                  }
  
                  else{
  
                    addOrUpdateLottery();
                  }
  
  
                }
                else{
  
                  this.$message({
                    message : '提交失败，请检查是否填写正确',
                    type : 'error',
                  });
                }
              });
            },
            // 修改抽奖信息
            handleLotteryModify : function(lottery){
              this.addOrUpdateLottery(lottery);
            },
            // 复制抽奖
            handleLotteryCopy : function(lottery){
              this.addOrUpdateLottery(lottery, true);
            },
            // 查看候选人
            handleLotteryCandidatesCheck : function(lottery){
              var userTableData = [];
              for(var uid in lottery.candidates){
                var candidate = lottery.candidates[uid];
                userTableData.push(candidate);
              }
  
              this.userTableData = _.sortBy(userTableData, 'index');
              this.userTableDialogTitle = '候选名单';
              this.userTableDialogVisible = true;
  
            },
            // 查看中奖者
            handleLotteryWinnersCheck : function(lottery){
  
              this.userTableData = lottery.winners;
              this.userTableDialogTitle = '中奖名单';
              this.userTableDialogVisible = true;
            },
            login : function(callback){
              this.loginFormDialogVisible = true;
  
              if(_.isFunction(callback)){
                this.loginFormData.nextCallback = callback;
              }
              else{
                this.loginFormData.nextCallback = null;
              }
  
            },
            addOrUpdateLottery : function(lottery, copy){
              if(lottery && lottery.id){
  
                // 复制抽奖信息
                if(copy){
                  this.lotteryFormData = {
                    name : lottery.name,
                    weight : lottery.weight,
                    soucre : lottery.source,
                    startTime : lottery.startTime,
                    countdown : lottery.countdown,
                    medalName : lottery.medalName,
                    medalLevel : lotter.medalLevel,
                    mutualLotteryList : _.cloneDeep(lottery.mutualLotteryList),
                    joinMethod : _.cloneDeep(lottery.joinMethod),
                    joinKeyword : lottery.joinKeyword,
                    joinGiftList : _.cloneDeep(lottery.joinGiftList),
                    candidates : {},
                    startCandidates : [],
                    winners : [],
                    dougaType : lottery.dougaType,
                    dougaList : lottery.dougaList,
                    dougaListPage : lottery.dougaListPage,
                    dougaListDisabled : lottery.dougaListDisabled,
                    dougaListLoading : lottery.dougaListLoading,
                    dougaListNoMore : lottery.dougaListNoMore,
                    dougaListActiveIndex : lottery.dougaListActiveIndex,
                  };
                  this.lotteryFormDialogTitle = '添加抽奖';
                }
                // 修改抽奖信息
                else{
                  this.lotteryFormData = lottery;
                  this.lotteryFormDialogTitle = '修改抽奖';
                }
  
              }
              else{
                this.lotteryFormData = _.cloneDeep(this.lotteryFormDataDefault);
                this.lotteryFormDialogTitle = '添加抽奖';
              }
              this.lotteryFormDialogVisible = true;
            },
            // 注册抽奖回调
            registerLotteryCallback : function(lottery){
  
              var vue = this;
  
              function updateCandidates(){
  
                var candidates = {};
  
                lottery.dougaList[lottery.dougaListActiveIndex].commentList.forEach(function(comment, index){
  
                  var pass = true;
                  // 如果设置了互斥抽奖
                  if(lottery.mutualLotteryList && lottery.mutualLotteryList.length>0){
  
  
                    _.filter(vue.lotteryTableData, function(o){return lottery.mutualLotteryList.indexOf(o.id)!=-1}).every(function(anotherLottery){
  
                      if(_.findIndex(anotherLottery.winners, {uid:comment.uid})!=-1){
                        pass = false;
                        return false;
                      }
                      else{
                        return true;
                      }
  
                    });
  
                  }
  
                  if(!pass){
                    return;
                  }
  
                  if(!(comment.uid in candidates)){
                    let candidate = {
                      index : -comment.floor,
                      uid : comment.uid,
                      userName : comment.userName,
                      photo : comment.photo,
                    };
  
                    // 如果筛选了牌子
                    if(lottery.medalName && lottery.medalLevel){
                      vue.getCandidateInfo(candidate, (isSuccess, )=>{
                        if(candidate.medalName == lottery.medalName && candidate.medalLevel >= lottery.medalLevel){
                          candidates[comment.uid] = candidate;
                        }
                      });
                    }
                    else{
                      candidates[comment.uid] = candidate;
                    }
  
                  }
  
                });
  
                lottery.candidates = candidates;
  
              }
  
              // 如果是稿件抽奖
              if(lottery.source=='douga'){
  
                // 是否注册过数据回调
                if(lottery.messageHandler){
                  window.clearInterval(lottery.messageHandler);
                  lottery.messageHandler = null;
  
                  // 清空候选
                  lottery.candidates = {};
                  lottery.startCandidates = [];
                  lottery.winners = [];
                }
  
  
                // 更新候选名单
                updateCandidates();
  
                // 注册数据回调（每30秒执行）
                /*lottery.messageHandler = window.setInterval(function(){
  
                  // 获取评论
                  vue.getCommentList(lottery.dougaList[lottery.dougaListActiveIndex], true, function(isSuccess, isFinish, commentCount, page, totalPage){
  
                    // 获取完毕
                    if(isFinish){
  
                      // 更新候选名单
                      updateCandidates();
  
  
                    }
  
                  });
  
                }, 30 * 1000);*/
  
  
              }
              // 直播间抽奖
              else{
                // 是否注册过数据回调
                if(lottery.messageHandler){
                  callbackManager.cancel(lottery.messageHandler);
                  lottery.messageHandler = null;
  
                  // 清空候选
                  lottery.candidates = {};
                  lottery.startCandidates = [];
                  lottery.winners = [];
  
                }
                // 注册数据回调
                lottery.messageHandler = callbackManager.register('message', function(data){
  
  
                  // 不符合参与方式
                  if(!(
                      (lottery.joinMethod.indexOf('danmaku')!=-1 && data.interaction.type=='danmaku')
                      || (lottery.joinMethod.indexOf('gift')!=-1 && data.interaction.type=='gift')
                      || (lottery.joinMethod.indexOf('like')!=-1 && data.interaction.type=='like')
                    )
                  ){
                    return;
                  }
  
                  // 如果参与方式是弹幕
                  if(data.interaction.type=='danmaku' && (lottery.joinKeyword && data.interaction.content.indexOf(lottery.joinKeyword)==-1)){
                    return;
                  }
                  // 如果参与方式是礼物
                  if(data.interaction.type=='gift' && (lottery.joinGiftList.length>0 && lottery.joinGiftList.indexOf(vue.giftNameMapper[data.interaction.giftName].id)==-1)){
                    return;
                  }
  
                  var pass = true;
                  // 如果设置了互斥抽奖
                  if(lottery.mutualLotteryList && lottery.mutualLotteryList.length>0){
  
  
                    _.filter(vue.lotteryTableData, function(o){return lottery.mutualLotteryList.indexOf(o.id)!=-1}).every(function(anotherLottery){
  
                      if(_.findIndex(anotherLottery.winners, {uid:data.uid})!=-1){
                        pass = false;
                        return false;
                      }
                      else{
                        return true;
                      }
  
                    });
  
                  }
  
                  if(!pass){
                    return;
                  }
  
                  // 第一次被侦测
                  if(!(data.uid in lottery.candidates)){
                    let candidate = {
                      uid : data.uid,
                      userName : data.userName,
                      photo : data.photo,
                      weight : 0,
                      index : Object.keys(lottery.candidates).length,
                    };
  
                    // 如果筛选了牌子
                    if(lottery.medalName && lottery.medalLevel){
                      vue.getCandidateInfo(candidate, (isSuccess, )=>{
  
                        if(candidate.medalName == lottery.medalName && candidate.medalLevel >= lottery.medalLevel){
                          lottery.candidates[data.uid] = candidate;
  
  
                          if(data.interaction.type=='danmaku'){
                            lottery.candidates[data.uid].weight += 1;
                          }
                          else if(data.interaction.type=='gift'){
                            lottery.candidates[data.uid].weight += vue.giftNameMapper[data.interaction.giftName].price * data.interaction.giftCount;
                          }
                          else if(data.interaction.type=='like'){
                            lottery.candidates[data.uid].weight += 0.5;
                          }
                        }
  
                      });
                    }
                    else{
                      lottery.candidates[data.uid] = candidate;
  
                      if(data.interaction.type=='danmaku'){
                        lottery.candidates[data.uid].weight += 1;
                      }
                      else if(data.interaction.type=='gift'){
                        lottery.candidates[data.uid].weight += vue.giftNameMapper[data.interaction.giftName].price * data.interaction.giftCount;
                      }
                      else if(data.interaction.type=='like'){
                        lottery.candidates[data.uid].weight += 0.5;
                      }
                    }
                  }
  
  
                });
              }
  
              var startLotteryTimeout = lottery.startTime - new Date();
              var countdownTimeout = startLotteryTimeout - lottery.countdown * 1000;
  
              // 是否已经注册过抽奖倒计时
              if(lottery.countdownHandler){
                window.clearTimeout(lottery.countdownHandler);
                lottery.countdownHandler = null;
              }
  
              if(lottery.countdown>0){
                lottery.countdownHandler = window.setTimeout(function(){
  
                  lottery.countdownHandler = null;
  
                  lottery.countdownText = `${lottery.countdown/60>=10?'':'0'}${_.floor(lottery.countdown/60)}:${lottery.countdown%60>=10?'':'0'}${lottery.countdown%60}`;
                  vue.activeLottery = lottery;
                  // 展示倒计时
                  vue.showLotteryCountdown(lottery);
  
  
                }, countdownTimeout);
              }
  
  
              // 是否已经注册过抽奖
              if(lottery.startHandler){
                window.clearTimeout(lottery.startHandler);
                lottery.startHandler = null;
              }
              lottery.startHandler = window.setTimeout(function(){
  
  
                // 清除数据回调
                if(lottery.source=='douga'){
                  window.clearInterval(lottery.messageHandler)
                }
                else{
                  callbackManager.cancel(lottery.messageHandler);
                }
                lottery.messageHandler = null;
                lottery.startHandler = null;
  
                vue.activeLottery = lottery;
                // 展示结果
                vue.showLotteryStart(lottery);
  
              }, startLotteryTimeout);
  
  
            },
  
            // 返回抽奖表格行类名
            lotteryTableRowClassName : function({row}){
              if(row.status == '未开始'){
                return 'lottery-status-unstart';
              }
              if(row.status == '已结束'){
                return 'lottery-status-finish';
              }
            },
            getCandidateInfo(candidate, callback){
  
              this.candidateInfoCallbacks.push([candidate, callback]);
            },
            // 获取用户信息
            _getCandidateInfo(candidate, callback){
              if(candidate.medalName){
                if(_.isFunction){
                  callback(true, candidate);
                }
                return;
              }
  
              commonRequrest(config.ACFUN_SERVER + config.URLS.ACFUN_USER.SPACE + `/${candidate.uid}`, 'get', null, true, function(isSuccess, data){
  
                // 获取成功
                if(isSuccess){
                  let medalDataJsonMatch = data.match(/data-medal='(?<medal>.+?)'/);
                  if(medalDataJsonMatch!=null){
                    let medalData = JSON.parse(medalDataJsonMatch.groups['medal']);
                    let medalColor = 'green';
                    if(medalData.level >= 1 && medalData.level <= 3){
                      medalColor = 'green';
                    }
                    else if(medalData.level >= 4 && medalData.level <= 6){
                      medalColor = 'blue';
                    }
                    else if(medalData.level >= 7 && medalData.level <= 9){
                      medalColor = 'orange';
                    }
                    else if(medalData.level >= 10 && medalData.level <= 12){
                      medalColor = 'red';
                    }
                    else if(medalData.level >= 13 && medalData.level <= 15){
                      medalColor = 'purple';
                    }
                    else if(medalData.level >= 16 && medalData.level <= 20){
                      medalColor = 'black';
                    }
                    Object.assign(candidate, {
                      medalName : medalData.clubName,
                      medalLevel : medalData.level,
                      medalColor : medalColor,
                    });
                  }
  
  
                  if(_.isFunction){
                    callback(true, candidate);
                  }
  
                }
                else{
  
                  if(_.isFunction){
                    callback(false, candidate);
                  }
                }
              });
            },
            // 开始倒计时
            showLotteryCountdown : function(lottery){
  
              var vue = this;
  
              this.lotteryStartDialogVisible = false;
              this.lotteryCountdownDialogVisible = true;
              this.$nextTick(function(){
                //circle start
                var progressBar = document.querySelector('.lottery-countdown-dialog .e-c-progress');
                var indicator = document.querySelector('.lottery-countdown-dialog #e-indicator');
                var pointer = document.querySelector('.lottery-countdown-dialog #e-pointer');
                var length = Math.PI * 2 * 100;
  
                progressBar.style.strokeDasharray = length;
  
                function update(value, timePercent) {
                  var offset = - length - length * value / (timePercent);
                  progressBar.style.strokeDashoffset = offset;
                  pointer.style.transform = `rotate(${360 * value / (timePercent)}deg)`;
                };
  
                //circle ends
                const displayOutput = document.querySelector('.lottery-countdown-dialog .display-remain-time')
  
                var intervalTimer;
                var timeLeft;
                var wholeTime = lottery.countdown; // manage this to set the whole time
                var isPaused = false;
                var isStarted = false;
  
  
                update(wholeTime,wholeTime); //refreshes progress bar
                displayTimeLeft(wholeTime);
  
                function changeWholeTime(seconds){
                  if ((wholeTime + seconds) > 0){
                    wholeTime += seconds;
                    update(wholeTime,wholeTime);
                  }
                }
  
  
                function timer (seconds){ //counts time, takes seconds
                  var remainTime = Date.now() + (seconds * 1000);
                  displayTimeLeft(seconds);
  
                  intervalTimer = window.setInterval(function(){
                    timeLeft = Math.round((remainTime - Date.now()) / 1000);
  
                    // 倒计时结束
                    if(timeLeft < 0){
                      window.clearInterval(intervalTimer);
                      isStarted = false;
  
                      // 隐藏对话框
                      vue.lotteryCountdownDialogVisible = false;
  
                      return ;
                    }
                    displayTimeLeft(timeLeft);
                  }, 1000);
                }
                function displayTimeLeft (timeLeft){ //displays time on the input
                  var minutes = Math.floor(timeLeft / 60);
                  var seconds = timeLeft % 60;
                  var displayString = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                  displayOutput.textContent = displayString;
                  update(timeLeft, wholeTime);
                }
  
                timer(wholeTime);
  
              });
            },
            // 开始抽奖
            showLotteryStart : function(lottery){
  
              var vue = this;
              var stop = false;
              lottery.activeIndex = -1;
  
              this.lotteryCountdownDialogVisible = false;
              var rollIntervalHandler = null;
  
              // 候选人数为0
              if(Object.keys(lottery.candidates).length == 0){
  
                this.$message({
                  type : 'info',
                  message : '无参与抽奖人员',
                });
  
                lottery.winners = _.flatMap(lottery.candidates);
                lottery.status = '已结束';
                this.handleLotteryWinnersCheck(lottery);
  
                return;
  
              }
  
  
              function roll(){
                if(stop){
                  // 获取当前赢家
                  // vue.$refs.carousel.setActiveItem(_.findIndex(lottery.startCandidates, {uid:lottery.winners[lottery.winners.length-1].uid}));
  
                }
                else{
                  vue.$refs.carousel.next();
                }
              }
  
              function changeRollIntervals(intervals, timeouts, callback){
  
                if(!timeouts){
                  timeouts = 0;
                }
  
                if(!_.isArray(intervals)){
                  intervals = [intervals];
                }
                if(!_.isArray(timeouts)){
                  timeouts = [timeouts];
  
                  if(timeouts.length>intervals.length){
                    timeouts = timeouts.slice(0, intervals.length);
                  }
                  if(timeouts.length<intervals.length){
                    var npads = intervals.length-timeouts.length;
                    for(var i=0;i<npads;++i){
                      timeouts.splice(0, 0, 0);
                    }
                  }
  
                }
  
                intervals.forEach(function(interval, index){
                  window.setTimeout(function(){
                    if(rollIntervalHandler!=null){
                      window.clearTimeout(rollIntervalHandler);
                    }
                    if(interval != null){
                      rollIntervalHandler = window.setInterval(roll, interval);
                    }
                    else{
  
                      stop = true;
  
                      vue.$nextTick(function(){
                        vue.$refs.carousel.$nextTick(function(){
  
                          // 获取当前赢家
                          lottery.activeIndex = vue.$refs.carousel.activeIndex;
                          // 高亮
                          lottery.startCandidates[lottery.activeIndex].highlight = true;
  
                          vue.$refs.carousel.$nextTick(function(){
                            // 停止回调
                            if(_.isFunction(callback)){
                              callback();
                            }
                          });
                        });
                      });
  
  
                    }
                  }, timeouts[index]);
  
                });
  
              }
  
              // 当前滚动名单
              vue.$set(lottery, 'startCandidates', _.flatMap(lottery.candidates));
  
              this.$nextTick(function(){
  
                var startChoose = function(){
  
                  lottery.rolling = true;
  
                  // 获取中奖者
                  vue.lotteryStartDialogVisible = true;
                  stop = false;
  
                  // 8秒内需要滚动完所有用户
                  var interval = Math.min(Math.max(Math.floor(8000/lottery.startCandidates.length), 150), 350);
  
                  // 高速转动
                  // 10秒后停止转动
                  changeRollIntervals(
                    [interval, null],
                    [0, 10000],
                    // 转动结束后获取当前用户
                    function(){
  
                      lottery.rolling = false;
  
                    },
                  );
  
                };
  
                function checkWinner(valid){
  
                  // 去除高亮
                  lottery.startCandidates[lottery.activeIndex].highlight = false;
  
                  // 删除候选
                  let candidate = lottery.startCandidates.splice(lottery.activeIndex, 1)[0];
                  // 删除候选
                  delete lottery.candidates[candidate.uid];
  
                  // 如果有效，添加入赢家
                  if(valid){
                    // 添加赢家
                    lottery.winners.push(candidate);
                  }
  
  
                  lottery.winnerCount = lottery.winners.length;
  
                }
  
                // 设置抽奖结束函数
                lottery.finishFunc = function(){
  
                  if(lottery.rolling){
                    return;
                  }
  
                  checkWinner(true);
  
                  lottery.status = '已结束';
                  // 关闭弹窗
                  vue.lotteryStartDialogVisible = false;
                  // 打开中奖名单
                  vue.handleLotteryWinnersCheck(lottery);
  
                };
  
                // 设置继续抽奖函数
                lottery.nextFunc = function(valid){
  
                  if(lottery.rolling){
                    return;
                  }
  
                  // 查看候选人数是否足够
                  if(valid && lottery.startCandidates.length == 0){
                    vue.$message({
                      type : 'error',
                      message : '人数不足，无法抽奖'
                    });
                    return;
                  }
  
                  checkWinner(valid);
  
                  // 关闭弹窗
                  // vue.lotteryStartDialogVisible = false;
                  vue.activeLottery = {};
                  vue.$nextTick(function(){
                    // 1秒后重新开始
                    window.setTimeout(function(){
                      // 打乱顺序
                      vue.$set(lottery, 'startCandidates', _.shuffle(lottery.startCandidates));
                      vue.$nextTick(function(){
                        lottery.activeIndex = -1;
                        vue.activeLottery = lottery;
                        startChoose();
                      });
                    }, 1000);
                  });
  
                };
  
  
                // 开始抽奖
                startChoose();
  
  
  
              });
  
  
            },
            // 导出中奖名单
            exportLottery : function(){
  
              var workbook = new ExcelJS.Workbook();
              var sheet = workbook.addWorksheet('中奖名单');
              sheet.columns = [
                { key: 'userName', width: 30, },
                { key: 'uid', width: 10, },
              ];
  
              var rowIndex = 1;
              // 遍历所有已结束的抽奖
              this.lotteryTableData.forEach(function(lottery){
  
                if(lottery.status != '已结束'){
                  return true;
                }
  
                // 添加标题
                sheet.addRow([lottery.name]);
                sheet.mergeCells(rowIndex,1,rowIndex,2);
                // 设置标题样式
                var titleRow = sheet.getRow(rowIndex);
                var titleCell = titleRow.getCell(1);
                // 文字居中
                titleCell.alignment = {vertical: 'middle', horizontal: 'center'};
                // 添加边框
                titleCell.border = {
                  top: {style:'thin'},
                  left: {style:'thin'},
                  bottom: {style:'thin'},
                  right: {style:'thin'},
                };
                // 加粗字体
                titleCell.font = {
                  bold : true,
                };
  
  
                sheet.addRow({userName: '用户名', uid : '用户uid'});
                // 设置列名样式
                var headerRow = sheet.getRow(rowIndex + 1);
                for(var i=1;i<=2;++i){
                  headerRow.getCell(i).alignment = {vertical: 'middle', horizontal: 'center'};
                  headerRow.getCell(i).border = {
                    top: {style:'thin'},
                    left: {style:'thin'},
                    bottom: {style:'thin'},
                    right: {style:'thin'},
                  };
                }
  
                // 遍历中奖用户
                lottery.winners.forEach(function(winner, index){
                  sheet.addRow({userName: winner.userName, uid : winner.uid});
  
                  // 设置记录样式
                  var recordRow = sheet.getRow(rowIndex + 2 + index);
                  for(var i=1;i<=2;++i){
                    recordRow.getCell(i).alignment = {vertical: 'middle', horizontal: 'center'};
                    recordRow.getCell(i).border = {
                      top: {style:'thin'},
                      left: {style:'thin'},
                      bottom: {style:'thin'},
                      right: {style:'thin'},
                    };
                  }
                });
  
                // 添加两个空白行
                sheet.addRow();
                sheet.addRow();
  
                rowIndex += 1 + 1 + lottery.winners.length + 2;
  
              });
  
              ;(async function(){
                var buffer = await workbook.xlsx.writeBuffer();
                var file = new File([buffer], '中奖名单.xlsx');
                saveAs(file);
              })();
  
            },
  
            // 语音配置表单提交
            handleAudioFormSubmit : function(){
  
              var vue = this;
  
              this.$refs.audioForm.validate((valid) => {
                // 通过校验
                if(valid){
                  // 提交修改
                  GM_setValue('audioFormData', JSON.stringify({
                    voice : this.audioFormData.voice,
                    enable : this.audioFormData.enable,
                    speechRate : this.audioFormData.speechRate,
                    speechVolume : this.audioFormData.speechVolume,
                    joinMethod : this.audioFormData.joinMethod,
                    danmakuFormat : this.audioFormData.danmakuFormat,
                    likeFormat : this.audioFormData.likeFormat,
                    giftFormat : this.audioFormData.giftFormat,
                    enterroomFormat : this.audioFormData.enterroomFormat,
                    followFormat : this.audioFormData.followFormat,
                    danmakuTimeout : this.audioFormData.danmakuTimeout,
                    likeTimeout : this.audioFormData.likeTimeout,
                    giftTimeout : this.audioFormData.giftTimeout,
                    enterroomTimeout : this.audioFormData.enterroomTimeout,
                    followTimeout : this.audioFormData.followTimeout,
  
                    consumeing : false,
                    interactions : [],
                    messageBuffer : {},
  
                  }));
  
                  this.handleAudioFormSubmitValid();
  
                }
              });
  
            },
            handleAudioFormSubmitValid : function(){
              var vue = this;
              // 检测当前是否有缓冲
              for(var bufferKey in this.audioFormData.messageBuffer){
                window.clearTimeout(this.audioFormData.messageBuffer[bufferKey].handler);
              }
  
              this.audioFormData.messageBuffer = {};
  
              // 检测是否已经添加了语音播报
              if(this.audioFormData.messageHandler){
                callbackManager.cancel(this.audioFormData.messageHandler);
                this.audioFormData.messageHandler = null;
              }
  
              // 开启播报
              if(this.audioFormData.enable){
                this.audioFormData.messageHandler = callbackManager.register('message', function(data){
  
                  // 不是允许的互动类型
                  if(vue.audioFormData.joinMethod.indexOf(data.interaction.type)==-1){
                    return;
                  }
  
                  var bufferKey = null;
                  var timeout = 0;
                  if(data.interaction.type=='gift'){
                    bufferKey = data.uid + data.interaction.type + data.interaction.giftName;
                    timeout = vue.audioFormData.giftTimeout;
                  }
  
                  // 不进行缓存，直接播报
                  if(bufferKey==null || timeout == 0){
                    data.interaction = [data.interaction];
                    vue.consumeAudio(vue.audioFormData, data);
                    return;
                  }
  
                  // 已有相同信息
                  if(bufferKey in vue.audioFormData.messageBuffer){
                    window.clearTimeout(vue.audioFormData.messageBuffer[bufferKey].handler);
                    vue.audioFormData.messageBuffer[bufferKey].interaction.push(data.interaction);
                  }
                  else{
                    vue.audioFormData.messageBuffer[bufferKey] = {
                      uid : data.uid,
                      userName : data.userName,
                      interaction : [data.interaction],
                    };
                  }
                  vue.audioFormData.messageBuffer[bufferKey].handler = window.setTimeout(function(){
                    var data = vue.audioFormData.messageBuffer[bufferKey];
                    vue.audioFormData.messageBuffer[bufferKey].handler = null;
                    delete vue.audioFormData.messageBuffer[bufferKey];
                    vue.consumeAudio(vue.audioFormData, data);
                  }, timeout*1000);
                });
              }
  
              // 关闭弹窗
              this.audioFormDialogVisible = false;
            },
            // 字体选择回调
            handleFontSelectChange : function(value){
              this.addFont(value[value.length-1]);
            },
            // 新增预设
            addInteractionPreset: function(item){
              this.interactionPreset.push(_.cloneDeep(item));
              this.interactionPreset[this.interactionPreset.length-1].index = this.interactionPreset.length;
              this.interactionPreset[this.interactionPreset.length-1].hotkey = this.interactionPreset.length<=9?`ctrl+alt+${this.interactionPreset.length}`:'预设过多，无法激活';
              return this.interactionPreset[this.interactionPreset.length-1];
            },
            // 编辑预设
            editInteractionPreset: function(item){
              console.log('edit', item)
              this.interactionPreset[item.index-1] = _.cloneDeep(item);
              return this.interactionPreset[item.index-1];
            },
            // 激活某一预设
            activeInteractionPreset: function(item){
              for(var preset of this.interactionPreset){
                preset.active = false;
              }
              item.active = true;
              console.log('item', item)
              this.interactionFormData = _.cloneDeep(item);
              this.handleInteractionFormSubmitValid();
            },
            // 删除某一预设
            removeInteractionPreset: function(item){
              this.$confirm(`确定删除预设：${item.name}`, '是否删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              }).then(() => {
                this.interactionPreset.splice(item.index-1, 1);
                this.interactionPreset.forEach(function(item, index){
                  item.index = index + 1;
                  item.hotkey = index<9?`ctrl+alt+${index+1}`:'预设过多，无法激活';
                });
  
                // 提交修改
                GM_setValue('interactionPreset', JSON.stringify(vue.interactionPreset));
  
              });
            },
            // 打开弹幕配置表单
            handleInteractionFormOpen(item){
              var vue = this;
  
              // 新增预设
              if(item==null){
                this.interactionFormData.name = "";
                this.interactionFormData.index = null;
              }
              // 编辑预设
              else{
                this.activeInteractionPreset(item);
              }
              this.interactionFormDialogVisible = true;
            },
            // 重置配置表单
            handleInteractionFormInit: function(){
              this.interactionFormData = {
                ...this.interactionFormData,
                ..._.cloneDeep(this.interactionFormDataInit),
              };
            },
            // 弹幕配置表单提交
            handleInteractionFormSubmit : function(){
  
              var vue = this;
  
              this.$refs.interactionForm.validate((valid) => {
                // 通过校验
                if(valid){
  
                  var fontName = vue.interactionFormData.fontFamily[vue.interactionFormData.fontFamily.length-1];
  
                  if(fontName!='inherit'){
                    // 添加缓存
                    GM_setValue('downloadedFonts', vue.downloadedFonts);
                  }
  
                  var preset = null;
                  // 编辑
                  if(vue.interactionFormData.index!=null){
                    preset = vue.editInteractionPreset(vue.interactionFormData);
                  }
                  // 新增
                  else{
                    preset = vue.addInteractionPreset(vue.interactionFormData);
                  }
  
                  console.log('submit', preset)
                  vue.activeInteractionPreset(preset);
                  vue.interactionFormDialogVisible = false;
  
  
  
                  // 提交修改
                  GM_setValue('interactionPreset', JSON.stringify(vue.interactionPreset));
                }
              });
  
            },
            handleInteractionFormSubmitValid : function(){
  
              var vue = this;
  
              if(vue.interactionFormData.enable){
  
  
                vue.interactionFormData.modifyContentFunc = function(data){
  
                  if(data.interaction.type == 'gift'){
                    data.interaction.content = formatText(vue.interactionFormData.giftFormat, {
                      '礼物名称' : data.interaction.giftName,
                    });
                  }
                  else if(data.interaction.type == 'enterroom'){
                    data.interaction.content = vue.interactionFormData.enterroomFormat;
                  }
                  else if(data.interaction.type == 'like'){
                    data.interaction.content = vue.interactionFormData.likeFormat;
                  }
                  else if(data.interaction.type == 'follow'){
                    data.interaction.content = vue.interactionFormData.followFormat;
                  }
                  else if(data.interaction.type == 'joinclub'){
                    data.interaction.content = vue.interactionFormData.joinclubFormat;
                  }
  
                }
  
  
                if(vue.interactionFormData.cleanInteractionHistoryHandler){
  
                  window.clearInterval(vue.interactionFormData.cleanInteractionHistoryHandler);
  
                }
  
                // 清除弹幕历史
                vue.interactionFormData.cleanInteractionHistoryHandler = window.setInterval(function(){
  
  
                  let historyMinuteStartIndex = 0;
                  let historyCountStartIndex = vue.messageData.length - vue.interactionFormData.historyCount;
                  let sendTimeLower = new Date();
                  sendTimeLower.setMinutes(sendTimeLower.getMinutes()-vue.interactionFormData.historyMinutes);
  
                  vue.messageData.every(function(message, messageIndex){
  
                    if(message.interaction.sendTime>=sendTimeLower){
                      historyMinuteStartIndex = messageIndex;
                      return false;
                    }
                    else{
                      return true;
                    }
  
                  });
  
                  let historyStartIndex = Math.max(0, Math.max(historyMinuteStartIndex, historyCountStartIndex));
  
                  if(historyStartIndex==0){
                    return;
                  }
                  else{
                    vue.messageData.splice(0, historyStartIndex);
                  }
  
  
  
  
                }, 5 * 1000);
  
              }
              else{
                vue.interactionFormData.modifyContentFunc = null;
                window.clearInterval(vue.interactionFormData.cleanInteractionHistoryHandler);
              }
  
            },
  
            consumeAudio(audioFormData, interactionData){
  
              var vue = this;
  
              // 弹幕合并
              if(interactionData.interaction[0].type == 'danmaku'){
                interactionData.interaction = {
                  type : 'danmaku',
                  content : _.reduce(interactionData.interaction, function(text, interaction){
                      return text + (text==''?'':'<break time=\"500ms\"/>') + interaction.content;
                    }, ''),
                };
  
              }
              // 礼物合并
              else if(interactionData.interaction[0].type == 'gift'){
                // 有连击
                let findIndex = _.findIndex(interactionData.interaction, {'doAnime': true});
                interactionData.interaction = {
                  type : 'gift',
                  giftName : interactionData.interaction[0].giftName,
                  giftCount : findIndex==-1?_.sumBy(interactionData.interaction, 'giftCount'):interactionData.interaction[findIndex].giftCount,
                }
  
              }
              // 其他合并
              else{
                interactionData.interaction = interactionData.interaction[0];
              }
  
              audioFormData.interactions.push(interactionData);
              if(audioFormData.consumeing){
                return;
              }
              audioFormData.consumeing = true;
  
              new Promise(function(resolve, reject) {
  
                var readInteractionAudio = function(){
  
                  // 如果停止了语音
                  if(!audioFormData.enable){
                    audioFormData.interactions = [];
                    resolve();
                    return;
                  }
  
                  if(audioFormData.interactions.length==0){
                    audioFormData.consumeing = false;
                    resolve();
                    return;
                  }
  
                  var interactionData = audioFormData.interactions.splice(0, 1)[0];
                  vue.readInteractionAudio(audioFormData, interactionData, readInteractionAudio);
  
  
                }
  
                readInteractionAudio();
  
  
              }).then(function(){
  
              }).catch(function(err){
              });
  
  
            },
  
            readInteractionAudio(audioFormData, interactionData, callback){
  
  
              // 弹幕
              if(interactionData.interaction.type == 'danmaku'){
                nls(`<speak>${audioFormData.danmakuFormat}</speak>`, audioFormData.voice[audioFormData.voice.length-1], audioFormData.speechRate - 500, audioFormData.speechVolume, {
                  '用户名' : interactionData.userName + '<break time=\"500ms\"/>',
                  '弹幕内容' : '<break time=\"500ms\"/>' + interactionData.interaction.content,
                }, callback);
              }
              // 礼物
              else if(interactionData.interaction.type == 'gift'){
                nls(`<speak>${audioFormData.giftFormat}</speak>`, audioFormData.voice[audioFormData.voice.length-1], audioFormData.speechRate - 500, audioFormData.speechVolume, {
                  '用户名' : interactionData.userName + '<break time=\"500ms\"/>',
                  '礼物数量' : interactionData.interaction.giftCount,
                  '礼物名称' : interactionData.interaction.giftName,
                }, callback);
              }
              // 点赞
              else if(interactionData.interaction.type == 'like'){
                nls(`<speak>${audioFormData.likeFormat}</speak>`, audioFormData.voice[audioFormData.voice.length-1], audioFormData.speechRate - 500, audioFormData.speechVolume, {
                  '用户名' : interactionData.userName + '<break time=\"500ms\"/>',
                }, callback);
              }
              // 进入直播间
              else if(interactionData.interaction.type == 'enterroom'){
                nls(`<speak>${audioFormData.enterroomFormat}</speak>`, audioFormData.voice[audioFormData.voice.length-1], audioFormData.speechRate - 500, audioFormData.speechVolume, {
                  '用户名' : interactionData.userName + '<break time=\"500ms\"/>',
                }, callback);
              }
              // 关注
              else if(interactionData.interaction.type == 'follow'){
                nls(`<speak>${audioFormData.followFormat}</speak>`, audioFormData.voice[audioFormData.voice.length-1], audioFormData.speechRate - 500, audioFormData.speechVolume, {
                  '用户名' : interactionData.userName + '<break time=\"500ms\"/>',
                }, callback);
              }
              else{
                callback();
              }
  
            },
  
  
            // 竞猜表单提交回调
            handleGuessFormSubmit : function(){
  
              var vue = this;
  
              this.$refs.form.validate((valid) => {
                // 通过校验
                if(valid){
  
                  // 添加id
                  vue.guessFormData.id = uuidv4();
  
                  vue.guessTableData.splice(0, 0, vue.guessFormData);
  
                  vue.guessFormDialogVisible = false;
                  vue.guessFormData = _.cloneDeep(vue.guessFormDataDefault);
  
                  vue.$message({
                    message : '添加竞猜成功',
                    type : 'info',
                    duration : 2000,
                  });
  
                  // 进入竞猜
                  vue.openGuessStartDialog(vue.guessTableData[0]);
  
                }
                else{
  
                  this.$message({
                    message : '提交失败，请检查是否填写正确',
                    type : 'error',
                  });
                }
              });
            },
  
            // 竞猜开始下一个问题回调
            handleGuessDanmakuSubmit : function(){
  
  
              var vue = this;
  
              this.guessDanmakuDialogVisible = true;
  
              this.$nextTick(function(){
                this.activeGuess.guessDanmakuList = [];
  
                var danmakuList = [];
                var danmakuUserMapper = {};
                var danmakuContentMapper = {};
                var hoverDanmakuItem = null;
  
                var randomId = uuidv4();
  
                // 随机给定一个id
                var containerEle = document.querySelector('.guess-danmaku-dialog .guess-danmaku-container');
                containerEle.setAttribute('id', 'R' + randomId);
  
                this.activeGuess.danmaku = new EasyDanmaku({
                  el: `#R${randomId}`,
                  // 彩色弹幕
                  colourful : false,
                  // 弹幕行数
                  line : 10,
                  // 弹幕样式
                  wrapperStyle : 'guess-danmaku-danmu',
                  // 弹幕播放速度
                  speed : 3,
                  // 播放一次时长
                  runtime : 3,
                  // 鼠标悬浮暂停
                  hover : true,
                  coefficient : 5,
                });
  
  
                // 添加监听
                this.activeGuess.messageHandler = callbackManager.register('command:提问', function(data){
                  // 非弹幕
                  if(data.interaction.type != 'danmaku'){
                    return;
                  }
  
                  // 只有一次提问机会
                  if(data.uid in danmakuUserMapper){
                    return;
                  }
  
                  // 不允许重复提问
                  if(data.interaction.content in danmakuContentMapper){
                    return;
                  }
  
                  // 达到单个用户可提问上限
                  if(vue.activeGuess.maxGuessPerUser>0){
                    if(_.filter(vue.activeGuess.guessList, {uid:data.uid}).length>=vue.activeGuess.maxGuessPerUser){
                      return;
                    }
                  }
  
                  var danmakuItem = _.cloneDeep(data);
                  danmakuList.push(danmakuItem);
                  vue.activeGuess.danmaku.send(danmakuItem.interaction.content);
                  danmakuItem.sendTime = new Date();
                  danmakuUserMapper[danmakuItem.uid] = true;
                  danmakuContentMapper[danmakuItem.interaction.content] = danmakuItem;
  
                });
  
  
                // 鼠标事件回调
                $('.guess-danmaku-container').on('mouseenter', '.guess-danmaku-danmu', function(e){
                  var danmakuItem = danmakuContentMapper[e.target.innerText];
                  if(danmakuItem){
                    danmakuItem.hover = true;
                    hoverDanmakuItem = danmakuItem;
  
                    // 如果是手动选择模式，添加class
                    if(vue.activeGuess.chooseWay == 'manual'){
                      e.target.classList.add('is-select');
                    }
  
                  }
                });
                $('.guess-danmaku-container').on('mouseout', '.guess-danmaku-danmu', function(e){
                  if(hoverDanmakuItem){
                    hoverDanmakuItem.hover = false;
                    hoverDanmakuItem.sendTime = new Date();
                    hoverDanmakuItem = null;
  
                    // 如果是手动选择模式，删除class
                    if(vue.activeGuess.chooseWay == 'manual'){
                      e.target.classList.remove('is-select');
                    }
                  }
                });
                $('.guess-danmaku-container').on('click', '.guess-danmaku-danmu', function(e){
                  // 只有挑选方式为手动时才可点击
                  if(hoverDanmakuItem && vue.activeGuess.chooseWay == 'manual'){
  
                    // 暂停播放
                    vue.activeGuess.danmaku.pause();
  
                    var hoverDanmakuItem_ = hoverDanmakuItem;
  
                    hoverDanmakuItem_.guess = hoverDanmakuItem_.interaction.content;
  
                    vue.$confirm(`${hoverDanmakuItem_.guess}${hoverDanmakuItem_.guess.endsWith('?')?'':'?'}`, '是否命中', {
                      confirmButtonText: '命中',
                      cancelButtonText: '未命中',
                      closeOnClickModal : false,
                      closeOnPressEscape : false,
                    }).then(() => {
                      hoverDanmakuItem_.isValid = true;
                      hoverDanmakuItem_.index = vue.activeGuess.guessIndex;
                      vue.activeGuess.guessIndex += 1;
  
                      vue.activeGuess.guessList.splice(0, 0, hoverDanmakuItem_);
                      vue.activeGuess.matchGuessList.splice(0, 0, hoverDanmakuItem_);
                      // 关闭弹窗
                      vue.guessDanmakuDialogVisible = false;
                    }).catch((action) => {
                      if(action=='cancel'){
                        hoverDanmakuItem_.isValid = false;
                        hoverDanmakuItem_.index = vue.activeGuess.guessIndex;
                        vue.activeGuess.guessIndex += 1;
  
                        vue.activeGuess.guessList.splice(0, 0, hoverDanmakuItem_);
                        // 关闭弹窗
                        vue.guessDanmakuDialogVisible = false;
                      }
                      else{
  
                      }
                    });
  
                  }
                });
  
                // 开启轮询
                this.activeGuess.danmakuLoopHandler = window.setInterval(function(){
  
                  var now = new Date();
                  var findIndex = _.findIndex(danmakuList, function(danmaku){
  
                    // 距离上次发送已经超过5秒
                    return now - danmaku.sendTime >= 3*1000 && !danmaku.hover;
  
                  });
  
                  if(findIndex != -1){
                    vue.activeGuess.danmaku.send(danmakuList[findIndex].interaction.content);
                    danmakuList[findIndex].sendTime = now;
                  }
  
  
                }, 50);
  
  
  
                // 如果是随机选择，随机选中
                if(vue.activeGuess.chooseWay == 'random'){
                  var now = new Date();
                  // 竞猜问题倒计时结束
                  vue.activeGuess.handleGuessDanmakuCountdownFinish = function(){
  
                    // 暂停随机选中
                    window.clearInterval(vue.activeGuess.randomSelectHandler);
                    // 暂停弹幕
                    vue.activeGuess.danmaku.pause();
  
                    // 获取选中
                    var selectedEle = containerEle.querySelector('.is-select');
  
                    // 未选中信息
                    if(selectedEle==null){
                      vue.$message({
                        type : 'error',
                        message : '无法选中弹幕信息，本次问题获取失败',
                      });
                      // 关闭弹窗
                      vue.guessDanmakuDialogVisible = false;
  
                    }
                    else{
                      // 获取对应弹幕信息
                      var danmakuItem = danmakuContentMapper[selectedEle.innerText];
  
                      danmakuItem.guess = danmakuItem.interaction.content;
  
                      vue.$confirm(`${danmakuItem.guess}${danmakuItem.guess.endsWith('?')?'':'?'}`, '是否命中', {
                        distinguishCancelAndClose : true,
                        confirmButtonText: '命中',
                        cancelButtonText: '未命中',
                        closeOnClickModal : false,
                        closeOnPressEscape : false,
                      }).then(() => {
                        danmakuItem.isValid = true;
                        // 添加序号
                        danmakuItem.index = vue.activeGuess.guessIndex;
                        vue.activeGuess.guessIndex += 1;
  
                        vue.activeGuess.guessList.splice(0, 0, danmakuItem);
                        vue.activeGuess.matchGuessList.splice(0, 0, danmakuItem);
                        // 关闭弹窗
                        vue.guessDanmakuDialogVisible = false;
                      }).catch((action ) => {
                        // 未命中
                        if(action=='cancel'){
                          danmakuItem.isValid = false;
                          danmakuItem.index = vue.activeGuess.guessIndex;
                          vue.activeGuess.guessIndex += 1;
                          vue.activeGuess.guessList.splice(0, 0, danmakuItem);
                          // 关闭弹窗
                          vue.guessDanmakuDialogVisible = false;
                        }
                        else{
                        }
                      });
                    }
  
                  };
                  vue.activeGuess.randomSelectHandler = window.setInterval(function(){
  
                    // 删除已选中
                    var selectedEle = containerEle.querySelector('.is-select');
                    if(selectedEle){
                      selectedEle.classList.remove('is-select');
                    }
  
                    if(containerEle.children.length>0){
  
                      // 如果未有选中，或者没有兄弟节点，则选中第一个
                      if(selectedEle==null || selectedEle.nextElementSibling==null){
                        selectedEle =  containerEle.children[0];
                      }
                      // 否则选中下一个
                      else{
                        selectedEle = selectedEle.nextElementSibling;
                      }
  
                      selectedEle.classList.add('is-select');
                    }
  
                  }, 100);
  
                  vue.$refs.guessDanmakuDialog.$nextTick(function(){
                    // 倒计时文字
                    $('#guess-danmaku-countdown-text')
                      .countdown(new Date().getTime() + vue.activeGuess.countdown*1000, function(event){$(this).html(event.strftime('【%M:%S】'))})
                      .on('finish.countdown', vue.activeGuess.handleGuessDanmakuCountdownFinish);
  
                  });
  
                }
  
  
              });
            },
  
            openGuessStartDialog : function(guessFormData){
  
              var vue = this;
  
              this.guessStartDialogVisible = true;
              this.activeGuess = guessFormData;
  
              var danmakuContentMapper = {};
              var isInDirectGuess = false;
  
              // 监听狙击消息
              this.activeGuess.directGuessMessageHandler = callbackManager.register('command:狙击', function(data){
                // 当前是否位于狙击状态
                if(isInDirectGuess){
                  return;
                }
  
                // 非弹幕
                if(data.interaction.type != 'danmaku'){
                  return;
                }
  
                // 已结束竞猜
                if(vue.activeGuess.status != '进行中'){
                  return;
                }
  
                // 达到狙击总上限
                if(vue.activeGuess.maxDirectGuess > 0 && vue.activeGuess.directGuessList.length>=vue.activeGuess.maxDirectGuess){
                  return;
                }
  
                // 达到单个用户可狙击上限
                if(vue.activeGuess.maxDirectGuessPerUser>0 && _.filter(vue.activeGuess.directGuessList, {uid:data.uid}).length >= vue.activeGuess.maxDirectGuessPerUser ){
                  return;
                }
  
                // 不允许重复提问
                if(data.interaction.content in danmakuContentMapper){
                  return;
                }
  
                isInDirectGuess = true;
                var danmakuItem = _.cloneDeep(data);
                danmakuItem.guess = data.interaction.content;
                danmakuItem.sendTime = new Date();
                danmakuContentMapper[danmakuItem.interaction.content] = danmakuItem;
  
                // 打开询问
                vue.$confirm(`${danmakuItem.guess}${danmakuItem.guess.endsWith('?')?'':'?'}`, '狙击！是否命中？', {
                  confirmButtonText: '命中',
                  cancelButtonText: '未命中',
                  closeOnClickModal : false,
                  closeOnPressEscape : false,
                }).then(() => {
                  danmakuItem.isValid = true;
                  danmakuItem.index = vue.activeGuess.guessIndex;
                  vue.activeGuess.guessIndex += 1;
  
                  vue.activeGuess.directGuessList.splice(0, 0, danmakuItem);
                  // 关闭弹窗
                  vue.guessDanmakuDialogVisible = false;
                  isInDirectGuess = false;
  
                  vue.activeGuess.winner = danmakuItem;
                  // 修改状态
                  vue.activeGuess.status = '竞猜成功';
                  vue.$message({
                    type : 'info',
                    message : '竞猜成功！',
                  });
  
                }).catch((action) => {
                  if(action=='cancel'){
                    danmakuItem.isValid = false;
                    danmakuItem.index = vue.activeGuess.guessIndex;
                    vue.activeGuess.guessIndex += 1;
  
                    vue.activeGuess.directGuessList.splice(0, 0, danmakuItem);
                    isInDirectGuess = false;
  
                    // 达到狙击上限，竞猜失败
                    if(vue.activeGuess.maxDirectGuess>0 && vue.activeGuess.maxDirectGuess<=vue.activeGuess.directGuessList.length){
                      // 修改状态
                      vue.activeGuess.status = '竞猜失败';
                      vue.$message({
                        type : 'error',
                        message : '竞猜失败！',
                      });
                    }
  
                  }
                  else{
  
                  }
                });
  
              });
  
            },
            // 竞猜弹幕弹窗关闭回调
            handleGuessDanmakuDialogClose : function(){
  
              delete this.activeGuess.danmaku;
  
              if(this.activeGuess.messageHandler){
                callbackManager.cancel(this.activeGuess.messageHandler);
                this.activeGuess.messageHandler = null;
              }
  
              window.clearInterval(this.activeGuess.danmakuLoopHandler);
              this.activeGuess.danmakuLoopHandler = null;
  
              if(this.activeGuess.randomSelectHandler){
                window.clearInterval(this.activeGuess.randomSelectHandler);
                this.activeGuess.randomSelectHandler = null;
              }
              if(this.activeGuess.handleGuessDanmakuCountdownFinish){
                this.activeGuess.handleGuessDanmakuCountdownFinish = null;
              }
            },
            // 竞猜详情弹窗关闭
            handleGuessStartDialogClose : function(){
              // 关闭狙击消息获取
              if(this.activeGuess.directGuessMessageHandler){
                callbackManager.cancel(this.activeGuess.directGuessMessageHandler);
                this.activeGuess.directGuessMessageHandler = null;
              }
  
              this.activeGuess = null;
  
            },
  
            // 获取投稿数据
            getDougaList(){
  
              var vue = this;
  
              var pageSize = null;
              if(this.lotteryFormData.dougaType == 'video'){
                pageSize = 10;
              }
              else if(this.lotteryFormData.dougaType == 'article'){
                pageSize = 10;
              }
  
              var params = {
                'quickViewId' : `ac-space-${this.lotteryFormData.dougaType}-list`,
                'reqID': this.reqId,
                'ajaxpipe': 1,
                'type': this.lotteryFormData.dougaType,
                'order': 'newest',
                'page' : this.lotteryFormData.dougaListPage,
                'pageSize': pageSize,
              };
  
              this.reqId += 1;
              vue.lotteryFormData.dougaListLoading = true;
              commonRequrest(config.ACFUN_SERVER + config.URLS.ACFUN_USER.SPACE + `/${this.uid}`, 'get', params, true, function(isSuccess, data){
  
  
                // 获取成功
                if(isSuccess){
  
  
                  document.querySelector('#douga-result').innerHTML = JSON.parse(data.replace('/*<!-- fetch-stream -->*/', ''))['html'];
  
                  var dougaEleList = null;
  
                  // 查看视频投稿
                  if(params.type == 'video'){
                    dougaEleList = document.querySelectorAll('#douga-result #ac-space-video-list a');
                  }
                  // 查看文章投稿
                  else if(params.type == 'article'){
                    dougaEleList = document.querySelectorAll('#douga-result #ac-space-article-list article');
                  }
  
  
                  // 无结果
                  if(!dougaEleList || dougaEleList.length==0){
                    vue.lotteryFormData.dougaListDisabled = true;
                    vue.lotteryFormData.dougaListNoMore = true;
                  }
                  else{
  
                    var dougaList = [];
  
                    // 视频投稿
                    if(params.type == 'video'){
  
                      dougaEleList.forEach(function(dougaEle){
  
                        dougaList.push({
                          id : dougaEle.attributes.href.value.split('/').pop().replace('ac', ''),
                          href : config.ACFUN_SERVER + dougaEle.attributes.href.value,
                          cover : dougaEle.querySelector('img').src,
                          title : dougaEle.querySelector('figcaption .title').title,
                          uploadDateText : dougaEle.querySelector('figcaption .date').innerText,
                          playCountText : dougaEle.querySelector('figcaption .play-info').innerText.match(/观看(?<count>[0-9\.万]+)/).groups['count'],
                        });
                      });
  
                    }
                    // 文章投稿
                    else if(params.type == 'article'){
  
                      dougaEleList.forEach(function(dougaEle){
  
  
                        dougaList.push({
                          id : dougaEle.querySelector('a').attributes.href.value.split('/').pop().replace('ac', ''),
                          href : config.ACFUN_SERVER + dougaEle.querySelector('a').attributes.href.value,
                          title : dougaEle.querySelector('a').title,
                          uploadDateText : dougaEle.querySelector('.info').innerText.match(/发布于\s*(?<date>\d{4}\/\d{2}\/\d{2})/).groups['date'],
                          playCountText : dougaEle.querySelector('.info').innerText.match(/(?<count>[0-9\.万]+)人围观/).groups['count'],
                        });
                      });
                    }
  
  
                    vue.lotteryFormData.dougaList.splice(vue.lotteryFormData.dougaList.length, 0, ...dougaList);
  
                    vue.lotteryFormData.dougaListPage += 1;
  
                  }
  
  
                }
                else{
  
                  vue.lotteryFormData.dougaListDisabled = true;
                  vue.lotteryFormData.dougaListNoMore = true;
  
                }
  
                vue.lotteryFormData.dougaListLoading = false;
  
  
              });
            },
  
            // 刷新投稿数据
            refreshDougaList(){
  
              this.lotteryFormData.dougaList = [];
              this.lotteryFormData.dougaListPage = 1;
              this.lotteryFormData.dougaListDisabled = false;
              this.lotteryFormData.dougaListLoading = false;
              this.lotteryFormData.dougaListNoMore = false;
              this.lotteryFormData.dougaListActiveIndex = null;
              this.getDougaList();
  
            },
            handleDougaListItemClick(dougaIndex){
              // 点击已选中投稿表示取消选中
              if(this.lotteryFormData.dougaListActiveIndex == dougaIndex){
                this.lotteryFormData.dougaListActiveIndex = null;
              }
              else{
                this.lotteryFormData.dougaListActiveIndex = dougaIndex;
  
              }
            },
            handleDougaListItemDetailClick(dougaIndex){
              window.open(this.lotteryFormData.dougaList[dougaIndex].href, '_blank');
            },
  
            // 获取投稿
            getCommentList(douga, all, callback){
  
              var vue = this;
  
              var params = {
                sourceId : douga.id,
                sourceType : 3,
                page : 1,
                pivotCommentId : 0,
                supportZtEmot : true,
              };
  
              var fetch = true;
              var commentList = [];
              var preCommentId = douga.commentList && douga.commentList.length>0?douga.commentList[0].id:null;
  
              var getData = function(){
  
                commonRequrest(config.ACFUN_SERVER + config.URLS.DOUGA.COMMENT, 'get', params, true, function(isSuccess, data){
  
                  // 获取失败
                  if(!isSuccess){
                    callback(false, false, douga.commentCount, params.page, douga.commentListTotalPage);
                    fetch = false;
                  }
  
                  else{
  
                    data = JSON.parse(data);
  
                    // 返回错误
                    if(data.result != 0){
                      fetch = false;
                      return;
                    }
  
                    // 设置评论数量
                    douga.commentCount = data.commentCount;
                    douga.commentListTotalPage = data.totalPage;
  
                    data.rootComments.every(function(comment, commentIndex){
  
                      // 如果是已经获取过的评论，结束获取
                      if(comment.commentId == preCommentId){
                        fetch = false;
                        return false;
                      }
  
                      // 如果是未获取过的用户，添加
                      if(!(comment.userId in userInfo)){
                        userInfo[comment.userId] = {
                          uid : comment.userId,
                          userName : comment.userName,
                          photo : comment.headUrl[0].url,
                        };
                      }
  
                      commentList.push({
                        id : comment.commentId,
                        uid : comment.userId,
                        userName : comment.userName,
                        photo : comment.headUrl[0].url,
                        content : comment.content.replace(/\[emot=[^\[\]]*\]/g, ''),
                        floor : comment.floor,
                        date : moment(comment.timestamp).toDate(),
                        dateText : moment(comment.timestamp).format('MM-DD HH:mm'),
                      });
  
                      return true;
  
                    });
  
                    // 获取结束
                    if(params.page == douga.commentListTotalPage){
                      fetch = false;
                    }
  
  
                  }
  
  
                  if(!all){
                    fetch = false;
                  }
                  // 获取完毕
                  else if(params.page == douga.commentListTotalPage){
                    fetch = false;
                  }
  
                  // 继续获取
                  if(fetch){
                    params.page += 1;
                    // 回调
                    if(_.isFunction(callback)){
                      callback(true, false, douga.commentCount, params.page, douga.commentListTotalPage);
                    }
  
                    getData();
  
                  }
                  // 获取结束
                  else{
  
                    // 添加评论
                    if(!douga.commentList){
                      douga.commentList = [];
                    }
  
                    if(commentList.length>0){
                      douga.commentList.splice(0, 0, ...commentList);
                    }
  
                    // 回调
                    if(_.isFunction(callback)){
                      callback(true, true, douga.commentCount, params.page, douga.commentListTotalPage);
                    }
  
  
  
                  }
  
  
  
  
                });
  
              }
  
              // 获取数据
              getData();
  
            },
            clickMessage : function(message, isDouga){
  
              // 弹幕
              if(message.interaction.type == 'danmaku'){
  
                // 点击稿件，则复制稿件ac号
                if(isDouga){
                  clipboard.writeText(message.interaction.acSeries);
                  this.$message({
                    message : '已复制ac号：' + message.interaction.acSeries,
                    type : 'info',
                    duration : 2000,
                  });
                }
                // 否则复制弹幕内容
                else{
                  clipboard.writeText(message.interaction.content);
                  this.$message({
                    message : '已复制弹幕：' + message.interaction.content,
                    type : 'info',
                    duration : 2000,
                  });
                }
  
              }
  
            },
            getDougaByAcSeries(acSeries, callback){
  
              let vue = this;
  
              // 获取视频
              this.getVideoByAcSeries(acSeries, function(isSuccess, data){
  
                // 获取成功
                if(isSuccess){
  
                  if(_.isFunction(callback)){
                    callback(isSuccess, data);
                  }
  
                }
                // 获取失败，则获取文章
                else{
  
                  // 获取文章
                  vue.getArticleByAcSeries(acSeries, function(isSuccess, data){
  
                    // 获取成功
                    if(isSuccess){
  
                      if(_.isFunction(callback)){
                        callback(isSuccess, data);
                      }
  
                    }
                    else{
  
                      // 获取番剧
                      vue.getBangumiByAcSeries(acSeries, function(isSuccess, data){
  
                        // 获取成功
                        if(isSuccess){
  
                          if(_.isFunction(callback)){
                            callback(isSuccess, data);
                          }
  
                        }
                        else{
                          if(_.isFunction(callback)){
                            callback(isSuccess, data);
                          }
                        }
  
                      });
  
  
                    }
  
  
                  });
  
                }
  
              });
  
            },
            getVideoByAcSeries(acSeries, callback){
  
              commonRequrest(config.ACFUN_SERVER + config.URLS.DOUGA.VIDEO + `/ac${acSeries}`, 'get', null, true, function(isSuccess, data){
  
  
                // 获取成功
                if(isSuccess){
  
                  var match = data.match(new RegExp('window.videoInfo = (?<data>.+)'));
                  // 匹配成功
                  if(match){
                    eval('var videoInfo = ' + match.groups.data);
  
                    if(_.isFunction(callback)){
                      callback(true, {
                        type : 'video',
                        title : videoInfo.title,
                        cover : videoInfo.coverUrl,
                        channel : videoInfo.channel,
                        description : videoInfo.description,
                        danmakuCount : videoInfo.danmakuCount,
                        danmakuCountText : videoInfo.danmakuCountShow,
                        playCount : videoInfo.viewCount,
                        playCountText : videoInfo.viewCountShow,
                        uid : parseInt(videoInfo.user.id),
                        userName : videoInfo.user.name,
                      });
                    }
  
                  }
                  else{
                    if(_.isFunction(callback)){
                      callback(false);
                    }
                  }
  
                }
                else{
  
                  if(_.isFunction(callback)){
                    callback(false);
                  }
                }
  
  
  
              });
  
            },
            getArticleByAcSeries(acSeries, callback){
  
              commonRequrest(config.ACFUN_SERVER + config.URLS.DOUGA.ARTICLE + `/ac${acSeries}`, 'get', null, true, function(isSuccess, data){
  
  
                // 获取成功
                if(isSuccess){
  
  
                  var match = data.match(new RegExp('window.articleInfo = (?<data>.+)'));
                  // 匹配成功
                  if(match){
                    eval('var articleInfo = ' + match.groups.data);
  
                    if(_.isFunction(callback)){
                      callback(true, {
                        type : 'article',
                        title : articleInfo.title,
                        // cover : articleInfo.coverUrl,
                        description : articleInfo.description,
                        channel : articleInfo.channel,
                        playCount : articleInfo.viewCount,
                        playCountText : articleInfo.formatViewCount,
                        uid : parseInt(articleInfo.user.id),
                        userName : articleInfo.user.name,
                      });
                    }
  
                  }
                  else{
                    if(_.isFunction(callback)){
                      callback(false);
                    }
                  }
  
                }
                else{
  
                  if(_.isFunction(callback)){
                    callback(false);
                  }
                }
  
  
  
              });
  
            },
            getBangumiByAcSeries(acSeries, callback){
  
              commonRequrest(config.ACFUN_SERVER + config.URLS.DOUGA.BANGUMI + `/aa${acSeries}`, 'get', null, true, function(isSuccess, data){
  
  
                // 获取成功
                if(isSuccess){
  
  
                  var match = data.match(new RegExp('window.bangumiData = (?<data>.+)'));
                  // 匹配成功
                  if(match){
                    eval('var bangumiData = ' + match.groups.data);
  
                    if(_.isFunction(callback)){
                      callback(true, {
                        type : 'bangumi',
                        title : bangumiData.bangumiTitle,
                        acfunOnly : bangumiData.acfunOnly,
                        cover : bangumiData.bangumiCoverImageH,
                        description : bangumiData.bangumiIntro,
                        channel : bangumiData.channel,
                        playCount : bangumiData.playCount,
                        playCountText : bangumiData.playCountShow,
                        stowCount : bangumiData.stowCount,
                        stowCountText : bangumiData.stowCountShow,
                      });
                    }
  
                  }
                  else{
                    if(_.isFunction(callback)){
                      callback(false);
                    }
                  }
  
                }
                else{
  
                  if(_.isFunction(callback)){
                    callback(false);
                  }
                }
  
  
  
              });
  
            },
            // 发送一条测试用的弹幕
            pushTestMessage : function(type){
              var message = {
                uid : 37693149,
                vup : false,
                userName : '特工澪',
                badgeName : '505团',
                badgeLevel : 999,
                badgeColor : 'black',
                photo : 'https://tx-free-imgs2.acfun.cn/kimg/EJjM1y8qPQoFYWNmdW4SBWltYWdlGi0zNzY5MzE0OV8yYTE4YjBiZTZhZTM0OTc1OTkyNDIyZGFhMTdlNzA0MS5wbmc.png',
                interaction : {
                  type: type,
                  sendTime : new Date(),
                  id: uuidv4(),
                  giftName: '猴岛',
                  giftCount: 1,
                  content: type == 'danmaku'?'听我说👂👂👂谢谢你🙏🙏🙏因为有你👉👉👉温暖了四季🌈🌈🌈谢谢你🙏🙏🙏感谢有你👉👉👉世界更美丽🌏🌏🌏我要谢谢你🙏🙏🙏因为有你👉👉👉爱常在心底💃💃💃谢谢你 🙏🙏🙏感谢有你🙇♂🙇♂🙇♂把幸福传递 ac32814163':'',
                },
              };
              if(!(message.uid in userInfo)){
                userInfo[message.uid] = {
                  userName: message.userName,
                  photo: message.photo,
                };
              }
              callbackManager.feed('message', message);
            },
            pushTestDanmakuMessage: function(){
              this.pushTestMessage('danmaku');
            },
            pushTestGiftMessage: function(){
              this.pushTestMessage('gift');
            },
            pushTestLikeMessage: function(){
              this.pushTestMessage('like');
            },
            pushTestEnterRoomMessage: function(){
              this.pushTestMessage('enterroom');
            },
            pushTestFollowMessage: function(){
              this.pushTestMessage('follow');
            },
            pushTestJoinClubMessage: function(){
              this.pushTestMessage('joinclub');
            },
  
          },
          computed : {
            danmakuMessageClass: function(){
              return ['live-message-danmaku'].concat(this.borderClass);
            },
            backgroundStyle: function(){
              style = {
                background: this.interactionFormData.backgroundColor,
              };
              return style;
            },
            borderClass: function(){
              classes = [];
              // 圆角矩形边框
              if(this.interactionFormData.borderShape == 'round'){
              }
              // 矩形
              else if(this.interactionFormData.borderShape == 'rect'){
  
              }
              // 流动
              else if(this.interactionFormData.borderShape == 'flow'){
                classes.push('live-message-border-flow')
              }
              return classes;
            },
            borderStyle: function(){
              style = {};
              // 圆角矩形边框
              if(this.interactionFormData.borderShape == 'round'){
                style['border-radius'] = '6px';
                style['border'] = `${this.interactionFormData.borderSize}px solid ${this.interactionFormData.borderColor}`;
              }
              // 矩形
              else if(this.interactionFormData.borderShape == 'rect'){
                style['border'] = `${this.interactionFormData.borderSize}px solid ${this.interactionFormData.borderColor}`;
              }
              // 流动
              else if(this.interactionFormData.borderShape == 'flow'){
                GM_addStyle(`
                  .live-message-border-flow.active{
                    border: ${this.interactionFormData.borderSize}px solid transparent
                  }
                  .live-message-border-flow.inactive{
                    border: ${this.interactionFormData.borderSize}px solid ${this.interactionFormData.borderColor}
                  }
                `);
              }
  
              // 自适应宽度
              if(this.interactionFormData.borderWidth == 'auto'){
                style['width'] = 'max-content';
                style['display'] = 'table-cell';
              }
              // 定宽
              else if(this.interactionFormData.borderWidth == 'fixed'){
                style['width'] = '100%';
                style['display'] = 'block';
              }
              return style;
            },
            borderFlowItemStyle: function(){
              style = {};
              // 圆角矩形边框
              if(this.interactionFormData.borderShape == 'round'){
              }
              // 矩形
              else if(this.interactionFormData.borderShape == 'rect'){
  
              }
              // 流动
              else if(this.interactionFormData.borderShape == 'flow'){
  
                GM_addStyle(`
                  .live-message-border-flow.active .border-flow-item::before,.live-message-border-flow.active .border-flow-item::after{
                    border: ${this.interactionFormData.borderSize}px solid ${this.interactionFormData.borderColor}
                  }
                  .live-message-border-flow .border-flow-item::before,.live-message-border-flow .border-flow-item::after{
                    top: -${this.interactionFormData.borderSize}px;
                    bottom: -${this.interactionFormData.borderSize}px;
                    left: -${this.interactionFormData.borderSize}px;
                    right: -${this.interactionFormData.borderSize}px;
                  }
                `);
              }
              return style;
            },
            userNameMessageStyle : function(){
  
              return {
                'color':this.interactionFormData.userNameFontColor,
                'font-size':this.interactionFormData.userNameFontSize + 'px',
                'font-family' : this.interactionFormData.fontFamily[this.interactionFormData.fontFamily.length-1],
                'text-shadow':`0px ${this.interactionFormData.userNameFontShadowSize}px ${this.interactionFormData.userNameFontShadowSize}px ${this.interactionFormData.userNameFontShadowColor}, 0px -${this.interactionFormData.userNameFontShadowSize}px ${this.interactionFormData.userNameFontShadowSize}px ${this.interactionFormData.userNameFontShadowColor}, ${this.interactionFormData.userNameFontShadowSize}px 0px ${this.interactionFormData.userNameFontShadowSize}px ${this.interactionFormData.userNameFontShadowColor}, -${this.interactionFormData.userNameFontShadowSize}px 0px ${this.interactionFormData.userNameFontShadowSize}px ${this.interactionFormData.userNameFontShadowColor}, ${this.interactionFormData.userNameFontShadowSize}px ${this.interactionFormData.userNameFontShadowSize}px ${this.interactionFormData.userNameFontShadowSize}px ${this.interactionFormData.userNameFontShadowColor}, -${this.interactionFormData.userNameFontShadowSize}px -${this.interactionFormData.userNameFontShadowSize}px ${this.interactionFormData.userNameFontShadowSize}px ${this.interactionFormData.userNameFontShadowColor}, ${this.interactionFormData.userNameFontShadowSize}px -${this.interactionFormData.userNameFontShadowSize}px ${this.interactionFormData.userNameFontShadowSize}px ${this.interactionFormData.userNameFontShadowColor}, -${this.interactionFormData.userNameFontShadowSize}px ${this.interactionFormData.userNameFontShadowSize}px ${this.interactionFormData.userNameFontShadowSize}px ${this.interactionFormData.userNameFontShadowColor}`,
              };
            },
            userBadgeStyle : function(){
  
              return {
                'font-size':this.interactionFormData.userNameFontSize*0.8 + 'px',
                'font-family' : this.interactionFormData.fontFamily[this.interactionFormData.fontFamily.length-1],
              };
  
            },
            userPhotoSize : function(){
              return this.interactionFormData.userNameFontSize*2;
            },
            danmakuMessageStyle : function(){
              return {
                ...this.borderStyle,
                'background-image' : `linear-gradient(to right, ${this.interactionFormData.danmakuBackgroundColor}, ${this.interactionFormData.danmakuBackgroundGradientColor})`,
                'color':this.interactionFormData.danmakuFontColor,
                'font-size':this.interactionFormData.danmakuFontSize + 'px',
                'font-family' : this.interactionFormData.fontFamily[this.interactionFormData.fontFamily.length-1],
                'text-shadow':`0px ${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, 0px -${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, ${this.interactionFormData.danmakuFontShadowSize}px 0px ${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, -${this.interactionFormData.danmakuFontShadowSize}px 0px ${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, ${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, -${this.interactionFormData.danmakuFontShadowSize}px -${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, ${this.interactionFormData.danmakuFontShadowSize}px -${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, -${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowColor}`,
  
              };
  
            },
            danmakuMessageContainerStyle : function(){
  
              // 横版
              if(this.interactionFormData.direction == 'horizontal'){
                var style = {
                  'max-width' : this.interactionFormData.danmakuFontSize*20 + 'px',
                };
                if(this.interactionFormData.displayNotWrap){
                  style.height = '100%';
                }
                return style;
  
              }
              // 纵版
              else{
              }
  
            },
            danmakuDougaMessageStyle: function(){
              return {
                ...this.borderStyle,
                'border': 'transparent',
                'display': 'block',
                'width': this.danmakuDougaContainerStyle.width,
                'background-image' : `linear-gradient(to right, ${this.interactionFormData.danmakuDougaBackgroundColor}, ${this.interactionFormData.danmakuDougaBackgroundColor})`,
                'color':this.interactionFormData.danmakuFontColor,
                'font-size':this.interactionFormData.danmakuFontSize + 'px',
                'font-family' : this.interactionFormData.fontFamily[this.interactionFormData.fontFamily.length-1],
                'text-shadow':`0px ${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, 0px -${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, ${this.interactionFormData.danmakuFontShadowSize}px 0px ${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, -${this.interactionFormData.danmakuFontShadowSize}px 0px ${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, ${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, -${this.interactionFormData.danmakuFontShadowSize}px -${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, ${this.interactionFormData.danmakuFontShadowSize}px -${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, -${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowSize}px ${this.interactionFormData.danmakuFontShadowColor}`,
  
              };
            },
            danmakuDougaContainerStyle: function(){
  
              var height = Math.ceil(this.interactionFormData.danmakuFontSize*0.8*1.3*3 + this.interactionFormData.danmakuFontSize*0.6*1.3*2);
              var width = Math.ceil(height*16/9)*2;
  
              return {
                'width' : width + 'px',
              };
  
            },
            danmakuDougaTitleStyle : function(){
  
              var fontSize = Math.ceil(this.interactionFormData.danmakuFontSize*0.8);
              var shadowSize = Math.ceil(this.interactionFormData.danmakuFontShadowSize*0.8);
              var height = Math.ceil(fontSize*1.3 * 3);
  
              return {
                'height': height + 'px',
                'color':this.interactionFormData.danmakuFontColor,
                'font-size':fontSize + 'px',
                'font-family' : this.interactionFormData.fontFamily[this.interactionFormData.fontFamily.length-1],
                'text-shadow':`0px ${shadowSize}px ${shadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, 0px -${shadowSize}px ${shadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, ${shadowSize}px 0px ${shadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, -${shadowSize}px 0px ${shadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, ${shadowSize}px ${shadowSize}px ${shadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, -${shadowSize}px -${shadowSize}px ${shadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, ${shadowSize}px -${shadowSize}px ${shadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, -${shadowSize}px ${shadowSize}px ${shadowSize}px ${this.interactionFormData.danmakuFontShadowColor}`,
              };
            },
            danmakuDougaDescriptionStyle : function(){
  
              var fontSize = Math.ceil(this.interactionFormData.danmakuFontSize*0.6);
              var shadowSize = Math.ceil(this.interactionFormData.danmakuFontShadowSize*0.6);
  
              return {
                'font-size':fontSize + 'px',
                'text-shadow':`0px ${shadowSize}px ${shadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, 0px -${shadowSize}px ${shadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, ${shadowSize}px 0px ${shadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, -${shadowSize}px 0px ${shadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, ${shadowSize}px ${shadowSize}px ${shadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, -${shadowSize}px -${shadowSize}px ${shadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, ${shadowSize}px -${shadowSize}px ${shadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, -${shadowSize}px ${shadowSize}px ${shadowSize}px ${this.interactionFormData.danmakuFontShadowColor}`,
              };
            },
            danmakuDougaCoverStyle : function(){
  
              var height = Math.ceil(this.interactionFormData.danmakuFontSize*0.8*1.3*3 + this.interactionFormData.danmakuFontSize*0.6*1.3*2);
              var width = Math.ceil(height*16/9);
  
  
              return {
                'height' : height + 'px',
                'width' : width + 'px',
              };
  
            },
            danmakuDougaLeftColStyle : function(){
              return {
                'width': this.danmakuDougaCoverStyle.width,
                'display': 'inline-block',
                'float': 'left',
              };
            },
            danmakuDougaRightColStyle : function(){
              return {
                'width': `calc(100% - ${this.danmakuDougaLeftColStyle.width})`,
                'display': 'inline-block',
                'float': 'left',
              };
            },
            danmakuDougaInfoStyle : function(){
  
              var fontSize = Math.ceil(this.interactionFormData.danmakuFontSize*0.6);
              var shadowSize = Math.ceil(this.interactionFormData.danmakuFontShadowSize*0.6);
  
              return {
                'color':this.interactionFormData.danmakuFontColor,
                'font-size':fontSize + 'px',
                'font-family' : this.interactionFormData.fontFamily[this.interactionFormData.fontFamily.length-1],
                'text-shadow':`0px ${shadowSize}px ${shadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, 0px -${shadowSize}px ${shadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, ${shadowSize}px 0px ${shadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, -${shadowSize}px 0px ${shadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, ${shadowSize}px ${shadowSize}px ${shadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, -${shadowSize}px -${shadowSize}px ${shadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, ${shadowSize}px -${shadowSize}px ${shadowSize}px ${this.interactionFormData.danmakuFontShadowColor}, -${shadowSize}px ${shadowSize}px ${shadowSize}px ${this.interactionFormData.danmakuFontShadowColor}`,
              };
  
            },
            giftMessageStyle : function(){
  
              return {
                ...this.borderStyle,
                'background-image' : `linear-gradient(to right, ${this.interactionFormData.giftBackgroundColor}, ${this.interactionFormData.giftBackgroundGradientColor})`,
                'color':this.interactionFormData.giftFontColor,
                'font-size':this.interactionFormData.giftFontSize + 'px',
                'font-family' : this.interactionFormData.fontFamily[this.interactionFormData.fontFamily.length-1],
                'text-shadow':`0px ${this.interactionFormData.giftFontShadowSize}px ${this.interactionFormData.giftFontShadowSize}px ${this.interactionFormData.giftFontShadowColor}, 0px -${this.interactionFormData.giftFontShadowSize}px ${this.interactionFormData.giftFontShadowSize}px ${this.interactionFormData.giftFontShadowColor}, ${this.interactionFormData.giftFontShadowSize}px 0px ${this.interactionFormData.giftFontShadowSize}px ${this.interactionFormData.giftFontShadowColor}, -${this.interactionFormData.giftFontShadowSize}px 0px ${this.interactionFormData.giftFontShadowSize}px ${this.interactionFormData.giftFontShadowColor}, ${this.interactionFormData.giftFontShadowSize}px ${this.interactionFormData.giftFontShadowSize}px ${this.interactionFormData.giftFontShadowSize}px ${this.interactionFormData.giftFontShadowColor}, -${this.interactionFormData.giftFontShadowSize}px -${this.interactionFormData.giftFontShadowSize}px ${this.interactionFormData.giftFontShadowSize}px ${this.interactionFormData.giftFontShadowColor}, ${this.interactionFormData.giftFontShadowSize}px -${this.interactionFormData.giftFontShadowSize}px ${this.interactionFormData.giftFontShadowSize}px ${this.interactionFormData.giftFontShadowColor}, -${this.interactionFormData.giftFontShadowSize}px ${this.interactionFormData.giftFontShadowSize}px ${this.interactionFormData.giftFontShadowSize}px ${this.interactionFormData.giftFontShadowColor}`,
              };
            },
            giftMessageContainerStyle : function(){
  
              // 横版
              if(this.interactionFormData.direction == 'horizontal'){
                var style = {
                  'max-width' : this.interactionFormData.giftFontSize*20 + 'px',
                };
                if(this.interactionFormData.displayNotWrap){
                  style.height = '100%';
                }
                return style;
  
              }
              // 纵版
              else{
              }
  
            },
            giftImageSize : function(){
              return this.interactionFormData.giftFontSize*1.5;
            },
            giftCountStyle : function(){
              return {
                'font-size':this.interactionFormData.giftFontSize*1.5 + 'px',
                'font-family' : this.interactionFormData.fontFamily[this.interactionFormData.fontFamily.length-1] == 'inherit' ? 'gift':this.interactionFormData.fontFamily[this.interactionFormData.fontFamily.length-1],
              };
            },
            likeMessageStyle : function(){
  
              return {
                'color':this.interactionFormData.likeFontColor,
                'font-size':this.interactionFormData.likeFontSize + 'px',
                'font-family' : this.interactionFormData.fontFamily[this.interactionFormData.fontFamily.length-1],
                'text-shadow':`0px ${this.interactionFormData.likeFontShadowSize}px ${this.interactionFormData.likeFontShadowSize}px ${this.interactionFormData.likeFontShadowColor}, 0px -${this.interactionFormData.likeFontShadowSize}px ${this.interactionFormData.likeFontShadowSize}px ${this.interactionFormData.likeFontShadowColor}, ${this.interactionFormData.likeFontShadowSize}px 0px ${this.interactionFormData.likeFontShadowSize}px ${this.interactionFormData.likeFontShadowColor}, -${this.interactionFormData.likeFontShadowSize}px 0px ${this.interactionFormData.likeFontShadowSize}px ${this.interactionFormData.likeFontShadowColor}, ${this.interactionFormData.likeFontShadowSize}px ${this.interactionFormData.likeFontShadowSize}px ${this.interactionFormData.likeFontShadowSize}px ${this.interactionFormData.likeFontShadowColor}, -${this.interactionFormData.likeFontShadowSize}px -${this.interactionFormData.likeFontShadowSize}px ${this.interactionFormData.likeFontShadowSize}px ${this.interactionFormData.likeFontShadowColor}, ${this.interactionFormData.likeFontShadowSize}px -${this.interactionFormData.likeFontShadowSize}px ${this.interactionFormData.likeFontShadowSize}px ${this.interactionFormData.likeFontShadowColor}, -${this.interactionFormData.likeFontShadowSize}px ${this.interactionFormData.likeFontShadowSize}px ${this.interactionFormData.likeFontShadowSize}px ${this.interactionFormData.likeFontShadowColor}`,
              };
  
            },
            likeMessageContainerStyle : function(){
  
              // 横版
              if(this.interactionFormData.direction == 'horizontal'){
                return {
                  'max-width' : this.interactionFormData.likeFontSize*20 + 'px',
                }
  
              }
              // 纵版
              else{
              }
  
            },
            enterroomMessageStyle : function(){
              return {
                'color':this.interactionFormData.enterroomFontColor,
                'font-size':this.interactionFormData.enterroomFontSize + 'px',
                'font-family' : this.interactionFormData.fontFamily[this.interactionFormData.fontFamily.length-1],
                'text-shadow':`0px ${this.interactionFormData.enterroomFontShadowSize}px ${this.interactionFormData.enterroomFontShadowSize}px ${this.interactionFormData.enterroomFontShadowColor}, 0px -${this.interactionFormData.enterroomFontShadowSize}px ${this.interactionFormData.enterroomFontShadowSize}px ${this.interactionFormData.enterroomFontShadowColor}, ${this.interactionFormData.enterroomFontShadowSize}px 0px ${this.interactionFormData.enterroomFontShadowSize}px ${this.interactionFormData.enterroomFontShadowColor}, -${this.interactionFormData.enterroomFontShadowSize}px 0px ${this.interactionFormData.enterroomFontShadowSize}px ${this.interactionFormData.enterroomFontShadowColor}, ${this.interactionFormData.enterroomFontShadowSize}px ${this.interactionFormData.enterroomFontShadowSize}px ${this.interactionFormData.enterroomFontShadowSize}px ${this.interactionFormData.enterroomFontShadowColor}, -${this.interactionFormData.enterroomFontShadowSize}px -${this.interactionFormData.enterroomFontShadowSize}px ${this.interactionFormData.enterroomFontShadowSize}px ${this.interactionFormData.enterroomFontShadowColor}, ${this.interactionFormData.enterroomFontShadowSize}px -${this.interactionFormData.enterroomFontShadowSize}px ${this.interactionFormData.enterroomFontShadowSize}px ${this.interactionFormData.enterroomFontShadowColor}, -${this.interactionFormData.enterroomFontShadowSize}px ${this.interactionFormData.enterroomFontShadowSize}px ${this.interactionFormData.enterroomFontShadowSize}px ${this.interactionFormData.enterroomFontShadowColor}`,
              };
  
            },
            enterroomMessageContainerStyle : function(){
  
              // 横版
              if(this.interactionFormData.direction == 'horizontal'){
                return {
                  'max-width' : this.interactionFormData.enterroomFontSize*20 + 'px',
                }
  
              }
              // 纵版
              else{
              }
  
            },
            followMessageStyle : function(){
  
              return {
                'color':this.interactionFormData.followFontColor,
                'font-size':this.interactionFormData.followFontSize + 'px',
                'font-family' : this.interactionFormData.fontFamily[this.interactionFormData.fontFamily.length-1],
                'text-shadow':`0px ${this.interactionFormData.followFontShadowSize}px ${this.interactionFormData.followFontShadowSize}px ${this.interactionFormData.followFontShadowColor}, 0px -${this.interactionFormData.followFontShadowSize}px ${this.interactionFormData.followFontShadowSize}px ${this.interactionFormData.followFontShadowColor}, ${this.interactionFormData.followFontShadowSize}px 0px ${this.interactionFormData.followFontShadowSize}px ${this.interactionFormData.followFontShadowColor}, -${this.interactionFormData.followFontShadowSize}px 0px ${this.interactionFormData.followFontShadowSize}px ${this.interactionFormData.followFontShadowColor}, ${this.interactionFormData.followFontShadowSize}px ${this.interactionFormData.followFontShadowSize}px ${this.interactionFormData.followFontShadowSize}px ${this.interactionFormData.followFontShadowColor}, -${this.interactionFormData.followFontShadowSize}px -${this.interactionFormData.followFontShadowSize}px ${this.interactionFormData.followFontShadowSize}px ${this.interactionFormData.followFontShadowColor}, ${this.interactionFormData.followFontShadowSize}px -${this.interactionFormData.followFontShadowSize}px ${this.interactionFormData.followFontShadowSize}px ${this.interactionFormData.followFontShadowColor}, -${this.interactionFormData.followFontShadowSize}px ${this.interactionFormData.followFontShadowSize}px ${this.interactionFormData.followFontShadowSize}px ${this.interactionFormData.followFontShadowColor}`,
              };
  
            },
            followMessageContainerStyle : function(){
  
              // 横版
              if(this.interactionFormData.direction == 'horizontal'){
                return {
                  'max-width' : this.interactionFormData.followFontSize*20 + 'px',
                }
  
              }
              // 纵版
              else{
              }
  
            },
            joinclubMessageStyle : function(){
  
              return {
                'color':this.interactionFormData.joinclubFontColor,
                'font-size':this.interactionFormData.joinclubFontSize + 'px',
                'font-family' : this.interactionFormData.fontFamily[this.interactionFormData.fontFamily.length-1],
                'text-shadow':`0px ${this.interactionFormData.joinclubFontShadowSize}px ${this.interactionFormData.joinclubFontShadowSize}px ${this.interactionFormData.joinclubFontShadowColor}, 0px -${this.interactionFormData.joinclubFontShadowSize}px ${this.interactionFormData.joinclubFontShadowSize}px ${this.interactionFormData.joinclubFontShadowColor}, ${this.interactionFormData.joinclubFontShadowSize}px 0px ${this.interactionFormData.joinclubFontShadowSize}px ${this.interactionFormData.joinclubFontShadowColor}, -${this.interactionFormData.joinclubFontShadowSize}px 0px ${this.interactionFormData.joinclubFontShadowSize}px ${this.interactionFormData.joinclubFontShadowColor}, ${this.interactionFormData.joinclubFontShadowSize}px ${this.interactionFormData.joinclubFontShadowSize}px ${this.interactionFormData.joinclubFontShadowSize}px ${this.interactionFormData.joinclubFontShadowColor}, -${this.interactionFormData.joinclubFontShadowSize}px -${this.interactionFormData.joinclubFontShadowSize}px ${this.interactionFormData.joinclubFontShadowSize}px ${this.interactionFormData.joinclubFontShadowColor}, ${this.interactionFormData.joinclubFontShadowSize}px -${this.interactionFormData.joinclubFontShadowSize}px ${this.interactionFormData.joinclubFontShadowSize}px ${this.interactionFormData.joinclubFontShadowColor}, -${this.interactionFormData.joinclubFontShadowSize}px ${this.interactionFormData.joinclubFontShadowSize}px ${this.interactionFormData.joinclubFontShadowSize}px ${this.interactionFormData.joinclubFontShadowColor}`,
              };
  
            },
            joinclubMessageContainerStyle : function(){
  
              // 横版
              if(this.interactionFormData.direction == 'horizontal'){
                return {
                  'max-width' : this.interactionFormData.joinclubFontSize*20 + 'px',
                }
  
              }
              // 纵版
              else{
              }
  
            },
            activeGuessGuessListData : function(){
              var listData = this.activeGuess.displayDirectGuess?this.activeGuess.directGuessList:(this.activeGuess.onlyDisplayMatch?this.activeGuess.matchGuessList:this.activeGuess.guessList);
              return listData?listData:[];
            },
            toUserSpace: function(...args){
              console.log(args)
              // console.log(candidate, config.ACFUN_SERVER + config.URLS.ACFUN_USER.SPACE + '/' + candidate.uid)
              // window.open(config.ACFUN_SERVER + config.URLS.ACFUN_USER.SPACE + '/' + candidate.uid);
            },
  
          },
          mounted : function(){
  
            var vue = this;
  
            var messageContainerEle = document.querySelector('.container-live-feed-messages-acfunlive .live-message-container');
  
            // 获取弹幕消息
            callbackManager.register('message', function(data){
  
              // 修改信息
              if(_.isFunction(vue.interactionFormData.modifyContentFunc)){
  
                vue.interactionFormData.modifyContentFunc(data);
  
              }
  
              if(data.interaction.type == 'enterroom'){
                userInfo[data.uid].hasEnterroom = true;
              }
              else if(data.interaction.type == 'danmaku'){
                userInfo[data.uid].hasDanmaku = true;
                vue.lastDanmakuMessage = data;
              }
              else if(data.interaction.type == 'like'){
                userInfo[data.uid].hasLike = true;
              }
              else if(data.interaction.type == 'gift'){
                userInfo[data.uid].hasGift = true;
              }
              else if(data.interaction.type == 'follow'){
                userInfo[data.uid].hasFollow = true;
              }
  
              // 礼物合并
              if(
                data.interaction.type == 'gift'
                && userInfo[data.uid].lastInteraction
                && userInfo[data.uid].lastInteraction.type == 'gift'
                && data.interaction.giftName == userInfo[data.uid].lastInteraction.giftName
                && data.interaction.sendTime - userInfo[data.uid].lastInteraction.sendTime<=5*1000*(data.interaction.giftName=='香蕉'?2:1)
              ){
  
                userInfo[data.uid].lastInteraction.giftCount += data.interaction.giftCount;
                userInfo[data.uid].lastInteraction.sendTime = data.interaction.sendTime;
                userInfo[data.uid].lastInteraction.doAnime = false;
                userInfo[data.uid].lastInteraction.doAnime = true;
              }
              else{
                vue.messageData.push(data);
                userInfo[data.uid].lastInteraction = data.interaction;
              }
  
  
              if(data.interaction.type == 'danmaku'){
                // 如果有ac号，获取稿件信息
                data.interaction.acSeries = extractAcSeries(data.interaction.content);
  
                if(data.interaction.acSeries != null){
                  vue.getDougaByAcSeries(data.interaction.acSeries, function(isSuccess, douga){
  
                    // 获取稿件成功
                    if(isSuccess){
                      data.interaction.douga = douga;
                    }
  
                  });
                }
  
                // 如果是指令
                var command = extractCommand(data.interaction.content);
  
                if(command!=null){
                  data = _.cloneDeep(data);
                  data.command = command.command;
                  data.interaction.content = command.text;
                  callbackManager.feed('command:'+command.command, data);
                }
  
              }
  
  
              // 如果鼠标没有悬浮，则自动滚动至底部
              if(!vue.mouseOn){
                vue.$nextTick(function(){
                  // 横版滚动
                  if(vue.interactionFormData.direction=='horizontal'){
                    messageContainerEle.scrollLeft = messageContainerEle.scrollWidth;
                  }
                  // 纵版滚动
                  else{
                    messageContainerEle.scrollTop = messageContainerEle.scrollHeight;
                  }
                });
              }
            });
  
  
            // 监听事件
            messageContainerEle.addEventListener('mouseenter', function(e){
              // 鼠标悬浮，显示滚动条
              vue.mouseOn = true;
  
            });
  
            messageContainerEle.addEventListener('mouseleave', function(e){
              // 鼠标离开，隐藏滚动条
              vue.mouseOn = false;
  
            });
  
  
            this.giftList.forEach(function(gift){
              vue.giftNameMapper[gift.name] = gift;
            });
  
            async function loadData(){
              // 查看缓存的数据
              var audioFormData = await GM_getValue('audioFormData');
              if(audioFormData){
                vue.audioFormData = JSON.parse(audioFormData);
                vue.handleAudioFormSubmitValid();
              }
              var interactionPreset = await GM_getValue('interactionPreset');
              if(interactionPreset){
                interactionPreset = JSON.parse(interactionPreset);
                vue.interactionPreset = interactionPreset;
                var activeInteractionPresetIndex = _.findIndex(interactionPreset, {active:true});
                if(activeInteractionPresetIndex!=-1){
                  vue.activeInteractionPreset(interactionPreset[activeInteractionPresetIndex]);
  
                  vue.downloadedFonts = await GM_getValue('downloadedFonts');
                  for(var fontName in vue.downloadedFonts){
                    // 添加字体
                    GM_addStyle(`
                      @font-face{
                        font-family : ${fontName};
                        src: url(data:font/truetype;charset=utf-8;base64,${vue.downloadedFonts[fontName]}) format('truetype');
                      }
                    `);
                  }
                }
              }
              else{
                vue.handleInteractionFormSubmitValid();
              }
              /*var interactionFormData = await GM_getValue('interactionFormData');
              if(interactionFormData){
                interactionFormData = JSON.parse(interactionFormData);
  
                if(!interactionFormData.historyMinutes){
                  interactionFormData.historyMinutes = 10;
                }
                if(!interactionFormData.historyCount){
                  interactionFormData.historyCount = 200;
                }
  
                if(interactionFormData.joinclubFontSize){
                  vue.interactionFormData = interactionFormData;
                  vue.handleInteractionFormSubmitValid();
  
                  // 默认字体
                  if(!vue.interactionFormData.fontFamily){
                    vue.interactionFormData.fontFamily = ['default', 'inherit'];
                  }
  
                  var fontName = vue.interactionFormData.fontFamily[vue.interactionFormData.fontFamily.length-1];
  
                  if(fontName!='inherit'){
                    vue.downloadedFonts = await GM_getValue('downloadedFonts');
                    for(var fontName in vue.downloadedFonts){
                      // 添加字体
                      GM_addStyle(`
                        @font-face{
                          font-family : ${fontName};
                          src: url(data:font/truetype;charset=utf-8;base64,${vue.downloadedFonts[fontName]}) format('truetype');
                        }
                      `);
                    }
                  }
  
                }
  
  
              }
              else{
                vue.handleInteractionFormSubmitValid();
              }*/
            }
            loadData();
  
            // 每500毫秒获取一次用户信息，避免被封
            window.setInterval(()=>{
              if(vue.candidateInfoCallbacks.length>0){
                let [candidate, callback] = vue.candidateInfoCallbacks.splice(0, 1)[0];
                vue._getCandidateInfo(candidate, callback);
  
                [candidate, callback] = vue.candidateInfoCallbacks.splice(0, 1)[0];
                vue._getCandidateInfo(candidate, callback);
  
  
                [candidate, callback] = vue.candidateInfoCallbacks.splice(0, 1)[0];
                vue._getCandidateInfo(candidate, callback);
              }
            }, 500);
  
            // 按键绑定，从ctrl+alt+0到ctrl+alt+9
            hotkeys(_.range(10).map((index)=>`ctrl+alt+${index}`).join(','), (event, handler)=>{
              var index = parseInt(handler.key.split('+')[2]);
              console.log('key', index, this.interactionPreset[index-1])
              if(index<=this.interactionPreset.length){
                this.activeInteractionPreset(this.interactionPreset[index-1]);
              }
            });
  
          },
      });
  
      return vue;
    }
  
  
    disableVideos();
  
  
    window.onload = function(){
      start();
  
      var intervalHandler = window.setInterval(function(){
        if(loadVue()){
          window.clearInterval(intervalHandler);
        }
      }, 500);
  
    };
  
  })();