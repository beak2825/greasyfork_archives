// ==UserScript==
// @name        DxmCrawl
// @namespace   .dianxiaomi.com
// @grant       none
// @version     1.0.0
// @author      -
// @description 2024/6/5 10:03:47
// ==/UserScript==

var dataArr = [];//存放重复的采集数据
var contentObj = $("#repeatCrawlModalContent .dxmRepeatBox");
var jj = 0,failsUrls="";

//临时获取该账户下的采集失败的数据，然后再从本地缓存里根据UID取出之前的失败数据，去重后合并到采集助手里显示
var failData = {
    uid: null,//登录的用户id
    data: [], //所有采集的分类
    crawlSuccessArr: [],//采集成功的id
    isFinish: false //是否采集完成状态
};
//拼多多跨境批量采集计算次数
var temuBatchCrawlNum = 0;

//判断obj是不是空的 空的返回true,不空返回false;
var objectIsEmpty = function(e) {
    var t;
    for (t in e)
        return !1;
    return !0;
};

//选中
$(document).off('click', 'input[name="categoryCheck"]').on('click', 'input[name="categoryCheck"]', function () {
    var check = $(this).is(':checked');
    $("#categoryNum").prop('disabled',!check);
    $("#categoryNum").val(check ? '50' :'');
});
$(document).off('input', '#categoryNum').on('input', '#categoryNum', function () {
    var ipt = $(this);
    var objRegExp  =  /[^0-9]/;
    if(objRegExp.test(ipt.val())){
        ipt.val(ipt.val().replace(/[^\d]/g,""));
    }
});
$(document).off('click', '#checkFailUrl').on('click', '#checkFailUrl', function () {
    $('#dxmCopyUrl').select();
    document.execCommand('copy');
    $.fn.message({type: 'success',msg: '复制失败链接成功'});
});

var Crawl = {
    config:{
        "single":[
            {"taobao.com" : TaobaoCrawl},
            {"1688.com" : ALiBabaCrawl},
            {"tmall.com": TmallCrawl},
            {"aliexpress.com" : SmtCrawl},
            {"aliexpress.us" : SmtCrawl},
            {"ebay"	: EbayCrawl},
            {"amazon" : AmazonComCrawl},
            {"jd.com" : JDCrawl},
            {"alibaba.com" : AlibabaGjCrawl},
            {"dhgate.com" : DhgateCrawl},
            {"etsy.com" : EtsyCrawl},
            {"lazada" : LazadaCrawl},
            {"pfhoo.com" : PfhooCrawl},
            {"www.banggood.com" : BanggoodCrawl},
            {"sea.banggood.com" : BanggoodCrawl},
            {"chinavasion.com" : Chinavasion},
            {"gearbest.com" : GearbestCrawl},
            {"walmart.com" : WalmartCrawl},
            // {"walmart.ca" : WalmartCrawl},
            {"ebay.com" : EbayCrawl},
            {"ebay.co.uk":EbayCrawl},
            {"ebay.ca":EbayCrawl},
            {"ebay.de":EbayCrawl},
            {"ebay.fr":EbayCrawl},
            {"amazon.com" : AmazonCrawl},
            {"amazon.co.jp" : AmazonCrawl},
            {"amazon.cn":AmazonCrawl},
            {"amazon.co.uk" : AmazonCrawl},
            {"amazon.ca":AmazonCrawl},
            {"amazon.com.mx":AmazonCrawl},
            {"amazon.de":AmazonCrawl},
            {"amazon.fr":AmazonCrawl},
            {"us.banggood.com":BanggoodCrawl},
            {"usa.banggood.com":BanggoodCrawl},
            {"chinabrands.com" : ChinabrandsCrawl},
            {"chinabrands.cn":ChinabrandsCrawl},
            {"wish.com":WishCrawl},
            {"joom.com":JoomCrawl},
            {"tophatter.com":TophatterCrawl},
            {"haiyingshuju.com":HaiYingShuJuCrawl},
            {"yixuanpin.cn":YiXuanPinCrawl},
            {"shopee.":ShopeeCrawl},
            {"tw.shopeesz.com":ShopeeCrawl},
            {"xiapibuy.com":ShopeeCrawl},
            {"pifa.pinduoduo.com":PinduoduoCrawl},
            {"yangkeduo.com":YangkeduoCrawl},
            {"mobile.pinduoduo.com":YangkeduoCrawl},
            {"vova.com":VovaCrawl},
            {"17zwd.com":Zwd17Crawl},
            {"vvic.com":VvicCrawl},
          /*  {"k3.cn":K3cnCrawl},
            {"bao66.cn":Bao66Crawl},*/
            {"17huo.com":Huo17Crawl},
            /*{"xingfujie.cn":XingfujieCrawl},*/
            {"chinavasion.com":ChinavasionCrawl},
            {"sooxie.com":SooxieCrawl},
            {"571xz.com":Xz571Crawl},
            {"kaola.com":KaolaCrawl},
            {"https://distributor.taobao.global/apps/product/detail" : TaobaoGlobalCrawl},
          /*  {"2tong.cn" : twoTongCrawl},*/
            {"made-in-china.com" : madeInChinaCrawl},
            {"cjdropshipping.com" : cjDropshippingCrawl},
            {"qksource.com" : cjDropshippingCrawl},
            {"yiwugo.com" : yiWuGoCrawl},
            {"go2.cn" : go2Crawl},
            {".mercadolibre." : mercadoCrawl},
            {".mercadolivre.com.br/" : mercadoCrawl},
            {".temu.com/" : temuCrawl},
            {".coupang.com/" : coupangCrawl},
            {".ozon.com/" : ozonCrawl},
            {".ozon.ru/" : ozonCrawl},
            {".shein.com/" : sheinCrawl},
            {".daraz." : darazCrawl},
            {".wsy.com/" : wsyCrawl},
            {".91jf.com/": jfCrawl},
            {".fruugo." : fruggoCrawl},
            {".17qcc.com/": qcCrawl},
            {".wildberries.ru/": wildCrawl},
            {".tiktok.com/": tiktokCrawl},
            {".tokopedia.com/": tiktokCrawl},
            {".miravia.es/": miraviaCrawl},
            {".gigab2b.": gigaCrawl},
            // {".target.com/" : targetCrawl}
        ],
        "category":[
            {"taobao.com" : TaobaoCategoryCrawl},
            {"tmall.com" : TmallCategoryCrawl},
            {"1688.com" : ALiBaBaCategoryCrawl},
            {"ebay" : EbayCategoryCrawl},
            {"ebay.com" : EbayCategoryCrawl},
            {"ebay.co.uk":EbayCategoryCrawl},
            {"ebay.ca":EbayCategoryCrawl},
            {"ebay.de":EbayCategoryCrawl},
            {"ebay.fr":EbayCategoryCrawl},
            {"amazon.com" : AmazonCategoryCrawl},
            {"aliexpress.com" : SmtCategoryCrawl},
            {"aliexpress.us" : SmtCategoryCrawl}
        ]
    },

    categoryCrawlTotalNum: 0, //分类采集的产品总数
    categoryCrawlCountNum: 0, //分类采集已经采集的数量
    categoryDataList: [], //分类采集需要采集的产品数据集合

    checkUrl: function(type, url){
        var urlArr = url.toLowerCase().split("\n");
        var errorArr = [];
        for(var i in urlArr){
            url = urlArr[i];
            if (!url || !url.trim()){
                continue;
            }
            var b = false,
                isAlibabaCategory = false,
                isTmallCategory = false,
                errorMsg = '采集地址无效，或不支持该网址采集。',
                errorMsg_1688 = '不支持输入1688链接进行分类采集，请进入1688产品页面，点击右下角分类采集按钮进行采集',
                errorMsg_Tmall = '天猫链接暂不支持使用该方式采集，请打开采集网址点击右下角采集按钮采集 ';
            for (var j in Crawl.config[type]) {
                for (var key in Crawl.config[type][j]) {
                    if (key.indexOf('&-&') > -1) {
                        var num = 0,
                            amzKey = key.split('&-&');
                        for (var k in amzKey) {
                            if (url.indexOf(amzKey[k]) > -1) num++;
                        }
                        if (num === amzKey.length) {
                            b = true;
                            break;
                        }
                    } else {
                        //如果是天猫采集，不管是单品还是分类采集都不支持采集，提示打开链接页面采集
                        //天猫采集先在TmallCrawl.crawl方法里面把item.htm替换为item_o.htm老页面去采集，这里的判断先注释，以后如果老页面不存在了在放开
                        // if (key === 'tmall.com' && url.indexOf('tmall.com') > -1) {
                        //     isTmallCategory = true;
                        //     break;
                        // }
                        if (type === 'category' && key === '1688.com' && url.indexOf('1688.com/') > -1) {
                            // 分类采集移除对1688的支持
                            isAlibabaCategory = true;
                            break;
                        } else if (url.indexOf(key) > -1) {
                            b = true;
                            break;
                        }
                    }
                }
                if (b) break;
            }
            //!b && errorArr.push("此地址暂不支持：" + url);
            if (!b){
                if (isAlibabaCategory) {
                    errorArr.push(errorMsg_1688);
                } else if (isTmallCategory) {
                    errorArr.push(errorMsg_Tmall);
                } else {
                    errorArr.push(errorMsg);
                }
            }
        }
        return errorArr;
    },

    getCrawlObject : function(type, url){
        for(var j in Crawl.config[type]){
            for(var key in Crawl.config[type][j]){
                var chKey = key;
                if(chKey.indexOf("&-&") > -1){
                    chKey = key.split("&-&")[0];
                }
                if(url.indexOf(chKey) > -1){
                    return Crawl.config[type][j][key];
                }
            }
        }
        return null;
    },

    //拼多多跨境批量采集请求加延时处理方法封装
    temuBatchAjaxTimeOut: function(data, crawlCategory, checkFinish, total, timeOut) {
        timeOut += temuBatchCrawlNum * 4000;//控制每4s请求一次
        if (temuBatchCrawlNum && temuBatchCrawlNum % 10 === 0) timeOut += 5000;//每请求十次再延时累加5s
        temuBatchCrawlNum++;
        var ajaxTimeOut = setTimeout(function () {
            clearTimeout(ajaxTimeOut);
            ajaxTimeOut = null;
            Html.postHtml(URL_MANAGER.url.postHTML(), data, 0, function(result){
                if (+result.code === -10) {$.fn.message({type:'danger',msg:result.msg})}
                if (+result.code === -11) {$.fn.message({type:'danger',msg:result.msg})}
                var objCrawl = result.repeatCrawlProduct,
                    isRepeat = 0,
                    html = '';

                if (objCrawl) isRepeat = objCrawl.repeatCrawl;
                if (!crawlCategory){
                    if (+isRepeat === 1){//重复，生成td，并记录重复的data
                        dataArr.push(data);

                        html = '<tr><td style="width:50px;">' +
                            '<input name="sourceUrlRepeat" type="checkbox" value="' + data.url + '"/></td>' +
                            '<td style="width:80px;"><div class="imgDivOut"><div class="imgDivIn">' +
                            '<img src="' + objCrawl.imgUrl.split('|')[0] +
                            '" class="imgCss" width="71px" height="71px"/></div></div></td>' +
                            '<td style="text-align:left;"><a href="' + data.url +
                            '" target="_blank">' + objCrawl.name + '</a></td>' +
                            '<td style="width:80px;">' + (objCrawl.price !== null ? objCrawl.price : '') + '</td></tr>';

                        contentObj.append(html);
                        $('#repeatCrawlModal').find('input[name = "sourceUrlRepeat"]').prop('checked', false);
                        if (checkFinish  && total === temuBatchCrawlNum){//表示采集完成,显示重复采集记录模态层
                            dxmModal.hide("#crawlingModal");
                            dxmModal.show("#repeatCrawlModal");
                            //$("#loading").modal("hide");
                        }
                    }
                    //记录采集结果 (最后一条+没有下一页才显示)
                    Crawl.recordCrawlResult(result, data.url, isRepeat, crawlCategory);
                    if (!dataArr.length && checkFinish && total === temuBatchCrawlNum){
                        Crawl.displayCrawlResult(checkFinish && total === temuBatchCrawlNum);
                    }else if(dataArr.length && checkFinish && total === temuBatchCrawlNum){
                        dxmModal.hide("#crawlingModal");
                        dxmModal.show("#repeatCrawlModal");
                        temuBatchCrawlNum = 0;//清除计数
                        timeOut = 0;
                    }
                }else{
                    //判断是否重复
                    if (+isRepeat === 1){
                        dataArr.push(data);
                        html = '<tr class="content"><td class="has-ipt">' +
                            '<input name="sourceUrlRepeat" type="checkbox" value="' + data.url + '">' +
                            '</td><td class="img-box"><div class="img-out">' +
                            '<img class="imgCss" src="' + objCrawl.imgUrl.split("|")[0] +
                            '" width="50px" height="50px"/></div></td>' +
                            '<td><a href="' + data.url + '" target="_blank">' + objCrawl.name + '</a></td>' +
                            '<td class="num dxm-f-right">' + objCrawl.price + '</td></tr>';
                        $('#repeatCrawlModal').find('#repeatValue').append(html).end().find('input[name = "sourceUrlRepeat"]').prop('checked', false);
                    }
                    Crawl.recordCrawlResult(result, data.url, isRepeat, crawlCategory);
                }
            });
        }, timeOut);
    },

    //分类采集循环调用该方法，进行当前循环的单个产品采集
    singleCrawl : function(uid, urls, checkFinish,haveNext,crawlCategory, crawlState){
        var that = this,
            urlArr = [],
            total = 0,
            processNum = 0,
            timeOut = 4000,
            shopeeUrl = '';

        temuBatchCrawlNum = 0;
        if (urls) {
            $.each(urls.split('\n'), function (i, j) {//去重处理
                var urlStr = $.trim(j);

                if (urlStr && urlArr.indexOf(urlStr) === -1) urlArr.push(urlStr);
                if (crawlState === 'batchCrawlInit' && urlStr && !shopeeUrl && urlStr.indexOf('.xiapibuy.com/') !== -1 || urlStr.indexOf('/shopee.com') !== -1) shopeeUrl = urlStr;
            });
        }
        total = urlArr.length;
        //检测链接里面是否含有shopee平台链接，如果有，可能要走接口获取，先优先创建一个页面加载出请求头所带的参数，后面直接拿这份参数去走接口获取
        if (crawlState === 'batchCrawlInit' && shopeeUrl) {
            ShopeeCrawl.headersData = '';//清空重新初始化
            chrome.runtime.sendMessage('', {sign: 'getShopeeHeaderData', shopeeUrl: shopeeUrl}, function (res) {});
            return
        }
        for (var i in urlArr) {
            //去除链接中的逗号
            if(urlArr[i].indexOf(",")>-1){
                urlArr[i] = urlArr[i].replace(/,/g,"");
            }
            if(urlArr[i].indexOf('http:') !== 0 && urlArr[i].indexOf('https') !== 0){
                urlArr[i] = 'https:' + urlArr[i];
            }
            if (urlArr[i] && urlArr[i].indexOf("aliexpress.com/store/product/") !== -1 && urlArr[i].indexOf(".html") !== -1) {
                var itemId = urlArr[i].substring(urlArr[i].indexOf("aliexpress.com/store/product/") + 29, urlArr[i].indexOf(".html"));
                if (itemId && itemId.indexOf("/") !== -1) {
                    var itemIdArray = itemId.split("/");
                    urlArr[i] = urlArr[i].replace(itemIdArray[0]+'/',"");
                    var newItemId = itemIdArray[1];
                    if(urlArr[i] && newItemId && newItemId.indexOf("_") !== -1){
                        var idArrays = newItemId.split("_");
                        urlArr[i] = urlArr[i].replace(newItemId,idArrays[1]).replace("store/product","item");
                    }
                }
            }
            var crawlObj = Crawl.getCrawlObject("single", urlArr[i]);
            crawlObj && crawlObj.crawl(urlArr[i], function(data){
                data.uid = uid;
                data.repeatCheck = 1; //必须查重
                // 截取亚马逊商品的链接 去除qid字符串
                var crawlUrl = data.url;
                if(crawlUrl.indexOf('www.amazon.com') > -1){
                    if (crawlUrl.indexOf('qid') > -1){
                        var begin = crawlUrl.indexOf('qid');
                        var qidStr = crawlUrl.substring(begin, begin + 15);
                        data.url = crawlUrl.replace(qidStr, '');
                    }
                }

                if(data.html){
                    if (data.isTemu) {//如果是拼多多跨境批量操作，则单独加延迟处理，防止请求太快导致大量采集失败的问题
                        that.temuBatchAjaxTimeOut(data, crawlCategory, checkFinish, total, timeOut);
                    } else {
                        Html.postHtml(URL_MANAGER.url.postHTML(), data, 0, function(result){
                            processNum++;
                            if(result.code == -10) {$.fn.message({type:'danger',msg:result.msg})}
                            if(result.code == -11) {$.fn.message({type:'danger',msg:result.msg})}
                            var objCrawl = result.repeatCrawlProduct;

                            var isRepeat = 0;
                            if(objCrawl){
                                isRepeat = objCrawl.repeatCrawl;
                            }

                            //价格为null 显示空串
                            if(objCrawl && objCrawl.price == null){
                                result.repeatCrawlProduct.price = "";
                            }
                            if(!crawlCategory){
                                if(isRepeat == 1){//重复，生成td，并记录重复的data
                                    dataArr.push(data);

                                    var html = '<tr><td style="width:50px;">' +
                                        '<input name="sourceUrlRepeat" type="checkbox" value="' + data.url + '"/></td>' +
                                        '<td style="width:80px;"><div class="imgDivOut"><div class="imgDivIn">' +
                                        '<img src="' + result.repeatCrawlProduct.imgUrl.split('|')[0] +
                                        '" class="imgCss" width="71px" height="71px"/></div></div></td>' +
                                        '<td style="text-align:left;"><a href="' + data.url +
                                        '" target="_blank">' + result.repeatCrawlProduct.name + '</a></td>' +
                                        '<td style="width:80px;">' + result.repeatCrawlProduct.price + '</td></tr>';

                                    contentObj.append(html);
                                    $('#repeatCrawlModal').find('input[name = "sourceUrlRepeat"]').prop('checked', false);
                                    if(checkFinish  && total === processNum){//表示采集完成,显示重复采集记录模态层
                                        dxmModal.hide("#crawlingModal");
                                        dxmModal.show("#repeatCrawlModal");
                                        //$("#loading").modal("hide");
                                    }
                                }
                                //记录采集结果 (最后一条+没有下一页才显示)
                                Crawl.recordCrawlResult(result, data.url, isRepeat, crawlCategory);
                                if(dataArr.length == 0 && checkFinish && total === processNum){
                                    Crawl.displayCrawlResult(checkFinish && total === processNum);
                                }else if(dataArr.length > 0 && checkFinish && total === processNum){
                                    dxmModal.hide("#crawlingModal");
                                    dxmModal.show("#repeatCrawlModal");
                                }

                                //清空下tiktok采集的数据选中站点数据
                                if (total === processNum && checkFinish) {
                                    $('#tiktokGatherDataId').val('').attr('data-tiktok', '');
                                }
                            }else{
                                //判断是否重复
                                if(isRepeat == 1){
                                    dataArr.push(data);
                                    var html = '<tr class="content"><td class="has-ipt">' +
                                        '<input name="sourceUrlRepeat" type="checkbox" value="' + data.url + '">' +
                                        '</td><td class="img-box"><div class="img-out">' +
                                        '<img class="imgCss" src="' + objCrawl.imgUrl.split("|")[0] +
                                        '" width="50px" height="50px"/></div></td>' +
                                        '<td><a href="' + data.url + '" target="_blank">' + objCrawl.name + '</a></td>' +
                                        '<td class="num dxm-f-right">' + objCrawl.price + '</td></tr>';
                                    $("#repeatCrawlModal").find('#repeatValue').append(html);
                                    $('#repeatCrawlModal').find('input[name = "sourceUrlRepeat"]').prop('checked', false);
                                }
                                Crawl.recordCrawlResult(result, data.url, isRepeat, crawlCategory);
                            }

                        });
                    }
                }else{
                    if(!crawlCategory){
                        processNum++;
                        data.code = -1;
                        data.msg = "采集内容为空！";
                        Crawl.recordCrawlResult(data, data.url, 0, crawlCategory);
                        if(dataArr.length == 0 && checkFinish && total === processNum){
                            Crawl.displayCrawlResult(checkFinish && total === processNum);
                        }else if(dataArr.length > 0 && checkFinish && total === processNum){
                            $('#repeatCrawlModal').find('input[name = "sourceUrlRepeat"]').prop('checked', false);
                            dxmModal.hide("#crawlingModal");
                            dxmModal.show("#repeatCrawlModal");
                            //$("#loading").modal("hide");
                        }
                    } else {
                        Crawl.recordCrawlResult({}, data.url, 0, crawlCategory);
                    }
                }
            }, false, false);
        }
    },

    //分类采集入口，crawlCategory=true则是列表页分类采集，false则是插件详情页分类链接采集
    categoryCrawl: function(uid, url, crawlCategory, categoryNum){
        var crawlObj = Crawl.getCrawlObject('category', url); //当前是采集的哪个平台的分类采集，获取对应平台的对象函数

        // 新版分类采集逻辑，必须当前产品采集完成之后才会调用下一个产品的采集
        // 速卖通、天猫、淘宝、Amazon的分类采集先单独走一个逻辑，后续再把所有的分类采集都替换掉
        if (this.judgeUrlByPlatform(url) && crawlCategory) { //如果是天猫采集并且是列表页的分类采集
            Crawl.newCategoryCrawlProcess(uid, url, crawlObj, crawlCategory, categoryNum, categoryNum, 1);
        } else { //其它平台先走之前的逻辑，所有产品一次性调用采集
            Crawl.categoryCrawlProcess(uid, url, crawlObj, crawlCategory, categoryNum, 0, 1);
        }
    },

    // 验证是否需要调用新版分类采集逻辑，新版采集逻辑必须是当前产品采集完成之后才会调用下一个产品的采集
    judgeUrlByPlatform: function (url) {
        var flag = false;

        // 指定平台的分类采集先单独走一个逻辑，后续再把所有的分类采集都替换掉
        if (url.indexOf('aliexpress.') !== -1) { //速卖通
            flag = true;
        } else if (url.indexOf('taobao.com') !== -1) { //淘宝
            flag = true;
        } else if (url.indexOf('tmall.com') !== -1 || url.indexOf('tmall.hk') !== -1) { //天猫
            flag = true;
        } else if (url.indexOf('amazon.') !== -1) { //Amazon
            flag = true;
        }
        return flag; //返回true则是调用新版分类采集逻辑
    },

    //初始化分类采集的计数等字段值
    initCategoryNumFn: function () {
        dataArr = [];
        jj = 0;
        failsUrls = '';
        Crawl.categoryCrawlTotalNum = 0;
        Crawl.categoryCrawlCountNum = 0;
        Crawl.categoryDataList = [];
    },

    //获取分类采集的每一页的要采集的产品数据，产品分类列表页采集和插件详情页输入链接采集都调用的这个方法
    categoryCrawlProcess: function(uid, url, crawlObj,crawlCategory,categoryNum, setTimeCount, pageNum){
        crawlObj && crawlObj.crawl(url, function(data){  // 回调函数
            if (!data) return;//为空则是有滑动条暂停采集
            if (data.list && data.list.length > 0) {
                Crawl.categoryCrawlTotalNum += data.list.length;
                var begin = (pageNum - 1) * data.list.length;
                pageNum++;
                if (url.indexOf("aliexpress.com") > 0 || url.indexOf("ebay.com") > 0) {
                    for (var i in data.list) {
                        if (categoryNum) {
                            if(data.list.length > categoryNum){
                                if (i < categoryNum) {
                                    setTimeout(function () {
                                        Crawl.singleCrawl(uid, data.list[setTimeCount], Crawl.categoryCrawlCountNum === (Crawl.categoryCrawlTotalNum - 1), true, crawlCategory); //标志分类采集已经结束
                                        Crawl.categoryCrawlCountNum++;
                                        setTimeCount++;
                                        if (setTimeCount >= categoryNum) {
                                            setTimeCount = 0;
                                        }
                                    }, (begin + parseInt(i)) * 1000);
                                }
                            }else {
                                setTimeout(function () {
                                    Crawl.singleCrawl(uid, data.list[setTimeCount], Crawl.categoryCrawlCountNum === (Crawl.categoryCrawlTotalNum - 1), true, crawlCategory); //标志分类采集已经结束
                                    Crawl.categoryCrawlCountNum++;
                                    setTimeCount++;
                                    if (setTimeCount >= data.list.length) {
                                        setTimeCount = 0;
                                    }
                                }, (begin + parseInt(i)) * 1000);
                            }
                        } else {
                            setTimeout(function () {
                                Crawl.singleCrawl(uid, data.list[setTimeCount], Crawl.categoryCrawlCountNum === (Crawl.categoryCrawlTotalNum - 1), true, crawlCategory); //标志分类采集已经结束
                                Crawl.categoryCrawlCountNum++;
                                setTimeCount++;
                                if (setTimeCount >= data.list.length) {
                                    setTimeCount = 0;
                                }
                            }, (begin + parseInt(i)) * 1000);
                        }
                    }
                } else if (url.indexOf('taobao.com') > 0 || url.indexOf('tmall.com') > 0 || url.indexOf('tmall.hk') > 0) {
                    for (var i in data.list) {
                        if (categoryNum) {
                            if(data.list.length > categoryNum){
                                if (i < categoryNum) {
                                    setTimeout(function () {
                                        Crawl.singleCrawl(uid, data.list[setTimeCount], Crawl.categoryCrawlCountNum == (Crawl.categoryCrawlTotalNum - 1), true, crawlCategory); //标志分类采集已经结束
                                        Crawl.categoryCrawlCountNum++;
                                        setTimeCount++;
                                        if (setTimeCount >= categoryNum) {
                                            setTimeCount = 0;
                                        }
                                    }, (begin + parseInt(i))  * 5000);
                                }
                            }else {
                                setTimeout(function () {
                                    Crawl.singleCrawl(uid, data.list[setTimeCount], Crawl.categoryCrawlCountNum === (Crawl.categoryCrawlTotalNum - 1), true, crawlCategory); //标志分类采集已经结束
                                    Crawl.categoryCrawlCountNum++;
                                    setTimeCount++;
                                    if (setTimeCount >= data.list.length) {
                                        setTimeCount = 0;
                                    }
                                }, (begin + parseInt(i))  * 5000);
                            }
                        } else {
                            setTimeout(function () {
                                Crawl.singleCrawl(uid, data.list[setTimeCount], Crawl.categoryCrawlCountNum === (Crawl.categoryCrawlTotalNum - 1), true, crawlCategory); //标志分类采集已经结束
                                Crawl.categoryCrawlCountNum++;
                                setTimeCount++;
                                if (setTimeCount >= data.list.length) {
                                    setTimeCount = 0;
                                }
                            }, (begin + parseInt(i))  * 5000);
                        }
                    }
                } else {
                    //判断是否结束需要两个条件 是否是最后一个+是否还有下一页
                    for(var i in data.list){
                        if(categoryNum){
                            if (data.list.length > categoryNum) {
                                if (i < categoryNum) {
                                    Crawl.singleCrawl(uid, data.list[i], Crawl.categoryCrawlCountNum === (Crawl.categoryCrawlTotalNum - 1), !data.next, crawlCategory); //标志分类采集已经结束
                                    Crawl.categoryCrawlCountNum++;
                                }
                            }else{
                                Crawl.singleCrawl(uid, data.list[i], Crawl.categoryCrawlCountNum === (Crawl.categoryCrawlTotalNum-1),!data.next,crawlCategory); //标志分类采集已经结束
                                Crawl.categoryCrawlCountNum++;
                            }

                        }else{
                            Crawl.singleCrawl(uid, data.list[i], Crawl.categoryCrawlCountNum === (Crawl.categoryCrawlTotalNum-1),!data.next,crawlCategory); //标志分类采集已经结束
                            Crawl.categoryCrawlCountNum++;
                        }
                    }
                }
            } else {
                if(!crawlCategory && pageNum === 1){ //只有请求第一页的时候就没有采集数据时才进入
                    $("#failDetailDiv").show();
                    $("#failDetail").append("<p>采集结果为空，请检查是否为分类采集！</p>");
                    Crawl.displayCrawlResult(false);
                }
            }
            if(crawlCategory){
                $('.dxmTotalNum').text(Crawl.categoryCrawlTotalNum)
            }

            if(data.next){
                if(categoryNum){
                    if(data.list.length < categoryNum){
                        categoryNum = categoryNum - data.list.length;
                        Crawl.categoryCrawlProcess(uid,data.next,crawlObj,crawlCategory,categoryNum, 0, pageNum);
                    } else {
                        Crawl.categoryCrawlTotalNum = Crawl.categoryCrawlTotalNum - (data.list.length - categoryNum);
                    }
                }else{
                    Crawl.categoryCrawlProcess(uid, data.next, crawlObj,crawlCategory, categoryNum, 0, pageNum);
                }
            } else {
                if(categoryNum){
                    if(data.list.length > categoryNum){
                        Crawl.categoryCrawlTotalNum = Crawl.categoryCrawlTotalNum - (data.list.length - categoryNum);
                    }
                }
            }

            if (data.list && !data.list.length) {
                var $msgModal = $('#msgModal');
                // $('#dxmCopyUrl').val(url);
                // $msgModal.find('.crawProgressBar').css('width', '100%');
                $('#myModalLabel').text('采集成功');
                $msgModal.find('.dxmCategoryCrawlNumBox').show();
            }
        }, pageNum, {uid: uid,
            url: url,
            crawlObj: crawlObj,
            crawlCategory: crawlCategory,
            categoryNum: categoryNum,
            setTimeCount: setTimeCount});
    },

    showCrawlingResult: function(){
        $('#crawlDesc').text('数据采集中，请稍后......');
        $('#crawlingDesc').text('正在采集......');
        dxmModal.show('#crawlingModal');
    },

    displayCrawlResult: function(isFinish){
        isFinish && $("#crawlDesc").text("采 集 完 成！");
        dxmModal.hide("#crawlingModal");
        dxmModal.show("#crawlResultModal");
    },

    /*
    * 计算采集的进度
    * @param url=要采集的分类产品链接
    * @param repeat=是否重复采集，0没重复，1重复
    * @param crawlCategory=true是列表页的分类采集，false是插件详情页的分类链接采集
    * @param isRepeatCrawlConfirm=是否是重复采集弹层的确认重复采集
    * @param repeatCrawlCount=重复采集弹层的确认重复采集后，勾选的需要重复采集的产品数量
    * */
    recordCrawlResult: function(data, url, repeat, crawlCategory, isRepeatCrawlConfirm, repeatCrawlCount){
        var dxmTotalNum = Crawl.categoryCrawlTotalNum, //+($('.dxmTotalNum').text()),
            $msgModal = $('#msgModal'),
            $successNum = !crawlCategory ? $('#successNum') : $msgModal.find('.dxm-f-blue'),
            $failNum = !crawlCategory ? $('#failNum') : $msgModal.find('.dxmFail'),
            successNum = parseInt($successNum.text()),
            failNum = parseInt($failNum.text());
        $('#checkFailUrl').show();
        if (!crawlCategory) {
            $('#crawlingDesc').html('正在采集：' + url);
            if (+repeat !== 1) {
                if (!+data.code) {
                    $successNum.text(successNum + 1);
                } else {
                    $failNum.text(failNum + 1);
                    failsUrls += url + '\n';
                    if (data.msg) {
                        $('#dxmCopyUrl').val(failsUrls);
                        $('#failDetailDiv').show();
                        $('#failDetail').append('<p>' + data.msg + '<br/>采集url:' + url + '</p>');
                    }
                }
            }
        } else {
            if (+repeat !== 1) {
                if (!+data.code) {
                    if (isNaN(successNum)) successNum = 0;
                    successNum += 1;
                    $msgModal.find('.completionNum').text(successNum);
                    $successNum.text(successNum);
                    if (+$msgModal.find('.dxmCount').text() > 0) {
                        $msgModal.find('.crawProgressBar').css('width', ((successNum + (+$failNum.text())) / $msgModal.find('.dxmCount').text()) * 100 + '%');
                    } else {
                        $msgModal.find('.crawProgressBar').css('width', ((successNum + (+$failNum.text())) / dxmTotalNum) * 100 + '%');
                    }
                    if (showCrawlFailState) Crawl.getCrawlSuccessData(data.id);//收集采集成功的id数据，用于删除获取失败数据
                } else {
                    if (isNaN(failNum)) failNum = 0;
                    failNum += 1;
                    $failNum.text(failNum);
                    failsUrls += url + '\n';
                    if (+$msgModal.find('.dxmCount').text() > 0) {
                        $msgModal.find('.crawProgressBar').css('width', (+$successNum.text() + failNum / $msgModal.find('.dxmCount').text()) * 100 + '%');
                    } else {
                        $msgModal.find('.crawProgressBar').css('width', ((+$successNum.text() + failNum) / dxmTotalNum) * 100 + '%');
                    }
                }
                if ((+$successNum.text() + failNum) === dxmTotalNum || (+$successNum.text() + failNum) === +$msgModal.find('.dxmCount').text()) {
                    $('#dxmCopyUrl').val(failsUrls);
                    failsUrls = '';
                    $('#myModalLabel').text('采集成功');
                    $successNum.text($successNum.text());
                    $failNum.text($failNum.text());
                    $msgModal.find('.dxmCategoryCrawlNumBox').show();
                    // 如果采集是淘宝和天猫平台，则将采集失败的数据保存到到浏览器数据库
                    if (showCrawlFailState) Crawl.startSaveCrawlFailData();
                }
            }
        }
        // 统计当前分类采集完成的次数
        jj++;
        // 如果当前分类采集完成的次数等于了分类采集需要采集的总数，并且有重复采集的产品信息
        // 弹出重复采集的产品弹层，让用户确认是否采集这些重复的产品
        if (jj === dxmTotalNum && dataArr.length) dxmModal.show('#repeatCrawlModal');
        // 如果是重复采集弹层确认，并且当前是确认重复采集的最后一个产品则进入if
        failsUrls && $('#dxmCopyUrl').val(failsUrls);
        if (isRepeatCrawlConfirm && jj - dxmTotalNum === repeatCrawlCount) {
            failsUrls = '';
            $('#myModalLabel, #crawlDesc').text('采集成功');
            $msgModal.find('.dxmCategoryCrawlNumBox').show();
        }
    },

    //采集失败数据开始保存
    startSaveCrawlFailData: function() {
        if (failData) {
            failData.isFinish = true;//保存数据
            //采集失败的数据传递到background.js
            var crawlFailNum = +($('#msgModal .dxmFail').text()),
                oldCrawlData = [],
                crawlFailData = [],
                crawlFailIdArr = [];//当前采集失败数据的产品id，用于判断是否重复，如果重复，删除旧数据，使用采集过来的新数据

            $('.dxmCrawlFailLink')[crawlFailNum ? 'removeClass' : 'addClass']('dxm-hide');//如果有采集失败才放开入口
            if (!crawlFailNum) return;//没有采集失败的不做保存处理，直接结束掉程序
            //如果有采集成功的情况，则在所有采集数据里面移除采集成功的数据，则剩余数据判为采集失败的
            if (crawlFailNum && failData.data.length) {
                if (failData.crawlSuccessArr.length) {//如果有部分采集成功
                    $.each(failData.data, function (i, j) {
                        //移除采集成功的数据以及本地采集数据去重
                        if (failData.crawlSuccessArr.indexOf(j.pro_id) === -1 && crawlFailIdArr.indexOf(j.pro_id) === -1) {
                            crawlFailData.push(j);
                            crawlFailIdArr.push(j.pro_id);
                        }
                    });
                } else {//如果都是采集失败的
                    crawlFailData = failData.data;
                }
            }

            //先查询一遍，再做数据的替换更新
            chrome.runtime.sendMessage('', {sign: 'dxmCrawlFail', action: 'getCrawlFailData', data: ''}, function (oldData) {
                if (!+oldData.code) oldCrawlData = oldData.result;//取旧数据
                Crawl.crawlFailDataHandle(failData.uid, oldCrawlData, crawlFailData, crawlFailIdArr);
            });
        }
    },

    //获取当前采集成功的产品id
    getCrawlSuccessData: function(id) {
        if (id && failData.crawlSuccessArr.indexOf(id) === -1) failData.crawlSuccessArr.push(id);//采集成功的id
    },

    //采集失败数据重新处理
    crawlFailDataHandle: function(userId, oldData, crawlFailData, crawlFailIdArr) {
        var newData = [];

        if (oldData && oldData.length) {//取本地存储的历史数据（距离当前时间三天内的采集失败的数据）
            var nowTime = (new Date()).getTime(),
                threeDayTime = 1000*60*60*24*3,
                lastTime = nowTime - threeDayTime;//最后到期的时候

            $.each(oldData, function (i, j) {//取未过期数据、对旧数据去重
                if (lastTime <= j.updateTime && crawlFailIdArr.indexOf(j.pro_id) === -1) {
                    crawlFailData.push(j);//只把未过期的数据插入到后面，最新的数据在前面
                }
            });
        }

        if (crawlFailData.length) {
            //如果超出1000条数据，则只截取前1000条数据（保留最新的前1000条）
            newData = crawlFailData.length > 1000 ? crawlFailData.slice(0, 1000) : JSON.parse(JSON.stringify(crawlFailData));
        }
        //更新浏览器数据库数据
        chrome.runtime.sendMessage('', {sign: 'dxmCrawlFail', action: 'replaceCrawlFailData', data: newData});
    },

    fillUrl : function(url,httpFlag){
        if(url){
            if(url.indexOf("http") == -1 && url.indexOf("HTTP") == -1){
                if(httpFlag){
                    url = "https:" + url;
                }else{
                    url = "http:" + url;
                }
            }else if(url.indexOf("http") > 0 || url.indexOf("HTTP") > 0){
                var sp = url.indexOf("HTTP") > 0 ? "HTTP" : "http";
                var urlArray = url.split(sp);
                url = "http" + urlArray[1];
            }
        }
        return url;

    },


    //递归循环采集产品方法
    forEachRequestCrawlUrl: function (uid, url, crawlObj,crawlCategory,categoryNum, pageNum, forIndex) {
        if (SmtCategoryCrawl.stop) return;
        var checkFinish = Crawl.categoryCrawlCountNum === (Crawl.categoryCrawlTotalNum - 1);
        Crawl.newSingleCrawl(uid, Crawl.categoryDataList[forIndex], checkFinish , true, crawlCategory, function () {
            forIndex++;
            //如果已采数量小于总数量，则进入if进行下一个产品的采集
            if (Crawl.categoryCrawlCountNum < Crawl.categoryCrawlTotalNum) {
                if (url.indexOf('aliexpress.') > 0 || url.indexOf('ebay.com') > 0
                    || url.indexOf('tmall.com') > 0|| url.indexOf('tmall.hk') > 0) {
                    setTimeout(function () {
                        Crawl.forEachRequestCrawlUrl(uid, url, crawlObj,crawlCategory,categoryNum, pageNum, forIndex);
                    }, 1000);
                } else if (url.indexOf('taobao.com') > 0) {
                    setTimeout(function () {
                        Crawl.forEachRequestCrawlUrl(uid, url, crawlObj,crawlCategory,categoryNum, pageNum, forIndex);
                    }, 3000);
                } else {
                    Crawl.forEachRequestCrawlUrl(uid, url, crawlObj,crawlCategory,categoryNum, pageNum, forIndex);
                }
            }
        }); //标志分类采集已经结束
        //累计已采数量
        Crawl.categoryCrawlCountNum++;
    },

    /*
    * 获取分类采集的每一页的要采集的产品数据，产品分类列表页采集和插件详情页输入链接采集都调用的这个方法
    * @param url=要采集的分类产品链接
    * @param crawlObj=是采集哪个平台的对象函数
    * @param crawlCategory=true是列表页的分类采集，false是插件详情页的分类链接采集
    * @param categoryNum=是否只采集指定数量的产品(即最大可采数量)，这个字段是插件详情页的分类链接采集那里才会传
    * @param remainingCategoryNum=剩余的可采数量，用来计算是否还需要走下一页的请求
    * @param pageNum=要采集的产品分页
    * */
    newCategoryCrawlProcess: function(uid, url, crawlObj, crawlCategory, categoryNum, remainingCategoryNum, pageNum){
        //先获取当前页的可采产品数据
        crawlObj && crawlObj.crawl(url, function (data) {  // 回调函数
            if (!data) return;
            //判断当前页的可采产品数据是否有值
            if (data.list && data.list.length) {
                //累加当前已获取到的可采产品数量
                Crawl.categoryCrawlTotalNum += data.list.length;

                //合并需要采集的产品数据
                Crawl.categoryDataList = Crawl.categoryDataList.concat(data.list);
                if (pageNum === 1 || SmtCategoryCrawl.stop) { //只有第一页的时候才调用，后面只需要合并数据，不需要调用递归方法
                    //手动递归循环采集，只有当前循环的产品采集完成之后，才会进行下一个产品的采集
                    var stop = SmtCategoryCrawl.stop;
                    if (SmtCategoryCrawl.stop) SmtCategoryCrawl.stop = false;
                    Crawl.forEachRequestCrawlUrl(uid, url, crawlObj, crawlCategory, categoryNum, pageNum, (stop && SmtCategoryCrawl.detailDataObj && SmtCategoryCrawl.detailDataObj.forIndex !== undefined) ? SmtCategoryCrawl.detailDataObj.forIndex : 0);
                }

                pageNum++; //页数+1，用来获取下一页的产品数据
            } else {
                if (!crawlCategory && pageNum === 1) { //只有请求第一页的时候就没有采集数据时才进入
                    $('#failDetailDiv').show();
                    $('#failDetail').append('<p>采集结果为空，请检查是否为分类采集！</p>');
                    Crawl.displayCrawlResult(false);
                }
            }

            if (crawlCategory) { //如果是列表页点击的分类采集，把产品总数渲染到节点上展示
                $('.dxmTotalNum').text(Crawl.categoryCrawlTotalNum)
            }
            if (SmtCategoryCrawl.stop) SmtCategoryCrawl.stop = false;
            if (data.next) { //如果有下一页的url
                if (remainingCategoryNum) { //判断是否勾选了只采集前多少个（即最大可采产品数量），只有插件详情页通过链接采集时才会有值
                    //比如当前获取到的产品数量是50，当前剩余可采数量是80，categoryNum最大可采数是80
                    if(data.list.length < remainingCategoryNum){ //如果当前获取到的产品数量小于剩余的最大可采数量
                        //用80-50得到最新的剩余可采数量=30，那么下一次进来如果data.list还是50条，就会执行下面的else
                        remainingCategoryNum = remainingCategoryNum - data.list.length; //拿最大可采数量减去当前产品数量，得到最新的剩余最大可采数量
                        //继续调用当前方法进行下一页的产品数据请求
                        Crawl.newCategoryCrawlProcess(uid, data.next, crawlObj, crawlCategory, categoryNum, remainingCategoryNum, pageNum);
                    } else { //如果当前获取到的产品数量大于剩余可采数量
                        Crawl.categoryCrawlTotalNum = categoryNum; //直接等于最大可采数量
                    }
                }else{
                    //继续调用当前方法进行下一页的产品数据请求
                    Crawl.newCategoryCrawlProcess(uid, data.next, crawlObj, crawlCategory, categoryNum, remainingCategoryNum, pageNum);
                }
            } else { //如果没有下一页的请求了
                if(remainingCategoryNum){ //如果剩余可采数量还有
                    //如果当前获取到的产品数量大于剩余可采数量
                    if(data.list.length > remainingCategoryNum){
                        Crawl.categoryCrawlTotalNum = categoryNum; //直接等于最大可采数量
                    }
                }
            }
            //如果当前页没有可采产品了
            if (data.list && !data.list.length) {
                var $msgModal = $('#msgModal');
                // $('#dxmCopyUrl').val(url);
                // $msgModal.find('.crawProgressBar').css('width', '100%');
                $('#myModalLabel').text('采集成功');
                $msgModal.find('.dxmCategoryCrawlNumBox').show();
            }
        }, pageNum, {uid: uid,
            url: url,
            crawlObj: crawlObj,
            crawlCategory: crawlCategory,
            categoryNum: categoryNum});
    },

    /*
    * 计算采集的进度
    * @param url=要采集的分类产品链接
    * @param crawlObj=是采集哪个平台的对象函数
    * @param crawlCategory=true是列表页的分类采集，false是插件详情页的分类链接采集
    * @param categoryNum=是否只采集指定数量的产品(即最大可采数量)，这个字段是插件详情页的分类链接采集那里才会传
    * @param remainingCategoryNum=剩余的可采数量，用来计算是否还需要走下一页的请求
    * @param pageNum=要采集的产品分页
    * */
    newRecordCrawlResult: function(data, url, repeat, crawlCategory, isRepeatCrawlConfirm, repeatCrawlCount){
        var dxmTotalNum = Crawl.categoryCrawlTotalNum, //需要采集的产品总数 //+($('.dxmTotalNum').text()),
            $dxmCopyUrl = $('#dxmCopyUrl'), //用来保存失败链接的文本域节点，复制失败链接时用到
            $msgModal = $('#msgModal'), //信息展示弹层
            $successNum = !crawlCategory ? $('#successNum') : $msgModal.find('.dxm-f-blue'), //判断是列表页的分类采集还是插件详情页的分类链接采集，取不同的节点
            $failNum = !crawlCategory ? $('#failNum') : $msgModal.find('.dxmFail'), //判断是列表页的分类采集还是插件详情页的分类链接采集，取不同的节点
            successNum = parseInt($successNum.text()), //获取当前已经采集成功的产品数量
            failNum = parseInt($failNum.text()); //获取当前已经采集失败的产品数量

        $dxmCopyUrl.val('');
        $('#checkFailUrl').show(); //复制失败链接节点显示
        if (!crawlCategory) { //如果是插件详情页分类链接采集则进入if
            $('#crawlingDesc').html('正在采集：' + url);
            if (+repeat !== 1) { //不是重复采集的情况才进入
                if (!+data.code) { //如果采集成功
                    $successNum.text(successNum + 1); //成功数+1
                } else { //如果采集失败
                    $failNum.text(failNum + 1); //失败数+1
                    failsUrls += url + '\n'; //失败链接拼接
                    if (data.msg) {
                        $dxmCopyUrl.val(failsUrls);
                        $('#failDetailDiv').show();
                        $('#failDetail').append('<p>' + data.msg + '<br/>采集url:' + url + '</p>');
                    }
                }
            }
        } else { //如果是列表页分类采集则进入else
            if (+repeat !== 1) { //不是重复采集的情况才进入
                if (!+data.code) { //如果采集成功
                    if (isNaN(successNum)) successNum = 0;
                    successNum += 1; //成功数+1
                    $msgModal.find('.completionNum').text(successNum);
                    $successNum.text(successNum);
                    //计算进度条进度
                    if (+$msgModal.find('.dxmCount').text() > 0) {
                        $msgModal.find('.crawProgressBar').css('width', ((successNum + (+$failNum.text())) / $msgModal.find('.dxmCount').text()) * 100 + '%');
                    } else {
                        $msgModal.find('.crawProgressBar').css('width', ((successNum + (+$failNum.text())) / dxmTotalNum) * 100 + '%');
                    }

                    if (showCrawlFailState) Crawl.getCrawlSuccessData(data.id);//收集采集成功的id数据，用于删除获取失败数据
                } else { //如果采集失败
                    if (isNaN(failNum)) failNum = 0;
                    failNum += 1; //失败数+1
                    $failNum.text(failNum);
                    failsUrls += url + '\n'; //失败链接拼接
                    //计算进度条进度
                    if (+$msgModal.find('.dxmCount').text() > 0) {
                        $msgModal.find('.crawProgressBar').css('width', (+$successNum.text() + failNum / $msgModal.find('.dxmCount').text()) * 100 + '%');
                    } else {
                        $msgModal.find('.crawProgressBar').css('width', ((+$successNum.text() + failNum) / dxmTotalNum) * 100 + '%');
                    }
                }
                //如果采集成功数加失败数等于总数量，或者采集成功数加失败数等于采集进度弹层里的产品总数节点展示数量
                if ((+$successNum.text() + failNum) === dxmTotalNum || (+$successNum.text() + failNum) === +$msgModal.find('.dxmCount').text()) {
                    $dxmCopyUrl.val(failsUrls);
                    failsUrls = '';
                    $('#myModalLabel').text('采集成功');
                    $successNum.text($successNum.text());
                    $failNum.text($failNum.text());
                    $msgModal.find('.dxmCategoryCrawlNumBox').show();
                    // 如果采集是淘宝和天猫平台，则将采集失败的数据保存到到浏览器数据库
                    if (showCrawlFailState) Crawl.startSaveCrawlFailData();
                }
            }
        }
        // 统计当前分类采集完成的次数-这个判断是正常第一次采集的逻辑判断，非重复采集确认的逻辑
        // 如果当前分类采集完成的次数等于了分类采集需要采集的总数，并且有重复采集的产品信息
        // 弹出重复采集的产品弹层，让用户确认是否采集这些重复的产品
        if (Crawl.categoryCrawlCountNum === dxmTotalNum && dataArr.length) {
            $(document).off('click', '#submitRepeatCrawl').on('click', '#submitRepeatCrawl', function () {
                submitRepeatCrawl(true);
            });
            dxmModal.show('#repeatCrawlModal');
        }
        // 如果是重复采集弹层确认，判断当前已采集数量减去产品总数量是否等于需要重复采集的产品数量
        //比如repeatCrawlCount需要重复采集的数量是5，dxmTotalNum产品总数量是10，Crawl.categoryCrawlCountNum已采数量是10
        //那么重复采集确认时，不停累加Crawl.categoryCrawlCountNum已采数量，累加到15，减去总数量的10，则刚好等于需要重复采集的数量5
        if (isRepeatCrawlConfirm && Crawl.categoryCrawlCountNum - dxmTotalNum === repeatCrawlCount) {
            $dxmCopyUrl.val(failsUrls);
            failsUrls = '';
            $('#myModalLabel, #crawlDesc').text('采集成功');
            $msgModal.find('.dxmCategoryCrawlNumBox').show();
        }
    },

    //列表页单个采集\分类采集都会循环调用该方法，进行当前循环的单个产品采集
    newSingleCrawl : function(uid, urls, checkFinish, haveNext, crawlCategory, call){
        var urlArr = [];
        if(urls) urlArr = urls.split('\n');
        var total = urlArr.length,
            processNum = 0;

        var forFn = function (i) {
            //处理amazon链接中有其他数据
            if (urlArr[i].indexOf('amazon.com') !== -1) {
                urlArr[i] = urlArr[i].split(/,|,/)[0].replace('"', '');
            }
            //去除链接中的逗号
            if(urlArr[i].indexOf(',') > -1){
                urlArr[i] = urlArr[i].replace(/,/g, '');
            }
            if(urlArr[i].indexOf('http:') !== 0 && urlArr[i].indexOf('https') !== 0){
                urlArr[i] = 'https:' + urlArr[i];
            }
            //采集链接处理
            if (urlArr[i] && urlArr[i].indexOf('aliexpress.com/store/product/') !== -1 && urlArr[i].indexOf('.html') !== -1) {
                var itemId = urlArr[i].substring(urlArr[i].indexOf('aliexpress.com/store/product/') + 29, urlArr[i].indexOf('.html'));
                if (itemId && itemId.indexOf('/') !== -1) {
                    var itemIdArray = itemId.split('/');
                    urlArr[i] = urlArr[i].replace(itemIdArray[0] + '/', '');
                    var newItemId = itemIdArray[1];
                    if(urlArr[i] && newItemId && newItemId.indexOf('_') !== -1){
                        var idArrays = newItemId.split('_');
                        urlArr[i] = urlArr[i].replace(newItemId,idArrays[1]).replace('store/product', 'item');
                    }
                }
            }
            //获取对应的平台采集对象函数
            var crawlObj = Crawl.getCrawlObject('single', urlArr[i]);
            //判断是否获取到对应的平台采集对象函数，有则调用
            crawlObj && crawlObj.crawl(urlArr[i], function(data){
                data.uid = uid;
                data.repeatCheck = 1; //必须查重
                // 截取亚马逊商品的链接 去除qid字符串
                var crawlUrl = data.url;
                if(crawlUrl.indexOf('www.amazon.com')> -1){
                    if (crawlUrl.indexOf('qid') > -1){
                        var begin = crawlUrl.indexOf('qid'),
                            qidStr = crawlUrl.substring(begin, begin + 15);
                        data.url = crawlUrl.replace(qidStr, '');
                    }
                }

                if(data.html){ //如果获取到页面数据了
                    //调用请求存到店小秘的数据采集页
                    Html.postHtml(URL_MANAGER.url.postHTML(), data, 0, function(result){
                        processNum++;

                        //把处理采集结果的逻辑代码抽出去
                        Crawl.postHtmlResultFn(result, data, crawlCategory, checkFinish, total, processNum);

                        if (i < urlArr.length - 1) { //如果还有下一个则继续调用方法采集
                            i++;
                            forFn(i);
                        } else { //没有则调用回调函数
                            typeof call === 'function' && call();
                        }
                    });
                }else{
                    if(!crawlCategory){ //如果是插件详情页的分类链接采集
                        processNum++;
                        data.code = -1;
                        data.msg = '采集内容为空！';
                        //计算采集结果进度
                        Crawl.newRecordCrawlResult(data, data.url, 0, crawlCategory);
                        if(checkFinish && total === processNum){
                            if (dataArr.length) {
                                $('#repeatCrawlModal').find('input[name="sourceUrlRepeat"]').prop('checked', false);
                                dxmModal.hide('#crawlingModal');
                                dxmModal.show('#repeatCrawlModal');
                            } else {
                                Crawl.displayCrawlResult(checkFinish && total === processNum);
                            }
                        }
                    } else {
                        Crawl.newRecordCrawlResult({}, data.url, 0, crawlCategory);
                    }

                    if (i < urlArr.length - 1) {
                        i++;
                        forFn(i);
                    } else {
                        typeof call === 'function' && call();
                    }
                }
            }, false, true);
        };
        forFn(0);
    },

    //处理采集结果的逻辑代码
    postHtmlResultFn: function (result, data, crawlCategory, checkFinish, total, processNum) {
        if(+result.code === -10 || +result.code === -11) {
            $.fn.message({type: 'danger', msg: result.msg});
        }
        var objCrawl = result.repeatCrawlProduct,
            isRepeat = 0; //是否重复采集
        if(objCrawl){
            isRepeat = +objCrawl.repeatCrawl;
        }

        //价格为null 显示空串
        if(objCrawl && objCrawl.price == null){
            result.repeatCrawlProduct.price = '';
        }
        if(!crawlCategory){ // 如果是插件详情页的分类链接采集则进入if
            if(isRepeat === 1){//重复，生成td，并记录重复的data
                dataArr.push(data);

                var html = '<tr><td style="width:50px;">' +
                    '<input name="sourceUrlRepeat" type="checkbox" value="' + data.url + '"/></td>' +
                    '<td style="width:80px;"><div class="imgDivOut"><div class="imgDivIn">' +
                    '<img src="' + result.repeatCrawlProduct.imgUrl.split('|')[0]+ '"' +
                    ' class="imgCss" width="71px" height="71px"/></div></div></td>' +
                    '<td style="text-align:left;"><a href="' + data.url + '"' +
                    ' target="_blank">' + result.repeatCrawlProduct.name + '</a></td>';																		html += '<td style="width:80px;">'+result.repeatCrawlProduct.price+'</td></tr>';

                contentObj.append(html);
                $('#repeatCrawlModal').find('input[name="sourceUrlRepeat"]').prop('checked', false);
                if (checkFinish && total === processNum && !SmtCategoryCrawl.stop) {//表示采集完成,显示重复采集记录模态层
                    dxmModal.hide('#crawlingModal');
                    dxmModal.show('#repeatCrawlModal');
                }
            }
            //记录采集结果 (最后一条+没有下一页才显示)
            Crawl.newRecordCrawlResult(result, data.url, isRepeat, crawlCategory);
            if(checkFinish && total === processNum && !SmtCategoryCrawl.stop){
                if (dataArr.length) {
                    dxmModal.hide('#crawlingModal');
                    dxmModal.show('#repeatCrawlModal');
                } else {
                    Crawl.displayCrawlResult(checkFinish && total === processNum);
                }
            }
        }else{
            //判断是否重复
            if(isRepeat === 1){
                dataArr.push(data);
                var $repeatCrawlModal = $('#repeatCrawlModal'),
                    html = '<tr class="content"><td class="has-ipt">' +
                        '<input name="sourceUrlRepeat" type="checkbox" value="' + data.url + '">' +
                        '</td><td class="img-box"><div class="img-out">' +
                        '<img class="imgCss" src="' + objCrawl.imgUrl.split('|')[0] + '"' +
                        ' width="50px" height="50px"/></div></td>' +
                        '<td><a href="' + data.url + '" target="_blank">' + objCrawl.name + '</a></td>' +
                        '<td class="num dxm-f-right">' + objCrawl.price + '</td></tr>';

                $repeatCrawlModal.find('#repeatValue').append(html);
                $repeatCrawlModal.find('input[name="sourceUrlRepeat"]').prop('checked', false);
            }
            Crawl.newRecordCrawlResult(result, data.url, isRepeat, crawlCategory);
        }
    }
};