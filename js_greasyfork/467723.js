// ==UserScript==
// @name         内蒙古自治区中医药继续教育网-nm.tcmjy-名老中医药专家临床经验传承培训班
// @namespace    需要代刷++++++v:shuake345      ++++++++
// @version      0.2
// @description  自动学习小节|自动考试自动换课|需要代刷+vx:shuake345
// @author       vx:shuake345
// @match        *://nm.tcmjy.org/*
// @grant        non
// @match        *://*.tcmjy.org/*
// @icon         http://r.forteacher.cn/Images/logo.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467723/%E5%86%85%E8%92%99%E5%8F%A4%E8%87%AA%E6%B2%BB%E5%8C%BA%E4%B8%AD%E5%8C%BB%E8%8D%AF%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91-nmtcmjy-%E5%90%8D%E8%80%81%E4%B8%AD%E5%8C%BB%E8%8D%AF%E4%B8%93%E5%AE%B6%E4%B8%B4%E5%BA%8A%E7%BB%8F%E9%AA%8C%E4%BC%A0%E6%89%BF%E5%9F%B9%E8%AE%AD%E7%8F%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/467723/%E5%86%85%E8%92%99%E5%8F%A4%E8%87%AA%E6%B2%BB%E5%8C%BA%E4%B8%AD%E5%8C%BB%E8%8D%AF%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91-nmtcmjy-%E5%90%8D%E8%80%81%E4%B8%AD%E5%8C%BB%E8%8D%AF%E4%B8%93%E5%AE%B6%E4%B8%B4%E5%BA%8A%E7%BB%8F%E9%AA%8C%E4%BC%A0%E6%89%BF%E5%9F%B9%E8%AE%AD%E7%8F%AD.meta.js
// ==/UserScript==

(function() {
	'use strict';
	window.alert = function() {}
	window.onbeforeunload = null
	window.confirm = function() {
		return true
	}
	var Zhuyurl = 'player'

	var Chuyurl = 'MyjoinEvent'
	var Shuyurl = 'CourseWare'
	var Fhuyurl = '&courseware'

    var KSxuanx=document.getElementsByClassName('choiceItem')

	/*document.addEventListener("visibilitychange", function() {
		console.log(document.visibilityState);
		if (document.visibilityState == "hidden") {
        //yincang
        } else if (document.visibilityState == "visible") {
			if (document.URL.search(Zhuyurl) > 1 || document.URL.search(Shuyurl) > 1) {
				setTimeout(sxrefere, 1000)
			}
		}
	});*/
    //document.getElementsByTagName('video')[0].volume=0

	function fhback() {
		window.history.go(-1)
	}

	function gbclose() {
		window.close()
	}

	function sxrefere() {
		window.location.reload()
	}

	function Zhuy() {
        var KCjd=document.querySelector('tr.active').querySelector('.status-tip').innerText//当前看的课程的状态
		var KC = document.getElementsByClassName('status-tip')
        var KCurl=document.getElementsByClassName('course-name')

        if(KCjd=='考试通过' || KCjd=='待考试'){//当前课程已经看完了。
            for (var i = 0; i < KC.length; i++) {
            if(KC[i].querySelector('span').innerText=="待学习" || KC[i].querySelector('span').innerText=="学习中" ){//待学习and学习中
                KCurl[i].querySelector('a').click()
                break;
            }else if(i==KC.length-1){
                for (var l = 0; l < KC.length; l++) {
                    if(KC[l].querySelector('span').innerText=="待考试"){
                        KC[l].nextElementSibling.click()
                        break;
                    }
                }

            }
        }

        }else if(document.getElementsByTagName('video')[0].paused){
            document.getElementsByTagName('video')[0].volume=0
            document.getElementsByClassName('prism-big-play-btn loading-center')[0].click()
        }else if(document.getElementsByTagName('video')[0].playbackRate==1){
            document.getElementsByTagName('video')[0].volume=0
            document.getElementsByTagName('video')[0].playbackRate=15.8
        }
	}

	function Chuy() {
        var errTi=document.getElementsByClassName('choiceItem choiceItemError')//错误的提
        var Ti=document.getElementsByClassName('ant-form-item-control-input')
        var Tijiao=document.getElementsByClassName('ant-btn ant-btn-primary')
        if(errTi.length>0){
            for (var i = 0; i < errTi.length; i++) {
            errTi[i].querySelector('.ant-radio.ant-radio-checked').parentElement.nextElementSibling.click()
        }
        Tijiao[0].click()
        }else{
            for (var l = 0; l < Ti.length; l++) {
            Ti[l].querySelector('.ant-radio-input').click()
            }
            Tijiao[0].click()
        }
	}
    function Xa() {
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

	/*function Shuy() {
		if (document.URL.search(Shuyurl) > 2) {
			var zzKC = document.querySelectorAll('tbody>tr>td>span')
			var zzKCurl = document.querySelectorAll('tbody>tr>td>a')
			for (var i = 0; i < zzKC.length; i++) {
				if (zzKC[i].innerText == '未学完' || zzKC[i].innerText == '未开始') {
					localStorage.setItem('Surl', window.location.href)
					window.location.replace(zzKCurl[i].href)
					break;
				} else if (i == zzKC.length - 1) {
					setTimeout(gbclose, 1104)
				}
			}
		}
	}
	setInterval(Shuy, 3124)

	function Fhuy() {
		if (document.getElementsByTagName('video').length == 1) {
			document.getElementsByTagName('video')[0].volume = 0
			document.getElementsByTagName('video')[0].play()
		}
		if (document.querySelector('iframe').contentWindow.document.querySelector('span.qplayer-currtime').innerText == document.querySelector('iframe').contentWindow.document.querySelector('span.qplayer-totaltime').innerText) {
			window.location.replace(localStorage.getItem('Surl'))
		}
	}*/
	function QT(){
        document.querySelector('.breadcrumb>span').innerText="代刷网课vx:shuake345"
        var d1=document.getElementsByClassName('flex-box video-content')[0];
        var img=document.createElement("img");
        img.style="width:230px; height:230px;"
        img.src="https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";
        d1.appendChild(img);
    }
    setTimeout(QT,5424)

	function Pd() {
        if(KSxuanx.length!==0){//答题界面，不运行看课
            setTimeout(Chuy, 1210)
        }else {
            setTimeout(Zhuy, 1210)
        }
	}
	setInterval(Pd, 5254)

})();