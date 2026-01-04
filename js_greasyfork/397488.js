// ==UserScript==
// @name         CMCCZJ
// @namespace    warden
// @version      0.0.1
// @description  浙江中国移动
// @author       Warden
// @match        ccs.chnl.zj.chinamobile.com/*
// @grant        unsafeWindow
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/397488/CMCCZJ.user.js
// @updateURL https://update.greasyfork.org/scripts/397488/CMCCZJ.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log('Hooked!');
    var btn = document.getElementById('searchCustInfo');
    var showMes = function() {
        setTimeout(function(){
			Rose.ajax.getJson(unsafeWindow.dataArray.loadCustOffers,{BUSINESS_ID:"1",BUSI_TYPE:"0"}, function(json,status){
				if(status){
					art.dialog.data('json', json);
				}else{
                    console.log('错误!');
				}
                $("#personal-recomm").after('<div class="ui-grid-line fn-hide" style="display: block;"><div class="ui-box"><div class="ui-box-head"><div class="ui-box-head-border"><i class="ui-box-head-icon ui-box-icon-01"></i><h3 class="ui-box-head-title">已订业务</h3></div></div><div class="ui-box-container"><div class="ui-box-content" style="padding: 0px;"><div class="ui-list-icon ui-list-float-recom fn-clear" id="slides" style="padding: 0px;"><iframe scrolling="yes" frameborder="0" marginheight="0" allowtransparency="true" marginwidth="0" border="0" src="https://ccs.chnl.zj.chinamobile.com/business?service=page/ydyw" style="width: 786px; height: 380px;"></iframe></div></div></div></div></div>');
			})
        }, 500);
    };
    btn.addEventListener('click', showMes);
})();