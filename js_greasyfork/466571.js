// ==UserScript==

// @name         刹车片匹配#
// @namespace    http://tampermonkey.net/
// @version      0.8.0
// @description  刹车片匹配功能
// @author       You
// @match        https://whnot.51cjml.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/466571/%E5%88%B9%E8%BD%A6%E7%89%87%E5%8C%B9%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/466571/%E5%88%B9%E8%BD%A6%E7%89%87%E5%8C%B9%E9%85%8D.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var macadd = '20230723';
    var status;


    //获取汽车所有信息，获取过程中，若数据库存在，则不处理， 不存在则录入数据
    function getCarInfo(callback){
        var FrontBrake = new Array();
        var RearBrake = new Array();
        var SenseLine = new Array();

        $('#SearchResult').ready(function(){
            console.log("文档加载完成，获取节点信息");
            setTimeout(function(){
                //获取车型信息
                var carInfo = {
                    'brand': '',        //品牌
                    'models': '',       //车型
                    'displacement':'',  //排量
                    'remarks': ''

                }

                var vin =  $(document).find('.isCarName').text()
                if(vin){
                    const vin_value = $("#vinData").val();  // 获取输入框的值
                    carInfo.remarks = vin_value
                    const arr = vin.split(" ");  // 将字符串按空格分割为数组// 取得车型名
                    if(arr.length =5){
                        carInfo.brand = arr[0]
                        carInfo.models = arr[1]+arr[2]+arr[3];  // 取得发动机信息
                        carInfo.displacement = arr[4];  // 取得发动机信息
                    }else{
                        carInfo.brand = arr[0]
                        carInfo.models = arr[1]+arr[2];  // 取得发动机信息
                        carInfo.displacement = arr[3];  // 取得发动机信息
                    }

                }else {
                    $('.pageTopSearchBox').find('#autoSearchBlock span').each(function (index, element){
                        var text = $(element).text();
                        if (index === 0) {
                            carInfo.brand = text;
                        } else if (index === 1) {
                            carInfo.models = text;
                        } else if (index === 2) {
                            carInfo.displacement = text;
                        }
                    });
                }

                $('.singleTableBox').each(function(){
                    var singleTableName = $(this).find('.singleTableName  p.left').text();
                    //遍历型号，放入数组
                    $(this).find('.singleTableStyle tr').each(async function(index, element) {
                        //刹车片信息对象
                        var scp_product = {
                            brand:'',
                            models:'',
                            displacement:'',
                            scp_model:'',
                            depth:'',
                            hight:'',
                            wide:'',
                            type:'',
                            norms:'',
                            scp_system:'',
                            chcek_num:'',
                            scp_type:'',
                            remarks: ""
                        };
                        //感应线信息对象
                        var gyx_product = {
                            brand:'',
                            models:'',
                            displacement:'',
                            gyx_model:'',
                            length:'',
                            norms:'',
                            year:'',
                            gyx_type:'',
                            chcek_num:'',
                            remarks: ""
                        };

                        if (singleTableName == '前刹车片') {
                            $(this).find('.productName2').each(function () {
                                FrontBrake.push($(this).text());
                                scp_product['scp_model'] = $(this).text();
                                scp_product['scp_type'] = "前刹";
                                scp_product['chcek_num'] = 1;
                                scp_product['brand'] = carInfo['brand']
                                scp_product['models'] = carInfo['models']
                                scp_product['displacement'] = carInfo['displacement']

                            });
                            var productExplain = $(this).find(".productExplain").text();
                            console.log(productExplain)
                            scp_product['remarks'] = productExplain;

                            var content = $(this).find('.be-parameterBox span').html();
                            content = content.replace(/<[^>]*>/g, ''); // 过滤HTML标签
                            if (content.includes("包装")){
                                scp_product['remarks'] = (productExplain+content).replace(/\s/g, '');
                            }

                            //获取型号尺寸，制动系统
                            $(".productBox").find(".be-parameterBox > span").each(function () {
                                var title = $(this).attr("title"); // 获取当前span元素中title属性的值
                                if(title){
                                    // console.log("--------------------------------")
                                    // console.log(title)
                                    if (title.includes("高度")){
                                        scp_product['hight'] = title
                                    }else if (title.includes("宽度")){
                                        scp_product['wide'] = title
                                    }else if(title.includes("厚度")){
                                        scp_product['depth'] = title
                                    }else if(title.includes("包装规格")){
                                        scp_product['norms'] = title
                                    }else if(title.includes("制动系统")){
                                        scp_product['scp_system'] = title
                                    }
                                }

                            });

                            //获取产品类型，制动系统以及时间
                            var year =   $(this).find(".tdRight").find("p").eq(0).text().replace(/\s+/g, "");
                            scp_product['year'] = year
                            // console.log(JSON.stringify(scp_product))

                            //判断是否已存在，不存在则入库，存在则访问次数+1
                            carInfo['scp_model'] = scp_product['scp_model']
                            var result =  await inspect_carinfo(carInfo, "http://119.29.203.233:81/search/carInfo_scp")
                            carInfo.remarks = result[0].remark
                            if(result.length === 0){
                                    inserdata(scp_product,"http://119.29.203.233:81/insert/cinfo_scp");
                                console.log('数据插入成功！')
                                console.log(carInfo);
                            }else {

                                add_check_num("http://119.29.203.233:81/insert/updataCarInfo_scp?cid=",result[0].cid,singleTableName);
                            }

                        } else if (singleTableName == '后刹车片') {
                            $(this).find('.productName2').each(function () {
                                RearBrake.push($(this).text());
                                scp_product['brand'] = carInfo['brand']
                                scp_product['models'] = carInfo['models']
                                scp_product['displacement'] = carInfo['displacement']
                                scp_product['scp_model'] = $(this).text();
                                scp_product['scp_type'] = "后刹";
                                scp_product['chcek_num'] = 1;

                            });
                            var productExplain = $(this).find(".productExplain").text();
                            scp_product['remarks'] = productExplain;


                            var content = $(this).find('.be-parameterBox span').html();
                            content = content.replace(/<[^>]*>/g, ''); // 过滤HTML标签
                            if (content.includes("包装")){
                                scp_product['remarks'] = (productExplain+content).replace(/\s/g, '');


                            }
                            //获取型号尺寸，制动系统
                            $(this).find(".be-parameterBox > span").each(function () {
                                var title = $(this).attr("title"); // 获取当前span元素中title属性的值
                                if(title){
                                    if (title.includes("高度")){
                                        scp_product['hight'] = title
                                    }else if (title.includes("宽度")){
                                        scp_product['wide'] = title
                                    }else if(title.includes("厚度")){
                                        scp_product['depth'] = title
                                    }else if(title.includes("包装规格")){
                                        scp_product['norms'] = title
                                    }else if(title.includes("制动系统")){
                                        scp_product['scp_system'] = title
                                    }
                                }

                            });
                            //获取产品类型，制动系统以及时间
                            var year =   $(this).find(".tdRight").find("p").eq(0).text().replace(/\s+/g, "");
                            scp_product['year'] = year


                            //判断是否已存在，不存在则入库，存在则访问次数+1
                            carInfo['scp_model'] = scp_product['scp_model']
                            var result =  await inspect_carinfo(carInfo, "http://119.29.203.233:81/search/carInfo_scp")
                            if(result.length === 0){
                                console.log("入库刹车片信息：")
                                console.log(scp_product)
                                inserdata(scp_product,"http://119.29.203.233:81/insert/cinfo_scp");
                                console.log('数据插入成功！')
                                console.log(carInfo);
                            }else {
                                add_check_num("http://119.29.203.233:81/insert/updataCarInfo_scp?cid=",result[0].cid,singleTableName);
                            }

                        }else if (singleTableName == '刹车片感应线') {
                            $(this).find(".productMainBox").each(function () {

                                gyx_product['brand'] = carInfo['brand']
                                gyx_product['models'] = carInfo['models']
                                gyx_product['displacement'] = carInfo['displacement']

                                var productExplain = $(this).find(".productExplain").text();
                                var gyx_model = $(this).find(".productName2").text();
                                gyx_product['gyx_model'] = gyx_model
                                SenseLine.push(gyx_model)
                                if (productExplain.includes("【前】")) {
                                    gyx_product['gyx_type'] = "前感应线"
                                } else if (productExplain.includes("【后】")) {
                                    gyx_product['gyx_type'] = "后感应线"
                                }else if(productExplain.includes("【前,后】")){
                                    gyx_product['gyx_type'] = "前后感应线"
                                }
                                //获取型号尺寸，包装规格
                                $(this).find(".be-parameterBox > span").each(function () {
                                    var title = $(this).attr("title"); // 获取当前span元素中title属性的值
                                    gyx_product['chcek_num'] = 1;
                                    console.log("----------------title")
                                    console.log(title)
                                    if(title){
                                        if (title.includes("长度")) {
                                            gyx_product['length'] = title
                                        } else if (title.includes("包装规格")) {
                                            gyx_product['norms'] = title
                                        }
                                    }

                                });
                            });
                            //获取产品类型，制动系统以及时间
                            var year = $(this).find(".tdRight").find("p").eq(0).text().replace(/\s+/g, "");
                            gyx_product['year'] = year


                            var content = $(this).find('.be-parameterBox span').html();
                            content = content.replace(/<[^>]*>/g, ''); // 过滤HTML标签
                            if (content.includes("包装")){
                                gyx_product['remarks'] = content.replace(/\s/g, '');
                            }
                            console.log("==========感应线")
                            console.log(gyx_product)


                            //判断是否已存在，不存在则入库，存在则访问次数+1
                            carInfo['gyx_model'] = gyx_product['gyx_model']
                            var result =  await inspect_carinfo(carInfo, "http://119.29.203.233:81/search/carInfo_gyx")
                            if(result.length === 0){
                                console.log(gyx_product)
                                inserdata(gyx_product,"http://119.29.203.233:81/insert/cinfo_gyx")
                                console.log('数据插入成功！')
                                console.log(carInfo);
                            }else {
                                add_check_num("http://119.29.203.233:81/insert/updataCarInfo_gyx?cid=",result[0].cid,singleTableName);
                            }
                        };

                    });
                });
                console.log(FrontBrake)
                console.log(RearBrake)
                callback(FrontBrake,RearBrake,SenseLine,carInfo);
            },800);

        });

    }

    //查询数据库是否存在这个车型
    function inspect_carinfo(data,url){
        // console.log(data)
        return new Promise(res=>{
            GM_xmlhttpRequest({
                method: "POST",
                url: url, //目标URL
                data: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function(response) {
                    //对接收到的数据进行处理
                    var json = response.responseText;
                    var JsonData = JSON.parse(json);
                    // console.log(JsonData.data.list)
                    res(JsonData.data.list)
                },
                onerror: function(response) {
                    console.error(response.statusText);
                }
            });
        })
    }

    //更新访问次数
    function add_check_num(url,data,type){
        GM_xmlhttpRequest({
            method: "GET",
            url: url+data, //目标URL
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    console.log('访问次数请求成功：' + type);
                } else {
                    console.error('访问次数请求失败：' +type+ response.statusText);
                }
            },
            onerror: function(response) {
                console.error(response.statusText);
            }
        });
    }


    //向数据库插入数据
    function inserdata(data,url){
        GM_xmlhttpRequest({
            method: "POST",
            url: url, //目标URL
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                //对接收到的数据进行处理
                console.log(response.statusText)
            },
            onerror: function(response) {
                console.error(response.statusText);
            }
        });
    }

    //请求数据库里的型号匹配信息
    function getServerData(){
        var all_models= {}   //所有型号信息
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://119.29.203.233:81/search/hst", //目标URL
            onload: function(response) {
                //对接收到的数据进行处理
                var data = JSON.parse(response.responseText);
                // 获取list
                var list = data.data.list;
                // 遍历list中的每个元素进行处理
                for (var i = 0; i < list.length; i++) {
                    all_models[list[i].hstType]=list[i].tnsType
                    // console.log(list[i].hstType);
                    // console.log(list[i].tnsType);
                    // console.log(all_models);
                }

            },
            onerror: function(response) {
                console.error(response.statusText);
                console.error("请求车型信息失败！！！");
            }
        });

        return all_models;
    }

    //在页面插入刹车片内容
    function insertdata(type,hstytpe,tnstype,result){
        var str = result.brand+result.models+result.displacement
        if(result.remark){
            var content = hstytpe+"=【"+type+"】"+str.replace(/\(.+?\)/g, '')+"#刹车片*1="+tnstype+"*1#"+result.remark
        }else {
            var content = hstytpe+"=【"+type+"】"+str.replace(/\(.+?\)/g, '')+"#刹车片*1="+tnstype+"*1#"
        }

        $(".productMainBox").find('.productName2').each(function(index, element) {
            if ($(this).text() == hstytpe){
                $(this).closest(".productName").append("<br><b class = 'content' style='color: green'>"+content+"</b>");
            }
        });
    }

    //插入感应线数据
    function insertdata_gyx(type,hstytpe,carinfo){
        var cont =$(document).find('.bd-consumption').text().replace(/[^0-9]/g, "");
        var content = "【"+type+"】"+carinfo.brand+carinfo.models+carinfo.displacement+"感应线"+hstytpe+"*"+cont
        $(".productMainBox").find('.productName2').each(function(index, element) {
            if ($(this).text() == hstytpe){
                $(this).closest(".productName").append("<br><b class = 'content' style='color: green'>"+content.replace(/\(.+?\)/g, '')+"</b>");
            }

        });
    }

    //校验用户
    function HttpGetData(method,url,data){
        var method = method;
        var url = url;
        var data = data;
        //console.log(data);
        return new Promise((resolve, reject) => {

            GM_xmlhttpRequest({
                method: method,
                url: url,
                data: data,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                onload: function(r) {
                    // code
                    var result =new Array();
                    result = JSON.parse(r.response)['data'];
                    // result = JSON.parse(r.response);
                    // console.log("result:");
                    // console.log(result);
                    resolve(result)
                }
            });
        })};


    async function getUserInfo() {
        var userInfo = await HttpGetData('GET','http://119.29.203.233:81/search/userInfo?userId='+macadd);
        // console.log("userInfo:");
        // console.log(userInfo)
        if (userInfo['list'].length){
            var remainder = userInfo['list'][0]['remainder']
            // console.log(remainder)
            if(remainder===0){
                status='-1'
            }else {
                status='1'
                // console.log(status)
                // console.log("状态是为1的")
            }
        }else{
            status='0'
        }
    }
    getUserInfo()

    //程序开始
    function start(){
        //取服务器前刹后刹信息
        var type_data = getServerData()
        // console.log(type_data)
        //取页面前刹后刹信息与服务器前后刹信息匹配;
         function mate(FrontBrake,RearBrake ,SenseLine,carinfo){
            //直接在页面插入模版提示

            var content = carinfo.brand+carinfo.models +carinfo.displacement
            var str = '<b style="color: blue ">如果前后刹都买用该模版：【前刹】【后刹】'+ content.replace(/\(.*?\)/g, "")+'#刹车片*2=型号1*1,型号2*1#</b>'
            $('.singleTableBox').find('.singleTableName').append(str);

            $.each(FrontBrake, async function(index, value){
                var hst_obj = {
                    hstType :value,
                    tnsType :value,
                    product_type:'前刹车片'
                }
                carinfo['scp_model'] = hst_obj.hstType
                //查询是否有该型号，有就加上备注
                console.log("----------------")
                console.log(carinfo)
                var result =  await inspect_carinfo(carinfo, "http://119.29.203.233:81/search/carInfo_scp")
                setTimeout(function(){
                if (value in type_data){
                    //处理页面，在页面插入匹配结果
                    if(type_data[value] != ''){
                        console.log("++++++++++++++++++++++++++++++++++++++++++++++++")
                        console.log(result[0])
                        if(result[0]){
                            insertdata("前刹", value, type_data[value], result[0])
                        }else {
                            insertdata("前刹", value, type_data[value], carinfo)
                        }
                    }

                }else{
                    inserdata(hst_obj,"http://119.29.203.233:81/insert/hst_tns")
                }
                },500)

            });
            $.each(RearBrake, async function(index, value){
                var hst_obj = {
                    hstType :value,
                    tnsType :value,
                    product_type:'后刹车片'
                }
                console.log(hst_obj)
                var result =  await inspect_carinfo(carinfo, "http://119.29.203.233:81/search/carInfo_scp")
                setTimeout(function() {
                    if (value in type_data) {
                        //处理页面，在页面插入匹配结果
                        if (type_data[value] != '') {
                            if(result[0]){
                                insertdata("后刹", value, type_data[value], result[0])
                            }else {
                                insertdata("后刹", value, type_data[value], carinfo)
                            }

                        }
                    } else {
                        inserdata(hst_obj, "http://119.29.203.233:81/insert/hst_tns")
                    }
                },500)
            });
            $.each(SenseLine, function (index,value){
                if(value!= ''){
                    insertdata_gyx("感应线",value,carinfo)
                }

            });
        }
        getCarInfo(mate);
    }

    function deal(){
        if(status=='1'){
            console.log(macadd)
            HttpGetData('GET','http://119.29.203.233:81/insert/update_userid_info?userId='+macadd);
            start()
        }else if(status=='-1'){
            alert("匹配功能已失效，请联系管理员！！！")
        }else if(status=='0'){
            alert("mac地址已无效,请联系管理员！！！")
        }
    }
    getUserInfo().then(deal)

})();



