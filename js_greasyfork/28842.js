/* global Waze, W */

// ==UserScript==
// @name WME DrivesData
// @author M1kep
// @namespace m1kep
// @version 1.0.5
// @description Export Waze Drive Data
// @include             https://www.waze.com/editor*
// @include             https://www.waze.com/*/editor*
// @include             https://beta.waze.com/*
// @exclude             https://www.waze.com/user/editor*
// @grant none
// @require https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// See https://raw.githubusercontent.com/eligrey/Blob.js/master/LICENSE.md for below library
// @require https://cdnjs.cloudflare.com/ajax/libs/blob-polyfill/3.0.20180112/Blob.js
// See https://raw.githubusercontent.com/eligrey/FileSaver.js/master/LICENSE.md for below library
// @require https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/28842/WME%20DrivesData.user.js
// @updateURL https://update.greasyfork.org/scripts/28842/WME%20DrivesData.meta.js
// ==/UserScript==

(function() {
    
    var wDDTotalDrives = -1;
    var wDDDrivesDataArr = null;
    var wDDIsLoaded = false;
    var wDDIsConverted = false;
    var readyToDownload = false;
    var wDDDescartesBaseURL = '';
    
    var wDDDebug = false;
    var wDDVersion = "1.0.4";
    
    var wDDOutput = '';
    
    var wDDLoadingGIF = 'data:image/gif;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
    function bootStrap() {
        if(W && W.loginManager && W.loginManager.isLoggedIn()) {
            initialize();
        } else {
            setTimeout(bootStrap, 500);
        }
    }
    
    bootStrap();
    
    function initialize()
    {
        wDDDescartesBaseURL = 'https://' + window.location.host + W.Config.paths.archive;
        $.getJSON(wDDDescartesBaseURL + '?minDistance=1000&count=1', function(result){
            wDDTotalDrives = result.archives.totalSessions;
            wDDDrivesDataArr = new Array(wDDTotalDrives);
        });
        
        $('<div>').css({paddingTop:'6px'}).append(
            $('<h3>').text('Drive Data Export v' + wDDVersion),
            $('<p>').text('Please click the buttons in order to export data.'),
            $('<form>').append(
                $('<ol>').css('padding', 2).append(
                    $('<li>').append(
                        $('<input>', {type:'button', value:'Load Data', style:'padding: 2.5px 0px'}).click(function(){
                            wDDIsLoaded = false;
                            wDDToggleLoading();
                            wDDLoadData(0);
                        }),
                        $('<span>', {id:'wDDLoadSpinner'}).css({display:'none'}).append(
                            $('<img>').attr('src', wDDLoadingGIF)
                        )
                    ),
                    $('<div>').append(
                        $('<span>').text('Value Delimiter: ').append(
                               $('<select>', {id: 'wDDValueDelimSel'}).change(wDDConvValChanged).append(
                                    $('<option>', {value: ','}).text('Comma'),
                                    $('<option>', {value: '\t'}).text('Tab')
                                ) 
                        )                    
                    ),
                    $('<div>').append(
                        $('<span>').text('Record Delimiter: ').append(
                            $('<select>', {id: 'wDDRecordDelimSel'}).change(wDDConvValChanged).append(
                                $('<option>', {value: '\n'}).text('New Line')
                            )
                        )
                    ),
                    $('<div>').append(
                        $('<span>').text('Date Format: ').append(
                            $('<select>', {id: 'wDDDateFormat'}).change(wDDConvValChanged).append(
                                $('<option>', {value: 'M/D/YYYY'}).text('3/23/2017'),
                                $('<option>', {value: 'M/M/YY'}).text('3/23/17'),
                                $('<option>', {value: 'D/M/YYYY'}).text('23/3/2017'),
                                $('<option>', {value: 'D/M/YY'}).text('23/3/17'),
                                $('<option>', {value: 'M-D-YYYY'}).text('3-23-2017'),
                                $('<option>', {value: 'M-D-YY'}).text('3-23-17'),
                                $('<option>', {value: 'D/M/YYYY'}).text('23-3-2017'),
                                $('<option>', {value: 'D/M/YY'}).text('23-3-17'),     
                                $('<option>', {value: 'ddd MMM Do, YYYY'}).text('Thur March 23rd, 2017'),
                                $('<option>', {value: 'dddd MMM Do, YYYY'}).text('Thursday Mar 23rd, 2017'),
                                $('<option>', {value: 'ddd MMMM Do, YYYY'}).text('Thur March 23rd, 2017'),
                                $('<option>', {value: 'dddd MMMM Do, YYYY'}).text('Thursday March 23rd, 2017')
                            )
                        )
                    ),
                    $('<div>').append(
                        $('<span>').text('Time Format: ').append(
                            $('<select>', {id: 'wDDTimeFormat'}).change(wDDConvValChanged).append(
                                $('<option>', {value: 'hh:mm a'}).text('02:22 pm'),
                                $('<option>', {value: 'kk:mm'}).text('14:22')
                            )
                        )
                    ),
                    $('<div>').append(
                        $('<span>').text('Distance Unit: ').append(
                            $('<select>', {id: 'wDDDisUnit'}).change(wDDConvValChanged).append(
                                $('<option>', {value: 0.001}).text('Kilometers'),
                                $('<option>', {value: 0.000621371}).text('Miles')
                            )
                        )
                    ),
                    $('<div>').append(
                        $('<span>').text('Surround Values with " and "?: ').append(
                            $('<input>', {id:'wDDSurroundVals', type:'checkbox'}).change(wDDConvValChanged).prop('checked', true)
                        )
                    ),
                    $('<li>').append(
                        $('<input>', {id:'wDDConvertButton', type:'button', value:'Convert Data', style:'padding: 2.5px 0px'}).prop('disabled', true).click(function(){
                            wDDIsConverted = false;
                            wDDToggleConverting();
                            wDDConvertData();
                        }).css('text-decoration', 'line-through'),
                        $('<span>', {id:'wDDConvertSpinner'}).css({display:'none'}).append(
                            $('<img>').attr('src', wDDLoadingGIF)
                        )                    
                    ),
                    $('<li>').append(
                        $('<input>', {id:'wDDExportButton', type:'button', value:'Export Data', style:'padding: 2.5px 0px'}).prop('disabled', true).click(function() {
                            readyToDownload = true;
                            wDDExportDrives();
                        }).css('text-decoration', 'line-through')
                    ),
                    $('<div>').append(
                        $('<span>').text('Enable Debug Logging: ').append(
                            $('<input>', {id: 'wDDDebugToggle', type: 'checkbox'}).prop('checked', false).change(function() {
                                wDDDebug = $('#wDDDebugToggle').is(':checked');
                            })
                        )
                    )
                )
            )
        ).appendTo('#sidepanel-drives');
    }
    
    function wDDLoadData(offset)
    {
     $.getJSON(wDDDescartesBaseURL + '?minDistance=1000&offset=' + offset +  '&count=50', function(result){
            $.each(result.archives.objects, function(i, field){
                var startDateObj = moment(field.startTime);
                var endDateObj = moment(field.endTime);
                wDDDrivesDataArr[i + offset] = new drive(startDateObj, endDateObj, field.totalRoadMeters);
            });
            if(offset + 50 >= wDDTotalDrives) {
                wDDIsLoaded = true;
                wDDToggleLoading();
                wDDLog(wDDDrivesDataArr);
            } else {
                wDDLoadData(offset + 50);
            }
        });
    }
    
    function wDDConvertData()
    {
        var wDDRecDelim = $('#wDDRecordDelimSel').val();
        wDDLog('The rec delim is -> ' + wDDRecDelim + ' <-- That was it.');
        var wDDValDelim = $('#wDDValueDelimSel').val();
        wDDLog('The val delim is -> ' + wDDValDelim + ' <-- That was it.');
        var wDDSurroundVals = $('#wDDSurroundVals').is(':checked');
        wDDLog('wDDSurroundVals = ' + wDDSurroundVals);
        var wDDDisUnit = $('#wDDDisUnit').val();
        wDDLog('wDDDisUnit is "' + wDDDisUnit + '"');
        wDDOutput = ['Start Date', 'Start Time', 'End Time', 'Distance(' + (wDDDisUnit == 0.001 ? 'Kilometers' : 'Miles') + ')'].map(function(rec) {
            return (wDDSurroundVals ? '"' : '') + rec + (wDDSurroundVals ? '"' : '');
        }).join(wDDValDelim) + wDDRecDelim;
        var wDDDateFormat = $('#wDDDateFormat').val();
        var wDDTimeFormat = $('#wDDTimeFormat').val();
        wDDOutput += wDDDrivesDataArr.map(function(driveRec){
          return [driveRec.startDateObj.format(wDDDateFormat), driveRec.startDateObj.format(wDDTimeFormat), driveRec.endDateObj.format(wDDTimeFormat), Math.round(driveRec.distance * wDDDisUnit * 100) / 100].map(function(value) {
              return (wDDSurroundVals ? '"' : '') + value + (wDDSurroundVals ? '"' : '');
          }).join(wDDValDelim);  
        }).join(wDDRecDelim);
        wDDIsConverted = true;
        wDDLog(wDDOutput);
        wDDToggleConverting();
    }
    
    function wDDExportDrives()
    {
        if(readyToDownload){
            if($('#wDDValueDelimSel').val() === '\t') {
                var blob = new Blob([wDDOutput], {type: 'text/tab-separated-values'});
                saveAs(blob, 'driveOutput.txt');
            } else {
                var blob = new Blob([wDDOutput], {type: 'text/csv'});
                saveAs(blob, 'driveOutput.csv');
            }
            readyToDownload = false;
        }
    }
    
    function wDDToggleLoading() {
        if(wDDIsLoaded) {
            $('#wDDLoadSpinner').hide();
            $('#wDDConvertButton').prop('disabled', false);
            $('#wDDConvertButton').css('text-decoration', '');
        } else {
            $('#wDDLoadSpinner').show();
            $('#wDDConvertButton').prop('disabled', true);
            $('#wDDConvertButton').css('text-decoration', 'line-through');
            $('#wDDExportButton').prop('disabled', true);
            $('#wDDExportButton').css('text-decoration', 'line-through');
        }        
    }
    
    function wDDToggleConverting() {
        if(wDDIsConverted) {
            $('#wDDConvertSpinner').hide();
            $('#wDDExportButton').prop('disabled', false);
            $('#wDDExportButton').css('text-decoration', '');
        } else {
            $('#wDDConvertSpinner').show();
            $('#wDDExportButton').prop('disabled', true);
            $('#wDDExportButton').css('text-decoration', 'line-through');
        }        
    }
    
    function wDDConvValChanged(){
            $('#wDDExportButton').prop('disabled', true);
            $('#wDDExportButton').css('text-decoration', 'line-through');    
    }
    
    function wDDLog(msg) {
        if(wDDDebug) {
            console.log('WDDv' + wDDVersion + ': ' + msg);
        }
    }
    
    function drive(startDateObj, endDateObj, distance) {
        this.startDateObj = startDateObj;
        this.endDateObj = endDateObj;
        this.distance = distance;
    }
})();
