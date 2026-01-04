// ==UserScript==
// @name        pakku.user.js
// @description GreaseMonkey version of pakku.js.
// @include     *://*.bilibili.com/*
// @version     1.1
// @grant       none
// @namespace me.fts.pakkujs
// @downloadURL https://update.greasyfork.org/scripts/30601/pakkuuserjs.user.js
// @updateURL https://update.greasyfork.org/scripts/30601/pakkuuserjs.meta.js
// ==/UserScript==

(function(){

// Configuration
// I am too lazy to add configuration UI :)

THRESHOLD=20;
TRIM_ENDING=true;
TAOLUS=[[/^23{2,}$/,"233..."],[/^6{3,}$/,"666..."],[/^[fF]+$/,"FFF..."],[/^[hH]+$/,"hhh..."]];
REMOVE_SEEK=true;
PROC_TYPE7=true;
MAX_COSINE=80;
MAX_DIST=3;
TRIM_ENDING=true;
TRIM_SPACE=true;
WHITELIST=[];
DANMU_MARK='suffix';
ENLARGE=true;

//Unused in script:
/*
DANMU_BADGE
FLASH_NOTIF
POPUP_BADGE
//*/

function fromholyjson(txt) {
	var item=JSON.parse(txt);
	for(var i in item)
		item[i][0]=RegExp(item[i][0]);
	return item;
}
function toholyjson(obj) {
	var item=[];
	for(var i in obj)
		item.push([obj[i][0].source,obj[i][1]]);
	return JSON.stringify(item);
}




// Copied from edit_distance.js

var ed_counts = new Int16Array (0x10ffff);
var ed_a = new Int16Array (1048576);
var ed_b = new Int16Array (1048576);
var ed_t = new Int32Array (2048);

var MIN_DANMU_SIZE=10;

function hash(a, b) {
	return ((a<<10)^b)&1048575;
}

function edit_distance (P, Q) {
	'use strict';
	// TODO: Make this less hacky

	if (P.length + Q.length < MIN_DANMU_SIZE)
		return (MAX_DIST + 1) * +(P != Q);

	for (var i = 0; i < P.length; i ++) ed_counts [P.charCodeAt (i)] ++;
	for (var i = 0; i < Q.length; i ++) ed_counts [Q.charCodeAt (i)] --;

	var ans = 0;

	for (var i = 0; i < P.length; i ++) {
		ans += Math.abs (ed_counts[P.charCodeAt (i)]);
		ed_counts[P.charCodeAt (i)] = 0;
	}

	for (var i = 0; i < Q.length; i ++) {
		ans += Math.abs (ed_counts[Q.charCodeAt (i)]);
		ed_counts[Q.charCodeAt (i)] = 0;
	}

	return ans;
}

function cosine_distance (P, Q) {

	'use strict';

	var ed_t_p = 0;

	ed_a[hash(P.charCodeAt(P.length - 1), P.charCodeAt(0))] = 1;
	ed_b[hash(Q.charCodeAt(Q.length - 1), Q.charCodeAt(0))] = 1;

	ed_t[ed_t_p++] = hash(P.charCodeAt(P.length - 1), P.charCodeAt(0));
	ed_t[ed_t_p++] = hash(Q.charCodeAt(Q.length - 1), Q.charCodeAt(0));
	for (var i = 0; i < P.length - 1; i++) {
		var h1 = hash(P.charCodeAt(i), P.charCodeAt(i + 1));
		ed_t[ed_t_p++] = h1;
		ed_a[h1] += 1;
	}
	for (var i = 0; i < Q.length - 1; i++) {
		var h1 = hash(Q.charCodeAt(i), Q.charCodeAt(i + 1));
		ed_t[ed_t_p++] = h1;
		ed_b[h1] += 1;
	}
	var data = Array();

	var x = 0, y = 0, z = 0;

	for (var i = 0; i < ed_t_p; i++) {
		var h1 = ed_t[i];
		if (ed_a[h1]) {
			y += ed_a[h1] * ed_a[h1];
			if (ed_b[h1]) {
                x += ed_a[h1] * ed_b[h1];
                z += ed_b[h1] * ed_b[h1];
				ed_b[h1] = 0;
			}
			ed_a[h1] = 0;
		}
		else {
			if (ed_b[h1]) {
                z += ed_b[h1] * ed_b[h1];
				ed_b[h1] = 0;
			};
			
		}
	}
	//console.log(x,y,z);
	return x * x / y / z;
}

function similar(P,Q) {
	return edit_distance(P,Q)<=MAX_DIST || cosine_distance(P,Q)*100>=MAX_COSINE;
}

// Copied from core.js

var trim_ending_re=/^(.+?)[\.。,，/\?？!！~～@\^、+=\-_♂♀ ]*$/;
var trim_space_re=/[ 　]/g;
var LOG_VERBOSE=true;

function parse(old_dom,tabid) {
	TAOLUS_len=TAOLUS.length;
	WHITELIST_len=WHITELIST.length;
	
	  //chrome.browserAction.setTitle({
	  //		title: '正在处理弹幕…', // if u can see this, pakku might not be working correctly :)
		//	  tabId: tabid
		//});
	
	console.time('parse');
	
	function enlarge(size,count) {
		return count<=10 ? size : Math.floor(size*Math.log10(count));
	}

	
	function make_mark(txt,cnt) {
		return DANMU_MARK=='suffix' ? txt+' [x'+cnt+']' :
			   DANMU_MARK=='prefix' ? '[x'+cnt+'] '+txt : txt;
	}
	
	function detaolu(text) {
		for(var i=0;i<TAOLUS_len;i++)
			if(TAOLUS[i][0].test(text))
				return TAOLUS[i][1];
		text = TRIM_ENDING ? text.replace(trim_ending_re,'$1') : text;
		text = TRIM_SPACE ? text.replace(trim_space_re,'') : text;
		return text;
	}
	
	function whitelisted(text) {
		for(var i=0;i<WHITELIST_len;i++)
			if(WHITELIST[i][0].test(text))
				return true;
		return false;
	}
	
	function ext_special_danmu(text) {
		try {
			return JSON.parse(text)[4];
		} catch(e) {
			return text;
		}
	}
	
	function build_text(elem) {
		var count=elem.count;
		var dumped=null;
		if(elem.mode=='7') // special danmu, need more parsing
			try {
				dumped=JSON.parse(elem.orig_str);
			} catch(e) {}
		
		if(dumped) {
			dumped[4]=count==1?dumped[4]:make_mark(elem.str,count);
			return JSON.stringify(dumped);
		} else // normal case
			return count==1?elem.orig_str:make_mark(elem.str,count);
	}

	var parser=new DOMParser();
	var dom=parser.parseFromString(old_dom,'text/xml');
	var new_dom=parser.parseFromString('<i></i>','text/xml');
	var i_elem=new_dom.childNodes[0];

	var danmus=[];
	[].slice.call(dom.childNodes[0].children).forEach(function(elem) {
		if(elem.tagName=='d') { // danmu
			var attr=elem.attributes['p'].value.split(',');
			var str=elem.childNodes[0] ? elem.childNodes[0].data : '';

			if(!PROC_TYPE7 && attr[1]=='7') // special danmu
				i_elem.appendChild(elem);
			else if(attr[1]=='8') { // code danmu
				if(REMOVE_SEEK && str.indexOf('Player.seek(')!=-1)
					elem.childNodes[0].data='/* player.seek filtered by pakku */';
				i_elem.appendChild(elem);
			} else if(whitelisted(str)) {
				i_elem.appendChild(elem);
			} else
				danmus.push({
					attr: attr, // thus we can build it into new_dom again
					str: attr[1]=='7' ? detaolu(ext_special_danmu(str)) : detaolu(str),
					time: parseFloat(attr[0]),
					orig_str: str,
					mode: attr[1],
					count: 1,
				});
		} else
			i_elem.appendChild(elem);
	});
	danmus.sort(function(x,y) {return x.time-y.time;});

	var danmu_chunk=Array();
	var last_time=0;
	var counter=0;

	function apply_item(dm) {
		counter+=dm.count-1;
		var d=new_dom.createElement('d');
		var tn=new_dom.createTextNode(build_text(dm));

		d.appendChild(tn);
		if(ENLARGE)
			dm.attr[2]=''+enlarge(parseInt(dm.attr[2]),dm.count);
		d.setAttribute('p',dm.attr.join(','));
		i_elem.appendChild(d);
	}
	
	danmus.forEach(function(dm) {
		while(danmu_chunk.length && dm.time-danmu_chunk[0].time>THRESHOLD)
			apply_item(danmu_chunk.shift());
		
		for(var i=0;i<danmu_chunk.length;i++) {
			if(similar(dm.str,danmu_chunk[i].str)) {
				if(LOG_VERBOSE) {
					if(edit_distance(dm.str,danmu_chunk[i].str)>MAX_DIST)
						console.log('cosine_dis',dm.str,'to',danmu_chunk[i].str);
					else
						console.log('edit_dis',dm.str,'to',danmu_chunk[i].str);
				}
				danmu_chunk[i].count++;
				return; // aka continue
			}
		}
		danmu_chunk.push(dm);
	});
	for(var i=0;i<danmu_chunk.length;i++)
		apply_item(danmu_chunk[i]);

	//setbadge((
	//        POPUP_BADGE=='count' ? ''+counter :
	//        POPUP_BADGE=='percent' ? (danmus.length ? (counter*100/danmus.length).toFixed(0)+'%' : '0%') :
	//        ''
	//    ),SUCCESS_COLOR,tabid
	//);
	//chrome.browserAction.setTitle({
	//    title: '已过滤 '+counter+'/'+danmus.length+' 弹幕',
	//    tabId: tabid
	//});
	var serializer=new XMLSerializer();
	console.timeEnd('parse');
	return [serializer.serializeToString(new_dom), new_dom];
}

// Hijacking XMLHttpRequest to make this script work

WINDOW = window;
if(WINDOW._fts_xhr)return;
WINDOW._fts_xhr = WINDOW.XMLHttpRequest;
WINDOW.XMLHttpRequest = function() {
	//cannot use apply directly since we want a 'new' version
	var wrapped = new(Function.prototype.bind.apply(WINDOW._fts_xhr, arguments));

	wrapped.addEventListener("readystatechange", function () {
		var r;
		try{
			if(wrapped.readyState == 4) {
				//console.log(wrapped);
				if( wrapped.responseURL.match(/^(https:|http:|)?(\/\/)?comment.bilibili.com\/.*\.xml/)) {
					console.log("processing danmoku", wrapped);
						r = parse(wrapped.response, 0);
						Object.defineProperty(wrapped, 'responseText', {
							writable: true
						});
						Object.defineProperty(wrapped, 'responseXML', {
							writable: true
						});
						Object.defineProperty(wrapped, 'response', {
							writable: true
						});
						wrapped.responseXML = r[1];
						wrapped.responseText = r[0];
						wrapped.response = r[0];
				}
			}
		} catch(e) {
			console.log(e, r);
		}
	});
	//*/

	return wrapped;
};
console.log("r1 loaded");


})();
