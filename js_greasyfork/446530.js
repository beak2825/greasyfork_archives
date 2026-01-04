// ==UserScript==
// @name         CSDN博客详情页优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  1. 去除博客详情页左右栏内容,仅保留目录功能2. 优化博客页面样式
// @author       You

// @include      *://blog.csdn.net/*/article/details/*
// @include      *://*.blog.csdn.net/article/details/*
// @match        https://www.tampermonkey.net/scripts.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446530/CSDN%E5%8D%9A%E5%AE%A2%E8%AF%A6%E6%83%85%E9%A1%B5%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/446530/CSDN%E5%8D%9A%E5%AE%A2%E8%AF%A6%E6%83%85%E9%A1%B5%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
  const LOCAL_STORAGE_PREFIX = 'csdn-clear-config';
  const Toolkit = {
    delay(timeout) {
      return new Promise(resolve => setTimeout(resolve, timeout));
    },
    setValue(key, value) {
      localStorage.setItem(LOCAL_STORAGE_PREFIX + key, value);
    },
    getValue(key) {
      return localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    },
    addStyle(css) {
      const styleId = `CSDN-Clear-${+new Date()}`;
      const style = document.createElement('style');
      style.setAttribute('id', styleId);
      style.append(css);

      const elemByTag = tag => document.getElementsByTagName(tag)[0];
      const root = elemByTag('head') || elemByTag('*');
      root && root.appendChild(style);
      return style;
    },
  };
  const fn = {
    // 生成右侧按钮
    createSilderBtn({ dataType, img, name }, onlyImg = false) {
      const option = document.createElement('a');
      option.classList.add('option-box');
      option.setAttribute('data-type', dataType);
      const imgNode = document.createElement('img');
      imgNode.src = img;
      onlyImg && (imgNode.style = 'display:block !important;');
      const optionName = document.createElement('span');
      optionName.classList.add('show-txt');
      optionName.innerHTML = name;
      !onlyImg && option.appendChild(optionName);
      option.appendChild(imgNode);
      return option;
    },
    getStyle() {
      const animation = `
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes fadeOut {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }
          .animatefadeIn {
            animation: fadeIn 0.25s;
          }
          .animatefadeOut {
            animation: fadeOut 0.25s;
          }
          @keyframes hidePop {
              0% {
                  opacity: 1;
                  transform: rotate3d(1, 1, 0, 0deg);
              }
              100% {
                  opacity: 0;
                  transform: rotate3d(1, 1, 0, 15deg);
              }
          }
          @keyframes showPop {
              0% {
                  opacity: 0;
                  transform: rotate3d(1, 1, 0, 90deg);
              }
              50% {
                  transform: rotate3d(1, 1, 0, -6deg);
              }
              100% {
                  opacity: 1;
                  transform: rotate3d(0, 0, 0, 0deg);
              }
          }
        `;
      const recommendBox = `
            .recommend-box { display: var(--display-recommend) !important; }
        `;
      const mediaQuery = `
        #article_content code.hljs ol.hljs-ln{
          min-width: 100%;
        }
        .csdn-common-logo-advert{
          margin-top: 8px;
        }
        @media screen and (max-width: 1320px) {
            .main_father > .container#mainBox > main { float: none; margin: 0 auto !important; }
        }
        @media screen and (max-width: 1379px) and (min-width: 1320px) {
            .main_father > .container#mainBox > main{ float: none; margin: 0 auto !important; }
        }
        @media screen and (max-width: 1699px) and (min-width: 1550px) {
            .main_father > .container#mainBox > main { width: var(--article-width) !important; float: none; margin: 0 auto !important; }
        }
        @media screen and (max-width: 1549px) and (min-width: 1380px) {
            .main_father > .container#mainBox > main { float: none; margin: 0 auto !important; }
        }
        @media screen and (min-width: 1700px) {
            .main_father > .container#mainBox > main { width: var(--article-width) !important; float: none; margin: 0 auto !important;}
        }
        `;
      return `
              ${animation}
              body {
                  ${fn.getVarStyle()}
              }
              ${mediaQuery}
              ${fn.getCatalogueStyle()}
              ${recommendBox}
          `;
    },
    setSettingsStyle() {
      return `
            #csdn-clear-tip-sidetoolbar {
                position: absolute;
                width: 130px;
                background: #fff;
                user-select: none;
                border-radius: 6px;
                padding: 4px;
                text-align: center;
                box-shadow: 0 0 7px 0px #cccccc;
                right: -140px;
                top: 0;
            }
            #csdn-clear-tip-sidetoolbar.left{
                right: 60px;
                top: 0;
            }
            #csdn-clear-tip-sidetoolbar.left::after{
                left: auto;
                right: -7px;
                bottom: 25px;
                border-right: none;
                border-top: 7px solid transparent;
                border-bottom: 7px solid transparent;
                border-left: 7px solid #fff;
            }
            #csdn-clear-tip-sidetoolbar::after{
                display: block;
                content: '';
                position: absolute;
                bottom: 25px;
                left: -7px;
                border-top: 7px solid transparent;
                border-bottom: 7px solid transparent;
                border-right: 7px solid #fff;
            }
            #csdn-clear-tip-sidetoolbar.dark-mode{
                background: #2e2f30;
                color: #fff;
            }
            #csdn-clear-tip-sidetoolbar.dark-mode::after{
                border-top: 7px solid #2e2f30;
            }
            #csdn-clear-tip{
                text-align: right;
                width: 100%;
                height: 100%;
                font-size: 0;
            }
            #csdn-clear-tip img{
                width: 32px;
                height: 32px;
                vertical-align: middle;
            }
            #csdn-clear-tip span{
                vertical-align: middle;
                font-size: 15px;
            }
            .csdn-side-toolbar a.option-box .show-txt{
                user-select: none;
            }
            #setting-dialog-wrap{
                position: fixed;
                width:100%;
                height:100%;
                top: 0;
                left: 0;
                z-index: 2000;
            }
            #setting-dialog-wrap .setting-dialog-mask {
                background: rgba(0,0,0,0.4);
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                backdrop-filter: blur(10px);
            }
            #setting-dialog-wrap #setting-dialog {
                display: block;
                position: fixed;
                top: 20vh;
                display: flex;
                justify-content: center;
                animation: showPop 0.35s ease;
                transition: 0.65s all ease-in-out;
                border-radius: 18px;
                overflow: hidden;
                left: calc(50% - 225px);
            }
            #setting-dialog-wrap.display-none #setting-dialog {
                display: none;
            }
            #setting-dialog section {
                opacity: 1;
                transition: 0.25s opacity ease-in-out;
            }
            #setting-dialog section header {
                max-width: 550px;
                height: 50px;
                font-size: 20px;
                background: none;
                padding: 0 15px;
                display: flex;
                justify-content: space-between;
                padding: 0 15px;
                align-items: center;
                border-bottom: 1px solid #EEE;
            }
            #setting-dialog section header .icon-close > img {
                width: 20px;
                cursor: pointer;
            }
            #setting-dialog section article .row {
                margin: 0;
                margin-bottom: 10px;
            }
            #setting-dialog section article .row .color-picker-box {
                margin-bottom: 10px;
            }
            #setting-dialog section article .row > label {
                font-weight: bold;
            }
            #setting-dialog section article button { color: #409EFF; background-color: #FAFAFA; padding: 4px; margin: 2.5px; border: 1px solid: #EEE; border-radius: 3px; }
            #setting-dialog section article button:hover { background-color: #EEE; }
            #setting-dialog section article button#btn-clear-bg { color: #F56C6C; }
            #setting-dialog section article button#btn-clear-bgColor { color: #F56C6C; }
            #setting-dialog section article button#btn-update-bg { color: #E6A23C; }

            /* 链接输入框 */
            #custom-bg-url {
                width: 100%;
                margin-right: 10px;
                height: 25px;
                border-radius: 3px;
                border: 2px solid #DDD;
            }
            #setting-dialog section article .row#defaultHideMenu-wrap > .content > label {
                cursor: pointer;
                margin-right: 15px;
            }
            #setting-dialog section article .row#defaultHideMenu-wrap > .content > label >input {
                vertical-align: middle;
            }
            #setting-dialog section article .row > .content {
                display: flex;
                width: 500px;
                flex-wrap: wrap;
                align-items: center;
            }
            #setting-dialog section article .row > .content > div {
                color: grey;
                margin-right: 10px;
                cursor: pointer;
            }
            #setting-dialog section article .row > .content > div:hover {
                color: #000;
            }
            #setting-dialog section article .row > .content > div.STATE_SELECTED_CATEGORY {
                color: #F60;
                font-size: 20px;
                letter-spacing: 1px;
            }
            #setting-dialog section article {
                max-width: 550px;
                padding: 20px;
                height: calc(100% - 100px);
                overflow: auto;
            }
            #setting-dialog section article::-webkit-scrollbar {/*滚动条整体样式*/
                width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
                height: 6px;
            }
            #setting-dialog section article::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
                border-radius: 10%;
                -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.3);
                background: rgba(0,0,0,0.3);
            }
            #setting-dialog section article::-webkit-scrollbar-track {/*滚动条里面轨道*/
                -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.3);
                border-radius: 0;
                background: rgba(0,0,0,0.1);
            }
            /* 弹窗内部样式 */
            #setting-dialog section {
                min-width: 500px;
                height: 75vh;
                max-height: 520px;
                min-height: 370px;
                /* overflow: auto; */
                background-color: #FFF;
                /* border-radius: 5px; */
                border: 2px solid #EEE;
            }
            #setting-dialog footer{
            height: 50px;
            text-align: right;
        }
            #setting-dialog footer #save-csdnclear-btn{
            background: #009eff;
            color: #fff;
            width: 100px;
            height: 30px;
            border-radius: 4px;
            display: inline-block;
            margin-right: 28px;
            transition: all .2s;
            font-size: 15px;
            }
            #setting-dialog footer #save-csdnclear-btn:hover{
            font-weight: 600;
            }
            #setting-dialog .tips-line { color: grey; font-size: 12px }
            #setting-dialog .link { color: blue; }

            /* 自定义补充样式 */
            .display-none {display: none !important;}
            @-webkit-keyframes rotation{
                from {-webkit-transform: rotate(0deg);}
                to {-webkit-transform: rotate(360deg);}
            }
        `;
    },
    getVarStyle() {
      const config = window.$CSDNCleaner.config;
      return [
        ['--article-width', '100%'],
        //   ['--background-color', config.bgColor || '#EAEAEA'],
        ['--display-category', config.showCatalogue ? 'block' : 'none'],
        ['--display-recommend', config.hideRecommendBox ? 'none' : 'block'],
      ].reduce((pre, cur) => {
        return (pre += cur.join(':') + ';');
      }, '');
    },
    getCatalogueStyle() {
      const catalogSheets = `
                z-index: 233;
                border-radius: 10px;
                overflow: hidden;
            `;
      const catalogTitleSheets = `
                margin-bottom: 0;
                background-image: none;
                color: #222;
            `;
      const rightCatalogueSheets = `
                body[show-catalogue] aside.recommend-right_aside > #recommend-right > div:not(#groupfile) {
                    display: none !important;
                }
                body[show-catalogue] aside.recommend-right_aside > #recommend-right > #groupfile {
                    max-height: calc(100vh - 70px) !important;
                    ${catalogSheets}
                }
                body[show-catalogue] aside.recommend-right_aside > #recommend-right > #groupfile > .groupfile-div {
                    max-height: calc(100vh - 70px) !important;
                }
                body[show-catalogue] aside.recommend-right_aside > #recommend-right > #groupfile > .groupfile-div > h3  {
                    ${catalogTitleSheets}
                }
                body[show-catalogue] aside.recommend-right_aside > #recommend-right > #groupfile ol > li {}
            `;
      const leftCatalogueSheets = `
                /* 除目录外的其他 card */
                body[show-catalogue] #mainBox aside.blog_container_aside > div:not(#asidedirectory) {
                    display: none !important;
                    height: 0;
                    z-index: -32;
                    opacity: 0;
                    margin: 0;
                    visibility: hidden;
                }
                body[show-catalogue] #mainBox aside.blog_container_aside #directory .group_item {
                    max-height: calc(100vh - 125px)!important
                }
                body[show-catalogue] #mainBox aside.blog_container_aside > div#asidedirectory > #directory > h3 {
                    ${catalogTitleSheets}
                }
            `;
      return `
            @media screen and (min-width: 1550px) {
                /* 右侧设置 */
                body[show-catalogue] .nodata.recommend-right, aside.recommend-right_aside {
                    display: var(--display-category) !important;
                }
                ${rightCatalogueSheets}
                /* 隐藏左侧 */
                body[show-catalogue] #mainBox aside.blog_container_aside {
                    display: none !important;
                }
            }

            /* 在小屏下显示在文章左侧, 右侧已经隐藏*/
            @media screen and (min-width: 1380px) and (max-width: 1550px) {
                body[show-catalogue] #mainBox aside.blog_container_aside { display: var(--display-category) !important; }
            }

            /* 在小屏下显示在文章左侧 */
            @media screen and (max-width: 1380px) {
                body[show-catalogue] #mainBox aside.blog_container_aside {
                    display: var(--display-category) !important;
                }
                body[show-catalogue] .main_father > .container#mainBox > main {
                    float: right !important;
                }
            }
            @media screen and (max-width: 1549px) and (min-width: 1380px) {
                body[show-catalogue] .main_father > .container#mainBox > main {
                    float: right !important;
                }
            }
            @media screen and (min-width: 0px) and (max-width: 1550px) {
                body[show-catalogue] #mainBox aside.blog_container_aside {
                    position: fixed !important;
                    top: 57px !important;
                }
                ${leftCatalogueSheets}
            }
            body:not([show-catalogue]) .main_father > #mainBox > aside { display: none !important; }
            body:not([show-catalogue]) .recommend-right { display: none !important; }
        `;
    },
  };
  window.$CSDNCleaner = {
    config: {
      enable: true,
      // bgColor: '#fff',
      hideRecommendBox: false, // 相关推荐
      showCatalogue: true, // 目录
    },
    init() {
      const config = window.$CSDNCleaner.loadConfig();
      // 开启则载入样式文件
      if (config.enable) {
        Toolkit.addStyle(fn.getStyle());
      }
      // 添加设置按钮样式 (不管开启状态)
      Toolkit.addStyle(fn.setSettingsStyle());
      // DOM Load
      window.addEventListener('DOMContentLoaded', window.$CSDNCleaner.onLoad);
    },
    updateConfig(key, value) {
      if (!key) return;
      const config = window.$CSDNCleaner.config;
      config[key] = value;
      Toolkit.setValue('config', JSON.stringify(config));
    },
    loadConfig() {
      let config = Toolkit.getValue('config') || '{}';
      if (config) {
        config = JSON.parse(config);
      }
      window.$CSDNCleaner.config = Object.assign({}, window.$CSDNCleaner.config, config);
      return window.$CSDNCleaner.config;
    },
    onLoad() {
      if (window.$CSDNCleaner.config.enable) {
        // 显示Toolbar提示
        // window.$CSDNCleaner.loadToolbarTip();
        // 检查目录显示
        window.$CSDNCleaner.checkShowCatalogue();
        // 载入弹窗
        window.$CSDNCleaner.loadSettingModal().bindModalEvent();
        // 主题部分添加链接
        window.$CSDNCleaner.loadThemeBoxLink();
        // 底部盒子位置修复
        window.$CSDNCleaner.resetToolBoxPosition();
      }
      // 载入设置开关
      window.$CSDNCleaner.loadStatusSwitch();
      // 添加设置按钮
      // window.$CSDNCleaner.loadSettings();
    },
    toggleDialog() {
      const dialog = document.getElementById('setting-dialog-wrap');
      if (!dialog) throw new Error('dialog not found');
      dialog.classList.toggle('display-none');
    },
    checkShowCatalogue() {
      const showCatalogue = window.$CSDNCleaner.config.showCatalogue;
      document.body.style.setProperty('--display-category', showCatalogue ? 'block' : 'none');
      if (showCatalogue && document.getElementById('groupfile')) {
        document.body.setAttribute('show-catalogue', '');
      } else {
        document.body.removeAttribute('show-catalogue');
      }
    },
    // 绑定弹窗相关事件
    bindModalEvent() {
      const dialogWrapper = document.getElementById('setting-dialog');
      if (!dialogWrapper) return;
      // 开关
      const enableStatusWrap = document.getElementById('enableStatus-wrap');
      enableStatusWrap &&
        enableStatusWrap.addEventListener('change', evt => {
          const dom = evt.target;
          if (!dom || !dom.classList || !dom.classList.contains('radio-enableStatus')) return;
          const val = !!Number(dom.value);
          window.$CSDNCleaner.updateConfig('enable', val);
          window.location.reload();
        });

      // 隐藏相关推荐
      const hideRecommendBox = document.getElementById('hideRecommendBox-wrap');
      hideRecommendBox &&
        hideRecommendBox.addEventListener('change', evt => {
          const dom = evt.target;
          if (!dom || !dom.classList || !dom.classList.contains('radio-hideRecommendBox')) return;
          const val = !!Number(dom.value);
          window.$CSDNCleaner.updateConfig('hideRecommendBox', val);
          document.body.style.setProperty('--display-recommend', val ? 'none' : 'block');
        });

      // 显示目录
      const showCatalogue = document.getElementById('showCatalogue-wrap');
      showCatalogue &&
        showCatalogue.addEventListener('change', evt => {
          const dom = evt.target;
          if (!dom || !dom.classList || !dom.classList.contains('radio-showCatalogue')) return;
          const val = !!Number(dom.value);
          window.$CSDNCleaner.updateConfig('showCatalogue', val);
          window.$CSDNCleaner.checkShowCatalogue();
          window.$CSDNCleaner.resetToolBoxPosition();
        });

      // 关闭弹窗
      dialogWrapper.addEventListener('click', evt => {
        if (evt.target.id === 'setting-dialog' || evt.target.classList.contains('icon-close') || evt.target.parentNode.classList.contains('icon-close')) {
          // 关闭弹窗
          window.$CSDNCleaner.toggleDialog();
        }
      });
    },
    // 载入弹窗
    loadSettingModal() {
      const settingWrapper = document.createElement('div');
      settingWrapper.id = 'setting-dialog-wrap';
      settingWrapper.classList.add('display-none');

      const settingMask = document.createElement('div');
      settingMask.classList.add('setting-dialog-mask');
      settingWrapper.appendChild(settingMask);

      const settingModal = document.createElement('div');
      settingModal.id = 'setting-dialog';
      const config = window.$CSDNCleaner.config;
      settingModal.innerHTML = `
          <section>
              <header>
                  <div>
                      <span class="title">脚本设置</span>
                  </div>
                  <div class="icon-close">
                      <img src="https://csdnimg.cn//cdn/content-toolbar/guide-close-btn.png">
                  </div>
              </header>
              <article>
                   <!--
                    <div class="row" id="enableStatus-wrap">
                        <label>是否开启沉浸式阅读: </label>
                        <div class="content">
                            <label style="margin-right: 15px;">
                                <input type="radio" value="1" ${config.enable ? 'checked' : ''} class="radio-enableStatus" name="enableStatus" />
                                <span>开启</span>
                            </label>
                            <label>
                                <input type="radio" value="0" ${config.enable ? '' : 'checked'} class="radio-enableStatus" name="enableStatus" />
                                <span>关闭</span>
                            </label>
                        </div>
                    </div>
                  -->
                  <div class="row" id="hideRecommendBox-wrap">
                      <label>是否隐藏推荐文章: </label>
                      <div class="tips-line">隐藏之后将不会显示底部的推荐文章</div>
                      <div class="content">
                          <label style="margin-right: 15px;">
                              <input type="radio" value="1" ${config.hideRecommendBox ? 'checked' : ''} class="radio-hideRecommendBox" name="hideRecommendBox" />
                              <span>隐藏</span>
                          </label>
                          <label>
                              <input type="radio" value="0" ${config.hideRecommendBox ? '' : 'checked'} class="radio-hideRecommendBox" name="hideRecommendBox" />
                              <span>显示</span>
                          </label>
                      </div>
                  </div>
                  <div class="row" id="showCatalogue-wrap">
                      <label>是否显示目录: </label>
                      <div class="tips-line">开启之后会显示文章目录(若存在)</div>
                      <div class="content">
                          <label style="margin-right: 15px;">
                              <input type="radio" value="0" ${config.showCatalogue ? '' : 'checked'} class="radio-showCatalogue" name="showCatalogue" />
                              <span>隐藏</span>
                          </label>
                          <label>
                              <input type="radio" value="1" ${config.showCatalogue ? 'checked' : ''} class="radio-showCatalogue" name="showCatalogue" />
                              <span>显示</span>
                          </label>
                      </div>
                  </div>
              </article>
              <!--
                <footer>
                    <button id="save-csdnclear-btn">应用</button>
                </footer>
              -->
          </section>
        `;
      settingWrapper.appendChild(settingModal);

      document.body.appendChild(settingWrapper);
      return this;
    },
    // 加载开关
    async loadStatusSwitch() {
      const enable = window.$CSDNCleaner.config.enable;
      const imgUrl = enable
        ? 'https://img-operation.csdnimg.cn/plugin/image/carousel/1631267522756.png'
        : 'https://img-operation.csdnimg.cn/plugin/image/carousel/1631267559655.png';
      const switchBtn = fn.createSilderBtn({ dataType: '$switch-status', img: imgUrl, name: enable ? '关闭<br>沉浸' : '开启<br>沉浸' }, false);
      switchBtn.addEventListener('click', evt => {
        window.$CSDNCleaner.updateConfig('enable', !enable);
        window.location.reload();
      });
      if (enable) {
        switchBtn.addEventListener('contextmenu', evt => {
          window.$CSDNCleaner.toggleDialog();
          evt.preventDefault();
          evt.stopPropagation();
        });
      }
      for (let times = 10; times--; ) {
        await Toolkit.delay(300);
        const wrapper = document.querySelector('.csdn-side-toolbar');
        if (!wrapper) continue;
        const prepended = Array.from(wrapper.children).find(v => v.getAttribute('data-type') === '$switch-status');
        if (!prepended) {
          wrapper.prepend(switchBtn);
          switchBtn.addEventListener('mouseenter', function() {
            const tip = document.querySelector('#csdn-clear-tip-sidetoolbar');
            tip && tip.classList.remove('display-none');
          });
          switchBtn.addEventListener('mouseleave', function() {
            const tip = document.querySelector('#csdn-clear-tip-sidetoolbar');
            tip && tip.classList.add('display-none');
          });
          enable && window.$CSDNCleaner.loadStatusSwitchTip();
        }
      }
    },
    // 载入设置按钮
    async loadSettings() {
      const settingOption = fn.createSilderBtn({ dataType: '$setting', img: 'https://images.gitbook.cn/FuMNvLb25yJ4RiEg_2OnS8jpI8aB', name: '脚本<br>设置' });

      settingOption.addEventListener('click', evt => {
        this.toggleDialog();
      });
      for (let times = 10; times--; ) {
        await Toolkit.delay(300);
        const wrapper = document.querySelector('.csdn-side-toolbar');
        if (!wrapper) continue;
        const prepended = Array.from(wrapper.children).find(v => v.getAttribute('data-type') === '$setting');
        !prepended && wrapper.prepend(settingOption);
      }
    },
    // Toolbar顶栏提示
    async loadToolbarTip() {
      const clearTip = document.createElement('div');
      clearTip.id = 'csdn-clear-tip';
      clearTip.innerHTML = `
            <img src='https://img-operation.csdnimg.cn/plugin/image/carousel/1631243323622.png' alt="" />
            <span>CSDN·浏览器助手正在优化阅读体验</span>
        `;

      const toolbarMiddle = document.querySelector('#csdn-toolbar .toolbar-container-middle .toolbar-search');

      for (let times = 10; times--; ) {
        await Toolkit.delay(300);
        const wrapper = document.querySelector('.toolbar-container-middle');
        if (!wrapper) continue;
        const prepended = document.querySelector('#csdn-clear-tip');
        if (!prepended) {
          // 显示
          clearTip.classList.add('animatefadeIn');
          setTimeout(() => {
            clearTip.classList.remove('animatefadeIn');
          }, 250);

          wrapper.prepend(clearTip);
          toolbarMiddle.classList.add('display-none');
          setTimeout(() => {
            // 隐藏
            clearTip.classList.add('animatefadeOut');
            setTimeout(() => {
              clearTip.classList.remove('animatefadeOut');
              clearTip.classList.add('display-none');
              toolbarMiddle.classList.remove('display-none');
            }, 250);
          }, 1600);
        }
      }
    },
    // 显示提示
    async loadStatusSwitchTip() {
      const clearTip = document.createElement('div');
      clearTip.id = 'csdn-clear-tip-sidetoolbar';
      clearTip.innerHTML = `
            <span>CSDN·浏览器助手正在优化阅读体验</span>
        `;
      await Toolkit.delay(300);
      const meta = document.querySelector('meta[name="toolbar"]');
      if (meta) {
        let content = meta.getAttribute('content');
        content = JSON.parse(content);
        if (content.type === '1') {
          clearTip.classList.add('dark-mode');
        }
      }
      const wrapper = document.querySelector('a.option-box[data-type="$switch-status"]');
      const isLeft = window.innerWidth - wrapper.parentElement.offsetLeft < 140;
      console.log('isLeft', wrapper, window.innerWidth, wrapper.parentElement.offsetLeft);
      isLeft && clearTip.classList.add('left');
      wrapper.prepend(clearTip);

      setTimeout(() => {
        clearTip.classList.add('animatefadeOut');
        setTimeout(() => {
          clearTip.classList.add('display-none');
          clearTip.classList.remove('animatefadeOut');
        }, 200);
      }, 1800);
    },
    // 加载主题部分提示
    async loadThemeBoxLink() {
      // 沉浸阅读: CSDN浏览器助手
      const linkWrap = document.createElement('span');
      linkWrap.id = 'blog-script-link';
      linkWrap.innerHTML = `
            沉浸阅读:  <a href="https://plugin.csdn.net?from=blogScript" target="_blank" class="back-home c-blue c-blue-hover c-blue-focus">CSDN浏览器助手</a>
        `;

      for (let times = 10; times--; ) {
        await Toolkit.delay(300);
        const wrapper = document.querySelector('.container main .template-box');
        if (!wrapper) continue;

        const prepended = document.querySelector('#blog-script-link');
        if (!prepended) {
          wrapper.insertBefore(linkWrap, wrapper.children[wrapper.children.length - 1]);
        }
      }
    },
    // 修正底栏位置
    resetToolBoxPosition() {
      const toolbox = document.querySelector('.container main .more-toolbox-new .left-toolbox');
      toolbox.style.left = 'auto';
    },
  };
  window.$CSDNCleaner.init();
})();