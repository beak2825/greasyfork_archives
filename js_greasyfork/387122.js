// ==UserScript==
// @name         南信大自动同学互评
// @namespace    myetyet
// @version      0.2
// @description  南京信息工程大学奥兰学生管理信息系统同学互评自动填充满分
// @author       myetyet
// @match        http://stu.nuist.edu.cn/txxm/sthp.aspx?xq=*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387122/%E5%8D%97%E4%BF%A1%E5%A4%A7%E8%87%AA%E5%8A%A8%E5%90%8C%E5%AD%A6%E4%BA%92%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/387122/%E5%8D%97%E4%BF%A1%E5%A4%A7%E8%87%AA%E5%8A%A8%E5%90%8C%E5%AD%A6%E4%BA%92%E8%AF%84.meta.js
// ==/UserScript==

const mark1 = 6;
const mark2 = 5;
(function() {
    'use strict';
    var x = 1;
    var fail = 0;
    while (true){
        ++x;
        var iname = "MyDataGrid__ctl" + String(x) + "_cp";
        var ipt = document.getElementById(iname + "1_2"); // 思想道德修养 满分6分
        if (ipt){
            if (!ipt.value.length){
                ipt.value = mark1;
            }
            ipt = document.getElementById(iname + "2_2"); // 人生规划 满分6分
            if (!ipt.value.length){
                ipt.value = mark1;
            }
            ipt = document.getElementById(iname + "3_2"); // 学习态度 满分6分
            if (!ipt.value.length){
                ipt.value = mark1;
            }
            ipt = document.getElementById(iname + "4_2"); // 科学与人文素养 满分6分
            if (!ipt.value.length){
                ipt.value = mark1;
            }
            ipt = document.getElementById(iname + "5_2"); // 身心健康 满分6分
            if (!ipt.value.length){
                ipt.value = mark1;
            }
            ipt = document.getElementById(iname + "6_2"); // 创新及社会实践 满分5分
            if (!ipt.value.length){
                ipt.value = mark2;
            }
        } else {
            ++fail;
            if (fail == 2){
                break;
            }
        }
    }
})();