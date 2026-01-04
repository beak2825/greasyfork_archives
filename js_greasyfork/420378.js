// ==UserScript==

// @require      http://libs.baidu.com/jquery/1.8.3/jquery.min.js
// @name         leetcode user case
// @namespace    http://tangmocd.cn/
// @version      0.1
// @description  create user case unit test in leetcode.com
// @author       kenybens@gmail.com
// @match        *://leetcode-cn.com/problems/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420378/leetcode%20user%20case.user.js
// @updateURL https://update.greasyfork.org/scripts/420378/leetcode%20user%20case.meta.js
// ==/UserScript==


(function () {
    'use strict';

    function addlight() {
        var node = document.createElement("div");
        node.id = "light"
        node.style = "display: none;" +
            "position: absolute;" +
            "top: 25%;" +
            "left: 25%;" +
            "width: 55%;" +
            "height: 55%;" +
            "padding: 20px;" +
            "border: 10px solid orange;" +
            "background-color: white;" +
            "z-index: 1002;" +
            "overflow: auto;"
        node.innerHTML = "code Example." +
            "<a href=\"javascript:void(0)\" " +
            " onclick=\"document.getElementById('light').style.display='none';document.getElementById('fade').style.display='none'\">Close Window</a>" +
            "<textarea name=\"lines\" rows=\"30\" cols=\"100\" id=\"contentid\"></textarea>";
        return node;
    }

    function addfade() {
        var node = document.createElement("div");
        node.id = "fade";
        node.style = "display: none;" +
            "position: absolute;" +
            "top: 0%;" +
            "left: 0%;" +
            "width: 100%;" +
            "height: 100%;" +
            "background-color: black;" +
            "z-index: 1001;" +
            "-moz-opacity: 0.8;" +
            "opacity: .20;" +
            "filter: alpha(opacity=88);"
        return node;
    }




    function getfunctionname(content) {
        //param: content include function name
        // return function name in code
        // eg. content=   def containsPattern(self, arr: List[int], m: int, k: int) -> bool:
        //     return:  containsPattern
        content = content.split("(")[0].replace("def", "").replace(" ", "").replace(/(^\s*)|(\s*$)/g, "");
        return content;

    }

    function addbutton() {
        //    add a link
        var node = document.createElement("div");
        node.style = "    display: flex;\n" +
            "    flex-wrap: nowrap;\n" +
            "    -webkit-box-align: center;\n" +
            "    align-items: center;"
        node.innerHTML =
            "<a href=\"javascript:void(0)\" " +
            " onclick=\"document.getElementById('light').style.display='block';document.getElementById('fade').style.display='block'\">Use Case Generate</a>";

        return node

    }
     function  createcontent(){

        //create content
         console.log("find language");
        var stra = $("#lang-select").find('span')[0].innerText;

        if (stra == 'Python3') {
            console.log(stra);
            var childs = $(".view-lines").children()
            if (childs.length == 2) {
                console.log('child of code len is 2')

                var contentlist = []
                contentlist.push("from typing import List")
                contentlist.push(childs[0].innerText.replace(/\xA0/g, " "));
                contentlist.push(childs[1].innerText.replace(/\xA0/g, " "));
                contentlist.push("        pass")
                contentlist.push("if __name__ == '__main__':");
                contentlist.push("    obj=Solution()")

                var funcname = getfunctionname($('div.view-lines > div:nth-child(2) > span')[0].innerText);

                var prelist = $(".notranslate pre")

                console.log(funcname);

                for (var i = 0; i < prelist.length; i++) {
                    var usercase = prelist[i].innerText;
                    usercase = usercase.replaceAll("：", ":").split("\n")


                    var content2 = "    print(obj." + funcname;
                    for (var j = 0; j < usercase.length; j++) {
                        console.log(usercase[j])

                        var intputlist = usercase[j].split(":")
                        if (intputlist.length == 2) {

                            if (j == 0) {

                                content2 += "(" + intputlist[1] + ')==';
                            } else if (j == 1) {

                                //change true-->True and false -->False
                                var result = intputlist[1].replaceAll("false", "False").replaceAll("true", "True");
                                content2 += result + ")";
                                contentlist.push(content2);
                                //create next node content
                                content2 = "    print(" + funcname;

                            }

                        }
                    }


                    document.getElementById("contentid").value = contentlist.join('\n');

                }
            }


        }

    }




    window.onload = function () {


        var appex = document.getElementById("app")
        appex.appendChild(addfade());
        appex.appendChild(addlight());

        var divmenu=document.getElementsByClassName("second-section-container__2cAh")[0]
        var downloadapp=document.getElementsByClassName("css-1y830sm-MockInterviewContainer e3jm4na1")[0]
        divmenu.insertBefore(addbutton(),downloadapp)

        createcontent()




    }
})();