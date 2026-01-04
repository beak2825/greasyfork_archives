// ==UserScript==
// @name              LEORChn-Helper
// @name:zh-CN        瑞兽谷辅助脚本
// @description       DO NOT TRUST - Dynamic link library for permission elevation at leorchn.github.io
// @description:zh-CN 请 勿 安 装！- 瑞兽谷扩展功能包，用于提权实现相应功能。
// @include           https://leorchn.github.io/workshop/*
// @include           https://127.0.0.1:1101/workshop/*
// @include           https://127.0.0.1:81/workshop/*
// @namespace         https://greasyfork.org/users/159546
// @version           1.0
// @author            LEORChn
// @run-at            document-end
// @grant             GM_xmlhttpRequest

// @connect           gateway.live-a-hero.jp
// @connect           raw.githubusercontent.com
// @connect           d1itvxfdul6wxg.cloudfront.net

// @connect           baidu.com
// @connect           bilibili.com

// @downloadURL https://update.greasyfork.org/scripts/424781/LEORChn-Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/424781/LEORChn-Helper.meta.js
// ==/UserScript==

unsafeWindow['http'] = http;
unsafeWindow['httpj'] = httpj;
try{
    unsafeWindow.onHelperMain();
}catch(e){}

function http(){
    var args = Array.prototype.slice.call(arguments);
    if(args.length == 1 && args[0] instanceof Array) args = args[0];
    var pointer = 0,
		method, url, headers, formdata, dofun, dofail, onprogress,
        responseType = '';
	args.forEach(function(e){
		switch(pointer){
			case 0:
				e = e.split(' ', 2); // 允许在第一个参数中用空格将 http-method 与 url 隔开，而省去 引号+逗号+引号 的麻烦
				method = e[0].toUpperCase();
				if(e.length > 1){
					pointer++; // 偏移到下一个
					e = e[1];
				}else break;
			case 1: url = e; break;
            case 2:
            case 3:
				if(e instanceof Function){ // 允许不添加 http-body 而直接撰写行为。
					pointer = 4; // 偏移到function
				}else{
                    if(pointer == 2)
                        headers = e;
                    else if(pointer == 3)
                        formdata = e;
					break;
				}
            case 4:
                if(e.name == 'ArrayBuffer'){
                    responseType = 'arraybuffer';
                    break;
                }else pointer++;
			case 5: dofun = e; break;
			case 6: dofail = e; break;
			case 7: onprogress = e;
		}
		pointer++;
	});
    console.log('%c'+method+' '+url+(headers? '\n'+headers: '')+(formdata? '\n\n'+formdata: ''), 'color:#ccc');
    GM_xmlhttpRequest({
        method: method,
        url: url,
        data: formdata,
        headers: getHeaders(headers),
        responseType: responseType,
        onload: dofun,
        onerror: dofail
    });
}
function pl(s){console.log(s);}
function httpj(){
    var args = Array.prototype.slice.call(arguments);
    var originFunction;
    for(var i=0; i<args.length; i++){
        if(!(args[i] instanceof Function)) continue;
        originFunction = args[i];
        args[i] = function(){
            var j,
				stat = this.status,
                resp = this.responseText;
            try{
                j = JSON.parse(resp || '{}');
            }catch(e){console.debug('json cannot parse?\n' + j);}
            if(Array.isArray(j)) // JSON Array
				j = { httpstat:stat, data:j }
			else if(j instanceof Object) // JSON Object
				j.httpstat = stat;
			else // Nothing, text/plain
				j = { httpstat:stat, data:resp }
            originFunction(j);
        };
        break;
    }
    http(args);
}
function getHeaders(t){
    var obj = {};
    if(!t) return obj;
    t.split('\n').forEach(function(e){
        var res, reg = /\s*(\S+)\s*:\s*(.*)/;
        if((res = reg.exec(e)) == null) return;
        obj[res[1]] = res[2];
    });
    return obj;
}
