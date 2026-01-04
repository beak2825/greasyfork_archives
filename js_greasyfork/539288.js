// ==UserScript==
// @name            妖火网增强脚本Plus
// @namespace       http://tampermonkey.net/
// @version         1.0.4
// @description     让妖火再次变得伟大(手动狗头.jpg)
// @author          柠檬没有汁@27894、院长
// @match           *://yaohuo.me/*
// @match           *://*.yaohuo.me/*
// @icon            https://yaohuo.me/css/favicon.ico
// @run-at          document-body
// @license         MIT
// @grant           none
// @noframes
// @homepage        https://www.yaohuo.me/bbs/userinfo.aspx?touserid=27894
// @supportURL      https://www.yaohuo.me/bbs/userinfo.aspx?touserid=27894
// @downloadURL https://update.greasyfork.org/scripts/539288/%E5%A6%96%E7%81%AB%E7%BD%91%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%ACPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/539288/%E5%A6%96%E7%81%AB%E7%BD%91%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%ACPlus.meta.js
// ==/UserScript==

/* ================================================== 变量开始 ================================================== */

// 脚本默认设置
const defaultSetting = {
  version: "9.9.9", // 脚本版本
  checkVersion: false, // 检查更新

  firstLoadScript: true, // 第一次加载脚本
  showSettingIcon: true, // 显示设置 logo
  settingIconSize: 50, // 设置 logo 大小
  showTopAndDownBtn: true, // 显示一键回到顶部/底部
  hideXunzhang: false, // 隐藏勋章

  showBookViewUbb: false, // 发帖 ubb 展开
  showBookViewEmoji: false, // 发帖表情展开
  // autoCloseBookViewUbb:false,// 发帖 ubb 点击后自动关闭
  autoCloseBookViewEmoji: false, // 发帖表情点击后自动关闭

  showHuifuUbb: false, // 回帖 ubb 展开
  showHuifuEmoji: false, // 回帖表情展开
  // autoCloseHuifuUbb:false,// 发帖 ubb 点击后自动关闭
  autoCloseHuifuEmoji: false, // 发帖表情点击后自动关闭
  bookviewEmojiPage: 1, // 发帖表情分页页码
  huifuEmojiPage: 1, // 回帖表情分页页码

  imgBlur: false,// 图片模糊
  imgThumbWidth: 200, // 图片缩小后显示宽度
  useRight: false, // 下一页显示在右边
  autoLoadMoreBookList: false, // 帖子列表自动加载更多
  autoLoadMoreHuifuList: false, // 回复列表自动加载更多
  openLayerForBook: false, // pc 端帖子在弹窗中打开

  imgUploadApiUrl: ["https://aapi.helioho.st/upload.php", "https://img.ink/api/upload"],
  imgUploadSelOpt: 0, // 使用图床
  suimoToken: "", // 水墨图床 token
  textareaAutoFocus: true, // 输入框自动获取焦点

  showMoreSetting: true, // 高级设置
  oneClickCollectMoney: false, // 一键吃肉
  showChuiniuHistory: false, // 显示吹牛发布者历史
  showHuifuCopy: false, // 复读机(回复+1)
  huifuCopyAutoSubmit: false, // 复读机自动提交
  useUserBlackList: false, // 使用用户黑名单
  userBlackList: "", // 黑名单,填入用户ID即可屏蔽帖子和回复
  userCustomEmojiList: "" // 自定义表情,填入表情代码即可使用
};
// 自定义样式
const customCSS = `
  .v2jun-reset{
    margin:0;
    padding:0;
  }
  /* 设置弹出框 样式 */
  .v2jun-setting-div ul li{
    display:flex;
    margin:10px auto;
    justify-content: center;
    align-items: center;
  }
  .v2jun-setting-div ul li + .setting-li-between{
    padding:0 10px;
    justify-content: space-between;
  }
  .v2jun-setting-div ul li + .setting-li-tips{
    font-size: 12px;
    line-height: 14px;
    display: block;
    padding: 0 10px;
    margin: -10px 0 0;
    color: red;
    text-align: left;
  }
  .v2jun-setting-li-title hr{
    flex:1;
  }
  .v2jun-setting-li-title hr:nth-of-type(1){
    margin-right:10px;
  }
  .v2jun-setting-li-title hr:nth-of-type(2){
    margin-left:10px;
  }
  .v2jun-setting-cancel-btn {
    background-color: #999;
    color: #fff;
    border-radius:5px;
    padding: 5px 10px;
  }
  .v2jun-setting-confirm-btn {
    background-color: #1677ff;
    color: #fff;
    border-radius:5px;
    padding: 5px 10px;
    margin-left: 10px;
  }
  .v2jun-setting-confirm-btn{
    width:50px;
    padding-left:10px;
    height:15px;
  }
  .v2jun-setting-li-input{
    width:50px;
    padding-left:10px;
    height:15px;
  }
  .v2jun-setting-div ::-webkit-input-placeholder {
    font-size:12px;
  }
  .v2jun-setting-div ::-moz-placeholder {
    font-size:12px;
  }

  /* 开关 样式 */
  .v2jun-switch {
    position: relative;
    float: left;
    width: 60px;
    margin: 0;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
  .v2jun-switch-checkbox {display: none;}
  .switch-label {
    display: block;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid #999999;
    border-radius: 20px;
  }
  .v2jun-switch-inner {
    display: block;
    width: 200%;
    margin-left: -100%;
  }
  .v2jun-switch-inner::before,
  .v2jun-switch-inner::after {
    display: block;
    float: right;
    width: 50%;
    height: 20px;
    line-height: 20px;
    padding: 0;
    font-size: 14px;
    color: white;
    font-family: Trebuchet, Arial, sans-serif;
    font-weight: bold;
    box-sizing: border-box;
  }
  .v2jun-switch-inner::after {
    content: attr(data-on);
    padding-left: 10px;
    background-color: #00e500;
    color: #FFFFFF;
    text-align:left;
  }
  .v2jun-switch-inner::before {
    content: attr(data-off);
    padding-right: 10px;
    background-color: #EEEEEE;
    color: #999999;
    text-align: right;
  }
  .v2jun-switch-handle {
    position: absolute;
    top: 0;
    bottom: 0;
    /*right: 72px;*/
    display: block;
    width: 14px;
    height: 14px;
    margin: 3px;
    background: #FFFFFF;
    border: 2px solid #999999;
    border-radius: 50%;
  }
  .v2jun-switch-checkbox:checked + .switch-label .v2jun-switch-inner {
    margin-left: 0;
  }
  .v2jun-switch-checkbox:checked + .switch-label .v2jun-switch-handle {
    right: 0px;
  }
  /* 复读机按钮 样式 */
  .v2jun-huifu-copy{
    display: inline-block;
    height:22px;
    line-height:22px;
    padding:0 10px;
    text-align:center;
    color:#fff;
    margin:0 10px 0 20px;
    background-color: #407088;
    border-radius: 5px;
    white-space:nowrap;
  }

  .v2jun-custom-toggle-btn{
    background-image: linear-gradient(#f4f4f4,#ececec);
    display: inline-block;
    overflow: visible;
    margin: 0 5px 7px;
    padding: .5em 1em;
    outline: 0;
    border: 1px solid #d4d4d4;
    color: orangered;
    text-decoration: none;
    white-space: nowrap;
    font: 11px/normal sans-serif;
    cursor: pointer;
    border-radius: 5px;
  }
  /* 表情增强 样式 */
  .v2jun-emojilist-div{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
    grid-gap: 2px;
    /*display: flex;
    justify-content: space-between;
    flex-wrap: wrap;*/
    padding: 5px;
    margin-bottom:5px;
    font-size: 12px;
    border: 1px solid #d4d4d4;
    border-radius: 5px 5px 0 0;
  }
  .v2jun-emojilist-img{
    width:50px;
    height:50px;
  }
  .v2jun-huifu-emoji{
    margin:0 1% 5px;
    border-color:#d4d4d4;
  }
  /* ubb 增强 样式 */
  .v2jun-ubblist-div{
    display:flex;
    flex-wrap: wrap;
    gap: 4px 4px;
    justify-content: space-between;
    margin-bottom:5px;
    padding:5px;
    font-size:12px;
    border: 1px solid #eee;
    border-radius: 5px;
  }
  .v2jun-ubb-item{
    height:25px;
    line-height:25px;
    /*margin:0 5px 5px 0;*/
    padding:0 10px;
    display:inline-block;
    border: 1px solid #1abc9c;
    color: #333;
    text-decoration: none;
    border-radius:30px;
  }
  .v2jun-huifu-ubb{
    margin:0 1% 5px;
    border-color:#d4d4d4;
  }

  .v2jun-clear-setting{
    color:#3d68a8;
    margin-left:-4px;
  }

  /* 等待提示框 样式 */
  .v2jun-wait-box-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
  }
  .v2jun-wait-box-modal {
    background: white;
    padding: 20px 20px 10px;
    border-radius: 10px;
    text-align: center;
  }
  .v2jun-wait-box-spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: #09f;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .v2jun-huifu-ubb-list-div{
    margin: 0 1%;
    padding:10px;
    font-size:12px;
    border: 1px solid #d4d4d4;
    border-radius: 8px;
  }
  .v2jun-huifu-ubb-list-title{
    height:14px;
    display:flex;
    justify-content: center;
    align-items: center;
    color:red;
  }
  .v2jun-huifu-ubb-list-title hr{
    flex:1;
  }
  .v2jun-huifu-ubb-list-title hr:nth-of-type(1){
    margin-right:10px;
  }
  .v2jun-huifu-ubb-list-title hr:nth-of-type(2){
    margin-left:10px;
  }
  .v2jun-huifu-ubb-box{
    display:flex;
    flex-wrap: wrap;
    gap: 4px 4px;
    justify-content: space-between;
    margin:6px 0;
  }

  .v2jun-input-popup-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  .v2jun-input-popup {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    width: 600px;
    max-width:80%;
  }
  .v2jun-input-popup-label {
    display: block;
    font-weight: bold;
  }
  .v2jun-input-popup-textarea {
    width: 100%;
    min-height: 40px;
    resize: vertical;
  }
  .v2jun-input-popup-buttons {
    text-align: center;
  }
  .v2jun-input-popup-submit-btn, .v2jun-input-popup-cancel-btn {
    margin: 0 10px;
    border:0;
  }
  .v2jun-input-popup-submit-btn{
    background-color: #1677ff;
    color: #fff;
    border-radius: 5px;
    padding: 5px 10px;
    margin-left: 10px;
  }
  .v2jun-input-popup-cancel-btn {
    background-color: #999;
    color: #fff;
    border-radius: 5px;
    padding: 5px 10px;
  }
  .v2jun-popup-setting-import,.v2jun-popup-setting-export{
    background-color: #666;
    color: #fff;
    border-radius: 5px;
    padding: 5px 30px;
    letter-spacing: 2px;
  }
`;
// 表情
const emojiList = [
  // 论坛自带表情
  "face/踩.gif",
  "face/狂踩.gif",
  "face/淡定.gif",
  "face/囧.gif",
  "face/不要.gif",
  "face/重拳出击.gif",
  "face/砳砳.gif",
  "face/滑稽砳砳.gif",
  "face/沙发.gif",
  "face/汗.gif",
  "face/亲亲.gif",
  "face/太开心.gif",
  "face/酷.gif",
  "face/思考.gif",
  "face/发呆.gif",
  "face/得瑟.gif",
  "face/哈哈.gif",
  "face/泪流满面.gif",
  "face/放电.gif",
  "face/困.gif",
  "face/超人.gif",
  "face/害羞.gif",
  "face/呃.gif",
  "face/哇哦.gif",
  "face/要死了.gif",
  "face/谢谢.gif",
  "face/抓狂.gif",
  "face/无奈.gif",
  "face/不好笑.gif",
  "face/呦呵.gif",
  "face/感动.gif",
  "face/喜欢.gif",
  "face/疑问.gif",
  "face/委屈.gif",
  "face/你不行.gif",
  "face/流口水.gif",
  "face/潜水.gif",
  "face/咒骂.gif",
  "face/耶耶.gif",
  "face/被揍.gif",
  "face/抱走.gif",

  // 自定义表情
  "http://static2.51gonggui.com/FhBfMfl4sGC3QJVTMaLqEKkE90Ia#.gif",
  "http://static2.51gonggui.com/FoKvdu89eiq0q-24IfOM2mFB0vIq#.gif",
  "http://static2.51gonggui.com/FmNyrjU8Wq0m3PiwHQJwDhHdv-EJ#.gif",
  "http://static2.51gonggui.com/FrZ6GDJiOAz3pp4e5_8uSShSXXXk#.gif",
  "http://static2.51gonggui.com/FiZiSSyXSa8eCzwOXmIfOOpfA_7a#.gif",
  "http://static2.51gonggui.com/FqNDzswUNJ-AsSHXyxXB4Qm1X0y-#.gif",
  "http://static2.51gonggui.com/Fsq-HyBc5lP6vZY_qeWofOM9mRVH#.gif",
  "http://static2.51gonggui.com/FkEHwSlEfQ7bWya6-wg366Xy91qW#.gif",
  "http://static2.51gonggui.com/Fi2hY7M9DPgD9s0aCWemwk2iYUDW#.gif",
  "http://static2.51gonggui.com/Fhry6EpdUBqFCt3OOyQTkLZMZGFR#.gif",
  "http://static2.51gonggui.com/FhgYnWJ-apnyjSXOpInJhLbfUQFY#.gif",
  "http://static2.51gonggui.com/FvSxOEIhyA7ID1J8emIME7tBT7Io#.gif",
  "https://pic2.ziyuan.wang/2023/10/05/yaohuo007_6d248534e18f5.gif",
  "http://static2.51gonggui.com/FunDHky9UKkB-4zj-bfSb82u81Xg#.gif",
  "http://static2.51gonggui.com/FgXUeACmKWWMDT9hrpVAnQp4dCqF#.gif",
  "http://static2.51gonggui.com/Fg_qtra3abNozPxaoEMVKO7VIsuX#.gif",
  "http://static2.51gonggui.com/Fj7WAkv87tpL1I26WQgSaXlsyYBL#.gif",
  "http://static2.51gonggui.com/FgwFBazeUavJcw-SL7FS6wUkcUTk#.gif",
  "https://pic2.ziyuan.wang/2023/05/02/17a86bd7372d8.GIF",
  "https://pic2.ziyuan.wang/2023/05/17/177e4e0e2f28d.gif",
  "https://pic2.ziyuan.wang/2023/06/19/f50dc2fbf34ac.gif",
  "https://pic2.ziyuan.wang/user/13530769942/2023/12/yaohuo.me_694810949_5f454a4387b2d.png",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/FkyiMRaJI1BfuA6T3w4Z9mJh1qbg_3e38409950af1.gif",
  "https://pic2.ziyuan.wang/2023/05/16/5152d0749ff41.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/FpZEifxiFGs1BWtHjFsk5tJJNKSE_8b6f63437539d.gif",
  "https://pic2.ziyuan.wang/2023/06/15/5640689a44056.GIF",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/FvMXbnIX8RavSBAhflxf1zomD1ov_902abba24378b.gif",
  "https://pic2.ziyuan.wang/2023/07/11/30aff1eed1845.GIF",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/FkeVK5icB5-Pc7mbZitDTX1AqfNO_3a687a8c7683f.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/Fit100hjJ-T5RwQxeNdoVWplvNvU_96758df767a69.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/v2-568bb2311e00c3ecbc4dd49ab0709f09_b_5215574668d2f.gif",
  "https://pic2.ziyuan.wang/user/sub/2024/04/458ed8da862d4a71bc5ab4c2435711fd_088c2fc6f5680.png",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_76964470c8b1b.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_0318a6f925fbc.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_4629d7fff2f0a.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_99ab94aa14e58.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_4917d00f77b70.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_7b42669bad9e0.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_3cb79bd54abd2.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_ae29120dd414c.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_d729e16f5178a.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_f17b227dc0b65.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_32ca0d60dcdcc.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_f524ab469146c.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_f72a3922675d8.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_a1114209167b6.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_91e15b0079ada.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_38a61440b1cd3.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_933c24257fae8.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_f0f73185a8b01.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_a56ac656a1148.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_f0562dacf1bfd.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_eff33afa00163.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_070ec2f5a6118.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_dc0b98359052f.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_163be41a06cf1.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_fa50e82d42778.png",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_4b51d01f83ef7.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_a14862d0f2c7d.png",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_34e4ae7e3abeb.png",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_c42a350bb7511.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_846823994eb82.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_b166edaec1bc4.png",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_e22a601c90e31.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_233e5e38d4d5d.png",
  "https://pic2.ziyuan.wang/2023/06/15/fb73ec52bc113.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_6453568bc84d7.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_609d4a06138ec.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_59e60f0a98da8.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_6723d2f29219d.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_0c538a929de62.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2024/12/webwxgetmsgimg_05208a26bf538.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2025/01/webwxgetmsgimg_80e3cbbc106d8.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/01/webwxgetmsgimg_7a85e377185b6.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2025/01/webwxgetmsgimg_17024a36c62c1.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2025/01/webwxgetmsgimg_aa11042623721.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/01/webwxgetmsgimg_0b17ce20017e5.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2025/01/webwxgetmsgimg_0b3366c8e4f2c.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2025/01/webwxgetmsgimg_f5e49c8b9fb10.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2025/01/webwxgetmsgimg_d7784aa75cade.png",
  "https://pic2.ziyuan.wang/user/v2jun/2025/01/webwxgetmsgimg_da4d598a0038a.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/01/webwxgetmsgimg_e1edb813037b0.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2025/01/webwxgetmsgimg_acce220dbe392.gif",
  "https://pic2.ziyuan.wang/2023/06/15/e628d8c01dd31.GIF",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_4abf7bfdc60ed.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_4917c90348a0c.gif",
  "https://pic2.ziyuan.wang/user/88188/2024/03/QM_724126154_ffebe99093e79.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_15011a3805a09.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_a5da11000111e.gif",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_f7c611250e4e6.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_bd955625f4702.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_f5220e0315e71.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_f0f3d2cc907db.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_f19bf2b6e968a.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_2bd43160ac0cf.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_0bcb8ff61e176.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_effdc1e5a1e10.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_8085686380b77.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_152a3a2d7791f.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_3a12a51f39ed7.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_3e3226766d24a.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_e73e9290ffab5.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_16e30d4d3f3e5.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_abf0a9b35e852.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_8fb59450d49d9.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_42e17b796952b.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_88413a40a35ef.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_b4510e0dcbf3e.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_bfa59025dd9bb.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_ab35a6fb3b639.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_c898a991dc3c7.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_ba74bfaaba2d5.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_bd689ae345566.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_3e36a00ccf9ca.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_b7b2a740a113d.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_6ac3667255a25.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_6ca265686c4ce.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_ec62db88c67ff.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_91d73e0e153c0.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_8009629f69f1b.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_b0fce121024b6.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_1c888990cdaac.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_77a3d33dd7534.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_73033c37f782c.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_1fac97d23d1a5.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_fc8aae05e2ae1.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_52af195cce943.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_78c1938f0e5cb.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/webwxgetmsgimg_254f5d90c59fc.jpg",
  "https://pic2.ziyuan.wang/user/v2jun/2025/04/6ba11b67f84c108d4b83a0c60717f24_b41624539f24e.jpg"
];
// ubb
const ubbList = [
  {
    ubbType: "text",
    name: "感谢分享",
    inputTitle: ["感谢分享"],
    ubbHandle: (inputValues) => `[forecolor=#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}]${inputValues[0]}[/forecolor]`
   },{
    ubbType: "input",
    name: "随机颜色字",
    inputTitle: ["随机颜色字"],
    ubbHandle: (inputValues) =>
       {
           if(inputValues[0].length>0){
               const parts = [];
               for (let i = 0; i < inputValues[0].length; i++) {
                   parts.push(`[forecolor=#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}]${inputValues[0][i]}[/forecolor]`); // 存入数组
               }
               const html = parts.join(""); // 一次性拼接
               return html;
           }else{
               return `[forecolor=#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}]${inputValues[0]}[/forecolor]`;
           }

       }
   },{
    ubbType: "input",
    name: "渐变颜色字",
    inputTitle: ["渐变颜色字"],
    ubbHandle: (inputValues) =>
       {

           let startColor = `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}`
           let endColor = `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}`
           // 渐变
           return textGradient(inputValues[0], startColor, endColor);
       }
   },{
    ubbType: "input",
    name: "单一颜色字",
    inputTitle: ["单一颜色字"],
    ubbHandle: (inputValues) => `[forecolor=#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}]${inputValues[0]}[/forecolor]`
   },{
    ubbType: "input",
    name: "超链接",
    inputTitle: ["网址", "网址说明"],
    ubbHandle: (inputValues) => `[url=${inputValues[0]}]${inputValues[1]}[/url]`
  },
  {
    ubbType: "input",
    name: "红字",
    inputTitle: ["红字内容"],
    ubbHandle: (inputValues) => `[forecolor=red]${inputValues[0]}[/forecolor]`
  },
  {
    ubbType: "input",
    name: "加粗",
    inputTitle: ["加粗内容"],
    ubbHandle: (inputValues) => `[b]${inputValues[0]}[/b]`
  },
  {
    ubbType: "input",
    name: "斜体",
    inputTitle: ["斜体内容"],
    ubbHandle: (inputValues) => `[i]${inputValues[0]}[/i]`
  },
  {
    ubbType: "input",
    name: "下划线",
    inputTitle: ["下划线内容"],
    ubbHandle: (inputValues) => `[u]${inputValues[0]}[/u]`
  },
  {
    ubbType: "input",
    name: "删除线",
    inputTitle: ["删除线内容"],
    ubbHandle: (inputValues) => `[strike]${inputValues[0]}[/strike]`
  },
  {
    ubbType: "input",
    name: "分割线",
    inputTitle: ["不需要输入内容，直接点击确定即可"],
    ubbHandle: (inputValues) => `[hr]`
  },
  {
    ubbType: "input",
    name: "代码",
    inputTitle: ["代码内容"],
    ubbHandle: (inputValues) => `[code]${inputValues[0]}[/code]`
  },
  {
    ubbType: "input",
    name: "拨号",
    inputTitle: ["手机号码"],
    ubbHandle: (inputValues) => `[call]${inputValues[0]}[/call]`
  },
  {
    ubbType: "input",
    name: "发短信",
    inputTitle: ["手机号码", "短信内容"],
    ubbHandle: (inputValues) => `[url=sms:${inputValues[0]}?body=${inputValues[0]}]点此发送[/url]`
  },
  {
    ubbType: "input",
    name: "当前时间",
    inputTitle: ["不需要输入内容，直接点击确定即可"],
    ubbHandle: (inputValues) => `[now]`
  },
  {
    ubbType: "input",
    name: "倒计时天数",
    inputTitle: ["需要倒计时的日期(格式：2030-01-01)"],
    ubbHandle: (inputValues) => `[codo]${inputValues[0]}[/codo]`
  },
  {
    ubbType: "input",
    name: "QQ音乐",
    inputTitle: ["QQ音乐歌曲链接或ID"],
    ubbHandle: (inputValues) => `[qqmusic]${inputValues[0]}[/qqmusic]`
  },
  {
    ubbType: "input",
    name: "网易云音乐",
    inputTitle: ["网易云音乐歌曲链接或ID"],
    ubbHandle: (inputValues) => `[wymusic]${inputValues[0]}[/wymusic]`
  },
  {
    ubbType: "input",
    name: "图片(外链)",
    inputTitle: ["图片链接"],
    ubbHandle: (inputValues) => `[img]${inputValues[0]}[/img]`
  },
  // { name: "短链生成" },
  {
    ubbType: "uploadImg",
    name: "图片(上传)",
    ubbHandle: (inputValues) => `[img]${inputValues[0]}[/img]\n`,
    upload: {
      type: "img",
      accept: "image/*"
    }
  },
  {
    ubbType: "input",
    name: "视频(外链)",
    inputTitle: ["视频外链(未能找到合适的文件站，如有可提供给我)"],
    ubbHandle: (inputValues) => `[movie]${inputValues[0]}[/movie]`
  },
  // {
  //   ubbType: "uploadFile",
  //   name: "视频(上传)",
  //   inputTitle: ["视频外链(未能找到合适的文件站，如有可提供给我)"],
  //   ubbHandle: (inputValues) => `[movie]${inputValues[0]}[/movie]`,
  //   upload: {
  //     type: "movie",
  //     // accept: "video/*",
  //     accept: "*",
  //   },
  // },
  {
    ubbType: "input",
    name: "音频(外链)",
    inputTitle: ["音频外链(未能找到合适的文件站，如有可提供给我)"],
    ubbHandle: (inputValues) => `[movie]${inputValues[0]}[/movie]`,
    upload: {
      type: "audio",
      accept: "audio/*"
    }
  },
  {
    ubbType: "jxVideo",
    name: "抖音解析",
    inputTitle: ["链接(不需要去除中文和多余字符)"],
    ubbHandle: (inputValues) => `[movie]${inputValues}[/movie]`
  },
  {
    ubbType: "jxVideo",
    name: "快手解析",
    inputTitle: ["链接(不需要去除中文和多余字符)"],
    ubbHandle: (inputValues) => `[movie]${inputValues}[/movie]`
  },
  {
    ubbType: "jxVideo",
    name: "TikTok解析",
    inputTitle: ["链接(不需要去除中文和多余字符)"],
    ubbHandle: (inputValues) => `[movie]${inputValues}[/movie]`
  },
  {
    ubbType: "jxZb",
    name: "抖音直播解析",
    inputTitle: ["链接(不需要去除中文和多余字符)"],
    ubbHandle: (inputValues) => `[movie]${inputValues}[/movie]`
  },
  {
    ubbType: "jxZb",
    name: "快手直播解析",
    inputTitle: ["链接(不需要去除中文和多余字符)"],
    ubbHandle: (inputValues) => `[movie]${inputValues}[/movie]`
  }
  // { ubbType:'jxVideo',name: "B站解析", inputTitle: ["链接(不需要去除中文和多余字符)"], ubbHandle: (inputValues) => `[movie]${inputValues[0]}[/movie]` },
  // { name: "皮皮虾解析", inputTitle: ["链接(不需要去除中文和多余字符)"], ubbHandle: (inputValues) => `[movie]${inputValues[0]}[/movie]` },
  // { name: "屋舍文件" },
];
// 设置图标
const settingIconBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAIABJREFUeF7tXXl0FMW6/3pC2BdlkYCAIKIoyo4gICKbKKKi7Lug7EsGTSZczzsv748rSdBMrgYFUZRVNgVXVtkFUUBAuRdBRRAlLN57WQQhOPXOryGeEGa6q3q6e7qn6zuH430v1VVf/ap/01X1bQpJkQhIBCIioEhsJAISgcgISILIt0MioIGAJIh8PSQCkiDyHZAIGENAfkGM4Saf8ggCkiAeWWg5TWMISIIYw00+5REEJEE8stBymsYQkAQxhpt8yiMIuJYgL730UmXGEpMuXw4lKUooiciXxFiorEfWzdHTVBTlEmNKXkJCKI/Il8dYsbwLF37LS09PDzla8TDKuYIgWVnBNowpfYlYKyJKuvqvmNvAlvrSCSLKI6L9Pp9vYfnyJT8eOXJkvpNxcSxBpkwJdvD5lK6KwvoyRjWdDKLUzTACF4looaIoH5Upk7hq7Nix5wz3ZNGDjiJIRkbwYUWhLkTUjYjqWTRn2a0jEWCnFUX5QFF8q1JSJi5wioqOIEhWVvYDjCnjiKinU4CResQUgW2Msdy0tEkxJ0pMCZKVFWx8hRhseEyXQw7uUASUlT4fy01J8X8SKwVjQpApU4K3KooyTlEYvhqJsZq8HNc1CCxWFJabmjpps90a206QKVNeTvf5fGOJqLLdk5XjuR0BZebly/Q/L7yQfNyumdhGkPT09LIlS5afoyhKD7smJ8eJSwT2hkIsZfLkSavtmJ0tBMnIeLm1ovjmEFFdOyYlx4h/BBijlLQ0/0tWz9RygmRmZo8iUl63eiKyf08iMDcQ8A+2cuaWEiQzM/t1ImWUlROQfXsegb2BgL+RVShYRpDMzOCnRPSwVYrLfiUChREIBPyWvMuWdJqVFRzPGL0il1AiYCMCKwIB/yNmj2c6QTIyctoqCrP9vtpsYGR/7kNAUWhCaqr/VTM1N5UgGRk5tRSFHTZTQdmXREAEAcbo0bQ08yzvphJEnjtEllK2tQoBxljDtLRJ35jRv2kEycoKvsYYjTZDKdmHRCBKBLYwdvHRtLS001H2Q6YQRNo6ol0G+bz5CCgzA4HkEdH2GzVBpk6dWiYUKradiBpEq4x8XiJgJgKKwtpF6+AYNUEyM18OEPkyzJyY7EsiYBICiwMBf59o+oqKIMFgsFp+Pm2XIbHRLIF81koEfD56NJp4kqgIkpGR83dFYX+zcoKyb4lAdAgoKwOBZMMeHYYJ8uKLL9X3+RK2KwqVj24C8mmJgLUIMMYGGA3fNUyQzMycV4nUiEApEgGnI7AtEPC3NqKkIYJkZf2jHmOhA0YGlM9IBGKBAGPKoLS05HmiYxsiSGZmMJmIgqKDyfYSgdghoCwMBJL7iY5viCBZWcE1jFEn0cG82L5q1ZuoSpXKVLZsGdq//wD997/GjLuVKlWkjh3bU35+Ph0/foLy8k7QqVOn6MyZs16E1cicz5YqlVBjwoQJZ0QeFibI1KlT64RCxX4UGcRrbRs2bECNGzeipKSbrpn6uXO/0xtvvE2XL18WhqR//15Uo8bN1z134sRJWrJkOf3+++/CfXrvATYsEJj0tsi8hQmSmZnzHBGzPBZYZBJOaluqVCkaP35kRJU++mgF/etf3wmpXLp0aRo3LrLXxJo16+jrr/cK9enFxoqiLEtNTX5SZO4GCBJErEdbkUG81BZbqTFjno045R9+OETvvfeBECT4InXt2jniM+vWbaQdO74W6tOjjS9duHC6XHp6+iXe+QsR5O9/D1YrVox+5e3ci+2KFy9OycljIk6dMUavvjqd/vgDeZv55MknH6Pbbrs1YuPPPttAO3fu5uvM4618Pl+/lJSJC3lhECJIRkZwrKJQLm/nXmynKAqlpEzUnLrIlighIUElHP4bSdauXU+7du3xItxG5rw0EPD34n1QiCCZmTn/IGITeDv3aju/fxwlJkYuX3L06C+0YMESLnjq1q1DTz31uGmEK9wRbthq1apBe/Z8S5cuce86uPR2cCOhLCiCBAkuIqLeDp68KarVqXMLlS9fXj1MG3lxxo4dQWXKlNbUZfr0t7iuaB96qBM1anS3Zl+rV39Gu3eLBdDVrFmD+vW7kkz//PkLtHnzVtqzR6wPU8C2v5MTgYC/Ku+wogTZSETteDt3WzvYGh588H669dY6qur/+c9/afbsBcIkGTHiabrhhgqa09+4cQtt375DF6KxY5+lMmXKaLZbtWqt+hXgFZB36NCB15H4t9/+TevXb6YffzzE25Ur2124cDqBtxycKEFwP3m7K1HRULp48URq164tNW16ff4xI7dOTz89UDUOasmpU7/RrFlzNdtUq5ZEgwb11YV7xYo19M03+3TbFTTo27enurWKJPPmLaJffz3G3Z/7Gha7ORAYz3XZJESQrKzgacbiz3u3R4/uVK9e5LTBW7dupy1btnG/B/3796YaNarrtn/77Xl08uSpiO3uv7813Xffvbr9fPrpavr223/qtkMDnj6XLfuIDh78gas/NzZSFGqWmurfxaM7N0HS02eULlXqfFyaawcP7kdJSdrb0mXLPqaDB7/nwZR69epBOMfoyRdffEWbNn0esRnPlwgP8xKkTp3a1KvXE5pqwcqfm/uG8LZSb65O+ruihLqlpj6HzJ+6wk0QFL3x+Sguf1aaNGlInTt30H1x5sx5l7A10hM9u0XB82fPnqPXX38zbHcVKpSnkSOH6Q2l/n3Dhs305Zc7NduWK1eOhg0bSCVKlNBs989/7qePP17JNa5bG4VCNHzyZP8sHv25CXK1hEHknzue0RzaJjExkXAYhpFPS+BoOGfOAl0j35Ah/QlXqDyyd+8+KlGiOJUuXeqv5vgVD4UY4YqXR3jOSQMH9qHq1avpdrd48fv0009HdNu5uQFj7IW0tEkv8syBmyBTpgTb+3y0nqdTN7bp1OnBsIf0onP56afDtHjxsohTrFy5Eg0bNsh2CObPX0y//BL+3Nmx4wPUrFkTXZ3g8Dht2kzddm5vEAqF/m/y5OfSeeYhCXIVJVzxDh/OV2pix45dtG7dpuvwxRcIXrc33VSFB3tT21y8eJHWrFlP2CIVlrZt76PWrVtyjYVrZ1w/x7tIghhcYb3rz8LdfvfdQdq+/Ss1LgNbF/hK3XPPXbo2C4OqcT+GeBHoRMSoSpUqVLKk9pmjcMdvvTWHYAuJd5EEMbjCd9xRjx5/vJvBp939GEiF85UXRBLE4Cr7fD4aPXp4zL8CBtWP6jEveQRLgkTxqrRp04rwz2sCF/wLF/4Qnvbtt9+mbuPgt5afLx4pKTygCQ9IgkQBol7AUxRdO/ZRhO2+8858If3KlStLDz3U8S+/NXgEzJ270FA4sdDAJjT2NEFatmxOLVu2UBMbIE7CyKETt1m41bJLEDyVn3+JLl3KVy3YCKpC6G7JkiWpVKmSlquB62FcE/NKixZNqW3b1te59B848D0tX/4xbzcxa+dZgjRocCd16/bQNcAjkAiu3LgG5ZVnnhlCFSveyNucux1e/mPHjtOxY3nqf48fP87l8g7rN4iCf3DDv/nmanTzzdUJzoxmCLB57bWZulskJKFA6K/WNfbnn39B+Odk8SRB4EsFn6pw8scff9Dmzdvo66/1o+7gWg6rupmCX+itW7+kQ4d+MrNbKlasmOrzhSvm226rG9XXRsv9Hp4GsKfgy8EjCAZDUJhTxXMEwVYEjn3YF2sJ/Kiw7Tpy5GjEZt26daUGDeqbtrb4gmFMOwRxLAiu0vJM1tIjnE8X+oKXgR62hft1egiw5wjSqlULateuDfc7CCMfAoPOnLk2h1irVvdSu3aGUriGHVvPLYVbYcGGuGho0aIZwQkTXxkROX36DB058rOaoO6WW2oJn8X+/e//EJw6jURiiugZTVvPEaR27VrUu7dQuiMVXzgKnjt3juA5ixDU8uXLRYP7dc/OnPmOGpUYK0E+rXvvbab+s0OwlQU5jGaPtENHjOE5gmDScMaDU55TBLdncN1wguAHoEuXjlwxKtHoO3/+IvrlF+dHInqSIFhYbI+wTXKCHDp0mJYsiez1Gwsd4UrTqVN7SzwFjGSMjAUGnv2CFID9yCNd6O6774oV9n+Nm5d3XN1uOE1wZdy+/f26mVJE9HbD1W7h+Xj2C1IAwhNPPEpwgYi1wLaAhNVOFJzbnniiOyFhRTQCFxN8PdwknicIFkvEdd2qxY0UN2LVeKL9IrirT5+ndHN4ReoXmU+QAcVtIglCpIbPIjEab+irVYuMcgdOvtWBfQM3gKKuNYg+nDVrHl24cMEq6CzrVxLkKrTwZ0JeKb0kblorAUMfEiLAZoLEB3DzgDEONgIegc3lgw8+4WkaszYwtIIkReuZaCm0cuVa2ruXP1ldzCYXZmBJkEKgIEEatluiAoPZ0qXLIzo7ihgV4eUK/ysnC764SFeEHwAeeeUVZKgXd4/n6dvqNpIgRRAW9c6Fd+3cue/qGvmQKgjWaj1xy14dJMEXl2e7lZWVozdtx/5dEqTI0iCMFjYAXuFNvQk3jhEjhlLZsto+YBgXbuBwB3e64EwyaFA/taailiBtKk+OMCfOVxKkyKr069eLata8vr5fuMXDeQHnBl4J52If7lkc1HFgd4PAnX3o0AGaqope7yLqsHr16lS1ahU17+/hwz/HDApJkELQI35i1Ci+DIW7du2mtWs3CC8cb4rQzz7bSDt3uqNUWtOmjVWru5Yg9RGussMJYlWQ7aVatarqf4telLz77hL6+efYuMTHHUFq1aqpxiIgsAehnVfKIB/XzXCIhevb9ynC83qC7QIs30Yq0N5yS03VnqAnONTOmPG2UPCWXp9W/h2Fe/SyO8J7F7VJcN2LLw/IwHPQj2X0YdwRZPz4UWGDgWClPnnypEqYY8dO0G+//UZYMAQ9YZGaN2/KlWUdpEAdECPhuQUvKM/LhLa4MkbchRsE3sCIrhTJrSUyr9zcGWrxHrslrgiCaDkkg7ZSkGEdmdajkRtvvEF9mVCjUEtCoRDBDR7XyG4Q3jOWkbmsX7+JvvqKqwqBke4jPhNXBHn00a50113mRfgVRc1Mt3Rk+WjU6B7dxRQ94Op2aHEDGBHhu2W2iCaLMGv8uCEIrlHHjRsZtUOdFrC8V7o8i4MM7SNHDtcs4FnQD847OEe5QaxKyI3S1UhYZ7fEDUF4D79GAbaiFgYSRSPBgZ6IVLrV68uOv5sfq7+bNmzYYuhSJNr5xg1BYKx69tmhhKwaVoheCTQjY14xHj6ta2hD324qdYZrWswrWkGBUFwP4zIlVhI3BAGA8MZFQgaekmYigKNIDIrFWCH33NOAHn64s27XiFfHgd0t8thjj1D9+sZquGKuKM+ARBaxlrgiSAGYKIqJrQuPTYNnARAOi7BYKwQ3WTAeYu+uJ05PkVNYf9g4UKlKRODX9vnnyEm2F8kSRB61rG1cEqQALXjnIu0lTxXZSAjb4fZRu/Yt1Lt3D91FRsLoGTNmOTpNTuFJwJmRN6Pj7t17adOmrY7z+o1rghQsFg7wKGnMU3ev6FtqVww17/WoXrVbXZbZ2KBhwwZq+lEtQXFSnK+cekvnCYIULBBcITp0eIBgqOMV/GLbYagTuR5FtVu8WE4XuMQnJ4/RVHPp0g8Ih3GniqcIgkXAzRH2xjy1Ae02TuGwjkO7nuzb9y/65JNVes0c8Xct4y0iL6dP56qwHLO5eI4gQBohsH366GdXRKb3bdu+tG1xROqNwB8MfmVOF3g2gCTh5ODB72nZMmeXQPAkQbBYEyeOJuR90pIFCxbT0aPhyyVb9WLyVppFUu2FC5dapYZp/eKCpH//3mH7+/nno/Tuu86eg2cJAkOWVoIGeO1mZ+ea9qLwdoTcUyNGDCO4oujJe+99QD/84Nz9O/TXcyDNyXnN0bdyniQIvhz4gmgJotgWLXpP7x215O9wYoQzo56Y6TypN5bRvz/wQFtCJa9IgviQ1as/M9q95c95kiA8xTfhWg0X61jJsGGDuIyHeLnwkjlRUOXq2Wef1o0R2b//ACGCEvmznCaeIwjSjCLdqJ6sWrWW9uyJXS4nFLjp2fNxPTXV7QmSIpw5c1a3rd0NEDkJGxSv4EyCeZw9e1ZNw4qrbJScuPLf2JDHEwTBlqpKlUp05531uVLvYEFjcUAv+iLxvmCw03z44aeOyaeFVEBdu3ZSayOaKSAK5oryeIiTsUPiiiBIqVOp0o3q1qRixYpqcU387zJlSgtjGasQz8KK8mQMKdweGUBgu0EF3FhIiRLFVdcSs4kRbi52He5dT5B69W5TqyLhCwHLrVnilGRnTinRYBauZvXz5puzbXGDdz1BUlOTzcL8mn6cQhAkZxs9+hlL5ujmTlGRK5rEGbxzlwQJgxQOvviEO0WQB9fsGBenzM2oHnZla3Q1QRBLkZIy0SjGEZ87f/485ea+YXq/RjuEg2Xz5k2MPh6Xz73zznw6ceKk5XNzNUGAjhVbLCQ2e/XVGZaDzzuAPIdcjxTWx456I5IgYd7S/PzLFAza72YSiTDjxo0gJGbzsmDbiy9GXt4JtTb799//aAscrieIaLkCXlSdckhv2PBu1abgJYGxEGS4Qojjamb4WFXecj1BYCuoX78eIfE0nA9vuOEGLkc/vRcuGJxG+fmxsScU6Ia0qM88M1jX61hvLm74Owx/3377T7V2Or4WThHXEyQckImJxVSiXCFMBapQoQLdeGMFqlmzhhowxSNOqBfYo8ejBDsPryAbCAyFdkRAhsc9UTUU8paPKOjDyVGFcUmQSC8UXE7uu+9e1bCoJ0jzg3Q/sRJenzHoB2LAaTGWdTQK44QfJcSiI2mGnmzZso22bt2u1yxmf/cUQQpQhvs13LC1ZPXqdYRMG7EQEBnJrXlcZFDPEIFTuFhwmoAkSNygJXbF/BvFxpMEAVijRw9XK9FGkq++2knr18em9AAO5Tic6wn26jNnznakmzh0x3Z21KjhmmdCp1yGRMLaswTp3PlBatKkUcR3EKG28Oi1W0RyDK9cuYb27t1nt4pC47Vvf7/mllZ+QYTgtK9xx44PULNm2tZphNwaqSJldBb4xUWgFE+tdtgCFi6MTcSjyPxwyYDLhkiybt1G2rHDuaXmPPsF4akVaHdtPL1f24KXDKSFL1KsbAMiBLn11trUs+cTER/BXJDaNVY1CPXm4kmCIIEcyqDpiV1ZFaEHCliipDKPxKraEo9uRds0bdqIOnV6UPfRb77ZR0izFKvIQXkGuYoAMo4jIYJeyh80hyUXTnF2CG8MOm6t5s5daIdKpozBW48Rg+FrgkI5SK+KIqxOEM98QRAG2qVLB9VYKCKvvTbT8l812GaQO1hPkPEchIXrhRsEAWwTJowin88npC4q/IIku3btsfUMGE7JuCdIyZIl1VIITZo01C2aGQ4glP3Cr5pVgjzB+HokJCToDmHnlk9XGY4Gd999F8ET2aggBh2GRLigMMaMdhPVc3FNEJDi/vvb6Kad0ULQ6m3WgAF9uGqF46uBg7mbZMCA3qbEpyNycOPGLbZ58BbGOC4Jgty7sHMgaYMZgutUXKuaLbwHWIzrpkKe0Bc+WagPYqYgjy/y+dopcUUQJH/u3LkD1atX11QMEXvw/vsfmtonYs3hTsJTU/HLL3fShg2xseobnXQ0Jdgijfnpp6vV7ZadElcE6dixPTVr1tgS/Mwu4tmr1xNUp05tXV1h68DWyk6Dpa5SOg1wIYI4HbPllVdeJ5Rps1PiiiC4CcKNkBWCJNFIFm2GaJUEKNr/ggVLCGWg3STIXAlvZDPl0KGfaMmS5WZ2ydVXXBEEN0IoBW2VmJFt8Uq+2qGE2zU9gTcxvIrdJElJN9Hgwf01VUY6UbjoI8itQoXyXNOLxfYKisUVQTChfv16CQfscK0QkZraM1ojnVbFpcJ64CV68805joqu48EJ3gDwCggn+/btp40bN19jV0K5B5Tvrlq1qpr8DxGi+L8LC7aX06bNjInxMO4IwnP3fuzYcTXyDqk6sXXCgRnpMtu2baXpAo9FQxbynTuNOdfxJqTGOEuXLqcff/yJ5510TJsWLZrSgw+2C6vP4cNHaNEi/lrzIEqVKpVVx03UMMSaxULijiDwiIUjYkGhTtTB+/XXvKv/jqmkiCSlSpVSn8VtWCQx6iiIX8rhw4eoZNQTxGd/9NEKvWaO+jteZBg8I4U025Uq1GxQ4o4gAAiLVLVqFTV3K2qLiwiPIyNINm/eIpFuVbuMVvxJQWdws0AQlB05n4QmoNMY5w6cP8IJzhszZ75j5nC29RWXBIkWvfHjRxK+JloiYpvA9g1WZR7Bl8Ou1P48+vC00XPTP3nyFOGa3I0iCRJm1bQOmoWbL1v2ER08+IPuuuPWiqc2O/bayPDhJtGrQVgwl1jYMMzAURIkDIoTJozm8t9C3izYKbTKMfPGl6MvbK1we+UWEYlhQdQgogfdJpIgRVZML0S06ALjxUYtdbhmF054hvt9JJ3mdXtZteoz2rPHmbUGw73UmN/gwf10t6KFn0UVLNQjdJNIghRarZIlS9CQIQO4jVeFFxrkKPiSFCuGBGrhbQHhXg431AsvrDecQFEejudGruh8Y51vTJSckiBXEUNQT//+vah69WqiGEbVHtfGKAYTq2yIosrDNtG3b0+CR4ARQf6uhQuXxMyuIaqzJMhVxHgt3KIA67VH7i3k4HKDIFPik08+FnWpO1xlz5+/2JYKUdHiKglCpDo48oS8Rgt20efdFATVoEF96tatq2kQ4DJi7txFaslnJ4vnCXLHHfXo8ce7xWSNVq5cS3v3xq4WO++kEbLcunVL3ubc7RApCAdQUWMu9wAmNPQ0QUSuKU3A+rou5sxZoBaEcarA5aZ790csc/7EvOFjhTOJE3MLQz/PEqR8+XKqW3bp0toWcytfXrODsMzUtUGDOwkBaLjZ0xI4IX733ffqVglhtkgUl5TEf4OHvkW8EsycI09fniUIT2bFogAiHvrgwR/p4sVLVKNGNdW3irfeSLjFcKJdAIFOOI8hKlBPEAaMl7uoICCsQ4d23GXjnGxE9CRBEG8wZIh2UE/hRYcvEc4LiAcpLNiCIK0mXLONiKgLuJExeJ+BgRTu/rjG5RE9j2Mk5mvXro2abklLcL09e/Z820Npeebo6S0WzxcENgrkotq+fUdEPFFCAaUUjMoXX3xJmzZtNfp41M9hK4WCQrzEKBgQthscsvUEHr6dO3cMazjFuWPevIWEHyCniie/IFgMuErgKxIp9PXQocME9w/Ek+hJjx7duV1KwvWFoC3YQo4cOao3lCl/x+UEAstADmQ/FBW416CGo4jgS4IvSuGUr07cYhadk2cJAiCQhrRfv57XYHL+/Hlau3aDkM8QqlWhalW0gowdIMuBAwfVbOcwqJkhIEGNGtUJnrd1695qyEWkqB45OdPo0iWxIqcoZd2+fVv1xwle0E4ue1AwX08TBCAULrMMmwQs26KJk7t1e0j9NTZbEPCF4CxsQbCdQQog/P+0BG71iO6rVKmSGuONm6XKlSuZrZoa8ei2uBUjIHieIAANh3acN3j21OFAHjv2WULJZrsEBIZxDV8YJLRGcBf+6V3JmqkfyjXPny8WVWnm+Hb1JQkSJdJ16txCvXr1iLIXdz4+e/YCzVgYd87qWq0lQaJcxe7dH6Y777wjyl7c+TiK3qxYscadynNqLQnCCVS4Zjj8jhs3gttYiG0RzjnYzuGsANtDYmKxKDSI7lFs0ZA1HWcJHLiRyK1VqxbUuPE9XB1jHqifYnc6UC7lTGokCRIFkKgBjlrgPIKkywg5LfwygWCon2F2mk4efUAOZIwPV+cQhs+BA/twET+SNZ1HBze0kQSJYpV4sziiVDNKNkcSJHrmce2IQtXrHtVLOIFQYdh39OTMmbM0ffpbes1c+3dLCJKZmd2cSPnKtahwKI67/JEjh+m2RMwHfqm1srNjS9OlS0fdvtDgu+8O0tdf77kmry3CffElQOkHraR3BQNAF5S41hPeZOAoDYESEfEojFFKWpr/JZ65KTyN0CYz85UaRH+aX3GGVwEb2iE+AnESWgKLM2oKInGalmBLM3ToAC6ttVKSwkGwefOmuv38/vt5mjbtDd12aMBThBNeByjlHI/CWGhQWtpzXEm9uAmSnp5erFSpCmJmVpehi6+HXmby5cs/pgMH9CsiwbA3YsTTugjouXjwxrfgQA5LOI8gZSrCAvSqdWVl5fB057o2oRB1njzZv5ZHcW6CXPmKBE8SEZ9rKM/oDmpTtmxZGjPmGU2NkAZo7dr1XFrzEgRkA+m0hDdJncgLDXLAby1SNSwza6dwAWZjI5/Pd09KykSusE9RgiDJ0902zsXWoeDDFamkNKIEES3IK3gBUY5NT3hqZPCGx8LZEF8kXgmXmR5nn61bt4eNCeHt1+ntEhL+rPL8889zuRsLESQrK7iGMerkdACi0Q9u4kj4UNhDFW4gs2bNE0pGwFuyjCd9Jy/ZcAbBWUREYCOBRy4ExX02b97q6HhykblFaHs5EPAn8vYjSJCcuYyxgbydu7UdfKDatGlFqFgLwWEVh1YR4SEIyrAhzSmPIOOhXtjrG2+8HdYGotc/8oYh87zexYNePy75+9FAwF+TV1dBggSnMkbP83bu9nawjGPLIfqrjHnD2xa1NbRExCCnVcimYAwnx8M76F3YEQj4W/DqI0SQzMwgAi34fvJ4NYjTdjzXvLwRfIAIcRdwgdESJG5DlS0pWggouYFA8nhejIQIcvWq9wLq2fAO4NV2ejHyiNueMWOWEDxID4pMiJHEyFZQSIE4aKwo1DY11f8571SECIJOMzKy5yqKEvfnEF4AI7XTI4iRtDh6fmLLln1MyNIiJTwCikI/p6b6a4ngI0yQqVP/0SMUCvFXbhTRJo7a6tlBjNRKx83axImjI6KEL5JbEmbHZqmVqYFAcqrI2AYIMrVMKFQMVTPLiQxkIkkoAAAEQElEQVTkxbYoY1a7dq3rUgidP3+BcnNnGIKkY8cHqFmzJn89i/Bd+IbBs/joUXn+0AI1FKKOkyf7hYrUCxMECmRlBd9mjIYaWmGPPoRUOVWqVCFkf0TBGaOhwIAP2zeE5To5tY4Dl/lgIOC/XVQvowTpxxjxm5VFtZLtJQLmI5ATCPj9ot0aIkh2dnbFy5eVvYzRzaIDyvYSgVggwBg9kpbmFy5Ub4ggV7ZZ2WmMKVNiMVk5pkRAEIGlgYC/l+AzanPDBMnMzCxHVHw7EZmfPMrITOQzEoEICCgKa5+aOslQOV7DBIEumZnZY4gUviAEuXwSgZggoLwVCCRrxzFo6BUVQa6QJGcbEWsVk7nLQSUC2gjkKwrdm5rq320UqKgJkpHx8kBF8c01qoB8TiJgFQKMKcG0tORJ0fQfNUEweEZGcJWiUJdoFJHPSgRMRuBUKEQtJ0/2R5V5wiSCZHdXFOVDkycou5MIGEZAJLWP1iCmEAQDTJnycrrP5/tfwzOSD0oETEKAMbYsLW3Sk2Z0ZxpBrmy1st9XFMWbWZ/NWA3ZhxkI/HDhwunG6enp58zozFSCXLnVCsLfuq4Zysk+JAKiCDAWapOW9pxp9e9MJ0hWVlZdxhJlUILoysr2JiDARgcCk6ab0NFfXZhOEPQ8dWp2j1BIkTEjZq6U7EsHATY9EJgUOVjGIH6WEEQe2g2uhnzMKAIrAgH/I0YftuUWK9wgL76Y0zIhgX1hheKyT4kAEFAUmpCa6n/VKjQs+4IUKDx16us3MfbHh4xRS6smIfv1JgKMKfenpSVvsXL2lhOkQPmsrJxsxphwwIqVk5d9uxaBFYwpo9LSko9YPQPbCIKJZGYGk4koaPWkZP/xi4Ci0Oupqf4xds3QVoJgUhkZ2d2JlHHSd8uuJY6bcfYRsVyzr3H10LGdIAUKXfECThgrXeX1lsjbf0cuK8ZC03y+UG5KSsrvdqMRM4IUTPRq0NU4GZlo99I7ezzG6AyRkluiBMv1+/1IMxUTiTlBrpxNMsspSuJYbL1kIoiYvAcOG1TJ/fPPy9P+9rfn98daMUcQpACEF1/MreTzXe6mKKwbEeFfmVgDJMe3BwFFobWM0SeK4vskNXXiQXtG1R/FUQQprO60adPKnjt38Sl4BzOmkkUmzNZfT7e12EKkLPf58t9PSUk55ETlHUuQwmAhq3zJkuWf9PmUFkRKEhFLYoySiNR/cVkz0YkvixGdFIXOMEZ5RAX/lDzG2IE//6T3X3ghdmcL3rm4giBak7lSkqFiEtHlpFBIKcs7cdnOOgQUJXSJMV/exYul89LTR4rVhLNOLUM9u54ghmYtH5IIcCIgCcIJlGzmTQQkQby57nLWnAhIgnACJZt5EwFJEG+uu5w1JwKSIJxAyWbeREASxJvrLmfNiYAkCCdQspk3EZAE8ea6y1lzIiAJwgmUbOZNBP4f1t8HuWlcA3kAAAAASUVORK5CYII=";
// 添加图标位置存储键名
const ICON_POSITION_KEY = "settingIconPosition";
// 在全局变量区域新增
let isClickValid = true; // 标记是否允许触发点击
const DRAG_THRESHOLD = 5; // 移动距离阈值（像素）
const CLICK_TIME_THRESHOLD = 300; // 点击时间阈值（毫秒）
/* ================================================== 变量结束 ================================================== */


//渐变颜色
function gradientColor(startColor, endColor, percent) {
  // Hex转RGB数组，如 "#FF00FF" → [255, 0, 255]
  const start = hexToRgb(startColor);
  const end = hexToRgb(endColor);

  // 计算中间色值
  const r = Math.round(start.r + (end.r - start.r) * percent);
  const g = Math.round(start.g + (end.g - start.g) * percent);
  const b = Math.round(start.b + (end.b - start.b) * percent);

  // RGB转Hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

// 示例：从红(#FF0000)到绿(#00FF00)的50%位置色
//console.log(gradientColor("#FF0000", "#00FF00", 0.5)); // 输出 "#808000"（橄榄绿）

//渐变颜色字
function textGradient(text, colorA, colorB) {
  // 示例：从红(#FF0000)到绿(#00FF00)的50%位置色
  //console.log(gradientColor("#FF0000", "#00FF00", 0.5)); // 输出 "#808000"（橄榄绿）
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const percent = i / (text.length - 1);
    const color = gradientColor(colorA, colorB, percent);
    result += `[forecolor=${color}]${text[i]}[/forecolor]`;
  }
  return result;
}


(async function () {
  if (!checkLocation()) return;

  const jqueryIsLoad = await loadAndExecuteScript("https://code.jquery.com/jquery-3.7.1.min.js", "jquery-3.7.1.min");
  if (!jqueryIsLoad) return;

  const setttingIsInit = await initSetting();
  if (!setttingIsInit) return;

  const userSetting = JSON.parse(localStorage.getItem("yaohuoBetterPlusSetting"));
  if (!userSetting || Array.isArray(userSetting)) {
    notifyBox('未知错误，加载用户设置失败',false)
    return;
  }

  if (userSetting["firstLoadScript"]) {
    alert("请合理/合法使用本脚本，不要影响论坛正常看帖/回帖！！！如因使用本脚本而被封号/小黑屋，雨我无瓜(免责声明.jpg)");
    saveUserSetting("firstLoadScript", false);
  }

  userSetting["checkVersion"] && checkVersion();
  addCustomStyle();
  // 页面解析完成后再执行代码，否则 jquery 可能会获取不到 document 内容导致脚本执行失败
  $(document).ready(() => {
    createScriptSetting();
    userSetting["showTopAndDownBtn"] && addTopAndDown();
    // userSetting["showChuiniuHistory"] && executeFunctionForURL("/games/chuiniu/doit.aspx", chuiniuHistory);
    userSetting["oneClickCollectMoney"] && executeFunctionForURL(/^(\/bbs-.*\.html(\?.*)?|\/bbs\/view\.aspx\?.*id=\d+.*)$/i, speedEatMoney);
    userSetting["hideXunzhang"] && executeFunctionForURL(/^(\/bbs-.*\.html(\?.*)?|\/bbs\/view\.aspx\?.*id=\d+.*)$/i, hideXunzhang);
  });
  // 页面加载完成后再执行代码，否则页面资源可能会获取不到，导致玄学bug，比如图片等
  $(window).on("load", () => {
    executeFunctionForURL(/^\/bbs\/book_view_.*\.aspx(\?.*)?$/i, bookViewBetter);
    executeFunctionForURL(/^(\/bbs-.*\.html(\?.*)?|\/bbs\/view\.aspx\?.*id=\d+.*)$/i, huifuBetter);
    userSetting["autoLoadMoreBookList"] && executeFunctionForURL("/bbs/book_list.aspx", autoLoadMoreBookList);
    userSetting["autoLoadMoreHuifuList"] &&
      executeFunctionForURL(/^(\/bbs-.*\.html(\?.*)?|\/bbs\/view\.aspx\?.*id=\d+.*)$/i, autoLoadMoreHuifuList);
    userSetting["openLayerForBook"] && executeFunctionForURL("/bbs/book_list.aspx", openLayer);
    userSetting["useRight"] && useRightNextBtn();
    listenRecontentLoad();
    createDraggableIcon();
  });
})();


// 设置图标拖动功能
// 修改拖动初始化函数
function createDraggableIcon() {
    const $icon = $("#settingICon");
    if (!$icon.length) return;

    // 添加拖动功能
    let isDragging = false;
    let startX, startY;
    let startTime = 0;

    $icon.on("mousedown touchstart", function(e) {
        e.preventDefault();
        isDragging = false;

        // 获取起始位置和时间
        const event = e.type === "mousedown" ? e : e.touches[0];
        startX = event.clientX;
        startY = event.clientY;
        startTime = Date.now(); // 记录开始时间

        // 设置移动和结束事件
        $(document)
            .on("mousemove touchmove", onMove)
            .on("mouseup touchend", onEnd);
    });

    function onMove(e) {
        const event = e.type === "mousemove" ? e : e.touches[0];
        const deltaX = Math.abs(event.clientX - startX);
        const deltaY = Math.abs(event.clientY - startY);

        // 超过阈值则判定为拖动
        if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
            if (!isDragging) {
                isDragging = true;
                $icon.css("cursor", "grabbing");
            }

            // 计算新位置
            const newX = event.clientX - $icon.width() / 2;
            const newY = event.clientY - $icon.height() / 2;

            // 限制在窗口范围内
            const windowWidth = $(window).width();
            const windowHeight = $(window).height();
            const boundedX = Math.max(0, Math.min(newX, windowWidth - $icon.width()));
            const boundedY = Math.max(0, Math.min(newY, windowHeight - $icon.height()));

            // 更新位置
            $icon.css({
                left: boundedX + "px",
                top: boundedY + "px",
                right: "auto"
            });
        }
    }

    function onEnd(e) {
        // 移除事件监听器
        $(document).off("mousemove touchmove", onMove);
        $(document).off("mouseup touchend", onEnd);

        // 恢复光标样式
        $icon.css("cursor", "move");

        // 获取结束位置和时间
        const event = e.type === "mouseup" ? e : e.changedTouches[0];
        const endX = event.clientX;
        const endY = event.clientY;
        const endTime = Date.now();

        // 计算移动距离和时间差
        const deltaX = Math.abs(endX - startX);
        const deltaY = Math.abs(endY - startY);
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const timeDiff = endTime - startTime;

        // 判断是点击还是拖动
        if (!isDragging && distance < DRAG_THRESHOLD && timeDiff < CLICK_TIME_THRESHOLD) {
            // 触发点击事件
            createPopupContainer();
        } else {
            // 吸附到屏幕边缘
            const windowWidth = $(window).width();
            const iconRect = $icon[0].getBoundingClientRect();
            const iconCenterX = iconRect.left + iconRect.width / 2;

            if (iconCenterX < windowWidth / 2) {
                $icon.css({ left: "10px", right: "auto" });
            } else {
                $icon.css({ left: "auto", right: "10px" });
            }

            // 保存位置
            saveIconPosition();
        }
    }

    function saveIconPosition() {
        const position = {
            top: $icon.css("top"),
            left: $icon.css("left")
        };
        localStorage.setItem(ICON_POSITION_KEY, JSON.stringify(position));
    }
}

    /**
   * 保存设置按钮的位置
   * @param {Object} pos - 按钮位置信息
   * @param {number} pos.left - 按钮左边距
   * @param {number} pos.top - 按钮上边距
   */
  function saveSettingBtnPosition({ left, top }) {
    // 保存位置到localStorage
    const position = {
        top: top,
        left: left
    };
    localStorage.setItem(ICON_POSITION_KEY, JSON.stringify(position));
  }
  // 关闭设置弹框
  function closePopupContainer() {
    // 恢复body内容滚动
    $("body").css("overflow", "auto");
    // 移除蒙版和弹出内容容器
    $(".v2jun-popup-overlay").remove();
  }
  // 设置弹框
  function createPopupContainer() {
    // 蒙版
    const overlay = $("<div>").addClass("v2jun-popup-overlay").appendTo("body").click(closePopupContainer);
    // 弹出内容容器
    const container = $("<div>")
      .addClass("v2jun-popup-container")
      .appendTo(overlay)
      .click((event) => {
        event.stopPropagation(); // 阻止事件冒泡
      });

    // 设置蒙版的样式
    overlay.css({
      "background-color": "rgba(0, 0, 0, 0.6)",
      "position": "fixed",
      "top": 0,
      "left": 0,
      "width": "100%",
      "height": "100%",
      "z-index": 9999,
      "display": "flex",
      "justify-content": "center",
      "align-items": "center"
    });

    // 设置弹出内容容器的样式
    container.css({
      "background-color": "white",
      "width": "80%",
      "max-width": "400px",
      "max-height": "80%",
      "overflow-y": "auto",
      "padding": "20px",
      "text-align": "center",
      "border-radius": "5px"
    });

    // 添加弹出内容
    const vSettingEle = `
      <form name="settingForm">
      <div class="v2jun-setting-div">
        <h2 class="v2jun-reset setting-title">妖火增强插件Plus</h2>
        <p class="v2jun-reset" style="font-size:12px;">
          Author：<a href="/bbs/userinfo.aspx?touserid=27894" style="font-size:12px;">柠檬没有汁@27894</a>
        </p>
        <p class="v2jun-reset" style="font-size:12px;margin-top:-15px;">
          Version：${defaultSetting.version}
        </p>
        <p style="font-size:12px;margin-top:-15px;color:red;${sessionStorage.getItem("canUpdate") ? "" : "display:none;"}">
          已有新版本：<span style="color:green;">${sessionStorage.getItem("newVersion")}</span>，请及时更新
        </p>
        <ul style="margin:0;padding:0;">
          <li class="v2jun-setting-li-title"><hr><b>关于脚本</b><hr></li>
          <li class="setting-li-between">
            <span>脚本安装/升级</span>
            <span>
              <a href="https://greasyfork.org/zh-CN/scripts/504289-妖火网增强脚本plus" target="_blank">GreasyFork 直达</a>
            </span>
          </li>
          <li class="setting-li-between">
            <span>开源地址</span>
            <span>
              <a href="https://github.com/v2jun/yaohuo_better_plus" target="_blank">Github</a>
            </span>
          </li>
          <li class="setting-li-between">
            <span>重置设置</span>
            <span class='v2jun-clear-setting'>点击运行</span>
          </li>
          <li class="setting-li-tips">
            <span>如出现玄学bug，可尝试重置脚本设置</span>
          </li>

          <li class="v2jun-setting-li-title"><hr><b>设置</b><hr></li>
          <li class="setting-li-between">
            <span>设置图标大小(px)</span>
            <input name="settingIconSize" class="v2jun-setting-li-input" type="number" value="${getUserSetting("settingIconSize")}"/>
          </li>
          <li class="setting-li-tips">
            <span>设置入口图标大小，设置为 0 时不显示</span>
          </li>
          <li class="setting-li-between">
            <span>检查更新</span>
            <div class="v2jun-switch">
              <input name="checkVersion" value="true" ${getUserSetting("checkVersion") ? "checked" : ""
      }  class="v2jun-switch-checkbox" id="checkVersion" type="checkbox">
              <label class="switch-label" for="checkVersion">
                <span class="v2jun-switch-inner" data-on="开" data-off="关"></span>
                <span class="v2jun-switch-handle"></span>
              </label>
            </div>
          </li>
          <li class="setting-li-between">
            <span>一键回到顶部/底部</span>
            <div class="v2jun-switch">
              <input name="showTopAndDownBtn" value="true" ${getUserSetting("showTopAndDownBtn") ? "checked" : ""
      }  class="v2jun-switch-checkbox" id="showTopAndDownBtn" type="checkbox">
              <label class="switch-label" for="showTopAndDownBtn">
                <span class="v2jun-switch-inner" data-on="开" data-off="关"></span>
                <span class="v2jun-switch-handle"></span>
              </label>
            </div>
          </li>
          <li class="setting-li-between">
            <span>隐藏楼主勋章</span>
            <div class="v2jun-switch">
              <input name="hideXunzhang" value="true" ${getUserSetting("hideXunzhang") ? "checked" : ""
      }  class="v2jun-switch-checkbox" id="hideXunzhang" type="checkbox">
              <label class="switch-label" for="hideXunzhang">
                <span class="v2jun-switch-inner" data-on="开" data-off="关"></span>
                <span class="v2jun-switch-handle"></span>
              </label>
            </div>
          </li>
          <li class="setting-li-between">
            <span>图片自动模糊</span>
            <div class="v2jun-switch">
              <input name="imgBlur" value="true" ${getUserSetting("imgBlur") ? "checked" : ""
      }  class="v2jun-switch-checkbox" id="imgBlur" type="checkbox">
              <label class="switch-label" for="imgBlur">
                <span class="v2jun-switch-inner" data-on="开" data-off="关"></span>
                <span class="v2jun-switch-handle"></span>
              </label>
            </div>
          </li>
          <li class="setting-li-tips">开启后图片会自动添加模糊效果，点击图片取消，再次点击恢复，可与下方图片缩放搭配使用（再也不用担心点开帖子，突然社死了）</li>
          <li class="setting-li-between">
            <span>图片宽度(px)</span>
            <input name="imgThumbWidth" class="v2jun-setting-li-input" type="number" value="${getUserSetting("imgThumbWidth")}"/>
          </li>
          <li class="setting-li-tips">缩放页面中图片到指定宽度，设置为 0 时不缩放</li>
          <li class="setting-li-between">
            <span>图床选择</span>
            <select name='imgUploadSelOpt' class="v2jun-reset" style="font-size: 12px;width:116px;padding-left:8px;height:25px;">
              <option value="0" ${getUserSetting("imgUploadSelOpt") == 0 ? "selected" : ""}>美团</option>
              <option value="1" ${getUserSetting("imgUploadSelOpt") == 1 ? "selected" : ""}>水墨</option>
            </select>
          </li>
          <li class="setting-li-between sel-suimo">
            <span><a href="https://img.ink/user/settings.html" target="_blank">水墨图床token</a></span>
            <input style="width:100px;" class="v2jun-setting-li-input" value="${getUserSetting(
        "suimoToken"
      )}" name="suimoToken" id="suimoToken" type="text" placeholder="为空则不会上传…"/>
          </li>
          <li class="setting-li-between">
            <span>我要用右手</span>
            <div class="v2jun-switch">
              <input name="useRight" value="true" ${getUserSetting("useRight") ? "checked" : ""
      }  class="v2jun-switch-checkbox" id="useRight" type="checkbox">
              <label class="switch-label" for="useRight">
                <span class="v2jun-switch-inner" data-on="开" data-off="关"></span>
                <span class="v2jun-switch-handle"></span>
              </label>
            </div>
          </li>
          <li class="setting-li-tips">将帖子列表的下一页按钮显示在右边</li>
          <li class="setting-li-between">
            <span>帖子自动加载</span>
            <div class="v2jun-switch">
              <input name="autoLoadMoreBookList" value="true" ${getUserSetting("autoLoadMoreBookList") ? "checked" : ""
      }  class="v2jun-switch-checkbox" id="autoLoadMoreBookList" type="checkbox">
              <label class="switch-label" for="autoLoadMoreBookList">
                <span class="v2jun-switch-inner" data-on="开" data-off="关"></span>
                <span class="v2jun-switch-handle"></span>
              </label>
            </div>
          </li>
          <li class="setting-li-between">
            <span>回复自动加载</span>
            <div class="v2jun-switch">
              <input name="autoLoadMoreHuifuList" value="true" ${getUserSetting("autoLoadMoreHuifuList") ? "checked" : ""
      }  class="v2jun-switch-checkbox" id="autoLoadMoreHuifuList" type="checkbox">
              <label class="switch-label" for="autoLoadMoreHuifuList">
                <span class="v2jun-switch-inner" data-on="开" data-off="关"></span>
                <span class="v2jun-switch-handle"></span>
              </label>
            </div>
          </li>
          <li class="setting-li-between">
            <span>帖子在弹窗中打开</span>
            <div class="v2jun-switch">
              <input name="openLayerForBook" value="true" ${getUserSetting("openLayerForBook") ? "checked" : ""
      }  class="v2jun-switch-checkbox" id="openLayerForBook" type="checkbox">
              <label class="switch-label" for="openLayerForBook">
                <span class="v2jun-switch-inner" data-on="开" data-off="关"></span>
                <span class="v2jun-switch-handle"></span>
              </label>
            </div>
          </li>
          <li class="setting-li-tips">仅在PC端生效，且弹窗中无法使用脚本</li>
          <li class="setting-li-between">
            <span>发帖表情自动收起</span>
            <div class="v2jun-switch">
              <input name="autoCloseBookViewEmoji" value="true" ${getUserSetting("autoCloseBookViewEmoji") ? "checked" : ""
      }  class="v2jun-switch-checkbox" id="autoCloseBookViewEmoji" type="checkbox">
              <label class="switch-label" for="autoCloseBookViewEmoji">
                <span class="v2jun-switch-inner" data-on="开" data-off="关"></span>
                <span class="v2jun-switch-handle"></span>
              </label>
            </div>
          </li>
          <li class="setting-li-between">
            <span>回帖表情自动收起</span>
            <div class="v2jun-switch">
              <input name="autoCloseHuifuEmoji" value="true" ${getUserSetting("autoCloseHuifuEmoji") ? "checked" : ""
      }  class="v2jun-switch-checkbox" id="autoCloseHuifuEmoji" type="checkbox">
              <label class="switch-label" for="autoCloseHuifuEmoji">
                <span class="v2jun-switch-inner" data-on="开" data-off="关"></span>
                <span class="v2jun-switch-handle"></span>
              </label>
            </div>
          </li>
          <li class="setting-li-between">
            <span>输入框自动聚焦</span>
            <div class="v2jun-switch">
              <input name="textareaAutoFocus" value="true" ${getUserSetting("textareaAutoFocus") ? "checked" : ""
      }  class="v2jun-switch-checkbox" id="textareaAutoFocus" type="checkbox">
              <label class="switch-label" for="textareaAutoFocus">
                <span class="v2jun-switch-inner" data-on="开" data-off="关"></span>
                <span class="v2jun-switch-handle"></span>
              </label>
            </div>
          </li>
          <li class="setting-li-tips">开启后在输入框光标位置插入内容，关闭则追加到末尾</li>


          <li class="v2jun-setting-li-title more-setting more-setting-click" style="margin-bottom:0;"><hr><b>高级设置</b><hr></li>
          <li class="more-setting" style="font-size:12px;text-align:center;margin:-16px 0;color:red;">使用以下功能前请先熟读并背诵版规(手动狗头.jpg)</li>
          <li class="setting-li-between more-setting">
            <span>一键吃肉</span>
            <div class="v2jun-switch">
              <input name="oneClickCollectMoney" value="true" ${getUserSetting("oneClickCollectMoney") ? "checked" : ""
      }  class="v2jun-switch-checkbox" id="oneClickCollectMoney" type="checkbox">
              <label class="switch-label" for="oneClickCollectMoney">
                <span class="v2jun-switch-inner" data-on="开" data-off="关"></span>
                <span class="v2jun-switch-handle"></span>
              </label>
            </div>
          </li>
          <li class="setting-li-between more-setting">
            <span>自定义表情包</span>
            <textarea style="width:60%; min-height:50px;resize:vertical" class="v2jun-setting-li-input" name="userCustomEmojiList" id="userCustomEmojiList" placeholder="输入表情包链接，以英文逗号(,)分隔…">${getUserSetting(
        "userCustomEmojiList"
      )}</textarea>
          </li>
          <!--<li class="setting-li-between more-setting">
            <span>吹牛历史查询</span>
            <div class="v2jun-switch">
              <input name="showChuiniuHistory" value="true" ${getUserSetting("showChuiniuHistory") ? "checked" : ""
      }  class="v2jun-switch-checkbox" id="showChuiniuHistory" type="checkbox">
              <label class="switch-label" for="showChuiniuHistory">
                <span class="v2jun-switch-inner" data-on="开" data-off="关"></span>
                <span class="v2jun-switch-handle"></span>
              </label>
            </div>
          </li>-->
          <li class="setting-li-between extra-setting" style="display:none;">
            <span>复读机(回帖+1)</span>
            <div class="v2jun-switch">
              <input name="showHuifuCopy" value="true" ${getUserSetting("showHuifuCopy") ? "checked" : ""
      }  class="v2jun-switch-checkbox" id="showHuifuCopy" type="checkbox">
              <label class="switch-label" for="showHuifuCopy">
                <span class="v2jun-switch-inner" data-on="开" data-off="关"></span>
                <span class="v2jun-switch-handle"></span>
              </label>
            </div>
          </li>
          <li class="setting-li-between extra-setting" style="display:none;">
            <span>复读机自动提交</span>
            <div class="v2jun-switch">
              <input name="huifuCopyAutoSubmit" value="true" ${getUserSetting("huifuCopyAutoSubmit") ? "checked" : ""
      }  class="v2jun-switch-checkbox" id="huifuCopyAutoSubmit" type="checkbox">
              <label class="switch-label" for="huifuCopyAutoSubmit">
                <span class="v2jun-switch-inner" data-on="开" data-off="关"></span>
                <span class="v2jun-switch-handle"></span>
              </label>
            </div>
          </li>
          <li class="setting-li-between extra-setting" style="display:none;">
            <span>黑名单增强</span>
            <div class="v2jun-switch">
              <input name="useUserBlackList" value="true" ${getUserSetting("useUserBlackList") ? "checked" : ""
      }  class="v2jun-switch-checkbox" id="useUserBlackList" type="checkbox">
              <label class="switch-label" for="useUserBlackList">
                <span class="v2jun-switch-inner" data-on="开" data-off="关"></span>
                <span class="v2jun-switch-handle"></span>
              </label>
            </div>
          </li>
          <li class="setting-li-between extra-setting use-black-list" style="display:none;">
            <span>黑名单ID</span>
            <textarea style="width:60%; min-height:50px;resize:vertical" class="v2jun-setting-li-input" name="userBlackList" id="userBlackList" placeholder="输入用户ID，以英文逗号(,)分隔，已自动将论坛管理员加入白名单，为空则不会屏蔽任何人…">${getUserSetting(
        "userBlackList"
      )}</textarea>
          </li>
        </ul>
        <footer>
          <hr style='margin-bottom:6px;'>
          <span class="v2jun-popup-setting-import">导入配置</span>
          <span class="v2jun-popup-setting-export">导出配置</span>
          <hr style='margin-top:6px;'>
          <span class="v2jun-setting-cancel-btn">取消</span>
          <span class="v2jun-setting-confirm-btn">保存</span>
        </footer>
      </form>
      </div>
    `;
    container.append(vSettingEle);
    // 监听下拉选择，改变其他元素状态
    $('form[name="settingForm"]')
      .find("select, input[type='checkbox']")
      .on("change", function () {
        const changeEventName = $(this).attr("name");
        const changeEventValue = $(this).val();
        console.log(changeEventName, changeEventValue);

        if (changeEventName === "imgUploadSelOpt") {
          if (changeEventValue == 0) $(".v2jun-setting-div .sel-suimo").css("display", "none");
          else if (changeEventValue == 1) $(".v2jun-setting-div .sel-suimo").show();
        } else if (changeEventName === "useUserBlackList") {
          $(".v2jun-setting-div .use-black-list").css("display", $(this).prop("checked") ? "flex" : "none");
        }
      });
    // 禁止蒙版下的body内容滚动
    $("body").css("overflow", "hidden");
    // 高级设置——额外设置
    // $(".v2jun-setting-div .extra-setting").toggle();
    $(".v2jun-setting-div .more-setting-click").click(
      clickCounter(
        ".v2jun-setting-div .more-setting-click",
        () => {
          $(".v2jun-setting-div .extra-setting").toggle();
        },
        3,
        3
      )
    );
    // 清除缓存
    $(".v2jun-setting-div .v2jun-clear-setting").click((e) => {
      localStorage.removeItem("yaohuoBetterPlusSetting");
      localStorage.removeItem("jquery-3.7.1.min");
      sessionStorage.removeItem("checkBlackUserIDReqCache");

      notifyBox('重置成功');

      setTimeout(() => {
        window.location.reload();
      }, 300);
    });
    // 导入配置
    $(".v2jun-setting-div .v2jun-popup-setting-import").click((e) => {
      // console.log('导入配置');
      importWithExportSetting().importJson();
    });
    // 导出配置
    $(".v2jun-setting-div .v2jun-popup-setting-export").click((e) => {
      // console.log('导出配置');
      importWithExportSetting().exportJson();
    })
    // 取消按钮
    $(".v2jun-setting-div .v2jun-setting-cancel-btn").click(closePopupContainer);
    // 提交按钮
    $(".v2jun-setting-div .v2jun-setting-confirm-btn").click(() => {
      const formData = {};
      $('form[name="settingForm"]')
        .find("input, select, textarea")
        .each(function () {
          // 根据不同输入方式格式化值，否则全部为字符串
          if ($(this).is(":checkbox")) {
            formData[this.name] = this.checked;
          } else if ($(this).is(":radio")) {
            const checkedValue = $('form[name="settingForm"]')
              .find('[name="' + this.name + '"]:checked')
              .val();
            formData[this.name] = checkedValue !== undefined ? checkedValue : null;
          } else if ($(this).attr("type") === "number") {
            formData[this.name] = parseFloat(this.value);
          } else if ($(this).attr("type") === "date") {
            formData[this.name] = new Date(this.value);
          } else if ($(this).is("select")) {
            formData[this.name] = parseFloat(this.value);
          } else {
            if (this.name == "userBlackList") {
              // 对字符串进行处理，将中文"，"替换为英文","，防止误输入中文逗号导致的解析错误
              formData[this.name] = this.value.replace(/，/g, ',');
            } else if (this.name == 'userCustomEmojiList') {
              formData[this.name] = this.value.replace(/，/g, ',');
            } else {
              formData[this.name] = this.value;
            }
          }
        });
      // console.log(formData);
      const cacheSetting = JSON.parse(localStorage.getItem("yaohuoBetterPlusSetting"));
      for (const key of Object.keys(formData)) {
        cacheSetting[key] = formData[key];
      }
      try {
        localStorage.setItem("yaohuoBetterPlusSetting", JSON.stringify(cacheSetting));
        notifyBox("保存成功");
      } catch (error) {
        notifyBox("保存失败", false);
      }
      // 刷新页面以应用新设置
      setTimeout(() => {
        window.location.reload();
      }, 300);
    });
    // 根据用户设置决定是否显示水墨图床 token 设置
    if (getUserSetting("imgUploadSelOpt") != 1) $(".v2jun-setting-div .sel-suimo").css("display", "none");
    // 根据用户设置决定是否显示黑名单输入框
    if (!getUserSetting("useUserBlackList")) $(".v2jun-setting-div .use-black-list").css("display", "none");
  }
  // 设置 icon
  function createIcon() {
        // 页面内设置按钮，避免icon被设置为 0 时无法重置设置
        $(".subtitle2")
            .append("<span style='color:red;margin-left:15px;font-weight:bold;'>脚本设置</span>")
            .find("span")
            .click(() => {
            createPopupContainer();
        });

        const windowWidth = $(window).width();
        const bodyContentWidth = $("body").width();
        const iconSize = getUserSetting("settingIconSize") + "px";

        // 创建图标元素
        const $icon = $("<img>")
        .attr("id", "settingICon")
        .attr("src", `${settingIconBase64}`)
        .css({
            "position": "fixed",
            "top": "10px",
            "right": "10px",
            "width": iconSize,
            "height": iconSize,
            "z-index": 9998,
            "cursor": "move" // 添加手形光标
        })
        .appendTo("body")
        .click(() => {
            createPopupContainer();
        });;

        // 从localStorage加载保存的位置
        const savedPosition = JSON.parse(localStorage.getItem(ICON_POSITION_KEY));
        if (savedPosition) {
            $icon.css({
                top: savedPosition.top,
                left: savedPosition.left
            });
        }


        // 添加到页面
        $("body").append($icon);
  }

   /**
   * 节流函数
   * @param {function} fn - 要节流的函数
   * @param {number} interval - 节流时间间隔（毫秒）
   * @param {Object} options - 选项对象
   * @param {boolean} [options.leading=true] - 是否在开始时立即执行一次函数
   * @param {boolean} [options.trailing=isExecTrail] - 是否在结束时再执行一次函数
   * @returns {function} 节流后的函数
   */
  function throttle(
    fn,
    interval,
    { leading = true, trailing = true } = {}
  ) {
    let startTime = 0;
    let timer = null;

    const _throttle = function (...args) {
      return new Promise((resolve, reject) => {
        try {
          // 1.获取当前时间
          const nowTime = new Date().getTime();

          // 对立即执行进行控制
          if (!leading && startTime === 0) {
            startTime = nowTime;
          }

          // 2.计算需要等待的时间执行函数
          const waitTime = interval - (nowTime - startTime);
          if (waitTime <= 0) {
            // console.log("执行操作fn")
            if (timer) clearTimeout(timer);
            const res = fn.apply(this, args);
            resolve(res);
            startTime = nowTime;
            timer = null;
            return;
          }

          // 3.判断是否需要执行尾部
          if (trailing && !timer) {
            timer = setTimeout(() => {
              // console.log("执行timer")
              const res = fn.apply(this, args);
              resolve(res);
              startTime = new Date().getTime();
              timer = null;
            }, waitTime);
          }
        } catch (error) {
          reject(error);
        }
      });
    };

    _throttle.cancel = function () {
      if (timer) clearTimeout(timer);
      startTime = 0;
      timer = null;
    };

    return _throttle;
  }


// 黑名单
const checkBlackUserIDReqCache = JSON.parse(sessionStorage.getItem("checkBlackUserIDReqCache")) || {}; // 缓存请求结果
function handleUserBlacklist() {
  // 生成拉黑按钮
  executeFunctionForURL(/^(\/bbs-.*\.html(\?.*)?|\/bbs\/view\.aspx\?id=\d+.*|\/bbs\/book_re\.aspx\?.*)$/i, _add_black_btn);

  // console.log("开始处理黑名单");
  const userWhiteIdList = ["1000", "36787", "11637"]; // 管理员白名单
  const userBlackIdListStr = getUserSetting("userBlackList");
  if (!userBlackIdListStr || userBlackIdListStr.length === 0) return;
  let userBlackIdList = userBlackIdListStr.split(",").filter((id) => id.trim() !== "" && !userWhiteIdList.includes(id));
  if (!Array.isArray(userBlackIdList)) userBlackIdList = [];

  // 处理帖子列表
  _handleBookList();
  // 处理评论区
  executeFunctionForURL(/^(\/bbs-.*\.html(\?.*)?|\/bbs\/view\.aspx\?id=\d+.*|\/bbs\/book_re\.aspx\?.*)$/i, _handleComments);

  // 生成拉黑按钮
  function _add_black_btn() {
    // console.log("开始添加黑名单按钮");

    // 处理楼主
    const lzblackBtnEle = $("<span style='color:red;margin-left:10px;'>(加入黑名单)</span>");
    $('.louzhuxinxi.subtitle .louzhu .online').after(lzblackBtnEle);
    lzblackBtnEle.click(() => {
      // console.log("点击了加入黑名单按钮");
      if (!confirm('确定要将该用户加入黑名单吗？')) return;
      const userHref = $('.louzhuxinxi.subtitle .louzhu').find('.louzhunicheng a').attr('href');
      // console.log('获取到的用户ID:', _extractUserId(userHref));
      _addToStorage(_extractUserId(userHref));
    });

    // 处理评论区
    const isNewHuifu = $(".recontent .forum-post").length > 0;
    if (isNewHuifu) {
      // 新版回帖
      $(".recontent .forum-post .post-header .user-name").each(function () {
        const blackBtnEle = $("<span style='color:red;margin-left:10px;'>(加入黑名单)</span>");
        blackBtnEle.click(() => {
          if (!confirm('确定要将该用户加入黑名单吗？')) return;
          const userHref = $(this).closest('.forum-post .post-header .user-name').find('.user-id a').attr('href');
          _addToStorage(_extractUserId(userHref));
        });
        $(this).append(blackBtnEle);
      });
    } else {
      // 旧版回帖
      $(".recontent .reline.list-reply .recolon").each(function () {
        const blackBtnEle = $("<span style='color:red;margin-left:10px;'>(加入黑名单)</span>");
        blackBtnEle.click(() => {
          // console.log("点击了加入黑名单按钮");
          if (!confirm('确定要将该用户加入黑名单吗？')) return;
          // 获取父级下类名为 renick 里的 a 标签的 href
          const userHref = $(this).closest('.reline.list-reply').find('.renick a').attr('href');
          // console.log('获取到的用户ID:', _extractUserId(userHref));
          _addToStorage(_extractUserId(userHref));
        });
        $(this).prepend(blackBtnEle);
      });
    }

    function _addToStorage(userid) {
      const cacheBlackList = getUserSetting("userBlackList");
      if (!cacheBlackList) saveUserSetting("userBlackList", userid);
      else saveUserSetting("userBlackList", `${cacheBlackList},${userid}`);
      notifyBox("已将用户ID: " + userid + " 加入黑名单", "success");
      // location.reload();
    }
  }
  // 处理帖子列表（首页、版块列表、帖子详情页）
  function _handleBookList() {
    // console.log("开始处理帖子列表");
    const bookList = $(".list, .listdata.line1, .listdata.line2");
    bookList.each(function () {
      const bookItem = $(this);
      // console.log("解析到帖子列表:", bookItem);
      const bookLink = bookItem.find('a[href^="/bbs-"]');
      const bookIDArr = [];
      bookLink.each(function () {
        const bookId = $(this)
          .attr("href")
          .match(/\/bbs-(\d+)\.html/)?.[1];
        // console.log("解析到帖子ID:", bookId);
        if (!bookId) return;
        bookIDArr.push(bookId);
      });
      // 请求每个帖子的管理信息，以拿到用户id
      const requests = bookIDArr.map((id) => {
        // 检查缓存,如果有缓存就直接返回,大幅提升性能，降低开销
        if (checkBlackUserIDReqCache[id]) {
          return Promise.resolve(checkBlackUserIDReqCache[id]);
        }

        return $.get(`/bbs/Book_View_admin.aspx?id=${id}`).then((res) => {
          // 缓存结果，避免二次请求造成的性能浪费
          checkBlackUserIDReqCache[id] = res;
          try {
            sessionStorage.setItem("checkBlackUserIDReqCache", JSON.stringify(checkBlackUserIDReqCache));
          } catch (e) {
            if (e.name === "QuotaExceededError") {
              sessionStorage.removeItem("checkBlackUserIDReqCache");
              console.warn("存储空间已满,以移除左右旧缓存");
              sessionStorage.setItem("checkBlackUserIDReqCache", JSON.stringify(checkBlackUserIDReqCache));
            }
          }
          return res;
        });
      });
      Promise.all(requests).then((reqRes) => {
        reqRes.forEach((resItem, resItemindex) => {
          const $linksWithUserID = $(resItem).find('a[href*="touserid="]');
          $linksWithUserID.each(function () {
            const bookUserId = _extractUserId($(this).attr("href"));
            // console.log("解析到的用户ID:", bookUserId);
            if (bookUserId && userBlackIdList.includes(bookUserId)) {
              console.log("发现此评论作者在黑名单中,用户ID:", bookUserId);
              if ($(bookItem).hasClass("listdata")) {
                // 新帖列表页
                $(bookItem).remove();
              } else {
                // 首页
                // console.log("要移除的帖子序号:", resItemindex + 1);
                $(bookItem)
                  .contents()
                  .filter(function () {
                    const removeIndex = resItemindex + 1;
                    return this.nodeType === 3 && this.textContent.trim() === removeIndex + ".";
                  })
                  .remove();
                // 移除对应的a标签，br标签
                $(bookItem).find('a[href^="/bbs-"]').eq(resItemindex).remove();
                $(bookItem).find("br").eq(resItemindex).remove();
              }
            }
          });
        });
      });
    });
  }
  // 处理评论区
  function _handleComments() {
    // console.log("开始处理评论区");
    const selector = $(`
      .recontent .forum-post,
      .recontent .list-reply,
      .recontent .recontent .forum-post,
      .recontent .recontent .list-reply`);
    const userLinkSelector = ".user-nick a, .renick a";
    // 一次性查询所有评论，减少DOM操作
    $(selector).not(function () {
      return $(this).data('v2jun-check-blocklist-processed') === true;
    }).each(function () {
      const $userLink = $(this).find(userLinkSelector);
      // 如果找到了用户链接
      if ($userLink.length && $userLink.length > 0) {
        const userHref = $userLink.attr("href");
        const userId = _extractUserId(userHref);
        // console.log("解析到评论区用户ID:", userId);
        // 如果用户ID在黑名单中，移除评论
        if (userId && userBlackIdList.includes(userId)) {
          // console.log("发现此评论作者在黑名单中,用户ID:", userId);
          $(this).remove();
        }
      }
      $(this).data('v2jun-check-blocklist-processed', true);
      // console.log('元素已处理:', $(this).data('v2jun-check-blocklist-processed'));
    });
  }

  // 提取用户ID
  function _extractUserId(url) {
    if (!url) return null;
    // 匹配两种可能的格式:
    // 1. touserid=数字
    // 2. mainuserid=数字
    const match = url.match(/[to|main]userid=(\d+)/);
    return match ? match[1] : null;
  }
}
// 导入导出配置
function importWithExportSetting() {
  // 导出JSON配置文件
  function exportJson() {
    const userCacheSetting = JSON.parse(localStorage.getItem("yaohuoBetterPlusSetting"));
    // console.log("导出配置:", userCacheSetting); return;
    const jsonString = JSON.stringify(userCacheSetting, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'yaohuoBetterPlusSetting.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  // 导入JSON配置文件
  function importJson() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';

    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importConfig = JSON.parse(e.target.result);
          // console.log('导入的配置:', importConfig);
          const userCacheSetting = JSON.parse(localStorage.getItem("yaohuoBetterPlusSetting"));
          // console.log("当前配置:", userCacheSetting);          
          const mergedConfig = { ...userCacheSetting, ...importConfig };// 合并配置
          // console.log('合并后的配置:', mergedConfig);          
          localStorage.setItem("yaohuoBetterPlusSetting", JSON.stringify(mergedConfig));// 保存合并后的配置

          notifyBox("导入成功", "success", 1000);
          setTimeout(() => {
            location.reload();
          }, 1500);
        } catch (error) {
          // console.error('解析JSON失败:', error);
          notifyBox("未知错误，导入失败,请检查配置文件格式是否正确", false, 3000);
        }
      };
      reader.readAsText(file);
    });

    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  }
  return {
    exportJson,
    importJson
  };
}
// 检查更新
function checkVersion() {
  sessionStorage.removeItem("canUpdate");
  sessionStorage.removeItem("newVersion");
  myAjax("https://greasyfork.org/scripts/504289.json").then((data) => {
    const { version } = data;
    if (version <= defaultSetting.version) return;
    notifyBox("已有新版本，请自行更新。如不需要更新，可在设置里关闭", false, 3000);
    sessionStorage.setItem("canUpdate", true);
    sessionStorage.setItem("newVersion", version);
  });
}
// PC端点击帖子弹窗打开
function openLayer(url) {
  if (!isPC()) return;
  // 监听点击事件
  $(document)
    .off("click", ".listdata .topic-link")
    .on("click", ".listdata .topic-link", function (event) {
      event.preventDefault(); // 阻止默认链接行为
      const url = $(this).attr("href"); // 获取链接的 href 属性
      openLayer(url);
    });
  if (!url || url.length < 1) return;
  // 创建背景层
  let background_layer = $("<div>").css({
    display: "none",
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "gray",
    zIndex: "1001",
    opacity: "0.8"
  });
  // 创建弹出层
  let open_layer = $("<div>").css({
    display: "none",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth: "720px",
    height: "96%",
    border: "1px solid lightblue",
    borderRadius: "10px",
    boxShadow: "4px 4px 10px #171414",
    backgroundColor: "white",
    zIndex: "1002",
    overflow: "auto",
    margin: "0",
    padding: "0"
  });
  // 创建 iframe
  let iframe = $("<iframe>")
    .attr("src", url || "")
    .css({
      width: "100%",
      height: "100%",
      border: "0",
      display: "block"
    });

  // 将 iframe 添加到弹出层
  open_layer.append(iframe);
  // 将弹出层和背景层添加到 body
  $("body").append(open_layer).append(background_layer);
  // 显示弹出层和背景层
  open_layer.show();
  background_layer.show();
  // 点击背景层时关闭弹出层
  background_layer.on("click", function () {
    open_layer.remove();
    background_layer.remove();
  });
}
// 回复列表自动加载更多
function autoLoadMoreHuifuList() {
  // 获取加载更多按钮
  const loadMoreButton = $(".viewContent .more a:contains('加载更多')");
  // 设置一个标志位，用于判断是否已经触发过点击事件
  let hasTriggered = false;

  // 监听滚动事件
  $(window).scroll(function () {
    // 获取页面滚动的位置和文档高度
    const scrollTop = $(this).scrollTop();
    const windowHeight = $(this).height();
    const documentHeight = $(document).height();
    // 检查是否滚动到距离底部400px，并且还没有触发过点击事件
    if (documentHeight - (scrollTop + windowHeight) <= 500 && !hasTriggered) {
      // 自动点击加载更多按钮
      // console.log("%c ===> [ 自动点击加载回复 ] <===", "font-size:13px; background:pink; color:#bf2c9f;");
      loadMoreButton.click();
      // 设置标志位为已触发
      hasTriggered = true;
    } else if (documentHeight - (scrollTop + windowHeight) > 500) {
      // 如果滚动距离超过200px，重置标志位
      hasTriggered = false;
    }
  });
}
// 帖子列表自动加载更多
function autoLoadMoreBookList() {
  // 获取加载更多按钮
  const loadMoreButton = $(".btBox .bt1 a:contains('加载更多')");
  // 设置一个标志位，用于判断是否已经触发过点击事件
  let hasTriggered = false;

  // 监听滚动事件
  $(window).scroll(function () {
    // 获取页面滚动的位置和文档高度
    const scrollTop = $(this).scrollTop();
    const windowHeight = $(this).height();
    const documentHeight = $(document).height();
    // 检查是否滚动到距离底部200px，并且还没有触发过点击事件
    if (documentHeight - (scrollTop + windowHeight) <= 500 && !hasTriggered) {
      // 自动点击加载更多按钮
      console.log("%c ===> [ 自动点击加载帖子 ] <===", "font-size:13px; background:pink; color:#bf2c9f;");
      loadMoreButton.click();
      // 设置标志位为已触发
      hasTriggered = true;
    } else if (documentHeight - (scrollTop + windowHeight) > 500) {
      // 如果滚动距离超过200px，重置标志位
      hasTriggered = false;
    }
  });
}
// 上一页，下一页按钮互换位置
function useRightNextBtn() {
  function _executeWithRetry(retryCount = 0) {
    if(retryCount > 10) return;// 最多重试10次
    const btBox = $(".btBox .bt2");
    if (!btBox.length) {
      retryCount++;
      setTimeout(executeWithRetry(retryCount + 1), 500);
      return;
    }
    const links = btBox.children("a");
    if (links.length !== 2) {
      retryCount++;
      setTimeout(executeWithRetry(retryCount + 1), 500 * retryCount);
      return;
    }
    // 检查是否为上一页和下一页按钮，避免其他按钮被误操作
    const firstBtnText = links.eq(0).text().trim();
    const secondBtnText = links.eq(1).text().trim();
    if (firstBtnText !== "下一页" || secondBtnText !== "上一页") {
      retryCount++;
      setTimeout(executeWithRetry(retryCount + 1), 500 * retryCount);
      return;
    }
    // 克隆元素以保留事件绑定
    const clonedLinks = links.map(function () {
      return $(this).clone(true)[0];
    }).get();
    // 清空容器并按相反顺序添加克隆的元素
    btBox.empty().append(clonedLinks.reverse());
  }
  _executeWithRetry();
}
// 回帖 增强
function huifuBetter() {
  // 移除帖子快速回复旁“文件回帖”按钮
  $(".kuaisuhuifu a").remove();
  // 移除默认表情展开按钮及弹出内容区域
  $(".viewContent .ulselect").remove();
  $(".viewContent .emoticon-popup").remove();

  const ubbToggleEle = $(
    `<span class="v2jun-custom-toggle-btn v2jun-huifu-ubb-toggle">${getUserSetting("showHuifuUbb") ? "UBB 折叠" : "UBB 展开"}</span>`
  );
  ubbToggleEle.click(function () {
    $(".v2jun-ubblist-div").toggle();
    const showHuifuUbb = getUserSetting("showHuifuUbb");
    if (showHuifuUbb) {
      saveUserSetting("showHuifuUbb", false);
      $(this).text("UBB 展开");
    } else {
      saveUserSetting("showHuifuUbb", true);
      $(this).text("UBB 折叠");
    }
  });
  $(".viewContent .kuaisuhuifu").append(ubbToggleEle);

  const emojiToggleEle = $(
    `<span class='v2jun-custom-toggle-btn v2jun-huifu-emoji-toggle'>${getUserSetting("showHuifuEmoji") ? "表情 折叠" : "表情 展开"}</span>`
  );
  emojiToggleEle.css({ "margin-left": "10px", "padding": "2px 10px" });
  emojiToggleEle.insertBefore(".viewContent .tongzhi");
  emojiToggleEle.click(function () {
    $(".v2jun-emojilist-div").toggle();
    const showHuifuEmoji = getUserSetting("showHuifuEmoji");
    if (showHuifuEmoji) {
      saveUserSetting("showHuifuEmoji", false);
      $(this).text("表情 展开");
    } else {
      saveUserSetting("showHuifuEmoji", true);
      $(this).text("表情 折叠");
    }
  });

  $(".viewContent .centered-container").before('<div class="v2jun-emojilist-div v2jun-huifu-emoji"></div>');
  createEmojiHtml(".viewContent .centered-container textarea.retextarea[name='content']");
  $(".viewContent form .kuaisuhuifu").after('<div class="v2jun-ubblist-div v2jun-huifu-ubb"></div>');
  createUbbHtml(".viewContent .centered-container textarea.retextarea[name='content']");

  !getUserSetting("showHuifuEmoji") && $(".v2jun-emojilist-div.v2jun-huifu-emoji").css("display", "none");
  !getUserSetting("showHuifuUbb") && $(".v2jun-ubblist-div.v2jun-huifu-ubb").css("display", "none");
}
// 发帖/修改帖 增强
function bookViewBetter() {
  const isBookViewMod = window.location.pathname == "/bbs/book_view_mod.aspx" ? true : false; // 判断是否是修改帖子页面

  // 生成按钮
  const toggleEle = $(`<span class="v2jun-custom-toggle-btn view-ubb-btn" style="font-size:10px;margin-right:0;">
      ${getUserSetting("showBookViewUbb") ? "UBB 折叠" : "UBB 展开"}</span>
      <span class="v2jun-custom-toggle-btn view-emoji-btn" style="font-size:10px;margin-left:0;">
      ${getUserSetting("showBookViewEmoji") ? "表情 折叠" : "表情 展开"}</span>
  `);

  if (isBookViewMod) {
    // 修改帖子
    $("label").each(function () {
      const labelContent = $(this).html();
      if (labelContent == "内容") {
        $(this).replaceWith(`
            <div class="content-header"><label>内容</label><div class="textarea-actions"></div>
          `);
      }
    });
    $(".upload-container .form-group .textarea-actions").append(toggleEle);
  } else {
    // 发布帖子
    $(".content .textarea-actions #saveDraftButton").before(toggleEle);
  }
  // ubb 展开按钮
  $(".v2jun-custom-toggle-btn.view-ubb-btn").click(function () {
    $(".v2jun-ubblist-div").toggle();
    const showBookViewUbb = getUserSetting("showBookViewUbb");
    if (showBookViewUbb) {
      saveUserSetting("showBookViewUbb", false);
      $(this).text("UBB 展开");
    } else {
      saveUserSetting("showBookViewUbb", true);
      $(this).text("UBB 折叠");
    }
  });
  // 表情展开按钮
  $(".v2jun-custom-toggle-btn.view-emoji-btn").click(function () {
    $(".v2jun-emojilist-div").toggle();
    const showBookViewEmoji = getUserSetting("showBookViewEmoji");
    if (showBookViewEmoji) {
      saveUserSetting("showBookViewEmoji", false);
      $(this).text("表情 展开");
    } else {
      saveUserSetting("showBookViewEmoji", true);
      $(this).text("表情 折叠");
    }
  });

  let contentHeader = $(".upload-container .form-group .content-header").eq(1); // 发布帖子
  if (isBookViewMod) contentHeader = $(".upload-container .form-group .content-header");
  console.log("isBookViewMod:", isBookViewMod);
  // 向页面内注入区域
  contentHeader.after('<div class="v2jun-emojilist-div bookview-emoji"></div>');
  createEmojiHtml(".upload-container .form-group [name='book_content']");
  contentHeader.after('<div class="v2jun-ubblist-div bookview-ubb"></div>');
  createUbbHtml(".upload-container .form-group [name='book_content']");

  // 读取设置，当折叠时隐藏
  !getUserSetting("showBookViewEmoji") && $(".v2jun-emojilist-div.bookview-emoji").css("display", "none");
  !getUserSetting("showBookViewUbb") && $(".v2jun-ubblist-div.bookview-ubb").css("display", "none");
}

// ubb 节点
function createUbbHtml(insertEle) {
  // 生成 ubb 按钮
  const ubbListHtml = [];
  ubbList.forEach((ubbItem) => {
    const { name, upload } = ubbItem;
    let ubbSpanEle = null;
    if (upload?.type?.length > 0) {
      ubbSpanEle = $(`
            <input type="file" id="upload-${upload.type}" style="display: none;" accept="${upload.accept}" multiple/>
            <span class="v2jun-ubb-item">${name}</span>
        `);
    } else {
      ubbSpanEle = $(`<span class="v2jun-ubb-item">${name}</span>`);
    }
    ubbListHtml.push(ubbSpanEle);
  });
  $(".v2jun-ubblist-div").append(ubbListHtml);
  // 设置 ubb 点击功能,生成时设置会导致某些ubb点击无法生效
  ubbList.forEach((ubbItem) => {
    const { ubbType, name, inputTitle, ubbHandle, upload } = ubbItem;
    $(`.v2jun-ubblist-div .v2jun-ubb-item:contains("${name}")`).click(() => {
      if (ubbType == "input") {
        // 输入域
        showInputPopup(inputTitle, (inputResult) => inputResult && insetCustomContent(ubbHandle(inputResult), insertEle));
      } else if (ubbType == "jxVideo") {
        // 外链解析
        showInputPopup(inputTitle, (inputResult) => {
          if (!inputResult || !inputResult[0]) return;

          showWaitBox("解析中…");
          // 从分享文本中提取链接
          const urlRegex = /(https?:\/\/[^\s]+)/;
          const match = inputResult[0].match(urlRegex);
          if (!match || !match[0]) {
            notifyBox("啥链接都没有，你解析个 der~", false);
            $(".v2jun-wait-box-overlay").remove();
            return;
          }

          getVideoPlayUrl(match[0], (videoUrl) => {
            if (!videoUrl) return;

            insetCustomContent(ubbHandle(videoUrl), insertEle);
            $(".v2jun-wait-box-overlay").remove();
            notifyBox("解析成功~");
          });
        });
      } else if (ubbType == "jxZb") {
        // 外链解析
        showInputPopup(inputTitle, (inputResult) => {
          if (!inputResult || !inputResult[0]) return;

          showWaitBox("解析中…");
          // 从分享文本中提取链接
          const urlRegex = /(https?:\/\/[^\s]+)/;
          const match = inputResult[0].match(urlRegex);
          if (!match || !match[0]) {
            notifyBox("啥链接都没有，你解析个 der~", false);
            $(".v2jun-wait-box-overlay").remove();
            return;
          }

          getZbPlayUrl(match[0], (zbUrl) => {
            if (!zbUrl) return;

            insetCustomContent(ubbHandle(zbUrl), insertEle);
            $(".v2jun-wait-box-overlay").remove();
            notifyBox("解析成功~");
          });
        });
      } else if (ubbType == "uploadImg") {
        // 点击隐藏的上传选择文件按钮
        $(`.v2jun-ubblist-div #upload-${upload.type}`).click();
        // 文件选择回调事件
        $(`.v2jun-ubblist-div #upload-${upload.type}`)
          .off("input")
          .on("input", function () {
            const fileInput = this;
            const tempFiles = this.files;
            if (!tempFiles || tempFiles.length === 0) {
              notifyBox("请选择图片", false);
              return;
            }
            if (tempFiles.length > 10) {
              notifyBox("一次最多选择 10 张图片", false);
              return;
            }

            showWaitBox("上传中…"); // 上传等待提示
            let uploadCount = { currentIndex: 0, success: 0, fail: 0 }; // 存储上传结果数量
            const uploadNextImage = () => {
              if (uploadCount.currentIndex >= tempFiles.length) {
                // 所有图片上传完成
                setTimeout(() => {
                  $(".v2jun-wait-box-overlay").remove(); // 关闭等待提示
                }, 1000);
                setTimeout(() => notifyBox(`已成功上传 ${uploadCount.success} 个文件，失败 ${uploadCount.fail} 个文件`), 1500);
                $(fileInput).val(""); // 上传完成后清空文件选择,解决某些浏览器上出现的重复上传及选择相同文件时不上传问题
                return;
              }

              const url = defaultSetting.imgUploadApiUrl[getUserSetting("imgUploadSelOpt")];
              const options = {};
              if (getUserSetting("imgUploadSelOpt") == 1) {
                // 水墨图床添加 token
                options.headers = {
                  token: getUserSetting("suimoToken")
                };
              }
              const currentImg = tempFiles[uploadCount.currentIndex];
              // 检查文件大小是否超过20MB
              if (currentImg.size > 20 * 1024 * 1024) {
                notifyBox(`第 ${uploadCount.currentIndex + 1} 张图片文件过大，已跳过`, false, 300);
                uploadCount.fail++;
                uploadCount.currentIndex++;
                uploadNextImage();
                return;
              }
              const data = new FormData();
              data.append("image", currentImg);
              uploadFiles({
                url,
                data,
                options,
                success: (res) => {
                  const { code, msg, data } = res;
                  if (code == 200) {
                    uploadCount.success++;
                    insetCustomContent(ubbHandle([data.url]), insertEle);

                    if (tempFiles.length > 1) {
                      notifyBox(`第 ${uploadCount.currentIndex + 1} 张图片已上传成功`, true, 200);
                    }
                  } else {
                    uploadCount.fail++;
                    notifyBox(`第 ${uploadCount.currentIndex + 1} 张图片上传失败`, false, 300);
                  }
                  // 继续上传下一张
                  uploadCount.currentIndex++;
                  uploadNextImage();
                },
                error: (err) => {
                  notifyBox(`第 ${uploadCount.currentIndex + 1} 张图片上传失败`, false, 300);
                  uploadCount.currentIndex++;
                  uploadCount.fail++;
                  uploadNextImage();
                }
              });
            };
            // 开始上传第一张图片
            uploadNextImage();
          });
      } else if (ubbType == "uploadFile") {
        // 点击隐藏的上传选择文件按钮
        $(`.v2jun-ubblist-div #upload-${upload.type}`).click();
        // 文件选择回调事件
        $(`.v2jun-ubblist-div #upload-${upload.type}`)
          .off("input")
          .on("input", function () {
            const fileInput = this;
            const tempFiles = this.files;
            if (tempFiles.length == 0) {
              notifyBox("请选择文件", false);
              return;
            }
            if (tempFiles.length > 10) {
              notifyBox("一次最多选择 10 个文件", false);
              return;
            }

            for (const file of tempFiles) {
            }
          });
      } else if (ubbType == "text") {
        insetCustomContent(`[forecolor=#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}]感谢分享[/forecolor]`, ".centered-container .retextarea", true);
        setTimeout(() => {
          $(".kuaisuhuifu input").trigger("click");
        }, 300);
      }
    });
  });
}

// 表情 节点
function createEmojiHtml(insertEle) {
  let userCacheEmojiList = getUserSetting("userCustomEmojiList").split(',').filter(item => item.trim() !== '');
  if (!Array.isArray(userCacheEmojiList)) userCacheEmojiList = [];
  const allEmojiList = [...emojiList, ...userCacheEmojiList];
  console.log("allEmojiList:", allEmojiList);
  // 计算每行能放几个表情
  const containerWidth = $(".v2jun-emojilist-div").width();
  const emojiWidth = 50; // 表情宽度(包含间距)
  const emojisPerRow = Math.floor(containerWidth / emojiWidth);
  const rowsPerPage = 5; // 每页显示5行
  const pageSize = emojisPerRow * rowsPerPage; // 每页显示数量
  let currentPage = parseInt(insertEle.includes("book_content") ? getUserSetting("bookviewEmojiPage") : getUserSetting("huifuEmojiPage")) || 1; // 获取缓存的页码
  const totalPages = Math.ceil(allEmojiList.length / pageSize); // 总页数
  currentPage = Math.min(Math.max(currentPage, 1), totalPages);// 确保页码在有效范围内

  function loadEmojis(page) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const currentEmojis = allEmojiList.slice(start, end);

    const emojiListHtml = [];
    currentEmojis.forEach((faceitem) => {
      const img = $("<img/>", {
        class: "v2jun-emojilist-img",
        src: faceitem
      });
      $(img).click(() => insetCustomContent(`[img]${faceitem}[/img]`, insertEle));
      emojiListHtml.push(img);
    });

    // 清空内容并添加新表情
    $(".v2jun-emojilist-div").empty().append(emojiListHtml);
    // 更新分页按钮
    updatePaginationButtons();
    // 缓存当前页码
    saveUserSetting(insertEle.includes("book_content") ? "bookviewEmojiPage" : "huifuEmojiPage", page);
  }

  // 创建分页按钮
  function createPaginationButtons() {
    // 判断是否为发帖/修改帖页面
    const isBookView = window.location.pathname.includes("book_view");
    const paginationDiv = $("<div/>", {
      class: "emoji-pagination",
      style: `text-align:center;border: 1px solid #d4d4d4;border-bottom-left-radius:5px;border-bottom-right-radius:5px;
              ${isBookView ? "margin:-6px auto 10px;" : "margin:-6px 1% 10px;"}
      `
    });

    const prevBtn = $("<span/>", {
      class: "emoji-page-btn",
      text: "上一页",
      style: "margin:0 10px;cursor:pointer;color:#999;" // 第一页时默认置灰
    }).click(() => {
      if (currentPage > 1) {
        currentPage--;
        loadEmojis(currentPage);
      }
    });

    const nextBtn = $("<span/>", {
      class: "emoji-page-btn",
      text: "下一页",
      style: "margin:0 10px;cursor:pointer;color:#1ABCAF;"
    }).click(() => {
      if (currentPage < totalPages) {
        currentPage++;
        loadEmojis(currentPage);
      }
    });

    const pageInfo = $("<span/>", {
      class: "emoji-page-info",
      style: "margin:0 10px;"
    }).text(`${currentPage}/${totalPages}`); // 初始化时就设置页码

    paginationDiv.append(prevBtn, pageInfo, nextBtn);
    $(".v2jun-emojilist-div").after(paginationDiv);
  }
  // 更新分页按钮状态
  function updatePaginationButtons() {
    const pageInfo = $(".emoji-page-info");
    pageInfo.text(`${currentPage}/${totalPages}`);

    const prevBtn = $(".emoji-page-btn:contains('上一页')");
    const nextBtn = $(".emoji-page-btn:contains('下一页')");

    // 修复按钮颜色逻辑
    prevBtn.css("color", currentPage <= 1 ? "#999" : "#1ABCAF");
    nextBtn.css("color", currentPage >= totalPages ? "#999" : "#1ABCAF");
  }

  // 初始化
  loadEmojis(currentPage);
  createPaginationButtons();
  updatePaginationButtons(); // 确保初始化时按钮颜色正确

  // 监听表情区域显示状态变化，让页码显示区域跟随显示/隐藏
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes" && mutation.attributeName === "style") {
        const isVisible = $(".v2jun-emojilist-div").is(":visible");
        $(".emoji-pagination").css("display", isVisible ? "block" : "none");
      }
    });
  });
  observer.observe($(".v2jun-emojilist-div")[0], {
    attributes: true
  });
}
// 处理页面中图片
function imgCustomProcess() {
  const imgThumbWidth = getUserSetting("imgThumbWidth"); // 读取用户设置缩放值
  // 监测所有图片
  $("body img").each(function () {
    if (this.complete) {
      handleImageLoad(this); // 如果图片已经加载完成
    } else {
      $(this).on("load", function () {
        handleImageLoad(this);
      });
    }
  });
  // 排除不需要处理的图片
  function shouldExclude(img) {
    const excludedClasses = []; // 需要排除的 class
    const excludedIds = ["settingICon"]; // 需要排除的 id
    // 判断是否包含排除的 class 或 id
    return excludedClasses.some((cls) => $(img).hasClass(cls)) || excludedIds.includes($(img).attr("id"));
  }
  // 图片加载完成
  function handleImageLoad(img) {
    if ($(img).width() <= 100) return; // 排除宽度过小的图片，不处理，基本上都是表情包或者logo啥的小图片
    if (shouldExclude(img)) return; // 跳过指定 class 或 id 的图片

    // 处理图片
    _handleThumb();
    getUserSetting('imgBlur') && _handleBlur();

    function _handleThumb() {
      if ($(img).data('v2jun-img-thumb-processed')) return; // 跳过已处理的图片
      if (!imgThumbWidth) return; // 设置缩放宽度为 0 时，不缩放

      $(img).addClass("img-thumb"); // 为img标签添加class，修改显示大小

      $(img).click(function (e) {
        e.preventDefault(); // 取消默认点击行为，避免进入预览窗口
        $(this).toggleClass("img-thumb"); // 给图片添加点击事件，添加/移除指定class，以实时修改图片大小
      });

      $(img).data('v2jun-img-thumb-processed', true); // 标记图片已处理// 添加点击事件
    }
    function _handleBlur() {
      if ($(img).data('v2jun-img-blur-processed')) return; // 跳过已处理的图片

      $(img).css({ 'filter': 'blur(15px)', 'transition': 'filter 0.3s ease' });// 添加模糊效果
      $(img).click(function (e) {
        e.preventDefault(); // 取消默认点击行为，避免进入预览窗口
        const currentFilter = $(this).css('filter');
        if (currentFilter === 'none') {
          $(this).css('filter', 'blur(15px)');// 恢复模糊效果
        } else {
          $(this).css('filter', 'none');// 移除模糊效果
        }
      });
      // 设置已处理标识
      $(img).data('v2jun-img-blur-processed', true);
    }
  }
}
// 复读机(回帖+1)
function huifuCopy() {
  const isNewHuifu = $(".recontent .forum-post .admin-actions").length > 0;
  if (isNewHuifu) {
    // 新版回帖
    $(".recontent .forum-post .admin-actions").each(function () {
      const copySpanEle = $("<span class='v2jun-huifu-copy'>+1</span>");
      $(this).append(copySpanEle);
      copySpanEle.click((e) => {
        e.stopPropagation();
        const copyText = _handleHtml($(this).closest(".forum-post").find(".retext").html());
        insetCustomContent(copyText, ".centered-container .retextarea");
        scrollToEle(".centered-container .retextarea", 80);
        setTimeout(() => {
          getUserSetting("huifuCopyAutoSubmit") && $(".kuaisuhuifu input").trigger("click");
        }, 150);
      });
    });
  } else {
    // 旧版回帖
    $(".recontent .reline.list-reply .redate").each(function () {
      const copySpanEle = $("<span class='v2jun-huifu-copy'>+1</span>");
      $(this).prepend(copySpanEle);
      copySpanEle.click((e) => {
        e.stopPropagation();
        const copyText = _handleHtml($(this).closest(".reline.list-reply").find(".retext").html());
        insetCustomContent(copyText, ".centered-container .retextarea");
        scrollToEle(".centered-container .retextarea", 80);
        setTimeout(() => {
          getUserSetting("huifuCopyAutoSubmit") && $(".kuaisuhuifu input").trigger("click");
        }, 150);
      });
    });
  }
  function _handleHtml(retextHtml) {
    // 创建一个临时的 div 来解析 HTML 内容
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = retextHtml;
    // 缓存标签处理方法
    const tagHandlers = new Map([
      ["img", (node) => `[img]${node.getAttribute("src")}[/img]`],
      ["audio", (node) => `[audio]${node.getAttribute("src")}[/audio]`],
      ["video", (node) => `[movie]${node.getAttribute("src")}[/movie]`],
      [
        "a",
        (node) => {
          const href = node.getAttribute("href");
          const text = node.textContent.trim();
          // 如果链接文本和URL相同，只输出URL
          return href === text ? text : `[url=${href}]${text}[/url]`;
        }
      ],
      [
        "font",
        (node) => {
          const color = node.getAttribute("color");
          const text = node.textContent.trim();
          // 如果链接文本和URL相同，只输出URL
          return `[forecolor=${color}]${text}[/forecolor]`;
        }
      ]
    ]);
    // 节点处理
    const processNode = (node) => {
      // 文本节点直接返回内容
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }
      // 元素节点处理
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        const handler = tagHandlers.get(tagName);
        // 如果有对应的处理器，直接处理
        if (handler) {
          return handler(node);
        }
        // 其他元素，字符串拼接
        if (node.childNodes.length) {
          return Array.from(node.childNodes).map(processNode).join("");
        }
      }
      return "";
    };
    // 字符串拼接
    return Array.from(tempDiv.childNodes).map(processNode).join("");
  }
}
// 隐藏楼主勋章
function hideXunzhang() {
  $(".xunzhang").remove();
}
// 一键吃肉
function speedEatMoney() {
  const vBtn = $("<span class='v2jun-custom-toggle-btn'>一键吃肉</span>");
  vBtn.click(() => {
    const isPaibi = $("div").hasClass("paibi");
    if (isPaibi) {
      const shengyuNum = $(".paibi .yushuzi").text();
      if (shengyuNum > 0) {
        const eatWordsArr = [
          "吃",
          "吃吃",
          "吃吃.",
          "吃吃。",
          "吃吃..",
          "吃吃。。",
          "吃了",
          "吃肉",
          "来吃肉",
          "吃.",
          "吃。",
          "吃了.",
          "吃了。",
          "吃肉.",
          "吃肉。",
          "来吃肉.",
          "来吃肉。",
          "吃..",
          "吃。。",
          "吃了..",
          "吃了。。",
          "吃肉..",
          "先吃肉"
        ];
        const index = Math.floor(Math.random() * eatWordsArr.length);
        insetCustomContent(eatWordsArr[index], ".centered-container .retextarea", true);
        setTimeout(() => {
          $(".kuaisuhuifu input").trigger("click");
        }, 300);
      } else {
        notifyBox("已经没有肉了，错过了一个亿~", false);
      }
    } else {
      notifyBox("不是派币贴，你吃个 der", false);
    }
  });
  $(".viewContent .kuaisuhuifu").append(vBtn);
}
// 查询吹牛发布者历史大话选项
async function chuiniuHistory() {
  const elementsWithText = $("body").find(":contains('自己挑战的只能由其它友友应战！')");
  if (elementsWithText.length > 0) return;

  // 创建胜率结果显示容器，写入提示信息
  $(
    `<p id="chuiniuWinningEle" style="background:#f0f9eb;color:gray;text-align:center;margin:0 auto;padding:0 20px;">历史记录获取中...</p>`
  ).insertBefore($(".subtitle"));

  const userinfoEle = $('a[href*="userinfo.aspx"]');
  const chuiniuQueUserId = getUrlParam("touserid", userinfoEle.attr("href")); // 发布者ID
  const chuiniuQueUserNickname = userinfoEle.text(); // 发布者昵称
  const queHistoryArr = Array.from(await getQueUserHistoryArr(chuiniuQueUserId)); // 发布者历史大话ID

  if (queHistoryArr.length > 0) {
    //  获取成功
    const queHistoryAnswers = await Promise.all(queHistoryArr.map(getChuiniuAnswer));
    const countAnswer1 = queHistoryAnswers.filter((v) => v === "1").length;
    const countAnswer2 = queHistoryAnswers.filter((v) => v === "2").length;
    $("#chuiniuWinningEle")
      .css({
        "text-align": "left"
      })
      .html(
        `“<span style="color:#3d68a8;">${chuiniuQueUserNickname}</span>”最近<span style="color:blue;font-weight:bold;">${queHistoryAnswers.length}</span>次已完成大话选项：答案<span style="color:blue;font-weight:bold;">1</span>次数：<span style="color:red;font-weight:bold;">${countAnswer1}</span>,答案<span style="color:blue;font-weight:bold;">2</span>次数： <span style="color:red;font-weight:bold;">${countAnswer2}</span>`
      );
  } else {
    // 获取失败
    $("#chuiniuWinningEle").html(`<span style="color:red;">未知错误，获取历史数据失败，请私信反馈</span>`);
  }

  // 获取指定大话答案
  async function getChuiniuAnswer(chuiniuId) {
    const chuiniuRes = await getPageContent(`/games/chuiniu/book_view.aspx?id=${chuiniuId}`);
    const ansRule1 = chuiniuRes.match(/挑战方出的是\[答案1\]/);
    const ansRule2 = chuiniuRes.match(/挑战方出的是\[答案2\]/);
    if (ansRule1) return "1";
    if (ansRule2) return "2";
  }
  // 获取对方大话指定条数历史记录ID
  async function getQueUserHistoryArr(toUserId, computeTotal = 15) {
    return new Promise(async (resolve, reject) => {
      const idArr = new Set(); // 存放大话ID，利用Set特性去重(翻页时会有重复项出现，非本脚本bug)
      let historyPage = 1; // 翻页，达到预设值时停止

      const historyText = await getPageContent(`/games/chuiniu/book_list.aspx?type=0&touserid=${toUserId}`);
      const userHistoryTotal = historyText.slice(historyText.indexOf("页，共 ") + 4, historyText.indexOf(" 条")); // 吹牛历史总条数

      const getQueUserHistoryid = async () => {
        const tempElements = $(historyText).filter(".line1, .line2");
        for (const line of tempElements) {
          const idLink = line.querySelector('a[href*="book_view.aspx"]');
          if (idLink && !line.textContent.includes("进行中")) {
            const dahuaId = getUrlParam("id", idLink.href);
            if (dahuaId) idArr.add(dahuaId);
            if (idArr.length >= computeTotal) break;
          }
        }
        if (idArr.length < 15 && userHistoryTotal > 15) {
          historyPage++;
          getQueUserHistoryid();
        } else {
          resolve(idArr);
        }
      };
      getQueUserHistoryid();
    });
  }
}
// 一键回到顶部/底部，在原作者基础上做了删减、改动，原作者发布地址：https://greasyfork.org/zh-CN/scripts/38899-回到顶部-底部
function addTopAndDown() {
  if (window.self != window.top) return;

  function ce(n) {
    return document.createElement(n);
  }

  function addStyle(css) {
    let head = document.head || document.getElementsByTagName("head")[0];
    if (head) {
      let style = ce("style");
      style.type = "text/css";
      style.appendChild(document.createTextNode(css));
      head.appendChild(style);
    }
  }

  let el = navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("MSIE") != -1 ? document.documentElement : document.body,
    t1,
    t2,
    speed_by_click = 200,
    zIindex = 1001;

  function getDocumentHeight() {
    return document.body.scrollHeight > document.body.offsetHeight ? document.body.scrollHeight : document.body.offsetHeight;
  }

  function get_scroll(a) {
    let d = document,
      b = d.body,
      e = d.documentElement,
      c = "client" + a,
      f = "scroll" + a;
    return /CSS/.test(d.compatMode) ? e[c] < e[f] : b[c] < b[f];
  }

  function scrollTo(element, to, duration) {
    (start = document.documentElement.scrollTop || document.body.scrollTop),
      (change = to - start),
      (currentTime = 0),
      (increment = 20),
      (newDuration = typeof duration === "undefined" ? 500 : duration);

    let animateScroll = function () {
      currentTime += increment;
      let val = Math.easeInOutQuad(currentTime, start, change, newDuration);
      window.scrollTo(0, val);
      if (currentTime < newDuration) {
        setTimeout(animateScroll, increment);
      }
    };
    animateScroll();
  }

  Math.easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  function shareCSS() {
    let s = "",
      img_up,
      img_dn;

    img_up =
      "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAYAAACAl21KAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB+SURBVDhPY1i1atV/amAGahgCMoNhaIGlS5cKAp19BoRBbLJcj2QILDJINwzoAmMgfoclIkBixkS5DI8hMJcRNgxoSBoOl6CnNZBhaVhdBjWE1MSJahjQkA4KEmYH2GUrV66cSYEhYB+AzKBtFiHkQqKiH6Ro1CDCQTWgYQQAs81DU0G/83sAAAAASUVORK5CYII=";
    img_dn =
      "data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAUCAYAAACAl21KAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACPSURBVDhPY2DAAlatWvUfH8amB6vYqEGEg2pgw4iQ7cTKM6xcuXImsYpxqQOZAQ4woIIOCgzrQAl1oEFpZBiWhitFgwx7R4SBIDXYDYGZDFRgTMAwkCHGhBMRJMxwGUa8ITCbli5dKgg08AySN8+AxIhyCboiJMPIN4Qsm6miiYioxltawvSDYogohYTUAQC80UNTOht/YwAAAABJRU5ErkJggg==";
    s +=
      "#play_btn_up { position:fixed; right:0; top:54%;z-index:" +
      zIindex +
      "; height:40px; width:36px; cursor:pointer; background:url(" +
      img_up +
      ") no-repeat scroll 50% 50% rgba(0, 0, 0, 0.7); border-radius:5px 0 0 5px; margin-top:-24px; }";
    s +=
      "#play_btn_dn { position:fixed; right:0; top:60%;   z-index:" +
      zIindex +
      "; height:40px; width:36px; cursor:pointer; background:url(" +
      img_dn +
      ") no-repeat scroll 50% 50% rgba(0, 0, 0, 0.7); border-radius:5px 0 0 5px; margin-top:-24px; }";

    s +=
      ".play_btn { -webkit-transition-duration:0.5s linear; -o-transition-duration:0.5s linear; -moz-transition-duration:0.5s linear; transition-duration:0.5s linear; opacity:0.65; }";
    s += ".play_btn:hover { opacity:1; }";

    addStyle("" + s);
  }

  function create_btn_element() {
    let up,
      dn,
      scrolled,
      h = get_scroll("Height");
    if (!h) {
      return;
    }
    shareCSS();

    if (el) {
      up = ce("span");
      dn = ce("span");
      up.setAttribute("id", "play_btn_up");
      dn.setAttribute("id", "play_btn_dn");
      up.className = "play_btn";
      dn.className = "play_btn";
      document.body.appendChild(up);
      document.body.appendChild(dn);

      scrolled = window.pageYOffset || document.documentElement.scrollTop;
      up.style.display = scrolled > 0 ? "" : "none";

      up.addEventListener(
        "mouseout",
        function () {
          clearTimeout(t1);
        },
        false
      );
      dn.addEventListener(
        "mouseout",
        function () {
          clearTimeout(t2);
        },
        false
      );
      up.addEventListener(
        "click",
        function () {
          scrollTo(el, 0, speed_by_click);
        },
        false
      );
      dn.addEventListener(
        "click",
        function () {
          scrollTo(el, getDocumentHeight(), speed_by_click);
        },
        false
      );

      window.onscroll = function () {
        let scrolled = document.documentElement.scrollTop,
          diffHeight = document.body.scrollHeight - window.innerHeight;
        up.style.display = scrolled > 0 ? "" : "none";
        dn.style.display = diffHeight > scrolled ? "" : "none";
      };
    }
  }

  create_btn_element();
}

// 生成设置相关内容
function createScriptSetting() {
  createIcon();



/*
  function createIcon() {
    // 页面内设置按钮，避免icon被设置为 0 时无法重置设置
    $(".subtitle2")
      .append("<span style='color:red;margin-left:15px;font-weight:bold;'>脚本设置</span>")
      .find("span")
      .click(() => {
        createPopupContainer();
      });

    const windowWidth = $(window).width();
    const bodyContentWidth = $("body").width();
    const iconSize = getUserSetting("settingIconSize") + "px";
    $("<img>")
      .attr("id", "settingICon")
      .attr("src", `${settingIconBase64}`)
      .css({
        "position": "fixed",
        "top": "10px",
        "right": "10px",
        "width": iconSize,
        "height": iconSize,
        "z-index": 9998
      })
      .appendTo("body")
      .click(() => {
        createPopupContainer();
      });
    // PC端设置右偏移量
    if (windowWidth > bodyContentWidth) {
      const rightOffset = (windowWidth - bodyContentWidth) / 2 + 10;
      $("#settingICon").css("right", rightOffset + "px");
    }
  }
*/
}

// 初始化本地设置文件(存放于localStorage，清除浏览器缓存会让设置失效)
function initSetting() {
  return new Promise((resolve) => {
    const localSetting = JSON.parse(localStorage.getItem("yaohuoBetterPlusSetting")) || {};
    const saveSetting = {
      ...defaultSetting,
      ...localSetting
    }; // 合并设置，自定义项覆盖默认选项，避免添加新功能时已缓存设置没有新功能相关从而产生bug
    try {
      localStorage.setItem("yaohuoBetterPlusSetting", JSON.stringify(saveSetting));
      console.log("======> [ 已成功初始化设置 ]");
      resolve(true);
    } catch (error) {
      notifyBox("未知错误，初始化设置失败，请联系作者反馈bug…");
      resolve(false);
    }
  });
}

// 判断是否是在网站中（有些手机端浏览器无法识别油猴 @match 标识，导致在所有网站都会执行脚本）
function checkLocation() {
  const currentHost = window.location.host;
  const targetHostArr = ["yaohuo.me", "www.yaohuo.me"];

  if (targetHostArr.includes(currentHost)) return true;
  else return false;
}

/* ================================================== 自定义方法开始 ================================================== */

// 监听评论区加载
function listenRecontentLoad() {
  _waitFunc();
  // 监听新 .recontent 元素加载，以此判断评论区加载更多是否完成
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if ($(mutation.addedNodes).hasClass("recontent") || $(mutation.addedNodes).find(".recontent").length) {
        // console.log("======> [ 评论区加载更多完成  ]");
        _waitFunc();
      }
    });
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  function _waitFunc() {
    getUserSetting("useUserBlackList") && handleUserBlacklist();
    executeFunctionForURL(/^(\/bbs-.*\.html(\?.*)?|\/bbs\/view\.aspx\?.*id=\d+.*)$/i, imgCustomProcess);
    getUserSetting("showHuifuCopy") && executeFunctionForURL(/^(\/bbs-.*\.html(\?.*)?|\/bbs\/view\.aspx\?.*id=\d+.*)$/i, huifuCopy);
  }
}
// 加载并执行远程js文件，将其存入 localstorage
function loadAndExecuteScript(url, loaclStorageKey) {
  return new Promise((resolve) => {
    const cacheScript = localStorage.getItem(loaclStorageKey);
    if (cacheScript && cacheScript.length > 0) {
      executeScript(cacheScript); // 执行缓存 js
      resolve(true);
    } else {
      fetch(url) // 加载远程 js
        .then((response) => response.text())
        .then((fetchScriptContent) => {
          executeScript(fetchScriptContent);
          localStorage.setItem(loaclStorageKey, fetchScriptContent);
          resolve(true);
        })
        .catch((err) => {
          notifyBox("未知错误，Jquery 加载失败，请刷新重试…", false);
          resolve(false);
        });
    }
  });
}
// 执行指定内容 js 代码
function executeScript(scriptContent) {
  const script = document.createElement("script"); // 创建script元素
  script.text = scriptContent; // 设置脚本内容
  document.head.appendChild(script); // 执行脚本
}
// 解析直播url
async function getZbPlayUrl(url, callback) {
  if (url.includes("douyin")) {
    const res = await myAjax("https://i.qdqqd.com/", {
      dyzbjx: url
    });
    if (res?.HD?.length > 0) callback(res.HD);
    else if (res?.LD?.length > 0) callback(res.LD);
    else callback(false);
  } else if (url.includes("kuaishou")) {
    const res = await myAjax("https://i.qdqqd.com/", {
      kszbjx: url
    });
    if (res?.HD?.length > 0) callback(res.HD);
    else if (res?.LD?.length > 0) callback(res.LD);
    else callback(false);
  } else {
    notifyBox("不支持的链接", false);
    callback(false);
  }
}
// 解析视频url
async function getVideoPlayUrl(url, callback) {
  if (url.includes("douyin")) {
    const res = await myAjax("https://i.qdqqd.com/", {
      dyjx: url
    });
    if (res?.video?.length > 0) callback(res.video);
    else callback(false);
  } else if (url.includes("kuaishou")) {
    const res = await myAjax("https://i.qdqqd.com/", {
      ksjx: url
    });
    if (res?.video?.length > 0) callback(res.video);
    else callback(false);
  } else if (url.includes("bilibili")) {
    const res = await myAjax("https://i.qdqqd.com/", {
      dyjx: url
    });
    if (res?.video?.length > 0) callback(res.video);
    else callback(false);
  } else if (url.includes("tiktok")) {
    const res = await myAjax("https://i.qdqqd.com/", {
      tiktokjx: url
    });
    if (res?.video?.length > 0) callback(res.video);
    else callback(false);
  } else {
    notifyBox("不支持的链接", false);
    callback(false);
  }
}

/**
 * 上传文件到指定api
 * @param {*} url api地址
 * @param {*} type 请求方法
 * @param {*} data 上传文件数据
 * @param {*} success 成功回调
 * @param {*} error 失败回调
 * @param {*} options 其他参数
 */
function uploadFiles({ url, type = "POST", data, success = () => { }, error = () => { }, options = {} } = {}) {
  $.ajax({
    url,
    type,
    data,
    contentType: false,
    processData: false,
    dataType: "json",
    ...options,
    success,
    error
  });
}

// 生成输入内容域
function showInputPopup(inputTitle, callback) {
  // 创建蒙版
  const mask = $('<div class="v2jun-input-popup-mask"></div>');
  mask.click(function (event) {
    if (event.target === mask[0]) {
      mask.remove();
      callback(null);
    }
  });
  // 创建弹出框
  const popup = $('<div class="v2jun-input-popup"></div>');
  // 创建输入框
  for (let i = 0; i < inputTitle.length; i++) {
    const inputBox = $(
      '<div class="v2jun-input-popup-input"><label class="v2jun-input-popup-label">' +
      inputTitle[i] +
      '：</label><textarea class="v2jun-input-popup-textarea" rows="2" placeholder="请输入..."></textarea></div>'
    );
    popup.append(inputBox);
  }
  // 创建按钮容器
  const buttonsContainer = $('<div class="v2jun-input-popup-buttons"></div>');
  // 创建取消按钮
  const cancelBtn = $('<button class="v2jun-input-popup-cancel-btn">取消</button>');
  cancelBtn.click(function () {
    mask.remove();
    callback(null);
  });
  // 创建确定按钮
  const submitBtn = $('<button class="v2jun-input-popup-submit-btn">确定</button>');
  submitBtn.click(function () {
    const inputs = $(".v2jun-input-popup-textarea");
    const inputValues = [];
    inputs.each(function () {
      inputValues.push($(this).val());
    });
    mask.remove();
    callback(inputValues);
  });
  // 将按钮添加到按钮容器
  buttonsContainer.append(cancelBtn);
  buttonsContainer.append(submitBtn);
  // 将按钮容器添加到弹出框
  popup.append(buttonsContainer);
  // 将弹出框添加到蒙版
  mask.append(popup);

  // 将蒙版添加到页面
  $("body").append(mask);
}

// 判断是否为pc端浏览器打开
function isPC() {
  let userAgentInfo = navigator.userAgent;
  let mobileAgents = ["Android", "iPhone", "iPad", "iPod", "Windows Phone"];
  let isPC = true;
  for (let i = 0; i < mobileAgents.length; i++) {
    if (userAgentInfo.indexOf(mobileAgents[i]) > -1) {
      isPC = false;
      break;
    }
  }
  return isPC;
}

// 滚动页面到指定标签，并显示在屏幕中间
function scrollToEle(toEle, animateTime = 500) {
  const targetElement = $(toEle); // 使用适当的选择器选择目标元素
  const windowHeight = $(window).height(); // 获取窗口的高度
  const elementOffset = targetElement.offset().top; // 获取目标元素相对于文档顶部的偏移量
  const offset = elementOffset - windowHeight / 2; // 计算滚动的偏移量

  $("html, body").animate(
    {
      scrollTop: offset
    },
    animateTime
  ); // 平滑滚动到计算的偏移量位置
}

// Ajax 请求
function myAjax(url, data, options, type = "get") {
  return new Promise((resolve, reject) => {
    $.ajax({
      url,
      type,
      data,
      ...options,
      success: (response) => {
        resolve(response);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

// 生成指定长度随机字符串
function generateRandomString(length) {
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    let randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  return randomString;
}

/**
 * 指定元素被点击*次后执行指定函数
 * @param {*} clickEle 指定元素
 * @param {*} callback 回调函数
 * @param {*} clickLimit 点击次数
 * @param {*} timeLimit 连续点击限制时间，单位/s
 */
function clickCounter(clickEle, callback, clickLimit = 3, timeLimit = 1) {
  $(clickEle).on("click", function () {
    let $button = $(this);
    let clickCount = $button.data("clickCount") || 0; // 获取点击次数，如果不存在则默认为0
    clickCount++; // 点击次数加1
    $button.data("clickCount", clickCount); // 存储点击次数

    if (clickCount === 1) {
      // 如果是第一次点击
      $button.data(
        "timeout",
        setTimeout(function () {
          $button.removeData("clickCount"); // 超时后移除点击次数数据
        }, timeLimit * 1000)
      ); // 设置时间窗口，单位为毫秒
    } else if (clickCount === clickLimit) {
      // 如果点击次数达到设定的限制
      clearTimeout($button.data("timeout")); // 清除超时
      $button.removeData("clickCount"); // 清除点击次数数据
      callback(); // 执行指定的回调函数
    }
  });
}
// 向页面中添加指定样式
function addCustomStyle() {
  // console.log("%c ===> [ 添加自定义样式 ] <===", "font-size:13px; background:pink; color:#bf2c9f;");
  $("<style>").text(customCSS).appendTo("head");

  $("head").append(`<style>.img-thumb{max-width:${getUserSetting("imgThumbWidth")}px;display: block;}`); // 将图片缩小样式添加到页面中
}
/**
 * 防抖
 * @param {*} func
 * @param {*} delay
 * @returns
 */
function debounce(func, delay = 800) {
  console.log("%c ===> [ 节流函数开始运行 ] <===", "font-size:13px; background:pink; color:#bf2c9f;");
  let timeoutId;

  return function () {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, arguments);
    }, delay);
  };
}

/**
 * 在指定textarea/input当前光标处插入内容
 * @param {*} content 插入内容
 * @param {String} targetEle 插入目标 element(jquery可使用的选择器)
 * @param {Boolean} notFocus 忽略用户设置，强行不聚焦
 */
function insetCustomContent(content, targetEle, notFocus = false) {
  const textarea = $(targetEle); // 获取目标元素
  const textareaContent = textarea.val(); // 获取当前内容
  if (getUserSetting("textareaAutoFocus") && !notFocus) {
    const cursorPosition = textarea[0].selectionStart; // 获取当前光标位置
    const newValue = textareaContent.slice(0, cursorPosition) + content + textareaContent.slice(cursorPosition); // 将内容插入当前光标处。如果未选择输入框则插入最后
    textarea.val(newValue); // 写入完整内容
    // 将光标移到插入内容的最后
    textarea[0].selectionStart = cursorPosition + content.length;
    textarea[0].selectionEnd = cursorPosition + content.length;
    textarea.focus();

    console.log('autoCloseBookViewEmoji', getUserSetting("autoCloseBookViewEmoji"));
    console.log('autoCloseHuifuEmoji', getUserSetting("autoCloseHuifuEmoji"));
    getUserSetting("autoCloseBookViewEmoji") &&
      $(".v2jun-emojilist-div.bookview-emoji").css("display", "none") &&
      $(".v2jun-custom-toggle-btn.view-emoji-toggle").text("表情 展开") &&
      saveUserSetting("showBookViewEmoji", false);
    getUserSetting("autoCloseHuifuEmoji") &&
      $(".v2jun-emojilist-div.v2jun-huifu-emoji").css("display", "none") &&
      $(".v2jun-custom-toggle-btn.v2jun-huifu-emoji-toggle").text("表情 展开") &&
      saveUserSetting("showHuifuEmoji", false);
  } else {
    textarea.val(textareaContent + content); // 追加到文本末尾
  }
}

/**
 * 当前页面为指定 url 时执行函数
 * @param {*} targetPath 指定 url，可为正则表达式
 * @param {Function} executeFunction 执行函数
 */
function executeFunctionForURL(targetPath, executeFunction) {
  if (!targetPath || targetPath.length === 0) throw new Error("传入路径无效！");
  if (typeof executeFunction !== "function") throw new Error("传入函数无效！");

  const currentPath = window.location.pathname + window.location.search;
  if (targetPath instanceof RegExp) {
    targetPath.test(currentPath) && executeFunction();
  } else {
    currentPath.includes(targetPath) && executeFunction();
  }
}

// 从指定url获取get参数`
function getUrlParam(paramName, targetUrl = window.location.href) {
  try {
    let urlObj = new URL(targetUrl, window.location.origin);
    return urlObj.searchParams.get(paramName);
  } catch (error) {
    console.error("无效的URL:", targetUrl, error);
    return null;
  }
}
// 获取指定页面内容
function getPageContent(path, method = "GET") {
  const url = `${window.location.origin}${path}`;
  return new Promise((resolve, reject) => {
    $.ajax({
      url,
      method,
      dataType: "html",
      success: (response) => {
        resolve(response);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

// 设置保存
function saveUserSetting(setName, setValue) {
  let cacheSetting = JSON.parse(localStorage.getItem("yaohuoBetterPlusSetting"));
  cacheSetting[setName] = setValue;
  try {
    localStorage.setItem("yaohuoBetterPlusSetting", JSON.stringify(cacheSetting));
    // notifyBox(successMsg);
  } catch (error) {
    // notifyBox(errorMsg, false);
    throw new Error("未知错误，保存设置失败");
  }
}
// 设置获取
function getUserSetting(name) {
  try {
    const userSetting = JSON.parse(localStorage.getItem("yaohuoBetterPlusSetting"));
    if (!userSetting) return defaultSetting[name];
    else return userSetting[name] !== undefined ? userSetting[name] : defaultSetting[name];
  } catch (error) {
    notifyBox("未知错误，获取用户设置失败", false);
    throw new Error("未知错误，获取设置失败");
  }
}
// 等待提示框
function showWaitBox(msg) {
  const overlay = $('<div class="v2jun-wait-box-overlay"></div>');
  const modal = $('<div class="v2jun-wait-box-modal"></div>');
  modal.append('<div class="v2jun-wait-box-spinner"></div>');
  modal.append(`<span class="wait-box-text">${msg}</span>`);
  overlay.append(modal);
  $("body").append(overlay);
  overlay.on("click", function (e) {
    e.stopPropagation();
  });
  return overlay;
}

/**
 * 弹出提示
 * @param {String} message 提示内容
 * @param {Boolean} status 提示状态，true成功，false失败，默认true
 * @param {Number} delayTime 提示时间/ms，默认1500ms
 */
let offsetY = 0; // 消息框初始垂直偏移量
function notifyBox(message, status = true, delayTime = 1500) {
  // 消息父容器
  const containerDiv = $("<div>")
    .css({
      "position": "fixed",
      "top": `calc(100px + ${offsetY}px)`,
      "left": "50%",
      "transform": "translateX(-50%)",
      "width": "350px",
      "max-width": "80%",
      "text-align": "center",
      "z-index": 9999
    })
    .appendTo("body");
  // 消息框创建
  const messageDiv = $("<div>")
    .text(message)
    .css({
      "background": status ? "#f0f9eb" : "#fef0f0",
      "color": status ? "#67c23a" : "#f56c6c",
      "padding": "5px 20px",
      "box-shadow": "0 2px 4px rgba(0, 0, 0, 0.2)",
      "white-space": "normal",
      "wordWrap": "break-word",
      "overflowWrap": "break-word",
      "hyphens": "auto",
      "border-radius": "5px",
      "max-width": "100%" // 设置消息框的最大宽度
    })
    .appendTo(containerDiv);
  // 延迟后消息框销毁
  messageDiv
    .fadeIn()
    .delay(delayTime)
    .fadeOut(function () {
      containerDiv.remove();
      offsetY -= 50; // 删除后减少50px的垂直偏移量
    });

  offsetY += 50; // 增加消息框的高度和间距
}

/* ================================================== 自定义方法结束 ================================================== */
