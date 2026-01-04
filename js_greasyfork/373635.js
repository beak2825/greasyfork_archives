// ==UserScript==
// @name           Multi rating graph for Codeforces
// @namespace      http://yak2.myhome.cx/
// @description    Enable to show rating history graph with other accounts on profile pages at Codeforces
// @license        http://creativecommons.org/publicdomain/zero/1.0/
// @copyright      yak_ex
// @version        1.3
// @include        http://www.codeforces.com/profile/*
// @include        http://codeforces.com/profile/*
// @include        http://www.codeforces.ru/profile/*
// @include        http://codeforces.ru/profile/*
// @downloadURL https://update.greasyfork.org/scripts/373635/Multi%20rating%20graph%20for%20Codeforces.user.js
// @updateURL https://update.greasyfork.org/scripts/373635/Multi%20rating%20graph%20for%20Codeforces.meta.js
// ==/UserScript==

// v1.3  2015/05/05 Sync with site changes.
// v1.2  2014/06/05 Autocomplete account names
//                  Keep the color of the highest dots
// v1.1  2013/03/15 Fix failure to get log-in account
//                  Version jump because Chrome recognizes 0.0x as 1.0
// v0.03 2011/04/17 Show log-in account always
// v0.02 2011/04/16 Adjust yaxis scale
//                  Warn if data can't be obtained
// v0.01 2011/04/16 Initial version

///////////////////////////////////////////////////////////////////////
//
// The following part is executed in content page scope
//

function extract_data(cont)
{
	var re1 = new RegExp('data\\.push\\(([\\S\\s]*?)\\);\\s*data\\.push\\(([\\S\\s]*?)\\);', 'm');
	return re1.test(cont) ? [RegExp.$1, RegExp.$2] : undefined;
}

function extract_scale(cont)
{
	var re2 = new RegExp('yaxis: { min: (\\d+), max: (\\d+),');
	return re2.test(cont) ? [RegExp.$1, RegExp.$2] : undefined;
}

function get_account_data(id)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://' + window.location.host + '/profile/' + id, false);
	xhr.send(null);
	if(xhr.status == 200) {
		return [extract_data(xhr.responseText), extract_scale(xhr.responseText)];
	}
	return undefined;
}

function update_graph(input)
{
	if(input == null) return;
	var handle = window.location.href.match(/[^/]*$/);
	input = handle + ' ' + input;
	var accounts = input.split(' ');
	var check = {};
	data = new Array();
	datas = [];
	var mymin = 900, mymax = 2000;
	var idx = 0;
	for(var i = 0; i < accounts.length; ++i) {
		if(accounts[i] != '' && check[accounts[i]] == undefined) {
			check[accounts[i]] = 1;
			var d = get_account_data(accounts[i]);
			if(d != undefined && d[0] != undefined) {
				data.push(eval(d[0][0]));
				data.push(eval(d[0][1]));
				datas[2*idx] = { label: accounts[i], data: data[2*idx] };
				datas[2*idx+1] = { clickable: false, hoverable: false, color: "red", data: data[2*idx+1] };
				++idx;
				if(d[1] != undefined) {
					if(d[1][0] < mymin) mymin = d[1][0];
					if(d[1][1] > mymax) mymax = d[1][1];
				}
			} else {
				alert("Can't get information for account: " + accounts[i] + ".");
			}
		}
	}
	if(idx == 1) {
		options.legend.position = "ne";
	} else {
		options.legend.position = "se";
	}
	options.yaxis.min = mymin;
	options.yaxis.max = mymax;
	plot = $.plot($("#placeholder"), datas, options);
	$("#placeholder .legend").unbind("click");
	$("#placeholder .legend").bind("click", account_manage);
}

function account_manage()
{
	var handle = window.location.href.match(/[^/]*$/);
	var dialog = $('<div id="account-dialog"/>').css({
		position:'fixed',padding:'5px',width:'30em',zIndex:2000,left:'50%',top:'50%',marginTop:'-3.5em',marginLeft:'-15em',
		border:'1px solid', borderRadius:'5px',background:'rgb(255,255,255)',boxShadow:'rgb(64,64,64) 5px 5px 5px'
	}).html(
		'<p>Input space-separated accounts without this account.</p>' +
		'<form id="account-form"><p><input type="text" id="accounts" size="40" value="'+(handle !=  login_account ? login_account : '')+'"></p>' +
		'<p><input type="submit" id="ok" value="OK"> <input type="button" id="cancel" value="cancel"></p></form>'
	);
	$('p', dialog).css({margin:'1em'});
	$('#cancel', dialog).click(function() {
		$('#account-dialog').remove();
		$('#account-dialog-blocker').remove();
	});
	$('#account-form', dialog).submit(function() {
		var input = $('#accounts').val();
		$('#account-dialog').remove();
		$('#account-dialog-blocker').remove();
		update_graph(input);
		return false;
	}).keydown(function(e) {
		if(e.keyCode == 27) {
			$('#cancel').click();
		}
	});
	var blocker = $('<div id="account-dialog-blocker"/>').css({
		position:'fixed',top:0,left:0,bottom:0,right:0,width:'100%',height:'100%',zIndex:15,
		background:'rgb(64,64,64)',opacity:0.75
	});
	$('body').append(blocker);
	$('body').append(dialog);
	$('#accounts').autocomplete("/data/handles", {
		delay: 200,
		width: 200,
		selectFirst: false,
		matchContains: true,
		multiple: true,
		multipleSeparator: ' ',
		minChars: 3,
		scroll: true,
	});
	$('#accounts').focus();
}

///////////////////////////////////////////////////////////////////////
//
// The following part is executed in userjs scope.
//

function add_unbind(cont)
{
	var marker = '$("#placeholder").bind("plothover"';
	return cont.replace(marker, '$("#placeholder").unbind("plothover");\n' + marker);
}

function get_login_account()
{
	var e = document.getElementById('header');
	var re3 = new RegExp('<a href="/profile/([^"]*)">[^<]*</a>[^<]*<a href="[^"]*/logout">');
	return re3.test(e.innerHTML) ? RegExp.$1 : undefined;
}

function disable_default_plot(cont)
{
	return cont.replace('var plot = $.plot($("#placeholder"), datas, options);', '').replace('var ctx = plot.getCanvas().getContext("2d");', '');
}

function add_account_manage(cont)
{
	var marker = 'var prev = -1;';
	var target = '';
	target += 'var extract_data = ' + extract_data + ';\n';
	target += 'var extract_scale = ' + extract_scale + ';\n';
	target += 'var get_account_data = ' + get_account_data + ';\n';
	var login_account = get_login_account();
	if(login_account != undefined) {
		target += 'var login_account = "' + get_login_account() + '";\n';
	} else {
		target += 'var login_account = "";\n';
	}
	target += 'options.legend = {};\n';
	target += 'var account_manage;\n';
	target += 'var update_graph = ' + update_graph + ';\n';
	target += 'account_manage = ' + account_manage + ';\n';
	target += 'update_graph(login_account);\n';
	target += '$("#placeholder .legend").unbind("click");\n';
	target += '$("#placeholder .legend").bind("click", account_manage);\n';
// CAUTION FRAGILE: monkey patch for Autocompleter to handle multiple words correctly
	target += '$(function() {\n';
	target += 'var old = $.Autocompleter;\n';
	target += 'eval("$.Autocompleter = " + (""+$.Autocompleter).replace("currentValue == q", "lastWord(currentValue) == q"));\n';
	target += '$.Autocompleter.defaults = old.defaults;$.Autocompleter.Cache = old.Cache;$.Autocompleter.Select = old.Select;\n';
	target += '});\n';

	return cont.replace(marker, target + marker);
}

function get_target_script()
{
	var e = document.getElementById('pageContent').getElementsByTagName('script');
	for(var i = 0; i < e.length; ++i) {
		if(e[i].textContent.match(/data\.push/) != null) {
			return e[i];
		}
	}
}

script = document.createElement('script');
script.setAttribute("type", "application/javascript");
script.textContent = disable_default_plot(add_account_manage(add_unbind(get_target_script().textContent)));

document.body.appendChild(script);
document.body.removeChild(script);
