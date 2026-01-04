// ==UserScript==
// @name         基于弹幕识别的跳过B站内置广告（v0.2）
// @namespace    http://tampermonkey.net/
// @version      0.2.7
// @description  识别多种时间格式，UI简化。监控 BV 变化并重启脚本（每 10s）。增强：剔除视频开始早期的“发布几分钟”误判弹幕。
// @match        https://www.bilibili.com/video/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545741/%E5%9F%BA%E4%BA%8E%E5%BC%B9%E5%B9%95%E8%AF%86%E5%88%AB%E7%9A%84%E8%B7%B3%E8%BF%87B%E7%AB%99%E5%86%85%E7%BD%AE%E5%B9%BF%E5%91%8A%EF%BC%88v02%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/545741/%E5%9F%BA%E4%BA%8E%E5%BC%B9%E5%B9%95%E8%AF%86%E5%88%AB%E7%9A%84%E8%B7%B3%E8%BF%87B%E7%AB%99%E5%86%85%E7%BD%AE%E5%B9%BF%E5%91%8A%EF%BC%88v02%EF%BC%89.meta.js
// ==/UserScript==

(function(){ 'use strict';

/* ========== 配置 ========== */
const CONFIG = {
  maxDanmuLoad: 6000,
  fetchRetries: 3,
  fetchRetryDelayMs: 800,
  maxDisplayDanmu: 120,
  triggerWindow: 2,
  earliestClusterMinCount: 2,
  minDeltaSeconds: 5,
  maxDeltaSeconds: 300,
  maxBackwardAllowedSec: 5,
  weightWindowSeconds: 20,
  minSkipDuration: 5,
  maxSkipFraction: 0.5,
  baseWeight: 0.6,
  timeKwExtra: 2.0,
  targetKwExtra: 2.0,
  weightDanmuBoost: 2.5,
  clusterBoostFactor: 0.5,
  rightStepSeconds: 5,
  rightMaxN: 10,
  forbiddenTokens: ['+','%','年','月','日','人','个','比','对','W','万','K','千','百','M','B','G','w','前','一分钟','两分钟','三分钟','五分钟','十分钟','555','kb','k','a','b','d','g','T','1 1','点点','一点','1点','hz','p','os','处理器','CPU','GPU','i','最多','最少','不如','！','//!','的'],
  measurementTokens: ['米','码','百米','速度','跑','m','km','km/h','秒','公斤','kg','斤','票','票房','分数','评分','百分比','%','rpm','W','万','K','千','百','M','B','G','点点','块','快','元'],
  maxNonTimeCharsAllowed: 3,
  nonTimeCharsPenaltyFactor: 0.2,
  acceptWeightThreshold: 0.75,
  chineseNumberMaxParseLen: 6,
  fastForwardBoost: 1.2,
  POSTAGE_WINDOW_SECONDS: 25,
  POSTAGE_TARGET_SECONDS: 60,
  TARGET_GROUP_WINDOW: 4,

  // 低权重特殊数字弹幕
  lowWeightTokens: ['9.9','111','555','233','444','333','222','911','0721','250','38','711','1024','2048','315','918','123','1.0','1.5','2.0','2.5','3.0','4.0','5.0','6.0','7.0','8.0','9.0','100','200','300','400','500','600'],
  lowWeightMultiplier: 0.01,

  // 过早触发剔除阈值（秒）
  earliestIgnoreDeltaSeconds: 30,

  // 新增：早期“几分钟”剔除设置
  earliestPostageWindowSeconds: 90, 
  earliestPostageMaxMinute: 3, 
};

/* ========== 关键词 ========== */
const TIME_KEYWORDS = ['跳伞','跳','快进','空降','跳过','跳至','快进到','加速','向右','右','→','朗','郎','侠','绯红之王','向右下','右下'];
const WEIGHT_A_KEYWORDS = ['0帧起手','零帧起手','丝滑','起手','0帧','变声期','触发连招','连招','回马枪','加速时间','广告','广告跳过','不想看','广告点','触发','起招','起手帧','感谢甲方','恭喜恰饭','高能预警','贴脸开大'];
const WEIGHT_B_KEYWORDS = ['欢迎回来','欢迎回','感谢侠','感谢郎','感谢朗','感谢绯红之王','谢谢回来','指挥部','感谢指挥部'];

/* ========== 状态对象（全局） ========== */
const state = {
  runId: 0,
  video: null,
  cid: null,
  danmuCount: 0,
  isAnalyzing: false,
  jumpRules: new Map(),
  lastCandidatesLog: [],
  videoListenerRef: null,
  mutationObserver: null,
  uiRootId: 'bili-ad-skip-ui-root',
  bvMonitorId: null,
  lastBV: null,
  pendingTimeouts: [],
  gmRequestSeq: 0,
  activeRequestSeqs: new Set(),
  uiCreated: false,
};

/* ========== UI ========== */
function createUI(){
  const existing = document.getElementById(state.uiRootId);
  if(existing) return;

  const root = document.createElement('div'); root.id = state.uiRootId;
  root.style.cssText = 'position:fixed;top:78px;right:48px;z-index:2147483647;font-family:Microsoft YaHei,Arial;';

  const mini = document.createElement('div'); mini.id='bili-mini-ui';
  mini.style.cssText='background:rgba(0,10,26,0.95);color:#fff;border:2px solid #00a1d6;border-radius:10px;padding:8px 12px;cursor:pointer;box-shadow:0 8px 30px rgba(0,0,0,0.6);';
  mini.innerHTML = `<div style="display:flex;align-items:center;gap:10px"><span id="bili-mini-status">跳点: 等待</span><button id="bili-expand-ui" style="background:transparent;border:none;color:#00a1d6;cursor:pointer;font-weight:700">展开</button></div>`;
  root.appendChild(mini);

  const panel = document.createElement('div'); panel.id='bili-ad-skip-ui';
  panel.style.cssText='display:none; width:720px; max-width:92vw; min-width:340px; background:rgba(0,10,26,0.95); color:#fff; border:2px solid #00a1d6; border-radius:10px; padding:12px; box-shadow:0 10px 40px rgba(0,0,0,0.6);';
  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
      <div style="font-weight:700;font-size:15px">跳过助手（v0.2）</div>
      <div><button id="bili-close-ui" style="background:rgba(0,161,214,0.12);border:none;color:#fff;padding:6px 8px;border-radius:6px;cursor:pointer">缩小</button></div>
    </div>
    <div style="display:flex;gap:10px;margin-bottom:10px;">
      <div style="flex:1;">
        <div style="font-weight:600">弹幕匹配（A → B） 匹配: <span id="bili-match-count">0</span></div>
        <div id="bili-danmu-list" style="max-height:170px;overflow:auto;font-size:13px;color:#e6f7ff;padding:8px;background:rgba(0,0,0,0.12);border-radius:6px;margin-top:6px"></div>
      </div>
      <div style="width:360px;">
        <div style="font-weight:600">候选时间对（全部列出） 总数: <span id="bili-candidates-count">0</span></div>
        <div id="bili-candidates-list" style="max-height:250px;overflow:auto;font-size:13px;color:#e6f7ff;padding:8px;background:rgba(0,0,0,0.12);border-radius:6px;margin-top:6px"></div>
      </div>
    </div>
    <div id="bili-log" style="max-height:360px;overflow:auto;font-size:13px;padding:8px;border-radius:6px;background:rgba(0,0,0,0.2);"></div>
  `;
  root.appendChild(panel);
  document.body.appendChild(root);
  state.uiCreated = true;

  document.getElementById('bili-expand-ui').addEventListener('click', ()=>{ panel.style.display='block'; mini.style.display='none'; });
  document.getElementById('bili-close-ui').addEventListener('click', ()=>{ panel.style.display='none'; mini.style.display='block'; addLog('UI 已隐藏（可点击展开）'); });
}

function removeUI(){
  const el = document.getElementById(state.uiRootId);
  if(el && el.parentNode) el.parentNode.removeChild(el);
  state.uiCreated = false;
}

/* ========== 日志与显示 ========== */
function addLog(msg){
  const el = document.getElementById('bili-log');
  const line = `[${new Date().toLocaleTimeString()}] ${msg}`;
  if(el){
    const p = document.createElement('div');
    p.style.padding='6px 4px';
    p.style.borderBottom='1px dashed rgba(255,255,255,0.04)';
    p.textContent = line;
    el.appendChild(p);
    el.scrollTop = el.scrollHeight;
  }else{
    console.log(line);
  }
}
function updateMiniStatus(textOrBool){
  const el = document.getElementById('bili-mini-status');
  if(!el) return;
  if(typeof textOrBool === 'boolean') el.textContent = textOrBool ? '跳点: 有' : '跳点: 无';
  else el.textContent = textOrBool;
}
function formatTime(sec){ sec = Math.floor(sec||0); const m=Math.floor(sec/60); const s=sec%60; return `${m}:${s.toString().padStart(2,'0')}`; }
function normalizeText(s){ if(!s) return s; s = s.replace(/[０-９]/g,c=>String.fromCharCode(c.charCodeAt(0)-0xFF10+0x30)); s = s.replace(/：/g,':').replace(/，/g,',').replace(/\s+/g,' ').trim(); return s; }

/* ========== 中文数字解析 ========== */
const CN_NUM = { '零':0,'一':1,'二':2,'两':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10,'百':100 };
function chineseToNumber(str){
  if(!str) return NaN; str = str.trim();
  if(str.length > CONFIG.chineseNumberMaxParseLen) return NaN;
  if(str.indexOf('百')!==-1){
    const parts = str.split('百'); const h = CN_NUM[parts[0]] || parseInt(parts[0]) || 0; const rest = parts[1] ? (chineseToNumber(parts[1])||0) : 0; return h*100 + rest;
  }
  if(str.indexOf('十')!==-1){
    const parts = str.split('十'); let tens = parts[0]===''?1:(CN_NUM[parts[0]]||parseInt(parts[0])||0); const rest = parts[1] ? (CN_NUM[parts[1]]||parseInt(parts[1])||0) : 0; return tens*10 + rest;
  }
  let total = 0;
  for(const ch of str){
    if(CN_NUM.hasOwnProperty(ch)) total = total*10 + CN_NUM[ch];
    else if(!isNaN(parseInt(ch))) total = total*10 + parseInt(ch);
    else return NaN;
  }
  return total;
}
function parseNumberToken(tok){
  if(tok === undefined || tok === null) return NaN;
  tok = tok.toString().trim();
  if(tok === '') return NaN;
  if(!isNaN(parseInt(tok))) return parseInt(tok);
  const cn = chineseToNumber(tok);
  return isNaN(cn) ? NaN : cn;
}

/* ========== 上下文判断 ========== */
function isMeasurementContext(text){
  if(!text) return false;
  const lower = text.toLowerCase();
  for(const tk of CONFIG.measurementTokens) if(lower.indexOf(tk)!==-1) return true;
  const extra = ['跑','速度','计时','百米','百码','成绩','公里','km','m/s','秒表','米/s'];
  for(const e of extra) if(text.indexOf(e)!==-1) return true;
  return false;
}
function isScoreContext(text){
  if(!text) return false;
  const t = text.replace(/\s+/g,'');
  const scoreKw = ['满分','评分','分数','打分','得分','多少分','评分为','分数是','给分','给我分','给他分'];
  for(const kw of scoreKw) if(t.indexOf(kw) !== -1) return true;
  if(/给.{0,8}分/.test(text)) return true;
  if(/(?:\d+|[零一二两三四五六七八九十百])分(?:是|，|,|。|$)/.test(text)) {
    if(/秒|分钟|:|：/.test(text)) return false;
    return true;
  }
  return false;
}
function isFastForwardInstruction(text){
  if(!text) return false;
  if(/(?:快进到|快进|跳到|跳至|跳过)(?:到)?/.test(text) && /[0-9零一二两三四五六七八九十百]{1,3}\s*分/.test(text)) return true;
  return false;
}
function isPostAgeContext(text){
  if(!text) return false;
  const raw = text.replace(/\s+/g,'');
  const kws = ['发布一分钟','发布于','发布后','刚出炉','刚发布','刚刚发布','刚发布','刚出','第一分钟','刚刚','发布','新鲜','热乎'];
  for(const k of kws){ if(raw.indexOf(k) !== -1) return true; }
  if(/(?:发布|刚|刚刚|刚出炉).{0,6}[0-9零一二两三四五六七八九十百]{1,3}分/.test(text)) return true;

  // 新增：简短形式识别，例如 "两分钟！" / "2分钟" / "2 分钟" 这类单句 —— 视为发布时长语境
  if(/^\s*(?:刚|刚刚|发布|新鲜|热乎)?\s*[0-9０-９零一二两三四五六七八九十百]{1,3}\s*(?:分|分钟)\s*[！!！]*\s*$/.test(text)) return true;

  return false;
}

/* ========== CID 解析 & 弹幕请求 ========== */
async function resolveCid(){
  try{
    const initial = window.__INITIAL_STATE__ || window.__PLAYINFO__ || window.__playinfo__ || null;
    if(initial){
      if(initial.videoData && initial.videoData.cid) return initial.videoData.cid;
      if(initial.cid) return initial.cid;
      if(initial.data && initial.data.cid) return initial.data.cid;
    }
    const metaCid = document.querySelector('meta[itemprop="cid"]') || document.querySelector('meta[name="video-cid"]');
    if(metaCid && metaCid.content) return metaCid.content;
    const scripts = Array.from(document.scripts||[]);
    for(const s of scripts){
      if(!s.textContent) continue;
      const m = s.textContent.match(/"cid"\s*:\s*(\d{4,12})/);
      if(m) return m[1];
    }
    const bvidMatch = location.href.match(/(BV[0-9A-Za-z]+)/);
    if(bvidMatch){
      const bv=bvidMatch[1];
      try{
        const url = `https://api.bilibili.com/x/web-interface/view?bvid=${bv}`;
        const resp = await new Promise((res,rej)=> GM_xmlhttpRequest({ method:'GET', url, onload:r=>res(r), onerror:err=>rej(err) }));
        let json = null;
        try{ json = (typeof resp.response === 'object') ? resp.response : JSON.parse(resp.responseText || '{}'); }catch(e){}
        if(json && json.data){
          if(Array.isArray(json.data.pages) && json.data.pages.length>0) return json.data.pages[0].cid || json.data.cid || null;
          if(json.data.cid) return json.data.cid;
        }
      }catch(e){}
    }
    if(window.__playinfo__ && window.__playinfo__.data && window.__playinfo__.data.cid) return window.__playinfo__.data.cid;
    return null;
  }catch(e){ console.error('resolveCid error', e); return null; }
}

function fetchDanmu(cid, runIdLocal){
  addLog(`开始请求弹幕 (cid=${cid})`);
  const url = `https://api.bilibili.com/x/v1/dm/list.so?oid=${cid}`;
  let attempt = 0;
  function doRequest(){
    attempt++;
    const seq = ++state.gmRequestSeq;
    state.activeRequestSeqs.add(seq);
    GM_xmlhttpRequest({
      method:'GET', url,
      onload(resp){
        state.activeRequestSeqs.delete(seq);
        if(runIdLocal !== state.runId){ addLog('弹幕响应来自旧 runId，忽略'); return; }
        if(resp.status===200 && resp.responseText){
          const xml = resp.responseText;
          const count = (xml.match(/<d\b/gi) || []).length;
          state.danmuCount = count;
          addLog(`初步弹幕数量: ${count}`);
          if(count>0){ parseDanmuAndAnalyze(xml, runIdLocal); return; }
        }
        tryCommentXml(cid).then(res=>{
          if(runIdLocal !== state.runId){ addLog('fallback XML 来自旧 runId，忽略'); return; }
          if(res){ const c=(res.match(/<d\b/gi)||[]).length; state.danmuCount=c; addLog(`fallback XML 条数: ${c}`); if(c>0){ parseDanmuAndAnalyze(res, runIdLocal); return; } }
          if(attempt < CONFIG.fetchRetries){ addLog(`重试 list.so（第 ${attempt+1} 次）`); const to = setTimeout(doRequest, CONFIG.fetchRetryDelayMs*attempt); state.pendingTimeouts.push(to); }
          else addLog('未能通过 XML 接口获取到弹幕，可能受限（登录/权限）');
        });
      },
      onerror(err){
        state.activeRequestSeqs.delete(seq);
        addLog(`弹幕请求错误: ${err}`);
        if(attempt < CONFIG.fetchRetries){ const to = setTimeout(doRequest, CONFIG.fetchRetryDelayMs*attempt); state.pendingTimeouts.push(to); }
        else addLog('请求出错');
      }
    });
  }
  doRequest();
}

function tryCommentXml(cid){
  return new Promise((resolve)=>{ const url=`https://comment.bilibili.com/${cid}.xml`; GM_xmlhttpRequest({ method:'GET', url, onload(r){ if(r.status===200 && r.responseText) resolve(r.responseText); else resolve(null); }, onerror(){ resolve(null); } }); });
}

/* ========== 解析 & 识别主逻辑 ========== */
function countNonTimeChars(s){
  if(!s) return 0;
  let t = s.replace(/[0-9０-９]/g,'');
  t = t.replace(/[零一二两三四五六七八九十百千]/g,'');
  t = t.replace(/分|分钟|秒|:|：|\.|，|,|%|\(|\)|\?|！|\!|\/|\\|→|>/g,'');
  t = t.replace(/[A-Za-z]/g,'').replace(/\s+/g,'');
  return t.length;
}

function parseDanmuAndAnalyze(xml, runIdLocal){
  try{
    if(runIdLocal !== state.runId){ addLog('parseDanmuAndAnalyze 来自旧 runId，忽略'); return; }
    addLog('解析弹幕中...');
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    const dnodes = Array.from(doc.getElementsByTagName('d') || []);
    const items = [];
    for(let i=0;i<dnodes.length && i<CONFIG.maxDanmuLoad;i++){
      const d = dnodes[i];
      const p = d.getAttribute('p') || '';
      const t = parseFloat((p.split(',')[0])||0) || 0;
      const txt = (d.textContent||'').replace(/\u3000/g,' ').replace(/\u00A0/g,' ').trim();
      items.push({ time: t, text: txt });
    }
    analyzeItems(items, runIdLocal);
  }catch(e){ addLog('解析出错: ' + (e.message||e)); }
}

function analyzeItems(items, runIdLocal){
  try{
    if(runIdLocal !== state.runId){ addLog('analyzeItems 来自旧 runId，忽略'); return; }
    state.isAnalyzing = true;
    updateMiniStatus('分析中');
    const videoDuration = (state.video && state.video.duration) ? state.video.duration : 0;
    if(!videoDuration || videoDuration <= 0){ addLog('无法获取视频长度，终止分析'); state.isAnalyzing=false; updateMiniStatus(false); return; }
    addLog(`视频长度: ${formatTime(videoDuration)}`);

    const colonRegex = /([0-9０-９零一二两三四五六七八九十百]{1,3})\s*[:：]\s*([0-9０-９零一二两三四五六七八九十百]{1,3})/g;
    const minuteSecondRegex = /([0-9０-９零一二两三四五六七八九十百]{1,3})\s*(?:分|分钟)\s*([0-9０-９零一二两三四五六七八九十百]{1,3})\s*(?:秒)?/g;
    const minuteOnlyRegex = /([0-9０-９零一二两三四五六七八九十百]{1,3})\s*(?:分|分钟)(?!\s*秒)/g;
    const spaceSeparatedRegex = /(?<!\d)([0-9０-９零一二两三四五六七八九十百]{1,3})\s+([0-9０-９零一二两三四五六七八九十百]{1,3})(?!\d)/g;
    const dotSeparatedRegex = /(?<!\d)([0-9０-９零一二两三四五六七八九十百]{1,3})\.([0-9０-９零一二两三四五六七八九十百]{1,2})(?!\d)/g;
    const contiguous3Regex = /(?<!\d)([0-9０-９零一二两三四五六七八九十百]{3})(?!\d)/g;
    const contiguous4Regex = /(?<!\d)([0-9０-９零一二两三四五六七八九十百]{4})(?!\d)/g;
    const arrowRightRegex = /((?:向右)|右)\s*([0-9０-９零一二两三四五六七八九十百]{1,3})\s*(下)?/i;
    const dianRegex = /([0-9０-９零一二两三四五六七八九十百]{1,3})\s*(?:点|点钟)\s*([0-9０-９零一二两三四五六七八九十百]{1,3})?(?:\s*(?:分|分钟))?(?:\s*([0-9０-９零一二两三四五六七八九十百]{1,3})\s*秒)?/g;

    const timeKwRegex = new RegExp(TIME_KEYWORDS.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'), 'i');
    const weightARegex = new RegExp(WEIGHT_A_KEYWORDS.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'), 'i');
    const weightBRegex = new RegExp(WEIGHT_B_KEYWORDS.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'), 'i');

    addLog(`[${new Date().toLocaleTimeString()}] 初步识别候选（未严格过滤）开始`);

    const rawCandidates = [];
    const weightOnlyA = [], weightOnlyB = [];

    for(const it of items){
      const orig = it.text || '';
      const raw = normalizeText(orig);
      if(!raw) continue;
      let baseW = CONFIG.baseWeight;
      const containsTimeKw = timeKwRegex.test(raw);
      const containsWeightA = weightARegex.test(raw);
      const containsWeightB = weightBRegex.test(raw);
      if(containsTimeKw) baseW += CONFIG.timeKwExtra;
      if(containsWeightA) baseW += 0.5;
      if(containsWeightB) baseW += CONFIG.targetKwExtra;
      if(!containsTimeKw && raw.length <= 6) baseW = Math.max(0.1, baseW * 0.2);

      const hasDigit = /[0-9零一二两三四五六七八九十百]/.test(raw);
      if(!hasDigit && containsWeightA) weightOnlyA.push({time: it.time, text: orig});
      if(!hasDigit && containsWeightB) weightOnlyB.push({time: it.time, text: orig});

      // 向右规则
      arrowRightRegex.lastIndex = 0;
      let m = arrowRightRegex.exec(raw);
      if(m){
        const prefix = m[1]; const nRaw = m[2]; const hasXia = !!m[3];
        const isXiangYou = /^向右/i.test(prefix);
        if(isXiangYou || hasXia){
          const n = isNaN(parseInt(nRaw)) ? chineseToNumber(nRaw) : parseInt(nRaw);
          if(!isNaN(n) && n>0 && n <= CONFIG.rightMaxN){
            const A = it.time; const B = Math.round(A + CONFIG.rightStepSeconds * n);
            if(B < videoDuration && B - A > 0) rawCandidates.push({trigger:A, target:B, text:orig, weight: baseW + 1.0, reasons:[`向右/右${n}下 -> B = A + ${CONFIG.rightStepSeconds}*${n}`]});
          }
        }
      }

      // 冒号
      colonRegex.lastIndex = 0;
      while((m = colonRegex.exec(raw)) !== null){
        const rMin=m[1], rSec=m[2];
        const min = parseNumberToken(rMin); const sec = parseNumberToken(rSec);
        if(isNaN(min)||isNaN(sec)) continue; if(sec>=60) continue;
        const target = min*60 + sec; if(target>=videoDuration||target<0) continue;
        rawCandidates.push({trigger: it.time, target, text: orig, weight: baseW + 0.5, reasons:[`冒号 ${m[0]}`]});
      }

      // 分秒
      minuteSecondRegex.lastIndex = 0;
      while((m = minuteSecondRegex.exec(raw)) !== null){
        const rMin=m[1], rSec=m[2];
        const min = parseNumberToken(rMin); const sec = parseNumberToken(rSec);
        if(isNaN(min)||isNaN(sec)) continue; if(sec>=60) continue;
        const target = min*60 + sec; if(target>=videoDuration||target<0) continue;
        rawCandidates.push({trigger: it.time, target, text: orig, weight: baseW + 0.5, reasons:[`分秒 ${m[0]}`]});
      }

      // 只有分钟
      minuteOnlyRegex.lastIndex = 0;
      while((m = minuteOnlyRegex.exec(raw)) !== null){
        const rMin=m[1]; const min = parseNumberToken(rMin);
        if(isNaN(min)) continue;
        const target = min*60; if(target>=videoDuration||target<0) continue;

        // 先处理原有针对“1分钟发布”的剔除逻辑（POSTAGE_TARGET_SECONDS）
        if(min === Math.floor(CONFIG.POSTAGE_TARGET_SECONDS/60) && it.time <= CONFIG.POSTAGE_WINDOW_SECONDS){
          if(isPostAgeContext(raw)
             || /分钟前/.test(raw)
             || /(^|\s)一分钟前/.test(raw)
             || /^\s*第?一?分钟[！!！]*$/.test(orig)
             || /^\s*一分钟[！!！]*$/.test(orig)
             || /发布.{0,6}分钟/.test(orig)
             || /刚.{0,6}发布/.test(orig)
             || /新鲜/.test(raw)
             || /热乎/.test(raw)
          ){
            addLog(`剔除候选（发布时长语境）: ${formatTime(it.time)} → ${min}:00 ; 文本: "${orig}"`);
            continue;
          }
        }

        // **新增**：剔除“早期（例如前 90s）出现的表示若干分钟（<=3 分钟）”的短形式弹幕
        if(it.time <= CONFIG.earliestPostageWindowSeconds && min <= CONFIG.earliestPostageMaxMinute){
          // 如果文本看起来像“2分钟/两分钟/2 分钟！” 之类，直接当作发布时长的误判剔除
          if(isPostAgeContext(raw) || /^\s*(?:[0-9０-９零一二两三四五六七八九十百]{1,3})\s*(?:分|分钟)\s*[！!！]*\s*$/.test(raw)){
            addLog(`剔除候选（早期发布语境）: ${formatTime(it.time)} → ${min}:00 ; 文本: "${orig}"`);
            continue;
          }
        }

        if(isScoreContext(raw)){
          addLog(`剔除候选（打分语境）: ${formatTime(it.time)} → ${min}:00 ; 文本: "${orig}"`);
          continue;
        }

        if(isFastForwardInstruction(raw)){
          const boosted = Math.max(1.0, baseW + CONFIG.fastForwardBoost);
          rawCandidates.push({trigger: it.time, target, text: orig, weight: boosted, reasons:[`快进指令（提权） ${m[0]}`]});
          addLog(`保留候选（快进指令 -> 提权）: ${formatTime(it.time)} → ${min}:00 ; 文本: "${orig}"`);
          continue;
        }

        rawCandidates.push({trigger: it.time, target, text: orig, weight: Math.max(0.5, baseW - 0.5), reasons:[`只有分钟 ${m[0]}（模糊）`]});
      }

      // 空格分隔
      spaceSeparatedRegex.lastIndex = 0;
      while((m = spaceSeparatedRegex.exec(raw)) !== null){
        const a=m[1], b=m[2]; const A=parseNumberToken(a), B=parseNumberToken(b);
        if(isNaN(A)||isNaN(B)) continue; if(B>=60) continue;
        const target = A*60 + B; if(target>=videoDuration||target<0) continue;
        if(isScoreContext(raw)){
          addLog(`剔除候选（打分语境）: ${formatTime(it.time)} → ${formatTime(target)} ; 文本: "${orig}"`);
          continue;
        }
        if(isFastForwardInstruction(raw)){
          const boosted = Math.max(1.0, baseW + CONFIG.fastForwardBoost);
          rawCandidates.push({trigger: it.time, target, text: orig, weight: boosted, reasons:[`快进指令（提权） 空格 ${m[0]}`]});
          addLog(`保留候选（快进指令 -> 提权）: ${formatTime(it.time)} → ${formatTime(target)} ; 文本: "${orig}"`);
          continue;
        }
        rawCandidates.push({trigger: it.time, target, text: orig, weight: baseW, reasons:[`空格 ${m[0]}`]});
      }

      // 点格式（X点Y）
      dianRegex.lastIndex = 0;
      while((m = dianRegex.exec(raw)) !== null){
        const g1=m[1], g2=m[2], g3=m[3];
        const A = parseNumberToken(g1);
        const B = g2 ? parseNumberToken(g2) : 0;
        const secPart = g3 ? parseNumberToken(g3) : 0;
        if(isNaN(A)) continue;
        let target = A*60 + (isNaN(B) ? 0 : B);
        if(!isNaN(secPart) && secPart>0) target = A*60 + (isNaN(B)?0:B) + secPart;
        if(target >= videoDuration || target < 0) continue;
        rawCandidates.push({trigger: it.time, target, text: orig, weight: Math.max(0.6, baseW + 0.5), reasons:[`点格式 ${m[0]}`]});
      }

      // 点号 6.20 / 8.43
      dotSeparatedRegex.lastIndex = 0;
      while((m = dotSeparatedRegex.exec(raw)) !== null){
        if(isMeasurementContext(raw)) continue;
        const a=m[1], b=m[2]; const A=parseNumberToken(a), B=parseNumberToken(b);
        if(isNaN(A)||isNaN(B)) continue; if(B>=60) continue;
        const target = A*60 + B; if(target>=videoDuration||target<0) continue;
        rawCandidates.push({trigger: it.time, target, text: orig, weight: Math.max(0.5, baseW - 0.2), reasons:[`点号 ${m[0]}`]});
      }

      // 连续 4/3 数字
      contiguous4Regex.lastIndex = 0;
      while((m = contiguous4Regex.exec(raw)) !== null){
        if(isMeasurementContext(raw)) continue;
        const numStr = m[1].replace(/[０-９]/g,c=>String.fromCharCode(c.charCodeAt(0)-0xFF10+0x30));
        const numVal = parseInt(numStr); if(isNaN(numVal)) continue;
        const mod100 = numVal % 100; if(mod100 >= 60) continue;
        const mm = Math.floor(numVal/100), ss = mod100; const target = mm*60 + ss;
        if(target>=videoDuration||target<0) continue; if(mm>99) continue;
        rawCandidates.push({trigger: it.time, target, text: orig, weight: baseW, reasons:[`连续4 ${numStr} -> ${mm}:${ss}`]});
      }
      contiguous3Regex.lastIndex = 0;
      while((m = contiguous3Regex.exec(raw)) !== null){
        if(isMeasurementContext(raw)) continue;
        const numStr = m[1].replace(/[０-９]/g,c=>String.fromCharCode(c.charCodeAt(0)-0xFF10+0x30));
        const numVal = parseInt(numStr); if(isNaN(numVal)) continue;
        const mod100 = numVal % 100; if(mod100 >= 60) continue;
        const mm = Math.floor(numVal/100), ss = mod100; const target = mm*60 + ss;
        if(target>=videoDuration||target<0) continue;
        rawCandidates.push({trigger: it.time, target, text: orig, weight: baseW - 0.2, reasons:[`连续3 ${numStr} -> ${mm}:${ss}`]});
      }
    } // end items loop

    addLog(`初步识别候选（未严格过滤）: ${rawCandidates.length} 条`);

    // 对常见垃圾数字弹幕进行大幅降权（如 9.9, 111, 233 等）
    const lowTokSet = new Set(CONFIG.lowWeightTokens.map(t=>t.toString()));
    const repeatedDigitsRegex = /(?<!\d)(\d)\1{2,}(?!\d)/; // 三个或以上重复数字，如 111, 333
    for(const c of rawCandidates){
      const txtNorm = (c.text || '').replace(/\s+/g,'').replace(/[０-９]/g,ch=>String.fromCharCode(ch.charCodeAt(0)-0xFF10+0x30));
      let matchedLow = false;
      for(const tk of lowTokSet){ if(txtNorm.indexOf(tk) !== -1){ matchedLow = true; break; } }
      if(!matchedLow && repeatedDigitsRegex.test(txtNorm)) matchedLow = true;
      if(matchedLow){
        const old = c.weight || CONFIG.baseWeight;
        c.weight = (c.weight || CONFIG.baseWeight) * CONFIG.lowWeightMultiplier;
        c.reasons = (c.reasons||[]).concat([`包含低权重数字弹幕（降权 x${CONFIG.lowWeightMultiplier}）`]);
      }
    }

    // 过滤阶段
    const filtered = [];
    for(const c of rawCandidates){
      const A = c.trigger, B = c.target;
      const delta = Math.abs(B - A);
      if(B + CONFIG.maxBackwardAllowedSec < A) continue;
      if(delta <= CONFIG.minDeltaSeconds){ addLog(`排除候选（差值 <= ${CONFIG.minDeltaSeconds}s）: ${formatTime(A)} → ${formatTime(B)} ; delta=${delta.toFixed(3)}s`); continue; }
      if(delta > CONFIG.maxDeltaSeconds){ addLog(`排除候选（差值 > ${CONFIG.maxDeltaSeconds}s）: ${formatTime(A)} → ${formatTime(B)} ; delta=${delta.toFixed(3)}s`); continue; }
      let hasForbidden = false;
      for(const tk of CONFIG.forbiddenTokens){ if((c.text||'').indexOf(tk) !== -1){ hasForbidden = true; break; } }
      if(hasForbidden){ addLog(`剔除候选（含不允许标记）: ${formatTime(A)} → ${formatTime(B)} ; 文本: "${(c.text||'').slice(0,60)}"`); continue; }
      const non = countNonTimeChars(c.text || '');
      if(non > CONFIG.maxNonTimeCharsAllowed){
        addLog(`非时间字符过多（降权）: ${formatTime(A)} → ${formatTime(B)} ; 非时间字符=${non} ; 文本: "${(c.text||'').slice(0,60)}"`);
        c.weight = (c.weight || CONFIG.baseWeight) * CONFIG.nonTimeCharsPenaltyFactor;
        c.reasons = (c.reasons||[]).concat([`非时间字符=${non}（降权 x${CONFIG.nonTimeCharsPenaltyFactor}）`]);
      }
      filtered.push(c);
    }

    addLog(`严格过滤后（含降权）候选数：${filtered.length}`);
    if(filtered.length === 0){ addLog('无有效时间弹幕候选（被过滤或静默剔除）'); state.isAnalyzing=false; updateMiniStatus(false); return; }

    // 合并 target -> triggers
    const targetMap = new Map();
    for(const c of filtered){
      if(!targetMap.has(c.target)) targetMap.set(c.target, []);
      targetMap.get(c.target).push({ trigger: c.trigger, text: c.text, weight: c.weight || CONFIG.baseWeight, reasons: c.reasons || [] });
    }

    // 转成数组并做合并（邻近 target 合并为一个组）
    const interim = [];
    for(const [target, arr] of targetMap.entries()){
      arr.sort((a,b)=>a.trigger - b.trigger);
      interim.push({ target, arr });
    }
    interim.sort((a,b)=>a.target - b.target);

    // 合并窗口：CONFIG.TARGET_GROUP_WINDOW 秒以内的 target 视为一组
    const grouped = [];
    for(const entry of interim){
      if(grouped.length===0) grouped.push({ targets: [entry.target], arr: entry.arr.slice() });
      else{
        const last = grouped[grouped.length-1];
        const lastTarget = last.targets[last.targets.length-1];
        if(entry.target - lastTarget <= CONFIG.TARGET_GROUP_WINDOW){
          last.targets.push(entry.target);
          last.arr = last.arr.concat(entry.arr);
        }else grouped.push({ targets: [entry.target], arr: entry.arr.slice() });
      }
    }

    // 对每组进行过早触发弹幕剔除（如果有明显早于中位的触发）
    for(const g of grouped){
      const triggers = g.arr.map(x=>x.trigger).sort((a,b)=>a-b);
      if(triggers.length>=3){
        const median = triggers[Math.floor(triggers.length/2)];
        const originalLen = g.arr.length;
        const filteredArr = g.arr.filter(x=> !(x.trigger < median - CONFIG.earliestIgnoreDeltaSeconds));
        if(filteredArr.length >= 2 && filteredArr.length < originalLen){
          addLog(`剔除过早触发弹幕：原 ${originalLen} 条 -> 剔除 ${originalLen - filteredArr.length} 条（>= ${CONFIG.earliestIgnoreDeltaSeconds}s 早于中位）`);
          g.arr = filteredArr.sort((a,b)=>a.trigger - b.trigger);
        }
      }
    }

    // 构造 targetStats (合并后) 并重新计算 clusters/weight 等
    const targetStats = [];
    for(const g of grouped){
      g.arr.sort((a,b)=>a.trigger - b.trigger);
      const triggerTimes = g.arr.map(x=>x.trigger);
      const earliest = triggerTimes.length>0 ? Math.min(...triggerTimes) : 0;
      const clusters = [];
      for(const t of triggerTimes){
        if(clusters.length===0) clusters.push([t]);
        else{
          const last = clusters[clusters.length-1];
          const avg = last.reduce((s,v)=>s+v,0)/last.length;
          if(Math.abs(t-avg) <= CONFIG.triggerWindow) last.push(t); else clusters.push([t]);
        }
      }
      const maxClusterSize = clusters.length ? Math.max(...clusters.map(c=>c.length)) : 1;
      let weightSum = g.arr.reduce((s,x)=>s + (x.weight || CONFIG.baseWeight), 0);
      weightSum *= (1 + maxClusterSize * CONFIG.clusterBoostFactor);
      targetStats.push({ targets: g.targets.slice(), arr: g.arr.slice(), count: g.arr.length, earliest, weightSum, clusters, maxClusterSize });
    }

    // 列出无数字的权重弹幕 A/B（从 items 中检测并重用）
    const waRe = new RegExp(WEIGHT_A_KEYWORDS.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'), 'i');
    const wbRe = new RegExp(WEIGHT_B_KEYWORDS.map(k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'), 'i');
    const weightAList = [], weightBList = [];
    for(const it of items){
      if(!(/[0-9零一二两三四五六七八九十百]/.test(it.text))){
        if(waRe.test(it.text)) weightAList.push({time: it.time, text: it.text});
        if(wbRe.test(it.text)) weightBList.push({time: it.time, text: it.text});
      }
    }
    if(weightAList.length>0){ addLog(`Detected weight-A 弹幕 共 ${weightAList.length} 条（列出前 30 条）`); weightAList.slice(0,30).forEach(w=> addLog(`  A: ${formatTime(w.time)} -> "${w.text}"`)); }
    if(weightBList.length>0){ addLog(`Detected weight-B 弹幕 共 ${weightBList.length} 条（列出前 30 条）`); weightBList.slice(0,30).forEach(w=> addLog(`  B: ${formatTime(w.time)} -> "${w.text}"`)); }

    // 为每个合并组计算 nearASupport/nearBSupport，并微调 weightSum（再次加权）
    for(const ts of targetStats){
      ts.nearASupport = [];
      ts.nearBSupport = [];
      const representativeTarget = Math.round(ts.targets.reduce((s,t)=>s+t,0)/ts.targets.length);
      for(const w of weightAList) if(Math.abs(w.time - ts.earliest) <= Math.floor(CONFIG.weightWindowSeconds/2)) ts.nearASupport.push(w);
      for(const w of weightBList) if(Math.abs(w.time - representativeTarget) <= Math.floor(CONFIG.weightWindowSeconds/2)) ts.nearBSupport.push(w);
      if(ts.nearASupport.length>0) ts.weightSum += ts.nearASupport.length * CONFIG.weightDanmuBoost;
      if(ts.nearBSupport.length>0) ts.weightSum += ts.nearBSupport.length * CONFIG.weightDanmuBoost;
      ts.representativeTarget = Math.round(ts.targets.reduce((s,t)=>s+t,0)/ts.targets.length);
      ts.maxClusterSize = ts.clusters.length ? Math.max(...ts.clusters.map(c=>c.length)) : 1;
    }

    // 排序输出：权重优先 -> cnt 次之 -> 最早时间兜底
    targetStats.sort((a,b)=>{
      if(b.weightSum !== a.weightSum) return b.weightSum - a.weightSum;
      if(b.count !== a.count) return b.count - a.count;
      return a.earliest - b.earliest;
    });

    const candListEl = document.getElementById('bili-candidates-list'); if(candListEl) candListEl.innerHTML='';
    const cntEl = document.getElementById('bili-candidates-count'); if(cntEl) cntEl.textContent = targetStats.length;

    addLog(`候选汇总（按 weight/cnt 排序，已合并近邻 B）共 ${targetStats.length} 条：`);
    state.lastCandidatesLog = [];
    targetStats.forEach((ts, idx) => {
      const reasonParts = [`来自弹幕 ${ts.count} 条`, `maxCluster=${ts.maxClusterSize}`];
      if(ts.nearASupport && ts.nearASupport.length) reasonParts.push(`A 权重弹幕: ${ts.nearASupport.map(w=>`${formatTime(w.time)} "${w.text}"`).join(' | ')}`);
      if(ts.nearBSupport && ts.nearBSupport.length) reasonParts.push(`B 权重弹幕: ${ts.nearBSupport.map(w=>`${formatTime(w.time)} "${w.text}"`).join(' | ')}`);
      const reason = reasonParts.join('；');
      addLog(`${idx+1}: ${formatTime(ts.earliest)} → ${formatTime(ts.representativeTarget)} (weight: ${ts.weightSum.toFixed(2)} , cnt:${ts.count})`);
      addLog(`    合并目标范围: [${ts.targets.map(t=>formatTime(t)).join(', ')}]`);
      addLog(`    触发示例: ${ts.arr.slice(0,6).map(x=>`${formatTime(x.trigger)} "${(x.text||'').slice(0,40)}"`).join(' ; ')}`);
      if(ts.nearBSupport && ts.nearBSupport.length) addLog(`    B 支持弹幕（时间+文本）: ${ts.nearBSupport.map(w=>`${formatTime(w.time)} "${w.text}"`).join(' | ')}`);
      if(ts.nearASupport && ts.nearASupport.length) addLog(`    A 支持弹幕（时间+文本）: ${ts.nearASupport.map(w=>`${formatTime(w.time)} "${w.text}"`).join(' | ')}`);
      state.lastCandidatesLog.push({A:ts.earliest, B:ts.representativeTarget, weight:ts.weightSum, count:ts.count, reason, samples: ts.arr.slice(0,6), nearASupport:ts.nearASupport, nearBSupport:ts.nearBSupport, mergedTargets: ts.targets});
      if(candListEl){
        const row = document.createElement('div'); row.style.padding='6px 4px'; row.style.marginBottom='6px'; row.style.borderBottom='1px solid rgba(255,255,255,0.03)';
        row.innerHTML = `<div style='font-size:12px;color:#00e6ff'>${idx+1}: ${formatTime(ts.earliest)} → ${formatTime(ts.representativeTarget)} (weight: ${ts.weightSum.toFixed(2)} , cnt:${ts.count})</div>
                         <div style='font-size:13px;opacity:0.95'>${(ts.arr[0] && ts.arr[0].text) || ''}
                         <div style="opacity:0.7;font-size:12px;">合并目标: ${ts.targets.map(t=>formatTime(t)).join(', ')}；${reason}</div></div>`;
        candListEl.appendChild(row);
      }
    });

    // 顶级阈值检查：最高候选必须 >= CONFIG.acceptWeightThreshold
    if(targetStats.length === 0){
      addLog('无候选可选（空列表）'); state.isAnalyzing=false; updateMiniStatus(false); return;
    }
    const top = targetStats[0];
    if(top.weightSum < CONFIG.acceptWeightThreshold){
      addLog(`最高候选权重 ${top.weightSum.toFixed(2)} < 阈值 ${CONFIG.acceptWeightThreshold.toFixed(2)} ，拒绝所有候选（按你的要求）`);
      state.isAnalyzing=false; updateMiniStatus(false); return;
    }

    // 选择跳点：按排序后优先选最前面的（即权重最高）
    let selected = false;
    for(let attempt=0; attempt < Math.min(5, targetStats.length); attempt++){
      const cand = targetStats[attempt];
      const A = cand.earliest, B = cand.representativeTarget, skip = B - A;
      addLog(`尝试候选 ${attempt+1}: ${formatTime(A)} → ${formatTime(B)} (跳过 ${skip}s) ，权重=${cand.weightSum.toFixed(2)} cnt=${cand.count}`);
      if(skip <= CONFIG.minSkipDuration){ addLog(`拒绝：跳过时长 <= ${CONFIG.minSkipDuration}s`); continue; }
      if(skip > videoDuration * CONFIG.maxSkipFraction){ addLog(`拒绝：跳过时长 > 视频长度的一半`); continue; }
      if(B > videoDuration){ addLog(`拒绝：B 超出视频时长`); continue; }
      const maxClusterSize = cand.maxClusterSize;
      const hasSupport = (cand.nearASupport && cand.nearASupport.length>0) || (cand.nearBSupport && cand.nearBSupport.length>0);
      if(maxClusterSize >= CONFIG.earliestClusterMinCount || hasSupport || cand.weightSum >= CONFIG.acceptWeightThreshold){
        state.jumpRules.clear(); state.jumpRules.set(A,B);
        addLog(`选定跳点：${formatTime(A)} → ${formatTime(B)}（cluster=${maxClusterSize}, weight=${cand.weightSum.toFixed(2)}）`);
        const listEl = document.getElementById('bili-danmu-list'); if(listEl) listEl.innerHTML='';
        cand.arr.slice(0, CONFIG.maxDisplayDanmu).forEach(x=>{
          const row=document.createElement('div'); row.style.padding='6px 4px'; row.style.marginBottom='6px'; row.style.borderBottom='1px solid rgba(255,255,255,0.03)';
          row.innerHTML = `<div style='font-size:12px;color:#00e6ff'>${formatTime(x.trigger)} → ${formatTime(B)}</div><div style='font-size:13px;opacity:0.95'>${(x.text||'')}</div>`;
          listEl.appendChild(row);
        });
        updateMiniStatus(true); selected = true; break;
      }else{
        addLog(`拒绝：候选验证不足（cluster=${maxClusterSize}, nearA=${cand.nearASupport?cand.nearASupport.length:0}, nearB=${cand.nearBSupport?cand.nearBSupport.length:0}, weight=${cand.weightSum.toFixed(2)})`);
      }
    }
    if(!selected) addLog('未选中跳点（按当前阈值与验证标准）');

    state.isAnalyzing = false;
    updateMiniStatus(selected);
  }catch(e){ console.error(e); addLog('分析异常: '+(e.message||e)); state.isAnalyzing=false; updateMiniStatus(false); }
}

/* ========== video 监听 ========== */
function initVideoListener(){
  try{
    if(!state.video) return;
    // 若已绑定过 listener，先移除
    if(state.videoListenerRef && typeof state.video.removeEventListener === 'function'){
      try{ state.video.removeEventListener('timeupdate', state.videoListenerRef); }catch(e){}
    }
    const onTimeUpdate = function(){
      const ct = this.currentTime;
      if(state.jumpRules.size===0) return;
      for(const [trigger,target] of state.jumpRules.entries()){
        if(ct >= trigger - 1 && ct <= trigger + 1){
          addLog(`在 ${formatTime(ct)} 触发跳转 → ${formatTime(target)}`);
          try{ this.currentTime = target; }catch(e){ console.warn('跳转失败', e); }
          state.jumpRules.delete(trigger);
        }
      }
    };
    state.videoListenerRef = onTimeUpdate;
    state.video.addEventListener('timeupdate', onTimeUpdate);
  }catch(e){ console.warn(e); }
}

/* ========== 清理 / 终止 ========== */
function teardown(){
  addLog('开始 teardown：清理旧状态与 UI');
  // 增加 runId 以使旧回调不再生效
  state.runId = (state.runId || 0) + 1;

  // 移除 UI
  try{ removeUI(); }catch(e){ console.warn(e); }

  // 移除 video 事件
  try{
    if(state.video && state.videoListenerRef) state.video.removeEventListener('timeupdate', state.videoListenerRef);
  }catch(e){ console.warn(e); }
  state.videoListenerRef = null;
  state.video = null;

  // 断开 mutationObserver
  try{ if(state.mutationObserver) { state.mutationObserver.disconnect(); state.mutationObserver = null; } }catch(e){}

  // 清除 pending timeouts
  try{ state.pendingTimeouts.forEach(t=>clearTimeout(t)); state.pendingTimeouts = []; }catch(e){}

  // 取消 active GM 请求标记（回调会被 runId 检查忽略）
  try{ state.activeRequestSeqs.clear(); }catch(e){}

  // 清除 jump rules 等
  try{ state.jumpRules.clear(); }catch(e){}
  state.lastCandidatesLog = [];
  state.danmuCount = 0;
  state.isAnalyzing = false;
}

/* ========== 初始化流程 ========== */
async function runOnce(){
  // 每次运行前，确保已有旧 run 清理（避免冲突）
  teardown();
  const myRunId = ++state.runId;
  addLog('脚本启动（runId=' + myRunId + '）');

  createUI();
  addLog('脚本已加载（v0.2.2：增强早期发布时长误判剔除）');

  function findVideo(){
    state.video = document.querySelector('video');
    if(state.video){ addLog('检测到 video 元素'); initVideoListener(); return true; }
    return false;
  }
  if(!findVideo()){
    addLog('等待 video 元素加载...');
    const obs = new MutationObserver(()=>{ if(findVideo()){ try{ obs.disconnect(); }catch(e){} } });
    obs.observe(document.body, { childList:true, subtree:true });
    state.mutationObserver = obs;
  }

  const cid = await resolveCid();
  if(cid){ state.cid = cid; addLog('获取到 CID: '+cid); fetchDanmu(cid, myRunId); }
  else addLog('无法获取 CID，请刷新页面或检查视频');
}

/* ========== BV 监控（每隔 10s） + history hook（更快速响应 SPA 路由） ========== */
function getBVFromHref(){
  const m = location.href.match(/(BV[0-9A-Za-z]+)/);
  return m ? m[1] : null;
}

function startBVMonitor(){
  // 防止重复创建
  if(state.bvMonitorId !== null) return;

  // 先初始化 lastBV
  state.lastBV = getBVFromHref();

  // history API hook（捕获 pushState/replaceState）
  (function(history){
    const push = history.pushState;
    const replace = history.replaceState;
    history.pushState = function(stateArg){
      const ret = push.apply(history, arguments);
      window.dispatchEvent(new Event('locationchange'));
      return ret;
    };
    history.replaceState = function(stateArg){
      const ret = replace.apply(history, arguments);
      window.dispatchEvent(new Event('locationchange'));
      return ret;
    };
  })(window.history);

  window.addEventListener('popstate', ()=> window.dispatchEvent(new Event('locationchange')));
  window.addEventListener('locationchange', ()=> {
    const bv = getBVFromHref();
    if(bv && bv !== state.lastBV){
      addLog(`locationchange 触发：BV 变化 ${state.lastBV} -> ${bv}，将重启脚本`);
      restartForNewBV(bv);
    }
  });

  // 10s 轮询备份
  state.bvMonitorId = setInterval(()=>{
    try{
      const bv = getBVFromHref();
      if(bv && bv !== state.lastBV){
        addLog(`轮询检测到 BV 号改变: ${state.lastBV} → ${bv} ，重启脚本`);
        restartForNewBV(bv);
      }
    }catch(e){ console.warn(e); }
  }, 10000);
}

function stopBVMonitor(){
  if(state.bvMonitorId !== null){ clearInterval(state.bvMonitorId); state.bvMonitorId = null; }
}

function restartForNewBV(newBv){
  try{
    const old = state.lastBV;
    state.lastBV = newBv;
    // teardown + runOnce
    teardown();
    // 等短暂时间再 run（确保 DOM 清理完成）
    const to = setTimeout(()=>{ runOnce(); }, 200);
    state.pendingTimeouts.push(to);
  }catch(e){ console.warn(e); }
}

/* ========== 启动 ========== */
(function boot(){
  // 启动 BV 监控（一次性）
  startBVMonitor();

  if(document.readyState === 'complete' || document.readyState === 'interactive'){ setTimeout(runOnce, 300); }
  else window.addEventListener('load', runOnce);
})();

})(); // end
