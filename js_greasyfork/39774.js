// ==UserScript==
// @name         fsl-cacm
// @namespace    sucem
// @version      0.3
// @description  fsl cacm!
// @author       shjanken
// @match        http://www.cacm.com.cn/used/EnterMonth.aspx*
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/39774/fsl-cacm.user.js
// @updateURL https://update.greasyfork.org/scripts/39774/fsl-cacm.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // add console
    let query_url = "http://10.0.0.201:3000/data/json/";

    $("<input type=text id='input_sld' style='margin: 2px; width:50px' placeholder='受理点' />").insertAfter('#savetable');
    $("<input type=text id='input_year' style='margin: 2px; width:50px' placeholder='年' />").insertAfter('#input_sld');
    $("<input type=text id='input_month' style='margin: 2px; width: 50px' placeholder='月' /> ").insertAfter('#input_year');
    $("<button id='query_data'> 查询数据</button>").insertAfter('#input_month').click(function(){
        let sld = $('#input_sld').val();
        let year = $('#input_year').val();
        let month = $('#input_month').val();

        $.ajax({
            url: `${query_url}${sld}`,
            data: {
                "year": year,
                "month": month
            }
        }).done(function(data){
            //console.log(data);
            fill_data(data);
        }).fail(function(data, status){
            if (status == "404")
                alert("no data file on the server! please create the file first");
        });
    });

    $("<button id='btn_create_data'>生成数据报表</button>").insertAfter('#query_data').click(function(){
        let sld = $('#input_sld').val();
        let year = $('#input_year').val();
        let month = $('#input_month').val();

        $.ajax({
            url: `${query_url}${sld}`,
            method: "PUT",
            data: {
                "year": year,
                "month": month
            }
        }).done(function(data){
            alert("create file success!");
        });
    });

    function fill_data(data) {
        $('table tr').each(function(index){
            if (index !== 0 && index !== 1) {
                let row = data[index-2];
                $(this).find('td.editZone, td.CalZone').each(function(i){
                    switch(i) {
                        case 0:
                            $(this).text(row.jyje);
                            break;
                        case 1:
                            $(this).text(row.hj);
                            break;
                        case 2:
                            $(this).text(row.zjjy);
                            break;
                        case 3:
                            $(this).text(row.wtjy);
                            break;
                        case 4:
                            $(this).text(row.bdgh);
                            break;
                        case 5:
                            $(this).text(row.zj);
                            break;
                        case 6:
                            $(this).text(row.gc);
                            break;
                        case 7:
                            $(this).text(row.sc);
                            break;
                        case 8:
                            $(this).text(row.gcc);
                            break;
                        case 9:
                            $(this).text(row.jkc);
                            break;
                        case 10:
                            $(this).text(row.snn);
                            break;
                        case 11:
                            $(this).text(row.sdln);
                            break;
                        case 12:
                            $(this).text(row.qdsn);
                            break;
                        case 13:
                            $(this).text(row.snys);
                            break;
                        default:
                            $(this).text("test");
                            break;
                    }
                });
            }

        });

        //hidden.forEach((item) => item.show());
    };

    function dev() {
        $('#input_sld').val('01');
        $('#input_year').val('2018');
        $('#input_month').val('1');
    }

    //dev();
    //fill_data([{name: "shjanken", sex: "man"}]);
})();