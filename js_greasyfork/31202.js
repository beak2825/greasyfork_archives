var modules = modules || {};

modules.flashingEscortButton = {

	name: 'Flashing Escort Button',

	description: 'Makes your escort button flash, to remind you to click it!',

	icon: '/gfx/icons/small_escort.gif',

	pages: 'outside',

	defaults: {
		background1: '#FF0000',
		background2: '#FFFF00',
		textColour1: '#FFFF00',
		textColour2: '#FF0000'
	},

	init: function() {

		this.setButtonStyles();

	},

	config: function() {

		var content;

		content = '<h2>Options</h2>';
		
		content += '<ul id="modules-flashingEscortButton-config-colours">';
		content += '<li class="color" data-id="background1">';
		content += '<label>Background colour #1</label>';
		content += '<div class="demo"></div>';
		content += '<div class="arrow"></div>';
		content += '<input disabled="disabled">';
		content += '</li>';
		content += '<li class="color" data-id="background2">';
		content += '<label>Background colour #2</label>';
		content += '<div class="demo"></div>';
		content += '<div class="arrow" style="display: none"></div>';
		content += '<input style="display: none" disabled="disabled">';
		content += '</li>';
		content += '<li class="color" data-id="textColour1">';
		content += '<label>Text colour #1</label>';
		content += '<div class="demo"></div>';
		content += '<div class="arrow" style="display: none"></div>';
		content += '<input style="display: none" disabled="disabled">';
		content += '</li>';
		content += '<li class="color" data-id="textColour2">';
		content += '<label>Text colour #2</label>';
		content += '<div class="demo"></div>';
		content += '<div class="arrow" style="display: none"></div>';
		content += '<input style="display: none" disabled="disabled">';
		content += '</li>';
		content += '<li>';
		content += '<div class="slider"></div><div class="sliderText"></div>';
		content += '</li>';
		content += '</ul>';
		
		content += '<div id="modules-flashingEscortButton-config-colourpicker" data-id="background1"></div>';
		
		content += '<a class="button modules-flashingEscortButton-config-escortButton"><img alt="" src="http://data.die2nite.com/gfx/icons/small_escort.gif"> Wait for an escort</a>';

		return content;

	},

	configInit: function() {

		modules.flashingEscortButton.setButtonStyles();

		$('.slider').slider({
			value: localStorage.getItem('modules.flashingEscortButton.config.speed') || '2',
			min: 0,
			max: 5,
			slide: function( event, ui ) {
				var speed;
				localStorage.setItem('modules.flashingEscortButton.config.speed', ui.value);
				speed = modules.flashingEscortButton.getSpeed()
				$('#modules-flashingEscortButton-config-colours .sliderText').html(speed + ' second' + (speed == '1' ? '' : 's'));
				modules.flashingEscortButton.setButtonStyles();

			}
		});

		modules.flashingEscortButton.config.picker = $.farbtastic('#modules-flashingEscortButton-config-colourpicker', function() {
			var color = this.color.toUpperCase();
			var id = $('#modules-flashingEscortButton-config-colourpicker').attr('data-id');

			$('#modules-flashingEscortButton-config-colours li[data-id="' + id + '"] input').css({
				'backgroundColor': color,
				'color': modules.flashingEscortButton.contrast(color)
			}).val(color);

			if (color.match(/^#[0-9A-Fa-f]{6}/)) {
				localStorage.setItem('modules.flashingEscortButton.' + id, color);
				modules.flashingEscortButton.setButtonStyles();
			}
		})

		var color = localStorage.getItem('modules.flashingEscortButton.background1') || modules.flashingEscortButton.defaults.background1;
		modules.flashingEscortButton.config.picker.setColor(color);
		$('#wee').css({
			'backgroundColor': color,
			'color': modules.flashingEscortButton.contrast(color)
		}).val(color);

		$('#modules-flashingEscortButton-config-colours li.color').off().on('click', function() {

			var id;
			var color;

			id = $(this).attr('data-id');
			color = localStorage.getItem('modules.flashingEscortButton.' + id) || modules.flashingEscortButton.defaults[id];

			$('#modules-flashingEscortButton-config-colours .arrow, #modules-flashingEscortButton-config-colours input').hide();

			$('#modules-flashingEscortButton-config-colourpicker').attr('data-id', id);
			modules.flashingEscortButton.config.picker.setColor(color);

			$('input', this).css({
				'backgroundColor': color,
				'color': modules.flashingEscortButton.contrast(color)
			}).val(color);

			$('.arrow, input', this).show();

		})

		modules.flashingEscortButton.setButtonStyles();
		
		speed = modules.flashingEscortButton.getSpeed();
		
		$('#modules-flashingEscortButton-config-colours .sliderText').html(speed + ' second' + (speed == '1' ? '' : 's'));
	},

	setButtonStyles: function() {

		var backgroundCss;
		var css;
		var background1;
		var background2;
		var textColour1;
		var textColour2;
		var speedSeconds;

		background1 = localStorage.getItem('modules.flashingEscortButton.background1') ||  modules.flashingEscortButton.defaults.background1;
		background2 = localStorage.getItem('modules.flashingEscortButton.background2') ||  modules.flashingEscortButton.defaults.background2;
		textColour1 = localStorage.getItem('modules.flashingEscortButton.textColour1') ||  modules.flashingEscortButton.defaults.textColour1;
		textColour2 = localStorage.getItem('modules.flashingEscortButton.textColour2') ||  modules.flashingEscortButton.defaults.textColour2;
		
		backgroundCss = 'from { color: ' + textColour1 + '; background: ' + background1 + '; }' +
		'to { color: ' + textColour2 + '; background:' + background2 + '; }';

		css = '@-moz-keyframes flash{' + backgroundCss + '}' +
		'@-webkit-keyframes flash{' + backgroundCss + '}';

		speedSeconds = modules.flashingEscortButton.getSpeed()
		
		if (localStorage.getItem('modules.flashingEscortButton.enabled') != 'false') {
			css += '.who a.button[href*="waitForLeader"],';
		}
		css += 'a.button.modules-flashingEscortButton-config-escortButton {' +
		'background-image: none !important;line-height: 20px; width: auto;' +
		'-moz-animation: flash ' + speedSeconds + 's infinite linear alternate;' +
		'-webkit-animation: flash ' + speedSeconds + 's infinite linear alternate; }';
		
		css += '#modules-flashingEscortButton-config-colours li[data-id="background1"] div.demo { background-color: ' + background1 + ';}' +
		'#modules-flashingEscortButton-config-colours li[data-id="background2"] div.demo { background-color: ' + background2 + ';}' +
		'#modules-flashingEscortButton-config-colours li[data-id="textColour1"] div.demo { background-color: ' + textColour1 + ';}' +
		'#modules-flashingEscortButton-config-colours li[data-id="textColour2"] div.demo { background-color: ' + textColour2 + ';}';
		app.addStyle(css, 'modules-flashingEscortButton-buttonStyle', true);

	},

	contrast: function(color) {

		var brightness;
		var rgb, r, g, b;

		rgb = color.match(/^#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);
		
		if (null == rgb) {
			return "#FF0000";
		}
		
		r = parseInt(rgb[1], 16);
		g = parseInt(rgb[2], 16);
		b = parseInt(rgb[3], 16);

		brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000 / 255;

		return brightness >= 0.5 ? "#000000" : "#FFFFFF";

	},

	getSpeed: function() {
		
		var speed;
		var speedText;
		
		speed = localStorage.getItem('modules.flashingEscortButton.config.speed') || '2';

		switch(speed) {
			case '0':
				speedText = '2';
				break;
			case '1':
				speedText = '1';
				break;
			case '2':
				default:
				speedText = '0.5';
				break;
			case '3':
				speedText = '0.25';
				break;
			case '4':
				speedText = '0.1';
				break;
			case '5':
				speedText = '0.01';
				break;
		}
		
		return speedText;
	}

}