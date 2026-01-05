// ==UserScript==
// @name			Ikariam Enhanced UI
// @description		Enhancements for the user interface of Ikariam.
// @namespace		Tobbe
// @author			Tobbe
// @version			4.2
// @license			MIT License
//
// @name:de			Ikariam Enhanced UI
// @description:de	Verbesserungen der Oberfläche von Ikariam.
//
// @run-at			document-idle
//
// 
// @include			/https?:\/\/s[0-9]*-[a-z]{2}\.ikariam\.gameforge\.com\/.*/
// 
// @require			https://greasyfork.org/scripts/5574-ikariam-core/code/Ikariam%20Core.js?version=669395
// 
// @connect			greasyfork.org
// 
// @grant			unsafeWindow
// @grant			GM_setValue
// @grant			GM.setValue
// @grant			GM_getValue
// @grant			GM.getValue
// @grant			GM_deleteValue
// @grant			GM.deleteValue
// @grant			GM_listValues
// @grant			GM.listValues
// @grant			GM_getResourceText
// @grant			GM.getResourceText
// @grant			GM_xmlhttpRequest
// @grant			GM.xmlHttpRequest
// 
// @bug				Opera & Chrome	Zooming with the mouse is not possible with "Shift" as access key.
// @bug				Opera & Chrome	No updating of the missing resources is possible due to a missing modification listener.
// @bug				All				The selected island is not centered in world view.
// @bug				All				If you are zooming to more than 100%, the view is not centered correctly after a page reload.
// 
// @history			4.2		Release: 10.02.2019
// @history			4.2		Core: Update to Version 3.2.1 - Greasy Fork prohibits update check intervals smaller than 24 hours
// @history			4.2		Core: Update to Version 3.2.1 - Include all translations in the script and remove external dependencies for translations
// @history			4.2		Language: Include all translations in the script and remove external dependencies for translations
// @history			4.2		Language: Update Russian translation
// 
// @history			4.1.0.1	Release: 14.11.2017
// @history			4.1.0.1	Core: Update to Version 3.1.0.1 - Fix issue with Greasemonkey 4.0 and incorrect link to translation files
// @history			4.1.0.1	Language: Update Greek translation
// 
// @history			4.1		Release: 12.11.2017
// @history			4.1		Core: Update to Version 3.1 - Support translations in Greasemonkey 4.0
// 
// @history			4.0		Release: 10.11.2017
// @history			4.0		Core: Update to Version 3.0 - Adjust to work with Greasemonkey 4.0 and Firefox 57
// @history			4.0		Change: Adjust the script to work with Greasemonkey 4.0 and Firefox 57.
// @history			4.0		Bugfix: Global messages break embedded messages preview.
// @history			4.0		Bugfix: Formatting of income table was changed.
// 
// @history			3.4		Release: 19.02.2017
// @history			3.4		Core: Update to Version 2.3.3 - Bug fix (crew conversion broken)
// @history			3.4		Feature: Up to 60 characters of messages are displayed in the message overview.
// @history			3.4		Feature: Link barracks / shipyard from troop overview / dismiss units screen.
// @history			3.4		Bugfix: No jumping header bar anymore due to MMO links.
// @history			3.4		Bugfix: Troop information was displayed incorrectly.
// 
// @history			3.3		Release: 05.06.2016
// @history			3.3		Feature: Add @connect information to avoid requests from Tampermonkey.
// @history			3.3		Feature: Daily expenses in resource information if amount is negative.
// @history			3.3		Bugfix: Tooltip formatting for resource information broken.
// @history			3.3		Bugfix: Formatting of direct tooltip in military advisor broken.
// @history			3.3		Bugfix: Foreign troops are incorrect displayed in troop information.
// 
// @history			3.2.2	Release: 02.02.2016
// @history			3.2.2	Core: Update to Version 2.3.2 - Bug fix (permanent reload of crew conversion)
// 
// @history			3.2.1	Release: 27.01.2016
// @history			3.2.1	Core: Update to Version 2.3.1 - Bug fixes
// 
// @history			3.2		Release: 27.01.2016
// @history			3.2		Core: Update to Version 2.3 - Bug fixes
// @history			3.2		Feature: Let the script also run on SSL encripted Ikariam page.
// @history			3.2		Bugfix: In very rare cases it was possible that the script was to fast and thus did not work.
// @history			3.2		Language: French translation added (incomplete).
// 
// @history			3.1		Release: 14.10.2015
// @history			3.1		Core: Update to Version 2.2 - Bug fixes and user specific options
// @history			3.1		Feature: Player specific signatures in messages.
// @history			3.1		Change: Remove easy circular message functionality as it is implemented directly in Ikariam now.
// @history			3.1		Language: Turkish translation added (incomplete).
// 
// @history			3.0.3	Release: 20.03.2015
// @history			3.0.3	Bugfix:	Town name in unit information incorrect.
// 
// @history			3.0.2	Release: 08.03.2015
// @history			3.0.2	Bugfix:	Wrong time display for last reset of highscore information.
// @history			3.0.2	Bugfix: Start piracy raid icon was resized.
//
// @history			3.0.1	Release: 07.03.2015
// @history			3.0.1	Language: Updated Greek translation.
// @history			3.0.1	Bugfix:	Language key in message options.
// @history			3.0.1	Bugfix: Alliance member data stored at same place for all alliance members.
//
// @history			3.0		Release: 05.03.2015
// @history			3.0		Language: Russian translation added (incomplete).
// @history			3.0		Language: Italian translation added (incomplete).
// @history			3.0		Language: Greek translation added (incomplete).
// @history			3.0		Change: Implementation of Ikariam Core - rewrote the complete code.
// @history			3.0		Change: Cleared the update history to use the Ikariam Core labels.
// @history			3.0		Bugfix:	Diverse graphic errors.
// @history			3.0		Bugfix: Broken in Firefox and Chrome.
// @history			3.0		Due to rename of script: Manually deleting old script necessary.
//
// @history			2.6		Release: 12.10.2014
// @history			2.6		Bugfix: Script options were broken.
// 
// @history			2.6		Release: 19.08.2014
// @history			2.5		Bugfix: Game language is recognized again.
// @history			2.5		Bugfix: Works now in Greasemonkey 2.0+
// @history			2.5		Change: Checks now for updates on Greasy Fork.
// @history			2.5		Removed code parts for mobile version.
// @history			2.5		Removed alliance page improvement, as fixed in Ikariam v0.5.13
// 
// @history			2.6		Release: 11.09.2013
// @history			2.4		Bugfix: New Ikariam domain -> script can now be used with this domain
// 
// @history			2.3		Release: 12.04.2013
// @history			2.3		Feature: Formatting troop lists for posting in forums / personal messages.
// @history			2.3		Feature: Filling level of warehouse as bar in town view.
// @history			2.3		Feature: Link to mines / town hall when clicking on resources / citizens.
// @history			2.3		Change: New versioning system.
// @history			2.3		Bugfix: Some characters in links were not decoded correctly.
// @history			2.3		Bugfix: Watching a foreign city causes a abortion of the script.
// @history			2.3		Bugfix: The city dropdown sometimes was zoomed in world view.
// @history			2.3		Bugfix: Removed obsolete CSS styles for Firefox.
// @history			2.3		Adjustments in the language files.
// @history			2.3		Violent Monkey brings Greasemonkey functions to Opera.
// 
// @history			2.2.1	Release: 11.10.2012
// @history			2.2.1	Feature: Smaller icons in direct military tooltip.
// @history			2.2.1	Bugfix: Problems with update check and version numbers >= 10.
// @history			2.2.1	Bugfix: Problems with another script.
// @history			2.2.1	Bugfix: Problems with a wrong style in island view.
// 
// @history			2.2		Release: 10.10.2012
// @history			2.2		Feature: Message signature can be set.
// @history			2.2		Feature: Button for faster sending of circular messages.
// @history			2.2		Feature: Make links in messages clickable.
// @history			2.2		Feature: Show town information of colonizing cities.
// @history			2.2		Feature: Information about cargo / fleets is displayed directly in military view.
// @history			2.2		Feature: Script options: Sections on the script tab can be folded.
// @history			2.2		Bugfix: Tooltips with mouseover were not clickable anymore.
// @history			2.2		Changes in code for better overview.
// 
// @history			2.1.1	Release: 01.10.2012
// @history			2.1.1	Feature: Different styles for income in town view.
// @history			2.1.1	Feature: Remaining resources after upgrade.
// @history			2.1.1	Feature: Improved style for external alliance pages.
// @history			2.1.1	Feature: Refresh the missing / remaining resources in construction view automatically.
// 
// @history			2.1		Release: 23.09.2012
// @history			2.1		Feature: Show the missing resources in construction view.
// @history			2.1		Feature: Show the hourly income directly in town view and add the daily production as popup.
// @history			2.1		Feature: Don't center town information in the town advisor.
// @history			2.1		Feature: Save the highscore data of alliance members and compare it with the actual value.
// @history			2.1		Bugfix: There was an error with a missing language package and seperators.
// @history			2.1		Bugfix: Some things in worldview were not resized correctly.
// @history			2.1		Prevent more than one script execution.
// @history			2.1		Prevent more than one script option panel (the script option panel now is usable for other scripts, too).
// 
// @history			2.0.1	Release: 27.08.2012
// @history			2.0.1	Bugfix: Zooming was broken.
// @history			2.0.1	Bugfix: Dropdown menus created by the script were broken.
// @history			2.0.1	Bugfix: Tooltips in in Alliance / Military view were not shown correctly.
// 
// @history			2.0		Release: 18.07.2012
// @history			2.0		Language: Latvian translation
// @history			2.0		Feature: Cross-browser compatibility.
// @history			2.0		Feature: Possibility to hide the update hint for a new script version.
// @history			2.0		Bugfix: Resizing the owner state in world view was broken.
// @history			2.0		Some changes in the code for easier copying of functions which should be used by more than one script.
// 
// @history			1.7		Release: 12.06.2012
// @history			1.7		Feature: Resizing banners when zooming is possible in city view, too.
// @history			1.7		Feature: The zoom buttons are available in world view, too.
// @history			1.7		Feature: Zooming with the mouse scroll is possible again (now with key, standard is ctrl).
// @history			1.7		Change: Changes in the option panel due to the new zooming function features.
// @history			1.7		Bugfix: If resizing is enabled, zooming with the buttons will resize the banners, too.
// @history			1.7		Bugfix: The chat will not cause to much executions of script functions.
// @history			1.7		The language texts are integrated as resources, so that there is shorter code.
// @history			1.7		Replace the GM_* functions by myGM.* to expand them easy and add new.
// 
// @history			1.6		Release: 05.06.2012
// @history			1.6		Feature: Possibility to hide only the bird swarm animation.
// @history			1.6		Feature: Easier upkeep reduction table.
// @history			1.6		Feature: Enhanced zoom function using the Ikariam zoom function.
// @history			1.6		Due to the use of Ikariam functions the code could be reduced.
// @history			1.6		Code enhancements for shorter code.
// 
// @history			1.5.1.1	Release: 25.05.2012
// @history			1.5.1.1	Bugfix: Not all occurrences of hidden were changed.
// 
// @history			1.5.1	Release: 24.05.2012
// @history			1.5.1	Bugfix: Name of a class (hidden) is used by GF.
// 
// @history			1.5		Release: 24.05.2012
// @history			1.5		Feature: Options panel to enable/disable funtions and set settings.
// @history			1.5		Feature: Update interval can be set.
// @history			1.5		Feature: Manually check for updates.
// @history			1.5		Feature: Zoom function without resizing the whole view.
// @history			1.5		Feature: Move loading circle to another position.
// @history			1.5		Feature: Show tooltip in alliance / military view on mouseover.
// @history			1.5		Change: Code better commented. More comments, so that it is easier to understand.
// @history			1.5		Bugfix: Changed *.gif to *.png.
// @history			1.5		Version numbers adjusted.
// 
// @history			1.4.1	Release: 01.05.2012
// @history			1.4.1	Feature: Support for mobile interface.
// @history			1.4.1	Bugfix: Fixed bug with scrollbar in finances view.
// 
// @history			1.4		Release: 20.04.2012
// @history			1.4		Feature: Ready for 0.5.0, but also supports 0.4.5 furthermore.
// @history			1.4		Feature: Implemented support for different languages.
// @history			1.4		Feature: Enhanced script updater.
// @history			1.4		Change: Cleaned up code.
// @history			1.4		Change: Rename the script to "Enhanced UI".
// @history			1.4		Change: Change the namespace to "Tobbe".
// @history			1.4		Because of the change of namespace and name you have to delete the old script manually!
// 
// @history			1.3.3	Release: 11.04.2011
// @history			1.3.3	Bugfix: Problem with negative numbers and 0.4.2.4 fixed.
// 
// @history			1.3.2	Release: 15.01.2011
// @history			1.3.2	Feature: Own script updater.
// @history			1.3.2	Change: Remove everything what refered to other scripts.
// 
// @history			1.3.1	Release: 15.01.2011
// @history			1.3.1	Change: New script updater.
// 
// @history			1.3		Release: 14.01.2011
// @history			1.3		Change: Remove the script updater (Because of the problem with Greasemonkey scripts).
// 
// @history			1.2.1	Release: 28.12.2010
// @history			1.2.1	Change: New style of update panel.
// @history			1.2.1	Bugfix: Bug with ',' as seperator fixed.
// 
// @history			1.2		Release: 09.10.2010
// @history			1.2		Feature: Income in 24h added.
// @history			1.2		Change: Cleaned up code.
// 
// @history			1.1		Release: 13.04.2010
// @history			1.1		Feature: Update check implemented.
// 
// @history			1.0		Release: 12.04.2010
// @history			1.0		Initial release.
// @downloadURL https://update.greasyfork.org/scripts/4369/Ikariam%20Enhanced%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/4369/Ikariam%20Enhanced%20UI.meta.js
// ==/UserScript==

/**
 * Instantiate a new set of enhancement functions.
 * {@link https://greasyfork.org/scripts/4369-ikariam-enhanced-ui Script on Greasy Fork}
 * {@link https://github.com/IkaScripts/IkariamEnhancedUI Script on GitHub}
 * 
 * @version	4.2
 * @author	Tobbe	<ikascripts@tobbexiv.de>
 * 
 * @global
 * 
 * @class
 * @classdesc	Enhancements for the user interface of Ikariam.
 * 
 * @param	{IkariamCore}	$
 *   An instance of the Ikariam Core.
 */
function EnhancedUI(IC) {
	/**
	 * Script toolbar.
	 * 
	 * @type	{element}
	 */
	var ge_toolbar = IC.myGM.addElement('div', IC.myGM.$('#GF_toolbar'), { 'id': 'toolbar' }, true, IC.myGM.$('#GF_toolbar ul'));
	
	IC.myGM.addStyle(
		'#GF_toolbar > ul						{ width: auto !important; text-align: center !important; pointer-events: none; } \
		 #GF_toolbar > ul > *					{ pointer-events: auto; } \
		 #GF_toolbar #mmoNewsticker				{ display: inline-block !important; position: relative !important; } \
		 #GF_toolbar #mmoNewsticker > ul		{ width: 300px !important; } \
		 #' + IC.myGM.prefix + 'toolbar			{ float: right; } \
		 #' + IC.myGM.prefix + 'toolbar > div	{ display: inline-block; position: relative; float: right; margin: 0px 5px; }',
		'scriptToolbar'
	);
	
	IC.Options.addWrapper('diverseOptions', IC.Language.$('diverse.options.wrapperTitle'));
	
	IC.con.groupCollapsed('IkariamEnhancedUI initalization ...');
	IC.con.logTimeStamp('IkariamEnhancedUI: toolbar and general styles created');
	
	// General functions to enhance the view.
	(function() {
		IC.Options.addWrapper('enhancedView', IC.Language.$('view.options.wrapperTitle'));
		
		// Move the loading circle to the breadcrumb area.
		IC.Options.addCheckbox('moveLoadingCircle', 'enhancedView', 1, true, IC.Language.$('view.options.moveLoadingCircle'), {
			changeCallback: function(ib_newValue) {
				if(ib_newValue === true) {
					IC.myGM.addStyle(
						'#js_worldBread		{ margin-left: 16px !important; } \
						 #loadingPreview	{ transform: scale(0.5); -webkit-transform: scale(0.5); left: 35px !important; top: 141px !important; }',
						'enhancedView_moveLoadingCircle'
					);
					return;
				}
				
				IC.myGM.removeStyle('enhancedView_moveLoadingCircle');
			}
		});
		
		// Hide the flying bird swarm.
		IC.Options.addCheckbox('hideBirds', 'enhancedView', 1, true, IC.Language.$('view.options.hideBirds'), {
			changeCallback: function(ib_newValue) {
				if(ib_newValue === true) {
					IC.myGM.addStyle(
						'.bird_swarm	{ display: none; }',
						'enhancedView_hideBirds'
					);
					return;
				}
				
				IC.myGM.removeStyle('enhancedView_hideBirds');
			}
		});
		
		// Bind the town name and date to the top of the row in the town advisor.
		IC.Options.addCheckbox('noVerticalCenterInTownAdvisor', 'enhancedView', 1, true, IC.Language.$('view.options.noVerticalCenterInTownAdvisor'), {
			changeCallback: function(ib_newValue) {
				if(ib_newValue === true) {
					IC.myGM.addStyle(
						'#inboxCity td	{ vertical-align: top !important; }',
						'enhancedView_noVerticalCenterInTownAdvisor'
					);
					return;
				}
				
				IC.myGM.removeStyle('enhancedView_noVerticalCenterInTownAdvisor');
			}
		});
	})();
	
	IC.con.logTimeStamp('IkariamEnhancedUI: view functions created');
	
	// Functions for the island view.
	(function() {
		/**
		 * Storage for the colonizing city info functions.
		 * 
		 * @type	{object}
		 */
		var _go_colonizingCityInfo = new function() {
			/**
			 * Add the link to show the colonizing city information.
			 */
			var _lf_doShowColonizingCityInfo = function() {
				var la_colonizingCities = IC.myGM.$$('.level0');
			
				la_colonizingCities.forEach(function(le_colonizingCity) {
					var ls_locationId	= le_colonizingCity.id.replace(/\D/g, '');
					var ls_cityId		= IC.ika.getScreen().data.cities[ls_locationId].id;
					
					IC.myGM.$('#js_cityLocation' + ls_locationId + 'Link').href = '?view=cityDetails&destinationCityId=' + ls_cityId;
				});
			};
			
			/**
			 * Remove the link to show the colonizing city information.
			 */
			var _lf_doHideColonizingCityInfo = function() {
				var la_colonizingCityLinks = IC.myGM.$$('.level0 .link_img');
			
				la_colonizingCityLinks.forEach(function(le_colonizingCityLink) {
					le_colonizingCityLink.href = '';
				});
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_showColonizingCityInfo
			 *   If the user selected the checkbox to show the colonizing city info.
			 */
			this.updateSettings = function(ib_showColonizingCityInfo) {
				if(IC.Ikariam.view !== 'island')
					return;
				
				if(ib_showColonizingCityInfo === true) {
					IC.RefreshHandler.add('*', 'showColonizingCityInfo', _lf_doShowColonizingCityInfo);
					_lf_doShowColonizingCityInfo();
					return;
				}
				
				IC.RefreshHandler.remove('*', 'showColonizingCityInfo');
				_lf_doHideColonizingCityInfo();
			};
		};
		
		// Retrieve information about colonies during colonization.
		IC.Options.addCheckbox('showColonizingCityInfo', 'diverseOptions', 1, true, IC.Language.$('island.options.showColonizingCityInfo'), { changeCallback: _go_colonizingCityInfo.updateSettings });
		// Add a divider line.
		IC.Options.addLine('diverseOptions', 1);
	})();
	
	IC.con.logTimeStamp('IkariamEnhancedUI: island functions created');
	
	// Functions for the finance popup.
	(function(){
		/**
		 * Some general functions for the finance view enhancements.
		 * 
		 * @type	{object}
		 */
		var _go_generalFunctions = new function() {
			/**
			 * Extract the current income in the finance popup.
			 * 
			 * @return	{int}
			 *   The current income.
			 */
			this.getIncome = function() {
				var le_incomeCell = IC.myGM.$$('.hidden')[IC.myGM.$$('.hidden').length - 1];
				
				while(le_incomeCell.firstChild.firstChild)
					le_incomeCell = le_incomeCell.firstChild;
				
				return IC.Ikariam.getInt(le_incomeCell.innerHTML);
			};
			
			/**
			 * Create a new table row.
			 * 
			 * @param	{element}	ie_parentTable
			 *   The table to add the row to.
			 * @param	{string[]}	ia_classes
			 *   The class(es) of the table row. Set to null if no class should be set.
			 * @param	{object[]}	ia_cells
			 *   The data for the table cells. Both properties of each cell are optional. If the cell object is empty, an empty cell is created.
			 *   Signature: <code>[{ className: ['class1', 'class2', ...], text: 'cellContent' }]</code>
			 * @param	{boolean}	ib_isTableHeadRow
			 *   If the cells should be table header cells (th).
			 * 
			 * @return	{element}
			 *   The created row.
			 */
			this.createTableRow = function(ie_parentTable, ia_classes, ia_cells, ib_isTableHeadRow) {
				var re_newRow	= IC.myGM.addElement('tr', ie_parentTable, { classes: ia_classes });
				var ls_cellType	= 'td';
				
				if(!!ib_isTableHeadRow)
					ls_cellType = 'th';
					
				for(var i = 0; i < ia_cells.length; i++) {
					var lo_options = {
						'classes':	ia_cells[i].className
					};
					
					if(!!ia_cells[i].text === true)
						lo_options['innerHTML'] = ia_cells[i].text;
						
					IC.myGM.addElement(ls_cellType, re_newRow, lo_options);
				}
				
				return re_newRow;
			};
		};
		
		/**
		 * Storage for the income on top functions.
		 * 
		 * @type	{object}
		 */
		var _go_incomeOnTop = new function() {
			/**
			 * Callback to show the income on top.
			 */
			var _lf_doShowIncomeOnTop = function() {
				var le_summaryTable	= IC.myGM.$('.table01 tbody');
				var li_income		= _go_generalFunctions.getIncome();
				
				var la_incomeCells = [
					{ className: ['sigma'], text: IC.Language.$('finance.income.perHour') },
					{ className: ['nowrap', 'res'], text: IC.Ikariam.formatToIkaNumber(li_income) }
				];
				_go_generalFunctions.createTableRow(le_summaryTable, [], la_incomeCells);
				
				la_incomeCells[0].text = IC.Language.$('finance.income.perDay');
				la_incomeCells[1].text = IC.Ikariam.formatToIkaNumber(li_income * 24);
				_go_generalFunctions.createTableRow(le_summaryTable, [], la_incomeCells);
				
				var le_premiumCell = IC.myGM.$('.premiumOffer', le_summaryTable);
				le_premiumCell.rowSpan = le_premiumCell.rowSpan + 2;
				
				// Adjust the size of the Scrollbar.
				IC.ika.controller.adjustSizes();
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_showIncomeOnTop
			 *   If the user selected the checkbox to show the income on top.
			 */
			this.updateSettings = function(ib_showIncomeOnTop) {
				if(ib_showIncomeOnTop === true) {
					IC.RefreshHandler.add('finances', 'showIncomeOnTop', _lf_doShowIncomeOnTop);
					return;
				}
				
				IC.RefreshHandler.remove('finances', 'showIncomeOnTop');
			};
		};
		
		/**
		 * Storage for the short upkeep reduction table functions.
		 * 
		 * @type	{object}
		 */
		var _go_shortUpkeepReductionTable = new function() {
			/**
			 * Extract the data from the old tables.
			 * 
			 * @param	{element[]}	ia_oldUpkeepReductionTables
			 *   The old upkeep tables to collapse.
			 *   
			 * @return	{object[]}
			 *   The data for the table rows.
			 *   Signature:
			 *   <code>[{
			 *     rows: [
			 *       { reason : 'reason', basicUpkeep: int, supplyUpkeep: int, result: int }
			 *     ]
			 *     priorToReduction: int
			 *     income: int
			 *   }]</code>
			 */
			var _lf_getData = function(ia_oldUpkeepReductionTables) {
				var ro_data = {
					rows:				[],
					priorToReduction:	IC.Ikariam.getInt(IC.myGM.$('td.hidden', ia_oldUpkeepReductionTables[2]).innerHTML),
					income:				_go_generalFunctions.getIncome()
				};
				
				// Get the data for the troops and ships redution rows.
				for(var i = 0; i < 3; i++) {
					var le_basicUpkeepCell	= IC.myGM.$$('.alt.bottomLine td.hidden, .result td.hidden', ia_oldUpkeepReductionTables[0])[i];
					var le_supplyUpkeepCell	= IC.myGM.$$('.alt.bottomLine td.hidden, .result td.hidden', ia_oldUpkeepReductionTables[1])[i];
					var li_basicUpkeep		= IC.Ikariam.getInt(le_basicUpkeepCell.innerHTML);
					var li_supplyUpkeep		= IC.Ikariam.getInt(le_supplyUpkeepCell.innerHTML);
					
					var lo_row = {
						reason:			IC.Language.$('finance.upkeep.reason.' + i),
						basicUpkeep:	li_basicUpkeep,
						supplyUpkeep:	li_supplyUpkeep,
						result:			li_basicUpkeep + li_supplyUpkeep
					};
					
					ro_data.rows.push(lo_row);
				}
				
				return ro_data;
			};
			
			/**
			 * Prepare the table rows for easy adding to the new table.
			 * 
			 * @param	{element[]}	ia_oldUpkeepReductionTables
			 *   The old upkeep tables to collapse.
			 *   
			 * @return	{object[]}
			 *   The data for the table rows.
			 *   Signature:
			 *   <code>[{
			 *     classes:		'class' || ['class1', 'class2', ...]
			 *     isHeadRow:	true || false
			 *     cells:	[
			 *       { className: 'class' || ['class1', 'class2', ...], text: 'cellContent' (optional) }
			 *     ]
			 *   }]</code>
			 */
			var _lf_prepareTableRows = function(ia_oldUpkeepReductionTables) {
				var lo_data = _lf_getData(ia_oldUpkeepReductionTables);
				var ra_tableRows = [];
				
				// Header
				ra_tableRows.push({
					classes:	[],
					isHeadRow:	true,
					cells:		[
						 { className: ['city', 'left'] },
						 { className: ['left'], text: IC.Language.$('finance.upkeep.basic') },
						 { className: ['left'], text: IC.Language.$('finance.upkeep.supply') },
						 { className: ['left'], text: IC.Language.$('finance.upkeep.result') }
					]
				});
				
				// Income without reduction
				ra_tableRows.push({
					classes:	['alt', 'bottomLine'],
					isHeadRow:	false,
					cells:		[
						{ className: ['city', 'left'], text: IC.Language.$('finance.income.start') },
						{ className: ['nowrap', 'res'] },
						{ className: ['nowrap', 'res'] },
						{ className: ['nowrap', 'res'], text: IC.Ikariam.formatToIkaNumber(lo_data.priorToReduction) }
					]
				});
				
				// Income reduction
				lo_data.rows.forEach(function(io_row, ii_index) {
					var trClass = [];
					if(ii_index % 2 === 1)
						trClass = ['alt', 'bottomLine'];
					
					ra_tableRows.push({
						classes:	trClass,
						isHeadRow:	false,
						cells:		[
							{ className: ['city', 'left'],	text: io_row.reason },
							{ className: ['nowrap', 'res'],	text: IC.Ikariam.formatToIkaNumber(-io_row.basicUpkeep) },
							{ className: ['nowrap', 'res'],	text: IC.Ikariam.formatToIkaNumber(-io_row.supplyUpkeep) },
							{ className: ['nowrap', 'res'],	text: IC.Ikariam.formatToIkaNumber(-io_row.result) }
						]
					});
				});
				
				// Result
				ra_tableRows.push({
					classes:	['result'],
					isHeadRow:	false,
					cells:		[
						{ className: ['sigma', 'left'], text: '<img alt="Summe" src="skin/layout/sigma.png">' },
						{ className: ['nowrap', 'res'] },
						{ className: ['nowrap', 'res'] },
						{ className: ['nowrap', 'res'],	text: IC.Ikariam.formatToIkaNumber(lo_data.income) }
					]
				});
				
				return ra_tableRows;
			};
			
			/**
			 * Create the new upkeep reduction table.
			 * 
			 * @param	{element[]}	ia_oldUpkeepReductionTables
			 *   The old upkeep tables.
			 */
			var _lf_createNewTable = function(ia_oldUpkeepReductionTables) {
				var le_shortTable	= IC.myGM.addElement('table', ia_oldUpkeepReductionTables[0].parentNode, { 
					'id':		'balance',
					'classes':	['table01', 'border']
				}, null, ia_oldUpkeepReductionTables[0]);
				
				var la_tableRows = _lf_prepareTableRows(ia_oldUpkeepReductionTables);
				
				la_tableRows.forEach(function(io_rowData) {
					_go_generalFunctions.createTableRow(le_shortTable, io_rowData.classes, io_rowData.cells, io_rowData.isHeadRow);
				});
				
				IC.myGM.addElement('hr', ia_oldUpkeepReductionTables[0].parentNode, {}, null, ia_oldUpkeepReductionTables[0]);
			};
			
			/**
			 * Toggle the status of an old upkeep table (collapsed / non-collapsed).
			 */
			var _lf_toggleUpkeepReductionTable = function() {
				IC.myGM.toggleShowHideButton(this);
				
				var la_rows = IC.myGM.$$('tr:not(:first-child)', this.parentNode.parentNode.parentNode);
				
				la_rows.forEach(function(ie_row) {
					ie_row.classList.toggle('invisible');
				});
				
				// Adjust the size of the Scrollbar.
				IC.ika.controller.adjustSizes();
			};
			
			/**
			 * Minimize the old upkeep tables and make them collapsable.
			 * 
			 * @param	{element[]}	ia_oldUpkeepReductionTables
			 *   The old upkeep tables to collapse.
			 */
			var _lf_minimizeOldTables = function(ia_oldUpkeepReductionTables) {
				for(var i = 0; i < ia_oldUpkeepReductionTables.length; i++) {
					var la_rows = IC.myGM.$$('tr', ia_oldUpkeepReductionTables[i]);
					
					la_rows.forEach(function(ie_row, ii_index) {
						if(ii_index !== 0)
							ie_row.classList.add('invisible');
					});
					
					var le_buttonParent	= IC.myGM.$('th', la_rows[0]);
					IC.myGM.addElement('div', le_buttonParent, {
						'class':	'maximizeImg',
						'style':	[['cssFloat', 'left']],
						'title':	IC.Language.$('general.expand'),
						'click':	_lf_toggleUpkeepReductionTable
					}, null, le_buttonParent.firstChild);
				}
			};
			
			/**
			 * Callback to show the short upkeep reduction table.
			 */
			var _lf_doShowShortTable = function() {
				var la_oldUpkeepReductionTables = IC.myGM.$$('.upkeepReductionTable');
				
				_lf_createNewTable(la_oldUpkeepReductionTables);
				_lf_minimizeOldTables(la_oldUpkeepReductionTables);
				
				// Adjust the size of the Scrollbar.
				IC.ika.controller.adjustSizes();
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_showShortTable
			 *   If the user selected the checkbox to show the short upkeep reduction table.
			 */
			this.updateSettings = function(ib_showShortTable) {
				if(ib_showShortTable === true) {
					IC.RefreshHandler.add('finances', 'shortUpkeepReductionTable', function() { _lf_doShowShortTable(); });
					return;
				}
				
				IC.RefreshHandler.remove('finances', 'shortUpkeepReductionTable');
			};
		};
		
		// Show the income also on top in finance popup.
		IC.Options.addCheckbox('showIncomeOnTop', 'diverseOptions', 1, true, IC.Language.$('finance.options.showIncomeOnTop'), { changeCallback: _go_incomeOnTop.updateSettings });
		// Short overview upkeep reduction table in finance popup.
		IC.Options.addCheckbox('shortUpkeepReductionTable', 'diverseOptions', 1, true, IC.Language.$('finance.options.shortUpkeepReductionTable'), { changeCallback: _go_shortUpkeepReductionTable.updateSettings });
		// Add a divider line.
		IC.Options.addLine('diverseOptions', 1);
	})();
	
	IC.con.logTimeStamp('IkariamEnhancedUI: finance functions created');
	
	// Functions for missing resources.
	(function() {
		/**
		 * Storage for the missing ressources functions.
		 * 
		 * @type	{object}
		 */
		var _go_showMissingResources = new function() {
			/**
			 * Update the information in the missing resources wrappers.
			 * 
			 * @param	{boolean}	ib_isUpdateView
			 *   If the update is in the update view.
			 */
			var _lf_updateInformation = function(ib_isUpdateView) {
				var la_currentResources = [
					IC.ika.getModel().currentResources.resource,	// Wood.
					IC.ika.getModel().currentResources[1],			// Wine.
					IC.ika.getModel().currentResources[2],			// Marble.
					IC.ika.getModel().currentResources[3],			// Crystal.
					IC.ika.getModel().currentResources[4]			// Sulfur.
				];
				
				var lb_showPositiveNumbers	= IC.Options.getOption('missingResources', 'showPositive') === true && ib_isUpdateView === true;
				var lb_showMissingColoured	= IC.Options.getOption('missingResources', 'showColoured');
				
				var ls_resourcesPattern	= '%resources%';
				if(ib_isUpdateView !== true)
					ls_resourcesPattern = ' (' + ls_resourcesPattern + ')';
				
				for(var i = 0; i < IC.Ikariam.resourceNames.length; i++) {
					var la_missingWrappers = IC.myGM.$$('.' + IC.myGM.prefix + 'missingResources' + IC.Ikariam.resourceNames[i]);
					
					if(!!la_missingWrappers) {
						for(var k = 0; k < la_missingWrappers.length; k++) {
							
							var le_neededWrapper	= la_missingWrappers[k].previousSibling;
							var li_missing			= la_currentResources[i] - IC.Ikariam.getInt(le_neededWrapper.nodeValue);
							
							if(li_missing < 0 || lb_showPositiveNumbers === true) {
								var ls_formattedMissingValue	= IC.Ikariam.formatToIkaNumber(li_missing, lb_showMissingColoured, true);
								la_missingWrappers[k].innerHTML	= ls_resourcesPattern.replace(/\%resources\%/, ls_formattedMissingValue);
							} else {
								la_missingWrappers[k].innerHTML = '';
							}
						}
					}
				}
			};
			
			/**
			 * Add the missing resources wrappers.
			 * 
			 * @param	{boolean}	ib_isUpdateView
			 *   If the wrappers are added to the update view.
			 */
			var _lf_addMissingWrappers = function(ib_isUpdateView) {
				var ls_wrapperSelector = '#buildingGround .resources';
				if(ib_isUpdateView === true)
					ls_wrapperSelector = '#sidebar .resources';
				
				var la_wrappers = IC.myGM.$$(ls_wrapperSelector);
				
				for(var i = 0; i < la_wrappers.length; i++) {
					for(var k = 0; k < IC.Ikariam.resourceNames.length; k++) {
						var le_resourceNode = IC.myGM.$('.' + IC.Ikariam.resourceNames[k], la_wrappers[i]);
						
						if(!!le_resourceNode) {
							IC.myGM.addElement('span', le_resourceNode, { 'classes': ['missingResources', 'missingResources' + IC.Ikariam.resourceNames[k]] }, true);
						}
					}
				}
				
				_lf_updateInformation(ib_isUpdateView);
			};
			
			/**
			 * Update the missing resources in building ground popup.
			 */
			var _lf_doUpdateInBuildingView = function() {
				if(!IC.myGM.$('#buildingGround_c')) {
					IC.Observer.remove('missingResourcesBuilding');
					return;
				}

				_lf_updateInformation(false);
			};
			
			/**
			 * Update the missing resources in update view.
			 */
			var _lf_doUpdateInUpdateView = function() {
				if(!IC.myGM.$('#buildingUpgrade')) {
					IC.Observer.remove('missingResourcesUpdate');
					return;
				}

				_lf_updateInformation(true);
			};
			
			/**
			 * Show the missing resources in building ground popup.
			 */
			var _lf_doShowInBuildingGround = function() {
				_lf_addMissingWrappers(false);
				
				IC.Observer.add('missingResourcesBuilding', IC.myGM.$('#cityResources'), { childList: true, subtree: true }, _lf_doUpdateInBuildingView, _lf_doUpdateInBuildingView);
			};
			
			/**
			 * Show the missing resources in update view.
			 */
			var _lf_doShowInUpdateView = function() {
				if(!IC.myGM.$('#buildingUpgrade') || IC.myGM.$$('.' + IC.myGM.prefix + 'missingResources').length > 0)
					return;
				
				_lf_addMissingWrappers(true);
				
				IC.Observer.add('missingResourcesUpgrade', IC.myGM.$('#cityResources'), { childList: true, subtree: true }, _lf_doUpdateInUpdateView, _lf_doUpdateInUpdateView);
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_showMissingResources
			 *   If the user selected the checkbox to show the missing resources info.
			 */
			this.updateSettings = function(ib_showMissingResources) {
				if(ib_showMissingResources === true) {
					IC.RefreshHandler.add('buildingGround', 'showMissingResources', _lf_doShowInBuildingGround);
					IC.RefreshHandler.add('%', 'showMissingResources', _lf_doShowInUpdateView);
					IC.myGM.addStyle(
						'#sidebar #buildingUpgrade ul.resources li			{ width: 120px; } \
						 #sidebar #buildingUpgrade ul.resources li.time		{ width: 60px !important; } \
						 #sidebar .' + IC.myGM.prefix + 'missingResources	{ float: right; }',
						'showMissingResources'
					);
					return;
				}
				
				IC.RefreshHandler.remove('buildingGround', 'showMissingResources');
				IC.RefreshHandler.remove('%', 'showMissingResources');
				IC.myGM.removeStyle('showMissingResources');
			};
		};
		
		IC.Options.addWrapper('missingResources', IC.Language.$('missingResources.options.wrapperTitle'));
		
		// Show missing resources in upgrade / building view.
		IC.Options.addCheckbox('show', 'missingResources', 1, true, IC.Language.$('missingResources.options.show'), { changeCallback: _go_showMissingResources.updateSettings });
		
		// Disable coloring of the missing resources.
		IC.Options.addCheckbox('showPositive', 'missingResources', 2, true, IC.Language.$('missingResources.options.showPositive'), {});
		// Show only missing ressources, not also remaining.
		IC.Options.addCheckbox('showColoured', 'missingResources', 2, true, IC.Language.$('missingResources.options.showColoured'), {});
	})();
	
	IC.con.logTimeStamp('IkariamEnhancedUI: missing resource functions created');
	
	// Functions for tooltips.
	(function() {
		/**
		 * Storage for the autoshow tootips functions.
		 * 
		 * @type	{object}
		 */
		var _go_autoshowTooltips = new function() {
			/**
			 * General function for autowhow.
			 * 
			 * @param	{string}	onclickWrapperClass
			 *   The class of the wrapper which has the onclik attribute set.
			 */
			var _lf_autoshowTooltipsGeneral = function(onclickWrapperClass) {
				IC.myGM.$$('.' + onclickWrapperClass).forEach(function(onclickWrapper) {
					var onclickFunction		= onclickWrapper.onclick;
					onclickWrapper.onclick	= 'return false;';
					
					var newHandler = IC.myGM.$('.magnify_icon', onclickWrapper);
					if(!newHandler)
						newHandler = onclickWrapper;
					
					newHandler.addEventListener('mouseover', function(e) { IC.ika.controller.captureMousePosition(e); onclickFunction(e); }, true);
				});
				
				IC.myGM.$('.templateView .mainContent').addEventListener('click', function() { IC.win.$(document).trigger("closeExclusiveInfo"); }, true);
			};
			
			/**
			 * Autmatically show tooltips in alliance member lists.
			 */
			var _lf_doAutoshowTooltipsAlliance = function() {
				_lf_autoshowTooltipsGeneral('cityInfo');
			};
			
			/**
			 * Autmatically show tooltips in military advisor.
			 */
			var _lf_doAutoshowTooltipsMilitaryAdvisor = function() {
				if(IC.Options.getOption('moduleOptions', 'showDirectMilitaryTooltips') === true)
					return;
				
				_lf_autoshowTooltipsGeneral('spyMilitary');
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	autoshowTooltips
			 *   If the user selected the checkbox to autoshow tooltips.
			 */
			this.updateSettings = function(autoshowTooltips) {
				var alliancePopupIds = ['diplomacyAllyMemberlist', 'embassy'];
				
				if(autoshowTooltips === true) {
					IC.RefreshHandler.add('militaryAdvisor', 'autoshowTooltips', _lf_doAutoshowTooltipsMilitaryAdvisor);
					IC.RefreshHandler.add(alliancePopupIds, 'autoshowTooltips', _lf_doAutoshowTooltipsAlliance);
					return;
				}
				
				IC.RefreshHandler.remove('militaryAdvisor', 'autoshowTooltips');
				IC.RefreshHandler.remove(alliancePopupIds, 'autoshowTooltips');
			};
		};
		
		/**
		 * Storage for the direct military tooltip functions.
		 * 
		 * @type	{object}
		 */
		var _go_directMilitaryTooltips = new function() {
			/**
			 * Storage for the class ids and their corresponding translations. Each class is a property of the object with the translation stored in it.
			 * 
			 * @type	{object}
			 */
			var _lo_idTranslation = {};
			
			/**
			 * Fill the id translation object.
			 */
			var _lf_fillIdTranslation = function() {
				if(_lo_idTranslation.length === 0)
					return;
				
				var la_troops		= ['swordsman', 'phalanx', 'archer', 'marksman', 'mortar', 'slinger', 'catapult', 'ram', 'steamgiant', 'bombardier', 'cook', 'medic', 'gyrocopter', 'spearman', 'spartan'];
				var la_ships		= ['balliasta', 'catapult', 'flamethrower', 'mortar', 'ram', 'steamboat', 'rocketship', 'submarine', 'paddlespeedship', 'balloncarrier', 'tender', 'transport', 'premium_transport'];
				var la_resources	= IC.Ikariam.resourceNames;
				la_resources.push('gold');
				
				la_troops.forEach(function(is_troopName) {
					_lo_idTranslation[is_troopName] = IC.Language.$('diverse.name.unit.' + is_troopName);
				});
				
				la_ships.forEach(function(is_shipName) {
					_lo_idTranslation['ship_' + is_shipName] = IC.Language.$('diverse.name.ship.' + is_shipName.replace('premium_', ''));
				});
				
				la_resources.forEach(function(is_resourceName) {
					_lo_idTranslation[is_resourceName] = IC.Language.$('diverse.name.resource.' + is_resourceName);
				});
			};
			
			/**
			 * Hide the number of ships for the own peaceful missions (trade / transport).
			 */
			var _lf_hideShipNumberOwnPeacefulMissions = function() {
				var la_ownEventTableRows = IC.myGM.$$('#js_MilitaryMovementsFleetMovementsTable .military_event_table tr.own');
				
				la_ownEventTableRows.forEach(function(ie_tableRow) {
					var le_missionDiv		= IC.myGM.$('td:nth-child(1) div.mission_icon', ie_tableRow);
					var lb_peacefulMission	= le_missionDiv.classList.contains('transport') || le_missionDiv.classList.contains('trade');
					
					if(lb_peacefulMission === true) {
						IC.myGM.$('td:nth-child(4) div', ie_tableRow).classList.add('invisible');
					}
				});
			};
			
			/**
			 * Show the military tooltips directly.
			 */
			var _lf_doShowDirectMilitaryTooltips = function() {
				_lf_fillIdTranslation();
				
				_lf_hideShipNumberOwnPeacefulMissions();
				
				IC.myGM.$$('.spyMilitary').forEach(function(ie_movementWrapper) {
					ie_movementWrapper.onclick = 'return false;';
				});
				
				var le_movementsTable = IC.myGM.$('#js_MilitaryMovementsFleetMovementsTable');
				
				IC.myGM.forEach(_lo_idTranslation, function(is_classId, is_translation) {
					IC.myGM.$$('.icon40.' + is_classId, le_movementsTable).forEach(function(ie_detailIcon) {
						ie_detailIcon.title = is_translation;
					});
				});
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_showDirectMilitaryTooltips
			 *   If the user selected the checkbox to show the military tooltips directly.
			 */
			this.updateSettings = function(ib_showDirectMilitaryTooltips) {
				if(ib_showDirectMilitaryTooltips === true) {
					IC.RefreshHandler.add('militaryAdvisor', 'showDirectMilitaryTooltips', _lf_doShowDirectMilitaryTooltips);
					IC.myGM.addStyle(
						'#js_MilitaryMovementsFleetMovementsTable .military_event_table .magnify_icon				{ background-image: none; cursor: default; width: 240px; } \
						 #js_MilitaryMovementsFleetMovementsTable .military_event_table .magnify_icon .infoTip		{ display: inline; position: relative; padding: 0px; border: none; top: 0px; } \
						 #js_MilitaryMovementsFleetMovementsTable .military_event_table .magnify_icon .infoTip h5	{ display: none; } \
						 #js_MilitaryMovementsFleetMovementsTable .military_event_table .icon40						{ background-size: 25px 25px; background-color: transparent; padding: 26px 3px 0px 3px; width: 30px; } \
						 #js_MilitaryMovementsFleetMovementsTable .military_event_table .icon40.resource_icon		{ background-size: 20px 16px; }',
						'showDirectMilitaryTooltips'
					);
					return;
				}
				
				IC.RefreshHandler.remove('militaryAdvisor', 'showDirectMilitaryTooltips');
				IC.myGM.removeStyle('showDirectMilitaryTooltips');
			};
		};
		
		// Show alliance / military tooltips directly.
		IC.Options.addCheckbox('autoshowTooltips', 'diverseOptions', 1, true, IC.Language.$('tooltips.options.autoshow'), { changeCallback: _go_autoshowTooltips.updateSettings });
		// Show military tooltips directly.
		IC.Options.addCheckbox('showDirectMilitaryTooltips', 'diverseOptions', 1, false, IC.Language.$('tooltips.options.showDirectInMilitaryAdvisor'), { changeCallback: _go_directMilitaryTooltips.updateSettings });
		// Add a divider line.
		IC.Options.addLine('diverseOptions', 1);
	})();
	
	IC.con.logTimeStamp('IkariamEnhancedUI: tooltip functions created');
	
	// Zoom function.
	(function() {
		/**
		 * Storage for the zoom functions.
		 * 
		 * @type	{object}
		 */
		var _go_zoomView = new function() {
			/**
			 * Storage for the minimum zoom factor.
			 * 
			 * @type	{int}
			 */
			var _li_minZoom	= 55;
			
			/**
			 * Storage for the maximum zoom factor.
			 * 
			 * @type	{int}
			 */
			var _li_maxZoom	= 150;
			
			/**
			 * Storage for the zoom step size.
			 * 
			 * @type	{int}
			 */
			var _li_zoomStep	= 5;
			
			/**
			 * Storage for the actual mousewheel callback.
			 * 
			 * @type	{function}
			 */
			var _lf_mousewheelCallbackStorage = IC.ika.getController().mouseScrollHandle;
			
			/**
			 * Getter for the minimum zoom factor.
			 * 
			 * @return	{int}
			 *   The minimum zoom factor.
			 */
			this.__defineGetter__('minZoom', function() { return _li_minZoom; });
			
			/**
			 * Getter for the maximum zoom factor.
			 * 
			 * @return	{int}
			 *   The maximum zoom factor.
			 */
			this.__defineGetter__('maxZoom', function() { return _li_maxZoom; });
			
			/**
			 * Getter for the zoom step size.
			 * 
			 * @return	{int}
			 *   The zoom step size.
			 */
			this.__defineGetter__('zoomStep', function() { return _li_zoomStep; });
			
			/**
			 * Initialize the zoom bounds (min and max zoom).
			 */
			var _lf_initBounds = function() {
				var li_minZoom = Math.round(IC.ika.worldview_scale_min * 100);
				if(li_minZoom % 5 != 0)
					li_minZoom = li_minZoom + (5 - (li_minZoom % 5));

				_li_minZoom = li_minZoom;
				
				IC.ika.worldview_scale_min = _li_minZoom / 100;
				IC.ika.worldview_scale_max = _li_maxZoom / 100;
			};
			
			/**
			 * Zoom the world view, as there is no function provided by Ikariam.
			 * 
			 * @param	{decimal}	in_zoomFactor
			 *   The zoom factor as decimal number (1 =^= 100%)
			 */
			var _lf_zoomWorldView = function(in_zoomFactor) {
				var li_translateXY		= (100 - 100 / in_zoomFactor) / 2;
				var ls_heightWidth		= (100 / in_zoomFactor) + '% !important';
				var ls_transformString	= 'scale(' + in_zoomFactor + ') translate(' + li_translateXY + '%, ' + li_translateXY + '%)';
				
				IC.myGM.addStyle(
					'#scrollcover	{ transform: ' + ls_transformString + '; -webkit-transform: ' + ls_transformString + '; height: ' + ls_heightWidth + '; width: ' + ls_heightWidth + '; }',
					'zoomWorld', true
				);
		
				var le_map = IC.myGM.$('#map1');
				
				le_map.style.top	= '0px';
				le_map.style.left	= '0px';
			};
			
			/**
			 * Rescale the badges and symbols.
			 * 
			 * @param	{decimal}	in_zoomFactorNumber
			 *   The zoom factor as decimal number (1 =^= 100%)
			 */
			var _lf_scaleChildren = function(in_zoomFactorNumber) {
				var ls_transformString	= 'transform: scale(' + 1 / in_zoomFactorNumber + ');  -webkit-transform: scale(' + 1 / in_zoomFactorNumber + ');';
				var ls_style			= '';
				
				if(IC.Ikariam.view == 'world') {
					var ls_ownerState = '';
					
					if(in_zoomFactorNumber < 1)
						ls_ownerState = ', .ownerState';
					
					ls_style =	'.islandTile .wonder, .islandTile .tradegood, .islandTile .cities, .islandTile .piracyInRange' + ls_ownerState + '	{ ' + ls_transformString + ' } \
						 		 .islandTile .cities																	{ bottom: 10px !important; }';
				}
				
				if(IC.Ikariam.view == 'island') {
					var ls_movePiracy = 'transform: translate(0px, -' + (1 - in_zoomFactorNumber) * 20 + 'px) scale(' + 1 / in_zoomFactorNumber + ');';
					ls_style =	'.cityLocation .scroll_img, .cityLocationScroll .scroll_img	{ ' + ls_transformString + ' } \
								 .cityLocation .piracyRaid									{ ' + ls_movePiracy + ' }';
				}
				
				if(IC.Ikariam.view == 'town')
					ls_style = '.timetofinish	{ ' + ls_transformString + ' }';
				
				IC.myGM.addStyle(ls_style, 'scaleChildren', true);
			};
			
			/**
			 * Update the zoom in and zoom out button and the percentage in the middle.
			 * 
			 * @param	{int}	ii_zoomFactor
			 *   The zoom factor as percentage.
			 */
			var _lf_updateZoomButtons = function(ii_zoomFactor) {
				var le_zoomFactorDiv	= IC.myGM.$('#' + IC.myGM.prefix + 'zoomFactor');
				var le_zoomIn			= IC.myGM.$('#' + IC.myGM.prefix + 'zoomIn');
				var le_zoomOut			= IC.myGM.$('#' + IC.myGM.prefix + 'zoomOut');
		
				if(!!le_zoomFactorDiv) {
					le_zoomFactorDiv.innerHTML = ii_zoomFactor + '%';
				}
				
				if(!!le_zoomIn) {
					le_zoomIn.style.visibility = '';
					
					if(ii_zoomFactor >= _li_maxZoom)
						le_zoomIn.style.visibility = 'hidden';
				}
				
				if(!!le_zoomOut) {
					le_zoomOut.style.visibility = '';
					
					if(ii_zoomFactor <= _li_minZoom)
						le_zoomOut.style.visibility = 'hidden';
				}
			};
			
			/**
			 * Calculate the zoom factor as decimal number and execute the zoom function. If it is requestet, call also the rescale function for child elements.
			 * 
			 * @param	{int}	ii_zoomFactor
			 *   The zoom factor as percentage.
			 */
			var _lf_zoomView = function(ii_zoomFactor) {
				var ln_zoomFactorNumber = ii_zoomFactor / 100.0;
	
				var li_scale = 0;
				
				if(IC.Ikariam.view == 'island')
					li_scale = IC.ika.worldview_scale_island;
					
				if(IC.Ikariam.view == 'town')
					li_scale = IC.ika.worldview_scale_city;
				
				if(IC.Ikariam.view == 'world') {
					_lf_zoomWorldView(ln_zoomFactorNumber);
				} else {
					var li_stepNumber = Math.round((ln_zoomFactorNumber - li_scale) / .05);
		
					var le_worldview	= IC.myGM.$('#worldview');
					var li_posX			= le_worldview.offsetLeft + le_worldview.offsetWidth / 2;
					var li_posY			= le_worldview.offsetTop + le_worldview.offsetHeight / 2;
					
					IC.ika.controller.scaleWorldMap(li_stepNumber, li_posX, li_posY);
				}
				
				if(IC.Options.getOption('zoom', IC.Ikariam.view + 'ScaleChildren') === true)
					_lf_scaleChildren(ln_zoomFactorNumber);
			};
			
			/**
			 * Ensure that the requested zoom factor is in the bounds and update the view.
			 * 
			 * @param	{int}	ii_zoomFactor
			 *   The zoom factor as percentage.
			 */
			var _lf_zoom = function(ii_zoomFactor) {
				if(ii_zoomFactor > _li_maxZoom)
					ii_zoomFactor = _li_maxZoom;
				
				if(ii_zoomFactor < _li_minZoom)
					ii_zoomFactor = _li_minZoom;
				
				IC.Options.setOption('zoom', IC.Ikariam.view + 'Factor', ii_zoomFactor);
				
				_lf_updateZoomButtons(ii_zoomFactor);
				_lf_zoomView(ii_zoomFactor);
			};
			
			/**
			 * Zoom one step in.
			 */
			var _lf_zoomIn = function() {
				var li_factor = IC.Ikariam.getInt(IC.Options.getOption('zoom', IC.Ikariam.view + 'Factor', 100)) + _li_zoomStep;
	
				_lf_zoom(li_factor);
			};
			
			/**
			 * Zoom one step out.
			 */
			var _lf_zoomOut = function() {
				var li_factor = IC.Options.getOption('zoom', IC.Ikariam.view + 'Factor', 100) - _li_zoomStep;
	
				_lf_zoom(li_factor);
			};
			
			/**
			 * Add the zoom buttons.
			 */
			var _lf_addZoomButtons = function() {
				var le_zoomWrapper	= IC.myGM.addElement('div', ge_toolbar, { 'id': 'zoomWrapper' });
				IC.myGM.addElement('div', le_zoomWrapper, {
					'id':		'zoomIn',
					'class':	'maximizeImg',
					'title':	IC.Language.$('zoom.zoomIn'),
					'click':	_lf_zoomIn
				});
				IC.myGM.addElement('div', le_zoomWrapper, {
					'id':		'zoomFactor',
					'title':	IC.Language.$('zoom.factor')
				});
				IC.myGM.addElement('div', le_zoomWrapper, {
					'id':		'zoomOut',
					'class':	'minimizeImg',
					'title':	IC.Language.$('zoom.zoomOut'),
					'click':	_lf_zoomOut
				});
				
				IC.myGM.addStyle(
					'#' + IC.myGM.prefix + 'zoomWrapper			{ width: 72px; margin: 0px -5px !important; transform: scale(0.75); scale(0.75); -webkit-transform: scale(0.75); } \
					 #' + IC.myGM.prefix + 'zoomWrapper > div	{ display: inline-block; position: relative; } \
					 #' + IC.myGM.prefix + 'zoomFactor			{ top: -4px; width: 35px; text-align: center; }',
					'zoomButtons'
				);
			};
			
			/**
			 * Set the zoom to 100% if in world view or if it was bigger than 100% and remove the zoom buttons and all styles for the zoom.
			 */
			var _lf_resetZoom = function() {
				if((IC.Ikariam.view == 'island' && IC.ika.worldview_scale_island > 1) || (IC.Ikariam.view == 'town' && IC.ika.worldview_scale_city > 1) || IC.Ikariam.view == 'world')
					_lf_zoomView(100);
					
				IC.ika.worldview_scale_max = 1;
				
				IC.myGM.removeElement(IC.myGM.$('#' + IC.myGM.prefix + 'zoomWrapper'));
				
				IC.myGM.removeStyle('zoomButtons');
				IC.myGM.removeStyle('zoomWorld');
				IC.myGM.removeStyle('scaleChildren');
			};
			
			/**
			 * Check, if the key are pressed which are required to zoom with the mouse.
			 * 
			 * @param	{object}	io_event
			 *   The "event object" with information about the mouse scroll and pressed keys.
			 * 
			 * @return	{boolean}
			 *   If the correct keys were pressed.
			 */
			var _lf_keysOK = function(io_event) {
				var lb_ctrlOK = !!io_event.ctrlKey;
				if(IC.Options.getOption('zoom', 'ctrlAsAccessKey') === false)
					lb_ctrlOK = true;
				
				var lb_altOK = !!io_event.altKey;
				if(IC.Options.getOption('zoom', 'altAsAccessKey') === false)
					lb_altOK = true;
				
				var lb_shiftOK = !!io_event.shiftKey;
				if(IC.Options.getOption('zoom', 'shiftAsAccessKey') === false)
					lb_shiftOK = true;
				
				return lb_ctrlOK && lb_altOK && lb_shiftOK;
			};
			
			/**
			 * Calculate the delta the mousewheel was turned.
			 * 
			 * @param	{object}	io_event
			 *   The "event object" with information about the mouse scroll and pressed keys.
			 * 
			 * @return	{int}
			 *   The delta the mousewheel was moved.
			 */
			var _lf_calculateDelta = function(io_event) {
				var ri_stepNumber = 0;

				// Get the number of steps to scroll.
				if(io_event.wheelDelta)
					ri_stepNumber = io_event.wheelDelta / 120;

				if (io_event.detail)
					ri_stepNumber = -io_event.detail / 3;

				if (io_event.wheelDeltaY !== undefined)
					ri_stepNumber = io_event.wheelDeltaY / 120;
				
				// If the number is between -1 and 0, set it to -1.
				if(ri_stepNumber < 0)
					ri_stepNumber = ri_stepNumber > -1 ? -1 : Math.round(ri_stepNumber);

				// If the number is between 0 and 1, set it to 1.
				else
					ri_stepNumber = ri_stepNumber < 1 ? 1 : Math.round(ri_stepNumber);
					
				return ri_stepNumber;
			};
			
			/**
			 * Handler for mousescroll to zoom.
			 * 
			 * @param	{object}	io_event
			 *   The "event object" with information about the mouse scroll and pressed keys.
			 * 
			 * @return	false
			 *   If the prevent default method is not available to prevent the default action.
			 */
			var _lf_mouseScroll = function(io_event) {
				if(_lf_keysOK(io_event) === true) {
					// If the scrolling is horizontally return.
					if(io_event.axis !== undefined && io_event.axis === io_event.HORIZONTAL_AXIS)
						return;
					
					var li_factor = IC.Ikariam.getInt(IC.Options.getOption('zoom', IC.Ikariam.view + 'Factor')) + _li_zoomStep * _lf_calculateDelta(io_event);
					
					_lf_zoom(li_factor);
					
					// Prevent the default event.
					if(io_event.preventDefault)
						io_event.preventDefault();
					else
						return false;
				}
			};
		
			/**
			 * Change the mousewheel listener to a new callback.
			 * 
			 * @param	{function}	if_newCallback
			 *   The new callback for the mousewheel listener.
			 */
			var _lf_changeMouseWheelListener = function(if_newCallback) {
				if(_lf_mousewheelCallbackStorage == if_newCallback)
					return;
				
				var ls_scrollDivId = '#worldmap';
				
				if(IC.Ikariam.view == 'world')
					ls_scrollDivId	= '#map1';
				
				if(_lf_mousewheelCallbackStorage == IC.ika.getController().mouseScrollHandle) {
					// Remove the ikariam mouse wheel listener and add the own. (with the use of Ikariam-jQuery)
					IC.win.$(ls_scrollDivId).unbind('mousewheel');
					
					var scrollDiv = IC.myGM.$(ls_scrollDivId);
					scrollDiv.addEventListener('DOMMouseScroll', if_newCallback, false);
					scrollDiv.addEventListener('mousewheel', if_newCallback, false);
				} else {
					var scrollDiv = IC.myGM.$(ls_scrollDivId);
					scrollDiv.removeEventListener('DOMMouseScroll', _lf_mousewheelCallbackStorage, false);
					scrollDiv.removeEventListener('mousewheel', _lf_mousewheelCallbackStorage, false);
					
					IC.win.$(ls_scrollDivId).on('mousewheel', if_newCallback);
				}
				
				_lf_mousewheelCallbackStorage = if_newCallback;
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_zoomView
			 *   If the user selected the checkbox to zoom.
			 */
			this.updateSettings = function(ib_zoomView) {
				_lf_initBounds();
				_go_zoomOptions.renewFactorSelects();
				
				if(ib_zoomView === true) {
					_lf_addZoomButtons();
					_lf_changeMouseWheelListener(_lf_mouseScroll);
					_lf_zoom(IC.Options.getOption('zoom', IC.Ikariam.view + 'Factor'));
					return;
				}
				
				_lf_resetZoom();
				_lf_changeMouseWheelListener(IC.ika.getController().mouseScrollHandle);
			};
		};
		
		/**
		 * Storage for the option creation functions.
		 * 
		 * @type	{object}
		 */
		var _go_zoomOptions = new function() {
			/**
			 * If the zoom wrapper is already created.
			 */
			var _lb_zoomWrapperCreated	= false;
			
			/**
			 * Add the select fields for the zoom factors.
			 */
			var _lf_addFactorSelects = function(ib_replace) {
				var la_options = [];
				
				for(var i = _go_zoomView.minZoom; i <= _go_zoomView.maxZoom; i = i + _go_zoomView.zoomStep) {
					la_options.push({ value: i, label: i + '%' });
				}
				
				IC.Ikariam.viewNames.forEach(function(is_view, ii_index) {
					IC.Options.addSelect(is_view + 'Factor', 'zoom', 'factors', 100, IC.Language.$('zoom.options.factor.' + is_view), la_options, { replace: !!ib_replace });
				});
			};
			
			/**
			 * Add the checkboxes fields for rescaling the badges and icons.
			 */
			var _lf_addScaleChildrenCheckboxes = function() {
				IC.Options.addHTML('scaleChildrenDescription', 'zoom', 'scale', { html: '<p>' + IC.Language.$('zoom.options.scaleChildren.label') + '</p>' });
				
				IC.Ikariam.viewNames.forEach(function(is_view) {
					IC.Options.addCheckbox(is_view + 'ScaleChildren', 'zoom', 'scale', true, IC.Language.$('zoom.options.scaleChildren.' + is_view), {});
				});
			};
			
			/**
			 * Add the checkboxes for the access keys.
			 */
			var _lf_addAccessKeyCheckboxes = function() {
				IC.Options.addHTML('accessKeyDescription', 'zoom', 'accessKeys', { html: '<p>' + IC.Language.$('zoom.options.accessKeyLabel') + '</p>' });
				
				var la_accessKeys = ['ctrl', 'alt', 'shift'];
				la_accessKeys.forEach(function(is_accessKey) {
					var lb_defaultEnabled = (is_accessKey == 'ctrl');
					IC.Options.addCheckbox(is_accessKey + 'AsAccessKey', 'zoom', 'accessKeys', lb_defaultEnabled, IC.Language.$('general.' + is_accessKey), {});
				});
			};
			
			/**
			 * Create the zoom options wrapper and add the option elements.
			 */
			this.create = function() {
				_lf_addFactorSelects();
				_lf_addScaleChildrenCheckboxes();
				_lf_addAccessKeyCheckboxes();
				
				_lb_zoomWrapperCreated = true;
			};
			
			/**
			 * Recreate the select fields for the zoom factor (and keep the old zoom factor).
			 */
			this.renewFactorSelects = function() {
				if(_lb_zoomWrapperCreated === false)
					return;
				
				_lf_addFactorSelects(true);
			};
		};
		
		IC.Options.addWrapper('zoom', IC.Language.$('zoom.options.wrapperTitle'));
		
		// Show missing resources in upgrade / building view.
		IC.Options.addCheckbox('view', 'zoom', 'general', true, IC.Language.$('zoom.options.zoomView'), { changeCallback: _go_zoomView.updateSettings });
		
		// Add the zoom function settings.
		_go_zoomOptions.create();
	})();
	
	IC.con.logTimeStamp('IkariamEnhancedUI: zoom functions created');
	
	// Ressource information.
	(function() {
		/**
		 * Storage for the style functions for the capacity bar and the direct income.
		 * 
		 * @type	{object}
		 */
		var _go_styleFunctions = new function() {
			/**
			 * Get the style for the #js_GlobalMenu_ elements.
			 * 
			 * @param	{string}	is_incomeStyle
			 *   How the income is styled.
			 * 
			 * @return	{string}
			 *   The style string.
			 */
			var _lf_getGlobalMenuStyle = function(is_incomeStyle) {
				if(is_incomeStyle != 'alignLeft')
					return '#js_GlobalMenu_wood, #js_GlobalMenu_wine, #js_GlobalMenu_marble, #js_GlobalMenu_crystal, #js_GlobalMenu_sulfur { padding-right: 4px; } ';
				
				return '';
			};
			
			/**
			 * Gets the style for the separation of the resource values.
			 * 
			 * @param	{string}	is_incomeStyle
			 *   How the income is styled.
			 * 
			 * @return	{string}
			 *   The style string.
			 */
			var _lf_getSeparationStyle = function(is_incomeStyle) {
				if(is_incomeStyle == 'withSeparation')
					return '#resources_wood, #resources_wine, #resources_marble, #resources_glass { border-right: 1px dotted #542C0F; } ';
				
				return '';
			};
			
			/**
			 * Get styles which are independent of the activation of the cpacity bar or direct income.
			 * 
			 * @param	{string}	is_incomeStyle
			 *   How the income is styled.
			 * 
			 * @return	{string}
			 *   The style string.
			 */
			var _lf_getGeneralStyles = function(is_incomeStyle) {
				var ls_globalMenuStyle = _lf_getGlobalMenuStyle(is_incomeStyle);
				var ls_separationStyle	= _lf_getSeparationStyle(is_incomeStyle);
				
				return ls_globalMenuStyle + ls_separationStyle;
			};
			
			/**
			 * Get the style for the capacity bar "wrapper".
			 * 
			 * @param	{string}	is_capacityBarOrientation
			 *   The orientation of the capacity bar.
			 * @param	{string}	is_incomeStyle
			 *   How the income is styled.
			 * 
			 * @return	{string}
			 *   The style string.
			 */
			var _lf_getCapacityBarStyle = function(is_capacityBarOrientation, is_incomeStyle) {
				var ls_height		= 'height: 4px; ';
				var ls_width		= 'width: 79px;';
				var ls_right		= 'right: 4px; ';
				var ls_marginLeft	= '';
				
				if(is_capacityBarOrientation == 'horizontal')
					ls_width = 'width: 50px; ';
				
				if(is_capacityBarOrientation == 'vertical') {
					ls_height	= 'height: 21px; ';
					ls_width	= 'width: 4px; ';
					ls_right	= '';
					
					if(is_incomeStyle == 'alignLeft')
						ls_marginLeft = 'margin-left: -7px; ';
				}
				
				return '.' + IC.myGM.prefix + 'capacityInformation { position: absolute; bottom: 4px; ' + ls_height + ls_width + ls_right + ls_marginLeft + '} ';
			};
			
			/**
			 * Get the style for the capacity bar with a border.
			 * 
			 * @param	{string}	is_capacityBarOrientation
			 *   The orientation of the capacity bar.
			 * 
			 * @return	{string}
			 *   The style string.
			 */
			var _lf_getCapacityBarWithBorderStyle = function(is_capacityBarOrientation) {
				var ls_height	= 'height: 3px; ';
				var ls_width	= 'width: 78px; ';
				var ls_right	= 'right: 3px; ';
				
				if(is_capacityBarOrientation == 'horizontal')
					ls_width	= 'width: 50px; ';
				
				if(is_capacityBarOrientation == 'vertical') {
					ls_height	= 'height: 20px; ';
					ls_width	= 'width: 3px; ';
					ls_right	= '';
				}
				
				return '.' + IC.myGM.prefix + 'capacityInformation.' + IC.myGM.prefix + 'border { border: 1px inset #906646; bottom: 3px; ' + ls_height + ls_width + ls_right + '} ';
			};
			
			/**
			 * Get the style for the capacity bar.
			 * 
			 * @param	{string}	is_capacityBarOrientation
			 *   The orientation of the capacity bar.
			 * @param	{string}	is_incomeStyle
			 *   How the income is styled.
			 * 
			 * @return	{string}
			 *   The style string.
			 */
			var _lf_getCapacityStyle = function(is_capacityBarOrientation, is_incomeStyle) {
				var ls_prefix = IC.myGM.prefix;
				
				var ls_barStyle =	'.' + ls_prefix + 'bar							{ height: 100%; width: 100%; bottom: 0px; position: absolute; } \
									 .' + ls_prefix + 'bar.' + ls_prefix + 'red		{ background-color: #AA0000; } \
									 .' + ls_prefix + 'bar.' + ls_prefix + 'yellow	{ background-color: #FFD700; } \
									 .' + ls_prefix + 'bar.' + ls_prefix + 'green	{ background-color: #669900; }';
				
				var ls_capacityStyle		= _lf_getCapacityBarStyle(is_capacityBarOrientation, is_incomeStyle);
				var ls_capacityBorderStyle	= _lf_getCapacityBarWithBorderStyle(is_capacityBarOrientation);
				
				return ls_barStyle + ls_capacityStyle + ls_capacityBorderStyle;
			};
			
			/**
			 * Get the style for the direct hourly income in the town view.
			 * 
			 * @param	{boolean}	ib_capacityBarActive
			 *   If the capacity bar is shown.
			 * @param	{string}	is_capacityBarOrientation
			 *   The orientation of the capacity bar.
			 * @param	{string}	is_incomeStyle
			 *   How the income is styled.
			 *   
			 * @return	{string}
			 *   The style string.
			 */
			var _lf_getHourlyIncomeStyle = function(ib_capacityBarActive, is_capacityBarOrientation, is_incomeStyle) {
				var ls_display		= 'display: block; ';
				var ls_fontSize		= 'font-size: 11px; ';
				var ls_paddingRight	= 'padding-right: 4px; ';
				
				if(ib_capacityBarActive === true && is_capacityBarOrientation !== 'horizontalFull')
					ls_fontSize = 'font-size: 9px; ';
				
				if(is_incomeStyle == 'alignLeft')
					ls_paddingRight = '';
				
				return '.' + IC.myGM.prefix + 'hourlyIncomeResource { ' + ls_display + ls_fontSize + ls_paddingRight + '} ';
			};
			
			/**
			 * Get some resource styles which are only set if the capacity bar is active.
			 * 
			 * @param	{boolean}	ib_directIncomeActive
			 *   If the direct income is shown.
			 * @param	{string}	is_capacityBarOrientation
			 *   The orientation of the capacity bar.
			 * @param	{string}	is_incomeStyle
			 *   How the income is styled.
			 * 
			 * @return	{string}
			 *   The style string.
			 */
			var _lf_getResourceStyleCapacityActive = function(ib_directIncomeActive, is_capacityBarOrientation, is_incomeStyle) {
				var ls_height		= '';
				var ls_top			= '';
				var ls_paddingLeft	= '';
				var ls_fontSize		= '';
				
				if(is_capacityBarOrientation == 'horizontalFull') {
					ls_height	= 'height: 32px !important; ';
					ls_top		= 'top: -2px !important; ';
				}
				
				if(is_capacityBarOrientation == 'vertical' && is_incomeStyle == 'alignLeft')
					ls_paddingLeft = 'padding-left: 38px !important; ';
				
				if(is_capacityBarOrientation == 'vertical' || (ib_directIncomeActive === true && is_capacityBarOrientation != 'horizontalFull'))
					ls_fontSize = 'font-size: 11px; ';
				
				return ls_height + ls_top + ls_paddingLeft + ls_fontSize;
			};
			
			/**
			 * Get the line height for the sored resources.
			 * 
			 * @param	{boolean}	ib_capacityBarActive
			 *   If the capacity bar is shown.
			 * @param	{boolean}	ib_directIncomeActive
			 *   If the direct income is shown.
			 * @param	{string}	is_capacityBarOrientation
			 *   The orientation of the capacity bar.
			 *   
			 * @return	{string}
			 *   The style string.
			 */
			var _lf_getResourceStyleLineHeigth = function(ib_capacityBarActive, ib_directIncomeActive, is_capacityBarOrientation) {
				if(ib_directIncomeActive === true) {
					if(ib_capacityBarActive === true && is_capacityBarOrientation == 'horizontal')
						return 'line-height: 9px !important; ';
					
					return 'line-height: 11px !important; ';
				}
				
				if(is_capacityBarOrientation == 'horizontal')
					return 'line-height: 12px !important; ';
				
				if(is_capacityBarOrientation == 'vertical')
					return 'line-height: 24px !important; ';
				
				return '';
			};
			
			/**
			 * Get the style for the resource fields.
			 * 
			 * @param	{boolean}	ib_capacityBarActive
			 *   If the capacity bar is shown.
			 * @param	{boolean}	ib_directIncomeActive
			 *   If the direct income is shown.
			 * @param	{string}	is_capacityBarOrientation
			 *   The orientation of the capacity bar.
			 * @param	{string}	is_incomeStyle
			 *   How the income is styled.
			 *   
			 * @return	{string}
			 *   The style string.
			 */
			var _lf_getResourceStyle = function(ib_capacityBarActive, ib_directIncomeActive, is_capacityBarOrientation, is_incomeStyle) {
				var ls_align			= 'text-align: right; ';
				var ls_capacityActive	= '';
				var ls_lineHeight		= _lf_getResourceStyleLineHeigth(ib_capacityBarActive, ib_directIncomeActive, is_capacityBarOrientation);
				
				if(is_incomeStyle == 'alignLeft')
					ls_align = '';
				
				if(ib_capacityBarActive === true)
					ls_capacityActive = _lf_getResourceStyleCapacityActive(ib_directIncomeActive, is_capacityBarOrientation, is_incomeStyle);
				
				return '#resources_wood, #resources_wine, #resources_marble, #resources_glass, #resources_sulfur { ' + ls_align + ls_lineHeight + ls_capacityActive + ' } ';
			};
			
			/**
			 * Set the styles for the direct income and the capacity bar.
			 */
			this.setStyles = function() {
				var lb_capacityBarActive = IC.Options.getOption('resourceInformation', 'showCapacityBar');
				var lb_directIncomeActive = IC.Options.getOption('resourceInformation', 'showDirectIncome');
				
				// If not both of the checkboxes have been defined yet, do nothing!
				if(lb_capacityBarActive === null || lb_directIncomeActive === null)
					return;
				
				if(lb_capacityBarActive === false && lb_directIncomeActive === false) {
					IC.myGM.removeStyle('resourceInformation');
					return;
				}
				
				var ls_capacityBarOrientation	= IC.Options.getOption('resourceInformation', 'capacityBarOrientation');
				var ls_incomeStyle				= IC.Options.getOption('resourceInformation', 'incomeStyle');
				
				var ls_incomeStyleString = _lf_getGeneralStyles(ls_incomeStyle)
												+ _lf_getResourceStyle(lb_capacityBarActive, lb_directIncomeActive, ls_capacityBarOrientation, ls_incomeStyle);
				
				if(lb_capacityBarActive === true)
					ls_incomeStyleString += _lf_getCapacityStyle(ls_capacityBarOrientation, ls_incomeStyle);
				
				if(lb_directIncomeActive === true)
					ls_incomeStyleString += _lf_getHourlyIncomeStyle(lb_capacityBarActive, ls_capacityBarOrientation, ls_incomeStyle);
				
				IC.myGM.addStyle(ls_incomeStyleString, 'resourceInformation', true);
			};
		};
		
		/**
		 * Storage for the functions for the capacity bar.
		 * 
		 * @type	{object}
		 */
		var _go_capacityInformation = new function() {
			/**
			 * Update the capacity information bars.
			 */
			var _lf_updateFields = function() {
				if(IC.ika.model.isOwnCity === false)
					return;
				
				var la_capacityInformation = [];
				var la_resourceIdentifiers = ['resource', 1, 2, 3, 4];
				
				la_resourceIdentifiers.forEach(function(im_identifier, ii_index) {
					la_capacityInformation.push({
						warehouse:		IC.Ikariam.getInt(IC.ika.getModel().maxResources[im_identifier]),
						branchOffice:	IC.Ikariam.getInt(IC.ika.getModel().branchOfficeResources[im_identifier]),
						current:		IC.Ikariam.getInt(IC.ika.getModel().currentResources[im_identifier])
					});
				});
				
				var ls_prefix			= '#' + IC.myGM.prefix;
				var ls_styleToChange	= 'width';
				if(IC.Options.getOption('resourceInformation', 'capacityBarOrientation') == 'vertical')
					ls_styleToChange = 'height';
				
				la_capacityInformation.forEach(function(io_capacity, ii_index) {
					var ls_resource = IC.Ikariam.resourceNames[ii_index];
					
					var li_warehousePercentage	= 100;
					var li_resourcePercentage	= io_capacity.current / io_capacity.warehouse * 100;
					
					if(IC.Options.getOption('resourceInformation', 'capacityBarShowBranchOfficeResources') === true) {
						var li_maximumCapacity	= io_capacity.warehouse + io_capacity.branchOffice;
						li_warehousePercentage	= io_capacity.warehouse / li_maximumCapacity * 100;
						li_resourcePercentage	= io_capacity.current / li_maximumCapacity * 100;
					}
					
					IC.myGM.$(ls_prefix + 'maxCapacity' + ls_resource).style[ls_styleToChange]			= '100%';
					IC.myGM.$(ls_prefix + 'warehouseCapacity' + ls_resource).style[ls_styleToChange]	= li_warehousePercentage + '%';
					IC.myGM.$(ls_prefix + 'currentResource' + ls_resource).style[ls_styleToChange]		= li_resourcePercentage + '%';
				});
			};
			
			/**
			 * Add the capacity information bars.
			 */
			var _lf_addFields = function() {
				var la_classes	= ['capacityInformation'];
				if(IC.Options.getOption('resourceInformation', 'capacityBarHasBorder') === true)
					la_classes.push('border');
				
				IC.Ikariam.resourceNames.forEach(function(is_resource) {
					var le_wrapper = IC.myGM.addElement('div', IC.myGM.$('#resources_' + is_resource), { 'id': 'capacityInfo' + is_resource, 'classes': la_classes }, true);
					IC.myGM.addElement('div', le_wrapper, { 'id': 'maxCapacity' + is_resource, 'classes': ['bar', 'yellow'] }, true);
					IC.myGM.addElement('div', le_wrapper, { 'id': 'warehouseCapacity' + is_resource, 'classes': ['bar', 'green'] }, true);
					IC.myGM.addElement('div', le_wrapper, { 'id': 'currentResource' + is_resource, 'classes': ['bar', 'red'] }, true);
				});
				
				_lf_updateFields();
			};
			
			/**
			 * Remove the capacity information bars.
			 */
			var _lf_removeFields = function() {
				IC.myGM.removeElement(IC.myGM.$$('.' + IC.myGM.prefix + 'capacityInformation'));
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_showCapacityBar
			 *   If the user selected the checkbox to show the capacity information.
			 */
			this.updateSettings = function(ib_showCapacityBar) {
				_go_styleFunctions.setStyles();
				
				if(ib_showCapacityBar === true) {
					_lf_addFields();
					IC.Observer.add('updateCapacityBar', IC.myGM.$('#cityResources'), { childList: true, subtree: true }, _lf_updateFields, _lf_updateFields);
					return;
				}
				
				IC.Observer.remove('updateCapacityBar');
				_lf_removeFields();
			};
		};
		
		/**
		 * Storage for the functions for the direct income.
		 * 
		 * @type	{object}
		 */
		var _go_directIncome = new function() {
			/**
			 * Storage for the tradegood of the last town selected.
			 * 
			 * @type	{int}
			 */
			var _li_lastTradegood = null;
			
			/**
			 * Delete the data of the tradegood of the last town selected.
			 * 
			 * @param	{string}	is_hourlyPrefix
			 *   The prefix for the hourly income wrapper selector.
			 * @param	{string}	is_dailyPrefix
			 *   The prefix for the daily income wrapper selector.
			 */
			var _lf_deleteLastTradegoodData = function(is_hourlyPrefix, is_dailyPrefix) {
				IC.myGM.$(is_hourlyPrefix + IC.Ikariam.resourceNames[_li_lastTradegood]).innerHTML	= '';
				IC.myGM.$(is_dailyPrefix + IC.Ikariam.resourceNames[_li_lastTradegood]).innerHTML	= '';
				
				if(_li_lastTradegood !== 1) {
					IC.myGM.$(is_hourlyPrefix + IC.Ikariam.resourceNames[_li_lastTradegood]).classList.add('invisible');
					IC.myGM.$(is_dailyPrefix + 'Wrapper' + IC.Ikariam.resourceNames[_li_lastTradegood]).classList.add('invisible');
				}
			};
			
			/**
			 * Update the direct icome fields.
			 * 
			 * @param	{boolean}	ib_firstRun
			 *   If this is the first run after adding the fields.
			 */
			var _lf_updateFields = function(ib_firstRun) {
				if(IC.ika.model.isOwnCity === false)
					return;
				
				var ls_hourlyPrefix	= '#' + IC.myGM.prefix + 'hourlyIncomeResource';
				var ls_dailyPrefix	= '#' + IC.myGM.prefix + 'dailyIncomeResource';
				
				if(_li_lastTradegood !== null)
					_lf_deleteLastTradegoodData(ls_hourlyPrefix, ls_dailyPrefix);
				
				var li_producedTradegood	= IC.Ikariam.getInt(IC.ika.getModel().producedTradegood);
				var li_tradegoodProduction	= IC.ika.getModel().tradegoodProduction * 3600 + 0.001;
				var li_woodProduction		= IC.ika.getModel().resourceProduction * 3600 + 0.001;
				var li_wineSpending			= IC.ika.getModel().wineSpendings;
				var li_producesWine			= IC.ika.getModel().cityProducesWine;
				var ls_tradegoodName		= IC.Ikariam.resourceNames[li_producedTradegood];
				
				IC.myGM.$(ls_hourlyPrefix + IC.Ikariam.resourceNames[0]).innerHTML	= IC.Ikariam.formatToIkaNumber(Math.floor(li_woodProduction), true, true);
				IC.myGM.$(ls_dailyPrefix + IC.Ikariam.resourceNames[0]).innerHTML	= IC.Ikariam.formatToIkaNumber(Math.floor(li_woodProduction * 24), false);
				
				IC.myGM.$(ls_hourlyPrefix + IC.Ikariam.resourceNames[1]).innerHTML			= IC.Ikariam.formatToIkaNumber(Math.floor(-1 * li_wineSpending), true, true);
				IC.myGM.$(ls_dailyPrefix + IC.Ikariam.resourceNames[1]).innerHTML			= IC.Ikariam.formatToIkaNumber(Math.floor(-1 * li_wineSpending * 24), false);
				IC.myGM.$(ls_dailyPrefix + 'Label' + IC.Ikariam.resourceNames[1]).innerHTML	= IC.Language.$('resourceInformation.dailyExpenses', [IC.Language.$('diverse.name.resource.' + IC.Ikariam.resourceNames[1])]);
				
				if(li_producesWine === true)
					li_tradegoodProduction = li_tradegoodProduction - li_wineSpending;
				
				if(li_tradegoodProduction >= 0)
					IC.myGM.$(ls_dailyPrefix + 'Label' + ls_tradegoodName).innerHTML	= IC.Language.$('resourceInformation.dailyProduction', [IC.Language.$('diverse.name.resource.' + ls_tradegoodName)]);
				else
					IC.myGM.$(ls_dailyPrefix + 'Label' + ls_tradegoodName).innerHTML	= IC.Language.$('resourceInformation.dailyExpenses', [IC.Language.$('diverse.name.resource.' + ls_tradegoodName)]);
				
				IC.myGM.$(ls_hourlyPrefix + ls_tradegoodName).innerHTML	= IC.Ikariam.formatToIkaNumber(Math.floor(li_tradegoodProduction), true, true);
				IC.myGM.$(ls_dailyPrefix + ls_tradegoodName).innerHTML	= IC.Ikariam.formatToIkaNumber(Math.floor(li_tradegoodProduction * 24), false);
				
				IC.myGM.$(ls_hourlyPrefix + ls_tradegoodName).classList.remove('invisible');
				IC.myGM.$(ls_dailyPrefix + 'Wrapper' + ls_tradegoodName).classList.remove('invisible');
				
				_li_lastTradegood = li_producedTradegood;
			};
			
			/**
			 * Add the direct income fields.
			 */
			var _lf_addFields = function() {
				if(!IC.myGM.$('js_GlobalMenu_production_container_wood') === true) {
					var le_woodProductionContainer	= IC.myGM.$('#js_GlobalMenu_resourceProduction').parentNode;
					le_woodProductionContainer.id	= 'js_GlobalMenu_production_container_wood';
					
				}
				
				IC.Ikariam.resourceNames.forEach(function(is_resource, ii_index) {
					var ls_resourceParent	= is_resource === 'glass' ? 'crystal' : is_resource;
					var la_hourlyClasses	= [IC.myGM.prefix + 'hourlyIncomeResource'];
					var la_dailyClasses		= ['altTooltip', IC.myGM.prefix + 'dailyIncomeResourceWrapper'];

					if(ii_index >= 2) {
						la_hourlyClasses.push('invisible');
						la_dailyClasses.push('invisible');
					}
					
					IC.myGM.addElement('span', IC.myGM.$('#resources_' + is_resource), { 'id': 'hourlyIncomeResource' + is_resource, 'classes': la_hourlyClasses });
					
					var le_dailyIncomeParent		= IC.myGM.$('#js_GlobalMenu_' + ls_resourceParent + '_tooltip tbody');
					var le_dailyIncomeInsertBefore	= IC.myGM.$('#js_GlobalMenu_production_container_' + ls_resourceParent + ' + tr');
					var le_dailyIncomeWrapper		= IC.myGM.addElement('tr', le_dailyIncomeParent, {
						'id':		'dailyIncomeResourceWrapper' + is_resource,
						'classes':	la_dailyClasses,
					}, null, le_dailyIncomeInsertBefore);
					
					IC.myGM.addElement('td', le_dailyIncomeWrapper, {
						'id':			'dailyIncomeResourceLabel' + is_resource,
						'class':		'smallFont',
						'innerHTML':	IC.Language.$('resourceInformation.dailyProduction', [IC.Language.$('diverse.name.resource.' + is_resource)])
					});
					
					IC.myGM.addElement('td', le_dailyIncomeWrapper, {
						'id':		'dailyIncomeResource' + is_resource,
						'class':	'rightText'
					});
				});
				
				_lf_updateFields(true);
			};
			
			/**
			 * Remove the direct income fields.
			 */
			var _lf_removeFields = function() {
				IC.myGM.removeElement(IC.myGM.$$('.' + IC.myGM.prefix + 'hourlyIncomeResource' + ', .' + IC.myGM.prefix + 'dailyIncomeResourceWrapper'));
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_showDirectIncome
			 *   If the user selected the checkbox to show the income directly in town view.
			 */
			this.updateSettings = function(ib_showDirectIncome) {
				_go_styleFunctions.setStyles();
				
				if(ib_showDirectIncome === true) {
					_lf_addFields();
					IC.RefreshHandler.add('*', 'directIncome', _lf_updateFields);
					return;
				}
				
				IC.RefreshHandler.remove('*', 'directIncome');
				_lf_removeFields();
			};
		};
		
		/**
		 * Storage for the functions for the resource quicklinks enhancements.
		 * 
		 * @type	{object}
		 */
		var _go_resourceQuicklinkEnhancements = new function() {
			/**
			 * Open the town hall of the selected town.
			 */
			var _lf_openTownHall = function() {
				var ls_selectedCity	= IC.ika.getModel().relatedCityData.selectedCity;
				var ls_cityId		= IC.ika.getModel().relatedCityData[ls_selectedCity].id;
				
				if(IC.Ikariam.view == 'town') {
					IC.win.ajaxHandlerCall('?view=townHall&cityId=' + ls_cityId + '&position=0');
					
					return;
				}
				
				IC.win.ajaxHandlerCall('?view=city&dialog=townHall&cityId=' + ls_cityId + '&position=0');
			};
			
			/**
			 * Update the css to hover only the resources which are clickable.
			 */
			var _lf_updateCSS = function() {
				var ls_activeResource = IC.Ikariam.resourceNames[IC.ika.getModel().producedTradegood];
				
				IC.myGM.addStyle(
					'#resources_population:hover, #resources_wood:hover, #resources_' + ls_activeResource + ':hover	{ text-shadow: 2px 2px 2px #666; cursor: pointer; color: #333; }',
					'resourceQuicklinkEnhancements', true
				);
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_enhanceResourceQuicklinks
			 *   If the user selected the checkbox to enhance the resource quicklinks.
			 */
			this.updateSettings = function(ib_enhanceResourceQuicklinks) {
				if(ib_enhanceResourceQuicklinks === true) {
					IC.myGM.$('#resources_population').addEventListener('click', _lf_openTownHall, true);
					IC.RefreshHandler.add('*', 'resourceQuicklinkEnhancements', _lf_updateCSS);
					return;
				}
				
				IC.RefreshHandler.remove('*', 'resourceQuicklinkEnhancements');
				IC.myGM.$('#resources_population').removeEventListener('click', _lf_openTownHall, true);
				IC.myGM.removeStyle('resourceQuicklinkEnhancements');
			};
		};
		
		IC.Options.addWrapper('resourceInformation', IC.Language.$('resourceInformation.options.wrapperTitle'));
		
		// Option to show the income directly in town view.
		IC.Options.addCheckbox('showDirectIncome', 'resourceInformation', 1, true, IC.Language.$('resourceInformation.options.directIncome.show'), { changeCallback: _go_directIncome.updateSettings });
		// Option to enhance the resource quicklinks and add one to population.
		IC.Options.addCheckbox('resourceQuicklinkEnhancements', 'resourceInformation', 1, true, IC.Language.$('resourceInformation.options.resourceQuicklinkEnhancements'), { changeCallback: _go_resourceQuicklinkEnhancements.updateSettings });
		
		// Option to show the capacity information.
		IC.Options.addCheckbox('showCapacityBar', 'resourceInformation', 2, true, IC.Language.$('resourceInformation.options.capacityBar.show'), { changeCallback: _go_capacityInformation.updateSettings });
		// Option to show the capacity bar with border.
		IC.Options.addCheckbox('capacityBarHasBorder', 'resourceInformation', 2, true, IC.Language.$('resourceInformation.options.capacityBar.hasBorder'), {});
		// Option to show also branch office ressources.
		IC.Options.addCheckbox('capacityBarShowBranchOfficeResources', 'resourceInformation', 2, true, IC.Language.$('resourceInformation.options.capacityBar.showBranchOfficeResources'), {});
		
		// Style of the resources in warehouse / daily income.
		IC.Options.addSelect('incomeStyle', 'resourceInformation', 3, 'alignRight', IC.Language.$('resourceInformation.options.directIncome.style.label'), [
			{ value: 'alignRight',		label: IC.Language.$('resourceInformation.options.directIncome.style.alignRight') },
			{ value: 'alignLeft',		label: IC.Language.$('resourceInformation.options.directIncome.style.alignLeft') },
			{ value: 'withSeparation',	label: IC.Language.$('resourceInformation.options.directIncome.style.withSeparation') }
		], {});
		// Style of the capacity bar.
		IC.Options.addSelect('capacityBarOrientation', 'resourceInformation', 3, 'vertical', IC.Language.$('resourceInformation.options.capacityBar.orientation.label'), [
			{ value: 'vertical',		label: IC.Language.$('resourceInformation.options.capacityBar.orientation.vertical') },
			{ value: 'horizontal',		label: IC.Language.$('resourceInformation.options.capacityBar.orientation.horizontal') },
			{ value: 'horizontalFull',	label: IC.Language.$('resourceInformation.options.capacityBar.orientation.horizontalFull') }
		], {});
	})();
	
	IC.con.logTimeStamp('IkariamEnhancedUI: resource information functions created');
	
	// Member information in highscore view.
	(function() {
		/**
		 * Storage for the member information functions.
		 * 
		 * @type	{object}
		 */
		var _go_memberInformation = new function() {
			/**
			 * Storage for the member data.
			 * 
			 * @type	{object}
			 */
			var _lo_data		= null;
			
			/**
			 * Key for the storage of the member information.
			 * 
			 * @type	{string}
			 */
			var _ls_dataKey	= '';
			
			/**
			 * Key for the storage of the last reset date.
			 * 
			 * @type	{string}
			 */
			var _ls_timeKey	= '';
			
			/**
			 * Show the data.
			 */
			var _lf_clickShow = function() {
				IC.myGM.setValue('memberInfo_infoLinkClicked', true).then(function() {
					IC.myGM.$('#tab_highscore input[name="searchUser"]').value	= '';
					IC.myGM.$('#searchOnlyFriends').checked						= false;
					IC.myGM.$('#searchOnlyAllies').checked						= true;
					
					IC.myGM.$('#tab_highscore input[type="submit"]').click();
				});
			};
			
			/**
			 * Reset the stored data.
			 */
			var _lf_clickReset = function() {
				IC.myGM.setValue(_ls_dataKey, _lo_data).then(function() {
					return IC.myGM.setValue(_ls_timeKey, (new Date).getTime());
				}).then(function() {
					_lf_clickShow();
				});
			};
			
			/**
			 * Add the button to show the data.
			 */
			var _lf_addShowButton = function() {
				var le_button = IC.myGM.addButton(IC.myGM.$('#tab_highscore .centerButton'), IC.Language.$('highscore.memberInformation.show'), _lf_clickShow, true);
				le_button.id = IC.myGM.prefix + 'showInfo';
			};
			
			/**
			 * Add the button to reset the stored data.
			 */
			var _lf_addResetButton = function() {
				var le_button = IC.myGM.addButton(IC.myGM.$('#tab_highscore .content p'), IC.Language.$('highscore.memberInformation.reset'), _lf_clickReset, true);
				le_button.id = IC.myGM.prefix + 'resetInfo';
			};
			
			/**
			 * Get the own data and show the differences to the last stored data.
			 * 
			 * @param	{object}	io_oldMemberInfo
			 *   The last stored data.
			 * 
			 * @return	{object}
			 *   The own data.
			 */
			var _lf_getOwnDataShowDifference = function(io_oldMemberInfo) {
				var le_ownRow = IC.myGM.$('table.highscore tr.own');
				var ro_ownData = {
					'place': IC.Ikariam.getInt(IC.myGM.$('.place', le_ownRow).innerHTML),
					'score': IC.Ikariam.getInt(IC.myGM.$('.score', le_ownRow).innerHTML)
				};
				
				var ls_placeDifference = '-';
				var ls_scoreDifference = '-';
				if(!!io_oldMemberInfo === true && !!io_oldMemberInfo['own'] === true) {
					ls_placeDifference = IC.Ikariam.formatToIkaNumber(io_oldMemberInfo['own']['place'] - ro_ownData['place'], true, true);
					ls_scoreDifference = IC.Ikariam.formatToIkaNumber(ro_ownData['score'] - io_oldMemberInfo['own']['score'], true, true);
				}
				
				IC.myGM.addElement('span', IC.myGM.$('.place', le_ownRow), { 'innerHTML': ls_placeDifference });
				IC.myGM.addElement('span', IC.myGM.$('.score', le_ownRow), { 'innerHTML': ls_scoreDifference });
				
				return ro_ownData;
			};
			
			/**
			 * Get the data and show the differences to the last stored data.
			 * 
			 * @return	{Promise}
			 *   A Promise which resolves to the member data.
			 */
			var _lf_getDataShowDifference = async function() {
				var ro_memberInfo		= {};
				var lo_oldMemberInfo	= await IC.myGM.getValue(_ls_dataKey, null);
				var la_allyMemberRows	= IC.myGM.$$('table.highscore tr.ownally');
				
				la_allyMemberRows.forEach(function(ie_allyMemberRow) {
					var ls_actionLink	= IC.myGM.$('.action a', ie_allyMemberRow).href;
					var ls_memberId		= ls_actionLink.match(/receiverId=([0-9]*)/i)[1];
					
					ro_memberInfo[ls_memberId] = {
						'place': IC.Ikariam.getInt(IC.myGM.$('.place', ie_allyMemberRow).innerHTML),
						'score': IC.Ikariam.getInt(IC.myGM.$('.score', ie_allyMemberRow).innerHTML)
					};
					
					var ls_placeDifference = '-';
					var ls_scoreDifference = '-';
					if(!!lo_oldMemberInfo === true && !!lo_oldMemberInfo[ls_memberId] === true) {
						ls_placeDifference = IC.Ikariam.formatToIkaNumber(lo_oldMemberInfo[ls_memberId]['place'] - ro_memberInfo[ls_memberId]['place'], true, true);
						ls_scoreDifference = IC.Ikariam.formatToIkaNumber(ro_memberInfo[ls_memberId]['score'] - lo_oldMemberInfo[ls_memberId]['score'], true, true);
					}
					
					IC.myGM.addElement('span', IC.myGM.$('.place', ie_allyMemberRow), { 'innerHTML': ls_placeDifference });
					IC.myGM.addElement('span', IC.myGM.$('.score', ie_allyMemberRow), { 'innerHTML': ls_scoreDifference });
				});
				
				ro_memberInfo['own'] = _lf_getOwnDataShowDifference(lo_oldMemberInfo);
				
				return Promise.resolve(ro_memberInfo);
			};
			
			/**
			 * Add the span with the time of the last reset.
			 * 
			 * @return	{Promise}
			 *   A Promise which resolves once the last reset time is added.
			 */
			var _lf_addLastResetTime = async function() {
				var li_lastResetTime	= await IC.myGM.getValue(_ls_timeKey, 0);
				var li_differenceInSec	= ((new Date()).getTime() - li_lastResetTime) / 1000;
				var ls_lastReset		= IC.Language.$('highscore.memberInformation.noReset');
				
				if(li_lastResetTime > 0) {
					var li_days	= Math.floor(li_differenceInSec / 86400);
					var li_hours	= Math.floor(li_differenceInSec / 3600) % 24;
					var li_minutes	= Math.floor(li_differenceInSec / 60) % 60;
					
					ls_lastReset = li_days + 'd ' + li_hours + 'h ' + li_minutes + 'min';
				}
				
				IC.myGM.addElement('br', IC.myGM.$('#tab_highscore .content p'));
				IC.myGM.addElement('span', IC.myGM.$('#tab_highscore .content p'), {
					'classes':		['bold', 'brown'],
					'innerHTML':	IC.Language.$('highscore.memberInformation.lastReset', [ls_lastReset])
				});
			};
			
			/**
			 * Prepare the highscore popup to show the data and show the data if requested.
			 * 
			 * @return	{Promise}
			 *   A Promise which resolves once the popup is prepared.
			 */
			var _lf_doPreparePopup = async function() {
				_ls_dataKey = IC.Ikariam.serverCode + '_' + IC.ika.getModel().avatarAllyId + '_memberInfo_data_' + IC.myGM.getSelectValue('js_highscoreType', true, true);
				_ls_timeKey = IC.Ikariam.serverCode + '_' + IC.ika.getModel().avatarAllyId + '_memberInfo_time_' + IC.myGM.getSelectValue('js_highscoreType', true, true);
				
				_lf_addShowButton();
				
				var lb_linkClicked = await IC.myGM.getValue('memberInfo_infoLinkClicked', false);
				if(lb_linkClicked === true) {
					await IC.myGM.deleteValue('memberInfo_infoLinkClicked');
					_lo_data = await _lf_getDataShowDifference();
					_lf_addResetButton();
					_lf_addLastResetTime();
				}
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_showMemberInformation
			 *   If the user selected the checkbox to show the member information.
			 */
			this.updateSettings = function(ib_showMemberInformation) {
				if(ib_showMemberInformation === true) {
					IC.RefreshHandler.add('highscore', 'memberInformation', _lf_doPreparePopup);
					IC.myGM.addStyle(
						'#' + IC.myGM.prefix + "resetInfo	{ float: right; margin-top: -6px; margin-right: 6px; } \
						 .highscore .score span				{ float: right; text-align: right; width: 70px; } \
						 .highscore .place span				{ float: right; text-align: right; width: 30px; } \
						 .highscore th:nth-child(4)			{ width: 30% !important; } \
						 .highscore th:nth-child(5)			{ width: 10% !important; } \
						 #tab_highscore	.centerButton		{ margin: 10px 0px; }",
						'memberInformation', true
					);
					return;
				}
				
				IC.RefreshHandler.remove('highscore', 'memberInformation');
				IC.myGM.removeStyle('memberInformation');
			};
		};
		
		// Show the member information.
		IC.Options.addCheckbox('showMemberInformation', 'diverseOptions', 1, false, IC.Language.$('highscore.options.showMemberInformation'), { changeCallback: _go_memberInformation.updateSettings });
	})();
	
	IC.con.logTimeStamp('IkariamEnhancedUI: highscore functions created');
	
	// Message enhancements.
	(function() {
		/**
		 * Storage for the url replacement functions.
		 * 
		 * @type	{object}
		 */
		var _go_replaceURL = new function() {
			/**
			 * Show a warning when a replaced link is clicked.
			 */
			var _lf_showNotification = function() {
				var ls_urlToOpen = this.innerHTML.IC.decodeHTML();
				
				var lo_notificationText = {
					header:		IC.Language.$('message.replacedUrl.notification.header'),
					body:		IC.Language.$('message.replacedUrl.notification.text', ['<span class="bold red">"' + ls_urlToOpen + '"</span>']),
					confirm:	IC.Language.$('general.yes'),
					abort:		IC.Language.$('general.no')
				};
				
				var lo_notificationCallback = {
					confirm:	function() { IC.win.open(ls_urlToOpen); },
					abort:		function() { /* Only set to show the abort button */ }
				};
				
				IC.myGM.notification(lo_notificationText, lo_notificationCallback);
			};
			
			/**
			 * Replace the links.
			 */
			var _lf_doReplace = function() {
				var la_messageBodys = IC.myGM.$$('.msgText');
				
				la_messageBodys.forEach(function(ie_messageBody) {
					var ls_text = ie_messageBody.innerHTML;
					ie_messageBody.innerHTML = ls_text.replace(/(?:^|\s)(http(s?)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,4}(\/[^<\s]*)?)/g, ' <span class="' + IC.myGM.prefix + 'replacedUrl" title="$1">$1</span> ');
				});
				
				var la_replacedURLs = IC.myGM.$$('.' + IC.myGM.prefix + 'replacedUrl');
				
				la_replacedURLs.forEach(function(ie_replacedURL) {
					ie_replacedURL.addEventListener('click', _lf_showNotification, true);
				});
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_replaceURL
			 *   If the user selected the checkbox to replace the url.
			 */
			this.updateSettings = function(ib_replaceURL) {
				var la_postboxes = ['diplomacyAdvisor', 'diplomacyAdvisorOutBox', 'diplomacyAdvisorArchive', 'diplomacyAdvisorArchiveOutBox'];
				if(ib_replaceURL === true) {
					IC.RefreshHandler.add(la_postboxes, 'replaceURL', _lf_doReplace);
					IC.myGM.addStyle(
						'.' + IC.myGM.prefix + 'replacedUrl			{ font-weight: bold; font-style: italic; } \
						 .' + IC.myGM.prefix + 'replacedUrl:hover	{ text-decoration: underline; cursor: pointer; }',
						'replaceURL', true
					);
					return;
				}
				
				IC.RefreshHandler.remove(la_postboxes, 'replaceURL');
				IC.myGM.removeStyle('replaceURL');
			};
		};
		
		/**
		 * Storage for the inline message functions.
		 * 
		 * @type	{object}
		 */
		var _go_inlineMessage = new function() {
			/**
			 * Replace the links.
			 */
			var _lf_doShowInline = function() {
				var la_messageRows = IC.myGM.$$('#deleteMessages tr.entry');
				var li_displayMaxCharacters = 60;
				
				la_messageRows.forEach(function(ie_messageRow) {
					var le_subject		= IC.myGM.$('.subject', ie_messageRow);
					var ls_typePrefix	= /gmessage/.test(ie_messageRow.id) === true ? 'g' : '';
					var ls_id			= ie_messageRow.id.replace(ls_typePrefix + 'message', '');
					var le_text			= IC.myGM.$('#tbl_' + ls_typePrefix + 'mail' + ls_id + ' .msgText');
					
					var ls_inlineText = le_text.innerHTML.replace(/<br>/gi, ' ').replace(/\s+/gi, ' ');
					
					if(ls_inlineText.length > li_displayMaxCharacters)
						ls_inlineText = ls_inlineText.substring(0, li_displayMaxCharacters - 6) + ' (...)';
					
					le_subject.innerHTML += '<br><sub>' + ls_inlineText + '</sub>';
				});
				
				// Adjust the size of the Scrollbar.
				IC.ika.controller.adjustSizes();
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_displayInlineMessage
			 *   If the user selected the checkbox to display inline messages.
			 */
			this.updateSettings = function(ib_displayInlineMessage) {
				var la_postboxes = ['diplomacyAdvisor', 'diplomacyAdvisorOutBox', 'diplomacyAdvisorArchive', 'diplomacyAdvisorArchiveOutBox'];
				if(ib_displayInlineMessage === true) {
					IC.RefreshHandler.add(la_postboxes, 'inlineMessage', _lf_doShowInline);
					return;
				}
				
				IC.RefreshHandler.remove(la_postboxes, 'inlineMessage');
			};
		};
		
		/**
		 * Storage for the message signature functions.
		 * 
		 * @type	{object}
		 */
		var _go_messageSignature = new function() {
			/**
			 * Add the signature to a new message.
			 */
			var _lf_addSignature = function() {
				var ls_signature = '';
				
				switch(IC.Options.getOption('messages', 'useMessageSignature')) {
					case IC.Options.SpecificityLevel.GLOBAL:
						ls_signature = IC.Options.getOption('messages', 'globalSignature');
					  break;
					
					case IC.Options.SpecificityLevel.SERVER:
						ls_signature = IC.Options.getOption('messages', 'serverSignature');
					  break;
					
					case IC.Options.SpecificityLevel.PLAYER:
						ls_signature = IC.Options.getOption('messages', 'playerSignature');
					  break;
				}
				
				if(ls_signature === '')
					return;
				
				var le_textarea = IC.myGM.$('#js_msgTextConfirm');
				
				var ls_text = le_textarea.value;
				
				if(IC.Options.getOption('messages', 'signaturePlacementTop'))
					ls_text = '\n\n' + ls_signature + ls_text;
				else
					ls_text = ls_text + '\n\n' + ls_signature;
				
				le_textarea.value = ls_text;
				
				le_textarea.setSelectionRange(0,0);
				le_textarea.focus();
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_addMessageSignature
			 *   If the user selected the checkbox to add signatures to messages.
			 */
			this.updateSettings = function(is_useMessageSignature) {
				if(is_useMessageSignature === IC.Options.SpecificityLevel.GLOBAL
						|| is_useMessageSignature === IC.Options.SpecificityLevel.SERVER
						|| is_useMessageSignature === IC.Options.SpecificityLevel.PLAYER) {
					IC.RefreshHandler.add('sendIKMessage', 'addMessageSignature', _lf_addSignature);
					return;
				}
				
				IC.RefreshHandler.remove('sendIKMessage', 'addMessageSignature');
			};
		};
		
		IC.Options.addWrapper('messages', IC.Language.$('message.options.wrapperTitle'));
		
		// Replace urls.
		IC.Options.addCheckbox('replaceURL', 'messages', 1, true, IC.Language.$('message.options.replaceURL'), { changeCallback: _go_replaceURL.updateSettings });
		
		// Display message text teaser in overview.
		IC.Options.addCheckbox('inlineMessage', 'messages', 1, true, IC.Language.$('message.options.inlineMessage'), { changeCallback: _go_inlineMessage.updateSettings });
		
		// Player specific signatures.
		var la_options = [
			{ value: 'none', label: IC.Language.$('message.options.signature.use.none') },
			{ value: IC.Options.SpecificityLevel.GLOBAL, label: IC.Language.$('message.options.signature.use.global') },
			{ value: IC.Options.SpecificityLevel.SERVER, label: IC.Language.$('message.options.signature.use.server') },
			{ value: IC.Options.SpecificityLevel.PLAYER, label: IC.Language.$('message.options.signature.use.player') }
		];
		IC.Options.addSelect('useMessageSignature', 'messages', 2, IC.Options.SpecificityLevel.GLOBAL, IC.Language.$('message.options.signature.use.description'), la_options, { changeCallback: _go_messageSignature.updateSettings, 'specificity': IC.Options.SpecificityLevel.PLAYER });
		
		// Place the signature on top.
		IC.Options.addCheckbox('signaturePlacementTop', 'messages', 2, true, IC.Language.$('message.options.signature.placementTop'), {});
		
		// Define a global signature.
		IC.Options.addTextArea('globalSignature', 'messages', 3, '', IC.Language.$('message.options.signature.global'), {});
		// Define a server specific signature.
		IC.Options.addTextArea('serverSignature', 'messages', 4, '', IC.Language.$('message.options.signature.server'), { 'specificity': IC.Options.SpecificityLevel.SERVER });
		// Define a server specific signature.
		IC.Options.addTextArea('playerSignature', 'messages', 4, '', IC.Language.$('message.options.signature.player'), { 'specificity': IC.Options.SpecificityLevel.PLAYER });
	})();
	
	IC.con.logTimeStamp('IkariamEnhancedUI: message functions created');
	
	// Troop information.
	(function() {
		/**
		 * Provider for data storages.
		 * 
		 * @type	{object}
		 */
		var _go_storageProvider = new function() {
			/**
			 * Constructor for troop list.
			 */
			var _lf_troopList = function() {
				/**
				 * Storage for troop information.
				 * 
				 * @type	{lf_troop[]}
				 */
				var la_troopList = [];
				
				/**
				 * Troop information storage.
				 * 
				 * @param	{string}	is_name
				 *   The name of the troop.
				 * @param	{int}		ii_number
				 *   The number of the troop.
				 */
				var lf_troop = function(is_name, ii_number) {
					var ls_name		= is_name;
					var li_number	= ii_number;
					
					this.toString = function() {
						return '\n' + ls_name + ': ' + li_number;
					};
				};
				
				/**
				 * If the troop list contains no entries.
				 * 
				 * @return	{boolean}
				 *   If the troop list is empty.
				 */
				this.__defineGetter__('isEmpty', function() {
					return la_troopList.length < 1;
				});
				
				/**
				 * Add a new troop to the troop list.
				 * 
				 * @param	{string}	is_name
				 *   The name of the troop.
				 * @param	{int}		ii_number
				 *   The number of the troop.
				 */
				this.addTroop = function(is_name, ii_number) {
					la_troopList.push(new lf_troop(is_name, ii_number));
				};
				
				/**
				 * Transform the troop list to a string.
				 * 
				 * @return	{string}
				 *   The string representation of the troop list.
				 */
				this.toString = function() {
					return la_troopList.join('');
				};
			};
			
			/**
			 * Constructor for troop list of foreign player.
			 * 
			 * @param	{string}	is_playerName
			 *   The name of the player who owns the troops.
			 */
			var _lf_foreignTroopList = function(is_playerName) {
				/**
				 * The name of the player who owns the troops.
				 * 
				 * @type	{string}
				 */
				var ls_playerName = is_playerName;
				
				/**
				 * Storage for troop information.
				 * 
				 * @type	{_lf_troopList[]}
				 */
				var lo_troopList	= new _lf_troopList();
				
				/**
				 * If the troop list contains no entries.
				 * 
				 * @return	{boolean}
				 *   If the troop list is empty.
				 */
				this.__defineGetter__('isEmpty', function() {
					return lo_troopList.isEmpty;
				});
				
				/**
				 * Add a new troop to the troop list.
				 * 
				 * @param	{string}	is_name
				 *   The name of the troop.
				 * @param	{int}		ii_number
				 *   The number of the troop.
				 */
				this.addTroop = function(is_name, ii_number) {
					lo_troopList.addTroop(is_name, ii_number);
				};
				
				/**
				 * Transform the troop list to a string.
				 * 
				 * @return	{string}
				 *   The string representation of the troop list.
				 */
				this.toString = function() {
					return '\n* ' + ls_playerName + ' *' + lo_troopList;
				};
			};
			
			/**
			 * Storage for multiple troop lists.
			 * 
			 * @param	{string}	is_type
			 *   The type of the troops (units / ships)
			 * @param	{string}	is_status
			 *   The status of the troops (own / friends / enemies)
			 */
			var _lf_troopListStorage = function(is_type, is_status) {
				/**
				 * The type of the troops (units / ships).
				 * 
				 * @type	{string}
				 */
				var ls_type = is_type;
				
				/**
				 * The status of the troops (own / friends / enemies).
				 * 
				 * @type	{string}
				 */
				var ls_status = is_status;
				
				/**
				 * The troop lists.
				 * 
				 * @type	{(_lf_troopList||_lf_foreignTroopList)[]}
				 */
				var la_troopLists = [];
				
				/**
				 * The status of the troop lists (own / friends / enemies).
				 * 
				 * @return	{boolean}
				 *   The status of the lists.
				 */
				this.__defineGetter__('status', function() {
					return ls_status;
				});
				
				/**
				 * Add a new troop list to the storage.
				 * 
				 * @param	{_lf_troopList||_lf_foreignTroopList}	io_troopList
				 *   The troop list to add.
				 */
				this.addTroopList = function(io_troopList) {
					la_troopLists.push(io_troopList);
				};
				
				/**
				 * Transform the troop list storage to a string.
				 * 
				 * @return	{string}
				 *   The string representation of the troop list storage.
				 */
				this.toString = function() {
					return '\n--- ' + IC.Language.$('troopInformation.' + ls_type + '.' + ls_status) + ' ---' + la_troopLists.join('\n');
				};
			};
			
			/**
			 * Storage for data of all troops of one type.
			 * 
			 * @param	{string}	is_type
			 *   The type of the troops (units / ships)
			 */
			var _lf_troopData = function(is_type) {
				/**
				 * The type of the troops (units / ships).
				 * 
				 * @type	{string}
				 */
				var ls_type = is_type;
				
				/**
				 * The troop list storages.
				 * 
				 * @type	{_lf_troopListStorage[]}
				 */
				var la_listStorages	= [];
				
				/**
				 * If the troop list contains no entries.
				 * 
				 * @return	{boolean}
				 *   If the troop list is empty.
				 */
				this.__defineGetter__('isEmpty', function() {
					return la_listStorages.length < 1;
				});
				
				/**
				 * Add a new troop list to the storage.
				 * 
				 * @param	{string}	is_status
				 *   The status of the troop list.
				 * @param	{_lf_troopList||_lf_foreignTroopList}	io_troopList
				 *   The troop list to add.
				 */
				this.addTroopList = function(is_status, io_troopList) {
					for(var i = 0; i < la_listStorages.length; i++) {
						if(la_listStorages[i].status === is_status) {
							la_listStorages[i].addTroopList(io_troopList);
							return;
						}
					}
					
					var lo_listStorage = new _lf_troopListStorage(ls_type, is_status);
					lo_listStorage.addTroopList(io_troopList);
					la_listStorages.push(lo_listStorage);
				};
				
				/**
				 * Transform the troop data to a string.
				 * 
				 * @param	{string}	is_townInformation
				 *   The information about the town for which the troop data is displayed.
				 * 
				 * @return	{string}
				 *   The string representation of the troop data.
				 */
				this.getString = function(is_townInformation) {
					return '===== ' + IC.Language.$('troopInformation.' + ls_type + '.label', [is_townInformation]) + ' =====' + la_listStorages.join('\n\n');
				};
			};
			
			/**
			 * Get a new troop list representation for own troops.
			 * 
			 * @return	{_lf_troopList}
			 *   The troop list.
			 */
			this.ownTroopList = function() {
				return new _lf_troopList();
			};
			
			/**
			 * Get a new troop list representation for foreign troops.
			 * 
			 * @param	{string}	is_playerName
			 *   The name of the player who owns the troops.
			 * 
			 * @return	{_lf_foreignTroopList}
			 *   The troop list.
			 */
			this.foreignTroopList = function(is_playerName) {
				return new _lf_foreignTroopList(is_playerName);
			};
			
			/**
			 * Get a new troop data storage representation for all troops of one type.
			 * 
			 * @param	{string}	is_type
			 *   The type of the troops (units / ships).
			 * 
			 * @return	{_lf_troopData}
			 *   The troop data storage.
			 */
			this.troopData = function(is_type) {
				return new _lf_troopData(is_type);
			};
		};
		
		/**
		 * Storage for the dta extraction functions.
		 * 
		 * @type	{object}
		 */
		var _go_dataExtractor = new function() {
			/**
			 * Extract own troops from a wrapper.
			 * 
			 * @param	{element}	ie_wrapper
			 *   The wrapper to extract the troops from.
			 * 
			 * @return	{_go_storageProvider.ownTroopList[]}
			 *   The extracted troops.
			 */
			var _lf_extractOwnTroops = function(ie_wrapper) {
				var la_nameCells	= IC.myGM.$$('.table01 .title_img_row th .tooltip', ie_wrapper);
				var la_numberCells	= IC.myGM.$$('.table01 .count td', ie_wrapper);
				
				var ro_troops = _go_storageProvider.ownTroopList();
				
				for(var i = 0; i < la_nameCells.length; i++) {
					var li_number = IC.Ikariam.getInt(la_numberCells[i].innerHTML);
					
					if(li_number > 0)
						ro_troops.addTroop(la_nameCells[i].innerHTML, li_number);
				}
				
				return ro_troops;
			};
			
			/**
			 * Extract foreign troops from a wrapper.
			 * 
			 * @param	{element}	ie_wrapper
			 *   The wrapper to extract the troops from.
			 * 
			 * @return	{_go_storageProvider.foreignTroopList[]}
			 *   The extracted troops.
			 */
			var _lf_extractForeignTroops = function(ie_wrapper) {
				var la_nameCells	= IC.myGM.$$('.table01 .title_img_row th:not(:first-child) .tooltip', ie_wrapper);
				var la_numberRows	= IC.myGM.$$('.table01 tr:not(.title_img_row)', ie_wrapper);
				var lo_numberCells	= {};
				
				for(var i = 0; i < la_numberRows.length; i++) {
					var ls_playerName = IC.myGM.$('td a', la_numberRows[i]).innerHTML.trim();
					
					if(!lo_numberCells[ls_playerName]) {
						lo_numberCells[ls_playerName] = [];
					}
					
					lo_numberCells[ls_playerName] = lo_numberCells[ls_playerName].concat(IC.myGM.$$('td:not(:first-child)', la_numberRows[i]));
				}
				
				var ra_troops = [];
				
				IC.myGM.forEach(lo_numberCells, function (is_playerName, ia_numberCells) {
					var lo_playerTroops = _go_storageProvider.foreignTroopList(is_playerName);
					
					for(var i = 0; i < la_nameCells.length; i++) {
						var li_number = IC.Ikariam.getInt(ia_numberCells[i].innerHTML);
						
						if(li_number > 0)
							lo_playerTroops.addTroop(la_nameCells[i].innerHTML, li_number);
					}
					
					if(lo_playerTroops.isEmpty === false)
						ra_troops.push(lo_playerTroops);
				});
				
				return ra_troops;
			};
			
			/**
			 * Extract all troop of one type.
			 * 
			 * @param	{string}	is_type
			 *   The type of the troops to extract (units / ships).
			 * @param	{string}	is_wrapperTabId
			 *   The id of the tab which contains the wrappers.
			 * 
			 * @return	{_go_storageProvider.troopData}
			 *   The extracted data.
			 */
			var _lf_extractTroops = function(is_type, is_wrapperTabId) {
				var ro_return = _go_storageProvider.troopData(is_type);
				
				var la_wrappers	= IC.myGM.$$('#' + is_wrapperTabId + ' .contentBox01h');
				
				var lo_ownTroops	= _lf_extractOwnTroops(la_wrappers[0]);
				if(lo_ownTroops.isEmpty === false)
					ro_return.addTroopList('own', lo_ownTroops);
				
				var la_foreignStatus = ['friends', 'enemies'];
				
				for(var i = 0; i < la_foreignStatus.length; i++) {
					var la_foreignTroops = _lf_extractForeignTroops(la_wrappers[i + 2]);
					
					for(var j = 0; j < la_foreignTroops.length; j++) {
						ro_return.addTroopList(la_foreignStatus[i], la_foreignTroops[j]);
					}
				}
				
				return ro_return;
			};
			
			/**
			 * Extract all troop from the popup.
			 * 
			 * @return	{object}
			 *   All extracted troops.
			 *   Signature: { units: <_go_storageProvider.troopData>, ships: <_go_storageProvider.troopData> }
			 */
			this.extract = function() {
				return {
					units:	_lf_extractTroops('units', 'tabUnits'),
					ships:	_lf_extractTroops('ships', 'tabShips')
				};
			};
		};
		
		/**
		 * Storage for the troop information functions.
		 * 
		 * @type	{object}
		 */
		var _go_troopInformation = new function() {
			/**
			 * Show the troop information popup.
			 * 
			 * @param	{object}	io_data
			 *   All extracted troop.
			 *   Signature: { units: <_go_storageProvider.troopData>, ships: <_go_storageProvider.troopData> }
			 */
			var _ls_showPopup = function(io_data) {
				var la_output = [];
				var ls_townInformation = (function() {
					var lo_allTowns		= IC.ika.getModel().relatedCityData;
					var lo_selectedTown	= lo_allTowns[lo_allTowns.selectedCity];
					
					return lo_selectedTown.name + ' ' + lo_selectedTown.coords;
				})();
				
				if(!!io_data === true) {
					if(!!io_data.units.isEmpty === false)
						la_output.push(io_data.units.getString(ls_townInformation));
					if(!!io_data.ships.isEmpty === false)
						la_output.push(io_data.ships.getString(ls_townInformation));
				}
				
				var ls_output = la_output.join('\n\n-------------------------------------------------------------------------------------\n\n');
				
				if(ls_output.length === 0)
					ls_output = IC.Language.$('troopInformation.noTroops', [ls_townInformation]);
				
				var lo_text = {
					header:	IC.Language.$('troopInformation.header', [ls_townInformation]),
					body:	ls_output
				};
				
				IC.myGM.notification(lo_text, null, { textarea: true, readonly: true, autoselect: true });
			};
			
			/**
			 * Extract the data and show the popup.
			 */
			var _lf_showInformation = function() {
				_ls_showPopup(_go_dataExtractor.extract());
			};
			
			/**
			 * Show the troop information link.
			 */
			var _lf_doShowTroopInformationLink = function() {
				var le_button	= IC.myGM.addButton(IC.myGM.$('#cityMilitary_c .buildingDescription'), IC.Language.$('troopInformation.button'), _lf_showInformation, true);
				var la_cssRules	= [['position', 'absolute'], ['top', '5px'], ['right', '20px']];
				
				for(var i = 0; i < la_cssRules.length; i++) {
					le_button.style[la_cssRules[i][0]] = la_cssRules[i][1];
				}
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_enableTroopInformation
			 *   If the user selected the checkbox to show the troop information.
			 */
			this.updateSettings = function(ib_enableTroopInformation) {
				if(ib_enableTroopInformation === true) {
					IC.RefreshHandler.add('cityMilitary', 'troopInformation', _lf_doShowTroopInformationLink);
					return;
				}
				
				IC.RefreshHandler.remove('cityMilitary', 'troopInformation');
			};
		};
		
		/**
		 * Storage for the link barracks and shipyard functions.
		 * 
		 * @type	{object}
		 */
		var _go_linkBarrackShipyard = new function() {
			/**
			 * Adds a link to the container.
			 * 
			 * @param	{String}	is_type
			 *   The link type (units / fleet).
			 * @param	{Element}	ie_container
			 *   The element which should be container for the link.
			 */
			var _lf_addLink = function(is_type, ie_container) {
				var lo_data = IC.ika.getScreen().data;
				
				var ls_linkText = is_type === 'units' ? IC.Language.$('troopInformation.link.gotoBarracks') : IC.Language.$('troopInformation.link.gotoShipyard');
				ls_linkText = '(' + ls_linkText + ')';
				
				var ls_buildingType = is_type === 'units' ? 'barracks' : 'shipyard';
				
				var li_position = -1;
				for(var i = 0; i < lo_data.position.length; i++) {
					if(lo_data.position[i].building === ls_buildingType) {
						li_position = i;
						break;
					}
				}
				
				if(li_position >= 0) {
					var ls_href = '?view=%building%&cityId=%cityId%&position=%position%'
											.replace(/%building%/gi, ls_buildingType)
											.replace(/%cityId%/gi, lo_data.id)
											.replace(/%position%/gi, li_position);
					
					IC.myGM.addElement('a', ie_container, {
						innerHTML:	ls_linkText,
						href:		ls_href,
						onclick:	'ajaxHandlerCall(this.href);return false;',
						style:		[['margin-left', '5px']]
					});
				}
			};
			
			/**
			 * Link barack and shipyard from troop overview screen.
			 */
			var _lf_doLinkBarrackShipyardOverview = function() {
				var le_container = IC.myGM.$('.header', IC.myGM.$('#tabUnits'));
				_lf_addLink('units', le_container);
				
				le_container = IC.myGM.$('.header', IC.myGM.$('#tabShips'));
				_lf_addLink('fleet', le_container);
			};
			
			/**
			 * Link barrack and shipyard in dismiss units screen.
			 */
			var _lf_doLinkBarrackShipyardDismiss = function() {
				var ls_type = IC.myGM.$('#js_garrisonEditForm input[name=function]').value.replace(/fire/gi, '').toLowerCase();
				var le_container = IC.myGM.$('#js_garrisonEditForm .header');
				
				_lf_addLink(ls_type, le_container);
			};
			
			/**
			 * Update the settings to execute the callback or delete the handler.
			 * 
			 * @param	{boolean}	ib_linkBarrackShipyard
			 *   If the user selected the checkbox to link barrackand shipyard.
			 */
			this.updateSettings = function(ib_linkBarrackShipyard) {
				if(ib_linkBarrackShipyard === true) {
					IC.RefreshHandler.add('cityMilitary', 'linkBarrackShipyardOverview', _lf_doLinkBarrackShipyardOverview);
					IC.RefreshHandler.add('garrisonEdit', 'linkBarrackShipyardDismiss', _lf_doLinkBarrackShipyardDismiss);
					return;
				}
				
				IC.RefreshHandler.remove('cityMilitary', 'linkBarrackShipyardOverview');
				IC.RefreshHandler.remove('garrisonEdit', 'linkBarrackShipyardDismiss');
			};
		};
		
		IC.Options.addCheckbox('showTroopInformation', 'diverseOptions', 1, true, IC.Language.$('troopInformation.options.show'), { changeCallback: _go_troopInformation.updateSettings });
		IC.Options.addCheckbox('linkBarrackShipyard', 'diverseOptions', 1, true, IC.Language.$('troopInformation.options.linkBarrackShipyard'), { changeCallback: _go_linkBarrackShipyard.updateSettings });
	})();
	
	IC.con.logTimeStamp('IkariamEnhancedUI: troop information functions created');
	IC.con.groupEnd();
}

/**
 * Main function of the script.<br>
 * Inits the Ikariam Core and calls the script functions.<br>
 * Must be called with <pre>setTimeout(main, 0)</pre> for correct setting of some core variables.
 */
async function main() {
	// Get the Ikariam core.
	var IC = new IkariamCore('4.2', 4369, 'Ikariam Enhanced UI', 'Tobbe', false);
	
	if(IC.myGM.alreadyExecuted === true)
		return;
	
	await IC.Language.setDefaultLanguage('en');
	
	var la_language = [
		{ code: 'de', translations: {"view": {"options": {"wrapperTitle": "Anzeige","moveLoadingCircle": "Ladekreis in Positionsleiste verschieben","hideBirds": "Den Vogelschwarm nicht anzeigen","noVerticalCenterInTownAdvisor": "Städteinformationen im Städteberater vertikal nicht zentrieren"}},"island": {"options": {"showColonizingCityInfo": "Informationen über kolonisierende Städte anzeigen"}},"finance": {"options": {"showIncomeOnTop": "Einkommen in der Bilanz auch oben anzeigen","shortUpkeepReductionTable": "Eine gekürzte Version der Einkommensreduktion anzeigen"},"income": {"perHour": "Einkommen pro Stunde","perDay": "Einkommen pro Tag","start": "Einkommen ohne Abzüge"},"upkeep": {"reason": {"0": "Truppen","1": "Schiffe","2": "Truppen & Schiffe"},"basic": "Grundkosten","supply": "Versorgungskosten","result": "Gesamtkosten"}},"missingResources": {"options": {"wrapperTitle": "Fehlende Ressourcen","show": "Fehlende Ressourcen anzeigen","showPositive": "Auch die nach einem Upgrade noch verbleibenden Ressourcen anzeigen","showColoured": "Die verbleibenden Ressourcen farbig anzeigen"}},"tooltips": {"options": {"autoshow": "Tooltips in Allianzmitgliederliste und Militärberater automatisch anzeigen","showDirectInMilitaryAdvisor": "Informationen über Ladungen / Flotten im Militärberater ohne Tooltip anzeigen"}},"zoom": {"options": {"wrapperTitle": "Zoom Funktion","zoomView": "Zoomen in Weltansicht, Inselansicht und Stadtansicht aktivieren","factor": {"world": "Zoom in der Weltkarte:","island": "Zoom in der Inselansicht:","town": "Zoom in der Stadtansicht:"},"scaleChildren": {"label": "Beschriftungen und Symbole beim Zoomen in folgenden Ansichten in Normalgröße belassen:","world": "Weltkarte","island": "Inselansicht","town": "Stadtansicht"},"accessKeyLabel": "Folgende Tasten müssen gedrückt sein, um mit der Maus zoomen zu können:"},"zoomIn": "Reinzoomen","factor": "Zoom Faktor","zoomOut": "Rauszoomen"},"resourceInformation": {"options": {"wrapperTitle": "Einkommen in Stadtansicht","resourceQuicklinkEnhancements": "Ressourcenanzahl zu Rathaus und Minen verlinken","directIncome": {"show": "Tageseinkommen in der Stadtansicht anzeigen","style": {"label": "Darstellung des Einkommens in der Stadtansicht:","alignRight": "Rechtsbündig","alignLeft": "Linksbündig","withSeparation": "Rechtsbündig & Separator"}},"capacityBar": {"show": "Informationsbalken für Lagerhausfüllstand anzeigen","hasBorder": "Mit Rahmen","showBranchOfficeResources": "Auch Ressourcen in Kontor anzeigen","orientation": {"label": "Orientierung des Balkens","vertical": "Vertikal","horizontal": "Horizontal","horizontalFull": "Horizontal, volle Länge"}}},"dailyProduction": "Tagesproduktion %$1:","dailyExpenses": "Tägliche Ausgaben %$1:"},"highscore": {"options": {"showMemberInformation": "Speichern von Highscoreständen von Allianzmitgliedern ermöglichen"},"memberInformation": {"show": "Alli Infos","reset": "Zurücksetzen","lastReset": "Zeit seit dem letzten Zurücksetzen: %$1","noReset": "Bisher nicht zurückgesetzt."}},"message": {"options": {"wrapperTitle": "Nachrichten","replaceURL": "Links in Nachrichten anklickbar machen","inlineMessage": "Bette die ersten Zeichen einer Nachricht direkt in der Nachrichtenübersicht ein","signature": {"use": {"description": "Diese Signatur verwenden:","none": "Keine Signatur","global": "Globale Signatur","server": "Server Signatur","player": "Spieler Signatur"},"placementTop": "Signatur oberhalb von Zitaten einfügen","global": "Globale Signatur, die auf allen Welten verwendet werden kann:","server": "Server Signatur, welcher nur auf dieser Welt genutzt wird:","player": "Spieler Signatur, welche nur für diesen Spieler genutzt wird:"}},"replacedUrl": {"notification": {"header": "Achtung!","text": "Du bist dabei, den Link %$1 zu öffnen. Das öffnen dieses Links erfolgt auf eigenes Risiko. Trotzdem fortfahren?"}}},"troopInformation": {"options": {"show": "Truppeninformationen anzeigen","linkBarrackShipyard": "Kaserne und Kriegswerft in Truppenübersicht und Einheiten entlassen verlinken"},"link": {"gotoBarracks": "zur Kaserne","gotoShipyard": "zur Kriegswerft"},"units": {"label": "Einheiten in %$1","own": "Eigene Einheiten","friends": "Befreundete Einheiten","enemies": "Feindliche Einheiten"},"ships": {"label": "Schiffe in %$1","own": "Eigene Schiffe","friends": "Befreundete Schiffe","enemies": "Feindliche Schiffe"},"button": "Truppeninformationen","header": "Truppen in %$1","noTroops": "Es befinden sich keine Truppen in %$1"},"diverse": {"options": {"wrapperTitle": "Verschiedenes"},"name": {"resource": {"gold": "Gold","wood": "Baumaterial","wine": "Wein","marble": "Marmor","glass": "Kristallglas","sulfur": "Schwefel"},"unit": {"swordsman": "Schwertkämpfer","phalanx": "Hoplit","archer": "Bogenschütze","marksman": "Schwefelbüchsen-Schütze","mortar": "Mörser","slinger": "Steinschleuderer","catapult": "Katapult","ram": "Rammbock","steamgiant": "Dampfgigant","bombardier": "Ballon-Bombardier","cook": "Koch","medic": "Arzt","girocopter": "Gyrokopter","spearman": "Speerträger","spartan": "Spartaner"},"ship": {"ballista": "Ballistaschiff","catapult": "Katapultschiff","flamethrower": "Feuerschiff","mortar": "Mörserschiff","ram": "Rammschiff","steamboat": "Dampframme","rocketship": "Raketenschiff","submarine": "Tauchboot","paddlespeedship": "Schaufelschnellboot","ballooncarrier": "Ballonträger","tender": "Tender","transport": "Handelsschiff"}}}} },
		{ code: 'gr', translations: {"view": {"options": {"wrapperTitle": "Προβολή","moveLoadingCircle": "Μετακίνηση κύκλου φόρτωσης στη γραμμή θέσης","hideBirds": "Απόκρυψη του σμήνους πουλιών","noVerticalCenterInTownAdvisor": "Μη κεντράρισμα πληροφοριών πόλης στον σύμβουλο πόλης"}},"island": {"options": {"showColonizingCityInfo": "Προβολή πληροφοριών για τον αποικισμό πόλεων"}},"finance": {"options": {"showIncomeOnTop": "Προβολή εισοδήματος στην κορυφή στο παράθυρο ισοζυγίου","shortUpkeepReductionTable": "Προβολή μιας μικρής έκδοσης της μείωσης κόστους"},"income": {"perHour": "Εισόδημα ανά ώρα","perDay": "Εισόδημα ανά ημέρα","start": "Εισόδημα χωρίς μείωση"},"upkeep": {"reason": {"0": "Μονάδες στρατού","1": "Πλοία","2": "Μονάδες Στρατού και Πλοία"},"basic": "Βασικά Κόστη","supply": "Κόστη Προμήθειας","result": "Συνολικά Κόστη"}},"missingResources": {"options": {"wrapperTitle": "Χαμένοι Πόροι","show": "Προβολή χαμένων πόρων στην προβολή κατασκευής","showPositive": "Προβολή επίσης των απομένοντων πόρων μετά από αναβάθμιση","showColoured": "Προβολή των απομένοντων πόρων χρωματισμένων"}},"tooltips": {"options": {"autoshow": "Προβολή επεξηγήσεων στο παράθυρο προβολής μελών της συμμαχίας και στον στρατιωτικό σύμβουλο αυτόματα","showDirectInMilitaryAdvisor": "Προβολή πληροφοριών για εμπορικές μεταφορές / μεταγωγές στο παράθυρο στρατού χωρίς επεξηγήσεις"}},"zoom": {"options": {"wrapperTitle": "Λειτουργία εστίασης","zoomView": "Ενεργοποιήση εστίασης σε παγκόσμια, νησιωτική και αστική προβολή","factor": {"world": "Εστίαση παγκόσμιου χάρτη:","island": "Εστίαση νησιωτικής προβολής:","town": "Εστίαση στην αστική προβολή:"},"scaleChildren": {"label": "Διατήρηση διαφημίσεων και συμβόλων σε κανονικό μέγεθος κατά την εστίαση σε αυτή την προβολή:","world": "Παγκόσμιος χάρτης","island": "Νησιωτική προβολή","town": "Αστική προβολή"},"accessKeyLabel": "Αυτά τα κλειδιά πρέπει να πατιούνται για εστίαση με το ποντίκι:"},"zoomIn": "Μεγέθυνση","factor": "Συντελεστής εστίασης","zoomOut": "Σμίκρυνση"},"resourceInformation": {"options": {"wrapperTitle": "Πληροφορίες πόρου","resourceQuicklinkEnhancements": "Σύνδεση αριθμού πόρου στο δημαρχείο / ορυχεία","directIncome": {"show": "Προβολή του ωριαίου εισοδήματος άμεσα στην αστική προβολή","style": {"label": "Στυλ του ωριαίου εισοδήματος στην αστική προβολή:","alignRight": "Δεξιά ευθυγράμμιση","alignLeft": "Αριστερή ευθυγράμμιση","withSeparation": "Δεξιά ευθυγράμμιση με διαχωρισμό"}},"capacityBar": {"show": "Προβολή γραμμής πληροφοριών για τη χωρητικότητα της αποθήκης","hasBorder": "Έχει όριο","showBranchOfficeResources": "Προβολή πόρων στο εμπορικό ανταλλακτήριο","orientation": {"label": "Προσανατολισμός της γραμμής","vertical": "Κάθετος","horizontal": "Οριζόντιος","horizontalFull": "Οριζόντιος, πλήρες μήκος"}}},"dailyProduction": "Ημερήσια παραγωγή %$1:","dailyExpenses": "Ημερήσιες δαπάνες %$1:"},"highscore": {"options": {"showMemberInformation": "Ενεργοποίηση της πιθανότητας αποθήκευσης δεδομένων βαθμολογίας των μελών της συμμαχίας"},"memberInformation": {"show": "Πληροφορίες συμμαχίας","reset": "Επαναφορά","lastReset": "Χρόνος από την τελευταία επαναφορά: %$1","noReset": "Καμιά επαναφορά μέχρι στιγμής."}},"message": {"options": {"wrapperTitle": "Μηνύματα","replaceURL": "Δημιουργία ενεργών συνδέσμων στα μηνύματα","inlineMessage": "Ενσωμάτωση των πρώτων λίγων χαρακτήρων σε κάθε μήνυμα στην επισκόπηση μηνυμάτων","signature": {"use": {"description": "Χρήση αυτής της υπογραφής:","none": "Χωρίς υπογραφή","global": "Καθολική υπογραφή","server": "Υπογραφή διακομιστή","player": "Υπογραφή παίκτη"},"placementTop": "Εισαγωγή υπογραφής πάνω από τα συνημμένα μηνύματα","global": "Καθολική υπογραφή, που θα χρησιμοποιείται σε κάθε κόσμο:","server": "Υπογραφή διακομιστή, που θα χρησιμοποιείται μόνο σε αυτόν τον κόσμο:","player": "Υπογραφή παίκτη, που θα χρησιμοποιείται μόνο για αυτόν τον παίκτη:"}},"replacedUrl": {"notification": {"header": "Προσοχή!","text": "Πρόκειται να ανοίξετε τον σύνδεσμο %$1. Αυτό θα συνεχίσει με δική σας ευθύνη. Συνέχεια;"}}},"troopInformation": {"options": {"show": "Πληροφορίες πληροφοριών στρατού","linkBarrackShipyard": "Σύνδεσμοι του στρατώνα και του ναυπηγείου στις οθόνες επισκόπησης στρατού και απόλυσης μονάδων"},"link": {"gotoBarracks": "μετάβαση στο στρατώνα","gotoShipyard": "μετάβαση στο ναυπηγείο"},"units": {"label": "Μονάδες στην πόλη %$1","own": "Οι δικές μου μονάδες","friends": "Μονάδες συμμαχίας","enemies": "Μονάδες εχθρού"},"ships": {"label": "Πλοία στην πόλη %$1","own": "Τα δικά μου πλοία","friends": "Συμμαχικά πλοία","enemies": "Εχθρικά πλοία"},"button": "Πληροφορίες στρατού","header": "Στρατός στην πόλη %$1","noTroops": "Δεν υπάρχουν μονάδες στρατού στην πόλη %$1"},"diverse": {"options": {"wrapperTitle": "Διαφοροποίηση"},"name": {"resource": {"gold": "Χρυσός","wood": "Ξύλο","wine": "Κρασί","marble": "Μάρμαρο","glass": "Κρύσταλλο","sulfur": "Θείο"},"unit": {"swordsman": "Ξιφομάχος","phalanx": "Οπλίτης","archer": "Τοξότης","marksman": "Πυροβολιτής θείου","mortar": "Κανόνι","slinger": "Εκτοξευτής","catapult": "Καταπέλτης","ram": "Κριός","steamgiant": "Ατμογίγαντας","bombardier": "Βομβαρδιστικό Αερόστατο","cook": "Μάγειρας","medic": "Ιατρός","girocopter": "Γυροκόπτερο","spearman": "Λογχοφόρος","spartan": "Σπαρτιάτης"},"ship": {"ballista": "Βαλιστροφόρο","catapult": "Καταπελτοφόρο","flamethrower": "Φλογοβόλο","mortar": "Κανονιοφόρο","ram": "Σκάφος-Έμβολο","steamboat": "Έμβολο Ατμού","rocketship": "Πυραυλάκατος","submarine": "Βάρκα κατάδυσης","paddlespeedship": "Κωπήλατη Τορπιλάκατος","ballooncarrier": "Μεταφορικό Αερόστατων","tender": "Βοηθητικό σκάφος","transport": "Εμπορικό Πλοίο"}}}} },
		{ code: 'en', translations: {"view": {"options": {"wrapperTitle":"View","moveLoadingCircle":"Move loading circle to position bar","hideBirds":"Hide the bird swarm","noVerticalCenterInTownAdvisor":"Don't center town information in the town advisor"}},"island": {"options": {"showColonizingCityInfo":"Show information about colonizing cities"}},"finance": {"options": {"showIncomeOnTop":"Show income on top in balance view","shortUpkeepReductionTable":"Show a short version of the upkeep reduction"},"income": {"perHour":"Income per hour","perDay":"Income per day","start":"Income without reduction"},"upkeep": {"reason": {"0":"Troops","1":"Ships","2":"Troops & Ships"},"basic":"Basic Costs","supply":"Supply Costs","result":"Total Costs"}},"missingResources": {"options": {"wrapperTitle":"Missing Resources","show":"Show missing resources in construction view","showPositive":"Show also the remaining resources after an upgrade","showColoured":"Show the remaining resources coloured"}},"tooltips": {"options": {"autoshow":"Show tooltips in alliance mebers view and military advisor automatically","showDirectInMilitaryAdvisor":"Show information about cargo / fleets in military view without tooltips"}},"zoom": {"options": {"wrapperTitle":"Zoom function","zoomView":"Activate zoom in world view, island view, town view","factor": {"world":"Zoom worldmap:","island":"Zoom island view:","town":"Zoom town view:"},"scaleChildren": {"label":"Let banners and symbols in normal size when zooming when zooming in this view:","world":"Worldmap","island":"Island view","town":"Town view"},"accessKeyLabel":"This keys must be pressed to zoom with the mouse:"},"zoomIn":"Zoom in","factor":"Zoom factor","zoomOut":"Zoom out"},"resourceInformation": {"options": {"wrapperTitle":"Resource Information","resourceQuicklinkEnhancements":"Link resource number to town hall / mines","directIncome": {"show":"Show the hourly income directly in town view","style": {"label":"Style of the hourly income in town view:","alignRight":"Right align","alignLeft":"Left align","withSeparation":"Right align with separation"}},"capacityBar": {"show":"Show info bar for warehouse capacity","hasBorder":"Has border","showBranchOfficeResources":"Show resources in trading post","orientation": {"label":"Orientation of the bar","vertical":"Vertical","horizontal":"Horizontal","horizontalFull":"Horizontal, full length"}}},"dailyProduction":"Daily production %$1:","dailyExpenses":"Daily expenses %$1:"},"highscore": {"options": {"showMemberInformation":"Enable the possibility to save highscore data of alliance members"},"memberInformation": {"show":"Alliance info","reset":"Reset","lastReset":"Time since the last reset: %$1","noReset":"No reset so far."}},"message": {"options": {"wrapperTitle":"Messages","replaceURL":"Make links in messages clickable","inlineMessage":"Embed the first few characters of each message in the messages overview","signature": {"use": {"description":"Use this signature:","none":"No signature","global":"Global signature","server":"Server signature","player":"Player signature"},"placementTop":"Insert signature above cited messages","global":"Global signature, which would be used on every world:","server":"Server signature, which only would be used on this world:","player":"Player signature, which only would be used for this player:"}},"replacedUrl": {"notification": {"header":"Attention!","text":"You're going to open the link %$1. This happens on your own risk. Proceed?"}}},"troopInformation": {"options": {"show":"Show troop info","linkBarrackShipyard":"Link barracks and shipyard from troop overview and dismiss units screen"},"link": {"gotoBarracks":"goto barracks","gotoShipyard":"goto shipyard"},"units": {"label":"Units in %$1","own":"Own units","friends":"Allied units","enemies":"Enemy units"},"ships": {"label":"Ships in %$1","own":"Own ships","friends":"Allied ships","enemies":"Enemy ships"},"button":"Troop information","header":"Troops in %$1","noTroops":"There are no troops in %$1"},"diverse": {"options": {"wrapperTitle":"Diverse"},"name": {"resource": {"gold":"Gold","wood":"Building Material","wine":"Wine","marble":"Marble","glass":"Crystal Glass","sulfur":"Sulphur"},"unit": {"swordsman":"Swordsman","phalanx":"Hoplite","archer":"Archer","marksman":"Sulphur Carabineer","mortar":"Mortar","slinger":"Slinger","catapult":"Catapult","ram":"Battering Ram","steamgiant":"Steam Giant","bombardier":"Balloon-Bombardier","cook":"Cook","medic":"Doctor","girocopter":"Gyrocopter","spearman":"Spearman","spartan":"Spartan"},"ship": {"ballista":"Ballista Ship","catapult":"Catapult Ship","flamethrower":"Fire Ship","mortar":"Mortar Ship","ram":"Ram Ship","steamboat":"Steam Ram","rocketship":"Rocket Ship","submarine":"Diving Boat","paddlespeedship":"Paddle Speedboat","ballooncarrier":"Balloon Carrier","tender":"Tender","transport":"Merchant Ship"}}}} },
		{ code: 'fr', translations: {"view": {"options": {"wrapperTitle": "","moveLoadingCircle": "","hideBirds": "","noVerticalCenterInTownAdvisor": ""}},"island": {"options": {"showColonizingCityInfo": ""}},"finance": {"options": {"showIncomeOnTop": "","shortUpkeepReductionTable": ""},"income": {"perHour": "","perDay": "","start": ""},"upkeep": {"reason": {"0": "","1": "","2": ""},"basic": "","supply": "","result": ""}},"missingResources": {"options": {"wrapperTitle": "","show": "","showPositive": "","showColoured": ""}},"tooltips": {"options": {"autoshow": "","showDirectInMilitaryAdvisor": ""}},"zoom": {"options": {"wrapperTitle": "","zoomView": "","factor": {"world": "","island": "","town": ""},"scaleChildren": {"label": "","world": "","island": "","town": ""},"accessKeyLabel": ""},"zoomIn": "","factor": "","zoomOut": ""},"resourceInformation": {"options": {"wrapperTitle": "","resourceQuicklinkEnhancements": "","directIncome": {"show": "","style": {"label": "","alignRight": "","alignLeft": "","withSeparation": ""}},"capacityBar": {"show": "","hasBorder": "","showBranchOfficeResources": "","orientation": {"label": "","vertical": "","horizontal": "","horizontalFull": ""}}},"dailyProduction": "","dailyExpenses": ""},"highscore": {"options": {"showMemberInformation": ""},"memberInformation": {"show": "","reset": "","lastReset": "","noReset": ""}},"message": {"options": {"wrapperTitle": "","replaceURL": "","inlineMessage": "","signature": {"use": {"description": "","none": "","global": "","server": "","player": ""},"placementTop": "","global": "","server": "","player": ""}},"replacedUrl": {"notification": {"header": "","text": ""}}},"troopInformation": {"options": {"show": "","linkBarrackShipyard": ""},"link": {"gotoBarracks": "","gotoShipyard": ""},"units": {"label": "","own": "","friends": "","enemies": ""},"ships": {"label": "","own": "","friends": "","enemies": ""},"button": "","header": "","noTroops": ""},"diverse": {"options": {"wrapperTitle": ""},"name": {"resource": {"gold": "","wood": "","wine": "","marble": "","glass": "","sulfur": ""},"unit": {"swordsman": "","phalanx": "","archer": "","marksman": "","mortar": "","slinger": "","catapult": "","ram": "","steamgiant": "","bombardier": "","cook": "","medic": "","girocopter": "","spearman": "","spartan": ""},"ship": {"ballista": "","catapult": "","flamethrower": "","mortar": "","ram": "","steamboat": "","rocketship": "","submarine": "","paddlespeedship": "","ballooncarrier": "","tender": "","transport": ""}}}} },
		{ code: 'it', translations: {"view": {"options": {"wrapperTitle": "","moveLoadingCircle": "","hideBirds": "","noVerticalCenterInTownAdvisor": ""}},"island": {"options": {"showColonizingCityInfo": ""}},"finance": {"options": {"showIncomeOnTop": "","shortUpkeepReductionTable": ""},"income": {"perHour": "","perDay": "","start": ""},"upkeep": {"reason": {"0": "","1": "","2": ""},"basic": "","supply": "","result": ""}},"missingResources": {"options": {"wrapperTitle": "","show": "","showPositive": "","showColoured": ""}},"tooltips": {"options": {"autoshow": "","showDirectInMilitaryAdvisor": ""}},"zoom": {"options": {"wrapperTitle": "","zoomView": "","factor": {"world": "","island": "","town": ""},"scaleChildren": {"label": "","world": "","island": "","town": ""},"accessKeyLabel": ""},"zoomIn": "","factor": "","zoomOut": ""},"resourceInformation": {"options": {"wrapperTitle": "","resourceQuicklinkEnhancements": "","directIncome": {"show": "","style": {"label": "","alignRight": "","alignLeft": "","withSeparation": ""}},"capacityBar": {"show": "","hasBorder": "","showBranchOfficeResources": "","orientation": {"label": "","vertical": "","horizontal": "","horizontalFull": ""}}},"dailyProduction": "","dailyExpenses": ""},"highscore": {"options": {"showMemberInformation": ""},"memberInformation": {"show": "","reset": "","lastReset": "","noReset": ""}},"message": {"options": {"wrapperTitle": "","replaceURL": "","inlineMessage": "","signature": {"use": {"description": "","none": "","global": "","server": "","player": ""},"placementTop": "","global": "","server": "","player": ""}},"replacedUrl": {"notification": {"header": "","text": ""}}},"troopInformation": {"options": {"show": "","linkBarrackShipyard": ""},"link": {"gotoBarracks": "","gotoShipyard": ""},"units": {"label": "","own": "","friends": "","enemies": ""},"ships": {"label": "","own": "","friends": "","enemies": ""},"button": "","header": "","noTroops": ""},"diverse": {"options": {"wrapperTitle": ""},"name": {"resource": {"gold": "","wood": "","wine": "","marble": "","glass": "","sulfur": ""},"unit": {"swordsman": "","phalanx": "","archer": "","marksman": "","mortar": "","slinger": "","catapult": "","ram": "","steamgiant": "","bombardier": "","cook": "","medic": "","girocopter": "","spearman": "","spartan": ""},"ship": {"ballista": "","catapult": "","flamethrower": "","mortar": "","ram": "","steamboat": "","rocketship": "","submarine": "","paddlespeedship": "","ballooncarrier": "","tender": "","transport": ""}}}} },
		{ code: 'lv', translations: {"view": {"options": {"wrapperTitle": "Skats","moveLoadingCircle": "Pārvietot uz augšējo joslu apli, kas parādās pie procesu apstrādes","hideBirds": "Paslēpt putnu baru","noVerticalCenterInTownAdvisor": "Necentrēt pilsētas informāciju pilsētas padomdevējā"}},"island": {"options": {"showColonizingCityInfo": "Rādīt informāciju par topošajām kolonijām"}},"finance": {"options": {"showIncomeOnTop": "Rādīt ienākumus bilances pārskata augšdaļā","shortUpkeepReductionTable": "Rādīt apgādes samazinājumu īso versiju"},"income": {"perHour": "Ienākumi stundā","perDay": "Ienākumi dienā","start": "Ienākumi bez samazinājumiem"},"upkeep": {"reason": {"0": "Kareivji","1": "Kara kuģi","2": "Kareivji & Kara kuģi"},"basic": "Pamata izmaksas","supply": "Apgādes izmaksas","result": "Kopējās izmaksas"}},"missingResources": {"options": {"wrapperTitle": "Informācija par resursiem","show": "Rādīt trūkstošos resursus celtniecības skatā","showPositive": "Rādīt atlikušos resursus arī pēc uzlabojuma","showColoured": "Rādīt atlikušos resursus ar izkrāsojumu"}},"tooltips": {"options": {"autoshow": "Rādīt uznirstošos lodziņus alianses biedru skatā un karaspēka padomdevējā automātiski","showDirectInMilitaryAdvisor": "Rādīt informāciju par kravu floti karaspēka pārskatā bez uznirstošajiem logiem"}},"zoom": {"options": {"wrapperTitle": "Zoom funkcija","zoomView": "Aktivizēt zoom funkciju pasaules skatā, salas skatā, pilsētas skatā","factor": {"world": "Zoom pasaules skatā:","island": "Zoom salas skatā:","town": "Zoom pilsētas skatā:"},"scaleChildren": {"label": "Atstāt banerus un simbolus normālā izmērā, kad izmanto zoom funkciju šajā skatā:","world": "Pasaules skats","island": "Salas skats","town": "Pilsētas skats"},"accessKeyLabel": "Lai veiktu zoom funkciju ar peli, ir jāpietur taustiņš:"},"zoomIn": "Samazināt","factor": "Mērogs","zoomOut": "Palielināt"},"resourceInformation": {"options": {"wrapperTitle": "Trūkstošie resursi","resourceQuicklinkEnhancements": "Saite no resursu daudzuma uz rātsnamu / raktuvēm","directIncome": {"show": "Rādīt ikstundas resursu produkciju pilsētas skatā","style": {"label": "Ik stundas ienākumu noformējums pilsētas skatā:","alignRight": "Centrēt pa labi","alignLeft": "Centrēt pa kreisi","withSeparation": "Centrēt pa labi ar sadalījumu"}},"capacityBar": {"show": "Rādīt informāciju par noliktavas ietilpību","hasBorder": "Ir rāmītis","showBranchOfficeResources": "Rādīt resursus tirgū","orientation": {"label": "Joslas novietojums","vertical": "Vertikāli","horizontal": "Horizontāli","horizontalFull": "Horizontāli, pilns garums"}}},"dailyProduction": "Ikdienas %$1 produkcija:","dailyExpenses": ""},"highscore": {"options": {"showMemberInformation": "Ieslēgt iespēju saglabāt TOP listes datus par alianses biedriem"},"memberInformation": {"show": "Alianses info","reset": "Notīrīt","lastReset": "Laiks kopš pēdējās notīrīšanas: %$1","noReset": "Pagaidām nav veikta tīrīšana."}},"message": {"options": {"wrapperTitle": "Vēstules","replaceURL": "Pārveidot saites vēstulēs klikšķināmas","inlineMessage": "","signature": {"use": {"description": "","none": "","global": "","server": "","player": ""},"placementTop": "Ievietot parakstu vēstulēs virs citātiem","global": "Globāls paraksts, kuru var lietot katrā serverī:","server": "","player": ""}},"replacedUrl": {"notification": {"header": "Uzmanību!","text": "Jūs grasāties atvērt saiti %$1. Tas notiek uz Jūsu paša atbildību. Turpināt?"}}},"troopInformation": {"options": {"show": "Rādīt informāciju par vienībām","linkBarrackShipyard": ""},"link": {"gotoBarracks": "","gotoShipyard": ""},"units": {"label": "Kareivji %$1","own": "Paša kareivji","friends": "Sabiedroto kareivji","enemies": "Ienaidnieku kareivji"},"ships": {"label": "Kara kuģi %$1","own": "Paša kuģi","friends": "Sabiedroto kuģi","enemies": "Ienaidnieku kuģi"},"button": "Informācija par vienībām","header": "Vienības %$1","noTroops": "Pašlaik nav vienību %$1"},"diverse": {"options": {"wrapperTitle": "Dažādi"},"name": {"resource": {"gold": "Zelts","wood": "Kokmateriāli","wine": "Vīns","marble": "Marmors","glass": "Kristāls","sulfur": "Sērs"},"unit": {"swordsman": "Paukotājs","phalanx": "Šķēpnesis","archer": "Lokšāvējs","marksman": "Šāvējs","mortar": "Mīnemtējs","slinger": "Metējs","catapult": "Katapulta","ram": "Tarāns","steamgiant": "Tvaika milzis","bombardier": "Balons bombardieris","cook": "Pavārs","medic": "Ārsts","girocopter": "Helikopters","spearman": "Pīķnesis","spartan": "Spartietis"},"ship": {"ballista": "Ballistiskais kugis","catapult": "Katapultas kuģis","flamethrower": "Ugunsmetējs","mortar": "Mīnmetēja kuģis","ram": "Tarāna kuģis","steamboat": "Dzenrata kuģis","rocketship": "Raķešu kuģis","submarine": "Zemūdene","paddlespeedship": "Tvaikonis","ballooncarrier": "Balonu bāzes kuģis","tender": "Atbalsta kuģis","transport": "Tirdzniecības kuģis"}}}} },
		{ code: 'ru', translations: {"view": {"options": {"wrapperTitle": "Обзор","moveLoadingCircle": "Переместить индикатор загрузки на строку навигации","hideBirds": "Не показывать пролетающих птиц","noVerticalCenterInTownAdvisor": "Не центровать информацию о городе в окне городского советника"}},"island": {"options": {"showColonizingCityInfo": "Показать информацию о колонизации городов"}},"finance": {"options": {"showIncomeOnTop": "Показать доходы вверху окна просмотра баланса","shortUpkeepReductionTable": "Показать краткий вариант экономии содержания"},"income": {"perHour": "Доход в час","perDay": "Доход в день","start": "Доход без скидок"},"upkeep": {"reason": {"0": "Войска","1": "Флоты","2": "Войска & Флоты"},"basic": "Базовое снабжение войск","supply": "Снабжение войск в походе","result": "Всего"}},"missingResources": {"options": {"wrapperTitle": "Недостающие ресурсы","show": "Показать недостающие ресурсы в окне строительстве","showPositive": "Показывать ресурсы, которые останутся после запуска строительства","showColoured": "Выделять цветом остаток ресурсов"}},"tooltips": {"options": {"autoshow": "Автоматически показывать подсказки в обзоре членов альянса и окне военного советника","showDirectInMilitaryAdvisor": "Показать информацию о грузе / флотов в окне военного советника"}},"zoom": {"options": {"wrapperTitle": "Функция масштабирования","zoomView": "Активировать увеличение в обзоре мира, острова, города","factor": {"world": "Увеличить карту мира:","island": "Увеличить карту острова:","town": "Увеличить обзор города:"},"scaleChildren": {"label": "Не изменять размер букв и символов при масштабировании:","world": "Карты мира","island": "Обзор острова","town": "Обзора города"},"accessKeyLabel": "Это клавиши нужно нажимать, чтобы изменить масштаб с помощью мыши:"},"zoomIn": "Увеличить","factor": "Коэффициент увеличения","zoomOut": "Уменьшить"},"resourceInformation": {"options": {"wrapperTitle": "Информация о ресурсах","resourceQuicklinkEnhancements": "Интерактивные значки ресурсов и населения с посыланиями на шахты и ратушу","directIncome": {"show": "Показать почасовую прибыль непосредственно в обзоре города","style": {"label": "Представление доходов в обзоре города:","alignRight": "выравнивать по правому краю","alignLeft": "выравнивать по левому краю","withSeparation": "выравнивать по правому краю с  с разделителем"}},"capacityBar": {"show": "Показать информационную строку для складских площадей","hasBorder": "Имеет границы","showBranchOfficeResources": "Показывать ресурсы в торговом посту","orientation": {"label": "Ориентация бара","vertical": "Вертикальный","horizontal": "Горизонтальный","horizontalFull": "Горизонтальный, полная длина"}}},"dailyProduction": "Ежедневное производство %$1:","dailyExpenses": "Ежедневные расходы %$1:"},"highscore": {"options": {"showMemberInformation": "Включить возможность сохранения информации о рекордах членов альянса"},"memberInformation": {"show": "Информация о альянсе","reset": "Сброс","lastReset": "Время с момента последнего сброса: %$1","noReset": "Повременить со сбросом."}},"message": {"options": {"wrapperTitle": "Сообщения","replaceURL": "Сделать ссылки в сообщениях интерактивными","inlineMessage": "Показывать первые несколько символов каждого сообщения в обзоре сообщений","signature": {"use": {"description": "Использовать следующую подпись:","none": "Без подписи","global": "Глобальная подпись","server": "Серверная подпись","player": "Подпись игрока"},"placementTop": "Ставить подпись више цитаты","global": "Глобальная подпись, которую можно использован в каждом мире:","server": "Серверная подпись, будет использована только в этом мире: ","player": "Подпись игрока, будет использована только для этого игрока:"}},"replacedUrl": {"notification": {"header": "Внимание!","text": "Вы собираетесь открыть ссылку %$1. Вы делаете это на свой ​​страх и риск. Продолжать?"}}},"troopInformation": {"options": {"show": "Показать информацию о войсках","linkBarrackShipyard": "Добавить ссылки на переход в казарму и верфь в окне обзора войск и окне исчезнувших войск"},"link": {"gotoBarracks": "перейти в казарму","gotoShipyard": "перейти в верфь"},"units": {"label": "Количество %$1","own": "Собственные подразделения","friends": "Подразделения союзников","enemies": "Вражеские подразделения"},"ships": {"label": "Флоты %$1","own": "Собственные флоты","friends": "Флоты союзников","enemies": "Вражеские флоты"},"button": "Информация о войсках","header": "Войска %$1","noTroops": "Нет войск в %$1"},"diverse": {"options": {"wrapperTitle": "Другое"},"name": {"resource": {"gold": "Золото","wood": "Строительные материалы","wine": "Виноград","marble": "Мрамор","glass": "Хрусталь","sulfur": "Сера"},"unit": {"swordsman": "Мечник","phalanx": "Гоплит","archer": "Лучник","marksman": "Стрелок","mortar": "Мортира","slinger": "Пращник","catapult": "Катапульта","ram": "Таран","steamgiant": "Паровой гигант","bombardier": "Бомбардировщик","cook": "Повар","medic": "Доктор","girocopter": "Гирокоптер","spearman": "Копейщик","spartan": "Спартанец"},"ship": {"ballista": "Корабль с баллистой","catapult": "Корабль с катапультой","flamethrower": "Огнеметный корабль","mortar": "Корабль с мортирой","ram": "Корабль с тараном","steamboat": "Паровой таран","rocketship": "Ракетоносец","submarine": "Подводная лодка","paddlespeedship": "Пароход","ballooncarrier": "Авианосец","tender": "Плавучая база","transport": "Торговое судно"}}}} },
		{ code: 'tr', translations: {"view": {"options": {"wrapperTitle": "Görüntüle","moveLoadingCircle": "Yüklenme dairesini pozisyon barına sürükle","hideBirds": "","noVerticalCenterInTownAdvisor": ""}},"island": {"options": {"showColonizingCityInfo": "Şehirleri kolonileştirme hakkında bilgi göster"}},"finance": {"options": {"showIncomeOnTop": "","shortUpkeepReductionTable": ""},"income": {"perHour": "Saat başına düşen gelir","perDay": "Gün başına düşen gelir","start": ""},"upkeep": {"reason": {"0": "Birlikler","1": "Gemiler","2": "Birlikler & Gemiler"},"basic": "","supply": "","result": "Toplam Maaliyet"}},"missingResources": {"options": {"wrapperTitle": "Eksik Kaynaklar","show": "","showPositive": "","showColoured": ""}},"tooltips": {"options": {"autoshow": "","showDirectInMilitaryAdvisor": ""}},"zoom": {"options": {"wrapperTitle": "","zoomView": "","factor": {"world": "Dünya haritasını yakınlaştır:","island": "Ada görünümüne yakınlaştır:","town": "Köy görünümüne yakınlaştır:"},"scaleChildren": {"label": "","world": "Dünya haritası","island": "Ada görünümü","town": ""},"accessKeyLabel": ""},"zoomIn": "Yakınlaştır","factor": "","zoomOut": "Uzaklaştır"},"resourceInformation": {"options": {"wrapperTitle": "Kaynak Bilgisi","resourceQuicklinkEnhancements": "","directIncome": {"show": "","style": {"label": "","alignRight": "","alignLeft": "","withSeparation": ""}},"capacityBar": {"show": "","hasBorder": "","showBranchOfficeResources": "","orientation": {"label": "","vertical": "","horizontal": "","horizontalFull": ""}}},"dailyProduction": "","dailyExpenses": ""},"highscore": {"options": {"showMemberInformation": ""},"memberInformation": {"show": "","reset": "","lastReset": "","noReset": ""}},"message": {"options": {"wrapperTitle": "Mesajlar","replaceURL": "","inlineMessage": "","signature": {"use": {"description": "","none": "İmza yok","global": "","server": "","player": ""},"placementTop": "","global": "","server": "","player": ""}},"replacedUrl": {"notification": {"header": "Dikkat!","text": ""}}},"troopInformation": {"options": {"show": "Birlik bilgisini göster","linkBarrackShipyard": ""},"link": {"gotoBarracks": "","gotoShipyard": ""},"units": {"label": "","own": "","friends": "","enemies": ""},"ships": {"label": "","own": "","friends": "","enemies": "Düşman gemileri"},"button": "Birlik bilgileri","header": "","noTroops": ""},"diverse": {"options": {"wrapperTitle": ""},"name": {"resource": {"gold": "Altın","wood": "İnşaa Malzemeleri","wine": "Şarap","marble": "","glass": "Kristal Bardak","sulfur": "Sülfür"},"unit": {"swordsman": "Kılıç ustası","phalanx": "","archer": "Okçu","marksman": "","mortar": "Havan","slinger": "","catapult": "Mancınık","ram": "","steamgiant": "","bombardier": "","cook": "Pişir","medic": "Doktor Who?","girocopter": "","spearman": "Mızrakçı","spartan": "Spartalı"},"ship": {"ballista": "","catapult": "Mancınık Gemisi","flamethrower": "Ateş Gemisi","mortar": "Havan Gemisi","ram": "","steamboat": "","rocketship": "","submarine": "Dalış Botu","paddlespeedship": "","ballooncarrier": "","tender": "İhale","transport": ""}}}} }
	];
	for(var i = 0; i < la_language.length; i++) {
		await IC.Language.addLanguageText(la_language[i].code, la_language[i].translations);
	}
	
	// Instantiate the ui script.
	setTimeout(function() { new EnhancedUI(IC); }, 100);
}

// Call the main function of the script.
setTimeout(main, 0);