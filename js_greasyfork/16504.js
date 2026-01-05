// ==UserScript==
// @name        KissAnime Auto Play Next Episode
// @description Automatically plays the next video in the list without ever leaving fullscreen mode! Works on Kissanime/kisscartoon/kissasian
// @icon        http://kissanime.ru/Content/images/favicon.ico
// @locale      en
// @namespace   matthewmarillac.com
// @author      Matthew James de Marillac
// @include     *://kissanime.com/*
// @include     *://kisscartoon.me/*
// @include     *://kisscartoon.se/*
// @include     *://kissanime.to/*
// @include     *://kissanime.ru/*
// @include     *://kissasian.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js
// @resource    materialize https://cdn.rawgit.com/mattmarillac/kissanime-userscript/master/Userscript/materialize.css
// @supportURL  https://github.com/mattmarillac/kissanime-userscript/issues
// @version     2.0.1
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/16504/KissAnime%20Auto%20Play%20Next%20Episode.user.js
// @updateURL https://update.greasyfork.org/scripts/16504/KissAnime%20Auto%20Play%20Next%20Episode.meta.js
// ==/UserScript==
//Matthew de Marillacs
//Kissanime AutoPlayer

var Url; //global variables
var skipFrom;
var skipFromStart;
var itr = false;
var active = true;
var params = window.location.pathname.split('/').slice(1);
var animeName = params[1];
var templates = templates();
var videoPlaceholder = document.getElementById('divContentVideo');  //get current video parent
if(typeof videoPlaceholder !== 'undefined' && videoPlaceholder !== 'null'){
var ref;
var video = (ref = videoPlaceholder.getElementsByTagName('video')) !== null ? ref[0] : void 0;  //get element video from previous elements child
var errorState = false;

//create interface
var style = GM_getResourceText ("materialize");
	GM_addStyle(style);
	createOverlay();	//create interface
}

$.ajaxSetup({
	timeout: 3000, 
	retryAfter:4000
});

$("#skipFromSubmit").on('click', function (event) {       //when video is ready to play add poster - prevents overlaping with default initial loading icon
	setStorage();
});

$("#removeSkip").on('click', function (event) {       //when video is ready to play add poster - prevents overlaping with default initial loading icon
	removeStorage();
});

$("#skipFromStartSubmit").on('click', function (event) {       //when video is ready to play add poster - prevents overlaping with default initial loading icon
	setStartStorage();
});

$("#removeSkipFromStart").on('click', function (event) {       //when video is ready to play add poster - prevents overlaping with default initial loading icon
	removeStartStorage();
});

function buttonFeedback(){
	$("#overlay p,input, button").fadeIn(100).fadeOut(100).fadeIn(100);
}

$("#skip-ol").on('click', function (event) {       //when video is ready to play add poster - prevents overlaping with default initial loading icon
	var overlay= document.getElementById('overlay');
	overlay.style.visibility= 'visible';
	event.stopPropagation();
});

$('#divQuality').on('change', function(e) {
  quality = $("#divQuality option:selected").html();
  setResolution(quality);
});

$('html').on('click', function(event){
	try{
		if(event.target.id === "overlay"||
		event.target.parentElement.id === "overlay"|| $(event.target).is(':input') ||
		$(event.target).is('.lever') || event.target.id === "skip-ol"){
			// do nothing, TODO: refractor this condition
		} else
	    {
		    hideMessage();
	    }
	 }catch(e){
	 	// likely an advert is using the same id :(
	 	// how can you not want to use an adblocker on this site?
	 }
});

$('.active').on('click', function(){
if (active === true)
	active = false;
else
	active = true;
});

$(video).on("playing", function(){
	itr = false;
	resume();
});

if(typeof video !== 'undefined' && video !== 'null'){
$(video).on('canplay', function (event) {       //when video is ready to play add poster - prevents overlaping with default initial loading icon
	$(video).attr('poster', "https://raw.githubusercontent.com/mattmarillac/kissanime-userscript/master/Userscript/loading.gif");  //add loading icon for pause between videos
});

$(video).on('ended',function()
{     //once video ended
	if(itr === false && active === true){
		getNextInQue();
	}else{
		itr = false;
	}
});
}

function templates(){
    var ol = _.template("<div class='card-content white-text'><p>Thanks for using <a class='teal-text' href='http://www.matthewmarillac.com/api/anime.php' target='_BLANK'>Kissanime Autoplayer</a>. Be sure to leave a rating if you enjoy using it!</p>"+
                        "<p>Select a time to skip start from:</p> <input class='white-text' id='skipFromStart' placeholder='05:30'/>" +
                        "<button class='waves-effect waves-light btn' id='skipFromStartSubmit'>Submit</button>  <button class='waves-effect waves-light btn' id='removeSkipFromStart'>Remove</button></div>"+
                        "<p>Select a time to skip credits from:</p> <input class='white-text' id='skipFrom' placeholder='30:20'/>" +
                        "<button class='waves-effect waves-light btn' id='skipFromSubmit'>Submit</button>  <button class='waves-effect waves-light btn' id='removeSkip'>Remove</button></div>");
    var bar = _.template("<div id='skip-ol' style='float:right;' class='vjs-control'><img style='height: 100%;' src='<%= icon %>'/></div>");
    var innerstyle = _.template("<style>#overlay {position: absolute; right:0; bottom: 35px; color: #FFF; text-align: center; font-size: 20px; background-color: rgba(7, 20, 30, 0.7); width: 640px; padding: 10px 0; z-index: 2147483647; border: 2px solid rgba(128, 128, 128, 0.35);}</style>");
    //-> end templates
    return {'ol': ol,
            'bar': bar,
            'innerstyle':innerstyle
           };
}

function getNextInQue(){
	var element = document.getElementById('btnNext').parentNode;
	if(Url === "" || Url === null)
	{   //if this is the first url in que get the first video link and src
		getNextUrl("init");
	}
	else
	{   //otherwise we move foward with previous ajax requested page
		getNextUrl(Url);
	}
}

//When the user clicks on the next button, goes to the next video from the current selected index
$(document.getElementById('btnNext').parentNode).on('click', function(event) {
	event.preventDefault();
	PrevOrNext("next");
});

//When the user clicks on the previous button, goes to the previous video from the current selected index
$(document.getElementById('btnPrevious').parentNode).on('click', function(event) {
	event.preventDefault();
	PrevOrNext("prev");
});

function nextVideo(url){
	// request video URL
	$.ajax({
		type: "GET",
		url: url,
		cache: false,
		success: function (response)
		{
			var select;
			var res = findResolution($(response).find('#divQuality option'));
			if(res !== false && typeof res !== 'undefined' && res !== null){
				select = $(res);
			}
			else{
				select = $(response).find('#divQuality option')[0];
			}
			    //get next video in encoded form from quality dropdown value
		if (OnKissCartoon()) {
			video.src = $kissenc.decrypt(_.escape($(select).val()));     //decodes using kisscartoon's decoder
		}else{
			video.src = ovelWrap(_.escape($(select).val()));       //base 64 decode extracted url and play src
		}
			video.play();

			document.getElementById("selectEpisode").selectedIndex++;       //increment current episode selection in episode select dropdown

			skipStart();
		},
		error: function (xhr, status, error) {
			// error in ajax
			editMessage('<p>Conectivity issue: trying to load video again in 3 seconds</p>');
			
			setTimeout ( function(){ nextVideo(url); }, $.ajaxSetup().retryAfter );
			
			errorState = true;
		}
		});

		if(errorState){

			editMessage(templates.ol());
			
			var overlay= document.getElementById('overlay');
			overlay.style.visibility= 'hidden';

			errorState = false;
		}
}

function getNextUrl(currentUrl){   //get the next videos url from an ajax request by reading href of next link on that page

	if(currentUrl == "init")
	{//this is the first video in the que - get the next page from current page link
			var element = document.getElementById('btnNext').parentNode;    //get url of next video from button href
			if(element===null || typeof(element)==='undefined' || element==='')
			{
				console.log("No more videos in series");
				return;
			}

			history.pushState({}, '', _.escape(element.href));    //add page to history so users can keep track of what anime they have seen
			Url = _.escape(element.href);     //asign video to current video global variable
			nextVideo(element.href);
	}
	else
	{   //make ajax request to the next page in que to get video href from the last page we ajax requested
		var nextUrl;
		 $.ajax({
			type: "GET",
			url: currentUrl,
			cache: false,
			success: function (response)
			{
				var select = $(response).find('img#btnNext').parent();
				nextUrl = _.escape($(select).attr("href"));       //get url of next video from button href from within ajax request
				history.pushState({}, '', _.escape($(select).attr("href")));  //add page to history so users can keep track of what anime they have seen
				Url = nextUrl;      //asign video to current video global variable
				nextVideo(nextUrl);
			},
			error: function (xhr, status, error) {
				// error in ajax
				console.log(error);
				editMessage('<p>Conectivity issue: trying to load video again in 3 seconds</p>');
				errorState = true;
				setTimeout ( function(){ getNextUrl(currentUrl); }, $.ajaxSetup().retryAfter );
			
			}
		 });
		 console.log(errorState);
		 if(errorState){

			editMessage(templates.ol());
			
			var overlay= document.getElementById('overlay');
			overlay.style.visibility= 'hidden';

			errorState = false;
		}
	}
}

function skipStart(){
	//Skip start credits if set
	        if(skipFromStart !== null && typeof skipFromStart != 'undefined'){
	            var seconds = timeToSeconds(skipFromStart);
	            video.currentTime = seconds;
	        }
}

function findResolution(option){
    var res;
    _.each(option, function(opt){
		if($(opt).text() === getResolution()){
			res = opt;
		}
	});
    return res;
}

function OnKissCartoon(){	//check if on kisscarton
	if(window.location.href.indexOf("kisscartoon") > -1) {
		return true;
	}else{
		return false;
	}
}


function PrevOrNext(pon){ 	//Goes to the next or previous page based off the currently selected episode
	var url;
	var element;
	var to;
	if (pon === "next"){
		url = window.location.href;
		element = document.getElementById("selectEpisode");
		element.selectedIndex++;
		to = url.lastIndexOf('/');
		to = to == -1 ? url.length : to + 1;
		Url = url.substring(0, to)  + element.options[element.selectedIndex].value;
		window.location.href = Url;
	}
	if (pon === "prev") {
		url = window.location.href;
		element = document.getElementById("selectEpisode");
		element.selectedIndex--;
		to = url.lastIndexOf('/');
		to = to == -1 ? url.length : to + 1;
		Url = url.substring(0, to)  + element.options[element.selectedIndex].value;
		window.location.href = Url;
	}
	if (pon != "prev" && pon != "next") {
		console.log("Varible taken in PrevOrNext is invalid");
	}
}

//->Recursive loop
function resume(){
	$(video).on('ended', function (event) {
		return;
	});
	$(video).on('paused', function (event) {
		return;
	});
	//if skipping hasn't been set exit this function
	if(skipFrom === "undefined" || skipFrom === "" || skipFrom === null || active === false)
	{
		return;
	}
	//if current video time matches stored skipping time trigger video ended event handler
	if(getTime(video.currentTime) == skipFrom && itr === false){
		itr = true;
		getNextInQue();
	}else{
	//recurse loop every second video playes
		setTimeout(resume, 1000);
	}

}
//->End loop

function timeToSeconds(time){
	var a = time.split(':'); // split it at the colons
	var seconds;
	
	if(a.length === 2){
		seconds = ((+a[0]) * 60 + (+a[1])); 
	}
	else{
		// minutes are worth 60 seconds. Hours are worth 60 minutes.
		seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
	}
	return seconds;
}

function getTime(totalSec){	//convert video play time(float) to timestamp
	var minutes = parseInt( totalSec / 60 ) % 60;
	var seconds = (totalSec % 60).toFixed(0);
	return((minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds));
}

//->DB
function getStorage(){	try{	//get the stored skip time from local storage if set
		if(typeof(Storage) !== "undefined") {
			skipFrom = localStorage.getItem(animeName+"_skipFrom");
			$("#skipFrom").val(skipFrom);
		}
	}catch(e)
	{
		console.log("Local storage not found");
	}
}


function setStorage(){	//user has clicked on button save credit skip time in local storage
	try{
		if(typeof(Storage) !== "undefined") {
			skipFrom = $("#skipFrom").val();
			//check for valid input
			if(skipFrom.match('^[0-5][0-9]:[0-5][0-9]$') || skipFrom.match('^[0-9]:[0-5][0-9]:[0-5][0-9]$')){
			//store entered time in local storage
				buttonFeedback();
				localStorage.setItem(animeName+"_skipFrom", skipFrom);
			}
			else{
				$("#skipFrom").val();
				$("#skipFrom").val('Invalid Number: format is h:mm:ss');
				_.delay(function() { $("#skipFrom").val(''); }, 3000);
			}
		}
	}catch(e)
	{
		console.log(e);
	}
}

//->DB
function getStartStorage(){	
	try{	//get the stored skip time from local storage if set
		if(typeof(Storage) !== "undefined") {
			skipFromStart = localStorage.getItem(animeName+"_skipFromStart");
			$("#skipFromStart").val(skipFromStart);
          
	        skipStart();
        }
	}catch(e)
	{
		console.log("Local storage not found");
	}
}

function removeStorage(){
	try{
		localStorage.removeItem(animeName+"_skipFrom");
		skipFrom = null;
		getStorage();
		$("#skipFrom").val("");
		buttonFeedback();
	}catch(e)
	{
		console.log("Local storage not found");
	}
}

function setStartStorage(){	//user has clicked on button save credit skip time in local storage
	try{
		if(typeof(Storage) !== "undefined") {
			skipFromStart = $("#skipFromStart").val();
			//check for valid input
			if(skipFromStart.match('^[0-5][0-9]:[0-5][0-9]$') || skipFromStart.match('^[0-9]:[0-5][0-9]:[0-5][0-9]$')){
			//store entered time in local storage
				buttonFeedback();
				localStorage.setItem(animeName+"_skipFromStart", skipFromStart);
			}
			else{
				$("#skipFromStart").val();
				$("#skipFromStart").val('Invalid Number: format is h:mm:ss');
				_.delay(function() { $("#skipFromStart").val(''); }, 3000);
			}
		}
	}catch(e)
	{
		console.log(e);
	}
}

function removeStartStorage(){
	try{
		localStorage.removeItem(animeName+"_skipFromStart");
		skipFromStart = null;
		getStorage();
		$("#skipFromStart").val("");
		buttonFeedback();
	}catch(e)
	{
		console.log("Local storage not found");
	}
}

function getResolution(){
	try{	//get the stored skip time from local storage if set
		if(typeof(Storage) !== "undefined") {
			var stor = localStorage.getItem(animeName+"_quality");
			var res = $('#divQuality option');
            $('#divQuality option:selected').removeAttr('selected');
            _.each(res, function(opt){
                if($(opt).text() === stor)
                $(opt).attr('selected', '');
            });
		}
	}catch(e)
	{
		console.log("Local storage not found");
	}
}

function setResolution(quality){	//user has clicked on button save credit skip time in local storage
	try{
		if(typeof(Storage) !== "undefined") {
			//check for valid input
			localStorage.setItem(animeName+"_quality", quality);
		}
	}catch(e)
	{
		Console.log(e);
	}
}
//->END DB

function createButton(){	//create a form for user to submit skip time
	daily_icon = {icon: dailyIcon()};
    $('.vjs-control-bar').append(templates.bar(daily_icon));

}

function createOverlay(){
	createButton();
	$("#selectPlayer").parent().hide();		//remove select player - flash not supported!
	$('.vjs-live-controls.vjs-control').append($('#btnNext').parent().clone()); //copy next button to video bar
	$(videoPlaceholder).prepend("<div class='overlay' id='overlay'></div>");
	$("body").append(templates.innerstyle());
	editMessage(templates.ol());
	hideMessage();
	getStorage();
	getStartStorage();
    getResolution();
}

function editMessage(message){
	var overlay= document.getElementById('overlay');
	overlay.style.visibility= 'visible';
	overlay.innerHTML = message;
}

function hideMessage(){
	var overlay= document.getElementById('overlay');
	overlay.style.visibility='hidden';
}

function dailyIcon(){
	switch (new Date().getDay()) {
	    case 1:
	    case 2:
	    	return "https://raw.githubusercontent.com/mattmarillac/kissanime-userscript/master/Userscript/bar_icon3.png";
	    case 3:
	    case 4:
	    case 5:
	        return "https://raw.githubusercontent.com/mattmarillac/kissanime-userscript/master/Userscript/bar_icon.png";
	    case 0:
	    case 6:
	        return "https://raw.githubusercontent.com/mattmarillac/kissanime-userscript/master/Userscript/bar_icon2.png";
	}
}
