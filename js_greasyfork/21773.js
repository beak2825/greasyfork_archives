// ==UserScript==
// @name         Freshdesk Ticket Report
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Allows creation of csv ticket reports
// @author       Adrian Bradfield
// @match        http://*.pastel.co.uk/*
// @match        https://pastel.freshdesk.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/21773/Freshdesk%20Ticket%20Report.user.js
// @updateURL https://update.greasyfork.org/scripts/21773/Freshdesk%20Ticket%20Report.meta.js
// ==/UserScript==
(function() {
    var result = [];
    var curLowLim = 1;

    function nextPage(callback){
        function upperLim(){ return parseInt(unsafeWindow.$J("div.ticketlist-total-count").first().find("b")[1].innerHTML);}
        function lowerLim(){ return parseInt(unsafeWindow.$J("div.ticketlist-total-count").first().find("b")[0].innerHTML);}
        function total(){return parseInt(unsafeWindow.$J("#ticket_list_count").first().html());}
        function waitForLoad(callback, timer){
           if(lowerLim() > curLowLim){
               curLowLim = lowerLim();
               callback();
               clearInterval(timer);
           }
        }
        console.log('' + upperLim() + ' ' + total());
        if(upperLim() === total()){
            return false;
        }
        else{
            unsafeWindow.$J("a.next_page").click();
            var checker = setInterval(function(){waitForLoad(callback, checker);});
            return true;
        }
    }

    function collectResult(result){
        var re = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
        function getDate(str){
            var re = new RegExp('^([\\s\\S]*?)T', "gm");
            var ret = re.exec(str);
            if(ret){
                return ret[1].split("-").reverse().join("/"); //Convert US to UK
            }
        }
        function getVarStr(needle, haystack){
            var re = new RegExp('"'+needle+'":"([\\s\\S]*?)"', "gm");
            var res = re.exec(haystack);
            return res[1];
        }
        function getVarInt(needle, haystack){
            var re = new RegExp("\""+needle+"\":([\\s\\S]*?),", "gm");
            var res = re.exec(haystack);
            return res[1];
        }
        function getCompany(result, haystack){
            var re1 = new RegExp('<div class="break-word user-company-name" title="([\\s\\S]*?)"', "gm");
            var company = re1.exec(result);
            if(!company){
                company = getVarStr("requester_name", haystack);
            }
            else{
                company = company[1];
            }
            return company;
        }
        var match;
        while (match = re.exec(result)) {
            if(match[1].indexOf("dom_helper_data = {") > -1){
                var obj = {
                    "id": getVarInt("display_id", match[1]),
                    "created": getDate(getVarStr("created_at", match[1])),
                    "updated": getDate(getVarStr("updated_at", match[1])),
                    "status": getVarStr("status_name", match[1]),
                    "subject": getVarStr("subject", match[1]),
                    "company": getCompany(result, match[1]),
                    "agent": getVarStr("responder_name", match[1])
                };
                if(obj.status === "Closed"){obj.status = "Resolved";}
                return obj;
            }
        }
    }

    function generateAction(){
        var currentResults = [];
        if(result.length > 0){
            currentResults = result;
        }
        function createCSV(objs){
            var ret = "Agent,Updated,Company,Ticket no,Status,Created,Comment\r\n";
            for(var i = 0; i < objs.length; i++){
                ret += '"'+objs[i].agent+'","'+objs[i].updated + '","' + objs[i].company + '","' + objs[i].id + '","' + objs[i].status + '","' + objs[i].created + '","' + objs[i].subject + '"\r\n';
            }
            return ret;
        }
        function download(text, name, type) {
            var a = document.createElement("a");
            var file = new Blob([text], {type: type});
            a.href = URL.createObjectURL(file);
            a.download = name;
            a.click();
        }
        var queue = [];
        var tickets = unsafeWindow.$J("table.tickets tr");
        tickets.each(function(index){
            var link = unsafeWindow.$J( this ).find("a").first();
            var str = link.attr("href");
            if(!isNaN(str.substring(str.lastIndexOf('/') + 1))){
                queue.push(unsafeWindow.$J.ajax({url: link.attr("href"), error: function(){
                    alert("Report Failed: Some lines may be missing from report. Please try running it again.");
                }}));
            }
        });
        unsafeWindow.$J.when.apply(unsafeWindow.$J, queue).done(function(){
            var results = [];
            if(currentResults.length > 0){
                results = currentResults;
            }
            for(var i = 0; i < arguments.length; i++){
                results.push(collectResult(arguments[i][0]));
            }
            results.sort(function(a,b){
                function getStatusNum(status){
                    switch(status){
                        case "Closed":
                            return 4;
                        case "Resolved":
                            return 3;
                        case "Open":
                            return 2;
                        default:
                            return 1;
                    }
                }
                if(a.status !== b.status){
                    return getStatusNum(b.status) - getStatusNum(a.status);
                }
                else{
                    if(a.updated === b.updated){
                        return 0;
                    }
                    var splita = a.updated.split("/");
                    var datea = new Date(splita[2], splita[1], splita[0]);
                    var splitb = b.updated.split("/");
                    var dateb = new Date(splitb[2], splitb[1], splitb[0]);
                    return(dateb < datea)?1:-1;
                }
            });
            if(!nextPage(generateAction)){
                download(createCSV(results), "TicketReport.csv", "csv");
                result = [];
                curLowLim = 1;
            }
            else{
                result = results;
            }
        });
    }

    //Insert button onto ticket view page, if it doesn't already exist
    window.setInterval(function(){
        if(window.location.pathname.startsWith("/helpdesk/tickets")){
            if(unsafeWindow.$J("#GENERATE_REPORT").length === 0){
                //Insert Button
                unsafeWindow.$J("#ticket-sub-toolbar").append("<input id=\"GENERATE_REPORT\" class=\"btn tooltip\" title=\"Generate Ticket Report\" type=\"button\" value=\"Generate Report\" data-highlight=\"true\">");
                unsafeWindow.$J("#GENERATE_REPORT").click(generateAction);
                //unsafeWindow.$J("#GENERATE_REPORT").click(function(){nextPage(function(){alert("NEXT");});});
            }
        }
    }, 1000);
})();