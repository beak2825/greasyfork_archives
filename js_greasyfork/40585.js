// ==UserScript==
// @name			Android_KeyManager
// @author			tatarime
// @namespace	tatarime
// @include			*
// @version			0.2.3.50
// @run-at			document-start
// @description	F1キーに対してURLジャンプの機能を与えます。Clearキーが上手く動作しないことへの代替です。
// @downloadURL https://update.greasyfork.org/scripts/40585/Android_KeyManager.user.js
// @updateURL https://update.greasyfork.org/scripts/40585/Android_KeyManager.meta.js
// ==/UserScript==

// document-startは画像ページ読み込み失敗の原因
const w = window, d = document;
const stname = "Android_KeyManager";

// busyフラグが立っていたら一部の処理は中止
let busy = false;


let config = {
	altMode: false,
	longPressDuration: 500,
	scrollDuration: 150,
	getKeyCode: false,
	clickSelect: {
		enabled: false
	}
};

// Lは長押し時
let hotkeys = {
	F1: {
		D: function(){
			if (!config.altMode){
				w.history.back();
			} else {
				pageMove(-1);
			}
		},
		
		L: function(){
			let a = prompt("", debug + "," + debug2).split(",");
			debug = a[0] * 1;
			debug2 = a[1] * 1;
		}
	},
	
	F2: {
		D: function(){
			if (!config.altMode){
				w.history.forward();
			} else {
				pageMove(1);
			}
		}
	},
	
	F3: {
		D: function(){
			if (!busy) new ScrollAnime(-1);
		},
	},
	
	F4: {
		D: function(){
			d.documentElement.mozRequestFullScreen();
			if (!busy) new ScrollAnime();
		}
	},
	
	F10: {
		D: function(){

		}
	},
	
	F11: {
		D: function(){

		}
	},
	
	F12: {
		D: function(){
			if (!d.mozFullScreenElement) {
				d.documentElement.mozRequestFullScreen();
			} else {
				if (d.mozExitFullscreen) d.mozExitFullscreen();
			}
		}
	},
	
	Call: {
		D: function(){
			const elm = d.activeElement;
			if (/input|textarea/i.test(elm.tagName)) {
				delText(elm);
			} else {
				passView();
				Config.show();
			}
		}
	},
	
	Camera: {
		D: function(){
			pageJump();	
		},
		
		L: function(){
			// getKeyCode();
		}
	},
};


// ==========≪ コンフィグ ≫==========
let Config = {};

Config.show = function(){
	if (d.mozExitFullscreen) d.mozExitFullscreen();
	
	while (true){
		let load = JSON.parse(localStorage.getItem(stname));
		if (load) config = load;

		// 連想配列の添え字番号と長さを取得
		let opstr = [];
		for (let k in config){
			if (config.hasOwnProperty(k)){
				opstr.push(k);
			}
		}

		let num = prompt(Config.list("n"), 1);
		if (num === "" || num === null || num > opstr.length) break;

		if (num === "0"){
			if (confirm("初期化しますか？")) localStorage.removeItem(stname);
			location.href = location.href;
			return;
		}

		let key = opstr[num-1];

		if (typeof config[key] == "boolean") {
			config[key] = !config[key];
		} else {		
			let input = prompt("", config[key]);
			if (input === null) continue;

			if (Array.isArray(config[key])){
				config[key] = input.split(",");
			} else {
				if (typeof config[key] == "number") input *= 1;
				config[key] = input;
			}
		}
		
		localStorage.setItem(stname, JSON.stringify(config));
	}

};

// ----------< 一覧作成 >----------
Config.list = function(n){
	let ret = "";
	let count = 1;
	for (let k in config){
		if (config.hasOwnProperty(k)){
			if (n == "#") ret += "[#] ";
			if (n == "n") ret += "[" + count + "] ";
			ret += k + " = " + config[k] + "\n";
			count++;
		}
	}
	return ret + "\n";
};



// newされた時点でスクロールアニメーションを実行
// 第１引数がundef以外なら上方向
function ScrollAnime() {
	this.init.apply(this, arguments);
}


ScrollAnime.prototype.init = function(dir){
	busy = true;
	this.dir = dir || 1;
	this.offset = w.pageYOffset;
	// 文字が半分切れることがあるので32pxの余裕を
	this.height = (w.innerHeight - 32) * this.dir;
	
	this.beginTime = performance.now();
	this.aniID = requestAnimationFrame(this.loop.bind(this));

}


ScrollAnime.prototype.loop = function(m){
	let t = m - this.beginTime;
	if (t < config.scrollDuration){
		// scrollTo(0, this.offset + (t / config.scrollDuration) * this.height);
		scrollTo(0, this.offset + yamagata(t, config.scrollDuration, this.height));
		// console.log(yamagata(t, config.scrollDuration, this.height));
		this.aniID = requestAnimationFrame(this.loop.bind(this));
		
	} else {
		console.log("ani_end");
		scrollTo(0, this.offset + this.height);
		busy = false;
		// cancelAnimationFrame(this.aniID);
	}
}



if (window == window.parent){
	main();
	sub();
}


function main(){
	let load = localStorage.getItem(stname);
	if (load) config = JSON.parse(load);
	
	d.addEventListener("keydown", keydown, false);
	d.addEventListener("keyup", keyup, false);
	
	if (config.getKeyCode){
		const alertKey = function(e){
			alert(e.key + "\n" + e.keyCode);
		};
		d.addEventListener("keydown", alertKey, false);
		alert("キーコード取得モードが有効になりました");
	}


	function keydown(e){
		let hkey = hotkeys[e.key];
		if (hkey){
			if (hkey.pressed) return;

			if (!hkey.L){
				if (hkey.D) hkey.D();
				
			} else {
				hkey.pressed = true;
				hkey.timer = setTimeout(function(hkey){
					hkey.pressed = false;
					hkey.L();
				}.bind(null, hkey), config.longPressDuration);
			}
		}
	}


	function keyup(e){
		let hkey = hotkeys[e.key];
		if (hkey){
			if (hkey.pressed){
				hkey.pressed = false;
				clearTimeout(hkey.timer);
				if (hkey.D) hkey.D();
			}
		}
	}
}

let onsubmit = false;
let lastY = 0;
function sub(){
	// スライド時の誤タッチを防止できたらいいな
	d.addEventListener("mousemove", (e) => {
		lastY = e.clientY;
	}, false);
	
	d.addEventListener("mousedown", (e) => {
		if (lastY >= w.innerHeight - 4) {
			e.stopPropagation();
			e.preventDefault();
		}
	});
	
	
	// テキスト編集中にクリアキーで戻ってしまう対策
	// const ulFunc = (e) => {
		// if (onsubmit) return;
		// if (/input|textarea/i.test(d.activeElement.tagName)) {
			// e.preventDefault();
		// }
	// };
	// window.addEventListener('beforeunload', ulFunc, false);
	
	// Array.from(d.forms).forEach((f) => {
		// f.addEventListener('submit', function(e) {
			// onsubmit = true;
		// }, false);
	// });
	
	
	let inputs = d.querySelectorAll("input:not([type]), input[type='text'], input[type='password'], textarea");
	let alt = function(e){
		e.preventDefault();
		e.stopPropagation();
		let value = prompt(e.target.name, e.target.value);
		if (value) e.target.value = value;
	};
	for (let i=0; i<inputs.length; i++){
		inputs[i].addEventListener("click", alt, false);
	}
}


// キャレット位置のテキスト削除
function delText(e) {
	const caret = e.selectionStart;
	e.value = e.value.slice(0, caret - 1) + e.value.slice(caret);
	e.selectionStart = caret - 1;
	e.selectionEnd = caret - 1;
}


// パスワードの＊表示
function passView() {
    const passFields = d.querySelectorAll("input[type='password']");
    passFields.forEach((e) => e.type = "text");
}

// クリック位置２つ取ってテキストコピーとかやりたい

// 検索機能も付けたい


// ################################
// ########## 以下、個別機能 ##########
// ################################

function getKeyCode(){
	if (d.mozExitFullscreen) d.mozExitFullscreen();
	config.getKeyCode = !config.getKeyCode;
}


function clickSelect(){
	let cf = config.clickSelect;
	let selection = w.getSelection();
	let range = d.createRange();
	
	cf.enabled = !cf.enabled;
	if (cf.enabled){
		cf.f = null;
		cf.s = null;
		cf.func = (e) => {
			if (!cf.f){
				cf.f = d.caretPositionFromPoint(e.clientX, e.clientY);
			} else {
				cf.s = d.caretPositionFromPoint(e.clientX, e.clientY);
				range.setStart(cf.f.offsetNode, cf.f.offset);
				range.setEnd(cf.s.offsetNode, cf.s.offset);
				
				if (range.collapsed){
					range.setEnd(cf.f.offsetNode, cf.f.offset);
					range.setStart(cf.s.offsetNode, cf.s.offset);
				}
				
				selection.removeAllRanges();
				selection.addRange(range);
				cf.f = null;
			}
		};
		d.addEventListener("click", cf.func, false);
		
	} else {
		d.removeEventListener("click", cf.func, false);
	}	
}


function pageJump(){
	if (d.mozExitFullscreen) d.mozExitFullscreen();
	let gSearch = d.querySelector("input[type='search'], input:not([type='hidden'])");
	let loc = prompt("URL or Search:", gSearch ? gSearch.value : "");
	if (loc) {
		if (loc.indexOf(":") !== -1) location.href = loc;
		else location.href = "https://www.google.co.jp/search?q=" + encodeURI(loc);
	}
}


// 指定枚数のページ移動、defwordは標準の接頭辞
// exwordは目的数字の前後にノイズがある場合のみ指定
function pageMove(plus, defword, defnum, exword){
	let ret = "";
	plus = plus || 1;
	defword = defword || "page";
	defnum = defnum || 0;
	
	if (plus > 0) defnum += plus;
	
	// アンカーは邪魔なので削除
	// decodeしないと日本語等が%数字に
	let location0 = decodeURI(location.href.replace(/#.*/, ""));
	// 連続したURLの最後のドメイン以降を取り出す
	let spurl = location0.match(/(.+:\/\/[^\/]+\/)(.*)/);
	
	// ドメインの数字は通常書き換えない
	let location1 = "", location2;
	if (spurl[2] != "") {
		location1 = spurl[1];
		location2 = spurl[2]
	} else {
		location2 = spurl[1];
	}
	
	let url = location2.match( /^(.+?)(\d+)([^\d]*)$/);
	console.log(1);
	// URLにページ番号が含まれている場合
	if (url){
		let p = url[2];
		let next = Number(p) + plus;
		if (next >= 0){
			let l = p.length;
			// 001とかと3桁以上はパディング
			if (/0\d+/.test(p) || p.length > 3) {
				next = "0".repeat(p.length - String(next).length) + next;
			}
			ret = location1 + url[1] + next + url[3];
			
		} else {
			alert("最初のページです");
			return;
		}
	
	} else {
		if (location2.indexOf("?") !== -1){
			// クエリがあるならそれに追加
			ret = location0 + "&" + defword + "=" + defnum;
		} else if (/[^\/]$/.test(location0)) {
			// "/"で終わらないURLは.phpとかそんなん
			ret = location0 + "?" + defword + "=" + defnum;
		} else {
			ret = location0 + defnum;
		}
	}
	
	location.href = encodeURI(ret);
}


function saveConfig(){
	localStorage.setItem(stname, JSON.stringify(config));
}


function yamagata(x, maxX, maxY) {
	y = Math.round(maxY * (Math.cos((1 - x / maxX) * Math.PI) + 1) / 2);
	// y = maxY * (x / maxX) ^ 3.5;
	return y;
}