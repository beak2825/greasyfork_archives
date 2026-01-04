// ==UserScript==
// @name         【更换网页字体】
// @namespace    https://greasyfork.org/
// @version      250928
// @description  导入本地字体替换网页字体，支持通配符 URL 自定义排除选择器
// @author       Kimi & 问小白 & 小艺
// @license      MIT
// @run-at       document-start
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/493887/%E3%80%90%E6%9B%B4%E6%8D%A2%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/493887/%E3%80%90%E6%9B%B4%E6%8D%A2%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E3%80%91.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const main = () => {

  /* 0. 默认排除列表 */
  const DEFAULT_EXCLUDE = 'i,span:empty,p:empty,div:empty,[class*=icon],[class*=Icon],[class*=ICON],[class*=font],[class*=Font],[class*=FONT]';

  /* 1. 域名-选择器 存取 */
  const getExcludeRules = () => GM_getValue('excludeRules', {});
  const setExcludeRules = r => GM_setValue('excludeRules', r);

  /* 2. 工具：通配符 → 正则 */
  const ruleRegexCache = new Map();
  const wildcardToRegex = pattern => {
    if (!ruleRegexCache.has(pattern)) {
      const source = pattern
        .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '.*');
      ruleRegexCache.set(pattern, new RegExp(`^${source}$`, 'i'));
    }
    return ruleRegexCache.get(pattern);
  };

  /* 3. 统一返回 域名 / 完整 URL（全部小写） */
  const host = () => location.hostname.toLowerCase();
  const fullUrl = () => location.href.split('#')[0].toLowerCase();

  /* 4. 两层匹配：1.域名精确 2.通配符匹配完整 URL */
  const matchWildcard = () => {
    const rules = getExcludeRules();
    const h = host();
    if (rules[h]) return h;
    const url = fullUrl();
    if (rules[url]) return url;
    for (const key in rules) {
      if (key.includes('*') && wildcardToRegex(key).test(url)) return key;
    }
    return null;
  };

  /* 5. 组装 :not(...) */
  const buildExcludeSelector = () => {
    const key = matchWildcard();
    return key ? getExcludeRules()[key] : DEFAULT_EXCLUDE;
  };

  /* 6. 字体配置 */
  const defaultFont = { name: 'serif(默认字体)', fontFamily: 'serif', isDefault: true };
  const fontData = GM_getValue('fontData', {
    fonts: [defaultFont],
    currentFont: defaultFont.name,
    isTextStroke: false,
    isTextShadow: true,
    isCompatMode: false,
    onlyCJK: false
  });

  /* 7. 样式元素 */
  const createStyleElement = id => {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('style');
      el.id = id;
      document.head.appendChild(el);
    }
    return el;
  };
  const fontFaceStyleElement = createStyleElement('font-face-style');
  const commonStyleElement = createStyleElement('font-common-style');

  /* 8. 字体缓存 */
  const cachedFontBlobUrls = {};

  /* 9. 更新通用样式 */
  const updateCommonStyles = () => {
    const selectedFont = fontData.fonts.find(f => f.name === fontData.currentFont);
    if (!selectedFont) return;
    const excludeSel = buildExcludeSelector();
    const important = fontData.isCompatMode ? '' : '!important';
    const cssRules = `body *:not(${excludeSel}){ font-family:'${selectedFont.fontFamily}' ${important}; ${fontData.isTextStroke ? '-webkit-text-stroke: .5px;' : ''} ${fontData.isTextShadow ? 'text-shadow: 0 0 .2px rgba(0,0,0,.9), 1px 1px 3px rgba(0,0,0,.2);' : ''}}`;
    commonStyleElement.textContent = cssRules;
  };

  /* 10. 字体加载/缓存 */
  const updateFontFaces = selectedFont => {
    if (!selectedFont || !selectedFont.storageKey) {
      fontFaceStyleElement.textContent = '';
      updateCommonStyles();
      return;
    }
    const fontBlobUrl = cachedFontBlobUrls[selectedFont.storageKey];
    if (fontBlobUrl) {
      fontFaceStyleElement.textContent = buildFontFaceCSS(
        selectedFont.fontFamily,
        fontBlobUrl,
        selectedFont.format,
        fontData.onlyCJK
      );
      updateCommonStyles();
      return;
    }
    const fontChunks = GM_getValue(`font_${selectedFont.storageKey}_chunks`, []);
    const totalChunks = GM_getValue(`font_${selectedFont.storageKey}_total`, 0);
    if (fontChunks.length === totalChunks) {
      Promise.all(fontChunks.map(i => GM_getValue(`font_${selectedFont.storageKey}_chunk_${i}`)))
        .then(base64Chunks => {
          const base64Data = base64Chunks.join('');
          const blob = base64ToBlob(base64Data, selectedFont.mimeType);
          const url = URL.createObjectURL(blob);
          cachedFontBlobUrls[selectedFont.storageKey] = url;
          fontFaceStyleElement.textContent = buildFontFaceCSS(
            selectedFont.fontFamily,
            url,
            selectedFont.format,
            fontData.onlyCJK
          );
          updateCommonStyles();
        });
    }
  };
  const buildFontFaceCSS = (fontFamily, fontUrl, fontFormat, onlyCJK) => `@font-face { font-family: '${fontFamily}'; src: url(${fontUrl}) format('${fontFormat}'); ${onlyCJK ? 'unicode-range: U+4E00-9FFF, U+3400-4DBF, U+20000-2A6DF, U+F900-FAFF;' : ''}}`;
  const base64ToBlob = (base64String, mimeType) => {
    const byteCharacters = atob(base64String);
    const byteArrays = [];
    for (let i = 0; i < byteCharacters.length; i += 512) {
      const slice = byteCharacters.slice(i, i + 512);
      const byteNumbers = new Array(slice.length);
      for (let j = 0; j < slice.length; j++) byteNumbers[j] = slice.charCodeAt(j);
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    return new Blob(byteArrays, { type: mimeType });
  };
  const getFontFormat = fileName => {
    const ext = fileName.split('.').pop().toLowerCase();
    return { ttf:'truetype', otf:'opentype', woff:'woff', woff2:'woff2' }[ext] || 'truetype';
  };

  /* 11. 字体设置面板 */
  const createFontPanel = () => {
    const overlay = document.createElement('div');
    overlay.style = `position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:99998`;
    const panel = document.createElement('div');
    panel.style = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.2);z-index:99999;min-width:300px;max-width:98vw;max-height:90vh;overflow-y:auto;`;
    panel.innerHTML = `<h3 style="text-align:center;">字体设置</h3><div id="font-list" style="margin:20px 0"></div>`;
    const listBox = panel.querySelector('#font-list');
    const renderFontList = () => {
      listBox.innerHTML = '';
      fontData.fonts.forEach(font => {
        const row = document.createElement('div');
        row.style = 'margin:8px 0;display:flex;align-items:center;padding:4px 8px;border-radius:4px;cursor:pointer';
        if (font.name === fontData.currentFont) row.style.backgroundColor = '#e0e0e0';
        const dot = document.createElement('span'); dot.style = 'width:1em;text-align:center';
        dot.textContent = font.name === fontData.currentFont ? '✓' : '';
        const name = document.createElement('span'); name.style = 'flex-grow:1;text-align:center';
        name.textContent = font.name;
        const delBtn = document.createElement('button');
        delBtn.style = 'width:1em;border:none;background:none;color:#ff4444';
        delBtn.textContent = font.isDefault ? '' : '✕';
        dot.onclick = name.onclick = () => {
          fontData.currentFont = font.name;
          GM_setValue('fontData', fontData);
          updateFontFaces(font);
          renderFontList();
        };
        delBtn.onclick = () => {
          if (font.isDefault) return;
          if (!confirm(`确定要删除字体 "${font.name}" 吗？`)) return;
          fontData.fonts = fontData.fonts.filter(f => f.name !== font.name);
          if (fontData.currentFont === font.name) fontData.currentFont = fontData.fonts[0].name;
          if (font.storageKey) {
            const chunks = GM_getValue(`font_${font.storageKey}_chunks`, []);
            chunks.forEach((_, i) => GM_deleteValue(`font_${font.storageKey}_chunk_${i}`));
            GM_deleteValue(`font_${font.storageKey}_chunks`);
            GM_deleteValue(`font_${font.storageKey}_total`);
            if (cachedFontBlobUrls[font.storageKey]) {
              URL.revokeObjectURL(cachedFontBlobUrls[font.storageKey]);
              delete cachedFontBlobUrls[font.storageKey];
            }
          }
          GM_setValue('fontData', fontData);
          updateFontFaces(fontData.fonts.find(f => f.name === fontData.currentFont));
          renderFontList();
        };
        row.append(dot, name, delBtn);
        listBox.appendChild(row);
      });
    };
    const createToggle = (label, key) => {
      const box = document.createElement('div');
      box.style = 'display:flex;justify-content:center;align-items:center;margin:20px 0;cursor:pointer';
      const ind = document.createElement('span'); ind.style = 'margin-right:5px';
      ind.textContent = fontData[key] ? '●' : '○';
      const txt = document.createElement('span'); txt.textContent = label;
      box.append(ind, txt);
      box.onclick = () => {
        fontData[key] = !fontData[key];
        ind.textContent = fontData[key] ? '●' : '○';
        GM_setValue('fontData', fontData);
        updateFontFaces(fontData.fonts.find(f => f.name === fontData.currentFont));
      };
      return box;
    };
    panel.appendChild(createToggle('描边加粗', 'isTextStroke'));
    panel.appendChild(createToggle('文本阴影', 'isTextShadow'));
    panel.appendChild(createToggle('兼容模式', 'isCompatMode'));
    panel.appendChild(createToggle('仅汉字符', 'onlyCJK'));
    const importBtn = document.createElement('button');
    importBtn.textContent = '导入本地字体';
    importBtn.style = 'display:block;margin:20px auto;padding:8px 16px;background:#2196F3;color:white;border:none;border-radius:4px;cursor:pointer';
    importBtn.onclick = () => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file'; fileInput.accept = '.ttf,.otf,.woff,.woff2'; fileInput.style.display = 'none';
      document.body.appendChild(fileInput);
      fileInput.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const originalName = file.name.replace(/\.[^/.]+$/, '');
        const exist = fontData.fonts.find(f => f.originalFileName === file.name && f.fileSize === file.size);
        if (exist) { alert(`字体 "${originalName}" 已存在，无需重复导入。`); document.body.removeChild(fileInput); return; }
        let newName = originalName; let idx = 2;
        while (fontData.fonts.some(f => f.name === newName)) newName = `${originalName}(${idx++})`;
        const reader = new FileReader();
        reader.onload = () => {
          const [, base64Data] = reader.result.split(',');
          const mimeType = reader.result.split(',')[0].split(':')[1].split(';')[0];
          const storageKey = 'font_' + Date.now();
          const chunkSize = 500000; const chunks = [];
          for (let i = 0; i < base64Data.length; i += chunkSize) {
            const chunk = base64Data.substring(i, i + chunkSize);
            GM_setValue(`font_${storageKey}_chunk_${chunks.length}`, chunk);
            chunks.push(chunks.length);
          }
          GM_setValue(`font_${storageKey}_chunks`, chunks);
          GM_setValue(`font_${storageKey}_total`, chunks.length);
          fontData.fonts.push({
            name: newName,
            fontFamily: newName,
            originalFileName: file.name,
            mimeType,
            storageKey,
            format: getFontFormat(file.name),
            fileSize: file.size
          });
          fontData.currentFont = newName;
          GM_setValue('fontData', fontData);
          updateFontFaces(fontData.fonts.at(-1));
          renderFontList();
        };
        reader.readAsDataURL(file);
        fileInput.remove();
      };
      fileInput.click();
    };
    panel.appendChild(importBtn);
    overlay.appendChild(panel);
    overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };
    document.body.appendChild(overlay);
    renderFontList();
  };

  /* 12. 通配符规则管理 UI */
  const openAllRulesPanel = () => {
    const rules = getExcludeRules();
    const keys = Object.keys(rules);
    if (!keys.length) { alert('暂无自定义排除规则'); return; }
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:2147483647;
      display:flex;align-items:center;justify-content:center;`;
    const panel = document.createElement('div');
    panel.style.cssText = `
      background:white;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,.3);
      width:500px;max-height:70vh;overflow:auto;padding:20px;font-family:system-ui;`;
    panel.innerHTML = '<h3 style="margin:0 0 15px 0;text-align:center">全部规则</h3>';
    const list = document.createElement('div');
    list.style.cssText = 'display:flex;flex-direction:column;gap:8px';
    keys.forEach(k => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;word-break:break-all;padding:4px 0;border-bottom:1px solid #eee';
      row.innerHTML = `
        <div style="flex:1"><b>${k}</b><br><small style="color:#555">${rules[k]}</small></div>
        <button data-edit="${k}" style="margin-left:8px;background:#2196F3;color:white;border:none;padding:4px 8px;border-radius:3px;font-size:12px">编辑</button>`;
      list.appendChild(row);
    });
    panel.appendChild(list);
    panel.addEventListener('click', e => {
      if (!e.target.dataset.edit) return;
      const key = e.target.dataset.edit;
      overlay.remove();
      openEditRulePanel(key);
    });
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  };
  const openEditRulePanel = (key0 = '') => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:2147483647;
      display:flex;align-items:center;justify-content:center;`;
    const panel = document.createElement('div');
    panel.style.cssText = `
      background:white;padding:20px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,.2);
      min-width:300px;max-width:500px;`;
    const rules = getExcludeRules();
    const currentSelector = rules[key0] || '';
    panel.innerHTML = `
      <h3 style="text-align:center;margin-top:0;">编辑规则</h3>
      <label>
        <div style="margin-bottom:5px;font-weight:bold">域名/URL通配：</div>
        <input id="domain-input" value="${key0}" 
               style="width:100%;padding:6px;border:1px solid #ccc;border-radius:4px;box-sizing:border-box" 
               placeholder="example.com 或 *example.com/wiki*">
      </label>
      <label style="display:block;margin:10px 0 15px 0">
        <div style="margin-bottom:5px;font-weight:bold">排除选择器：</div>
        <textarea id="selector-input" rows="4" 
                  style="width:100%;resize:vertical;padding:6px;border:1px solid #ccc;border-radius:4px;box-sizing:border-box"
                  placeholder="填写CSS选择器（如：.icon, [class*='icon'], .fa），多个用逗号分隔">${currentSelector}</textarea>
      </label>
      <div style="display:flex;justify-content:space-between">
        <button id="delete-btn" style="background:#f44336;color:white;border:none;padding:6px 12px;border-radius:4px">删除</button>
        <div style="display:flex;gap:10px">
          <button id="cancel-btn" style="background:#9e9e9e;color:white;border:none;padding:6px 12px;border-radius:4px">取消</button>
          <button id="save-btn" style="background:#4caf50;color:white;border:none;padding:6px 12px;border-radius:4px">保存</button>
        </div>
      </div>`;
    const domainInput = panel.querySelector('#domain-input');
    const selectorInput = panel.querySelector('#selector-input');
    const deleteBtn = panel.querySelector('#delete-btn');
    const cancelBtn = panel.querySelector('#cancel-btn');
    const saveBtn = panel.querySelector('#save-btn');
    deleteBtn.onclick = () => {
      const target = domainInput.value.trim();
      const r = { ...getExcludeRules() };
      if (target&&r[target]&&confirm(`确定删除规则 “${target}”？`)) {
        delete r[target];
        setExcludeRules(r);
        updateFontFaces(fontData.fonts.find(f => f.name === fontData.currentFont));
        registerDomainMenu();
        overlay.remove();
      }
    };
    cancelBtn.onclick = () => document.body.removeChild(overlay);
    saveBtn.onclick = () => {
      const dom = domainInput.value.trim();
      const sel = selectorInput.value.trim();
      if (!dom) { alert('通配符不能为空'); return; }
      const r = { ...getExcludeRules() };
      if (dom !== key0) delete r[key0];
      if (sel === '') { delete r[dom]; } else { r[dom] = sel; }
      setExcludeRules(r);
      updateFontFaces(fontData.fonts.find(f => f.name === fontData.currentFont));
      registerDomainMenu();
      overlay.remove();
    };
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    panel.addEventListener('click', e => e.stopPropagation());
  };

  /* 13. 动态菜单 */
  let addMenuId = null, editMenuId = null;
  const registerDomainMenu = () => {
    const key = matchWildcard();
    if (addMenuId)  { GM_unregisterMenuCommand(addMenuId);  addMenuId = null; }
    if (editMenuId) { GM_unregisterMenuCommand(editMenuId); editMenuId = null; }
    if (key) {
      editMenuId = GM_registerMenuCommand('✏️ 编辑当前规则', () => openEditRulePanel(key));
    } else {
      addMenuId = GM_registerMenuCommand('➕ 添加本域规则', () => openEditRulePanel(host()));
    }
  };

  /* 14. 注册菜单 */
  GM_registerMenuCommand('🎨 字体设置', createFontPanel);
  //GM_registerMenuCommand('⚙️ 查看配置', () => alert(JSON.stringify(fontData, null, 2)));
  GM_registerMenuCommand('📋 管理全部规则', openAllRulesPanel);
  GM_registerMenuCommand('🔄 重新加载', main);
  GM_registerMenuCommand('❓ 帮助', () => {
    alert(`📖 【更换网页字体】脚本使用指南

1️⃣ 基本使用
• 点击菜单中的"🎨 字体设置"导入/选择字体
• 导入本地字体后，页面字体会自动替换
• 在列表里点选即可实时切换
• ✓ 表示当前正在使用的字体

2️⃣ 可选开关
• 描边加粗：让笔画更粗
• 文本阴影：增强可读性
• 兼容模式：遇图标乱码可勾选解决
• 仅汉字符：只替换中文，英文保持原样

3️⃣ 排除特定元素（图标/指定区域不被替换）
A. 自动排除：脚本默认规则排除常见图标、视频控件
B. 添加排除规则：
  ① 打开需排除的网页
  ② 点击"➕ 添加本域规则"
  ③ 在"排除选择器"里填 CSS 选择器，如：
     .icon, .fa, [class*="icon"], pre, code
  ④ 保存后立即生效
C. 通配符规则：使用域名添加规则相对简单，亦可URL搭配通配符添加通用规则
   例：*example.com/wiki* 可匹配所有包含该段的网址

4️⃣ 其他
• "📋 管理全部规则" → 查看/编辑/删除已保存的排除规则
• "🔄 重新加载" → 重载脚本。使用场景示例：小说阅读模式开启后使用

💡 提示
• 如果浏览器(如：via)本身支持换字体，不建议使用这个脚本
• 建议把.ttf格式字体转换为.woff2格式，体积更小
• 字体文件大小建议5MB以内，文件越大网页显示延迟越明显
• 导入的字体保存在浏览器本地，理论上讲，删除这个脚本可清理所有导入的字体
• 如页面出现图标乱码，临时访问可勾选“兼容模式”解决；长期访问建议添加排除规则`);
  });

  /* 15. 初始化 */
  registerDomainMenu();
  updateFontFaces(fontData.fonts.find(f => f.name === fontData.currentFont));

  }
  main();
})();