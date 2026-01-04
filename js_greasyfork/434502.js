// ==UserScript==
// @name         chatPadu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  チャットパッド　ログ保存＆自動マッチング
// @author       You
// @match        http://chatpad.jp/chatroom.html
// 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434502/chatPadu.user.js
// @updateURL https://update.greasyfork.org/scripts/434502/chatPadu.meta.js
// ==/UserScript==


confirm = function(){
	return true;
}

class ChatPado{
	constructor(){
		this.setEvent();
		this.buildUI();
		
		this.chatstartFlag = false;	// tureの場合、自動巡回停止
	}
	
	// イベント設定
	setEvent(){
		// 新規発言監視
		(()=>{
			const target = document.getElementById('chatLog');
			const observer = new MutationObserver((mutations)=>{
				mutations.forEach(this.eventNewline.bind(this));
			});
			const config = {
				//attributes: true,
				childList: true,
				//characterData: true,
				//subtree: true
			};
			observer.observe(target, config);
		})();
		
		// プロフィールテキスト変更監視
		(()=>{
			const observer = new MutationObserver((mutations)=>{
				mutations.forEach(this.eventChangeProf.bind(this));
			});
			observer.observe(
				document.getElementById('reProfileMargin'), {
					childList: true
				}
			);
		})();
		
		// プロフィール画像変更監視
		(()=>{
			const observer = new MutationObserver((mutations)=>{
				mutations.forEach(this.eventNewline.bind(this));
			});
			observer.observe(
				document.getElementById('reFace'), {
					attributes: true
				}
			);
		})();
	}
	// 新規発言イベント
	eventNewline(mutation){
		console.log('[新規発言イベントが発生');
		const newNode = mutation.addedNodes[0];
		if(!newNode){ return 0; }
		//console.log('[newNode', newNode);
		const msgs = document.querySelectorAll('#chatLog .message');
		const lastMsg = msgs[msgs.length - 1];
		const lastMsgText = lastMsg.innerText;
		console.log('[lastMsgText', lastMsgText);
		
		// チャット開始
		if(lastMsgText.indexOf('チャットを始めるよー！') !== -1 && newNode.classList.contains('systemMessage')){
			console.log('[チャットが始まったよー！]');
			
			// 簡易的に相手プロフィールを取得。本来はMutationObserverで表示されたらすぐ取得すると良い
			setTimeout(()=>{
				console.log('[yourProf]');
				const yourProf = this.getYourProf();
				console.log(yourProf.text.trim());
				console.log(yourProf.imgurl);
				console.log(yourProf.url);
				
				// プロフィールのブラックリスト
				const blackList = ['エッチ', '熟女好き', 'セフレ'];
				if(this.indexOfList(yourProf.text, blackList) !== -1){
					console.log('[プロフィールにNGワードを含むので次へ行きます');
					setTimeout(()=>{
						document.getElementById('btnNextChat').click();
					}, 3000);
				}
				else{
					console.log('prof ok');
				}
			},2000);
			
			// チャット開始からの秒数を表示する
			console.log('[チャット開始');
			const eChattime = document.getElementById('chattime');
			eChattime.innerText = '0';
			
			setInterval(this.elaspedTimer.bind(this), 1000);
			
		}
		// チャット終了
		/*else if(lastMsgText.indexOf('チャットを終了したよ！') !== -1 && newNode.classList.contains('systemMessage')){
			console.log('チャットを終了したよ！', lastMsgText);
			this.chatstartFlag = true;
			
		}
		*/
		// チャット終了？　ここはまともに動いてない
		else if(newNode.classList.contains('textInSystem')){
			console.log('=============== chat end  =======================');
			console.log('[チャット終了？ textInSystem]');
			
			// ここはまともに動いてない
			console.log('================= end ==================');
			return;
		}
		// メッセージ入力中
		else if(newNode.classList.contains('typing')){
			console.log('[メッセージ入力中');
			this.chatstartFlag = true;
		}
		// マイメッセージ
		else if(newNode.classList.contains('myMessage')){
			console.log('[マイメッセージ');
			this.chatstartFlag = true;
		}
		// 相手のメッセージ、またはチャット終了した
		else{
			console.log('[相手のメッセージ？]');
			
			// チャット終了時もここに来る
			if(lastMsgText.indexOf('チャット相手がチャットを終了したよ！') !== -1){
				console.log('%c[相手のメッセージじゃなくて、チャットを終了したよ。おつかれ！]', 'font-size:16pt');
				
				// チャット終了時は、これ以降の処理はしない
				return;
			}
			this.chatstartFlag = true;	// チャット相手が見つかった後に発言があった
			
			// ------------------------------------------------------------
			// この下に相手の発言によって反応を変える処理を書くと自動応答ボットが作れる
			// 最後の発言はlastMsgTextに入っている
			
			// ボットと遭遇した場合、次の相手を探す
			if(lastMsgText.indexOf('おっさん切るならさっさと 切ってくんねえか') !== -1){
				setTimeout(()=>{
					document.getElementById('btnNextChat').click();
				}, 1000);
			}
			// 出会い系みたいな人は自動切断
			else if(lastMsgText.indexOf('こんにちは男') !== -1
			|| this.indexOfList(lastMsgText, ['26男', '女性？']) !== -1){
				document.getElementById('btnNextChat').click();
			}
			// 自動挨拶
			else if(lastMsgText.indexOf('こんにちは') !== -1){
				console.log('相手が挨拶しました');
				//this.say('コンニチハ', 5000);
			}
			
		}
		
	}
	elaspedTimer(){
		// チャット開始からの秒数カウント
		const eChattime = document.getElementById('chattime');
		eChattime.innerText = (eChattime.innerText * 1) + 1;
		const elaspedTime = eChattime.innerText * 1;
		
		// 設定された待機時間を超えたら、次の相手を探す
		const nextChatWait = document.getElementById('inpNextChatWait').value;
		if(!this.chatstartFlag && nextChatWait < elaspedTime){
			document.getElementById('btnNextChat').click();
		}
	
	}
	
	// プロフィールテキスト変更イベント
	eventChangeProftext(mutation){
		console.log('change prof text');
	}
	
	// プロフィール画像変更イベント
	eventChangeProfimg(mutation){
		console.log('change prof img');
	}
	
	// UI
	buildUI(){
		var header = document.querySelector('#header');
		
		// rootPanel
		var rootPanel = (()=>{
			var div = document.createElement('div');
			div.id = 'rootPanel';
			div.style.marginLeft = '250px';
			div.style.border = 'solid #ccc 1px';
			div.style.width = '500px';
			div.style.height = '35px';
			
			return div;
		})();
		header.appendChild(rootPanel);
		
		// btnSaveChatlog
		var btnSaveChatlog = (()=>{
			var btn = document.createElement('button');
			btn.id = 'btnSaveChatlog';
			btn.style.float = 'left';
			btn.style.color = 'black';
			btn.style.background = '#ccc';
			btn.style.border = 'solid gray 1px';
			btn.appendChild(document.createTextNode('saveChatlog'));
			
			btn.addEventListener('click', (e)=>{
				console.log('saveChatlog');
				this.saveChatlog();
			});
			
			return btn;
		})();
		rootPanel.appendChild(btnSaveChatlog);
		
		// チャット相手が見つかってからの経過時間表示欄
		var divChattime = (()=>{
			var div = document.createElement('div');
			div.id = 'chattime';
			div.style.float = 'left';
			div.style.width = '30px';
			div.style.paddingTop = '2px';
			div.style.textAlign = 'right';
			div.appendChild(document.createTextNode('time'));
			
			return div;
		})();
		rootPanel.appendChild(divChattime);
		
		// チャット相手が見つかってからの待機時間設定欄
		var inpNextChatWait = (()=>{
			var inp = document.createElement('input');
			inp.id = 'inpNextChatWait';
			inp.type = 'number';
			inp.step = 2;
			inp.style.float = 'left';
			inp.style.width = '40px';
			//inp.value = 10;
			
			var nextChatWait = localStorage.getItem('nextChatWait') * 1;
			console.log(nextChatWait);
			inp.value = (nextChatWait)? nextChatWait: 10;
			
			inp.addEventListener('change', (e)=>{
				var nextChatWait = e.target.value;
				localStorage.setItem('nextChatWait', nextChatWait);
			});
			
			return inp;
		})();
		rootPanel.appendChild(inpNextChatWait);
		
		// 自動巡回のオンオフ切り替えチェックボックス
		var lblAutoNextChat = (()=>{
			var lbl = document.createElement('label');
			lbl.appendChild(document.createTextNode('autoNext'));
			lbl.style.float = 'left';
			lbl.style.paddingTop = '2px';
			
			return lbl;
		})();
		var chkAutoNextChat = (()=>{
			var inp = document.createElement('input');
			inp.id = 'inpAutoNextChat';
			inp.type = 'checkbox';
			inp.checked = 'checked';
			inp.style.float = 'left';
			
			inp.addEventListener('click', (e)=>{
				this.chatstartFlag = !this.chatstartFlag;
			});
			
			return inp;
		})();
		lblAutoNextChat.appendChild(chkAutoNextChat);
		rootPanel.appendChild(lblAutoNextChat);
		
		// btnNextChat
		var btnNextChat = (()=>{
			var btn = document.createElement('button');
			btn.id = 'btnNextChat';
			btn.setAttribute('accesskey', 'x');
			btn.style.color = 'black';
			btn.style.background = '#ccc';
			btn.style.border = 'solid gray 1px';
			btn.appendChild(document.createTextNode('NextChat'));
			btn.style.position = 'absolute';	// disconnectButtonに重ねる
			btn.style.top = '0px';
			btn.style.left = '0px';
			
			btn.addEventListener('click', (e)=>{
				console.log('next');
				document.getElementById('disconnectButton').click();
				setTimeout(()=>{	// チャット終了と新規チャットは同じボタン
					document.getElementById('disconnectButton').click();
				}, 100);
			});
			
			return btn;
		})();
		//rootPanel.appendChild(btnNextChat);
		var disconnectButtonParent = document.getElementById('disconnectButton').parentElement;
		disconnectButtonParent.style.position = 'relative';
		disconnectButtonParent.appendChild(btnNextChat);
		
	}
	
	// チャットログ取得
	saveChatlog(){
		var yourProf = this.getYourProf();
		console.log(yourProf);
		
		// ログ取得
		var messages = document.querySelectorAll('.message');
		var log = yourProf.text + '\n'.repeat(8);
		for(var i=3; i<messages.length-1; i++){
			var msg = messages[i];
			console.log(msg);
			var type = null;
			if(msg.classList.contains('myMessage')){
				type = 'my';
			}
			else{
				type = 'you';
			}
			log += type +'\t'+ msg.innerText +'\n';
		}
		console.log(log);
		
		// ファイル名
		var dt = new CDate2();
		var date = dt.getDate('-');	// yyyy-mm-dd
		var time = dt.getTime('-');	// hh-mm-dd
		var filename = `chatpad_${date}_${time}.txt`;	// chatpad_yyyy-mm-dd_hh-mm-dd.txt

		// ダウンロード実行
		this.download(filename, log);
	}
	// ファイルダウンロード
	download(filename, data){
		const blob = new Blob([data], {"type": "text/plain"});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		document.body.appendChild(a);
		a.download = filename;
		a.href = url;
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	}
	// プロフィール取得
	getYourProf(){
		var text = document.getElementById('reProfileMargin').innerText;
		var url = document.getElementById('reURLMargin').innerText;
		var imgurl = document.getElementById('reFace').src;
		//console.log(text);
		//console.log(url);
		//console.log(imgurl);

		return { text, url, imgurl }
	}
	// 発言
	say(text, wait){
		setTimeout(()=>{
			document.getElementById('sayField').value = text;
			setTimeout(()=>{	// 時々発言されないので間を開けてみる
				document.getElementById('sayButton').click();
			}, 100);
		}, wait);
	}
	// 複数の文字列を検索して最初に見つかった文字列の要素番号を返す。見つからない場合は-1
	indexOfList(targetString, list){
		let count = 0;
		for(const search of list){
			if(targetString.indexOf(search) !== -1){
				//console.log(search);
				return count;
			}
			//console.log(search);
			count++;
		}
		return -1;
	}
}

class CDate2{
	constructor(){
		this.t = new Date();
	}
	getDate(separator){
		var t = this.t;
		var y = t.getFullYear();
		var m = ( '00' + (t.getMonth() + 1) ).slice(-2)
		var d = ( '00' + t.getDate() ).slice(-2);
		
		var dateString = 'error';
		if(separator){
			// 指定されたセパレータで区切る
			dateString = [y, m, d].join(separator);
		}
		else{
			dateString = y+m+d;	// yyyymmdd
		}
		
		return dateString;	
	}
	getTime(separator){
		//var t = new Date();
		var t = this.t;
		var h = ('00' + t.getHours() ).slice(-2);
		var m = ('00' + t.getMinutes() ).slice(-2);;
		var s = ('00' + t.getSeconds() ).slice(-2);
		
		var timeString = 'error';
		if(separator){
			// 指定されたセパレータで区切る
			timeString = [h, m, s].join(separator);
		}
		else{
			timeString = h+m+s;	// hhmmss
		}
		
		return timeString;
	}
}

var cp = new ChatPado();
