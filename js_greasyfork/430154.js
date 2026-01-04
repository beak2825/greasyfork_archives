// ==UserScript==
// @name         save usercenter properties
// @namespace    http://sinoiov.com/
// @version      0.1.3
// @description  save properties automaticly
// @author       longslee

// @exclude     https://sms.sinoiov.com*
// @exclude    http://smsp.4000966666.net*
// @include     http://*usercenter.sinoiov.com*
// @include     https://*usercenter.sinoiov.com*
// @require    http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430154/save%20usercenter%20properties.user.js
// @updateURL https://update.greasyfork.org/scripts/430154/save%20usercenter%20properties.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("<iframe id='session-refresh' width='0' height='0' style='display:none;'>").prependTo('body');

	$('#session-refresh').on("click",_save);
	
	

    function _sleep(n) { //n表示的毫秒数
            var start = new Date().getTime();
            while (true) if (new Date().getTime() - start > n) break;
        }
		
	function _save(){
		$(".ivu-btn[type=button]").each(function(i,e){
			if(e.innerText === '修改'){
				e.click();
				_sleep(1);
				
				$('.ivu-modal-footer').find('span').each(function(idx,_span){
					if(_span.innerText === '保存'){
						_span.click();
						console.log('save');
					}	
				});
			}
				
		});
	}	

	
	
	//document.getElementById('session-refresh').click()
    
})();