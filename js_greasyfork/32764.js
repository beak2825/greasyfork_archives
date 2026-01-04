// ==UserScript==
// @name         Mturk Shite
// @namespace    https://greasyfork.org/users/144229
// @version      2.3.2
// @description  Makes Money
// @author       MasterNyborg + eisen
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *mturk.com*
// @include	     http://*.qualtrics.com/*
// @include	     https://*.qualtrics.com/*
// @include      https://*.*.qualtrics.com/*
// @include      http://*.*.qualtrics.com/*
// @include      http://*.surveygizmo.com/*
// @include      https://*.surveygizmo.com/*
// @include      https://docs.google.com/forms/*
// @include      https://*.surveymonkey.com/*
// @include      http://*.*.*.edu/*
// @include      https://*.*.*.edu/*
// @include      http://*.*.edu/*
// @include      https://*.*.edu/*
// @exclude      *worker.mturk.com/overwatch*
// @exclude      https://www.mturk.com/mturk/findhits?hit_scraper
// @exclude      *maricopa.edu*
// @exclude      *mturk.com/mturk/statusdetail*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @match        https://*.mturk.com/mturk/preview*
// @match        https://*.mturk.com/mturk/accept*
// @match        https://*.mturk.com/mturk/continue*
// @match        https://*.mturk.com/mturk/submit*
// @match        https://*.mturk.com/mturk/return*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/32764/Mturk%20Shite.user.js
// @updateURL https://update.greasyfork.org/scripts/32764/Mturk%20Shite.meta.js
// ==/UserScript==
var link_row_html;
// Useful functions
function gmGet(name) {
    var theValue = GM_getValue(name);
    return theValue;
}
function gmSet(name, valuee) {
    GM_setValue(name, valuee);
}
function bigBub(pop) {
    var div = $('<div />', {
        html: '&shy;<style>' + pop + '</style>'
    } ).appendTo('body');
}
//Pre toolbar page adjustments
$('a.top-stripe').hide();
var loc = window.location.href;
if (loc.search("worker") < 0) {
    //Button generator + current settings https://dabuttonfactory.com/#t=Dashboard&f=Pagella-Bold&ts=14&tc=000&hp=10&vp=7&c=4&bgt=gradient&bgc=c7dcef&ebgc=97bbdb&be=1&bs=1&bc=78cfcf&it=png
    var dButt = `<a href="/mturk/dashboard"><img src="http://i.imgur.com/rqVcvbK.png" style=" margin-right: 2px;"></a>` +
        `<a href="/mturk/sortmyhits?searchSpec=HITSearch%23T%231%2310%23-1%23T%23%21Status%210%21rO0ABXQACEFzc2lnbmVk%21%23%21Deadline%210%21%23%21&selectedSearchType=hitgroups&searchWords=&sortType=Deadline%3A0&pageSize=50"><img src="http://i.imgur.com/CqcqgW2.png" style=" margin-right: 2px;"></a>`+
        `<a href="https://worker.mturk.com/"><img src="http://i.imgur.com/Tuma4wH.png" style=" margin-right: 2px;"></a>`;
    $('a').eq(1).replaceWith(dButt);
}
var worker = `<input type="text" id="wiid" value=${GM_getValue('wid')}></input>`;
//Render toolbar and inputs
document.body.insertAdjacentHTML(
    `afterbegin`,
    `<div id="mtsb" style="background-color: lightblue;">` +
    `<label style="color: yellow; margin-left: 5px;">Nyborgs mTurk Shite </label>`+ worker +
    `<span style="margin-left: 3px;cursor:help" title="A compilation of scripts that increase the efficiency of the website and provides a better worker experience.">&#10068;</span>` +

    `<label style="cursor:help; color: black; float: right; margin-right: 10px;" title="PRE reloader will auto-refresh the page when mturk returns the error. ">PREloader:` +
    `<input style="cursor:pointer;" id="reload" type="checkbox" ${GM_getValue('reload') ? `checked` : ``}></input>` +
    `</label>` +

    `<label style="cursor:help; color: black; float: right; margin-right: 10px;"title="Auto-Expander will focus on the mturk HIT frame once a HIT is accepted. ">Auto-expander:` +
    `<input style="cursor:pointer;" id="expand" type="checkbox" ${GM_getValue('expand') ? `checked` : ``}></input>` +
    `</label>` +

    `<label style="cursor:help; color: black; float: right; margin-right: 10px;"title="Auto-check will automatically select 'Accept next HIT' when a HIT is accepted.">Accept-nexter:` +
    `<input style="cursor:pointer;" id="acn" type="checkbox" ${GM_getValue('acn') ? `checked` : ``}></input>` +
    `</label>` +

    `<label style="cursor:help; color: black; float: right; margin-right: 10px;"title="Makes radios and check boxes a bigger size on mturk/certain survey pages.">Big Bubbler:` +
    `<input style="cursor:pointer;" id="bbl" type="checkbox" ${GM_getValue('bbl') ? `checked` : ``}></input>` +
    `</label>` +

    `<label style="cursor:help; color: black; float: right; margin-right: 10px;"title="Hides some instruction panels and creates a toggle button.\nOnly works for certain HITs.">No instructions:` +
    `<input style="cursor:pointer;" id="tgi" type="checkbox" ${GM_getValue('tgi') ? `checked` : ``}></input>` +
    `</label>` +

    `<label style="color: black; float: right; margin-right: 10px;cursor:alias;"title="Click the white button to copy your worker ID to the clipboard.">Copy Worker ID: ` +
    `<input id="wid" style="cursor:alias;" type="button"></input>` +
    `</label>` +

    `</div>`
);
bigBub('div#mtsb {height: 1.7em;}');
bigBub('#wiid {width:0.3em}');

//Makes Requester IDs clickable search links
while(true){
    var rid = $('span.requesterIdentity').eq(0).text().trim().replace(' ', '+');
    if (!rid.length) break;
    var slnk = "https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&searchWords=" + rid;
    var rhtml = `<a class=requesterIdentity style= 'cursor:pointer; font-size:10px;' target=_blank href=` + slnk +`>`+rid.replace('+', ' ')+` </a>`;
    $("span.requesterIdentity").eq(0).replaceWith(rhtml);
}
var rsea   = $('td.capsule_field_text').eq(0).text().trim().replace(' ', '+');
var search = "https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&searchWords=" +rsea;
var shtml  = `<a class=requesterIdentity style= 'cursor:pointer; font-size:10px;' target=_blank href=` + search +`>`+rsea.replace('+', ' ')+` </a>`;
$("td.capsule_field_text").eq(0).replaceWith(shtml);
//Grabs worker ID from dashboard and adds functionality to button
workerID = GM_getValue("wid");
if(!workerID || workerID === "") {
    if (window.location.href == "https://www.mturk.com/mturk/dashboard") {
        workerIDNode = document.evaluate("//span[@class='orange_text_right']",document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
        for (i=0; i<workerIDNode.snapshotLength; i++) {
            nd = workerIDNode.snapshotItem(i);
            idstring = nd.innerHTML;
            workerID = idstring.split(': ')[1];
            GM_setValue("wid",workerID);
        }
    } else {
        workerID="";
        GM_setValue("wid","");
    }
} else {
    var copyTextareaBtn = document.querySelector('#wiid');
    $('#wid').click(function(event) {
        var copyTextarea = document.querySelector('#wiid');
        copyTextarea.select();
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        } catch (err) {
            console.log('Oops, unable to copy');
        }
    });
}
//Adds functionality to the checkboxes on the toolbar
const rel = document.getElementById('reload'); //PRE reloader
const exp = document.getElementById('expand'); //Auto expand
const che = document.getElementById('acn');    //Accept next checker
const bub = document.getElementById('bbl');    //Bigger bubbles
const tig = document.getElementById('tgi');    //toggle instructions
$('#reload').click(function(){
    if (rel.checked){
        gmSet('reload', 'checked');
    }else{
        gmSet('reload', '');
    }
});
$('#expand').click(function(){
    if (exp.checked){
        gmSet('expand', 'checked');
    }else{
        gmSet('expand', '');
    }
});
$('#acn').click(function(){
    if (che.checked){
        gmSet('acn', 'checked');
    }else{
        gmSet('acn', '');
    }
});
$('#bbl').click(function(){
    if (bub.checked){
        gmSet('bbl', 'checked');
    }else{
        gmSet('bbl', '');
    }
});
$('#tgi').click(function(){
    if (tig.checked){
        gmSet('tgi', 'checked');
    }else{
        gmSet('tgi', '');
    }
});
//PRE reloader code
if (rel.checked && $('.error_title:contains(You have exceeded the maximum allowed page request rate for this website.)').length || $('.error-page:contains(You have exceeded the allowable page request rate)').length) {
    setTimeout(window.location.reload.bind(window.location), 1200); //some would say 1000 is a safer number here but I like to live fast
    return;
}
//Auto expand code
if (exp.checked) {
    var is_a_HIT = window.location.href.includes('assignment_id=');
    if (is_a_HIT === true){
        var captcha = $('#captchaInput').length > 0;
        if (captcha === false){
            var workspace;
            var iframe = $(`.task-question-iframe-container`)[0];
            var hit_wrapper = $('div[id="hit-wrapper"]')[0];
            if (iframe){
                iframe.style.minHeight = '100vh';
                $(window).load(function(){
                    iframe.focus();
                    iframe.scrollIntoView();
                });
                workspace = iframe;
            }
            else if (hit_wrapper){
                var hit_wrapper_ypos = hit_wrapper.getBoundingClientRect().top;
                var pad = hit_wrapper_ypos + window.innerHeight - document.documentElement.clientHeight;
                if (pad > 0){
                    $('form[name="hitForm"][method="POST"][action="/mturk/hitReview"]').parent().before('<div style="height: '+pad+'">');
                }
                workspace = hit_wrapper;
            }
            var isAccepted = $('input[type="hidden"][name="isAccepted"][value="true"]').length > 0;
            if (workspace && isAccepted === true){
                workspace.scrollIntoView();
            }
            else if (workspace && isAccepted === false){
                var timer = $('span[id="theTime"][class="title_orange_text"]')[0];
                timer.scrollIntoView();
            }
        }
    }
}
//Accept next checker code
if (che.checked ) {
    $(document).ready(function() {
        setTimeout(function() {
            if ($('input[name="autoAcceptEnabled"]').length ) {
                $('input[name="autoAcceptEnabled"]').prop('checked', true);
            }
            if (document.querySelector('[data-reactid=".2.0"] > [type="checkbox"]')){
                if (!document.querySelector('[data-reactid=".2.0"] > [type="checkbox"]').checked){
                    document.querySelector('[data-reactid=".2.0"] > [type="checkbox"]').click();
                }
            }
        },1000);
    });
}
//Bigger bubbles and checkbox code
if (bub.checked){
    bigBub('div#mtsb {height: 2.5em;}');
    bigBub('input[type=radio] { width: 2.0em; height: 2.0em;}' );
    bigBub('input[type=checkbox] { width: 2.0em; height: 2.0em;}' );
}
//toggle instructions code
if(tig.checked){
    $('.panel.panel-primary').hide().before('<div><button id="toggle" type="button">Show Instructions</button></div>');
    $('.panel-heading').hide().before('<div><button id="toggle" type="button">Show Instructions</button></div>');
    $('#toggle').click(function () {
        $(this).text($(this).text() === 'Show Instructions' ? 'Hide Instructions' : 'Show Instructions');
        $('.panel-heading').toggle();
        $('.panel.panel-primary').toggle();
    });
}

var hitAutoAppDelayInSeconds = $('input[type="hidden"][name="hitAutoAppDelayInSeconds"]').val();
//hitAutoAppDelayInSeconds = 2*(86400) + 1*(3600) + 2*(60) + 2;
//hitAutoAppDelayInSeconds = 2*(86400) + 2*(60) + 2;
//hitAutoAppDelayInSeconds = 2*(60) + 2;
//hitAutoAppDelayInSeconds = 0;

// time formatting code modified from http://userscripts.org/scripts/show/169154
var days  = Math.floor((hitAutoAppDelayInSeconds/(60*60*24)));
var hours = Math.floor((hitAutoAppDelayInSeconds/(60*60)) % 24);
var mins  = Math.floor((hitAutoAppDelayInSeconds/60) % 60);
var secs  = hitAutoAppDelayInSeconds % 60;

var time_str = (days  === 0 ? '' : days  + (days  > 1 ? ' days '    : ' day '))    +
               (hours === 0 ? '' : hours + (hours > 1 ? ' hours '   : ' hour '))   +
               (mins  === 0 ? '' : mins  + (mins  > 1 ? ' minutes ' : ' minute ')) +
               (secs  === 0 ? '' : secs  + (secs  > 1 ? ' seconds ' : ' second '));

if (hitAutoAppDelayInSeconds === 0)
{
    time_str = "0 seconds";
}

var requesterName_row = $('a[id="requester.tooltip"]:contains("Requester:")').parent().parent();
requesterName_row.after('<tr><td colspan="11" valign="top" nowrap="" align="left"><b>&nbsp;Automatically Approved:&nbsp;&nbsp;</b>'+time_str+'</td></tr>');
if (link_row_html)
{
    requesterName_row.after('<tr><td colspan="11" valign="top" nowrap="" align="left">&nbsp;'+link_row_html+'</td></tr>');
}