// ==UserScript==
// @name           Virtonomica: Контроль запасов месторождения
// @namespace      virtonomica
// @author         UnclWish
// @description    Показывает количество пересчетов, оставшихся до исчерпания запасов месторождения
// @include        http*://virtonomic*.*/*/*/unit/view/*
// @exclude        http*://virtonomic*.*/*/*/unit/view/*/*
// @version        2.4
// @downloadURL https://update.greasyfork.org/scripts/23164/Virtonomica%3A%20%D0%9A%D0%BE%D0%BD%D1%82%D1%80%D0%BE%D0%BB%D1%8C%20%D0%B7%D0%B0%D0%BF%D0%B0%D1%81%D0%BE%D0%B2%20%D0%BC%D0%B5%D1%81%D1%82%D0%BE%D1%80%D0%BE%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/23164/Virtonomica%3A%20%D0%9A%D0%BE%D0%BD%D1%82%D1%80%D0%BE%D0%BB%D1%8C%20%D0%B7%D0%B0%D0%BF%D0%B0%D1%81%D0%BE%D0%B2%20%D0%BC%D0%B5%D1%81%D1%82%D0%BE%D1%80%D0%BE%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==

var run = function()
{

   	var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	$ = win.$;


	var zapas;
	var isMine = 0;
	var dob = 0; // добыча на одного работника
	var dobtot; // добыча всего
	var tech; // установленная техна
	var rab;  // количество работников
	var hard;  // сложность добычи
	var hardk = [1.96, 1.4, 1, 0.714, 0.51 ]; // коэфф в зависимости от сложности
	var days; // дней осталось

	// сперва надо убедиться, что мы на основной странице месторождения
	if (($('#wrapper > div.metro_header > div > div.picture').attr('class').search('mine')!=-1)||($('#wrapper > div.metro_header > div > div.picture').attr('class').search('oil')!=-1))
	{
		isMine = 1;
	}

	if ( !isMine ) return;


	// определить добычу на 1-го работника при первой техне и сложности 3

	$( 'img[src*="diamonds.gif"]' ).each ( function()
	{
		dob = 1;  // алмазы
	});

	$( 'img[src*="gold.gif"]' ).each ( function()
	{
		dob = 4; // золото
	});

	$( 'img[src*="bauxite.gif"]' ).each ( function()
	{
		dob = 20; // бокситы
	});

	$( 'img[src*="mn.gif"]' ).each ( function()
	{
		dob = 40; // марганец
	});


	$( 'img[src*="cr.gif"]' ).each ( function()
	{
		dob = 20; // хром
	});

	$( 'img[src*="colch.gif"]' ).each ( function()
	{
		dob = 20; // медный колчедан
	});


	$( 'img[src*="ironore.gif"]' ).each ( function()
	{
		dob = 60; // желруда
	});


	$( 'img[src*="silicon.gif"]' ).each ( function()
	{
		dob = 80;  // кремний
	});


	$( 'img[src*="coal.gif"]' ).each ( function()
	{
		dob = 90;  // уголь
	});


	$( 'img[src*="oil.gif"]' ).each ( function()
	{
		dob = 100;  // нефть
	});

	$( 'img[src*="minerals.gif"]' ).each ( function()
	{
		dob = 200;  // минералы
	});


	$( 'img[src*="clay.gif"]' ).each ( function()
	{
		dob = 250;  // глина
	});

    $( 'img[src*="ilmenite.gif"]' ).each ( function()
	{
		dob = 80;  // титанруда
	});

    $( 'img[src*="polymetallic.gif"]' ).each ( function()
	{
		dob = 20;  // полиметалл
	});


	if ( !dob ) return;  // неизвестный тип месторождения


	// информация о месторождении

    var new_interface = $("div.unit_box-container").length;
    if (new_interface) {
    var cells;
    $("td:contains('Запасы месторождения'):first").each(function() {
    cells = this;});
    $("td:contains('Запасы месторождения')").next().each(function() {
    zapas = this.innerHTML.replace(/[^-0-9]/gim, '');});
    $("td:contains('Сложность добычи')").next().each(function() {
    hard = parseInt( this.innerHTML );});
    $("td:contains('Уровень технологии')").next().each(function() {
    tech = parseInt( this.innerHTML );});
    $("td:contains('Количество рабочих')").next().each(function() {
    rab = this.innerHTML.replace(/\s+/g, '');
    rab = rab.split('/');
    rab = rab[0];});

    dobtot = Math.pow( 1.05, tech-1 ) * dob * hardk[hard-1] * rab;

	if ( dobtot > 0 )
	{
		days = Math.floor( zapas/dobtot );
		cells.innerHTML =  cells.innerHTML + '<br />Пересчетов до истощения: <font color="red">' + days.toString() + '</font>';
	}
    }
    else {
    var cells = $( 'table.infoblock td' );

	var s = cells[2].innerHTML.replace( ' ', '', 'g' );

	// для хрома
	s = s.replace( ' ', '' ).replace( ' ', '' ).replace( ' ', '');

	zapas = parseInt( s );

	hard = parseInt( cells[7].innerHTML );
	tech = parseInt( cells[13].innerHTML );
	rab = parseInt( cells[34].innerHTML.replace( ' ', '' ) );

	dobtot = Math.pow( 1.05, tech-1 ) * dob * hardk[hard-1] * rab;

	if ( dobtot > 0 )
	{
		days = Math.floor( zapas/dobtot );
		cells[0].innerHTML =  cells[0].innerHTML + '<br />Пересчетов до истощения: <font color="red">' + days.toString() + '</font>';
	}
    }
};

var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);