// ==UserScript==
// @name         Clanheart Alpha Creator Extended
// @namespace    fortytwo
// @version      1.34
// @description  This script changes the drop downs on CH's alpha creator to colours. No more wondering what colour Galaxy or Brick is!
// @author       fortytwo
// @match        http://clan.arvixecloud.com/~jakosse/laravel/public/
// @require		 https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @grant		 none
// @downloadURL https://update.greasyfork.org/scripts/11707/Clanheart%20Alpha%20Creator%20Extended.user.js
// @updateURL https://update.greasyfork.org/scripts/11707/Clanheart%20Alpha%20Creator%20Extended.meta.js
// ==/UserScript==

/***
	NOTICE: YOU ARE AGREEING THAT ANY USE OF THE FOLLOWING SCRIPT IS AT
	YOUR OWN RISK. I DO NOT MAKE ANY GUARANTEES THE SCRIPT WILL WORK, NOR 
	WILL I HOLD MYSELF ACCOUNTABLE FOR DAMAGE TO YOUR DEVICE.

	IF THE SCRIPT ISN'T WORKING FOR YOU, FEEL FREE TO SEND ME A MESSAGE: http://games-fortytwo.tumblr.com/
***/
$(document).ready(function(){
//mapping colour names to the appropriate rgb
//http://clanheart.tumblr.com/post/125971903821/eimitanrising-a-polished-collection-of-the
var colours =[
	["None", '255, 255, 255'],
	["Zinnia Red", '232, 5, 5'],
	["Hot Pink", '255, 15, 127'],
	["Neon Purple", '255, 15, 247'],
	["Royal Purple", '179, 15, 225'],
	["Galaxy", '119, 15, 225'],
	["Cobalt", '51, 15, 255'],
	["Azure", '15, 107, 255'],
	["Cerulean", '15, 147, 255'],
	["Aqua", '15, 195, 255'],
	["Teal", '16, 255, 231'],
	["Leaf", '16, 255, 159'],
	["Harlequin", '16, 255, 75'],
	["Chartreuse", '135, 255, 15'],
	["Pear", '195, 255, 15'],
	["Sunlight", '243, 255, 15'],
	["Gold", '255, 199, 15'],
	["Monarch", '255, 139, 15'],
	["Pumpkin", '255, 87, 15'],
	["Coral", '255, 79, 79'],
	["Fuschia", '255, 79, 138'],
	["Magenta", '255, 79, 240'],
	["Electric Purple", '205, 79, 255'],
	["Violet", '144, 79, 255'],
	["Sapphire Blue", '79, 100, 255'],
	["Cornflower", '79, 146, 255'],
	["Sky Blue", '79, 176, 255'],
	["Electric Blue", '79, 232, 255'],
	["Tropical Sea", '79, 255, 214'],
	["Eucalpytis", '79, 255, 141'],
	["Emerald", '88, 255, 79'],
	["Clover", '146, 255, 79'],
	["Key Lime", '188, 255, 79'],
	["Lemon", '237, 255, 79'],
	["Jasmine", '255, 211, 79'],
	["Amber", '255, 167, 79'],
	["Carrot", '255, 129, 79'],
	["Salmon", '255, 153, 153'],
	["Bubblegum", '255, 153, 182'],
	["Carnation", '255, 153, 212'],
	["Heliotrope", '245, 153, 255'],
	["Crocus", '204, 153, 255'],
	["Wisteria", '163, 153, 255'],
	["Powder Blue", '153, 184, 255'],
	["Baby Blue", '153, 219, 255'],
	["Cyan", '153, 255, 250'],
	["Aquamarine", '153, 255, 204'],
	["Mint", '153, 255, 167'],
	["Celery", '182, 255, 153'],
	["Peridot", '228, 255, 153'],
	["Canary", '255, 230, 153'],
	["Peach", '255, 211, 153'],
	["Apricot", '255, 184, 153'],
	["Rose Quartz", '255, 212, 212'],
	["Blush", '255, 212, 229'],
	["Petal Pink", '255, 212, 241'],
	["Lilac", '241, 212, 255'],
	["Lavender", '222, 212, 255'],
	["Periwinkle", '212, 217, 255'],
	["Frost", '212, 233, 255'],
	["Ice", '212, 250, 255'],
	["Spearmint", '212, 255, 244'],
	["Cucumber", '212, 255, 225'],
	["Honeydew", '228, 255, 212'],
	["Ivory", '246, 255, 212'],
	["Cream", '255, 238, 212'],
	["Eggshell", '255, 225, 212'],
	["White", '255, 255, 255'],
	["Ash", '235, 235, 235'],
	["Oyster", '212, 212, 212'],
	["Silver", '181, 181, 181'],
	["Gray", '148, 148, 148'],
	["Overcast", '122, 122, 122'],
	["Smoke", '94, 94, 94'],
	["Coal", '66, 66, 66'],
	["Caviar", '38, 38, 38'],
	["Black", '0, 0, 0'],
	["Garnet", '21, 2, 2'],
	["Burgundy", '51, 2, 41'],
	["Blackberry", '35, 2, 51'],
	["Tanzanite", '9, 2, 51'],
	["Prussian Blue", '2, 31, 51'],
	["Amazon", '2, 51, 50'],
	["Hunter Green", '2, 51, 27'],
	["Moss", '23, 38, 3'],
	["Olive", '43, 43, 2'],
	["Chocolate", '43, 28, 2'],
	["Seal", '43, 12, 2'],
	["Cinnamon", '84, 38, 38'],
	["Brick", '84, 38, 64'],
	["Maroon", '80, 38, 84'],
	["Plum", '56, 38, 84'],
	["Vineyard", '38, 42, 84'],
	["Indigo", '38, 59, 84'],
	["Deep Sea", '38, 80, 84'],
	["Denim", '40, 86, 72'], //CLOSEST MATCH
	["Hunter", '38, 84, 61'], //RENAMED. OFFICIAL 
	["Fern", '56, 84, 38'],
	["Avocado", '83, 84, 38'],
	["Sage", '84, 68, 38'],
	["Sepia", '84, 56, 33'], //CLOSEST MATCH
	["Sienna", '84, 52, 38'], //OFFICIAL
	["Dusty Rose", '140, 91, 116'],
	["Mauve", '136, 91, 140'],
	["Eggplant", '107, 91, 140'],
	["Ube", '91, 97, 140'],
	["Lazuli", '91, 121, 140'],
	["Slate", '91, 130, 135'],//CLOSEST MATCH
	["Juniper", '91, 140, 135'], //OFFICIAL
	["Jade", '91, 140, 106'], //OFFICIAL
	["Asparagus", '104, 140, 91'],
	["Clay", '140, 135, 91'],
	["Beaver", '140, 123, 91'],
	["Umber", '140, 108, 91'],
	["Taupe", '140, 98, 91'],
	["Redwood", '164, 90, 82'], //OFFICIAL
	["Blood", '196, 79, 79'],
	["Mulberry", '196, 79, 145'],
	["Orchid", '173, 79, 196'],
	["Amethyst", '126, 79, 196'],
	["Blueberry", '79, 86, 196'],
	["Hydrangea", '79, 149, 196'],
	["Turqouise", '79, 196, 183'],
	["Grass", '79, 196, 116'],
	["Shamrock", '116, 196, 79'],
	["Citron", '179, 196, 79'],
	["Goldenrod", '196, 183, 79'],
	["Fawn", '196, 147, 79'],
	["Rust", '196, 108, 79'],
	["Poinsetta", '196, 79, 79'] //OFFICIAL
];

/*** STYLING ***/
$('head').append(
"<style>"+
".ace-overlay{position:absolute;top:0px;left:0px;}"+
".custom-dropdown-text{width:100% !important}"+
"</style>");

/***
	CUSTOM DROP DOWN SCRIPT BY FORTYTWO
***/
function dropDown(appendTo, name){
	this.element = $(appendTo);
	this.name = name;
	this.text = this.hidden = this.select = null;
	this.events ={ onchange: [], onmenuclose: [], onmenuopen: [] };

	this._init();
}

dropDown.prototype ={
	/*** INTERNAL FUNCTIONS ***/
	//css stuff and the block
	_firstRun: function(){
		$("head").append($(
		"<style>"+
		".custom-dropdown-text{border-radius:4px;padding:6px 12px;width:100%;border:1px solid #ccc;}"+
		".custom-dropdown-text-active{"+
		"	box-shadow:inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, .6)}"+
		".custom-dropdown-select{display:none;}"+
		".custom-dropdown-select-active{height:300px; width:300px; overflow-y:scroll;position:absolute;"+
		"	background:#fff;z-index:10510; border: 1px solid #66afe9;display:block; }"+
		".custom-dropdown-option{whitespace:pre;min-height:1.2em;padding:3px 12px;}"+
		".custom-dropdown-option:hover{opacity:0.5}"+
		"#custom-dropdown-overlay{top:0;right:0;left:0;bottom:0;opacity:10;"+
		"	position:fixed;z-index:10500; display:none;}"+
		".custom-dropdown-overlay-active{display:block !important;}"+
		".custom-noselect{-webkit-touch-callout: none; -webkit-user-select: none;"+
		"	-khtml-user-select: none; -moz-user-select: none;"+
		"	user-select: none;}"+
		"</style>"));

		this.block = $("<div />", {id: "custom-dropdown-overlay"});
		this.block.addClass('custom-dropdown-overlay');
		$("body").append(this.block);
	},

	_init: function(){
		var _this = this;
		//create elements and styles
		this.text = $("<input />", {
			type: 'text',
			'class': 'custom-dropdown-text',
			//prevents editing of the content
			readonly: true
		});

		this.hidden = $("<input />", {
			type: 'hidden',
			'class': 'custom-dropdown-hidden',
			name: this.name,
			id: this.name
		});
		
		this.select = $("<div />", { 'class': 'custom-dropdown-select custom-noselect'});
		//disable right click to act like select
		this.select.on('contextmenu', function(){ return false; });
	
		//we use this fixed full-page overlay behind the drop down
		//in order for us to be able to click out of it efficiently
			
		//check we don't have one already
		if(document.getElementById('custom-dropdown-overlay') === null)
			this._firstRun();
		//if we do, use it
		else
			this.block = $('#custom-dropdown-overlay');

		//now we need to install some normal behaviour
		this
			.on('MenuClose', function(){
				_this.select.removeClass("custom-dropdown-select-active");
				_this.block.removeClass("custom-dropdown-overlay-active");
				_this.text.removeClass("custom-dropdown-text-active");
				$('body').removeClass('custom-noselect');
			})
			.on('MenuOpen', function(){
				_this.select.addClass("custom-dropdown-select-active");
				_this.block.addClass("custom-dropdown-overlay-active");
				_this.text.addClass("custom-dropdown-text-active");
				
				//makes it so nothing can be selected just like <select>
				$('body').addClass('custom-noselect');
				
				//ensure our select fits the viewport
				//to do this, we'll utilize positions relative the viewport.
				//this just makes it easier for us.
				var bodyRect	= document.body.getBoundingClientRect(),
					textRect	= _this.text[0].getBoundingClientRect(),
					selectRect	= _this.select[0].getBoundingClientRect(),
					//height of the size we can see, essentially
					viewport	= document.documentElement.clientHeight,
					//distance from top of VP to the element
					textTop		= textRect.top,
					textHeight	= textRect.height,
					menuHeight	= selectRect.height;

				//if there's not enough space below to display our complete, display
				//it above the text box
				if((textTop + textHeight + menuHeight) > viewport){
					_this.select.css('top', -(menuHeight-1));
				}
				else{
					//back to normal
					_this.select.css('top', textHeight-1);
				}
				
				//additionally, also match the dropdown's width to the textbox
				_this.select.css('width', textRect.width);
			})
			.on('Change', function(data){
				//we need to set our hidden's value
				_this.hidden.val(data.value);
				_this.text.val(data.option.html());

				//trigger any onchange handlers so it works much like a select
				_this.hidden.change();
			});

		this.text.on('click', function(){
			_this.trigger("onMenuOpen");
		});

		this.block.on('click', function(){
			_this.trigger("onMenuClose");
		});
		
		this.text.on('resize', function(){
			//_this._adjustDropDownArrow($(this));
		});
		
		//add these elements
		this.element.append(this.text).append(this.hidden).append(this.select);
		//this._adjustDropDownArrow(this.text);

		return this;
	},

	/* for determining where to position the drop down arrow */
	_adjustDropDownArrow: function(textbox){
		var textRect = textbox[0].getBoundingClientRect();
		var position = (textRect.width-13)+"px";
	//	textbox.css('background', "#fff url('"+GM_getResourceURL('arrow')+"') no-repeat "+position+" center");
	},

	/*** PUBLIC FUNCTIONS ***/
	/* triggers an event to occur */
	trigger: function(event, data){
		var eventsToCall = this.events[event.toLowerCase()];
		
		for(i = 0; i < eventsToCall.length; ++i){
			eventsToCall[i](data);
		}
		return this;
	},

	/* allows for event-like functionality */
	on: function(event, callback){
		//use lowercase to ensure people don't use the wrong case
		event = event.toLowerCase();
		this.events['on'+event].push(callback);
		return this;
	},

	addOption: function(data){
		var _this = this;
		
		var option = $("<div />")
			.html(data.text)
			.addClass('custom-dropdown-option');

		if(data.unselectable !== undefined){
			option.attr('data-unselectable', (data.unselectable ? true : false));
		}
		//if it's selectable, then it also has a value.
		else{
			option.attr('data-value', data.value);
		}

		//for when option is selected
		option.on('click', function(){
			if(!$(this).attr('data-unselectable')){
				//call menu close event
				_this.trigger('onMenuClose');
				//trigger the change handler
				_this.trigger('onChange', {
					value: $(this).attr('data-value'),
					option: $(this)
				});
			}	
		});

		this.select.append(option);

		//return it so we can use it outside
		return option;
	}
};

//based on http://stackoverflow.com/questions/8022885/rgb-to-hsv-color-in-javascript
function getV(rgbString){
	var components = rgbString.split(", ");
	var r = components[0] / 255,
        g = components[1] / 255,
        b = components[2] / 255;

     return Math.round((Math.max(r, g, b)) * 100);
}

function customDropDowns(){
	//our selects that we wanna change
	var selects	= $('#bases, #eyes, #dyn, #marking_color'),
		//get all the columns we're gonna change
		columns	= selects.parent();

	for(i = 0; i < columns.length; i++){
		var column		= $(columns[i]),
			//fetch the id so we can replicate the form-like action
			select		= selects.eq(i),
			//make our custom dropper
			dropdown	= new dropDown(column, select.attr('id'));

		//remove previous content
		select.remove();

		//because we want to do some fancy css stuff to the bg
		dropdown.on('Change', function(data){
			var option = data.option;

			//hack because dropdown.text.css({ ... }) doesn't work properly??
			var textbox = option.parent().prev().prev();
			textbox.css({
				"background-color": option.css("background-color"),
				"color": option.css('color')
			});
		});

		//go through and add the colours to our custom
		for(id = 0; id < colours.length; ++id){
			var
				name = colours[id][0],
				rgb = colours[id][1],
				v = getV(rgb);

			titleize(dropdown, name);

			//add our option
			dropdown
				.addOption({
					value: id,
					text: name
				})
				.css({
					'background-color': "rgb("+rgb+")",
					'color': (v < 50 ? "#fff" : "#000")
				});
		}
	}
}

//this code adds headers to the select boxes, so we know what it's classed as
function titleize(dropdown, name){
	switch(name){
		case "Zinnia Red": var text = "BRIGHT COLOURS"; break;
		case "Coral": var text = "DARK PASTEL"; break;
		case "Salmon": var text = "PASTEL COLOURS"; break;
		case "Rose Quartz": var text = "PALE COLOURS"; break;
		case "White": var text = "GREYSCALE COLOURS"; break;
		case "Garnet": var text = "DARK COLOURS"; break;
		case "Cinnamon": var text = "MIDDLE COLOURS"; break;
		case "Dusty Rose": var text = "UNSATURATED COLOURS"; break;
		case "Blood": var text = "RICH COLOURS"; break;
	}

	//if we have a title, put it in
	if(text){
		dropdown.addOption({
			text: text,
			unselectable: true
		});
	}
}

//'nother mac fix...
function overrideBehaviour(){
	//change some styling
	$('#petgencont').css('position', 'relative');
	//hack by removing the default behaviour
	$('#continue input[type="button"]')
		.attr('onclick', "")
		//add our own overriding functionality
		.on('click', function(){
			
			//first, get the pet image
			$('#petgencont').fadeOut(200, function() {
				$.ajax({
					url: 'index.php/create/genpet',
					type: 'GET',
					data: {
						'baseid' :  $('#bases').val(),
						'eyeid' : $('#eyes').val(),
						'speciesid' : $('#species').val(),
						'shading_color' : $('#shading_color').val(),
						'highlight_color' : $('#highlight_color').val(),
						'lineart_color' : $('#lineart_color').val(),
						'markingid' : $('#markings').val(),
						'marking_color' : $('#marking_color').val(),
						'dyn_color' : $('#dyn').val(),
						//CH doesn't understand true/false
						'apply_dyn' : ($('#apply_dyn').prop("checked") ? 1 : 0),
						//CH doesn't use this, but we might as well keep it in 
						//for future-proofing
						'gender': $('input[name=gender]:checked').val()
					},
					success: function(msg) {
						//replace the content
						$('#petgencont').html(msg.replace("index.php/", "")).delay(500);
						$('#petgencont').fadeIn(200);

						//now add any overlays. line by line
						if($('#ace-overlays').val().length > 0){
						var overlays = $('#ace-overlays').val().split("\n");
						for(i = 0; i < overlays.length; ++i){
							var overlayURL = overlays[i];
							$("<img src='"+overlayURL+"' class='ace-overlay' />").appendTo($('#petgencont'));
						}
						}
					}
				});
			});
			

		});
}

function addOverlaysBox(){
	var row = $("<div class='align-center'>Add things (such as accessories or dyes) here. It must be an image URL. Separate each URL by a new line. Make sure each one is the same dimensions as the pet image.<br /></div>").insertBefore($('#continue'));
	var textarea = $("<textarea id='ace-overlays' cols='50' rows='5'></textarea>").appendTo(row);
}


//run app
customDropDowns();
addOverlaysBox();
overrideBehaviour();
});