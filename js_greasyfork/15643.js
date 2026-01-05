// ==UserScript==
// @name         Hash slash
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://dx-pvs.juniper.net/jss-ciat/app/showHackSlashGnatsFilter*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15643/Hash%20slash.user.js
// @updateURL https://update.greasyfork.org/scripts/15643/Hash%20slash.meta.js
// ==/UserScript==

function select() {
    fl = $('#texta').val().split(/[,\n]+/).map(function (data) { if ($.trim(data) !== '') return $.trim(data)}).filter(function(data) { return data !== undefined })
	//fl = $('#texta').val().split(/[,\n]+/);
	//console.log(fl);
    if (fl.length == 0) {
        alert("Please input at least 1 feature!");
        return;
    }
    
    //for (i = 0; i < fl.length; i++) fl[i] = $.trim(fl[i]);
    tmp = fl.join('|');
    pre = '(' + tmp + ')';
	//pre = '(' + tmp.substr(0, tmp.length-1) + ')'
	re = new RegExp(pre, 'i');
    all = $('.checkbox');
    all.each(function() {
    	if(re.test(this.value) === true) 
    		this.checked = true;
    })
}


none_srx = /^(ex-sw-|qfx-sw-|sw-atlas-|sw-bras-|sw-esr-|sw-m-|sw-chassisd-m|sw-chassisd-ttx|sw-hyperion|sw-jplatform|sw-lldp-mx|sw-sangria-pfe|sw-trinity-|sw-vrrp|sw-nomad|sw-pfe-tseries-)/i;
sw_ldp = /^sw-idp-/;
sw_srx_sme = /^sw-srx-sme-/i;
sw_srx100 = /^sw-srx100-200-/i;
sw_utm = /^sw-utm-/i;
sw_viking = /^sw-viking-/i;
sw_vsrx = /^sw-vsrx-/i;

function conbut(val) {
	bun0 = document.createElement("input");
	bun0.type = "button";
	bun0.value = val;
	bun0.name = val;
    bun0.style.cssText = "background-color: #68a54b; color: #fff; cursor:pointer; border-color: rgb(76, 174, 76); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; :hover{background-color:#bc3315}";
	//bun.setAttribute("class", "myButton");
	return bun0;
}

function remove(cat) {
	all = $('.checkbox');
	for (i = 0; i < all.length; i++) {
		if (cat.test(all[i].value) === true) all[i].checked = true;
	}
}
/*
bun1 = conbut('None SRX');
bun2 = conbut('sw_ldp');
bun3 = conbut('sw_srx_sme');
bun4 = conbut('sw_srx100');
bun5 = conbut('sw_utm');
bun6 = conbut('sw_viking');
bun7 = conbut('sw_vsrx');
bun1.style.backgroundColor = '#000';
bun1.style.borderColor = '#000';

bun1.addEventListener('click', function() {
	remove(none_srx);
});

bun2.addEventListener('click', function() {
	remove(sw_ldp);
});

bun3.addEventListener('click', function() {
	remove(sw_srx_sme);
});

bun4.addEventListener('click', function() {
	remove(sw_srx100);
});
bun5.addEventListener('click', function() {
	remove(sw_utm);
});
bun6.addEventListener('click', function() {
	remove(sw_viking);
});
bun7.addEventListener('click', function() {
	remove(sw_vsrx);
});

row1 = document.getElementsByTagName('tbody')[0].insertRow(1).insertCell(0);
row1.appendChild(bun1);
row1.appendChild(bun2);
row1.appendChild(bun3);
row1.appendChild(bun4);
row1.appendChild(bun5);
row1.appendChild(bun6);
row1.appendChild(bun7);
*/
bun = document.createElement("input");
bun.type = "button";
bun.value = "RUN";
bun.name = "Test";
bun.style.cssText = "background-color: #68a54b; color: #fff; cursor:pointer; border-color: rgb(76, 174, 76); border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; :hover{background-color:#bc3315}";


var input1 = document.createElement('textarea');
input1.name = 'post';
input1.maxLength = '5000';
input1.cols = '70';
input1.rows = '5';
input1.style.fontFamily = 'Verdana';
input1.id = "texta";
input1.placeholder = 'Please input Comma-separated category (e.g. "sw-acx-pfe, bgp, vpn") ';
Row0 = document.getElementsByTagName('tbody')[0].insertRow(1);
cell0 = Row0.insertCell(0);
cell1 = Row0.insertCell(1); 

cell0.appendChild(input1);
cell1.appendChild(bun);
bun.onclick = select;