// ==UserScript==
// @name       Sephora 价格验证助手 for 天猫版
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  帮助运营团队上架产品时验证价格及提示异常,10.31-提供敏感词初检
// @author       Jacky Zhong
// @match        https://ipublish.tmall.com/tmall/*
// @grant        none
// @require      https://code.jquery.com/jquery-1.12.4.min.js

// @downloadURL https://update.greasyfork.org/scripts/389309/Sephora%20%E4%BB%B7%E6%A0%BC%E9%AA%8C%E8%AF%81%E5%8A%A9%E6%89%8B%20for%20%E5%A4%A9%E7%8C%AB%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/389309/Sephora%20%E4%BB%B7%E6%A0%BC%E9%AA%8C%E8%AF%81%E5%8A%A9%E6%89%8B%20for%20%E5%A4%A9%E7%8C%AB%E7%89%88.meta.js
// ==/UserScript==
console.log('start');
let illegalWords=["抗菌","抑菌","除菌","灭菌","防菌","消炎","抗炎","活血","解毒","抗敏","防敏",
				"脱敏","斑立","美白","最","级","特效","全效","强效","奇效","高效","速效","神效","超强","全面","全方位",
                  "最","第一","特级","顶级","冠级","特效","高效","全效","强效","速效",
				  "速白","一洗白","XX天见效","见效","超强","激活",
				  "全方位","全面","安全",
                  "无毒","溶脂","吸脂","燃烧脂肪","瘦身","瘦脸","瘦腿","减肥","延年益寿"];

let j = jQuery.noConflict(true);
j.holdReady(true);
setTimeout(function(){j.holdReady(false);},5000);
j(document).ready(function(){
    console.log('ready');
	//window.sephoraTool = new sephoraSkuTool($('.price'),335347)
		console.log('add button');
		var btnSpider = document.createElement('div');
        btnSpider.id = 'wk_btn';
        btnSpider.style='display:block;z-index:1999;position:fixed; right:10px;top:35%; width:60px; height:60px;line-height:30px; background-color:#f50;color:#fff;text-align:center;font-size:16px;font-family:"Microsoft YaHei","微软雅黑",STXihei,"华文细黑",Georgia,"Times New Roman",Arial,sans-serif;font-weight:bold;cursor:pointer';
        btnSpider.innerHTML='查&nbsp;&nbsp;询<br>价&nbsp;&nbsp;格';
        j('body').append(btnSpider);


		 j('#button-submit').attr("disabled",true);

		//j('.tm-sku-dialog-title').after('<button type="button" class="next-btn next-btn-normal next-btn-medium wk_price" >查询官网价格</button>')
		//console.log(j(".tm-sku-price"));
		j('.sell-o-custom-dlg-checkbox button').on('click',function(e){
			  
			  
			setTimeout(function(){

				//console.log(j('.sell-o-custom-base-checkbox').find("input")
				j('.sell-o-custom-base-checkbox').find("input").on('click',function(e){
					if(j(this).attr("aria-checked")=="false"){
						//console.log( j(this).attr("aria-checked"));
						let atext =  j(this).parent().parent().find(".next-checkbox-label").text();
						if(illegalWords.indexOf(atext)>=0){
							confirm("命中违禁词："+atext);
						}

					}
				});
				
				//j('.next-dialog-body').find(".select-all").parent().append("<button type='button' class='next-btn next-btn-normal next-btn-primary'>检查违禁词</button>")
				j('.next-dialog-body').find("button.next-btn-primary").on('click',function(e){
					let hitText = '';
					
					j(".sell-o-custom-base-checkbox").find("input").each(function(i){
					//console.log("index:"+i);
					//console.log( j(this).parent().parent().find(".next-checkbox-label").html());
						if(j(this).attr("aria-checked")=="true"){
							//console.log( j(this).attr("aria-checked"));
							let atext =  j(this).parent().parent().find(".next-checkbox-label").text();
							if(illegalWords.indexOf(atext)>=0){
								hitText = hitText + atext + " ";
							}

						}
						}
					);
					
					if(hitText.length>0){
						confirm("命中以下违禁词："+hitText);
					}
					
					
				});
				
				
				},1000);
			
			
			
		
		})

		

		//j("body").on('click','.sell-o-custom-base-checkbox input',function(e){
		//		console.log( j(this).attr("aria-checked"));
		//})
		 
        j('#wk_btn,button[clstag="pageclick|keycount|newWare|6"]').on('click',function(){
			
			j('.sell-o-custom-base-checkbox').find("input").on('click',function(){
			  console.log( j(this).attr("aria-checked"));
			});
			
			
			j('#button-submit').attr("disabled",false);
			//console.log(j(".tm-sku-price > input"));
			//console.log(j(".tm-sku-price"));
			j(".sepPrice").hide();

			j(".tm-sku-price").find("input").each(function(i){
				console.log("index:"+i);
				console.log(j(this).val());
				let jdSkuCode = j("input[label='商家编码']:eq("+i+")").val();
					validatePriceBySku(jdSkuCode,i,j(this));
				}
			);
			 //validatePrice();
        });

		 j('.next-btn next-btn-normal next-btn-medium common-value-btn').on('click',function(){
			j('.tm-sku-dialog-title').after('<button type="button" class="next-btn next-btn-normal next-btn-medium wk_price" >查询官网价格</button>')
        });

		j('.tm-sku-dialog-title').after('<button type="button" class="next-btn next-btn-normal next-btn-medium wk_price" >查询官网价格</button>')
		j(".tm-sku-price").find("input").on("blur",function(i){
			console.log("index:"+i);
			console.log(j(this).val());
			console.log(j(this).attr("data-spm-anchor-id"));
			let jdSkuCode = j("input[label='商家编码']:eq("+i+")").val();
			}
		);
	/*	j(document).on("blur", ".tm-sku-price", function () {
			let jdSkuIndex = j(".tm-sku-price").index(this);
			let jdSkuCode = j(".sell-o-input:eq("+jdSkuIndex+")").val();
			console.log(jdSkuIndex);
			console.log(jdSkuCode);
			//validatePriceBySku(jdSkuCode,jdSkuIndex);
		})*///ver-scroll-wrap
    console.log('end');
});


function validatePrice(index){

	 j("input[data-field='outerId']").each(function(i){
		let skuId= j(this).val();
		validatePriceBySku(skuId,i);
	 });


}

function validatePriceBySku(skuId,i,priceSelector){
	 let _priceText
	 if(skuId != ''){
		 getSkuDetail(skuId,i,priceSelector);
	 }else{
		_priceText = "<a class='sepPrice' style='color:black;font-size:12px;font-weight:normal'>官网:N/A</a>";
		j(".tm-o-sku-action:eq("+i+")").parent().after(_priceText);
	 }

	 //priceSelector.parent().parent().parent().parent().parent().after(_priceText);
}
function getSkuDetail(skuId,i,priceSelector){
		  //{"timeStamp":1566472664302,"status":0,"results":{"originalPrice":330.0,"inv":1998},"errorCode":null,"errorMessage":null}
		  j.get({
		  url: "https://api.sephora.cn/v2/product/sku/inv-price/"+skuId,
		  dataType: "json",
		  success: function( result ) {
			let _priceText='';
			if(result.errorCode == null){
			    let _price = result.results.originalPrice;
					 let jdPrice = priceSelector.val();
					 if(jdPrice < _price){
						 _priceText= "<a href='https://www.sephora.cn/product/"+ skuId +".html'  class='sepPrice' target='_blank' style='color:red;font-size:12px;font-weight:bold'>官网:"+_price+ "</a> ";
						 priceSelector.css("background-color","#FFFF99");
						 if(confirm("提示：SKU:"+skuId+",目前设置价格"+jdPrice+"低于官网价格"+_price+",取消跳转至SKU")){

						 }else{
							 j("html,body").animate({scrollTop: j(".tm-sku-dialog-title").offset().top-100}, 1000);
							//return false;
						 };
					 }else{
						 _priceText= "<a class='sepPrice'  href='https://www.sephora.cn/product/"+ skuId +".html' target='_blank' style='color:black;font-size:12px;font-weight:normal'>官网:"+_price+ "</a> ";
					 }
			}else{
				 _priceText = "<a class='sepPrice' style='color:black;font-size:12px;font-weight:normal'>官网:N/A</a>";
				 //return "N/A"
			}
			j(".tm-o-sku-action:eq("+i+")").parent().after(_priceText);

		  }
		});
}

function setConfiguration(){
	localStorage.setItem("api_service","product")//product,pim
}

console.log('complete');