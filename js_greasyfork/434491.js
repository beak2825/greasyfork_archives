// ==UserScript==
// @name         dr_Base
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  デュラチャ　ルームログ保存＆部屋リストとチャット人口を保存
// @author       You
// @match        http://drrrkari.com/*
// 
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/434491/dr_Base.user.js
// @updateURL https://update.greasyfork.org/scripts/434491/dr_Base.meta.js
// ==/UserScript==





// 

'use strict';





// ================================================================================
// 
// 　管理用クラス
// 
// ================================================================================

class DrrkariCom{
	constructor(){
		console.log(' ___   ___');
		console.log('/__/| /__/| __/ __/ __/ __/ __/ __/ __/ __/ __/ __/ __/ ');
		console.log('');
		console.log('Tampermonkey drrrkari-com_*.js');
		console.log('__/ __/ __/ __/ __/ __/ __/ __/ __/ __/ __/ __/ __/ ');
		
		this.switchUrl();
	}
	
	switchUrl(){
		let url = location.href;
		switch(url){
			// top page
			case 'http://drrrkari.com/':
				break;
			// room list
			case 'http://drrrkari.com/lounge/':
			case 'http://drrrkari.com/lounge/#':
			case 'http://160.16.61.87/lounge/':
			case 'http://160.16.61.87/lounge/#':
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
				//const paint = new Paintmode();
				break;
			// 部屋作成画面
			case 'http://drrrkari.com/create_room/':
				const createRoom = new CreateRoom();
				break;
		}
	}
}

// ================================================================================
// 
// 　部屋リスト
// 
// ================================================================================

class Lounge{
	constructor(){
		this.population = null;
		this.profile = {
			name: null,
			icon: null,
			iconUrl: null
		};
		
		console.log(this.getPopulation(), '人');	// 入室者数
		//console.log(this.getProfile());				// プロフィール
		
		this.roomColor();	// 入室可能部屋を色分け
		this.toolboxUI();	// 情報表示
		this.uiProfile();	// プロフィール表示部分のデザイン
	}
	
	getPopulation(){
		this.population = document.querySelector('#main span').innerText.split('人')[0];
		
		return this.population;
	}
	
	roomColor(){
		// 点線非表示
		//document.querySelectorAll('hr').forEach((e)=>{ e.style.display = 'none' });
		
		// 入室可能と満員を色分け
		const rooms = document.querySelectorAll('.rooms');
		let s = 0;
		if(location.href === 'http://160.16.61.87/lounge/' || location.href === 'http://160.16.61.87/lounge/#'){
			// 別館の場合、最初の要素を除外
			s = 1;
		}
		for(let i=s; i<rooms.length; i++){
			rooms[i].style.padding = 0;		// 行間を狭める
			const button = rooms[i].getElementsByTagName('button')[0];	// 青かオレンジのボタン。本館の雑談となりきり
			const button2 = rooms[i].querySelector('.button input');	// 白色角丸ボタン。本館BL、別館
			
			// 色準備
			const enterColor = '#2A9FD6';
			const knockColor = '#F47C3C';
			
			// 本館の、雑談、なりきり
			if(button){
				// ボタンの高さを細くする（本館BLと同高さ）
				button.style.height = '24px';
				button.style.padding = 0;
				// 色
				if(button.value === 'login'){
					rooms[i].style.borderLeft = `3px ${enterColor} solid`;
				}
				else if(button.value === 'knock'){
					rooms[i].style.borderLeft = `3px ${knockColor} solid`;
				}
			}
			// 本館BL、別館
			else if(button2){
				rooms[i].style.overflow = 'hidden';				// .roomsの要素高さゼロ対策
				
				// 入室ボタンデザインを本館雑談と同じにする
				button2.parentElement.style.paddingRight = 0;	// ボタンの右端画像を消す
				button2.style.width = '100px';
				button2.style.color = 'white';
				button2.style.paddingLeft = '0px';
				button2.style.borderRadius = '3px';
				if(button2.name === 'login'){
					button2.style.background = enterColor;					// ボタンの色
					rooms[i].style.borderLeft = `3px ${enterColor} solid`;	// 部屋名の左に着色
				}
				else if(button2.name === 'knock'){
					button2.style.background = knockColor;
					rooms[i].style.borderLeft = `3px ${knockColor} solid`;
				}
				else{
					console.warn('error');
				}
			}
			// 満員の場合
			else{
				// 部屋名文字色を灰色
				rooms[i].querySelector('.name').style.color = '#aaa';
			}
		}
	}
	
	toolboxUI(){
		// 追加機能UI領域作成
		const toolbox = (()=>{
			const toolbox = document.createElement('div');
			toolbox.id = 'toolbox';
			toolbox.style.fontSize = '14px';
			toolbox.style.textAlign = 'left';
			const b = document.createElement('b');
			b.appendChild(document.createTextNode('ToolBox'));
			const hr = document.createElement('hr');
			hr.className = 'dashed';
			toolbox.appendChild(b);
			toolbox.appendChild(hr);
			fixed.parentElement.insertBefore(toolbox, fixed);
			
			return toolbox;
		})();
		
		// HN表示
		const hn = (()=>{
			const eleProfile = document.getElementById('profile');
			const hn = eleProfile.getElementsByClassName('name')[0].innerText;
			const p = document.createElement('p');
			p.appendChild(document.createTextNode(hn));
			toolbox.appendChild(p);
			document.title = hn;
			
			return hn;
		})();
		
		// アイコンの種類表示
		const iconType = (()=>{
			const iconType = document.querySelector('#profile .icon img').src
				.split('_')[1]
				.split('.')[0];
			const div = document.createElement('div');
			div.appendChild(document.createTextNode(iconType));
			toolbox.appendChild(div);
			
			return iconType;
		})();
	}
	
	getRoominfo(room){
		let roomname = room.getElementsByClassName('name')[0].innerText;
		
		let users = [];
		let lis = rooms[5].querySelectorAll('.users li');
		for(var li of lis){
			var icon = li.getElementsByTagName('img')[0].src	// http://drrrkari.com/css/icon_kai.png
				.split('_')[1]	// kai.png
				.split('.')[0];	// kai
			users.push({ 'name': li.innerText, 'icon': icon });
		}
		
		let member = rooms[5].getElementsByClassName('member')[0].innerText.split('/');
		let nowMember = member[0];
		let maxMember = member[1];
		
		let btnval = null;
		let rooms = document.querySelectorAll('.rooms');
		let btn = rooms[2].getElementsByClassName('btn')[0];
		if(btn){
			btnval = btn.name;
		}else{
			btnval = 'full';
		}
		
		return{
			'roomname': roomname,
			'users': users,
			'nowMember': nowMember,
			'maxMember': maxMember,
			'btnval': btnval
		};
	}
	
	uiProfile(){
		GM_addStyle(`
			#profile{
				position: fixed;
				right: 0;
				top: 0;
				width: 100px;
				border: solid 1px gray;
			}
		`);

		var profile = document.getElementById('profile');
		//profile.style.position = 'fixed';
		//profile.style.right = 0;
		//profile.style.top = 0;
		profile.style.width = '150px';	// 本館はGM_addStyleだけでは無効
		//profile.style.border = 'solid gray 1px';
		
		// 部屋リスト保存
		var cRoom = new RoomList();
		cRoom.createSaveButton();

	}
	
	getProfile(){
		var profile = document.getElementById('profile');
		var name = profile.getElementsByClassName('name')[0].innerText;
		var img = profile.querySelector('.icon img');
		var iconUrl = img.src;
		var icon = img.src	// アイコンURL
			.split('/')[4]	// アイコンファイル名
			.split('.')[0]	// アイコンファイル名（拡張子無し）
			.replace('icon_', '');	// 種類
		
		this.profile = {
			name: name,
			icon: icon,
			iconUrl: iconUrl
		};
		
		return this.profile;
		
		/*
			var icons = [
				'girl', 
				'moza', 
				'tanaka', 
				'kanra', 
				'usa', 
				'gg', 
				'orange', 
				'zaika', 
				'setton', 
				'zawa', 
				'neko', 
				'purple', 
				'kai', 
				'bakyura', 
				'neko2', 
				'numakuro', 
				'bm', 
				'bear', 
				'rab', 
				'nyan',
				'muff',
				'muff_nyan',
			];
		*/
	}
	
	
}

// ================================================================================
// 
// 　入室中
// 
// ================================================================================

class Inroom{
	constructor(){
		this.info = {
			'nowPopula': null,
			'maxPopula': null,
			'title': null,
			'host': null,
			'members': []
		};
		
		this.getRoomInfo();
		this.cssMessageBox();
		
		this.loadModule();
	}
	
	loadModule(){
		const log = new Log();
	}
	
	// 部屋情報取得
	getRoomInfo(){
		// ルームタイトル、入室者数、最大人数
		var room_name = document.getElementById('room_name').innerText;
		var delimiterStr = ' (';
		var delimiterPos = room_name.lastIndexOf(delimiterStr);
		var title = room_name.substr(0, delimiterPos);
		var roomPopulation = room_name.substr(delimiterPos + delimiterStr.length, room_name.length)
			.replace(')', '').split('/');
		var nowPopula = roomPopulation[0];
		var maxPopula = roomPopulation[1];
		
		// 入室者名
		var memberlist = [];
		var membersLi = document.querySelectorAll('#members li');
		for(var i=0; i<membersLi.length; i++){
			var hn = membersLi[i].innerText;	// ※トリップが取得されない
			
			// カンマ削除
			if(i === membersLi.length - 1){
				hn = hn.substr(0, hn.length);
			}
			else{
				hn = hn.substr(0, hn.length - 2);
			}
			
			// host　"name(host)"を"name"にする
			if(hn.lastIndexOf('(host)') !== -1){
				var host = hn.substr(0, hn.length - 6);
				console.log('host:', host);
			}
			memberlist.push(hn);
		}
		
		this.info.nowPopula = nowPopula;
		this.info.maxPopula = maxPopula;
		this.info.title = title;
		this.info.host = host;
		this.info.members = memberlist;
	
	}
	
	// UI変更。発言領域左寄せ、ルームホスト表示
	cssMessageBox(){
		// 発言入力領域を左寄せ
		var message_box_inner = document.querySelector('.message_box_inner');
		message_box_inner.style.float = 'left';
		message_box_inner.style.margin = '0 10px';
		
		if(0){
			var uiarea = (function(){
				var div = document.createElement('div');
				div.id = 'uiarea';
				div.style.width = '200px';
				div.style.float = 'left';
				div.style.border = 'solid gray 1px';
				div.style.top = '20px';
				div.style.left = '480px';
				//var message_box = document.querySelector('.message_box');
				//message_box.appendChild(document.createElement('br'));
				//message_box.appendChild(div);
				var body = document.querySelector('#body');
				body.insertBefore(div, body.firstChild);
				return div;
			})();
			$('#uiarea').draggable();
		
			// ルームホストを表示する
			var p = document.createElement('p');
			var host = (this.info.host === null)? '固定部屋': this.info.host;
			p.appendChild(document.createTextNode('host: ' + host));
			uiarea.appendChild(p);
		}
	}
}

class Paintmode{
	constructor(){
		this.ui();
	}
	ui(){
		var saveAndSend = (function(){
			var footer = document.getElementById('footer');
			var btn = document.createElement('button');
			btn.appendChild(document.createTextNode('saveAndSend'));
			footer.appendChild(btn);
			return btn;
		})();
		var uSend = (function(){
			var btn = document.createElement('button');
			btn.appendChild(document.createTextNode('uSend'));
			btn.id = 'uSend';
			footer.appendChild(btn);
			return btn;
		})();
		uSend.addEventListener('click', this.send.bind(this), false);
	}
	save(){
		var cav = document.getElementById('myCanvas');
		var ctx = cav.getContext('2d');
		ctx.save();
	}
	load(){
		var cav = document.getElementById('myCanvas');
		var ctx = cav.getContext('2d');
		ctx.restore();
	}
	send(){
		document.getElementById('sendc').click();
	}
}

class CreateRoom{
	constructor(){
		this.init();
	}
	init(){
		document.querySelector('#room_name').focus();
		
		var setting = {
			name: '',		// 部屋名
			type: 0,		// ジャンル：　0 雑談　1 なりきり　2 BL
			limit: 15,		// 定員：　1～15
			knock: false,	// ノック
			pass: '',		// パスワード
			image: false	// 画像機能
		};
		// 定員
		document.querySelector('#limit').selectedIndex = setting.limit - 2;
		
		// 画像機能
		var inpImages = document.getElementsByName('image');
		if(setting.image){
			inpImages[1].checked = 'checked';
		}
		else{
			inpImages[0].checked = 'checked';
		}
	}
}








// ================================================================================
// 
// 　モジュール群
// 
// ================================================================================

// 入室中の発言保存
class Log{
	constructor(){
		this.createSaveButton();
		this.setHref();
		
		this.createSaveButtonBjson();
		this.createSaveButtonB();
		this.setHrefB();
	}
	
	// ===================================================================================
	// A関数群　部屋のHTMLをパースして保存する関数群
	// ===================================================================================
	
	// 保存用リンク作成
	createSaveButton(){
		var a = document.createElement('a');
		a.id = 'aSave';
		a.appendChild(document.createTextNode('save'));
		document.getElementsByClassName('menu')[0].appendChild(a);
		//document.querySelector('#uiarea').appendChild(a);
		
		a.addEventListener('click', this.createSaveButton_click.bind(this), false);
	}
	createSaveButton_click(e){
		this.setHref();
		
		// 保存した最新の発言に印を付ける機能
		if(1){
			document.querySelector('.talk').style = 'border-top:1px white solid';
		}
	}
	setHref(){
		var log =
			this.getTalksByTalksbox() +
			'\n\n\n\n\n' +
			this.getTalksByPmbox();
		
		// 現在日時取得
		var dt = new CDate();
		var strDateTime = dt.getDate() + "_" + dt.getTime();
		
		// --------------------------------------------------------
		// ダウンロード用リンクにログデータを設定
		
		// 部屋名取得。部屋名取得も汎用関数作る？
		var roomName = document.getElementById('room_name').innerText.split(' (')[0];
		
		// 複数個所で、本館と別館の区別が必要なので、判断用の関数を作る？
		var serverType = '別館';
		if(location.href === 'http://drrrkari.com/room/' || location.href === 'http://drrrkari.com/room/#'){
			serverType = '本館';
		}
		var blob = new Blob([ log ], { "type" : "text/plain" });
		var a = document.getElementById('aSave');
		a.download = strDateTime + '_' + serverType + '-tsv' + '_' + roomName + '.txt';
		a.href = window.URL.createObjectURL(blob);
		
		// 保存したファイル名を表示
		console.log('保存日時', strDateTime);
	}
	getTalksByTalksbox(){
		var talks = document.querySelectorAll('#talks_box .talk');
		var log = '';
		for(let talk of talks){
			var id = talk.id;
			// 画像
			if(talk.querySelector('img')){
				if(talk.querySelector('dt div')){
					var icon = talk.className.split(' ')[1];
					var name = talk.querySelector('dt').firstChild.nodeValue;
					var btns = talk.querySelectorAll('button');
					var posttime = btns[0].innerText.replace('投稿時間: ', '');
					var encip = btns[1].innerText.replace('IP: ', '');
					var url = talk.querySelector('img').src;
					//console.log(id, posttime, encip, icon, name, url);
					var logLine = `${id}\t${posttime}\t${encip}\t${icon}\t${name}\t${url}`;
					//console.log(logLine);
				}
				else{
					var icon = talk.className.split(' ')[1];
					var name = talk.querySelector('dt').firstChild.nodeValue;
					var url = talk.querySelector('img').src;
					var logLine = `${id}\t\t\t${icon}\t${name}\t${url}\t`;
				}
			}
			// 普通の発言
			else if(talk.querySelector('.body')){
				if(talk.querySelector('dt div')){
					var icon = talk.className.split(' ')[1];
					var name = talk.querySelector('dt').firstChild.nodeValue;
					var btns = talk.querySelectorAll('button');
					var posttime = btns[0].innerText.replace('投稿時間: ', '');
					var encip = btns[1].innerText.replace('IP: ', '');
					var talktext = talk.querySelector('.body').innerText;
					//console.log(id, posttime, encip, icon, name, talktext);
					var logLine = `${id}\t${posttime}\t${encip}\t${icon}\t${name}\t${talktext}`;
					//console.log(logLine);
				}
				else{
					var icon = talk.className.split(' ')[1];
					var name = talk.querySelector('dt').firstChild.nodeValue;
					var talktext = talk.querySelector('.body').innerText;
					var logLine = `${id}\t\t\t${icon}\t${name}\t${talktext}`;
				}
			}
			// 入退室、サイコロ
			else if(talk.className.indexOf('system') !== -1){
				var txt = talk.innerText;
				var posend = txt.lastIndexOf('さん') - 3;
				var name = txt.substr(3, posend);
				var logLine = `${id}\t\t\tsystem\t${name}\t${txt}`;
				//console.log(logLine);
			}
			log += logLine + '\n';
		}
		
		return log;
	}
	// 内緒の内容を取得してTSV形式で返す。※内緒画面を表示しておかないと取得不可
	getTalksByPmbox(){
		var log = '';
		var talks = document.querySelectorAll('#pm_box .talk');
		for(var i=0; i<talks.length; i++){
			var talkId = talks[i].id;
			
			// 普通の発言
			if(talks[i].querySelector('dt')){
				var icon = talks[i].className.split(' ')[1];
				//console.log(icon);
				var name = icon +"\t"+ talks[i].querySelector('dt').innerText;
				var txt = talks[i].querySelector('.body').innerText;
			}
			log += talkId +"\t\t\t"+ name +"\t"+ txt +"\n";
		}
		return log;
	}
	
	
	
	// ===================================================================================
	// B関数群　JSONファイル保存用関数群
	// ===================================================================================
	
	// B関数群は、2つの「ボタン」で構成。
	// B1群：画面上表示が「getJson」ボタン。ID:btnGetJson。button要素で作成。
	// B2群：画面上表示が「saveB」リンク。　ID:aSaveB。a要素で作成。
	
	// 関数整理は、まずは2つあるボタンを1つに減らせないか？
	// それが出来なければ、関数先頭を「B1」にして関数名をシンプルに機能を明確化する？
	
	
	
	// -----------------------------------------------------------------------------------
	// B1　button要素
	
	// ※B1を無しにすると、最新のJSON取得できてない状態で保存されてしまうバグがある。
	
	createSaveButtonBjson(){
		var btn = document.createElement('button');
		btn.id = 'btnGetJson';
		btn.appendChild(document.createTextNode('getJson'));
		document.getElementsByClassName('menu')[0].appendChild(btn);
		
		//btn.addEventListener('click', this.createSaveButtonBjson_click.bind(this), false);
		btn.addEventListener('click', ()=>{
			this.setHrefB();
			
			// 保存した最新の発言に印を付ける
			if(0){
				document.querySelector('.talk').style = 'border-top:1px white solid';
			}
		});
	}
	
	// -----------------------------------------------------------------------------------
	// B2　a要素
	
	createSaveButtonB(){
		var a = document.createElement('a');
		a.id = 'aSaveB';
		a.appendChild(document.createTextNode('saveB'));
		document.getElementsByClassName('menu')[0].appendChild(a);
		
		//a.addEventListener('click', this.createSaveButtonB_click.bind(this), false);
		a.addEventListener('click', ()=>{
			this.setHrefB();
		});
	}
	
	// -----------------------------------------------------------------------------------
	// B関数群のコア関数群
	
	setHrefB(){
		document.getElementById('aSaveB').innerText = 'saveB';	// 通信中を判別できるようにする
		
		$.ajax({
			type: 'POST',
			url: 'http://drrrkari.com/ajax.php',
			dataType: 'json',
			timeout: 12000,
			context: this,
			success: success,
			error: function(e){
				console.log('ERROR!', e);
			}
		});
		function success(json, status, xhr){
			//console.log(json);
			console.log('talks', json.talks);
			console.log('users', json.users);
			var jsonStr = JSON.stringify(json, null, '\t');
			
			var aSaveB = document.getElementById('aSaveB');
			this.saveLog(aSaveB, 'json', jsonStr);
			
			// JSON取得成功したら表示を変化させる
			aSaveB.innerText = 'SaveB';
		}
	}
	saveLog(link, logType, log){
		// 現在日時取得
		var dt = new CDate();
		var strDateTime = dt.getDate() + "_" + dt.getTime();
		
		// --------------------------------------------------------
		// ダウンロード用リンクにログデータを設定
		
		// 部屋名取得。部屋名取得も汎用関数作る？
		var roomName = document.getElementById('room_name').innerText.split(' (')[0];
		
		// 複数個所で、本館と別館の区別が必要なので、判断用の関数を作る？
		var serverType = '別館';
		if(location.href === 'http://drrrkari.com/room/' || location.href === 'http://drrrkari.com/room/#'){
			serverType = '本館';
		}
		var blob = new Blob([ log ], { "type" : "text/plain" });
		//var a = document.getElementById('aSaveB');
		link.download = strDateTime + '_' + serverType + '-' + logType + '_' + roomName + '.txt';
		link.href = window.URL.createObjectURL(blob);
		
		// 保存したファイル名を表示
		console.log('保存日時', strDateTime);
	}
}

class CDate{
	getDate(){
		var t = new Date();
		var y = t.getFullYear();
		var m = ( '00' + (t.getMonth() + 1) ).slice(-2)
		var d = ( '00' + t.getDate() ).slice(-2);
		//console.log(y, m, d);
		var dateString = y+'-'+m+'-'+d;	// yyyy-dd-mm
		
		return dateString;	
	}
	getTime(){
		var t = new Date();
		var h = ('00' + t.getHours() ).slice(-2);
		var m = ('00' + t.getMinutes() ).slice(-2);;
		var s = ('00' + t.getSeconds() ).slice(-2);
		//console.log(h+':'+m+':'+s);
		var timeString = h+m+s;	// hh:mm:ss
		
		return timeString;
	}
}

class RoomList{
	constructor(){
		this.rooms = [];
	}
	
	createSaveButton(){
		var profile = document.getElementById('profile');
		var a = document.createElement('a');
		a.id = 'aSaveRooms';
		a.appendChild(document.createTextNode('saveRooms'));
		profile.appendChild(a);
		
		a.addEventListener('click', this.getRoomlist3.bind(this), false);
	}
	
	// 部屋リストを保存
	getRoomlist2(){
		var lounge = {
			// rooms = [];
		};
		
		// 部屋リスト取得
		var rooms = [];
		var eRooms = document.getElementsByClassName('rooms');
		if(location.href === 'http://160.16.61.87/lounge/' || location.href === 'http://160.16.61.87/lounge/#'){
			// 別館の場合、最初の要素を削除
			eRooms[0].remove();
		}
		for(var i=0; i<eRooms.length; i++){
			// -----------------------------------------------
			// ジャンル、部屋名、鍵部屋か
			
			var genre = eRooms[i].parentElement.id;
			var eName = eRooms[i].getElementsByClassName('name')[0];
			var title = eName.innerText;
			var lock = (eName.getElementsByClassName('fa-lock')[0])? true: false;
			
			// -----------------------------------------------
			// 入室者名
			// 入室者名部分は本館と別館でクラス名が違う。
			// しかし、要素の構造は同じなのでchildren[x]で見つけると、同一コードで対応できる。
			
			var eUsers = eRooms[i].children[1].querySelectorAll('li');
			var users = [];
			for(var j=0; j<eUsers.length; j++){
				var username = eUsers[j].innerText;
				var ico = eUsers[j]
					.getElementsByTagName('img')[0]
					.src
					.replace('http://drrrkari.com/css/icon_', '')
					.replace('http://160.16.61.87/css/icon_', '')
					.replace('.png', '');
				users.push({'name':username, 'icon':ico});
			}
			var member = eRooms[i].getElementsByClassName('member')[0].innerText;
			
			// -----------------------------------------------
			// 満員、入室、ノックボタン
			// 入室ボタン部分はBLとBL以外のジャンルでデザインが異なる。別館も異なる。
			
			// 入室ボタンがある場所のテキストを取得する
			var eLogin = eRooms[i].getElementsByClassName('login')[0];
			var button = eLogin.innerText.trim();
			
			var roomid = 'unknown';
			
			// 「満員」表示ではなかった場合。つまり、「ノック」か「入室」の表示
			if(button !== '満員'){
				// button要素が存在する場合
				var button2 = eRooms[i].querySelector('.login button');
				if(button2){
					// ボタンのテキストを取得
					button = button2.innerText;
				}
				// button要素が存在しない場合（旧デザインの処理。本館のBL、別館）
				else{
					// input要素から状態を取得する
					button = eRooms[i].querySelector('.login input').value;
				}
				
				// -----------------------------------------------
				// roomID
				// 「Uncaught TypeError: eRooms[i].getElementsByName is not a function at RoomList.getRoomlist2」
				// 「eRooms[i].getElementsByName」を使おうとすると、TypeErrorが出る。
				// 「var eRooms = document.getElementsByClassName('rooms');」で取得した
				
				var inp = eRooms[i].querySelector('[name=id]');
				var roomid = inp.value;
			}
			
			// 前のバージョンのコード。消しても良い
			/*var inp = eRooms[i].querySelector('.login input');
			var roomid = 'unknown';
			if(inp){
				var roomid = eRooms[i].querySelector('input').value;
			}*/
			
			rooms.push({'title':title, 'lock':lock, 'genre':genre, 'users':users, 'member':member, 'button':button, 'roomid':roomid});
		}
		//console.log(rooms);				
		
		// デュラララチャット全体入室者数取得
		lounge.url = location.href;
		var population = document.querySelector('#main span').innerText.split('人')[0];	// 入室者数。「～人がチャット参加中」の所
		lounge.population = population;
		lounge.rooms = rooms;
		var jsonLounge = JSON.stringify(lounge, null, '\t');
		//console.log(jsonRooms);
		
		// 現在日時取得
		var dt = new CDate();
		var strDateTime = dt.getDate() + "_" + dt.getTime();
		
		// 部屋リストを保存する
		var blob = new Blob([ jsonLounge ], { "type" : "text/plain" });
		var a = document.getElementById('aSaveRooms');
		a.download = 'roomlist_' + strDateTime + '.txt';
		a.href = window.URL.createObjectURL(blob);
	}
	
	getRoomlist3(){
		var lounge = {
			// rooms = [];
		};
		
		// 部屋リスト取得
		var rooms = [];
		var eRooms = document.getElementsByClassName('rooms');
		if(location.href === 'http://160.16.61.87/lounge/' || location.href === 'http://160.16.61.87/lounge/#'){
			// 別館の場合、最初の要素を削除
			eRooms[0].remove();
		}
		
		// 準備処理。 ul.rooms要素に data-genre属性にジャンル情報を付加する事で、全ジャンル同一処理でジャンル分けを可能にする
		(function(){
			// 固定部屋
			let rooms =  document.querySelectorAll('#fixed .rooms');
			for(let room of rooms){
				room.dataset.genre = 'fixed';
				//console.log(room);
			}
			
			// 本館雑談ジャンルの処理。注意書きの上側と下側で分ける
			let e =  document.querySelector('#zatsu .rooms');
			let genre = 'zatsu1';
			do{
				// 部屋が無い場合はループを抜ける
				if(e === null){ break; }
				
				// UL要素の場合、ジャンル情報を付加
				//console.log(e);
				if(e.tagName.toUpperCase() === 'UL'){
					e.dataset.genre = genre;
					//console.log(e);
				}
				// 注意書きまで来たら、ジャンルを変更
				else if(e.tagName.toUpperCase() === 'P'){
					genre = 'zatsu2';
				}
				
				// 雑談ジャンルの部屋を上から順に走査
				e = e.nextElementSibling;
			}while(e);
			
			// 本館なりきり
			rooms =  document.querySelectorAll('#rp .rooms');
			for(let room of rooms){
				room.dataset.genre = 'nari';
				//console.log(room);
			}
			// 本館BL
			rooms =  document.querySelectorAll('#bl .rooms');
			for(let room of rooms){
				room.dataset.genre = 'bl';
				//console.log(room);
			}
			
			// 別館なりきり
			rooms =  document.querySelectorAll('#nari .rooms');
			for(let room of rooms){
				room.dataset.genre = 'nari';
				//console.log(room);
			}
			// 別館R15
			rooms =  document.querySelectorAll('#luv .rooms');
			for(let room of rooms){
				room.dataset.genre = 'r15';
				//console.log(room);
			}
		})();
		
		// 部屋情報取得メイン処理
		for(var i=0; i<eRooms.length; i++){
			// -----------------------------------------------
			// ジャンル、部屋名、鍵部屋か
			
			var eName = eRooms[i].getElementsByClassName('name')[0];
			var title = eName.innerText;
			var lock = (eName.getElementsByClassName('fa-lock')[0])? true: false;
			//var genre = eRooms[i].parentElement.id;
			var genre = eRooms[i].dataset.genre;	// 準備処理の所で付加したジャンル情報を取得
			
			// -----------------------------------------------
			// 入室者名
			// 入室者名部分は本館と別館でクラス名が違う。
			// しかし、要素の構造は同じなのでchildren[x]で見つけると、同一コードで対応できる。
			
			var eUsers = eRooms[i].children[1].querySelectorAll('li');
			var users = [];
			for(var j=0; j<eUsers.length; j++){
				var username = eUsers[j].innerText;
				var ico = eUsers[j]
					.getElementsByTagName('img')[0]
					.src
					.replace('http://drrrkari.com/css/icon_', '')
					.replace('http://160.16.61.87/css/icon_', '')
					.replace('.png', '');
				users.push({'name':username, 'icon':ico});
			}
			var member = eRooms[i].getElementsByClassName('member')[0].innerText;
			
			// -----------------------------------------------
			// 満員、入室、ノックボタン
			// 入室ボタン部分はBLとBL以外のジャンルでデザインが異なる。別館も異なる。
			
			// 入室ボタンがある場所のテキストを取得する
			var eLogin = eRooms[i].getElementsByClassName('login')[0];
			var button = eLogin.innerText.trim();
			
			var roomid = 'unknown';
			
			// 「満員」表示ではなかった場合。つまり、「ノック」か「入室」の表示
			if(button !== '満員'){
				// button要素が存在する場合
				var button2 = eRooms[i].querySelector('.login button');
				if(button2){
					// ボタンのテキストを取得
					button = button2.innerText;
				}
				// button要素が存在しない場合（旧デザインの処理。本館のBL、別館）
				else{
					// input要素から状態を取得する
					button = eRooms[i].querySelector('.login input').value;
				}
				
				// -----------------------------------------------
				// roomID
				// 「Uncaught TypeError: eRooms[i].getElementsByName is not a function at RoomList.getRoomlist2」
				// 「eRooms[i].getElementsByName」を使おうとすると、TypeErrorが出る。
				// 「var eRooms = document.getElementsByClassName('rooms');」で取得した
				
				var inp = eRooms[i].querySelector('[name=id]');
				var roomid = inp.value;
			}
			rooms.push({'title':title, 'lock':lock, 'genre':genre, 'users':users, 'member':member, 'button':button, 'roomid':roomid});
		}
		//console.log(rooms);				
		
		// デュラララチャット全体入室者数取得
		lounge.url = location.href;
		var population = document.querySelector('#main span').innerText.split('人')[0];	// 入室者数。「～人がチャット参加中」の所
		lounge.population = population;
		lounge.rooms = rooms;
		var jsonLounge = JSON.stringify(lounge, null, '\t');
		//console.log(jsonRooms);
		
		// 現在日時取得
		var dt = new CDate();
		var strDateTime = dt.getDate() + "_" + dt.getTime();
		
		// 部屋リストを保存する
		var blob = new Blob([ jsonLounge ], { "type" : "text/plain" });
		var a = document.getElementById('aSaveRooms');
		a.download = 'roomlist_' + strDateTime + '.txt';
		a.href = window.URL.createObjectURL(blob);
	}
}













// ================================================================================
// 
// 　ここから実行
// 
// ================================================================================

const drr = new DrrkariCom();
