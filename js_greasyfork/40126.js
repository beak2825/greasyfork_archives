// ==UserScript==
// @name     Inc Collector
// @description Collects incoming attacks and displays them in a new tab
// @version 1.0.1
// @require https://code.jquery.com/jquery-3.2.1.min.js
// @include https://uk*.tribalwars.co.uk/*
// @include https://ch*.staemme.ch/*
// @include https://frs*.guerretribale.fr/*
// @include https://de*.die-staemme.de/*
// @include https://en*tribalwars.net/*
// @include https://nl*.tribalwars.nl/*
// @include https://pl*.plemiona.pl/*
// @include https://sv*.tribalwars.se/*
// @include https://br*.tribalwars.com.br/*
// @include https://pt*.tribalwars.com.pt/*
// @include https://cs*.divokekmeny.cz/*
// @include https://ro*.triburile.ro/*
// @include https://es*.guerrastribales.es/*
// @include https://it*.tribals.it/*
// @include https://us*.tribalswars.us/*
// @namespace https://greasyfork.org/users/151096
// @downloadURL https://update.greasyfork.org/scripts/40126/Inc%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/40126/Inc%20Collector.meta.js
// ==/UserScript==
javascript: function cortarString(string, fp, lp) {
	return string.slice(fp, lp);
}

function adicionarElem(array, elem) {
	if ($.inArray(elem, array) == -1) {
		return elem;
	}
	return false;
}
var atkComing = $('#incomings_table tbody tr');
if (atkComing.length) {
	var strAtt, strId, strSup, aux, arrayLength;
	var coords = [],
		coordsS = [];
	for (var i = 0; i < (atkComing.length - 2); i++) {
		strAtt = $('#incomings_table tbody tr:eq(' + (1 + i) + ') td:eq(2) a').text();
		strSup = $('#incomings_table tbody tr:eq(' + (1 + i) + ') td:eq(1) a').text();
		strId = $('#incomings_table tbody tr:eq(' + (1 + i) + ') td:eq(2) a').attr("href");
		strAtt = cortarString(strAtt, strAtt.indexOf("(") + 1, strAtt.indexOf(")"));
		strSup = cortarString(strSup, strSup.indexOf("(") + 1, strSup.indexOf(")"));
		aux = adicionarElem(coords, strAtt);
		if (aux) {
			arrayLength = coords.length;
			coords[arrayLength] = cortarString(strId, strId.indexOf("id") + 3, strId.length) + "&" + aux;
		}
		strId = $('#incomings_table tbody tr:eq(' + (1 + i) + ') td:eq(1) a').attr("href");
		aux = adicionarElem(coordsS, strSup);
		if (aux) {
			arrayLength = coordsS.length;
			coordsS[arrayLength] = cortarString(strId, strId.indexOf("village") + 8, strId.indexOf("&screen")) + "&" + aux;
		}
	} /*SA%C3%8DDA*/
    var coord1 = coords.join(",");
    var coord2 = coordsS.join(",");
    
    var S = '<html>' + '<head>' + '<title>Coordinate Collector</title>' + '<meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\" />' + '</head>' + '<body>' + '<h4>Origin:</h4>' + coord1 + '<br><br>' + '<h4>Destination:</h4>' + coord2;
	'</body></html>';
	var popup = window.open('about:blank', 'twcc', 'width=720,height=480,scrollbars=1');
	popup.document.open('text/html', 'replace');
	popup.document.write(S);
	popup.document.close();
}
void(0);