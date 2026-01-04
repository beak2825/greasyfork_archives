    // ==UserScript==

    // @name         NGK火花塞匹配#
    // @namespace    http://tampermonkey.net/
    // @version      0.9.5
    // @description  NGK火花塞匹配功能
    // @author       You
    // @match        https://market.dat881.com/intell/ngk/ngkApp
    // @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
    // @grant        GM_xmlhttpRequest
    // @connect      *
    // @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/454966/NGK%E7%81%AB%E8%8A%B1%E5%A1%9E%E5%8C%B9%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/454966/NGK%E7%81%AB%E8%8A%B1%E5%A1%9E%E5%8C%B9%E9%85%8D.meta.js
    // ==/UserScript==


    (function() {
        'use strict';
        //用户配置，请输入电脑的mac地址和手机号，配置成功后即可使用
        var macadd = 'zijian';
        var count;
        var content =new Array();
        var tr,tr2,td1,td2,td3,td4,r;
        var ngk_arr =new Array();
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
            var ngk_data = await HttpGetData('GET','http://139.9.55.91:81/search/ngk');
            ngk_data = ngk_data['list']
            for(var i =0 ;i<ngk_data.length;i++){
                ngk_arr.push([ngk_data[i]['ngkType'],ngk_data[i]['tnsCode'],ngk_data[i]['tt'],ngk_data[i]['markes']]);
            }
            console.log(ngk_arr.length);
        }

        //获取ngk引擎数据
        async function getNgkEngine(data) {
            engineModel_data = [];
            var ngk_engine = await HttpGetData('GET','http://139.9.55.91:81/search/ngk_engine?'+data);
            ngk_engine = ngk_engine['list']
            if(ngk_engine.length){
                var ngk_engineModel = ngk_engine[0]['ngk_engineModel']
                var tns_code_first = ngk_engine[0]['tns_code_first']
                var tns_code_second = ngk_engine[0]['tns_code_second']
                var tt = ngk_engine[0]['tt']
                var remarks = ngk_engine[0]['remarks']
                engineModel_data.push(ngk_engineModel,tns_code_first,tns_code_second,tt,remarks)
            }
            //console.log(ngk_engine,ngk_engineModel,tns_code_first,tns_code_second,tt,remarks)

            return engineModel_data
        }
        //获取数据库汽车信息
        async function getCarInfo(brand,models,displacement,year,engineModel) {
            var carInfo =[]
            var carData = "brand="+brand+"&models="+models+"&displacement="+displacement+"&year="+year+"&engineModel="+engineModel
            var get_carInfo = await HttpGetData('GET','http://139.9.55.91:81/search/carInfo?'+carData);
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
            var path = '//tr[@class="result_table_tr"]/td[2]/b/text()';
            var result = document.evaluate(path,document,null,XPathResult.ANY_TYPE,null);
            //console.log(result);
            var xnodes = new Array();
            while(xres = result.iterateNext()){
                xnodes.push(xres.textContent);
            }
            //console.log(xnodes);
            if(xnodes){
                return xnodes;
            }else{
                xnodes ="";
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
            var userInfo = await HttpGetData('GET','http://139.9.55.91:81/search/userInfo?userId='+macadd);
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
            HttpGetData('GET','http://139.9.55.91:81/insert/update_userid_info?userId='+macadd);
            carInfo= carInfo[0]
            if(carInfo){
                var cid = carInfo["cid"];
                HttpGetData('GET','http://139.9.55.91:81/insert/updataCarInfo?cid='+cid);
                console.log("访问次数增加！！！")
            }else{

                let data = "brand="+brand+"&models="+models+"&displacement="+displacement+"&year="+year+"&engineModel="+engineModel+"&engineModelNum="+count+"&ngk_types={\"type\":\""+content+"\"}&chcek_num=1&remake="
                HttpGetData('GET','http://139.9.55.91:81/insert/cinfo?'+data);
                //console.log('http://139.9.55.91:81/insert/cinfo?'+data)
                console.log("新增车型！！！")
            }

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
                            console.log(content[len] + "=" + data[a][0] + "===" + data[a][1]);
                            td1.innerHTML = "匹配情况";
                            //显示火花塞型号
                            if (count == "4") {
                                td2.innerHTML = data[a][0] + "=" + CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + data[a][1] + "*" + count + "," + data[a][2] + "*1#" + data[a][3];
                            } else if (count == "6") {
                                td2.innerHTML = data[a][0] + "=【" + count + "缸】" + CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + data[a][1] + "*" + count + "," + data[a][2] + "*1#" + data[a][3];
                            } else if (count == "8") {
                                td2.innerHTML = data[a][0] + "=【" + count + "缸】" + CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + data[a][1] + "*" + count + "," + data[a][2] + "*1#" + data[a][3];
                            } else if (count == "3") {
                                td2.innerHTML = data[a][0] + "=【" + count + "缸】" + CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + data[a][1] + "*" + count + "," + data[a][2] + "*1#" + data[a][3];
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
                        HttpGetData('GET', 'http://139.9.55.91:81/insert/ngk_type_unknown?ngk_type='+new_content[j]+'&remake="请匹配对应特耐士型号，并添加到对应ngk_tns表中！"' );
                    }
                }
            } else {
                var ngk_engineModel = getEngineModelXpath()

                async function getNgkEngine_isTure() {
                    var t = await getNgkEngine('ngk_engineModel=' + ngk_engineModel)
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
                        td1.innerHTML = "首选型号";
                        if (engineModel_data[1] && engineModel_data[2]) {
                            td2.innerHTML = "【" + count + "缸】" + CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + engineModel_data[1] + "*" + count + "," + engineModel_data[3] + "*1#" + engineModel_data[4];
                            td4.innerHTML = "【" + count + "缸】" + CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + engineModel_data[2] + "*" + count + "," + engineModel_data[3] + "*1#" + engineModel_data[4];
                            ;
                            td1.innerHTML = "首选型号";
                            td3.innerHTML = "备选型号";
                            td4.style.color = 'blue';
                            td2.style.color = 'green';
                            r.appendChild(tr);
                            r.appendChild(tr2);
                            tr.appendChild(td1);
                            tr.appendChild(td2);
                            tr2.appendChild(td3);
                            tr2.appendChild(td4);
                        } else if (count == "4" && engineModel_data[1]) {
                            td2.innerHTML = "【首选】" + CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + engineModel_data[1] + "*" + count + "," + engineModel_data[3] + "*1#" + engineModel_data[4];
                            td2.style.color = 'green';
                            r.appendChild(tr);
                            tr.appendChild(td1);
                            tr.appendChild(td2);
                        } else if (count == "6" && engineModel_data[1]) {
                            td2.innerHTML = "【首选】【" + count + "缸】" + CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + engineModel_data[1] + "*" + count + "," + engineModel_data[3] + "*1#" + engineModel_data[4];
                            td2.style.color = 'green';
                            r.appendChild(tr);
                            tr.appendChild(td1);
                            tr.appendChild(td2);
                        } else if (count == "8" && engineModel_data[1]) {
                            td2.innerHTML = "【首选】【" + count + "缸】" + CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + engineModel_data[1] + "*" + count + "," + engineModel_data[3] + "*1#" + engineModel_data[4];
                            td2.style.color = 'green';
                            r.appendChild(tr);
                            tr.appendChild(td1);
                            tr.appendChild(td2);
                        } else if (count == "3" && engineModel_data[1]) {
                            td2.innerHTML = "【首选】【" + count + "缸】" + CarInfo[0] + CarInfo[1] + " " + CarInfo[2] + "  #火花塞*1=" + engineModel_data[1] + "*" + count + "," + engineModel_data[3] + "*1#" + engineModel_data[4];
                            td2.style.color = 'green';
                            r.appendChild(tr);
                            tr.appendChild(td1);
                            tr.appendChild(td2);
                        } else if ((engineModel_data[1] && engineModel_data[2]) == false) {
                            td2.innerHTML = "请在数据库录入该发动机特耐士型号！！！";
                            td2.style.color = 'red';
                            r.appendChild(tr);
                            tr.appendChild(td1);
                            tr.appendChild(td2);
                        }
                    } else {
                        HttpGetData('GET', 'http://139.9.55.91:81/search/insert_engine?engineModel=' + ngk_engineModel);
                    }
                }

                getNgkEngine_isTure();
            }
        }
        //点击火花塞触发
        $("#productListPage").on('click',"div[lang='hhs']",function(){
            content = getXpath();
            if(status=='1'){
                mate_tns(content,ngk_arr);
            }else if(status=='-1'){
                alert("匹配功能已失效，请联系管理员！！！")
            }else if(status=='0'){
                alert("mac地址已无效,请联系管理员！！！")
            }
        });


        // Your code here...
    })();