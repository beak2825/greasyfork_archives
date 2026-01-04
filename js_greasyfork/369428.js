// ==UserScript==
// @name         SIS Visualize
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Visualize the SIS
// @author       Hieu DM
// @match        ctt-sis.hust.edu.vn/Students/StudentCourseMarks.aspx
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.1/Chart.bundle.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369428/SIS%20Visualize.user.js
// @updateURL https://update.greasyfork.org/scripts/369428/SIS%20Visualize.meta.js
// ==/UserScript==

var a = 0, ap = 0, b = 0, bp = 0, c = 0, cp = 0, d = 0, dp = 0, f = 0;
var cnt = 0;
function calc(type) {
    if (type != 0 && type != 1) {
        type = 1;
    }
    function addition(elem, type) {
        if (type == 0) {
            return 1;
        } else if (type == 1) {
            return Number($(elem).prevAll().eq(3).html());
        }
        return 0;
    }
    a = 0; ap = 0; b = 0; bp = 0; c = 0; cp = 0; d = 0; dp = 0; f = 0;
    $('td:nth-of-type(8)').each(function(){
        cnt++;
        var x = addition($(this), type);
        switch($(this).html()) {
            case 'A': a += x; break;
            case 'A+': ap += x; break;
            case 'B': b += x; break;
            case 'B+': bp += x; break;
            case 'C': c += x; break;
            case 'C+': cp += x; break;
            case 'D': d += x; break;
            case 'D+': dp += x; break;
            case 'F': f += x; break;
            default:
        }
    });
}

function draw() {
    $("#vtl-modal").modal();
    $("#chart-container").empty();
    $("#chart-container").append(`
            <canvas id="vtl_bar"></canvas>
            <hr>
            <canvas id="vtl_pie"></canvas>`);
    var ctx = document.getElementById("vtl_bar").getContext('2d');
    var vtl_bar = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"],
            datasets: [{
                data: [ap, a, bp, b, cp, c, dp, d, f],
                backgroundColor: [
                    'rgba(244, 191, 191, 0.8)',
                    'rgba(234, 136, 136, 0.8)',
                    'rgba(226, 89, 89, 0.8)',
                    'rgba(219, 51, 51, 0.8)',
                    'rgba(202, 36, 36, 0.8)',
                    'rgba(175, 31, 31, 0.8)',
                    'rgba(148, 27, 27, 0.8)',
                    'rgba(119, 21, 21, 0.8)',
                    'rgba(83, 15, 15, 0.8)',
                ]
            }]
        },
        options: {
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            },
            title: {
                text: 'Số lượng điểm theo từng loại',
                display: true,
                position: 'bottom',
                fontSize: 20
            }
        }
    });

    var apx = (ap/cnt*100).toFixed(2);
    var ax = (a/cnt*100.0).toFixed(2);
    var bpx = (bp/cnt*100.0).toFixed(2);
    var bx = (b/cnt*100).toFixed(2);
    var cpx = (cp/cnt*100).toFixed(2);
    var cx = (c/cnt*100).toFixed(2);
    var dpx = (dp/cnt*100).toFixed(2);
    var dx = (d/cnt*100).toFixed(2);
    var fx = (f/cnt*100).toFixed(2);

    ctx = document.getElementById("vtl_pie").getContext('2d');
    var vtl_pie = new Chart(ctx,{
        type: 'pie',
        data: {
            labels: ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"],
            datasets: [{
                label: 'Điểm',
                data: [apx, ax, bpx, bx, cpx, cx, dpx, dx, fx],
                backgroundColor: [
                    'rgba(244, 191, 191, 0.8)',
                    'rgba(234, 136, 136, 0.8)',
                    'rgba(226, 89, 89, 0.8)',
                    'rgba(219, 51, 51, 0.8)',
                    'rgba(202, 36, 36, 0.8)',
                    'rgba(175, 31, 31, 0.8)',
                    'rgba(148, 27, 27, 0.8)',
                    'rgba(119, 21, 21, 0.8)',
                    'rgba(83, 15, 15, 0.8)',
                ]
            }]
        },
        options: {
            title: {
                text: 'Tỉ lệ điểm',
                display: true,
                position: 'bottom',
                fontSize: 20
            }
        }
    });

};
(function() {
    'use strict';
    $( document ).ready(function() {
        $('.MainContentTitle')
            .append(
            `
<div class="dropdown">
   <button class="btn btn-default dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
   Vẽ biểu đồ <span class="caret"></span>
   </button>
   <ul class="dropdown-menu">
      <li><a id="vtl0" class="dropdown-item" href="#">theo số môn học</a></li>
      <li><a id="vtl1" class="dropdown-item" href="#">theo số tín chỉ</a></li>
   </div>
</div>
<div id="vtl-modal" class="modal fade" role="dialog">
   <div class="modal-dialog modal-lg">
      <div class="modal-content">
         <div class="modal-header">Tổng hợp</div>
         <div class="modal-body" id="chart-container">
         </div>
      </div>
   </div>
</div>
`
        );
        $('#vtl0').click(function() {calc(0); draw();});
        $('#vtl1').click(function() {calc(1); draw();});
    });
})();

