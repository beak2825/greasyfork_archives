// ==UserScript==
// @name         日志获取
// @namespace    http://tampermonkey.net/
// @version      2025-01-01
// @description  日志自动获取
// @author       FDD
// @match        http://xa.sxyckj.net:88/Work/MyWork.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license      // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522538/%E6%97%A5%E5%BF%97%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/522538/%E6%97%A5%E5%BF%97%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 提取日志按钮
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

         // 主体卡片内输入框元素
        var cardInputChildren = document.createElement('textarea');
        let text = '';
        for(var txt of data){
            text += txt.yy + ' , ' + txt.wt + ' . ' + txt.zt + ' , ' + txt.sm + '\n'
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

    let data = [] ;
    let insertOr = true ;

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
                    "sm":td[12].innerText
                } ;
                data.push(insData);
            }
            // console.log("最后数据>>",data);
        }else if(event.target.type === 'checkbox'){
            // console.log("取消选中>>",event.target.parentNode.parentNode);
            var tr1 = event.target.parentNode.parentNode;
            var td1 = tr1.getElementsByTagName('td');
            for(var item1 of data){
                if(item1.date==td1[1].innerText && item1.yy==td1[3].innerText){
                    // console.log("判断等于>>",item1.date,td1[1].innerText);
                    var updatedData = removeById(data, item1.date, item1.yy);
                    data = [...updatedData];
                }
            }
            // console.log("最后数据>>",data);
        }
    });

    // 删除数组指定的数据
    function removeById(arr, date, yy) {
        // console.log("筛选>>",date,yy);
        return arr.filter(item => (item.date !== date));
    }

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