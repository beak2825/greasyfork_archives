// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://fap.fpt.edu.vn/Grade/StudentTranscript.aspx
// @require      http://code.jquery.com/jquery-1.9.1.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381229/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/381229/New%20Userscript.meta.js
// ==/UserScript==

$(document).ready(function() {
    $('body').append('<input type="button" value="Tính điểm trung bình" id="btnCal">')
    $("#btnCal").css("position", "fixed").css("top", 0).css("left", 0);
    $('#btnCal').click(function(){
        var tbody = $($('.table')[0]).find('tbody');
        var length = $(tbody).find('tr').length;
        var gradeSummary = 0;
        var creditSummary = 0;
        var totalCredit = 0;
        for(var i = 0; i< length;i++){
            var tr = (tbody).find('tr')[i];
            try {
                var subject = $(tr).find('td')[3].innerText;
                var credit = parseFloat($(tr).find('td')[6].innerText);
                var point = parseFloat($($($(tr).find('td')[7]).find('span'))[0].innerText);
                var status = $($($(tr).find('td')[8]).find('span'))[0].innerText;
                if(!subject.includes('OJS') && !subject.includes('VOV')){
                    if(status == 'Passed'){
                        if(point > 0){
                            gradeSummary += credit*point;
                            creditSummary += credit;
                        }
                    }
                }
                if(status == 'Passed'){
                    totalCredit += credit;
                }
            } catch (error) {
                continue;
            }
        }
        alert('Điểm trung bình :'+gradeSummary/creditSummary+'\n Số tín chỉ đã học :'+totalCredit);
    });
   
  });
