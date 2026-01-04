// ==UserScript==
// @name                 qk文章资源共享｜CSDN｜专栏｜会员文章｜C知道｜文件下载｜CSDN积分
// @namespace            https://zsh5.qktk.online/
// @version              0.2.1-beta
// @icon                 data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMjAwMTA5MDQvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvVFIvMjAwMS9SRUMtU1ZHLTIwMDEwOTA0L0RURC9zdmcxMC5kdGQiPg0KPHN2ZyB2ZXJzaW9uPSIxLjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIHZpZXdCb3g9IjAgMCAzODkgMzk1IiBzdHlsZT0iIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBtZWV0Ij4NCjxnIGZpbGw9IiNGM0RCQzhGRiIgc3Ryb2tlPSIjRjNEQkM4RkYiPg0KPHBhdGggZD0iTSAxODIuNTAwIDQ0LjEwOSBDIDE2NS4zNTIgNDYuNTgwIDE0NC4xODUgNTUuNDMyIDEzMC4xNjQgNjUuOTk3IEMgMTExLjQwMiA4MC4xMzUgOTguMDk0IDEwMS4zNTAgOTIuNDYwIDEyNi4xMDQgQyA5MS4wNjUgMTMyLjIzNCA5MC42OTIgMTQxLjIxMiA5MC4yODMgMTc4LjU2NCBDIDg5Ljc5MyAyMjMuMjc4IDkwLjQ5OCAyNDEuMzU0IDkzLjExMyAyNTEuMTMxIEMgOTQuMjk0IDI1NS41NTAgOTQuMjEyIDI1NS45NjMgOTEuMDMxIDI2MS42MTUgQyA4MS4yMTkgMjc5LjA0NyA2OC44MzIgMjg5LjI4OCA1Mi4zNzMgMjkzLjU3NSBDIDQ1LjcwOSAyOTUuMzExIDQzLjU4OSAyOTYuOTI4IDQwLjc5MCAzMDIuNDEzIEMgMzcuOTkwIDMwNy45MDAgMzguNTYxIDMxOC4yNzcgNDEuOTM1IDMyMy4yMDAgQyA0Ni4wMTcgMzI5LjE1OCA1MC4zNjUgMzMxLjQyOSA1OC40NzMgMzMxLjgzOCBDIDY0LjE3NCAzMzIuMTI2IDY3LjA4NSAzMzEuNjkyIDcyLjgyNCAzMjkuNjk2IEMgODcuMDIyIDMyNC43NTggMTAzLjYyNSAzMTEuOTAzIDExMi4xNDcgMjk5LjI0OCBMIDExNS42NDYgMjk0LjA1MyAxMTkuNTczIDI5OC4xMjMgQyAxMzIuNTI2IDMxMS41NDcgMTUxLjg1NyAzMjEuNjExIDE3NC4wMDAgMzI2LjQ1NyBDIDE4NS43MzcgMzI5LjAyNiAyMDUuNjY5IDMyOS41NDkgMjE2LjkzNiAzMjcuNTgzIEMgMjIyLjEyNiAzMjYuNjc3IDIyNi44OTIgMzI1LjUwNCAyMjcuNTI4IDMyNC45NzcgQyAyMjguMTY0IDMyNC40NDkgMjI4LjkyMyAzMjQuMjU2IDIyOS4yMTUgMzI0LjU0OCBDIDIyOS41MDcgMzI0Ljg0MCAyMzIuNjIxIDMyMy45OTYgMjM2LjEzNiAzMjIuNjczIEMgMjUwLjg5MCAzMTcuMTIwIDI2My4zNjIgMzA5LjM5NiAyNzIuNDYwIDMwMC4xNzYgTCAyNzcuNDIwIDI5NS4xNTAgMjgwLjg4NiAzMDAuMzI1IEMgMjg4LjY3NSAzMTEuOTU1IDMwMi4xNTcgMzIyLjUxMSAzMTYuNTAwIDMyOC4yMTAgQyAzMjMuNDgzIDMzMC45ODQgMzI1LjcyOCAzMzEuMzk1IDMzNC4xNTUgMzMxLjQ0NCBDIDM0My40NTggMzMxLjQ5OCAzNDMuOTUyIDMzMS4zODggMzQ3LjY1NSAzMjguNDQyIEMgMzUyLjc3MyAzMjQuMzcyIDM1Ni4wMDAgMzE3Ljg5MiAzNTYuMDAwIDMxMS42ODkgQyAzNTYuMDAwIDMwMS45NjkgMzUwLjUzNiAyOTUuNTczIDMzOS4zMjUgMjkyLjE2NyBDIDMyNi45NzYgMjg4LjQxNyAzMTMuNjE5IDI3Ny41NTcgMzA2LjU4MCAyNjUuNTQ1IEwgMzAzLjgyMyAyNjAuODQyIDMwNS42NjIgMjUzLjY3MSBDIDMwNy4zNDcgMjQ3LjA5OCAzMDcuNDk5IDI0MS41MDAgMzA3LjQ4NyAxODYuNTAwIEwgMzA3LjQ3NCAxMjYuNTAwIDMwNC44MDUgMTE2Ljc5MiBDIDI5NC4wODggNzcuODA3IDI2MC44MzggNTAuMDkxIDIxNy41NjYgNDQuMDcyIEMgMjA4LjY2NSA0Mi44MzQgMTkxLjIxNiA0Mi44NTIgMTgyLjUwMCA0NC4xMDkgTSAyMTcuNDM0IDg0LjU5NCBDIDIzNy43NDMgODkuNTg2IDI1Mi44MzggMTA0LjQ4NSAyNTcuNDYzIDEyNC4xMDMgQyAyNTguNzA5IDEyOS4zOTAgMjU4Ljk3MyAxMzkuOTcyIDI1OC45ODUgMTg1LjA5MCBDIDI1OC45OTkgMjM1LjgyMCAyNTguODYzIDI0MC4yMTUgMjU3LjA2NSAyNDcuMjQ0IEMgMjUzLjY3NSAyNjAuNTAxIDI0Ni43NjMgMjcxLjI5NyAyMzYuNzM3IDI3OC45OTUgQyAyMzMuODU3IDI4MS4yMDcgMjMwLjkzOCAyODMuNDgwIDIzMC4yNTAgMjg0LjA0OCBDIDIyOS41NjMgMjg0LjYxNSAyMjkuMDAwIDI4NC44OTIgMjI5LjAwMCAyODQuNjY0IEMgMjI5LjAwMCAyODQuNDM1IDIyNS45NjMgMjg1LjM4MiAyMjIuMjUwIDI4Ni43NjcgQyAyMTIuOTkxIDI5MC4yMjMgMTk1LjY2OSAyOTEuMDE1IDE4NC4zMzkgMjg4LjUwMSBDIDE2Ny41MjcgMjg0Ljc3MSAxNTMuMzU1IDI3NC4zMDggMTQ2LjYwMiAyNjAuNjQxIEMgMTM5Ljc0OCAyNDYuNzcwIDEzOS41MDAgMjQ0LjA3MyAxMzkuNTAwIDE4My41MDAgQyAxMzkuNTAwIDEyMy41NzggMTM5LjUxNiAxMjMuNDA3IDE0Ni4zMzQgMTEwLjUxMyBDIDE1Mi4zMzkgOTkuMTU3IDE2Ny4yNjAgODcuNTQzIDE3OC41NzAgODUuNDIxIEMgMTgwLjQ1NyA4NS4wNjcgMTgyLjAwMCA4NC4zNTEgMTgyLjAwMCA4My44MzAgQyAxODIuMDAwIDgzLjMwOCAxODIuMzYxIDgzLjEwNSAxODIuODAyIDgzLjM3OCBDIDE4My4yNDMgODMuNjUwIDE4Ni43MzAgODMuNDk0IDE5MC41NTIgODMuMDMwIEMgMTk4Ljk0NCA4Mi4wMTMgMjA5LjQwNiA4Mi42MjEgMjE3LjQzNCA4NC41OTQgIi8+PC9nPg0KPC9zdmc+DQo=
// @description          🐚🐚功能介绍🐚🐚：🔥csdn，去除广告🔥，🔥免登陆复制，查看全文🔥，控制登陆弹窗频次，文件下载，🔥解析csdn会员文章🔥，🔥超级会员文章🔥，专栏🔥
// @author               佚名
// @match                *://*.blog.csdn.net/*
// @match                *://download.csdn.net/*
// @match                *://wenku.csdn.net/*
// @connect              csdnimg.cn
// @connect              csdn.net
// @connect              qktk.online
// @connect              113.45.143.62
// @support              https://scriptcat.org/zh-CN/script-show-page/2474/issue
// @supportUrl           https://scriptcat.org/zh-CN/script-show-page/2474/issue
// @antifeature          payment
// @license              MIT
// @require              https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @require              https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/jszip/3.7.1/jszip.min.js
// @grant                unsafeWindow
// @grant                GM_xmlhttpRequest
// @grant                GM_getValue
// @grant                GM_setValue
// @grant                GM_deleteValue
// @grant                GM_info
// @downloadURL https://update.greasyfork.org/scripts/519970/qk%E6%96%87%E7%AB%A0%E8%B5%84%E6%BA%90%E5%85%B1%E4%BA%AB%EF%BD%9CCSDN%EF%BD%9C%E4%B8%93%E6%A0%8F%EF%BD%9C%E4%BC%9A%E5%91%98%E6%96%87%E7%AB%A0%EF%BD%9CC%E7%9F%A5%E9%81%93%EF%BD%9C%E6%96%87%E4%BB%B6%E4%B8%8B%E8%BD%BD%EF%BD%9CCSDN%E7%A7%AF%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/519970/qk%E6%96%87%E7%AB%A0%E8%B5%84%E6%BA%90%E5%85%B1%E4%BA%AB%EF%BD%9CCSDN%EF%BD%9C%E4%B8%93%E6%A0%8F%EF%BD%9C%E4%BC%9A%E5%91%98%E6%96%87%E7%AB%A0%EF%BD%9CC%E7%9F%A5%E9%81%93%EF%BD%9C%E6%96%87%E4%BB%B6%E4%B8%8B%E8%BD%BD%EF%BD%9CCSDN%E7%A7%AF%E5%88%86.meta.js
// ==/UserScript==

(function() {
  var _a;
  "use strict";
  var __vite_style__ = document.createElement("style");
  __vite_style__.textContent = ".mb8,\n#remuneration,\n#asideWriteGuide,\n#asideAds,\n#asideNewNps,\n#recommendNps,\n#footerRightAds,\n#blogExtensionBox,\n#dmp_ad_58,\n.toolbar-btns .toolbar-btn:not(.toolbar-btn-login),\n.programmer1Box,\n#recommendAdBox,\n.passport-login-tip-container,\n.toolbar-advert,\n.hide-aside,\n.tool-active-list {\n  display: none !important;\n}\n.list-type-box {\n  padding: 0px 4px;\n  background: #21940d;\n  border-radius: 2px;\n  color: #fff;\n  font-weight: 500;\n  font-size: 12px;\n  margin-right: 5px;\n}\n#content_views,\n#content_views pre,\n#content_views pre code {\n  -webkit-user-select: unset;\n  user-select: unset;\n}\n.fixed-bottom::before {\n  height: 178px !important;\n}\n.login-container {\n  padding-top: 20px;\n}\n.login-container .hint {\n  font-size: 12px;\n}\n.login-container .hint.center {\n  text-align: center;\n}\n.login-container .hint .span-btn {\n  margin-left: 0;\n}\n.login-container .span-btn {\n  color: #535bf2;\n  border: 1px dashed #535bf2;\n  border-radius: 4px;\n  padding: 2px 4px;\n  cursor: pointer;\n  font-size: 12px;\n  margin-left: 6px;\n}\n.login-container .span-btn:hover {\n  opacity: 0.8;\n}\n.vip-badge {\n  color: #fff;\n  background: #f5a623;\n  padding: 2px 4px;\n  border-radius: 4px;\n  line-height: 14px;\n  font-size: 12px;\n}\n.note {\n  font-size: 12px;\n  color: #ff5722;\n  background: rgba(255, 87, 34, 0.1);\n  padding: 4px;\n  border-radius: 6px;\n  margin: 6px 0;\n}\n.action-bar {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.qk-dialog-container .active-container {\n  min-height: 200px;\n  background-color: white;\n  border-radius: 12px;\n  margin: auto;\n  padding: 24px;\n  display: flex;\n  align-items: flex-start;\n}\n.qk-dialog-container .active-container h2 {\n  margin: 14px auto 24px;\n}\n.qk-dialog-container .active-container .left {\n  flex: 1;\n  min-width: 250px;\n  max-width: 300px;\n}\n.qk-dialog-container .active-container .right {\n  position: relative;\n  max-width: 180px;\n  margin-left: 30px;\n  text-align: center;\n}\n.qk-dialog-container .active-container .right::before {\n  content: '';\n  position: absolute;\n  display: block;\n  top: 0;\n  bottom: 0;\n  left: -15px;\n  width: 0;\n  border-left: 1px dashed #a8a8a854;\n}\n.qk-dialog-container .active-container .right .title {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin: 12px 0 6px;\n}\n.qk-dialog-container .active-container .right .title .qk_icon_button {\n  margin-left: 6px;\n  line-height: 1;\n}\n.qk-dialog-container .active-container .right .title i {\n  color: #999;\n}\n.qk-dialog-container .active-container .right .title i:hover {\n  color: #3498db;\n}\n.qk-dialog-container .active-container .right .goods-qr {\n  height: 150px;\n  display: block;\n  line-height: 150px;\n  background-color: #f5f5f5;\n  border: 1px solid #e5e5e5;\n  border-radius: 4px;\n  opacity: 1;\n  text-align: center;\n  margin: 0 auto;\n}\n.qk-dialog-container .active-container .tip {\n  font-size: 12px;\n  color: #999;\n  word-break: break-all;\n}\n.logo-icon svg {\n  width: 1em;\n  height: 1em;\n  vertical-align: text-bottom;\n}\n.qk-openvippay {\n  -ms-flex-negative: 0;\n  flex-shrink: 0;\n  width: 180px;\n  height: 40px;\n  border-radius: 20px;\n  border: 1px solid #fc5531;\n  display: block;\n  margin: 0 auto;\n  text-align: center;\n  line-height: 38px;\n  color: #fc5531;\n  font-size: 16px;\n  font-weight: 600;\n  position: relative;\n  background: #fff;\n  cursor: pointer;\n  overflow: hidden;\n}\n.qk-openvippay:hover {\n  background: rgba(252, 85, 49, 0.1);\n}\n.qk-download {\n  width: 112px;\n  overflow: hidden;\n}\n.qk-toast {\n  position: fixed;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  max-width: 500px;\n  padding: 6px 10px;\n  font-size: 14px;\n  background: rgba(0, 0, 0, 0.6);\n  color: #fff;\n  border-radius: 4px;\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);\n  z-index: 999;\n}\n.qk-toast.error {\n  background: #f5222dd6;\n  box-shadow: 0 0 10px #f5222d23;\n}\n.qk-user-panel {\n  position: fixed;\n  top: 10px;\n  right: 10px;\n  width: 250px;\n  border-radius: 12px;\n  background-color: #fff;\n  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);\n  z-index: 9999;\n  min-height: 100px;\n  padding: 24px 12px;\n  padding-top: 32px;\n  transition: transform 0.3s ease;\n}\n.qk-user-panel .close {\n  position: absolute;\n  top: 2px;\n  right: 2px;\n  color: white;\n  line-height: 1;\n}\n.qk-user-panel .close:hover {\n  color: #cccccc;\n}\n.qk-user-panel .version {\n  font-size: 11px;\n  color: #999;\n  text-align: right;\n  position: absolute;\n  bottom: 2px;\n  right: 10px;\n}\n.spirit-qk-icon {\n  position: fixed;\n  right: -10px;\n  top: 50px;\n  width: 44px;\n  height: 34px;\n  display: flex;\n  padding: 6px;\n  align-items: center;\n  box-sizing: border-box;\n  background: linear-gradient(140.91deg, #6dc15e 12.61%, #1c7f0a 76.89%);\n  border-top-left-radius: 17px;\n  border-bottom-left-radius: 17px;\n  cursor: pointer;\n  transition: opacity, transform, width, height 0.3s ease-in-out;\n  color: white;\n  opacity: 0.5;\n  z-index: 9999;\n}\n.spirit-qk-icon svg {\n  width: 24px;\n  height: 24px;\n  color: white;\n  transition: all 0.3s ease-in-out;\n}\n.spirit-qk-icon:active {\n  width: 34px;\n  border-radius: 17px;\n}\n.spirit-qk-icon:hover {\n  opacity: 1;\n  transform: translateX(-10px);\n}\n.spirit-qk-icon:hover svg {\n  width: 28px;\n  height: 28px;\n}\n.qk-notify {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  padding: 8px 8px;\n  padding-right: 32px;\n  line-height: 16px;\n  background-color: #4b4e7d;\n  color: #fff;\n  text-align: center;\n  word-break: break-all;\n  font-size: 12px;\n  border-top-left-radius: 12px;\n  border-top-right-radius: 12px;\n  transition: all 0.25s;\n  overflow: hidden;\n}\n.qk-notify.error {\n  background-color: #e74c3c;\n}\n.qk-notify.success {\n  background-color: #2ecc71;\n}\n.qk-notify.info {\n  background-color: #3498db;\n}\n.qk-notify.warning {\n  background-color: #f39c12;\n}\n.qk-notify .marquee-wrap {\n  width: 100%;\n  animation: marquee-wrap 4s infinite linear;\n}\n.qk-notify .marquee-wrap .span-a {\n  color: #3498db;\n  text-decoration: underline;\n  cursor: pointer;\n}\n.qk-notify .marquee-content {\n  float: left;\n  white-space: nowrap;\n  min-width: 100%;\n  animation: marquee-content 4s infinite linear;\n}\n@keyframes marquee-wrap {\n  0%,\n  30% {\n    transform: translateX(0);\n  }\n  70%,\n  100% {\n    transform: translateX(100%);\n  }\n}\n@keyframes marquee-content {\n  0%,\n  30% {\n    transform: translateX(0);\n  }\n  70%,\n  100% {\n    transform: translateX(-100%);\n  }\n}\n.qk_input {\n  width: 100%;\n  padding: 6px;\n  border: 1px solid #d3d3d3;\n  border-radius: 4px;\n  transition: all 0.3s ease;\n  box-sizing: border-box;\n  line-height: 1;\n}\n.qk_input:hover {\n  border-color: #a0a0a0;\n}\n.qk_input:focus,\n.qk_input:focus-visible {\n  border-color: #3498db;\n  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);\n  outline: none;\n}\n.qk_button {\n  border-radius: 4px;\n  padding: 6px;\n  background: #3498db;\n  color: white;\n  border: none;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  position: relative;\n  line-height: 1.28;\n}\n.qk_button:disabled {\n  background: rgba(33, 150, 243, 0.5);\n  cursor: not-allowed;\n}\n.qk_button.block {\n  display: block;\n  width: 100%;\n}\n.qk_button:hover {\n  transform: translateY(-1px);\n  opacity: 0.9;\n}\n.qk_icon_button {\n  background: none;\n  border: none;\n  color: #3498db;\n  cursor: pointer;\n  padding: 6px;\n  border-radius: 50%;\n  transition: all 0.2s;\n  position: relative;\n  line-height: 1;\n}\n.qk_icon_button:not(:disabled):hover {\n  background: rgba(33, 150, 243, 0.1);\n  transform: none;\n}\n.qk_icon_button.mini {\n  padding: 2px;\n}\n.qk_icon_button:disabled {\n  color: #b1b1b1;\n  cursor: not-allowed;\n}\n.qk_icon_button.tooltip:not(:disabled):hover::after {\n  content: attr(data-tooltip);\n  position: absolute;\n  bottom: 100%;\n  left: 50%;\n  transform: translateX(-50%);\n  background: rgba(0, 0, 0, 0.8);\n  color: white;\n  padding: 4px 8px;\n  border-radius: 4px;\n  font-size: 12px;\n  white-space: nowrap;\n}\n.loading-container {\n  position: relative;\n}\n.loading-container.fill {\n  width: 100%;\n  height: 100%;\n}\n.loading-container.absolute {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n}\n.loading-container .loading-spinner {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background-color: rgba(64, 64, 64, 0.6);\n  z-index: 9;\n  cursor: wait;\n  border-radius: inherit;\n}\n.loading-container .loading-spinner .loading-icon {\n  font-size: 14px;\n  width: 1em;\n  height: 1em;\n  border: 2px solid #ccc;\n  border-top: 2px solid #3498db;\n  border-radius: 50%;\n  animation: spin 1s linear infinite;\n}\n@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.loading-container .loading-spinner .loading-text {\n  margin-left: 4px;\n  font-size: 14px;\n  color: #3498db;\n}\n.qk-form-item {\n  margin-bottom: 12px;\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: stretch;\n  width: 100%;\n}\n.qk-form-item.qk-form-item-has-extra {\n  margin-bottom: 6px;\n}\n.qk-form-item .qk-form-item-label {\n  font-size: 14px;\n  color: #333;\n  margin-bottom: 8px;\n  text-align: left;\n  font-weight: bold;\n  line-height: 1.5rem;\n}\n.qk-form-item .qk-form-item-label.required {\n  color: #e74c3c;\n}\n.qk-form-item .qk-form-item-content {\n  flex: 1;\n  display: flex;\n  justify-content: space-between;\n}\n.qk-form-item .qk-form-item-error {\n  color: #e74c3c;\n  font-size: 12px;\n  margin-top: 4px;\n  line-height: 1;\n  text-align: left;\n}\n.qk-form-item .qk-form-item-help {\n  color: #666;\n  font-size: 12px;\n  margin-top: 4px;\n  line-height: 1;\n  text-align: left;\n}\n.qk-form-item .qk-form-item-extra {\n  color: #666;\n  font-size: 12px;\n  margin-top: 4px;\n  line-height: 1;\n  text-align: left;\n}\n.qk-form-item .error .qk_input {\n  border-color: #e74c3c;\n  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.1);\n}\n.qk-dialog-container {\n  position: fixed;\n  top: 0;\n  width: 100vw;\n  z-index: 9998;\n}\n.qk-dialog-container .mask {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.5);\n}\n.qk-dialog-container .dialog-body {\n  position: fixed;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);\n  border-radius: 12px;\n}\n.qk-dialog-container .dialog-body .close {\n  position: absolute;\n  top: 0;\n  right: 0;\n  color: #cecece;\n  z-index: 11;\n}\n.qk-dialog-container .dialog-body .close:hover {\n  color: white;\n}\n.confirm-wrapper {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  width: 320px;\n  background: #fff;\n  border-radius: 4px;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);\n  z-index: 9999;\n}\n.confirm-wrapper .confirm-box {\n  padding: 20px;\n  text-align: center;\n}\n.confirm-wrapper .confirm-box .confirm-title {\n  font-size: 16px;\n  font-weight: bold;\n  margin-bottom: 20px;\n  color: #333;\n}\n.confirm-wrapper .confirm-box .confirm-content {\n  font-size: 14px;\n  color: #666;\n  line-height: 1.5;\n  margin-bottom: 20px;\n}\n.confirm-wrapper .confirm-box .confirm-btn-wrapper {\n  display: flex;\n  justify-content: space-evenly;\n}\n.confirm-wrapper .confirm-box .confirm-btn-wrapper .confirm-btn {\n  width: 100px;\n  height: 32px;\n  line-height: 30px;\n  border-radius: 4px;\n  border: 1px solid transparent;\n  background-color: #3564bb;\n  color: rgba(255, 255, 255, 0.87);\n  cursor: pointer;\n}\n.confirm-wrapper .confirm-box .confirm-btn-wrapper .confirm-btn:hover {\n  background: #1f4996;\n}\n.confirm-wrapper .confirm-box .confirm-btn-wrapper .confirm-btn.confirm-cancel {\n  background: #9a9a9a;\n  color: #333;\n  border-color: #ccc;\n}\n.confirm-wrapper .confirm-box .confirm-btn-wrapper .confirm-btn.confirm-cancel:hover {\n  background: #eee;\n  color: #666;\n  border-color: #666;\n}\n.info-row {\n  display: flex;\n  align-items: center;\n  /* margin-bottom: 4px; */\n  border-bottom: 1px solid #f8f8f8;\n  padding: 4px 0;\n  font-size: 12px;\n  color: #333;\n  line-height: 1.2;\n}\n.info-label {\n  color: #666;\n  margin-right: 14px;\n}\n.info-value {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n";
  document.head.appendChild(__vite_style__);
  var n, l$1, u$2, i$1, r$1, o$1, e$1, f$2, c$1, s$1, a$1, h$1, p$1 = {}, v$1 = [], y$1 = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, w$1 = Array.isArray;
  function d$1(n2, l2) {
    for (var u2 in l2)
      n2[u2] = l2[u2];
    return n2;
  }
  function g$1(n2) {
    n2 && n2.parentNode && n2.parentNode.removeChild(n2);
  }
  function _(l2, u2, t2) {
    var i2, r2, o2, e2 = {};
    for (o2 in u2)
      "key" == o2 ? i2 = u2[o2] : "ref" == o2 ? r2 = u2[o2] : e2[o2] = u2[o2];
    if (arguments.length > 2 && (e2.children = arguments.length > 3 ? n.call(arguments, 2) : t2), "function" == typeof l2 && null != l2.defaultProps)
      for (o2 in l2.defaultProps)
        void 0 === e2[o2] && (e2[o2] = l2.defaultProps[o2]);
    return m$1(l2, e2, i2, r2, null);
  }
  function m$1(n2, t2, i2, r2, o2) {
    var e2 = { type: n2, props: t2, key: i2, ref: r2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o2 ? ++u$2 : o2, __i: -1, __u: 0 };
    return null == o2 && null != l$1.vnode && l$1.vnode(e2), e2;
  }
  function k$1(n2) {
    return n2.children;
  }
  function x$1(n2, l2) {
    this.props = n2, this.context = l2;
  }
  function S(n2, l2) {
    if (null == l2)
      return n2.__ ? S(n2.__, n2.__i + 1) : null;
    for (var u2; l2 < n2.__k.length; l2++)
      if (null != (u2 = n2.__k[l2]) && null != u2.__e)
        return u2.__e;
    return "function" == typeof n2.type ? S(n2) : null;
  }
  function C$1(n2) {
    var l2, u2;
    if (null != (n2 = n2.__) && null != n2.__c) {
      for (n2.__e = n2.__c.base = null, l2 = 0; l2 < n2.__k.length; l2++)
        if (null != (u2 = n2.__k[l2]) && null != u2.__e) {
          n2.__e = n2.__c.base = u2.__e;
          break;
        }
      return C$1(n2);
    }
  }
  function M(n2) {
    (!n2.__d && (n2.__d = true) && i$1.push(n2) && !$$2.__r++ || r$1 != l$1.debounceRendering) && ((r$1 = l$1.debounceRendering) || o$1)($$2);
  }
  function $$2() {
    for (var n2, u2, t2, r2, o2, f2, c2, s2 = 1; i$1.length; )
      i$1.length > s2 && i$1.sort(e$1), n2 = i$1.shift(), s2 = i$1.length, n2.__d && (t2 = void 0, o2 = (r2 = (u2 = n2).__v).__e, f2 = [], c2 = [], u2.__P && ((t2 = d$1({}, r2)).__v = r2.__v + 1, l$1.vnode && l$1.vnode(t2), O(u2.__P, t2, r2, u2.__n, u2.__P.namespaceURI, 32 & r2.__u ? [o2] : null, f2, null == o2 ? S(r2) : o2, !!(32 & r2.__u), c2), t2.__v = r2.__v, t2.__.__k[t2.__i] = t2, z$1(f2, t2, c2), t2.__e != o2 && C$1(t2)));
    $$2.__r = 0;
  }
  function I(n2, l2, u2, t2, i2, r2, o2, e2, f2, c2, s2) {
    var a2, h2, y2, w2, d2, g2, _2 = t2 && t2.__k || v$1, m2 = l2.length;
    for (f2 = P$1(u2, l2, _2, f2, m2), a2 = 0; a2 < m2; a2++)
      null != (y2 = u2.__k[a2]) && (h2 = -1 == y2.__i ? p$1 : _2[y2.__i] || p$1, y2.__i = a2, g2 = O(n2, y2, h2, i2, r2, o2, e2, f2, c2, s2), w2 = y2.__e, y2.ref && h2.ref != y2.ref && (h2.ref && q$1(h2.ref, null, y2), s2.push(y2.ref, y2.__c || w2, y2)), null == d2 && null != w2 && (d2 = w2), 4 & y2.__u || h2.__k === y2.__k ? f2 = A$1(y2, f2, n2) : "function" == typeof y2.type && void 0 !== g2 ? f2 = g2 : w2 && (f2 = w2.nextSibling), y2.__u &= -7);
    return u2.__e = d2, f2;
  }
  function P$1(n2, l2, u2, t2, i2) {
    var r2, o2, e2, f2, c2, s2 = u2.length, a2 = s2, h2 = 0;
    for (n2.__k = new Array(i2), r2 = 0; r2 < i2; r2++)
      null != (o2 = l2[r2]) && "boolean" != typeof o2 && "function" != typeof o2 ? (f2 = r2 + h2, (o2 = n2.__k[r2] = "string" == typeof o2 || "number" == typeof o2 || "bigint" == typeof o2 || o2.constructor == String ? m$1(null, o2, null, null, null) : w$1(o2) ? m$1(k$1, { children: o2 }, null, null, null) : null == o2.constructor && o2.__b > 0 ? m$1(o2.type, o2.props, o2.key, o2.ref ? o2.ref : null, o2.__v) : o2).__ = n2, o2.__b = n2.__b + 1, e2 = null, -1 != (c2 = o2.__i = L(o2, u2, f2, a2)) && (a2--, (e2 = u2[c2]) && (e2.__u |= 2)), null == e2 || null == e2.__v ? (-1 == c2 && (i2 > s2 ? h2-- : i2 < s2 && h2++), "function" != typeof o2.type && (o2.__u |= 4)) : c2 != f2 && (c2 == f2 - 1 ? h2-- : c2 == f2 + 1 ? h2++ : (c2 > f2 ? h2-- : h2++, o2.__u |= 4))) : n2.__k[r2] = null;
    if (a2)
      for (r2 = 0; r2 < s2; r2++)
        null != (e2 = u2[r2]) && 0 == (2 & e2.__u) && (e2.__e == t2 && (t2 = S(e2)), B$2(e2, e2));
    return t2;
  }
  function A$1(n2, l2, u2) {
    var t2, i2;
    if ("function" == typeof n2.type) {
      for (t2 = n2.__k, i2 = 0; t2 && i2 < t2.length; i2++)
        t2[i2] && (t2[i2].__ = n2, l2 = A$1(t2[i2], l2, u2));
      return l2;
    }
    n2.__e != l2 && (l2 && n2.type && !u2.contains(l2) && (l2 = S(n2)), u2.insertBefore(n2.__e, l2 || null), l2 = n2.__e);
    do {
      l2 = l2 && l2.nextSibling;
    } while (null != l2 && 8 == l2.nodeType);
    return l2;
  }
  function H$1(n2, l2) {
    return l2 = l2 || [], null == n2 || "boolean" == typeof n2 || (w$1(n2) ? n2.some(function(n3) {
      H$1(n3, l2);
    }) : l2.push(n2)), l2;
  }
  function L(n2, l2, u2, t2) {
    var i2, r2, o2 = n2.key, e2 = n2.type, f2 = l2[u2];
    if (null === f2 && null == n2.key || f2 && o2 == f2.key && e2 == f2.type && 0 == (2 & f2.__u))
      return u2;
    if (t2 > (null != f2 && 0 == (2 & f2.__u) ? 1 : 0))
      for (i2 = u2 - 1, r2 = u2 + 1; i2 >= 0 || r2 < l2.length; ) {
        if (i2 >= 0) {
          if ((f2 = l2[i2]) && 0 == (2 & f2.__u) && o2 == f2.key && e2 == f2.type)
            return i2;
          i2--;
        }
        if (r2 < l2.length) {
          if ((f2 = l2[r2]) && 0 == (2 & f2.__u) && o2 == f2.key && e2 == f2.type)
            return r2;
          r2++;
        }
      }
    return -1;
  }
  function T$2(n2, l2, u2) {
    "-" == l2[0] ? n2.setProperty(l2, null == u2 ? "" : u2) : n2[l2] = null == u2 ? "" : "number" != typeof u2 || y$1.test(l2) ? u2 : u2 + "px";
  }
  function j$2(n2, l2, u2, t2, i2) {
    var r2, o2;
    n:
      if ("style" == l2)
        if ("string" == typeof u2)
          n2.style.cssText = u2;
        else {
          if ("string" == typeof t2 && (n2.style.cssText = t2 = ""), t2)
            for (l2 in t2)
              u2 && l2 in u2 || T$2(n2.style, l2, "");
          if (u2)
            for (l2 in u2)
              t2 && u2[l2] == t2[l2] || T$2(n2.style, l2, u2[l2]);
        }
      else if ("o" == l2[0] && "n" == l2[1])
        r2 = l2 != (l2 = l2.replace(f$2, "$1")), o2 = l2.toLowerCase(), l2 = o2 in n2 || "onFocusOut" == l2 || "onFocusIn" == l2 ? o2.slice(2) : l2.slice(2), n2.l || (n2.l = {}), n2.l[l2 + r2] = u2, u2 ? t2 ? u2.u = t2.u : (u2.u = c$1, n2.addEventListener(l2, r2 ? a$1 : s$1, r2)) : n2.removeEventListener(l2, r2 ? a$1 : s$1, r2);
      else {
        if ("http://www.w3.org/2000/svg" == i2)
          l2 = l2.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
        else if ("width" != l2 && "height" != l2 && "href" != l2 && "list" != l2 && "form" != l2 && "tabIndex" != l2 && "download" != l2 && "rowSpan" != l2 && "colSpan" != l2 && "role" != l2 && "popover" != l2 && l2 in n2)
          try {
            n2[l2] = null == u2 ? "" : u2;
            break n;
          } catch (n3) {
          }
        "function" == typeof u2 || (null == u2 || false === u2 && "-" != l2[4] ? n2.removeAttribute(l2) : n2.setAttribute(l2, "popover" == l2 && 1 == u2 ? "" : u2));
      }
  }
  function F$1(n2) {
    return function(u2) {
      if (this.l) {
        var t2 = this.l[u2.type + n2];
        if (null == u2.t)
          u2.t = c$1++;
        else if (u2.t < t2.u)
          return;
        return t2(l$1.event ? l$1.event(u2) : u2);
      }
    };
  }
  function O(n2, u2, t2, i2, r2, o2, e2, f2, c2, s2) {
    var a2, h2, p2, v2, y2, _2, m2, b, S2, C2, M2, $2, P2, A2, H2, L2, T2, j2 = u2.type;
    if (null != u2.constructor)
      return null;
    128 & t2.__u && (c2 = !!(32 & t2.__u), o2 = [f2 = u2.__e = t2.__e]), (a2 = l$1.__b) && a2(u2);
    n:
      if ("function" == typeof j2)
        try {
          if (b = u2.props, S2 = "prototype" in j2 && j2.prototype.render, C2 = (a2 = j2.contextType) && i2[a2.__c], M2 = a2 ? C2 ? C2.props.value : a2.__ : i2, t2.__c ? m2 = (h2 = u2.__c = t2.__c).__ = h2.__E : (S2 ? u2.__c = h2 = new j2(b, M2) : (u2.__c = h2 = new x$1(b, M2), h2.constructor = j2, h2.render = D$1), C2 && C2.sub(h2), h2.props = b, h2.state || (h2.state = {}), h2.context = M2, h2.__n = i2, p2 = h2.__d = true, h2.__h = [], h2._sb = []), S2 && null == h2.__s && (h2.__s = h2.state), S2 && null != j2.getDerivedStateFromProps && (h2.__s == h2.state && (h2.__s = d$1({}, h2.__s)), d$1(h2.__s, j2.getDerivedStateFromProps(b, h2.__s))), v2 = h2.props, y2 = h2.state, h2.__v = u2, p2)
            S2 && null == j2.getDerivedStateFromProps && null != h2.componentWillMount && h2.componentWillMount(), S2 && null != h2.componentDidMount && h2.__h.push(h2.componentDidMount);
          else {
            if (S2 && null == j2.getDerivedStateFromProps && b !== v2 && null != h2.componentWillReceiveProps && h2.componentWillReceiveProps(b, M2), !h2.__e && null != h2.shouldComponentUpdate && false === h2.shouldComponentUpdate(b, h2.__s, M2) || u2.__v == t2.__v) {
              for (u2.__v != t2.__v && (h2.props = b, h2.state = h2.__s, h2.__d = false), u2.__e = t2.__e, u2.__k = t2.__k, u2.__k.some(function(n3) {
                n3 && (n3.__ = u2);
              }), $2 = 0; $2 < h2._sb.length; $2++)
                h2.__h.push(h2._sb[$2]);
              h2._sb = [], h2.__h.length && e2.push(h2);
              break n;
            }
            null != h2.componentWillUpdate && h2.componentWillUpdate(b, h2.__s, M2), S2 && null != h2.componentDidUpdate && h2.__h.push(function() {
              h2.componentDidUpdate(v2, y2, _2);
            });
          }
          if (h2.context = M2, h2.props = b, h2.__P = n2, h2.__e = false, P2 = l$1.__r, A2 = 0, S2) {
            for (h2.state = h2.__s, h2.__d = false, P2 && P2(u2), a2 = h2.render(h2.props, h2.state, h2.context), H2 = 0; H2 < h2._sb.length; H2++)
              h2.__h.push(h2._sb[H2]);
            h2._sb = [];
          } else
            do {
              h2.__d = false, P2 && P2(u2), a2 = h2.render(h2.props, h2.state, h2.context), h2.state = h2.__s;
            } while (h2.__d && ++A2 < 25);
          h2.state = h2.__s, null != h2.getChildContext && (i2 = d$1(d$1({}, i2), h2.getChildContext())), S2 && !p2 && null != h2.getSnapshotBeforeUpdate && (_2 = h2.getSnapshotBeforeUpdate(v2, y2)), L2 = a2, null != a2 && a2.type === k$1 && null == a2.key && (L2 = N$1(a2.props.children)), f2 = I(n2, w$1(L2) ? L2 : [L2], u2, t2, i2, r2, o2, e2, f2, c2, s2), h2.base = u2.__e, u2.__u &= -161, h2.__h.length && e2.push(h2), m2 && (h2.__E = h2.__ = null);
        } catch (n3) {
          if (u2.__v = null, c2 || null != o2)
            if (n3.then) {
              for (u2.__u |= c2 ? 160 : 128; f2 && 8 == f2.nodeType && f2.nextSibling; )
                f2 = f2.nextSibling;
              o2[o2.indexOf(f2)] = null, u2.__e = f2;
            } else
              for (T2 = o2.length; T2--; )
                g$1(o2[T2]);
          else
            u2.__e = t2.__e, u2.__k = t2.__k;
          l$1.__e(n3, u2, t2);
        }
      else
        null == o2 && u2.__v == t2.__v ? (u2.__k = t2.__k, u2.__e = t2.__e) : f2 = u2.__e = V$1(t2.__e, u2, t2, i2, r2, o2, e2, c2, s2);
    return (a2 = l$1.diffed) && a2(u2), 128 & u2.__u ? void 0 : f2;
  }
  function z$1(n2, u2, t2) {
    for (var i2 = 0; i2 < t2.length; i2++)
      q$1(t2[i2], t2[++i2], t2[++i2]);
    l$1.__c && l$1.__c(u2, n2), n2.some(function(u3) {
      try {
        n2 = u3.__h, u3.__h = [], n2.some(function(n3) {
          n3.call(u3);
        });
      } catch (n3) {
        l$1.__e(n3, u3.__v);
      }
    });
  }
  function N$1(n2) {
    return "object" != typeof n2 || null == n2 || n2.__b && n2.__b > 0 ? n2 : w$1(n2) ? n2.map(N$1) : d$1({}, n2);
  }
  function V$1(u2, t2, i2, r2, o2, e2, f2, c2, s2) {
    var a2, h2, v2, y2, d2, _2, m2, b = i2.props, k2 = t2.props, x2 = t2.type;
    if ("svg" == x2 ? o2 = "http://www.w3.org/2000/svg" : "math" == x2 ? o2 = "http://www.w3.org/1998/Math/MathML" : o2 || (o2 = "http://www.w3.org/1999/xhtml"), null != e2) {
      for (a2 = 0; a2 < e2.length; a2++)
        if ((d2 = e2[a2]) && "setAttribute" in d2 == !!x2 && (x2 ? d2.localName == x2 : 3 == d2.nodeType)) {
          u2 = d2, e2[a2] = null;
          break;
        }
    }
    if (null == u2) {
      if (null == x2)
        return document.createTextNode(k2);
      u2 = document.createElementNS(o2, x2, k2.is && k2), c2 && (l$1.__m && l$1.__m(t2, e2), c2 = false), e2 = null;
    }
    if (null == x2)
      b === k2 || c2 && u2.data == k2 || (u2.data = k2);
    else {
      if (e2 = e2 && n.call(u2.childNodes), b = i2.props || p$1, !c2 && null != e2)
        for (b = {}, a2 = 0; a2 < u2.attributes.length; a2++)
          b[(d2 = u2.attributes[a2]).name] = d2.value;
      for (a2 in b)
        if (d2 = b[a2], "children" == a2)
          ;
        else if ("dangerouslySetInnerHTML" == a2)
          v2 = d2;
        else if (!(a2 in k2)) {
          if ("value" == a2 && "defaultValue" in k2 || "checked" == a2 && "defaultChecked" in k2)
            continue;
          j$2(u2, a2, null, d2, o2);
        }
      for (a2 in k2)
        d2 = k2[a2], "children" == a2 ? y2 = d2 : "dangerouslySetInnerHTML" == a2 ? h2 = d2 : "value" == a2 ? _2 = d2 : "checked" == a2 ? m2 = d2 : c2 && "function" != typeof d2 || b[a2] === d2 || j$2(u2, a2, d2, b[a2], o2);
      if (h2)
        c2 || v2 && (h2.__html == v2.__html || h2.__html == u2.innerHTML) || (u2.innerHTML = h2.__html), t2.__k = [];
      else if (v2 && (u2.innerHTML = ""), I("template" == t2.type ? u2.content : u2, w$1(y2) ? y2 : [y2], t2, i2, r2, "foreignObject" == x2 ? "http://www.w3.org/1999/xhtml" : o2, e2, f2, e2 ? e2[0] : i2.__k && S(i2, 0), c2, s2), null != e2)
        for (a2 = e2.length; a2--; )
          g$1(e2[a2]);
      c2 || (a2 = "value", "progress" == x2 && null == _2 ? u2.removeAttribute("value") : null != _2 && (_2 !== u2[a2] || "progress" == x2 && !_2 || "option" == x2 && _2 != b[a2]) && j$2(u2, a2, _2, b[a2], o2), a2 = "checked", null != m2 && m2 != u2[a2] && j$2(u2, a2, m2, b[a2], o2));
    }
    return u2;
  }
  function q$1(n2, u2, t2) {
    try {
      if ("function" == typeof n2) {
        var i2 = "function" == typeof n2.__u;
        i2 && n2.__u(), i2 && null == u2 || (n2.__u = n2(u2));
      } else
        n2.current = u2;
    } catch (n3) {
      l$1.__e(n3, t2);
    }
  }
  function B$2(n2, u2, t2) {
    var i2, r2;
    if (l$1.unmount && l$1.unmount(n2), (i2 = n2.ref) && (i2.current && i2.current != n2.__e || q$1(i2, null, u2)), null != (i2 = n2.__c)) {
      if (i2.componentWillUnmount)
        try {
          i2.componentWillUnmount();
        } catch (n3) {
          l$1.__e(n3, u2);
        }
      i2.base = i2.__P = null;
    }
    if (i2 = n2.__k)
      for (r2 = 0; r2 < i2.length; r2++)
        i2[r2] && B$2(i2[r2], u2, t2 || "function" != typeof n2.type);
    t2 || g$1(n2.__e), n2.__c = n2.__ = n2.__e = void 0;
  }
  function D$1(n2, l2, u2) {
    return this.constructor(n2, u2);
  }
  function E$1(u2, t2, i2) {
    var r2, o2, e2, f2;
    t2 == document && (t2 = document.documentElement), l$1.__ && l$1.__(u2, t2), o2 = (r2 = "function" == typeof i2) ? null : i2 && i2.__k || t2.__k, e2 = [], f2 = [], O(t2, u2 = (!r2 && i2 || t2).__k = _(k$1, null, [u2]), o2 || p$1, p$1, t2.namespaceURI, !r2 && i2 ? [i2] : o2 ? null : t2.firstChild ? n.call(t2.childNodes) : null, e2, !r2 && i2 ? i2 : o2 ? o2.__e : t2.firstChild, r2, f2), z$1(e2, u2, f2);
  }
  function J$1(l2, u2, t2) {
    var i2, r2, o2, e2, f2 = d$1({}, l2.props);
    for (o2 in l2.type && l2.type.defaultProps && (e2 = l2.type.defaultProps), u2)
      "key" == o2 ? i2 = u2[o2] : "ref" == o2 ? r2 = u2[o2] : f2[o2] = void 0 === u2[o2] && null != e2 ? e2[o2] : u2[o2];
    return arguments.length > 2 && (f2.children = arguments.length > 3 ? n.call(arguments, 2) : t2), m$1(l2.type, f2, i2 || l2.key, r2 || l2.ref, null);
  }
  function K$1(n2) {
    function l2(n3) {
      var u2, t2;
      return this.getChildContext || (u2 = /* @__PURE__ */ new Set(), (t2 = {})[l2.__c] = this, this.getChildContext = function() {
        return t2;
      }, this.componentWillUnmount = function() {
        u2 = null;
      }, this.shouldComponentUpdate = function(n4) {
        this.props.value != n4.value && u2.forEach(function(n5) {
          n5.__e = true, M(n5);
        });
      }, this.sub = function(n4) {
        u2.add(n4);
        var l3 = n4.componentWillUnmount;
        n4.componentWillUnmount = function() {
          u2 && u2.delete(n4), l3 && l3.call(n4);
        };
      }), n3.children;
    }
    return l2.__c = "__cC" + h$1++, l2.__ = n2, l2.Provider = l2.__l = (l2.Consumer = function(n3, l3) {
      return n3.children(l3);
    }).contextType = l2, l2;
  }
  n = v$1.slice, l$1 = { __e: function(n2, l2, u2, t2) {
    for (var i2, r2, o2; l2 = l2.__; )
      if ((i2 = l2.__c) && !i2.__)
        try {
          if ((r2 = i2.constructor) && null != r2.getDerivedStateFromError && (i2.setState(r2.getDerivedStateFromError(n2)), o2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), o2 = i2.__d), o2)
            return i2.__E = i2;
        } catch (l3) {
          n2 = l3;
        }
    throw n2;
  } }, u$2 = 0, x$1.prototype.setState = function(n2, l2) {
    var u2;
    u2 = null != this.__s && this.__s != this.state ? this.__s : this.__s = d$1({}, this.state), "function" == typeof n2 && (n2 = n2(d$1({}, u2), this.props)), n2 && d$1(u2, n2), null != n2 && this.__v && (l2 && this._sb.push(l2), M(this));
  }, x$1.prototype.forceUpdate = function(n2) {
    this.__v && (this.__e = true, n2 && this.__h.push(n2), M(this));
  }, x$1.prototype.render = k$1, i$1 = [], o$1 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e$1 = function(n2, l2) {
    return n2.__v.__b - l2.__v.__b;
  }, $$2.__r = 0, f$2 = /(PointerCapture)$|Capture$/i, c$1 = 0, s$1 = F$1(false), a$1 = F$1(true), h$1 = 0;
  var f$1 = 0;
  function u$1(e2, t2, n2, o2, i2, u2) {
    t2 || (t2 = {});
    var a2, c2, p2 = t2;
    if ("ref" in p2)
      for (c2 in p2 = {}, t2)
        "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
    var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f$1, __i: -1, __u: 0, __source: i2, __self: u2 };
    if ("function" == typeof e2 && (a2 = e2.defaultProps))
      for (c2 in a2)
        void 0 === p2[c2] && (p2[c2] = a2[c2]);
    return l$1.vnode && l$1.vnode(l2), l2;
  }
  var t, r, u, i, o = 0, f = [], c = l$1, e = c.__b, a = c.__r, v = c.diffed, l = c.__c, m = c.unmount, s = c.__;
  function p(n2, t2) {
    c.__h && c.__h(r, n2, o || t2), o = 0;
    var u2 = r.__H || (r.__H = { __: [], __h: [] });
    return n2 >= u2.__.length && u2.__.push({}), u2.__[n2];
  }
  function d(n2) {
    return o = 1, h(D, n2);
  }
  function h(n2, u2, i2) {
    var o2 = p(t++, 2);
    if (o2.t = n2, !o2.__c && (o2.__ = [i2 ? i2(u2) : D(void 0, u2), function(n3) {
      var t2 = o2.__N ? o2.__N[0] : o2.__[0], r2 = o2.t(t2, n3);
      t2 !== r2 && (o2.__N = [r2, o2.__[1]], o2.__c.setState({}));
    }], o2.__c = r, !r.__f)) {
      var f2 = function(n3, t2, r2) {
        if (!o2.__c.__H)
          return true;
        var u3 = o2.__c.__H.__.filter(function(n4) {
          return !!n4.__c;
        });
        if (u3.every(function(n4) {
          return !n4.__N;
        }))
          return !c2 || c2.call(this, n3, t2, r2);
        var i3 = o2.__c.props !== n3;
        return u3.forEach(function(n4) {
          if (n4.__N) {
            var t3 = n4.__[0];
            n4.__ = n4.__N, n4.__N = void 0, t3 !== n4.__[0] && (i3 = true);
          }
        }), c2 && c2.call(this, n3, t2, r2) || i3;
      };
      r.__f = true;
      var c2 = r.shouldComponentUpdate, e2 = r.componentWillUpdate;
      r.componentWillUpdate = function(n3, t2, r2) {
        if (this.__e) {
          var u3 = c2;
          c2 = void 0, f2(n3, t2, r2), c2 = u3;
        }
        e2 && e2.call(this, n3, t2, r2);
      }, r.shouldComponentUpdate = f2;
    }
    return o2.__N || o2.__;
  }
  function y(n2, u2) {
    var i2 = p(t++, 3);
    !c.__s && C(i2.__H, u2) && (i2.__ = n2, i2.u = u2, r.__H.__h.push(i2));
  }
  function A(n2) {
    return o = 5, T$1(function() {
      return { current: n2 };
    }, []);
  }
  function T$1(n2, r2) {
    var u2 = p(t++, 7);
    return C(u2.__H, r2) && (u2.__ = n2(), u2.__H = r2, u2.__h = n2), u2.__;
  }
  function x(n2) {
    var u2 = r.context[n2.__c], i2 = p(t++, 9);
    return i2.c = n2, u2 ? (null == i2.__ && (i2.__ = true, u2.sub(r)), u2.props.value) : n2.__;
  }
  function j$1() {
    for (var n2; n2 = f.shift(); )
      if (n2.__P && n2.__H)
        try {
          n2.__H.__h.forEach(z), n2.__H.__h.forEach(B$1), n2.__H.__h = [];
        } catch (t2) {
          n2.__H.__h = [], c.__e(t2, n2.__v);
        }
  }
  c.__b = function(n2) {
    r = null, e && e(n2);
  }, c.__ = function(n2, t2) {
    n2 && t2.__k && t2.__k.__m && (n2.__m = t2.__k.__m), s && s(n2, t2);
  }, c.__r = function(n2) {
    a && a(n2), t = 0;
    var i2 = (r = n2.__c).__H;
    i2 && (u === r ? (i2.__h = [], r.__h = [], i2.__.forEach(function(n3) {
      n3.__N && (n3.__ = n3.__N), n3.u = n3.__N = void 0;
    })) : (i2.__h.forEach(z), i2.__h.forEach(B$1), i2.__h = [], t = 0)), u = r;
  }, c.diffed = function(n2) {
    v && v(n2);
    var t2 = n2.__c;
    t2 && t2.__H && (t2.__H.__h.length && (1 !== f.push(t2) && i === c.requestAnimationFrame || ((i = c.requestAnimationFrame) || w)(j$1)), t2.__H.__.forEach(function(n3) {
      n3.u && (n3.__H = n3.u), n3.u = void 0;
    })), u = r = null;
  }, c.__c = function(n2, t2) {
    t2.some(function(n3) {
      try {
        n3.__h.forEach(z), n3.__h = n3.__h.filter(function(n4) {
          return !n4.__ || B$1(n4);
        });
      } catch (r2) {
        t2.some(function(n4) {
          n4.__h && (n4.__h = []);
        }), t2 = [], c.__e(r2, n3.__v);
      }
    }), l && l(n2, t2);
  }, c.unmount = function(n2) {
    m && m(n2);
    var t2, r2 = n2.__c;
    r2 && r2.__H && (r2.__H.__.forEach(function(n3) {
      try {
        z(n3);
      } catch (n4) {
        t2 = n4;
      }
    }), r2.__H = void 0, t2 && c.__e(t2, r2.__v));
  };
  var k = "function" == typeof requestAnimationFrame;
  function w(n2) {
    var t2, r2 = function() {
      clearTimeout(u2), k && cancelAnimationFrame(t2), setTimeout(n2);
    }, u2 = setTimeout(r2, 35);
    k && (t2 = requestAnimationFrame(r2));
  }
  function z(n2) {
    var t2 = r, u2 = n2.__c;
    "function" == typeof u2 && (n2.__c = void 0, u2()), r = t2;
  }
  function B$1(n2) {
    var t2 = r;
    n2.__c = n2.__(), r = t2;
  }
  function C(n2, t2) {
    return !n2 || n2.length !== t2.length || t2.some(function(t3, r2) {
      return t3 !== n2[r2];
    });
  }
  function D(n2, t2) {
    return "function" == typeof t2 ? t2(n2) : t2;
  }
  const app = "";
  const index$8 = "";
  function g(n2, t2) {
    for (var e2 in t2)
      n2[e2] = t2[e2];
    return n2;
  }
  function E(n2, t2) {
    for (var e2 in n2)
      if ("__source" !== e2 && !(e2 in t2))
        return true;
    for (var r2 in t2)
      if ("__source" !== r2 && n2[r2] !== t2[r2])
        return true;
    return false;
  }
  function N(n2, t2) {
    this.props = n2, this.context = t2;
  }
  (N.prototype = new x$1()).isPureReactComponent = true, N.prototype.shouldComponentUpdate = function(n2, t2) {
    return E(this.props, n2) || E(this.state, t2);
  };
  var T = l$1.__b;
  l$1.__b = function(n2) {
    n2.type && n2.type.__f && n2.ref && (n2.props.ref = n2.ref, n2.ref = null), T && T(n2);
  };
  var F = l$1.__e;
  l$1.__e = function(n2, t2, e2, r2) {
    if (n2.then) {
      for (var u2, o2 = t2; o2 = o2.__; )
        if ((u2 = o2.__c) && u2.__c)
          return null == t2.__e && (t2.__e = e2.__e, t2.__k = e2.__k), u2.__c(n2, t2);
    }
    F(n2, t2, e2, r2);
  };
  var U = l$1.unmount;
  function V(n2, t2, e2) {
    return n2 && (n2.__c && n2.__c.__H && (n2.__c.__H.__.forEach(function(n3) {
      "function" == typeof n3.__c && n3.__c();
    }), n2.__c.__H = null), null != (n2 = g({}, n2)).__c && (n2.__c.__P === e2 && (n2.__c.__P = t2), n2.__c.__e = true, n2.__c = null), n2.__k = n2.__k && n2.__k.map(function(n3) {
      return V(n3, t2, e2);
    })), n2;
  }
  function W(n2, t2, e2) {
    return n2 && e2 && (n2.__v = null, n2.__k = n2.__k && n2.__k.map(function(n3) {
      return W(n3, t2, e2);
    }), n2.__c && n2.__c.__P === t2 && (n2.__e && e2.appendChild(n2.__e), n2.__c.__e = true, n2.__c.__P = e2)), n2;
  }
  function P() {
    this.__u = 0, this.o = null, this.__b = null;
  }
  function j(n2) {
    var t2 = n2.__.__c;
    return t2 && t2.__a && t2.__a(n2);
  }
  function B() {
    this.i = null, this.l = null;
  }
  l$1.unmount = function(n2) {
    var t2 = n2.__c;
    t2 && t2.__R && t2.__R(), t2 && 32 & n2.__u && (n2.type = null), U && U(n2);
  }, (P.prototype = new x$1()).__c = function(n2, t2) {
    var e2 = t2.__c, r2 = this;
    null == r2.o && (r2.o = []), r2.o.push(e2);
    var u2 = j(r2.__v), o2 = false, i2 = function() {
      o2 || (o2 = true, e2.__R = null, u2 ? u2(l2) : l2());
    };
    e2.__R = i2;
    var l2 = function() {
      if (!--r2.__u) {
        if (r2.state.__a) {
          var n3 = r2.state.__a;
          r2.__v.__k[0] = W(n3, n3.__c.__P, n3.__c.__O);
        }
        var t3;
        for (r2.setState({ __a: r2.__b = null }); t3 = r2.o.pop(); )
          t3.forceUpdate();
      }
    };
    r2.__u++ || 32 & t2.__u || r2.setState({ __a: r2.__b = r2.__v.__k[0] }), n2.then(i2, i2);
  }, P.prototype.componentWillUnmount = function() {
    this.o = [];
  }, P.prototype.render = function(n2, e2) {
    if (this.__b) {
      if (this.__v.__k) {
        var r2 = document.createElement("div"), o2 = this.__v.__k[0].__c;
        this.__v.__k[0] = V(this.__b, r2, o2.__O = o2.__P);
      }
      this.__b = null;
    }
    var i2 = e2.__a && _(k$1, null, n2.fallback);
    return i2 && (i2.__u &= -33), [_(k$1, null, e2.__a ? null : n2.children), i2];
  };
  var H = function(n2, t2, e2) {
    if (++e2[1] === e2[0] && n2.l.delete(t2), n2.props.revealOrder && ("t" !== n2.props.revealOrder[0] || !n2.l.size))
      for (e2 = n2.i; e2; ) {
        for (; e2.length > 3; )
          e2.pop()();
        if (e2[1] < e2[0])
          break;
        n2.i = e2 = e2[2];
      }
  };
  function Z(n2) {
    return this.getChildContext = function() {
      return n2.context;
    }, n2.children;
  }
  function Y(n2) {
    var e2 = this, r2 = n2.h;
    if (e2.componentWillUnmount = function() {
      E$1(null, e2.v), e2.v = null, e2.h = null;
    }, e2.h && e2.h !== r2 && e2.componentWillUnmount(), !e2.v) {
      for (var u2 = e2.__v; null !== u2 && !u2.__m && null !== u2.__; )
        u2 = u2.__;
      e2.h = r2, e2.v = { nodeType: 1, parentNode: r2, childNodes: [], __k: { __m: u2.__m }, contains: function() {
        return true;
      }, insertBefore: function(n3, t2) {
        this.childNodes.push(n3), e2.h.insertBefore(n3, t2);
      }, removeChild: function(n3) {
        this.childNodes.splice(this.childNodes.indexOf(n3) >>> 1, 1), e2.h.removeChild(n3);
      } };
    }
    E$1(_(Z, { context: e2.context }, n2.__v), e2.v);
  }
  function $$1(n2, e2) {
    var r2 = _(Y, { __v: n2, h: e2 });
    return r2.containerInfo = e2, r2;
  }
  (B.prototype = new x$1()).__a = function(n2) {
    var t2 = this, e2 = j(t2.__v), r2 = t2.l.get(n2);
    return r2[0]++, function(u2) {
      var o2 = function() {
        t2.props.revealOrder ? (r2.push(u2), H(t2, n2, r2)) : u2();
      };
      e2 ? e2(o2) : o2();
    };
  }, B.prototype.render = function(n2) {
    this.i = null, this.l = /* @__PURE__ */ new Map();
    var t2 = H$1(n2.children);
    n2.revealOrder && "b" === n2.revealOrder[0] && t2.reverse();
    for (var e2 = t2.length; e2--; )
      this.l.set(t2[e2], this.i = [1, 0, this.i]);
    return n2.children;
  }, B.prototype.componentDidUpdate = B.prototype.componentDidMount = function() {
    var n2 = this;
    this.l.forEach(function(t2, e2) {
      H(n2, e2, t2);
    });
  };
  var q = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103, G = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/, J = /^on(Ani|Tra|Tou|BeforeInp|Compo)/, K = /[A-Z0-9]/g, Q = "undefined" != typeof document, X = function(n2) {
    return ("undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/ : /fil|che|ra/).test(n2);
  };
  x$1.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(t2) {
    Object.defineProperty(x$1.prototype, t2, { configurable: true, get: function() {
      return this["UNSAFE_" + t2];
    }, set: function(n2) {
      Object.defineProperty(this, t2, { configurable: true, writable: true, value: n2 });
    } });
  });
  var en = l$1.event;
  function rn() {
  }
  function un() {
    return this.cancelBubble;
  }
  function on() {
    return this.defaultPrevented;
  }
  l$1.event = function(n2) {
    return en && (n2 = en(n2)), n2.persist = rn, n2.isPropagationStopped = un, n2.isDefaultPrevented = on, n2.nativeEvent = n2;
  };
  var cn = { enumerable: false, configurable: true, get: function() {
    return this.class;
  } }, fn = l$1.vnode;
  l$1.vnode = function(n2) {
    "string" == typeof n2.type && function(n3) {
      var t2 = n3.props, e2 = n3.type, u2 = {}, o2 = -1 === e2.indexOf("-");
      for (var i2 in t2) {
        var l2 = t2[i2];
        if (!("value" === i2 && "defaultValue" in t2 && null == l2 || Q && "children" === i2 && "noscript" === e2 || "class" === i2 || "className" === i2)) {
          var c2 = i2.toLowerCase();
          "defaultValue" === i2 && "value" in t2 && null == t2.value ? i2 = "value" : "download" === i2 && true === l2 ? l2 = "" : "translate" === c2 && "no" === l2 ? l2 = false : "o" === c2[0] && "n" === c2[1] ? "ondoubleclick" === c2 ? i2 = "ondblclick" : "onchange" !== c2 || "input" !== e2 && "textarea" !== e2 || X(t2.type) ? "onfocus" === c2 ? i2 = "onfocusin" : "onblur" === c2 ? i2 = "onfocusout" : J.test(i2) && (i2 = c2) : c2 = i2 = "oninput" : o2 && G.test(i2) ? i2 = i2.replace(K, "-$&").toLowerCase() : null === l2 && (l2 = void 0), "oninput" === c2 && u2[i2 = c2] && (i2 = "oninputCapture"), u2[i2] = l2;
        }
      }
      "select" == e2 && u2.multiple && Array.isArray(u2.value) && (u2.value = H$1(t2.children).forEach(function(n4) {
        n4.props.selected = -1 != u2.value.indexOf(n4.props.value);
      })), "select" == e2 && null != u2.defaultValue && (u2.value = H$1(t2.children).forEach(function(n4) {
        n4.props.selected = u2.multiple ? -1 != u2.defaultValue.indexOf(n4.props.value) : u2.defaultValue == n4.props.value;
      })), t2.class && !t2.className ? (u2.class = t2.class, Object.defineProperty(u2, "className", cn)) : (t2.className && !t2.class || t2.class && t2.className) && (u2.class = u2.className = t2.className), n3.props = u2;
    }(n2), n2.$$typeof = q, fn && fn(n2);
  };
  var an = l$1.__r;
  l$1.__r = function(n2) {
    an && an(n2), n2.__c;
  };
  var sn = l$1.diffed;
  l$1.diffed = function(n2) {
    sn && sn(n2);
    var t2 = n2.props, e2 = n2.__e;
    null != e2 && "textarea" === n2.type && "value" in t2 && t2.value !== e2.value && (e2.value = null == t2.value ? "" : t2.value);
  };
  const SvgLogoIcon = (props) => /* @__PURE__ */ _("svg", { xmlns: "http://www.w3.org/2000/svg", width: 389, height: 395, viewBox: "0 0 389 395", style: {}, preserveAspectRatio: "xMidYMid meet", ...props }, /* @__PURE__ */ _("g", { fill: "currentColor", stroke: "currentColor" }, /* @__PURE__ */ _("path", { d: "M 182.500 44.109 C 165.352 46.580 144.185 55.432 130.164 65.997 C 111.402 80.135 98.094 101.350 92.460 126.104 C 91.065 132.234 90.692 141.212 90.283 178.564 C 89.793 223.278 90.498 241.354 93.113 251.131 C 94.294 255.550 94.212 255.963 91.031 261.615 C 81.219 279.047 68.832 289.288 52.373 293.575 C 45.709 295.311 43.589 296.928 40.790 302.413 C 37.990 307.900 38.561 318.277 41.935 323.200 C 46.017 329.158 50.365 331.429 58.473 331.838 C 64.174 332.126 67.085 331.692 72.824 329.696 C 87.022 324.758 103.625 311.903 112.147 299.248 L 115.646 294.053 119.573 298.123 C 132.526 311.547 151.857 321.611 174.000 326.457 C 185.737 329.026 205.669 329.549 216.936 327.583 C 222.126 326.677 226.892 325.504 227.528 324.977 C 228.164 324.449 228.923 324.256 229.215 324.548 C 229.507 324.840 232.621 323.996 236.136 322.673 C 250.890 317.120 263.362 309.396 272.460 300.176 L 277.420 295.150 280.886 300.325 C 288.675 311.955 302.157 322.511 316.500 328.210 C 323.483 330.984 325.728 331.395 334.155 331.444 C 343.458 331.498 343.952 331.388 347.655 328.442 C 352.773 324.372 356.000 317.892 356.000 311.689 C 356.000 301.969 350.536 295.573 339.325 292.167 C 326.976 288.417 313.619 277.557 306.580 265.545 L 303.823 260.842 305.662 253.671 C 307.347 247.098 307.499 241.500 307.487 186.500 L 307.474 126.500 304.805 116.792 C 294.088 77.807 260.838 50.091 217.566 44.072 C 208.665 42.834 191.216 42.852 182.500 44.109 M 217.434 84.594 C 237.743 89.586 252.838 104.485 257.463 124.103 C 258.709 129.390 258.973 139.972 258.985 185.090 C 258.999 235.820 258.863 240.215 257.065 247.244 C 253.675 260.501 246.763 271.297 236.737 278.995 C 233.857 281.207 230.938 283.480 230.250 284.048 C 229.563 284.615 229.000 284.892 229.000 284.664 C 229.000 284.435 225.963 285.382 222.250 286.767 C 212.991 290.223 195.669 291.015 184.339 288.501 C 167.527 284.771 153.355 274.308 146.602 260.641 C 139.748 246.770 139.500 244.073 139.500 183.500 C 139.500 123.578 139.516 123.407 146.334 110.513 C 152.339 99.157 167.260 87.543 178.570 85.421 C 180.457 85.067 182.000 84.351 182.000 83.830 C 182.000 83.308 182.361 83.105 182.802 83.378 C 183.243 83.650 186.730 83.494 190.552 83.030 C 198.944 82.013 209.406 82.621 217.434 84.594 " })));
  var classnames$1 = { exports: {} };
  /*!
  	Copyright (c) 2018 Jed Watson.
  	Licensed under the MIT License (MIT), see
  	http://jedwatson.github.io/classnames
  */
  (function(module) {
    (function() {
      var hasOwn = {}.hasOwnProperty;
      function classNames2() {
        var classes = "";
        for (var i2 = 0; i2 < arguments.length; i2++) {
          var arg = arguments[i2];
          if (arg) {
            classes = appendClass(classes, parseValue(arg));
          }
        }
        return classes;
      }
      function parseValue(arg) {
        if (typeof arg === "string" || typeof arg === "number") {
          return arg;
        }
        if (typeof arg !== "object") {
          return "";
        }
        if (Array.isArray(arg)) {
          return classNames2.apply(null, arg);
        }
        if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes("[native code]")) {
          return arg.toString();
        }
        var classes = "";
        for (var key in arg) {
          if (hasOwn.call(arg, key) && arg[key]) {
            classes = appendClass(classes, key);
          }
        }
        return classes;
      }
      function appendClass(value, newClass) {
        if (!newClass) {
          return value;
        }
        if (value) {
          return value + " " + newClass;
        }
        return value + newClass;
      }
      if (module.exports) {
        classNames2.default = classNames2;
        module.exports = classNames2;
      } else {
        window.unsafeWindow.classNames = classNames2;
      }
    })();
  })(classnames$1);
  const classnames = classnames$1.exports;
  class EventBus {
    constructor() {
      this.events = {};
    }
    on(name, callback) {
      if (!this.events[name]) {
        this.events[name] = [];
      }
      this.events[name].push(callback);
    }
    emit(name, ...args) {
      if (this.events[name]) {
        this.events[name].forEach((callback) => {
          callback(...args);
        });
      }
    }
    off(name, callback) {
      if (this.events[name]) {
        this.events[name] = this.events[name].filter((cb) => cb !== callback);
      }
    }
    offAll(name) {
      if (this.events[name]) {
        delete this.events[name];
      }
    }
  }
  const bus = new EventBus();
  const $ = window.unsafeWindow.jQuery || unsafeWindow.jQuery;
  async function ajax(obj) {
    let success = obj.success;
    let error = obj.error;
    let p2;
    if (!success) {
      p2 = new Promise((resolve, reject) => {
        success = resolve;
        error = reject;
      });
    }
    const headers = obj.headers || {};
    const token = await getToken();
    headers.deviceId = await deviceId();
    if (token) {
      headers.Authorization = token;
    }
    obj.headers = headers;
    obj.success = success;
    obj.error = error;
    {
      obj.responseType = obj.dataType || "json";
      delete obj.dataType;
      if (obj.method === "GET") {
        const u2 = new URL(obj.url);
        for (const [k2, v2] of Object.entries(obj.data || {})) {
          u2.searchParams.append(k2, v2);
        }
        delete obj.data;
        obj.url = u2.href;
      } else {
        obj.data = JSON.stringify(obj.data);
        obj.headers["Content-Type"] = "application/json";
      }
      obj.onerror = error;
      obj.onreadystatechange = (_a3) => {
        if (_a3.readyState === 4) {
          const { response, status } = _a3;
          if (status === 200) {
            if ((response == null ? void 0 : response.code) === 401) {
              bus.emit("clearUser");
              error(response);
            }
            success(response);
          } else {
            if (status === 401) {
              bus.emit("clearUser");
            }
            error(response);
          }
        }
      };
    }
    const _a2 = GM_xmlhttpRequest(obj);
    return p2 || _a2;
  }
  const token_key = "token";
  async function getToken() {
    const token = GM_getValue(token_key);
    return token;
  }
  function setToken(token) {
    return GM_setValue(token_key, token);
  }
  function removeToken() {
    return GM_deleteValue(token_key);
  }
  function setStore(key, value, isQs = true) {
    return GM_setValue(key, value);
  }
  function getStore(key) {
    let val = GM_getValue(key);
    return val;
  }
  function removeStore(key) {
    return GM_deleteValue(key);
  }
  async function deviceId() {
    let id = getStore("deviceId");
    if (!id) {
      id = localStorage.getItem("qk_deviceId");
    }
    if (!id) {
      id = "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function(c2) {
        const r2 = Math.random() * 16 | 0;
        const v2 = c2 === "x" ? r2 : r2 & 3 | 8;
        return v2.toString(16);
      }).toUpperCase();
      setStore("deviceId", id);
      localStorage.setItem("qk_deviceId", id);
    }
    return id;
  }
  const version2Obj = (version2) => {
    if (!version2)
      return {};
    const [v2, build] = version2.split("-");
    const [major, minor, patch] = v2.split(".");
    const o2 = { major, minor, patch, build, v: Number(major + minor + patch) };
    return o2;
  };
  function stringTemplate(template2, data) {
    return template2.replace(/\{\{(.+?)\}\}/g, (match, key) => {
      const [k2, def = ""] = key.split("||");
      return data[k2.trim()] || def.trim();
    });
  }
  async function imgUrl2File(url) {
    let fileName = url.split("/").pop();
    fileName = fileName.split("?")[0];
    let type = fileName.split(".").pop();
    const data = await ajax({
      url,
      method: "GET",
      dataType: "blob"
    });
    const file = new File([data], fileName, { type: "image/" + type });
    return file;
  }
  const htmlReg = /&(lt|gt|amp|quot|nbsp|shy|#\d{1,5});/g;
  const htmlCode2char = {
    lt: "<",
    gt: ">",
    amp: "&",
    quot: '"',
    nbsp: "\xA0",
    shy: "\xAD"
  };
  function dealtHtmlFormat(str) {
    return str.replace(htmlReg, (match, name) => {
      return htmlCode2char[name];
    });
  }
  function classNames(...args) {
    return args.filter(Boolean).join(" ");
  }
  const base = "http://113.45.143.62:7001/v1/api";
  function login(data) {
    return ajax({
      url: `${base}/user/login`,
      method: "POST",
      data
    });
  }
  function register(data) {
    return ajax({
      url: `${base}/user/register`,
      method: "POST",
      data
    });
  }
  function userTemp(data) {
    return ajax({
      url: `${base}/user/temp_user`,
      method: "POST",
      data
    });
  }
  function getUser() {
    return ajax({
      url: `${base}/user/me`,
      method: "GET"
    });
  }
  function sendVerifyCode(data) {
    return ajax({
      url: `${base}/user/send_verification_code`,
      method: "POST",
      data
    });
  }
  function useCardkey(data) {
    return ajax({
      url: `${base}/user/useCardkey`,
      method: "POST",
      data
    });
  }
  function getArticle(data) {
    return ajax({
      url: `${base}/client/query`,
      data: { ...data, type: "plugin" },
      method: "GET"
    });
  }
  function sourceGetUrl(data) {
    return ajax({
      url: `${base}/client/getUrl`,
      data: { ...data },
      method: "POST"
    });
  }
  function getConfig(data) {
    return ajax({
      url: `${base}/config/get`,
      data,
      method: "GET"
    });
  }
  const GlobalContext = K$1({});
  const reducer = (state, action) => {
    switch (action.type) {
      case "setUser":
        return { ...state, user: action.user };
      case "setActionModal":
        return { ...state, activeModal: action.activeModal };
      case "setPannel":
        return { ...state, pannel: { ...state.pannel, ...action.pannel } };
      case "setConfig":
        return { ...state, config: action.config };
      case "setToolbar":
        return { ...state, toolbar: { ...state.toolbar, ...action.toolbar } };
      case "setNotify":
        return { ...state, notify: action.notify };
      default:
        return state;
    }
  };
  const GlobalProvider = ({ children }) => {
    const [state, dispatch] = h(reducer, {
      user: getStore("user") || {},
      activeModal: {
        show: false,
        title: ""
      },
      pannel: {
        show: true,
        title: "",
        type: "info",
        delay: 0
      },
      openLogin: false,
      toolbar: {
        unlock: false,
        renew: true,
        downloadArticle: !!document.querySelector("#content_views"),
        setting: false
      },
      notifyList: [],
      pageConfig: {
        copy: true,
        articleMore: true,
        loginModule: true
      },
      config: getStore("config") || []
    });
    const [notify, _setNotify] = d(null);
    const changeActionModal = (visible, title) => {
      title && setNotify({ content: title, type: "warning" });
      dispatch({ type: "setActionModal", activeModal: { show: visible, title } });
    };
    const changePannel = (pannel) => {
      dispatch({ type: "setPannel", pannel });
    };
    const setNotify = (notify2) => {
      _setNotify(notify2);
    };
    const getUserInfo = (_user) => {
      if ((_user == null ? void 0 : _user.saveTime) > Date.now() - 1e3 * 60 * 60 * 24 * 7) {
        return;
      }
      getUser().then((res) => {
        if (res.success) {
          const userData = res.data;
          userData.expirationTime = new Date(userData.expirationDate).getTime() || 0;
          userData.saveTime = Date.now();
          res.token && setToken(res.token);
          setStore("user", userData);
          dispatch({ type: "setUser", user: userData });
        } else {
          dispatch({ type: "setUser", user: {} });
        }
      }).catch((err) => {
        dispatch({ type: "setUser", user: {} });
      });
    };
    const setToolbar = (toolbar) => {
      dispatch({ type: "setToolbar", toolbar });
    };
    y(() => {
      getUserInfo(getStore("user"));
      bus.on("clearUser", () => {
        removeToken();
        removeStore("user");
        dispatch({ type: "setUser", user: {} });
      });
      getConfig().then((res) => {
        if (res.success) {
          dispatch({ type: "setConfig", config: res.data });
        }
      });
    }, []);
    return /* @__PURE__ */ u$1(
      GlobalContext.Provider,
      {
        value: { ...state, notify, changeActionModal, changePannel, getUserInfo, setToolbar, setNotify },
        children
      }
    );
  };
  const useGlobalStore = () => x(GlobalContext);
  const useNotify = () => {
    const { notify, setNotify } = x(GlobalContext);
    return [notify, setNotify];
  };
  function useConfig() {
    const { config = [] } = x(GlobalContext);
    return T$1(() => {
      return config.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});
    }, [config]);
  }
  const index$7 = "";
  const Notify = (props) => {
    const [notify, setNotify] = useNotify();
    const timer = A(null);
    const longNotify = A(null);
    y(() => {
      var _a2;
      timer.current && clearTimeout(timer.current);
      if (notify) {
        timer.current = setTimeout(() => {
          notify.cb ? notify.cb() : setNotify(longNotify.current);
        }, (_a2 = notify.delay) != null ? _a2 : 2e3);
        if (notify.delay === 0) {
          longNotify.current = notify;
        }
      } else {
        longNotify.current = null;
      }
    }, [notify]);
    if (!(notify == null ? void 0 : notify.content) && !props.children)
      return null;
    const type = (notify == null ? void 0 : notify.type) || props.type;
    return /* @__PURE__ */ u$1("div", { className: classnames("qk-notify", type, props.className), children: /* @__PURE__ */ u$1("div", { class: "marquee-wrap", children: /* @__PURE__ */ u$1("div", { class: "marquee-content ", children: (notify == null ? void 0 : notify.content) || props.children }) }) });
  };
  Notify.defaultProps = {
    type: "info"
  };
  const sizeMap = {
    mini: "mini"
  };
  const IconButton = (props) => {
    return props.href ? /* @__PURE__ */ u$1("a", { ...props, "data-tooltip": props.tooltip, className: classnames("qk_icon_button", props.className, sizeMap[props.size], { tooltip: props.tooltip }), children: props.icon ? /* @__PURE__ */ u$1("i", { class: classnames("qkfont", props.icon) }) : props.children }) : /* @__PURE__ */ u$1("button", { ...props, "data-tooltip": props.tooltip, className: classnames("qk_icon_button", props.className, sizeMap[props.size], { tooltip: props.tooltip }), children: props.icon ? /* @__PURE__ */ u$1("i", { class: classnames("qkfont", props.icon) }) : props.children });
  };
  const version = (_a = GM_info == null ? void 0 : GM_info.script) == null ? void 0 : _a.version;
  const createMoveDrag = (element, cacheRef) => {
    if (element.draged)
      return;
    let isMouseDown = false;
    let initialX, initialY, initialLeft, initialTop, t2;
    element.draged = true;
    element.addEventListener("mousedown", (e2) => {
      var _a2;
      let target = e2.target;
      while (target) {
        if ((_a2 = target.classList) == null ? void 0 : _a2.contains("spirit-qk-icon")) {
          break;
        } else {
          target = target.parentNode;
        }
      }
      if (!target)
        return;
      isMouseDown = true;
      t2 = Date.now();
      initialX = e2.clientX;
      initialY = e2.clientY;
      initialLeft = parseInt(document.defaultView.getComputedStyle(element).left, 10);
      initialTop = parseInt(document.defaultView.getComputedStyle(element).top, 10);
    });
    document.addEventListener("mousemove", (e2) => {
      if (!isMouseDown)
        return;
      const dx = e2.clientX - initialX;
      const dy = e2.clientY - initialY;
      element.style.left = `${initialLeft + dx}px`;
      element.style.top = `${initialTop + dy}px`;
      if (cacheRef.current) {
        cacheRef.current.top = initialTop + dy;
        cacheRef.current.left = initialLeft + dx;
      }
    });
    document.addEventListener("mouseup", () => {
      delete element.style.removeProperty("left");
      if (Date.now() - t2 > 300)
        element.preventClick = true;
      isMouseDown = false;
    });
  };
  const Panel = (props) => {
    const { pannel, user } = useGlobalStore();
    const config = useConfig();
    const [showSpirit, setSpirit] = d(!!(user == null ? void 0 : user.id));
    const timerRef = A();
    const spiritRef = A();
    const positonRef = A({});
    const stateRef = A({ naturalDelay: 1e3, clickDelay: 3e3 });
    const isUpdate = T$1(() => {
      return version2Obj(version).v < version2Obj(config.version).v;
    }, [config]);
    y(() => {
      if (!pannel) {
        if (pannel.type !== "spirit") {
          setSpirit(false);
          stateRef.current.naturalDelay = 5e3;
        }
      }
    }, [pannel]);
    y(() => {
      var _a2;
      if (!showSpirit && !((_a2 = spiritRef.current) == null ? void 0 : _a2.clickted)) {
        clearTimeout(timerRef.current);
        spiritRef.current && (spiritRef.current.clickted = false);
        timerRef.current = setTimeout(() => {
          setSpirit(true);
        }, stateRef.current.naturalDelay);
      }
      if (showSpirit) {
        stateRef.current.naturalDelay = 1e3;
      }
    }, [showSpirit]);
    const handleMouseEnter = () => {
      clearTimeout(timerRef.current);
    };
    const handleMouseLeave = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setSpirit(true);
      }, stateRef.current.clickDelay);
    };
    const handleOpenPanel = (e2) => {
      if (spiritRef.current.preventClick) {
        spiritRef.current.preventClick = false;
        return;
      }
      spiritRef.current.clickted = true;
      setSpirit(false);
    };
    y(() => {
      spiritRef.current && createMoveDrag(spiritRef.current, positonRef);
    }, [showSpirit, spiritRef.current]);
    return /* @__PURE__ */ u$1(k$1, { children: showSpirit ? /* @__PURE__ */ u$1("div", { ref: spiritRef, class: "spirit-qk-icon", style: { top: positonRef.current.top }, onClick: handleOpenPanel, children: /* @__PURE__ */ u$1(SvgLogoIcon, {}) }) : /* @__PURE__ */ u$1("div", { className: "qk-user-panel open", style: { top: positonRef.current.top }, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, children: [
      /* @__PURE__ */ u$1(Notify, { children: props.notify }),
      /* @__PURE__ */ u$1(IconButton, { onClick: () => setSpirit(true), icon: "qk_icon-close1", className: "close" }),
      props.children,
      version && /* @__PURE__ */ u$1("div", { className: "version", children: [
        "\u5F53\u524D\u7248\u672C\uFF1A",
        version,
        isUpdate && /* @__PURE__ */ u$1("span", { children: [
          "\uFF0C\u6700\u65B0\u7248\u672C\uFF1A",
          /* @__PURE__ */ u$1("a", { href: "https://www.baidu.com/", children: config.version })
        ] })
      ] })
    ] }) });
  };
  const index$6 = "";
  const Input = (props) => {
    const inputProps = {
      type: props.type,
      name: props.name,
      value: props.value,
      placeholder: props.placeholder,
      className: classnames("qk_input", props.className),
      style: props.style,
      autoComplete: props.autoComplete,
      autoFocus: props.autoFocus,
      disabled: props.disabled,
      readOnly: props.readOnly,
      onFocus: props.onFocus,
      onChange: (e2) => {
        var _a2;
        (_a2 = props.onChange) == null ? void 0 : _a2.call(props, e2.target.value);
      },
      onInput: props.onInput
    };
    return /* @__PURE__ */ u$1("input", { ...inputProps });
  };
  const index$5 = "";
  const Button = (props) => {
    return /* @__PURE__ */ u$1("button", { ...props, type: props.htmlType, className: classnames("qk_button", props.className, props.block && "block"), style: props.style, children: props.children });
  };
  Button.defaultProps = {
    htmlType: "button"
  };
  Button.IconButton = IconButton;
  const index$4 = "";
  const Loading = (props) => {
    return /* @__PURE__ */ u$1("div", { ref: props.ref, className: classnames("loading-container", { fill: props.fill, absolute: props.absolute }, props.className), style: props.style, children: [
      props.loading && /* @__PURE__ */ u$1("div", { className: "loading-spinner", children: [
        /* @__PURE__ */ u$1("div", { className: "loading-icon", children: /* @__PURE__ */ u$1("i", { className: "qk-icon icon-loading" }) }),
        props.text && /* @__PURE__ */ u$1("div", { className: "loading-text", children: props.text })
      ] }),
      props.children
    ] });
  };
  Loading.defaultProps = {
    fill: true
  };
  const FormDataContext = K$1({ formData: {}, handleChange: () => {
  } });
  const FormErrContext = K$1();
  const handleFocus = (target, name) => {
    if (!target)
      return;
    const targetEl = target.querySelector(`[name="${name}"]`);
    if (targetEl) {
      targetEl.focus();
      targetEl.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  };
  function getFormPropsData(props) {
    const { name, value, rules, initialValue } = props;
    return {
      name,
      value: value || initialValue,
      initialValue,
      rules
    };
  }
  function validate(porps, target) {
    const { rules, value, name } = porps;
    const ret = {
      value,
      message: ""
    };
    try {
      const f2 = rules.find((rule, index2) => {
        const { required, message, pattern, callback, len, min, max, type } = rule;
        if (callback) {
          const valid = callback(value);
          if (valid != void 0 && !valid) {
            ret.message = valid.message || message;
            return true;
          }
        }
        if (required && !value) {
          ret.message = message;
          return true;
        }
        if (pattern && !pattern.test(value)) {
          ret.message = message;
          return true;
        }
        if (len && value.length !== len) {
          ret.message = message;
          return true;
        }
        if (min && value.length < min) {
          ret.message = message;
          return true;
        }
        if (max && value.length > max) {
          ret.message = message;
          return true;
        }
        if (type === "email" && !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]{2,})+$/.test(value)) {
          ret.message = message;
          return true;
        }
        if (type === "phone" && !/^1[3-9]\d{9}$/.test(value)) {
          ret.message = message;
          return true;
        }
        if (type === "url" && !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(value)) {
          ret.message = message;
          return true;
        }
        if (type === "number" && !/^\d+$/.test(value)) {
          ret.message = message;
          return true;
        }
        if (type === "integer" && !/^\d+$/.test(value)) {
          ret.message = message;
          return true;
        }
        return false;
      });
      if (f2) {
        handleFocus(target, name);
        return ret;
      }
    } catch (error) {
      ret.message = error.message;
      handleFocus(target, name);
      return ret;
    }
  }
  const FormItem$1 = (props) => {
    var _a2, _b;
    const { formData, handleChange: handleFormChange, keys } = x(FormDataContext);
    const { errData, setErrData } = x(FormErrContext);
    const contorl = A(null);
    const [error, setError] = d(errData[props.name]);
    y(() => {
      if (!props.name)
        return;
      const p2 = getFormPropsData({
        ...formData[props.name],
        ...props
      });
      formData[props.name] = p2;
      keys[props.name] = true;
      return () => {
        delete keys[props.name];
      };
    }, [props.rules, props.name, props.initialValue]);
    y(() => {
      setError(errData[props.name]);
    }, [errData]);
    const handleChange = (value) => {
      var _a3, _b2, _c;
      if (typeof value === "object" && value !== null) {
        value = value.target ? value.target.value : value;
      }
      const formProps = formData[props.name];
      formProps.value = value;
      handleFormChange(props.name, { ...formProps });
      (_c = (_a3 = props.children) == null ? void 0 : (_b2 = _a3.props).onChange) == null ? void 0 : _c.call(_b2, value);
      const errs = Array.isArray(formProps.rules) && validate(formProps, contorl.current);
      if (errs) {
        setError(errs.message);
        errData[props.name] = errs.message;
      } else {
        setError(null);
        delete errData[props.name];
      }
      setErrData({
        ...errData
      });
    };
    const children = Array.isArray(props.children) ? props.children : J$1(props.children, {
      ...props.children.props,
      name: props.name,
      onChange: handleChange,
      value: (_a2 = formData[props.name]) == null ? void 0 : _a2.value
    });
    if (props.noStyle) {
      return children;
    }
    const required = props.required || ((_b = props.rules) == null ? void 0 : _b.some((rule) => rule.required));
    const className = classnames("qk-form-item", props.className, props.extra || props.help || error ? "qk-form-item-has-extra" : "");
    return /* @__PURE__ */ u$1("div", { className, style: props.style, children: [
      props.label && /* @__PURE__ */ u$1("div", { className: "qk-form-item-label", children: [
        required && /* @__PURE__ */ u$1("span", { className: "qk-form-item-required", children: "*" }),
        props.label
      ] }),
      /* @__PURE__ */ u$1("div", { ref: contorl, className: classnames("qk-form-item-content", error && "error"), children }),
      error && /* @__PURE__ */ u$1("div", { className: "qk-form-item-error", children: error }),
      props.extra && /* @__PURE__ */ u$1("div", { className: "qk-form-item-extra", children: props.extra }),
      props.help && /* @__PURE__ */ u$1("div", { className: "qk-form-item-help", children: props.help })
    ] });
  };
  const index$3 = "";
  const Form = (props) => {
    props.form = props.form || {};
    const [formData, setFormData] = d({});
    const filedKeys = A({});
    const [errData, setErrData] = d({});
    props.form.getFieldValue = (name) => {
      if (name && !filedKeys.current[name])
        return void 0;
      if (name) {
        return formData[name].value;
      }
      return Object.keys(formData).reduce((acc, cur) => {
        if (filedKeys.current[cur]) {
          acc[cur] = formData[cur].value;
        }
        return acc;
      }, {});
    };
    props.form.setFieldsValue = (values) => {
      Object.keys(values).forEach((key) => {
        formData[key].value = values[key];
      });
      setFormData({ ...formData });
    };
    props.form.validateFields = (callback, keys) => {
      const errors = {};
      let hasError = false;
      let message = "";
      let p2;
      if (Array.isArray(callback)) {
        keys = callback;
        callback = void 0;
      }
      if (!callback) {
        p2 = new Promise((resolve, reject) => {
          callback = (errors2, values) => {
            if (errors2) {
              reject(errors2);
            } else {
              resolve(values);
            }
          };
        });
      }
      if (!keys) {
        keys = Object.keys(filedKeys.current);
      }
      for (const key of keys) {
        const valid = Array.isArray(formData[key].rules) && validate(formData[key]);
        if (valid) {
          hasError = true;
          errors[key] = valid.message;
          message = message || valid.message;
        }
      }
      setErrData(errors);
      if (hasError) {
        callback(message);
      } else {
        callback(null, props.form.getFieldValue());
      }
      return p2;
    };
    props.form.resetFields = () => {
      setFormData(Object.keys(formData).reduce((acc, key) => {
        acc[key] = getFormPropsData(formData[key]);
        acc[key].value = acc[key].initialValue;
      }, {}));
    };
    const handleChange = (name, value) => {
      const formProps = getFormPropsData(value);
      setFormData({
        ...formData,
        [name]: formProps
      });
    };
    const handleSubmit = (e2) => {
      props.onSubmit(e2);
    };
    return /* @__PURE__ */ u$1(FormDataContext.Provider, { value: { formData, handleChange, keys: filedKeys.current }, children: /* @__PURE__ */ u$1(FormErrContext.Provider, { value: { errData, setErrData }, children: /* @__PURE__ */ u$1("form", { onSubmit: handleSubmit, children: props.children }) }) });
  };
  Form.useForm = () => {
    const formRef = A({});
    return formRef.current;
  };
  Form.Item = FormItem$1;
  function useCountDown({ time = 60, interval = 1e3, onChange, onEnd }) {
    const [countDown, setCountDown] = d(0);
    y(() => {
      if (countDown === 0) {
        onEnd == null ? void 0 : onEnd();
        return;
      }
      setTimeout(() => {
        setCountDown(countDown - 1);
        onChange == null ? void 0 : onChange(countDown);
      }, interval);
    }, [countDown]);
    function start() {
      setCountDown(time);
    }
    return [countDown, start];
  }
  const FormItem = Form.Item;
  const Login = (props) => {
    const form = Form.useForm();
    const { getUserInfo, setNotify, pannel } = useGlobalStore();
    const config = useConfig();
    const [isRegister, setIsRegister] = d(false);
    const [loading, setLoading] = d(false);
    const [captchaLoading, setCaptchaLoading] = d(false);
    const [countDown, countStart] = useCountDown({});
    y(() => {
      var _a2;
      (_a2 = props.onChangeTitle) == null ? void 0 : _a2.call(props, isRegister ? "\u7528\u6237\u6CE8\u518C" : "\u7528\u6237\u767B\u5F55");
    }, [isRegister]);
    const handleSubmit = (e2) => {
      e2.preventDefault();
      form.validateFields().then(async (values) => {
        setLoading(true);
        try {
          values.type = "email";
          if (isRegister) {
            const res = await register(values);
            if (res.success) {
              setNotify({ content: "\u6CE8\u518C\u6210\u529F", type: "success" });
              setToken(res.data);
              getUserInfo();
              pannel.type = "info";
            } else {
              setNotify({ content: res.message, type: "error" });
            }
          } else {
            const res = await login(values);
            if (res.success) {
              setNotify({ content: "\u767B\u5F55\u6210\u529F", type: "success" });
              setToken(res.data);
              pannel.type = "info";
              getUserInfo();
            } else {
              setNotify({ content: res.message, type: "error" });
            }
          }
        } catch (error) {
          console.log("error", error);
          setNotify({ content: (error == null ? void 0 : error.message) || "network error", type: "error" });
        } finally {
          setLoading(false);
        }
      }).catch((message) => {
        setNotify({ content: message || "\u4FE1\u606F\u9519\u8BEF", type: "error" });
      });
    };
    const handleCreateTemp = async () => {
      setLoading(true);
      try {
        const res = await userTemp();
        if (res.success) {
          setNotify({ message: res.message, type: "success" });
          setToken(res.data);
          getUserInfo();
          pannel.type = "info";
        } else {
          setNotify({ content: res.message, type: "error" });
        }
      } catch (error) {
        setNotify({ content: (error == null ? void 0 : error.message) || "network error", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    const handleCaptcha = () => {
      form.validateFields(["username"]).then(async (values) => {
        setCaptchaLoading(true);
        try {
          const res = await sendVerifyCode({ destination: values.username, verificationType: "email" });
          if (res.success) {
            countStart();
          } else {
            setNotify({ content: res.message, type: "error" });
          }
        } catch (error) {
          setNotify({ content: (error == null ? void 0 : error.message) || "network error", type: "error" });
        } finally {
          setCaptchaLoading(false);
        }
      }).catch((message) => {
        setNotify({ content: message, type: "error" });
      });
    };
    const ruleConfirmPassword = (value) => {
      if (value !== form.getFieldValue("password")) {
        throw new Error("\u4E24\u6B21\u8F93\u5165\u7684\u5BC6\u7801\u4E0D\u4E00\u81F4");
      }
    };
    return /* @__PURE__ */ u$1(Loading, { loading, children: /* @__PURE__ */ u$1("div", { className: "login-container", children: /* @__PURE__ */ u$1(Form, { form, onSubmit: handleSubmit, children: [
      /* @__PURE__ */ u$1(FormItem, { name: "username", rules: [{ required: true, message: "\u8BF7\u8F93\u5165\u7528\u6237\u90AE\u7BB1" }, { type: "email", message: "\u8BF7\u8F93\u5165\u6B63\u786E\u7684\u90AE\u7BB1" }], children: /* @__PURE__ */ u$1(Input, { placeholder: "\u7528\u6237\u90AE\u7BB1" }) }),
      isRegister && /* @__PURE__ */ u$1(FormItem, { name: "code", rules: [{ required: true, message: "\u8BF7\u8F93\u5165\u9A8C\u8BC1\u7801" }], children: [
        /* @__PURE__ */ u$1(FormItem, { name: "code", noStyle: true, children: /* @__PURE__ */ u$1(Input, { style: { flex: 1, marginRight: "10px" }, placeholder: "\u9A8C\u8BC1\u7801" }) }),
        /* @__PURE__ */ u$1(Loading, { loading: captchaLoading, fill: false, children: /* @__PURE__ */ u$1(Button, { type: "primary", disabled: countDown, style: { width: "100px" }, onClick: handleCaptcha, children: countDown ? `${countDown}\u79D2\u540E\u518D\u83B7\u53D6` : "\u83B7\u53D6\u9A8C\u8BC1\u7801" }) })
      ] }),
      /* @__PURE__ */ u$1(FormItem, { name: "password", rules: [{ required: true, message: "\u8BF7\u8F93\u5165\u7528\u6237\u5BC6\u7801" }], children: /* @__PURE__ */ u$1(Input, { type: "password", placeholder: "\u7528\u6237\u5BC6\u7801" }) }),
      isRegister && /* @__PURE__ */ u$1(FormItem, { name: "password_confirm", rules: [{ required: true, message: "\u8BF7\u518D\u6B21\u8F93\u5165\u5BC6\u7801" }, { callback: ruleConfirmPassword }], children: /* @__PURE__ */ u$1(Input, { type: "password", placeholder: "\u786E\u8BA4\u5BC6\u7801" }) }),
      /* @__PURE__ */ u$1(FormItem, { children: /* @__PURE__ */ u$1(Button, { block: true, htmlType: "submit", children: isRegister ? "\u6CE8\u518C" : "\u767B\u5F55" }) }),
      /* @__PURE__ */ u$1("div", { class: "hint center", children: [
        isRegister ? /* @__PURE__ */ u$1(k$1, { children: [
          /* @__PURE__ */ u$1("span", { class: "text", children: "\u5DF2\u6709\u8D26\u53F7\uFF1F" }),
          /* @__PURE__ */ u$1("span", { class: "to-register-btn span-btn", onClick: () => setIsRegister(false), children: "\u7ACB\u5373\u767B\u5F55" })
        ] }) : /* @__PURE__ */ u$1(k$1, { children: [
          /* @__PURE__ */ u$1("span", { class: "text", children: "\u8FD8\u6CA1\u8D26\u53F7\uFF1F" }),
          /* @__PURE__ */ u$1("span", { class: "to-register-btn span-btn", onClick: () => setIsRegister(true), children: "\u7ACB\u5373\u6CE8\u518C" })
        ] }),
        config.ctemp && /* @__PURE__ */ u$1("span", { class: "temp", children: [
          "\u6216",
          /* @__PURE__ */ u$1("span", { class: "span-btn", onClick: handleCreateTemp, children: "\u5148\u4E0D\u767B\u5F55" }),
          "\uFF0C\u76F4\u63A5\u4F7F\u7528",
          /* @__PURE__ */ u$1("font", { color: "red", children: [
            "[\u{1F381}\uFF1A\u65B0\u6CE8\u518C\u8D26\u53F7\u83B7\u5F97",
            config.newUserNum || 3,
            "\u6B21\u89E3\u9501\u6587\u7AE0\u6743\u9650]"
          ] })
        ] })
      ] })
    ] }) }) });
  };
  const index$2 = "";
  const index$1 = "";
  const Confirm = (props) => {
    var _a2;
    const [visible, setVisible] = d(true);
    const elRef = A();
    if (!visible) {
      (_a2 = elRef.current) == null ? void 0 : _a2.parentNode.remove();
      return null;
    }
    const handleOk = (e2) => {
      setVisible(false);
      props.onOk && props.onOk(e2);
    };
    const handleCancel = (e2) => {
      setVisible(false);
      props.onCancel && props.onCancel(e2);
    };
    return /* @__PURE__ */ u$1("div", { ref: elRef, class: "confirm-wrapper", children: /* @__PURE__ */ u$1("div", { class: "confirm-box", children: [
      /* @__PURE__ */ u$1("div", { class: "confirm-title", children: props.title || "\u63D0\u793A" }),
      /* @__PURE__ */ u$1("div", { class: "confirm-content", children: props.children || /* @__PURE__ */ u$1("span", { dangerouslySetInnerHTML: { __html: props.content || "" } }) }),
      /* @__PURE__ */ u$1("div", { class: "confirm-btn-wrapper", children: [
        props.hideCancel ? null : /* @__PURE__ */ u$1("button", { class: "confirm-btn confirm-cancel", onClick: handleCancel, children: "\u53D6\u6D88" }),
        /* @__PURE__ */ u$1("button", { class: "confirm-btn confirm-ok", onClick: handleOk, children: "\u786E\u5B9A" })
      ] })
    ] }) });
  };
  function Dialog(props) {
    const elRef = A();
    y(() => {
      const el = elRef.current;
      el && document.body.appendChild(el);
      return () => {
        if (el == null ? void 0 : el.parentNode) {
          el.parentNode.removeChild(el);
        }
      };
    }, []);
    if (!props.visible)
      return null;
    return /* @__PURE__ */ u$1("div", { ref: elRef, class: "qk-dialog-container", children: [
      props.mask && /* @__PURE__ */ u$1("div", { class: "mask" }),
      /* @__PURE__ */ u$1("div", { class: "dialog-body", children: [
        /* @__PURE__ */ u$1(Notify, { children: props.notify }),
        /* @__PURE__ */ u$1(Button.IconButton, { className: "close", icon: "qk_icon-close1", tooltip: "\u5173\u95ED\u7A97\u53E3", onClick: props.onClose }),
        props.children
      ] })
    ] });
  }
  Dialog.confirm = (options) => {
    const div = document.createElement("div");
    const app2 = E$1(/* @__PURE__ */ u$1(Confirm, { ...options }), div);
    document.body.appendChild(div);
    console.log("app", app2);
  };
  const Tip = (props) => {
    let name = "";
    if (props.time == 30) {
      name = "\u6708\u5361";
    } else if (props.time == 90) {
      name = "\u5B63\u5361";
    } else if (props.time == 365) {
      name = "\u5E74\u5361";
    } else {
      return "\u611F\u8C22\u4F7F\u7528";
    }
    if (!props.num) {
      return "\u611F\u8C22\u4F7F\u7528";
    }
    return /* @__PURE__ */ u$1("span", { children: [
      "\u{1F381}\u60A8\u8D2D\u4E70\u7684\u662F",
      name,
      "\uFF0C\u5E97\u94FA\u5E26\u56FE\u4E94\u661F\u597D\u8BC4\u540E\u622A\u56FE\u53D1\u7BA1\u7406\u5458(v\uFF1A",
      /* @__PURE__ */ u$1("b", { children: "qk_admin" }),
      ")\u9001",
      /* @__PURE__ */ u$1("font", { color: "red", children: props.num }),
      "\u6B21\u4E0B\u8F7D\u6B21\u6570[\u9650\u65F6\u6D3B\u52A8]\u{1F381}"
    ] });
  };
  const Active = (props) => {
    const { activeModal, changeActionModal, getUserInfo, setNotify } = x(GlobalContext);
    const config = useConfig();
    const [loading, setLoading] = d(false);
    const [key, setKey] = d("");
    const handleActive = async () => {
      if (!key) {
        setNotify({ content: "\u8BF7\u8F93\u5165\u6FC0\u6D3B\u7801", type: "warning" });
        return;
      }
      setLoading(true);
      try {
        const res = await useCardkey({ key });
        if (!res.success) {
          setNotify({ content: res.message, type: "warning" });
          setLoading(false);
          return;
        }
        setKey("");
        const day = key;
        let appraise = config.appraise;
        if (appraise) {
          appraise = appraise.split("crlf.crlf");
          appraise = appraise.map((item) => {
            const [day2, tip] = item.split("|");
            return { day: day2, tip };
          }).find((item) => item.day == day);
          appraise = appraise ? appraise.tip : "";
        }
        Dialog.confirm({
          title: "\u6FC0\u6D3B\u6210\u529F",
          children: /* @__PURE__ */ u$1(Tip, { time: day, num: appraise }),
          hideCancel: true,
          onOk: () => {
            getUserInfo();
            changeActionModal(false);
          }
        });
      } catch (error) {
        console.log(error);
        setNotify({ content: "\u6FC0\u6D3B\u5931\u8D25", type: "warning" });
      } finally {
        setLoading(false);
      }
    };
    return /* @__PURE__ */ u$1(Dialog, { visible: activeModal == null ? void 0 : activeModal.show, onClose: () => changeActionModal(false), children: /* @__PURE__ */ u$1("div", { className: "active-container", children: [
      /* @__PURE__ */ u$1("div", { class: "left", children: [
        /* @__PURE__ */ u$1("h2", { children: "\u5361\u5BC6\u5151\u6362" }),
        /* @__PURE__ */ u$1(Input, { value: key, placeholder: "\u8BF7\u8F93\u5165\u5361\u53F7\u6216\u5361\u5BC6", onInput: (e2) => setKey(e2.target.value), style: { marginBottom: "20px" } }),
        /* @__PURE__ */ u$1(Loading, { loading, children: /* @__PURE__ */ u$1(Button, { block: true, onClick: handleActive, children: "\u5151\u6362" }) }),
        /* @__PURE__ */ u$1("div", { class: "tip", style: { marginTop: "10px" }, children: config.activeTip })
      ] }),
      /* @__PURE__ */ u$1("div", { class: "right", children: [
        /* @__PURE__ */ u$1("p", { class: "title", children: [
          "\u5361\u5BC6\u83B7\u53D6",
          config.help ? /* @__PURE__ */ u$1(IconButton, { href: config.help, size: "mini", icon: "qk_icon-help", tooltip: "\u4F7F\u7528\u6587\u6863", target: "_blank" }) : null
        ] }),
        /* @__PURE__ */ u$1("a", { href: config.goodsUrl, target: "_blank", children: /* @__PURE__ */ u$1("img", { src: config.goodsQr, class: "goods-qr", alt: "\u70B9\u51FB\u53BB\u8D2D\u4E70", title: "\u70B9\u51FB\u53BB\u8D2D\u4E70" }) }),
        /* @__PURE__ */ u$1("div", { class: "tip", children: config.goodsTip })
      ] })
    ] }) });
  };
  class Toast {
    static show(text, duration = 2e3) {
      const toast = document.createElement("div");
      toast.classList.add("qk-toast");
      toast.innerText = text;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.remove();
      }, duration);
    }
  }
  const copyAstrict = () => {
    document.addEventListener(
      "copy",
      (e2) => {
        e2.stopPropagation();
      },
      true
    );
    $("#content_views code").removeAttr("onClick");
    $(".hljs-button.signin").attr("data-title", "\u590D\u5236").removeClass("active").removeAttr("onClick");
    $("#content_views").on("click", ".hljs-button.signin", function(e2) {
      navigator.clipboard.writeText(
        $(this).closest("pre").find("code")[0].innerText.replace(/[\u00A0]/gi, " ")
      ).then((res) => {
        $(this).attr("data-title", "\u590D\u5236\u6210\u529F");
        setTimeout(() => {
          $(this).attr("data-title", "\u590D\u5236");
        }, 3e3);
      });
    });
  };
  const immersionRead = () => {
    setTimeout(() => {
      if ($(".option-box.sidecolumn").length)
        return;
      const hide_aside = +getStore("hide_aside") || 0;
      const $btn = $(`<a class="option-box sidecolumn" style="display:flex">
      <span class="hide">
        <img src="https://csdnimg.cn/release/blogv2/dist/pc/img/iconHideSide.png" alt="" srcset="">
        <span class="show-txt">\u9690\u85CF<br>\u4FA7\u680F</span>
      </span>
      <span class="show" style="display:none">
        <img src="https://csdnimg.cn/release/blogv2/dist/pc/img/iconShowSide.png" alt="" srcset="">
        <span class="show-txt">\u663E\u793A<br>\u4FA7\u680F</span>
      </span>
    </a>`);
      const $aside = $(".blog_container_aside");
      const $right = $(".recommend-right");
      const showBtn = (type) => {
        if (type) {
          $right.addClass("hide-aside");
          $aside.addClass("hide-aside");
          $btn.find(".show").show();
          $btn.find(".hide").hide();
          $btn.attr("data-type", "show");
        } else {
          $right.removeClass("hide-aside");
          $aside.removeClass("hide-aside");
          $btn.find(".show").hide();
          $btn.find(".hide").show();
          $btn.attr("data-type", "hide");
        }
      };
      showBtn(hide_aside);
      $btn.on("click", function() {
        const type = this.dataset.type || "hide";
        if (type === "hide") {
          showBtn(1);
          setStore("hide_aside", 1);
        } else {
          showBtn(0);
          setStore("hide_aside", 0);
        }
      });
      $(".csdn-side-toolbar .option-box").eq(0).before($btn);
    }, 1e3);
  };
  const normalMore = () => {
    const $hideBox = $(".hide-article-box");
    const btn = $hideBox.find(".btn-readmore");
    if (btn.length) {
      btn.removeClass("no-login").find(".follow-text").text("\u5C55\u5F00\u5168\u6587");
    }
  };
  const loginModule = () => {
    const loginBtn = $(".toolbar-btns .toolbar-btn-login");
    let btnClick = false;
    loginBtn.on("click", () => btnClick = true);
    const mutation = new MutationObserver((mon) => {
      const lgm = mon.find(
        (m2) => $(m2.addedNodes[0]).hasClass("passport-login-container")
      );
      if (lgm) {
        const dom = $(lgm.addedNodes[0]);
        if (!btnClick)
          dom.remove();
        else
          dom.find("img").one("click", () => btnClick = false);
      }
    });
    mutation.observe(document.body, { childList: true });
  };
  const footerList = () => {
    function fn2() {
      const list = $(".recommend-item-box");
      list.each((i2, el) => {
        if ($(el).find(".list-type-box")[0])
          return;
        const url = $(el).attr("data-url") || "";
        if (!url)
          return;
        if (url.indexOf("blog.csdn.net") !== -1) {
          $(el).prepend(`<div class="list-type-box">\u535A</div>`);
        } else if (url.indexOf("download.csdn.net") !== -1) {
          $(el).prepend(`<div class="list-type-box">\u6587</div>`);
        } else if (url.indexOf("edu.csdn.net") !== -1) {
          $(el).prepend(`<div class="list-type-box">\u80B2</div>`);
        } else {
          $(el).prepend(`<div class="list-type-box">\u5176</div>`);
        }
      });
    }
    setTimeout(() => {
      fn2();
    }, 5e3);
  };
  let dload = false;
  const downloadAritcle = async () => {
    const $content = $("#content_views");
    if (window.unsafeWindow.unlockArticle && !$content.hasClass("rendered")) {
      Toast.show("\u8BF7\u5148\u89E3\u9501\u6587\u7AE0\uFF0C\u518D\u4E0B\u8F7D");
      return;
    }
    const $title = $("#articleContentId");
    const title = $title.text();
    let html = $content.html();
    const imgs = $content.find("img");
    const imgsUrl = imgs.map((i2, el) => {
      const src = el.src;
      return src;
    });
    if (dload)
      return Toast.show("\u6B63\u5728\u5904\u7406\u4E0B\u8F7D\u4E2D\uFF0C\u8BF7\u7A0D\u7B49");
    if (!window.unsafeWindow.JSZip)
      return Toast.show("\u4E0B\u8F7D\u5931\u8D25\uFF0C\u8BF7\u8054\u7CFB\u7BA1\u7406\u5458");
    dload = true;
    try {
      const zip = new JSZip();
      const folder = zip.folder("files");
      await Promise.all(
        imgsUrl.get().map(async (src) => {
          const file = await imgUrl2File(src);
          html = html.replace(src, "./files/" + file.name);
          folder.file(file.name, file);
        })
      );
      const styles = await loadStyleSheets(folder);
      const links = styles.map((link) => `<link rel="stylesheet" href="${link}">`);
      const htmlDom = $(`<div>${$title.get(0).outerHTML}${html}</div>`);
      htmlDom.find(".hide-preCode-box").remove();
      zip.file(
        (articleId || title) + ".html",
        stringTemplate(template, {
          content: htmlDom.html(),
          title,
          contentClass: $content.get(0).className,
          codeStyle: codeStyle || "atom-one-light",
          links: links.join("\n")
        })
      );
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a2 = document.createElement("a");
      a2.href = url;
      a2.download = title + ".zip";
      a2.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      Toast.show("\u6587\u7AE0\u6253\u5305\u5931\u8D25\uFF0C\u8BF7\u8054\u7CFB\u7BA1\u7406\u5458");
    } finally {
      dload = false;
    }
  };
  const loadStyleSheets = async (folder) => {
    var _a2;
    const sheets = document.styleSheets;
    const styles = [];
    for (let i2 = 0; i2 < sheets.length; i2++) {
      const element = sheets[i2];
      const cssname = (_a2 = element.href) == null ? void 0 : _a2.split("/").pop();
      if ([
        "detail_enter",
        "kdoc_html_views",
        "ck_htmledit_views",
        "markdown_views",
        "style",
        codeStyle || "-------"
      ].some((name) => cssname == null ? void 0 : cssname.includes(name))) {
        const namePath = "./files/" + cssname;
        const css = await ajax({
          url: element.href,
          method: "GET",
          dataType: "text"
        });
        folder.file(cssname, css);
        styles.push(namePath);
      }
    }
    return styles;
  };
  function markdown_line() {
    $(".markdown_views pre").addClass("prettyprint"), $("pre.prettyprint code").append(`<div class="hljs-button signin" data-title="\u590D\u5236"></div>`).each(function() {
      var t2 = $(this).text().split("\n").length + ($(this).hasClass("hljs") ? 1 : 0), e2 = $("<ul/>").addClass("pre-numbering").hide();
      $(this).addClass("has-numbering").parent().append(e2);
      for (var o2 = 1; o2 < t2; o2++)
        e2.append($("<li/>").text(o2));
      e2.fadeIn(1700);
    }), $(".pre-numbering li").css("color", "#999"), setTimeout(function() {
      $(".math").each(function(t2, e2) {
        $(this).find("span").last().css("color", "#fff");
      });
    }), setTimeout(function() {
      $(".toc a[target='_blank']").attr("target", ""), $("a.reversefootnote,a.footnote").attr("target", "");
    }, 500);
  }
  function html_line() {
    hljs.initHighlighting();
    hljs.initCopyButtonOnLoad();
    hljs.initLineNumbersOnLoad();
    $("pre .language-plain").length > 0 && $("pre .language-plain").each(function(E2, e2) {
      var n2 = hljs.highlightAuto(dealtHtmlFormat(e2.innerHTML));
      e2.innerHTML = n2.value, e2.className = "language-" + n2.language;
    });
    $("pre .hljs-button").removeClass("active").attr("data-title", "\u590D\u5236").removeAttr("onClick");
  }
  function createMenu(dom) {
    var _a2, _b;
    const menuBox = $(".toc-box");
    const menu = dom.find(".toc ul");
    const _menu = $((_a2 = menu[0]) == null ? void 0 : _a2.outerHTML.replace(/ul|ul/g, "ol"));
    _menu.find("li").each(function(i2, el) {
      if (el.querySelector("ul,ol")) {
        el.classList.add("sub-box");
      }
    });
    menuBox.html((_b = _menu[0]) == null ? void 0 : _b.outerHTML);
  }
  function parseWkArticle(content) {
    var _a2;
    const contentDom = document.querySelector(".article-box");
    (_a2 = contentDom.classList) == null ? void 0 : _a2.add("rendered");
    const boxVue = contentDom == null ? void 0 : contentDom.__vue__;
    if (boxVue) {
      boxVue.columnInfo && (boxVue.columnInfo.isShowAll = true);
      if (boxVue.curUserInfo) {
        boxVue.curUserInfo.isVip = true;
        boxVue.curUserInfo.userName = boxVue.curUserInfo.userName || "\u7B2C\u4E03\u5C4A\u7F51\u53CB";
      } else {
        boxVue.curUserInfo = {
          isVip: true,
          userName: "\u7B2C\u4E03\u5C4A\u7F51\u53CB"
        };
      }
      try {
        boxVue.$store.state.pageData.userBaseInfo || (boxVue.$store.state.pageData.userBaseInfo = {
          userName: "qk_007"
        });
      } catch (error) {
      }
      boxVue.answer = dealtHtmlFormat(content);
      setTimeout(() => {
        boxVue.dealCode();
        setTimeout(() => {
          boxVue.showAll = true;
          boxVue.isForbid = false;
        }, 300);
      }, 100);
    }
  }
  const parseArticle = (content, type) => {
    var _a2;
    if (type === "wk") {
      parseWkArticle(content);
    } else {
      const $content = $("#content_views");
      $content.html(content);
      (_a2 = document.querySelector("#article_content")) == null ? void 0 : _a2.removeAttribute("style");
      $content.addClass("rendered");
      setTimeout(() => {
        if ($content.hasClass("htmledit_views")) {
          html_line();
        } else if ($content.hasClass("markdown_views")) {
          markdown_line();
        }
        createMenu($content);
        $content.find("pre").each(function(t2, e2) {
          e2 = $(e2);
          const code = e2.find("code");
          code.height() > 340 ? (e2.addClass("set-code-hide"), e2.append(
            '<div class="hide-preCode-box"><span class="hide-preCode-bt"><img class="look-more-preCode contentImg-no-view" src="' + blogStaticHost + "dist/pc/img/newCodeMore" + skinStatus + '.png" alt="" title=""></span></div>'
          )) : e2.addClass("set-code-show");
        });
        $(".hide-article-box").hide();
      });
    }
  };
  const ExecuteButton$1 = (props) => {
    const elRef = A(null);
    const rootRef = A(document.createElement("div"));
    const [loading, setLoading] = d(false);
    const { user, getUserInfo, changeActionModal, setToolbar, changePannel } = useGlobalStore();
    const startUnlock = async (refresh = false) => {
      var _a2;
      setLoading(true);
      try {
        const res = await getArticle({
          url: location.origin + location.pathname,
          type: "plugin",
          title: (_a2 = document.querySelector("#articleContentId,h1.title")) == null ? void 0 : _a2.innerText
        });
        if (res.success) {
          if (refresh) {
            getUserInfo();
          }
          const content = res.data;
          parseArticle(content, props.wk ? "wk" : "");
          setToolbar({ unlock: false });
        } else {
          Toast.show(res.message);
        }
      } catch (error) {
        console.log(error);
        Toast.show(error.message);
      } finally {
        setLoading(false);
      }
    };
    const handleOpenVip = async () => {
      if (loading)
        return;
      if (!(user == null ? void 0 : user.id)) {
        Toast.show("\u8BF7\u5148\u767B\u5F55");
        changePannel({ type: "login" });
        return;
      }
      if (user.expirationTime < Date.now()) {
        if (user.points < 6) {
          changeActionModal(true, "\u60A8\u7684\u4F7F\u7528\u65F6\u95F4\u5DF2\u5230\uFF0C\u9700\u8981\u7EED\u671F\u518D\u4F7F\u7528");
          return;
        } else {
          Dialog.confirm({
            title: "\u7EED\u671F",
            content: `\u60A8\u7684\u6587\u7AE0\u89E3\u9501\u4F7F\u7528\u65F6\u95F4\u5DF2\u5230\u671F\uFF0C\u5C06\u4F7F\u7528\u4E0B\u8F7D\u79EF\u5206\u89E3\u9501\u6587\u7AE0\uFF086\u79EF\u5206\u4E00\u6B21;20\u79EF\u5206\u4E0B\u8F7D\u4E00\u6B21\u6587\u4EF6\uFF0C\u5F53\u524D\u79EF\u5206\uFF1A${user.points}\uFF09\uFF0C\u662F\u5426\u7EE7\u7EED\uFF1F`,
            onOk: () => {
              startUnlock(true);
            }
          });
          return;
        }
      }
      startUnlock();
    };
    y(() => {
      if (props.container) {
        props.container.appendChild(elRef.current);
        window.unsafeWindow.unlockArticle = handleOpenVip;
      }
    }, [props.container]);
    return $$1(/* @__PURE__ */ u$1("a", { ref: elRef, class: "qk-openvippay", style: props.style, onClick: handleOpenVip, children: /* @__PURE__ */ u$1(Loading, { loading, text: "\u89E3\u9501\u4E2D...", children: [
      /* @__PURE__ */ u$1("i", { className: "logo-icon", children: /* @__PURE__ */ u$1(SvgLogoIcon, {}) }),
      /* @__PURE__ */ u$1("span", { children: "\u89E3\u9501\u5168\u6587" })
    ] }) }), rootRef.current);
  };
  const ArticleButton = () => {
    const [boxList, setBoxList] = d([]);
    const { setToolbar } = useGlobalStore();
    y(() => {
      const hideBox = document.querySelector(".hide-article-box");
      if (hideBox) {
        const vipMask = hideBox.querySelector(".vip-mask");
        vipMask && boxList.push({ container: vipMask, style: { marginTop: "10px" } });
      }
      const wkBtnWrap = document.querySelector(".open-btn-wrap");
      if (wkBtnWrap) {
        boxList.push({ container: wkBtnWrap, wk: true, style: { marginTop: "10px" } });
      }
      const wkColumn = document.querySelector(".vip-btn");
      if (wkColumn) {
        const mutation = new MutationObserver((mon) => {
          const lgm = mon.find(
            (m2) => m2.addedNodes[0].classList.contains("fixed-bottom")
          );
          if (lgm) {
            const dom = lgm.addedNodes[0].querySelector(".vip-btn");
            const obj2 = {
              wk: true,
              style: {
                marginTop: "0",
                marginBottom: "10px"
              },
              container: dom
            };
            boxList.push(obj2);
            mutation.disconnect();
          }
        });
        mutation.observe(document.querySelector(".layout-center"), { childList: true });
        const obj = {
          wk: true,
          style: {
            marginTop: "0",
            marginBottom: "10px"
          },
          container: wkColumn
        };
        boxList.push(obj);
      }
      const column = hideBox == null ? void 0 : hideBox.querySelector(".column-mask");
      if (column) {
        const group = document.querySelector(".column-group");
        if (group) {
          const btn = group.querySelector(
            ".column-studyvip-free,.article-column-subscribe"
          );
          if (!btn) {
            return;
          }
        }
        const vipMask = document.createElement("div");
        vipMask.classList.add("vip-mask");
        column.after(vipMask);
        boxList.push({ container: vipMask, column: true, style: { marginTop: "10px" } });
        setBoxList([...boxList]);
      }
    }, []);
    y(() => {
      if (boxList.length) {
        setToolbar({ unlock: true });
      }
    }, [boxList]);
    return boxList.map((item, index2) => {
      return /* @__PURE__ */ u$1(ExecuteButton$1, { ...item }, index2);
    });
  };
  const index = "";
  const Field = (props) => {
    return /* @__PURE__ */ u$1("div", { className: classNames("info-row", props.className), style: props.style, children: [
      /* @__PURE__ */ u$1("div", { className: "info-label", children: props.label }),
      /* @__PURE__ */ u$1("div", { className: "info-value", children: props.children })
    ] });
  };
  const Vistor = () => {
    const { changePannel, setNotify } = useGlobalStore();
    const handleJumpLogin = () => {
      changePannel({ type: "login" });
      setNotify({ type: "info", content: "\u8BF7\u53CA\u65F6\u767B\u5F55\uFF01", delay: 3e3, cb: () => {
        setNotify(null);
      } });
    };
    return /* @__PURE__ */ u$1("span", { children: [
      "\u6B63\u5728\u4EE5\u6E38\u5BA2\u8EAB\u4EFD\u4F7F\u7528\uFF0C",
      /* @__PURE__ */ u$1("span", { class: "span-a", onClick: handleJumpLogin, children: "\u53BB\u767B\u9646" })
    ] });
  };
  const UserInfo = (props) => {
    const { changeActionModal, getUserInfo, user, toolbar, setNotify } = useGlobalStore();
    const [unlocked, setUnlocked] = d(false);
    const config = useConfig();
    const handleGoBuy = () => {
      window.unsafeWindow.open(config.goodsUrl);
    };
    const handleUnlock = () => {
      var _a2;
      if (window.unsafeWindow.unlockArticle) {
        (_a2 = window.unsafeWindow.unlockArticle) == null ? void 0 : _a2.call(window.unsafeWindow);
      }
    };
    const handleDownload = () => {
      downloadAritcle();
    };
    y(() => {
      var _a2;
      const s2 = user.expirationDate ? new Date(user.expirationDate).getTime() - Date.now() : 0;
      if (config.greeting) {
        let [t2, v2] = (_a2 = config.greeting) == null ? void 0 : _a2.split("|");
        v2 = v2 || t2;
        t2 = { 1: "info", 2: "warning", 3: "error" }[t2] || "success";
        setNotify({ type: t2, content: v2, delay: 0 });
      } else if (!user.email) {
        setNotify({ type: "warning", content: /* @__PURE__ */ u$1(Vistor, {}), delay: 0 });
      } else {
        if (s2 <= 0) {
          setNotify({ type: "warning", content: "\u60A8\u7684\u4F1A\u5458\u5DF2\u5230\u671F\uFF0C\u8BF7\u7EED\u8D39\u518D\u4F7F\u7528\uFF01", delay: 0 });
        } else if (s2 <= 3 * 864e5) {
          setNotify({ type: "warning", content: "\u60A8\u7684\u4F1A\u5458\u5373\u5C06\u5230\u671F\uFF0C\u8BF7\u53CA\u65F6\u7EED\u671F\uFF01", delay: 0 });
        } else {
          setNotify({ type: "success", content: "\u6B22\u8FCE\u4F7F\u7528qk\u63D2\u4EF6", delay: 0 });
        }
      }
    }, [config]);
    return /* @__PURE__ */ u$1("div", { children: [
      user.email ? /* @__PURE__ */ u$1(Field, { label: "\u90AE\u7BB1\u8D26\u53F7", children: [
        user.email || "-",
        /* @__PURE__ */ u$1(IconButton, { icon: "qk_icon-sync", tooltip: "\u66F4\u65B0\u4FE1\u606F", size: "mini", onClick: getUserInfo })
      ] }) : /* @__PURE__ */ u$1(Field, { label: "ID", children: [
        user.id,
        /* @__PURE__ */ u$1(IconButton, { icon: "qk_icon-sync", tooltip: "\u66F4\u65B0\u4FE1\u606F", size: "mini", onClick: getUserInfo })
      ] }),
      /* @__PURE__ */ u$1(Field, { label: "\u4F1A\u5458\u72B6\u6001", children: [
        /* @__PURE__ */ u$1("span", { class: "vip-badge", children: user.vipLevel > 1 ? "VIP" : "\u4F53\u9A8C" }),
        config.goodsUrl ? /* @__PURE__ */ u$1(IconButton, { onClick: handleGoBuy, icon: "qk_icon-crown", size: "mini", tooltip: "\u53BB\u8D2D\u4E70\u4F1A\u5458" }) : null
      ] }),
      /* @__PURE__ */ u$1(Field, { label: "\u5230\u671F\u65F6\u95F4", children: user.expirationDate || "-" }),
      /* @__PURE__ */ u$1(Field, { label: "\u79EF\u5206\u4F59\u989D", children: [
        user.points || "-",
        /* @__PURE__ */ u$1(IconButton, { icon: "qk_icon-plus-circle-fill", size: "mini", tooltip: "\u5145\u503C\u79EF\u5206", onClick: () => changeActionModal(true) })
      ] }),
      /* @__PURE__ */ u$1("div", { class: "note", children: [
        "\u4E0B\u8F7D\u6D88\u8017\uFF1A20\u79EF\u5206/\u6B21",
        /* @__PURE__ */ u$1("br", {}),
        "\u89E3\u9501\u6D88\u8017\uFF1A6\u79EF\u5206/\u6B21"
      ] }),
      /* @__PURE__ */ u$1("div", { className: "action-bar", children: [
        toolbar.unlock && (unlocked ? /* @__PURE__ */ u$1(IconButton, { icon: "qk_icon-sync", tooltip: "\u91CD\u65B0\u89E3\u9501" }) : /* @__PURE__ */ u$1(IconButton, { onClick: handleUnlock, icon: "qk_icon-unlock", tooltip: "\u89E3\u9501\u5168\u6587" })),
        toolbar.renew && /* @__PURE__ */ u$1(IconButton, { icon: "qk_icon-cart-plus", tooltip: "\u7EED\u8D39\u4F1A\u5458", onClick: () => changeActionModal(true) }),
        toolbar.downloadArticle && /* @__PURE__ */ u$1(IconButton, { onClick: handleDownload, icon: "qk_icon-download", tooltip: "\u4E0B\u8F7D\u6587\u7AE0" }),
        toolbar.setting && /* @__PURE__ */ u$1(IconButton, { icon: "qk_icon-cog", tooltip: "\u8BBE\u7F6E" })
      ] })
    ] });
  };
  const ExecuteButton = (props) => {
    const [loading, setLoading] = d(false);
    const { user, getUserInfo, changeActionModal, changePannel } = useGlobalStore();
    const rootRef = A(document.createElement("div"));
    const elRef = A(null);
    const data = T$1(() => {
      var _a2, _b;
      return (_b = (_a2 = window.unsafeWindow.__INITIAL_STATE__) == null ? void 0 : _a2.pageData) == null ? void 0 : _b.sourceInfo;
    }, []);
    y(() => {
      var _a2;
      (_a2 = props.firstElement) == null ? void 0 : _a2.before(elRef.current.base);
    });
    const handleDownload = async () => {
      if (loading)
        return;
      if (!(user == null ? void 0 : user.id)) {
        Toast.show("\u8BF7\u5148\u767B\u5F55");
        changePannel({ type: "login" });
        return;
      }
      setLoading(true);
      try {
        const params = {
          fileId: data.sourceId,
          type: data.fileType,
          name: data.title,
          description: data.description.substr(0, 512),
          title: data.title,
          size: data.fileSize,
          url: location.origin + location.pathname,
          author: data.sourceAuthor,
          price: data.sourcePrice,
          score: data.sourceScore,
          uploadTime: data.pubDate
        };
        const res = await sourceGetUrl(params);
        if (res.success) {
          getUserInfo();
          const a2 = document.createElement("a");
          a2.href = res.data.url;
          a2.download = [data.title, data.fileType].join(".");
          a2.click();
        } else if (res.code === 400) {
          changeActionModal(true, "\u60A8\u7684\u4E0B\u8F7D\u79EF\u5206\u4E0D\u8DB3\uFF0C\u8BF7\u5145\u503C\u540E\u518D\u4F7F\u7528");
        } else {
          Toast.show(res.message);
        }
      } catch (error) {
        Toast.show((error == null ? void 0 : error.message) || "network error");
      } finally {
        setLoading(false);
      }
    };
    return $$1(/* @__PURE__ */ u$1(Loading, { ref: elRef, loading, fill: false, className: "mr-12", style: { borderRadius: 20 }, children: /* @__PURE__ */ u$1("button", { type: "button", class: "el-button relative el-button--warning el-button--medium qk-download", onClick: handleDownload, children: [
      /* @__PURE__ */ u$1("i", { className: "logo-icon", children: /* @__PURE__ */ u$1(SvgLogoIcon, {}) }),
      /* @__PURE__ */ u$1("span", { class: "va-middle show", children: "\u4E0B\u8F7D\u6587\u4EF6" })
    ] }) }), rootRef.current);
  };
  const DownloadButton = () => {
    const [btnList, setBtnList] = d([]);
    const data = T$1(() => {
      var _a2, _b;
      return (_b = (_a2 = window.unsafeWindow.__INITIAL_STATE__) == null ? void 0 : _a2.pageData) == null ? void 0 : _b.sourceInfo;
    }, []);
    y(() => {
      if ((data == null ? void 0 : data.sourcePrice) === 0) {
        const btn = document.querySelector("#downloadBtn .el-button");
        const btn2 = document.querySelector(".nav-bottom-wrap .el-button");
        setBtnList([btn, btn2]);
      }
    }, [data]);
    if (!data)
      return null;
    return btnList.map((btn, index2) => /* @__PURE__ */ u$1(ExecuteButton, { firstElement: btn }, index2));
  };
  function App() {
    return /* @__PURE__ */ u$1(GlobalProvider, { children: /* @__PURE__ */ u$1(Content, {}) });
  }
  function Content() {
    const { user, pageConfig, pannel } = useGlobalStore();
    const [title, setTitle] = d({ notify: user.id ? "QK\u5DE5\u5177" : "\u7528\u6237\u767B\u5F55", notifyType: "info" });
    const handleChangeTitle = (text, type) => {
      title.notify = text;
      title.notifyType = type || title.type;
      setTitle({ ...title });
    };
    y(() => {
      copyAstrict();
      immersionRead();
      normalMore();
      loginModule();
      footerList();
    }, [pageConfig]);
    const isLogin = !(user == null ? void 0 : user.id) || pannel.type === "login";
    return /* @__PURE__ */ u$1(k$1, { children: [
      /* @__PURE__ */ u$1(Panel, { ...title, children: isLogin ? /* @__PURE__ */ u$1(Login, { onChangeTitle: handleChangeTitle }) : /* @__PURE__ */ u$1(UserInfo, { onChangeTitle: handleChangeTitle }) }),
      /* @__PURE__ */ u$1(Active, {}),
      /* @__PURE__ */ u$1(ArticleButton, {}),
      /* @__PURE__ */ u$1(DownloadButton, {})
    ] });
  }
  const createApp = () => {
    const root = document.createElement("div");
    E$1(/* @__PURE__ */ u$1(App, {}), root);
    document.body.appendChild(root);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://at.alicdn.com/t/c/font_4739727_3mijowsmvfx.css";
    document.head.appendChild(link);
    return root;
  };
  createApp();
})();
