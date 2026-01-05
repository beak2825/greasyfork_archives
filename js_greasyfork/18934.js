// ==UserScript==
// @name            WME RTC Improvements Spanish Version
// @description     Adds several helpful features to RTC handling in the Waze Map Editor. This version is for spanish speakers 
// @namespace       vaindil
// @version         1.0.2
// @grant           none
// @include         https://www.waze.com/editor/*
// @include         https://www.waze.com/*/editor/*
// @include         https://editor-beta.waze.com/editor/*
// @include         https://editor-beta.waze.com/*/editor/*
// @exclude         https://www.waze.com/user/*
// @author          vaindil, mincho77
// @downloadURL https://update.greasyfork.org/scripts/18934/WME%20RTC%20Improvements%20Spanish%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/18934/WME%20RTC%20Improvements%20Spanish%20Version.meta.js
// ==/UserScript==

function yoloswag() {
    try {
        var element = $('#sidebar');
        if ($(element).length) {
            letsAGo();
        } else {
            setTimeout(init, 1000);
        }
    } catch (err) {
        console.log("RTCENH - " + err);
        setTimeout(init, 1000);
    }
}

yoloswag();

function letsAGo() {
    $(document).on('mouseover', 'div.add-closure-button.btn.btn-primary', function() {
        $(document).off('mouseover.RTCXdays');
        $(document).on('mouseover.RTCXdays', 'div.edit-closure.new', function() {
            justDewIt();
            $(document).off('mouseover.RTCXdays');
        });
    });

    $(document).on('input.RTCXdaysfield keyup.RTCXdaysfield', 'input#expireinXdays', timeAndRelativeDimensionInSpace);
    $(document).on('click.RTCXdayscrash', 'div#RTCXdayscrash', ohNoes);
}

function justDewIt() {
    $('div.edit-closure.new > form.form > div.checkbox').before(
        '<div class="form-group">' +
            '<label class="control-label">Expira en X días</label>' +
            '<div class="controls">' +
                '<input type="number" length="3" maxlength="4" class="form-control" id="expireinXdays" />' +
            '</div>' +
        '</div>'
    );

    $('div.action-buttons').append(
        '<div class="btn btn-danger" id="RTCXdayscrash" style="float:right"><i class="fa fa-exclamation-triangle"></i>Crash</div>'
    );

    $('input[name="closure_endDate"]').datepicker('remove');
    $('input[name="closure_endDate"]').datepicker({ format: 'yyyy-mm-dd', todayHighlight: true });
}

function timeAndRelativeDimensionInSpace() {
    var newdate = new Date();
    if ($('input[name="closure_startDate"]').val() !== '') {
        var p = $('input[name="closure_startDate"]').val().split('-');
        var y = parseInt(p[0], 10);
        var m = parseInt(p[1], 10);
        var d = parseInt(p[2], 10);
        if (isNaN(y) || isNaN(m) || isNaN(d))
            return;

        newdate = new Date(y, m - 1, d);
    }

    var v = parseInt($('#expireinXdays').val(), 10);
    if (isNaN(v))
        return;

    newdate.setDate(newdate.getDate() + v);
    //var newmonth = ('0' + (newdate.getMonth() + 1)).slice(-2);
    //var newday = ('0' + (newdate.getDate())).slice(-2);
    //var newstring = newdate.getFullYear() + '-' + newmonth + '-' + newday;
    $('input[name="closure_endDate"]').datepicker('update', newdate);
    if ($('input[name="closure_endTime"]').val() === '')
        $('input[name="closure_endTime"]').timepicker('setTime', '01:00');
}

function ohNoes() {

    $('input[name="closure_reason"]').val('Accidente');

    var cur = new Date();
    cur.setHours(cur.getHours() + 2);
    $('input[name="closure_endDate"]').datepicker('update', cur);
    $('input[name="closure_endTime"]').timepicker('setTime', (('0' + cur.getHours()).slice(-2)) + ':' + (('0' + cur.getMinutes()).slice(-2)));
}