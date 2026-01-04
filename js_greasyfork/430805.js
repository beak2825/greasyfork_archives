// ==UserScript==
// @name		AO3: [Wrangling] n-in-1 Wrangling Home Filter(s)
// @description	have different categories of wrangling home filters
// @version		1.0.2
// @author		Rhine
// @namespace	https://github.com/RhineCloud
// @match		*://*archiveofourown.org/tag_wranglers/*
// @require		https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @grant		none
// @license		GPL-3.0 <https://www.gnu.org/licenses/gpl.html>
// @downloadURL https://update.greasyfork.org/scripts/430805/AO3%3A%20%5BWrangling%5D%20n-in-1%20Wrangling%20Home%20Filter%28s%29.user.js
// @updateURL https://update.greasyfork.org/scripts/430805/AO3%3A%20%5BWrangling%5D%20n-in-1%20Wrangling%20Home%20Filter%28s%29.meta.js
// ==/UserScript==

// detailed instructions and explanations at:
// https://github.com/RhineCloud/ao3-scripts/blob/main/n-in-1-filters-readme.md#n-in-1-wrangling-home-filters

// SETTINGS //

// list of your fandoms that you want to add specific filters to
// the format of each line is: Fandom Canonical, mediatype, source1 source2 etc, co?
// the script can identify various media types if it's at the end of the fandom tag as a standard disambig
// only co-wrangled fandoms need the "co" at the end to mark them as such
// anything else after the third comma gets interpreted as a solo-wrangled fandom
// after the first comma, the number of spaces around each comma cease to matter, and neither does capitalisation
// if nothing follows in that line, you can skip everything after the first comma altogether
// having more than 3 commas here will cause the script to not recognise your input
var my_fandoms = `
DCU, amt, dcu, co
DCU (Comics),,   DCU   ,   Co
Dead Rising (Video Games),
`;

// for all the toggle text to be in lower case, set this to false
var uppercase_in_toggles = true;

// maximum number of unwrangled tags of each category
// where you'd still consider the fandom to be quickly wrangled
// set all three to 0 to disable
// set char and rel to -1 to disable the digging filter
// set ff to -1 to disable the shoveling filter
var few_char_max = 20;
var few_rel_max = 30;
var few_ff_max = 40;

// the point from which on you consider a fandom to be a dumpster fire
// you can also use n * 20 with n being the number of pages
// set all three to -1 to disable
var many_char_min = 3 * 20;
var many_rel_min = 5 * 20;
var many_ff_min = 500;

// the minimum size of a unfilterable freeforms bin you'd want to go ro3-hunting in
// set to 0 if you want all bins with unfilterable freeforms
// set to -1 to disable this option entirely
var ro3_min = 100;

// default filters
// '-all' in media and source means no filters are getting applied here
// for source use the same spelling as up above in my_fandoms
var filter_media = '-all';
var filter_source = '-all';
var filter_fandom = 'has-uw';

// END OF SETTINGS //

// split each line in the my_fandoms list into its own thing
var known_fandoms = my_fandoms.trim().split('\n');


// MAIN FUNCTION //
(function($) {
	// start some lists to keep track of all the different options
	var media_options = ['-all'];
	var source_options = ['-all'];
	var fandom_options = ['all-fandoms'];
	var has_co = false;
	
	// copy the table on the wrangling home
	var assigned_fandoms = $('#user-page table tbody tr');
	
	// go through all the fandoms
	assigned_fandoms.each(function() {
		// grab the fandom name
		var fandom_name = $(this).find('th').text();
		
		// use the fandom name to try to detect the media type
		var detected_media = '';
		if (fandom_name.endsWith(' - All Media Types') || fandom_name.endsWith(' & Related Fandoms')) {
			detected_media = 'amt';
		} else if (fandom_name.endsWith('RPF')) {
			detected_media = 'rpf';
		} else if (fandom_name.endsWith(' Commercial') || fandom_name.endsWith(' Commercials')) {
			detected_media = 'commercial';
		} else if (fandom_name.endsWith(' Folklore') || fandom_name.endsWith(' Lore') ||
			fandom_name.endsWith(' Mythology') || fandom_name.endsWith(' Religion') ||
			fandom_name.endsWith(' Traditions')) {
			detected_media = 'rellore';
		} else if (fandom_name.endsWith(')')) {
			var disambig_start = fandom_name.lastIndexOf('(');
			var fandom_disambig = fandom_name.slice(disambig_start+1, -1);
			
			switch (fandom_disambig) {
				case 'Album':
				case 'Albums':
					detected_media = 'album';
					break;
				case 'Alternate Reality Game':
					detected_media = 'arg';
					break;
				case 'Anime':
					detected_media = 'anime';
					break;
				case 'Anime & Manga':
					detected_media = 'animanga';
					break;
				case 'Anthropomorphic':
					detected_media = 'anthro';
					break;
				case 'Big Finish Audio':
					detected_media = 'audio';
					break;
				case 'Band':
					detected_media = 'band';
					break;
				case 'Bande Dessinée':
					detected_media = 'bede';
					break;
				case 'Blog':
				case 'Blog Post':
				case 'Tumblr':
				case 'Twitter':
					detected_media = 'blog';
					break;
				case 'Board Game':
				case 'Board Games':
					detected_media = 'boardgame';
					break;
				case 'Card Game':
				case 'Card Games':
					detected_media = 'cardgame';
					break;
				case 'Cartoon':
				case 'Cartoons':
					detected_media = 'cartoon';
					break;
				case 'Comic':
				case 'Comics':
					detected_media = 'comic';
					break;
				case 'Commercial':
				case 'Commercials':
					detected_media = 'commercial';
					break;
				case 'Drama CD':
					detected_media = 'dramacd';
					break;
				case 'Fairy Tale':
					detected_media = 'fairytale';
					break;
				case 'Graphic Novel':
				case 'Graphic Novels':
					detected_media = 'graphicnovel';
					break;
				case 'Interactive Fiction':
					detected_media = 'interactive';
					break;
				case 'Manga':
					detected_media = 'manga';
					break;
				case 'Manhua':
					detected_media = 'manhua';
					break;
				case 'Manhwa':
					detected_media = 'manhwa';
					break;
				case 'Movie':
				case 'Movies':
					detected_media = 'movie';
					break;
				case 'Music Video':
				case 'Music Videos':
					detected_media = 'musicvideo';
					break;
				case 'Musician':
				case 'Musicians':
					detected_media = 'musician';
					break;
				case 'Podcast':
					detected_media = 'podcast';
					break;
				case 'Poem':
					detected_media = 'poem';
					break;
				case 'BBC Radio':
				case 'Radio':
				case 'Radio Show':
					detected_media = 'radio';
					break;
				case 'Folklore':
					detected_media = 'rellore';
					break;
				case 'Roleplay':
					detected_media = 'roleplay';
					break;
				case 'Roleplaying Game':
				case 'RPG':
				case 'Tabletop RPG':
					detected_media = 'rpg';
					break;
				case 'Short Film':
				case 'Short Films':
					detected_media = 'shortfilm';
					break;
				case 'Song':
				case 'Songs':
					detected_media = 'song';
					break;
				case 'TV':
				case 'Live Action TV':
					detected_media = 'tvshow';
					break;
				case 'Video Game':
				case 'Video Games':
					detected_media = 'videogame';
					break;
				case 'Visual Novel':
				case 'Visual Novels':
					detected_media = 'visualnovel';
					break;
				case 'Web Series':
				case 'Webseries':
					detected_media = 'webseries';
					break;
				case 'Webcomic':
					detected_media = 'webcomic';
					break;
				default:
				if (!(Number.isNaN(fandom_disambig)) && (fandom_disambig.length == 4)) {
					detected_media = 'movie';
				} else {
					detected_media = '';
				}
			}
		}
		
		// check if there's a matching fandom in my_fandoms
		var fandom_ref = '';
		known_fandoms.forEach(function(current_fandom) {
			if (current_fandom.startsWith(fandom_name + ',')) {
				fandom_ref = current_fandom.trim().toLowerCase().split(',');
			}
		});
		
		// add some classes based on my_fandoms data
		var source_added = false;
		switch (fandom_ref.length) {
			case 4:
				// add solo-/co-wrangling status
				var wrangler = fandom_ref[3].trim();
				if (wrangler == 'co') {
					var wrangler_class = get_classes('fandom', 'co-wrangled');
					$(this).addClass(wrangler_class);
				}
				has_co = true;
			case 3:
				// add source classes
				var all_sources = fandom_ref[2].trim().split(' ');
				var source_count = all_sources.length;
				if (source_count) {
					for (let i = 0; i < source_count; i++) {
						var this_source = all_sources[i].trim();
						var source_class = get_classes('source', this_source);
						$(this).addClass(source_class);
					}
					source_added = true;
				}
			case 2:
				// add the media type
				var this_media = fandom_ref[1].trim();
				var media_class = '';
				if (this_media) {
					media_class = get_classes('media', this_media);
				} else if (detected_media) {
					media_class = get_classes('media', detected_media);
				}
				$(this).addClass(media_class);
				break;
			default:
			// fandom wasn't in my_fandoms at all
			// or is listed with only the canonical without the comma
			if (!fandom_ref) {
				var undefined_class = get_classes('fandom', 'new-catch');
				$(this).addClass(undefined_class);
			}
			// if a media type was detected add that
			if (detected_media) {
				var detected_class = get_classes('media', detected_media);
				$(this).addClass(detected_class);
			}
		}
		// if no source has been added, assign it to other
		if (!source_added) {
			var other_source = get_classes('source', 'other');
			$(this).addClass(other_source);
		}
		// add the solo-wrangled class if it's not identified as co-wrangled at this point
		// (skipped if there a no co-wrangled fandoms at all since there'd be no point)
		if (!$(this).hasClass('co-wrangled')) {
			var solo_class = get_classes('fandom', 'solo-wrangled');
			$(this).addClass(solo_class);
		}
		
		// grab various uf/uw numbers
		var uf_ff = $(this).find('td:nth-child(4)').text();
		var uw_char = $(this).find('td:nth-child(5)').text();
		var uw_rel = $(this).find('td:nth-child(6)').text();
		var uw_ff = $(this).find('td:nth-child(7)').text();
		var uw_all = $(this).find('td').slice(3,6).text();
		
		// check the unwrangled tags
		if (uw_all !== '   ') {
			$(this).addClass(get_classes('fandom', 'has-uw'));
			if ($(this).hasClass('co-wrangled')) {
				$(this).addClass(get_classes('fandom', 'co-unwrangled'));
			} else if ($(this).hasClass('solo-wrangled')) {
				$(this).addClass(get_classes('fandom', 'solo-unwrangled'));
			}
			// look at the uw tag numbers
			if (few_char_max >= uw_char && few_rel_max >= uw_rel && few_ff_max >= uw_ff) {
				$(this).addClass(get_classes('fandom', 'few-uw'));
			} else {
				if ((few_char_max + few_rel_max >= 0) && (few_char_max < uw_char || few_rel_max < uw_rel)) {
					$(this).addClass(get_classes('fandom', 'some-digging'));
				}
				if (few_ff_max >= 0 && few_ff_max < uw_ff) {
					$(this).addClass(get_classes('fandom', 'some-shoveling'));
				}
				if ((many_char_min + many_rel_min + many_ff_min >= 0) &&
					(many_char_min < uw_char || many_rel_min < uw_rel || many_ff_min < uw_ff)) {
					$(this).addClass(get_classes('fandom', 'many-uw'));
				}
			}
		}
		
		// check the number of unfilterable freeforms
		if (ro3_min >= 0 && ro3_min < uf_ff) {
			$(this).addClass(get_classes('fandom', 'ro3-hunting'));
			if ($(this).hasClass('co-wrangled')) {
				$(this).addClass('fandom', 'co-ro3');
			} else if ($(this).hasClass('solo-wrangled')) {
				$(this).addClass(get_classes('fandom', 'solo-ro3'));
			}
		}
	});
	
	// remove the toggles that you don't want to filter on
	remove_option('media', 'album');
	remove_option('media', 'anthro');
	remove_option('media', 'arg');
	remove_option('media', 'asmr');
	remove_option('media', 'attraction');
	remove_option('media', 'ballet');
	remove_option('media', 'bede');
	remove_option('media', 'blog');
	remove_option('media', 'boardgame');
	remove_option('media', 'book');
	remove_option('media', 'cardgame');
	remove_option('media', 'commercial');
	remove_option('media', 'dramacd');
	remove_option('media', 'fairytale');
	remove_option('media', 'graphicnovel');
	remove_option('media', 'interactive');
	remove_option('media', 'lightnovel');
	remove_option('media', 'manga');
	remove_option('media', 'manhua');
	remove_option('media', 'manhwa');
	remove_option('media', 'musicvideo');
	remove_option('media', 'musical');
	remove_option('media', 'opera');
	remove_option('media', 'podcast');
	remove_option('media', 'poem');
	remove_option('media', 'radio');
	remove_option('media', 'roleplay');
	remove_option('media', 'rpg');
	remove_option('media', 'shortfilm');
	remove_option('media', 'sketch');
	remove_option('media', 'song');
	remove_option('media', 'stageplay');
	remove_option('media', 'toy');
	remove_option('media', 'webcomic');
	remove_option('fandom', 'solo-wrangled');
	remove_option('fandom', 'co-wrangled');
	remove_option('fandom', 'solo-ro3');
	remove_option('fandom', 'co-ro3');
	if (!has_co) {
		remove_option('fandom', 'solo-unwrangled');
		remove_option('fandom', 'co-unwrangled');
	}
		
	// find out how many options are left
	var media_options_count = media_options.length;
	var source_options_count = source_options.length;
	var fandom_options_count = fandom_options.length;
	
	// sort the options in alphabetical order
	media_options.sort();
	source_options.sort();
	// find a specific toggle to put at the end instead
	var moving_toggle_index = 1;
	if (source_options_count > 2 && source_options.includes('other')) {
		moving_toggle_index = source_options.indexOf('other');
		source_options.splice(moving_toggle_index, 1);
		source_options.push('other');
	}
	// manually assign the order
	var sorting_array = [];
	if (fandom_options_count > 2) {
		if (fandom_options.includes('all-fandoms')) {
			sorting_array.push('all-fandoms');
		}
		if (fandom_options.includes('few-uw')) {
			sorting_array.push('few-uw');
		}
		if (fandom_options.includes('some-digging')) {
			sorting_array.push('some-digging');
		}
		if (fandom_options.includes('some-shoveling')) {
			sorting_array.push('some-shoveling');
		}
		if (fandom_options.includes('many-uw')) {
			sorting_array.push('many-uw');
		}
		if (fandom_options.includes('solo-unwrangled')) {
			sorting_array.push('solo-unwrangled');
		}
		if (fandom_options.includes('co-unwrangled')) {
			sorting_array.push('co-unwrangled');
		}
		if (fandom_options.includes('has-uw')) {
			sorting_array.push('has-uw');
		}
		if (fandom_options.includes('solo-ro3')) {
			sorting_array.push('solo-ro3');
		}
		if (fandom_options.includes('co-ro3')) {
			sorting_array.push('co-ro3');
		}
		if (fandom_options.includes('ro3-hunting')) {
			sorting_array.push('ro3-hunting');
		}
		if (fandom_options.includes('solo-wrangled')) {
			sorting_array.push('solo-wrangled');
		}
		if (fandom_options.includes('co-wrangled')) {
			sorting_array.push('co-wrangled');
		}
		if (fandom_options.includes('new-catch')) {
			sorting_array.push('new-catch');
		}
		fandom_options = sorting_array;
		sorting_array = [];
	}
	
	// generate the html for the filter menus where it makes sense to have one
	// and add it to the page before the table
	var filters_html = '';
	var filters_count = 0;
	if (media_options_count > 1) {
		filters_html = filters_html + get_menu_html('media');
		filters_count = filters_count + 1;
	}
	if (source_options_count > 2) {
		filters_html = filters_html + get_menu_html('source');
		filters_count = filters_count + 1;
	}
	if (fandom_options_count > 1) {
		filters_html = filters_html + get_menu_html('fandom');
		filters_count = filters_count + 1;
	}
	if (known_fandoms.length < 4) {
		filters_html = filters_html + get_menu_html('setup');
	} else if (filters_count > 1) {
		filters_html = filters_html + get_menu_html('reset');
	}
	$('#user-page table').before(filters_html);
	
	// add the stuff that make the toggles do the thing when clicked
	var add_commas = false;
	for (let x = 0; x < media_options_count; x++) {
		add_toggle('media', media_options[x]);
	}
	for (let y = 0; y < source_options_count; y++) {
		add_toggle('source', source_options[y]);
	}
	for (let z = 0; z < fandom_options_count; z++) {
		add_toggle('fandom', fandom_options[z]);
	}
	add_toggle('setup', '');
	add_toggle('reset', '');
	
	// auto apply filters on load
	refresh_table();
	
	// EXTRA FUNCTIONS //
	// function to generate the name(s) of the classes
	// to be added to the fandoms on the wrangling home page
	function get_classes(class_type, class_class) {
		class_class = class_class.toLowerCase();
		var class_text = class_type + class_class;
		switch (class_type) {
			case 'source':
				if (class_class.length && !source_options.includes(class_class)) {
					source_options.push(class_class);
				}
				switch (class_class) {
					// you can manually define meta/parent sources here
					// for example, finalfantasy belongs to squeenix (short for Square Enix)
					// so everything finalfantasy is also labelled squeenix
					case 'finalfantasy':
						if (!source_options.includes('squeenix')) {
							source_options.push('squeenix');
						}
						class_text = class_text + ' ' + class_type + 'squeenix';
						break;
					
					// you can also do some stacking and layering
					// while assigning multiple things to (grand)parent(s)
					// for example, pkmnmaingames (Pokemon Main Series Video Games) are jrpgs of the pokemon franchise
					// while both pokemon and mario are (mostly) nintendo things
					case 'pkmnmaingames':
						if (!source_options.includes('jrpg')) {
							source_options.push('jrpg');
						}
						class_text = class_text + ' ' + class_type + 'jrpg';
						if (!source_options.includes('pokemon')) {
							source_options.push('pokemon');
						}
						class_text = class_text + ' ' + class_type + 'pokemon';
					case 'pokemon':
					case 'mario':
						if (!source_options.includes('nintendo')) {
							source_options.push('nintendo');
						}
						class_text = class_text + ' ' + class_type + 'nintendo';
						break;
					
					// if there's no source specified, it'll be assigned to other
					case '':
						if (!source_options.includes('other')) {
							source_options.push('other');
						}
						class_text = 'sourceother';
						break;
					default:
				}
				break;
			case 'media':
				if (!media_options.includes(class_class)) {
					media_options.push(class_class);
				}
				// edit these at your own risk
				switch (class_class) {
					case 'animanga':
						var animanga_index = media_options.indexOf('animanga');
						media_options.splice(animanga_index, 1);
						if (!media_options.includes('anime')) {
							media_options.push('anime');
						}
						if (!media_options.includes('manga')) {
							media_options.push('manga');
						}
						class_text = 'mediaanime mediamanga';
					case 'manga':
					case 'manhua':
					case 'manhwa':
						if (!media_options.includes('m-eastasiancomic')) {
							media_options.push('m-eastasiancomic');
						}
						class_text = class_text + ' mediam-eastasiancomic';
						break;
					case 'animatedfilm':
						var animatedfilm_index = media_options.indexOf('animatedfilm');
						media_options.splice(animatedfilm_index, 1);
						if (!media_options.includes('cartoon')) {
							media_options.push('cartoon');
						}
						if (!media_options.includes('movie')) {
							media_options.push('movie');
						}
						class_text = 'mediacartoon mediamovie';
						break;
					case 'book':
					case 'fairytale':
					case 'lightnovel':
					case 'poem':
					case 'rellore':
						if (!media_options.includes('literature')) {
							media_options.push('literature');
						}
						class_text = class_text + ' medialiterature';
						break;
					case 'bede':
					case 'graphicnovel':
					case 'webcomic':
						if (!media_options.includes('comic')) {
							media_options.push('comic');
						}
						class_text = class_text + ' mediacomic';
						break;
					case 'shortfilm':
						if (!media_options.includes('movie')) {
							media_options.push('movie');
						}
						class_text = class_text + ' mediamovie';
						break;
					case 'band':
					case 'musician':
						if (!media_options.includes('rpf')) {
							media_options.push('rpf');
						}
						class_text = class_text + ' mediarpf';
					case 'song':
					case 'musicvideo':
					case 'album':
						if (!media_options.includes('music')) {
							media_options.push('music');
						}
						class_text = class_text + ' mediamusic';
						break;
					case 'stageplay':
					case 'musical':
					case 'ballet':
					case 'opera':
						if (!media_options.includes('theater')) {
							media_options.push('theater');
						}
						class_text = class_text + ' mediatheater';
						break;
					case 'visualnovel':
						if (!media_options.includes('videogame')) {
							media_options.push('videogame');
						}
						class_text = class_text + ' mediavideogame';
						break;
					case 'asmr':
					case 'dramacd':
					case 'podcast':
					case 'radio':
						if (!media_options.includes('audio')) {
							media_options.push('audio');
						}
						class_text = class_text + ' mediaaudio';
						break;
					case 'anthro':
					case 'arg':
					case 'attraction':
					//case 'audio':
					case 'blog':
					case 'boardgame':
					case 'commercial':
					case 'interactive':
					case 'roleplay':
					case 'rpg':
					case 'sketch':
					case 'toy':
					//case 'webseries':
						if (!media_options.includes('other')) {
							media_options.push('other');
						}
						class_text = class_text + ' mediaother';
						break;
					default:
				}
				break;
			case 'fandom':
				if (!fandom_options.includes(class_class)) {
					fandom_options.push(class_class);
				}
				class_text = class_class;
				break;
			default:
		}
		return class_text;
	}

	// function to make a toggle option disappear
	function remove_option(option_type, option_class) {
		var option_index = 0;
		switch (option_type) {
			case 'media':
				if (media_options.includes(option_class)) {
					option_index = media_options.indexOf(option_class);
					media_options.splice(option_index, 1);
				}
				break;
			case 'source':
				if (source_options.includes(option_class)) {
					option_index = source_options.indexOf(option_class);
					source_options.splice(option_index, 1);
				}
				break;
			case 'fandom':
				if (fandom_options.includes(option_class)) {
					option_index = fandom_options.indexOf(option_class);
					fandom_options.splice(option_index, 1);
				}
				break;
			default:
		}
	}
	
	// function to generate the menu html around the toggles
	function get_menu_html(menu_type) {
		var menu_html = '<p id="' + menu_type + '-filter">';
		switch (menu_type) {
			case 'media':
				for (let a = 0; a < media_options_count; a++) {
					menu_html = menu_html + get_toggle_html('media', media_options[a]);
				}
				break;
			case 'source':
				for (let b = 0; b < source_options_count; b++) {
					menu_html = menu_html + get_toggle_html('source', source_options[b]);
				}
				break;
			case 'fandom':
				for (let c = 0; c < fandom_options_count; c++) {
					menu_html = menu_html + get_toggle_html('fandom', fandom_options[c]);
				}
				break;
			case 'addnew':
				menu_html = menu_html + get_toggle_html('addnew', '');
				break;
			case 'setup':
				menu_html = menu_html + get_toggle_html('setup', '');
			case 'reset':
				menu_html = menu_html + get_toggle_html('reset', '');
				break;
			default:
				menu_html = menu_html + 'undefined menu type';
		}
		menu_html = menu_html + '</p>';
		return menu_html;
	}
	
	// function to generate the html for each toggle
	// including the text in/on the toggle
	function get_toggle_html(toggle_type, toggle_class) {
		toggle_class = toggle_class.toLowerCase();
		var toggle_html = ' <a id="' + toggle_type + toggle_class + '">';
		var toggle_text = toggle_class;
		if (toggle_class == '-all') {
			toggle_text = toggle_type;
		}
		if (uppercase_in_toggles) {
			switch (toggle_class) {
				// acronyms in ALLCAPS
				case 'amt':
				case 'arg':
				case 'asmr':
				case 'rpg':
				case 'rpf':
					toggle_text = toggle_text.toUpperCase();
					break;
				// only initial in upper case
				default:
				var toggle_initial = toggle_text.charAt(0);
				toggle_text = toggle_text.replace(toggle_initial, toggle_initial.toUpperCase());
			}
		}
		switch (toggle_type) {
			case 'media':
				switch (toggle_class) {
					case '-all':
						toggle_html = toggle_html + toggle_text + ':';
						break;
					// text siginificantly differs from class name
					case 'interactive':
						if (uppercase_in_toggles) {
							toggle_html = toggle_html + '[IF]';
						} else {
							toggle_html = toggle_html + '[if]';
						}
						break;
					case 'm-eastasiancomic':
						toggle_html = toggle_html + '[漫画]';
						break;
					case 'rellore':
						if (uppercase_in_toggles) {
							toggle_html = toggle_html + '[Religion & Lore]';
						} else {
							toggle_html = toggle_html + '[religion & lore]';
						}
						break;
					// acronym when upper case, word when lower case
					case 'bede':
						if (uppercase_in_toggles) {
							toggle_html = toggle_html + '[BDs]';
						} else {
							toggle_html = toggle_html + '[bédés]';
						}
						break;
					case 'musicvideo':
						if (uppercase_in_toggles) {
							toggle_html = toggle_html + '[MVs]';
						} else {
							toggle_html = toggle_html + '[music videos]';
						}
						break;
					// separate words, grouped by second word
					case 'dramacd':
						if (uppercase_in_toggles) {
							toggle_html = toggle_html + '[Drama CDs]';
						} else {
							toggle_html = toggle_html + '[drama cds]';
						}
						break;
					case 'shortfilm':
						if (uppercase_in_toggles) {
							toggle_html = toggle_html + '[Short Films]';
						} else {
							toggle_html = toggle_html + '[short films]';
						}
						break;
					case 'boardgame':
					case 'cardgame':
					case 'videogame':
						var game_kind = toggle_text.slice(0, -4);
						if (uppercase_in_toggles) {
							toggle_html = toggle_html + '[' + game_kind + ' Games]';
						} else {
							toggle_html = toggle_html + '[' + game_kind + ' games]';
						}
						break;
					case 'graphicnovel':
					case 'lightnovel':
					case 'visualnovel':
						var novel_kind = toggle_text.slice(0, -5);
						if (uppercase_in_toggles) {
							toggle_html = toggle_html + '[' + novel_kind + ' Novels]';
						} else {
							toggle_html = toggle_html + '[' + novel_kind + ' novels]';
						}
						break;
					case 'webseries':
						if (uppercase_in_toggles) {
							toggle_html = toggle_html + '[Web Series]';
						} else {
							toggle_html = toggle_html + '[web series]';
						}
						break;
					case 'tvshow':
						if (uppercase_in_toggles) {
							toggle_html = toggle_html + '[TV Shows]';
						} else {
							toggle_html = toggle_html + '[tv shows]';
						}
						break;
					case 'fairytale':
						if (uppercase_in_toggles) {
							toggle_html = toggle_html + '[Fairy Tales]';
						} else {
							toggle_html = toggle_html + '[fairy tales]';
						}
						break;
					// identical/no plural
					case 'anime':
					case 'anthro':
					case 'asmr':
					case 'ballet':
					case 'literature':
					case 'manga':
					case 'manhua':
					case 'manhwa':
					case 'music':
					case 'other':
					case 'radio':
					case 'rpf':
					case 'theater':
						toggle_html = toggle_html + '[' + toggle_text + ']';
						break;
					// -es plural
					case 'sketch':
						toggle_html = toggle_html + '[' + toggle_text + 'es]';
						break;
					default:
					// regular plural
					toggle_html = toggle_html + '[' + toggle_text + 's]';
				}
				break;
			case 'source':
				switch (toggle_class) {
					case '-all':
						toggle_html = toggle_html + toggle_text + ':';
						break;
					// you can manually set what a specific source toggle is supposed to say here
					// if not specified, they'll automatically use whatever you entered at the top in my_fandoms
					// optionally with the first letter in upper case, if you have uppercase_in_toggles enabled
					// for example, in this block the toggle for kiseki is set to say [英雄伝説] instead
					case 'kiseki':
						toggle_html = toggle_html + '[英雄伝説]';
						break;
					
					default:
					toggle_html = toggle_html + '[' + toggle_text + ']';
				}
				break;
			case 'fandom':
				toggle_html = ' <a id="' + toggle_class + '">';
				switch (toggle_class) {
					case 'all-fandoms':
						if (uppercase_in_toggles) {
							toggle_html = toggle_html + 'Wrangling Status:';
						} else {
							toggle_html = toggle_html + 'wrangling status:';
						}
						break;
					case 'few-uw':
						if (uppercase_in_toggles) {
							toggle_html = toggle_html + '[Quickies]';
						} else {
							toggle_html = toggle_html + '[quickies]';
						}
						break;
					case 'some-digging':
						if (uppercase_in_toggles) {
							toggle_html = toggle_html + '[Digging]';
						} else {
							toggle_html = toggle_html + '[digging]';
						}
						break;
					case 'some-shoveling':
						if (uppercase_in_toggles) {
							toggle_html = toggle_html + '[Shoveling]';
						} else {
							toggle_html = toggle_html + '[shoveling]';
						}
						break;
					case 'many-uw':
						if (uppercase_in_toggles) {
							toggle_html = toggle_html + '[Dumpster Fires]';
						} else {
							toggle_html = toggle_html + '[dumpster fires]';
						}
						break;
					case 'has-uw':
						if (uppercase_in_toggles) {
							toggle_html = toggle_html + '[All Unwrangled]';
						} else {
							toggle_html = toggle_html + '[all unwrangled]';
						}
						break;
					case 'solo-ro3':
						if (uppercase_in_toggles) {
							toggle_html = toggle_html + '[Solo-Ro3]';
						} else {
							toggle_html = toggle_html + '[solo-ro3]';
						}
						break;
					case 'co-ro3':
						if (uppercase_in_toggles) {
							toggle_html = toggle_html + '[Co-Ro3]';
						} else {
							toggle_html = toggle_html + '[co-ro3]';
						}
						break;
					case 'new-catch':
						if (uppercase_in_toggles) {
							toggle_html = toggle_html + '[Newly Assigned]';
						} else {
							toggle_html = toggle_html + '[newly assigned]';
						}
						break;
					default:
					toggle_html = toggle_html + '[' + toggle_text + ']';
				}
				break;
			case 'addnew':
				if (uppercase_in_toggles) {
					toggle_html = toggle_html + '[Prepare These Fandoms for Setup]';
				} else {
					toggle_html = toggle_html + '[prepare these fandoms for setup]';
				}
				break;
			case 'setup':
				if (uppercase_in_toggles) {
					toggle_html = toggle_html + '[Prepare Unfiltered Table for Setup]';
				} else {
					toggle_html = toggle_html + '[prepare unfiltered table for setup]';
				}
				break;
			case 'reset':
				if (uppercase_in_toggles) {
					toggle_html = toggle_html + '[Reset All Filters]';
				} else {
					toggle_html = toggle_html + '[reset all filters]';
				}
				break;
			default:
			toggle_html = toggle_html + '???';
		}
		toggle_html = toggle_html + '</a>  ';
		return toggle_html;
	}
	
	// function to define which filters to apply when clicking a toggle
	function add_toggle(filter_type, filter_class) {
		var toggle_select = '#' + filter_type + filter_class;
		if (filter_type == 'fandom') {
			toggle_select = '#' + filter_class;
		}
		$(toggle_select).click(function() {
			switch (filter_type) {
				case 'media':
					filter_media = filter_class;
					break;
				case 'source':
					filter_source = filter_class;
					break;
				case 'fandom':
					filter_fandom = filter_class;
					if (filter_fandom == 'new-catch') {
						if (filters_count > 1 ) {
							$('#reset-filter').append(get_toggle_html('addnew', ''));
						} else {
							var new_menu_html = get_menu_html('addnew');
							$('#user-page table').before(new_menu_html);
						}
						add_toggle('addnew', '');
					} else {
						$('#addnew').remove();
					}
					break;
				case 'addnew':
					add_commas = true;
					$('#addnew').remove();
					break;
				case 'setup':
					add_commas = true;
					$('#setup').remove();
				case 'reset':
				default:
					filter_media = '-all';
					filter_source = '-all';
					filter_fandom = 'all-fandoms';
			}
			refresh_table();
		});
	}
	
	// function to show/hide various rows in the table
	function refresh_table() {
		assigned_fandoms.show();
		
		var to_hide = '';
		if (filter_media != '-all') {
			if (to_hide) {
				to_hide = to_hide + ',';
			}
			to_hide = to_hide + '#user-page table tbody tr:not(.media' + filter_media + ')';
		}
		if (filter_source != '-all') {
			if (to_hide) {
				to_hide = to_hide + ',';
			}
			to_hide = to_hide + '#user-page table tbody tr:not(.source' + filter_source + ')';
		}
		if (filter_fandom != 'all-fandoms') {
			if (to_hide) {
				to_hide = to_hide + ',';
			}
			to_hide = to_hide + '#user-page table tbody tr:not(.' + filter_fandom + ')';
		}
		if (to_hide) {
			$(to_hide).hide();
		}
		
		if (add_commas) {
			$('#user-page table tbody tr').find('th').append(',');
			add_commas = false;
		}
		
		$('#media-filter, #source-filter, #fandom-filter').find('a').css('font-weight', 'normal');
		
		var to_bold = '#media' + filter_media + ',#source' + filter_source + ',#' + filter_fandom;
		$(to_bold).css('font-weight', 'bold');
	}
})(jQuery);
