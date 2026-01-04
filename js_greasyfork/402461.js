// ==UserScript==
// @name         _Debug
// @namespace    https://space.bilibili.com/123855714
// @version      0.1
// @description  自用调试
// @author       aspd199
// @include      *://*avgle.com/*
// @include      *://*bilibili.com/*
// @include      *://wiki.biligame.com/*
// @include      *://*pornhub.com/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/402461/_Debug.user.js
// @updateURL https://update.greasyfork.org/scripts/402461/_Debug.meta.js
// ==/UserScript==

var $ = $ || unsafeWindow.jQuery;

(function() {
    'use strict';
//alert(instr("dddfff","df"));
    // Your code here...
    //alert($("#player_3x2_close").length);
    //alert($("#player_3x2_close").innerhtml);
    //$("#player_3x2_close").click();

    if(instr(window.location.host,"avgle")>0) {
        $(".video-banner").hide();
        $(".col-md-4.col-sm-5").hide();
        $(".col-lg-8.col-md-8.col-sm-7").addClass("col-lg-12");
        $(".col-lg-8.col-md-8.col-sm-7").addClass("col-md-12");
        $(".col-lg-8.col-md-8.col-sm-7").addClass("col-sm-12");
        $(".col-lg-12.col-md-12.col-sm-12").removeClass("col-md-8");
        $(".col-lg-12.col-md-12.col-sm-12").removeClass("col-sm-7");
        $(".col-lg-12.col-md-12.col-sm-12").removeClass("col-lg-8");
        $("#adxp").hide();
        $("#exo-native").hide();
        $(".alert-danger").hide();
        $(".container").css("margin-left","0px");
        //$('#player_3x2_container').hide();
        //$('#aoverlay').hide();
        $("iframe").hide();
        //$("[style^=vis]").hide();
        $(".hide-me-please2").parent().hide();
        closeAd();
    }else if(instr(window.location.host,"pornhub")>0) {
        $("#hd-rightColVideoPage .clearfix").hide();
        $(".streamatesModelsContainer").hide();
        $(".hd.clear").hide();
        $(".sniperModeEngaged").hide();
        $("#streamMateModel").parent().hide();
        $(".removeAdLink.removeAdsStyle").parent().hide();
        $("[class^=ad]").hide();
    }else if(instr(window.location.host,"wiki")>0) {
        //$(".game-bg").css("margin-left","0");//临时不改变位置
        $("#firstHeading").show();
        $("#firstHeadingTools").show();
        var mw=mediaWiki;
        var menul = $("<ul class='menu'>").appendTo("body");
        menul.append('<li id="wiki"><a href="../wiki" target="_blank"><div style="position: relative;width:24px;height:24px;display: inline-block;vertical-align: middle;overflow: hidden; margin-right:8px"><img src="//patchwiki.biligame.com/resources/assets/images/logo/logo_wiki.png" style="position: absolute;top: -9px;left: 0px;height: 37px;max-width:inherit!important;"></div>官方聚合</a></li>');
        menul.append('<li id="alterna"><a href="../alterna" target="_blank"><img src="../wiki/Special:Redirect/file/alterna_icon.png">妃十三学园</a></li>');
        menul.append('<li id="bh3"><a href="../bh3" target="_blank"><img src="../wiki/Special:Redirect/file/bh3_icon.png">崩坏3</a></li>');
        menul.append('<li id="blhx"><a href="../blhx" target="_blank"><img src="../wiki/Special:Redirect/file/碧蓝航线_icon.png">碧蓝航线</a></li>');
        menul.append('<li id="factorio"><a href="../factorio" target="_blank"><img src="../wiki/Special:Redirect/file/factorio_icon.png">异星工厂</a></li>');
        menul.append('<li id="fzzl"><a href="../fzzl" target="_blank"><img src="../wiki/Special:Redirect/file/方舟指令_icon.png">方舟指令</a></li>');
        menul.append('<li id="oni"><a href="../oni" target="_blank"><img src="../wiki/Special:Redirect/file/oni_icon.png">缺氧</a></li>');
        menul.append('<li id="pcr"><a href="../pcr" target="_blank"><img src="../wiki/Special:Redirect/file/pcr_icon.png">公主连结</a></li>');
        menul.append('<li id="tft"><a href="../tft" target="_blank"><img src="../wiki/Special:Redirect/file/tft_icon.png">云顶之弈</a></li>');
        menul.append('<li id="soulworker"><a href="../soulworker" target="_blank"><img src="../wiki/Special:Redirect/file/soulworker_icon.png">灵魂武器</a></li>');
        menul.css("left","120px");
        menul.find("li>a>img").css({
            "width":"24px",
            "margin-right":"8px"
        });
        var menur = $("<ul class='menu'>").appendTo("body");
        menur.append('<li id="pt-userpage"><a href="./用户:'+mw.config.values.wgUserName+'" dir="auto" title="您的用户页[alt-shift-.]" accesskey=".">用户页</a></li>');
        menur.append('<li id="pt-mytalk"><a href="./用户讨论:'+mw.config.values.wgUserName+'" title="您的讨论页[alt-shift-n]" accesskey="n">用户讨论</a></li>');
        menur.append('<li id="pt-preferences"><a href="./特殊:参数设置" title="您的设置">参数设置</a></li>');
        menur.append('<li id="pt-watchlist"><a href="./特殊:监视列表" title="您正在监视更改的页面的列表[alt-shift-l]" accesskey="l">监视列表</a></li>');
        menur.append('<li id="pt-watchlist"><a href="./特殊:Moderation" title="版主审核">版主审核</a></li>');
        menur.append('<li id="pt-watchlist"><a href="./特殊:文件列表" title="文件列表">文件列表</a></li>');
        menur.append('<li id="pt-mycontris"><a href="./特殊:用户贡献/'+mw.config.values.wgUserName+'" title="您的贡献的列表[alt-shift-y]" accesskey="y">贡献</a></li>');
        menur.append('<li id="st-timeless"><a href="./特殊:特殊页面">特殊页面</a></li>');
        menur.append('<li id="st-timeless"><a href="./特殊:最近更改">最近更改</a></li>');
        menur.append('<li id="t-pagelog"><a href="./特殊:日志?page='+mw.config.values.wgPageName+'">页面日志</a></li>');
        menur.append('<li id="t-info"><a href="?action=info" title="关于此页面的更多信息">页面信息</a></li>');
        menur.append('<li id="ca-purge"><a href="index.php?title='+mw.config.values.wgPageName+'&action=purge" title="刷新[alt-shift-r]" accesskey="r">刷新</a></li>');
        menur.append('<li id="st-timeless"><a href="?useskin=timeless">Timeless样式</a></li>');
        menur.append('<li id="t-pagelog"><a href="./MediaWiki:Common.css">Common.css</a></li>');
        menur.append('<li id="t-pagelog"><a href="./MediaWiki:Common.js">Common.js</a></li>');
        menur.append('<li id="t-pagelog"><a href="./MediaWiki:Sidebar">Sidebar</a></li>');
        menur.append('<li id="t-pagelog"><a href="./MediaWiki:Sitenotice">全站公告</a></li>');
        menur.css("right","120px");
        if($(window).width()<1500){
            menul.css("display","none");
            menur.css("display","none");
        }
        $("body>.menu").css({
            "list-style":"none none",
            "background-color":"#fff",
            "position":"fixed",
            "margin":"0",
            "padding":"0",
            "border-top-width":"0",
            "box-shadow":"0 12px 24px 0 rgba(59,73,97,0.25)",
            "top":"80px",
            "width":"120px"
        });
        $("body .menu").find("a").css({
            "padding":"0.625em",
            "white-space":"nowrap",
            "color":"rgba(0,0,0,0.85)",
            "cursor":"pointer",
            "font-size":"14px",
            "height":"40px",
            "line-height":"40px",
            "min-width":"120px"
        });
        $("body .menu").find("a").hover(function(){
            $(this).css({
                "background-color":"#47e",
                "color":"rgba(255,255,255,0.85)"
            });
        },function(){
            $(this).css({
                "background-color":"#fff",
                "color":"rgba(0,0,0,0.85)"
            });
        });
        if(instr(window.location.pathname,"api.php")>0){
            $("body").css("background","url()");
        }
        if(instr(window.location.pathname,"factorio")>0){
           $("link[rel$=icon]").attr("href","//www.factorio.com/static/img/favicon.ico");
        }
        if(instr(window.location.pathname,"blhx")>0){
           $("link[rel$=icon]").attr("href","../wiki/Special:Redirect/file/碧蓝航线_icon.png");
        }
        if(instr(window.location.pathname,"fzzl")>0){
           $("link[rel$=icon]").attr("href","../wiki/Special:Redirect/file/方舟指令_icon.png");
        }
        if(instr(window.location.pathname,"alterna")>0){
           $("link[rel$=icon]").attr("href","../wiki/Special:Redirect/file/alterna_icon.png");
        }
        if(instr(window.location.pathname,"bh3")>0){
           $("link[rel$=icon]").attr("href","../wiki/Special:Redirect/file/bh3_icon.png");
        }
        if(instr(window.location.pathname,"soulworker")>0){
           $("link[rel$=icon]").attr("href","../wiki/Special:Redirect/file/soulworker_icon.png");
        }
    }else if(instr(window.location.host,"so.com")>0) {
        //
    }
})();

window.onload=function(){
    'use strict';
    if(instr(window.location.host,"avgle")>0) {
        //console.log($("#player_3x2_close"));
        //closeAd;
        //$('#player_3x2_container').hide();
        //$('#aoverlay').hide();
        //$("#player_3x2_close").click();
    }else if(instr(window.location.host,"space")>0) {
        if(instr($("title").text(),"马老师")>0) {
            $(".n-fix .n-text").css("max-width","26px");
            $(".wrapper").css({
                "cssText":"width:892px!important",
                "margin":"0"
            });
            $(".h-level.m-level").css("background-position","-21px -262px");
            $(".n .n-btn").css("margin-right","5px");
            $("#page-index .col-1").css("width","530px");
            $("#page-index .channel .content").css("width","530px");
            $("#page-index .article-content").css("width","530px");
            $("#page-index .col-1 .coin .content").css("width","530px");
            $("#page-index .col-2").css("width","310px");
            $("#page-index #i-ann-content textarea").css("width","266px");
            $("body").prepend(`<iframe __idm_frm__="142" src="//wiki.biligame.com" style="position: fixed;width:992px;height:100%;right: 0px;"></iframe>`);
        }
    }else if(instr(window.location.host,"so.com")>0) {
        //
    }
};

//setTimeout(function() {
  //xxxxxx;
//}, 100000);


/*== Function ==*/
function instr(str,s){
	var dotn=str.indexOf(s);
	if(dotn<0){return 0;}else{return (dotn+1);}
}

function mid(str,s,l){
	var outstr='';
	if(isUndefined(s)){return '';}//参数不足
	if(isUndefined(str)){return '';}//参数不足
	var sln=str.length;
	if(isNaN(s)){return '';}//参数非法
	//console.log(isNaN(s));
	s=s*1;
	if(isUndefined(l)){ //非数字isNaN
		if(s>sln ){ //起点大于长度
			return '';
		}else{
			if((s-1)>sln ){//空
				return '';
			}else{
				for(var i=s;i<sln+1;i++){ //没有长度信息，取到完
					outstr+=str.charAt(i-1);//charAt从0计字符串，故要减一
				}
				return outstr;
			}
		}
	}else{
		if(isNaN(l)){ //非数字
			if(s>sln ){ //起点大于长度
				return '';
			}else{
				if((s-1)>sln ){//空console.log(sln);
					return '';
				}else{
					for(let i=s;i<sln+1;i++){ //没有长度信息，取到完
						outstr+=str.charAt(i-1);//charAt从0计字符串，故要减一
					}
					return outstr;
				}
			}
		}else{
			l=l*1;
			if(s>sln ){ //起点大于长度
				return '';
			}else{
				if((s+l-1)>sln ){//起点加长度减1大于长度，只取剩余字符，取到完
					for(let i=s;i<sln+1;i++){
						outstr+=str.charAt(i-1);//charAt从0计字符串，故要减一
					}
					return outstr;
				}else{
					for(let i=s;i<(s+l);i++){ //正常取法console.log(sln);
						outstr+=str.charAt(i-1);//charAt从0计字符串，故要减一
					}
					return outstr;
				}
			}
		}
	}
}

function isUndefined(value){
	//获得undefined，保证它没有被重新赋值
	var undefined = void(0);
	return value === undefined;
}




