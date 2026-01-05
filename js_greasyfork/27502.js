// ==UserScript==
// @name         WME City Name Marker
// @description  Add keyboard keys ESC and Enter. Auto click on icon edit and selected city name (for editors 5+).
// @namespace    https://greasyfork.org/scripts/27502-wme-city-name-marker
// @include      https://*waze.com/*editor*
// @exclude      https://*waze.com/*user/editor*
// @grant        none
// @author       Alexash
// @version      0.5.1
// @downloadURL https://update.greasyfork.org/scripts/27502/WME%20City%20Name%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/27502/WME%20City%20Name%20Marker.meta.js
// ==/UserScript==

$('#sidebar').on('keyup', 'input.city-name', function(event) {

    if (event.keyCode == 13)
    {
        applyClick();

        if (false) {
            saveClick();
        }
    }

    if (event.keyCode == 27) {
        $('button.cancel-button').click();
    }
});

$('#sidebar').on('focus', 'input.city-name', function() {
    $(this).select();
});

$('#WazeMap').on('mouseup', '.city-name-marker', function() {

	setTimeout(function() {
        $('.preview').attr('style','display: none;');
        $('.attributes-form.inner-form').attr('style','display: block;');
        $('input.city-name').select();
    }, 0);

});

function applyClick()
{
        $('button.save-button').click();
}

function saveClick()
{
        setTimeout(function() {
            $('.toolbar-button.waze-icon-save.ItemInactive').click();
        }, 1000);
}


$('#sidebar').bind('keydown', 'input.city-name', function(e) {

    if (e.ctrlKey && (e.which == 83)) {
        e.preventDefault();

        applyClick();
        saveClick();

    return false;
  }
});

function toggleCitiesNames()
{
	var layer_cities = $('#layer-switcher-group_cities');
    var layer_city_names = $('#layer-switcher-item_city_names');

	if (!(layer_cities.prop('checked') && layer_city_names.prop('checked')))
	{
		if (layer_cities.prop('checked'))
		{
			layer_cities.click();
		}

		if (layer_city_names.prop('checked'))
		{
			layer_city_names.click();
		}

	}

    layer_cities.click();
    layer_city_names.click();
}

function wmeCNM_Init()
{
    I18n.translations[I18n.locale].keyboard_shortcuts.groups['default'].members.WME_city_name_marker_layer = "Toggle Cities with Names";
    Waze.accelerators.addAction("WME_city_name_marker_layer", {group: 'default'});
    Waze.accelerators.events.register("WME_city_name_marker_layer", null, toggleCitiesNames);
    Waze.accelerators._registerShortcuts({ 'm' : "WME_city_name_marker_layer"});
}

function wmeCNM_bootstrap()
{
    setTimeout(wmeCNM_Init, 1000);
}

wmeCNM_bootstrap();
