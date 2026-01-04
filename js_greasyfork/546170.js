// ==UserScript==
// @name			[chordwiki] コード to ディグリー
// @description			ja.chordwiki.orgのキーが明記されいるページのコード名をディグリーに変換（キー未表記ページは推定）
// @namespace		https://greasyfork.org/ja/users/1023652
// @version			2.0.0.5
// @author			ゆにてぃー
// @match			https://ja.chordwiki.org/wiki*
// @match			https://ja.chordwiki.org/amp*
// @match			https://ja-chordwiki-org.cdn.ampproject.org/v/s/ja.chordwiki.org/amp*
// @icon			https://www.google.com/s2/favicons?sz=64&domain=ja.chordwiki.org
// @license			MIT
// @downloadURL https://update.greasyfork.org/scripts/546170/%5Bchordwiki%5D%20%E3%82%B3%E3%83%BC%E3%83%89%20to%20%E3%83%87%E3%82%A3%E3%82%B0%E3%83%AA%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/546170/%5Bchordwiki%5D%20%E3%82%B3%E3%83%BC%E3%83%89%20to%20%E3%83%87%E3%82%A3%E3%82%B0%E3%83%AA%E3%83%BC.meta.js
// ==/UserScript==

(async function(){
	'use strict';
	const debugging = false;
	const debug = debugging ? console.log : ()=>{};
	const userAgent = navigator.userAgent || navigator.vendor || window.opera;
	const isMobile = isMobileView();

	// 転調判定のしきい値
	const MOD_MIN_FIRST = 1.5; // ブロック内ベストキーの最低スコア
	const MOD_CHANGE_DELTA = 1.2; // 直前キーとの差がこの値以上で転調
	const MIN_TOKENS_FOR_INFER = 8;
	let isDeg = false;

	async function main(){
		addConvertFab();
		addManualInferFab();
		addRemoveCwKey();
		setupLineKeyUI();
		await restoreSavedSelections();
		addTransposeBar();
	}

	// ===== 右下固定の丸ボタン（FAB） =====
	function addConvertFab(){
		if(document.getElementById("cw-degree-fab"))return;
		const btn = h('button',{
				id: "cw-degree-fab",
				title: "コード名 ↔ ディグリー",
				onClick: ()=>{
					const hasKey = !!document.querySelector('p.key') || !!document.querySelector('select.cw-line-key');
					if(!hasKey){alert("キーがわからない");return;}
					if(!isDeg){
						convertDocument("deg");
						isDeg = true;
						btn.textContent = "C";
					}else{
						convertDocument("orig");
						isDeg = false;
						btn.textContent = "Ⅰ";
					}
				},
				onmouseenter: ()=>{
					btn.style.transform = 'scale(1.06)';
					btn.style.boxShadow = '0 10px 24px rgba(0,0,0,.30)';
				},
				onmouseleave: ()=>{
					btn.style.transform = '';
					btn.style.boxShadow = '0 6px 16px rgba(0,0,0,.25)';
				},
				textContent: "Ⅰ",
				style: {
					position: 'fixed',
					right: '16px',
					bottom: '16px',
					width: '56px',
					height: '56px',
					borderRadius: '9999px',
					zIndex: '2147483647',
					border: 'none',
					cursor: 'pointer',
					boxShadow: '0 6px 16px rgba(0,0,0,.25)',
					background: '#ffffff',
					fontSize: '20px',
					lineHeight: '56px',
					textAlign: 'center',
					userSelect: 'none'
				}
			},
		);
		document.body.appendChild(btn);
	}

	function addManualInferFab(){
		if(document.getElementById("cw-manual-infer-fab"))return;
		const btn = h('button',{
				id: "cw-manual-infer-fab",
				title: "キーを推論してドロップダウンに反映（上書き）",
				onClick: ()=>{
					const blocks = buildLineBlocks();
					if(!blocks.length)return;

					// グローバルキー有無に関係なく推定シードを実行（上書き）
					seedKeysByBlocks(blocks);
					if(isDeg)convertDocument("deg");
				},
				onmouseenter: ()=>{
					btn.style.transform = 'scale(1.06)';
					btn.style.boxShadow = '0 10px 24px rgba(0,0,0,.30)';
				},
				onmouseleave: ()=>{
					btn.style.transform = '';
					btn.style.boxShadow = '0 6px 16px rgba(0,0,0,.25)';
				},
				textContent: "推",
				style: {
					position: 'fixed',
					right: '16px',
					bottom: '84px', // Ⅰ/C ボタンの上
					width: '44px',
					height: '44px',
					borderRadius: '9999px',
					zIndex: '2147483647',
					border: 'none',
					cursor: 'pointer',
					boxShadow: '0 6px 16px rgba(0,0,0,.25)',
					background: '#ffffff',
					fontSize: '16px',
					lineHeight: '44px',
					textAlign: 'center',
					userSelect: 'none'
				}
			}
		);
		document.body.appendChild(btn);
	}

	function addRemoveCwKey(){
		const btn = h('button',{
			id: "cw-remove-key-fab",
			title: "個別に設定されているキーを削除",
			onClick: ()=>{
				const sels = document.querySelectorAll('select.cw-line-key');
				sels.forEach(sel=>{
					sel.value = "-";
					updateLineKeySelectColor(sel);
				});
				const lines = document.querySelectorAll('p.line');
				lines.forEach(line=>{
					line.dataset.effectiveKey = "";
				});
			},
			onmouseenter: ()=>{
				btn.style.transform = 'scale(1.06)';
				btn.style.boxShadow = '0 10px 24px rgba(0,0,0,.30)';
			},
			onmouseleave: ()=>{
				btn.style.transform = '';
				btn.style.boxShadow = '0 6px 16px rgba(0,0,0,.25)';
			},
			textContent: "×",
			style: {
				position: 'fixed',
				right: '16px',
				bottom: '144px',
				width: '44px',
				height: '44px',
				borderRadius: '9999px',
				zIndex: '2147483647',
				border: 'none',
				cursor: 'pointer',
				boxShadow: '0 6px 16px rgba(0,0,0,.25)',
				background: '#ffffff',
				fontSize: '16px',
				lineHeight: '44px',
				textAlign: 'center',
				userSelect: 'none'
			}
		});
		document.body.appendChild(btn);
	}

	// 移調用
	function addTransposeBar(){
		if(document.getElementById("cw-transpose-bar")) return;

		const hook = document.querySelector('div[oncopy], div[onCopy]');
		if(!hook || !hook.parentNode) return;

		const NOTE_TO_PC = {"C":0,"B#":0,"C#":1,"Db":1,"D":2,"D#":3,"Eb":3,"E":4,"Fb":4,"E#":5,"F":5,"F#":6,"Gb":6,"G":7,"G#":8,"Ab":8,"A":9,"A#":10,"Bb":10,"B":11,"Cb":11};
		const PC_TO_SHARP = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
		const PC_TO_FLAT  = ["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];

		// ==== 現在キー（表示通り） ====
		const currRaw = getInitialKeyRaw(); // 例: "F#m" / "Bb" / "Am"
		const currIsMinor = /m$/.test(currRaw);
		const currTonic = currRaw.replace(/m$/,"");
		const currPc = nameToPc(currTonic);
		// URL の ?key= は「元→現在」移調量なので、元のPCを逆算
		const currParam = getCurrentKeyParam();
		const originalPc = ((currPc - currParam) % 12 + 12) % 12;

		// ==== UI ====
		const label = h('span', {
			id: 'cw-transpose-label',
			textContent: `現在 key: ${currRaw}`, // 表示そのまま
			style: { marginRight: '8px', fontWeight: '600' }
		});

		// ベースキー選択（メジャー/マイナー）
		const keySel = h('select', {
			id: 'cw-transpose-key',
			title: '移動先のキー（ベース）',
			style: { marginRight: '8px', padding: '2px 6px', fontSize: '12px' }
		});
		const MAJORS = ["C","D","E","F","G","A","B"];
		const MINORS = ["Am","Bm","Cm","Dm","Em","Fm","Gm"];
		[...MAJORS, ...MINORS].forEach(k=>{
			const opt = document.createElement('option');
			opt.value = k; opt.textContent = k;
			keySel.appendChild(opt);
		});
		// 既定は現在キーのベース部
		keySel.value = "C";

		// # / b 選択（URL symbol= と、半音 ±1 に使う）
		const symSel = h('select', {
			id: 'cw-transpose-acc',
			title: '臨時記号（# なら +1半音、b なら -1半音）',
			style: { marginRight: '8px', padding: '2px 6px', fontSize: '12px' }
		});
		["-","#","b"].forEach(s=>{
			const opt = document.createElement('option');
			opt.value = s; opt.textContent = s;
			symSel.appendChild(opt);
		});
		// URL の symbol= に合わせて初期化
		const currentSymbol = currentSymbolPref();
		symSel.value = "-";

		const goBtn = h('button', {
			id: 'cw-transpose-go',
			textContent: 'key に移動',
			title: '選択したキーに移調したページへ移動します',
			onClick: ()=>{
				const base = keySel.value;     // 例 "D" / "Em"
				const acc  = symSel.value;     // "#" or "b"
				const isMin = /m$/.test(base);
				const tonic = base.replace(/m$/,""); // 例 "D" / "E"
				const delta = (acc === "#") ? +1 : (acc === "b") ? -1 : 0;
				let pc = nameToPc(tonic);
				if(pc == null) return;

				// # は +1 半音、b は -1 半音
				pc = (pc + delta + 12) % 12;

				// 総移調量 = 目標 - 元
				let total = normalizeKeyParam(pc - originalPc);
				if(total === -6) total = 6; // 仕様寄せ

				const symbolParam =
					(acc === "-")
						? (currentSymbol === "sharp" || currentSymbol === "flat" ? currentSymbol : null)
						: (acc === "#" ? "sharp" : "flat");

				// URL 構築（symbolParam があるときだけ付ける）
				const tEnc = getEncodedTitleParam();
				const origin = location.origin || (location.protocol + '//' + location.host);
				let url = `${origin}/wiki.cgi?c=view&t=${tEnc}&key=${total}`;
				if(symbolParam) url += `&symbol=${symbolParam}`;
				location.href = url;
			},
			onmouseenter: (e)=>{ e.currentTarget.style.filter = 'brightness(0.96)'; },
			onmouseleave: (e)=>{ e.currentTarget.style.filter = ''; },
			style: {
				padding: '4px 10px',
				border: '1px solid #d1d5db',
				background: '#fff',
				borderRadius: '6px',
				cursor: 'pointer',
				fontSize: '12px'
			}
		});

		const goOriginBtn = h('button', {
			textContent: '元のキーに戻す',
			title: '元のキーに戻します',
			onClick: ()=>{
				const origin = location.origin || (location.protocol + '//' + location.host);
				let url = `${origin}/wiki.cgi?c=view&t=${getEncodedTitleParam()}&key=0`;
				location.href = url;
			},
			onmouseenter: (e)=>{ e.currentTarget.style.filter = 'brightness(0.96)'; },
			onmouseleave: (e)=>{ e.currentTarget.style.filter = ''; },
			style: {
				padding: '4px 10px',
				border: '1px solid #d1d5db',
				background: '#fff',
				borderRadius: '6px',
				cursor: 'pointer',
				fontSize: '12px'
			}
		});

		// ラッパー
		const bar = h('div', {
			id: 'cw-transpose-bar',
			style: {
				display: 'flex',
				alignItems: 'center',
				flexWrap: 'wrap',
				gap: '6px',
				margin: '8px 0 12px 0',
				padding: '8px 10px',
				border: '1px solid #e5e7eb',
				background: '#f9fafb',
				borderRadius: '8px'
			}
		}, label, keySel, symSel, goBtn, goOriginBtn);

		// oncopy コンテナの直前に差し込む
		hook.parentNode.insertBefore(bar, hook);

		function nameToPc(n){ return NOTE_TO_PC[n] ?? null; }
		function pcToName(pc, prefer){ pc=((pc%12)+12)%12; return (prefer==="flat"?PC_TO_FLAT:PC_TO_SHARP)[pc]; }

		function getEncodedTitleParam(){
			// 1) フォームから
			const input = document.querySelector('#key [name="t"]');
			if(input?.value) return encodeURIComponent(input.value);
			// 2) 既存の ?t=
			try{
				const u = new URL(location.href);
				const t = u.searchParams.get('t');
				if(t) return encodeURIComponent(decodeURIComponent(t));
			}catch(_){}
			// 3) /wiki/<title>
			const m = location.pathname.match(/\/wiki\/(.+)/);
			if(m && m[1]){
				try{ return encodeURIComponent(decodeURIComponent(m[1])); }
				catch{ return m[1]; }
			}
			return "";
		}
		function getCurrentKeyParam(){
			try{
				const u = new URL(location.href);
				const k = parseInt(u.searchParams.get('key'), 10);
				if(Number.isFinite(k)) return Math.max(-12, Math.min(12, k));
			}catch(_){}
			return 0;
		}
		function normalizeKeyParam(d){
			d = ((d % 12) + 12) % 12; // 0..11
			if(d <= 6) return d;      // 0..6
			return d - 12;            // -5..-1
		}
		function currentSymbolPref(){
			try{
				const u = new URL(location.href);
				const s = (u.searchParams.get('symbol') || "").toLowerCase();
				return s === "flat" ? "flat" : s === "sharp" ? "sharp" : "-";
			}catch(_){ return "-"; }
		}
		function getInitialKeyRaw(){
			// p.key を最優先（Play/Key/原曲キーの最初に見つかったもの）
			const pk = document.querySelector('p.key');
			if(pk){
				const k = extractKeyName(pk.textContent || pk.innerText || "");
				if(k) return k; // 例: "F#m" / "Bb" / "Am"
			}
			// 行の明示キー（dataset.effectiveKey）を最初に見つけたら採用
			const line = [...document.querySelectorAll('p.line')].find(l => l.dataset?.effectiveKey?.match(/^[A-G](?:#|b)?m?$/));
			if(line) return line.dataset.effectiveKey;
			// フォールバック
			return "C";
		}
	}


	// 文書全体（グローバルKey or 行単位effectiveKey）で変換
	function convertDocument(mode = "deg"){
		let currentKey = null;

		// 行リスト＆UI準備
		const lines = [...document.querySelectorAll('p.line, p.key')].filter(l=>l.className === "line" || l.className === "key");

		for(let i = 0;i < lines.length;i++){
			const line = lines[i];
			if(line.className === "key"){
				currentKey = extractKeyName(line.innerText || line.textContent || "");
				continue;
			}
			if(line.dataset?.effectiveKey?.match(/^[A-G](?:#|b)?m?$/))currentKey = line.dataset.effectiveKey;
			if(!currentKey){
				alert("キーが未設定？");
				return;
			}
			processLine(line, currentKey, mode);
		}
	}

	// mode: "deg"（度数へ）/ "orig"（元へ）
	function processLine(lineEl, currentKey, mode){
		if(!lineEl)return;
		const romanMap = currentKey ? buildRomanMap(currentKey) : null;
		const keyAcc = currentKey ? buildKeyAccidentalMap(currentKey) : null;
		lineEl.querySelectorAll("span.chord").forEach((el)=>{
			const textNow = el.innerText || el.textContent || "";
			if(!el.dataset.originalChord){
				el.dataset.originalChord = textNow;
			}
			if(mode === "deg"){
				const source = el.dataset.originalChord;
				if(!source)return;
				if(source === "N.C."){
					el.innerText = source;
					el.dataset.degreeChord = source;
					return;
				}
				if(!romanMap || !keyAcc){
					el.innerText = source;
					return;
				}
				const converted = convertChordSymbol(source,romanMap,keyAcc);
				el.innerText = converted;
				el.dataset.degreeChord = converted;
			}else if(mode === "orig"){
				if(el.dataset.originalChord){
					el.innerText = el.dataset.originalChord;
				}
			}
		});
	}

	function extractKeyName(text){
		const t = (text || "").trim();
		let play = null, orig = null, key = null;

		const parts = t.split(/[\/｜\|]/);
		for(let i = 0;i < parts.length;i++){
			const seg = parts[i];
			let m = null;

			m = seg.match(/Play[:：]\s*([A-G](?:#|b)?m?)/i);
			if(m)play = m[1];

			m = seg.match(/Original\s*[Kk]ey[:：]\s*([A-G](?:#|b)?m?)/i);
			if(m)orig = m[1];

			m = seg.match(/(?<!Original\s)[Kk]ey[:：]\s*([A-G](?:#|b)?m?)/);
			if(m)key = m[1];
		}
		return play || key || orig || null;
	}

	function buildKeyAccidentalMap(key){
		// 入力キーの表記（# or b）を尊重してメジャー化
		// 例: "Bbm" -> 相対メジャー "Db"（flat優先）, "A#m" -> "C#"（sharp優先）
		const prefer = /b/.test(key) ? "f" : /#/.test(key) ? "s" : "s"; // 自然はとりあえず s
		const k = convertChord(key, "maj", prefer);

		const SHARP_KEYS = ["C","G","D","A","E","B","F#","C#"];
		const FLAT_KEYS  = ["C","F","Bb","Eb","Ab","Db","Gb","Cb"];
		const SHARP_ORDER = ["F","C","G","D","A","E","B"];
		const FLAT_ORDER  = ["B","E","A","D","G","C","F"];
		const map = {C:"",D:"",E:"",F:"",G:"",A:"",B:""};

		let idxSharp = SHARP_KEYS.indexOf(k);
		let idxFlat  = FLAT_KEYS.indexOf(k);
		if(idxSharp >= 0){
			for(let i=0;i<idxSharp;i++) map[SHARP_ORDER[i]] = "#";
		}else if(idxFlat >= 0){
			for(let i=0;i<idxFlat;i++) map[FLAT_ORDER[i]] = "b";
		}
		return map;
	}


	function setupLineKeyUI(){
		const hasGlobalKey = !!document.querySelector("p.key");
		const blocks = buildLineBlocks();
		if(!blocks.length)return;
		// まず全対象行に select を装着
		for(let b = 0;b < blocks.length;b++){
			const lines = blocks[b];
			for(let i = 0;i < lines.length;i++){
				const line = lines[i];
				if(line.className !== "line")continue;
				if(!line.querySelector(":scope > select.cw-line-key")){
					const cs = window.getComputedStyle(line);
					if(cs.position === "static")line.style.position = "relative";
					const sel = createLineKeySelect("-", line);
					line.insertBefore(sel,line.firstChild);
				}
			}
		}
		// ブロック単位で推定 & 転調判定 → 初期シード
		if(!hasGlobalKey){
			seedKeysByBlocks(blocks);
		}
	}

	function createLineKeySelect(selectedValue = "-", line){
		const sel = h('select', {
					className: 'cw-line-key',
					title: 'この行のキー（推定/継承）',
					onchange: ()=>{
						line.dataset.effectiveKey = sel.value;
						sel.dataset.isUserEdited = true;
						updateLineKeySelectColor(sel);
						if(isDeg)convertDocument("deg");
						saveCurrentOverrides();
					},
					onmouseenter: ()=>{
						sel.style.opacity = "1";
					},
					onmouseleave: ()=>{
						sel.style.opacity = "0.85";
					},
					style: {
						position: 'absolute',
						fontSize: '11px',
						opacity: '0.85',
						zIndex: '2147483647',
						...(
							isMobile
							? {	background: '#f3f4f6', border: '1px solid #d1d5db',
								left: "5px", top: "-30px"}
							: {	left: "-60px", top: "-16px"}
						),
					}
				}
			);
		const KEY_OPTIONS = [
			"-",
			"C","C#","Db","D","D#","Eb","E","F","F#","Gb","G","G#","Ab","A","A#","Bb","B",
			"Am","A#m","Bbm","Bm","Cm","C#m","Dbm","Dm","D#m","Ebm","Em","Fm","F#m","Gbm","Gm","G#m","Abm",
		];
		for(let k of Object.keys(KEY_OPTIONS)){
			const opt = document.createElement("option");
			opt.value = KEY_OPTIONS[k];
			opt.textContent = KEY_OPTIONS[k];
			sel.appendChild(opt);
		}
		sel.value = selectedValue || "-";
		if(isMobile){
			line.style.marginTop = "32px";
		}else if(document.location.href.match(/ja\.chordwiki\.org\/amp/)){
			const main = document.querySelector('.main');
			if(main){
				main.style.paddingLeft = "80px";
			}
		}
		return sel;
	}

	function updateLineKeySelectColor(selectElement){
		selectElement.style.color = (selectElement.value && selectElement.value !== "-") ? "#dc143c" : "";
	}

	// 現在ページの明示指定（-以外）だけを保存
	async function saveCurrentOverrides(){
		const lines = [...document.querySelectorAll("p.line")].filter(l=>l.className === "line");
		if(!lines.length) return;
		const explicit = {};
		for(let i=0;i<lines.length;i++){
			const sel = lines[i].querySelector(":scope > select.cw-line-key");
			if(!sel) continue;
			if(sel.value && sel.value !== "-" && sel.dataset.isUserEdited === "true"){
				explicit[i] = sel.value;
			}
		}
		const key = b64EncodeUtf8(document.querySelector('#key [name="t"]')?.value || document.querySelector('head meta[property="og:title"]')?.content);
		const all = await getFromIndexedDB('cw-degree', 'line-key-overrides');
		all[key] = {
			lines: explicit,
			updatedAt: new Date().toISOString()
		};
		await saveToIndexedDB('cw-degree', 'line-key-overrides', all);
	}

	async function restoreSavedSelections(){
		try{
			const lines = [...document.querySelectorAll("p.line")].filter(l=>l.className === "line");
			if(!lines.length)return;

			const key = b64EncodeUtf8(document.querySelector('#key [name="t"]')?.value || document.querySelector('head meta[property="og:title"]')?.content);
			const all = await getFromIndexedDB('cw-degree', 'line-key-overrides');
			const entry = all?.[key];
			if(!entry || !entry?.lines)return;

			// 反映
			for(const [idxStr,val] of Object.entries(entry.lines)){
				const idx = parseInt(idxStr,10);
				if(Number.isNaN(idx))continue;
				const line = lines[idx];
				if(!line)continue;
				const sel = line.querySelector(":scope > select.cw-line-key");
				if(!sel)continue;
				sel.value = val;
				sel.dataset.isUserEdited = true; // ユーザー編集済みフラグ
				line.dataset.effectiveKey = val;
				updateLineKeySelectColor(sel);
			}

			if(isDeg){
				for(let i=0;i<lines.length;i++){
					processLine(lines[i], lines[i].dataset.effectiveKey || null, "deg");
				}
			}
		}catch(e){
			console.error("Error restoring saved selections:", e);
		}
	}

	function convertChord(chord, mode = "maj", pref = "s"){
		if(typeof chord !== "string" || chord.length < 1)throw new Error("invalid chord");
		if(chord === "N.C.")return "N.C.";

		const SHARP_NAMES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
		const FLAT_NAMES  = ["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];

		const useSharp = String(pref || "s").toLowerCase().startsWith("s");
		const wantMin  = String(mode || "maj").toLowerCase().startsWith("min");

		const s = chord.trim();
		const m = s.match(/^[A-Ga-g](?:[#b]+)?/);
		if(!m)throw new Error("invalid note");

		const rootToken = m[0];
		const rest = s.slice(rootToken.length);
		const isMinorInput = /^(-|m(?!aj)|min)/i.test(rest);

		const pc = toPitchClass(rootToken);

		if(wantMin){
			const mPc = isMinorInput ? pc : (pc + 9) % 12; // 相対マイナー（+9）
			return fromPc(mPc, useSharp) + "m";
		}else{
			const MPc = isMinorInput ? (pc + 3) % 12 : pc; // 相対メジャー（+3）
			return fromPc(MPc, useSharp);
		}

		function toPitchClass(note){
			const letter = note[0].toUpperCase();
			const base = {C:0,D:2,E:4,F:5,G:7,A:9,B:11}[letter];
			if(base === undefined)throw new Error("invalid note");
			let v = base;
			for(let i = 1; i < note.length; i++){
				const ch = note[i];
				if(ch === "#")v++;
				else if(ch === "b")v--;
				else throw new Error("invalid accidental");
			}
			return (v%12+12)%12;
		}

		function fromPc(pc, useSharp){
			const names = useSharp ? SHARP_NAMES : FLAT_NAMES;
			return names[(pc%12+12)%12];
		}
	}

	function convertChordSymbol(sym,romanMap,keyAcc){
		const s = (sym || "").trim();
		if(s === "N.C.")return s;

		// 1) 先に「( … ) / （ … ）」で丸ごと包まれている形を処理
		const mWrap = s.match(/^([（\(])\s*(.+?)\s*([）\)])$/);
		if(mWrap){
			const left = mWrap[1], inner = mWrap[2], right = mWrap[3];
			if(/\s/.test(inner)){
				const parts = inner.split(/\s+/).filter(Boolean).map(t=>convertChordSymbol(t,romanMap,keyAcc));
				return left + parts.join(" ") + right;
			}
			return left + convertChordSymbol(inner,romanMap,keyAcc) + right;
		}

		// 2) ベースのみ "/C" など
		const mSlash = s.match(/^\/\s*([A-G](?:#{1,2}|b{1,2})?)\s*$/i);
		if(mSlash){
			if(!romanMap || !keyAcc)return s;
			const bass = mSlash[1];
			const bassDeg = noteToDegree(bass,romanMap,keyAcc);
			return "/" + bassDeg;
		}

		// 3) 通常パターン
		const re = /^([A-G](?:#{1,2}|b{1,2})?)(.*?)(?:\/([A-G](?:#{1,2}|b{1,2})?))?$/i;
		const m = s.match(re);
		if(!m)return s;

		const root = m[1], suffix = m[2] || "", bass = m[3] || "";
		const rootDeg = noteToDegree(root,romanMap,keyAcc);
		const bassDeg = bass ? noteToDegree(bass,romanMap,keyAcc) : "";
		return rootDeg + suffix + (bassDeg ? ("/" + bassDeg) : "");
	}

	function noteToDegree(note,romanMap,keyAcc){
		const m = (note || "").match(/^([A-G])((?:#{1,2}|b{1,2})?)$/i); // 0〜2個まで
		if(!m)return note;
		const letter = m[1].toUpperCase();
		const accStr = m[2] || "";
		const base = romanMap[letter] || letter;
		const dia = keyAcc[letter] || ""; 

		const accNum = accToNum(accStr);
		const diaNum = accToNum(dia);
		const diff = accNum - diaNum;
		const rel = numToAcc(diff);
		return base + rel;

		function accToNum(s){
			if(!s)return 0;
			if(/^#{1,2}$/.test(s))return s.length;  // "#":1, "##":2
			if(/^b{1,2}$/.test(s))return -s.length; // "b":-1, "bb":-2
			return 0;
		}
		function numToAcc(n){
			if(n === 0)return "";
			if(n === 1)return "#";
			if(n === 2)return "##";
			if(n === -1)return "b";
			if(n === -2)return "bb";
			return n > 0 ? "##" : "bb";
		}
	}

	function buildLetterOrder(key){
		const L = ["C","D","E","F","G","A","B"];
		const k = (key || "").toUpperCase().match(/^([A-G])/ )?.[1] || "C";
		const i = L.indexOf(k);
		return i < 0 ? L.slice() : L.slice(i).concat(L.slice(0,i));
	}

	function buildRomanMap(key){
		const ROMAN = ["Ⅰ","Ⅱ","Ⅲ","Ⅳ","Ⅴ","Ⅵ","Ⅶ"];
		const order = buildLetterOrder(key);
		const m = {};
		for(let i = 0;i < order.length;i++){
			m[order[i]] = ROMAN[i];
		}
		return m;
	}

	function buildLineBlocks(){
		const container = document.querySelector('div[oncopy], div[onCopy]') || document;
		// p.line と br をドキュメント順に走査し、次のいずれかでブロックを区切る：
		// - <br>
		// - p.line 以外（例: p.line.comment など）は「境界」として扱う
		const seq = Array.from(container.querySelectorAll('p.line, br'));
		const blocks = [];
		let cur = [];
		for(let i = 0;i < seq.length;i++){
			const el = seq[i];
			if(el.tagName === 'BR'){
				if(cur.length){blocks.push(cur); cur = [];}
				continue;
			}
			// p.line 系
			if(el.tagName === 'P'){
				if(el.className === 'line'){
					cur.push(el);
				}else{
					// line comment などに遭遇 → ここで区切る
					if(cur.length){blocks.push(cur); cur = [];}
				}
			}
		}
		if(cur.length)blocks.push(cur);
		// 念のため、line を1つ以上含むもののみ返す
		return blocks.filter(b=>b.some(l=>l.className === 'line'));
	}
	function seedKeysByBlocks(blocks){
		const keyCandidates = ["C","G","D","A","E","B","F#","C#","F","Bb","Eb","Ab","Db","Gb","Cb"];

		// --- ここから本体：各ブロックの先頭行だけ explicit を入れる ---
		let prevEffective = null;

		for(let b=0;b<blocks.length;b++){
			const lines = blocks[b];

			let tokens = collectTokensFromLines(lines);

			// 先頭ブロックが薄い場合、次ブロックを足して MIN_TOKENS_FOR_INFER まで増やす
			if(b === 0 && tokens.length < MIN_TOKENS_FOR_INFER){
				let nb = b + 1;
				while(nb < blocks.length && tokens.length < MIN_TOKENS_FOR_INFER){
					tokens = tokens.concat(collectTokensFromLines(blocks[nb]));
					nb++;
				}
			}

			let explicitKey = null;

			if(tokens.length >= MIN_TOKENS_FOR_INFER){
				const {bestKey, bestScore} = bestKeyAndScore(tokens);
				if(b === 0){
					explicitKey = bestKey || "C";
				}else{
					// 転調判定（相対差）
					//const prevScore = tokens.length ? bestKeyAndScore(tokens).bestScore : 0;
					// prev側のスコアを明示的に計算
					const prevSide = prevEffective ? (function(){
						let s = 0; for(let i=0;i<tokens.length;i++) s += (function(ch){
							return (function scorePrev(){
								const romanMap = buildRomanMap(prevEffective);
								const keyAcc = buildKeyAccidentalMap(prevEffective);
								let score = 0;
								function degreeParts(note){
									const d = noteToDegree(note, romanMap, keyAcc);
									const m = d && d.match(/^([ⅠⅡⅢⅣⅤⅥⅦ])([#b]{1,2})?$/);
									return m ? {roman:m[1], accs:(m[2]||"")} : {roman:null, accs:""};
								}
								function romanToIndex(r){ return {"Ⅰ":1,"Ⅱ":2,"Ⅲ":3,"Ⅳ":4,"Ⅴ":5,"Ⅵ":6,"Ⅶ":7}[r] || null; }

								if(ch.root){
									const dp = degreeParts(ch.root);
									if(dp.roman){
										const diatonic = dp.accs === "";
										score += diatonic ? 2 : -dp.accs.length;

										const idx = romanToIndex(dp.roman);
										const EXPECT_MAJOR = {1:"maj",2:"min",3:"min",4:"maj",5:"maj",6:"min",7:"dim"};

										if(ch.quality === "dim"){
											score += EXPECT_MAJOR[idx] === "dim" ? 1 : -0.5;
										}else if(ch.quality === "min"){
											score += EXPECT_MAJOR[idx] === "min" ? 1 : -0.25;
										}else if(ch.quality === "maj"){
											score += EXPECT_MAJOR[idx] === "maj" ? 1 : -0.25;
										}else{
											score -= 0.1;
										}
										if(ch.isDom7 && idx === 5) score += 0.5;
										if(ch.isHalfDim && idx === 7) score += 0.5;
									}
								}
								if(ch.bass){
									const dpb = degreeParts(ch.bass);
									if(dpb.roman) score += (dpb.accs === "" ? 0.25 : -0.25);
								}
								return score;
							})();
						})(tokens[i]);
						return s;
					})() : 0;

					// bestKey と prevEffective を比較
					if(bestScore >= MOD_MIN_FIRST && bestKey !== prevEffective && bestScore >= prevSide + MOD_CHANGE_DELTA){
						explicitKey = bestKey;
					}
				}
			}

			// 反映：先頭行だけ explicit、他は「-」のまま（effectiveKeyは空）
			for(let i=0;i<lines.length;i++){
				const line = lines[i];
				if(line.className !== "line") continue;
				const sel = line.querySelector(':scope > select.cw-line-key');

				if(i === 0){
					if(explicitKey){
						if(sel){
							sel.value = explicitKey; updateLineKeySelectColor(sel);
							sel.dataset.isUserEdited = false;
						}
						line.dataset.effectiveKey = explicitKey; // 明示の行だけ入れる
						prevEffective = explicitKey;
					}else{
						if(sel){
							sel.value = "-"; updateLineKeySelectColor(sel);
						}
						line.dataset.effectiveKey = "";          // 継承は空のまま
					}
				}else{
					if(sel){
						sel.value = "-"; updateLineKeySelectColor(sel);
					}
					line.dataset.effectiveKey = "";              // 継承は空のまま
				}
			}
		}
		function collectTokensFromLines(lines){
			const tokens = [];
			for(let i=0;i<lines.length;i++){
				const spans = lines[i].querySelectorAll('span.chord');
				for(let j=0;j<spans.length;j++){
					const raw = (spans[j].dataset.originalChord || spans[j].textContent || "").trim();
					const t = parseChordSymbolBasic(raw);
					if(t)tokens.push(t);
				}
			}
			return tokens;

			function parseChordSymbolBasic(sym){
				let s = (sym || "").trim();
				if(!s || s === "N.C.") return null;

				// ()/（）で丸ごと包まれていたら中身
				const wrap = s.match(/^([（\(])\s*(.+?)\s*([）\)])$/);
				if(wrap) s = wrap[2];

				// ベースのみ "/C"
				let m = s.match(/^\/\s*([A-G](?:#{1,2}|b{1,2})?)\s*$/i);
				if(m) return {root:null, bass:m[1].toUpperCase(), quality:null, isDom7:false, isHalfDim:false};

				// ルート(+修飾)(/ベース)
				m = s.match(/^([A-G](?:#{1,2}|b{1,2})?)(.*?)(?:\/([A-G](?:#{1,2}|b{1,2})?))?$/i);
				if(!m) return null;

				const root = m[1].toUpperCase();
				const q = (m[2] || "");
				const bass = m[3] ? m[3].toUpperCase() : null;

				let quality = "maj";
				if(/(dim|°|o)/i.test(q)) quality = "dim";
				else if(/aug|\+/i.test(q)) quality = "aug";
				else if(/m(?!aj)/.test(q)) quality = "min";

				const isDom7 = /(^|[^a-z])7(?!-?5)/i.test(q);
				const isHalfDim = /m7-5|ø/i.test(q);

				return {root, bass, quality, isDom7, isHalfDim};
			}
		}

		function bestKeyAndScore(tokens){
			// 譜面の表記バイアス（# が多いか b が多いか）を計測
			const bias = (function(){
				let sharp = 0, flat = 0;
				for(let i=0;i<tokens.length;i++){
					const t = tokens[i];
					if(t.root){ if(/#/.test(t.root)) sharp++; if(/b/.test(t.root)) flat++; }
					if(t.bass){ if(/#/.test(t.bass)) sharp++; if(/b/.test(t.bass)) flat++; }
				}
				return sharp - flat; // >0 なら # 優勢、<0 なら b 優勢
			})();

			const SHARP_KEYS = ["C","G","D","A","E","B","F#","C#"];
			const FLAT_KEYS  = ["C","F","Bb","Eb","Ab","Db","Gb","Cb"];

			function keySharpnessIndex(name){
				// キーシグネチャの「#個数 - b個数」に相当する簡易指標
				const iS = SHARP_KEYS.indexOf(name);
				if(iS >= 0) return iS;     // C:0, G:1, ... , C#:7
				const iF = FLAT_KEYS.indexOf(name);
				if(iF >= 0) return -iF;    // C:0, F:-1, ... , Cb:-7
				return 0;
			}

			const BIAS_W = 0.10; // バイアス重み（1音分 ≒ 0.1 程度で十分効く）

			let bestKey = "C", bestScore = Number.NEGATIVE_INFINITY;

			for(let i=0;i<keyCandidates.length;i++){
				const k = keyCandidates[i];
				const raw = scoreTokensForKey(tokens, k);
				// #優勢なら #が多いキー名へ、b優勢なら bが多いキー名へ微調整
				const biasSign = Math.sign(bias);
				const biasMag  = Math.min(Math.abs(bias), 6) / 6;
				const adj = raw + BIAS_W * biasMag * biasSign * keySharpnessIndex(k);
				if(adj > bestScore){
					bestScore = adj;
					bestKey = k;
				}
			}
			return {bestKey, bestScore};

			function scoreTokensForKey(tokens, keyName){
				let s = 0;
				for(let i=0;i<tokens.length;i++) s += scoreChordForKey(tokens[i], keyName);
				return s;
			}
			function scoreChordForKey(ch, keyName){
				const romanMap = buildRomanMap(keyName);
				const keyAcc = buildKeyAccidentalMap(keyName);

				let score = 0;

				function degreeParts(note){
					const d = noteToDegree(note, romanMap, keyAcc);
					const m = d && d.match(/^([ⅠⅡⅢⅣⅤⅥⅦ])([#b]{1,2})?$/);
					return m ? {roman:m[1], accs:(m[2]||"")} : {roman:null, accs:""};
				}
				function romanToIndex(r){ return {"Ⅰ":1,"Ⅱ":2,"Ⅲ":3,"Ⅳ":4,"Ⅴ":5,"Ⅵ":6,"Ⅶ":7}[r] || null; }
				const EXPECT_MAJOR = {1:"maj",2:"min",3:"min",4:"maj",5:"maj",6:"min",7:"dim"};

				if(ch.root){
					const dp = degreeParts(ch.root);
					if(dp.roman){
						const diatonic = dp.accs === "";
						score += diatonic ? 2 : -dp.accs.length;

						const idx = romanToIndex(dp.roman);
						if(ch.quality === "dim"){
							score += EXPECT_MAJOR[idx] === "dim" ? 1 : -0.5;
						}else if(ch.quality === "min"){
							score += EXPECT_MAJOR[idx] === "min" ? 1 : -0.25;
						}else if(ch.quality === "maj"){
							score += EXPECT_MAJOR[idx] === "maj" ? 1 : -0.25;
						}else{
							score -= 0.1;
						}
						if(ch.isDom7 && idx === 5) score += 0.5;
						if(ch.isHalfDim && idx === 7) score += 0.5;
					}
				}
				if(ch.bass){
					const dpb = degreeParts(ch.bass);
					if(dpb.roman) score += (dpb.accs === "" ? 0.25 : -0.25);
				}
				return score;
			}
		}
	}

	function b64EncodeUtf8(str){
		try{
			const encoder = new TextEncoder();
			const uint8Array = encoder.encode(str);
			const binaryString = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('');
			return btoa(binaryString);
		}catch(e){
			try{ return btoa(str); }
			catch{ return String(str); }
		}
	}

	function isMobileView(){
		return (window.matchMedia && window.matchMedia("(max-width: 768px)").matches)
			|| /Android|iPhone|iPod|Windows Phone|Mobile/i.test(userAgent);
	}

	function openIndexedDB(dbName, storeName){
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(dbName);

			request.onerror = (event) => {
				reject("Database error: " + event.target.errorCode);
			};

			request.onsuccess = (event) => {
				let db = event.target.result;
				if(db.objectStoreNames.contains(storeName)){
					resolve(db);
				}else{
					db.close();
					const newVersion = db.version + 1;
					const versionRequest = indexedDB.open(dbName, newVersion);
					versionRequest.onupgradeneeded = (event) => {
						db = event.target.result;
						db.createObjectStore(storeName, { keyPath: 'id' });
					};
					versionRequest.onsuccess = (event) => {
						resolve(event.target.result);
					};
					versionRequest.onerror = (event) => {
						reject("Database error: " + event.target.errorCode);
					};
				}
			};

			request.onupgradeneeded = (event) => {
				const db = event.target.result;
				db.createObjectStore(storeName, { keyPath: 'id' });
			};
		});
	}

	function saveToIndexedDB(dbName, storeName, data, id = 522){
		return new Promise(async (resolve, reject) => {
			try{
				const db = await openIndexedDB(dbName, storeName);
				const transaction = db.transaction(storeName, 'readwrite');
				const store = transaction.objectStore(storeName);
				const putRequest = store.put({ id: id, data: data });

				putRequest.onsuccess = () => {
					resolve("Data saved successfully.");
				};

				putRequest.onerror = (event) => {
					reject("Data save error: " + event.target.errorCode);
				};
			}catch(error){
				reject(error);
			}
		});
	}

	function getFromIndexedDB(dbName, storeName, id = 522){
		return new Promise(async (resolve, reject) => {
			try{
				const db = await openIndexedDB(dbName, storeName);
				const transaction = db.transaction(storeName, 'readonly');
				const store = transaction.objectStore(storeName);
				const getRequest = store.get(id);

				getRequest.onsuccess = (event) => {
					if(event.target.result){
						// こうしないとfirefox系ブラウザで
						// Error: Not allowed to define cross-origin object as property on [Object] or [Array] XrayWrapper
						// というエラーが出ることがあるので、構造化クローンを使ってコピーする
						// でかいオブジェクトだと効率が悪いのでなにかいい方法があれば教えてください
						resolve(structuredClone(event.target.result.data));
					}else{
						resolve(null);
					}
				};

				getRequest.onerror = (event) => {
					reject("Data fetch error: " + event.target.errorCode);
				};
			}catch(error){
				reject(error);
			}
		});
	}

	function h(tag, props = {}, ...children){
		const el = document.createElement(tag);
		for(const key in props){
			const val = props[key];
			if(key === "style" && typeof val === "object"){
				Object.assign(el.style,val);
			}else if(key.startsWith("on") && typeof val === "function"){
				el.addEventListener(key.slice(2).toLowerCase(),val);
			}else if(key.startsWith("aria-") || key === "role"){
				el.setAttribute(key,val);
			}else if(key === "dataset" && typeof val === "object"){
				for(const dataKey in val){
					if(val[dataKey] != null){
						el.dataset[dataKey] = val[dataKey];
					}
				}
			}else if(key.startsWith("data-")){
				const prop = key.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase());
				el.dataset[prop] = val;
			}else if(key === "ref" && typeof val === "function"){
				val(el);
			}else if(key in el){
				el[key] = val;
			}else{
				el.setAttribute(key,val);
			}
		}
		for(let i = 0;i < children.length;i++){
			const child = children[i];
			if(Array.isArray(child)){
				for(const nested of child){
					if(nested == null || nested === false)continue;
					el.appendChild(typeof nested === "string" || typeof nested === "number" ? document.createTextNode(nested) : nested);
				}
			}else if(child != null && child !== false){
				el.appendChild(typeof child === "string" || typeof child === "number" ? document.createTextNode(child) : child);
			}
		}
		return el;
	}

	main();
})();
