// ==UserScript==
// @name         木马作业成绩导出
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  导出作业成绩，导出提交和未提交学生名单
// @author       chg
// @match        https://muma.com/teacherCenter/teacherManager/correct*
// @match        https://www.muma.com/teacherCenter/teacherManager/correct*
// @icon         https://www.google.com/s2/favicons?domain=muma.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.16.9/dist/xlsx.mini.min.js
// @grant        GM_addStyle
// @license MIT
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/437372/%E6%9C%A8%E9%A9%AC%E4%BD%9C%E4%B8%9A%E6%88%90%E7%BB%A9%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/437372/%E6%9C%A8%E9%A9%AC%E4%BD%9C%E4%B8%9A%E6%88%90%E7%BB%A9%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $(() => {
        (setTimeout(() => {

            //添加按钮
            var mybutton = document.createElement('div');
            mybutton.innerHTML = '<button id="myButton" type="button">' +
                '点击导出学生成绩</button>';
            mybutton.setAttribute('id', 'myContainer');
            document.body.appendChild(mybutton);

            document.getElementById("myButton").addEventListener(
                "click", ButtonClickAction, false
            );

            //添加按钮事件
            function ButtonClickAction(zEvent) {

                var htmls = "<table id='myTable'>";
                var list;
                var homeworkName = $("#app > div.gray-bg > div.content > div > div:nth-child(3) > div.box.clearfix > div.fixed-bar.left-box.absolute > div.top > p.name").text();
                var className = $("#app > div.gray-bg > div.content > div > div:nth-child(3) > div:nth-child(1) > ul > li.float-l.text-center.no-select.active").text();
                htmls += "<tr><td>"
                htmls += homeworkName;
                htmls += "</td></tr>"
                htmls += "<tr><td>"
                htmls += className;
                htmls += "</td></tr>"

                var exportName = className + homeworkName + "成绩.xlsx";
                $("div.fixed-bar.left-box.absolute > div.el-collapse").each(
                    function (index, element) {
                        list = $(this).text().split(' ');
                    }
                );
                var finalList = [];
                var notSub = false;
                var notGraded = false;
                for (var i = 0; i < list.length; i++) {

                    if (list[i] == "未批改")
                    {
                        notGraded = true;
                    }
                     if (list[i] == "已批改")
                    {
                        notGraded = false;
                    }

                    if (list[i] !== "" && !list[i].includes("未提交")) {
                        if (!notSub && !notGraded) {
                            finalList.push(list[i]);
                        }
                        else if (notGraded)
                        {
                            finalList.push(list[i]);
                            if(list[i] != "未批改" && isNaN(list[i]) ) {
                               finalList.push("未批改");
                            }
                        }
                        else {
                            finalList.push(list[i]);
                            finalList.push("未交");
                        }

                    } else if (list[i].includes("未提交")) {
                        var temp = list[i].split("未");
                        finalList.push(temp[0]);
                        finalList.push("未" + temp[1]);
                    }

                    if (finalList[finalList.length - 2] == "未提交") {
                        notSub = true;
                    }

                }

                for (i = 0; i < finalList.length; i++) {

                    htmls += "<tr><td>";
                    htmls += finalList[i];
                    htmls += "</td><td>";
                    htmls += finalList[i + 1];
                    htmls += "</td></tr>";
                    i++;
                }
                htmls += "</table>";
                //console.log(htmls);
                doit(htmls, 'xlsx', exportName);

            }

            //导出xlsx文件
            function doit(htmls, type, fn, dl) {

                var myTable = $("body").append(htmls);
                $("#myTable").css("display", "none");

                var elt = document.getElementById('myTable');
                var wb = XLSX.utils.table_to_book(elt, {sheet:"Sheet JS"});
                $("#myTable").remove();
                return dl ?
                    XLSX.write(wb, {bookType:type, bookSST:true, type: 'base64'}) :
                    XLSX.writeFile(wb, fn || ('SheetJSTableExport.' + (type || 'xlsx')));

            }
        }, 2000))
    })


            GM_addStyle(`
    #myContainer {
        position:               fixed;
        top:                   2%;
        left:                   30%;
        font-size:              20px;
        background:            #09ad85;
        border-radius:     12px;
        margin:                 auto;
        opacity:                0.9;
        z-index:                1100;
        padding:                10px 20px;

    }
    #myButton {
        cursor:                 pointer;
        background:            #09ad85;
        color: white;
    }
    #myContainer p {
        color:                  red;
        /*background:             white;*/
    }
`);

})();