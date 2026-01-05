// ==UserScript==
// @name       JIRA sub-task order editor
// @namespace  com.nordstrom.sets
// @version    2.0
// @description  Change the order of JIRA sub-tasks via drag and drop.
// @match      https://*/browse/*
// @copyright  2012
// @downloadURL https://update.greasyfork.org/scripts/4861/JIRA%20sub-task%20order%20editor.user.js
// @updateURL https://update.greasyfork.org/scripts/4861/JIRA%20sub-task%20order%20editor.meta.js
// ==/UserScript==


function getorder(){
	order=[];
	$('#issuetable>tbody').children('tr').each(
		function(idx,elm) {
			if(elm.id) {
				order.push(elm.id);
			}
		});
	return order;
}

jQuery("#issuetable>tbody").sortable(
	{ 
		start:function() {
			old_order=getorder();
		} ,
		stop:function(event,ui) {
			new_order=getorder();
			for(i=0;i<=new_order.length;i++) {
				id=ui.item[0].id;
				if(id==old_order[i])oldpos=i;
				if(id==new_order[i])newpos=i;
			} 
			jQuery.ajax( {url:'/jira/secure/MoveIssueLink.jspa?id='+jQuery('#key-val').attr('rel')+'&currentSubTaskSequence='+oldpos+'&subTaskSequence='+newpos,} );
		}
	});