// ==UserScript==
// @namespace    https://greasyfork.org/zh-CN/users/30310-adan1
// @name         自定预加载JS库
// @description  尽可能地使依赖JS库的页面能正常呈现
// @icon		 http://jquery.com/favicon.ico
// @author       Adan1
// @include      http://*
// @include      https://*
/// @connect      *
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand

// @require		 http://cdn.staticfile.org/jquery/1.8.3/jquery.min.js
// @require      https://cdn.jsdelivr.net/jquery.blockui/2.70.0/jquery.blockUI.min.js

/// @require      https://cdn.jsdelivr.net/crypto-js/3.1.2/rollups/md5.js
/// @resource     ohoho http://cdn.staticfile.org/jquery/1.8.3/jquery.min.js
/// @resource     mask  https://cdn.jsdelivr.net/jquery.blockui/2.70.0/jquery.blockUI.min.js

// @run-at       document-start
// @date         2016-02-20
// @version      1.0
// @modified     2016-03-10
// @downloadURL https://update.greasyfork.org/scripts/17881/%E8%87%AA%E5%AE%9A%E9%A2%84%E5%8A%A0%E8%BD%BDJS%E5%BA%93.user.js
// @updateURL https://update.greasyfork.org/scripts/17881/%E8%87%AA%E5%AE%9A%E9%A2%84%E5%8A%A0%E8%BD%BDJS%E5%BA%93.meta.js
// ==/UserScript==


//eval(GM_getResourceText("ohoho"));
(function(gmWindow, jQuery, $){
//eval(GM_getResourceText("mask"));



var Storage = (function(dis){
	dis.gm = {
        get: function(key){
            return GM_getValue(key); //不存在的映射项返回undefined
        },
        put: function(key, value){ //验证过可以直接存取Object对象，还有必要JSON？
            if(value===undefined){
            	value = null;
            }
        	GM_setValue(key, value); //value=undefined时会被强制转成字符串'undefined'，value=null时不会被转换。
        },
        isExist: function(key){
    		return GM_getValue(key)!==undefined;
    	},
        remove: function(key){
        	GM_deleteValue(key);
        },
        getJSON: function(key){
        	var j = this.get(key);
            if(j!==undefined){
            	j = JSON.parse(j);
            }
            return j;
        },
        putJSON: function(key, jsonObj){
            if(jsonObj==undefined){
            	jsonObj = null;
            }else{
            	jsonObj = JSON.stringify(jsonObj);
            }
            GM_setValue(key, jsonObj);
        },
        size: function(){
        	return GM_listValues().length;
        },
        clear: function(){
            GM_listValues().forEach(GM_deleteValue);
            /*
        	for(var i=GM_listValues().length-1; i>-1; i--){
    			var key = GM_listValues()[i];
                this.remove(key);
			}
            */
        },
        list: function(callback){
            if(!($.type(callback) === "function")){return;} //return Object.prototype.toString.call(fn)==='[object Function]';
            var readOnlyKeys = GM_listValues();
        	for(var i=0; i<readOnlyKeys.length; i++){
    			var key = readOnlyKeys[i];
                callback(key, this.get(key), i);
			}
        },
        listTo: function(obj){
            if($.type(obj)!=="object"){alert("no");return;}
            //if(!($.isPlainObject(obj))){return;}
            GM_listValues().forEach(function(currentValue, index, array){ //此回调可能不受以上put/get影响
            	obj[currentValue] = this.get(currentValue);
            }, this); //need this
        },
        listToLog: function(){
            console.group('GM Storage logging...');
        	this.list(function(key, value, index){
                console.log("[%i] %s = %o", index, key, value);
                //console.dir(value);
    		});
            console.groupEnd();
    	},
        listToConsole: function(){}
    };
    dis.localStorage = { //LS
    };
    dis.cookies = { // CK
    };
    
return dis;})({});
//Storage.gm.listToLog();
//Storage.gm.clear(); Storage.gm.listToLog();

var DataService = (function(dis, storGM){
    function std_host(host_str){ // host should be like 'www.baidu.com'
        host_str = host_str.toString();
    	return "//"+host_str;
    }
    function std_pathname(host, pathname){ // pathname should be like '/s'
        host = host.toString(); pathname = pathname.toString();
    	return "//"+host+pathname;
    }
	
    function DAO(idBuilder, useJSON, removable){
        if(useJSON==undefined){useJSON = true;}//改成默认JSON
    	var json = useJSON?'JSON':'';
		this.fetch = function(ids){
    	    return storGM['get'+json]( idBuilder.apply(idBuilder, arguments) );
    	};
		this.update = function(ids, data){
            var args = Array.prototype.slice.call(arguments, 0, arguments.length-1);
            data = arguments[arguments.length-1]; //保证最后参数是data。此语句必须后置，因为形参同步到arguments。
    		storGM['put'+json]( idBuilder.apply(idBuilder, args), data);
    	};
    	if(removable!==false){
    		this.remove = function(ids){
    			storGM.remove( idBuilder.apply(idBuilder, arguments) );
    		};
    	}
	}
    
    dis.dao = {
        setting: {
            hosts: new DAO(function(){ return "$$"; }, true, false),
            hostMeta: new DAO(function(host_str){ return "$0"+std_host(host_str); }),
            whiteWildcardMeta: new DAO(function(host_str){ return "$1"+std_host(host_str); }),
            whiteWildcardInfo: new DAO(function(host, pathname_wildcard){ return "$1"+std_pathname(host, pathname_wildcard); }),
            whitePathnames: new DAO(function(host_str){ return "$2"+std_host(host_str); }),
            whitePathnameInfo: new DAO(function(host, pathname){ return "$2"+std_pathname(host, pathname); }),
            blackWildcardMeta: new DAO(function(host_str){ return "$4"+std_host(host_str); })
        },
        resource: {
            sets: new DAO(function(){ return "@0set"; }, true, false),
            cryptos: new DAO(function(){ return "@0crypto"; }, true, false),
            scriptTxt: new DAO(function(rid){ return "@1"+rid.toString(); }, false)
        }
    };
    
    function ensureJSON(target, updateValues){ //以非undefined值的属性覆盖已存在的同类型(null和空白对象除外)属性，多余的无视。
        //Object.keys返回一个由给定对象的所有(非原型链上继承到的)可枚举自身属性的属性名组成的数组
        if(Object.keys(target).length===0){//空白对象
        	for(var key in updateValues){
            	if($.type(updateValues[key])==='object'){
                    target[key] = {}; // deep copy
                	ensureJSON(target[key], updateValues[key]);
                    continue;
                }
                target[key] = updateValues[key]; // one level copy only
        	}
            return target;
        }
        for(var key in updateValues){
            if(!(key in target)){ continue; }
            if(target[key]===null){ //null可任意
            	target[key] = updateValues[key];
                continue;
            }
            var ut = $.type(updateValues[key]);
            if($.type(target[key])===ut){
                if(ut==='object'){
                	ensureJSON(target[key], updateValues[key]);
                }else{
                	target[key] = updateValues[key];
                }
            }
        }
    	return target;
    }
    dis.model = { //保证模型正常访问
    	setting: {
            hosts: function(){
                var jsonObj = dis.dao.setting.hosts.fetch();
                return ensureJSON({}, jsonObj==null?{}:jsonObj);
            },
            hostMeta: function(host_str){
                var jsonObj = dis.dao.setting.hostMeta.fetch(host_str);
                return ensureJSON({
                    'active': true,
                    'protocol': 'http:https:',
                    'xq-seq': [4, 2, 1],
                    'nickname': null
                }, jsonObj==null?{}:jsonObj);
            },
            whiteWildcardMeta: function(host_str){
               var jsonObj = dis.dao.setting.whiteWildcardMeta.fetch(host_str);
                return ensureJSON({
                    'match-seq': [],
                    'wildcard-list': []
                }, jsonObj==null?{}:jsonObj);
            },
            whiteWildcardInfo: function(host, pathname){
                var jsonObj = dis.dao.setting.whiteWildcardInfo.fetch(host, pathname);
                return ensureJSON({
                    'xq-seq': [],
                    'js-list': []
                }, jsonObj==null?{}:jsonObj);
            },
            whitePathnames: function(host_str){
                var jsonObj = dis.dao.setting.whitePathnames.fetch(host_str);
                return ensureJSON({}, jsonObj==null?{}:jsonObj);
            },
            whitePathnameInfo: function(host, pathname){
                var jsonObj = dis.dao.setting.whitePathnameInfo.fetch(host, pathname);
                return ensureJSON({
                    'xq-seq': [],
                    'js-list': []
                }, jsonObj==null?{}:jsonObj);
            },
            blackWildcardMeta: function(host_str){
                var jsonObj = dis.dao.setting.blackWildcardMeta.fetch(host_str);
                return ensureJSON({
                    'match-seq': [],
                    'wildcard-list': []
                }, jsonObj==null?{}:jsonObj);
            }
        },
        resource: {
        	sets: function(){
                var jsonObj = dis.dao.resource.sets.fetch();
                return ensureJSON({}, jsonObj==null?{}:jsonObj);
            },
            cryptos: function(){
                throw "not impl yet";
            },
            scriptTxt: function(rid){
                var str = dis.dao.resource.scriptTxt.fetch(rid);
                return str==null?"":str;
            }
        }
    };
    dis.dump = {
        setting: {
            host: function(host_str){
            	return {
                    hostMeta: dis.model.setting.hostMeta(host_str),
                    whiteWildcardMeta: dis.model.setting.whiteWildcardMeta(host_str),
                    whitePathnames: dis.model.setting.whitePathnames(host_str),
                    blackWildcardMeta: dis.model.setting.blackWildcardMeta(host_str)
                };
            },
            hostAll: function(host_str){
                var dump = this.host(host_str); dump["whiteWildcardInfo"] = {};  dump["whitePathnameInfo"] = {};
                dump.whiteWildcardMeta['wildcard-list'].forEach(function(e){
                	var wwi = dis.model.setting.whiteWildcardInfo(host_str, e);
                    dump.whiteWildcardInfo[e] = wwi;
                });
                for(var p in dump.whitePathnames){
                	var wpi = dis.model.setting.whitePathnameInfo(host_str, p);
                    dump.whitePathnameInfo[p] = wpi;
                }
                return dump;
            }
        },
        resource: { }
    };
return dis;})({}, Storage.gm);

var PathMatcher = (function(dis){
    var path = location.href.substring(location.origin.length);
	dis.match = function(test){
    	return path===test;
    };
    dis.matchWildcard = function(test){
        //return path.match(test);
        test = test.split('*')[0];
    	return path.substring(0, test.length)===test;
    };
    
return dis;})({});

function docHead(){
    //return document.getElementsByTagName("head")[0];
	return document.head; //alert(document.childNodes.length); //.insertBefore(newItem,existingItem)
}
    
function ScriptInjector(t){
	this.target = docHead();
    if(t){
    	this.target = t;
    }
    function createScript(){
    	var s = document.createElement("script");
    	s.type = "text/javascript";
		s.async = false;
        s.setAttribute("injected", true); //区别
        return s;
    }
    function doInject(target, element){
    	target.appendChild(element);
    }
    this.injectUrl = function(url){
    	var s = createScript();
		s.src = url;
        doInject(this.target, s);
    };
    this.injectContent = function(ctn){
    	var s = createScript();
    	s.text = ctn;
        doInject(this.target, s);
    };
    this.injectUrlContent = function(u){ // http://www.w3school.com.cn/xml/xml_http.asp
        var resp = $.ajax({
            dataType: "text", // stop auto (async) running/eval itself
            async: false, 
            url: u 
        });
        var ctn = resp.responseText;
        this.injectContent(ctn?ctn:"");
    };
}

function arrayElementSwap(array, index, isLeft){//默认向右交换
    if(index<0 || index>=array.length){ return; }
    var offs = index + 1;
    if(isLeft===true){
        if(index===0){ return; } //必须的
    	offs = index - 1;
    }
	array.splice(offs, 0, array.splice(index, 1)[0]);
}



function isRookieNoob(){
    //return Storage.gm.get("version")!==GM_info.script.version;
    return Storage.gm.get("version")===undefined;
}

for(;;){ if(isRookieNoob()===true){
    Storage.gm.put("version", GM_info.script.version);
    Storage.gm.put("setting", "{}"); //本脚本的选项
    console.log("["+GM_info.script.name+" v"+GM_info.script.version+"] 初始化")
}else{
    console.log("["+GM_info.script.name+" v"+GM_info.script.version+"] 确认载入");
    
    
    if(false){ // === TEST ONLY ===
    	Storage.gm.clear();
        DataService.dao.setting.hosts.update({'www.baidu.com':true, 'greasyfork.org':true, 'mahouka.jp':true });
    	DataService.dao.setting.hostMeta.update('www.baidu.com', {active:true, 'xq-seq':null});
    	DataService.dao.setting.blackWildcardMeta.update('www.baidu.com', {'match-seq':[0,2,1], 'wildcard-list':['//*/**/','/s?*']});
    	DataService.dao.setting.whitePathnames.update('www.baidu.com', {'/b':false, '/duty/':true, '/s':true});
    	DataService.dao.setting.whitePathnameInfo.update('www.baidu.com', '/duty/', {'xq-seq':[2,1,0], 'js-list':[
    	    'http://ajax.useso.com/ajax/libs/jquery/2.1.0/jquery.min.js',
    		//'https://greasyfork.org/scripts/17346-just-a-test/code/just-a-test.js'
            'http://libs.baidu.com/jquerytools/1.2.7/jquery.tools.min.js'
    	]});
        DataService.dao.setting.whitePathnameInfo.update('www.baidu.com', '/s', {'xq-seq':[1,0,2], 'js-list':[
            'http://libs.baidu.com/jquerytools/1.2.7/jquery.tools.min.js',
    	    'http://ajax.useso.com/ajax/libs/jquery/2.1.0/jquery.min.js'
    	]});
    	DataService.dao.setting.whiteWildcardMeta.update('www.baidu.com', {'match-seq':[2,0,1], 'wildcard-list':['//*/**/','/duty/*', '/s/*']});
    	DataService.dao.setting.whiteWildcardInfo.update('www.baidu.com', '/duty/*', {'xq-seq':[1,0], 'js-list':[
    	    //'https://greasyfork.org/scripts/17346-just-a-test/code/just-a-test.js',
    	    'http://libs.baidu.com/jquerytools/1.2.7/jquery.tools.min.js'
    	]});
    }
    
    
    if(DataService.model.setting.hosts()[location.host] === undefined){ break; }
    var hostMeta = DataService.model.setting.hostMeta(location.host);
    if(hostMeta['active']!==true){ break; }
    if(hostMeta['protocol'].indexOf(location.protocol) < 0){ break; }
    var xqSeqMap = {
    	'4': function(){
            var bwm = DataService.model.setting.blackWildcardMeta(location.host);
            return bwm['match-seq'].some(function(cv){
            	var bw = bwm['wildcard-list'][cv];
                if(bw==undefined){ return; } //next
                if(PathMatcher.matchWildcard(bw)===true){
                	console.log("黑名单：通配 %s 已拦截 %s", bw, location.href);
                    return true;
                }
                //return PathMatcher.matchWildcard(bw);//quick quit forEach
            });
    	},
    	'2': function(){
            var wps = DataService.model.setting.whitePathnames(location.host);
            for(var wp in wps){
                if(wps[wp]!==true){ continue; }
                if(PathMatcher.match(wp)){
                    console.log("白名单：个例 %s 已匹配 %s", wp, location.href);
                    var wpi = DataService.model.setting.whitePathnameInfo(location.host, wp);
                    var scptInjt = new ScriptInjector();
                    wpi['xq-seq'].forEach(function(element){
                    	var link = wpi['js-list'][element];
                        if(link==undefined){ return; } //next
                        console.log("尝试加载JS资源 %s 到 %s", link, location.href);
                        if(link.charAt(0)==='@'){
                            scptInjt.injectContent(DataService.model.resource.scriptTxt(link.substring(1)));
                        }else{
                        	scptInjt.injectUrlContent(link);
                        }
                    });
                	return true;
                }
            }
    	},
    	'1': function(){
            var wwm = DataService.model.setting.whiteWildcardMeta(location.host);
            return wwm['match-seq'].some(function(cv){
            	var ww = wwm['wildcard-list'][cv];
                if(ww==undefined){ return; } //next
                if(PathMatcher.matchWildcard(ww)){
                    console.log("白名单：通配 %s 已匹配 %s", ww, location.href);
                	var wwi = DataService.model.setting.whiteWildcardInfo(location.host, ww);
                    var scptInjt = new ScriptInjector();
                    wwi['xq-seq'].forEach(function(element){
                    	var link = wwi['js-list'][element];
                        if(link==undefined){ return; } //next
                        console.log("尝试加载JS资源 %s 到 %s", link, location.href);
                        if(link.charAt(0)==='@'){
                            scptInjt.injectContent(DataService.model.resource.scriptTxt(link.substring(1)));
                        }else{
                        	scptInjt.injectUrlContent(link);
                        }
                    });
                    return true;//quick quit forEach
                }
            });
        }
    };
    var seq;
    hostMeta['xq-seq'].some(function(element, index, array){ //本应使用find方法，但Chrome没实现。
        //console.log(element);
        if(xqSeqMap[element]()==true){
            seq = element;
        	return true; //quick quit forEach
        }
    });
    
    //Storage.gm.listToLog();
} break;}



function isNotIframe(){ // check and fix for menu UI and the blockUI
    return window.self === window.top;
};

if(isNotIframe()===true){
//GM_registerMenuCommand("结束当前页面JS链接加载", function(){alert("JS加载等待过久才好使用此功能。");});
$(function(){ // NEW BUG: 当注入的脚本中含有破坏整个网页结构的，$将无法访问，导致没有触发document event。
    $.blockUI.defaults.centerX = true
    $.blockUI.defaults.centerY = true
    $.blockUI.defaults.fadeIn = 500;
    $.blockUI.defaults.fadeOut = 500;
    $.blockUI.defaults.timeout = 0; //指定时间后消失
    $.blockUI.defaults.css.border = "0 solid";
    //$.blockUI.defaults.css.top = '30px';
    //$.blockUI.defaults.css.left = '40%';
    $.blockUI.defaults.css.cursor = null;
    $.blockUI.defaults.baseZ = 2147483647; // MAX
    $.blockUI.defaults.overlayCSS.cursor = "wait";
    $.blockUI.defaults.showOverlay = true; //遮罩层
    //$.growlUI('Notification Title', 'Notification Content...'); //通知信息

    var menu1 = function(){
    	if($("style#preloadjs-simple-style").size()===0){ // GM_addStyle
        	$("<style id='preloadjs-simple-style'></style>").appendTo(document.body).text([
                "#preloadjs-simple{ background-color:white; margin:initial; padding:initial; }",
                "#preloadjs-simple{ width:550px; height:480px; -height:495px; border:1px solid white; color:black; padding-top:20px; }",
                "#preloadjs-simple>div{ MARGIN-LEFT:auto; MARGIN-RIGHT:auto; margin-bottom:10px; text-align:center; width:520px; height:190px; border:1px solid white; }",
                "#preloadjs-simple input{ font:normal 14px 宋体; }",
                "#preloadjs-simple select{ width:514px; border:1px solid gray; -line-height:normal; }",
                "#preloadjs-simple .title{ font:normal 14px 宋体; margin:0px 0 5px 0;  }",
                "#preloadjs-simple>p{ margin:10px 0 0px 18px; width:510px; height:18px; font:normal 14px arial; color:gray; text-align:left; float:left; }",
                "#preloadjs-simple>p{ white-space:nowrap; overflow-x:hidden; overflow-y:auto; -text-overflow:ellipsis; }",
                
                "#preloadjs-simple-cdnlist{ display:none; }",
                "#preloadjs-simple-cdnlist-bt-add{ float:left; }",
                "#preloadjs-simple-cdnlist-bt-addall{ float:right; }",
                
                "#preloadjs-simple-jslist{ display:none; }",
                "#preloadjs-simple-jslist.solo{ height:390px; }",
                "#preloadjs-simple-jslist-show{ -height:341px; }",
                "#preloadjs-simple-jslist-bt-add{ float:left; }",
                "#preloadjs-simple-jslist-bt-delete{ float:right; }",
                
                "div#preloadjs-simple-bottom{ width:auto; height:45px; border-top:1px solid gray; margin-top:1px;  }",
                "#preloadjs-simple-bottom input{  margin:10px 17px; }",
                "#preloadjs-simple-bt-apply{ float:left; }",
                "#preloadjs-simple-bt-applysite{ float:left; }",
                "#preloadjs-simple-bt-close{ float:right; }"
            ].join("\n"));
        }
        var ui_simple = $("<div id='preloadjs-simple'></div>");
        
        $(["<div id='preloadjs-simple-cdnlist' >",
           		"<p class='title'>检查到当前页面引入Google平台下相关的JS库资源，推荐使用360公共CDN提取资源。</p>",
        		"<select size='8' id='preloadjs-simple-cdnlist-show'>",
            	"</select>",
           		"<input type='button' id='preloadjs-simple-cdnlist-bt-add' value='转换添加' />",
           		"<input type='button' id='preloadjs-simple-cdnlist-bt-addall' value='转换添加全部' />",
           "</div>"].join("")).appendTo(ui_simple).each(function(){
            var colle = $("script[src][injected!=true]").map(function(){
            	var url = this.src.trim();
                var reg = /^(\w+):\/\/([^\/:]*)(?::(\d+))?\/(.*)/;
                var result = reg.exec(url);  //alert(RegExp.$1 + ',' + RegExp.$2 + '' + RegExp.$3 + ',' + RegExp.$4+ ',' + RegExp.$5);
                if(["ajax.googleapis.com"].indexOf(RegExp.$2 + RegExp.$3)>-1){
                	return url;
                }
            });
            var p = $(this);
            if(colle.length===0){
                p.prop("google-not-found", true);
                return;
            }
        	p.find("#preloadjs-simple-cdnlist-show").each(function(){
                Array.prototype.forEach.call(colle, function(e){ //seems not array that no method
                	this.add(new Option(e, e));
                }, this);
            });
            var transfer = function(url){
            	var si = 0; si = url.indexOf("//", si); si = url.indexOf("/", si+2);
                return "//ajax.useso.com" + url.substring(si);
            }
            p.find("#preloadjs-simple-cdnlist-bt-add").click(function(){
                $("#preloadjs-simple-cdnlist-show").each(function(){
                    if(this.selectedIndex===-1){ alert("没有选中项"); return; }
                    var lnk = this.selectedOptions[0].text;
            		lnk = transfer(lnk);
                    $("#preloadjs-simple-jslist-show").append(new Option(lnk, lnk));
                });
            });
            p.find("#preloadjs-simple-cdnlist-bt-addall").click(function(){
            	$("#preloadjs-simple-cdnlist-show").each(function(){
                    Array.prototype.forEach.call(this.options, function(e){
                    	var lnk = e.text;
            			lnk = transfer(lnk);
                    	$("#preloadjs-simple-jslist-show").append(new Option(lnk, lnk));
                    });
                });
            });
            p.fadeIn("slow");
        });
        $(["<div id='preloadjs-simple-jslist' class='-solo' >",
           "<p class='title'>需要加载的JS库资源</p>",
        		"<select size='8' id='preloadjs-simple-jslist-show' >",
            	"</select>",
           		"<input type='button' id='preloadjs-simple-jslist-bt-add' value='添加' />",
           		"<input type='button' id='preloadjs-simple-jslist-bt-up' value='上移' />",
           		"<input type='button' id='preloadjs-simple-jslist-bt-down' value='下移' />",
           		"<input type='button' id='preloadjs-simple-jslist-bt-delete' value='删除' />",
           "</div>"].join("")).appendTo(ui_simple).each(function(){
            var p = $(this);
            if(ui_simple.find("#preloadjs-simple-cdnlist").prop("google-not-found")===true){
            	p.addClass("solo").find("#preloadjs-simple-jslist-show").attr("size", 20);
                p.find("#preloadjs-simple-jslist-show").css("height", "341px"); // UI BUG
            }
            p.find("#preloadjs-simple-jslist-bt-add").click(function(){
            	var input = prompt("请输入需要加载JS的URL：", null);
                if(input==null){ return; } input = input.trim();
                if(/^( |\S)+$/g.test(input)){
                    $("#preloadjs-simple-jslist-show").append(new Option(input, input));
            	}
            });
            p.find("#preloadjs-simple-jslist-bt-delete").click(function(){
                $("#preloadjs-simple-jslist-show").each(function(){
                	if(this.selectedIndex===-1){ alert("没有选中项"); return; }
                	var op = this.selectedOptions[0];
                	if(confirm("确认删除项：\n"+op.text)===true){
                    	op.outerHTML = "";
            		}
                });
            });
            p.find("#preloadjs-simple-jslist-bt-up").click(function(){
            	$("#preloadjs-simple-jslist-show").each(function(){
                	if(this.selectedIndex===-1){ alert("没有选中项"); return; }
                    $(this.selectedOptions[0]).after(this.options[this.selectedIndex-1]);
                });
            });
            p.find("#preloadjs-simple-jslist-bt-down").click(function(){
            	$("#preloadjs-simple-jslist-show").each(function(){
                	if(this.selectedIndex===-1){ alert("没有选中项"); return; }
                    $(this.selectedOptions[0]).before(this.options[this.selectedIndex+1]);
                });
            });
            p.fadeIn("slow");
        });
        $("<p></p>").appendTo(ui_simple).text(location.href);
        $("<div style='clear:both; height:1px; border:0px solid black; margin:0; '></div>").appendTo(ui_simple);
        $(["<div id='preloadjs-simple-bottom' >",
           		"<input type='button' id='preloadjs-simple-bt-apply' value='只应用到当前页面' />",
           		"<input type='button' id='preloadjs-simple-bt-applysite' value='应用到整个网站域名' />",
           		"<input type='button' id='preloadjs-simple-bt-close' value='关闭' />",
           "</div>"].join("")).appendTo(ui_simple).each(function(){
        	var p = $(this);
            p.find("#preloadjs-simple-bt-apply").click(function(){
                var hosts = DataService.model.setting.hosts();
                hosts[location.host] = true;
                DataService.dao.setting.hosts.update(location.host, hosts);
                var pathname = location.href.substring(location.origin.length);
                
                var hostDump = DataService.dump.setting.host(location.host);
                DataService.dao.setting.hostMeta.update(location.host, hostDump.hostMeta);
                hostDump.whitePathnames[pathname] = true;
                DataService.dao.setting.whitePathnames.update(location.host, hostDump.whitePathnames);
                var wpi = DataService.model.setting.whitePathnameInfo(location.host, pathname);
                var incr = $.map($("#preloadjs-simple-jslist-show").children(), function(e){ return e.text; });
                Array.prototype.push.apply(wpi["js-list"], incr);
                Array.prototype.push.apply(wpi["xq-seq"], incr.map(function(v, i){ return wpi["xq-seq"].length+i; }));
                DataService.dao.setting.whitePathnameInfo.update(location.host, pathname, wpi);
                alert("已应用保存数据");
            });
            p.find("#preloadjs-simple-bt-applysite").click(function(){
            	var hosts = DataService.model.setting.hosts();
                hosts[location.host] = true;
                DataService.dao.setting.hosts.update(location.host, hosts);
                var wildcard = "/*";
                
                var hostDump = DataService.dump.setting.host(location.host);
                DataService.dao.setting.hostMeta.update(location.host, hostDump.hostMeta);
                if(hostDump.whiteWildcardMeta["wildcard-list"].indexOf(wildcard)<0){ //这边不重复算了
                	hostDump.whiteWildcardMeta["wildcard-list"].push(wildcard);
                    hostDump.whiteWildcardMeta["match-seq"].push(hostDump.whiteWildcardMeta["match-seq"].length);
                    DataService.dao.setting.whiteWildcardMeta.update(location.host, hostDump.whiteWildcardMeta);
                };
                var wwi = DataService.model.setting.whiteWildcardInfo(location.host, wildcard);
                var incr = $.map($("#preloadjs-simple-jslist-show").children(), function(e){ return e.text; });
                Array.prototype.push.apply(wwi["js-list"], incr);
                Array.prototype.push.apply(wwi["xq-seq"], incr.map(function(v, i){ return wwi["xq-seq"].length+i; }));
                DataService.dao.setting.whiteWildcardInfo.update(location.host, wildcard, wwi);
                alert("已应用保存数据");
            });
            p.find("#preloadjs-simple-bt-close").click(function(){
            	if(!confirm("确定关闭？关闭意味着之前没有应用(保存)的数据将会丢失。")){ return; }
            	$.unblockUI();
            });
        });
        
        $.blockUI({
        	message: ui_simple,
            css: {
                top: '30px',
                left: '55%'
            }
    	});
	}; 
    
	var menu2 = function(){ // chrome://about/?preloadjs
    	if($("style#preloadjs-advanced-style").size()===0){ // GM_addStyle
        	$("<style id='preloadjs-advanced-style'></style>").appendTo(document.body).text([
                //"*{ all:default; } *{ all:initial; }", //重置默认值，可惜目前浏览器均不完整支持。
                "#preloadjs-advanced{ background-color:white; margin:initial; padding:initial; }",
                "#preloadjs-advanced{ width:550px; height:550px; border:0px solid black; color:black; }",
                "#preloadjs-advanced>div{ MARGIN-LEFT:auto; MARGIN-RIGHT:auto; text-align:center; width:520px; height:500px; border:1px solid white; }",
                "#preloadjs-advanced input{ font:normal 14px 宋体; }",
                "#preloadjs-advanced .title{ font:normal 20px 宋体; margin:15px 0 5px 0;  }",
                "#preloadjs-advanced .annotation{  font:normal 13px 宋体; color:gray; }",
                
                "#preloadjs-advanced-hostlist{ display:none; }",
                "#preloadjs-advanced-hostlist ul{ overflow-y:auto; height:430px; list-style:none; padding:0; border:0px solid black; }",
                "#preloadjs-advanced-hostlist ul li{  border:0px solid black; }",
                "#preloadjs-advanced-hostlist ul li input{ margin-top:10px; font:normal 20px cursive; }",
                
                "#preloadjs-advanced-matchlist{ display:none; }",
                "#preloadjs-advanced-matchlist>label{ display:inline; }", // UI BUG
                "#preloadjs-advanced-matchlist select{ width:514px; border:1px solid gray; }",
                "#preloadjs-advanced-matchlist-show{ height:158px; }", // UI BUG
                "#preloadjs-advanced-matchlist-bt-add{ float:left; }",
                "#preloadjs-advanced-matchlist-bt-delete{ float:right; }",
                "#preloadjs-advanced-matchlist-loadjs-show{ height:103px; }", // UI BUG
                "#preloadjs-advanced-matchlist-loadjs-bt-add{ float:left; }",
                "#preloadjs-advanced-matchlist-loadjs-bt-delete{ float:right; }",
                "#preloadjs-advanced-matchlist p{ float:left; margin:20px 4px 5px 4px; }",
                
                "#preloadjs-advanced-resource{ display:none; }",
                "#preloadjs-advanced-resource-bt-add{ float:left; }",
                "#preloadjs-advanced-resource-bt-delete{ float:right; }",
                "#preloadjs-advanced-resource select{ width:514px; border:1px solid gray; }",
                "#preloadjs-advanced-resource textarea{ resize:none; overflow:auto; width:508px; border:1px solid gray; height:230px; margin-top:10px; }",
                
                "div#preloadjs-advanced-bottom{ width:auto; height:45px; border-top:1px solid gray; }",
                "#preloadjs-advanced-bottom input{  margin:10px 16px; }",
                "#preloadjs-advanced-bt-resource{ float:left; display:none; }",
                "#preloadjs-advanced-bt-return{ float:left; display:none; }",
                "#preloadjs-advanced-bt-apply{ float:right; display:none; }",
                "#preloadjs-advanced-bt-close{ float:right; }"
            ].join("\n"));
        }
        var ui_advanced = $("<div id='preloadjs-advanced'></div>");
        
        $(["<div id='preloadjs-advanced-hostlist' >",
           		"<p class='title'>已建立的域名档案</p>",
        		"<ul>",
            	"</ul>",
           "</div>"].join("")).appendTo(ui_advanced).each(function(){
        	var p = $(this);
            p.bind("ui-setup", function(){
                var hosts = DataService.model.setting.hosts();
                var list = p.children("ul"); list.empty(); //clear
                for(var h in hosts){
                    $("<input type='button' value='' />").val(h).appendTo(list).wrap("<li></li>").one("click", function(){
                        p.triggerHandler("ui-unsetup");
                    	$("#preloadjs-advanced-matchlist").triggerHandler("ui-setup", this.value);
                    });
                }
            	p.slideDown("slow");
                ui_advanced.find("#preloadjs-advanced-bt-resource").show("slow");
            }).bind("ui-unsetup", function(){
                p.slideUp("slow");
            	ui_advanced.find("#preloadjs-advanced-bt-resource").hide("slow");
            });
            return false;
        });
        $(["<div id='preloadjs-advanced-matchlist' >",
        		"<label class='title' ><input type='checkbox' class='title' id='preloadjs-advanced-matchlist-active' />启用 <span><b></b></span></label>",
           		"<p class='annotation'>名单优先级： <b>黑名单：通配</b>  &gt;  <b>白名单：个例</b>  &gt;  <b>白名单：通配</b></p>",
            	"<select size='1' id='preloadjs-advanced-matchlist-class' >",
           		"</select><br/>",
           		"<select size='9' id='preloadjs-advanced-matchlist-show' >",
           			"<option>path</option>",
           		"</select><br/>",
           		"<input type='button' id='preloadjs-advanced-matchlist-bt-add' value='添加' />",
           		"<input type='button' id='preloadjs-advanced-matchlist-bt-up' value='上移' />",
           		"<input type='button' id='preloadjs-advanced-matchlist-bt-down' value='下移' />",
           		"<input type='button' id='preloadjs-advanced-matchlist-bt-delete' value='删除' />",
           		"<div style='clear:both;'></div>",
           		"<p>加载的JS资源 <span class='annotation'>可以通过“@资源名”方式添加已存储的资源，方便跨域和提升速度。</span></p>",
           		"<select size='6' id='preloadjs-advanced-matchlist-loadjs-show' >",
           			"<option>js url</option>",
           		"</select><br/>",
           		"<input type='button' id='preloadjs-advanced-matchlist-loadjs-bt-add' value='添加' />",
           		"<input type='button' id='preloadjs-advanced-matchlist-loadjs-bt-up' value='上移' />",
           		"<input type='button' id='preloadjs-advanced-matchlist-loadjs-bt-down' value='下移' />",
           		"<input type='button' id='preloadjs-advanced-matchlist-loadjs-bt-delete' value='删除' />",
           		"<div style='clear:both;'></div>",
           		"<p class='annotation'>以上所有列表中的优先级暂时由高到低，通过上移下移调整匹配执行顺序。</p>",
           "</div>"].join("")).appendTo(ui_advanced).each(function(){
        	var p = $(this);
            var hostDump = null, changeRecord = null; //CACHE
            p.find("#preloadjs-advanced-matchlist-active").bind("change", function(evt, data){
                if(this.checked==true){
                    hostDump.hostMeta['active'] = true;
                }else{
                	hostDump.hostMeta['active'] = false;
                }
            });
            p.find("#preloadjs-advanced-matchlist-class").each(function(){
            	this.add(new Option("白名单：通配", "1"));
                this.add(new Option("白名单：个例", "2"));
                this.add(new Option("黑名单：通配", "4"));
                $(this).bind("change", {
                    '1': function(){
                        $("#preloadjs-advanced-matchlist-show").trigger("list-load", {
                            "list": function(){
                            	hostDump.whiteWildcardMeta['wildcard-list'].forEach(function(w){
                                	this.add(new Option(w, w));
                                }, this);
                            },
                            "add": function(){
                                var input = prompt("请输入需要匹配的通配路径（不包含域名），以“/”开头：\n（目前暂时只支持第一个*之后的匹配）", null);
                                if(input==null){ return; } input = input.trim();
                                if(/^\/( |\S)*$/g.test(input)){
                                    if(input.indexOf("*")===-1){ input += "*";}
                                    if(hostDump.whiteWildcardMeta["wildcard-list"].indexOf(input)>-1){ alert("不能添加已存在的项目"); return; }
                                    hostDump.whiteWildcardMeta["wildcard-list"].push(input);
                                    this.add(new Option(input, input));
                                    hostDump.whiteWildcardInfo[input] = { 'xq-seq': [], 'js-list': [] };//rebuild
                                    changeRecord.whiteWildcardInfo[input] = "update"; //overmark
                                }
                            },
                            "delete": function(){
                                if(this.selectedIndex===-1){ alert("没有选中项"); return; }
                                var op = this.selectedOptions[0];
                                if(confirm("确认删除项：\n"+op.text)===true){
                                	hostDump.whiteWildcardMeta["wildcard-list"].splice(this.selectedIndex, 1);
                                    op.outerHTML = "";
                                    changeRecord.whiteWildcardInfo[op.text] = "delete"; //overmark
                                    $("#preloadjs-advanced-matchlist-loadjs-show").removeData("actions").empty();
                                }
                            },
                            "up": function(){
                                if(this.selectedIndex===-1){ alert("没有选中项"); return; }
                            	arrayElementSwap(hostDump.whiteWildcardMeta["wildcard-list"], this.selectedIndex, true);
                            	$(this.selectedOptions[0]).after(this.options[this.selectedIndex-1]);
                            },
                            "down": function(){
                                if(this.selectedIndex===-1){ alert("没有选中项"); return; }
                            	arrayElementSwap(hostDump.whiteWildcardMeta["wildcard-list"], this.selectedIndex);
                            	$(this.selectedOptions[0]).before(this.options[this.selectedIndex+1]);
                            }
                        });
                    },
                    '2': function(){
                        $("#preloadjs-advanced-matchlist-show").trigger("list-load", {
                            "list": function(){
                                for(var p in hostDump.whitePathnames){
                                	this.add(new Option(p, p));
                                }
                            },
                            "add": function(){
                                var input = prompt("请输入需要匹配的完整路径（不包含域名），以“/”开头：", null);
                                if(input==null){ return; } input = input.trim();
                                if(/^\/( |\S)*$/g.test(input)){
                                    if(input in hostDump.whitePathnames){ alert("不能添加已存在的项目"); return; }
                                    hostDump.whitePathnames[input] = true;
                                    this.add(new Option(input, input));
                                    hostDump.whitePathnameInfo[input] = { 'xq-seq': [], 'js-list': [] };//rebuild
                                    changeRecord.whitePathnameInfo[input] = "update"; //overmark
                                }
                            },
                            "delete": function(){
                                if(this.selectedIndex===-1){ alert("没有选中项"); return; }
                                var op = this.selectedOptions[0];
                                if(confirm("确认删除项：\n"+op.text)===true){
                                	delete hostDump.whitePathnames[op.text];
                                    op.outerHTML = "";
                                    delete hostDump.whitePathnameInfo[op.text];
                                    changeRecord.whitePathnameInfo[op.text] = "delete"; //overmark
                                    $("#preloadjs-advanced-matchlist-loadjs-show").removeData("actions").empty();
                                }
                            }
                        });
                    },
                    '4': function(){
                        $("#preloadjs-advanced-matchlist-show").trigger("list-load", {
                            "list": function(){
                            	hostDump.blackWildcardMeta['wildcard-list'].forEach(function(w){
                                	this.add(new Option(w, w));
                                }, this);
                            },
                            "add": function(){
                                var input = prompt("请输入需要匹配的通配路径（不包含域名），以“/”开头：\n（目前暂时只支持第一个*之后的匹配）", null);
                                if(input==null){ return; } input = input.trim();
                                if(/^\/( |\S)*$/g.test(input)){
                                    if(input.indexOf("*")===-1){ input += "*";}
                                    hostDump.blackWildcardMeta["wildcard-list"].push(input);
                                    this.add(new Option(input, input));
                                }
                            },
                            "delete": function(){
                                if(this.selectedIndex===-1){ alert("没有选中项"); return; }
                                var op = this.selectedOptions[0];
                                if(confirm("确认删除项：\n"+op.text)===true){
                                	hostDump.blackWildcardMeta["wildcard-list"].splice(this.selectedIndex, 1);
                                    op.outerHTML = "";
                                }
                            },
                            "up": function(){
                                if(this.selectedIndex===-1){ alert("没有选中项"); return; }
                            	arrayElementSwap(hostDump.blackWildcardMeta["wildcard-list"], this.selectedIndex, true);
                            	$(this.selectedOptions[0]).after(this.options[this.selectedIndex-1]);
                            },
                            "down": function(){
                                if(this.selectedIndex===-1){ alert("没有选中项"); return; }
                            	arrayElementSwap(hostDump.blackWildcardMeta["wildcard-list"], this.selectedIndex);
                            	$(this.selectedOptions[0]).before(this.options[this.selectedIndex+1]);
                            }
                        });
                    }
                }, function(evt, data){
                    evt.data[this.value]();
                });
            });
            p.find("#preloadjs-advanced-matchlist-show").bind("list-load", function(evt, data){
                $(this).removeData("actions");
            	$("#preloadjs-advanced-matchlist-loadjs-show").removeData("actions").empty();
            	this.innerHTML = null;
                data["list"].call(this); // with 'select'
                $(this).data("actions", data);
            }).bind("change", {
                '1': function(wildcard){
                	$("#preloadjs-advanced-matchlist-loadjs-show").trigger("list-load", {
                        "wildcard": wildcard,
                        "list": function(actions){
                            hostDump.whiteWildcardInfo[actions.wildcard]['js-list'].forEach(function(js){
                            	this.add(new Option(js, js));
                            }, this);
                        },
                        "add": function(actions){
                            var input = prompt("请输入需要加载JS的URL：", null);
                            if(input==null){ return; } input = input.trim();
                            if(/^( |\S)+$/g.test(input)){
                            	hostDump.whiteWildcardInfo[actions.wildcard]['js-list'].push(input);
                                this.add(new Option(input, input));
                                changeRecord.whiteWildcardInfo[actions.wildcard] = "update"; //overmark
                            }
                        },
                        "delete": function(actions){
                        	if(this.selectedIndex===-1){ alert("没有选中项"); return; }
                            var op = this.selectedOptions[0];
                            if(confirm("确认删除项：\n"+op.text)===true){
                            	hostDump.whiteWildcardInfo[actions.wildcard]['js-list'].splice(this.selectedIndex, 1);
                                op.outerHTML = "";
                                changeRecord.whiteWildcardInfo[actions.wildcard] = "update"; //overmark
                            }
                        },
                        "up": function(actions){
                        	if(this.selectedIndex===-1){ alert("没有选中项"); return; }
                            arrayElementSwap(hostDump.whiteWildcardInfo[actions.wildcard]['js-list'], this.selectedIndex, true);
                            $(this.selectedOptions[0]).after(this.options[this.selectedIndex-1]);
                            changeRecord.whiteWildcardInfo[actions.wildcard] = "update"; //overmark
                        },
                        "down": function(actions){
                        	if(this.selectedIndex===-1){ alert("没有选中项"); return; }
                            arrayElementSwap(hostDump.whiteWildcardInfo[actions.wildcard]['js-list'], this.selectedIndex);
                            $(this.selectedOptions[0]).before(this.options[this.selectedIndex+1]);
                            changeRecord.whiteWildcardInfo[actions.wildcard] = "update"; //overmark
                        }
                    });
                },
                '2': function(pathname){
                    $("#preloadjs-advanced-matchlist-loadjs-show").trigger("list-load", {
                        "pathname": pathname,
                        "list": function(actions){
                            hostDump.whitePathnameInfo[actions.pathname]['js-list'].forEach(function(js){
                            	this.add(new Option(js, js));
                            }, this);
                        },
                        "add": function(actions){
                            var input = prompt("请输入需要加载JS的URL：", null);
                            if(input==null){ return; } input = input.trim();
                            if(/^( |\S)+$/g.test(input)){
                            	hostDump.whitePathnameInfo[actions.pathname]['js-list'].push(input);
                                this.add(new Option(input, input));
                                changeRecord.whitePathnameInfo[actions.pathname] = "update"; //overmark
                            }
                        },
                        "delete": function(actions){
                        	if(this.selectedIndex===-1){ alert("没有选中项"); return; }
                            var op = this.selectedOptions[0];
                            if(confirm("确认删除项：\n"+op.text)===true){
                            	hostDump.whitePathnameInfo[actions.pathname]['js-list'].splice(this.selectedIndex, 1);
                                op.outerHTML = "";
                                changeRecord.whitePathnameInfo[actions.pathname] = "update"; //overmark
                            }
                        },
                        "up": function(actions){
                        	if(this.selectedIndex===-1){ alert("没有选中项"); return; }
                            arrayElementSwap(hostDump.whitePathnameInfo[actions.pathname]['js-list'], this.selectedIndex, true);
                            $(this.selectedOptions[0]).after(this.options[this.selectedIndex-1]);
                            changeRecord.whitePathnameInfo[actions.pathname] = "update"; //overmark
                        },
                        "down": function(actions){
                        	if(this.selectedIndex===-1){ alert("没有选中项"); return; }
                            arrayElementSwap(hostDump.whitePathnameInfo[actions.pathname]['js-list'], this.selectedIndex);
                            $(this.selectedOptions[0]).before(this.options[this.selectedIndex+1]);
                            changeRecord.whitePathnameInfo[actions.pathname] = "update"; //overmark
                        }
                    });
                },
                '4': function(){ } // not support for black list
            }, function(evt, data){//选择对应名单的操作发送对应的actions data吗
                if(this.selectedIndex===-1){ return; } //修复这奇葩未选中BUG
                evt.data[$("#preloadjs-advanced-matchlist-class").val()](this.selectedOptions[0].text);
            });
            ["add", "delete", "up", "down"].forEach(function(e){
                var show = p.find("#preloadjs-advanced-matchlist-show");
            	p.find("#preloadjs-advanced-matchlist-bt-"+e).click(function(){
            		var act = show.data("actions")[e];
                	if(act == undefined){ alert("sorry not support"); return; }
                    act.call(show.get(0)); //console.dir(changeRecord);
            	});
            });
            p.find("#preloadjs-advanced-matchlist-loadjs-show").bind("list-load", function(evt, data){
                $(this).removeData("actions");
            	this.innerHTML = null;
                data['list'].call(this, data); // with 'select'
                $(this).data("actions", data);
            });
            ["add", "delete", "up", "down"].forEach(function(e){
                var show = p.find("#preloadjs-advanced-matchlist-loadjs-show");
            	p.find("#preloadjs-advanced-matchlist-loadjs-bt-"+e).click(function(){
                    var acts = show.data("actions");
                    if(acts == undefined){ alert("sorry no selected item or not support"); return; }
            		var act = acts[e];
                	//if(act == undefined){ alert("sorry not support"); return; }
                    act.call(show.get(0), acts); //console.dir(changeRecord);
            	});
            });
            
            p.bind("ui-setup", function(event, data){ //data from triggerHandler 
            	hostDump = DataService.dump.setting.hostAll(data); // load data to share
                changeRecord = {
                    whiteWildcardInfo: {},
                    whitePathnameInfo: {}
                };
                
                p.find("label>span>b").text(data);
                p.find("#preloadjs-advanced-matchlist-active").get(0).checked = hostDump.hostMeta['active']==true?true:false;
                p.find("#preloadjs-advanced-matchlist-class").each(function(){
                    this.selectedIndex = -1; //必须放到显示时才有效
                }).val(2).trigger("change");
                
                ui_advanced.find("#preloadjs-advanced-bt-apply").click(function(){
                	hostDump.hostMeta['xq-seq'] = [4,2,1];
                    DataService.dao.setting.hostMeta.update(data, hostDump.hostMeta);
                    var v2i = function(currentValue, index, array){
                    	return index;
                    };
                    hostDump.blackWildcardMeta['match-seq'] = hostDump.blackWildcardMeta['wildcard-list'].map(v2i);
                    DataService.dao.setting.blackWildcardMeta.update(data, hostDump.blackWildcardMeta);
                    
                    Object.keys(hostDump.whitePathnames).forEach(function(p){ hostDump.whitePathnames[p]=true });
                    DataService.dao.setting.whitePathnames.update(data, hostDump.whitePathnames);
                    for(var p in changeRecord.whitePathnameInfo){
                        ({
                            "update": function(){
                                hostDump.whitePathnameInfo[p]['xq-seq'] = hostDump.whitePathnameInfo[p]['js-list'].map(v2i);
                            	DataService.dao.setting.whitePathnameInfo.update(data, p, hostDump.whitePathnameInfo[p]);
                            },
                            "delete": function(){
                            	DataService.dao.setting.whitePathnameInfo.remove(data, p);
                            }
                        })[changeRecord.whitePathnameInfo[p]]();
                    }
                    
                    hostDump.whiteWildcardMeta['match-seq'] = hostDump.whiteWildcardMeta['wildcard-list'].map(v2i);
                    DataService.dao.setting.whiteWildcardMeta.update(data, hostDump.whiteWildcardMeta);
                    for(var w in changeRecord.whiteWildcardInfo){
                        ({
                            "update":function(){
                                hostDump.whiteWildcardInfo[w]['xq-seq'] = hostDump.whiteWildcardInfo[w]['js-list'].map(v2i);
                            	DataService.dao.setting.whiteWildcardInfo.update(data, w, hostDump.whiteWildcardInfo[w]);
                            },
                            "delete":function(){
                            	DataService.dao.setting.whiteWildcardInfo.remove(data, w);
                            }
                        })[changeRecord.whiteWildcardInfo[w]]();
                    }
                    alert("已应用保存数据");
                });
                
                p.slideDown("slow");
                $("#preloadjs-advanced-bt-return").show("slow").click(function(){
                    $(this).unbind("click");
                	p.triggerHandler("ui-unsetup");
                    $("#preloadjs-advanced-hostlist").triggerHandler("ui-setup");
                });
                $("#preloadjs-advanced-bt-apply").show("slow");
            }).bind("ui-unsetup", function(){
                $("#preloadjs-advanced-bt-apply").unbind("click").hide("slow");
            	$("#preloadjs-advanced-bt-return").hide("slow");
            	p.slideUp("slow");
            });            
            return false;
        });
        $(["<div id='preloadjs-advanced-resource' >",
           		"<p class='title'>资源列表</p>",
           		"<input type='button' id='preloadjs-advanced-resource-bt-add' value='添加' />",
           		"<input type='button' id='preloadjs-advanced-resource-bt-delete' value='删除' />",
           		"<div style='clear:both;'></div>",
           		"<select size='10' id='preloadjs-advanced-resource-list' >",
           		"</select>",
           		"<textarea wrap='soft' id='preloadjs-advanced-resource-jscontent' ></textarea>",
           "</div>"].join("")).appendTo(ui_advanced).each(function(){
        	var p = $(this);
            var resourceSets = null, resourceTxt = null; var changeRecord = null;
            p.find("#preloadjs-advanced-resource-list").bind("change", function(evt, data){
            	if(this.selectedIndex===-1){ return;} // debug
                var rid = this.selectedOptions[0].text;
                for(; !(rid in resourceTxt); ){
                    resourceTxt[rid] = DataService.model.resource.scriptTxt(rid); //cache
                }
                $("#preloadjs-advanced-resource-jscontent").val(resourceTxt[rid]).trigger("js-edit", rid);
            });
            p.find("#preloadjs-advanced-resource-bt-add").click(function(){
            	var input = prompt("请输入唯一的资源名（默认以日期时间命名）：", null);
                if(input==null){ return; } input = input.trim();
                if(input===""){ input = new Date().toLocaleString("ja-JP", {hour12:false}); }
                if(input in resourceSets){ alert("已存在的资源名"); return; }
                resourceSets[input] = "default";
                resourceTxt[input] = "";
                $("#preloadjs-advanced-resource-list").get(0).add(new Option(input, input));
                changeRecord[input] = "update";
            });
            p.find("#preloadjs-advanced-resource-bt-delete").click(function(){
                var list = $("#preloadjs-advanced-resource-list").get(0);
            	if(list.selectedIndex===-1){ alert("没有选中项"); return; }
                var rid = list.selectedOptions[0].text;
                if(confirm("确认删除项：\n"+rid)!==true){ return; }
                $("#preloadjs-advanced-resource-jscontent").removeData("sync-to").attr("disabled", true).val("");
                delete resourceSets[rid];
                delete resourceTxt[rid];
                list.selectedOptions[0].outerHTML = "";
                changeRecord[rid] = "delete";
            });
            p.find("#preloadjs-advanced-resource-jscontent").bind("js-edit", function(evt, data){
            	$(this).removeData("sync-to").data("sync-to", data).attr("disabled", false);
            }).bind("blur", function(){
                var rid = $(this).data("sync-to");
                if(rid==undefined){ return; }
                if(this.value!==resourceTxt[rid] && confirm("内容已被修改，点击[取消/否]恢复。")===true){
                	resourceTxt[rid] = this.value;
                    changeRecord[rid] = "update";
                }else{
                	this.value = resourceTxt[rid]; //recover
                }
            });
            p.bind("ui-setup", function(){
                resourceSets = DataService.model.resource.sets(); resourceTxt = {};
                changeRecord = {};
                $("#preloadjs-advanced-resource-jscontent").attr("disabled", true).val(""); //clear
                $("#preloadjs-advanced-resource-list").empty().each(function(){
                    for(var r in resourceSets){
                        this.add(new Option(r, r));
                    }
                });
                
                $("#preloadjs-advanced-bt-apply").click(function(){  //console.log("%d %o %o %o", Date.now(), resourceSets, resourceTxt, changeRecord);
                    DataService.dao.resource.sets.update(resourceSets);
                    for(var rid in changeRecord){
                        ({
                            "update": function(){ //alert(CryptoJS.MD5("Message").toString().length);
                            	DataService.dao.resource.scriptTxt.update(rid, resourceTxt[rid]);
                            },
                            "delete": function(){
                            	DataService.dao.resource.scriptTxt.remove(rid);
                            }
                        })[changeRecord[rid]]();
                    }
                    alert("已应用保存数据");
                });
                
                p.slideDown("slow");
                $("#preloadjs-advanced-bt-return").show("slow").click(function(){
                    $(this).unbind("click");
                	p.triggerHandler("ui-unsetup");
                    $("#preloadjs-advanced-hostlist").triggerHandler("ui-setup");
                });
            	$("#preloadjs-advanced-bt-apply").show("slow");
            }).bind("ui-unsetup", function(){
                $("#preloadjs-advanced-bt-apply").unbind("click").hide("slow");
                $("#preloadjs-advanced-bt-return").hide("slow");
                p.slideUp("slow");
            });
            return false;
        });
        $(["<div id='preloadjs-advanced-bottom' >",
           		"<input type='button' id='preloadjs-advanced-bt-resource' value='资源库' />",
           		"<input type='button' id='preloadjs-advanced-bt-return' value='返回' />",
           		"<input type='button' id='preloadjs-advanced-bt-close' value='关闭' />",
           		"<input type='button' id='preloadjs-advanced-bt-apply' value='应用' />",
           "</div>"].join("")).appendTo(ui_advanced).each(function(){
            var p = $(this);
            p.find("#preloadjs-advanced-bt-resource").click(function(){
                $("#preloadjs-advanced-hostlist").triggerHandler("ui-unsetup");
                $("#preloadjs-advanced-resource").triggerHandler("ui-setup");
            });
            p.find("#preloadjs-advanced-bt-close").click(function(){
                if(!confirm("确定关闭？关闭意味着之前没有应用(保存)的数据将会丢失。")){ return; }
            	$.unblockUI();
            });
            return false; //stop the loop
        });
        
        ui_advanced.find("#preloadjs-advanced-hostlist").trigger("ui-setup"); // init
        $.blockUI({
        	message: ui_advanced,
            css: {
                top: '30px',
                left: '55%'
            }
    	});
	};
    
    var MenuHelper = function(){
        var regIds = {};
        var reregSeq = [];
        this.register = function(name, fn, accessKey){
            this.unregister(name);
            regIds[name] = [GM_registerMenuCommand(name, fn, accessKey), fn, accessKey];
            reregSeq.push(name);
        };
        this.unregister = function(name){
        	if(name in regIds){
            	GM_unregisterMenuCommand(regIds[name][0]);
                reregSeq.splice(reregSeq.indexOf(name), 1);
                delete regIds[name];
            }
        };
        this.unregisterAll = function(){
            reregSeq = [];
        	for(var name in regIds){
            	GM_unregisterMenuCommand(regIds[name][0]);
                delete regIds[name];
            }
        };
        this.reregisterAll = function(){
            reregSeq.forEach(function(name){
            	GM_unregisterMenuCommand(regIds[name][0]);
                var fn = regIds[name][1], accessKey = regIds[name][2];
                regIds[name][0] = GM_registerMenuCommand(name, fn, accessKey);//update id
            });
        };
    };
    var menus = new MenuHelper();
    menus.register("[快捷]"+GM_info.script.name, function(){
        menu1();
        menus.reregisterAll();
    }, 'j');
    menus.register("[高级]"+GM_info.script.name, function(){
    	menu2();
        menus.reregisterAll();
    }, 's');
    
    if(location.href==='https://www.baidu.com/duty/'){ //TEST ONLY
        //menu1();
        menu2();
    }
    
}) }; 



})(window, jQuery, jQuery.noConflict(true));
