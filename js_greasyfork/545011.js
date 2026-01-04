// ==UserScript==
// @name         AoN PF2e Creature Stat Tier Highlighter
// @namespace    https://2e.aonprd.com/
// @version      1.1.1
// @description  Color-codes PF2e creature stats on AoN (Monsters/NPCs/Hazards).
// @author       leonissenbaum & ChatGPT
// @match        https://2e.aonprd.com/Monsters.aspx*
// @match        https://2e.aonprd.com/Creatures.aspx*
// @match        https://2e.aonprd.com/NPCs.aspx*
// @match        https://2e.aonprd.com/Hazards.aspx*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545011/AoN%20PF2e%20Creature%20Stat%20Tier%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/545011/AoN%20PF2e%20Creature%20Stat%20Tier%20Highlighter.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // ---------- CONFIG ----------
    const DEBUG = false;
    const COLORS = {
        terrible: "#ff0000",
        low:      "#ff8000",
        moderate: "#ffff54",
        high:     "#3cff00",
        extreme:  "#6cd8ff"
    };
    const LIGHT_BG_ALPHA = 0.18, UNDERLINE_ALPHA = 0.8;
    const LEGEND_TOP_PX = 80;
    const LEGEND_RIGHT_PX = 12;

    // ---------- UTILS ----------
    const log = (...a) => DEBUG && console.log("[PF2e tiers]", ...a);
    const norm = s => (s||"").replace(/\u00A0/g," ").replace(/[–−]/g,"-");
    const readText = el => norm(el?.innerText || el?.textContent || "");
    const fmt = x => (x>=0?`+${x}`:`${x}`);
    const rng = ([a,b]) => `${a}–${b}`;
    function hexToRgba(hex,a){const m=hex.replace("#","");const b=parseInt(m.length===3?m.split("").map(c=>c+c).join(""):m,16);return `rgba(${(b>>16)&255},${(b>>8)&255},${b&255},${a})`;}
    function makeBadge(text, tier, title="") {
        const color = COLORS[tier] || "#888";
        const span = document.createElement("span");
        span.className = `pf2-tier pf2-${tier}`;
        span.style.cssText = `padding:0 .20em;border-bottom:2px solid ${hexToRgba(color,UNDERLINE_ALPHA)};`+
            `background:${hexToRgba(color,LIGHT_BG_ALPHA)};border-radius:.25em;color:inherit`;
        if (title) span.title = title;
        span.textContent = text;
        return span;
    }

    // ---------- GM CORE BENCHMARKS ----------
    // Perception/Save mods reuse same table
    const PERC={ "-1":{e:9,h:8,m:5,l:2,t:0},0:{e:10,h:9,m:6,l:3,t:1},1:{e:11,h:10,m:7,l:4,t:2},2:{e:12,h:11,m:8,l:5,t:3},3:{e:14,h:12,m:9,l:6,t:4},4:{e:15,h:14,m:11,l:8,t:6},5:{e:17,h:15,m:12,l:9,t:7},6:{e:18,h:17,m:14,l:11,t:8},7:{e:20,h:18,m:15,l:12,t:10},8:{e:21,h:19,m:16,l:13,t:11},9:{e:23,h:21,m:18,l:15,t:12},10:{e:24,h:22,m:19,l:16,t:14},11:{e:26,h:24,m:21,l:18,t:15},12:{e:27,h:25,m:22,l:19,t:16},13:{e:29,h:26,m:23,l:20,t:18},14:{e:30,h:28,m:25,l:22,t:19},15:{e:32,h:29,m:26,l:23,t:20},16:{e:33,h:30,m:28,l:25,t:22},17:{e:35,h:32,m:29,l:26,t:23},18:{e:36,h:33,m:30,l:27,t:24},19:{e:38,h:35,m:32,l:29,t:26},20:{e:39,h:36,m:33,l:30,t:27},21:{e:41,h:38,m:35,l:32,t:28},22:{e:43,h:39,m:36,l:33,t:30},23:{e:44,h:40,m:37,l:34,t:31},24:{e:46,h:42,m:38,l:36,t:32} };
    const AC={ "-1":{e:18,h:15,m:14,l:12},0:{e:19,h:16,m:15,l:13},1:{e:19,h:16,m:15,l:13},2:{e:21,h:18,m:17,l:15},3:{e:22,h:19,m:18,l:16},4:{e:24,h:21,m:20,l:18},5:{e:25,h:22,m:21,l:19},6:{e:27,h:24,m:23,l:21},7:{e:28,h:25,m:24,l:22},8:{e:30,h:27,m:26,l:24},9:{e:31,h:28,m:27,l:25},10:{e:33,h:30,m:29,l:27},11:{e:34,h:31,m:30,l:28},12:{e:36,h:33,m:32,l:30},13:{e:37,h:34,m:33,l:31},14:{e:39,h:36,m:35,l:33},15:{e:40,h:37,m:36,l:34},16:{e:42,h:39,m:38,l:36},17:{e:43,h:40,m:39,l:37},18:{e:45,h:42,m:41,l:39},19:{e:46,h:43,m:42,l:40},20:{e:48,h:45,m:44,l:42},21:{e:49,h:46,m:45,l:43},22:{e:51,h:48,m:47,l:45},23:{e:52,h:49,m:48,l:46},24:{e:54,h:51,m:50,l:48} };
    const SAVES=PERC;
    const HP={ "-1":{h:[9,9],m:[7,8],l:[5,6]},0:{h:[17,20],m:[14,16],l:[11,13]},1:{h:[24,26],m:[19,21],l:[14,16]},2:{h:[36,40],m:[28,32],l:[21,25]},3:{h:[53,59],m:[42,48],l:[31,37]},4:{h:[72,78],m:[57,63],l:[42,48]},5:{h:[91,97],m:[72,78],l:[53,59]},6:{h:[115,123],m:[91,99],l:[67,75]},7:{h:[140,148],m:[111,119],l:[82,90]},8:{h:[165,173],m:[131,139],l:[97,105]},9:{h:[190,198],m:[151,159],l:[112,120]},10:{h:[215,223],m:[171,179],l:[127,135]},11:{h:[240,248],m:[191,199],l:[142,150]},12:{h:[265,273],m:[211,219],l:[157,165]},13:{h:[290,298],m:[231,239],l:[172,180]},14:{h:[315,323],m:[251,259],l:[187,195]},15:{h:[340,348],m:[271,279],l:[202,210]},16:{h:[365,373],m:[291,299],l:[217,225]},17:{h:[390,398],m:[311,319],l:[232,240]},18:{h:[415,423],m:[331,339],l:[247,255]},19:{h:[440,448],m:[351,359],l:[262,270]},20:{h:[465,473],m:[371,379],l:[277,285]},21:{h:[495,505],m:[395,405],l:[295,305]},22:{h:[532,544],m:[424,436],l:[317,329]},23:{h:[569,581],m:[454,466],l:[339,351]},24:{h:[617,633],m:[492,508],l:[367,383]} };
    const SKILLS={ "-1":{e:8,h:5,m:4,l:[1,2]},0:{e:9,h:6,m:5,l:[2,3]},1:{e:10,h:7,m:6,l:[3,4]},2:{e:11,h:8,m:7,l:[4,5]},3:{e:13,h:10,m:9,l:[5,7]},4:{e:15,h:12,m:10,l:[7,8]},5:{e:16,h:13,m:12,l:[8,10]},6:{e:18,h:15,m:13,l:[9,11]},7:{e:20,h:17,m:15,l:[11,13]},8:{e:21,h:18,m:16,l:[12,14]},9:{e:23,h:20,m:18,l:[13,16]},10:{e:25,h:22,m:19,l:[15,17]},11:{e:26,h:23,m:21,l:[16,19]},12:{e:28,h:25,m:22,l:[17,20]},13:{e:30,h:27,m:24,l:[19,22]},14:{e:31,h:28,m:25,l:[20,23]},15:{e:33,h:30,m:27,l:[21,25]},16:{e:35,h:32,m:28,l:[23,26]},17:{e:36,h:33,m:30,l:[24,28]},18:{e:38,h:35,m:31,l:[25,29]},19:{e:40,h:37,m:33,l:[27,31]},20:{e:41,h:38,m:34,l:[28,32]},21:{e:43,h:40,m:36,l:[29,34]},22:{e:45,h:42,m:37,l:[31,35]},23:{e:46,h:43,m:38,l:[32,36]},24:{e:48,h:45,m:40,l:[33,38]} };
    const ATK={ "-1":{e:10,h:8,m:6,l:4},0:{e:10,h:8,m:6,l:4},1:{e:11,h:9,m:7,l:5},2:{e:13,h:11,m:9,l:7},3:{e:14,h:12,m:10,l:8},4:{e:16,h:14,m:12,l:9},5:{e:17,h:15,m:13,l:11},6:{e:19,h:17,m:15,l:12},7:{e:20,h:18,m:16,l:13},8:{e:22,h:20,m:18,l:15},9:{e:23,h:21,m:19,l:16},10:{e:25,h:23,m:21,l:17},11:{e:27,h:24,m:22,l:19},12:{e:28,h:26,m:24,l:20},13:{e:29,h:27,m:25,l:21},14:{e:31,h:29,m:27,l:23},15:{e:32,h:30,m:28,l:24},16:{e:34,h:32,m:30,l:25},17:{e:35,h:33,m:31,l:27},18:{e:37,h:35,m:33,l:28},19:{e:38,h:36,m:34,l:29},20:{e:40,h:38,m:36,l:31},21:{e:41,h:39,m:37,l:32},22:{e:43,h:41,m:39,l:33},23:{e:44,h:42,m:40,l:35},24:{e:46,h:44,m:42,l:36} };
    // Strike Damage averages (Table 2–10, parentheses values)
    const DMG={ "-1":{e:4,h:3,m:3,l:2},0:{e:6,h:5,m:4,l:3},1:{e:8,h:6,m:5,l:4},2:{e:11,h:9,m:8,l:6},3:{e:15,h:12,m:10,l:8},4:{e:18,h:14,m:12,l:9},5:{e:20,h:16,m:13,l:11},6:{e:23,h:18,m:15,l:12},7:{e:25,h:20,m:17,l:13},8:{e:28,h:22,m:18,l:15},9:{e:30,h:24,m:20,l:16},10:{e:33,h:26,m:22,l:17},11:{e:35,h:28,m:23,l:19},12:{e:38,h:30,m:25,l:20},13:{e:40,h:32,m:27,l:21},14:{e:43,h:34,m:28,l:23},15:{e:45,h:36,m:30,l:24},16:{e:48,h:37,m:31,l:25},17:{e:50,h:38,m:32,l:26},18:{e:53,h:40,m:33,l:27},19:{e:55,h:42,m:35,l:28},20:{e:58,h:44,m:37,l:29},21:{e:60,h:46,m:38,l:31},22:{e:63,h:48,m:40,l:32},23:{e:65,h:50,m:42,l:33},24:{e:68,h:52,m:44,l:35} };

    // NEW: Spell DCs and Spell Attack (GM Core Table 2–11)
    const SPELL_DC = {
        "-1":{e:19,h:16,m:13},0:{e:19,h:16,m:13},1:{e:20,h:17,m:14},2:{e:22,h:18,m:15},3:{e:23,h:20,m:17},
        4:{e:25,h:21,m:18},5:{e:26,h:22,m:19},6:{e:27,h:24,m:21},7:{e:29,h:25,m:22},8:{e:30,h:26,m:23},
        9:{e:32,h:28,m:25},10:{e:33,h:29,m:26},11:{e:34,h:30,m:27},12:{e:36,h:32,m:29},13:{e:37,h:33,m:30},
        14:{e:39,h:34,m:31},15:{e:40,h:36,m:33},16:{e:41,h:37,m:34},17:{e:43,h:38,m:35},18:{e:44,h:40,m:37},
        19:{e:46,h:41,m:38},20:{e:47,h:42,m:39},21:{e:48,h:44,m:41},22:{e:50,h:45,m:42},23:{e:51,h:46,m:43},
        24:{e:52,h:48,m:45}
    };
    const SPELL_ATK = {
        "-1":{e:11,h:8,m:5},0:{e:11,h:8,m:5},1:{e:12,h:9,m:6},2:{e:14,h:10,m:7},3:{e:15,h:12,m:9},
        4:{e:17,h:13,m:10},5:{e:18,h:14,m:11},6:{e:19,h:16,m:13},7:{e:21,h:17,m:14},8:{e:22,h:18,m:15},
        9:{e:24,h:20,m:17},10:{e:25,h:21,m:18},11:{e:26,h:22,m:19},12:{e:28,h:24,m:21},13:{e:29,h:25,m:22},
        14:{e:31,h:26,m:23},15:{e:32,h:28,m:25},16:{e:33,h:29,m:26},17:{e:35,h:30,m:27},18:{e:36,h:32,m:29},
        19:{e:38,h:33,m:30},20:{e:39,h:34,m:31},21:{e:40,h:36,m:33},22:{e:42,h:37,m:34},23:{e:43,h:38,m:35},
        24:{e:44,h:40,m:37}
    };

    // ---------- CLASSIFY ----------
    const order = t => ({e:0,h:1,m:2,l:3,t:4})[t] ?? 99;
    const tierName = l => ({e:"extreme",h:"high",m:"moderate",l:"low",t:"terrible"})[l] || "moderate";
    function classifyExact(val, targets){
        let best=null;
        for (const [tier,tgt] of Object.entries(targets)) {
            const diff=Math.abs(val-tgt);
            if (!best || diff<best.diff || (diff===best.diff && order(tier)<order(best.tier))) best={tier,tgt,diff};
        }
        return best;
    }
    function classifyRange(val, ranges){
        for (const tier of ["h","m","l"]) {
            const [min,max]=ranges[tier];
            if (val>=min && val<=max) return {tier,min,max};
        }
        let best=null;
        for (const tier of ["h","m","l"]) {
            const [min,max]=ranges[tier];
            const d = val<min ? (min-val) : (val-max);
            if (!best || d<best.d || (d===best.d && order(tier)<order(best.tier))) best={tier,min,max,d};
        }
        return best;
    }

    // ---------- STAT ROOT & LEVEL ----------
    function scoreStatHintsText(t){let s=0;if(/\bPerception\b/.test(t))s++;if(/\bAC\s+\d+\b/.test(t))s++;if(/\bHP\s+\d+\b/.test(t))s++;if(/\bFort(?:itude)?\s+[+\-−]\d+\b/i.test(t))s++;if(/\bRef(?:lex)?\s+[+\-−]\d+\b/i.test(t))s++;if(/\bWill\s+[+\-−]\d+\b/i.test(t))s++;return s;}
    function getStatRoot(){
        const els=document.querySelectorAll("article, section, div, main");
        let best=null;
        for (const el of els){
            const t=readText(el);
            if (!/\bPerception\b/.test(t)) continue;
            const sc=scoreStatHintsText(t)*10 - Math.log10((t.length||1));
            if (!best || sc>best.sc) best={el,sc};
        }
        return best?.el || document.body;
    }
    function getCreatureLevelNear(root){
        let el=root;
        for (let i=0;i<3 && el;i++){
            const m = readText(el).match(/\b(Creature|Hazard|Level)\s+(-?\d+)\b/i);
            if (m) return parseInt(m[2],10);
            el=el.parentElement;
        }
        return null;
    }

    // ---------- WALKERS ----------
    function findTextNodeAfterLabel(labelEl, numberRegex, stopLabelRe){
        const root = labelEl.parentElement;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_ALL, null);
        let past=false;
        while (walker.nextNode()){
            const node = walker.currentNode;
            if (node === labelEl) { past=true; continue; }
            if (!past) continue;
            if (node.nodeType === 1){
                if ((node.tagName === "B" || node.tagName === "STRONG") && stopLabelRe && stopLabelRe.test((node.textContent||"").trim())) {
                    return null;
                }
                continue;
            }
            if (node.nodeType !== 3) continue;
            const txt = node.nodeValue;
            const m = numberRegex.exec(txt);
            if (m) return { node, m };
        }
        return null;
    }

    // NEW: walk all text nodes between a bold label and the next bold label, running a callback on each text node
    function walkTextNodesBetween(labelEl, stopLabelRe, cb){
        const root = labelEl.parentElement;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_ALL, null);
        let past=false;
        while (walker.nextNode()){
            const node = walker.currentNode;
            if (node === labelEl) { past=true; continue; }
            if (!past) continue;
            if (node.nodeType === 1){
                if ((node.tagName === "B" || node.tagName === "STRONG") && stopLabelRe && stopLabelRe.test((node.textContent||"").trim())) {
                    return;
                }
                continue;
            }
            if (node.nodeType !== 3) continue;
            cb(node);
        }
    }

    function replaceMatchInTextNode(node, m, makeSpan){
        const txt = node.nodeValue;
        const start = m.index, end = start + m[0].length;
        const before = document.createTextNode(txt.slice(0,start));
        const badge = makeSpan(m[0]);
        const after  = document.createTextNode(txt.slice(end));
        const parent = node.parentNode;
        parent.replaceChild(after, node);
        parent.insertBefore(badge, after);
        parent.insertBefore(before, badge);
    }

    // ---------- HIGHLIGHTERS (existing) ----------
    function highlightPerception(root, lvl){
        const row=PERC[lvl]; if(!row) return;
        const labels = Array.from(root.querySelectorAll("b,strong")).filter(b => /^Perception\b/i.test((b.textContent||"").trim()));
        for (const b of labels){
            const hit = findTextNodeAfterLabel(b, /[+\-−]?\d+/, /^(AC|Fort|Fortitude|Ref|Reflex|Will|HP|Melee|Ranged|Strikes?|Languages|Skills)\b/i);
            if (!hit) continue;
            replaceMatchInTextNode(hit.node, hit.m, (n)=> makeBadge(n, tierName(classifyExact(parseInt(norm(n),10),row).tier),
                                                                    `E ${fmt(row.e)}, H ${fmt(row.h)}, M ${fmt(row.m)}, L ${fmt(row.l)}, T ${fmt(row.t)}`));
        }
    }

    function highlightAC(root, lvl){
        const row=AC[lvl]; if(!row) return;
        const labels = Array.from(root.querySelectorAll("b,strong")).filter(b => /^AC\b/i.test((b.textContent||"").trim()));
        for (const b of labels){
            const hit = findTextNodeAfterLabel(b, /\d+/, /^(Fort|Fortitude|Ref|Reflex|Will|HP|Melee|Ranged|Strikes?|Perception|Skills)\b/i);
            if (!hit) continue;
            replaceMatchInTextNode(hit.node, hit.m, (n)=> makeBadge(n, tierName(classifyExact(parseInt(n,10),row).tier),
                                                                    `E ${row.e}, H ${row.h}, M ${row.m}, L ${row.l}`));
        }
    }

    function highlightSaves(root, lvl){
        const row=SAVES[lvl]; if(!row) return;
        const want=[/^Fort(?:itude)?\b/i,/^Ref(?:lex)?\b/i,/^Will\b/i];
        for (const re of want){
            const labels = Array.from(root.querySelectorAll("b,strong")).filter(b => re.test((b.textContent||"").trim()));
            for (const b of labels){
                const hit = findTextNodeAfterLabel(b, /[+\-−]?\d+/, /^(AC|HP|Melee|Ranged|Strikes?|Perception|Skills|Damage)\b/i);
                if (!hit) continue;
                replaceMatchInTextNode(hit.node, hit.m, (n)=> makeBadge(n, tierName(classifyExact(parseInt(norm(n),10),row).tier),
                                                                        `E ${fmt(row.e)}, H ${fmt(row.h)}, M ${fmt(row.m)}, L ${fmt(row.l)}, T ${fmt(row.t)}`));
            }
        }
    }

    function highlightHP(root, lvl){
        const row=HP[lvl]; if(!row) return;
        const labels = Array.from(root.querySelectorAll("b,strong")).filter(b => /^HP\b/i.test((b.textContent||"").trim()));
        for (const b of labels){
            const hit = findTextNodeAfterLabel(b, /\d+/, /^(AC|Fort|Fortitude|Ref|Reflex|Will|Melee|Ranged|Strikes?|Perception|Skills)\b/i);
            if (!hit) continue;
            replaceMatchInTextNode(hit.node, hit.m, (n)=> makeBadge(n, tierName(classifyRange(parseInt(n,10),row).tier),
                                                                    `High ${rng(row.h)}, Moderate ${rng(row.m)}, Low ${rng(row.l)}`));
        }
    }

    function highlightSkills(root, lvl){
        const row=SKILLS[lvl]; if(!row) return;
        const labels = Array.from(root.querySelectorAll("b,strong"))
        .filter(b => /^Skills\b/i.test((b.textContent||"").trim()));
        const stopRe = /^(Perception|Languages|Skills|AC|Fort|Fortitude|Ref|Reflex|Will|HP|Melee|Ranged|Strikes?|Speed|Items|Immunities|Weaknesses|Resistances)\b/i;

        for (const b of labels){
            // Collect text nodes from after "Skills" up to the first <br> or next bold header
            const nodes=[];
            for (let n=b.nextSibling; n; n=n.nextSibling){
                if (n.nodeType===1){
                    const tag=n.tagName;
                    if (tag==="BR" || tag==="HR" || ((tag==="B"||tag==="STRONG") && stopRe.test((n.textContent||"").trim()))) break;
                    const tw=document.createTreeWalker(n, NodeFilter.SHOW_TEXT, null);
                    while (tw.nextNode()) nodes.push(tw.currentNode);
                } else if (n.nodeType===3){
                    nodes.push(n);
                }
            }

            const lmid = Math.round((row.l[0]+row.l[1])/2);
            for (const tn of nodes){
                const text = tn.nodeValue;
                const rx = /([+\-−]\d+)/g;
                let m, last=0, any=false;
                const out=[];
                while ((m=rx.exec(text))!==null){
                    // Skip ability scores like "Str -2, Dex +3"
                    const pre = text.slice(Math.max(0, m.index-6), m.index);
                    if (/\b(Str|Dex|Con|Int|Wis|Cha)\s*$/i.test(pre)) continue;

                    out.push(text.slice(last, m.index));
                    const val = parseInt((m[1]||"").replace(/[–−]/g,"-"),10);
                    const cls = classifyExact(val,{e:row.e,h:row.h,m:row.m,l:lmid});
                    out.push(makeBadge(m[1], tierName(cls.tier),
                                       `E ${fmt(row.e)}, H ${fmt(row.h)}, M ${fmt(row.m)}, L ${rng(row.l)}`));
                    last = m.index + m[1].length; any=true;
                }
                if (any){
                    out.push(text.slice(last));
                    const parent=tn.parentNode;
                    for (const piece of out){
                        parent.insertBefore(piece instanceof Node ? piece : document.createTextNode(piece), tn);
                    }
                    parent.removeChild(tn);
                }
            }
        }
    }



    function highlightStrikeAttack(root, lvl){
        const row=ATK[lvl]; if(!row) return;
        const labels = Array.from(root.querySelectorAll("b,strong")).filter(b => /^(Melee|Ranged)\b/i.test((b.textContent||"").trim()));
        for (const b of labels){
            const hit = findTextNodeAfterLabel(b, /[+\-−]\d+/, /^(Damage|Melee|Ranged)\b/i);
            if (!hit) continue;
            replaceMatchInTextNode(hit.node, hit.m, (n)=> makeBadge(n, tierName(classifyExact(parseInt(norm(n),10),row).tier),
                                                                    `E ${fmt(row.e)}, H ${fmt(row.h)}, M ${fmt(row.m)}, L ${fmt(row.l)}`));
        }
    }

    // ---- Strike Damage ----
    function avgOfExpr(expr){
        const s = norm(expr);
        let total = 0;
        const diceRe = /([+\-−]?)\s*(\d+)\s*[dD]\s*(\d+)/g;
        let m;
        while ((m=diceRe.exec(s)) !== null){
            const sign = (m[1] === "-" || m[1] === "−") ? -1 : 1;
            const count = parseInt(m[2],10);
            const die = parseInt(m[3],10);
            const dieAvg = {4:2.5,6:3.5,8:4.5,10:5.5,12:6.5}[die] || (die/2+0.5);
            total += sign * count * dieAvg;
        }
        const flatRe = /([+\-−])\s*(\d+)(?!\s*[dD])/g;
        while ((m=flatRe.exec(s)) !== null){
            const sign = (m[1] === "-" || m[1] === "−") ? -1 : 1;
            total += sign * parseInt(m[2],10);
        }
        return Math.round(total);
    }

    function highlightStrikeDamage(root, lvl){
        const targets = DMG[lvl]; if(!targets) return;
        const labels = Array.from(root.querySelectorAll("b,strong")).filter(b => /^Damage\b/i.test((b.textContent||"").trim()));
        for (const b of labels){
            const hit = findTextNodeAfterLabel(b, /\d+\s*[dD]\s*\d+/, /^(Melee|Ranged|Damage|Spell|DC|Attack)\b/i);
            if (!hit) continue;

            const txt = hit.node.nodeValue;
            let start = hit.m.index;
            let end = start + hit.m[0].length;
            while (end < txt.length) {
                const rest = txt.slice(end);
                const m2 = /^[ \t]*([+\-−])\s*(?:(\d+[dD]\d+)|(\d+))/.exec(rest);
                if (!m2) break;
                const kw = rest.slice(m2[0].length, m2[0].length+12).toLowerCase();
                if (/\b(persistent|splash|plus|and|or|;|,)/.test(kw)) { end += m2[0].length; break; }
                end += m2[0].length;
            }
            const expr = txt.slice(start, end);
            const avg = avgOfExpr(expr);
            const cls = classifyExact(avg, targets);
            const title = `avg ${avg} vs E ${targets.e}, H ${targets.h}, M ${targets.m}, L ${targets.l}`;

            const before = document.createTextNode(txt.slice(0,start));
            const badge = makeBadge(expr, tierName(cls.tier), title);
            const after  = document.createTextNode(txt.slice(end));
            const parent = hit.node.parentNode;
            parent.replaceChild(after, hit.node);
            parent.insertBefore(badge, after);
            parent.insertBefore(before, badge);
        }
    }

    // ---------- NEW HIGHLIGHTERS: Spellcasting DCs & Ability Save DCs ----------
    function highlightSpellcasting(root, lvl){
        const dcRow = SPELL_DC[lvl], atkRow = SPELL_ATK[lvl];
        if (!dcRow || !atkRow) return;

        const isSpellHeader = (s) => /\b(Arcane|Divine|Occult|Primal)\b.*\bSpells\b/i.test(s);

        const labels = Array.from(root.querySelectorAll("b,strong")).filter(b => {
            const t = (b.textContent||"").trim();
            return isSpellHeader(t);
        });

        for (const b of labels){
            // Replace DC <num> and attack +<num> between this label and the next bold label
            walkTextNodesBetween(b, /^(?!x)x/ /*no extra stop*/, (tn)=>{
                let text = tn.nodeValue;
                let pieces = [];
                let changed = false;

                // 1) DC <num>
                const dcRx = /\bDC\s+(\d{1,3})\b/gi;
                let last = 0, m;
                let tmpOut = [];
                while ((m = dcRx.exec(text)) !== null){
                    tmpOut.push(text.slice(last, m.index));
                    const badge = makeBadge(m[1], tierName(classifyExact(parseInt(m[1],10), dcRow).tier),
                                            `E ${dcRow.e}, H ${dcRow.h}, M ${dcRow.m}`);
                    tmpOut.push(document.createTextNode("DC "));
                    tmpOut.push(badge);
                    last = m.index + m[0].length;
                    changed = true;
                }
                tmpOut.push(text.slice(last));

                // Rebuild node if changed
                if (changed){
                    const parent = tn.parentNode;
                    for (const part of tmpOut) parent.insertBefore(part instanceof Node ? part : document.createTextNode(part), tn);
                    parent.removeChild(tn);
                    // After DOM surgery, tn is gone; create a fresh tn for next phase on the last text chunk
                    tn = tmpOut[tmpOut.length-1] instanceof Node ? null : null;
                }
            });

            // Separate pass for attack +N (do it after, across fresh walkers)
            walkTextNodesBetween(b, /^(?!x)x/, (tn)=>{
                const text = tn.nodeValue;
                const atkRx = /\battack\s+([+\-−]\d{1,3})\b/gi;
                let m, last=0, any=false;
                const out=[];
                while ((m=atkRx.exec(text))!==null){
                    out.push(text.slice(last, m.index));
                    out.push("attack ");
                    const val = parseInt(norm(m[1]),10);
                    const cls = classifyExact(val, atkRow);
                    out.push(makeBadge(m[1], tierName(cls.tier), `E ${fmt(atkRow.e)}, H ${fmt(atkRow.h)}, M ${fmt(atkRow.m)}`));
                    last = m.index + m[0].length; any=true;
                }
                if (any){
                    out.push(text.slice(last));
                    const parent=tn.parentNode;
                    for (const p of out) parent.insertBefore(p instanceof Node ? p : document.createTextNode(p), tn);
                    parent.removeChild(tn);
                }
            });
        }
    }

    function highlightAbilitySaveDCs(root, lvl){
        const dcRow = SPELL_DC[lvl]; if(!dcRow) return;

        // Bold labels that are NOT standard stat headers and NOT Recall Knowledge blocks
        const EXCLUDE = /^(Perception|AC|Fort|Fortitude|Ref|Reflex|Will|HP|Melee|Ranged|Strikes?|Languages|Skills|Speed|Items|Immunities|Weaknesses|Resistances|Recall Knowledge|Unspecific Lore|Specific Lore|Rituals?|Constant|Countermeasures?|Disable|Reset|Offense|Defense|Statistics|Spells?)\b/i;

        const labels = Array.from(root.querySelectorAll("b,strong")).filter(b => {
            const t = (b.textContent||"").trim();
            return !EXCLUDE.test(t);
        });

        for (const b of labels){
            walkTextNodesBetween(b, /^(?!x)x/, (tn)=>{
                const text = tn.nodeValue;
                // Look for "DC <num>" that clearly relates to a save
                const rx = /\bDC\s+(\d{1,3})\b/gi;
                let m, last=0, changed=false;
                const out=[];
                while ((m=rx.exec(text))!==null){
                    const after = text.slice(m.index + m[0].length, m.index + m[0].length + 50);
                    const before = text.slice(Math.max(0, m.index-20), m.index + m[0].length);
                    if (/\b(Fortitude|Reflex|Will)\b/i.test(after) || /\bsave\b/i.test(after) || /\bbasic\b/i.test(after) || /\bsave\b/i.test(before)){
                        out.push(text.slice(last, m.index));
                        out.push("DC ");
                        const val = parseInt(m[1],10);
                        const cls = classifyExact(val, dcRow);
                        out.push(makeBadge(m[1], tierName(cls.tier), `E ${dcRow.e}, H ${dcRow.h}, M ${dcRow.m}`));
                        last = m.index + m[0].length; changed=true;
                    }
                }
                if (changed){
                    out.push(text.slice(last));
                    const parent=tn.parentNode;
                    for (const p of out) parent.insertBefore(p instanceof Node ? p : document.createTextNode(p), tn);
                    parent.removeChild(tn);
                }
            });
        }
    }

    // ---------- LEGEND ----------
    function injectLegend(root){
        if (window.matchMedia("(orientation: portrait)").matches) {
            return
        }
        if (document.getElementById("pf2-tier-legend")) return;
        const box = document.createElement("div");
        box.id = "pf2-tier-legend";
        box.innerHTML = `
      <div style="font-weight:600;margin-bottom:.25rem">Stat Benchmarks</div>
      ${legendRow("terrible")} ${legendRow("low")} ${legendRow("moderate")} ${legendRow("high")} ${legendRow("extreme")}
      <div style="margin-top:.35rem;font-size:.8em;opacity:.8">Detected near stat block.</div>
    `.trim();
        Object.assign(box.style, {
            position:"fixed",
            top: LEGEND_TOP_PX+"px",
            right: LEGEND_RIGHT_PX+"px",
            padding:".5rem .6rem",
            background:"rgba(0,0,0,0.04)",
            border:"1px solid rgba(0,0,0,.08)",
            borderRadius:"8px",
            zIndex:"9999",
            maxWidth:"240px",
            fontFamily:"inherit",
            fontSize:"12.5px",
            lineHeight:"1.3"
        });
        root.appendChild(box);
    }
    function legendRow(name){
        const c=COLORS[name];
        const sw=`<span style="display:inline-block;width:.85em;height:.85em;background:${hexToRgba(c,LIGHT_BG_ALPHA)};border-bottom:2px solid ${hexToRgba(c,UNDERLINE_ALPHA)};vertical-align:middle;margin-right:.4em;border-radius:3px"></span>`;
        return `<div>${sw}${name[0].toUpperCase()+name.slice(1)}</div>`;
    }

    // ---------- BOOT ----------
    let mo=null, lastSnapshot="";
    function snapshot(el){ return readText(el).slice(0,2000); }
    function process(root){
        const lvl = getCreatureLevelNear(root);
        if (lvl == null) return log("no level near stat block");
        highlightPerception(root, lvl);
        highlightAC(root, lvl);
        highlightSaves(root, lvl);
        highlightHP(root, lvl);
        highlightSkills(root, lvl);
        highlightStrikeAttack(root, lvl);
        highlightStrikeDamage(root, lvl);
        // NEW:
        highlightSpellcasting(root, lvl);      // e.g., "Divine Innate Spells DC 47, attack +37"
        highlightAbilitySaveDCs(root, lvl);    // e.g., "must succeed at a DC 47 Fortitude save"
        injectLegend(root);
        lastSnapshot = snapshot(root);
    }
    function reprocess(root){
        const now = snapshot(root);
        if (now === lastSnapshot) return;
        root.querySelectorAll(".pf2-tier").forEach(n => n.replaceWith(document.createTextNode(n.textContent)));
        document.getElementById("pf2-tier-legend")?.remove();
        process(root);
    }
    function attachObserver(root){
        if (mo) mo.disconnect();
        mo = new MutationObserver(()=>{ clearTimeout(attachObserver._t); attachObserver._t=setTimeout(()=>reprocess(root), 250); });
        mo.observe(root, { childList:true, subtree:true, characterData:true });
    }
    function waitForStatRoot(){
        return new Promise(resolve=>{
            const tick=()=>{
                const root=getStatRoot();
                if (root && scoreStatHintsText(readText(root))>=3) return resolve(root);
                setTimeout(tick,100);
            };
            tick();
        });
    }
    // Hotkey: Alt+Shift+P to force a refresh
    window.addEventListener("keydown",(e)=>{
        if (e.altKey && e.shiftKey && e.code==="KeyP"){
            const root=getStatRoot();
            root?.querySelectorAll(".pf2-tier").forEach(n=>n.replaceWith(document.createTextNode(n.textContent)));
            document.getElementById("pf2-tier-legend")?.remove();
            lastSnapshot="";
            process(root);
        }
    });

    waitForStatRoot().then(root=>{ process(root); attachObserver(root); });

})();
