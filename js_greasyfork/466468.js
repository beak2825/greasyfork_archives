// ==UserScript==
// @name         获取知网期刊页面书籍名称、复合影响因子、综合影响因子
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  获取知网期刊页面书籍名称、复合影响因子、综合影响因子；并生成Excel文件
// @author       BigHan
// @match        https://navi.cnki.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnki.net
// @grant        none
// @license      BH
// @downloadURL https://update.greasyfork.org/scripts/466468/%E8%8E%B7%E5%8F%96%E7%9F%A5%E7%BD%91%E6%9C%9F%E5%88%8A%E9%A1%B5%E9%9D%A2%E4%B9%A6%E7%B1%8D%E5%90%8D%E7%A7%B0%E3%80%81%E5%A4%8D%E5%90%88%E5%BD%B1%E5%93%8D%E5%9B%A0%E5%AD%90%E3%80%81%E7%BB%BC%E5%90%88%E5%BD%B1%E5%93%8D%E5%9B%A0%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/466468/%E8%8E%B7%E5%8F%96%E7%9F%A5%E7%BD%91%E6%9C%9F%E5%88%8A%E9%A1%B5%E9%9D%A2%E4%B9%A6%E7%B1%8D%E5%90%8D%E7%A7%B0%E3%80%81%E5%A4%8D%E5%90%88%E5%BD%B1%E5%93%8D%E5%9B%A0%E5%AD%90%E3%80%81%E7%BB%BC%E5%90%88%E5%BD%B1%E5%93%8D%E5%9B%A0%E5%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function import_js(src) {
        let script = document.createElement('script');
        script.src = src;
        document.head.appendChild(script);
    }
    import_js('https://unpkg.com/xlsx/dist/xlsx.full.min.js');

    var resuleList = [];
    var size = 0;
    var num = 0;
    var button = document.createElement('button');
    //定义input的属性，即相当于
    button.className = 'butStyle';
    button.style.width="80px";
    button.style.hight="60px";
    button.style.position="fixed";
    button.style.top="20%";
    button.style.right="5px";
    button.style.align="center";
    button.style.borderRadius = '15px';
    button.style.background="rgb(222 225 205)";
    button.innerHTML = 'Download';
    var timeid;
    button.onclick = function() {
        var data = getData();
        // 循环执行：
        timeid = window.setInterval(turnPage,'4000');
    }
    //翻页
    function turnPage(){
        if(num < size){
            //console.log(resuleList);
            getData();
        }else{
            //清除定时器
            console.log('总条数：'+size+'  ,  页码： '+num);
            window.clearInterval(timeid);
            createExcel(resuleList);
            resuleList = [];
        }

    }
    //拼接数据源
    function getData(){
        let pageCheck = document.getElementsByClassName('pageCheck')[0];
        let pageSize = pageCheck.getElementsByTagName('em')[1].innerText;
        if(size == 0){
            size = pageSize;
        }
        let list_tup = document.getElementsByClassName('list_tup');
        var dataList = list_tup[0].getElementsByTagName('li');
        for (var i = 0; i < dataList.length; i++) {
            //console.log(dataList[i].innerText);
            var ps = dataList[i].getElementsByTagName('p');
            var d0 = dataList[i].getElementsByTagName('h1')[0].innerText;
            var d1 = ps[0].innerText.substr(ps[0].innerText.lastIndexOf('：')+1);
            var d2 = ps[1].innerText.substr(ps[1].innerText.lastIndexOf('：')+1);
            var row = {'书名':d0,'复合影响因子':d1,'综合影响因子':d2};
            resuleList.push(row);
        }
        num += 1;
        Submit.pageTopTurn($(".toolsbar .butR"), 1);
        //console.log(resuleList)
        return resuleList;
    }
    //生成Excel文件
    function createExcel(data){
        // 生成excel方法一
        let ws = XLSX.utils.json_to_sheet(resuleList);//将json转成表对象
        var workbook = { //定义操作文档
            SheetNames: ['sheet'],// 定义表明
            Sheets: {'sheet': ws} //表对象[注意表明]
        };
        XLSX.write(workbook,{bookType: 'xlsx',bookSST:true, type:"base64"});
        XLSX.writeFile(workbook,"数据.xlsx");//导出文件

        // // 生成excel方法二
        // let sheet=XLSX.utils.json_to_sheet(resuleList);
        // book=XLSX.utils.book_new();
        // // sheet1表示要导出的分区名字
        // XLSX.utils.book_append_sheet(book,sheet,"sheet1");
        // console.log("book",book);
        // // user开头加时间戳的文件名，可以修改成其它名字
        // XLSX.writeFile(book,`user${(new Date()).getTime()}.xls`);
    }

    setTimeout(() => {
        document.body.appendChild(button);
    }, 1000);

})();