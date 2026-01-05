// ==UserScript==
// @name        asagi_simref
// @namespace   http://www.dmm.co.jp/netgame/social/-/gadgets/=/app_id=534991/
// @include     http://osapi.dmm.com/gadgets/ifr*
// @include     http://www8298uj.sakura.ne.jp/asagi/raid_simu.html
// @include     http://www.vernobox.com/asagi/raid_simu.html
// @include     http://toshocho.github.io/asagi_sim*
// @author      erenatu
// @description 「デッキ編成を読み込みシミュレータサイトを開いて入力欄に反映するボタン」をゲーム画面の下部に追加する
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.2
// @downloadURL https://update.greasyfork.org/scripts/10982/asagi_simref.user.js
// @updateURL https://update.greasyfork.org/scripts/10982/asagi_simref.meta.js
// ==/UserScript==
(function() {
var gadget_url = 'http://osapi.dmm.com/gadgets/ifr';
var simu_url = 'http://www8298uj.sakura.ne.jp/asagi/raid_simu.html';
var simu_urlb = 'http://www.vernobox.com/asagi/raid_simu.html';
var simu2_url = 'http://toshocho.github.io/asagi_sim/';
var ar_injection = (function() {
	return {
		inject: function(fn) {
			var script = document.createElement('script');
			script.setAttribute("type", "application/javascript");
			script.textContent = '(' + fn + ')();';
			document.body.appendChild(script);
		},
		addStyle: function(doc, id, css) {
			var head, style;
			if (document.getElementById(name)) { return; }
			head = document.getElementsByTagName('head')[0];
			if (!head) { return; }
			style = doc.createElement('style');
			style.type = 'text/css';
			style.id = id;
			style.innerHTML = css;
			head.appendChild(style);
		}
	};
})();

var bosscalc = function() {
	var raid = {
		scale: {
			// LV 1 - 50 (length = 50)
			atk : [1,1.1,1.2,1.4,1.6,1.8,2,2.2,2.4,2.6,2.8,3,3.1,3.2,3.3,3.4,3.5,3.6,3.7,3.8,3.9,4.1,4.3,4.5,4.7,4.9,5.1,5.3,5.5,5.7,5.9,6.1,6.3,6.5,6.7,6.9,7.1,7.3,7.5,7.7,7.9,8.1,8.3,8.5,8.7,8.9,9.1,9.3,9.5,9.7],
			def : [1,1.2,1.7,2.2,2.7,3.2,3.3,3.4,3.5,3.6,3.7,3.9,4.1,4.3,4.5,4.7,4.9,5.1,5.3,5.5,5.7,5.9,6.1,6.3,6.5,6.7,6.9,7.1,7.3,7.6,7.9,8.2,8.5,8.8,9.1,9.4,9.7,10,10.3,10.6,10.9,11.2,11.5,11.8,12.1,12.4,12.7,13,13.3,13.6]
		},
		base: {
			akaoni:  {name:'赤鬼',attr:1,atk:2000,def:168750},
			hayaoni: {name:'速疾鬼',attr:1,atk:2000,def:168750},
			kurou:   {name:'八津九郎',attr:0,atk:1300,def:270000},
			majyu:   {name:'魔獣',attr:1,atk:1300,def:270000},
			feru:    {name:'フェルスト',attr:1,atk:1200,def:108000},
			born:    {name:'XPS-11Aボーン',attr:2,atk:1750,def:450000},
			rarelow: {name:'レアレイド(弱)',attr:0,atk:4000,def:16000,atk50:14500,def50:800000,atk150:18000,def150:1200000,def200:1300000},
			rarehigh:{name:'レアレイド(強)',attr:0,atk:9500,def:100000,atk50:31340,def50:1200000,def150:1800000,def300:2499900}
		}
	};
	return {
		'calcRaidStatus' : function(basename, level, atkflg) {
			try {
			var kind = (atkflg) ? 'atk' : 'def';
			if (basename == 'rarelow' || basename == 'rarehigh') {
				if (level <= 50) {
					var lv1 = raid.base[basename][kind];
					var diff = (raid.base[basename][kind + '50'] - lv1) / 49;
					return Math.round(lv1 + (diff * (level - 1)));
				}
				if (level > 50 && level <= 150) {
					var lv50 = raid.base[basename][kind + '50'];
					var lv150 = raid.base[basename][kind + '150'];
					if (typeof lv150 == 'undefined') {
						return lv50;
					}
					var diff = (lv150 - lv50) / 100;
					return Math.round(lv50 + (diff * (level - 50)));
				}
				if (basename == 'rarelow') {
					level = Math.min(level, 200);
					var lv150 = raid.base[basename][kind + '150'];
					var lv200 = raid.base[basename][kind + '200'];
					if (typeof lv200 == 'undefined') {
						return lv150;
					}
					var diff = (lv200 - lv150) / 50;
					return Math.round(lv150 + (diff * (level - 150)));
				}
				level = Math.min(level, 300);
				var lv150 = raid.base[basename][kind + '150'];
				var lv300 = raid.base[basename][kind + '300'];
				if (typeof lv300 == 'undefined') {
					return raid.base[basename][kind + '50'];
				}
				var diff = (lv300 - lv150) / 150;
				return Math.round(lv150 + (diff * (level - 150)));
				
			} else if (level > 50) {
				level = 50;
			}
			return parseInt(raid.base[basename][kind] * raid.scale[kind][level - 1]);
			} catch(e) { 
				console.log(e);
			}
		},
		'getRaidAttr': function(basename) {
			return raid.base[basename].attr;
		},
		'getRaidNames' : function() {
			var ret = {};
			for (var key in raid.base) {
				ret[key] = raid.base[key].name;
			}
			return ret;
		}
	};
}();

// #########################################################################
// ■ 決戦アリーナの改造
// #########################################################################
if (location.href.indexOf(gadget_url) != -1) {

	var injection_script = function()
	{
		var JSON_MarkerStr = 'json_val; ';
		var SIM1_Marker = 'sim1_jv; ';		// としあきシミュへ
		var SIM2_Marker = 'sim2_jv; ';		// 壺シミュへ
		
		// デッキ構成画面を開いた時に更新される(deck)
		var get_deck = function() {
			if (!deck) {
				console.log('[asagi_raid] deck object reference error');
				return null;
			}
			var so = [0, 0, 0, 0, 0, 0, 0, 0, 0];
			if (deck.leaderUcid) {
				so[0] = deck.sortableCard[deck.leaderUcid];
			}
			var atk = deck.decks.attack;
			var def = deck.decks.defense;
			for (var i = 0; i < 4; i++) {
				if (atk[i]) {
					so[1 + i] = deck.sortableCard[atk[i]];
				}
				if (def[i]) {
					so[5 + i] = deck.sortableCard[def[i]];
				}
			}
			return so;
		};
		var save_deck = function(marker) {
			var so = get_deck();
			if (so == null) { return; }
			var safeStr = marker + JSON.stringify(so);
			window.postMessage(safeStr, "*");
		};

		// スクリプト関数に注入
		var app_wrap_func = function(obj, name, before_func, after_func) {
			var tgt = obj;
			var new_func;
			if (arguments.length < 4) {
				after_func = before_func;
				before_func = null;
			}

			if (tgt["" + name + "_orig_ar"]) {
				return;
			}
			tgt["" + name + "_orig_ar"] = tgt[name];

			new_func = function() {
				var ret;
				if (before_func != null) {
					before_func.apply(tgt, arguments);
				}
				ret = tgt["" + name + "_orig_ar"].apply(tgt, arguments);
				if (after_func != null) {
					after_func.apply(tgt, arguments);
				}
				return ret;
			};
			return tgt[name] = new_func;
		};

		var ar_eventlistener = function(list) {
			var myfunc = list;
			this.add = function(fn) { 
				myfunc.push(fn);
			};
			this.remove = function(fn) {
				var len = myfunc.length;
				for (var i = len; i >= 0; i--) {
					if (myfunc[i] == fn) myfunc.splice(i, 1);
				}
			};
			this.exec = function() {
				for (var i = 0; i < myfunc.length; i++) {
					var token = myfunc[i];
					token();
				}
			};
		};
		
		// ガジェットコンテンツ読み込み＆スクリプト初期化完了後に呼び出されるイベント
		var ar_event = (function() {
			var readyFunctions = [];
			var popupFunctions = [];
			var events = {
				'onLoad' : new ar_eventlistener(readyFunctions),
				'onPopup' : new ar_eventlistener(popupFunctions),
				'onLoadAndPopup' : {
					add : function(fn) {
						events.onLoad.add(fn);
						events.onPopup.add(fn);
					},
					remove : function(fn) {
						events.onLoad.remove(fn);
						events.onPopup.remove(fn);
					}
				}
			};
			return events;
		})();

		
		// 処理メイン
		var inject = function() {
		    if (!document.getElementById('footer')) {
		      return;
		    }
		    app_wrap_func(app, 'onLoad', function() { ar_event.onLoad.exec(); });
		    // 独自ボタンをフッターに配置
		    container = document.getElementById('footer_buttons');
		    if (!container) {
		      container = $('<div id="footer_buttons"></div>');
		      $('#footer').append(container);
		    } else {
		      container = $(container);
		    }
		    if (!document.getElementById('footer_buttons_simu')) {
				btn = $('<div id="footer_buttons_simu" class="ar_footer_buttons" title="としあき製レイドシミュレーターを新タブで開きます">ｼﾐｭ</div>').appendTo(container);
				btn.on('click', function(ev) {
					if (ev) {
						ev.stopPropagation();
					}
					if (!("deck" in window)) {
						var fn = function() {
							app_wrap_func(deck, 'initPage', function() {
								ar_event.onLoad.remove(fn);
								save_deck(SIM1_Marker);
							});
						};
						ar_event.onLoad.add(fn);
						app.requestUrl("/deck/deck_index");
					} else {
						save_deck(SIM1_Marker);
					}
				});
		    }
		    
		    if (!document.getElementById('footer_buttons_simu2')) {
		    	btn = $('<div id="footer_buttons_simu2" class="ar_footer_buttons" title="壺産レイドシミュレーターを新タブで開きます">ｼﾐｭ2</div>').appendTo(container);
				btn.on('click', function(ev) {
					if (ev) {
						ev.stopPropagation();
					}

					if (!("deck" in window)) {
						var fn = function() {
							app_wrap_func(deck, 'initPage', function() {
								ar_event.onLoad.remove(fn);
								save_deck(SIM2_Marker);
							});
						};
						ar_event.onLoad.add(fn);
						app.requestUrl("/deck/deck_index");
					} else {
						save_deck(SIM2_Marker);
					}
				});
		    }
		};
		inject();
	};

	// lz-string.min.js
	var LZString=function(){function o(o,r){if(!t[o]){t[o]={};for(var n=0;n<o.length;n++)t[o][o.charAt(n)]=n}return t[o][r]}var r=String.fromCharCode,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",t={},i={compressToBase64:function(o){if(null==o)return"";var r=i._compress(o,6,function(o){return n.charAt(o)});switch(r.length%4){default:case 0:return r;case 1:return r+"===";case 2:return r+"==";case 3:return r+"="}},decompressFromBase64:function(r){return null==r?"":""==r?null:i._decompress(r.length,32,function(e){return o(n,r.charAt(e))})},compressToUTF16:function(o){return null==o?"":i._compress(o,15,function(o){return r(o+32)})+" "},decompressFromUTF16:function(o){return null==o?"":""==o?null:i._decompress(o.length,16384,function(r){return o.charCodeAt(r)-32})},compressToUint8Array:function(o){for(var r=i.compress(o),n=new Uint8Array(2*r.length),e=0,t=r.length;t>e;e++){var s=r.charCodeAt(e);n[2*e]=s>>>8,n[2*e+1]=s%256}return n},decompressFromUint8Array:function(o){if(null===o||void 0===o)return i.decompress(o);for(var n=new Array(o.length/2),e=0,t=n.length;t>e;e++)n[e]=256*o[2*e]+o[2*e+1];var s=[];return n.forEach(function(o){s.push(r(o))}),i.decompress(s.join(""))},compressToEncodedURIComponent:function(o){return null==o?"":i._compress(o,6,function(o){return e.charAt(o)})},decompressFromEncodedURIComponent:function(r){return null==r?"":""==r?null:(r=r.replace(/ /g,"+"),i._decompress(r.length,32,function(n){return o(e,r.charAt(n))}))},compress:function(o){return i._compress(o,16,function(o){return r(o)})},_compress:function(o,r,n){if(null==o)return"";var e,t,i,s={},p={},u="",c="",a="",l=2,f=3,h=2,d=[],m=0,v=0;for(i=0;i<o.length;i+=1)if(u=o.charAt(i),Object.prototype.hasOwnProperty.call(s,u)||(s[u]=f++,p[u]=!0),c=a+u,Object.prototype.hasOwnProperty.call(s,c))a=c;else{if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++),s[c]=f++,a=String(u)}if(""!==a){if(Object.prototype.hasOwnProperty.call(p,a)){if(a.charCodeAt(0)<256){for(e=0;h>e;e++)m<<=1,v==r-1?(v=0,d.push(n(m)),m=0):v++;for(t=a.charCodeAt(0),e=0;8>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}else{for(t=1,e=0;h>e;e++)m=m<<1|t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t=0;for(t=a.charCodeAt(0),e=0;16>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1}l--,0==l&&(l=Math.pow(2,h),h++),delete p[a]}else for(t=s[a],e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;l--,0==l&&(l=Math.pow(2,h),h++)}for(t=2,e=0;h>e;e++)m=m<<1|1&t,v==r-1?(v=0,d.push(n(m)),m=0):v++,t>>=1;for(;;){if(m<<=1,v==r-1){d.push(n(m));break}v++}return d.join("")},decompress:function(o){return null==o?"":""==o?null:i._decompress(o.length,32768,function(r){return o.charCodeAt(r)})},_decompress:function(o,n,e){var t,i,s,p,u,c,a,l,f=[],h=4,d=4,m=3,v="",w=[],A={val:e(0),position:n,index:1};for(i=0;3>i;i+=1)f[i]=i;for(p=0,c=Math.pow(2,2),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(t=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;l=r(p);break;case 2:return""}for(f[3]=l,s=l,w.push(l);;){if(A.index>o)return"";for(p=0,c=Math.pow(2,m),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;switch(l=p){case 0:for(p=0,c=Math.pow(2,8),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 1:for(p=0,c=Math.pow(2,16),a=1;a!=c;)u=A.val&A.position,A.position>>=1,0==A.position&&(A.position=n,A.val=e(A.index++)),p|=(u>0?1:0)*a,a<<=1;f[d++]=r(p),l=d-1,h--;break;case 2:return w.join("")}if(0==h&&(h=Math.pow(2,m),m++),f[l])v=f[l];else{if(l!==d)return null;v=s+s.charAt(0)}w.push(v),f[d++]=s+v.charAt(0),h--,s=v,0==h&&(h=Math.pow(2,m),m++)}}};return i}();"function"==typeof define&&define.amd?define(function(){return LZString}):"undefined"!=typeof module&&null!=module&&(module.exports=LZString);

	// supported "version": 20150705
	var as2util = {
		save : {
			version: "20150705",
			CONDITION_LIST: [
				'なし',
				'攻撃デッキのメンバーとリーダーが属性なら',
				'防御デッキのメンバーとリーダーが属性なら',
				'味方リーダーが対魔忍なら',
				'味方リーダーが魔族なら',
				'味方リーダーが米連なら',
				'敵リーダーが対魔忍なら',
				'敵リーダーが魔族なら',
				'敵リーダーが米連なら'
			],
			GROUP_LIST: [
				'なし',
				'対魔忍',
				'魔族',
				'米連',
				'全体'
			],
			SKILL_LIST: [
				'なし',
				'味方属性の攻撃力をUP',
				'味方属性の攻撃力を%UP',
				'敵属性の防御力をDOWN',
				'敵属性の防御力を%DOWN',
				'味方属性の防御力をUP',
				'味方属性の防御力を%UP',
				'敵属性から受けるダメージをカット',
				'敵属性から受けるダメージを%カット',
				'味方属性の攻撃力と防御力を%UP',
				'敵属性の攻撃力と防御力を%DOWN'
			]
		},
		PARSEREG: /^(?:(.+?が)(対魔忍|米連|魔族)なら)?(敵|味方)(対魔忍|米連|魔族|全体)(.+?)(\d+)(%?(?:カット|UP|DOWN))/
	};
	as2util.compress = function(str) {
		var compressed = LZString.compress(encodeURIComponent(str));
		var serialized = '';
		for (var i = 0, length = compressed.length; i < length; ++i) {
			var c = compressed.charCodeAt(i);
			serialized += String.fromCharCode(c & 0xFF, (c & 0xFF00) >> 8);
		}
		return window.btoa(serialized);
	};
	as2util.save.serialize = function(array, card) {
		if (card.skill_description === void 0) {
			array.push('なし', 1, 0, 0, 0, 0, 0, 0, 0);
			return;
		}
		var sk, st = '対魔忍', sv = 0, sc = 'なし';
		sk = card.skill_description;
		sk = sk.replace('スキルなし', 'なし').replace(as2util.PARSEREG, function(al, gc1, gc2, g1, g2, g3, g4, g5) {
			if (gc1) {
				sc = gc1;
				sc += ((gc1.indexOf('メンバーとリーダー') >= 0) ? "属性" : gc2) + "なら";
			} else {
				sc = "なし";
			}
			sv = parseInt(g4, 10);
			st = g2 + "";
			return g1 + "属性" + g3 + g5;
		});
		array.push(
			card.name.substr(0, 4),
			card.skill_level + "",
			parseInt(card.attack, 10),
			parseInt(card.defense, 10),
			as2util.save.GROUP_LIST.indexOf(card.orgs),
			as2util.save.SKILL_LIST.indexOf(sk),
			as2util.save.CONDITION_LIST.indexOf(sc),
			sv,
			as2util.save.GROUP_LIST.indexOf(st)
		);
	};
	as2util.save.serializeDeck = function(array, raw) {
		as2util.save.serialize(array, raw[0]);
		as2util.save.serialize(array, {});	// help user
		for (var i = 1; i < 9; i++) {
			as2util.save.serialize(array, raw[i]);
		}
		return array;
	};
	as2util.save.getQuery = function(ours) {
		var boss_raw = {
			name : "",
			orgs : "魔族",
			skill_description : "スキルなし",
			skill_level : 1,
			attack : "2000",
			defense : "168750"
		};
		var enemy = [boss_raw,{},{},{},{},{},{},{},{}];
		return as2util.compress(
			JSON.stringify(
				as2util.save.serializeDeck(
					as2util.save.serializeDeck([as2util.save.version], ours),
					enemy
				)
			)
		);
	};

	var receiveMessage = function(event) {
		var SIM1_Marker = 'sim1_jv; ';		// としあきシミュへ
		var SIM2_Marker = 'sim2_jv; ';		// 壺シミュへ
		var messageJSON = event.data;
		if (typeof messageJSON == 'string') {
			if (messageJSON.indexOf(SIM1_Marker) == 0) {
				try {
					GM_setValue('asagiRaidMyDecks', messageJSON);
					window.open(simu_url);
				} catch (e) {
					console.log(e);
				}

			}
			else if (messageJSON.indexOf(SIM2_Marker) == 0) {
				window.open(
					simu2_url + '?' + as2util.save.getQuery(
						JSON.parse(messageJSON.substring(SIM2_Marker.length, messageJSON.length)))
				);
			}
		}
		
	};


	window.addEventListener("message", receiveMessage, false);

	window.addEventListener("load", function() {
		ar_injection.inject(injection_script);
		var ar_css = 
			".ar_footer_buttons {" +
			"width:40px; height:20px; display:inline-block; border: 1px solid #fff;" +
			"border-radius: 20px; background-color: rgba(0,0,0,0.8);line-height: 20px; color: white;" +
			"margin: 4px 4px; text-align: center; cursor: default; }" +
			".ar_footer_buttons:hover { color: red; background-color: rgba(200,200,200,0.8); }";
		ar_injection.addStyle(document, 'ar_css_mod', ar_css);
	}, false);
}
// #########################################################################
// ■ レイドシミュレータページの改造
// #########################################################################
else if (location.href.indexOf(simu_url) != -1 || location.href.indexOf(simu_urlb) != -1) {

	var GM_SuperGetValue = function(varName) {
		var SIM1_Marker = 'sim1_jv; ';
		
		var varValue = GM_getValue(varName);
		if (!varValue) { return null; }
		if (typeof varValue == 'string') {
			var regxp = new RegExp('^' + SIM1_Marker + '(.+)$');
			var m = varValue.match(regxp);
			if (m && m.length > 1) {
				varValue = m[1];
				return varValue;
			}
		}
		return varValue;
	};
	var mydecks_str = GM_SuperGetValue('asagiRaidMyDecks');
	if (!mydecks_str) { return; }
	var mydecks = JSON.parse(mydecks_str);

	var skill2idx = function(str) {
		var ret = { skill: 0, attr: 0, value: 0 };
		var re = /.+?(対魔忍|魔族|米連|全体).+?(受けるダメージ|防御力|攻撃力).+?(\d+%?)(UP|DOWN|カット)/;
		var m;
		if (m = re.exec(str)) {
			switch (m[1]) {
				case '魔族' : ret.attr = 1; break;
				case '米連' : ret.attr = 2; break;
				case '全体' : ret.attr = 3; break;
				default : ret.attr = 0; break; //対魔忍
			}
			var per = m[3].indexOf('%') != -1;
			ret.value = m[3].replace('%', '');
			var test = 0xff;
			switch (m[2]) {
				case '攻撃力' : test &= 3; break;
				case '防御力' : test &= 0xf0; break;
				case '受けるダメージ' : test &= 0xC; break;
				default : test = 0; break;
			}
			switch (m[4]) {
				case 'UP' : test &= 0x33; break;
				case 'DOWN' : test &= 0xC0; break;
				case 'カット' : test &= 0xC; break;
				default : test = 0; break;
			}
			test = (per) ? test & 0xAA : test & 0x55;
			for (var i = 0; i < 8; i++) {
				if ((test & (1 << i)) > 0) {
					ret.skill = i;
					break;
				}
			}
		}
		return ret;
	};

	var modulate = function() {
		try {
			$("select[name=card]").each(function(index, el) {
				var tr = $(el).parent().parent();
				if (index < 9) {
					var card = mydecks[index];
					var sk = skill2idx(card["skill_description"]);
					$(el).find("option").eq(0).text(card.name);
					tr.find("select[name=attr]:eq(0) > option").filter(function() { return $(this).text() == card.orgs; }).prop('selected', true).removeAttr("disabled");
					tr.find("select[name=skill]:eq(0) > option:eq("+sk.skill+")").prop("selected", true);
					tr.find("select[name=skillattr]:eq(0) > option:eq("+sk.attr+")").prop("selected", true).removeAttr("disabled");
					tr.find("input[name=attack]:eq(0)").val(card.attack);
					tr.find("input[name=deffence]:eq(0)").val(card.defense);
					tr.find("input[name=skillnum]:eq(0)").val(sk.value);
				}
			});
		} catch(e) {
			console.log(e);
		}
		var td = $('td:contains("レイドボス")').next('td').eq(0);
		td.find('a').remove();

		var sel = $('<select data-width="auto" style="margin: 0px 4px;" name="raidBaseName"></select>').appendTo(td);
		var names = bosscalc.getRaidNames();
		for (var key in names) {
			$('<option>', {
				text: names[key],
				value: key
			}).appendTo(sel);
		}
		{
			var tr = $('select[name=raidBaseName]').eq(0).parent().parent();
			tr.find('select[name=attr]:eq(0) > option:eq(1)').prop("selected", true);
			tr.find('input[name=attack]').eq(0).val(bosscalc.calcRaidStatus('akaoni', 1, true));
			tr.find('input[name=deffence]').eq(0).val(bosscalc.calcRaidStatus('akaoni', 1, false));
		}
		var setval_func = function() {
			var sel = $('select[name=raidBaseName]').eq(0);
			var key = sel.val();
			var lv	= parseInt($('input[name=raidLevel]').eq(0).val());
			var attr = bosscalc.getRaidAttr(key);
			var tr = sel.parent().parent();
			tr.find('select[name=attr]:eq(0) > option:eq(' + attr + ')').prop("selected", true);
			tr.find('input[name=attack]').eq(0).val(bosscalc.calcRaidStatus(key, lv, true));
			tr.find('input[name=deffence]').eq(0).val(bosscalc.calcRaidStatus(key, lv, false));

		};
		sel.on('change', setval_func);
		var inp = $('<input type="number" min="1" max="300" style="width:70px; margin: 0px 4px;" name="raidLevel" value="1">').appendTo(td);
		inp.on('change', function(ev) {
			if (ev) {
				ev.stopPropagation();
			}
			try {
				var num = parseInt($(this).val());
				if (num < 1) {
					$(this).val(1);
				}
				if (num > 300) {
					$(this).val(300);
				}
			} catch(e) {
				console.log(e);
			}
			setval_func();
		});

	};
	window.addEventListener("load", function() {
		try {
			$(this).delay(1000).queue(function() { modulate(); $(this).dequeue(); });
		} catch(e) { console.log(e); }
	}, false);
}
// #########################################################################
// ■ レイドシミュレータページ2の改造
// #########################################################################
else if (location.href.indexOf(simu2_url) != -1) {
	var setval_func = function() {
		var key = $('#boss-name-mod').val();
		var lv = $('#boss-level-mod').val();
		 var attr = bosscalc.getRaidAttr(key) + 1;
		$('#boss-group > option:eq(' + attr + ')').prop("selected", true);
		$('#boss-attack').val(bosscalc.calcRaidStatus(key, lv, true));
		$('#boss-defense').val(bosscalc.calcRaidStatus(key, lv, false));
	};
	var modulate = function() {
		try
		{
			var sel = $('<select id="boss-name-mod" class="form-control input-sm">');
			var names = bosscalc.getRaidNames();
			for (var key in names) {
				$('<option>', {
					text: names[key],
					value: key
				}).appendTo(sel);
			}
			sel.on('change', setval_func);
			
			var inp = $('<input id="boss-level-mod" class="form-control input-sm" type="number" min="1" max="300" value="1">');
			inp.on('change', function(ev) {
				if (ev) { ev.stopPropagation(); }
				try {
					var num = parseInt($(this).val());
					if (num < 1)
						$(this).val(1);
					if (num > 300)
						$(this).val(300);
				} catch(e) { console.log(e); }
				setval_func();
			});
			
			var row = $('<div class="form-group form-group-sm">');
			row.append('<label class="col-xs-2 control-label">自動入力</label>');
			row.append($('<div class="col-xs-6 col-sm-2">').append(sel));
			row.append($('<div class="col-xs-3 col-sm-2">').append(inp));
			$('#boss-group').parent().parent().before(row);
		} catch (e) { console.log(e); }
	};
	modulate();
}

})();