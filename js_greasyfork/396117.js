// ==UserScript==
// @name       GreatNJUjiaowu
// @description 南京大学教务网增强
// @namespace  NJUjiaowu
// @match      *://elite.nju.edu.cn/jiaowu/student/studentinfo/achievementinfo.do*
// @grant      none
// @require    https://cdn.bootcss.com/jquery/3.4.1/jquery.slim.min.js 
// @require    https://cdn.bootcss.com/xlsx/0.15.1/xlsx.mini.min.js
// @author     Gerrard_Mao
// @version     1.0
// @license      MIT
// @supportURL https://github.com/yp51md/GreatNJUjiaowu
// @downloadURL https://update.greasyfork.org/scripts/396117/GreatNJUjiaowu.user.js
// @updateURL https://update.greasyfork.org/scripts/396117/GreatNJUjiaowu.meta.js
// ==/UserScript==
(function () {
    'use strict';
    //删除html标记	
    function delHtmlTag(str) {
        return str.replace(/<[^>]+>/g, "");
    }
    // 删除空格
    function delSpace(str) {
        return str.replace(/\s*/g, "");
    }

    function arr2workbook(arr) {
        var sheet = XLSX.utils.aoa_to_sheet(arr);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, sheet, term);
        return wb;
    }
    
    // 将workbook装化成blob对象 参考 https://juejin.im/post/5d1dc5cbe51d45775f516ad0
    function workbook2blob(workbook) {
        // 生成excel的配置项
        var wopts = {
            // 要生成的文件类型
            bookType: "xlsx",
            // // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
            bookSST: false,
            type: "binary"
        };
        var wbout = XLSX.write(workbook, wopts);
        // 将字符串转ArrayBuffer
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
            return buf;
        }
        var blob = new Blob([s2ab(wbout)], {
            type: "application/octet-stream"
        });
        return blob;
    }

    //array to excel and give download url
    function downloadExcel(courses) {
        var wb = arr2workbook(courses);
        var blob = workbook2blob(wb);
        var fileName = "成绩单.xlsx";
        if (typeof blob == "object" && blob instanceof Blob) {
            blob = URL.createObjectURL(blob); // 创建blob地址
        }
        var aLink = document.createElement("a");
        aLink.href = blob;
        aLink.download = fileName || "";
        aLink.click();
        URL.revokeObjectURL(blob);
    }
    
    //学期
    var divs = $("div");
    var term = delSpace(delHtmlTag(divs[7].innerHTML));
    
    //课程
    var courses = [];
    var tableHtml = $("table.TABLE_BODY tbody tr").each(function () {
        var arr = [];
        $(this).children().each(function () {
            arr.push(delSpace($(this).text()));
        });
        courses.push(arr);
    });
    
    //下载按钮
    var button=$( ":button" );
    var buttonText = '<input type="button" style="font-size:12px;border: #7b9ebd 1px solid;padding:1px;text-align:center;width:90px;" onClick="window.execute();" value="下载Excel"></input>';
    window.execute = function(){
        downloadExcel(courses);
    };
    button.after(buttonText);


})();