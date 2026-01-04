// ==UserScript==
// @name         ICM Alert Helper
// @namespace    https://portal.microsofticm.com/
// @require http://code.jquery.com/jquery-latest.js
// @require https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.5/lodash.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.21.0/moment.min.js
// @version      1.0.0
// @description  Adds some helpful copy/paste commands to use for alerts in ICM
// @author       Naveen Kumar
// @match        https://portal.microsofticm.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448439/ICM%20Alert%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/448439/ICM%20Alert%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Loading OSP OnCall Helper User Script...");
    // JQuery start
    $(document).ready(function()
    {
        // Because this is a SPA, we have to check the HTML body every so often, we can't just listen to document.ready.
        setInterval(ParsePage, 5000);
    });
    console.log("Loaded.");
})();

var loadedHelper = false;
var ParsePage = function(){

    console.log("Checking...");

    // if we already added a helper, then don't recheck
    if( $('#helperTable').length)
    {
        // if it's currently visible, then leave it be.
        if($('#helperTable').is(':visible'))
        {
            return;
        }
        else
        {
            // if it's not, then delete and try again
            $('#helperText').remove()
        }
    }

    if(loadedHelper)
    {
        return loadedHelper;
    }

    console.log("Parsing helper stuff...");
    var elementsWithData = [];

    // Find the element with data to parse
    $('td').filter(function(i) {
        var html = $(this).html();
        if(_.includes(html, 'X-CalculatedBETarget') & _.includes(html, 'Date:'))
        {
            elementsWithData.push(html);
            return true;
        }
        return false;
    });

    var divWithData = [];

    // Find the element with data to parse
    $('table tr').filter(function(i) {
        var html = $(this).html();
        if(_.includes(html, '<th>Scope</th>'))
        {
            console.log("FOUND SCOPE",$(this));
            divWithData.push($(this).find('td:not(:empty):first').html());
            return true;
        }
        return false;
    });

    var protocol = '';
    var xCalculatedBETarget;
    var beServerWithoutDomain;
    var requestDate;
    var xFEServer;
    var dag;

    // parse the data we need
    if(!_.isEmpty(elementsWithData)) {
        console.log("Found eligible alert for helper text.");
        xCalculatedBETarget = ParseElementForData(elementsWithData[0], 'X-CalculatedBETarget', ':', '\n');
        requestDate = ParseElementForData(elementsWithData[0], 'Date', ':', '\n');
        xFEServer = ParseElementForData(elementsWithData[0], 'X-FEServer', ':', '\n');
        protocol = TryDecideWhichProtocol(elementsWithData[0]);

        if(!_.isEmpty(divWithData)) {
            dag = _.trim(divWithData[0]);
        }

        console.log("xCalculatedBETarget: " + xCalculatedBETarget);
        console.log("requestDate: " + requestDate);
        console.log("protocol: " + protocol);
        console.log('dag: ' + dag);

        // generate and insert the helper HTML
        console.log("Generating helper HTML...");
        var helperHTML = GenerateHelperHTML(xCalculatedBETarget, xFEServer, dag, requestDate, protocol);
        
        $(helperHTML).insertBefore('main-panel .widget-pannel').one();
        $("#helperTable td").css({"padding":"5px"});
        console.log("Added helper HTML.");
        loadedHelper = true;
    }
};

function ParseElementForData(element, headerText, beginning, end) {
    var index = element.indexOf(headerText);
    element = element.substring(index, element.length);
    var indexOfBeginning = element.indexOf(beginning);
    var indexOfNext = element.indexOf(end);
    element = element.substring(indexOfBeginning+beginning.length, indexOfNext);
    return _.trim(element);
}

function GenerateHelperHTML(xCalculatedBETarget, xFEServer, dag, requestDate, protocol) {
    var beLogName = '';
    var feLogName = '';
    var beProcess = '';

    switch (protocol) {
        case Protocol.EWS:
            beLogName = 'EWSLogsHourly';
            feLogName = 'CafeEwsLogsHourly';
            beProcess = 'MSExchangeServicesAppPool';
            break;
        case Protocol.REST:
            beLogName = 'RestLogsNRTHourly';
            feLogName = 'CafeRestLogsHourly2';
            beProcess = 'MSExchangeRestAppPool';
            break;
        case Protocol.AUTODISCOVER:
            beLogName = 'AutoDiscoverLogsHourly';
            feLogName = 'CafeAutodiscoverLogs2';
            beProcess = 'MSExchangeAutodiscoverAppPool';
            break;
        default:
            beLogName = "<Insert Log Name>";
            feLogName = '<Insert Log Name>';
            beProcess = '<Insert Process Name>';
    }

    var beServer;
    var forest;
    if(xCalculatedBETarget.length > 0) {
        var firstPeriodIndex = xCalculatedBETarget.indexOf('.');
        if(firstPeriodIndex >= 0) {
            beServer = xCalculatedBETarget.substring(0, firstPeriodIndex);
            forest = xCalculatedBETarget.substring(firstPeriodIndex+1, xCalculatedBETarget.length);
        }
    }

    var filterDateCurrentHour = moment(requestDate).utc().format('YYYYMMDDHH');
    var filterDateOneHourAgo = moment(requestDate).utc().subtract({'hours': 1}).format('YYYYMMDDHH');
    var filterDateForMeasurePerformance = moment(requestDate).utc().format('YYYY-MM-DDTHH:mm:ss');
    var filterDateForEventLogStart = moment(requestDate).utc().subtract({'minutes': 20}).format('MM/DD/YYYY HH:mm:ss');
    var filterDateForEventLogEnd = moment(requestDate).utc().add({'minutes': 20}).format('MM/DD/YYYY HH:mm:ss');

    // General
    var measurePerformance = 'Measure-Performance -Machine ' + beServer;
    var measurePerformanceWithStartTime = 'Measure-Performance -Machine ' + beServer + ' -StartTimeUtc ' + filterDateForMeasurePerformance;
    var measurePerformanceDag = 'Measure-Performance -Dag ' + dag;

    // BE
    var getBEMachineLogCurrentHour = 'Get-MachineLog -Target ' + beServer + ' -Log ' + beLogName + ' -Filter *' + filterDateCurrentHour + '* -TorusStreaming -Download';
    var getBEMachineLogOneHourAgo = 'Get-MachineLog -Target ' + beServer + ' -Log ' + beLogName + ' -Filter *' + filterDateOneHourAgo + '* -TorusStreaming -Download';
    var getThreadStackGrouping = 'Get-ThreadStackGrouping -Server ' + beServer + ' -Process ' + beProcess;
    var getResponderThreadStacks = 'Get-MachineLog -Target ' + beServer + ' -Log EDSLogsDumps -Filter Responder_threadstacks* -Download';
    var getEventLogsApplication = "Get-MachineEvent -Target " + beServer + " -EventLog Application -EventLevel NotInformation -FromDateUtc '" + filterDateForEventLogStart + "' -ToDateUtc '" + filterDateForEventLogEnd + "' | fl > eventsApplication_" + beServer + ".txt";
    var getEventLogsWatson = "Get-MachineEvent -Target " + beServer + " -EventId 4999 -ResultSize 50 -FromDateUtc '" + filterDateForEventLogStart + "' -ToDateUtc '" + filterDateForEventLogEnd + "' | fl > eventsWatson_" + beServer + ".txt";

    // FE
    var getFEMachineLogCurrentHour = 'Get-MachineLog -Target ' + xFEServer + ' -Log ' + feLogName + ' -Filter *' + filterDateCurrentHour + '* -TorusStreaming -Download';
    var getFEMachineLogOneHourAgo = 'Get-MachineLog -Target ' + xFEServer + ' -Log ' + feLogName + ' -Filter *' + filterDateOneHourAgo + '* -TorusStreaming -Download';

    // Actions
    var elevatedRights = "Request-ElevatedAccess_V2.ps1 -Role CapacityServerAdmin -Reason 'Alert investigation for " + beServer + "' -DurationHours 24 -Forest " + forest;
    var maintenanceMode = 'Request-MachineBeginMaintenance_V2.ps1 -TargetMachine ' + beServer + " -Reason 'Fixing machine for Alert'";
    var recycleAppPool = 'Request-RecycleAppPool_V2.ps1 -Target ' + beServer + ' -AppPoolName ' + beProcess + " -Reason 'Recycling AppPool to recover availability'";
    var SafeRebootMachine = 'Request-MachineSafeReboot_v2.ps1 -TargetMachine ' + beServer + " -Reason 'Fixing machine for Alert'";
    var ForceRebootMachine = 'Request-SetMachinePowerStateV2.ps1 -TargetMachine ' + beServer + " -DesiredState restart -Reason 'Fixing machine for Alert'";
 // <tr style="background-color:#BFE1F2"><td>Measure-Performance (entire DAG):</td><td>` +  WrapInInput(measurePerformanceDag) + `</td></tr>

    var html = `
<table id="helperTable" style="border:dotted 1px; padding:3px; border-radius:16px;">
<tbody>
<tr><th>ICM OnCall Helper</th><th style="width:500px"></th></tr>
<tr><th>BE</th><th></th></tr>
<tr><td width="150px">X-CalculatedBETarget:</td><td>` + WrapInInput(xCalculatedBETarget) +  `</td></tr>
<tr style="background-color:#BFE1F2"><td>Measure-Performance (current):</td><td>` +  WrapInInput(measurePerformance) + `</td></tr>
<tr style="background-color:#BFE1F2"><td>Measure-Performance (at moment of request):</td><td>` +  WrapInInput(measurePerformanceWithStartTime) + `</td></tr>
<tr style="background-color:#D5C3F4"><td>Get-MachineLog (Hour of request):</td><td>` +  WrapInInput(getBEMachineLogCurrentHour) + `</td></tr>
<tr style="background-color:#D5C3F4"><td>Get-MachineLog: (Previous hour before request)</td><td>` +  WrapInInput(getBEMachineLogOneHourAgo) + `</td></tr>
<tr style="background-color:#D5C3F4"><td>Get-ThreadStackGrouping:</td><td>` +  WrapInInput(getThreadStackGrouping) + `</td></tr>
<tr style="background-color:#D5C3F4"><td>Get Responder ThreadStacks:</td><td>` +  WrapInInput(getResponderThreadStacks) + `</td></tr>
<tr style="background-color:#D5C3F4"><td>Get-MachineEvent (Application Errors):</td><td>` +  WrapInInput(getEventLogsApplication) + `</td></tr>
<tr style="background-color:#D5C3F4"><td>Get-MachineEvent (Watson Events):</td><td>` +  WrapInInput(getEventLogsWatson) + `</td></tr>
<tr style="background-color:#FFF0C6"><td>Request CapacityServerAdmin:</td><td>` + WrapInInput(elevatedRights) + `</td></tr>
<tr style="background-color:#FFF0C6"><td>Maintenance Mode:</td><td>` + WrapInInput(maintenanceMode) + `</td></tr>
<tr style="background-color:#FFF0C6"><td>Recycle App Pool:</td><td>` +  WrapInInput(recycleAppPool) + `</td></tr>
<tr style="background-color:#FFF0C6"><td>Safe Reboot Machine:</td><td>` +  WrapInInput(SafeRebootMachine) + `</td></tr>
<tr style="background-color:#FFF0C6"><td>Force Reboot Machine:</td><td>` +  WrapInInput(ForceRebootMachine) + `</td></tr>
<tr><th>FE</th><th></th></tr>
<tr><td>X-FEServer (if multiple servers, run for each):</td><td>` +  WrapInInput(xFEServer) + `</td></tr>
<tr style="background-color:#D5C3F4"><td>Get-MachineLog (Hour of request):</td><td>` +  WrapInInput(getFEMachineLogCurrentHour) + `</td></tr>
<tr style="background-color:#D5C3F4"><td>Get-MachineLog: (Previous hour before request)</td><td>` +  WrapInInput(getFEMachineLogOneHourAgo) + `</td></tr>
</tbody></table>
`;
    return html;
}

function WrapInInput(text) {
    return '<input type="text" style="width:100%" value="' + text + '" onclick="this.select()">';
}

function AddHelperHTML(helperHTML) {
    $('#helperText').remove();

    $('div.sixteen').each(function() {
        console.log("Found div.sixteen: ", $(this));
        $(this).parent().append('<td id="helperText" style="display:none; margin:10px;">'+ helperHTML +'</td>');
    });
    $('#helperText').fadeIn(250);
}

var Protocol = {
    EWS: 1,
    REST: 2,
    AUTODISCOVER: 3,
    UNKNOWN: 4
};

function TryDecideWhichProtocol(html) {

    console.log('html: ' + html);
    if(html.indexOf("Ews_AM_Probe") >= 0 || html.indexOf("ActiveMonitoring.Ews") >= 0 || html.indexOf("Webservices.Ews") >= 0 || html.indexOf("EwsResponse") >= 0) {
        return Protocol.EWS;
    }
    else if (html.indexOf("Rest_AM_Probe") >= 0 || html.indexOf("Webservices.Rest") >= 0) {
        return Protocol.REST;
    }
    else if(html.indexOf("autodiscover.svc") >= 0 || html.indexOf("ActiveMonitoring.AutodiscoverV2") >= 0) {
        return Protocol.AUTODISCOVER;
    }
    else {
        return Protocol.UNKNOWN;
    }
}