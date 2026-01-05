// ==UserScript==
// @name        torrent9
// @namespace   cpasbien
// @include     http://www.torrent9.*/*
// @include     https://www.torrent9.*/*
// @description enhance torrent9 / t411
// @version     1.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13143/torrent9.user.js
// @updateURL https://update.greasyfork.org/scripts/13143/torrent9.meta.js
// ==/UserScript==

$('.gauche').hide();
$('.left-ad').hide();


$('html > head').append($([
    '<style>',
    ' .ligne0,.ligne1 {',
    '  width: 378px;',
    '  display: block;',
    '  float: left;',
    '}',
    '.titre {',
    '    width:240px;',
    '    background:transparent;',
    '    text-indent:0px;',
    '    padding:3px;',
    '    font-size:medium;',
    '}',
    '.dwnThumb {',
    '    float:left;',
    '    height:90px;',
    '}',
    '.dwnThumb img {',
    '    border:1px solid #9F9F9F;',
    '    -moz-border-radius:5px;',
    '    -webkit-border-radius:5px;',
    '    border-radius:5px;',
    '}',
    '.datas {',
    '    width:75px;',
    '    float:right;',
    '}',
    '.txtQuality {',
    '    color:orange;',
    '    font-size:10px;',
    '}',
    '.txtYear {',
    '    color:red;',
    '    font-size:10px;',
    '}',
    '.txtLanguage {',
    '    color:blue;',
    '    font-size:10px;',
    '}',
    '.txtSAEP {',
    '    color:brown;',
    '}',
    '.up,.down {',
    '    display:inline-block;',
    '}',
    '.downloaded .poid{',
    '    text-decoration:line-through;',
    '}',
    '.downloaded img{',
    '    border:1px solid #9F9F9F;',
    '    -webkit-clip-path: polygon(52% 50%, 78% 11%, 86% 19%, 51% 71%, 28% 30%, 39% 24%);',
    '    clip-path: polygon(52% 50%, 78% 11%, 86% 19%, 51% 71%, 28% 30%, 39% 24%);',
    '}',
    'a.downloaded:active img{',
    '    -webkit-clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 0);',
    '    clip-path: polygon(100% 0, 100% 100%, 0 100%, 0 0);',
    '}',
    'a.downloaded:hover img{',
    '    -webkit-clip-path: polygon(95% 5%, 95% 95%, 5% 95%, 5% 5%);',
    '    clip-path: polygon(95% 5%, 95% 95%, 5% 95%, 5% 5%);',
    '}',
	'.filterToggle{',
	'    padding:3px;',
	'}',
	'.filterOff{',
	'    text-decoration: line-through;',
	'    color:#999;',
	'}',
	'.filterOff:hover{',
	'    text-decoration: line-through;',
	'    color:#999;',
	'}',
 '</style>'].join("\n")+'</style>'));

var filters={};
var addTag = function (text,tag,keywords){
	if (!filters.hasOwnProperty(tag)){
		filters[tag]=[];
	}
    for(var k in keywords){
        text = text.replace(' '+keywords[k]+' ', function myFunction(x){
			var st = x.replace(/(^ | $)/g,'');
			if(filters[tag].indexOf(st) == -1){
				filters[tag].push(st);
			}
            return ' <span class="'+tag+'" data-filter-value="filter-'+tag+'-'+x.replace(/ /g,'')+'">'+x+'</span> ';
        });
    }
    return text;
};

$('.col-sm-4.cus-col.content-right-col').hide();

$('div.table-responsive > table.table tr').each(function(k,tr){
    var tds=$('td',tr);
    if(tds && tds.length>0){
        var atitles=$('a',tds[1]);
        var anfos=$('a',tds[2]);
        if(atitles && atitles.length>0){
            var m = anfos[0].href.match(/torrent\/(.*)/);
            $(anfos[0]).replaceWith('<a href="/get_torrent/'+m[1]+'.torrent">dwn</a>');
            //console.log(atitles[0].href);
            //console.log(m[1],atitles[0].innerHTML);
        }
    }
});

var idx=0;
$('div.left-tab-section').append('');
$('div.table-responsive table tr a').each(function(k,v){
    idx=++idx%4;
    var that    = $(v).closest('tr');
    var title   = ' '+$('td:eq(0)',that).text()+' ';
    var poid    = $('td:eq(1)',that).html();
    var up      = $('td:eq(2)',that).html();
    var down    = $('td:eq(3)',that).html();
    var match   = $('a',that).attr('href').match(/(.*)\/torrent\/(.*)/);
    var torrent = '/get_torrent/'+ match[2].replace(/^[0-9]*\//,'') +'.torrent';
    var hash    = 'dwn_'+match[2].replace(/^[0-9]*\//,'');
    var inner   = "";
	//console.log(title);
    title = addTag(title,'txtQuality',['BluRay 720p','BluRay 1080p','DVDRIP','DVDSCR','HDRIP','HDlight 720p','HDlight 1080p','BRRIP','WEBRIP','x264','HDTV']);
    title = addTag(title,'txtLanguage',['VOSTFR','TRUEFRENCH','FRENCH']);
    title = addTag(title,'txtYear',(function(){var t=[];for(var i=1990;i<=2040;i++){t.push(''+i);}return t;})());
    var saep = title.match(/S([0-9]+)E([0-9]+)/);
    if(saep){
        title = title.replace(saep[0],' <span class="txtSAEP">['+saep[1]+'x'+saep[2]+']</span> ');
    }
    var stitle  = title.replace(/<span.*?\/span>/g,'');

    var downloaded=(window.localStorage.getItem(hash) !== null);

    title = title.replace(/  /g,' ');
    inner = inner + '<div class="ligne'+(idx>=2?1:0)+' item">';
    inner = inner + '    <a class="dwnThumb torrentdwn '+(downloaded?'downloaded':'')+'" data-dhash="'+hash+'" href="'+ torrent +'" alt="download torrent" title="download torrent">';
	inner = inner + '        <img width="60 "src="/_pictures/'+match[2].replace(/^[0-9]*\//,'')+'.jpg">';
	inner = inner + '    </a>';
    inner = inner + '    <a class="titre" href="'+$(v).attr('href')+'">'+title+'</a>';
	inner = inner + '        <br>';
    inner = inner + '    <div class="datas">';
    inner = inner + '        <a class="torrentdwn '+(downloaded?'downloaded':'')+'" alt="download torrent" title="download torrent" data-dhash="'+hash+'" href="'+torrent+'">';
    inner = inner + '            <div class="poid">'+poid+'</div>';
    inner = inner + '        </a>';
    inner = inner + '        <div class="up">'+up+'</div>';
    inner = inner + '        <div class="down">'+down+'</div>';
    inner = inner + '        <div>';
	inner = inner + '            <a class="search" href="https://www.senscritique.com/recherche?query='+stitle.replace(/"/g,' ')+'" target="_blank">[SC]</a>';
	inner = inner + '            <a class="search" href="http://www.allocine.fr/recherche/?q='+stitle.replace(/"/g,' ')+'" target="_blank" >[AC]</a>';
    inner = inner + '        </div>';
    inner = inner + '    </div>';
    inner = inner + '</div>';
    that.replaceWith('');
    $('div.left-tab-section').append(inner);
});

$('a.torrentdwn').bind('click',function(v){
    var hash = $(v.target).parent().attr('data-dhash');
    $('[data-dhash='+hash+']').addClass('downloaded');
    window.localStorage.setItem(hash,1);
    //console.log($(v.target)[0]);
    //console.log(hash);
    return true;
});
$('.gauche').show();

//$('.left-tab-section div').first().hide();

var htmlFilters=[
	'<div class="table-responsive">',
	'<table class="table table-striped table-bordered">'
];

htmlFilters.push('<thead><tr>');
for(var tag in filters){
	htmlFilters = htmlFilters.concat([
		'<td>',
		tag.replace(/^txt/,''),
		'</td>'
	]);
}
htmlFilters.push('</tr></thead>');

htmlFilters.push('<tbody><tr>');
for(var tag in filters){
	htmlFilters.push('<td>');
	for(var k in filters[tag]){
		var val =filters[tag][k];
		htmlFilters = htmlFilters.concat([
			'<a class="filterToggle '+tag+'" data-filter-type="'+tag+'-'+val.replace(/ /g,'')+'">',
			val,
			'</a>'
		]);
	}
	htmlFilters.push('</td>');
}
htmlFilters.push('</tr></tbody>');
htmlFilters = htmlFilters.concat([
	'</table>',
	'</div>'
]);

$('th:contains("Nom du torrent")').closest('.table').hide();
$('#pagination-mian').after(htmlFilters.join('')).show();

$('.filterToggle').click(function(v){
	$(v.target).toggleClass('filterOff');
	var isStrike = $(v.target).hasClass('filterOff');
	setFilter($(v.target).attr('data-filter-type'),isStrike?1:0);
});

function setFilter(type,isStrike){
	console.log('filter-'+type,isStrike);
	window.localStorage.setItem('filter-'+type,isStrike);
	setFilters();
}

function setFilters(){
	$('.item').show();
	$('.filterToggle').each(function(k,v){
		var key = 'filter-'+$(v).attr('data-filter-type');
		if (window.localStorage.getItem(key)?parseInt(window.localStorage.getItem(key)):0){
			$(v).addClass('filterOff');
			console.log(key);
			$("[data-filter-value='" + key + "']").closest('.item').hide();
		}else{
			$(v).removeClass('filterOff');
		}
	});
}

setFilters();
