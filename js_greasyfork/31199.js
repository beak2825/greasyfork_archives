var app = {

	init: function() {

		log('app.init()');

		app.addStyle(GM_getResourceText('style.css'), 'style-css');

		for (var moduleName in modules) {

			var module = modules[moduleName];
			if (window.location.hash.match(new RegExp(module.pages)) && 'false' != localStorage.getItem('modules.' + moduleName + '.enabled')) {
				module.init();
			}
		}

	},
	
	settings: {

		init: function() {

			log('app.settings.init()');

			// create settings button

			if ($('#appsettings').length == 0) {

				var content = $('<div/>').attr('id', 'appsettings').html('<div class="content">Open Settings</div>');

				$('.infoBar .forumButton').before(content);

				$('#appsettings').on('click', '.content', function() {
					app.settings.openSettings();
				});
			}

		},

		openSettings: function() {

			log('app.settings.openSettings()');

			var html = '<table id="gameLayout" class="appsettings guide"><tbody><tr><td class="sidePanel"><div class="block mapBlock"><div class="header"></div><div class="bg">';
			html += '<ul id="modules">';
			html += '<li class="main">Modules</li>';

			for (var module in modules) {

				html += '<li class="sub ';
				html += localStorage.getItem('modules.' + module + '.enabled') == 'false' ? 'disabled' : 'enabled';
				html += '" data-module-id="' + module + '">';
				html += '<img height="16" width="16" alt="' + modules[module].name + '" src="' + modules[module].icon + '"> <span>' + modules[module].name + '</span><span class="tick"></li>';
			}

			html += '				</ul>\
								</div> \
								<div class="footer"></div> \
							</div> \
						</td> \
						<td class="contentPanel"> \
							<div class="block contentBlock"> \
								<div class="header"></div> \
								<div class="bg"> \
									<div id="generic_section"></div> \
								</div> \
								<div class="footer"></div> \
								<div class="clear"></div> \
							</div> \
						</td> \
					</tr> \
				</tbody> \
			</table>';

			if ($('#gameLayout').hasClass('appsettings')) {
				$('#gameLayout').replaceWith($(html));
			} else {
				var currentLayout = $('#gameBodyLight > :last-child');
				var id = currentLayout.attr('id');
				currentLayout.attr('data-old-id', id).attr('id', 'settings-hidden').hide();

				$('#gameBodyLight').append(html);

				$('#appsettings .content').html('Close Settings');
			}

			var moduleToOpen = localStorage.getItem('app.settings.lastOpened') || $('#modules li.sub:first').attr('data-module-id');
			$('#modules li.sub[data-module-id="' + moduleToOpen + '"]').addClass('active');

			app.settings.moduleSettings(moduleToOpen);

			$('#gameLayout').off().on('click', 'li.sub', function() {
				var moduleName = $(this).attr('data-module-id');
				app.settings.moduleSettings(moduleName);
			})

			$('#appsettings').off().on('click', '.content', function() {
				app.settings.closeSettings();
			})

		},

		moduleSettings: function(moduleName) {

			log('app.settings.moduleSettings(' + moduleName + ')');

			moduleName = moduleName || localStorage.getItem('app.settings.lastOpened');

			if (!moduleName || !modules[moduleName]) {
				moduleName = $('#modules li.sub:first').attr('data-module-id');
			}

			localStorage.setItem('app.settings.lastOpened', moduleName);

			var module = modules[moduleName];

			$('.appsettings .active').removeClass('active');
			$('#modules li[data-module-id="' + moduleName + '"]').addClass('active');

			var html = '<h1>' + module.name + '<span>' +
			'<label for="modules-' + moduleName + '-enabled">Module Enabled:</label>' +
			'<input type="checkbox" id="modules-' + moduleName + '-enabled" class="modules-settings-enabled" data-module-id="' + moduleName + '" value="1" ' +
			(localStorage.getItem('modules.' + moduleName + '.enabled') == 'false' ? '' : 'checked="checked"') +
			'></span></h1>';

			if (module.description) {
				html += '<p class="description">' + module.description + '</p>';
			}

			if (undefined !== module.config) {
				html += module.config();
			} else {
				html += '<p>This module has no configuration options.</p>';
			}

			$('#gameLayout #generic_section').html(html);

			if (undefined !== module.configInit) {
				module.configInit();
			}

			$('#gameLayout #generic_section').off('change', '.modules-settings-enabled');

			$('#gameLayout #generic_section').on('change', '.modules-settings-enabled', function() {

				var moduleName = $(this).attr('data-module-id');

				$('li[data-module-id="' + moduleName + '"]').toggleClass('enabled disabled');

				localStorage.setItem('modules.' + moduleName + '.enabled', $(this).is(':checked') ? 'true' : 'false');
			})

		},

		closeSettings: function() {

			log('app.settings.closeSettings()');

			$('#gameLayout').remove();

			var currentLayout = $('#gameBodyLight > :last-child');
			currentLayout.attr('id', currentLayout.attr('data-old-id')).show();

			$('#appsettings').off().on('click', '.content', function() {
				app.settings.openSettings();
			})

			$('#appsettings .content').html('Open Settings');

			app.init();

		},

		checkbox: function(id, label, defaultCheckedStatus, onChange) {

			var storageKey = id;
			var elementId = id.replace(/\./g, '_');

			var moduleHtml = '';
			var checked = localStorage.getItem(storageKey) ? (localStorage.getItem(storageKey) == 'true') : (defaultCheckedStatus == 'true');

			moduleHtml += '<input type="checkbox" id="' + elementId + '" value="1" data-storage-key="' + storageKey + '"' + ((checked == true) ? ' checked="checked"' : '') + ' >';
			moduleHtml += '<label for="' + elementId + '">' + label + '</label>';

			if (onChange) {
				$('#gameLayout #generic_section').on('change', '#' + elementId, onChange);
			} else {
				$('#gameLayout #generic_section').on('change', '#' + elementId, function(e) {
					var target = $(e.target);
					localStorage.setItem(target.attr('data-storage-key'), target.is(':checked') ? 'true' : 'false');
				});
			}

			return moduleHtml;
		},

		select: function(id, selected, indexes, values) {

			if (!selected) {
				selected = indexes[0];
			}

			if (!values) {
				values = indexes;
			}

			var content  = '<select id="' + id + '">';

			for (var i in indexes) {
				var index = indexes[i];
				var value = values[i];
				content += '<option value="' + index + '"';
				if (selected == index) {
					content += ' selected="selected"';
				}
				content += '>' + value + '</option>';
			}

			content += '</select>';

			return content;

		}

	},

	addStyle: function(css, className, replace) {

		log('app.addStyle(css, ' + className + ')');

		var sheet;

		if (true !== replace) {
			replace = false;
		}

		sheet = $('.' + className);

		if (sheet.length > 0) {
			if (replace) {
				sheet.remove();
			} else {
				return;
			}
		}

		var style = document.createElement('style');
		style.className = className;
		style.type = 'text/css';
		style.innerHTML = css;
		$('head').append(style);
	}
	
}