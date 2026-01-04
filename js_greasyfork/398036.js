// ==UserScript==
// @name         make Shao-wei's website darker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  make Shao-wei's website darker. Don't use bright blue to hurt our eyes.
// @author       SoLs at 2020/03/16
// @match        http://www.stat.nthu.edu.tw/~swcheng/Teaching/*/index.*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398036/make%20Shao-wei%27s%20website%20darker.user.js
// @updateURL https://update.greasyfork.org/scripts/398036/make%20Shao-wei%27s%20website%20darker.meta.js
// ==/UserScript==

(function() {
    var background_color = "#162732"; //背景顏色
    var note_font_color = '#FF8B00'; //提醒顏色
    var table_font_color = '#FFE477'; //表格顏色
    var link_color = '#966A00'; //連結顏色
    var defalut_font_color = "#E6C12B"; //預設顏色
    var assignment_font_color ="#ED9C36"; // 作業顏色
    var i, j;
    var rows, columns;
    // 移除不知所以上的紅色
    function remove_colored_object(colored_objects){
        for(j=0; j<colored_objects.length; j++){
            colored_objects[j].style.color = assignment_font_color
        }
    }
    // 更改背景顏色
    document.body.style.background = background_color;
    // 更改Note的顏色
    var table_one_tr = document.querySelector("#table1").querySelectorAll("tr");
    for(i=0; i < table_one_tr.length; i++){
        remove_colored_object(table_one_tr[i].querySelectorAll("[color='#ff0000']"))
        var row = table_one_tr[i];
        var column = row.querySelectorAll("td")
        if(column.length == 2 ){
            column[1].style.color = note_font_color;
        }
    }
    // 更改表格顏色
    var tables = document.querySelectorAll("table")
    for( i=1; i<tables.length; i++){
        rows = tables[i].querySelectorAll("tr")
        for(j=0; j<rows.length; j++){
            rows[j].style.color = table_font_color;
        }
    }
    // 更改超連結顏色
    var links = document.querySelectorAll("a")
    for(i=0; i<links.length; i++){
        if(links[i].href){
            links[i].style.color = link_color;
        }
    }
    // 更改作業顏色
    var assignments = document.querySelectorAll("table")[2].querySelectorAll("tr")
    for(i=1;i<assignments.length; i++){
        remove_colored_object(assignments[i].querySelectorAll("[color='#ff0000']"))
        columns = assignments[i].querySelectorAll("td")
        columns[1].style.color = assignment_font_color
    }
    // 幫其他不之所以然的物件上色
    var ps = document.querySelectorAll("p")
    for(i=0;i<ps.length;i++){
        ps[i].style.color = defalut_font_color;
    }
})();