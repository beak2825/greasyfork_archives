// ==UserScript==
// @name        补天漏洞提交辅助工具
// @namespace   wuhen
// @match       https://www.butian.net/Loo/submit
// @grant       none
// @version     1.0测试版
// @author      无痕
// @email       1790513602@qq.com
// @description 2020/2/15 下午3:10:53
// @downloadURL https://update.greasyfork.org/scripts/397829/%E8%A1%A5%E5%A4%A9%E6%BC%8F%E6%B4%9E%E6%8F%90%E4%BA%A4%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/397829/%E8%A1%A5%E5%A4%A9%E6%BC%8F%E6%B4%9E%E6%8F%90%E4%BA%A4%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==




function myfun()
{
    var url = prompt("请输入urls");
    var company = prompt("请输入厂商");
    var domain_name = url.split('/')[2];
    document.getElementById("inputCompy").value = company;//厂商

    document.querySelector("input[name='host']").value = domain_name;//ip填写

    document.querySelector("input[name='title']").value = company + "存在SQL注入漏洞";//漏洞标题
    
    document.querySelector("input[name='url[]']").value = url;//漏洞url

    document.getElementById("selCate").value = "1";//漏洞类别
    /************************<选择漏洞类别>**************************************
     *                     0-->  请选择漏洞类别                                   
     *                     1-->  Web漏洞                                         
     *                     8-->  App漏洞                                         
     *                     7-->  IoT漏洞                                         
     *                     9-->  工控漏洞                                        
     *                     10-->  操作系统及通用软件漏洞
    ***************************************************************************/

    document.querySelector("select[name='attribute']").value = "0";
    /**************************************************************************
     *                       1--> 事件
     *                       0--> 通用
     *************************************************************************/

    //document.querySelector("select[id='lootypesel2']").value = "2";
    document.getElementById("lootypesel2").value = "2";
    /***************************************************************************
     *                      1--> XSS
     *                      68--> 配置错误
     *                      67--> 弱口令
     *                      66--> 入侵事件
     *                      65--> 疑似被黑
     *                      28--> 文件上传
     *                      10--> 信息泄露
     *                      9-->  存在后门
     *                      8-->  逻辑漏洞
     *                      4-->  代码执行
     *                      3-->  命令执行
     *                      2-->  SQL注入
     *                      3002--> 解析漏洞
    ***************************************************************************/

    var element = document.getElementById("tpl_def_detail");
    element.removeChild(element.childNodes[0]);
    document.getElementById("tpl_def_detail").innerHTML = "<p>证明：" + url + "</p>\n";

    document.getElementById("description").value = "该公司存在SQL注入";
    document.getElementById("repair_suggest").value = "对SQL敏感语句进行过滤"; //修复方案
    document.querySelector("input[name='anonymous']").checked = true; //是否匿名
}
window.onload = myfun;