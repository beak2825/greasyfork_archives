// ==UserScript==
// @name         free jf 1
// @namespace    http://tampermonkey.net/
// @version      0.19
// @description  free get jf
// @author       Me
// @include      https://*.189.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386576/free%20jf%201.user.js
// @updateURL https://update.greasyfork.org/scripts/386576/free%20jf%201.meta.js
// ==/UserScript==

+function() {
    'use strict';
    //https://m.sc.189.cn/handlecloud-page/point/index01.html?fastcode=20000335&cityCode=sc

    window.alert=function(msg){
        console.log(msg);
    }


    document.getElementById('current_qdljf').setAttribute('style','color: white; width: 162px;');
    document.getElementById('current_lqdsx').setAttribute('style','display:none;');

    var idx = 10;
    _dododo();

     function _dododo(){
     	// 创建观察者
     	let observer = new window.MutationObserver(function(records){
     		records.map(function(record) {
		        console.log('Previous attribute value: ' + record.oldValue);
		        if(record.oldValue == 'color: white; width: 162px; display: none;'){
		        	record.target.setAttribute('style','color: white; width: 162px;');
		        }else{
                    //console.log(record.target);
                    idx--;
                    if(idx>0){
                        document.getElementById('current_lqdsx').setAttribute('style','display:none;');
                        if(record.target.style.display == 'none'){
                            record.target.style.display = 'block';
                           }
                        record.target.click();
                        sleep(5000);
                    }

                }
		    });
     	});

     	let option = {
     		'attribute': true,
    			'attributeOldValue': true
     	}
		// 观察的对象
		let gcdx = document.getElementById('current_qdljf');
		if(gcdx != null){
			console.log('yes!');
			observer.observe(gcdx,option);
		}

//		let ifr = document.getElementById('bodyIframe');
//		if(ifr!=null){
//			let gcdx = ifr.contentWindow.document.getElementById('current_qdljf');
//			if(gcdx != null){
//				observer.observe(gcdx,option);
//			}
//		}
     }

    function sleep(numberMillis) {
        var now = new Date();
        var exitTime = now.getTime() + numberMillis;
        while (true) {
            now = new Date();
            if (now.getTime() > exitTime) return;
        }
    }

     function _takeit(){
     }
}();