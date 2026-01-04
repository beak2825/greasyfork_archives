// ==UserScript==
// @name         Steam Add Free License
// @namespace    http://tampermonkey.net/
// @version     1.05
// @description  Add Free License
// @author       UndCover
// @match        https://store.steampowered.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390407/Steam%20Add%20Free%20License.user.js
// @updateURL https://update.greasyfork.org/scripts/390407/Steam%20Add%20Free%20License.meta.js
// ==/UserScript==

(function() {
    'use strict';
	jQuery("#global_action_menu").append('<a id="btn_add_free" href="#"class="btnv6_blue_hoverfade btn_medium"><span>喜加一</span></a>');
	jQuery("#global_action_menu").append('<a id="btn_search_sub" style="margin-left:5px;" href="#"class="btnv6_blue_hoverfade btn_medium"><span>查询SUB</span></a>');

	var dialog = jQuery('<div id="dlg_undcover" class="newmodal"style="position: fixed; z-index: 1000; max-width: 1503px; left: 541px; top: 277px;display: none;"><div class="modal_top_bar"></div><div class="newmodal_header_border"><div class="newmodal_header"><div id="btn_undcover_close" class="newmodal_close"></div><div class="title_text">喜加一激活框</div></div></div><div class="newmodal_content_border"><div class="newmodal_content"style="max-height: 631px;"><div style="float: left;width: 100%;"><input name="product_key"id="input_undcover"type="text"value=""placeholder="输入产品代码，在 Steam 上激活您的产品"></div><div class="newmodal_buttons"><div class="button_row"><a tabindex="300"href="#"class="btnv6_blue_hoverfade btn_medium"id="btn_undcover_confirm"><span>确认</span></a></div></div></div></div></div>');
	jQuery("body").append(dialog);
	jQuery("#input_undcover").css({
		"background-color": "rgba( 0, 0, 0, 0.4)",
		"color": "#fff",
		"border": "1px solid #000",
		"border-radius": "3px",
		"box-shadow": "1px 1px 0px #45556c",
		"width": "100%",
		"padding": "5px",
		"margin-top": "3px",
		"font-size": "16px",
		"line-height": "21px"
	});
	jQuery('#btn_search_sub').click(function(){
		var appId = jQuery(".glance_tags").attr("data-appid")
		var subLink = ""
		if(appId != undefined)
		{
			subLink = "https://steamdb.info/app/"+appId+"/subs/";
			window.open(subLink);  
		}
	});
	jQuery("#btn_add_free").click(function() {
		jQuery("#dlg_undcover").show();
	});
	jQuery("#btn_undcover_close").click(function(){
		jQuery("#dlg_undcover").hide();
	});

	// var dlgSuccess = jQuery('<div id="dlg_undcover_success"class="newmodal"style="position: fixed; z-index: 2000; top:100px;left:100px;display:none;"><div class="modal_top_bar"></div><div class="newmodal_header_border"><div class="newmodal_header"><div id="btn_undcover_close2"class="newmodal_close"></div></div></div><div class="newmodal_content_border"><div id="div_undcover_success"class="newmodal_content"><div id="receipt_area"class="leftcol"><div class="cart_area_body checkout_content_box free_game"><div class="checkout_tab checkout_content"><h2>成功！</h2><div class="add_free_content_success_area"><p>Ring of Elysium已被绑定至您的Steam帐户。</p><p>要访问新内容，只需在Steam库中启动此产品即可。</p></div><div class="rule"></div><div class="checkout_gotsteam_area"><h1>没有Steam？</h1><p>您需要Steam应用程序来访问您的新产品。</p><div id="gotsteam_buttons"><a href="steam://subscriptioninstall/222829"class="btn_blue leftbtn"><h3>是的，我已安装Steam</h3><h5>马上安装您的新游戏</h5></a><a href="https://media.st.dl.bscstorage.net/client/installer/SteamSetup.exe"class="btn_blue"><h3>没有，我还没安装Steam</h3><h5>免费下载</h5></a><div style="clear: left;"></div></div></div></div></div></div></div></div></div>');
	var dlgSuccess = jQuery('<div id="dlg_undcover_success"class="newmodal"style="position: fixed; z-index: 2000; top:100px;left:100px;display:none;"><div class="modal_top_bar"></div><div class="newmodal_header_border"><div class="newmodal_header"><div id="btn_undcover_close2"class="newmodal_close"></div></div></div><div class="newmodal_content_border"><div id="div_undcover_success"class="newmodal_content"></div></div></div>');

	jQuery("body").append(dlgSuccess);

	jQuery("#btn_undcover_close2").click(function(){
		jQuery("#dlg_undcover_success").hide();
	});

	var originSubId = jQuery("[name='subid']").val()
	//if(originSubId === undefined)
	//    originSubId = jQuery("[name='subid[]']").val();
	jQuery("#input_undcover").val(originSubId)

	jQuery("#btn_undcover_confirm").click(function(){
		var userAvatar = jQuery(".user_avatar");
		if(userAvatar.length > 0){
			var _subId = jQuery("#input_undcover").val();
			if(_subId != null && _subId.length > 0 ){
				jQuery.post(
					'//store.steampowered.com/checkout/addfreelicense',
					{
						action: 'add_to_cart',
						sessionid: g_sessionID,
						subid:_subId
					},
					function(data,status){
                        jQuery("#dlg_undcover_success").show();
                        jQuery("#div_undcover_success").html(data);
					}
				)
			}
		}else{
			alert("未登录");
		}
	});
})();