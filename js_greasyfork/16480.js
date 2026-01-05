// ==UserScript==
// @name       Crapeador 5000
// @version    0.4
// @description  Creador de posts y temas.
// @match      http://www.taringa.net/comunidades/*/agregar/
// @include     *://*.taringa.net/agregar
// @include *://*.taringa.net/comunidades/*/agregar/
// @include *://*.taringa.net/comunidades/posts/editar/*
// @copyright  @Cazador4ever
// @namespace @Cazador4ever @EdvardGrieg
// @downloadURL https://update.greasyfork.org/scripts/16480/Crapeador%205000.user.js
// @updateURL https://update.greasyfork.org/scripts/16480/Crapeador%205000.meta.js
// ==/UserScript==
/* jshint -W097 */
(function($) {
    var crear = $('<div class="box clearfix"><div class="title clearfix"><h3>Rss:</h3><br><button type="button" class="btn btn-primary" id="limpiar">limpiar</button><button type="button" class="btn btn-primary" id="culturacolectiva">culturacolectiva.com</button><button type="button" class="btn btn-primary" id="blogcine">Blog de Cine</button><button type="button" class="btn btn-primary" id="forospyware">forospyware.com</button><button type="button" class="btn btn-primary" id="elblogdelasalud">elblogdelasalud.info</button><button type="button" class="btn btn-primary" id="arte">ArteFeed</button><button type="button" class="btn btn-primary" id="applesfera">Applesfera</button><button type="button" class="btn btn-primary" id="upsocl">upsocl.com</button><button type="button" class="btn btn-primary" id="tuwindowsmundo">tuwindowsmundo.com</button><button type="button" class="btn btn-primary" id="enhacke">enhacke.com</button><button type="button" class="btn btn-primary" id="wikihow">wikihow.com</button><button type="button" class="btn btn-primary" id="thumpvice">thump.vice.com</button><button type="button" class="btn btn-primary" id="rootear">rootear.com</button><button type="button" class="btn btn-primary" id="tlvz">tlvz.com</button><button type="button" class="btn btn-primary" id="dragonjar">dragonjar.org</button><button type="button" class="btn btn-primary" id="omicrono">omicrono.com</button><button type="button" class="btn btn-primary" id="fwhibbit">fwhibbit.blogspot.com</button><button type="button" class="btn btn-primary" id="trianarts">trianarts.com</button><button type="button" class="btn btn-primary" id="limalimon">www.limalimon.cl</button></br></div></div>');
    $('#sidebar').prepend(crear);

    var htmlToBBCode = function(html) {

        html = html.replace(/<pre(.*?)>(.*?)<\/pre>/gmi, "[code]$2[/code]");

        html = html.replace(/<h[1-7](.*?)>(.*?)<\/h[1-7]>/, "\n[b]$2[/b]\n");

        //paragraph handling:
        //- if a paragraph opens on the same line as another one closes, insert an extra blank line
        //- opening tag becomes two line breaks
        //- closing tags are just removed
        // html += html.replace(/<\/p><p/<\/p>\n<p/gi;
        // html += html.replace(/<p[^>]*>/\n\n/gi;
        // html += html.replace(/<\/p>//gi;

        html = html.replace(/<br(.*?)>/gi, "\n");
        html = html.replace(/<textarea(.*?)>(.*?)<\/textarea>/gmi, "\[code]$2\[\/code]");
        html = html.replace(/<b>/gi, "[b]");
        html = html.replace(/<i>/gi, "[i]");
        html = html.replace(/<u>/gi, "[u]");
        html = html.replace(/<\/b>/gi, "[/b]");
        html = html.replace(/<\/i>/gi, "[/i]");
        html = html.replace(/<\/u>/gi, "[/u]");
        html = html.replace(/<em>/gi, "[b]");
        html = html.replace(/<\/em>/gi, "[/b]");
        html = html.replace(/<strong>/gi, "[b]");
        html = html.replace(/<\/strong>/gi, "[/b]");
        html = html.replace(/<cite>/gi, "[i]");
        html = html.replace(/<\/cite>/gi, "[/i]");
        html = html.replace(/<font color="(.*?)">(.*?)<\/font>/gmi, "[color=$1]$2[/color]");
        html = html.replace(/<font color=(.*?)>(.*?)<\/font>/gmi, "[color=$1]$2[/color]");
        html = html.replace(/<link(.*?)>/gi, "");
        html = html.replace(/<li(.*?)>(.*?)<\/li>/gi, "[*]$2");
        html = html.replace(/<ul(.*?)>/gi, "[list]");
        html = html.replace(/<\/ul>/gi, "[/list]");
        html = html.replace(/<div>/gi, "\n");
        html = html.replace(/<\/div>/gi, "\n");
        html = html.replace(/<td(.*?)>/gi, " ");
        html = html.replace(/<tr(.*?)>/gi, "\n");

        html = html.replace(/<img(.*?)src="(.*?)"(.*?)>/gi, "[img]$2[/img]");
        html = html.replace(/&nbsp/gi, " ");
        html = html.replace(/<a(.*?)href="(.*?)"(.*?)>(.*?)<\/a>/gi, "[url=$2]$4[/url]");

        html = html.replace(/<head>(.*?)<\/head>/gmi, "");
        html = html.replace(/<object>(.*?)<\/object>/gmi, "");
        html = html.replace(/<script(.*?)>(.*?)<\/script>/gmi, "");
        html = html.replace(/<style(.*?)>(.*?)<\/style>/gmi, "");
        html = html.replace(/<title>(.*?)<\/title>/gmi, "");
        html = html.replace(/<!--(.*?)-->/gmi, "\n");

        html = html.replace(/\/\//gi, "/");
        html = html.replace(/http:\//gi, "http://");

        html = html.replace(/<(?:[^>'"]*|(['"]).*?\1)*>/gmi, "");
        html = html.replace(/\r\r/gi, ""); 
        html = html.replace(/\[img]\//gi, "[img]");
        html = html.replace(/\[url=\//gi, "[url=");

        html = html.replace(/(\S)\n/gi, "$1 ");

        return html;
    };



    function rss() {
        var api = 'https://query.yahooapis.com/v1/public/yql?q=select%20title%2C%20content%3Aencoded%20from%20rss%20where%20url%3D%27http%3A%2F%2Fculturacolectiva.com%2Ffeed%2F%27&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
        $.getJSON( api, function(json) {
            var body= $('#markItUp').val();
            var a = $('#markItUp');
            var titulo = $('#titulo-input');
            var tit = json.query.results.item[0].title;
            var titcort = tit.substring(0,57);
            var dot = '...';
            var d = json.query.results.item[0].encoded;
            var c = htmlToBBCode('[align=center]'+d+'[/align]').replace(/&quot;/g,"[img=https://k60.kn3.net/A/0/7/D/A/6/979.png]");
            a.val(body+c).click().focus();
            titulo.val(titcort+dot).click().focus();});
    } culturacolectiva.onclick=rss;

    function rss2() {
        var api = 'https://query.yahooapis.com/v1/public/yql?q=select%20title%2C%20description%20from%20rss%20where%20url%3D%27http%3A%2F%2Ffeeds.weblogssl.com%2Fblogdecine%27&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
        $.getJSON( api, function(json) {
            var body= $('#markItUp').val();
            var a = $('#markItUp');
            var titulo = $('#titulo-input');
            var tit = json.query.results.item[0].title;
            var titcort = tit.substring(0,57);
            var dot = '...';
            var d = json.query.results.item[0].description;
            var c = htmlToBBCode('[align=center]'+d+'[/align]').replace(/&quot;/g,"[img=https://k60.kn3.net/A/0/7/D/A/6/979.png]");
            a.val(body+c).click().focus();
            titulo.val(titcort+dot).click().focus();});
    } blogcine.onclick=rss2;

    function rss3() {
        var api = 'https://query.yahooapis.com/v1/public/yql?q=select%20title%2C%20content%3Aencoded%20from%20rss%20where%20url%3D%27http%3A%2F%2Fwww.forospyware.com%2Fexternal.php%3Ftype%3DRSS2%26forumids%3D9%27&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
        $.getJSON( api, function(json) {
            var body= $('#markItUp').val();
            var a = $('#markItUp');
            var titulo = $('#titulo-input');
            var tit = json.query.results.item[0].title;
            var titcort = tit.substring(0,57);
            var dot = '...';
            var d = json.query.results.item[0].encoded;
            var c = htmlToBBCode('[align=center]'+d+'[/align]').replace(/&quot;/g,"[img=https://k60.kn3.net/A/0/7/D/A/6/979.png]");
            a.val(body+c).click().focus();
            titulo.val(titcort+dot).click().focus();});
    } forospyware.onclick=rss3;

    function rss4() {
        var api = 'https://query.yahooapis.com/v1/public/yql?q=select%20title%2C%20content%3Aencoded%20from%20rss%20where%20url%3D%27https%3A%2F%2Fwww.elblogdelasalud.info%2Ffeed%27&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
        $.getJSON( api, function(json) {
            var body= $('#markItUp').val();
            var a = $('#markItUp');
            var titulo = $('#titulo-input');
            var tit = json.query.results.item[0].title;
            var titcort = tit.substring(0,57);
            var dot = '...';
            var d = json.query.results.item[0].encoded;
            var c = htmlToBBCode('[align=center]'+d+'[/align]').replace(/&quot;/g,"[img=https://k60.kn3.net/A/0/7/D/A/6/979.png]");
            a.val(body+c).click().focus();
            titulo.val(titcort+dot).click().focus();});
    } elblogdelasalud.onclick=rss4;

    function rss5() {
        var api = 'https://query.yahooapis.com/v1/public/yql?q=select%20title%2C%20content%3Aencoded%20from%20rss%20where%20url%3D%27http%3A%2F%2Fartefeed.com%2Ffeed%2F%27&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
        $.getJSON( api, function(json) {
            var body= $('#markItUp').val();
            var a = $('#markItUp');
            var titulo = $('#titulo-input');
            var tit = json.query.results.item[0].title;
            var titcort = tit.substring(0,57);
            var dot = '...';
            var d = json.query.results.item[0].encoded;
            var c = htmlToBBCode('[align=center]'+d+'[/align]').replace(/&quot;/g,"[img=https://k60.kn3.net/A/0/7/D/A/6/979.png]");
            a.val(body+c).click().focus();
            titulo.val(titcort+dot).click().focus();});
    } arte.onclick=rss5;

    function rss6() {
        var api = 'https://query.yahooapis.com/v1/public/yql?q=select%20title%2C%20description%20from%20rss%20where%20url%3D%27http%3A%2F%2Ffeeds.weblogssl.com%2Fapplesfera%27&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
        $.getJSON( api, function(json) {
            var body= $('#markItUp').val();
            var a = $('#markItUp');
            var titulo = $('#titulo-input');
            var tit = json.query.results.item[0].title;
            var titcort = tit.substring(0,57);
            var dot = '...';
            var d = json.query.results.item[0].description;
            var c = htmlToBBCode('[align=center]'+d+'[/align]').replace(/&quot;/g,"[img=https://k60.kn3.net/A/0/7/D/A/6/979.png]");
            a.val(body+c).click().focus();
            titulo.val(titcort+dot).click().focus();});
    } applesfera.onclick=rss6;

    function rss7() {
        var api = 'https://query.yahooapis.com/v1/public/yql?q=select%20title%2C%20content%3Aencoded%20from%20rss%20where%20url%3D%27http%3A%2F%2Ffeeds.feedburner.com%2FUpsocl%2F%27&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
        $.getJSON( api, function(json) {
            var body= $('#markItUp').val();
            var a = $('#markItUp');
            var titulo = $('#titulo-input');
            var tit = json.query.results.item[0].title;
            var titcort = tit.substring(0,57);
            var dot = '...';
            var d = json.query.results.item[0].encoded;
            var c = htmlToBBCode('[align=center]'+d+'[/align]').replace(/&quot;/g,"[img=https://k60.kn3.net/A/0/7/D/A/6/979.png]");
            a.val(body+c).click().focus();
            titulo.val(titcort+dot).click().focus();});
    } upsocl.onclick=rss7;

    function rss8() {
        var api = 'https://query.yahooapis.com/v1/public/yql?q=select%20title%2C%20content%3Aencoded%20from%20rss%20where%20url%3D%27http%3A%2F%2Fwww.tuwindowsmundo.com%2Ffeed%2F%27&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
        $.getJSON( api, function(json) {
            var body= $('#markItUp').val();
            var a = $('#markItUp');
            var titulo = $('#titulo-input');
            var tit = json.query.results.item[0].title;
            var titcort = tit.substring(0,57);
            var dot = '...';
            var d = json.query.results.item[0].encoded;
            var c = htmlToBBCode('[align=center]'+d+'[/align]').replace(/&quot;/g,"[img=https://k60.kn3.net/A/0/7/D/A/6/979.png]");
            a.val(body+c).click().focus();
            titulo.val(titcort+dot).click().focus();});
    } tuwindowsmundo.onclick=rss8;

    function rss9() {
        var api = 'https://query.yahooapis.com/v1/public/yql?q=select%20title%2C%20content%3Aencoded%20from%20rss%20where%20url%3D%27http%3A%2F%2Fwww.enhacke.com%2Ffeed%2F%27&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
        $.getJSON( api, function(json) {
            var body= $('#markItUp').val();
            var a = $('#markItUp');
            var titulo = $('#titulo-input');
            var tit = json.query.results.item[0].title;
            var titcort = tit.substring(0,57);
            var dot = '...';
            var d = json.query.results.item[0].encoded;
            var c = htmlToBBCode('[align=center]'+d+'[/align]').replace(/&quot;/g,"[img=https://k60.kn3.net/A/0/7/D/A/6/979.png]");
            a.val(body+c).click().focus();
            titulo.val(titcort+dot).click().focus();});
    } enhacke.onclick=rss9;

    function rss10() {
        var api = 'https://query.yahooapis.com/v1/public/yql?q=select%20title%2C%20content%3Aencoded%20from%20rss%20where%20url%3D%27http%3A%2F%2Fes.wikihow.com%2Ffeed.rss%27&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
        $.getJSON( api, function(json) {
            var body= $('#markItUp').val();
            var a = $('#markItUp');
            var titulo = $('#titulo-input');
            var tit = json.query.results.item[0].title;
            var titcort = tit.substring(0,57);
            var dot = '...';
            var d = json.query.results.item[0].encoded;
            var c = htmlToBBCode('[align=center]'+d+'[/align]').replace(/&quot;/g,"[img=https://k60.kn3.net/A/0/7/D/A/6/979.png]");
            a.val(body+c).click().focus();
            titulo.val(titcort+dot).click().focus();});
    } wikihow.onclick=rss10;

    function rss11() {
        var api = 'https://query.yahooapis.com/v1/public/yql?q=select%20title%2C%20content%3Aencoded%20from%20rss%20where%20url%3D%27https%3A%2F%2Fthump.vice.com%2Fes_mx%2Frss%27&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
        $.getJSON( api, function(json) {
            var body= $('#markItUp').val();
            var a = $('#markItUp');
            var titulo = $('#titulo-input');
            var tit = json.query.results.item[0].title;
            var titcort = tit.substring(0,57);
            var dot = '...';
            var d = json.query.results.item[0].encoded;
            var c = htmlToBBCode('[align=center]'+d+'[/align]').replace(/&quot;/g,"[img=https://k60.kn3.net/A/0/7/D/A/6/979.png]");
            a.val(body+c).click().focus();
            titulo.val(titcort+dot).click().focus();});
    } thumpvice.onclick=rss11;

    function rss12() {
        var api = 'https://query.yahooapis.com/v1/public/yql?q=select%20title%2C%20encoded%20from%20rss%20where%20url%3D%27http%3A%2F%2Ffeeds.feedburner.com%2Frootear%3Fformat%3Dxml%27&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
        $.getJSON( api, function(json) {
            var body= $('#markItUp').val();
            var a = $('#markItUp');
            var titulo = $('#titulo-input');
            var tit = json.query.results.item[0].title;
            var titcort = tit.substring(0,57);
            var dot = '...';
            var d = json.query.results.item[0].encoded;
            var c = htmlToBBCode('[align=center]'+d+'[/align]').replace(/&quot;/g,"[img=https://k60.kn3.net/A/0/7/D/A/6/979.png]");
            a.val(body+c).click().focus();
            titulo.val(titcort+dot).click().focus();});
    } rootear.onclick=rss12;

    function rss13() {
        var api = 'https://query.yahooapis.com/v1/public/yql?q=select%20title%2C%20encoded%20from%20rss%20where%20url%3D%27http%3A%2F%2Ftlvz.com%2Ffeed%2F%27&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
        $.getJSON( api, function(json) {
            var body= $('#markItUp').val();
            var a = $('#markItUp');
            var titulo = $('#titulo-input');
            var tit = json.query.results.item[0].title;
            var titcort = tit.substring(0,57);
            var dot = '...';
            var d = json.query.results.item[0].encoded;
            var c = htmlToBBCode('[align=center]'+d+'[/align]').replace(/&quot;/g,"[img=https://k60.kn3.net/A/0/7/D/A/6/979.png]");
            a.val(body+c).click().focus();
            titulo.val(titcort+dot).click().focus();});
    } tlvz.onclick=rss13;

    function rss14() {
        var api = 'https://query.yahooapis.com/v1/public/yql?q=select%20title%2C%20encoded%20from%20rss%20where%20url%3D%27http%3A%2F%2Fcomunidad.dragonjar.org%2Fexternal.php%3Ftype%3DRSS2%27&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
        $.getJSON( api, function(json) {
            var body= $('#markItUp').val();
            var a = $('#markItUp');
            var titulo = $('#titulo-input');
            var tit = json.query.results.item[0].title;
            var titcort = tit.substring(0,57);
            var dot = '...';
            var d = json.query.results.item[0].encoded;
            var c = htmlToBBCode('[align=center]'+d+'[/align]').replace(/&quot;/g,"[img=https://k60.kn3.net/A/0/7/D/A/6/979.png]");
            a.val(body+c).click().focus();
            titulo.val(titcort+dot).click().focus();});
    } dragonjar.onclick=rss14;

    function rss15() {
        var api = 'https://query.yahooapis.com/v1/public/yql?q=select%20title%2C%20encoded%20from%20rss%20where%20url%3D%27http%3A%2F%2Fomicrono.feedsportal.com%2Fc%2F34006%2Ff%2F617042%2Findex.rss%27&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
        $.getJSON( api, function(json) {
            var body= $('#markItUp').val();
            var a = $('#markItUp');
            var titulo = $('#titulo-input');
            var tit = json.query.results.item[0].title;
            var titcort = tit.substring(0,57);
            var dot = '...';
            var d = json.query.results.item[1].encoded;
            var c = htmlToBBCode('[align=center]'+d+'[/align]').replace(/&quot;/g,"[img=https://k60.kn3.net/A/0/7/D/A/6/979.png]");
            a.val(body+c).click().focus();
            titulo.val(titcort+dot).click().focus();});
    } omicrono.onclick=rss15;

    function rss16() {
        var api = 'https://query.yahooapis.com/v1/public/yql?q=select%20title%2C%20description%20from%20rss%20where%20url%3D%27http%3A%2F%2Ffwhibbit.blogspot.com%2Ffeeds%2Fposts%2Fdefault%3Falt%3Drss%27&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
        $.getJSON( api, function(json) {
            var body= $('#markItUp').val();
            var a = $('#markItUp');
            var titulo = $('#titulo-input');
            var tit = json.query.results.item[0].title;
            var titcort = tit.substring(0,57);
            var dot = '...';
            var d = json.query.results.item[1].description;
            var c = htmlToBBCode('[align=center]'+d+'[/align]').replace(/&quot;/g,"[img=https://k60.kn3.net/A/0/7/D/A/6/979.png]");
            a.val(body+c).click().focus();
            titulo.val(titcort+dot).click().focus();});
    } fwhibbit.onclick=rss16;
    $('#trianarts').on('click', rss17);
    function rss17 (){
        var api = 'https://query.yahooapis.com/v1/public/yql?q=select%20title%2C%20content%3Aencoded%20from%20rss%20where%20url%3D%27http%3A%2F%2Ftrianarts.com%2Ffeed%2F%27&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
        $.getJSON( api, function(json) {
            var body= $('#markItUp').val();
            var a = $('#markItUp');
            var titulo = $('#titulo-input');
            var tit = json.query.results.item[0].title;
            var titcort = tit.substring(0,57);
            var dot = '...';
            var d = json.query.results.item[1].encoded;
            var c = htmlToBBCode('[align=center]'+d+'[/align]').replace(/&quot;/g,"[img=https://k60.kn3.net/A/0/7/D/A/6/979.png]");
            a.val(body+c).click().focus();
            titulo.val(titcort+dot).click().focus();});
    }
    function rss18 (){
        var api = 'https://query.yahooapis.com/v1/public/yql?q=select%20title%2C%20encoded%20from%20rss%20where%20url%3D%27http%3A%2F%2Fwww.limalimon.cl%2Ffeed%2F%27&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
        $.getJSON( api, function(json) {
            var body= $('#markItUp').val();
            var a = $('#markItUp');
            var titulo = $('#titulo-input');
            var tit = json.query.results.item[0].title;
            var titcort = tit.substring(0,57);
            var dot = '...';
            var d = json.query.results.item[0].encoded;
            var c = htmlToBBCode('[align=center]'+d+'[/align]').replace(/&quot;/g,"[img=https://k60.kn3.net/A/0/7/D/A/6/979.png]");
            a.val(body+c).click().focus();
            titulo.val(titcort+dot).click().focus();});
    }
    $('#limalimon').on('click', rss18);

    function clear() {
        $('#markItUp').val('');
        $('#titulo-input').val('');
    }
    $('#limpiar').on('click', clear);

})(jQuery);