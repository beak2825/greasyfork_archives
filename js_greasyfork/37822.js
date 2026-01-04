// ==UserScript==
// @name         膜法小工具
// @version      0.6.2
// @author       dolacmeo
// @description  方便生活，快乐分享
// @license      MIT; https://opensource.org/licenses/MIT
// @namespace    https://greasyfork.org/users/57661
// @namespace    https://greasyfork.org/zh-CN/scripts/37822/
// @supportURL   https://greasyfork.org/zh-CN/scripts/37822/feedback
// @require      https://cdn.jsdelivr.net/npm/js-base64@2.4.3/base64.min.js
// @resource     country_code https://w.url.cn/s/AQenoiI
// @include      *://free-ss.*
// @grant        GM_log
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/37822/%E8%86%9C%E6%B3%95%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/37822/%E8%86%9C%E6%B3%95%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
// @0.6.2 2020-07-10   代码优化、更换订阅转换接口
// @0.6.1 2020-07-08   错误修复、使用paste.rs充当临时订阅
// @0.6.0 2020-06-15   错误修复、样式优化
//                     抱歉很久没更新，报错是因为淘宝ip接口已不支持公用、移除了客户端检查
// @0.5.9 2018-05-15   样式优化
// @0.5.8 2018-05-14   样式优化、错误修复、新增功能
//                     鼠标悬停显示二维码、增加移除客户端无效协议功能
// @0.5.7 2018-05-11   样式优化
//                     预更新线路检测功能
// @0.5.6 2018-05-09   样式优化
//                     移除低速后移除无效区域
// @0.5.5 2018-05-04   样式优化
// @0.5.4 2018-05-04   样式优化、代码优化
//                     优化页面样式，中文化区域选择
// @0.5.3 2018-05-03   错误修复、可用性维护
// @0.5.2 2018-05-02   样式优化、新增功能
// @0.5.1 2018-04-27   错误修复
// @0.5.0 2018-04-27   样式优化、代码优化
//                     变更了插件名称及其他信息
// @0.4.6 2018-04-23   应站长要求移除订阅功能
// @0.4.5 2018-04-23   可用性维护
// @0.4.4 2018-04-09   错误修复
// @0.4.2 2018-04-08   新增功能
// @0.4.1 2018-04-07   错误修复、新增功能
//                     新增移除低速按钮，一键清爽(6分以下)
// @0.4.0 2018-04-05   代码优化
// @0.3.8 2018-03-22   可用性维护
// @0.3.7 2018-03-03   可用性维护
// @0.3.6 2018-02-27   可用性维护
//                     增加镜像站
// @0.3.5 2018-02-24   可用性维护
// @0.3.4 2018-02-13   代码优化
// @0.3.3 2018-02-06   可用性维护
// @0.3.2 2018-02-02   样式优化
//                     点击二维码按钮生成两种链接与二维码
// @0.3.1 2018-02-02   样式优化、代码优化
//                     可进行多选，再生成链接，不选择生成所有
// @0.3.0 2018-02-02   可用性维护、代码优化
// @0.2.1 2018-01-31   错误修复
// @0.2.0 2018-01-31   样式优化、新增功能
// @0.1.0 2018-01-26   初始版本

// $(".banner").remove(); // 去广告
var today_date = new Date();
var date_str = today_date.toISOString().slice(0,10)+'_';
var enb64 = Base64.encodeURI, deb64 = Base64.decode;
var ss_id, ss_links_str = "", ssr_links_str = "",rss_url,
    link_count=0, areas=[], xyz="http://"+deb64("c3NyLjEyMzQ1NjYueHl6"),
    ok_method=['aes-128-cfb','aes-128-ctr','aes-192-cfb','aes-192-ctr','aes-256-cfb','aes-256-ctr',
               'bf-cfb','camellia-128-cfb','camellia-192-cfb','camellia-256-cfb','chacha20','chacha20-ietf','rc4-md5','salsa20'],
    order={point:0,address:1,port:2,password:3,method:4,clock:5,globe:6,qrcode:7};
var country_code = JSON.parse(""+GM_getResourceText('country_code'));
$("table").each(function (){if ($("#"+this.id+"_wrapper").css("height") === undefined) {ss_id = "#"+this.id;}});
layer.load(0, {shade:false,time:3000});$(ss_id).before("<ul id='tools'></ul>");
$('#qrcode').after('<div style="display:none" id="qrcode0"></div>');
GM_addStyle("body{margin:0;}"+
            "h3 small a{font-weight:bold;color:#4CAF50;font-size:10px;text-decoration:none;}"+
            "h3 small button{padding:2px 5px;border:none;font-size:1em;cursor:pointer;}"+
            "li.a {padding:0 40px;}li.q {padding:0 20px;}"+
            "li.aff {float:none;display:inline-block;}"+
            "#tools {margin:0;padding-left:10px;}"+
            "#tools p{margin:0;height:23px;}"+"#sel{color:#000080}"+
            "#tools button{cursor:pointer;margin-left:3px;height:23px;border: 0;}"+
            "#tools p,#tools span,#tools small{cursor:default;}"+
            "#tools .txt{display:inline-block;float:left;font-weight:bold;color:#f66;}"+
            "#tools .btn{display:inline-block;float:right;}"+
            "#tools .btn small{color:#e91e63;font-weight: bold;}"+
            ".qr-link {width: 298px;display: inline-block;background-color: darkgrey;border: darkgreen solid 1px;}"+
            ".qr-link a, .qr-link input[type='checkbox']{font-size: 30px;font-weight: bold;}.qr-link input[type='checkbox'] {width: 20px; height: 20px;float: right;}"+
            ".qr-link canvas {width: 90%;margin: 10px;}"+
            ".showup {opacity: 1;} .showoff {opacity: 0;}"+
            "#ss_area {display:inline-block;float:right;margin-left:3px;padding:1px 6px;height:23px;cursor:pointer;color:blue;}");

// 工具对象
var tools = {
    // 查询当前页面次序
    order: function () {
        var o = [],d = {}, v;
        $(ss_id).find("th").each(function () {
            v = $(this).html();
            if (v.split("/").length-1 >= 2) {
                o.push("point");
            } else if (v.search("clock") != -1) {
                o.push("clock");
            } else if (v.search("globe") != -1) {
                o.push("globe");
            } else if (v.search("qrcode") != -1) {
                o.push("qrcode");
            } else {o.push(v.toLowerCase());}
        });
        for (var x=0;x<o.length;x++) {d[o[x]] = x;}
        return d;
    },
    // 整理链接区域
    area: function() {
        var ssdatas = ss_table.data(), column = 6, l=[];
        if (order != undefined) {column = order.globe;}
        $.each(ssdatas, function(i, data){if ($.inArray(data[column], l) == -1) {if (data[column][0] != '*'){l.push(data[column]);}}});
        areas = l;return l;
    },
    // ss://method:password@server:port
    ss: function (data) {
        var method=data[order.method],
            password=data[order.password],
            server=data[order.address],
            port=data[order.port],
            remark=data[order.globe]+'['+data[order.point]+']'+'('+date_str+data[order.clock]+')';
        return 'ss://'+enb64(method+':'+password+'@'+server+':'+port)+'#'+remark.replace(/↑/g,'').replace(/↓/g,'');
    },
    // ssr://server:port:protocol:method:obfs:password_base64/?params_base64
    ssr: function (data) {
        var server=data[order.address],
            port=data[order.port],
            protocol="origin",
            method=data[order.method],
            obfs="plain",
            password=data[order.password],
            remarks=data[order.globe]+'['+data[order.point]+']'+'('+date_str+data[order.clock]+')',
            group="ZnJlZS1zcw";
        return 'ssr://'+enb64(server+':'+port+':'+protocol+':'+method+':'+obfs+':'+enb64(password)+'/?remarks='+enb64(remarks.replace(/↑/g,'').replace(/↓/g,''))+'&group='+group);
    },
    // 将数据处理成链接
    datas: function () {
        var ssdatas;
        if (ss_table.rows('.selected').data().length > 0) {ssdatas = ss_table.rows('.selected').data();} else {ssdatas = ss_table.data();}
        ss_links_str = "";ssr_links_str = "";
        $.each(ssdatas, function(i, data){
            ss_links_str = ss_links_str + tools.ss(data) + '\n';
            ssr_links_str = ssr_links_str + tools.ssr(data) + '\n';
        });
        return ssdatas;
    },
    // 处理二维码事件
    qr: function (data) {
        var ss = tools.ss(data), ssr =tools.ssr(data);
        var qrcode = $('#qrcode0');
        qrcode.html('<div class="qr-link"><a href="">SS</a><input type="checkbox" name="ssqr" checked="checked"><br></div>'+
                    '<div class="qr-link"><a href="">SSR</a><input type="checkbox" name="ssrqr" checked="checked"><br></div>');
        qrcode.find('a').eq(0).attr('href', ss);
        qrcode.find('.qr-link').eq(0).qrcode({render:'canvas',background:'#FFFFFF',ecLevel:'M',label: 'SS link',text:ss});
        qrcode.find('a').eq(1).attr('href', ssr);
        qrcode.find('.qr-link').eq(1).qrcode({render:'canvas',background:'#FFFFFF',ecLevel:'M',label: 'SSR link',text:ssr});
        $('input:checkbox').click(function () {
            this.blur(); this.focus();
            $(this).siblings("canvas").eq(0).toggleClass('showoff');
        });
        layer.closeAll();
        layer.open({
            type:1,
            title:data[1]+':'+data[2]+' ('+data[6]+')',
            closeBtn:0,
            shade:0.1,
            area:'600px',
            shadeClose:true,
            content:qrcode
        });
    },
    upload: function () {
        function RssAlert(rss){
            layer.closeAll();
            layer.alert(
                '<a href="https://42one.fun/subconverter/">机场订阅转换工具--Subconverter</a><br><br>'+
                '㊣SSR：<a href="'+rss+'">'+rss+'</a><br>'+
                '⇲Clash：<a href="https://sub.42one.fun/sub?target=clash&url='+encodeURI(rss)+'">转换链接</a><br>',
                {title:'临时订阅地址'});
        }
        if (rss_url===undefined){
            GM_xmlhttpRequest({
                method:'POST',
                url: "https://paste.rs/",
                data: enb64(ssr_links_str),
                onloadstart: function() { layer.load(2, { time: 10000 }); },
                onload: function(response) {
                    rss_url=response.responseText;
                    GM_log(response);RssAlert(rss_url);
                    //window.open(response.responseText);
                },
                onerror: onload,
                ontimeout: onload
            });
        } else {RssAlert(rss_url);}
        return rss_url;
    }
};

document.onkeydown = function(e) { if (e.ctrlKey && 81 == e.keyCode) { tools.upload(); } }; // Ctrl+q

function make_area(){
    tools.area();
    $("#ss_area").html("");
    $("#ss_area").append("<option value=''></option>");
    for (var x=-1;x++,x<areas.length;){$('#ss_area').append("<option value='"+areas[x]+"'>"+country_code[areas[x]]+"</option>");}
}

function check_method(){
    ss_table.$('tr.selected').removeClass('selected');
    $(ss_id+ ' tbody').find('tr').each(function(){
        var m = $(this).find('td').eq(order.method).text();
        if (ok_method.indexOf(m)==-1) {$(this).toggleClass('selected');}
    });
    if (ss_table.rows('.selected').data().length > 0){
        layer.msg("已移除不兼容SSR的协议("+ss_table.rows('.selected').data().length+"条)", {time:1500});
        ss_table.rows('.selected').remove().draw();
    } else {
        layer.msg("所有链接协议可用", {time:1000});
    }
    $("#total").html("共 "+ ss_table.data().length+" 条");
}

function start(){
    layer.closeAll();
    $(".fa-info-circle").remove();
    site_info();
    ss_table = $(ss_id).DataTable( { retrieve: true } );
    unsafeWindow.ss_table = ss_table;
    order = tools.order();tools.datas();
    ss_table.order( [ 0, 'asc' ] ).draw();
    link_count = tools.datas().length;
    $("h3").eq(-1).append(
        "<small> <a title='"+GM_info.script.name+"' target='_blank' href='"+GM_info.script.supportURL+"'><i class='fa fa-bolt'></i> "+GM_info.script.version+"</a></small>"+
        "<small style='float:right'>"+
        "<button id='rss-upload' style='background-color:initial;'><i class='fa fa-rss'></i></button>"+
        "<button id='site_info' style='background-color:initial;'><i class='fa fa-question-circle'></i></button>"+
        "</small>"
    );$("title").append("⚡");
    $('#site_info').on('click',function(){site_info();});
    $('#rss-upload').on('click',function(){tools.upload();});
    $("#tools").html(
        "<li class='txt'>"+
        "<p id='link_num'><span id='total'>共 "+ss_table.data().length+" 条</span><span id='sel'></span></p></li>"+
        "<li class='btn'>"+
        "<button id='btn_clear' title='移除评分6以下'>移除不稳定</button>"+
        "<button id='btn_ss'>复制 SS</button>"+
        "<button id='btn_ssr'>复制SSR</button>"+
        "<select id='ss_area'></select>"+
        "</li>"
    );
    make_area();
    $('#ss_area').on('change', function(){
        $(ss_id+ ' tbody').find('tr').each(function(){
            if ($('#ss_area').val() == ''){
                $(this).removeClass('selected');
                $("#sel").html("");
            } else {
                if($(this).find('td').eq(order.globe).text().indexOf($('#ss_area').val()) != -1){
                    $(this).toggleClass('selected');
                } else {
                    $(this).removeClass('selected');
                }
                layer.msg("已选中 "+country_code[$('#ss_area').val()]+" 区域", {time:1000});
                $("#sel").html("，已选 "+ss_table.rows('.selected').data().length+" 条");
                ss_table.order( [ order.globe, 'asc' ] ).draw();
            }
        });
    });
    $('#btn_ss').on('click',function(){
        layer.msg("SS 链接复制成功("+tools.datas().length+"条)", {time:1000});
        GM_setClipboard(ss_links_str);});
    $('#btn_ssr').on('click',function(){
        layer.msg("SSR链接复制成功("+tools.datas().length+"条)", {time:1000});
        GM_setClipboard(ssr_links_str);});
    $('#btn_clear').on('click',function(){
        ss_table.$('tr.selected').removeClass('selected');
        $(ss_id+ ' tbody').find('tr').each(function(){
            var point_str = $(this).find('td').eq(0).text().replace(/↑/g,'').replace(/↓/g,'');
            var ping = point_str.split('/');
            if (point_str.match(/[a-zA-Z]/g)) {$(this).toggleClass('selected');}
            else if (ping.length) {for (var x in ping) {if (Number(ping[x])<=5){$(this).toggleClass('selected');break;} } } });
        if (ss_table.rows('.selected').data().length > 0){
            layer.msg("已移除不稳定链接("+ss_table.rows('.selected').data().length+"条)", {time:1000});
            $('#btn_clear').before("<small> (已移除"+ss_table.rows('.selected').data().length+"条) </small>");
            ss_table.rows('.selected').remove().draw();
        } else {
            layer.msg("所有链接较为稳定(＞5)", {time:1000});
        }
        ss_table.order( [ 0, 'asc' ] ).draw();
        $("#total").html("共 "+ ss_table.data().length+" 条");
        $('#btn_clear').remove();
        make_area();
        method_clear();
    });
    ss_table.$('tr').click( function () {
        $(this).toggleClass('selected');
        if (ss_table.rows('.selected').data().length){
            $("#sel").html("，已选 "+ss_table.rows('.selected').data().length+" 条");
        } else {
            $("#sel").html("");
        }
    } );
    // 等待1s
    setTimeout(function(){
        $(ss_id+' tbody').off('click','i');
        $(ss_id+' tbody').on('click','i',function(){tools.qr(ss_table.row($(this).closest('tr')).data());});
    },1000);
}

function client_info(){
    $('#client').show();
    layer.open({
        type:1,
        title:false,
        closeBtn:0,
        shade:0.7,
        area: '500px',
        shadeClose:true,
        content:$('#client'),
        end : function(){$('#client').hide();}
    });
}

function site_info(){
    $('div.footer').show();
    layer.open({
        type:1,
        title:false,
        closeBtn:0,
        shade:0.7,
        area: '500px',
        shadeClose:true,
        content:$('div.footer'),
        end : function(){$('div.footer').hide();}
    });
}

function failed(){
    if (link_count === 0) {
        layer.confirm(ss_id+' 貌似脚本加载失败了！？<br>请等待页面加载，或者...', {
            title: GM_info.script.name+" "+GM_info.script.version,
            closeBtn: 0,
            shade: 0.5,
            shadeClose: true,
            resize: false,
            btn: ['刷新','反馈']
        }, function(){
            location.reload();
        }, function(){
            GM_openInTab(GM_info.script.supportURL);
        });
    }
}

function method_clear() {
    layer.confirm('是否移除不兼容SSR的协议？', {
        title: false,
        closeBtn: 0,
        shade: 0.5,
        shadeClose: true,
        resize: false,
        btn: ['确定','取消']
    }, function(index){
        check_method();
        layer.close(index);
    }, function(index){
        layer.close(index);
    });
}

unsafeWindow.tools = tools;
unsafeWindow.start = start;

$(document).ready(function() {
    $(ss_id).on('init.dt', function (){ start(); });
    setTimeout(function(){failed();},5000);
});
