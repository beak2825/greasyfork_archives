// ==UserScript==
// @name        ニコニコ静画 新着チェッカー（旧版）
// @description ニコニコ静画の「イラスト定点観測」ページを上書きして、任意の条件によるイラスト検索の新着結果を取得する機能を組み込みます。指定ユーザー・指定イラストの除外機能つき。
// @namespace   https://greasyfork.org/ja/users/1189800-ggg-niya-to
// @version     1.0
// @include     https://seiga.nicovideo.jp/my/personalize*
// @include     https://seiga.nicovideo.jp/user/illust/*
// @include     https://seiga.nicovideo.jp/tag/*
// @include     https://seiga.nicovideo.jp/search/*
// @include     https://seiga.nicovideo.jp/seiga/*
// @compatible  firefox on PC / manager : Greasemonkey
// @compatible  edge on PC / manager : Tampermonkey
// @author      ggg.niya.to
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/477431/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E9%9D%99%E7%94%BB%20%E6%96%B0%E7%9D%80%E3%83%81%E3%82%A7%E3%83%83%E3%82%AB%E3%83%BC%EF%BC%88%E6%97%A7%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/477431/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E9%9D%99%E7%94%BB%20%E6%96%B0%E7%9D%80%E3%83%81%E3%82%A7%E3%83%83%E3%82%AB%E3%83%BC%EF%BC%88%E6%97%A7%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

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
		if(t.match(/^(INPUT|text|button|radio|checkbox|hidden|submit)$/)){
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
const SORT_CREATED="sort=image_created",CODES=Object.freeze([
	Object.freeze({ name:"一般", code:SORT_CREATED }),
	Object.freeze({ name:"春画", code:SORT_CREATED+"&target=shunga" }),
	Object.freeze({ name:"全て", code:SORT_CREATED+"&target=illust_all" })]);
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
	var data={ list:[] },t,i;
	if(t=res.match(/<image_count>(\d+)<\/image_count>/)){ data.total=parseInt(t[1]); }
	for(res=res.split("<image>"),i=1;t=res[i];i++){
		if(t=t.match(/<id>(\d+)<\/id>/)){ data.list[data.list.length]=parseInt(t[1]); }
	}
	return data;
});
////////////////////////
function toUserPageUrl(uid,code){
	return "https://seiga.nicovideo.jp/user/illust/"+uid+"?"+CODES[code].code;
}
////////////////////////
function isUserPageUrl(url){
	return !!url.match("/user/illust/\\d+");
}
////////////////////////
function createSubWindow(id){
	addStyle(
		 ".nsrc_sub_window{ box-sizing:border-box; border-radius:1em; border:none; background-color:#fff; padding:1em; text-align:center; }"
		+".nsrc_sub_window::backdrop{ background-color:rgba(0,0,0,50%); }"
		+".nsrc_sub_window>H3{ margin:0; font-size:150%; line-height:1.5; }"
		+".nsrc_sub_window>INPUT[type=button]{ min-width:10em; font-size:125%; }"
		+".nsrc_sub_window>INPUT[type=button]+INPUT[type=button]{ margin-left:1em; }"
		+".nsrc_sub_window LABEL{ border-radius:4px; padding:"+DIALOG_LABEL_PADDING+"px; display:flex; align-items:center; }"
		+".nsrc_sub_window LABEL:hover{ background-color:"+CTRL_HOVER_COLOR+"; }"
		+".nsrc_sub_window LABEL>INPUT[type=text],"
		+".nsrc_sub_window LABEL>SELECT{ padding:2px; }");
//
	return (createSubWindow=function(id){
		var e=apd(document.body,"DIALOG");
		if(id){ e.id=id; }
		e.className="nsrc_sub_window";
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
const SP_DEFCODE ="defaultCode";
const SP_TMBSIZE ="thumbSize";
const SP_DCNTMIN ="dispCountMin";
const SP_HIDECND ="hideCondition";
const SP_HIDENOUP="hideNoUpdate";
const SP_EASYOMIT="notConfirmOmitFromResult";
const SP_CHECKIDV="checkArtistIndividually";
//
const setting=(function(){
	const TMBSIZE_MIN=120,TMBSIZE_MAX=240;
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
	setup(SP_DEFCODE ,  0,0,2);
	setup(SP_TMBSIZE ,180,TMBSIZE_MIN,TMBSIZE_MAX);
	setup(SP_DCNTMIN ,  8,DCNTMIN_MIN,DCNTMIN_MAX);
	setup(SP_HIDECND ,false);
	setup(SP_HIDENOUP,false);
	setup(SP_EASYOMIT,false);
	setup(SP_CHECKIDV,false);
	Object.freeze(DEFS);
//----------------------
	obj.edit=function(){
		const storages=new (class{
			#BACKUP_SFX="Backup";	// デバッグ・テスト用
			#list=[];
			regist(key,temp){
				this.#list[this.#list.length]={ key:key, temp:temp };
			}
			backup(){
				this.#list.forEach((s)=>{
					if(!s.temp && localStorage[s.key]){ localStorage[s.key+this.#BACKUP_SFX]=localStorage[s.key]; }
				});
			}
			restore(){
				this.#list.forEach((s)=>{
					if(!s.temp && localStorage[s.key+this.#BACKUP_SFX]){ localStorage[s.key]=localStorage[s.key+this.#BACKUP_SFX]; }
				});
			}
			remove(){
				this.#list.forEach((s)=>{ localStorage.removeItem(s.key); });
			}
		})();
		storages.regist(KEY);
		storages.regist(CHECKLIST_KEY);
		storages.regist(OMITTED_USERS_KEY);
		storages.regist(TEMP_OMITTED_KEY);
		storages.regist(FORWARD_ITEM_KEY,true);
//
		const params=new (class{
			#list=[];
			regist(key,input,output,needReload){
				this.#list[this.#list.length]={ key:key, def:DEFS[key], input:input, output:output, needReload:needReload };
			}
			output(){
				this.#list.forEach((p)=>{ p.output(obj[p.key]); });
			}
			reset(){
				this.#list.forEach((p)=>{ p.output(p.def); });
			}
			save(){
				var change,needReload,p,i;
				for(i=0;p=this.#list[i];i++){
					if((p.value=p.input())===null){ return false; }
					if(p.value!=obj[p.key]){
						change=true;
						if(p.needReload){ needReload=true; }
					}
				}
				if(change){
					this.#list.forEach((p)=>{ obj[p.key]=p.value; });
					setStorageObject(KEY,obj);
					if(needReload){ alert("全ての設定を反映するにはページを再読み込みしてください。"); }
				}
				return true;
			}
		})();
//
		const adjuster=new (class{
			#list=[];
			regist(elm){
				this.#list[this.#list.length]=elm.parentNode;
			}
			get width(){
				var w=0;
				this.#list.forEach((e)=>{ if(w < (e=e.clientWidth)){ w=e; } });
				return w;
			}
		})();
//
		const SUB=createSubWindow("NSRC-SETTING");
		try{
			let DIVL,DIVH,t;
			apd(SUB.WIN,"H3","環境設定");
			apd(SUB.WIN,"HR");
			DIVL=apd(t=apd(SUB.WIN,"DIV"),"DIV");
			DIVH=apd(apd(t,"DIV"),"DIV");
			//
			function help(s){ apd(DIVL,"DIV","<P>"+s.replace(/\n/g,"</P><P>")+"</P>").className="nsrc_help"; }
			//
			let SEL_DC=apd(apd(apd(DIVL,"LABEL","<SPAN>検索範囲の初期値：</SPAN>"),"SPAN"),"SELECT");
			CODES.forEach((c)=>{ apd(SEL_DC,"OPTION",c.name); });
			help("新しいチェックアイテム項目を追加するときの初期値です。");
			params.regist(SP_DEFCODE,()=>SEL_DC.selectedIndex,(v)=>{ SEL_DC.selectedIndex=v; });
			adjuster.regist(SEL_DC);
			//
			let SEL_TS=apd(apd(apd(DIVL,"LABEL","<SPAN>サムネイルのサイズ：</SPAN>"),"SPAN"),"SELECT"),listS=[],listI={},s,i;
			for(s=TMBSIZE_MIN,i=0 ; s<=TMBSIZE_MAX ; s+=20,i++){
				apd(SEL_TS,"OPTION",s+"px");
				listS[i]=s;
				listI[s]=i;
			}
			help("イラストサムネイルのサイズを変更します。\nページの再読み込み後に有効になります。");
			params.regist(SP_TMBSIZE,()=>listS[SEL_TS.selectedIndex],(v)=>{ SEL_TS.selectedIndex=listI[v]; },true);
			adjuster.regist(SEL_TS);
			//
			let TXT_MC=apd(apd(apd(DIVL,"LABEL","<SPAN>最低表示枚数：</SPAN>"),"SPAN"),"text");
			TXT_MC.size=4;
			help("各項目ごとに、新着イラストの枚数がこの数に足りないぶん、既出画像で埋めます。最低 "+DCNTMIN_MIN+" 、最大 "+DCNTMIN_MAX+" です。");
			params.regist(SP_DCNTMIN,()=>{
				var v=parseInt(TXT_MC.value,10);
				if(DCNTMIN_MIN <= v && v <= DCNTMIN_MAX){ return v; }
				alert("最低表示枚数は "+DCNTMIN_MIN+" ～ "+DCNTMIN_MAX+" の範囲で指定してください。");
				TXT_MC.focus();
				return null;
			},(v)=>{ TXT_MC.value=v; });
			adjuster.regist(TXT_MC);
			//
			let CHK_NL=apd(DIVL,"LABEL","checkbox","検索条件を表示しない");
			help("検索条件（チェック対象ページへのリンク）を項目ヘッダに表示しません。\nページの再読み込み後に有効になります。");
			params.regist(SP_HIDECND,()=>CHK_NL.checked,(v)=>{ CHK_NL.checked=v; },true);
			//
			let CHK_NU=apd(DIVL,"LABEL","checkbox","新着がない結果を表示しない");
			help("新着イラストがなかったとき、その項目の結果（サムネイルリスト）を非表示にします（項目ヘッダは残ります）。\nページの再読み込み後に有効になります。");
			params.regist(SP_HIDENOUP,()=>CHK_NU.checked,(v)=>{ CHK_NU.checked=v; },true);
			//
			let CHK_EO=apd(DIVL,"LABEL","checkbox","結果からの除外を念押ししない");
			help("検索結果（サムネイルリスト）からイラストまたは作者を除外指定するとき、確認メッセージを表示しないようにします。");
			params.regist(SP_EASYOMIT,()=>CHK_EO.checked,(v)=>{ CHK_EO.checked=v; });
			//
			let CHK_OI=apd(DIVL,"LABEL","checkbox","一枚ごとに除外情報を取得する");
			help("通常は事前に除外対象ユーザーの投稿履歴を一度に取得して除外判定に使用しますが、この設定をオンにすると、発見したイラスト一枚ごとに投稿者情報を取得して除外判定します。\n"
				+"除外対象ユーザーが多く、チェックアイテムが少ないときは、処理効率が良くなる場合があります。また、「キャッシュ漏れ」が起きません。\n"
				+"チェックするイラストの総数が多いと、<SPAN>動作が遅くなる</SPAN>ほか、<SPAN>サーバーに負担をかける</SPAN>ことになるので、注意して使ってください。");
			params.regist(SP_CHECKIDV,()=>CHK_OI.checked,(v)=>{ CHK_OI.checked=v; });
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
			apd(SUB.WIN,"button","既定値に戻す").onclick=function(){ params.reset(); };
			apd(SUB.WIN,"button","キャンセル").onclick=SUB.close;
//
			addStyle(
				 "#NSRC-SETTING>DIV{ display:flex; text-align:left; }"
				+"#NSRC-SETTING>DIV>DIV:first-child{ position:relative; }"
				+"#NSRC-SETTING>DIV>DIV+DIV{ flex-grow:1; margin-left:.5em; position:relative; }"
				+"#NSRC-SETTING>DIV>DIV+DIV>DIV{ position:absolute; left:0; right:0; top:.5em; bottom:0; border-radius:.5em; border:1px solid silver; }"
				+"#NSRC-SETTING>DIV>DIV+DIV>DIV:before{ position:absolute; left:.5em; top:-.5em; background-color:#fff; padding:0 .5em; content:'説明'; }"
				+"#NSRC-SETTING LABEL{ line-height:2; white-space:nowrap; }"
				+"#NSRC-SETTING LABEL>SPAN:first-child{ flex-grow:1; text-align:right; }"
				+"#NSRC-SETTING LABEL>SPAN+SPAN>*{ width:100%; }"
				+"#NSRC-SETTING LABEL :is(SELECT,INPUT[type=text],INPUT[type=button]){ height:2em; }"
				+"#NSRC-SETTING LABEL SELECT{ text-align:center; }"
				+"#NSRC-SETTING LABEL INPUT[type=text]{ box-sizing:border-box; padding:2px; text-align:right; }"
				+"#NSRC-SETTING LABEL INPUT[type=checkbox]{ margin:2px 4px 2px 0; }"
				+"#NSRC-SETTING LABEL INPUT[type=button]{ flex-grow:1; }"
				+"#NSRC-SETTING DIV.nsrc_help{ position:absolute; left:calc(100% + 1em + 1px); top:calc(1.5em + 1px); background-color:#fff; line-height:1.5; display:none; }"
				+"#NSRC-SETTING LABEL:hover+DIV.nsrc_help{ display:block; }"
				+"#NSRC-SETTING DIV.nsrc_help>P+P{ margin-top:1em; }"
				+"#NSRC-SETTING DIV.nsrc_help SPAN{ color:red; font-weight:bold; }");
			SUB.open();
			addStyle("#NSRC-SETTING LABEL>SPAN+SPAN{ width:"+adjuster.width+"px; }");
			addStyle("#NSRC-SETTING DIV.nsrc_help{ width:calc("+DIVH.clientWidth+"px - 1em); }");
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
			if(flgUpdate!==false && !setting[SP_CHECKIDV] && !users[uid].noUp){ list[list.length]={ uid:uid, name:users[uid].name, max:max, add:0 }; }
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
		var illusts,uid,url,page,urlP,lp,l,m,t,i;
		lp=users[uid=data.uid].list;
		if(flgReturnIllusts){ illusts={}; }
		page=1;
		loadResource(urlP=url=toUserPageUrl(uid,2),read);
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
			lp[lp.length]=num;
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
				for(l=t,i=1;t=l[i];i++){
					if(!(m=t.match("/seiga/im(\\d+)"))){ throwEx("item matching error\n"+t); }
					addCache(parseInt(m[1]));
				}
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
			function prog(p){ progress(list.length,idx,p); }
			var idx=0,data;
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
			var num,uid;
			for(num in found){
				cache[num]=uid=found[num];
				users[uid].list[users[uid].list.length]=num;
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
	var SUB=createSubWindow(),DIVF,DIVL,BTNS,omits,data;
	apd(SUB.WIN,"H3","除外対象ユーザーリスト");
	apd(SUB.WIN,"HR");
	(DIVF=apd(SUB.WIN,"DIV")).id="NSRC-OMIT-FRAME";
	(DIVL=apd(DIVF   ,"DIV")).id="NSRC-OMIT-LIST";
	(BTNS=apd(apd(SUB.WIN,"HR"),"button","保存して終了")).onclick=function(){
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
		 "#NSRC-OMIT-FRAME{ max-height:"+((ICON_SIZE+ITEM_SPACE)*MAX_ITEM_IN_LIST)+"px; }"
		+"#NSRC-OMIT-LIST{ display:table; margin:1px 0; min-width:"+DIVF.clientWidth+"px; }"
		+"#NSRC-OMIT-LIST>DIV{ display:table-row; }"
		+"#NSRC-OMIT-LIST>DIV[nsrc-lost=true]{ background-color:#eee; }"
		+"#NSRC-OMIT-LIST>DIV>*{ display:table-cell; padding:"+ITEM_PADDING+"px 0; vertical-align:middle; white-space:nowrap; }"
		+"#NSRC-OMIT-LIST>DIV+DIV>*{ border-top:groove 2px silver; }"
		+"#NSRC-OMIT-LIST A{ text-decoration:none; }"
		+"#NSRC-OMIT-LIST .nsrc_icon{ width:"+ICON_SIZE+"px; }"
		+"#NSRC-OMIT-LIST .nsrc_icon>IMG{ width:"+ICON_SIZE+"px; height:"+ICON_SIZE+"px; vertical-align:bottom; }"
		+"#NSRC-OMIT-LIST .nsrc_info{ min-width:"+ICON_SIZE*3+"px; max-width:"+ICON_SIZE*4+"px; padding-left:"+ITEM_SPACE+"px; padding-right:"+ITEM_SPACE+"px; text-align:left; }"
		+"#NSRC-OMIT-LIST .nsrc_info>*{ line-height:1; overflow:hidden; text-overflow:ellipsis; }"
		+"#NSRC-OMIT-LIST .nsrc_info>.nsrc_name{ font-weight:bold; font-size:150%; line-height:1.75; }"
		+"#NSRC-OMIT-LIST .nsrc_info>.nsrc_stat{ display:flex; justify-content:space-between; }"
		+"#NSRC-OMIT-LIST .nsrc_ctrl{ padding-left:"+ITEM_SPACE+"px; position:relative; }"
		+"#NSRC-OMIT-LIST .nsrc_ctrl:before{ position:absolute; z-index:2000; left:-1px; width:2px; top:"+ITEM_PADDING+"px; bottom:"+ITEM_PADDING+"px; background-color:#ddd; content:''; }"
		+"#NSRC-OMIT-LIST>DIV:not(.nsrc_delete) .nsrc_ctrl>DIV{ margin-top:"+(ITEM_PADDING+1-DIALOG_LABEL_PADDING)+"px; border-top:1px solid silver; padding-top:"+(ITEM_PADDING+1)+"px; }"
		+"#NSRC-OMIT-LIST .nsrc_ctrl INPUT[type=text]{ width:3.5em; text-align:right; }"
		+"#NSRC-OMIT-LIST .nsrc_ctrl INPUT[type=button]{ padding:0 1em; }"
		+"#NSRC-OMIT-LIST>DIV.nsrc_delete>*{ background-color:silver; }"
		+"#NSRC-OMIT-LIST>DIV.nsrc_delete .nsrc_ctrl{ padding-right:"+ITEM_SPACE+"px; }"
		+"#NSRC-OMIT-LIST>DIV.nsrc_delete :is(.nsrc_icon>IMG, .nsrc_info>:not(.nsrc_name), .nsrc_ctrl>LABEL){ display:none; }"
		+"#NSRC-OMIT-LIST>SPAN{ display:block; box-sizing:border-box; margin:.5em 0; max-width:"+DIVF.clientWidth+"px;"
			+" border-radius:1em; border:1px solid silver; padding:1em; text-align:left; line-height:1.75; }");
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
			apd(e2,"DIV",omits[uid].name).className="nsrc_name";
			apd(e2,"DIV","<SPAN>投稿枚数 ： "+(omits[uid].total ? omits[uid].total : "未取得")
				+"</SPAN>"+(omits[uid].last ? "<SPAN>&nbsp;｜&nbsp;最終検出 ： "+omits[uid].last+"</SPAN>" : "")).className="nsrc_stat";
			e1.href=e2.href=toUserPageUrl(uid,2);
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
	var SUB=createSubWindow("NSRC-ITEM-WRAP"),HDRC,BTNS,BTND,BTNC,t;
	HDRC=apd(SUB.WIN,"H3");
	apd(SUB.WIN,"HR");
	const obj={};
	(obj.NAME=apd(apd(t=apd(SUB.WIN,"DIV"),"LABEL",  "<SPAN>項目名：</SPAN>"),"text"  )).parentNode.title="チェックアイテムの項目名です。";
	(obj.CODE=apd(apd(t                   ,"LABEL","<SPAN>検索範囲：</SPAN>"),"SELECT")).parentNode.title="検索範囲を選択してください。";
	(obj.WORD=apd(apd(SUB.WIN             ,"LABEL","<SPAN>検索条件：</SPAN>"),"text"  )).parentNode.title=
		 "検索条件を指定してください。\n"
		+"通常はタグ検索の条件式として扱われます。\n"
		+"「search:（条件式）」と入力すると文字列検索になります（低速）。\n"
		+"「user:（ユーザーID）」と入力するとユーザー投稿をチェックします。\n"
		+"入力しない場合は項目名と同じになります（タグ検索）。";
	obj.NAME.placeholder="例）アニメとゲーム";
	obj.WORD.placeholder="例）アニメ OR ゲーム";
	CODES.forEach((c) => { apd(obj.CODE,"OPTION",c.name); });
	apd(SUB.WIN,"HR");
	BTNS=apd(SUB.WIN,"button","この内容で保存する");
	BTND=apd(SUB.WIN,"button","この項目を削除する");
	(BTNC=apd(SUB.WIN,"button","キャンセル")).onclick=obj.close=SUB.close;
//
	obj.NAME.onkeypress=obj.WORD.onkeypress=function(event){
		if(event.keyCode==13){ BTNS.click(); }
	};
//
	addStyle(
		 "#NSRC-ITEM-WRAP>DIV{ display:flex; align-items:center; }"
		+"#NSRC-ITEM-WRAP>DIV>LABEL:first-child{ flex-grow:1; margin-right:1em; }"
		+"#NSRC-ITEM-WRAP LABEL>SPAN{ width:5em; text-align:right; }"
		+"#NSRC-ITEM-WRAP LABEL>INPUT{ flex-grow:1; }");
	SUB.open();
	addStyle("#NSRC-ITEM-WRAP{ min-width:"+SUB.WIN.clientWidth+"px; }");
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
		SUB.open();
		return obj;
	})(changeFunc,deleteFunc);
}
////////////////////////
function createContextMenu(list){
	addStyle(
		 ".nsrc_context_menu{ position:absolute; left:-1px; top:-1px; z-index:1000; margin-left:0 !important;"
			+" border:1px solid silver; background-color:#fea; font-size:120%; text-align:left; }"
		+".nsrc_context_menu>SPAN{ display:block; padding:0 .5em; cursor:default; }"
		+".nsrc_context_menu>SPAN:hover{ background-color:#fc8; }"
		+".nsrc_context_menu>SPAN+SPAN{ border-top:1px solid #cc6; }");
//
	return (createContextMenu=function(list){
		var DIVP,DIVM=document.createElement("DIV"),menu=[],cbp,mom,t,i;
		DIVM.className="nsrc_context_menu";
		for(i=0;t=list[i];i++){
			(menu[i]=apd(DIVM,"SPAN",t.caption)).title=t.hint;
			menu[i].onclick=(function(m){
				return function(){
					cbp(m);
					close();
				};
			})(i);
			menu[i].oncontextmenu=close;
		}
		function close(){
			DIVP.removeChild(DIVM);
			DIVP=null;
			return false;
		}
		DIVM.onmouseover=function(){ mom=true; };
		DIVM.onmouseout=function(){
			mom=false;
			setTimeout(function(){
				if(!mom){ close(); }
			},10);
		};
		return function(parent,callback,option){
			if(DIVP!=parent){
				if(DIVP){ DIVP.removeChild(DIVM); }
				(DIVP=parent).appendChild(DIVM);
			}
			cbp=callback;
			if(option){
				option.forEach((f,i)=>{ menu[i].style.display = f ? "block" : "none"; });
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
		null]))(parent,callback,option);
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
		null]))(parent,callback,option);
}
////////////////////////
// メイン関数
function checkRecents(){
	var GTTL,DIVO,DIVP,DIVC,DIVN,DIVL,BTNA,BTNO,BTNS,t,i;
	try{
		if(!(t=document.querySelector("H2.my_contents_title"))){ throwEx("H2.my_contents_title not found"); }
		t.id="NSRC-TITLE";
		t.innerHTML="";
		GTTL=apd(t,"SPAN");
		if(!(DIVO=document.getElementById("my_personalize"))){ throwEx("#my_personalize not found"); }
		DIVO.style.display="none";
		(DIVP=apd(DIVO.parentNode,"DIV")).id="NSRC-WRAP";
		(DIVC=apd(DIVP,"DIV")).id="NSRC-CTRL";
		(DIVN=apd(DIVC,"DIV")).id="NSRC-RESULT";
		(BTNA=apd(t=apd(DIVC,"DIV"),"button","アイテムの追加")).title="新しいチェックアイテムを追加します。";
		(BTNO=apd(t,"button","除外設定")).title="除外対象ユーザーの設定を管理します。";
		(BTNS=apd(t,"button","環境設定")).title="環境設定をデフォルトから変更します。";
		BTNA.onclick=function(){
			var UI=checkItemEdit(function(){
				if(checkInput(UI.NAME,UI.WORD)){ return false; }
				return addItem(UI.NAME.value,UI.CODE.selectedIndex,UI.WORD.value);
			});
			UI.NAME.value=UI.WORD.value="";
			UI.CODE.selectedIndex=setting[SP_DEFCODE];
		};
		BTNO.onclick=function(){ omittedUserListEdit(); };
		BTNS.onclick=function(){ setting.edit(); };
		(DIVL=apd(apd(DIVP,"HR"),"DIV")).id="NSRC-LIST";
	}catch(e){ alert(e.message); return; }
//
	const THUMB_SIZE=setting[SP_TMBSIZE];
	addStyle(
	// 元設定の変更
		 "HTML{ scroll-behavior:smooth; }"
		+"DIV#main{ width:auto; padding:0 .5em; }"
		+"DIV#my_main{ display:flex; }"
		+"DIV#my_main_r{ flex-grow:1; }"
	// 全体レイアウト
		+"#NSRC-TITLE{ padding:0; font-size:100%; position:relative; }"
		+"#NSRC-WRAP HR{ margin:1em 0; }"
		+"#NSRC-WRAP INPUT[type=button]{ padding:0 8px; }"
		+"#NSRC-WRAP INPUT[type=button]+INPUT[type=button]{ margin-left:.5em; }"
		+"#NSRC-CTRL{ display:flex; align-items:center; }"
		+"#NSRC-CTRL>*{ white-space:nowrap; }"
		+"#NSRC-CTRL>*+*{ margin-left:1em; border-left:2px groove silver; padding-left:1em; }"
		+"#NSRC-RESULT{ flex-grow:1; padding-left:1em; overflow:hidden; text-overflow:ellipsis; }"
	// 更新ボタン共通
		+"#NSRC-TITLE>SPAN{ display:inline-block; padding:0 12px; font-size:18px; cursor:default; }"
		+":is(#NSRC-TITLE,#NSRC-LIST H3)>SPAN.nsrc_standby{ cursor:default; }"
		+":is(#NSRC-TITLE,#NSRC-LIST H3)>SPAN.nsrc_standby:hover{ background-color:"+CTRL_HOVER_COLOR+"; }"
		+":is(#NSRC-TITLE,#NSRC-LIST H3)>SPAN.nsrc_wait{ cursor:wait; }"
	// 初期枠
		+"#NSRC-LIST>SPAN{ display:inline-block; margin:1em; border-radius:.5em; border:2px solid silver; padding:1em; }"
	// 項目ブロック
		+"#NSRC-LIST>DIV{ margin-bottom:.5em; border-bottom:2px groove silver; background-color:#fff; padding-bottom:.5em; position:relative; }"
	// 項目ヘッダー
		+"#NSRC-LIST H3{ margin-bottom:4px; border-bottom:1px solid gray; border-left:6px solid #fa0; padding-right:4px;"
			+" white-space:nowrap; display:flex; align-items:center; position:relative; transition:all .5s; }"
		+"#NSRC-LIST H3.nsrc_new{ background-color:#fdd; }"
		+"#NSRC-LIST H3>*{ display:inline-block; line-height:2; white-space:nowrap; }"
		+"#NSRC-LIST H3>*+*{ margin-left:.5em; }"
		+"#NSRC-LIST H3>:first-child{ padding:0 .5em; font-size:120%; }"
		+"#NSRC-LIST H3>A{ font-size:75%; overflow:hidden; text-overflow:ellipsis; "+(setting[SP_HIDECND] ? "display:none; " : "")+"}"
		+"#NSRC-LIST H3>A:before{ content:'（'; }"
		+"#NSRC-LIST H3>A:after { content:'）'; }"
		+"#NSRC-LIST H3>.nsrc_notice{ flex-grow:1; }"
		+"#NSRC-LIST H3>.nsrc_notice:before{ content:'['; }"
		+"#NSRC-LIST H3>.nsrc_notice:after { content:']'; }"
		+"#NSRC-LIST H3>.nsrc_button{ margin-top:1px; border-radius:4px; border:1px solid gray; background-color:#ddd; text-align:center; cursor:default; }"
		+"#NSRC-LIST H3>.nsrc_button:hover{ background-color:#ccc; }"
		+"#NSRC-LIST H3>.nsrc_restore{ padding:0 .5em; }"
	// サムネイルリスト
		+"#NSRC-LIST .nsrc_result{ position:relative; min-height:"+(THUMB_SIZE+2)+"px; overflow:clip; transition:min-height .5s; }"
		+(setting[SP_HIDENOUP] ? "#NSRC-LIST H3:not(.nsrc_new)+.nsrc_result{ display:none; }" : "")
	// サムネリストオプションパーツ
		+"#NSRC-LIST .nsrc_result>:is(SPAN,DIV){ position:absolute; left:0; top:0; width:100%; height:100%; display:flex; align-items:center; }"
		+"#NSRC-LIST .nsrc_result>SPAN{ justify-content:left; }"
		+"#NSRC-LIST .nsrc_result>SPAN:before{ display:block; margin-left:1em; border-radius:1em; border:1px solid silver; padding:1em 0; width:calc(162px - 2em);"
			+" text-align:center; content:'該当なし'; }"
		+"#NSRC-LIST .nsrc_result>SPAN.nsrc_failure:before{ content:'取得失敗'; }"
		+"#NSRC-LIST .nsrc_result>DIV{ background-color:#888; opacity:75%; justify-content:center; cursor:wait; }"
		+"#NSRC-LIST .nsrc_result>DIV:before{ display:block; border-radius:1.5em; background-color:#fff; padding:1em; font-size:200%; content:'… 更新中 …'; }"
	// サムネイル
		// 本体
		+"#NSRC-LIST .nsrc_result>A{ display:inline-block; width:"+THUMB_SIZE+"px; height:"+THUMB_SIZE+"px; border:1px solid silver; background:center/contain no-repeat;"
			+" position:relative; overflow:clip; transition:all .5s; }"
		// 新着表示
		+"#NSRC-LIST .nsrc_result>[nsrc-new],"
		+"#NSRC-LIST .nsrc_result>[nsrc-new]>SPAN{ border-color:red; }"
		+"#NSRC-LIST .nsrc_result>[nsrc-new]:before{ position:absolute; right:-1px; bottom:-1px; display:block; background-color:red; padding:2px 4px; color:white; content:'new'; }"
		// 除外時のボーダー色
		+"#NSRC-LIST .nsrc_result>:is(.nsrc_useromit, .nsrc_tempomit),"
		+"#NSRC-LIST .nsrc_result>:is(.nsrc_tempomit, .nsrc_useromit)>SPAN{ border-color:#000 !important; }"
		// 除外時のカーソル
		+"#NSRC-LIST .nsrc_result>:is(.nsrc_useromit, .nsrc_tempomit){ cursor:default; }"
		// オプションパーツ共通
		+"#NSRC-LIST .nsrc_result>A>SPAN{ position:absolute; top:0; opacity:0; transition:opacity .5s; content:''; }"
		// 除外ボタン共通
		+"#NSRC-LIST .nsrc_result>A>:is(.nsrc_tempomit_button, .nsrc_useromit_button){ z-index:1; display:block; border-width:1px; border-color:silver;"
			+" padding:0 .5em; line-height:2; white-space:nowrap; color:#000; cursor:default; }"
		+"#NSRC-LIST .nsrc_result>A>:is(.nsrc_tempomit_button, .nsrc_useromit_button):hover{ opacity:1; }"
		+"#NSRC-LIST .nsrc_result :is(.nsrc_useromit>.nsrc_tempomit_button, .nsrc_tempomit>.nsrc_useromit_button){ display:none; }"
		// 除外ボタン相違
		+"#NSRC-LIST .nsrc_result>A>.nsrc_tempomit_button{  left:0; border-radius:0 0 8px 0; border-style:none solid solid none; background-color:#ffa; }"
		+"#NSRC-LIST .nsrc_result>A>.nsrc_useromit_button{ right:0; border-radius:0 0 0 8px; border-style:none none solid solid; background-color:#fcc; }"
		+"#NSRC-LIST .nsrc_result>.nsrc_tempomit>.nsrc_tempomit_button{ background-color:#cdf; }"
		+"#NSRC-LIST .nsrc_result>.nsrc_useromit>.nsrc_useromit_button{ background-color:#9f9; }"
		// マスク
		+"#NSRC-LIST .nsrc_result>A>.nsrc_tmbmask{ left:0; width:100%; height:100%; background-color:#000; display:flex;  justify-content:center; align-items:center; }"
		+"#NSRC-LIST .nsrc_result>A>:is(.nsrc_tempomit_button, .nsrc_useromit_button):hover~.nsrc_tmbmask{ opacity:.25; }"
		+"#NSRC-LIST .nsrc_result>:is(.nsrc_useromit, .nsrc_tempomit)>.nsrc_tmbmask{ opacity:1 !important; background-color:rgba(0,0,0,50%); }"
		+"#NSRC-LIST .nsrc_result>:is(.nsrc_useromit, .nsrc_tempomit)>.nsrc_tmbmask:before{ display:block; width:75%; font-size:120%;  border-radius:1.5em;"
			+" background-color:rgba(255,255,255,75%); line-height:3; text-align:center; content:'除外中'; color:#000; }"
	// 削除予定アイテム
		+"#NSRC-LIST>DIV.nsrc_delete>H3{ border-color:gray; background-color:silver; }"
		+"#NSRC-LIST>DIV.nsrc_delete .nsrc_edit,"
		+"#NSRC-LIST>DIV:not(.nsrc_delete) .nsrc_restore{ display:none; }"
		+"#NSRC-LIST>DIV.nsrc_delete .nsrc_result{ min-height:0; }"
		+"#NSRC-LIST>DIV.nsrc_delete .nsrc_result>A{ height:0; border-width:0 1px; visibility:hidden; }");
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
	const omitted=Omitted();
	function progressOmit(len,num,page){ DIVN.innerHTML="除外情報を更新中 … "+num+"/"+len+(page?" "+page+"ページ目":""); }
//
	const ctrlGrobalTitle=(function(){
		var switchState=false;
		function updateAll(){
			DIVN.innerHTML="新着情報を更新中 …";
			newAll={ items:[], count:list.length, found:0 };
			list.forEach((d)=>{ d.update(); });
		}
		GTTL.onclick=function(){
			if(switchState){ return; }
			if(list.length==0){ alert("チェックアイテムがありません。"); }
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
						if(list.length==0){ alert("チェックアイテムがありません。"); }
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
	var list=[],newAll,cbtFst=null;
	getStorageObject(CHECKLIST_KEY,true).forEach((d)=>{
		if(!d.del){ list[list.length]=d; }
	});
	lock(true);
	omitted.load(progressOmit,function(){
		if(list.length){ init(); }
		else{
			DIVN.innerHTML="";
			t=apd(DIVL,"SPAN","チェックアイテムを追加してください。操作できる場所にマウスカーソルを合わせると簡単な説明が表示されます。");
			(t=apd(apd(t,"HR"),"button","観測タグをインポートする")).title="元の定点観測ページからフォロー中のタグをインポートします。";
			t.onclick=function(){
				try{
					var temp=[],check={},l,t,a,i;
					if(!(l=document.getElementById("tag_block"))){ throwEx("#tag_block not found"); }
					for(l=l.getElementsByTagName("A"),i=0;a=l[i];i++){
						if(a.className=="tag" && a.href && (t=a.href.match("/tag/([^/]+)$"))){
							if(check[t=t[1]]){ continue; }
							temp[temp.length]={ name:t, code:setting[SP_DEFCODE], word:t, last:0 };
						}
					}
					if(temp.length){
						if(100 < temp.length && !confirm("非常に多くのタグ（"+temp.length+"個）をインポートしようとしています。\n"
							+"イラスト数が膨大になり、処理に時間がかかるかもしれません。\n本当に実行してよいですか？")){ return; }
						setStorageObject(CHECKLIST_KEY,list=temp);
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
		newAll={ items:[], count:list.length, found:0 };
		for(let i=0;i<list.length;i++){ createItem(i); }
	}
//
	function toHtml(s){ return s.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/&/g,"&amp;"); }
	function toCndStr(code,word){ return "検索条件："+CODES[code].name+"／"+toHtml(word); }
	function toCndUrl(code,word){
		var t;
		return (t=word.match(/^user:(\d+)$/)) ? toUserPageUrl(t[1],code)
			: ( (t=word.match(/^search:(.+)$/)) ? "https://seiga.nicovideo.jp/search/"+encodeURIComponent(t[1])
			                                    : "https://seiga.nicovideo.jp/tag/"   +encodeURIComponent(word) )+"?"+CODES[code].code;
	}
//
	function createItem(idx){
		var data=list[idx],url=toCndUrl(data.code,data.word),urlP,rewind;
		//
		var BLK=DIVL.insertBefore(document.createElement("DIV"),DIVL.firstChild),HDR,TTL,CND,NTC,RES;
		(HDR=apd(BLK,"H3")).id="MYLIST"+idx;
		(TTL=apd(HDR,"SPAN",toHtml(data.name))).onclick=function(){
			if(lock()){ alert("更新中のため実行できません。"); }
			else{ data.update(setting[SP_CHECKIDV] ? 0 : -1); }
		};
		TTL.oncontextmenu=function(event){
			if(event.ctrlKey){ return; }
			if(!lock()){
				var flg=setting[SP_CHECKIDV];
				updateOption(TTL.parentNode,function(index){
					data.update(index==3 ? 1 : index==4 ? 2 : index);
				},[!flg,!flg,!flg,flg,flg]);
			}
			return false;
		};
		(CND=apd(HDR,"A",toCndStr(data.code,data.word))).href=url; CND.target="_blank";
		(NTC=apd(HDR,"SPAN")).className="nsrc_notice";
		addEditBtn(data,HDR,TTL,CND);
		addMoveBtn(data,HDR,true );
		addMoveBtn(data,HDR,false);
		if(cbtFst){
			addStyle("#NSRC-LIST H3>SPAN.nsrc_button{ min-width:"+cbtFst.clientHeight+"px; }");
			cbtFst=false;
		}
		(RES=apd(BLK,"DIV")).className="nsrc_result";
		apd(RES,"DIV");
		//
		var flgU,cnt,newc,page,numR,numL;
		data.update=function(mode){
			if(data.del){
				if(newAll){
					newAll.items[idx]=0;
					--newAll.count;
				}
				return;
			}
			lock(true);
			omitted.load(0<=mode ? progressOmit : null,function(){
				if(mode==1){ data.last=rewind; }else if(mode==2){ data.last=0; }
				apd(RES,"DIV");
				url=toCndUrl(data.code,data.word);
				DIVN.innerHTML="項目の再取得中 …";
				start();
			});
		};
		function start(){
			ctrlGrobalTitle();
			TTL.title="";
			TTL.className="nsrc_wait";
			NTC.innerHTML="読込中…";
			flgU=isUserPageUrl(url);
			cnt=newc=0;
			page=1;
			numR=numL=0;
			rewind=data.last;
			loadResource(urlP=url,load);
		}
		var unit,num,ttl,t,m,i;
		function load(status,res){
			try{
				if(status!=200){ throwEx("http-error : "+status); }
				//
				if(     2 <= (t=res.split("<div class=\"illust_list_img \">"      )).length && t.length <=21){ unit=20; }
				else if(2 <= (t=res.split("<li class=\"list_item list_no_trim2\">")).length && t.length <=41){ unit=40; }
				else if(2 <= (t=res.split("<li class=\"list_item no_trim\">"      )).length && t.length <=41){ unit=40; }
				else{
					if(res.match(/登録されているイラストはありません|を含むイラストは見つかりませんでした/)){
						RES.innerHTML="<SPAN></SPAN>";
						throw {};
					}
					if(res.match(/ここから先は、アダルト要素を含むコンテンツがあります/)){
						RES.innerHTML="<SPAN class=\"nsrc_failure\"></SPAN>";
						throwEx("年齢確認を済ませてください");
					}
					if(res.match(/ユーザーは存在しないか削除されている可能性があります/)){
						RES.innerHTML="<SPAN class=\"nsrc_failure\"></SPAN>";
						throwEx("ユーザーがいません");
					}
					throwEx("list split error");
				}
				//
				for(res=t,i=1;t=res[i];i++){
					if(!(m=t.match("(/seiga/im(\\d+)).+(https://lohas\\.nicoseiga\\.jp//?thumb/\\d+)"))){ throwEx("item matching error\n"+t); }
					num=parseInt(m[2]);
					if((numL && numL <= num) || (!flgU && omitted.check(num))){ continue; }
					if(num <= data.last && setting[SP_DCNTMIN]<=cnt){ throw {}; }
					if(!cnt){ RES.innerHTML=""; }
					if((ttl=t.match("<a href=\"/seiga/im"+num+"\\?[^\"]+\">([^<]+)"))
					|| (ttl=t.match(/<li class="title">([^<]+)/))){
						if((ttl=ttl[1]).match("^[ 　"+String.fromCharCode(10240)+"]*$")){ ttl="[空題]"; }
					}
					else{ ttl="[error]"; }
					t=thumb(RES,m[1],m[3],ttl);
					if(!numR){ numR=num; }
					cnt++;
					if(data.last < num){
						t.setAttribute("nsrc-new","");
						newc++;
						if(newAll && !newAll[num]){
							newAll[num]=true;
							newAll.found++;
						}
					}
					else if(setting[SP_DCNTMIN] <= cnt){ throw {}; }
					if(ILLUST_DISPLAY_MAX <= cnt){ throw {}; }
					numL=num;
				}
				if(i<=unit){ throw {}; }
				NTC.innerHTML="読込中…"+(++page)+"ページ目";
				loadResource(urlP=url+"&page="+page,load);
			}catch(e){
				if(e.message){
					console.log(urlP+" : "+e.message);
					NTC.innerText="エラー : "+e.message;
					if(newAll){ newAll.error=true; }
				}
				else{
					data.last=numR;
					setStorageObject(CHECKLIST_KEY,list);
					NTC.parentNode.className = newc ? "nsrc_new" : "";
					NTC.innerHTML="新着："+(newc?newc+"枚"+(newc==ILLUST_DISPLAY_MAX?"まで表示":""):"なし");
					e=null;
				}
				if(newAll){
					newAll.items[idx]=newc;
					if(--newAll.count==0){
						if(newAll.found){
							let s="";
							newAll.items.forEach((c,i)=>{
								if(c){ s="<A href=\"#MYLIST"+i+"\">"+toHtml(list[i].name)+"</A>"+(s?"／"+s:""); }
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
					DIVN.innerHTML = e ? "エラー" : "完了";
					omitted.save();
					lock(false);
					ctrlGrobalTitle();
				}
				TTL.title="クリックで更新。\n右クリックでオプションを表示。";
				TTL.className="nsrc_standby";
			}
		}
		//
		start();
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
	function checkSameItem(name,code,word,idx){
		for(let t,i=0;t=list[i];i++){
			if(i===idx){ continue; }
			if(t.code==code && t.word==word){
				alert("同じ検索条件が既に存在します。");
				return true;
			}
		}
		return false;
	}
//
	function getIndex(item){
		for(let t,i=0;t=list[i];i++){
			if(t==item){ return i; }
		}
		alert("データの照合に失敗しました。ページをリロードしてからもう一度試してください。");
		return -1;
	}
//
	function addItem(name,code,word){
		var idx;
		if(checkSameItem(name,code,word)){ return false; }
		list[idx=list.length]={ name:name, code:code, word:word, last:0 };
		setStorageObject(CHECKLIST_KEY,list);
		if(idx==0){ DIVL.innerHTML=""; }
		createItem(idx);
		return true;
	}
//
	function editItem(item,blk,ttl,cnd){
		if(lock()){ return; }
		var UI=checkItemEdit(function(){
			if(checkInput(UI.NAME,UI.WORD)){ return false; }
			var name=UI.NAME.value,code=UI.CODE.selectedIndex,word=UI.WORD.value,idx,flg;
			if(item.name==name
			&& item.code==code
			&& item.word==word){ return true; }
			if((idx=getIndex(item)) < 0 || checkSameItem(name,code,word,idx)){ return false; }
			if(name!=item.name){ ttl.innerHTML=toHtml(item.name=name); }
			if(code!=item.code
			|| word!=item.word){
				cnd.innerHTML=toCndStr(item.code=code,item.word=word);
				cnd.href=toCndUrl(code,word);
				item.last=0;
				flg=true;
			}
			setStorageObject(CHECKLIST_KEY,list);
			if(flg && confirm("検索条件が変更されました。今すぐ再取得しますか？")){
				if(lock()){ alert("更新中のため実行できません。"); }
				else{ item.update(); }
			}
			return true;
		},function(){
			if(lock()){ alert("更新中のため実行できません。"); return false; }
			item.del=true;
			setStorageObject(CHECKLIST_KEY,list);
			blk.className="nsrc_delete";
			ttl.inert=true;
			return true;
		});
		UI.NAME.value        =item.name;
		UI.CODE.selectedIndex=item.code;
		UI.WORD.value        =item.word;
	}
	function addEditBtn(item,blk,ttl,cnd){
		var BTNE=apd(blk,"SPAN","編"),BTNR=apd(blk,"SPAN","削除を取り消す");
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
			setStorageObject(CHECKLIST_KEY,list);
			blk.className="";
			ttl.inert=false;
		};
	}
//
	function moveItem(item,blk,flgUp,id){
		var idx,tmp,swp;
		if(lock() || (idx=getIndex(item)) < 0){ return; }
		if((flgUp && idx==list.length-1) || (!flgUp && idx==0)){ return; }
		if(flgUp){
			tmp=list[idx+1];
			list[idx+1]=item;
			list[idx]=tmp;
			swp=tmp=blk.previousSibling;
		}
		else{
			tmp=list[idx-1];
			list[idx-1]=item;
			list[idx]=tmp;
			tmp=(swp=blk.nextSibling).nextSibling;
		}
		blk.parentNode.insertBefore(blk.parentNode.removeChild(blk),tmp);
		setStorageObject(CHECKLIST_KEY,list);
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
		var BTN=apd(blk,"SPAN",flgUp ? "↑" : "↓"),id=blk.id;
		blk=blk.parentNode;
		BTN.title="この項目を1つ"+(flgUp ? "上" : "下")+"へ移動します。";
		BTN.className="nsrc_button";
		BTN.onclick=function(){ moveItem(item,blk,flgUp,id); }
	}
//
	const TEMPOMIT_TEXT="簡易除外",TEMPOMIT_HINT="このイラストが新着から流れるまで除外します。",
		USEROMIT_TEXT="作者を除外",USEROMIT_HINT="このイラストの作者を除外対象に指定します。",
		UNOMIT_TEXT="除外を解除",UNOMIT_HINT="除外指定を解除します。";
	function thumb(prt,url,tmu,ttl){
		var a=apd(prt,"A"),s;
		a.href=url;
		a.target="_blank";
		a.style.backgroundImage="url("+tmu+(180<THUMB_SIZE?"m":"u")+")";
		a.title=ttl;
		(s=apd(a,"SPAN",TEMPOMIT_TEXT)).className="nsrc_tempomit_button"; s.title=TEMPOMIT_HINT;
		(s=apd(a,"SPAN",USEROMIT_TEXT)).className="nsrc_useromit_button"; s.title=USEROMIT_HINT;
		(s=apd(a,"SPAN")).className="nsrc_tmbmask";;
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
						var l,a,i;
						for(l=DIVL.getElementsByTagName("A"),i=0;a=l[i];i++){
							if((n=a.href) && (n=n.match(/\/im(\d+)$/)) && illusts[n[1]]){ setState(a,flg); }
						}
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
			if(!add.name || !(0<=add.code && add.code<=2) || !add.word){ return; }
			localStorage.removeItem(FORWARD_ITEM_KEY);
			addItem(add.name,add.code,add.word);
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
		var items=getStorageObject(CHECKLIST_KEY),code=setting[SP_DEFCODE];
		word = tag ? tag : uid ? "user:"+uid : "search:"+word;
		for(i=0;t=items[i];i++){
			if(t.code==code && t.word==word){ return; }
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
		(ELMA=apd(ELMP,"DIV")).id="NSRC-ACTION-BUTTONS";
		if(24 < name.length){ name=name.substring(0,20)+" ..."; }
//
		var BTNC,BTNO,omitted = uid ? Omitted() : null;
		if(!flgL){
			(BTNC=apd(ELMA,"SPAN","観測対象に追加")).title="この"+(uid?"ユーザー":tag?"タグ":"検索文字列")+"を新着チェックの観測対象に追加します。";
			BTNC.onclick=function(){
				var item={ name:name, code:code, word:word, last:0 };
				// 念のため最新情報を詳細確認
				for(items=getStorageObject(CHECKLIST_KEY),i=0;t=items[i];i++){
					if(t.code==item.code
					&& t.word==item.word){
						alert("すでに同じ検索条件の項目があるため追加できませんでした。\n新着チェックページから手動で登録してみてください。");
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
						items[items.length]=item;
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
			 "#NSRC-ACTION-BUTTONS{ "
				+( flgS ? (!flgL ? "padding-top:.5em; text-align:center;" : "text-align:right;")
				 : flgL ? "margin-top:24px;"
				 : uid  ? "display:inline-block; margin-left:2em;"
				 : tag  ? "margin-left:2em;"
				 :        "position:absolute; right:1em; top:-.5em;")
				+" white-space:nowrap; }"
			+"#NSRC-ACTION-BUTTONS>SPAN{ display:inline-block; font-size:125%; width:7em; border-radius:"+BTN_HEIGHT/2+"em; border:1px solid silver; box-shadow:2px 2px 2px #ddd;"
				+" background:linear-gradient(to bottom,#fea,#fc6); padding:0 1em; line-height:"+BTN_HEIGHT+"; text-align:center; cursor:pointer; }"
			+"#NSRC-ACTION-BUTTONS>SPAN+SPAN{ margin-left:1em; }"
			+"#NSRC-ACTION-BUTTONS>SPAN[nsrc-omitted]{ background:linear-gradient(to bottom,#fcc,#f88); }"
			+"#NSRC-ACTION-BUTTONS>SPAN[nsrc-omitted=true]{ background:linear-gradient(to bottom,#bfb,#7f7); }");
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
