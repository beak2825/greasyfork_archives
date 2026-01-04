// ==UserScript==
// @name         tecent sheet notify
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://docs.qq.com/sheet/DRWlJRXNZQ0JtQ0NX*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/376055/tecent%20sheet%20notify.user.js
// @updateURL https://update.greasyfork.org/scripts/376055/tecent%20sheet%20notify.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';
    let config={
        listencol:3,
        listenstr:'Y',
        notifycol:8,
        notifyemails:{
            李聪:'1358590898@qq.com',
            //李聪:'947428511@qq.com',
            cxp:'komson@qq.com',
            杨耿杰:'1428288353@qq.com',
            彭勤涵:'827005858@qq.com',
            王塔秋:'869740886@qq.com'
        }
    }
    SpreadsheetApp.spreadsheet.sheets[0].data.rowData[2].values[0].__proto__.setEditValue=function(e){
        console.log(this)
        //查找this行与列索引
        let rows=SpreadsheetApp.spreadsheet.sheets[0].data.rowData.length
        let cols=SpreadsheetApp.spreadsheet.sheets[0].data.rowData[0].values.length
        let rowindex=-1
        let colindex=-1
        let currentrow=null
        for(let r=0;r<rows;r++){
            let rowdata=SpreadsheetApp.spreadsheet.sheets[0].data.rowData[r]
            let finded=false
            for(let c=0;c<cols;c++){
                if(rowdata.values[c]==this){
                    finded=true
                    rowindex=r
                    colindex=c
                    currentrow=rowdata
                    console.log(r,c)
                    break;
                }
            }
            if(finded){
                break;
            }
        }
        if(colindex==config.listencol){
            if(e.indexOf(config.listenstr)>-1){
                let name=currentrow.values[config.notifycol].editValue
                let body='第'+(rowindex+1)+'行，字段'+currentrow.values[config.listencol+3].editValue+'已添加在版本'+currentrow.values[config.listencol+1].editValue+'，请查收'
                console.log('开始通知'+name,body)
                $.post( "https://api.huobizh.com//sendmailfrom126", { subject: body, content: body,tomail:config.notifyemails[name] } )
            }
        }
        //原代码
        return this.editValue = e,
        this
    }
    // Your code here...
})();