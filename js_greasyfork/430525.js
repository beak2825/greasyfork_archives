// ==UserScript==
// @name         生成下拉框
// @namespace    coderWyh
// @version      1.0.2
// @description  This script is only for Chinese mainland users. The script function is to help Beijing Construction Research Company set up excel forms with one click
// @author       coderWyh
// @match        http://www.gczl360.com:8084/Admin/ZLKGL/Template*
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    axios.post(BASEURL+'jky/value/getCodeValue/'+autoSetButtonCode)
        .then(response =>{
        if (response.data.success) {
            $(".record_box>.slimScrollDiv").append("<button style='position:absolute;top:0%;left:2%;background-color:peachpuff;border:1px solid;text-transform: uppercase;font-size: 14px;padding: 5px 10px;font-weight: 300;' class='xlk'>下拉框</button>")
            $('.xlk').on('click', function() {
                spread.suspendPaint();
                var sheet = spread.getActiveSheet()
                let style = new GC.Spread.Sheets.Style()
                style.borderBottom = new GC.Spread.Sheets.LineBorder("#000000", GC.Spread.Sheets.LineStyle.thin);
                style.borderRight = new GC.Spread.Sheets.LineBorder("#000000", GC.Spread.Sheets.LineStyle.thin);
                style.borderLeft = new GC.Spread.Sheets.LineBorder("#000000", GC.Spread.Sheets.LineStyle.thin);
                style.borderTop = new GC.Spread.Sheets.LineBorder("#000000", GC.Spread.Sheets.LineStyle.thin);
                style.cellButtons = [{
                    imageType: GC.Spread.Sheets.ButtonImageType.dropdown,
                    command: 'openList',
                    useButtonStyle: false,
                    visibility: GC.Spread.Sheets.ButtonVisibility.onSelected
                }];
                style.dropDowns = [{
                    type: GC.Spread.Sheets.DropDownType.list,
                    option: {
                        items: [{
                            text: ' ',
                            value: ' '
                        },
                                {
                                    text: '√',
                                    value: '√'
                                },
                                {
                                    text: '×',
                                    value: '×'
                                },
                                {
                                    text: '/',
                                    value: '/'
                                },
                                {
                                    text: '%',
                                    value: '%'
                                }],
                        multiSelect: false,
                        valueType: 0,
                    }
                }];
                let selections = sheet.getSelections()
                let beginRowIndex = selections[0].row
                let beginColIndex = selections[0].col
                let endRowIndex = selections[0].rowCount
                for (let i = 0; i < endRowIndex; i++) {
                    if(sheet.getText(beginRowIndex + i, beginColIndex)===''||sheet.getText(beginRowIndex + i, beginColIndex)===null) {
                        sheet.setStyle(beginRowIndex + i, beginColIndex, style);
                    }
                }
                spread.resumePaint();
                layer.msg("下拉框设置成功，已自动跳过有值的单元格", {
                    time: 1300
                });
            });
        }

    }).catch (error => {

    })

})();