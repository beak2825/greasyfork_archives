// ==UserScript==
// @name         https://myportal.vtc.edu.hk/*
// @namespace    https://greasyfork.org/en/scripts/375225-https-myportal-vtc-edu-hk
// @icon         https://www.google.com/s2/favicons?domain=myportal.vtc.edu.hk
// @version      0.6
// @description  try to take over the world!
// @author       You
// @match        https://myportal.vtc.edu.hk/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js
// @supportURL   https://github.com/admin-ll55/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375225/https%3Amyportalvtceduhk%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/375225/https%3Amyportalvtceduhk%2A.meta.js
// ==/UserScript==
$(document).ready(function(){
  var absent = 0;
  var attend = 0;
  if ($("table.hkvtcsp_wording").length > 0) {
    $("table.hkvtcsp_wording tbody td:last-child").each(function(){
      if ($(this).prev().prev().text() != '-') {
        var a = $(this).prev().prev().text();
        var b = $(this).prev().text().substring(0,5);
        a = moment(a, "kk:mm");
        b = moment(b, "kk:mm");
        var diff = a.diff(b, 'minutes');
        if (diff < 1) {
            diff = 0;
        }
        //$(this).text(diff);
        $(this).after(`<td style="text-align:center">`+diff+`</td>`);
        absent += diff;
      } else {
        var a = $(this).prev().text().substring(0,5);
        var b = $(this).prev().text().substring(8,13);
        a = moment(a, "kk:mm");
        b = moment(b, "kk:mm");
        var diff = b.diff(a, 'minutes');
        //$(this).text(diff);
        $(this).after(`<td style="text-align:center">`+diff+`</td>`);
        absent += diff;
      }
      a = $(this).prev().text().substring(0,5);
      b = $(this).prev().text().substring(8,13);
      a = moment(a, "kk:mm");
      b = moment(b, "kk:mm");
      attend += b.diff(a, 'minutes') - $(this).next().text();
    });
    $("table.hkvtcsp_wording").before(`<script>var attend = `+attend/60+`, absent = `+absent/60+`;function update_per(){$('#allowance').html($('#contact_hours').val()*0.3);$('#tolerance').html($('#contact_hours').val()*0.3-absent)}</script>`).append(`<tr><td style="text-align:center">total:</td><td style="text-align:center">`+(attend/60+absent/60)+`</td><td style="text-align:center">attend:</td><td style="text-align:center" id='attend'></td><td style="text-align:center">absent:</td><td style="text-align:center" id='absent'></td></tr><tr><td style="text-align:center">contact hours:</td><td style="text-align:center"><select id='contact_hours' onchange='update_per();'><option>13</option><option>26</option><option>39</option><option>52</option><option>78</option></select></td><td style="text-align:center">allowance:</td><td style="text-align:center" id='allowance'></td><td style="text-align:center">tolerance:</td><td style="text-align:center" id='tolerance'></td></tr>`).after(`<script>$('#attend').html(attend);$('#absent').html(absent);$('#allowance').html($('#contact_hours').val()*0.3);</script>`);
  }
  if (($("li:contains('Activity Enrolment')").length > 0) && ($("img[src*='current/EN/search_activity']").length > 0)) {
    var table = $("th.hkvtcsp_theader").parent().parent().parent();
    var target = table.find("td:contains('Yes')");
    var temp = "";
    target.each(function(){
      temp += $(this).parent().get(0).outerHTML;
      $(this).parent().remove();
    })
    table.find("tbody").append(temp);
  }
});