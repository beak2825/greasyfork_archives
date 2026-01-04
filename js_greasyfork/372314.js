// ==UserScript==
// @name         京东闪付券
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  try to take over the world!
// @author       You
// @match        https://pb.jd.com/activity/2018/hyjaug/html/index.html*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/372314/%E4%BA%AC%E4%B8%9C%E9%97%AA%E4%BB%98%E5%88%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/372314/%E4%BA%AC%E4%B8%9C%E9%97%AA%E4%BB%98%E5%88%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ind0;

    var HYJDATA=data_source_100000802
    // console.log(HYJDATA)
    var isWX = /MicroMessenger/i;
    var isJR = /jdjr-app/i;
    var isJD = /jdapp/i;
    var isIos = /iphone|ipad|ipod/i;
    var isAndroid = /android/i;
    var UA = window.navigator.userAgent.toLocaleLowerCase();
    var HE = '';
    if(isWX.test(UA)){
        HE='WX';
    }else if(isJR.test(UA)){
        HE='JR';
    }else if(isJD.test(UA)){
        HE='JD';
    }else{
        HE='H5';
    }
    var pre=UTIL_LXMK.getQueryByName("p_id",location.href)||"default"

    var  today = new Date();
    var  current = Number(today.getHours())  //当前的时间   小时

    // current=17
    /**
   * item-time-bg2 中
   * item-time-bg1 不中
   *
   * affirm 领取过
   * no-affirm 未领取
   */




    var testdata={
        coupons:{
            10:[
                {
                    amount:"100",
                    entranceKey:"b183f8bdcc5077fe87d813847047e95b",
                    id:"2018080220115362101",
                    name:"京东码付10减1通用券",
                    prizeDailyGotten:0,
                    status:0,
                    taken:false,
                    useDesc:"满10减1"
                },
                {
                    amount:"200",
                    entranceKey:"c617ccc203c7b574500681a6acf147a0",
                    id:"2018080220072504901",
                    name:"ETCP app满5元减2元京东闪付券",
                    prizeDailyGotten: 0,
                    status:0,
                    taken:false,
                    useDesc:"满5减2"
                },
                {
                    amount:"500",
                    entranceKey:"9a21c644e94425ab820043a3fca8678e",
                    id:"2018080220052055401",
                    name:"限京东到家APP使用",
                    prizeDailyGotten:0,
                    status: 0,
                    taken:false,
                    useDesc: "满40减5"
                }
            ],
            14:[
                {
                    amount:"500",
                    entranceKey:"34b1e3fffb98d9d942a38682e8b9aeaf",
                    id:"2018080220040661701",
                    name:"京东闪付30减5全国屈臣氏线下券",
                    prizeDailyGotten:0,
                    status:1,
                    taken:false,
                    useDesc:"满30减5"
                },
                {
                    amount:"200",
                    entranceKey:"d7e0f53e4af2c0e6c750573b701261fb",
                    id:"2018080219223021601",
                    name:"单车出行APP满10减2京东闪付券（ofo/摩拜）",
                    prizeDailyGotten:1,
                    status:1,
                    taken:false,
                    useDesc:"满10减2"
                },
                {
                    amount:"200",
                    entranceKey:"8581c41185dbd6e9e8c13a2c744d4636",
                    id:"2018080215442176401",
                    name:"京东闪付满10减2线下通用券",
                    prizeDailyGotten:0,
                    status:0,
                    taken:false,
                    useDesc:"满10减2"
                }
            ],
            20:[
                {
                    amount:"200",
                    entranceKey:"f513f407cdb3a7b675f2ac13b00b56a2",
                    id:"2018080215413271301",
                    name:"京东闪付满15减2线下通用券",
                    prizeDailyGotten:0,
                    status:0,
                    taken: false,
                    useDesc:"满15减2"
                },
                {
                    amount:"500",
                    entranceKey:"a6a8a6d04a04d58852d71e4a2477642f",
                    id:"2018080217194312701",
                    name:"外卖APP30减5京东闪付券",
                    prizeDailyGotten:0,
                    status:0,
                    taken:false,
                    useDesc:"满30减5"
                },
                {
                    amount:"500",
                    entranceKey:"3304616f0c2828bc1f3f6d12de8c9768",
                    id:"2018080217442900101",
                    name:"滴滴出行APP满30减5京东闪付券",
                    prizeDailyGotten:0,
                    status:0,
                    taken:false,
                    useDesc:"满30减5"
                }
            ]
        },
        currentTimeMillis:1533724277218,
        startTimeMills:{
            10:1533693600000,
            14:1533708000000,
            20:1533729600000
        }
    }
    /**
   * 返回三个数组，每个数组分别对应三个时间段的券信息
   */
    var newCouponsArr=[]  //保存接口里的时间和对应的值
        var newCouponsArrItem10=[] //当前显示的券的信息
        var newCouponsArrItem14=[]
        var newCouponsArrItem20=[]
    function getTicketItemArr(coupons,twoInfo){
        // var newCouponsArr=[]  //保存接口里的时间和对应的值

        if(twoInfo=="true"){
            newCouponsArr=coupons
        }else{
            for(var keyTime in coupons){
                newCouponsArr.push({Time:Number(keyTime),TimeObj:coupons[keyTime]})
            }
        }


        newCouponsArr.forEach(item =>{
            if(item.Time===10){
                newCouponsArrItem10=item
            }else if(item.Time===14){
                newCouponsArrItem14=item
            }else{
                newCouponsArrItem20=item
            }
        })
        if(twoInfo=="false"){
            if(current<14&&current>0){
                $("body").find(".item-time1").addClass("item-time-bg2")
                $("body").find(".item-time2,.item-time3").addClass("item-time-bg1")
                initTicktListWatch(newCouponsArrItem10,10)
            }else if(current>=14&&current<20){
                $("body").find(".item-time2").addClass("item-time-bg2")
                $("body").find(".item-time1,.item-time3").addClass("item-time-bg1")
                initTicktListWatch(newCouponsArrItem14,14)

            }else{
                $("body").find(".item-time3").addClass("item-time-bg2")
                $("body").find(".item-time1,.item-time2").addClass("item-time-bg1")
                initTicktListWatch(newCouponsArrItem20,20)
            }
        }

    }



    // initTicktListWatch(test2)

    function initTicktListWatch(ary,str){
        $("body").find(".yhq-item-b").remove();//点击切换的时候 先清空一下原有的券
        // console.log(ary)
        var ticktListHtml=''
        ary.TimeObj.forEach((item,index) =>{
            var isTaken=""             //显示已领取还是立即领取
            // var isPrizeDailyGotten=0   //标识这个用户没有领取
            var isTakenBg=""
            var isclick="noBtn"   //如果是btn就可以点击 如果不是 就不可以点击
            if(item.prizeDailyGotten===1){
                isTaken="已领取"
                isTakenBg="affirm"
            }else{
                isTaken="立即领取"
                isTakenBg="no-affirm"
                if(ary.Time===10){
                    if(current>=10){
                        isclick="btn"
                    }else{
                        isclick="noBtn"
                    }
                }else if(ary.Time===14){
                    if(current>=14){
                        isclick="btn"
                    }else{
                        isclick="noBtn"
                    }
                }else{
                    if(current>=20){
                        isclick="btn"
                    }else{
                        isclick="noBtn"
                    }
                }
            }
            // var none="" //是否隐藏
            // if(item.status===1||item.status===-1){
            //   if(current>=str){
            //     none=""
            //     isclick="noBtn"
            //   }else{
            //     none="none"
            //   }
            // }else{
            //   none="none"
            // }
            var none="none"
            // if(item.status===1||item.status===-1){
            //   if(current>=str){
            //     none=""
            //     isclick="noBtn"
            //   }else{
            //     none="none"
            //     // isclick="noBtn"
            //   }
            // }else{
            //   none="none"
            // }

            ticktListHtml+=`<div class="yhq-item-b ${isclick}" data-prid="${item.entranceKey}" id="a${item.entranceKey}" >
<div class="yhq-ylq-bg ${none}"><img src="//img30.360buyimg.com/jr_image/jfs/t24943/316/26313877/30751/9f1644c8/5b6301ccNef771197.png" class="yhq-ylq-bg-img" alt=""></div>
<div class="yhq-content-b">
<div class="yhq-top-b">
<div class="symbol">￥</div>
<div class="money-num">${item.amount/100}</div>
</div>
<div class="instructions">${item.name}</div>
<div class="instructions2">${item.useDesc}</div>
<div class="lq-bottom-btn">
<div class="lq-btn-default ${isTakenBg}">${isTaken}</div>
</div>
</div>
</div>`
        })
        $("body").find(".yhq-allitem-center").append(ticktListHtml)

        $("body").off("click",".btn")

        //现在是页面上的券列表出来了
        $("body").on("click",".btn",function(){
            // 去请求接口
            requestToAccept($(this).attr("data-prid"))
        })

        $("body").off("click",".noBtn")

        //现在是页面上的券列表出来了
        $("body").on("click",".noBtn",function(){

            if($(this).find(".yhq-ylq-bg").hasClass("none")&&$(this).find(".lq-btn-default").hasClass("no-affirm")){ //没有已抢光  没有已领取
                $(".hintBox").text("活动未开始")
                $(".black-and-white-b").css("display","block")
            }else if($(this).find(".yhq-ylq-bg").hasClass("none")&&$(this).find(".lq-btn-default").hasClass("affirm")){ // 没有已抢光 有已领取
                //活动未开始
                $(".hintBox").text("已领取")
                $(".black-and-white-b").css("display","block")
            }else{
                $(".hintBox").text("已抢光")
                $(".black-and-white-b").css("display","block")
            }

        })
    }

    console.log(newCouponsArr)
    function requestToAccept(entranceKey) {
        $.ajax({
            url:"https://pa.jd.com/prize/center/h5/draw",
            data: {entranceKey:entranceKey},
            dataType:"jsonp",
            jsonp:"callback",
            success:function(res){
                // console.log(res)
                if(res.state===1){ //领取成功
                    $("body").find("#a"+entranceKey).find(".lq-btn-default").removeClass("no-affirm").addClass("affirm").text("已领取")
                    $(".hintBox").text("领取成功")
                    $(".black-and-white-b").css("display","block")
                    // newCouponsArr
                    newCouponsArr.forEach((item,index) => {
                        item.TimeObj.forEach((itemIn,indexIn)=>{
                            if(itemIn.entranceKey==entranceKey){
                                itemIn.prizeDailyGotten=1
                            }
                        })
                    })
                    getTicketItemArr(newCouponsArr,"true");
                }else{ //领取失败
                    if($("body").find("#a"+entranceKey).find(".affirm").length){
                        $(".hintBox").text("已领取")
                        $(".black-and-white-b").css("display","block")
                    }else{
                        $(".hintBox").text("领取失败")
                        $(".black-and-white-b").css("display","block")
                        $("body").find("#a"+entranceKey).find(".yhq-ylq-bg").removeClass("none");
                    }
                }
            },
            error:function(err){
                console.log(err)
                console.log("请求数据失败")
                $(".hintBox").text("领取异常")
                $(".black-and-white-b").css("display","block")
            }
        })
    }

    // var timeinter=setInterval(function(){
    //   if($("body").find(newentranceKey).find(".lq-btn-default")){
    //     clearInterval(timeinter)
    //     $("body").find(newentranceKey).find(".lq-btn-default").removeClass("no-affirm").addClass("affirm").text("已领取")
    //   }
    // },500)


    //请求券信息的接口
    function initPagePrizeStatus(){
        $.ajax({
            url:"https://payhome.jd.com/my/api/firstAnnAct/couponList",
            dataType:"jsonp",
            jsonp:"callback",
            success:function(res){
                console.log(res)

                if(res.code==="F_000000"){ //请求成功
                    getTicketItemArr(res.data.coupons,"false")
                }else if(res.code==="F_99999"){ //用户未登录
                    location.href = '//plogin.m.jd.com/user/login.action?appid=579&returnurl=' + encodeURIComponent(location.href);
                }else{  //A_000002 活动不在活动范围内
                    $(".hintBox").text("活动未开始")
                    $(".black-and-white-b").css("display","block")
                }

            },
            error:function(err){
                console.log(err)
                console.log("请求数据失败")
                $(".hintBox").text("服务器异常")
                $(".black-and-white-b").css("display","block")
            }
        })
    }
    initPagePrizeStatus();


    function go(i){

        if(i == 1) {
          $(".item-time1").removeClass("item-time-bg1").addClass("item-time-bg2");
          $("body").find(".item-time2,.item-time3").removeClass("item-time-bg2").addClass("item-time-bg1");
            
          initTicktListWatch(newCouponsArrItem10,10);

        } else if(i ==2 ){
          $(".item-time2").removeClass("item-time-bg1").addClass("item-time-bg2");
          $("body").find(".item-time1,.item-time3").removeClass("item-time-bg2").addClass("item-time-bg1");
          initTicktListWatch(newCouponsArrItem14,14);
        } else {
          $(".item-time3").removeClass("item-time-bg1").addClass("item-time-bg2");
          $("body").find(".item-time2,.item-time1").removeClass("item-time-bg2").addClass("item-time-bg1");
          initTicktListWatch(newCouponsArrItem20,20);
        }

        //$(".btn").removeClass("btn").addClass("noBtn");
        $(".noBtn").removeClass("noBtn").addClass("btn");

        $(".btn").each(function( index, val ) {
            console.log(val.dataset.prid);
            requestToAccept(val.dataset.prid);
        });

    }

    function run(){
        var nowDate = new Date();
        var h = nowDate.getHours();
        var m = nowDate.getMinutes();
        var s = nowDate.getSeconds();
        console.log(h +":"+m+":"+s);
        if((h == 10)  && (m < 2)){
            go(1);
        } else if((h == 14 ) && ( m < 2)) {
            go(2);
        } else if((h == 20) && ( m < 2)) {
            go(3);
        }else if(s == 1){
            if(h<11) {
                go(1);
            } else if(h<15) {
                go(2);
            }else {
                go(3);
            }
        }
        //go(1);
        var tt;
        if(m<59 && m >1){
            tt = 1000;
        } else {
            tt = 100;
        }
        if(h == 8 && m == 58&& s == 30) {
            window.location.reload()
        }

        ind0 = self.setInterval(function () {
            clearInterval(ind0);
            run();
        }, tt);
    }

    ind0 = self.setInterval(function () {
        clearInterval(ind0);
        run();
    }, 1000);

})();