// ==UserScript==
// @name         lgwindow
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        https://dx-pvs.juniper.net/jss-ciat/app/search-pbn*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16513/lgwindow.user.js
// @updateURL https://update.greasyfork.org/scripts/16513/lgwindow.meta.js
// ==/UserScript==



function ttttt() {
    //trim(input2.value);
    prodc = input2.value.split(/[,\n]+/).map(Number); //Need to add more check options.
    console.log('value in input ' + prodc);
    for (var i = 0; i < prodc.length; i++) {
        pubpr(prodc[i]);
    }
}

//var sigpr;
//var xigpr;
//var myform;

allorg = [9061,1083,15588,3056,11046,11603,15567,9869,10342,955,689,10436,573,9845,10441,10440,10442,15628,11646,582,1934,15609,805,15530,15638,4416,581,9562,11498,3712,15599,15889,15888,12130,10735,9618,9944,606,599,1919,600,15703,954,9882,869,787,15828,12074,-1,829,1274,9038,15761,10591,9977,634,11224,8916,10425,653,9049,1154,1905,852,14346,15527,9636,1354,3185,661,10339,566,1916,11522,10313,10443,794,9344,4010,1915,605,9050,15618,1278,564,9836,1654,9545,607,10733,9066,15798,15696,12096,690,9060,3077,603,11573,11497,9537,714];

function pubpr(pr) {
    PBNInformCustomerSvcImpl.isSirtReviewPR(parseInt(pr, 10), {
        callback: function(value) {
            if (true === value) {
                $('#prlist3')[0].value += (pr + ': SIRT review ?');
                return;
            }
            else {
                var params = {gnatsNumber : pr ,method : 'checkUserPBNPermissions'};
                $.post('https://dx-pvs.juniper.net/jss-ciat/app/pbn-pr', params, function(data){	
                    if(data == 'false'){
                        if(confirm("You do not have the necessary permissions to 'Create a PBN'")) {
                            return;
                        } 				
                    }  else if (data == 'PBNStateError') {
                        //alert("PBN can be created only for 'Debating' or 'Published' PRs.");
                        $('#prlist3')[0].value += ( pr + ': State is not Debating/Published\n');
                        return;
                    }
                    else { 
                        $('#prlist4')[0].value += ('Processing '+ pr +'....\n');
                        var loggfun = function() {
                            $('#prlist4')[0].value += ('Processing '+ pr +'....\n');
                        };
                        var logg = setInterval(loggfun, 60000);
                        $.ajax({
                            type: 'POST',
                            url : 'https://dx-pvs.juniper.net/jss-ciat/app/search-pbn?_search=true',
                            traditional: true,
                            data:{
                                currentStartIdx:0,
                                hidePanel:false,
                                orgId: allorg,
                                originalBugID:  pr,
                                selectAllOgs:'on',
                                orgIds: 1274,
                                jbtIssueID: pr,
                                searchType:'N',
                                devicesFoundFlag:false,
                                checkall:'on',
                                tmpinformType:'Device',
                                tmpcache_id:0,
                                tmpchassis:0,
                                tmpDevicesFoundFlag:false,
                            },
                            success: function(data) {
                                //sigpr = data; //used to global debug, ignore
                                clearInterval(logg);
                                $('#prlist4')[0].value += ('Got reply: '+ pr +'\n');
                                var genericflag, orgs;
                                var len = $('#resultsTable > tbody tr', data).length;
                                if (len > 0) {
                                    orgs = $('#orgIds', data).val();
                                    genericflag = 'C';
                                }
                                else {
                                    orgs = 1274;
                                    genericflag = 'G';
                                }
                                var jbtIssueID = $('#jbtIssueID', data).val();
                                var searchType = $('#searchType', data).val();
                                console.log(len + ' ' + searchType +  ' ----> ');
                                //console.log(data);
                                var intype = $('#menuOptions', data).val();
                                if (intype == '1') intype = 'Device';
                                else intype = 'Relevance';
                                var dff = $('#devicesFoundFlag', data).val();
                                console.log('fixed');
                                var cache_id_temp = $('input[name="cache_id"]', data);
                                var cache_id = cache_id_temp.map(function(val) { if($(this).val() !== '') return $(this).val()  } ).get().join(',');
                                if (cache_id === '') cache_id = 0;
                                var chassis_temp = $('input[name="cache_id"]', data);
                                var chassis = chassis_temp.map(function(val) { if($(this).val() !== '') return $(this).val()  } ).get().join(',');
                                if (chassis === 0) chassis = 0;
                                var ftype = $('#searchType', data).val();
                                $.ajax({
                                    type: 'POST',
                                    url: 'https://dx-pvs.juniper.net/jss-ciat/app/pbn-display-inform',
                                    data: {
                                        orgIds: orgs,
                                        jbtIssueID: pr,
                                        searchType: ftype,
                                        informType: intype,
                                        cache_id: cache_id,
                                        chassis: chassis,
                                        devicesFoundFlag: dff
                                    },
                                    success: function(data) {
                                        console.log('now step 2');
                                        //xigpr = data; //used to global debug, ignore                   
                                        //myform = form;  //used to global debug, ignore
                                        var recom1 = $('#instructions', data);
                                        var recom2 = $('#instructions', data).val();
                                        if ( recom1 === null || recom2 === '' ) {
                                            console.log('Recommandation missed for PR ' +  pr);
                                            $('#prlist3')[0].value += ( pr +': Recommandation missed' + '\n');
                                            return;
                                        }
                                        var title1 = $('#title', data);
                                        var title2 = $('#title', data).val();
                                        if ( title1 === null || title2 === '' ) {
                                            console.log('Missing title for PR ' +  pr);
                                            $('#prlist3')[0].value += ( pr + ': Title missed  ' +  '\n');
                                            return;
                                        }
                                        var shareval = $('#shareWithCustomers', data).val();
                                        if (shareval == 'no') {
                                            console.log('share with customer is not correct for PR ' +  pr);
                                            $('#prlist3')[0].value += ( pr + ': Share with Customer incorrect ' + '\n');
                                            return;
                                        }
                                        //$('#prlist1')[0].value += ( pr + ' OK ' + genericflag + '\n');
                                        //form.submit();
                                        var form = $(data)[55];

                                        $.ajax({
                                            type: 'POST',
                                            url : 'https://dx-pvs.juniper.net/jss-ciat/app/pbn-create-inform',
                                            data: $(form).serialize(),
                                            success: function(data) {
                                                $('#prlist1')[0].value += ( pr + ' OK ' + genericflag + '\n');
                                            }
                                        })
                                    }
                                })
                            }
                        }) 
                    }
                })
            }
        }
    })
}

//https://code.jquery.com/jquery-1.10.2.js

var input2 = document.createElement('textarea');
input2.id = 'prlist';
input2.maxLength = '5000';
input2.cols = '10';
input2.rows = '20';
input2.placeholder = 'Input PR list here';

var input1 = document.createElement('textarea');
input1.id = 'prlist1';
input1.maxLength = '5000';
input1.cols = '20';
input1.rows = '20';
input1.placeholder = 'Success log';
input1.style.borderRadius = '10px';
input1.style.backgroundColor = "#C6EACC";
input1.readOnly = true;

var input3 = document.createElement('textarea');
input3.id = 'prlist3';
input3.maxLength = '5000';
input3.cols = '45';
input3.rows = '20';
input3.placeholder = 'Error log';
input3.style.borderRadius = '10px';
input3.style.backgroundColor = 'rgba(0, 204, 255, 0.14902)';
input3.readOnly = true;

var input4 = document.createElement('textarea');
input4.id = 'prlist4';
input4.maxLength = '5000';
input4.cols = '45';
input4.rows = '20';
input4.placeholder = 'Procesing log';
input4.style.borderRadius = '10px';
input4.style.marginLeft = '20px';
input4.style.backgroundColor = '#BDC59D';
input4.readOnly = true;


var addprob = document.createElement('input');
addprob.type = 'button';
addprob.id = 'topub';
addprob.setAttribute('class', 'button');
addprob.value = 'GO';
addprob.style.cssText = 'color:#f3f3f3;background-color: rgb(92, 184, 92);border-color: rgb(76, 174, 76); margin-bottom: 6px; vertical-align:bottom;';
addprob.onclick = ttttt;

$(document).ready(function(){
    //$('td:last' ,$('tr', $('#pbnForm table').eq(1)).eq(1) ).append(input2);
    rls = $('#searchResults');
    rls.append(input2);
    rls.append(addprob);
    rls.append(input4);
    rls.append(input1);
    rls.append(input3);
    //input2.parentNode.appendChild(input1);
    //input2.parentNode.appendChild(input3);
    //$('td:last' ,$('tr', $('#pbnForm table').eq(1)).eq(0) ).append(addprob);
    //var suclog = $('#prlist1')[0];
    //var errlog = $('#prlist3')[0];
})
/*
x = document.createElement('script');
x.setAttribute('type', 'text/javascript');
x.setAttribute('src', "../js/thickbox.js?version=286")
document.getElementsByTagName('head')[0].appendChild(x);
*/
