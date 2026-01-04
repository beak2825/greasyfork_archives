// ==UserScript==
// @name         Re-Execute failed tests
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Re-execute top 1000 failed test cases from the test cases (detail) page. within a test set.
// @author       l neelis
// @match        https://cloud.uipath.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM.xmlHttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442359/Re-Execute%20failed%20tests.user.js
// @updateURL https://update.greasyfork.org/scripts/442359/Re-Execute%20failed%20tests.meta.js
// ==/UserScript==

var G_onExecutionsPage = false;
var G_origin;
var G_Tenantname;
var G_Orgname;
var G_FolderID;

(function() {
    'use strict'

    setInterval(function() {
        var url = location.pathname;
        var split = url.split('/');

        var executionIndex = split.indexOf('executions');
        var onExecutionsPage = executionIndex > 0 && (split.length - 2) == executionIndex;

        //if page change
        if(G_onExecutionsPage != onExecutionsPage)
        {
            if(onExecutionsPage)
            {
                console.log('we are new on this page');
                Initialize();
            }
            else
            {
                //console.log('we left the queue page');
            }
        }

        G_onExecutionsPage = onExecutionsPage;
    },2000)

})()

function Initialize(){
    //THIS ONE DOES NOT USE HREF But pathname
    var url = location.pathname;
    var split = url.split('/')

    console.log(split)

    //setup globals
    G_origin = location.origin;
    G_Tenantname = split[2];
    G_Orgname= split[1];
    var regexp = /(?:&fid=)(\d+)(?:&)/.exec(location.href);
    G_FolderID = regexp[1];

    //GET SETUP PARAMS
    var testSetIdIndex = split.indexOf('executions') + 1;
    var testSetId = split[testSetIdIndex];

    console.log("testSetId: " + testSetId);


    //GET GUI
    var btnContainer = document.getElementsByClassName('ui-grid-action-buttons-main')[0];
    var btnTemplate = btnContainer.children[0];

    //CREATE GUI
    var copy = btnTemplate.cloneNode(true);
    btnContainer.appendChild(copy);
    copy.children[0].children[1].innerText = "Re-Execute failed";
    copy.style.marginLeft = '4px';
    copy.setAttribute("script-src","'self'");
    copy.removeAttribute("disabled");
    copy.setAttribute("href", "javascript:void(0);");
    copy.onclick = function() { GetFailedJobs(testSetId); };

}

function GetFailedJobs(testSetId)
{
    var bearertoken = GetBearerToken();

    GM.xmlHttpRequest({
        method: "GET",
        url: G_origin + "/"+ G_Orgname+ "/" + G_Tenantname + "/orchestrator_/odata/TestCaseExecutions?$filter=((Status%20eq%20%274%27)%20and%20(TestSetExecutionId%20eq%20"+ testSetId +"))&$top=1000",
        headers: {
            "Authorization" : "Bearer " + bearertoken,
            "X-UIPATH-OrganizationUnitId": G_FolderID,
        },
        onload: function(response) {
            // console.log(response);
            // console.log(response.responseText);
            if(response.status == 200)
            {
                HandleGetFailedJobsSuccess(response);
            }
            else
            {
                alert("Error ${"+response.status+"}: {" + response.statusText + "}");
            }
        },
        onerror: function(response){
            console.logError("error");
            //console.log(response);
            alert("Error ${"+response.status+"}: {" + response.statusText + "}");
        },
    });
}

function HandleGetFailedJobsSuccess(response)
{
    //repsonse.value contains an array of 'failed' test items.
    var json = JSON.parse(response.responseText);
    var count = json["@odata.count"];
    var array = json.value;
    console.log(count);

    if (count == 0){
        return;
    }

    //e.g. "{"testCaseExecutions":[{"testCaseExecutionId":718713}]}"
    var JobjectData = {
    "testCaseExecutions" : []
    };

    for(var i = 0; i < count; i++){

        var item = array[i];

        //just to make double sure the item is failed
        if(item.Status == "Failed")
        {
            var testCase = { "testCaseExecutionId" : item.Id };
            JobjectData.testCaseExecutions.push(testCase);
        }
    }

    ReExecute(JobjectData);

}

function ReExecute(Jdata){

    var bearertoken = GetBearerToken();

    GM.xmlHttpRequest({
        method: "POST",
        url: G_origin + "/"+ G_Orgname+ "/" + G_Tenantname + "/orchestrator_/api/TestAutomation/ReexecuteTestCases",
        headers: {
            "Authorization" : "Bearer " + bearertoken,
            "X-UIPATH-OrganizationUnitId": G_FolderID,
            "Content-Type": "application/json; charset=utf-8",
        },
        data: JSON.stringify(Jdata),

        onload: function(response) {
            console.log(response);
            if(response.status == 200)
            {
                //... act on response.
                //Refresh table
                var delayInMilliseconds = 1000 ; //0.5 second
                setTimeout(function() {
                    document.getElementsByClassName("mat-focus-indicator mat-tooltip-trigger grid-refresh-button ng-tns-c257-13 mat-icon-button mat-button-base")[0].click();
                }, delayInMilliseconds);
            }
            else
            {
                alert("Error ${"+response.status+"}: {" + response.statusText + "}");
            }
        },
        onerror: function(response){
            console.logError("error");
            //console.log(response);
            alert("Error ${"+response.status+"}: {" + response.statusText + "}");
        },
    });


}

//helper
function GetBearerToken() {
    //get storage key for AUTH
    var keys = Object.keys(window.sessionStorage);
    var key = '';
    for(var i = 0; i < keys.length; i++){
        if(keys[i].startsWith('oidc'))
        {
            key = keys[i];
            break;
        }
    }

    //get the AUTH
    var jsonstring = window.sessionStorage.getItem(key);
    var json = JSON.parse(jsonstring);
    var bearertoken = json.access_token;

    return bearertoken;
}