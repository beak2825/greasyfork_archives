// ==UserScript==
// @name         uzz教学任务查询
// @namespace    https://blog.csdn.net/weixin_43881375
// @version      1.0.2
// @description  此脚本用于uzz教务管理系统中的教学任务查询时点击按钮即可快速查询上上学期、上学期、本学期和下学期的教学任务,解决学期选择下拉框找半天才能找对的问题。应用此脚本后，会在原来页面“查询”按钮的前面新增“上上学期”、“上学期”、“本学期”和“下学期”几个按钮。点击按钮即可实现快速查询上上学期、上学期、本学期和下学期的教学任务的功能。前提是已经登录教务管理系统。说明：每年2月、9月开始新学期，每年1、6、7、8、12月才会显示“下学期”查询按钮。
// @author       sunshiyi
// @match        jwgl.uzz.edu.cn/jwglxt/bbdy/jxrwxx_cxJxrwxxIndex.html?*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496595/uzz%E6%95%99%E5%AD%A6%E4%BB%BB%E5%8A%A1%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/496595/uzz%E6%95%99%E5%AD%A6%E4%BB%BB%E5%8A%A1%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var button = document.createElement("button"); //创建一个按钮
    button.textContent = "本学期"; //按钮内容
    button.style.color = "white"; //按钮文字颜色
    button.style.background = "#337ab7"; //按钮背景颜色
    button.style.align = "center"; //文本居中
    button.style.width = "60px"; //按钮宽度
    button.style.height = "30px"; //按钮高度
    button.style.border = "1px solid #337ab7"; //边框属性
    button.style.borderRadius = "3px"; //按钮四个角弧度
    button.style.marginRight = "5px"; //按钮右侧间距
    button.addEventListener("click", clickBotton0); //监听按钮点击事件

    var button_pre = document.createElement("button"); //创建一个按钮
    button_pre.textContent = "上学期"; //按钮内容
    button_pre.style.color = "white"; //按钮文字颜色
    button_pre.style.background = "#337ab7"; //按钮背景颜色
    button_pre.style.align = "center"; //文本居中
    button_pre.style.width = "60px"; //按钮宽度
    button_pre.style.height = "30px"; //按钮高度
    button_pre.style.border = "1px solid #337ab7"; //边框属性
    button_pre.style.borderRadius = "3px"; //按钮四个角弧度
    button_pre.style.marginRight = "5px"; //按钮右侧间距
    button_pre.addEventListener("click", clickBottonPre); //监听按钮点击事件

    var button_next = document.createElement("button"); //创建一个按钮
    button_next.textContent = "下学期"; //按钮内容
    button_next.style.color = "white"; //按钮文字颜色
    button_next.style.background = "#337ab7"; //按钮背景颜色
    button_next.style.align = "center"; //文本居中
    button_next.style.width = "60px"; //按钮宽度
    button_next.style.height = "30px"; //按钮高度
    button_next.style.border = "1px solid #337ab7"; //边框属性
    button_next.style.borderRadius = "3px"; //按钮四个角弧度
    button_next.style.marginRight = "5px"; //按钮右侧间距
    button_next.addEventListener("click", clickBottonNext); //监听按钮点击事件

    var button_pre_pre = document.createElement("button"); //创建一个按钮
    button_pre_pre.textContent = "上上学期"; //按钮内容
    button_pre_pre.style.color = "white"; //按钮文字颜色
    button_pre_pre.style.background = "#337ab7"; //按钮背景颜色
    button_pre_pre.style.align = "center"; //文本居中
    button_pre_pre.style.width = "70px"; //按钮宽度
    button_pre_pre.style.height = "30px"; //按钮高度
    button_pre_pre.style.border = "1px solid #337ab7"; //边框属性
    button_pre_pre.style.borderRadius = "3px"; //按钮四个角弧度
    button_pre_pre.style.marginRight = "5px"; //按钮右侧间距
    button_pre_pre.addEventListener("click", clickBottonPrePre); //监听按钮点击事件

    var date = new Date();
    var yyyy = date.getFullYear(); //获取年份(4位)
    var mm = date.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    var term_now = "";
    var term_pre = "";
    var term_next = "";
    var term_pre_pre = "";
    if (mm >= 9){ //每年2月、9月开始新学年第一学期
        term_now = ""+ yyyy + "-3";
        term_pre = ""+ (yyyy-1) + "-12";
        term_next = ""+ yyyy + "-12";
        term_pre_pre = ""+ (yyyy-1) + "-3";
    } else if (mm == 1){ //每年1月属于前一年的新学年第一学期
        term_now = ""+ (yyyy-1) + "-3";
        term_pre = ""+ (yyyy-2) + "-12";
        term_next = ""+ (yyyy-1) + "-12";
        term_pre_pre = ""+ (yyyy-2) + "-3";
    } else {
        term_now = ""+ (yyyy-1) + "-12";
        term_pre = ""+ (yyyy-1) + "-3";
        term_next = ""+ (yyyy) + "-3";
        term_pre_pre = ""+ (yyyy-2) + "-12";
    }

    var term="";
    function clickBotton(){
        setTimeout(function(){
            var span="";
            //遍历下拉框设置默认选中项
            function setVal(selectId ,value){
                var select = document.getElementById(selectId);
                var ops = select.options;
                for(var i=0;i<ops.length; i++){
                    var temp = ops[i].value;
                    if(temp == value) {
                        ops[i].selected = true;
                        span = ops[i].text;
                        break;
                    }
                }
            }
            setVal('beginXnxq',term); //设置起始学期
            document.querySelector('#beginXnxq_chosen a span').innerText=span; //设置起始学期的显示
            setVal('endXnxq',term); //设置终止学期
            document.querySelector('#endXnxq_chosen a span').innerText=span; //设置终止学期的显示
            document.getElementById("search_go").click(); //点击查询按钮
        },100); //setTimeout 0.1秒后执行
    }

    function clickBotton0(){
        term = term_now;
        clickBotton();
    }
    function clickBottonPre(){
        term = term_pre;
        clickBotton();
    }
    function clickBottonNext(){
        term = term_next;
        clickBotton();
    }
    function clickBottonPrePre(){
        term = term_pre_pre;
        clickBotton();
    }

    var div_search = document.querySelector('#searchBox div');
    var bt_search = document.getElementById("search_go");
	if (mm == 1 || mm == 12 || mm == 6 || mm == 7 || mm == 8){ //每年1、6、7、8、12月显示“下学期”查询按钮
		div_search.insertBefore(button_next, bt_search);
		div_search.insertBefore(button, button_next);
	} else {
		div_search.insertBefore(button, bt_search);
	}
	div_search.insertBefore(button_pre, button);
	div_search.insertBefore(button_pre_pre, button_pre);
})();
