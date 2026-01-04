// ==UserScript==
// @name       Sephora 价格验证助手(JD版)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  帮助运营团队上架产品时验证价格及提示异常
// @author       Jacky Zhong
// @match        https://ware.shop.jd.com/rest/shop/ware/publish3/*
// @grant        none
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/389308/Sephora%20%E4%BB%B7%E6%A0%BC%E9%AA%8C%E8%AF%81%E5%8A%A9%E6%89%8B%28JD%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/389308/Sephora%20%E4%BB%B7%E6%A0%BC%E9%AA%8C%E8%AF%81%E5%8A%A9%E6%89%8B%28JD%E7%89%88%29.meta.js
// ==/UserScript==
console.log('start');
let j = jQuery.noConflict(true);
$(document).ready(function(){
    console.log('ready');
	//window.sephoraTool = new sephoraSkuTool($('.price'),335347)
		console.log('add button');
		var btnSpider = document.createElement('div');
        btnSpider.id = 'wk_btn';
        btnSpider.style='display:block;z-index:999;position:fixed; right:10px;top:25%; width:60px; height:60px;line-height:30px; background-color:#f50;color:#fff;text-align:center;font-size:16px;font-family:"Microsoft YaHei","微软雅黑",STXihei,"华文细黑",Georgia,"Times New Roman",Arial,sans-serif;font-weight:bold;cursor:pointer';
        btnSpider.innerHTML='查&nbsp;&nbsp;询<br>价&nbsp;&nbsp;格';
        j('body').append(btnSpider);
		//j("input[data-field='jdPrice']:eq(1)").on('blur',function(){
			//console.log(j("input[data-field='jdPrice']").index(this));
			//validatePrice();
		//});
		 j('button[clstag="pageclick|keycount|newWare|6"]').attr("disabled",true);
		 
        j('#wk_btn,button[clstag="pageclick|keycount|newWare|4"],button[clstag="pageclick|keycount|newWare|5"],button[clstag="pageclick|keycount|newWare|6"]').on('click',function(){
			 j('button[clstag="pageclick|keycount|newWare|6"]').attr("disabled",false);
			 validatePrice();
			 
        });
		j(document).on("blur", "input[data-field='jdPrice']", function () {
			let jdSkuIndex = j("input[data-field='jdPrice']").index(this)-1;
			let jdSkuCode = j("input[data-field='outerId']:eq("+jdSkuIndex+")").val();
			validatePriceBySku(jdSkuCode,jdSkuIndex);			
		})
		
		

	

		
		 
    console.log('end');
});


function validatePrice(index){
	 j(".sepPrice").hide();
	 j("input[data-field='outerId']").each(function(i){
			let skuId= j(this).val();
			validatePriceBySku(skuId,i);
	 }); 
}  

function validatePriceBySku(skuId,i){
	 let _priceText
	 if(skuId != ''){
		 let _price = getSkuDetail(skuId,i);
	 }else{
		_priceText = "<div class='sepPrice' style='color:black;font-size:14px;font-weight:normal'>官网:N/A</div>";
		 j("input[data-field='jdPrice']:eq("+(i+1)+")").after(_priceText);
	 }
}
function getSkuDetail(skuId,i){
	 
		j.get({
		  url: "https://api.sephora.cn/v2/product/sku/inv-price/"+skuId,
		  dataType: "json",
		  success: function( result ) {
			let _priceText='';
			if(result.errorCode ==null){
				 let _price = result.results.originalPrice;
				 let jdPrice = j("input[data-field='jdPrice']:eq("+(i+1)+")").val();
				 if(jdPrice < _price){
					 _priceText= "<div class='sepPrice' ><a href='https://www.sephora.cn/product/"+ skuId +".html' target='_blank' style='color:red;font-size:14px;font-weight:bold'>官网:"+_price+ "</a></div>";
					 j("input[data-field='jdPrice']:eq("+(i+1)+")").css("background-color","#FFFF99");
					 if(confirm("提示：SKU:"+skuId+",目前设置价格"+jdPrice+"低于官网价格"+_price+",取消跳转至SKU")){
						 
					 }else{
					
						 j("html,body").animate({scrollTop: j("#table-sku-container").offset().top-100}, 1000);
						//return false;
					 };
				 }else{
					 _priceText= "<div class='sepPrice' ><a href='https://www.sephora.cn/product"+ skuId +".html' target='_blank' style='color:black;font-size:14px;font-weight:normal'>官网:"+_price+ "</a></div>";
				 }
			}else{
				 let _price = "N/A"
				 _priceText = "<div class='sepPrice' style='color:black;font-size:14px;font-weight:normal'>官网:N/A</div>";
				
				 
			}
		  j("input[data-field='jdPrice']:eq("+(i+1)+")").after(_priceText);
		  }
		});

}

function setConfiguration(){
	$.cookie('the_cookie', 'the_value', { expires: 7, path: '/' });
}	
	
	
console.log('complete');