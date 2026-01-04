// ==UserScript==
// @name         赛氪英语 AI 答题助手 
// @namespace    https://example.com
// @version      2.2.1
// @description  自动解析并填写赛氪英语题目，支持单选 / 填空 / 阅读理解 / 选词填空。新增「使用说明」按钮，面向小白用户提供一步一步的简明指南。
// @match        https://examzone.saikr.com/question/*
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @icon         https://examzone.saikr.com/favicon.ico
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544904/%E8%B5%9B%E6%B0%AA%E8%8B%B1%E8%AF%AD%20AI%20%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/544904/%E8%B5%9B%E6%B0%AA%E8%8B%B1%E8%AF%AD%20AI%20%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /*************************************************************************
   * ⚠️  新增功能概览 (v2.2.0)
   * -----------------------------------------------------------------------
   *  1. 面板新增「使用说明」(README) 按钮：
   *     · 针对小白用户，通过 alert 弹窗提供安装、配置、答题全流程指导；
   *     · 内容浅显易懂，无需任何技术背景即可上手。
   *  2. 其余功能保持不变，与 v2.1.0 相兼容。
   * ---------------------------------------------------------------------*/

  /***** DOM 工具 *****/
  const $all = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const $one = (sel, root = document) => root.querySelector(sel);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const cleanText = (nodeOrStr) => {
    const text =
      typeof nodeOrStr === "string"
        ? nodeOrStr
        : nodeOrStr?.textContent ?? "";
    return text
      .replace(/\u00A0/g, " ")
      .replace(/\s+\n/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/\s*\n\s*/g, "\n")
      .trim();
  };

  const getStemText = (stemEl) => {
    if (!stemEl) return "";
    const ps = $all("p", stemEl);
    if (ps.length)
      return ps
        .map((p) => cleanText(p))
        .filter(Boolean)
        .join("\n\n");
    return cleanText(stemEl);
  };

  const extractIndexFromStem = (stemText) => {
    const m = stemText.match(/^\s*(\d+)\s*\./);
    return m ? m[1] : null;
  };

  /***** 题型解析 *****/
  function parseSingleChoice(choiceEl) {
    const stemEl = $one(".stem", choiceEl) || choiceEl;
    let stem = getStemText(stemEl);
    const idxMaybe = extractIndexFromStem(stem);
    if (idxMaybe) stem = stem.replace(/^\s*\d+\s*\.\s*/, "");

    const optionNodes = [];
    const options = [];
    const localLabels = $all(
      ".el-radio-group label, .el-radio",
      choiceEl
    );
    (localLabels.length ? localLabels : $all("label", choiceEl)).forEach((lab) => {
      const lblEl = $one(".el-radio__label", lab) || lab;
      let txt = cleanText(lblEl);
      const innerDiv = $one("div", lblEl);
      if (innerDiv) txt = cleanText(innerDiv) || txt;
      const letter = LETTERS[options.length] || "";
      if (!/^[A-Z]\./.test(txt)) txt = `${letter}. ${txt}`;
      options.push(txt);
      optionNodes.push(lab);
    });

    const setter = (letter) => {
      const idx = LETTERS.indexOf((letter || "").toUpperCase());
      if (idx < 0 || idx >= optionNodes.length) return false;
      const lab = optionNodes[idx];
      const input = $one("input[type=radio]", lab) || lab;
      lab?.click?.();
      input?.click?.();
      const inner = $one(".el-radio__inner", lab);
      inner?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      return true;
    };

    return {
      type: "single",
      index: idxMaybe,
      stem,
      options,
      root: choiceEl,
      setAnswer: setter,
    };
  }

  function parseFill(fillEl) {
    const stemEl = $one(".stem", fillEl) || fillEl;
    let stem = getStemText(stemEl);
    const idxMaybe = extractIndexFromStem(stem);
    if (idxMaybe) stem = stem.replace(/^\s*\d+\s*\.\s*/, "");

    const inputs = $all(
      ".el-input input, input.el-input__inner, input[type=text]",
      fillEl
    );
    const setter = (values) => {
      const arr = Array.isArray(values)
        ? values
        : typeof values === "string"
        ? [values]
        : [];
      for (let i = 0; i < inputs.length; i++) {
        const v = arr[i] ?? arr[0] ?? "";
        const inp = inputs[i];
        inp.focus();
        inp.value = v;
        inp.dispatchEvent(new Event("input", { bubbles: true }));
        inp.blur();
      }
      return true;
    };
    return {
      type: "fill",
      index: idxMaybe,
      stem,
      blanks: inputs.length || 1,
      root: fillEl,
      setAnswer: setter,
    };
  }

  /**
   * Word‑Bank Cloze Parser (选词填空)
   * -----------------------------------------------------------
   * HTML 特征：
   * <div class="paper-detail-item">
   *   <div class="stem"> Directions: …fill in each blank… </div>
   *   <div class="material-detail">
   *     <div class="material-detail-item">(blank 1)</div>
   *     ...
   *   </div>
   * </div>
   */
  function parseClozeGroup(paperItem, groupIdx) {
    const stemEl = $one(".stem", paperItem);
    const passage = getStemText(stemEl)
      .replace(/Directions:/i, "")
      .trim();

    const bankItems = [];
    const blanks = [];
    const singles = $all(".material-detail-item .single-choice", paperItem);

    singles.forEach((sc, i) => {
      const q = parseSingleChoice(sc);
      blanks.push(q);
      if (i === 0) bankItems.push(...q.options);
    });

    return {
      gid: `C${groupIdx}`,
      passage,
      bank: bankItems,
      items: blanks,
      root: paperItem,
    };
  }

  /***** 阅读 / Cloze 分组解析 *****/
  function parseReadingGroup(materialWrap) {
    const parent = materialWrap.parentElement;
    const prevStem = $one(".stem", parent);
    let passage = prevStem ? getStemText(prevStem) : "";
    passage = passage.replace(/^\s*\d+\s*\.\s*/, "").trim();

    const items = [];
    const blocks = $all(".material-detail-item", materialWrap);
    for (const it of blocks) {
      const sc = $one(".single-choice", it);
      if (sc) items.push(parseSingleChoice(sc));
    }
    return { passage, items, root: materialWrap };
  }

  /***** 统一抽取入口 *****/
  function extractAll() {
    const result = { meta: { title: document.title, url: location.href }, questions: [] };
    const handled = new Set();

    /* --- Step 1: Word‑Bank Cloze (选词填空) --- */
    const paperItems = $all(".paper-detail-item");
    let clozeIdx = 0;
    for (const item of paperItems) {
      if (handled.has(item)) continue;
      const stemTxt = getStemText($one(".stem", item) || item);
      if (/fill in each blank/i.test(stemTxt) && $one(".material-detail", item)) {
        clozeIdx += 1;
        const group = parseClozeGroup(item, clozeIdx);
        $all(".single-choice", item).forEach((n) => handled.add(n));
        handled.add(item);
        group.items.forEach((sub, i) => {
          const subId = sub.index || `${group.gid}-${i + 1}`;
          result.questions.push({ ...sub, id: subId, cid: group.gid, passage: group.passage });
        });
      }
    }

    /* --- Step 2: 阅读理解（material-detail） --- */
    const readingWraps = $all(".material-detail").filter((el) => !handled.has(el));
    let readingCount = 0;
    for (const wrap of readingWraps) {
      const group = parseReadingGroup(wrap);
      readingCount += 1;
      const rid = `R${readingCount}`;
      $all(".single-choice", wrap).forEach((n) => handled.add(n));
      const prevStem = $one(".stem", wrap.parentElement);
      if (prevStem) handled.add(prevStem);
      group.items.forEach((sub, i) => {
        const subId = sub.index || `${rid}-${i + 1}`;
        result.questions.push({ ...sub, id: subId, passage: group.passage });
      });
    }

    /* --- Step 3: 单选（非阅读 / 非 cloze） --- */
    const singles = $all(".single-choice").filter((el) => !handled.has(el));
    let scCount = 0;
    for (const sc of singles) {
      const item = parseSingleChoice(sc);
      scCount += 1;
      const id = item.index || `S${scCount}`;
      result.questions.push({ ...item, id });
    }

    /* --- Step 4: 填空 --- */
    const fills = $all(".question-fill");
    let fCount = 0;
    for (const f of fills) {
      const item = parseFill(f);
      fCount += 1;
      const id = item.index || `F${fCount}`;
      result.questions.push({ ...item, id });
    }

    return result;
  }

  /***** 发送给 LLM 的精简题面 *****/
  function toLLMUnits(data, charCapPerPassage = 4000) {
    const units = [];
    data.questions.forEach((q) => {
      if (q.type === "single") {
        units.push({
          id: q.id,
          type: "single",
          stem: q.stem,
          options: q.options,
          passage: q.passage
            ? q.passage.length > charCapPerPassage
              ? q.passage.slice(0, charCapPerPassage) + " …(truncated)"
              : q.passage
            : undefined,
        });
      } else if (q.type === "fill") {
        units.push({ id: q.id, type: "fill", stem: q.stem, blanks: q.blanks });
      }
    });
    return units;
  }

  /***** OpenAI 兼容调用 & 工具函数 (保持不变) *****/
  async function openAIChat({ url, apiKey, model, messages, temperature = 0.2, timeout = 60000 }) {
    const body = JSON.stringify({ model, messages, temperature, stream: false });
    const headers = { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` };

    try {
      const ctrl = new AbortController();
      const id = setTimeout(() => ctrl.abort(), timeout);
      const res = await fetch(url, { method: "POST", headers, body, signal: ctrl.signal });
      clearTimeout(id);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      // GM_xmlhttpRequest fallback for CORS
      return await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: "POST",
          url,
          headers,
          data: body,
          timeout,
          onload: (r) => {
            try {
              if (r.status < 200 || r.status >= 300) return reject(new Error(`HTTP ${r.status}`));
              resolve(JSON.parse(r.responseText));
            } catch (err) {
              reject(err);
            }
          },
          onerror: (err) => reject(err),
          ontimeout: () => reject(new Error("Timeout")),
        });
      });
    }
  }

  const extractContentFromResponse = (resp) => {
    if (resp?.choices?.[0]?.message?.content) return resp.choices[0].message.content;
    if (resp?.output_text) return resp.output_text;
    if (Array.isArray(resp?.output) && resp.output[0]?.content?.[0]?.text) return resp.output[0].content[0].text;
    return "";
  };

  /***** 英语专家 System Prompt *****/
  function buildMessages(units) {
    const systemPrompt = `你是中国高中英语考试专家。只基于给定题面与（可选的）passage作答，不引入外部信息。
进行“内在推理”：先在心中按顺序完成 (1) 语义契合比较 (2) 固定搭配/习语核对 (3) 语法一致性（时态、主谓、并列、介词） (4) 篇章衔接/指代自检 (5) 最终确认。
严格禁止将上述推理过程写入输出；输出只含答案，可被 JSON.parse。

输出结构（唯一且完整）：
{"answers":[
  {"id":"<题目id>","choice":"A"},
  {"id":"<题目id>","fill":["答案1","答案2"]}
]}

作答规则：
1. 单选题：仅输出大写字母到 "choice"（如 "A"）。优先级：语义契合 > 固定搭配/习语 > 句法完整性 > 篇章衔接。
2. 填空题：按空格数量返回 "fill" 数组；答案不加多余引号/句号/括号；大小写按英语常规。
3. 阅读题：若有 passage，先整体把握主旨语气与细节，再作答小题（推理只在心中完成，不输出）。
4. 选词填空（Word-Bank Cloze）：同一词库中的每个备选词只能使用一次；若出现冲突，优先满足语义契合，其次遵循搭配/语法。
5. 若必须猜测，选择最合理项。
6. 仅输出上述 JSON 字段；不得输出理由、要点、证据或任何额外文本。
`;

    return [
      { role: "system", content: systemPrompt },
      { role: "user", content: JSON.stringify({ questions: units }, null, 2) },
    ];
  }

  /***** 写回页面（与原版一致，无改动） *****/
  async function applyAnswers(extracted, finalAnswersMap, log) {
    let ok = 0,
      fail = 0;
    const qById = {};
    extracted.questions.forEach((q) => (qById[q.id] = q));

    for (const [id, ans] of Object.entries(finalAnswersMap)) {
      const q = qById[id];
      if (!q) {
        log(`未找到题目 ${id}`);
        fail++;
        continue;
      }
      try {
        if (q.type === "single" && ans.choice) {
          const letter = (ans.choice || "").toUpperCase().trim();
          const res = q.setAnswer(letter);
          if (!res) throw new Error("选项设置失败");
          ok++;
        } else if (q.type === "fill" && ans.fill) {
          const values = Array.isArray(ans.fill) ? ans.fill : [String(ans.fill)];
          q.setAnswer(values);
          ok++;
        } else {
          throw new Error("答案结构不匹配");
        }
        await sleep(40);
      } catch (e) {
        log(`❌ ${id} 写入失败：${e.message}`);
        fail++;
      }
    }
    return { ok, fail };
  }

/***** 可拖动面板 *****/
  function initPanel() {
    if ($one('#ai-solver-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'ai-solver-panel';
    panel.innerHTML = `
      <div class="ais-inner">
        <div class="ais-title" id="ais-drag-handle">赛氪英语AI一键答题</div>
        <label class="ais-lab">API URL
          <input id="ais-base" placeholder="如：https://api.openai.com/v1/chat/completions" />
        </label>
        <label class="ais-lab">Models（逗号分隔）
          <input id="ais-model" placeholder="gpt-4o,gpt-4o-mini" />
        </label>
        <label class="ais-lab">OpenAI Key
          <input id="ais-key" type="password" placeholder="sk-..." />
        </label>
        <div class="ais-row">
          <label><input type="checkbox" id="ais-dry" /> 仅试跑（不写回页面）</label>
        </div>
        <div class="ais-btns">
          <button id="ais-readme">使用说明</button>
          <button id="ais-save">保存配置</button>
          <button id="ais-test">测试API</button>
          <button id="ais-run" class="primary">开始做题</button>
        </div>
        <pre id="ais-log" class="ais-log"></pre>
      </div>
    `;
    const css = document.createElement('style');
    css.textContent = `
      #ai-solver-panel {
        position: fixed;
        right: 16px; bottom: 16px;
        z-index: 9999999;
        width: 380px;
        box-sizing: border-box;
        font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
      }
      #ai-solver-panel .ais-inner {
        background: #0b1220;
        color: #e5e7eb;
        border: 1px solid #1f2a44;
        border-radius: 14px;
        padding: 12px;
        box-shadow: 0 6px 20px rgba(0,0,0,.35);
      }
      .ais-title {
        font-weight: 700; text-align:center; margin-bottom: 8px;
        cursor: move; user-select: none; letter-spacing: .5px;
      }
      .ais-lab { display:block; font-size:12px; color:#9ca3af; margin:6px 0 2px; }
      .ais-lab input {
        width: 100%; max-width: 100%;
        padding: 9px 10px; border-radius: 10px;
        border: 1px solid #374151; background:#0f172a; color:#e5e7eb;
        box-sizing: border-box; outline: none;
      }
      .ais-lab input:focus { border-color:#2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,.15); }
      .ais-row { display:flex; align-items:center; font-size:12px; color:#cbd5e1; margin-top:8px; gap:10px; }
      .ais-row label { display:flex; align-items:center; gap:6px; }
      .ais-btns { display:flex; gap:8px; margin-top:12px; flex-wrap:wrap; }
      .ais-btns button { flex:1; padding:9px 10px; border-radius:10px; border:none; cursor:pointer; background:#374151; color:#fff; transition:.15s ease; font-size:12px; }
      .ais-btns .primary { background:#2563eb; }
      .ais-btns button:hover { filter:brightness(1.06); transform: translateY(-0.5px); }
      .ais-log {
        max-height: 260px; overflow:auto; background:#0f172a;
        border: 1px solid #1f2a44; border-radius:10px;
        padding:10px; font-size:12px; color:#d1d5db; margin-top:10px; white-space:pre-wrap;
      }
      @media (max-width: 420px) {
        #ai-solver-panel { width: calc(100vw - 24px); right: 12px; left: 12px; }
      }
    `;
    document.head.appendChild(css);
    document.body.appendChild(panel);

    // 可拖动
    (function makeDraggable() {
      const handle = panel.querySelector('#ais-drag-handle');
      let dragging = false, startX=0, startY=0, startLeft=0, startTop=0;
      const onDown = (e) => {
        dragging = true;
        const rect = panel.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        startX = e.clientX; startY = e.clientY;
        panel.style.right = 'auto'; panel.style.bottom = 'auto';
        panel.style.left = `${startLeft}px`;
        panel.style.top = `${startTop}px`;
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      };
      const onMove = (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        let nx = startLeft + dx;
        let ny = startTop + dy;
        const maxX = window.innerWidth - panel.offsetWidth;
        const maxY = window.innerHeight - panel.offsetHeight;
        nx = Math.max(0, Math.min(nx, maxX));
        ny = Math.max(0, Math.min(ny, maxY));
        panel.style.left = `${nx}px`;
        panel.style.top = `${ny}px`;
      };
      const onUp = () => {
        dragging = false;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };
      handle.addEventListener('mousedown', onDown);
    })();

    const $ = (id) => panel.querySelector(id);
    const baseInp = $('#ais-base');
    const modelInp = $('#ais-model');
    const keyInp = $('#ais-key');
    const dryChk = $('#ais-dry');
    const logEl = $('#ais-log');

    const log = (msg) => { logEl.textContent += (msg + '\n'); logEl.scrollTop = logEl.scrollHeight; };
    const clr = () => { logEl.textContent = ''; };

    // 载入配置
    baseInp.value = GM_getValue('ais_base', 'https://api.openai.com/v1/chat/completions');
    modelInp.value = GM_getValue('ais_model', 'gpt-4o');
    keyInp.value = GM_getValue('ais_key', '');
    dryChk.checked = GM_getValue('ais_dry', false);

    $('#ais-save').addEventListener('click', () => {
      GM_setValue('ais_base', baseInp.value.trim());
      GM_setValue('ais_model', modelInp.value.trim() || 'gpt-4o');
      GM_setValue('ais_key', keyInp.value.trim());
      GM_setValue('ais_dry', dryChk.checked);
      log('✅ 配置已保存');
    });

    /* ---------- README 按钮逻辑 ---------- */
    $('#ais-readme').addEventListener('click', () => {
      alert(`【赛氪英语 AI 答题助手使用指南】\n\n1. 准备工作\n   · 安装浏览器扩展 Tampermonkey（油猴）并重启浏览器。\n   · 点击“安装脚本”按钮，将本脚本添加到 Tampermonkey。\n\n2. 打开赛氪考试页面\n   · 访问链接形如 https://examzone.saikr.com/question/...\n\n3. 打开侧边面板\n   · 页面右下角将自动出现“赛氪英语一键答题”面板；如未出现，可点击浏览器 Tampermonkey 图标并选择“打开 AI 答题面板”。\n\n4. 填写三项配置\n   · API URL：例如 https://api.openai.com/v1/chat/completions\n   · Models：例如 gpt-4o 或 gpt-4o-mini，可填多个，用逗号隔开\n   · OpenAI Key：到 OpenAI 个人中心复制，形如 sk-xxxxxxxx\n\n5. 可选设置\n   · 勾选“仅试跑”表示只获取答案不自动填入页面，可用于演示或验证。\n\n6. 测试 API\n   · 点击“测试API”验证 Key 与模型是否可用，出现绿色✅即通过。\n\n7. 开始做题\n   · 点击“开始做题”，脚本会解析当前页面题目，并调用 LLM 获得答案。\n   · 如未勾选“仅试跑”，若多模型答案一致，将直接填写到答题框。\n\n8. 小技巧\n   · 面板可按标题栏拖动到任意位置。\n   · 配置保存后会自动记忆，下次无需重复输入。\n\n祝你考试顺利！`);
    });

    /* ---------- 这里开始：测试 API 新逻辑 ---------- */
    $('#ais-test').addEventListener('click', async () => {
      clr();
      const apiURL = baseInp.value.trim();
      const apiKey = keyInp.value.trim();
      const models = (modelInp.value.trim() || 'gpt-4o')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      if (!apiURL || !apiKey) {
        log('❌ 请先填写 API URL 与 Key');
        return;
      }

      if (!models.length) {
        log('❌ 未提供任何模型');
        return;
      }

      const messages = [
        { role: 'system', content: 'You are a helpful assistant. Reply with exactly: OK' },
        { role: 'user', content: 'OK' }
      ];

      for (const model of models) {
        try {
          log(`⏳ 正在测试模型：${model} …`);
          const resp = await openAIChat({
            url: apiURL,
            apiKey,
            model,
            messages
          });
          const content = (extractContentFromResponse(resp) || '').trim();
          log(`  ↳ 原始响应：${JSON.stringify(resp).slice(0, 900)}${JSON.stringify(resp).length>900?'...':''}`);
          if (/^OK$/i.test(content)) {
            log(`✅ 模型 ${model} 测试通过`);
          } else {
            log(`⚠️ 模型 ${model} 可达，但返回内容非常规（期望 "OK"）`);
          }
        } catch (e) {
          log(`❌ 模型 ${model} 测试失败：${e.message}`);
        }
        log(''); // 空行分隔
        await sleep(200); // 避免过快触发限速
      }
    });
    /* ---------- 这里结束：测试 API 新逻辑 ---------- */

    $('#ais-run').addEventListener('click', async () => {
      clr();
      try {
        const apiURL = baseInp.value.trim();
        const apiKey = keyInp.value.trim();
        const models = (modelInp.value.trim() || 'gpt-4o').split(',').map(s=>s.trim()).filter(Boolean);
        const dryRun = dryChk.checked;

        if (!apiURL || !apiKey) { log('❌ 请先填写 API URL 与 Key'); return; }

        const extracted = extractAll();
        const units = toLLMUnits(extracted);
        if (units.length === 0) { log('未发现可解析的题目。'); return; }
        log(`共发现题目：${units.length} 道；模型：${models.join(', ')}`);

        // 按批次 + 模型调用
        const batches = [];
        let cur=[], size=0, limit=12000;
        for (const u of units) {
          const s = JSON.stringify(u).length;
          if (size + s > limit && cur.length) { batches.push(cur); cur=[]; size=0; }
          cur.push(u); size += s;
        }
        if (cur.length) batches.push(cur);

        const answersPerModel = {};
        for (const model of models) answersPerModel[model] = {};

        for (let b=0;b<batches.length;b++) {
          const batch = batches[b];
          for (const model of models) {
            log(`🧠 模型 ${model}，批次 ${b+1}/${batches.length}…`);
            const messages = buildMessages(batch);
            const resp = await openAIChat({ url: apiURL, apiKey, model, messages });
            const contentRaw = extractContentFromResponse(resp) || '';
            const content = contentRaw.replace(/^```json\s*|\s*```$/g,'').trim();
            let parsed;
            try { parsed = JSON.parse(content); }
            catch { throw new Error(`模型 ${model} 未按要求返回 JSON，可尝试换模型或重试。`); }
            const arr = Array.isArray(parsed?.answers) ? parsed.answers : [];
            arr.forEach(a => { if (a?.id) answersPerModel[model][a.id] = a; });
            await sleep(100);
          }
        }

        // 计算一致答案
        const finalAnswers = {};
        const allIds = new Set();
        models.forEach(m => Object.keys(answersPerModel[m]).forEach(id=>allIds.add(id)));

        log('\n=== 各模型答案对比 ===');
        allIds.forEach(id => {
          const perModel = models.map(m => answersPerModel[m][id]);
          const display = perModel.map((ans,mIdx)=>{
            if (!ans) return `${models[mIdx]}: -`;
            if (ans.choice) return `${models[mIdx]}: ${ans.choice}`;
            if (ans.fill) return `${models[mIdx]}: ${ans.fill.join('|')}`;
            return `${models[mIdx]}: ?`;
          }).join(' | ');
          log(`${id} => ${display}`);
          // 判断一致
          const refAns = perModel[0] && JSON.stringify({choice:perModel[0].choice,fill:perModel[0].fill});
          const same = perModel.every(a=>a && JSON.stringify({choice:a.choice,fill:a.fill})===refAns);
          if (same && perModel[0]) finalAnswers[id] = perModel[0];
        });
        log(`\n一致答案：${Object.keys(finalAnswers).length} 道。${dryRun?'（试跑模式未写入）':''}`);

        if (!dryRun) {
          const { ok, fail } = await applyAnswers(extracted, finalAnswers, log);
          log(`\n写入成功 ${ok}，失败 ${fail}`);
        }
      } catch (e) {
        log('❌ 执行失败：' + (e?.message || e));
      }
    });
  }

  // 右键菜单
  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('打开 AI 答题面板', () => initPanel());
  }

  // 自动挂载 + 监听 SPA 变化
  const mo = new MutationObserver(() => { if (!$one('#ai-solver-panel')) initPanel(); });
  mo.observe(document.documentElement, { childList:true, subtree:true });
  initPanel();
})();
