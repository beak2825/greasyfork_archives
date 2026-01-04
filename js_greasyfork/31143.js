// ==UserScript==
// @name         XESS
// @namespace    http://tampermonkey.net/
// @version      1.022
// @description  Xossip Extended Smiley Set
// @author       Casinaar
// @grant        none
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @require      https://greasyfork.org/scripts/30498-xpcommon/code/XPCommon.js?version=206776
// @include      https://www.xossip.com/*
// @include      https://xossip.com/*
// @include      https://www.desiproject.com/*
// @include      https://desiproject.com/*
// @include      https://216.158.70.98/*
// @include      https://www.xossip.rocks/*
// @include      https://xossip.rocks/*
// @include      https://www.exbii.com/*
// @include      https://exbii.com/*
// @downloadURL https://update.greasyfork.org/scripts/31143/XESS.user.js
// @updateURL https://update.greasyfork.org/scripts/31143/XESS.meta.js
// ==/UserScript==
this.$ = window.jQuery.noConflict(true);
var textbox,text,getText,setText,customenabled=true;
$(document).ready(function() {
    resolveCompat();
    try{custcodelink;}catch(e){customenabled=false;}
    if(customenabled)
        codelink = $.extend({},codelink,custcodelink);
    $('#qr_submit,#vB_Editor_001_save,input[name="preview"]').click(function(){
        text=getText();
        for(var k in codelink)
           text = text.split(k).join('[IMG]http://pzy.be/i/'+codelink[k]+'[/IMG]');
        setText(text);
    });
    if((window.location.pathname).match(/livenewreply/))
    {
        var observerConfig = {subtree: true,childList:true};
        var targetNode = document.getElementById('row1');
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {addTitle();});
        });
        observer.observe(targetNode, observerConfig);
    }
    addTitle();
});
function addTitle()
{
    $('#spy_table img[src*="/i/2/smile_"],div[id*="post_message"] img[src*="/i/2/smile_"],.alt1 img[src*="/i/2/smile_"]')
        .prop({
        title:function(){
        var tmp=$(this).attr('src');
        return tmp.substring(tmp.lastIndexOf('_')+1,tmp.lastIndexOf('.'));
        },
        alt:""});
}
function resolveCompat()
{
    if((navigator.userAgent).match(/(Chrome|Edge|UCBrowser|OPR)/))
    {
        textbox = $('#vB_Editor_QR_textarea,#vB_Editor_001_textarea');
        getText = function(){return $(textbox).val();};
        setText = function(x){$(textbox).val(x);};
    }
    else if((navigator.userAgent).match(/(Firefox)/))
    {
        textbox = $('#vB_Editor_QR_iframe,#vB_Editor_001_iframe').contents().find('.wysiwyg');
        getText = function(){return $(textbox).html();};
        setText = function(x){$(textbox).html(x);};
    }
}