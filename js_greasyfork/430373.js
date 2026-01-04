// ==UserScript==
// @name         设置快捷键
// @namespace    coderWyh
// @version      1.0.3
// @description  This script is only for Chinese mainland users. The script function is to help Beijing Construction Research Company set up excel forms with one click
// @author       coderWyh
// @match        http://www.gczl360.com:8084/Admin/ZLKGL/Template*
// @run-at       document-end
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// ==/UserScript==
// 本代码所有权归作者所有 作者QQ：2471630907 手机号：18990193572  微信同手机号
// 本代码具有知识产权 未经作者授权严禁任何人进行使用、传播、二次开发等一系列损害作者知识产权的操作
// 作者对未经授权的操作保留起诉但不仅限于起诉的维护个人知识产权利益的法律途径
(function() {
    'use strict';
    let valueList = []
    let attrValue ;
    axios.post(BASEURL+'jky/value/getCodeValue/'+ShortcutButtonCode)
        .then(response =>{
        if (response.data.success) {
            valueList = response.data.data.valueList
            let Index = 2;
            attrValue = response.data.data.functionName
            valueList.forEach((item,index,arr) => {
                if(index%2==0){
                    $(".record_box>.slimScrollDiv").append("<div value='"+item.value+"' style='top:"+Index*7+"%;left: 2%' class='"+item.className+"'>"+item.name+"</div>")
                    Index++
                }else {
                    $(".record_box>.slimScrollDiv").append("<div value='"+item.value+"' style='top:"+((Index-1)*7)+"%;left: 40%' class='"+item.className+"'>"+item.name+"</div>")
                }
            })
            $('.kjj').on('click', function() {
                spread.suspendPaint();
                let value=$(this).attr(attrValue+'')
                let sheetIndex=spread.getActiveSheetIndex()
                let sheet = spread.getActiveSheet()
                let selections = sheet.getSelections()
                let spanRow,spanCol
                selections.forEach(item => {
                    for(let i = 0; i < item.rowCount; i++) {
                        for(let j = 0; j < item.colCount; j++) {
                            let span = sheet.getSpan(item.row + i, item.col + j)
                            if (span != null) {
                                if(typeof(spanRow) === 'undefined') {
                                    spanRow = span.row + span.rowCount
                                    spanCol = span.col + span.colCount
                                    addAttr(sheetIndex,item.row + i,item.col + j,value,"")
                                } else if (spanRow&&(item.row + i<spanRow)&&(item.col +j <spanCol)) {
                                    continue
                                } else {
                                    spanRow = span.row + span.rowCount
                                    spanCol = span.col + span.colCount
                                    addAttr(sheetIndex,item.row + i ,item.col + j ,value,"")
                                }
                            } else {
                                addAttr(sheetIndex,item.row + i,item.col + j,value,"")
                            }
                            let style = sheet.getStyle(item.row + i, item.col + j)
                            style.backColor = '#FFFFFF'
                            sheet.setText(item.row + i, item.col + j,'')
                            sheet.setStyle(item.row + i, item.col + j,style)
                        }
                    }
                })
                spread.resumePaint();
                layer.msg("设置成功", {
                    time: 1300
                });
            });

            $('.kjj_sign').on('click', function() {
                spread.suspendPaint();
                let value=$(this).attr(attrValue+'')
                let sheetIndex=spread.getActiveSheetIndex()
                let sheet = spread.getActiveSheet()
                let selections = sheet.getSelections()
                let spanRow,spanCol
                selections.forEach(item => {
                    for(let i = 0; i < item.rowCount; i++) {
                        for(let j = 0; j < item.colCount; j++) {
                            let span = sheet.getSpan(item.row + i, item.col + j)
                            if (span != null) {
                                if(typeof(spanRow) === 'undefined') {
                                    spanRow = span.row + span.rowCount
                                    spanCol = span.col + span.colCount
                                    addAttr(sheetIndex,item.row + i,item.col + j,value,"sign")
                                } else if (spanRow&&(item.row + i<spanRow)&&(item.col +j <spanCol)) {
                                    continue
                                } else {
                                    spanRow = span.row + span.rowCount
                                    spanCol = span.col + span.colCount
                                    addAttr(sheetIndex,item.row + i ,item.col + j ,value,"sign")
                                }
                            } else {
                                addAttr(sheetIndex,item.row + i,item.col + j,value,"sign")
                            }
                            let style = sheet.getStyle(item.row + i, item.col + j)
                            style.backColor = '#FFFFFF'
                            sheet.setText(item.row + i, item.col + j,'')
                            sheet.setStyle(item.row + i, item.col + j,style)
                        }
                    }
                })
                spread.resumePaint();
                layer.msg("签名设置成功", {
                    time: 1300
                });
            });
            function addAttr(sheetIndex,row,col,value,type) {
                let flag = true
                attrArray.forEach(item => {
                    if (item.sheetIndex === sheetIndex && item.row === row && item.col === col) {
                        item.value = value
                        item.type = type
                        flag = false
                        return
                    }
                })
                if (flag) {
                    attrArray.push({sheetIndex: sheetIndex,row: row,col: col,value: value,type: type})
                }
            }
        } else {
            $(".record_box>.slimScrollDiv").append("<div style='position:absolute;top:40%;left:2%;background-color:red;border:1px;text-transform: uppercase;font-size: 14px;padding: 5px 10px;font-weight: 300;color:white' class='tips'>"+response.data.message+ShortcutButtonCode+"</div>")

        }
    })
        .catch(error =>{
        console.log(error);
    })
 
})();