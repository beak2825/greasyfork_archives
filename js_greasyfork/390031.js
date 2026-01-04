// ==UserScript==
// @name         抢座位
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  华东交大抢座位
// @author       LinkerH
// @match        *://lib2.ecjtu.edu.cn/*
// @grant        none

// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/390031/%E6%8A%A2%E5%BA%A7%E4%BD%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/390031/%E6%8A%A2%E5%BA%A7%E4%BD%8D.meta.js
// ==/UserScript==

(function() {
   // window.onload = function(){
    abc(111);//括号里面是座位号
    //rob("10","00","13","00","2019-9-15",153)
    setTimeout(function(){window.location.reload()},60000)
    function abc(id){
        			var myDate = new Date();


        		    if(myDate.getHours()<1&&myDate.getMinutes()<=5)
        		       setTimeout(function(){
                           abc(id);rob("13","40","19","40","2019-"+(myDate.getUTCMonth()+1)+"-"+(myDate.getDate()+1),id);rob("10","00","13","00","2019-"+(myDate.getUTCMonth()+1)+"-" +(myDate.getDate()+1),id);
                       },200)
                    else
                        setTimeout(function(){console.log(myDate.getSeconds()),abc(id)},500)

        	}



 function rob(hour,min,eHour,emin,edate,id)
    {
    var timeStart_hour = hour;
    var timeStart_min = min ;
    var timeEnd_hour = eHour;
    var timeEnd_min = emin;
    var date = edate;
    var devId = 100531923 + id;      // 加号后面的数字是座位号
        /*
            A区 :100531923
            B区: 100532081
            C区: 100532223
            D区:100532383
         */

    //const $ = window.jQuery;
    //
    $.ajax({
        type:"get",
        url:"http://lib2.ecjtu.edu.cn/ClientWeb/pro/ajax/reserve.aspx?dialogid=&dev_id="+ devId +"&lab_id=&kind_id=&room_id=&type=dev&prop=&test_id=&term=&number=&classkind=&test_name=0&start="+date+"+"+ timeStart_hour +"%3A"+timeStart_min+"&end="+date+"+"+timeEnd_hour+"%3A"+timeEnd_min+"&start_time="+timeStart_hour + timeStart_min+"&end_time="+timeEnd_hour+timeEnd_min +"&up_file=&memo=&memo=&act=set_resv&_=1568034058992",
        success: function(msg){console.log(msg)},
        error: function(){console.log("预约失败")}
    })
    }
   // }
    // Your code here...
})();