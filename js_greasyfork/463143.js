// ==UserScript==
// @name         coupang_product
// @namespace    http://tampermonkey.net/
// @description  get Coupang product info
// @version      0.3.8
// @description  try to take over the world!
// @author       You
// @match        https://www.coupang.com/vp/products/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coupang.com
// @grant        none
// @grant    GM_setClipboard
// @grant    GM.xmlHttpRequest
// @require http://code.jquery.com/jquery-2.2.4.min.js
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/463143/coupang_product.user.js
// @updateURL https://update.greasyfork.org/scripts/463143/coupang_product.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.hackdata = {}
    const extractNextFJsonByPrefix = (prefix)=>{
        if (!Array.isArray(self.__next_f)) {
            console.warn("self.__next_f is not an array.");
            return null;
        }

        for (const item of self.__next_f) {
            if (!Array.isArray(item) || typeof item[1] !== 'string') continue;

            const str = item[1];
            const prefixIndex = str.indexOf(prefix);
            if (prefixIndex === -1) continue;

            // prefix 다음 문자열 추출
            const jsonStart = prefixIndex + prefix.length;
            const jsonLike = str.slice(jsonStart).trim();
            console.log( jsonLike )
            try {
                const parsed = JSON.parse(jsonLike);
                return parsed;
            } catch (err) {
                console.error("JSON 파싱 실패:", err, "\n파싱 시도한 문자열:", jsonLike);
                return null;
            }
        }

        console.warn(`Prefix "${prefix}"를 가진 항목을 찾을 수 없습니다.`);
        return null;
    }
    $("document").ready(function(){
        let result = extractNextFJsonByPrefix("18:");
        let infoParse = result[2][3]['children'][1][3]
        let sdp = infoParse.atfData

        hackdata['images'] = sdp.images
        hackdata['prices'] ={couponPirce : sdp.quantityBase[0].price.couponPrice, originPrice : sdp.quantityBase[0].price.originPrice, salePrice: sdp.quantityBase[0].price.salePrice}
        hackdata['itemId'] = sdp.itemId
        hackdata['productId'] = sdp.productId
        hackdata['vendorItemId'] =sdp.vendorItemId
        hackdata['title'] =sdp.title
        hackdata['itemName'] = sdp.itemName
        hackdata['bodyurl'] = `https://www.coupang.com/vp/products/${hackdata['productId']}/items/${hackdata.itemId}/vendoritems/${hackdata.vendorItemId}`
        //hackdata['bodyurl'] = `https://www.coupang.com/vp/products/${hackdata['productId']}?itemId/${hackdata.itemId}&vendorItemId=${hackdata.vendorItemId}`
        hackdata['categories'] = sdp.leafCategoryInfo.parentsCategoryNames
        hackdata['category'] = sdp.leafCategoryInfo.name
        hackdata['siteurl'] = window.location.href

		$.ajax ( {
		    type : "GET",
		    url : hackdata.bodyurl,
		    dataType : 'json',
		    contentType : 'application/json',
		    success : function(res) {
			    hackdata['details'] = res.details
                setTimeout(()=>{
                    let divbtn = document.createElement("div");  // p 태그 생성
                    divbtn.id = 'breadcrumb';
                    divbtn.className ="twc-fixed twc-bg-[#2d65ba] twc-flex twc-h-[50px] twc-items-center twc-justify-center twc-right-[16px] twc-rounded twc-text-white twc-w-[50px] twc-z-[10000] twc-cursor-pointer"
                    let text = document.createTextNode("SAVE");
                    divbtn.style ="top:136px;"
                    divbtn.appendChild(text);
                    $("main").addClass("twc-relative")
                    $("main").append(divbtn)

                    let sitebtn = document.createElement("a");
                    sitebtn.className ="twc-bg-red-400 twc-fixed twc-flex twc-h-[50px] twc-items-center twc-justify-center twc-opacity-85 twc-right-[16px] twc-rounded twc-text-white twc-w-[50px] twc-z-[9999]"
                    sitebtn.href = "https://oryx-pure-pangolin.ngrok-free.app"
                    sitebtn.target ="_blank"
                    sitebtn.style ="top:192px;"

                    let atext = document.createTextNode("open");
                    sitebtn.appendChild(atext);
                    $("main").append(sitebtn)


                    $("#breadcrumb").on('click', function() {
                        var queryString = window.location.search
                        var urlParams = new URLSearchParams(queryString);

                        if(hackdata['vendorItemId'] != urlParams.get('vendorItemId')){
                            console.log( "상품이 변경되어 화면을 RELOAD 합니다" )
                            alert("상품이 변경되어 화면을 RELOAD 합니다")
                            window.location.reload();
                            return ;
                        }
                        console.log( hackdata['vendorItemId'],urlParams.get('vendorItemId') )

                        $.ajax({
                            type:'post',
                            dataType: 'json',
                            contentType: 'application/json',
                            data: JSON.stringify(hackdata),
                            url : "https://oryx-pure-pangolin.ngrok-free.app/coupangproxy",
                            success: function(res){
                                window.open(`http://recovershop.co.kr/admin/board/product_modify.php?w=u&seq=${res.data.seq}`,'_blank')
                                alert("기본데이터 저장완료")
                            },
                            error: function(xhr){
                                console.log(xhr)
                                if (typeof xhr.responseJSON != 'undefined' && typeof xhr.responseJSON.message != 'undefined' ){
                                    if( typeof xhr.responseJSON.data.id !='undefined') {
                                        if ( confirm('이미 저장되어있습니다. 확인하시겠습니까?')) {
                                            window.open(`http://recovershop.co.kr/admin/board/product_modify.php?w=u&seq=${xhr.responseJSON.data.id}`,'_blank')
                                        }
                                    }else alert(xhr.responseJSON.message)

                                }else alert("저장중 오류발생")
                            }
                        })
                    })
                },1500)
		    },
		    error : function(xhr) {
		    	alert('데이터를 가져오는 중 오류발생');
		    },
		    complete : function() {
			console.log ( hackdata )
		    }
		});
        //console.log (hackdata)
    })
    // Your code here...
})();