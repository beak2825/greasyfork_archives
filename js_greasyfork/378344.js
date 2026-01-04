// ==UserScript==
// @name         591租屋網算距離
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  計算到公司的距離
// @author       Yich
// @match        https://rent.591.com.tw/*
// @grant       GM.xmlHttpRequest
//@run-at  document-end
//@require https://code.jquery.com/jquery-3.3.1.min.js

// @downloadURL https://update.greasyfork.org/scripts/378344/591%E7%A7%9F%E5%B1%8B%E7%B6%B2%E7%AE%97%E8%B7%9D%E9%9B%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/378344/591%E7%A7%9F%E5%B1%8B%E7%B6%B2%E7%AE%97%E8%B7%9D%E9%9B%A2.meta.js
// ==/UserScript==
//https://s.591.com.tw/build/static/house/list/houseList.js?v=10c7fa2eb7  這段JS是用來載入房屋物件資料的API，頁面會由這段JS刷新


(function() {
     

    //每次ajax執行成功就觸發，因為此網站是SPA，沒辨法用document-end執行
    unsafeWindow.$(document).ajaxSuccess(function(e, xhr, opt) {
        $(".choicenessBox").hide();//關閉精選物件
        var rentItem = $("#content>ul");//每一個租屋的物件
        rentItem.each(function( index ) {
            var infoContent =$(this).children('.infoContent');//每個物件中的標題/坪數/樓層/地址等資訊
            GetDistance(null,infoContent);
        });
    });

})();

//start請填公司地址
//infoContent是該物件的html，用來insert html
function GetDistance(start,infoContent){

    var address = infoContent.children('.lightBox:eq(1)').find('em').html();//取得物件地址
    start = start || "台北市內湖區瑞光路399號";
    var companyName = "公司";
    var distance = 123;
    var duration = 123;
    var url = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&avoid=tolls|highways|ferries&origins='+ start +'&destinations=' + address + '&key=AIzaSyDRbVQ7DpYIrnHVdeygFmZ3FOfCRAlWTAs'

    var callApi = GM.xmlHttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
            var res = JSON.parse(response.responseText);
            var status = res.rows[0].elements[0].status;
            if(status == 'OK'){
                distance = res.rows[0].elements[0].distance.text;//距離
                duration = res.rows[0].elements[0].duration.text;//通勤時間

                var infoText = infoContent.children('.lightBox:eq(0)')[0].innerText;//取得坪數跟樓層的字串
                var myRegexp = /.*樓層：(.+)\/(\w+)/g;
                var match = myRegexp.exec(infoText);
                var floor = parseFloat(match[1]);//樓層
                var totalFloor = parseFloat(match[2]);//總樓層
                var intDistance = /\d+(\.\d+)?/g.exec(distance)[0];
                //console.log('floor:'+floor+' totalFloor:'+totalFloor+' intDistance:'+intDistance);
                    //如果已取得距離，就不執行
                if(infoContent.children("#distanceBycustom").length == 0){
                    infoContent.append("<p class='nearby' id='distanceBycustom'>距離<i  style='color:#ff6600'> "+ companyName +" </i>"+ distance +" 通勤時間:"+duration+"</p>");
                }

                //依據條件，highlight物件 => 如果不為頂樓 且距離公司小於2公里，就highlight
                if(!isNaN(floor) && !isNaN(totalFloor) && !isNaN(intDistance)){
                    if(floor != totalFloor && intDistance <= 2){
                        infoContent.parent().css("background-color",'#fff7bc')

                    }
                }

            }
        }
    });

}



