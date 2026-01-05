// ==UserScript==
// @name        Scrying Workshop Reworked
// @namespace   http://www.flightrising.com/
// @description UX Improvements for Flight Rising's Scrying Workshop and Search
// @include     http://flightrising.com/main.php?p=scrying&view=*
// @include     https://flightrising.com/main.php?p=scrying&view=*
// @include     http://flightrising.com/main.php?*&tab=dragon*
// @include     https://flightrising.com/main.php?*&tab=dragon*
// @include     http://flightrising.com/main.php?dragon=*
// @include     https://flightrising.com/main.php?dragon=*
// @include     http://flightrising.com/main.php?p=search&search=dragon
// @include     https://flightrising.com/main.php?p=search&search=dragon
// @version     1.16
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/380/Scrying%20Workshop%20Reworked.user.js
// @updateURL https://update.greasyfork.org/scripts/380/Scrying%20Workshop%20Reworked.meta.js
// ==/UserScript==


var theColors = ["none", "Maize", "White", "Ice", "Platinum", "Silver", "Grey", "Charcoal", "Coal", "Black", "Obsidian", "Midnight", "Shadow", "Mulberry", "Thistle", "Lavender", "Purple", "Violet", "Royal", "Storm", "Navy", "Blue", "Splash", "Sky", "Stonewash", "Steel", "Denim", "Azure", "Caribbean", "Teal", "Aqua", "Seafoam", "Jade", "Emerald", "Jungle", "Forest", "Swamp", "Avocado", "Green", "Leaf", "Spring", "Goldenrod", "Lemon", "Banana", "Ivory", "Gold", "Sunshine", "Orange", "Fire", "Tangerine", "Sand", "Beige", "Stone", "Slate", "Soil", "Brown", "Chocolate", "Rust", "Tomato", "Crimson", "Blood", "Maroon", "Red", "Carmine", "Coral", "Magenta", "Pink", "Rose"];
var theGenders = ["Male","Female"];
var theBreeds = ["None", "Fae", "Guardian", "Mirror", "Pearlcatcher", "Ridgeback", "Tundra", "Spiral", "Imperial", "Snapper", "Wildclaw", "Nocturne", "Coatl", "Skydancer"];
var primaryGenes = ["Basic", "Iridescent", "Tiger", "Clown", "Speckle", "Ripple", "Bar", "Crystal", "Vipera", "Piebald", "Cherub", "Poison"];
var secondaryGenes = ["Basic", "Shimmer", "Stripes", "Eye Spots", "Freckle", "Seraph", "Current", "Daub", "Facet", "Hypnotic", "Paint", "Peregrine", "Toxin"];
var tertiaryGenes = ["Basic", "Circuit", "Unknown 2", "Unknown 3", "Gembond", "Underbelly", "Crackle", "Smoke", "Spines", "Okapi", "Glimmer"];
var theElements = ["None", "Earth", "Plague", "Wind", "Water", "Lightning", "Ice", "Shadow", "Light", "Arcane","Nature", "Fire"];
	
function privateEye() {
	$('select[name="breed"]').attr('id','breed');
	$('select[name="gender"]').attr('id','gender');
	$('select[name="pc"]').attr('id','bodycolor');
	$('select[name="sc"]').attr('id','wingcolor');
	$('select[name="tc"]').attr('id','tertcolor');
	$('select[name="pg"]').attr('id','prigene');
	$('select[name="sg"]').attr('id','secgene');
	$('select[name="tg"]').attr('id','tertgene');
	$('form:first-of-type').after('<div id="results" style="margin-top: 1em;"></div>');
	var theURL = $('form:first-of-type').attr('action');
	$('.mb_button').after('<input type="button" value="Reset" style="background-color:#731d08; color:#fff; border:1px solid #000; height:25px; width:130px; font-weight:bold; margin-left: 1em; margin-right: 2em;" class="mb_button" onclick="wipeIt();">').parent('div').after('<div style="position: relative; left: 195px; top: -2.25em; display: inline;"><input type="checkbox" name="hideGone" id="hideGone" value="hideGone">Hide Exalted</div>');
	function prettyIt(stuff) {
		var resultData = $($.parseHTML(stuff)).find("#super-container").children('div').toArray();
		$('#results').html(resultData[2]);
		$('#results a[href*="did"]').attr('target','_blank');
		$('#results>div:first-of-type>div:first-of-type').attr('style','font-size:12px; text-align:center').css('margin-bottom','.5em');
		$('#results>div:first-of-type>div:nth-of-type(2)').attr('style','font-size:12px; text-align:center; line-height:1.5em; margin-bottom:.25em;');		
		$('#results>div:first-of-type>div:nth-of-type(2)>span:first-of-type').hide();
		$('#results>div:first-of-type>div:nth-of-type(2)>span:nth-of-type(2)').attr('id','pages');
		if ($('#results>div:first-of-type>div:first-of-type>span:nth-of-type(2)').text() > 20) {
			$('#pages').css('float','none');
			$('#pages').html(function () {
				return $(this).html().replace('Page ', ''); 
			});
			if($('a:contains("»")').length) {
				$('a:contains("»")').html('<img src="/images/layout/arrow_right.png" style="vertical-align:middle; margin-left: 1em;"/>');
			} else {
				$('#pages').append('<img src="/images/layout/arrow_right_off.png" style="vertical-align:middle; margin-left: 1em;"/>');
			}
			if($('a:contains("«")').length) {
				$('a:contains("«")').html('<img src="/images/layout/arrow_left.png" style="vertical-align:middle; margin-right: 1em;"/>');		
			} else {
				$('#pages').prepend('<img src="/images/layout/arrow_left_off.png" style="vertical-align:middle; margin-right: 1em;"/>');
			}
		}
		$('#pages').clone().attr('id','pages2').appendTo( "#results>div" );
		$('#pages2').css('font-size','12px').css('width','100%').css('text-align','center').css('margin-top','-1em');
		$('#results img[src*="avatar"]').parent('a').each(function() {
			var theID = (/did=(\d+)/.exec($(this).attr('href')))[1];
			$(this).attr('rel','includes/ah_dragonajax.php?id='+theID);
			$(this).cluetip({
				height: 380,
				ajaxCache: true,
				onShow: function (ct, ci) {
					var thePicture = '<img src="rendern/350/' + (parseInt(10*(theID/1000))+1) + '/' + theID + '_350.png" width="265px">';
					$('#cluetip div[style*="color:#999"]').html(thePicture);
				} 
			});
		});		
		exaltBeGone();
	}	
	function exaltBeGone() {
		if ($('#hideGone').is(':checked')) {
			$('#results img[src*="avatar"]').parent('a').parent('span').parent('span:contains("Exalted")').hide();
			if($('#results img[src*="avatar"]').parent('a').parent('span').parent('span').length-$('#results img[src*="avatar"]').parent('a').parent('span').parent('span:contains("Exalted")').length<1) {
				$('#pages2').hide();
			}
		} else {
			$('#results img[src*="avatar"]').parent('a').parent('span').parent('span:contains("Exalted")').show();
			$('#pages2').show();
		}
	}
	$('#hideGone').change( function () {
		exaltBeGone();
	});
	$('form:first-of-type').submit(function (e) {
        e.preventDefault();
		$('#results').html('<center><br><br>Searching...<br><br><img src="/images/layout/loading.gif"></center>');
		$.ajax({
			type: "POST",
			data: $('form').serialize(), 
			url: theURL,
			cache:false
		}).done(function(stuff){
			prettyIt(stuff);
		}); 
	}); 
	this.sPage = function (page) {
		$("#newpage").val(page);
		var newData = $('form').serialize();
		var newURL = $('#searched').attr('action');
		$('#results').html('<center><br><br>Loading...<br><br><img src="/images/layout/loading.gif"></center>');
		$.ajax({
			type: "POST",
			data: newData, 
			url: newURL,
			cache:false
		}).done(function(stuff){
			prettyIt(stuff);
		}); 
	}
	this.wipeIt = function () {
		$('form')[0].reset();
		$('#results').html('');
	}
}	
	
function changingRoom() {
	$( document ).on( "click", "#scry", function() {
		var theDragon = parseInt((/did=(\d+)/.exec(window.location.href) || /dragon=(\d+)/.exec(window.location.href))[1]);
		localStorage.setItem('scrying_greenranger',theDragon);
		movinRightAlong('morphintime');
	});
}

function showMeYourTrueColors(theSource) { 
	// then, put together the translations
	var dragonInfo = parseQueryString(theSource);
	var breed = theBreeds[parseInt(dragonInfo["style"])] + "</font></b><hr>";
	var gender = "|<b><font color=#731d08>" + theGenders[parseInt(dragonInfo["gender"])];
	var primary = "<b>Primary Gene:</b> " + theColors[parseInt(dragonInfo["body"])] + " " + primaryGenes[parseInt(dragonInfo["prig"])];
	var secondary = "<b>Secondary Gene:</b> " + theColors[parseInt(dragonInfo["wing"])] + " " + secondaryGenes[parseInt(dragonInfo["secg"])];
	var tertiary = "<b>Tertiary Gene:</b> " + theColors[parseInt(dragonInfo["tert"])] + " " + tertiaryGenes[parseInt(dragonInfo["tertg"])];

	// then, assign the translations to the rel
	return  gender + ' ' + breed + '|' + primary + '|' + secondary + '|' + tertiary;
}

function metaMorph() {
	var theRound = 0;
	this.lolRedNinjaRanger = function() { 
		if($('#greenranger').val() && theRound === 0){
			theRound = 1; 
//			$('#summon_dragon').click();
			setTimeout( "$('#summon_dragon').click();",250 );
		} else if($("#breed").val()&&$("#gender").val()&&$("#setage").val()&&$("#prigene").val()&&$("#bodycolor").val()&&$("#secgene").val()&&$("#wingcolor").val()&&$("#tertgene").val()&&$("#tertcolor").val()&&$("#element").val()) { 
			lolRedRanger(); 
		} else {
			alert('oops');
			$('#newdragon').html(""); 
		}
		$(document).ajaxSuccess(function(e, xhr, options) {
			if (options.url.indexOf('getstats') > -1 ) {
//			alert('round: '+theRound);
				if (theRound == 1 && $('#setage').val() == 0) {
//					alert('ok');
				$('#setage').val(1).attr('selected','selected');
				theRound = 2;
				lolRedRanger();
			}
			}
		});
	} 
	
	this.runAway = function() { 
		$("#makindragons")[0].reset(); 
		$('#searcher').css('display','none');
		$("#newdragon").html(""); 
	} 
	
	this.cowsWithHats = function() { 
		$("select").each(function() { 
			var theOptions = $(this).find("option"), 
				random = ~~(Math.random() * theOptions.length); 
			theOptions.eq(random).prop("selected", true); 
		});
		lolRedRanger(); 
		$('#searcher').css('display','block');
	} 

	this.canWeFixIt = function() {
		$('select').attr('onChange','lolRedNinjaRanger()');
		$('#bodycolor').insertBefore($('span:contains("Primary Gene")'));
		$('#bodycolor').before($('span:contains("Primary Color")')).before(' ');
		$('#wingcolor').insertBefore($('span:contains("Secondary Gene")'));
		$('#wingcolor').before($('span:contains("Secondary Color")')).before(' ');
		$('#tertcolor').insertBefore($('span:contains("Tertiary Gene")'));
		$('#tertcolor').before($('span:contains("Tertiary Color")')).before(' ');
		$('#makindragons br').remove();
		$('select').after('<br>');
		$('#makindragons').attr('style','position: relative; top:15px;');
		$('#makindragons .thingbutton').css('display','none');
		$('#element').after('<br/><input class="beigebutton thingbutton" type="button" onclick="movinRightAlong(\'dragon\')" value="Search?" id="searcher" style="position: relative; top: .8em; padding: 0px 20px; margin: 5px 45px 0; width: 120px;">').after('<br/><input class="beigebutton thingbutton" type="button" onclick="runAway()" value="Reset" style="position: relative; top: .5em; padding: 0px 20px; margin: 5px 45px 0; width: 120px;">').after('<br/><input class="beigebutton thingbutton" type="button" onclick="cowsWithHats()" value="Random" style="position: relative; top: .3em; padding: 0px 20px; margin: 5px 45px 0; width: 120px;">');
	}
}

function picturePicture() {
	$( document ).on( "click", "#preview img", function() {
		var dragonInfo = parseQueryString($(this).attr('src'));
		localStorage.setItem('scrying_breed',parseInt(dragonInfo["style"]));
		localStorage.setItem('scrying_gender',parseInt(dragonInfo["gender"]));
		localStorage.setItem('scrying_setage',1);
		localStorage.setItem('scrying_bodycolor',parseInt(dragonInfo["body"]));
		localStorage.setItem('scrying_wingcolor',parseInt(dragonInfo["wing"]));
		localStorage.setItem('scrying_tertcolor',parseInt(dragonInfo["tert"]));
		localStorage.setItem('scrying_prigene',parseInt(dragonInfo["prig"]));
		localStorage.setItem('scrying_secgene',parseInt(dragonInfo["secg"]));
		localStorage.setItem('scrying_tertgene',parseInt(dragonInfo["tertg"]));
		localStorage.setItem('scrying_element',parseInt(dragonInfo["elem"]));
		movinRightAlong('morphintime');
	});
	$('#id10t1').css('left','10px').css('text-align','right').before('<div id="pic1" style="height: 175px; width: 175px; position: absolute; bottom: 70px; left:-8px;"></div>');
	$('#id10t2').css('left','552px').before('<div id="pic2" style="height: 175px; width: 175px; position: absolute; left: 545px; bottom: 70px"></div>');
	if ($('div[style*="bg_assaybloodlines"]').length != 0) {
		$('#pic1').css('bottom','140px').css('left', '60px');
		$('#pic2').css('bottom','140px').css('left', '331px');
	}	
	function showMeNow() { 
		var id = $(this).attr('id').slice(-1);
		if ($(this).val() !== "") {
			var theDragon = $(this).val().match(/[^\=]+$/)[0].replace(/\s+/g, "").replace(/\D+/g, "");
			$(this).val(theDragon);
			if (theDragon) {	
				var theGroup = (parseInt(10*(theDragon/1000))+1);
				$('#pic'+id).html('<a href="main.php?dragon='+theDragon+'"><img id="Dragon'+id+'" src="rendern/350/'+theGroup+'/'+theDragon+'_350.png" width="175px"></a>');
				$('#Dragon'+id).error(function(){
					$('#id10t'+id).val('');
					$('#pic'+id).html('');
				});
			}
		} else {
			$('#pic'+id).html('');			
			$('#check').css('display','none');
		}
		if ($('#id10t1').val()||$('#id10t2').val()) {
			// lower opacity bg
			$('img[src*="bg_foreseeprogeny"]').css('opacity','0.4');
		} else {
			// full opacity bg
			$('img[src*="bg_foreseeprogeny"]').css('opacity','1');
		}
		if($(this).val() === '') {
			$('#pic'+id).html('');		
			$('#check').css('display','none');
		}
		$('#validity').html('');
		$('#symbol').html('');
	}
	$('input[id*="id10t"]').change(showMeNow); 	
}

function exogamyFTW() {
	$('.thingbutton').attr('onclick','hipCheck()');
	$('#id10t1').parent('div:first-child').attr('style','vertical-align:middle; width:570px; margin-left:0px; padding-top:100px; text-align: center;').after('<div id="symbol" style="position: relative; font-size: 80px; top: -250px; width: 570px; text-align: center; visibility: hidden;"></div>').after('<div id="validity" style="width:140px; font-size: 12px; text-align: center; margin: 1em auto;"></div>');
	this.hipCheck = function() {
		$('#symbol').css('visibility','hidden');
		var id10t1 = $('#id10t1').val();
		var id10t2 = $('#id10t2').val();
		$("#validity").html('<img src="/images/layout/loading.gif"> loading...');
		$.ajax({
			type: "POST",
			data: {id1: id10t1, id2: id10t2},
			url: "includes/ol/scryer_bloodlines.php",
			cache:false
		}).done(function(stuff){
			var theVerdict = $($.parseHTML(stuff)).toArray();
			$("#validity").html($(theVerdict[2]).text().replace('Success!','<h2 style="color:green; margin: -8px auto 2px;">Success!</h2>')).append('<input class="beigebutton thingbutton" style="padding: 5px 20px; margin-top: .75em; left: -3px;" type="button" border="0" onclick="movinRightAlong(\'progeny\')" value="Scry Progeny?">');
			if($("#validity").text().indexOf( "Success" ) !== -1) {
				$('#symbol').css('color','green').text('✔').css('top','-275px').css('visibility','visible');
			} else {
				$('#symbol').css('color','red').text('✖').css('top','-290px').css('visibility','visible');
			} 
		});
	}
}

function theWorks() {
	this.movinRightAlong = function(where) {
		localStorage.setItem('scrying_destination',where);
		localStorage.setItem('scrying_id10t1',$('#id10t1').val());
		localStorage.setItem('scrying_id10t2',$('#id10t2').val());
		$('select').each(function() {
			localStorage.setItem('scrying_'+$(this).attr('id'),$(this).val());
		});
		if(where === 'bloodlines') {
			window.location = "main.php?p=scrying&view=bloodlines";
		} else if(where === 'progeny') {
			window.location = "main.php?p=scrying&view=progeny";
		} else if(where === 'morphintime') {
			var win = window.open("main.php?p=scrying&view=morphintime","_blank");
			win.focus();
		} else if(where === 'dragon') {
			var win = window.open("main.php?p=search&search=dragon","_blank");
			win.focus();
		}
	}
	this.parseQueryString = function(theString) {
		theString = theString.slice(34);
		var query = theString,
			map   = {};
		query.replace(/([^&=]+)=?([^&]*)(?:&+|$)/g, function(match, key, value) {
			(map[key] = map[key] || []).push(value);
		});
		return map;
	} 
}

$(document).ajaxSuccess(function(e, xhr, options) {
	if (options.url.indexOf('scryer_get') > -1) {
		canWeFixIt();
	} else if (options.url.indexOf('scryer_progeny') > -1) {
		$('#par1').remove();
		$('#par2').remove();
		$('#preview img').each(function() {
			$(this).attr('title',showMeYourTrueColors($(this).attr('src')));
			$(this).cluetip({splitTitle: '|', width: 245, height: "auto", cursor: "pointer", positionBy: "fixed", leftOffset: "-10px", topOffset: "95px"});
		});
		$('#check').css('display','inline');
	}
});

function InjectScript(func, documentLoaded) {
	// Function stolen-I-mean-borrowed from the old FRE script
    // If head isn't ready, defer execution (this is Chrome support shenanigans)
    var head = document.head || document.getElementsByTagName("head")[0];
    if (head) {
        var source = func.toString();
        var scriptEl = document.createElement('script');
        scriptEl.setAttribute("id", func.name);
        scriptEl.setAttribute("type", "text/javascript");
        if (documentLoaded) {
            source = "document.addEventListener('DOMContentLoaded', " + source + ", true);";
        } else {
            source = "(" + source + ")();";
        }
        scriptEl.innerHTML = source;
        head.appendChild(scriptEl);
    }
    else {
        setTimeout(function() { InjectScript(func, documentLoaded); }, 0);
    }
}

var thePage = document.location.href.match(/[^\=]+$/)[0];
InjectScript(theWorks);
if (thePage === "dragon") {
	InjectScript(privateEye);
} else if (thePage === "bloodlines") {
	InjectScript(picturePicture);
	InjectScript(exogamyFTW);
} else if (thePage === "progeny") {
	InjectScript(picturePicture);
	InjectScript(showMeYourTrueColors);
	$('input[value="Preview"]').parent('div').css('width','250px').css('text-align','center');
	$('input[value="Preview"]').after('<input class="beigebutton thingbutton" type="button" onclick="movinRightAlong(\'bloodlines\')" id="check" style="margin-top: .5em; display: none;" value="Check Bloodlines?">');
} else if (thePage === "morphintime") {
	InjectScript(metaMorph);
	runAway();
} else {
	InjectScript(changingRoom);
	$('span[style="position:absolute; bottom:10px; right:110px;"]').css('right','207px');
	$('span[style="position:absolute; bottom:10px; right:-10px;"]').css('right','87px');
	$('div[style*="390px"]').css('width','320px').parent('span').parent('div').append('<span style="position:absolute; bottom:10px; right:-10px;"><input type="image" id="scry"  src="http://i59.tinypic.com/21erkfk.png" value="Scry"></span>');
	
} 

var thePage = document.location.href.match(/[^\=]+$/)[0];
if(localStorage.getItem('scrying_destination') === thePage) {
	for(var key in localStorage) {
		if (key.indexOf("scrying_") > -1) {
			$('#'+key.slice(8)).val(localStorage.getItem(key));
			localStorage.removeItem(key);
		}
	}
	if(thePage === 'bloodlines') {
		$( "#id10t1" ).trigger( "change" );
		$( "#id10t2" ).trigger( "change" );
		hipCheck();
	} else if(thePage === 'progeny') {
		$( "#id10t1" ).trigger( "change" );
		$( "#id10t2" ).trigger( "change" );
		showNewbies();
	} else if(thePage === 'morphintime') {	
		lolRedNinjaRanger();
	} else if(thePage === 'dragon') {
		$( "form:first" ).submit();
	}
}