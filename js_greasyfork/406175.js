// ==UserScript==
// @name         珠海公交查询增强
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  站点查询页面添加
// @author       火柴人
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @include      http://www.zhbuswx.com/busline/*
// @match        http://www.zhbuswx.com/busline/BusQuery.html?v=2.01#/linelist
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406175/%E7%8F%A0%E6%B5%B7%E5%85%AC%E4%BA%A4%E6%9F%A5%E8%AF%A2%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/406175/%E7%8F%A0%E6%B5%B7%E5%85%AC%E4%BA%A4%E6%9F%A5%E8%AF%A2%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
(function() {
    var checkUrl = setInterval(checkUrlFun,20);
    var isOpen = false;
	var time ;
    var intervalMap = {};
    function checkUrlFun(){
		console.info(33);
        hr = window.location.href;
		if(hr.indexOf("linelist")>0 && busQuery.lineList != undefined){
            if(isOpen == false){
				isOpen = true;
				time = setInterval(checkStation,6000);
				intervalMap[time] = time;
            }
        }else{
			isOpen = false;
            for(var key in intervalMap){
                clearInterval(key);
            }
			intervalMap = {};
		}
    }
	function checkStation(){
		console.info(intervalMap);
		$(".distance").remove();
        hr = window.location.href;
		if(hr.indexOf("linelist")>0 && busQuery.lineList != undefined){

			$(busQuery.lineList).each(function(i,station){//station=路线
				//查询路线车所有站点
				var stationOptions = {
					pageType: "list",
					ajaxOptions: {
						loading: true,
						url: busQuery.url,
						 data: { handlerName: "GetStationList", lineId: station.Id }
					},
					success: function (data) {
						var map = {};
						$(data).each(function(index,object){
							map[object.Name] = index;
						});
						//查询具体车所在位置（线路\站数、站名、循环次数）
						getCarList(station,map,busQuery.stationHistory[0],i);
					}
				}
				$.initPage(stationOptions);
			});
		}
	}
	function getCarList(station,map,name,i){
            var ajaxOptions = {
                url: busQuery.url,
                data: { handlerName: "GetBusListOnRoad", lineName: station.Name, fromStation: station.FromStation },
                success: function (data) {
					var num = 0;
					var juli = "无车出发";
					if(data.flag==1002){
						var thisStationNum = map[name];
						if(thisStationNum==0){
							juli = "始发站";
						}
						$(data.data).each(function(index,object){
							if(map[object.CurrentStation] < thisStationNum){
								juli = "还有"+(thisStationNum - map[object.CurrentStation])+"个站到达";
							}else if(map[object.CurrentStation] == thisStationNum && object.LastPosition==5){
								juli = "已到站";return false;
							}
						});
					}
					$("#lineListResult").find("a:eq("+i+")").prepend("<div class='distance' style='padding: 10px;background-color: #76cd9b;border-radius: 10px;'>"+juli+"</div>");
                }
            };
            //加载数据
            $.initAjax(ajaxOptions);
	}
	
	function getLength(obj){
		var count = 0;
		for(var i in obj){
			count++;
		}
		return count;　　
	}
})();