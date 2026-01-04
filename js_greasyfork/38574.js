// ==UserScript==
// @name         capacty
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  lol
// @author       murat
// @match        https://oibs2.metu.edu.tr/View_Course_Capacity_158/main.php
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @downloadURL https://update.greasyfork.org/scripts/38574/capacty.user.js
// @updateURL https://update.greasyfork.org/scripts/38574/capacty.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var c = document.getElementsByName('text_img_number')[0];
	var s = document.getElementsByName('submit_search')[0];
	var img = document.getElementsByTagName('img')[1];
	var imgsrc = img.src;
	var stop = false;
	c.value = '';
	c.focus();
	s.disabled = false;
	$('form')[0].acceptCharset = 'utf-8';

	c.onkeyup = function() {
		if(c.value.length >= 6){
			s.disabled = false;
			s.click();
		}
	};

	if (sessionStorage.length < 3){
		sessionStorage.setItem('total', 0);
		sessionStorage.setItem('valids', 0);
		sessionStorage.setItem('time1', new Date()/1000);
	} else{
		var total = sessionStorage.getItem('total');
		var valids = sessionStorage.getItem('valids');
		var time1 = sessionStorage.getItem('time1');
		var time = ((new Date()/1000) - time1).toFixed(1);
		if (!document.getElementsByClassName('alert alert-danger').length){
			valids++;
			sessionStorage.setItem('valids', valids);
		}
		total++;
		sessionStorage.setItem('total', total);
		var feed = valids + ' / ' + total + ' --- ' + time;
		console.log(feed);

		/*if( total > 99){
            alert(feed);
            sessionStorage.setItem('total', 0);
            sessionStorage.setItem('valids', 0);
            sessionStorage.setItem('time1', new Date()/1000);
        }*/
	}

	var clickEvent = new MouseEvent("click", {
		//"view": window,
		"bubbles": true,
		"cancelable": false
	});


	var sendData = function (a) {
		var response = GM_xmlhttpRequest({
			method: 'POST',
			url: 'http://localhost:9910/solveCAP/getResult',
			headers: {
				"Content-Type": "application/json"
			},
			data: JSON.stringify({
				'nargout': 1,
				'rhs': [imgsrc]
			}),
			onload: function(response) {
				var result = JSON.parse(response.responseText);
				console.log(result);
				if('lhs' in result){
					if (c.value.length == 0 && !stop){
						c.value = result.lhs[0].mwdata;
						s.disabled = false;
						setTimeout(function(){ s.dispatchEvent (clickEvent); }, 100);
						//s.click();
					}
				}else {
					c.value = '999999';
					s.click();
				}

				console.log( "Status: " + request.status);
			}
		});
	};
	sendData();

	$(document).keyup(function(e) {
		if ( e.keyCode === 113 ){ // f2
			sessionStorage.clear();
			console.log('stop');
			stop = true;
		}
	});

	img.onclick = function(){
		sessionStorage.clear();
		stop = true; //!s.disabled;
		//s.click();
	};

	var request = new XMLHttpRequest();
	var url = "http://localhost:9910/solveCAP/getResult";
	var params = {"nargout":1, "rhs": [imgsrc]};
	request.open("POST", url);
	request.setRequestHeader("Content-Type", "application/json");
	request.onload = function()
	{
		if (request.status == 200)
		{
			var result = JSON.parse(request.responseText);
			console.log(result);
			if('lhs' in result)
			{
				var res = result.lhs[0].mwdata;
				if (c.value.length == 0){
					c.value = res;
					s.disabled = false;
					setTimeout(function(){ s.dispatchEvent (clickEvent); }, 100);
				}
			}
			else { console.log('error');
				  c.value = '000000';
				  s.disabled = '';
				  setTimeout(function(){ s.dispatchEvent (clickEvent); }, 100);
				 }
		}
		console.log( "Status: " + request.status + "<br>" +
					"Status message: " + request.statusText + "<br>" +
					"Response text: " + request.responseText);
	};
	//request.send(JSON.stringify(params));

})
();
