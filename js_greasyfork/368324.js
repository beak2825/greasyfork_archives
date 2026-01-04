// ==UserScript==
// @name     LightNovels
// @description Library allowing to remodel the <html> tag to create a 'reader' view (see screenshots).
// @version  5.0
// @include *
// @require http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant    GM.getValue
// @grant    GM.setValue
// ==/UserScript==

/** VARS **/
var isHidden = false;
var theme;
var size;
var isBold;
var debugMode;

/** FUNCTIONS **/
function createBody(){
	document.documentElement.innerHTML = '<head>' +
'		<meta charset="utf-8">' +
'		<title>Temp 5</title>' +
'		<link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css"/>' +
'		<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">' +
'		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>' +
'		<style type="text/css">' +
'			.btn { border-width : 3px; }' +
'			.darkTheme { color: #cccccc; background-color: #1a1a1a; }' +
'			.darkTheme #chapterTitle{ background-color: #030303; }' +
'			.darkTheme #chapterTitle small{ color: #FC600A; }' +
'			.darkTheme #chapterContent a { color: #BEE9BD; }' +
'			.darkTheme #navAside, .darkTheme #navBottom { background-color: #101010; }' +
'			.greyTheme { color: #000; background-color: #BEE9BD; }' +
'			.greyTheme #chapterTitle{ background-color: #578756; }' +
'			.greyTheme #chapterTitle small{ color: #933C29; }' +
'			.greyTheme #chapterContent a { color: #D34626; }' +
'			.greyTheme #navAside, .greyTheme #navBottom { background-color: #2A130E; }' +
'			.lightTheme { color: #000; background-color: #F0F7D4; }' +
'			.lightTheme #chapterTitle{ background-color: #B2D732; }' +
'			.lightTheme #chapterTitle small{ color: #FC600A; }' +
'			.lightTheme #chapterContent a { color: #4424D6; }' +
'			.lightTheme #navAside, .lightTheme #navBottom { background-color: #110934; }' +
'		</style>' +
'	</head>' +
'	<body class="container-fluid lightTheme">' +
'		<aside id="navAside" class="col-sm-1 p-1 fixed-top d-none d-sm-flex flex-wrap shadow-lg h-100">' +
'			<div class="btn-group btn-group-lg btn-group-vertical w-100 align-self-start">' +
'				<button class="buttonTheme btn btn-outline-light px-0 mb-2 rounded">' +
'					<span class="far fa-lg fa-lightbulb"></span>' +
'				</button>' +
'			</div>' +
'			<div class="btn-group btn-group-lg btn-group-vertical w-100 align-self-center">' +
'				<a class="buttonPrevious btn btn-outline-info px-0 rounded" href="#" role="button">' +
'					<span class="fas fa-lg fa-arrow-alt-circle-left"></span>' +
'				</a>' +
'				<a class="buttonTOC btn btn-outline-primary px-0 my-1 rounded" href="#" role="button">' +
'					<span class="fa fa-lg fa-th-list"></span>' +
'				</a>' +
'				<a class="buttonNext btn btn-outline-info px-0 mb-2 rounded" href="#" role="button">' +
'					<span class="fas fa-lg fa-arrow-alt-circle-right"></span>' +
'				</a>' +
'			</div>' +
'			<div class="btn-group btn-group-lg btn-group-vertical w-100 align-self-end">' +
'				<button class="buttonSmaller d-inline btn btn-outline-warning px-0 rounded">' +
'					<span class="fas fa-lg fa-compress"></span>' +
'				</button>' +
'				<button class="buttonBold d-inline btn btn-outline-secondary px-0 my-1 rounded">' +
'					<span class="fas fa-lg fa-bold"></span>' +
'				</button>' +
'				<button class="buttonBigger d-inline btn btn-outline-danger px-0 rounded">' +
'					<span class="fas fa-lg fa-expand"></span>' +
'				</button>' +
'			</div>' +
'		</aside>' +
'		<section id="chapter" class="row pt-5 pb-5">' +
'			<header id="chapterTitle" class="col-12 col-sm-11 ml-auto fixed-top d-flex shadow-sm">' +
'				<h3>' +
'					<span id="title"></span>' +
'					<br/>' +
'					<small id="subTitle"></small>' +
'				</h3>' +
'			</header>' +
'			<article id="chapterContent" class="col-12 col-sm-11 ml-auto mb-5 mt-5">' +
'			</article>' +
'		</section>' +
'		<footer id="navBottom" class="col-12 px-0 py-2 fixed-bottom d-flex d-sm-none btn-group btn-group-lg">' +
'			<button class="buttonTheme flex-fill mx-2 btn btn-outline-light rounded">' +
'				<span class="far fa-lg fa-lightbulb"></span>' +
'			</button>' +
'			<a class="buttonPrevious flex-fill mx-2 btn btn-outline-info rounded" href="#" role="button">' +
'				<span class="fas fa-lg fa-arrow-alt-circle-left"></span>' +
'			</a>' +
'			<a class="buttonTOC flex-fill btn btn-outline-primary rounded" href="#" role="button">' +
'				<span class="fa fa-lg fa-th-list"></span>' +
'			</a>' +
'			<a class="buttonNext flex-fill mx-2 btn btn-outline-info rounded" href="#" role="button">' +
'				<span class="fas fa-lg fa-arrow-alt-circle-right"></span>' +
'			</a>' +
'			<a class="buttonSmaller flex-fill mx-2 btn btn-outline-warning rounded" href="#">' +
'				<span class="fas fa-lg fa-compress"></span>' +
'			</a>' +
'			<a class="buttonBold flex-fill btn btn-outline-secondary rounded" href="#">' +
'				<span class="fas fa-lg fa-bold"></span>' +
'			</a>' +
'			<a class="buttonBigger flex-fill mx-2 btn btn-outline-danger rounded" href="#">' +
'				<span class="fas fa-lg fa-expand"></span>' +
'			</a>' +
'		</footer>' +
'	</body>';
  
	(async function() {
		setDebugMode(await GM.getValue("debugMode", true));
		setTheme(await GM.getValue("theme", "lightTheme"));
		setSize(await GM.getValue("size", 18));
		setIsBold(await GM.getValue("isBold", false));
	})();
  
  
	$(".buttonTheme").each(function(){
        $(this).click(function(event) {
			switch(theme){ 
				case "lightTheme": setTheme("greyTheme");  break;
				case "greyTheme" : setTheme("darkTheme");  break;
				case "darkTheme" : setTheme("lightTheme"); break;
				default :          setTheme("lightTheme");
			}
	})});

	$(".buttonBold").each(function(){
        $(this).click(function(event) {
			setIsBold(!isBold);
	})});

	$(".buttonSmaller").each(function(){
        $(this).click(function(event) {
			setSize(size-1);
	})});

	$(".buttonBigger").each(function(){
        $(this).click(function(event) {
			setSize(size+1);
	})});
	
	$(document).keypress(function(event){
	    if(event.key === "ArrowLeft"){
			$(".buttonPrevious:first").click();
		}
		else if(event.key === "ArrowRight"){
			$(".buttonNext:first").click();
		}
	});
}




/** SETTERS **/
function myLog(message){
  if(debugMode)
    console.log(message);
}
function setDebugMode(newDebugMode){
    myLog('Changing value of "DebugMode" from "' + debugMode + '" to "' + newDebugMode + '".');
    debugMode = newDebugMode;
    GM.setValue("debugMode", debugMode);
}

function setSize(newSize){
    myLog('Changing value of "size" from "' + size + '" to "' + newSize + '".');
	size = newSize;
	GM.setValue("size", size);
	
	$(document.body).css("font-size", size+"px");
}

function setTheme(newTheme){
	myLog('Changing theme from "' + theme + '" to "' + newTheme + '".');

	if(newTheme.length !== 0)
		$(document.body).removeClass(theme);
	$(document.body).addClass(newTheme);

	theme = newTheme;
}

function setIsBold(newIsBold){
  myLog('Changing value of "isBold" from "' + isBold + '" to "' + newIsBold + '".');
	isBold= newIsBold;
	GM.setValue("isBold", isBold);

	$(document.body).toggleClass('font-weight-bold', isBold);
}

function setTitle(newTitle){
  myLog('Setting title to "' + newTitle + '".');
  $("#title").text(newTitle);
	$(document).prop('title', newTitle);
}

function setSubTitle(newSubTitle){
  myLog('Setting sub-title to "' + newSubTitle + '".');
  $("#subTitle").text(newSubTitle);
}

function setContent(newContent){
  myLog('Setting content to "' + newContent + '".');
	$("#chapterContent").html(newContent);
}

function setTOC(newTOC){
  myLog('Setting TOC link to "' + newTOC + '".');
  
	$(".buttonTOC").each(function(){
	    if(newTOC.length === 0)
	        $(this).addClass("invisible");
	    $(this).attr("href", newTOC);
	});
}

function setPrev(newPrevious){
  myLog('Setting previous link to "' + newPrevious + '".');
	$(".buttonPrevious").each(function(){
	    if(newPrevious.length === 0)
	        $(this).addClass("invisible");
	    $(this).attr("href", newPrevious);
	});
}
function setNext(newNext){
  myLog('Setting next link to "' + newNext + '".');
  $(".buttonNext").each(function(){
	    if(newNext.length === 0)
	        $(this).addClass("invisible");
	    $(this).attr("href", newNext);
    });
}
