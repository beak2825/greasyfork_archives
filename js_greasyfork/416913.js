// ==UserScript==
// @name         试客巴单品二次申请
// @namespace    http://ziyaund.cn
// @version      0.1
// @description  二次申请免做任务
// @author       SHERWIN
// @match       *.shike8888.com/task/taskOne*
// @match       *.shike8888.com/task/taskTwo*
// @match       *.shike8888.com/task/taskThree*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416913/%E8%AF%95%E5%AE%A2%E5%B7%B4%E5%8D%95%E5%93%81%E4%BA%8C%E6%AC%A1%E7%94%B3%E8%AF%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/416913/%E8%AF%95%E5%AE%A2%E5%B7%B4%E5%8D%95%E5%93%81%E4%BA%8C%E6%AC%A1%E7%94%B3%E8%AF%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

     var data = { apply_id:apply_id,c_product_img:'', c_shop_img:'' }
mui.ajax('/task/doTask',{
					 data:data,
					 dataType:'json',
					 type:'post',
					 success:function(ret){
						 if (ret.code == 1) {
							 mui.alert('提交申请成功！',function () {
                                 history.go(-1);

                             })
						 }else{
							 mui.alert(ret.msg);
						 }
					 }
				 });
})();