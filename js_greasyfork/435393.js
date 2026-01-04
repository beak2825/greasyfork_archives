// ==UserScript==
// @name         Automatic retroactive
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  try to take over the world!
// @author       xiaowei
// @match        *https://class.bigdata.ncvt.net*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license     
// @grant        none
// @require       https://code.jquery.com/jquery-3.6.0.min.js
// @require       https://cdn.bootcss.com/xlsx/0.11.5/xlsx.core.min.js
// @downloadURL https://update.greasyfork.org/scripts/435393/Automatic%20retroactive.user.js
// @updateURL https://update.greasyfork.org/scripts/435393/Automatic%20retroactive.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let xx = $("body");
    xx.append(`<input type="file" id="xiaowei"/>`);
    $("#xiaowei").css({position:"absolute",top:"10px",right:"203px"})
    xx.append(`<button id="zdbq">自动补签</button>`)
    $("#zdbq").css({position:"absolute",top:"10px",right:"209px"})
    $("#zdbq").click(()=>{
        let iframe = document.getElementById('I2').contentWindow;
        let main = iframe.document.querySelector("tbody")
        let trs = $(main).children();
        trs.each(function (){
            let doc1 = $(this).children().eq(1)
            let personId = $(this).children().eq(1).html();
            $.each(date,function (i,v){
               if(Number(v) == personId){
                    if(!doc1.prev().children().eq(0).is(":checked")){
                        doc1.prev().children().eq(0).click()
                    }
                }else {
                    console.log(false);
                }
            })
        })
    })
    function readWorkbookFromLocalFile(file, callback) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {type: 'binary'});
            console.log(workbook)
            if(callback) callback(workbook);
        };
        reader.readAsBinaryString(file);
    }
    let date = [];
    $("#xiaowei").change(function (e){
        let file = e.target.files;
        console.log(file[0])
        readWorkbookFromLocalFile(file[0],function (k){
            let listName = k.SheetNames[0]
            console.log(listName)
            $.each(k.Sheets[listName],function (){
                let xx = $(this)[0];
                if(xx){
                   date.push(xx.v);
                }

            })
        })
    })

})();