// ==UserScript==
// @name         WME Scan Option Edits dates
// @namespace    Sebiseba
// @version      1.1
// @description  Add an option to WME SCAN
// @author       Sebiseba
// @include     https://www.waze.com/editor/*
// @include     https://www.waze.com/*/editor/*
// @include     https://beta.waze.com/*
// @exclude     https://www.waze.com/user/*
// @exclude     https://www.waze.com/*/user/*
// @copyright   2016, Sebiseba
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16840/WME%20Scan%20Option%20Edits%20dates.user.js
// @updateURL https://update.greasyfork.org/scripts/16840/WME%20Scan%20Option%20Edits%20dates.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

(function ()
 {
    function waitForAPI()
    {
        if (typeof window.WMEScanAddOption == 'undefined')
        {
            window.setTimeout(waitForAPI, 1000);
            return;
        }
        
        // add option top editor
        window.WMEScanAddOption({
            title: "Edits dates", // required: text next to the checkbox in WME scan UI
            author: "Sebiseba", // required: your waze DateCreate here!
            version: GM_info.script.version, // required
            allowedZooms: [2, 4], // required: array of zoom values. Empty array to allow all zooms.
            resultHTML: "", // required (see endOfScan function below)
            resultBBCODE: "", // required (see endOfScan function below)
            resultJSON: {}, // optional for uploading to sebi's web server
            data: { }, // custom data storage
            beforeStartOfScan: function () { // optional: will be called after clicking on scan, and before the first call to this.run. You can use it for initializing variables
                // clear vars or it will be cumulated at each scan!
                this.data={ createdOn: {}, updatedOn:{}};
                this.resultHTML="";
                this.resultBBCODE="";
            },
            runOnSeg: function (seg) { // optional: function to be run on each segment
                var createdOn = seg.attributes.createdOn;
                var d = new Date(parseInt(createdOn));
                createdOn = d.getFullYear() +"/"+ (d.getMonth()+1) +"/"+ d.getDate();

                if (!this.data.createdOn.hasOwnProperty(createdOn.toString())) this.data.createdOn[createdOn]=0;
                this.data.createdOn[createdOn]++;

                var updatedOn = seg.attributes.updatedOn;
                var d = new Date(parseInt(updatedOn));
                updatedOn = d.getFullYear() +"/"+ (d.getMonth()+1) +"/"+ d.getDate();

                if (!this.data.updatedOn.hasOwnProperty(updatedOn)) this.data.updatedOn[updatedOn]=0;
                this.data.updatedOn[updatedOn]++;
            },
            endOfScan: function () { // required: function called at end of scan. This function must format a result as a html string in this.resultHTML and bbcode in this.resultBBCODE
                var createdDate=[];

                for (var createdOn in this.data.createdOn)
                {
                    if (!this.data.createdOn.hasOwnProperty(createdOn)) continue;
                    createdDate.push({DateCreate: createdOn, count: this.data.createdOn[createdOn]});
                }

				var updatedDate=[];
                for (var updatedOn in this.data.updatedOn)
                {
                    if (!this.data.updatedOn.hasOwnProperty(updatedOn)) continue;
                    updatedDate.push({DateUpdate: updatedOn, count: this.data.updatedOn[updatedOn]});
                }

                createdDate.sort(function (a, b) { return b.count - a.count });
                updatedDate.sort(function (a, b) { return b.count - a.count });
                
                this.resultHTML+='Creation Dates:<br><ol>';
                this.resultBBCODE+='Creation Dates:&#13;&#10;[hide][list=0]';
                createdDate.forEach(function (e) {
                    this.resultHTML+= '<li>' + e.DateCreate + ' : ' + e.count + "</li>";
                    this.resultBBCODE+='[*]' + e.DateCreate + ' : ' + e.count + "&#13;&#10;";
                }, this);
                this.resultHTML+='</ol>';
                this.resultBBCODE+='[/list][/hide]'; 
                
                this.resultHTML+='Update Dates:<br><ol>';
                this.resultBBCODE+='Update Dates:&#13;&#10;[hide][list=0]';
                updatedDate.forEach(function (e) {
                    this.resultHTML+= '<li>' + e.DateUpdate + ' : ' + e.count + "</li>";
                    this.resultBBCODE+='[*]' + e.DateUpdate + ' : ' + e.count + "&#13;&#10;";
                }, this);
                this.resultHTML+='</ol>';
                this.resultBBCODE+='[/list][/hide]';  
                
                this.resultJSON.createdDate=createdDate;
                this.resultJSON.updatedDate=updatedDate;
                
            }
        });
    }
    waitForAPI();
})();