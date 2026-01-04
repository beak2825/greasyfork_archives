// ==UserScript==
// @name         一键设置button
// @namespace    coderWyh
// @version      1.0.5
// @description  This script is only for Chinese mainland users. The script function is to help Beijing Construction Research Company set up excel forms with one click
// @author       coderWyh
// @match        http://www.gczl360.com:8084/Admin/ZLKGL/Template*
// @run-at       document-end
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js
// @require      https://greasyfork.org/scripts/430198-%E7%A6%81%E6%AD%A2%E8%B0%83%E8%AF%95/code/%E7%A6%81%E6%AD%A2%E8%B0%83%E8%AF%95.js?version=956324
// ==/UserScript==
//此脚本仅对中国大陆用户使用，脚本是给北京建科研公司提供一键设置excel表格
// 本代码所有权归作者所有 作者QQ：2471630907 手机号：18990193572  微信同手机号
// 本代码具有知识产权 未经作者授权严禁任何人进行使用、传播、二次开发等一系列损害作者知识产权的操作
// 作者对未经授权的操作保留起诉但不仅限于起诉的维护个人知识产权利益的法律途径

(function() {
    'use strict';
    let valueMap = []
    axios.post(BASEURL+'jky/value/getCodeValue/'+autoSetButtonCode)
        .then(response =>{
        if (response.data.success) {
            $("body").append("<button style='position:absolute;top:10%;right:15%;background-color:peachpuff;border:1px solid;text-transform: uppercase;font-size: 14px;padding: 10px 20px;font-weight: 300;' class='autoSet'>自动设置</button>")
            $(".autoSet").on('click',
                             function() {
                let url = location.href
                valueMap = response.data.data.valueList
                var sheet = spread.getActiveSheet();
                var sheetIndex_c = spread.getActiveSheetIndex();
                var colCount = sheet.getColumnCount();
                const list = [];
                const length = valueMap.length;
                let spanValue;
                let jcjg;
                let zkxm;
                let ybxm;
                let jcjl;
                let scjz2020;
                let oneValue;
                let scjz2020EndIndex;
                let rowCount = sheet.getRowCount();
                spread.suspendPaint();
                for (let i = 0; i < rowCount; i++) {
                    for (let j = 0; j < colCount; j++) {
                        let span = sheet.getSpans(new GC.Spread.Sheets.Range(i, j, 1, 1));
                        if (span.length > 0) {
                            if (list.length === 0) {
                                spanValue = sheet.getText(i, j).replace(/\ +/g, "").replace(/[\r\n]/g, "");
                                //OK 判断内容
                                if (spanValue !== "") {
                                    if (spanValue.indexOf('编号')>=0) {
                                        if(sheet.getText(shan[0].row,shan[0].col+span[0].colCount).replace(/\ +/g, "").replace(/[\r\n]/g, "")!='001'){
                                            //TODO 判断编号后面不是001的情况
                                        }else {
                                            sheet.setText(span[0].row,span[0].col+span[0].colCount,'')
                                            addTemplateAttArray(sheetIndex_c, span[0].row, span[0].col + span[0].colCount, 'bh1', '')
                                        }
                                        break
                                    }
                                    valueMap.map(item =>{
                                        if (spanValue === item.name) {
                                            if (spanValue.indexOf('：') >= 0 && spanValue.indexOf('编号') < 0 && spanValue.indexOf('工程名称') < 0) {
                                                addTemplateAttArray(sheetIndex_c, span[0].row, span[0].col + span[0].colCount, item.value, 'sign')
                                            } else {
                                                if (spanValue === '年月日') {
                                                    addTemplateAttArray(sheetIndex_c, span[0].row, span[0].col, item.value, '')
                                                }  else {
                                                    sheet.setText(span[0].row,span[0].col+span[0].colCount,'')
                                                    let style = sheet.getStyle(span[0].row,span[0].col+span[0].colCount)
                                                    style.backColor = '#FFFFFF'
                                                    sheet.setStyle(span[0].row,span[0].col+span[0].colCount,style)
                                                    addTemplateAttArray(sheetIndex_c, span[0].row, span[0].col + span[0].colCount, item.value, '')
                                                }
                                            }
                                        }
                                    });
                                    list.push(span[0])
                                }
                            } else {
                                A: for (let c = 0; c < list.length; c++) {
                                    for (let d = 0; d < list.length; d++) {
                                        if (list[d] === span[0]) {
                                            break A;
                                        }
                                    }
                                    spanValue = sheet.getText(i, j).replace(/\ +/g, "").replace(/[\r\n]/g, "");
                                    //OK 判断内容
                                    if (spanValue !== "") {
                                        if ((spanValue === '检查结果' || spanValue === '评判结果') && typeof(jcjg)==='undefined') {
                                            jcjg = span[0]
                                            break;
                                        }
                                        if (spanValue === '主控项目') {
                                            zkxm = span[0]
                                            break;
                                        }
                                        if (spanValue === '一般项目') {
                                            ybxm = span[0]
                                            break;
                                        }
                                        if ((spanValue === '检查记录' || spanValue === '施工单位质量评定记录') && typeof(jcjl)==='undefined') {
                                            jcjl = span[0]
                                            break;
                                        }
                                        if (spanValue.indexOf('四川省建设工程质量安全与监理协会')>=0) {
                                            scjz2020EndIndex = span[0].row
                                            break;
                                        }
                                        if (spanValue === '监理工程师(建设单位项目技术负责人)：'||spanValue === '监理工程师（建设单位项目技术负责人）：') {
                                            scjz2020 = span[0]
                                        }
                                        valueMap.map(item =>{
                                            if (spanValue === item.name) {
                                                if (spanValue.indexOf('：') >= 0 && spanValue.indexOf('编号') < 0 && spanValue.indexOf('工程名称') < 0) {
                                                    if (sheet.getText(span[0].row,span[0].col+span[0].colCount) != '') {
                                                        addTemplateAttArray(sheetIndex_c, span[0].row+span[0].rowCount, span[0].col, item.value, 'sign')
                                                    } else {
                                                        addTemplateAttArray(sheetIndex_c, span[0].row, span[0].col + span[0].colCount, item.value, 'sign')
                                                    }
                                                } else {
                                                    if (spanValue === '年月日') {
                                                        addTemplateAttArray(sheetIndex_c, span[0].row, span[0].col, item.value, '')
                                                    } else {
                                                        if (spanValue === '检验批部位' || spanValue.indexOf('工程名称') >=0 || spanValue.indexOf('编号') >=0 ||spanValue === '验收部位/区段' ) {
                                                            sheet.setText(span[0].row,span[0].col+span[0].colCount,"")
                                                            let style = sheet.getStyle(span[0].row,span[0].col+span[0].colCount)
                                                            style.backColor = '#FFFFFF'
                                                            sheet.setStyle(span[0].row,span[0].col+span[0].colCount,style)
                                                            addTemplateAttArray(sheetIndex_c, span[0].row, span[0].col + span[0].colCount, item.value, '')
                                                        }
                                                        else if (sheet.getText(span[0].row,span[0].col+span[0].colCount) != '') {
                                                            sheet.setText(span[0].row+span[0].rowCount,span[0].col,"")
                                                            let style = sheet.getStyle(span[0].row+span[0].rowCount,span[0].col)
                                                            style.backColor = '#FFFFFF'
                                                            sheet.setStyle(span[0].row+span[0].rowCount,span[0].col,style)
                                                            addTemplateAttArray(sheetIndex_c, span[0].row + span[0].rowCount, span[0].col, item.value, '')
                                                        } else {
                                                            sheet.setText(span[0].row,span[0].col+span[0].colCount,"")
                                                            let style = sheet.getStyle(span[0].row,span[0].col+span[0].colCount)
                                                            style.backColor = '#FFFFFF'
                                                            sheet.setStyle(span[0].row,span[0].col+span[0].colCount,style)
                                                            addTemplateAttArray(sheetIndex_c, span[0].row, span[0].col + span[0].colCount, item.value, '')
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                    }
                                    list.push(span[0])
                                }
                            }
                        } else {
                            oneValue = sheet.getText(i, j).replace(/\ +/g, "").replace(/[\r\n]/g, "");
                            //OK 判断内容
                            if (oneValue !== "") {
                                if ((oneValue === '检查结果' || oneValue === '评判结果') && typeof(jcjg)==='undefined') {
                                    jcjg = {row: i,col: j,rowCount: 1,colCount: 1}
                                    break;
                                }
                                valueMap.map(item =>{
                                    if (oneValue === item.name) {
                                        if (oneValue.indexOf('：') >= 0 && oneValue.indexOf('编号') < 0 && oneValue.indexOf('工程名称') < 0) {
                                            addTemplateAttArray(sheetIndex_c, i, j+1, item.value, 'sign')
                                        } else {
                                            if (oneValue === '年月日') {
                                                addTemplateAttArray(sheetIndex_c, i, j, item.value, '')
                                            } else {
                                                sheet.setText(i,j+1,"")
                                                addTemplateAttArray(sheetIndex_c, i, j+1, item.value, '')
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
                // 设置检查记录
                if (jcjl != null) {
                    if (ybxm != null) {
                        let length = ybxm.row+ybxm.rowCount-jcjl.row
                        for (let i = 1; i < length; i++) {
                            if (sheet.getText(jcjl.row + i, jcjl.col)===''||sheet.getText(jcjl.row + i, jcjl.col)===null){
                                addTemplateAttArray(sheetIndex_c, jcjl.row + i, jcjl.col, 's201403', '')
                            }
                        }
                    }
                    else {
                        let length = zkxm.row+zkxm.rowCount-jcjl.row
                        for (let i = 1;i < length; i++) {
                            if(sheet.getText(jcjl.row + i, jcjl.col)===''||sheet.getText(jcjl.row + i, jcjl.col)===null){
                                addTemplateAttArray(sheetIndex_c, jcjl.row + i, jcjl.col, 's201403', '')
                            }
                        }
                    }
                }
                // 设置检查结果
                if (jcjg != null) {
                    if (ybxm != null) {
                        if (zkxm != null) {
                            let style = new GC.Spread.Sheets.Style();
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
                                            }],
                                    multiSelect: false,
                                    valueType: 0,
                                }
                            }];
                            let zkxmLen = zkxm.rowCount
                            for (let i = 1; i <= zkxmLen+1; i++) {
                                if(sheet.getText(jcjg.row+i,jcjg.col)===''||sheet.getText(jcjg.row+i,jcjg.col)===null) {
                                    sheet.setStyle(jcjg.row + i, jcjg.col, style);
                                }
                            }

                            let style1 = new GC.Spread.Sheets.Style();
                            style1.borderBottom = new GC.Spread.Sheets.LineBorder("#000000", GC.Spread.Sheets.LineStyle.thin);
                            style1.borderRight = new GC.Spread.Sheets.LineBorder("#000000", GC.Spread.Sheets.LineStyle.thin);
                            style1.borderLeft = new GC.Spread.Sheets.LineBorder("#000000", GC.Spread.Sheets.LineStyle.thin);
                            style1.borderTop = new GC.Spread.Sheets.LineBorder("#000000", GC.Spread.Sheets.LineStyle.thin);
                            style1.cellButtons = [{
                                imageType: GC.Spread.Sheets.ButtonImageType.dropdown,
                                command: 'openList',
                                useButtonStyle: false,
                                visibility: GC.Spread.Sheets.ButtonVisibility.onSelected
                            }];
                            style1.dropDowns = [{
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
                            let ybxmLen = ybxm.rowCount
                            for (let i = 0; i < ybxmLen; i++) {
                                if(sheet.getText(ybxm.row+i,jcjg.col)===''||sheet.getText(ybxm.row+i,jcjg.col)===null) {
                                    sheet.setStyle(ybxm.row + i, jcjg.col, style1);
                                }
                            }
                        } else {
                            let style1 = new GC.Spread.Sheets.Style();
                            style1.borderBottom = new GC.Spread.Sheets.LineBorder("#000000", GC.Spread.Sheets.LineStyle.thin);
                            style1.borderRight = new GC.Spread.Sheets.LineBorder("#000000", GC.Spread.Sheets.LineStyle.thin);
                            style1.borderLeft = new GC.Spread.Sheets.LineBorder("#000000", GC.Spread.Sheets.LineStyle.thin);
                            style1.borderTop = new GC.Spread.Sheets.LineBorder("#000000", GC.Spread.Sheets.LineStyle.thin);
                            style1.cellButtons = [{
                                imageType: GC.Spread.Sheets.ButtonImageType.dropdown,
                                command: 'openList',
                                useButtonStyle: false,
                                visibility: GC.Spread.Sheets.ButtonVisibility.onSelected
                            }];
                            style1.dropDowns = [{
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
                            let ybxmLen = ybxm.rowCount
                            for (let i = 1; i <= ybxmLen; i++) {
                                if(sheet.getText(ybxm.row+i,jcjg.col)===''||sheet.getText(ybxm.row+i,jcjg.col)===null) {
                                    sheet.setStyle(ybxm.row + i, jcjg.col, style1);
                                }
                            }
                        }
                    } else {
                        let style = new GC.Spread.Sheets.Style();
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
                                        }],
                                multiSelect: false,
                                valueType: 0,
                            }
                        }];
                        let zkxmLen = zkxm.rowCount
                        for (let i = 1; i <= zkxmLen; i++) {
                            if(sheet.getText(jcjg.row+i,jcjg.col)===''||sheet.getText(jcjg.row+i,jcjg.col)===null) {
                                sheet.setStyle(jcjg.row + i, jcjg.col, style)
                            }
                        }
                    }
                }
                // 单独处理四川建筑2020签字栏需要两个签名
                if (scjz2020 != null) {
                    let span1 = sheet.getSpans(new GC.Spread.Sheets.Range(scjz2020.row, scjz2020.col+scjz2020.colCount, 1, 1))
                    if (span1.length >0) {
                        let style = sheet.getStyle(span1[0].row, span1[0].col + span1[0].colCount)
                        style.hAlign = GC.Spread.Sheets.HorizontalAlign.center;
                        style.vAlign = GC.Spread.Sheets.VerticalAlign.center;
                        sheet.setStyle(span1[0].row, span1[0].col + span1[0].colCount, style)
                        addTemplateAttArray(sheetIndex_c, span1[0].row, span1[0].col + span1[0].colCount, 'p0205', 'sign')
                    }
                }
                if(url.indexOf('ade8e564-4917-4f38-810f-e9b7ae9a54e0')>0) {
                    for(let i=0;i<rowCount;i++){
                        for(let j = 0;j<colCount;j++){
                            let value = sheet.getText(i,j).replace(/\ +/g, "").replace(/[\r\n]/g, "")
                            if (ybxm!=null||zkxm!=null) {
                                if ((value != ''|| i<3||j===0||j===colCount||i>=scjz2020EndIndex-1) && (value != '年月日')){
                                    let style = sheet.getStyle(i,j)
                                    style.backColor = '#E0E0E0'
                                    sheet.setStyle(i,j,style)
                                }
                            }else{
                                if ((value != ''|| i<3||j===0||j===colCount||i>=scjz2020EndIndex) && (value != '年月日')){
                                    let style = sheet.getStyle(i,j)
                                    style.backColor = '#E0E0E0'
                                    sheet.setStyle(i,j,style)
                                }
                            }
                        }
                    }
                    let picture = sheet.pictures.add("pic001", 'http://www.gczl360.com:8084/Attach/PicData/2021-07-29/202107290458194590.jpg');
                    picture.startRow(2);
                    picture.startColumn(25);
                    picture.endRow(2);
                    picture.endColumn(28);
                    picture.dynamicMove(false);
                    picture.dynamicSize(true);
                }else {
                    for(let i=0;i<rowCount;i++){
                        for(let j = 0;j<colCount;j++){
                            let value = sheet.getText(i,j).replace(/\ +/g, "").replace(/[\r\n]/g, "")
                            if (ybxm!=null||zkxm!=null) {
                                if ((value != ''|| i<3 ||j===colCount) && (value != '年月日')){
                                    let style = sheet.getStyle(i,j)
                                    style.backColor = '#E0E0E0'
                                    sheet.setStyle(i,j,style)
                                }
                            }else{
                                if ((value != ''|| i<3 ||j===colCount) && (value != '年月日')){
                                    let style = sheet.getStyle(i,j)
                                    style.backColor = '#E0E0E0'
                                    sheet.setStyle(i,j,style)
                                }
                            }
                        }
                    }
                }
                spread.resumePaint();
                layer.msg("自动设置成功", {
                    time: 1000
                });


                function addTemplateAttArray(sheetIndex, row, col, value, type) {
                    for (let i = 0; i < attrArray.length; i++) {
                        let item = attrArray[i]
                        if (item.sheetIndex === sheetIndex && item.row === row && item.col === col) {
                            item.value = value
                            item.type = type
                            return
                        }
                    }
                    attrArray.push({ sheetIndex: sheetIndex, row: row, col: col, value: value , type:type})
                }
            });
        } else {
            $(".record_box>.slimScrollDiv").append("<div style='position:absolute;top:20%;left:2%;background-color:red;border:1px;text-transform: uppercase;font-size: 14px;padding: 5px 10px;font-weight: 300;color:white' class='tips'>"+response.data.message+autoSetButtonCode+"</div>")

        }
    })
        .catch(error =>{
        console.log(error);
    })

})();