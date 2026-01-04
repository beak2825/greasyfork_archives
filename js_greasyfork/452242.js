// ==UserScript==
// @name         Rigor Helper
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  try to take over the world!
// @author       LMA
// @match        https://monitoring.rigor.com/checks/real-browsers
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rigor.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452242/Rigor%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/452242/Rigor%20Helper.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

//Additionnal CSS
GM_addStyle(
`
tbody > .even> td:nth-child(4){
display:none;
}
tbody > .odd> td:nth-child(4){
  display:none;
}
thead .DataTable:nth-child(4){
  display:none;
}

.styled{
  	background-repeat: no-repeat;
    color: transparent;
    background-size: cover;
    background-position: center;
    display: inline-block;
    margin-right: 1px;
  	width: 26px;
    height: 15px;
  	vertical-align: middle;
  	margin-bottom: 1px;
}

.FR_Country{
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5MDAgNjAwIj4NCjxwYXRoIGZpbGw9IiNlZDI5MzkiIGQ9Im0wLDBoOTAwdjYwMGgtOTAweiIvPg0KPHBhdGggZmlsbD0iI2ZmZiIgZD0ibTAsMGg2MDB2NjAwaC02MDB6Ii8+DQo8cGF0aCBmaWxsPSIjMDAyMzk1IiBkPSJtMCwwaDMwMHY2MDBoLTMwMHoiLz4NCjwvc3ZnPg0K') !important;
}
.UK_Country{
    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMjUgMTUiIGhlaWdodD0iNzIwIj4NCjxwYXRoIGZpbGw9IiNmZmYiIGQ9Im0wLDBoMjV2MTVoLTI1eiIvPg0KPGcgZmlsbD0iI2NmMTQyYiI+DQo8cGF0aCBkPSJtMTEsMGgzdjE1aC0zeiIvPg0KPHBhdGggZD0ibTAsNmgyNXYzaC0yNXoiLz4NCjwvZz4NCjwvc3ZnPg0K') !important;
}
.ES_Country{
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3NTAgNTAwIj4NCjxwYXRoIGZpbGw9IiNjNjBiMWUiIGQ9Im0wLDBoNzUwdjUwMGgtNzUweiIvPg0KPHBhdGggZmlsbD0iI2ZmYzQwMCIgZD0ibTAsMTI1aDc1MHYyNTBoLTc1MHoiLz4NCjwvc3ZnPg0K') !important;
}
.IT_Country{
  	background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBoZWlnaHQ9IjEwMDAiIHZpZXdCb3g9IjAgMCAzIDIiPg0KPHBhdGggZmlsbD0iIzAwOTI0NiIgZD0ibTAsMGgxdjJoLTF6Ii8+DQo8cGF0aCBmaWxsPSIjZmZmIiBkPSJtMSwwaDF2MmgtMXoiLz4NCjxwYXRoIGZpbGw9IiNjZTJiMzciIGQ9Im0yLDBoMXYyaC0xeiIvPg0KPC9zdmc+DQo=') !important;
}
.BE_Country{
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NTAgMzkwIj4NCjxwYXRoIGQ9Im0wLDBoMTUwdjM5MGgtMTUweiIvPg0KPHBhdGggZmlsbD0iI2ZmZGUwMCIgZD0ibTE1MCwwaDE1MHYzOTBoLTE1MHoiLz4NCjxwYXRoIGZpbGw9IiNlMDAiIGQ9Im0zMDAsMGgxNTB2MzkwaC0xNTB6Ii8+DQo8L3N2Zz4NCg==') !important;
}
.DE_Country{
    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDUgMyI+DQo8cGF0aCBkPSJtMCwwaDV2M2gtNXoiLz4NCjxwYXRoIGZpbGw9IiNkMDAiIGQ9Im0wLDFoNXYyaC01eiIvPg0KPHBhdGggZmlsbD0iI2ZmY2UwMCIgZD0ibTAsMmg1djFoLTV6Ii8+DQo8L3N2Zz4NCg==') !important;
}
.PT_Country{
    background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHJlY3QgeT0iODUuMzM3IiBzdHlsZT0iZmlsbDojRDgwMDI3OyIgd2lkdGg9IjUxMiIgaGVpZ2h0PSIzNDEuMzI2Ii8+Cjxwb2x5Z29uIHN0eWxlPSJmaWxsOiM2REE1NDQ7IiBwb2ludHM9IjE5Ni42NDEsODUuMzM3IDE5Ni42NDEsMjYxLjU2NSAxOTYuNjQxLDQyNi42NjMgMCw0MjYuNjYzIDAsODUuMzM3ICIvPgo8Y2lyY2xlIHN0eWxlPSJmaWxsOiNGRkRBNDQ7IiBjeD0iMTk2LjY0MSIgY3k9IjI1NiIgcj0iNjQiLz4KPHBhdGggc3R5bGU9ImZpbGw6I0Q4MDAyNzsiIGQ9Ik0xNjAuNjM4LDIyNHY0MC4wMDFjMCwxOS44ODIsMTYuMTE4LDM2LDM2LDM2czM2LTE2LjExOCwzNi0zNlYyMjRIMTYwLjYzOHoiLz4KPHBhdGggc3R5bGU9ImZpbGw6I0YwRjBGMDsiIGQ9Ik0xOTYuNjM4LDI3NmMtNi42MTcsMC0xMi01LjM4My0xMi0xMnYtMTZoMjQuMDAxdjE2QzIwOC42MzgsMjcwLjYxNiwyMDMuMjU0LDI3NiwxOTYuNjM4LDI3NnoiLz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==') !important;
}

.ACB2C_color{
 	background : #e9d2a8 !important;
}
.APB2C_color{
 	background : #c2dbea !important;
}
.DSB2C_color{
 	background : #edecb6 !important;
}
.OVB2C_color{
 	background : #ecc5d3 !important;
}
.VXB2C_color{
 	background : #d8f1d7 !important;
}

.ACB2B_color{
 	background : #dbbe8c !important;
}
.APB2B_color{
  background : #a4c4d6 !important;
}
.DSB2B_color{
  background : #d8d693 !important;
}
.OVB2B_color{
 	background : #ecc5d3 !important;
}
.VXB2B_color{
 	background : #d8f1d7 !important;
}

#checks_table > tbody > tr a{
  	color : black !important;
    font-size: 112%;
}
`
);

//First run
setTimeout(function() {updateColors();}, 1500);

//On sorting
$('#checks_table > thead > tr').click(function(){
    setTimeout(function() {updateColors();}, 1500);
})

//On focus on search filter
var myInterval;
function myTimer() {
    if ($('#checks_table_processing').css('display')=='block'){
        setTimeout(function() {updateColors();}, 1500);
    }
}
$('#checks_table_filter > label > input').focus(function(){
    myInterval = setInterval(myTimer, 400);
}).focusout(function(){
    clearInterval(myInterval);
});

const header = $('#content > div > div > div.row > div > div > div.box-header > h2').html();

function updateColors(){
    $("#checks_table > tbody > tr > td.first-column.links-anchor-width > a").each(function(){

        var prob_name = $(this).text();
        var tr = $(this).parent().parent();
        var findTerm = (brand) => {
            if (prob_name.includes(brand)){
                return prob_name;
            }
        };
        var color = "B2C_color";
        if(prob_name == findTerm("B2B")){color = "B2B_color";}

        //Add row color per brand
        switch (prob_name) {
            case findTerm("AC"):
            case findTerm("O2C"):
                tr.addClass('AC'+color);
                break;
            case findTerm("AP"):
                tr.addClass('AP'+color);
                break;
            case findTerm("DS"):
                tr.addClass('DS'+color);
                break;
            case findTerm("OV"):
                tr.addClass('OV'+color);
                break;
            case findTerm("VX"):
                tr.addClass('VX'+color);
                break;
        }

        //Add country icon
        switch (prob_name) {
            case findTerm("FR"):
                if(!$(this).find('i').hasClass('FR_Country styled')){$(this).find('i').removeClass('fa fa-globe').addClass("FR_Country styled");}
                break;
            case findTerm("UK"):
                if(!$(this).find('i').hasClass('UK_Country styled')){$(this).find('i').removeClass('fa fa-globe').addClass("UK_Country styled");}
                break;
            case findTerm("ES"):
                if(!$(this).find('i').hasClass('ES_Country styled')){$(this).find('i').removeClass('fa fa-globe').addClass("ES_Country styled");}
                break;
            case findTerm("IT"):
                if(!$(this).find('i').hasClass('IT_Country styled')){$(this).find('i').removeClass('fa fa-globe').addClass("IT_Country styled");}
                break;
            case findTerm("BE"):
                if(!$(this).find('i').hasClass('BE_Country styled')){$(this).find('i').removeClass('fa fa-globe').addClass("BE_Country styled");}
                break;
            case findTerm("DE"):
                if(!$(this).find('i').hasClass('DE_Country styled')){$(this).find('i').removeClass('fa fa-globe').addClass("DE_Country styled");}
                break;
            case findTerm("PT"):
                if(!$(this).find('i').hasClass('PT_Country styled')){$(this).find('i').removeClass('fa fa-globe').addClass("PT_Country styled");}
                break;
        }
    });

    //Add probs count
    var probsNumber = $('#checks_table > tbody >tr').length;
    $('#content > div > div > div.row > div > div > div.box-header > h2').empty().html(probsNumber + ' ' + header);
}