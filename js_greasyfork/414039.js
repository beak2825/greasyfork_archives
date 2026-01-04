// ==UserScript==
// @name          WaniKani Open Framework Html Test Set
// @namespace     https://www.wanikani.com
// @description   Testing Set for the WaniKani Open Framework Html Type
// @author        prouleau
// @version       0.0.1
// @include       https://www.wanikani.com/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/414039/WaniKani%20Open%20Framework%20Html%20Test%20Set.user.js
// @updateURL https://update.greasyfork.org/scripts/414039/WaniKani%20Open%20Framework%20Html%20Test%20Set.meta.js
// ==/UserScript==

(function(wkof) {
	'use strict';

	var wkofMinimumVersion = '1.0.52';

	if (!wkof) {
		var response = confirm('WaniKani Open Framework Date Filters requires WaniKani Open Framework.\n Click "OK" to be forwarded to installation instructions.');

		if (response) {
			window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
		}

		return;
	}
	var htmlTestSetDialog = false;
	var htmlTestSetScriptId = 'htmlTestSet';
	var htmlTestSetTitle = 'Html Test Set';

	var needToRegisterFilters = true;

	var filterNamePrefix = 'htmlTestSet_';
	var baseTestsFilterName = filterNamePrefix + 'baseTests';
    var pathTestsFilterName = filterNamePrefix + 'pathTests';
    var defaultTestsFilterName = filterNamePrefix + 'defaultTests';
    var callbackTestsFilterName = filterNamePrefix + 'callbackTests';
    var filterTestsFilterName = filterNamePrefix + 'filterTests';
    var filterTestsBFilterName = filterNamePrefix + 'filterTestsB';
    var filterItemListFilterName = filterNamePrefix + 'filterItemList';


	var supportedFilters = [baseTestsFilterName, pathTestsFilterName, defaultTestsFilterName, callbackTestsFilterName, filterTestsFilterName, filterTestsBFilterName,
                           filterItemListFilterName, ];

	function updateFiltersWhenReady() {
		needToRegisterFilters = true;
		waitForItemDataRegistry().then(registerFilters);
	}

	function waitForItemDataRegistry() {
		return wkof.wait_state('wkof.ItemData.registry', 'ready');
	}

	function registerFilters() {
		if (!needToRegisterFilters) {
			return;
		}

		supportedFilters.forEach(function(filterName) {
			delete wkof.ItemData.registry.sources.wk_items.filters[filterName];
		});

		registerBaseTestsFilter();
		registerPathTestsFilter();
		registerDefaultTestsFilter();
		registerCallbackTestsFilter();
		registerFilterTestsFilter();
		registerFilterTestsBFilter();
		registerItemListFilter();

		needToRegisterFilters = false;
	}
	function promise(){var a,b,c=new Promise(function(d,e){a=d;b=e;});c.resolve=a;c.reject=b;return c;};

    var htmlTestSetLoadedPromise = promise();

    wkof.include('Menu, Settings');

    wkof.ready('Menu').then(installMenu);

	function installMenu() {
		loadDialog().then(function() {
			addMenuItem();
		});
	}

	function addMenuItem() {
		wkof.Menu.insert_script_link({
			script_id: htmlTestSetScriptId,
            name: htmlTestSetScriptId,
			submenu: 'Open',
			title: htmlTestSetTitle,
			on_click: function() { htmlTestSetDialog.open(); }
		});
	}

	function installdialog() {
		wkof.ItemData.pause_ready_event(true);

		loadDialog().then(function() {
			wkof.ItemData.pause_ready_event(false);
		});
	}

    let defaultValue = JSON.stringify({});

    //=========================================
    // HTML for the html and css tests
    //=========================================

    let htmlBaseTest = '<p class="html_spaced">This is testing the integration of html element into the dialog. The goal is to verify the html '+
                            'inserts well without breaking the overall layout.</p></br>'+
                       '<p class="html_spaced">There are generic classes '+
                            'for styling the html element in the general look and feel of the settings dialog. They handle the most common '+
                            'situations. The programmer is free to add more styling classes or use a completely different styling should the need arises.</p><br>'+
                      '<p class="html_spaced">You may verify that everything resizes well and that narrow mode is properly handled.</p><br>'+
                      '<p class="html_spaced">There is no tagging of the settings. Trying to change them and storing the data will have no effect. '+
                            'This is purely a html and css test.</p><br>'+
                      '<p class="html_spaced">This test is available as a filter. In this case there is no filtering done. The goal is to verify there '+
                            'is no conflict with the particular css used in the context of a filter.</p><br>'+

                      '<p class="html_spaced"><b>Classes for styling full width elements</b></p><br>'+
                      '<p class="html_spaced">We can place items in a class <code>html_tigth</code> to have little spacing vertically.</p>'+
                      '<p class="html_spaced">We can place items in a div with class <code>html_spaced</code> to have more spacing vertically.</p>'+
                      '<p class="html_spaced">Both classes cause the element to occupy the full width of the enclosing div.</p><br>'+

                      '<p class="html_spaced">If a <code>html_tight</code> element is immediately followed by a <code>html_spaced</code> element the two are '+
                            'visually grouped by spacing.</p>'+
                      '<label class="html_tight">Text input</label>'+
                      '<input class="html_spaced" type="text">'+
                      '<label class="html_tight">Number input</label>'+
                      '<input class="html_spaced" type="number">'+
                      '<label class="html_tight">Color</label>'+
                      '<input class="html_spaced" type="color">'+
                      '<label class="html_tight">Dropdown</label>'+
                      '<select class="html_spaced">'+
                          '<option>option 1</option>'+
                          '<option>option 2</option>'+
                          '<option>option 3</option>'+
                      '</select>'+
                      '<label class="html_tight">List</label>'+
                      '<select class="html_spaced" size="3">'+
                          '<option>option 1</option>'+
                          '<option>option 2</option>'+
                          '<option>option 3</option>'+
                          '<option>option 4</option>'+
                          '<option>option 5</option>'+
                      '</select>'+
                      '<label class="html_tight">Multi</label>'+
                      '<select class="html_spaced" multiple size="4">'+
                          '<option>option 1</option>'+
                          '<option>option 2</option>'+
                          '<option>option 3</option>'+
                          '<option>option 4</option>'+
                          '<option>option 5</option>'+
                          '<option>option 6</option>'+
                          '<option>option 7</option>'+
                      '</select>'+
                      '<label class="html_tight">Textarea.</label>'+
                      '<textarea class="html_spaced" rows="7"></textarea>'+
                      '<label class="html_tight">HTML5 date picker.</label>'+
                      '<input class="html_spaced" type="date">'+
                      '<label class="html_tight">HTML5 datetime picker.</label>'+
                      '<input class="html_spaced" type="datetime-local">'+
                      '<label class="html_tight">HTML5 time picker.</label>'+
                      '<input class="html_spaced" type="time">'+

                      '<br><p class="html_spaced"><b>Classes for styling left-right combo</b></p><br>'+
                      '<p class="html_spaced">We can use a pair of div element to create a left-rigth combination. The left element'+
                           'must have class <code>html_left</code> and the right element must have class <code>html_right</code>. The whole combo must be wrapped in '+
                            'a div with class <code>html_row</code>.</p>'+
                      '<div class="html_row">'+
                          '<div class="html_left"><label>Checkbox</label></div>'+
                          '<div class="html_right"><input type="checkbox"></div>'+
                      '</div>'+
                      '<div class="html_row">'+
                          '<div class="html_left"><label>Text Input</label></div>'+
                          '<div class="html_right"><input type="text"></div>'+
                      '</div>'+
                      '<div class="html_row">'+
                          '<div class="html_left"><label>Numeric Input</label></div>'+
                          '<div class="html_right"><input type="number"></div>'+
                      '</div>'+
                      '<div class="html_row">'+
                          '<div class="html_left"><label>Color</label></div>'+
                          '<div class="html_right"><input type="color"></div>'+
                      '</div>'+
                      '<div class="html_row">'+
                          '<div class="html_left"><label>Dropdown</label></div>'+
                          '<div class="html_right">'+
                              '<select>'+
                                  '<option>option 1</option>'+
                                  '<option>option 2</option>'+
                                  '<option>option 3</option>'+
                              '</select>'+
                          '</div>'+
                      '</div>'+
                      '<div class="html_row">'+
                          '<div class="html_left"><label>Multi</label></div>'+
                          '<div class="html_right">'+
                              '<select multiple size="4">'+
                                  '<option>option 1</option>'+
                                  '<option>option 2</option>'+
                                  '<option>option 3</option>'+
                                  '<option>option 4</option>'+
                                  '<option>option 5</option>'+
                                  '<option>option 6</option>'+
                                  '<option>option 7</option>'+
                              '</select>'+
                          '</div>'+
                      '</div>'+
                      '<br><p class="html_spaced"><b>Columns</b></p><br>'+
                      '<p class="html_spaced">If two div are given the classes <code>html_column_left</code> and <code>html_column_right</code> a two '+
                            'columns layout is created. Headers are styled with <code>html_header</code></p><br>'+
                      '<div class="html_column_left">'+
                          '<label class="html_header">Left Column Header</label>'+
                          '<label class="html_tight">Text input</label>'+
                          '<input class="html_spaced" type="text">'+
                          '<label class="html_tight">Number input</label>'+
                          '<input class="html_spaced" type="number">'+
                          '<label class="html_tight">Color</label>'+
                          '<input class="html_spaced" type="color">'+
                          '<div class="html_row">'+
                              '<div class="html_left"><label>Dropdown</label></div>'+
                              '<div class="html_right">'+
                                  '<select>'+
                                      '<option>option 1</option>'+
                                      '<option>option 2</option>'+
                                      '<option>option 3</option>'+
                                  '</select>'+
                              '</div>'+
                          '</div>'+
                          '<div class="html_row">'+
                              '<div class="html_left"><label>Multi</label></div>'+
                              '<div class="html_right">'+
                                  '<select multiple size="4">'+
                                      '<option>option 1</option>'+
                                      '<option>option 2</option>'+
                                      '<option>option 3</option>'+
                                      '<option>option 4</option>'+
                                      '<option>option 5</option>'+
                                      '<option>option 6</option>'+
                                      '<option>option 7</option>'+
                                  '</select>'+
                              '</div>'+
                          '</div>'+
                      '</div>'+
                      '<div class="html_column_right">'+
                          '<label class="html_header">Right Column Header</label>'+
                          '<div class="html_row">'+
                              '<div class="html_left"><label>Checkbox</label></div>'+
                              '<div class="html_right"><input type="checkbox"></div>'+
                          '</div>'+
                          '<div class="html_row">'+
                              '<div class="html_left"><label>Text Input</label></div>'+
                              '<div class="html_right"><input type="text"></div>'+
                          '</div>'+
                          '<div class="html_row">'+
                              '<div class="html_left"><label>Numeric Input</label></div>'+
                              '<div class="html_right"><input type="number"></div>'+
                          '</div>'+
                          '<div class="html_row">'+
                              '<div class="html_left"><label>Color</label></div>'+
                              '<div class="html_right"><input type="color"></div>'+
                          '</div>'+
                          '<label class="html_tight">Dropdown</label>'+
                          '<select class="html_spaced">'+
                              '<option>option 1</option>'+
                              '<option>option 2</option>'+
                              '<option>option 3</option>'+
                          '</select>'+
                          '<label class="html_tight">Multi</label>'+
                          '<select class="html_spaced" multiple size="4">'+
                              '<option>option 1</option>'+
                              '<option>option 2</option>'+
                              '<option>option 3</option>'+
                              '<option>option 4</option>'+
                              '<option>option 5</option>'+
                              '<option>option 6</option>'+
                              '<option>option 7</option>'+
                          '</select>'+
                      '</div>'+

                      '<br><p class="html_spaced"><b>Grouping</b></p><br>'+
                      '<p class="html_spaced">If elements are inserted in a div of class <code>html_shaded</code> '+
                            'a box is created that visually group them together.</p><br>'+
                      '<div class="html_row">'+
                          '<div class="html_left"><label>Text Input</label></div>'+
                          '<div class="html_right"><input type="text"></div>'+
                      '</div>'+
                      '<div class="html_row">'+
                          '<div class="html_left"><label>Numeric Input</label></div>'+
                          '<div class="html_right"><input type="number"></div>'+
                      '</div>'+
                      '<div class="html_shaded">'+
                          '<label class="html_tight">Text input</label>'+
                          '<input class="html_spaced" type="text">'+
                          '<label class="html_tight">Number input</label>'+
                          '<input class="html_spaced" type="number">'+
                          '<div class="html_row">'+
                              '<div class="html_left"><label>Dropdown</label></div>'+
                              '<div class="html_right">'+
                                  '<select>'+
                                      '<option>option 1</option>'+
                                      '<option>option 2</option>'+
                                      '<option>option 3</option>'+
                                  '</select>'+
                              '</div>'+
                          '</div>'+
                          '<div class="html_row">'+
                              '<div class="html_left"><label>Multi</label></div>'+
                              '<div class="html_right">'+
                                  '<select multiple size="4">'+
                                      '<option>option 1</option>'+
                                      '<option>option 2</option>'+
                                      '<option>option 3</option>'+
                                      '<option>option 4</option>'+
                                      '<option>option 5</option>'+
                                      '<option>option 6</option>'+
                                      '<option>option 7</option>'+
                                  '</select>'+
                              '</div>'+
                          '</div>'+
                       '</div>'+
                       '<br><br><p class="html_spaced">This works within columns too.</p><br>'+
                       '<div class="html_column_left">'+
                          '<label class="html_header">Left Column Header</label>'+
                          '<div class="html_shaded">'+
                              '<label class="html_tight">Text input</label>'+
                              '<input class="html_spaced" type="text">'+
                              '<label class="html_tight">Number input</label>'+
                              '<input class="html_spaced" type="number">'+
                              '<label class="html_tight">Color</label>'+
                              '<input class="html_spaced" type="color">'+
                          '</div>'+
                          '<div class="html_row">'+
                              '<div class="html_left"><label>Multi</label></div>'+
                              '<div class="html_right">'+
                                  '<select multiple size="4">'+
                                      '<option>option 1</option>'+
                                      '<option>option 2</option>'+
                                      '<option>option 3</option>'+
                                      '<option>option 4</option>'+
                                      '<option>option 5</option>'+
                                      '<option>option 6</option>'+
                                      '<option>option 7</option>'+
                                  '</select>'+
                              '</div>'+
                          '</div>'+
                      '</div>'+
                      '<div class="html_column_right">'+
                          '<label class="html_header">Right Column Header</label>'+
                          '<div class="html_row">'+
                              '<div class="html_left"><label>Checkbox</label></div>'+
                              '<div class="html_right"><input type="checkbox"></div>'+
                          '</div>'+
                          '<div class="html_row">'+
                              '<div class="html_left"><label>Text Input</label></div>'+
                              '<div class="html_right"><input type="text"></div>'+
                          '</div>'+
                          '<div class="html_shaded">'+
                              '<div class="html_row">'+
                                  '<div class="html_left"><label>Numeric Input</label></div>'+
                                  '<div class="html_right"><input type="number"></div>'+
                              '</div>'+
                              '<div class="html_row">'+
                                  '<div class="html_left"><label>Color</label></div>'+
                                  '<div class="html_right"><input type="color"></div>'+
                              '</div>'+
                              '<div class="html_row">'+
                                  '<div class="html_left"><label>Dropdown</label></div>'+
                                  '<div class="html_right">'+
                                      '<select>'+
                                          '<option>option 1</option>'+
                                          '<option>option 2</option>'+
                                          '<option>option 3</option>'+
                                      '</select>'+
                                  '</div>'+
                              '</div>'+
                          '</div>'+
                          '<label class="html_tight">Dropdown</label>'+
                          '<select class="html_spaced">'+
                              '<option>option 1</option>'+
                              '<option>option 2</option>'+
                              '<option>option 3</option>'+
                          '</select>'+
                          '<label class="html_tight" title="You need to hold control\nfor multiple selections.">Multi</label>'+
                          '<select class="html_spaced" multiple size="4">'+
                              '<option>option 1</option>'+
                              '<option>option 2</option>'+
                              '<option>option 3</option>'+
                              '<option>option 4</option>'+
                              '<option>option 5</option>'+
                              '<option>option 6</option>'+
                              '<option>option 7</option>'+
                          '</select>'+
                      '</div>'+

                      '<br><p class="html_spaced">If <code>html_shaded</code> is applied to a column the whole column gets shaded.</p><br>'+
                      '<div class="html_column_left html_shaded">'+
                          '<label class="html_header">Left Column Header</label>'+
                          '<label class="html_tight">Text input</label>'+
                          '<input class="html_spaced" type="text">'+
                          '<label class="html_tight">Number input</label>'+
                          '<input class="html_spaced" type="number">'+
                          '<label class="html_tight">Color</label>'+
                          '<input class="html_spaced" type="color">'+
                          '<div class="html_row">'+
                              '<div class="html_left"><label>Color</label></div>'+
                              '<div class="html_right"><input type="color"></div>'+
                          '</div>'+
                          '<div class="html_row">'+
                              '<div class="html_left"><label>Dropdown</label></div>'+
                              '<div class="html_right">'+
                                  '<select>'+
                                      '<option>option 1</option>'+
                                      '<option>option 2</option>'+
                                      '<option>option 3</option>'+
                                  '</select>'+
                              '</div>'+
                          '</div>'+
                      '</div>'+
                      '<div class="html_column_right html_shaded">'+
                          '<label class="html_header">Right Column Header</label>'+
                          '<div class="html_row">'+
                              '<div class="html_left"><label>Checkbox</label></div>'+
                              '<div class="html_right"><input type="checkbox"></div>'+
                          '</div>'+
                          '<div class="html_row">'+
                              '<div class="html_left"><label>Text Input</label></div>'+
                              '<div class="html_right"><input type="text"></div>'+
                          '</div>'+
                          '<div class="html_row">'+
                              '<div class="html_left"><label>Numeric Input</label></div>'+
                              '<div class="html_right"><input type="number"></div>'+
                          '</div>'+
                          '<div class="html_row">'+
                              '<div class="html_left"><label>Multi</label></div>'+
                              '<div class="html_right">'+
                                  '<select multiple size="4">'+
                                      '<option>option 1</option>'+
                                      '<option>option 2</option>'+
                                      '<option>option 3</option>'+
                                      '<option>option 4</option>'+
                                      '<option>option 5</option>'+
                                      '<option>option 6</option>'+
                                      '<option>option 7</option>'+
                                  '</select>'+
                              '</div>'+
                          '</div>'+
                          '<label class="html_tight">Dropdown</label>'+
                          '<select class="html_spaced">'+
                              '<option>option 1</option>'+
                              '<option>option 2</option>'+
                              '<option>option 3</option>'+
                          '</select>'+
                          '<label class="html_tight" title="You need to hold control\nfor multiple selections.">Multi</label>'+
                          '<select class="html_spaced" multiple size="4">'+
                              '<option>option 1</option>'+
                              '<option>option 2</option>'+
                              '<option>option 3</option>'+
                              '<option>option 4</option>'+
                              '<option>option 5</option>'+
                              '<option>option 6</option>'+
                              '<option>option 7</option>'+
                          '</select>'+
                      '</div>';



    //=========================================
    // HTML for the visual test
    //=========================================

    let htmlVisualTestPreamble = ''+
                      '<p class="html_spaced">This is a test for verifying how the inserted html blends visually with the framework built-in elements '+
                             'when both are used in the same dialog. The goal is to make sure everything looks pretty and clean when using the styling '+
                             'classes discussed in the HTML and CSS test.<p><br>'+
                             'The configuration for the html element allows a <code>shade</code> flag. When set to true the html will be styled to '+
                             'set it apart from individual settings. The test cover both cases where this flag is used and not used. '+
                             'There is also one instance where there is no label for the inserted html.</p><br>';

    let htmlVisualTestHtmlA = ''+
                      '<label class="html_tight">HTML Inserted Textarea - shade flag not used</label>'+
                      '<textarea class="html_spaced" rows="7"></textarea>';

    let htmlVisualTestHtmlA1 = ''+
                      '<label class="html_tight">HTML Inserted Textarea - shade flag and label not used</label>'+
                      '<textarea class="html_spaced" rows="7"></textarea>';

    let htmlVisualTestHtmlB = ''+
                      '<div class="html_column_left">'+
                          '<label class="html_tight">Dropdown</label>'+
                          '<select class="html_spaced">'+
                              '<option>option 1</option>'+
                              '<option>option 2</option>'+
                              '<option>option 3</option>'+
                          '</select>'+
                          '<label class="html_tight">List</label>'+
                          '<select class="html_spaced" size="3">'+
                              '<option>option 1</option>'+
                              '<option>option 2</option>'+
                              '<option>option 3</option>'+
                              '<option>option 4</option>'+
                              '<option>option 5</option>'+
                          '</select>'+
                       '</div>'+
                      '<div class="html_column_right">'+
                          '<div class="html_row">'+
                              '<label class="html_left">Text input</label>'+
                              '<input class="html_right" type="text">'+
                          '</div>'+
                          '<div class="html_row">'+
                              '<label class="html_left">Number input</label>'+
                              '<input class="html_right" type="number">'+
                          '</div>'+
                      '</div>';

    let htmlVisualTestHtmlC = ''+
                      '<div class="html_column_left html_shaded">'+
                          '<label class="html_tight">Dropdown</label>'+
                          '<select class="html_spaced">'+
                              '<option>option 1</option>'+
                              '<option>option 2</option>'+
                              '<option>option 3</option>'+
                          '</select>'+
                          '<label class="html_tight">List</label>'+
                          '<select class="html_spaced" size="3">'+
                              '<option>option 1</option>'+
                              '<option>option 2</option>'+
                              '<option>option 3</option>'+
                              '<option>option 4</option>'+
                              '<option>option 5</option>'+
                          '</select>'+
                       '</div>'+
                      '<div class="html_column_right html_shaded">'+
                          '<div class="html_row">'+
                              '<label class="html_left">Text input</label>'+
                              '<input class="html_right" type="text">'+
                          '</div>'+
                          '<div class="html_row">'+
                              '<label class="html_left">Number input</label>'+
                              '<input class="html_right" type="number">'+
                          '</div>'+
                      '</div>';

    //=========================================
    // HTML for the tag test
    //=========================================

    let htmlTagTestPreamble = ''+
                      '<p class="html_spaced">This is a test for the tagging of html elements to cause the settings to be stored at the proper location '+
                             'in <code>wkof.settings[script_id]</code>. There is a mix and match of html elements and other '+
                             'framework elements to validate they don\'t interfere with each other. You may verify that you can change settings, '+
                             'save them and get them back when you reopen the dialog.</p><br>';

    let htmlTagTestHtml = ''+
                      '<p class="html_spaced">Testing all the input types.</p>'+
                      '<div class="html_row">'+
                          '<div class="html_left"><label for="htmlTestSet_no0">Checkbox input no 0</label></div>'+
                          '<div class="html_right"><input id="htmlTestSet_no0" class="setting" name="no0" type="checkbox"></div>'+
                      '</div>'+
                      '<div class="html_row">'+
                          '<label class="html_left" for="htmlTestSet_no1">Text input no 1</label>'+
                          '<input id="htmlTestSet_no1" class="html_right setting" name="no1" type="text">'+
                      '</div>'+
                      '<div class="html_row">'+
                          '<label class="html_left" for="htmlTestSet_no2">Number input no 2</label>'+
                          '<input id="htmlTestSet_no2" class="html_right setting" name="no2" type="number">'+
                      '</div>'+
                      '<div class="html_row">'+
                          '<label class="html_left" for="htmlTestSet_no3">Color no 3</label>'+
                          '<input id="htmlTestSet_no3" class="html_right setting" name="no3" type="color">'+
                      '</div>'+
                      '<label class="html_tight" for="htmlTestSet_no4">Dropdown no 4</label>'+
                      '<select id="htmlTestSet_no4" class="html_spaced setting" name="no4">'+
                          '<option name="option1">option 1</option>'+
                          '<option name="option2">option 2</option>'+
                          '<option name="option3">option 3</option>'+
                      '</select>'+
                      '<label class="html_tight" for="htmlTestSet_no5">List no 5</label>'+
                      '<select id="htmlTestSet_no5" class="html_spaced setting" name="no5" size="3">'+
                          '<option name="option1">option 1</option>'+
                          '<option name="option2">option 2</option>'+
                          '<option name="option3">option 3</option>'+
                          '<option name="option4">option 4</option>'+
                          '<option name="option5">option 5</option>'+
                      '</select>'+
                      '<label class="html_tight" for="htmlTestSet_no6">Multi no 6</label>'+
                      '<select id="htmlTestSet_no6" class="html_spaced setting" name="no6" multiple size="4">'+
                          '<option name="option1">option 1</option>'+
                          '<option name="option2">option 2</option>'+
                          '<option name="option3">option 3</option>'+
                          '<option name="option4">option 4</option>'+
                          '<option name="option5">option 5</option>'+
                          '<option name="option6">option 6</option>'+
                          '<option name="option7">option 7</option>'+
                      '</select>'+
                      '<label class="html_tight" for="htmlTestSet_no7">Textarea no 7</label>'+
                      '<textarea id="htmlTestSet_no7" class="html_spaced setting" name="no7" rows="7"></textarea>'+
                      '<div class="html_shaded">'+
                          '<div class="html_row">'+
                              '<label class="html_tight" for="htmlTestSet_no8">HTML5 date picker no 8.</label>'+
                              '<input id="htmlTestSet_no8" class="html_spaced setting" name="no8" type="date">'+
                          '</div>'+
                          '<div class="html_row">'+
                              '<label class="html_tight" for="htmlTestSet_no9">HTML5 datetime picker no9.</label>'+
                              '<input id="htmlTestSet_no9" class="html_spaced setting" name="no9" type="datetime-local">'+
                          '</div>'+
                          '<div class="html_row">'+
                              '<label class="html_tight" for="htmlTestSet_no10">HTML5 time picker.</label>'+
                              '<input id="htmlTestSet_no10" class="html_spaced setting" name="no10" type="time">'+
                          '</div>'+
                      '</div>';

    //=========================================
    // HTML for the path test
    //=========================================

    let htmlPathTest = ''+
                      '<p class="html_spaced">This is a test for the tagging of html elements to cause the settings to be stored at the proper location '+
                             'in <code>wkof.settings[script_id]</code>. This test is meant to be called from a filter. In this case the settings must be '+
                             'stored in the proper preset '+
                             'of Item Inspector and Self Study Quiz as indicated by the path location. You may verify this is done correctly. No filtering '+
                             'is done because this is not the purpose of the test.</p><br>'+

                      '<p class="html_spaced">Testing all the input types.</p>'+
                      '<div class="html_row">'+
                          '<div class="html_left"><label for="htmlTestSet_htmlTestSet_pathTests_no0">Checkbox</label></div>'+
                          '<div class="html_right"><input id="htmlTestSet_htmlTestSet_pathTests_no0" class="setting" name="htmlTestSet_pathTests_no0" type="checkbox"></div>'+
                      '</div>'+
                      '<div class="html_row">'+
                          '<label class="html_left" for="htmlTestSet_htmlTestSet_pathTests_no1">Text</label>'+
                          '<input id="htmlTestSet_htmlTestSet_pathTests_no1" class="html_right setting" name="htmlTestSet_pathTests_no1" type="text">'+
                      '</div>'+
                      '<div class="html_row">'+
                          '<label class="html_left" for="htmlTestSet_htmlTestSet_pathTests_no2">Number</label>'+
                          '<input id="htmlTestSet_htmlTestSet_pathTests_no2" class="html_right setting" name="htmlTestSet_pathTests_no2" type="number">'+
                      '</div>'+
                      '<div class="html_row">'+
                          '<label class="html_left" for="htmlTestSet_htmlTestSet_pathTests_no3">Color</label>'+
                          '<input id="htmlTestSet_htmlTestSet_pathTests_no3" class="html_right setting" name="htmlTestSet_pathTests_no3" type="color">'+
                      '</div>'+
                      '<label class="html_tight" for="htmlTestSet_htmlTestSet_pathTests_no4">Dropdown</label>'+
                      '<select id="htmlTestSet_htmlTestSet_pathTests_no4" class="html_spaced setting" name="htmlTestSet_pathTests_no4">'+
                          '<option name="option1">option 1</option>'+
                          '<option name="option2">option 2</option>'+
                          '<option name="option3">option 3</option>'+
                      '</select>'+
                      '<label class="html_tight" for="htmlTestSet_htmlTestSet_pathTests_no5">List</label>'+
                      '<select id="htmlTestSet_htmlTestSet_pathTests_no5" class="html_spaced setting" name="htmlTestSet_pathTests_no5" size="3">'+
                          '<option name="option1">option 1</option>'+
                          '<option name="option2">option 2</option>'+
                          '<option name="option3">option 3</option>'+
                          '<option name="option4">option 4</option>'+
                          '<option name="option5">option 5</option>'+
                      '</select>'+
                      '<label class="html_tight" for="htmlTestSet_htmlTestSet_pathTests_no6">Multi</label>'+
                      '<select id="htmlTestSet_htmlTestSet_pathTests_no6" class="html_spaced setting" name="htmlTestSet_pathTests_no6" multiple size="4">'+
                          '<option name="option1">option 1</option>'+
                          '<option name="option2">option 2</option>'+
                          '<option name="option3">option 3</option>'+
                          '<option name="option4">option 4</option>'+
                          '<option name="option5">option 5</option>'+
                          '<option name="option6">option 6</option>'+
                          '<option name="option7">option 7</option>'+
                      '</select>'+
                      '<label class="html_tight" for="htmlTestSet_htmlTestSet_pathTests_no7">Textarea</label>'+
                      '<textarea id="htmlTestSet_htmlTestSet_pathTests_no7" class="html_spaced setting" name="htmlTestSet_pathTests_no7" rows="7"></textarea>'+
                      '<div class="html_shaded">'+
                          '<div class="html_row">'+
                              '<label class="html_tight" for="htmlTestSet_htmlTestSet_pathTests_no8">HTML5 date picker</label>'+
                              '<input id="htmlTestSet_htmlTestSet_pathTests_no8" class="html_spaced setting" name="htmlTestSet_pathTests_no8" type="date">'+
                          '</div>'+
                          '<div class="html_row">'+
                              '<label class="html_tight" for="htmlTestSet_htmlTestSet_pathTests_no9">HTML5 datetime picker</label>'+
                              '<input id="htmlTestSet_htmlTestSet_pathTests_no9" class="html_spaced setting" name="htmlTestSet_pathTests_no9" type="datetime-local">'+
                          '</div>'+
                          '<div class="html_row">'+
                              '<label class="html_tight" for="htmlTestSet_htmlTestSet_pathTests_no10">HTML5 time picker</label>'+
                              '<input id="htmlTestSet_htmlTestSet_pathTests_no10" class="html_spaced setting" name="htmlTestSet_pathTests_no10" type="time">'+
                          '</div>'+
                      '</div>';

    //=========================================
    // HTML for the default values test
    //=========================================

    let htmlDefaultTest = ''+
                      '<p class="html_spaced">This test verifies that the initialization of default values work. If the test is successful you will see '+
                                'the input elements populated with their default values. All data types are tested. For comparison purposes an element '+
                                'without a default valut is provided.</p><br>'+

                      '<p class="html_spaced">Testing all the input types. The labels indicate how it should be. In case of a mismatch there is a bug.</p>'+
                      '<div class="html_row">'+
                          '<div class="html_left"><label for="htmlTestSet_htmlTestSet_defaultno0">Checkbox default is checked</label></div>'+
                          '<div class="html_right"><input id="htmlTestSet_htmlTestSet_defaultno0" class="setting" name="htmlTestSet_defaultno0" type="checkbox"></div>'+
                      '</div>'+
                      '<div class="html_row">'+
                          '<div class="html_left"><label for="htmlTestSet_htmlTestSet_defaultno1">Checkbox no default unchecked</label></div>'+
                          '<div class="html_right"><input id="htmlTestSet_htmlTestSet_defaultno1" class="setting" name="htmlTestSet_defaultno1" type="checkbox"></div>'+
                      '</div>'+
                      '<div class="html_row">'+
                          '<label class="html_left" for="htmlTestSet_htmlTestSet_defaultno2">Text default abc</label>'+
                          '<input id="htmlTestSet_htmlTestSet_defaultno2" class="html_right setting" name="htmlTestSet_defaultno2" type="text">'+
                      '</div>'+
                      '<div class="html_row">'+
                          '<label class="html_left" for="htmlTestSet_htmlTestSet_defaultno3">Text no default empty</label>'+
                          '<input id="htmlTestSet_htmlTestSet_defaultno3" class="html_right setting" name="htmlTestSet_defaultno3" type="text">'+
                      '</div>'+
                      '<div class="html_row">'+
                          '<label class="html_left" for="htmlTestSet_htmlTestSet_defaultno4">Number default 100</label>'+
                          '<input id="htmlTestSet_htmlTestSet_defaultno4" class="html_right setting" name="htmlTestSet_defaultno4" type="number">'+
                      '</div>'+
                      '<div class="html_row">'+
                          '<label class="html_left" for="htmlTestSet_htmlTestSet_defaultno5">Number no default empty</label>'+
                          '<input id="htmlTestSet_htmlTestSet_defaultno5" class="html_right setting" name="htmlTestSet_defaultno5" type="number">'+
                      '</div>'+
                      '<div class="html_row">'+
                          '<label class="html_left" for="htmlTestSet_htmlTestSet_defaultno6">Color default red</label>'+
                          '<input id="htmlTestSet_htmlTestSet_defaultno6" class="html_right setting" name="htmlTestSet_defaultno6" type="color">'+
                      '</div>'+
                      '<div class="html_row">'+
                          '<label class="html_left" for="htmlTestSet_htmlTestSet_defaultno7">Color no default black</label>'+
                          '<input id="htmlTestSet_htmlTestSet_defaultno7" class="html_right setting" name="htmlTestSet_defaultno7" type="color">'+
                      '</div>'+
                      '<label class="html_tight" for="htmlTestSet_htmlTestSet_defaultno8">Dropdown default option 3</label>'+
                      '<select id="htmlTestSet_htmlTestSet_defaultno8" class="html_spaced setting" name="htmlTestSet_defaultno8">'+
                          '<option name="option1">option 1</option>'+
                          '<option name="option2">option 2</option>'+
                          '<option name="option3">option 3</option>'+
                      '</select>'+
                      '<label class="html_tight" for="htmlTestSet_htmlTestSet_defaultno9">Dropdown no default option 1</label>'+
                      '<select id="htmlTestSet_htmlTestSet_defaultno9" class="html_spaced setting" name="htmlTestSet_defaultno9">'+
                          '<option name="option1">option 1</option>'+
                          '<option name="option2">option 2</option>'+
                          '<option name="option3">option 3</option>'+
                      '</select>'+
                      '<label class="html_tight" for="htmlTestSet_htmlTestSet_defaultno10">List default option 3</label>'+
                      '<select id="htmlTestSet_htmlTestSet_defaultno10" class="html_spaced setting" name="htmlTestSet_defaultno10" size="3">'+
                          '<option name="option1">option 1</option>'+
                          '<option name="option2">option 2</option>'+
                          '<option name="option3">option 3</option>'+
                          '<option name="option4">option 4</option>'+
                          '<option name="option5">option 5</option>'+
                      '</select>'+
                      '<label class="html_tight" for="htmlTestSet_htmlTestSet_defaultno11">List no default option 1</label>'+
                      '<select id="htmlTestSet_htmlTestSet_defaultno11" class="html_spaced setting" name="htmlTestSet_defaultno11" size="3">'+
                          '<option name="option1">option 1</option>'+
                          '<option name="option2">option 2</option>'+
                          '<option name="option3">option 3</option>'+
                          '<option name="option4">option 4</option>'+
                          '<option name="option5">option 5</option>'+
                      '</select>'+
                      '<label class="html_tight" for="htmlTestSet_htmlTestSet_defaultno12">Multi default all selected</label>'+
                      '<select id="htmlTestSet_htmlTestSet_defaultno12" class="html_spaced setting" name="htmlTestSet_defaultno12" multiple size="4">'+
                          '<option name="option1">option 1</option>'+
                          '<option name="option2">option 2</option>'+
                          '<option name="option3">option 3</option>'+
                          '<option name="option4">option 4</option>'+
                          '<option name="option5">option 5</option>'+
                          '<option name="option6">option 6</option>'+
                          '<option name="option7">option 7</option>'+
                      '</select>'+
                      '<label class="html_tight" for="htmlTestSet_htmlTestSet_defaultno13">Multi no default none selected</label>'+
                      '<select id="htmlTestSet_htmlTestSet_defaultno13" class="html_spaced setting" name="htmlTestSet_defaultno13" multiple size="4">'+
                          '<option name="option1">option 1</option>'+
                          '<option name="option2">option 2</option>'+
                          '<option name="option3">option 3</option>'+
                          '<option name="option4">option 4</option>'+
                          '<option name="option5">option 5</option>'+
                          '<option name="option6">option 6</option>'+
                          '<option name="option7">option 7</option>'+
                      '</select>'+
                      '<label class="html_tight" for="htmlTestSet_htmlTestSet_defaultno14">Textarea default abcd</label>'+
                      '<textarea id="htmlTestSet_htmlTestSet_defaultno14" class="html_spaced setting" name="htmlTestSet_defaultno14" rows="7"></textarea>'+
                      '<label class="html_tight" for="htmlTestSet_htmlTestSet_defaultno15">Textarea no default empty</label>'+
                      '<textarea id="htmlTestSet_htmlTestSet_defaultno15" class="html_spaced setting" name="htmlTestSet_defaultno15" rows="7"></textarea>'+
                      '<div class="html_shaded">'+
                          '<div class="html_row">'+
                              '<label class="html_tight" for="htmlTestSet_htmlTestSet_defaultno16">HTML5 date picker default 2010-01-01</label>'+
                              '<input id="htmlTestSet_htmlTestSet_defaultno16" class="html_spaced setting" name="htmlTestSet_defaultno16" type="date">'+
                          '</div>'+
                          '<div class="html_row">'+
                              '<label class="html_tight" for="htmlTestSet_htmlTestSet_defaultno17">HTML5 date picker no default format placeholder</label>'+
                              '<input id="htmlTestSet_htmlTestSet_defaultno17" class="html_spaced setting" name="htmlTestSet_defaultno17" type="date">'+
                          '</div>'+
                          '<div class="html_row">'+
                              '<label class="html_tight" for="htmlTestSet_htmlTestSet_defaultno18">HTML5 datetime picker default 2010-01-01 01:00</label>'+
                              '<input id="htmlTestSet_htmlTestSet_defaultno18" class="html_spaced setting" name="htmlTestSet_defaultno18" type="datetime-local">'+
                          '</div>'+
                          '<div class="html_row">'+
                              '<label class="html_tight" for="htmlTestSet_htmlTestSet_defaultno19">HTML5 datetime picker no default format placeholder</label>'+
                              '<input id="htmlTestSet_htmlTestSet_defaultno19" class="html_spaced setting" name="htmlTestSet_defaultno19" type="datetime-local">'+
                          '</div>'+
                          '<div class="html_row">'+
                              '<label class="html_tight" for="htmlTestSet_htmlTestSet_defaultno20">HTML5 time picker default 01:00</label>'+
                              '<input id="htmlTestSet_htmlTestSet_defaultno20" class="html_spaced setting" name="htmlTestSet_defaultno20" type="time">'+
                          '</div>'+
                          '<div class="html_row">'+
                              '<label class="html_tight" for="htmlTestSet_htmlTestSet_defaultno21">HTML5 time picker no default format placeholder</label>'+
                              '<input id="htmlTestSet_htmlTestSet_defaultno21" class="html_spaced setting" name="htmlTestSet_defaultno21" type="time">'+
                          '</div>'+
                      '</div>';

    //=========================================
    // HTML for the validation/callback test
    //=========================================

    let htmlCallbackTestCore = ''+
                      '<p class="html_spaced">This is testing the validation and callbacks in embedded html. Validation and callbacks are defined in '+
                                'the content subobject of the html element subobject. All the standard wkof features are availble through this mechanism.</p><br>'+

                      '<p class="html_spaced">This is availble for filters as well. In its filter incanation this test doesn\'t filter anything '+
                                 'because this is not the purpose of the test.</p><br>'+

                      '<br><p class="html_spaced">This dropdown triggers an alert with an <code>on_change</code> callback.</p>'+
                      '<label class="html_tight" for="htmlTestSet_htmlTestSet_callbackTests_no3">Dropdown with callback</label>'+
                      '<select id="htmlTestSet_htmlTestSet_callbackTests_no3" class="html_spaced setting" name="htmlTestSet_callbackTests_no3">'+
                          '<option name="option1">option 1</option>'+
                          '<option name="option2">option 2</option>'+
                          '<option name="option3">option 3</option>'+
                      '</select>'+

                      '<br><p class="html_spaced">This button triggers an alert with an <code>on_click</code> callback.</p>'+
                      '<button class="html_spaced setting" name="htmlTestSet_callbackTests_no4" type="button">Click for an alert</button>'+

                      '<p class="html_spaced">This numerical input takes a min max built-in validation.</p>'+
                      '<div class="html_row">'+
                          '<label class="html_left" for="htmlTestSet_htmlTestSet_callbackTests_no0">Number between 5 and 10</label>'+
                          '<div class="html_right msg"><input id="htmlTestSet_htmlTestSet_callbackTests_no0" class="setting" name="htmlTestSet_callbackTests_no0" type="number"></div>'+
                      '</div>'+

                      '<br><p class="html_spaced">This text input accepts only charactes [a-z] with a built-in regex validation.</p>'+
                      '<div class="html_row">'+
                          '<label class="html_left" for="htmlTestSet_htmlTestSet_callbackTests_no1">Text with lowercase letters only</label>'+
                          '<div class="msg html_right"><input id="htmlTestSet_htmlTestSet_callbackTests_no1" class="setting" name="htmlTestSet_callbackTests_no1" type="text"></div>'+
                      '</div>'+

                      '<br><p class="html_spaced">This text input accepts a YYYY-MM-DD date with a <code>validate</code> callback.</p>'+
                      '<div class="html_row">'+
                          '<label class="html_left" for="htmlTestSet_htmlTestSet_callbackTests_no2">YYY-MM-DD only</label>'+
                          '<div class="msg html_right"><input id="htmlTestSet_htmlTestSet_callbackTests_no2" class="setting" name="htmlTestSet_callbackTests_no2" type="text"></div>'+
                      '</div>'+
                      '<br><p class="html_spaced">This text area accepts a comma separated list of words with spaces around the commas with a <code>validate</code> '+
                           'callback.</p>'+
                      '<label class="html_tight" for="htmlTestSet_htmlTestSet_callbackTests_no6">Textarea</label>'+
                      '<div class="msg"><textarea id="htmlTestSet_htmlTestSet_callbackTests_no6" class="html_spaced setting" name="htmlTestSet_callbackTests_no6" rows="7"></textarea></div>';

    let htmlCallbackTest = htmlCallbackTestCore+
                      '<p class="html_spaced">The validated element must be included in a div with class <code>msg</code> to receive the message at the proper '+
                            'location. Without such an enclosing the message will show up below the entire embedded htlm. This required to change '+
                            'the validation code to locate a <code>$(elem).parent(\'.msg\')</code> instead of a <code>$(elem).parent(\'.right\')</code>' +
                            'as was done before.</p><br>'+

                      '<p class="html_spaced">This tests what happens when you request a validation without enclosing it in a div with class <code>msg</code>. '+
                            'Watch for the message at the bottom of the embedded html.</p><br>'+
                      '<div class="html_row">'+
                          '<label class="html_left" for="htmlTestSet_htmlTestSet_callbackTests_no5">Number between 50 and 60</label>'+
                          '<input id="htmlTestSet_htmlTestSet_callbackTests_no5" class="html_right setting" name="htmlTestSet_callbackTests_no5" type="number">'+
                      '</div>'+

                      '<p class="html_spaced">There are below some non html elements that shows the change doesn\'t break validation for these elements.</p><br>';


    //=========================================
    // HTML for the refresh_on_change test
    //=========================================

    let htmlRefreshTest = ''+
                      '<p class="html_spaced">This tests the <code>refresh_on_change</code> flag on html elements. '+
                            'The procedure goes as follows. You change the value of the control numeric field to a value other than zero. '+
                            'Then you click on the "Reset to Zero" button. It will reset to zero the setting for the control field ' +
                            'but it will not refresh the dialog. You can then change the value of some other fields. If a '+
                            'refresh on change occurs the control field will return to zero. If it does not return to zero there is no refresh. '+
                            'You may test all data types in this manner.</p><br>'+

                       '<div class="html_row">'+
                          '<label class="html_left" for="htmlTestSet_htmlTestSet_refreshTests_no0">Control</label>'+
                          '<input id="htmlTestSet_htmlTestSet_refreshTests_no0" class="html_right setting" name="htmlTestSet_refreshTests_no0" type="number">'+
                       '</div>'+
                       '<div class="html_row">'+
                          '<p class="html_left"> </p>'+
                          '<button class="html_right setting" name="htmlTestSet_refreshTests_no1" type="button">Reset to zero</button>'+
                      '</div>'+

                       '<div class="html_row">'+
                          '<div class="html_left"><label for="htmlTestSet_htmlTestSet_refreshTests_no2">Checkbox</label></div>'+
                          '<div class="html_right"><input id="htmlTestSet_htmlTestSet_refreshTests_no2" class="setting" name="htmlTestSet_refreshTests_no2" type="checkbox"></div>'+
                      '</div>'+
                      '<div class="html_row">'+
                          '<label class="html_left" for="htmlTestSet_htmlTestSet_refreshTests_no3">Text</label>'+
                          '<input id="htmlTestSet_htmlTestSet_refreshTests_no3" class="html_right setting" name="htmlTestSet_refreshTests_no3" type="text">'+
                      '</div>'+
                      '<div class="html_row">'+
                          '<label class="html_left" for="htmlTestSet_htmlTestSet_refreshTests_no4">Number</label>'+
                          '<input id="htmlTestSet_htmlTestSet_refreshTests_no4" class="html_right setting" name="htmlTestSet_refreshTests_no4" type="number">'+
                      '</div>'+
                      '<div class="html_row">'+
                          '<label class="html_left" for="htmlTestSet_htmlTestSet_refreshTests_no5">Color</label>'+
                          '<input id="htmlTestSet_htmlTestSet_refreshTests_no5" class="html_right setting" name="htmlTestSet_refreshTests_no5" type="color">'+
                      '</div>'+
                      '<label class="html_tight" for="htmlTestSet_htmlTestSet_refreshTests_no6">Dropdown</label>'+
                      '<select id="htmlTestSet_htmlTestSet_refreshTests_no6" class="html_spaced setting" name="htmlTestSet_refreshTests_no6">'+
                          '<option name="option1">option 1</option>'+
                          '<option name="option2">option 2</option>'+
                          '<option name="option3">option 3</option>'+
                      '</select>'+
                      '<label class="html_tight" for="htmlTestSet_htmlTestSet_refreshTests_no7">List</label>'+
                      '<select id="htmlTestSet_htmlTestSet_refreshTests_no7" class="html_spaced setting" name="htmlTestSet_refreshTests_no7" size="3">'+
                          '<option name="option1">option 1</option>'+
                          '<option name="option2">option 2</option>'+
                          '<option name="option3">option 3</option>'+
                          '<option name="option4">option 4</option>'+
                          '<option name="option5">option 5</option>'+
                      '</select>'+
                      '<label class="html_tight" for="htmlTestSet_htmlTestSet_refreshTests_no8">Multi</label>'+
                      '<select id="htmlTestSet_htmlTestSet_refreshTests_no8" class="html_spaced setting" name="htmlTestSet_refreshTests_no8" multiple size="4">'+
                          '<option name="option1">option 1</option>'+
                          '<option name="option2">option 2</option>'+
                          '<option name="option3">option 3</option>'+
                          '<option name="option4">option 4</option>'+
                          '<option name="option5">option 5</option>'+
                          '<option name="option6">option 6</option>'+
                          '<option name="option7">option 7</option>'+
                      '</select>'+
                      '<label class="html_tight" for="htmlTestSet_htmlTestSet_refreshTests_no9">Textarea</label>'+
                      '<textarea id="htmlTestSet_htmlTestSet_refreshTests_no9" class="html_spaced setting" name="htmlTestSet_refreshTests_no9" rows="7"></textarea>'+
                      '<div class="html_shaded">'+
                          '<div class="html_row">'+
                              '<label class="html_tight" for="htmlTestSet_htmlTestSet_refreshTests_no10">HTML5 date picker</label>'+
                              '<input id="htmlTestSet_htmlTestSet_refreshTests_no10" class="html_spaced setting" name="htmlTestSet_refreshTests_no10" type="date">'+
                          '</div>'+
                          '<div class="html_row">'+
                              '<label class="html_tight" for="htmlTestSet_htmlTestSet_refreshTests_no11">HTML5 datetime picker</label>'+
                              '<input id="htmlTestSet_htmlTestSet_refreshTests_no11" class="html_spaced setting" name="htmlTestSet_refreshTests_no11" type="datetime-local">'+
                          '</div>'+
                          '<div class="html_row">'+
                              '<label class="html_tight" for="htmlTestSet_htmlTestSet_refreshTests_no12">HTML5 time picker</label>'+
                              '<input id="htmlTestSet_htmlTestSet_refreshTests_no12" class="html_spaced setting" name="htmlTestSet_refreshTests_no12" type="time">'+
                          '</div>'+
                      '</div>';

    //=========================================
    // HTML for the first filter test
    //=========================================

    let htmlFilterTestA = ''+
                      '<p class="html_spaced">This tests a working filter. The intent is to verify that the multiple settings in a html type filter '+
                            'are successfully passed in a configuration object to <code>wkof.ItemData.get_items()</code> and eventually '+
                            'find their way to the filter. This particular filter uses <code>filter_value_map</code> to process dates ' +
                            'beforehand. A separate filter will use a direct access. (without <code>filter_value_map</code>)</p><br>'+
                      '<p class="html_spaced">This filter selects items based on a combination of item type and a date range for when lessons for '+
                            'the items were taken.</p></br>'+
                      '<label class="html_tight" for="htmlTestSet_htmlTestSet_filterTests_no0">Item Type</label>'+
                      '<select id="htmlTestSet_htmlTestSet_filterTests_no0" class="html_spaced setting" name="htmlTestSet_filterTests_no0" multiple size="3">'+
                          '<option name="radical">radical</option>'+
                          '<option name="kanji">kanji</option>'+
                          '<option name="vocabulary">vocabulary</option>'+
                      '</select>'+
                      '<div class="html_row msg">'+
                          '<label class="html_left" for="htmlTestSet_htmlTestSet_filterTests_no1">Burned Items Start Date</label>'+
                          '<input id="htmlTestSet_htmlTestSet_filterTests_no1" class="html_right setting" name="htmlTestSet_filterTests_no1" type="text">'+
                      '</div>'+
                      '<div class="html_row msg">'+
                          '<label class="html_left" for="htmlTestSet_htmlTestSet_filterTests_no2">Burned Items End Date</label>'+
                          '<input id="htmlTestSet_htmlTestSet_filterTests_no2" class="html_right setting" name="htmlTestSet_filterTests_no2" type="text">'+
                      '</div>';


    //=========================================
    // HTML for the second filter test
    //=========================================

    let htmlFilterTestB = ''+
                      '<p class="html_spaced">This tests a working filter. The intent is to verify that the multiple settings in a html type filter '+
                            'are successfully passed in a configuration object to <code>wkof.ItemData.get_items()</code> and eventually '+
                            'find their way to the filter. This particular filter does <b>not</b> use <code>filter_value_map</code> to process the ' +
                            'filter value beforehand.</p><br>'+
                      '<p class="html_spaced">This filter selects items based on a range of % of total correct answers.</p></br>'+
                      '<div class="html_row msg">'+
                          '<label class="html_left" for="htmlTestSet_htmlTestSet_filterTestsB_no1">Low % of correct answers</label>'+
                          '<input id="htmlTestSet_htmlTestSet_filterTestsB_no1" class="html_right setting" name="htmlTestSet_filterTestsB_no1" type="number">'+
                      '</div>'+
                      '<div class="html_row msg">'+
                          '<label class="html_left" for="htmlTestSet_htmlTestSet_filterTestsB_no2">High % of correct answers.</label>'+
                          '<input id="htmlTestSet_htmlTestSet_filterTestsB_no2" class="html_right setting" name="htmlTestSet_filterTestsB_no2" type="number">'+
                      '</div>';

    //=============================================
    // HTML for the filter with dialog button test
    //=============================================

    let hoverTipRadical = 'List radicals in a list separated with commas.';
    let placeholderRadical = 'big, small';
    let hoverTipKanji = 'List kanji in a list separated with commas.';
    let placeholderKanji = '大, 小';
    let hoverTipVocabulary = 'List vocabulary in a list separated with commas.';
    let placeholderVocabulary = '大きい, 小さい';
    let hoverTipUpload = 'Bring in your filter items from a file\nyou have previously downloaded.\nYou must select the file first.';
    let hoverTipDownload = 'Save your filter items into a file\nyou may upload in the future.';
    let htmlFilterTestC = ''+
                      '<p class="html_spaced">This tests a working filter. This is an example of a filter I am interested to write. '+
                            'One objective is to verify that I can do what I want with an html type filter.</p><br>'+
                      '<p class="html_spaced">This is a version of the item list filter with a better user interface. It accepts a comma separated list '+
                            'of items for each item type.</p><br> '+

                      '<div title="'+hoverTipRadical+'">'+
                          '<label class="html_tight" for="htmlTestSet_htmlTestSet_itemList_radical">Radicals</label>'+
                          '<div class="msg"><textarea id="htmlTestSet_htmlTestSet_itemList_radical" class="html_spaced setting" name="htmlTestSet_itemList_radical" '+
                                'placeholder="'+placeholderRadical+'" rows="6"></textarea></div>'+
                      '</div>'+
                      '<div title="'+hoverTipKanji+'">'+
                          '<label class="html_tight" for="htmlTestSet_htmlTestSet_itemList_kanji">Kanji</label>'+
                          '<div class="msg"><textarea id="htmlTestSet_htmlTestSet_itemList_kanji" class="html_spaced setting" name="htmlTestSet_itemList_kanji" '+
                                 'placeholder="'+placeholderKanji+'" rows="6"></textarea></div>'+
                      '</div>'+
                      '<div title="'+hoverTipVocabulary+'">'+
                          '<label class="html_tight" for="htmlTestSet_htmlTestSet_itemList_vocabulary">Vocabulary</label>'+
                          '<div class="msg"><textarea id="htmlTestSet_htmlTestSet_itemList_vocabulary" class="html_spaced setting" name="htmlTestSet_itemList_vocabulary" '+
                                 'placeholder="'+placeholderVocabulary+'" rows="6"></textarea></div>'+
                      '</div>'+
                      '<div><input type="file" id="htmlTestSet_htmlTestSet_itemList_file" class="html_spaced" name="htmlTestSet_itemList_file"></div>'+
                      '<div class="msg files">'+
                          '<button class="html_spaced setting" id="htmlTestSet_htmlTestSet_itemList_upload" name="htmlTestSet_itemList_upload" '+
                               'title="'+hoverTipUpload+'" type="button">Set items according to selected file</button>'+
                          '<button class="html_spaced" id="htmlTestSet_htmlTestSet_itemList_download" '+
                               'title="'+hoverTipDownload+'" type="button" style="margin-left: 0.4em;">'+
                               '<a download="Filter Item List.txt" name="htmlTestSet_itemList_link" style="text-decoration:none;color:#000000;">Download items</a>'+
                          '</button>'+
                      '</div>';


	function loadDialog() {
		wkof.ready('Settings').then(function() {

                // ===========================================
                //  Configuration for HTML and CSS tests
                // ===========================================

                let basicTestConfig = {type: 'page', label: 'HTML and CSS Test',
                                                      content: {basicTests: {type: 'html', label: 'HTML and CSS Test', html: htmlBaseTest, },
                                                                },
                                        };

                let visualTestConfig = {type: 'page', label: 'Visual Test',
                                                      content: {visualTestPreamble: {type: 'html', label: 'Visual Test', html: htmlVisualTestPreamble, },
                                                                checkboxVisualTestA: {type: 'checkbox', label: 'Not HTML checkbox', },
                                                                numberVisualTestB: {type: 'number', label: 'Not HTML number', },
                                                                textVisualTestC: {type: 'text', label: 'Not HTML text', },
                                                                visualTestHtmlD: {type: 'html', label: 'Html For The Test', html: htmlVisualTestHtmlA, },
                                                                numberVisualTestBA: {type: 'number', label: 'Not HTML number', },
                                                                textVisualTestBB: {type: 'text', label: 'Not HTML text', },
                                                                visualTestHtmlBC: {type: 'html', html: htmlVisualTestHtmlA1, },
                                                                checkboxVisualTestE: {type: 'checkbox', label: 'Not HTML checkbox', },
                                                                numberVisualTestF: {type: 'number', label: 'Not HTML number', },
                                                                numberVisualTestDA: {type: 'number', label: 'Not HTML number', },
                                                                textVisualTestDB: {type: 'text', label: 'Not HTML text', },
                                                                visualTestHtmlDC: {type: 'html', label: 'Html In Columns Not Shaded', html: htmlVisualTestHtmlB, },
                                                                checkboxVisualTestDE: {type: 'checkbox', label: 'Not HTML checkbox', },
                                                                                            numberVisualTestDF: {type: 'number', label: 'Not HTML number', },
                                                                textVisualTestG: {type: 'text', label: 'Not HTML text', },
                                                                groupVisualTestH: {type: 'group', label: 'Group',
                                                                                  content: {
                                                                                            numberVisualTestI: {type: 'number', label: 'Not HTML number', },
                                                                                            textVisualTestJ: {type: 'text', label: 'Not HTML text', },
                                                                                            visualTestHtmlK: {type: 'html', label: 'Html In a Group Not Shaded', html: htmlVisualTestHtmlB, },
                                                                                            checkboxVisualTestL: {type: 'checkbox', label: 'Not HTML checkbox', },
                                                                                            numberVisualTestM: {type: 'number', label: 'Not HTML number', },
                                                                                            },
                                                                                  },
                                                                checkboxVisualTestCA: {type: 'checkbox', label: 'Not HTML checkbox', },
                                                                numberVisualTestCB: {type: 'number', label: 'Not HTML number', },
                                                                textVisualTestCC: {type: 'text', label: 'Not HTML text', },
                                                                groupVisualTestCD: {type: 'group', label: 'Group',
                                                                                  content: {
                                                                                            numberVisualTestCE: {type: 'number', label: 'Not HTML number', },
                                                                                            textVisualTestCF: {type: 'text', label: 'Not HTML text', },
                                                                                            visualTestHtmlCG: {type: 'html', label: 'Html Shaded In a Group', shade: true, html: htmlVisualTestHtmlB, },
                                                                                            checkboxVisualTestCH: {type: 'checkbox', label: 'Not HTML checkbox', },
                                                                                            numberVisualTestCI: {type: 'number', label: 'Not HTML number', },
                                                                                            },
                                                                                  },
                                                                numberVisualTestN: {type: 'number', label: 'Not HTML number', },
                                                                numberVisualTestO: {type: 'number', label: 'Not HTML number', },
                                                                textVisualTestP: {type: 'text', label: 'Not HTML text', },
                                                                textVisualTestQ: {type: 'text', label: 'Not HTML text', },
                                                                groupVisualTestR: {type: 'group', label: 'Group',
                                                                                  content: {
                                                                                            numberVisualTestS: {type: 'number', label: 'Not HTML number', },
                                                                                            textVisualTestT: {type: 'text', label: 'Not HTML text', },
                                                                                            visualTestHtmlU: {type: 'html', label: 'Html Shaded In a Group With Inner Shading', shade: true, html: htmlVisualTestHtmlC, },
                                                                                            checkboxVisualTestV: {type: 'checkbox', label: 'Not HTML checkbox', },
                                                                                            numberVisualTestW: {type: 'number', label: 'Not HTML number', },
                                                                                            },
                                                                                  },
                                                                numberVisualTestX: {type: 'number', label: 'Not HTML number', },
                                                                numberVisualTestY: {type: 'number', label: 'Not HTML number', },
                                                                textVisualTestZ: {type: 'text', label: 'Not HTML text', },
                                                                textVisualTestAA: {type: 'text', label: 'Not HTML text', },
                                                                visualTestHtmlAB: {type: 'html', label: 'Html Shaded Not In A Group', shade: true, html: htmlVisualTestHtmlB, },
                                                                checkboxVisualTestAC: {type: 'checkbox', label: 'Not HTML checkbox', },
                                                                numberVisualTestAD: {type: 'number', label: 'Not HTML number', },
                                                               },
                                         };

                // ===========================================
                //  Configuration for tag tests
                // ===========================================

                let htmlTagConfig = {no0:{type: "checkbox"}, no1:{type: "text"}, no2:{type: "number"}, no3:{type: "color"},
                                     no4:{type: "dropdown", content: {option1: "option 1", option2: "option 2", option3: "option 3", },},
                                     no5:{type: "list", content: {option1: "option 1", option2: "option 2", option3: "option 3", option4: "option 4", option5: "option 5", },},
                                     no6:{type: "list", multi: true, content: {option1: "option 1", option2: "option 2", option3: "option 3", option4: "option 4",
                                                                                option5: "option 5", option6: "option 6", option7: "option 7", },
                                         },
                                     no7:{type: "other"}, no8:{type: "input", subtype: "date"}, no9:{type: "input", subtype: "datetime-local"},
                                     no10:{type: "input", subtype: "time"}, };
                let htmlTagTestConfig = {type: 'page', label: 'Tag Test',
                                                      content: {tagTestPreamble: {type: 'html', label: 'Preamble', html: htmlTagTestPreamble, },
                                                                checkboxTest: {type: 'checkbox', label: 'Not HTML checkbox', },
                                                                numberTest: {type: 'number', label: 'Not HTML number', },
                                                                textTest: {type: 'text', label: 'Not HTML text', },
                                                                tagTestHtml: {type: 'html', label: 'Html For The Test', shade: true, html: htmlTagTestHtml,
                                                                              content: htmlTagConfig},
                                                                dropdownTest: {type: 'dropdown', label: 'Not HTM dropdown', content:{option1: 'Option 1',
                                                                                                                                     option2: 'Option 2',
                                                                                                                                     option3: 'Option 4',
                                                                                                                                     option4: 'Option 4',
                                                                                                                                     option5: 'Option 5',
                                                                                                                                    }
                                                                              },
                                                                dropdownTest: {type: 'list', label: 'Not HTM list', content:{option1: 'Option 1',
                                                                                                                             option2: 'Option 2',
                                                                                                                             option3: 'Option 4',
                                                                                                                             option4: 'Option 4',
                                                                                                                             option5: 'Option 5',
                                                                                                                            }
                                                                              },
                                                                dateTest: {type: 'input', label: 'Not HTM date', subtype: "date", },
                                                                },
                                        };

                // ===========================================
                //  Configuration for default tests
                // ===========================================

                let htmlDefaultConfig = {htmlTestSet_defaultno0:{type: "checkbox", default: true}, htmlTestSet_defaultno1:{type: "checkbox",},
                                         htmlTestSet_defaultno2:{type: "text", default: 'abc'}, htmlTestSet_defaultno3:{type: "text",},
                                         htmlTestSet_defaultno4:{type: "number", default: 100}, htmlTestSet_defaultno5:{type: "number",},
                                         htmlTestSet_defaultno6:{type: "color", default: '#de1717'}, htmlTestSet_defaultno7:{type: "color",},
                                         htmlTestSet_defaultno8:{type: "dropdown", default: 'option3', content: {option1: "option 1", option2: "option 2", option3: "option 3", },},
                                         htmlTestSet_defaultno9:{type: "dropdown",content: {option1: "option 1", option2: "option 2", option3: "option 3", },},
                                         htmlTestSet_defaultno10:{type: "list", default: 'option3',
                                               content: {option1: "option 1", option2: "option 2", option3: "option 3", option4: "option 4", option5: "option 5", },},
                                         htmlTestSet_defaultno11:{type: "list",
                                               content: {option1: "option 1", option2: "option 2", option3: "option 3", option4: "option 4", option5: "option 5", },},
                                         htmlTestSet_defaultno12:{type: "list", multi: true,
                                               default: {option1: true, option2: true, option3: true, option4: true, option5: true, option6: true, option7: true, },
                                               content: {option1: "option 1", option2: "option 2", option3: "option 3", option4: "option 4", option5: "option 5", option6: "option 6", option7: "option 7", },
                                              },
                                         htmlTestSet_defaultno13:{type: "list", multi: true,
                                               content: {option1: "option 1", option2: "option 2", option3: "option 3", option4: "option 4", option5: "option 5", option6: "option 6", option7: "option 7", },
                                              },
                                         htmlTestSet_defaultno14:{type: "textarea", default: 'abcd'}, htmlTestSet_defaultno15:{type: "textarea",},
                                         htmlTestSet_defaultno16:{type: "input", subtype: "date", default:"2010-01-01"}, htmlTestSet_defaultno17:{type: "input", subtype: "date",},
                                         htmlTestSet_defaultno18:{type: "input", subtype: "datetime-local", default:"2010-01-01T01:00"}, htmlTestSet_defaultno19:{type: "input", subtype: "datetime-local",},
                                         htmlTestSet_defaultno20:{type: "input", subtype: "time", default: "01:00"}, htmlTestSet_defaultno21:{type: "input", subtype: "time"}
                                        };
                let htmdefaultTestConfig = {type: 'page', label: 'Default Test',
                                                      content: {defaultTestHtml: {type: 'html', label: 'Html For The Test', html: htmlDefaultTest,
                                                                                  content: htmlDefaultConfig},
                                                                },
                                        };

                // ===========================================
                //  Configuration for callback tests
                // ===========================================

                let htmCallbackConfig = {htmlTestSet_callbackTests_no0:{type: "number", default: 6, min: 5, max: 10,},
                                         htmlTestSet_callbackTests_no1:{type: "text", default: 'abcd', match: '^[a-z]*$'},
                                         htmlTestSet_callbackTests_no2:{type: "text", default: '2010-01-01', validate: validateDate},
                                         htmlTestSet_callbackTests_no3:{type: "dropdown", default: 'option1', on_change: sendAlertOnChange,
                                                                                                        content: {option1: "option 1", option2: "option 2", option3: "option 3", },},
                                         htmlTestSet_callbackTests_no4:{type: "button", on_click: sendAlertOnClick},
                                         htmlTestSet_callbackTests_no5:{type: "number", default: 55, min: 50, max: 60,},
                                         htmlTestSet_callbackTests_no6:{type: 'other', validate: validateTextArea},
                                         };

                let htmlCallbackTestConfig = {type: 'page', label: 'Callback Test',
                                                      content: {callbackTestHtml: {type: 'html', html: htmlCallbackTest, shade: true, content: htmCallbackConfig},
                                                                callbackTestNumber: {type: 'number', label: 'Between 100 and 150', default:106, min:100, max: 150},
                                                                callbackTestText: {type: 'text', label: 'Uppercase only', default: 'ABCD', match: '^[A-Z]*$'},
                                                                callbackTestDate: {type: "text", label: 'YYYY-MM-DD hh:mm', default: '2010-01-01', validate: validateDateTime},
                                                               },
                                             };

                // ===========================================
                //  Configuration for refresh tests
                // ===========================================

                let htmlRefreshConfig = {htmlTestSet_refreshTests_no0: {type: 'number',},
                                         htmlTestSet_refreshTests_no1: {type: 'button', on_click: resetToZero},
                                         htmlTestSet_refreshTests_no2:{type: "checkbox", refresh_on_change:true},
                                         htmlTestSet_refreshTests_no3:{type: "text", refresh_on_change:true},
                                         htmlTestSet_refreshTests_no4:{type: "number", refresh_on_change:true},
                                         htmlTestSet_refreshTests_no5:{type: "color", refresh_on_change:true},
                                         htmlTestSet_refreshTests_no6:{type: "dropdown", refresh_on_change:true, content: {option1: "option 1", option2: "option 2", option3: "option 3", },},
                                         htmlTestSet_refreshTests_no7:{type: "list", refresh_on_change:true, content: {option1: "option 1", option2: "option 2", option3: "option 3", option4: "option 4", option5: "option 5", },},
                                         htmlTestSet_refreshTests_no8:{type: "list", refresh_on_change:true, multi: true, content: {option1: "option 1", option2: "option 2", option3: "option 3", option4: "option 4",
                                                                                                            option5: "option 5", option6: "option 6", option7: "option 7", },
                                         },
                                         htmlTestSet_refreshTests_no9:{type: "other", refresh_on_change:true},
                                         htmlTestSet_refreshTests_no10:{type: "input", subtype: "date", refresh_on_change:true},
                                         htmlTestSet_refreshTests_no11:{type: "input", subtype: "datetime-local", refresh_on_change:true},
                                         htmlTestSet_refreshTests_no12:{type: "input", subtype: "time", refresh_on_change:true}, };
               let htmlRefreshTestConfig = {type: 'page', label: 'Refresh Test',
                                                      content: {refreshTestHtml: {type: 'html', label: 'Html For The Test', shade: true, html: htmlRefreshTest,
                                                                                  content: htmlRefreshConfig},
                                                                 },
                                        };


               // ===========================================
               //  Construction of the dialog and load
               // ===========================================

               htmlTestSetDialog = new wkof.Settings({
                    script_id: htmlTestSetScriptId,
                    title: htmlTestSetTitle,
                    content: {htmlTestsSet: {type:'tabset', content: {tabBasicTests: basicTestConfig, tabVisualTest: visualTestConfig, tabTagTest: htmlTagTestConfig,
                                                                      tabDefaultTest: htmdefaultTestConfig, tabCallbackTest: htmlCallbackTestConfig,
                                                                      tabRefreshTest: htmlRefreshTestConfig}},
                              }
                });

                htmlTestSetDialog.load().then(function() {
                    updateFiltersWhenReady();
                    htmlTestSetLoadedPromise.resolve();
                });

        });
        return htmlTestSetLoadedPromise;
	}

	// BEGIN HTML and CSS Tests
    let htmlTestHover_tip = 'HTML and CSS tests For data types and classes for styling the layout';

	function registerBaseTestsFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[baseTestsFilterName] = {
			type: 'html',
            html: htmlBaseTest,
			label: 'HTML and CSS Test',
			filter_func: nullFilter,
			set_options: function(options) { return; },
			hover_tip: htmlTestHover_tip,
		};
	}

    function nullFilter(filterValue, item) {
		return true;
	}

	// END HTML and CSS tests

	// BEGIN Path Test
    let pathTestHover_tip = 'Tests whether settings are stored in the right path';

    let htmPathConfig = {htmlTestSet_pathTests_no0:{type: "checkbox", default: false}, htmlTestSet_pathTests_no1:{type: "text", default: 'Default'},
                         htmlTestSet_pathTests_no2:{type: "number", default: 999}, htmlTestSet_pathTests_no3:{type: "color", default: '#000000'},
                         htmlTestSet_pathTests_no4:{type: "dropdown", default: 'option3', content: {option1: "option 1", option2: "option 2", option3: "option 3", },},
                         htmlTestSet_pathTests_no5:{type: "list", default: 'option4', content: {option1: "option 1", option2: "option 2", option3: "option 3", option4: "option 4", option5: "option 5", },},
                         htmlTestSet_pathTests_no6:{type: "list", multi: true, default: {option1: false, option2: true, option3: true, option4: false,
                                                                                                      option5: false, option6: false, option7: false, },
                                                                 content: {option1: "option 1", option2: "option 2", option3: "option 3", option4: "option 4",
                                                                           option5: "option 5", option6: "option 6", option7: "option 7", },
                             },
                         htmlTestSet_pathTests_no7:{type: "other"}, htmlTestSet_pathTests_no8:{type: "input", subtype: "date", default: '2020-01-01'},
                         htmlTestSet_pathTests_no9:{type: "input", subtype: "datetime-local", default: '2020-01-01T00:00'},
                         htmlTestSet_pathTests_no10:{type: "input", subtype: "time", default: '00:00'}, };

	function registerPathTestsFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[pathTestsFilterName] = {
			type: 'html',
            html: htmlPathTest,
			label: 'Path Test',
			default: {},
			filter_func: nullFilter,
			set_options: function(options) { return; },
			hover_tip: pathTestHover_tip,
            content: htmPathConfig,
		};
	}

    // END Path tests

	// BEGIN Default Test
    let defaultTestHover_tip = 'Tests whether the defaults are properly processed';

    let htmlDefaultConfig = {htmlTestSet_defaultno0:{type: "checkbox", default: true}, htmlTestSet_defaultno1:{type: "checkbox",},
                             htmlTestSet_defaultno2:{type: "text", default: 'abc'}, htmlTestSet_defaultno3:{type: "text",},
                             htmlTestSet_defaultno4:{type: "number", default: 100}, htmlTestSet_defaultno5:{type: "number",},
                             htmlTestSet_defaultno6:{type: "color", default: '#de1717'}, htmlTestSet_defaultno7:{type: "color",},
                             htmlTestSet_defaultno8:{type: "dropdown", default: 'option3', content: {option1: "option 1", option2: "option 2", option3: "option 3", },},
                             htmlTestSet_defaultno9:{type: "dropdown",content: {option1: "option 1", option2: "option 2", option3: "option 3", },},
                             htmlTestSet_defaultno10:{type: "list", default: 'option3',
                                   content: {option1: "option 1", option2: "option 2", option3: "option 3", option4: "option 4", option5: "option 5", },},
                             htmlTestSet_defaultno11:{type: "list",
                                   content: {option1: "option 1", option2: "option 2", option3: "option 3", option4: "option 4", option5: "option 5", },},
                             htmlTestSet_defaultno12:{type: "list", multi: true,
                                   default: {option1: true, option2: true, option3: true, option4: true, option5: true, option6: true, option7: true, },
                                   content: {option1: "option 1", option2: "option 2", option3: "option 3", option4: "option 4", option5: "option 5", option6: "option 6", option7: "option 7", },
                                  },
                             htmlTestSet_defaultno13:{type: "list", multi: true,
                                   content: {option1: "option 1", option2: "option 2", option3: "option 3", option4: "option 4", option5: "option 5", option6: "option 6", option7: "option 7", },
                                  },
                             htmlTestSet_defaultno14:{type: "textarea", default: 'abcd'}, htmlTestSet_defaultno15:{type: "textarea",},
                             htmlTestSet_defaultno16:{type: "input", subtype: "date", default:"2010-01-01"}, htmlTestSet_defaultno17:{type: "input", subtype: "date",},
                             htmlTestSet_defaultno18:{type: "input", subtype: "datetime-local", default:"2010-01-01T01:00"}, htmlTestSet_defaultno19:{type: "input", subtype: "datetime-local",},
                             htmlTestSet_defaultno20:{type: "input", subtype: "time", default: "01:00"}, htmlTestSet_defaultno21:{type: "input", subtype: "time"}
                            };

	function registerDefaultTestsFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[defaultTestsFilterName] = {
			type: 'html',
            html: htmlDefaultTest,
			label: 'Default Test',
			default: {},
			filter_func: nullFilter,
			set_options: function(options) { return; },
			hover_tip: defaultTestHover_tip,
            content: htmlDefaultConfig,
		};
	}

    // END Default tests

	// BEGIN Callback Test
    let callbackTestHover_tip = 'Whether validation and callbacks work in filters';

    let htmCallbackConfig = {htmlTestSet_callbackTests_no0:{type: "number", default: 6, min: 5, max: 10,},
                              htmlTestSet_callbackTests_no1:{type: "text", default: 'abcd', match: '^[a-z]*$'},
                              htmlTestSet_callbackTests_no2:{type: "text", default: '2010-01-01', validate: validateDate},
                              htmlTestSet_callbackTests_no3:{type: "dropdown", default: 'option1', on_change: sendAlertOnChange,
                                                                                            content: {option1: "option 1", option2: "option 2", option3: "option 3", },},
                              htmlTestSet_callbackTests_no4:{type: "button", on_click: sendAlertOnClick},
                              htmlTestSet_callbackTests_no6:{type: 'other', validate: validateTextArea},
                             };

	function registerCallbackTestsFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[callbackTestsFilterName] = {
			type: 'html',
            html: htmlCallbackTestCore,
			label: 'Callback and Validation Test',
			default: {},
			filter_func: nullFilter,
			set_options: function(options) { return; },
			hover_tip: callbackTestHover_tip,
            content: htmCallbackConfig,
		};
	}

	// END Callback test

	// BEGIN First Filter Test
    let filterTestHover_tip = 'Whether filters with filter_value_map work';

    let htmFilterConfig = {htmlTestSet_filterTests_no0:{type: "list", multi: true, default:{radical: false, kanji: false, vocabulary: false, },
                                                                     content: {radical: "radical", kanji: "kanji", vocabulary: "vocabulary", },},
                           htmlTestSet_filterTests_no1:{type: "text", default: '2010-01-01', validate: validateDate},
                           htmlTestSet_filterTests_no2:{type: "text", default: '2020-12-31', validate: validateDate},
                          };

	function registerFilterTestsFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[filterTestsFilterName] = {
			type: 'html',
            html: htmlFilterTestA,
			label: 'Filter Test With <code>filter_value_map</code>',
			default: {},
			filter_func: combinedlFilter,
            filter_value_map: filter_value_map_wrapper.bind(null, parseDateTime),
			set_options: function(options) { options.assignments = true; },
			hover_tip: filterTestHover_tip,
            content: htmFilterConfig,
		};
	}

	function combinedlFilter(filterValue, item) {
        if (!filterValue.htmlTestSet_filterTests_no0[item.object]) return false;
        if (item.assignments === undefined) return false;
        if (item.assignments.started_at === undefined) return false;
        let date = Date.parse(item.assignments.started_at);
        if (date < filterValue.afterDate) return false;
        return date <= filterValue.beforeDate;
	};

    function filter_value_map_wrapper(funct, param){
        param.afterDate = funct(param.htmlTestSet_filterTests_no1).getTime();
        param.beforeDate = funct(param.htmlTestSet_filterTests_no2).getTime();
        return param;
    };

	// BEGIN Second Filter Test
    let filterTestBHover_tip = 'Whether filters without filter_value_map work';

    let htmFilterBConfig = {htmlTestSet_filterTestsB_no1:{type: "number", },
                            htmlTestSet_filterTestsB_no2:{type: "number", },
                           };

	function registerFilterTestsBFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[filterTestsBFilterName] = {
			type: 'html',
            html: htmlFilterTestB,
			label: 'Filter Test Without <code>filter_value_map</code>',
			default: {},
			filter_func: combinedlFilterB,
			set_options: function(options) { options.review_statistics = true; },
			hover_tip: filterTestBHover_tip,
            content: htmFilterBConfig,
		};
	}

	function combinedlFilterB(filterValue, item) {
        if (item.review_statistics === undefined) return false;
        let percent = item.review_statistics.percentage_correct;
        if (percent === undefined) return false;
        if (percent < filterValue.htmlTestSet_filterTestsB_no1) return false;
        return percent <= filterValue.htmlTestSet_filterTestsB_no2;
	};

	// END Second Filter test

	// BEGIN Item List Test
    let filterItemListBHover_tip = 'Specify lists of items to be accepted.';

    let htmItemListConfig = {htmlTestSet_itemList_radical:{type: "textarea", default: '',　on_change: setDownloadLink},
                             htmlTestSet_itemList_kanji:{type: "textarea", default: '', on_change: setDownloadLink},
                             htmlTestSet_itemList_vocabulary:{type: "textarea", default: '', on_change: setDownloadLink},
                             htmlTestSet_itemList_upload:{type: "button", on_click: uploadFile},
                             htmlTestSet_itemList_download:{type: "button", on_click: onClickDownload},
                            };

	function registerItemListFilter() {
		wkof.ItemData.registry.sources.wk_items.filters[filterItemListFilterName] = {
			type: 'html',
            html: htmlFilterTestC,
			label: 'Item List',
			default: {},
			filter_func: itemListFilter,
            filter_value_map: prepareFilter,
            pre_open: initializeDownloadLink,
			set_options: function(options) { return; },
			hover_tip: filterItemListBHover_tip,
            content: htmItemListConfig,
		};
	}

    //-------------------------------------------------------------------
    function split_list(str) {return str.replace(/、/g,',').replace(/[\r\n\s ]+/g,' ').trim().replace(/ *, */g, ',').split(',').filter(function(name) {return (name.length > 0);});}

    function itemListFilter(filterValue, item) {
        let type = item.object;
        if (type === 'radical') if (item.data.characters !== null) if (filterValue.radical.indexOf(item.data.characters) >= 0) return true;
        return filterValue[type].indexOf(item.data.slug) >= 0;
	};

    function prepareFilter(filterValue){
        let renamed = {};
        renamed.radical = split_list(filterValue.htmlTestSet_itemList_radical);
        renamed.kanji = split_list(filterValue.htmlTestSet_itemList_kanji);
        renamed.vocabulary = split_list(filterValue.htmlTestSet_itemList_vocabulary);
        return renamed;
    }

    function onClickDownload(name, config, on_change){
        let root = this.closest('.html_type');
        var buttons = $(root).find(".files");
        buttons.find('.note').remove();
    }

    function initializeDownloadLink(elem, path){
        let radicals = eval(path+'.htmlTestSet_itemList_radical');
        let kanji = eval(path+'.htmlTestSet_itemList_kanji');
        let vocabulary = eval(path+'.htmlTestSet_itemList_vocabulary');
        let encoded = makeEncode(radicals, kanji, vocabulary);
        let downloadElem = $(elem).find("a[name='htmlTestSet_itemList_link']");
        downloadElem.attr("href", "data:text/plain; charset=utf-8,"+encoded);
    }

    function setDownloadLink(name, value, config){
        let root = this.closest('.html_type');
        var buttons = $(root).find(".files");
        buttons.find('.note').remove();
        let radicalElem = $(root).find(".setting[name='htmlTestSet_itemList_radical']");
        let kanjiElem = $(root).find(".setting[name='htmlTestSet_itemList_kanji']");
        let vocabularyElem = $(root).find(".setting[name='htmlTestSet_itemList_vocabulary']");
        let radicals = radicalElem.val();
        let kanji = kanjiElem.val();
        let vocabulary = vocabularyElem.val();
        let encoded = makeEncode(radicals, kanji, vocabulary);
        let downloadElem = $(root).find("a[name='htmlTestSet_itemList_link']");
        downloadElem.attr("href", "data:text/plain; charset=utf-8,"+encoded);
    }

    function makeEncode(radicals, kanji, vocabulary){
        let list = [];
        list.push('radicals');
        list.push(radicals);
        list.push('kanji');
        list.push(kanji);
        list.push('vocabulary');
        list.push(vocabulary);
        let text = list.join('\n');
        return encodeURI("\uFEFF"+text);

    }

    function uploadFile(name, config, on_change){
        let root = this.target.closest('.html_type');
        var buttons = $(root).find(".files");
        buttons.find('.note').remove();
        let fileElem = $(root).find("input[name='htmlTestSet_itemList_file']");
        let filenames = fileElem.prop('files');
        if (filenames.length === 0){
            buttons.append('<div class="note error">'+'Plese select a file'+'</div>');
            return;
        }
        let filename = filenames[0];
        let reader = new FileReader();
        reader.onload = validateReception;
        reader.readAsText(filename);

        function validateReception(event){
            let result = receiveText(event);
            if (typeof result === 'string'){
                var buttons = $(root).find(".files");
                buttons.find('.note').remove();
                buttons.append('<div class="note error">'+result+'</div>');
            };
        }

        function receiveText(event){
            let text = event.target.result;
            let radicals, kanji, vocabulary;
            let errorMsg = 'Invalid file content';
            text = text.replaceAll('\n','');

            let start = text.indexOf('radicals');
            if (start !== 0) return errorMsg;
            start = start + 'radicals'.length;
            let end = text.indexOf('kanji');
            if (end <= start) return errorMsg;
            radicals = text.slice(start, end);

            start = end + 'kanji'.length;
            end = text.indexOf('vocabulary');
            if (end <= start) return errorMsg;
            kanji = text.slice(start, end);

            start = end + 'vocabulary'.length;
            vocabulary = text.slice(start);

            let elem = $(root).find(".setting[name='htmlTestSet_itemList_radical']");
            elem.val(radicals);
            elem.change();
            elem = $(root).find(".setting[name='htmlTestSet_itemList_kanji']");
            elem.val(kanji);
            elem.change();
            elem = $(root).find(".setting[name='htmlTestSet_itemList_vocabulary']");
            elem.val(vocabulary);
            elem.change();
            return true;
        }
    }

	// END Item List Filter test

    function sendAlertOnChange(){
        alert('The dropdown selection has been changed.');
    }

    function sendAlertOnClick(e){
        alert('The button has been clicked.');
    }

    function resetToZero(e){
        wkof.settings[htmlTestSetScriptId].htmlTestSet_refreshTests_no0 = 0;
        alert('Control has been resetted to zero');
    }

    function validateTextArea(value, config){
        console.log('validateTextArea is called');
        let match = /^\s*[a-zA_Z]+(?:\s*,\s*[a-zA-Z]+)*\s*$/.test(value);
        if (match) return true;
        return 'Invalid list of words';
    }

    function validateTextAreaKanji(value, config){
        let list = split_list(value);
        let result = true;
        list.forEach(item=>{result = result && item.match(/^[-a-zA-Z0-9\u3040-\u309f\u30a0-\u30ff\uff00-\uffef\u4e00-\u9faf\u3400-\u4dbf\u3005]+$/) !== null})
        // Hiragana: [\u3040-\u309f]
        // Katakana: [\u30a0-\u30ff]
        // Roman characters + half-width katakana: [\uff00-\uffef]
        // Kanji: [\u4e00-\u9faf]|[\u3400-\u4dbf]
        // Repeater: \u3005
        // see http://www.rikai.com/library/kanjitables/kanji_codes.unicode.shtml
        if (result === true) return true;
        return 'Invalid list of words';
    }

    //=======================================
    // Date Validation and Parsing Functions
    //=======================================

   //=======================================
    // All time validation functions and the parsing function accept
    // YYYY-MM-DD 24:00 to mean next day at 00:00
    // According to wikipedia this is part of the 24 hours time comvention
    //=======================================

    //=======================================
    // This group of functions nails the format to YYYY-MM-DD something
    //=======================================
    // Error messages
    const errorWrongDateTimeFormat = 'Use YYYY-MM-DD HH:MM [24h, 12h]';
    const errorWrongDateTimeRelativeFormat = 'Use YYYY-MM-DD HH:MM [24h, 12h]<br>Or +10d3h45m or -4h12h30m<br>+- needed, rest may be omitted';
    const errorWrongDateTimeFullFormat = 'Use YYYY-MM-DD HH:MM:SS.mmm<br>Seconds and milliseconds optional';
    const errorWrongDateTimeFullRelativeFormat = 'Use YYYY-MM-DD HH:MM:SS.mmm<br>Seconds and milliseconds optional<br>Or +10d3h45m12s -4h12h30m10s<br>+- needed, rest may be omitted';
    const errorWrongDateFormat = 'Invalid date - Use YYYY-MM-DD';
    const errorWrongDateRelativeFormat = 'Invalid date - Use YYYY-MM-DD<br>Or +10d or -2d';
    const errorOutOfRange = 'Number out of range';

    //=======================================
    // Validates datetime in YYYY-MM-DD HH:MM format
    // Accepts both 24h and 12h formats (am pm)
    // Accepts YYYY-MM-DD (HH:MM omitted)
    // Bissextile years are properly processed
    // Suitable for use as validate callback in a text component of a setting
    function validateDateTime(dateString, config){
        dateString = dateString.trim();
        if (dateString.length > 18){
           return errorWrongDateTimeFormat;
        } else {
            let result = validateDate(dateString.slice(0,10), config);
            if (result === errorOutOfRange) return errorOutOfRange;
            if (result !== true) return errorWrongDateTimeFormat;
            if (dateString.length === 10) return true; //Valid YYY-MM-DD and nothing else
            result = validateTime(dateString.slice(0,16));
            if (result === errorOutOfRange) return errorOutOfRange;
            if (result !== true) return errorWrongDateTimeFormat;
            if (dateString.length === 16){
                return true
            } else {
                if (dateString.length === 18){
                    let suffix = dateString.slice(16)
                    if (suffix === 'am' || suffix === 'pm'){
                        let hh = Number(dateString.slice(11, 13))
                        if (hh < 1 || hh > 12){return errorOutOfRange}
                        return true
                    } else {
                        return errorWrongDateTimeFormat;
                    }
                }
                return errorWrongDateTimeFormat;
            };
        };
        return errorWrongDateTimeFormat;
    };

    //=======================================
    // Validates datetime in YYYY-MM-DD HH:MM format or relative time format
    // Accepts both 24h and 12h formats (am pm)
    // Accepts YYYY-MM-DD (HH:MM omitted)
    // Bissextile years are properly processed
    // Suitable for use as validate callback in a text component of a setting
    function validateDateTimeRelative(dateString, config){
        dateString = dateString.trim();
        if (dateString.match(/^([+-])(?:(\d+)[dD])?(?:(\d+)[hH])?(?:(\d+)[mM])?$/) !== null){
            if (dateString === '+' || dateString === '-') return errorWrongDateTimeRelativeFormat
            return true;
        } else {
            let result = validateDateTime(dateString, config)
            if (result === true || result === errorOutOfRange) return result;
            return errorWrongDateTimeRelativeFormat;
        }
    };

    //=======================================
    // Validate datetime in YYYY-MM-DD HH:MM:SS.mmm format
    // Seconds and milliseconds are optional
    // Bissextile years are properly processed
    // Suitable for use as validate callback in a text component of a setting
    function validateDateTimeFull(dateString, config){
        dateString = dateString.trim();
        let result = validateDateTime(dateString.slice(0, 16), config);
        if (result === errorOutOfRange){
            return errorOutOfRange;
        } else if (result !== true){
            return errorWrongDateTimeFullFormat;
        } else if (dateString.length <= 16){
            return true // seconds and milliseconds omitted
        } else {
            var regEx = /^:(\d{2}|\d{2}\.\d{3})$/;
            if(!dateString.slice(16).match(regEx)) return errorWrongDateTimeFullFormat; // Invalid format
            let d = new Date(dateString);
            let dNum = d.getTime();
            if(!dNum && dNum !== 0) return errorOutOfRange; // NaN value, Invalid date
            return true
        }
    }

    //=======================================
    // Validate datetime in YYYY-MM-DD HH:MM:SS.mmm format or relative format
    // Seconds and milliseconds are optional
    // Bissextile years are properly processed
    // Suitable for use as validate callback in a text component of a setting
    function validateDateTimeFullRelative(dateString, config){
        dateString = dateString.trim();
        if (dateString.match(/^([+-])(?:(\d+)[dD])?(?:(\d+)[hH])?(?:(\d+)[mM])?(?:(\d+)[sS])?$/) !== null){
            if (dateString === '+' || dateString === '-') return errorWrongDateTimeFullRelativeFormat
            return true;
        } else {
            let result = validateDateTimeFull(dateString, config)
            if (result === true || result === errorOutOfRange) return result;
            return errorWrongDateTimeFullRelativeFormat;
        }
    };

    //=======================================
    // Validates dates in YYYY-MM-DD format
    // Bissextile years are properly processed
    // Suitable for use as validate callback in a text component of a setting
    function validateDate(dateString, config, keyword) {
        dateString = dateString.trim();
        let regEx = /^\d{4}-\d{2}-\d{2}$/;
        if(!dateString.match(regEx)) return errorWrongDateFormat; // Invalid format
        let d = new Date(dateString);
        let dNum = d.getTime();
        if(!dNum && dNum !== 0) return errorOutOfRange; // NaN value, Invalid date
        let r = d.toISOString().slice(0,10) === dateString;
        if (r) {
            return true
        } else {
            return errorOutOfRange
        };
    }

    //=======================================
    // Validates dates in YYYY-MM-DD format or relative format
    // Bissextile years are properly processed
    // Suitable for use as validate callback in a text component of a setting
    function validateDateRelative(dateString, config){
        dateString = dateString.trim();
        if (dateString.match(/^([+-])(?:(\d+)[dD])?$/) !== null){
            if (dateString === '+' || dateString === '-') return errorWrongDateRelativeFormat
            return true;
        } else {
            let result = validateDate(dateString, config)
            if (result === true || result === errorOutOfRange) return result;
            return errorWrongDateRelativeFormat;
        }
    };

    //=======================================
    // Helper function to validate time in HH:MM format
    // It should not be publicly exposed
    function validateTime(timeString) {
      let regEx = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/;
      if(!timeString.match(regEx)) return 'No match'; // Invalid format
      let d = new Date(timeString);
      let dNum = d.getTime();
      if(!dNum && dNum !== 0) return errorOutOfRange; // NaN value, Invalid date
      return true
    }

    //=======================================
    // Parses a validated date in YYYY-MM-DD format
    // Also parse a validated datetime in YYYY-MM-DD HH:MM format
    // Parses datetime in both 12h and 24h formats
    // Parses optional seconds and milliseconds
    // Returns the corresponding date object for this date/datetime in the local time zone
    // May return an invalid date if presented with empty or invalid data - but not always
    // If there is doubt about the quality of the data, validate first
    // Suitable to parse a validated date from a text component in a setting
    function parseDateTime(dateString) {
        dateString = dateString.trim(); // validation allows leading and trailing blanks
        try {
            if (dateString === '') return new Date('###'); // returns an invalid date
            let match = dateString.match(/^([+-])(?:(\d+)[dD])?(?:(\d+)[hH])?(?:(\d+)[mM])?(?:(\d+)[sS])?$/);
            if (match !== null){
                if (dateString === '+' || dateString === '-') return new Date('###'); // returns an invalid date
                let date = Date.now();
                let sign = (match[1] === '+' ? 1 : -1);
                let days = (match[2] || 0) * 86400000;
                let hrs = (match[3] || 0) * 3600000;
                let min = (match[4] || 0) * 60000;
                let sec = (match[5] || 0) * 1000;
                return new Date(date + sign * (days + hrs + min + sec));
            }
            // new Date() uses local time zone when the parameters are separated
            let YY = Number(dateString.substring(0, 4));
            let MM = Number(dateString.substring(5, 7))-1;
            let DD = Number(dateString.substring(8, 10));
            let hh = (dateString.length >= 13) ? Number(dateString.substring(11, 13)) : 0;
            let mm = (dateString.length >= 16) ? Number(dateString.substring(14, 16)) : 0;
            let ss = (dateString.length >= 19) ? Number(dateString.substring(17, 19)) : 0;
            let ml = (dateString.length === 23) ? Number(dateString.substring(20, 23)) : 0;

            let suffix = (dateString.length === 18) ? dateString.substring(16, 18) : ''
            if (suffix === 'am' || suffix === 'pm'){ // if 12 hours format, convert to 24 hours
                if (hh === 12) hh = 0;
                if (suffix === 'pm') hh += 12;
            }
            return new Date(YY, MM, DD, hh, mm, ss, ml);
        } catch (e) {
            return new Date('###'); // returns an invalid date in case of error
        }
    }


})(window.wkof);