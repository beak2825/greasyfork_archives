// ==UserScript==
// @name        Hybrid - Check whether two places are the same
// @version     1.0
// @author      dawz
// @description Eric Chizzle
// @match      https://www.gethybrid.io/workers/tasks/*
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/23978/Hybrid%20-%20Check%20whether%20two%20places%20are%20the%20same.user.js
// @updateURL https://update.greasyfork.org/scripts/23978/Hybrid%20-%20Check%20whether%20two%20places%20are%20the%20same.meta.js
// ==/UserScript==

if ($('li:contains("Check whether two places are the same")').length) {
    var API = 'INSERT API';
    
    var maps = $('a:contains("map")');
    
    var qs = $('label[class="control-label"]');
    var as = $('div[class="input check_boxes optional item_responses_item_option_responses_item_option_id"]');
    var mFront = '<iframe width="200" height="200" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?q=';
    var mBack = '&key='+API+'" allowfullscreen></iframe>';
    var count = 1;
    var count2 = 0;
    for (i=2;i<12;i++) {
        //console.log(maps.eq(count-1).attr('href').replace('http://maps.google.com/?q=', ''));
        buildTbl(count+0, count+1, i);
        qs.eq(count2+1).appendTo($('#'+count+''));
        as.eq(count2).appendTo($('#'+count+''));
        $('#'+(count+1)+'').append(mFront+maps.eq(count-1).attr('href').replace('http://maps.google.com/?q=', '')+mBack);
        $('#'+(count+1)+'').append(mFront+maps.eq(count).attr('href').replace('http://maps.google.com/?q=', '')+mBack);
        count = count+2;
        count2++;
    }
    
    //var div = $('div[class="item-response order-2"]');
    //$('<iframe width="200" height="200" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?q=35.6462854%2C139.8513968&key=AIzaSyAsoTCW8Aoh8P7fqfo-_fPMAs1wVXbeTeY" allowfullscreen></iframe>').appendTo(div);
    //$('<iframe width="200" height="200" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?q=35.6462854%2C139.8513968&key=AIzaSyAsoTCW8Aoh8P7fqfo-_fPMAs1wVXbeTeY" allowfullscreen></iframe>').appendTo(div);

}

function buildTbl(id1, id2, div) {
    tbl  = document.createElement('table');
    $('div[class="item-response order-'+div+'').append(tbl);
    for(var i = 0; i < 1; i++) {
        var tr = tbl.insertRow();
        for(var j = 0; j < 2; j++) {
            var td = tr.insertCell();
            td.appendChild(document.createTextNode(''));
            td.style.width = '50%';
            if (j==0)
                td.id = id1;
            else if (j==1){
                td.id = id2;
            }
        }
    }
}