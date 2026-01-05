// ==UserScript==
// @name        Task's missing language lister
// @description List task's missing language
// @include     https://www.nattee.net/grader/report/problem_hof*
// @version     5
// @grant       none
// @require     https://code.jquery.com/jquery-2.1.1.min.js
// @namespace https://greasyfork.org/users/4947
// @downloadURL https://update.greasyfork.org/scripts/5064/Task%27s%20missing%20language%20lister.user.js
// @updateURL https://update.greasyfork.org/scripts/5064/Task%27s%20missing%20language%20lister.meta.js
// ==/UserScript==
$.noConflict();

var menu=jQuery('.task-menu'),
	tasks=menu.children('a[href]'),
	langs=new Set(),
	completedTasks={},
	nTask=0,
	taskCount=0;

function displaySummary1(){
	var table=jQuery('<table class="info">'),tr=jQuery('<tr class="info-head">'),i=0;
	tr.append('<th>Lang');
	for(var taskName in completedTasks)
		tr.append('<th>'+taskName);
	table.append(jQuery('<thead>').append(tr));
	for(let lang of langs.values()){
		var tr=jQuery('<tr>').addClass(i++%2?'info-odd':'info-even').append(lang);
		for(var taskName in completedTasks){
			var td=jQuery('<td>');
			if(completedTasks[taskName].has(lang)){
				td[0].textContent='Yes';
			}
			else{
				td[0].textContent='No';
				td.addClass('ui-state-error');
			}
			tr.append(td);
		}
		table.append(tr);
	}
	jQuery('body').append(table);
}

function displaySummary2(){
	var table=jQuery('<table class="info">'),tr=jQuery('<tr class="info-head">'),i=0;
	tr.append('<th>Task');
	for(let lang of langs.values())
		tr.append('<th>'+lang);
	table.append(jQuery('<thead>').append(tr));
	for(var taskName in completedTasks){
		var tr=jQuery('<tr>').addClass(i++%2?'info-odd':'info-even').append(taskName);
		for(let lang of langs.values()){
			var td=jQuery('<td>');
			if(completedTasks[taskName].has(lang)){
				td[0].textContent='Yes';
			}
			else{
				td[0].textContent='No';
				td.addClass('ui-state-error');
			}
			tr.append(td);
		}
		table.append(tr);
	}
	jQuery('body').append(table);
}

function calMissedLang(){
	nTask=tasks.length;
	tasks.each(function(){
		var taskName=this.textContent;
		completedTasks[taskName]=new Set();
		jQuery.get(jQuery(this).attr('href'),function(html){
			jQuery('<div>').html(html).find('table td:first-child:not(.info_param)').each(function(){
				if(jQuery(this).nextAll(':last').text().trim()){
					var lang=this.textContent;
					langs.add(lang);
					completedTasks[taskName].add(lang);
				}
			});
			if(++taskCount>=nTask){
				displaySummary1();
				displaySummary2();
			}
		});
	});
}

//menu.append(jQuery('<a href="/grader/report/problem_hof">[missedLang]</a>'));

if(location.href.endsWith('problem_hof')) calMissedLang();
