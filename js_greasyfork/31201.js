var modules = modules || {};

modules.devtools = {

	name: 'Developer Tools',

	description: 'Tools for developers.',

	icon: '/gfx/icons/small_calim.gif',

	pages: '.',

	init: function() {
	},

	config: function() {

		var content = '<h2>localStorage</h2>';

		if (localStorage.length > 0){

			var keys = [];
			for (var i = 0; i < localStorage.length; i++) {
				keys.push(localStorage.key(i));
			}
			keys.sort();

			content += '<div class="modules-devtools-localStorage"><table class="settings-table"><thead><tr><th>Clear</th><th>Key</th><th>Value</th></tr></thead><tbody>';

			for (var j = 0; j < keys.length; j++) {

				var key = keys[j];

				content += (j % 2) ? '<tr class="even">' : '<tr class="odd">';
				content += '<td><button class="clear modules-devtools-clearKey" data-key="' + key + '">X</td>';
				content += '<td>';
				content += key;
				content += '</td>';
				content += '<td>' + localStorage.getItem(key) + '</td>';
				content += '</tr>';

			}

			content += '</tbody></table></div>';
			content += '<p><button class="clear modules-devtools-clearAllKeys">Clear all keys</button></p>';

			$(document).on('click', '.modules-devtools-clearKey', function(e) {
				$(document).off('click', '.modules-devtools-clearKey');
				var target = $(e.target);
				var key = target.attr('data-key');
				localStorage.removeItem(key);
				app.settings.openSettings()
			});

			$(document).on('click', '.modules-devtools-clearAllKeys', function(e) {
				$(document).off('click', '.modules-devtools-clearAllKeys');
				localStorage.clear();
				app.settings.openSettings()
			});

		} else {

			content += '<p>localstorage is empty!</p>';

		}

		return content;

	}
}