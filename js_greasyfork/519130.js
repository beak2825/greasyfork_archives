// ==UserScript==
// @name         淘宝旺铺-页面装修-【换源版】模块ID与功能匹配
// @namespace    http://tampermonkey.net/
// @version      0.33
// @description  描述：淘宝旺铺-页面装修-模块ID与功能匹配-换源版
// @author       pan
// @match        https://tbshop.taobao.com/app/tb-shop/wangpu*
// @icon         https://www.taobao.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519130/%E6%B7%98%E5%AE%9D%E6%97%BA%E9%93%BA-%E9%A1%B5%E9%9D%A2%E8%A3%85%E4%BF%AE-%E3%80%90%E6%8D%A2%E6%BA%90%E7%89%88%E3%80%91%E6%A8%A1%E5%9D%97ID%E4%B8%8E%E5%8A%9F%E8%83%BD%E5%8C%B9%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/519130/%E6%B7%98%E5%AE%9D%E6%97%BA%E9%93%BA-%E9%A1%B5%E9%9D%A2%E8%A3%85%E4%BF%AE-%E3%80%90%E6%8D%A2%E6%BA%90%E7%89%88%E3%80%91%E6%A8%A1%E5%9D%97ID%E4%B8%8E%E5%8A%9F%E8%83%BD%E5%8C%B9%E9%85%8D.meta.js
// ==/UserScript==

var ux_pop_draged = false;
var ux_pop_mini_status = false; // false=hide, true=show;
var check_cell_interval;
var ajax_status = false;

// 元素样式整理
var mobile_container_class = "next-loading next-loading-inline sc-epALIP iBZoTe"; //next-loading next-loading-inline sc-bTmccw gvqqBY"; //next-loading next-loading-inline sc-fSUSjI hyiuSc";
var mobile_container_child_right_div_class = "sc-gFAWRd jxKcjk"; //sc-gkJlnC hKaTbP"; //sc-gzzPqb jBYOJY"; //有data-spm-anchor-id
var cell_list_class = "sc-tagGq SBBgi"; //sc-fmRtwQ iLpCcL"; //sc-eEOqmf ghLyZh"; //id的父级div && name的父级div
var cell_name_class = "sc-kdBSHD jXBTun"; //sc-lkwKjF kfZqOg //sc-eEOqmf eyKNPG"; //sc-jWEIYm beXBWK";
var cell_id_class = "sc-kOHTFB iwRhpW"; //sc-hAsxaJ dXbvgK"; //sc-eGAhfa dnkZVn";
var left_side_class = "sc-koXPp gfclzQ"; //sc-eKBdFk bpJtuV"; //sc-jIAOiI iGhHeh"; //有open属性


(function() {

    import_js("https://bangbangdegithub.github.io/src/js/blueimp-md5-v2.18.0.js");
    import_js("https://bangbangdegithub.github.io/src/js/jquery-3.6.4.min.js", function(){

        // 初始化pop窗口
        init_pop();

        // pop窗口位置设置
        pop_scroll_reset();

        // pop窗口的方法初始化
        init_pop_function();

        setInterval(function() {
            pop_scroll_reset();
        }, 200);

        // 默认pop窗口最小化
        $("#ux_pop_drag .drag_mini").click();

        // cell模块的点击事件初始化
        check_cell_interval = setInterval(function(){
            init_cell_function();
        }, 100);

    });
})();

function import_js(t, e) {
    var n = document.createElement("script");
    n.type = "text/javascript", void 0 !== e && (n.readyState ? n.onreadystatechange = function() {
        "loaded" != n.readyState && "complete" != n.readyState || (n.onreadystatechange = null, e())
    } : n.onload = function() {
        e()
    }), n.src = t, document.body.appendChild(n)
}

// cell模块的点击事件初始化
function init_cell_function(){
    console.log("init_cell_function");

    // 手机展示区块的父级div mobile_container
    // 各个区块 cell_list
    var mobile_container = $("body").find("div[class^='"+mobile_container_class+"']").find("div[class^='"+mobile_container_child_right_div_class+"']");
    var cell_list = mobile_container.find("div[class^='"+cell_list_class+"']");

    // cell模块异步加载，判断元素个数>0表示加载完毕
    if (cell_list.length > 0) {
        console.log("init_cell_function done");

        // 每个cell样式 [cell_list_class]
        mobile_container.find("div[class^='"+cell_list_class+"']").unbind();
        mobile_container.find("div[class^='"+cell_list_class+"']").click(function(){
            // 每个纯数字id的div的父级 [cell_id_class]
            var this_cell_id = $(this).find("div[class^='"+cell_id_class+"'] div:eq(0)").attr("id");
            if (this_cell_id.indexOf("cell_") == 0) {
                this_cell_id = this_cell_id.replace("cell_", "");
            }
            module_id_scroll_into_view(this_cell_id);
        });
        clearInterval(check_cell_interval);
    }
}

// 点击cell模块后，pop滚动到对应模块id，并点击pop
function module_id_scroll_into_view(cell_id){
    if (ux_pop_mini_status == false) {
        return;
    }
    $("#ux_pop_drag .module_list ul li").each(function(index, value){
        var this_module_id = $(this).html();
        if (this_module_id.indexOf(cell_id) != -1) {
            var this_obj = $(this);
            setTimeout(function(){
                this_obj[0].scrollIntoView({behavior: "auto", block: "center", inline: "nearest"});
                this_obj.click();
            }, 500);
            return false;
        }
    });
}


// 初始化pop窗口
function init_pop(){
    var style_str = '<style type="text/css">'+
        '#ux_pop_mark {width: 430px;height: 50px;position: absolute;z-index: 999;font-size: 12px;background: #ff9900b8;-moz-user-select:none;      /* <-火狐 */-webkit-user-select:none;   /* <-谷歌 */-ms-user-select:none;       /* <-IE */user-select:none;}'+
        '#ux_pop_mark span{padding-left: 10px;line-height: 50px;}'+
        '#ux_pop_drag{width: 430px;height: 300px;position: absolute;z-index: 999;font-size: 12px;}'+
        '#ux_pop_drag .drag_header{height: 30px;width: 100%;-moz-user-select:none;      /* <-火狐 */-webkit-user-select:none;   /* <-谷歌 */-ms-user-select:none;       /* <-IE */user-select:none;}'+
        '#ux_pop_drag .drag_header .drag_dom{line-height: 30px;background: #1a89fbd1;height: 30px;width: 250px;float: left;}'+
        '#ux_pop_drag .drag_header .drag_dom span{padding-left: 10px;}'+
        '#ux_pop_drag .drag_header .drag_dom span.ux_pop_tips{float: right;padding-right: 10px;}'+
        '#ux_pop_drag .drag_header .drag_dom span.ux_pop_tips.success{color: #000000;background: #00ff00;}'+
        '#ux_pop_drag .drag_header .drag_dom span.ux_pop_tips.error{color: #ffffff;background: #ff2d5b;}'+
        '#ux_pop_drag .drag_header .drag_dom span.ux_pop_tips.pending{color: #ffffff;background: #f8af42;}'+
        '#ux_pop_drag .drag_header .drag_btn{background: #77baff;line-height: 30px;height: 30px;width: 50px;float: left;text-align: center;}'+
        '#ux_pop_drag .drag_header .drag_btn.get_module{width: 80px;}'+
        '#ux_pop_drag .drag_header .drag_btn:hover{background: #ffffff;}'+
        '#ux_pop_drag .drag_content{background: #0000006b;height: 292px;width: 100%;}'+
        '#ux_pop_drag .drag_content .module_list{border-top: 1px #ccc solid;border-bottom: 1px #ccc solid;height: 120px;width: 100%;float: left;overflow-x: hidden;overflow-y: scroll;}'+
        '#ux_pop_drag .drag_content .module_list .scrollbar {width : 30px;height: 120px;margin: 0 auto;}'+
        '#ux_pop_drag .drag_content .module_list::-webkit-scrollbar {/*滚动条整体样式*/width : 10px;/*高宽分别对应横竖滚动条的尺寸*/height: 1px;display: block;}'+
        '#ux_pop_drag .drag_content .module_list::-webkit-scrollbar-thumb {/*滚动条里面小方块*/border-radius: 10px;box-shadow : inset 0 0 5px rgba(0, 0, 0, 0.2);background : #535353;}'+
        '#ux_pop_drag .drag_content .module_list::-webkit-scrollbar-track {/*滚动条里面轨道*/box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);border-radius: 10px;background : #ededed;}'+
        '#ux_pop_drag .drag_content .module_list ul{color: #fff;list-style: none;margin: 0;padding: 0;float: left;width: 100%;}'+
        '#ux_pop_drag .drag_content .module_list ul li {line-height: 24px;padding-left: 10px;}'+
        '#ux_pop_drag .drag_content .module_list ul li.selected {color: #000000;background: #ffffff91;}'+
        '#ux_pop_drag .drag_content .module_list ul li:hover {color: #000000;background: #ffffff91;}'+
        '#ux_pop_drag .drag_content .module_list ul li.green {padding-left: 0px;border-left: 10px solid #00ff00;}'+
        '#ux_pop_drag .drag_content .module_list ul li.red {padding-left: 0px;border-left: 10px solid #ff3f3f;}'+
        '#ux_pop_drag .drag_content .module_list ul li.orange {padding-left: 0px;border-left: 10px solid #ff9900;}'+
        '#ux_pop_drag .drag_content .module_list ul li.yellow {padding-left: 0px;border-left: 10px solid #ffeb00;}'+
        '#ux_pop_drag .drag_content .module_form {width: 100%;padding-top:5px;}'+
        '#ux_pop_drag .drag_content .module_form label {width: 100%;display: block;}'+
        '#ux_pop_drag .drag_content .module_form label span {padding-left: 10px;color: #fff;text-align: right;display: inline-block;width: 70px;}'+
        '#ux_pop_drag .drag_content .module_form label input {width: 340px;height: 28px;padding: 1px 2px;}'+
        '#ux_pop_drag .drag_content .module_form p {height: 28px; margin: 0; padding-left: 80px; padding-right: 2px;}'+
        '#ux_pop_drag .drag_content .module_form p button{width: 50%; height: 28px;}'+
        '#ux_pop_drag .drag_content .module_form p button.btn-primary {}'+
        '#ux_pop_drag .drag_content .module_form p button.btn-primary:hover {}'+
        '#ux_pop_drag .drag_content .module_form p button.btn-danger {}'+
        '#ux_pop_drag .drag_content .module_form p button.btn-danger:hover {}'+
        '#ux_pop_drag .shield_header{height:30px;width:100%;-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none;user-select:none;border-top:1px #ccc solid;border-bottom:1px #ccc solid;}'+
        '#ux_pop_drag .shield_header .shield_dom{line-height:30px;background:#1a89fbd1;height:30px;width:380px;float:left;}'+
        '#ux_pop_drag .shield_header .shield_dom span{padding-left:10px;}'+
        '#ux_pop_drag .shield_header .shield_btn{background:#77baff;line-height:30px;height:30px;width:50px;float:left;text-align:center;}'+
        '#ux_pop_drag .shield_header .shield_btn:hover{background:#ffffff;}'+
        '#ux_pop_drag .shield_content{background:#0000006b;height:120px;width:100%;}'+
        '#ux_pop_drag .shield_content .shield_list{border-top:1px #ccc solid;height:120px;width:100%;float:left;overflow-x:hidden;overflow-y:scroll;}'+
        '#ux_pop_drag .shield_content .shield_list .scrollbar{width:30px;height:120px;margin:0 auto;}'+
        '#ux_pop_drag .shield_content .shield_list::-webkit-scrollbar{width:10px;height:1px;display:block;}'+
        '#ux_pop_drag .shield_content .shield_list::-webkit-scrollbar-thumb{border-radius:10px;box-shadow:inset 0 0 5px rgba(0,0,0,0.2);background:#535353;}'+
        '#ux_pop_drag .shield_content .shield_list::-webkit-scrollbar-track{box-shadow:inset 0 0 5px rgba(0,0,0,0.2);border-radius:10px;background:#ededed;}'+
        '#ux_pop_drag .shield_content .shield_list ul{color:#fff;list-style:none;margin:0;padding:0;float:left;width:100%;}'+
        '#ux_pop_drag .shield_content .shield_list ul li{line-height:24px;padding-left:10px;}'+
        '#ux_pop_drag .shield_content .shield_list ul li.selected{color:#000000;background:#ffffff91;}'+
        '#ux_pop_drag .shield_content .shield_list ul li:hover{color:#000000;background:#ffffff91;}'+
        '#ux_pop_drag .shield_content .shield_list ul li.green{padding-left:0px;border-left:10px solid #00ff00;}'+
        '#ux_pop_drag .shield_content .shield_list ul li.red{padding-left:0px;border-left:10px solid #ff3f3f;}'+
        '#ux_pop_drag .shield_content .shield_list ul li.orange{padding-left:0px;border-left:10px solid #ff9900;}'+
        '#ux_pop_drag .shield_content .shield_list ul li.yellow{padding-left:0px;border-left:10px solid #ffeb00;}</style>';
    $("head").append(style_str);

    var pop_html =
        '<div id="ux_pop_mark"><span>模块区域指示====》》》</span></div>'+
        '<div id="ux_pop_drag">'+
            '<div class="drag_header">'+
                '<div class="drag_dom">'+
                    '<span>按住拖拽</span>'+
                    '<span class="ux_pop_tips"></span>'+
                '</div>'+
                '<div class="drag_btn get_module">获取模块ID</div>'+
                '<div class="drag_btn drag_reset">复位</div>'+
                '<div class="drag_btn drag_mini">最小化</div>'+
            '</div>'+
            '<div class="drag_content">'+
                '<div class="module_list">'+
                    '<ul></ul>'+
                    '<div class="scrollbar"></div>'+
                '</div>'+
                '<div style="clear: both;"></div>'+
                '<div class="module_form">'+
                    '<input type="hidden" id="ux_pop_module_name" name="module_name">'+
                    '<input type="hidden" id="ux_pop_shield_status" name="shield_status">'+
                    '<label>'+
                        '<span>模块ID：</span>'+
                        '<input type="text" id="ux_pop_module_id" name="module_id" readonly="">'+
                    '</label>'+
                    '<label>'+
                        '<span>模块类型：</span>'+
                        '<input type="text" id="ux_pop_module_type" name="module_type">'+
                    '</label>'+
                    '<label>'+
                        '<span>其他-1：</span>'+
                        '<input type="text" id="ux_pop_extend_1" name="extend_1">'+
                    '</label>'+
                    '<label>'+
                        '<span>其他-2：</span>'+
                        '<input type="text" id="ux_pop_extend_2" name="extend_2">'+
                    '</label>'+
                    '<p>'+
                        '<button type="button" class="btn-primary" id="ux_pop_submit_btn">提交</button>'+
                        '<button type="button" class="btn-danger" id="ux_pop_shidld_btn">屏蔽</button>'+
                    '</p>'+
                '</div>'+
            '</div>'+
            '<div class="shield_header">'+
                '<div class="shield_dom">'+
                    '<span>屏蔽列表</span>'+
                '</div>'+
                '<div class="shield_btn shield_open">展开</div>'+
            '</div>'+
            '<div class="shield_content">'+
                '<div class="shield_list">'+
                    '<ul></ul>'+
                    '<div class="scrollbar"></div>'+
                '</div>'+
            '</div>'+
        '</div>';
    $("#ux_pop_mark").remove();
    $("#ux_pop_drag").remove();
    $("body").append(pop_html);
}

// pop窗口的方法初始化
function init_pop_function(){
    // 拖拽
    $("#ux_pop_drag .drag_dom").unbind();
    $("#ux_pop_drag .drag_dom").mousedown(function(e) {
        ux_pop_draged = true;

        var positionDiv = $(this).offset();
        var distenceX = e.pageX - positionDiv.left;
        var distenceY = e.pageY - positionDiv.top;

        $(document).mousemove(function(e) {
            var x = e.pageX - distenceX;
            var y = e.pageY - distenceY;

            if (x < 0) {
                x = 0;
            } else if (x > $(document).width() - $("#ux_pop_drag").outerWidth(true)) {
                x = $(document).width() - $("#ux_pop_drag").outerWidth(true);
            }

            if (y < 0) {
                y = 0;
            } else if (y > $(document).height() - $("#ux_pop_drag").outerHeight(true)) {
                y = $(document).height() - $("#ux_pop_drag").outerHeight(true);
            }

            $("#ux_pop_drag").css("left", x+"px");
            $("#ux_pop_drag").css("top", y+"px");
        });

        $(document).mouseup(function() {
            $(document).off('mousemove');
        });
    });

    // 拖拽复位
    $("#ux_pop_drag .drag_reset").unbind();
    $("#ux_pop_drag .drag_reset").click(function() {
        ux_pop_draged = false;
        pop_scroll_reset();
    });

    // 最小化
    $("#ux_pop_drag .drag_mini").unbind();
    $("#ux_pop_drag .drag_mini").click(function() {
        if ($("#ux_pop_drag .drag_content").css('display') == 'none') {
            ux_pop_mini_status = true;
            $("#ux_pop_mark").show();
            $("#ux_pop_drag").css("height", "330px");
            $("#ux_pop_drag").css("width", "430px");
            $("#ux_pop_drag .drag_content").show();
            $("#ux_pop_drag .drag_mini").html('最小化');
            $("#ux_pop_drag .drag_dom").css("width", "250px");

            $("#ux_pop_drag .shield_header").show();
            // $("#ux_pop_drag .shield_content").show();
        }else{
            ux_pop_mini_status = false;
            $("#ux_pop_mark").hide();
            $("#ux_pop_drag").css("height", "30px");
            $("#ux_pop_drag").css("width", "250px");
            $("#ux_pop_drag .drag_content").hide();
            $("#ux_pop_drag .drag_mini").html('最大化');
            $("#ux_pop_drag .drag_dom").css("width", "70px");

            $("#ux_pop_drag .shield_header").hide();
            $("#ux_pop_drag .shield_content").hide();
        }
    });

    // 获取模块ID
    $("#ux_pop_drag .get_module").unbind();
    $("#ux_pop_drag .get_module").click(function() {

        // 获取模块ID
        get_module_id();

        // 异步获取模块数据
        ajax_get_module_list();
    });

    // 点击模块ID
    $("#ux_pop_drag .module_list ul li").unbind();
    $("#ux_pop_drag .module_list ul li").click(function() {
        $("#ux_pop_drag .module_list ul li").removeClass("selected");
        $("#ux_pop_drag .shield_list ul li").removeClass("selected");
        $(this).addClass("selected");

        var this_module_id = $(this).html();
        var this_module_name = $(this).attr('data-name');
        // console.log(this_module_id);

        var this_elem;
        if ($("a-view[data-spmd='" + this_module_id + "']").length > 0) {
            this_elem = $("a-view[data-spmd='" + this_module_id + "']");
        } else if ($("div[data-spmd='" + this_module_id + "']").length > 0) {
            this_elem = $("div[data-spmd='" + this_module_id + "']");
        } else {
            if (this_module_name == '单图海报') {
                // 24486387806
                // tbshopmod-img_poster_24486387806_0
                var div_id = this_module_id.split('_')
                var cell_id = div_id[2]
                this_elem = $("div[id='" + cell_id + "']");
                if (this_elem.length > 0) {
                	console.log("cell_id:",cell_id,",存在");
                }else{
                	console.log("cell_id:",cell_id,",不存在");
                	cell_id = "cell_" + cell_id;
                	this_elem = $("div[id='" + cell_id + "']");
                	if (this_elem.length > 0) {
	                	console.log("cell_id-2:",cell_id,",存在");
	                }else{
	                	console.log("cell_id-2:",cell_id,",不存在");
	                }
                }
            }else{
                pop_tips_error("模块定位失败，请联系技术");
                alert("模块定位失败，请联系技术");
            }
        }
        // console.log(this_elem);

        // 指示区域(橙色)的高度变化
        var this_module_height = this_elem.height();
        $("#ux_pop_mark").height(this_module_height);

        // 页面元素滚动定位
        // 装修区块的父级div样式 [mobile_container_child_right_div_class]
        var this_module_top = this_elem[0].getBoundingClientRect().top;
        var mobile_cur_top = $("div[class^='"+mobile_container_child_right_div_class+"']").scrollTop();
        var mobile_new_top = Number(mobile_cur_top) + Number(this_module_top) - 170;
        $("div[class^='"+mobile_container_child_right_div_class+"']").animate({ scrollTop: mobile_new_top }, "slow");

        // 如果插件div没有移动，则高度自适应
        if (ux_pop_draged == false) {
            var now_top = $("#ux_pop_drag").css("top");
            var top_diff = this_module_height - 50;
            var new_top = now_top + top_diff;
            $("#ux_pop_drag").css("top", new_top);
        }

        $("#ux_pop_module_id").val(this_module_id);
        $("#ux_pop_module_type").val("");
        $("#ux_pop_extend_1").val("");
        $("#ux_pop_extend_2").val("");
        $("#ux_pop_shield_status").val(0);
        $("#ux_pop_shield_status").attr('data-shield', 0);
        $("#ux_pop_module_name").val(this_module_name);
        $("#ux_pop_shidld_btn").html("未屏蔽");

        if (localStorage.getItem("ux_module_list")) {
            var ux_module_list = JSON.parse(localStorage.getItem("ux_module_list"));
            for (var i = ux_module_list.length - 1; i >= 0; i--) {
                if (ux_module_list[i].module_id == this_module_id) {
                    $("#ux_pop_module_type").val(ux_module_list[i].module_type);
                    $("#ux_pop_extend_1").val(ux_module_list[i].ext_var_1);
                    $("#ux_pop_extend_2").val(ux_module_list[i].ext_var_2);

                    if (ux_module_list[i].shield_status == 1) {
                        $("#ux_pop_shield_status").val(1);
                        $("#ux_pop_shield_status").attr('data-shield', 1);
                        $("#ux_pop_shidld_btn").html("已屏蔽");
                    }else{
                        $("#ux_pop_shield_status").val(0);
                        $("#ux_pop_shield_status").attr('data-shield', 0);
                        $("#ux_pop_shidld_btn").html("未屏蔽");
                    }
                }
            }
        }
    });

    // 点击模块ID - 屏蔽
    $("#ux_pop_drag .shield_list ul li").unbind();
    $("#ux_pop_drag .shield_list ul li").click(function() {
        $("#ux_pop_drag .module_list ul li").removeClass("selected");
        $("#ux_pop_drag .shield_list ul li").removeClass("selected");
        $(this).addClass("selected");

        var this_module_id = $(this).html();
        var this_module_name = $(this).attr('data-name');
        // console.log(this_module_id);

        var this_elem;
        if ($("a-view[data-spmd='" + this_module_id + "']").length > 0) {
            this_elem = $("a-view[data-spmd='" + this_module_id + "']");
        } else if ($("div[data-spmd='" + this_module_id + "']").length > 0) {
            this_elem = $("div[data-spmd='" + this_module_id + "']");
        } else {
            if (this_module_name == '单图海报') {
                // 24486387806
                // tbshopmod-img_poster_24486387806_0
                var div_id = this_module_id.split('_')
                var cell_id = div_id[2]
                this_elem = $("div[id='" + cell_id + "']");
                if (this_elem.length > 0) {
                    console.log("cell_id:",cell_id,",存在");
                }else{
                    console.log("cell_id:",cell_id,",不存在");
                    cell_id = "cell_" + cell_id;
                    this_elem = $("div[id='" + cell_id + "']");
                    if (this_elem.length > 0) {
                        console.log("cell_id-2:",cell_id,",存在");
                    }else{
                        console.log("cell_id-2:",cell_id,",不存在");
                    }
                }
            }else{
                pop_tips_error("模块定位失败，请联系技术");
                alert("模块定位失败，请联系技术");
            }
        }
        // console.log(this_elem);

        // 指示区域(橙色)的高度变化
        var this_module_height = this_elem.height();
        $("#ux_pop_mark").height(this_module_height);

        // 页面元素滚动定位
        // 装修区块的父级div样式 [mobile_container_child_right_div_class]
        var this_module_top = this_elem[0].getBoundingClientRect().top;
        var mobile_cur_top = $("div[class^='"+mobile_container_child_right_div_class+"']").scrollTop();
        var mobile_new_top = Number(mobile_cur_top) + Number(this_module_top) - 170;
        $("div[class^='"+mobile_container_child_right_div_class+"']").animate({ scrollTop: mobile_new_top }, "slow");

        // 如果插件div没有移动，则高度自适应
        if (ux_pop_draged == false) {
            var now_top = $("#ux_pop_drag").css("top");
            var top_diff = this_module_height - 50;
            var new_top = now_top + top_diff;
            $("#ux_pop_drag").css("top", new_top);
        }

        $("#ux_pop_module_id").val(this_module_id);
        $("#ux_pop_module_type").val("");
        $("#ux_pop_extend_1").val("");
        $("#ux_pop_extend_2").val("");
        $("#ux_pop_shield_status").val(0);
        $("#ux_pop_shield_status").attr('data-shield', 0);
        $("#ux_pop_module_name").val(this_module_name);
        $("#ux_pop_shidld_btn").html("未屏蔽");

        if (localStorage.getItem("ux_module_list")) {
            var ux_module_list = JSON.parse(localStorage.getItem("ux_module_list"));
            for (var i = ux_module_list.length - 1; i >= 0; i--) {
                if (ux_module_list[i].module_id == this_module_id) {
                    $("#ux_pop_module_type").val(ux_module_list[i].module_type);
                    $("#ux_pop_extend_1").val(ux_module_list[i].ext_var_1);
                    $("#ux_pop_extend_2").val(ux_module_list[i].ext_var_2);

                    if (ux_module_list[i].shield_status == 1) {
                        $("#ux_pop_shield_status").val(1);
                        $("#ux_pop_shield_status").attr('data-shield', 1);
                        $("#ux_pop_shidld_btn").html("已屏蔽");
                    }else{
                        $("#ux_pop_shield_status").val(0);
                        $("#ux_pop_shield_status").attr('data-shield', 0);
                        $("#ux_pop_shidld_btn").html("未屏蔽");
                    }
                }
            }
        }
    });

    // 提交表单
    $("#ux_pop_submit_btn").unbind();
    $("#ux_pop_submit_btn").click(function() {
        ajax_save_module_id_data();
    });

    // 屏蔽 / 取消屏蔽
    $("#ux_pop_shidld_btn").unbind();
    $("#ux_pop_shidld_btn").click(function() {
        var form_module_id = $("#ux_pop_module_id").val();
        var form_shield_status = $("#ux_pop_shield_status").val();
        var form_shield_status_df = $("#ux_pop_shield_status").attr('data-shield');

        if (form_module_id == '') {
            return false;
        }

        if (form_shield_status != form_shield_status_df) {
            var suff_str = "";
        }else{
            var suff_str = "（提交生效）";
        }

        if (form_shield_status == 1) {
            $("#ux_pop_shield_status").val(0);
            $(this).html('未屏蔽'+suff_str);
        }else{
            $("#ux_pop_shield_status").val(1);
            $(this).html('已屏蔽'+suff_str);
        }
    });

    // 屏蔽列表-展开
    $("#ux_pop_drag .shield_open").unbind();
    $("#ux_pop_drag .shield_open").click(function() {
        if ($("#ux_pop_drag .shield_content").css('display') == 'none') {
            $("#ux_pop_drag").css("height", "450px");
            $("#ux_pop_drag .shield_content").show();
            $("#ux_pop_drag .shield_open").html('折叠');
        }else{
            $("#ux_pop_drag").css("height", "330px");
            $("#ux_pop_drag .shield_content").hide();
            $("#ux_pop_drag .shield_open").html('展开');
        }
    });
}

function ajax_save_module_id_data() {
    var ux_pop_module_id = $("#ux_pop_module_id").val();
    var ux_pop_module_type = $("#ux_pop_module_type").val();
    var ux_pop_extend_1 = $("#ux_pop_extend_1").val();
    var ux_pop_extend_2 = $("#ux_pop_extend_2").val();
    var ux_pop_module_name = $("#ux_pop_module_name").val();
    var ux_pop_shield_status = $("#ux_pop_shield_status").val();

    console.log(ux_pop_module_id, ux_pop_module_type, ux_pop_extend_1, ux_pop_extend_2);
    // alert(ux_pop_module_id + "|" + ux_pop_module_type + "|" + ux_pop_extend_1 + "|" + ux_pop_extend_2);

    if (ajax_status) {
        return false;
    }
    if (ux_pop_module_id == '') {
        return false;
    }
    pop_tips_pending("保存数据中...");

    var shopId      = window.globalData.shopId;
    var shopName    = window.globalData.shopName;
    var pageId      = window.globalData.pageId;
    var pageName    = window.globalData.pageName;

    var act     = 'push_ux_info';
    var shop    = shopName;
    var time    = Date.parse(new Date())/1000;
    var sign    = md5(shop+time+act);

    if (shopId == '111481369' && shopName == 'dyson戴森官方旗舰店') {
        ajax_status = true;
        $.ajax({
            type: "POST",
            url: "https://bi-ux.xcxd-inc.com/ux-index.php",
            data: {
                "act":act,
                "shop":shop,
                "time":time,
                "sign":sign,
                "shopId":shopId,
                "pageId":pageId,
                "pageName":pageName,

                "ux_pop_module_id":ux_pop_module_id,
                "ux_pop_module_type":ux_pop_module_type,
                "ux_pop_extend_1":ux_pop_extend_1,
                "ux_pop_extend_2":ux_pop_extend_2,
                "ux_pop_module_name":ux_pop_module_name,
                "ux_pop_shield_status":ux_pop_shield_status,
            },
            dataType: "jsonp",
            jsonpCallback: "ajax_success_callback_asmid",
            success:function(json) {
                ajax_status = false;
                if (json.error == 1) {
                    pop_tips_success(json.data);

                    // 更新到 localStorage
                    if (localStorage.getItem("ux_module_list")) {
                        var ux_module_list = JSON.parse(localStorage.getItem("ux_module_list"));
                        var in_module_list = false;
                        for (var i = ux_module_list.length - 1; i >= 0; i--) {
                            if (ux_module_list[i].module_id == ux_pop_module_id) {

                                in_module_list = true;

                                ux_module_list[i].module_type = ux_pop_module_type;
                                ux_module_list[i].ext_var_1 = ux_pop_extend_1;
                                ux_module_list[i].ext_var_2 = ux_pop_extend_2;
                                ux_module_list[i].shield_status = ux_pop_shield_status;
                            }
                        }
                        if (in_module_list == false) {
                            var length = ux_module_list.length;
                            ux_module_list[length] = {
                                "module_id": ux_pop_module_id,
                                "module_type": ux_pop_module_type,
                                "ext_var_1": ux_pop_extend_1,
                                "ext_var_2": ux_pop_extend_2,
                                "shield_status": ux_pop_shield_status,
                            };
                        }
                        localStorage.setItem("ux_module_list",JSON.stringify(ux_module_list));
                    }else{
                        var ux_module_list_1 = [
                            {
                                "module_id": ux_pop_module_id,
                                "module_type": ux_pop_module_type,
                                "ext_var_1": ux_pop_extend_1,
                                "ext_var_2": ux_pop_extend_2,
                                "shield_status": ux_pop_shield_status,
                            }
                        ]
                        localStorage.setItem("ux_module_list",JSON.stringify(ux_module_list_1));
                    }

                    var non_empty_data_cnt = 0;
                    if (ux_pop_module_type != '') {
                        non_empty_data_cnt++;
                    }
                    if (ux_pop_extend_1 != '') {
                        non_empty_data_cnt++;
                    }
                    if (ux_pop_extend_2 != '') {
                        non_empty_data_cnt++;
                    }

                    // 行头颜色
                    $("#ux_pop_drag .module_list ul li[data-id=\""+ux_pop_module_id+"\"]").removeClass("green yellow orange red");
                    $("#ux_pop_drag .shield_list ul li[data-id=\""+ux_pop_module_id+"\"]").removeClass("green yellow orange red");
                    if (non_empty_data_cnt == 3) {
                        $("#ux_pop_drag .module_list ul li[data-id=\""+ux_pop_module_id+"\"]").addClass("green");
                        $("#ux_pop_drag .shield_list ul li[data-id=\""+ux_pop_module_id+"\"]").addClass("green");
                    }else if (non_empty_data_cnt == 2) {
                        $("#ux_pop_drag .module_list ul li[data-id=\""+ux_pop_module_id+"\"]").addClass("yellow");
                        $("#ux_pop_drag .shield_list ul li[data-id=\""+ux_pop_module_id+"\"]").addClass("yellow");
                    }else if (non_empty_data_cnt == 1) {
                        $("#ux_pop_drag .module_list ul li[data-id=\""+ux_pop_module_id+"\"]").addClass("orange");
                        $("#ux_pop_drag .shield_list ul li[data-id=\""+ux_pop_module_id+"\"]").addClass("orange");
                    }else if (non_empty_data_cnt == 0) {
                        $("#ux_pop_drag .module_list ul li[data-id=\""+ux_pop_module_id+"\"]").addClass("red");
                        $("#ux_pop_drag .shield_list ul li[data-id=\""+ux_pop_module_id+"\"]").addClass("red");
                    }

                    // 屏蔽
                    if (ux_pop_shield_status == 1) {
                        $("#ux_pop_drag .module_list ul li[data-id=\""+ux_pop_module_id+"\"]").hide();
                        $("#ux_pop_drag .shield_list ul li[data-id=\""+ux_pop_module_id+"\"]").show();
                    }else{
                        $("#ux_pop_drag .module_list ul li[data-id=\""+ux_pop_module_id+"\"]").show();
                        $("#ux_pop_drag .shield_list ul li[data-id=\""+ux_pop_module_id+"\"]").hide();
                    }
                }else{
                    pop_tips_error(json.data);
                }
            },
            error:function(){
                ajax_status = false;
                pop_tips_error("请求失败");
            }
        });
    }else{
        alert("该店铺未配置云端数据");
        return false;
    }
}
function ajax_success_callback_asmid(){

}

function pop_tips_success(msg){
    if (ux_pop_mini_status == false) {
        return;
    }
    $("#ux_pop_drag .drag_dom span.ux_pop_tips").removeClass("success error pending");
    $("#ux_pop_drag .drag_dom span.ux_pop_tips").addClass("success");
    $("#ux_pop_drag .drag_dom span.ux_pop_tips").html(msg);
    setTimeout(function(){
        $("#ux_pop_drag .drag_dom span.ux_pop_tips").removeClass("success");
        $("#ux_pop_drag .drag_dom span.ux_pop_tips").html("");
    },3000);
}
function pop_tips_error(msg){
    if (ux_pop_mini_status == false) {
        return;
    }
    $("#ux_pop_drag .drag_dom span.ux_pop_tips").removeClass("success error pending");
    $("#ux_pop_drag .drag_dom span.ux_pop_tips").addClass("error");
    $("#ux_pop_drag .drag_dom span.ux_pop_tips").html(msg);
}
function pop_tips_pending(msg){
    if (ux_pop_mini_status == false) {
        return;
    }
    $("#ux_pop_drag .drag_dom span.ux_pop_tips").removeClass("success error pending");
    $("#ux_pop_drag .drag_dom span.ux_pop_tips").addClass("pending");
    $("#ux_pop_drag .drag_dom span.ux_pop_tips").html(msg);
}

// 获取模块ID
function get_module_id() {
    // console.log("get_module_id");

    // 初始化module_id
    var module_id_list = new Array();
    var module_name_list = {};

    // 手机展示区块的父级div mobile_container
    // 各个区块 cell_list
    var mobile_container = $("body").find("div[class^='"+mobile_container_class+"']").find("div[class^='"+mobile_container_child_right_div_class+"']");
    var cell_list = mobile_container.find("div[class^='"+cell_list_class+"']");

    $.each(cell_list, function(index, value) {
        var has_spmd = false;
        var first_div_id = "";
        var this_module_id = "";
        var this_cell = $(this);

        var cell_name = this_cell.find("div[class^='"+cell_name_class+"']").html();
        var cell_wrap = this_cell.find("div[class^='"+cell_id_class+"']");

        var cell_children = cell_wrap.find("a-view, div");
        $.each(cell_children, function(index2, value2) {
            var this_elem = $(this);
            this_module_id = this_elem.attr("data-spmd");
            var this_dom_id = this_elem.attr("id");

            if (this_module_id) {
                has_spmd = true;
                if (module_id_list.indexOf(this_module_id) == -1) {
                    module_name_list[this_module_id] = cell_name;
                    module_id_list.push(this_module_id);
                }
                return true;    // continue
            }
            if (first_div_id == "" && this_dom_id) {
                first_div_id = this_dom_id;
                if (first_div_id.indexOf("cell_") == 0) {
                	first_div_id = first_div_id.replace("cell_", "");
                }else if (first_div_id.indexOf("imgposter") == 0) {
                	first_div_id = first_div_id.replace("imgposter", "");
                }
            }
        });

        // 如果没有获取到 data-spmd
        if (has_spmd == false) {

            if (cell_name == '多热区切图') {

            }else if (cell_name == '单图海报') {
                if (this_cell.find("div[id='imgposter"+first_div_id+"']")) {
                    // 24486387806
                    // tbshopmod-img_poster_24486387806_0
                    this_module_id = "tbshopmod-img_poster_"+first_div_id+"_0"
                    if (module_id_list.indexOf(this_module_id) == -1) {
                        module_name_list[this_module_id] = cell_name;
                        module_id_list.push(this_module_id);
                    }
                    return true;    // continue
                }
            }

            console.log("未解析出spmd，请检查", first_div_id, cell_name);
        }
    });
    // console.log(module_id_list);
    // console.log(module_name_list);

    var module_id_list_html = "";
    var shield_id_list_html = "";
    $.each(module_id_list, function(index, value) {
        var this_module_name = module_name_list[value];
        module_id_list_html += '<li data-name="'+this_module_name+'" data-id="'+value+'">'+value+'</li>';
        shield_id_list_html += '<li data-name="'+this_module_name+'" data-id="'+value+'" style="display:none;">'+value+'</li>';
    });
    $("#ux_pop_drag .module_list ul").html(module_id_list_html);
    $("#ux_pop_drag .shield_list ul").html(shield_id_list_html);
    init_pop_function();
}

function pop_scroll_reset(){
    var d = document.getElementById("ux_pop_mark");
    d.style.top = "170px";

    // 左侧展开按钮 [left_side_class]
    if ($("div[class^='"+left_side_class+"']").attr("open") == 'open') {
        d.style.left = "380px";
    } else {
        d.style.left = "100px";
    }

    if (ux_pop_draged == false) {
        var mark_height = $("#ux_pop_mark").height();
        d = document.getElementById("ux_pop_drag");
        var d_top = Number(170)+mark_height;
        d.style.top = d_top+"px";
        if ($("div[class^='"+left_side_class+"']").attr("open") == 'open') {
            d.style.left = "380px";
        } else {
            d.style.left = "100px";
        }
    }
}

function ajax_get_module_list(){
    if (ajax_status) {
        return false;
    }
    pop_tips_pending("获取数据中...");

    var shopId      = window.globalData.shopId;
    var shopName    = window.globalData.shopName;
    var pageId      = window.globalData.pageId;
    var pageName    = window.globalData.pageName;

    var act     = 'get_ux_list';
    var shop    = shopName;
    var time    = Date.parse(new Date())/1000;
    var sign    = md5(shop+time+act);

    if (shopId == '111481369' && shopName == 'dyson戴森官方旗舰店') {
        ajax_status = true;
        $.ajax({
            type: "POST",
            url: "https://bi-ux.xcxd-inc.com/ux-index.php",
            data: {
                "act":act,
                "shop":shop,
                "time":time,
                "sign":sign,
                "shopId":shopId,
                "pageId":pageId,
                "pageName":pageName
            },
            dataType: "jsonp",
            jsonpCallback: "ajax_success_callback_agml",
            success:function(json) {
                console.log(json);
                if (json.error == 1) {
                    if (json.data != null && json.data.length > 0) {
                        localStorage.setItem("ux_module_list",JSON.stringify(json.data));
                        for (var i = json.data.length - 1; i >= 0; i--) {
                            var this_module_data = json.data[i];

                            // $("#ux_pop_drag .module_list ul li").each(function(index, value){
                            //     var this_module_id = $(this).html();
                            //     if (this_module_data.module_id == this_module_id) {
                            //         $(this).addClass(this_module_data.data_color);

                            //         if (this_module_data.shield_status == 1) {
                            //             $(this).hide();
                            //         }else{
                            //             $(this).show();
                            //         }
                            //     }
                            // });

                            // $("#ux_pop_drag .shield_list ul li").each(function(index, value){
                            //     var this_module_id = $(this).html();
                            //     if (this_module_data.module_id == this_module_id) {
                            //         $(this).addClass(this_module_data.data_color);

                            //         if (this_module_data.shield_status == 1) {
                            //             $(this).show();
                            //         }else{
                            //             $(this).hide();
                            //         }
                            //     }
                            // });

                            $("#ux_pop_drag .module_list ul li[data-id=\""+this_module_data.module_id+"\"]").addClass(this_module_data.data_color);
                            $("#ux_pop_drag .shield_list ul li[data-id=\""+this_module_data.module_id+"\"]").addClass(this_module_data.data_color);

                            if (this_module_data.shield_status == 1) {
                                $("#ux_pop_drag .module_list ul li[data-id=\""+this_module_data.module_id+"\"]").hide();
                                $("#ux_pop_drag .shield_list ul li[data-id=\""+this_module_data.module_id+"\"]").show();
                            }else{
                                $("#ux_pop_drag .module_list ul li[data-id=\""+this_module_data.module_id+"\"]").show();
                                $("#ux_pop_drag .shield_list ul li[data-id=\""+this_module_data.module_id+"\"]").hide();
                            }
                        }
                    }else{
                        // 清空本地数据
                        if (localStorage.getItem("ux_module_list")) {
                            localStorage.removeItem("ux_module_list");
                        }
                    }
                }
                ajax_status = false;
                pop_tips_success("云端数据获取成功");
            },
            error:function(){
                ajax_status = false;
                pop_tips_error(json.data);
            }
        });
    }else{
        pop_tips_error("该店铺未配置云端数据");
        return false;
    }
}
function ajax_success_callback_agml(){

}

window.onscroll = pop_scroll_reset;
window.onresize = pop_scroll_reset;
window.onload = pop_scroll_reset;