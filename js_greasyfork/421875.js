// ==UserScript==
// @name         COLG功能增强
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Aur3l14no
// @match        https://bbs.colg.cn/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421875/COLG%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/421875/COLG%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function ($, undefined) {
  $(function () {
    //Your code here;
    const utils = {
      // save user config
      saveConfig: config => {
        const configString = JSON.stringify(config);
        localStorage.setItem('colg_enhance_config', configString);
      },
      // load user config
      getConfig: () => {
        const configString = localStorage.getItem('colg_enhance_config');
        const oldConfigString = localStorage.getItem('colg_filter_config');
        try {
          const config = JSON.parse(configString || oldConfigString);
          return config;
        } catch (e) {
          return {};
        }
      },
      bindedEles: [],
      bindClick: function (selector, callback) {
        this.bindedEles.push(selector);
        $(selector).click(callback);
      },
      unbindClick: (selector) => {
        $(selector).unbind();
      },
      unbindAllClick: function () {
        this.bindedEles.forEach(selector => {
          $(selector).click(callback);
        })
      }
    }
    const createEnhancer = () => {
      // run user filters
      const runFilter = (config, self) => {
        const title = self.find('a.s.xst').text();
        const user = self.find('td.by > cite > a').text();
        const isNewUserThread = self.find('img[alt="新人帖"]').length > 0;
        const containsAnyKeyword = (text, keywords) => (keywords || []).find(keyword => text.indexOf(keyword) >= 0);
        const matchesAnyKeyword = (text, keywords) => (keywords || []).find(keyword => text === keyword);
        const isTitleIncluded = containsAnyKeyword(title, config.includedKeywords);
        const isTitleExcluded = containsAnyKeyword(title, config.excludedKeywords);
        const isUserExcluded = matchesAnyKeyword(user, config.excludedUsers);
        if (isTitleExcluded || isUserExcluded || (true && isNewUserThread)) {
          self.hide();
        }
        else if (isTitleIncluded) {
          self.find('a.s.xst').addClass('colg_enhance_highlight');
        }
      }

      const runEnhancer = () => {
        const config = utils.getConfig();
        const isThreadDetailPage = location.pathname.indexOf('/thread-') >= 0;
        const search = location.search ? location.search.substr(1) : '';
        const params = {};
        search.split('&').filter(v => !!v).map(item => {
          const items = item.split('=');
          if (items.length >= 1) {
            params[items[0]] = items[1];
          }
        });
        const global = {
          config: config,
          params: params,
        };

        if (isThreadDetailPage) {
          // 先什么都不做
        } else {
          // 帖子列表
          $('tbody[id^="normalthread_"]').each(function () {
            const $this = $(this);
            runFilter(config, $this);
          });
        }
      }
      // init form elements
      const initDom = () => {
        // init config dom
        let configDivHtml = `
        <div id="colg_enhance_container" class="colg_enhance colg_added">
          <div class="colg_enhance_mask"></div>
          <div class="colg_enhance_inner">
            <div class="colg_enhance_inner_content">
              <h1>COLG优化设置</h1>
              <div class="colg_enhance_config_block">感兴趣的关键词（空格隔开）</div>
              <textarea placeholder="请填入感兴趣的关键字"></textarea>
              <br />
              <div class="colg_enhance_config_block">屏蔽的关键词（空格隔开）</div>
              <textarea placeholder="请填入要屏蔽的关键字"></textarea>
              <br />
              <div class="colg_enhance_config_block">屏蔽的用户（空格隔开）</div>
              <textarea placeholder="请填入要屏蔽的用户"></textarea>
              <p class="colg_enhance_buttons">
                <button id="colg_enhance_confirm" class="colg_enhance_button">确定</button>
                <button id="colg_enhance_cancel" class="colg_enhance_button" >取消</button>
              </p>
            </div>
          </div>
        </textarea>
      `;
        let styleHtml = `
        <style id="colg_enhance_style" class="colg_added">
          .colg_enhance_config {
            color: #ca6445;
            padding: 5px 20px;
            font-size: 13px;
            background: #fae9da;
            font-weight: normal;
            cursor: pointer;
          }
          .colg_enhance {
            width: 100vw;
            height: 100vh;
            position: absolute;
            top: 0;
            left: 0;
            display:none;
          }
          .colg_enhance_mask {
            position: absolute;
            background: rgba(0,0,0,.6);
            width: 100%;
            height: 100%;
            z-index: 99;
          }
          .colg_enhance_inner {
            width: 500px;
            text-align: center;
            margin: auto;
            top: 100px;
            position: relative;
            background: #fff;
            padding: 30px;
            height: 400px;
            overflow: auto;
            z-index: 100;
          }
          .colg_enhance_config_block {
            margin-top: 5px;
          }
          .colg_enhance_inner_content {
            text-align: left;
          }
          .colg_enhance_inner_content h1 {
            padding: 0;
          }
          .colg_enhance_inner_content h2 {
            color: #037b82;
            margin-top: 20px;
          }
          .colg_enhance_inner textarea {
            width: 95%;
            height: 60px;
            resize: auto;
            resize: vertical;
            min-height: 50px;
            padding: 10px;
          }
          .colg_enhance_inner textarea:focus {
            border: 1px solid #072;
            box-shadow: 0px 0px 1px 0px #072;
          }
          .colg_enhance_buttons {
            float: right;
          }
          a.colg_enhance_highlight {
            background: #037b82;
            color: #fff !important;
          }
          .colg_enhance_button {
            padding: 5px 20px;
            font-size: 13px;
            border: 1px solid #037b82;
            color: #037b82;
            background-color: #f0f6f3;
            font-weight: normal;
            cursor: pointer;
          }
          .colg_enhance_button:hover {
            background-color: #037b82;
            color: #fff;
          }
        </style>
      `;
        $(document.body).append(configDivHtml);
        $(document.body).append(styleHtml);

        // init config btn
        const insertPos = $('.dfsj_nv_z > #um > p');
        if (insertPos) {
          insertPos.append('<span class="pipe">|</span><a id="colg_enhance_show_config" href="javascript:void(0);">COLG增强插件设置</a>');
        }

        // init load more btn

        const scrollTopPos = $('#scrolltop');
        if (scrollTopPos) {
          scrollTopPos.append('<span><a id="loadmore" class="scrolltopa"><b>加载更多</b></a></span>')
        }
      }
      // init dom events
      const initDomEvents = config => {
        const $container = $('#colg_enhance_container');
        const $body = $(document.body);
        // bind events
        utils.bindClick('#colg_enhance_show_config', e => {
          $container.show();
          $body.css('overflow', 'hidden');
        });
        utils.bindClick('#colg_enhance_cancel', e => {
          $container.hide();
          $body.css('overflow', 'initial');
        });
        utils.bindClick('.colg_enhance_mask', e => {
          $container.hide();
          $body.css('overflow', 'initial');
        });
        utils.bindClick('#colg_enhance_confirm', e => {
          const config = {
            includedKeywords: $('#colg_enhance_container textarea')[0].value.split(' ').filter(v => !!v),
            excludedKeywords: $('#colg_enhance_container textarea')[1].value.split(' ').filter(v => !!v),
            excludedUsers: $('#colg_enhance_container textarea')[2].value.split(' ').filter(v => !!v),
          }
          utils.saveConfig(config);
          runEnhancer();
          $container.hide();
          $body.css('overflow', 'initial');
        });
        utils.bindClick('a.bm_h', e => {
          const doRunEnhancer = setInterval(function () {
            if ($('a.bm_h').text() != '正在加载, 请稍后...') {
              runEnhancer();
              clearInterval(doRunEnhancer);
            }
          }, 200);
        });
        utils.bindClick('#loadmore', e => {
          loadPages(5);
        });
      }

      const loadPages = pageNum => {
        for (var i = 0; i < pageNum; i++) {
          setTimeout(function () {
            $('a.bm_h').click();
          }, i * 1000);
        }
      }

      // init form values
      const initDomValue = config => {
        $('#colg_enhance_container textarea')[0].value = (config.includedKeywords || []).join(' ');
        $('#colg_enhance_container textarea')[1].value = (config.excludedKeywords || []).join(' ');
        $('#colg_enhance_container textarea')[2].value = (config.excludedUsers || []).join(' ');
      }
      const init = () => {
        const config = utils.getConfig() || {};
        initDom();
        initDomValue(config);
        initDomEvents();
        runEnhancer();
      }
      const destory = () => {
        // remove dom events
        utils.unbindAllClick();
        // remove all added elements
        $('#.colg_added').remove();
      }
      return {
        init,
        destory,
        _version: '0.1'
      }
    }
    // init
    if (window.colgEnchancer) {
      const enhancer = createEnhancer();
      if (!colgEnchancer._version) {
        colgEnchancer._version = '0'
      }
      if (window.colgEnchancer._version < enhancer._version) {
        if (colgEnchancer.destory) {
          colgEnchancer.destory();
        }
        window.colgEnchancer = enhancer;
        colgEnchancer.init();
      }
    } else {
      window.colgEnchancer = createEnhancer();
      colgEnchancer.init();
    }
  })();
})(window.jQuery.noConflict(true));