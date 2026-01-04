// ==UserScript==
// @name			TabunStats
// @version			2021.02.15 (1.41)
// @description		Набор элементов статистики для Табуна
// @include			http*://tabun.everypony.ru/blog/*
// @include			http*://tabun.everypony.ru/
// @include			http*://tabun.everypony.ru/index/newall/*
// @icon			https://www.google.com/s2/favicons?domain=tabun.everypony.ru
// @author			Zayka & Rainbow-Spike
// @namespace       https://greasyfork.org/users/7568
// @homepage        https://greasyfork.org/ru/users/7568-dr-yukon
// @require			https://code.jquery.com/jquery-2.1.1.min.js
// @require			https://code.highcharts.com/highcharts.js
// @grant			GM_addStyle
// @run-at			document-end
// @downloadURL https://update.greasyfork.org/scripts/421697/TabunStats.user.js
// @updateURL https://update.greasyfork.org/scripts/421697/TabunStats.meta.js
// ==/UserScript==

GM_addStyle (".zTable{border:1px solid;box-shadow:2px 2px 3px #AAA;border-radius:5px 8px;background:#76afe8;background:-webkit-linear-gradient(left,#76afe8 0,#3591e8 100%);background:-moz-linear-gradient(left,#76afe8 0,#3591e8 100%);background:-o-linear-gradient(left,#76afe8 0,#3591e8 100%);background:linear-gradient(to right,#76afe8 0,#3591e8 100%)}.crop{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.zСontainer{position:fixed;right:10px;bottom:34px;width:160px;z-index:10000;background:#fff;border:1px solid Silver;border-radius:6px;padding:10px}.zСontainer>.switch{display:block;margin:10px auto;left:45px}.switch{position:relative;display:inline-block;vertical-align:top;width:56px;height:20px;padding:3px;background-color:#fff;border-radius:18px;box-shadow:inset 0 -1px white,inset 0 1px 1px rgba(0,0,0,.05);cursor:pointer;background-image:-webkit-linear-gradient(top,#eee,#fff 25px);background-image:-moz-linear-gradient(top,#eee,#fff 25px);background-image:-o-linear-gradient(top,#eee,#fff 25px);background-image:linear-gradient(to bottom,#eee,#fff 25px)}.switch-input{position:absolute;top:0;left:0;opacity:0}.switch-label{position:relative;display:block;height:inherit;font-size:10px;text-transform:uppercase;background:#eceeef;border-radius:inherit;box-shadow:inset 0 1px 2px rgba(0,0,0,.12),inset 0 0 2px rgba(0,0,0,.15);-webkit-transition:.15s ease-out;-moz-transition:.15s ease-out;-o-transition:.15s ease-out;transition:.15s ease-out;-webkit-transition-property:opacity background;-moz-transition-property:opacity background;-o-transition-property:opacity background;transition-property:opacity background}.switch-label:after,.switch-label:before{position:absolute;top:50%;margin-top:-.5em;line-height:1;-webkit-transition:inherit;-moz-transition:inherit;-o-transition:inherit;transition:inherit}.switch-label:before{content:attr(data-off);right:11px;color:#aaa;text-shadow:0 1px rgba(255,255,255,.5)}.switch-label:after{content:attr(data-on);left:11px;color:#fff;text-shadow:0 1px rgba(0,0,0,.2);opacity:0}.switch-input:checked ~ .switch-label{background:#47a8d8;box-shadow:inset 0 1px 2px rgba(0,0,0,.15),inset 0 0 3px rgba(0,0,0,.2)}.switch-input:checked~.switch-label:before{opacity:0}.switch-input:checked~.switch-label:after{opacity:1}.switch-handle{position:absolute;top:4px;left:4px;width:18px;height:18px;background:#fff;border-radius:10px;box-shadow:1px 1px 5px rgba(0,0,0,.2);background:-webkit-linear-gradient(top,#fff 40%,#f0f0f0) #fff;background:-moz-linear-gradient(top,#fff 40%,#f0f0f0) #fff;background:-o-linear-gradient(top,#fff 40%,#f0f0f0) #fff;background:linear-gradient(to bottom,#fff 40%,#f0f0f0) #fff;-webkit-transition:left .15s ease-out;-moz-transition:left .15s ease-out;-o-transition:left .15s ease-out;transition:left .15s ease-out}.switch-handle:before{content:'';position:absolute;top:50%;left:50%;margin:-6px 0 0 -6px;width:12px;height:12px;background:#f9f9f9;border-radius:6px;box-shadow:inset 0 1px rgba(0,0,0,.02);background-image:-webkit-linear-gradient(top,#eee,#fff);background-image:-moz-linear-gradient(top,#eee,#fff);background-image:-o-linear-gradient(top,#eee,#fff);background-image:linear-gradient(to bottom,#eee,#fff)}.switch-input:checked ~ .switch-handle{left:40px;box-shadow:-1px 1px 5px rgba(0,0,0,.2)}.switch-green>.switch-input:checked~.switch-label{background:#4fb845}");

var configKey = 'Tabun stats config key',
	commentsTableId = "zCommentsTable",
	topicsTableId = "zTopicsTable",
	graphsTableId = "zGraphsTable",

	defaultCfg = {
		useComments: true,
		useTopics: false,
		useGraphs: false,
	},
	cfg = defaultCfg;

cfg = $ . extend (
	{ }, defaultCfg, JSON.parse (
		window.localStorage.getItem (
			configKey
		)
		||
		"{}"
	)
);

var configItems = [ ];
configItems.push (
	{
		text: "Комментарии",
		idName: "statsCommentsOption",
		cfgName: "useComments",
		getValue: function ( ) {
			return $ ( '#zStats' ) . find ( "#" + this . idName ) . prop ( 'checked' );
		},
		saveValue: function ( ) {
			cfg [ this . cfgName ] = this . getValue ( );
		},
		cfgValue: function ( ) {
			return cfg [ this . cfgName ];
		},
	}, {
		text: "Топики",
		idName: "statsTopicsOption",
		cfgName: "useTopics",
		getValue: function ( ) {
			return $ ( '#zStats' ) . find ( "#" + this . idName ) . prop ( 'checked' );
		},
		saveValue: function ( ) {
			cfg [ this . cfgName ] = this . getValue ( );
		},
		cfgValue: function ( ) {
			return cfg [ this . cfgName ];
		},
	}, {
		text: "График",
		idName: "statsGraphsOption",
		cfgName: "useGraphs",
		getValue: function () {
			return $ ( '#zStats' ) . find ( "#" + this . idName ) . prop ( 'checked' );
		},
		saveValue: function ( ) {
			cfg [ this . cfgName ] = this . getValue ( );
		},
		cfgValue: function ( ) {
			return cfg [ this . cfgName ];
		},
	}
);

var cont = $ (
	'<div>', {
		"class": 'zСontainer',
		"id": "zStats"
	}
);

configItems . forEach (
	function ( o, idx ) {
		var label = $ (
			'<label>', {
				"class": 'switch'
			}
		),
			input = $ (
			"<input>", {
				type: 'checkbox',
				"class": 'switch-input',
				"id": o . idName
			}
		) . prop (
			'checked', o . cfgValue ( )
		) . on (
			'click', SaveConfig
		),
			span = $ (
			"<span>", {
				"class": 'switch-label',
				"data-on": "Вкл",
				"data-off": "Откл"
			}
		),
			textDiv = $ (
				'<div>', {
					"class": 'zcomment',
					text: o . text
				}
			) . css (
				{
					position: 'relative',
					right: 90,
					bottom: 19
				}
			);
		label . append ( input );
		label . append ( span );
		label . append ( textDiv );
		label . appendTo ( cont );
	}
);


var button = $ (
	'<button>', {
		"class": "button button-small",
		click: ShowConfig,
		text: "Stats"
	}
) . css (
	{
		"margin-right": 10
	}
);

button . append ( cont );
$ ( '#widemode' ) . append ( button );
$ ( '#widemode' ) . append ( cont );
cont . toggle ( );

function ShowConfig ( e ) {
	$ ( e . currentTarget ) . toggleClass ( "active" );
	cont . toggle ( );
	console . log ( cfg );
}

function SaveConfig ( e ) {
	var currentItem = configItems . filter (
		function ( item ) {
			return item . idName == e . currentTarget . id
		}
	) [ 0 ];
	currentItem . saveValue ( );
	window . localStorage . setItem (
		configKey, JSON . stringify ( cfg )
	);
}

if ( cfg . useComments ) {
	LoadComments ( );
}

if ( cfg . useTopics ) {
	LoadTopics ( );
}

if ( cfg . useGraphs ) {
	LoadGraphs ( );
}

function LoadComments ( ) {
	var xmlhttp = new XMLHttpRequest ( );
	xmlhttp . open ( 'GET', "https://tabunstats.com/speed?" + Math . random ( ) * 1000000 );
	xmlhttp . onreadystatechange = function ( ) {
		if ( xmlhttp . readyState < 4 ) return;
		var json = JSON . parse ( xmlhttp . responseText );
		CreateCommentsTable ( json );
	};
	xmlhttp . send ( );
}

function LoadTopics ( ) {
	var xmlhttp2 = new XMLHttpRequest ( );
	xmlhttp2 . open ( 'GET', "https://tabunstats.com/hot" );
	xmlhttp2 . onreadystatechange = function ( ) {
		if ( xmlhttp2 . readyState < 4 ) return;
		var json = JSON . parse ( xmlhttp2 . responseText ),
			sort_json = [ ];
		for ( var key in json ) {
			sort_json.push (
				{
					key: key,
					score: json [ key ] [ 2 ],
					name: json [ key ] [ 3 ]
				}
			);
		}
		sort_json . sort (
			function ( a, b ) {
				return b . score - a . score;
			}
		);
		CreateTopicsTable ( sort_json );
	};
	xmlhttp2 . send ( );
}

function LoadGraphs ( ) {
	if ( $ ( ".topic-header" ) . length > 2) return null; //милый костыль работы графиков только внутри топиков.
	$ ( ".topic-header" ) .append (
		$ (
			"<div>", {
				"class": 'zGraph',
				id: graphsTableId
			}
		)
	);
	var pattern = /http[\w\W\s\S]+?([\d]+)[\.]/g;
	var topicN = pattern . exec (
		document . URL
	);

	$ . ajax (
		{
			type: "GET",
			//dataType: "json",
			data: "id=" + topicN [ 1 ],
			url: "https://tabunstats.com/graph/",
			success: function ( msg ) {
				MyLittleCallback ( msg );
			},
			error: function ( jqXHR, textStatus, errorThrown ) {
				console . log ( "jqXHR:" + jqXHR );
				console . log ( "textStatus:" + textStatus );
				console . log ( "errorThrown:" + errorThrown );
			}
		}
	);
}

function CreateCommentsTable ( json ) {
	var sidebar = document . getElementById ( "sidebar" ),
		blockafter = sidebar . getElementsByClassName ( "block block-type-pseudomenu" ) [ 0 ],
		node = document . createElement ( "div" ),
		linkWidth = ( sidebar . clientWidth - 40 ) * 0.40,
		table = document . createElement ( "table" ),
		tr = document . createElement ( "tr" );
	node . className = "block";
	table . setAttribute ( "border", "2" );
	tr . innerHTML = " <TH>Имя топика</TH> <TH>Комментариев в час</TH>";
	table . appendChild ( tr );
	table . align = "center";
	table . width = "100%";
	table . id = commentsTableId;
//	table . style . background = "#DFDFDF";

	var invmax = 99 / json [ 0 ] . event . commentsTotal;

	for ( var i = 0; i < json . length && i < 5; i++ ) {
		if ( json [ i ] . event . name == "" ) json [ i ] . event . name = "Unidentified";
		var link = document . createElement ( "a" ),
			div = document . createElement ( "div" ),
			td1 = document . createElement ( "td" ),
			td2 = document . createElement ( "td" ),
			bar = document . createElement ( "div" );
		link . href = "http://tabun.everypony.ru/blog/" + json [ i ] . event . topicNum + ".html";
		link . innerHTML = json [ i ] . event . name;
		link . title = link . innerHTML;
		div . className = "crop";
		div . style . width = linkWidth + "px";
		div . appendChild ( link );
		td1 . style . width = "40%";
		td1 . appendChild ( div );
		td1 . style . fontSize = "11px";
//		td2 . style . width = "60%";
		bar . style . width = ( invmax * json [ i ] . event . commentsTotal ) . toString ( ) + "%";
		bar . textContent = json [ i ] . event . commentsTotal;
		bar . align = "center";
		bar . className = "zTable";
		td2 . appendChild ( bar );
		tr = document . createElement ( "tr" );
		tr . appendChild ( td1 );
		tr . appendChild ( td2 );
		table . appendChild ( tr );
	}
	node . appendChild ( table );
	sidebar . insertBefore ( node, blockafter );
}

function CreateTopicsTable ( json ) {
	var sidebar = document . getElementById ( "sidebar" ),
		blockafter = sidebar . getElementsByClassName ( "block block-type-pseudomenu" ) [ 0 ],
		node = document . createElement ( "div" ),
		linkWidth = ( sidebar . clientWidth - 40 ) * 0.40,
		table = document . createElement ( "table" ),
		tr = document . createElement ( "tr" );
	node . className = "block";
	table . setAttribute ( "border", "2" );
	tr . innerHTML = " <TH>Имя топика</TH> <TH>Рейтинг</TH>";
	table . appendChild ( tr );
	table . align = "center";
	table . width = "100%";
	table . id = topicsTableId;
	json = json . map (
		function ( j ) {
			j . score = Math . round ( ( 6.666 * j . score - 5.6666 ) * 1000 );
			return j;
		}
	);
	var invmax = 99 / json [ 0 ] . score;

	for ( var i = 0; i < json . length && i < 5; i++ ) {
		if ( json [ i ] . name == "" ) json [ i ] . event . name = "Unidentified";
		var link = document . createElement ( "a" ),
			div = document . createElement ( "div" ),
			td1 = document . createElement ( "td" ),
			td2 = document . createElement ( "td" ),
			bar = document . createElement ( "div" ),
			score = json [ i ] . score;
		link . href = "http://tabun.everypony.ru/blog/" + json [ i ] . key + ".html";
		link . innerHTML = json [ i ] . name;
		link . title = link . innerHTML;
		div . className = "crop";
		div . style . width = linkWidth + "px";
		div . appendChild ( link );
		td1 . style . width = "40%";
		td1 . appendChild ( div );
		td1 . style . fontSize = "11px";
//		td2 . style . width = "60%";
		if ( score < 0 ) score = 0;
		bar . style . width = ( invmax * score ) . toString ( ) + "%";
		bar . textContent = json [ i ] . score;
		bar . align = "center";
		bar . className = "zTable";
		td2 . appendChild ( bar );
		tr = document . createElement ( "tr" );
		tr . appendChild ( td1 );
		tr . appendChild ( td2 );
		table . appendChild ( tr );
	}
	node . appendChild ( table );
	sidebar . insertBefore ( node, blockafter );
}

function MyLittleCallback ( msg ) {
	$ ( '#' + graphsTableId ) . highcharts (
		{
//			new Highcharts . Chart ( {
			chart: {
				type: 'spline',
				backgroundColor: 'rgba( 255, 255, 255, 0.0 )',
				zoomType: 'x',
			},
			plotOptions: {
				spline: {
					animation: false,
					lineWidth: 2,
					marker: {
						enabled: false
					},
					color: '#5FA459',
					negativeColor: '#DA4242',
				},
			},
			xAxis: {
				type: 'datetime',
//				title: {enabled:false}
			},
			yAxis: {
				title: {
					enabled: false
				}
			},
			series: [
				{
					data: msg,
					name: 'Рейтинг топика'
				}
			],
		}
	);

	$ ( '.zGraph' ) . hide ( );
	button = document . createElement ( 'button' );
	button . className = "button button-primary graphbutton"
	button . textContent = "График";
	$ ( button ) . click (
		function ( ) {
			$ ( '.zGraph' ) . toggle ( )
		}
	) ;
	$ ( ".topic-info-vote" ) . after ( button );
}
