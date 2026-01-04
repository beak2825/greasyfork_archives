var modules = modules || {};

modules.ghoulHungerPercentages = {

	name: 'Ghoul Hunger Percentages',

	description: 'Shows the percentage of your hunger bar.',

	icon: '/gfx/icons/small_ghoul.gif',

	pages: '.',

	init: function() {

		var ghoulBox = $('#ghoulHunger');

		if (ghoulBox.length == 0) {
			return;
		}

		var hungerContent = $('.content', ghoulBox);
		if (!hungerContent || !hungerContent.html()) {
			return;
		}

		if (hungerContent.html().match(/\%/)) {
			return;
		}

		var hungerBarWidth = 150; // pixels
		var hungerLimit = 40; // percent
		var hungerWidth = parseInt($('.hbar', ghoulBox).width());
		var percentageOfBar = 100 / hungerBarWidth * hungerWidth;
		var percentageOfHunger = 100 / hungerLimit * percentageOfBar;
		var newText = "Hunger : " + Math.round(percentageOfBar) + "% (" + Math.round(percentageOfHunger) + "% of limit)";

		var currentContent = hungerContent.html();

		hungerContent.html(currentContent.replace('Hunger :', newText));

		ghoulBox.domChange(function() {
			window.setTimeout(modules.ghoulHungerPercentages.init, 1000);
		});

	},

	config: function() {

		var content = '';

		content += '<h2>Before</h2>';
		content += '<img alt="before" src="http://die2nite.gamerz.org.uk/gm/images/mod_ghoulHungerPercentages_before.png">';
		content += '<h2>After</h2>';
		content += '<img alt="after" src="http://die2nite.gamerz.org.uk/gm/images/mod_ghoulHungerPercentages_after.png">';

		return content;
	}
}