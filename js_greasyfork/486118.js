// ==UserScript==
// @name         三思数独单元格取消全选
// @namespace    yournamespace
// @version      1.0
// @description  三思数独单元格取消全选, 方便一些用户的习惯
// @match        http*://*.12634.com/*
// @match        file:///*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486118/%E4%B8%89%E6%80%9D%E6%95%B0%E7%8B%AC%E5%8D%95%E5%85%83%E6%A0%BC%E5%8F%96%E6%B6%88%E5%85%A8%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/486118/%E4%B8%89%E6%80%9D%E6%95%B0%E7%8B%AC%E5%8D%95%E5%85%83%E6%A0%BC%E5%8F%96%E6%B6%88%E5%85%A8%E9%80%89.meta.js
// ==/UserScript==

(function() {
    // setInterval(sudoku_cell_deselect_all, 1000); // 每秒运行一次 sudoku_cell_deselect_all 函数

    if (sl.sel_ipt) {
        console.log("Original function found, modifying...");
        sl.sel_ipt= function (id) {
            var element = document.getElementById(id);
            element.focus();
            //element.select();
        }
    }

    var arr_cfg = [
    "div.cell_box > input"
    ];

    function sudoku_cell_deselect_all() {
        for (var item of arr_cfg) {
            var myNodelist = document.querySelectorAll(item);
            myNodelist.count
            for (var i = 0; i < myNodelist.length; i++) {
                var myNode = myNodelist[i]
                if (myNode.onkeyup) {
                    // console.log(myNode.onkeyup.toString())
                    console.log(myNode.getAttribute("onkeyup"))
                    // myNode.setAttribute('onkeyup', myNode.getAttribute("onkeyup")+";this.setSelectionRange(0, 0)")
                    // 刷新以强制重新加载修改后的 sl.sel_ipt
                    var org_onkeyup = myNode.getAttribute("onkeyup")
                    myNode.setAttribute('onkeyup', "")
                    myNode.setAttribute('onkeyup', org_onkeyup+";this.setSelectionRange(0, 0)")
                }
            }
        }
    }
    sudoku_cell_deselect_all()
})();