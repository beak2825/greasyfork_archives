// ==UserScript==
// @name        kdcclicker.co.nz
// @namespace   kdcclicker
// @include     https://www.kdcclicker.co.nz/Miner
// @version     1
// @grant       none
// @description tampilkan data di kdcclicker
// @downloadURL https://update.greasyfork.org/scripts/31375/kdcclickerconz.user.js
// @updateURL https://update.greasyfork.org/scripts/31375/kdcclickerconz.meta.js
// ==/UserScript==

var el          = document.querySelector('.table td'),
    Hash_Rate   = parseFloat(el.innerHTML);
var perDetik    = ((Hash_Rate).toString()).slice(0,10),
    perMenit    = ((Hash_Rate*60).toString()).slice(0,10),
    perJam      = ((Hash_Rate*60*60).toString()).slice(0,10),
    perHari     = ((Hash_Rate*24*60*60).toString()).slice(0,10),
    waktuWD     = 1000000/parseFloat(perHari);
var styled = "background: #5cb85c;border-radius: 4px;padding: 4px 11px;color: #fff;display: inline-block;margin: 3px 0 0;text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.7);";

function eile(num){
    if(num.length<10){
        for(i=0; num.length<10; i++){
            num += "0";
        }
    }
    return num;
}

el.innerHTML = eile(perDetik) + ' KDC / detik';
el.innerHTML += '<br>' + eile(perMenit) + ' KDC / menit';
el.innerHTML += '<br>' + eile(perJam) + ' KDC / jam';
el.innerHTML += '<br>' + eile(perHari) + ' KDC / hari';
el.innerHTML += '<br><br> <b>Perkiraan Mencapai 1jt KDC:</b><br><b style="' + styled + '">' + parseInt(waktuWD) + ' Hari</b>';