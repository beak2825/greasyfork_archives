// ==UserScript==
// @name         自动补签
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  发生的方式
// @author       xiaowei
// @match        *https://class.bigdata.ncvt.net*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      
// @grant        none
// @require       https://code.jquery.com/jquery-3.6.0.min.js
// @require       https://cdn.bootcss.com/xlsx/0.11.5/xlsx.core.min.js
// @downloadURL https://update.greasyfork.org/scripts/444994/%E8%87%AA%E5%8A%A8%E8%A1%A5%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/444994/%E8%87%AA%E5%8A%A8%E8%A1%A5%E7%AD%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let li="<span><input type='file' id='file' name='file'/><span/>"
    $('td[valign="top"]>table>tbody>tr>td').eq(1).append(li)
    $('#file').change(function (e) {
        var files = e.target.files;
        var fileReader = new FileReader();
        fileReader.onload = function (ev) {
            try {
                var data = ev.target.result,
                    workbook = XLSX.read(data, {
                        type: 'binary'
                    }), // 以二进制流方式读取得到整份excel表格对象
                    persons = []; // 存储获取到的数据
            } catch (e) {
                console.log('文件类型不正确');
                return;
            }

            // 表格的表格范围，可用于判断表头是否数量是否正确
            var fromTo = '';
            // 遍历每张表读取
            for (var sheet in workbook.Sheets) {
                if (workbook.Sheets.hasOwnProperty(sheet)) {
                    fromTo = workbook.Sheets[sheet]['!ref'];
                    console.log(fromTo);
                    persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                    break;
                    //如果只取第一张表，就取消注释这行
                }
            }
            console.log(persons);
            // for(var i=0;i<persons.length;i++){
            //     console.log(i,persons)

            // }
            var name_list = []
            var stunum_list = []
            // persons=[{ 班级: '20软件1班', 姓名: '蓝铁晨', 学号: '1602020133'},
            // { 班级: '20软件2班', 姓名: '李江桓', 学号: '2002040100'},
            // { 班级: '20软件4班', 姓名: '甘家君', 学号: '2002040113'},
            // { 班级: '20通信1班', 姓名: '陈金花', 学号: '2002110136'}]
            var persons_lenght = persons.length
            for (var i = 0; i < persons_lenght; i++) {
                name_list.push(persons[i]['姓名'])
                stunum_list.push(persons[i]['学号'])
            }
            var stuinfo = $('table tbody tr')
            var length = stuinfo.length
            var errors = []
            for (let i = 0; i < length; i++) {
                var stunum = stuinfo[i].cells[1].innerText
                var name = stuinfo[i].cells[2].innerText
                var stunumIndex = stunum_list.indexOf(stunum) >= 0
                var nameIndex = name_list.indexOf(name) >= 0
                if (stunumIndex && nameIndex) {
                    console.log('yes')
                    $(stuinfo[i].cells[0]).children(1).click()

                } else {
                    var errname = stuinfo[i].cells[2].innerText
                    var errstunum = stuinfo[i].cells[1].innerText
                    var errlist = []
                    errlist.push(errname)
                    errlist.push(errstunum)
                    errors.push(errlist)
                }
            }
        };
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0]);
    });
})();