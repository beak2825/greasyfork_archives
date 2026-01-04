// ==UserScript==
// @name         Grundos Cafe Random Event Tracker
// @namespace    grundos.cafe
// @version      1.5.4
// @description  Records random events
// @author       eleven
// @match        https://www.grundos.cafe/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/455337/Grundos%20Cafe%20Random%20Event%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/455337/Grundos%20Cafe%20Random%20Event%20Tracker.meta.js
// ==/UserScript==

/* globals $ */

function timeNST() {
    let nst = new Date(new Date().toLocaleString('en-US', {timeZone: 'America/Los_Angeles'}));
    let hours = nst.getHours();
    let minutes = nst.getMinutes();
    let seconds = nst.getSeconds();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    let strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    let nstDateTime = nst.getMonth() + 1 + '/' + nst.getDate() + '/' + nst.getFullYear() + ' ' + strTime;
    return nstDateTime;
}

function addEvent(logs, nst, img, text, color) {
    logs[nst] = {};
    logs[nst].u = document.URL;
    logs[nst].i = img;
    logs[nst].t = text;
    logs[nst].c = color;
    GM_setValue('logs', JSON.stringify(logs));
}

function getEvents(events, logs) {
    let display = '';
    events.forEach(id => {
        let css = logs[id].c;
        switch (logs[id].c) {
            case '#ffffcc':
                css = 're_shh';
                break;
            case '#ccccff':
                css = 're_winter';
                break;
            case '#be793f':
                css = 're_prehistoric';
                break;
            case '#334f8f':
                css = 're_spooky';
                break;
        }
        let size = css == 'av_shh' ? '50px;margin-left:15px;' : '80px;';
        display = display.concat('<tr class="' + css + '"><td style="word-break:break-all" colspan="2">' + id.replace(/-[rfab][0-9]+/g, '') + ' &nbsp; ' + logs[id].u.replace(/https:\/\/www.grundos.cafe/g, '') + '&nbsp; <a class="del" style="cursor:pointer" data-id="' + id + '">ⓧ</a></td></tr><tr><td><img src="' + logs[id].i + '" style="width:' + size + '" border="1"></td><td>' + logs[id].t.trim() + '</td></tr>');
    });
    return display;
}

const noDisplay = ['/itemview/','/useobject/','/~','/createauction/'];

(function() {
    'use strict';

    var logs = !GM_getValue('logs') ? {} : JSON.parse(GM_getValue('logs'));

    if ($('div.re').length) {
        let i = 0;
        $('div.re').each(function() {
            let img = $('div.re:eq('+i+')').find('div.re_image > img').attr('src');
            let text = $('div.re:eq('+i+')').find('div.re_text span').html().trim();
            let color = $('div.re:eq('+i+')').find('div:eq(0)').attr('class').split(' ')[1];
            if (color === undefined) { color = 're_shh'; }
            addEvent(logs, timeNST()+'-r'+(i+1), img, text, color);
            i++;
        });
    }
    if ($('div.faerie_quest').length) {
        let img = $('div.faerie_quest').find('div.faerie_image > img').attr('src');
        let text = $('div.faerie_quest').find('div.faerie_request span').html().trim();
        let color = 're_shh';
        addEvent(logs, timeNST()+'-f1', img, text, color);
    }
    if ($('div.av').length) {
        let i = 0;
        $('div.av').each(function() {
            let img = $('div.av:eq('+i+')').find('div.av_image > img').attr('src');
            let text = $('div.av:eq('+i+')').find('div.av_text span').html().trim();
            let color = 'av_shh';
            addEvent(logs, timeNST()+'-a'+(i+1), img, text, color);
            i++;
        });
    }
    if ($('div.bd_challenger').length) {
        let i = 0;
        $('div.bd_challenger').each(function() {
            let img = $('div.bd_challenger_image:eq('+i+')').find('img').attr('src');
            let text = $('div.bd_challenger:eq('+i+')').find('p:eq(1)').html().trim();
            let color = 're_shh';
            addEvent(logs, timeNST()+'-b'+(i+1), img, text, color);
            i++;
        });
    }
    if (noDisplay.some(page => document.URL.includes(page)) === false) {
        let records = Object.keys(logs);
        let displayCount = 10;
        let relog = !GM_getValue('vis') ? 'show' : GM_getValue('vis');
        let display = '<div id="relog" style="position:fixed;right:0px;bottom:0px;-webkit-box-shadow:-1px -1px 5px -1px rgba(0,0,0,0.5);box-shadow:-1px -1px 5px -1px rgba(0,0,0,0.5);';
        if (relog == 'show') {
            display = display.concat('width:450px;height:450px;padding:8px;overflow:auto;background:white;"><table id="logtable" style="width:420px;margin-top:5px;" cellspacing="2"><a id="revis" style="cursor:pointer;user-select:none;">Hide Event Log</a> Total: ' + records.length + '');
        } else {
            display = display.concat('width:145px;height:30px;padding:8px;overflow:hidden;background:white;"><table id="logtable" style="display:none;width:420px;margin-top:5px;" cellspacing="2"><a id="revis" style="cursor:pointer;user-select:none;">Show Event Log</a> Total: ' + records.length + '');
        }
        display = display.concat(getEvents(records.reverse().slice(0, displayCount), logs));
        if (displayCount > 0 && records.length > displayCount) {
            if (relog == 'show') {
                display = display.concat('</table><a id="relogmore" data-count="' + displayCount + '">Show More</a></div>');
            } else {
                display = display.concat('</table><a id="relogmore" data-count="' + displayCount + '" style="display:none;">Show More</a></div>');
            }
        } else {
            display = display.concat('</table></div>');
        }
        $('body').append(display);

        $('a#revis').click(function() {
            let relog = !GM_getValue('vis') ? 'show' : GM_getValue('vis');
            relog = relog == 'show' ? 'hide' : 'show';
            if (relog == 'show') {
                $('a#revis').text('Hide Event Log');
                $('div#relog').css({'width':'450px','height':'450px','overflow':'auto'});
                $('table#logtable').css({'display':'table'});
                $('a#relogmore').css({'display':'inline'});
            } else {
                $('a#revis').text('Show Event Log');
                $('div#relog').css({'width':'145px','height':'30px','overflow':'hidden'});
                $('table#logtable').css({'display':'none'});
                $('a#relogmore').css({'display':'none'});
            }
            GM_setValue('vis', relog);
        });
        $('table#logtable').on('click', 'a.del', function() {
            let id = $(this).data('id');
            if (confirm('Are you sure you want to delete the ' + id + ' random event?')) {
                delete logs[id];
                GM_setValue('logs', JSON.stringify(logs));
                $(this).closest('tr').next().fadeOut(300, function(){$(this).remove();});
                $(this).closest('tr').fadeOut(300, function(){$(this).remove();});
            }
        });
        $('a#relogmore').click(function() {
            let count = Number($('a#relogmore').data('count'));
            $('table#logtable > tbody:last-child').append(getEvents(records.slice(count, count+10), logs));
            $('a#relogmore').data('count', count+10);
        });
    }
})();