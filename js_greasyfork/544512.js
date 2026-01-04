// ==UserScript==
// @name        ニコニコ静画 新着チェッカー
// @description ニコニコ静画の「イラスト定点観測」ページを上書きして、任意の条件によるイラスト検索の新着結果を取得する機能を組み込みます。指定ユーザー・指定イラストの除外機能つき。
// @namespace   https://greasyfork.org/ja/users/1189800-ggg-niya-to
// @version     1.2
// @include     https://seiga.nicovideo.jp/my/personalize*
// @include     https://seiga.nicovideo.jp/user/illust/*
// @include     https://seiga.nicovideo.jp/tag/*
// @include     https://seiga.nicovideo.jp/search/*
// @include     https://seiga.nicovideo.jp/seiga/*
// @compatible  firefox on PC / manager : Greasemonkey
// @compatible  edge on PC / manager : Tampermonkey
// @author      ggg.niya.to
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/544512/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E9%9D%99%E7%94%BB%20%E6%96%B0%E7%9D%80%E3%83%81%E3%82%A7%E3%83%83%E3%82%AB%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/544512/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E9%9D%99%E7%94%BB%20%E6%96%B0%E7%9D%80%E3%83%81%E3%82%A7%E3%83%83%E3%82%AB%E3%83%BC.meta.js
// ==/UserScript==

////////////////////////
// 更新メモ
////////////////////////
/*
2025/08/17 v1.2
	検索式に関するヒントを設置
	除外アイテムのスタイル記述ミスを修正
2025/08/03 v1.1.1
	文字列エスケープ処理のポカミスを修正
2025/08/03 v1.1
	春画廃止対応、全年齢サイト用スクリプトとして再公開
	除外リストでユーザー名をエスケープ処理していなかったのを修正
	タグのインポートが正常に動作しなくなっていたのを修正
	コード・スタイル記述を整理
*/

////////////////////////
// セキュリティ的なメモ
////////////////////////
/*
XMLHttpRequestを使用するページ、およびそこからアクセスする可能性のある対象
	https://seiga.nicovideo.jp/my/personalize*
		-> https://seiga.nicovideo.jp/user/illust/[user-id]
		-> https://seiga.nicovideo.jp/tag/[encoded query string]
		-> https://seiga.nicovideo.jp/search/[encoded query string]
		-> https://seiga.nicovideo.jp/api/illust/info
		-> https://seiga.nicovideo.jp/api/user/data
	https://seiga.nicovideo.jp/user/illust/*
		-> https://seiga.nicovideo.jp/api/user/info
	https://seiga.nicovideo.jp/seiga/*
		-> https://seiga.nicovideo.jp/api/illust/info
		-> https://seiga.nicovideo.jp/api/user/info

ページ内に埋め込む可能性のある画像のURL
	https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/*
		nicovide.jp のユーザーアイコン画像。seiga.nicovideo.jp 自体が使用しているもの。
	https://lohas.nicoseiga.jp/thumb/*
		ニコニコ静画のサムネイル画像。seiga.nicovideo.jp 自体が使用しているもの。

localStorageの使用：有
	"NSRC_" で始まるキーを使用
	クリーンアップ機能あり
*/

////////////////////////
// 汎用の作業関数群
////////////////////////
function apd(p,t,s,o){
	if(t){
		var e;
		if(t.match(/^(INPUT|text|button|radio|checkbox|file|hidden|submit)$/)){
			e=document.createElement("INPUT");
			if(t!="INPUT"){ e.type=t; }
			if(s){ e.value=s; }
		}
		else{
			e=document.createElement(t);
			if(t.match(/^(HR|BR)$/)){
				p.appendChild(e);
				return p;
			}
			if(s){
				if(t=="LABEL" && (s=="radio" || s=="checkbox") && o){
					t=apd(e,s);
					apd(e,null,o);
					p.appendChild(e);
					return t;
				}
				else if(t=="IMG"){ e.src=s; }
				else{ e.innerHTML=s; }
			}
		}
		return p.appendChild(e);
	}
	else{
		p.appendChild(document.createTextNode(s));
		return p;
	}
}
////////////////////////
function getStorageObject(key,ary){ try{ return JSON.parse(localStorage[key]); }catch(e){ return ary ? [] : {}; } }
function setStorageObject(key,obj){ localStorage[key]=JSON.stringify(obj); }
////////////////////////
function toHtml(s){ return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
////////////////////////
function throwEx(msg){ throw { message:msg }; }
////////////////////////
function d2d(d){ return d<10 ? "0"+d : d; }
////////////////////////
function addStyle(r){
	var e=document.createElement("STYLE");
	e.type="text/css";
	e.innerHTML=r;
	document.head.appendChild(e);
}

////////////////////////
// グローバル定数
////////////////////////
// localStorageのキー
const KEY_PFX="NSRC_";
const CHECKLIST_KEY    =KEY_PFX+"checkItemList";
const OMITTED_USERS_KEY=KEY_PFX+"omittedUsers";
const TEMP_OMITTED_KEY =KEY_PFX+"tempOmittedIllusts";
const FORWARD_ITEM_KEY =KEY_PFX+"forwardCheckItem";
// 検索用パラメータ
const SEARCH_PARAM="?sort=image_created";
// 最大表示数と最小列数
const ILLUST_DISPLAY_MAX=100,THUMB_COL_MIN=3;
// 除外キャッシュサイズの最小値・最大値・デフォルト
const OMTUSR_CACHE_MIN=10,OMTUSR_CACHE_MAX=1000,OMTUSR_CACHE_DEFAULT=40;
// ユーザーアイコンの場所
const USRICN_URL_BASE="https://secure-dcdn.cdn.nimg.jp/nicoaccount/usericon/";
// スタイルシート
const DIALOG_LABEL_PADDING=4;
const CTRL_HOVER_COLOR="#fea";

////////////////////////
// 処理関数群
////////////////////////
// スタートアップ
function startup(){
	if(startup.executed){ return; }
	startup.executed=true;
//
	if(location.pathname=="/my/personalize"){ checkRecents(); }
	else if(location.pathname.match("/((tag|search)/[^/]+|seiga/im\\d+|user/illust/\\d+)")){ ctrlRelatedPage(); }
}
addEventListener("load",startup);
setTimeout(startup,1000);
////////////////////////
// XHRラッパー
function loadResource(url,callback){
	var xhr=new XMLHttpRequest();
	if(callback){
		xhr.onloadend=function(){ callback(this.status,this.responseText); }
		xhr.open("GET",url);
		xhr.send();
	}
	else{
		xhr.open("GET",url,false);
		xhr.send();
		return { status:xhr.status, responseText:xhr.responseText };
	}
}
function createRequestor(api,parser){
	var url;
	function check(res){
		if(res.status!=200){
			console.log(url+" : "+res.status);
			return false;
		}
		return parser(res.responseText);
	}
	return function(id,callback){
		url=api+"?id="+id;
		if(callback){ loadResource(url,function(status,responseText){ callback(check({ status:status, responseText:responseText })); }); }
		else{ return check(loadResource(url)); }
	};
}
const getUserId=createRequestor("https://seiga.nicovideo.jp/api/illust/info",function(res){
	if(res=res.match(/<user_id>(\d+)<\/user_id>/)){ return res[1]; }
	return null;
});
const getUserName=createRequestor("https://seiga.nicovideo.jp/api/user/info",function(res){
	if(res=res.match(/<nickname>([^<]+)<\/nickname>/)){ return res[1]; }
	return null;
});
const getUserIllustList=createRequestor("https://seiga.nicovideo.jp/api/user/data",function(res){
	var data={ list:[] },t;
	if(t=res.match(/<image_count>(\d+)<\/image_count>/)){ data.total=parseInt(t[1]); }
	res.split("<image>").forEach((t,i)=>{
		if(i && (t=t.match(/<id>(\d+)<\/id>/))){ data.list.push(parseInt(t[1])); }
	});
	return data;
});
////////////////////////
function toUserPageUrl(uid){
	return "/user/illust/"+uid+SEARCH_PARAM;
}
////////////////////////
function isUserPageUrl(url){
	return !!url.match("/user/illust/\\d+");
}
////////////////////////
function createSubWindow(id){
	const CLASS="nsrc_sub_window";
	addStyle(
		 "."+CLASS+"{ box-sizing:border-box; border-radius:1em; border:none; background-color:#fff; padding:1em; text-align:center;"
		+"	&::backdrop{ background-color:rgba(0,0,0,50%); }"
		+"	&>H3{ margin:0; font-size:150%; line-height:1.5; }"
		+"	&>INPUT[type=button]{ min-width:10em; font-size:125%;"
		+"		&+INPUT[type=button]{ margin-left:1em; }"
		+"	}"
		+"	LABEL{ border-radius:4px; padding:"+DIALOG_LABEL_PADDING+"px; display:flex; align-items:center;"
		+"		&:hover{ background-color:"+CTRL_HOVER_COLOR+"; }"
		+"		&>INPUT[type=text],"
		+"		&>SELECT{ padding:2px; }"
		+"	}"
		+"}");
//
	return (createSubWindow=function(id){
		var e=apd(document.body,"DIALOG");
		if(id){ e.id=id; }
		e.className=CLASS;
		//
/* 枠外をクリックしたら閉じる的なボツ
		e.addEventListener("mousedown",function(event){
			if(event.button!=0 || event.target!=e){ return; }
			var x=event.clientX,y=event.clientY;
			if(x < e.offsetLeft || e.offsetLeft+e.clientWidth  < x
			|| y < e.offsetTop  || e.offsetTop +e.clientHeight < y){ e.close(); }
		});
*/
		//
		return Object.freeze({
			WIN:e,
			open:function(){
				if(!e.open){ e.showModal(); }
			},
			close:function(){
				if(e.open){ e.close(); }
			}
		});
	})(id);
}
////////////////////////
// 環境設定
const SP_TMBSIZE ="thumbSize";
const SP_DCNTMIN ="dispCountMin";
const SP_HIDECND ="hideCondition";
const SP_HIDENOUP="hideNoUpdate";
const SP_EASYOMIT="notConfirmOmitFromResult";
const SP_CHECKIDV="checkArtistIndividually";
//
const setting=(function(){
	const TMBSIZE_MIN=120,TMBSIZE_MAX=240,TMBSIZE_STEP=20;
	const DCNTMIN_MIN=THUMB_COL_MIN,DCNTMIN_MAX=ILLUST_DISPLAY_MAX;
//
	const KEY=KEY_PFX+"setting";
	const obj=getStorageObject(KEY);
//
	const DEFS={};
	function setup(key,def,min,max){
		var v=obj[key];
		obj[key] = max ? ( min<=v && v<=max ? v : def ) : v===!def ? v : def;
		DEFS[key]=def;
	}
	setup(SP_TMBSIZE ,180,TMBSIZE_MIN,TMBSIZE_MAX);
	setup(SP_DCNTMIN ,  8,DCNTMIN_MIN,DCNTMIN_MAX);
	setup(SP_HIDECND ,false);
	setup(SP_HIDENOUP,false);
	setup(SP_EASYOMIT,false);
	setup(SP_CHECKIDV,false);
	Object.freeze(DEFS);
//----------------------
	obj.edit=function(){
		const storages=(()=>{
			const BACKUP_SFX="Backup",	// デバッグ・テスト用
				list=[];
			return new (class{
				regist(key,temp){
					list.push({ key:key, temp:temp });
				}
				backup(){
					list.forEach((s)=>{
						if(!s.temp && localStorage[s.key]){ localStorage[s.key+BACKUP_SFX]=localStorage[s.key]; }
					});
				}
				restore(){
					list.forEach((s)=>{
						if(!s.temp && localStorage[s.key+BACKUP_SFX]){ localStorage[s.key]=localStorage[s.key+BACKUP_SFX]; }
					});
				}
				remove(){
					list.forEach((s)=>{ localStorage.removeItem(s.key); });
				}
			})();
		})();
		storages.regist(KEY);
		storages.regist(CHECKLIST_KEY);
		storages.regist(OMITTED_USERS_KEY);
		storages.regist(TEMP_OMITTED_KEY);
		storages.regist(FORWARD_ITEM_KEY,true);
//
		const params=(()=>{
			const list=[];
			return new (class{
				regist(key,input,output,needReload){
					list.push({ key:key, def:DEFS[key], input:input, output:output, needReload:needReload });
				}
				output(){
					list.forEach((p)=>{ p.output(obj[p.key]); });
				}
				reset(){
					list.forEach((p)=>{ p.output(p.def); });
				}
				save(){
					var change,needReload,p,i;
					for(i=0;p=list[i];i++){
						if((p.value=p.input())===null){ return false; }
						if(p.value!=obj[p.key]){
							change=true;
							if(p.needReload){ needReload=true; }
						}
					}
					if(change){
						list.forEach((p)=>{ obj[p.key]=p.value; });
						setStorageObject(KEY,obj);
						if(needReload){ alert("全ての設定を反映するにはページを再読み込みしてください。"); }
					}
					return true;
				}
			})();
		})();
//
		const adjuster=new (class{
			#list=[];
			regist(elm){
				this.#list.push(elm.parentNode);
			}
			get width(){
				var w=0;
				this.#list.forEach((e)=>{ if(w < (e=e.clientWidth)){ w=e; } });
				return w;
			}
		})();
//
		const SUB_ID="NSRC-SETTING",SUB=createSubWindow(SUB_ID);
		try{
			let DIVL,DIVH,t;
			apd(SUB.WIN,"H3","環境設定");
			apd(SUB.WIN,"HR");
			DIVL=apd(t=apd(SUB.WIN,"DIV"),"DIV");
			DIVH=apd(apd(t,"DIV"),"DIV");
			//
			function help(s){ apd(DIVL,"DIV","<P>"+s.replace(/\n/g,"</P><P>")+"</P>").className="nsrc_help"; }
			//
			let SEL_TS=apd(apd(apd(DIVL,"LABEL","<SPAN>サムネイルのサイズ：</SPAN>"),"SPAN"),"SELECT"),listS=[],listI={},s,i;
			for(s=TMBSIZE_MIN,i=0 ; s<=TMBSIZE_MAX ; s+=TMBSIZE_STEP,i++){
				apd(SEL_TS,"OPTION",s+"px");
				listS[i]=s;
				listI[s]=i;
			}
			help("イラストサムネイルのサイズを変更します。\nページの再読み込み後に有効になります。");
			params.regist(SP_TMBSIZE,()=>listS[SEL_TS.selectedIndex],(v)=>{ SEL_TS.selectedIndex=listI[v]; },true);
			adjuster.regist(SEL_TS);
			//
			let TXT_DC=apd(apd(apd(DIVL,"LABEL","<SPAN>最低表示枚数：</SPAN>"),"SPAN"),"text");
			TXT_DC.size=4;
			help("各項目ごとに、新着イラストの枚数がこの数に足りないぶん、既出画像で埋めます。最低 "+DCNTMIN_MIN+" 、最大 "+DCNTMIN_MAX+" です。");
			params.regist(SP_DCNTMIN,()=>{
				var v=parseInt(TXT_DC.value.replace(/[０-９]/g,(c)=>String.fromCharCode(c.charCodeAt(0)-"０".charCodeAt(0)+"0".charCodeAt(0))),10);
				if(DCNTMIN_MIN <= v && v <= DCNTMIN_MAX){ return v; }
				alert("最低表示枚数は "+DCNTMIN_MIN+" ～ "+DCNTMIN_MAX+" の範囲で指定してください。");
				TXT_DC.focus();
				return null;
			},(v)=>{ TXT_DC.value=v; });
			adjuster.regist(TXT_DC);
			//
			let CHK_HC=apd(DIVL,"LABEL","checkbox","検索条件を表示しない");
			help("検索条件（チェック対象ページへのリンク）を項目ヘッダに表示しません。\nページの再読み込み後に有効になります。");
			params.regist(SP_HIDECND,()=>CHK_HC.checked,(v)=>{ CHK_HC.checked=v; },true);
			//
			let CHK_HN=apd(DIVL,"LABEL","checkbox","新着がない結果を表示しない");
			help("新着イラストがなかったとき、その項目の結果（サムネイルリスト）を非表示にします（項目ヘッダは残ります）。\nページの再読み込み後に有効になります。");
			params.regist(SP_HIDENOUP,()=>CHK_HN.checked,(v)=>{ CHK_HN.checked=v; },true);
			//
			let CHK_EO=apd(DIVL,"LABEL","checkbox","結果からの除外を念押ししない");
			help("検索結果（サムネイルリスト）からイラストまたは作者を除外指定するとき、確認メッセージを表示しないようにします。");
			params.regist(SP_EASYOMIT,()=>CHK_EO.checked,(v)=>{ CHK_EO.checked=v; });
			//
			let CHK_CI=apd(DIVL,"LABEL","checkbox","一枚ごとに除外情報を取得する");
			help("通常は事前に除外対象ユーザーの投稿履歴を一度に取得して除外判定に使用しますが、この設定をオンにすると、発見したイラスト一枚ごとに投稿者情報を取得して除外判定します。\n"
				+"除外対象ユーザーが多く、チェックアイテムが少ないときは、処理効率が良くなる場合があります。また、「キャッシュ漏れ」が起きません。\n"
				+"チェックするイラストの総数が多いと、<SPAN>動作が遅くなる</SPAN>ほか、<SPAN>サーバーに負担をかける</SPAN>ことになるので、注意して使ってください。");
			params.regist(SP_CHECKIDV,()=>CHK_CI.checked,(v)=>{ CHK_CI.checked=v; });
			//
			let BTN_CT=apd(apd(DIVL,"LABEL"),"button","簡易除外を解除する");
			help("簡易除外しているイラストを全て指定解除します。");
			BTN_CT.onclick=function(){
				localStorage.removeItem(TEMP_OMITTED_KEY);
				alert("解除しました。再表示するには結果を更新してください。");
			};
			//
			let BTN_CS=apd(apd(DIVL,"LABEL"),"button","ストレージをクリアする");
			help("このスクリプトが使用しているブラウザの記憶領域（ローカルストレージのアイテム）を全て消去します。\n全ての設定を初期化したい場合や、このスクリプトをアンインストールする前などに使用してください。");
			BTN_CS.onclick=function(event){
				if(event.ctrlKey && event.altKey){ storages.restore(); }
				else{
					if(event.ctrlKey){
						if(!confirm("Ctrlキーを押しながらクリックしたため、バックアップモードが起動しました。間違って押した場合は「キャンセル」を押してください。\n\n"
							+"バックアップから復元するには、Alt＋Ctrlを押しながらクリックしてください。\n\n"
							+"このスクリプトはバックアップは削除しません。自分でストレージを編集できる人だけ使ってください。\n\n"
							+"よくわからないなら「キャンセル」を押してください。")){ return; }
						storages.backup();
					}
					else if(!confirm("記憶領域を完全に消去し、ページを再読み込みします。\n元に戻すことはできません。\n本当に実行してよいですか？")){ return; }
					storages.remove();
				}
				location.reload();
			};
			//
			apd(SUB.WIN,"HR");
			apd(SUB.WIN,"button","保存して終了").onclick=function(){
				if(params.save()){ SUB.close(); }
			};
			apd(SUB.WIN,"button","既定値に戻す").onclick=params.reset;
			apd(SUB.WIN,"button","キャンセル").onclick=SUB.close;
//
			addStyle(
				 "#"+SUB_ID+"{"
				+"	&>DIV{ display:flex; text-align:left;"
				+"		&>DIV:first-child{ position:relative; }"
				+"		&>DIV+DIV{ flex-grow:1; margin-left:.5em; position:relative;"
				+"			&>DIV{ position:absolute; left:0; right:0; top:.5em; bottom:0; border-radius:.5em; border:1px solid silver;"
				+"				&::before{ position:absolute; left:.5em; top:-.5em; background-color:#fff; padding:0 .5em; content:'説明'; }"
				+"			}"
				+"		}"
				+"	}"
				+"	LABEL{ line-height:2; white-space:nowrap;"
				+"		&>SPAN:first-child{ flex-grow:1; text-align:right; }"
				+"		&>SPAN+SPAN>*{ width:100%; }"
				+"		:is(SELECT,INPUT[type=text],INPUT[type=button]){ height:2em; }"
				+"		SELECT{ text-align:center; }"
				+"		INPUT[type=text]{ box-sizing:border-box; padding:2px; text-align:right; }"
				+"		INPUT[type=checkbox]{ margin:2px 4px 2px 0; }"
				+"		INPUT[type=button]{ flex-grow:1; }"
				+"	}"
				+"	DIV.nsrc_help{ position:absolute; left:calc(100% + 1em + 1px); top:calc(1.5em + 1px); background-color:#fff; line-height:1.5; display:none; }"
				+"	LABEL:hover+DIV.nsrc_help{ display:block; }"
				+"	DIV.nsrc_help>P+P{ margin-top:1em; }"
				+"	DIV.nsrc_help SPAN{ color:red; font-weight:bold; }"
				+"}");
			SUB.open();
			addStyle("#"+SUB_ID+" LABEL>SPAN+SPAN{ width:"+adjuster.width+"px; }");
			addStyle("#"+SUB_ID+" DIV.nsrc_help{ width:calc("+DIVH.clientWidth+"px - 1em); }");
		}catch(e){ alert(e.message); }
//
		(this.edit=function(){
			params.output();
			SUB.open();
		}).call(this);
	};
//----------------------
	return obj;
})();
////////////////////////
// 除外情報の取得と判定
function Omitted(){
	var today,users={},tmpsO={},tmpsN={},cache={},found,list,upd;
//
	function updateLast(uid){
		if(users[uid].last!=today){
			users[uid].last=today;
			upd=true;
		}
	}
//
	function load(flgUpdate){
		var date=new Date(),uid,max,num;
		today=d2d(date.getFullYear()%100)+"/"+d2d(date.getMonth()+1)+"/"+d2d(date.getDate());
		users=getStorageObject(OMITTED_USERS_KEY);
		tmpsO=getStorageObject(TEMP_OMITTED_KEY);
		tmpsN={};
		cache={};
		found={};
		list=[];
		for(num in tmpsO){ cache[num]=true; }
		for(uid in users){
			max=0;
			users[uid].list.forEach((n)=>{
				cache[n]=uid;
				if(max<n){ max=n; }
			});
			if(flgUpdate!==false && !setting[SP_CHECKIDV] && !users[uid].noUp){ list.push({ uid:uid, name:users[uid].name, max:max, add:0 }); }
			if(!(OMTUSR_CACHE_MIN<=(max=users[uid].max) && max<=OMTUSR_CACHE_MAX)){
				users[uid].max=OMTUSR_CACHE_DEFAULT;
				upd=true;
			}
		}
	}
//
	function save(){
		var uid,lp,max;
		for(uid in users){
			if((max=users[uid].max) < (lp=users[uid].list).length){
				lp.sort((a,b)=>b-a);
				lp.length=max;
			}
		}
		setStorageObject(OMITTED_USERS_KEY,users);
		upd=false;
	}
//
	function getInfo(data,progress,callback,flgReturnIllusts){
		var uid=data.uid,lp=users[uid].list,illusts,url,page,urlP;
		if(flgReturnIllusts){ illusts={}; }
		page=1;
		loadResource(urlP=url=toUserPageUrl(uid),read);
		//
		function updateTotal(total){
			if(users[uid].total!=total){
				users[uid].total=total;
				upd=true;
			}
		}
		//
		function addCache(num){
			if(num <= data.max){ throw {}; }
			if(cache[num]){ return; }
			cache[num]=uid;
			lp.push(num);
			if(flgReturnIllusts){ illusts[num]=true; }
			upd=true;
			if(users[uid].max <= ++data.add){ throw {}; }
		}
		//
		function read(status,res){
			try{
				if(status!=200){ throwEx("http-error : "+status); }
				//
				if(res.match(/ユーザーは存在しないか削除されている可能性があります/) && !users[uid].lost){
					users[uid].lost=true;
					upd=true;
				}
				//
				if(users[uid].lost){
					if(!(res=getUserIllustList(uid))){ throwEx("user-illust-info load error"); }
					updateTotal(res.total);
					res.list.forEach((n)=>{ addCache(n); });
					throw {};
				}
				//
				let t;
				if(page==1){
					t = (t=res.match(/<title>(.+) さんのイラスト一覧/)) ? t[1] : "[error]";
					if(users[uid].name != t){
						users[uid].name=t;
						upd=true;
					}
					updateTotal((t=res.match(/<span class="target_name[ "][^>]*>すべて<\/span>[^<]*<span class="count[ "][^>]*>(\d+)/)) ? parseInt(t[1]) : "[error]");
				}
				//
				if((t=res.split("<li class=\"list_item no_trim\">")).length < 2 || 41 < t.length){
					if(1<page || res.match(/登録されているイラストはありません。/)){
						throw {};
					}
					throwEx("list split error");
				}
				t.splice(0,1);
				t.forEach((s)=>{
					if(!(t=s.match("/seiga/im(\\d+)"))){ throwEx("item matching error\n"+s); }
					addCache(parseInt(t[1]));
				});
				//
				if(i<=40){ throw {}; }
				progress(++page);
				loadResource(urlP=url+"&page="+page,read);
			}catch(e){
				if(e.message){ console.log(urlP+" : "+e.message); }
				else if(users[uid].lost){ users[uid].noUp=true; }
				callback(illusts);
			}
		}
	}
//
	const obj=new (class{
		// load() -> check() -> save() の順で呼ぶこと
		load(progress,callback){
			if(!progress){
				load(false);
				callback();
				return;
			}
			load();
			let idx=0,data;
			function prog(p){ progress(list.length,idx,p); }
			function call(){
				if(data=list[idx++]){
					prog();
					getInfo(data,prog,call);
				}
				else{
					if(upd){ save(); }
					callback();
				}
			}
			call();
		}
		check(num){
			var uid;
			if(uid=cache[num]){
				if(uid===true){ tmpsN[num]=1; }
				else{ updateLast(uid); }
				return true;
			}
			else if(setting[SP_CHECKIDV]){
				if(!(uid=getUserId(num))){ console.log("im"+num+" : "+(uid===false ? "illust-info load error" : "user-id matching error")); }
				else if(users[uid]){
					updateLast(uid);
					found[num]=uid;
					upd=true;
					return true;
				}
			}
			return false;
		}
		save(flg){
			if(flg){ setStorageObject(TEMP_OMITTED_KEY,tmpsN); }
			if(!upd){ return; }
			let num,uid;
			for(num in found){
				cache[num]=uid=found[num];
				users[uid].list.push(num);
			}
			found={};
			save();
		}
		// 除外指定／解除用
		isOmittedUser(uid){
			load(false);
			return !!users[uid];
		}
		add(uid,name,progress,callback){
			var data={ uid:uid, name:name, max:0, add:0 };
			load(false);
			if(users[uid]){ users[uid].list=[]; }	// 念のため
			else{ users[uid]={ name:name, list:[], max:OMTUSR_CACHE_DEFAULT }; }
			function prog(p){ progress(1,1,p); }
			prog();
			getInfo(data,prog,function(illusts){
				save();
				callback(illusts);
			},true);
		}
		remove(uid){
			var temp=getStorageObject(OMITTED_USERS_KEY),illusts={};
			if(!temp[uid]){ return illusts; }	// 念のため
			temp[uid].list.forEach((n)=>{
				illusts[n]=true;
				delete cache[n];
			});
			delete temp[uid];
			setStorageObject(OMITTED_USERS_KEY,temp);
			return illusts;
		}
	})();
	return (Omitted=function(){ return obj; })();
}
////////////////////////
function omittedUserListEdit(){
	const ICON_SIZE=75,ITEM_SPACE=8,ITEM_PADDING=Math.floor(ITEM_SPACE/2)-1,
		MAX_ITEM_IN_LIST=Math.max(Math.floor(innerHeight/(ICON_SIZE+ITEM_SPACE))-2,1);
//
	const SUB=createSubWindow();
	apd(SUB.WIN,"H3","除外対象ユーザーリスト");
	apd(SUB.WIN,"HR");
	const DIVF=apd(SUB.WIN,"DIV"),FRAME_ID=DIVF.id="NSRC-OMIT-FRAME",
		DIVL=apd(DIVF,"DIV"),LIST_ID=DIVL.id="NSRC-OMIT-LIST";
	const BTNS=apd(apd(SUB.WIN,"HR"),"button","保存して終了");
//
	var omits,data;
	BTNS.onclick=function(){
		var uid,upd,cup,n;
		omits=getStorageObject(OMITTED_USERS_KEY);	// 念のため
		for(uid in data){
			if(data[uid].del){
				delete omits[uid];
				upd=true;
				continue;
			}
			if(!(OMTUSR_CACHE_MIN<=(n=parseInt(data[uid].cache.value,10)) && n<=OMTUSR_CACHE_MAX)){
				alert("キャッシュ上限は "+OMTUSR_CACHE_MIN+" 以上 "+OMTUSR_CACHE_MAX+" 以下で設定してください。");
				data[uid].cache.focus();
				return;
			}
			if(omits[uid].max != n){
				if(!(n < omits[uid].max)){
					omits[uid].list=[];
					delete omits[uid].noUp;
					cup=true;
				}
				omits[uid].max=n;
				upd=true;
			}
		}
		if(upd){
			if(cup){ alert("キャッシュ上限を増やしたため、該当の作者のキャッシュがクリアされました。\n次回の更新時に少し時間がかかることがあります。"); }
			setStorageObject(OMITTED_USERS_KEY,omits);
		}
		SUB.close();
	};
	apd(SUB.WIN,"button","キャンセル").onclick=SUB.close;
//
	SUB.open();
	addStyle(
		 "#"+FRAME_ID+"{ max-height:"+((ICON_SIZE+ITEM_SPACE)*MAX_ITEM_IN_LIST)+"px; }"
		+"#"+LIST_ID+"{ display:table; margin:1px 0; min-width:"+DIVF.clientWidth+"px;"
		+"	&>DIV{ display:table-row;"
		+"		&[nsrc-lost=true]{ background-color:#eee; }"
		+"		&:not(.nsrc_delete) .nsrc_ctrl>DIV{ margin-top:"+(ITEM_PADDING+1-DIALOG_LABEL_PADDING)+"px; border-top:1px solid silver; padding-top:"+(ITEM_PADDING+1)+"px; }"
		+"		&.nsrc_delete{"
		+"			&>*{ background-color:silver; }"
		+"			.nsrc_ctrl{ padding-right:"+ITEM_SPACE+"px; }"
		+"			:is(.nsrc_icon>IMG, .nsrc_info>:not(.nsrc_name), .nsrc_ctrl>LABEL){ display:none; }"
		+"		}"
		+"		&>*{ display:table-cell; padding:"+ITEM_PADDING+"px 0; vertical-align:middle; white-space:nowrap; }"
		+"		&+DIV>*{ border-top:groove 2px silver; }"
		+"	}"
		+"	&>SPAN{ display:block; box-sizing:border-box; margin:.5em 0; max-width:"+DIVF.clientWidth+"px;"
			+" border-radius:1em; border:1px solid silver; padding:1em; text-align:left; line-height:1.75; }"
		+"	A{ text-decoration:none; }"
		+"	.nsrc_icon{ width:"+ICON_SIZE+"px;"
		+"		&>IMG{ width:"+ICON_SIZE+"px; height:"+ICON_SIZE+"px; vertical-align:bottom; }"
		+"	}"
		+"	.nsrc_info{ min-width:"+ICON_SIZE*3+"px; max-width:"+ICON_SIZE*4+"px; padding-left:"+ITEM_SPACE+"px; padding-right:"+ITEM_SPACE+"px; text-align:left;"
		+"		&>*{ line-height:1; overflow:hidden; text-overflow:ellipsis; }"
		+"		&>.nsrc_name{ font-weight:bold; font-size:150%; line-height:1.75; }"
		+"		&>.nsrc_stat{ display:flex; justify-content:space-between; }"
		+"	}"
		+"	.nsrc_ctrl{ padding-left:"+ITEM_SPACE+"px; position:relative;"
		+"		&::before{ position:absolute; z-index:2000; left:-1px; width:2px; top:"+ITEM_PADDING+"px; bottom:"+ITEM_PADDING+"px; background-color:#ddd; content:''; }"
		+"		INPUT[type=text]{ width:3.5em; text-align:right; }"
		+"		INPUT[type=button]{ padding:0 1em; }"
		+"	}"
		+"}");
//
	function setDefaultImage(){
		if(!this.getAttribute("nsrc-default-image")){
			this.src=USRICN_URL_BASE+"defaults/blank.jpg";
			this.setAttribute("nsrc-default-image",true);
		}
	}
//
	function deleteItem(uid,btn){
		if(data[uid].del = data[uid].del===false ? true : false){
			data[uid].row.className="nsrc_delete";
			btn.value="削除を取り消す";
		}
		else{
			data[uid].row.className="";
			btn.value="リストから削除";
		}
	}
//
	(omittedUserListEdit=function(){
		var cnt=0,uid,obj,e1,e2;
		data={};
		DIVL.innerHTML="";
		omits=getStorageObject(OMITTED_USERS_KEY);
		for(uid in omits){
			obj=data[uid]={};
			(e1=apd(obj.row=apd(DIVL,"DIV"),"A")).className="nsrc_icon";
			(e2=apd(e1,"IMG")).onerror=setDefaultImage;
			e2.src=USRICN_URL_BASE+Math.floor(uid/10000)+"/"+uid+".jpg";
			(e2=apd(obj.row,"A")).className="nsrc_info";
			apd(e2,"DIV","ID ： "+uid+(omits[uid].lost?"（退会済）":""));
			apd(e2,"DIV",toHtml(omits[uid].name)).className="nsrc_name";
			apd(e2,"DIV","<SPAN>投稿枚数 ： "+(omits[uid].total ? omits[uid].total : "未取得")
				+"</SPAN>"+(omits[uid].last ? "<SPAN>&nbsp;｜&nbsp;最終検出 ： "+omits[uid].last+"</SPAN>" : "")).className="nsrc_stat";
			e1.href=e2.href=toUserPageUrl(uid);
			e1.target=e2.target="_blank";
			(e1=apd(obj.row,"DIV")).className="nsrc_ctrl";
			obj.cache=apd(e2=apd(e1,"LABEL","キャッシュ上限："),"text",0<omits[uid].max ? omits[uid].max : (omits[uid].max=OMTUSR_CACHE_DEFAULT));
			e2.title="その作者のイラストとして記憶する枚数の上限です。上限を超えると古い順にキャッシュから外されます。\n"
				+"最大 "+OMTUSR_CACHE_MAX+" 枚まで設定できますが、大きくしすぎると動作が遅くなることがあります。通常はせいぜい 120 枚くらいまでにしてください。";
			(e2=apd(apd(e1,"DIV"),"button")).onclick=(function(uid){ return function(){ deleteItem(uid,this); } })(uid);
			e2.click();
			cnt++;
			if(omits[uid].lost){ obj.row.setAttribute("nsrc-lost",true); }
		}
		if(cnt<=MAX_ITEM_IN_LIST){
			DIVF.style.paddingRight="0";
			DIVF.style.overflowY="auto";
		}
		else{
			DIVF.style.paddingRight=ITEM_SPACE+"px";
			DIVF.style.overflowY="scroll";
		}
		if(!cnt){
			BTNS.disabled=true;
			apd(DIVL,"SPAN","まだ除外対象ユーザーを登録していません。<BR>"
				+"除外指定するには、検索結果のイラスト右上に現れる「作者を除外」ボタンを押すか、除外したいユーザーの静画ページを開いて「除外対象に指定」ボタンを押してください。");
		}
		else{ BTNS.disabled=false; }
		SUB.open();
	})();
}
////////////////////////
// アイテム登録・変更インタフェース
function checkItemEdit(changeFunc,deleteFunc){
	const SUB_ID="NSRC-ITEM-EDIT",SUB=createSubWindow(SUB_ID),HDRC=apd(SUB.WIN,"H3");
	apd(SUB.WIN,"HR");
	const obj={};
	(obj.NAME=apd(apd(SUB.WIN,"LABEL",  "<SPAN>項目名：</SPAN>"),"text")).parentNode.title="チェックアイテムの項目名です。";
	let e=apd(SUB.WIN,"DIV");
	(obj.WORD=apd(apd(e,"LABEL","<SPAN>検索条件：</SPAN>"),"text")).parentNode.title=
		 "検索条件を指定してください。\n"
		+"通常はタグ検索の条件式として扱われます。\n"
		+"「search:（条件式）」と入力すると文字列検索になります（低速）。\n"
		+"「user:（ユーザーID）」と入力するとユーザー投稿をチェックします。\n"
		+"入力しない場合は項目名と同じになります（タグ検索）。";
	const HBTN=apd(e,"BUTTON"),HINT=apd(e,"DIV",("<DIV><H4>ニコニコ静画における検索条件式の仕様について</H4><HR><UL>"
		+"<LI>単語を半角スペースで区切ると、それぞれがAND条件となります。</LI>"
		+"<LI>単語の前に「-」を付けると、その単語が除外条件になります。</LI>"
		+"<LI>単語の間に半角スペースで区切って「OR」を置くと、左右の単語がOR条件になります（除外条件であるものを除く）。</LI>"
		+"<LI>AND条件が一つでもある場合、<STRONG>OR条件を全て無視して</STRONG>AND検索が行われます。</LI>"
		+"<LI>AND条件が一つもない場合のみ、OR条件によるOR検索になります。</LI>"
		+"<LI>除外条件は、AND/OR検索どちらでも同様に機能します。</LI>"
		+"</UL><HR>"
		+"<DIV class=\"note\">ORの扱いがかなり<DEL>クｓ</DEL>独特なので注意してください</DIV>"
		+"<DIV class=\"note\">この仕様は 2025/08/17 時点のものです</DIV></DIV>").replace(/(AND|OR|除外)条件/g,m=>"<SPAN>"+m+"</SPAN>"));
	HBTN.id="HINT";
	HBTN.onclick=()=>{ HBTN.className = HBTN.className=="close" ? "open" : "close"; };
//
	Object.freeze(obj);
	obj.NAME.placeholder="例）アニメとゲーム";
	obj.WORD.placeholder="例）アニメ OR ゲーム";
	apd(SUB.WIN,"HR");
	const BTNS=apd(SUB.WIN,"button","この内容で保存する");
	const BTND=apd(SUB.WIN,"button","この項目を削除する");
	const BTNC=apd(SUB.WIN,"button","キャンセル");
	BTNC.onclick=obj.close=SUB.close;
//
	obj.NAME.onkeypress=obj.WORD.onkeypress=function(event){
		if(event.keyCode==13){ BTNS.click(); }
	};
//
	addStyle(
		 "#"+SUB_ID+"{ overflow:visible;"
		+"	&>DIV{ display:flex; align-items:center;"
		+"		&>LABEL{ flex-grow:1; }"
		+"	}"
		+"	LABEL{"
		+"		&>SPAN{ width:5em; text-align:right; }"
		+"		&>INPUT{ flex-grow:1; }"
		+"	}"
		+"	#HINT{ margin:4px 4px 4px 0; width:1.5em; height:1.5em; display:flex; justify-content:center; align-items:center; position:relative;"
		+"		&::before{ content:'？'; }"
		+"		&+DIV{ display:none; }"
		+"		&.open{"
		+"			&::before{ content:'×'; }"
		+"			&::after,&+DIV{ position:absolute; }"
		+"			&::after{ content:''; width:3em; height:3em; left:calc(100% + 1em); rotate:45deg; background-color:silver; }"
		+"			&+DIV{ display:block; left:calc(100% + .5em); top:0; box-sizing:border-box; width:max-content; max-width:100%; min-height:100%;"
			+" border-radius:.5em; border:.5em solid silver; background-color:#fff; padding:.5em; text-align:left; line-height:1.5;"
		+"				H4{ font-size:125%; }"
		+"				LI{ margin:.5em 0 .5em 1.5em; list-style-type:disc; }"
		+"				SPAN{ font-weight:bold; }"
		+"				STRONG{ text-decoration:underline; color:red; }"
		+"				.note{ text-align:right;"
		+"					&::before{ content:'※'; margin-right:.5em; }"
		+"				}"
		+"			}"
		+"		}"
		+"	}"
		+"}");
	SUB.open();
	addStyle("#"+SUB_ID+"{ min-width:"+SUB.WIN.clientWidth+"px; }");
//
	return (checkItemEdit=function(saveFunc,deleteFunc){
		BTNS.onclick=function(){
			if(saveFunc()){ SUB.close(); }
		};
		if(deleteFunc){
			HDRC.innerHTML="チェックアイテムの編集";
			BTND.onclick=function(){
				if(deleteFunc()){ SUB.close(); }
			};
			BTND.style.display="initial";
		}
		else{
			HDRC.innerHTML="チェックアイテムの追加";
			BTND.style.display="none";
		}
		HBTN.className="close";
		SUB.open();
		return obj;
	})(changeFunc,deleteFunc);
}
////////////////////////
function createContextMenu(list){
	const CLASS="nsrc_context_menu";
	addStyle(
		 "."+CLASS+"{ position:absolute; left:-1px; top:-1px; z-index:1000; margin-left:0 !important;"
			+" border:1px solid silver; background-color:#fea; font-size:120%; text-align:left;"
		+"	&>SPAN{ display:block; padding:0 .5em; cursor:default;"
		+"		&:hover{ background-color:#fc8; }"
		+"		&+SPAN{ border-top:1px solid #cc6; }"
		+"	}"
		+"}");
//
	return (createContextMenu=function(list){
		const DIV=document.createElement("DIV"),MENU=[];
		var parent,callback,mom;
		DIV.className=CLASS;
		list.forEach((t,i)=>{
			(MENU[i]=apd(DIV,"SPAN",t.caption)).title=t.hint;
			MENU[i].onclick=()=>{
				callback(i);
				close();
			};
			MENU[i].oncontextmenu=close;
		});
		function close(){
			if(parent){
				parent.removeChild(DIV);
				parent=null;
			}
			return false;
		}
		DIV.onmouseover=function(){ mom=true; };
		DIV.onmouseout=function(){
			mom=false;
			setTimeout(function(){
				if(!mom){ close(); }
			},10);
		};
		return function(_parent,_callback,option){
			if(parent!=_parent){
				if(parent){ parent.removeChild(DIV); }
				(parent=_parent).appendChild(DIV);
			}
			callback=_callback;
			if(option){
				option.forEach((f,i)=>{ MENU[i].style.display = f ? "block" : "none"; });
			}
		};
	})(list);
}
////////////////////////
function generalOption(parent,callback,option){
	(generalOption=createContextMenu([
		{ caption:"除外情報も更新",
			hint:"除外対象ユーザーのイラスト情報を更新してから全項目のリストを更新します。" },
		{ caption:"元のページ内容を表示",
			hint:"イラスト定点観測ページ本来の内容を表示します。" },
		{ caption:"元のページ内容を隠す",
			hint:"イラスト定点観測ページ本来の内容を隠します。" },
		]))(parent,callback,option);
}
////////////////////////
function updateOption(parent,callback,option){
	const T0="除外情報も更新",
			H0="除外対象ユーザーのイラスト情報を更新してからリストを更新します。",
		T1="新着を再チェック（除外情報更新＋取得履歴復元）",
			H1="除外情報を更新し、取得履歴を前回の値に戻して新着チェックをやりなおします。\n大量投稿者を除外指定した後などに使用してください。",
		T2="完全再取得（除外情報更新＋取得履歴消去）",
			H2="除外情報を更新し、取得履歴を消去してこの項目を取得しなおします。\n項目を新規登録した時と同じです。",
		T3=T1.replace("除外情報更新＋",""),
			H3=H1.replace("除外情報を更新し、",""),
		T4=T2.replace("除外情報更新＋",""),
			H4=H2.replace("除外情報を更新し、","");
	(updateOption=createContextMenu([
		{ caption:T0, hint:H0 },
		{ caption:T1, hint:H1 },
		{ caption:T2, hint:H2 },
		{ caption:T3, hint:H3 },
		{ caption:T4, hint:H4 },
		]))(parent,callback,option);
}
////////////////////////
// メイン関数
function checkRecents(){
	const DIVO=document.getElementById("my_personalize");
	if(!DIVO){ alert("#my_personalize not found"); return; }
	DIVO.style.display="none";
	//
	const HDRT=document.querySelector("H2.my_contents_title");
	if(!HDRT){ alert("H2.my_contents_title not found"); return; }
	const TITLE_ID=HDRT.id="NSRC-TITLE";
	HDRT.innerHTML="";
	//
	const GTTL=apd(HDRT,"SPAN"),
		DIVP=apd(DIVO.parentNode,"DIV"),WRAP_ID  =DIVP.id="NSRC-WRAP",
		DIVC=apd(DIVP,"DIV")           ,CTRL_ID  =DIVC.id="NSRC-CTRL",
		DIVN=apd(DIVC,"DIV")           ,NOTICE_ID=DIVN.id="NSRC-NOTICE",
		DIVB=apd(DIVC,"DIV");
	const BTNA=apd(DIVB,"button","アイテムの追加"); BTNA.title="新しいチェックアイテムを追加します。";
	const BTNO=apd(DIVB,"button","除外設定"      ); BTNO.title="除外対象ユーザーの設定を管理します。";
	const BTNS=apd(DIVB,"button","環境設定"      ); BTNS.title="環境設定をデフォルトから変更します。";
	BTNA.onclick=function(){
		const UI=checkItemEdit(function(){
			if(checkInput(UI.NAME,UI.WORD)){ return false; }
			return addItem(UI.NAME.value,UI.WORD.value);
		});
		UI.NAME.value=UI.WORD.value="";
	};
	BTNO.onclick=function(){ omittedUserListEdit(); };
	BTNS.onclick=function(){ setting.edit(); };
	const DIVL=apd(apd(DIVP,"HR"),"DIV"),LIST_ID=DIVL.id="NSRC-LIST";
//
	const THUMB_SIZE=setting[SP_TMBSIZE];
	addStyle(
// 元設定の変更
		 "HTML{ scroll-behavior:smooth; }"
		+"DIV#main{ width:auto; padding:0 .5em; }"
		+"DIV#my_main{ display:flex; }"
		+"DIV#my_main_r{ flex-grow:1; }"
// 全体レイアウト
		+"#"+TITLE_ID+"{ padding:0; font-size:100%; position:relative; }"
		+"#"+WRAP_ID+"{"
		+"	HR{ margin:1em 0; }"
		+"	INPUT[type=button]{ padding:0 8px;"
		+"		&+INPUT[type=button]{ margin-left:.5em; }"
		+"	}"
		+"}"
		+"#"+CTRL_ID+"{ display:flex; align-items:center;"
		+"	&>*{ white-space:nowrap;"
		+"		&+*{ margin-left:1em; border-left:2px groove silver; padding-left:1em; }"
		+"	}"
		+"}"
		+"#"+NOTICE_ID+"{ flex-grow:1; padding-left:1em; overflow:hidden; text-overflow:ellipsis; }"
	// 更新ボタン共通
		+"#"+TITLE_ID+">SPAN{ display:inline-block; padding:0 12px; font-size:18px; cursor:default; }"
		+":is(#"+TITLE_ID+",#"+LIST_ID+" H3)>SPAN{"
		+"	&.nsrc_standby{ cursor:default;"
		+"		&:hover{ background-color:"+CTRL_HOVER_COLOR+"; }"
		+"	}"
		+"	&.nsrc_wait{ cursor:wait; }"
		+"}"
// 一覧レイアウト
		+"#"+LIST_ID+"{"
	// 初期枠
		+"	&>SPAN{ display:inline-block; margin:1em; border-radius:.5em; border:2px solid silver; padding:1em; }"
	// 項目ブロック
		+"	&>DIV{ margin-bottom:.5em; border-bottom:2px groove silver; background-color:#fff; padding-bottom:.5em; position:relative; }"
	// 項目ヘッダー
		+"	H3{ margin-bottom:4px; border-bottom:1px solid gray; border-left:6px solid #fa0; padding-right:4px;"
			+" white-space:nowrap; display:flex; align-items:center; position:relative; transition:all .5s;"
		+"		&.nsrc_new{ background-color:#fdd; }"
		+"		&>*{ display:inline-block; line-height:2; white-space:nowrap;"
		+"			&+*{ margin-left:.5em; }"
		+"		}"
		+"		&>:first-child{ padding:0 .5em; font-size:120%; }"
		+"		&>A{ "+(setting[SP_HIDECND] ? "display:none;" : "font-size:75%; overflow:hidden; text-overflow:ellipsis;")
		+"			&::before{ content:'（'; }"
		+"			&::after { content:'）'; }"
		+"		}"
		+"		&>.nsrc_notice{ flex-grow:1;"
		+"			&::before{ content:'['; }"
		+"			&::after { content:']'; }"
		+"		}"
		+"		&>.nsrc_button{ margin-top:1px; border-radius:4px; border:1px solid gray; background-color:#ddd; text-align:center; cursor:default;"
		+"			&:hover{ background-color:#ccc; }"
		+"		}"
		+"		&>.nsrc_restore{ padding:0 .5em; }"
		+(setting[SP_HIDENOUP] ? "		&:not(.nsrc_new)+.nsrc_result{ display:none; }" : "")
		+"	}"
	// サムネイルリスト
		+"	.nsrc_result{ position:relative; min-height:"+(THUMB_SIZE+2)+"px; overflow:clip; transition:min-height .5s;"
	// サムネリストオプションパーツ
		+"		&>:is(SPAN,DIV){ position:absolute; left:0; top:0; width:100%; height:100%; display:flex; align-items:center; }"
		+"		&>SPAN{ justify-content:left;"
		+"			&::before{ display:block; margin-left:1em; border-radius:1em; border:1px solid silver; padding:1em 0; width:calc(162px - 2em); text-align:center; content:'該当なし'; }"
		+"			&.nsrc_failure::before{ content:'取得失敗'; }"
		+"		}"
		+"		&>DIV{ background-color:#888; opacity:75%; justify-content:center; cursor:wait;"
		+"			&::before{ display:block; border-radius:1.5em; background-color:#fff; padding:1em; font-size:200%; content:'… 更新中 …'; }"
		+"		}"
	// サムネイル
		// 本体
		+"		&>A{ display:inline-block; width:"+THUMB_SIZE+"px; height:"+THUMB_SIZE+"px; border:1px solid silver; background:center/contain no-repeat;"
			+" position:relative; overflow:clip; transition:all .5s; }"
		// 新着表示
		+"		&>[nsrc-new],"
		+"		&>[nsrc-new]>SPAN{ border-color:red; }"
		+"		&>[nsrc-new]::before{ position:absolute; right:-1px; bottom:-1px; display:block; background-color:red; padding:2px 4px; color:white; content:'new'; }"
		// 除外時のボーダー色とカーソル
		+"		&>:is(.nsrc_useromit, .nsrc_tempomit),"
		+"		&>:is(.nsrc_tempomit, .nsrc_useromit)>SPAN{ border-color:#000 !important; }"
		+"		&>:is(.nsrc_useromit, .nsrc_tempomit){ cursor:default; }"
		// オプションパーツ共通
		+"		&>A>SPAN{ position:absolute; top:0; opacity:0; transition:opacity .5s; content:''; }"
		// 除外ボタン共通
		+"		&>A>:is(.nsrc_tempomit_button, .nsrc_useromit_button){ z-index:1; display:block; border-width:1px; border-color:silver;"
			+" padding:0 .5em; line-height:2; white-space:nowrap; color:#000; cursor:default;"
		+"			&:hover{ opacity:1; }"
		+"		}"
		+"		:is(.nsrc_useromit>.nsrc_tempomit_button, .nsrc_tempomit>.nsrc_useromit_button){ display:none; }"
		// 除外ボタン相違
		+"		&>A>.nsrc_tempomit_button{  left:0; border-radius:0 0 8px 0; border-style:none solid solid none; background-color:#ffa; }"
		+"		&>A>.nsrc_useromit_button{ right:0; border-radius:0 0 0 8px; border-style:none none solid solid; background-color:#fcc; }"
		+"		&>.nsrc_tempomit>.nsrc_tempomit_button{ background-color:#cdf; }"
		+"		&>.nsrc_useromit>.nsrc_useromit_button{ background-color:#9f9; }"
		// マスク
		+"		&>A>.nsrc_tmbmask{ left:0; width:100%; height:100%; background-color:#000; display:flex;  justify-content:center; align-items:center; }"
		+"		&>A>:is(.nsrc_tempomit_button, .nsrc_useromit_button):hover~.nsrc_tmbmask{ opacity:.25; }"
		+"		&>:is(.nsrc_useromit, .nsrc_tempomit)>.nsrc_tmbmask{ opacity:1 !important; background-color:rgba(0,0,0,50%);"
		+"			&::before{ display:block; width:75%; border-radius:1.5em; background-color:rgba(255,255,255,75%);"
			+" font-size:120%; line-height:3; text-align:center; color:#000; content:'除外中'; }"
		+"		}"
		+"	}"
	// 削除予定アイテム
		+"	&>DIV.nsrc_delete{"
		+"		&>H3{ border-color:gray; background-color:silver; }"
		+"		.nsrc_edit{ display:none; }"
		+"		.nsrc_result{ min-height:0; }"
		+"		.nsrc_result>A{ height:0; border-width:0 1px; visibility:hidden; }"
		+"	}"
		+"	&>DIV:not(.nsrc_delete) .nsrc_restore{ display:none; }"
		+"}");
//
	const lock=(function(){
		var locked;
		return function(flg){
			if(flg===true || flg===false){
				BTNA.disabled=
				BTNO.disabled=
				BTNS.disabled=locked=flg;
			}
			return locked;
		};
	})();
//
	const items=[];
	getStorageObject(CHECKLIST_KEY,true).forEach((d)=>{
		if(!d.del){ items.push(d); }
	});
	function save(){ setStorageObject(CHECKLIST_KEY,items); }
//
	const omitted=Omitted();
	function progressOmit(len,num,page){ DIVN.innerHTML="除外情報を更新中 … "+num+"/"+len+(page?" "+page+"ページ目":""); }
//
	let newAll,cbtFst=null;
	const ctrlGrobalTitle=(function(){
		var switchState=false;
		function updateAll(){
			DIVN.innerHTML="新着情報を更新中 …";
			newAll={ items:[], count:items.length, found:0 };
			items.forEach((d)=>{ d.update(); });
		}
		GTTL.onclick=function(){
			if(switchState){ return; }
			if(items.length==0){ alert("チェックアイテムがありません。"); }
			else if(lock()){ alert("更新中のため実行できません。"); }
			else{ omitted.load(setting[SP_CHECKIDV] ? progressOmit : null,updateAll); }
		};
		GTTL.oncontextmenu=function(event){
			if(event.ctrlKey){ return; }
			if(!lock()){
				generalOption(GTTL.parentNode,function(index,state){
					if(index){
						switchState=(index==1);
						DIVO.style.display = switchState ? "block" : "none" ;
						DIVP.style.display = switchState ? "none"  : "block";
						ctrlGrobalTitle();
					}
					else{
						if(items.length==0){ alert("チェックアイテムがありません。"); }
						else{ omitted.load(progressOmit,updateAll); }
					}
				},[!switchState && !setting[SP_CHECKIDV],!switchState,switchState]);
			}
			return false;
		};
		function func(){
			if(lock()){
				GTTL.title="";
				GTTL.className="nsrc_wait";
			}
			else{
				GTTL.innerHTML = switchState ? "イラスト定点観測" : "イラスト新着チェック";
				GTTL.title=(switchState?"":"クリックで全チェックアイテム項目を更新。\n")+"右クリックでオプションを表示。";
				GTTL.className="nsrc_standby";
			}
		}
		func();
		return func;
	})();
//
	lock(true);
	omitted.load(progressOmit,function(){
		if(items.length){ init(); }
		else{
			DIVN.innerHTML="";
			let e=apd(DIVL,"SPAN","チェックアイテムを追加してください。操作できる場所にマウスカーソルを合わせると簡単な説明が表示されます。");
			(e=apd(apd(e,"HR"),"button","観測タグをインポートする")).title="元の定点観測ページからフォロー中のタグをインポートします。";
			e.onclick=function(){
				try{
					var temp=[],check={},l,t,a,i;
					if(!(l=document.getElementById("tag_block"))){ throwEx("#tag_block not found"); }
					Array.from(l.getElementsByTagName("A")).forEach((a)=>{
						if(a.className!="tag" || !a.href || !(t=a.href.match("/tag/([^/]+)$")) || check[t=decodeURIComponent(t[1])]){ return; }
						temp.push({ name:t, word:t, last:0 });
						check[t]=true;
					});
					if(temp.length){
						if(100 < temp.length && !confirm("非常に多くのタグ（"+temp.length+"個）をインポートしようとしています。\n"
							+"イラスト数が膨大になり、処理に時間がかかるかもしれません。\n本当に実行してよいですか？")){ return; }
						temp.forEach((d)=>{ items.push(d); });
						save();
						DIVL.innerHTML="";
						lock(true);
						init();
					}
					else{ alert("観測タグが見つかりません"); }
				}catch(e){ alert(e.message); }
			};
			lock(false);
		}
	});
//
	function init(){
		DIVN.innerHTML="新着情報を取得中 …";
		newAll={ items:[], count:items.length, found:0 };
		for(let i=0;i<items.length;i++){ createItem(i); }
	}
//
	function toCndUrl(word){
		var t;
		return (t=word.match(/^user:(\d+)$/)) ? toUserPageUrl(t[1])
			: ( (t=word.match(/^search:(.+)$/)) ? "https://seiga.nicovideo.jp/search/"+encodeURIComponent(t[1])
			                                    : "https://seiga.nicovideo.jp/tag/"   +encodeURIComponent(word) )+SEARCH_PARAM;
	}
//
	function createItem(idx){
		const CHECKITEM_ID="NSRC-CHECKITEM";
		var item=items[idx],url=toCndUrl(item.word),urlP,rewind;
		//
		const BLK=DIVL.insertBefore(document.createElement("DIV"),DIVL.firstChild),HDR=apd(BLK,"H3");
		HDR.id=CHECKITEM_ID+idx;
		const TTL=apd(HDR,"SPAN",toHtml(item.name));
		TTL.onclick=function(){
			if(lock()){ alert("更新中のため実行できません。"); }
			else{ item.update(setting[SP_CHECKIDV] ? 0 : -1); }
		};
		TTL.oncontextmenu=function(event){
			if(event.ctrlKey){ return; }
			if(!lock()){
				var flg=setting[SP_CHECKIDV];
				updateOption(TTL.parentNode,function(index){
					item.update(index==3 ? 1 : index==4 ? 2 : index);
				},[!flg,!flg,!flg,flg,flg]);
			}
			return false;
		};
		const CND=apd(HDR,"A",toHtml(item.word));
		CND.href=url;
		CND.target="_blank";
		const NTC=apd(HDR,"SPAN");
		NTC.className="nsrc_notice";
		addEditBtn(item,HDR,TTL,CND);
		addMoveBtn(item,HDR,true );
		addMoveBtn(item,HDR,false);
		if(cbtFst){
			addStyle("#"+LIST_ID+" H3>SPAN.nsrc_button{ min-width:"+cbtFst.clientHeight+"px; }");
			cbtFst=false;
		}
		const RES=apd(BLK,"DIV");
		RES.className="nsrc_result";
		start();
		//
		item.update=function(mode){
			if(item.del){
				if(newAll){
					newAll.items[idx]=0;
					--newAll.count;
				}
				return;
			}
			lock(true);
			omitted.load(0<=mode ? progressOmit : null,function(){
				if(mode==1){ item.last=rewind; }else if(mode==2){ item.last=0; }
				url=toCndUrl(item.word);
				DIVN.innerHTML="項目の再取得中 …";
				start();
			});
		};
		//
		function start(){
			ctrlGrobalTitle();
			TTL.title="";
			TTL.className="nsrc_wait";
			NTC.innerHTML="読込中…";
			apd(RES,"DIV");
			loadRecents(url,rewind=item.last,(p)=>{ NTC.innerHTML="読込中…"+p+"ページ目"; },finish);
		}
		function finish(result){
			if(result.message){
				NTC.innerText="エラー : "+result.message;
				RES.innerHTML="<SPAN class=\"nsrc_failure\"></SPAN>";
				if(newAll){ newAll.error=true; }
			}
			else{
				if(result.list.length){
					let tmb,num;
					RES.innerHTML="";
					result.list.forEach((d)=>{
						tmb=thumb(RES,d);
						if(item.last < (num=d.illustId)){
							tmb.setAttribute("nsrc-new","");
							if(newAll && !newAll[num]){
								newAll[num]=true;
								newAll.found++;
							}
						}
					});
					if(result.newCount){
						item.last=result.list[0].illustId;
						save();
					}
				}
				else{ RES.innerHTML="<SPAN></SPAN>"; }
				NTC.parentNode.className = result.newCount ? "nsrc_new" : "";
				NTC.innerHTML="新着："+(result.newCount ? result.newCount+"枚"+(result.newCount==ILLUST_DISPLAY_MAX?"まで表示":"") : "なし");
			}
			if(newAll){
				newAll.items[idx]=result.newCount;
				if(--newAll.count==0){
					if(newAll.found){
						let s="";
						newAll.items.forEach((c,i)=>{
							if(c){ s="<A href=\"#"+CHECKITEM_ID+i+"\">"+toHtml(items[i].name)+"</A>"+(s?"／"+s:""); }
						});
						DIVN.innerHTML="新着："+newAll.found+"枚（"+s+"）";
					}
					else{ DIVN.innerHTML="新着：なし"; }
					if(newAll.error){ DIVN.innerHTML+="（エラーあり）"; }
					newAll=null;
					omitted.save(true);
					lock(false);
					ctrlGrobalTitle();
				}
			}
			else{
				DIVN.innerHTML = result.message ? "エラー" : "完了";
				omitted.save();
				lock(false);
				ctrlGrobalTitle();
			}
			TTL.title="クリックで更新。\n右クリックでオプションを表示。";
			TTL.className="nsrc_standby";
		}
	}
//
	function loadRecents(url,last,progress,callback){
		const ISUSER=isUserPageUrl(url),DC_MIN=setting[SP_DCNTMIN],result={ newCount:0 },list=[];
		var page=1,urlP,unit,numC,numL=0,title,cnt=0,t,m,i;
		loadResource(urlP=url,load);
		//
		function load(status,res){
			try{
				if(status!=200){ throwEx("http-error : "+status); }
				//
				if(     2 <= (t=res.split("<li class=\"list_item list_no_trim2\">")).length && t.length <=41){ unit=40; }
				else if(2 <= (t=res.split("<li class=\"list_item no_trim\">"      )).length && t.length <=41){ unit=40; }
				else if(2 <= (t=res.split("<div class=\"illust_list_img \">"      )).length && t.length <=21){ unit=20; }
				else{
					if(1<page
					|| res.match(/登録されているイラストはありません|を含むイラストは見つかりませんでした/)){ throw {}; }
					if(res.match(/ユーザーは存在しないか削除されている可能性があります/)){ throwEx("ユーザーがいません"); }
					throwEx("list split error");
				}
				//
				for(res=t,i=1;t=res[i];i++){
					if(!(m=t.match("(/seiga/im(\\d+)).+(https://lohas\\.nicoseiga\\.jp//?thumb/(\\d+))"))){ throwEx("item matching error\n"+t); }
					numC=parseInt(m[2]);
					if((numL && numL <= numC) || (!ISUSER && omitted.check(numC))){ continue; }
					if(numC <= last && DC_MIN<=cnt){ throw {}; }
					if((title=t.match("<a href=\"/seiga/im"+numC+"\\?[^\"]+\">([^<]+)"))
					|| (title=t.match(/<li class="title">([^<]+)/))){
						if((title=title[1]).match("^[ 　"+String.fromCharCode(10240)+"]*$")){ title="[空題]"; }
					}
					else{ title="[error]"; }
					list[cnt++]={ illustId:numC, thumbId:m[4], title:title };
					if(last < numC){ result.newCount++; }
					else if(DC_MIN <= cnt){ throw {}; }
					if(ILLUST_DISPLAY_MAX <= cnt){ throw {}; }
					numL=numC;
				}
				if(i<=unit){ throw {}; }
				progress(++page);
				loadResource(urlP=url+"&page="+page,load);
			}catch(e){
				if(e.message){
					console.log(urlP+" : "+e.message);
					result.message=e.message;
				}
				else{ result.list=list; }
				callback(result);
			}
		}
	}
//
	function moveToItem(id){
		var e=document.getElementById(id).parentNode;
		scrollTo(0,e.getBoundingClientRect().top+pageYOffset-Math.max((innerHeight-e.clientHeight)/2,48));
	}
//
	DIVN.addEventListener("click",function(event){
		try{
			var h=event.target.href.match("#(.+)$");
			location.hash=h[0];
			moveToItem(h[1]);
			event.preventDefault();
		}catch(e){}
	});
//
	function checkWordLen(word){
		var len=0,idx;
		for(idx=word.indexOf("search:")==0?7:0;idx<word.length;idx++){ len += word.charCodeAt(idx)<=0x80 ? 1 : 2; }	// 簡易測定
		return 255 < len;	// 255バイトまでしか受け取らないっぽい
	}
//
	function checkInput(iptn,iptw){
		if(!iptn.value){
			alert("項目名を指定してください。");
			iptn.focus();
			return true;
		}
		if(!iptw.value){ iptw.value=iptn.value; }
		if(checkWordLen(iptw.value)){ alert("検索文字列が長すぎるかもしれません。\nうまくいかない場合は短くしてください。"); }
		return false;
	}
//
	function checkSameItem(name,word,idx){
		for(let t,i=0;t=items[i];i++){
			if(t.word==word && i!==idx){
				alert("同じ検索条件が既に存在します。");
				return true;
			}
		}
		return false;
	}
//
	function getIndex(item){
		for(let t,i=0;t=items[i];i++){
			if(t==item){ return i; }
		}
		alert("データの照合に失敗しました。ページをリロードしてからもう一度試してください。");
		return -1;
	}
//
	function addItem(name,word){
		var idx;
		if(checkSameItem(name,word)){ return false; }
		items[idx=items.length]={ name:name, word:word, last:0 };
		save();
		if(idx==0){ DIVL.innerHTML=""; }
		createItem(idx);
		return true;
	}
//
	function editItem(item,blk,ttl,cnd){
		if(lock()){ return; }
		const UI=checkItemEdit(function(){
			if(checkInput(UI.NAME,UI.WORD)){ return false; }
			var name=UI.NAME.value,word=UI.WORD.value,idx,flg;
			if(item.name==name
			&& item.word==word){ return true; }
			if((idx=getIndex(item)) < 0 || checkSameItem(name,word,idx)){ return false; }
			if(name!=item.name){ ttl.innerText=item.name=name; }
			if(word!=item.word){
				cnd.innerText=item.word=word;
				cnd.href=toCndUrl(word);
				item.last=0;
				flg=true;
			}
			save();
			if(flg && confirm("検索条件が変更されました。今すぐ再取得しますか？")){
				if(lock()){ alert("更新中のため実行できません。"); }
				else{ item.update(); }
			}
			return true;
		},function(){
			if(lock()){ alert("更新中のため実行できません。"); return false; }
			item.del=true;
			save();
			blk.className="nsrc_delete";
			ttl.inert=true;
			return true;
		});
		UI.NAME.value=item.name;
		UI.WORD.value=item.word;
	}
	function addEditBtn(item,blk,ttl,cnd){
		const BTNE=apd(blk,"SPAN","編"),BTNR=apd(blk,"SPAN","削除を取り消す");
		blk=blk.parentNode;
		//
		BTNE.title="この項目の内容を変更したり、削除したりします。";
		BTNE.className="nsrc_button nsrc_edit";
		BTNE.onclick=function(){ editItem(item,blk,ttl,cnd); }
		if(cbtFst===null){ cbtFst=BTNE; }
		//
		BTNR.title="このボタンを押さずにページを再読み込みすると、完全に削除されます。";
		BTNR.className="nsrc_button nsrc_restore";
		BTNR.onclick=function(){
			delete item.del;
			save();
			blk.className="";
			ttl.inert=false;
		};
	}
//
	function moveItem(item,blk,flgUp,id){
		var idx,tmp,swp;
		if(lock() || (idx=getIndex(item)) < 0){ return; }
		if((flgUp && idx==items.length-1) || (!flgUp && idx==0)){ return; }
		if(flgUp){
			tmp=items[idx+1];
			items[idx+1]=item;
			items[idx]=tmp;
			swp=tmp=blk.previousSibling;
		}
		else{
			tmp=items[idx-1];
			items[idx-1]=item;
			items[idx]=tmp;
			tmp=(swp=blk.nextSibling).nextSibling;
		}
		blk.parentNode.insertBefore(blk.parentNode.removeChild(blk),tmp);
		save();
		//
		blk.style.transition=
		swp.style.transition="top 0s";
		moveToItem(id);
		blk.style.top=(flgUp ?  swp.clientHeight : -swp.clientHeight)+"px";
		swp.style.top=(flgUp ? -blk.clientHeight :  blk.clientHeight)+"px";
		setTimeout(function(){
			blk.style.transition=
			swp.style.transition="top .25s";
			blk.style.top=
			swp.style.top="0";
		},1);
	}
	function addMoveBtn(item,blk,flgUp){
		const BTN=apd(blk,"SPAN",flgUp ? "↑" : "↓"),ID=blk.id;
		blk=blk.parentNode;
		BTN.title="この項目を1つ"+(flgUp ? "上" : "下")+"へ移動します。";
		BTN.className="nsrc_button";
		BTN.onclick=function(){ moveItem(item,blk,flgUp,ID); }
	}
//
	const TEMPOMIT_TEXT="簡易除外",TEMPOMIT_HINT="このイラストが新着から流れるまで除外します。",
		USEROMIT_TEXT="作者を除外",USEROMIT_HINT="このイラストの作者を除外対象に指定します。",
		UNOMIT_TEXT="除外を解除",UNOMIT_HINT="除外指定を解除します。";
	function thumb(blk,data){
		var a=apd(blk,"A"),s;
		a.href="/seiga/im"+data.illustId;
		a.target="_blank";
		a.style.backgroundImage="url(https://lohas.nicoseiga.jp/thumb/"+data.thumbId+(180<THUMB_SIZE?"m":"u")+")";
		a.title=data.title;
		(s=apd(a,"SPAN",TEMPOMIT_TEXT)).className="nsrc_tempomit_button"; s.title=TEMPOMIT_HINT;
		(s=apd(a,"SPAN",USEROMIT_TEXT)).className="nsrc_useromit_button"; s.title=USEROMIT_HINT;
		apd(a,"SPAN").className="nsrc_tmbmask";
		return a;
	}
	DIVL.addEventListener("click",function(event){
		var elm=event.target,prt,n;
		if(elm.className=="nsrc_tmbmask"){ elm=elm.parentNode; }
		if(elm.tagName=="A" && (elm.className=="nsrc_tempomit" || elm.className=="nsrc_useromit")){
			event.preventDefault();
			return;
		}
		if(elm.tagName=="SPAN" && (n=(prt=elm.parentNode).href) && (n=n.match(/\/im(\d+)$/))){
			n=n[1];
			event.preventDefault();
			if(lock()){ alert("少し待ってください。"); return; }
			const MODE = prt.className=="nsrc_tempomit" ? 0
			           : prt.className=="nsrc_useromit" ? 2
			           : elm.className=="nsrc_tempomit_button" ? 1 : 3;
			if(MODE%2 && !setting[SP_EASYOMIT] && !confirm("除外"+(MODE==3?"指定":"")+"してよいですか？")){ return; }
			lock(true);
			function unlock(){ setTimeout(function(){ lock(false); },500); }
			//
			if(MODE<2){
				const setState=function(a,flg){
					a.className = flg ? "nsrc_tempomit" : "";
					a=a.querySelector(".nsrc_tempomit_button");
					a.innerHTML = flg ? UNOMIT_TEXT : TEMPOMIT_TEXT;
					a.title     = flg ? UNOMIT_HINT : TEMPOMIT_HINT;
				};
				const omits=getStorageObject(TEMP_OMITTED_KEY);
				if(MODE){ omits[n]=1; }
				else{ delete omits[n]; }
				setStorageObject(TEMP_OMITTED_KEY,omits);
				setState(prt,MODE);
				unlock();
			}
			else{
				getUserId(n,function(uid){
					const setState=function(a,flg){
						a.className = flg ? "nsrc_useromit" : "";
						a=a.querySelector(".nsrc_useromit_button");
						a.innerHTML = flg ? UNOMIT_TEXT : USEROMIT_TEXT;
						a.title     = flg ? UNOMIT_HINT : USEROMIT_HINT;
					},setStateAll=function(illusts,flg){
						Array.from(DIVL.getElementsByTagName("A")).forEach((a)=>{
							if((n=a.href) && (n=n.match(/\/im(\d+)$/)) && illusts[n[1]]){ setState(a,flg); }
						});
					};
					try{
						if(!uid){
							console.log(uid===false ? "illust-info load error" : "user-id matching error");
							throwEx("ユーザーIDの取得に失敗しました。\n時間を置いてからもう一度試してください。");
						}
						if(MODE==3){
							if(omitted.isOmittedUser(uid)){
								setState(prt,true);
								throw {};
							}
							let name;
							if(!(name=getUserName(uid))){
								console.log(name===false ? "user-info load error" : "user-name matching error");
								name="(ID:"+uid+")";
							}
							omitted.add(uid,name,progressOmit,function(illusts){
								try{
									setStateAll(illusts,true);
									setState(prt,true);	// 念のため
									DIVN.innerHTML="完了";
								}catch(e){ DIVN.innerHTML="エラー："+e.message; }
								unlock();
							});
							return;
						}
						else{
							if(omitted.isOmittedUser(uid)){ setStateAll(omitted.remove(uid),false); }
							setState(prt,false);
						}
					}catch(e){
						if(e.message){ alert(e.message); }
					}
					unlock();
					return;
				});
			}
		}
	});
//
	addEventListener("storage",function(storage){
		if(storage.storageArea==localStorage && storage.key==FORWARD_ITEM_KEY){
			var add=getStorageObject(FORWARD_ITEM_KEY);
			if(!add.name || !add.word){ return; }
			localStorage.removeItem(FORWARD_ITEM_KEY);
			addItem(add.name,add.word);
		}
	});
}
////////////////////////
function ctrlRelatedPage(){
	try{
		var ELMP,flgS,flgL,tag,uid,name,word,iid,t,i;
		if(tag=location.pathname.match("^/tag/([^/]+)")){
			name=tag=decodeURIComponent(tag[1]);
			if(!(ELMP=document.getElementById("ko_tagwatch"))){ throwEx("#ko_tagwatch not found"); }
			(ELMP=ELMP.firstElementChild).style.display="flex";
			ELMP.style.alignItems="center";
			let b=ELMP.insertBefore(document.createElement("DIV"),ELMP.firstChild);
			while(t=b.nextSibling){
				ELMP.removeChild(t);
				if(t.className=="list_header_nav" && t.firstElementChild.className!="favorite message_target"){ continue; }
				b.appendChild(t);
			}
		}
		else if(iid=location.pathname.match("^/seiga/im(\\d+)")){
			if(!(ELMP=document.getElementById("ko_watchlist_header"))){ throwEx("#ko_watchlist_header not found"); }
			if(uid=ELMP.getAttribute("data-id")){
				if(!(t=ELMP.querySelector(".user_name>STRONG"))){ throwEx(".user_name>STRONG not found"); }
				name=t.innerText;
			}
			else{	// 退会したユーザーのイラスト
				if(!(uid=getUserId(iid[1]))){
					console.log(uid===false ? "illust-info load error" : "user-id matching error");
					return;
				}
				if(!(name=getUserName(uid))){
					console.log(name===false ? "user-info load error" : "user-name matching error");
					return;
				}
				flgL=true;
			}
			flgS=true;
		}
		else if(uid=location.pathname.match("^/user/illust/(\\d+)")){ uid=uid[1]; }
		else if(word=location.pathname.match("^/search/([^/]+)")){ name=word=decodeURIComponent(word[1]); }
		else{ throwEx("pathname matching error"); }
//
		var items=getStorageObject(CHECKLIST_KEY,true);
		word = tag ? tag : uid ? "user:"+uid : "search:"+word;
		for(i=0;t=items[i];i++){
			if(t.word==word){ return; }
		}
//
		var ELMA;
		if(tag || flgS){ ; }
		else if(uid){
			if(name=document.title.match(/^(.+) さんのイラスト一覧/)){
				name=name[1];
				let selector="LI.message_target.favorite";
				if(!(ELMP=document.querySelector(selector))){ throwEx(selector+" not found"); }
			}
			else if(document.body.innerHTML.match(/ユーザーは存在しないか削除されている可能性があります/)){
				if((name=getUserName(uid))===false){
					console.log(name===false ? "user-info load error" : "user-name matching error");
					name="(ID:"+uid+")";
				}
				if(!(ELMP=document.querySelector("DIV.error-wrapper"))){
					console.log("DIV.error-wrapper not found");
					return;
				}
				flgL=true;
			}
			else{ throwEx("nickname matching error"); }
		}
		else{
			if(!(ELMP=document.getElementById("usearch_form_input"))){ throwEx("#usearch_form_input not found"); }
			ELMP.style.position="relative";
		}
		const ACTION_BUTTONS_ID=(ELMA=apd(ELMP,"DIV")).id="NSRC-ACTION-BUTTONS";
		if(24 < name.length){ name=name.substring(0,20)+" ..."; }
//
		var BTNC,BTNO,omitted = uid ? Omitted() : null;
		if(!flgL){
			(BTNC=apd(ELMA,"SPAN","観測対象に追加")).title="この"+(uid?"ユーザー":tag?"タグ":"検索文字列")+"を新着チェックの観測対象に追加します。";
			BTNC.onclick=function(){
				var item={ name:name, word:word, last:0 };
				// 念のため最新情報を詳細確認
				for(items=getStorageObject(CHECKLIST_KEY),i=0;t=items[i];i++){
					if(t.word==item.word){
						alert("すでに同じ検索条件の項目があります。");
						return;
					}
				}
				// localStorageに放り込み、別タブで受け取ったかどうか確認
				BTNC.onclick=null;
				BTNC.innerHTML="… 登録中 …";
				setStorageObject(FORWARD_ITEM_KEY,item);
				var itv=500,retry=1;
				setTimeout(function check(){
					if(localStorage[FORWARD_ITEM_KEY]){
						if(0 < retry--){ setTimeout(check,itv); return; }
						// 拾われてなければ自前で登録する
						localStorage.removeItem(FORWARD_ITEM_KEY);
						items.push(item);
						setStorageObject(CHECKLIST_KEY,items);
					}
					if(uid && omitted.isOmittedUser(uid)){ omitted.remove(uid); }	// 念のため
					alert("登録が完了しました。\n解除・編集は新着チェックページで行ってください。");
					ELMA.style.display="none";
				},itv);
			};
		}
		//
		if(uid){
			((BTNO=apd(ELMA,"SPAN")).onclick=function(e){
				var flg=omitted.isOmittedUser(uid);
				function finish(){
					BTNO.innerHTML = flg ? "除外指定を解除" : "除外対象に指定";
					BTNO.title="このユーザーを新着チェックでの除外対象"+(flg ? "から外します。" : "に指定します。");
					BTNO.setAttribute("nsrc-omitted",flg);
					if(BTNC){ BTNC.style.visibility = flg ? "hidden" : "visible"; }
				}
				if(e){
					if(flg=!flg){
						omitted.add(uid,name,()=>{ BTNO.innerHTML="… 登録中 …"; },finish);
						return;
					}
					else{ omitted.remove(uid); }
				}
				finish();
			})();
		}
//
		const BTN_HEIGHT=2.6;
		addStyle(
			 "#"+ACTION_BUTTONS_ID+"{ "
				+( flgS ? (!flgL ? "padding-top:.5em; text-align:center;" : "text-align:right;")
				 : flgL ? "margin-top:24px;"
				 : uid  ? "display:inline-block; margin-left:2em;"
				 : tag  ? "margin-left:2em;"
				 :        "position:absolute; right:1em; top:-.5em;")
				+" white-space:nowrap;"
			+"	&>SPAN{ display:inline-block; font-size:125%; width:7em; border-radius:"+BTN_HEIGHT/2+"em; border:1px solid silver; box-shadow:2px 2px 2px #ddd;"
				+" background:linear-gradient(to bottom,#fea,#fc6); padding:0 1em; line-height:"+BTN_HEIGHT+"; text-align:center; cursor:pointer;"
			+"		&+SPAN{ margin-left:1em; }"
			+"		&[nsrc-omitted]{ background:linear-gradient(to bottom,#fcc,#f88); }"
			+"		&[nsrc-omitted=true]{ background:linear-gradient(to bottom,#bfb,#7f7); }"
			+"	}"
			+"}");
	}catch(e){ alert(e.message); }
}

////////////////////////
// 検討中案件のメモ
////////////////////////
/*
	全項目の統合カタログモード（本来の定点観測ライク）
		需要があるのか謎。
	AND・OR複合条件式の独自処理
		構文解析は面倒くさい。折衷案：複数の検索条件をユーザーが入力できるようにして結果を統合。
	alert/confirmのオーバーロード
		FireFoxでは組み込みのままで特に不便は感じない。
		Edgeユーザーがあの位置に慣れてるなら動かすと却ってマズい。そのうち真ん中になってるかもしれない。
	複数のユーザーをまとめて観測
		需要があるのか謎。
*/
