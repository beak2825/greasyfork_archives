// ==UserScript==
// @name         X岛-EX
// @namespace    http://tampermonkey.net/
// @version      2.0.8
// @description  X岛-EX 网页端增强，移动端般的浏览体验：快捷切换饼干/ 添加页首页码 / 关闭图片水印 / 预览真实饼干 / 隐藏无标题/无名氏/版规 / 显示外部图床 / 自动刷新饼干 toast提示 / 无缝翻页 自动翻页 / 默认原图+控件 / 新标签打开串 / 优化引用弹窗 / 拓展引用格式 / 当页回复编号 / 扩展坞增强 / 拦截回复中间页 / 颜文字拓展 / 高亮PO主 / 发串UI调整 / 『分组标记饼干』/『屏蔽饼干』/『屏蔽关键词』 / 增强X岛匿名版 / 板块页快速回复 / 展开板块页长串 / 野生搜索酱 / unvcode。
// @author       XY
// @match        https://*.nmbxd1.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @grant        GM_xmlhttpRequest
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      WTFPL
// @note         致谢：切饼代码移植自[XD-Enhance](https://greasyfork.org/zh-CN/scripts/438164-xd-enhance)
// @note         致谢：外部图床代码二改自[显示x岛图片链接指向的图片](https://greasyfork.org/zh-CN/scripts/546024-%E6%98%BE%E7%A4%BAx%E5%B2%9B%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%E6%8C%87%E5%90%91%E7%9A%84%E5%9B%BE%E7%89%87)
// @note         致谢：完整移植[增强x岛匿名版](https://greasyfork.org/zh-CN/scripts/513156-%E5%A2%9E%E5%BC%BAx%E5%B2%9B%E5%8C%BF%E5%90%8D%E7%89%88)
// @note         致谢：部分功能移植自[X岛-揭示板的增强型体验](https://greasyfork.org/zh-CN/scripts/497875-x%E5%B2%9B-%E6%8F%AD%E7%A4%BA%E6%9D%BF%E7%9A%84%E5%A2%9E%E5%BC%BA%E5%9E%8B%E4%BD%93%E9%AA%8C#%E8%BF%9E%E6%8E%A5%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC)
// @note         致谢：来自4sYbzEX的搜索服务[野生搜索酱](https://www.nmbxd.com/t/64792841)
// @note         致谢：来自acVMxuv的[侧边栏优化]((https://greasyfork.org/zh-CN/scripts/553143-x%E5%B2%9B%E4%BC%98%E5%8C%96%E5%B2%9B-%E4%BE%A7%E8%BE%B9%E6%A0%8F%E4%BC%98%E5%8C%96%E7%89%88))
// @downloadURL https://update.greasyfork.org/scripts/531005/X%E5%B2%9B-EX.user.js
// @updateURL https://update.greasyfork.org/scripts/531005/X%E5%B2%9B-EX.meta.js
// ==/UserScript==
/* global $, jQuery */
// @run-at document-end

(function($){
  'use strict';
 
  /* --------------------------------------------------
   * tag 0. 通用与工具函数
   * -------------------------------------------------- */
  const toastQueue = [];
  let isShowing = false;
  
  function toast(msg, duration = 1800) {
    toastQueue.push({ msg, duration });
    if (!isShowing) showNextToast();
  }
  
  function showNextToast() {
    if (toastQueue.length === 0) {
      isShowing = false;
      return;
    }
    isShowing = true;
    const { msg, duration } = toastQueue.shift();
  
    // ✅ 每次创建一个新的 toast 节点
    const $t = $(`<div class="ae-toast" style="
      position:fixed;top:10px;left:50%;transform:translateX(-50%);
      background:rgba(0,0,0,.75);color:#fff;padding:8px 18px;
      border-radius:5px;z-index:9999;display:none;font-size:14px;">
      ${msg}
    </div>`);
  
    $('body').append($t);
  
    $t.fadeIn(240).delay(duration).fadeOut(240, () => {
      $t.remove();     // ✅ 动画结束后删除节点
      showNextToast(); // ✅ 显示下一个
    });
  }
  

  const Utils = {
      // 逗号(中英)分隔，支持转义 \, \， \\
      strToList(s) {
        if (!s) return [];
        const list = [], esc = ',，\\';
        let cur = '';
        for (let i = 0; i < s.length; i++) {
          const ch = s[i];
          if (ch === '\\' && i + 1 < s.length && esc.includes(s[i+1])) {
            cur += s[++i];
          } else if (ch === ',' || ch === '，') {
            const t = cur.trim();
            if (t) list.push(t);
            cur = '';
          } else cur += ch;
        }
        const t = cur.trim();
        if (t) list.push(t);
        return [...new Set(list)];
      },

      cookieLegal: s => /^[A-Za-z0-9]{3,7}$/.test(s),

      cookieMatch: (cid,p) => cid.toLowerCase().includes(p.toLowerCase()),

      firstHit(txt,list) {
        return list.find(k=>txt.toLowerCase().includes(k.toLowerCase()))||null;
      },

      collapse($elem, hint) {
        if (!$elem.length || $elem.data('xdex-collapsed')) return;
        const $icons = $elem.find('.h-threads-item-reply-icon');
        let nums = '';
        if ($icons.length) {
          const f = $icons.first().text();
          const l = $icons.last().text();
          nums = $icons.length>1 ? `${f}-${l} ` : `${f} `;
        }
        const cap = `${nums}${hint}`;
        const $ph = $(`
          <div class="xdex-placeholder xdex-generic-toggle" style="
            padding:6px 10px;background:#fafafa;color:#888;
            border:1px dashed #bbb;margin-bottom:3px;cursor:pointer;">
            ${cap}（点击展开）
          </div>
        `);
        $elem.before($ph).hide().data('xdex-collapsed',true);
        $elem.addClass('xdex-generic-collapsed'); // ★ 标记为公用折叠，以免触发板块页长串折叠/收起

        $ph.on('click',()=>{
          if($elem.is(':visible')){
            $elem.hide(); $ph.html(`${cap}（点击展开）`);
          } else {
            $elem.show(); $ph.text('点击折叠');
          }
        });
      return $ph;
      },

      // ===== 引用串优化缓存相关 =====
      quoteCache: {},

      getQuoteFromCache(id) {
        return this.quoteCache[id] || GM_getValue('quote_' + id, null);
      },

      saveQuoteToCache(id, html) {
        this.quoteCache[id] = html;
        GM_setValue('quote_' + id, html);
      }
  };


  // 多分组标记时依次使用的背景色（可扩充）
  const markColors = [
    '#66CCFF','#00FFCC','#EE0000','#006666','#0080FF','#FFFF00',
    '#39C5BB','#9999FF','#FF4004','#3399FF','#D80000','#F6BE71',
    '#EE82EE','#FFA500','#FFE211','#FAAFBE','#0000FF'
  ];

  // 解析"最后一个冒号分隔"的分组：返回 {desc, list}
  function parseDescAndListByLastColon(raw) {
    const idx = Math.max(raw.lastIndexOf(':'), raw.lastIndexOf('：'));
    let desc = '';
    let cookiePart = '';
    
    if (idx > 0) {
      // 有冒号：冒号前是备注/说明，冒号后是饼干
      desc = raw.slice(0, idx).trim();
      cookiePart = raw.slice(idx + 1).trim();
    } else {
      // 没有冒号：整个字符串都是饼干
      cookiePart = raw.trim();
    }
    
    const list = Utils.strToList(cookiePart);
    return { desc, list };
  }

  // 校验分组说明长度（<=20 字符；满足“10个汉字/20个英文字符”的近似约束）
  function isValidDesc(desc) { return !desc || desc.length <= 20; }

  // 兼容旧版本 blockedCookies 值到“组结构”
  function normalizeBlockedGroups(val) {
    if (!val) return [];
    if (typeof val === 'string') {
      const tokens = Utils.strToList(val);
      return tokens.map(t=>{
        const {desc, list} = parseDescAndListByLastColon(t);
        const id = list[0] || '';
        return id && Utils.cookieLegal(id) ? { desc, cookies:[id] } : null;
      }).filter(Boolean);
    }
    if (Array.isArray(val)) {
      if (val.length && 'cookies' in val[0]) {
        return val.map(g=>({
          desc: g.desc || '',
          cookies: Array.isArray(g.cookies) ? g.cookies.filter(Utils.cookieLegal) : []
        })).filter(g=>g.cookies.length);
      }
      if (val.length && 'cookie' in val[0]) {
        const map = new Map();
        val.forEach(({cookie, desc})=>{
          if (!Utils.cookieLegal(cookie)) return;
          const key = desc || '';
          if (!map.has(key)) map.set(key, []);
          map.get(key).push(cookie);
        });
        return [...map.entries()].map(([desc, cookies])=>({desc, cookies}));
      }
    }
    return [];
  }

  /* --------------------------------------------------
   * tag 1. 设置面板
   * -------------------------------------------------- */
  const SettingPanel = {
    key: 'myScriptSettings',
    defaults: {
      enableCookieSwitch: true,
      duplicatePagination: true,
      disableWatermark: true,
      enablePaginationDuplication: true,
      updatePreviewCookie: true,
      hideEmptyTitleEmail: true,
      enableExternalImagePreview: true,  // 外部图床显示
      enableAutoCookieRefresh: true,
      enableAutoCookieRefreshToast: false,
      interceptReplyFormUnvcode: true, // 拦截回复中间页--unvcode
      interceptReplyFormU200B: true,
      enableSeamlessPaging: true,
      enableAutoSeamlessPaging: true,
      enableHDImageAndLayoutFix: true,               // 启用高清图片链接
      enableLinkBlank: true, // 串页新标签打开
      enableQuotePreview: true, // 优化引用弹窗
      extendQuote: true, // 拓展引用格式
      enablePostExpandAll: false, // 默认展开/收起板块页长串
      toggleSidebar: false, // 侧边栏收起功能
      replyModeDefault: '发串',   // 板块页默认模式：发串/回复
      replyExtraDefault: '临时',  // 板块/时间线默认额外模式：临时/连续
      markedGroups: [],
      blockedCookies: [],
      blockedKeywords: ''
    },
    state: {},

    init() {
      const saved = GM_getValue(this.key, {});
      this.state = Object.assign({}, this.defaults, saved);
      // 兼容迁移：屏蔽饼干到组结构
      this.state.blockedCookies = normalizeBlockedGroups(this.state.blockedCookies);
      GM_setValue(this.key, this.state);

      this.render();
      GM_addValueChangeListener(this.key,(k,ov,nv,remote)=>{
        if(remote && !$('#sp_cover').is(':visible')){
          this.state = Object.assign({}, this.defaults, nv);
          this.state.blockedCookies = normalizeBlockedGroups(this.state.blockedCookies);
          this.syncInputs();
        }
      });
    },

    render() {
      if (!$('#xdex-setting-style').length) {
          $('head').append(`
              <style id="xdex-setting-style">
                  .xdex-inv {opacity:0;pointer-events:none;}

                  /* 默认按钮样式：迷你 EX */
                  #sp_btn {
                      position:fixed;
                      top:10px;
                      right:10px;
                      z-index:10000;
                      padding:4px 8px;
                      font-size:12px;
                      border:none;
                      background:#66CCFF;
                      color:#fff;
                      border-radius:20px;
                      white-space:nowrap;
                      overflow:hidden;
                      max-width: 34px; /* 容纳"EX" */
                      transition: all 0.3s ease;
                      cursor:pointer;
                  }

                  /* 悬停展开 */
                  #sp_btn:hover {
                      padding:6px 16px;
                      font-size:14px;
                      max-width:150px; /* 容纳"EX设置" */
                  }

                  /* 文字渐显 */
                  #sp_btn span {
                      opacity:0;
                      transition:opacity 0.2s ease;
                      margin-left:4px;
                  }
                  #sp_btn:hover span {
                      opacity:1;
                 }
              </style>
          `);
      }

      if (!$('#sp_btn').length) {
        $('body').append(
            $('<button id="sp_btn">EX<span>设置</span></button>')
                .on('click',()=>$('#sp_cover').fadeIn())
        );
    }


      const fold = (id,title,ph) => `
        <div class="sp_fold" style="border:1px solid #eee;margin:6px 0;">
          <div class="sp_fold_head" data-btn="#btn_${id}"
              style="display:flex;align-items:center;padding:6px 8px;background:#fafafa;cursor:pointer;">
            <span>${title}</span>
            <button id="btn_${id}" class="sp_save xdex-inv" data-id="${id}"
                    style="margin-left:auto;padding:2px 8px;">保存</button>
          </div>
          <div class="sp_fold_body" style="display:none;padding:8px 10px;">
            <input id="${id}" style="width:100%;padding:5px;" placeholder="${ph}">
          </div>
        </div>`;

      const html = `
        <style>
          .fixed-on {
            accent-color: #000; /* 勾选颜色黑色 */
          }

          .fixed-on:disabled {
            opacity: 1;         /* 不降低透明度 */
            filter: none;       /* 去掉可能的灰度滤镜 */
            cursor: default;    /* 鼠标变成普通箭头 */
          }
        </style>
        <div id="sp_cover" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:9999;">
          <div id="sp_panel" style="
              position:relative;margin:40px auto;width:480px;
              max-height:calc(100vh - 80px);background:#fff;border-radius:8px;
              display:flex;flex-direction:column;box-shadow:0 2px 10px rgba(0,0,0,0.2);">
            <div id="sp_panel_content" style="padding:18px;overflow-y:auto;flex:1;min-height:300px;">
              <h2 style="margin:0 0 10px;">X岛-EX 设置</h2>
              <div id="sp_checkbox_container" style="display:flex;flex-wrap:wrap;">
                <div style="width:50%;"><input type="checkbox" id="sp_enableCookieSwitch"><label for="sp_enableCookieSwitch"> 快捷切换饼干</label></div>
                <div style="width:50%;"><input type="checkbox" id="sp_enablePaginationDuplication"><label for="sp_enablePaginationDuplication"> 添加页首页码</label></div>
                <div style="width:50%;"><input type="checkbox" id="sp_disableWatermark"><label for="sp_disableWatermark"> 关闭图片水印</label></div>
                <div style="width:50%;"><input type="checkbox" id="sp_updatePreviewCookie"><label for="sp_updatePreviewCookie"> 预览真实饼干</label></div>
                <div style="width:50%;"><input type="checkbox" id="sp_hideEmptyTitleEmail"><label for="sp_hideEmptyTitleEmail"> 隐藏无标题/无名氏/版规</label></div>
                <div style="width:50%;"><input type="checkbox" id="sp_enableExternalImagePreview"><label for="sp_enableExternalImagePreview"> 显示外部图床</label></div>
                <div style="width:50%;"><input type="checkbox" id="sp_enableAutoCookieRefresh"><label for="sp_enableAutoCookieRefresh"> 自动刷新饼干</label><input type="checkbox" id="sp_enableAutoCookieRefreshToast" style="margin-left:8px;"><label for="sp_enableAutoCookieRefreshToast"> toast提示</label></div>
                <div style="width:50%;"><input type="checkbox" id="sp_enableSeamlessPaging"><label for="sp_enableSeamlessPaging"> 无缝翻页</label><input type="checkbox" id="sp_enableAutoSeamlessPaging" checked style="margin-left:8px;"><label for="sp_enableAutoSeamlessPaging"> 自动翻页</label></div>
                <div style="width:50%;"><input type="checkbox" id="sp_enableHDImageAndLayoutFix"><label for="sp_enableHDImageAndLayoutFix"> 图片控件-布局调整</label></div>
                <div style="width:50%;"><input type="checkbox" id="sp_enableLinkBlank"><label for="sp_enableLinkBlank"> 新标签打开串</label></div>
                <div style="width:50%;"><input type="checkbox" id="sp_enableQuotePreview"><label for="sp_enableQuotePreview"> 优化引用弹窗</label></div>
                <div style="width:50%;"><input type="checkbox" id="sp_extendQuote"><label for="sp_extendQuote"> 拓展引用格式</label></div>
                <div style="width:50%;"><input type="checkbox" id="sp_toggleSidebar"><label for="sp_toggleSidebar"> 自动收起侧边栏</label></div>
                <div style="width:50%;"><input type="checkbox" id="sp_interceptReplyFormUnvcode"><label for="sp_interceptReplyFormUnvcode"> unvcode</label><input type="checkbox" id="sp_interceptReplyFormU200B"><label for="sp_interceptReplyFormU200B"> 零宽空格优先</label></div>
                <!-- <div style="width:50%;"><label for="sp_占位"> </label></div> -->
                <!-- 以下是默认勾选项不可更改 -->
                <div style="width:50%;"><input type="checkbox" id="sp_updateReplyNumbers" class="fixed-on" checked disabled><label for="sp_updateReplyNumbers"> 当页回复编号</label><input type="hidden" name="sp_updateReplyNumbers" value="1"></div>
                <div style="width:50%;"><input type="checkbox" id="sp_replaceRightSidebar" class="fixed-on" checked disabled><label for="sp_replaceRightSidebar"> 扩展坞增强</label><input type="hidden" name="sp_replaceRightSidebar" value="1"></div>
                <div style="width:50%;"><input type="checkbox" id="sp_interceptReplyForm" class="fixed-on" checked disabled><label for="sp_interceptReplyForm"> 拦截回复中间页</label></div>
                <div style="width:50%;"><input type="checkbox" id="sp_kaomojiEnhancer" class="fixed-on" checked disabled><label for="sp_kaomojiEnhancer"> 颜文字拓展</label><input type="hidden" name="sp_kaomojiEnhancer" value="1"></div>
                <div style="width:50%;"><input type="checkbox" id="sp_highlightPO" class="fixed-on" checked disabled><label for="sp_highlightPO"> 标记Po主</label><input type="hidden" name="sp_highlightPO" value="1"></div>
                <div style="width:50%;"><input type="checkbox" id="sp_enhancePostFormLayout" class="fixed-on" checked disabled><label for="sp_enhancePostFormLayout"> 发串UI调整</label><input type="hidden" name="sp_enhancePostFormLayout" value="1"></div>
                <div style="width:50%;"><input type="checkbox" id="sp_applyFilters" class="fixed-on" checked disabled><label for="sp_applyFilters"> 标记/屏蔽-饼干/关键词</label><input type="hidden" name="sp_applyFilters" value="1"></div>
                <div style="width:50%;"><input type="checkbox" id="sp_enhanceIsland" class="fixed-on" checked disabled><label for="sp_enhanceIsland"> 增强X岛匿名版</label><input type="hidden" name="sp_enhanceIsland" value="1"></div>
                <div style="width:50%; display:flex; align-items:center; gap:8px;"><input type="checkbox" id="sp_enablePostExpand" class="fixed-on" checked disabled><label for="sp_enablePostExpand"> 展开板块页长串</label><button id="sp_enablePostExpandAll" type="button" style="display:inline-flex; align-items:center; width:auto; padding:2px 8px; font-size:13px; cursor:pointer;">全部展开</button><input type="hidden" name="sp_enablePostExpand" value="1"></div>
                <div style="width:50%;"><input type="checkbox" id="sp_searchServiceBy4sY" class="fixed-on" checked disabled><label for="sp_searchServiceBy4sY"> 野生搜索酱</label><input type="hidden" name="sp_searchServiceBy4sY" value="1"></div>
            </div>

              <div style="margin-top:12px;">
                <h3 id="sp_replyQuicklyOnBoardPage" style="margin:6px 0;">板块页快速回复默认设置</h3>
                <div style="display:flex; gap:12px; margin:4px 0;">
                  <!-- 左侧：板块页默认模式 -->
                  <div style="flex:1; display:flex; flex-direction:column;">
                    <label for="sp_replyModeDefault" style="margin-bottom:4px;">板块页默认模式</label>
                    <select id="sp_replyModeDefault" style="width:100%;">
                      <option value="发串">发串</option>
                      <option value="回复">回复</option>
                    </select>
                  </div>
                  <!-- 右侧：回复默认模式 -->
                  <div style="flex:1; display:flex; flex-direction:column;">
                    <label for="sp_replyExtraDefault" style="margin-bottom:4px;">回复默认模式</label>
                    <select id="sp_replyExtraDefault" style="width:100%;">
                      <option value="临时">临时</option>
                      <option value="连续">连续</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style="margin-top:12px;">
                <!-- 标记饼干（组） -->
                <div class="sp_fold" style="border:1px solid #eee;margin:6px 0;">
                  <div class="sp_fold_head" data-btn="#btn_sp_marked,#btn_group_marked"
                      style="display:flex;align-items:center;padding:6px 8px;background:#fafafa;cursor:pointer;">
                    <span>标记饼干</span>
                    <button id="btn_group_marked" class="xdex-inv" style="margin-left:auto;padding:2px 8px;">添加分组</button>
                    <button id="btn_sp_marked" class="sp_save xdex-inv" data-id="sp_marked"
                            style="margin-left:4px;padding:2px 8px;">保存</button>
                  </div>
                  <div class="sp_fold_body" style="display:none;padding:8px 10px;">
                    <div id="marked-inputs-container"></div>
                  </div>
                </div>

                <!-- 屏蔽饼干（组，含备注） -->
                <div class="sp_fold" style="border:1px solid #eee;margin:6px 0;">
                  <div class="sp_fold_head" data-btn="#btn_sp_blocked,#btn_group_blocked"
                      style="display:flex;align-items:center;padding:6px 8px;background:#fafafa;cursor:pointer;">
                    <span>屏蔽饼干</span>
                    <button id="btn_group_blocked" class="xdex-inv" style="margin-left:auto;padding:2px 8px;">添加分组</button>
                    <button id="btn_sp_blocked" class="sp_save xdex-inv" data-id="sp_blocked"
                            style="margin-left:4px;padding:2px 8px;">保存</button>
                  </div>
                  <div class="sp_fold_body" style="display:none;padding:8px 10px;">
                    <div id="blocked-inputs-container"></div>
                  </div>
                </div>

                <!-- 屏蔽关键词（单输入） -->
                ${fold('sp_blockedKeywords','屏蔽关键词','关键词请用逗号隔开，词中包含逗号请加\\\转义')}
              </div>
            </div>

            <div id="sp_panel_footer" style="padding:10px 18px;text-align:right;border-top:1px solid #eee;background:#fff;">
              <button id="sp_apply" style="margin-right:10px;padding:6px 10px;">应用更改</button>
              <button id="sp_close" style="padding:6px 10px;">关闭</button>
            </div>
          </div>
        </div>`;
      $('#sp_cover').remove();
      $('body').append(html);

      // 折叠头：统一控制
      $('.sp_fold_head').off('click').on('click', function(){
        const $head = $(this);
        $head.next('.sp_fold_body').slideToggle(150);
        const btns = ($head.data('btn') || '').split(',');
        btns.forEach(sel => $(sel).toggleClass('xdex-inv'));
      });

      // 同步已有配置 & 默认折叠
      this.syncInputs();

      // --- 初始化“全部展开/全部收起”按钮 (id = sp_enablePostExpandAll) ---
      (function initExpandAllButton() {
          const btn = document.getElementById('sp_enablePostExpandAll');
          if (!btn) return;

          const updateButton = (state) => {
          btn.textContent = state ? '全部收起' : '全部展开';
          btn.setAttribute('aria-pressed', state ? 'true' : 'false');
          };

          // 初次渲染时根据 state 设置按钮文字
          const initialState = !!(SettingPanel.state && SettingPanel.state.enablePostExpandAll);
          updateButton(initialState);

          btn.addEventListener('click', (e) => {
              e.stopPropagation();
              const newState = !SettingPanel.state.enablePostExpandAll;
              SettingPanel.state.enablePostExpandAll = newState;

              // 更新按钮文字
              btn.textContent = newState ? '全部收起' : '全部展开';

              // 找到“当前在看的串” = 视窗中第一个顶部进入视窗的串
              const items = document.querySelectorAll('.h-threads-item-index');
              let anchor = null;
              for (const item of items) {
              const rect = item.getBoundingClientRect();
              if (rect.top >= 0) { anchor = item; break; }
              }
              if (!anchor && items.length) anchor = items[items.length - 1];
              const anchorTopBefore = anchor ? anchor.getBoundingClientRect().top : null;

              // 执行展开/收起
              items.forEach(item => {
              const toggleBtn = item.querySelector('.h-threads-info .js-toggle-mode');
              if (!toggleBtn) return;
              const expanded = item.classList.contains('expanded');
              if (newState && !expanded) {
                  toggleBtn.click(); // 全部展开
              } else if (!newState && expanded) {
                  toggleBtn.click(); // 全部收起
              }
              });

              // 统一补偿滚动，保证锚点位置不变
              if (!newState && anchor && anchorTopBefore !== null) {
              requestAnimationFrame(() => {
                  const anchorTopAfter = anchor.getBoundingClientRect().top;
                  const delta = anchorTopAfter - anchorTopBefore;
                  window.scrollBy({ top: delta, behavior: 'instant' });
              });
              }

              // 保存状态
              try { GM_setValue(SettingPanel.key, SettingPanel.state); } catch (err) {}
          });

      })();

      // 标记：新增组输入
      $('#btn_group_marked').off('click').on('click', e=>{
        e.stopPropagation();
        $('#marked-inputs-container').append(
          `<input class="marked-input" style="width:100%;padding:5px;"
                  placeholder="备注:3-7位饼干ID,多个用逗号隔开">`
        ).find('input').last().focus();
      });
      // 屏蔽：新增组输入
      $('#btn_group_blocked').off('click').on('click', e=>{
        e.stopPropagation();
        $('#blocked-inputs-container').append(
          `<input class="blocked-input" style="width:100%;padding:5px;"
                  placeholder="备注:3-7位饼干ID,多个用逗号隔开">`
        ).find('input').last().focus();
      });

      // 标记：保存
      $('#btn_sp_marked').off('click').on('click', e=>{
        e.stopPropagation();
        const parsed = [];
        let valid = true;
        $('#marked-inputs-container .marked-input').each((_,el)=>{
          const v = $(el).val().trim();
          if (!v) return;
          const { desc, list } = parseDescAndListByLastColon(v);
          if (!list.length) { toast(`“${v}” 未指定饼干`); valid=false; return false; }
          if (!isValidDesc(desc)) { toast(`“${v}” 备注过长`); valid=false; return false; }
          if (list.some(id=>!Utils.cookieLegal(id))) { toast(`“${v}” 存在不合法饼干`); valid=false; return false; }
          parsed.push({ desc, cookies: list });
        });
        if (!valid) return;
        this.state.markedGroups = parsed;
        GM_setValue(this.key, this.state);
        toast('标记分组已保存');
        applyFilters(this.state);
      });

      // 屏蔽：保存
      $('#btn_sp_blocked').off('click').on('click', e=>{
        e.stopPropagation();
        const parsed = [];
        let valid = true;
        $('#blocked-inputs-container .blocked-input').each((_,el)=>{
          const v = $(el).val().trim();
          if (!v) return;
          const { desc, list } = parseDescAndListByLastColon(v);
          if (!list.length) { toast(`“${v}” 未指定饼干`); valid=false; return false; }
          if (!isValidDesc(desc)) { toast(`“${v}” 备注过长`); valid=false; return false; }
          if (list.some(id=>!Utils.cookieLegal(id))) { toast(`“${v}” 存在不合法饼干`); valid=false; return false; }
          parsed.push({ desc, cookies: list });
        });
        if (!valid) return;
        this.state.blockedCookies = parsed;
        GM_setValue(this.key, this.state);
        toast('屏蔽分组已保存');
        applyFilters(this.state);
      });

      // 屏蔽关键词：单项保存
      $('.sp_save').filter('[data-id="sp_blockedKeywords"]').off('click').on('click', e=>{
        e.stopPropagation();
        const v = $('#sp_blockedKeywords').val().trim();
        if (v && !Utils.strToList(v).length) return toast('屏蔽关键词 规则有误');
        this.state.blockedKeywords = v;
        GM_setValue(this.key, this.state);
        toast('屏蔽关键词已保存');
        applyFilters(this.state);
      });

      // 应用更改：保存开关、屏蔽(组)、标记(组)
      $('#sp_apply').off('click').on('click', ()=>{
        [
          'enableCookieSwitch',
          'duplicatePagination',
          'disableWatermark',
          'enablePaginationDuplication',
          'updatePreviewCookie',
          'hideEmptyTitleEmail',
          'enableExternalImagePreview',
          'enableAutoCookieRefresh',
          'enableAutoCookieRefreshToast',
          'interceptReplyFormUnvcode',
          'interceptReplyFormU200B',
          'enableSeamlessPaging',
          'enableAutoSeamlessPaging',
          'enableHDImageAndLayoutFix',
          'enableLinkBlank',
          'enableQuotePreview',
          'extendQuote',
          'toggleSidebar'
        ].forEach(k=> this.state[k] = $('#sp_'+k).is(':checked'));
      // ====== 新增：sp_enablePostExpandAll 按钮（即时生效 & 持久化） ======
      $('#sp_enablePostExpandAll').off('click').on('click', (e)=>{
          e.stopPropagation();
          // toggle 状态
          this.state.enablePostExpandAll = !this.state.enablePostExpandAll;

          // 更新按钮文字（立即反馈）
          $('#sp_enablePostExpandAll').text(this.state.enablePostExpandAll ? '全部收起' : '全部展开');

          // 立即持久化（无论是否点“应用更改”都生效）
          try {
            GM_setValue(this.key, this.state);
          } catch (err) {
            console.warn('保存 enablePostExpandAll 失败：', err);
          }

          // 立即应用到页面上（如果 enablePostExpand 已经存在则调用 applyPostExpandAllMode）
          try {
            if (typeof applyPostExpandAllMode === 'function') {
              applyPostExpandAllMode(this.state.enablePostExpandAll);
            } else if (typeof enablePostExpand === 'function') {
              // 如果 enablePostExpand 尚未初始化，先初始化（enablePostExpand 内也会读取 SettingPanel.state）
              try { enablePostExpand(); } catch(e){ /* 忽略 */ }
              // 尝试延迟调用全局应用函数（容错）
              setTimeout(()=>{ if (typeof applyPostExpandAllMode === 'function') applyPostExpandAllMode(this.state.enablePostExpandAll); }, 80);
            }
          } catch (err) {
            console.warn('applyPostExpandAllMode 调用异常：', err);
          }
        });

        // 屏蔽关键词
        this.state.blockedKeywords = $('#sp_blockedKeywords').val().trim();

        this.state.replyModeDefault = $('#sp_replyModeDefault').val();
        this.state.replyExtraDefault = $('#sp_replyExtraDefault').val();

        // 标记分组
        const mk = [];
        let valid = true;
        $('#marked-inputs-container .marked-input').each((_,el)=>{
          const v = $(el).val().trim();
          if (!v) return;
          const { desc, list } = parseDescAndListByLastColon(v);
          if (!list.length) { toast(`“${v}” 未指定饼干`); valid=false; return false; }
          if (!isValidDesc(desc)) { toast(`“${v}” 分组说明过长`); valid=false; return false; }
          if (list.some(id=>!Utils.cookieLegal(id))) { toast(`“${v}” 存在不合法饼干`); valid=false; return false; }
          mk.push({ desc, cookies: list });
        });
        if (!valid) return;
        this.state.markedGroups = mk;

        // 屏蔽分组
        const bk = [];
        $('#blocked-inputs-container .blocked-input').each((_,el)=>{
          const v = $(el).val().trim();
          if (!v) return;
          const { desc, list } = parseDescAndListByLastColon(v);
          if (!list.length) { toast(`“${v}” 未指定饼干`); valid=false; return false; }
          if (!isValidDesc(desc)) { toast(`“${v}” 备注过长`); valid=false; return false; }
          if (list.some(id=>!Utils.cookieLegal(id))) { toast(`“${v}” 存在不合法饼干`); valid=false; return false; }
          bk.push({ desc, cookies: list });
        });
        if (!valid) return;
        this.state.blockedCookies = bk;

        GM_setValue(this.key, this.state);
        toast('保存成功，即将刷新页面');
        setTimeout(()=>location.reload(),500);
      });

      // 关闭面板
      $('#sp_close,#sp_cover').off('click').on('click', e=>{
        if (e.target.id==='sp_close' || e.target.id==='sp_cover')
          $('#sp_cover').fadeOut();
      });

      //鼠标悬浮在具体功能上显示提示
      // ====== 1. 定义功能描述映射表 ======
      const spDescriptions = {
        sp_enableCookieSwitch: '发帖框上方添加饼干切换器，单击即可快速切换饼干。使用前可单击“刷新”以获取当前登陆账户最新饼干列表。',
        sp_enablePaginationDuplication: '在串首页添加页码导航栏',
        sp_disableWatermark: '取消发图默认勾选的水印选项',
        sp_updatePreviewCookie: '为“增强X岛匿名版”添加的预览框显示真实饼干',
        sp_hideEmptyTitleEmail: '隐藏帖内无标题、无名氏和版规提示，优化显示效果，减少版面占用',
        sp_enableExternalImagePreview: '直接显示外部图床的图片',
        sp_enableAutoCookieRefresh: '回到X岛页面后自动刷新饼干，以防错饼',
        sp_enableAutoCookieRefreshToast: '自动刷新时显示toast提示，触发频率较高，建议关闭',
        sp_enableSeamlessPaging: '阅读到页面底部时无缝加载下一页并为新页首添加页码提示',
        sp_enableAutoSeamlessPaging: '滚动到页面底部后自动触发无缝翻页，关闭则可使用按钮手动无缝翻页',
        sp_enableHDImageAndLayoutFix: 'X岛-揭示板的增强型体验:默认加载原图而非缩略图，并为所有图片添加X岛自带图片控件；调整布局，防止文字与图片溢出',
        sp_enableLinkBlank: 'X岛-揭示板的增强型体验:串页链接在新标签页打开',
        sp_enableQuotePreview: '优化引用弹窗显示，将鼠标悬停出现引用弹窗改为点击显示引用弹窗，引用弹窗可持久存在，支持嵌套、拖拽，点击非引用弹窗区域或ESC键可关闭当前引用弹窗，点击右下角×以关闭全部引用弹窗',
        sp_extendQuote: '拓展引用格式，支持除“>>No.66994128”标准引用格式外的引用，例如“>>66994128”、“66994128”、“No.66994128”，同样支持“优化引用弹窗”',
        sp_toggleSidebar: '来自acVMxuv的自动收起右侧扩展坞侧边栏，鼠标悬停时展开显示',
        sp_updateReplyNumbers: '添加当页内回复编号显示',
        sp_replaceRightSidebar: '增强右侧扩展坞功能，点击REPLY按钮打开回复弹窗，点击非回复弹窗区域或ESC键可关闭回复弹窗，另外支持使用CTRL+ENTER发送消息',
        sp_interceptReplyForm: '拦截回复跳转中间页，使用toast提示发送成功/失败信息',
        sp_interceptReplyFormUnvcode: '不可明说的功能，请参照https://words-away.typeboom.com/说明',
        sp_interceptReplyFormU200B: '优先使用插入零宽空格模式而非unvcode替换模式',
        sp_kaomojiEnhancer: '拓展颜文字功能，添加更多颜文字（来自蓝岛）,优化选择颜文字弹窗，选择颜文字后可插入光标所在处',
        sp_highlightPO: '为回复添加Po主标志，PO主回复编号使用角标显示',
        sp_enhancePostFormLayout: '优化发串/回复表单布局，将“送出”按钮移至颜文字栏目，折叠“标题”“E-mail”“名称”等不常用项目，节省版面',
        sp_applyFilters: '标记/屏蔽-饼干/关键词过滤规则',
        sp_enhanceIsland: '增强X岛匿名版:\n1.发串前显示预览：麻麻再也不用担心我的ASCII ART排版失误了,另外支持预览插入图片和外部图床图片；\n2.自动保存编辑：记忆文本框内容（防止屏蔽词导致被吞），可以在翻页等各种页面切换后保存，仅在“回复成功”后删除，按主串号 "/t/xxxx" 分开存储；\n3.追记引用串号：点击串号回复时附加到光标所在处（或替换文本选区），可追记多条引用；\n4.人类友好的时间显示：如“5秒前”、“1小时前”、“昨天”等；\n5.粘贴插入图片：直接粘贴，将自动作为图片插入\n自动添加标题：将po主设置的标题或者第一行文字 + 页码设置为标签页标题',
        sp_replyQuicklyOnBoardPage: '为板块页添加快速回复模式，在板块页即可回串，页面实时更新，无需跳转串内；并额外支持时间线内回串。\n“板块页默认模式”可选“发串/回复”两种模式，“回复默认模式”可选“临时/连续”两种回复模式，临时模式下回复成功即清除回串信息，连续模式可连续回复直到手动清理回串信息，搭配回复浮窗使用效果更佳',
        sp_enablePostExpand: '为板块页内串添加“展开/收起”按钮，点击即可切换长串的完整显示与折叠显示',
        sp_searchServiceBy4sY: '官方搜索当前不可用，公告详见：https://www.nmbxd1.com/t/56546294\n替换搜索按钮为来自4sYbzEX的“野生搜索酱”，具体使用方法请查阅原串：https://www.nmbxd.com/t/64792841'
      };

      // ====== 2. 创建 tooltip 元素并添加样式 ======
      if (!$('#sp_tooltip').length) {
        $('body').append('<div id="sp_tooltip"></div>');
        const tooltipStyle = `
          #sp_tooltip {
            position: fixed;
            max-width: 260px;
            background: rgba(0,0,0,0.85);
            color: #fff;
            padding: 6px 10px;
            border-radius: 4px;
            font-size: 12px;
            line-height: 1.4;
            pointer-events: none;
            display: none;
            z-index: 100000;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            transition: opacity 0.15s ease;
            opacity: 0;
            white-space: pre-line;
          }
          #sp_tooltip.show {
            display: block;
            opacity: 1;
          }
        `;
        $('<style>').text(tooltipStyle).appendTo('head');
      }

      // ====== 3. 绑定事件到每个设置项 ======
      $('#sp_checkbox_container input[type=checkbox]').each(function(){
        const id = this.id;
        const desc = spDescriptions[id];
        if (!desc) return;

        const $label = $(this).next('label');
        const $target = $label.length ? $label : $(this);

        $target.on('mouseenter', function(e){
          $('#sp_tooltip').text(desc)
            .css({ top: e.clientY + 12, left: e.clientX + 12 })
            .addClass('show');
        }).on('mousemove', function(e){
          const offsetX = 40; // 横向偏移量
          const offsetY = 0; // 纵向偏移量
          $('#sp_tooltip').css({
            top: e.clientY + offsetY,   // 保持纵向偏移
            left: e.clientX + offsetX   // 横向偏移改大，右移更多
          });

        }).on('mouseleave', function(){
          $('#sp_tooltip').removeClass('show');
        });
      });
      // 给额外的标题绑定提示
      $('#sp_replyQuicklyOnBoardPage').each(function(){
        const id = this.id;
        const desc = spDescriptions[id];
        if (!desc) return;
        $(this).on('mouseenter', function(e){
          $('#sp_tooltip').text(desc)
            .css({ top: e.clientY + 12, left: e.clientX + 12 })
            .addClass('show');
        }).on('mousemove', function(e){
          $('#sp_tooltip').css({ top: e.clientY, left: e.clientX + 40 });
        }).on('mouseleave', function(){
          $('#sp_tooltip').removeClass('show');
        });
      });

    },

    syncInputs() {
      // 勾选框
      [
        'enableCookieSwitch',
        'duplicatePagination',
        'disableWatermark',
        'enablePaginationDuplication',
        'updatePreviewCookie',
        'hideEmptyTitleEmail',
        'enableExternalImagePreview',
        'enableAutoCookieRefresh',
        'enableAutoCookieRefreshToast',
        'interceptReplyFormUnvcode',
        'interceptReplyFormU200B',
        'enableSeamlessPaging',
        'enableAutoSeamlessPaging',
        'enableHDImageAndLayoutFix',
        'enableLinkBlank',
        'enableQuotePreview',
        'extendQuote',
        'enablePostExpandAll',
        'toggleSidebar'
      ].forEach(k=> $('#sp_'+k).prop('checked', this.state[k]));

      // 标记分组
      const groupsM = this.state.markedGroups.length ? this.state.markedGroups : [{desc:'',cookies:[]}];
      const $m = $('#marked-inputs-container').empty();
      groupsM.forEach(g=>{
        const v = g.desc ? `${g.desc}:${g.cookies.join(',')}` : g.cookies.join(',');
        $m.append(
          `<input class="marked-input" style="width:100%;padding:5px;"
                  placeholder="说明:饼干1,饼干2">`
        ).find('input').last().val(v);
      });

      // 屏蔽分组
      const groupsB = this.state.blockedCookies.length ? this.state.blockedCookies : [{desc:'',cookies:[]}];
      const $b = $('#blocked-inputs-container').empty();
      groupsB.forEach(g=>{
        const v = g.desc ? `${g.desc}:${g.cookies.join(',')}` : g.cookies.join(',');
        $b.append(
          `<input class="blocked-input" style="width:100%;padding:5px;"
                  placeholder="备注:3-7位饼干ID,多个用逗号隔开">`
        ).find('input').last().val(v);
      });

      // 屏蔽关键词
      $('#sp_blockedKeywords').val(this.state.blockedKeywords);

      $('#sp_replyModeDefault').val(this.state.replyModeDefault);
      $('#sp_replyExtraDefault').val(this.state.replyExtraDefault);


      // 初始折叠与按钮隐藏
      $('.sp_fold_body').hide();
      $('#btn_group_marked,#btn_sp_marked,#btn_group_blocked,#btn_sp_blocked').addClass('xdex-inv');

      $('#sp_replyModeDefault').val(this.state.replyModeDefault);
      $('#sp_replyExtraDefault').val(this.state.replyExtraDefault);

    }
  };

  /* --------------------------------------------------
   * tag 2. 回复编号
   * -------------------------------------------------- */
  // 数字样式：包裹为『n』
  const circledNumber = n => `『${n}』`;

  function updateReplyNumbers() {
    // 遍历每一个页面的回复区（含无缝加载的）
    $('.h-threads-item-replies').each(function () {
      let effectiveCount = 0;

      $(this).find('.h-threads-item-reply-icon').each(function () {
        const $reply = $(this).closest('[data-threads-id]');

        if ($reply.attr('data-threads-id') === '9999999') {
          // 特殊：小提示串号 -> 编号 0
          $(this).text(circledNumber(0));
        } else {
          // 普通回复 -> 依次递增
          effectiveCount++;
          $(this).text(circledNumber(effectiveCount));
        }
      });
    });
  }

  /* --------------------------------------------------
   * tag 3. 饼干标记 / 屏蔽 逻辑
   * -------------------------------------------------- */
  // 标记：支持同一饼干命中多个分组时，title 展示多行备注，颜色取首匹配组
  function markAllCookies(groups) {
    $('span.h-threads-info-uid').each(function(){
      const $el = $(this);
      const cid = ($el.text().split(':')[1]||'').trim();
      
      // 收集所有匹配的分组索引和备注
      let firstMatchIdx = -1;
      const hits = [];
      
      for (let i=0; i<groups.length; i++){
        const g = groups[i];
        if (g.cookies.some(p=>Utils.cookieMatch(cid,p))) {
          if (firstMatchIdx === -1) firstMatchIdx = i; // 记录第一个匹配的分组索引
          if (g.desc) hits.push(g.desc); // 只有有备注时才加入 hits
        }
      }
      
      // 如果没有匹配到任何分组，跳过
      if (firstMatchIdx === -1) return;
      
      // 根据第一个匹配的分组索引选择颜色
      const color = markColors[firstMatchIdx % markColors.length];
      $el.css({ background: color, padding:'0 3px', borderRadius:'2px' });
      
      // 只有当有备注时才设置 title
      if (hits.length > 0) {
        $el.attr('title', hits.join('\n'));
      } else {
        $el.removeAttr('title'); // 没有备注时移除 title 属性
      }
    });
  }

  function applyFilters(cfg) {
    // 标记
    markAllCookies(cfg.markedGroups||[]);

    // 屏蔽（按组，匹配到则折叠，文案含备注）
    const blkG = (cfg.blockedCookies||[]);
    const blkK = Utils.strToList(cfg.blockedKeywords);
    const check = $el => {
      const cid = ($el.find('.h-threads-info-uid').first().text().split(':')[1]||'').trim();
      const txt = $el.find('.h-threads-content').first().text();

      if (cid && blkG.length) {
        let matchedCookie = null, matchedDesc = '';
        for (let i=0; i<blkG.length && !matchedCookie; i++){
          const g = blkG[i];
          const hit = g.cookies.find(p=>Utils.cookieMatch(cid,p));
          if (hit) { matchedCookie = hit; matchedDesc = g.desc || ''; }
        }
        if (matchedCookie) {
          const label = matchedDesc ? `${matchedCookie}：${matchedDesc}` : matchedCookie;
          const $ph = Utils.collapse($el, `饼干屏蔽『${label}』`);
          if ($ph && $el.hasClass('h-threads-item-reply-main')) {
            // 只标记“被屏蔽的占位符”
            $ph.addClass('xdex-placeholder-blocked');

            // 仅对这一条回复行启用左右并排（不会影响别处）
            const $row  = $el.closest('.h-threads-item-reply');
            const $icon = $row.find('.h-threads-item-reply-icon').first();
            if ($row.length) {
              $row.css({ display: 'flex', alignItems: 'flex-start' });
            }
            if ($icon.length) {
              $icon.css({ flex: '0 0 3em', textAlign: 'center' }); // 固定左列宽
            }

            // 折叠状态（显示“关键词屏蔽…”）应占满；展开状态（“点击折叠”）应缩成小按钮
            const applyWidth = () => {
              const txt = ($ph.text() || '').trim();
              if (txt === '点击折叠') {
                $ph.css({
                  flex: '0 0 auto',
                  maxWidth: '8em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginRight: '0.5em'
                });
              } else {
                $ph.css({
                  flex: '0 0 auto',
                  maxWidth: 'none',
                  whiteSpace: 'normal',
                  overflow: 'visible',
                  textOverflow: 'clip',
                  marginRight: '0'
                });
              }
            };
            // 初次应用一次
            applyWidth();
            // 点击后（折叠/展开切换文本之后）再应用一次
            $ph.off('click.xdex-blocked').on('click.xdex-blocked', () => {
              setTimeout(applyWidth, 0);
            });
          }
          return;
        }
      }

      const kw = Utils.firstHit(txt, blkK);
      if (kw) {
        const $ph = Utils.collapse($el, `关键词屏蔽『${kw}』`);
        if ($ph && $el.hasClass('h-threads-item-reply-main')) {
          $ph.addClass('xdex-placeholder-blocked');

          const $row  = $el.closest('.h-threads-item-reply');
          const $icon = $row.find('.h-threads-item-reply-icon').first();
          if ($row.length) {
            $row.css({ display: 'flex', alignItems: 'flex-start' });
          }
          if ($icon.length) {
            $icon.css({ flex: '0 0 3em', textAlign: 'center' });
          }

          const applyWidth = () => {
            const txt = ($ph.text() || '').trim();
            if (txt === '点击折叠') {
              $ph.css({
                flex: '0 0 auto',
                maxWidth: '8em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginRight: '0.5em'
              });
            } else {
              $ph.css({
                flex: '1 1 auto',
                maxWidth: 'none',
                whiteSpace: 'normal',
                overflow: 'visible',
                textOverflow: 'clip',
                marginRight: '0'
              });
            }
          };
          applyWidth();
          $ph.off('click.xdex-blocked').on('click.xdex-blocked', () => {
            setTimeout(applyWidth, 0);
          });
        }
      }
    };

    if(/\/t\/\d{8,}/.test(location.pathname)){
      $('.h-threads-item-reply-main').each((_,el)=>check($(el)));
    } else {
      $('.h-threads-item-index').each((_,el)=>{
        const $th=$(el);
        check($th);
        $th.find('.h-threads-item-reply-main').each((_,s)=>check($(s)));
      });
    }
  }

  /* --------------------------------------------------
   * tag 4. 外部图床显示
   * -------------------------------------------------- */
  const ExternalImagePreview = (function(){
    let started = false;
    const PROCESSED_ATTRIBUTE = 'data-images-processed';
    const DEFAULT_VISIBLE = 3;
    const LOAD_BATCH = 3;
    const imageUrlRegex = /(https?:\/\/[^\s'")\]}]+?\.(?:jpg|jpeg|png|gif|bmp|webp|svg)(?:\?[^\s'")\]}]*)?)(?=$|\s|['")\]}.,!?])/gi;

    function buttonCss() {
      return `
        font-size: 12px;
        padding: 4px 10px;
        margin-left: 6px;
        color: #333;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
      `;
    }

    function createImageItem(url, containerWidth) {
      const frag = document.createDocumentFragment();

      const img = document.createElement('img');
      img.src = url;
      img.style.cssText = `
        display: block;
        margin: 8px auto 2px auto;
        border: 1px solid #ccc;
        border-radius: 3px;
        cursor: pointer;
        height: auto;
      `;

      const linkDiv = document.createElement('div');
      linkDiv.style.cssText = `
        font-size: 12px;
        color: #666;
        margin: 0 auto 10px auto;
        word-break: break-all;
        width: fit-content;
        max-width: 100%;
      `;
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.textContent = url;
      a.style.color = '#007bff';
      a.addEventListener('click', (e) => e.stopPropagation());
      linkDiv.appendChild(a);

      img.addEventListener('load', () => {
        const naturalW = img.naturalWidth || 0;
        if (naturalW > containerWidth) {
          img.style.width = Math.round(containerWidth * 0.75) + 'px';
          img.dataset.state = 'large';
        } else {
          img.style.width = naturalW + 'px';
          img.dataset.state = 'small';
        }
      });

      img.addEventListener('error', () => {
        img.style.display = 'none';
        linkDiv.style.display = 'none';
      });

      img.addEventListener('click', (e) => {
        e.stopPropagation();
        const state = img.dataset.state;
        if (state === 'large') {
          window.open(url, '_blank');
        } else if (state === 'small') {
          const naturalW = img.naturalWidth || 0;
          const targetW = Math.round(containerWidth * 0.75);
          if (!img.dataset.enlarged && targetW > naturalW) {
            img.style.width = targetW + 'px';
            img.dataset.enlarged = 'true';
          } else {
            window.open(url, '_blank');
          }
        }
      });

      frag.appendChild(img);
      frag.appendChild(linkDiv);
      return frag;
    }

    function appendImages(bodyEl, urls, containerWidth) {
      const frag = document.createDocumentFragment();
      urls.forEach((url) => frag.appendChild(createImageItem(url, containerWidth)));
      bodyEl.appendChild(frag);
    }

    function setCollapsed(container, collapsed) {
      container.classList.toggle('collapsed', collapsed);
      container.dataset.collapsed = collapsed ? 'true' : 'false';
      container.querySelectorAll('.iic-toggle-btn').forEach((btn) => {
        btn.textContent = collapsed ? '展开' : '收起';
      });
    }

    function injectContainer(afterDiv, imageUrls) {
      const total = imageUrls.length;
      if (total === 0) return;

      const container = document.createElement('div');
      container.className = 'injected-image-container';
      container.style.cssText = `
        margin: 12px 0;
        border: 1px solid #ddd;
        border-radius: 6px;
        background-color: #f9f9f9;
        box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        overflow: hidden;
      `;
      container.dataset.total = String(total);
      container.dataset.collapsed = 'false';

      const header = document.createElement('div');
      header.className = 'iic-header';
      header.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 14px;
        background: #f2f2f2;
        border-bottom: 1px solid #e6e6e6;
        cursor: default;
        user-select: none;
      `;
      const title = document.createElement('span');
      title.className = 'iic-title';
      title.textContent = `图片预览（${total}）`;
      title.style.cssText = `font-size: 13px; color: #333;`;

      const actions = document.createElement('div');
      actions.className = 'iic-actions';

      const moreTopBtn = document.createElement('button');
      moreTopBtn.className = 'iic-more-btn-top';
      moreTopBtn.style.cssText = buttonCss();

      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'iic-toggle-btn';
      toggleBtn.textContent = '收起';
      toggleBtn.style.cssText = buttonCss();
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const next = container.dataset.collapsed !== 'true';
        setCollapsed(container, next);
      });

      actions.appendChild(moreTopBtn);
      actions.appendChild(toggleBtn);
      header.appendChild(title);
      header.appendChild(actions);

      const body = document.createElement('div');
      body.className = 'iic-body';
      body.style.cssText = `
        padding: 12px 24px 10px 24px;
        overflow-x: auto;
      `;

      const footer = document.createElement('div');
      footer.className = 'iic-footer';
      footer.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px 12px 12px 12px;
        background: #f9f9f9;
        border-top: 1px solid #eee;
      `;
      const moreBottomBtn = document.createElement('button');
      moreBottomBtn.className = 'iic-more-btn-bottom';
      moreBottomBtn.style.cssText = buttonCss();
      footer.appendChild(moreBottomBtn);

      const style = document.createElement('style');
      style.textContent = `
        .injected-image-container.collapsed .iic-body,
        .injected-image-container.collapsed .iic-footer { display: none; }
      `;

      container.appendChild(style);
      container.appendChild(header);
      container.appendChild(body);
      container.appendChild(footer);
      afterDiv.parentNode.insertBefore(container, afterDiv.nextSibling);

      const containerWidth = body.clientWidth || 600;

      const visibleUrls = imageUrls.slice(0, DEFAULT_VISIBLE);
      const queue = imageUrls.slice(DEFAULT_VISIBLE);

      appendImages(body, visibleUrls, containerWidth);

      function remainingCount() { return queue.length; }
      function updateMoreButtons() {
        const rem = remainingCount();
        const label = rem > 0 ? `展开更多（剩余${rem}，+${LOAD_BATCH}）` : '已全部展开';
        moreTopBtn.textContent = label;
        moreBottomBtn.textContent = label;
        const display = rem > 0 ? '' : 'none';
        moreTopBtn.style.display = display;
        moreBottomBtn.style.display = display;
      }
      function loadMore(e) {
        e.stopPropagation();
        if (queue.length === 0) return;
        const batch = queue.splice(0, LOAD_BATCH);
        appendImages(body, batch, containerWidth);
        updateMoreButtons();
      }
      moreTopBtn.addEventListener('click', loadMore);
      moreBottomBtn.addEventListener('click', loadMore);
      updateMoreButtons();

      container.addEventListener('click', (e) => {
        const target = e.target;
        if (target.closest('img, button, a, input, label, textarea, select')) return;
        if (container.dataset.collapsed !== 'true') setCollapsed(container, true);
      });
    }

    function processDiv(div) {
      if (div.hasAttribute(PROCESSED_ATTRIBUTE)) return;

      // 如果是预览框且已经有图片，则直接标记为已处理并跳过
      if (div.classList.contains('h-preview-box') && div.querySelector('img')) {
        div.setAttribute(PROCESSED_ATTRIBUTE, 'true');
        return;
      }

      div.setAttribute(PROCESSED_ATTRIBUTE, 'true');

      const textContent = div.textContent || div.innerText || '';
      const matches = textContent.match(imageUrlRegex);
      if (!matches || matches.length === 0) return;

      const uniqueImageUrls = [...new Set(matches.map((u) => u.trim()))];
      if (uniqueImageUrls.length === 0) return;

      injectContainer(div, uniqueImageUrls);
    }


    function findAndProcessDivs() {
      const divs = document.querySelectorAll(
        'div.h-threads-content:not([' + PROCESSED_ATTRIBUTE + ']), ' +
        'div.h-preview-box:not([' + PROCESSED_ATTRIBUTE + '])'
      );
      divs.forEach(processDiv);
    }

    function observeChanges() {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType !== 1) return;
              if (node.classList && node.classList.contains('injected-image-container')) return;

              if (
                node.classList &&
                (node.classList.contains('h-threads-content') || node.classList.contains('h-preview-box')) &&
                !node.hasAttribute(PROCESSED_ATTRIBUTE)
              ) {
                processDiv(node);
              }

              const childDivs = node.querySelectorAll && node.querySelectorAll(
                'div.h-threads-content:not([' + PROCESSED_ATTRIBUTE + ']), ' +
                'div.h-preview-box:not([' + PROCESSED_ATTRIBUTE + '])'
              );

              if (childDivs && childDivs.length > 0) {
                childDivs.forEach(processDiv);
              }
            });
          }
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    function init() {
      if (started) return;
      started = true;
      setTimeout(findAndProcessDivs, 100);
      observeChanges();
      window.addEventListener('load', () => setTimeout(findAndProcessDivs, 500));
      // 调试辅助
      window.resetImageScript = function resetProcessedElements() {
        document.querySelectorAll('[' + PROCESSED_ATTRIBUTE + ']').forEach((el) => el.removeAttribute(PROCESSED_ATTRIBUTE));
        document.querySelectorAll('.injected-image-container').forEach((c) => c.remove());
      };
    }

    return { init };
  })();

  /* --------------------------------------------------
   * tag 5. 手动切换饼干 + 自动刷新饼干
   * -------------------------------------------------- */
  const abbreviateName = n => n.replace(/\s*-\s*\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/, '');
  const getCookiesList   = () => GM_getValue('cookies', {});
  const getCurrentCookie = () => GM_getValue('now-cookie', null);

  function removeDateString(){
    $('#cookie-switcher-ui').find('*').addBack().contents()
      .filter(function(){ return this.nodeType===3; })
      .each(function(){
        this.nodeValue = this.nodeValue.replace(/ - 0000-00-00 00:00:00/g,'');
      });
  }
  function updateCurrentCookieDisplay(cur){
    const $d = $('#current-cookie-display');
    if(!$d.length) return;
    if(cur){
      const nm = abbreviateName(cur.name);
      $d.text(nm + (cur.desc ? ' - ' + cur.desc : '')).css('color','#000');
    } else {
      $d.text('已删除').css('color','red');
      //showLoginPrompt(); // 这里触发
    }
    removeDateString();
  }


  function updateDropdownUI(list){
    const $dd = $('#cookie-dropdown'); $dd.empty();
    Object.keys(list).forEach(id=>{
      const c=list[id];
      const txt=abbreviateName(c.name)+(c.desc?' - '+c.desc:'');
      $dd.append(`<option value="${id}">${txt}</option>`);
    });
    const cur = getCurrentCookie();
    cur && list[cur.id] ? $dd.val(cur.id) : $dd.val('');
    removeDateString();
  }
  function switch_cookie(cookie){
    if(!cookie || !cookie.id) return toast('无效的饼干信息！');
    $.get(`https://www.nmbxd1.com/Member/User/Cookie/switchTo/id/${cookie.id}.html`)
      .done(()=>{
        toast('切换成功! 当前饼干为 '+abbreviateName(cookie.name));
        GM_setValue('now-cookie',cookie);
        updateCurrentCookieDisplay(cookie);
        updateDropdownUI(getCookiesList());
        removeDateString();
        updatePreviewCookieId();

        // 切换成功后，将焦点移回到 textarea
        const textarea = document.querySelector('textarea.h-post-form-textarea');
        if (textarea) {
          setTimeout(() => {
            textarea.focus();
          }, 100); // 延迟100ms确保UI更新完成
        }
      })
      .fail(()=>toast('切换失败，请重试'));
  }
  function refreshCookies(cb, showToast = true){
    GM_xmlhttpRequest({
      method:'GET',
      url:'https://www.nmbxd1.com/Member/User/Cookie/index.html',
      onload:r=>{
        if(r.status!==200){ toast('刷新失败 HTTP '+r.status); return cb&&cb(); }
        const doc=new DOMParser().parseFromString(r.responseText,'text/html');
        const rows=doc.querySelectorAll('tbody>tr'), list={};
        rows.forEach(row=>{
          const tds=row.querySelectorAll('td');
          if(tds.length>=4){
            const id=tds[1].textContent.trim();
            const name=(tds[2].querySelector('a')||{}).textContent?.trim?.() || (tds[2].textContent||'').trim();
            const desc=tds[3].textContent.trim();
            list[id]={id,name,desc};
          }
        });
        GM_setValue('cookies',list);
        updateDropdownUI(list);
        if (showToast) {
          toast('饼干列表已刷新！');
        }
        let cur=getCurrentCookie();
        if(cur && !list[cur.id]) cur=null;
        GM_setValue('now-cookie',cur);
        updateCurrentCookieDisplay(cur);
        removeDateString();
        updatePreviewCookieId();

        // === 新增：检测是否无饼干，触发登录提示 ===
        const $display = $('#current-cookie-display');
        const $dropdown = $('#cookie-dropdown');
        if (
          !$dropdown.children().length ||
          ($display.length && $display.text().trim() === '已删除')
        ) {
          //showLoginPrompt();
        }

        cb&&cb();

      },
      onerror:()=>{
        toast('刷新失败，网络错误'); cb&&cb();
      }
    });
  }

  //TODO : 弹出登录提示弹窗未修复
  function showLoginPrompt(force = false){
    const url = window.location.href;
    const allowed = (
      url.startsWith("https://www.nmbxd1.com/t/") ||
      url.startsWith("https://www.nmbxd1.com/f/") ||
      url.startsWith("https://www.nmbxd1.com/Forum/timeline/")
    );
    if (!allowed) return; // 不在指定页面 → 直接退出

    if (!force && window.__loginPromptShown) return; // 自动触发只弹一次
    window.__loginPromptShown = true;

    const $m = $(`
      <div id="login-modal-wrapper" style="position:fixed;inset:0;z-index:10000;display:flex;align-items:flex-start;justify-content:center;">
        <!-- 遮罩层 -->
        <div class="login-backdrop" style="position:absolute;inset:0;background:rgba(0,0,0,.45);"></div>
        <!-- 弹窗内容 -->
        <div class="login-dialog" style="position:relative;top:30%;width:400px;background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,.3);z-index:10001;">
          <h2>提示</h2>
          <p>当前已退出登录，无法切换饼干。</p>
          <p>请注意：此时仍可作为最后一次应用的饼干回复。</p>
          <div style="text-align:right;">
            <button id="login-open" style="margin-right:10px;">登录</button>
            <button id="login-close">关闭</button>
          </div>
        </div>
      </div>
    `);


    $('body').append($m);

    $('#login-open').on('click', () => {
      window.open('https://www.nmbxd1.com/Member/User/Index/login.html', '_blank');
      $m.fadeOut(200, () => $m.remove());
    });

    $('#login-close').on('click', () => {
      $m.fadeOut(200, () => $m.remove());
    });

    $m.on('click', (e) => {
      if (e.target.id === 'login-modal') {
        $m.fadeOut(200, () => $m.remove());
      }
    });
  }


  function createCookieSwitcherUI(){
    const $title = $('.h-post-form-title:contains("回应模式")').first();
    let $grid = $title.closest('.uk-grid.uk-grid-small.h-post-form-grid');
    if(!$grid.length)
      $grid = $('.h-post-form-title:contains("名 称")').first()
        .closest('.uk-grid.uk-grid-small.h-post-form-grid');
    if(!$grid.length) return;

    const cur = getCurrentCookie(), list = getCookiesList();

    const $ui = $(`
      <div class="uk-grid uk-grid-small h-post-form-grid" id="cookie-switcher-ui" style="display: flex; flex-wrap: nowrap; align-items: center; width: 100%;">
        <div class="uk-width-1-5">
          <div class="h-post-form-title">饼干</div>
        </div>
        <div class="uk-width-4-5 h-post-form-input" style="display:flex;align-items:center;gap:8px;flex-wrap:nowrap;">
          <div style="flex:1 1 auto;display:flex;align-items:center;gap:6px;min-width:3ch;">
            <span id="current-cookie-display" style="max-width:40%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></span>
            <select id="cookie-dropdown" style="flex:1 1 auto;min-width:3ch;max-width:100%;"></select>
          </div>
          <button id="apply-cookie" class="uk-button uk-button-default" style="display:none;">应用</button>
          <div style="margin-left:auto;flex:0 0 auto;display:flex;align-items:center;">
            <button id="refresh-cookie" class="uk-button uk-button-default" style="min-width:1em;text-align:center;">刷新</button>
          </div>
        </div>
      </div>`);

    $grid.before($ui);

    updateCurrentCookieDisplay(cur);
    updateDropdownUI(list);

    // === 新增：检测是否无饼干，立即弹出登录提示 ===
    const $display = $('#current-cookie-display');
    const $dropdown = $('#cookie-dropdown');
    if (
      !$dropdown.children().length ||
      ($display.length && $display.text().trim() === '已删除')
    ) {
      //showLoginPrompt();
    }


    // 单击下拉项即切换饼干
    $('#cookie-dropdown').on('change', function(){
      const sel = $(this).val();
      const l = getCookiesList();
      if(!Object.keys(l).length) return //showLoginPrompt();
      if(!sel) return toast('请选择饼干');
      l[sel] ? switch_cookie(l[sel]) : toast('饼干信息无效');
    });

    // 刷新按钮
    $('#refresh-cookie').on('click', e=>{
      e.preventDefault();
      const $display = $('#current-cookie-display');
      const $dropdown = $('#cookie-dropdown');

      if (
        !$dropdown.children().length ||
        ($display.length && $display.text().trim() === '已删除')
      ) {
        //showLoginPrompt(true); // 👈 强制弹出
        return;
      }

      refreshCookies(null, true);
    });

  }

  /* --------------------------------------------------
   * tag 6. 页面增强：页首页码 / 关闭水印 / 预览区真实饼干 / 隐藏无标题+无名氏+版规
   * -------------------------------------------------- */
  function duplicatePagination(){

    // 获取所有分页栏，而不是只获取一个
    const pags = document.querySelectorAll('ul.uk-pagination.uk-pagination-left.h-pagination');
    if(!pags.length) return;
  
    pags.forEach(pag => {
      const tit = document.querySelector('h2.h-title');
      if(!tit || !pag) return;
  
      // 克隆分页栏并插入标题后
      const clone = pag.cloneNode(true);
      tit.parentNode.insertBefore(clone, tit.nextSibling);
  
      // 对克隆分页栏执行末页补全
      processPagination(clone);
    });
  
    // 监听 DOM 变化，自动处理后续新增的分页栏
    const observer = new MutationObserver(mutations => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if(node.nodeType === 1){
            // 判断是否是分页栏
            if(node.matches && node.matches('ul.uk-pagination.uk-pagination-left.h-pagination')){
              processPagination(node);
            }
            // 判断是否包含分页栏
            const innerPags = node.querySelectorAll?.('ul.uk-pagination.uk-pagination-left.h-pagination');
            innerPags?.forEach(p => processPagination(p));
          }
        });
      });
    });
  
    observer.observe(document.body, { childList: true, subtree: true });
  }
  // 专门处理“末页”按钮的函数
  function processPagination(pag){
    pag.querySelectorAll('a').forEach(a => {
      if(a.textContent.trim().startsWith('末页')){
  
        // 如果已经有页码则跳过
        if(/\(\d+\)$/.test(a.textContent.trim())) return;
  
        // 第一种格式：?page=13
        let m = a.href.match(/page=(\d+)/);
  
        // 第二种格式：/page/6.html
        if(!m){
          m = a.href.match(/\/page\/(\d+)\.html/);
        }
  
        if(m){
          a.textContent = `末页(${m[1]})`;
        }
      }
    });
  }
  
  const disableWatermark = () => {
    const c = document.querySelector('input[type="checkbox"][name="water"][value="true"]');
    if(c) c.checked = false;
  };
  function updatePreviewCookieId(){
    if(!$('.h-preview-box').length) return;
    const cur=getCurrentCookie();
    const name=cur&&cur.name?abbreviateName(cur.name):'cookies';
    $('.h-preview-box .h-threads-info-uid').text('ID:'+name);
  }
  function hideEmptyTitleAndEmail(){
    $('.h-threads-info-title').each(function(){ if($(this).text().trim()==='无标题') $(this).hide(); });
    $('.h-threads-info-email').each(function(){ if($(this).text().trim()==='无名氏') $(this).hide(); });
  }

  function addLastPageNumber(){
    document.querySelectorAll('ul.uk-pagination.uk-pagination-left.h-pagination a').forEach(a => {
      if (a.textContent.trim() === '末页') {
        const m = a.href.match(/page=(\d+)/);
        if (m && !a.textContent.includes(`(${m[1]})`)) {
          a.textContent = `末页(${m[1]})`;
        }
      }
    });
  }

  // 自动监听 DOM 变化
  function observePagination(){
    const observer = new MutationObserver(mutations => {
      let foundPagination = false;

      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== 1) continue; // 只处理元素节点

          // 如果新增的是分页条本身，或它的子元素
          if (
            node.matches?.('ul.uk-pagination.uk-pagination-left.h-pagination') ||
            node.closest?.('ul.uk-pagination.uk-pagination-left.h-pagination')
          ) {
            foundPagination = true;
            break;
          }
        }
        if (foundPagination) break; // 已找到就不再继续遍历
      }

      if (foundPagination) {
        addLastPageNumber();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // 初始化
  //duplicatePagination();
  observePagination();


  /* --------------------------------------------------
   * tag 7. 自动+手动无缝翻页
   * -------------------------------------------------- */
  // ========== 公共增强函数 ==========
  // root: 新插入或替换的 DOM 节点（例如 repliesClone 或 targetReplies）
  // cfg: 当前配置对象
  function applyPageEnhancements(root, cfg) {
    try { if (typeof hideEmptyTitleAndEmail === 'function') hideEmptyTitleAndEmail($(root)); } catch (e) {}
    try { if (cfg && typeof applyFilters === 'function') applyFilters(cfg, root); } catch (e) {}
    try { if (typeof enablePostExpand === 'function') enablePostExpand(); } catch (e) {}

    setTimeout(() => {
      try { if (typeof hideEmptyTitleAndEmail === 'function') hideEmptyTitleAndEmail($(root)); } catch (e) {}
      try { if (typeof highlightPO === 'function') highlightPO(); } catch (e) {}
      try { if (cfg && cfg.enableHDImageAndLayoutFix && typeof enableHDImageAndLayoutFix === 'function') enableHDImageAndLayoutFix(root); } catch (e) {}
      try { if (cfg && cfg.enableHDImage && typeof enableHDImage === 'function') enableHDImage(root); } catch (e) {}
      enableHDImageAndLayoutFix(document);
      enableHDImage(document);
      try { if (cfg && cfg.enableLinkBlank && typeof runLinkBlank === 'function') runLinkBlank(root); } catch (e) {}
      try { if (cfg && cfg.extendQuote && typeof extendQuote === 'function') extendQuote(root); } catch (e) {}
      try { if (cfg && cfg.enableQuotePreview && typeof enableQuotePreview === 'function') enableQuotePreview(); } catch (e) {}
      try { if (typeof applyFilters === 'function') applyFilters(cfg); } catch (e) {}
      try { if (typeof initContent === 'function') initContent(); } catch (e) {}
      try { if (typeof initExtendedContent === 'function') initExtendedContent(root); } catch (e) {}
      //try { if (typeof autoHideRefView === 'function') autoHideRefView(root); } catch (e) {}
      try { if (typeof enablePostExpand === 'function') enablePostExpand(); } catch (e) {}
      // if (typeof preventContentOverflow === 'function') {
      //   try { preventContentOverflow(document); } catch (e) {}
      // }
    }, 50);
  }

  function initSeamlessPaging() {
    let lastCheckAt = 0;

    // 所有需要被 window.SeamlessPaging 访问的变量都在此声明
    let loading = false;
    let done = false;
    let loadedPages = new Set();
    let reachedLastPageAt = -1;
    let lastFinalToastTs = 0;
    let lastLoadedPage = 1;
    let observer = null;
    let observerFrozen = false;
    let hasUserInteracted = false;
    let lastUserScrollDir = 0;
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;

    try {
      const cfg = Object.assign({}, SettingPanel.defaults, GM_getValue(SettingPanel.key, {}));
      if (!cfg.enableSeamlessPaging) return;

      // let loading = false;
      // let done = false;
      // const loadedPages = new Set();
      // let reachedLastPageAt = -1;     // 记录“最后一页已加载”的页码（例如 20）
      // let lastFinalToastTs = 0;       // 防抖：末页提示的时间戳，避免重复弹

      const isThreadPage = /\/t\/\d{4,}/.test(location.pathname) || /^\/Forum\/po\/id\/\d+/.test(location.pathname);
      const isBoardPage = /^\/f\//.test(location.pathname) || /^\/Forum\/timeline\/id\/\d+/.test(location.pathname);

      const originInfo = (function () {
        const cur = new URL(location.href, location.origin);
        const threadMatch =
          location.pathname.match(/\/t\/(\d{4,})/) ||
          location.pathname.match(/\/Forum\/po\/id\/(\d+)/);
        return {
          origin: location.origin,
          threadId: threadMatch
           ? threadMatch[1] : (document.querySelector('[data-threads-id]')?.getAttribute('data-threads-id') || null),
          page: Number(cur.searchParams.get('page') || (location.pathname.match(/\/page\/(\d+)(?:\.html)?$/)?.[1] || 1))
        };
      })();


      // let lastLoadedPage = originInfo.page || 1;
      lastLoadedPage = originInfo.page || 1;
      loadedPages.add(lastLoadedPage);

      const SENTINEL_ID = 'hld_auto_page_sentinel';
      let sentinel = document.getElementById(SENTINEL_ID);

      // let observer = null;           // 新增：让 observer 可被其他函数控制
      // let observerFrozen = false;    // 新增：哨兵冻结标记（大图激活时用）


      // 交互状态检测
      // let hasUserInteracted = false;
      // let lastUserScrollDir = 0;
      // let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;

      function onUserScroll() {
        hasUserInteracted = true;
        const curTop = window.pageYOffset || document.documentElement.scrollTop || 0;
        lastUserScrollDir = (curTop > lastScrollTop) ? 1 : (curTop < lastScrollTop ? -1 : lastUserScrollDir);
        lastScrollTop = curTop;
        // 新增：若处于冻结状态，满足条件则解冻并恢复观察
        if (observerFrozen && sentinel) {
          const maxDomLast = getDomLastPageNum();
          const atLastPage = !!(maxDomLast && lastLoadedPage >= maxDomLast);
          const nearBottom = (window.scrollY + window.innerHeight) >= (document.documentElement.scrollHeight - 200);

          // 若不再有激活大图，或已接近底部（两者满足任一），恢复观察
          let activeInView = false;
          const activeBox = document.querySelector('.h-threads-img-box.h-active');
          if (activeBox) {
            const r = activeBox.getBoundingClientRect();
            activeInView = (r.bottom > 0 && r.top < window.innerHeight);
          }

          if (!activeInView || (atLastPage && nearBottom)) {
            try { observer.observe(sentinel); } catch (e) {}
            observerFrozen = false;
          }
        }
      }

      function onWheel(e) {
        hasUserInteracted = true;
        if (typeof e.deltaY === 'number') lastUserScrollDir = e.deltaY > 0 ? 1 : -1;
      }
      window.addEventListener('scroll', onUserScroll, { passive: true });
      window.addEventListener('wheel', onWheel, { passive: true });

      // ======== 新增：桥接器 + 自动重执行器 ========
      function reinitForNewContent(container) {
        try {
          // 1. 派发自定义事件
          document.dispatchEvent(new CustomEvent('SeamlessPageAppended', {
            detail: { container }
          }));

          // 2. 模拟 DOMContentLoaded（部分脚本只监听这个）
          document.dispatchEvent(new Event('DOMContentLoaded'));

          // 3. 重新执行 container 内的 <script> 标签
          container.querySelectorAll('script').forEach(oldScript => {
            const newScript = document.createElement('script');
            if (oldScript.src) {
              newScript.src = oldScript.src;
            } else {
              newScript.textContent = oldScript.textContent;
            }
            [...oldScript.attributes].forEach(attr => {
              newScript.setAttribute(attr.name, attr.value);
            });
            oldScript.replaceWith(newScript);
          });
        } catch (err) {
          console.warn('reinitForNewContent error:', err);
        }
      }
      // ============================================

      // 串内页容器
      function getRootRepliesContainer() {
        const root = document.querySelector('.h-threads-item.uk-clearfix[data-threads-id]') ||
                    document.querySelector('.h-threads-item.uk-clearfix') ||
                    document.querySelector('[data-threads-id]');
        if (!root) return null;
        const replies = root.querySelectorAll('.h-threads-item-replies');
        if (!replies || replies.length === 0) return null;
        return { root, lastReplies: replies[replies.length - 1] };
      }

      function ensureSentinelPlaced() {
        const containers = getRootRepliesContainer();
        if (!containers) return;
        const { lastReplies } = containers;
        if (!sentinel) {
          sentinel = document.createElement('div');
          sentinel.id = SENTINEL_ID;
          sentinel.style.height = '1px';
          sentinel.style.width = '100%';
          sentinel.style.pointerEvents = 'none';
        }
        if (lastReplies.nextSibling !== sentinel) {
          lastReplies.parentNode.insertBefore(sentinel, lastReplies.nextSibling);
        }
      }

      // 板块页容器
      function ensureSentinelPlacedBoard() {
        const lists = document.querySelectorAll('.h-threads-list');
        const lastList = lists[lists.length - 1];
        if (!lastList) return;
        if (!sentinel) {
          sentinel = document.createElement('div');
          sentinel.id = SENTINEL_ID;
          sentinel.style.height = '1px';
          sentinel.style.width = '100%';
          sentinel.style.pointerEvents = 'none';
        }
        if (lastList.nextSibling !== sentinel) {
          lastList.parentNode.insertBefore(sentinel, lastList.nextSibling);
        }
      }


      function removeIdsFromNode(node) {
        if (!node || node.querySelectorAll === undefined) return;
        node.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
        if (node.hasAttribute && node.hasAttribute('id')) node.removeAttribute('id');
      }



      function parseLastPageFromPagination(pagUl) {
        if (!pagUl) return null;
        const anchors = Array.from(pagUl.querySelectorAll('a')).map(a => a.href || a.getAttribute('href') || '');
        const pageNums = anchors.map(h => {
          try {
            const u = new URL(h, location.origin);
            const p = Number(u.searchParams.get('page') || '') || null;
            return p;
          } catch (e) {
            const m = (h || '').match(/page=(\d+)/);
            return m ? Number(m[1]) : null;
          }
        }).filter(n => !!n);
        if (pageNums.length === 0) return null;
        return Math.max(...pageNums);
      }

      function getDomLastPageNum() {
        const allPaginations = document.querySelectorAll('ul.uk-pagination.uk-pagination-left.h-pagination');
        if (allPaginations.length === 0) return null;
        const lastPagination = allPaginations[allPaginations.length - 1];
        return parseLastPageFromPagination(lastPagination);
      }

      function buildThreadPageUrl(threadId, pageNum) {
        // 如果当前是 /Forum/po/id/{threadId}/page/N.html 形式
        if (/^\/Forum\/po\/id\/\d+/.test(location.pathname)) {
          return `${location.origin}/Forum/po/id/${threadId}/page/${pageNum}.html`;
        }
        // 默认 /t/{threadId}?page=N
        return `${location.origin}/t/${threadId}?page=${pageNum}`;
      }

      function computeNextUrl() {
        const tid = originInfo.threadId || document.querySelector('[data-threads-id]')?.getAttribute('data-threads-id');
        if (!tid) return null;
        return buildThreadPageUrl(tid, lastLoadedPage + 1);
      }

      // ========== 新增：无缝翻页内部专用的刷新 / 判定工具（放在 loadNext 之前） ==========
      // done 为当前认定的末页添加手动局部刷新按钮，以避免回复数太少，无法滚动触发局部刷新，检测到为末页时一直存在
      // 从 root 中获取第一个非预览的 .h-threads-list （避免误取预览区）
      function getRealThreadsList(root = document) {
        const lists = Array.from((root || document).querySelectorAll('.h-threads-list'));
        return lists.find(el => !el.closest('.h-preview-box')) || null;
      }

      // 获取 DOM 中最大的 data-cloned-page（已被无缝加载进来的最大页）
      function getMaxClonedPageInDOM() {
        let max = 0;
        document.querySelectorAll('.h-threads-item-replies[data-cloned-page]').forEach(el => {
          const n = parseInt(el.getAttribute('data-cloned-page'), 10);
          if (!isNaN(n) && n > max) max = n;
        });
        return max;
      }

      // 刷新目标回复区（主页面回复区 或 data-cloned-page = 最大的克隆页）并检查是否有下一页
      // done(result) 回调会收到 { status: 'last'|'hasNext'|'error', nextPage?: number }
      function refreshRepliesAndCheckNext(done) {
        try {
          const domMaxPage = getDomLastPageNum();
          const maxCloned = getMaxClonedPageInDOM();
          let targetPage = null;
          if ((domMaxPage && maxCloned === domMaxPage && maxCloned > 0) || (!domMaxPage && maxCloned > 0)) {
            targetPage = maxCloned;
          } else if (domMaxPage && lastLoadedPage === domMaxPage && maxCloned === 0) {
            targetPage = null;
          }

          const list = getRealThreadsList(document);
          if (!list) {
            toast("调试：未找到真实的 .h-threads-list");
            return done && done({ status: "error" });
          }

        let targetReplies;
        if (maxCloned > 0) {
          // ✅ 如果已经有克隆界面，永远刷新最大的克隆页
          targetReplies = list.querySelector(`.h-threads-item-replies[data-cloned-page="${maxCloned}"]`);
        } else {
          // ✅ 否则刷新主页面的回复区
          targetReplies = list.querySelector('.h-threads-item-replies:not([data-cloned-page])');
        }

        // 如果没有找到回复区，说明当前串没有回复，需要创建回复区容器
        if (!targetReplies) {
          const threadItem = list.querySelector('.h-threads-item');
          if (threadItem) {
            targetReplies = document.createElement('div');
            targetReplies.className = 'h-threads-item-replies';
            if (maxCloned > 0) {
              targetReplies.setAttribute('data-cloned-page', String(maxCloned));
            }
            threadItem.appendChild(targetReplies);
            console.log('调试：已创建空的回复区容器');
          } else {
            toast("调试：未找到串容器，无法创建回复区");
            return done && done({ status: "error" });
          }
        }

        // 构建请求 URL：优先用 threadId + ?page=N，否则回退到 location.href
        let fetchUrl = location.href;
        try {
          if (typeof originInfo !== 'undefined' && originInfo && originInfo.threadId && targetPage) {
            fetchUrl = buildThreadPageUrl(originInfo.threadId, targetPage);
          } else if (targetPage) {
            const u = new URL(location.href, location.origin);
            u.searchParams.set('page', String(targetPage));
            fetchUrl = u.toString();
          }
        } catch (e) {
          // ignore
        }

        fetch(fetchUrl, { credentials: 'same-origin' })
          .then(res => res.text())
          .then(html => {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const newList = getRealThreadsList(doc);
            if (!newList) {
              toast("调试：抓取页面中未找到 .h-threads-list");
              return done && done({ status: "error" });
            }

        // 新增：替换前记录所有激活图片所在的回复ID，刷新后在 newReplies（离线 DOM）上恢复
        let activeReplyIds = [];
        try {
          targetReplies.querySelectorAll('.h-threads-item-reply .h-threads-img-box.h-active').forEach(box => {
            const replyEl = box.closest('.h-threads-item-reply');
            if (replyEl) {
              const rid = replyEl.getAttribute('data-threads-id');
              if (rid) activeReplyIds.push(rid);
            }
          });
        } catch (e) {}


        // newReplies 已从返回的页面 doc 中得到
        const newReplies = newList.querySelector('.h-threads-item-replies');
        if (!newReplies) {
          toast("调试：抓取页面中未找到 .h-threads-item-replies");
          return done && done({ status: "error" });
        }

        // 在覆盖前，移除系统提示（避免页面跳动）
        try {
          newReplies.querySelectorAll('.h-threads-item-reply[data-threads-id="9999999"]').forEach(n => n.remove());
        } catch (e) {}

        // 在替换前，先对 detached DOM 做预处理，避免闪烁（在脱离 document 的 newReplies 上操作）
        try {
          if (typeof hideEmptyTitleAndEmail === 'function') hideEmptyTitleAndEmail($(newReplies));
          if (typeof applyFilters === 'function') applyFilters(cfg, newReplies); // 尝试以 root-aware 方式处理
        } catch (e) {
          console.warn('预处理过滤失败', e);
        }
        // 暂时取消局部刷新后保留图片h-active状态的设定
        // —— 关键：在 newReplies（脱离 DOM 的节点）上恢复激活状态，避免插入后闪烁 ——
        // if (activeReplyIds.length > 0) {
        //   try {
        //     activeReplyIds.forEach(rid => {
        //       const newBox = newReplies.querySelector(`.h-threads-item-reply[data-threads-id="${rid}"] .h-threads-img-box`);
        //       if (newBox) {
        //         newBox.classList.add('h-active');
        //         const tool = newBox.querySelector('.h-threads-img-tool');
        //         if (tool) tool.style.display = '';
        //       }
        //     });
        //   } catch (e) {
        //     console.warn('restore multiple active images on newReplies failed', e);
        //   }
        // }
        // done 将局部刷新修改为新增而非替换，应该可以避免已active的图片发生变化

        // 替换目标回复区内容（保留容器，替换 innerHTML）—— 原子性替换已有，插入的是已处理好的 newReplies HTML
        // === 改为增量新增：比较新旧回复差异，只添加缺失部分，避免覆盖 h-active ===

        // 1. 收集原先 targetReplies 中已有的回复 ID
        const oldItems = Array.from(targetReplies.querySelectorAll('[data-threads-id]'));
        const oldIdSet = new Set(oldItems.map(i => i.dataset.threadsId));

        // 2. 收集新拉取页面中的回复项
        const newItems = Array.from(newReplies.querySelectorAll('[data-threads-id]'));
        let hasUpdate = false;

        // 3. 逐项比较，把 newReplies 中不存在于 oldReplies 的部分依顺序追加到正确位置
        for (const item of newItems) {
            const tid = item.dataset.threadsId;
            if (!oldIdSet.has(tid)) {
                // 新增回复项，插入到 targetReplies 最后（保持服务器顺序）
                hasUpdate = true;
                targetReplies.appendChild(item.cloneNode(true));
            }
        }
        if (hasUpdate) {
          toast("已更新");
        } else {
          toast("无更新");
        }

        // 同步替换底部分页条（取返回页的最后一个分页）
        const newPags = doc.querySelectorAll('ul.uk-pagination.uk-pagination-left.h-pagination');
        const newPag = newPags.length ? newPags[newPags.length - 1] : null;
        const oldPags = document.querySelectorAll('ul.uk-pagination.uk-pagination-left.h-pagination');
        const oldPag = oldPags.length ? oldPags[oldPags.length - 1] : null;
        if (newPag && oldPag) {
          // 只替换 innerHTML（避免完全替换导致事件/引用丢失），但你也可改为 replaceWith(clone)
          try { oldPag.innerHTML = newPag.innerHTML; } catch (e) { oldPag.replaceWith(newPag.cloneNode(true)); }
        }

        // 让其他模块对新内容生效（使用 initSeamlessPaging 作用域内已有的函数）
        try { if (typeof reinitForNewContent === 'function') reinitForNewContent(targetReplies); } catch (e) {}
        // 复用无缝翻页里常用的增强调用（与 loadNext 中添加内容后使用的一致）
        // 替换后立即执行视觉相关过滤，避免闪烁

        reinitForNewContent(targetReplies);
        applyPageEnhancements(targetReplies, cfg);



        // 统计“用户回复”数量（排除系统回复 No.9999999）
        const allReplies = Array.from(targetReplies.querySelectorAll('.h-threads-item-reply'));
        const userReplies = allReplies.filter(el => el.getAttribute('data-threads-id') !== '9999999');
        const userCount = userReplies.length;

        // 基于返回的分页判断是否出现了“更多页”
        const parsedLastFromReturned = (function() {
          const pag = newPag || doc.querySelector('ul.uk-pagination.uk-pagination-left.h-pagination') || doc.querySelector('ul.uk-pagination');
          return pag ? parseLastPageFromPagination(pag) : null;
        })();

        // 如果用户回复 < 19 => 肯定是最后一页
        if (userCount < 19) {
          if (typeof done === 'function') done({ status: 'last' });
          addRefreshButtonIfNeeded();
          return;
        }

        // 用户回复满 19 条：若解析到的最新页码 > 当前已知 lastLoadedPage，则说明出现下一页
        if (parsedLastFromReturned && parsedLastFromReturned > lastLoadedPage) {
          if (typeof done === 'function') done({ status: 'hasNext', nextPage: lastLoadedPage + 1 });
          return;
        } else {
          if (typeof done === 'function') done({ status: 'last' });
          addRefreshButtonIfNeeded();
          return;
        }
      })
      .catch(err => {
        console.error('refreshRepliesAndCheckNext error:', err);
        toast('刷新回复区失败');
        if (typeof done === 'function') done({ status: 'error' });
      });
        } catch (err) {
          console.error('refreshRepliesAndCheckNext pre error:', err);
          if (typeof done === 'function') done({ status: 'error' });
        }
      }


      function extractFromHTML(htmlText) {
        const doc = new DOMParser().parseFromString(htmlText, 'text/html');
        const repliesAll = doc.querySelectorAll('.h-threads-item-replies');
        const replies = repliesAll.length ? repliesAll[0] : doc.querySelector('.h-threads-item-replies');
        let pagination = doc.querySelector('ul.uk-pagination.uk-pagination-left.h-pagination') ||
                        doc.querySelector('ul.uk-pagination.uk-pagination-left') ||
                        doc.querySelector('ul.uk-pagination');
        return { replies, pagination, doc };
      }

      function addRefreshButtonIfNeeded() {
        // 若按钮已存在则不重复创建
        let btn = document.getElementById('seamless-refresh-btn');
        if (!btn) {
            btn = document.createElement('div');
            btn.id = 'seamless-refresh-btn';
            btn.className = 'qp-reset-btn seamless-refresh-btn';
            btn.textContent = '🗘';
    
            // --- 固定位置样式 ---
            btn.style.position = 'fixed';
            btn.style.right = '12px';
            btn.style.bottom = '60px';
            btn.style.fontSize = '20px';
            btn.style.lineHeight = '1';
            btn.style.color = '#fff';
            btn.style.background = 'rgba(0,0,0,.6)';
            btn.style.padding = '6px 12px';
            btn.style.borderRadius = '6px';
            btn.style.cursor = 'pointer';
            btn.style.zIndex = '9001';
            btn.style.userSelect = 'none';
            btn.style.display = 'none';   // 默认不显示
    
            document.body.appendChild(btn);
    
            // 点击触发“局部刷新 → 若有下一页则无缝翻页”
            btn.addEventListener('click', () => {
                try {
                    toast("正在刷新……",1500);
                    refreshRepliesAndCheckNext(result => {
                        if (result.status === 'hasNext' && result.nextPage) {
                            loadedPages.delete(result.nextPage);
                            loading = false;
                            lastLoadedPage = result.nextPage - 1;
                            lastCheckAt = 0;
                            setTimeout(() => loadNext(), 50);
                        }
                    });
                } catch (e) {
                    console.warn('刷新按钮触发失败:', e);
                }
            });
        }
    
        // --- 始终监听页面最底部的分页栏 ---
        function getBottomPagination() {
            const allPaginations = document.querySelectorAll('ul.uk-pagination');
            return allPaginations.length ? allPaginations[allPaginations.length - 1] : null;
        }
    
        function updateBtnDisplay(pag) {
          if (!pag) {
              btn.style.display = 'none';
              return;
          }
          const hasNext = !!pag.querySelector('li:last-child a');
          if (hasNext) {
              btn.style.display = 'none';
              return;
          }
      
          // 检查浮窗状态
          const overlay = document.querySelector('.qp-overlay');
          const overlayQuote = document.querySelector('.qp-overlay-quote');
          const overlayOpen = (overlay && overlay.style.display === 'block');
          const overlayQuoteOpen = (overlayQuote && overlayQuote.style.display === 'block');
      
          if (overlayOpen || overlayQuoteOpen) {
              btn.style.display = 'none';
          } else {
              btn.style.display = 'block';
          }
      }
      
        function observeOverlays() {
          const overlays = [document.querySelector('.qp-overlay'), document.querySelector('.qp-overlay-quote')];
          overlays.forEach(el => {
              if (!el) return;
              const obs = new MutationObserver(() => {
                  updateBtnDisplay(getBottomPagination());
              });
              obs.observe(el, { attributes: true, attributeFilter: ['style'] });
          });
        }
      
        // 初始绑定
        observeOverlays();
    
        // 建立一个 MutationObserver，始终监听最新的分页栏
        let currentObserver = null;
        function observeBottomPagination() {
            const pag = getBottomPagination();
            if (!pag) return;
    
            // 先更新一次显示状态
            updateBtnDisplay(pag);
    
            // 如果已有旧的 observer，先断开
            if (currentObserver) {
                currentObserver.disconnect();
            }
    
            // 新建 observer 监听底部分页栏的变化
            currentObserver = new MutationObserver(() => {
                updateBtnDisplay(getBottomPagination());
            });
            currentObserver.observe(pag, { childList: true, subtree: true });
        }
    
        // 初始监听一次
        observeBottomPagination();
    
        // 每次 DOM 可能插入新分页栏时，重新绑定监听
        const globalObserver = new MutationObserver(() => {
            observeBottomPagination();
        });
        globalObserver.observe(document.body, { childList: true, subtree: true });
    }
    

      // 串内页加载
      async function loadNext() {
        console.log('[loadNext] 函数被调用');

        const now = Date.now();
        console.log('[loadNext] 检查防抖: now - lastCheckAt =', now - lastCheckAt);
        if (now - lastCheckAt < 1000) {
          console.log('[loadNext] 防抖拦截，返回');
          return;
        }
        lastCheckAt = now;

        console.log('[loadNext] 通过防抖检查');

         const domLast = getDomLastPageNum();
      // if (domLast && lastLoadedPage >= domLast) {
      //   return;
      // }
        // 新增：基于当前页底分页DOM的“新鲜判定”
        function checkPaginationState(lastLoadedPage) {
          const allPaginations = document.querySelectorAll('ul.uk-pagination.uk-pagination-left.h-pagination');
          const bottomPag = allPaginations.length ? allPaginations[allPaginations.length - 1] : null;
          if (!bottomPag) {
            return { status: 'noPagination', stop: false };
          }

          const lis = Array.from(bottomPag.querySelectorAll('li'));
          const numericLis = lis.filter(li => /^\d+$/.test(li.textContent.trim()));
          const hasNextLinkNow = lis.some(li => /下一页|下页|Next|›|»|→/i.test(li.textContent.trim()));

          // 只有一页
          if (numericLis.length <= 1) {
            return { status: 'singlePage', stop: true, message: '仅一页，无需翻页' };
          }

          // 已到末页
          const maxDomLast = getDomLastPageNum();
          if (maxDomLast && lastLoadedPage >= maxDomLast) {
            return { status: 'atLastPage', stop: true, message: '已经是最后一页了' };
          }

          // 没有“下一页”按钮且也没有更大页码
          if (!hasNextLinkNow && maxDomLast && lastLoadedPage + 1 > maxDomLast) {
            return { status: 'noNextLink', stop: true, message: '没有下一页' };
          }

          // 正常情况
          return { status: 'ok', stop: false };
        }


        // 调用新鲜判定
        const state = checkPaginationState(lastLoadedPage);
        if (state.stop) {
          if (state.message) {
            const now2 = Date.now();
            if (now2 - lastFinalToastTs > 3000) {
              toast(state.message);
                toast("正在刷新……",1500);
              lastFinalToastTs = now2;
            }
          }

          // 👉 每次末页判定时，都刷新最新回复区和分页
          refreshRepliesAndCheckNext(result => {
            if (!result || result.status === 'error') {
              return;
            }
            if (result.status === 'hasNext' && result.nextPage) {
              toast(`正在加载第 ${result.nextPage} 页...`);

              // ★ 关键：重置状态，避免 loadNext() 被拦截
              loadedPages.delete(result.nextPage);   // 确保不会误判已加载
              loading = false;                       // 确保不会被 loading 拦截
              lastLoadedPage = result.nextPage - 1;  // 回退一页，让 loadNext() 认为下一页还没加载
              lastCheckAt = 0;  // 重置防抖时间戳，允许立即加载
              setTimeout(() => loadNext(), 50);
            }

            // 如果还是 last，就静默（因为已经 toast 过了）
          });

          return;
        }


        // if (loading) return;
        // const nextPageNum = lastLoadedPage + 1;
        // if (loadedPages.has(nextPageNum)) return;
        console.log('[loadNext] loading =', loading);
        if (loading) {
          console.log('[loadNext] loading 为 true，返回');
          return;
        }

        const nextPageNum = lastLoadedPage + 1;
        console.log('[loadNext] 计算下一页页码: lastLoadedPage =', lastLoadedPage, ', nextPageNum =', nextPageNum);

        console.log('[loadNext] loadedPages 包含的页码:', Array.from(loadedPages));
        if (loadedPages.has(nextPageNum)) {
          console.log('[loadNext] nextPageNum 已在 loadedPages 中，返回');
          return;
        }

        console.log('[loadNext] 准备加载页码:', nextPageNum);
        const nextUrl = computeNextUrl();
        if (!nextUrl) { return; }

        toast(`正在加载第 ${nextPageNum} 页...`);

        loading = true;
        try {
          const res = await fetch(nextUrl, { credentials: 'same-origin' });
          if (!res.ok) {
              toast('刷新失败，网络错误');
              return;
          }
          const html = await res.text();
          const { replies, pagination } = extractFromHTML(html);
          if (!replies) { return; }

          let pagClone = pagination ? pagination.cloneNode(true) : null;
          if (!pagClone) {
            pagClone = document.createElement('ul');
            pagClone.className = 'uk-pagination uk-pagination-left h-pagination';
          }
          pagClone.setAttribute('hld-auto-page', 'ok');
          removeIdsFromNode(pagClone);
          const lastPageNum = parseLastPageFromPagination(pagClone);
          if (lastPageNum) pagClone.setAttribute('data-last-page', String(lastPageNum));
          pagClone.setAttribute('data-cloned-page', String(nextPageNum));

          const repliesClone = replies.cloneNode(true);
          repliesClone.setAttribute('data-cloned-page', String(nextPageNum));
          removeIdsFromNode(repliesClone);

          const containers = getRootRepliesContainer();
          if (!containers) { return; }
          const { lastReplies } = containers;

          lastReplies.insertAdjacentElement('afterend', pagClone);
          pagClone.insertAdjacentElement('afterend', repliesClone);

          // ======== 新增：让其他脚本对新内容生效 ========
          reinitForNewContent(repliesClone);
          applyPageEnhancements(repliesClone, cfg);
          // ============================================

          // 更新底部分页条
          const allPaginations = document.querySelectorAll('ul.uk-pagination.uk-pagination-left.h-pagination');
          if (allPaginations.length > 0) {
            const lastPagination = allPaginations[allPaginations.length - 1];
            if (lastPagination && lastPagination !== pagClone) {
              lastPagination.replaceWith(pagClone.cloneNode(true));
            }
          }

          loadedPages.add(nextPageNum);
          lastLoadedPage = nextPageNum;

          try { history.pushState(null, '', nextUrl); } catch (e) {}



          ensureSentinelPlaced();

          const hasNextLink = (() => {
              const anchorsText = Array.from(pagClone.querySelectorAll('a')).map(a => a.textContent.trim());
              if (anchorsText.some(t => /下一页|下页|Next|next|›|»|→/.test(t))) return true;
              const parsed = parseLastPageFromPagination(pagClone);
              if (parsed && parsed > nextPageNum) return true;
              return false;
            })();

            // 不在这里吐司“已经是最后一页了”，仅记录“末页已加载”的页码
            if (!hasNextLink) {
              reachedLastPageAt = nextPageNum;
            } else {
              // 仍有下一页可能，清除标记
              reachedLastPageAt = -1;
            }

        } catch (e) {
          console.warn('seamless paging loadNext error:', e);
          toast('加载失败，请稍后重试');
          return;
        } finally {
          loading = false;
        }
      }

      async function loadNextBoard() {
        if (loading || done) return;
        const nextPageNum = lastLoadedPage + 1;
        if (loadedPages.has(nextPageNum)) return;

        let nextUrl;
        if (/^\/Forum\/timeline\/id\/\d+/.test(location.pathname)) {
          // 时间线模式
          const base = location.pathname.replace(/\/page\/\d+\.html$/, ''); // 去掉已有的 /page/N.html
          nextUrl = `${location.origin}${base}/page/${nextPageNum}.html`;
        } else {
          // 默认板块模式
          nextUrl = `${location.origin}${location.pathname}?page=${nextPageNum}`;
        }

        loading = true;
        try {
          const res = await fetch(nextUrl, { credentials: 'same-origin' });
          if (!res.ok) { done = true; return; }
          const html = await res.text();
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const list = doc.querySelector('.h-threads-list');
          const pagination = doc.querySelector('ul.uk-pagination.uk-pagination-left.h-pagination');

          // 板块页空页面检查（速报2）
          if (!list) {
            done = true;
            const now = Date.now();
            if (now - lastFinalToastTs > 3000) {
              toast('已经是最后一页了');
              lastFinalToastTs = now;
            }
            return;
          }

          // 检查 list 是否为空（没有子元素或只有空白内容）
          const hasContent = list.children.length > 0 || list.textContent.trim().length > 0;
          if (!hasContent) {
            done = true;
            const now = Date.now();
            if (now - lastFinalToastTs > 3000) {
              toast('已经是最后一页了');
              lastFinalToastTs = now;
            }
            return;
          }

          toast(`正在加载第 ${nextPageNum} 页...`);
          if (!list) { done = true; return; }

          const listClone = list.cloneNode(true);
          removeIdsFromNode(listClone);

          // 找到当前页面最后一个 .h-threads-list
          const lists = document.querySelectorAll('.h-threads-list');
          const lastList = lists[lists.length - 1];
          if (lastList) {
            let pagClone = pagination ? pagination.cloneNode(true) : null;
            if (pagClone) {
              removeIdsFromNode(pagClone);
              lastList.insertAdjacentElement('afterend', pagClone);
              pagClone.insertAdjacentElement('afterend', listClone);

              // ======== 新增：让其他脚本对新内容生效 ========
              reinitForNewContent(listClone);

              applyPageEnhancements(listClone, cfg);

              // ============================================


              // 更新底部分页条
              const allPaginations = document.querySelectorAll('ul.uk-pagination.uk-pagination-left.h-pagination');
              if (allPaginations.length > 0) {
                const lastPagination = allPaginations[allPaginations.length - 1];
                if (lastPagination && lastPagination !== pagClone) {
                  lastPagination.replaceWith(pagClone.cloneNode(true));
                }
              }
            } else {
              lastList.insertAdjacentElement('afterend', listClone);
              // ======== 新增：让其他脚本对新内容生效 ========
              reinitForNewContent(listClone);
              try { if (cfg.enableQuotePreview && typeof enableQuotePreview === 'function') enableQuotePreview(); } catch (e) {}
              if (typeof initContent === 'function') {
                initContent();   // 重新绑定引用悬浮预览
              }
              initExtendedContent(listClone); // 扩展引用
              //autoHideRefView(listClone); // 拓展引用悬浮
              // ============================================

            }
          }

        loadedPages.add(nextPageNum);
        lastLoadedPage = nextPageNum;
        try { history.pushState(null, '', nextUrl); } catch (e) {}

        const hasNextLink = pagination && Array.from(pagination.querySelectorAll('a')).some(a => /下一页|下页|Next|›|»|→/i.test(a.textContent));
        //if (!hasNextLink) done = true;

        } catch (e) {
          console.warn('board paging loadNext error:', e);
        return;
        } finally {
          loading = false;
        }
      }

      // 新增：检查激活大图并按需冻结/解冻观察器（限定在当前串的最后一个 replies 容器）
      function checkActiveImageAndToggleObserver() {
        const container = getRootRepliesContainer();
        const activeBox = container && container.lastReplies
          ? container.lastReplies.querySelector('.h-threads-img-box.h-active')
          : null;
        const hasActive = !!activeBox;

        const maxDomLast = getDomLastPageNum();
        const atLastPage = !!(maxDomLast && lastLoadedPage >= maxDomLast);
        const nearBottom = (window.scrollY + window.innerHeight) >= (document.documentElement.scrollHeight - 200);

        let activeInView = false;
        if (activeBox) {
          const r = activeBox.getBoundingClientRect();
          activeInView = (r.bottom > 0 && r.top < window.innerHeight);
        }

        // 末页 + 激活在视口内 + 未接近底部 → 冻结（disconnect）
        if (atLastPage && activeInView && !nearBottom) {
          try { observer && observer.disconnect(); } catch (e) {}
          observerFrozen = true;
          return;
        }

        // 其他情况 → 恢复观察（如果之前被冻结）
        if (observerFrozen && sentinel && observer) {
          try { observer.observe(sentinel); } catch (e) {}
          observerFrozen = false;
        }
      }


      // 新增：绑定点击检查（覆盖查看大图/收起等交互）
      document.addEventListener('click', (e) => {
        const t = e.target;
        if (t.closest('.h-threads-img-tool-btn') || t.closest('.h-threads-img-a')) {
          setTimeout(checkActiveImageAndToggleObserver, 0);
        }
      });

      function initObserver() {
        ensureSentinelPlaced();
        if (!sentinel) return;

        // 使用外层 observer 变量（替换原来的 “let observer = ...”）
        observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            // 新增：若冻结，直接忽略（被大图激活时冻结）
            if (observerFrozen) return;

            // 新增：末页 + 虚拟缓冲区 + 大图激活逻辑
            const maxDomLast = getDomLastPageNum();
            const atLastPage = !!(maxDomLast && lastLoadedPage >= maxDomLast);
            const nearBottom = (window.scrollY + window.innerHeight) >= (document.documentElement.scrollHeight - 200);

            // 检测是否有激活大图且在视口中（限定在当前串的最后 replies）
            let activeInView = false;
            const container = getRootRepliesContainer();
            const activeBox = container && container.lastReplies
              ? container.lastReplies.querySelector('.h-threads-img-box.h-active')
              : null;
            if (activeBox) {
              const r = activeBox.getBoundingClientRect();
              activeInView = (r.bottom > 0 && r.top < window.innerHeight);
            }


            // 在末页时：如果激活大图且未接近底部 → 冻结观察器避免误触发
            if (atLastPage && activeInView && !nearBottom) {
              try { observer.disconnect(); } catch (e) {}
              observerFrozen = true;
              return;
            }

            // 在末页时：开启“虚拟缓冲区”，只有 nearBottom 才允许触发（解决大图未激活也提前触发的问题）
            if (atLastPage && !nearBottom) {
              return;
            }

            // 原有的触发判定保留
            if (entry.isIntersecting && !loading) {
              if (hasUserInteracted && lastUserScrollDir > 0) {
                loadNext();
              }
            }
          });
        }, { root: null, rootMargin: '0px', threshold: 0.05 });

        observer.observe(sentinel);
      }


      function initManualButton() {
        const btn = document.createElement('div');
        btn.className = 'xdex-placeholder';
        btn.textContent = '加载下一页';
        btn.style.cssText = `
          padding: 6px 10px;
          background: rgb(250, 250, 250);
          color: rgb(136, 136, 136);
          border: 1px dashed rgb(187, 187, 187);
          margin: 10px auto;
          cursor: pointer;
          width: 100%;
          box-sizing: border-box;
          text-align: center;
        `;
        btn.addEventListener('click', () => {
          // 允许点击时触发 loadNext，由 loadNext 负责末页提示（避免寂默返回）
          loadNext();
        });


        ensureSentinelPlaced();
        if (sentinel && sentinel.parentNode) {
          sentinel.parentNode.insertBefore(btn, sentinel);
        }
      }

      function initObserverBoard() {
        ensureSentinelPlacedBoard();
        if (!sentinel) return;
        let observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !loading && !done) {
              if (hasUserInteracted && lastUserScrollDir > 0) {
                loadNextBoard();
              }
            }
          });
        }, { root: null, rootMargin: '0px', threshold: 0.05 });
        observer.observe(sentinel);
      }

      function initManualButtonBoard() {
        const btn = document.createElement('div');
        btn.className = 'xdex-placeholder';
        btn.textContent = '加载下一页';
        btn.style.cssText = `
          padding: 6px 10px;
          background: rgb(250, 250, 250);
          color: rgb(136, 136, 136);
          border: 1px dashed rgb(187, 187, 187);
          margin: 10px auto;
          cursor: pointer;
          width: 100%;
          box-sizing: border-box;
          text-align: center;
        `;
        btn.addEventListener('click', () => loadNextBoard());
        ensureSentinelPlacedBoard();
        if (sentinel && sentinel.parentNode) {
          sentinel.parentNode.insertBefore(btn, sentinel);
        }
      }

      if (isThreadPage) {
        if (cfg.enableAutoSeamlessPaging) {
          ensureSentinelPlaced();
          initObserver();
        } else {
          initManualButton();
        }
      } else if (isBoardPage) {
        if (cfg.enableAutoSeamlessPaging) {
          ensureSentinelPlacedBoard();
          initObserverBoard();
        } else {
          initManualButtonBoard();
        }
      }

      // 调试：检查 loadNext 是否存在
      console.log('=== 定义 window.SeamlessPaging 前的检查 ===');
      console.log('loadNext 类型:', typeof loadNext);
      console.log('loadNext 函数:', loadNext);

      const loadNextFunc = loadNext;  // ← 先保存引用
      console.log('loadNextFunc 类型:', typeof loadNextFunc);

      // 为拦截中间页发送成功分支提供无缝翻页调用
      window.SeamlessPaging = {
        loadNext: function() {
          console.log('=== window.SeamlessPaging.loadNext 被调用 ===');
          console.log('调用时 loadNext 类型:', typeof loadNext);
          console.log('调用时 loadNextFunc 类型:', typeof loadNextFunc);
          console.log('lastLoadedPage 当前值:', lastLoadedPage);
          console.log('loading 当前值:', loading);
          console.log('loadedPages 内容:', Array.from(loadedPages));

          loadedPages.delete(lastLoadedPage + 1);   // 清除下一页的已加载标记
          console.log('已删除页码:', lastLoadedPage + 1);

          loading = false;                          // 重置加载状态
          console.log('loading 重置为:', loading);

          lastCheckAt = 0;                          // 重置防抖时间戳
          console.log('lastCheckAt 重置为:', lastCheckAt);

          console.log('准备在 50ms 后调用 loadNextFunc');
          setTimeout(() => {
            console.log('=== setTimeout 内部执行 ===');
            console.log('执行前 loadNextFunc 类型:', typeof loadNextFunc);
            try {
              loadNextFunc();
              console.log('loadNextFunc 调用成功');
            } catch (err) {
              console.error('loadNextFunc 调用失败:', err);
            }
          }, 50);
        }
      };

      console.log('=== window.SeamlessPaging 定义完成 ===');
      console.log('window.SeamlessPaging:', window.SeamlessPaging);
      addRefreshButtonIfNeeded();

    } catch (err) {
        console.error('initSeamlessPaging failed', err);
  }

  }

  /* --------------------------------------------------
   * tag 8. 移植‘X岛-揭示板的增强型体验’功能：启用高清图片链接+图片控件+布局调整/串在新标签页打开
   * -------------------------------------------------- */
  /* --------------------------------------------------
  * 合并后的图片处理函数：高清图片 + 防溢出 + 图片控件
  * -------------------------------------------------- */
  // 屏蔽原站点的 initImageBox
  window.initImageBox = function() {
    console.debug("initImageBox 已被屏蔽，由 enableHDImageAndLayoutFix 接管");
  };
  // 新逻辑，启用高清图片链接和布局修正
  function enableHDImageAndLayoutFix(root = document) {
    // ==================== 注入样式（只注入一次）====================
    if (!document.getElementById('prevent-overflow-style')) {
      const style = document.createElement('style');
      style.id = 'prevent-overflow-style';
      style.textContent = `
        .h-threads-content,
        .h-threads-item-reply-main,
        .h-preview-box {
          max-width: 100%;
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
          box-sizing: border-box;
        }

        .h-threads-img-box.h-active {
          max-width: 100%;
          box-sizing: border-box;
          overflow: visible;
        }

        .h-threads-img-box.h-active .h-threads-img-a {
          display: block;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
          transition: width 0.3s ease, height 0.3s ease;
        }

        .h-threads-img-box.h-active .h-threads-img {
          display: block;
          box-sizing: border-box;
          position: relative;
          transform-origin: center center;
          transition: transform 0.2s ease-out,
                      margin 0.2s ease-out;
        }

        .h-threads-content img:not(.h-threads-img),
        .h-preview-box img {
          max-width: 100% !important;
          height: auto !important;
          box-sizing: border-box;
        }

        .h-threads-content pre,
        .h-preview-box pre {
          max-width: 100%;
          overflow-x: auto;
          white-space: pre-wrap;
          word-wrap: break-word;
          box-sizing: border-box;
        }

        .h-threads-content table,
        .h-preview-box table {
          max-width: 100%;
          overflow-x: auto;
          display: block;
          box-sizing: border-box;
        }

        .h-threads-content a,
        .h-preview-box a {
          word-break: break-all;
          overflow-wrap: break-word;
        }
      `;
      document.head.appendChild(style);
    }

    // ==================== 子函数1: 布局计算和溢出处理 ====================
    const handleImageLayout = {

      // ★ 新增：根据场景（板块页/串内页）计算消息容器最大允许宽度
      getMaxMsgWidth(msgMain) {
        // ===== 新增：引用浮窗场景 =====
        const quoteBox = msgMain.closest('.qp-quote');
        if (quoteBox) {
          // 获取引用浮窗的实际宽度
          const quoteWidth = quoteBox.offsetWidth || quoteBox.clientWidth;
          // 减去可能的内边距和边距（根据实际情况调整，这里预留40px）
          return Math.max(0, quoteWidth - 15);
        }
        // 基础浏览器边缘限制
        const viewportLimit = window.innerWidth - 240; // 保留你的全局边距逻辑
        // 串内页默认上限
        const threadPageCap = 1200;

        // 判断是否处于板块页的回复结构（存在 .h-threads-item-index）
        const threadItem = msgMain.closest('.h-threads-item');
        const isBoardPage = threadItem && threadItem.classList.contains('h-threads-item-index');

        if (!isBoardPage) {
          // 串内页：使用原有逻辑（viewport 边缘 + 1200 上限）
          return Math.min(viewportLimit, threadPageCap);
        }

        // 板块页：右侧区域限制
        // 右侧区域宽度 = 整个串容器宽度 - 左侧回复序号图标宽度 - 留边距40
        const iconEl = msgMain.previousElementSibling && msgMain.previousElementSibling.classList.contains('h-threads-item-reply-icon')
          ? msgMain.previousElementSibling
          : null;
        const iconWidth = iconEl ? iconEl.offsetWidth || 0 : 0;

        const threadWidth = threadItem.offsetWidth || viewportLimit;
        const rightRegionWidth = Math.max(0, threadWidth - iconWidth - 40);

        // 不能超过浏览器边缘限制
        return Math.min(rightRegionWidth, viewportLimit);
      },

      // ★ 新增：未激活时也拓展消息容器宽度
      expandMsgWidthIfImageExists(msgMain) {
        const imgBox = msgMain.querySelector('.h-threads-img-box');
        if (!imgBox) return; // 没有图片则跳过
      
        // ☆ 新增：检查是否已经扩展过，如果已扩展则跳过
        if (msgMain.__imageWidthExpanded === true) return;
      
        // 如果图片未激活
        if (!imgBox.classList.contains('h-active')) {
          const currentWidth = msgMain.offsetWidth;
          const maxMsgWidth = this.getMaxMsgWidth(msgMain);
          const targetWidth = Math.min(currentWidth + 80, maxMsgWidth);

          // 保存原始宽度，便于之后恢复
          if (msgMain.__originalWidth === undefined) {
            msgMain.__originalWidth = msgMain.style.width || '';
          }

          msgMain.style.width = targetWidth + 'px';
          // ☆ 新增：标记已经扩展过，防止重复调用时继续加宽
          msgMain.__imageWidthExpanded = true;
        }
      },

      // 预计算图片在所有旋转角度下的尺寸
      precalculateImageSizes(naturalWidth, naturalHeight, maxWidth) {
        console.log('[precalculateImageSizes]', {naturalWidth, naturalHeight, maxWidth}); // 添加这行
        const sizes = {};

        // 0° 和 180°（宽高不变）
        let horizontal = {
          containerWidth: naturalWidth,
          containerHeight: naturalHeight,
          imgWidth: naturalWidth,
          imgHeight: naturalHeight,
          scale: 1
        };

        // 判断当前朝向下，应该按哪个维度适配
        if (naturalWidth > maxWidth) {
          // 宽度超限，按宽度等比缩放
          const scale = maxWidth / naturalWidth;
          horizontal.containerWidth = maxWidth;
          horizontal.containerHeight = Math.floor(naturalHeight * scale);
          horizontal.imgWidth = maxWidth;
          horizontal.imgHeight = Math.floor(naturalHeight * scale);
          horizontal.scale = scale;
        // } else if (naturalHeight > maxWidth && naturalWidth < maxWidth * 0.8) {
        //   // 宽度明显小于最大宽度（小于80%）且高度超限时，才按高度等比缩放
        //   const scale = maxWidth / naturalHeight;
        //   horizontal.containerWidth = Math.floor(naturalWidth * scale);
        //   horizontal.containerHeight = maxWidth;
        //   horizontal.imgWidth = Math.floor(naturalWidth * scale);
        //   horizontal.imgHeight = maxWidth;
        //   horizontal.scale = scale;
        // }
          } else {
            // 宽度未超限，保持原尺寸或适当放大
            // 不做任何处理，使用初始值（原尺寸）
          }
        // 如果宽高都不超限，保持原尺寸（已在初始化时设置）

        sizes[0] = sizes[180] = horizontal;

        // 90° 和 270°（宽高互换）
        let vertical = {
          containerWidth: naturalHeight,   // 容器宽度 = 原图高度
          containerHeight: naturalWidth,   // 容器高度 = 原图宽度
          imgWidth: naturalWidth,
          imgHeight: naturalHeight,
          scale: 1
        };

        // 旋转后，容器的宽度实际是原图的高度
        if (naturalHeight > maxWidth) {
          // 旋转后宽度（原图高度）超限，按原图高度等比缩放
          const scale = maxWidth / naturalHeight;
          vertical.containerWidth = maxWidth;
          vertical.containerHeight = Math.floor(naturalWidth * scale);
          vertical.imgWidth = Math.floor(naturalWidth * scale);
          vertical.imgHeight = maxWidth;
          vertical.scale = scale;
        } else if (naturalWidth > maxWidth) {
          // 旋转后宽度未超限但高度（原图宽度）超限，按原图宽度等比缩放
          const scale = maxWidth / naturalWidth;
          vertical.containerWidth = Math.floor(naturalHeight * scale);
          vertical.containerHeight = maxWidth;
          vertical.imgWidth = maxWidth;
          vertical.imgHeight = Math.floor(naturalHeight * scale);
          vertical.scale = scale;
        }
        // 如果宽高都不超限，保持原尺寸（已在初始化时设置）

        sizes[90] = sizes[270] = vertical;

        return sizes;
      },

      // 应用预计算的尺寸
      applyImageSize(imgBox, rotateIndex) {
        const imgA = imgBox.querySelector('.h-threads-img-a');
        const img = imgBox.querySelector('.h-threads-img');

        if (!imgA || !img || !imgBox.__sizeCache) return;

        // 强制重置图片定位为 relative，确保在容器内正确定位
        img.style.position = 'relative';
        img.style.top = 'auto';
        img.style.left = 'auto';

        // 根据 rotateIndex 确定旋转角度
        // const rotation = (rotateIndex * 90) % 360;
        // 不取模，保持角度单调累加
        const rotation = rotateIndex * 90;

        // 用于查找尺寸缓存的归一化角度
        const normalized = ((rotation % 360) + 360) % 360;
        let targetRotation;
        if (normalized === 0) targetRotation = 0;
        else if (normalized === 90) targetRotation = 90;
        else if (normalized === 180) targetRotation = 180;
        else if (normalized === 270) targetRotation = 270;
        else targetRotation = 0;


        // 归一化到 0, 90, 180, 270
        // let targetRotation;
        // if (rotation === 0) {
        //   targetRotation = 0;
        // } else if (rotation === 90) {
        //   targetRotation = 90;
        // } else if (rotation === 180) {
        //   targetRotation = 180;
        // } else if (rotation === 270) {
        //   targetRotation = 270;
        // } else {
        //   targetRotation = 0;
        // }

        const size = imgBox.__sizeCache[targetRotation];
        if (!size) return;

        const isRotated90or270 = (targetRotation === 90 || targetRotation === 270);

        // 设置容器尺寸（容器不旋转，只改变宽高）
        imgA.style.width = size.containerWidth + 'px';
        imgA.style.height = size.containerHeight + 'px';
        imgA.style.maxWidth = imgBox.__maxWidth + 'px';

        // 设置图片尺寸
        img.style.width = size.imgWidth + 'px';
        img.style.height = size.imgHeight + 'px';
        img.style.maxWidth = 'none';
        img.style.maxHeight = 'none';



        // 图片只需要旋转，不需要translate偏移（因为容器已经是正确尺寸）
        img.style.transform = `rotate(${rotation}deg) scale(1.02)`;
        setTimeout(() => {
          img.style.transform = `rotate(${rotation}deg) scale(1)`;
        }, 50);


        // 使用margin居中图片
        if (isRotated90or270) {
          const marginTop = (size.containerHeight - size.imgHeight) / 2;
          const marginLeft = (size.containerWidth - size.imgWidth) / 2;
          img.style.marginTop = marginTop + 'px';
          img.style.marginLeft = marginLeft + 'px';
        } else {
          img.style.marginTop = '0px';
          img.style.marginLeft = '0px';
        }
        // 使用margin居中图片
        // if (isRotated90or270) {
        //   const marginTop = (size.containerHeight - size.imgHeight) / 2;
        //   let marginLeft = (size.containerWidth - size.imgWidth) / 2;

        //   // ★ 修正：避免负 margin 导致图片超出容器
        //   if (marginLeft < 0) marginLeft = 0;

        //   img.style.marginTop = marginTop + 'px';
        //   img.style.marginLeft = marginLeft + 'px';
        // } else {
        //   img.style.marginTop = '0px';
        //   img.style.marginLeft = '0px';
        // }
        // 设置容器和图片尺寸保持一致
        // if (isRotated90or270) {
        //   // 旋转 90°/270° 时，容器宽高直接跟随图片
        //   imgA.style.width = size.imgWidth + 'px';
        //   imgA.style.height = size.imgHeight + 'px';
        // } else {
        //   // 0°/180° 时，容器用正常计算值
        //   imgA.style.width = size.containerWidth + 'px';
        //   imgA.style.height = size.containerHeight + 'px';
        // }
        // imgA.style.maxWidth = imgBox.__maxWidth + 'px';

        // // 设置图片尺寸
        // img.style.width = size.imgWidth + 'px';
        // img.style.height = size.imgHeight + 'px';
        // img.style.maxWidth = 'none';
        // img.style.maxHeight = 'none';

        console.log('[applyImageSize]', {
          rotation,
          targetRotation,
          containerSize: `${size.containerWidth}x${size.containerHeight}`,
          imgSize: `${size.imgWidth}x${size.imgHeight}`,
          transform: img.style.transform
        });
      },

      // 处理激活状态的图片盒子
      handleActiveImageBox(imgBox, forceRecalculate = false) {
        // ===== 新增：预览框内的图片不做布局处理 =====
        if (imgBox.closest('.h-preview-box')) return;
        console.trace('[handleActiveImageBox 调用]', '图片:', imgBox.querySelector('img')?.src);

        const imgA = imgBox.querySelector('.h-threads-img-a');
        const img = imgBox.querySelector('.h-threads-img');

        if (!imgA || !img) return;

        const isActive = imgBox.classList.contains('h-active');

        if (!isActive) {
          // 取消激活：恢复原始状态并清除缓存
          if (imgBox.__originalStyles) {
            imgA.style.width = imgBox.__originalStyles.aWidth || '';
            imgA.style.height = imgBox.__originalStyles.aHeight || '';
            img.style.width = imgBox.__originalStyles.imgWidth || '';
            img.style.height = imgBox.__originalStyles.imgHeight || '';
            img.style.maxWidth = '';
            img.style.maxHeight = '';
            img.style.transform = '';
            img.style.position = '';
            img.style.top = '';
            img.style.left = '';
            img.style.marginTop = '';
            img.style.marginLeft = '';

            // 恢复消息宽度
            const msgMain = imgBox.closest('.h-threads-item-reply-main');
            if (msgMain && imgBox.__originalMsgWidth !== undefined) {
              msgMain.style.width = imgBox.__originalMsgWidth || '';
            }

            delete imgBox.__originalStyles;
            delete imgBox.__sizeCache;
            delete imgBox.__maxWidth;
            delete imgBox.__originalMsgWidth;
          }
          // ★ 未激活但存在图片时，消息容器宽度扩大 100px，且不超过场景最大宽度
          // const msgMain = imgBox.closest('.h-threads-item-reply-main');
          // if (msgMain) {
          //   const currentWidth = msgMain.offsetWidth;
          //   const maxMsgWidth = this.getMaxMsgWidth(msgMain);
          //   const targetWidth = Math.min(currentWidth + 50, maxMsgWidth);
          //   msgMain.style.width = targetWidth + 'px';
          // }
          // ★ 新增逻辑：恢复页面加载时的额外拓展
          // const msgMain = imgBox.closest('.h-threads-item-reply-main');
          // if (msgMain && msgMain.__originalWidth !== undefined) {
          //   msgMain.style.width = msgMain.__originalWidth; // 恢复原始宽度
          //   delete msgMain.__originalWidth;
          // }
          if (msgMain && msgMain.__originalWidth !== undefined) {
            const baseWidth = parseInt(msgMain.__originalWidth, 10) || msgMain.offsetWidth;
            msgMain.style.width = (baseWidth + 50) + 'px';  // 恢复为原始宽度 + 50
            delete msgMain.__originalWidth;
          }
          return;
        }

        // 保存原始样式
        if (!imgBox.__originalStyles) {
          imgBox.__originalStyles = {
            aWidth: imgA.style.width,
            aHeight: imgA.style.height,
            imgWidth: img.style.width,
            imgHeight: img.style.height
          };
        }

        // 延迟执行，确保图片已加载
        setTimeout(() => {
          const naturalWidth = img.naturalWidth;
          const naturalHeight = img.naturalHeight;

          if (!naturalWidth || !naturalHeight) {
            if (img.complete) return;
            img.onload = () => this.handleActiveImageBox(imgBox);
            return;
          }

          // 强制触发布局更新
          document.body.offsetHeight;

          // 获取当前最大可用宽度
          // const container = imgBox.closest('.h-threads-item-reply-main');
          const container = imgBox.closest('.h-threads-item-reply-main') || imgBox.closest('.h-threads-item-main');
          let maxWidth;

          if (container) {
            container.offsetHeight; // 触发 reflow
            let msgWidth = container.offsetWidth || container.clientWidth;

          // 新增：识别预览框与浮窗场景
          const isPreview = !!imgBox.closest('.h-preview-box');
          const isOverlay = !!imgBox.closest('.qp-body'); // 回复浮窗

          if (isPreview) {
            if (isOverlay) {
              // 在预览框 + 浮窗中：使用浮窗内容容器宽度
              const wrapEl = imgBox.closest('.qp-content-wrap');
              if (wrapEl) {
                msgWidth = wrapEl.offsetWidth || msgWidth;
              }
              // 留边距 40（与原逻辑一致），不再受 window.innerWidth - 240 限制
              maxWidth = Math.max(0, (msgWidth || 0) - 40);
            } else {
              // 在预览框但不在浮窗中：最大宽度限制为 800
              // 仍保留消息容器边距 40
              const base = Math.max(0, (msgWidth || 0) - 40);
              maxWidth = Math.min(base, 800);
            }
          } else {
            // 常规消息：保留原逻辑
            if (msgWidth < 300) {
              const parentContainer = container.closest('.h-threads-item-replies') ||
                                      container.closest('.h-threads-list') ||
                                      container.parentElement;
              if (parentContainer) {
                msgWidth = parentContainer.offsetWidth || window.innerWidth - 240;
              } else {
                msgWidth = window.innerWidth - 240;
              }
            }
            maxWidth = Math.min(msgWidth - 40, window.innerWidth - 240);
          }

          console.log('[maxWidth计算]', {
            isPreview, isOverlay, msgWidth,
            windowWidth: window.innerWidth,
            maxWidth
          });

        } else {
          // 无容器时，兜底用视口宽度
          maxWidth = Math.min(window.innerWidth - 240, 1200);
        }


          // 如果最大宽度变化或首次计算，重新预计算所有旋转角度的尺寸
          if (!imgBox.__sizeCache || forceRecalculate || imgBox.__maxWidth !== maxWidth) {
            imgBox.__maxWidth = maxWidth;
            imgBox.__sizeCache = this.precalculateImageSizes(naturalWidth, naturalHeight, maxWidth);
          }

          // 获取当前旋转索引
          const rotateIndex = parseInt(img.dataset.rotateIndex || '0');

          // 扩大消息宽度逻辑
          if (container) {
            const msgMain = container;

            // 首次保存原始消息宽度
            if (imgBox.__originalMsgWidth === undefined) {
              imgBox.__originalMsgWidth = msgMain.style.width;
            }

            const currentMsgWidth = msgMain.offsetWidth;
            // ★ 使用统一的场景上限（板块页受串右区域限制，串内页受 1200 限制）
            const maxMsgWidth = handleImageLayout.getMaxMsgWidth(msgMain);

            const longSide = Math.max(naturalWidth, naturalHeight);
            if (longSide > currentMsgWidth && currentMsgWidth < maxMsgWidth) {
              const targetWidth = Math.min(maxMsgWidth, longSide + 80);
              msgMain.style.width = targetWidth + 'px';

              // 强制触发重排，确保容器宽度真正生效
              msgMain.offsetHeight;

              // 重新计算 maxWidth（因为消息容器变大了）
              let maxWidth = Math.min(targetWidth - 40, window.innerWidth - 240);
              imgBox.__maxWidth = maxWidth;
              imgBox.__sizeCache = handleImageLayout.precalculateImageSizes(naturalWidth, naturalHeight, maxWidth);

              // 延迟应用尺寸，确保重排完成
              setTimeout(() => {
                handleImageLayout.applyImageSize(imgBox, rotateIndex);
              }, 0);
              return;
            }

          }

          // 应用对应旋转角度的尺寸
          console.log('[准备应用尺寸] rotateIndex:', rotateIndex, 'sizeCache:', imgBox.__sizeCache, 'maxWidth:', imgBox.__maxWidth);
          this.applyImageSize(imgBox, rotateIndex);

        }, 50);
      },

      // 处理普通元素溢出
      handleGeneralElements(container) {
        const SELECTORS = [
          '.h-threads-content',
          '.h-threads-item-reply-main',
          '.h-preview-box',
          'pre',
          'code',
          'table'
        ];

        SELECTORS.forEach(selector => {
          container.querySelectorAll(selector).forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
              el.style.maxWidth = '100%';
              el.style.boxSizing = 'border-box';
            }

            if (el.tagName === 'PRE' || el.tagName === 'CODE') {
              el.style.maxWidth = '100%';
              el.style.overflowX = 'auto';
              el.style.whiteSpace = 'pre-wrap';
            }

            if (el.tagName === 'TABLE') {
              el.style.maxWidth = '100%';
              el.style.display = 'block';
              el.style.overflowX = 'auto';
            }
          });
        });

        container.querySelectorAll('.h-threads-content a, .h-preview-box a').forEach(el => {
          const href = el.getAttribute('href') || '';
          if (href.length > 50) {
            el.style.wordBreak = 'break-all';
            el.style.overflowWrap = 'break-word';
          }
        });

        container.querySelectorAll('.h-threads-content img:not(.h-threads-img), .h-preview-box img').forEach(el => {
          el.style.maxWidth = '100%';
          el.style.height = 'auto';
        });
      }
    };

    // ==================== 子函数2: 交互逻辑处理 ====================
    const handleImageInteraction = {

      // 记录点击次数（用于切换展开/收起）
      clickCountMap: new WeakMap(),
      lastClickedAnchor: null,

      // 替换所有 thumb 链接为 image（高清）
      replaceHDLinks(container) {
        container.querySelectorAll('img').forEach(img => {
          if (img.closest('.h-preview-box')) return; // 新增：预览框中跳过
          if (img.src.includes('/thumb/')) {
            img.src = img.src.replace('/thumb/', '/image/');
          }
        });
        container.querySelectorAll('a').forEach(a => {
          if (a.closest('.h-preview-box')) return; // 新增：预览框中跳过
          if (a.href.includes('/thumb/')) {
            a.href = a.href.replace('/thumb/', '/image/');
          }
        });
      },

      // 绑定图片点击展开/收起逻辑
      bindImageClickLogic(container) {
        container.querySelectorAll('.h-threads-img-a').forEach(anchor => {
          // ===== 新增：预览框内的图片不绑定点击逻辑 =====
          if (anchor.closest('.h-preview-box')) return;
          if (anchor.dataset.hdBound === "1") return;
          anchor.dataset.hdBound = "1";

          anchor.addEventListener('click', (e) => {
            e.preventDefault();

            const box = anchor.closest('.h-threads-img-box');
            if (!box) return;

            const img = box.querySelector('.h-threads-img');
            if (!img) return;

            // 计数切换展开/收起
            if (this.lastClickedAnchor !== anchor) {
              this.lastClickedAnchor = anchor;
              this.clickCountMap.set(anchor, 0);
            }
            let count = (this.clickCountMap.get(anchor) || 0) + 1;
            this.clickCountMap.set(anchor, count);

            if (img.src.includes('/thumb/')) {
              img.src = img.src.replace('/thumb/', '/image/');
            }

            if (count % 2 === 1) {
              // 展开
              box.classList.add('h-active');
              img.src = anchor.href.replace('/thumb/', '/image/');
              img.dataset.rotateIndex = '0'; // 重置旋转索引
              // ★ 新增：加载失败兜底
              img.onerror = () => {
                console.warn('[图片加载失败，回退到缩略图]', img.src);
                const fallback = img.getAttribute('data-src') || anchor.href;
                img.src = fallback;
              };
              // 触发布局计算
              handleImageLayout.handleActiveImageBox(box);
            } else {
              // 收起
              box.classList.remove('h-active');
              img.style.transform = '';
              img.dataset.rotateIndex = '0';
              // const ds = img.getAttribute('data-src');
              // if (ds) img.src = ds;
              // ★ 确保 data-src 存在，否则回退到缩略图
              const ds = img.getAttribute('data-src');
              if (ds) {
                img.src = ds;
              } else {
                img.src = anchor.href.replace('/image/', '/thumb/');
              }
              // 触发布局恢复
              handleImageLayout.handleActiveImageBox(box);
            }
          });
        });
      },

      // 绑定图片控件（收起/旋转按钮）
      bindImageControls(container) {
        container.querySelectorAll('.h-threads-img-box').forEach(box => {
          // ===== 新增：预览框内的图片不绑定控件逻辑 =====
          if (box.closest('.h-preview-box')) return;
          if (box.dataset.toolBound === "1") return;
          box.dataset.toolBound = "1";

          const img = box.querySelector('.h-threads-img');
          const imgA = box.querySelector('.h-threads-img-a');
          const toolSmall = box.querySelector('.h-threads-img-tool-small');
          const toolLeft = box.querySelector('.h-threads-img-tool-left');
          const toolRight = box.querySelector('.h-threads-img-tool-right');

          // 收起按钮
          if (toolSmall && imgA) {
            toolSmall.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopImmediatePropagation();
              imgA.click();
            });
          }

          // 左旋按钮（逆时针）
          if (toolLeft && img) {
            toolLeft.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopImmediatePropagation();

              if (!box.classList.contains('h-active')) return;

              let rotateIndex = parseInt(img.dataset.rotateIndex || '0');
              //rotateIndex = (rotateIndex - 1 + 4) % 4;
              rotateIndex = rotateIndex - 1;   // ★ 改为累加，不取模
              img.dataset.rotateIndex = rotateIndex.toString();

              console.log('[左旋] rotateIndex:', rotateIndex);

              // 延迟执行布局调整，等待旋转动画完成
              setTimeout(() => {
                handleImageLayout.applyImageSize(box, rotateIndex);
              }, 50);
            });
          }

          // 右旋按钮（顺时针）
          if (toolRight && img) {
            toolRight.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopImmediatePropagation();

              if (!box.classList.contains('h-active')) return;

              let rotateIndex = parseInt(img.dataset.rotateIndex || '0');
              //rotateIndex = (rotateIndex + 1) % 4;
              rotateIndex = rotateIndex + 1;   // ★ 改为累加，不取模
              img.dataset.rotateIndex = rotateIndex.toString();

              console.log('[右旋] rotateIndex:', rotateIndex);

              // 延迟执行布局调整，等待旋转动画完成
              setTimeout(() => {
                handleImageLayout.applyImageSize(box, rotateIndex);
              }, 50);
            });
          }
        });
      },

      // 监听图片盒子的状态变化
      observeImageBoxes(container) {
        const imgBoxes = container.querySelectorAll('.h-threads-img-box');

        imgBoxes.forEach(imgBox => {
          // ===== 新增：预览框内的图片不观察 =====
          if (imgBox.closest('.h-preview-box')) return;
          // 如果已经激活但没有正确的尺寸，立即处理
          if (imgBox.classList.contains('h-active')) {
            const imgA = imgBox.querySelector('.h-threads-img-a');
            if (imgA) {
              const currentWidth = parseInt(imgA.style.width) || 0;
              const currentHeight = parseInt(imgA.style.height) || 0;

              // 如果容器尺寸异常（太小或为0），强制重新计算
              if (currentWidth < 50 || currentHeight < 50) {
                setTimeout(() => handleImageLayout.handleActiveImageBox(imgBox, true), 100);
              }
            }
          }

          // 监听 class 变化
          if (!imgBox.__overflowObserver) {
            const observer = new MutationObserver(mutations => {
              mutations.forEach(mutation => {
                if (mutation.attributeName === 'class') {
                  handleImageLayout.handleActiveImageBox(imgBox);
                }
              });
            });

            observer.observe(imgBox, {
              attributes: true,
              childList: true,
              subtree: true
            });
            imgBox.__overflowObserver = observer;
          }
        });
      }
    };

    // ==================== 执行所有处理 ====================

    // 1. 替换高清链接
    handleImageInteraction.replaceHDLinks(root);

    // 2. 绑定图片点击和控件
    handleImageInteraction.bindImageClickLogic(root);
    handleImageInteraction.bindImageControls(root);

    // 3. 处理普通元素溢出
    handleImageLayout.handleGeneralElements(root);

    // 4. 监听图片盒子状态
    handleImageInteraction.observeImageBoxes(root);

    // ★ 页面加载时拓展消息容器宽度
    if (root === document) {
      document.querySelectorAll('.h-threads-item-reply-main').forEach(msgMain => {
        handleImageLayout.expandMsgWidthIfImageExists(msgMain);
      });
    }
    // ==================== 全局监听 ====================

    // 监听 DOM 变化
    if (root === document && !enableHDImageAndLayoutFix.__globalObserver) {
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) {
              handleImageInteraction.replaceHDLinks(node);
              handleImageInteraction.bindImageClickLogic(node);
              handleImageInteraction.bindImageControls(node);
              handleImageLayout.handleGeneralElements(node);
              handleImageInteraction.observeImageBoxes(node);
            }
          });
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      enableHDImageAndLayoutFix.__globalObserver = observer;
    }

    // 监听窗口大小改变
    if (root === document && !enableHDImageAndLayoutFix.__resizeHandlerBound) {
      window.addEventListener('resize', () => {
        handleImageLayout.handleGeneralElements(document);
        document.querySelectorAll('.h-threads-img-box.h-active').forEach(imgBox => {
          handleImageLayout.handleActiveImageBox(imgBox, true);
        });
      });
      enableHDImageAndLayoutFix.__resizeHandlerBound = true;
    }
  }

  // 旧逻辑，只作用于预览框
  function enableHDImage(root = document) {
    // 记录点击次数（用于切换展开/收起）
    const clickCountMap = new WeakMap();
    let lastClickedAnchor = null;

    // 1. 仅在预览框内把所有 thumb 链接替换成 image
    root.querySelectorAll('.h-preview-box img').forEach(img => {
      if (img.src.includes('/thumb/')) {
        img.src = img.src.replace('/thumb/', '/image/');
      }
    });
    root.querySelectorAll('.h-preview-box a').forEach(a => {
      if (a.href.includes('/thumb/')) {
        a.href = a.href.replace('/thumb/', '/image/');
      }
    });

    // 2. 仅绑定预览框内的图片盒子的点击逻辑
    root.querySelectorAll('.h-preview-box .h-threads-img-a').forEach(anchor => {
      if (anchor.dataset.hdBound === "1") return;
      anchor.dataset.hdBound = "1";

      anchor.addEventListener('click', function (e) {
        e.preventDefault();

        // 保护：如果不是预览框中的 anchor，直接返回
        if (!this.closest('.h-preview-box')) return;

        const box = this.closest('.h-threads-img-box');
        if (!box) return;

        const img = box.querySelector('.h-threads-img');
        if (!img) return;

        // 计数切换展开/收起
        if (lastClickedAnchor !== this) {
          lastClickedAnchor = this;
          clickCountMap.set(this, 0);
        }
        let count = (clickCountMap.get(this) || 0) + 1;
        clickCountMap.set(this, count);

        if (img.src.includes('/thumb/')) {
          img.src = img.src.replace('/thumb/', '/image/');
        }

        if (count % 2 === 1) {
          box.classList.add('h-active');
          img.src = this.href.replace('/thumb/', '/image/');
        } else {
          box.classList.remove('h-active');
          img.style.transform = '';
          img.style.top = '0px';
          img.style.left = '0px';
          img.dataset.rotateIndex = 0;
          const ds = img.getAttribute('data-src');
          if (ds) img.src = ds;
        }
      });
    });

    // 3. 工具按钮逻辑（收起/旋转）
    function applyResizeForRotation(img, imgA, rotateIndex) {
      if (!img || !imgA) return;
      const width = img.width;
      const height = img.height;

      if (rotateIndex === 1 || rotateIndex === 3) {
        const offset = (width - height) / 2;
        img.style.top = offset + 'px';
        img.style.left = -offset + 'px';
        imgA.style.height = width + 'px';
      } else {
        img.style.top = '0px';
        img.style.left = '0px';
        imgA.style.height = height + 'px';
      }
    }

    // 3. 仅绑定预览框内的图片盒子工具按钮
    root.querySelectorAll('.h-preview-box .h-threads-img-box').forEach(box => {
      if (box.dataset.toolBound === "1") return;
      box.dataset.toolBound = "1";

      // 保护：如果该盒子不在预览框，则跳过
      if (!box.closest('.h-preview-box')) return;

      const img = box.querySelector('.h-threads-img');
      const imgA = box.querySelector('.h-threads-img-a');
      const toolSmall = box.querySelector('.h-threads-img-tool-small');
      const toolLeft = box.querySelector('.h-threads-img-tool-left');
      const toolRight = box.querySelector('.h-threads-img-tool-right');

      const rotateArray = [
        'matrix(1, 0, 0, 1, 0, 0)',
        'matrix(0, 1, -1, 0, 0, 0)',
        'matrix(-1, 0, 0, -1, 0, 0)',
        'matrix(0, -1, 1, 0, 0, 0)'
      ];
      let rotateIndex = 0;

      if (toolSmall && imgA) {
        toolSmall.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopImmediatePropagation();
          imgA.click();
        });
      }

      if (toolLeft && img) {
        toolLeft.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopImmediatePropagation();
          // 保护：仅在预览框且激活时旋转
          if (!box.closest('.h-preview-box') || !box.classList.contains('h-active')) return;
          rotateIndex = (rotateIndex - 1 + rotateArray.length) % rotateArray.length;
          img.dataset.rotateIndex = rotateIndex;
          img.style.transform = rotateArray[rotateIndex];
          applyResizeForRotation(img, imgA, rotateIndex);
        });
      }

      if (toolRight && img) {
        toolRight.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopImmediatePropagation();
          // 保护：仅在预览框且激活时旋转
          if (!box.closest('.h-preview-box') || !box.classList.contains('h-active')) return;
          rotateIndex = (rotateIndex + 1) % rotateArray.length;
          img.dataset.rotateIndex = rotateIndex;
          img.style.transform = rotateArray[rotateIndex];
          applyResizeForRotation(img, imgA, rotateIndex);
        });
      }
    });

  }

  // 板块页链接新标签页打开
  function runLinkBlank(root = document) {
    root.querySelectorAll('#h-content .h-threads-list a').forEach(a => {
        // ===== 新增：排除分页导航内的链接 =====
        if (a.closest('ul.uk-pagination.uk-pagination-left.h-pagination')) return;
        // =====================================
        a.setAttribute('target', '_blank');
    });
  }

  /* --------------------------------------------------
   * tag 9. 引用浮窗/鼠标离开后自动隐藏原生引用
   * -------------------------------------------------- */
  function enableQuotePreview() {
    const cache = Object.create(null);
    // 注入样式（只注入一次）
    if (!document.getElementById('qp-styles')) {
      const style = document.createElement('style');
      style.id = 'qp-styles';
      style.textContent = `
        .qp-overlay-quote {
          position: fixed; inset: 0;
          z-index: 9999; /* 降低层级 */
          background: rgba(0,0,0,.45);
          display: none;
        }
        .qp-stack {
          position: fixed;
          top: 55%; /* 下移一点 */
          left: 50%;
          transform: translate(-50%, -50%);
          width: min(90vw, 820px);
          height: 80vh;
          overflow: visible;
          box-sizing: border-box;
        }

        .qp-close-all {
          position: fixed; right: 12px; bottom: 12px;
          font-size: 20px; line-height: 1;
          color: #fff; background: rgba(0,0,0,.6);
          padding: 6px 12px; border-radius: 6px; cursor: pointer; z-index: 10000;
          user-select: none;
        }
        .qp-quote {
          position: absolute;
          top: 0; left: 0;
          width: 100%; max-height: 100%;
          overflow: auto;
          background: #fff;
          border: 1px solid #ccc;
          outline: 2px solid #fff;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,.24);
          padding: 18px 20px 20px;
          box-sizing: border-box;
        }
        .qp-quote * { max-width: 100%; box-sizing: border-box; }
        .qp-header {
          position: sticky; top: 0;
          display: flex; gap: 10px; justify-content: flex-end;
          padding-bottom: 6px; margin: -8px -8px 10px; padding: 8px;
          background: transparent; /* ✅ 改为透明背景 */
          z-index: 2;
        }
        .qp-level {
          font-size: 12px; color: #333; background: #eee; border-radius: 4px; padding: 2px 6px;
        }
        .qp-back {
          font-size: 12px; color: #333; background: #f0f0f0;
          border: 1px solid #ccc; border-radius: 4px; padding: 2px 6px;
          cursor: pointer;
        }
        .qp-quote.is-dragging { cursor: grabbing !important; }
        #h-ref-view { pointer-events: none !important; }
        #h-ref-view {
          z-index: 20000 !important; /* 保证原生引用框在浮窗之上 */
        }
        /* 拖拽手柄：四边窄条，仅在手柄区域显示“移动”指针 */
        .qp-drag-edge {
          position: absolute;
          pointer-events: auto;
          z-index: 3;
          cursor: move;
        }
        .qp-drag-edge.top    { top: 0;    left: 0;    right: 0;  height: 10px; }
        .qp-drag-edge.bottom { bottom: 0; left: 0;    right: 0;  height: 10px; }
        .qp-drag-edge.left   { top: 0;    bottom: 0;  left: 0;   width: 10px; }
        .qp-drag-edge.right  { top: 0;    bottom: 0;  right: 0;  width: 10px; } 
        /* 标题栏作为拖拽手柄时的指针反馈 */
        .qp-header { cursor: move; }


      `;
      document.head.appendChild(style);
    }

    //✅ 监听原生引用浮窗的显示，如果鼠标不在引用号上则立即隐藏
    const observer = new MutationObserver(() => {
      const refView = document.getElementById('h-ref-view');
      if (refView && refView.style.display === 'block') {
        // 引用浮窗刚显示时，检查鼠标是否在引用号上
        const quoteFonts = document.querySelectorAll('font[color="#789922"]');
        let isHovering = false;
        quoteFonts.forEach(font => {
          if (font.matches(':hover')) {
            isHovering = true;
          }
        });
        
        // 如果鼠标不在任何引用号上，立即隐藏
        if (!isHovering) {
          refView.style.display = 'none';
          refView.style.opacity = '';  // 重置透明度
        }
      }
    });
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['style']  // 监听 style 属性变化
    });
    observer.observe(document.body, { childList: true, subtree: true });


    const $overlay = $('<div class="qp-overlay-quote"></div>').appendTo('body');
    const $stack   = $('<div class="qp-stack"></div>').appendTo($overlay);
    const $closeAll= $('<div class="qp-close-all">❌</div>').appendTo($overlay);

    $closeAll.on('click', () => {
      $stack.empty();
      $overlay.fadeOut(160);
    });

    // 点击引用框以外的任何地方都关闭
    $overlay.off('click.qp').on('click.qp', function(e){
      if (!$overlay.is(':visible')) return;

      const $top = $stack.children('.qp-quote').last();
      if (!$top.length) { $overlay.fadeOut(160); return; }

      // 1) 如果点击发生在最上层引用框内部，忽略
      if ($(e.target).closest($top).length) return;

      // 2) 如果正在/刚刚拖拽，避免误触关闭
      if ($top.hasClass('is-dragging') || $('.qp-quote.is-dragging').length) return;

      // 3) 点击最上层框之外：仅移除最上层
      $top.remove();
      if ($stack.children('.qp-quote').length === 0) $overlay.fadeOut(160);
    });

    $(document).on('keydown.qp', e => {
      if (e.key !== 'Escape' || !$overlay.is(':visible')) return;
      const $last = $stack.children('.qp-quote').last();
      if ($last.length) $last.remove();
      if ($stack.children().length === 0) $overlay.fadeOut(160);
    });

    function fetchData(tid) {
      if (cache[tid]) return Promise.resolve(cache[tid]);
      return $.get(`/Home/Forum/ref?id=${tid}`).then(html => (cache[tid] = html));
    }

    function stripIds($root) {
      $root.find('[id]').removeAttr('id');
      return $root;
    }

    function showQuote(html) {
      const depth = $stack.children('.qp-quote').length;

      const $quote = $('<div class="qp-quote"></div>').css({
        top: '0px',
        left: '0px',
        zIndex: 1000 + depth
      });

      const $header = $('<div class="qp-header"></div>');
      const $level  = $(`<span class="qp-level">第 ${depth + 1} 层</span>`);
      const $back   = $('<button class="qp-back">返回</button>').on('click', e => {
        e.stopPropagation();
        $quote.remove();
        if ($stack.children().length === 0) $overlay.fadeOut(160);
      });

      $header.append($level, $back);
      $quote.append($header);

      const $content = stripIds($('<div></div>').html(html));
      $quote.append($content.contents());

      // 在 $quote 内添加四条边框拖拽手柄
      const $edges = $(
        '<div class="qp-drag-edge top"></div>' +
        '<div class="qp-drag-edge bottom"></div>' +
        '<div class="qp-drag-edge left"></div>' +
        '<div class="qp-drag-edge right"></div>'
      );
      $quote.append($edges);


      // 仅在标题栏 + 四边手柄上触发拖拽
      enableDragForTop($quote, $quote.find('.qp-header, .qp-drag-edge'));

      $stack.append($quote);
      $overlay.fadeIn(160);

      enableHDImageAndLayoutFix($quote[0]);
      runLinkBlank($quote[0]);
      enableHDImageAndLayoutFix();
      initExtendedContent($quote[0]);
      hideEmptyTitleAndEmail($quote[0]);
      initContent();
      //autoHideRefView();
    }

    function enableDragForTop($quote, $handles) {
      // 不要清除所有 qpdrag 事件，只清除当前 $quote 的
      $quote.off('.qpdrag');

      $quote.css({
        top: parseInt($quote.css('top')) || 0 + 'px',
        left: parseInt($quote.css('left')) || 0 + 'px',
        position: 'absolute' // 确保是绝对定位
      });

      //let dragging = false, dx = 0, dy = 0;
      let dx = 0, dy = 0;

      // 仅在"手柄"元素上启动拖拽：标题栏 + 四边窄条
      $handles.on('mousedown.qpdrag', function(e){
        console.log('Edge Debug: mousedown triggered', e);  // ← 添加
        // 避免点击标题栏中的交互控件（返回按钮等）触发拖拽
        if ($(e.target).closest('a,button,input,textarea,select,label').length) return;

        //dragging = true;
        $quote.data('dragging', true);  // ← 使用 data 存储
        console.log('Edge Debug: dragging set to true');  // ← 添加

        console.log('Edge Debug: mousemove handlers count:', $._data(window, 'events')?.mousemove?.length);  // ← 添加这行

        $overlay.data('isDragging', true); // 标记正在拖拽
        $quote.addClass('is-dragging');

        // 获取当前的 top 和 left 值
        const currentTop = parseInt($quote.css('top')) || 0;
        const currentLeft = parseInt($quote.css('left')) || 0;
        const stackOff = $stack.offset();

        dx = e.pageX - currentLeft - stackOff.left;
        dy = e.pageY - currentTop - stackOff.top;
        e.preventDefault();
      });

      //$(document).on('mousemove.qpdrag', function(e){
      $(window).on('mousemove.qpdrag', function(e){
        //console.log('Edge Debug: mousemove triggered, dragging=', dragging);  // ← 添加
        console.log('Edge Debug: mousemove triggered, dragging=', $quote.data('dragging'));
        //if (!dragging) return;
        if (!$quote.data('dragging')) return;
        e.preventDefault();  // ← 在这里添加
        e.stopPropagation(); // ← 在这里添加
        const stackOff = $stack.offset();
        const stackWidth = $stack.width();
        const stackHeight = $stack.height();
        const quoteWidth = $quote.outerWidth();
        const quoteHeight = $quote.outerHeight();

        let top = e.pageY - dy - stackOff.top;
        let left = e.pageX - dx - stackOff.left;

        // 限制拖拽范围，允许向左和向上拖出一部分（至少保留 50px 可见）
        top = Math.max(-quoteHeight + 50, Math.min(stackHeight - 50, top));
        left = Math.max(-quoteWidth + 50, Math.min(stackWidth - 50, left));

        $quote.css({ top: top + 'px', left: left + 'px' });
        console.log('Edge Debug: position updated to', top, left);  // ← 添加
      });

      //$(document).on('mouseup.qpdrag', function(e){
      $(window).on('mouseup.qpdrag', function(e){
        //console.log('Edge Debug: mouseup triggered, dragging=', dragging);  // ← 添加
        console.log('Edge Debug: mouseup triggered, dragging=', $quote.data('dragging'));
        //if (!dragging) return;
        e.preventDefault();    // ← 添加（但注意这里没有 e 参数）
        //dragging = false;
        if (!$quote.data('dragging')) return;
        $quote.data('dragging', false);
        $quote.removeClass('is-dragging');

        // 延迟清除拖拽状态，避免释放瞬间的点击事件触发关闭
        setTimeout(() => {
          $overlay.data('isDragging', false);
        }, 100);

        // 不要解绑 document 的事件，因为可能有多个引用框
        // $(document).off('mousemove.qpdrag mouseup.qpdrag');
      });
    }


    $(document).off('click.qp').on('click.qp', 'font[color="#789922"]', function(e){
      $('#h-ref-view').hide().css('opacity', '');   // 点击时关闭原生引用框并重置透明度
      e.preventDefault();
      e.stopPropagation();
      const tid = (this.textContent.match(/\d+/) || [])[0];
      if (!tid) return;
      fetchData(tid).then(showQuote);
    });
    $(document).on('mouseleave', 'font[color="#789922"]', function () {
      $('#h-ref-view').hide();   // 鼠标移开时关闭原生引用框
    });
    // 全局监听多个事件，确保原生引用浮窗及时隐藏
    $(document).on('mousemove.refview scroll.refview wheel.refview', function(e) {
      const refView = document.getElementById('h-ref-view');
      if (!refView || refView.style.display === 'none') return;
      
      // 检查鼠标当前位置下的元素是否是引用号
      const elementsUnderMouse = document.elementsFromPoint(e.clientX, e.clientY);
      const isOnQuote = elementsUnderMouse.some(el => {
        return el.tagName === 'FONT' && el.getAttribute('color') === '#789922';
      });
      
      // 如果不在引用号上，立即隐藏
      if (!isOnQuote) {
        refView.style.display = 'none';
        refView.style.opacity = '';  // 重置透明度
      }
    });
  }

  function monitorRefView(){
    const refView = document.getElementById('h-ref-view');
    if (!refView) return;

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        // 1) 预览窗格显示时
        if (refView.style.display === 'block') {
          // 2) 每次有子节点变化时都执行隐藏
          hideEmptyTitleAndEmail();
        }
      });
    });

    observer.observe(refView, {
      attributes: true,
      attributeFilter: ['style'],
      childList: true,
      subtree: true
    });
  }


  // function autoHideRefView() {
  //     setInterval(() => {
  //         const refView = document.getElementById('h-ref-view');
  //         if (!refView || getComputedStyle(refView).display === 'none') return;

  //         // 获取当前引用框中的引用号 ID
  //         const infoId = refView.querySelector('.h-threads-info-id');
  //         if (!infoId) return;

  //         const tidMatch = infoId.textContent.match(/\d+/);
  //         if (!tidMatch) return;

  //         const tid = tidMatch[0];

  //         // 查找所有引用号元素
  //         const quoteFonts = document.querySelectorAll("font[color='#789922']");

  //         let isHovering = false;
  //         quoteFonts.forEach(font => {
  //             const text = font.textContent;
  //             if (text.includes(tid) && font.matches(':hover')) {
  //                 isHovering = true;
  //             }
  //         });

  //         // 如果没有任何引用号处于 hover 状态 → 隐藏引用框
  //         if (!isHovering) {
  //             refView.style.display = 'none';
  //         }
  //     }, 300); // 每 300ms 检查一次
  // }

  //引用格式拓展
  function extendQuote(root = document) {
    const ROOT_SELECTOR = '.h-threads-content, .h-post-form-input';
    const QUOTE_COLOR = '#789922';

    // 在容器内遍历纯文本节点，避免破坏现有标签
    root.querySelectorAll(ROOT_SELECTOR).forEach(root => {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    // 没数字直接跳过
                    if (!node.nodeValue || !/\d/.test(node.nodeValue)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // 已经在 quote 的 <font color="#789922"> 内，跳过
                    const p = node.parentElement;
                    if (p && p.tagName.toLowerCase() === 'font' && (p.getAttribute('color') || '').toLowerCase() === QUOTE_COLOR) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const textNodes = [];
        let n;
        while ((n = walker.nextNode())) textNodes.push(n);

        textNodes.forEach(processTextNode);
    });

    function processTextNode(textNode) {
        const text = textNode.nodeValue;
        // 两类模式：No.12345678 与 单独 8 位数字
        const patterns = [
          { name: 'no',  regex: /(?:>>)?No\.(\d{8})\b/g },      // 匹配 No.12345678 或 >>No.12345678
          { name: 'num', regex: /(?:>>)?(?<!\d)(\d{8})(?!\d)/g } // 匹配 12345678 或 >>12345678
        ];

        const frag = document.createDocumentFragment();
        let cursor = 0;
        let changed = false;

        while (true) {
            const next = findNextMatch(text, cursor, patterns);
            if (!next) break;

            const { start, end } = next;

            // 若匹配前紧挨着 ">>"，说明是标准引用的一部分，跳过这次，继续后移
            // if (start >= 2 && text[start - 2] === '>' && text[start - 1] === '>') {
            //     // 只推进一位，继续找后面的匹配，避免卡住
            //     cursor = start + 1;
            //     continue;
            // }

            // 追加匹配前的原始文本
            if (start > cursor) {
                frag.appendChild(document.createTextNode(text.slice(cursor, start)));
            }

            // 用与标准引用一致的 <font color="#789922"> 包裹，但不添加 ">>"
            const font = document.createElement('font');
            font.setAttribute('color', QUOTE_COLOR);
            // 直接保留原始匹配文本（可能是 "No.12345678" 或 "12345678"）
            font.textContent = text.slice(start, end);
            frag.appendChild(font);

            cursor = end;
            changed = true;
        }

        if (!changed) return;

        // 末尾剩余文本
        if (cursor < text.length) {
            frag.appendChild(document.createTextNode(text.slice(cursor)));
        }

        textNode.replaceWith(frag);
    }

    // 在多正则间找到下一处最早的匹配
    function findNextMatch(text, fromIndex, patterns) {
        let best = null;
        for (const p of patterns) {
            p.regex.lastIndex = fromIndex;
            const m = p.regex.exec(text);
            if (m) {
                const start = m.index;
                const end = start + m[0].length;
                if (!best || start < best.start) {
                    best = { start, end };
                }
            }
        }
        return best;
    }
    // === 自动定时检测 ===
    if (root === document && !extendQuote.__interval) {
        try {
            const cfg = typeof SettingPanel !== 'undefined'
                ? Object.assign({}, SettingPanel.defaults, GM_getValue(SettingPanel.key, {}))
                : { extendQuote: true };
            if (cfg.extendQuote) {
                extendQuote.__interval = setInterval(() => {
                    try {
                        extendQuote(); // 再次全局扫描
                    } catch (e) {
                        console.warn('extendQuote interval error', e);
                    }
                }, 2000); // 每 2 秒检测一次
            }
        } catch (e) {
            console.warn('extendQuote auto-scan init error', e);
        }
    }
  }

  function initExtendedContent(root) {
    const $root = $(root || document);

    // —— 现有的引用扩展逻辑保持不变 ——
    $root.find("font[color='#789922']")
      .filter(function () {
        return /(No\.\d{8}|\d{8})/.test($(this).text());
      })
      .off('mouseenter.ext')
      .on('mouseenter.ext', function () {
        var self = this;
        var tid = /\d+/.exec($(this).text())[0];
        $.get('/Home/Forum/ref?id=' + tid)
          .done(function (data) {
            if (data.indexOf('<!DOCTYPE html><html><head>') >= 0) {
              return false;
            }
            $("#h-ref-view").off().html(data).css({
              top: $(self).offset().top,
              left: $(self).offset().left
            }).fadeIn(100).one('mouseleave', function () {
              $(this).fadeOut(100);
            });
          });
      });

    // —— 新增：处理 [h]...[/h] 隐藏文本 ——
    $root.find('.h-threads-content').each(function () {
      const $content = $(this);
      let html = $content.html();
      // 匹配 [h]内容[/h]
      const hideenRegExp = /\[h\]([\s\S]*?)\[\/h\]/g;
      if (hideenRegExp.test(html)) {
        html = html.replace(hideenRegExp, '<span class="h-hidden-text">$1</span>');
        $content.html(html);
      }
    });
    // === 自动定时检测 ===
    if (root === document && !initExtendedContent.__interval) {
      initExtendedContent.__interval = setInterval(() => {
        try {
          initExtendedContent(); // 再次全局扫描
        } catch (e) {
          console.warn('initExtendedContent interval error', e);
        }
      }, 2000); // 每 2 秒检测一次
    }

  }


  /* --------------------------------------------------
   * tag 10. 创建拓展坞+reply按钮呼出回复悬浮窗
   * -------------------------------------------------- */
  function replaceRightSidebar() {
    // 移除原始工具栏
    $('#h-tool').remove();

    // 样式（只注入一次）
    if (!document.getElementById('qp-style')) {
        const style = document.createElement('style');
        style.id = 'qp-style';
        style.textContent = `
          .qp-overlay {
            position: fixed; inset: 0; z-index: 9000;
            background: rgba(0,0,0,.45); display: none;
          }
          .qp-stack {
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: min(90vw, 820px);   /* 初始宽度为视口的90%，最大820px */
            min-width: 0;              /* 不设固定值，由 JS 动态控制 */
            max-width: none;           /* 允许用户手动扩展 */
            height: 80vh;
            overflow: visible; box-sizing: border-box;
          }
          .qp-quote {
            position: absolute;
            top: 0; left: 0;
            width: 100%;
            max-height: 100%;
          overflow-x: hidden;  /* 隐藏横向滚动条 */
          overflow-y: auto;    /* 保留竖向滚动条 */
            background: #fff;
            border: 1px solid #ccc;
            outline: 2px solid #fff;
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0,0,0,.24);
            padding: 18px 20px 20px;
            box-sizing: border-box;
          }
          .qp-quote textarea[name="content"] {
            resize: both;           /* 允许双向调节 */
            min-width: 90%;        /* 最小宽度为容器宽度 */
            max-width: none;       /* 通过 JS 动态控制，这里不限制 */
            box-sizing: border-box;
          }

          /* 仅在浮窗中允许拖动改变宽度 */
          .qp-body .h-post-form-textarea {
              resize: horizontal;   /* 允许左右拉伸 */
              min-width: px;     /* 原始宽度为最小值，避免变太窄 */
              max-width: 100%;      /* 防止超过容器太多 */
              box-sizing: border-box;
          }

          /* 拖拽手柄：四边窄条，仅在手柄区域显示"移动"指针 */
          .qp-drag-edge {
            position: absolute;
            pointer-events: auto;
            z-index: 3;
            cursor: move;
          }
          .qp-drag-edge.top    { top: 0;    left: 0;    right: 0;  height: 8px; }
          .qp-drag-edge.bottom { bottom: 0; left: 0;    right: 0;  height: 8px; } 
          .qp-drag-edge.left   { top: 0;    bottom: 0;  left: 0;   width: 8px; }
          .qp-drag-edge.right  { top: 0;    bottom: 0;  right: 0;  width: 8px; } 

          .qp-quote.is-dragging { cursor: grabbing !important; }

          /* 归位按钮 */
          .qp-reset-btn {
            position: fixed; right: 12px; bottom: 12px;
            font-size: 20px; line-height: 1;
            color: #fff; background: rgba(0,0,0,.6);
            padding: 6px 12px; border-radius: 6px; cursor: pointer;
            z-index: 9001; /* 比 overlay 高 */
            user-select: none;
            display: none;
          }

          .qp-body .qp-content-wrap {
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: none;       /* 改为 none，不限制最大宽度 */
            margin: 0 auto;
          }

          .qp-body .qp-content-wrap form {
            max-width: 100%;
            box-sizing: border-box;
          }


          /* textarea 可以双向调整 */
          .qp-body .qp-content-wrap textarea[name="content"] {
            resize: both;
            min-width: 600px;   /* 给个合理的最小值 */
            min-height: 100px;   /* 给个合理的最小值 */
            width: auto;        /* 不要强制 100% */
            max-width: none;    /* 允许无限扩展 */
            box-sizing: border-box;
          }


          .qp-body .qp-content-wrap .h-preview-box {
            width: 100% !important;   /* 始终和容器一致 */
            overflow-wrap: break-word; /* 长单词/长链接换行 */
            word-break: break-word;    /* 兼容性处理 */
            white-space: normal;       /* 允许正常换行 */
          }

          /* 浮窗内预览框及其子层级全部占满宽度 */
          .qp-body .qp-content-wrap .h-preview-box,
          .qp-body .qp-content-wrap .h-preview-box .h-threads-item,
          .qp-body .qp-content-wrap .h-preview-box .h-threads-item-replies,
          .qp-body .qp-content-wrap .h-preview-box .h-threads-item-reply,
          .qp-body .qp-content-wrap .h-preview-box .h-threads-item-reply-main {
              width: 100% !important;
              max-width: none !important;
              margin: 0 !important;
              box-sizing: border-box;
              display: block;
          }

          /* 浮窗内：仅在非 h-active 状态下限制缩略图宽度 */
          .qp-body .qp-content-wrap .h-preview-box .h-threads-img-box:not(.h-active) .h-threads-img {
            max-width: 33% !important;
            height: auto !important;
          }

          /* 表单内：仅在非 h-active 状态下限制缩略图宽度 */
          #h-post-form .h-preview-box .h-threads-img-box:not(.h-active) .h-threads-img {
            max-width: 50% !important;
            height: auto !important;
          }

          .hld__docker { position: fixed; height: 80px; width: 30px; bottom: 180px; right: 0; transition: all ease .2s; z-index: 9998; }
          .hld__docker:hover { width: 150px; height: 300px; bottom: 75px; }
          .hld__docker-sidebar { background: #fff; position: fixed; height: 50px; width: 20px; bottom: 195px; right: 0; display: flex; justify-content: center; align-items: center; border: 1px solid #CCC; box-shadow: 0 0 1px #333; border-right: none; border-radius: 5px 0 0 5px; }
          .hld__docker-btns { position: absolute; top: 0; left: 50px; bottom: 0; right: 50px; display: flex; justify-content: center; align-items: center; flex-direction: column; }
          .hld__docker .hld__docker-btns>div { opacity: 0; flex-shrink: 0; }
          .hld__docker:hover .hld__docker-btns>div { opacity: 1; }
          .hld__docker-btns>div { background: #fff; border: 1px solid #CCC; box-shadow: 0 0 1px #444; width: 50px; height: 50px; border-radius: 50%; margin: 10px 0; cursor: pointer; display: flex; justify-content: center; align-items: center; font-size: 20px; font-weight: bold; color: #333; transition: background .2s, transform .2s; }
          .hld__docker-btns>div:hover { background: #f0f0f0; transform: scale(1.1); }
        `;
        document.head.appendChild(style);
    }

    // 扩展坞 DOM
    const dockerDom = $(`
        <div class="hld__docker">
            <div class="hld__docker-sidebar">
                <svg viewBox="0 0 1024 1024" width="64" height="64">
                    <path d="M518.3 824.05c-7.88 0-15.76-2.97-21.69-9L215.25 533.65c-5.73-5.73-9-13.61-9-21.69s3.27-15.96 9-21.69l281.4-281.4c11.97-11.97 31.41-11.97 43.39 0s11.97 31.41 0 43.39L280.33 511.95l259.71 259.71c11.97 11.97 11.97 31.41 0 43.39-5.94 6.04-13.72 9-21.69 9z" fill="#888"/>
                    <path d="M787.16 772.89c-7.88 0-15.76-2.97-21.69-9L535.23 533.65c-11.97-11.97-11.97-31.41 0-43.39l230.24-230.24c11.97-11.97 31.41-11.97 43.39 0s11.97 31.41 0 43.39L600.31 511.95l208.55 208.55c11.97 11.97 11.97 31.41 0 43.39-5.94 6.04-13.72 9-21.69 9z" fill="#888"/>
                </svg>
            </div>
            <div class="hld__docker-btns">
                <div data-type="TOP">↑</div>
                <div data-type="REPLY">↩</div>
                <div data-type="BOTTOM">↓</div>
            </div>
        </div>
    `);
    $('body').append(dockerDom);

    // 顶部按钮
    dockerDom.find('[data-type="TOP"]').on('click', () => {
        $('html, body').animate({ scrollTop: 0 }, 500);
    });

    // 悬浮窗引用
    let overlay;

    function ensureOverlay() {
      if (!overlay) {
          overlay = document.createElement('div');
          overlay.className = 'qp-overlay';
          overlay.innerHTML = `
              <div class="qp-stack">
                  <div class="qp-quote">
                      <div class="qp-drag-edge top"></div>
                      <div class="qp-drag-edge bottom"></div>
                      <div class="qp-drag-edge left"></div>
                      <div class="qp-drag-edge right"></div>
                      <div class="qp-body"></div>
                  </div>
              </div>
              <div class="qp-reset-btn">🗘</div>
          `;
          document.body.appendChild(overlay);

          // 点击遮罩关闭（点内容不关闭，且允许事件冒泡到 document 以触发引用弹窗）
          overlay.addEventListener('click', function (e) {
            if (e.target.closest('.qp-quote')) {
                return; // 点击在内容区：不关闭，也不阻止冒泡
            }
            // 如果正在调整 textarea 大小，不关闭浮窗
            if (overlay.__isResizing) {
                return;
            }
            closeOverlay();
          });

          // ESC 关闭（优先关闭颜文字选择框）
          document.addEventListener('keydown', e => {
            if (e.key !== 'Escape') return;

            // 检查是否存在打开的颜文字面板
            const openKaomojiPanel = document.querySelector('.kaomoji-panel[style*="display: grid"]');
            if (openKaomojiPanel) {
                // 触发颜文字函数内的关闭逻辑（模拟点击空白或ESC）
                openKaomojiPanel.style.display = 'none';
                // 若有全局绑定的 hidePanel 函数（例如触发按钮附近定义的），触发它
                const hideEvent = new CustomEvent('kaomoji:hide');
                document.dispatchEvent(hideEvent);
                //openKaomojiPanel.style.display = 'none';

                // ★ 新增：关闭颜文字面板后聚焦到浮窗内的 textarea
                const ta = overlay?.querySelector('textarea[name="content"]');
                if (ta) {
                  ta.focus();
                }

                return; // 阻止继续关闭浮窗

            }

            // 若没有颜文字面板打开，则关闭回复浮窗
            closeOverlay();
          });

          // 归位按钮事件
          const resetBtn = overlay.querySelector('.qp-reset-btn');
          resetBtn.addEventListener('click', (e) => {
              e.stopPropagation(); // 阻止事件冒泡，避免触发 overlay 的关闭逻辑
              const quote = overlay.querySelector('.qp-quote');
              quote.style.top = '0px';
              quote.style.left = '0px';
          });
      }
      return overlay;
   }

    function closeOverlay() {
      if (!overlay) return;

      // 清理 ResizeObserver
      // if (overlay.__resizeObserver) {
      //   overlay.__resizeObserver.disconnect();
      //   overlay.__resizeObserver = null;
      // }

      // 清理 stack 的 ResizeObserver
      if (overlay.__stackObserver) {
        overlay.__stackObserver.disconnect();
        overlay.__stackObserver = null;
      }
      // 保存当前浮窗和textarea的尺寸（保存计算后的实际值）
      const stack = overlay.querySelector('.qp-stack');
      const ta = overlay.querySelector('textarea[name="content"]');
      if (stack && ta) {
        const taRect = ta.getBoundingClientRect();
        overlay.__savedStackWidth = stack.style.width;
        overlay.__savedTextareaWidth = taRect.width + 'px'; // 保存实际宽度
        overlay.__savedTextareaHeight = taRect.height + 'px'; // 保存实际高度

        // 在移回原位置之前，先应用尺寸到 textarea
        ta.style.width = taRect.width + 'px';
        ta.style.height = taRect.height + 'px';
      }

      overlay.style.display = 'none';

      // 隐藏归位按钮
      const resetBtn = overlay.querySelector('.qp-reset-btn');
      if (resetBtn) resetBtn.style.display = 'none';

      // 清理窗口 resize 监听
      if (overlay.__windowResizeHandler) {
        window.removeEventListener('resize', overlay.__windowResizeHandler);
        overlay.__windowResizeHandler = null;
      }
      if (overlay.__formEl && overlay.__formEl.__placeholder) {
        overlay.__formEl.__placeholder.parentNode.insertBefore(overlay.__formEl, overlay.__formEl.__placeholder);

        // 移回后清除 textarea 的宽度样式，让它恢复原始状态
        const taInForm = overlay.__formEl.querySelector('textarea[name="content"]');
        if (taInForm) {
          taInForm.style.removeProperty('width');
          taInForm.style.removeProperty('height');
          taInForm.style.removeProperty('min-width');
          taInForm.style.removeProperty('max-width');
        }

          if (overlay.__formEl.__wasCollapsed) {
            const $form = $(overlay.__formEl);
            const hint = overlay.__formEl.action.includes('doReplyThread') ? '『回复』' : '『发串』';
            // 如果原位置已经有占位符，就直接隐藏并标记折叠
            if ($form.prev('.xdex-placeholder').length) {
                $form.hide().data('xdex-collapsed', true);
            } else if (typeof Utils !== 'undefined' && typeof Utils.collapse === 'function') {
                Utils.collapse($form, hint);
            }
            overlay.__formEl.__wasCollapsed = false;
        }
      }
      if (overlay.__previewEl && overlay.__previewEl.__placeholder) {
        overlay.__previewEl.__placeholder.parentNode.insertBefore(overlay.__previewEl, overlay.__previewEl.__placeholder);
      }
    }

    // 新增：回复浮窗拖拽函数
    function enableDragForReply($quote, $handles) {
      // 确保初始位置居中
      $quote.css({
          top: '0px',
          left: '0px',
          position: 'absolute' // 确保是相对于 stack 定位
      });

      //let dragging = false, dx = 0, dy = 0;
      let dx = 0, dy = 0;

      // 移除旧的事件监听（避免重复绑定）
      $handles.off('mousedown.qpdrag-reply');
      $(window).off('mousemove.qpdrag-reply mouseup.qpdrag-reply');

      $handles.on('mousedown.qpdrag-reply', function(e){
          //dragging = true;
          $quote.data('dragging', true);  // ← 使用 data 存储
          $quote.addClass('is-dragging');

          // 获取当前的 top 和 left 值
          const currentTop = parseInt($quote.css('top')) || 0;
          const currentLeft = parseInt($quote.css('left')) || 0;

          dx = e.pageX - currentLeft - $quote.parent().offset().left;
          dy = e.pageY - currentTop - $quote.parent().offset().top;
          e.preventDefault();
      });

      $(window).on('mousemove.qpdrag-reply', function(e){
          //if (!dragging) return;
          if (!$quote.data('dragging')) return;  // ← 从 data 读取
          e.preventDefault();  // ← 在这里添加
          e.stopPropagation(); // ← 在这里添加
          const $stack = $quote.parent();
          const stackOff = $stack.offset();
          const stackWidth = $stack.width();
          const stackHeight = $stack.height();
          const quoteWidth = $quote.outerWidth();
          const quoteHeight = $quote.outerHeight();

          let top = e.pageY - dy - stackOff.top;
          let left = e.pageX - dx - stackOff.left;

          // 限制拖拽范围，允许向左和向上拖出一部分
          top = Math.max(-quoteHeight + 50, Math.min(stackHeight - 50, top));
          left = Math.max(-quoteWidth + 50, Math.min(stackWidth - 50, left));

          $quote.css({ top: top + 'px', left: left + 'px' });
      });

      $(window).on('mouseup.qpdrag-reply', function(e){
          //if (!dragging) return;
          if (!$quote.data('dragging')) return;  // ← 从 data 读取
          e.preventDefault();    // ← 添加（但注意这里没有 e 参数）
          //dragging = false;
          $quote.data('dragging', false);  // ← 使用 data 存储
          $quote.removeClass('is-dragging');
      });
    }

    // REPLY 按钮
    dockerDom.find('[data-type="REPLY"]').on('click', () => {
      let formEl = document.querySelector('form[action="/Home/Forum/doReplyThread.html"]');
      let previewEl = document.querySelector('.h-preview-box');

      // 如果串内没找到表单，尝试板块页发串表单
      if (!formEl) {
          const postForm = document.querySelector('#h-post-form form[action="/Home/Forum/doPostThread.html"]');
          if (postForm) {
              formEl = postForm;
              previewEl = document.querySelector('#h-post-form .h-preview-box');
          }
      }

      if (!formEl) {
          toast && toast('未找到回复/发串表单');
          return;
      }

      const ov = ensureOverlay();
      const body = ov.querySelector('.qp-body');
      body.innerHTML = '';

      // 占位符
      if (!formEl.__placeholder) {
          const ph1 = document.createElement('div');
          ph1.style.display = 'none';
          formEl.parentNode.insertBefore(ph1, formEl);
          formEl.__placeholder = ph1;
      }
      if (previewEl && !previewEl.__placeholder) {
          const ph2 = document.createElement('div');
          ph2.style.display = 'none';
          previewEl.parentNode.insertBefore(ph2, previewEl);
          previewEl.__placeholder = ph2;
      }

      // 如果表单是折叠状态，展开它（不影响原位置的占位符）
      if ($(formEl).data('xdex-collapsed')) {
          formEl.__wasCollapsed = true; // ★ 记录原本是折叠的
          $(formEl).show().removeData('xdex-collapsed');
      }
      // === 新增：给表单打标记，避免被板块页展开逻辑误处理 ===
      formEl.classList.add('qp-reply-form');

      // 包装容器，防止 UI 松散
      const wrap = document.createElement('div');
      wrap.className = 'qp-content-wrap';

      // 表单是必需的
      wrap.appendChild(formEl);

      // 预览框是可选的
      if (previewEl) {
        wrap.appendChild(previewEl);
        // 浮窗内：强制预览框及其 replies 拉满宽度，清理站点样式的限宽/居中
        if (previewEl) {
          // 预览框本身满宽
          previewEl.style.width = '100%';
          previewEl.style.maxWidth = 'none';
          previewEl.style.margin = '0';

          // replies 拉满
          const replies = previewEl.querySelectorAll('.h-threads-item-replies');
          replies.forEach(el => {
            el.style.width = '100%';
            el.style.maxWidth = 'none';
            el.style.margin = '0';
            el.style.display = 'block';
            el.style.boxSizing = 'border-box';
          });

          // 如有外层 item/容器被限宽，一并放开
          const items = previewEl.querySelectorAll('.h-threads-item');
          items.forEach(el => {
            el.style.width = '100%';
            el.style.maxWidth = 'none';
            el.style.margin = '0';
            el.style.boxSizing = 'border-box';
          });
        }
      }

      body.appendChild(wrap);
      // 浮窗内立即处理扩展引用，保证可点击引用弹窗
      if (typeof extendQuote === 'function') {
        extendQuote(previewEl || wrap);
      }
      if (typeof initExtendedContent === 'function') {
        try { initExtendedContent(root); } catch (e) { try { initExtendedContent(); } catch (e) {} }
      }

      if (typeof initContent === 'function') {
        try { initContent(root); } catch (e) { try { initContent(document); } catch (e) {} }
      }

      // if (typeof autoHideRefView === 'function') {
      //   try { autoHideRefView(root); } catch (e) { try { autoHideRefView(); } catch (e) {} }
      // }

      // 保存引用
      ov.__formEl = formEl;
      ov.__previewEl = previewEl;

      // 显示 overlay
      ov.style.display = 'block';

      // 初始化时检查是否需要调整浮窗宽度（确保不超出当前浏览器宽度）
      const currentResponsiveWidth = Math.max(400, Math.min(window.innerWidth * 0.9, 820));
      const stackElement = ov.querySelector('.qp-stack');
      const currentWidth = stackElement.getBoundingClientRect().width;
      if (currentWidth > currentResponsiveWidth) {
        stackElement.style.width = currentResponsiveWidth + 'px';
      }

      // // 恢复之前保存的尺寸（需要在 ResizeObserver 创建之前恢复）
      // const stackForRestore = ov.querySelector('.qp-stack');
      // const restoredTa = ov.querySelector('textarea[name="content"]');

      // // 先恢复 textarea 的尺寸
      // if (ov.__savedTextareaWidth && restoredTa) {
      //   restoredTa.style.width = ov.__savedTextareaWidth;
      //   restoredTa.style.minWidth = ov.__savedTextareaWidth; // 确保不会被缩小
      // }
      // if (ov.__savedTextareaHeight && restoredTa) {
      //   restoredTa.style.height = ov.__savedTextareaHeight;
      // }

      // // 再恢复 stack 的宽度
      // if (ov.__savedStackWidth && stackForRestore) {
      //   stackForRestore.style.width = ov.__savedStackWidth;
      // }
      // 显示归位按钮
      const resetBtn = ov.querySelector('.qp-reset-btn');
      if (resetBtn) resetBtn.style.display = 'block';

      // 启用拖拽功能
      const $quote = $(ov.querySelector('.qp-quote'));
      const $handles = $quote.find('.qp-drag-edge');
      enableDragForReply($quote, $handles);

      const ta = ov.querySelector('textarea[name="content"]');
      // ---------- BEGIN 插入（替换旧的 ResizeObserver 逻辑） ----------
      if (ta) {
        // 先恢复之前保存的尺寸，再设置其他属性
        if (ov.__savedTextareaWidth) {
          ta.style.width = ov.__savedTextareaWidth;
        }
        if (ov.__savedTextareaHeight) {
          ta.style.height = ov.__savedTextareaHeight;
        }

        ta.style.resize = 'both';
        ta.style.fontSize = '14px';
        // 不设置 maxWidth，让它自由调整
      }
      // 监听 textarea 调整大小的开始和结束
      if (ta) {
        ta.addEventListener('mousedown', function(e) {
          // 检测是否点击在右下角调整区域（通常是最后 15px 范围）
          const rect = ta.getBoundingClientRect();
          const offsetX = e.clientX - rect.left;
          const offsetY = e.clientY - rect.top;
          const isResizeCorner = (offsetX > rect.width - 15) && (offsetY > rect.height - 15);
          const isResizeRight = offsetX > rect.width - 15;
          const isResizeBottom = offsetY > rect.height - 15;

          if (isResizeCorner || isResizeRight || isResizeBottom) {
            ov.__isResizing = true;

            // 监听鼠标释放，标记调整结束
            const onMouseUp = function() {
              // 延迟一点清除标记，避免释放瞬间的点击事件触发关闭
              setTimeout(() => {
                ov.__isResizing = false;
              }, 100);
              document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mouseup', onMouseUp);
          }
        });
      }
      const stack = ov.querySelector('.qp-stack');
      const quote = ov.querySelector('.qp-quote');

      // 绝对最小宽度（不能再小）
      const ABSOLUTE_MIN_WIDTH = 400;

      // 动态计算当前应有的宽度（视口90%，但不小于400px，不大于820px）
      function getResponsiveWidth() {
        return Math.max(ABSOLUTE_MIN_WIDTH, Math.min(window.innerWidth * 0.9, 820));
      }

      // 初始化时记录用户可能扩展到的最大宽度
      // 如果有保存的宽度，使用保存的；否则使用响应式宽度
      let userMaxWidth = ov.__savedStackWidth ? parseFloat(ov.__savedStackWidth) : getResponsiveWidth();

      // 定义安全边距（textarea 与浮窗边框之间的最小距离）
      const SAFE_MARGIN = 30;

      const ro = new ResizeObserver(entries => {
        for (const entry of entries) {
          const taRect = ta.getBoundingClientRect();
          const taWidth = Math.round(taRect.width);
          const stackRect = stack.getBoundingClientRect();

          // 获取 quote 的 padding
          const quoteStyle = window.getComputedStyle(quote);
          const quotePaddingLeft = parseFloat(quoteStyle.paddingLeft);
          const quotePaddingRight = parseFloat(quoteStyle.paddingRight);

          // 计算 textarea 左边距（相对于 quote）
          const quoteRect = quote.getBoundingClientRect();
          const taLeftOffset = taRect.left - quoteRect.left - quotePaddingLeft;

          // 计算 textarea 右边界（相对于 quote 左边界）
          const taRightEdge = taLeftOffset + taWidth;

          // 计算 quote 的内部可用宽度
          const quoteInnerWidth = quoteRect.width - quotePaddingLeft - quotePaddingRight;

          // 获取视口宽度和当前响应式宽度
          const maxAllowedWidth = window.innerWidth;
          const responsiveWidth = getResponsiveWidth();

          // 如果 textarea 右边界超过了安全区域，需要扩展 stack
          const safeRightBound = quoteInnerWidth - SAFE_MARGIN - 20;

          if (taRightEdge > safeRightBound) {
            // 计算需要的新 stack 宽度
            const neededQuoteWidth = taLeftOffset + taWidth + SAFE_MARGIN + 20 + quotePaddingLeft + quotePaddingRight;

            // 限制不超过视口宽度
            const finalWidth = Math.min(neededQuoteWidth, maxAllowedWidth);
            stack.style.width = finalWidth + 'px';
            quote.style.width = '100%';

            // 更新用户扩展到的最大宽度
            userMaxWidth = Math.max(finalWidth, userMaxWidth);

            // 如果达到最大宽度，限制 textarea 不能继续变宽
            if (finalWidth >= maxAllowedWidth) {
              const maxTaWidth = maxAllowedWidth - taLeftOffset - SAFE_MARGIN - 20 - quotePaddingLeft - quotePaddingRight;
              ta.style.maxWidth = Math.max(maxTaWidth, 200) + 'px';
            } else {
              ta.style.maxWidth = 'none';
            }
          }
          // 如果 textarea 缩小了，也缩小 stack
          else {
            // 计算当前实际需要的宽度
            const neededQuoteWidth = taLeftOffset + taWidth + SAFE_MARGIN + 20 + quotePaddingLeft + quotePaddingRight;
            const currentStackWidth = stackRect.width;

            // 只有当需要的宽度明显小于当前宽度时才缩小
            if (neededQuoteWidth < currentStackWidth - 10) {
              // 使用响应式宽度作为下限
              const finalWidth = Math.max(neededQuoteWidth, responsiveWidth);
              stack.style.width = finalWidth + 'px';
              quote.style.width = '100%';

              // 同步调整 textarea 宽度，使其适应浮窗
              if (finalWidth <= responsiveWidth) {
                const maxTaWidth = finalWidth - taLeftOffset - SAFE_MARGIN - 20 - quotePaddingLeft - quotePaddingRight;
                if (taWidth > maxTaWidth) {
                  ta.style.width = Math.max(maxTaWidth, 200) + 'px';
                }
              }
            }

            // 缩小时也要检查是否需要解除 maxWidth 限制
            if (stackRect.width < maxAllowedWidth) {
              ta.style.maxWidth = 'none';
            }
          }
        }
      });
      if (ta) {
        ro.observe(ta);
        ov.__resizeObserver = ro;
      }

      // 最后恢复 stack 的宽度（在 ResizeObserver 创建之后）
      const stackForRestore = ov.querySelector('.qp-stack');
      if (ov.__savedStackWidth && stackForRestore) {
        stackForRestore.style.width = ov.__savedStackWidth;
        // 监听窗口大小变化，动态调整浮窗和 textarea
      const handleWindowResize = function() {
        const responsiveWidth = getResponsiveWidth(); // 当前浏览器宽度对应的响应式宽度
        const currentStackWidth = stack.getBoundingClientRect().width;

        // 关键：只在浏览器宽度变窄、且当前浮窗宽度超出响应式宽度时，才缩小浮窗
        if (responsiveWidth < currentStackWidth) {
          // 将浮窗宽度设置为响应式宽度（会随浏览器变窄而变窄）
          stack.style.width = responsiveWidth + 'px';

          // 同时调整 textarea，确保不超出新的浮窗宽度
          if (ta) {
            const taRect = ta.getBoundingClientRect();
            const quoteStyle = window.getComputedStyle(quote);
            const quotePaddingLeft = parseFloat(quoteStyle.paddingLeft);
            const quotePaddingRight = parseFloat(quoteStyle.paddingRight);
            const quoteRect = quote.getBoundingClientRect();
            const taLeftOffset = taRect.left - quoteRect.left - quotePaddingLeft;

            const maxTaWidth = responsiveWidth - taLeftOffset - SAFE_MARGIN - 20 - quotePaddingLeft - quotePaddingRight;
            if (taRect.width > maxTaWidth) {
              ta.style.width = Math.max(maxTaWidth, 200) + 'px';
            }
          }
        }
        // 浏览器变宽时不做任何调整（保持用户设置的宽度）
      };

      window.addEventListener('resize', handleWindowResize);
      ov.__windowResizeHandler = handleWindowResize;
      }
      // ---------- END 插入 ----------

      // 聚焦 textarea
      if (ta) {
          ta.focus();
          const val = ta.value;
          ta.value = '';
          ta.value = val;
      }

      // Ctrl+Enter 发送并在成功后关闭浮窗
      if (ta) {
          const form = ta.closest('form');
          if (form && !ta.__qpCtrlEnterBound) {
              ta.__qpCtrlEnterBound = true;

              // 保留：提交成功后关闭浮窗
              document.addEventListener('replySuccess', () => {
                  form.__submitting = false;
                  closeOverlay();
              });

              // 新增：调用抽取的绑定函数
              bindCtrlEnter(ta);
          }
      }
    });

    // 底部按钮：平滑滚动到最底部，不污染 URL
    dockerDom.find('[data-type="BOTTOM"]').on('click', () => {
        $('html, body').animate({ scrollTop: $(document).height() - $(window).height() }, 500);
    });
  }

  /* --------------------------------------------------
   * tag 11. 拦截回复中间页
   * -------------------------------------------------- */
  function interceptReplyForm() {
    // —— 缓存工具（GM_* 优先；localStorage 兜底；返回对象型默认值） ——
    function cacheGet(key, fallback = null) {
      try {
        if (typeof GM_getValue === 'function') {
          const v = GM_getValue(key);
          return v != null ? v : fallback;
        }
        const s = localStorage.getItem(key);
        return s != null ? JSON.parse(s) : fallback;
      } catch (_) {
        return fallback;
      }
    }

    function cacheSet(key, val) {
      try {
        if (typeof GM_setValue === 'function') {
          GM_setValue(key, val);
          return;
        }
        localStorage.setItem(key, JSON.stringify(val));
      } catch (_) {}
    }

    // —— NFKC 候选池 ——
    function getNkfcBase() {
      const CACHE_KEY_NKFC = 'nkfcBase.v2';
      let base = cacheGet(CACHE_KEY_NKFC, {});
      if (Object.keys(base).length > 0) return base;

      base = {};
      for (let i = 0; i <= 0xFFFF; i++) {
        const ch = String.fromCharCode(i);
        const norm = ch.normalize('NFKC');
        if (ch !== norm) (base[norm] ||= []).push(ch);
      }
      cacheSet(CACHE_KEY_NKFC, base);
      return base;
    }

    // —— 单字符替换 ——
    // —— 颜文字中常见的汉字与英文，替换时排除（可保留或按需维护） ——
    const KAOMOJI_EXCLUDE_CHARS = new Set([
      '旦','开','摆','摔','低','好','钩','我','咬','接','龙','大','成','功',
      '举','高','糕','咩','吁','肥','喵','酱','狗','比','汪','哈','電','柱',
    ]);

    // —— 单字符替换（回归稳定候选：优先第一个），但保留缓存为数组以便未来扩展 ——
    function maskChar(ch, skipAscii = true) {
      const CACHE_KEY_CHARMAP = 'unvcodeCharMap.v3';
      const charMap = cacheGet(CACHE_KEY_CHARMAP, {});

      if (charMap.hasOwnProperty(ch)) {
        const cached = charMap[ch];
        if (Array.isArray(cached) && cached.length > 0) {
          return cached[0]; // 稳定使用首选候选，旧版风格
        } else if (typeof cached === 'string') {
          return cached;
        }
      }

      if (skipAscii && ch.charCodeAt(0) < 128) {
        charMap[ch] = [ch];
        cacheSet(CACHE_KEY_CHARMAP, charMap);
        return ch;
      }

      const base = getNkfcBase();
      const norm = ch.normalize('NFKC');
      const candidates = base[norm] || [];
      const mapped = candidates.length > 0 ? candidates[0] : ch;

      charMap[ch] = [mapped];
      cacheSet(CACHE_KEY_CHARMAP, charMap);
      return mapped;
    }

    // —— 逐字替换（委托 maskChar） ——
    function unvcode(text, skipAscii = true) {
      let out = '';
      for (const ch of text) out += maskChar(ch, skipAscii);
      return out;
    }

    // —— 保留你之前的选择性规则：URL 整段跳过；非 URL 部分中文 → unvcode；英文 → 原样 + U+200B；其他原样 ——
    function unvcodeSelective(text) {
      const urlRegex = /\b((https?|ftp):\/\/[^\s]+|www\.[^\s]+|[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s]*)?)/gi;
      const hanRegex = /[\u4E00-\u9FFF]/;
      const engRegex = /[A-Za-z]/;

      return text
        .split(/(\b(?:https?|ftp):\/\/[^\s]+|www\.[^\s]+|[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s]*)?)/gi)
        .map(part => {
          if (!part) return '';

          // URL 整段跳过
          if (urlRegex.test(part)) {
            urlRegex.lastIndex = 0;
            return part;
          }

          // 非 URL：按规则处理
          let out = '';
          for (const ch of part) {
            if (hanRegex.test(ch) && !KAOMOJI_EXCLUDE_CHARS.has(ch)) {
              out += unvcode(ch, false); // 中文 → unvcode
            } else if (engRegex.test(ch) && !KAOMOJI_EXCLUDE_CHARS.has(ch)) {
              out += ch + '\u200B';     // 英文 → 原样 + U+200B
            } else {
              out += ch;                // 其他 → 原样
            }
          }
          return out;
        })
        .join('');
    }
    // —— 根据当前失败文本，精准刷新需处理字符的缓存 ——
    // 仅刷新：非 URL 段中的中文与英文，且不在排除集合中的字符
    function resetCacheForFailedContent(text) {
      const urlRegex = /\b((https?|ftp):\/\/[^\s]+|www\.[^\s]+|[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s]*)?)/gi;
      const hanRegex = /[\u4E00-\u9FFF]/;
      const engRegex = /[A-Za-z]/;

      const CACHE_KEY_CHARMAP = 'unvcodeCharMap.v3';
      const charMap = cacheGet(CACHE_KEY_CHARMAP, {});

      const parts = text.split(/(\b(?:https?|ftp):\/\/[^\s]+|www\.[^\s]+|[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s]*)?)/gi);
      let changed = false;

      for (const part of parts) {
        if (!part) continue;

        // 跳过 URL 段
        if (urlRegex.test(part)) {
          urlRegex.lastIndex = 0;
          continue;
        }

        // 非 URL 段：逐字检查
        for (const ch of part) {
          const isHan = /[\u4E00-\u9FFF]/.test(ch);
          const isEng = /[A-Za-z]/.test(ch);
          if (!isHan && !isEng) continue;
          if (KAOMOJI_EXCLUDE_CHARS.has(ch)) continue;

          // 清空该字符的缓存（使下次重新生成替换）
          if (charMap[ch]) {
            delete charMap[ch];
            changed = true;
          }
        }
      }

      if (changed) cacheSet(CACHE_KEY_CHARMAP, charMap);
    }
    // —— 备用方案：仅在中文后插入零宽空格 ——
    function fallbackInsertZWSP(text) {
      const urlRegex = /\b((https?|ftp):\/\/[^\s]+|www\.[^\s]+|[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s]*)?)/gi;
      const hanRegex = /[\u4E00-\u9FFF]/;

      return text
        .split(/(\b(?:https?|ftp):\/\/[^\s]+|www\.[^\s]+|[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s]*)?)/gi)
        .map(part => {
          if (!part) return '';
          if (urlRegex.test(part)) {
            urlRegex.lastIndex = 0;
            return part; // URL 段跳过
          }

          let out = '';
          for (const ch of part) {
            if (hanRegex.test(ch) && !KAOMOJI_EXCLUDE_CHARS.has(ch)) {
              out += ch + '\u200B'; // 汉字后插入零宽空格
            } else {
              out += ch;
            }
          }
          return out;
        })
        .join('');
    }
    // 提取所有 URL 范围
    function findUrlRanges(text) {
      const re = /\b(?:(?:https?|ftp):\/\/[^\s]+|www\.[^\s]+|[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s]*)?)/gi;
      const ranges = [];
      for (const m of text.matchAll(re)) {
        ranges.push({ start: m.index, end: m.index + m[0].length });
      }
      return ranges;
    }

    // 判断位置是否在任何 URL 范围内
    function inAnyRange(pos, ranges) {
      for (const r of ranges) {
        if (pos >= r.start && pos < r.end) return true;
      }
      return false;
    }
    // done 可选unvcode模式或者零宽空格模式，目前来看unvcode模式下长文本中被替换的文字较多，观感受影响，只要没有复制需求，零宽空格更实用
    // 第三次保底：对所有非 URL 段内的汉字插入 U+200B（不使用排除集合）
    function fallbackInsertZWSP(text) {
      const hanRegex = /[\u4E00-\u9FFF]/;
      const urlRanges = findUrlRanges(text);

      let out = '';
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (inAnyRange(i, urlRanges)) {
          out += ch; // URL 段内不处理
        } else {
          if (hanRegex.test(ch)) {
            out += ch + '\u200B'; // 非 URL 段内所有汉字后插入零宽空格
          } else {
            out += ch;
          }
        }
      }
      return out;
    }
    // —— 表单提交拦截 ——
    document.addEventListener('submit', function (e) {
      const form = e.target;
      const isReply = form.matches('form[action="/Home/Forum/doReplyThread.html"]');
      const isPost = form.matches('form[action="/Home/Forum/doPostThread.html"]');
      if (!isReply && !isPost) return;

      e.preventDefault();

      const formData = new FormData(form);
      // 文字内容
      let content = (formData.get('content') || '').toString().trim();

      // 新增：如果内容只有 "0"，就在后面加一个零宽空格
      if (content === '0') {
        content = '0\u200B'; // 在 0 后追加零宽空格
        formData.set('content', content);
        const textarea = form.querySelector('textarea[name="content"]');
        if (textarea) textarea.value = content;
      }
      if (!content) {
        // 检查是否选择了图片（支持 name="image"）
        const fileInput = form.querySelector('input[type="file"][name="image"]');
        const hasImage = !!(fileInput && fileInput.files && fileInput.files.length > 0);

        if (hasImage || content === '0') {
          //无文字但有图片，或者内容只有 "0" → 自动补零宽空格，并同步到 FormData 与 DOM
          //修改以自定义。
          //content = '分享图片';//默认占位文字
          //content = '‎';//空格占位符 U+200E
          //content = '　';//全角空格占位符 U+3000
          content = '​'; // 零宽空格占位符 U+200B
          formData.set('content', content);
          const textarea = form.querySelector('textarea[name="content"]');
          if (textarea) textarea.value = content;
        } else {
          toast(isReply ? '回复内容不能为空' : '发串内容不能为空');
          return;
        }
      }

      function doSubmit(fd) {
        fetch(form.action, {
          method: form.method,
          body: fd,
          credentials: 'include'
        })
        .then(res => res.text())
        .then(html => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const successMsg = doc.querySelector('p.success');
          const errorMsg   = doc.querySelector('p.error');

          if (successMsg) {
            toast(successMsg.textContent.trim() || (isReply ? '回复成功' : '发串成功'));

            // 清空输入框
            const textarea = form.querySelector('textarea[name="content"]');
            if (textarea) textarea.value = '';
            // 清空图片选择
            const fileInput = form.querySelector('input[type="file"][name="image"]');
            if (fileInput) fileInput.value = '';
            // ★ 清空编辑
            // 先立即删除（兜底清理，避免监听未注册导致残留）
            deleteDraftSafe(getDraftKey());
            // **清空标题、名称、Email**
            const titleInput = form.querySelector('input[name="title"]');
            if (titleInput) titleInput.value = '';

            const nameInput = form.querySelector('input[name="name"]');
            if (nameInput) nameInput.value = '';

            const emailInput = form.querySelector('input[name="email"]');
            if (emailInput) emailInput.value = '';
            // 再广播事件给增强模块/其他联动
            document.dispatchEvent(new CustomEvent('replySuccess', {
              detail: { key: getDraftKey() }
            }));
            // 重置预览框
            const previewBox = document.querySelector('.h-preview-box');
            if (typeof enableHDImage === 'function') {
              enableHDImage(previewBox);
            }
            if (previewBox) {
              const cur = getCurrentCookie();
              const cookieText = cur ? cur.name : '--';
              // 先放一个占位 ID，等刷新完成后再更新
              previewBox.innerHTML = `
                <div class="h-preview-box">
                  <div class="h-threads-item">
                    <div class="h-threads-item-replies">
                      <div class="h-threads-item-reply">
                        <div class="h-threads-item-reply-main">
                          <div class="h-threads-img-box">
                            <div class="h-threads-img-tool uk-animation-slide-top">
                              <span class="h-threads-img-tool-btn h-threads-img-tool-small uk-button-link"><i class="uk-icon-minus"></i>收起</span>
                              <a href=":javascript:;" class="h-threads-img-tool-btn uk-button-link"><i class="uk-icon-search-plus"></i>查看大图</a>
                              <span class="h-threads-img-tool-btn h-threads-img-tool-left uk-button-link"><i class="uk-icon-reply"></i>向左旋转</span>
                              <span class="h-threads-img-tool-btn h-threads-img-tool-right uk-button-link"><i class="uk-icon-share"></i>向右旋转</span>
                            </div>
                            <a class="h-threads-img-a"><img src="" align="left" border="0" hspace="20" class="h-threads-img"></a>
                          </div>
                          <div class="h-threads-info">
                            <span class="h-threads-info-title"></span>
                            <span class="h-threads-info-email"></span>
                            <span class="h-threads-info-createdat">2077-01-01(四)00:00:01</span>
                            <span class="h-threads-info-uid">ID:${cookieText}</span>
                            <span class="h-threads-info-report-btn">
                              [<a href="/f/值班室" target="_blank">举报</a>]
                            </span>
                            <a href=":javascript:;" class="h-threads-info-id" target="_blank">No.9999999</a>
                          </div>
                          <div class="h-threads-content"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>`;
            }
            if (typeof refreshCookies === 'function') {
              refreshCookies(() => {
                if (typeof updatePreviewCookieId === 'function') {
                  updatePreviewCookieId();
                }
              }, false);
            }
            // if (isReply) {
            //   try {
            //     refreshRepliesWithSeamlessPaging(() => {
            //       try {
            //         reapplyPageEnhancements();

            //         if (window.SeamlessPaging && typeof window.SeamlessPaging.refreshAndMaybeLoadNext === 'function') {
            //           // 延迟一点再检查,避免 DOM 还没稳定
            //           setTimeout(() => {
            //             try {
            //               window.SeamlessPaging.refreshAndMaybeLoadNext();
            //             } catch (err) {
            //               console.warn('SeamlessPaging.refreshAndMaybeLoadNext 执行失败', err);
            //             }
            //           }, 200);
            //         }
            //       } catch (err) {
            //         console.warn('刷新后增强处理失败', err);
            //         // 不向上抛出，避免触发外层的 catch
            //       }
            //     });
            //   } catch (err) {
            //     console.error('refreshRepliesWithSeamlessPaging 调用失败', err);
            //     // 不向上抛出，避免触发外层的 "未知错误"
            //   }
            // } else {
            //   location.reload();
            // }
            if (isReply) {
              try {
                refreshRepliesWithSeamlessPaging(() => {
                  // 刷新完成（翻页逻辑已在内部处理）
                  console.log('回复区刷新完成');
                });
              } catch (err) {
                console.error('refreshRepliesWithSeamlessPaging 调用失败', err);
              }
            } else {
              location.reload();
            }

          } else if (errorMsg) {
            const msg = errorMsg.textContent.trim() || '提交失败';
            const cfg = Object.assign({}, SettingPanel.defaults, GM_getValue(SettingPanel.key, {}));

            if (/含有非法词语/.test(msg)) {
              if (cfg.interceptReplyFormUnvcode) {
                // 新增：优先判断 interceptReplyFormU200B
                if (cfg.interceptReplyFormU200B) {
                  const textarea = form.querySelector('textarea[name="content"]');
                  const currentInput = textarea
                    ? textarea.value
                    : (formData.get('content') || '').toString();
            
                  // 构造安全文本：对所有非 URL 段的中文与英文字符插入 U+200B
                  const urlRegex = /\b((https?|ftp):\/\/[^\s]+|www\.[^\s]+|[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s]*)?)/gi;
                  const hanRegex = /[\u4E00-\u9FFF]/;
                  const engRegex = /[A-Za-z]/;
            
                  const safeText = currentInput
                    .split(/(\b(?:https?|ftp):\/\/[^\s]+|www\.[^\s]+|[a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s]*)?)/gi)
                    .map(part => {
                      if (!part) return '';
                      if (urlRegex.test(part)) {
                        urlRegex.lastIndex = 0;
                        return part; // URL 段跳过
                      }
                      let out = '';
                      for (const ch of part) {
                        if (hanRegex.test(ch) || engRegex.test(ch)) {
                          out += ch + '\u200B'; // 中文或英文 → 插入零宽空格
                        } else {
                          out += ch;
                        }
                      }
                      return out;
                    })
                    .join('');
            
                  const newFD = new FormData(form);
                  newFD.set('content', safeText);
            
                  toast('已尝试插入零宽空格模式并重试提交', 2000);
                  doSubmit(newFD);
                  return;
                } else {
                  // 原有三次重试逻辑
                  const normalRetries = 2;       // 前两次正常替换
                  const fallbackRetryIndex = 2;  // 第三次（索引为2）执行保底
                  const maxRetriesAll = 3;       // 共尝试三次：0、1（正常），2（保底）
            
                  form.__illegalRetryCount = (form.__illegalRetryCount || 0);
            
                  const textarea = form.querySelector('textarea[name="content"]');
                  const currentInput = textarea
                    ? textarea.value
                    : (formData.get('content') || '').toString();
            
                  if (form.__illegalRetryCount === 0) {
                    form.__originalContent = currentInput;
                  }
            
                  if (form.__illegalRetryCount >= maxRetriesAll) {
                    toast('替换后仍提交失败，已恢复原始文本，请手动处理', 3000);
                    if (textarea && form.__originalContent != null) {
                      textarea.value = form.__originalContent;
                    }
                    resetCacheForFailedContent(form.__originalContent);
                    form.__originalContent = null;
                    form.__illegalRetryCount = 0;
                    return;
                  }
            
                  let safeText;
                  if (form.__illegalRetryCount < normalRetries) {
                    safeText = unvcodeSelective(currentInput);
                  } else {
                    safeText = fallbackInsertZWSP(currentInput);
                  }
            
                  const shouldRetry =
                    (form.__illegalRetryCount < normalRetries && safeText !== currentInput)
                    || (form.__illegalRetryCount === fallbackRetryIndex);
            
                  if (shouldRetry) {
                    toast('已尝试unvcode替换模式并重试提交', 2000);
                    const newFD = new FormData(form);
                    newFD.set('content', safeText);
                    form.__illegalRetryCount++;
                    doSubmit(newFD);
                    return;
                  }
            
                  toast(msg);
                }
              } else {
                toast(msg);
              }
            }            
          }

        })
        .catch(() => toast('未知错误'));
      }
      // 每次用户触发的新提交，重置重试计数并记录当前原始内容
      form.__illegalRetryCount = 0;
      const textarea = form.querySelector('textarea[name="content"]');
      form.__originalContent = textarea
        ? textarea.value
        : (formData.get('content') || '').toString();
      doSubmit(formData);
    }, true);

    // ————— helpers —————
    function getRealThreadsList(root = document) {
      const lists = Array.from(root.querySelectorAll('.h-threads-list'));
      return lists.find(el => !el.closest('.h-preview-box')) || null;
    }

    function getCurrentPage() {
      const sp = new URL(location.href, location.origin).searchParams;
      return parseInt(sp.get('page') || '1', 10);
    }

    function getMaxPageFromPagination() {
      const paginations = Array.from(document.querySelectorAll('.uk-pagination.uk-pagination-left.h-pagination'));
      if (!paginations.length) return null;
      const last = paginations[paginations.length - 1];
      let max = 1;
      last.querySelectorAll('a[href*="page="]').forEach(a => {
        const m = a.href.match(/[?&]page=(\d+)/);
        if (m) max = Math.max(max, parseInt(m[1], 10));
      });
      last.querySelectorAll('li, span').forEach(el => {
        const nums = (el.textContent || '').match(/\d+/g);
        if (nums) nums.forEach(n => max = Math.max(max, parseInt(n, 10)));
      });
      return max || null;
    }

    function getMaxClonedPageInDOM() {
      const nodes = document.querySelectorAll('.h-threads-item-replies[data-cloned-page]');
      let max = 0;
      nodes.forEach(el => {
        const n = parseInt(el.getAttribute('data-cloned-page'), 10);
        if (!isNaN(n)) max = Math.max(max, n);
      });
      return max;
    }

    function minimalHideEmptyTitleAndEmail(root) {
      if (!root || !root.querySelectorAll) return;
      Array.from(root.querySelectorAll('.h-threads-info-title')).forEach(el => {
        const txt = (el.textContent || '').trim();
        if (!txt || txt === '无标题' || /^无标题/i.test(txt)) {
          el.style.display = 'none';
        }
      });
      Array.from(root.querySelectorAll('.h-threads-info-email')).forEach(el => {
        const txt = (el.textContent || '').trim();
        if (!txt || txt === '无名氏' || /^无名氏/i.test(txt)) {
          el.style.display = 'none';
        }
      });
    }

    // done 将拦截中间页-局部刷新修改为增量模式
    function refreshRepliesWithSeamlessPaging(done) {
      const currentPage = getCurrentPage();
      const maxPage = getMaxPageFromPagination();
      const maxCloned = getMaxClonedPageInDOM();
      let targetPage = null;

      if ((maxPage && maxCloned === maxPage && maxCloned > 0) || (!maxPage && maxCloned > 0)) {
        targetPage = maxCloned;
      } else if (maxPage && currentPage === maxPage && maxCloned === 0) {
        targetPage = null;
      } else {
        if (typeof done === 'function') done();
        return;
      }

      const list = getRealThreadsList(document);
      if (!list) {
        toast('未找到真实列表，无法刷新回复区');
        if (typeof done === 'function') done();
        return;
      }

      const targetReplies = targetPage
        ? list.querySelector(`.h-threads-item-replies[data-cloned-page="${targetPage}"]`)
        : list.querySelector('.h-threads-item-replies:not([data-cloned-page])');

      if (!targetReplies) {
        toast('未找到目标回复区');
        if (typeof done === 'function') done();
        return;
      }

      let fetchUrl;
      if (targetPage) {
        const url = new URL(location.href, location.origin);
        url.searchParams.set('page', String(targetPage));
        fetchUrl = url.toString();
      } else {
        fetchUrl = location.href;
      }

      fetch(fetchUrl, { credentials: 'include' })
        .then(res => res.text())
        .then(html => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const newList = getRealThreadsList(doc);
          if (!newList) {
            toast('未找到最新列表');
            if (typeof done === 'function') done();
            return;
          }
          const newReplies = newList.querySelector('.h-threads-item-replies');
          if (!newReplies) {
            toast('未找到最新回复区');
            if (typeof done === 'function') done();
            return;
          }

          // ——— 离线处理（关键） ———
          const cfg2 = (typeof safeGetConfig === 'function') ? safeGetConfig() : null;

          // 先准备一个离线 fragment（仅作为工作台，不再整体套用 innerHTML）
          const fragment = document.createElement('div');
          fragment.innerHTML = newReplies.innerHTML;

          // 排除系统提示类回复（tips）
          Array.from(fragment.querySelectorAll('.h-threads-item-reply[data-threads-id="9999999"]'))
            .forEach(el => el.remove());

          // 离线预处理：对 fragment 做一次过滤（主要保证新增项的 DOM 是处理过的）
          try {
            if (typeof hideEmptyTitleAndEmail === 'function') hideEmptyTitleAndEmail($(fragment));
            if (cfg2 && typeof applyFilters === 'function') applyFilters(cfg2, fragment);
          } catch (e) {
            console.warn('预处理过滤失败', e);
          }

          // === 改为增量新增：比较新旧回复差异，只添加缺失部分，避免覆盖 h-active ===

          // 1) 收集当前目标区原有的回复 ID（排除系统提示）
          const oldItems = Array.from(targetReplies.querySelectorAll('.h-threads-item-reply[data-threads-id]'));
          const oldIdSet = new Set(
            oldItems
              .map(i => i.getAttribute('data-threads-id'))
              .filter(id => id && id !== '9999999')
          );

          // 2) 收集新页面的回复项（使用 newReplies，而非 fragment，以维持服务器顺序）
          const newItems = Array.from(newReplies.querySelectorAll('.h-threads-item-reply[data-threads-id]'))
            .filter(i => i.getAttribute('data-threads-id') !== '9999999');

          // 3) 逐项比较，把新页面中不存在于旧页面的项依顺序追加（保持服务器顺序）
          const appendedNodes = [];
          for (const item of newItems) {
            const tid = item.getAttribute('data-threads-id');
            if (!oldIdSet.has(tid)) {
              // 新增回复项：克隆并追加到 targetReplies 末尾
              const node = item.cloneNode(true);
              targetReplies.appendChild(node);
              appendedNodes.push(node);
            }
          }

          // 4) 针对“新增的节点”做精细化处理，避免全局覆盖旧节点状态
          try {
            // 立即处理新增节点，降低闪烁
            if (typeof hideEmptyTitleAndEmail === 'function') {
              appendedNodes.forEach(n => { try { hideEmptyTitleAndEmail($(n)); } catch (_) {} });
            }
            if (cfg2 && typeof applyFilters === 'function') {
              appendedNodes.forEach(n => { try { applyFilters(cfg2, n); } catch (_) {} });
            }
            if (typeof enablePostExpand === 'function') {
              appendedNodes.forEach(n => { try { enablePostExpand(); } catch (_) {} }); // 若该函数无 root 参数，则保持原用法
            }
          } catch (e) {
            // 局部处理不影响整体流程
          }

          // 延迟执行其他增强
          setTimeout(() => {
            try { if (typeof hideEmptyTitleAndEmail === 'function') hideEmptyTitleAndEmail($(targetReplies)); } catch (e) {}
            try { if (typeof highlightPO === 'function') highlightPO(); } catch (e) {}
            //try { if (cfg2 && cfg2.enableHDImageAndLayoutFix && typeof enableHDImageAndLayoutFix === 'function') enableHDImageAndLayoutFix(targetReplies); } catch (e) {}
            enableHDImageAndLayoutFix(document);
            enableHDImage(document);
            try { if (cfg2 && cfg2.enableLinkBlank && typeof runLinkBlank === 'function') runLinkBlank(targetReplies); } catch (e) {}
            try { if (cfg2 && cfg2.extendQuote && typeof extendQuote === 'function') extendQuote(targetReplies); } catch (e) {}
            try { if (cfg2 && cfg2.enableQuotePreview && typeof enableQuotePreview === 'function') enableQuotePreview(); } catch (e) {}
            try { if (typeof applyFilters === 'function') applyFilters(cfg2); } catch (e) {}
            try { if (typeof initContent === 'function') initContent(); } catch (e) {}
            try { if (typeof initExtendedContent === 'function') initExtendedContent(targetReplies); } catch (e) {}
            //try { if (typeof autoHideRefView === 'function') autoHideRefView(targetReplies); } catch (e) {}
            try { if (typeof enablePostExpand === 'function') enablePostExpand(); } catch (e) {}
            // // 立即调用一次
            // if (typeof preventContentOverflow === 'function') {
            //   try {
            //     preventContentOverflow(document);
            //   } catch (e) {
            //     console.warn('preventContentOverflow immediate call error:', e);
            //   }
            // }
          }, 50);

          // 同步更新底部分页栏
          const newPags = doc.querySelectorAll('ul.uk-pagination.uk-pagination-left.h-pagination');
          const newPag = newPags.length ? newPags[newPags.length - 1] : null;
          const oldPags = document.querySelectorAll('ul.uk-pagination.uk-pagination-left.h-pagination');
          const oldPag = oldPags.length ? oldPags[oldPags.length - 1] : null;

          if (newPag && oldPag) {
            // 1. 判断发送前是否为最后一页（下一页按钮是 uk-disabled 且无链接）
            const oldNextLi = Array.from(oldPag.querySelectorAll('li')).find(li =>
              /下一页|下页|Next|›|»|→/i.test(li.textContent.trim())
            );
            const wasLastPage = oldNextLi &&
              oldNextLi.classList.contains('uk-disabled') &&
              !oldNextLi.querySelector('a');

            // 替换 DOM
            try {
              oldPag.innerHTML = newPag.innerHTML;
            } catch (e) {
              oldPag.replaceWith(newPag.cloneNode(true));
            }

            // 2. 如果发送前是最后一页，检查刷新后是否出现了新页
            if (wasLastPage) {
              const newNextLi = Array.from(newPag.querySelectorAll('li')).find(li =>
                /下一页|下页|Next|›|»|→/i.test(li.textContent.trim())
              );
              const hasNewPage = newNextLi &&
                !newNextLi.classList.contains('uk-disabled') &&
                !!newNextLi.querySelector('a');

              if (hasNewPage) {
                // 提取新页码
                const nextLink = newNextLi.querySelector('a');
                const nextPageMatch = nextLink ? nextLink.href.match(/page=(\d+)/) : null;
                const nextPageNum = nextPageMatch ? parseInt(nextPageMatch[1], 10) : null;

                if (nextPageNum) {
                  toast(`发现${nextPageNum}页，正在加载...`);

                  // 触发无缝翻页
                  if (window.SeamlessPaging && typeof window.SeamlessPaging.loadNext === 'function') {
                    setTimeout(() => {
                      window.SeamlessPaging.loadNext();
                    }, 100);
                  }
                }
              }
            }
          }

          // 4) 如果某些 filter 只能作用于 document（没有 root 参数），此处再做一次全局调用（尽量放到最后）
          try {
            if (cfg2 && typeof applyFilters === 'function') {
              try { applyFilters(cfg2); } catch (e) { /* 忽略 */ }
            }
          } catch (e) {}

          if (typeof done === 'function') done();
        })
        .catch(() => {
          toast('刷新回复区失败');
          if (typeof done === 'function') done();
        });
    }


    function safeGetConfig() {
      try {
        if (typeof SettingPanel !== 'undefined' && typeof GM_getValue === 'function') {
          const defaults = SettingPanel.defaults || {};
          const saved = GM_getValue(SettingPanel.key, {}) || {};
          return Object.assign({}, defaults, saved);
          }
       } catch (e) {}
       return null;
    }
  }

  // 绑定 Ctrl+Enter 快捷提交表单 + 全局打开浮窗
  function bindCtrlEnter(ta) {
    if (!ta || ta.__ctrlEnterBound) return;
    const form = ta.closest('form');
    if (!form) return;

    ta.__ctrlEnterBound = true;

    // 提交锁
    form.addEventListener('submit', function () {
      if (form.__submitting) return;
      form.__submitting = true;
      setTimeout(() => { form.__submitting = false; }, 2000);
    });

    // 焦点在 textarea 内时：Ctrl+Enter 提交，Ctrl+\ 打开 cookie 下拉框
    ta.addEventListener('keydown', function (e) {
      // Ctrl+Enter 提交表单
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === 'function') {
          e.stopImmediatePropagation();
        }
        if (form.__submitting) return;
        form.__submitting = true;
        try { form.requestSubmit(); } catch (_) { form.submit(); }
        setTimeout(() => { form.__submitting = false; }, 5000);
      }

      // Ctrl+\ 打开 cookie 下拉框
      if (e.ctrlKey && e.key === '\\') {
        e.preventDefault();
        e.stopPropagation();
        const dropdown = document.getElementById('cookie-dropdown');
        if (dropdown) {
          dropdown.focus();
          // 使用 showPicker() 方法打开下拉框
          if (typeof dropdown.showPicker === 'function') {
            dropdown.showPicker();
          } else {
            // 降级方案：模拟鼠标按下事件
            const mouseDownEvent = new MouseEvent('mousedown', {
              bubbles: true,
              cancelable: true,
              view: window
            });
            dropdown.dispatchEvent(mouseDownEvent);
          }
        }
      }

      // Ctrl+/ 打开颜文字选择框
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        e.stopPropagation();
        const kaomojiTrigger = document.querySelector('.kaomoji-trigger');
        if (kaomojiTrigger) {
          kaomojiTrigger.click();
        }
      }
    });
    // 全局监听：Ctrl+Enter 打开浮窗
    document.addEventListener('keydown', function (e) {
      // Ctrl + Enter 打开浮窗（已有逻辑）
      if (e.ctrlKey && e.key === 'Enter') {
        const active = document.activeElement;
        const isTextarea = active && active.tagName === 'TEXTAREA';
        if (!isTextarea) {
          e.preventDefault();
          e.stopPropagation();
          const replyBtn = document.querySelector('.hld__docker [data-type="REPLY"]');
          if (replyBtn) replyBtn.click();
        }
      }
    }, false);

  }

  /* --------------------------------------------------
   * tag 12. 高亮Po主+回复表单UI调整
   * -------------------------------------------------- */
  // 高亮 Po 主（内置并先执行楼层编号）
  function highlightPO() {
    const poTextColor  = '#00FFCC'; // Po 本体颜色
    const iconWidthEm  = 3.0;       // 所有图标统一宽度

    // 子函数：先为当前页面所有回复区编号（原 updateReplyNumbers 逻辑）
    function updateReplyNumbersLocal() {
      document.querySelectorAll('.h-threads-item-replies').forEach(replies => {
        let effectiveCount = 0;
        replies.querySelectorAll('.h-threads-item-reply-icon').forEach(icon => {
          const reply = icon.closest('[data-threads-id]');
          if (!reply) return;

          if (reply.getAttribute('data-threads-id') === '9999999') {
            // 特殊：小提示串号 -> 编号 0
            icon.textContent = circledNumber(0);
          } else {
            // 普通回复 -> 依次递增
            effectiveCount++;
            icon.textContent = `『${effectiveCount}』`;
          }
        });
      });
    }

    // 统一设置所有回复图标的宽度与基础样式
    document.querySelectorAll('.h-threads-item-reply-icon').forEach(icon => {
      icon.style.display = 'inline-block';
      icon.style.width = iconWidthEm + 'em';
      icon.style.textAlign = 'center';
      icon.style.position = 'relative';
      icon.style.fontWeight = 'normal';
    });

    // 先编号，再做 Po 标替换
    updateReplyNumbersLocal();

    // 替换 PO 回复的数字为 Po，并加角标
    document.querySelectorAll('.h-threads-item-reply').forEach(reply => {
      const main = reply.querySelector('.h-threads-item-reply-main');
      const icon = reply.querySelector('.h-threads-item-reply-icon');
      if (!main || !icon) return;

      const isPO = !!main.querySelector('span.uk-text-primary.uk-text-small');
      if (!isPO) return;

      let html = icon.innerHTML;
      const m = html.match(/『(\d+)』/);
      if (!m) return;

      const originalNumber = m[1]; // 原数字
      const poHTML = `『<span style="color:${poTextColor}; font-weight:bold">Po</span>』`;

      // 替换数字为 Po
      html = html.replace(m[0], poHTML);
      icon.innerHTML = html;

      // 角标（避免重复添加）
      if (!icon.querySelector('.po-n-badge')) {
        const badge = document.createElement('span');
        badge.className = 'po-n-badge';
        badge.textContent = originalNumber;
        Object.assign(badge.style, {
          position: 'absolute',
          top: '-0.55em',
          right: '-0.6em',
          fontSize: '10px',
          lineHeight: '1',
          fontWeight: '600',
          color: 'initial',
          background: 'transparent',
          pointerEvents: 'none',
        });
        icon.appendChild(badge);
      }
    });
  }

  // 初次执行
  highlightPO();

  //回复表单UI调整
  function enhancePostFormLayout() {
     const form = document.querySelector('form[action*="doReplyThread"], form[action*="doPostThread"]');

      if (!form) return;

      // 定位“标题”行与“颜文字”行
      const allRows = Array.from(form.querySelectorAll('.h-post-form-grid'));
      let titleRow = null, emoticonRow = null;

      for (const row of allRows) {
        const titleText = row.querySelector('.h-post-form-title')?.textContent?.trim() || '';
        if (titleText === '标题') titleRow = row;
        if (row.querySelector('.kaomoji-trigger') || row.querySelector('#h-emot-select')) {
          emoticonRow = row;
        }
      }

      // 1) 先把送出按钮移到“颜文字”行，并让整行用 flex 不换行，按钮推到行最右
      if (titleRow && emoticonRow) {
        const sendBtnCell = titleRow.querySelector('.h-post-form-option');
        const sendBtn = sendBtnCell?.querySelector('input[type="submit"]');
        if (sendBtn) {
          // 让“颜文字”整行用 flex 布局，禁止换行，垂直居中
          Object.assign(emoticonRow.style, {
            display: 'flex',
            flexWrap: 'nowrap',
            alignItems: 'center',
            width: '100%'
          });

          // 创建一个右侧容器，使用 margin-left:auto 将其推到最右
          const btnWrapper = document.createElement('div');
          Object.assign(btnWrapper.style, {
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center'
          });
          btnWrapper.appendChild(sendBtn);

          // 将按钮容器添加到“颜文字”行
          emoticonRow.appendChild(btnWrapper);
        }
      }

      // 2) 折叠「回应模式 / 名 称 / E-mail / 标题」四行为一个折叠面板
      // 重新抓一次，避免移动节点导致 NodeList 顺序问题
      const freshRows = Array.from(form.querySelectorAll('.h-post-form-grid'));
      const targets = new Set(['名 称', 'E-mail', '标题']);
      const rowsToCollapse = [];

      for (const row of freshRows) {
        const label = row.querySelector('.h-post-form-title')?.textContent?.trim() || '';
        if (targets.has(label)) rowsToCollapse.push(row);
      }

      if (rowsToCollapse.length) {
        const wrapper = document.createElement('div');
        wrapper.className = 'collapse-wrapper';
        wrapper.style.width = '100%';

        // 将折叠目标打包进容器
        rowsToCollapse[0].before(wrapper);
        rowsToCollapse.forEach(r => wrapper.appendChild(r));

        // 使用现有 collapse 能力（依赖 jQuery）
        if (typeof Utils !== 'undefined' && typeof Utils.collapse === 'function' && typeof $ === 'function') {
          Utils.collapse($(wrapper), '发串选项');
        }
      }
    }


  /* --------------------------------------------------
   * tag 13. 颜文字增强-光标处插入/选择框优化/额外颜文字拓展
   * -------------------------------------------------- */
  function kaomojiEnhancer() {
      // 初始化所有功能
      initInsertAtCaret();      // 功能 1：颜文字插入光标处
      optimizeSelectorStyle();  // 功能 2：选择框样式优化
      extendKaomojiSet();       // 功能 3：颜文字样式拓展

      /**
       * 功能 1：选择颜文字后插入到光标位置
       */
      // BUG:win7与部分win10环境下颜文字插入两次。
      function initInsertAtCaret() {
        const SELECTOR = '#h-emot-select';
        const TA_SELECTOR = 'textarea.h-post-form-textarea[name="content"]';

        document.querySelectorAll(SELECTOR).forEach(select => {
            if (select.dataset.kaoBound === '1') return;
            select.dataset.kaoBound = '1';

            const form = select.closest('form');
            const textarea = form ? form.querySelector(TA_SELECTOR) : null;
            if (!textarea) return;

            let lastStart = 0;
            let lastEnd = 0;

            // 记录光标位置
            const remember = () => {
                lastStart = textarea.selectionStart ?? lastStart;
                lastEnd = textarea.selectionEnd ?? lastEnd;
            };

            ['keyup', 'mouseup', 'select', 'input', 'focus', 'blur'].forEach(ev =>
                textarea.addEventListener(ev, remember, true)
            );

            // 只在 select 上监听 focus 相关事件来记录位置
            ['focus', 'mousedown'].forEach(ev =>
                select.addEventListener(ev, remember, true)
            );

            // 防抖保护
            let isInserting = false;

            // 用 change 事件来触发插入
            select.addEventListener('change', e => {
              e.stopImmediatePropagation();
              e.preventDefault();
              e.stopPropagation();

              if (isInserting) return;

              const val = select.value;
              if (!val) return;

              // ★ 在插入前强制记忆一次光标位置
              remember();

              isInserting = true;
              insertAtCaret(textarea, val, lastStart, lastEnd);

              setTimeout(() => {
                select.value = '';
                isInserting = false;
              }, 50);

              textarea.focus();
            }, true);

            // 移除 change 事件的监听，避免重复触发
            select.addEventListener('change', function(e) {
                e.stopImmediatePropagation();
                e.preventDefault();
                e.stopPropagation();
            }, true);

            function insertAtCaret(textarea, text, selStart, selEnd) {
                // 记录插入前的滚动位置
                const prevScrollTop = textarea.scrollTop;

                // 确定插入位置
                let start = Number.isInteger(selStart) ? selStart : textarea.selectionStart;
                let end   = Number.isInteger(selEnd)   ? selEnd   : textarea.selectionEnd;
                if (!Number.isInteger(start) || !Number.isInteger(end)) {
                    start = end = textarea.value.length;
                }

                // 拼接新内容
                const before = textarea.value.slice(0, start);
                const after  = textarea.value.slice(end);
                textarea.value = before + text + after;

                // 插入后的光标位置
                const newPos = start + text.length;

                // 关键：重新 focus 并设置光标位置
                textarea.focus();
                textarea.setSelectionRange(newPos, newPos);

                // 延迟触发 input 事件，避免与原生逻辑冲突
                setTimeout(() => {
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                }, 0);

                // 恢复滚动条位置
                textarea.scrollTop = prevScrollTop;

                // 更新记忆位置
                lastStart = lastEnd = newPos;
            }
        });
    }

      /**
       * 功能 2：颜文字选择框样式优化（占位）
       */
      function optimizeSelectorStyle() {
        const SELECTOR = '#h-emot-select';
        const GAP = 4;               // 单元格间距（缩小）
        const CHAR_W = 14;           // 每个字宽度（px）
        const CHAR_H = 16;           // 每个字高度（px）
        const PAD = 6;               // 浮窗内边距（缩小）
        const ITEM_W = CHAR_W * 6 + 6; // 大约半个长颜文字宽度
        const ITEM_H = CHAR_H * 2 + 4; // 不超过两行字高

        const selects = document.querySelectorAll(SELECTOR);
        if (!selects.length) return;

        // 注入样式（只注入一次）
        if (!document.getElementById('kaomoji-style')) {
            const style = document.createElement('style');
            style.id = 'kaomoji-style';
            style.textContent = `
                .kaomoji-trigger {
                    display: inline-flex;
                    align-items: center;
                    height: 26px;
                    line-height: 26px;
                    padding: 0 8px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    background: #fff;
                    cursor: pointer;
                    white-space: nowrap;
                    user-select: none;
                }
                .kaomoji-panel {
                    position: fixed;
                    z-index: 2147483647;
                    display: none;
                    grid-template-columns: repeat(auto-fill, minmax(${ITEM_W}px, 1fr));
                    gap: ${GAP}px;
                    padding: ${PAD}px;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    background: #fff;
                    box-shadow: 0 6px 16px rgba(0,0,0,0.12);
                    box-sizing: border-box;
                    overflow-y: auto;

                    /* 关键调整 */
                    width: 100%; /* 占满可用宽度 */
                    max-width: calc(100vw - ${PAD * 2}px); /* 不超过视口宽度 */
                    min-width: ${ITEM_W}px; /* 至少一列 */
                    max-height: calc(${ITEM_H}px * 5 + ${GAP}px * 4 + ${PAD}px * 2);
                }
                .kaomoji-item {
                    width: ${ITEM_W}px;
                    height: ${ITEM_H}px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2px;
                    border-radius: 4px;
                    cursor: pointer;
                    user-select: none;
                    text-align: center;
                    font-size: 14px;
                    line-height: 1.2;
                    word-break: break-word;
                }
                .kaomoji-item:hover {
                    background: #f2f2f2;
                }
            `;
            document.head.appendChild(style);
        }

        selects.forEach(select => {
            if (select.dataset.kaoStyled === '1') return;
            select.dataset.kaoStyled = '1';

            select.style.display = 'none';

            const trigger = document.createElement('button');
            trigger.type = 'button';
            trigger.className = 'kaomoji-trigger';
            trigger.textContent = '选择颜文字';

            const panel = document.createElement('div');
            panel.className = 'kaomoji-panel';
            //panel.tabIndex = -1; // 👈 添加：使 panel 可以接收焦点

            const options = Array.from(select.options);
            options.forEach(opt => {
                // 👇 添加：跳过"无"选项
                if (opt.textContent.trim() === '无') return;
                const item = document.createElement('div');
                item.className = 'kaomoji-item';
                item.textContent = opt.textContent;
                item.dataset.value = opt.value;
                item.addEventListener('click', () => {
                    select.value = opt.value;
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                    trigger.textContent = opt.textContent || '选择颜文字';
                    hidePanel();
                });
                panel.appendChild(item);
            });

            select.parentNode.insertBefore(trigger, select.nextSibling);
            document.body.appendChild(panel);

            function positionPanel() {
              const rect = trigger.getBoundingClientRect();

              // 临时给 panel 一个最大宽度，避免 Firefox 只算一列
              panel.style.width = `calc(100vw - ${PAD * 2}px)`;
              panel.style.display = 'grid';
              panel.style.visibility = 'hidden';

              const panelRect = panel.getBoundingClientRect();
              const panelW = panelRect.width;
              const panelH = panelRect.height;

              let left = rect.left;
              let top = rect.top - panelH - 6;

              const margin = 6;
              if (left + panelW > window.innerWidth - margin) {
                  left = window.innerWidth - margin - panelW;
              }
              if (left < margin) left = margin;

              if (top < margin) {
                  top = rect.bottom + 6;
              }

              panel.style.left = `${Math.round(left)}px`;
              panel.style.top = `${Math.round(top)}px`;
              panel.style.visibility = '';
          }

          function showPanel() {
            positionPanel();
            panel.style.display = 'grid';
            panel.scrollTop = 0;
            bindGlobalClose();
            initKeyboardNav();
            // 👇 添加：延迟聚焦，确保 DOM 渲染完成
            setTimeout(() => {
                const items = panel.querySelectorAll('.kaomoji-item');
                if (items.length > 0) {
                    items[0].focus();
                }
            }, 0);
          }

          function hidePanel() {
            panel.style.display = 'none';
            unbindGlobalClose();
            removeKeyboardNav();
          }
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                if (panel.style.display === 'none' || panel.style.display === '') {
                    showPanel();
                } else {
                    hidePanel();
                }
            });

          let outsideHandler, escHandler;
          function bindGlobalClose() {
              outsideHandler = (e) => {
                  // 捕获阶段执行，防止被其他脚本阻止
                  const target = e.target;
                  if (!panel.contains(target) && target !== trigger) {
                      hidePanel();
                  }
              };

              escHandler = (e) => {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    hidePanel();
                }
            };

              // 用捕获阶段监听 click 和 mousedown
              document.addEventListener('click', outsideHandler, true);
              document.addEventListener('mousedown', outsideHandler, true);
              window.addEventListener('keydown', escHandler);
          }
          function unbindGlobalClose() {
            document.removeEventListener('click', outsideHandler, true);
            document.removeEventListener('mousedown', outsideHandler, true);
            window.removeEventListener('keydown', escHandler);
          }

          let currentIndex = -1;
          let keyboardHandler;
          //let highlightedItems = new Set();

          function initKeyboardNav() {
            const items = Array.from(panel.querySelectorAll('.kaomoji-item'));
            if (!items.length) return;

            // 清除所有颜文字的样式
            items.forEach(item => {
              item.style.removeProperty('background');
              item.style.removeProperty('outline');
            });

            currentIndex = 0;
            items[currentIndex].style.background = '#e0e0e0';
            items[currentIndex].style.outline = '2px solid #66ccff';
            items[currentIndex].focus();

            keyboardHandler = (e) => {
                // 如果面板不可见，直接返回
                if (panel.style.display === 'none' || panel.style.display === '') {
                  return;
                }
                const items = Array.from(panel.querySelectorAll('.kaomoji-item'));
                if (!items.length) return;

                // const panelWidth = panel.offsetWidth - PAD * 2;
                // const cols = Math.floor(panelWidth / (ITEM_W + GAP));
                // // 使用实际 grid 列数，避免计算误差
                // const gridCols = getComputedStyle(panel).gridTemplateColumns.split(/\s+/).filter(s => s && s !== '').length;
                // const cols = gridCols > 0 ? gridCols : 1;

                // 通过实际位置计算列数
                // let cols = items.length; // 默认只有一行
                // if (items.length > 1) {
                //     const firstTop = items[0].getBoundingClientRect().top;
                //     for (let i = 1; i < items.length; i++) {
                //         if (items[i].getBoundingClientRect().top > firstTop) {
                //             cols = i;
                //             break;
                //         }
                //     }
                // }
                // 通过实际位置计算列数
                let cols = 1; // 默认至少一列
                if (items.length > 1) {
                    const firstLeft = items[0].getBoundingClientRect().left;
                    const firstTop = items[0].getBoundingClientRect().top;
                    
                    // 计算第一行有多少个元素
                    for (let i = 1; i < items.length; i++) {
                        const itemRect = items[i].getBoundingClientRect();
                        // 如果 top 值明显增加（超过半个元素高度），说明换行了
                        if (itemRect.top - firstTop > ITEM_H / 2) {
                            cols = i;
                            break;
                        }
                    }
                    
                    // 如果所有元素都在一行
                    if (cols === 1) {
                        cols = items.length;
                    }
                }
                let newIndex = currentIndex;

                const key = e.key.toLowerCase();

                if (e.key === 'ArrowRight' || key === 'd') {
                    e.preventDefault();
                    newIndex = Math.min(currentIndex + 1, items.length - 1);
                } else if (e.key === 'ArrowLeft' || key === 'a') {
                    e.preventDefault();
                    newIndex = Math.max(currentIndex - 1, 0);
                } else if (e.key === 'ArrowDown' || key === 's') {
                    e.preventDefault();
                    newIndex = Math.min(currentIndex + cols, items.length - 1);
                } else if (e.key === 'ArrowUp' || key === 'w') {
                    e.preventDefault();
                    newIndex = Math.max(currentIndex - cols, 0);
                } else if (e.key === 'Enter' || key === ' ') {
                    e.preventDefault();
                    items[currentIndex].click();
                    return;
                }

                if (newIndex !== currentIndex) {
                  // 👇 清除所有元素的样式，防止残留
                  items.forEach(item => {
                    item.style.removeProperty('background');
                    item.style.removeProperty('outline');
                  });
                
                  currentIndex = newIndex;
                  items[currentIndex].style.background = '#e0e0e0';
                  items[currentIndex].style.outline = '2px solid #66ccff';
                  items[currentIndex].focus();
                
                  items[currentIndex].scrollIntoView({ block: 'nearest', behavior: 'instant' });
                }
            };

            window.addEventListener('keydown', keyboardHandler);
          }

          function removeKeyboardNav() {
            if (keyboardHandler) {
                window.removeEventListener('keydown', keyboardHandler);
                keyboardHandler = null;
            }

            // 清除所有颜文字的高亮样式
            const items = panel.querySelectorAll('.kaomoji-item');
            items.forEach(item => {
                item.style.removeProperty('background');
                item.style.removeProperty('outline');
            });

            currentIndex = -1;
          }
          select.addEventListener('kaomoji:updated', () => {
            // 清空并重建 panel 子项
            while (panel.firstChild) panel.removeChild(panel.firstChild);
            Array.from(select.options).forEach(opt => {
                // 👇 添加：跳过"无"选项
                if (opt.textContent.trim() === '无') return;
                const item = document.createElement('div');
                item.className = 'kaomoji-item';
                item.textContent = opt.textContent;
                item.dataset.value = opt.value;
                item.tabIndex = -1; // 👈 添加：使 item 可以接收焦点
                item.addEventListener('click', () => {
                    select.value = opt.value;
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                    trigger.textContent = opt.textContent || '选择颜文字';
                    panel.style.display = 'none';
                });

              panel.appendChild(item);
            });
        });
      });
    }

      /**
       * 功能 3：颜文字样式拓展（占位）
       */
      function extendKaomojiSet() {
          const SELECTOR = '#h-emot-select';
          const EXTRA_EMOTS = [
              "( ´_ゝ`)旦","(<ゝω・) ☆","(`ε´ (つ*⊂)","=͟͟͞͞( 'ヮ' 三 'ヮ' =͟͟͞͞)","↙(`ヮ´ )↗ 开摆！",
              "(っ˘Д˘)ノ<","(ﾉ#)`д´)σ","₍₍(ง`ᝫ´ )ว⁾","( `ᵂ´)","( *・ω・)✄╰ひ╯","U•ェ•*U","⊂( ﾟωﾟ)つ",
              "( ﾟ∀。)7","･ﾟ( ﾟ∀。) ﾟ。","( `д´)σ","( ﾟᯅ 。)","( ;`д´; )","m9( `д´)","( ﾟπ。)","ᕕ( ﾟ∀。)ᕗ",
              "ฅ(^ω^ฅ)","(|||^ヮ^)","(|||ˇヮˇ)","(　↺ω↺)"," `ー´) `д´) `д´)",
              "₍˄·͈༝·͈˄₎◞","⁽ ˇᐜˇ⁾","⁽ ˆ꒳ˆ⁾","⁽ ^ᐜ^⁾","⁽´°`⁾","⁽´ᵖ`⁾","⁽ ˙³˙⁾","⁽°ᵛ°⁾","⁽ `ᵂ´⁾",
              "(　‸ო‸)"," /̵͇̿̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿","_(:зゝ∠)_","(　ﾟ 灬ﾟ)",
              "接☆龙☆大☆成☆功","ᑭ`д´)ᓀ ∑ᑭ(`ヮ´ )ᑫ","乚 (^ω^ ﾐэ)Э好钩我咬","乚(`ヮ´  ﾐэ)Э","( ﾟ∀。ﾐэ)Э三三三三　乚",
              "(ˇωˇ ﾐэ)Э三三三三　乚","( へ ﾟ∀ﾟ)べ摔低低","(ベ ˇωˇ)べ 摔低低",
          ];
          const EXTRA_RICH = {
              "҉( ﾟ∀。)": "　　҉\n( ﾟ∀。)",
              "齐齐蛤尔": "(`ヮ´ )σ`∀´) ﾟ∀ﾟ)σ",
              "呼伦悲尔": "( ﾉд`ﾟ);´д`) ´_ゝ`)",
              "愕尔多厮": "Σ( ﾟдﾟ)´ﾟДﾟ)　ﾟдﾟ)))",
              "智利": "( ﾟ∀。)∀。)∀。)",
              "阴山山脉": "(　ˇωˇ )◕∀◕｡)^ω^)",
              "mini阴阳酱":"₍˄·͈༝·͈˄₎◞⁽ ˇᐜˇ⁾⁽ ˆ꒳ˆ⁾⁽ ^ᐜ^⁾⁽´°`⁾⁽´ᵖ`⁾⁽ ˙³˙⁾⁽°ᵛ°⁾⁽ `ᵂ´⁾",
              "F5欧拉": "　σ　σ\nσ(　´ρ`)σ[F5]\n　σ　σ",
              "UK酱": "\\ ︵\nᐕ)⁾⁾",
              "白羊": "╭◜◝ ͡ ◜◝ J J\n(　　　　 `д´) 　“咩！”\n╰◟д ◞ ͜ ◟д◞",
              "兔兔": "　/)　/)\nc(　╹^╹)",
              "neko": "　　　　　∧,,　\n　　　　ヾ ｀. ､`フ\n　　　(,｀'´ヽ､､ﾂﾞ\n　 (ヽｖ'　　　`''ﾞつ\n　　,ゝ　 ⌒`ｙ'''´\n　 （ (´＾ヽこつ\n　　 ) )\n　　(ノ",
              "neko2": "　　　､ゞヾ∧\"\"'∧;,\n　　ヾ　　　・ω・ 彡\n　 ﾐ　　　 　o　 o　 ミ\n　~彡 ﾐ\n　　/ｿ,,　,０; ,;;:､０ヾ`",
              "neko3": "　　　 　／l、 \n(*´∀`)σ（ﾟ∀。７\n 　　　　l、 ~ヽ\n　　　　じしf_, )ノ ​",
              "给你": "（\\_/）\n(・_・)\n / 　>",
              "催更喵gkd": "　　　　　　＿＿＿\n　　　　　／＞　　フ\n　　　　　| 　_　 _ l 我是一只催更的\n　 　　　／` ミ＿xノ 喵喵酱\n　　 　 /　　　 　 | gkdgkd\n　　　 /　 ヽ　　 ﾉ\n　 　 │　　|　|　|\n　／￣|　　 |　|　|\n　| (￣ヽ＿_ヽ_)__)\n　＼二つ",
              "举高高": "　　　　_∧＿∧_ \n　　 　((∀｀/ 　) \n　　　/⌒　　 ／ \n　　/(__ノ＼_ノ \n　　(_ノ ||| 举高高~~\n　∧＿∧　∧＿∧\n(( ・∀・ ))・∀・) )\n`＼　　 ∧ 　　ノ\n　/　｜/　　｜\n（＿ノ＿)_ノL＿)",
              "举高高2": "　　　　_∧＿∧_\n　　　 ((∀｀/ 　)\n　　　 /⌒　　 ／\n　 /(__ノ＼_ノ(((ヽ\n　(_ノ　 　￣Ｙ＼\n|　(＼　(\\　 /)　 ｜ )举高高！\nヽ　ヽ` ( ﾟ∀ﾟ ) _ノ /\n　＼ |　⌒Ｙ⌒　/ /\n　 ｜ヽ · ｜ · ﾉ ／/\n　 ＼トー仝ーイ\n　　 ｜ ミ土彡/\n　　　). \\ °　 /\n　　　( 　\\. y 　\\",
              "举糕糕": "举糕糕~\n　　☆☆☆☆☆☆☆☆\n　╭┻┻┻┻┻┻┻┻╮\n　┃╱╲╱╲╱╲╱╲┃\n╭┻━━━━━━━━┻╮\n┃╱╲╱╲╱╲╱╲╱╲┃\n┗━━━━━━━━━━┛\n　　　∧＿∧　∧＿∧\n　　(( ・∀・ ))・∀・) )\n　　`＼　　 ∧ 　　ノ\n　　　/　　｜/　　｜\n　　（＿ノ＿)_ノL＿)",
              "Happy肥肥Day": ".　　　　　　　.★ * ★.. \n　　.*★　*.　*..*　　　★ \n　　★　　　　　　★ \n　　‘*. *'　 ʜᴀᴘᴘʏ 肥肥 ᴅᴀʏ \n　　　‘★.　　 ★’ \n　　　　　*..★\n┊┊┊┊☆☆☆☆☆☆☆☆┊┊┊┊\n┊┊┊╭┻┻┻┻┻┻┻┻╮┊┊┊\n┊┊┊┃╱╲╱╲╱╲╱╲┃┊┊┊\n┊┊╭┻━━━━━━━━┻╮┊┊\n┊┊┃╱╲╱╲╱╲╱╲╱╲┃┊┊\n╱▔┗━━━━━━━━━━┛▔╲",
              "大嘘": "吁~~~~　　rnm，退钱！\n 　　　/　　　/\n(　ﾟ 3ﾟ) `ー´) `д´) `д´)",
              "巴拉巴拉": "　∧＿∧\n（｡･ω･｡)つ━☆・*。\n⊂　　 ノ 　　　・゜+.\n　しーＪ　　　°。+ *´¨)\n　　　 　　.· ´¸.·*´¨) ¸.·*¨)\n　　　　　　　 　(¸.·´ (¸.·’*",
              "碣石": "　　_ _\n　 ( ﾟ_ﾟ)　　\n/　(⁰　　)╲/",
              "冰封王座": "(ノﾟ∀ﾟ)ノ👑\n　　　( ﾟ∀。)\n\n　　　👑\n(//ﾟωﾟ)//\n    \n　👑\n(Ⅱﾟωﾟ)Ⅱ\n\n　 👑\nᕕ( ᐛ )ᕗ",
              "冰封王座2": "(ノﾟ∀ﾟ)ノ🍟\n　　　( ﾟ∀。)\n\n　　　🍟\n(//ﾟωﾟ)//\n    \n　🍟\n(Ⅱﾟωﾟ)Ⅱ\n\n　 🍟\nᕕ( ᐛ )ᕗ",
              "冰封王座3": "( `д´)=🔪 👑\n　　　 (　ﾟ 3ﾟ)\n　　　👑\n(// `ー´)//\n(　x 3x)\n　👑\n(Ⅱ`∀´)Ⅱ\n(　x 3x)\n　👑\n( `д´)\n(　x 3x)",
              "喵喵酱": "　^ ^\n( =`д´=)哈—！",
              "狗比酱": "(U `д´)<汪汪汪！",
              "起舞":"⊂ヽ(　^ω^)つ\n　 ＼ 　　／　　\n　　( ＿_フ\n　　(／",
              "N98": "淦\n是\nN\n9\n8\n接☆龙☆大☆成☆功\n盗摄？(　^ω^)\n石雕\n要素齐全\nN98是什么？\n同问\n感谢\n谢谢\n要素齐全\n什么是要素齐全？\n淦\n是\nN\n9\n5\nr\n警惕r点机器人\n你一个人都说完了我们说什么(╬ﾟдﾟ)",
              "望po石":"　┏━┓\n　┃望┃\nᕕ┃po┃ᕗ\n　┃石┃\n　┗━┛\n嗨呀我又来望po了\n我天天都来这望po",
              "望po石2": "　　　　┏━┓\n　　　　┃望┃\n　　　　┃po┃\n　　　　┃石┃\n　　　　┗━┛　　　　\n　　　┏━━━┓\n　　┏┛　望　┗┓\n　┏┛　　po　　┗┓\n┏┛　　　山　　　┗┓\n┗━━━━━━━━━┛",
              "撞墙": "┃電柱┃　( ´ー`)\n┃電柱┃дﾟ ) =͟͟͞͞ =͟͟͞͞\n┃電柱┃　( ´д`)\n┃電柱┃дﾟ ) =͟͟͞͞ =͟͟͞͞\n┃電柱┃　(;´Д`)\n┃電柱┃π。) =͟͟͞͞ =͟͟͞͞",
              "全角空格": "　",
          };
          const ORDERED_RICH = [
              "҉( ﾟ∀。)","齐齐蛤尔","呼伦悲尔","愕尔多厮","智利","阴山山脉",
              "mini阴阳酱","F5欧拉","UK酱","白羊","兔兔",
              "neko","neko2","neko3","催更喵gkd",
              "给你","举高高","举高高2","举糕糕","Happy肥肥Day",
              "大嘘","巴拉巴拉","碣石",
              "冰封王座","冰封王座2","冰封王座3",
              "喵喵酱","狗比酱","起舞","N98",
              "望po石","望po石2","撞墙",
              "全角空格",
              // 页面中“防剧透/骰子/高级骰子”不动其原位
          ];
          const NEED_LF = new Set([
              "҉( ﾟ∀。)","F5欧拉","UK酱","白羊","兔兔",
              "neko","neko2","neko3","催更喵gkd",
              "给你","举高高","举高高2","举糕糕","Happy肥肥Day",
              "大嘘","巴拉巴拉","碣石",
              "冰封王座","冰封王座2","冰封王座3",
              "喵喵酱","狗比酱","起舞","N98",
              "望po石","望po石2","撞墙",
          ]);

          // 一次性补齐（选择器就绪且已有至少一个选项时调用）
          function patchSelect(sel) {
              if (!sel || sel.dataset.kaoExtended === '1') return;
              // 去重集合
              const existingValues = new Set();
              const existingLabels = new Set();
              Array.from(sel.options).forEach(op => {
                  existingValues.add(op.value);
                  existingLabels.add(op.textContent);
              });
              // 追加普通
              const frag = document.createDocumentFragment();
              EXTRA_EMOTS.forEach(txt => {
                  if (!existingValues.has(txt)) {
                      frag.appendChild(new Option(txt, txt));
                      existingValues.add(txt);
                  }
              });
              if (frag.childNodes.length) sel.appendChild(frag);

              // 收集需要重排的富颜文字：先把 ORDERED_RICH 中已存在的挪出
              const bucket = new Map(); ORDERED_RICH.forEach(k => bucket.set(k, null));
              for (let i = sel.options.length - 1; i >= 0; i--) {
                  const op = sel.options[i];
                  const label = op.textContent;
                  if (bucket.has(label)) {
                      bucket.set(label, op);
                      sel.remove(i);
                  }
              }
              // 按顺序插回；缺的用 EXTRA_RICH 补齐；值前加换行（NEED_LF）
              const richFrag = document.createDocumentFragment();
              ORDERED_RICH.forEach(key => {
                  let node = bucket.get(key);
                  if (node) {
                      richFrag.appendChild(node);
                  } else if (EXTRA_RICH[key]) {
                      const val = NEED_LF.has(key) ? ("\n" + EXTRA_RICH[key] + "\n") : EXTRA_RICH[key];
                      richFrag.appendChild(new Option(key, val));
                  }
              });
              if (richFrag.childNodes.length) sel.appendChild(richFrag);

              sel.dataset.kaoExtended = '1';
              sel.dispatchEvent(new CustomEvent('kaomoji:updated', { bubbles: true }));
          }

          // 方案 A：钩住 jQuery 的 append，仅针对 #h-emot-select
          (function hookjQueryAppend(){
              const $ = window.jQuery;
              if (!$ || !$.fn || !$.fn.append || $.fn.append.__kaoHooked) return;
              const rawAppend = $.fn.append;
              $.fn.append = function(...args){
                  const ret = rawAppend.apply(this, args);
                  try {
                      // 如果目标包含我们的 select，就尝试打补丁
                      this.each(function(){
                          if (this && this.querySelector) {
                              const sel = this.matches && this.matches(SELECTOR) ? this : this.querySelector(SELECTOR);
                              if (sel) patchSelect(sel);
                          }
                      });
                  } catch(_) {}
                  return ret;
              };
              $.fn.append.__kaoHooked = true;
          })();

          // 方案 B：用 MutationObserver 监听 select 的子节点变化，首次填充后补齐
          (function observeSelect(){
              const sel = document.querySelector(SELECTOR);
              if (!sel) return;
              // 若已有人填充过，直接打一次补丁
              if (sel.options && sel.options.length > 0) {
                  patchSelect(sel);
              }
              // 监听后续填充
              const mo = new MutationObserver(() => {
                  // 一旦看到有 option 节点，就补丁并停止观察
                  if (sel.options && sel.options.length > 0) {
                      patchSelect(sel);
                      mo.disconnect();
                  }
              });
              mo.observe(sel, { childList: true, subtree: false });
          })();

          // 方案 C：兜底重试（避免异步加载错过时机）
          let tries = 0;
          (function retry(){
              const sel = document.querySelector(SELECTOR);
              if (sel && sel.options && sel.options.length > 0) {
                  patchSelect(sel);
                  return;
              }
              if (tries++ < 30) setTimeout(retry, 100);
          })();
      }
  }

  // function renderSpoiler(container) {
  //   var $container = $(container);
  //   // 用构造函数写法，避免 /^.../ 形式
  //   var reg = new RegExp("\\[h\\]([\\s\\S]*?)\\[\\/h\\]", "gi");

  //   $container.find('.h-threads-content').each(function () {
  //     var text = $(this).text().trim();
  //     var match = reg.exec(text);
  //     if (match) {
  //       $(this).html('<span class="h-hidden-text">' + match[1] + '</span>');
  //     }
  //   });
  // }

  /* --------------------------------------------------
   * tag 14. ‘增强x岛匿名版’：添加预览框+草稿保存/恢复/自动设置网页标题/人类友好时间显示/引用追记/粘贴图片上传
   * -------------------------------------------------- */
  // 统一生成草稿存储用的 key
  // 统一：草稿 key 生成
  function getDraftKey() {
    return window.location.pathname;
  }

  // 统一：安全删除草稿（有 GM_deleteValue 用之；否则写空串兜底）
  function deleteDraftSafe(key) {
    try {
      if (!key) key = getDraftKey();
      if (typeof GM_deleteValue === 'function') {
        GM_deleteValue(key);
      } else if (typeof GM_setValue === 'function') {
        GM_setValue(key, ''); // 覆盖为空字符串
      } else {
        // 无 GM_* 时不做处理
      }
    } catch (_) {}
  }

  // 完整移植为可调用函数。需要：jQuery 2.2.4+；GM_setValue/GM_getValue/GM_deleteValue 授权
  function enhanceIsland(config = {}) {
    // 配置开关（默认全开）
    const cfg = Object.assign({
      enablePreview: true,         // 发帖预览（插入预览DOM并实时渲染）
      enableDraft: true,           // 草稿保存/恢复和成功后清理
      enableAutoTitle: true,       // 自动设置网页标题（含页码）
      enableRelativeTime: true,    // 相对时间显示（每2.5秒刷新）
      enableQuoteInsert: true,     // 点击 No.xxxx 插入引用
      enablePasteImage: true       // 粘贴剪贴板图片到文件输入
    }, config);

    // 解析 jQuery
    const $ = cfg.$ || window.jQuery || window.$;
    if (!$) {
      console.warn('[enhanceIsland] jQuery not found.');
      return;
    }

    // 公用变量
    const 正文框 = $('textarea.h-post-form-textarea');
    const search = window.location.search;
    const 搜索参数 = {};
    search.replace(/^\?/, '').split('&').forEach(kev => {
      if (!kev) return;
      const [k, v] = kev.split('=', 2);
      搜索参数[k] = v;
    });
    const 路径 = window.location.pathname;
    const 路径分块 = 路径.split('/').splice(1);

    // 动态生成预览区域 DOM
    function buildPreviewHtml() {
      // 从 cookie-switcher 里取当前饼干
      const cookieDisplay = document.querySelector('#h-post-form #current-cookie-display');
      const cookieText = cookieDisplay ? cookieDisplay.textContent.trim() : '--';

      return `
      <div class="h-preview-box">
        <div class="h-threads-item">
          <div class="h-threads-item-replies">
            <div class="h-threads-item-reply">
              <div class="h-threads-item-reply-main">
                <div class="h-threads-img-box">
                  <div class="h-threads-img-tool uk-animation-slide-top">
                    <span class="h-threads-img-tool-btn h-threads-img-tool-small uk-button-link"><i class="uk-icon-minus"></i>收起</span>
                    <a href=":javascript:;" class="h-threads-img-tool-btn uk-button-link"><i class="uk-icon-search-plus"></i>查看大图</a>
                    <span class="h-threads-img-tool-btn h-threads-img-tool-left uk-button-link"><i class="uk-icon-reply"></i>向左旋转</span>
                    <span class="h-threads-img-tool-btn h-threads-img-tool-right uk-button-link"><i class="uk-icon-share"></i>向右旋转</span>
                  </div>
                  <a class="h-threads-img-a"><img src="" align="left" border="0" hspace="20" class="h-threads-img"></a>
                </div>
                <div class="h-threads-info">
                  <span class="h-threads-info-title"></span>
                  <span class="h-threads-info-email"></span>
                  <span class="h-threads-info-createdat">2077-01-01(四)00:00:01</span>
                  <span class="h-threads-info-uid">ID:${cookieText}</span>
                  <span class="h-threads-info-report-btn">
                    [<a href="/f/值班室" target="_blank">举报</a>]
                  </span>
                  <a href=":javascript:;" class="h-threads-info-id" target="_blank">No.9999999</a>
                </div>
                <div class="h-threads-content"></div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    }

    // 预览区域 DOM
    const previewHtml = buildPreviewHtml();
    //previewBox.outerHTML = previewHtml;


    // 引用插入函数（与原脚本一致）
    function enhanceNode(root) {
      if (typeof extendQuote === 'function') extendQuote(root);
      if (typeof initExtendedContent === 'function') initExtendedContent(root);
      if (typeof initContent === 'function') initContent(root);
      //if (typeof autoHideRefView === 'function') autoHideRefView(root);
    }
    // 只有在页面存在发帖表单容器时才插入预览
    function initPreviewBox() {
        if (!cfg.enablePreview) return;
        if (!$('#h-post-form form').length) return;

        // 只创建一次预览框
        if (!$('.h-preview-box').length) {
            const $box = $(previewHtml).insertAfter('#h-post-form form');
            enhanceNode($box[0]);
            // ★ 新增：让预览框里的图片也启用高清图+旋转布局逻辑
            if (typeof enableHDImage === 'function') {
                enableHDImage($box[0]);
            }
            // 让预览框宽度跟随表单
            // === 实时监测预览框父容器变化 ===
            const boxEl = $box[0];

            function applyBoxStyle(previewEl) {
              if (!$box.closest('.qp-body').length) {
                // 不在 .qp-body 内时，应用基础样式
                $box.css({
                  width: '100%',
                  'box-sizing': 'border-box'
                });
                $box.find('.h-threads-content').css({
                  'overflow-wrap': 'break-word',
                  'word-break': 'break-word',
                  'white-space': 'normal'
                });
              } else {
                // 在 .qp-body 内时，实时跟随 .qp-content-wrap 宽度
                const wrapEl = $box.closest('.qp-content-wrap')[0];
                if (wrapEl && previewEl) {
                  const wrapStyle = window.getComputedStyle(wrapEl);
                  previewEl.style.width = wrapStyle.width;
                  previewEl.style.boxSizing = 'border-box';
                }

                // 保持换行规则
                $box.find('.h-threads-content').css({
                  'max-width': '100%',        /* 预览框不超过容器宽度 */
                  'overflow-wrap': 'break-word',
                  'word-break': 'break-word',
                  'white-space': 'normal'
                });
              }
            }


            // 初始化时执行一次
            applyBoxStyle();

            // 监听 DOM 变化
            const mo = new MutationObserver(() => {
              applyBoxStyle();
            });

            // 监听父节点变化（包括被移动到别的容器）
            mo.observe(document.body, {
              childList: true,
              subtree: true
            });


            // 初始化时同步饼干 ID
            const cookieDisplay = document.querySelector('#h-post-form #current-cookie-display');
            if (cookieDisplay) {
                const cookieText = cookieDisplay.textContent.trim();
                $box.find('.h-threads-info-uid').text(`ID:${cookieText}`);
            }

            // === 图片预览更新函数 ===
            function updatePreviewFromFile(file) {
                const imgEl = $box.find('.h-threads-img')[0];
                const imgLink = $box.find('.h-threads-img-a')[0];
                if (!imgEl) return;

                // 清理旧 URL
                if (imgEl.dataset.prevObjectUrl) {
                    URL.revokeObjectURL(imgEl.dataset.prevObjectUrl);
                    delete imgEl.dataset.prevObjectUrl;
                }

                if (file) {
                  const objectUrl = URL.createObjectURL(file);
                  imgEl.src = objectUrl;
                  imgEl.dataset.prevObjectUrl = objectUrl;
                  imgEl.style.display = 'block';
                  if (imgLink) imgLink.href = objectUrl;
                  // 清理默认宽度，避免占满
                  imgEl.style.width = 'auto';
                  imgEl.style.height = 'auto';
                  // ★ 新增：根据所在位置限制缩略图大小
                  const isInOverlay = !!$box.closest('.qp-body').length;
                  if (isInOverlay) {
                      // 在浮窗中：最大宽度为浮窗宽度的 1/3
                      const wrapEl = $box.closest('.qp-content-wrap')[0];
                      if (wrapEl) {
                          const wrapWidth = wrapEl.getBoundingClientRect().width;
                          imgEl.style.maxWidth = (wrapWidth / 3) + 'px';
                          imgEl.style.height = 'auto';
                      }
                  } else {
                      // 在表单中：最大宽度为表单宽度的 1/2
                      const formEl = document.querySelector('#h-post-form form');
                      if (formEl) {
                          const formWidth = formEl.getBoundingClientRect().width;
                          imgEl.style.maxWidth = (formWidth / 2) + 'px';
                          imgEl.style.height = 'auto';
                      }
                  }
              }

            }

            // === 监听文件选择 ===
            const fileInput = document.querySelector('input[type="file"][name="image"]');
            if (fileInput) {
                fileInput.addEventListener('change', function () {
                    const file = this.files && this.files[0] ? this.files[0] : null;
                    updatePreviewFromFile(file);
                });
            }

            // === 监听粘贴图片（不依赖 change 事件）===
            document.addEventListener('paste', function (e) {
                const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items || [];
                if (!items.length) return;

                let file = null;
                for (const it of items) {
                    if (it.kind === 'file') {
                        const f = it.getAsFile();
                        if (f && f.type.startsWith('image/')) {
                            file = f;
                            break;
                        }
                    }
                }
                if (!file) return;

                // 如果 input 存在，也同步到 input.files
                if (fileInput) {
                    try {
                        const dt = new DataTransfer();
                        dt.items.add(file);
                        fileInput.files = dt.files;
                    } catch (_) {
                        // 某些浏览器不支持 DataTransfer 构造器
                    }
                }

                // 直接更新预览
                updatePreviewFromFile(file);
                // 触发 change，让绑定在 file input 上的逻辑（如清除按钮）也能执行
                if (fileInput) {
                    try {
                        fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                    } catch (_) {}
                }

            }, true);
        }
    }
    // 预览引用/隐藏文本渲染
    const previewBox = $('<div/>'); // 占位，真正引用在 initPreviewBox 后重新抓取
    const refExp = /^([>＞]+.*)$/g;
    const hideExp = /\[h\](.*)\[\/h\]/g;

    function renderContent(raw) {
      const box = $('.h-preview-box');
      if (!box.length) return;
      const previewContent = box.find('.h-threads-content');

      if (typeof raw !== 'string' || raw.trim() === '') {
        previewContent.text('');
        return;
      }
      previewContent.text('');
      for (let i of raw.split('\n')) {
        i = i.replace(/ +/g, ' ');
        let e;
        if (refExp.test(i)) {
          e = $('<font color="#789922"></font>').text(i);
        } else if (hideExp.test(i)) {
          e = $('<span class="h-hidden-text"></span>').text(i);
        } else {
          e = $('<span></span>').text(i);
        }
        previewContent.append(e);
        previewContent.append('<br>');
        // 支持拓展引用：把扩展引用包上 <font color="#789922">，以便可点击弹窗
        if (typeof extendQuote === 'function') {
          extendQuote(previewContent[0]);
          enhanceNode(previewContent[0]);
        }
      }
    }

  // 草稿：发帖成功清空（拦截模式优先）
  function 清空编辑(key) {
    if (!cfg.enableDraft) return;
    if (key) {
      deleteDraftSafe(key);
      return;
    }
    // ===== 兼容原“中间页”的旧逻辑（仍保留）=====
    const okBox = document.getElementsByClassName('success')[0];
    if (!okBox) return;
    if (!okBox.textContent.includes('回复成功')) return;

    const hrefEl = document.getElementById('href');
    if (!hrefEl || !hrefEl.href) return;

    const m = /https?:\/\/[^/]+(\/t\/\d+)/.exec(hrefEl.href);
    if (!m) return;
    deleteDraftSafe(m[1]);
  }

    // 统一用事件清空，缺省用 getDraftKey()
    document.addEventListener('replySuccess', e => {
      清空编辑(e.detail?.key || getDraftKey());
    });

    // 草稿：载入
    function 载入编辑() {
      if (!cfg.enableDraft) return;
      if (!正文框.length) return;
      const key = window.location.pathname;
      let draft = '';
      if (typeof GM_getValue === 'function') {
        draft = GM_getValue(key, '');
      }

      // 检查 URL 参数 r
      if (搜索参数.r) {
        const quote = `>>No.${搜索参数.r}\n`;
        if (!draft.startsWith(quote)) {
          draft = quote + draft;
        }
      }

      正文框.val(draft);
    }

    // 草稿：注册自动保存 + 初始化一次保存触发（原脚本用 $(保存编辑)）
    function 注册自动保存编辑() {
      if (!cfg.enableDraft) return;

      // 原有正文框监听
      $('form').on('input', 保存编辑);

      // 改为事件委托：监听 name 和 title 输入框
      $(document).on('input', 'form input[name="name"], form input[name="title"]', 保存编辑);

      // 文档就绪时同步一次
      $(保存编辑);
    }


    function 保存编辑() {
      if (!cfg.enableDraft) return;
      if (!正文框.length) return;
      if (typeof GM_setValue === 'function') {
        GM_setValue(window.location.pathname, 正文框.val());
      }
      renderContent(正文框.val());

      const box = $('.h-preview-box');
      if (box.length) {
        const previewTitle = box.find('.h-threads-info-title');
        const previewEmail = box.find('.h-threads-info-email');

        const titleVal = $('form input[name="title"]').val() || '';
        const nameVal  = $('form input[name="name"]').val() || '';

        // 标题：空则隐藏，有值则显示并更新
        if (titleVal.trim() === '') {
          previewTitle.hide().text('无标题'); // 保留默认文案但不显示
        } else {
          previewTitle.text(titleVal.trim()).show();
        }

        // 名称：空则隐藏，有值则显示并更新
        if (nameVal.trim() === '') {
          previewEmail.hide().text('无名氏'); // 保留默认文案但不显示
        } else {
          previewEmail.text(nameVal.trim()).show();
        }
      }

    }

    // 点击 No.xxxx 插入引用（保持原先光标与选择区逻辑）
    function 注册追记引用串号() {
      if (!cfg.enableQuoteInsert) return;
      $('body').on('click', 'a.h-threads-info-id', e => {
        // 如果按住 Ctrl/Meta/Shift 键，允许浏览器默认行为（在新标签页/新窗口打开链接）
        if (e.ctrlKey || e.metaKey || e.shiftKey) return;
        if (!正文框.length) return;
        const start = 正文框.prop('selectionStart');
        const end = 正文框.prop('selectionEnd');
        const len = end - start;
        const str = 正文框.val();
        const left = str.substring(0, start);
        const right = str.substring(end);
        const ref = `>>${e.target.textContent.trim()}`;
        正文框.val(
          start === 0
            ? `${ref}\n${right}`
            : end === str.length
              ? `${left}\n${ref}\n`
              : len > 0
                ? `${left} ${ref} ${right}`
                : `${left}\n${ref}`
        );
        正文框.trigger('input', '');
        保存编辑();
        e.preventDefault();
      });
    }

    // 粘贴图片到文件输入（保持原选择器）
    function 注册粘贴图片() {
      if (!cfg.enablePasteImage) return;
      window.addEventListener('paste', e => {
        const files = (e.clipboardData || e.originalEvent?.clipboardData)?.files || [];
        if (files.length) {
          const fileInput = document.querySelector('input[type="file"][name="image"]');
          if (fileInput) fileInput.files = files;
        }
      });
    }

    // 子函数：选择了图片后出现“清除图片”按钮；清除后按钮消失，恢复“选择文件”
    function 绑定清除图片按钮() {
        const $form = $('#h-post-form form, form[action="/Home/Forum/doReplyThread.html"]').first();
        if (!$form.length) return;

        const $file = $form.find('input[type="file"][name="image"]');
        if (!$file.length) return;

        if ($file.data('xdexClearBound')) return;
        $file.data('xdexClearBound', true);

        // 包一层容器，方便布局
        if (!$file.parent().hasClass('xdex-file-wrapper')) {
            $file.wrap('<div class="xdex-file-wrapper" style="display:flex;align-items:center;justify-content:space-between;width:100%;"></div>');
        }

      function 刷新按钮() {
          const hasFile = $file[0].files && $file[0].files.length > 0;
          let $btn = $form.find('.xdex-clear-image-btn');

          if (hasFile) {
              if (!$btn.length) {
                  $btn = $('<button type="button" class="xdex-clear-image-btn" title="清除图片">×</button>');
                  $btn.css({
                      fontSize: '16px',
                      lineHeight: '1',
                      padding: '2px 6px',
                      cursor: 'pointer'
                  });
                  $file.after($btn);

                  $btn.on('click', function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    // 清空文件
                    $file.val('');

                    // 直接调用预览清空逻辑
                    if (typeof updatePreviewFromFile === 'function') {
                        updatePreviewFromFile(null);
                    } else {
                        const $preview = $('.h-preview-box');
                        $preview.find('img').attr('src', '').removeAttr('src');
                        $preview.find('.h-threads-img-a').attr('href', '');
                    }

                    // 复原预览框容器状态
                    const $previewBox = $('.h-preview-box .h-threads-img-box');
                    $previewBox.removeClass('h-active');
                    $previewBox.find('.h-threads-img-a').css('height', '');
                    $previewBox.find('.h-threads-img')
                      .css({ transform: '', top: '0px', left: '0px' })
                      .removeAttr('data-rotate-index');

                    // 移除按钮
                    $(this).remove();
                });

              }
          } else {
              if ($btn.length) $btn.remove();
          }
      }

      $file.on('change', 刷新按钮);
      刷新按钮();
    }

    // 递归访问 DOM
    function visit(root, cb) {
      if (!root) return;
      if (cb(root) === '停止') return;
      for (const child of root.children || []) {
        visit(child, cb);
      }
    }

    // 自动标题：择标题（与原逻辑等价）
    function 选择标题() {
      const titleEl = document.querySelector('.h-threads-list .h-threads-item-main .h-threads-info .h-threads-info-title');
      const contentEl = document.querySelector('.h-threads-list .h-threads-item-main .h-threads-content');
      if (!contentEl) return document.title;

      const titleText = (titleEl?.textContent || '').trim();
      if (titleText && titleText !== '无标题') return titleText;

      const redTexts = [];
      visit(contentEl, el => {
        try {
          if (window.getComputedStyle(el).color === 'rgb(255, 0, 0)') {
            const redSegment = el.textContent.replace(/^[=\s+]+|[=\s+]+$/, '');
            if (redSegment !== '') redTexts.push(redSegment);
            return '停止';
          }
        } catch (_) {}
      });
      const red = redTexts.join('');
      if (red !== '') return red;

      const lines = (contentEl.innerText || '').split('\n');
      for (let line of lines) {
        if ((line = line.trim()) !== '') return line;
      }
      return document.title;
    }


    const 原始标题 = document.title;

    function 自动标题() {
      if (!cfg.enableAutoTitle) return;

      // 每次调用时重新解析 URL
      const search = window.location.search;
      const 搜索参数 = {};
      search.replace(/^\?/, '').split('&').forEach(kev => {
        if (!kev) return;
        const [k, v] = kev.split('=', 2);
        搜索参数[k] = v;
      });
      const 路径 = window.location.pathname;
      const 路径分块 = 路径.split('/').splice(1);

      const 页码 = 路径分块[0] === 'Forum'
        ? (路径分块[5]?.replace(/\.html$/, '') || 1)
        : (搜索参数.page || 1);

      const 标题 = 选择标题();
      const titleEl = document.querySelector('title');
      if (titleEl) {
        titleEl.textContent = `${标题} - ${原始标题} - page ${页码}`;
      }
    }


    // 相对时间格式化（与原逻辑等价，目标 span.h-threads-info-createdat）
    function getFriendlyTime(machineReadableTime) {
      const date = new Date(machineReadableTime);
      const now = new Date();
      if (now < date) return machineReadableTime;

      let friendlyDate = machineReadableTime.slice(0, 10);
      let friendlyTime = machineReadableTime.slice(13, 21);
      const weekday = machineReadableTime.slice(11, 12);

      const diff = (now.getTime() - date.getTime()) / 1000;
      if (diff < 60) {
        friendlyTime = `${Math.floor(diff)}秒前`;
      } else if (diff < 3600) {
        friendlyTime = `${Math.floor(diff / 60)}分钟前`;
      } else if (diff < 24 * 3600) {
        friendlyTime = `${Math.floor(diff / 3600)}小时前 ${friendlyTime}`;
      }

      const yesterday = new Date(new Date(now - 1000 * 60 * 60 * 24).toLocaleDateString());
      if (now.toLocaleDateString() === date.toLocaleDateString()) {
        friendlyDate = '今天';
      } else if (yesterday.toLocaleDateString() === date.toLocaleDateString()) {
        friendlyDate = '昨天';
      } else if (yesterday - date < 1000 * 60 * 60 * 24 * 30) {
        friendlyDate = `${Math.floor((now - date) / (1000 * 60 * 60 * 24))}天前`;
      } else if (now.getFullYear() === date.getFullYear()) {
        friendlyDate = friendlyDate.slice(5);
      } else {
        friendlyDate = `${now.getFullYear() - date.getFullYear()}年前 ${friendlyDate}`;
      }
      return `${friendlyDate}(${weekday})${friendlyTime}`;
    }

    function formatDateStrOnPage() {
      if (!cfg.enableRelativeTime) return;
      const targets = $('span.h-threads-info-createdat');
      targets.each(function () {
        const target = $(this);
        const timeStr = target.attr('title') || target.text().trim();
        if (!timeStr) return;
        target.attr('title', timeStr);
        const friendlyTime = getFriendlyTime(timeStr);
        target.text(friendlyTime);
      });
    }

    // 路由：各页面初始化（与原逻辑一致）
    function 串() {
      if (cfg.enablePreview) initPreviewBox();
      if (cfg.enableDraft) 载入编辑();
      if (cfg.enableQuoteInsert) 注册追记引用串号();
      if (cfg.enableDraft) 注册自动保存编辑();
      if (cfg.enablePasteImage) 注册粘贴图片();
      绑定清除图片按钮();
      if (cfg.enableAutoTitle) 自动标题();
      if (cfg.enableRelativeTime) setInterval(formatDateStrOnPage, 2500);
    }

    function 串只看po() {
      if (cfg.enableAutoTitle) 自动标题();
    }

    function 版块() {
      if (cfg.enablePreview) initPreviewBox();
      if (cfg.enableDraft) 注册自动保存编辑();
      //if (cfg.enableQuoteInsert) 注册追记引用串号();
      if (cfg.enablePasteImage) 注册粘贴图片();
      绑定清除图片按钮();
      if (cfg.enableRelativeTime) setInterval(formatDateStrOnPage, 2500);
    }

    function 时间线() {
      if (cfg.enablePreview) initPreviewBox();
      if (cfg.enableDraft) 注册自动保存编辑();
      //if (cfg.enableQuoteInsert) 注册追记引用串号();
      if (cfg.enablePasteImage) 注册粘贴图片();
      绑定清除图片按钮();
      if (cfg.enableRelativeTime) setInterval(formatDateStrOnPage, 2500);
    }

    function 回复成功() {
      if (cfg.enableDraft) 清空编辑();
      if (cfg.enablePasteImage) 注册粘贴图片();
    }
    document.addEventListener('replySuccess', e => {
        回复成功(e.detail?.key);
    });


    function 未知() {
      if (cfg.enablePasteImage) 注册粘贴图片();
    }

    // 一级路径解析（支持 m 前缀）
    const 一层路径 = 路径分块[0] === 'm' ? 路径分块[1] : 路径分块[0];

    // 入口分流（与原脚本一致）
    switch (一层路径) {
      case 't':
        串();
        break;
      case 'f':
        版块();
        break;
      case 'Forum':
        if (路径分块[1] === 'po' && 路径分块[2] === 'id') {
          串只看po();
        } else if (路径分块[1] === 'timeline' && 路径分块[2] === 'id') {
          // 这里就是时间线页面
          时间线();
        } else {
          未知();
        }
        break;
      case 'Home':
        if (路径 === '/Home/Forum/doReplyThread.html') {
          回复成功();
        } else {
          未知();
        }
        break;
      case 'Member':
        if (路径.startsWith('/Member/User/Cookie/export/id/')) {
          console.debug('//不是我的TODO');
        }
        break;
      default:
        未知();
    }


    // 首次渲染预览（若需要）
    if (cfg.enablePreview) {
      renderContent(正文框.val ? (正文框.val() || '') : '');
    }

    // 以便无缝翻页后修改标题
    window.enhanceIslandAutoTitle = 自动标题;
  }

  /* --------------------------------------------------
   * tag 15. 板块页快速回复入口（含时间线支持）
   * -------------------------------------------------- */
  function replyQuicklyOnBoardPage() {
    // 同时识别 /f/ 板块 和 /Forum/timeline/id/{id} 时间线
    const isBoardPage = /^\/f\//.test(location.pathname);
    const timelineMatch = location.pathname.match(/\/Forum\/timeline\/id\/(\d+)(?:\/page\/\d+(\.html)?)?/i);
    const isTimeline = !!timelineMatch;
    if (!isBoardPage && !isTimeline) return;

    // 时间线 id 与名称映射（1-7）
    const timelineId = timelineMatch ? timelineMatch[1] : null;
    const timelineNameMap = {
      '1': '综合线',
      '2': '创作线',
      '3': '非创作线',
      '4': '亚文化线',
      '5': '综合2线',
      '6': '游戏线',
      '7': '生活线'
    };

    // boardName：板块名或时间线的默认显示文本（用于 "发串" 模式显示）
    const boardName = isTimeline
      ? (timelineNameMap[timelineId] ? `${timelineNameMap[timelineId]}-快速回复` : '时间线-快速回复')
      : decodeURIComponent(location.pathname.replace(/^\/f\//, '').split('/')[0]);

    // 持久变量：保存当前正在回复的串号 / 缓存的回复参数
    let currentReplyTid = null;
    let pendingReplyParams = null; // { tid, resto, hash }

    // ---------- 子函数：为时间线插入回复表单（第四个子函数） ----------
    function bindTimelineReplyForm() {
      // 找到页面上的第一个 <hr>，在其下插入我们要的回复表单容器与一个 <hr> 与线程列表分隔
      const $firstHr = $('hr').first();
      if (!$firstHr.length) return;

      const timelineLabel = timelineNameMap[timelineId] || '时间线';

      const emotOptions = [
        '<option value="|∀ﾟ">|∀ﾟ</option>',
        '<option value="(´ﾟДﾟ`)">(´ﾟДﾟ`)</option>',
        '<option value="(;´Д`)">(;´Д`)</option>',
        '<option value="(｀･ω･)">(｀･ω･)</option>',
        '<option value="(=ﾟωﾟ)=">(=ﾟωﾟ)=</option>',
        '<option value="| ω・´)">| ω・´)</option>',
        '<option value="|-` )">|-` )</option>',
        '<option value="|д` )">|д` )</option>',
        '<option value="|ー` )">|ー` )</option>',
        '<option value="|∀` )">|∀` )</option>',
        '<option value="(つд⊂)">(つд⊂)</option>',
        '<option value="(ﾟДﾟ≡ﾟДﾟ)">(ﾟДﾟ≡ﾟДﾟ)</option>',
        '<option value="(＾o＾)ﾉ">(＾o＾)ﾉ</option>',
        '<option value="(|||ﾟДﾟ)">(|||ﾟДﾟ)</option>',
        '<option value="( ﾟ∀ﾟ)">( ﾟ∀ﾟ)</option>',
        '<option value="( ´∀`)">( ´∀`)</option>',
        '<option value="(*´∀`)">(*´∀`)</option>',
        '<option value="(*ﾟ∇ﾟ)">(*ﾟ∇ﾟ)</option>',
        '<option value="(*ﾟーﾟ)">(*ﾟーﾟ)</option>',
        '<option value="(　ﾟ 3ﾟ)">(　ﾟ 3ﾟ)</option>',
        '<option value="( ´ー`)">( ´ー`)</option>',
        '<option value="( ・_ゝ・)">( ・_ゝ・)</option>',
        '<option value="( ´_ゝ`)">( ´_ゝ`)</option>',
        '<option value="(*´д`)">(*´д`)</option>',
        '<option value="(・ー・)">(・ー・)</option>',
        '<option value="(・∀・)">(・∀・)</option>',
        '<option value="(ゝ∀･)">(ゝ∀･)</option>',
        '<option value="(〃∀〃)">(〃∀〃)</option>',
        '<option value="(*ﾟ∀ﾟ*)">(*ﾟ∀ﾟ*)</option>',
        '<option value="( ﾟ∀。)">( ﾟ∀。)</option>',
        '<option value="( `д´)">( `д´)</option>',
        '<option value="(`ε´ )">(`ε´ )</option>',
        '<option value="(`ヮ´ )">(`ヮ´ )</option>',
        '<option value="σ`∀´)">σ`∀´)</option>',
        '<option value=" ﾟ∀ﾟ)σ"> ﾟ∀ﾟ)σ</option>',
        '<option value="ﾟ ∀ﾟ)ノ">ﾟ ∀ﾟ)ノ</option>',
        '<option value="(╬ﾟдﾟ)">(╬ﾟдﾟ)</option>',
        '<option value="(|||ﾟдﾟ)">(|||ﾟдﾟ)</option>',
        '<option value="( ﾟдﾟ)">( ﾟдﾟ)</option>',
        '<option value="Σ( ﾟдﾟ)">Σ( ﾟдﾟ)</option>',
        '<option value="( ;ﾟдﾟ)">( ;ﾟдﾟ)</option>',
        '<option value="( ;´д`)">( ;´д`)</option>',
        '<option value="(　д ) ﾟ ﾟ">(　д ) ﾟ ﾟ</option>',
        '<option value="( ☉д⊙)">( ☉д⊙)</option>',
        '<option value="(((　ﾟдﾟ)))">(((　ﾟдﾟ)))</option>',
        '<option value="( ` ・´)">( ` ・´)</option>',
        '<option value="( ´д`)">( ´д`)</option>',
        '<option value="( -д-)">( -д-)</option>',
        '<option value="(&gt;д&lt;)">(&gt;д&lt;)</option>',
        '<option value="･ﾟ( ﾉд`ﾟ)">･ﾟ( ﾉд`ﾟ)</option>',
        '<option value="( TдT)">( TдT)</option>',
        '<option value="(￣∇￣)">(￣∇￣)</option>',
        '<option value="(￣3￣)">(￣3￣)</option>',
        '<option value="(￣ｰ￣)">(￣ｰ￣)</option>',
        '<option value="(￣ . ￣)">(￣ . ￣)</option>',
        '<option value="(￣皿￣)">(￣皿￣)</option>',
        '<option value="(￣艸￣)">(￣艸￣)</option>',
        '<option value="(￣︿￣)">(￣︿￣)</option>',
        '<option value="(￣︶￣)">(￣︶￣)</option>',
        '<option value="ヾ(´ωﾟ`)">ヾ(´ωﾟ`)</option>',
        '<option value="(*´ω`*)">(*´ω`*)</option>',
        '<option value="(・ω・)">(・ω・)</option>',
        '<option value="( ´・ω)">( ´・ω)</option>',
        '<option value="(`・ω)">(`・ω)</option>',
        '<option value="(´・ω・`)">(´・ω・`)</option>',
        '<option value="(`・ω・´)">(`・ω・´)</option>',
        '<option value="( `_っ´)">( `_っ´)</option>',
        '<option value="( `ー´)">( `ー´)</option>',
        '<option value="( ´_っ`)">( ´_っ`)</option>',
        '<option value="( ´ρ`)">( ´ρ`)</option>',
        '<option value="( ﾟωﾟ)">( ﾟωﾟ)</option>',
        '<option value="(oﾟωﾟo)">(oﾟωﾟo)</option>',
        '<option value="(　^ω^)">(　^ω^)</option>',
        '<option value="(｡◕∀◕｡)">(｡◕∀◕｡)</option>',
        '<option value="/( ◕‿‿◕ )\\">/( ◕‿‿◕ )\\</option>',
        '<option value="ヾ(´ε`ヾ)">ヾ(´ε`ヾ)</option>',
        '<option value="(ノﾟ∀ﾟ)ノ">(ノﾟ∀ﾟ)ノ</option>',
        '<option value="(σﾟдﾟ)σ">(σﾟдﾟ)σ</option>',
        '<option value="(σﾟ∀ﾟ)σ">(σﾟ∀ﾟ)σ</option>',
        '<option value="|дﾟ )">|дﾟ )</option>',
        '<option value="┃電柱┃">┃電柱┃</option>',
        '<option value="ﾟ(つд`ﾟ)">ﾟ(つд`ﾟ)</option>',
        '<option value="ﾟÅﾟ )　">ﾟÅﾟ )　</option>',
        '<option value="⊂彡☆))д`)">⊂彡☆))д`)</option>',
        '<option value="⊂彡☆))д´)">⊂彡☆))д´)</option>',
        '<option value="⊂彡☆))∀`)">⊂彡☆))∀`)</option>',
        '<option value="(´∀((☆ミつ">(´∀((☆ミつ</option>',
        '<option value="･ﾟ( ﾉヮ´ )">･ﾟ( ﾉヮ´ )</option>',
        '<option value="(ﾉ)`ω´(ヾ)">(ﾉ)`ω´(ヾ)</option>',
        '<option value="ᕕ( ᐛ )ᕗ">ᕕ( ᐛ )ᕗ</option>',
        '<option value="(　ˇωˇ)">(　ˇωˇ)</option>',
        '<option value="( ｣ﾟДﾟ)｣&lt;">( ｣ﾟДﾟ)｣&lt;</option>',
        '<option value="( ›´ω`‹ )">( ›´ω`‹ )</option>',
        '<option value="(;´ヮ`)7">(;´ヮ`)7</option>',
        '<option value="(`ゥ´ )">(`ゥ´ )</option>',
        '<option value="(`ᝫ´ )">(`ᝫ´ )</option>',
        '<option value="( ᑭ`д´)ᓀ))д´)ᑫ">( ᑭ`д´)ᓀ))д´)ᑫ</option>',
        '<option value="σ( ᑒ )">σ( ᑒ )</option>',
        '<option value="(`ヮ´ )σ`∀´) ﾟ∀ﾟ)σ">齐齐蛤尔</option>',
        '<option value="吁~~~~　　rnm，退钱！<br>&nbsp;　　　/　　　/ <br>(　ﾟ 3ﾟ) `ー´) `д´) `д´)">大嘘</option>',
        '<option value="[h] [/h]">防剧透</option>',
        '<option value="[n]">骰子</option>',
        '<option value="[n,m]">高级骰子</option>'
      ].join('\n');

      const formHtml = `
        <div id="h-post-form" class="uk-container-center uk-width-small-8-10 uk-width-medium-4-10 uk-width-large-4-10">
          <form action="/Home/Forum/doReplyThread.html" method="post" enctype="multipart/form-data">
            <!-- 隐藏字段，默认用 与 原来 setMode 一致的占位值（会在点击链接时被替换） -->
            <input type="hidden" name="resto" value="20011114">
            <input type="hidden" name="__hash__" value="cirns">

            <!-- 回应模式行（包含兼容原来逻辑的类和占位）-->
            <div class="uk-grid uk-grid-small h-post-form-grid js-reply-mode-row">
              <div class="uk-width-1-5">
                <div class="h-post-form-title">回应模式</div>
              </div>
              <div class="h-post-form-input uk-width-3-5 js-reply-mode-text">
                ${timelineLabel}-快速回复
              </div>
              <div class="h-post-form-option uk-width-1-5">
                <div class="reply-mode-toggle" style="display:flex; flex-direction:row; align-items:center; justify-content:flex-end; gap:6px;">
                  <span class="js-reply-extra" style="display:none; display:inline-flex; align-items:center;"></span>
                  <button type="button" class="js-toggle-mode" style="display:inline-flex; flex:0 0 auto; align-items:center; width:auto; padding:2px 8px; font-size:13px; cursor:pointer;">切换</button>
                </div>
              </div>
            </div>

            <!-- 以下为你提供的表单其余内容（保留原样，确保 textarea, input 名称等一致） -->
            <div class="uk-grid uk-grid-small h-post-form-grid">
              <div class="uk-width-1-5">
                <div class="h-post-form-title">名 称</div>
              </div>
              <div class="h-post-form-input uk-width-3-5">
                <input type="text" name="name" size="28" value="" maxlength="100">
              </div>
              <div class="h-post-form-option uk-width-1-5">
                <label class="h-admin-tool"><input type="checkbox" name="isManager" value="true">管理员</label>
              </div>
            </div>

            <div class="uk-grid uk-grid-small h-post-form-grid">
              <div class="uk-width-1-5">
                <div class="h-post-form-title">E-mail</div>
              </div>
              <div class="h-post-form-input uk-width-3-5">
                <input type="text" name="email" size="28" value="" maxlength="100">
              </div>
            </div>

            <div class="uk-grid uk-grid-small h-post-form-grid">
              <div class="uk-width-1-5">
                <div class="h-post-form-title">标题</div>
              </div>
              <div class="h-post-form-input uk-width-3-5">
                <input type="text" name="title" size="28" value="" maxlength="100">
              </div>
              <div class="h-post-form-option uk-width-1-5">
                <input type="submit" value="送出">
              </div>
            </div>

            <!-- 颜文字、正文、附图等 -->
            <div class="uk-grid uk-grid-small h-post-form-grid">
              <div class="uk-width-1-5">
                <div class="h-post-form-title">颜文字</div>
              </div>
              <div class="h-post-form-input uk-width-1-5">
                <select id="h-emot-select">
                ${emotOptions}
                </select>
              </div>
            </div>

            <div class="uk-grid uk-grid-small h-post-form-grid">
              <div class="uk-width-1-5">
                <div class="h-post-form-title h-post-form-textarea-title">正文</div>
              </div>
              <div class="h-post-form-input uk-width-4-5">
                <textarea name="content" maxlength="10000" class="h-post-form-textarea"></textarea>
              </div>
            </div>

            <div class="uk-grid uk-grid-small h-post-form-grid">
              <div class="uk-width-1-5">
                <div class="h-post-form-title">附加图片</div>
              </div>
              <div class="h-post-form-option uk-width-1-6">
                <label class="h-water-tool">
                  <input type="checkbox" name="water" value="true" checked="true">水印
                </label>
              </div>
              <div class="h-post-form-input uk-width-3-5">
                <input type="file" name="image">
              </div>
            </div>

            <!-- 如果页面需要 __hash__ 的实际值，可以在点击串链接并 fetch 后替换此隐藏值 -->
            <!-- 注意：原来 HTML 示例中的 long-hash 在这里用占位 'cirns'，后续会覆盖 -->
            <input type="hidden" name="__hash__" value="cirns">
          </form>
          <div class="uk-clearfix"></div>
        </div>
      `;

      // 插入表单：在第一个 hr 下插入表单和一个新的 hr（把表单与列表分离）
      $firstHr.after(formHtml + '<hr>');

      // 返回插入的 form jQuery 对象（方便调用端定位）
      return $('#h-post-form form').first();
      document.dispatchEvent(new Event('timelineReplyFormInserted'));
    }

    // ---------- 根据页面场景获取或插入表单 ----------
    let $formPost = $('form[action="/Home/Forum/doPostThread.html"]').first();   // 板块页发串表单
    let $formReply = $('form[action="/Home/Forum/doReplyThread.html"]').first(); // 串内页回串表单
    // TODO 值班室板块回复表单需要选择原因，无论在板块页快速回复还是串内回复
    if ($formPost.length) {
        // 当前是板块页，直接使用发串表单
    } else if ($formReply.length) {
        // 当前是串内页，直接使用回串表单
    } else if (/\/timeline|\/feed/.test(location.pathname)) {
        // 当前是时间线页，无表单 → 插入一个回串表单
        $formReply = $(`
            <form action="/Home/Forum/doReplyThread.html" method="post" id="timeline-reply-form">
                <!-- 这里填入串内页回复表单的必要字段 -->
            </form>
        `);
        $('body').append($formReply);
    }

    if (!$formPost.length && isTimeline) {
      $formPost = bindTimelineReplyForm();
    }
    // 时间线：插入/刷新完表单后，纳入统一的“包裹 + 折叠”
    if (isTimeline && $formPost && $formPost.length) {
      ensureCollapsed($formPost, '『回复』');
    }


    if (!$formPost || !$formPost.length) return;

    // 如果表单中已经存在“回应模式”行（例如我们插入的时间线表单），则复用；否则按原逻辑插入 $row
    let $row = null;
    if ($formPost.find('.h-post-form-title:contains("回应模式")').length) {
      // 优先找到带 js-reply-mode-row 的行（如果插入时已包含）
      $row = $formPost.find('.js-reply-mode-row').first();
    } else {
      // 原有逻辑：找到 名称 行 作为插入位置
      const $nameRow = $formPost.find('.h-post-form-title').filter(function(){
        return $(this).text().trim() === '名 称';
      }).closest('.h-post-form-grid').first();
      if (!$nameRow.length) return;

      // 插入回应模式行（与原代码结构一致）
      $row = $(`
        <div class="uk-grid uk-grid-small h-post-form-grid js-reply-mode-row">
          <div class="uk-width-1-5">
            <div class="h-post-form-title">回应模式</div>
          </div>
          <div class="h-post-form-input uk-width-3-5 js-reply-mode-text">
            板块名或串号
          </div>
          <div class="h-post-form-option uk-width-1-5">
            <div class="reply-mode-toggle" style="display:flex; flex-direction:row; align-items:center; justify-content:flex-end; gap:6px;">
              <span class="js-reply-extra" style="display:none; display:inline-flex; align-items:center;"></span>
              <button type="button" class="js-toggle-mode" style="display:inline-flex; flex:0 0 auto; align-items:center; width:auto; padding:2px 8px; font-size:13px; cursor:pointer;">切换</button>
            </div>
          </div>
        </div>
      `);

      // 插入到 placeholder 或 名称行之前
      let $insertBefore = $formPost.find('.xdex-placeholder').first();
      if ($insertBefore.length) {
        $insertBefore.before($row);
      } else {
        $nameRow.before($row);
      }
    }

    // 如果当前页面是时间线：不允许发串，隐藏切换按钮并强制设为 回复 模式（但保留临时/连续按钮）
    if (isTimeline) {
      $row.find('.js-toggle-mode').hide();
    }

    // 状态与事件（复用原有逻辑）
    window.replyModeState = { mode: '发串', extra: null };
    function emitReplyModeChange() {
      document.dispatchEvent(new CustomEvent('replyModeChange', { detail: window.replyModeState }));
    }

    // 切换逻辑（保留原版 setMode，外部依赖不变）
    const $modeBtns = $row.find('.js-mode'); // 兼容原代码（若不存在不会报错）
    function setMode(mode, {silent = false} = {}) {
      $modeBtns.removeClass('active').filter('[data-mode="'+mode+'"]').addClass('active');

      if (mode === '发串') {
        $formPost.attr('action', '/Home/Forum/doPostThread.html');
        $row.find('.js-reply-extra').hide().empty();
        $row.find('.js-reply-mode-text').text(boardName);
        window.replyModeState = { mode: '发串', extra: null };

        if (!silent) {
          toast('已切换到 发串 模式');
        }
      } else if (mode === '回复') {
        $formPost.attr('action', '/Home/Forum/doReplyThread.html');

        // 确保 hidden 存在
        let $resto = $formPost.find('input[name="resto"]');
        if (!$resto.length) {
          $resto = $('<input type="hidden" name="resto">').appendTo($formPost);
        }
        let $hash = $formPost.find('input[name="__hash__"]');
        if (!$hash.length) {
          $hash = $('<input type="hidden" name="__hash__">');
          $resto.after($hash); // 保证顺序
        }

        let autofilled = false;

        if (pendingReplyParams) {
          // 自动填充缓存的参数
          $resto.val(pendingReplyParams.resto);
          $hash.val(pendingReplyParams.hash);
          $row.find('.js-reply-mode-text').html(
            `<font color="#789922">No.${pendingReplyParams.tid}</font>`
          );
          const $replyModeText = $row.find('.js-reply-mode-text');
          // 触发扩展引用
          const root = $replyModeText[0];
          if (typeof initExtendedContent === 'function') { try { initExtendedContent(root); } catch(e){} }
          if (typeof initContent === 'function') { try { initContent(root); } catch(e){} }
          //if (typeof autoHideRefView === 'function') { try { autoHideRefView(root); } catch(e){} }

          toast('已自动填充回复串号，请确认无误后再发送');
          pendingReplyParams = null; // 用过一次就清空
          autofilled = true;
        } else {
          // 默认逻辑
          $resto.val('20011114');
          $hash.val('cirns');
          // 对于时间线，默认显示的文本已经在插入表单时写成 `${timeline}-快速回复`，这里保持不变
          if (!isTimeline) {
            $row.find('.js-reply-mode-text').text(boardName + '-快速回复');
          }
        }

        // 插入“临时/连续”按钮（若尚未插入）
        const $extra = $row.find('.reply-mode-toggle .js-reply-extra');
        if (!$extra.children().length) {
          // 包裹容器
          const $wrapper = $('<div class="xdex-file-wrapper" style="display:flex;align-items:center;justify-content:space-between;width:100%;"></div>');

          // “×”按钮
          const $btnReset = $('<button type="button" class="js-reset" style="margin-right:6px;">×</button>');
          $btnReset.on('click', function(){
            // 重置 hidden 值
            $formPost.find('input[name="resto"]').val('20011114');
            $formPost.find('input[name="__hash__"]').val('cirns');

            // 重置显示文本
            if (isTimeline) {
              const timelineNames = {1:'综合线',2:'创作线',3:'非创作线',4:'亚文化线',5:'综合2线',6:'游戏线',7:'生活线'};
              const label = timelineNames[timelineId] || '时间线';
              $row.find('.js-reply-mode-text').text(label + '-快速回复');
            } else {
              $row.find('.js-reply-mode-text').text(boardName + '-快速回复');
            }

            // **清空正文 textarea**
            $formPost.find('textarea.h-post-form-textarea').val('');
            // **清空标题、名称、Email**
            $formPost.find('input[name="title"]').val('');
            $formPost.find('input[name="name"]').val('');
            $formPost.find('input[name="email"]').val('');


            // 重置预览框
            const previewBox = document.querySelector('.h-preview-box');
            if (previewBox) {
              // 获取当前饼干
              const cur = getCurrentCookie();
              const cookieText = cur ? cur.name : '--';

                previewBox.innerHTML = `
                <div class="h-preview-box">
                  <div class="h-threads-item">
                    <div class="h-threads-item-replies">
                      <div class="h-threads-item-reply">
                        <div class="h-threads-item-reply-main">
                          <div class="h-threads-img-box">
                            <div class="h-threads-img-tool uk-animation-slide-top">
                              <span class="h-threads-img-tool-btn h-threads-img-tool-small uk-button-link"><i class="uk-icon-minus"></i>收起</span>
                              <a href=":javascript:;" class="h-threads-img-tool-btn uk-button-link"><i class="uk-icon-search-plus"></i>查看大图</a>
                              <span class="h-threads-img-tool-btn h-threads-img-tool-left uk-button-link"><i class="uk-icon-reply"></i>向左旋转</span>
                              <span class="h-threads-img-tool-btn h-threads-img-tool-right uk-button-link"><i class="uk-icon-share"></i>向右旋转</span>
                            </div>
                            <a class="h-threads-img-a"><img src="" align="left" border="0" hspace="20" class="h-threads-img"></a>
                          </div>
                          <div class="h-threads-info">
                            <span class="h-threads-info-title"></span>
                            <span class="h-threads-info-email"></span>
                            <span class="h-threads-info-createdat">2077-01-01(四)00:00:01</span>
                            <span class="h-threads-info-uid">ID:${cookieText}</span>
                            <span class="h-threads-info-report-btn">
                              [<a href="/f/值班室" target="_blank">举报</a>]
                            </span>
                            <a href=":javascript:;" class="h-threads-info-id" target="_blank">No.9999999</a>
                          </div>
                          <div class="h-threads-content">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>`;
            }
            updatePreviewCookieId();
            toast('已重置');
          });


          // “临时/连续”按钮
          const $btnExtra = $('<button type="button" class="js-extra" data-extra="临时" style="display:inline-flex; flex:0 0 auto; align-items:center; width:auto; padding:2px 8px; font-size:13px; cursor:pointer;">临时</button>');
          $btnExtra.on('click', function(){
            const cur = $(this).attr('data-extra');
            if (cur === '临时') {
              $(this).attr('data-extra','连续').text('连续');
              window.replyModeState = { mode: '回复', extra: '连续' };
              toast('已切换到 连续 回复模式');
            } else {
              $(this).attr('data-extra','临时').text('临时');
              window.replyModeState = { mode: '回复', extra: '临时' };
              toast('已切换到 临时 回复模式');
            }
            emitReplyModeChange();
          });

          // 组装
          $wrapper.append($btnReset).append($btnExtra);
          $extra.append($wrapper);
        }
        $extra.show();


        window.replyModeState = { mode: '回复', extra: '临时' };

        // 只有在没有自动填充时，才显示默认切换提示
        if (!autofilled && !silent) {
          toast('已切换到 回复 模式');
        }
      }
      emitReplyModeChange();
    }

    // 绑定模式按钮（原先存在的行为）
    $modeBtns.on('click', function(){ setMode($(this).attr('data-mode')); });
    // 初始状态：如果是时间线则强制 回复 模式（silent），否则默认静默发串
    if (isTimeline) {
      setMode('回复', {silent: true});
      // extra 模式
      if (SettingPanel.state.replyExtraDefault === '连续') {
        // 模拟点击一次“临时/连续”按钮，或者直接设置
        window.replyModeState.extra = '连续';
        $row.find('.js-extra').attr('data-extra','连续').text('连续');
      }
    } else {
      setMode(SettingPanel.state.replyModeDefault, {silent: true});
      // extra 模式
      if (SettingPanel.state.replyExtraDefault === '连续') {
        window.replyModeState.extra = '连续';
        $row.find('.js-extra').attr('data-extra','连续').text('连续');
      }
    }

    // 切换按钮逻辑（若存在切换按钮）
    $row.find('.js-toggle-mode').on('click', function(){
      if (window.replyModeState.mode === '发串') {
        setMode('回复');
      } else {
        setMode('发串');
      }
    });

    // 监听发送成功信号（兼容原逻辑）
    document.addEventListener('replySuccess', e => {
      if (window.replyModeState?.mode !== '回复') return;
      const $form = $('form[action="/Home/Forum/doReplyThread.html"]').first();

      if (window.replyModeState.extra === '临时') {
        // 重置为默认
        $form.find('input[name="resto"]').val('20011114');
        $form.find('input[name="__hash__"]').val('cirns');
        const displayName = isTimeline
          ? (timelineNameMap[timelineId] || '时间线')
          : boardName;

        $('.js-reply-mode-row .js-reply-mode-text').text(`${displayName}-快速回复`);


        // 广播“临时回复发送成功”
        document.dispatchEvent(new CustomEvent('tempReplySuccess', {
          detail: { key: e.detail?.key, tid: e.detail?.tid }
        }));
      } else if (window.replyModeState.extra === '连续') {
        // 不清理，广播“连续回复发送成功”
        document.dispatchEvent(new CustomEvent('contReplySuccess', {
          detail: { key: e.detail?.key, tid: e.detail?.tid }
        }));
      }
    });

    // ---------- 子函数2：处理带 r= 的串链接点击（复用并兼容时间线插入的表单） ----------
    function bindReplyQuoteLinks() {
      $('body').on('click', 'a[href*="/t/"][href*="r="]', function(e) {
        const url = new URL(this.href, location.origin);
        const tid = url.pathname.split('/')[2];
        const rid = url.searchParams.get('r');
        currentReplyTid = tid;
        if (!tid || !rid) return;
        e.preventDefault();

        const $textarea = $('textarea.h-post-form-textarea');
        if (!$textarea.length) return;

        if (window.replyModeState?.mode === '发串') {
          insertQuote($textarea, rid);

          // 抓取参数并缓存（用于后续切换到 回复 模式 自动填充）
          $.get(`/t/${tid}?r=${rid}`).done(html => {
            const $doc = $(html);
            const restoVal = $doc.find('form[action="/Home/Forum/doReplyThread.html"] input[name="resto"]').val();
            const hashVal  = $doc.find('form[action="/Home/Forum/doReplyThread.html"] input[name="__hash__"]').val();
            if (restoVal && hashVal) {
              pendingReplyParams = { tid, resto: restoVal, hash: hashVal };
            }
          });
        }
        else {
          $.get(`/t/${tid}?r=${rid}`).done(html => {
            const $doc = $(html);
            const restoVal = $doc.find('form[action="/Home/Forum/doReplyThread.html"] input[name="resto"]').val();
            const hashVal  = $doc.find('form[action="/Home/Forum/doReplyThread.html"] input[name="__hash__"]').val();

            if (restoVal && hashVal) {
              const $form = $('form[action="/Home/Forum/doReplyThread.html"]').first();
              $form.find('input[name="resto"]').val(restoVal);
              $form.find('input[name="__hash__"]').val(hashVal);

              // 在回应模式行中显示串号（直接插入 font）
              const $replyModeText = $('.js-reply-mode-row .js-reply-mode-text');
              $replyModeText.html(
                `<font color="#789922" data-darkreader-inline-color="" style="--darkreader-inline-color: var(--darkreader-text-789922, #aec66f);">No.${tid}</font>`
              );

              const root = $replyModeText[0];
              if (typeof initExtendedContent === 'function') { try { initExtendedContent(root); } catch(e){} }
              if (typeof initContent === 'function') { try { initContent(root); } catch(e){} }
              //if (typeof autoHideRefView === 'function') { try { autoHideRefView(root); } catch(e){} }
            }

            if (tid !== rid) {
              insertQuote($textarea, rid);
            }

          });
        }
      });

      function insertQuote($textarea, rid) {
        const start = $textarea.prop('selectionStart');
        const end   = $textarea.prop('selectionEnd');
        const str   = $textarea.val();
        const left  = str.substring(0, start);
        const right = str.substring(end);
        const ref   = `>>No.${rid}`;

        let newVal;
        if (start === 0) {
          newVal = `${ref}\n${right}`;
        } else if (end === str.length) {
          newVal = `${left}\n${ref}\n`;
        } else if (end > start) {
          newVal = `${left} ${ref} ${right}`;
        } else {
          newVal = `${left}\n${ref}${right}`;
        }

        $textarea.val(newVal).trigger('input');
      }
    }

    // ---------- 公用：重新应用页面增强（保持原样） ----------
    // function reapplyPageEnhancements(root = document) {
    //   if (typeof hideEmptyTitleAndEmail === 'function') {try { hideEmptyTitleAndEmail(root); } catch (e) {}}
    //   //if (typeof updateReplyNumbers === 'function') {try { updateReplyNumbers(root); } catch (e) {}}
    //   if (typeof highlightPO === 'function') {try { highlightPO(root); } catch (e) {}}
    //   if (typeof enableHDImageAndLayoutFix === 'function') {try { enableHDImageAndLayoutFix(root); } catch (e) {}}
    //   if (typeof extendQuote === 'function') {try { extendQuote(root); } catch (e) {}}
    //   try { if (typeof applyFilters === 'function') applyFilters(cfg, root); } catch (e) { try { if (typeof applyFilters === 'function') applyFilters(cfg); } catch (e) {} }
    //   if (typeof initExtendedContent === 'function') {try { initExtendedContent(root); } catch (e) {}}
    //   if (typeof initContent === 'function') {try { initContent(root); } catch (e) {}}
    //   if (typeof autoHideRefView === 'function') {try { autoHideRefView(root); } catch (e) {}}
    //   if (typeof enablePostExpand === 'function') {try { aenablePostExpand(); } catch (e) {}}
    // }

    // ---------- 子函数3：板块/时间线快速回复刷新逻辑（已扩展以支持时间线） ----------
    // done 将板块页快速回复-局部刷新修改为增量模式
    function bindBoardQuickReplyRefresh() {
      document.addEventListener('tempReplySuccess', handleBoardQuickReplyRefresh);
      document.addEventListener('contReplySuccess', handleBoardQuickReplyRefresh);

      function handleBoardQuickReplyRefresh(e) {
        // 只在 板块页 或 时间线 页生效
        if (!/^\/f\//.test(location.pathname) && !/\/Forum\/timeline\/id\/\d+/i.test(location.pathname)) return;

        // 优先使用事件 detail 中的 tid，否则用持久变量
        const tid = e.detail?.tid || currentReplyTid;
        if (!tid) return;

        // 不同页面的第一页 URL 构造：
        // - 板块页（/f/）：使用 ?page=1
        // - 时间线（/Forum/timeline/id/X[/page/N]）：去掉 /page/... 部分，得到 base timeline 地址（即第一页）
        let page1Url;
        if (isTimeline) {
          const base = location.pathname.replace(/\/page\/\d+(\.html)?$/i, '').replace(/\/$/, '');
          page1Url = location.origin + base;
        } else {
          page1Url = location.origin + location.pathname + '?page=1';
        }

        fetch(page1Url, { credentials: 'include' })
        .then(res => res.text())
        .then(html => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const newThreadDiv = doc.querySelector(`.h-threads-list div[data-threads-id="${tid}"]`);
          if (!newThreadDiv) return;

          // ——— 离线处理（关键，参考拦截中间页的处理方式） ———
          const fragment = document.createElement('div');
          fragment.appendChild(newThreadDiv.cloneNode(true));

          const cfg2 = (typeof SettingPanel !== 'undefined' && SettingPanel && SettingPanel.state)
            ? SettingPanel.state
            : null;

          // 在离线 fragment 上预处理
          try {
            if (typeof hideEmptyTitleAndEmail === 'function') hideEmptyTitleAndEmail($(fragment));
            if (cfg2 && typeof applyFilters === 'function') applyFilters(cfg2, fragment);
          } catch (e) {
            console.warn('预处理过滤失败', e);
          }

          // 获取处理后的节点
          const processedNode = fragment.firstChild;

          // ——— 替换当前页面所有相同串号的节点 ———
          // document.querySelectorAll(`.h-threads-list div[data-threads-id="${tid}"]`).forEach(oldNode => {
          //   const newNode = processedNode.cloneNode(true);
          //   oldNode.parentNode.replaceChild(newNode, oldNode);
          // });
          // === 改为增量新增：比较新旧回复差异，如有交集，新回复区可与旧回复区合并，否则替换 ===
          document.querySelectorAll(`.h-threads-list div[data-threads-id="${tid}"]`).forEach(oldNode => {
            const oldReplies = Array.from(oldNode.querySelectorAll('.h-threads-item-reply[data-threads-id]'));
            const oldIds = oldReplies.map(r => r.getAttribute('data-threads-id'));
          
            const newReplies = Array.from(processedNode.querySelectorAll('.h-threads-item-reply[data-threads-id]'));
            const newIds = newReplies.map(r => r.getAttribute('data-threads-id'));
          
            // 判断是否有交集
            const hasIntersection = newIds.some(id => oldIds.includes(id));
          
            if (hasIntersection) {
              // 合并：保留旧的，再追加新的（避免重复）
              const oldIdSet = new Set(oldIds);
              for (const reply of newReplies) {
                const tidReply = reply.getAttribute('data-threads-id');
                if (!oldIdSet.has(tidReply)) {
                  oldNode.querySelector('.h-threads-item-replies').appendChild(reply.cloneNode(true));
                }
              }
            } else {
              // 无交集：整块替换
              const newNode = processedNode.cloneNode(true);
              oldNode.parentNode.replaceChild(newNode, oldNode);
            }
          });
          

          // 立即执行视觉相关过滤，避免闪烁
          try { if (typeof hideEmptyTitleAndEmail === 'function') hideEmptyTitleAndEmail(); } catch (e) {}
          try { if (cfg2 && typeof applyFilters === 'function') applyFilters(cfg2); } catch (e) {}
          try { if (typeof enablePostExpand === 'function') enablePostExpand(); } catch (e) {}

          // 延迟执行其他增强
          setTimeout(() => {
            document.querySelectorAll(`.h-threads-list div[data-threads-id="${tid}"]`).forEach(targetNode => {
              try { if (typeof hideEmptyTitleAndEmail === 'function') hideEmptyTitleAndEmail($(targetNode)); } catch (e) {}
              try { if (typeof highlightPO === 'function') highlightPO(targetNode); } catch (e) {}
              try { if (cfg2 && cfg2.enableHDImageAndLayoutFix && typeof enableHDImageAndLayoutFix === 'function') enableHDImageAndLayoutFix(targetNode); } catch (e) {}
              try { if (cfg2 && cfg2.enableHDImage && typeof enableHDImage === 'function') enableHDImage(targetNode); } catch (e) {}
              try { if (cfg2 && cfg2.enableLinkBlank && typeof runLinkBlank === 'function') runLinkBlank(targetNode); } catch (e) {}
              try { if (cfg2 && cfg2.extendQuote && typeof extendQuote === 'function') extendQuote(targetNode); } catch (e) {}
              try { if (typeof initContent === 'function') initContent(targetNode); } catch (e) {}
              try { if (typeof initExtendedContent === 'function') initExtendedContent(targetNode); } catch (e) {}
              //try { if (typeof autoHideRefView === 'function') autoHideRefView(targetNode); } catch (e) {}
            });
            enableHDImageAndLayoutFix(document);
            enableHDImage(document);
            try { if (cfg2 && cfg2.enableQuotePreview && typeof enableQuotePreview === 'function') enableQuotePreview(); } catch (e) {}
            try { if (typeof applyFilters === 'function') applyFilters(cfg2); } catch (e) {}
            try { if (typeof enablePostExpand === 'function') enablePostExpand(); } catch (e) {}
          }, 50);

            // --------- 确保重新应用标记与屏蔽 ---------
            // 说明：有两点防护：
            //  1) 使用 try/catch 防止 applyFilters 抛错中断其它逻辑；
            //  2) 对 cfg 做存在性回退（优先使用已存在的 cfg；没有时回退到 SettingPanel.state；再没有则不给参数调用，且吞掉异常）
            try {
              if (typeof applyFilters === 'function') {
                // 优先使用当前作用域的 cfg（如果存在），否则尝试使用 SettingPanel.state（你的函数中多次引用过）。
                const _cfg = (typeof cfg !== 'undefined') ? cfg
                            : (typeof SettingPanel !== 'undefined' && SettingPanel && SettingPanel.state) ? SettingPanel.state
                            : null;

                if (_cfg) {
                  // 正常调用（大多数情况会走到这里）
                  applyFilters(_cfg);
                } else {
                  // 没有可用配置对象时，仍尝试一次无参调用以兼容极少数实现（但捕获其可能抛出的异常）
                  try { applyFilters(); } catch (e) { /* 忽略 */ }
                }
              }
            } catch (e) {
              // 保守地记录错误（不抛出），以免阻断页面其它增强逻辑
              console.warn('applyFilters reapply failed:', e);
            }


          // 临时模式下刷新完成后清空持久变量
          if (e.type === 'tempReplySuccess') {
            currentReplyTid = null;
          }
        })
        .catch(() => toast('刷新板块串失败'));
      }
    }

    // 统一调用
    bindReplyQuoteLinks();
    bindBoardQuickReplyRefresh();

  }

  // === 通用：确保某个元素被折叠（幂等） ===
  function ensureCollapsed($elem, hint) {
    if (!$elem || !$elem.length) return;
    if ($elem.data('xdex-collapsed')) return; // 已折叠过
    Utils.collapse($elem, hint);
  }

  /* --------------------------------------------------
   * tag 16. 允许展开/收起被板块页折叠的长串
   * -------------------------------------------------- */
  function enablePostExpand() {
    // 注入样式（同前，保留 overflow-anchor: none）
    (function ensureExpandedStyle() {
      const id = 'h-expanded-style';
      if (document.getElementById(id)) return;
      const style = document.createElement('style');
      style.id = id;
      style.textContent = `
        html, body {
          overflow-y: scroll !important;
        }
        .h-threads-item-index.expanded {
          max-height: none !important;
          overflow-y: scroll !important;
          overflow-anchor: none !important;
        }
      `;
      document.head.appendChild(style);
    })();

    let lastExpandedItem = null;
    // 根据 SettingPanel.state 读取是否开启“全部展开”模式
    const expandAllMode = !!(typeof SettingPanel !== 'undefined' && SettingPanel.state && SettingPanel.state.enablePostExpandAll);

    const docScroller = document.scrollingElement || document.documentElement;

    // 获取可滚动容器（从 startEl 本身开始向上查找）
    function getScrollContainer(startEl) {
      let el = startEl || document.body;
      while (el && el !== document.body) {
        const style = getComputedStyle(el);
        const canScroll = /(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight;
        if (canScroll) return el;
        el = el.parentElement;
      }
      return docScroller;
    }

    // 获取 scroller 的可视区域（相对 window 的坐标）
    function getViewportRect(scroller) {
      if (scroller === docScroller || scroller === document.body || scroller === document.documentElement) {
        return { top: 0, bottom: window.innerHeight };
      }
      const r = scroller.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom };
    }

    // 判断元素在 scroller 可视区域内是否“可见”（任何像素可见视为可见）
    function isPartiallyInViewport(el, scroller) {
      if (!el) return false;
      const er = el.getBoundingClientRect();
      const vr = getViewportRect(scroller);
      const visibleTop = Math.max(er.top, vr.top);
      const visibleBottom = Math.min(er.bottom, vr.bottom);
      const visible = Math.max(0, visibleBottom - visibleTop);
      return visible > 0;
    }

    // 元素相对于 scroller 内容起点的绝对 top（用于锚点测量）
    function getElementAbsTop(el, scroller) {
      const er = el.getBoundingClientRect();
      if (scroller === docScroller || scroller === document.body || scroller === document.documentElement) {
        return er.top + window.scrollY;
      } else {
        const sr = scroller.getBoundingClientRect();
        return er.top - sr.top + scroller.scrollTop;
      }
    }

    // 根据 scroller 类型执行滚动补偿
    function scrollByCompensation(scroller, dy) {
      if (!dy) return;
      if (scroller === docScroller || scroller === document.body || scroller === document.documentElement) {
        window.scrollBy({ top: dy, left: 0, behavior: 'auto' });
      } else {
        scroller.scrollTop += dy;
      }
    }

    // 找到下一个 sibling thread
    function findNextThread(item) {
      let el = item.nextElementSibling;
      while (el) {
        if (el.classList && el.classList.contains('h-threads-item-index')) return el;
        el = el.nextElementSibling;
      }
      return null;
    }

    // 关键：收起时智能补偿
    function collapseWithoutShift(item) {
      // === 新增：顶部保护逻辑 ===
      const postForm = document.getElementById('h-post-form');
      if (postForm && isPartiallyInViewport(postForm, docScroller)) {
        // 在顶部时，只移除 expanded，不做任何滚动补偿
        item.classList.remove('expanded');
        return;
      }
      // === 排除公用折叠目标（如回复表单）===
      if (item.classList.contains('qp-reply-form') ||
          item.classList.contains('xdex-generic-collapsed') ||
          item.closest('.xdex-generic-toggle')) {
        item.classList.remove('expanded'); // 仅移除 expanded，不做滚动补偿
        return;
      }

      const scroller = getScrollContainer(item);
      const scrollerIsDoc = (scroller === docScroller || scroller === document.body || scroller === document.documentElement);
      const next = findNextThread(item);
      const nextVisible = isPartiallyInViewport(next, scroller);

      // --- 新增：判断当前 scroller 中可见的串数量（部分可见即算可见）
      const threadContainer = scrollerIsDoc ? document : scroller;
      const allThreadsInScroller = Array.from(threadContainer.querySelectorAll('.h-threads-item-index'));
      const visibleThreads = allThreadsInScroller.filter(t => isPartiallyInViewport(t, scroller));

      // Special case:
      // 如果视窗中**仅有**当前这个被展开的串（即 visibleThreads.length === 1 且该唯一可见项就是 item），
      // 并且存在下一个串 next，则收起后把 next 的顶部滚动到视窗顶部的 1/3 处。
      if (visibleThreads.length === 1 && visibleThreads[0] === item && next) {
        // 先收起
        item.classList.remove('expanded');

        // 等两帧，保证布局稳定后测量并滚动：目标是让 next 的顶部到达当前滚动位置 + viewportHeight/3
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            try {
              const vr = getViewportRect(scroller);
              const vHeight = Math.max(1, vr.bottom - vr.top); // 视口高度（相对于 window 的 rect）
              const currentScroll = scrollerIsDoc ? window.scrollY : scroller.scrollTop;

              // next 的“绝对 top（相对于 scroller 内容起点）”
              const nextAbsTop = getElementAbsTop(next, scroller);

              // 希望 next 的 absTop = currentScroll + vHeight/3
              const desiredAbsTop = currentScroll + Math.floor(vHeight / 3);
              const delta = nextAbsTop - desiredAbsTop;

              if (delta !== 0) {
                scrollByCompensation(scroller, delta);
              }
            } catch (err) {
              // 回退到原有的高度差补偿（保险）
              try {
                const preScroll = scrollerIsDoc ? window.scrollY : scroller.scrollTop;
                const preHeight = scroller.scrollHeight;
                requestAnimationFrame(() => {
                  const postHeight = scroller.scrollHeight;
                  const d = preHeight - postHeight;
                  if (d > 0) {
                    const target = Math.max(0, preScroll - d);
                    if (scrollerIsDoc) window.scrollTo({ top: target, left: 0, behavior: 'auto' });
                    else scroller.scrollTop = target;
                  }
                });
              } catch (e2) {
                console.warn('collapseWithoutShift special-case fallback 异常：', e2);
              }
            }
          });
        });
        return;
      }

      // --- 若下方串当前可见，优先使用 height-delta（与你现有第一版逻辑一致）
      if (nextVisible) {
        const preScroll = scrollerIsDoc ? window.scrollY : scroller.scrollTop;
        const preHeight = scroller.scrollHeight;
        item.classList.remove('expanded');
        requestAnimationFrame(() => {
          const postHeight = scroller.scrollHeight;
          const delta = preHeight - postHeight;
          if (delta > 0) {
            const target = Math.max(0, preScroll - delta);
            if (scrollerIsDoc) {
              window.scrollTo({ top: target, left: 0, behavior: 'auto' });
            } else {
              scroller.scrollTop = target;
            }
          }
        });
        return;
      }

      // --- 否则使用锚点绝对 top 的测量（fallback）
      const anchor = item; // 当下方不可见时，以当前 item 为锚
      const preAbsTop = getElementAbsTop(anchor, scroller);

      item.classList.remove('expanded');

      // 等两帧，保证布局稳定后测量并补偿
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const postAbsTop = getElementAbsTop(anchor, scroller);
          const delta = preAbsTop - postAbsTop;
          if (delta !== 0) {
            scrollByCompensation(scroller, delta);
          } else {
            // 保险回退（与第一版兼容）
            try {
              const preScroll = scrollerIsDoc ? window.scrollY : scroller.scrollTop;
              const preHeight = scroller.scrollHeight;
              requestAnimationFrame(() => {
                const postHeight = scroller.scrollHeight;
                const d = preHeight - postHeight;
                if (d > 0) {
                  const target = Math.max(0, preScroll - d);
                  if (scrollerIsDoc) window.scrollTo({ top: target, left: 0, behavior: 'auto' });
                  else scroller.scrollTop = target;
                }
              });
            } catch (err) {
              console.warn('collapseWithoutShift fallback 异常：', err);
            }
          }
        });
      });
    }

    // 外部点击收起：兼容两种模式（常规 / 全部展开）
    function outsideHandler(e) {
      // 忽略公用折叠占位符点击
      if (e.target.closest('.xdex-placeholder.xdex-generic-toggle')) return;

      const cfg = (typeof SettingPanel !== 'undefined' && SettingPanel.state) ? SettingPanel.state : {};
      const isAllMode = !!cfg.enablePostExpandAll;

      if (!isAllMode) {
        // 必须在 #h-content 内
        const hContent = document.getElementById('h-content');
        if (!hContent || !hContent.contains(e.target)) return;

        // 找到所有 .h-threads-list，判断点击是否在任一 list 的垂直范围内
        const threadLists = document.querySelectorAll('#h-content .h-threads-list');
        if (!threadLists.length) return;

        //const y = e.clientY;
        let isInAnyList = false;
        for (const list of threadLists) {
          const listRect = list.getBoundingClientRect();
          if (y >= listRect.top && y <= listRect.bottom) {
            isInAnyList = true;
            break;
          }
        }
        if (!isInAnyList) return;
        const x = e.clientX;
        const y = e.clientY;
        if (y < listRect.top || y > listRect.bottom) return;

        // 点击在 uk-container 内部不处理（排除串内部及其包裹容器）
        if (e.target.closest('.uk-container')) return;

        // 如果没有记录到最后被展开的串，则不处理
        if (!lastExpandedItem) return;

        // 确保 lastExpandedItem 仍在 DOM 中
        if (!document.contains(lastExpandedItem)) {
          lastExpandedItem = null;
          return;
        }

        // 获取被展开串的 rect
        const rect = lastExpandedItem.getBoundingClientRect();

        // 若点击纵坐标不在该串的垂直范围内，则不收起
        const V_TOL = 2; // 垂直容差（像素）
        if (y < rect.top - V_TOL || y > rect.bottom + V_TOL) return;

        // 若点击点在该串的水平内部范围内，不收起；只在左右明确外围才收起
        if (x >= rect.left && x <= rect.right) return;

        // 排除点击在上方兄弟元素内
        let p = lastExpandedItem.parentElement;
        while (p && p !== document.body) {
          for (let sib = p.firstElementChild; sib && sib !== lastExpandedItem; sib = sib.nextElementSibling) {
            if (sib.contains(e.target)) {
              return;
            }
          }
          if (p.classList && p.classList.contains('h-threads-list')) break;
          p = p.parentElement;
        }

        // 触发收起
        const btn = lastExpandedItem.querySelector('.h-threads-info .js-toggle-mode');
        if (btn) btn.textContent = '展开';
        collapseWithoutShift(lastExpandedItem);
        lastExpandedItem = null;
        return;
      }

      // ===== 全部展开模式保留原逻辑，但同样采用“纵向带 + 排除 uk-container” =====
      const hContent = document.getElementById('h-content');
      if (!hContent || !hContent.contains(e.target)) return;

      const threadLists = document.querySelectorAll('#h-content .h-threads-list');
      if (!threadLists.length) return;

      const y = e.clientY;
      let isInAnyList = false;
      for (const list of threadLists) {
        const listRect = list.getBoundingClientRect();
        if (y >= listRect.top && y <= listRect.bottom) {
          isInAnyList = true;
          break;
        }
      }
      if (!isInAnyList) return;

      // 点击在 uk-container 内部不处理
      if (e.target.closest('.uk-container')) return;

      const threads = Array.from(document.querySelectorAll('.h-threads-item-index'));
      if (!threads.length) return;

      let target = threads.find(t => {
        const r = t.getBoundingClientRect();
        return y >= r.top && y <= r.bottom;
      });

      if (!target) {
        let min = Infinity;
        for (const t of threads) {
          const r = t.getBoundingClientRect();
          const d = Math.min(Math.abs(y - r.top), Math.abs(y - r.bottom));
          if (d < min) { min = d; target = t; }
        }
      }

      if (target && target.classList.contains('expanded')) {
        const btn = target.querySelector('.h-threads-info .js-toggle-mode');
        if (btn) btn.textContent = '展开';
        collapseWithoutShift(target);
      }
    }

    // 添加按钮
    document.querySelectorAll('.h-threads-item-index').forEach(item => {
      // === 新增：跳过主串自身被折叠的情况（不包括串内回复被折叠） ===
      // 只检查 item 的直接子元素中是否有折叠占位符，不深入检查回复区域
      const directPlaceholder = Array.from(item.children).find(child =>
        child.classList.contains('xdex-placeholder') &&
        child.classList.contains('xdex-generic-toggle')
      );
      if (directPlaceholder) return;

      const infoBar = item.querySelector('.h-threads-info');
      if (!infoBar) return;
      if (infoBar.querySelector('.js-toggle-mode')) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'js-toggle-mode';
      btn.style.cssText = 'display:inline-flex; align-items:center; width:auto; padding:2px 8px; font-size:13px; cursor:pointer;';
      btn.textContent = '展开';

      // 如果是“全部展开”模式，启动就设为展开状态
      if (expandAllMode) {
          item.classList.add('expanded');
          btn.textContent = '收起';
        }

            btn.addEventListener('click', e => {
              e.stopPropagation();
              const willExpand = !item.classList.contains('expanded');
              if (willExpand) {
                item.classList.add('expanded');
                btn.textContent = '收起';
                lastExpandedItem = item;
              } else {
                btn.textContent = '展开';
                collapseWithoutShift(item);
                if (lastExpandedItem === item) lastExpandedItem = null;
              }
            });

      infoBar.appendChild(btn);
    });
    // === 初始化时根据设置自动全部展开 ===
    try {
        const expandAll = !!(typeof SettingPanel !== 'undefined' && SettingPanel.state && SettingPanel.state.enablePostExpandAll);
        if (expandAll) {
          setTimeout(() => {
            document.querySelectorAll('.h-threads-item-index').forEach(item => {
              const btn = item.querySelector('.h-threads-info .js-toggle-mode');
              if (btn && !item.classList.contains('expanded')) btn.click();
            });
          }, 100);
        }
      } catch (err) {
        console.warn('自动全部展开失败：', err);
      }

    // 绑定外部点击
    const hContent = document.getElementById('h-content');
    if (hContent) {
      hContent.removeEventListener('click', outsideHandler, true);
      hContent.addEventListener('click', outsideHandler, true);
    }
  }

  /* --------------------------------------------------
   * tag 17. 替换搜索按钮为野生搜索酱（来自4sYbzEX https://www.nmbxd.com/t/64792841）
   * -------------------------------------------------- */
  function searchServiceBy4sY() {
    const btn = document.querySelector('#h-menu-search-keyword');
    if (!btn) return; // 若按钮不存在则不处理

    // 移除原有的 href 与默认跳转行为
    btn.removeAttribute('href');
    btn.removeEventListener('click', btn._4sYHandler || (()=>{}));

    // 定义新的点击事件
    const handler = (e) => {
      e.preventDefault();
      window.open('https://nmb-search.166666666.xyz/', '_blank');
    };

    // 绑定事件
    btn.addEventListener('click', handler);

    // 保存 handler 以便后续移除时使用（防止重复绑定）
    btn._4sYHandler = handler;
  }

  /* --------------------------------------------------
   * tag 18. 侧栏收起（来自acVMxuvhttps://greasyfork.org/zh-CN/scripts/553143-x%E5%B2%9B%E4%BC%98%E5%8C%96%E5%B2%9B-%E4%BE%A7%E8%BE%B9%E6%A0%8F%E4%BC%98%E5%8C%96%E7%89%88）
   * -------------------------------------------------- */
  function toggleSidebar() {
    // --- 侧边栏自动收起功能 ---
    const hMenuDiv = document.getElementById('h-menu');
    if (hMenuDiv) {
        // 1. 创建一个新的触发区域元素
        const triggerZone = document.createElement('div');

        // 2. 设置触发区域的样式
        // 它将是一个位于屏幕左侧的、透明的、固定宽度的垂直条
        triggerZone.style.position = 'fixed';
        triggerZone.style.left = '0';
        triggerZone.style.top = '0';
        triggerZone.style.width = '100px'; // 触发区域宽度，可以根据需要调整
        triggerZone.style.height = '100vh'; // 高度占满整个屏幕
        triggerZone.style.zIndex = '800'; // 确保它在大多数元素之上，但在菜单之下
        // triggerZone.style.backgroundColor = 'rgba(255, 0, 0, 0.2)'; // 取消此行注释以可视化触发区域

        // 3. 将触发区域添加到页面中
        document.body.appendChild(triggerZone);

        // 4. 设置侧边栏的初始样式为折叠
        hMenuDiv.style.transition = 'width 0.3s ease'; // 添加平滑过渡效果
        hMenuDiv.style.width = '0';
        hMenuDiv.style.overflow = 'hidden';
        hMenuDiv.style.zIndex = '999'; // 确保菜单在触发区域之上

        // 5. 为新的触发区域添加鼠标悬停事件，用于展开侧边栏
        triggerZone.addEventListener('mouseover', function() {
            hMenuDiv.style.width = '200px'; // 展开侧边栏
            hMenuDiv.style.overflow = 'visible';
        });

        // 6. 为侧边栏本身添加鼠标移出事件，用于收起侧边栏
        hMenuDiv.addEventListener('mouseleave', function() {
            hMenuDiv.style.width = '0'; // 收起侧边栏
            hMenuDiv.style.overflow = 'hidden';
        });
    }
  }

  /* --------------------------------------------------
   * tag 19. 替换顶栏图片点击事件，串内刷新，板块页回到首页
   * -------------------------------------------------- */
  function overrideTopImageClick() {
    const topImgLink = document.querySelector('#h-menu-top-img');
    if (!topImgLink) return;

    // 判断是否是串内页
    function isThreadPage(path) {
        return /\/t\/\d{4,}/.test(path) || /^\/Forum\/po\/id\/\d+/.test(path);
    }

    // 判断是否是板块页
    function isBoardPage(path) {
        return /^\/f\//.test(path) || /^\/Forum\/timeline\/id\/\d+/.test(path);
    }

    topImgLink.addEventListener('click', function(e) {
        e.preventDefault();
        const path = location.pathname;
        let url = location.href;

        if (isThreadPage(path)) {
            // 串内页：刷新当前页面
            location.reload();
        } else if (isBoardPage(path)) {
            // 板块页：跳转到第一页
            if (/\/Forum\/timeline\/id\/\d+\/page\/\d+\.html/.test(url)) {
                url = url.replace(/\/page\/\d+\.html/, '/page/1.html');
            } else if (/\/f\/.+\?page=\d+/.test(url)) {
                url = url.replace(/page=\d+/, 'page=1');
            }
            location.href = url;
        } else {
            // 其他情况：跳转首页
            location.href = '/';
        }
    });
  }

  /* --------------------------------------------------
   * tag -1. 入口初始化
   * -------------------------------------------------- */
  window.addEventListener('load', () => enableHDImageAndLayoutFix(document));

  $(document).ready(() => {
    SettingPanel.init();
    const cfg = Object.assign({}, SettingPanel.defaults, GM_getValue(SettingPanel.key, {}));
    replyQuicklyOnBoardPage();                                      //板块页快速回复模式切换
    if (cfg.enableCookieSwitch)          createCookieSwitcherUI();  //快捷切换饼干
    if (cfg.enablePaginationDuplication) duplicatePagination();     //添加页首页码
    if (cfg.disableWatermark)            disableWatermark();        //关闭图片水印
    if (cfg.updatePreviewCookie)         updatePreviewCookieId();   //预览真实饼干
    if (cfg.hideEmptyTitleEmail) {hideEmptyTitleAndEmail();         //隐藏无名氏/无标题/回复/发串/版规
      Utils.collapse($('.h-forum-header'), '『版规』');
      Utils.collapse($('form[action="/Home/Forum/doReplyThread.html"]'), '『回复』');
      Utils.collapse($('form[action="/Home/Forum/doPostThread.html"]'), '『发串』');
      }                                                              //折叠版规-发串-回复
    if (cfg.enableExternalImagePreview)  ExternalImagePreview.init();//显示外部图床
    //if (cfg.updateReplyNumbers)          updateReplyNumbers();     //添加回复编号
    if (cfg.enableSeamlessPaging)        initSeamlessPaging();       //自动-手动无缝翻页
    if (cfg.enableHDImageAndLayoutFix)   enableHDImageAndLayoutFix(document);    //X岛-揭示板的增强型体验-高清图片链接+图片控件
    if (cfg.enableHDImageAndLayoutFix)   enableHDImage(document);    //X岛-揭示板的增强型体验-高清图片链接+图片控件
    if (cfg.enableLinkBlank)             runLinkBlank();             //X岛-揭示板的增强型体验-新标签打开串
    if (cfg.enableQuotePreview)          enableQuotePreview();       //优化引用弹窗
    replaceRightSidebar();                                           //扩展坞增强
    interceptReplyForm();                                            //拦截回复中间页
    if (cfg.extendQuote)                 extendQuote();              //扩展引用格式
    kaomojiEnhancer();                                               //颜文字拓展
    highlightPO();                                                   //高亮Po主
    enhancePostFormLayout();                                         //发帖UI调整
    applyFilters(cfg);                                               //标记/屏蔽/过滤-饼干/关键词
    initExtendedContent();                                           //扩展引用
    //autoHideRefView();                                               //原生引用弹窗自动隐藏
    enablePostExpand();                                              //添加串展开-折叠按钮
    searchServiceBy4sY();                                            //野生搜索酱
    monitorRefView();                                                //监视引用弹窗变化
    //preventContentOverflow();                                      //防止内容超出浏览器边缘-已合并入enableHDImageAndLayoutFix
    if (cfg.toggleSidebar)               toggleSidebar();            //侧边栏收起功能
    overrideTopImageClick();                                         //替换顶栏图片点击事件
    enhanceIsland({                                                  //增强X岛匿名版
      // 这些都可选，默认全开
      enablePreview: true,                                           //添加预览框
      enableDraft: true,                                             //草稿保存/恢复
      enableAutoTitle: true,                                         //自动设置网页标题
      enableRelativeTime: true,                                      //人类友好时间显示
      enableQuoteInsert: true,                                       //点击 No.xxxx 插入引用
      enablePasteImage: true,                                        //粘贴剪贴板图片到文件输入
      // 可传入你的 jQuery 实例（若页面没有全局 $）
      // $: window.myJQ
    });


    // 保存原始函数
    const _initContent = window.initContent;

    // 将X岛原版https://www.nmbxd1.com/Public/Js/h.desktop.js中作用于引用的initContent函数支持我们新增的非标准引用格式
    window.initContent = function(root) {
        // 先执行原始逻辑
        if (typeof _initContent === 'function') {
            _initContent(root);
        }
        // 再执行扩展逻辑
        initExtendedContent(root || document);
    };
    initContent(document);

    // 屏蔽原站点的 initImageBox，改由 enableHDImageAndLayoutFix 负责初始化
    // window.initImageBox = function() {
    //   // 屏蔽原站点的逻辑
    //   console.debug("initImageBox 已被屏蔽，由 enableHDImageAndLayoutFix 接管");
    // };

    document.querySelectorAll('form textarea[name="content"]').forEach(bindCtrlEnter);
    // 自动刷新并提示当前饼干，我不知道为什么必须写在这里。
    function autoRefreshCookiesToast() {
      try {
        if (typeof refreshCookies !== 'function') return;
        refreshCookies(() => {
          const list = getCookiesList();
          if (!list || !Object.keys(list).length) return;
          const cur = getCurrentCookie();
          const nm = cur && cur.name ? abbreviateName(cur.name) : '未知';
          if (cfg.enableAutoCookieRefreshToast) {
              toast(`自动刷新成功！当前饼干为 ${nm}`);
                }
        }, false); // ★ 不显示默认toast
      } catch (e) {
        console.warn('自动刷新饼干失败', e);
      }
    }

    // 仅在“从其它标签页切回到本标签页”时刷新
    const TAB_ACTIVE_KEY = 'xdex_active_tab';
    const tabId = Date.now() + '_' + Math.random().toString(36).slice(2);

    try {
      if (document.visibilityState === 'visible') {
        localStorage.setItem(TAB_ACTIVE_KEY, JSON.stringify({ id: tabId, t: Date.now() }));
      }
    } catch {}

    // ✅ 加上开关判断
    if (cfg.enableAutoCookieRefresh) {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState !== 'visible') return;
          try {
            const last = JSON.parse(localStorage.getItem(TAB_ACTIVE_KEY) || 'null');
            if (last && last.id && last.id !== tabId) {
              autoRefreshCookiesToast();
            }
            localStorage.setItem(TAB_ACTIVE_KEY, JSON.stringify({ id: tabId, t: Date.now() }));
          } catch (e) {
            try {
              localStorage.setItem(TAB_ACTIVE_KEY, JSON.stringify({ id: tabId, t: Date.now() }));
            } catch {}
          }
      }, { passive: true });
    }

    // 全局：在运行时立即应用“全部展开 / 全部收起”模式
    window.applyPostExpandAllMode = function(enable) {
      const threads = Array.from(document.querySelectorAll('.h-threads-item-index'));
      if (!threads.length) return;

      if (enable) {
        // 全部展开（立即把每个 item 加上 expanded，并把按钮设为 收起）
        threads.forEach(item => {
          const btn = item.querySelector('.h-threads-info .js-toggle-mode');
          if (!item.classList.contains('expanded')) item.classList.add('expanded');
          if (btn) btn.textContent = '收起';
        });
      } else {
        // 全部收起：对每个已展开的串依次调用 collapseWithoutShift，
        // 用 setTimeout 分批执行以给每次补偿留出一帧时间，尽量避免跳动累积。
        let delayIdx = 0;
        threads.forEach(item => {
          if (!item.classList.contains('expanded')) return;
          const d = delayIdx++ * 45; // 45ms 间隔（经验值）
          setTimeout(() => {
            const btn = item.querySelector('.h-threads-info .js-toggle-mode');
            if (btn) btn.textContent = '展开';
            try { collapseWithoutShift(item); } catch (err) { // 防守
              try { item.classList.remove('expanded'); } catch(e){}
            }
          }, d);
        });
      }
    };

  });

})(jQuery);
