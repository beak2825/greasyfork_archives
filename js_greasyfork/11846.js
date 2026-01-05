// ==UserScript==
// @name		Tumblr-image-sorter-get
// @description	Format file name & save path for current image by its tags
// @version	    1.3.1.0
// @author		Seedmanc
// @namespace	https://github.com/Seedmanc/Tumblr-image-sorter

// @include		http*://*.amazonaws.com/data.tumblr.com/* 
// @include		http*://*.media.tumblr.com/*
//these sites were used by animage.tumblr.com to host original images
// @include		http://scenario.myweb.hinet.net/*										
// @include		http*://mywareroom.files.wordpress.com/*
// @include		http://e.blog.xuite.net/* 
// @include		http://voice.x.fc2.com/*

// @grant 		none 
// @require 	https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @require 	https://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js
// @require 	https://greasyfork.org/scripts/11847-swfstore/code/SwfStore.js?version=77621 
// @require 	https://greasyfork.org/scripts/11848-downloadify-clip/code/Downloadify%20+%20Clip.js?version=68937
// @run-at 		document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/11846/Tumblr-image-sorter-get.user.js
// @updateURL https://update.greasyfork.org/scripts/11846/Tumblr-image-sorter-get.meta.js
// ==/UserScript==
													
// ==Settings=====================================================

	var root=			'E:\\#-A\\!Seiyuu\\';								//Main collection folder
																			//Make sure to use double backslashes instead of single ones everywhere	
	var ms=				'!';												//Metasymbol, denotes folders for categories instead of names, must be their first character
	
	var folders=		{													//Folder and names matching database
		"	!!group	"	:	"		!!group	",								// used both for tag translation and providing the list of existing folders
		"	!!solo	"	:	"		!!solo	",								// trailing whitespaces are voluntary in both keys and values,
		"	!!unsorted"	:	"		!!unsorted	", 							// first three key names are not to be changed, but folder names can be anything
		"	原由実		"	:	"	 !iM@S\\Hara Yumi",					      // subfolders for categories instead of names must have the metasymbol as first symbol
		"	今井麻美	"	:	"	!iM@S\\Imai Asami	",
		"	沼倉愛美	"	:	"	!iM@S\\Numakura Manami",
		"	けいおん!	"	:	"	!K-On	",								 //Category folders can have their own tag, which, if present, will affect the folder choice
		"	日笠陽子	"	:	"	!K-On\\Hikasa Yoko	",					 // for solo and group images
		"	寿美菜子	"	:	"	!K-On\\Kotobuki Minako",
		"	竹達彩奈	"	:	"	!K-On\\Taketatsu Ayana",
		"	豊崎愛生	"	:	"	!K-On\\Toyosaki Aki	",
		"	クリスマス	"	:	"	 !Kurisumasu	",
		"	Lisp	"		:	"	!Lisp	",								//Roman tags can be used as well
		"	阿澄佳奈	"	:	"	!Lisp\\Asumi Kana	",
		"	酒井香奈子	"	:	"	!Lovedoll\\Sakai Kanako",
		"	らき☆すた	"	:	"	!Lucky Star	",
		"	遠藤綾		"	:	"	 !Lucky Star\\Endo Aya	",
		"	福原香織	"	:	"	!Lucky Star\\Fukuhara Kaori",
		"	長谷川静香	"	:	"	!Lucky Star\\Hasegawa Shizuka",
		"	加藤英美里	"	:	"	!Lucky Star\\Kato Emiri	",
		"	今野宏美	"	:	"	!Lucky Star\\Konno Hiromi	", 
		"	井上麻里奈	"	:	"	!Minami-ke\\Inoue Marina	",
		"	佐藤利奈	"	:	"	!Minami-ke\\Sato Rina	",
		"	Petit Milady	":	"	!Petit Milady	", 
		"	悠木碧		"	:	"	 !Petit Milady\\Yuuki Aoi	",
		"	ロウきゅーぶ! "	:	"	!Ro-Kyu-Bu	",
		"	Kalafina 	"	:	"	!Singer\\Kalafina	",
		"	LiSA		"	:	"	!Singer\\LiSA	",
		"	May'n		"	:	"	!Singer\\May'n	", 
		"	茅原実里	"	:	"	!SOS-dan\\Chihara Minori",
		"	後藤邑子	"	:	"	!SOS-dan\\Goto Yuko	",
		"	平野綾		"	:	"	 !SOS-dan\\Hirano Aya	", 
		"	スフィア	"	:	"	 !Sphere	", 
		"	やまとなでしこ "	:	"	!Yamato Nadeshiko	",
		"	堀江由衣	"	:	"	!Yamato Nadeshiko\\Horie Yui",
		"	田村ゆかり	"	:	"	!Yamato Nadeshiko\\Tamura Yukari",
		"	雨宮天	"		:	" 	Amamiya Sora	",
		"	千葉紗子	"	:	"	Chiba Saeko	",
		"	渕上舞		"	:	"	 Fuchigami Mai	",
		"	藤田咲		"	:	"	 Fujita Saki	",
		"	後藤沙緒里	"	:	"	Goto Saori	",
		"	花澤香菜	"	:	"	Hanazawa Kana	",
		"	早見沙織	"	:	"	Hayami Saori	",
		"	井口裕香	"	:	"	Iguchi Yuka	",
		"	井上喜久子	"	:	"	Inoue Kikuko	",
		"	伊藤かな恵	"	:	"	Ito Kanae	",
		"	伊藤静		"	:	"	 Ito Shizuka	",
		"	門脇舞以	"	:	"	Kadowaki Mai	",
		"	金元寿子	"	:	"	Kanemoto Hisako	",
		"	茅野愛衣	"	:	"	Kayano Ai	",
		"	喜多村英梨	"	:	"	Kitamura Eri	",
		"	小林ゆう	"	:	"	 Kobayashi Yuu	",
		"	小清水亜美	"	:	"	Koshimizu Ami	",
		"	釘宮理恵	"	:	"	Kugimiya Rie	",
		"	宮崎羽衣	"	:	"	Miyazaki Ui	",
		"	水樹奈々	"	:	"	Mizuki Nana	",
		"	桃井はるこ	"	:	"	Momoi Haruko	",
		"	中原麻衣	"	:	"	Nakahara Mai	",
		"	中島愛		"	:	"	 Nakajima Megumi	",
		"	名塚佳織	"	:	"	Nazuka Kaori	",
		"	野川さくら	"	:	"	 Nogawa Sakura	",
		"	野中藍		"	:	"	 Nonaka Ai	",
		"	能登麻美子	"	:	"	Noto Mamiko	",
		"	折笠富美子	"	:	"	Orikasa Fumiko	",
		"	朴璐美		"	:	"	 Paku Romi	",
		"	榊原ゆい	"	:	"	Sakakibara Yui	",
		"	坂本真綾	"	:	"	Sakamoto Maaya	",
		"	佐倉綾音	"	:	"	Sakura Ayane	",
		"	沢城みゆき	"	:	"	Sawashiro Miyuki	",
		"	椎名へきる	"	:	"	Shiina Hekiru	",
		"	清水愛		"	:	"	 Shimizu Ai	",
		"	下田麻美	"	:	"	Shimoda Asami	",
		"	新谷良子	"	:	"	Shintani Ryoko	",
		"	白石涼子	"	:	"	Shiraishi Ryoko	",
		"	田中理恵	"	:	"	Tanaka Rie	",
		"	丹下桜		"	:	"	 Tange Sakura	",
		"	東山奈央	"	:	"	Toyama Nao	",
		"	植田佳奈	"	:	"	Ueda Kana	",
		"	上坂すみれ	"	:	"	Uesaka Sumire	",
		"	ゆかな		"	:	"	 Yukana	"
	};

	var ignore=			"歌手, seiyuu, 声優";									//These tags will not count towards any category and won't be included into filename	

	var allowUnicode=	false;												//Whether to allow unicode characters in manual translation input, not tested
	
	var useFolderNames=	true;												//In addition to tags listed in keys of the folders object, recognize also folder names themselves
																			// this way you won't have to provide both roman and kanji spellings for names as separate tags

	var debug=			false;												//Initial debug state, affects creation of flashDBs. Value saved in the DB overrides it after DB init.
	
	var storeUrl=		'//dl.dropboxusercontent.com/u/74005421/js%20requisites/storage.swf';	
																			//Flash databases are bound to the URL, must be same as in the other script
// ==/Settings=========================================================

   tagsDB=null;																//Makes sure databases are accessible from console for debugging
   names=null ;
   meta=null ; 		
var title;
var filename;															
var folder = ''; 
var DBrec='';																//Raw DB record, stringified object with fields for saved flag and tag list
var N=M=T=false;															//Flags indicating readiness of plugins loaded simultaneously
var exclrgxp=/%|\/|:|\||>|<|\?|"|\*/g;										//Pattern of characters not to be used in filepaths
var	downloadifySwf=	'//dl.dropboxusercontent.com/u/74005421/js%20requisites/downloadify.swf';			
																			//Flash button URL

var style={																	//In an object so you can fold it in any decent editor. If only you had that in chrome.
	s:"		 							\
	div#output {						\
		position: absolute;				\
		left: 0;		top: 0;			\
		width: 100px;	height: 30px;	\
	}									\
	div#down {							\
		left: 1px;						\
		position: fixed;				\
		z-index: 98;					\
	}									\
	table#port {						\
		top: 30px;						\
		left: 1px;						\
		position: fixed;				\
		background-color: 				\
			rgba(192,192,192,0.85);		\
		border-bottom: 1px solid black;	\
		z-index: 97;					\
		width: 100px;					\
		border-collapse: collapse;		\
	}									\
	table#translations {				\
		position: absolute;				\
		background-color:				\
			rgba(255,255,255,0.8);		\
		top: 48px;						\
		overflow: scroll;				\
		font-size: 90%;					\
		margin-left: -1px;				\
		width: 103px;					\
		table-layout: fixed;			\
	}									\
	td.settings {						\
		border-left:  1px solid black;	\
		border-right: 1px solid black;	\
	}									\
	a.settings {						\
		text-decoration: none;			\
	}									\
	table, tr {							\
		text-align: center;				\
	}									\
	td#ex {								\
		padding: 0;						\
	}									\
	input.txt {							\
		width: 95%;						\
	}									\
	td.cell, td.radio{					\
		border: 1px solid black;		\
		overflow:	hidden;				\
	}									\
	table.cell {						\
		background-color: 				\
			rgba(255,255,255,0.75);		\
		width: 100%; 					\
		border-collapse: collapse;		\
	}									\
	a {									\
		font-family: Arial;				\
		font-size:   small;				\
	}									\
	th {								\
		border: 0;						\
		color:black;		\
	}									\
	input#submit {						\
		width:  98%;					\
		height: 29px;					\
	}									\
"};																			//This certainly needs optimisation
		
var out=$('<div id="output"><div id="down"></div></div>');					//Main layer that holds the GUI 
var tb =$('<table id="translations">');										//Table for entering manual translation of unknown tags

var	tagcell='<table class="cell"><tr>														\
		<td class="radio"><input type="radio" class="category"  value="name"/></td>			\
		<td class="radio"><input type="radio" class="category"  value="meta"/></td>			\
	</tr><tr>																				\
		<td colspan="2"><a href="#" title="Click to ignore this tag for now" class="ignr">';
																			//Each cell has the following in it:
																			//	two radiobuttons to choose a category for the tag - name or meta
																			//	the tag itself, either in roman or in kanji
																			//		the tag is also a link, clicking which removes the tag from results until refresh
																			//	if the tag is in kanji, cell has a text field to input translation manually
																			// 		if there are also roman tags, they are used as options for quick input into the text field
																			//	if the tag is in roman and consists of two words, cell has a button enabled to swap their order
																			//		otherwise the button is disabled
var tfoot=$('<tfoot><tr><td>														\
	<input type="submit" id="submit" value="submit">								\
</td></tr></tfoot>');														//At the bottom of the table there is the "submit" button that applies changes
var thead=$('<thead><tr><td			>												\
	<table class="cell" style="font-width:95%; font-size:small;">					\
		<tr class="cell"><th class="cell">name</th><th class="cell">meta</th></tr>	\
	</table>																		\
</td></tr></thead>');

tb.append(thead).append(tfoot).hide();

	
port=document.createElement('table');										//Subtable for settings and im/export of tag databases
	row= port.insertRow(0);
	cell=row.insertCell(0);
	cell.setAttribute('class','settings');
	cell.innerHTML=' <a href="##" onclick=toggleSettings() class="settings">- settings -</a> ';	
	row0=port.insertRow(1);
	row0.insertCell(0).innerHTML='<input type="checkbox" id="debug"/> debug';	
	row1=port.insertRow(2);
	row1.insertCell(0).innerHTML=' <a href="###" onclick=ex() id="aex" class="exim">export db</a>';
	row2=port.insertRow(3);	
	row2.insertCell(0).id='ex';
	row3=port.insertRow(4);
	row3.insertCell(0).innerHTML=' <a href="####" onclick=im() id="aim" class="exim">import db</a> ';	
	row4=port.insertRow(5);
	row4.insertCell(0).id='im';
	port.id='port';

window.onerror = function(msg, url, line, col, error) {						//General error handler
   var extra = !col ? '' : '\ncolumn: ' + col;
   extra += !error ? '' : '\nerror: ' + error;								//Shows '✗' for errors in title and also alerts a message if in debug mode
   if (msg.search('this.swf')!=-1) 
	 return true;															//Except for irrelevant errors
   document.title+='✗';
   if (debug)
   	 alert("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);
   var suppressErrorAlert = true;
   return suppressErrorAlert;
};

var xhr = new XMLHttpRequest();												//Redownloads opened image as blob 
	xhr.responseType="blob";												// so that it would be possible to get it via downloadify button
	xhr.onreadystatechange = function() {									// supposedly the image is being taken from cache so it shouldn't cause any slowdown
		if (this.readyState == 4 && this.status == 200) {
			var blob=this.response;
			var reader = new window.FileReader();
			reader.readAsDataURL(blob); 
			reader.onloadend = function() {
				base64data = reader.result;                
				base64data=base64data.replace(/data\:image\/\w+\;base64\,/,"");
				dl(base64data);												//Call the button creation function
		}
	} else if ((this.status!=200)&&(this.status!=0)) {
		if (this.status==404) {
			document.title='Error '+this.status;
			throw new Error('404');
		};
		throw new Error('Error getting image: '+this.status);
	};							
};

function expandFolders(){													 //Complement DB with tags produced from folders names
	var t,rx,x;
	for (var key in folders) {													 
		if (folders.hasOwnProperty(key)&&(['!group','!solo','!unsorted'].indexOf(key)==-1)) { 
			t=folders[key];		
			rx=new RegExp('/^'+String.fromCharCode(92)+ms+'/', '');			
			x=getFileName(t).toLowerCase().replace(rx,'');
			folders[x]=t;
		};
	};													 
}; 	
  
rootrgxp=/^([a-z]:){1}(\\[^<>:"/\\|?*]+)+\\$/gi;
try {
	if (!(rootrgxp.test(root))) 
		throw new Error('Illegal characters in root folder path: "'+root+'"');
	ms=ms[0];																//It's a symbol, not a string, after all
	if ((exclrgxp.test(ms))||(/\\|\s/.test(ms)))  
		throw new Error ('Illegal character as metasymbol: "'+ms+'"');
} catch (err) {
	if (!debug)
		alert(err.name+': '+err.message);									 
	throw err;
};				

function checkMatch(obj,fix){												//Remove trailing whitespace in object keys and values & check correctness of user input 
	fix=fix||false;
  try {																		//make sure that folder names have no illegal characters
	for (var key in obj) {													//Convert keys to lower case for better matching
		if (obj.hasOwnProperty(key)) { 
			t=obj[key].trim().replace(/^\\|\\$/g, '').trim();			
			delete obj[key];
			k=key.trim().toLowerCase();
			obj[k]=t;
			if (exclrgxp.test(obj[k]))  									//Can't continue until the problem is fixed
				if (!fix)
					throw new Error('Illegal characters in folder name entry: "'+obj[k]+'" for name "'+k+'"')
				else
					obj[k]=t.replace(exclrgxp, '-');
		};
	};
  } catch (err) {
	if (!debug)
		alert(err.name+': '+err.message);									//Gotta always notify the user 
	throw err;
  };														//TODO: even more checks here
}; 															

function toggleSettings(){													//Show drop-down menu with settings
	$('table#port td').not('.settings').toggle();
	$('table#translations').css('top',($('table#port').height()+30)+'px');
	sign=$('a.settings').eq(0);
	if (sign.text().search(/\+/,'-')!=-1) {
		sign.text(sign.text().replace(/\+/gi,'-'));
		$('td.settings').css('border-bottom','');
	}
	else {
		sign.text(sign.text().replace(/\-/gi,'+'));
		$('td.settings').css('border-bottom','1px solid black');
	}
};

function debugSwitch(checkbox){												//Toggling debug mode requires page reload
	debug = checkbox.checked;
	tagsDB.set(':debug:',debug );
	location.reload();
};

onDOMcontentLoaded();
function onDOMcontentLoaded(){ 												//Load plugins and databases

	checkMatch(folders);													//Run checks on user-input content and format it
	if (useFolderNames)
		expandFolders();
	ignore=$.map(ignore.split(','), function(v,i){
		return v.trim().toLowerCase();
	});
	
	href=document.location.href;
	if (href.indexOf('tumblr')==-1) 										//If not on tumblr
		if (!(/(jpe?g|bmp|png|gif)/gi).test(href.split('.').pop()))			// check if this is actually an image link
			return;
	$('img').wrap("<center></center>");
	$('body').append(out);

	names = new SwfStore({													//Auxiliary database for names that don't have folders
		namespace: "names",
		swf_url: storeUrl,  
		onready: function(){
			document.title+=(debug)?' NM ':'';
			N=true;
			mutex();
		},
		onerror: function() {
			document.title+=' ✗ names failed to load';}
	});

	meta = new SwfStore({													//Auxiliary DB for meta tags such as franchise name or costume/accessories
		namespace: "meta",
		swf_url: storeUrl,   
		onready: function(){	
			M=true;
			mutex();
		},
		onerror: function() {
			document.title+=' ✗ meta failed to load';}
	});
																			
	tagsDB = new SwfStore({													//Loading main tag database, holds pairs "filename	{s:is_saved?1:0,t:'tag1,tag2,...,tagN'}"
		namespace: "animage",
		swf_url: storeUrl,   
		onready: function(){ 
			document.title+=(debug)?' T ':'';
			debug =(tagsDB.get(':debug:')=='true');							//Override initial debug state with the one stored in DB
			tagsDB.config.debug=debug;
			getTags();
		},
		debug: debug,
		onerror: function() {
			document.title='tagsdb error';
			throw new Error('tagsDB failed to load');
		}
	});										//TODO: delay aux DBs loading until & if they're actually needed? 
};

function getTags(retry){													//Manages tags acquisition for current image file name from db
	DBrec=JSON.parse(tagsDB.get(getFileName(document.location.href)));			// first attempt at getting taglist for current filename is done upon the beginning of image load
	if ((DBrec!=null) || (debug)) {											// if tags are found report readiness
		T=true;																// or if we're in debug mode, proceed anyway
		mutex();		
	} else 
		if ((retry) || (document.readyState=='complete'))					//Otherwise if we ran out of attempts or it's too late 
			return															// stop execution
		else {
			retry=true;														// but if not schedule the second attempt at retrieving tags to image load end
			window.addEventListener('load',function(){ getTags(true);},false);
		};										
};										//TODO: make getTags actually return  the value to main() to get rid of the global var

function mutex(){															//Check readiness of plugins and databases when they're loading simultaneously 
	if (N && M && T) {														// when everything is loaded, proceed further
		N=M=T=false;
		main();
	};
};
	
function main(){ 															//Launch tag processing and handle afterwork
	$("<style>"+style.s+"</style>" ).appendTo( "head" );					//assign functions to events and whatnot
	$('div#output').append(port);	
	toggleSettings();	
	$('input#debug').prop('checked',debug);	
	$('a#aim')[0].onclick=im; 
 	$('a#aex')[0].onclick=ex; 
	$('a.settings')[0].onclick=toggleSettings;
	$('input#debug')[0].onclick=function(){debugSwitch(this);};

	if (debug) 
		$("div[id^='SwfStore_animage_']").css('top','0').css('left','101px').css("position",'absolute').css('opacity','0.7');
											//TODO: make the code above run regardless of found DB record
	$('div#output').append(tb);
	analyzeTags();
	$('input#submit')[0].onclick=submit; 
	$('input.txt').on('change',selected);

	xhr.open("get", document.location.href, true); 							//Reget the image to attach it to downloadify button
	xhr.send();
	
	$(window).load(function(){document.title=title;});
};

function isANSI(s) {														//Some tags might be already in roman and do not require translation
	is=true;
	s=s.split('');
	$.each(s,function(i,v){
		is=is&&(/[\u0000-\u00ff]/.test(v));});
    return is;
};

function analyzeTags() {   													//This is where the tag matching magic occurs
	filename=getFileName(document.location.href, true);
 	if (!DBrec) return;														// if there are any tags, that is
	folder='';

    if (debug)
		document.title=JSON.stringify(DBrec,null,' ')+' '					//Show raw DB record 
	else
		document.title='';												
	
	tags=DBrec.t.split(',');
 
	fldrs=[];
	nms=[];
	mt=[];
	ansi={}
	rest=[];
	
	tags=$.map(tags,function(v,i){											//Some formatting is applied to the taglist before processing

		v=v.replace(/’/g,"\'").replace(/"/g,"''");					
		v=v.replace(/\\/g, '-');									
		v=v.replace(/(ou$)|(ou )/gim,'o ').trim();							//Eliminate variations in writing 'ō' as o/ou at the end of the name in favor of 'o'
																			// I dunno if it should be done in the middle of the name as well		
		sp=v.split(' ');	
		if (sp.length>1) 
			$.each(tags, function(ii,vv){
				if (ii==i) return true;
				if (sp.join('')==vv) 
					return v=false;											//Some bloggers put kanji tags both with and without spaces, remove duplicates with spaces
				}
			); 
		
		if (!v) 
			return null;
																
		if ((ignore.indexOf(v)!=-1)||(ignore.indexOf(v.split(' ').reverse().join(' '))!=-1))
			return null														//Remove ignored tags so that they don't affect the tag amount
		else return v;
	});		
																			//1st sorting stage, no prior knowledge about found categories
	$.each(tags, function(i,v){ 											//Divide tags for the image into 5 categories
		if (folders.hasOwnProperty(v)) 										//	the "has folder" category
			fldrs.push(folders[v])
		else if (names.get(v)) 												//	the "no folder name tag" category
			nms.push(names.get(v))
		else if (meta.get(v))												//	the "no folder meta tag" category,
			mt.push(meta.get(v))											// which doesn't count towards final folder decision, but simply adds to filename
		else if (isANSI(v)) {											
			if (tags.length==1)												//If the tag is already in roman and has no folder it might be either name or meta
				nms.push(v)													//if it's the only tag it is most likely the name
			else {															//	otherwise put it into the "ansi" category that does not require translation
				splt=v.split(' ');
				if (splt.length==2)	{										//Some bloggers put tags for both name reading orders (name<->surname),
					rvrs=splt.reverse().join(' ');
					if (names.get(rvrs)) {									// thus creating duplicating tags
						nms.push(names.get(rvrs))							// try to find database entry for reversed order first,
						return true;									
					}
					else if (ansi.hasOwnProperty(rvrs))									// then check for duplicates		
						return true;
				}
				ansi[v]=true;											
			};
		}				 
		else 
			rest.push(v);													//	finally the "untranslated" category
	});
																			//2nd sorting stage, now we know how many tags of each category there are
																			//It's time to filter the "ansi" category further
	$.each(fldrs.concat(nms.concat(mt)), function(i,v){						//Some bloggers put both kanji and translated names into tags
		rx=new RegExp('/^'+String.fromCharCode(92)+ms+'/', '');
		x=getFileName(v).toLowerCase().replace(rx,'');
		y=x.split(' ').reverse().join(' ');									// check if we already have a name translated to avoid duplicates
		delete ansi[x];														//I have to again check for both orders even though I deleted one of them before,
		delete ansi[y];														// but at the time of deletion there was no way to know yet which one would match the kanji tag
	});																		//This also gets rid of reverse duplicates between recognized tags and ansi
	fldrs=mkUniq(fldrs);	
	nms=$(nms).not(fldrs).get();											//subtract fldrs from nms if they happen to have repeating elements
	fldrs2=[];			
	
	fldrs=$.grep(fldrs,function(v,i){										//A trick to process folders for meta tags, having subfolders for names inside
		fmeta=getFileName(v);
		if ((fmeta.indexOf(ms)==0)) {										// such folders must have the metasymbol as the first character
			fldrs2.push(fmeta);
			if (fldrs.concat(nms).length==1)								//In the rare case when there are no name tags at all we put the image to meta folder
				folder+=v+'\\'												// no need to put meta tag into filename this way, since the image will be in the same folder
			else
				mt.push(fmeta.replace(ms,''));	 							//usually it needs to be done though
			return false;													//exclude processed meta tags from folder category
			}
		else
			return true;													//return all the non-meta folder tags
		}
	);
	if (fldrs2.length==1) {													//Make sure only one folder meta tag exists
		folders['!!solo']=fldrs2[0];										//replace solo folder with metatag folder, so the image can go there if needed,
		folders['!!group']=fldrs2[0];										// same for group folder (see 3rd sorting stage)
	};		
	
	fldrs2=$.map(fldrs,function(vl,ix){
		return getFileName(vl);												//Extract names from folder paths
	});		
	
	mt=mt.concat(Object.keys(ansi));										//Roman tags have to go somewhere until assigned a category manually	
	filename=(mkUniq(fldrs2.concat(nms)).concat(['']).concat(mkUniq(mt)).join(',').replace(/\s/g,'_').replace(/\,/g,' ')+' '+filename).trim();																	
																			//Format the filename in a booru-compatible way, replacing spaces with underscores,
																			// first come the names alphabetically sorted, then the meta sorted separately 
																			// and lastly the original filename;		
																			// any existing commas will be replaced with spaces as well	
																			//this way the images are ready to be uploaded to boorus using the mass booru uploader script
																		
	unsorted=(rest.length>0)||(Object.keys(ansi).length>0);					//Unsorted flag is set if there are tags outside of 3 main categories  
	
																			//Final, 3rd sorting stage, assign a folder to the image based on found tags and categories
	nms=mkUniq(nms);
	if (unsorted)  {														//If there are any untranslated tags, make a table with text fields to provide manual translation
		var fn=rest.reduce(function (fn, v){
			return fn+' '+'['+v.replace(/\s/g,'_')+']';						// such tags are enclosed in [ ]  in filename for better searchability on disk
		},'');	
		buildTable(ansi, rest);
		folder=folders["!!unsorted"]+'\\';   								//Mark image as going to "unsorted" folder if it still has untranslated tags
		filename=fn+' '+filename;
		document.title+='? ';												//no match ;_;
	} else											//TODO: option to disable unsorted category if translations are not required by user
	 if ((fldrs.length==1)&&(nms.length==0)){								//Otherwise if there's only one tag and it's a folder tag, assign the image right there
		folder=fldrs[0]+'\\';
		filename=filename.split(' ');
		filename.shift();													//Remove the folder name from file name since the image goes into that folder anyway
		filename=filename.join(' ').trim();
		document.title+='✓ '; 												//100% match, yay
	} else
	 if ((fldrs.length==0)&&(nms.length==1)){								//If there's only one name tag without a folder for it, goes into default "solo" folder
		folder=folders['!!solo']+'\\'; 										// unless we had a !meta folder tag earlier, then the solo folder 
																			// would have been replaced with the appropriate !meta folder
	} else 
	 if (nms.length+fldrs.length>1)											//Otherwise if there are several name tags, folder or not, move to the default "group" folder
		folder=folders['!!group']+'\\';										// same as the above applies for meta
	filename=filename.replace(exclrgxp, '-').trim();						//Make sure there are no forbidden characters in the resulting name 
	document.title+=' \\'+folder+filename;
	folder=(root+folder).replace(/\\\\/g,'\\');								//If no name or folder tags were found, folder will be set to root directory
	
	if (DBrec.s=='1') document.title='♥ '+document.title;					//Indicate if the image has been marked as saved before
	title=document.title; 
};

function buildTable(ansi, rest) {											//Create table of untranslated tags for manual translation input
	tb.show(); 
	options='';
	tbd=tb[0].appendChild(document.createElement('tbody'));
	$.each(ansi, function(i,v){												//First process the unassigned roman tags
		row1=tbd.insertRow(0);
		cell1=row1.insertCell(0);  
		cell1.id=i;
		swp='<input type="button" value="swap"  id="swap" />'
		cell1.innerHTML=tagcell+i+'</a><br>'+swp+'</td></tr></table>'; 
		if (i.split(' ').length!=2)											//For roman tags consisting of 2 words enable button for swapping their order
			$(cell1).find('input#swap').attr('disabled','disabled');		// script can't know which name/surname order is correct so the choice is left to user
		$(cell1).attr('class','cell ansi');
		$(cell1).find('input[type="radio"]').attr('name',i);			
		options='<option value="'+i+'"></option>'+options;					//Populate the drop-down selection lists with these tags
		$(cell1).find('input#swap').on('click',function(){swap(this);});
	});																		// so they can be used for translating kanji tags if possible
 
	$.each(rest, function(i,v){												//Now come the untranslated kanji tags
		row1=tbd.insertRow(0);
		cell1=row1.insertCell(0); 
		cell1.id=v;
		cell1.innerHTML=tagcell+v+'</a><br><input list="translation" size=10 class="txt"/>\
			<datalist id="translation">'+options+'</datalist></td></tr></table>'; 
		$(cell1).attr('class','cell kanji');
		$(cell1).find('input[type="radio"]').attr('name',v);				//In case the blogger provided both roman tag and kanji tag for names,
	}); 																	// the user can simply select one of roman tags for every kanji tag as translation
																			// to avoid typing them in manually. Ain't that cool?		
 	$.each($('a.ignr'),function(i,v){v.onclick=function(){ignor3(this);};}); 
};

function ignor3(anc){														//Remove clicked tag from results for current session (until page reload)
	ignore.push(anc.textContent);											// this way you don't have to fill in the "ignore" list, 
																			// while still being able to control which tags will be counted
	tdc=$(anc).parent().parent().parent().parent().parent().parent();		//a long way up from tag link to tag cell table					
	tdc.attr('hidden','hidden');
	tdc.attr('ignore','ignore');	

	$.each($('datalist').find('option'), function(i,v){						//Hide these tags from the drop-down lists of translations too
		if (v.value==anc.textContent)										 
			v.parentNode.removeChild(v);								 
		}																 
	);
};

function swap(txt){															//Swap roman tags consisting of 2 words
																		
	data=$('datalist');														// these are most likely the names so they can have different writing orders
	set=[];
	theTag=$(txt).prev().prev()[0];
	$.each(data.find('option'), function(i,v){
		if (v.value==theTag.textContent)
			set.push(v);													//Collect all options from drop-down lists containing the tag to be swapped
		}
	);
	swapped=theTag.textContent.split(' ').reverse().join(' ');

	theTag.textContent=swapped;
	tdc=$(txt).parent().parent().parent().parent().parent();				//Change ids of tag cells as well
	tdc.prop('swap',!tdc.prop('swap'));										//mark node as swapped
	$.each(set,function(i,v){
		v.value=swapped;													//apply changes to the quick selection lists too
		}
	);
};

function selected(e){														//Hide the corresponding roman tag from results when it has been selected 
	$(e.target).css('background-color','');
	ansi=$('td.ansi');														// as a translation for kanji tag
	kanji=$('td.kanji').find('input.txt');									//that's not a filename, fyi
	knj={};
	$.each(kanji,function(i,v){
		knj[v.value]=true;
		$.each(ansi,function(ix,vl){ 										//Have to show a previously hidden tag if another was selected
			if (vl.textContent.trim()==v.value.trim())
				$(vl).parent().attr('hidden','hidden');
		});
	});
	$.each(ansi,function(ix,vl){
		if ((!knj.hasOwnProperty(vl.textContent.trim()))&&(!$(vl).parent().attr('ignore')))
			$(vl).parent().removeAttr('hidden');
	});
	var test={tag:e.target.value};
	checkMatch(test, true);
	if (test.tag!=e.target.value) {
		$(e.target).css('background-color','#ffff00');
		e.target.value=test.tag;
	}
}

function mkUniq(arr){														//Sorts an array and ensures uniqueness of its elements
	to={};
	$.each(arr, function(i,v){
		to[v.toLowerCase()]=true;});
	arr2=Object.keys(to);
	return arr2.sort();														//I thought key names are already sorted in an object but for some reason they're not
};

function getFileName(fullName, full){										//Source URL processing for filename
	full=full || false;
	fullName=fullName.replace(/(#|\?).*$/gim,'');							//first remove url parameters
	if (fullName.indexOf('xuite')!=-1) {									//This blog names their images as "(digit).jpg" causing filename collisions
		i=fullName.lastIndexOf('/');
		fullName=fullName.substr(0,i)+'-'+fullName.substr(i+1);				// add parent catalog name to the filename to ensure uniqueness
	}
	else if ((fullName.indexOf('amazonaws')!=-1)&&(!full))  				//Older tumblr images are weirdly linked via some encrypted redirect to amazon services,
		fullName=fullName.substring(0,fullName.lastIndexOf('_')-2);			// where links only have a part of the filename without a few last symbols and extension,
																			// have to match it here as well, but we need full filename for downloadify, thus the param
	if ((fullName.indexOf('tumblr_')!=-1)&&!full) 
		fullName=fullName.replace(/(tumblr_)|(_\d{2}\d{0,2})(?=\.)/gim,'');
	fullName=fullName.replace(/\\/g,'/');									//Function is used both for URLs and folder paths which have opposite slashes
	return fullName.split('/').pop();
};

function dl(base64data){													//Make downloadify button with base64 encoded image file as parameter
																			// which will both cause save file dialog with custom filename and copy save path to clipboard
	Downloadify.create( 'down'  ,{
		filename: function(){ return filename;}, 							//is this called "stateless"?
		data: base64data, 
		dataType: 'base64',
		downloadImage: '//dl.dropboxusercontent.com/u/74005421/js%20requisites/downloadify.png',
		onError: function(){ throw new Error('Downloadify error');},
		onComplete: onCmplt,
		swf:  downloadifySwf,
		width: 100,
		height: 30,
		transparent: true,
		append: true,
		textcopy: function(){ if (DBrec) {return folder+filename;} else return '';}	
	});																		//If no database record is found, don't change the clipboard
};

function onCmplt(){															//Mark image as saved in the tag database
	if (DBrec)	{															// it is used to mark saved images on tumblr pages
		DBrec.s='1';							
		tagsDB.set(getFileName(document.location.href), JSON.stringify(DBrec));
		document.title='♥ '+document.title;									//Actually I wanted to put a diskette symbol there,
	};																		// but because chromse sucks it does not support extended unicode in title
}

function submit(){															//Collects entered translations for missing tags
	tgs=$('td.cell');														//saves them to databases and relaunches tag analysis with new data
	$('input.category').parent().parent().css("background-color","");
	missing=false;
	$.each(tgs,function(i,v){
		if ($(v).parent().attr('ignore')) {
			ignore.push(v.id);												//Mark hidden tags as ignored
			return true;
		};
		if ($(v).parent().attr('hidden'))
			return true;
		tg=$(v).find('input.txt');
		if (tg.length)
			tg=tg[0].value.trim();											//found translation tag
		else {
			tg=v.textContent.trim(); 											//found roman tag
			if ($(v).prop('swap')) {
				t=DBrec.t.replace(tg.split(' ').reverse().join(' '),tg);
				DBrec.t=t;													//Apply swap changes to the current taglist
			};
		}											//TODO: add checks for existing entries in another DB?
		cat=$(v).find('input.category');
		if (tg.length){
			if (!isANSI(tg)&&!allowUnicode) {
				$(v).find('input.txt').css("background-color","#ffb080");
				missing=true;												//Indicate unicode characters in user input
			} 
			else if (cat[0].checked) 										//name category was selected for this tag
				names.set(v.textContent.trim().toLowerCase(),tg)		
			else if (cat[1].checked)										//meta category was selected
				meta.set(v.textContent.trim().toLowerCase(), tg)
			else { 															//no category was selected, indicate missing input
				$(cat[0].parentNode.parentNode ).css("background-color","#ff8080");
				missing=true;
			}
		}
		else {
			$(v).find('input.txt').css("background-color","#ff8080");
			missing=true;													//no translation was provided, indicate missing input
			return true;
			}
		}
	);						
	tbd=$('#translations > tbody')[0];
	if (!missing){
		tbd.parentNode.removeChild(tbd);
		tb.hide();
		analyzeTags();
	};
};

function ex(){																//Export auxiliary tag databases as a text file
	Downloadify.create('ex' ,{
		filename: 'names&meta tags DB.txt', 
		data: function(){
			xport={names:names.getAll(), meta:meta.getAll()};
			return JSON.stringify(xport, null, '\t');
		},
		dataType:'string',
		downloadImage: '//dl.dropboxusercontent.com/u/74005421/js%20requisites/downloadify2.png',
		onError: function(){  throw new Error('Downloadify2 error');},
		swf:  downloadifySwf,
		width: 100,
		height: 30,
		transparent: true,
		append: false,
		textcopy: ''	
	});	
	$('a.exim')[0].removeAttribute('onclick');
	$('a#aex')[0].textContent=''; 
};	

function im(){																//Import auxiliary tag databases as text file
	$('#im').append('<input type="file" id="files" style="width:97px;" accept="text/plain"/>'); 
	$('input#files')[0].onchange=handleFileSelect; 
	$('a.exim')[1].removeAttribute('onclick');	
	$('a#aim')[0].textContent=''; 
};

function handleFileSelect(evt) {											//Fill in databases with data from imported file
    var file = evt.target.files[0]; 
	
	$('input#files')[0].value='';
	if (file.type!='text/plain') {
		alert('Wrong filetype: must be text');
		return false;
	};
	var reader = new FileReader();
	reader.onloadend = function(e) {
		clear=confirm('Would you like to clear existing databases before importing?');
	  try {	
		o=JSON.parse(e.target.result);
	  } catch(err){
		alert('Error: '+err.message);
		return false;
	  };
	    if (o.meta) {
			checkMatch(o.meta);
			if (clear) 
				meta.clearAll();
			$.each(o.meta, function(i,v){
				meta.set(i,v);});
		}
		else
			alert('No meta DB found');
	    if (o.names) {
			checkMatch(o.names);
			if (clear) 
				names.clearAll();
			$.each(o.names, function(i,v){
				names.set(i,v);});
		}
		else
			alert('No names DB found');				
	};
    reader.readAsText(file);
};
//TODO: add save button activation via keyboard
//TODO: improve the button: open assigned folder directly, use modern dialog
//TODO: ^ try to set last used directory in flash save dialog so as to avoid clipboard usage
//TODO: add fallback to the tumblr hosted image if link url fails (requires storing post id and blog name)
//TODO: add checks for common mistakes in unicode names like 実/美 & 奈/菜
//TODO: option to disable unsorted category if translations are not required by user 