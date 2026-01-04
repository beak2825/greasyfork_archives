// ==UserScript==
// @name         dr_NightMode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  デュラチャ　ボスが来たモードorダークモード
// @author       You
// @match        http://drrrkari.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/434452/dr_NightMode.user.js
// @updateURL https://update.greasyfork.org/scripts/434452/dr_NightMode.meta.js
// ==/UserScript==

'use strict';

class DrrrkariCom{
	constructor(){
		this.switchUrl();
		console.log('-- nightMode.js --');
	}
	
	switchUrl(){
		let url = location.href;
		switch(url){
			// top page
			case 'http://drrrkari.com/':
			case 'http://drrrkari.com/#':
			case 'http://160.16.61.87/':
			case 'http://160.16.61.87/#':
				const sitetop = new Sitetop();
				break;
			// room list
			case 'http://drrrkari.com/lounge/':
			case 'http://drrrkari.com/lounge/#':
			case 'http://160.16.61.87/lounge/':
			case 'http://160.16.61.87/lounge/#':
				console.log(222);
				const lounge = new Lounge();
				break;
			// chat room
			case 'http://drrrkari.com/room/':
			case 'http://drrrkari.com/room/#':
			case 'http://160.16.61.87/room/':
			case 'http://160.16.61.87/room/#':
				const inroom = new Inroom();
				break;
			// お絵描きモード
			case 'http://drrrkari.com/room/?paintmode':
				break;
			
		}
	}
}

class Sitetop{
	constructor(){
		
	}
}

class Lounge{
	constructor(){
		this.nightMode();
	}
	nightMode(){
		GM_addStyle(`
			#lounge{
				background: black;
				color: #ddd;
			}
			.dashed{
				border-top-color: #666;
			}
			/* 入室ボタン */
			.btn-primary{
				background-color: black;
			}
			/* ノックボタン */
			.btn-warning{
				background-color: black;
			}
		`);
		
		document.querySelector('#profile').style.right = '-70px';
		/*
		var s = document.querySelector('#lounge').style;
		s.background = 'black';
		s.color = 'white';

		var btnLogins = document.querySelectorAll('.login button');
		for(let btnLogin of btnLogins){
			btnLogin.style.background = 'black';
		}
		*/
	}
	
}

class Inroom{
	constructor(){
		this.nightMode();
	}
	nightMode(){
		GM_addStyle(`
		
			body{
				background: gray;
				/* font-size: 9px; */
			}
			
			/* 発言者アイコン
				元のCSSは http://drrrkari.com/css/style.css?2017091702
				発言者アイコン消すだけなら、書き換え不要。
			 */
			dl.setton dt {
				background: transparent url('icon_setton.png') no-repeat center top;
				background: black;
			}
			dl.muff dt {
				background: transparent url('icon_muff.png') no-repeat center top;
				background: black;
			}
			
			dl.setton  p.body, dl.muff  p.body, dl.neko2 p.body, dl.bm  p.body {
				background: transparent url('gray.png') repeat-x left center;
			}
			
			dl.tanaka dt {
				background: transparent url('icon_tanaka.png') no-repeat center top;
				background: skyblue;
			}
			
			dl.tanaka p.body {
				background: transparent url('blue.png') repeat-x left center;
			}

			dl.numakuro dt {
				background: transparent url('icon_numakuro.png') no-repeat center top;
				background: royalblue;
			}

			dl.numakuro p.body{
				background: transparent url('blue.png') repeat-x left center;
			}

			
			dl.kanra dt {
				background: #ddd;
			}
			
			dl.kanra p.body {
				background: transparent url('orange.png') repeat-x left center;
			}
			
			dl.zaika dt {
				background: transparent url('icon_zaika.png') no-repeat center top;
				background: maroon;
			}
			dl.bear dt {
				background: transparent url('icon_bear.png') no-repeat center top;
				background: peru;
			}
			dl.santa dt {
				background: transparent url('icon_santa.png') no-repeat center top;
			}
			
			dl.zawa p.body {
				background: transparent url('green.png') repeat-x left center;
			}
			
			dl.zawa dt {
				background: transparent url('icon_zawa.png') no-repeat center top;
				background: seagreen;
			}
			
			dl.zaika p.body {
				background: transparent url('red.png') repeat-x left center;
			}

			dl.bear p.body, dl.santa p.body {
				background: transparent url('bb.png') repeat-x left center;
			}

			dl.bm dt {
				background: transparent url('icon_bm.png') no-repeat center top;
				background: slategray;
			}

			
			dl.gg dt {
				background: transparent url('icon_gg.png') no-repeat center top;
				background: mediumorchid;
			}
			dl.rab dt {
				background: transparent url('icon_rab.png') no-repeat center top;
				background: mediumvioletred;
			}
			
			dl.gg p.body, dl.rab p.body {
				background: transparent url('pink.png') repeat-x left center;
			}

			dl.orange dt {
				background: transparent url('icon_orange.png') no-repeat center top;
			}

			dl.orange p.body {
				background: transparent url('orange.png') repeat-x left center;
			}

			
			dl.admin dt {
				background: transparent url('icon_admin.png') no-repeat center top;
			}
			
			dl.admin p.body {
				background: transparent url('orange.png') repeat-x left center;
			}

			dl.purple dt {
				background: transparent url('icon_purple.png') no-repeat center top;
				background: blueviolet;
			}

			dl.purple  p.body, p.body {
				background: transparent url('p.png') repeat-x left center;
			}
			dl.bakyura dt {
				background: transparent url('icon_bakyura.png') no-repeat center top;
			}

			dl.bakyura  p.body{
				background: transparent url('limegreen.png') repeat-x left center;
			}

			dl.twin dt {
				background: transparent url('icon_twin.png') no-repeat center top;
				background: red;
			}

			dl.twin  p.body {
				background: transparent url('red2.png') repeat-x left center;
			}
			dl.usa dt {
				background: transparent url('icon_usa.png') no-repeat center top;
				background: gold;
			}

			dl.usa  p.body {
				background: transparent url('yellow.png') repeat-x left center;
			}

			dl.neko dt {
				background: transparent url('icon_neko.png') no-repeat center top;
				background: coral;
			}
			dl.nyan dt {
				background: transparent url('icon_nyan.png') no-repeat center top;
				background: chocolate;
			}

			dl.muff_nyan dt {
				background: transparent url('icon_muff_nyan.png') no-repeat center top;
				background: chocolate;
			}

			dl.neko p.body, dl.nyan p.body, dl.muff_nyan p.body {
				background: transparent url('yy.png') repeat-x left center;
			}

			dl.zz dt {
				background: transparent url('icon_zz.png') no-repeat center top;
			}

			dl.moza dt {
				background: transparent url('icon_moza.png') no-repeat center top;
				background: steelblue;
			}

			dl.moza p.body {
				background: transparent url('b.png') repeat-x left center;
			}

			dl.kai dt {
				background: transparent url('icon_kai.png') no-repeat center top;
				background: olive;
			}

			dl.kai p.body {
				background: transparent url('k.png') repeat-x left center;
			}
			dl.neko2 dt {
				background: transparent url('icon_neko2.png') no-repeat center top;
				background: dimgray;
			}
			dl.girl dt {
				background: transparent url('icon_girl.png') no-repeat center top;
				background: crimson;
			}
			dl.girl p.body {
				background: transparent url('gi.png') repeat-x left center;
			}
			
			/* ふきだし */
			div.bubble p.body,div.bubble2 p.body {
				float: left;
				clear: left;
				padding: 15px 20px;
				border-radius: 13px;
				border: 4px #858585 solid;
				background: rgba(100,100,100, 0);	/* 背景透過。文字そのまま */
				font: 1em "Meiryo", sans-serif;
				font-size: 10px;
				letter-spacing: 3px;
				color: #ccc;
				position: relative;
			}

		`);
	}
}
const d = new DrrrkariCom();

