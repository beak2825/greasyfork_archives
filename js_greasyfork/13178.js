// ==UserScript==
// @name        WikiLang
// @namespace   michalpawl
// @author      MacGyver
// @description Makes your preferred language links easy to find on Wikimedia pages. Config available via Script Commands.
// @icon        data:image/png;base64,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

// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand

// @match       *://*.wikipedia.org/*
// @match       *://*.wiktionary.org/*
// @match       *://*.wikiquote.org/*
// @match       *://*.wikibooks.org/*
// @match       *://*.wikisource.org/*
// @match       *://*.wikinews.org/*
// @match       *://*.wikiversity.org/*
// @match       *://*.wikivoyage.org/*
// @match       *://*.wikidata.org/*
// @match       *://*.wikimedia.org/*
// @match       *://*.mediawiki.org/*

// @version     1.0.14

// @license     CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license     GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @downloadURL https://update.greasyfork.org/scripts/13178/WikiLang.user.js
// @updateURL https://update.greasyfork.org/scripts/13178/WikiLang.meta.js
// ==/UserScript==


const namelist = ['- Select language -','Abkhazian','Achinese','Afar','Afrikaans','Akan','Albanian','Alemannisch','Amharic','Arabic','Aragonese','Aramaic','Armenian','Aromanian','Arpitan','Assamese','Asturian','Avaric','Aymara','Azerbaijani','Bambara','Banjar','Basa Banyumasan','Bashkir','Basque','Bavarian','Belarusian','Bengali','Bhojpuri','Bikol Central','Bishnupriya','Bislama','Bosnian','Breton','Buginese','Bulgarian','Burmese','Buryat','Cantonese','Catalan','Cebuano','Central Kurdish','Chamorro','Chavacanode Zamboanga','Chechen','Cherokee','Cheyenne','Chinese','Chinese (Min Nan)','Choctaw','Church Slavic','Chuvash','Classical Chinese','Colognian','Cornish','Corsican','Cree','Creek','Crimean Turkish','Croatian','Czech','Danish','Divehi','Dutch','Dzongkha','Eastern Mari','Egyptian Arabic','Emiliano-Romagnolo','English','Erzya','Esperanto','Estonian','Ewe','Extremaduran','Faroese','Fiji Hindi','Fijian','Finnish','French','Friulian','Fulah','Gagauz','Galician','Gan Chinese','Ganda','Georgian','German','Gilaki','Goan Konkani','Gothic','Greek','Guarani','Gujarati','Haitian','Hakka Chinese','Hausa','Hawaiian','Hebrew','Herero','Hindi','Hiri Motu','Hungarian','Icelandic','Ido','Igbo','Iloko','Indonesian','Interlingua','Interlingue','Inuktitut','Inupiaq','Irish','Italian','Japanese','Javanese','Kabardian','Kabyle','Kalaallisut','Kalmyk','Kannada','Kanuri','Karachay-Balkar','Kara-Kalpak','Kashmiri','Kashubian','Kazakh','Khmer','Kikuyu','Kinyarwanda','Komi','Komi-Permyak','Kongo','Korean','Kuanyama','Kurdish','Kyrgyz','Ladino','Lak','Lao','Latgalian','Latin','Latvian','Lezghian','Ligurian','Limburgish','Lingala','Lithuanian','Lojban','Lombard','Low German','Low Saxon (Netherlands)','Lower Sorbian','Luxembourgish','Macedonian','Maithili','Malagasy','Malay','Malayalam','Maltese','Manx','Maori','Marathi','Marshallese','Mazanderani','Min Dong Chinese','Minangkabau','Mingrelian','Mirandese','Moksha','Moldovan','Mongolian','Nahuatl','Nauru','Navajo','Ndonga','Neapolitan','Nepali','Newari','Norfuk/Pitkern','Northern Frisian','Northern Luri','Northern Sami','Northern Sotho','Norwegian','Norwegian Nynorsk','Nouormand','Novial','Nyanja','Occitan','Old English','Oriya','Oromo','Ossetic','Palatine German','Pali','Pampanga','Pangasinan','Papiamento','Pashto','Pennsylvania German','Persian','Picard','Piedmontese','Polish','Pontic','Portuguese','Punjabi','Quechua','Romani','Romanian','Romansh','Rundi','Russian','Rusyn','Sakha','Samoan','Samogitian','Sango','Sanskrit','Sardinian','Saterland Frisian','Scots','Scottish Gaelic','Serbian','Serbo-Croatian','Shona','Sichuan Yi','Sicilian','Silesian','Simple English','Sindhi','Sinhala','Slovak','Slovenian','Somali','South Azerbaijani','Southern Sotho','Spanish','Sranan Tongo','Sundanese','Swahili','Swati','Swedish','Tagalog','Tahitian','Tajik','Tamil','Tarantino','Taraskievica','Tatar','Telugu','Tetum','Thai','Tibetan','Tigrinya','Tok Pisin','Tongan','Tsonga','Tswana','Tumbuka','Turkish','Turkmen','Tuvinian','Twi','Udmurt','Ukrainian','Upper Sorbian','Urdu','Uyghur','Uzbek','Venda','Venetian','Veps','Vietnamese','Volapuk','Voro','Walloon','Waray','Welsh','West Flemish','Western Frisian','Western Mari','Western Punjabi','Wolof','Wu Chinese','Xhosa','Yiddish','Yoruba','Zazaki','Zeelandic','Zhuang','Zulu'];
const codelist = ['','ab','ace','aa','af','ak','sq','als','am','ar','an','arc','hy','roa-rup','frp','as','ast','av','ay','az','bm','bjn','map-bms','ba','eu','bar','be','bn','bh','bcl','bpy','bi','bs','br','bug','bg','my','bxr','zh-yue','ca','ceb','ckb','ch','cbk-zam','ce','chr','chy','zh','zh-min-nan','cho','cu','cv','zh-classical','ksh','kw','co','cr','mus','crh','hr','cs','da','dv','nl','dz','mhr','arz','eml','en','myv','eo','et','ee','ext','fo','hif','fj','fi','fr','fur','ff','gag','gl','gan','lg','ka','de','glk','gom','got','el','gn','gu','ht','hak','ha','haw','he','hz','hi','ho','hu','is','io','ig','ilo','id','ia','ie','iu','ik','ga','it','ja','jv','kbd','kab','kl','xal','kn','kr','krc','kaa','ks','csb','kk','km','ki','rw','kv','koi','kg','ko','kj','ku','ky','lad','lbe','lo','ltg','la','lv','lez','lij','li','ln','lt','jbo','lmo','nds','nds-nl','dsb','lb','mk','mai','mg','ms','ml','mt','gv','mi','mr','mh','mzn','cdo','min','xmf','mwl','mdf','mo','mn','nah','na','nv','ng','nap','ne','new','pih','frr','lrc','se','nso','no','nn','nrm','nov','ny','oc','ang','or','om','os','pfl','pi','pam','pag','pap','ps','pdc','fa','pcd','pms','pl','pnt','pt','pa','qu','rmy','ro','rm','rn','ru','rue','sah','sm','bat-smg','sg','sa','sc','stq','sco','gd','sr','sh','sn','ii','scn','szl','simple','sd','si','sk','sl','so','azb','st','es','srn','su','sw','ss','sv','tl','ty','tg','ta','roa-tara','be-x-old','tt','te','tet','th','bo','ti','tpi','to','ts','tn','tum','tr','tk','tyv','tw','udm','uk','hsb','ur','ug','uz','ve','vec','vep','vi','vo','fiu-vro','wa','war','cy','vls','fy','mrj','pnb','wo','wuu','xh','yi','yo','diq','zea','za','zu'];
const selector = 'LI.interlanguage-link.interwiki-';
const windowstyle = 'background-color: #d0e0ff;';
const framestyle = 'height: 75%; max-height: 440px; top: calc(50% - 215px); width: 300px; left: calc(50% - 150px); border: 1px solid #000; border-radius: 4px; margin: 0px; opacity: 1; overflow: auto; padding: 8px; position: fixed; z-index: 65536; display: block; right: auto; bottom: auto;';


function makeDraggable(element, handle)
{
	if (!element) return;
	var mdX = 0, mdY = 0, mdeX = 0, mdeY = 0;
	(handle?handle:element).onmousedown = function(event)
	{
		this.style.MozUserSelect = 'none';
		mdX = event.clientX;
		mdY = event.clientY;
		mdeX = element.offsetLeft;
		mdeY = element.offsetTop;
		onmouseup =()=> 
		{
			onmousemove = null;
			this.style.MozUserSelect = '';
		};
		onmousemove = ev =>
		{
			element.style.left = (mdeX + ev.clientX - mdX) + "px";
			element.style.top  = (mdeY + ev.clientY - mdY) + "px";
		};
	};
}


var settingsfields =
{
	langselect:
	{
		section: ['Language list', 'Choose which links to modify'],
		type: 'select',
		options: namelist,
		default: namelist[0],
		save: false,
	},
    add:
	{
		label: 'Add to list',
		type: 'button',
		click: function()
		{
			const langs = WikiLangConfig_field_languages.value.split(' ').filter(function(e){return(e&&codelist.includes(e));}).join(' ');
			WikiLangConfig_field_languages.value = langs;
			const newlang = GetLangCode(WikiLangConfig_field_langselect.value);
			if ( !newlang )
				alert('Please select which language to add.');
			else if ( langs.split(' ').indexOf(newlang) >= 0 )
				alert(WikiLangConfig_field_langselect.value + ' (' + newlang + ') is already on the list.');
			else
				WikiLangConfig_field_languages.value += langs ? ' '+newlang : newlang;
		},
	},
	languages:
	{
		type: 'text',
		default: 'pl en',
	},
	move_to_top:
	{
		section: ['Actions', 'Set how should the links be modified'],
		label: 'Move to top (in order as on the list above)',
		labelPos: 'right',
		type: 'checkbox',
		default: true,
	},
	apply_style:
	{
		label: 'Apply style:',
		labelPos: 'right',
		type: 'checkbox',
		default: true,
	},
	style:
	{
		type: 'textarea',
		default: 'font-weight: bold;\nfont-size: 120%;',
	},
};


GM_config.init(
{
	id: 'WikiLangConfig',
	title: 'WikiLang Settings',
	fields: settingsfields,
	events:
	{
		open: function()
		{
			makeDraggable(WikiLangConfig, WikiLangConfig_header);
			WikiLangConfig_header.style.cursor = 'move';
		},
		save: function()
		{
			apply();
		},
	},
	frame: document.body.appendChild(document.createElement('div')),
	css: '#WikiLangConfig { ' + windowstyle + ' } #WikiLangConfig_field_style { font-size: 13px; height: 6em; }',
});


function GetLangCode(LangName)
{
	var i = namelist.indexOf(LangName);
	return codelist[i<0?0:i];
}


function apply()
{
	GM_config.set('langselect',namelist[0]);

	const languages = GM_config.get('languages').split(' ');
	const style = GM_config.get('style');
	if ( !languages.length ) return;

	var query_A = GM_getValue('query_A','');
	var A_selected;

	if(query_A)
	{
		A_selected = document.querySelectorAll(query_A);
		for ( let i=0; i<A_selected.length; ++i )
			A_selected[i].removeAttribute('style');
	}

	query_A = selector + languages[languages.length-1] + ' > A';
	if ( GM_config.get('move_to_top') )
	{
		let list = document.querySelector('LI.interlanguage-link').parentElement;
		let elem;
		if ( elem = document.querySelector(selector + languages[languages.length-1]) )
			list.insertBefore(elem, list.children[0]);

		for ( let i=languages.length-2; i>=0; --i )
		{
			query_A = selector + languages[i] + ' > A, ' + query_A;
			if ( elem = document.querySelector(selector + languages[i]) )
				list.insertBefore(elem, list.children[0]);
		}
	}
	else
	{
		for ( let i=languages.length-2; i>=0; --i )
			query_A = selector + languages[i] + ' > A, ' + query_A;
	}

	GM_setValue('query_A',query_A);

	if ( GM_config.get('apply_style') && typeof style == 'string' )
	{
		A_selected = document.querySelectorAll(query_A);
		for ( let i=0; i<A_selected.length; ++i )
			A_selected[i].style = style;
	}
}


function openconfig()
{
	GM_config.open();
	WikiLangConfig.style = framestyle;
}


GM_registerMenuCommand('WikiLang Settings', openconfig);
apply();
