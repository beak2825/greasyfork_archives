// ==UserScript==
// @name         试客巴批量定时申请
// @namespace    http://ziyuand.cn
// @version      0.2
// @description  批量定时申请
// @author       SHERWIN
// @match        *.shike8888.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416835/%E8%AF%95%E5%AE%A2%E5%B7%B4%E6%89%B9%E9%87%8F%E5%AE%9A%E6%97%B6%E7%94%B3%E8%AF%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/416835/%E8%AF%95%E5%AE%A2%E5%B7%B4%E6%89%B9%E9%87%8F%E5%AE%9A%E6%97%B6%E7%94%B3%E8%AF%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('#search_goods').append('<p style="width:120px;height:40px;margin:0 auto;color:white;background-color:red; z-index:999;text-align:center;line-height:40px;"id="dingshishenqin" >批量定时申请</p>');

     $('#dingshishenqin').on("tap",function(event){
         getid();
     });

var numList='';
console.log('点击批量定时申请开始设置ID');
var j=0;
function getid(){
    var goodsid=prompt("请输入商品ID(例：123,456,789)逗号为英文：");
    numList = goodsid.split(',');
	console.log(numList);
		if(goodsid.text==""){
             getid();
		    console.log('请输入商品id');

		}else{
            console.log("定时申请已准备就绪，将在每个整点自动申请");
            setInterval(function() {
                var Time=new Date();
                var Hours=Time.getHours ();
                var Minutes=Time.getMinutes();
                var Seconds=Time.getSeconds();
                if(Hours<='23'&& Minutes=='00'&& (Seconds=='00'||Seconds<'03')){
                    j++;
                    console.log("------------------开始第"+j+"次申请----------------------");
                    applystart();
                }
            }, 50);

		    }
		    };

function applystart(){
			//console.log(numList.length);
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

})();