// ==UserScript==
// @name         tyc_helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       xu_ming_hui@163.com
//http://www.gsxt.gov.cn/%7B*  http://www.geetest.com/*
//http://www.gsxt.gov.cn/%7B*  http://www.geetest.com/*
// @match        http://*.gsxt.gov.cn/%7B*
// @match        http://*.gsxt.gov.cn/%7B*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/393500/tyc_helper.user.js
// @updateURL https://update.greasyfork.org/scripts/393500/tyc_helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function add_sw(){
        var swal_js= document.createElement("script");
        swal_js.type = "text/javascript";
        swal_js.src="https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/7.29.2/sweetalert2.min.js";
        document.head.appendChild(swal_js);
        var swal_css = document.createElement('link');
        swal_css.rel = 'stylesheet';
        swal_css.href = 'https://cdnjs.cloudflare.com/ajax/libs/limonte-sweetalert2/7.29.2/sweetalert2.min.css';
        document.head.appendChild(swal_css);
    }


    var task_id = (Math.random())*1000000|0;
    task_id = new Date().getTime();
    var company_name = "";
    var add_btn = 0;

    //自定义Ajax
    function ajax(method, url, data, callback) {
        //1、创建请求对象
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        //2、配置请求参数并发送请求
        method = method.toUpperCase();
        if (method === 'GET') {
            xhr.rawopen('GET', url, true);
            xhr.send(null);
        } else if (method === 'POST') {
            xhr.rawopen('POST', url, true);
            xhr.send(data);
        } else {
            console.error('请传入合法的请求方式');
        }
        //3、监听状态
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                //向外返回服务器的数据
                //根据responseXML属性是否为空
                if (!xhr.responseXML) {
                    callback(xhr.responseText);
                } else {
                    callback(xhr.responseXML);
                }
            }
        }
    };

    function send_html(){
        ajax("POST",'http://172.24.113.235:8666/company/client_modify',JSON.stringify({'task_id':task_id,'url':'home','data':document.documentElement.innerHTML}),
             function(data) {
            console.log('html上传结果：', data);
            var json_data = JSON.parse(data);
            var update_result = "";
            if (json_data.result && json_data.result.update){
                console.log(json_data.result.update);
                update_result = json_data.result.update.join(',');
            }
            alert('已更新您看到的内容到网站，快去看看！已更新维度:' + update_result);
        });
    };

    function add_send_btn(){
        var send_btn = document.createElement('a');
        send_btn.type = 'button';
        send_btn.className = "active";
        send_btn.text = '>>>更新';
        send_btn.addEventListener("click",send_html);
        send_btn.style = 'background-color: rgb(255, 0, 100); display: inline-block;';
        if (document.getElementsByClassName('companyName').length > 0){
            document.getElementsByClassName('companyName')[0].appendChild(send_btn);
            company_name = document.getElementsByClassName('fullName')[0].innerText;
            task_id = 'tyc-' + company_name;
            return 1;
        }else if(document.getElementById('reportName') != null){
            send_btn.text = '>>>上传';
            document.getElementById('reportName').appendChild(send_btn);
            if(document.getElementById('entName')){
                company_name = document.getElementById('entName').innerText;
            }else if(document.getElementById('SfcfarSpeArtName')){
                company_name = document.getElementById('SfcfarSpeArtName').innerText;
            }else if(document.getElementById('PbtraName')){
                company_name = document.getElementById('PbtraName').innerText;
            }else{
                return -1;
            }
            var year = document.getElementById('reportName').innerText.substring(0,4);
            task_id = 'tyc-' + company_name + '-' + year;
            return 1;
        }
        console.log('task_id',task_id);
        return -1;
    }

    XMLHttpRequest.prototype.rawopen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        this.addEventListener("readystatechange",
        function() {
            if (this.readyState == 4 && this.status == 200) {
                console.info(method, url);
                console.log(this.responseText);
                if (this.responseText!=null && url!=null && (this.responseText.toString().substring(0,1) =='{'||this.responseText.toString().substring(0,1) =='[')){
                    if (add_btn == 0){
                        add_btn = add_send_btn();
                    };
                    if (add_btn == 1){
                        ajax("POST", "http://172.24.113.235:8666/company/client_modify", JSON.stringify({'task_id':task_id,'url':url,'data':this.responseText}),
                         function(data) {
                        //data = JSON.parse(data);
                        console.log('上传结果：', data);
                    });
                    }
                }
            }
        },
        false);
        XMLHttpRequest.prototype.rawopen.call(this, method, url, async, user, pass);
    };

})();