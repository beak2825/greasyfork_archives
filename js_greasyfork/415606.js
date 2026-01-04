// ==UserScript==
// @name         京东读书pdf下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://cread.jd.com/read/startRead.action?bookId=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415606/%E4%BA%AC%E4%B8%9C%E8%AF%BB%E4%B9%A6pdf%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/415606/%E4%BA%AC%E4%B8%9C%E8%AF%BB%E4%B9%A6pdf%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==


function loadStyle(url){
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(link);
}

function loadScript(url, callback){
    var script = document.createElement ("script")
    script.type = "text/javascript";
    if (script.readyState){ //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" || script.readyState == "complete"){
				script.onreadystatechange = null;
				if(typeof(callback) == 'function')
                	callback();
            }
        };
    } else { //Others
        script.onload = function(){
			if(typeof(callback) == 'function')
				callback();
        };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

//获取元素在数组的下标
Array.prototype.indexOf = function(val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == val)	{
			return i;
		};
	}
	return -1;
};

//根据数组的下标，删除该下标的元素
// Array.prototype.remove = function(val) {
// 	var index = this.indexOf(val);
// 	if (index > -1) {
// 	this.splice(index, 1);
// 	}
// };

function range(start, stop, step = 1) {
    return Array(Math.ceil((stop - start) / step))
    .fill(start)
    .map((x, y) => x + y * step)
}

function Uint8ToString(u8a){
    var CHUNK_SZ = 0x8000;
    var c = [];
    for (var i=0; i < u8a.length; i+=CHUNK_SZ) {
      c.push(String.fromCharCode.apply(null, u8a.subarray(i, i+CHUNK_SZ)));
    }
    return c.join("");
}

function fakeClick(obj) {
    var ev = document.createEvent("MouseEvents");
    ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    obj.dispatchEvent(ev);
 }

function exportRaw(name, data) {
      var urlObject = window.URL || window.webkitURL || window;
      var export_blob = new Blob([data]);
      var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
      save_link.href = urlObject.createObjectURL(export_blob);
      save_link.download = name;
      fakeClick(save_link);
}

// 要保存的信息
//
var ready_flag = false;
function isReady(){
    return globle.hasOwnProperty('bookId') && globle.hasOwnProperty('pager')
}

// 判断是否为pdf书（epub不运行）
function isPDF(){
    return globle.hasOwnProperty('_getUrl');
}

function get_metadata(callback){

    // var url = document.referrer;
    // 手动构造详情业url
    var url = "https://gx.jd.com/gx/gx_bookDetail.action?bookId="+globle.bookId;
    globle['Download_Info'] = {'url':url,'obj':'','metadata':{}};
    var metadata = globle['Download_Info']['metadata']
    var book_info = globle.dataLoader.bookInfoLoader.bookInfo.content.bookInfo
    metadata['title'] = book_info.bookName;
    metadata['writer'] = book_info.author;
    metadata['Cover_url'] = book_info.bookUrl;
}

function export_info(){
    var title = globle['Download_Info']['metadata']['title'];
    var writer = globle['Download_Info']['metadata']['writer'];
    var _b = writer?'_'+writer:'';
    var book_name = title + _b;
    g = globle;
    g['book_name'] = book_name;
    var obj = JSON.stringify(g, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (key == 'parent') {
                // Circular reference found, discard key
                return;
            }
        }
        return value;
    }, 4);
    exportRaw(g['book_name']+'_jd_pdf_info.json', obj);
}



// ui部分

function set_progress(n){
	if(window.element){
		element.progress('mprogress', n.toString()+'%');
	}
}

function set_status(msg){
	$('#mstatus').text(msg);
}

function show_msg(msg){
	var s = ''
	for(var i=0; i<arguments.length;i++){
		s+=' '+String(arguments[i]);
	}
	console.log(s);
	if(typeof(layer.msg) == 'function'){
		layer.msg(s, {
			offset: 't',
			anim: 5,
			area: 300
		  });
	}
}



function fun_wait(){
    show_msg('[Wait] ...');
    set_status('[Wait] ...');
}
var fun_btn = fun_wait;

// 下载
function fun_do(){
    show_msg('Downloading...');
    get_metadata();
    export_info();
    show_msg('[OK] download');
    set_status('[OK] download');
    set_progress(100);
}

if(isPDF()){
    loadStyle("https://www.layuicdn.com/layui/css/layui.css")
    loadScript("https://www.layuicdn.com/layui/layui.all.js", function(){
        // 由于引入的为all.js 模块都一次性加载，因此不用执行 layui.use() 来加载对应模块，直接使用即可layer,element

        layer.open({
            type: 1,
            content: '<div style="padding:20px;text-align: center;"><h3>Github:<a style="color: #23696f" href="https://github.com/ygcaicn/keledge" target="_blank">Star</a></h3><br><p>Status:<span id="mstatus">Ready!</span></p></div> <div class="layui-progress layui-progress-big" lay-filter="mprogress" lay-showpercent="true"><div class="layui-progress-bar" lay-percent="0%"></div></div>',
            skin: 'layui-layer-molv',
            shade: 0,
            btnAlign: 'c' ,
            offset: 'rt',
            area:'300px',
            btn: ['Download', 'Cancel'],
           btn1: function(){
                fun_btn();
                return false;
           },
           btn2: function(){

                return false;
           }
        });
        window.element = layui.element;
        window.element.init();
        set_status('Wait initing...');
    })
}


// 等待ready
var wait_ready_timer;
wait_ready_timer = setInterval(function(){
    if(isReady()){
        ready_flag = true;
        clearInterval(wait_ready_timer);
        if(isPDF()){
            show_msg('[OK] ready');
            set_status('Ready');
            set_progress(0);
            fun_btn = fun_do;
        }
        else {
            show_msg('[Not] pdf book');
        }

    }
    else {
        if(isPDF()){
            show_msg('[Wait] ...');
            set_status('[Wait] ...');
        }
    }
},500)
