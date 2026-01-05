// ==UserScript==
// @name        AutoPagerize_Console_simple
// @namespace   phodra
// @description AutoPagerizeをサポートするボタン（シンプルバージョン）
// @include     http://*
// @include     https://*
// @version     4.03
// @noframes
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_getResourceURL
// @grant       GM_getResourceText
// @resource    res_style http://phodra.web.fc2.com/script/AutoPagerize_Console/css_simple403.css
// @downloadURL https://update.greasyfork.org/scripts/18933/AutoPagerize_Console_simple.user.js
// @updateURL https://update.greasyfork.org/scripts/18933/AutoPagerize_Console_simple.meta.js
// ==/UserScript==

(function (){
	// APが有効なページであるのか
	//  0:無効なページ 1: 2:
	const res_apState = {
		inhibit: 0,
		valid_addon: 1,
		valid_script: 2
	};
	var apState = res_apState.inhibit;
	const res_apValid = {
		enable: 'enable',
		disable: 'disable',
		_N: 'ap_valid'
	};
	var apValid;
	
	const res_dsptim = {
		always: "always",
		valid: "valid",
		loaded: "loaded",
		_N: "dsptim"
	};
	var dspTim;
	const res_posBasis = 'posBasis';
	var posBasis;
	const res_unit = {
		pxl: 'px',
		pct: '%',
		_N: 'posUnit'
	};
	var unit;
	const res_transUnhover = 'transUnhover';
	var transUnhover;

	const res_posDst = {
		_OPT: 'posDst_opt',
		_SCR: 'posDst_scr',
		_TBL: 'posDst_tbl'
	};
	var posDst = {};
	/// 配置形状
	const res_posFrm = {
		_OPT: 'posFrm_opt',
		up: 'up',
		down: 'down',
		left: 'left',
		right:'right',
		
		_IOP: 'posFrm_iop',
		noset: 'noset',
		
		_SCR: 'posFrm_scr',
		slim: 'Slim',
		square: 'Square',
		
		_TBL: 'posFrm_tbl',
		pile: 'Pile',
		row: 'Row'
	};
	var posFrm = {};
	/// 自動非表示
	const res_posHid = {
		_OPT: 'posHid_opt',
		_SCR: 'posHid_scr',
		_TBL: 'posHid_tbl'
	};
	var posHid = {};


	// スタイル追加
	var apcStyle = GM_addStyle(GM_getResourceText("res_style"));





	// コントロール配置
	/// パネル（最親）
	var $pnl = document.createElement("div");
	$pnl.id = "apc-pnl";
	document.body.appendChild($pnl);
	const APC_BTN = "apc-button";

	///pnl/ オプショナー
	var $p_opt = document.createElement("div");
	$p_opt.id = "apc-p_opt";
	$pnl.appendChild($p_opt);

	///pnl/opt/ トグルボタン (enable/disable)
	var $po_tgl = document.createElement("div");
	$po_tgl.id = "apc-po_tgl";
	$po_tgl.className = APC_BTN;
	$p_opt.appendChild($po_tgl);
	///pnl/opt// トグルボタン 画像
	var $po_tglImg = document.createElement("img");
	$po_tgl.appendChild($po_tglImg);

	///pnl/opt// コンフィグボタン
	var $po_cfg = document.createElement("div");
	$po_cfg.id = "apc-po_cfg";
	$po_cfg.className = APC_BTN;
	$po_cfg.title = "Open Config";
	$p_opt.appendChild($po_cfg);
	var $po_cfgImg = document.createElement("img");
	$po_cfgImg.setAttribute('alt', "c");
	$po_cfg.appendChild($po_cfgImg);



	///pnl/ スクローラー
	var $p_scr = document.createElement("div");
	$p_scr.id = "apc-p_scr";
	$pnl.appendChild($p_scr);
	
	///pnl/scr/ 最上部へ移動
	var $ps_top = document.createElement("div");
	$ps_top.className = APC_BTN;
	$ps_top.id = "apc-ps_top";
	$ps_top.title = "Move to Top";
	$p_scr.appendChild($ps_top);
	var $ps_topImg = document.createElement("span");
	$ps_topImg.textContent = "|<";
	$ps_top.appendChild($ps_topImg);
	
	///pnl/scr/ 最下部へ移動
	var $ps_btm = document.createElement("div");
	$ps_btm.id = "apc-ps_btm";
	$ps_btm.className = APC_BTN;
	$ps_btm.title = "Move to Bottom";
	$p_scr.appendChild($ps_btm);
	var $ps_btmImg = document.createElement("img");
	$ps_btmImg.textContent = ">|";
	$ps_btm.appendChild($ps_btmImg);
	
	///pnl/scr/ 前のページ
	var $ps_prv = document.createElement("div");
	$ps_prv.className = APC_BTN;
	$ps_prv.id = "apc-ps_prv";
	$ps_prv.title = "Move to Previous";
	$p_scr.appendChild($ps_prv);
	var $ps_prvImg = document.createElement("img");
	$ps_prvImg.textContent = "<";
	$ps_prv.appendChild($ps_prvImg);
	
	///pnl/scr/ 次のページ
	var $ps_nxt = document.createElement("div");
	$ps_nxt.className = APC_BTN;
	$ps_nxt.id = "apc-ps_nxt";
	$ps_nxt.title = "Move to Next";
	$p_scr.appendChild($ps_nxt);
	var $ps_nxtImg = document.createElement("img");
	$ps_nxtImg.textContent = ">";
	$ps_nxt.appendChild($ps_nxtImg);



	///pnl/ ページテーブル
	var $p_tbl = document.createElement("div");
	$p_tbl.id = "apc-p_tbl";
	
	///pnl/tbl/ ページ数表示(summary)
	var $pt_smy = document.createElement("div");
	$pt_smy.id = "apc-pt_smy";
	var $pt_smyNow = document.createElement("span");
	var $pt_smyMax = document.createElement("span");
	var $pt_smyVnc = document.createElement("span");
	$pt_smyNow.textContent = $pt_smyMax.textContent = "1";
	$pt_smyVnc.id = "apc-pt_smyVnc";
	$pt_smy.appendChild($pt_smyNow);
	$pt_smy.appendChild($pt_smyVnc);
	$pt_smy.appendChild($pt_smyMax);
	$p_tbl.appendChild($pt_smy);
	$pnl.appendChild($p_tbl);

	///pnl/tbl/ ページリスト
	var $pt_lst = document.createElement("ol");
	$pt_lst.id = "apc-pt_lst";
	$pt_lst.style.display = 'none';
	$p_tbl.appendChild($pt_lst);
	///pnl/tbl/ ページリストアイテム（のもと）
	var $pt_lstItem = document.createElement("li");
	$pt_lstItem.className = "apc-pt_lstItem";
	$pt_lst.appendChild($pt_lstItem);

//	for( var i = 2; i<=10; i++ )
//	{
//		var $new_pageitem = $pt_lstItem.cloneNode(true);
//		PageItem_AddEvent($new_pageitem, "x" + i);
//		$pt_lst.appendChild($new_pageitem);
//	}





	///pnl/ コンフィグメニュー包含レイヤー
	var $p_menuOuter = document.createElement("div");
	$p_menuOuter.id = "apc-p_menuOuter";
	$p_menuOuter.style.display = 'none';
	document.body.appendChild($p_menuOuter);

	///pnl/ コンフィグメニュー
	var $p_menu = document.createElement("div");
	$p_menu.id = "apc-p_menu";
	$p_menuOuter.appendChild($p_menu);

	///pnl/menu/ 表示タイミング(Display Timing)
	var $pm_dsp = document.createElement("h4");
	$pm_dsp.textContent = "Display Timing";
	$pm_dsp.title = "表示するタイミング";
	$p_menu.appendChild($pm_dsp);
	///pnl/menu/timing/ 常に表示
	var $pmd_alwLbl = document.createElement("label");
	$pmd_alwLbl.className = "apc-pm_item";
	$pmd_alwLbl.for = "apc-pmd_alw";
	$pmd_alwLbl.title = "常に表示";
	$p_menu.appendChild($pmd_alwLbl);
	var $pmd_alw = document.createElement("input");
	$pmd_alw.type = 'radio';
	$pmd_alw.name = res_dsptim._N;
	$pmd_alw.id = "apc-pmd_alw";
	$pmd_alwLbl.appendChild($pmd_alw);
	$pmd_alwLbl.appendChild( document.createTextNode("always"));
	///pnl/menu/timing/ 二ページ目をロードした時に表示
	var $pmd_lodLbl = document.createElement("label");
	$pmd_lodLbl.className = "apc-pm_item";
	$pmd_lodLbl.for = "apc-pmd_lod";
	$pmd_lodLbl.title = "二ページ目をロードした時に表示";
	$p_menu.appendChild($pmd_lodLbl);
	var $pmd_lod = document.createElement("input");
	$pmd_lod.type = 'radio';
	$pmd_lod.name = res_dsptim._N;
	$pmd_lod.id = "apc-pmd_lod";
	$pmd_lodLbl.appendChild($pmd_lod);
	$pmd_lodLbl.appendChild(document.createTextNode("loaded a 2nd page"));
	///pnl/menu/timing/ 有効なページでのみ常に表示
	var $pmd_vldLbl = document.createElement("label");
	$pmd_vldLbl.className = "apc-pm_item";
	$pmd_vldLbl.for = "apc-pmd_vld";
	$pmd_vldLbl.title = "AutoPagerizeが有効なページであれば表示";
	$p_menu.appendChild($pmd_vldLbl);
	var $pmd_vld = document.createElement("input");
	$pmd_vld.type = 'radio';
	$pmd_vld.name = res_dsptim._N;
	$pmd_vld.id = "apc-pmd_vld";
	$pmd_vldLbl.appendChild($pmd_vld);
	$pmd_vldLbl.appendChild( document.createTextNode("valid a \"AutoPagerize\""));

	/// 位置設定
	///pnl/menu/ 位置
	var $pm_pos = document.createElement("h4");
	$pm_pos.textContent = "Position Setting";
	$pm_pos.title = "位置設定";
	$p_menu.appendChild($pm_pos);
	///pnl/menu/position/ 基準位置
	var $pmp_basLbl = document.createElement("span");
	$pmp_basLbl.className = "apc-pm_item";
	$pmp_basLbl.title = "基準位置";
	$pmp_basLbl.textContent = "basis:";
	$p_menu.appendChild($pmp_basLbl);
	var $pmp_bas = document.createElement("input");
	$pmp_bas.id = "apc-pmp_bas";
	$pmp_bas.type = 'number';
	$pmp_bas.name = res_posBasis;
	$pmp_basLbl.appendChild($pmp_bas);
	///pnl/menu/position/ 使用単位
	var $pmp_unt = document.createElement("select");
	$pmp_unt.id = "apc-pmp_unt";
	var $pmp_unt_0 = document.createElement("option");
	$pmp_unt_0.textContent = res_unit.pxl;
	$pmp_unt.appendChild($pmp_unt_0);
	var $pmp_unt_1 = document.createElement("option");
	$pmp_unt_1.textContent = res_unit.pct;
	$pmp_unt.appendChild($pmp_unt_1);
	$pmp_basLbl.appendChild($pmp_unt);
	///pnl/menu/position/ アンホバーなら透過させるか
	var $pmp_tuhLbl= document.createElement("label");
	$pmp_tuhLbl.className = "apc-pm_item";
	$pmp_tuhLbl.for = "apc-pmp_tuh";
	$pmp_tuhLbl.title = "カーソルが乗っていない時、背景を透過";
	$pmp_tuhLbl.textContent = "transparent in unhoving:";
	$p_menu.appendChild($pmp_tuhLbl);
	var $pmp_tuh = document.createElement("input");
	$pmp_tuh.id = "apc-pmp_tuh";
	$pmp_tuh.type = 'checkbox';
	$pmp_tuhLbl.appendChild($pmp_tuh);
	
	/// 基準位置からの差
	///pnl/menu/position/ オプショナー
	var $pmp_opt = document.createElement("div");
	$pmp_opt.className = "apc-pmp_box";
	$p_menu.appendChild($pmp_opt);
	var $pmp_optH = document.createElement("h5");
	$pmp_optH.textContent = "Optioner";
	$pmp_opt.appendChild($pmp_optH);
	///pnl/menu/position/optioner/ 基準位置からの差
	var $pmpo_dstLbl = document.createElement("span");
	$pmpo_dstLbl.className = "apc-pm_item";
	$pmpo_dstLbl.title = "基準位置からの差";
	$pmpo_dstLbl.textContent = "distance:";
	$pmp_opt.appendChild($pmpo_dstLbl);
	var $pmpo_dst = document.createElement("input");
	$pmpo_dst.id = "apc-pmpo_dst";
	$pmpo_dst.type = 'number';
	$pmpo_dst.name = "pmpo_dst";
	$pmpo_dstLbl.appendChild($pmpo_dst);
	$pmpo_dstLbl.appendChild(document.createTextNode("px"));
	///pnl/menu/position/optioner/ 配置形状
	var $pmpo_frmLbl = document.createElement("span");
	$pmpo_frmLbl.className = "apc-pm_item";
	$pmpo_frmLbl.title = "配置形状";
	$pmpo_frmLbl.textContent = "validAP form:";
	$pmp_opt.appendChild($pmpo_frmLbl);
	var $pmpo_frm = document.createElement("select");
	$pmpo_frm.id = "apc-pmpo_frm";
	$pmpo_frmLbl.appendChild($pmpo_frm);
	var $pmpo_frm_0 = document.createElement("option");
	$pmpo_frm_0.textContent = "Up";
	$pmpo_frm.appendChild($pmpo_frm_0);
	$pmpo_frm_0.value = res_posFrm.up;
	var $pmpo_frm_1 = document.createElement("option");
	$pmpo_frm_1.textContent = "Down";
	$pmpo_frm.appendChild($pmpo_frm_1);
	$pmpo_frm_1.value = res_posFrm.down;
	var $pmpo_frm_2 = document.createElement("option");
	$pmpo_frm_2.textContent = "Left";
	$pmpo_frm.appendChild($pmpo_frm_2);
	$pmpo_frm_2.value = res_posFrm.left;
//	var $pmpo_frm_3 = document.createElement("option");
//	$pmpo_frm_3.textContent = "Right";
//	$pmpo_frm_3.value = res_posFrm.right;
//	$pmpo_frm.appendChild($pmpo_frm_3);
//	$pmpo_frm.value = posFrm.opt;
	///pnl/menu/position/optioner/ 配置形状afix
	var $pmpo_ifmLbl = document.createElement("span");
	$pmpo_ifmLbl.className = "apc-pm_item";
	$pmpo_ifmLbl.title = "AP対象でないページでの配置形状";
	$pmpo_ifmLbl.textContent = "inhibited form:";
	$pmp_opt.appendChild($pmpo_ifmLbl);
	var $pmpo_ifm = document.createElement("select");
	$pmpo_ifm.id = "apc-pmpo_ifm";
	$pmpo_ifmLbl.appendChild($pmpo_ifm);
	var $pmpo_ifm_0 = document.createElement("option");
	$pmpo_ifm_0.textContent = "No Set";
	$pmpo_ifm.appendChild($pmpo_ifm_0);
	$pmpo_ifm_0.value = res_posFrm.noset;
	var $pmpo_ifm_1 = document.createElement("option");
	$pmpo_ifm_1.textContent = "Up";
	$pmpo_ifm.appendChild($pmpo_ifm_1);
	$pmpo_ifm_1.value = res_posFrm.up;
	var $pmpo_ifm_2 = document.createElement("option");
	$pmpo_ifm_2.textContent = "Down";
	$pmpo_ifm.appendChild($pmpo_ifm_2);
	$pmpo_ifm_2.value = res_posFrm.down;
	var $pmpo_ifm_3 = document.createElement("option");
	$pmpo_ifm_3.textContent = "Left";
	$pmpo_ifm.appendChild($pmpo_ifm_3);
	$pmpo_ifm_3.value = res_posFrm.left;
	///pnl/menu/position/optioner/ 自動非表示
	var $pmpo_hidLbl= document.createElement("label");
	$pmpo_hidLbl.className = "apc-pm_item";
	$pmpo_hidLbl.for = "apc-pmpo_hid";
	$pmpo_hidLbl.title = "自動非表示";
	$pmpo_hidLbl.textContent = "auto hide:";
	$pmp_opt.appendChild($pmpo_hidLbl);
	var $pmpo_hid = document.createElement("input");
	$pmpo_hid.id = "apc-pmpo_hid";
	$pmpo_hid.type = 'checkbox';
	$pmpo_hidLbl.appendChild($pmpo_hid);
	
	///pnl/menu/position/ スクローラー
	var $pmp_scr = document.createElement("div");
	$pmp_scr.className = "apc-pmp_box";
	$p_menu.appendChild($pmp_scr);
	var $pmp_scrH = document.createElement("h5");
	$pmp_scrH.textContent = "Scroller";
	$pmp_scr.appendChild($pmp_scrH);
	///pnl/menu/position/scroller/ 基準位置からの差
	var $pmps_dstLbl = document.createElement("span");
	$pmps_dstLbl.title = "基準位置からの差";
	$pmps_dstLbl.textContent = "distance:";
	$pmp_scr.appendChild($pmps_dstLbl);
	var $pmps_dst = document.createElement("input");
	$pmps_dst.id = "apc-pmps_dst";
	$pmps_dst.type = 'number';
	$pmps_dst.name = "pmps_dst";
	$pmps_dstLbl.appendChild($pmps_dst);
	$pmps_dstLbl.appendChild(document.createTextNode(" px"));
	///pnl/menu/position/scroller/ 配置形状
	var $pmps_frmLbl = document.createElement("span");
	$pmps_frmLbl.title = "配置形状";
	$pmps_frmLbl.textContent = "form:";
	$pmp_scr.appendChild($pmps_frmLbl);
	var $pmps_frm = document.createElement("select");
	$pmps_frm.id = "apc-pmps_frm";
	var $pmps_frm_1 = document.createElement("option");
	$pmps_frm_1.textContent = res_posFrm.slim;
	$pmps_frm.appendChild($pmps_frm_1);
	$pmps_frm_1.value = res_posFrm.slim;
	var $pmps_frm_2 = document.createElement("option");
	$pmps_frm_2.textContent = res_posFrm.square;
	$pmps_frm.appendChild($pmps_frm_2);
	$pmps_frm_2.value = res_posFrm.square;
	$pmps_frmLbl.appendChild($pmps_frm);
	///pnl/menu/position/optioner/ 自動非表示
	var $pmps_hidLbl= document.createElement("label");
	$pmps_hidLbl.for = "apc-pmps_hid";
	$pmps_hidLbl.title = "自動非表示";
	$pmps_hidLbl.textContent = "auto hide:";
	$pmp_scr.appendChild($pmps_hidLbl);
	var $pmps_hid = document.createElement("input");
	$pmps_hid.id = "apc-pmps_hid";
	$pmps_hid.type = 'checkbox';
	$pmps_hidLbl.appendChild($pmps_hid);
	
	///pnl/menu/position/ ページテーブル
	var $pmp_tbl = document.createElement("div");
	$pmp_tbl.className = "apc-pmp_box";
	$p_menu.appendChild($pmp_tbl);
	var $pmp_tblH = document.createElement("h5");
	$pmp_tblH.textContent = "Page Table";
	$pmp_tbl.appendChild($pmp_tblH);
	///pnl/menu/position/pagetable/ 基準位置からの差
	var $pmpt_dstLbl = document.createElement("span");
	$pmpt_dstLbl.title = "基準位置からの差";
	$pmpt_dstLbl.textContent = "distance:";
	$pmp_tbl.appendChild($pmpt_dstLbl);
	var $pmpt_dst = document.createElement("input");
	$pmpt_dst.id = "apc-pmpt_dst";
	$pmpt_dst.type = 'number';
	$pmpt_dst.name = "pmpt_dst";
	$pmpt_dstLbl.appendChild($pmpt_dst);
	$pmpt_dstLbl.appendChild(document.createTextNode(" px"));
	///pnl/menu/position/pagetable/ 配置形状
	var $pmpt_frmLbl = document.createElement("span");
	$pmpt_frmLbl.title = "配置形状";
	$pmpt_frmLbl.textContent = "form:";
	$pmp_tbl.appendChild($pmpt_frmLbl);
	var $pmpt_frm = document.createElement("select");
	$pmpt_frm.id = "apc-pmpt_frm";
	var $pmpt_frm_1 = document.createElement("option");
	$pmpt_frm_1.textContent = res_posFrm.pile;
	$pmpt_frm.appendChild($pmpt_frm_1);
	$pmpt_frm_1.value = res_posFrm.pile;
	var $pmpt_frm_2 = document.createElement("option");
	$pmpt_frm_2.textContent = res_posFrm.row;
	$pmpt_frm.appendChild($pmpt_frm_2);
	$pmpt_frm_2.value = res_posFrm.row;
	$pmpt_frmLbl.appendChild($pmpt_frm);
	///pnl/menu/position/pagetable/ 自動非表示
	var $pmpt_hidLbl= document.createElement("label");
	$pmpt_hidLbl.for = "apc-pmpt_hid";
	$pmpt_hidLbl.title = "自動非表示";
	$pmpt_hidLbl.textContent = "auto hide:";
	$pmp_tbl.appendChild($pmpt_hidLbl);
	var $pmpt_hid = document.createElement("input");
	$pmpt_hid.id = "apc-pmpt_hid";
	$pmpt_hid.type = 'checkbox';
	$pmpt_hidLbl.appendChild($pmpt_hid);
	
	///pnl/menu/ 閉じるボタン
	var $pm_cls = document.createElement("input");
	$pm_cls.id = "apc-pm_cls";
	$pm_cls.type = 'button';
	$pm_cls.name = "Close";
	$p_menu.appendChild($pm_cls);
	$pm_cls.value = "Close";





	///pnl/opt// トグル
	var Update_tgl = function(val)
	{
		if( val == res_apValid.enable )
		{
			$po_tgl.setAttribute( 'valid', "e");
			$po_tglImg.setAttribute( 'alt', "E");
			$po_tgl.title = "Toggle AP (Now:Enable)";
		}
		else
		{
			$po_tgl.setAttribute( 'valid', "d");
			$po_tglImg.setAttribute( 'alt', "D");
			$po_tgl.title = "Toggle AP (Now:Disable)";
		}
		return val;
	};
	///pnl/opt// APイベントをキャプチャー
	document.addEventListener(
		'AutoPagerizeToggleRequest',
		function(){
			apValid = Update_tgl(
				apValid == res_apValid.enable?
				res_apValid.disable:
				res_apValid.enable);
			GM_setValue( res_apValid._N, apValid);
		}
	);
	document.addEventListener(
		'AutoPagerizeEnableRequest',
		function(){
			apValid = Update_tgl(res_apValid.enable);
			GM_setValue( res_apValid._N, apValid);
		}
	);
	document.addEventListener(
		'AutoPagerizeDisableRequest',
		function(){
			apValid = Update_tgl(res_apValid.disable);
			GM_setValue( res_apValid._N, apValid);
		}
	);
	var FireEvent = function(ename)
	{
		var e = document.createEvent('Event');
		e.initEvent( ename
//			apValid == res_apValid.enable?
//			'AutoPagerizeDisableRequest':
//			'AutoPagerizeEnableRequest'
			,true, false);
		return document.dispatchEvent(e);
	};
	///pnl/opt// トグルボタン クリックでリクエストイベント発火
	$po_tgl.addEventListener(
		'click' , function()
		{
			return FireEvent('AutoPagerizeToggleRequest');
		}
	);

	var ap = {
		'page': 0,
		'seam': [0]
	};
	var scTop = document.documentElement.scrollTop;
	var timer;
	// スクロール関数（jquery:animate:swingと違いキビキビした感じ）
	// target:目的Y位置　bearing:移動方向
	var PageScroll = function(target, bearing)
	{
		clearTimeout(timer);
		if( target==scTop ) return;
		if( bearing==null ) bearing = target-scTop;
		
		let y = (target-scTop)/5;
		window.scrollBy( 0,
			bearing>0? Math.ceil(y):
			bearing<0? Math.floor(y): 0
		);
		timer = setTimeout(
			function()
			{
				PageScroll( target, bearing);
			}, 10
		);

		if( (bearing<0 && (target>=scTop && target<document.body.clientHeight)) ||
			(bearing>0 && target<=scTop) )
		{
			window.scrollTo( 0, target);
			clearTimeout(timer);
		}
	};
	///pnl/scr/ 最上部へ移動
	$ps_top.addEventListener(
		'click', function()
		{
			PageScroll(0);
		}
	);
	///pnl/scr/ 最下部へ移動
	$ps_btm.addEventListener(
		'click', function()
		{
			PageScroll( document.body.clientHeight-window.innerHeight );
		}
	);
	///pnl/scr/ 前のページ
	$ps_prv.addEventListener(
		'click', function()
		{
			PageScroll( scTop==ap.seam[ap.page]?
				ap.seam[ap.page-1]: ap.seam[ap.page]
			);
		}
	);
	///pnl/scr/ 次のページ
	$ps_nxt.addEventListener(
		'click', function()
		{
			PageScroll( ap.page+1<ap.seam.length?
					ap.seam[ap.page+1]:
					document.body.clientHeight-window.innerHeight
			);
		}
	);



	///pnl/tbl/ ページ数表示(summary)
	// マウスオーバーでリスト表示
	$p_tbl.addEventListener(
		'mouseover' , function()
		{
			$pt_lst.style.display = 'flex';
		}
	);
	// マウス外すと消える
	$p_tbl.addEventListener(
		'mouseout' , function()
		{
			$pt_lst.style.display = 'none';
		}
	);
	// 新しいページリストアイテムにイベントを追加
	var PageItem_AddEvent = function($elm, num)
	{
		$elm.textContent = num;
		// クリックでそのページにスクロール
		$elm.addEventListener(
			'click', function()
			{
				let num = this.textContent-1;
				if( num >= 0 && num < ap.seam.length )
					PageScroll(ap.seam[num]);
			}
		);
		// ダブルクリックでページ移動
		$elm.addEventListener(
			'dblclick', function()
			{
				let num = this.textContent-2;
				if( num >= 0 )
					document.getElementsByClassName("autopagerize_link")[num].href;
			}
		);
	};
	PageItem_AddEvent($pt_lstItem, 1);



	///pnl/ コンフィグメニュー
	// バブリング阻止
	$p_menu.addEventListener(
		'click', function(e)
		{
			e.stopPropagation();
		}
	);


	///pnl/menu/ 表示タイミング(timing to display)
	var Update_dspTim = function(val)
	{
		switch(val)
		{
			case res_dsptim.valid:
				$pnl.style.display =
				apState == res_apState.inhibit? 'none': 'block';
				break;
			case res_dsptim.loaded:
				$pnl.style.display =
				ap.seam.length == 1? 'none': 'block';
				break;
			case res_dsptim.always:
			default:
				$pnl.style.display = 'block';
				break;
		}
		return val;
	};
	$pmd_alw.addEventListener(
		'click', function()
		{
			dspTim = Update_dspTim(res_dsptim.always);
			GM_setValue( res_dsptim._N, dspTim);
		}
	);
	$pmd_lod.addEventListener(
		'click', function()
		{
			dspTim = Update_dspTim(res_dsptim.loaded);
			GM_setValue( res_dsptim._N, dspTim);
		}
	);
	$pmd_vld.addEventListener(
		'click', function()
		{
			dspTim = Update_dspTim(res_dsptim.valid);
			GM_setValue( res_dsptim._N, dspTim);
		}
	);


	///pnl/menu/ 位置
	// 再配置
	var Update_dst = function( $$, val)
	{
		val = parseInt(val);
		$$.style.top =
			unit == res_unit.pct?
			"calc( " + val + "px + " + posBasis + "% )":
			posBasis + val + 'px';
		return val;
	};
	var Update_allDest = function()
	{
		Update_dst( $p_opt, posDst.opt);
		Update_dst( $p_scr, posDst.scr);
		Update_dst( $p_tbl, posDst.tbl);
	};
	///pnl/menu/position/ 基準位置変更
	$pmp_bas.addEventListener(
		'change' , function()
		{
			posBasis = parseInt(this.value);
			Update_allDest();
			GM_setValue( res_posBasis, posBasis);
		}
	);
	///pnl/menu/position/ 使用単位
	$pmp_unt.addEventListener(
		'change' , function()
		{
			unit = this.value;
			Update_allDest();
			GM_setValue( res_unit._N, unit);
		}
	);
	///pnl/menu/position/optioner/ 自動非表示
	$pmp_tuh.addEventListener(
		'change' , function()
		{
			transUnhover = this.checked;
			GM_setValue( res_transUnhover, transUnhover);
		}
	);
	///pnl/menu/position/optioner/ 位置ずらし
	$pmpo_dst.addEventListener(
		'change' , function()
		{
			posDst.opt = Update_dst( $p_opt, this.value);
			GM_setValue( res_posDst._OPT, posDst.opt);
		}
	);
	///pnl/menu/position/scroller/ 位置ずらし
	$pmps_dst.addEventListener(
		'change' , function()
		{
			posDst.scr = Update_dst( $p_scr, this.value);
			GM_setValue( res_posDst._SCR, posDst.scr);
		}
	);
	///pnl/menu/position/pagetable/ 位置ずらし
	$pmpt_dst.addEventListener(
		'change' , function()
		{
			posDst.tbl = Update_dst( $p_tbl, this.value);
			GM_setValue( res_posDst._TBL, posDst.tbl);
		}
	);
	///pnl/menu/position// 配置形状
	var Update_frm = function( $$, val)
	{
		$$.setAttribute( 'form', val);
		return val;
	};
	var Update_inhfrm = function( $$, val)
	{
		$$.setAttribute( 'inhfrm', val);
		return val;
	};
	///pnl/menu/position/optioner/ 配置形状
	$pmpo_frm.addEventListener(
		'change' , function()
		{
			posFrm.opt = Update_frm( $p_opt, this.value);
			GM_setValue( res_posFrm._OPT, posFrm.opt);
		}
	);
	$p_opt.setAttribute( 'form', posFrm.opt);
	///pnl/menu/position/optioner/ 無効時配置形状
	$pmpo_ifm.addEventListener(
		'change' , function()
		{
			posFrm.iop = Update_inhfrm( $p_opt, this.value);
			GM_setValue( res_posFrm._IOP, posFrm.iop);
		}
	);
	$p_opt.setAttribute( 'inhfrm', posFrm.iop);
	///pnl/menu/position/scroller/ 配置形状
	$pmps_frm.addEventListener(
		'change' , function()
		{
			posFrm.scr = Update_frm( $p_scr, this.value);
			GM_setValue( res_posFrm._SCR, posFrm.scr);
		}
	);
	$p_scr.setAttribute( 'form', posFrm.scr);
	///pnl/menu/position/pagetable/ 配置形状
	$pmpt_frm.addEventListener(
		'change' , function()
		{
			posFrm.tbl = Update_frm( $p_tbl, this.value);
			GM_setValue( res_posFrm._TBL, posFrm.tbl);
		}
	);
	$p_tbl.setAttribute( 'form', posFrm.tbl);
	///pnl/menu/position// 自動非表示
	var AutoHide_pop = function()
	{
		$p_opt.setAttribute( 'autohide', 'hoving');
		$p_scr.setAttribute( 'autohide', 'hoving');
		$p_tbl.setAttribute( 'autohide', 'hoving');
	};
	$p_opt.addEventListener(
		'mouseover', function()
		{
			if( posHid.opt == false )
				AutoHide_pop();
		}
	);
	$po_tgl.addEventListener( 'mouseover', AutoHide_pop);
	$p_scr.addEventListener( 'mouseover', AutoHide_pop);
	$p_tbl.addEventListener( 'mouseover', AutoHide_pop);
	var AutoHide_hiding = function()
	{
		if( posHid.opt == true )
			$p_opt.setAttribute( 'autohide', 'hidden');
		else if(transUnhover)
			$p_opt.setAttribute( 'autohide', 'transparent');
		else	$p_opt.removeAttribute( 'autohide');
		if( posHid.scr == true )
			$p_scr.setAttribute( 'autohide', 'hidden');
		else if(transUnhover)
			$p_scr.setAttribute( 'autohide', 'transparent');
		else	$p_scr.removeAttribute( 'autohide');
		if( posHid.tbl == true )
			$p_tbl.setAttribute( 'autohide', 'hidden');
		else if(transUnhover)
			$p_tbl.setAttribute( 'autohide', 'transparent');
		else	$p_tbl.removeAttribute( 'autohide');
	};
	$pnl.addEventListener(
		'mouseleave', function()
		{
			if( $p_menuOuter.style.display == 'none' )
				AutoHide_hiding();
		}
	);
	///pnl/menu/position/optioner/ 自動非表示
	$pmpo_hid.addEventListener(
		'change' , function()
		{
			posHid.opt = this.checked;
			GM_setValue( res_posHid._OPT, posHid.opt);
		}
	);
	///pnl/menu/position/scroller/ 自動非表示
	$pmps_hid.addEventListener(
		'change' , function()
		{
			posHid.scr = this.checked;
			GM_setValue( res_posHid._SCR, posHid.scr);
		}
	);
	///pnl/menu/position/pagetable/ 自動非表示
	$pmpt_hid.addEventListener(
		'change' , function()
		{
			posHid.tbl = this.checked;
			GM_setValue( res_posHid._TBL, posHid.tbl);
		}
	);
	
	/// 最親パネルを領域に合わせる（スキマ対策）
	var FixParentPanel = function()
	{
		let mintop, minlft, maxbtm, maxwid = null;
		$p_opt.style.display = 'flex';
		$p_scr.style.display = 'flex';
		
		let opt = $p_opt.getClientRects()[0];
		let scr = $p_scr.getClientRects()[0];
		if( opt!=null && scr!=null ){
			mintop = Math.min( opt.top, scr.top);
			maxbtm = Math.max( opt.bottom, scr.bottom);
			minlft = Math.min( opt.left, scr.left);
			maxwid = Math.max( opt.width, scr.width);
		}
		if( apState != res_apState.inhibit )
		{
			$p_tbl.style.display = 'block';
			let tbl = $p_tbl.getClientRects()[0];
			if( tbl != null )
			{
				mintop = Math.min( mintop, tbl.top);
				maxbtm = Math.max( maxbtm, tbl.bottom);
				minlft = Math.min( minlft, tbl.left);
				maxwid = Math.max( maxwid, tbl.width);
			}
		}
		$pnl.style.top = mintop + 'px';
		$pnl.style.left = minlft + 'px';
		$pnl.style.width = maxwid + 'px';
		$pnl.style.height  = maxbtm - mintop + 'px';
		
		$p_opt.style.display = null;
		$p_scr.style.display = null;
		$p_tbl.style.display = null;
	};
	window.addEventListener( 'resize', FixParentPanel);

	// コンフィグ画面表示
	var Open_Config = function()
	{
			$pnl.setAttribute( 'state', 'active');
			$p_menuOuter.style.display = 'flex';
			AutoHide_pop();
	};
	$po_cfg.addEventListener(
		'click' , function()
		{
			Open_Config();
		}
	);
	/// ボタンが見えなくなった時のため、ショートカットで開けるようにする。
	/// vimperator使用時は、IGNORE ALL KEYSにして操作すること。
	/// Alt + Ctrl + p
	document.addEventListener(
		'keydown', function(e)
		{
//			(shift && e.shiftKey) && (ctrl && e.ctrlKey) && (alt && e.altKey)
			if( e.altKey && e.ctrlKey && e.keyCode == 80 )
				Open_Config();
		}
	);
	///pnl/menu/ コンフィグ閉じるボタン
	var Close_Config = function()
	{
		$p_menuOuter.style.display = 'none';
		if( apState == res_apState.inhibit )
			$pnl.removeAttribute('state');
		
		Update_allDest();
		AutoHide_hiding();
		FixParentPanel();
	};
	$p_menuOuter.addEventListener(
		'click' , function()
		{
			Close_Config();
		}
	);
	$pm_cls.addEventListener(
		'click' , function()
		{
			Close_Config();
		}
	);



//	//// AutoPagerizeが有効なページで発火するイベント……のはずだが、全てのページで発火する
//	//// ここでAutoPagerizeDisableRequestなどを送っても意味がなかった
//	document.addEventListener(
//		'GM_AutoPagerizeLoaded', function(e)
//		{
//		}
//	);
	
	/// APメッセージバー（アドオン版）かAPアイコン（スクリプト版）が挿入されると、
	/// APが有効なページであるとみなす。
	document.addEventListener(
		'DOMNodeInserted', function(e)
		{
			if( apState != res_apState.inhibit ) return;

			let $elm = e.target;
			if( $elm.id == "autopagerize_message_bar" )
				apState = res_apState.valid_addon;
			else if( $elm.id == "autopagerize_icon" )
				apState = res_apState.valid_script;
			if( apState != res_apState.inhibit )
			{
				// AutoPagerize有効なページでのみ行う処理
				$pnl.setAttribute( 'state', 'active');
				/// 「有効なページでのみ表示」の場合
				if( dspTim == res_dsptim.valid )
					$pnl.style.display = 'block';

				FixParentPanel();

				$elm.addEventListener(
					'load', function()
					{
						FireEvent(
							apValid == res_apValid.enable?
							'AutoPagerizeEnableRequest':
							'AutoPagerizeDisableRequest'
						);
					}
				);
			}
		}
	);
	





	// ウィンドウのスクロールが発生した時
	window.addEventListener(
		'scroll', function()
		{
			scTop = document.documentElement.scrollTop;

			// 現在の位置が何ページ目にあるか調査
			for( let i=ap.seam.length-1; i>=0; i-- )
			{
				if( scTop >= ap.seam[i]-1 )
				{
					if( ap.page != i )
					{
						ap.page = i;
						$pt_smyNow.textContent = i+1;
						FixParentPanel();
					}
					break;
				}
			}
		}
	);
	

	// ページを継ぎ足した時、継ぎ目の位置を記録する
	var AP_SeamLine = function()
	{
		// 表示タイミングがロード後で、最初の継ぎ足しならパネル表示
		if( ap.seam.length == 1 && dspTim == res_dsptim.loaded )
			$pnl.style.display = 'block';

		// 継ぎ目の絶対位置を取得
		let $ap_sep = document.getElementsByClassName("autopagerize_page_separator");
		let len = $ap_sep.length;
		let offsety = 0, $elm = $ap_sep[len-1];
		/// offsetTop が「親要素からの相対位置」なので、親を遡りながら計測する
		while($elm)
		{
			offsety += $elm.offsetTop || 0;
			$elm = $elm.offsetParent;
		}
		ap.seam[len] = offsety;
		$pt_smyMax.textContent = len+1;

		// ページリストアイテムを追加
		var $new_pageitem = $pt_lstItem.cloneNode(true);
		PageItem_AddEvent($new_pageitem, len+1);
		$pt_lst.appendChild($new_pageitem);

		FixParentPanel();
	};
	
	if( window.AutoPagerize )
	{
		console.log( 'window.AutoPagerize' );
		
		// 継ぎ足した時
		AutoPagerize.addFilter(AP_SeamLine);
	}else
	{
		document.addEventListener(
			'GM_AutoPagerizeNextPageLoaded', function()
			{
				AP_SeamLine();
			}
		);
	}
//	document.addEventListener(
//		'GM_AutoPagerizeLoaded', function(e)
//		{
//			console.log(e);
//			console.log(e.target);
//		}
//	);
//	document.addEventListener(
//		'load', function(e)
//		{
//			console.log(e);
//			console.log(e.target);
//		}
//	);
//	document.addEventListener(
//		'DOMContentLoaded', function(e)
//		{
//			console.log(e);
//			console.log(e.target);
//		}
//	);

	

	var UpdateState = function()
	{
		Update_tgl(apValid);
		FireEvent(
			apValid == res_apValid.enable?
			'AutoPagerizeEnableRequest':
			'AutoPagerizeDisableRequest'
		);
		
		switch(dspTim)
		{
			case res_dsptim.valid:
				$pmd_vld.checked = true;
				break;
			case res_dsptim.loaded:
				$pmd_lod.checked = true;
				break;
			case res_dsptim.always:
			default:
				$pmd_alw.checked = true;
				break;
		}
		Update_dspTim(dspTim);
		
		$pmp_bas.value = posBasis;
		$pmp_unt.value = unit;
		$pmp_tuh.checked = transUnhover;
		
		$pmpo_dst.value = posDst.opt;
		$pmps_dst.value = posDst.scr;
		$pmpt_dst.value = posDst.tbl;
		
		$pmpo_ifm.value = posFrm.iop;
		$pmpo_frm.value = posFrm.opt;
		$pmps_frm.value = posFrm.scr;
		$pmpt_frm.value = posFrm.tbl;
		
		$pmpo_hid.checked = posHid.opt;
		$pmps_hid.checked = posHid.scr;
		$pmpt_hid.checked = posHid.tbl;

		Update_inhfrm( $p_opt, posFrm.iop);
		Update_frm( $p_opt, posFrm.opt);
		Update_frm( $p_scr, posFrm.scr);
		Update_frm( $p_tbl, posFrm.tbl);


		Update_allDest();
		AutoHide_hiding();
		FixParentPanel();
	};

	var GetState = function()
	{
		apValid = GM_getValue( res_apValid._N, res_apValid.enable);
		
		dspTim = GM_getValue( res_dsptim._N, res_dsptim.always);
		posBasis = GM_getValue( res_posBasis, 66);
		unit = GM_getValue( res_unit._N, res_unit.pxl);
		transUnhover = GM_getValue( res_transUnhover, false);
		
		posDst = {
			opt: GM_getValue(res_posDst._OPT, 0),
			scr: GM_getValue(res_posDst._SCR, 28),
			tbl: GM_getValue(res_posDst._TBL, 118)
		};
		posFrm = {
			opt: GM_getValue( res_posFrm._OPT, res_posFrm.up),
			iop: GM_getValue( res_posFrm._IOP, res_posFrm.noset),
			scr: GM_getValue( res_posFrm._SCR, res_posFrm.slim),
			tbl: GM_getValue( res_posFrm._TBL, res_posFrm.pile)
		};
		posHid = {
			opt: GM_getValue( res_posHid._OPT, false),
			scr: GM_getValue( res_posHid._SCR, false),
			tbl: GM_getValue( res_posHid._TBL, false)
		};
		
		UpdateState();
	};
	GetState();


	// タブを切り替えた時にステータスを最新に同期する
	document.addEventListener(
		'visibilitychange', function()
		{
			if( document.visibilityState == 'visible' )
			{
				GetState();
			}
		}
	);



//	Open_Config();



//	var $iframe = document.createElement("iframe");
//	$iframe.id = "apc-iframe";
//	$iframe.style.position = 'fixed';
//	$iframe.style.top = 0;
//	$iframe.style.right = 0;
//	$iframe.style.width = '100%';
//	$iframe.style.height = '100%';
//	$iframe.style.border = 'none';
//	$iframe.style.pointerEvents = 'none';
//	document.body.appendChild($iframe);
//
//	$iframe.addEventListener(
//		'load', function()
//		{
//			var $idoc = $iframe.contentDocument;
////			$idoc.open();
////			$idoc.write("<html><head></head><body></body></html>");
////			$idoc.close();
////			$idoc.writeln("<body></body>");
//			$idoc.body.style.margin = 0;
//			$idoc.body.style.cursor = 'pointer';
//			
//			var $ielm = $idoc.createElement("div");
//			$ielm.style.position = 'fixed';
//			$ielm.style.top = '300px';
//			$ielm.style.width = '40px';
//			$ielm.style.height = '40px';
//			$ielm.style.background = '#cfc';
//			$ielm.style.right = 0;
//			$idoc.body.appendChild($ielm);
//			$ielm.appendChild($idoc.createTextNode("test"));
//			
//			var $ielm2 = $idoc.createElement("select");
//			$ielm2.style.position = 'fixed';
//			$ielm2.style.top = '400px';
//			$ielm2.style.width = '40px';
//			$ielm2.style.height = '40px';
//			$ielm2.style.background = '#cfc';
//			$ielm2.style.right = 0;
//			$ielm2.style.pointerEvents = 'auto';
//			$idoc.body.appendChild($ielm2);
//			console.log($idoc);
//		},false
//	);
})();
