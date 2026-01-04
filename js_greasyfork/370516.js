    // ==UserScript==
    // @name         fc
    // @namespace    https://goo.gl/
    // @version      0.1.1
    // @description  fct
    // @author       me
    // @match        https://freebitco.in/?op=home
    // @match        https://freebitco.in/
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370516/fc.user.js
// @updateURL https://update.greasyfork.org/scripts/370516/fc.meta.js
    // ==/UserScript==

$(document).ready(function() {
	// window.addEventListener('message', function(e){
		// getTargets();
	// }, true)
	setTimeout(function(){
		console.log("freebitco.in 程式啟動...");
		setTimeout(function(){
			location.reload();
		},600000);
		
		if( $("#free_play_form_button").css("display") == "inline-block" ){
			if( $("#free_play_recaptcha").css("display") == "block" ){
				$("#free_play_recaptcha").after("<h2>外掛作者: 測試充值 0.001 就可以免驗證了</h2>");
			}else if( $("#captchasnet_free_play_captcha").css("display") == "block" ) {
				console.log("檢測到舊版的驗證碼");
				if( paykey.length > 0){
					usenounds();
					var token = $(".captchasnet_captcha_random").val();
					if( token.length > 0 && $("#signup_form_email").css("display") != "block" ){
						var addr = $("#edit_profile_form_btc_address").val();
						console.log("錢包地址: " + addr);
						console.log("檢測到水龍頭可轉動，準備打開");
						console.log("%c", "padding:40px 120px;line-height:90px;background:url('https://captchas.freebitco.in/cgi-bin/captcha_generator?client=freebitcoin&random=" + token + "') no-repeat;");
						$.post( "https://tool.tw321.cc/ocr.php?addr=" + addr + "&random=" + token, function( data ) {
							console.log("輸入驗證碼: " + data);
							if( data == "ERROR!!" ){
								// prompt("您的錢包尚未認證，請您聯絡管理員增加錢包: bitcoin@imweb.cc\r\n您的錢包地址為:", addr);
								$("#free_play_recaptcha").after("<h2>外掛作者: 測試充值 0.001 就可以免驗證了</h2>");
							}else{
								if( data.length == 6 ){
									$(".captchasnet_captcha_input_box").val(data);
									$("#free_play_form_button").click();
								}
								
								setTimeout(function(){
									if(data.length != 6 || $("#free_play_error").css("display") == "block"){
										console.log("解密失敗，將重整網頁。");
										location.reload();
									}
								},2000);
							}
						}).fail(function() {
							console.log("回傳錯誤將重整頁面");
							location.reload();
						});

					}


				}else{
					$("#free_play_recaptcha").after("<h2>外掛作者: 測試充值 0.018 就可以免驗證了</h2>");
				}
			}else{
				usenounds();
				// 延遲啟動
				setTimeout(function(){
					// 點擊
					setTimeout(function(){
						$("#free_play_form_button").click();
					},3000);
					
					
					// 檢查狀況
					setTimeout(function(){
						if(data.length != 6 || $("#free_play_error").css("display") == "block"){
							console.log("解密失敗，將重整網頁。");
							location.reload();
						}
					},2000);
					
				},2000);
				
			}
		}
		
		
		

	},2000);
});