// ==UserScript==
// @name         RedhorseMu Filter
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Edit UI ReshorseMu
// @author       Paul Nguyen
// @grant        none
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @include        /^http?://m\.redhorsemu\.com/index\.php\?op=user$/

// @downloadURL https://update.greasyfork.org/scripts/16562/RedhorseMu%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/16562/RedhorseMu%20Filter.meta.js
// ==/UserScript==

$('body > table > tbody > tr:first').empty();
$('body > table').css("width","auto");
$('body').css("background-image","none");
$('body > table > tbody > tr > td > table:first > tbody > tr > th ')[0].remove();
$('body > table > tbody > tr > td > table:first > tbody > tr > th ')[0].remove();
$('body > table > tbody > tr > td > table:first > tbody > tr > th ')[0].remove();
$('body > table > tbody > tr > td > table:first > tbody > tr > th ')[1].remove();
$('body > table > tbody > tr > td > table:first > tbody > tr > th ')[1].remove();
$('body > table > tbody > tr > td > table:first ').css("background-image","none");
$('body > table > tbody > tr > td > table:first > tbody > tr > th > table > tbody > tr')[0].remove();
$('body > table > tbody > tr > td > table:first > tbody > tr > th > table > tbody > tr')[1].remove();
$('body > table > tbody > tr > td > table:first > tbody > tr > th > table > tbody > tr')[1].remove();
$('body > table > tbody > tr > td > table:first > tbody > tr > th > table > tbody > tr >th> h2').remove();
$('body > table > tbody > tr > td > table:first > tbody > tr > th > table > tbody > tr >th> p').remove();
$('body > table > tbody > tr > td > table:first > tbody > tr > th > table > tbody > tr >th> table:last').remove();
$('body > table > tbody > tr > td > table:first > tbody > tr > th > table').css("height","auto");
$('body > table > tbody > tr > td > table:first > tbody > tr > th > table > tbody > tr >th> br').remove();
$('body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > th > table > tbody > tr > th > table:nth-child(2) > tbody > tr > td > div > table:nth-child(2)').remove();
$('body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > th > table > tbody > tr > th > table:nth-child(2) > tbody > tr > td > div > table > tbody > tr:nth-child(2)').remove();
$('body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > th > table > tbody > tr > th > table:nth-child(2) > tbody > tr > td > div > table > tbody > tr:nth-child(2)').remove();
$('body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > th > table > tbody > tr > th > table:nth-child(2) > tbody > tr > td > div > table > tbody > tr:nth-child(2)').remove();
$('body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > th > table > tbody > tr > th > table:nth-child(2) > tbody > tr > td > div > table > tbody > tr:nth-child(2)').remove();
$(document).ready(function ()
{
    var level = $('#table-1 > tbody:nth-child(2) > tr > td:nth-child(4) > font').html();
    var status = $('#table-1 > tbody:nth-child(2) > tr > td:nth-child(2) > img').attr( "src" );
    var reset = $('#table-1 > tbody:nth-child(2) > tr > td:nth-child(4) > small').html().replace('[','').replace(']','');
    var account = 'PaulNguyen';
    if(status == './images/Online.gif')
        status = 'On';
    else
        status = 'Off';
    document.title = level + ' - ' + status;
   var currentdate = new Date(); 
    var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();    
    SaveHistory(level, reset, datetime, status, account); 
    
});

var version = 3;
var databaseName = 'RedHourseMU1';
var tableName = 'Histories';

function SaveHistory(level, reset, time, status, account) {
    var dbRequest = indexedDB.open(databaseName, version);
    
    dbRequest.onupgradeneeded = function (evt) {
        console.log("openDb.onupgradeneeded");
        var store = evt.currentTarget.result.createObjectStore(
            tableName, { keyPath: 'id', autoIncrement: true });
        store.createIndex('Account', 'Account', { unique: false });
        store.createIndex('Reset', 'Reset', { unique: false });
        store.createIndex('Level', 'Level', { unique: false });
        store.createIndex('CreatedDate', 'CreatedDate', { unique: false });
        store.createIndex('Status', 'Status', { unique: false });
    };

    dbRequest.onsuccess = function(event) {
        var db = this.result;
        var db = dbRequest.result;
        var db = event.target.result;
        var myTransaction = db.transaction(tableName,'readwrite');
        var myObjectStore = myTransaction.objectStore(tableName);
        var obj = {Level: level, CreatedDate: time, Reset:reset, Status:status, Account: account};
        
        var reqLastLevel = myObjectStore.openCursor(null, 'prev');
        reqLastLevel.onsuccess = function (event) {
            if (event.target.result) {
                var lastLevel = event.target.result.value;
                if(obj.Level != lastLevel.Level || obj.Reset != lastLevel.Reset || obj.Status != lastLevel.Status)
                {
                    console.log('Change');
                    var req = myObjectStore.add(obj);
                    console.log('Save: ', level, reset );                
                }
                else
                {
                    console.log('Not change' );
                }
            }
            else
            {
                var req = myObjectStore.add(obj);
                console.log('Save: ', level, reset );    
            }
        };   
    };
}