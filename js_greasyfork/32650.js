// ==UserScript==
// @name        PepperPlate Planner
// @namespace   danielezecchin.it
// @description One-click scheduling of recipes
// @include     http://www.pepperplate.com/recipes/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/32650/PepperPlate%20Planner.user.js
// @updateURL https://update.greasyfork.org/scripts/32650/PepperPlate%20Planner.meta.js
// ==/UserScript==


var Recipe = function () {
	this.url = location.href;
	this.window = open( this.url );
	this.title = $( '#cphMiddle_cphMain_lblTitle' ).text();
}

Recipe.timesOfDay = {
	morning : "1",
	midday  : "3",
	evening : "4"
};

Recipe.prototype.add = function ( days ) {
	this.days = days || 0;
	console.log( 'Ricetta da fare tra', this.days, 'giorni.' )
	this.window
		.$('#cphMiddle_cphSidebar_spSidebar_repPlannerDays_lbAdd_' + this.days)
			.trigger('click')
}

Recipe.prototype.addThis = function () {
	console.log( 'Aggiungi ricetta.')
	var $link = this.window
		.$('#cphMiddle_cphSidebar_spSidebar_repPlannerDays_lbAddThisRecipe_' + this.days);
	if ( ! $link.length ) {
		console.warn( 'Link non trovato!');
		return;
	}
	$link.length && $link[0].click()
}

Recipe.prototype.timeOfDay = function ( value ) {
	console.log( 'Mattina / pomeriggio / sera', value );
	var $selectBox = this.window
		.$( '#cphMiddle_cphSidebar_spSidebar_repPlannerDays_ddlMeal_'+ this.days );
	if ( ! $selectBox.length ) {
		console.warn( 'Select box non trovata!' );
		return;
	}
	var selectBox = $selectBox[0];
	selectBox.value = value;
	$selectBox.trigger( 'click' );
	this.window
		.$('#cphMiddle_cphSidebar_spSidebar_repPlannerDays_lbSave_' + this.days )[0]
		.click()
}

function wait( options ) {
	console.log( 'waiting...' );
	var n = 0;
	var condition = options.until || true;
	var takeAction = options.then || function () {};
	var timer = setInterval( function() {
		console.log( ++n );
		if ( condition() ) {
			clearInterval( timer );
			console.log( 'ok' );
			takeAction();
		}
	}, 100 );
}



$('.planner .schedule .content').each( ( n, item ) => {
	console.log( n, item );
	[ 'morning', 'midday', 'evening' ].forEach( text => {
		var button =  document.createElement( 'span' );
		button.classList.add( 'time-of-day' );
		button.innerText = ' ' + text + ' ';
		$( button ).click(() => {
			console.log({ 
				n : n, 
				time_of_day : Recipe.timesOfDay[ text ] ,
				text : text
			});
			addRecipe( n, Recipe.timesOfDay[ text ]);
		}).appendTo( item );
	});
});

function addRecipe( days, timeOfDay ) {
	var recipe = new Recipe();
	wait({ 
	until : () => recipe.window.$,
		then  : () => {
			recipe.add( days );
			wait({ 
				until : () => recipe.window.$,
				then  : () => {
					recipe.addThis();
					wait({ 
						until : () => recipe.window.$,
						then  : () => {
							recipe.timeOfDay( timeOfDay );
							wait({ 
								until : () => recipe.window.$,
								then  : () => {
									recipe.window.close()
									location.reload();
								}
							});	
						}
					});	
				}
			});	

		}
	});	
}

