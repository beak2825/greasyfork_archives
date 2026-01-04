//
// ==UserScript==
// @name          HWM auction real cost
// @author		  PhoeniXXX
// @namespace     HWM_ARC
// @description   реальная цена лота на рынке
// @version       0.9 RC2 20100925
// @include       http://www.heroeswm.ru/auction.php?*
// @downloadURL https://update.greasyfork.org/scripts/35765/HWM%20auction%20real%20cost.user.js
// @updateURL https://update.greasyfork.org/scripts/35765/HWM%20auction%20real%20cost.meta.js
// ==/UserScript==


var GM_JQ = document.createElement('script'); GM_JQ.src = 'http://code.jquery.com/jquery-1.7.2.min.js'; GM_JQ.type = 'text/javascript'; document.getElementsByTagName('head')[0].appendChild(GM_JQ); function waitForJquery(){ if (typeof unsafeWindow.jQuery == 'undefined') { window.setTimeout(waitForJquery, 100); } else { $ = unsafeWindow.jQuery;

///////////////////////////////////////////////////Start/////////
function parseGET(a) {
	
  var tmp = new Array();    
  var tmp2 = new Array(); 
  get = new Array();

  var url = a;	
  if(url != '') {
    tmp = (url.substr(1)).split('&');	
    for(var i=0; i < tmp.length; i++) {
      tmp2 = tmp[i].split('=');		
      get[tmp2[0]] = tmp2[1];	
    }
  }
}

// магазин/производство/прочка            // magazin/proizvodstvo/pro4ka 
var real_cost = { 'smring10' : [ 8580, 8580, 30 ], 'smamul14' : [ 13120, 13120, 30 ], 'mstaff13' : [ 14410, 14410, 40 ], 'mstaff10' : [ 11350, 11350, 35 ], 'mstaff8' : [ 8660, 8660, 30 ], 'sring10' : [ 8580, 8580, 30 ], 'sring4' : [ 1720, 1720, 15 ], 'sboots12' : [ 9000, 9000, 35 ], 'sboots9' : [ 6420, 6420, 30 ], 'sshield11' : [ 11640, 11640, 40 ], 'sshield5' : [ 8680, 8680, 40 ], 'scloack8' : [ 6170, 6170, 30 ], 'sarmor13' : [ 13000, 13000, 50 ], 'sarmor9' : [ 7430, 7430, 40 ], 'samul14' : [ 13120, 13120, 30 ], 'samul8' : [ 10200, 10200, 30 ], 'shelm12' : [ 8000, 8000, 40 ], 'shelm8' : [ 3600, 3600, 30 ], 'ssword13' : [ 18000, 18000, 50 ], 'ssword10' : [ 14580, 14580, 45 ], 'ssword8' : [ 11540, 11540, 40 ], 'gnome_hammer' : [ 860, 1059, 25 ],'steel_blade' : [ 1380, 1587, 30 ],'def_sword' : [ 3860, 3890, 40 ],'requital_sword' : [ 7600, 7870, 40 ],'staff' : [ 9040, 9350, 40 ],'broad_sword' : [ 14200, 14640, 60 ],'power_sword' : [ 29400, 30570, 80 ],'sor_staff' : [ 43400, 43540, 50 ],'mif_staff' : [ 49280, 49265, 70 ],'mif_sword' : [ 51000, 50970, 70 ],'mm_staff' : [ 51080, 52000, 70 ],'mm_sword' : [ 51700, 52000, 70 ],'defender_shield' : [ 3400, 3500, 40 ],'dragon_shield' : [ 26400, 27450, 70 ],'large_shield' : [ 28800, 29375, 70 ],'dagger' : [ 2720, 2800, 30 ],'energy_scroll' : [ 27200, 27180, 70 ],'leather_helm' : [ 1860, 1890, 30 ],'wizard_cap' : [ 4800, 4945, 35 ],'chain_coif' : [ 4620, 4740, 40 ],'knowledge_hat' : [ 5800, 5880, 25 ],'steel_helmet' : [ 11040, 11365, 70 ],'mage_helm' : [ 17200, 17475, 50 ],'mif_lhelmet' : [ 15760, 15760, 70 ],'mif_hhelmet' : [ 18920, 18910, 70 ],'bravery_medal' : [ 1660, 1720, 25 ],'amulet_of_luck' : [ 2860, 2920, 25 ],'power_pendant' : [ 22200, 22180, 60 ],'warrior_pendant' : [ 24200, 24175, 50 ],'magic_amulet' : [ 25200, 25180, 50 ],'leather_shiled' : [ 780, 780, 18 ],'hauberk' : [ 6880, 7140, 40 ],'ciras' : [ 13400, 13850, 70 ],'mif_light' : [ 18800, 18800, 70 ],'mage_armor' : [ 27200, 28210, 50 ],'full_plate' : [ 27800, 27775, 75 ],'wiz_robe' : [ 28200, 28170, 70 ],'miff_plate' : [ 29600, 30000, 75 ],'soul_cape' : [ 3580, 4075, 30 ],'antiair_cape' : [ 8800, 9090, 60 ],'powercape' : [ 24400, 25460, 40 ],'antimagic_cape' : [ 14880, 13430, 50 ],'wiz_cape' : [ 26200, 26500, 60 ],'long_bow' : [ 19000, 19000, 50 ],'composite_bow' : [ 24800, 24785, 55 ],'hunter_boots' : [ 2720, 2780, 30 ],'shoe_of_initiative' : [ 7160, 7380, 40 ],'steel_boots' : [ 17400, 18045, 70 ],'mif_lboots' : [ 21500, 21460, 55 ],'mif_hboots' : [ 23300, 23260, 65 ],'wiz_boots' : [ 24080, 24500, 65 ],'verve_ring' : [ 4720, 4880, 18 ],'doubt_ring' : [ 5720, 5885, 12 ],'rashness_ring' : [ 5800, 5890, 30 ],'circ_ring' : [ 19560, 20430, 50 ],'powerring' : [ 21200, 21180, 40 ],'warriorring' : [ 23100, 23090, 40 ],'darkring' : [ 25200, 25180, 50 ],'scoutcloack' : [ 900, 900, 20 ],'shortbow' : [ 1020, 1020, 20 ],'s_shield' : [ 800, 800, 15 ],'shield16' : [ 30960, 31000, 70 ],'boots2' : [ 3080, 3080, 35 ],'i_ring' : [ 500, 500, 10 ],'armor15' : [ 28000, 28200, 70 ],'boots13' : [ 25560, 26000, 70 ],'boots15' : [ 25740, 26000, 70 ],'bow14' : [ 29900, 30000, 65 ],'mboots14' : [ 26520, 27000, 70 ],'shield13' : [ 30600, 31000, 70 ],'zxhelmet13' : [ 19200, 19600, 70 ],'mhelmetzh13' : [ 19200, 19600, 70 ],'myhelmet15' : [ 19800, 20000, 70 ],'xymhelmet15' : [ 19860, 20200, 70 ],'wzzamulet13' : [ 30000, 30300, 60 ],'mmzamulet13' : [ 30000, 30300, 60 ],'bafamulet15' : [ 32500, 34000, 65 ],'mmzamulet16' : [ 33000, 33300, 65 ],'wzzamulet16' : [ 33000, 33300, 65 ],'robewz15' : [ 28000, 28300, 70 ],'cloackwz15' : [ 28900, 29300, 65 ],'ffstaff15' : [ 53160, 53160, 70 ],'firsword15' : [ 53140, 53500, 70 ],'magring13' : [ 30900, 31500, 60 ],'warring13' : [ 30900, 31200, 60 ],'bring14' : [ 31200, 31500, 60 ],'wwwring16' : [ 33780, 34200, 65 ],'mmmring16' : [ 33780, 34100, 65 ]};var url = { 
    game  : location.hostname, 
	cur   : location.href 
};

var a = $('a');

var regexp = {
    item_hard  : /\: (\d+)\/(\d+)/, 
	item_hard2 : /<b>(\d+)<\/b><\/font>\/(\d+)/
};

var cura, adr, name, xcur, xrem, source = new Object(), cost, gos, auc, xmax, rcost, range, bg, color, plus;
for( var i = 0; i < a.length; i++ )
{
    cura = a[i];
    if( cura.href.match(/art_info.php/) && cura.href!=a[i-1].href )
    {
        adr = cura.href.replace("http://" + url.game + "/art_info.php",""); 
	    parseGET( adr );
		name = get[ 'id' ];
		get = new Array();
		
	    if( !real_cost[name] ) { continue; }
		
		if( ( hard = regexp.item_hard.exec( $(cura).parent().html() ) ) || ( hard = regexp.item_hard2.exec( $(cura).parent().html() ) ) )
		    {
			    xcur = hard[1];
		        xrem = hard[2];
			} else { continue; }
		
		source.cost = $(cura).parents('tr.wb').children().next().next().children().children().children().children().children().children().children().children().next().html();//children('td:last').html();
        cost = source.cost.replace(/,/g,""); 
        
	    gos =  real_cost[ name ][ 0 ];
	    auc =  real_cost[ name ][ 1 ];
	    xmax = real_cost[ name ][ 2 ];
		
        rcost = ( auc - gos * 0.65 ) * xcur / xmax + gos * ( 0.65 * xrem / xmax );
	    rcost = rcost.toFixed(0);
		
		range = rcost - cost;
		
		bg='transperent';
		
        if ( range >= 0 ) {
            color = '#0000CD'; //blue
			bg = '#96B4FB';
        } else if ( range < 0 && range > -500 ) {
		    color = '#FF9900'; 
		} else {
            color = '#660000';
	    }
		
		if( range < 0) { plus = ''; } else { plus = ' <sup>(+'+range+')</sup>'; }
		
	    source.app = $(cura).parents('tr.wb').children('td:eq(2)');
		$(source.app).append('<div style="margin: 0 0 0 -5px; padding: 5px 5px; height: 1.5em; background: ' + bg + '; color: ' + color + '; font: 20px; font-weight: bold; "><img style="vertical-align: middle; " src="http://im.heroeswm.ru/i/gold.gif">' + rcost + plus + '</div>');
		
  }
}

////////////////////////////////////////////////////End///////
}}waitForJquery();