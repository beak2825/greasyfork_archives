// ==UserScript==
// @name         柠檬后宫排序
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Used for sorting lemon harem！
// @license      GPL-3.0 License
// @author       jgw163163
// @match        https://lemonhd.org/invite.php?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lemonhd.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447346/%E6%9F%A0%E6%AA%AC%E5%90%8E%E5%AE%AB%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/447346/%E6%9F%A0%E6%AA%AC%E5%90%8E%E5%AE%AB%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==
var biaoge = document.querySelector('td.embedded > table > tbody');//获取文档下的第一个tbdoy
var tr = document.querySelectorAll('td.embedded > table:nth-child(3) > tbody >tr');
var tr11 = document.querySelector('td.embedded > table > tbody >tr');
var tr22 = document.querySelector('td.embedded > table > tbody >tr:last-child');
Array.from(tr11.children).forEach((element, value) => {
    element.id = value;
});


var arr = [];
var isAsc = true; //判断当前排序是否是正序
tr11.onclick = (function (e) {
    var td = tr11.querySelectorAll('td');
    for (let x = 1; x < td.length; x++) {
        td[x].style.color = "";
    }
    e.target.id ? e.target.style.color = "red" : e.target.parentElement.style.color = "red";
    var f = e.target.id || e.target.parentElement.id;


    if (!isAsc) { //如果是反序，则进行一下操作
        for (var i = 1; i < tr.length - 1; i++) {
            arr.push(tr[i]); //把tr数组复制到arr数组
        }

        arr.sort(function (tr1, tr2) { //数组排序arr.sort()
            var value1 = tr1.getElementsByTagName('td')[f].innerHTML;
            var value2 = tr2.getElementsByTagName('td')[f].innerHTML;
            // console.log(sizeStrToBytes(value2))
            if (f > 2 && f < 9) {
                return sizeStrToBytes(value1) - sizeStrToBytes(value2); //比较字节大小
            } else {
                return value1.localeCompare(value2);//localeCompare() 方法提供的是比较字符串的方法，如果value2>value1,则返回1；如果value2<value1,则返回-1;相等则0
            }
        })
        Oinsert(); //进行文档添加操作
        isAsc = true; //点击之后反转一下顺序

    } else { //如果是正序，则进行一下操作
        for (var j = 1; j < tr.length - 1; j++) {
            arr.push(tr[j]);
        }
        // console.log(arr)
        arr.sort(function (tr1, tr2) {
            var value1 = tr1.getElementsByTagName('td')[f].innerHTML;
            var value2 = tr2.getElementsByTagName('td')[f].innerHTML;
            // console.log(sizeStrToBytes(value2))
            if (f > 2 && f < 9) {
                return sizeStrToBytes(value2) - sizeStrToBytes(value1);
            } else {
                return value2.localeCompare(value1);
            }

        });
        Oinsert();
        // console.log(arr)
        isAsc = false;
        arr = [];
    }
});

function Oinsert() { //向文档添加已排好序的节点
    var fragment = document.createDocumentFragment(); //当你想提取文档的一部分，改变，增加，或删除某些内容及插入到文档末尾可以使用createDocumentFragment() 方法
    for (var j = 0; j < arr.length; j++) {
        fragment.appendChild(arr[j]); //把数组中的元素添加到节点的子节点列表的末尾
    }

    biaoge.appendChild(fragment); //把fragment添加到tbody
    biaoge.appendChild(tr22);
}
function sizeStrToBytes(sizeStr) {

    var regex = /[+-]?\d+(\.\d+)?/g;
    var sizeStr2 = sizeStr.replace(/,/g, '');
    var num = sizeStr2.match(regex).map(function (v) {
        return parseFloat(v);
    });
    var size = 0;
    if (sizeStr.match(/(KB|KiB)/i)) {
        size = num * 1024;
    } else if (sizeStr.match(/(MB|MiB)/i)) {
        size = num * 1024 * 1024;
    } else if (sizeStr.match(/(GB|GiB)/i)) {
        size = num * 1024 * 1024 * 1024;
    } else if (sizeStr.match(/(TB|TiB)/i)) {
        size = num * 1024 * 1024 * 1024 * 1024;
    } else {
        size = num;
    }

    return size;
}
