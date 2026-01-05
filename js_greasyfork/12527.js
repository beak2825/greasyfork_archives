// ==UserScript==
// @name         포인트 출석 Helper | tcafe
// @namespace    
// @version      1.1
// @description  enter something useful
// @author       You
// @include      http://tcafe*.com/attendance/attendance.php?3*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12527/%ED%8F%AC%EC%9D%B8%ED%8A%B8%20%EC%B6%9C%EC%84%9D%20Helper%20%7C%20tcafe.user.js
// @updateURL https://update.greasyfork.org/scripts/12527/%ED%8F%AC%EC%9D%B8%ED%8A%B8%20%EC%B6%9C%EC%84%9D%20Helper%20%7C%20tcafe.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function(){
	$($('#btn_stop').parents('table').get(0)).after($('<button type="button">고수 Helper</button>').bind('click', function(){
		console.log('monitering started.');
		setInterval(function(){
			if($('.test11').val() == 95){
				$('#btn_stop').trigger('click');
			}
		},1);
	})).after($('<button type="button">능력자 Helper</button>').bind('click', function(){
		console.log('monitering started.');
		setInterval(function(){
			if($('.test11').val() == 99){
				$('#btn_stop').trigger('click');
			}
		},1);
	})).after($('<button type="button">달인 Helper</button>').bind('click', function(){
		console.log('monitering started.');
		setInterval(function(){
			if($('.test11').val() == 0){
				$('#btn_stop').trigger('click');
			}
		},1);
	})).after($('<button type="button">중수 Helper</button>').bind('click', function(){
		console.log('monitering started.');
		setInterval(function(){
			if($('.test11').val() == 90){
				$('#btn_stop').trigger('click');
			}
		},1);
	}));
});