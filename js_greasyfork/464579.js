// ==UserScript==
// @name         Rehab
// @namespace    zero.rehab.torn
// @version      0.1
// @description  Shows last rehab time
// @author       -zero [2669774]
// @match        https://www.torn.com/companies.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM.xmlHttpRequest
// @connect      docs.google.com
// @downloadURL https://update.greasyfork.org/scripts/464579/Rehab.user.js
// @updateURL https://update.greasyfork.org/scripts/464579/Rehab.meta.js
// ==/UserScript==


const sheetId = '1ZR59FpE_46J4gbStlhJEMAL8u6YpIWRy5djcp0qh0L8';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'users';
const query = encodeURIComponent('Select *');
const url = `${base}&sheet=${sheetName}&tq=${query}`;
var data = {};
var locurl = window.location.href;
var curTime = Math.round(Date.now()/1000);

function convert(seconds){
    var x = '';
    var days = Math.floor(seconds / (3600*24));
    if (days){x += days + ' days '};
    seconds -= days*3600*24;
    var hrs = Math.floor(seconds / 3600);
    if (hrs){x += hrs + ' hours '};
    seconds -= hrs*3600;
    var mnts = Math.floor(seconds / 60);
    if (mnts){x += mnts + ' minutes ago'};
    seconds -= mnts*60;

    return x;
}

function insert(){
    if ($('.employee-list > li').length > 0){
        $('.employee-list > li').each(function() {
            var  el = $(this);
            var id = el.attr('data-user');
            var d = `<span>Last Rehab: ${data[id]}</span>`;
            el.append(d);
        });
    }
    else{
        setTimeout(insert,1000);
    }
}

function init(){
    console.log('Init');


    GM.xmlHttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
            console.log(response);
            var rep = response.responseText;
            var jdata = JSON.parse(rep.substr(47).slice(0,-2));
            console.log(jdata);

            for (let index in jdata.table.rows){
                var lastime = jdata.table.rows[index].c[2].v;
                var id = jdata.table.rows[index].c[0].v;
                console.log(id);

                data[id] = convert(curTime - lastime);
            }
            console.log(data);
            insert();
        }
    });


}
if (locurl.includes('option=employees')){
    init();
}

$(window).on('hashchange', function(e){
    locurl = window.location.href;
    if (locurl.includes('option=employees')){
        init();
    }

});