// ==UserScript==
// @name        敵人圖鑑與關卡查詢表_增加連結
// @namespace       https://home.gamer.com.tw/homeindex.php?owner=k96879687
// @version     2019.10.8
// @author      k96879687(竊盜拿到OK繃)
// @description     主要用在toutzn(蜜糖情人 )文章的網站 https://forum.gamer.com.tw/C.php?bsn=23772&snA=15334
// @match       http://www.toutzn.byethost24.com/
// @match       https://cattw.000webhostapp.com/index.php
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/390906/%E6%95%B5%E4%BA%BA%E5%9C%96%E9%91%91%E8%88%87%E9%97%9C%E5%8D%A1%E6%9F%A5%E8%A9%A2%E8%A1%A8_%E5%A2%9E%E5%8A%A0%E9%80%A3%E7%B5%90.user.js
// @updateURL https://update.greasyfork.org/scripts/390906/%E6%95%B5%E4%BA%BA%E5%9C%96%E9%91%91%E8%88%87%E9%97%9C%E5%8D%A1%E6%9F%A5%E8%A9%A2%E8%A1%A8_%E5%A2%9E%E5%8A%A0%E9%80%A3%E7%B5%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var stage_words = [
        '世界一',
        '世界二',
        '世界三',
        '未來一',
        '未來二',
        '未來三',
        '宇宙一',
        '宇宙二',
        '宇宙三'];
    var stage_number = [
        's03000-',
        's03001-',
        's03002-',
        's03003-',
        's03004-',
        's03005-',
        's03006-',
        's03007-',
        's03008-'];
	var getName_table = document.getElementsByTagName('table');
    var count_table = getName_table.length;

	for(var i=0;i<count_table;i++){
        var Original_num = parseInt(getName_table[i].rows[1].cells[1].innerText);
        while(isNaN(Original_num)){
            i++;
            Original_num = parseInt(getName_table[i].rows[1].cells[1].innerText);
          };
        for(var i_row = 1;i_row<getName_table[i].rows.length;i_row++){
            var table_stage = getName_table[i].rows[i_row].cells[0].innerText;//進度欄位
			Original_num = parseInt(getName_table[i].rows[i_row].cells[1].innerText);//順序欄位
			if(table_stage != '傳說'){
				for(var j = 0; j<stage_words.length; j++){
					if(table_stage == stage_words[j]){
						if(Original_num/10 < 1){
							getName_table[i].rows[i_row].cells[1].innerHTML = "<a href='https://battlecats-db.com/stage/"+stage_number[j]+"0"+Original_num+".html' target='_blank'>"+Original_num+"</a>";
							break;
						}
						else{
							getName_table[i].rows[i_row].cells[1].innerHTML = "<a href='https://battlecats-db.com/stage/"+stage_number[j]+Original_num+".html' target='_blank'>"+Original_num+"</a>";
							break;
						}
					}
				}
			}
            else if(table_stage == '傳說'){
				var Original_text = document.getElementsByTagName('table')[i].rows[i_row].cells[2].innerText;
				var Level_num = parseInt(Original_text);
				if(Original_num/10 < 1){
					Original_num--;
					getName_table[i].rows[i_row].cells[2].innerHTML = "<a href='https://battlecats-db.com/stage/s0000"+Original_num+"-0"+Level_num+".html' target='_blank'>"+Original_text+"</a>";
				}
				else{
					Original_num--;
					getName_table[i].rows[i_row].cells[2].innerHTML = "<a href='https://battlecats-db.com/stage/s000"+Original_num+"-0"+Level_num+".html' target='_blank'>"+Original_text+"</a>";
				}
			}

        }
	}

})();