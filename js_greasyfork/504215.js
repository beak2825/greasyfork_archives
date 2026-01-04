// ==UserScript==
// @name        Import/Export Steam Ignore List v2
// @language    English
// @namespace   https://greasyfork.org/users/1354313
// @description Imports/Exports Steam Ignore List v2
// @author      Rudokhvist
// @author      kpajko79
// @copyright   2018+, Rudokhvist
// @license     Apache-2.0
// @include     https://store.steampowered.com/account/notinterested/*
// @include     http://store.steampowered.com/account/notinterested/*
// @include     *://store.steampowered.com/account/notinterested
// @version     2.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/504215/ImportExport%20Steam%20Ignore%20List%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/504215/ImportExport%20Steam%20Ignore%20List%20v2.meta.js
// ==/UserScript==

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function RateLimiterPost(url, postParams, successCallback, failCallback) {
     $J.post(url, postParams, successCallback).fail(failCallback);
};


let anchor = document.getElementsByClassName("ignored_apps")[0];
let workingDialog;
//Export
let ExportBtn=document.createElement("div");
ExportBtn.setAttribute("class","btn_darkblue_white_innerfade btn_medium");
ExportBtn.setAttribute("style","margin-right: 5px !important;");
ExportBtn.appendChild(document.createElement("span"));
ExportBtn.firstChild.appendChild(document.createTextNode("Export"));
let newExportBtn=anchor.parentElement.insertBefore(ExportBtn,anchor);
newExportBtn.addEventListener("click",function(){
    $J.get("/dynamicstore/userdata/", {t: new Date().getTime()}, function(data) {
        let strdata = "";
        console.log(data);
        if (Object.keys(data.rgIgnoredApps).length > 0) {
            for (let item in data.rgIgnoredApps) {
                strdata+=item.toString()+",<br />";
            }
            strdata=strdata.substr(0,strdata.length-7); //remove comma and br after last entry
        } else {
            strdata = "Ignore list is empty";
        }
        let exportDialog=ShowAlertDialog("Ignore List", '<div class="bb_code">'+strdata+'</div>', "OK");
    },"json").fail(function() {
        ShowAlertDialog("Export Error","There was an error retrieving ignore list","OK");
    });
});

async function ImportIgnoreAdd(workingDialog, totalitems, IgnoreListTextItems) {
                let successfull=0;
                let failed=0;
                for (let i=0; i<totalitems;i++){
                let ignoreitem=parseInt(IgnoreListTextItems[i].trim());
                if (ignoreitem===0){
                    continue; //Dunno why this can even happen, but still
                }
                RateLimiterPost('/recommended/ignorerecommendation/', {
                    sessionid: g_sessionID,
                    appid: ignoreitem,
                    add: 1
                }, function() {
                    successfull++;
                    if ((successfull+failed)===totalitems) {
                        workingDialog.Dismiss();
                        ShowAlertDialog( "Import", "Import Finished. Failed: " + failed + "<br />Press \"OK\" to reload page.", "OK" ).done(function(){
                            window.location.reload();
                        });
                    } else {
                        workingDialog.Dismiss();
                        workingDialog = ShowBlockingWaitDialog( 'Import Ignore List', 'Please wait, ' + (totalitems-successfull-failed) +' entries left' );
                    }
                }, function() {
                    failed++;
                    if ((successfull+failed)===totalitems) {
                        workingDialog.Dismiss();
                        ShowAlertDialog( "Import", "Import Finished. Failed: " + failed + "<br />Press \"OK\" to reload page.", "OK" ).done(function(){
                            window.location.reload();
                        });
                    } else {
                        workingDialog.Dismiss();
                        workingDialog = ShowBlockingWaitDialog( 'Import Ignore List', 'Please wait, ' + (totalitems-successfull-failed) +' entries left' );
                    }
                });
                await delay(250);
            }
}

async function ImportIgnoreRemove(workingDialog, totalitems, data) {
                let successfull=0;
                let failed=0;
                for (let item in data.rgIgnoredApps) {
                    RateLimiterPost('/recommended/ignorerecommendation/', {sessionid: g_sessionID,
                                                                           appid: item,
                                                                           remove: 1}, function () {
                        successfull++;
                        totalitems--;
                        if (totalitems===0) {
                            if (failed>0){
                                workingDialog.Dismiss();
                                ShowAlertDialog( "Clear", "Cleanup finished, unable to remove "+failed+" items.<br />Press \"OK\" to reload page.", "OK" ).done(function(){
                                    window.location.reload();
                                });
                            } else {
                                workingDialog.Dismiss();
                                ShowAlertDialog( "Clear", "Ignore list cleared successfuly<br />Press \"OK\" to reload page.", "OK" ).done(function(){
                                    window.location.reload();
                                });
                            }
                        } else {
                            workingDialog.Dismiss();
                            workingDialog = ShowBlockingWaitDialog( 'Clear Ignore List', 'Please wait, ' + totalitems +' entries left' );
                        }
                    }, function(){
                        failed++;
                        totalitems--;
                        if (totalitems===0) {
                            workingDialog.Dismiss();
                            ShowAlertDialog( "Clear", "Cleanup finished, unable to remove "+failed+" items.<br />Press \"OK\" to reload page.", "OK" ).done(function(){
                                window.location.reload();
                            });

                        } else {
                            workingDialog.Dismiss();
                            workingDialog = ShowBlockingWaitDialog( 'Clear Ignore List', 'Please wait, ' + totalitems +' entries left' );
                        }
                    });
                    await delay(250);
                }
}

//Import
let ImportBtn=document.createElement("div");
ImportBtn.setAttribute("class","btn_darkblue_white_innerfade btn_medium");
ImportBtn.setAttribute("style","margin-right: 5px !important;");
ImportBtn.appendChild(document.createElement("span"));
ImportBtn.firstChild.appendChild(document.createTextNode("Import"));
let newImportBtn=anchor.parentElement.insertBefore(ImportBtn,anchor);
let totalitems;
newImportBtn.addEventListener("click",function(){
    let importDialog=ShowPromptWithTextAreaDialog( "Import Ignore List", "", "OK", "Cancel", 32765 ).done( function(newIgnoreListText){
        if (/^[0-9]+(,\s*[0-9]+)*$/.test(newIgnoreListText)) {
            let IgnoreListTextItems=newIgnoreListText.split(",");
            totalitems=IgnoreListTextItems.length;
            workingDialog = ShowBlockingWaitDialog( 'Import Ignore List', 'Please wait, ' + totalitems +' entries left' );
            ImportIgnoreAdd(workingDialog, totalitems, IgnoreListTextItems);
        } else {
            ShowAlertDialog( "Import Error", "Wrong list syntax!", "OK" );
        }
    });
});

//Clear
let ClearBtn=document.createElement("div");
ClearBtn.setAttribute("class","btn_darkblue_white_innerfade btn_medium");
ClearBtn.setAttribute("style","margin-right: 5px !important;");
ClearBtn.appendChild(document.createElement("span"));
ClearBtn.firstChild.appendChild(document.createTextNode("Clear"));
let newClearBtn=anchor.parentElement.insertBefore(ClearBtn,anchor);
newClearBtn.addEventListener("click",function(){
    ShowConfirmDialog( "Clear Ignore List", "Are you sure you want to clear ignore list?", "Yes", "No").done(function(){
        $J.get("/dynamicstore/userdata/", {t: new Date().getTime()}, function(data) {
            console.log(data);
            let totalitems=Object.keys(data.rgIgnoredApps).length;
            if (totalitems > 0) {
                workingDialog = ShowBlockingWaitDialog( 'Clear Ignore List', 'Please wait, ' + totalitems +' entries left' );
                ImportIgnoreRemove(workingDialog, totalitems, data);
            } else {
                ShowAlertDialog("Nothing to clear","Ignore list is empty","OK");
            }
        },"json").fail(function() {
            ShowAlertDialog("Clean Error","There was an error retrieving ignore list","OK");
        });

    });
});