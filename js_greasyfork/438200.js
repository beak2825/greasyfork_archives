// ==UserScript==
// @name         sztu教务系统自动评教
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  zh-cn
// @author       2huo
// @match        https://jwxt.sztu.edu.cn/jsxsd/framework/xsMain.htmlx
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438200/sztu%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/438200/sztu%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    function find(){
    let timer = setInterval(()=>{
        var frame = document.getElementsByTagName("iframe")[1].contentDocument;
        console.log(frame);
        if(frame){
            let table = frame.getElementById("table1");
            if(table){
                let list = table.querySelectorAll("td[name='zbtd']");
                if(list){
                  console.log(list);
                  list[0].children[0].children[1].checked="checked";
                  for(let i = 1;i<list.length;i++){
                    list[i].children[0].children[0].checked="checked";
                  }
                  // clearInterval(timer);
                }
            }
            else{
                console.log("not found");
            }
        }else{
            console.log("not found");
        }
        },2000);
    }
    find();

})();