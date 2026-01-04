// ==UserScript==
// @name         极飞运营系统辅助分析插件
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  在故障单上显示自动化分析结果
// @author       Wuguoyi
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @require https://greasyfork.org/scripts/31940-waitforkeyelements/code/waitForKeyElements.js?version=209282
// @require https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js
// @match        *://xservice.xag.cn/pc*
// @match        *://xservice.xag.cn/public/pc*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405889/%E6%9E%81%E9%A3%9E%E8%BF%90%E8%90%A5%E7%B3%BB%E7%BB%9F%E8%BE%85%E5%8A%A9%E5%88%86%E6%9E%90%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/405889/%E6%9E%81%E9%A3%9E%E8%BF%90%E8%90%A5%E7%B3%BB%E7%BB%9F%E8%BE%85%E5%8A%A9%E5%88%86%E6%9E%90%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var type2Num = {'电调重启':21,'GPS定高触地':22,'GPS航向异常':23,'螺旋桨故障':24,'电机停止':25,'机体震动过大':26,'机体不平':27,'姿态超调':28,'飞控IMU故障':29,'动力不足':30,'动力不足低电压':31,'电调通讯异常':32,'电机响应异常':33,'RTK与飞控通讯异常':34,'GPS位置突变':35,'RTK延时过高':36,'GPS信号异常':37,'GPS高度突变':38,'地形模块故障':39,'地形模块测高错误':40,'遥控失误':41,'航线撞击':42,'地势起伏过大':43,'低电压迫降':44,'电池起火':45,'电机底座松脱':46,'电池故障':47,'非电池类着火':48,'日志错误':49,'日志断帧':50,'空中断电':51,'使用问题':52,'极侠电池插口短路':53,'XP2020 异常震动':54,'相机故障':55,'XP2020 电调或电调板短路':56,'固件问题':57,'XP2020 电源插口短路':58,'螺旋桨桨夹螺丝断裂':59,'螺旋桨桨夹断裂':60,'飞控故障':61};
    var faultType = new Object();
    var lenAna;
    var index = -1;
    var supplyTimes = 0;
    var itemstimes = 0;
    var patt = /\w+_\d+_\d+_\d+/g;
    var jcList = new Object();
    ah.proxy({
    //请求发起前进入
    onRequest: (config, handler) => {
        //console.log(config.method);
        handler.next(config);
    },
    //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
    onError: (err, handler) => {
        //console.log(err.type)
        handler.next(err)
    },
    //请求成功后进入
    onResponse: (response, handler) => {
        var url = response.config.url;
        console.log(url, response.response);
        handler.next(response)
        if (url.indexOf("guid")!=-1){
            var itemArr = response.response.data.items;
            var jcId = 0;
            for (var temp in itemArr){
                if ('items' in itemArr[temp]){
                    var pathStr = JSON.stringify(itemArr[temp].items);
                    var subList = pathStr.match(patt);
                    //console.log(subList);
                    for(var i=0;i<subList.length;i++){
                        var request = new XMLHttpRequest();
                        jcId = subList[i];
                        var testURL = "https://www.wycgi.cn/analyse/details?id=" + jcId;
                        request.responseType = "json";
                        request.open('GET', testURL, true);
                        //request.setRequestHeader('referer', 'http://47.110.211.155:10802/uavlog/v1/analysis/type');
                        //request.setRequestHeader('Access-Control-Allow-Origin', 'http://47.110.211.155:10802/uavlog/v1/analysis/type');
                        //request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                        request.send(null);
                    }
                    jcList[itemstimes] = subList;
                    itemstimes++;
                }
            }
            console.log(jcList);
            if (jcId != 0){
                var snpatt = /search=(\d+)&/;
                var uavrequest = new XMLHttpRequest();
                var uavURL = "https://xservice.xag.cn/main/member/technical/responsibility/index_data?user=-2&datetime=&keyword=" + snpatt.exec(pathStr)[1];
                uavrequest.responseType = "json";
                uavrequest.open('GET', uavURL, true);
                uavrequest.send(null);
            }
            /*
            if ('items' in itemArr[4]){
                //var pathStr = JSON.stringify(itemArr[4].items)
                //jcList = pathStr.match(patt);
                lenAna = jcList.length;
                console.log(jcList);
                for(var i=0;i<lenAna;i++){
                    var request = new XMLHttpRequest();
                    var jcId = jcList[i];
                    var testURL = "http://47.110.211.155:10802/uavlog/v1/analysis/type?id=" + jcId;
                    request.responseType = "json";
                    request.open('GET', testURL, true);
                    request.send(null);
                }
                //console.log(jcList.length);
            }
            */
        } else if (url.indexOf("wycgi.cn")!=-1){
            console.log(index, supplyTimes, itemstimes);
            //var obj = JSON.parse(this.responseText);
            var obj = response.response;
            //console.log(obj, obj.constructor.name);

            var varType;
            var crash;
            var details;
            if('type' in obj.data){
                varType = obj.data.type;
                crash = obj.data.crash;
                details = obj.data.frames;
            } else{
                varType = new Array();
                crash = false;
            }
            //console.log(varType);
            var typeLen = varType.length;
            var typeObj = new Object();
            var types = new Array();
            for(var j=0;j<typeLen;j++){
                typeObj[varType[j].name] = (varType[j].sequence_number+1)/2;
                types.push(type2Num[varType[j].name]);
            }
            typeObj['crash'] = crash;
            var jcPatt = /_(\d+_\d+)_/;
            var subId = jcPatt.exec(url);
            //console.log(subId[1]);
            faultType[subId[1]] = {'type': typeObj, 'details': details};
            //console.log(index == lenAna-1);
            index++;
            //console.log(index);
            /*
            if (index == 0 && supplyTimes == itemstimes-1){
                waitForKeyElements('div._form_com_11', main1, true);
                function main1(jqnode){
                    //console.log(types);
                    for (var k=0;k<types.length;k++){
                        //console.log(types[k]);
                        jqnode.parent().find('label.el-checkbox').eq(types[k]+1).addClass('is-checked').children('span.el-checkbox__input').addClass('is-checked');
                        //console.log(jqnode.parent().find('label.el-checkbox').eq(types[k]).text());
                    }
                    if (crash){
                        jqnode.parent().find('label.el-checkbox').eq(0).addClass('is-checked').children('span.el-checkbox__input').addClass('is-checked');
                        //console.log(jqnode.parent().find('label.el-checkbox').eq(0).text());
                        crash = false;
                    }
                    if (types.length>0){
                        jqnode.parent().find('input.el-input__inner').val(subId[1]);
                    }
                }
            }
            */
            if (index == jcList[supplyTimes].length-1){
                //console.log(faultType);
                //waitForKeyElements('div._form_com_4', main, true);
                //function main(jqnode){
                    var typeStr = JSON.stringify(faultType);
                    var txt1 = document.createElement('div');
                    txt1.className = 'check-success check-fail';
                    txt1.style = 'margin: 16px 0px;';
                    txt1.id = 'faults'+supplyTimes;
                    for (var pro in faultType){
                        var subli = document.createElement('li');
                        var subspan = document.createElement('span');
                        subspan.innerText = pro + ': ' + JSON.stringify(faultType[pro]['type']);
                        var subdiv = document.createElement('div');
                        subdiv.innerText = JSON.stringify(faultType[pro]['details']);
                        subli.appendChild(subspan);
                        subli.appendChild(subdiv);
                        txt1.append(subli);
                    }
                    $('div.file-view__box').eq(supplyTimes).parents('div.check-success.check-fail').append(txt1);
                    console.log($('div.file-view__box').eq(supplyTimes).parents('div.check-success.check-fail').text());
                    //var txt1= '<div class="check-success check-fail" style="margin: 16px 0px;">'+typeStr+'</div>';
                    $("div#faults"+supplyTimes+" li div").css('display', 'none');
                    $("div#faults"+supplyTimes+" li.liselected div").css('display', 'block');
                    $("div#faults"+supplyTimes+" li span").on('click', function(){
                        //$(this).parent().siblings().removeClass('liselected').find('div').hide();
                        console.log($(this).parent().attr('class'));
                        if ($(this).parent().attr('class') == 'liselected'){
                            $(this).parent().removeClass('liselected').find('div').hide();
                        } else {
                            $(this).parent().addClass('liselected');
                            $(this).next().slideDown(500);
                        }
                    });
                    faultType = new Object();
                    types = new Array();
                    index = -1;
                    (supplyTimes==itemstimes-1) ? supplyTimes=0 : supplyTimes++;
                //}
            }
        } else if (url.indexOf("main/member/technical/responsibility/index_data")!=-1){
            console.log(url);
            var tableList = response.response.data.tableData;
            var timeStr = '';
            var sndiv = document.createElement('div');
            if (tableList.length > 1){
                timeStr = tableList[1].service_time;
            }
            sndiv.innerText = "上次提单时间："+timeStr;
            $('div._form_com_2').append(sndiv);
        }
    }
});

})();