// ==UserScript==
// @name         Open All
// @namespace    http*://*pvs.jnpr.net/jss-ciat/*
// @match        http*://*pvs.jnpr.net/jss-ciat/*
// @version      3.4
// @description  try to take over the world!
// @author       Derekli@juniper.net
// @grant        none
// @include      http*://*pvs.jnpr.net/jss-ciat/app/piir-hs*
// @include      http*://*dx-pvs.juniper.net/jss-ciat/app/piir-hs*
// @include      http*://*dx-pvs.juniper.net/jss-ciat/app/pbn-pr*
// @downloadURL https://update.greasyfork.org/scripts/375479/Open%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/375479/Open%20All.meta.js
// ==/UserScript==
//'use strict';
//Resolved:
    //Select open support both ciat and gnats.--requested by qi.
    //Dec 13 2018 
function AllPRNumber() {
    var listToCheck = [];
    for (i=0;i<$('tr.odd').length;i++) {
        if ( $('tr.odd')[i].id.length >= 6 && $('tr.odd')[i].id.length <= 8) {
            listToCheck.push($('tr.odd')[i].id);
        }
    }
    for (i=0;i<$('tr.odde').length;i++) {
        if ( $('tr.odde')[i].id.length >= 6 && $('tr.odde')[i].id.length <= 8) {
            listToCheck.push($('tr.odde')[i].id);
        }
    }
    for (i=0;i<$('tr.even').length;i++) {
        if ( $('tr.even')[i].id.length >= 6 && $('tr.even')[i].id.length <= 8) {
            listToCheck.push($('tr.even')[i].id);
        }
    }
    for (i=0;i<$('tr.evene').length;i++) {
        if ( $('tr.evene')[i].id.length >= 6 && $('tr.evene')[i].id.length <= 8) {
            listToCheck.push($('tr.evene')[i].id);
        }
    }
    for (i=0;i<$('tr.checked').length;i++) {
        if ( $('tr.checked')[i].id.length >= 6 && $('tr.checked')[i].id.length <= 8) {
            listToCheck.push($('tr.checked')[i].id);
        }
    }
    for (i=0;i<$('tr[bgcolor="FFF68F"]').length;i++) {
        if ( $('tr[bgcolor="FFF68F"]')[i].id.length >= 6 && $('tr[bgcolor="FFF68F"]')[i].id.length <= 8) {
            listToCheck.push($('tr[bgcolor="FFF68F"]')[i].id);
        }
    }
    return listToCheck;
}

function find_candidate_date(data) {
    td_list = $('#pbnStateTrans',data).find('tbody').find('td:contains("Candidate")').parent();
    for (i = 1; i <= td_list.length; i++) {
        if (td_list[td_list.length - i].children[0].innerHTML == "Candidate") {
            return td_list[td_list.length - i].children[1].innerHTML.trimLeft().slice(0, 10);
        }
        else {
            return false;
        }
    }
}

function PBNCandidateCheckforSinglePR (PRnumber,PIIR_id) {
    if (window.location.href.search('/pvs.juniper') >=0) {
        target_url='https://pvs.juniper.net/jss-ciat/app/pr-detail?prKey='+PRnumber+'&CURRENT_PAGE=piir_hs&SELECTED_PIIR_ORG=-1&PIIR_REPORT_ID='+PIIR_id;
    }
    else {
        target_url='https://dx-pvs.juniper.net/jss-ciat/app/pr-detail?prKey='+PRnumber+'&CURRENT_PAGE=piir_hs&SELECTED_PIIR_ORG=-1&PIIR_REPORT_ID='+PIIR_id;
    }
    $.ajax({
        type: 'GET',
        url: target_url,
        success: function(data) {
            if (data.search('<script>\\$\\("#pbnStatusSelectField"\\).val\\("CANDIDATE"\\)') >= 0) {
                td_list = $('#pbnStateTrans',data).find('tbody').find('td:contains("Candidate")').parent();
                for (i = 1; i <= td_list.length; i++) {
                    if (td_list[td_list.length - i].children[0].innerHTML == "Candidate") {
                        var result= td_list[td_list.length - i].children[2].innerHTML.trimLeft().slice(0, 10);
                    }
                }
                obj = parseDate(result);
                var rollover=false;
                C_day = obj.getDate();
                C_month = obj.getMonth() + 1;
                C_year = obj.getFullYear();
                candidateUTC=obj.getTime();
                currentUTC= Date.now();
                candidatePeriod= parseInt((currentUTC - candidateUTC)/(1000*3600*24));
                obj1 = parseDate($('#gnatsArrivalDateSpanId',data).text().trimLeft().slice(0, 10));
                A_day = obj1.getDate();
                A_month = obj1.getMonth() + 1;
                A_year = obj1.getFullYear();
                obj = new Date();
                N_day = obj.getDate();
                N_year = obj.getFullYear();
                if (obj.getMonth()+3 > 12) {
                    N_month=(obj.getMonth()+3)%12;
                    N_year+=1;
                } else if  (obj.getMonth()+3 == 12) {
                    N_month=12;
                }
                else {
                    N_month=obj.getMonth()+3;
                }
                ArrivalDatelessThanOneYear = Date.parse(N_year - 1 + "/" + N_month + "/" + N_day) <= Date.parse(A_year + "/" + A_month + "/" + A_day);
                // CandidateDatelessThanOneYear = Date.parse(N_year - 1 + "/" + N_month + "/" + N_day) <= Date.parse(C_year + "/" + C_month + "/" + C_day);
                jtacCaseNumber=$('#numberOfOccurancesSpanId',data).text().split('/')[0];

                if ($('#gnatsCustomerRiskSpanId',data).text() === "minor" ) {
                    minorTag=true;
                }
                else {
                    minorTag=false;
                }
                fixedTag=false
                if ($('#gnatsResolvedSpanId',data).text().trim().length >7) {
            fixedTag=true;
                }
                else if ($('table#scopeTableId label',data).length >0) {
                    index= $('table#scopeTableId label',data).length /30;
                    for (i=0;i<index;i++) {
                        if ($('table#scopeTableId label',data)[9+i*30].innerHTML == "&nbsp;fixed"  && $('table#scopeTableId label',data)[8+i*30].innerHTML.search("Resolution") > 0)
                        {
                            fixedTag=true;
                            break;
                        }
                    }
                }
                problemLevel=$('#gnatsProbSpanId',data).text();
                if ($('#gnatsProbSpanId',data).text().search('CL') > 1 && fixedTag)  {
                    CLtag=true;
                    ILtag=false;
                }
                else if ($('#gnatsProbSpanId',data).text().search('3-IL1') >=0 && $('#gnatsShareWithCustomersSpanId',data).text().trim() ==='yes' && fixedTag) {
                    ILtag=true;
                    CLtag=false;
                }
                else {
                    ILtag=false;
                    CLtag=false;
                }
                if (ILtag || CLtag) {
                    problemTag=true;
                }
                else {
                    problemTag=false;
                }

                if (ArrivalDatelessThanOneYear && problemTag) {
                        if ($('#gnatsCustomerRiskSpanId',data).text() === "major" || $('#gnatsCustomerRiskSpanId',data).text() === "critical") {
                            var idstring='#'+PRnumber;
                            $($(idstring).children()[1]).attr('style','background-color:#2eb82e');
                            if (candidatePeriod < 60) {
                                $(idstring).children()[1].innerHTML += '<br><br>Candidate Age:<br><br><b style= "font-size:20px;color:red">' + candidatePeriod +'</b>';
                            }
                            else {
                                $(idstring).children()[1].innerHTML += '<br><br>Candidate Age:<br><br><b style="font-size:20px;">' + candidatePeriod +'</b>';
                            }
                        }
                        else if (minorTag){
                            var idstring='#'+PRnumber;
                            $($(idstring).children()[1]).attr('style','background-color:#e6e600');

                        }
                        else {
                            var idstring='#'+PRnumber;
                            $($(idstring).children()[1]).attr('style','background-color:#cc0000');
                        }
                } else {
                    if (data.search('<script>\\$\\("#pbnStatusSelectField"\\).val\\("CANDIDATE"\\)') >= 0) {
                        var idstring='#'+PRnumber;
                        $($(idstring).children()[1]).attr('style','background-color:#cc0000');
                    }
                }
            }
        }
    });
}

function PBNCandidateInTime() {
    var listToCheck = AllPRNumber();
    console.log(listToCheck);
    var PIIR_ID= $('#piirReportId').val();
    for (i=0;i<listToCheck.length;i++) {
        var result =PBNCandidateCheckforSinglePR(listToCheck[i],PIIR_ID);
    }
}
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}
function uncheck_all () {
    list=$('#offTblBdy').find('tr[class="checked"]');
    list_length=list.length;
    for (i=0;i<list_length;i++) {
        list[i].children[0].children[0].click();
}
}
function check_all () {
    list=$('#offTblBdy').find('input[name="gnatsNumber"]');
    list_length=list.length;
    for (i=0;i<list_length;i++) {
        list[i].click();
}
}
function open_ciat_gnats (string) {
    list=$('#offTblBdy').find('tr[class="'+string+'"]');
    list_length=list.length;
    for (i=0;i<list_length;i++) {
        $(list[i].children[1]).find('a')[0].click();
        $(list[i].children[1]).find('a')[1].click();
    }
}


function select_radio_button (string) {
    list=$('#offTblBdy').find('tr[class="'+string+'"]');
    list_length=list.length;
    if (string=="even") {
        list_length-=2;
    }
    for (i=0;i<list_length;i++) {
        list[i].children[0].children[0].click();
}
}

function open_ciat_gnats_all () {
    list=$('#offTblBdy').find('input[id=gnatsNumber]');
    list_length=list.length;
    for (i=0;i<list_length;i++) {
        if ($('#checkboxciat')[0].checked) {
            $(list[i].parentNode.nextSibling.nextSibling).find('a')[0].click();
        }
        if ($('#checkboxgnats')[0].checked) {
            $(list[i].parentNode.nextSibling.nextSibling).find('a')[1].click();
        }
    }
}

function open_selected () {
    list=$('#offTblBdy').find('input[id=gnatsNumber]');
    list_length=list.length;
    for (i=0;i<list_length;i++) {
        if (list[i].checked === true) {
            if ($('#checkboxciat')[0].checked) {
                $(list[i].parentNode.nextSibling.nextSibling).find('a')[0].click();
            }
            if ($('#checkboxgnats')[0].checked) {
                $(list[i].parentNode.nextSibling.nextSibling).find('a')[1].click();
            }
        }
    }
}
function go_to_page () {
     var page_number=$('#input_box_id_for_pr_list').val();
     page_int=parseInt(page_number);
     gotoPage(page_int);
}

function open_pr_list () {
    var pr_list=$('#input_box_id_for_pr_list').val().replace(/ /g,",");
    pr_list=pr_list.split(',');
    for (i=0;i<=pr_list.length;i++) {
        if ($('#checkboxciat')[0].checked) {
            window.open("https://dx-pvs.juniper.net/jss-ciat/app/pr-detail?prKey="+pr_list[i].toString()+"&CURRENT_PAGE=piir_hs&SELECTED_PIIR_ORG="+$('#org').val()+"&PIIR_REPORT_ID="+$('#piirReportId').val());
        }
        if ($('#checkboxgnats')[0].checked) {
            window.open("https://gnats.juniper.net/web/default/"+pr_list[i].toString());
        }
    }
}

var strip= document.createElement("input");
strip.type='button';
strip.name='strip';
strip.value=" Strip ";

var blank= document.createElement("input");
blank.type='button';
blank.name='blank';
blank.value=" Blank ";
blank.setAttributes="hidden";

var btn_all= document.createElement("input");
btn_all.type='button';
btn_all.name='btn_all';
btn_all.value="Open All";

var ciat= document.createElement("input");
ciat.type='checkbox';
ciat.id="checkboxciat";
ciat.checked=true;

var notes= document.createElement("strong");
notes.innerHTML="CIAT";

var notes1= document.createElement("strong");
notes1.innerHTML="Gnats";

var gnats= document.createElement("input");
gnats.type='checkbox';
gnats.id="checkboxgnats";
gnats.checked=true;

var selected_btn= document.createElement("input");
selected_btn.type='button';
selected_btn.name='Selected_btn';
selected_btn.value=" Selected ";

var uncheck= document.createElement("input");
uncheck.type='button';
uncheck.name='uncheck_btn';
uncheck.value=" Uncheck All";

var check= document.createElement("input");
check.type='button';
check.name='check_btn';
check.value="Inverse Check";

var input_box=document.createElement("input");
input_box.name='input_box';
input_box.placeholder="PR list or Page No";
input_box.id="input_box_id_for_pr_list";

var go_btn=document.createElement("input");
go_btn.type='button';
go_btn.name='Goto';
go_btn.value="Goto";

function add_button_1 () {

    $('#container-1').contents()[1].appendChild(ciat);
    $('#container-1').contents()[1].appendChild(notes);
    $('#container-1').contents()[1].appendChild(gnats);
    $('#container-1').contents()[1].appendChild(notes1);
    $('#container-1').contents()[1].appendChild(btn_all);
    $('#container-1').contents()[1].appendChild(uncheck);
    $('#container-1').contents()[1].appendChild(check);
    $('#container-1').contents()[1].appendChild(input_box);
    $('#container-1').contents()[1].appendChild(go_btn);
    $('#container-1').contents()[1].appendChild(selected_btn);


    $('#container-1').find('input[name="btn_all"]').addClass('button');
    $('#container-1').find('input[name="ciat"]').addClass('button');
    $('#container-1').find('input[name="gnats"]').addClass('button');
    $('#container-1').find('input[name="check_btn"]').addClass('button');
    $('#container-1').find('input[name="uncheck_btn"]').addClass('button');
    $('#container-1').find('input[name="Goto"]').addClass('button');
    $('#container-1').find('input[name="Selected_btn"]').addClass('button');

    $('#container-1').find('input[name="btn_all"]').click(function () {open_ciat_gnats_all();});
    $('#input_box_id_for_pr_list').css('height',12);
    $('#input_box_id_for_pr_list').css('width',110);
    

    $('#container-1').find('input[name="uncheck_btn"]').click(function () {uncheck_all();});
    $('#container-1').find('input[name="check_btn"]').click(function () {check_all();});
    $('#container-1').find('input[name="Goto"]').click(function () {go_to_page();});
    $('#container-1').find('input[name="Selected_btn"]').click(function () {if ($('#input_box_id_for_pr_list').val().length > 1){open_pr_list();} else {open_selected();}});
}

$(function() {
    add_button_1();
    var PBNC = document.createElement('input');
    PBNC.type = 'button';
    PBNC.name = 'PBNCandidate';
    PBNC.id = 'id_PBN_Candidate';
    PBNC.setAttribute('class', 'button');
    PBNC.value = 'PBN Candidate';
    $('#container-1').contents()[1].appendChild(PBNC);
    $('#container-1').find('input[name="PBNCandidate"]').addClass('button');
    $('#container-1').find('input[name="PBNCandidate"]').click(function () {PBNCandidateInTime();});
});