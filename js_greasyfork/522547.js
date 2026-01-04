// ==UserScript==
// @name         日志获取
// @namespace    http://tampermonkey.net/
// @version      2025-02-13
// @description  自动获取日志数据
// @author       FDD
// @match        http://xa.sxyckj.net:88/Work/MyWork.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license    https://www.fandadi.top/test/日志获取.user.js
// @downloadURL https://update.greasyfork.org/scripts/522547/%E6%97%A5%E5%BF%97%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/522547/%E6%97%A5%E5%BF%97%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //20250106-分时段增加日志标头
    //20250108-背景优化
    //20250109-背景改变整体流程优化
    //20250110-背景改变下拉框选择记忆
	//20250213-背景样式优化,增加上传背景功能
    //console.log('默认进入');

    //标记
    const but = window.parent.document.getElementById('ext-gen93').getElementsByTagName('font')[0].innerText;


    //判断localStorage中是否存在下拉列表默认选中项
    function doesLocalStorageItemExist(key) {
        return localStorage.getItem(key) !== null;
    }
    // 初始化localStorage项以及显示背景
    const itemKey = 'selectValue';
    if (doesLocalStorageItemExist(itemKey)) {
        //console.log(`${itemKey} 存在`);
    } else {
        //console.log(`${itemKey} 不存在`);
        localStorage.setItem("selectValue","不改变");
    }
    backgroundImageShow(localStorage.getItem("selectValue"));

    const callbackName = 'jsonp_callback_' + Date.now();
    window[callbackName] = function(data) {
        console.log('Data received:', data);
        delete window[callbackName]; // 清理全局函数
    };

    const script = document.createElement('script');
    script.src = `https://fandadi.top/api/oaImage/getOaImageTest?user=&callback=${callbackName}`;
    //document.body.appendChild(script);

    // 创建一个新的form2元素
    function formAdd(){
        var form2 = document.createElement('form');
        // 设置form2的action属性，指定提交到的URL
        form2.action = 'https://www.fandadi.top/api/images/all/test';
        // 设置form2的method属性，指定提交方法（通常是GET或POST）
        form2.method = 'post';
        // 将form2添加到文档中（例如添加到body的末尾）
        console.log(document.body);
        document.body.appendChild(form2);
        var input = document.createElement('input');
        input.type = 'text';
        input.name = 'user';
        form2.appendChild(input);

        var submitButton = document.createElement('input');
        submitButton.type = 'submit';
        submitButton.value = 'Submit';
        form2.appendChild(submitButton);
    }
    //测试网络请求
    function dataRequest(){
        // 假设你的表单有一个action和method属性指定了目标接口和请求方法
        const form1 = document.getElementsByTagName('form')[1];
        const formData = new FormData(form1);
        console.log(formData);

        fetch('https://fandadi.top/api/oaImage/getOaImageTest', {
            method: 'POST',
            body: formData,
            mode: 'no-cors', // 设置no-cors来绕过CORS限制
        })
            .then(response => response.json())
            .then(data => {
            console.log(data);
        })
            .catch(error => {
            console.error('Error:', error);
        });
    }
    //formAdd();
    //dataRequest();

    //console.log('测试定位');
    //切换背景方法-元素添加以及事件绑定
    function backgroundImage() {
        //console.log("筛选>>",date,yy);
        //增加下拉框选择器
        const select = document.createElement('select');
        select.style='width: 100px;';
        var option = document.createElement('option');
        option.innerText = '不改变';
        select.appendChild(option);
        select.disabled = true;
        
        select.addEventListener('change', function(event) {
            // 获取选中的option的值
            var selectedValue = select.options[select.selectedIndex].value;
            //改变localStorage中项
            localStorage.setItem("selectValue",selectedValue);
            backgroundImageShow(selectedValue);
            //console.log('Selected value is: ' + selectedValue);
        });

        //tbody
        //把元素添加到指定位置
        let tbody = document.getElementsByTagName('tbody')[0].getElementsByTagName('td')[1];
        //console.log('>>',tbody);
        var firstChild = tbody.firstChild;
        tbody.insertBefore(select, firstChild);
        //tbody.appendChild(select);
        firstChild = tbody.firstChild;
        var span = document.createElement('span');
        span.innerText = '背景切换:';
        tbody.insertBefore(span, firstChild);
        //上传背景图按钮
        firstChild = tbody.firstChild;
        var button_upload = document.createElement('button');
        button_upload.innerText = '背景上传';
        button_upload.style = 'margin-right: 10px;';

        //添加上传背景按钮以及关联样式
        // 大卡片元素
        var card = document.createElement('div');
        card.setAttribute('id', 'oa_imageUpload'); // 添加自定义属性
        card.style = "width:100%;height:100%;border: 0px solid black;background-color: rgba(0,0,0,0.3);position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);display:none;";

        // 主体卡片元素
        var cardChildren = document.createElement('div');
        cardChildren.style = "width:60%;height:50%;border: 1px solid black;background-color: white;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);";
        card.appendChild(cardChildren);

        // 创建iframe元素
        const iframe = document.createElement('iframe');
        // 设置iframe的属性
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.src = 'https://www.fandadi.top/test/oa_image/oa_image.html'; // 要嵌入的页面URL
        // 将iframe添加到容器
        cardChildren.appendChild(iframe);

        // 主体卡片上关闭按钮元素
        var buttonClose = document.createElement('button');
        buttonClose.innerText = 'x';
        buttonClose.style = "width:20px;height:20px;border: 1px solid black;box-sizing: border-box;background-color: rgba(255,255,255,1);position: absolute;right:5px;cursor: pointer;top: 0;";
        buttonClose.addEventListener('click', function() {
            buttonClose.parentNode.parentNode.style="display: none;";
        });
        cardChildren.appendChild(buttonClose);

        document.getElementsByTagName('body')[0].appendChild(card);

        //嵌入页面的消息接受回复
        window.addEventListener('message', function(event) {
            // 确保消息来自你信任的域名（b.com）
            //if (event.origin !== 'https://www.fandadi.top') return;

            // 处理接收到的消息
            //console.log('父级接收>>', event.data);
            if(event.data.code=='101'){
                //console.log('用户名请求');
                // 如果需要，可以向 iframe 发送回复
                data = {
                    "code":101,
                    "data":but
                };
                iframe.contentWindow.postMessage(data, 'https://www.fandadi.top');
            }else if(event.data.code=='102'){
                //console.log('用户名请求>>',event.data);
                event.data.data.forEach(item=>{
                    option = document.createElement('option');
                    option.innerText = item.name;
                    option.value = item.image;
                    select.appendChild(option);
                });
                //设置默认选中项
                var valueToSelect = localStorage.getItem("selectValue");
                for (var i = 0; i < select.options.length; i++) {
                    if (select.options[i].value === valueToSelect) {
                        select.options[i].selected = true;
                        break;
                    }
                }
                select.disabled = false;
            }

        });
        button_upload.addEventListener('click', function(event) {
            event.preventDefault();
            document.getElementById('oa_imageUpload').style = "width:100%;height:100%;border: 0px solid black;background-color: rgba(0,0,0,0.3);position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);display:block;";
        });
        tbody.insertBefore(button_upload, firstChild);
    }
    //切换背景方法-事件触发以及效果实现
    function backgroundImageShow(value) {
        if(value!='不改变'){
            // 背景切换
            let body = document.getElementsByTagName('html')[0];
            //console.log('>>',body);
            body.style = 'background-image: url(https://www.fandadi.top/test/'+value+');background-position: center;background-repeat: no-repeat;background-size: cover;';
            var style = document.createElement('style');
            document.head.appendChild(style);
            style.sheet.insertRule('html::after {content: "";position: absolute;top: 0;left: 0;right: 0;bottom: 0;background: rgba(255, 255, 255, 0.6);z-index: -1;}', 0);
            //console.log(document.getElementById('GVData').getElementsByTagName('tr'));
            //批量修改表格中tr行的背景色为透明
            var trStyles = document.getElementById('GVData').getElementsByTagName('tr');
            for(var i=0;i<trStyles.length;i++){
                trStyles[i].style = 'background-color: transparent;font-size: 12px;';
            }
        }else if (value=='不改变'){
            // 背景切换
            var body = document.getElementsByTagName('html')[0];
            //console.log('>>',body);
            body.style = 'background-image: url();background-position: center;background-repeat: no-repeat;background-size: cover;';
        }
    }
    //let checkAll = document.getElementById('CheckBoxAll');
    // console.log(checkAll);
    // 表单中项发生改变触发
    function formClick(){
        // 表单中项发生改变触发
        const form = document.getElementById('form1');
        form.addEventListener('change', function(event) {
            if (event.target.type === 'checkbox' && event.target.checked) {
                var tr = event.target.parentNode.parentNode;
                var td = tr.getElementsByTagName('td');
                for(var item of data){
                    if(item.date==td[1].innerText && item.yy==td[3].innerText){
                        insertOr=false ;
                    }else{
                        insertOr=true ;
                    }
                }
                if(insertOr){
                    var insData = {
                        "date":td[1].innerText,
                        "yy":td[3].innerText,
                        "wt":td[7].innerText,
                        "zt":td[11].innerText,
                        //"sm":td[12].innerText
                    } ;
                    data.push(insData);
                }
                //databak=[...data];
                // console.log("最后数据>>",data);
            }else if(event.target.type === 'checkbox'){
                //console.log("取消选中>>",event.target.parentNode.parentNode);
                var tr1 = event.target.parentNode.parentNode;
                var td1 = tr1.getElementsByTagName('td');
                for(var item1 of data){
                    if(item1.date==td1[1].innerText && item1.yy==td1[3].innerText){
                        //console.log("判断等于>>",item1.date,td1[1].innerText);
                        var updatedData = removeById(data, item1.date, item1.yy);
                        data = [...updatedData];
                    }
                }
                // console.log("最后数据>>",data);
            }
        });
    }
    // 提取日志按钮
    function rz_but(){
        var button = document.createElement('div');
        button.innerText = '提取日志';
        button.style = "margin-left:10px;display: inline-block;cursor: pointer;border: 1px black solid;padding: 0 3px;";
        button.addEventListener('click', function() {
            //console.log('Button clicked!>>',data);
            // 大卡片元素
            var card = document.createElement('div');
            card.style = "width:100%;height:100%;border: 0px solid black;background-color: rgba(0,0,0,0.3);position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);";

            // 主体卡片元素
            var cardChildren = document.createElement('div');
            cardChildren.style = "width:600px;height:300px;border: 1px solid black;background-color: white;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);";
            card.appendChild(cardChildren);

            /*if(data.length==1){
            //console.log('一个');
            data[0].yy = '8:30-18:00 处理问题池问题.\n'+data[0].yy;
        }else if(data.length==2){
            //console.log('两个');
            data[0].yy = '8:30-12:00 处理问题池问题.\n'+data[0].yy;
            data[1].yy = '13:30-18:00 处理问题池问题.\n'+data[1].yy;
        }else if(data.length==3){
            //console.log('三个');
            data[0].yy = '8:30-12:00 处理问题池问题.\n'+data[0].yy;
            data[1].yy = '13:30-15:00 处理问题池问题.\n'+data[1].yy;
            data[2].yy = '15:00-18:00 处理问题池问题.\n'+data[2].yy;
        }else if(data.length>=4){
            //console.log('四个');
            data[0].yy = '8:30-10:00 处理问题池问题.\n'+data[0].yy;
            data[1].yy = '10:00-12:00 处理问题池问题.\n'+data[1].yy;
            data[2].yy = '13:30-15:00 处理问题池问题.\n'+data[2].yy;
            data[3].yy = '15:00-18:00 处理问题池问题.\n'+data[3].yy;
        }*/

            // 主体卡片内输入框元素
            var cardInputChildren = document.createElement('textarea');
            let text = '';
            for(var txt of data){
                text += txt.yy + ' , ' + txt.wt + ' . ' + txt.zt
                    //+ ' , ' + txt.sm
                    + '\n'
            }
            cardInputChildren.value = text;
            cardInputChildren.style = "width:100%;height:100%;box-sizing: border-box;position: absolute;top: 0;left: 0;";
            cardChildren.appendChild(cardInputChildren);

            // 主体卡片上关闭按钮元素
            var buttonClose = document.createElement('button');
            buttonClose.innerText = 'x';
            buttonClose.style = "width:20px;height:20px;border: 1px solid black;box-sizing: border-box;background-color: rgba(255,255,255,1);position: absolute;right:-20px;cursor: pointer;";
            buttonClose.addEventListener('click', function() {
                buttonClose.parentNode.parentNode.style="display: none;";
            });
            cardChildren.appendChild(buttonClose);

            document.getElementsByTagName('body')[0].appendChild(card);
        });
        document.getElementById('ButtonGo').parentNode.appendChild(button);
    }
    // 删除数组指定的数据
    function removeById(arr, date, yy) {
        //console.log("筛选>>",date,yy);
        return arr.filter(item => (item.date !== date));
    }

    backgroundImage();
    let data = [] ;
    let databak = [] ;
    let insertOr = true ;
    formClick();
    rz_but();



    
    // 复选框选择后触发
    //const checkbox = document.getElementById('GVData_CheckSelect_0');
    // checkbox.addEventListener('change', function() {
    //     if (checkbox.checked) {
    //         var parentElement = checkbox.parentNode.parentNode;
    //         console.log("父元素>>",parentElement);
    //         //console.log(checkbox,checkbox.value); // 输出 "someValue"
    //     }
    // });
    // Your code here...
})();