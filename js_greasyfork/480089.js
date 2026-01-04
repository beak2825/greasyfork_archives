// @version 2.0
var run=function() {
    'use strict';
alert(999)
    //测试版本测试版本测试版本测试版本测试版本测试版本测试版本测试版本测试版本
//测试版本测试版本测试版本测试版本测试版本测试版本测试版本
    var replce=function(){
        document.querySelector("body > div.app.has-head.has-banner.ng-scope > div.app-head > ul:nth-child(2)").style="height: 3rem;"

        var my_html=`
				<li class="col v-t" style="width:auto; padding-left: 5px;">
					<a class="btn btn-opatiy btn-conner has-icon c-b" style="width: 100%;text-align: center" ng-show="buildingReservationType!=1" ng-click="subscribeDay();" onclick="window.extendDay();" href="javaScript:void(0);"><img align="absmiddle" src="img/ion-clock.png">我要预约</a>
					<a class="btn btn-opatiy btn-conner has-icon c-b ng-hide" style="width: 100%;text-align: center" ng-show="buildingReservationType==1" ng-click="reservationShow();" href="javaScript:void(0);"><img align="absmiddle" src="img/ion-clock.png">我要预约</a>
				</li>
				<li class="col t-r v-t" style="padding-left: 5px;">
					<a class="btn btn-opatiy btn-conner has-icon c-b" style="width: 100%;text-align: center" ng-show="buildingReservationType!=0&amp;&amp;campusId!=58" ng-click="SweepCode();" onclick="window.myCheckIn();" href="javaScript:void(0);"><img align="absmiddle" src="img/take-code.png">扫码就坐</a>
				</li>

			`
        var dom=document.createElement('ul');
        dom.className="row"
        dom.style="height: 6rem;"
        dom.innerHTML=my_html
        document.querySelector("body > div.app.has-head.has-banner.ng-scope > div.app-head").appendChild(dom)

        //删除原有标签
        document.querySelector("body > div.app.has-head.has-banner.ng-scope > div.app-head > ul:nth-child(2)").remove()

    }
    if(document.querySelector("body > div.app.has-head.has-banner.ng-scope > div.app-head > ul:nth-child(2) > li:nth-child(1) > a:nth-child(1)").getAttribute("onclick")==null){
        replce()
    }
    //公共方法
    function diffDay(lastDate,earlyDate){
            var startDate = new Date(new Date(earlyDate).Format("yyyy-MM-dd"));
            var endDate = new Date(new Date(lastDate).Format("yyyy-MM-dd"));

            if (startDate>endDate){
                return 0;
            }
            if (startDate==endDate){
                return 0;
            }
            var days=(endDate - startDate)/1000/60/60/24;
            return days;
        }
    //签到模块
    window.myCheckIn=function (){
        var Reservation=window.Api.selectReservationByUser()
        //alert(JSON.stringify(Reservation))
        //alert('"false"')
        if(Reservation.success==false){
            alert("没有预约请先预约再签到")
        }else{
            for (let index = 0; index < Reservation.list.length; index++) {
                var tmp_time_timeDay=Reservation.list[index].time
                console.log(Reservation.list[index].time)
                if(diffDay((new Date(tmp_time_timeDay.split(" - ")[0])).Format("yyyy-MM-dd"),new Date())==0){
                    //console.log(Reservation.list[index].time)
                    var tmp_reseveation=Reservation.list[index]
                    if(tmp_reseveation.notArrive==1){
                        var Reservation_seatId=tmp_reseveation.seatId
                        var result_json=window.Api.checkInSeat(Reservation_seatId)
                        var OUT_TEXT=JSON.stringify(result_json.success)+"\t"+
                            JSON.stringify(result_json.message)
                        var tag=1
                        if(result_json.message=='0') {
                            OUT_TEXT="签到时间未到"
                            alert(OUT_TEXT)
                            //+OUT_TEXT
                        }else if(result_json.message=='3') {
                            OUT_TEXT="重复签到如果有多个预约在同一天请预约到一个时间段"
                            alert(OUT_TEXT)
                            //+OUT_TEXT
                        }
                        else{
                            alert(OUT_TEXT)
                            //location.reload();
                            document.querySelector("#loadingToast").click()
                        }
                    }else{
                        alert("已经签到不用签到")
                        //break;
                    }

                }else{
                    alert("不用签到")
                }
            }
        }
    }
    var click_num=-1
    var day_list=[]
    var Reservation=window.Api.selectReservationByUser();
    var NoReservation=0
    //续约模块
    window.extendDay =function () {
        click_num+=1
        //var Reservation=window.Api.selectReservationByUser();
        var Reservation_ID=0
        var tmp_time_timeDay=""
        var go=true


        var getReservation_ID=function () {
            if(Reservation.success){//判断当天是否有记录优先使用最后一条记录的座位号
               // console.log(Reservation.success+"进入")
                var last_reseveation=Reservation.list[Reservation.list.length-1]
                Reservation_ID=last_reseveation.reservationId
            }else{//没有就选择历史记录的座位号
                Reservation_ID=window.Api.selectReservation(0,1,10).lists[0].id
            }
        }
        var toReservation=function (day) { //0今天 1 明天
            //console.log(day,"0今天 1 明天 toReservation")
            var day_num=day
            var date_day=new Date(new Date().getTime()+day_num*24*60*60*1000).Format("yyyy-MM-dd")
            var Frist_time=date_day+' 09:00:00'
            var End_time=date_day+' 22:00:00'
            var result_json=""
            getReservation_ID()
            if(day==0){
                //今天特殊预约yyyy-mm-dd hh:mm:ss
                console.log("今天预约",End_time,new Date(new Date().getTime()+60*1000))
                result_json=window.Api.extendSeatTimeDay(Reservation_ID,End_time,new Date(new Date().getTime()+60*1000).Format("yyyy-MM-dd HH:mm:ss"))
                //

               // location.reload();//刷新整个网页
            }else{
                result_json=window.Api.extendSeatTimeDay(Reservation_ID,End_time,Frist_time)
            }
            if(result_json.success){
                //alert("预约成功")
                if(NoReservation==1){
                    alert("请刷新页面则按钮功能可能失效")

                    location.reload();
                }
            }
            else{
               // console.log("------->",result_json)

                alert(JSON.stringify(result_json.success)+"\t"+
                      date_day+"\t"+
                      JSON.stringify(result_json.message)
                     )
            }
            document.querySelector("#loadingToast").click()//刷新子页面

        }
        var getOkDay=function(){
            day_list=Array.from({length: 5}, () => 2);
            //console.log(Reservation)
            if (typeof Reservation.list === "undefined"){
                console.log("用户没有预约");
                NoReservation=1;
                return 0;
            }
            var curday=new Date();


            for (let index = 0; index < Reservation.list.length; index++) {
                tmp_time_timeDay=Reservation.list[index].time
                //alert(tmp_time_timeDay)
                var t=diffDay((new Date(tmp_time_timeDay.split(" - ")[0])).Format("yyyy-MM-dd"),curday)
                console.log(tmp_time_timeDay.split(" - ")[0]+">>与第"+index+"天"+new Date().Format("yyyy-MM-dd")+"相差"+t+"天")

                if(t==0&& curday.getHours()<22 && curday.getHours()>8){
                    day_list[t]=1
                    console.log(new Date(tmp_time_timeDay.split(" - ")[0]))
                    continue;
                }
                day_list[t]=1
                //对于有记录的那天进行记录 1为有记录
            }
            //console.log(day_list)
        }

        var tomain = function () {
            //getReservation_ID()
            getOkDay();
            console.log(day_list)

            for (var index = 0,tmp=0; index < day_list.length; index++) {

                if(day_list[index]==2){

                    if(click_num==tmp){
                        toReservation(index)
                        console.log(click_num+"--->"+index+">>>"+day_list[index])
                        break;
                    }
                    tmp+=1
                }

            }
        }
        tomain()

    };
    //----------自动操作---------
      window.myalert= function () { }
      window.myalert=window.alert
      window.alert=console.log
        console.log("自动签到开始")
        window.myCheckIn()
        console.log("自动签到结束")
        //八点后自动预约
        if(new Date().getHours()>20){
            //20点以后打开才自动执行
            console.log("自动预约开始")
            window.extendDay()
            console.log("自动预约结束")
        }
     window.alert=window.myalert
    //----------自动操作---------
    //通知


}
