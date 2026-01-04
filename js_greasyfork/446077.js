// ==UserScript==
// @name         美团开店宝
// @namespace    https://wanhao.zhu-lang.com
// @version      6.0.3
// @description  更新服务地址为https://wanhao.zhu-lang.com
// @author       wbsheng
// @match        https://ecom.meituan.com/meishi/
// @match        https://ecom.meituan.com/meishi
// @icon         https://awp-assets.meituan.net/nibfe/msfe-portal/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      *
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.js
// @require      https://unpkg.com/notiflix@2.7.0/dist/notiflix-aio-2.7.0.min.js
// @require      https://cdn.staticfile.org/PickMeUp/3.2.1/pickmeup.min.js
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/446077/%E7%BE%8E%E5%9B%A2%E5%BC%80%E5%BA%97%E5%AE%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/446077/%E7%BE%8E%E5%9B%A2%E5%BC%80%E5%BA%97%E5%AE%9D.meta.js
// ==/UserScript==
(function() {
    'use strict';
    $(document.body).append(`<style type="text/css">.pickmeup{background:#000;border-radius:.4em;-moz-box-sizing:content-box;box-sizing:content-box;display:inline-block;position:absolute;touch-action:manipulation}.pickmeup *{-moz-box-sizing:border-box;box-sizing:border-box}.pickmeup.pmu-flat{position:relative}.pickmeup.pmu-hidden{display:none}.pickmeup .pmu-instance{display:inline-block;height:13.8em;padding:.5em;text-align:center;width:15em}.pickmeup .pmu-instance .pmu-button{color:#eee;cursor:pointer;outline:none;text-decoration:none}.pickmeup .pmu-instance .pmu-today{background:#17384d;color:#88c5eb}.pickmeup .pmu-instance .pmu-button:hover{background:transparent;color:#88c5eb}.pickmeup .pmu-instance .pmu-not-in-month{color:#666}.pickmeup .pmu-instance .pmu-disabled,.pickmeup .pmu-instance .pmu-disabled:hover{color:#333;cursor:default}.pickmeup .pmu-instance .pmu-selected{background:#136a9f;color:#eee}.pickmeup .pmu-instance .pmu-not-in-month.pmu-selected{background:#17384d}.pickmeup .pmu-instance nav{color:#eee;display:-ms-flexbox;display:-webkit-flex;display:flex;line-height:2em}.pickmeup .pmu-instance nav *:first-child :hover{color:#88c5eb}.pickmeup .pmu-instance nav .pmu-prev,.pickmeup .pmu-instance nav .pmu-next{display:none;height:2em;width:1em}.pickmeup .pmu-instance nav .pmu-month{width:14em}.pickmeup .pmu-instance .pmu-years *,.pickmeup .pmu-instance .pmu-months *{display:inline-block;line-height:3.6em;width:3.5em}.pickmeup .pmu-instance .pmu-day-of-week{color:#999;cursor:default}.pickmeup .pmu-instance .pmu-day-of-week *,.pickmeup .pmu-instance .pmu-days *{display:inline-block;line-height:1.5em;width:2em}.pickmeup .pmu-instance .pmu-day-of-week *{line-height:1.8em}.pickmeup .pmu-instance:first-child .pmu-prev,.pickmeup .pmu-instance:last-child .pmu-next{display:block}.pickmeup .pmu-instance:first-child .pmu-month,.pickmeup .pmu-instance:last-child .pmu-month{width:13em}.pickmeup .pmu-instance:first-child:last-child .pmu-month{width:12em}.pickmeup:not(.pmu-view-days) .pmu-days,.pickmeup:not(.pmu-view-days) .pmu-day-of-week,.pickmeup:not(.pmu-view-months) .pmu-months,.pickmeup:not(.pmu-view-years) .pmu-years{display:none}</style>`)
    $(document.body).append(`<style type="text/css">.ecom_button{position:fixed;z-index:9999;min-width:12rem;padding:1rem 1rem;border-radius:0.5rem;background:linear-gradient(to right bottom,#00ffb3,#00f2aa,#00e5a1,#00d998,#00cc8f);font-size:1.2rem;line-height:1.5;font-weight:500;}</style>`)
    //var mainUrl='http://127.0.0.1:8082/';
    var mainUrl ='https://wanhao.zhu-lang.com/api/'
    var getAccountUrl='https://ecom.meituan.com/meishi/gw/account/biz/getUserInfo';
    var getPoiUrl='https://ecom.meituan.com/meishi/gw/rpc/home/-/TEcomOperationDataService/getCityPoiIndex';
    var getPoiListByDealIdUrl='https://ecom.meituan.com/activity/gw/rpc/verifyHistory/ReceiptQueryBusinessService/getPoiListByDealId';
    var poiCompareDataUrl='https://ecom.meituan.com/emis/gw/rpc/TEcomBusinessAnalysisService/getTPagePoiCompareData';
    var historyListDataUrl='https://ecom.meituan.com/activity/gw/rpc/verifyHistory/ReceiptQueryBusinessService/getHistoryListData';
    var feedbackSummaryUrl='https://ecom.meituan.com/emis/gw/rpc/TFeedbackEcomService/getFeedbackSummary';
    var queryFeedbackUrl='https://ecom.meituan.com/emis/gw/rpc/TFeedbackEcomService/queryFeedback';
    var launchFilterInfoUrl='https://midas.dianping.com/shopdiy/promotion/cpc/ajax/launchFilterInfo';
    var boardReportUrl='https://midas.dianping.com/shopdiy/report/datareport/pc/ajax/getBoardReport';
    var getTableReportUrl='https://midas.dianping.com/shopdiy/report/datareport/pc/ajax/getTableReport'
    var queryMenuListUrl='https://midas.dianping.com/shopdiy/common/ajax/queryMenuList';
    var getTableUrl='https://midas.dianping.com/shopdiy/report/datareport/cpm/getTable';
    var getLaunchListUrl='https://midas.dianping.com/shopdiy/report/datareport/cpm/getLaunchList';
    var getReceiptDetailUrl='https://ecom.meituan.com/activity/gw/rpc/couponQuery/ReceiptQueryBusinessService/getReceiptDetail';
    var detailEntryUrl='https://biztonemeishi.meituan.com/api/nibmp/mva/gateway-proxy/mpmctentry/detailEntry';
    var tPagePoiCompareDataV3Url='https://ecom.meituan.com/emis/gw/TEcomBusinessAnalysisService/getTPagePoiCompareDataV3'
    Notiflix.Loading.Init({
        timeout:20000,
        clickToClose: false,
        customSvgUrl: 'https://www.notiflix.com/content/media/icon/notiflix-loading-notiflix.svg',
        cssAnimationDuration: 1000
    });
    function loading(msg){
        $(".ecom_button").css("display", 'none')
        Notiflix.Block.Pulse('.loadClass', msg);
    }
    function cloaseLoading(){
        $(".ecom_button").css("display", '')
        Notiflix.Block.Remove('.loadClass')
    }
    function succ(msg){
        Notiflix.Notify.Success(msg)
    }
    function error(msg){
        Notiflix.Notify.Failure(msg)
    }
    function warning(msg){
        Notiflix.Notify.Warning(msg)
    }
    function checkAuditTime(beginTime, endTime) {
        var nowDate = new Date();
        var beginDate = new Date(nowDate);
        var endDate = new Date(nowDate);

        var beginIndex = beginTime.lastIndexOf("\:");
        var beginHour = beginTime.substring(0, beginIndex);
        var beginMinue = beginTime.substring(beginIndex + 1, beginTime.length);
        beginDate.setHours(beginHour, beginMinue, 0, 0);

        var endIndex = endTime.lastIndexOf("\:");
        var endHour = endTime.substring(0, endIndex);
        var endMinue = endTime.substring(endIndex + 1, endTime.length);
        endDate.setHours(endHour, endMinue, 0, 0);
        return nowDate.getTime() - beginDate.getTime() >= 0 && nowDate.getTime() <= endDate.getTime();
    }
    function getNowTime(){
        return (new Date()).getTime()
    }
    function getYesterday(){
        var time=(new Date()).getTime()-24*60*60*1000;
        var yesterday=new Date(time);
        var month=yesterday.getMonth();
        var day=yesterday.getDate();
        yesterday=yesterday.getFullYear() + "-" + (yesterday.getMonth()> 9 ? (yesterday.getMonth() + 1) : "0" + (yesterday.getMonth() + 1)) + "-" +(yesterday.getDate()> 9 ? (yesterday.getDate()) : "0" + (yesterday.getDate()));
        return yesterday
    }
    function getStartTime(){
        return new Date(getYesterday()+' 00:00:00').getTime();
    }
    function getEndTime(){
        return new Date(getYesterday()+' 23:59:59').getTime();
    }

    function getCompareBeginDate(tmpStartDate,tmpEndDate){
        var cd=parseInt(tmpEndDate.replaceAll('-',''))-parseInt(tmpStartDate.replaceAll('-',''))+1;
        var time=(new Date(tmpStartDate)).getTime()-cd*24*60*60*1000;
        var yesterday=new Date(time);
        var month=yesterday.getMonth();
        var day=yesterday.getDate();
        yesterday=yesterday.getFullYear() + "-" + (yesterday.getMonth()> 9 ? (yesterday.getMonth() + 1) : "0" + (yesterday.getMonth() + 1)) + "-" +(yesterday.getDate()> 9 ? (yesterday.getDate()) : "0" + (yesterday.getDate()));
        return yesterday
    }

    function getCompareEndDate(tmpStartDate){
        var time=(new Date(tmpStartDate)).getTime()-24*60*60*1000;
        var yesterday=new Date(time);
        var month=yesterday.getMonth();
        var day=yesterday.getDate();
        yesterday=yesterday.getFullYear() + "-" + (yesterday.getMonth()> 9 ? (yesterday.getMonth() + 1) : "0" + (yesterday.getMonth() + 1)) + "-" +(yesterday.getDate()> 9 ? (yesterday.getDate()) : "0" + (yesterday.getDate()));
        return yesterday
    }

    function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    //开始时间，结束时间
    var startTime=getStartTime();
    var endTime=getEndTime();
    //账号信息
    var accountInfo={};
    //店铺信息
    var poiInfos=[];
    var poiInfoMap=new Map();
    //订单核销数量
    var verifyCountMap=new Map();
    //自然流量-uv
    var flowMap=new Map();
    //智选展位数据
    var ncpmMap=new Map();

    //代金券核销
    var shopCashCouponNumMap=new Map()
    //最后结果
    var result=[];

    //推广数据
    var boardReportCount=0
    var podName2ShopIdMap=new Map()
    var shopId2PoiIdMap=new Map()
    var poiName2IdMap=new Map()
    var boardReportMap=new Map()
    var visitorMap=new Map()

    //店铺对应计划
    var launches=[]
    var launchesCount=0
    //入口图点击率
    var shopPhotoClickCount=0
    var shopPhotoClickMap=new Map()

    var moreDataCount=0
    //周报参数
    var clickNum=-1
    var startWeekDate=''
    var endWeekDate=''
    var bstartWeekDate=''
    var bendWeekDate=''
    var poiName2PoiIdMap = new Map()
    var weekshopId2PoiIdMap = new Map()
    var weekAccount=''
    var pcNo=''
    var weeklaunches = []
    var weeklaunchesCount =0
    var tableReportDetail=[]
    var ncpmMapDetail=[];
    var receiptDetail = []
    var isOpenTab=0

    function getBaseData(){
        succ('开始爬取-自然流量：曝光、访问人数')

        $.when(
            //r-start
            //自然流量-曝光，访问人数
            $.ajax({url: poiCompareDataUrl+'?_tm='+getNowTime(),type: 'POST',dataType: 'json',contentType: 'application/json',data:  JSON.stringify({"tOptionType":1,"pageDomain":{"currPage":0,"pageSize":1000,"totalNum":0},"sortOrder":"desc","sortKey":"viewUv"})})
        ).done(function(r4){
            //自然流量-曝光，访问人数
            succ('结束爬取-自然流量：曝光、访问人数')
            var totalNum=0

            if(r4.data.pageDomain!=null){
                totalNum=r4.data.pageDomain.totalNum
            }

            if(r4.data.tPoiCompareDatas!=null){
                $.each(r4.data.tPoiCompareDatas, function (pcn, pc) {
                    var pcjson={};
                    pcjson.viewUv=pc.viewUv
                    pcjson.visitUv=pc.visitUv
                    flowMap.set(pc.poiName,pcjson)
                })
            }
            //console.log('自然流量：曝光、访问人数',flowMap)
            succ('开始爬取-自然流量：订单核销，门店统计：代金券核销')
            getReceiptDetailData(0)

        }).fail(function(obj,status,msg){
            //console.log('obj',obj,'status',status,'msg',msg)
            warning(' 爬取失败-自然流量：曝光、访问人数，自然流量：订单核销，门店统计：代金券核销')
            succ('重置参数，重新爬取-自然流量：曝光、访问人数，自然流量：订单核销，门店统计：代金券核销')
            getBaseData()
        })
    }
    function getReceiptDetailData(reqnum){
        succ('爬取-自然流量：订单核销，门店统计：代金券核销。。。。'+reqnum)
        $.when(
            //订单核销getReceiptDetailUrl
            $.get(getReceiptDetailUrl+'?_tm='+getNowTime()+'&request={"bizAcctId":21387461,"dealId":"0","poiId":"0","filter":"2","beginTime":"'+(startTime/1000)+'","endTime":"'+(endTime/1000)+'","offset":'+reqnum+',"limit":50}'),
        ).done(function(r5){
            var tmpreceiptDetail=r5.data.details
            receiptDetail=receiptDetail.concat(tmpreceiptDetail)
            if(tmpreceiptDetail!=null&&tmpreceiptDetail.length==50){
                getReceiptDetailData(reqnum+50)
            }else{
                succ('结束爬取-自然流量：订单核销，门店统计：代金券核销')
                //订单核销

                $.each(receiptDetail, function (vcn, vc) {

                    //console.log('vc',vc)
                    if(vc!=null){
                        var poiId=vc.poiId+''
                        //自然流量-订单核销
                        var verifyCount=verifyCountMap.get(poiId)
                        if(verifyCount>0){
                            verifyCount++;
                        }else{
                            verifyCount=1
                        }
                        verifyCountMap.set(poiId,verifyCount)
                        //门店统计-代金券核销
                        var dealName=vc.dealName

                        if(dealName.indexOf("代金券")>-1){
                            var shopCashCouponNum=shopCashCouponNumMap.get(poiId);
                            if(shopCashCouponNum>0){
                                shopCashCouponNum++;
                            }else{
                                shopCashCouponNum=1
                            }
                            shopCashCouponNumMap.set(poiId,shopCashCouponNum)
                        }
                    }
                })


                //console.log('自然流量：订单核销',verifyCountMap)
                //console.log('门店统计：代金券核销',shopCashCouponNumMap)

                //开始组装数据
                //遍历需要抓取的店铺数据
                succ('开始爬取-门店星级：星级评分、新增评价、新增中差评')
                getMoreData(poiInfos[0])
            }
        }).fail(function(obj,status,msg){
            //console.log('obj',obj,'status',status,'msg',msg)
            warning(' 爬取失败-自然流量：订单核销，门店统计：代金券核销')
            succ('重置参数，重新爬取-自然流量：订单核销，门店统计：代金券核销')
            getReceiptDetailData(reqnum)
        })
    }

    function getMoreData(r){
        //console.log('开始爬取：'+r.poiName+'-门店星级：星级评分、新增评价、新增中差评')
        var pid=r.poiId
        //自然流量曝光、访问
        var m=flowMap.get(r.poiName)
        if(m!=null){
            r.visitUv=m.visitUv
            r.viewUv=m.viewUv
        }else{
            r.visitUv=0
            r.viewUv=0
        }
        //订单核销
        var verifyCount=verifyCountMap.get(pid)
        if(verifyCount!=null){
            r.orderUse=verifyCount
        }else{
            r.orderUse=0
        }
        //代金券核销、套餐核销
        var shopCashCouponNum=shopCashCouponNumMap.get(pid);
        if(shopCashCouponNum!=null){
            r.shopCashCouponNum=shopCashCouponNum
            r.shopSetMealNum=r.orderUse-shopCashCouponNum
        }else{
            r.shopCashCouponNum=0
            r.shopSetMealNum=r.orderUse
        }
        $.when(
            //r-start
            //门店星级-星级评分
            $.ajax({url: feedbackSummaryUrl+'?_tm='+getNowTime(),type: 'POST',dataType: 'json', contentType: 'application/json',data:  JSON.stringify({"platform":1,"queryPara":{"platform":1,"startTime":startTime,"endTime":endTime,"starTag":-1,"businessTag":"-1","poiId":r.poiId}})}),
            //新增好评
            $.ajax({ url: queryFeedbackUrl+'?_tm='+getNowTime(),type: 'POST',dataType: 'json',contentType: 'application/json',data:  JSON.stringify({"platform":1,"queryPara":{"platform":1,"referTag":0,"startTime":startTime,"endTime":endTime,"starTag":1,"businessTag":"-1","poiId":r.poiId},"pageInfo":{"total":0,"offset":0,"limit":10}})}),
            //新增中差评
            $.ajax({url: queryFeedbackUrl+'?_tm='+getNowTime(),type: 'POST',dataType: 'json',contentType: 'application/json',data:  JSON.stringify({"platform":1,"queryPara":{"platform":1,"referTag":0,"startTime":startTime,"endTime":endTime,"starTag":0,"businessTag":"-1","poiId":r.poiId},"pageInfo":{"total":0,"offset":0,"limit":10}})})
        ).done(function(r1,r2,r3){
            r.score=r1[0].data.avgScore
            r.goodFeedbacks = r2[0].data.total
            r.mediumFeedbacks=r3[0].data.total
            r.totalFeedbacks = r.goodFeedbacks + r.mediumFeedbacks
            result.push(r)
            moreDataCount++
            if(moreDataCount<poiInfos.length){
                getMoreData(poiInfos[moreDataCount])
            }else{
                succ('结束爬取-门店星级：星级评分、新增评价、新增中差评')
                //推广数据递归获取
                succ('开始爬取-门店对应shopId数据')
                getBoardReportShopId()
            }
        }).fail(function(obj,status,msg){
            //console.log('obj',obj,'status',status,'msg',msg)
            warning('店铺：'+r.poiName+'，门店星级：星级评分、新增评价、新增中差评 爬取失败！')
            succ('重新爬取-店铺：'+r.poiName+'，门店星级：星级评分、新增评价、新增中差评')
            getMoreData(r)
        })
    }
    //获取店铺对应的shopId
    function getBoardReportShopId(){
        GM_xmlhttpRequest({
            url:launchFilterInfoUrl,
            method :"get",
            onload:function(xhr){
                var data=$.parseJSON( xhr.responseText )
                //console.log('getBoardReportShopId',data)
                $.each(data.msg.shopList, function (shopn, shop) {
                    podName2ShopIdMap.set(shop.shopName,shop.shopId)
                    shopId2PoiIdMap.set(shop.shopId,poiName2IdMap.get(shop.shopName))
                })
                //console.log('结束爬取-门店对应shopId数据podName2ShopIdMap',podName2ShopIdMap)
                succ('结束爬取-门店对应shopId数据')
                succ('开始爬取-推广数据：花费、曝光、点击均价、团购订单量、收藏')
                boardReport(poiInfos[0])
            },
            onerror:function(obj,status,msg){
                //console.log('obj',obj,'status',status,'msg',msg)
                getBoardReportShopId()
            }
        })
    }

    function boardReport(br){
        var poiId=br.poiId+''
        var poiName=br.poiName.replace('（','(').replace('）',')')
        var shopId=podName2ShopIdMap.get(poiName)
        //console.log('开始爬取：'+br.poiName+'-推广数据：花费、曝光、点击均价、团购订单量、收藏')
        GM_xmlhttpRequest({
            url:boardReportUrl+'?shopIds='+shopId+'&launchIds=0&objectUnit=shop&platform=0&beginDate='+getYesterday()+'&endDate='+getYesterday()+'&timeUnit=hour&tabIds=T30001%2CT30002%2CT30004%2CT30012%2CT30026%2CT30020%2CT30003',
            method :"get",
            onload:function(xhr){
                var data=$.parseJSON( xhr.responseText)
                var r={}
                if(data.msg.total!=null){
                    $.each(data.msg.total, function (boardd1, boardd) {
                        var boardname=boardd.name
                        var boardvalue=boardd.value
                        if(boardname=='花费'){
                            r.extensionCost=boardvalue
                        }else if(boardname=='曝光'){
                            r.extensionViewUv=boardvalue
                        }else if(boardname=='点击均价'){
                            r.extensionClickAvgCost=boardvalue
                        }else if(boardname=='团购订单量'){
                            r.extensionOrderNum=boardvalue
                        }else if(boardname=='收藏'){
                            r.extensionCollectionNum=boardvalue
                        }
                    })
                    boardReportMap.set(poiId,r)
                }

                boardReportCount++
                if(boardReportCount<poiInfos.length){
                    boardReport(poiInfos[boardReportCount])
                }else{
                    succ('结束爬取-推广数据：花费、曝光、点击均价、团购订单量、收藏')
                    //console.log('推广数据：花费、曝光、点击均价、团购订单量、收藏',boardReportMap)

                    //要调用其他疑难数据咯
                    //智选展位数据
                    //判断账号是否开通
                    succ('开始爬取-NCPM数据：花费、曝光、点击、点击均价')
                    haveNcpm()
                }
            },
            onerror:function(obj,status,msg){
                //console.log('obj',obj,'status',status,'msg',msg)
                warning('店铺：'+br.poiName+'，推广数据：花费、曝光、点击均价、团购订单量、收藏 爬取失败')
                succ('重新爬取-店铺：'+br.poiName+'，推广数据：花费、曝光、点击均价、团购订单量、收藏 爬取失败')
                boardReport(br)
            }
        })
    }
    //判断是否有智选展位菜单
    function haveNcpm(){
        GM_xmlhttpRequest({
            url:queryMenuListUrl,
            method :"get",
            onload:function(xhr){
                var data=$.parseJSON( xhr.responseText )
                var havaMenu=false
                $.each(data.msg.menuList, function (menu1, menud) {
                    if(menud.title=='智选展位'){
                        havaMenu=true
                    }
                })
                if(havaMenu){
                    succ('拥有智选展位菜单')
                    //console.log('拥有智选展位菜单')
                    succ('获取推广计划')
                    getLaunches()
                }else{
                    //console.log('没有智选展位菜单')
                    warning('没有智选展位菜单')
                    //没有智选展位，智选其他的
                    //console.log('开始跑入口图点击率')

                    succ('开始爬取-客流分析：收藏人数、打卡人数')
                    //console.log('开始爬取-客流分析：收藏人数、打卡人数')
                    getBusinessAnalysisData()
                }
            },
            onerror:function(obj,status,msg){
                //console.log('obj',obj,'status',status,'msg',msg)
                warning('判断是否有智选展位失败')
                succ('重新爬取判断是否有智选展位')
                haveNcpm()
            }
        })
    }
    //获取推广计划
    function getLaunches(){
        var statusGroups=[];
        //获取推广计划
        GM_xmlhttpRequest({
            url:getLaunchListUrl+'?_='+getNowTime(),
            method :"get",
            onload:function(xhr){
                var data=$.parseJSON( xhr.responseText )
                statusGroups=data.msg.statusGroups
                //获取推广计划
                if(statusGroups.length>0){
                    $.each(statusGroups, function (launchn, launchd) {
                        if(launchd.status!=0&&launchd.status!=5&&launchd.status!=6){
                            $.each(launchd.launches, function (launchn1, launchd1) {
                                launches.push(launchd1)
                            })
                        }
                    })

                    if(launches.length<1){
                        //有智选展位，没有店铺开通
                        warning('有智选展位，没有推广计划')
                        //console.log('有智选展位，没有推广计划')
                        succ('开始爬取-客流分析：收藏人数、打卡人数')
                        //console.log('开始爬取-客流分析：收藏人数、打卡人数')
                        getBusinessAnalysisData()

                    }else{
                        succ('成功获取-推广计划')
                        getTable(launches[0])
                    }
                }else{
                    //有智选展位，没有店铺开通
                    warning('有智选展位，没有推广计划')
                    //console.log('有智选展位，没有推广计划')
                    succ('开始爬取-客流分析：收藏人数、打卡人数')
                    //console.log('开始爬取-客流分析：收藏人数、打卡人数')
                    getBusinessAnalysisData()

                }
            },
            onerror:function(obj,status,msg){
                //console.log('obj',obj,'status',status,'msg',msg)
                warning('获取推广计划失败')
                succ('重新获取推广计划')
                getLaunches()
            }
        })
    }


    //ncpm获取店铺对应计划的数据
    function getTable(ld){
        var shopid=ld.shopId+''
        //console.log('开始爬取：'+shopid+'-NCPM数据：花费、曝光、点击、点击均价')
        GM_xmlhttpRequest({
            url:getTableUrl+'?brandId=0&planId=0&originalMaterialId=0&launchId='+ld.launchId+'&beginDate='+getYesterday()+'&endDate='+getYesterday()+'&tabIds=T1001%2CT1002%2CT1003%2CT1004%2CT1006%2CT1005%2CT1010%2CT1022%2CT1009%2CT1022&groupByDimension=1',
            method :"get",
            onload:function(xhr){
                var data=$.parseJSON( xhr.responseText )
                //解析ncpm数据放入map
                var tableData=data.msg.total
                var titleData=data.msg.title
                var ncpm={}

                titleData.forEach((item,index,array)=>{
                    if(item=='曝光（次）'){
                        ncpm.ncpmViewUv=parseFloat(tableData[index].replace(',',''))
                    }else if(item=='点击（次）'){
                        ncpm.ncpmClickNum=parseFloat(tableData[index])
                    }else if(item=='点击均价（元）'){
                        ncpm.ncpmClickAvgCost=parseFloat(tableData[index])
                    }else if(item=='团购订单量（次）'){
                        ncpm.ncpmOrderNum=parseFloat(tableData[index])
                    }else if(item=='花费（元）'){
                        ncpm.ncpmCost=parseFloat(tableData[index])
                    }
                })
                var ncpmDetail = {}

                var poiId = shopId2PoiIdMap.get(shopid)
                var nctmp=ncpmMap.get(poiId)
                if(nctmp!=null){
                    ncpm.ncpmCost+=nctmp.ncpmCost
                    ncpm.ncpmViewUv+=nctmp.ncpmViewUv
                    ncpm.ncpmClickNum+=nctmp.ncpmClickNum
                    ncpm.ncpmOrderNum+=nctmp.ncpmOrderNum
                    ncpm.ncpmClickAvgCost=ncpm.ncpmCost/ncpm.ncpmClickNum
                }
                ncpmMap.set(poiId,ncpm)
                launchesCount++
                if(launchesCount<launches.length){
                    getTable(launches[launchesCount])
                }else{
                    succ('结束爬取-NCPM数据：花费、曝光、点击、点击均价,团购订单量')
                    console.log('NCPM数据：花费、曝光、点击、点击均价，团购订单量',ncpmMap)
                    //智选展位跑完，可以跑其他的了
                    succ('开始爬取-客流分析：收藏人数、打卡人数')
                    //console.log('开始爬取-客流分析：收藏人数、打卡人数')
                    getBusinessAnalysisData()
                }
            },
            onerror:function(obj,status,msg){
                //console.log('obj',obj,'status',status,'msg',msg)
                warning('店铺：'+shopid+'，NCPM数据：花费、曝光、点击、点击均价,团购订单量')
                succ('重新爬取-店铺：'+shopid+'，NCPM数据：花费、曝光、点击、点击均价,团购订单量')
                getTable(ld)
            }
        })
    }


    //入口图点击率
    function getDetailEntry(pid){
        GM_xmlhttpRequest({
            url:detailEntryUrl+'?poiId='+pid,
            method :"get",
            onload:function(xhr){
                var data=$.parseJSON( xhr.responseText )
                if(data.msg!='无功能权限!'){
                    //console.log('开始爬取：'+pid+'-门店统计：入口图点击率')
                    shopPhotoClickMap.set(pid, data.data.clickRate)
                }
                shopPhotoClickCount++
                if(shopPhotoClickCount<poiInfos.length){
                    getDetailEntry(poiInfos[shopPhotoClickCount].poiId)
                }else{
                    succ('结束爬取-门店统计：入口图点击率')
                    //console.log('结束爬取-门店统计：入口图点击率',shopPhotoClickMap)
                    succ('结束爬取数据')
                    succ('整合数据')
                    //开始组装剩下的数据
                    result.forEach(rt=>{
                        var ncpm= ncpmMap.get(rt.poiId)
                        if(ncpm!=null){
                            //console.log(rt.poiId,ncpm)
                            rt.ncpmClickNum=ncpm.ncpmClickNum
                            rt.ncpmOrderNum=ncpm.ncpmOrderNum
                            rt.ncpmClickAvgCost=ncpm.ncpmClickAvgCost
                            rt.ncpmCost=ncpm.ncpmCost
                            rt.ncpmViewUv=ncpm.ncpmViewUv
                        }else{
                            rt.ncpmCost=0
                            rt.ncpmClickAvgCost=0
                            rt.ncpmOrderNum=0
                            rt.ncpmViewUv=0
                            rt.ncpmClickNum=0
                        }
                        var boardReport= boardReportMap.get(rt.poiId)
                        if(boardReport!=null){
                            rt.extensionClickAvgCost=boardReport.extensionClickAvgCost
                            rt.extensionOrderNum=boardReport.extensionOrderNum
                            rt.extensionCollectionNum=boardReport.extensionCollectionNum
                            rt.extensionCost=boardReport.extensionCost
                            rt.extensionViewUv=boardReport.extensionViewUv
                        }else{
                            rt.extensionCost=0
                            rt.extensionClickAvgCost=0
                            rt.extensionOrderNum=0
                            rt.extensionViewUv=0
                            rt.extensionCollectionNum=0
                        }
                        var shopPhoto = shopPhotoClickMap.get(rt.poiId)
                        if(shopPhoto!=null){
                            rt.shopPhotoClick=shopPhoto
                        }else{
                            rt.shopPhotoClick=0
                        }

                        var tdata=visitorMap.get(rt.poiId)
                        if(tdata!=null){
                            rt.visitorCollectionNum=tdata.visitorCollectionNum
                            rt.visitorClockinginNum=tdata.visitorClockinginNum
                        }else{
                            rt.visitorCollectionNum=0
                            rt.visitorClockinginNum=0
                        }
                    })
                    succ('保存数据')
                    saveData()
                }
            },
            onerror:function(obj,status,msg){
                //console.log('obj',obj,'status',status,'msg',msg)
                warning('店铺：'+pid+'，门店统计：入口图点击率')
                succ('重新爬取-店铺：'+pid+'，门店统计：入口图点击率')
                getDetailEntry(pid)
            }
        })
    }

    function getBusinessAnalysisData(){
        succ('开始爬取-客流分析：收藏人数、打卡人数')
        $.when(
            //经营参谋-》业务分析
            $.ajax({url: tPagePoiCompareDataV3Url+'?_tm='+getNowTime(),type: 'POST',dataType: 'json',contentType: 'application/json',
                    data:  JSON.stringify({"optionType":1,"page":{"currPage":0,"pageSize":50,"totalNum":0},"sortOrder":"desc","startTime":0,"endTime":0,"sortKey":"viewUv"})
                   })
        ).done(function(r){
            var cdata= r.data.tPoiCompareDatas
            //console.log('经营参谋-》业务分析',r,cdata)
            //console.log('poiName2IdMap',poiName2IdMap)
            $.each(cdata, function (tdatan, tdata) {
                var poiName=tdata.poiName;
                var td={};
                td.visitorCollectionNum=tdata.collectUserCnt
                td.visitorClockinginNum=tdata.clockInUserCnt
                var poiId=poiName2IdMap.get(poiName.replace('（','(').replace('）',')'))
                visitorMap.set(poiId,td)
                console.log(poiName,poiId,td)
            })
            console.log('客流分析：收藏人数、打卡人数',visitorMap)
            succ('开始爬取-门店统计：入口图点击率')
            //console.log('开始爬取-门店统计：入口图点击率')
            getDetailEntry(poiInfos[0].poiId)
        }).fail(function(obj,status,msg){
            //console.log('obj',obj,'status',status,'msg',msg)
            warning(' 爬取失败-客流分析：收藏人数、打卡人数')
            succ('重置参数，重新客流分析：收藏人数、打卡人数')
            getBusinessAnalysisData()
        })
    }


    //保存最终数据
    function saveData(){
        GM_xmlhttpRequest({
            url:mainUrl+'ecome/reports',
            method :"post",
            data: JSON.stringify(result),
            headers:{
                'Content-Type': 'application/json'
            },
            onload:function(xhr){
                var data=$.parseJSON( xhr.responseText )
                //console.log('保存结束',xhr.responseText)
                succ('开始导出日报')
                window.location.href=mainUrl+'ecome/export/'+accountInfo.account
                cloaseLoading()
                succ('结束导出日报')
            },
            onerror:function(obj,status,msg){
                //console.log('obj',obj,'status',status,'msg',msg)
                warning('保存数据失败')
                succ('重新保存数据')
                saveData()
            }
        })
    }
    // =========周报开始
    //获取推广计划明细数据
    function getTableReportData(xh,st,et){
        GM_xmlhttpRequest({
            url:getTableReportUrl+'?groupUnit=launchId&tabIds=T30001%2CT30002%2CT30003%2CT30004%2CT30012%2CT30026%2CT30020&shopIds=0&launchIds=0&objectUnit=launch&platform=0&beginDate='+st+'&endDate='+et+'&timeUnit=day&compareEnabled=false&compareBeginDate='+getCompareBeginDate(st,et)+'&compareEndDate='+getCompareEndDate(st)+'&orderType=&orderField=&yodaReady=h5&csecplatform=4&csecversion=2.3.1',
            method :"get",
            onload:function(xhr){
                var data=$.parseJSON( xhr.responseText )

                var tdata=data.msg.data
                var size=0;
                if(tdata!=null){
                    size=tdata.length
                    console.log('获取推广计划明细数据',tdata,size)
                    for(var i=0;i<size;i++){
                        var rd=tdata[i]
                        var tDetail = {}
                        tDetail.title=rd.launchName
                        tDetail.poiId=poiName2PoiIdMap.get(rd.shopName)
                        tDetail.cost=rd.T30001
                        tDetail.orderNum=rd.T30020
                        tDetail.collectionNum=rd.T30012
                        tDetail.interestedNum=rd.T30026
                        tDetail.viewUv=rd.T30002
                        tDetail.clickAvgCost=rd.T30004
                        tDetail.clickNum=rd.T30003
                        tDetail.dt = rd.date
                        tDetail.type = 1
                        tDetail.sortNo=i
                        tDetail.bData=xh
                        tDetail.pcNo=pcNo
                        tDetail.beforeData = xh
                        tableReportDetail.push(tDetail)
                    }
                    if(xh==1){
                        getTableReportData(0,bstartWeekDate,bendWeekDate)
                    }else{
                        succ('开始抓取NCPM数据')
                        weekHaveNcpm()
                    }
                }
            },
            onerror:function(obj,status,msg){
                ////console.log('obj',obj,'status',status,'msg',msg)
                warning('获取本周推广通消耗数据失败')
                succ('重新获取本周推广通消耗数据')
                getTableReportData(xh,st,et)
            }
        })
    }

    //判断是否有智选展位菜单
    function weekHaveNcpm(){
        GM_xmlhttpRequest({
            url:queryMenuListUrl,
            method :"get",
            onload:function(xhr){
                var data=$.parseJSON( xhr.responseText )
                var havaMenu=false
                $.each(data.msg.menuList, function (menu1, menud) {
                    if(menud.title=='智选展位'){
                        havaMenu=true
                    }
                })
                if(havaMenu){
                    succ('拥有智选展位菜单')
                    succ('获取推广计划')
                    weekGetLaunches()
                }else{
                    warning('没有智选展位菜单')
                    succ('开始整合数据')
                    saveWeekReportData()
                }
            },
            onerror:function(obj,status,msg){
                warning('判断是否有智选展位失败')
                succ('重新爬取判断是否有智选展位')
                weekHaveNcpm()
            }
        })
    }
    //获取推广计划
    function weekGetLaunches(){
        var statusGroups=[];
        //获取推广计划
        GM_xmlhttpRequest({
            url:getLaunchListUrl+'?_='+getNowTime(),
            method :"get",
            onload:function(xhr){
                var data=$.parseJSON( xhr.responseText )
                statusGroups=data.msg.statusGroups
                //获取推广计划
                if(statusGroups.length>0){
                    $.each(statusGroups, function (launchn, launchd) {
                        if(launchd.status!=0&&launchd.status!=5&&launchd.status!=6){
                            $.each(launchd.launches, function (launchn1, launchd1) {
                                weeklaunches.push(launchd1)
                            })
                        }
                    })
                    //  console.log('推广计划',weeklaunches)

                    if(weeklaunches.length<1){
                        //有智选展位，没有店铺开通
                        warning('有智选展位，没有推广计划')
                        succ('开始整合数据')
                        saveWeekReportData()
                    }else{
                        succ('成功获取-推广计划')
                        weekgetBoardReportShopId()
                    }
                }else{
                    //有智选展位，没有店铺开通
                    warning('有智选展位，没有推广计划')
                    succ('开始整合数据')
                    saveWeekReportData()
                }
            },
            onerror:function(obj,status,msg){
                warning('获取推广计划失败')
                succ('重新获取推广计划')
                weekGetLaunches()
            }
        })
    }


    //获取店铺对应的shopId
    function weekgetBoardReportShopId(){
        GM_xmlhttpRequest({
            url:launchFilterInfoUrl,
            method :"get",
            onload:function(xhr){
                var data=$.parseJSON( xhr.responseText )
                $.each(data.msg.shopList, function (shopn, shop) {
                    weekshopId2PoiIdMap.set(shop.shopId,poiName2PoiIdMap.get(shop.shopName))
                })
                succ('结束爬取-门店对应shopId数据')
                succ('开始爬取-NCPM数据')
                weekGetTable(weeklaunches[0],1,startWeekDate,endWeekDate)
            },
            onerror:function(obj,status,msg){
                weekgetBoardReportShopId()
            }
        })
    }

    //ncpm获取店铺对应计划的数据
    function weekGetTable(ld,xh,st,et){
        var shopid=ld.shopId+''

        GM_xmlhttpRequest({
            url:getTableUrl+'?brandId=0&planId=0&beginDate='+st+'&endDate='+et+'&groupByDimension=1&period=1&timeUnit=day&tabIds=T1001%2CT1002%2CT1003%2CT1004%2CT1006%2CT1005%2CT1010%2CT1022%2CT1009&launchAimCodes=1%2C5&originalMaterialIds=0&launchIds='+ld.launchId+'&yodaReady=h5&csecplatform=4&csecversion=2.3.1',
            method :"get",
            onload:function(xhr){
                var data=$.parseJSON( xhr.responseText )
                console.log(ld.launchId,st,et,data)
                //解析ncpm数据放入map
                var tableData=data.msg.total
                var titleData=data.msg.title
                var mxData=data.msg.data
                //console.log(mxData)
                for (var i=0;i<mxData.length;i++){
                    var ncpm= mxData[i]
                    var ncpmDetail = {}
                    var poiId = weekshopId2PoiIdMap.get(shopid)
                    ncpmDetail.title='NCPM-'+ld.title
                    ncpmDetail.poiId=poiId

                    titleData.forEach((item,index,array)=>{
                        // console.log(item,)
                        if(item=='日期'){
                            ncpmDetail.dt=ncpm[index]
                        }else if(item=='感兴趣（次）'){
                            ncpmDetail.interestedNum=ncpm[index]
                        }else if(item=='收藏（次）'){
                            ncpmDetail.collectionNum=ncpm[index]
                        }else if(item=='花费（元）'){
                            ncpmDetail.cost=ncpm[index]
                        }else if(item=='曝光（次）'){
                            ncpmDetail.viewUv=ncpm[index]
                        }else if(item=='点击（次）'){
                            ncpmDetail.clickNum=ncpm[index]
                        }else if(item=='点击均价（元）'){
                            ncpmDetail.clickAvgCost=ncpm[index]
                        }else if(item=='团购订单量（次）'){
                            ncpmDetail.orderNum=ncpm[index]
                        }
                    })


                    ncpmDetail.type = 2
                    ncpmDetail.sortNo=i
                    ncpmDetail.pcNo=pcNo
                    ncpmDetail.beforeData = xh
                    console.log('ncpmDetail明细',ncpmDetail)
                    if(ncpmDetail.cost>0){
                        ncpmMapDetail.push(ncpmDetail)
                    }
                }

                weeklaunchesCount++
                if(weeklaunchesCount<weeklaunches.length){
                    weekGetTable(weeklaunches[weeklaunchesCount],xh,st,et)
                }else{
                    if(xh==1){
                        weeklaunchesCount=0
                        weekGetTable(weeklaunches[0],0,bstartWeekDate,bendWeekDate)
                    }else{
                        succ('开始整合数据')
                        saveWeekReportData()
                    }

                }
            },
            onerror:function(obj,status,msg){
                ////console.log('obj',obj,'status',status,'msg',msg)
                warning('店铺：'+shopid+'，NCPM数据：花费、曝光、点击、点击均价')
                succ('重新爬取-店铺：'+shopid+'，NCPM数据：花费、曝光、点击、点击均价')
                weekGetTable(ld,xh,st,et)
            }
        })
    }


    function saveWeekReportData(){
        ////console.log('ncpmMapDetail',ncpmMapDetail)
        ////console.log('tableReportDetail',tableReportDetail)
        // console.log('json',JSON.stringify({'ncpmList':ncpmMapDetail,'extensionList':tableReportDetail}))
        GM_xmlhttpRequest({
            url:mainUrl+'ecome/week/reports',
            method :"post",
            data: JSON.stringify({'ncpmList':ncpmMapDetail,'extensionList':tableReportDetail}),
            headers:{
                'Content-Type': 'application/json'
            },
            onload:function(xhr){
                var data=$.parseJSON( xhr.responseText )
                succ('开始导出周报')
                window.location.href=mainUrl+'ecome/export/week/'+weekAccount+'/'+startWeekDate.replaceAll('-','')+'/'+endWeekDate.replaceAll('-','')+'/'+pcNo
                cloaseLoading()
                succ('结束导出周报')
            },
            onerror:function(obj,status,msg){
                warning('保存数据失败')
                succ('重新保存数据')
                saveWeekReportData()
            }
        })
    }
    //=========周报结束


    var button = document.createElement("button"); //创建一个input对象（提示框按钮）
    button.id = "id001";
    button.textContent = "生成日报";
    button.style.marginLeft= "55%";
    button.onclick = function (){
        if(!checkAuditTime("06:00","23:50")){
            Notiflix.Report.Warning('数据还未产出','数据产出时间段为：06:00-23:50','关闭');
            return
        }
        loading('生成日报中...')
        succ('数据初始化')
        //打开营销中心推广产品,登入该模块
        //初始化数据
        //店铺信息
        poiInfos=[];
        poiInfoMap.clear()
        //订单核销数量
        verifyCountMap.clear()
        //自然流量-uv
        flowMap.clear()
        //智选展位数据
        ncpmMap.clear()
        ncpmMapDetail=[]
        //代金券核销
        shopCashCouponNumMap.clear()
        //最后结果
        result=[];
        //推广数据
        boardReportCount=0
        podName2ShopIdMap.clear()
        poiName2IdMap.clear()
        shopId2PoiIdMap.clear()
        boardReportMap.clear()
        visitorMap.clear()
        tableReportDetail=[]
        //店铺对应计划
        launches=[]
        launchesCount=0
        //入口图点击率
        shopPhotoClickCount=0
        shopPhotoClickMap.clear()

        moreDataCount=0
        clickNum =-1
        succ('打开商品通页面')
        succ('打开推广产品页面')
        if(isOpenTab==0){
            GM_openInTab("https://ecom.meituan.com/meishi/?cate=93#https://midas.dianping.com/shopdiy/account/pcCpcEntry?continueUrl=/app/peon-merchant-product-menu/html/index.html", true)
            GM_openInTab("https://ecom.meituan.com/meishi/?cate=93#https://biztonemeishi.meituan.com/web/index", true)
            isOpenTab=1
        }

        //开始获取数据
        $.get(getAccountUrl+'?_tm='+getNowTime(),function(data){
            var account=data.user.userId
            accountInfo.account=account
            var accountName=data.user.login
            accountInfo.accountName=accountName
            succ('获取需要生成日报的店铺')
            GM_xmlhttpRequest({
                url:mainUrl+'ecome/poi/'+account,
                method :"get",
                onload:function(xhr){
                    //console.log('需要生成日报的店铺',xhr.responseText)
                    var data=$.parseJSON( xhr.responseText )
                    if(data.code!=0 || data.list.length<1){
                        cloaseLoading()
                        Notiflix.Confirm.Show( '提示','暂无生成日报店铺数据，请先上传店铺数据，并登入好数据分析平台标记是否生成日报', '确认', '暂不',function(){window.open('https://wanhao.zhu-lang.com',"_blank","")}, function(){} )
                        return
                    }else{
                        data.list.forEach(pinfo=>{
                            //需要导出日报的店铺信息
                            poiInfos.push(pinfo)
                            poiInfoMap.set(pinfo.poiId,pinfo)
                            poiName2IdMap.set(pinfo.poiName.replace('（','(').replace('）',')'),pinfo.poiId)
                        })
                        succ('开始爬取数据')
                        getBaseData()
                    }
                }
            })
        })


    }
    $('#root').append(button)
    $('#id001').attr('class','ecom_button')
    var pbutton = document.createElement("button"); //创建一个input对象（提示框按钮）
    pbutton.id = "id002";
    pbutton.style.marginLeft= "40%";
    pbutton.textContent = "上传店铺数据";
    pbutton.onclick = function (){
        loading('店铺数据上传中...')
        $.when(
            //r-start
            //获取账号信息
            $.get(getAccountUrl+'?_tm='+getNowTime()),
            //获取店铺信息
            $.get(getPoiUrl+'?_tm='+getNowTime()),
        ).done(function(r1,r2){
            //获取账号信息
            var poiInfoss=[]
            var account=r1[0].user.userId
            var accountName=r1[0].user.login
            //获取店铺信息
            $.each(r2[0].data, function (n, v) {
                if(v.cityName!='全部城市'){
                    $.each(v.pois, function (cn, cv) {
                        var poiInfo={}
                        poiInfo.cityId=v.cityId
                        poiInfo.cityName=v.cityName
                        poiInfo.poiId=cv.poiId
                        poiInfo.poiName=cv.poiName
                        poiInfo.account=account
                        poiInfo.accountName=accountName
                        poiInfoss.push(poiInfo)
                    })
                }
            })

            GM_xmlhttpRequest({
                url:mainUrl+'ecome/poi',
                method :"post",
                data: JSON.stringify(poiInfoss),
                headers:{
                    'Content-Type': 'application/json'
                },
                onload:function(xhr){
                    //console.log('上传店铺数据',xhr.responseText)
                    cloaseLoading()
                    Notiflix.Confirm.Show( '提示',poiInfoss.length+'条店铺数据已经成功上传,是否登入好数据分析平台标记是否生成日报?', '确认', '暂不',function(){window.open('https://wanhao.zhu-lang.com',"_blank","")}, function(){  } )
                }
            })
        })
    }
    $('#root').append(pbutton)
    $('#root').attr('class','loadClass')
    $('#id002').attr('class','ecom_button')

    $('#root').append('<div id="pickmeupdata" style="position: fixed;z-index:99999;margin-left:25%;"></div>')
    var pwbutton = document.createElement("button"); //创建一个input对象（提示框按钮）
    pwbutton.id = "id003";
    pwbutton.style.marginLeft= "25%";
    pwbutton.textContent = "生成周报";
    pwbutton.onclick = function (){
        succ('请选择时间范围')
        if(clickNum==-1){
            pickmeup('#pickmeupdata', {
                flat : true,
                mode : 'range',
                format: 'Y-m-d'
            });
            clickNum=0

            document.querySelector('#pickmeupdata').addEventListener('pickmeup-change', function (e) {
                clickNum++
                if(clickNum%2==0){
                    if(isOpenTab==0){
                        GM_openInTab("https://ecom.meituan.com/meishi/?cate=93#https://midas.dianping.com/shopdiy/account/pcCpcEntry?continueUrl=/app/peon-merchant-product-menu/html/index.html", true)
                        GM_openInTab("https://ecom.meituan.com/meishi/?cate=93#https://biztonemeishi.meituan.com/web/index", true)
                        isOpenTab=1
                    }
                    loading('生成周报中...')
                    //console.log('周报范围为',e.detail.formatted_date); // New date according to current format
                    //清除选择器

                    tableReportDetail=[]
                    ncpmMapDetail= []
                    startWeekDate=''
                    endWeekDate=''
                    bstartWeekDate=''
                    bendWeekDate=''
                    poiName2PoiIdMap = new Map()
                    weekshopId2PoiIdMap = new Map()
                    visitorMap.clear()
                    weekAccount=''
                    pcNo=''
                    weeklaunches = []
                    weeklaunchesCount =0
                    pickmeup('#pickmeupdata').clear();
                    $('#pickmeupdata').css('display','none')
                    succ('开始导出周报')
                    startWeekDate = e.detail.formatted_date[0]
                    endWeekDate = e.detail.formatted_date[1]
                    succ('时间范围为：'+startWeekDate + '至' + endWeekDate)

                    succ('获取账号信息')
                    $.get(getAccountUrl+'?_tm='+getNowTime(),function(data){
                        weekAccount=data.user.userId
                        pcNo=weekAccount+'_'+guid()
                        succ('获取店铺信息')
                        GM_xmlhttpRequest({
                            url:mainUrl+'ecome/poi/'+weekAccount+'?type=all&startDay='+startWeekDate+"&endDay="+endWeekDate,
                            method :"get",
                            onload:function(xhr){
                                var data=$.parseJSON( xhr.responseText )
                                //console.log('获取店铺信息',data)
                                if(data.code!=0 || data.list.length<1){
                                    cloaseLoading()
                                    error( '提示','暂无店铺数据，请先上传店铺数据')
                                    return
                                }else{
                                    data.list.forEach(pinfo=>{
                                        poiName2PoiIdMap.set(pinfo.poiName.replace('（','(').replace('）',')'),pinfo.poiId)
                                    })
                                    bstartWeekDate= data.bstartDay
                                    bendWeekDate= data.bendDay
                                    succ('开始抓取推广数据')
                                    getTableReportData(1,startWeekDate,endWeekDate)
                                }
                            }
                        })
                    })
                }
            })
        }else{
            $('#pickmeupdata').css('display','')
        }
    }
    $('#root').append(pwbutton)
    $('#id003').attr('class','ecom_button')


})();
