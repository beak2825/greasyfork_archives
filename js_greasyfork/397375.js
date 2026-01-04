// ==UserScript==
// @name         KijijiAutos Ad Date
// @namespace    http://localhost
// @version      1.5
// @description  shows the date the ad was originally posted
// @author       Kronzky
// @include      https://www.kijiji.*/*
// @include      https://www.kijijiautos.*/*
// @include      https://www.autotrader.*/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397375/KijijiAutos%20Ad%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/397375/KijijiAutos%20Ad%20Date.meta.js
// ==/UserScript==

function getDate(path) {
    // dealer:  https://tdrpmimages.azureedge.net/photos/import/202003/0303/2531/0245a01b-dd96-4600-bc21-59480a7c5d9b.jpg-1024x786
    // private: https://tdrpmimages.azureedge.net/private/2020/1/22/a80010d7-72c1-4eb2-a5a4-d84ed8c7e71a.jpg-1024x786
    var metaParts = path.split('/');
    var ml=metaParts.length;
    var mY,mM,mD;
    for (var i=0; i<ml; i++) {
        var m=metaParts[i];
        if ((m.substr(0,3)=="201") || (m.substr(0,3)=="202")) {
            if (m.length==6) {
                mY = m.substr(0,4);
                mM = m.substr(4,2);
                mD = metaParts[i+1].substr(0,2);
            } else {
                mY = m;
                mM = metaParts[i+1];
                mD = metaParts[i+2];
            };
            break;
        };
    };
    return (new Date(mY,mM-1,mD).getTime()/1000);
}

(function() {
    'use strict';

    var unsafeWindow = window.wrappedJSObject;
    var pos = "top:120px; left:30px;"
    var posted = Date.now();
    var modified = Date.now();
    var where = document.body;
    var href = window.location.host;
    var pics;
    var valid = true;

    if ((href.indexOf("autotrader.com"))!=-1) {
        pos = "top:120px; right:245px;"
        pics = unsafeWindow.__BONNET_DATA__.props.vdp.images.sources;
        for (var p=0; p<pics.length-1; p++) {
            var imgdate = getDate(pics[p].src);
            posted = Math.min(imgdate,posted);
        };
    } else if ((href.indexOf("autotrader.ca"))!=-1) {
        pics = unsafeWindow.ngVdpModel.gallery.items;
        if (pics.length<2) {
            var meta = document.querySelector("meta[property='og:image']").getAttribute('content');
            posted = getDate(meta);
        } else {
            for (p=0; p<pics.length-1; p++) {
                imgdate = getDate(pics[p].galleryUrl);
                posted = Math.min(imgdate,posted);
            };
        };
    } else if ((href.indexOf("kijijiautos"))!=-1) {
        var vipidx = window.location.href.indexOf('vip='); // https://www.kijijiautos.ca/cars/chevrolet/impala/used/#vip=34811523
        var vipnum = window.location.href.substr(vipidx+4);
        var adidx = -1;
        for (var i=0; i<unsafeWindow.INITIAL_STATE.pages.srp.items.length; i++) {
            if (unsafeWindow.INITIAL_STATE.pages.srp.items[i].id == vipnum) {
                adidx = i;
                break;
            }
        }
        if (adidx != -1) {
            //posted = unsafeWindow.INITIAL_STATE.pages.vip.listing.created; // old
            posted = unsafeWindow.INITIAL_STATE.pages.srp.items[adidx].created;
            var datePosted = new Date(posted*1000);
            //console.log(unsafeWindow.INITIAL_STATE.pages.srp.items[adidx].title + ": " + posted + ', ' + (datePosted.toLocaleString('default', { month: 'short' })) + " " + datePosted.getDate());
            //modified = unsafeWindow.INITIAL_STATE.pages.srp.items[adidx].modified;
            //var dateModded = new Date(modified*1000);
            //console.log(modified + ', ' + (dateModded.toLocaleString('default', { month: 'short' })) + " " + dateModded.getDate());
        } else {
            posted = "xxx";
        }
    } else {
        if (typeof unsafeWindow.dataLayer[0].a == 'undefined') {
            valid = false;
        } else {
            posted = unsafeWindow.dataLayer[0].a.cdt;
            pos = "right:60px; top:-180px;"
            where = document.getElementById('vip-body');
        };
    };


    if (valid) {
        var dateInfo = 'no posted date found';
        if (!isNaN(posted.valueOf())) {
            var created = new Date(posted*1000);
            var dateStr = (created.toLocaleString('default', { month: 'short' })) + " " + created.getDate();
            var diffDays = Math.floor((Date.now()-created)/(1000*60*60*24));
            var diffStr = "today";
            if (diffDays>1) {
                diffStr = diffDays + ' days ago';
            } else if (diffDays==1) {
                diffStr = 'yesterday';
            };
            dateInfo = 'posted: ' + dateStr + ' (' + diffStr + ')';
        };
        var newHTML = document.createElement ('div');
        newHTML.innerHTML = '<h3 style="background-color:#fff; padding:4px; border:1px solid #333; position:absolute; ' + pos + ' color:#333">' + dateInfo + '</h3>';
        where.appendChild(newHTML);
    };
})();