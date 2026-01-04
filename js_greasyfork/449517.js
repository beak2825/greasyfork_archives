    // ==UserScript==

    // @name         NGK火花塞匹配#
    // @namespace    http://tampermonkey.net/
    // @version      0.15.1
    // @description  NGK火花塞匹配功能
    // @author       You
    // @match        https://market.dat881.com/intell/ngk/ngkApp
    // @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
    // @grant        GM_xmlhttpRequest
    // @connect      *
    // @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/449517/NGK%E7%81%AB%E8%8A%B1%E5%A1%9E%E5%8C%B9%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/449517/NGK%E7%81%AB%E8%8A%B1%E5%A1%9E%E5%8C%B9%E9%85%8D.meta.js
    // ==/UserScript==


    (function() {
        'use strict';
        //用户配置，请输入电脑的mac地址和手机号，配置成功后即可使用
        var macadd = '20230821';
        var count;
        var content_dhxq = new Array();
        var content =new Array();
        var ngk_arr =new Array();

        var ngk_arr_dhxq =new Array();

        var tr,tr2,td1,td2,td3,td4,r;
        var userInfo =new Array();
        var engineModel_data = new Array();
        var status;

        //获取数据表内ngk信息
        //console.log(GM_info);
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
        //获取ngk全部信息
        async function getNgkArr() {
            var ngk_data = await HttpGetData('GET','http://119.29.203.233:81/search/ngk');
            var ngk_data_dhxq = await HttpGetData('GET','http://119.29.203.233:81/search/ngk_dhxq');
            ngk_data = ngk_data['list']
           ngk_data_dhxq = ngk_data_dhxq['list']
            for(var i =0 ;i<ngk_data.length;i++){
                ngk_arr.push([ngk_data[i]['ngkType'],ngk_data[i]['tnsCode'],ngk_data[i]['tt'],ngk_data[i]['markes'],ngk_data[i]['ruCode'],ngk_data[i]['ru_markes']]);
            }
            for(var i =0 ;i<ngk_data_dhxq.length;i++){
                ngk_arr_dhxq.push([ngk_data_dhxq[i]['ngkType'],ngk_data_dhxq[i]['tnsCode'],ngk_data_dhxq[i]['markes']]);
            }
            console.log(ngk_arr.length);
            console.log(ngk_arr_dhxq.length);
        }

        //获取ngk引擎数据
        async function getNgkEngine(data) {
            console.log('http://119.29.203.233:81/search/ngk_engine?'+data)
            engineModel_data = [];
            var ngk_engine = await HttpGetData('GET','http://119.29.203.233:81/search/ngk_engine?'+data);
            ngk_engine = ngk_engine['list']
            if(ngk_engine.length){
                var ngk_engineModel = ngk_engine[0]['ngk_engineModel']
                var tns_code_first = ngk_engine[0]['tns_code_first']
                var tns_code_second = ngk_engine[0]['tns_code_second']
                var tt = ngk_engine[0]['tt']
                var remarks = ngk_engine[0]['remarks']
                var ru_code_first = ngk_engine[0]['ru_code_first']
                var ru_code_second = ngk_engine[0]['ru_code_second']
                var ru_remarks = ngk_engine[0]['ru_remarks']
                engineModel_data.push(ngk_engineModel,tns_code_first,tns_code_second,tt,remarks,ru_code_first,ru_code_second,ru_remarks)
            }
            //console.log(ngk_engine,ngk_engineModel,tns_code_first,tns_code_second,tt,remarks)

            return engineModel_data
        }
        //获取数据库火花塞汽车信息
        async function getCarInfo(brand,models,displacement,year,engineModel) {
            var carInfo =[]
            var carData = "brand="+brand+"&models="+models+"&displacement="+displacement+"&year="+year+"&engineModel="+engineModel
            var get_carInfo = await HttpGetData('GET','http://119.29.203.233:81/search/carInfo?'+carData);
            return get_carInfo['list']
        }

        //获取数据库点火线圈汽车信息
        async function getCarInfoDhxq(brand,models,displacement,year,engineModel) {
            var carInfo =[]
            var carData = "brand="+brand+"&models="+models+"&displacement="+displacement+"&year="+year+"&engineModel="+engineModel
            var get_carInfo = await HttpGetData('GET','http://119.29.203.233:81/search/carInfo_dhxq?'+carData);
            return get_carInfo['list']
        }


        //进入网页，获取NGK信息，然后处理ngk_arr数据结构
        getNgkArr();


        // 封装xpath
        function getElebyXpath(xpath){
            var ele = document.evaluate(xpath,document).iterateNext();
            return ele;
        }

        //取节点
        function getXpath(){
            //节点位置
            var xres;
            var path = '//tr[@class="result_table_tr" and @protype="hhs"]/td[2]/b/text()';
            var result = document.evaluate(path,document,null,XPathResult.ANY_TYPE,null);
            //console.log(result);
            //console.log(result.iterateNext());
            var xnodes = new Array();
            while(xres = result.iterateNext()){
                xnodes.push(xres.textContent);
            }
            if(xnodes){
                return xnodes;
            }else{
                xnodes ="";
                return xnodes;
            }

            }
        //取点火线圈节点
        function getXpath_dhxq() {
            //节点位置
            var xres;
            //var path = '//div[protype="hhs"]/td[2]/b/text()';
            var path = '//tr[@class="result_table_tr" and @protype="dhxq"]/td[2]/b/text()';
            var result = document.evaluate(path, document, null, XPathResult.ANY_TYPE, null);
            //console.log(result.iterateNext());
            var xnodes = new Array();
            while (xres = result.iterateNext()) {
                xnodes.push(xres.textContent);
            }
            //console.log(xnodes);
            if (xnodes) {
                return xnodes;
            } else {
                xnodes = "";
                return xnodes;
            }
        }
        //获取气缸数
        function getCountXpath(){
            //节点位置
            var count;
            var path = '//*[@id="NGKVehicleInfoArea"]/div/table/tbody/tr[6]/td[2]/text()';
            var result = document.evaluate(path,document,null,XPathResult.ANY_TYPE,null).iterateNext();
            count = result.textContent;
            return count;
        }
        //获取ngk发动机数据
        function getEngineModelXpath(){
            //节点位置
            var engineModel;
            var path = '//*[@id="NGKVehicleInfoArea"]/div/table/tbody/tr[5]/td[2]/text()';
            var result = document.evaluate(path,document,null,XPathResult.ANY_TYPE,null).iterateNext();
            engineModel = result.textContent;
            return engineModel;
        }
        //获取车辆信息
        function getCarInfoXpath(){
            var CarInfo = new Array();
            for(var c=1;c<5;c++){
                var path = '//*[@id="NGKVehicleInfoArea"]/div/table/tbody/tr['+c+']/td[2]/text()';
                var result = document.evaluate(path,document,null,XPathResult.ANY_TYPE,null).iterateNext();
                CarInfo.push(result.textContent);
            }
            return CarInfo;

        }
        //移除数组某个元素
        function removeByValue(arr, val) {
            for(var i = 0; i < arr.length; i++) {
                if(arr[i] == val) {
                    arr.splice(i, 1);
                    break;
                }
            }
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
        //匹配显示火花塞
        async function mate_tns(content, data) {
            var new_content = new Array();
            new_content = content.concat();
            //获取气缸数
            count = getCountXpath();
            //获取引擎
            var engineModel = getEngineModelXpath();
            //获取品牌，型号，年款，排量
            var CarInfo = getCarInfoXpath();
            var brand = CarInfo[0];
            var models = CarInfo[1];
            var displacement = CarInfo[2];
            var year = CarInfo[3];

            //库里存在访问+1，库里不存在插入数据
            let carInfo = await getCarInfo(brand, models, displacement, year, engineModel)
            HttpGetData('GET','http://119.29.203.233:81/insert/update_userid_info?userId='+macadd);
            carInfo= carInfo[0]
            if(carInfo){
                var cid = carInfo["cid"];
                HttpGetData('GET','http://119.29.203.233:81/insert/updataCarInfo?cid='+cid);
                console.log("访问次数增加！！！")
            }else{

                let data = "brand="+brand+"&models="+models+"&displacement="+displacement+"&year="+year+"&engineModel="+engineModel+"&engineModelNum="+count+"&ngk_types={\"type\":\""+content+"\"}&chcek_num=1&remake="
                HttpGetData('GET','http://119.29.203.233:81/insert/cinfo?'+data);
                console.log('http://119.29.203.233:81/insert/cinfo?'+data)
                console.log("新增车型！！！")
            }

            //按发动机型号进行匹配
            if (content.length) {
                //console.log(r);
                var path = '//*[@id="NGKVehicleInfoArea"]/div/table/tbody';
                r = document.evaluate(path, document).iterateNext();
                for (var len = 0; len < content.length; len++) {
                    tr = document.createElement("tr");
                    td1 = document.createElement("td");
                    td2 = document.createElement("td");
                    for (var a = 0; a < data.length; a++) {
                        if (content[len] == data[a][0]) {
                            console.log(content[len] + "=" + data[a][0] + "===" + data[a][1]+"===="+data[a][4]);
                            td1.innerHTML = "匹配情况";
                            //显示火花塞型号
                            if (count != "0" &&count != '4') {
                                if(data[a][4]){
                                    td2.innerHTML = data[a][0]+"="+"【" + count + "缸】" + CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + data[a][1] + "*" + count + "#" + data[a][2] + data[a][3]+"</br>"+
                                        "<font color='blue'>【钌合金】【" + count + "缸】" + CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + data[a][4] + "*" + count + "#" + data[a][2] + data[a][5];
                                }else{
                                    td2.innerHTML = data[a][0]+"="+"【" + count + "缸】" + CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + data[a][1] + "*" + count + "#" + data[a][2] + data[a][3]+"</br>"+
                                        "<font color='red'>暂无钌合金型号火花塞，请联系杨洋！"
                                }
                            }
                            else if (count = 4 ) {
                                if(data[a][4]){
                                    td2.innerHTML = data[a][0]+"="+CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + data[a][1] + "*" + count + "#" + data[a][2] + data[a][3]+"</br>"+
                                        "<font color='blue'>【钌合金】" + CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + data[a][4] + "*" + count + "#" + data[a][2] + data[a][5];
                                }else{
                                    td2.innerHTML = data[a][0]+"="+data[a][0] + "="+ CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + data[a][1] + "*" + count + "#" + data[a][2] + data[a][3]+"</br>"+
                                        "<font color='red'>暂无钌合金型号火花塞，请联系杨洋！";
                                }
                            }
                            td2.style.color = 'green';
                            r.appendChild(tr);
                            tr.appendChild(td1);
                            tr.appendChild(td2);
                            removeByValue(new_content, content[len]);
                        }
                    }
                }
                if (new_content) {
                    for (var j = 0; j < new_content.length; j++) {
                        tr = document.createElement("tr");
                        td1 = document.createElement("td");
                        td2 = document.createElement("td");
                        td1.innerHTML = "特耐士型号"
                        td2.innerHTML = new_content[j] + "=匹配不到型号!";
                        td2.style.color = 'red';
                        r.appendChild(tr);
                        tr.appendChild(td1);
                        tr.appendChild(td2);
                        HttpGetData('GET', 'http://119.29.203.233:81/insert/ngk_type_unknown?ngk_type='+new_content[j]+'&remake="请匹配对应特耐士型号，并添加到对应ngk_tns表中！"' );
                    }
                }
            } else {
                var ngk_engineModel = getEngineModelXpath()
                var CarInfo = getCarInfoXpath();
                //获取品牌，型号，年款，排量
                var brand = CarInfo[0];
                var models = CarInfo[1];
                var displacement = CarInfo[2];
                var year = CarInfo[3];
                // console.log(ngk_engineModel,brand,models,displacement,year)

                async function getNgkEngine_isTure(brand,models,displacement,year) {
                    // console.log(brand,models,displacement,year)
                    var t = await getNgkEngine('ngk_engineModel=' + ngk_engineModel+'&brand='+ brand + '&model='+ models +'&displacement='+ displacement +'&year='+ year)
                    // console.log(t+"我是t")
                    if (t.length) {
                        count = getCountXpath();
                        var CarInfo = getCarInfoXpath();
                        //获取品牌，型号，年款，排量
                        var brand = CarInfo[0];
                        var models = CarInfo[1];
                        var displacement = CarInfo[2];
                        var year = CarInfo[3];
                        var path = '//*[@id="NGKVehicleInfoArea"]/div/table/tbody';
                        r = document.evaluate(path, document).iterateNext();
                        tr = document.createElement("tr");
                        tr2 = document.createElement("tr");
                        td1 = document.createElement("td");
                        td2 = document.createElement("td");
                        td3 = document.createElement("td");
                        td4 = document.createElement("td");
                        // console.log(engineModel_data+"我是engineModel_data")
                        if (engineModel_data[1] && engineModel_data[2] && count != 4) {
                            td2.innerHTML = "【" + count + "缸】" + CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + engineModel_data[1] + "*" + count + "#" + engineModel_data[3] + engineModel_data[4]+"</br>"+
                                "<font color='blue'>【钌合金】【" + count + "缸】" + CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + engineModel_data[5] + "*" + count + "#" + engineModel_data[3] + engineModel_data[7];
                            td4.innerHTML = "【" + count + "缸】" + CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + engineModel_data[2] + "*" + count + "#" + engineModel_data[3] + engineModel_data[4]+"</br>"+
                                "<font color='blue'>【钌合金】【" + count + "缸】" + CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + engineModel_data[6] + "*" + count + "#" + engineModel_data[3] + engineModel_data[7];
                            ;
                            td1.innerHTML = "首选型号";
                            td1.style.color = 'green';
                            td3.innerHTML = "备选型号";
                            td4.style.color = 'green';
                            td2.style.color = 'green';
                            r.appendChild(tr);
                            r.appendChild(tr2);
                            tr.appendChild(td1);
                            tr.appendChild(td2);
                            tr2.appendChild(td3);
                            tr2.appendChild(td4);
                        } else if (engineModel_data[1] && engineModel_data[2] && count == 4) {
                            td2.innerHTML = CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + engineModel_data[1] + "*" + count + "#" + engineModel_data[3] + engineModel_data[4]+"</br>"+
                                "<font color='blue'>【钌合金】"+ CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + engineModel_data[5] + "*" + count + "#" + engineModel_data[3] + engineModel_data[7];
                            td4.innerHTML = CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + engineModel_data[2] + "*" + count + "#" + engineModel_data[3] + engineModel_data[4]+"</br>"+
                                "<font color='blue'>【钌合金】" + CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + engineModel_data[6] + "*" + count + "#" + engineModel_data[3] + engineModel_data[7];
                            ;
                            td1.innerHTML = "首选型号";
                            td1.style.color = 'green';
                            td3.innerHTML = "备选型号";
                            td4.style.color = 'green';
                            td2.style.color = 'green';
                            r.appendChild(tr);
                            r.appendChild(tr2);
                            tr.appendChild(td1);
                            tr.appendChild(td2);
                            tr2.appendChild(td3);
                            tr2.appendChild(td4);
                        } else if (engineModel_data[1] && count != 4) {
                            td2.innerHTML = "【" + count + "缸】" + CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + engineModel_data[1] + "*" + count + "#" + engineModel_data[3] + engineModel_data[4]+"</br>"+
                                "<font color='blue'>【钌合金】【" + count + "缸】" + CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + engineModel_data[5] + "*" + count + "#" + engineModel_data[3] + engineModel_data[7];
                            td2.style.color = 'green';
                            td1.innerHTML = "首选型号";
                            td1.style.color = 'green';
                            r.appendChild(tr);
                            tr.appendChild(td1);
                            tr.appendChild(td2);

                        } else if (engineModel_data[1] && count == 4) {
                            td2.innerHTML = CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + engineModel_data[1] + "*" + count + "#" + engineModel_data[3] + engineModel_data[4]+"</br>"+
                                "<font color='blue'>【钌合金】" + CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + engineModel_data[6] + "*" + count + "#" + engineModel_data[3] + engineModel_data[7];
                            td2.style.color = 'green';
                            td1.innerHTML = "首选型号";
                            td1.style.color = 'green';
                            r.appendChild(tr);
                            tr.appendChild(td1);
                            tr.appendChild(td2);
                        }else{
                            td1.innerHTML = "匹配结果";
                            td2.innerHTML = "请联系杨洋录入型号！！！";
                            td1.style.color = 'red';
                            td2.style.color = 'red';
                            r.appendChild(tr);
                            tr.appendChild(td1);
                            tr.appendChild(td2);
                        }
                    }else{
                        count = getCountXpath();
                        var CarInfo = getCarInfoXpath();
                        //获取品牌，型号，年款，排量
                        var brand = CarInfo[0];
                        var models = CarInfo[1];
                        var displacement = CarInfo[2];
                        var year = CarInfo[3];
                        var path = '//*[@id="NGKVehicleInfoArea"]/div/table/tbody';
                        r = document.evaluate(path, document).iterateNext();
                        tr = document.createElement("tr");
                        tr2 = document.createElement("tr");
                        td1 = document.createElement("td");
                        td2 = document.createElement("td");
                        td3 = document.createElement("td");
                        td4 = document.createElement("td");
                        td1.innerHTML = "匹配结果";
                        td2.innerHTML = "请截图给杨洋，在数据库录入该发动机特耐士型号！！！";
                        td1.style.color = 'red';
                        td2.style.color = 'red';
                        r.appendChild(tr);
                        tr.appendChild(td1);
                        tr.appendChild(td2);
                        var CarInfo = getCarInfoXpath();
                        //获取品牌，型号，年款，排量
                        var brand = CarInfo[0];
                        var models = CarInfo[1];
                        var displacement = CarInfo[2];
                        var year = CarInfo[3];
                        console.log(brand, models, displacement, year)
                        HttpGetData('GET', 'http://119.29.203.233:81/insert/insert_engine?ngk_engineModel=' + ngk_engineModel + '&brand=' + brand + '&model=' + models + '&displacement=' + displacement + '&year=' + year);
                        console.log('http://119.29.203.233:81/insert/insert_engine?ngk_engineModel=' + ngk_engineModel + '&brand=' + brand + '&model=' + models + '&displacement=' + displacement + '&year=' + year)

                    }
                }

                getNgkEngine_isTure(brand,models,displacement,year);
            }
        }




        //匹配显示点火线圈
        async function mate_tns_dhxq(content, data){
            var new_content = new Array();
            new_content = content.concat();
            //获取气缸数
            count = getCountXpath();
            //获取引擎
            var engineModel = getEngineModelXpath();
            //获取品牌，型号，年款，排量
            var CarInfo = getCarInfoXpath();
            var brand = CarInfo[0];
            var models = CarInfo[1];
            var displacement = CarInfo[2];
            var year = CarInfo[3];
            //库里存在访问+1，库里不存在插入数据
            let carInfo = await getCarInfoDhxq(brand, models, displacement, year, engineModel)
            HttpGetData('GET','http://119.29.203.233:81/insert/update_userid_info?userId='+macadd);
            carInfo= carInfo[0]
            console.log(carInfo)
            if(carInfo){
                var cid = carInfo["cid"];
                HttpGetData('GET','http://119.29.203.233:81/insert/updataCarInfo_dhxq?cid='+cid);
                console.log("点火线圈访问次数增加！！！")
            }else{
                let data = "brand="+brand+"&models="+models+"&displacement="+displacement+"&year="+year+"&engineModel="+engineModel+"&engineModelNum="+count+"&ngk_types={\"type\":\""+content+"\"}&chcek_num=1&remake="
                HttpGetData('GET','http://119.29.203.233:81/insert/cinfo_dhxq?'+data);
                console.log("点火线圈新增车型！！！")
            }
            console.log(content.length)
            if (content.length) {
                //console.log(r);
                var path = '//*[@id="NGKVehicleInfoArea"]/div/table/tbody';
                r = document.evaluate(path, document).iterateNext();
                for (var len = 0; len < content.length; len++) {
                    tr = document.createElement("tr");
                    td1 = document.createElement("td");
                    td2 = document.createElement("td");
                    for (var a = 0; a < data.length; a++) {
                        if (content[len] == data[a][0]) {
                            console.log(con-tent[len] + "=" + data[a][0] + "===" + data[a][1]);
                            td1.innerHTML = "匹配情况";
                            //显示火花塞型号
                            if (count != "0") {
                                td2.innerHTML = data[a][0] + "=" + CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #点火线圈*1=" + data[a][1] + "*1#"  + data[a][2];
                            }
                            td2.style.color = 'green';
                            r.appendChild(tr);
                            tr.appendChild(td1);
                            tr.appendChild(td2);
                            removeByValue(new_content, content[len]);
                        }
                    }
                }
                if (new_content) {
                    for (var j = 0; j < new_content.length; j++) {
                        tr = document.createElement("tr");
                        td1 = document.createElement("td");
                        td2 = document.createElement("td");
                        td1.innerHTML = "特耐士型号"
                        td2.innerHTML = new_content[j] + "=匹配不到型号!";
                        td2.style.color = 'red';
                        r.appendChild(tr);
                        tr.appendChild(td1);
                        tr.appendChild(td2);
                        HttpGetData('GET', 'http://119.29.203.233:81/insert/ngk_type_unknown?ngk_type='+new_content[j]+'&remake="请匹配对应特耐士型号，并添加到对应ngk_tns_dhxq表中！"' );
                    }
                }
            }else{
                console.log("================================")
                console.log(carInfo)
                console.log(carInfo.first_tns_type)
                console.log(carInfo.second_tns_type)
                if(carInfo.first_tns_type !='' && carInfo.second_tns_type !=''){
                    var str =   CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #点火线圈*1=" + carInfo.first_tns_type + "*1#"  + carInfo.remake;
                    var str2 =   CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #点火线圈*1=" + carInfo.second_tns_type + "*1#"  + carInfo.remake;
                    $(".table-bordered").append("<tr><td style='color: green'>匹配首选</td><td style='color: green'>"+str+"</td></tr>");
                    $(".table-bordered").append("<tr><td style='color: green'>匹配备选</td><td style='color: green'>"+str2+"</td></tr>");
                }else if(carInfo.first_tns_type !=''){
                    var str =   CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #点火线圈*1=" + carInfo.first_tns_type + "*1#"  + carInfo.remake;
                    $(".table-bordered").append("<tr><td style='color: green'>匹配首选</td><td style='color: green'>"+str+"</td></tr>");
                }else{
                    $(".table-bordered").append("<tr><td style='color: red'>匹配结果</td><td style='color: red'>联系杨洋录入特耐士型号！！！</td></tr>");
                }

            }
        }


        //点击火花塞触发
        $("#productListPage").on('click',"div[lang='hhs']",function(){
            content = getXpath();
            console.log(content)
            if(status=='1'){
                mate_tns(content,ngk_arr);
                console.log(ngk_arr)
            }else if(status=='-1'){
                alert("匹配功能已失效，请联系管理员！！！")
            }else if(status=='0'){
                alert("mac地址已无效,请联系管理员！！！")
            }
        });
        //点击点火线圈触发
        $("#productListPage").on('click',"div[lang='dhxq']",function(){
            content_dhxq = getXpath_dhxq();
            console.log(content_dhxq)
            if(status=='1'){
                mate_tns_dhxq(content_dhxq,ngk_arr_dhxq);
            }else if(status=='-1'){
                alert("匹配功能已失效，请联系管理员！！！")
            }else if(status=='0'){
                alert("mac地址已无效,请联系管理员！！！")
            }
        });


        // Your code here...
    })();