// ==UserScript==
// @name         이랜드 페이북 매크로
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  tryㅇㅇ
// @author       You
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436942/%EC%9D%B4%EB%9E%9C%EB%93%9C%20%ED%8E%98%EC%9D%B4%EB%B6%81%20%EB%A7%A4%ED%81%AC%EB%A1%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/436942/%EC%9D%B4%EB%9E%9C%EB%93%9C%20%ED%8E%98%EC%9D%B4%EB%B6%81%20%EB%A7%A4%ED%81%AC%EB%A1%9C.meta.js
// ==/UserScript==

var simulateClick = function (elem) {
	// Create our event (with options)
	var evt = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
		view: window
	});
    // If cancelled, don't dispatch our event
    var canceled = !elem.dispatchEvent(evt);
};


var macro0 = setInterval(function() {
    if (/lgdacom\.net/.test (location.hostname) ) {
        var someLink = document.querySelector('.checkbox.border');
        simulateClick(someLink);

        var nextbtn = document.querySelector('#LGD_TERMS_NEXT');
        var attr = nextbtn.hasAttribute('disabled');

        if(attr === false){
            clearInterval(macro0);
            simulateClick(nextbtn);
            simulateClick(document.getElementsByName('페이북')[0]);
            simulateClick(document.querySelector('#LGD_NEXT'));
        }
    }else if(/vpay\.co\.kr/.test (location.hostname) ){
        if(document.getElementById('appPay')){
            clearInterval(macro0);
            payApp();
            console.log("페이북");
        }
    }
}, 100);