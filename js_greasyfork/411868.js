// ==UserScript==
// @name         悦读pdf下载
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        *://yd.51zhy.cn/ebook/reader/index.html*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/411868/%E6%82%A6%E8%AF%BBpdf%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/411868/%E6%82%A6%E8%AF%BBpdf%E4%B8%8B%E8%BD%BD.meta.js
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
				if(typeof(callback) == 'function') {
                	callback();
                }
            }
        };
    } else { //Others
        script.onload = function(){
			if(typeof(callback) == 'function') {
				callback();
            }
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

var authorize_obj = null;
var detail_obj = null;

(function (open) {
  XMLHttpRequest.prototype.open = function () {
    if (arguments[1].includes("/content/authorize")) {
      this.addEventListener("load", function () {
          if(authorize_obj === null){
            let responseOBJ = JSON.parse(this.responseText);
            authorize_obj = responseOBJ;
          }
      }, false);
    } else if (arguments[1].includes("Content/Detail")) {
      this.addEventListener("load", function () {
        if(detail_obj === null){
            let responseOBJ = JSON.parse(this.responseText);
            detail_obj = responseOBJ;
          }
      }, false);
    }
    open.apply(this, arguments);
  };
})(XMLHttpRequest.prototype.open);

function download_info(){
    if(authorize_obj && detail_obj){
        var v = $vm.$children[0].$children[0].$children[0];
        var book_name = detail_obj['Data']['Title'];
        var obj = {"authorize":authorize_obj,
                    "detail":detail_obj,
                    "cookie":document.cookie.split(/;\s*/),
                    "ast":ast.toString(),
                    // "vue":{
                    //     'AuthorizeToken':v.AuthorizeToken,
                    //     'readData':v.readData,
                    //     'rsaKey':v.rsaKey,
                    //     'tableOfContentList':v.tableOfContentList,
                    //     '_data':v._data
                    // }
                };
        var cache = [];
        console.log(obj);
        var str = JSON.stringify(obj, function(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference found, discard key
                    return;
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
        }, 4);


        exportRaw(book_name+'_51zhy_info.json', str);
    }
}



// 保存加载过的页面
// key 为页码，从0开始
// val 为u8n
var pages_save = {};

// 浏览器直接下载时，pages_save不保存页面，pages_downloaded保存已经下载过的
var pages_downloaded = [];
var download_direct = 1;
// vue接口
var v;

// 依赖vue接口
// v = window.$vm.$children[0].$children[0].$children[0]
// v.pageArr
// v.DetailData.Title
// v.numberOfPages
// v.pageIndex
// v.setLoadTask()



// 注册到window便于调试
window.pages_save = pages_save;
window.v = v;


// v = window.$vm.$children[0].$children[0].$children[0]
// v.pageArr
// 检查是否有新的页面已经下载
function check_new(){
    v.pageArr.forEach(function (val,idx){
        // idx 页码，从0开始
        // console.log('check:',idx,val.isLoadIng,val);
        if(val == null)return;
        if(val.isLoadIng == true)return;

        // 直接下载
        if(download_direct == 1){
            // console.log('idx:',idx);
            // console.log('need_download_pages', need_download_pages);
            // console.log('pages_download', pages_downloaded);
            // idx 在need_download_pages中 且 不在pages_downloaded中
            if(need_download_pages.indexOf(idx) >=0 && pages_downloaded.indexOf(idx)<0){
                pages_downloaded.push(idx);
                var page_num = idx+1;
                exportRaw(v.DetailData.Title+'_' + page_num.toString()+".pdf", val.getUint8Array);
                show_msg("[Download] page:", page_num, '/', v.numberOfPages);
                v.pageArr[idx] = null;
            }
        }
        // 保存导出json下载
        else{
            if(pages_save[idx]==undefined){
                pages_save[idx] = val.getUint8Array;
                show_msg("[Page] got page:", idx+1, '/', v.numberOfPages);
            }
        }
    });

    // 计算进度
    var cnt = 0;
    need_download_pages.forEach(function(num){
        if(download_direct){
            if(pages_downloaded.indexOf(num)>=0){
                cnt++;
            }
        }
        else{
            if(pages_save[num]!=undefined){
                cnt++;
            }
        }
    })
    var p = Math.round(cnt/need_download_pages.length*100);
    set_progress(p);
}

// 周期check
var check_timer;
function start_check(){
    check_timer = setInterval(function (){
        check_new();
    },1000);
}
function stop_check(){
    clearInterval(check_timer);
}

// 跳转到页 page_num从0开始
// 内部调用check
function jump_page(page_num){
    if(page_num>=v.numberOfPages){
        show_msg('页码超出范围。',page_num);
        return;
    }
    v.pageIndex = page_num;
    v.setLoadTask();
    check_new();
}


// 对于need_download_pages中的下载任务，自动进行
var auto_next_timer;
var current_task_idx;
var is_done = 1;
// tasks
// 内容为页码 页码从0开始
var need_download_pages = [];
window.need_download_pages = need_download_pages;

// t 单位s 最小3s
// start 开始的序号
// pages 需要下载的页码 从0开始
function start_auto_next(t, start, pages){
    if(t<=3 || t == undefined){
        t = 3;
    }
    if(start == undefined){
        current_task_idx = 0;
        start = 0;
    }
    else{
        current_task_idx = start;
    }
    if(pages == undefined) {
        pages = [...Array(v.numberOfPages).keys()];
    }

    need_download_pages = [];
    pages_downloaded = [];
    for(var i=0;i<pages.length;i++){
        if(pages[i]<v.numberOfPages && pages[i]>=0) {
            need_download_pages.push(pages[i]);
        }
    }
    console.log('pages:', need_download_pages);
    auto_next_timer = setInterval(function(){
        check_new();
        var s = current_task_idx;
        var cnt = 0;
        while(cnt<need_download_pages.length){
            var page_num = need_download_pages[s];
            if((pages_downloaded.indexOf(page_num)>=0) || (pages_save[page_num]!=undefined)){
                // 已经下载过了
                s ++;
                s = s%need_download_pages.length;
                cnt++;
            }
            else{
                break;
            }
        }
        if(cnt>=need_download_pages.length){
            // 下载完成
            is_done = 1;
            stop_auto_next();
            set_progress(100);
        }
        else{
            // 下载
            show_msg('[Jump]',s,"page:",need_download_pages[s]+1);
            jump_page(need_download_pages[s]);
            current_task_idx = (s+1)%need_download_pages.length;
        }
    },t*1000);
}
function stop_auto_next(){
    clearInterval(auto_next_timer);
}

var download_obj = {};
function export_pages(){
    download_obj['pages']={};
    var page_nums = Object.keys(pages_save);
    page_nums.forEach(function(val){
        download_obj['pages'][val] = Uint8ToString(pages_save[val]);
        pages_save[val] = true;
    })
}

function parse_pages(str){
    var pages = [];
    str = str.replace('\n',',');
    var _pages = str.split(',');
    for(var i=0,len=_pages.length;i<len;i++){
        var p = _pages[i]
        if (p.match(/^\d+$/)){
            pages.push(Number(p));
        }
        else{
            var rep = p.match(/^(\d+)-(\d+)$/);
            if(rep){
                pages=pages.concat(range(Number(rep[1]), Number(rep[2])+1));
            }
        }
    }
    pages = [...new Set(pages)];
    return pages.sort(function(a, b){return a - b})
}

var download_all_timer;
function download(t, need){
    console.log(need);
    is_done = 0;
    set_progress(0);
    while(v==undefined){
        v = window.$vm.$children[0].$children[0].$children[0];
        show_msg('[Wait] window.$vm');
        set_status('wait window.$vm');
    }
    show_msg('[OK] window.$vm');
    set_status('Downloading...');

    // start_check();
    start_auto_next(t, 0, need);
    clearInterval(download_all_timer);
    download_all_timer = setInterval(function (){
        if(is_done == 1){
            if(download_direct != 1){
                export_pages();
                download_obj['DetailData'] = v.DetailData;
                var out = JSON.stringify(download_obj, null, 4);
                exportRaw(v.DetailData.Title+'.json', out);
            }else{
                pages_downloaded = [];
            }
            clearInterval(download_all_timer);
            show_msg('Download Done.');
            set_status('Download OK!');
        }
    },1000);
}

// 终止下载
function cancel_download(){
    stop_auto_next();
    clearInterval(download_all_timer);
    is_done = 1;
    need_download_pages = [];
    pages_save = {};
    set_progress(0);
    show_msg("[Cancel]:cancel download all OK!");
	set_status('Ready! pages:'+v.numberOfPages.toString());

}


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

// direct 1 浏览器直接下载
function fun_btn(direct = 1){
    if(is_done == 0){
        layer.alert('请等待当前任务下载完成...', {
            skin: 'layui-layer-molv' //样式类名
            ,closeBtn: 0
          })
        return;
    }
    layer.prompt({
        type: 1,
        formType: 2,
        closeBtn: 1,
        resize: false,
        btn:["确定"],
        value: '1-'+v.numberOfPages.toString(),
        area: ['500px', '100px'],
        title: '请输入要下载的页码,起始为1,例如：1-5,10,15,20-30',
    },
    function(value, index, elem){
        // layer.alert(JSON.stringify(value));
        layer.close(index);
        var need = parse_pages(value);
        show_msg(JSON.stringify(need));
        // 转换为从0开始
        for(var i in need){need[i]--;};
        //输入间隔时间
        layer.prompt({
                formType: 0,
                closeBtn: 0,
                resize: false,
                btn:["确定"],
                value: '10',
                area: ['500px', '100px'],
                title: '请输入自动加载间隔时间',
            },
            function(value, index, elem){
                layer.close(index);
                if(direct) {
                    download_direct = 1;
                }
                else {
                    download_direct = 0;
                }
                download(Number(value), need);
            });
    });
}

loadStyle("https://www.layuicdn.com/layui/css/layui.css")
loadScript("https://www.layuicdn.com/layui/layui.js", function(){
	// 由于引入的为all.js 模块都一次性加载，因此不用执行 layui.use() 来加载对应模块，直接使用即可layer,element

	layer.open({
        type: 1,
        content: '<div style="padding:20px;text-align: center;"><h3>Github:<a style="color: #23696f" href="https://github.com/ygcaicn/keledge" target="_blank">Star</a></h3><br><p>Status:<span id="mstatus">Ready!</span></p></div> <div class="layui-progress layui-progress-big" lay-filter="mprogress" lay-showpercent="true"><div class="layui-progress-bar" lay-percent="0%"></div></div>',
        skin: 'layui-layer-molv',
        shade: 0,
        btnAlign: 'c' ,
        offset: 'rt',
        area:'300px',
        btn: ['Download', 'Info', 'Cancel'],
       btn1: function(){
            fun_btn();
            return false;
       },
    //    btn2: function(){
    //         fun_btn(0);
    //         return false;
    //     },
       btn2: function(){
            download_info();

            return false;
       },
       btn3: function(){
            cancel_download();
            return false;
       }
	});
	window.element = layui.element;
    window.element.init();
    set_status('Wait initing...');
})

var wait_vue_timer;
wait_vue_timer = setInterval(function(){
    if(v == undefined){
        v = window.$vm.$children[0].$children[0].$children[0];
        show_msg('[Wait] window.$vm');
        set_status('wait window.$vm');
    }
    else{
        show_msg('[OK] window.$vm');
        set_status('Loading numberOfPages...');
        var _t = setInterval(function (){
            if(v.numberOfPages != undefined && v.numberOfPages > 0){
                set_status('Ready! pages:'+v.numberOfPages.toString());
                clearInterval(_t);
            }
        },200);
        clearInterval(wait_vue_timer);
    }
},200)

