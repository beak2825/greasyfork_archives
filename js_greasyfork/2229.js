// ==UserScript==
// @id             Change_search_result_for_Google_and_Bing@noi
// @name           Change search result for Google and Bing
// @version        2.02
// @copyright      Noi & Noisys & NoiSystem & NoiProject
// @license        https://creativecommons.org/licenses/by-nc-sa/3.0/
// @author         noi
// @description    change or hide search results of Google & Bing
// @include        *.google.*
// @include        *www.bing.com/*
// @namespace      https://greasyfork.org/scripts/2229
// @homepageURL    https://greasyfork.org/scripts/2229
// @run-at         document-end
// @grant          GM_log
// @grant          GM_config
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/2229/Change%20search%20result%20for%20Google%20and%20Bing.user.js
// @updateURL https://update.greasyfork.org/scripts/2229/Change%20search%20result%20for%20Google%20and%20Bing.meta.js
// ==/UserScript==


/***************************************************************************************
//require GreaseMonkey Script Configurator 1.2.57                                     //
//Copyright: JoeSimmons & Sizzlemctwizzle & IzzySoft                                  //
//(c)https://greasyfork.org/scripts/1884-gm-config                                    //
//license LGPL version 3 or any later version; http://www.gnu.org/copyleft/lgpl.html  //
***************************************************************************************/


/*=====================================================================================================================
*************************************************************************
***注意:文字コードはUFT-8で保存してくださいNotice for 2byte Charactor ***
*************************************************************************

===解説(Read me)===

・GoogleとBingの検索結果を非表示にする機能(Hide the search result by google or Bing)
・GoogleとBingの検索結果のURLを変更する機能(Change the search result's URL by google or Bing)


[非表示について(about to hide)]-----------------------------------------------------------------------------
===例文For example===
ex)"hogehoge"と"wiki"が両方共あって、"jp"か"com"のどちらともなかったら検索結果を消す
   (Hit "hogehoge" and "wiki" ,And still "jp" or "com" are not included.Hide result)

		{ NGword : ["hogehoge","wiki"], ignore : ["jp","com"]},

===ヒント(hint)===
・項目は複数指定が可能(Items can be increased)
・NGwordはand条件です("NGword" is AND condition)
・ignoreはor条件です("ignore" is OR condition)
・""のように文字を指定しない場合は無視されます("" is ignored)
・日本語で検索できるので嫌いな単語が含まれたら消すことが出来ます。
  (Can search for Japanese)


[URL置換について(about to change URL)]----------------------------------------------------------------------
===例文For example===
ex)"www.hogehoge.com"を"hogehoge.com"にする
   (Change "www.hogehoge.com" to "hogehoge.com")
		{ before : "www.hogehoge.com", after : "hogehoge.com" },

ex)"hogehoge"を消す
   (Delete "hogehoge")
		{ before : "hogehoge", after : "" },

ex)"ぬるぽ"を"ガッ"にする
   (Change "ぬるぽ" to "ガッ". for 2byte charactor.)
		{ before : "ぬるぽ", after : "ガッ" },

===ヒント(hint)===
・項目は1つだけなので増やせません(Only one item. Can not be added)
・beforeは検索用のURLです("before" is search URL)
・afterは変換後のURLです("after" is changed URL)
・beforeで""のように文字を指定しない場合は無視されます("" is ignored in before)
・どちらも日本語で指定するとURL表記に変更されます。※パーセントエンコードします
  (2byte charactor is changed to the URL notation.for Japanese)
・もし検索条件を追加したいなら(If you would like to add a search condition.)
ex:add ie=utf-8 @Google("http://www.google.com/search?num=50" to "http://www.google.com/search?ie=utf-8&num=50")
		{ before : "search?", after : "search?ie=utf-8&" }, 


===注意事項(notice)===
*************************************************************************
一番最後のカンマ(,)を忘れないこと(Do not forget the last comma)
・同じ単語を指定すると干渉する場合があります
  (If you specify the same word,May interfere)
*************************************************************************

=====================================================================================================================*/

/*************************************************************************************************************
更新履歴

11/30/2017 - v2.02 fix : 仕様変更対応
03/31/2015 - v2.01 fix : 重複していた処理の修正
02/11/2015 - v2.00 add : Simple format check
02/11/2015 - v2.00 add : bing
08/19/2014 - v1.15 add : close config when keydown ESC
08/19/2014 - v1.15 fix : config button
06/13/2014 - v1.14 del : @updateURL
06/12/2014 - v1.13 add : @grant & @homepageURL
06/07/2014 - v1.12 update : delete require. and include the code in script.
06/05/2014 - v1.11 fix : userscripts.org
05/17/2014 - v1.10 fix : userscripts.org:8080
03/14/2014 - v1.9  fix : Fixed [undefined] Error (GoogleSearchButton)
06/11/2013 - v1.8  fix : Fixed for Chrome
06/10/2013 - v1.7  fix : Fixed that did not work When logout
06/09/2013 - v1.6  fix : It corresponded to specification change of google.
04/06/2013 - v1.5  fix : The fault which will not operate if logged in to Google was corrected.
03/19/2013 - v1.4  update : For AutoPager & AutoPagerize.
03/09/2013 - v1.3  fix : Config window For Chrome
03/09/2013 - v1.2  add : GM_config
01/29/2013 - v1.1  add : check update
11/13/2011 - v1.0  release 

**************************************************************************************************************/

/*************************************************************************************************************
備忘録
・以下をgreasyforkに変更
  http://www.userscripts.org/scripts/show/117908
  http://userscripts.org/scripts/source/117908.user.js
・@updateURLを削除(インストールしたときのサイトURLをアドオンが保持しているので更新可能な模様)

**************************************************************************************************************/


//====================================================================================================================

(function(){
	if(window!=parent)return;	//iframeは除外
	
	if(location.host.match("plus.google.com")) return;

	var hideList = "";
	var changeList = "";



	//ユーザーコンフィグ画面(GM_config)
	userCfg();

	//メイン
	handle(document);



//プログラム部Main PG==================================================================================================

//非表示処理(Hide result)--------------------------------------------------------------------------
	function handle(node){
		if(!node.tagName && node != document) return

		if(hideList == ""){ alert("format error : hideList"); return;}
		if(changeList == ""){ alert("format error : changeList"); return;}

		var result_Hide = document.getElementsByTagName('li');
		if(node.tagName && node.tagName.match(/^li$/i)) result_Hide = [node];

		for (i = 0; i < result_Hide.length; i++){
			var strTag = result_Hide[i];					//検索結果のテキスト情報(Search result)
			var hideFlg = 0;					//非表示フラグ(Hide flag)
										//0:初期値(initial) 1:非表示(hide) 2:表示(visible)

			for (j = 0; j < hideList.length; j++){

				//非表示処理(Hide result)--------------------------------------------------
				for (k = 0; k < hideList[j].NGword.length; k++){
					if (hideList[j].NGword[k] == "" ){
						continue;
					}

					if (strTag.className.match(/(g|gb_algo)/i) && strTag.innerHTML.match(hideList[j].NGword[k])){
						hideFlg = 1;

					}else{
						hideFlg = 2;
					}
				}

				
				//例外判定(Exception)------------------------------------------------------
				for (k = 0; k < hideList[j].ignore.length; k++){
					if (hideList[j].ignore[k] == "" ){
						continue;
					}
					
					if (strTag.className.match(/(g|gb_algo)/i) && strTag.innerHTML.match(hideList[j].ignore[k])){
						hideFlg = 2;
//throw "test";//変数確認用
						
					}
				}

				
				//検索結果削除(Delete result)----------------------------------------------
				if (hideFlg == 1){
					strTag.innerHTML = '';
					hideFlg = 0;
					strTag.setAttribute('style', 'display:none;');
				}
			}
		}


//URL置換Change URL----------------------------------------------------------------------------------------

		var result_Ch = document.evaluate('.//H3', node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)				//google
		if(!result_Ch.snapshotLength)result_Ch = document.evaluate('.//H2', node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);	//bing

		for (i = 0; i < result_Ch.snapshotLength; i++){

			for(j = 0; j < result_Ch.snapshotItem(i).getElementsByTagName('a').length; j++){
				var oldLink = result_Ch.snapshotItem(i).getElementsByTagName('a')[j].getAttribute('href');	//検索結果のURL(Original URL)

				for (k = 0; k < changeList.length; k++){
					if (changeList[k].before == ""){
						continue;
					}

					var newLink = oldLink.replace(encStr(changeList[k].before), encStr(changeList[k].after));
												//置換後のリンク(Changed URL)

					if (newLink != oldLink){

						result_Ch.snapshotItem(i).getElementsByTagName('a')[j].setAttribute('href', newLink);

					}
				}
			}
		}
	}

//共通プログラムCommon PG=======================================================================================

//日本語をパーセントエンコードする(For Japanese encode)-------------------------------------
function encStr( str ){
	var encodeString = encodeURI(str) ;
	
	return encodeString;
}


//ユーザー設定画面(userconfig)-------------------------------------------------------------
function userCfg(){

//==============================================================
//GreaseForkがrequireの審査必要なのでいっそのこと埋め込みました。
//Copyright: JoeSimmons & Sizzlemctwizzle & IzzySoft 
//require (c)https://greasyfork.org/scripts/1884-gm-config
//==============================================================

//============================引用開始===================================

	var GM_config = {
	storage: 'GM_config',
	init: function(){
        for(var i=0,l=arguments.length,arg; i<l; ++i) {
		arg=arguments[i];
		switch(typeof arg) {
			case 'object': for(var j in arg) {
				switch(j) {
					case "open": GM_config.onOpen=arg[j]; delete arg[j]; break; // called when frame is gone
					case "close": GM_config.onClose=arg[j]; delete arg[j]; break; // called when settings have been saved
					case "save": GM_config.onSave=arg[j]; delete arg[j]; break; // store the settings objects
					default: var settings = arg;
				}
			} break;
            case 'function': GM_config.onOpen = arg; break; // passing a bare function is set to open
                        // could be custom CSS or the title string
			case 'string': if(arg.indexOf('{') !== -1 && arg.indexOf('}') !== -1) var css = arg;
				else GM_config.title = arg;
				break;
		}
	}
	if(!GM_config.title) GM_config.title = 'Settings - Anonymous Script'; // if title wasn't passed through init()

	// give the script a unique saving ID for non-firefox browsers
	GM_config.storage = GM_config.title.replace(/\W+/g, "").toLowerCase();

	var stored = GM_config.read(); // read the stored settings
	GM_config.passed_values = {};
	for(var i in settings) {
		GM_config.doSettingValue(settings, stored, i, null, false);
		if(settings[i].kids) for(var kid in settings[i].kids) GM_config.doSettingValue(settings, stored, kid, i, true);
	}
	GM_config.values = GM_config.passed_values;
	GM_config.settings = settings;
	if (css) GM_config.css.stylish = css;
 },
 open: function() {
 if(document.evaluate("//iframe[@id='GM_config']",document,null,9,null).singleNodeValue) return;
	// Create frame
	document.body.appendChild((GM_config.frame=GM_config.create('iframe',{id:'GM_config', style:'position: fixed; top: 0; left: 0; opacity: 0; display: none; z-index: 999999; width: 75%; height: 75%; max-height: 95%; max-width: 95%; border:3px ridge #000000; overflow: auto;'})));
        GM_config.frame.src = 'about:blank'; // In WebKit src cant be set until it is added to the page
	//Chromeだとallow-scriptsも必要(ただしそれやっちゃうと結局セキュリティダダ下がり)
	GM_config.frame.sandbox="allow-same-origin";
	GM_config.frame.addEventListener('load', function() {
		var obj = GM_config, doc = this.contentDocument, frameBody = doc.getElementsByTagName('body')[0], create=obj.create, settings=obj.settings, anch, secNo;
		obj.frame.contentDocument.getElementsByTagName('head')[0].appendChild(create('style',{type:'text/css',textContent:obj.css.basic + "\n\n" + obj.css.stylish}));

		// Add header and title
		frameBody.appendChild(create('div', {id:'header',className:'config_header block center', innerHTML:obj.title}));

		// Append elements
		anch = frameBody; // define frame body
		secNo = 0; // anchor to append elements
		for(var i in settings) {
			var type, field = settings[i], value = obj.values[i], section = (field.section ? field.section : ["Main Options"]),
				headerExists = doc.evaluate(".//div[@class='section_header_holder' and starts-with(@id, 'section_')]", frameBody, null, 9, null).singleNodeValue;

			if(typeof field.section !== "undefined" || headerExists === null) {
				anch = frameBody.appendChild(create('div', {className:'section_header_holder', id:'section_'+secNo, kids:new Array(
				  create('a', {className:'section_header center', href:"javascript:void(0);", id:'c_section_kids_'+secNo, textContent:section[0], onclick:function(){GM_config.toggle(this.id.substring(2));}}),
				  create('div', {id:'section_kids_'+secNo, className:'section_kids', style:obj.getValue('section_kids_'+secNo, "")==""?"":"display: none;"})
				)}));
				if(section[1]) anch.appendChild(create('p', {className:'section_desc center',innerHTML:section[1]}));
				secNo++;
			}
			anch.childNodes[1].appendChild(GM_config.addToFrame(field, i, false));
		}

		// Add save and close buttons
		frameBody.appendChild(obj.create('div', {id:'buttons_holder', kids:new Array(
			obj.create('button',{id:'saveBtn',textContent:'Save',title:'Save options and close window',className:'saveclose_buttons',onclick:function(){GM_config.close(true)}}),
			obj.create('button',{id:'cancelBtn', textContent:'Cancel',title:'Close window',className:'saveclose_buttons',onclick:function(){GM_config.close(false)}}),
			obj.create('div', {className:'reset_holder block', kids:new Array(
				obj.create('a',{id:'resetLink',textContent:'Restore to default',href:'#',title:'Restore settings to default configuration',className:'reset',onclick:obj.reset})
		)}))}));

		obj.center(); // Show and center it
		window.addEventListener('resize', obj.center, false); // Center it on resize
		if (obj.onOpen) obj.onOpen(); // Call the open() callback function
		
		// Close frame on window close
		window.addEventListener('beforeunload', function(){GM_config.remove(this);}, false);
	}, false);
 },
 close: function(save) {
	if(save) {
		var type, fields = GM_config.settings, typewhite=/radio|text|hidden|password|checkbox/;
		for(f in fields) {
			var field = GM_config.frame.contentDocument.getElementById('field_'+f), kids=fields[f].kids;
			if(typewhite.test(field.type)) type=field.type;
				else type=field.tagName.toLowerCase();
			GM_config.doSave(f, field, type);
			if(kids) for(var kid in kids) {
			var field = GM_config.frame.contentDocument.getElementById('field_'+kid);
			if(typewhite.test(field.type)) type=field.type;
				else type=field.tagName.toLowerCase();
			GM_config.doSave(kid, field, type, f);
			}
		}
                if(GM_config.onSave) GM_config.onSave(); // Call the save() callback function
                GM_config.save();
	}
	if(GM_config.frame) GM_config.remove(GM_config.frame);
	delete GM_config.frame;
        if(GM_config.onClose) GM_config.onClose(); //  Call the close() callback function
 },
 set: function(name,val) {
	GM_config.values[name] = val;
 },
 get: function(name) {
	return GM_config.values[name];
 },
 isGM: (typeof window.opera === "undefined" && typeof window.chrome === "undefined" && typeof GM_info === "object" && typeof GM_registerMenuCommand === "function"),
 log: function(str) {

	if(this.isGM) return GM_log(str);
		else if(window.opera) return window.opera.postError(str);
		else return console.log(str);

 },
 getValue : function(name, d) {
	var r, def = (typeof d !== "undefined" ? d : "");
	switch(this.isGM === true) {
		case true: r = GM_getValue(name, def); break;
		case false: r = localStorage.getItem(name) || def; GM_log("test:" + typeof GM_info); break;
	}
	return r;
},
 setValue : function(name, value) {
	switch(this.isGM === true) {
		case true: GM_setValue(name, value); break;
		case false: localStorage.setItem(name, value); break;
	}
 },
  deleteValue : function(name) {
	switch(this.isGM === true) {
		case true: GM_deleteValue(name); break;
		case false: localStorage.removeItem(name); break;
	}
},
 save: function(store, obj) {
    try {
		var val = JSON.stringify(obj || GM_config.values);
		GM_config.setValue((store||GM_config.storage),val);
    } catch(e) {
		GM_config.log("GM_config failed to save settings!\n" + e);
    }
 },
 read: function(store) {
	var val = GM_config.getValue((store || GM_config.storage), '{}');
	switch(typeof val) {
		case "string": var rval = JSON.parse(val); break;
		case "object": var rval = val; break;
		default: var rval = {};
	}
    return rval;
 },
 reset: function(e) {
	e.preventDefault();
	var type, obj = GM_config, fields = obj.settings;
	for(f in fields) {
		var field = obj.frame.contentDocument.getElementById('field_'+f), kids=fields[f].kids;
		if(field.type=='radio'||field.type=='text'||field.type=='checkbox') type=field.type;
		else type=field.tagName.toLowerCase();
		GM_config.doReset(field, type, null, f, null, false);
		if(kids) for(var kid in kids) {
			var field = GM_config.frame.contentDocument.getElementById('field_'+kid);
			if(field.type=='radio'||field.type=='text'||field.type=='checkbox') type=field.type;
				else type=field.tagName.toLowerCase();
			GM_config.doReset(field, type, f, kid, true);
		}
	}
 },
 addToFrame : function(field, i, k) {
	var elem, obj = this, anch = this.frame, value = obj.values[i], Options = field.options, label = field.label, create=obj.create, isKid = (k !== null && k === true);
		switch(field.type) {
				case 'textarea':
					elem = create(isKid ? "span" : "div", {title:field.title||'', kids:new Array(
						create('span', {textContent:label, className:'field_label'}),
						create('textarea', {id:'field_'+i,innerHTML:value, cols:(field.cols?field.cols:20), rows:(field.rows?field.rows:2)})
					), className: 'config_var'});
					break;
				case 'radio':
					var boxes = new Array();
					for (var j = 0,len = Options.length; j<len; j++) {
						boxes.push(create('span', {textContent:Options[j]}));
						boxes.push(create('input', {value:Options[j], type:'radio', name:i, checked:Options[j]==value?true:false}));
					}
					elem = create(isKid ? "span" : "div", {title:field.title||'', kids:new Array(
						create('span', {textContent:label, className:'field_label'}),
						create('span', {id:'field_'+i, kids:boxes})
					), className: 'config_var'});
					break;
				case 'select':
					var options = [];
					if(typeof Options === "object" && typeof Options.push !== "function") for(var j in Options) options.push(create('option',{textContent:Options[j],value:j,selected:(j==value)}));
						else options.push(create("option", {textContent:"Error - \"options\" needs to be a JSON object.", value:"error", selected:"selected"}));
					elem = create(isKid ? "span" : "div", {title:field.title||'', kids:new Array(
						create('span', {textContent:label, className:'field_label'}),
						create('select',{id:'field_'+i, kids:options})
					), className: 'config_var'});
					break;
				case 'checkbox':
					elem = create(isKid ? "span" : "div", {title:field.title||'', kids:new Array(
						create('label', {textContent:label, className:'field_label', "for":'field_'+i}),
						create('input', {id:'field_'+i, type:'checkbox', value:value, checked:value})
					), className: 'config_var'});
					break;
				case 'button':
				var tmp;
					elem = create(isKid ? "span" : "div", {kids:new Array(
						(tmp=create('input', {id:'field_'+i, type:'button', value:label, size:(field.size?field.size:25), title:field.title||''}))
					), className: 'config_var'});
					if(field.script) obj.addEvent(tmp, 'click', field.script);
					break;
				case 'hidden':
					elem = create(isKid ? "span" : "div", {title:field.title||'', kids:new Array(
						create('input', {id:'field_'+i, type:'hidden', value:value})
					), className: 'config_var'});
					break;
				case 'password':
					elem = create(isKid ? "span" : "div", {title:field.title||'', kids:new Array(
						create('span', {textContent:label, className:'field_label'}),
						create('input', {id:'field_'+i, type:'password', value:value, size:(field.size?field.size:25)})
					), className: 'config_var'});
					break;
				default:
					elem = create(isKid ? "span" : "div", {title:field.title||'', kids:new Array(
						create('span', {textContent:label, className:'field_label'}),
						create('input', {id:'field_'+i, type:'text', value:value, size:(field.size?field.size:25)})
					), className: 'config_var'});
			}
	if(field.kids) {
		var kids=field.kids;
		for(var kid in kids) elem.appendChild(obj.addToFrame(kids[kid], kid, true));
	}
return elem;
},
 doSave : function(f, field, type, oldf) {
 var isNum=/^[\d\.]+$/, set = oldf ? GM_config.settings[oldf]["kids"] : GM_config.settings;
 switch(type) {
				case 'text':
					GM_config.values[f] = ((set[f].type=='text') ? field.value : ((isNum.test(field.value) && ",int,float".indexOf(","+set[f].type)!=-1) ? parseFloat(field.value) : false));
					if(set[f]===false) {
						alert('Invalid type for field: '+f+'\nPlease use type: '+set[f].type);
						return;
					}
					break;
				case 'hidden': case 'password':
					GM_config.values[f] = field.value.toString();
					break;
				case 'textarea':
					GM_config.values[f] = field.value;
					break;
				case 'checkbox':
					GM_config.values[f] = field.checked;
					break;
				case 'select':
					GM_config.values[f] = field.options[field.selectedIndex].value;
					break;
				case 'span':
					var radios = field.getElementsByTagName('input');
					if(radios.length>0) for(var i=radios.length-1; i>=0; i--) {
						if(radios[i].checked) GM_config.values[f] = radios[i].value;
					}
					break;
			}
 },
 doSettingValue : function(settings, stored, i, oldi, k) {
		var set = k!=null && k==true && oldi!=null ? settings[oldi]["kids"][i] : settings[i];
			if(",save,open,close".indexOf(","+i) == -1) {
            // The code below translates to:
            // if a setting was passed to init but wasn't stored then 
            //      if a default value wasn't passed through init() then use null
            //      else use the default value passed through init()
            // 		else use the stored value
            try {
            var value = (stored[i]==undefined ? (set["default"]==undefined ? null : set["default"]) : stored[i]);
			} catch(e) {
			var value = (stored[i]=="undefined" ? (set["default"]=="undefined" ? null : set["default"]) : stored[i]);
			}
            
            // If the value isn't stored and no default was passed through init()
            // try to predict a default value based on the type
            if (value === null) {
                switch(set["type"]) {
                    case 'radio': case 'select':
                        value = set.options[0]; break;
                    case 'checkbox':
                        value = false; break;
                    case 'int': case 'float':
                        value = 0; break;
                    default:
					value = (typeof stored[i]=="function") ? stored[i] : "";
                }
			}
			
			}
	GM_config.passed_values[i] = value;
 },
 doReset : function(field, type, oldf, f, k) {
 var isKid = k!=null && k==true, obj=GM_config,
	 set = isKid ? obj.settings[oldf]["kids"][f] : obj.settings[f];
 switch(type) {
			case 'text':
				field.value = set['default'] || '';
				break;
			case 'hidden': case 'password':
				field.value = set['default'] || '';
				break;
			case 'textarea':
				field.value = set['default'] || '';
				break;
			case 'checkbox':
				field.checked = set['default'] || false;
				break;
			case 'select':
				if(set['default']) {
					for(var i=field.options.length-1; i>=0; i--)
					if(field.options[i].value==set['default']) field.selectedIndex=i;
				}
				else field.selectedIndex=0;
				break;
			case 'span':
				var radios = field.getElementsByTagName('input');
				if(radios.length>0) for(var i=radios.length-1; i>=0; i--) {
					if(radios[i].value==set['default']) {
						radios[i].checked=true;
					}
				}
				break;
		}
 },
 values: {},
 settings: {},
 css: {
	 basic: 'body {background:#FFFFFF;}\n' +
	 '.indent40 {margin-left:40%;}\n' +
	 '* {font-family: arial, tahoma, sans-serif, myriad pro;}\n' +
	 '.field_label {font-weight:bold; font-size:12px; margin-right:6px;}\n' +
	 '.block {display:block;}\n' +
	 '.saveclose_buttons {\n' +
	 'margin:16px 10px 10px 10px;\n' +
	 'padding:2px 12px 2px 12px;\n' +
	 '}\n' +
	 '.reset, #buttons_holder, .reset a {text-align:right; color:#000000;}\n' +
	 '.config_header {font-size:20pt; margin:0;}\n' +
	 '.config_desc, .section_desc, .reset {font-size:9pt;}\n' +
	 '.center {text-align:center;}\n' +
	 '.section_header_holder {margin-top:8px;}\n' +
	 '.config_var {margin:0 0 4px 0; display:block;}\n' +
	 '.config_var {font-size: 13px !important;}\n' +
	 '.section_header {font-size:13pt; background:#414141; color:#FFFFFF; border:1px solid #000000; margin:0;}\n' +
	 '.section_desc {font-size:9pt; background:#EFEFEF; color:#575757; border:1px solid #CCCCCC; margin:0 0 6px 0;}\n' +
	 'input[type="radio"] {margin-right:8px;}',
	 stylish: ''
 },
 create: function(a,b) {
	var ret=window.document.createElement(a);
	if(b) for(var prop in b) {
		if(prop.indexOf('on')==0) ret.addEventListener(prop.substring(2),b[prop],false);
		else if(prop=="kids" && (prop=b[prop])) for(var i=0; i<prop.length; i++) ret.appendChild(prop[i]);
		else if(",style,accesskey,id,name,src,href,for".indexOf(","+prop.toLowerCase())!=-1) ret.setAttribute(prop, b[prop]);
		else ret[prop]=b[prop];
	}
	return ret;
 },
 center: function() {
	var node = GM_config.frame, style = node.style, beforeOpacity = style.opacity;
	if(style.display=='none') style.opacity='0';
	style.display = '';
	style.top = Math.floor((window.innerHeight/2)-(node.offsetHeight/2)) + 'px';
	style.left = Math.floor((window.innerWidth/2)-(node.offsetWidth/2)) + 'px';
	style.opacity = '1';
 },
 run: function() {
    var script=GM_config.getAttribute('script');
    if(script && typeof script=='string' && script!='') {
      func = new Function(script);
      window.setTimeout(func, 0);
    }
 },
 addEvent: function(el, ev, scr) {
	if(el) el.addEventListener(ev, function() {
		typeof scr === 'function' ? window.setTimeout(scr, 0) : eval(scr)
	}, false);
},
 remove: function(el) {
	if(el && el.parentNode) el.parentNode.removeChild(el);
},
 toggle : function(e) {
	var node=GM_config.frame.contentDocument.getElementById(e);
	node.style.display=(node.style.display!='none')?'none':'';
	GM_config.setValue(e, node.style.display);
 },
};


//============================引用ここまで===================================



//ユーザー設定(User's settings)-------------------------------------------------------------------------------------

	//検索ボタンの横に設定ボタン追加(Add Config Button beside search button)
	var searchBtn = document.getElementsByName("btnG")[0]			//google
		|| document.getElementsByClassName("b_searchboxForm")[0];	//bing

	if(searchBtn){
		if(location.hostname.match(/bing.com/)) tmpTxt = "top:0px;left:10px;";
		//FirefoxとChromeの表示方式対応(もしかしたら新仕様CSSと変更前の旧仕様CSSの違いかもしれない)
		//Firefox側
		else if(document.getElementById("sblsbb") != null) tmpTxt = "top:-8px;left:30px;";
		else if(searchBtn.className == "sbico-c"){
			searchBtn = document.getElementById("sfdiv");
			tmpTxt = "top:-25px;right:-20px;float:right;";
		//Chrome側(旧仕様)
		}else tmpTxt = "top:8px;left:3px;";

		searchBtn.insertAdjacentHTML('afterend','<img name="setBtn" id="setBtn" type="button" style="position:relative;' + tmpTxt + '" '
		 + 'src="data:image/gif;base64,R0lGODlhCwALAIABAACZ/////yH5BAEAAAEALAAAAAALAAsAAAIaBHKha6j5TmrRIdqmkTLu7HHWVmlMZ5XLWgAAOw==" '
		 + 'title="Config - Change search result for Google and Bing">');


		//設定ボタンクリックで設定画面を呼び出す(Open Config Window,when click the Config Button)
		var setBtn = document.getElementById("setBtn");
		setBtn.addEventListener('click', function(){GM_config.open()}, true);

	}else{
		GM_log("CSR_Error:検索Buttonが見つからない")
	}


	//設定画面(Config Window)
	GM_config.init('Config - Change search result for Google' /* Script title */,
	/* Settings object */
	{
		'hideList': // This would be accessed using GM_config.get('Name')
		{
			'section': ['hideList'],
			'label': '{ NGword : ["word1","word2","word3","word...more"], ignore : ["word4","word5","word...more"] },', // Appears next to field
			'type': 'textarea', // Makes this setting a text field
		        cols: 120,
		        rows: 10,
			'default': '{ NGword : ["","","",""], ignore : ["",""] },\n'
				+ '{ NGword : ["",""], ignore : ["","",""] },\n'
				+ '{ NGword : [""], ignore : [""] },\n'
				+ '{ NGword : ["","",""], ignore : ["",""] },\n'
				+ '{ NGword : [""], ignore : ["","","","",""] },\n'  // Default value if user doesn't change it
		},
		'changeList': // This would be accessed using GM_config.get('Name')
		{
			'section': ['changeList'],
			'label': '{ before : "beforeURL", after : "afterURL" },', // Appears next to field
			'type': 'textarea', // Makes this setting a text field
		        cols: 120,
		        rows: 10,
			'default': '{ before : "scribe.twitter.com", after : "twitter.com" },				//Twitterの表示されないURL(Delete scribe)\n'
				+ '{ before : "zxbtapi.appspot.com", after : "twitter.com" },			//appspot回避(Avoid appspot)\n'
				+ '{ before : "", after : "" },\n'
				+ '{ before : "", after : "" },\n'
				+ '{ before : "", after : "" },\n' // Default value if user doesn't change it
		}
	},
/* chrome非対応のため削除(Delete :this CSS do not work on Chrome)******************************************:
	'.section_header_holder{height:33%;width:80%;}' + //枠
	'#section_1{padding-top:50px;}' + //changeListの枠
	'.section_header.center{background:aliceblue!important;color:black;pointer-events: none;border:none;}' + //タイトル
	'#field_hideList{height:100%;width:100%;resize: none;}' + //hideListテキスト
	'#field_changeList{height:100%;width:100%;resize: none;}' + //changeListテキスト
	'#buttons_holder{width:20%;position:absolute;bottom:10%;right:10px;}', + //セーブ・キャンセル・リセットボタン
	
***************************************************************************************/
	{
	open: function() {
	
	        //config window
	        var cfg_Window = document.getElementById("GM_config");
	
		//リスト全部(list section)=================================================
		var cfg_hideSection = cfg_Window.contentDocument.getElementById("section_0");	//hideList
		var cfg_changeSection = cfg_Window.contentDocument.getElementById("section_1");	//changeList

	        cfg_hideSection.setAttribute("style", "height:33%;width:80%;");
	        cfg_changeSection.setAttribute("style", "height:33%;width:80%;padding-top:50px;");
	
		//section label============================================================
		var cfg_hideLabel = cfg_Window.contentDocument.getElementById("c_section_kids_0");	//hideList
		var cfg_changeLabel = cfg_Window.contentDocument.getElementById("c_section_kids_1");	//changeList
	
	        cfg_hideLabel.setAttribute("style", "background:aliceblue!important;color:black;pointer-events: none;border:none;");
	        cfg_changeLabel.setAttribute("style", "background:aliceblue!important;color:black;pointer-events: none;border:none;");

		//textarea=================================================================
	        var cfg_hideTxt = cfg_Window.contentDocument.getElementById("field_hideList");		//hideList
		var cfg_changeTxt = cfg_Window.contentDocument.getElementById("field_changeList");	//changeList

		//改行無効化
		cfg_hideTxt.setAttribute("wrap", "off");
		cfg_changeTxt.setAttribute("wrap", "off");

		//css
		cfg_hideTxt.setAttribute("style", "height:100%;width:100%;resize: none;");
		cfg_changeTxt.setAttribute("style", "height:100%;width:100%;resize: none;");

		//save cancel==============================================================
	        var cfg_buttonsHolder = cfg_Window.contentDocument.getElementById("buttons_holder");
		
		cfg_buttonsHolder.setAttribute("style", "width:20%;position:absolute;bottom:10%;right:10px;");


		var cfg_body = cfg_Window.contentDocument.getElementsByTagName("body")[0];
		cfgClose(document);
		cfgClose(cfg_body);

		//ESC押したら設定画面閉じる
		function cfgClose(doc){
try{
			doc.onkeydown = function(evt){

				if (evt){
					var kc = evt.keyCode;
				}else{
					var kc = event.keyCode;
				}
//GM_log(kc);
				if(kc!=27){ return; }
				GM_config.close();
			}

}catch(e){
	GM_log("CSR_escClose:"+e);
}
		}//cfgCloseここまで


	}
});


	var cssTxt = '#GM_config{height:100%!important;width:100%!important;z-index:1000!important;}';

	addCSS(cssTxt);


	//GreaseMonkeyとScriptishのオプション追加(add Option)
	GM_registerMenuCommand("Config - Change search result for Google", GM_config.open);


	//変数取得(get variable)
	var hideListSaved = GM_config.get("hideList");
	var changeListSaved = GM_config.get("changeList");

//alert(GM_config.get("hideList"));
//alert(GM_config.get("changeList"));


	
	//最終カンマ削除(delete last comma)
	do{
		hideListSaved = hideListSaved.slice(0, -1);
//alert(hideListSaved.slice(-1));

	}while(hideListSaved.slice(-1) != '}');
	do{
		changeListSaved = changeListSaved.slice(0, -1);
//alert(changeListSaved.slice(-1));

	}while(changeListSaved.slice(-1) != '}');

//alert(hideListSaved);
//alert(changeListSaved);

try{
	//変数セット(set variable)
	hideList = eval("[" + hideListSaved + "]");
	changeList = eval("[" + changeListSaved + "]");

}catch(e){
	GM_log("CSR_変数error" +e);
	return;
}

/*********************** GM_config以前の設定 ***************

	//非表示リスト(Hide result LIST)--------------------------------------------------------------------
	var hideList = [
		{ NGword : ["",""], ignore : ["",""]},

		//以下に追加(Add Location start)**********************************************************************

		{ NGword : ["","","",""], ignore : ["",""] },				//追加サンプル(sample)
		{ NGword : [""], ignore : ["","",""] },					//追加サンプル(sample)
		{ NGword : [""], ignore : [""] },					//追加サンプル(sample)
		{ NGword : ["",""], ignore : ["",""] },					//追加サンプル(sample)
		{ NGword : ["",""], ignore : ["",""] },					//追加サンプル(sample)

		//上に追加(Add Location end)**************************************************************************

		{ NGword : ["",""], ignore : ["",""]}
	];

	//変換リスト(Change URL LIST)----------------------------------------------------------------------
	var changeList = [
		{ before : "scribe.twitter.com", after : "twitter.com" },	//Twitterの表示されないURL(Delete scribe)

		//以下に追加(Add Location start)**********************************************************************

		{ before : "zxbtapi.appspot.com", after : "twitter.com" },	//appspot回避(Avoid appspot)
		{ before : "", after : "" },					//追加サンプル(sample)
		{ before : "", after : "" },					//追加サンプル(sample)
		{ before : "", after : "" },					//追加サンプル(sample)

		//上に追加(Add Location end)**************************************************************************
		{ before : "", after : "" }					//追加サンプル(sample)

	];

	//ユーザ設定から読み込み(Load user's settings)
	var hideListSaved = eval( GM_getValue("hideList"));
	var changeListSaved = eval( GM_getValue("changeList"));

	//ユーザー設定を保存(Save user's settings)
	if(hideList != hideListSaved){
		GM_setValue( "hideList", hideList.toSource() );
	}
	if(changeList != changeListSaved){
		GM_setValue( "changeList", changeList.toSource() );
	}
************************************************************/

}




//For Chrome:Change "GM_setValue & GM_getValue" to WebStrage-------------------------------------------
if (!this.GM_getValue) {
	this.GM_getValue=function (key,def) {
		return window.localStorage.getItem(key);
	};
	this.GM_setValue=function (key,value) {
		return window.localStorage.setItem(key, value);
	};
}

//css追加
function addCSS(css){
	var head = document.getElementsByTagName('head');
	if(!head) return;
	else head = head[0];

	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;

	head.appendChild(style);
}

//For AutoPagerize-----------------------------------------------------------------------------------
document.body.addEventListener('AutoPagerize_DOMNodeInserted',function(evt){
	var node = evt.target;
	handle(node);
}, false);
//For AutoPager--------------------------------------------------------------------------------------
document.body.addEventListener('AutoPagerAfterInsert', function(evt){
	var node = evt.target;
	handle(node);
}, false);
//For AutoPatchWork----------------------------------------------------------------------------------
document.body.addEventListener('AutoPatchWork.DOMNodeInserted', function(evt){
	var node = evt.target;
	handle(node);
}, false);


})();
//=====================================================================================================================