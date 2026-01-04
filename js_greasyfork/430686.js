// ==UserScript==
// @name         HDC魔力值详情
// @namespace    http://tampermonkey.net/
// @version      1.0.8
// @description  HDC魔力值详情查看!
// @author       sparing
// @match     *://*.hdchina.org/*
// @match     *://hdchina.org/*
// @match        *://*/*
// @grant        GM_xmlhttpRequest

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/430686/HDC%E9%AD%94%E5%8A%9B%E5%80%BC%E8%AF%A6%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/430686/HDC%E9%AD%94%E5%8A%9B%E5%80%BC%E8%AF%A6%E6%83%85.meta.js
// ==/UserScript==

//种子数
let num = 0
//魔力值总值
let sum = 0
let numSum = 0
var datas;

function delay() {
    return new Promise((resolve) => {
        setTimeout(resolve, 200);
    });
}

function queryStocks() {
    $('.normal_tab').attr('id','tableId');//替换成一个新class
    let stocks = document.querySelectorAll('tr');
    numSum = stocks.length;
    //console.log(stocks.length);

    //stocks.forEach(async(s) => {
        //await delay();
    stocks.forEach(s => {

        let fc = s.firstChild;
        let lc = s.lastChild;
        //console.log(fc.nodeName+"-----"+fc.className);
        if (fc.nodeName === '#text') {
            var types=new Array("string","int","float","float","int","float","float","float","float")

            let element = document.createElement("td");
            element.className="colhead";
            let newContent = document.createTextNode("种子名");
            element.appendChild(newContent);

            element.setAttribute("style","cursor:pointer");
            s.insertBefore(element,s.children[0]);

            s.children[2].addEventListener('click', function (e) {
                sortAble(this,'tableId', 0,2,types[2]);
            });
            s.children[3].addEventListener('click', function (e) {
                sortAble(this,'tableId', 0,3,types[3]);
            });
            s.children[4].addEventListener('click', function (e) {
                sortAble(this,'tableId', 0,4,types[4]);
            });
            s.children[6].addEventListener('click', function (e) {
                sortAble(this,'tableId', 0,6,types[6]);
            });
            s.children[7].addEventListener('click', function (e) {
                sortAble(this,'tableId', 0,7,types[7]);
            });
            s.children[8].addEventListener('click', function (e) {
                sortAble(this,'tableId', 0,8,types[8]);
            });
            s.children[8].setAttribute("id","moliSum");

            for (var m = 0; m < s.children.length; ++m) {

                s.children[m].setAttribute("style","cursor:pointer");
                //s.children[m].addEventListener('click', function (e) {
                //    sortAble(this,'tableId', 0,m,types[m]);
                //});
            }


        }
        if (fc.nodeName === 'TD') {
            setPageTitle(s);
            // return;
        }
    });
}


function setPageTitle(s) {

    let fc = s.firstChild;
    let lc = s.lastChild;
    let url ="https://www.hdchina.org/details.php?id="+fc.innerHTML+"&hit=1";
    console.log("----------------------------"+fc.innerHTML+"-----------------------------------");
    let element = document.createElement("a");
    element.href=url;
    element.className="moli"+fc.innerHTML;
    element.name="moliName";

    //魔力值总值计算
    let moli = lc.previousSibling.innerHTML;
    sum = parseFloat(sum)+parseFloat(moli)
    if(num == 9){
        sum+= 10;
    }

    //此处魔力值显示加在表格上
    //let moliSum = document.getElementById("moliSum");
    //moliSum.innerHTML = '实际收益/时：'+sum;
    //moliSum.style.color = "red";

    if(numSum == (num+2)){
        let moliSum = document.querySelectorAll('h2');

        let element = document.createElement("span");
        element.style.color = "green";
        let newContent = document.createTextNode("（收益/时："+sum+"）");
        element.appendChild(newContent);
        moliSum[0].appendChild(element);

    }


    //种子名添加格子，获取、填充数据
    let newTd = fc.cloneNode(); // only copy data in <></>, don't include text
    //获取资源详情
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        async: true,
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(response) {
            let dom = $.parseHTML(response.responseText);
            let srcTitle0 = $(dom).find('div .m_name h3')[0].innerHTML;
            let newContent = document.createTextNode(srcTitle0);
            newTd.appendChild(element).appendChild(newContent)
            s.insertBefore(newTd,s.childNodes[0]);
            //判断页面列数据是否添加完全，之后触发排序点击事件
            let moliNames = document.getElementsByName('moliName');
            if(moliNames.length == numSum -1){
                var moliSum0 = document.getElementById("moliSum");
                moliSum0.click();
                moliSum0.click();
            }
        },
    });


    num++;
}


//排序 tableId: 表的id,iCol:第几列 ；dataType：iCol对应的列显示数据的数据类型
function sortAble(th1, tableId, iRow, iCol, dataType) {

    var ascChar = "▲";
    var descChar = "▼";

    var table = document.getElementById("tableId");
    //var rows = table.tHead.rows;
    let rows = document.querySelectorAll('tr')
    //排序标题加背景色
    for (var i = 0; i < rows.length; i++) {
        for(var j=0;j<rows[i].cells.length;j++){//取得第几行下面的td个数，再次循环遍历该行下面的td元素
            var th2 = rows[i].cells[j];
            var thText= th2.innerHTML.replace(ascChar, "").replace(descChar, "");
            if(i==iRow&&j==iCol){
            }
            else{
                th2.innerHTML=thText;
            }
        }
    }

    var tbody = table.tBodies[0];
    //var tbody = document.querySelectorAll('.normal_tab').tBodies[0]
    var colRows = document.querySelectorAll('tr')
    var aTrs = new Array;

    //将得到的行放入数组，备用
    for (var h = 1; h < colRows.length; h++) {
        aTrs.push(colRows[h]);
    }

    //判断上一次排列的列和现在需要排列的是否同一个。
    if (table.sortCol == iCol) {
        aTrs.reverse();
    } else {
        //如果不是同一列，使用数组的sort方法，传进排序函数
        aTrs.sort(compareEle(iCol, dataType));
    }

    var oFragment = document.createDocumentFragment();
    for (var k = 0; k < aTrs.length; k++) {
        oFragment.appendChild(aTrs[k]);
    }
    tbody.appendChild(oFragment);

    //记录最后一次排序的列索引
    table.sortCol = iCol;

    //给排序标题加“升序、降序” 小图标显示
    var th = rows[iRow].cells[iCol];

    if (th.innerHTML.indexOf(ascChar) == -1 && th.innerHTML.indexOf(descChar) == -1) {
        th.innerHTML += ascChar;
        //alert(th.innerHTML);
    }
    else if (th.innerHTML.indexOf(ascChar) != -1) {
        th.innerHTML=th.innerHTML.replace(ascChar, descChar);
        //alert(th.innerHTML.replace(ascChar,descChar));

    }
    else if (th.innerHTML.indexOf(descChar) != -1) {
        th.innerHTML=th.innerHTML.replace(descChar, ascChar);
    }

}

//将列的类型转化成相应的可以排列的数据类型
function convert(sValue, dataType) {
    switch (dataType) {
        case "int":
            return parseInt(sValue, 10);
        case "float":
            return parseFloat(sValue);
        case "date":
            return new Date(Date.parse(sValue));
        case "string":
        default:
            return sValue.toString();
    }
}

//排序函数，iCol表示列索引，dataType表示该列的数据类型
function compareEle(iCol, dataType) {
    return function (oTR1, oTR2) {

        var vValue1 = convert(removeHtmlTag($(oTR1.cells[iCol]).html()), dataType);
        var vValue2 = convert(removeHtmlTag($(oTR2.cells[iCol]).html()), dataType);
        if (vValue1 < vValue2) {
            return -1;
        }
        else {
            return 1;
        }

    };
}

//去掉html标签
function removeHtmlTag(html) {
    return html.replace(/<[^>]+>/g, "");
}

(function () {
    'use strict';
    var host = window.location.host
    var href = window.location.href
    setTimeout(function() {
        var hdc = document.getElementsByClassName('userinfort')[0]
        if(hdc) {
            var hdchinaSign = hdc.getElementsByTagName('a')[1]
            }

        if (host.indexOf('hdchina') != -1 ) {
            let moli = document.querySelectorAll('p');
            //let url1 = urls[1].children[3];
            // alert(urls[1]);


            let element = document.createElement("a");
            element.href="https://www.hdchina.org/mybonus_detail.php";
            element.style.color = "green";
            let newContent = document.createTextNode("魔力详情][");
            element.appendChild(newContent);

            moli[1].insertBefore(element,moli[1].children[3]);
        }

        if (href.startsWith('https://hdchina.org/mybonus_detail.php') || href.startsWith('https://www.hdchina.org/mybonus_detail.php')) {
            queryStocks();
        }
    }, 500)
})();