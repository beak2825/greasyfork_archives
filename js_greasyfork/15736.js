// ==UserScript==
// @name         Code Review helper
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Display code review to do list
// @author       cit
// @match        https://bitbucket.org/ciandt_it/nsk-ras/commits/*
// @match        https://bitbucket.org/ciandt_it/nsk-ras/pull-requests/*
// @exclude      https://bitbucket.org/ciandt_it/nsk-ras/commits/branch/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15736/Code%20Review%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/15736/Code%20Review%20helper.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Append to do list
var toDoListElement = '' 
+ '<div style="background: #628DB9; position: fixed; width: 20%; min-height:100%; max-height: 100%; overflow: auto;">'
+ '  <div style="padding: 10px 0px; background: #205081; color: white; text-align: center">'
+ '      <h1 style="color: white;">Code Review To Do List</h1>'
+ '  </div>'
+ '  <div style="font-size: 18px; text-align: left; padding: 5px" id="general">'
+ '	  <h2 style="background: #94ACC3; font-weight: bold;">General</h2>'
+ '	  <div style="background: #94ACC3;" id="todos_general">'
+ '		  <input type="checkbox"> "Am" prefix for new classes<br/>'
+ '		  <input type="checkbox"> Do not repeat values<br/>'
+ '		  <input type="checkbox"> Meaningful names<br/>'
+ '	  	  <input type="checkbox"> Ordered by section and alphabetically<br/>'
+ '		  <input type="checkbox"> Place in the right component<br/>'
+ '		  <input type="checkbox"> Use constants for literal values<br/>'
+ '		  <input type="checkbox"> The members order must be: <br/>1 - constants <br/>2 - fields <br/>3 - public methods <br/>4 - private methods <br/>5 - inner classes<br/>'
+ '		  <input type="checkbox"> Dont break the layer structure (<a href="https://docs.google.com/a/ciandt.com/drawings/d/1ZR1vB7nxtJ8mVFVJ10MzC1mscdG3b9gWpo0mgru3ORI/edit?usp=sharing">link</a>)<br/>'
+ '		  <input type="checkbox"> The validation can happen in view layer too. But it must happen in business layer (Manager/BT/Services).<br/>'
+ '		  <input type="checkbox"> Underscore ( _ ) for local variables<br/>'
+ '       <input type="checkbox"> Use constants to compare to a object. Like: Constants.VALUE.equals(object);<br/>'
+ '       <input type="checkbox"> Don’t use nested try/catch blocks<br/>'
+ '	  </div>'
+ '   <div id="strutsviewlayer"> '
+ '   <h2 style="font-weight: bold;">Struts View Layer</h2> '
+ '   <div id="todo_strutsviewlayer"> '
+ ' 	  <input type="checkbox"> The only responsability should be store values and add custom validations.  <br> '
+ ' 	  <input type="checkbox"> Must extend AbstractRASActionForm  <br> '
+ ' 	  <input type="checkbox"> Must extend AbstractRASAction  <br> '
+ ' 	  <input type="checkbox"> The jsp/action/form must have the SCREEN_ID as prefix: AMMMFTNFM10.jsp  <br> '
+ ' 	  <input type="checkbox"> It must not call manager directly. It must call delegator.  <br> '
+ '   </div> '
+ ' </div> '
+ ' <div id="applicationbundles"> '
+ ' <h2 style="background: #94ACC3; font-weight: bold;">Application Bundles</h2> '
+ ' <div style="background: #94ACC3;" id="todo_applicationbundles"> '
+ ' 	<input type="checkbox"> Check bundle for es_AR. <br> '
+ ' 	<input type="checkbox"> Check bundle for es_ES. <br> '
+ ' 	<input type="checkbox"> Check bundle for es. <br> '
+ ' 	<input type="checkbox"> Check bundle for pt_BR. <br> '
+ ' 	<input type="checkbox"> Check bundle for pt. <br> '
+ ' 	<input type="checkbox"> Check bundle for en (no suffix). <br> '
+ ' 	<input type="checkbox"> Alphabetical order <br> '
+ ' 	<input type="checkbox"> All files must have the same entries. <br> '
+ ' 	<input type="checkbox"> Create the necessary entries in MastermaintenanceTemplateResources <br> '
+ ' </div> '
+ ' </div> '
+ ' <div id="database"> '
+ ' <h2 style="font-weight: bold;">Database</h2> '
+ ' <div id="todo_database"> '
+ ' 	<input type="checkbox"> The new colums and tables must have "AM" as prefix <br> '
+ ' 	<input type="checkbox"> One entry per table in the DBFieldName.properties <br> '
+ ' 	<input type="checkbox"> One entry per column with its size in DBFieldLength.properties <br> '
+ ' 	<input type="checkbox"> One constant per table in DBNameCoreConstants.java <br> '
+ ' 	<input type="checkbox"> One constant per column with <TABLE_NAME>.<FIELD_NAME> in SQLFieldCoreConstants.java <br> '
+ ' 	<input type="checkbox"> One entry per column for validation in validate.properties <br> '
+ ' 	<input type="checkbox"> "LIKE" clause only when necessary (not for MU code, for example) <br> '
+ ' 	<input type="checkbox"> There must have a DDL script to create the table. RASDBDefinition/ddl <br> '
+ ' 	<input type="checkbox"> There must have a new script for each new change in database structure in RASDBDefinition/realease/<future_release_version>/<OPERATION>_<TARGET_OBJECT>.sql <br> '
+ ' 	<input type="checkbox"> Operations: create, load, alter <br> '
+ ' </div> '
+ ' </div> '
+ '    </div>'
+ '</div>';

$(toDoListElement).prependTo('body')

// Resize main window
$('#page').attr('style', 'float:right; display: inline; width: 80%;');
