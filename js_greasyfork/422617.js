// ==UserScript==
// @name         精品超市-针织路京客隆---呼家楼红庙万达华贸
// @namespace    http://tampermonkey.net/
// @version      3.11
// @description  try to take over the world!
// @author       You
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/vConsole/3.3.4/vconsole.min.js
// @match        *://portal.imdada.cn/app/*
// @match        *://dauth.imdada.cn/*
// @grant        none
// @license    小狼
// @downloadURL https://update.greasyfork.org/scripts/422617/%E7%B2%BE%E5%93%81%E8%B6%85%E5%B8%82-%E9%92%88%E7%BB%87%E8%B7%AF%E4%BA%AC%E5%AE%A2%E9%9A%86---%E5%91%BC%E5%AE%B6%E6%A5%BC%E7%BA%A2%E5%BA%99%E4%B8%87%E8%BE%BE%E5%8D%8E%E8%B4%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/422617/%E7%B2%BE%E5%93%81%E8%B6%85%E5%B8%82-%E9%92%88%E7%BB%87%E8%B7%AF%E4%BA%AC%E5%AE%A2%E9%9A%86---%E5%91%BC%E5%AE%B6%E6%A5%BC%E7%BA%A2%E5%BA%99%E4%B8%87%E8%BE%BE%E5%8D%8E%E8%B4%B8.meta.js
// ==/UserScript==

(function () {
    'use strict';
   // 初始化vConsole
     window.vConsole = new window.VConsole({
        defaultPlugins: ['network'], // 可以在此设定要默认加载的面板
        maxLogNumber: 1000,
        // disableLogScrolling: true,
        onReady: () => {
          console.log('vConsole is ready.');
        },
        onClearLog: () => {
          console.log('on clearLog');
         }
        })


    var page_interval = 1000
    var dingdang_interval = 1000
    var page_over = true
    var isdebug = false


    //定义点的结构体
    function point(){
        this.x=0;
        this.y=0;
    }
    //计算一个点是否在多边形里,参数:点,多边形数组

    function PointInPoly(pt, poly) {
        for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
            ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
        && (c = !c);
        return c;
    }

    function process_one(dd_id) {
        //  console.log("当前正在处理页面dd_id"+dd_id)
        if (isdebug == false) {
            console.log("调试中，不指派false指派true")
            console.log("当前订单号为", dd_id)
            return 0
        }


        $.ajax({
            url: "https://portal.imdada.cn/dcOperation/operation/order/assign",
            type: "POST",
            headers: {
                "Accept": "*/*",
                "Content-Type": "application/json;charset=UTF-8",
                "Accept-Language": "zh-CN,zh;q=0.9"
            },
            data: JSON.stringify(
                {"orderId":dd_id,"transporterId":113445}
            ),
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("指派出错了,订单号为", dd_id)
            },
            success: function (data, textStatus, jqXHR) {
                console.log("指派结果：订单号", dd_id, data)
            }
        })


    }

    function page_process(page) {
        //       console.log("当前正在处理页面",page)
        if (page_over == true) {
            //             console.log("暂无其他页面正在处理，当前页面+++++s",page)
        } else {
            return 0
        }
        page_over = false
        //         console.log("暂无其他页面正在处理，当前页面",page)
        $.ajax({
            url: "https://portal.imdada.cn/dcOperation/dispatch/order/list",
            type: "POST",
            headers: {
                "Accept": "*/*",
                "Accept-Language": "zh-CN,zh;q=0.9",
                "Content-Type": "application/json;charset=UTF-8"
            },
            data: JSON.stringify(
                //   花店
                //   {"dadaCityInfos":[],"shopIds":[],"orderIdList":[],"receiverPhone":"","supplierIds":[143627512],"pageNum":1,"pageSize":50,"dispatchDisplayStatus":1,"sortCondition":"DELIVER_DISTANCE","sortDirection":"ASC","addAllowanceStatus":0}
                // SKP万达圈
                //     {"dadaCityInfos":[],"shopIds":[],"orderIdList":[],"receiverPhone":"","supplierIds":[31568067,47539069,143627512,98443601,147960579,10518824],"pageNum":1,"pageSize":50,"dispatchDisplayStatus":1,"sortCondition":"DELIVER_DISTANCE","sortDirection":"ASC","addAllowanceStatus":0}
                //延静里圈
                //    {"dadaCityInfos":[],"shopIds":[],"orderIdList":[],"receiverPhone":"","supplierIds":[398851,111149997,41262691,83399649,100203749,72508919,101914147,118559323,131908542,118552313,77271281,2017269,8742132,109381497],"pageNum":1,"pageSize":50,"dispatchDisplayStatus":1,"sortCondition":"DELIVER_DISTANCE","sortDirection":"ASC","addAllowanceStatus":0}
                //延静里圈+紫光园红庙
                //   {"dadaCityInfos":[],"shopIds":[],"orderIdList":[],"receiverPhone":"","supplierIds":[47223689,398851,111149997,41262691,83399649,100203749,72508919,101914147,118559323,131908542,118552313,77271281,2017269,8742132,109381497],"pageNum":1,"pageSize":50,"dispatchDisplayStatus":1,"sortCondition":"DELIVER_DISTANCE","sortDirection":"ASC","addAllowanceStatus":0}
                //水碓子+延静里
                //   {"dadaCityInfos":[],"shopIds":[],"orderIdList":[],"receiverPhone":"","supplierIds":[124683891,398851,111149997,41262691,83399649,100203749,72508919,101914147,118559323,131908542,118552313,77271281,2017269,8742132,109381497],"pageNum":1,"pageSize":50,"dispatchDisplayStatus":1,"sortCondition":"DELIVER_DISTANCE","sortDirection":"ASC","addAllowanceStatus":0}
                // 京客隆+延静里
                //    {"dadaCityInfos":[],"shopIds":[],"orderIdList":[],"receiverPhone":"","supplierIds":[2696679,398851,111149997,41262691,83399649,100203749,72508919,101914147,118559323,131908542,118552313,77271281,2017269,8742132,109381497],"pageNum":1,"pageSize":50,"dispatchDisplayStatus":1,"sortCondition":"DELIVER_DISTANCE","sortDirection":"ASC","addAllowanceStatus":0}
                //水碓子+京客隆+小串+延静里
                //   {"dadaCityInfos":[],"shopIds":[],"orderIdList":[],"receiverPhone":"","supplierIds":[2696679,2463159,124683891,398851,111149997,41262691,83399649,100203749,72508919,101914147,118559323,131908542,118552313,77271281,2017269,8742132,109381497],"pageNum":1,"pageSize":50,"dispatchDisplayStatus":1,"sortCondition":"DELIVER_DISTANCE","sortDirection":"ASC","addAllowanceStatus":0}
                //水碓子+京客隆+小串+延静里+紫光园团结湖
                //   {"dadaCityInfos":[],"shopIds":[],"orderIdList":[],"receiverPhone":"","supplierIds":[118532303,2696679,2463159,124683891,398851,111149997,41262691,83399649,100203749,72508919,101914147,118559323,131908542,118552313,77271281,2017269,8742132,109381497],"pageNum":1,"pageSize":50,"dispatchDisplayStatus":1,"sortCondition":"DELIVER_DISTANCE","sortDirection":"ASC","addAllowanceStatus":0}
                //新苑
               //  {"dadaCityInfos":[],"shopIds":[],"orderIdList":[],"receiverPhone":"","supplierIds":[120657406],"pageNum":1,"pageSize":50,"dispatchDisplayStatus":1,"sortCondition":"DELIVER_DISTANCE","sortDirection":"ASC","addAllowanceStatus":0}
                //新苑+民悦发
                //   {"dadaCityInfos":[],"shopIds":[],"orderIdList":[],"receiverPhone":"","supplierIds":[120657406,131908542],"pageNum":1,"pageSize":50,"dispatchDisplayStatus":1,"sortCondition":"DELIVER_DISTANCE","sortDirection":"ASC","addAllowanceStatus":0}
                //水碓子+针织路京客隆+小串
                 {"dadaCityInfos":[],"shopIds":[],"orderIdList":[],"receiverPhone":"","supplierIds":[2696679,124683891,2463159],"pageNum":1,"pageSize":50,"dispatchDisplayStatus":1,"sortCondition":"DELIVER_DISTANCE","sortDirection":"ASC","addAllowanceStatus":0}
                //甜水园京客隆+全家爱+水碓子+针织路京客隆+小串
                //   {"dadaCityInfos":[],"shopIds":[],"orderIdList":[],"receiverPhone":"","supplierIds":[105566225,2381550,2696679,124683891,2463159],"pageNum":1,"pageSize":50,"dispatchDisplayStatus":1,"sortCondition":"DELIVER_DISTANCE","sortDirection":"ASC","addAllowanceStatus":0}

                /*
398851百康药房
10518824屈臣氏
111149997叮当快药(北京红庙站)
98443601窑鸡王大望路店
2463159竹签小串
41262691百康延静里分店
83399649小仓生活
124683891京京精品生鲜超市水碓子
100203749叮当快药(送药088药房)
72508919北京老婆很芒很好送（延静里店）超级好取货
47539069真功夫（万达二店）
101914147北京高远百康大药房有限公司延静里分店
118559323叮当智慧药房（红庙店）
2381550京客隆（甜水园店）
2696679京客隆针织路店
120657406佳美乐购超市（国贸店）
117228459每实糕糕铺（华贸店）
47223689紫光园红庙店
105566225全家爱
118532303紫光园团结湖店
131908542民悦发
77240319村上一屋(棕榈泉店)
118552313百康药房
77271281内蒙古牛羊肉
2017269京美连锁超市
8742132京美超市（延静里店）
143627512花加国贸万达店【拍货号送达务必电话顾客
109381497小仓生活（金台路站）
*/


            ),
            error: function (jqXHR, textStatus, errorThrown) {
                page_over = true
            },

            success: function (data, textStatus, jqXHR) {
                if (data["status"] == "ok") {
                    data = data["content"]
                    //返回数据
                    //        console.log(data)
                    var totalCount = data["totalCount"]
                    //        console.log(totalCount)
                    var dlist = data["records"]
                    // alert(111)
                    //           console.log("dlist"+dlist)
                    var intva = 0
                    for (var i = 0; i < dlist.length; i++) {
                        var item = dlist[i]
                        //     console.log(item)
                        //                         var receiverInfo = dlist[i].receiverAddres
                        //                         console.log("receiverInfo"+receiverInfo)

                        var receiverInfo = item["receiverInfo"]
                        //       console.log("receiverInfo:"+item.receiverInfo)
                        var address = item.receiverInfo.receiverAddress
                        //      console.log("地址:"+address)

                        var supplierInfo =item["supplierInfo"]
                        var sn=item.supplierInfo.supplierName
                        //   console.log("sn:"+sn)
                        var orderid = item["deliveryOrderId"]
                        //          console.log("orderid:"+orderid)
                        var distance = item["distance"]
                        //  console.log("距离:"+distance)
                        var kg = item["cargoWeight"]
                        //              console.log("kg:"+kg/1000+"kg")
                        var a=kg/1000
                        var lat =item.receiverInfo.receiverLat
                        var lng =item.receiverInfo.receiverLng
                        // console.log(lat)
                        // console.log(lng)
                        //调用
                        var pt=new point();
                        pt.x=lat;
                        pt.y=lng;
                        //这里的下x，y坐标是多边形的顺时针的拐角节点来排序的
                        //		var _poly=[{x:39.908774,y:116.462534},{x:39.933529,y:116.461858},{x:39.933859,y:116.49769},{x:39.908924,y:116.494248}];
                        //华贸、万达、新苑、红庙、呼家楼、金台里
                        //	var _poly=[{x:39.90865479686829,y:116.48473380506562},{x:39.9082629740402,y:116.4834738209911},{x:39.90841099632181,y:116.46181572250293},{x:39.923392753691886,y:116.46160125186918},{x:39.922914304832176,y:116.47823243343828},{x:39.922979930424745,y:116.48984318829662},{x:39.92034866960163,y:116.48976379278065},{x:39.92051232746698,y:116.48470976800013},{x:39.91547319843905,y:116.48474346111243},{x:39.915447355695726,y:116.48595642721068},{x:39.914232793672895,y:116.48612843515389},{x:39.912408554304186,y:116.4860762456367},{x:39.91061461598812,y:116.4851660800282}];

                        //甜水园京客隆范围（团结湖、甜水园、水碓子、呼家楼、金台里、红庙、延静里、万达、新苑、华贸）
                        //	var _poly=[{x:39.910000920607544,y:116.48579686910284},{x:39.90827101876901,y:116.48472610963336},{x:39.90841639022908,y:116.4618318246628},{x:39.91345612274184,y:116.46198553785666},{x:39.91918309630097,y:116.4616538865912},{x:39.92334187758258,y:116.4615970321313},{x:39.92530393624364,y:116.46162545952359},{x:39.9247879931606,y:116.46610748914941},{x:39.92654654474972,y:116.46703611265946},{x:39.92942407670869,y:116.467055064134},{x:39.93083830750243,y:116.47269559102119},{x:39.93104902648238,y:116.47385163247884},{x:39.93107809117378,y:116.47831471008772},{x:39.93109262320989,y:116.48197234941313},{x:39.93131060776171,y:116.48479612284598},{x:39.93133240625374,y:116.48680498160707},{x:39.928324158375645,y:116.48731667214327},{x:39.9247707678352,y:116.48796102271217},{x:39.924625430947884,y:116.48937290944662},{x:39.92296130163028,y:116.48932553047098},{x:39.920657615137024,y:116.48956242419217},{x:39.920962839891054,y:116.48473926784357},{x:39.915541264019055,y:116.4846634619455},{x:39.9154645730534,y:116.48593198053436},{x:39.91444299921827,y:116.48608402541663},{x:39.91225495194538,y:116.48618741584028},{x:39.910542910757826,y:116.48587116264628}];

                        //华贸、万达、新街大院、呼家楼、金台里、红庙、延静里、水碓子
                        var _poly=[{x:39.90919400000001,y:116.48651915079188},{x:39.908256631413266,y:116.4853368989684},{x:39.90838610294355,y:116.46184687262951},{x:39.9134310888809,y:116.46193697262242},{x:39.91914253761694,y:116.46162260239294},{x:39.92395885844615,y:116.46166435028033},{x:39.924062782005485,y:116.46702672987567},{x:39.92563556196806,y:116.46705602131397},{x:39.92565202863982,y:116.47004782378531},{x:39.925668495223846,y:116.471321844881},{x:39.92548736224653,y:116.47304678377895},{x:39.92471149773227,y:116.47305117835708},{x:39.92466218938091,y:116.47556303356146},{x:39.924132944053554,y:116.47558446571327},{x:39.92397515583064,y:116.47821205491198},{x:39.92293032789994,y:116.47818522433852},{x:39.92300433078787,y:116.48995339302803},{x:39.92041245655917,y:116.48952801547443},{x:39.92058291950316,y:116.48468680804444},{x:39.915507303238975,y:116.48465830086502},{x:39.91550509688015,y:116.48587725219875},{x:39.91393693745178,y:116.48612626614477},{x:39.912343610561756,y:116.48616558415983},{x:39.91031294455538,y:116.48657187009167}];
                        //花店++++近
                        //	var _poly=[{x:39.90973615632244,y:116.4863465462787},{x:39.90832731555327,y:116.48476121337478},{x:39.90845606969024,y:116.46174860980227},{x:39.91921330400686,y:116.4615611517238},{x:39.91654319981774,y:116.4695212045242},{x:39.91594519340903,y:116.47224104039617},{x:39.91563923472498,y:116.4781158857379},{x:39.91550151715023,y:116.48038927378116},{x:39.912687293323756,y:116.4794829381973},{x:39.912668543270826,y:116.48260740706701},{x:39.910549408681675,y:116.48274492006567}];
                        // 团结湖、呼家楼、红庙、延静里
                        // var _poly=[{x:39.915625725541865,y:116.47797309330451},{x:39.91589746404905,y:116.4729378439472},{x:39.916524327656624,y:116.46963145305313},{x:39.91713693859543,y:116.46725382391548},{x:39.91921692570361,y:116.46158837958774},{x:39.923361163759935,y:116.46166774893425},{x:39.92888815936751,y:116.46189065213821},{x:39.929457927328045,y:116.46698026440276},{x:39.931933244720625,y:116.46704501293402},{x:39.931904757469155,y:116.47265473201037},{x:39.93073676984168,y:116.47272903291253},{x:39.931035890508525,y:116.47373209519924},{x:39.93110710953261,y:116.47826445165379},{x:39.93123335422962,y:116.48470554442213},{x:39.92290539793581,y:116.48476689894983},{x:39.92292892405216,y:116.48958324436717},{x:39.92041505411736,y:116.48958621057511},{x:39.92061199491248,y:116.48458869308206},{x:39.91549134691785,y:116.48462819872975}];
                        //华贸、、万达、新街大院        
                        // var _poly=[{x:39.910657465318295,y:116.48556298406083},{x:39.90842194089212,y:116.48488913093593},{x:39.90825395057868,y:116.48408050770047},{x:39.908421940966186,y:116.46180968044155},{x:39.91919830466395,y:116.46167491020196},{x:39.91654959542365,y:116.46954213855497},{x:39.91591780016852,y:116.47273775100246},{x:39.91558185629042,y:116.47807803283774},{x:39.9154526465008,y:116.485911569049},{x:39.91396671659708,y:116.48613057112163},{x:39.91220940105458,y:116.48613057112163}];


                        var xx=PointInPoly(pt,_poly);


                        //      if (xx == true && distance<2.5 &&a>0 && a<15) {
                        if (xx == true &&a>0 && a<15) {
                            (function (orderid, intva) {
                                setTimeout(function () {


                                    // console.log(orderid)
                                    if (isdebug == false) {
                                        console.log("进入派单环节"+";订单距离:"+distance)
                                        process_one(orderid)
                                    }
                                }, intva)
                            })(orderid, intva)
                            intva += dingdang_interval

                        } else {
                            //  console.log("地址匹配状况",address_ok(address),"订单号匹配情况",ddok(item["originMarkNo"]),"商家匹配情况:",sn)
                        }
                    }
                    setTimeout(function () {
                        page_over = true
                    }, intva)

                } else {
                    console.log("请求返回状态为，", data["status"], "当前页面为", page)
                }
            }
        })
    }
    var y_contral = 0
  
         alert("精品超市-针织路京客隆接单中、开始接单”")
            y_contral = setInterval(function () {
                page_process($(".page-item").length - 2)
                //page_process(2)
            }, page_interval)

          console.log("加速刷新订单、自动派单中......")

      

})();