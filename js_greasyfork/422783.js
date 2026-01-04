// ==UserScript==
// @name         Valkyrie
// @namespace    coderzhaoziwei@outlook.com
// @version      1.2.315
// @author       Coder Zhao
// @homepage     https://greasyfork.org/scripts/422783
// @description  文字游戏《武神传说》的浏览器脚本程序 | 自动流程 | 界面优化
// @modified     2021/6/4 20:25:42
// @license      MIT
// @supportURL   https://github.com/coderzhaoziwei/ValkyrieWorker/issues
// @icon         https://cdn.jsdelivr.net/gh/coderzhaoziwei/Valkyrie/source/image/wakuang.png
// @require      https://greasyfork.org/scripts/422999/code/Vue@3.js
// @require      https://cdn.jsdelivr.net/npm/element3@0.0.39/dist/element3-ui.global.min.js
// @require      https://cdn.jsdelivr.net/npm/gsap@3.6.0/dist/gsap.min.js
// @match        http://*.wsmud.com/*
// @exclude      http://*.wsmud.com/news*
// @exclude      http://*.wsmud.com/pay*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_log
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/422783/Valkyrie.user.js
// @updateURL https://update.greasyfork.org/scripts/422783/Valkyrie.meta.js
// ==/UserScript==

/* eslint-env es6 */
/* global Vue:readonly */
/* global Element3:readonly */
/* global gsap:readonly */

(function () {
  'use strict';

  var HeadHTML = "<!-- Favicon -->\n<link rel=\"shortcut icon\" href=\"https://cdn.jsdelivr.net/gh/coderzhaoziwei/Valkyrie/source/image/wakuang.png\" type=\"image/x-icon\">\n<!-- Google Font -->\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\"></link>\n<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap\"></link>\n<!-- Element3 -->\n<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/element3@0.0.39/lib/theme-chalk/index.css\"></link>\n";

  var BodyHTML = "<div id=\"app\">\n  <!-- 房间 -->\n  <teleport to=\"#app-room\">\n    <!-- 房间标题 -->\n    <app-header :title=\"roomTitle\" v-model:show=\"options.showPanelRoom\">\n      <app-icon class=\"mr-2\" icon=\"el-icon-map-location\" @click=\"options.showMapDialog=true;send(`map`);\"></app-icon>\n    </app-header>\n    <!-- 房间面板 -->\n    <app-panel :show=\"options.showPanelRoom\">\n      <span class=\"app-room-desc\" v-html=\"roomDesc\"></span>\n    </app-panel>\n    <!-- 地图弹窗 -->\n    <app-dialog :width=\"mapWidthStyle\" :title=\"mapTitle\" v-model:show=\"options.showMapDialog\">\n      <div :style=\"mapStyle\" class=\"app-room-map unselectable\" v-html=\"mapSVG\"></div>\n    </app-dialog>\n  </teleport>\n\n\n  <!-- 左侧边栏 -->\n  <teleport to=\"#app-left\" v-show=\"id\">\n\n    <!-- 属性标题 -->\n    <app-header :title=\"scoreTitle\" v-model:show=\"options.showPanelScore\">\n      <app-icon class=\"mr-2\" v-if=\"genderText === '女'\" icon=\"el-icon-female\"></app-icon>\n      <app-icon class=\"mr-2\" v-else-if=\"genderText === '男'\" icon=\"el-icon-male\"></app-icon>\n      <app-icon class=\"mr-2\" v-else icon=\"el-icon-cherry\"></app-icon>\n    </app-header>\n    <!-- 属性面板 -->\n    <app-panel :show=\"options.showPanelScore\">\n      <!-- 境界 门派 -->\n      <div class=\"app-score-row\">\n        <div class=\"app-score-title font-cursive\" v-html=\"score.level\"></div>\n        <div class=\"app-score-value font-cursive\" v-text=\"familyText\"></div>\n      </div>\n      <!-- 气血 -->\n      <el-progress class=\"app-progress app-progress-hp\" :text-inside=\"true\" :stroke-width=\"16\" :percentage=\"hpPercentage\"></el-progress>\n      <!-- 内力 -->\n      <el-progress class=\"app-progress app-progress-mp\" :text-inside=\"true\" :stroke-width=\"16\" :percentage=\"mpPercentage\"></el-progress>\n      <!-- 经验 -->\n      <div class=\"app-score-row\">\n        <div class=\"app-score-title font-cursive\">经验</div>\n        <div class=\"app-score-value\" v-text=\"jyText\"></div>\n      </div>\n      <!-- 潜能 -->\n      <div class=\"app-score-row\">\n        <div class=\"app-score-title font-cursive\">潜能</div>\n        <div class=\"app-score-value\" v-text=\"qnText\"></div>\n      </div>\n    </app-panel>\n\n    <!-- 任务标题 -->\n    <app-header title=\"任务\" v-model:show=\"options.showPanelTask\"></app-header>\n    <!-- 任务面板 -->\n    <app-panel :show=\"options.showPanelTask\">\n      <!-- 副本 -->\n      <div class=\"app-task-row\" :class=\"20>fbCount?'red-text':'green-text'\">\n        <div class=\"app-task-title\">日常副本</div>\n        <div class=\"app-task-value font-monospace\">{{fbCount}}/20</div>\n      </div>\n      <!-- 请安 -->\n      <div class=\"app-task-row red-text\" v-show=\"qaComplete===false\">\n        <div class=\"app-task-title\">日常请安</div>\n        <div class=\"app-task-value\">未完成</div>\n      </div>\n      <!-- 师门 -->\n      <div class=\"app-task-row\" :class=\"20>smCount?'red-text':'green-text'\">\n        <div class=\"app-task-title\">日常师门</div>\n        <div class=\"app-task-value font-monospace\">{{smCount}}/20/{{smTotal}}</div>\n      </div>\n      <div class=\"app-task-row red-text\" v-show=\"smTarget\">\n        <div class=\"app-task-title\">师门目标</div>\n        <div class=\"app-task-value font-cursive\" v-html=\"smTarget\"></div>\n      </div>\n      <!-- 追捕 -->\n      <div class=\"app-task-row\" :class=\"20>ymCount?'red-text':'green-text'\">\n        <div class=\"app-task-title\">日常追捕</div>\n        <div class=\"app-task-value font-monospace\">{{ymCount}}/20/{{ymTotal}}</div>\n      </div>\n      <div class=\"app-task-row red-text\" v-show=\"ymTarget\">\n        <div class=\"app-task-title\">追捕目标</div>\n        <div class=\"app-task-value\">\n          <span>{{ymTargetX}} {{ymTargetY}}</span>\n          <span class=\"yellow-text pl-2\">{{ymTarget}}</span>\n        </div>\n      </div>\n\n      <!-- 武道塔 -->\n      <div class=\"app-task-row\" :class=\"wdComplete===false||wdTotal>wdCount?'red-text':'green-text'\">\n        <div class=\"app-task-title\">日常武道</div>\n        <div class=\"app-task-value\">\n          <span v-show=\"wdComplete===false\">可重置</span>\n          <span class=\"font-monospace pl-2\">{{wdCount}}/{{wdTotal}}</span>\n        </div>\n      </div>\n      <!-- 运镖 -->\n      <div class=\"app-task-row\" :class=\"20>ybCount?'red-text':'green-text'\">\n        <div class=\"app-task-title\">周常运镖</div>\n        <div class=\"app-task-value font-monospace\">{{ybCount}}/20/{{ybTotal}}</div>\n      </div>\n      <!-- 襄阳战 -->\n      <div class=\"app-task-row\" :class=\"xyComplete===false?'red-text':'green-text'\">\n        <div class=\"app-task-title\">周常襄阳</div>\n        <div class=\"app-task-value\" v-text=\"xyComplete?'已完成':'未完成'\"></div>\n      </div>\n      <!-- 门派 BOSS -->\n      <div class=\"app-task-row\" :class=\"mpComplete===false?'red-text':'green-text'\">\n        <div class=\"app-task-title\">周常门派</div>\n        <div class=\"app-task-value\" v-text=\"mpComplete?'已完成':'未完成'\"></div>\n      </div>\n      <!-- 按钮 -->\n      <app-button @click=\"options.showTaskDialog=true;\">日常</app-button>\n      <!-- 弹窗 -->\n      <app-dialog width=\"24rem\" title=\"日常任务\" v-model:show=\"options.showTaskDialog\">\n        <div class=\"app-task-option-title\">副本扫荡</div>\n        <el-checkbox label=\"开启\" v-model=\"options.canTaskFb\"></el-checkbox>\n        <el-select v-show=\"options.canTaskFb\" v-model=\"options.canTaskFbId\" style=\"width:6rem;margin:0 0.5rem 0.25rem 0;\">\n          <el-option v-for=\"x in FUBEN_LIST\" :label=\"x.name\" :value=\"x.id\" :key=\"x.id + x.name\"></el-option>\n        </el-select>\n        <el-select v-show=\"options.canTaskFb\" v-model=\"options.canTaskFbType\" style=\"width:4.5rem;margin:0 0.5rem 0.25rem 0;\">\n          <el-option label=\"普通\" :value=\"0\"></el-option>\n          <el-option label=\"困难\" :value=\"1\"></el-option>\n        </el-select>\n        <el-checkbox label=\"古宗门\" v-model=\"options.canTaskGzm\" v-show=\"options.canTaskFb\"></el-checkbox>\n\n        <div v-show=\"levelText!=='武神'\" class=\"app-task-option-title\">自动请安</div>\n        <el-checkbox label=\"开启\" v-show=\"levelText!=='武神'\" v-model=\"options.canTaskQa\"></el-checkbox>\n        <div class=\"app-task-option-title\">自动师门</div>\n        <el-checkbox label=\"开启\" v-model=\"options.canTaskSm\" ></el-checkbox>\n        <el-checkbox label=\"仓库物品\" v-show=\"options.canTaskSm\" v-model=\"options.canTaskSmStore\"></el-checkbox>\n        <el-checkbox label=\"师门令牌\" v-show=\"options.canTaskSm\" v-model=\"options.canTaskSmCard\"></el-checkbox>\n        <el-checkbox label=\"允许放弃\" v-show=\"options.canTaskSm\" v-model=\"options.canTaskSmGiveup\"></el-checkbox>\n        <div class=\"app-task-option-title\">自动衙门追捕</div>\n        <el-checkbox label=\"开启\" v-model=\"options.canTaskYm\"></el-checkbox>\n        <el-checkbox label=\"元宝扫荡\" v-show=\"options.canTaskYm\" v-model=\"options.canTaskYmSweep\"></el-checkbox>\n        <el-checkbox label=\"允许放弃\" v-show=\"options.canTaskYm\" v-model=\"options.canTaskYmGiveup\"></el-checkbox>\n        <div class=\"app-task-option-title\">自动武道塔</div>\n        <el-checkbox label=\"开启\" v-model=\"options.canTaskWd\"></el-checkbox>\n\n        <div class=\"app-task-option-title\">挂机</div>\n        <el-checkbox label=\"挖矿\" v-model=\"options.canTaskEndWk\"></el-checkbox>\n        <el-checkbox label=\"闭关\" v-model=\"options.canTaskEndBg\"></el-checkbox>\n        <el-checkbox label=\"打坐\" v-model=\"options.canTaskEndDz\"></el-checkbox>\n        <app-button class=\"app-task-button\" @click=\"options.showTaskDialog=false;toTask();\">开始日常</app-button>\n      </app-dialog>\n    </app-panel>\n\n    <!-- 快捷标题 -->\n    <app-header title=\"快捷\" v-model:show=\"options.showPanelOnekey\"></app-header>\n    <!-- 快捷面板 -->\n    <app-panel :show=\"options.showPanelOnekey\">\n      <app-button @click=\"toClear()\">清包</app-button>\n      <app-button @click=\"toWakuang()\">挖矿</app-button>\n      <app-button @click=\"toXiulian()\">修炼</app-button>\n    </app-panel>\n\n    <!-- 出招标题 -->\n    <app-header title=\"出招\" v-model:show=\"options.showPanelPerform\"></app-header>\n    <!-- 出招面板 -->\n    <app-panel :show=\"options.showPanelPerform\">\n      <!-- perform -->\n\n    </app-panel>\n\n  </teleport>\n\n\n  <!-- 右侧边栏 -->\n  <teleport to=\"#app-right\" v-show=\"id\">\n    <!-- 频道标题 -->\n    <app-header title=\"聊天频道\" v-model:show=\"options.showPanelChannel\">\n      <app-icon class=\"mr-2\" icon=\"el-icon-setting\" @click=\"options.showChannelDialog=true;\"></app-icon>\n    </app-header>\n    <!-- 频道弹窗 -->\n    <app-dialog width=\"232px\" title=\"聊天频道设置\" v-model:show=\"options.showChannelDialog\">\n      <el-checkbox v-model=\"options.showChannelCh\" label=\"世界\"></el-checkbox>\n      <el-checkbox v-model=\"options.showChannelTm\" label=\"队伍\"></el-checkbox>\n      <el-checkbox v-model=\"options.showChannelFa\" label=\"门派\"></el-checkbox>\n      <el-checkbox v-model=\"options.showChannelPt\" label=\"帮会\"></el-checkbox>\n      <div style=\"width:100%;\"></div>\n      <el-checkbox v-model=\"options.showChannelEs\" label=\"全区\"></el-checkbox>\n      <el-checkbox v-model=\"options.showChannelRu\" label=\"谣言\"></el-checkbox>\n      <el-checkbox v-model=\"options.showChannelSy\" label=\"系统\"></el-checkbox>\n    </app-dialog>\n    <!-- 频道面板 -->\n    <app-panel class=\"app-channel\" :show=\"options.showPanelRoom\">\n      <div class=\"app-chat-list\">\n        <div class=\"app-chat\" v-for=\"x in chatList\" :class=\"x.isSelf?'app-chat-self':''\">\n          <div class=\"app-chat-title\">\n            <span class=\"app-chat-time\" v-text=\"x.timeText\" v-show=\"x.isSelf\"></span>\n            <span class=\"app-chat-name\" v-html=\"x.titleHtml\" @click=\"send(x.command)\"></span>\n            <span class=\"app-chat-time\" v-text=\"x.timeText\" v-show=\"!x.isSelf\"></span>\n          </div>\n          <div class=\"app-chat-content\" v-html=\"x.contentHtml\"></div>\n        </div>\n        <div id=\"app-channel-bottom\"></div>\n      </div>\n\n      <!-- 频道选择器 -->\n      <el-select class=\"app-channel-select\" v-model=\"channelValue\">\n        <el-option v-for=\"x in channelList\" :label=\"x.label\" :value=\"x.value\" :key=\"x.value\"></el-option>\n      </el-select>\n      <!-- 发言输入框 -->\n      <div class=\"app-channel-input\">\n        <el-input\n          type=\"textarea\" rows=\"2\" resize=\"none\" maxlength=\"200\" show-word-limit\n          v-model=\"chatValue\" v-on:keyup.enter=\"sendChat()\"\n        ></el-input>\n        <app-icon class=\"ml-2\" icon=\"el-icon-s-promotion\" @click=\"sendChat()\"></app-icon>\n      </div>\n    </app-panel>\n  </teleport>\n</div>\n<div id=\"app-left\" class=\"app-sidebar\"></div>\n<div id=\"app-right\" class=\"app-sidebar\"></div>\n";

  var ValkyrieStyle = "html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}main{display:block}h1{font-size:2em;margin:.67em 0}hr{box-sizing:content-box;height:0;overflow:visible}pre{font-family:monospace,monospace;font-size:1em}a{background-color:transparent}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}img{border-style:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,input{overflow:visible}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}[type=button]::-moz-focus-inner,[type=reset]::-moz-focus-inner,[type=submit]::-moz-focus-inner,button::-moz-focus-inner{border-style:none;padding:0}[type=button]:-moz-focusring,[type=reset]:-moz-focusring,[type=submit]:-moz-focusring,button:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:.35em .75em .625em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal}progress{vertical-align:baseline}textarea{overflow:auto}[type=checkbox],[type=radio]{box-sizing:border-box;padding:0}[type=number]::-webkit-inner-spin-button,[type=number]::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=search]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}details{display:block}summary{display:list-item}[hidden],template{display:none}\nhtml{background-color:#000}body{background-color:rgba(0,0,0,.8)!important;display:flex;flex-direction:row;flex-wrap:nowrap;font-family:Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,微软雅黑,Arial,sans-serif;font-size:16px;justify-content:center;width:100%}#app-left{order:1}.container,.login-content{border-left:4px solid rgba(64,64,64,.5);border-right:4px solid rgba(64,64,64,.5);flex:1 1 auto;font-size:1rem!important;margin:0;max-width:768px;order:2;width:16rem}#app-right{order:3}.app-sidebar{color:#d8d8d8;display:flex;flex:0 1 auto;flex-direction:column;margin:0;width:16rem}.font-cursive{font-family:Ma Shan Zheng,cursive!important}.font-monospace{font-family:monospace!important}.red-text{color:#fa6464}.green-text{color:#329632}.yellow-text{color:#fafa64}.unselectable{user-select:none}.selectable{user-select:text}.cursor-pointer{cursor:pointer}.content-bottom,.dialog,.room_items,.task-desc,pre{font-size:.75rem}.login-content .content{background-color:rgba(64,64,64,.25)}.login-content .panel_item{background-color:rgba(0,0,0,.5);border-color:#404040!important;color:#d8d8d8}.login-content .panel_item:not(.active):hover{background-color:rgba(0,128,64,.25);color:#d8d8d8}.login-content .bottom{background-color:rgba(0,0,0,.5)}.login-content iframe{background-color:#d8d8d8}.login-content .signinfo,.login-content .signinfo a{color:#d8d8d8}.room_exits{display:flex;justify-content:center}.state-bar>.title{font-size:.75rem;line-height:2rem;padding-left:1rem}.dialog .obj-money,.dialog .skill-level,.dialog .stats-span,.dialog .top-sc{font-family:monospace}.setting-item[for=backcolor],.setting-item[for=fontcolor],.setting-item[for=fontsize]{display:none!important}.content-message>pre{font-size:.75rem;padding:0 2.25rem 0 .5rem}.room_items>.item-commands{margin-left:.5rem}.room-item>.item-name{margin-left:1rem}.tool-bar>.tool-item{background-color:rgba(0,0,0,.25);border-color:#404040;color:hsla(0,0%,100%,.5);font-size:.75rem;height:2.25rem;margin:0 .25rem .25rem 0;width:2.25rem}.tool-bar>.tool-item>span.tool-icon{line-height:1rem}.tool-bar>.tool-item>span.tool-text,.tool-bar>.tool-item>span[cass=tool-text]{font-weight:400;line-height:1.5rem}.tool-bar.right-bar{right:0}.tool-item[command=showtool]{line-height:2.25rem}.combat-commands,.room-commands{padding-left:.75rem;position:relative;white-space:pre-wrap}.combat-commands:before,.room-commands:before{background-color:rgba(0,0,0,.5);border-color:#404040;color:#d8d8d8;height:100%;left:0;position:absolute;top:0}.text-align-left{text-align:left}.text-align-right{text-align:right}.text-align-center{text-align:center}.d-inline{display:inline}.d-block{display:block}.d-inline-block{display:inline-block}.d-none{display:none}.d-flex{display:flex}.flex-row{flex-direction:row}.flex-row-reverse{flex-direction:row-reverse}.flex-column{flex-direction:column}.flex-column-reverse{flex-direction:column-reverse}.flex-nowrap{flex-wrap:nowrap}.flex-wrap{flex-wrap:wrap}.flex-wrap-reverse{flex-wrap:wrap-reverse}.justify-start{justify-content:start}.jusify-end{justify-content:end}.justify-center{justify-content:center}.justify-space-between{justify-content:space-between}.justify-space-around{justify-content:space-around}.align-start{align-items:start}.align-end{align-items:end}.align-center{align-items:center}.align-baseline{align-items:baseline}.align-stretch{align-items:stretch}.flex-0-0{flex:0 0 auto}.flex-1-0{flex:1 0 auto}.flex-0-1{flex:0 1 auto}.flex-1-1{flex:1 1 auto}.ma-0{margin:0}.ma-1{margin:4px}.ma-2{margin:8px}.ma-3{margin:12px}.ma-4{margin:16px}.ma-5{margin:20px}.ma-6{margin:24px}.ma-7{margin:28px}.ma-8{margin:32px}.ma-9{margin:36px}.ma-10{margin:40px}.ma-11{margin:44px}.ma-12{margin:48px}.ma-13{margin:52px}.ma-14{margin:56px}.ma-15{margin:60px}.ma-16{margin:64px}.ma-auto{margin:auto}.mx-0{margin-left:0;margin-right:0}.mx-1{margin-left:4px;margin-right:4px}.mx-2{margin-left:8px;margin-right:8px}.mx-3{margin-left:12px;margin-right:12px}.mx-4{margin-left:16px;margin-right:16px}.mx-5{margin-left:20px;margin-right:20px}.mx-6{margin-left:24px;margin-right:24px}.mx-7{margin-left:28px;margin-right:28px}.mx-8{margin-left:32px;margin-right:32px}.mx-9{margin-left:36px;margin-right:36px}.mx-10{margin-left:40px;margin-right:40px}.mx-11{margin-left:44px;margin-right:44px}.mx-12{margin-left:48px;margin-right:48px}.mx-13{margin-left:52px;margin-right:52px}.mx-14{margin-left:56px;margin-right:56px}.mx-15{margin-left:60px;margin-right:60px}.mx-16{margin-left:64px;margin-right:64px}.mx-auto{margin-left:auto;margin-right:auto}.my-0{margin-bottom:0;margin-top:0}.my-1{margin-bottom:4px;margin-top:4px}.my-2{margin-bottom:8px;margin-top:8px}.my-3{margin-bottom:12px;margin-top:12px}.my-4{margin-bottom:16px;margin-top:16px}.my-5{margin-bottom:20px;margin-top:20px}.my-6{margin-bottom:24px;margin-top:24px}.my-7{margin-bottom:28px;margin-top:28px}.my-8{margin-bottom:32px;margin-top:32px}.my-9{margin-bottom:36px;margin-top:36px}.my-10{margin-bottom:40px;margin-top:40px}.my-11{margin-bottom:44px;margin-top:44px}.my-12{margin-bottom:48px;margin-top:48px}.my-13{margin-bottom:52px;margin-top:52px}.my-14{margin-bottom:56px;margin-top:56px}.my-15{margin-bottom:60px;margin-top:60px}.my-16{margin-bottom:64px;margin-top:64px}.my-auto{margin-bottom:auto;margin-top:auto}.mt-0{margin-top:0}.mt-1{margin-top:4px}.mt-2{margin-top:8px}.mt-3{margin-top:12px}.mt-4{margin-top:16px}.mt-5{margin-top:20px}.mt-6{margin-top:24px}.mt-7{margin-top:28px}.mt-8{margin-top:32px}.mt-9{margin-top:36px}.mt-10{margin-top:40px}.mt-11{margin-top:44px}.mt-12{margin-top:48px}.mt-13{margin-top:52px}.mt-14{margin-top:56px}.mt-15{margin-top:60px}.mt-16{margin-top:64px}.mt-auto{margin-top:auto}.mr-0{margin-right:0}.mr-1{margin-right:4px}.mr-2{margin-right:8px}.mr-3{margin-right:12px}.mr-4{margin-right:16px}.mr-5{margin-right:20px}.mr-6{margin-right:24px}.mr-7{margin-right:28px}.mr-8{margin-right:32px}.mr-9{margin-right:36px}.mr-10{margin-right:40px}.mr-11{margin-right:44px}.mr-12{margin-right:48px}.mr-13{margin-right:52px}.mr-14{margin-right:56px}.mr-15{margin-right:60px}.mr-16{margin-right:64px}.mr-auto{margin-right:auto}.mb-0{margin-bottom:0}.mb-1{margin-bottom:4px}.mb-2{margin-bottom:8px}.mb-3{margin-bottom:12px}.mb-4{margin-bottom:16px}.mb-5{margin-bottom:20px}.mb-6{margin-bottom:24px}.mb-7{margin-bottom:28px}.mb-8{margin-bottom:32px}.mb-9{margin-bottom:36px}.mb-10{margin-bottom:40px}.mb-11{margin-bottom:44px}.mb-12{margin-bottom:48px}.mb-13{margin-bottom:52px}.mb-14{margin-bottom:56px}.mb-15{margin-bottom:60px}.mb-16{margin-bottom:64px}.mb-auto{margin-bottom:auto}.ml-0{margin-left:0}.ml-1{margin-left:4px}.ml-2{margin-left:8px}.ml-3{margin-left:12px}.ml-4{margin-left:16px}.ml-5{margin-left:20px}.ml-6{margin-left:24px}.ml-7{margin-left:28px}.ml-8{margin-left:32px}.ml-9{margin-left:36px}.ml-10{margin-left:40px}.ml-11{margin-left:44px}.ml-12{margin-left:48px}.ml-13{margin-left:52px}.ml-14{margin-left:56px}.ml-15{margin-left:60px}.ml-16{margin-left:64px}.ml-auto{margin-left:auto}.ma-n1{margin:-4px}.ma-n2{margin:-8px}.ma-n3{margin:-12px}.ma-n4{margin:-16px}.ma-n5{margin:-20px}.ma-n6{margin:-24px}.ma-n7{margin:-28px}.ma-n8{margin:-32px}.ma-n9{margin:-36px}.ma-n10{margin:-40px}.ma-n11{margin:-44px}.ma-n12{margin:-48px}.ma-n13{margin:-52px}.ma-n14{margin:-56px}.ma-n15{margin:-60px}.ma-n16{margin:-64px}.mx-n1{margin-left:-4px;margin-right:-4px}.mx-n2{margin-left:-8px;margin-right:-8px}.mx-n3{margin-left:-12px;margin-right:-12px}.mx-n4{margin-left:-16px;margin-right:-16px}.mx-n5{margin-left:-20px;margin-right:-20px}.mx-n6{margin-left:-24px;margin-right:-24px}.mx-n7{margin-left:-28px;margin-right:-28px}.mx-n8{margin-left:-32px;margin-right:-32px}.mx-n9{margin-left:-36px;margin-right:-36px}.mx-n10{margin-left:-40px;margin-right:-40px}.mx-n11{margin-left:-44px;margin-right:-44px}.mx-n12{margin-left:-48px;margin-right:-48px}.mx-n13{margin-left:-52px;margin-right:-52px}.mx-n14{margin-left:-56px;margin-right:-56px}.mx-n15{margin-left:-60px;margin-right:-60px}.mx-n16{margin-left:-64px;margin-right:-64px}.my-n1{margin-bottom:-4px;margin-top:-4px}.my-n2{margin-bottom:-8px;margin-top:-8px}.my-n3{margin-bottom:-12px;margin-top:-12px}.my-n4{margin-bottom:-16px;margin-top:-16px}.my-n5{margin-bottom:-20px;margin-top:-20px}.my-n6{margin-bottom:-24px;margin-top:-24px}.my-n7{margin-bottom:-28px;margin-top:-28px}.my-n8{margin-bottom:-32px;margin-top:-32px}.my-n9{margin-bottom:-36px;margin-top:-36px}.my-n10{margin-bottom:-40px;margin-top:-40px}.my-n11{margin-bottom:-44px;margin-top:-44px}.my-n12{margin-bottom:-48px;margin-top:-48px}.my-n13{margin-bottom:-52px;margin-top:-52px}.my-n14{margin-bottom:-56px;margin-top:-56px}.my-n15{margin-bottom:-60px;margin-top:-60px}.my-n16{margin-bottom:-64px;margin-top:-64px}.mt-n1{margin-top:-4px}.mt-n2{margin-top:-8px}.mt-n3{margin-top:-12px}.mt-n4{margin-top:-16px}.mt-n5{margin-top:-20px}.mt-n6{margin-top:-24px}.mt-n7{margin-top:-28px}.mt-n8{margin-top:-32px}.mt-n9{margin-top:-36px}.mt-n10{margin-top:-40px}.mt-n11{margin-top:-44px}.mt-n12{margin-top:-48px}.mt-n13{margin-top:-52px}.mt-n14{margin-top:-56px}.mt-n15{margin-top:-60px}.mt-n16{margin-top:-64px}.mr-n1{margin-right:-4px}.mr-n2{margin-right:-8px}.mr-n3{margin-right:-12px}.mr-n4{margin-right:-16px}.mr-n5{margin-right:-20px}.mr-n6{margin-right:-24px}.mr-n7{margin-right:-28px}.mr-n8{margin-right:-32px}.mr-n9{margin-right:-36px}.mr-n10{margin-right:-40px}.mr-n11{margin-right:-44px}.mr-n12{margin-right:-48px}.mr-n13{margin-right:-52px}.mr-n14{margin-right:-56px}.mr-n15{margin-right:-60px}.mr-n16{margin-right:-64px}.mb-n1{margin-bottom:-4px}.mb-n2{margin-bottom:-8px}.mb-n3{margin-bottom:-12px}.mb-n4{margin-bottom:-16px}.mb-n5{margin-bottom:-20px}.mb-n6{margin-bottom:-24px}.mb-n7{margin-bottom:-28px}.mb-n8{margin-bottom:-32px}.mb-n9{margin-bottom:-36px}.mb-n10{margin-bottom:-40px}.mb-n11{margin-bottom:-44px}.mb-n12{margin-bottom:-48px}.mb-n13{margin-bottom:-52px}.mb-n14{margin-bottom:-56px}.mb-n15{margin-bottom:-60px}.mb-n16{margin-bottom:-64px}.ml-n1{margin-left:-4px}.ml-n2{margin-left:-8px}.ml-n3{margin-left:-12px}.ml-n4{margin-left:-16px}.ml-n5{margin-left:-20px}.ml-n6{margin-left:-24px}.ml-n7{margin-left:-28px}.ml-n8{margin-left:-32px}.ml-n9{margin-left:-36px}.ml-n10{margin-left:-40px}.ml-n11{margin-left:-44px}.ml-n12{margin-left:-48px}.ml-n13{margin-left:-52px}.ml-n14{margin-left:-56px}.ml-n15{margin-left:-60px}.ml-n16{margin-left:-64px}.pa-0{padding:0}.pa-1{padding:4px}.pa-2{padding:8px}.pa-3{padding:12px}.pa-4{padding:16px}.pa-5{padding:20px}.pa-6{padding:24px}.pa-7{padding:28px}.pa-8{padding:32px}.pa-9{padding:36px}.pa-10{padding:40px}.pa-11{padding:44px}.pa-12{padding:48px}.pa-13{padding:52px}.pa-14{padding:56px}.pa-15{padding:60px}.pa-16{padding:64px}.px-0{padding-left:0;padding-right:0}.px-1{padding-left:4px;padding-right:4px}.px-2{padding-left:8px;padding-right:8px}.px-3{padding-left:12px;padding-right:12px}.px-4{padding-left:16px;padding-right:16px}.px-5{padding-left:20px;padding-right:20px}.px-6{padding-left:24px;padding-right:24px}.px-7{padding-left:28px;padding-right:28px}.px-8{padding-left:32px;padding-right:32px}.px-9{padding-left:36px;padding-right:36px}.px-10{padding-left:40px;padding-right:40px}.px-11{padding-left:44px;padding-right:44px}.px-12{padding-left:48px;padding-right:48px}.px-13{padding-left:52px;padding-right:52px}.px-14{padding-left:56px;padding-right:56px}.px-15{padding-left:60px;padding-right:60px}.px-16{padding-left:64px;padding-right:64px}.py-0{padding-bottom:0;padding-top:0}.py-1{padding-bottom:4px;padding-top:4px}.py-2{padding-bottom:8px;padding-top:8px}.py-3{padding-bottom:12px;padding-top:12px}.py-4{padding-bottom:16px;padding-top:16px}.py-5{padding-bottom:20px;padding-top:20px}.py-6{padding-bottom:24px;padding-top:24px}.py-7{padding-bottom:28px;padding-top:28px}.py-8{padding-bottom:32px;padding-top:32px}.py-9{padding-bottom:36px;padding-top:36px}.py-10{padding-bottom:40px;padding-top:40px}.py-11{padding-bottom:44px;padding-top:44px}.py-12{padding-bottom:48px;padding-top:48px}.py-13{padding-bottom:52px;padding-top:52px}.py-14{padding-bottom:56px;padding-top:56px}.py-15{padding-bottom:60px;padding-top:60px}.py-16{padding-bottom:64px;padding-top:64px}.pt-0{padding-top:0}.pt-1{padding-top:4px}.pt-2{padding-top:8px}.pt-3{padding-top:12px}.pt-4{padding-top:16px}.pt-5{padding-top:20px}.pt-6{padding-top:24px}.pt-7{padding-top:28px}.pt-8{padding-top:32px}.pt-9{padding-top:36px}.pt-10{padding-top:40px}.pt-11{padding-top:44px}.pt-12{padding-top:48px}.pt-13{padding-top:52px}.pt-14{padding-top:56px}.pt-15{padding-top:60px}.pt-16{padding-top:64px}.pr-0{padding-right:0}.pr-1{padding-right:4px}.pr-2{padding-right:8px}.pr-3{padding-right:12px}.pr-4{padding-right:16px}.pr-5{padding-right:20px}.pr-6{padding-right:24px}.pr-7{padding-right:28px}.pr-8{padding-right:32px}.pr-9{padding-right:36px}.pr-10{padding-right:40px}.pr-11{padding-right:44px}.pr-12{padding-right:48px}.pr-13{padding-right:52px}.pr-14{padding-right:56px}.pr-15{padding-right:60px}.pr-16{padding-right:64px}.pb-0{padding-bottom:0}.pb-1{padding-bottom:4px}.pb-2{padding-bottom:8px}.pb-3{padding-bottom:12px}.pb-4{padding-bottom:16px}.pb-5{padding-bottom:20px}.pb-6{padding-bottom:24px}.pb-7{padding-bottom:28px}.pb-8{padding-bottom:32px}.pb-9{padding-bottom:36px}.pb-10{padding-bottom:40px}.pb-11{padding-bottom:44px}.pb-12{padding-bottom:48px}.pb-13{padding-bottom:52px}.pb-14{padding-bottom:56px}.pb-15{padding-bottom:60px}.pb-16{padding-bottom:64px}.pl-0{padding-left:0}.pl-1{padding-left:4px}.pl-2{padding-left:8px}.pl-3{padding-left:12px}.pl-4{padding-left:16px}.pl-5{padding-left:20px}.pl-6{padding-left:24px}.pl-7{padding-left:28px}.pl-8{padding-left:32px}.pl-9{padding-left:36px}.pl-10{padding-left:40px}.pl-11{padding-left:44px}.pl-12{padding-left:48px}.pl-13{padding-left:52px}.pl-14{padding-left:56px}.pl-15{padding-left:60px}.pl-16{padding-left:64px}\n.el-dialog{background-color:rgba(32,32,32,.9);box-shadow:0 0 2px hsla(0,0%,100%,.5);margin:unset!important;padding:0 1rem 1rem;width:auto}.el-dialog__wrapper{align-items:center;display:flex;justify-content:center}.el-dialog__title{color:#d8d8d8;font-family:Ma Shan Zheng,cursive;font-size:1.25rem}.el-dialog__body{color:silver;display:flex;flex-wrap:wrap;padding:0!important}\n.el-checkbox{margin-right:.5rem}.el-checkbox__inner,.el-checkbox__input.is-disabled .el-checkbox__inner,.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{background-color:rgba(64,64,64,.75);border-color:grey}.el-checkbox__input.is-checked .el-checkbox__inner,.el-checkbox__input.is-indeterminate .el-checkbox__inner{background-color:#008040;border-color:#008040}.el-checkbox__input+.el-checkbox__label{color:#d8d8d8;font-size:.75rem;line-height:1.5rem;padding-left:.25rem}.el-checkbox__input.is-disabled+span.el-checkbox__label{color:#404040}.el-checkbox__input.is-checked+.el-checkbox__label{color:#008040}\n.el-select-dropdown{background-color:rgba(64,64,64,.9);border:none}.el-select-dropdown__item{color:#d8d8d8;font-size:.75rem;height:1.5rem;line-height:1.5rem}.el-select-dropdown__item.hover,.el-select-dropdown__item:hover{background-color:rgba(0,128,64,.25)}.el-select-dropdown__item.selected{color:#008040;font-weight:400}.el-select .el-input__inner:focus{border-color:#008040}\n.el-input .el-input__inner,.el-input.is-disabled .el-input__inner{background-color:rgba(64,64,64,.75);border-color:#404040;color:#d8d8d8;font-size:.75rem;height:1.5rem;line-height:1.5rem}.el-input__icon{line-height:1.5rem;width:1.5rem}.el-textarea__inner{background-color:rgba(64,64,64,.75);border-color:rgba(64,64,64,.75);color:#d8d8d8}.el-textarea__inner:focus,.el-textarea__inner:hover{border-color:rgba(0,128,64,.75)}.el-input__inner[disabled]{color:#404040}\n.el-popper[x-placement^=top] .popper__arrow,.el-popper[x-placement^=top] .popper__arrow:after{border-top-color:rgba(64,64,64,.9)}.el-popper[x-placement^=bottom] .popper__arrow,.el-popper[x-placement^=bottom] .popper__arrow:after{border-bottom-color:rgba(64,64,64,.9)}\n.app-panel{display:flex;flex-direction:column;overflow:hidden;padding:.25rem .5rem}.app-panel-enter-active,.app-panel-leave-active{transition:all .5s ease}.app-panel-enter-from,.app-panel-leave-to{margin:0;max-height:0;opacity:.1;padding:0}.app-panel-enter-to,.app-panel-leave-from{max-height:25rem;opacity:.9}\n.app-header,div.app-room-title,div.dialog>div.dialog-header,div.mypanel>ul>li.panel_item.active{align-items:center;background-color:rgba(32,32,32,.75)!important;color:#d8d8d8!important;display:flex;flex-direction:row;flex-wrap:nowrap;font-size:1.25rem;height:2rem!important;justify-content:space-between;line-height:2rem;margin-bottom:.125rem;padding:0 .5rem}div.mypanel>ul>li.panel_item.active{font-family:Ma Shan Zheng,cursive}div.dialog>div.dialog-header{border-bottom:1px solid #404040;display:flex}div.dialog>div.dialog-header>span.dialog-icon{color:#d8d8d8;height:1.75rem;line-height:1.75rem;text-align:center;width:1.75rem}div.dialog>div.dialog-header>span.dialog-title{color:#d8d8d8;flex:1 0 auto;font-family:Ma Shan Zheng,cursive;height:1.75rem;line-height:1.75rem}div.dialog>div.dialog-header>span.dialog-close{color:#d8d8d8;height:1.75rem;line-height:1.75rem;right:0;text-align:center;width:1.75rem}\n.app-button,.combat-commands>.pfm-item,.item-commands>span.disabled,.item-commands>span[cmd],.room-commands>.act-item{background-color:rgba(0,0,0,.5);border:1px solid #404040;border-radius:.25rem;color:#d8d8d8;cursor:pointer;font-size:.75rem;line-height:1.5rem;margin:0 0 .1rem .2rem;min-width:1rem;padding:0 .5rem;text-align:center;user-select:none}.app-button:hover,.combat-commands>.pfm-item:hover,.item-commands>span[cmd]:hover,.room-commands>.act-item:hover{background-color:rgba(0,128,64,.25);color:#d8d8d8}.app-button:active,.combat-commands>.pfm-item:active,.item-commands>span[cmd]:active,.room-commands>.act-item:active{background-color:rgba(0,128,64,.5);color:#d8d8d8;transform:translateY(1px)}.item-commands{padding-bottom:.25rem}.app-button{font-size:1rem;margin:.1rem .2rem;padding:.2rem 0}\n#app{background-color:#404040;background-repeat:no-repeat;background-size:cover;height:100%;position:absolute;width:100%;z-index:-1}\n.app-room-desc{display:block;font-size:.75rem;text-indent:2em}.app-room-map{height:100%;width:100%}.app-room-map svg{cursor:grabbing}\n.app-score-row{display:flex;flex-direction:row;font-size:1.25rem;height:1.5rem;line-height:1.5rem}.app-score-title{flex:0 0 auto;padding:0 .5rem 0 0;text-align:center}.app-score-value{flex:0 0 auto;font-family:monospace;text-align:left;width:12rem}.app-progress{padding:0}.app-progress .el-progress-bar__outer{background-color:hsla(0,0%,50.2%,.5);border-radius:.25rem}.app-progress .el-progress-bar__inner{border-radius:.25rem}.app-progress .el-progress-bar__innerText{color:hsla(0,0%,84.7%,.9);display:flex;justify-content:space-between;line-height:16px;overflow:hidden}.app-progress-hp .el-progress-bar__inner{background-color:rgba(255,0,0,.5)}.app-progress-mp .el-progress-bar__inner{background-color:rgba(0,0,255,.5)}.app-progress-hp .el-progress-bar__innerText:before{content:\"气血 \"}.app-progress-mp .el-progress-bar__innerText:before{content:\"内力 \"}.app-progress-mp{margin-bottom:.2rem}\n.app-task-row{display:flex;font-family:Ma Shan Zheng,cursive!important}.app-task-title{flex:0 0 auto}.app-task-value{flex:1 0 auto;text-align:right}.app-task-option-title{width:100%}.app-task-button{background-color:rgba(0,0,0,.25);margin:1rem 3rem 0;width:100%}\n.app-channel{flex:1 1 auto;margin:.25rem 0}.app-chat-list{flex:1 1 auto;overflow-y:auto}.app-chat{display:flex;flex-direction:column;font-size:.75rem}.app-chat-time{color:#404040;font-family:monospace;padding:0 .25rem}.app-chat-content{background-color:rgba(64,64,64,.5);border-radius:.25rem;margin:.1rem 1rem .5rem 0;padding:.375rem;width:fit-content;word-break:break-word}.app-chat-self>.app-chat-title{align-self:flex-end}.app-chat-self>.app-chat-content{align-self:flex-end;background-color:rgba(96,96,96,.5);margin:.1rem 0 .5rem 1rem}.app-channel-select{width:4.5rem}.app-channel-select .el-input__inner{background-color:rgba(32,32,32,.5);border-bottom-color:transparent;border-bottom-left-radius:unset;border-bottom-right-radius:unset}.app-channel-input{align-items:center;display:flex;flex-direction:row}.app-channel-input textarea{background-color:rgba(32,32,32,.5);border-top-left-radius:unset;font-size:.75rem}.app-channel-input .el-input__count{background-color:transparent}";

  class Emitter {
    constructor() {
      this.id = 0; // 累计 +1
      this.types = {}; // { type1: [id1, id2, ...], ... }
      this.handlers = {}; // { id1: { id1, type1, handler1 }, ... }
    }
    on(type, handler) {
      const id = ++ this.id;
      if ((this.types[type] instanceof Array) === false) this.types[type] = [];
      this.types[type].push(id);
      this.handlers[id] = { id, type, handler };
      // 返回一个注销自身的方法
      const off = () => this.off(id);
      return off
    }
    off(id) {
      const handler = this.handlers[id];
      delete this.handlers[id];
      const type = handler.type;
      const index = this.types[type].findIndex(item => item === id);
      delete this.types[type][index];
    }
    emit(type, data) {
      const ids = this.types[type];
      // 检查
      if ((ids instanceof Array) === false || ids.length === 0) return
      // 遍历
      ids.forEach(id => {
        if (id === undefined) return
        const off = () => this.off(id); // 注销
        const { handler } = this.handlers[id];
        if (typeof handler === `function`) handler(data, off); // 第二个参数为注销自身的方法
      });
    }
  }

  var ValkyrieWorkerContent = "// 此文件为 Worker 线程中执行的代码\nclass Worker {\n  constructor() {\n    this.websocket = undefined\n    this.commands = []\n    this.senderState = false\n  }\n  // 发送事件至主线程\n  post(type, ...args) {\n    postMessage({ type, args })\n  }\n  // 创建 WebSocket 对象\n  create(uri) {\n    this.websocket = new WebSocket(uri)\n    this.websocket.onopen = () => {\n      this.post(`readyState`, this.websocket.readyState)\n      console.log(`WebSocket.readyState: ${this.websocket.readyState}`)\n      this.post(`onopen`)\n      console.log(`WebSocket.onopen`)\n    }\n    this.websocket.onclose = () => {\n      this.post(`readyState`, this.websocket.readyState)\n      console.log(`WebSocket.readyState: ${this.websocket.readyState}`)\n      this.post(`onclose`)\n      console.log(`WebSocket.onclose`)\n    }\n    this.websocket.onerror = () =>  {\n      this.post(`readyState`, this.websocket.readyState)\n      console.log(`WebSocket.readyState: ${this.websocket.readyState}`)\n      this.post(`onerror`)\n      console.log(`WebSocket.onerror`)\n    }\n    this.websocket.onmessage = event => {\n      this.post(`onmessage`, { data: event.data })\n    }\n  }\n  // 发送单个指令\n  sendCommand(command) {\n    this.websocket.send(command)\n  }\n  // 发送指令队列\n  sendCommands(...args) {\n    args = args.flat(Infinity)\n    args.forEach((item, index) => (/,/.test(item)) && (args[index] = item.split(`,`)))\n    args = args.flat(Infinity)\n    this.commands.push(...args)\n    if (this.senderState === false) {\n      this.senderState = true\n      this.sender()\n    }\n  }\n  // 停止指令队列\n  stopCommands() {\n    this.commands.splice(0)\n    this.senderState = false\n  }\n  // 循环指令队列\n  sender(ms = 256) {\n    const command = this.commands.splice(0, 1)[0] // 取首位\n    // 1. undefined\n    if (command === undefined) return (this.senderState = false)\n    // 2. number\n    const number = Number(command)\n    if (isNaN(number) === false) return this.sender(number)\n    // 3. string && custom-command\n    if (typeof command === `string` && command.includes(`{`) && command.includes(`}`)) {\n      return setTimeout(() => {\n        const data = JSON.stringify({ type: `custom-command`, command })\n        postMessage({ type: `websocketOnmessage`, args: [{ data }] })\n        this.sender()\n      }, ms)\n    }\n    // 4. string\n    if (typeof command === `string`) {\n      setTimeout(() => {\n        this.sendCommand(command)\n        this.sender()\n      }, ms)\n    }\n  }\n}\nconst worker = new Worker()\n// 接收主线程事件\nonmessage = function(event) {\n  const type = event.data.type\n  const args = event.data.args\n  try {\n    worker[type](...args)\n  } catch (error) {\n    console.error(error)\n  }\n}\n";

  function eventToData(event) {
    const data = event.data;
    if (typeof data === `string` && data[0] === `{`) {
      try { return new Function(`return ${ data };`)() } catch (error) {}
    }
    return { type: `text`, text: data }
  }
  function dataToEvent(data) {
    if (data.type === `text`) return { data: data.text }
    return { data: JSON.stringify(data) }
  }
  // String => Blob
  const WebWorkerContentBlob = new Blob([ValkyrieWorkerContent]);
  // Blob => URL
  const WebWorkerContentURL = URL.createObjectURL(WebWorkerContentBlob);
  // 子线程 Worker 对象
  const ValkyrieWebWorker = new Worker(WebWorkerContentURL);
  // 伪 WebSocket 中间件
  const ValkyrieWebSocket = {
    readyState: 0,
    onopen: () => {},
    onclose: () => {},
    onerror: () => {},
    onmessage: () => {},
  };
  // 重写全局 WebSocket 类
  unsafeWindow.WebSocket = function(uri) {
    ValkyrieWebWorker.postMessage({ type: `create`, args: [uri] });
  };
  unsafeWindow.WebSocket.prototype = {
    set onopen(fn) {
      ValkyrieWebSocket.onopen = fn;
    },
    set onclose(fn) {
      ValkyrieWebSocket.onclose = fn;
    },
    set onerror(fn) {
      ValkyrieWebSocket.onerror = fn;
    },
    set onmessage(fn) {
      ValkyrieWebSocket.onmessage = fn;
    },
    get readyState() {
      return ValkyrieWebSocket.readyState
    },
    send(command) {
      sendCommand(command);
    },
  };
  // Worker 线程事件
  ValkyrieWebWorker.onmessage = event => {
    const type = event.data.type;
    const args = event.data.args;
    // 处理函数集合
    const handlers = {
      onopen: event => {
        ValkyrieWebSocket.onopen(event);
      },
      onclose: event => {
        ValkyrieWebSocket.onclose(event);
      },
      onerror: event => {
        ValkyrieWebSocket.onerror(event);
      },
      onmessage: event => {
        onData(eventToData(event));
      },
      readyState: value => {
        ValkyrieWebSocket.readyState = value;
      },
    };
    try {
      handlers[type](...args);
    } catch (error) {
      console.log(type);
      console.log(...args);
      console.error(error);
    }
  };
  // 监听器
  const ValkyrieEmitter = new Emitter();
  // 接收 Worker 线程中的 WebSocket 的 data 数据
  function onData(data) {
    // 输出数据
    console.log(data);
    // 触发事件
    const type = data.dialog || data.type;
    ValkyrieEmitter.emit(type, data);
    // 返回至 WebSocket.onmessage 中处理
    ValkyrieWebSocket.onmessage(dataToEvent(data));
  }
  // data.type === `text`
  function onText(text, tag) {
    if (tag) {
      text = `<${tag}>${text}</${tag}>`;
    }
    onData({ type: `text`, text });
  }
  function sendCommand(command) {
    ValkyrieWebWorker.postMessage({ type: `sendCommand`, args: [command] });
    onData({ type: `sendCommand`, command });
  }
  function sendCommands(...args) {
    ValkyrieWebWorker.postMessage({ type: `sendCommands`, args });
    onData({ type: `sendCommands`, args });
  }
  function stopCommands() {
    ValkyrieWebWorker.postMessage({ type: `stopCommands` });
    onData({ type: `stopCommands` });
  }
  var ValkyrieWorker = {
    data() {
      return {
        id: ``,
        name: ``,
        serverText: ``,
        idListCache: [],
        documentWidth: 0,
      }
    },
    methods: {
      onData,
      onText,
      sendCommand,
      sendCommands,
      stopCommands,
      send: sendCommands,
      // 注册监听事件
      on(type, handler) {
        // 绑定 this 便于调用自身属性和方法
        return ValkyrieEmitter.on(type, handler.bind(this))
      },
      setCookie(name, value) {
        document.cookie = `${name}=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
        return true
      },
      getCookie(name) {
        const cookies = document.cookie.split(`;`).reduce((cookies, cookieString) => {
          const i = cookieString.indexOf(`=`);
          const name = cookieString.substr(0, i).trim();
          const value = cookieString.substr(i + 1);
          cookies[name] = value;
          return cookies
        }, {});
        return cookies[name]
      },
      setIdList(value) {
        if (value instanceof Array) {
          localStorage.setItem(`__roles__`, JSON.stringify(value));
        }
      },
      getIdList() {
        const string = localStorage.getItem(`__roles__`) || `[]`;
        return JSON.parse(string)
      },
      getValue(key) {
        if (this.id) {
          const object = JSON.parse(localStorage.getItem(this.id) || `{}`);
          return object[key] || {}
        }
      },
      setValue(key, value) {
        if (this.id) {
          const object = JSON.parse(localStorage.getItem(this.id) || `{}`);
          object[key] = value;
          localStorage.setItem(this.id, JSON.stringify(object));
          return object
        }
      },
      hasOwn(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop)
      },
    },
    mounted() {
      // 角色列表
      this.on(`roles`, function(data) {
        if (data.roles instanceof Array) {
          data.roles.forEach(item => this.idListCache.push(item));
        }
      });
      // 监听 id 值
      this.on(`login`, function(data) {
        const item = this.idListCache.find(x => x.id === data.id);
        if (item) {
          const { id, name, title } = item;
          const cookies = {
            u: this.getCookie(`u`),
            p: this.getCookie(`p`),
            s: this.getCookie(`s`),
          };
          const token = `${ cookies.u } ${ cookies.p }`;
          const server = [`一区`, `二区`, `三区`, `四区`, `五区`, `六区`][cookies.s];
          // 获取本地 idList
          const idList = this.getIdList();
          const index = idList.findIndex(x => x.id === id);
          if (index !== -1) {
            idList.splice(index, 1); // 找到就删
          }
          // 插入至首位
          idList.unshift({ id, name, title, server, cookies, token });
          // 保存
          this.setIdList(idList);
          this.id = id;
          this.name = name;
          this.serverText = server;
          unsafeWindow.id = id; // 全局标识
        }
      });
      // 监听窗口的宽度
      if (document && document.body && document.body.clientWidth) {
        this.documentWidth = document.body.clientWidth;
      }
      // 此处必须使用箭头函数使 this 指向 Vue 实例
      unsafeWindow.addEventListener(`resize`, () => {
        this.documentWidth = document.body.clientWidth;
      });
    },
  };

  var ValkyrieAwait = {
    data() {
      return {
      }
    },
    methods: {
      await(timeout = 1000) {
        return new Promise(resolve => setTimeout(() => resolve(), timeout))
      },
      awaitTaskData(timeout = 30000) {
        return new Promise(resolve => {
          const id = setTimeout(() => [resolve(false), this.onText(`获取任务数据失败。`, `hir`)], timeout);
          const clearEvent = this.on(`tasks`, data => this.hasOwn(data, `items`) && [resolve(true), clearEvent(), clearTimeout(id)]);
        })
      },
      awaitPackList(timeout = 30000) {
        return new Promise(resolve => {
          const id = setTimeout(() => [resolve(false), this.onText(`获取背包数据失败。`, `hir`)], timeout);
          const clearEvent = this.on(`pack`, data => this.hasOwn(data, `items`) && [resolve(true), clearEvent(), clearTimeout(id)]);
        })
      },
      awaitStoreList(timeout = 30000) {
        return new Promise(resolve => {
          const id = setTimeout(() => [resolve(false), this.onText(`获取仓库数据失败。`, `hir`)], timeout);
          const clearEvent = this.on(`list`, data => this.hasOwn(data, `stores`) && [resolve(true), clearEvent(), clearTimeout(id)]);
        })
      },
      awaitSellList(timeout = 30000) {
        return new Promise(resolve => {
          const id = setTimeout(() => [resolve(false), this.onText(`获取商店数据失败。`, `hir`)], timeout);
          const clearEvent = this.on(`list`, data => this.hasOwn(data, `selllist`) && [resolve(true), clearEvent(), clearTimeout(id)]);
        })
      },
      // 等待指定的房间
      awaitRoomPath(path, timeout = 30000) {
        return new Promise(resolve => {
          const id = setTimeout(() => [resolve(false), this.onText(`前往指定房间失败。[${path}]`, `hir`)], timeout);
          const clearEvent = this.on(`room`, data => (data.path === path) && [resolve(true), clearEvent(), clearTimeout(id)]);
        })
      },
      // 等待指定的角色
      awaitNpcName(name, timeout = 30000) {
        return new Promise(resolve => {
          const id = setTimeout(() => [resolve(false), this.onText(`寻找指定角色失败。[${name}]`, `hir`)], timeout);
          const clearEvent = this.on(`items`, () => {
            const npc = this.npcList.find(x => x.name.includes(name));
            if (npc) {
              [resolve(npc.id), clearEvent(), clearTimeout(id)];
            }
          });
        })
      },
      // 等待战斗的结束
      awaitCombatEnd(timeout = 300000) {
        return new Promise(resolve => {
          const id = setInterval(() => {
            if (this.stateState !== `战斗`) {
              resolve(false);
              clearInterval(id);
              this.onText(`战斗异常结束。`, `hir`);
            }
          }, timeout);
          const clearEvent = this.on(`combat`, data => {
            if (data.end === 1) {
              clearEvent();
              resolve(true);
              clearInterval(id);
            }
          });
        })
      },
    },
    mounted() {
    },
  };

  var FUBEN_LIST = [
  	{
  		index: 0,
  		name: "树林",
  		id: "yz/lw/shangu",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 1,
  		name: "财主家",
  		id: "yz/cuifu/caizhu",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 2,
  		name: "流氓巷",
  		id: "yz/lmw/xiangzi1",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 3,
  		name: "丽春院",
  		id: "yz/lcy/dating",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 4,
  		name: "兵营",
  		id: "yz/by/damen",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 5,
  		name: "庄府",
  		id: "bj/zhuang/xiaolu",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 6,
  		name: "鳌拜府",
  		id: "bj/ao/damen",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 7,
  		name: "天地会",
  		id: "bj/tdh/hct",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 8,
  		name: "神龙教",
  		id: "bj/shenlong/haitan",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 9,
  		name: "关外",
  		id: "bj/guanwai/damen",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 10,
  		name: "温府",
  		id: "cd/wen/damen",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 11,
  		name: "五毒教",
  		id: "cd/wudu/damen",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 12,
  		name: "恒山",
  		id: "wuyue/hengshan/daziling",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 13,
  		name: "青城山",
  		id: "wuyue/qingcheng/shanlu",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 14,
  		name: "衡山",
  		id: "wuyue/henshan/hengyang",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 15,
  		name: "泰山",
  		id: "wuyue/taishan/daizong",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 16,
  		name: "嵩山",
  		id: "wuyue/songshan/taishi",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 17,
  		name: "云梦沼泽",
  		id: "cd/yunmeng/senlin",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 18,
  		name: "桃花岛",
  		id: "taohua/haitan",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 19,
  		name: "白驼山",
  		id: "baituo/damen",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 20,
  		name: "星宿海",
  		id: "xingxiu/xxh6",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 21,
  		name: "冰火岛",
  		id: "mj/bhd/haibian",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 22,
  		name: "移花宫",
  		id: "huashan/yihua/shandao",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 23,
  		name: "燕子坞",
  		id: "murong/anbian",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 24,
  		name: "黑木崖",
  		id: "heimuya/shangu",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 25,
  		name: "缥缈峰",
  		id: "lingjiu/shanjiao",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 26,
  		name: "光明顶",
  		id: "mj/shanmen",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 27,
  		name: "天龙寺",
  		id: "tianlong/damen",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 28,
  		name: "血刀门",
  		id: "xuedao/shankou",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 29,
  		name: "古墓派",
  		id: "gumu/gumukou",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 30,
  		name: "华山论剑",
  		id: "huashan/lunjian/leitaixia",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 31,
  		name: "侠客岛",
  		id: "xkd/shimen",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 32,
  		name: "净念禅宗",
  		id: "chanzong/shanmen",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 33,
  		name: "慈航静斋",
  		id: "cihang/shanmen",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 34,
  		name: "阴阳谷",
  		id: "yyg/ya",
  		diff: false,
  		team: false,
  		desc: ""
  	},
  	{
  		index: 35,
  		name: "战神殿",
  		id: "zsd/damen",
  		diff: false,
  		team: false,
  		desc: ""
  	}
  ];

  var ValkyrieOptions = {
    data() {
      return {
        options: Vue.reactive({
          showStateDesc: false,
          showPanelRoom: true, // 房间面板
          showPanelScore: true,
          showPanelTask: true,
          showPanelOnekey: true,
          showPanelPerform: true,
          showPanelChannel: true,
          showMapDialog: false, // 地图弹窗
          showTaskDialog: false,
          showChannelDialog: false,
          canTaskFb: false,
          canTaskFbId: `yz/lw/shangu`,
          canTaskFbType: 0,
          canTaskGzm: false,
          canTaskQa: false,
          canTaskSm: false,
          canTaskSmCard: false,
          canTaskSmStore: false,
          canTaskSmGiveup: false,
          canTaskYm: false,
          canTaskYmSweep: false,
          canTaskYmGiveup: false,
          canTaskWd: false,
          canTaskEndWk: false,
          canTaskEndBg: false,
          canTaskEndDz: false,
          showChannelCh: true,
          showChannelTm: true,
          showChannelFa: true,
          showChannelPt: true,
          showChannelEs: true,
          showChannelSy: true,
          showChannelRu: true,
          backgroundImage: `https://cdn.jsdelivr.net/gh/coderzhaoziwei/Valkyrie/source/image/y726730.jpg`,
        }),
      }
    },
    computed: {
      FUBEN_LIST() {
        return FUBEN_LIST
      },
    },
    mounted() {
      // 深度监听即时保存
      this.$watch(`options`, value => this.setValue(`options`, value), { deep: true });
      // 登录加载本地配置
      this.on(`login`, function() {
        if (this.id) {
          const options = this.getValue(`options`);
          Object.keys(options).forEach(key => {
            this.options[key] = options[key];
          });
          // 默认关闭弹窗
          this.options.showMapDialog = false;
          this.options.showTaskDialog = false;
          this.options.showChannelDialog = false;
          // 设置背景图
          document.getElementById(`app`).style.backgroundImage = `url(${this.options.backgroundImage})`;
        }
      });
    },
  };

  var OnLogin = {
    data() {
      return {
      }
    },
    methods: {
      // 更新工具栏位置
      updateToolBarPosition() {
        if (document.querySelector(`.content-bottom`).offsetHeight === 0) {
          document.querySelector(`[command=showcombat]`).click();
        }
        if (document.querySelector(`.right-bar`).offsetWidth === 0) {
          document.querySelector(`[command=showtool]`).click();
        }
        setTimeout(() => {
          const h1 = document.querySelector(`.content-bottom`).clientHeight;
          const h2 = document.querySelector(`.tool-bar.bottom-bar`).clientHeight;
          document.querySelector(`.right-bar`).style.bottom = h1 + h2 + `px`;
        }, 1000);
      },
    },
    mounted() {
      // 获取数据
      this.on(`login`, async function(data) {
        this.sendCommands(`pack,score2,score`);
        await this.await(1000);
        document.querySelector(`[command=skills]`).click();
        await this.await(1000);
        document.querySelector(`[command=tasks]`).click();
        await this.await(1000);
        document.querySelector(`.dialog-close`).click();
        this.updateToolBarPosition();
      });
      // 窗口尺寸变动时 触发工具位置变动
      // 此处必须使用箭头函数使 this 指向 Vue 实例
      unsafeWindow.addEventListener(`resize`, () => {
        this.updateToolBarPosition();
      });
    },
  };

  var OnRoom = {
    data() {
      return {
        roomName: ``,
        roomPath: ``,
        roomDesc: ``,
        roomCmds: [],
        roomX: ``,
        roomY: ``,
      }
    },
    computed: {
      roomTitle() {
        return `${this.roomX} ${this.roomY}`
      },
    },
    mounted() {
      this.on(`room`, function(data) {
        const { name, path, desc, commands } = data;
        this.roomName = name;
        this.roomPath = path;
        this.roomDesc = desc;
        this.roomCmds.splice(0);
        this.roomCmds.push(...commands);
        const names = name.split(/-|\(|\)/);
        this.roomX = names[0];
        this.roomY = names[1];
      });
    },
  };

  var OnMap = {
    data() {
      return {
        mapPath: ``,
        mapDataList: [],
        mapPosition: Vue.reactive({ minX: 9999, minY: 9999, maxX: 0, maxY: 0 }),
        mapRectList: [],
        mapLineList: [],
        mapTextList: [],
      }
    },
    computed: {
      // 偏移
      mapOffsetX() {
        return 0 - this.mapPosition.minX
      },
      mapOffsetY() {
        return 0 - this.mapPosition.minY
      },
      mapWidth() {
        const unitX = 100;
        return (this.mapPosition.maxX + this.mapOffsetX + 1) * unitX || 0
      },
      mapHeight() {
        const unitY = 50;
        return (this.mapPosition.maxY + this.mapOffsetY + 1) * unitY || 0
      },
      mapSVG() {
        const SVGList = [];
        SVGList.push(`<svg`);
        SVGList.push(` viewBox="0,0,${this.mapWidth>0?this.mapWidth:0},${this.mapHeight>0?this.mapHeight:0}"`);
        SVGList.push(` preserveAspectRatio="xMidYMid meet">`);
        SVGList.push(this.mapRectList.join(``));
        SVGList.push(this.mapTextList.join(``));
        SVGList.push(this.mapLineList.join(``));
        SVGList.push(`</svg>`);
        return SVGList.join(``)
      },
      mapTitle() {
        return this.roomX
      },
      mapStyle() {
        return `max-width: ${this.mapWidth}px; max-height: ${this.mapHeight}px;`
      },
      mapWidthStyle() {
        return `${this.mapWidth}px`
      },
    },
    watch: {
    },
    methods: {
      updateMapDataList(datalist) {
        this.mapDataList = datalist;
      },
      updateMapPosition() {
        this.mapPosition.minX = 9999;
        this.mapPosition.minY = 9999;
        this.mapPosition.maxX = 0;
        this.mapPosition.maxY = 0;
        this.mapDataList.forEach(data => {
          const [x, y] = data.p;
          if (x < this.mapPosition.minX) this.mapPosition.minX = x;
          if (x > this.mapPosition.maxX) this.mapPosition.maxX = x;
          if (y < this.mapPosition.minY) this.mapPosition.minY = y;
          if (y > this.mapPosition.maxY) this.mapPosition.maxY = y;
        });
      },
      updateMapSVG() {
        const [unitX, unitY, unitW, unitH] = [100, 50, 60, 20];
        this.mapRectList.splice(0);
        this.mapLineList.splice(0);
        this.mapTextList.splice(0);
        this.mapDataList.forEach(data => {
          const l = (data.p[0] + this.mapOffsetX) * unitX + 20;
          const t = (data.p[1] + this.mapOffsetY) * unitY + 20;
          // rect
          this.mapRectList.push(`<rect`);
          this.mapRectList.push(` x="${l}" y="${t}"`);
          this.mapRectList.push(` fill="dimgrey" stroke-width="1" stroke="gray"`);
          this.mapRectList.push(` width="${unitW}" height="${unitH}"`);
          this.mapRectList.push(`></rect>`);
          // text
          this.mapTextList.push(`<text`);
          this.mapTextList.push(` x="${l+30}" y="${t+14}"`);
          this.mapTextList.push(` text-anchor="middle" style="font-size: 12px;" fill="#232323"`);
          this.mapTextList.push(`>${data.n}</text>`);
          // line
          if ((data.exits instanceof Array) === false) return
          data.exits.forEach(exit => {
            const regexp = /^([a-z]{1,2})(\d)?([d|l])?$/;
            if (regexp.test(exit)) {
              // 计算两个点的左边
              const points = {
                w: [
                  [l - (unitX - unitW) - unitX * (length - 1), t + unitH / 2],
                  [l, t + unitH / 2],
                ],
                e: [
                  [l + unitW, t + unitH / 2],
                  [l + unitX + unitX * (length - 1), t + unitH / 2],
                ],
                s: [
                  [l + unitW / 2, t + unitH],
                  [l + unitW / 2, t + unitY + unitY * (length - 1)],
                ],
                n: [
                  [l + unitW / 2, t],
                  [l + unitW / 2, t - (unitY - unitH) - unitY * (length - 1)],
                ],
                nw: [
                  [l - length * unitX + unitW, t - length * unitY + unitH],
                  [l, t],
                ],
                ne: [
                  [l + unitW, t],
                  [l + length * unitX, t - (unitY - unitH)],
                ],
                se: [
                  [l + unitW, t + unitH],
                  [l + length * unitX, t + length * unitY],
                ],
                sw: [
                  [l, t + unitH],
                  [l - (unitX - unitW) - unitX * (length - 1), t + length * unitY],
                ],
              }[RegExp.$1];
              const [a, b] = points;
              if (a && b) {
                this.mapLineList.push(`<line`);
                this.mapLineList.push(` stroke="gray"`);
                this.mapLineList.push(` x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"`);
                if (RegExp.$3) {
                  this.mapLineList.push(` stroke-dasharray="5,5"`);
                }
                if (RegExp.$3 === `l`) {
                  this.mapLineList.push(` stroke-width="10"`);
                } else {
                  this.mapLineList.push(` stroke-width="1"`);
                }
                this.mapLineList.push(`></line>`);
              }
            }
          });
        });
      },
    },
    mounted() {
      this.on(`map`, function(data) {
        if ((data.map instanceof Array) === false) return
        // 若区域改变 则更新数据
        if (data.path !== this.mapPath) {
          this.mapPath = data.path;
          this.updateMapDataList(data.map);
          this.updateMapPosition();
          this.updateMapSVG();
        }
        // 屏蔽
        delete data.type;
      });
    },
  };

  var OnExits = {
    data() {
      return {
        exitList: [],
      }
    },
    mounted() {
      this.on(`exits`, function(data) {
        if (data.items instanceof Array) {
          this.exitList.splice(0);
          Object.keys(data.items).forEach(x => {
            const name = data.items[x];
            const command = `go ${x}`;
            this.exitList.push({ name, command });
          });
        }
      });
    },
  };

  class Base {
    constructor(data) {
      this.id = data.id;
      this.name = data.name;
    }
    get nameText() {
      // 删除标签后的格式化文本
      return this.name.replace(/<\S+?>/g, ``)
    }
    get colorValue() {
      // 颜色 [1-7]
      const index = [ // 0: 无法判断
        /^<(hiw|wht)>/i, // 1: 白
        /^<hig>/i, // 2: 绿
        /^<hic>/i, // 3: 蓝
        /^<hiy>/i, // 4: 黄
        /^<hiz>/i, // 5: 紫
        /^<hio>/i, // 6: 橙
        /^<(hir|ord|red)>/i, // 7: 红
        /^<\S\S\S>/, // 8: 未知
      ].findIndex(regexp => regexp.test(this.name)) + 1;
      // 打印未知标签
      if (index === 8) {
        console.warn(this.name);
      }
      return index
    }
  }

  class Role extends Base {
    constructor(data) {
      super(data);
      this.hp = data.hp || 0;
      this.mp = data.mp || 0;
      this.max_hp = data.max_hp || 0;
      this.max_mp = data.max_mp || 0;
      this.status = data.status || [];
      // 1: 玩家对象, 0: ？
      this.p = data.p || 0;
    }
    get isSelf() {
      // 是否玩家自己
      return this.id === unsafeWindow.id
    }
    get isPlayer() {
      // 是否玩家
      return this.p === 1
    }
    get isOffline() {
      // 是否掉线的玩家
      return this.name.includes(`<red>&lt;断线中&gt;</red>`)
    }
    get isNpc() {
      // 是否NPC
      return !this.isPlayer
    }
    get sortValue() {
      // 排序权重
      if (this.isSelf) return 0
      if (this.isNpc) return this.colorValue
      return this.colorValue + (this.isOffline ? 2000 : 1000)
    }
  }

  var OnItems = {
    data() {
      return {
        roleList: [],
      }
    },
    computed: {
      // 当前 NPC 列表
      npcList() {
        return this.roleList.filter(x => x.isNpc)
      },
    },
    mounted() {
      this.on(`items`, function(data) {
        if (data.items instanceof Array) {
          this.roleList.splice(0);
          data.items.forEach(x => x && this.roleList.push(new Role(x)));
          this.roleList.sort((a, b) => a.sortValue - b.sortValue);
          // 修改
          data.items = this.roleList;
        }
      });
      this.on(`itemadd`, function(data) {
        const role = new Role(data);
        const index = this.roleList.findIndex(x => x.id === role.id);
        if (index !== -1) {
          this.roleList.splice(index, 1, role);
        } else {
          this.roleList.push(role);
        }
        this.roleList.sort((a, b) => a.sortValue - b.sortValue);
        // 修改
        data.type = `items`;
        data.items = this.roleList;
      });
      this.on(`itemremove`, function(data) {
        if (typeof data.id === `string`) {
          const index = this.roleList.findIndex(x => x.id === data.id);
          if (index !== -1) {
            this.roleList.splice(index, 1);
          }
        }
      });
      this.on(`sc`, function(data) {
        const role = this.roleList.find(x => x.id === data.id);
        if (role === undefined) return
        if (this.hasOwn(data, `hp`)) role.hp = Number(data.hp);
        if (this.hasOwn(data, `mp`)) role.mp = Number(data.mp);
        if (this.hasOwn(data, `max_hp`)) role.max_hp = Number(data.max_hp);
        if (this.hasOwn(data, `max_mp`)) role.max_mp = Number(data.max_mp);
      });
    },
  };

  var STATE_LIST = [
  	"打坐",
  	"疗伤",
  	"读书",
  	"学习",
  	"练习",
  	"修炼",
  	"工作",
  	"挖矿",
  	"采药",
  	"钓鱼",
  	"炼药",
  	"闭关",
  	"领悟",
  	"聚魂",
  	"推演"
  ];

  var OnState = {
    data() {
      return {
        stateText: ``,
      }
    },
    computed: {
      documentTitle() {
        if (this.name) {
          return `${this.name} ${this.stateText} ${this.serverText}`
        }
        return `武神传说`
      },
    },
    watch: {
      documentTitle(value) {
        document.title = value;
      },
    },
    mounted() {
      this.on(`state`, function(data) {
        const stateText = STATE_LIST.find(x => (typeof data.state === `string`) && data.state.includes(x));
        this.stateText = stateText || data.state || ``;
        // 修改状态
        data.state = this.stateText;
        // 删除描述
        if (this.options.showStateDesc === false) {
          delete data.desc;
        }
      });
      // 战斗状态
      this.on(`combat`, function(data) {
        if (data.start === 1) this.stateText = `战斗`;
        if (data.end === 1) this.stateText = ``;
      });
      // 死亡状态
      this.on(`die`, function(data) {
        if (data.relive === true) this.stateText = ``;
        else this.stateText = `死亡`;
      });
    },
  };

  var LEVEL_LIST = [
  	"百姓",
  	"武士",
  	"武师",
  	"宗师",
  	"武圣",
  	"武帝",
  	"武神"
  ];

  var OnScore = {
    data() {
      return {
        score: {},
        jyValue: 0,
        qnValue: 0,
      }
    },
    computed: {
      scoreTitle() {
        // return `${this.name} ${this.serverText}`
        return `${this.name}`
      },
      // 经验
      jyCache() {
        return Number(this.score.exp) || 0
      },
      jyText() {
        return Number(this.jyValue.toFixed()).toLocaleString()
      },
      // 潜能
      qnCache() {
        return Number(this.score.pot) || 0
      },
      qnText() {
        return Number(this.qnValue.toFixed()).toLocaleString()
      },
      // 先天悟性
      wx1() {
        return Number(this.score.int) || 0
      },
      // 后天悟性
      wx2() {
        return Number(this.score.int_add) || 0
      },
      // 学习效率
      xxxl() {
        return parseInt(this.score.study_per ) || 0
      },
      // 练习效率
      lxxl() {
        return parseInt(this.score.lianxi_per) || 0
      },
      // 练习每一跳消耗＝(先天悟性＋后天悟性)×(1＋练习效率%－先天悟性%)
      lxCost() {
        return parseInt((this.wx1 + this.wx2) * (1 + this.lxxl / 100 - this.wx1 / 100))
      },
      // 学习每一跳消耗＝(先天悟性＋后天悟性)×(1＋学习效率%－先天悟性%)×3
      xxCost() {
        return parseInt((this.wx1 + this.wx2) * (1 + this.xxxl / 100 - this.wx1 / 100) * 3)
      },
      // 气血百分比
      hpPercentage() {
        return parseInt((this.score.hp / this.score.max_hp) * 100) || 0
      },
      // 内力百分比
      mpPercentage() {
        return parseInt((this.score.mp / this.score.max_mp) * 100) || 0
      },
      // 门派
      familyText() {
        return this.score.family || ``
      },
      // 性别
      genderText() {
        return this.score.gender || ``
      },
      // 精力
      energy() {
        if (typeof this.score.jingli === `string` && /^(\d+)[^\d]+(\d+)[^\d]+(\d+)[^\d]+$/.test(this.score.jingli)) {
          const value = Number(RegExp.$1) || 0;
          const limit = Number(RegExp.$2) || 0;
          const today = Number(RegExp.$3) || 0;
          return { value, limit, today }
        }
        return { value: 0, limit: 0, today: 0 }
      },
      energyValue() {
        return this.energy.value
      },
      energyLimit() {
        return this.energy.limit
      },
      // 境界
      levelText() {
        if (typeof this.score.level === `string`) {
          return LEVEL_LIST.find(x => this.score.level.includes(x))
        }
        return ``
      },
    },
    watch: {
      // 数字动态递增：经验、潜能
      jyCache(value) {
        if (document && document.hidden) {
          this.jyValue = value;
        } else {
          gsap.to(this.$data, { duration: 0.5, jyValue: value });
        }
      },
      qnCache(value) {
        if (document && document.hidden) {
          this.qnValue = value;
        } else {
          gsap.to(this.$data, { duration: 0.5, qnValue: value });
        }
      },
    },
    mounted() {
      const update = function(data) {
        if (data.id === this.id) {
          Object.keys(data).forEach(key => {
            this.score[key] = data[key];
          });
        }
      };
      this.on(`score`, update);
      this.on(`sc`, update);
    },
  };

  var PACK_LIST = [
  	"神魂碎片",
  	"<hio>武道残页</hio>",
  	"<hio>武道</hio>",
  	"帝魄碎片",
  	"元晶",
  	"玄晶",
  	"周年庆徽章",
  	"技能重置卡",
  	"师门补给包",
  	"背包扩充石",
  	"随从礼包",
  	"小箱子",
  	"玫瑰花",
  	"召唤令",
  	"补签卡",
  	"藏宝图",
  	"鱼饵",
  	"月饼",
  	"朱果",
  	"潜灵果",
  	"顿悟丹",
  	"养精丹",
  	"闭元丹",
  	"培元丹",
  	"聚气丹",
  	"突破丹",
  	"冰心丹",
  	"玄灵丹",
  	"扫荡符",
  	"天师符",
  	"叛师符",
  	"洗髓丹",
  	"变性丹",
  	"喜宴",
  	"师门令牌",
  	"挖矿指南",
  	"铁镐",
  	"钓鱼竿",
  	"药王神篇",
  	"红宝石",
  	"绿宝石",
  	"蓝宝石",
  	"黄宝石",
  	"碎裂的破军",
  	"碎裂的贪狼",
  	"碎裂的七杀",
  	"碎裂的紫薇",
  	"破军",
  	"贪狼",
  	"七杀",
  	"紫薇",
  	"进阶秘籍",
  	"秘籍",
  	"残页",
  	"鲤鱼",
  	"草鱼",
  	"鲢鱼",
  	"鲮鱼",
  	"鳊鱼",
  	"鲂鱼",
  	"黄金鳉",
  	"黄颡鱼",
  	"太湖银鱼",
  	"虹鳟",
  	"孔雀鱼",
  	"反天刀",
  	"银龙鱼",
  	"黑龙鱼",
  	"罗汉鱼",
  	"巨骨舌鱼",
  	"七星刀鱼",
  	"帝王老虎魟",
  	"当归",
  	"芦荟",
  	"山楂叶",
  	"柴胡",
  	"金银花",
  	"石楠叶",
  	"茯苓",
  	"沉香",
  	"熟地黄",
  	"九香虫",
  	"络石藤",
  	"冬虫夏草",
  	"人参",
  	"何首乌",
  	"凌霄花",
  	"灵芝",
  	"天仙藤",
  	"盘龙参",
  	"四十二章经一",
  	"四十二章经二",
  	"四十二章经三",
  	"四十二章经四",
  	"四十二章经五",
  	"四十二章经六",
  	"四十二章经七",
  	"四十二章经八",
  	"★",
  	"☆",
  	""
  ];

  class Pack extends Base {
    constructor(data) {
      super(data);
      this.count = data.count;
      this.unit = data.unit;
      this.value = data.value || 0;
      // 可装备: 0/1
      this.can_eq = data.can_eq || 0;
      // 可使用: 0/1
      this.can_use = data.can_use || 0;
      // 可学习: 0/1
      this.can_study = data.can_study || 0;
      // 可合成: 0/1
      this.can_combine = data.can_combine || 0;
    }
    get isEquip() {
      return this.can_eq === 1
    }
    get sortValue() {
      const index = PACK_LIST.findIndex(x => {
        const regexp = new RegExp(x, `i`);
        return regexp.test(this.name)
      }) + 1;
      return this.colorValue + (index * 10)
    }
    get valueText() {
      // 物品价值文本
      return this.value
    }
  }

  var OnPack = {
    data() {
      return {
        equipList: [],
        packList: [],
        packLimit: 0,
        moneyValue: 0,
      }
    },
    computed: {
      // 物品数量
      packCount() {
        return this.packList.length
      },
    },
    mounted() {
      this.on(`pack`, function(data) {
        if (this.hasOwn(data, `eqs`) && data.eqs instanceof Array) {
          data.eqs.forEach((x, i) => (this.equipList[i] = x));
        }
        if (this.hasOwn(data, `items`) && data.items instanceof Array) {
          this.packList.splice(0);
          data.items.forEach(x => this.packList.push(new Pack(x)));
          this.packList.sort((a, b) => a.sortValue - b.sortValue);
          // 修改
          data.items = this.packList;
        }
        // 钱
        if (this.hasOwn(data, `money`)) {
          this.moneyValue = Number(data.money) || 0;
        }
        // 物品上限
        if (this.hasOwn(data, `max_item_count`)) {
          this.packLimit = Number(data.max_item_count) || 0;
        }
      });
    },
  };

  class Skill extends Base {
    constructor(data) {
      super(data);
      this.level = Number(data.level) || 0;
      this.can_enables = data.can_enables || undefined;
      this.enable_skill = data.enable_skill || ``;
      this.exp = 0;
      this._exp = data.exp;
    }
    set _exp(value) {
      value = Number(value) || 0;
      // 计算后的熟练度数值为 [10, 95] 区间中 5 的倍数
      this.exp = (value <= 10) ? 10 : parseInt(value / 5) * 5;
    }
    get _exp() {
      return this.exp
    }
    get k() {
      // 技能系数 = 技能颜色 * 2.5
      return this.colorValue * 2.5
    }
    get sortValue() {
      // 基础技能
      if (this.colorValue === 1) {
        return [
          `force`, // 1: 内功
          `unarmed`, // 2: 拳脚
          `dodge`, // 3: 轻功
          `parry`, // 4: 招架
          `blade`, // 5: 刀
          `sword`, // 6: 剑
          `club`, // 7: 棍
          `staff`, // 8: 杖
          `whip`, // 9: 鞭
          `throwing`, // 10: 暗器
          `bite`, // 11: 野兽扑咬
          `literate`, // 12: 读书识字
          `lianyao`, // 13: 炼药术
        ].findIndex(item => item === this.id) + 1
      }
      // 特殊技能 = 等级权重 + 颜色权重
      const levelSort = 100000 - this.level;
      const colorSort = (10 - this.colorValue) / 2;
      return levelSort + colorSort
    }
  }

  var OnSkills = {
    data() {
      return {
        skillList: [],
        skillLimit: 0,
      }
    },
    mounted() {
      this.on(`skills`, function(data) {
        // 技能列表
        if (this.hasOwn(data, `items`) && data.items instanceof Array) {
          this.skillList.splice(0);
          data.items.forEach(x => this.skillList.push(new Skill(x)));
          this.skillList.sort((a, b) => a.sortValue - b.sortValue);
          // 修改
          data.items = this.skillList;
        }
        // 技能等级上限
        if (this.hasOwn(data, `limit`)) {
          this.skillLimit = parseInt(data.limit) || 0;
        }
        // 学会新的技能
        if (this.hasOwn(data, `item`)) {
          this.skillList.push(new Skill(data.item));
        }
        // 更新潜能值
        if (this.hasOwn(data, `pot`)) {
          this.score.pot = Number(data.pot) || 0;
        }
        // 单个技能信息变动
        if (this.hasOwn(data, `id`)) {
          const skill = this.skillList.find(x => x.id === data.id);
          if (skill === null) return
          if (this.hasOwn(data, `level`)) {
            skill.level = Number(data.level) || 1;
            this.onText(`你的技能${skill.name}提升到了<hiw>${skill.level}</hiw>级！`);
          }
          // 技能经验
          if (this.hasOwn(data, `exp`)) {
            skill._exp = data.exp;
            switch (this.stateText) {
              case `练习`:
                this.onText(`你练习${ skill.name }消耗了${ this.lxCost }点潜能。${data.exp}%`);
                this.stateText = `练习${skill.nameText}`;
                this.score.pot -= this.lxCost;
                break
              case `学习`:
                this.onText(`你学习${ skill.name }消耗了${ this.xxCost }点潜能。${data.exp}%`);
                this.stateText = `学习${skill.nameText}`;
                this.score.pot -= this.xxCost;
                break
              case `炼药`:
                this.onText(`你获得了炼药经验，${skill.name}当前<hiw>${skill.level}</hiw>级。${data.exp}%`);
                break
            }
          }
          // if (index !== -1) {
          //   const skill = this.skillList[index]
          //   /* 潜能消耗＝等级平方差×技能颜色系数 */
          //   const qnCost = (Math.pow(this.skillLimit, 2) - Math.pow(skill.level, 2)) * skill.k
          //   /* 秒数消耗＝潜能/每一跳的潜能/(每分钟秒数/每分钟五次) */
          //   const time = qnCost / this.lxCost / ( 60 / 5)
          //   const timeString = time < 60 ? `${parseInt(time)}分钟` : `${parseInt(time/60)}小时${parseInt(time%60)}分钟`
          //   // 还需要${ timeString }消耗${ qn }点潜能到${ this.skillLimit }级。
          // }
        }
      });
    },
  };

  var OnPerform = {
    data() {
      return {
        performList: [],
      }
    },
    computed: {
    },
    watch: {
      performList(value) {
        this.setValue(`performs`, value);
      },
    },
    methods: {
      updatePerform(pfm) {
        const index = this.performList.findIndex(x => x.id === pfm.id);
        if (index === -1) {
          this.performList.push(pfm);
        } else {
          this.performList.splice(index, 1, pfm);
        }
      },
    },
    mounted() {
      // 登录加载本地记录
      this.on(`login`, function() {
        if (this.id) {
          const performs = this.getValue(`performs`);
          if (performs instanceof Array) {
            this.performList.push(...performs);
          }
        }
      });
      /** skills: Array(10)
  0: {id: "blade.shi", name: "嗜血", distime: 43821}
  1: {id: "blade.xue", name: "血海魔刀", distime: 13421}
  2: {id: "force.zhui", name: "追魂", distime: 9621}
  3: {id: "force.cui", name: "逆转九阴", distime: 43821}
  4: {id: "unarmed.duo", name: "夺魄", distime: 11901}
  5: {id: "unarmed.juan", name: "风卷残云", distime: 11901}
  6: {id: "dodge.fo", name: "比翼", distime: 43821}
  7: {id: "parry.yi", name: "移花", distime: 17221}
  8: {id: "throwing.luo", name: "血滴子", distime: 10381}
  9: {id: "throwing.wu", name: "天网", distime: 43821}
  length: 10 */
      this.on(`perform`, function(data) {
        const list = data.skills;
        if (list instanceof Array) {
          // 清空原数据
          this.performList.forEach(x => x.enable = true);
          list.forEach(x => {
            const { id, name, distime } = x;
            this.performList.push({ id, name, distime });
          });
        }
      });
    },
  };

  var OnTasks = {
    data() {
      return {
        smCount: 20,
        smTotal: 99,
        smTarget: ``,
        ymCount: 20,
        ymTotal: 99,
        ymTarget: ``,
        ymTargetX: ``,
        ymTargetY: ``,
        ybCount: 20,
        ybTotal: 99,
        fbCount: 20,
        wdCount: 99,
        wdTotal: 99,
        wdComplete: true,
        qaComplete: true,
        xyComplete: true,
        mpComplete: true,
      }
    },
    mounted() {
      this.on(`tasks`, function(data) {
        if ((data.items instanceof Array) === false) return
        this.smTarget = ``;
        this.ymTarget = ``;
        this.ymTargetX = ``;
        this.ymTargetY = ``;
        data.items.forEach(x => {
          const { id, state, title, desc } = x;
          switch (id) {
            case `sm`:
              // 你的师门委托目前完成0/20个，共连续完成16个。
              if (/目前完成(\d+)\/20个，共连续完成(\d+)个/.test(desc)) {
                this.smCount = Number(RegExp.$1) || 0;
                this.smTotal = Number(RegExp.$2) || 0;
              }
              // 你的师门委托你去寻找<wht>当归</wht>，你可以慢慢寻找，没有时间限制，目前完成0/20个，共连续完成16个。
              if (/你的师门委托你去寻找(\S+)，你可以慢慢寻找/.test(desc)) {
                this.smTarget = RegExp.$1;
              }
              break
            case `yamen`:
              // 扬州知府委托你追杀逃犯：目前完成0/20个，共连续完成34个。
              if (/目前完成(\d+)\/20个，共连续完成(\d+)个/.test(desc)) {
                this.ymCount = Number(RegExp.$1) || 0;
                this.ymTotal = Number(RegExp.$2) || 0;
              }
              // 扬州知府委托你追杀逃犯：司空荔蓓，据说最近在峨眉派-走廊出现过，你还有9分57秒去寻找他，目前完成0/20个，共连续完成34个。
              if (/扬州知府委托你追杀逃犯：(\S+)，据说最近在(\S+)-(\S+)出现过/.test(desc)) {
                this.ymTarget = RegExp.$1;
                this.ymTargetX = RegExp.$2;
                this.ymTargetY = RegExp.$3;
              }
              break
            case `yunbiao`:
              // 你目前没有接受到委托，本周完成0/20个，共连续完成0个。
              if (/本周完成(\d+)\/20个，共连续完成(\d+)个/.test(desc)) {
                this.ybCount = Number(RegExp.$1) || 0;
                this.ybTotal = Number(RegExp.$2) || 0;
              }
              break
            case `signin`:
              // 副本：<hik>0/20</hik>
              // 副本：<hig>20/20</hig>
              if (/副本：<[\S]{3}>(\d+)\/20<[\S]{4}>/.test(desc)) {
                this.fbCount = Number(RegExp.$1) || 0;
              }
              // <hig>武道塔可以重置，进度20/29</hig>，
              // <nor>武道塔已重置，进度99/99</nor>，
              if (/武道塔([\S]{1,2})重置，进度(\d+)\/(\d+)/.test(desc)) {
                this.wdComplete = (RegExp.$1 === `已`);
                this.wdCount = Number(RegExp.$2) || 0;
                this.wdTotal = Number(RegExp.$3) || 0;
              }
              // <hig>还没有给首席请安</hig>
              // 本周尚未协助襄阳守城，尚未挑战门派BOSS，还可以挑战武神BOSS5次。
              this.qaComplete = (/还没有给首席请安/.test(desc) === false);
              this.xyComplete = (/本周尚未协助襄阳守城/.test(desc) === false);
              this.mpComplete = (/尚未挑战门派BOSS/.test(desc) === false);
            default:
              if (state === 2) {
                this.onText(`${title}任务已完成。`, `hig`);
                if (
                  // 每日签到
                  (id === `signin`) ||
                  // 五一节日礼包 2021-05-01 ~ 2021-05-05
                  (id === `zz1` && title === `<hic>节日礼包</hic>` && desc === `节日快乐，你尚未领取节日礼包。`)
                ) this.send(`taskover ${id}`);
              }
              break
          }
        });
      });
    },
  };

  var OnList = {
    data() {
      return {
        storeList: [],
        storeLimit: 0,
        seller: ``,
        sellList: [],
      }
    },
    mounted() {
      this.on(`list`, function(data) {
        // 仓库列表
        if (this.hasOwn(data, `stores`) && data.stores instanceof Array) {
          this.storeList.splice(0);
          data.stores.forEach(item => this.storeList.push(new Pack(item)));
          this.storeList.sort((a, b) => a.sortValue - b.sortValue);
          // 修改
          data.stores = this.storeList;
        }
        // 仓库上限
        if (this.hasOwn(data, `max_store_count`)) {
          this.storeLimit = Number(data.max_store_count) || 0;
        }
        // 商店
        if (this.hasOwn(data, `seller`)) {
          this.seller = data.seller;
        }
        if (this.hasOwn(data, `selllist`) && data.selllist instanceof Array) {
          this.sellList.splice(0);
          data.selllist.forEach(x => this.sellList.push(new Pack(x)));
        }
      });
    },
  };

  class Chat {
    constructor(data) {
      this.id = data.uid || ``;
      // 聊天频道
      this.channel = data.ch;
      // 聊天内容
      this.content = data.content.trim().replace(/\n/g, `<br>`);
      this.name = data.name || ``;
      // 本地生成的时间
      this.time = new Date();
      // 世界频道专有：等级
      this.level = data.lv || 0;
      // 门派频道专有：门派
      this.family = data.fam || ``;
      // 全区频道专有：服务器
      this.server = data.server || ``;
    }
    get isSelf() {
      return this.id === unsafeWindow.id
    }
    get isTm() {
      return this.channel === `tm`
    }
    get isEs() {
      return this.channel === `es`
    }
    get isFa() {
      return this.channel === `fam`
    }
    get isSy() {
      return this.channel === `sys`
    }
    get isPt() {
      return this.channel === `pty`
    }
    get isCh() {
      return this.channel === `chat`
    }
    get isRu() {
      return this.channel === `rumor`
    }
    get commandText() {
      return `look3 ${this.id}`
    }
    get tag() {
      if (this.isTm) return `hig`
      if (this.isEs) return `hio`
      if (this.isFa) return `hiy`
      if (this.isSy) return `hir`
      if (this.isPt) return `hiz`
      if (this.isRu) return `him`
      if (this.isCh) return [0, 0, 0, `hiy`, `hiz`, `hio`, `hir`][this.level] || `hic`
      return `hiy`
    }
    get titleText() {
      if (this.isTm) return `队伍`
      if (this.isPt) return `帮派`
      if (this.isRu) return `谣言`
      if (this.isSy) return `系统`
      if (this.isFa) return `${this.family}`
      if (this.isEs) return `${this.server}`
      if (this.isCh) return [`百姓`, `武士`, `武师`, `宗师`, `武圣`, `武帝`, `武神`][this.level] || `闲聊`
      return `脚本`
    }
    get timeText() {
      return new Date(this.time).toLocaleTimeString(`en-DE`)
    }
    get titleHtml() {
      return `<${this.tag}>【${this.titleText}】${this.name}</${this.tag}>`
    }
    get contentHtml() {
      return `<${this.tag}>${this.content}</${this.tag}>`
    }
    get command() {
      // 谣言 系统
      if (this.isRu || this.isSy) {
        return ``
      }
      if (this.isTm || this.isSelf) {
        return `look3 body of ${this.id}`
      }
      return `look3 ${this.id},look3 body of ${this.id}`
    }
  }

  var OnMsg = {
    data() {
      return {
        chatListCache: [],
        channelValue: `chat`,
        channelList: [
          { label: `世界`, value: `chat` },
          { label: `队伍`, value: `tm` },
          { label: `帮派`, value: `pty` },
          { label: `门派`, value: `fam` },
          { label: `全区`, value: `es` },
        ],
        chatValue: ``,
      }
    },
    computed: {
      chatList() {
        const list = this.chatListCache.filter(x =>
          (x.isCh && this.options.showChannelCh) ||
          (x.isTm && this.options.showChannelTm) ||
          (x.isFa && this.options.showChannelFa) ||
          (x.isPt && this.options.showChannelPt) ||
          (x.isEs && this.options.showChannelEs) ||
          (x.isSy && this.options.showChannelSy) ||
          (x.isRu && this.options.showChannelRu));
        return list.slice(-1000)
      },
    },
    watch: {
      // 聊天滚动到底部
      async chatList() {
        await Vue.nextTick();
        document.getElementById(`app-channel-bottom`).scrollIntoView({ behavior: `smooth` });
      },
    },
    methods: {
      sendChat() {
        const channelValue = this.channelValue;
        const chatValue = this.chatValue.trim();
        if (chatValue) {
          this.send(`${channelValue} ${chatValue}`);
        }
        this.chatValue = ``;
      },
    },
    mounted() {
      this.on(`msg`, function(data) {
        // 添加新消息
        this.chatListCache.push(new Chat(data));
        // 控制消息总数量在 2000 - 3000 之间
        if (this.chatListCache.length > 3000) {
          this.chatListCache.splice(0, 1000);
        }
      });
    },
  };

  var OnText = {
    mounted() {
      this.on(`text`, function(data) {
        // 获得经验潜能 更新数值
        if (/你获得了(\d+)点经验，(\d+)点潜能/.test(data.text)) {
          this.score.exp += Number(RegExp.$1) || 0;
          this.score.pot += Number(RegExp.$2) || 0;
        }
        // 技能等级提升
        if (/^<hiy>你的[\s\S]+等级提升了！<\/hiy>$/.test(data.text)) {
          delete data.type;
        }
        // 获得经验潜能 删除标签
        if (/^<hig>你获得了(\d+)点经验，(\d+)点潜能。<\/hig>$/.test(data.text)) {
          data.text = data.text.replace(/<\S+?>/g, ``);
        }
      });
    },
  };

  var OnCustomCommand = {
    data() {
      return {
      }
    },
    computed: {
    },
    watch: {
    },
    methods: {
    },
    mounted() {
      this.on(`custom-command`, function(data) {
        // {npc:*****}
        while (/{npc:([\s\S]+?)}/i.test(data.command)) {
          const string = RegExp.$1;
          const regexp = new RegExp(string);
          const npc = this.npcList.find(x => regexp.test(x.name));
          if (npc) {
            data.command = data.command.replace(/{npc:([\s\S]+?)}/i, npc.id);
          } else {
            data.command = data.command.replace(/{npc:([\s\S]+?)}/i, string);
            this.onText(`没有找到名为[<hiy>${string}</hiy>]的非玩家对象。`, `hir`);
          }
        }
        this.sendCommand(data.command);
      });
    },
  };

  function toCheck() {
    return new Promise(async resolve => {
      const regexp = /副本区域/;
      if (regexp.test(this.roomName)) {
        this.onText(`请离开[<hiy>${this.roomName}</hiy>]后再尝试。`, `him`);
        resolve(false);
      } else {
        resolve(true);
      }
    })
  }
  var ToCheck = {
    methods: { toCheck },
  };

  function toClear() {
    return new Promise(async resolve => {
      // 等待检查
      const toCheck = await this.toCheck();
      if (toCheck === false) return resolve(false)
      // 前往仓库
      this.send(`stopstate,jh fam 0 start,go north,go west,pack,store`);
      // 等待获取仓库数据
      const awaitStoreList = await this.awaitStoreList();
      if (awaitStoreList === false) return resolve(false)
      // 同名物品存入仓库
      this.storeList.forEach(x => {
        const item = this.packList.find(y => x.name === y.name);
        if (item) this.sendCommands(`store ${item.count} ${item.id}`);
      });
      // 前往当铺清理背包
      this.sendCommands(`store,stopstate,jh fam 0 start,go south,go east,sell all,1000,pack`);
      // 等待获取背包数据
      const awaitPackList = await this.awaitPackList();
      if (awaitPackList === false) return resolve(false)
      // 检查背包物品数量
      if (this.packCount < this.packLimit) {
        this.onText(`<hig>物品清理已完成。</hig>[${this.packCount}/${this.packLimit}]`, `hic`);
        resolve(true);
      } else {
        this.onText(`<hig>物品清理已完成。</hig>[${this.packCount}/${this.packLimit}]`, `hir`);
        resolve(false);
      }
    })
  }
  var ToClear = {
    methods: { toClear },
  };

  function toWakuang() {
    return new Promise(async resolve => {
      // 正在挖矿
      if (this.stateText === `挖矿`) return [this.onText(`挖矿任务正在进行。`, `hig`), resolve()]
      // 检查状态
      if ((await this.toCheck()) === false) return resolve()
      // 前往仓库
      this.send(`stopstate,jh fam 0 start,go north,go west,pack,store`);
      // 仓库数据
      if ((await this.awaitStoreList()) === false) return resolve()
      // 检查武器
      const eqName = (this.equipList[0] || {}).name || ``;
      if (/铁镐/.test(eqName)) return [this.onText(`挖矿任务装备${eqName}。`, `hig`), this.send(`stopstate,wakuang`), resolve()]
      // 检查背包
      const packItem = this.packList.find(x => /铁镐/.test(x.name));
      if (packItem) return [this.onText(`挖矿任务装备${packItem.name}。`, `hig`), this.send(`stopstate,wakuang`), resolve()]
      // 检查仓库
      const storeItem = this.storeList.find(x => /铁镐/.test(x.name));
      if (storeItem) return [this.onText(`挖矿任务装备${storeItem.name}。`, `hig`), this.send(`stopstate,qu 1 ${storeItem.id},wakuang`), resolve()]
      // 清理背包
      if ((await this.toClear()) === false) return resolve()
      // 寻找铁匠
      this.send(`stopstate,jh fam 0 start,go east,go east,go south`);
      const npcId = await this.awaitNpcName(`铁匠铺老板`);
      if (npcId === undefined) return resolve()
      // 浏览商品
      this.send(`stopstate,list ${npcId}`);
      if ((await this.awaitSellList()) === false) return resolve()
      // 购买铁镐
      const sellItem = this.sellList.find(x => /铁镐/.test(x.name));
      if (sellItem) {
        this.onText(`挖矿任务购买${sellItem.name}。`, `hig`);
        this.send(`stopstate,buy 1 ${sellItem.id} from ${this.seller},wakuang`);
        return resolve()
      }
      // 挖矿失败
      this.onText(`挖矿任务失败。`, `hir`);
      this.send(`stopstate,wakuang`);
      resolve();
    })
  }
  var ToWakuang = {
    methods: { toWakuang },
  };

  function toXiulian() {
    return new Promise(async resolve => {
      // 正在修炼
      if (this.statText === `修炼` || this.statText === `闭关`) {
        this.onText(`修炼任务正在进行。`, `hig`);
        return resolve()
      }
      // 检查状态
      if ((await this.toCheck()) === false) return resolve()
      // 前往练功
      this.send(`stopstate,jh fam 0 start,go west,go west,go north,go enter,go west,xiulian`);
      // 等待房间
      if ((await this.awaitRoomPath(`home/liangong`)) === false) return resolve()
      // 任务完成
      this.onText(`修炼任务已完成。`, `hig`);
      resolve();
    })
  }
  var ToXiulian = {
    methods: { toXiulian },
  };

  function toDazuo() {
    return new Promise(async resolve => {
      // 检查状态
      if ((await this.toCheck()) === false) return resolve()
      // 前往打坐
      this.send(`stopstate,jh fam 0 start,go west,go west,go north,go enter,go west,dazuo`);
      // 等待房间
      if ((await this.awaitRoomPath(`home/liangong`)) === false) return resolve()
      // 任务完成
      this.onText(`打坐任务已完成。`, `hig`);
      resolve();
    })
  }
  var ToDazuo = {
    methods: { toDazuo },
  };

  function toTaskFb() {
    return new Promise(async resolve => {
      // 检查开关
      if (this.options.canTaskFb === false) {
        return resolve()
      }
      // 检查次数
      if (this.fbCount >= 20) {
        this.onText(`副本任务已完成。`, `hig`);
        return resolve()
      }
      // 检查状态
      const toCheck = await this.toCheck();
      if (toCheck === false) {
        return resolve()
      }
      // 扫古宗门
      if (this.options.canTaskGzm === true) {
        if (this.wdCount !== 99) {
          this.onText(`副本任务古宗门无法扫荡，武道塔低于九十九层。`, `hir`);
          return resolve()
        }
        // 检查背包
        this.send(`pack`);
        if ((await this.awaitPackList()) === false) return resolve()
        // 前往清理背包
        if (this.packCount >= this.packLimit) {
          if ((await this.toClear()) === false) return resolve()
        }
        // 前往塔顶
        this.send(`stopstate,jh fam 9 start,go enter,go up`);
        // 疯癫的老头
        const npcId = await this.awaitNpcName(`疯癫的老头`);
        if (npcId === undefined) return resolve()
        // 前往古大陆
        this.send(`ggdl ${npcId},go north,go north,go north,go north,go north,go north,tiao1 shi,tiao1 shi,tiao2 shi,jumpdown`);
        const awaitRoomPath = await this.awaitRoomPath(`zc/shanjiao`);
        if (awaitRoomPath === false) return resolve()
        // 扫荡古宗门五次
        this.send(`cr gmp/shanmen 0 5`);
        await this.await(2500);
      }
      // 检查背包
      this.send(`tasks,pack`);
      if ((await this.awaitPackList()) === false) return resolve()
      // 前往清理背包
      if (this.packCount >= this.packLimit) {
        if ((await this.toClear()) === false) return resolve()
      }
      // 检查次数
      if (this.fbCount >= 20) {
        this.onText(`副本任务已完成。`, `hig`);
        return resolve()
      }
      // 扫荡副本
      if (this.options.canTaskFb) {
        const id = this.options.canTaskFbId;
        const type = this.options.canTaskFbType;
        const count = 20 - this.fbCount;
        this.send(`stopstate,cr ${id} ${type} ${count}`);
        await this.await(count / 2 * 1000);
      }
      // 检查背包
      this.send(`tasks,pack`);
      if ((await this.awaitPackList()) === false) return resolve()
      this.onText(`副本任务已完成。`, `hig`);
      resolve();
    })
  }
  var ToTaskFb = {
    methods: { toTaskFb },
  };

  var FAMLIY_DATA = {
  	"无门无派": {
  	master: {
  		name: "教习",
  		commands: "stopstate,jh fam 0 start,go south,go south,go west",
  		path: "yz/wuguan"
  	}
  },
  	"武当派": {
  	master: {
  		name: "谷虚道长",
  		commands: "stopstate,jh fam 1 start,go north",
  		path: "wd/sanqing"
  	},
  	chief: {
  		name: "首席弟子",
  		commands: "stopstate,jh fam 1 start,go west,go northup",
  		path: "wd/taiziyan"
  	}
  },
  	"少林派": {
  	master: {
  		name: "清乐比丘",
  		commands: "stopstate,jh fam 2 start",
  		path: "shaolin/guangchang"
  	},
  	chief: {
  		name: "大师兄",
  		commands: "stopstate,jh fam 2 start,go north,go north,go northwest,go northeast,go north",
  		path: "shaolin/lianwu"
  	}
  },
  	"华山派": {
  	master: {
  		name: "高根明",
  		commands: "stopstate,jh fam 3 start",
  		path: "huashan/zhenyue"
  	},
  	chief: {
  		name: "首席弟子",
  		commands: "stopstate,jh fam 3 start,go westup,go north",
  		path: "huashan/lianwu"
  	}
  },
  	"峨眉派": {
  	master: {
  		name: "苏梦清",
  		commands: "stopstate,jh fam 4 start,go west",
  		path: "emei/miaomen"
  	},
  	chief: {
  		name: "大师姐",
  		commands: "stopstate,jh fam 4 start,go west,go south",
  		path: "emei/guangchang"
  	}
  },
  	"逍遥派": {
  	master: {
  		name: "苏星河",
  		commands: "stopstate,jh fam 5 start",
  		path: "xiaoyao/qingcaop"
  	},
  	chief: {
  		name: "首席弟子",
  		commands: "stopstate,jh fam 5 start,go west",
  		path: "xiaoyao/linjian3"
  	}
  },
  	"丐帮": {
  	master: {
  		name: "左全",
  		commands: "stopstate,jh fam 6 start,go down",
  		path: "gaibang/shudongxia"
  	},
  	chief: {
  		name: "首席弟子",
  		commands: "stopstate,jh fam 6 start,go down,go east,go east,go east",
  		path: "gaibang/mishi"
  	}
  },
  	"杀手楼": {
  	master: {
  		name: "何小二",
  		commands: "stopstate,jh fam 7 start,go north",
  		path: "shashou/datang"
  	},
  	chief: {
  		name: "金牌杀手",
  		commands: "stopstate,jh fam 7 start,go north,go up,go up,go up,go up,go east",
  		path: "shashou/liangong"
  	}
  }
  };

  function toTaskQa() {
    return new Promise(async resolve => {
      // 检查选项
      if (this.options.canTaskQa === false) return resolve()
      // 无门无派
      if (this.familyText === `无门无派`) return [this.onText(`请安任务无门无派不可完成。`, `hir`), resolve()]
      // 已经完成
      if (this.qaComplete) return [this.onText(`请安任务已完成。`, `hig`), resolve()]
      // 获取首席数据
      const familyData = FAMLIY_DATA[this.familyText];
      if (this.hasOwn(familyData, `chief`) === false) return [this.onText(`请安任务获取首席数据失败。`, `hir`), resolve()]
      const chief = familyData.chief;
      // 前往指定房间
      this.send(chief.commands);
      // 等待指定房间
      const awaitRoomPath = await this.awaitRoomPath(chief.path);
      if (awaitRoomPath === false) return resolve()
      // 查找首席弟子
      await this.await();
      const npc = this.npcList.find(x => x.name.includes(chief.name));
      if (npc) {
        this.onText(`请安任务目标${npc.name.replace(/\s/g, ``)}。`, `hig`);
        this.send(`ask2 ${npc.id},tasks`);
      } else {
        this.onText(`请安任务找不到目标${this.familyText}${chief.name}。`, `hir`);
      }
      resolve();
    })
  }
  var ToTaskQa = {
    methods: { toTaskQa },
  };

  var SELL_DATA = [
  	{
  		seller: "店小二",
  		selllist: [
  			"<wht>米饭</wht>",
  			"<hiy>神仙醉</hiy>",
  			"<hig>醉仙酿</hig>",
  			"<wht>女儿红</wht>",
  			"<wht>花雕酒</wht>",
  			"<wht>米酒</wht>",
  			"<wht>扬州炒饭</wht>",
  			"<wht>面条</wht>",
  			"<wht>包子</wht>",
  			"<wht>鸡腿</wht>"
  		],
  		commands: "stopstate,jh fam 0 start,go north,go north,go east"
  	},
  	{
  		seller: "杂货铺老板",
  		selllist: [
  			"<wht>长鞭</wht>",
  			"<wht>簪子</wht>",
  			"<wht>铁戒指</wht>",
  			"<wht>布鞋</wht>",
  			"<wht>英雄巾</wht>",
  			"<wht>木棍</wht>",
  			"<wht>布衣</wht>"
  		],
  		commands: "stopstate,jh fam 0 start,go east,go south"
  	},
  	{
  		seller: "铁匠铺老板",
  		selllist: [
  			"<wht>铁剑</wht>",
  			"<wht>钢刀</wht>",
  			"<wht>铁棍</wht>",
  			"<wht>铁杖</wht>",
  			"<wht>飞镖</wht>"
  		],
  		commands: "stopstate,jh fam 0 start,go east,go east,go south"
  	},
  	{
  		seller: "药铺老板",
  		selllist: [
  			"<hig>金创药</hig>",
  			"<hig>引气丹</hig>"
  		],
  		commands: "stopstate,jh fam 0 start,go east,go east,go north"
  	}
  ];

  const SM_GIVE_UP = `<hiw>师门任务放弃</hiw>`;
  function toTaskSm() {
    return new Promise(async resolve => {
      // 检查选项
      if (this.options.canTaskSm === false) return resolve()
      // 已经完成
      if (this.smCount >= 20) return [this.onText(`师门任务已完成。`, `hig`), resolve()]
      // 检查状态
      const toCheck = await this.toCheck();
      if (toCheck === false) return resolve()
      // 检查背包
      this.send(`pack`);
      const awaitPackList = await this.awaitPackList();
      if (awaitPackList === false) return resolve()
      if (this.packCount >= this.packLimit) {
        // 前往清理背包
        const toClear = await this.toClear();
        if (toClear === false) return resolve()
        if (this.packCount + 1 >= this.packLimit) return resolve()
      }
      // 获取师傅数据
      const familyData = FAMLIY_DATA[this.familyText];
      if (this.hasOwn(familyData, `master`) === false) return [this.onText(`师门任务获取师傅数据失败。`, `hir`), resolve()]
      const master = familyData.master;
      // 查找门派师傅
      this.send(master.commands);
      const masterId = await this.awaitNpcName(master.name);
      if (masterId === false) return [this.onText(`师门任务找不到师傅${this.familyText}${master.name}。`, `hir`), resolve()]
      // 放弃师门任务
      if (this.options.canTaskSmGiveup && this.smTarget === SM_GIVE_UP) {
        this.onText(`师门任务放弃。`, `hir`);
        this.send(`task sm ${masterId} giveup`);
        this.smTarget = ``;
      }
      // 请求师门任务
      if (this.smTarget === ``) {
        this.send(`task sm ${masterId},tasks`);
        // 获取任务数据
        const awaitTaskData = await this.awaitTaskData();
        if (awaitTaskData === false) return resolve()
      }
      // 查找背包
      const pack = this.packList.find(x => x.name === this.smTarget);
      // 提交任务物品 结束
      if (pack) {
        // this.onText(`师门任务提交${this.smTarget}给${master.name}。`, `hig`)
        this.send(`task sm ${masterId} give ${ pack.id },pack,task sm ${masterId},tasks`);
        // 获取任务数据
        const awaitTaskData = await this.awaitTaskData();
        if (awaitTaskData === false) return resolve()
        await this.toTaskSm();
        return resolve()
      }
      // 查找商店
      const sell = SELL_DATA.find(x => (x.selllist instanceof Array) && x.selllist.includes(this.smTarget));
      if (sell) {
        this.send(sell.commands);
        const npcId = await this.awaitNpcName(sell.seller);
        if (npcId) {
          this.send(`list ${npcId}`);
          const awaitSellList = await this.awaitSellList();
          if (awaitSellList) {
            const item = this.sellList.find(x => x.name === this.smTarget);
            // 购买任务物品 结束
            if (item) {
              // this.onText(`师门任务商店获取${this.smTarget}。`, `hig`)
              this.send(`buy 1 ${item.id} from ${this.seller}`);
              await this.toTaskSm();
              return resolve()
            }
          }
        }
      }
      // 查找仓库
      if (this.options.canTaskSmStore) {
        this.send(`stopstate,jh fam 0 start,go north,go west,pack,store`);
        const awaitStoreList = await this.awaitStoreList();
        if (awaitStoreList) {
          const store = this.storeList.find(x => x.name === this.smTarget);
          // 取出任务物品 结束
          if (store) {
            // this.onText(`师门任务仓库获取${this.smTarget}。`, `hig`)
            this.send(`qu 1 ${ store.id }`);
            await this.toTaskSm();
            return resolve()
          }
        }
      }
      // 师门令牌
      if (this.options.canTaskSmCard && this.smTotal < 110) {
        const cardRegExp = this.smTotal < 30 ? /^<hi[gcyzo]>师门令牌/i
          : this.smTotal < 50 ? /^<hi[cyzo]>师门令牌/i
          : this.smTotal < 70 ? /^<hi[yzo]>师门令牌/i
          : this.smTotal < 90 ? /^<hi[zo]>师门令牌/i
          : /^<hio>师门令牌/i;
        const card = this.packList.find(x => cardRegExp.test(x.name));
        // 目标师门令牌 结束
        if (card) {
          this.smTarget = card.name;
          // this.onText(`师门任务准备提交${this.smTarget}。`, `hig`)
          await this.toTaskSm();
          return resolve()
        }
      }
      // 放弃师门任务 结束
      if (this.options.canTaskSmGiveup) {
        this.smTarget = SM_GIVE_UP;
        await this.toTaskSm();
        return resolve()
      }
      return resolve()
    })
  }
  var ToTaskSm = {
    methods: { toTaskSm },
  };

  function toTaskYm() {
    return new Promise(async resolve => {
      // 检查选项
      if (this.options.canTaskYm === false) return resolve()
      // 已经完成
      if (this.ymCount >= 20) return [this.onText(`追捕任务已完成。`, `hig`), resolve()]
      // 检查状态
      const toCheck = await this.toCheck();
      if (toCheck === false) return resolve()
      // 扬州知府
      this.send(`stopstate,jh fam 0 start,go west,go north,go north`);
      const npcId = await this.awaitNpcName(`扬州知府`);
      if (npcId === false) return resolve()
      // 请求任务
      this.send(`tasks`);
      // 扫荡追捕
      if (this.options.canTaskYmSweep) {
        // 次数不足
        if (this.ymTotal - this.ymCount < 20) {
          if (this.options.canTaskYmGiveup) {
            this.send(`ask1 ${npcId},ask2 ${npcId}`); // 接受任务 然后放弃
          } else {
            this.onText(`<hir>追捕任务的扫荡次数不足。</hir>`);
            return resolve()
          }
        }
        this.send(`ask3 ${npcId}`);
        await this.await(10000);
        this.onText(`追捕任务已完成。`, `hig`);
        this.send(`tasks`);
        return resolve()
      }
      return resolve()
    })
  }
  var ToTaskYm = {
    methods: { toTaskYm },
  };

  function toTaskWd() {
    return new Promise(async resolve => {
      // 检查开关
      if (this.options.canTaskWd === false) return resolve()
      // 任务数据
      this.send(`tasks`);
      if ((await this.awaitTaskData()) === false) return resolve()
      // 已经完成
      if (this.wdCount === this.wdTotal && this.wdComplete) return [this.onText(`武道任务已完成。`, `hig`), resolve()]
      // 检查状态
      if ((await this.toCheck()) === false) return resolve()
      // 前往武道塔门口 重置
      if (this.wdCount === this.wdTotal && this.wdComplete === false) {
        this.send(`stopstate,jh fam 9 start`);
        const npcId = await this.awaitNpcName(`守门人`);
        if (npcId === undefined) return resolve()
        this.send(`ask1 ${npcId}`); // 重置
      }
      // 前往武道塔塔内 武道塔守护者
      if (this.roomPath === `wudao/ta`) this.send(`stopstate,go up`);
      else if (this.roomPath === `wudao/men`) this.send(`stopstate,go enter`);
      else this.send(`stopstate,jh fam 9 start,go enter`);
      const npcId = await this.awaitNpcName(`武道塔守护者`);
      if (npcId === undefined) return resolve()
      // 进入战斗
      this.send(`kill ${npcId}`);
      // 战斗结束
      const awaitCombatEnd = await this.awaitCombatEnd();
      if (awaitCombatEnd === false) {
        return resolve()
      }
      // 进入循环
      await this.toTaskWd();
      return resolve()
    })
  }
  var ToTaskWd = {
    methods: { toTaskWd },
  };

  function toTask() {
    return new Promise(async resolve => {
      // 扫荡副本
      await this.toTaskFb();
      // 请安
      await this.toTaskQa();
      // 师门
      await this.toTaskSm();
      // 衙门追捕
      await this.toTaskYm();
      // 武道塔
      await this.toTaskWd();
      // 挖矿结束
      if (this.options.canTaskEndWk) {
        await this.toWakuang();
        return resolve()
      }
      // 闭关结束
      if (this.options.canTaskEndBg) {
        await this.toXiulian();
        return resolve()
      }
      // 打坐结束
      if (this.options.canTaskEndDz) {
        await this.toDazuo();
        return resolve()
      }
      resolve();
    })
  }
  var ToTask = {
    methods: { toTask },
  };

  // 创建应用程序实例
  const app = Vue.createApp({
    mixins: [
      ValkyrieWorker, // Web Worker
      ValkyrieAwait, // 同步监听
      ValkyrieOptions, // 配置项
      OnLogin,
      OnRoom,
      OnMap,
      OnExits,
      OnItems, // items, itemadd, itemremove, sc
      OnState,
      OnScore,
      OnPack,
      OnSkills,
      OnPerform,
      OnTasks,
      OnList,
      OnMsg,
      OnText,
      OnCustomCommand, // 自定义指令模块
      ToCheck,
      ToClear,
      ToWakuang,
      ToXiulian,
      ToDazuo,
      ToTaskFb,
      ToTaskQa,
      ToTaskSm,
      ToTaskYm,
      ToTaskWd,
      ToTask,
    ],
  });
  // 加载 Element3 UI 组件库
  app.use(Element3);
  // <app-icon>
  app.component(`app-icon`, {
    props: [`icon`],
    emits: [`click`],
    methods: {
      click() {
        this.$emit(`click`);
      },
    },
    template: `<i class="cursor-pointer" :class="icon" @click="click"></i>`,
  });
  // <app-header>
  app.component(`app-header`, {
    props: [`title`, `show`],
    emits: [`update:show`],
    methods: {
      toggle() {
        this.$emit(`update:show`, !this.show);
      },
    },
    template: `
<div class="app-header unselectable">
  <div><span class="font-cursive" v-text="title"></span></div>
  <div><slot></slot>
    <app-icon :icon="show?'el-icon-caret-bottom':'el-icon-caret-right'" @click="toggle"></app-icon>
  </div>
</div>`,
  });
  // <app-panel>
  app.component(`app-panel`, {
    props: [`show`],
    template: `<transition name="app-panel"><div class="app-panel" v-show="show"><slot></slot></div></transition>`,
  });
  // <app-dialog>
  app.component(`app-dialog`, {
    data() {
      return { showDialog: false }
    },
    props: [`title`, `width`, `show`],
    emits: [`update:show`],
    watch: {
      show(value) {
        this.showDialog = value;
      },
      showDialog(value) {
        this.$emit(`update:show`, value);
      },
    },
    template: `<el-dialog :title="title" :width="width" v-model:visible="showDialog" center destroy-on-close><slot></slot></el-dialog>`,
  });
  // <app-button>
  app.component(`app-button`, {
    template: `<div class="app-button font-cursive"><slot></slot></div>`,
  });
  // 禁止 Vue3 的开发模式警告信息
  app.config.warnHandler = function(msg, vm, trace) {}; // trace 是组件的继承关系追踪
  // DOM 加载完毕
  document.addEventListener(`DOMContentLoaded`, function() {
    // head
    document.head.insertAdjacentHTML(`beforeend`, HeadHTML);
    // css
    document.head.insertAdjacentHTML(`beforeend`, `<style>${ValkyrieStyle}</style>`);
    // body
    document.body.insertAdjacentHTML(`beforeend`, BodyHTML);
    // room
    document.querySelector(`.map-panel`).remove();
    document.querySelector(`.room-title`).remove();
    document.querySelector(`.room_desc`).remove();
    document.querySelector(`.content-room`).insertAdjacentHTML(`afterbegin`, `<div id="app-room"></div>`);
    // 挂载 Valkyrie
    unsafeWindow.Valkyrie = app.mount(`#app`);
  });
  // 全局 Vue 对象
  unsafeWindow.Vue = Vue;

}());
