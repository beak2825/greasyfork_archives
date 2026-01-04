// ==UserScript==
// @name         Facilita Classificação
// @namespace    https://classification.compreconfie.com.br/
// @version      0.1
// @description  Ajudar o processo de classificação de produtos.
// @author       Breno
// @match        https://classification.compreconfie.com.br/*
// @downloadURL https://update.greasyfork.org/scripts/416055/Facilita%20Classifica%C3%A7%C3%A3o.user.js
// @updateURL https://update.greasyfork.org/scripts/416055/Facilita%20Classifica%C3%A7%C3%A3o.meta.js
// ==/UserScript==

$('#frmPass').after(`<div><br>Classificações: <span id="counter">0</span> <br>
Restante Meta: <span id="meta">300</span> <br>
Velocidade: <span id="speed">0</span> / hora
<h4><time id="timer">00:00:00</time></h4>
  <button class="btn btn-secondary" type="button" id="pause" style="margin-right:5px">Pausar</button>
  <button class="btn btn-secondary" type="button" id="resume" style="margin-right:5px" disabled="disabled">Continuar</button>
  <button class="btn btn-secondary" type="button" id="reset" style="margin-right:5px">Resetar</button>
  <button class="btn btn-secondary" type="button" id="mudameta" style="margin-right:5px">Mudar Meta</button>
<br><br>
<button class="btn btn-dark" type="button" id="catapp">Categoria App</button>
<button class="btn btn-dark" type="button" id="catna">Categoria NA</button>
<button class="btn btn-dark" type="button" id="brandna">Marca NA</button>
<br><br>
Atalhos: 1 - Categoria App | 2 - Categoria NA | 3 - Marca NA | 4 - Categoria Ketchup | 5 - Categoria Agro
</div>`);

var h4 = document.getElementsByTagName('h4')[0],
    reset = document.getElementById('reset'),
    t;

var seconds = localStorage.getItem("seconds"), minutes = localStorage.getItem("minutes"), hours = localStorage.getItem("hours"), totalmin = localStorage.getItem("totalmin");
var clickCount = localStorage.getItem('clickCount');
var meta = localStorage.getItem('meta');
var lastMeta = localStorage.getItem('lastMeta');
var lastTime = localStorage.getItem('lastTime');
var $num = $('#counter');
var $num2 = $('#meta');
var $timer = $('#timer');
var speedTxt = document.getElementById("speed");
var startTime = new Date().getTime();


function add() {
	totalmin = totalmin ? parseInt(totalmin) : 0;
	seconds = seconds ? parseInt(seconds) : 0;
	minutes = minutes ? parseInt(minutes) : 0;
	hours = hours ? parseInt(hours) : 0;
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        totalmin++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }

	h4.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
	localStorage.setItem('seconds', seconds);
	localStorage.setItem('minutes', minutes);
	localStorage.setItem('hours', hours);
	localStorage.setItem('totalmin', totalmin);
	localStorage.setItem('lastTime', h4.textContent);

	speedTxt.textContent = clickCount ? Math.round(60*(clickCount / totalmin)) : 0;
    timer();
}

function timer() {
    t = setTimeout(add, 1000);
}
timer();

$('.container').addClass('container-fluid').removeClass('container');

if(!$('#select2-pu_combo-container').attr('title')){
	$( '#puNA' ).trigger( "click" );
}

function mudameta() {
    var txt;
    var meta = prompt("Insira sua nova meta:", "300");
    if (meta) {
        lastMeta = meta;
    }
    meta = parseInt(lastMeta) - clickCount;
    $num2.text(meta);
    localStorage.setItem('lastMeta', lastMeta);
    localStorage.setItem('meta', meta);
}

function resetbutton() {
    h4.textContent = "00:00:00";
	seconds = 0; minutes = 0; hours = 0; totalmin = 0;
	clickCount = 0;
	meta = lastMeta;
	localStorage.setItem('seconds', seconds);
	localStorage.setItem('minutes', minutes);
	localStorage.setItem('hours', hours);
	localStorage.setItem('totalmin', totalmin);
	localStorage.setItem('lastTime', h4.textContent);
	localStorage.setItem('clickCount', clickCount);
	localStorage.setItem('meta', meta);
	$num2.text(meta);
	$num.text(clickCount);
	timer;
}

function resumebutton(){
    t= setTimeout(add,1000);
    document.getElementById("pause").disabled = "";
    document.getElementById("resume").disabled = "disabled";
}

function pausebutton() {
	clearTimeout(t);
    document.getElementById("pause").disabled = "disabled";
    document.getElementById("resume").disabled = "";
}

function catapp() {
    $("#category_combo").select2("open");
	var $search = $("#category_combo").data('select2').dropdown.$search;
	$search.val("App > App");
	$search.trigger('input');
    $( document ).ajaxComplete(function( event, request, settings ) {
        setTimeout(function() { $('.select2-results__option--highlighted[aria-selected]').trigger("mouseup"); }, 500);
        $(event.currentTarget).unbind('ajaxComplete');
    });
}

function catna() {
    $("#category_combo").select2("open");
	var $search = $("#category_combo").data('select2').dropdown.$search;
	$search.val("NA");
	$search.trigger('input');
    $( document ).ajaxComplete(function( event, request, settings ) {
        setTimeout(function() { $('.select2-results__option').filter(function(){ return $(this).text() == 'NA'; }).trigger("mouseup"); }, 500);
        $(event.currentTarget).unbind('ajaxComplete');
    });
}

function brandna() {
	$("#brand_combo").select2("open");
	var $search = $("#brand_combo").data('select2').dropdown.$search;
	$search.val("NA");
	$search.trigger('input');
    $( document ).ajaxComplete(function( event, request, settings ) {
        setTimeout(function() { $('.select2-results__option').filter(function(){ return $(this).text() == 'NA'; }).trigger("mouseup"); }, 500);
        $(event.currentTarget).unbind('ajaxComplete');
    });
}

function catbusca(busca) {
    $("#category_combo").select2("open");
	var $search = $("#category_combo").data('select2').dropdown.$search;
	$search.val(busca);
	$search.trigger('input');
    $( document ).ajaxComplete(function( event, request, settings ) {
        setTimeout(function() { $('.select2-results__option--highlighted[aria-selected]').trigger("mouseup"); }, 500);
        $(event.currentTarget).unbind('ajaxComplete');
    });
}

$( "#reset" ).click(resetbutton);
$( "#pause" ).click(pausebutton);
$( "#resume" ).click(resumebutton);
$( "#catapp" ).click(catapp);
$( "#catna" ).click(catna);
$( "#brandna" ).click(brandna);
$( "#mudameta" ).click(mudameta);

function doc_keyUp(e) {
    switch (e.keyCode) {
        case 49:
            //1
            catapp();
            break;
        case 50:
            //2
            catna();
            break;
        case 51:
            //3
            brandna();
            break;
        case 52:
            //4
            catbusca("ketchup");
            break;
        case 53:
            //5
            catbusca("agro");
            break;
        case 97:
            //5
             $('button[onclick="confirmAssociation(this.form)"]').trigger("click");
            break;
        case 99:
            //5
            $('button[onclick="clearAssociation(this.form)"]').trigger("click");
            break;
//         case 96:
//             //0 numpad
//             $( "#saveClassification" ).trigger( "click" );
//             break;
        default:
            break;
    }
}
document.addEventListener('keyup', doc_keyUp, false);

$( function() {
    clickCount = clickCount ? parseInt(clickCount) : 0;
	meta = meta ? parseInt(meta) : 300;
    lastMeta = lastMeta ? parseInt(lastMeta) : 300;
    console.log(meta);
    console.log(lastMeta);
    totalmin = totalmin ? parseInt(totalmin) : 0;
	lastTime = lastTime ? lastTime : "00:00:00";
    $num.text(clickCount + " (R$"+(clickCount*0.11)+")");
	$num2.text(meta);
	$timer.text(lastTime);
    speedTxt.textContent = clickCount ? Math.round(60*(clickCount / totalmin)) : 0;
    $('#saveClassification, button[onclick="confirmAssociation(this.form)"], button[onclick="clearAssociation(this.form)"]').click( function() {
        $num.text(++clickCount + " (R$"+(clickCount*0.11)+")");
		if(meta>0)
		$num2.text(--meta);
        localStorage.setItem('clickCount', clickCount);
		localStorage.setItem('meta', meta);
    });
});