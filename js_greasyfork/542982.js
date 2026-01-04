// ==UserScript==
// @name        TTG_helper
// @namespace   http://www.w3.org/1999/xhtml
// @include     https://totheglory.im/t/*
// @include     https://totheglory.im/details.php*
// @include     https://totheglory.im/browse.php*c=M*
// @version     1.3.2
// @author      Garphy
// @description TTG增强
// @icon        https://totheglory.im/favicon.ico
// @grant       GM_addStyle
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/542982/TTG_helper.user.js
// @updateURL https://update.greasyfork.org/scripts/542982/TTG_helper.meta.js
// ==/UserScript==
//this.$ = this.jQuery = jQuery.noConflict(true);
this.$ = unsafeWindow.jQuery
GM_addStyle("\
td img{ max-width:99%; }\
#torrent_table .name_left {}\
#torrent_table .name_left .holder {position:relative; padding-left:45px;}\
#torrent_table .imdb {position:absolute; top:-10px; left:0px;}\
#torrent_table .imdb em {font-size:40px;} \
#torrent_table .imdb i {font-size:20px;} \
#torrent_table tr.good { background-color:#f7d8cf !important;}\
#torrent_table tr.medium { background-color:#eecefc !important;}\
/*#torrent_table .good .name_right .imdb_rate a, #torrent_table .medium .name_right .imdb_rate a { padding:2px; border-radius:1px; font-weight:bold; color:#FFFFFF;}*/\
.good .imdb /*, #torrent_table .good .name_right .imdb_rate a*/ { color:#e3491b;}\
.medium .imdb /*, #torrent_table .medium .name_right .imdb_rate a*/ { color:#9400D3;}\
#torrent_table .good .name_left a b::after { content:'😍 '; color:#e3491b;}\
#torrent_table .medium .name_left a b::after { content:'😊 '; color:#9400D3;}\
#torrent_table a b.DoVi {color:#999;}\
");

function containsAny(str, chars) {
    str = str.toLowerCase();
    chars = chars.map(char => char.toLowerCase());
    return chars.some(char => str.includes(char));
}
// list page
$('#torrent_table tr').each(function() {
    const line = $(this);
    const titleObj = line.find('.name_left a b');

    const searchTerms = [' DoVi ', ' DV '];
    const titleText = titleObj.text();
    if (searchTerms.some(term => titleText.includes(term))) {
        titleObj.addClass('DoVi');
    }

    // IMDB 评分处理
    const imdb_holder = line.find('.imdb_rate a');
    let imdb_text = '-';
    if (imdb_holder.length) {
        const rateText = imdb_holder.text();
        const rate = parseFloat(rateText);

        // 根据评分添加样式
        if (rate >= 7.0) {
            line.addClass('good');
        } else if (rate >= 6.0) {
            line.addClass('medium');
        }

        // 修正：处理整数和小数，避免 undefined
        const s = rateText.split('.');
        if (s.length === 2) {
            imdb_text = `<em>${s[0]}</em>.<i>${s[1]}</i>`;
        }
    }
    // leftSide remake
    const left_holder = line.find('.name_left');
    left_holder.html('<div class="holder">'+ left_holder.html() +'<div class="imdb">'+ imdb_text +'</div></div>');

    //style fix
    line.find('td:first-child a img').removeAttr('style');
});

// detail page
$('h1').append( '<span id="fsize"></span> / <a id="doubanlink" href="https://movie.douban.com/subject_search?search_text='+ $('h1').html() +'&cat=1002" target="_blank">豆瓣&gt;&gt;</a>');

$('#main_table .outer table td.heading').each(function( i, obj ){
//unsafeWindow.console.log($(obj).html()=='种子链接');
	if( $(obj).html()=='种子链接' ){
		var link = $(obj).next();
		var regex = /(https?\:\/\/totheglory\.im\/dl\/\w+\/\w+)/;
		var re = regex.exec( link.html() );
		if( re.length > 1 ){
			link.html('<a href="'+ re[1] +'" target="_blank">'+ re[1] +'</a>');
		}
	}else if( $(obj).html()=='IMDB' ){
		var regex = /title\/(\w+)\/?/;
		var link = $(obj).next().find('a').attr('href');
		var re = regex.exec( link );	//http://www.imdb.com/title/tt3882082/
		if( re.length > 1 ){
			//$('h1').append(' <a id="doubanlink" href="https://movie.douban.com/subject_search?search_text='+ re[1] +'&cat=1002" target="_blank">[豆瓣]</a>');
			$('#doubanlink').attr( 'href', 'https://movie.douban.com/subject_search?search_text='+ re[1] +'&cat=1002' );
		}
		return false;
	}else if( $(obj).html()=='尺寸' ){
		var size = $(obj).next().html().replace(/\(.*\)/,'');
		$('#fsize').html( ' / ' + size);
	}
});

//find douban link in intro
var regex = /(https?\:\/\/(?:movie\.)?douban\.com\/subject\/\w+\/?)/;
var intro = $('#kt_d').html();
var re = regex.exec( intro );
if( re.length > 1 ){
	//alert(re[1]);
	$('#doubanlink').attr( 'href', re[1] );
}
