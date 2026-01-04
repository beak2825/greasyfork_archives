// ==UserScript==
// @name         US工单助手诚管24
// @namespace    https://us.icityup.com/
// @license    MIT
// @version      20250807000BATE
// @description  运营工作台工单助手-成都项目使用
// @author       liudong
// @match               https://cdcgzgf.cn:13204/cgtf/dealCenter
// @match               https://us-gray.icityup.com/?zfToken
// @match               https://us-gray.icityup.com?zfToken
// @match               https://us-gray.icityup.com/wel/index?zfToken
// @match               https://us.icityup.com/?zfToken
// @match               https://us.icityup.com?zfToken
// @match               https://us.icityup.com/wel/index?zfToken
// @compatible          chrome
// @compatible          firefox
// @compatible          edge
// @compatible          opera
// @compatible          brave
// @compatible          vivaldi
// @compatible          waterfox
// @compatible          librewolf
// @compatible          ghost
// @compatible          qq
// @resource css      https://cdnjs.cloudflare.com/ajax/libs/layui/2.8.12/css/layui.css
// @require     https://cdnjs.cloudflare.com/ajax/libs/layui/2.8.12/layui.js
// @require     https://cdn.jsdelivr.net/momentjs/latest/moment.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @require      https://unpkg.com/ajax-hook@3.0.3/dist/ajaxhook.min.js
// @run-at       document-start
// @icon                https://raw.githubusercontent.com/adamlui/userscripts/master/chatgpt/media/icons/openai-favicon48.png
// @icon64              https://raw.githubusercontent.com/adamlui/userscripts/master/chatgpt/media/icons/openai-favicon64.png
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant      GM_addStyle
// @grant      GM_getResourceText


// @downloadURL https://update.greasyfork.org/scripts/546641/US%E5%B7%A5%E5%8D%95%E5%8A%A9%E6%89%8B%E8%AF%9A%E7%AE%A124.user.js
// @updateURL https://update.greasyfork.org/scripts/546641/US%E5%B7%A5%E5%8D%95%E5%8A%A9%E6%89%8B%E8%AF%9A%E7%AE%A124.meta.js
// ==/UserScript==

(function () {
    GM_addStyle(GM_getResourceText("css"))
    GM_addStyle('.loading-animation{width:50px;height:50px;margin:auto;border:5px solid #ccc;border-top-color:#000;border-radius:50%;animation:spin 1s infinite linear}@keyframes spin{0%{transform:rotate(0deg)}to{transform:rotate(360deg)}}')
    console.info("this location is: " + location.href)

    const locationArr= [
        'https://us-gray.icityup.com/?zfToken',
        'https://us-gray.icityup.com?zfToken',
        'https://us-gray.icityup.com/wel/index?zfToken',
        'https://us.icityup.com/?zfToken',
        'https://us.icityup.com?zfToken',
        'https://us.icityup.com/wel/index?zfToken',
    ];

    // 匹配一个开始处理token
    for(let i=0;i<locationArr.length;i++){
        if(location.href.indexOf(locationArr[i]) > -1 ){
            console.info("处理US登录过程")
            if (localStorage.getItem("saber-userInfo")) {
                // 已登录
                const token = JSON.parse(localStorage.getItem("saber-token"))['content']
                layer.prompt({title: '当前US用户token，请复制', formType: 2, value: token},
                    function (token, index) {
                        layer.close(index);
                    });
            } else {
                // 轮询取token
                const si = setInterval(function () {
                    console.info("获取用户TOKEN信息")
                    if (localStorage.getItem("saber-userInfo")) {
                        clearInterval(si);
                        // 已登录
                        const token = JSON.parse(localStorage.getItem("saber-userInfo"))['content']['access_token']
                        layer.prompt({
                                title: '当前US用户token，请复制',
                                formType: 2,
                                value: token,
                                shade: 0
                            },
                            function (token, index) {
                                layer.close(index);
                            });
                    }
                }, 5000);
            }
            return;
        }
    }



    const initTimer = setTimeout(initByLazy, 10000)
    const origin_urls = ["/cgtf/apis/city-operation/operation/event-info-details/event-info"]
    const flowTag = {
        arert_401: false
    }
    const cacheMap = new CustomPageCache(5 * 60 * 1000);
    window.cacheMap = cacheMap;



    function match(url) {
        
        for (let i = 0; i < origin_urls.length; i++) {
            if (url.indexOf(origin_urls[i]) > -1) {
                return true;
            }
        }
        return false;
    }

    //验证字符串是否是数字
    function checkNumber(theObj) {
        var reg = /^[0-9]+.?[0-9]*$/;
        if (reg.test(theObj)) {
            return true;
        }
        return false;
    }

    // 永久的缓存
    function CustomCacheOnLocalStorage(ttl) {
        this.cache = localStorage.getItem("OrderUtilCustomCache");
        this.ttl = 10 * 60 * 1000
        if (ttl) {
            this.ttl = ttl
        }
    }

    CustomCacheOnLocalStorage.prototype.set = function (key, value) {
        let localCacheStr = localStorage.getItem("OrderUtilCustomCache");
        if (!localCacheStr) {
            localCacheStr = "{}";
        }
        const localCache = JSON.parse(localCacheStr)
        localCache[key] = {
            value: value,
            timestamp: Date.now()
        };
        localStorage.setItem("OrderUtilCustomCache", JSON.stringify(localCache))
    };

    CustomCacheOnLocalStorage.prototype.get = function (key) {
        const localCacheStr = localStorage.getItem("OrderUtilCustomCache");
        if (!localCacheStr) {
            return null;
        }
        const localCache = JSON.parse(localCacheStr)
        const cacheItem = localCache[key];
        const ttl = this.ttl;

        if (cacheItem && Date.now() - cacheItem.timestamp <= ttl) {
            return cacheItem.value;
        } else if (cacheItem && Date.now() - cacheItem.timestamp > ttl) {
            // 删除缓存
            console.info("缓存过期删除--->" + key)
            delete localCache[key]
            localStorage.setItem("OrderUtilCustomCache", JSON.stringify(localCache))
        }
        return null
    };


    // 页面缓存-内存
    function CustomPageCache(ttl) {
        this.cache = {};
        this.ttl = 10 * 60 * 1000
        if (ttl) {
            this.ttl = ttl
        }
    }

    CustomPageCache.prototype.set = function (key, value) {
        this.cache[key] = {
            value: value,
            timestamp: Date.now()
        };
    };

    CustomPageCache.prototype.get = function (key) {
        const cacheItem = this.cache[key];
        const ttl = this.ttl;

        if (cacheItem && Date.now() - cacheItem.timestamp <= ttl) {
            return cacheItem.value;
        } else if (cacheItem && Date.now() - cacheItem.timestamp > ttl) {
            // 删除缓存
            console.info("缓存过期删除--->" + key)
            delete this.cache[key]
        }
        return null;
    };


    /**
     * 填充工单状态
     * @param row
     * @param order_data
     * @param res
     */
    function drawOrderStatus(order_data, res) {
        console.log(new Date().getTime() + "-->" + order_data.orderId + " 更新工单状态")
        $("#usOrder").remove();


        const usOrderCss = {
            position: "fixed",
            display: "block",
            width: "400px",
            bottom: "90px",
            right: "90px",
            padding: "5px",
            "font-size": "1.2rem",
            "z-index": 9999999999
        }

        const $usOrder = $("<div class='layui-card' style='display: none' id='usOrder'></div>")
        $usOrder.css(usOrderCss)
        $usOrder.append("<div class='layui-card-header'>政务工单号：" + order_data.orderId + "<span id='closeBox' style='float: right; cursor: pointer;'>关闭</span></div>")
        const $usOrderBody = $("<div class='layui-card-body'></div>")
        $usOrder.append($usOrderBody)

        if (res.list && res.list.length > 0) {
            // 存在US工单
            
            const usOrderId = res.list[0]['tririgaNo'];
            const issueStatusCName = res.list[0]['issueStatusCName'];
            const reportNickName = res.list[0]['reportNickName'];
            const location = res.list[0]['location'];
            const orderJson = JSON.stringify(res.list[0]);
            $usOrderBody.append("<a style='color:red;background:blanchedalmond;cursor:pointer;font-weight:bold' data-toggle=\"tooltip\" data-placement=\"top\" data-json='" + orderJson + "' id='usOrderBtn' data-action='orderDetail' href='javascript:;' >US工单编号：<span class='usOrderId'>" + usOrderId + "</span></a>");
            $usOrderBody.append("<div>US工单状态：<span class='issueStatusCName' style='font-size: 1.5rem'>" + issueStatusCName + "</span></div>");
            $usOrderBody.append("<div>上报人：<span class='reportNickName'>" + reportNickName + "</span></div>");
            $usOrderBody.append("<div>位置：<span class='reportNickName'>" + location + "</span></div>");
        } else {
            //不存在US工单
            
            $usOrderBody.append("<div>建议描述: <span style='color: #1e9fff;font-size: 1.3rem;font-weight:bold' >" + order_data.orderDescDetail+"</span></div>");
            $usOrderBody.append("<div>建议位置: <span style='color: #1e9fff;font-size: 1.3rem;font-weight:bold'>" + order_data.orderPos + "</span></div>");
            $usOrderBody.append("<div>建议原因: <span style='color: #1e9fff;font-size: 1.3rem;font-weight:bold'>" + order_data.orderClass + "</span></div>");
            $usOrderBody.append("<button id='usOrderBtn' data-action='createOrder' style='margin-top: 5px' type=\"button\" class=\"layui-btn layui-bg-blue \">发起US工单</button>");
        }
       /***
              $usOrderBody.append("<div>建议描述: <span style='color: #1e9fff;font-size: 1.3rem;font-weight:bold' >" + order_data.orderDescDetail+"</span></div>");
            $usOrderBody.append("<div>建议位置: <span style='color: #1e9fff;font-size: 1.3rem;font-weight:bold'>" + order_data.orderPos + "</span></div>");
            $usOrderBody.append("<div>建议原因: <span style='color: #1e9fff;font-size: 1.3rem;font-weight:bold'>" + order_data.orderClass + "</span></div>");
            $usOrderBody.append("<button id='usOrderBtn' data-action='createOrder' style='margin-top: 5px' type=\"button\" class=\"layui-btn layui-bg-blue \">发起US工单</button>");
             ***/

        $('body').append($usOrder);
        $usOrder.fadeIn();
        if(document.getElementById("closeBox")){
            document.getElementById("closeBox").addEventListener('click', function (e) {

                 $("#usOrder").remove();
            })
        }
if(document.getElementById("usOrderBtn")) {
         document.getElementById("usOrderBtn").addEventListener('click', function (e) {
            
            e.stopPropagation();
            const $this = $(this);
            const action = $this.attr("data-action")

            const offset = GM_getValue("openOrderWin")
            let anim = "slideDown"
            if (offset == 'l') {
                anim = 'slideRight'
            } else if (offset == 'r') {
                anim = 'slideLeft'
            }

            if (action == 'createOrder') {

                // todo  这里加入自动填充代码 如果不需要自动填充图片则去除这个包装方法
                transform2UsOrderData(order_data,function (res){
                    const usOrderJson =encodeURIComponent( JSON.stringify(res));
                    console.info("打开US工单窗口",'https://us.icityup.com/create-order/#/batchDialogFullScreen?data='+usOrderJson);
                    let usOrderWin= layer.open({
                        type: 2,
                        title: "政务工单:" + order_data.orderId + '  US工单处理(' + order_data.orderDesc + ')',
                        shadeClose: false,
                        maxmin: true, //开启最大化最小化按钮
                        shade: 0, // 遮罩透明度
                        area: ['1000px', '800px'],
                        scrollbar: true,
                        offset: offset,
                        anim: anim,
                        // content: 'https://us.icityup.com/processSupervision/batchDelivery/batchDelivery',
                        content: 'https://us.icityup.com/create-order/#/batchDialogFullScreen?data='+usOrderJson,
                    });
                    refreshUsOrderStatus(function ($call_app,order_data,res){
                        // 销毁DOM

                        layer.close(usOrderWin)
                        drawOrderStatus($call_app,order_data,res)
                    },order_data);
                })



            } else if (action == 'orderDetail') {
                const orderJson = JSON.parse($this.attr('data-json') ? $this.attr('data-json') : "{}");
                layer.open({
                    type: 2,
                    title: "政务工单编号:" + order_data.orderId + '-对应US工单编号(' + orderJson['tririgaId'] + ')-详细信息',
                    shadeClose: false,
                    maxmin: true, //开启最大化最小化按钮
                    shade: 0, // 遮罩透明度
                    area: ['1000px', '800px'],
                    scrollbar: true,
                    offset: offset,
                    anim: anim,
                    content: 'https://us.icityup.com/create-order/#/workOrderDetailFullScreen?&projectId=1052&projectIds=1052,1096,1249&tririgaId=' + orderJson['tririgaId'],
                });


            }
        });
}

    }

    function getCurrentZfOrderDetail(orderdata) {
        const order_data = {
            "orderId": orderdata.eventCode,
            "orderDesc": orderdata.standardEventContent,
            // "orderDesc2": $("#eGovaComponent_39_40").val(), // 隐藏立案条件 by 20240319
            "orderDesc2": "",
            "orderPos": orderdata.extendAddress,
            "orderClass": orderdata.extendClass, //
            "timeExp":orderdata.disposeDeadline, // 时效
            "communityName":orderdata.communityName, // 所属社区
            "preHandleAttachmentInfos": orderdata.preHandleAttachmentInfos//图片信息
        }
        // 详细描述
        order_data['orderDescDetail'] = "智信件-" + order_data.orderId +" "+order_data.communityName+"-" + order_data.orderDesc + "，" + order_data.orderDesc2 +"" +"(时效:"+order_data.timeExp+")"
        if (checkNumber(order_data.orderId)) {
            order_data['queryStartTime'] = moment(order_data.orderId.substring(0, 8), "YYYYMMDD").format("YYYY-MM-DD");
            order_data['queryEndTime'] = moment().format("YYYY-MM-DD");
            order_data['cacheKey'] = ("zf_order_" + order_data.orderId).trim();
        }
        return order_data;
    }

    const getUrlList = async () =>{

    }
    // 转化为US工单信息
    async function transform2UsOrderData(order_date,callback){
        // 图片转base64
          const preHandleAttachmentInfos = order_date.preHandleAttachmentInfos
        uploadImages2Us(preHandleAttachmentInfos,usImages => {
                 const usImagesJson=[];
                for(let i=0;i<usImages.length;i++){
                    usImagesJson.push({"name":Date.now()+(i),"url":usImages[i]});
                }
            debugger
          const usOrderParams={
                    // require, 任务描述
                    description: order_date.orderDescDetail,
                    // require 图片列表，数组
                    fileList:  usImagesJson, // 格式[{"name":Date.now()+(i),"url":usImages[i]}]
                    // require 报事原因名称
                    // requestClassIdName: order_date.orderClass,  // 存在部分项目原因对不上，先不推荐; 此参数如果没有匹配则切换到级联选择
                    requestClassIdName: order_date.orderClass,
                    // require 位置名称
                    // positionName: order_date.orderPos,   // 存在部分项目位置错误，先不推荐; 此参数如果没有匹配则切换到级联选择
                    positionName: "",
                    // 下面非必填
                    // fix , GPS坐标
                    // coordinate: '21.121545,31.45645454',
                    // fix, // 开始时间
                    // planStartTime: '2023-09-05 10:00:01',
                    // fix, 派发方式， 默认派发到责任组织
                    distributeMethod: 0,
                    // require, 工单来源
                    bizSource: '政府报事',
                    // fix 代课报事1， 否则2
                    isValet: '2',
                    projectCodes: '51010161-1033-成都新川片区,51010409-1482-成都中和北区'
                }
                console.info(usOrderParams)
                callback(usOrderParams)
        })
    }


    function uploadImages2Us(urlList,callback) {
         const usToken = GM_getValue('usToken');
        const imageUrlArray = [];

        // 计数器，用于判断所有图片是否上传完成
        let counter = 0;

        // 上传单个图片
        function uploadImage(url, index) {

            $.ajax({
                "url": `https://us-api.icityup.com/wwy-us-adapter/v1/upload/uploadByUrl?url=${url}`,
                "method": "POST",
                "timeout": 0,
                "headers": {
                     "saas-auth": "bearer " + usToken,
                    "content-type": "application/json;charset=UTF-8"
                },
                contentType: 'application/json; charset=utf-8',
                method: 'POST',
                // fix jq 自动拼接nonce，timestamp，signature到body的问题
                success: function(response) {
                    if(response['code'] === 0||response['code'] === 200){
                        imageUrlArray[index] = response['data']['obsPath'];
                        console.info('上传第'+(index+1)+'张图片成功：' + response['data']['obsPath'] );
                    }else {
                        console.info('上传第'+(index+1)+'张图片失败：' + response['msg'] );
                        console.info("上传失败，参数--->"+url)
                    }

                    counter++;

                    // 检查是否所有图片都已上传完成
                    if (counter === urlList.length) {
                        callback(imageUrlArray);
                    }
                },
                error: function(error) {
                    console.error('上传图片失败:', error);
                    counter++;
                }
            });
        }

        // 遍历图片Base64数组，上传图片
        urlList.forEach((item, index) => {
            uploadImage(item.attachmentAllPath, index);
        });
    }




    function refreshUsOrderStatus(call,call_order_date) {
        
        const $app = $("div.ant-modal.css-5urwip");
        let reCount=10;
        const si = setInterval(function () {
            const order_data = getCurrentZfOrderDetail(call_order_date);
            if(GM_getValue("usSessionSuccess")=='1'){
                getUsOrderStatus(order_data.queryStartTime, order_data.queryEndTime, order_data.orderId, false, order_data.cacheKey,
                    function (res) {
                        if(res.list && res.list.length > 0){
                            console.info("US状态变更")
                            clearInterval(si)
                            call($app,order_data,res)
                        }
                        reCount--;
                        if(reCount==0){
                            clearInterval(si)
                        }
                    });
            }else {
                clearInterval(si)
            }
        }, 8000);
    }


    // open func
    window.handleUsOrderStatus = function () {
        
        const $app = $("div.ant-modal.css-5urwip");
        const order_data = getCurrentZfOrderDetail();
        const cacheVal = cacheMap.get(order_data.cacheKey);
        if (cacheVal) {
            console.info("从缓存读取key:" + order_data.cacheKey + " value:" + cacheVal)
            drawOrderStatus($app, order_data, cacheVal)
            return
        }
        getUsOrderStatus(order_data.queryStartTime, order_data.queryEndTime, order_data.orderId, false, order_data.cacheKey,
            function (res) {
                if (res == null) {
                    return
                }
                try {
                    drawOrderStatus($app, order_data, res);
                } catch (e) {
                    console.error(e)
                }
            });
    }

    // 获取US token JSON.parse(localStorage.getItem("saber-userInfo"))['content']['access_token']

    /**
     *
     * 获取工单状态 workOrderBoard 上线后替换为workOrderBoardSimple
     * @param startDate
     * @param endDate
     * @param desc
     * @param enableCache 是否使用缓存
     * @param call
     */
    window.getUsOrderStatus = function (startDate, endDate, desc, enableCache, cacheKey, call) {
        
        const usToken = GM_getValue('usToken');
        const settings = {
            "url": "https://us-api.icityup.com/wwy-us-report/v2/order_report/workOrderBoardSimple",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "saas-auth": "bearer " + usToken,
                "content-type": "application/json;charset=UTF-8",
            },
            "data": JSON.stringify(
                {
                    "projectIds": [1033,1482,1431,1443,1472],
                    "pageSize": 10,
                    "pageNum": 1,
                    "fieldCodes": "dealResOrg,reqClassPath,issueType,firstLevelType,workSource,orderTitle,location,usCreatorOrg,dismissedOpinion,createTime,usCreator,resOrgPath,isOutGetWork,issueStatus,projectName,planStartTime,result,userName,description,resolutionDesc,planFinishTime,tririgaNo,isOutFinish,firstArrivalTime,handOutTime,checkoutTime,overallSatisfaction,facilityName,checkoutPeople,finishTime,dismissedOpinion",
                    "purpose": "table",
                    "settingType": "user",
                    "handOutTimeStart": startDate,
                    "handOutTimeEnd": endDate,
                    "tririgaNo": "",
                    "description": desc,
                    "supplierTririgaCode": ""
                }
            ),
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest.status);
                if(XMLHttpRequest.status == 401) {
                    layer.msg('会话过期，请设置US-token');
                    GM_setValue("usSessionSuccess","0")
                    layer.confirm('<p style="color: black">当前插件US-TOKEN已失效，需要引导获取吗？</p>',
                        function (index) {
                            layer.close(index);
                            // 自动设置
                            const usTokenIndex= layer.open({
                                type: 2,
                                id: "usloginff",
                                title: "US登录",
                                shadeClose: false,
                                maxmin: true, //开启最大化最小化按钮
                                shade: 0, // 遮罩透明度
                                area: ['600px', '800px'],
                                scrollbar: true,
                                offset: 'l',
                                anim: 'slideRight',
                                content: 'https://us.icityup.com/?zfToken',
                            });
                            layer.prompt({title: '请输入运营工作台的token', formType: 2,shade: 0},
                                function (token, index2) {
                                    layer.close(index2);
                                    layer.close(usTokenIndex);
                                    if (token !== null) {
                                        // 保存token到本地缓存
                                        GM_setValue('usToken', token);
                                    }
                                });
                        }, function () {

                        });

                    // $("#usOrderStBtn").click();

                }
                    console.log(XMLHttpRequest.readyState);
                    console.log(textStatus);
                },
        };
        console.log("--->请求US工单状态:" + desc);
        $.ajax(settings).done(function (response) {

            if (response.code == 0) {
                if (enableCache) {
                    console.log("设置缓存-->" + cacheKey);
                    cacheMap.set(cacheKey, response.data);
                }
                console.log("--->请求US工单成功：" + JSON.stringify(response));
                call(response.data)
            } else {

                console.log("--->请求US工单异常：" + JSON.stringify(response));
                call(null)
            }

        });


    }

    /**
     * 页面加载监听
     */

    $(() => {
    	function addXMLRequestCallback(callback){
            // 是一个劫持的函数
            var oldSend, i;
            if( XMLHttpRequest.callbacks ) {
                //   判断XMLHttpRequest对象下是否存在回调列表，存在就push一个回调的函数
                // we've already overridden send() so just add the callback
                XMLHttpRequest.callbacks.push( callback );
            } else {
                // create a callback queue
                XMLHttpRequest.callbacks = [callback];
                // 如果不存在则在xmlhttprequest函数下创建一个回调列表
                // store the native send()
                oldSend = XMLHttpRequest.prototype.send;
                // 获取旧xml的send函数，并对其进行劫持
                // override the native send()
                XMLHttpRequest.prototype.send = function(){
                    // process the callback queue
                    // the xhr instance is passed into each callback but seems pretty useless
                    // you can't tell what its destination is or call abort() without an error
                    // so only really good for logging that a request has happened
                    // I could be wrong, I hope so...
                    // EDIT: I suppose you could override the onreadystatechange handler though
                    for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                        XMLHttpRequest.callbacks[i]( this );
                    }
                    // 循环回调xml内的回调函数
                    // call the native send()
                    oldSend.apply(this, arguments);
                //    由于我们获取了send函数的引用，并且复写了send函数，这样我们在调用原send的函数的时候，需要对其传入引用，而arguments是传入的参数
                }
            }
        }
        // e.g.
        addXMLRequestCallback( function( xhr ) {
                // 调用劫持函数，填入一个function的回调函数
                // 回调函数监听了对xhr调用了监听load状态，并且在触发的时候再次调用一个function，进行一些数据的劫持以及修改
                xhr.addEventListener("load", function(){
                if ( xhr.readyState == 4 && xhr.status == 200 ) {
                    if(xhr.responseURL.includes('/cgtf/apis/city-operation/operation/event-info-details/event-info')){
                        console.log(xhr.response);
                        const response = JSON.parse(xhr.response)
                        const order_data = getCurrentZfOrderDetail(response.data)
                           getUsOrderStatus(order_data.queryStartTime, order_data.queryEndTime, order_data.orderId, false, order_data.cacheKey,
                                            function (res) {
                               if (res == null) {
                                   return
                               }
                               try {
                                   drawOrderStatus(order_data, res);
                               } catch (e) {
                                   console.error(e)
                               }
                           });
                    }
                }
            });
        });
    })
    function initByLazy() {
         const originalAjax = jQuery.ajax;
/****
        // 创建一个新的jQuery.ajax函数
        jQuery.ajax = function (options) {
            // 拦截请求
            
            const url = options.url;
            const originalSuccess = options.success;
            const originBeforeSend = options.beforeSend;
            const originComplete= options.complete;
            options.success = function (data, textStatus, jqXHR) {
                
                GM_setValue("usSessionSuccess","1")
                // 获取
                if (originalSuccess) {
                    if (match(url)) {
                        // tag 工单列表
                        setTimeout(handleUsOrderStatus, 1000);
                    }
                    originalSuccess(data, textStatus, jqXHR);
                }
            };
            options.beforeSend=function () {
                
                if (match(url)) {
                    // 隐藏组件 加上浮层3
                    $("#usOrder").css("width", "200px")
                    $("#usOrder").css("opacity", "0.7")
                    $("#usOrder").html("<div style=\"text-align: center; margin-top: 50px; margin-bottom: 50px \">  <div class=\"loading-animation\"></div><h6 style='margin-top: 15px'>加载中...</h6></div>");
                }
                // 保留原有逻辑
                if (originBeforeSend) {
                    originBeforeSend();
                }
            };
            
            const originalError = options.error;
            options.error = function (jqXHR, textStatus, errorThrown) {
                console.log("请求失败");
                console.log(errorThrown);
                if (originalError) {
                    originalError(jqXHR, textStatus, errorThrown);
                }
                if (jqXHR.status == 401 && !flowTag.arert_401) {
                    layer.msg('会话过期，请设置US-token');
                    GM_setValue("usSessionSuccess","0")
                    layer.confirm('<p style="color: black">当前插件US-TOKEN已失效，需要引导获取吗？</p>',
                        function (index) {
                            layer.close(index);
                            // 自动设置
                            const usTokenIndex= layer.open({
                                type: 2,
                                id: "usloginff",
                                title: "US登录",
                                shadeClose: false,
                                maxmin: true, //开启最大化最小化按钮
                                shade: 0, // 遮罩透明度
                                area: ['600px', '800px'],
                                scrollbar: true,
                                offset: 'l',
                                anim: 'slideRight',
                                content: 'https://us.icityup.com/?zfToken',
                            });
                            layer.prompt({title: '请输入运营工作台的token', formType: 2,shade: 0},
                                function (token, index2) {
                                    layer.close(index2);
                                    layer.close(usTokenIndex);
                                    if (token !== null) {
                                        // 保存token到本地缓存
                                        GM_setValue('usToken', token);
                                    }
                                });
                        }, function () {

                        });

                    // $("#usOrderStBtn").click();
                }
            };

            // 调用原始的jQuery.ajax函数
            return originalAjax(options);
        };
        ****/
        // 增加设置按钮
        const button = document.createElement('button');
        button.innerHTML = '设置';
        button.style.position = 'fixed';
        button.style.bottom = '100px';
        button.style.right = '30px';
        button.style.zIndex = '999999999';
        button.style.backgroundColor = '#1e9fff';
        button.style.border = '0';
        button.style.borderRadius = '100%';
        button.style.height = '50px';
        button.style.width = '50px';
        button.style.fontSize = '15px';
         button.style.color = '#fff';
        button.id = "usOrderStBtn"
        document.body.appendChild(button);
        // 点击设置按钮时的处理函数
        button.addEventListener('click', function () {
            var savedToken = GM_getValue('usToken');
            var openOrderWin = GM_getValue('openOrderWin');
            if (!openOrderWin) {
                openOrderWin = "l";
                GM_setValue('openOrderWin', openOrderWin);
            }

            layer.prompt({title: '请输入运营工作台的token', formType: 2, value: savedToken},
                function (token, index) {
                    layer.close(index);
                    if (token !== null) {
                        // 保存token到本地缓存
                        GM_setValue('usToken', token);
                    }
                });
            layer.prompt({title: '请设置工单窗口位置(l(左),r(右),auto(居中))', formType: 2, value: openOrderWin},
                function (openOrderWin, index) {
                    layer.close(index);
                    if (openOrderWin !== null) {
                        // 保存位置到本地缓存
                        GM_setValue('openOrderWin', openOrderWin);
                    }
                });
        });

        clearTimeout(initTimer);
    }
})();