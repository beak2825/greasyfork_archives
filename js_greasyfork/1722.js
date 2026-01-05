// ==UserScript==
// @name           Hung-Ya Forum Tweaks
// @description    Some tweaks on the Hung-Ya forums.
// @include        http://bbs.bbs-tw.com/*
// @version 0.0.1.20190110112853
// @namespace https://greasyfork.org/users/2233
// @downloadURL https://update.greasyfork.org/scripts/1722/Hung-Ya%20Forum%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/1722/Hung-Ya%20Forum%20Tweaks.meta.js
// ==/UserScript==

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

if(/^http:\/\/bbs\.bbs-tw\.com\//.test(href))
{
    for(var lnks=doc.getElementsByTagName('A'), i=lnks.length-1; i>=0; i--) { lnks[i].target = '_blank' }
    if(/\/postshow\.pl\?/.test(href)) {
        // Auto redirection upon failure
        if( (!doc.getElementById("BbsShow")) || (!doc.getElementById("BbsShowMenu")) ) { loc.assign(loc.href + "&_=" + +(new Date)) }

        // Remove scripts
        var scripts=doc.getElementsByTagName('script')
        for(var i=scripts.length-1; i>=0; i--) { try { scripts[i].parentNode.removeChild(scripts[i]) } catch(e) {} }

        // Diable the <meta> refresh
        var no_refresh = function() { wnd.stop(); if( (!doc.getElementById("BbsShow")) || (!doc.getElementById("BbsShowMenu")) ) { loc.reload() } }
        if(doc.readyState == 'interactive') { no_refresh() }
        else { addEventListener("DOMContentLoaded", no_refresh, false) }

        // Clear all timeouts/intervals
        setTimeout(function() {
            var id = setTimeout(function() {}, 0)
            while(id--) { clearTimeout(id) }
            var id = setInterval(function() {}, 0)
            while(id--) { clearInterval(id) }
        }, 100)

        // Reload broken images
        var rbi = function() {
            var is_img_ok = function(img) {
                if(img.readyState!='complete') { return false }
                if(('naturalHeight' in img)&&(img.naturalHeight+img.naturalWidth==0)) { return false }
                if(img.width+img.height==0) { return false }
                return true
            }
            var reloadImages=function(w) {
                try {
                    for(var i=0; img=w.document.images[i]; i++) { if(!is_img_ok(img)) { img.src=img.src } } // doc.images[j]... does not work, cuz doc isn't a member of a window object
                    for(var j=0,F=null;F=w.frames[j];j++) { reloadImages(F) }
                } catch(e) {}
            }
            reloadImages(wnd)
        }
        if(doc.readyState == 'interactive') { rbi() } else { addEventListener("DOMContentLoaded", rbi, false) }

        // Remove iframes, embeds and objects
        var del_tags = function(t) {
            for(var e = doc.getElementsByTagName(t), i=e.length-1; i>=0; i--) { e[i].parentNode.removeChild(e[i]) }
        }        
        var no_annoyances = function() {
            del_tags('IFRAME')
            del_tags('EMBED')
            del_tags('OBJECT')
        }
        if(doc.readyState == 'interactive') { no_annoyances() } else { addEventListener('load', no_annoyances, false) }

        // Zap CSS
        for(var i=css=0;css=document.styleSheets[i];i++){
            css.disabled=true;
        }
        var all=document.getElementsByTagName('*');
        for(var i=(all=document.getElementsByTagName('*')).length;i>0;i--){
            var e=all[i-1];
            e.style.cssText='';
            if(e.nodeName=='STYLE'&&e.parentNode){
                e.parentNode.removeChild(e);
            }
            else{
                e.style='';
                e.size='';
                e.face='';
                e.color='';
                e.bgcolor='';
                e.background='';
            }
        }
    }
    else if(/\/postlist\.pl\?/.test(href)) { }
}

/* This script is meant to be used with the following ABP filters.
||bbs-tw.com/link/top.htm
||bbs.bbs-tw.com/javascript/all.js
bbs-tw.com##TABLE[ondragstart="window.event.returnValue=false"]
bbs-tw.com##TR>TD.AT
bbs-tw.com##TR>TH.AT
bbs-tw.com##TH>IFRAME
bbs.bbs-tw.com###x18x
bbs.bbs-tw.com###AdImg
bbs.bbs-tw.com###BbsShowPush
bbs.bbs-tw.com###AllMenu
bbs.bbs-tw.com###BbsListMenu
bbs.bbs-tw.com###BbsShowMenu
bbs.bbs-tw.com##.PG:first-child
bbs.bbs-tw.com##DIV>table.AT
bbs.bbs-tw.com##.addthis_toolbox
bbs.bbs-tw.com##.noneAnything
bbs.bbs-tw.com##TH>TABLE>TBODY>TR>TD>TABLE
*/
