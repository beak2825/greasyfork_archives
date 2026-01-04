// ==UserScript==
// @name         Ege Üniversitesi EBYS +
// @namespace    http://bekiruzun.com
// @version      1.1.3
// @description  Re-styles EBYS
// @author       Bekir Uzun
// @match        http://ebys.ege.edu.tr/*
// @match        https://ebys.ege.edu.tr/*
// @run-at       document-start
// @icon         https://raw.githubusercontent.com/BekirUzun/EgeEBYSPlus/master/src/images/ege-logo.png
// @license      https://creativecommons.org/licenses/by-sa/4.0/
// @homepageURL  https://github.com/BekirUzun/EgeEBYSPlus
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @grant        GM.addStyle
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @downloadURL https://update.greasyfork.org/scripts/37338/Ege%20%C3%9Cniversitesi%20EBYS%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/37338/Ege%20%C3%9Cniversitesi%20EBYS%20%2B.meta.js
// ==/UserScript==

/*
*	I do not guarantee that this userscript works perfectly.
*	Because it's still in development process.
*	I am not responsible and liable for any loss or damage caused by this userscript.
*/
// @license      https://creativecommons.org/licenses/by-sa/4.0/
// @supportURL   https://github.com/BekirUzun/EgeEBYSPlus/issues
(function() {
	'use strict';

	var page = getPageName();
	var lang = getLang();

	console.log(page);
	var bgImage;

	(async () => {

		bgImage = await GM.getValue('bgImage', 'https://raw.githubusercontent.com/BekirUzun/EgeEBYSPlus/master/src/images/bg-1080p.png');

		if (page == "login")
			addStyle('body { background:  url('+ bgImage +') !important; background-size: cover !important; }');
		else if (page == "dashboard")
			addStyle('#main { background:  url('+ bgImage +') !important; background-size: cover !important; }');

	})();


	var loadingCss = '#loading { position: fixed; top: 0px; width: 100%; height: 100%; min-height: 100vh; display: initial; z-index: 99999999999999; background: #262626; }'+
		'.loading-image { width:64px; height:64px; margin: auto; position: relative; display: block; top: 45%; transform: translate(0, -50%); -moz-animation:3s rotate infinite linear; -webkit-animation:3s rotate infinite linear; } '+
		'@-moz-keyframes rotate { 0%{ -moz-transform:rotate(0deg); -moz-transform-origin:50% 50%; } 100%{ -moz-transform:rotate(360deg); } } '+
		'@-webkit-keyframes rotate { 0%{ -webkit-transform:rotate(0deg); -webkit-transform-origin:50% 50%; } 100%{ -webkit-transform:rotate(360deg); } }';

	var loginCss = 'body { color: #eee !important; }' +
		'input[type="text"], input[type="button"], input[type="password"], input[type="email"], select { transition: box-shadow .2s ease; border-radius: 3px !important; border: none !important; outline: 0 !important; line-height: 1.5em  !important; height: 2em !important; padding: 0 1em !important; background: rgba(255, 255, 255, 0.7) !important; }' +
		'input[type="text"]:focus, input[type="password"]:focus, input[type="email"]:focus { box-shadow: 0 0 10px 2px #2138b2; }'+
		'input[type="button"]:hover, select:hover, input[type="select"]:hover { background: rgba(255, 255, 255, 0.8) !important; box-shadow: 0 0 5px 1px #2138b2 !important; }'+
		'#rightTD > table {background: rgba(0,0,0,0.7); border-radius: 20px; padding: 0 2em 1em 2em; } '+
		'.cssAppBigBold { color: #eee !important; font-size: 2em !important; }'+
		'a:hover, #lblVersiyon:hover { border-bottom-color: transparent !important; color: #42a5f5 !important;  }' +
		'a, #lblVersiyon { transition: color 0.2s ease; color: #0077c2 !important; text-decoration: none  !important; font-weight: bold; }'+
		'.btn { background-image: none !important; text-shadow: none !important; transition: background-color 0.2s ease; background-color: #ed4933 !important; box-shadow: none !important; color: #ffffff !important; background-color: transparent; border-radius: 3px; border: 0; cursor: pointer; display: inline-block; font-weight: 600; height: 2.5em !important; width: auto !important; letter-spacing: 0.1em; line-height: 2.5em; padding: 0 1em; text-align: center; text-decoration: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}'+
		'.btn:hover{ background-color: #e86c5b !important; }' +
		'#lnkUnipa > span { display: table !important; padding: 10px; background: rgba(0,0,0,0.7); border-radius: 10px; text-align: center; }';

	var mainCss = '.unipaappHeader { background: #2138b2 !important; border-radius: 8px !important; border: none !important; height: auto !important; padding: 5px !important; }' +
		'#reasons { padding: 15px 0 0 0 !important; }' +
		'.shadow { border-radius: 10px !important; box-shadow: none !important;}'+
		'#small_promos { background: rgba(0,0,0,0.5) !important;  border: 3px solid rgba(0,0,0,0) !important; height: 92% !important; border-radius: 10px !important; }'+
		'.leftPanel { background: rgba(200, 255, 255, 0.6) !important; padding: 0px 4px 0px 0px !important; }'+
		'.rightPanel { margin: 0px !important; }'+
		'.rightPanelHeader { border-radius: 0px 5px 0px 0px !important; }'+
		'.searchBox, .rightPanelHeader { background: #21B262 !important; padding: 5px 5px 2px 5px !important;}'+
		'.fa_file { padding-right: 5px; }'+
		'.file { background: none !important; padding: 0px 0px 5px 5px !important; transition: color 0.2s ease;}'+
		'.file:hover { color: #2138b2 !important; }'+
		'.content{ border-radius: 10px; height: 88% !important;}'+
		'input[type="text"],  input[type="button"], input[type="password"], input[type="email"], input, select { transition: box-shadow .2s ease; background-image: none !important; border-radius: 3px !important; border: none !important; outline: 0 !important; line-height: 1.5em  !important; height: 2em !important; padding: 0 1em !important; background: rgba(255, 255, 255, 0.7) !important; }' +
		'input[type="text"]:focus, input[type="password"]:focus, input[type="email"]:focus { box-shadow: 0 0 2px 2px #2138b2; !important}'+
		'input[type="button"]:hover, select:hover, input[type="select"]:hover, input[type="submit"]:hover { background: rgba(255, 255, 255, 0.8) !important; box-shadow: 0 0 0 2px #2138b2 !important; }'+
		'#ctl00_ddlAppStyles_Input { -webkit-appearance: none; appearance: none; }'+
		'#ctl00_DashAppHeader_ctl02_lnksignout2:hover { text-decoration: none !important; }'+
		'.RadButton_Default.rbSkinnedButton { background: none !important }'+
		'#ctl00_ContentPlaceHolder1_AppHeader1_ctl08 { display: none !important }'+
		'.fa_top { float: left; padding-right: 8px; padding-top: 3px; }'+
		'#main > div > div.header > div.headTitle > table { height: 50px !important; }'+
		'.RadComboBox_Office2007 .rcbArrowCellRight { background: none !important; }'+
		'.rcbInputCell, .RadComboBox_Default .rcbArrowCellRight { background-image: none !important; width: 90% !important; }'+
		'.rcbInput { width: 90% !important; }'+
		'border: none !important; outline: 0 !important; line-height: 1.5em  !important; }'+
		'.headTitle > table{ height: 45px !important; }' +
		'.dashboardUiIcons.logo { background: none !important; }'+
		'.ui-tabs-icons { background: none !important }'+
		'.divHelp, .divSupport, .divLogin, .divAdmin { transition: color 0.2s ease; background: none !important; font-size: 14px !important; background-position: 5px 1px !important; padding: initial !important; letter-spacing: 0.05em !important; color: white;}'+
		'.divHelp a span{font-size: 14px !important; } '+
		'.divHelp:hover, .divSupport:hover, .divLogin:hover, .divAdmin:hover { color: #42a5f5 }'+
		'.divAdmin span, .divLogin a, .divSupport span, .divHelp a span, .divHelp a { padding-left: 0px !important; color: inherit !important; } '+
		'.divArrow { float: left !important; }'+
		'.headerTitle{font-size: 18px !important; }' +
		'.appHeader.ui-corner-all { -webkit-border-radius: 0px !important; border-radius: 0px !important; background: rgba(0,0,0,0.7) !important;}'+
		'.divContentPlaceHolder { top: 6.1em !important; background: rgba(220,255,255,0.7) !important; height: 100% }'+
		'.splitter { background: #1d242a !important; } '+
		'#tabs{ width: 100%; padding: 0px !important; }'+
		'.ui-widget-header { border: none !important; background: #1d242a !important; height: 3em; border-radius: 0px !important; padding: 0px !important;}'+
		'.ui-state-default { background: #1d242a !important; color: #fff !important; height: 2em !important; padding: 0.5em !important; margin: 0px !important; border-radius: 0px !important;     border: none !important;}'+
		'.ui-state-active { background: #2138b2 !important }' +
		'.ui-tabs-nav li a { color: #fff !important;}'+
		'.draggable-title { color: #fff !important; background: none !important;}'+
		'.widgetTitleCenter { height: 30px !important;  background: #1d242a !important;  border-radius: 5px 5px 0px 0px !important;}'+
		'.bottomStrip_ui{ border: none !important; background: #2138b2 !important; line-height: 28px; }'+
		'.bottomStrip { height: 28px !important; box-shadow: 0 0 10px #333;}'+
		'.appPopup { border: none !important; box-shadow: 0 0 20px 3px rgba(0,0,0,0.5); }'+
		'.appPopupTitle { background: #21B262 !important; }'+
		'.appPopupInfo { background: rgba(33,178,98,0.2) !important; }'+
		'.inner_button{padding: 0px !important; border: none !important}'+
		'td.widgetTitleLeft, td.widgetTitleRight, #divAdminDetail, #divLoginDetail, #divSupportDetail, .appheaderhelp > img, .dashboardUiIcons.divArrow, #ctl00_DashAppHeader_ctl02_divSupport > div { display: none !important}'+
		'.btn { background-color: #1d242a !important; box-shadow: none !important; color: #ffffff !important; background-color: transparent; border: 0; cursor: pointer; display: inline-block; height: 28px; line-height: 28px; padding: 0 1em; text-align: center; text-decoration: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}';

	var gradesCss = "#tblNotlar > tbody > tr:nth-child(1) > td > fieldset > table { border-collapse: collapse; table-layout: fixed; }" +
		"#tblNotlar > tbody > tr:nth-child(1) > td > fieldset > table > tbody > tr:nth-child(1) { /* background: #6688ff !important; color: white !important; */ font-weight: bold;  }" +
		"td { text-align:center; overflow:hidden; }" +
		".small { white-space: nowrap; }";

	if (page == "login"){
		$('html').append('<div id="loading"><img class="loading-image" src="https://raw.githubusercontent.com/BekirUzun/EgeEBYSPlus/master/src/images/ege-logo.png" /> </div>');
		addStyle(loadingCss);
		addStyle(loginCss);
		
	} else 	if (page == "dashboard"){
		var fontawIV = setInterval(function(){
			if($('head')){
				$('head').append('<link rel="stylesheet" href="https://opensource.keycdn.com/fontawesome/4.7.0/font-awesome.min.css" crossorigin="anonymous">');
				clearInterval(fontawIV);
			}
		}, 250);

		$('html').append('<div id="loading"><img class="loading-image" src="https://raw.githubusercontent.com/BekirUzun/EgeEBYSPlus/master/src/images/ege-logo.png" /> </div>');
		addStyle(loadingCss);
		addStyle(mainCss);
	} else if (page == "grades"){
		addStyle(gradesCss);
	}

	document.addEventListener("DOMContentLoaded", DOM_ContentReady);

	function DOM_ContentReady() {

		if (page == "login"){
			$('.cssLogo:first').html('<img id="imgLogo" title="Bilgi Sistemleri"  alt="Üni-Pa A.Ş. Bilgi Sistemleri" style="border-width:0px;" src="https://raw.githubusercontent.com/BekirUzun/EgeEBYSPlus/master/src/images/ege-logo.png" />');
			$('#btnLogin').addClass('btn');
			$('#lblVersiyon').html($('#lblVersiyon').html() + ' +');

			var options;
			if(lang == "en"){
				options = '<input type="button" id="change-bg" value="Change Background" style="margin-right: 5px;" /><select id="lang" style="margin-right: 10px;"><option value="en-US">English</option><option value="tr-TR">Türkçe</option></select>';
			} else {
				options = '<input type="button" id="change-bg" value="Arkaplanı Değiştir"  style="margin-right: 5px;" /><select id="lang" style="margin-right: 10px;"><option value="tr-TR">Türkçe</option><option value="en-US">English</option></select>';
			}
			$('#form1 > table > tbody > tr:nth-child(2)').html('<td align="right">'+ options +'</td>');
			$('#lang').html('<option selected>Language</option>' + $('#lang').html());

			document.getElementById("lang").addEventListener("change", function(){
				changeLang(this.value);
			});
			document.getElementById("change-bg").addEventListener("click", function(){
				changeBg();
			});

		} else if (page == "dashboard"){
			$('.dashboardUiIcons.logo').html('<img id="ctl00_imgMusteriLogo" src="https://raw.githubusercontent.com/BekirUzun/EgeEBYSPlus/master/src/images/ege-logo.png" style="height:60px;width:60px;border-width:0px;">');
			$('#ctl00_lblVersiyon').html($('#ctl00_lblVersiyon').html() + ' +');
			$('.inner_button').html('<a class="btn" id="inner_btn">'+ $(".inner_button").html() +'</a>');
			$('.ui-tabs-icons.ui-tabs-icon1').addClass('fa fa-lg fa-home');
			$('.ui-tabs-icons.ui-tabs-icon2').addClass('fa fa-lg fa-question-circle-o');
			$('.ui-tabs-icons.imgMessages').addClass('fa fa-lg fa-envelope-o');

			$('#divAdmin').prepend('<i class="fa fa_top fa-graduation-cap " aria-hidden="true"></i>').click(function() {
				window.location.href = 'https://ebys.ege.edu.tr/UniFrame/profil/default.aspx';
			});

			$('#divLogin').prepend('<i class="fa fa_top fa-power-off" aria-hidden="true"></i>').click(function() {
				window.location.href = 'https://ebys.ege.edu.tr/login.aspx';
			});

			$('.divSupport').click(function() {
				__doPostBack('ctl00$DashAppHeader$ctl02$lnkSupport','');
			});
			$('#ctl00_DashAppHeader_ctl02_divSupport').prepend('<i class="fa fa_top fa-info-circle" aria-hidden="true"></i>');
			$('#ctl00_DashAppHeader_ctl02_lblTabHelp').prepend('<i class="fa fa_top fa-question-circle-o" aria-hidden="true"></i>');
			$('.file').prepend('<i class="fa fa-lg fa_file fa-folder" aria-hidden="true"></i>');

			$('.inner_btn').off("click");
			$('.inner_btn').click(function() {
				btnClick($(this));
			});

			$('.searchBoxInput').contents().unwrap();
			$('#ctl00_ddlAppStyles_Input').val('Unipa Modern');
			$('#ctl00_ddlAppStyles_DropDown > div > ul > li').html('Unipa Modern');
			//$('#ctl00_ddlDiller').html('<select id="lang"><option>Language</option><option value="tr-TR">Türkçe</option><option value="en-US">English</option></select>');
			$('.appheaderhelp').prepend('<i class="fa fa-info-circle" style="margin: 0px 5px 0px 5px;" aria-hidden="true"></i>');
			$('.draggable-title').prepend('<i class="fa fa-lg fa-file-text-o" style="padding-right: 5px;" aria-hidden="true"></i> ');
			$('td.widgetTitleLeft, td.widgetTitleRight, #divAdminDetail, #divLoginDetail, #divSupportDetail, .appheaderhelp > img, .dashboardUiIcons.divArrow, #ctl00_DashAppHeader_ctl02_divSupport > div').remove();

		} else if (page == "grades"){

			var hideList = [0, 2, 3, 4]; // this columns will be hidden at start
			var deleteList = [6]; // this column will be deleted
			var newWidths = { 7:120 }; // colunm number: new width in px

			/*
			var columns = findColumns(7);
			for(var i = 0; i< columns.length; i++){
				$(columns[i]).width(120);
			}
			*/

			$('#tblNotlar > tbody > tr:nth-child(1) > td > fieldset > table > tbody > tr:nth-child(1) > td').click(function(){
				var targetIndex = $(this).index();
				//toggleWidth(this);
				$('#tblNotlar > tbody > tr:nth-child(1) > td > fieldset').each(function(){
					var element1 = $(this);
					element1.children("table").each(function(){
						var element2 = $(this);
						element2.children('tbody').each(function(){
							var element3 = $(this);
							element3.children('tr:nth-child(1)').children('td').each(function(index){
								var element4 = $(this);
								if ( targetIndex == index ) {
									toggleWidth(element4);
								}
							});
						});
					});
				});
			});

			$('#tblNotlar > tbody > tr:nth-child(1) > td > fieldset').each(function(){
				/*var isFirstHeader = true;*/
				var element1 = $(this);
				element1.children("table").each(function(){
					//$('#tblNotlar > tbody > tr:nth-child(1) > td > fieldset > table > tbody > tr:nth-child(1) > td').each(function(index, element3){
					var element2 = $(this);
					element2.children('tbody').each(function(){
						var element3 = $(this);

						/*if(!isFirstHeader){
							element3.children('tr:nth-child(1)').hide();
						} */

						element3.children('tr:nth-child(1)').children('td').each(function(index){
							var element4 = $(this);
							if ( hideList.indexOf(index) >= 0 ) {
								toggleWidth(element4);
							} else if (deleteList.indexOf(index) >= 0) {
								element4.parents().eq(1).children().eq(1).children().eq(index).hide();
								element4.hide();
							}

							if (index == 7 || index == 10){
								//change column name to vize or final
								var str = element4.children('span').html();
								var percentage = str.substring(str.indexOf("(")); //extract percentage
								var newColumnName;
								if(index == 7)
									newColumnName = "Vize ";
								else
									newColumnName = "Final ";

								element4.children('span').html(newColumnName + percentage);
							}

							if (newWidths[index] !== undefined) {
							   element4.width( newWidths[index] ); //set new size of column if we set it in newWidth object
							}
						});
					});

				});
			});
		}

		//delay for screen load
		setTimeout( function() {
			$('#loading').fadeOut();
		}, 750);
	}

	function getPageName(){
		var l = window.location.href;

		if (l.includes("login"))
			return 'login';
		
		else if (l.includes("dashboard") || l == "http://ebys.ege.edu.tr/" 
				|| l == "https://ebys.ege.edu.tr/" || l.includes("yardim") 
				|| l.includes("Messaging"))
			return 'dashboard';

		else if (l.includes("Ogr0201"))
			return 'grades';
		else 
			return 'unknown';
	}

	function getLang() {
		var l = window.location.href;
		if (l.includes("en-US"))
			return 'en';
		else
			return 'tr';
	}

	function btnClick(button) {
		$("#appPopup_wrapper").toggle();
	}

	function changeLang(language) {
		window.location.href = 'https://ebys.ege.edu.tr/login.aspx?lang=' + language;
	}

	function changeBg() {
		var imgLink;

		if(lang == "en")
			imgLink = prompt("Enter a background image link: ", bgImage);
		else
			imgLink = prompt("Bir arkaplan resmi linkini giriniz: ", bgImage);
		if(imgLink !== null){
			GM.setValue("bgImage", imgLink);
			location.reload();
		}
	}

	function findColumns(target_index) {
		var columns = {length: 0};
		$('#tblNotlar > tbody > tr:nth-child(1) > td > fieldset').each(function(){
			var element1 = $(this);
			element1.children("table").each(function(){
				//$('#tblNotlar > tbody > tr:nth-child(1) > td > fieldset > table > tbody > tr:nth-child(1) > td').each(function(index, element3){
				var element2 = $(this);
				element2.children('tbody').each(function(){
					var element3 = $(this);
					element3.children('tr:nth-child(1)').children('td').each(function(index){
						var element4 = $(this);
						if ( target_index == index ) {
							columns[columns.length++] =  element4;
						}

					});
				});
			});
		});
		return columns;
	}

	function toggleWidth(prop){
		if($(prop).data("small")){

			$(prop).width( $(prop).data("old_width") )
				.html(  $(prop).data("old_html") )
				.data("small", false);

		} else {
			$(prop).data("old_width", $(prop).width());
			$(prop).data("old_html", $(prop).html());
			$(prop).width("25px")
				.html(" + ")
				.data("small", true);
		}
		var index = $(prop).index();
		$(prop).parents().eq(1).children().eq(1).children().eq(index).toggleClass("small");
	}

	function addStyle(css){
		var node = document.createElement("style");
		node.type = "text/css";
		node.appendChild(document.createTextNode(css));
		var head = document.getElementsByTagName("head");
		if (head.length > 0) {
			head[0].appendChild(node);
		} else {
			document.documentElement.appendChild(node);
		}
	}
})();
