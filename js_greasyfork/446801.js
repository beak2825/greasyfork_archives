// ==UserScript==
// @name         江西共青团青年大学习后台删除组织按钮
// @description  江西共青团青年大学习后台缺少删除组织结构功能(看代码是隐藏了)，此脚本将会生成删除按钮，点击将会删除对应的组织结构！
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  try to take over the world!
// @author       修明
// @match        http://mp.jxqingtuan.cn:9080/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jxqingtuan.cn
// @grant        none
// @license      End-User License Agreement
// @downloadURL https://update.greasyfork.org/scripts/446801/%E6%B1%9F%E8%A5%BF%E5%85%B1%E9%9D%92%E5%9B%A2%E9%9D%92%E5%B9%B4%E5%A4%A7%E5%AD%A6%E4%B9%A0%E5%90%8E%E5%8F%B0%E5%88%A0%E9%99%A4%E7%BB%84%E7%BB%87%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/446801/%E6%B1%9F%E8%A5%BF%E5%85%B1%E9%9D%92%E5%9B%A2%E9%9D%92%E5%B9%B4%E5%A4%A7%E5%AD%A6%E4%B9%A0%E5%90%8E%E5%8F%B0%E5%88%A0%E9%99%A4%E7%BB%84%E7%BB%87%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
 console.log('我的脚本加载了');
 var button = document.createElement("button"); //创建一个input对象（提示框按钮）
 button.id = "deletezuzhi";
 button.textContent = "删除";
 button.style.width = "68.34px";
 button.style.height = "30px";
 button.style.align = "center";
    button.style.background = "#409EFF";
    button.style.color = "#ffffff";
    button.style.font = "12px 'Microsoft YaHei'";
    button.style.padding = "0px 10px";

    var x = document.getElementsByClassName('layui-btn-group')[0];
    //在浏览器控制台可以查看所有函数，ctrl+shift+I 调出控制台，在Console窗口进行实验测试
 x.appendChild(button);

 //绑定按键点击功能
    $("#deletezuzhi").click(function () {
        let name = document.getElementsByClassName("eleTree-node-content-label")[0].innerHTML
        console.log(name)
        if (orgName == undefined || orgName == "组织机构") {
            layer.msg("请选择部门");
            return
        }
        if (orgName == name) {
            layer.msg("请选择其他部门，不要删除本组织，不然你会后悔的！！！");
            return
        }
        layer.confirm('确定要删除 ' + orgName + ' 吗？', function (index) {
            $.ajax({
                url: "/portal/vol/sysOrg/delete?orgCode=" + orgCode,
                type: "POST",
                success: function (data) {
                    orgCode = "sys";
                    orgName = "组织机构";
                    reloadOrg();
                    getOrgInfor();
                }
            });
            layer.close(index);
        });
    });

    //var y = document.getElementById('s_btn_wr');
    //y.appendChild(button);

})();