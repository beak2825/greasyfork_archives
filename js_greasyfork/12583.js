// ==UserScript==
// @name        Virtonomica:UnionVote
// @namespace   virtonomica
// @description Подсчет числа Лайков и Анлайков в Губернских и Президенских советах
// @description Showing of Like and Unlike the provincial and presidential council
// @include     https://*virtonomic*.*/*/main/politics/council/*
// @include     https://*virtonomic*.*/*/main/politics/parliament/*
// @version     0.21
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12583/Virtonomica%3AUnionVote.user.js
// @updateURL https://update.greasyfork.org/scripts/12583/Virtonomica%3AUnionVote.meta.js
// ==/UserScript==
var run = function()
{
var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
$ = win.$;

var table = $("table.grid");
var tr = $("tr", table);
//console.log( tr.length );
var like = 0;
var unlike = 0;
var scale = 0;

var like2 = 0;
var unlike2 = 0;

for(var i=1; i<tr.length; i++) {
	var td = $("td", tr.eq(i) );
	var vote = parseInt( td.eq(3).text() );
	var ico = td.eq(4).html();
	//console.log( vote + "==" + td.eq(4).html() );
        
	var party = $.trim( $('span',td.eq(5) ).text() ) ;
	//console.log(party + " = " + vote);

	if ( ico.indexOf('green-like') > 0 ){
		like+= vote;
		like2+= vote;

 		if ( (party == 'Клерикальная партия') || 
		     (party == 'Clerical party') ) {
			like2 += vote ;
			//console.log(party + " = " + vote);
		} 

	} else if ( ico.indexOf('unlike') > 0 ){
		unlike+= vote;
		unlike2+= vote;
		//console.log(party + " = " + vote);

 		if ( (party == 'Анархическая партия') || 
                     (party == 'Anarchist Party') ) {
			unlike2 += vote;
			//console.log(party + " = " + vote);
		}

	}else if ( ico.indexOf('scales') > 0 ){
		scale+= vote;
	}
	
	/*
	unlike
	green-like
	scales
	*/
}

var text = "<table><tr><td><img src=/img/icon/green-like.png><td>" + like;
if (like != like2) text+= " <span title='С учетом голосов клерикалов'>(" + like2+ ")</span>";
text+="<td><img src=/img/icon/red-unlike.png><td>" + unlike;
if (unlike != unlike2) text+= " <span title='С учетом голосов анархистов'>(" + unlike2+ ")</span>";
text+="<td><img src=/img/icon/scales.png><td>" + scale;
text+= "</table>";

$("table.infoblock").after(text);

}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
};