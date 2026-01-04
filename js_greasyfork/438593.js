// ==UserScript==
// @name         企查查脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  企查查脚本,用于自动化搜索，导出XLSX
// @author       zh1q1
// @match        https://www.qcc.com/*
// @icon         https://www.youxiaohou.com/48x48.png
// @license      AGPL-3.0
// @require      https://cdn.staticfile.org/xlsx/0.15.1/xlsx.core.min.js
// @grant        none
// @note    2022.01-15-V0.1 init project
// @note    2022.01-16-V1.0 第一版
// @downloadURL https://update.greasyfork.org/scripts/438593/%E4%BC%81%E6%9F%A5%E6%9F%A5%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/438593/%E4%BC%81%E6%9F%A5%E6%9F%A5%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

//var sheet = window.localStorage.getItem('sheet') || [['中文名称','法定代表人','设立时间','注册资本','经营范围','直接股东','直接股东持股比例','董监高']]
//var searchDiv = document.querySelector('#searchKey');
//var searchBtn = document.querySelector('.btn');
//var company_array = ['厦门凯泰创新股权投资有限公司'];

(function() {
    'use strict';
    create_modal();

    if(location.pathname === '/') {
        // 主页
        create_xlsx();
        return false;
    }

    if(!window.localStorage.getItem('openTmk')) return false;

    if(location.pathname === '/web/search') {
        // 搜索页
        console.log('搜索页');
        openModal();
        setTimeout(() => {
            var current = decodeURIComponent(location.search.split('=')[1]);
            var a = [...document.querySelectorAll('a.copy-value')].filter(item => item.children[0].innerText == current)[0];
            a.target = '_self';
            a.click();
        },1500);

        return false;
    }

    if(location.pathname.includes('/firm')) {
        console.log('数据页');
        openModal();
        setTimeout(() => {
            pushItem();
        },1000);

        return false;
    }

    //create_xlsx();
    //search();
})();

// 字符串转ArrayBuffer
function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

// 导出XLSX
function export_XLSX(sheet) {
    var header = ['中文名称','法定代表人','设立时间','注册资本','经营范围','直接股东','直接股东持股比例','董监高']
    sheet.unshift(header)
    var ws = XLSX.utils.aoa_to_sheet(sheet)
    //console.log(ws)
    var workbook = {
        SheetNames: ['企查查信息'],
        Sheets: {
            '企查查信息': ws
        }
    };
    var wopts = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'
    };
    var wbout = XLSX.write(workbook, wopts);
    var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
    var url = URL.createObjectURL(blob);

    var a = document.createElement('a');
    //a.setAttribute("src", url);
    a.href = url;
    a.download = 'exportToQcc.xlsx';
    //a.style.position = "absolute";
    //a.style.top = "90px";
    //a.style.left = "30px";
    //a.style.fontSize = "18px";
    //a.style.color = "red";
    //a.style.border = "1px solid red";
    //a.innerHTML = '导出XLSX'
    document.body.appendChild(a)
    a.click();
    alert('exportToQcc.xlsx文件导出完毕！');
}

// 导入xlsx
function create_xlsx() {
    //var xlsxJs = document.createElement('script');
    //xlsxJs.src="https://cdn.staticfile.org/xlsx/0.15.1/xlsx.core.min.js";
    //document.body.appendChild(xlsxJs)

    var importFile = document.createElement('input');
    importFile.style.position = "fixed";
    importFile.style.top = "70px";
    importFile.style.left = "30px";
    importFile.style.zIndex = "9999";
    importFile.style.border = "1px solid blanchedalmond"
    importFile.style.backgroundColor = "blanchedalmond"
    importFile.setAttribute("type", "file");
    importFile.setAttribute("class", "file");
    importFile.addEventListener("change", function() {
        openModal();
        //console.log(document.querySelector(".file"))
        var obj = document.querySelector(".file");
        //alert("change")
        if(!obj.files) return
        // alert(obj.files[0].name);文件名
        var f = obj.files[0];
        var reader = new FileReader();

        reader.onload = function(e) {
            var data = e.target.result;
            var wb = XLSX.read(data, {
                type: 'binary' //以二进制的方式读取
            });

            var page = window.prompt('输入数据所在的XLSX页数', 1)
            //console.log(page);
            var sheetName = window.prompt('输入数据项目名（表头名）', '中文名')
            //console.log(sheetName);

            var sheet0=wb.Sheets[wb.SheetNames[page - 1]];//sheet0代表excel表格中的第一页
            var str=XLSX.utils.sheet_to_json(sheet0);//利用接口实现转换。
            //console.log(str);
            //var templates=new Array();
            //var str1=obj.files[0].name;
            //templates=str1.split(".");//将导入文件名去掉后缀
            var company_array = str.map((item) => item[sheetName])
            console.log("导入的企业清单：", JSON.stringify(company_array))
            console.log("导入文件长度：", company_array.length)
            var isOpen = window.confirm(`检测到 ${company_array.length} 条数据，是否开启脚本？`)
            if(isOpen) {
                window.localStorage.setItem('openTmk', 1);//存入Storage 中
                obj.style.display = "none"
                window.localStorage.setItem('qcc',JSON.stringify(company_array))//存入Storage 中
                search();
            }
            //alert(JSON.stringify(str));
        }
        reader.readAsBinaryString(f);
    })
    document.body.appendChild(importFile)
}

// 搜素
function search() {
    var companyList = JSON.parse(window.localStorage.getItem('qcc'));
    var first = companyList[0]
    console.log(first);
    if(!first){
        var sheet = JSON.parse(window.localStorage.getItem('sheet'));
        export_XLSX(sheet);
        window.localStorage.clear();
        location.replace('https://www.qcc.com/');
        return false;
    }
    companyList.splice(0,1);
    window.localStorage.setItem('qcc',JSON.stringify(companyList))//存入Storage 中

    //location.href = location.href + 'web/search?key=' + first
    location.replace('https://www.qcc.com/web/search?key=' + first);

    //searchDiv.value = company;
    //searchBtn.click();
    //pushItem();

    //export_XLSX(sheet);
}

// 整理数据push
function pushItem() {
    openModal();
    var fgf = '、' // 分隔符
    var sheet = JSON.parse(window.localStorage.getItem('sheet')) || [];
    // 企业信息
    var name = document.querySelector('.base-opertd').querySelector('.cont').querySelector('a').text;
    console.log('法定代表人', name);
    var td = document.querySelector('#cominfo').querySelectorAll('.tb')
    //console.log(td);
    var cname = document.querySelector('.copy-value').innerHTML
    console.log('企业名称', cname)
    var isClose = td[3].nextSibling.nextSibling.innerHTML.includes('注销')
    console.log('是否注销', isClose)
    var date = td[4].nextSibling.nextSibling.innerHTML
    console.log('登记时间', date)
    var money = td[5].nextSibling.nextSibling.innerHTML
    console.log('注册资金', money)
    var jyfw = td[td.length - 1].nextSibling.nextSibling.innerHTML
    console.log('经营范围', jyfw)
    // 股东信息
    var tr = [...document.querySelector('.app-tree-table').querySelector('.ntable').querySelectorAll('tr')];
    tr.splice(0,1); // 去掉表头
    //console.log(tr);
    var gd = []; // 股东列表
    var bl = []; // 比例
    //var je = [];
    tr.map(item => {
        gd.push(item.children[1].querySelector('.name').querySelector('a').innerText);
        bl.push(item.children[2].innerText.replace(/\n 持股详情 >/, ''));
    });
    //console.log(gd, bl);
    // 主要人员
    var djg = []; // 董监高人员列表
    if(document.querySelector('#mainmember')){
        var tr2 = [...document.querySelector('#mainmember').querySelector('.ntable').children];
        tr2.splice(0,1); // 去掉表头
        //console.log(tr2);
        tr2.map(item => {
            djg.push(item.children[2].innerText.replace(',法定代表人', '') + ':' + item.children[1].querySelector('.name').querySelector('a').innerText);
        });
    }

    sheet.push([cname, name, date, money, jyfw, gd.join(fgf), bl.join(fgf),djg.join(fgf)]);
    console.log(sheet);
    window.localStorage.setItem('sheet',JSON.stringify(sheet))//存入Storage 中
    search();
}

function create_modal() {
    var modal = document.createElement('div');
    var text = document.createElement('div');
    modal.style.backgroundColor= "rgba(0, 0, 0, 0.5)";
    modal.style.zIndex = "9999";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.height = "100%";
    modal.style.width = "100%";
    modal.style.display = "none";
    modal.setAttribute("class", "tmk_modal");
    text.innerHTML = "正在加载中..."
    text.style.textAlign = "center";
    text.style.fontSize = "18px";
    text.style.marginTop = "30%";
    text.style.color = "white";
    modal.appendChild(text)
    document.body.appendChild(modal)
}

/*
     打开遮罩
    */
function openModal() {
    var modal = document.querySelector(".tmk_modal");
    modal.style.display = "block";
    window.addEventListener("mousewheel", function(){});
    return true
}

/*
     关闭遮罩
    */
function closeModal() {
    var modal = document.querySelector(".tmk_modal");
    modal.style.display = "none";
    window.removeEventListener("mousewheel", function(){})
}
