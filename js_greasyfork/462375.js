// ==UserScript==
// @name         微信读书
// @namespace    http://tampermonkey.net/
// @version      0.60
// @description  修改背景颜色、字体颜色，阅读时宽屏，隐藏按钮和菜单
// @author       Oscar
// @match        https://weread.qq.com/web/reader/*
// @license      AGPL License
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/462375/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/462375/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6.meta.js
// ==/UserScript==

setTimeout(() => {
(() => {
    /* 1. 预设与持久化 */
    const BG = ['#FFFFFF', '#F9F3E3', '#E8F5E9', '#000000'];
    const FG = ['#FFFFFF', '#0A1F44', '#39FF14'];
    let bg = GM_getValue('wr_bgColor') || BG[0];
    let fg = GM_getValue('wr_fontColor') || FG[1];
    let useDefaultFg = GM_getValue('wr_useDefaultFg') || false;

    /* 2. 颜色变量样式 */
    let styleRules = `
    :root{--wr-bg:${bg};${!useDefaultFg ? `--wr-fg:${fg}` : ''}}
    .wr_whiteTheme .readerContent .app_content,
    .wr_whiteTheme .wr_horizontalReader .readerChapterContent,
    .wr_whiteTheme .wr_horizontalReader .readerControls_fontSize {
        background: var(--wr-bg) !important;
        ${!useDefaultFg ? 'color: var(--wr-fg) !important;' : ''}
    }

    .wr_whiteTheme .readerContent .app_content * ,
    .wr_whiteTheme .wr_horizontalReader .readerChapterContent * ,
    .wr_whiteTheme .wr_horizontalReader .readerControls_fontSize * {
        ${!useDefaultFg ? 'color: var(--wr-fg) !important;' : ''}
    }
`;

    GM_addStyle(styleRules);

    /* 3. 固定样式 */
    GM_addStyle(`
    #tm{font:14px sans-serif;color:#333;line-height:1.4}
    #tm .ttl{margin:6px 0 4px;font-weight:600}
    #tm .row{display:flex;align-items:center;gap:8px;margin-bottom:6px}
    #tm .sw{width:24px;height:24px;border:1px solid #aaa;cursor:pointer}
    #tm .sw:hover{outline:2px solid #888}
    #tm input[type=color]{width:24px;height:24px;border:1px solid #aaa;padding:0;cursor:pointer}
    #tm .ok{margin-left:auto;padding:2px 12px;font-size:13px;cursor:pointer;border-radius:4px;border:1px solid #3e8ef7;background:#3e8ef7;color:#fff;transition:.15s}
    #tm .ok:hover{background:#66a9ff}
    #tm .ok:active{background:#2e7be6}
    .cp .icon{font-size:28px;display:flex;justify-content:center;align-items:center;width:100%;height:100%}
    img.wr_readerImage_opacity{opacity:.8!important}
    .readerControls{margin-left:calc(50% - 60px)!important}
    .app_content,.readerTopBar{max-width:100%!important}
    .readerControls,.readerTopBar{opacity:0;transition:opacity .2s}
    .readerControls:hover,.readerTopBar:hover,.readerControls.tm-show{opacity:1!important}
    .readerCatalog,.readerAIChatPanel,.readerNotePanel{left:unset!important;right:0!important}

    /* 双栏阅读模式 */
    .wr_horizontalReader .wr_horizontalReader_app_content,
    .wr_horizontalReader .readerChapterContent_container,
    .wr_horizontalReader .readerChapterContent,
    .wr_horizontalReader .renderTargetContainer,
    .wr_horizontalReader .wr_canvasContainer {
        width: 100vw !important;
        max-width: 100vw !important;
        margin: 0 auto !important;
        padding: 0 !important;
        position: static !important;
    }

    .wr_horizontalReader .readerChapterContent,
    .wr_horizontalReader .readerChapterContent_container {min-height: 100vh !important;}
    .wr_horizontalReader .readerControls {position: fixed !important; right: 16px !important;}
  `);

    /* 4. 轮询等待底栏 */
    let attempts = 0;
    const iv = setInterval(() => {
        const ctl = document.querySelector('.readerControls');
        if (ctl) {
            clearInterval(iv);
            try { init(ctl); } catch (err) { console.error('[取色面板] 初始化失败:', err); }
        } else if (++attempts > 15) {
            clearInterval(iv);
        }
    }, 200);

    /* 5. 初始化面板 */
    function init(controls) {
        const btn = document.createElement('button');
        btn.className = 'readerControls_item cp';
        btn.title = '取色';
        btn.innerHTML = '<span class="icon">🎨</span>';
        controls.prepend(btn);

        const panel = document.createElement('div');
        panel.id = 'tm';
        panel.style.cssText = 'display:none;position:fixed;width:220px;z-index:9999;background:#fff;border:1px solid #ccc;border-radius:6px;padding:6px';
        panel.innerHTML = `
      <div class="ttl">背景色</div>
      <div class="row">
        ${BG.map(c => `<div class="sw b" data-c="${c}" style="background:${c}"></div>`).join('')}
        <label style="display:flex;align-items:center;gap:4px">自定义:<input type="color" class="cb" value="${bg}"></label>
      </div>
      <div class="ttl">字体色</div>
      <div class="row">
        <div class="sw f default" data-default="true" title="默认字体色" style="background:repeating-conic-gradient(#ccc 0% 25%, transparent 0% 50%) 50% / 10px 10px"></div>
        ${FG.map(c => `<div class="sw f" data-c="${c}" style="background:${c}"></div>`).join('')}
        <label style="display:flex;align-items:center;gap:4px">自定义:<input type="color" class="cf" value="${fg}"></label>
      </div>
      <div class="row"><button class="ok">应用</button></div>`;
        document.body.append(panel);

        const cBg = panel.querySelector('.cb');
        const cFg = panel.querySelector('.cf');

        const show = () => { locate(); panel.style.display = 'block'; controls.classList.add('tm-show'); };
        const hide = () => { panel.style.display = 'none'; controls.classList.remove('tm-show'); };
        btn.onclick = e => { e.stopPropagation(); panel.style.display === 'block' ? hide() : show(); };
        document.addEventListener('click', e => {
            if (panel.style.display === 'block' && !panel.contains(e.target) && !btn.contains(e.target)) hide();
        }, true);

        panel.addEventListener('click', e => {
            const sw = e.target.closest('.sw');
            if (sw) {
                if (sw.classList.contains('b')) {
                    bg = sw.dataset.c;
                    cBg.value = bg;
                } else {
                    if (sw.dataset.default) {
                        useDefaultFg = true;
                        fg = '';
                    } else {
                        useDefaultFg = false;
                        fg = sw.dataset.c;
                        cFg.value = fg;
                    }
                }
                return;
            }
            if (e.target.classList.contains('ok')) {
                GM_setValue('wr_bgColor', bg);
                GM_setValue('wr_fontColor', fg);
                GM_setValue('wr_useDefaultFg', useDefaultFg);

                document.documentElement.style.setProperty('--wr-bg', bg);
                if (!useDefaultFg) {
                    document.documentElement.style.setProperty('--wr-fg', fg);
                } else {
                    document.documentElement.style.removeProperty('--wr-fg');
                }
                hide();
            }
        });

        cBg.oninput = e => { bg = e.target.value; };
        cFg.oninput = e => { fg = e.target.value; useDefaultFg = false; };

        function locate() {
            const { left, top } = btn.getBoundingClientRect();
            panel.style.left = (left - 250) + 'px';
            panel.style.top = top + 'px';
        }
    }

    //修改注释气泡位置，确保不超出屏幕
    const noteQueue = [];
    const flush = () => {
      for (let c of noteQueue) {
        const r = c.getBoundingClientRect(), w = innerWidth, l = parseFloat(c.style.left) || 0;
        let nl = l;
        if (r.right > w - 10) nl -= r.right - (w - 10);
        if (r.left < 10) nl += 10 - r.left;
        if (nl !== l) c.style.left = nl + 'px';
      }
      noteQueue.length = 0;
    };

    const schedule = c => {
      noteQueue.push(c);
      if (noteQueue.length === 1) queueMicrotask(flush);
    };

    new MutationObserver(muts => {
      for (const mut of muts) {
        for (const node of mut.addedNodes) {
          if (node.nodeType === 1) {
            let cs = [];
            if (node.classList && node.classList.contains('reader_footerNote_container')) {
              cs = [node];
            } else if (node.querySelectorAll) {
              cs = node.querySelectorAll('.reader_footerNote_container');
            }
            for (const c of cs) {
              schedule(c);
            }
          }
        }
      }
    }).observe(document.body, { childList: true, subtree: true });

})();
}, 1000); // 延迟1秒执行