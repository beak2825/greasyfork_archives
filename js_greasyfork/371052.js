// ==UserScript==
// @name         E仲裁fix
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @include        *://sz12333.gov.cn*
// @grant        unsafeWindow
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/371052/E%E4%BB%B2%E8%A3%81fix.user.js
// @updateURL https://update.greasyfork.org/scripts/371052/E%E4%BB%B2%E8%A3%81fix.meta.js
// ==/UserScript==

(function() {
    'use strict';



            unsafeWindow.writeRequestItem = function(cez010,cee004,aaa146) {
                if(notSelf == 1){
                    mui.alert("您只能修改自己的信息");
                }else{
                    if( "check_box" ==  $('span[onClick*='+cez010+']').attr('class') ) {
                    // if("check_box" == $('#control'+cee004).attr('class')){
                        window.location.href= '/ldzcfw/pages/jsp/wxJt/addRequestItemJt1.jsp?cez010='+cez010+'&cez001='+cez001+'&aac001=' + aac001+'&cee004='+cee004+'&aaa146='+escape(encodeURI(aaa146))+'&isQrcode='+isQrcode;
                    }else if("check_box1" == $('#control'+cee004).attr('class')){
                        deleteRequestItem(cez010,cee004);
                    }
                }
            };

		unsafeWindow.queryRequestItem = function(){
			var param =  "cez001="+cez001+"&cec037="+aac001;
			$.ajax({
					url:'/ldzcfw/ldzc/f14010100/f14010101/queryRequestItemlistById',
					type: 'post',
					data: param,
					success:function(text){
						var json =  eval("("+text+")");
						var vo = json.result[0];
						var size =vo.requestItemsDto;
						count = size.length;
						if(size != null && size != "" && size != "undefined" && size != 0){
							for (var i = 0; i < size.length; i++) {
                                console.log(size[i].cez010);
                                $('span[onClick*='+size[i].cez010+']').removeClass("check_box").addClass("check_box1");
								//document.getElementById("control"+size[i].cee004).className = "check_box1";
							}
						}
					},
					error:function(e,f,g){
						var json = eval("("+e,responseText+")");
						alert(json.errors[0].msg);
					}
			});
		};
    // Your code here...
})();