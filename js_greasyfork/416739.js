// ==UserScript==
// @name         试客巴免手续费专区批量申请
// @namespace    http://ziyuand.cn/
// @version      0.3
// @description  免手续费专区批量自动申请
// @author       SHERWIN
// @match        https://wx.shike8888.com/special/feeFree
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416739/%E8%AF%95%E5%AE%A2%E5%B7%B4%E5%85%8D%E6%89%8B%E7%BB%AD%E8%B4%B9%E4%B8%93%E5%8C%BA%E6%89%B9%E9%87%8F%E7%94%B3%E8%AF%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/416739/%E8%AF%95%E5%AE%A2%E5%B7%B4%E5%85%8D%E6%89%8B%E7%BB%AD%E8%B4%B9%E4%B8%93%E5%8C%BA%E6%89%B9%E9%87%8F%E7%94%B3%E8%AF%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
$('#banner').on("tap",function(event){
getid();
});
 console.log('点击banner开始批量申请');
function getid(){

	var goodsid=prompt("请输入商品ID(例：123,456,789)逗号为英文：");

		if(goodsid.text==""){
             getid();
		    console.log('请输入商品id');

		}else{

		    var numList = goodsid.split(',');
			console.log(numList);
			console.log(numList.length);
			for(var i=0;i<=numList.length;i++){
			//console.log(i);
				var data = {act_id:numList[i],type:"2"};
			    $.toAjax({
			        url:"/apply/insertNewApply",
			        data:data,
			        type:"post",
			        success:function (data) {
			            if (data.code == 1) {
			                //window.location.href="/apply/applySuccess?applyId="+data.applyId;
			                console.log('申请成功！');

			            }else{
			               console.log(data.msg);
			            }
			        }
			    });


			}
		    }
		    };
     $.toAjax({
                url:"/activity/freePrivilege",
                data:{page:'1',size:300},
                success:function (res) {
                    if (res.code == 1){
                            var len=res.data.length;
                        for(var j=0;j<=len;j++){
                            var product_name=res.data[j]['product_name'];
                            var act_id=res.data[j]['act_id'];
                            var margin=res.data[j]['margin'];
                            console.log(j+" 产品名称："+product_name+"；活动id："+act_id+"；价格："+margin);
}
                    }
                },
                error:function (err) {
                }
            })
})();