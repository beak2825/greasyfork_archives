// ==UserScript==
// @name              阿里云盘下载
// @namespace         https://github.com/syhyz1990/baiduyun
// @version           0.0.1
// @author            gepik
// @description       👆👆👆👆👆👆👆 - 支持批量获取 ✅百度网盘
// @license           AGPL-3.0-or-later
// @match             *://www.aliyundrive.com/s/*
// @match             *://www.aliyundrive.com/drive*
// @require           https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @require           https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.all.min.js
// @require           https://unpkg.com/js-md5@0.7.3/build/md5.min.js
// @connect           aliyundrive.com
// @connect           localhost
// @connect           *
// @run-at            document-idle
// @grant             unsafeWindow
// @grant             GM_xmlhttpRequest
// @grant             GM_setClipboard
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_openInTab
// @grant             GM_info
// @grant             GM_registerMenuCommand
// @grant             GM_cookie
// @downloadURL https://update.greasyfork.org/scripts/472042/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/472042/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let pt = '', selectList = [], params = {}, mode = 'rpc', width = 800, pan = {}, color = '',dirTree = [],
      doc = $(document), progress = {}, request = {}, ins = {}, idm = {};
  const scriptInfo = GM_info.script;
  const version = scriptInfo.version;
  const author = scriptInfo.author;
  const name = scriptInfo.name;
  const customClass = {
      popup: 'pl-popup',
      header: 'pl-header',
      title: 'pl-title',
      closeButton: 'pl-close',
      content: 'pl-content',
      input: 'pl-input',
      footer: 'pl-footer'
  };


  let toast = Swal.mixin({
      toast: false,
      position: 'top',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: false,
      didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
      }
  });
// 初始化rpc配置
  GM_setValue('setting_rpc_domain', 'https://ariarpc.gepik.top');
GM_setValue('setting_rpc_port', '5001');
GM_setValue('setting_rpc_path', '/jsonrpc');
GM_setValue('setting_rpc_token', '3CgCDiZt6EzuxK65');

  const message = {
      success: (text) => {
          toast.fire({title: text, icon: 'success'});
      },
      error: (text) => {
          toast.fire({title: text, icon: 'error'});
      },
      warning: (text) => {
          toast.fire({title: text, icon: 'warning'});
      },
      info: (text) => {
          toast.fire({title: text, icon: 'info'});
      },
      question: (text) => {
          toast.fire({title: text, icon: 'question'});
      }
  };

  let base = {

      getCookie(name) {
          let arr = document.cookie.replace(/\s/g, "").split(';');
          for (let i = 0, l = arr.length; i < l; i++) {
              let tempArr = arr[i].split('=');
              if (tempArr[0] === name) {
                  return decodeURIComponent(tempArr[1]);
              }
          }
          return '';
      },

      isType(obj) {
          return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
      },

      getValue(name) {
          return GM_getValue(name);
      },

      setValue(name, value) {
          GM_setValue(name, value);
      },

      getStorage(key) {
          try {
              return JSON.parse(localStorage.getItem(key));
          } catch (e) {
              return localStorage.getItem(key);
          }
      },

      setStorage(key, value) {
          if (this.isType(value) === 'object' || this.isType(value) === 'array') {
              return localStorage.setItem(key, JSON.stringify(value));
          }
          return localStorage.setItem(key, value);
      },

      setClipboard(text) {
          GM_setClipboard(text, 'text');
      },

      e(str) {
          return btoa(unescape(encodeURIComponent(str)));
      },

      d(str) {
          return decodeURIComponent(escape(atob(str)));
      },

      getExtension(name) {
          const reg = /(?!\.)\w+$/;
          if (reg.test(name)) {
              let match = name.match(reg);
              return match[0].toUpperCase();
          }
          return '';
      },

      sizeFormat(value) {
          if (value === +value) {
              let unit = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
              let index = Math.floor(Math.log(value) / Math.log(1024));
              let size = value / Math.pow(1024, index);
              size = size.toFixed(1);
              return size + unit[index];
          }
          return '';
      },

      sortByName(arr) {
          const handle = () => {
              return (a, b) => {
                  const p1 = a.filename ? a.filename : a.server_filename;
                  const p2 = b.filename ? b.filename : b.server_filename;
                  return p1.localeCompare(p2, "zh-CN");
              };
          };
          arr.sort(handle());
      },

      fixFilename(name) {
          return name.replace(/[!?&|`"'*\/:<>\\]/g, '_');
      },

      blobDownload(blob, filename) {
          if (blob instanceof Blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = filename;
              a.click();
              URL.revokeObjectURL(url);
          }
      },

      post(url, data, headers, type) {
          if (this.isType(data) === 'object') {
              data = JSON.stringify(data);
          }
          return new Promise((resolve, reject) => {
              GM_xmlhttpRequest({
                  method: "POST", url, headers, data,
                  responseType: type || 'json',
                  onload: (res) => {
                      type === 'blob' ? resolve(res) : resolve(res.response || res.responseText);
                  },
                  onerror: (err) => {
                      reject(err);
                  },
              });
          });
      },

      get(url, headers, type, extra) {
          return new Promise((resolve, reject) => {
              let requestObj = GM_xmlhttpRequest({
                  method: "GET", url, headers,
                  responseType: type || 'json',
                  onload: (res) => {
                      if (res.status === 204) {
                          requestObj.abort();
                          idm[extra.index] = true;
                      }
                      if (type === 'blob') {
                          res.status === 200 && base.blobDownload(res.response, extra.filename);
                          resolve(res);
                      } else {
                          resolve(res.response || res.responseText);
                      }
                  },
                  onprogress: (res) => {
                      if (extra && extra.filename && extra.index) {
                          res.total > 0 ? progress[extra.index] = (res.loaded * 100 / res.total).toFixed(2) : progress[extra.index] = 0.00;
                      }
                  },
                  onloadstart() {
                      extra && extra.filename && extra.index && (request[extra.index] = requestObj);
                  },
                  onerror: (err) => {
                      reject(err);
                  },
              });
          });
      },

      getFinalUrl(url, headers) {
          return new Promise((resolve, reject) => {
              let requestObj = GM_xmlhttpRequest({
                  method: "GET", url, headers,
                  onload: (res) => {
                      resolve(res.finalUrl);
                  },
                  onerror: (err) => {
                      reject(err);
                  },
              });
          });
      },

      stringify(obj) {
          let str = '';
          for (var key in obj) {
              if (obj.hasOwnProperty(key)) {
                  var value = obj[key];
                  if (Array.isArray(value)) {
                      for (var i = 0; i < value.length; i++) {
                          str += encodeURIComponent(key) + '=' + encodeURIComponent(value[i]) + '&';
                      }
                  } else {
                      str += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
                  }
              }
          }
          return str.slice(0, -1); // 去掉末尾的 "&"
      },

      addStyle(id, tag, css) {
          tag = tag || 'style';
          let doc = document, styleDom = doc.getElementById(id);
          if (styleDom) return;
          let style = doc.createElement(tag);
          style.rel = 'stylesheet';
          style.id = id;
          tag === 'style' ? style.innerHTML = css : style.href = css;
          doc.getElementsByTagName('head')[0].appendChild(style);
      },

      sleep(time) {
          return new Promise(resolve => setTimeout(resolve, time));
      },

      findReact(dom, traverseUp = 0) {
          const key = Object.keys(dom).find(key => {
              return key.startsWith("__reactFiber$")
                  || key.startsWith("__reactInternalInstance$");
          });
          const domFiber = dom[key];
          if (domFiber == null) return null;

          if (domFiber._currentElement) {
              let compFiber = domFiber._currentElement._owner;
              for (let i = 0; i < traverseUp; i++) {
                  compFiber = compFiber._currentElement._owner;
              }
              return compFiber._instance;
          }

          const GetCompFiber = fiber => {
              let parentFiber = fiber.return;
              while (typeof parentFiber.type == "string") {
                  parentFiber = parentFiber.return;
              }
              return parentFiber;
          };
          let compFiber = GetCompFiber(domFiber);
          for (let i = 0; i < traverseUp; i++) {
              compFiber = GetCompFiber(compFiber);
          }
          return compFiber.stateNode || compFiber;
      },

      initDefaultConfig() {
          let value = [{
              name: 'setting_rpc_domain',
              value: 'http://localhost'
          }, {
              name: 'setting_rpc_port',
              value: '16800'
          }, {
              name: 'setting_rpc_path',
              value: '/jsonrpc'
          }, {
              name: 'setting_rpc_token',
              value: ''
          }, {
              name: 'setting_rpc_dir',
              value: '/downloads'
          }, {
              name: 'setting_theme_color',
              value: '#09AAFF'
          }];

          value.forEach((v) => {
              base.getValue(v.name) === undefined && base.setValue(v.name, v.value);
          });
      },



      createLoading() {
          return $('<div class="pl-loading"><div class="pl-loading-box"><div><div></div><div></div></div></div></div>');
      },

      addPanLinkerStyle() {
          color = base.getValue('setting_theme_color');
          let css = `
          body::-webkit-scrollbar { display: none }
          ::-webkit-scrollbar { width: 6px; height: 10px }
          ::-webkit-scrollbar-track { border-radius: 0; background: none }
          ::-webkit-scrollbar-thumb { background-color: rgba(85,85,85,.4) }
          ::-webkit-scrollbar-thumb,::-webkit-scrollbar-thumb:hover { border-radius: 5px; -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.2) }
          ::-webkit-scrollbar-thumb:hover { background-color: rgba(85,85,85,.3) }
          .swal2-popup { font-size: 16px !important; }
          .pl-popup { font-size: 12px !important; }
          .pl-popup a { color: ${color} !important; }
          .pl-header { padding: 0!important;align-items: flex-start!important; border-bottom: 1px solid #eee!important; margin: 0 0 10px!important; padding: 0 0 5px!important; }
          .pl-title { font-size: 16px!important; line-height: 1!important;white-space: nowrap!important; text-overflow: ellipsis!important;}
          .pl-content { padding: 0 !important; font-size: 12px!important; }
          .pl-main { max-height: 400px;overflow-y:scroll; }
          .pl-footer {font-size: 12px!important;justify-content: flex-start!important; margin: 10px 0 0!important; padding: 5px 0 0!important; color: #f56c6c!important; }
          .pl-item { display: flex; align-items: center; line-height: 22px; }
          .pl-item-name { flex: 0 0 150px; text-align: left;margin-right: 10px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; cursor:default; }
          .pl-item-link {  overflow: hidden; text-align: left; white-space: nowrap; text-overflow: ellipsis;cursor:pointer }
          .pl-item-btn { background: ${color}; padding: 4px 5px; border-radius: 3px; line-height: 1; cursor: pointer; color: #fff; }
          .pl-item-tip { display: flex; justify-content: space-between;flex: 1; }
          .pl-back { width: 70px; background: #ddd; border-radius: 3px; cursor:pointer; margin:1px 0; }
          .pl-ext { display: inline-block; width: 44px; background: #999; color: #fff; height: 16px; line-height: 16px; font-size: 12px; border-radius: 3px;}
          .pl-retry {padding: 3px 10px; background: #cc3235; color: #fff; border-radius: 3px; cursor: pointer;}
          .pl-browserdownload { padding: 3px 10px; background: ${color}; color: #fff; border-radius: 3px; cursor: pointer;}
          .pl-item-progress { display:flex;flex: 1;align-items:center}
          .pl-progress { display: inline-block;vertical-align: middle;width: 100%; box-sizing: border-box;line-height: 1;position: relative;height:15px; flex: 1}
          .pl-progress-outer { height: 15px;border-radius: 100px;background-color: #ebeef5;overflow: hidden;position: relative;vertical-align: middle;}
          .pl-progress-inner{ position: absolute;left: 0;top: 0;background-color: #409eff;text-align: right;border-radius: 100px;line-height: 1;white-space: nowrap;transition: width .6s ease;}
          .pl-progress-inner-text { display: inline-block;vertical-align: middle;color: #d1d1d1;font-size: 12px;margin: 0 5px;height: 15px}
          .pl-progress-tip{ flex:1;text-align:right}
          .pl-progress-how{ flex: 0 0 90px; background: #ddd; border-radius: 3px; margin-left: 10px; cursor: pointer; text-align: center;}
          .pl-progress-stop{ flex: 0 0 50px; padding: 0 10px; background: #cc3235; color: #fff; border-radius: 3px; cursor: pointer;margin-left:10px;height:20px}
          .pl-progress-inner-text:after { display: inline-block;content: "";height: 100%;vertical-align: middle;}
          .pl-btn-primary { background: ${color}; border: 0; border-radius: 4px; color: #ffffff; cursor: pointer; font-size: 12px; outline: none; display:flex; align-items: center; justify-content: center; margin: 2px 0; padding: 6px 0;transition: 0.3s opacity; }
          .pl-btn-primary:hover { opacity: 0.9;transition: 0.3s opacity; }
          .pl-btn-success { background: #55af28; animation: easeOpacity 1.2s 2; animation-fill-mode:forwards }
          .pl-btn-info { background: #606266; }
          .pl-btn-warning { background: #da9328; }
          .pl-btn-warning { background: #da9328; }
          .pl-btn-danger { background: #cc3235; }
          .ali-button {display: inline-flex;align-items: center;justify-content: center;border: 0 solid transparent;border-radius: 5px;box-shadow: 0 0 0 0 transparent;width: fit-content;white-space: nowrap;flex-shrink: 0;font-size: 14px;line-height: 1.5;outline: 0;touch-action: manipulation;transition: background .3s ease,color .3s ease,border .3s ease,box-shadow .3s ease;color: #fff;background: rgb(99 125 255);margin-left: 20px;padding: 1px 12px;position: relative; cursor:pointer; height: 32px;}
          .ali-button:hover {background: rgb(122, 144, 255)}
          .tianyi-button {margin-right: 20px; padding: 4px 12px; border-radius: 4px; color: #fff; font-size: 12px; border: 1px solid #0073e3; background: #2b89ea; cursor: pointer; position: relative;}
          .tianyi-button:hover {border-color: #1874d3; background: #3699ff;}
          .yidong-button {float: left; position: relative; margin: 20px 24px 20px 0; width: 98px; height: 36px; background: #3181f9; border-radius: 2px; font-size: 14px; color: #fff; line-height: 39px; text-align: center; cursor: pointer;}
          .yidong-share-button {display: inline-block; position: relative; font-size: 14px; line-height: 36px; text-align: center; color: #fff; border: 1px solid #5a9afa; border-radius: 2px; padding: 0 24px; margin-left: 24px; background: #3181f9;}
          .yidong-button:hover {background: #2d76e5;}
          .xunlei-button {display: inline-flex;align-items: center;justify-content: center;border: 0 solid transparent;border-radius: 5px;box-shadow: 0 0 0 0 transparent;width: fit-content;white-space: nowrap;flex-shrink: 0;font-size: 14px;line-height: 1.5;outline: 0;touch-action: manipulation;transition: background .3s ease,color .3s ease,border .3s ease,box-shadow .3s ease;color: #fff;background: #3f85ff;margin-left: 12px;padding: 0px 12px;position: relative; cursor:pointer; height: 36px;}
          .xunlei-button:hover {background: #619bff}
          .quark-button {display: inline-flex; align-items: center; justify-content: center; border: 1px solid #ddd; border-radius: 8px; white-space: nowrap; flex-shrink: 0; font-size: 14px; line-height: 1.5; outline: 0; color: #333; background: #fff; margin-right: 10px; padding: 0px 14px; position: relative; cursor: pointer; height: 36px;}
          .quark-button:hover { background:#f6f6f6 }
          .pl-dropdown-menu {position: absolute;right: 0;top: 30px;padding: 5px 0;color: rgb(37, 38, 43);background: #fff;z-index: 999;width: 102px;border: 1px solid #ddd;border-radius: 10px; box-shadow: 0 0 1px 1px rgb(28 28 32 / 5%), 0 8px 24px rgb(28 28 32 / 12%);}
          .pl-dropdown-menu-item { height: 30px;display: flex;align-items: center;justify-content: center;cursor:pointer }
          .pl-dropdown-menu-item:hover { background-color: rgba(132,133,141,0.08);}
          .pl-button .pl-dropdown-menu { display: none; }
          .pl-button:hover .pl-dropdown-menu { display: block!important; }
          .pl-button-init { opacity: 0.5; animation: easeInitOpacity 1.2s 3; animation-fill-mode:forwards }
           @keyframes easeInitOpacity { from { opacity: 0.5; } 50% { opacity: 1 } to { opacity: 0.5; } }
           @keyframes easeOpacity { from { opacity: 1; } 50% { opacity: 0.35 } to { opacity: 1; } }
          .element-clicked { opacity: 0.5; }
          .pl-extra { margin-top: 10px;display:flex}
          .pl-extra button { flex: 1}
          .pointer { cursor:pointer }
          .pl-setting-label { display: flex;align-items: center;justify-content: space-between;padding-top: 10px; }
          .pl-label { flex: 0 0 100px;text-align:left; }
          .pl-input { flex: 1; padding: 8px 10px; border: 1px solid #c2c2c2; border-radius: 5px; font-size: 14px }
          .pl-color { flex: 1;display: flex;flex-wrap: wrap; margin-right: -10px;}
          .pl-color-box { width: 35px;height: 35px;margin:10px 10px 0 0;; box-sizing: border-box;border:1px solid #fff;cursor:pointer }
          .pl-color-box.checked { border:3px dashed #111!important }
          .pl-close:focus { outline: 0; box-shadow: none; }
          .tag-danger {color:#cc3235;margin: 0 5px;}
          .pl-tooltip { position: absolute; color: #ffffff; max-width: 600px; font-size: 12px; padding: 5px 10px; background: #333; border-radius: 5px; z-index: 110000; line-height: 1.3; display:none; word-break: break-all;}
           @keyframes load { 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } }
          .pl-loading-box > div > div { position: absolute;border-radius: 50%;}
          .pl-loading-box > div > div:nth-child(1) { top: 9px;left: 9px;width: 82px;height: 82px;background: #ffffff;}
          .pl-loading-box > div > div:nth-child(2) { top: 14px;left: 38px;width: 25px;height: 25px;background: #666666;animation: load 1s linear infinite;transform-origin: 12px 36px;}
          .pl-loading { width: 16px;height: 16px;display: inline-block;overflow: hidden;background: none;}
          .pl-loading-box { width: 100%;height: 100%;position: relative;transform: translateZ(0) scale(0.16);backface-visibility: hidden;transform-origin: 0 0;}
          .pl-loading-box div { box-sizing: content-box; }
          .swal2-container { z-index:100000!important; }
          body.swal2-height-auto { height: inherit!important; }
          .btn-operate .btn-main { display:flex; align-items:center; }
          .download-btn { height:36px;width:130px;align-items:center;justify-content:center;display:flex;border-radius:8px; }
          `;
          this.addStyle('panlinker-style', 'style', css);
      },
  };


  let ali = {

      addPageListener() {
          doc.on('click', '.pl-button-mode', (e) => {
              Swal.showLoading();
              this.getPCSLink();
          });

          doc.on('click', '.listener-link-rpc', async (e) => {
              let target = $(e.currentTarget);
              const filename = target.parent().attr('data-filename');
              target.find('.icon').remove();
              target.find('.pl-loading').remove();
              target.prepend(base.createLoading());
              let res = await this.sendLinkToRPC(filename, e.currentTarget.dataset.link);
              if (res === 'success') {
                  $('.listener-rpc-task').show();
                  target.removeClass('pl-btn-danger').html('发送成功，快去看看吧！').animate({opacity: '0.5'}, "slow");
              } else {
                  target.addClass('pl-btn-danger').text('发送失败，请检查您的RPC配置信息！').animate({opacity: '0.5'}, "slow");
              }
          });
          doc.on('click', '.listener-send-rpc', (e) => {
              $('.listener-link-rpc').click();
              $(e.target).text('发送完成，发送结果见上方按钮！').animate({opacity: '0.5'}, "slow");
          });
          doc.on('click', '.listener-open-setting', () => {
              base.showSetting();
          });
          // const taskUrl = `${pan.d}/?rpc=${base.e(rpc)}#${base.getValue('setting_rpc_token')}`;
          const taskUrl = `https://aria.gepik.top:6001/`;
          doc.on('click', '.listener-rpc-task', () => {
              let rpc = JSON.stringify({
                  domain: base.getValue('setting_rpc_domain'),
                  port: base.getValue('setting_rpc_port'),
              }), url = taskUrl;
              GM_openInTab(url, {active: true});
          });
      },

      addInitButton() {
          if (!pt) return;
          let $toolWrap;
          let $button = $(`<div style="color:#fff;background: ${color};border-color:${color}" class="g-button g-button-blue pl-button-mode pointer download-btn"><span class="text">获取下载链接</span></div>`);

          if (pt === 'home') {
              let ins = setInterval(() => {
                  $toolWrap = $(pan.btn.home);
                  if ($toolWrap.length > 0) {
                      $toolWrap.append($button);
                      clearInterval(ins);
                  }
              }, 50);
          }
          if (pt === 'share') {
              $button.css({'margin-right': '10px'});
              let ins = setInterval(() => {
                  $toolWrap = $(pan.btn.share);
                  if ($toolWrap.length > 0) {
                      $toolWrap.prepend($button);
                      clearInterval(ins);
                  }
              }, 50);
          }
          doc.on('input', '.listener-dir', async (e) => {
            base.setValue('setting_rpc_dir', e.target.value);
        });
      this.addPageListener();
      },

      async getPCSLink() {
          let reactDomGrid = document.querySelector(pan.dom.grid);
          if (reactDomGrid) {
              let res = await Swal.fire({
                  title: '提示',
                  html: '<div style="display: flex;align-items: center;justify-content: center;">请先切换到 <b>列表视图</b>（<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M132 928c-32.8 0-59.2-26.4-59.2-59.2s26.4-59.2 59.2-59.2h760c32.8 0 59.2 26.4 59.2 59.2S924.8 928 892 928H132zm0-356.8c-32.8 0-59.2-26.4-59.2-59.2s26.4-59.2 59.2-59.2h760c32.8 0 59.2 26.4 59.2 59.2s-26.4 59.2-59.2 59.2H132zm0-356c-32.8 0-59.2-26.4-59.2-59.2S99.2 96.8 132 96.8h760c32.8 0 59.2 26.4 59.2 59.2s-26.4 59.2-59.2 59.2H132z"/></svg>）后获取！</div>',
                  confirmButtonText: '点击切换'
              });
              if (res) {
                  document.querySelector(pan.dom.switch).click();
                  return message.success('切换成功，请重新获取下载链接！');
              }
              return false;
          }
          selectList = this.getSelectedList();
          if (selectList.length === 0) {
              return message.error('提示：请先勾选要下载的文件！');
          }
          if (this.isOnlyFolder()) {
              return message.error('提示：请打开文件夹后勾选文件！');
          }
          if (pt === 'share') {
              if (selectList.length > 20) {
                  return message.error('提示：单次最多可勾选 20 个文件！');
              }
              try {
                  let authorization = `${base.getStorage('token').token_type} ${base.getStorage('token').access_token}`;
                  let xShareToken = base.getStorage('shareToken').share_token;

                  for (let i = 0; i < selectList.length; i++) {
                      let res = await base.post(pan.pcs[0], {
                          expire_sec: 600,
                          file_id: selectList[i].fileId,
                          share_id: selectList[i].shareId
                      }, {
                          authorization,
                          "content-type": "application/json;charset=utf-8",
                          "x-share-token": xShareToken
                      });
                      if (res.download_url) {
                          selectList[i].downloadUrl = res.download_url;
                      }
                  }
              } catch (e) {
                  return message.error('提示：请先登录网盘！');
              }
          }
          let html = this.generateDom(selectList);
          this.showMainDialog(pan[mode][0], html, pan[mode][1]);
      },

      generateDom(list) {
          let content = '<div class="pl-main">';
          let alinkAllText = '';
          list.forEach((v, i) => {
              if (v.type === 'folder') return;
              let filename = v.name;
              let fid = v.fileId;
              let did = v.driveId;
              let size = base.sizeFormat(v.size);
              let dlink = v.downloadUrl || v.url;
              if (mode === 'rpc') {
                  content += `<div class="pl-item" data-filename="${filename}">
                              <input class=" rename" data-size="${size}" style="flex:1;" type="text" value="${filename}">
                              <span style="margin-left:10px;">${size}</span>
                              <button class="pl-item-link listener-link-rpc pl-btn-primary pl-btn-info" style="padding:6px 10px;margin-left:10px;"  data-link="${dlink}"><em class="icon icon-device"></em><span style="margin-left: 5px;">推送到 RPC 下载器</span></button></div>`;
              }

          });
          content += '</div>';
          const dirTreeDom = this.getDirTreeDom([dirTree]);
          if (mode === 'rpc') {
              let rpc = base.getValue('setting_rpc_domain') + ':' + base.getValue('setting_rpc_port') + base.getValue('setting_rpc_path');
              content += `<div class="pl-extra">
              <button class="pl-btn-primary listener-send-rpc">发送全部链接</button>
              <button title="${rpc}" class="pl-btn-primary pl-btn-warning listener-open-setting" style="margin-left: 10px">设置 RPC 参数（当前为：${rpc}）</button>
              <button class="pl-btn-primary pl-btn-success listener-rpc-task" style="margin-left: 10px;">查看下载任务</button>
              </div>
              <select style="width:100%;margin-top:10px;" type="text" placeholder="文件下载后保存路径，例如：D:" class="pl-input listener-dir" value="${base.getValue('setting_rpc_dir')}">
              ${dirTreeDom}
              </select>
              `;
          }
             doc.on('input', '.rename', async (e) => {
              let target = $(e.currentTarget);
              let filename = target.val();
              target?.parent()?.attr('data-filename', filename)
      });
          return content;
      },
      getDirTreeDom(list,deep = 0) {
        const domList = list.map(it=>{
            const currentDirPath = it.dirPath.replace('/media','/downloads')
            console.log('currentDirPath',currentDirPath);
            
          const emptyText = new Array(deep).fill('&nbsp;&nbsp;&nbsp;&nbsp;').join('');
          let item =   `<option value="${currentDirPath}">${emptyText + it.name}</option>`;
          if(it.children?.length) {
            item+= this.getDirTreeDom(it.children,deep+1);
          }
          return item;
        })
        return domList.join('');
      },

      async sendLinkToRPC(filename, link) {
          let rpc = {
              domain: base.getValue('setting_rpc_domain'),
              port: base.getValue('setting_rpc_port'),
              path: base.getValue('setting_rpc_path'),
              token: base.getValue('setting_rpc_token'),
              dir: base.getValue('setting_rpc_dir'),
          };

          let url = `${rpc.domain}:${rpc.port}${rpc.path}`;
          let rpcData = {
              id: new Date().getTime(),
              jsonrpc: '2.0',
              method: 'aria2.addUri',
              params: [`token:${rpc.token}`, [link], {
                  dir: rpc.dir,
                  out: filename,
                  header: [`Referer: https://www.aliyundrive.com/`]
              }]
          };
          console.log('rpcData',rpcData);
          try {
              let res = await base.post(url, rpcData, {"Referer": "https://www.aliyundrive.com/"}, '');
              if (res.result) return 'success';
              return 'fail';
          } catch (e) {
              return 'fail';
          }
      },

      getSelectedList() {
          try {
              let selectedList = [];
              let reactDom = document.querySelector(pan.dom.list);
              let reactObj = base.findReact(reactDom, 1);
              let props = reactObj.pendingProps;
              if (props) {
                  let fileList = props.dataSource || [];
                  let selectedKeys = props.selectedKeys.split(',');
                  fileList.forEach((val) => {
                      if (selectedKeys.includes(val.fileId)) {
                          selectedList.push(val);
                      }
                  });
              }
              return selectedList;
          } catch (e) {
              return [];
          }
      },

      detectPage() {
          let path = location.pathname;
          if (/^\/(drive)/.test(path)) return 'home';
          if (/^\/(s|share)\//.test(path)) return 'share';
          return '';
      },

      isOnlyFolder() {
          for (let i = 0; i < selectList.length; i++) {
              if (selectList[i].type === 'file') return false;
          }
          return true;
      },

      showMainDialog(title, html, footer) {
          Swal.fire({
              title,
              html,
              footer,
              allowOutsideClick: false,
              showCloseButton: true,
              showConfirmButton: false,
              position: 'top',
              width,
              padding: '15px 20px 5px',
              customClass,
          });
      },
      async getDirTree() {
        const res = await base.get('https://super-service.gepik.top:5001/api/file/getMediaDirTree');
        dirTree = res.data;
        dirTree.name === '/media' ? '/downloads' : '/media';
        dirTree.dirPath === '/media' ? '/downloads' : '/media';
        
      },

      async initPanLinker() {
          base.initDefaultConfig();
          base.addPanLinkerStyle();
          pt = this.detectPage();
          let res = await base.post
          (`https://api.youxiaohou.com/config/ali?ver=${version}&a=${author}`, {}, {}, 'text');
          pan = JSON.parse(base.d(res));
          Object.freeze && Object.freeze(pan);
          this.getDirTree();
          this.addInitButton();
      }
  };

 


  let main = {
      init() {
          if (/www.aliyundrive.com/.test(location.host)) {
              ali.initPanLinker();
          }

      }
  };

  main.init();
})();



/* 
{
  "list": "[class^=\"node-list-table-view--\"]",
  "grid": "[class^=\"node-list-grid-view--\"]",
  "switch": "[class^=\"switch-wrapper--\"]"
}
*/ 
