// ==UserScript==
// @name        oshioki notifecation
// @namespace   QuinceProject
// @description おしおき支援ソフト第1弾 発展場情報の板が自動更新します。 ついでに音でお知らせします。
// @include     http://77.xmbs.jp/miyuki-*-br_res.php?*
// @exclude     *disp=*
// @version     1.02
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13222/oshioki%20notifecation.user.js
// @updateURL https://update.greasyfork.org/scripts/13222/oshioki%20notifecation.meta.js
// ==/UserScript==
//
// 対象ウェブブラウザは以下の通りです
// Firefox : 3.5以降(HTML5.1対応ブラウザ)
// (Chromeについては現在確認できていません)
//

(function(){

//設定 (☆星がついたものは変更可能です)
//設定はCookieによる保護をしています。
	var Cookies_Recipe ={
	// ☆ cookieの保管日数 ☆
		hokanbi : 14,
	// ☆ お知らせ音のURL/pass ☆
		load_Music : "https://dl.dropbox.com/u/7079101/coin.mp3",
	// ☆ お知らせ音のボリューム(0-100の範囲) ☆
		volume_Music : 60,
	// ☆ リロード時間 (サーバー保護のため60秒以上にしてください) ☆ 
		reload_Time : 60,
		
	//対象の掲示板のURL
		load_URL : "",
	//最後にリロードした時のレス番号
		Res_Last : 1,
	//最後にチェックした時のレス番号( Res_Last >= Res_Checked )
		Res_Checked : 1,
	};
	
//最新レス番号の取得用関数
	function load_ResNo(){
		var myNumber;
		var myNodes = document.getElementsByTagName('font');
		myString = new String();
		myString = myNodes[9].firstChild.nodeValue; 
				//9番目のfont直下が最新レスの番号に当たる
		if(!myString){
			myNumber = 0;
				//fontの最初の子ノードが文字列でなければ0を返す
		}
		else{
			myString = myString.replace( /\D/ , '' ); //数字以外を消す
			myNumber = parseInt(myString,10);
			if(!myNumber){
				myNumber = -1;
				//TEXTの形式が"No.XXXX"でなければ-1を返す
			}
		}
		return myNumber;
	}
	
//Cookieの書き込み用関数
	function makeCookie(MyCookies_Recipe){
		var expire = new Date();
		expire.setTime( expire.getTime() + MyCookies_Recipe.hokanbi * 1000 * 3600 * 24 );
		document.cookie = 'load_URL='+ MyCookies_Recipe.load_URL + '; expires=' + expire.toUTCString();
		document.cookie = 'Res_Last='+ MyCookies_Recipe.Res_Last + '; expires=' + expire.toUTCString();
		document.cookie = 'Res_Checked='+ MyCookies_Recipe.Res_Checked + '; expires=' + expire.toUTCString();
		document.cookie = 'load_Music='+ MyCookies_Recipe.load_Music + '; expires=' + expire.toUTCString();
		document.cookie = 'volume_Music='+ MyCookies_Recipe.volume_Music + '; expires=' + expire.toUTCString();
		document.cookie = 'reload_Time='+ MyCookies_Recipe.reload_Time + '; expires=' + expire.toUTCString();
		return 0;
	}
	
//Cookieの読み取り用関数
	function eatCookie(MyCookies_Recipe){
		var allcookies = document.cookie;
		if( allcookies != ''){
			var cookies = allcookies.split( ';' );
			for(var i = 0;i < cookies.length; i++){
				cookies[i] = cookies[i].replace( /=/ , ';' );  //最初の'='のみ置き換え
				cookies[i] = cookies[i].replace( / /gi , '' ); //空白は消す
				var cookie = cookies[i].split( ';' );          //もとが'='の部分で分割
				
				if(cookie[0] == "load_URL"){
					MyCookies_Recipe.load_URL = cookie[1];
				}else if(cookie[0] == "Res_Last"){
					MyCookies_Recipe.Res_Last = parseInt(cookie[1]);
				}else if(cookie[0] == "Res_Checked"){
					MyCookies_Recipe.Res_Checked = parseInt(cookie[1]);
				}else if(cookie[0] == "load_Music"){
					MyCookies_Recipe.load_Music = cookie[1];
				}else if(cookie[0] == "volume_Music"){
					MyCookies_Recipe.volume_Music = parseInt(cookie[1]);
				}else if(cookie[0] == "reload_Time"){
					MyCookies_Recipe.reload_Time = parseInt(cookie[1]);
				}
			}
		}
		return true;
	}
  
//レスチェック時の差分の判断関数
  function ResChecked_sabun(arg){
    if(arg == 0){
      document.getElementById("resInfoTxt").innerHTML = "おしらせ:現在未読はありません";
			return true;
    }else if(arg > 0){
      document.getElementById("resInfoTxt").innerHTML = "おしらせ:未読が" + arg + "件あります";
			return true;
    }else{
      document.getElementById("resInfoTxt").innerHTML = "おしらせ:ResCheckError";
			return false;
    }
  }
  
//レス確認のボタンを押した時(.resInfoBtn.onclick)
  function resetResChecked(MyCookies_Recipe){
    MyCookies_Recipe.Res_Checked = MyCookies_Recipe.Res_Last;
    ResChecked_sabun(0);
    makeCookie(MyCookies_Recipe);
		return true;
  }
    
//I/Oフォーム(上部追加分)のひな形用関数
  function IOForm_hinagata(MyCookies_Recipe){
    var IOFormHeaderCenter = document.createElement("center");
    
    var IOFormHeader = document.createElement("div");
    IOFormHeader.id = "IOFormHeader";
    
    var resInfo = document.createElement("div");
    resInfo.id = "resInfo";
    
    var resInfoBtn = document.createElement("input");
    resInfoBtn.id = "resInfoBtn";
    resInfoBtn.className = "SidebySide";
    resInfoBtn.type = "button";
    resInfoBtn.value = "確認";
    resInfoBtn.onclick = function(){resetResChecked(MyCookies_Recipe);};
    
    var resInfoTxt = document.createElement("div");
    resInfoTxt.id = "resInfoTxt";
    resInfoTxt.className = "SidebySide";
    
    document.body.insertBefore(IOFormHeaderCenter,document.body.firstChild);
    IOFormHeaderCenter.appendChild(IOFormHeader);
    IOFormHeader.appendChild(resInfo);
    resInfo.appendChild(resInfoTxt);
    resInfo.appendChild(resInfoBtn);
    return IOFormHeader;
  }
  
//リロード時の関数
	function funcExit(){
		window.stop();		//一旦読み込み中止してからでないと、次に上手く読み込まない?
		location.reload(true);	//キャッシュは破棄してリロード
	}
	
//CSS追加用関数
  function addGlobalStyle(css) {                         // Head部分にstyleを追加する関数
    var head, style;
    head = document.getElementsByTagName('head')[0];         // head要素を取る
    if (!head) { return }
    style = document.createElement('style');                 // 要素styleをつくる
    style.type = 'text/css';                                     // styleの属性typeを追加
    style.innerHTML = css;                                       // styleの属性として引数cssを追加
    head.appendChild(style);                                 // headの中に要素styleを追加する
  }
  
//追加CSS
  addGlobalStyle('.SidebySide {display : inline-block;font-size: small; }');
  
//本文
		//Cookieの取得(設定データ)
	eatCookie(Cookies_Recipe);
	
		//リロード時間はここで先に指定
	var Timer = setTimeout(funcExit,Cookies_Recipe.reload_Time * 1000);

		//事前に音声を取得
	var audio = new Audio(Cookies_Recipe.load_Music);
	audio.volume = Cookies_Recipe.volume_Music / 100.;

		//page内の最新レス番号を取得
	var Res_Now = load_ResNo();
	if(Res_Now == 0 || Res_Now == 1){
		alert("仕様変更?\n製作者に連絡ください\n(Res_Now = " + Res_Now + ")");
		return 0;
	}
	else{
			//ひな形の作成
		var IOForm = IOForm_hinagata(Cookies_Recipe);
    
			//URLに対応したCookieがなければ、新たに作る
		if(Cookies_Recipe.load_URL == location.href){
			if(Cookies_Recipe.Res_Last != Res_Now){
				audio.play();
				Cookies_Recipe.Res_Last = Res_Now;
			}
			ResChecked_sabun(Res_Now - Cookies_Recipe.Res_Checked);
		}else{
			Cookies_Recipe.load_URL = location.href;
			Cookies_Recipe.Res_Last = Res_Now;
			Cookies_Recipe.Res_Checked = Res_Now;
			ResChecked_sabun(Res_Now - Cookies_Recipe.Res_Checked);
		}
		makeCookie(Cookies_Recipe);
	}
  
})()
