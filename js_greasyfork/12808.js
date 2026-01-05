// ==UserScript==
// @name Orlygift.com Cleaner
// @namespace https://github.com/Tackyou/orlygift-cleaner
// @description A userscript to clean the orlygift website up
// @author Tackyou
// @version 1.9
// @license https://raw.githubusercontent.com/Tackyou/orlygift-cleaner/master/LICENSE
// @icon http://i.imgur.com/ukYltA1.png
// @match https://www.orlygift.com/
// @supportURL https://github.com/Tackyou/orlygift-cleaner/issues
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/12808/Orlygiftcom%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/12808/Orlygiftcom%20Cleaner.meta.js
// ==/UserScript==

// start with injecting some new css rules
var style = document.createElement('style');
style.appendChild(document.createTextNode('.slider,.row,.countdown-container,.modal-backdrop.fade.in,.ad-container,.headline-container div p,.last_claimed,#commander-cool-banner,.thumb,div.cc_banner-wrapper{display:none}.row.headline-container.animated,.content-perspective .content-inner .row{display:block}.content-perspective .content-inner div + .row{display:none !important}.headline-container{padding:0}.timeline .content-inner{padding:5px}.timeline .content-inner h3{font-size:16px;margin-top:11px}.timeline .content-perspective{margin-left:30px}.event label.arrow,.event input[type="radio"]{left:-50px}.timeline:before{left:-30px}.container-fluid .container{width:800px}'));
document.head.appendChild(style);

console.log("[Userscript] OrlyCleaner is active");

// automatically accept the new TOS if required, saving you some clicks and time
if($('input#terms').length>0){
    $('form.ng-pristine input#terms').prop('checked', true);
    $('form.ng-pristine input#newsletter').prop('checked', false);
    $('form.ng-pristine div.col-xs-4 button').trigger('click');
    console.log('[Userscript] Orlygift TOS accepted');
}

// cleaning some stuff to prevent loading images in background etc.
$('.countdown-container').remove();
$('.last_claimed').remove();

// clean finished steps
if($('.event.finished').length>3){ $('.event.finished').slice(0, -1).remove(); }else{ $('.event.finished').remove(); }
$('.alert.alert-success').nextAll().remove();

// lets make the timer alive and reload automatically on round end
var timelem = $('div.callout.callout-info strong');
if(timelem.length>0){
    var fetchtime = timelem.text();
    var mins = +(fetchtime.split(':')[0]), secs = (mins * 60 + (+(fetchtime.split(':')[1].split(' min')[0]))), currentSeconds = 0, currentMinutes = 0, count = setInterval(function() {
        currentMinutes = Math.floor(secs / 60); currentSeconds = secs % 60; if(currentSeconds <= 9) currentSeconds = '0' + currentSeconds; secs--; timelem.text(currentMinutes + ':' + currentSeconds + ' min');
        if(secs == -1){ clearInterval(count); $('.callout.callout-info').empty().html('<h1 style="margin:0;text-align:center;font-weight:bold"><a href="javascript:location.reload()" style="text-decoration:none">&gt;&gt;&gt; Reload & try again &lt;&lt;&lt;</a></h1>'); }
    }, 1000);
}
