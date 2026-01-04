// ==UserScript==
// @name         canvas直接转图片下载
// @namespace    https://www.yeqisong.cn
// @version      0.2
// @description  canvas图表直接下载-将网页上的canvas内容直接转化为png图片并进行下载，可以在图表秀等网站使用。
// @author       bnbnyu
// @require      http://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @icon         https://sso.tubiaoxiu.com/favicon.png
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373550/canvas%E7%9B%B4%E6%8E%A5%E8%BD%AC%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/373550/canvas%E7%9B%B4%E6%8E%A5%E8%BD%AC%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
$(document).ready(function () {
    var prhtml = '';
    prhtml += '<div class="dpannel" style="display: none; background:#fff; width: 350px; height:auto; position: fixed; bottom:15px; right:15px; box-shadow:0 0 6px rgba(0,0,0,0.6); font-size:12px;">';
    prhtml += '<div style="height:40px; line-height:40px; font-size:1.2em; font-weight:700; text-align:center; padding-top:20px;">将Canvas转为png图片</div>';
    prhtml += '<div style="width: 330px; margin-left:10px; padding:10px 0px; text-align: center;"><img style="max-width:100%; margin:0px auto;" class="canvaspng"/></div>';
    prhtml += '<div style="text-align:center; padding: 10px; ">长度: <span class="canvs_width"></span>px;宽度: <span class="canvs_height"></span>px</div>';
    prhtml += '<div style="text-align:center; padding-bottom: 30px;"><div id="dpannel_sure" style="display:inline-block; background:#ff6900; cursor:pointer; font-size:14px; font-weight:bold; color:#fff; text-align:center; width:100px; height:25px; line-height:25px;">确定</div><div id="dpannel_close" style="display:inline-block; font-size:14px; cursor:pointer; font-weight:bold; text-align:center; width:100px; height:25px; line-height:25px; margin-left:25px;">关闭</div></div>';
    prhtml += '</div>';
    $("body").append(prhtml);
    var canvas_content = '';
    var canvas_width = 300;
    var canvas_height = 150;
    //移入canvase显示下载按钮
    $("body").on("mouseover","canvas",function(){
        canvas_content = '';
        canvas_width = 300;
        canvas_height = 150;
        var _this = this;
        var this_index = $(_this).index(_this);
        //为当前canvas增加class属性org-canvas
        $(_this).addClass("org_canvas_"+this_index);
        if($(_this).parent().children('.down_canvas_to_img').length == 0){
            $(_this).after('<div class="down_canvas_to_img" data-canvas="org_canvas_'+this_index+'" style="display:none; margin:0px; padding:0px; position: relative; cursor:pointer; width:100px; height:20px; line-height:20px; background:#ff6900; color:#fff; font-size:12px; text-align:center; left:10px; top:-25px;">下载为图片</div>');
        }
        //当前canvas的内容获取
        canvas_content = _this.toDataURL("image/png");
        canvas_width = _this.width;
        canvas_height = _this.height;
        $(_this).parent().find('.down_canvas_to_img').css("display","block");
    });
    //移出canvas且不在按钮上时，隐藏下载按钮
    $("body").on("mouseout", "canvas", function(){
        if(!$(this).parent().find('.down_canvas_to_img').is(':hover')){
            $(this).parent().find('.down_canvas_to_img').css("display","none");
        }
    });
    //移除按钮时隐藏下载按钮
    $("body").on("mouseout", ".down_canvas_to_img", function(){
        $(this).css("display", "none");
    });
    //点击现在按钮，弹出下载预览窗口
    $("body").on("click", ".down_canvas_to_img", function(){
        var _this = this;
        $(".dpannel").css("display", "block");
        $(".canvaspng").attr("src", canvas_content);
        $(".canvs_width").html(canvas_width);
        $(".canvs_height").html(canvas_height);
    });
    //点击下载确定按钮，将canvas下载为图片
    $("body").on("click", "#dpannel_sure", function(){
        var _this = this;
        saveFile(canvas_content, "canvas2png");
    });
    //点击下载关闭按钮，关闭下载窗口
    $("body").on("click", "#dpannel_close", function(){
        var _this = this;
        $(".dpannel").css("display", "none");
    });
    //自动保存图片
    function saveFile(data, filename) {
        const save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
        save_link.href = data;
        save_link.download = filename;
        const event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        save_link.dispatchEvent(event);
    }
});