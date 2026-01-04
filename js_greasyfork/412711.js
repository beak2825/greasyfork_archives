// ==UserScript==
// @name         aiimooc下载
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://college.aiimooc.com/study/*
// @match        https://www.aiimooc.com/mall/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/downloadjs/1.4.8/download.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.0/FileSaver.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412711/aiimooc%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/412711/aiimooc%E4%B8%8B%E8%BD%BD.meta.js
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

loadScript("https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.0/FileSaver.js");
function download_src(url, filename){
    var download_file = document.createElement('a');
    document.body.appendChild(download_file);
    download_file.href = url;
    download_file.download = filename;
    download_file.target = "_blank";
    download_file.rel = 'noopener noreferrer';
    download_file.click();
    document.body.removeChild(download_file);
}

var wait_video_timer;
var video_init;
var video_src;
wait_video_timer = setInterval(function(){
    if($("video").attr('src') != undefined && $("video").attr('src') != ''){
        video_init = 1;
        video_src =  $("video").attr('src');
        clearInterval(wait_video_timer);
        show_msg('[OK] got video src.');
        show_msg(video_src);
        set_status('Ready!');
    }
    show_msg('[Wait] video src.');
},1000)

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

function fun_btn(){
    if(video_init != 1){
        show_msg("[Wait] video src.");
        return;
    }
    var file_name = $(".c-study-left-nav-item-segment-state-doing").parent().text().replace(/[\s\\\\/:*?\"<>|]+/g, ' ').trim() + '.mp4';
    video_src = $("video").attr('src');
    download_src(video_src, file_name);
    // layer.prompt({
    //     formType: 0,
    //     closeBtn: 0,
    //     resize: false,
    //     btn:["确定"],
    //     value: file_name,
    //     area: ['500px', '100px'],
    //     title: '文件名',
    // },
    // function(value, index, elem){
    //     layer.close(index);
    //     file_name = value;
    //     download_src(video_src, file_name);
    //     // download(video_src, file_name, "video/mp4");
    //     set_status('OK!');

    // });
}

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



