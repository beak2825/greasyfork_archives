// ==UserScript==
// @name         在百度搜索页面显示Google搜索按钮1.6
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  在百度搜索页面显示Google搜索按钮
// @author       chenhao111
// @match        http://192.168.91.146:8080/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/451798/%E5%9C%A8%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BAGoogle%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE16.user.js
// @updateURL https://update.greasyfork.org/scripts/451798/%E5%9C%A8%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BAGoogle%E6%90%9C%E7%B4%A2%E6%8C%89%E9%92%AE16.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';
    // Your code here...
    console.log('load1')
    //$('#z-auxheader-cnt').height('80px')

    $('.z-caption-l').append('<input id ="cardNo" class ="cardNo" autocomplete="off"  placeholder="请输入卡号" style="margin-left:10px;width:100px;color:#fff;letter-spacing:1px;background:#ECEAE4;border-bottom:1px solid #2d78f4;outline:medium;*border-bottom:0;-webkit-appearance:none;-webkit-border-radius:0;border: 0;height:34px;"></input>')
    $('.z-caption-l').append('<input id ="startTime" class ="startTime" autocomplete="off"  placeholder="请输入开始时间" style="margin-left:10px;width:100px;color:#fff;letter-spacing:1px;background:#ECEAE4;border-bottom:1px solid #2d78f4;outline:medium;*border-bottom:0;-webkit-appearance:none;-webkit-border-radius:0;border: 0;height:34px;"></input>')
    $('.z-caption-l').append('<input id ="endTime" class ="endTime" autocomplete="off"  placeholder="请输入结束时间" style="margin-left:10px;width:100px;color:#fff;letter-spacing:1px;background:#ECEAE4;border-bottom:1px solid #2d78f4;outline:medium;*border-bottom:0;-webkit-appearance:none;-webkit-border-radius:0;border: 0;height:34px;"></input>')
    $('.z-caption-l').after('<button id="google" class="z-button14" value="搜 索" style="margin-left:10px;width:100px;color:#fff;letter-spacing:1px;background:#3385ff;border-bottom:1px solid #2d78f4;outline:medium;*border-bottom:0;-webkit-appearance:none;-webkit-border-radius:0;border: 0;height:34px;">下载</button>')

    $('.z-button14').click(function(){
        var myaaa=document.getElementsByClassName('z-combobox-inp z-combobox-readonly')

        var s = '';
        for (var i = 0; i < myaaa.length; i++) {
            if(myaaa[i].value != '' && i >0){

                console.log(myaaa[i].value)
                s += '_'+ myaaa[i].value
            }

        }

        s += '.xlsx'
        var params = {


            "dept": myaaa[1].value,
            "route":myaaa[3].value,
            "busNo":myaaa[4].value,
            "startTime":document.getElementById('startTime').value ,
            "endTime":document.getElementById('endTime').value,
            "cardNo":document.getElementById('cardNo').value
        }

         var  dept=  myaaa[1].value
        var route= myaaa[3].value
        var busNo= myaaa[4].value
        var startTime= document.getElementsByClassName('z-datebox-inp z-datebox-readonly')[0].value+' '+document.getElementById('startTime').value
        var endTime=  document.getElementsByClassName('z-datebox-inp z-datebox-readonly')[0].value+' '+document.getElementById('endTime').value
        var cardNo= document.getElementById('cardNo').value

        var params1 = 'busNo='+busNo+'&startTime='+startTime+'&endTime='+endTime+'&cardNo='+cardNo+'&route='+route+'&dept='+dept


       // console.log(params)
        console.log(params1)

        //window.location.href='http://192.168.0.114:8082/data/makeExecel'
        // var url ='http://192.168.0.114:8082/data/makeExecel'
        // download(url,params,s);

        var url1 ='http://192.168.0.114:8082/data/makeExecel?'+ params1
        download1(url1,params1,s);

    })


})();


(function() {
    'use strict';
    // Your code here...
    console.log('load')
    var myaaa=document.getElementsByClassName('z-combobox-inp z-combobox-readonly')

    var s = '';
    for (var i = 0; i < myaaa.length; i++) {
        if(myaaa[i].value != ''){

            console.log(myaaa[i].value)
            s += '_'+ myaaa[i].value

        }

    }

    console.log(s)
    // console.log($('input[class=z-combobox-inp]:checked').val())


})();


function httpPost(url,params) {
    var formEltTemp = document.createElement("form"); //增加表单，隐藏方式
    formEltTemp.action = url;
    formEltTemp.method = "post";
    formEltTemp.style.display = "none"; //隐藏这个form

    //通过for..in来遍历params这个json数组对象
    for(var key in params){
        var opt = document.createElement("textarea"); //新建一个文本框元素
        opt.name = key; //设置文本框的name属性
        opt.value = params[key]; //设置文本框的value属性
        formEltTemp.appendChild(opt); //把opt这个文本框加入到form表单中
    }


    document.body.appendChild(formEltTemp);//把增加的这个form表单添加到body中
    formEltTemp.submit(); //提交表单
    return formEltTemp;

}

function httpPost1(url,params){
    var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
    httpRequest.open('POST', url, true); //第二步：打开连接/***发送json格式文件必须设置请求头 ；如下 - */
    httpRequest.setRequestHeader("Content-type","application/json");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）var obj = { name: 'zhansgan', age: 18 };
    httpRequest.send(JSON.stringify(params));//发送请求 将json写入send中
    /**
 * 获取数据后的处理程序
 */
    httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
            var json = httpRequest.responseText;//获取到服务端返回的数据
            console.log(json);
        }
    };
}

var httpRequest = new XMLHttpRequest();//第一步：建立所需的对象
httpRequest.open('GET', 'url', true);//第二步：打开连接  将请求参数写在url中  ps:"http://localhost:8080/rest/xxx"
httpRequest.send();//第三步：发送请求  将请求参数写在URL中
/**
         * 获取数据后的处理程序
         */
httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState == 4 && httpRequest.status == 200) {
        var json = httpRequest.responseText;//获取到json字符串，还需解析
        console.log(json);
    }
};


function download(url,params,filename) {
    var oReq = new XMLHttpRequest();
    oReq.open('POST', url, true);
    oReq.responseType = "blob";
    oReq.setRequestHeader("Content-type","application/json");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）var obj = { name: 'zhansgan', age: 18 };
    oReq.send(JSON.stringify(params));
    oReq.onload = function (oEvent) {
        if (oReq.readyState == 4 && oReq.status == 200) {//验证请求是否发送成功
            // var json = oReq.responseText;//获取到服务端返回的数据
            //console.log(json);
            var content = oReq.response;

            var elink = document.createElement('a');
            elink.download = filename;
            elink.style.display = 'none';

            var blob = new Blob([content]);
            elink.href = URL.createObjectURL(blob);

            document.body.appendChild(elink);
            elink.click();

            document.body.removeChild(elink);
        }


    };

}


function download1(url,params,filename) {
    var oReq = new XMLHttpRequest();
    oReq.open('GET', url, true);
    oReq.responseType = "blob";
    oReq.send();
    oReq.onload = function (oEvent) {
        if (oReq.readyState == 4 && oReq.status == 200) {//验证请求是否发送成功
            // var json = oReq.responseText;//获取到服务端返回的数据
            //console.log(json);
            var content = oReq.response;

            var elink = document.createElement('a');
            elink.download = filename;
            elink.style.display = 'none';

            var blob = new Blob([content]);
            elink.href = URL.createObjectURL(blob);

            document.body.appendChild(elink);
            elink.click();

            document.body.removeChild(elink);
        }


    };

}


//CSS样式设置
function cssStyle(Para){
    Para.css('width','75px');
    Para.css('height','30px');
    //Para.css('line-height','45px');
    Para.css('border-style','none');
    Para.css('background-color','#4e6ef2');
    Para.css('font-size','17'); //invalid
    Para.css('border-radius','10px 10px 10px 10px');
    Para.css('color','#fff');
    Para.css('margin','5px 0px 0px 2px');
    Para.css('cursor','pointer');
    //Para.css('','');
    //Para.css('','');
    //Para.css('','');
}


//鼠标进入、划出样式设置
function hoverIn(Para) {
    Para.css('background-color','#4662d9');
}
function hoverOut(Para) {
    Para.css('background-color','#4e6ef2');
}
