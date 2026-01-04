// ==UserScript==
// @name         e-hentai自动排序打开的窗口
// @name:en    e-hentai Tab Resize
// @namespace   https://greasyfork.org/zh-CN/scripts/418803-e-hentai%E8%87%AA%E5%8A%A8%E6%8E%92%E5%BA%8F%E6%89%93%E5%BC%80%E7%9A%84%E7%AA%97%E5%8F%A3
// @version      0.6
// @description  e-hentai自动排序打开的窗口,可自定义
// @description:en  auto risize new tab on e-hentai.org
// @author       neysummer2000
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @match        https://e-hentai.org/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/418803/e-hentai%E8%87%AA%E5%8A%A8%E6%8E%92%E5%BA%8F%E6%89%93%E5%BC%80%E7%9A%84%E7%AA%97%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/418803/e-hentai%E8%87%AA%E5%8A%A8%E6%8E%92%E5%BA%8F%E6%89%93%E5%BC%80%E7%9A%84%E7%AA%97%E5%8F%A3.meta.js
// ==/UserScript==

(function(){
    if( location.search.indexOf("?noscript=") != -1) return;
    // 0=关闭 1=开启
    // 设备分辨率
    var g_i_width = 1920;
    var g_i_height = 1080;

    // 关闭主页面后自动关闭所有子页面
    var g_b_onClose = 1;

    // 自动调整主页面位置
    var g_b_initMainPage_pos = 1;
    // 屏幕x轴
    var g_i_main_x = 0;
    // 屏幕y轴
    var g_i_main_y = 0;

    // 自动调整主页面大小
    var g_b_initMainPage_size = 1;
    // 宽
    var g_i_main_w = 840;
    // 高
    var g_i_main_h = g_i_height;

    // 只打开一个图片浏览页面
    var g_b_openAlone = 1;

    // 自动调整图片大小
    var g_b_initImage = 1;

    var g_windows = {};

    // 图片浏览器位置
    var g_i_viewer_w = 500;
    var g_i_viewer_h = $(window).height();
    var g_i_viewer_x = 1920 - g_i_viewer_w;
    var g_i_viewer_y = 0;

    // w 200 h 300
    //

    var g_i_type = 0; // 0主页面 1详情页 2图片浏览页
    // https://e-hentai.org/s/5d0d242d73/1801400-1
    if( location.href.indexOf("e-hentai.org/s/") != -1){
        g_i_type = 2;
        if(g_b_initImage){
            var w= $('#img').width(), h = $('#img').height();
            var i_w = g_i_viewer_w, i_h = g_i_viewer_h;
            if(g_i_viewer_w < g_i_viewer_h){
                i_h = Math.max(w, h) / Math.min(w,h) * g_i_viewer_w;
                if(i_h > g_i_viewer_h){
                    g_i_viewer_w -=  g_i_viewer_h - i_h;
                    i_h = g_i_viewer_h;
                }
            }else{
                i_w = Math.max(w, h) / Math.min(w,h) * g_i_viewer_h;
                if(i_w > g_i_viewer_w){
                    g_i_viewer_h -=  g_i_viewer_w - i_w;
                    i_w = g_i_viewer_w;
                }
            }
            GM_addStyle('#i1{width: unset !important;min-width: '+i_w+'px !important}#img{max-width: '+i_w+'px !important;max-height:'+i_h +'px !important;} #i3{text-align: left} h1,#i2{display:none} ');
            window.resizeTo(g_i_viewer_w, g_i_viewer_h);
        }
    }else
        if(location.href.indexOf("e-hentai.org/g/") != -1){
            g_i_type = 1;
        }
    // 自动调整位置
    if($('.gl1t').length > 0){ // 列表视图
        if(g_b_initMainPage_size) window.resizeTo(g_i_main_w, g_i_main_h);  // 宽 高 ,调整大小
        if(g_b_initMainPage_pos) window.moveTo(g_i_main_x, g_i_main_y); // x y (左上角), 调整位置
    }

    if(g_b_onClose){
        window.onbeforeunload = function() {
            for(var w in g_windows){
                if(!g_windows[w].closed) return "你确定要离开页面吗?"; // 有子页面存在
            }
        }

        window.onunload = function() {
            for(var w in g_windows){
                if(!g_windows[w].closed) g_windows[w].close();
            }
        }
    }

    $(document).on('click', '.gl1t a[href], .gdtl  a[href], #i3 a', function(e){
        if(g_i_type == 2){
            if(e.altKey){
                g_windows[new Date().getTime().toString()] = window.open($('#img').attr('src'), window_name, 'height='+g_i_height+', width='+ g_i_width +', top=0,left=0, toolbar=no, menubar=no, scrollbars=no, resizable=yes,location=no,status=no');
                e.preventDefault();
            }
            return;
        }

        var url = this.href;
        e.preventDefault();
        //https://e-hentai.org/g/1801413/83af5fa938/
        let b_detail = g_i_type == 1 ;
        var window_name = b_detail ? 'detail_'+location.href : 'page_'+url;
        if(g_windows[window_name] != undefined && !g_windows[window_name].closed){

            if(g_i_type !== 0 && g_b_openAlone){
                g_windows[window_name].close(); // 关闭旧
            }else{
                g_windows[window_name].location.href = this.href; //更新链接
                return;
            }
        }

        var x,y, w, h;
        if(g_i_type == 1 && e.altKey){
            url += "?noscript=1";
            w = g_i_width;
            h = g_i_height;
            x = 0;
            y = 0;
        }else{
            let offset = 290; // 偏移值, 任务栏在底部为290 在左边为340, 数值不固定自己调整吧

            w = b_detail ? g_i_viewer_w : g_i_width - $(window).width()-offset;
            h = b_detail ? g_i_viewer_h : $(window).height();
            y = b_detail ? g_i_viewer_y : g_i_main_y;
            x = b_detail ? g_i_viewer_x : $(window).width()+offset;
        }

        g_windows[window_name] = window.open(url, window_name, 'height='+h+', width='+ w +', top='+y+',left='+x+', toolbar=no, menubar=no, scrollbars=no, resizable=yes,location=no,status=no');
    });
})();
