// ==UserScript==
// @namespace    https://greasyfork.org/zh-CN/users/30310-adan1
// @name         游侠3DM去广告
// @description  去除游侠和3DM网站的广告
// @icon		 http://game.ali213.net/favicon.ico
// @author       Adan1
// @exclude      http://adan.homepage/
// @include      http://bbs.3dmgame.com/*
// @include      http://www.3dmgame.com/*
// @include      http://dl.3dmgame.com/*
// @include      http://game.ali213.net/*
// @include      http://down.ali213.net/*
// @include      http://gl.ali213.net/*
// @include      http://0day.ali213.net/*
// @include      http://www.ali213.net/*
// @exclude      http://www.ali213.net/vote*
// @include      http://bt.ali213.net/*
// @include      http://zhidao.ali213.net/*
// @include      http://patch.ali213.net/*
// @include      http://web.ali213.net/*
// @include      http://v.ali213.net/*
// @include      http://pic.ali213.net/*
// @include      http://xyx.ali213.net/*
// @include      http://tv.ali213.net/*
// @include      http://pk.ali213.net/*
// @grant        none
// @require		 http://cdn.staticfile.org/jquery/1.8.3/jquery.min.js
// @run-at       document-end
// @encoding     utf-8
// @date         16/02/2016
// @version      1.0
// @modified     18/02/2016
// @downloadURL https://update.greasyfork.org/scripts/17168/%E6%B8%B8%E4%BE%A03DM%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/17168/%E6%B8%B8%E4%BE%A03DM%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==


function RemoveCore(){ // maybe mod to none-display
	this.$ = function(slt){ //alert(arguments.callee);
    	var rs = window.$(slt).remove();
        return rs.size();
    };
    this.$id = function(id, prtlvl){ //alert(arguments.callee);
        var rs = window.$("#"+id);
        prtlvl = parseInt(prtlvl, 10);
        if(!isNaN(prtlvl)){// && prtlvl>0
            for(; prtlvl>0; prtlvl--){
            	rs = rs.parent();
            }
        }
    	rs = rs.remove();
        return rs.size();
    };
    this.$Fid = function(id){ //alert(arguments.callee);
    	// Force remove... 还没测试兼容性
        var rm = function(){
        	window.$("#"+id).html("");
        	var rs = window.$("#"+id).remove();
            return rs;
		};
    	setTimeout(rm, 1234);
        return rm();
    };
    this.$cldr =function(prt, cldr){ //alert(arguments.callee);
		var rs = window.$(prt).children(cldr).remove();
        return rs.size();
	};
	this.$find = function(prt, desc){ //alert(arguments.callee);
		var rs = window.$(prt).find(desc).remove();
        return rs.size();
	};
}

function RemoveClass(name){
    RemoveCore.call(this);
    this.name = name;
    (function(dis){
    var block = true; // switch for op-blocking
    var counter = [];
	for(var fn in dis){
        if(fn.charAt(0)=="$"){
            (function(tgfn){
                var _fn = function(){ // AOP
                    //alert(tgfn);
                    var rs = tgfn.apply(dis, arguments);
                    counter.push(rs); // collect sth via json?
                    
                    
                    return dis;
                };
                if(block==true){
                	dis[fn] = function(){
                    	counter.push([_fn, arguments]);
                        return dis;
                    };
                }else{
					dis[fn] = _fn;                	
                }
            })(dis[fn]);
        }
    }
    dis.exe = function(log){ //execute(xc)... log sth
        if(block==true){
            var _counter = counter; counter = []; //IMPORTANT
            for(var c=0; c<_counter.length; c++){ // 在http://bt.ali213.net/页面有bug不能针对数组用var c in _counter因为索引会多出'$family'
                _counter[c][0].apply(dis, _counter[c][1]);
            }
        }
        //alert(this.name);
        if(log==0){
            alert(this.name+" "+counter.join("+"));
        }
        
        counter = [];
    };
    })(this);
    
}
var rmTB = new RemoveClass("顶底广告");
var rmCt = new RemoveClass("内容广告");


if(window.location.hostname.lastIndexOf("ali213.net") > -1){ // for 游侠
	// sample http://game.ali213.net/
    rmTB.$id("hd_ad").$("#wp div:first").$("div.wp.a_f").exe();
	rmCt.$find("td.plc", "div.a_pb, div.a_pt").$("tr.ad>td.plc").exe();
    // sample http://down.ali213.net/
    rmTB.$("div.Ali_down_advertising").exe(); //$("#EyeableArea>div.Ali_down>div.Ali_down").remove();
    rmCt.$id("ShowDIV").$("a[href^='http://click.ali213.net/']").exe();
    // sample http://down.ali213.net/pcgame/streetfighter5.html
    rmCt.$find("div.detail_body_left", "div.newdown_r, div.detail_body_con>center, div.detail_down_adress_con_bottom_right_con1>div, div.detail_Guang, div.detail_body_con>div:last")
    	.$cldr("div.detail_body_right", "div:first, div:last").exe();
    // sample http://www.ali213.net/hanhua/
    rmTB.$("div.banner>div.daohang").exe();
    // sample http://www.ali213.net/hanhua/PC/anno2205v32.html
    rmCt.$Fid("BAIDU_UNION__wrapper_u1739467_0_left").$Fid("BAIDU_UNION__wrapper_u1739467_0_right")
    	.$("div.newpatch_r").$cldr("div.xiazleir_right", "div:first, div:last").exe();
    // sample http://www.ali213.net/zt/l4d3/
    rmCt.$find("div.zhongjleft_2", "div.mt5, div.tu_6>div>div:last").exe();
    // sample http://www.ali213.net/zt/xcom2/
    rmCt.$find("div.zt_center_con_body_left_pf", "#BAIDU_UNION__wrapper_u1687341_0, div.zt_center_con_body_left_gametj>ins").$Fid("tanxssp_con_mm_109940340_9582338_32014030")
    	.$find("div.zt_center_con_body_right","div.zt_center_con_body_right_zizi, center, div.zt_center_con_body_right_yxpl_con>div>div:last").exe();
    // sample http://www.ali213.net/zt/xcom2/down/
    rmCt.$("div.down_gameyxph>div:first").exe();
    // sample http://gl.ali213.net/html/2016-2/106651.html
    rmCt.$id("GLDIV").$find("div.glzjshow", "#BAIDU_UNION__wrapper_u1731103_0, div.glzjshow_plun>div:last")//
    	.$cldr("div.glzjll_r", "div:first, ins").exe();
    // sample http://0day.ali213.net/
    rmTB.$("div.logo_r").exe();
    // sample http://0day.ali213.net/html/2014/12315.html
    rmCt.$find("div.xginfo_l", "div.ali_guanggao_700, div.xginfo_l_plun>div:last")
    	.$("div.xginfo_r div.ali_guanggao_250").exe();
    // sample http://www.ali213.net/paihb.html
    rmTB.$id("BAIDU_UNION__wrapper_u1281027_0").exe();
    // sample http://www.ali213.net/
    rmTB.$("div.ali-kp").$("div.ali-ad-two").exe();
    rmCt.$id("ali-focus-up").$("div.ali-ad-one-215").exe();
    // sample http://www.ali213.net/news/pcgame/
    rmCt.$("div.newright").$id("ShowGDDIV").exe();
    // sample http://www.ali213.net/news/
    rmTB.$("div.ad").exe();
    // sample http://www.ali213.net/news/html/2016-2/208279.html
    rmTB.$("div.guanggao1").exe();
    rmCt.$id("BAIDU_UNION__wrapper_u1462344_0", 1).$id("BAIDU_UNION__wrapper_u1723733_0", 2)
    	.$("div.new_lei_right>ins").$Fid("tanxssp_con_mm_109940340_9582338_32434489").exe();
    // sample http://www.ali213.net/zhuanti/nfs/
    rmCt.$Fid("tanxssp_con_mm_109940340_9582338_32014046").exe();
    // sample http://www.ali213.net/emu/
    rmTB.$("embed[src^='http://bmp.ali213.net/'][src$='.swf']").exe();
    // sample http://bt.ali213.net/
    rmCt.$Fid("tanxssp_con_mm_109940340_9582338_32218261").exe();
    // sample http://down.ali213.net/pcgame/
    rmCt.$("div.getsite_952").$("div.list_body_gb").exe();
    // sample http://gl.ali213.net/html/2016-2/107129_66.html
    rmCt.$id("BAIDU_UNION__wrapper_u1749604_0", 2).exe();
    // sample http://zhidao.ali213.net/q/151215757.html
    rmCt.$id("BAIDU_UNION__wrapper_u2004575_0").$Fid("tanxssp_con_mm_109940340_9582338_32014046").exe();
    // sample http://patch.ali213.net/showpatch/53079.html
    rmCt.$("div.GG_100").$("div.GG_302").$Fid("tanxssp_con_mm_109940340_9582338_32016049").$("div.right >div:last").exe();
    // sample http://v.ali213.net/video/160217/153791.html
    rmTB.$("div.vedio_mlogo").exe();
    // sample http://pic.ali213.net/html/2016-02-01/59923_4.html
    rmCt.$Fid("BAIDU_UNION__wrapper_u1668068_0_left").$Fid("BAIDU_UNION__wrapper_u1668068_0_right").exe();
    // sample http://xyx.ali213.net/
    rmTB.$("div.hotzt_con>div:first").$id("BAIDU_UNION__wrapper_u1495878_0").exe();
    rmCt.$Fid("BAIDU_UNION__wrapper_u1456262_0_left").$Fid("BAIDU_UNION__wrapper_u1456262_0_right").$Fid("tanxssp_con_mm_109940340_9582338_32218261").exe();
    // sample http://xyx.ali213.net/game/1602/114335.html
    rmTB.$id("BAIDU_UNION__wrapper_u1495874_0").exe();
    rmCt.$("div.conbody_top>div.left").exe();
    // sample http://xyx.ali213.net/play/1601/111557.html
    rmCt.$id("BAIDU_UNION__wrapper_u1529247_0").exe();
    
    
    
    return; // SCRIPT END
}



//alert("3DM START");
function removeById(id){
	$("#"+id).remove();
}
function removeLaterById(id){
    var rm = function(){
        $("#"+id).html("");
        $("#"+id).remove();
	};
    rm();
    setTimeout(rm, 1234);
}

// 顶底广告
$("div.wp.a_h").remove();
$("div.banner").remove();
$("div.ad_top").remove();
removeById("AD");
// 内容广告
$("div.a_pt").remove();
$("div.baidu-dan-control-bar").parent().remove();
removeLaterById("__QY_RM_Div");
removeLaterById("cs_right_bottom");
removeById("clickbgleft"); removeById("clickbgRight"); removeById("box");
removeById("BAIDU_UNION__wrapper_u1616684_0");

//alert("3DM END");




