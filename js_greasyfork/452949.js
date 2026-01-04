// ==UserScript==
// @name			Carousell fliter
// @namespace		see7di@gmail.com
// @description		用來按照您設定的關鍵字過濾隱藏掉旋轉拍賣商品列表内的特定商品
// @version			3.8
// @icon			https://hr4.com/careers/driveautogroup/images/path-parts.png
// @author			see7di@gmail.com
// @match			*://tw.carousell.com/*
// @match			*://tw.carousell.com/search/*
// @exclude			*://tw.carousell.com/p/*
// @exclude			*://tw.carousell.com/login/*
// @exclude			*://tw.carousell.com/inbox/*
// @exclude			*://tw.carousell.com/settings/*
// @exclude			*://*.exclude.com/live_chat*
// @grant			GM_getValue
// @grant			GM_setValue
// @require			https://code.jquery.com/jquery-2.2.4.min.js
// @supportURL		https://www.youtube.com/channel/UCFSN_dR_z4uJz2E8mByRERA
// @homepage		http://7di.net
// @grant			GM_xmlhttpRequest
// @connect			*
// @run-at			document-end
// @downloadURL https://update.greasyfork.org/scripts/452949/Carousell%20fliter.user.js
// @updateURL https://update.greasyfork.org/scripts/452949/Carousell%20fliter.meta.js
// ==/UserScript==

//https://www.youtube.com/user/see7di/playlists?view=1
//https://tw.carousell.com/search/?addRecent=false&canChangeKeyword=false&includeSuggestions=false&price_end=222&price_start=1&sc=0a0208301a0408bce9652a210a05707269636522160a0909000000000000f03f1209090000000000c06b4078012a140a0b636f6c6c656374696f6e7312030a013078012a210a05707269636522160a0909000000000000f03f1209090000000000c06b4078013204080378013a02180742060801100118004a0620012801400150005a020801&searchId=wkcMW7&searchType=all&sort_by=3
(function() {
	"use strict";
	var cfg={
		n1:0,
		n2:0,
		n3:0,
        _ad:"",
		loop:9,
		debug:false,
	};

	console.clear();
	window.setTimeout(function(){ //no loop
		console.clear();
		$("div").each(function(i){
			//x++;
			$(this).addClass("_"+i);
		});
		//alert("ok")
		$("._6,._637,._658,._674,footer").css({"display":"none"});
	},3000);

	window.setTimeout(function(){ //列表 no loop
		$("body").prepend("<div id='carousell_box' style='right:4px;bottom:1px;width:180px;color:white;font-size:12px;background-color:#2c2c2d;font:caption;padding:5px;border-radius:5px;box-shadow:2px 2px 4px #fff;z-index:9999;position:fixed'><div><input type='button' value='點擊此處開始過濾' id='carousell_btn' style='background-color:#ff2636;font-weight:bold;font-size:16px;border-radius:3px;border:1px solid #000;cursor:pointer;'><span id='carousell_ico' style='cursor:pointer;padding-left:7px'>▼</span><p id='carousell_memo' style='margin:9px 0;font-size:12px;'>Carousell fliter!</p><div id='carousell_setting' style='display:none'><textarea id='carousell_keys' placeholder='要過濾的關鍵詞,用|分隔' style='height:400px;width:100%;background-color:#eee;padding:0;border:1px solid #ddd'></textarea><!----></div></div></div>"); //<input type='text' id='carousell_user' value='' style='width:100%;letter-spacing:1px;background-color:#eee;padding:0;border:1px solid #ddd'>

		$("#carousell_btn").bind("click",function(){
			//console.clear();
			//$("header",$("#root")).remove();
			//$("#main > div > div").find("h1").remove();
			//$("#main > div > div").find("ul").remove();
			//$("#main > div > div > section:first > div:last").remove();
			//$("#carousell_btn").prop("disabled",true);

			$('button:contains("顯示更多結果")').click();
			//$('button:contains("瀏覽更多")').click();

			window.setTimeout(function(){ //no loop
				guoLv();
			},2000);
		});
		$("#carousell_ico").bind("click",function(){
			doSetting()
		});
		$("#carousell_keys").bind("blur",function(){
			saveKeys();
		});
		//$("#carousell_user").bind("blur",function(){
		//	saveUser();
		//});

		var str_list=$.trim(GM_getValue("black_keys_list")).toLowerCase();
		if(str_list==''){
			str_list='褲|帽|襪|裙|袖|恤|衫|鞋|恤|髮|童裝|足膜|長洋|大衣|上衣|香水|和服|男裝|女裝|短褲|秋裝|蜜粉|卸妝';
			GM_setValue("black_keys_list",str_list);
		}
		$("#carousell_keys").val(str_list);
		if(cfg.debug==true){
			console.log("black_keys_list:"+str_list);
		}
		str_list='';

		//str_list=$.trim(GM_getValue("black_user_list")).toLowerCase();
		//if(str_list==''){
		//	str_list='vincent31|doli8|go_89|yoya1985';
		//	GM_setValue("black_user_list",str_list);
		//}
		//$("#carousell_user").val(str_list);
		//if(cfg.debug==true){
		//	console.log("black_user_list:"+str_list);
		//}
		str_list=null;

		//window.setTimeout(function(){ //no loop
			//$('a[aria-label]').parent().parent().parent().parent().remove();
			//$("#root").find("div:first").attr("style","margin-top:0");
		//	if(isPc()==false){
		//		cfg.loop=1; //手機版若一次連續多頁多次會導致n3計數器錯誤
		//		$("#carousell_box").css({"top":"10px","bottom":""});
		//	}
		//	$('button:contains("Show more results")').click();

			//remove ad
		//	$("#main div:first").remove();
		//	$('div[id^="native-ad"]').remove();
		//	console.clear();
		//},1000);
	},2000);

	var guoLv=function(){ //Fliter
		cfg.n1++;
		var arr_list=getArray($.trim($("#carousell_keys").val()).toLowerCase());
		//alert(isPc())

		if(cfg.debug==true){
			//console.log("arr_list:"+arr_list);
			//$("div[data-testid]").attr("style","border:3px solid red;")
			//$("div[data-testid]").find("div:first").find("a:nth-of-type(2)").attr("style","border:3px solid red;")
			//$("#main div[data-testid]").find("div:first > a > p:nth-child(2)").attr("style","border:3px solid red;")
			//$("div[data-testid]").find("div:first").find("p:nth-of-type(1)").attr("style","border:3px solid red;")
			//$('div > a:eq(2)',$("div[data-testid]")).attr("style","border:3px solid orange;")
		}
		if(isPc()==true){
			var arrlist=$('p[style^="--max"]',$("div[data-testid]"));
		}else{
			var arrlist=$("#main div[data-testid]").find("div:first > a > p:nth-child(2)");
		}
		//arrlist=arrlist.attr({"style":"--max-line:2;text-transform:lowercase;"});
		//console.log(arrlist)
        cfg._ad="";
		arrlist.each(function(i){
			cfg.n2++;

            cfg._ad=$(this).parent().find("div").find("div").html();
			var title=$.trim($(this).text()).toLowerCase();
            if(cfg._ad.length>0){
            }
            if(cfg._ad.length > 0){
                if(cfg.debug==true){
                    console.log(title,cfg._ad.attr("class"),cfg._ad.length);
                }
                cfg.n3++;

                var obj1=$(this).parent().parent().parent().parent();
                jQuery('*',obj1).add([obj1]).each(function(){
                    jQuery.event.remove(this);jQuery.removeData(this)
                });
                obj1.innerHTML='';
                obj1.remove();

                $(this).attr("style","");
            }
			if(cfg.debug==true){
				console.log("title:"+title);
			}
			var in_user_list=false;

			/*
			var user=$.trim($(this).parent().parent().parent().find('p[data-testid]').text()).toLowerCase();
			var arr_name=getArray($.trim($("#carousell_user").val()).toLowerCase());
			for(var x in arr_name){
				if(user==arr_name[x].toLowerCase()){
					if(cfg.debug==true){
						$(this).parent().parent().parent().find('p[data-testid]').attr("style","border:3px solid orange");
					}
					cfg.n3++;
					in_user_list=true;
					//$(this).parent().parent().parent().parent().remove();

					$(this).parent().parent().parent().parent().css({"display":"none"});
					break;
				}
			}user=arr_name=null;
			*/

			if(in_user_list==false){
				for(var y in arr_list){
					//console.log("title:"+title+" | arr_list[y]:"+arr_list[y])
					if(title.indexOf(arr_list[y])!=-1){
						//$(this).parent().parent().parent().attr("style","border:3px solid blue");
						cfg.n3++;

						var obj1=$(this).parent().parent().parent().parent();
						jQuery('*',obj1).add([obj1]).each(function(){
							jQuery.event.remove(this);jQuery.removeData(this)
						});
						obj1.innerHTML='';
						obj1.remove();

						$(this).attr("style","");
						//$(this).parent().parent().parent().find('p[data-testid]').attr("style","border:3px solid orange");
						//$(this).parent().parent().parent().parent().css({"display":"none"});
						break;
					}
				}
			}title=in_user_list=null;
		});
		arr_list=arrlist=null;
		//$("#carousell_memo").html("第"+cfg.n1+"次過濾,共找到"+cfg.n2+"個商品<br>其中"+cfg.n3+"個已被過濾掉!");
		//$("#carousell_btn").prop("disabled",false);

		if(cfg.n1 % cfg.loop == 0){
			//$("#carousell_btn").prop("disabled",false);
			$("#carousell_box").css({"display":""});
		}else{
			$("#carousell_box").css({"display":"none"});
			window.setTimeout(function(){ //no loop
				$('button:contains("顯示更多結果")').click();
				$('button:contains("瀏覽更多")').click();
				window.setTimeout(function(){
					guoLv();
				},2000);
			},1000);
		}
	}

	var doSetting=function(){
		if($("#carousell_ico").text()=="▼"){
			$("#carousell_ico").text("▲");
			$("#carousell_setting").css({"display":""});
		}else{
			$("#carousell_ico").text("▼");
			$("#carousell_setting").css({"display":"none"});
		}
	}

	var saveKeys=function(){ //Save the keywords
		var str_list=$.trim($("#carousell_keys").val().toLowerCase());
		GM_setValue("black_keys_list",str_list);
		str_list=null;

		$("#carousell_ico").text("▼");
		$("#carousell_setting").css({"display":"none"});
	}

	var saveUser=function(){ //Save user list
		var str_list=$.trim($("#carousell_user").val().toLowerCase());
		GM_setValue("black_user_list",str_list);
		str_list=null;

		$("#carousell_ico").text("▼");
		$("#carousell_setting").css({"display":"none"});
	}

	var isPc=function (){ //pc返回true
		var userAgentInfo=navigator.userAgent;
		var Agents =new Array("Android","iPhone","SymbianOS","Windows Phone","iPad","iPod");
		var flag=true;
		for(var v=0;v<Agents.length;v++) {
			if(userAgentInfo.indexOf(Agents[v])>0) {
				flag=false;
				break;
			}
		}
		return flag;
	}

	var getArray=function(string){ //Get array from string
		if (!string) return [];
		return string.split("|").map(v => v.trim()).filter(v => v.length);
	}
})();
