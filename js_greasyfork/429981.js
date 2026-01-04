// ==UserScript==
// @name         pmdice

// @namespace    http://pmdice.com
// @version      0.3
// @description  auto-rolling. Alefa Barea
// @author       You
// @match        http://pmdice.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js
// @include      https://example.com/ 
// @downloadURL https://update.greasyfork.org/scripts/429981/pmdice.user.js
// @updateURL https://update.greasyfork.org/scripts/429981/pmdice.meta.js
// ==/UserScript==   

 /* global $ */
 $(document).ready(function(){ console.log('ready'); });
 
$(document).ready(function(){
(function() {
	var isStop = false;
	var r1= $('<input type="button" id="btnAuto1" value="START TOOL-AUTO 1" style="color:red;position:fixed;top:0;left:0;z-index:99999;"/>');
	var r2= $('<input type="button" id="btnAuto2" value="START TOOL-AUTO 2" style="color:red;position:fixed;top:0;left:200px;z-index:99999;"/>');
	var r3= $('<input type="button" id="btnAuto3" value="START TOOL-AUTO 3" style="color:red;position:fixed;top:0;left:400px;z-index:99999;"/>');
	var exAlertModal= $('<div id="exAlertModal" class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">'+
		'<div class="modal-dialog modal-sm" role="document"><div class="modal-content"><div class="modal-header">'+
			'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
			'<h4 class="modal-title" id="gridSystemModalLabel">NOTE</h4>'+
		'</div>'+
		'<div class="modal-body"><div class="alert alert-info text-center">Cảnh báo nguy hiểm!!!</div><div class="text-center">Auto close in <span id="exTimer" class="text-bold"></span></div></div>'+
		'<div class="modal-footer"><button type="button" class="btn btn-default text-bold" data-dismiss="modal" onclick="stop();">Tắt tool</button></div>'+
		'</div></div></div>');
	
	$("#wrapper").append(r1);
	$("#wrapper").append(r2);
	$("#wrapper").append(r3);
	$("body").append(exAlertModal);
 
	$('#btnAuto1').click(function(){
		var betMinAmount1 = 0.001;
		$('#mfpayoutmul').val('2x');
		$('#mfpayoutper').val('48.02%');
		
		// Chiến thuật x2
		start1(betMinAmount1, 1);
	});
	
	$('#btnAuto2').click(function(){
		var betMinAmount2 = 0.0001;
		$('#mfpayoutmul').val('4x');
		$('#mfpayoutper').val('24.01%');
		
		// Chiến thuật x4 (30 lần)
		start2(betMinAmount2, false, 1);
	});
	
	$('#btnAuto3').click(function(){
		var betMinAmount3 = 0.0001;
		$('#mfpayoutmul').val('4x');
		$('#mfpayoutper').val('24.01%');
		
		// Chiến thuật x4 mở rộng (tăng mức an toàn - đánh 1 lần thua 0$ trước khi bet thật)
		start3(betMinAmount3, false, 0, 1);
	});
//});
 
function start1(betMinAmount1, i) {
	var nStatus = checkStatus();
	if (checkReadyButton()) {
		if (nStatus > 0) { // reset
			$('#mfInputAmount').val(betMinAmount1);
			$('#mfpayout_over').click();
			++i;
		} else if (nStatus < 0) { // multiply
			betAmount = Number($('#mfInputAmount').val());
			if ((betAmount / betMinAmount1) >= 1024) {
				showAlertMessage();
			}
				
			$('#mfInputAmount').val(betAmount * 2);
		} else { // error bet
 
		}
		
		setTimeout(function(){
			$('#btnplaymb').click();
		}, 500);		
	}
	
	if (!isStop) {
		if (i > 100) {
			var betMinAmount2 = 0.0001;
			$('#mfpayoutmul').val('4x');
			$('#mfpayoutper').val('24.01%');
			
			// Chiến thuật x4 (30 lần)
			start2(betMinAmount2, false, 1);
		} else {
			var min = 1500;
			var max = 4000;
			var delayMil = Math.floor(Math.random() * (max - min + 1) + min);	
			setTimeout(function(){
				start1(betMinAmount1, i);
			}, delayMil);
		}
	}
}
 
function start2(betMinAmount2, isDouble, i) {	
	var nStatus = checkStatus();
	if (checkReadyButton()) {
		if (nStatus > 0) {
			$('#mfInputAmount').val(betMinAmount2);			
			isDouble = false;
			++i;
		} else if (nStatus < 0) {
			betAmount = Number($('#mfInputAmount').val());
			if ((betAmount / betMinAmount2) >= 4096) {
				showAlertMessage();
			}
			if (isDouble) {
				$('#mfInputAmount').val(betAmount * 2);
				isDouble = false;
			} else {
				$('#mfInputAmount').val(betAmount);
				isDouble = true;
			}
		} else { // error bet
			
		}
		
		setTimeout(function(){
			$('#btnplaymb').click();
		}, 500);		
	}
	
	if (!isStop) {
		if (i > 100) {
			var betMinAmount3 = 0.0001;
			$('#mfpayoutmul').val('4x');
			$('#mfpayoutper').val('24.01%');
			
			// Chiến thuật x4 mở rộng (tăng mức an toàn - đánh 1 lần thua 0$ trước khi bet thật)
			start3(betMinAmount3, false, 0, 1);
		} else {
			var min = 1500;
			var max = 4000;
			var delayMil = Math.floor(Math.random() * (max - min + 1) + min);	
			setTimeout(function(){
				start2(betMinAmount2, isDouble, i);
			}, delayMil);
		}
	}
}
 
function start3(betMinAmount3, isDouble, numStart, i) {	
	var nStatus = checkStatus();
	if (checkReadyButton()) {
		if (nStatus > 0) {
			$('#mfInputAmount').val(0);			
			isDouble = false;
			numStart = 0; // reset numStart
			++i;
		} else if (nStatus < 0) {
			if (numStart <= 0) {
				betAmount = Number($('#mfInputAmount').val());
				if (betAmount <= 0) {
					betAmount = betMinAmount3;
				}
				
				if ((betAmount / betMinAmount3) >= 4096) {
					showAlertMessage();
				}
				if (isDouble && numStart <= -2) {
					$('#mfInputAmount').val(betAmount * 2);
					isDouble = false;
				} else {
					$('#mfInputAmount').val(betAmount);
					isDouble = true;
				}
			} else {
				$('#mfInputAmount').val(0);
				isDouble = false;
			}
			
			numStart--;
		} else { // error bet
			
		} 
		
		setTimeout(function(){
			$('#btnplaymb').click();
		}, 300);		
	}
	
	if (!isStop) {
		if (i > 100) {
			var betMinAmount1 = 0.01;
			$('#mfpayoutmul').val('2x');
			$('#mfpayoutper').val('48.02%');
			
			// Chiến thuật x2
			start1(betMinAmount1, 1);
		} else {
			var min = 1500;
			var max = 4000;
			var delayMil = Math.floor(Math.random() * (max - min + 1) + min);	
			setTimeout(function(){
				start3(betMinAmount3, isDouble, numStart, i);
			}, delayMil);
		}
	}
}
 
function checkStatus() {
	var labelStatus = $('#mfplayresultout .label').html();
	var res = 0;
	if (labelStatus == undefined || labelStatus.indexOf('win') !== -1 || labelStatus.indexOf('thắng') !== -1) {
		res = 1;
	} else if (labelStatus.indexOf('lose') !== -1 || labelStatus.indexOf('thua') !== -1) {
		res = -1;
	}
	return res;
}
 
function timer(time,update,complete) {
    var start = new Date().getTime();
    var interval = setInterval(function() {
        var now = time-(new Date().getTime()-start);
        if( now <= 0) {
            clearInterval(interval);
            complete();
        }
        else update(Math.floor(now/1000));
    },100); // the smaller this number, the more accurate the timer will be
}
 
function showAlertMessage() {
	$('#exAlertModal').modal('show');
	timer(
		10000, // milliseconds
		function(timeleft) {
			$('#exTimer').html(timeleft+" second(s)");
		},
		function() { // what to do after
			$('#exAlertModal').modal('hide');
		}
	);
}
 
function stop() {
	isStop = true;
}
 
function checkReadyButton() {
	var btnValue = $('#btnplaymb').html();
	if (btnValue.indexOf('DICE') !== -1 || btnValue.indexOf('CƯỢC') !== -1) {
		return true;
	}
	return false;
}
}) ;}) ();