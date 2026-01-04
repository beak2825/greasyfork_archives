// ==UserScript==
// @name         wiki
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       huaxi li
// @match        http://wiki.fenqi.d.xiaonei.com/pages/*
// @require      https://cdn.bootcss.com/clipboard.js/2.0.1/clipboard.min.js
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/367763/wiki.user.js
// @updateURL https://update.greasyfork.org/scripts/367763/wiki.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var oWrapper = document.querySelectorAll('.wiki-content')[0];//主体
    var oUrlTitle = oWrapper.getElementsByTagName('h3')[1];//接口地址
    var oUrl = oUrlTitle.nextElementSibling;
    //console.log(oUrl);
    //var oUrl = document.querySelectorAll('font')[0];

    //oUrl.setAttribute('id', 'foo');
    var div = document.createElement('div');
    div.innerHTML = "<button id='c_btn'>点我复制接口</button>";
    //oUrl.parentNode.appendChild(div);
    oWrapper.insertBefore(div,oWrapper.getElementsByTagName('h3')[2]);
    //console.log(oUrl.parentNode.innerText);
    new ClipboardJS('#c_btn', {
        text: function(trigger) {
            return oUrl.innerText.replace("点我复制接口","");
        }
    });

    var aTable = document.querySelectorAll('.table-wrap');
    var aTables = aTable[0].getElementsByTagName('tbody');

    var classNameArr = ['x_aa','x_bb','x_cc','x_dd','x_ee','x_ff'];
    for (var index = 0; index < aTable.length; index++) {
        var aTr = aTable[index].getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        (function(index){
            for (var j = 0; j < aTr.length; j++) {
                addBtn(aTr[j],classNameArr[index]+j);
                //addBtn(aTr[index],'xx'+index);
            }
        })(index);
    }
    //console.log(aTable[0].getElementsByTagName('tbody')[0]);

    function addBtn(target,btn){
        var td = document.createElement('td');
        td.setAttribute('class','confluenceTd');
        td.innerHTML = "<button class='"+btn+"'>复制</button>";
        target.appendChild(td);
        new ClipboardJS('.'+btn, {
            text: function(trigger) {
                return target.children[0].innerText;
            }
        });
    }
})();