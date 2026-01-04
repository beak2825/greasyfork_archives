// ==UserScript==
// @name         1徐-团结湖京客隆（画圈）+X+Z
// @namespace    http://tampermonkey.net/
// @version      2024-10-28完成版
// @description  try to take over the world!
// @author       You
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @license MI
// @match        *://portal.imdada.cn/app/*
// @match        *://dauth.imdada.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422138/1%E5%BE%90-%E5%9B%A2%E7%BB%93%E6%B9%96%E4%BA%AC%E5%AE%A2%E9%9A%86%EF%BC%88%E7%94%BB%E5%9C%88%EF%BC%89%2BX%2BZ.user.js
// @updateURL https://update.greasyfork.org/scripts/422138/1%E5%BE%90-%E5%9B%A2%E7%BB%93%E6%B9%96%E4%BA%AC%E5%AE%A2%E9%9A%86%EF%BC%88%E7%94%BB%E5%9C%88%EF%BC%89%2BX%2BZ.meta.js
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
    var page_interval = 300
    var dingdang_interval = 300
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
    //计算商家坐标一个点是否在多边形里,参数:点,多边形数组


    function SuPointInPoly(supt, poly1) {
        for (var d = false, i = -1, l = poly1.length, j = l - 1; ++i < l; j = i)
            ((poly1[i].y <= supt.y && supt.y < poly1[j].y) || (poly1[j].y <= supt.y && supt.y < poly1[i].y))
        && (supt.x < (poly1[j].x - poly1[i].x) * (supt.y - poly1[i].y) / (poly1[j].y - poly1[i].y) + poly1[i].x)
        && (d = !d);
        return d;
    }

    function process_one(dd_id) {
        //  console.log("当前正在处理页面dd_id"+dd_id)
        if (isdebug == true) {
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
                {"orderId":dd_id,"transporterId":6933459}
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
        if (page_over == true) {
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
                //查询订单
                {"dadaCityInfos":[],"shopIds":[],"orderIdList":[],"receiverPhone":"","supplierIds":[],"pageNum":1,"pageSize":50,"dispatchDisplayStatus":1,"sortCondition":"DELIVER_DISTANCE","sortDirection":"ASC","addAllowanceStatus":0}

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
                        var sulat =item.supplierInfo.supplierLat
                        var sulng =item.supplierInfo.supplierLng

                        // console.log(lat)
                        // console.log(lng)
                        //调用
                        var pt=new point();
                        pt.x=lat;
                        pt.y=lng;
                        var supt=new point();
                        supt.x=sulat;
                        supt.y=sulng;
                        //这里的下x，y坐标是多边形的顺时针的拐角节点来排序的
                        //   》》》》》道家园+人民日报+红庙+延静里+慈云寺+万达
                        //派送地址范围
                        var _poly=[{x:39.93373095,y:116.46188461},{x:39.93374481,y:116.47370627},{x:39.92298837,y:116.47334472},{x:39.92323789,y:116.46154128}];
                        //商家地址范围
                        var _poly1=[{x:39.93244156,y:116.46596456},{x:39.93241258,y:116.46833018},{x:39.92990893,y:116.46802787},{x:39.92987995,y:116.46573028}];

                        var xx=PointInPoly(pt,_poly);
                        var yy=SuPointInPoly(supt,_poly1);


                        //       if (xx == true && distance<2.5 &&a>0 && a<15) {
                        if (xx == true &&yy == true &&a>0 && a<15) {
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
    document.onkeydown = cdk;
    function cdk() {
        if (event.ctrlKey && event.altKey && event.keyCode == 88) {
            alert("程序启动")
         

            console.log("键盘按下")
        }
        if (event.ctrlKey && event.altKey && event.keyCode == 90) {
            clearInterval(y_contral)
            alert("已清除")
            console.log("键盘按下")
        }
    }
})();