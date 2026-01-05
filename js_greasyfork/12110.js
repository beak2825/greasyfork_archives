// ==UserScript==
// @id             www.imdb.com-c4030d09-bff0-4bc8-95b9-78af565930e3@scriptish
// @name           IPT Search for IMDB, TVmaze, next-episode
// @version        1.4
// @namespace      
// @author         
// @description    Adds a button to "IMDB", "TVmaze" and "next-episode.net" to search for the current title on IPTorrents
// @include        http://www.imdb.com/title/*
// @include        http://www.tvmaze.com/shows/*
// @include        http://next-episode.net/*
// @run-at         document-end
// @attribute_value bla
// @downloadURL https://update.greasyfork.org/scripts/12110/IPT%20Search%20for%20IMDB%2C%20TVmaze%2C%20next-episode.user.js
// @updateURL https://update.greasyfork.org/scripts/12110/IPT%20Search%20for%20IMDB%2C%20TVmaze%2C%20next-episode.meta.js
// ==/UserScript==

var query = '';
var params = '?ipts=1';

function insertAfter(parent, node, referenceNode) {
  parent.insertBefore(node, referenceNode.nextSibling);
}

if (window.location.href.indexOf('imdb.com') !== -1) {
	var imdb_id = window.location.href.split('/');
	query = imdb_id[imdb_id.length - 2];

	params +='&72=&73='; // movies and tv
	var parent = document.getElementById('img_primary');
	var parent2 = document.getElementsByClassName('subtext');
	if (parent2.length){
		parent2[0].innerHTML = parent2[0].innerHTML + '<div style="float: none; clear: both;"></div><div class="iptsearch" style="font-size: 10px; text-align: center; margin: 5px 0 0;"></div>';	
	}else{
		parent.innerHTML = parent.innerHTML + '<div style="float: none; clear: both;"></div><div class="iptsearch" style="font-size: 10px; text-align: center; margin: 5px 0 0;"></div>';
	}
	selector = document.getElementsByClassName('iptsearch')[0];
}

if (window.location.href.indexOf('tvmaze.com') !== -1) {
	var imdb_id = window.location.href.split('/');
	query = imdb_id[imdb_id.length - 1];
	
	params += '&73='; //tv
	var parent = document.getElementById('main-img');
	parent.innerHTML = parent.innerHTML + '<div style="float: none; clear: both;"></div><div class="iptsearch" style="font-size: 10px; text-align: center; margin: 10px 0;"></div>';
	selector = document.getElementsByClassName('iptsearch')[0];
}

if (window.location.href.indexOf('next-episode.net') !== -1) {
	var imdb_id = window.location.href.split('/');
	query = imdb_id[imdb_id.length - 1];
	
	params += '&73='; //tv
	var parent = document.getElementById('top_section');
	parent.innerHTML = parent.innerHTML + '<div style="float: none; clear: both;"></div><div class="iptsearch" style="font-size: 10px; margin: 0 0 0 20px;"></div>';
	selector = document.getElementsByClassName('iptsearch')[0];
}

var www = [
	'',
	'www.'
];

var sels = [
	'iptorrents.com',
	'iptorrents.us',
	'ipt.rocks',
	'iptorrents.me',
	'iptorrents.ru',
	'ipt.af'
];

var data = {
  'www': localStorage['www'],
  'domain': localStorage['domain']
}

if (typeof localStorage['www'] === 'undefined') {
  localStorage['www'] = www[0];
}
if (typeof localStorage['domain'] === 'undefined') {
  localStorage['domain'] = sels[0];
}


db = 1;

function genLinks(query){
	var ipt_link = 'https://'+localStorage['www']+localStorage['domain']+'/t'+params+'&q='+query+'&qf=#torrents';
	var style = "<style>#ipts-set:checked ~ #ipts {display:block !important}</style>";
	var link = '<input type="checkbox" id="ipts-set" style="display:none"><label for="ipts-set" id="settings" style="cursor: pointer; font-size: 20px; margin-right: 10px; color: #939393; line-height: 0px; position: relative; top: 4px;">&#9775;</label><a style="line-height:20px;color: #000;" href="'+ipt_link+'" target="_blank"><b>Search on iptorrents</b></a>';
	var opts = '<div style="display: none" id="ipts">';

	opts += '<select id="ipts-www">';
	for (var e = 0; e < www.length; e++) {
		var selected = '';
		if (www[e] === localStorage['www']) {
			selected = 'selected="selected"';
		}
		opts += '<option value="'+www[e]+'" '+selected+'>'+www[e]+'</option>';
	}
	opts += '</select>';
	
	opts += '<select id="ipts-domain">';
	for (var e = 0; e < sels.length; e++) {
		var selected = '';
		if (sels[e] === localStorage['domain']) {
			selected = 'selected="selected"';
		}
		opts += '<option value="'+sels[e]+'" '+selected+'>'+sels[e]+'</option>';
	}
	opts += '</select>';
	opts += '</div>';
	// $('.pro-title-link').html(style + link + opts);
	selector.innerHTML = (style + link + opts);

	var WwwSelect = document.getElementById('ipts-www');
	WwwSelect.onchange = function(){
		localStorage['www'] = WwwSelect.value;
		genLinks();   
	}
	var DomainSelect = document.getElementById('ipts-domain');
	DomainSelect.onchange = function(){
		localStorage['domain'] = DomainSelect.value;
		// localStorage['www'] = $(this).val();
		genLinks(query);   
	}
}
genLinks(query);   

