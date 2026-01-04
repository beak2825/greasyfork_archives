// ==UserScript==
// @name         ProxyCheckerGenius - Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.proxychecker.ge/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31429/ProxyCheckerGenius%20-%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/31429/ProxyCheckerGenius%20-%20Helper.meta.js
// ==/UserScript==

function createScript(src){
    var _script = document.createElement('script');
    _script.src = src;
    _script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(_script);

}

function createCSS(src){
    var _link = document.createElement('link');
    _link.rel  = 'stylesheet';
    _link.href = src;
    _link.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(_link);

}

var int_handler = null;

(function() {
    'use strict';
    // Your code here...
    createScript("https://code.jquery.com/jquery-1.12.4.js");


    int_handler = setInterval(function(){
        if(window.jQuery){
            clearInterval(int_handler);
            createCSS("https://cdn.datatables.net/v/dt/jq-2.2.4/dt-1.10.15/b-1.3.1/b-flash-1.3.1/b-html5-1.3.1/datatables.min.css");
            createScript("https://cdn.datatables.net/v/dt/jq-2.2.4/dt-1.10.15/b-1.3.1/b-flash-1.3.1/b-html5-1.3.1/datatables.min.js");

            $("#form1").on("submit", function(){
                console.log("Submitted");
                int_handler = setInterval(function(){
                    var resultContainer = $("#ContentPlaceHolder1_lResults").length;
                    if(resultContainer){
                        clearInterval(int_handler);
                        var counter = 0;
                        int_handler = setInterval(function(){
                            console.log("Testing..");
                            var img_testing = $("td>img").length;
                            if(img_testing == 0){
                                console.log("Done.."+((counter*300)/1000));
                                clearInterval(int_handler);
                                $("#renderDataTable").click();
                            }
                            counter++;
                        }, 300);
                    }
                }, 300);
            });
            $("<button/>", {id: "renderDataTable", name: "renderDataTable", text: "Render As DataTable", type: "button", style:"border-style:None;font-family:Tahoma;font-size:X-Large;font-weight:bold;height:50px;width:90%;margin-bottom:8px;margin-top:8px"}).click(function(){
                var table = $("#ContentPlaceHolder1_lResults > table");
                var tr_head = table.find("tr:eq(0)");
                var tr_head_copy = tr_head.clone();
                tr_head.remove();
                var thead = $("<thead/>");
                thead.append(tr_head_copy);
                table.prepend(thead);
                var tablex = table.DataTable(
                    {
                        dom: 'Bfrtip',
                        "buttons": [
                            'excel'
                        ],
                        "paging":   false,
                        "columns": [
                            { data: 'proxy' },
                            { data: 'get' },
                            { data: 'post' },
                            { data: 'connect' },
                            { data: 'transparency' },
                            { data: 'speed' }
                        ],
                        "order": [[ 5, "desc" ]],
                        "columnDefs": [ {
                            "targets": 5,
                            "render": function(data, type, row, meta){
                                var ret = data;
                                if(type == "display"){
                                    ret = data;
                                }

                                if(type == "sort"){
                                    ret = +data.replace(/[^0-9\.]/g, "");
                                }
                                console.log(ret, type);
                                return ret;
                            },
                            "type":"num-fmt"
                        },
                                       {
                                           "targets": [1,2,3],
                                           "render": function(data, type, row, meta){
                                               var ret = data;
                                               ret = $(ret).prop('checked')? '☑':'☐';
                                               return ret;
                                           },
                                           "type":"num"
                                       }]
                    }
                );

                tablex.buttons().container()
                    .appendTo( $('.col-sm-6:eq(0)', tablex.table().container() ) );
            }).insertBefore($("#ContentPlaceHolder1_UpdatePanel1").parent());
        }

    }, 300);
})();