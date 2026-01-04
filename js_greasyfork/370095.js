// ==UserScript==
// @name        Konfident+
// @namespace   karachan.org
// @description Podgląd statusu zgłoszonych postów.
// @version     1.0
// @downloadURL

// @grant       GM_addStyle

// @match       *://*.karachan.org/*
// @exclude     http://www.karachan.org/*/src/*
// @exclude     https://www.karachan.org/*/src/*
// @exclude     http://karachan.org/*/src/*
// @exclude     https://karachan.org/*/src/*

// @downloadURL https://update.greasyfork.org/scripts/370095/Konfident%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/370095/Konfident%2B.meta.js
// ==/UserScript==

var myReports = (function(){
    if(typeof localStorage.reports === "undefined") {
        localStorage.reports = "[]";
    }

    function escapeHtml(text) {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };

        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    function addReport(reason) {
        var rep = JSON.parse(localStorage.reports);
        $('input[name^="del"]:checked').each((a, el)=>{
            var thisId = $(el).parent().attr("id").replace(/pi/g, "");
            var skip = false;
            rep.forEach((r)=>{
                skip = (r.id === thisId);
                if(skip) return;
            });
            if(!skip){
                rep.push({
                    id: thisId,
                    resto: $(el).closest(".thread")[0].id.replace(/t/g, ""),
                    reason: reason,
                    time: Date.now(),
                    board: board,
                });
            }
        });
        localStorage.reports = JSON.stringify(rep);
        $('.myReportsTblContainer').html(getReportsTable());
    }

    function getReportsTable(){
        if(typeof localStorage.reports === "undefined")
            return "<center><i>(empty)</i></center>";
        var rep = JSON.parse(localStorage.reports);
        if(!rep.length){
            return "<center><i>(empty)</i></center>";
        }
        var tableBody = "";
        rep.forEach((report)=>{
            var tim = new Date(parseInt(report.time));
            tableBody += `<tr data-id="${escapeHtml(report.id)}">
                <td><a href="${escapeHtml(document.location.origin+"/"+report.board+"/res/"+report.resto+".html#p"+report.id)}">&gt&gt/${escapeHtml(report.board)}/${escapeHtml(report.id)}</a></td>
                <td>${escapeHtml(report.reason)}</td>
                <td>${tim.toLocaleDateString()+" "+tim.toLocaleTimeString()}</td>
            </tr>`;
        });
        return `<table><tr><th>ID</th><th>Reason</th><th>When</th></tr><tr>${tableBody}</tr>`;
    }

    $(()=>{
        $(`
        <div id="tab-settings-reports" class="tab-content"><h2>My reports</h2>
            <style>
                .myReportsButtons button .ladda-label{
                    padding-top: 0px !important;
                }
                .checkLegend {
                    width:200px;
                    margin:auto;
                    text-align: center;
                }
                .checkResult center{
                    margin: 5px 0px;
                    font-size: 20px;
                }
                .checkResultButtons{
                    margin: 5px 0px;
                }
            </style>
            <div class="myReportsTblContainer"></div>

            <div class="myReportsButtons">
                <center>
                    <button class="btn-clear ladda-button" data-style="expand-right" data-size="xs" data-color="mint">Clear all</button>
                    <button class="btn-check ladda-button" data-style="expand-right" data-size="xs" data-color="mint">Check all</button>
                </center>
            </div>
            <div class="checkResult" style="display:none">
                <center></center>
                <div style="display:none" class="checkResultButtons">
                    <button class="clearBanned ladda-button" data-style="expand-right" data-size="xs" data-color="mint">Clear banned/removed/404</button>
                    <button class="closeCheckingResult ladda-button" data-style="expand-right" data-size="xs" data-color="mint">Close</button>
                </div>
            </div>
            <div class="checkLegend" style="display:none">
                <table style="font-weight: bold">
                    <tr><th>Legend</th></tr>
                    <tr><td style="color:red">Post banned</td></tr>
                    <tr><td style="color:yellow">Post deleted</td></tr>
                    <tr><td style="color:green">Post NOT banned</td></tr>
                    <tr><td style="color:black">404'd thread</td></tr>
                    <tr><td style="color:#003399">Reported thread deleted/404'd</td></tr>
                </table>
            </div>

        </div>
        `).insertBefore(".modal-cont .btn-wrap");
        $("ul.modal-nav").append('<li data-tab-ref="tab-settings-reports">Konfident+</li>');

        $('li[data-tab-ref="tab-settings-reports"]').click(function() {
                var $tab = $(this);
                if (!$tab.hasClass('tab-opened')) {
                    var $openedTab = $tab.parent().children('.tab-opened');
                    $openedTab.removeClass('tab-opened');
                    $('#' + $openedTab.data('tab-ref')).removeClass('opened');

                    $tab.addClass('tab-opened');
                    $('#' + $tab.data('tab-ref')).addClass('opened');
                }
        });

        $("input[name=report]").click((e)=>{
            addReport($(e.target).parent().find("input[name=reason]").first().val());
        });

        function clearReports(idArr = undefined){
            if(typeof idArr === "undefined"){
                localStorage.reports = "[]";
            } else {
                var rep = JSON.parse(localStorage.reports);
                rep.forEach((r, i)=>{
                    if(idArr.includes(r.id)){
                        rep.splice(i, 1);
                    }
                });
                localStorage.reports = JSON.stringify(rep);
            }
        }

        $(".myReportsButtons .btn-clear").click((e)=>{
            if(!confirm("Are you sure?")) return;
            clearReports();
            $('.myReportsTblContainer').html(getReportsTable());
        });

        var laddaCheck = Ladda.create(document.querySelector(".myReportsButtons .btn-check"));
        var laddaClear = Ladda.create(document.querySelector(".myReportsButtons .btn-clear"));

        $(".myReportsButtons .btn-check").click((e)=>{
            var toClear = [];
            var checked = 0;
            var banned = 0;
            var rows = $(".myReportsTblContainer table tr[data-id]");
            var checkedMax = rows.length;
            if(checkedMax === 0)return;
            laddaCheck.start();

            function checkingFinished(){
                laddaCheck.stop();
                $(".checkResult center").html(`Banned/Deleted: ${banned}/${checkedMax} (${((banned/checkedMax)*100).toPrecision(2)}%)`);

                $(".checkResult").slideDown();
                $(".checkResultButtons").slideDown();
                $(".closeCheckingResult").click(()=>{
                    $(".checkResult").hide();
                    $(".checkLegend").hide();
                    $(".checkResultButtons").hide();
                    $('.myReportsTblContainer').html(getReportsTable());
                });
                $(".clearBanned").click(()=>{
                    $(".checkResult").hide();
                    $(".checkLegend").hide();
                    $(".checkResult button").hide();
                    clearReports(toClear);
                    $('.myReportsTblContainer').html(getReportsTable());
                });

            }

            function markRow(row, type){
                $(row).find("a").css("opacity", "1");
                $(row).find("a").css("font-weight", "bold");
                switch(type){
                    case "banned":
                        $(row).find("a").css("color", "red");
                    break;
                    case "notbanned":
                        $(row).find("a").css("color", "green");
                    break;
                    case "deleted":
                        $(row).find("a").css("color", "yellow");
                    break;
                    case "404/deleted":
                        $(row).find("a").css("color", "#003399");
                    break;
                    case "404":
                        $(row).find("a").css("color", "black");
                    break;
                    case "wait":
                        $(row).find("a").css("opacity", "0.3");
                    break;
                }
            }
            $(".checkLegend").slideDown();

            rows.each(function(i, el){
                markRow(el, "wait");
                var url = $(el).find("a").first().attr("href");
                $.ajax({
                    type: "GET",
                    url: url,
                    success: function(data){
                        var nodes = $.parseHTML(data);
                        var reportedPost = $(".postContainer#pc"+el.dataset.id, nodes);
                        if(!reportedPost.length) {
                            markRow(el, "deleted");
                            toClear.push(el.dataset.id);
                            banned++;
                        } else if(reportedPost.find('blockquote b[style*="red"]').length || reportedPost.html().includes("USER WAS BANNED FOR THIS POST")) {
                            markRow(el, "banned");
                            toClear.push(el.dataset.id);
                            banned++;
                        } else {
                            markRow(el, "notbanned");
                        }
                    },
                    error: function(){
                        if(url.split("#")[0].includes(el.dataset.id)){ //zgłoszony został temat i jest spadnięty albo wyjebany
                            banned++;
                            markRow(el, "404/deleted");
                        } else {
                            markRow(el, "404");
                        }

                        toClear.push(el.dataset.id);
                    },
                    complete: function(){
                        checked++;
                        if(checked >= checkedMax){
                            checkingFinished();
                        }
                    }
                });
            });
        });

        $('.myReportsTblContainer').html(getReportsTable());
    });

    return {
        addReport: addReport,
        getReportsTable: getReportsTable,
        escapeHtml: escapeHtml,
    };
})();