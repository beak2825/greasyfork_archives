// ==UserScript==
// @name         End In Progress
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  set top 1000 queue items from 'In Progress' to 'Failed'.
// @author       l neelis
// @match        https://cloud.uipath.com/*/*/orchestrator_*
// @icon         https://www.google.com/s2/favicons?domain=uipath.com
// @grant        GM.xmlHttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442361/End%20In%20Progress.user.js
// @updateURL https://update.greasyfork.org/scripts/442361/End%20In%20Progress.meta.js
// ==/UserScript==

var G_onQueuePage = false;
var G_origin;
var G_Tenantname;
var G_Orgname;
var G_FolderID;

(function() {
    'use strict'
    setInterval(function() {
        var url = location.href;
        var split = url.split('/');
        var OnQueuePage = split.indexOf('queues') > 0;
        //if page change
        if(G_onQueuePage != OnQueuePage)
        {
            if(OnQueuePage)
            {
                console.log('we are new on this page');
                Initialize();
            }
            else
            {
                //console.log('we left the queue page');
            }
        }
        G_onQueuePage = OnQueuePage;
    },2000);
})();

function Initialize(){
    var url = location.href;
    var split = url.split('/');
    //setup globals
    G_origin = location.origin;
    G_Tenantname = split[4];
    G_Orgname= split[3];
    var regexp = /(?:&fid=)(\d+)(?:&)/.exec(url);
    G_FolderID = regexp[1];

    //GET SETUP PARAMS
    var queueIdIndex = split.indexOf('queues') + 1;
    var QueueDefinitionId = split[queueIdIndex];
    console.log("QueueDefinitionId: " + QueueDefinitionId);
    //GET GUI
    var btnContainer = document.getElementsByClassName('ui-grid-action-buttons-main')[0];
    var btnTemplate = btnContainer.children[0];
    //CREATE GUI
    var copy = btnTemplate.cloneNode(true);
    btnContainer.appendChild(copy);
    copy.children[0].children[1].innerText = "Fail top 1000 in progress";
    copy.style.marginLeft = '4px';
    copy.setAttribute("script-src","'self'");
    copy.setAttribute("href", "javascript:void(0);");
    copy.onclick = function() { GetInProgress(QueueDefinitionId); };
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

function GetInProgress(QueueDefinitionId){
    var bearertoken = GetBearerToken();

    //send request
    //it sucks, but the query params must be set in the url.
    //the 'data' will be set as request body.
    GM.xmlHttpRequest({
        method: "GET",
        url: G_origin + "/"+ G_Orgname+ "/" + G_Tenantname + "/orchestrator_/odata/QueueItems?$filter=((QueueDefinitionId%20eq%20" + QueueDefinitionId + ")%20and%20(Status%20eq%20%271%27))&$top=1000&$expand=Robot,ReviewerUser&$orderby=Id%20desc",
        headers: {
            "Authorization" : "Bearer " + bearertoken,
            "X-UIPATH-OrganizationUnitId": G_FolderID,
        },
        onload: function(response) {
            //console.log(response);
            //console.log(response.responseText);
            if(response.status == 200)
            {
                HandleGetInProgressSuccess(response);
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

function HandleGetInProgressSuccess(response)
{
    //repsonse.value contains an array of 'inprogress' queue items.
    var json = JSON.parse(response.responseText);
    var count = json["@odata.count"];
    var array = json.value;

    //console.log(count);
    for(var i = 0; i < count; i++){
        var item = array[i];
        //console.log(item);
        //just to make sure the item is in progress
        if(item.Status == "InProgress")
        {
            SetQueueItemState(item, false);
        }
    }
    //Refresh table
    var delayInMilliseconds = 500 ; //0.5 second
    setTimeout(function() {
        document.getElementsByClassName("mat-focus-indicator mat-tooltip-trigger grid-refresh-button ng-tns-c257-13 mat-icon-button mat-button-base")[0].click();
    }, delayInMilliseconds);
}

function SetQueueItemState(queueItem, success){
    var bearertoken = GetBearerToken();
    //default set failed.
    var data = JSON.stringify({
        "transactionResult": {
            "IsSuccessful": false,
            "ProcessingException": {
                "Reason": "On Lennart's Request.",
                "Type": "BusinessException"
            },
            "Output": {}
        },
    });
    //overide default state
    if(success == true){
        data = JSON.stringify({
            "transactionResult": {
                "IsSuccessful": true,
                "Output": {}
            },
        });
    }
    GM.xmlHttpRequest({
        method: "POST",
        url: G_origin + "/"+ G_Orgname+ "/" + G_Tenantname + "/orchestrator_/odata/Queues("+queueItem.Id+")/UiPathODataSvc.SetTransactionResult",
        headers: {
            "Authorization" : "Bearer " + bearertoken,
            "Content-Type": "application/json; charset=utf-8",
            "X-UIPATH-OrganizationUnitId": G_FolderID,
        },
        data: data,
        onload: function(response) {
            console.log(response);
            if(response.status == 200)
            {
                //... act on response.
            }
            else
            {
                alert("Error ${"+response.status+"}: {" + response.statusText + "}");
            }
        },
        onerror: function(response){
            console.logError("error");
            alert("Error ${"+response.status+"}: {" + response.statusText + "}");
        },
    });
}