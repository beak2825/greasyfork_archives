// ==UserScript==
// @name         ReCaptchaV2Solver
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371766/ReCaptchaV2Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/371766/ReCaptchaV2Solver.meta.js
// ==/UserScript==

//in the main app
//url, any

var btFind = undefined;
var nP = 0;
console.log("Running in "+location.href);
var key = '30d58d97ea9e0692d3ad35c72be15988';

if(window.jQuery === undefined) {
    let sc = document.createElement('script');
    sc.src = "https://code.jquery.com/jquery-3.3.1.min.js";
    sc.onload = mmain();
    document.head.appendChild(sc);
} else {
    mmain();
}

function mmain(){
        //if( document.querySelector('iframe[src*="https://www.google.com/recaptcha"]') !== null) {
        if( document.querySelectorAll('script[src*="/recaptcha/api"]').length > 0) {
            console.log('Found captcha at ['+location.href+']');
            beginMain();
        } else {
            console.log('Not found captcha at ['+location.href+']...');
        }
        if( location.href.indexOf("https://www.google.com/recaptcha/api2/bframe") !== -1) {
            if(document.readyState === 'complete') beginif();
            else
            document.addEventListener('DOMContentLoaded', function() {
                beginif();
            }, false);
        }
    }

function beginMain(){
    console.log('ifmain at ['+location.href+']');
    window.addEventListener('message', function (event) {
        let data = validJSON(event.data);
        if( !data ) { return false; }
        if( data.appName === 'BRV2' ){
            console.log('::'+data.action+'::...');
            switch(data.action){
                case 'login':
                    console.log('login');
                    if(typeof login === 'function'){
                        login();
                    } else {
                        grecaptcha.execute();
                    }
                    break;
                case 'loginButton':
                    window.parent.document.querySelector('[data-sitekey][data-callback]').click();
                    break;
                case 'resolve':
                    console.log('Resolving...');
                    var btForm = document.querySelector('#g-recaptcha-response').form;
                    btFind = btForm.querySelector('button.g-recaptcha') || btForm.querySelector('input[type="submit"]');
                    updateState("Solving Captcha");
                    var siteKey = window.parent.document.querySelector('[data-sitekey]').getAttribute('data-sitekey');
                    if(siteKey){
                        resolveRV2(siteKey,data.referrer);
                    } else {
                        console.log('!!No se ha encontrado un data-sitekey!!');
                    }
                    break;
            }
        }
        console.log(event.data);
    });
}

function updateState(text,complete){
    if(btFind !== undefined){
        if(nP>2) nP = 0; else nP++;
        let oldText = '';
        if(btFind.tagName.toLowerCase() === 'input')  oldText = btFind.value.split(' | ')[0];
        else  oldText = btFind.innerText.split(' | ')[0];
        btFind.innerText = oldText + ' | ' + text + (!complete?'.'.repeat(nP+1):'');
        btFind.value = oldText + ' | ' + text + (!complete?'.'.repeat(nP+1):'');
        document.title = text + '.'.repeat(nP+1);
    }
}

function resolveRV2(siteKey,referrer){
	jQuery.ajax({
		type: 'get',
		url: '//2captcha.com/in.php?key='+key+'&method=userrecaptcha&googlekey='+siteKey+'&pageurl='+referrer+'&here=now&header_acao=1',
		success: function(res){
            console.log("Response OK, from server");
			if(res.indexOf('OK') !== -1){
				let idc = res.split('|')[1];
                waitForResponse(idc);
			}
		}
	});
}

function waitForResponse(idc){
	jQuery.ajax({
		type: 'get',
		url: '//2captcha.com/res.php?key='+key+'&action=get&id='+idc+'&header_acao=1',
		success: function(res){
            console.log("Response OK2, from server");
			if(res.indexOf('OK') !== -1){
                updateState("Captcha SOLVED!",true);
                var dc = btFind.getAttribute('data-callback');
                console.log('DC: '+dc+'..');
                if(dc != null && dc != false && dc != "") btFind.onmousedown = eval('(function(e){e.preventDefault(); '+dc+'(); return false;})');
				let grespon = res.split('|')[1];
				let espa = document.querySelector('#g-recaptcha-response');
				if(espa){
					espa.innerHTML = grespon;
                    if(typeof espa.form.submit === 'function') {
                        //espa.form.submit();
                    } else {
                        //espa.form.submit.click();
                    }
					console.log('Listo para enviar!!');
				} else {
					console.log('Error: no input g-recaptcha-response is found...');
				}
			} else {
                updateState("Solving Captcha");
				console.log('NoText: '+res);
				setTimeout(waitForResponse.bind(null,idc),1000);
			}
		}
	});
}

function validJSON(str) {
    try {
        let o = JSON.parse(str);
        if (o && typeof o === "object") {
        	return o;
        }
    } catch (e) {
        return false;
    }
    return false;
}

//in the recaptcha frame app
//url: https://www.google.com/recaptcha/api2/bframe?hl=es&v=v1535045166622&k=6LffhRwUAAAAAITb0t7JYnJCvJU6CgPgGKvTL-sX&cb=q7jh3ucr064i
//urlparse: https://www.google.com/recaptcha/api2/bframe?hl=*&v=*&k=*&cb=*

function beginif(){
	window.addEventListener('message', function (event) {
	let data = validJSON(event.data);
	if( !data ) { return false; }
	if( data.appName === 'BRV2' ){
        switch(data.action){

        }
    }
    });
    setTimeout(nextToIf,1000);
}

function nextToIf(){
    console.log('nextToIf..',document.querySelectorAll('.rc-footer').length > 0,document.querySelectorAll('.rc-footer'));
    let rv2 = document.querySelector('#rc-imageselect') === null;
	let rv2f = document.querySelectorAll('.rc-footer').length > 0;
    let rv3f = document.querySelectorAll('.rc-anchor').length > 0;
    window.parent.postMessage(JSON.stringify({appName: 'BRV2', action: 'resolve', referrer: document.referrer}),document.referrer);
    /*if(rv2f){
        console.log('Login from frame..');
        window.parent.postMessage(JSON.stringify({appName: 'BRV2', action: 'login'}),document.referrer);
    } else {
        console.log("Send to solving");
        window.parent.postMessage(JSON.stringify({appName: 'BRV2', action: 'resolve', referrer: document.referrer}),document.referrer);
    }*/
}

function waitForc(){
    if(document.querySelector('#rc-imageselect') !== null){
        window.parent.postMessage(JSON.stringify({appName: 'BRV2', action: 'resolve', referrer: document.referrer}),document.referrer);
    }
}