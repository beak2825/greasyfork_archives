// ==UserScript==
// @name            WME RTC Improvements
// @description     Adds several helpful features to RTC handling in the Waze Map Editor
// @namespace       vaindil
// @version         1.6.0
// @grant           none
// @include         https://www.waze.com/editor?*
// @include         https://www.waze.com/editor/*
// @include         https://www.waze.com/*/editor/*
// @include         https://beta.waze.com/editor/*
// @include         https://beta.waze.com/*/editor/*
// @exclude         https://www.waze.com/user/*
// @exclude         https://www.waze.com/*/user/*
// @author          vaindil
// @downloadURL https://update.greasyfork.org/scripts/18927/WME%20RTC%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/18927/WME%20RTC%20Improvements.meta.js
// ==/UserScript==

var firstrun = true;
var ls = [];
var dmins = 120;
var dstr = '2';

switch (I18n.locale) {
    case 'es':
        ls.locale = 'es';
        ls.name = 'RTC Mejoras';
        ls.prefs = 'Defecto accidente duración (minutos)';
        ls.xdays = 'Expirará en X días';
        ls.crash = 'Accidente';
        ls.invalidstart = 'Fecha de inicio no es válida';
        ls.notint = 'No es untero válido';
        ls.neg = 'No puede ser negativo';
        ls.prefdefault = 'Defecto: ' + dstr + ' hrs';
        ls.preffuture = 'No se puede establecer más de 180 días en el futuro';
        ls.daysing = 'día';
        ls.daypl = 'días';
        ls.hoursing = 'hr';
        ls.hourpl = 'hrs';
        ls.minsing = 'min';
        ls.minpl = 'mins';
        break;
    case 'fr':
        ls.locale = 'fr';
        ls.name = 'RTC Améliorations';
        ls.prefs = 'Défaut crash durée (minutes)';
        ls.xdays = 'Expirer en X jours';
        ls.crash = 'Crash';
        ls.invalidstart = 'Date de début est invalide';
        ls.notint = 'Pas un entier valide';
        ls.neg = 'Vous ne pouvez pas être négatif';
        ls.prefdefault = 'Défaut: ' + dstr + ' heures';
        ls.preffuture = 'Ne peut pas être réglé plus de 180 jours dans le futur';
        ls.daysing = 'journée';
        ls.daypl = 'journées';
        ls.hoursing = 'heure';
        ls.hourpl = 'heures';
        ls.minsing = 'min';
        ls.minpl = 'mins';
        break;
    case 'de':
        ls.locale = 'de';
        ls.name = 'RTC Verbesserungen';
        ls.prefs = 'Standard Absturz Dauer (minuten)';
        ls.xdays = 'in X Tagen verfallen';
        ls.crash = 'Absturz';
        ls.invalidstart = 'Startdatum ist ungültig';
        ls.notint = 'Keine gültige ganze Zahl';
        ls.neg = 'Kann nicht negativ sein';
        ls.prefdefault = 'Default: ' + dstr + ' std';
        ls.preffuture = 'Es können nicht mehr als 180 Tage in der Zukunft festgelegt werden';
        ls.daysing = 'Tag';
        ls.daypl = 'Tagen';
        ls.hoursing = 'std';
        ls.hourpl = 'std';
        ls.minsing = 'min';
        ls.minpl = 'min';
        break;
    case 'it':
        ls.locale = 'it';
        ls.name = 'RTC Miglioramenti';
        ls.prefs = 'Predefinito schianto durata (minuti)';
        ls.xdays = 'Scade in X giorni';
        ls.crash = 'Schianto';
        ls.invalidstart = 'Data di inizio non è valida';
        ls.notint = 'Non un intero valido';
        ls.neg = 'Non può essere negativo';
        ls.prefdefault = 'Predefinito: ' + dstr + ' ore';
        ls.preffuture = 'Non può essere impostato più di 180 giorni per il futuro';
        ls.daysing = 'day';
        ls.daypl = 'days';
        ls.hoursing = 'ora';
        ls.hourpl = 'ore';
        ls.minsing = 'min';
        ls.minpl = 'min';
        break;
    default:
        ls.locale = 'en';
        ls.name = 'RTC Improvements';
        ls.prefs = 'Default crash length (minutes)';
        ls.xdays = 'Expire in X days';
        ls.crash = 'Crash';
        ls.invalidstart = 'Start date is invalid';
        ls.notint = 'Not a valid integer';
        ls.neg = 'Cannot be negative';
        ls.prefdefault = 'Default: ' + dstr + ' hrs';
        ls.preffuture = 'Can\'t be set more than 180 days in the future';
        ls.daysing = 'day';
        ls.daypl = 'days';
        ls.hoursing = 'hr';
        ls.hourpl = 'hrs';
        ls.minsing = 'min';
        ls.minpl = 'mins';
}

function welcomeToTheJungle() {
    try {
        var element = $('#sidepanel-prefs');
        if ($(element).length) {
            letsAGo();
        } else {
            setTimeout(welcomeToTheJungle, 1000);
        }
    } catch (err) {
        console.log("RTCENH - " + err);
        setTimeout(welcomeToTheJungle, 1000);
    }
}

welcomeToTheJungle();

function letsAGo() {
    $(document).on('mouseover', 'div.add-closure-button.waze-btn.waze-btn-white', function() {
        $(document).off('mouseover.RTCXdays');
        $(document).on('mouseover.RTCXdays', 'div.edit-closure.new', function() {
            justDewIt();
            $(document).off('mouseover.RTCXdays');
        });
    });

    $(document).on('mouseover', 'div.buttons.pull-right a.edit', function() {
        $(document).off('mouseover.editRTC');
        $(document).on('mouseover.editRTC', 'div.edit-closure:not(.new)', function() {
            if ($('input[name="closure_startDate"]').val() === '1969-12-31') {
                fixDatAppClosure();
            }
            $(document).off('mouseover.editRTC');
        });
    });

    $(document).on('input.RTCXdaysfield', 'input#expireinXdays', timeAndRelativeDimensionInSpace);
    $(document).on('click.RTCXdayscrash', 'div#RTCXdayscrash', ohNoes);

    $('#sidepanel-prefs').append('<hr />' +
                                 '<h4>' + ls.name + '<br />' + ls.prefs + '</h4>' +
                                 '<input type="text" class="form-control" id="RTCimprovcrashdays" />' +
                                 '<span style="font-weight:bold" id="RTCimprovprefsmsg"></span>' +
                                 '<hr />');
    thisIsWhatYouWanted();
    $(document).on('input.RTCXdaysprefs', 'input#RTCimprovcrashdays', thisIsWhatYouWanted);
}

function justDewIt() {
    $('div.edit-closure.new > form.form > div.checkbox').before(
        '<div class="form-group">' +
            '<label class="control-label">' + ls.xdays + '</label>' +
            '<div class="controls">' +
                '<input type="text" length="3" maxlength="4" class="form-control" id="expireinXdays" />' +
            '</div>' +
        '</div>' +
        '<span id="RTCimprovXdaysmsg" style="color:red;font-weight:bold"></span>'
    );

    $('div.action-buttons').append(
        '<div class="btn btn-danger" id="RTCXdayscrash" style="float:left"><i class="fa fa-exclamation-triangle"></i>  ' + ls.crash + '</div>'
    );
}

function timeAndRelativeDimensionInSpace() {
    var newdate = new Date();
    if ($('input[name="closure_startDate"]').val() !== '') {
        var p = $('input[name="closure_startDate"]').val().split('-');
        var y = Number(p[0]);
        var m = Number(p[1]);
        var d = Number(p[2]);
        if (!Number.isInteger(y) || isNaN(y) || !Number.isInteger(m) || isNaN(m) || !Number.isInteger(d) || isNaN(d)) {
            $('#RTCimprovXdaysmsg').text(ls.invalidstart);
            return;
        }
        newdate = new Date(y, m - 1, d);
    }
    var expInXDays = $('#expireinXdays').val();
    var v = Number(expInXDays);
    if (expInXDays === '') {
        $('#RTCimprovXdaysmsg').text('');
        return;
    } else if (v === 0 || !Number.isInteger(v) || isNaN(v)) {
        $('#RTCimprovXdaysmsg').text(ls.notint);
        return;
    }

    if (v < 0) {
        $('#RTCimprovXdaysmsg').text(ls.neg);
        return;
    }

    $('#RTCimprovXdaysmsg').text('');
    newdate.setDate(newdate.getDate() + v);
    setDatClosure(newdate, true);
    $('#expireinXdays').focus();
}

function ohNoes() {
    $('input[name="closure_reason"]').val('');
    $('input[name="closure_reason"]').sendkeys(ls.crash);
    var delay = Number(localStorage.getItem('RTCimprovcrashmins'));
    if (!Number.isInteger(delay) || isNaN(delay) || delay === 0 || delay === '0')
        delay = dmins;
    var cur = new Date();
    cur.setMinutes(cur.getMinutes() + delay);

    setDatClosure(cur, false);

    $('.form-control option:contains("None")').prop('selected', true);
}

function setDatClosure(dt, checkTime) {
	if (checkTime && $('input[name="closure_endTime"]').val() === '') {
        $('input[name="closure_endTime"]').timepicker('setTime', '05:00');
	} else if (!checkTime) {
		$('input[name="closure_endTime"]').timepicker('setTime', (('0' + dt.getHours()).slice(-2)) + ':' + (('0' + dt.getMinutes()).slice(-2)));
	}

	var dtstring = dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2);

	$('input[name="closure_endDate"]').val('');
	$('input[name="closure_endDate"]').sendkeys(dtstring);

	dt.setHours(0, 0, 0, 0);
    $('input[name="closure_endDate"]').data('daterangepicker').setStartDate(dt);

	dt.setHours(23, 59, 59, 999);
	$('input[name="closure_endDate"]').data('daterangepicker').setEndDate(dt);

	$('.daterangepicker.dropdown-menu.ltr.single.opensright.show-calendar').css('display', 'none');
	$('input[name="closure_endDate"]').data('daterangepicker').isShowing = false;
}

function fixDatAppClosure() {
    var cur = new Date();
    var curstring = cur.getFullYear() + '-' + ('0' + (cur.getMonth() + 1)).slice(-2) + '-' + ('0' + cur.getDate()).slice(-2);

	$('input[name="closure_startTime"]').timepicker('setTime', (('0' + cur.getHours()).slice(-2)) + ':' + (('0' + cur.getMinutes()).slice(-2)));
    $('input[name="closure_startDate"]').data('daterangepicker').setStartDate(curstring);
	$('input[name="closure_startDate"]').data('daterangepicker').setEndDate(curstring);

	$('input[name="closure_startDate"]').val('');
	$('input[name="closure_startDate"]').sendkeys(curstring);

	$('.daterangepicker.dropdown-menu.ltr.single.opensright.show-calendar').css('display', 'none');
	$('input[name="closure_startDate"]').data('daterangepicker').isShowing = false;

    $('div.edit-closure form.form div.form-group:nth-child(3)').append(
        '<span style="color:red;font-weight:bold">App closure, date/time changed</span>'
    );

    document.activeElement.blur();
}

function thisIsWhatYouWanted() {
    var v;
    if (firstrun) {
        v = localStorage.getItem('RTCimprovcrashmins');
        firstrun = false;
    }
    else
        v = $('input#RTCimprovcrashdays').val();

    v = Number(v);
    if (isNaN(Number(v)) || !Number.isInteger(v) || v === 0 || v === '0') {
        localStorage.setItem('RTCimprovcrashmins', dmins);
        $('#RTCimprovprefsmsg').css('color', 'green').text(ls.prefdefault);
        return;
    }
    if (!Number.isInteger(v) || isNaN(v)) {
        localStorage.setItem('RTCimprovcrashmins', dmins);
        $('#RTCimprovprefsmsg').css('color', 'red').text(ls.notint);
        return;
    }
    if (v < 0) {
        localStorage.setItem('RTCimprovcrashmins', dmins);
        $('#RTCimprovprefsmsg').css('color', 'red').text(ls.neg);
        return;
    }
    if (v > 259200) {
        localStorage.setItem('RTCimprovcrashmins', dmins);
        $('#RTCimprovprefsmsg').css('color', 'red').text(ls.preffuture);
        return;
    }
    localStorage.setItem('RTCimprovcrashmins', v);
    $('input#RTCimprovcrashdays').val(v);
    var min = v % 60;
    var hrso = (v - min) / 60;
    var hrsf = hrso % 24;
    var days = (hrso - hrsf) / 24;
    var ms = min !== 1 ? ls.minpl : ls.minsing;
    var hs = hrsf !== 1 ? ls.hourpl : ls.hoursing;
    var ds = days !== 1 ? ls.daypl : ls.daysing;
    $('#RTCimprovprefsmsg').css('color', 'green').text(days + ' ' + ds + ', ' + hrsf + ' ' + hs + ', ' + min + ' ' + ms);
}

// I'm incompetent, so this simulates actually typing into a text box.
// These plugins fix the problems with reasons not saving and with date field validation
// not passing.

// bililiteRange | dependency for sendkeys below | https://github.com/dwachss/bililiteRange/blob/master/bililiteRange.js
!function(){function d(a){return"undefined"!=typeof a.value?"value":"undefined"!=typeof a.text?"text":"undefined"!=typeof a.textContent?"textContent":"innerText"}function e(){}function f(){}function g(a,b){var c=b.text.replace(/\r/g,"").length;if(a.compareEndPoints("StartToStart",b)<=0)return 0;if(a.compareEndPoints("StartToEnd",b)>=0)return c;for(var d=0;a.compareEndPoints("StartToStart",b)>0;++d,a.moveStart("character",-1));return d}function h(a,b){var c=b.text.replace(/\r/g,"").length;if(a.compareEndPoints("EndToEnd",b)>=0)return c;if(a.compareEndPoints("EndToStart",b)<=0)return 0;for(var d=0;a.compareEndPoints("EndToStart",b)>0;++d,a.moveEnd("character",-1));return d}function i(){}function j(){}function k(a,b){if(a.firstChild)return a.firstChild;if(a.nextSibling)return a.nextSibling;if(a===b)return null;for(;a.parentNode;){if(a=a.parentNode,a==b)return null;if(a.nextSibling)return a.nextSibling}return null}function l(a,b,c,d){if(!(b<=0)){var e=a[c?"startContainer":"endContainer"];for(3==e.nodeType&&(b+=a[c?"startOffset":"endOffset"]);e;){if(3==e.nodeType){var f=e.nodeValue.length;if(b<=f){if(a[c?"setStart":"setEnd"](e,b),b==f){for(var g=k(e,d);g&&3==g.nodeType&&0==g.nodeValue.length;g=k(g,d))a[c?"setStartAfter":"setEndAfter"](g);g&&1==g.nodeType&&"BR"==g.nodeName&&a[c?"setStartAfter":"setEndAfter"](g)}return}a[c?"setStartAfter":"setEndAfter"](e),b-=f}e=k(e,d)}}}function q(a,b){return a.compareBoundaryPoints(m,b)<=0?0:a.compareBoundaryPoints(p,b)>=0?b.toString().length:(a=a.cloneRange(),a.setEnd(b.endContainer,b.endOffset),b.toString().replace(/\r/g,"").length-a.toString().replace(/\r/g,"").length)}function r(a,b){return a.compareBoundaryPoints(o,b)>=0?b.toString().length:a.compareBoundaryPoints(n,b)<=0?0:(a=a.cloneRange(),a.setStart(b.startContainer,b.startOffset),a.toString().replace(/\r/g,"").length)}function s(){}var a="onfocusin"in document.createElement("input")?"focusin":"focus",b=document.createElement("div");b.appendChild(document.createTextNode("x-")),b.appendChild(document.createTextNode("x")),b.normalize();var c=3==b.firstChild.length;bililiteRange=function(b,c){function h(a){a&&9==a.which?e._nativeSelect(e._nativeRange(b.bililiteRangeSelection)):b.bililiteRangeSelection=e._nativeSelection()}var e;if(c)e=new s;else if(window.getSelection&&b.setSelectionRange)try{b.selectionStart,e=new i}catch(a){e=new s}else e=window.getSelection?new j:document.selection?new f:new s;if(e._el=b,e._doc=b.ownerDocument,e._win="defaultView"in e._doc?e._doc.defaultView:e._doc.parentWindow,e._textProp=d(b),e._bounds=[0,e.length()],!("bililiteRangeMouseDown"in e._doc)){var g={_el:e._doc};e._doc.bililiteRangeMouseDown=!1,bililiteRange.fn.listen.call(g,"mousedown",function(){e._doc.bililiteRangeMouseDown=!0}),bililiteRange.fn.listen.call(g,"mouseup",function(){e._doc.bililiteRangeMouseDown=!1})}if("bililiteRangeSelection"in b||(h(),"onbeforedeactivate"in b?e.listen("beforedeactivate",h):e.listen("mouseup",h).listen("keyup",h),e.listen(a,function(){e._doc.bililiteRangeMouseDown||e._nativeSelect(e._nativeRange(b.bililiteRangeSelection))})),!("oninput"in b)){var k=function(){e.dispatch({type:"input",bubbles:!0})};e.listen("keyup",k),e.listen("cut",k),e.listen("paste",k),e.listen("drop",k),b.oninput="patched"}return e},e.prototype={length:function(){return this._el[this._textProp].replace(/\r/g,"").length},bounds:function(a){if(bililiteRange.bounds[a])this._bounds=bililiteRange.bounds[a].apply(this);else{if(!a){var b=[Math.max(0,Math.min(this.length(),this._bounds[0])),Math.max(0,Math.min(this.length(),this._bounds[1]))];return b[1]=Math.max(b[0],b[1]),b}this._bounds=a}return this},select:function(){var a=this._el.bililiteRangeSelection=this.bounds();return this._el===this._doc.activeElement&&this._nativeSelect(this._nativeRange(a)),this.dispatch({type:"select",bubbles:!0}),this},text:function(a,b){if(arguments.length){var c=this.bounds();this._el;return this.dispatch({type:"beforeinput",bubbles:!0,data:a,bounds:c}),this._nativeSetText(a,this._nativeRange(c)),"start"==b?this.bounds([c[0],c[0]]):"end"==b?this.bounds([c[0]+a.length,c[0]+a.length]):"all"==b&&this.bounds([c[0],c[0]+a.length]),this.dispatch({type:"input",bubbles:!0,data:a,bounds:c}),this}return this._nativeGetText(this._nativeRange(this.bounds())).replace(/\r/g,"")},insertEOL:function(){return this._nativeEOL(),this._bounds=[this._bounds[0]+1,this._bounds[0]+1],this},sendkeys:function(a){function c(a,b){/^{[^}]*}$/.test(b)&&(b=b.slice(1,-1));for(var c=0;c<b.length;++c){var d=b.charCodeAt(c);a.dispatch({type:"keypress",bubbles:!0,keyCode:d,which:d,charCode:d})}a.text(b,"end")}var b=this;return this.data().sendkeysOriginalText=this.text(),this.data().sendkeysBounds=void 0,a.replace(/{[^}]*}|[^{]+|{/g,function(a){(bililiteRange.sendkeys[a]||c)(b,a,c)}),this.bounds(this.data().sendkeysBounds),this.dispatch({type:"sendkeys",which:a}),this},top:function(){return this._nativeTop(this._nativeRange(this.bounds()))},scrollIntoView:function(a){var b=this.top();return(this._el.scrollTop>b||this._el.scrollTop+this._el.clientHeight<b)&&(a?a.call(this._el,b):this._el.scrollTop=b),this},wrap:function(a){return this._nativeWrap(a,this._nativeRange(this.bounds())),this},selection:function(a){return arguments.length?this.bounds("selection").text(a,"end").select():this.bounds("selection").text()},clone:function(){return bililiteRange(this._el).bounds(this.bounds())},all:function(a){return arguments.length?(this.dispatch({type:"beforeinput",bubbles:!0,data:a}),this._el[this._textProp]=a,this.dispatch({type:"input",bubbles:!0,data:a}),this):this._el[this._textProp].replace(/\r/g,"")},element:function(){return this._el},dispatch:function(a){a=a||{};var b=document.createEvent?document.createEvent("CustomEvent"):this._doc.createEventObject();b.initCustomEvent&&b.initCustomEvent(a.type,!!a.bubbles,!!a.cancelable,a.detail);for(var c in a)b[c]=a[c];var d=this._el;return setTimeout(function(){try{d.dispatchEvent?d.dispatchEvent(b):d.fireEvent("on"+a.type,document.createEventObject())}catch(f){var c=d["listen"+a.type];if(c)for(var e=0;e<c.length;++e)c[e].call(d,b)}},0),this},listen:function(a,b){var c=this._el;if(c.addEventListener)c.addEventListener(a,b);else{c.attachEvent("on"+a,b);var d=c["listen"+a]=c["listen"+a]||[];d.push(b)}return this},dontlisten:function(a,b){var c=this._el;if(c.removeEventListener)c.removeEventListener(a,b);else try{c.detachEvent("on"+a,b)}catch(f){var d=c["listen"+a];if(d)for(var e=0;e<d.length;++e)d[e]===b&&(d[e]=function(){})}return this}},bililiteRange.fn=e.prototype,bililiteRange.extend=function(a){for(fn in a)e.prototype[fn]=a[fn]},bililiteRange.bounds={all:function(){return[0,this.length()]},start:function(){return[0,0]},end:function(){return[this.length(),this.length()]},selection:function(){return this._el===this._doc.activeElement?(this.bounds("all"),this._nativeSelection()):this._el.bililiteRangeSelection}},bililiteRange.sendkeys={"{enter}":function(a){a.dispatch({type:"keypress",bubbles:!0,keyCode:"\n",which:"\n",charCode:"\n"}),a.insertEOL()},"{tab}":function(a,b,c){c(a,"\t")},"{newline}":function(a,b,c){c(a,"\n")},"{backspace}":function(a){var b=a.bounds();b[0]==b[1]&&a.bounds([b[0]-1,b[0]]),a.text("","end")},"{del}":function(a){var b=a.bounds();b[0]==b[1]&&a.bounds([b[0],b[0]+1]),a.text("","end")},"{rightarrow}":function(a){var b=a.bounds();b[0]==b[1]&&++b[1],a.bounds([b[1],b[1]])},"{leftarrow}":function(a){var b=a.bounds();b[0]==b[1]&&--b[0],a.bounds([b[0],b[0]])},"{selectall}":function(a){a.bounds("all")},"{selection}":function(a){for(var b=a.data().sendkeysOriginalText,c=0;c<b.length;++c){var d=b.charCodeAt(c);a.dispatch({type:"keypress",bubbles:!0,keyCode:d,which:d,charCode:d})}a.text(b,"end")},"{mark}":function(a){a.data().sendkeysBounds=a.bounds()}},bililiteRange.sendkeys["{Enter}"]=bililiteRange.sendkeys["{enter}"],bililiteRange.sendkeys["{Backspace}"]=bililiteRange.sendkeys["{backspace}"],bililiteRange.sendkeys["{Delete}"]=bililiteRange.sendkeys["{del}"],bililiteRange.sendkeys["{ArrowRight}"]=bililiteRange.sendkeys["{rightarrow}"],bililiteRange.sendkeys["{ArrowLeft}"]=bililiteRange.sendkeys["{leftarrow}"],f.prototype=new e,f.prototype._nativeRange=function(a){var b;return"INPUT"==this._el.tagName?b=this._el.createTextRange():(b=this._doc.body.createTextRange(),b.moveToElementText(this._el)),a&&(a[1]<0&&(a[1]=0),a[0]>this.length()&&(a[0]=this.length()),a[1]<b.text.replace(/\r/g,"").length&&(b.moveEnd("character",-1),b.moveEnd("character",a[1]-b.text.replace(/\r/g,"").length)),a[0]>0&&b.moveStart("character",a[0])),b},f.prototype._nativeSelect=function(a){a.select()},f.prototype._nativeSelection=function(){var a=this._nativeRange(),b=this.length(),c=this._doc.selection.createRange();try{return[g(c,a),h(c,a)]}catch(a){return c.parentElement().sourceIndex<this._el.sourceIndex?[0,0]:[b,b]}},f.prototype._nativeGetText=function(a){return a.text},f.prototype._nativeSetText=function(a,b){b.text=a},f.prototype._nativeEOL=function(){"value"in this._el?this.text("\n"):this._nativeRange(this.bounds()).pasteHTML("\n<br/>")},f.prototype._nativeTop=function(a){var b=this._nativeRange([0,0]);return a.boundingTop-b.boundingTop},f.prototype._nativeWrap=function(a,b){var c=document.createElement("div");c.appendChild(a);var d=c.innerHTML.replace("><",">"+b.htmlText+"<");b.pasteHTML(d)},i.prototype=new e,i.prototype._nativeRange=function(a){return a||[0,this.length()]},i.prototype._nativeSelect=function(a){this._el.setSelectionRange(a[0],a[1])},i.prototype._nativeSelection=function(){return[this._el.selectionStart,this._el.selectionEnd]},i.prototype._nativeGetText=function(a){return this._el.value.substring(a[0],a[1])},i.prototype._nativeSetText=function(a,b){var c=this._el.value;this._el.value=c.substring(0,b[0])+a+c.substring(b[1])},i.prototype._nativeEOL=function(){this.text("\n")},i.prototype._nativeTop=function(a){var b=this._el.cloneNode(!0);b.style.visibility="hidden",b.style.position="absolute",this._el.parentNode.insertBefore(b,this._el),b.style.height="1px",b.value=this._el.value.slice(0,a[0]);var c=b.scrollHeight;return b.value="X",c-=b.scrollHeight,b.parentNode.removeChild(b),c},i.prototype._nativeWrap=function(){throw new Error("Cannot wrap in a text element")},j.prototype=new e,j.prototype._nativeRange=function(a){var b=this._doc.createRange();return b.selectNodeContents(this._el),a&&(l(b,a[0],!0,this._el),b.collapse(!0),l(b,a[1]-a[0],!1,this._el)),b},j.prototype._nativeSelect=function(a){this._win.getSelection().removeAllRanges(),this._win.getSelection().addRange(a)},j.prototype._nativeSelection=function(){var a=this._nativeRange();if(0==this._win.getSelection().rangeCount)return[this.length(),this.length()];var b=this._win.getSelection().getRangeAt(0);return[q(b,a),r(b,a)]},j.prototype._nativeGetText=function(a){return String.prototype.slice.apply(this._el.textContent,this.bounds())},j.prototype._nativeSetText=function(a,b){b.deleteContents(),b.insertNode(this._doc.createTextNode(a)),c&&this._el.normalize()},j.prototype._nativeEOL=function(){var a=this._nativeRange(this.bounds());a.deleteContents();var b=this._doc.createElement("br");b.setAttribute("_moz_dirty",""),a.insertNode(b),a.insertNode(this._doc.createTextNode("\n")),a.collapse(!1)},j.prototype._nativeTop=function(a){if(0==this.length)return 0;if(""==a.toString()){var b=this._doc.createTextNode("X");a.insertNode(b)}var c=this._nativeRange([0,1]),d=a.getBoundingClientRect().top-c.getBoundingClientRect().top;return b&&b.parentNode.removeChild(b),d},j.prototype._nativeWrap=function(a,b){b.surroundContents(a)};var m=0,n=1,o=2,p=3;s.prototype=new e,s.prototype._nativeRange=function(a){return a||[0,this.length()]},s.prototype._nativeSelect=function(a){},s.prototype._nativeSelection=function(){return[0,0]},s.prototype._nativeGetText=function(a){return this._el[this._textProp].substring(a[0],a[1])},s.prototype._nativeSetText=function(a,b){var c=this._el[this._textProp];this._el[this._textProp]=c.substring(0,b[0])+a+c.substring(b[1])},s.prototype._nativeEOL=function(){this.text("\n")},s.prototype._nativeTop=function(){return 0},s.prototype._nativeWrap=function(){throw new Error("Wrapping not implemented")};var t=[];bililiteRange.fn.data=function(){var a=this.element().bililiteRangeData;return void 0==a&&(a=this.element().bililiteRangeData=t.length,t[a]=new u(this)),t[a]};try{Object.defineProperty({},"foo",{});var u=function(a){Object.defineProperty(this,"values",{value:{}}),Object.defineProperty(this,"sourceRange",{value:a}),Object.defineProperty(this,"toJSON",{value:function(){var a={};for(var b in u.prototype)b in this.values&&(a[b]=this.values[b]);return a}}),Object.defineProperty(this,"all",{get:function(){var a={};for(var b in u.prototype)a[b]=this[b];return a}})};u.prototype={},Object.defineProperty(u.prototype,"values",{value:{}}),Object.defineProperty(u.prototype,"monitored",{value:{}}),bililiteRange.data=function(a,b){b=b||{};var c=Object.getOwnPropertyDescriptor(u.prototype,a)||{};"enumerable"in b&&(c.enumerable=!!b.enumerable),"enumerable"in c||(c.enumerable=!0),"value"in b&&(u.prototype.values[a]=b.value),"monitored"in b&&(u.prototype.monitored[a]=b.monitored),c.configurable=!0,c.get=function(){return a in this.values?this.values[a]:u.prototype.values[a]},c.set=function(b){this.values[a]=b,u.prototype.monitored[a]&&this.sourceRange.dispatch({type:"bililiteRangeData",bubbles:!0,detail:{name:a,value:b}})},Object.defineProperty(u.prototype,a,c)}}catch(a){u=function(a){this.sourceRange=a},u.prototype={},bililiteRange.data=function(a,b){"value"in b&&(u.prototype[a]=b.value)}}}(),Array.prototype.forEach||(Array.prototype.forEach=function(a){"use strict";if(void 0===this||null===this)throw new TypeError;var b=Object(this),c=b.length>>>0;if("function"!=typeof a)throw new TypeError;for(var d=arguments.length>=2?arguments[1]:void 0,e=0;e<c;e++)e in b&&a.call(d,b[e],e,b)});

// sendkeys | https://github.com/dwachss/bililiteRange/blob/master/jquery.sendkeys.js
!function(a){a.fn.sendkeys=function(a){return a=a.replace(/([^{])\n/g,"$1{enter}"),this.each(function(){bililiteRange(this).bounds("selection").sendkeys(a).select(),this.focus()})},a.event.special.keydown=a.event.special.keydown||{},a.event.special.keydown._default=function(b){if(b.isTrusted)return!1;if(b.ctrlKey||b.altKey||b.metaKey)return!1;if(null==b.key)return!1;var c=b.target;if(c.isContentEditable||"INPUT"==c.nodeName||"TEXTAREA"==c.nodeName){var d=b.key;return d.length>1&&"{"!=d.charAt(0)&&(d="{"+d+"}"),a(c).sendkeys(d),!0}return!1}}(jQuery);