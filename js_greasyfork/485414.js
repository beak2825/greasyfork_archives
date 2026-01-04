// ==UserScript==
// @name        美年大健康 - 前台快捷键模组
// @namespace   Violentmonkey Scripts
// @match       *://checkup-register.health-100.cn/*
// @version     2.2.8
// @author      yagami_kiya
// @license     MIT
// @description 2024-8-25
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM.getValue
// @grant       GM.setValue
// @icon        https://home.health-100.cn/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/485414/%E7%BE%8E%E5%B9%B4%E5%A4%A7%E5%81%A5%E5%BA%B7%20-%20%E5%89%8D%E5%8F%B0%E5%BF%AB%E6%8D%B7%E9%94%AE%E6%A8%A1%E7%BB%84.user.js
// @updateURL https://update.greasyfork.org/scripts/485414/%E7%BE%8E%E5%B9%B4%E5%A4%A7%E5%81%A5%E5%BA%B7%20-%20%E5%89%8D%E5%8F%B0%E5%BF%AB%E6%8D%B7%E9%94%AE%E6%A8%A1%E7%BB%84.meta.js
// ==/UserScript==

var btn_checkup,btn_checkup_confirm;
var btn_confirm;
var tabs_bar_btn_1,tabs_bar_btn_2;
var btn_ok,btn_save;
var btn_close_back;
var btn_rec,btn_rec_confirm;
var btn_back,btn_close;
var btn_barcode_print,btn_guid_print;
var btn_execute,btn_execute_confirm;
var btn_reprint_barcode,btn_checkbarcode_up,btn_reprint_barcode_confirm;
var num_gyn = 0;
var num_c14 = 0;
var num_pee = 0;
var checkbox_push = null;
//定义全部按钮

var btn_close_click_success = false;
var btn_execute_confirm_click_success = false;
var btn_rec_confirm_click_success = false;

//调用下面这个函数可以给框架包装过的input框赋值
function changeReactInputValue(inputDom,newText){
    let lastValue = inputDom.value;
    inputDom.value = newText;
    let event = new Event('input', { bubbles: true });
    event.simulated = true;
    let tracker = inputDom._valueTracker;
    if (tracker) {
      tracker.setValue(lastValue);
    }
    inputDom.dispatchEvent(event);
}

/*     自动流程      */
//别忘了三个标记给屏蔽下
function oneKeyGo(){
	var timeOnekey = 500;
		btn_checkup.click();//结算
	setTimeout(() => {
		btn_checkup_confirm.click();//确认结算
	},timeOnekey);
	setTimeout(() => {
		btn_confirm.click();//确认登记
	},timeOnekey+1300);
	setTimeout(() => {
		tabs_bar_btn_2.click();//跳转tab bar
	},timeOnekey+1300+1000);
	setTimeout(() => {
		btn_execute.click();//点执行
	},timeOnekey+timeOnekey+1300+1000+800);
	setTimeout(() => {
		btn_rec.click();//点收单
	},timeOnekey+timeOnekey+1300+1000+800+900);
  setTimeout(() => {
		btn_rec_conti.click();//继续
	},timeOnekey+timeOnekey+1300+1000+800+900+600);
	setTimeout(() => {
		btn_back.click();//返回
	},timeOnekey+timeOnekey+1300+1000+800+900+600+1000);
}
function autoReprintBarcode(){
	let all_barcode_name = document.getElementsByClassName("ant-col ant-col-18");
	for( let g = 1; g < all_barcode_name.length ; g++ ){
		//window.alert(g);
		//window.alert(all_barcode_name[g].innerText);
		//window.alert(num_gyn);
		if( all_barcode_name[g].innerText == "TCT" ) num_gyn = g ;
    if( all_barcode_name[g].innerText == "C14" ) num_c14 = g ;
    if( all_barcode_name[g].innerText == "尿常规" ) num_pee = g ;
		}
	let all_btn_barcode = document.getElementsByClassName("ant-card ant-card-bordered barcode-card-container");
	for(let i = 0; i < all_btn_barcode.length - 1 ; i++){
		all_btn_barcode[i].click();
		}

	let btn_checkbarcode_up = document.getElementsByClassName("ant-input-number-input");
	let input_gyn = btn_checkbarcode_up[num_gyn];
  let input_c14 = btn_checkbarcode_up[num_c14];
  let input_pee = btn_checkbarcode_up[num_pee];
  num_c14 = 0;
  num_gyn = 0;
  num_pee = 0;
	//input_gyn.Style.backgroundColor = "red";
	//window.alert(num_gyn);
	changeReactInputValue(input_gyn,"1");
  changeReactInputValue(input_c14,"1");
  changeReactInputValue(input_pee,"1");

	if(btn_checkbarcode_up.length >= 1){
		let input1 = btn_checkbarcode_up[btn_checkbarcode_up.length - 1];
		changeReactInputValue(input1,"3");
		btn_reprint_barcode_confirm.click();
		}
  setTimeout(() => {
    document.getElementsByClassName("ant-modal-close")[0].click();
	},1000);

}

function setHotKey(){
  document.addEventListener('keydown', function (event){//JS监听键盘快捷键并点击按钮

  /*---带alt---*/
  switch (event.altKey&&event.keyCode){
	  case 83:btn_save.click();break;				//S保存 			S 83
	  case 49:btn_checkup.click();break;			//1结算  		1 49
	  case 50:btn_checkup_confirm.click();break;	//2确认结算 		2 50
	  case 51:btn_confirm.click();break;			//3确认登记 		3 51
	  case 52:{
		  btn_reprint_barcode.click();
		  setTimeout(() => {
		  autoReprintBarcode();
		  },1000);
		  break;
		  }											//4补打条码		4 52
	  case 86:btn_rec.click();break;				//B回收导检单 	V 86
	  case 66:btn_rec_confirm.click();break;		//V确认回收 		B 66
	  case 82:tabs_bar_btn_2.click();break;			//R检后核查		R 82
	  case 192:btn_back.click();break;				//~返回 			~ 127
	  case 88:btn_guid_print.click();break;			//X项目打印 		X 88
	  case 67:btn_barcode_print.click();break;		//C打印条码 		C 67
	  case 71:oneKeyGo();break;						//G一键			G 71
	  case 81:btn_read_card.click();break;			//Q读身份证		Q 81

    //case 85:checkbox_push.checked = "false";break; //test

	  }

  /*---不带alt---*/
  switch(event.keyCode){
	  case 27:btn_close_back.click();break;			//关闭			ESC
	  }

  });
}

/*------初始化事件绑定(延迟100ms)------*/
setTimeout(function(){
	setHotKey();
},100);

setInterval(() => {

	/*---------临时变量---------*/
	var all_primary_btn;
	var all_ghost_btn
	var all_tabs_btn;
	var all_close_cancel_btn;
	var all_btn_sm;
	var all_btn_link;
  var all_checkbox;
  var all_rec_conti;
	/*------------绑定快捷键-----------*/
	function setBtn(){
		/*响应主界面按钮遍历*/
		all_primary_btn = document.getElementsByClassName("ant-btn ant-btn-primary");
    all_checkbox = document.getElementsByClassName("ant-checkbox-wrapper ant-checkbox-wrapper-checked");
		for(let i = 0;i < all_primary_btn.length ; i++ ){
			switch(all_primary_btn[i].innerText){
				case "项目打印":{btn_guid_print = all_primary_btn[i];break;}
				case "打印条码":{btn_barcode_print = all_primary_btn[i];break;}
				case "确认结算":{btn_checkup_confirm = all_primary_btn[i];break;}
				case "确认登记":{btn_confirm = all_primary_btn[i];break;}
				case "保 存":{btn_save = all_primary_btn[i];break;}
				case "回收导检单":{btn_rec = all_primary_btn[i];break;}
				case "结 算":{btn_checkup = all_primary_btn[i];break;}
				case "确定回收":{btn_rec_confirm = all_primary_btn[i];break;}
        case "继续回收":{btn_rec_conti = all_primary_btn[i];break;}
				case "关 闭":{btn_close = all_primary_btn[i];break;}
				case "补打条码":{btn_reprint_barcode = all_primary_btn[i];break;}
				case "确认补打":{btn_reprint_barcode_confirm = all_primary_btn[i];break;}
				case "读身份证":{btn_read_card = all_primary_btn[i];break;}
			}
		}
    for(let j = 0 ; j < all_checkbox.length ; j++){
      if(all_checkbox.innerText == "推送导诊") {checkbox_push.firstChild.firstChild = all_checkbox[j];}
    }

		/*响应检后核查tabbar*/
		all_tabs_btn = document.getElementsByClassName("ant-tabs-tab");
		for(let i = 0;i < all_tabs_btn.length ; i++ ){
			switch(all_tabs_btn[i].innerText){
				case "检后核查":{tabs_bar_btn_2 = all_tabs_btn[i];break;}
				}
		}

		/*响应关闭按钮*/
		all_close_cancel_btn = document.getElementsByClassName("ant-drawer-close");
		for(let i = 0;i<all_close_cancel_btn.length; i++){
			if(all_close_cancel_btn[i]!=null) btn_close_back = all_close_cancel_btn[0];
		}

		/*响应返回按钮*/
		all_ghost_btn = document.getElementsByClassName("ant-btn ant-btn-primary ant-btn-background-ghost");
		for(let i = 0 ; i < all_ghost_btn.length ; i++){
			if(all_ghost_btn[i].innerText == "返回") {btn_back = all_ghost_btn[i];}
		}

		/*响应执行按钮*/
		all_btn_link = document.getElementsByClassName("ant-btn ant-btn-link");
		for(let i = 0; i < all_btn_link.length ; i++){
			if(all_btn_link[i].innerText == "执行") {btn_execute = all_btn_link[i];break;}
		}

		/*响应执行-确定按钮*/
		all_btn_sm = document.getElementsByClassName("ant-btn ant-btn-primary ant-btn-sm");
		if(all_btn_sm[0] != null){
			for(let i = 0 ; i < all_btn_sm.length ; i++ ){
				if(all_btn_sm[i].innerText == "确 定") {btn_execute_confirm = all_btn_sm[i];break;}
				}
		}
		else btn_execute_confirm = null;
	}
	setBtn();

  function autoClick(){

	  if (btn_close != null && btn_close_click_success == false){
		  btn_close.click();
		  btn_close_click_success == true;
		  setTimeout(() => {
			  btn_close_click_success = false;
		  },500);
	  }

	  if (btn_execute_confirm != null && btn_execute_confirm_click_success == false){
		  btn_execute_confirm.click();
		  btn_execute_confirm_click_success = true;
		  setTimeout(() => {
			  btn_execute_confirm_click_success = false;
		  },500);
	  }

	  /*！！！自动收单确认，慎用！！！！*/
	  if (btn_rec_confirm != null && btn_rec_confirm_click_success == false ){
		  btn_rec_confirm.click();
		  btn_rec_confirm_click_success = true;
		  setTimeout(() => {
			  btn_rec_confirm_click_success = false;
		  },500);

	  }

  }
  autoClick();

},10);

//0-9 48-57
//keycode 65 = a A
//keycode 66 = b B
//keycode 67 = c C
//keycode 68 = d D
//keycode 69 = e E EuroSign
//keycode 70 = f F
//keycode 71 = g G
//keycode 72 = h H
//keycode 73 = i I
//keycode 74 = j J
//keycode 75 = k K
//keycode 76 = l L
//keycode 77 = m M mu
//keycode 78 = n N
//keycode 79 = o O
//keycode 80 = p P
//keycode 81 = q Q at
//keycode 82 = r R
//keycode 83 = s S
//keycode 84 = t T
//keycode 85 = u U
//keycode 86 = v V
//keycode 87 = w W
//keycode 88 = x X
//keycode 89 = y Y
//keycode 90 = z Z