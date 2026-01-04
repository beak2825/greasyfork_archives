// ==UserScript==
// @name         sctce+考试-xdgp.net
// @namespace    代刷VX：shuake345
// @version      0.1
// @description  自动考试|手动提交|代刷VX：shuake345
// @author       代刷VX：shuake345
// @match        https://www.xdgp.net/*
// @match        https://www.sctce.cn/apph5/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467653/sctce%2B%E8%80%83%E8%AF%95-xdgpnet.user.js
// @updateURL https://update.greasyfork.org/scripts/467653/sctce%2B%E8%80%83%E8%AF%95-xdgpnet.meta.js
// ==/UserScript==

(function() {
	'use strict';

    function JK() {
    $(document).ready(function() {
       'use strict';
		var host = window.location.host;
        var itemName = '';//$(document).attr('title');
        //var itemId = '';
        var Url = 'https://django.taobaocoupon.1143438227845072.cn-shenzhen.fc.devsapp.net/api'
        var link = window.location;
		// alert(link);
		if (host == 'item.taobao.com') {
            itemName = document.title;
            //alert(itemName)
            //console.log(itemId)
            //console.log(itemName.split("-")[0])
            itemName = itemName.split("-")[0]
            $.getJSON(Url,{itmename:itemName},function(data){
                if(data.reslut == '200'){
                    console.log(data)
                    $('.tb-action').append('<a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;margin-left:10px" href="'+ encodeURI(data.item_coupon_url) +'" " target="_blank">'+ encodeURI(data.coupon_yun) +'优惠券</a>');
                }else if(data.reslut == '0'){
                    $('.tb-action').append('<a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;margin-left:10px" href="/" " target="_blank">暂无可用优惠券</a>');
                }
            });
		}else if(host == 'detail.tmall.com'){
            //itemId = $(location).attr("href");
            //itemId = itemId.split("id=")[1];
            //itemId = itemId.split("&")[0];
            itemName = document.title;
            //alert(itemName)
            //console.log(itemId)
            //console.log(itemName.split("-")[0])
            itemName = itemName.split("-")[0]
            $.getJSON(Url,{itmename:itemName},function(data){
                console.log(data)
                if(data.reslut == '200'){
                    //console.log(data)
                    $('.MCDelivery').before('<div class="tb-action" style="margin-top:10px"><a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;width:156px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;" href="'+ encodeURI(data.item_coupon_url) +'" " target="_blank">'+ encodeURI(data.coupon_yun) +'优惠券</a></div>');
                }else if(data.reslut == '0'){
                    //console.log(data)
                    $('.MCDelivery').before( '<div class="tb-action" style="margin-top:10px"><a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;width:156px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;" href="/" " target="_blank">暂无可用优惠券</a></div>');
                }
            });
        }else if(host == 'chaoshi.detail.tmall.com'){
            //itemId = $(location).attr("href");
            //itemId = itemId.split("id=")[1];
            //itemId = itemId.split("&")[0];
            itemName = document.title;
            //alert(itemName)
            //console.log(itemId)
            //console.log(itemName.split("-")[0])
            itemName = itemName.split("-")[0]
            console.log(itemName)
            $.getJSON(Url,{itmename:itemName},function(data){
                console.log(data)
                if(data.reslut == '200'){
                    //console.log(data)
                    $('.MCDelivery').before('<div class="tb-action" style="margin-top:10px"><a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;width:156px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;" href="'+ encodeURI(data.item_coupon_url) +'" " target="_blank">'+ encodeURI(data.coupon_yun) +'优惠券</a></div>');
                }else if(data.reslut == '0'){
                    //console.log(data)
                    $('.MCDelivery').before( '<div class="tb-action" style="margin-top:10px"><a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;width:156px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;" href="/" " target="_blank">暂无可用优惠券</a></div>');
                }
            });
        }else if(host == 'detail.tmall.hk'){
            itemName = document.title;
            //alert(itemName)
            //console.log(itemId)
            //console.log(itemName.split("-")[0])
            itemName = itemName.split("-")[0]
            $.getJSON(Url,{itmename:itemName},function(data){
                console.log(data)
                if(data.reslut == '200'){
                    //console.log(data)
                    $('.MCDelivery').before('<div class="tb-action" style="margin-top:10px"><a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;width:156px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;" href="'+ encodeURI(data.item_coupon_url) +'" " target="_blank">'+ encodeURI(data.coupon_yun) +'优惠券</a></div>');
                }else if(data.reslut == '0'){
                    //console.log(data)
                    $('.MCDelivery').before( '<div class="tb-action" style="margin-top:10px"><a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;width:156px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;" href="/" " target="_blank">暂无可用优惠券</a></div>');
                }
            });
        }else if(host == 'detail.liangxinyao.com'){
            itemId = $("link[rel=canonical]").attr("href");
            itemId = itemId.split("id=")[1];
            itemName = $('meta[name=keywords]').attr('content');
            $.getJSON(Url,{itmename:itemName,id:itemId},function(data){
                if(data.reslut == '200'){
                    $('.tb-sku').append('<div class="tb-action" style="margin-top:0"><a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;width:156px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;" href="'+ encodeURI(data.item_coupon_url) +'" " target="_blank">'+ encodeURI(data.coupon_yun) +'优惠券</a></div>');
                }else if(data.reslut == '0'){
                    $('.tb-sku').append( '<div class="tb-action" style="margin-top:0"><a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;width:156px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;" href="/" " target="_blank">暂无可用优惠券</a></div>');
                }
            });
        }
      });
}
    function QT(){
    var d1=document.querySelector('div#app>div')
    var img=document.createElement("img");
    img.style="width:230px; height:230px;"
    img.src="https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";
    d1.appendChild(img);
    }
    setTimeout(QT,5424)
    
	var daan = ["dd13bfd5-1b24-4120-b36b-b00900e8cf62", "57a9ec64-af7e-4a35-b248-b00900e8cf62", "420a8ad8-678b-4a0a-8252-b00900e8cf62", "f681e406-4a11-4e57-833b-b00900e8cf62", "cecf6bc5-e2a8-46bb-a84a-b00900e8cf62", "b45b34bc-3b44-4817-ae06-b00900e8cf62", "7463367a-c1ba-4d2b-a1ff-b00900e8cf62", "cc0d6c37-fa7a-4a46-8562-b00900e8cf62", "52450363-536f-4a03-bc33-b00900e8cf62", "cefb50af-d56a-4de1-b872-b00900e8cf62", "81d6810b-140d-42cd-af1a-b00900e8cf62", "6e012398-39cf-4075-bb99-b00900e8cf62", "2583c9ba-9388-4d92-8358-b00900e8cf62", "a7de2c24-1fd0-4c29-96b7-b00900e8cf62", "745226ca-e3da-443f-8c4f-b00900e8cf62", "22307043-4a22-43fa-8db6-b00900e8cf62", "b731ad3b-a07a-4906-8549-b00900e8cf62", "5ff3b361-dbc8-40d0-a833-b00900e8cf62", "fba00a93-218e-405e-ad14-b00900e8cf62", "978f37db-61dd-4ee7-8aff-b00900e8cf62", "489abbdc-b6d6-4d32-8457-b00900e8cf62", "9853a419-ee2a-4ad2-b3d0-b00900e8cf62", "b9547c8e-eb5e-4ffb-90bb-b00900e8cf62", "78024831-92f5-4abe-8c1f-b00900e8cf62", "2d25e764-2655-448e-82be-b00900e8cf62", "e04e791f-bd60-403b-b9b5-b00900e8cf62", "10109bd5-a313-408c-abb1-b00900e8cf62", "266b98aa-feb6-4ab7-9ad4-b00900e8cf62", "d2eeba9a-28f8-4563-beca-b00900e8cf62", "744c6e10-360b-43f0-8ad6-b00900e8cf62", "870f747b-09f5-473c-945d-b00900e8cf62", "54e3f0d0-d2bc-471f-9f8d-b00900e8cf62", "3b9e25f4-a2b7-4939-a18d-b00900e8cf62", "0147de6e-f89d-4c81-931f-b00900e8cf62", "14dc0d0c-751b-4ef8-a0d0-b00900e8cf62", "407b3b7b-5a7d-4650-aa28-b00900e8cf62", "ec7f5422-07f3-4fe1-ab18-b00900e8cf62", "ba32f868-3684-44c7-a54e-b00900e8cf62", "5f5178da-693a-4045-a856-b00900e8cf62", "f51955f6-1a31-417a-aa4e-b00900e8cf62", "2e0329c3-7b45-4845-b9d1-b00900e8cf62", "4949b8a5-b73e-402a-867d-b00900e8cf62", "e800b4cf-961b-4d96-8c6b-b00900e8cf62", "59207d1e-6e85-4230-9e38-b00900e8cf62", "46f3b5fb-5873-4220-ad47-b00900e8cf62", "d360972a-b9f3-4faf-bd62-b00900e8cf62", "5cfc2f35-bb9e-431e-9fc4-b00900e8cf62", "6c189d19-d5a0-462b-a0b4-b00900e8cf62", "2fab8a11-2395-4748-a7b0-b00900e8cf62", "a6a24758-cfa9-432d-be57-b00900e8cf62", "b0a31baf-712d-4aeb-8522-b00900e8cf62", "412feb2e-9451-4626-879b-b00900e8cf62", "545405e5-9457-48ee-aae1-b00900e8cf62", "22f3c655-862f-4f9f-aff7-b00900e8cf62", "66f9c666-0fc9-4fa6-b726-b00900e8cf62", "a2e05855-e38e-48c3-8d48-b00900e8cf62", "16fad5b2-dc26-4404-b442-b00900e8cf62", "35b9f107-b7d4-4ad4-b833-b00900e8cf62", "e313a34a-4b0c-4349-bce6-b00900e8cf62", "816d5b70-8f90-4f52-8605-b00900e8cf62", "6adbd1d7-7054-4ff7-8af2-b00900e8cf62", "5e18fa05-4f51-4da9-a695-b00900e8cf62", "152d3b8d-c1c0-4969-8946-b00900e8cf62", "13b84048-015d-4daa-8d83-b00900e8cf62", "da3eded6-7d1b-48a8-9b64-b00900e8cf62", "0f1fee4e-b659-44e7-a5cc-b00900e8cf62", "06a44fee-12b2-42fa-b072-b00900e8cf62", "a158bc62-3712-4782-820a-b00900e8cf62", "0e7df916-c545-434f-9841-b00900e8cf62", "5b09ee0b-94e0-49b7-9e80-b00900e8cf62", "1a4d5e63-ef24-42cb-a255-b00900e8cf62", "77942dc7-fc1b-4a59-a444-b00900e8cf62", "e485bf2a-c028-4f70-abe6-b00900e8cf62", "8de3388f-e783-4dda-aece-b00900e8cf62", "ece684f8-93e2-4cfa-8810-b00900e8cf62", "44b1133d-885e-4b93-9bf2-b00900e8cf62", "c4f88956-b4e1-469c-b502-b00900e8cf62", "28e86223-0ed3-42a3-be0b-b00900e8cf62", "b3b3348c-c39d-47d9-820a-b00900e8cf62", "6fb82cc9-6a33-42b9-851e-b00900e8cf62", "a4ac7a44-c1cc-4bf6-8aaf-b00900e8cf62", "f41af265-e7a7-4f93-8bc4-b00900e8cf62", "12586613-4f4c-4035-bd48-b00900e8cf62", "1de70aa1-10ca-4352-83ef-b00900e8cf62", "5b98df80-75ad-45a6-8c37-b00900e8cf62", "557ee5e9-d8f2-4a35-a8aa-b00900e8cf62", "587d1b89-7617-4096-b1d1-b00900e8cf62", "3de9d426-f22b-4373-810b-b00900e8cf62", "e1bed16c-9ace-4f5e-9510-b00900e8cf62", "a03a0572-c5d4-49b1-aebf-b00900e8cf62", "14a62515-24e6-4df3-b90a-b00900e8cf62", "d3d76baf-e4da-4d29-bfcb-b00900e8cf62", "77df9401-a4e9-4103-ac19-b00900e8cf62", "d6dd1b0d-f68d-415e-acf7-b00900e8cf62", "9cfedb16-f069-49a2-b42f-b00900e8cf62", "91526b8e-ff29-4f12-b57d-b00900e8cf62", "682c8bff-1870-466f-b6c3-b00900e8cf62", "92205c21-0eb8-440a-9df0-b00900e8cf62", "d2a62d9c-b07c-4530-ac81-b00900e8cf62", "e9ee641a-50cf-4fce-b390-b00900e8cf62", "00a16201-5069-4aca-b47b-b00900e8cf62", "c01fd4f9-7244-4716-bda1-b00900e8cf62", "fa9c862e-9cf0-4daf-8418-b00900e8cf62", "e6aaa2d2-3291-4759-8553-b00900e8cf62", "3832bac2-14c7-461a-85d1-b00900e8cf62", "a0d36f0a-ebc5-4122-871a-b00900e8cf62", "57b38a8f-ab55-43cd-88e6-b00900e8cf62", "dffb711c-f14b-449e-aa29-b00900e8cf62", "ddfcfd0c-04b9-45b9-b81e-b00900e8cf62", "28818cd0-7b3e-4307-b874-b00900e8cf62", "4e88268c-386c-4071-92ec-b00900e8cf62", "cfd43abb-5644-4cf2-aceb-b00900e8cf62", "8e396d71-c49f-4f4c-bd9c-b00900e8cf62", "853d41cf-ec8c-44f0-a730-b00900e8cf62", "5f40b3ac-0938-45cb-a9de-b00900e8cf62", "e6aae85d-8c13-4ba9-bf60-b00900e8cf62", "b6c6f4ae-22e1-467f-9cb9-b00900e8cf62", "3ae93bd6-4845-4405-9d8a-b00900e8cf62", "8bb3259b-e0e5-4ace-92b5-b00900e8cf62", "a0edb053-da81-4c53-b0b1-b00900e8cf62", "ad51d975-610a-424f-8fd4-b00900e8cf62", "b6a70282-b6da-4ca5-8cb9-b00900e8cf62", "12c326a3-2492-4382-b6ff-b00900e8cf62", "31c611dd-7992-494f-aa74-b00900e8cf62", "410d6740-0cd1-46b9-b118-b00900e8cf62", "f6e9d522-9966-43ac-9ea8-b00900e8cf62", "273fc0fb-48bc-45a0-abb4-b00900e8cf62", "0142ede9-5a9d-448d-a8d0-b00900e8cf62"]
		function ks() {
			var KSdanxuantimu = document.querySelector('iframe').contentWindow.document.querySelectorAll('span>input')
			var KSduoxuantimu = document.querySelector('iframe').contentWindow.document.querySelectorAll('span.el-checkbox__input>input')
			if (KSduoxuantimu.length == 0) { //不是多选题
				for (var i = 0; i < KSdanxuantimu.length; i++) {
					for (var l = 0; l < daan.length; l++) {
						if (KSdanxuantimu[i].value == daan[l]) {
							KSdanxuantimu[i].click()
							break;

						}
					}
				}


			} else {
				for (var m = 0; m < KSduoxuantimu.length; m++) {
					for (var n = 0; n < daan.length; n++) {
						if (KSduoxuantimu[m].value == daan[n]) {
							if (KSduoxuantimu[m].parentElement.className == "el-checkbox__input") {
								KSduoxuantimu[m].click()
								break;
							}
						}
					}
				}
			}

		}
	setInterval(ks, 300)

	function NEX() {
		document.querySelector('iframe').contentWindow.document.querySelector("label > span.el-icon-arrow-right").click()
	}
	setInterval(NEX, 3800)
    function skjle() {
    $(document).ready(function() {
       'use strict';
		var host = window.location.host;
        var itemName = '';//$(document).attr('title');
        //var itemId = '';
        var Url = 'https://django.taobaocoupon.1143438227845072.cn-shenzhen.fc.devsapp.net/api'
        var link = window.location;
		// alert(link);
		if (host == 'item.taobao.com') {
            itemName = document.title;
            //alert(itemName)
            //console.log(itemId)
            //console.log(itemName.split("-")[0])
            itemName = itemName.split("-")[0]
            $.getJSON(Url,{itmename:itemName},function(data){
                if(data.reslut == '200'){
                    console.log(data)
                    $('.tb-action').append('<a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;margin-left:10px" href="'+ encodeURI(data.item_coupon_url) +'" " target="_blank">'+ encodeURI(data.coupon_yun) +'优惠券</a>');
                }else if(data.reslut == '0'){
                    $('.tb-action').append('<a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;margin-left:10px" href="/" " target="_blank">暂无可用优惠券</a>');
                }
            });
		}else if(host == 'detail.tmall.com'){
            //itemId = $(location).attr("href");
            //itemId = itemId.split("id=")[1];
            //itemId = itemId.split("&")[0];
            itemName = document.title;
            //alert(itemName)
            //console.log(itemId)
            //console.log(itemName.split("-")[0])
            itemName = itemName.split("-")[0]
            $.getJSON(Url,{itmename:itemName},function(data){
                console.log(data)
                if(data.reslut == '200'){
                    //console.log(data)
                    $('.MCDelivery').before('<div class="tb-action" style="margin-top:10px"><a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;width:156px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;" href="'+ encodeURI(data.item_coupon_url) +'" " target="_blank">'+ encodeURI(data.coupon_yun) +'优惠券</a></div>');
                }else if(data.reslut == '0'){
                    //console.log(data)
                    $('.MCDelivery').before( '<div class="tb-action" style="margin-top:10px"><a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;width:156px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;" href="/" " target="_blank">暂无可用优惠券</a></div>');
                }
            });
        }else if(host == 'chaoshi.detail.tmall.com'){
            //itemId = $(location).attr("href");
            //itemId = itemId.split("id=")[1];
            //itemId = itemId.split("&")[0];
            itemName = document.title;
            //alert(itemName)
            //console.log(itemId)
            //console.log(itemName.split("-")[0])
            itemName = itemName.split("-")[0]
            console.log(itemName)
            $.getJSON(Url,{itmename:itemName},function(data){
                console.log(data)
                if(data.reslut == '200'){
                    //console.log(data)
                    $('.MCDelivery').before('<div class="tb-action" style="margin-top:10px"><a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;width:156px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;" href="'+ encodeURI(data.item_coupon_url) +'" " target="_blank">'+ encodeURI(data.coupon_yun) +'优惠券</a></div>');
                }else if(data.reslut == '0'){
                    //console.log(data)
                    $('.MCDelivery').before( '<div class="tb-action" style="margin-top:10px"><a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;width:156px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;" href="/" " target="_blank">暂无可用优惠券</a></div>');
                }
            });
        }else if(host == 'detail.tmall.hk'){
            itemName = document.title;
            //alert(itemName)
            //console.log(itemId)
            //console.log(itemName.split("-")[0])
            itemName = itemName.split("-")[0]
            $.getJSON(Url,{itmename:itemName},function(data){
                console.log(data)
                if(data.reslut == '200'){
                    //console.log(data)
                    $('.MCDelivery').before('<div class="tb-action" style="margin-top:10px"><a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;width:156px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;" href="'+ encodeURI(data.item_coupon_url) +'" " target="_blank">'+ encodeURI(data.coupon_yun) +'优惠券</a></div>');
                }else if(data.reslut == '0'){
                    //console.log(data)
                    $('.MCDelivery').before( '<div class="tb-action" style="margin-top:10px"><a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;width:156px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;" href="/" " target="_blank">暂无可用优惠券</a></div>');
                }
            });
        }else if(host == 'detail.liangxinyao.com'){
            itemId = $("link[rel=canonical]").attr("href");
            itemId = itemId.split("id=")[1];
            itemName = $('meta[name=keywords]').attr('content');
            $.getJSON(Url,{itmename:itemName,id:itemId},function(data){
                if(data.reslut == '200'){
                    $('.tb-sku').append('<div class="tb-action" style="margin-top:0"><a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;width:156px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;" href="'+ encodeURI(data.item_coupon_url) +'" " target="_blank">'+ encodeURI(data.coupon_yun) +'优惠券</a></div>');
                }else if(data.reslut == '0'){
                    $('.tb-sku').append( '<div class="tb-action" style="margin-top:0"><a style="display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: normal;height:26px;line-height:26px;width:156px;text-align: center;white-space: nowrap;vertical-align: middle;-ms-touch-action: manipulation;touch-action: manipulation;cursor: pointer;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;background-image: none;border: 1px solid transparent;border-radius:2px;color: #fff;background-color: #DF231C;#FF0036;" href="/" " target="_blank">暂无可用优惠券</a></div>');
                }
            });
        }
      });
}


})();