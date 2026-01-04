// ==UserScript==
// @name         火炬火花塞匹配#
// @namespace    http://tampermonkey.net/
// @version      0.7.0
// @description  火炬车型匹配
// @author       You
// @match        https://market.dat881.com/intell/dir19/xhjApp
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/467708/%E7%81%AB%E7%82%AC%E7%81%AB%E8%8A%B1%E5%A1%9E%E5%8C%B9%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/467708/%E7%81%AB%E7%82%AC%E7%81%AB%E8%8A%B1%E5%A1%9E%E5%8C%B9%E9%85%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //产品型号匹配数组

    var tns_types
    var macadd = '20230822';
    var status;
    //获取车型信息
    function getCarInfo(){
        let tdArr = [];
        let types = [];
        let CarInfo = {
            brand :'',              //品牌
            manufacturer :'',       //厂商
            models : '',             //车型
            displacement:'',       //排量
            year:'',               //年款
            engineModel:'',        //发动机型号
            dosage:'',             //参考用量
            types:'',               //火花塞型号
            chcek_num: 1,            //访问次数
            remark: ''             //备注
        };
        $("table tbody tr").each(function() {
            var currentRow = $(this);
            var columnA = currentRow.find("td:first-child").text().trim(); // 获取当前行的第一个单元格的文本内容

            if (columnA === "品牌") {
                CarInfo.brand = currentRow.find("td:last-child").text().trim(); // 将当前行的最后一个单元格的文本内容设置为品牌对应的值

            }else if(columnA === "厂商"){
                CarInfo.manufacturer = currentRow.find("td:last-child").text().trim(); // 将当前行的最后一个单元格的文本内容设置为品牌对应的值

            }else if(columnA === "车型"){
                CarInfo.models = currentRow.find("td:last-child").text().trim(); // 将当前行的最后一个单元格的文本内容设置为品牌对应的值

            }else if(columnA === "排量"){
                CarInfo.displacement = currentRow.find("td:last-child").text().replace(/\s+/g, " ").trim(); // 将当前行的最后一个单元格的文本内容设置为品牌对应的值

            }else if(columnA === "年份"){
                CarInfo.year = currentRow.find("td:last-child").text().trim(); // 将当前行的最后一个单元格的文本内容设置为品牌对应的值

            }else if(columnA === "发动机"){
                CarInfo.engineModel = currentRow.find("td:last-child").text().trim(); // 将当前行的最后一个单元格的文本内容设置为品牌对应的值

            }
        });

        CarInfo.dosage = $(".proTitle").find(" h5 span").text()
        CarInfo.types = get_hj_type()
        console.log(CarInfo)
        return CarInfo
    }


    function HttpGetData(method,url,data){
        var method = method;
        var url = url;
        var data = data;
        //console.log(data);
        function GetMess(){
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
                        //result = JSON.parse(r.response);
                        //console.log(result);
                        resolve(result)
                    }
                });
            })};


        async function GetPromiseAndWait(){
            let text=await GetMess();
            return text;
        }

        async function WantGetFinallyText(){
            let info = await GetPromiseAndWait()
            return info
        }

        var result_data = WantGetFinallyText();
        return result_data
    }

    async function getUserInfo() {
        var userInfo = await HttpGetData('GET','http://119.29.203.233:81/search/userInfo?userId='+macadd);
        if (userInfo['list'].length){
            var remainder = userInfo['list'][0]['remainder']
            console.log(remainder)
            if(remainder=='0'){
                status='-1'
            }else {
                status='1'
            }
        }else{
            status='0'
        }
    }
    getUserInfo()
    //获取火炬使用的火花塞型号
    function get_hj_type(){
        let types = []
        $(document).find(".proImgAndMsg").each(function(index, element){
            var type =  $(this).find(".productNo").text().trim();
            types.push(type)
        });
        return types.toString();
    }
    //查询数据库是否存在这个车型
    function inspect_carinfo(data,url){
        // console.log("-------------------------------data")
        // console.dir(data)
        // console.log("-------------------------------data")
        // console.dir(JSON.stringify(data))
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
                    console.log("查询火炬型号接口：")
                    console.log(JsonData)
                    res(JsonData.data.list)
                },
                onerror: function(response) {
                    console.error(response.statusText);
                }
            });
        })
    }

    //更新访问次数
    function add_check_num(url,data){
        GM_xmlhttpRequest({
            method: "GET",
            url: url+data, //目标URL
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    console.log('访问次数请求成功：' );
                } else {
                    console.error('访问次数请求失败：' + response.statusText);
                }
            },
            onerror: function(response) {
                console.error(response.statusText);
            }
        });
    }
//向数据库插入数据
    function inserdata(data,url){
        console.log(JSON.stringify(data))
        GM_xmlhttpRequest({
            method: "POST",
            url: url, //目标URL
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                //对接收到的数据进行处理
                console.log("打印插入状态：")
                console.log(response.statusText)
            },
            onerror: function(response) {
                console.error(response.statusText);
            }
        });
    }


    //页面显示数据
    function showData(data){

        var CarInfo = getCarInfo()

        // console.log(data)
        for(var i=0 ;i<tns_types.length;i++){
             if(data == tns_types[i].hj_type &&tns_types[i].tns_type != ''){
                 let regex = /\d+/g; // 匹配字符串中的数字
                 let num = CarInfo.dosage.match(regex)[0];
                 if(num=='4'){
                     // console.log(tns_types[i])

                     if(tns_types[i].ru_type){
                         var str  = data+"="+CarInfo.brand+" "+CarInfo.models+" "+CarInfo.displacement +"#火花塞*1="+tns_types[i].tns_type+"*"+num+"#"+tns_types[i].tt+tns_types[i].markes+"<br>"+
                             "<font color='blue'>【钌合金】"+CarInfo.brand+" "+CarInfo.models+" "+CarInfo.displacement +"#火花塞*1="+tns_types[i].ru_type+"*"+num+"#"+tns_types[i].tt+tns_types[i].ru_markes;
                     }else{
                         var str  = data+"="+CarInfo.brand+" "+CarInfo.models+" "+CarInfo.displacement +"#火花塞*1="+tns_types[i].tns_type+"*"+num+"#"+tns_types[i].tt+tns_types[i].markes+"<br>"+
                             "<font color='red'>暂无钌合金型号，请联系杨洋！";

                     }
                 }else{
                     if(tns_types[i].ru_type){
                         var str  = data+"=【"+num+"缸】"+CarInfo.brand+" "+CarInfo.models+" "+CarInfo.displacement +"#火花塞*1="+tns_types[i].tns_type+"*"+num+"#"+tns_types[i].tt+tns_types[i].markes+"<br>"+
                             "<font color='blue'>【钌合金】【"+num+"缸】"+CarInfo.brand+" "+CarInfo.models+" "+CarInfo.displacement +"#火花塞*1="+tns_types[i].ru_type+"*"+num+"#"+tns_types[i].tt+tns_types[i].ru_markes
                     }else{
                         var str  = data+"=【"+num+"缸】"+CarInfo.brand+" "+CarInfo.models+" "+CarInfo.displacement +"#火花塞*1="+tns_types[i].tns_type+"*"+num+"#"+tns_types[i].tt+tns_types[i].markes+"<br>"+
                             "<font color='red'>暂无钌合金型号，请联系杨洋！"
                     }

                 }
                 $(".table-bordered").each(function() {
                     $(this).append("<tr><td style='color: green'>匹配情况</td><td style='color: green'>"+ str + "</td></tr>");
                 });
             }else if(data == tns_types[i].hj_type &&tns_types[i].tns_type == ''){
                 // console.log(tns_types[i])
                 if(tns_types[i].markes){
                     $(".table-bordered").append("<tr><td style='color: blue'>匹配情况</td><td style='color: blue'> "+tns_types[i].markes+"</td></tr>");
                 }else{
                     setTimeout(function(){
                         $(".table-bordered").append("<tr><td style='color: blue'>匹配情况</td><td style='color: blue'> 数据库有该型号，联系杨洋完善型号匹配！</td></tr>");
                     },1000);
                 }


             }
        }
    }


    //开始执行
    let target = $('#LevelIndex')[0];
    let observer = new MutationObserver( function(mutations) {
        mutations.forEach(async function(mutation) {
            if (mutation.attributeName === "style") {
                let styleName = mutation.target.style.display;
                // 判断 display 样式属性是否更改为 display: none;
                if (styleName === "none") {
                    console.log("display 样式改变为 none");
                    HttpGetData('GET','http://119.29.203.233:81/insert/update_userid_info?userId='+macadd);
                    if(status=='1'){
                        var CarInfo =  getCarInfo()
                        var all_type = []
                        var carinfo_type_arr = CarInfo.types.split(",")
                        // 录入车型数据
                        // console.log("----------------carinfo:")
                        // console.dir(CarInfo)

                        var result =  await inspect_carinfo(CarInfo,'http://119.29.203.233:81/search/carInfo_hj')
                        // console.log("----------------result:")
                        // console.dir(result)
                        if(result.length === 0){
                            inserdata(CarInfo,"http://119.29.203.233:81/insert/cinfo_hj");
                            console.log(CarInfo)
                            console.log('数据插入成功！')
                        }else {
                            add_check_num("http://119.29.203.233:81/insert/updataCarInfo_hj?cid=",result[0].cid);
                        }

                        // 匹配车型
                        tns_types = await inspect_carinfo({},'http://119.29.203.233:81/search/hj_tns')
                        for(var i=0 ;i<tns_types.length;i++){
                            all_type.push(tns_types[i].hj_type)
                        }

                        for (var n =0 ; n<carinfo_type_arr.length;n++){
                            if($.inArray(carinfo_type_arr[n], all_type) !== -1){
                                console.log("在里面")
                                showData(carinfo_type_arr[n])
                            }else {
                                if(carinfo_type_arr[n]){
                                    var t ={
                                        hj_type : carinfo_type_arr[n]
                                    }
                                    inserdata(t,"http://119.29.203.233:81/insert/hj_tns")

                                }else if(carinfo_type_arr[n] == '' && Object.keys(result).length !== 0){
                                    //走发动机匹配逻辑
                                    console.log("火炬没有数据")
                                    var car_all_info = result[0]

                                    if(car_all_info.first_tns_type !='' && car_all_info.second_tns_type == ''){
                                        console.log("first_tns_type不为空，second_tns_type为空")
                                        let regex = /\d+/g; // 匹配字符串中的数字
                                        console.log(car_all_info)
                                        if(car_all_info.dosage){
                                            let num = car_all_info.dosage.match(regex)[0];
                                            if(num=='4'){
                                                if(car_all_info.ru_first_tns_type){
                                                    var str  = car_all_info.brand+" "+car_all_info.models+" "+car_all_info.displacement +"#火花塞*1="+car_all_info.first_tns_type+"*"+num+"#"+car_all_info.tt+car_all_info.remark+"<br>"+
                                                        "<font color='blue'>【钌合金】"+car_all_info.brand+" "+car_all_info.models+" "+car_all_info.displacement +"#火花塞*1="+car_all_info.ru_first_tns_type+"*"+num+"#"+car_all_info.tt+car_all_info.ru_remark;
                                                }else{
                                                    var str  = car_all_info.brand+" "+car_all_info.models+" "+car_all_info.displacement +"#火花塞*1="+car_all_info.first_tns_type+"*"+num+"#"+car_all_info.tt+car_all_info.remark
                                                }

                                                $(".table-bordered").append("<tr><td style='color: green'>匹配首选</td><td style='color: green'>"+str+"</td></tr>");
                                            }else{
                                                if(car_all_info.ru_first_tns_type){
                                                    var str  = "【"+num+"缸】"+car_all_info.brand+" "+car_all_info.models+" "+car_all_info.displacement +"#火花塞*1="+car_all_info.first_tns_type+"*"+num+"#"+car_all_info.tt+car_all_info.remark+"<br>"+
                                                        "<font color='blue'>【钌合金】【"+num+"缸】"+car_all_info.brand+" "+car_all_info.models+" "+car_all_info.displacement +"#火花塞*1="+car_all_info.ru_first_tns_type+"*"+num+"#"+car_all_info.tt+car_all_info.ru_remark;

                                                }else {
                                                    var str  = "【"+num+"缸】"+car_all_info.brand+" "+car_all_info.models+" "+car_all_info.displacement +"#火花塞*1="+car_all_info.first_tns_type+"*"+num+"#"+car_all_info.tt+car_all_info.remark


                                                }

                                                $(".table-bordered").append("<tr><td style='color: green'>匹配首选</td><td style='color: green'>"+str+"</td></tr>");
                                            }
                                        }else {
                                            if(car_all_info.remark){
                                                $(".table-bordered").append("<tr><td style='color: red'>匹配情况</td><td style='color: red'>"+car_all_info.remark+"</td></tr>");
                                            }else{
                                                $(".table-bordered").append("<tr><td style='color: red'>匹配情况</td><td style='color: red'>这个车不知道多少缸，请联系杨洋核实！</td></tr>");
                                            }
                                        }



                                    } else if(car_all_info.first_tns_type && car_all_info.second_tns_type){
                                        console.log("first_tns_type不为空，second_tns_type不为空")
                                        let regex = /\d+/g; // 匹配字符串中的数字
                                        if(car_all_info.dosage){
                                            let num = car_all_info.dosage.match(regex)[0];
                                            if(num=='4'){
                                                if(car_all_info.ru_first_tns_type){
                                                    var str  = car_all_info.brand+" "+car_all_info.models+" "+car_all_info.displacement +"#火花塞*1="+car_all_info.first_tns_type+"*"+num+"#"+car_all_info.tt+car_all_info.remark+"<br>"+
                                                        "<font color='blue'>【钌合金】"+car_all_info.brand+" "+car_all_info.models+" "+car_all_info.displacement +"#火花塞*1="+car_all_info.ru_first_tns_type+"*"+num+"#"+car_all_info.tt+car_all_info.ru_remark;
                                                    var str2  = car_all_info.brand+" "+car_all_info.models+" "+car_all_info.displacement +"#火花塞*1="+car_all_info.second_tns_type+"*"+num+"#"+car_all_info.tt+car_all_info.remark+"<br>"+
                                                        "<font color='blue'>【钌合金】"+car_all_info.brand+" "+car_all_info.models+" "+car_all_info.displacement +"#火花塞*1="+car_all_info.ru_second_tns_type+"*"+num+"#"+car_all_info.tt+car_all_info.ru_remark;
                                                }else{
                                                    var str  = car_all_info.brand+" "+car_all_info.models+" "+car_all_info.displacement +"#火花塞*1="+car_all_info.first_tns_type+"*"+num+"#"+car_all_info.tt+car_all_info.remark;
                                                    var str2  = car_all_info.brand+" "+car_all_info.models+" "+car_all_info.displacement +"#火花塞*1="+car_all_info.second_tns_type+"*"+num+"#"+car_all_info.tt+car_all_info.remark;
                                                }

                                                $(".table-bordered").append("<tr><td style='color: green'>匹配首选</td><td style='color: green'>"+str+"</td></tr>");
                                                $(".table-bordered").append("<tr><td style='color: green'>匹配备选</td><td style='color: green'>"+str2+"</td></tr>");
                                            }else{
                                                if(car_all_info.ru_first_tns_type){
                                                    var str  = "【"+num+"缸】"+car_all_info.brand+" "+car_all_info.models+" "+car_all_info.displacement +"#火花塞*1="+car_all_info.first_tns_type+"*"+num+"#"+car_all_info.tt+car_all_info.remark+"<br>"+
                                                        "<font color='blue'>【钌合金】【"+num+"缸】"+car_all_info.brand+" "+car_all_info.models+" "+car_all_info.displacement +"#火花塞*1="+car_all_info.ru_first_tns_type+"*"+num+"#"+car_all_info.tt+car_all_info.ru_remark;
                                                    var str2  = "【"+num+"缸】"+car_all_info.brand+" "+car_all_info.models+" "+car_all_info.displacement +"#火花塞*1="+car_all_info.second_tns_type+"*"+num+"#"+car_all_info.tt+car_all_info.remark+"<br>"+
                                                        "<font color='blue'>【钌合金】【"+num+"缸】"+car_all_info.brand+" "+car_all_info.models+" "+car_all_info.displacement +"#火花塞*1="+car_all_info.ru_second_tns_type+"*"+num+"#"+car_all_info.tt+car_all_info.ru_remark;
                                                }else{
                                                    var str  = "【"+num+"缸】"+car_all_info.brand+" "+car_all_info.models+" "+car_all_info.displacement +"#火花塞*1="+car_all_info.first_tns_type+"*"+num+"#"+car_all_info.tt+car_all_info.remark
                                                    var str2  = "【"+num+"缸】"+car_all_info.brand+" "+car_all_info.models+" "+car_all_info.displacement +"#火花塞*1="+car_all_info.second_tns_type+"*"+num+"#"+car_all_info.tt+car_all_info.remark
                                                }


                                                $(".table-bordered").append("<tr><td style='color: green'>匹配首选</td><td style='color: green'>"+str+"</td></tr>");
                                                $(".table-bordered").append("<tr><td style='color: green'>匹配备选</td><td style='color: green'>"+str2+"</td></tr>");
                                            }
                                        }else{
                                            if(car_all_info.remark){
                                                $(".table-bordered").append("<tr><td style='color: red'>匹配情况</td><td style='color: red'>"+car_all_info.remark+"</td></tr>");
                                            }else{
                                                $(".table-bordered").append("<tr><td style='color: red'>匹配情况</td><td style='color: red'>这个车不知道多少缸，请联系杨洋核实！</td></tr>");
                                            }
                                        }

                                    }else if(car_all_info.first_tns_type =='' && car_all_info.second_tns_type == ''){
                                        console.log("first_tns_type为空，second_tns_type为空")
                                        setTimeout(function(){
                                            if(car_all_info.dosage){
                                                $(".table-bordered").append("<tr><td style='color: blue'>匹配情况</td><td style='color: blue'> 数据库有该型号，联系杨洋完善型号匹配！</td></tr>");
                                            }else{
                                                if(car_all_info.remark){
                                                    $(".table-bordered").append("<tr><td style='color: red'>匹配情况</td><td style='color: red'>"+car_all_info.remark+"</td></tr>");
                                                }else {
                                                    $(".table-bordered").append("<tr><td style='color: red'>匹配情况</td><td style='color: red'>这个车不知道多少缸，请联系杨洋核实！</td></tr>");
                                                }
                                            }
                                        },1000);
                                    }

                                }else{
                                    setTimeout(function(){
                                        $(".table-bordered").append("<tr><td style='color: red'>匹配情况</td><td style='color: red'>匹配不到，请截图联系杨洋！</td></tr>");
                                    },1000);

                                }

                            }

                        }
                    }else if(status=='-1'){
                        alert("匹配功能已失效，请联系管理员！！！")
                    }else if(status=='0'){
                        alert("mac地址已无效,请联系管理员！！！")
                    }
                } else {
                    console.log("display 样式改变为 block 或其他");
                    // 执行相应的操作
                }
            }
        });
    });



    // 开始监听 DOM 变化
    observer.observe(target, { attributes: true });






    // Your code here...
})();