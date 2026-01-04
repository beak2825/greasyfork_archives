// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*.jd.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421169/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/421169/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var allArr = [];
    var button = null;
    var input = null;
    let time = setInterval(myFunction, 1000);

    function myFunction() {
        var addItem = document.getElementById("addItem");
        if (addItem) {
            if (!$("#btn-s").css("display")) {
                allArr = [];
                button = document.createElement("button");
                button.id = "btn-s";
                button.innerHTML = "自定义添加";
                button.style.marginRight = "30px";
                button.style.cursor = "pointer";
                button.style.color = "#3da8f5";
                input = document.createElement("textarea");
                input.id = "ipt";
                input.placeholder = "请输入货物名称/规格型号(添加多条请以英文逗号隔开)";
                input.style.marginRight = "30px";
                input.style.border = "1px solid #999";
                input.style.width = "800px";
                input.style.minHeight = "25px";
                input.style.lineHeight = "25px";
                input.style.borderRadius = "4px";
                input.style.paddingLeft = "15px";
                addItem.parentElement.insertBefore(button, addItem);
                addItem.parentElement.insertBefore(input, button);
            } else {
                $("#btn-s").click(function () {
                    var arr = [];
                    $("#addItem").click();
                    var goodsArr = document.getElementById("goodsSelect");
                    let arrValue = input.value.split(',');
                    arrValue.forEach(item => {
                        if (item) {
                            for (var i = 0; i < goodsArr.length; i++) {
                                if (goodsArr.options[i].value.indexOf(item) !== -1) {
                                    var res = allArr.findIndex(val => {
                                        return val === goodsArr.options[i].value
                                    });
                                    if (res === -1) {
                                        arr.push(goodsArr.options[i].value)
                                        allArr.push(goodsArr.options[i].value)
                                    };
                                }
                            }
                        }
                    })
                    arr.forEach(item => {
                        if (item) {
                            changeGoods(item);
                            $("#addItem").click();
                        }
                    })
                })
            }
        }
    }
})();