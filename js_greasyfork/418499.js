// ==UserScript==
// @name         Netflix DataTable
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  search/sort movies and TV shows by imdb scores usign Datatables!
// @author       Ercumend Oyuktas
// @match        https://www.netflix.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://greasyfork.org/scripts/390115-imdb-utility-library-api/code/IMDb%20Utility%20Library%20(API).js?version=733074
// @connect      omdbapi.com
// @connect      imdb.com
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.21/js/jquery.dataTables.min.js
// @resource     https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.21/css/dataTables.bootstrap.min.css
// https://cdn.datatables.net/v/dt/dt-1.10.22/datatables.min.js
// https://cdn.datatables.net/v/dt/dt-1.10.22/datatables.min.css
// @downloadURL https://update.greasyfork.org/scripts/418499/Netflix%20DataTable.user.js
// @updateURL https://update.greasyfork.org/scripts/418499/Netflix%20DataTable.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('Hi Netflix');

    var titles = {};
    var jobrunning = false;
    var docHeight = 0;
    var debug = false;


    var ImdbMaxRequest = 10;
    var ImdbCurrentRequest = 0;

    InitUI();

    function ImdbJob() {
        var titles_withoutData = $.map(Object.keys(titles), function (val, i) {
            if(titles[val].data === undefined && titles[val].retry <= 2 )
                return val;
            });
        var freeRequest = ImdbMaxRequest - ImdbCurrentRequest;

        var que = titles_withoutData.slice(0, freeRequest);

        if(debug)
            console.log(titles_withoutData.length,freeRequest,que)

        $("#lblIMDBQueryStatus").html(`Query (Left: ${titles_withoutData.length} / InProgress: ${ImdbCurrentRequest})`);


        $.each(que,function(i,val){
            GetImdbInfoByTitleName(val);
        })

        if(titles_withoutData.length > 0 && jobrunning ) {
            setTimeout(ImdbJob, 500);
        }else if (titles_withoutData.length == 0){
            if(debug)
                console.log('All movies were queried.job completed')

//             $("#btnList").show();
            $("#lblIMDBQueryStatus").hide()
            $("#btnStart").hide();

            setTimeout(function() {window.scrollTo(0, 0) }, 5000);
            updateDataTable();
            if(debug)
                console.log(titles);
        }

    }

    function GetImdbInfoByTitleName(titleName) {
        ImdbCurrentRequest = ImdbCurrentRequest + 1
        getImdbInfoFromTitle(titleName).then((data) => {
            UpdateErcuDiv(data, titleName)
        }).catch((err) => {
            if(debug)
                console.log(`Error getting data for ${titleName}: ${err}`);
            titles[titleName].error = `Error getting data for ${titleName}: ${err}`;
        }).finally(() => {
            ImdbCurrentRequest = ImdbCurrentRequest - 1
            titles[titleName].retry = titles[titleName].retry + 1;
        });

    }

    function UpdateErcuDiv(data, titleName) {
        var titleInfoDiv = $(titles[titleName].container).find('div[class=ercu-title-info]');


//         window.scrollTo(0, $(titles[titleName].container).offset().top);


        var imdbInfo = titleName + ' [' + data.year + '] </br> ' + data.rating;
        titles[titleName].data = data;
        titleInfoDiv.html(imdbInfo);
        if(debug)
            console.log('[' + titleName + '] info loaded.');

    }


    function GetTitles() {
        //var title_cards = $(".title-card-container");
        var title_cards = $(".slider-item");

        $.each(title_cards, function (index, value) {
            var titleName = GetTitleName(value);
            if (titles[titleName] === undefined) {
                titles[titleName] = {
                    name: titleName,
                    retry : 0,
                    container: value
                }
            }
        });

        $("#lblLoaded").html('Titles loaded: ' + Object.keys(titles).length );

    }

    function GetTitleName(titleElm) {
        //titleElm.filter("[class~='apple']");
        var ret = $(titleElm).find('a').attr('aria-label').trim();
        return ret;

    }

    function InitUI() {
        var myStyle =
            ['<style>',
            '.ercu-title-info { background: #d04400;font-size: larger;text-align: center; }',
            '.ercu-tool-div { background: #1d1c1c;font-size: larger;text-align: left;padding:6px }',
            '.ercu-button { background: #822a00;text-align: center;padding: 4px 8px;margin: 4px;border: 0px; color:white;font-size: 12px;}',
            '.ercu-label {background: #141414;text-align: center;padding: 4px 8px;margin: 4px;border: 0px;color: white;font-size: 12px;}',
            'table.dataTable tbody tr {background-color: #1d1c1c !important;font-size: small !important;}',
            'table.dataTable.hover tbody tr:hover, table.dataTable.display tbody tr:hover {background-color: #07653e !important; cursor: pointer !important;}',
            'table.dataTable thead .sorting_asc, .sorting_desc {font-size: small !important;background-color: #9c3301 !important;}',
            'table.dataTable thead .sorting {font-size: small !important;background-color: #822b02 !important;}',
            '.dataTables_wrapper {background-color: #252d31 !important;}',
            '.dataTables_wrapper .dataTables_length, .dataTables_wrapper .dataTables_filter, .dataTables_wrapper .dataTables_info, .dataTables_wrapper .dataTables_processing, .dataTables_wrapper .dataTables_paginate .paginate_button{color: #a0a0a0 !important; margin: 8px !important }',
            'table.dataTable.cell-border tbody tr th:first-child, table.dataTable.cell-border tbody tr td:first-child {border-left: 1px solid #2b2b2b !important;}',
            'table.dataTable.cell-border tbody th, table.dataTable.cell-border tbody td {border-top: 1px solid #2b2b2b !important;border-right: 1px solid #2b2b2b !important;}',
            '</style>'
        ].join('\n');

        //     $( "<style>.ercu-title-info { background: #d04400;font-size: larger;text-align: center; }</style>" ).appendTo( "head" )
        $("head").append(myStyle);
        $("head").append('<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/dt-1.10.22/datatables.min.css"/>')
        $(".aro-genre-details").prepend('<div class="genreTitle ercu-tool-div"></div>')
//         $(".ercu-tool-div").append('<button id=btnList style="display:none" class="ercu-button">Export</button>')
        $(".ercu-tool-div").append('<button id=btnStart style="display:none" class="ercu-button">Start</button>')
        $(".ercu-tool-div").append('<span id=lblLoaded class="ercu-label">0</span>')
        $(".ercu-tool-div").append('<span id=lblIMDBQueryStatus class="ercu-label">0</span>')

        var resultDataTable =
            ['<div style="background:black;padding:20px">',
            '<table id="dtTitles" class="cell-border hover" style="width:100%;color:#a5a5a5">',
            '  <thead>',
            '    <tr>',
            '      <th>Title</th>',
            '      <th>Year</th>',
            '      <th>Rating</th>',
            '      <th>Description</th>',
            '    </tr>',
            '  </thead>',
            '</table>',
            '</div>'
        ].join('\n');
        $("body").prepend(resultDataTable);

        $("#dtTitles").DataTable();


        $("#btnStart").on('click',function(e){
            jobrunning = !jobrunning;
            $(e.target).html(jobrunning ? 'Stop':'Start');
            if(jobrunning)
                ImdbJob();
        });

        $(window).scroll(function (e) {
            GetTitles();
        })

        AutoScrollToEnd();

    }

    function AutoScrollToEnd() {
        if (document.body.scrollHeight > docHeight) {
            docHeight = document.body.scrollHeight;
            window.scrollTo(0, docHeight);
            setTimeout(AutoScrollToEnd, 1000);
        } else
            OnAutoScrollEnded();
    }

    function OnAutoScrollEnded() {
        window.scrollTo(0, 0);
        AddInfoDivs();
        $("#btnStart").show();
        updateDataTable();


    }

    function updateDataTable(){
        var tableData = $.map(Object.keys(titles), function (val, i) {
            var titleItem = titles[val];
            var titleName = titleItem.name;
            if (titleItem.error !== undefined)
                return [[titleItem.name,'?','?',titleItem.error]];
            else if (titleItem.data === undefined)
                return [[titleItem.name,null,null,null]];
            else
                return [[titleItem.name,titleItem.data.year,titleItem.data.rating,titleItem.data.description]];
            var titleYear = titleItem.data === undefined ? null : titleItem.data.year;

        });

        var dataTable = $('#dtTitles').DataTable();


        dataTable.clear();
        dataTable.rows.add(tableData);
        dataTable.draw();
    }

    function AddInfoDivs() {
        $.each(Object.keys(titles), function (i, key) {
            var titleName = titles[key].name;
            //var titleInfoDiv = $(titles[key].container).find('div[class=ercu-title-info]');
            if ($(titles[key].container).find('div[class=ercu-title-info]').length == 0) {
                $(titles[key].container).append('<div class="ercu-title-info">...</div>');
            }
        });

    }

})();