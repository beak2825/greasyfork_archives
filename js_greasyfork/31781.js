// ==UserScript==
// @name         gab.ai follow script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Lets you follow all the accounts on someone's following list.
// @author       @jorgequintt
// @match        https://gab.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31781/gabai%20follow%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/31781/gabai%20follow%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';
	
	var step;
	var to_follow = 0;
	var acc_followed = 0;
	var waiting = false;
	var msg = "";
	var last_qty = 0;
	
	function run_follow_all(){
		step = 4;
	}
	
	function run_follow_x(){
		step = 3;
		to_follow = document.querySelector('#j_custom_input').value;
	}

	function step1(){
		step = 1;
		to_follow = 0;
		acc_followed = 0;
		last_qty = 0;
		waiting = false;
	}
	
	var css = "#loop_state{margin: 15px 15px 1px 15px;text-align: center;}#j_custom {padding-right: 0px;}.column1,.column2{width:50%;display:inline-block;text-align:center}#j_custom_input{width:67px}.j_custom_btn{position:initial!important}";
	
	function loop(){
	
		//check if we are in /following
		if( window.location.href.indexOf('/following') > 0 || window.location.href.indexOf('/followers') > 0 ){

			//if element loaded, add button to layout
			var ul = document.querySelector('.user-list');
			var first_u = document.querySelectorAll('.user-list__item.clearfix')[0];
			var j_custom_elem = document.querySelector('#j_custom');
			
			if( !!ul && !!first_u && !j_custom_elem){
				console.log('step 0');
				
				var css_elem = document.createElement('style');
				css_elem.appendChild(document.createTextNode(css));
				
				
				var follow_all_box = document.createElement('div');
				follow_all_box.setAttribute('class', 'user-list__item clearfix j_custom_box');
				follow_all_box.setAttribute('id', 'j_custom');
				
				var wrapper = document.createElement('div');
				
				var column1 = document.createElement('div');
				column1.setAttribute('class', 'column1');
				
				var column2 = document.createElement('div');
				column2.setAttribute('class', 'column2');
				
				var follow_all_btn = document.createElement('a');
				follow_all_btn.innerHTML = 'Follow All';
				follow_all_btn.setAttribute('class', 'user-list__item__follow j_custom_btn');
			
				var follow_x_btn = document.createElement('a');
				follow_x_btn.setAttribute('class', 'user-list__item__follow j_custom_btn');
				follow_x_btn.innerHTML = 'Follow 0 accounts';
				
				var follow_input = document.createElement('input');
				follow_input.setAttribute('id', 'j_custom_input');
				follow_input.setAttribute('type', 'number');
				follow_input.setAttribute('placeholder', '0');
				
				var loop_state = document.createElement('p');
				loop_state.setAttribute('id', 'loop_state');
				
				['change', 'keyup', 'click'].forEach(function(ev){
					follow_input.addEventListener(ev, function(){
						follow_x_btn.innerHTML = 'Follow '+this.value+' accounts';
					});
				});
				
				
			
				column1.appendChild(follow_all_btn);
				column2.appendChild(follow_x_btn);
				column2.appendChild(follow_input);
				wrapper.appendChild(css_elem);
				wrapper.appendChild(column1);
				wrapper.appendChild(column2);
				wrapper.appendChild(loop_state);
				follow_all_box.appendChild(wrapper);
				ul.insertBefore(follow_all_box, first_u);
				
				follow_all_btn.addEventListener('click', function(e){
					e.preventDefault();
					run_follow_all();
				});
				
				follow_x_btn.addEventListener('click', function(e){
					e.preventDefault();
					run_follow_x();
				});
			
				step1();
			}
			
			if(!!j_custom_elem && step > 1){
				console.log('step > 1');
				
				document.querySelector('#loop_state').innerHTML = "Followed accounts: "+acc_followed;
				
				var all_btns = document.querySelectorAll('a.user-list__item__follow').length;
				var all_follow_btns = document.querySelectorAll('a[class="user-list__item__follow pull-right"]');
				
				var load_more_btn = document.querySelector('.user-list__load');
				var loading_icon = document.querySelector('.user-list__load .ion-load-c.spinning');
				
				if(step == 3 && acc_followed == to_follow){
					step = 5;
					msg = "All accounts have been followed.";
				}else{
					if(all_follow_btns.length < 1){
						if(!loading_icon && !waiting){
							last_qty = all_btns;
							load_more_btn.click();
							waiting = true;
						}else if(!loading_icon && waiting){
							if(last_qty < all_btns){
								last_qty = all_btns;
								load_more_btn.click();
							}else if(last_qty == all_btns){
								step = 5;
								msg = "No more accounts to follow.";
							}
						}
					}else{
						waiting = false;
						all_follow_btns[0].click();
						acc_followed++;
					}
				}
			}
			
			if( step == 5 ){
				step1();
				alert('Task done: '+msg);
			}
			
		} //end if in following
		
	}
	
	setInterval(loop, 350);
	
})();