// ==UserScript==
// @name         生成背景色
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
            $(".record_box>.slimScrollDiv").append("<button style='position:absolute;top:7%;left:2%;background-color:peachpuff;border:1px solid;text-transform: uppercase;font-size: 14px;padding: 5px 10px;font-weight: 300;' class='bjs'>背景色</button>")
            $('.bjs').on('click', function() {
                spread.suspendPaint();
                var sheet = spread.getActiveSheet()
                let selections = sheet.getSelections()
                selections.forEach(item => {
				for(let i = 0; i < item.rowCount; i++) {
					for(let j = 0; j < item.colCount; j++) {
						let style = sheet.getStyle(item.row + i, item.col + j)
						style.backColor = '#E0E0E0'
						sheet.setStyle(item.row + i, item.col + j,style)
					}
                }
				})
                spread.resumePaint();
                layer.msg("背景色设置成功", {
                    time: 1300
                });
            });
        }

    }).catch (error => {

    })

})();