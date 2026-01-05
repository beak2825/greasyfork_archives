// ==UserScript==
// @name         stream4chan
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  Turn those beastly 4chan threads in an easy to use, easy to watch stream of content, given to you in a gallery-like format. Batteries not included
// @author       Lauchlan105
// @match        http://boards.4chan.org/*/thread/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24147/stream4chan.user.js
// @updateURL https://update.greasyfork.org/scripts/24147/stream4chan.meta.js
// ==/UserScript==

//////////////////
// # Settings # //
//////////////////

//////////////////
// # Settings # //
//////////////////

/*

fix resizing (again)
remove (S) for shuffle
change settings font color
make video size change with gallery
prevent arrow from being pushed outside 

*/

var settingsArray = [
    
    //Loop whole thread
    true,

    //Play automatically
    true,

    //Shuffle on startup
    false,

    //Play Webms
    true,

    //Show Webm controls
    true,

    //Play webm sound
    true,

    //Play Gifs
    true,

    //Gif duration (Seconds)
    3,

    //Play Images
    true,

    //Image duration (Seconds)
    3,

    //Open Stream4chan on startup
    true,

    //Override Individual media?
    true,

    //Select Media randomly
    false
];

///////////////////
// # Variables # //
///////////////////

//Placeholder variables
var globalTimeout;
var webm;
var gif;
var png;
var jpg;
var SOT;
var EOT;
var noneSelected;
var allContent;
var usedContent;
var currentContent;

////////////////////////////
// # Media Object Model # //
////////////////////////////

class Media{
    constructor(thumb, source, id){

    	// local scope variable for object access via video/thumbnail elements
        var obj = this;

        this.position = 0;
        this.playcount = 0;
        this.prevMedia = noneSelected;
        this.nextMedia = noneSelected;

        this.id = id === undefined ? "" : id;

        this.thumb = document.createElement('img');
        this.thumb.src = thumb;
        this.thumb.setAttribute('class','sfc-slide-preview');

        this.type = mediaType(source);

        this.resizeTimeout = setTimeout(function(){}, 0);

        //Handles deleted files/invalid media
        if(this.type === undefined || this.type === null){

        	//Force null for simpler conditionals
        	this.type = null;

        	console.log('Media could not be made. One or more of the following are invalid...');
        	console.log('	Given Arguments:');
        	console.log('		thumb: ' + thumb);
        	console.log('		source: ' + source);
        	console.log('		id: ' + id);
        	console.log('');
        	console.log('	All functions will be assigned placeholders');

        	function placeHolderFunction(calledFunction){
                el_stage.innerHTML = calledFunction + ' cannot be called on comment with id ' + this.id;
        		console.log(calledFunction + ' cannot be called on object with id ' + this.id);
        		return;
    		}

			this.unhighlight = function(){ placeHolderFunction('unhiglight'); };
			this.highlight   = function(){ placeHolderFunction('highlight'); };
       	    this.deselect    = function(){ placeHolderFunction('deselect'); };
       	   	this.resize      = function(){ placeHolderFunction('resize'); };
       	    this.select      = function(){ placeHolderFunction('select'); };
			this.pause       = function(){ placeHolderFunction('pause'); };
     	    this.play        = function(){ placeHolderFunction('play'); };
			
        	return false;
        }

    	if(this.type === webm){
            this.media = document.createElement('video');

            this.media.setAttribute("id", "sfc-webm");

            this.media.setAttribute("controls","");

            this.media.setAttribute("loop","");
            this.media.loop = true;

            this.media.setAttribute("autoplay","");
            this.media.autoplay = false;

            this.media.setAttribute("preload","");
            this.media.preload = "none";

        }else if(this.type === png || this.type === gif || this.type === jpg){
            this.media = document.createElement('img');
            this.media.setAttribute("id","sfc-img");
            this.media.alt = source;
        }

    	this.media.setAttribute("class", "sfc-media");
    	this.media.src = source;


        ///////////////////
        //MEDIA FUNCTIONS//
        ///////////////////
    	this.play = function(){

        	if(obj !== SOT && obj !== EOT && obj !== noneSelected){
        		if(obj.type == webm){
	                obj.media.volume = op_playSound.checked ? obj.media.volume : 0;
	                obj.media.play();
	            }else if(obj.type == gif || obj.type == jpg || obj.type == png){
                    obj.media.src = obj.media.alt;
                    updateAutoplay();
                }

        	}
        };

        this.pause = function(){

            clearTimeout(globalTimeout);
            if(obj.type == webm){
                obj.media.pause();
            }else if(obj.type == gif || obj.type == jpg || obj.type == png){
                obj.media.src = obj.thumb.src;
            }
        };

        ///////////////////////
        //THUMBNAIL FUNCTIONS//
        ///////////////////////

        var highlight = function(){

            obj.thumb.style.border = "2px solid gainsboro";

            /*

			//Scroll into view
	        var pc = document.getElementById('pc' + id.substr(id.lastIndexOf('p') + 1));
  	 		pc.scrollIntoView();

			//Set container style to mimic focused content 
  			pc.style.background = '#f0e0d6';
    		pc.style.border = '1px solid #D99F91!important';

    		*/
        };

        var unhighlight = function(){

            obj.thumb.style.border = "2px solid transparent";

			/*

			//Remove focused content styles           
 			var pc = document.getElementById('pc' + id.substr(id.lastIndexOf('p') + 1));
  			pc.style.background = '#F0C0B0!important';
    		pc.style.border = '1px solid #D9BFB7';

    		*/
        };

        ///////////////////////////
        //MISCELLANEOUS FUNCTIONS//
        ///////////////////////////

        this.select = function(){

        	obj.playcount++;

            //Deselect active content
            if(currentContent !== null){
                currentContent.deselect();
            }

            //Set currentContent to this object
            currentContent = obj;

            //Highlight thumbnail border
            highlight();

            //Add media to stage
            obj.media.controls = op_controls.checked;
            el_stage.appendChild(obj.media);

            //Play Media
            obj.play();

            //resize media
            obj.resize();

            //Update auto playing
            updateAutoplay();

            //Moves gallery so selected object is centered
            obj.slideGallery();
            
            //Update counter in top right
            updateCounter();

            //Assign and load neighbouring media
            obj.getNeighbours();

            if(obj.prevMedia.type === webm){
                obj.prevMedia.media.load();
            }else if(obj.nextMedia.type === webm){
                obj.nextMedia.media.load();
            }
        };

        this.deselect = function(){
            obj.pause();
            obj.media.currentTime = 0;
            unhighlight();
            el_stage.innerHTML = "";
            currentContent = null;

            //Reset prev and next media
            obj.prevMedia = noneSelected;
            obj.nextMedia = noneSelected;
        };

        this.thumb.onclick = function(){
        	if(obj.thumb.style.border == "2px solid gainsboro"){
        		obj.deselect();
        	}else{
        		obj.select();
        	}
        };

        this.resize = function(){

            clearTimeout(obj.resizeTimeout);

        	//Recursive resize function
        	//repeats every {interval} seconds
        	//if interval is undefined or < 0.01, default to 0.01
        	function execResize(interval){

        		//if interval is below 0.01, set to minimum 0.01
        		if(interval){
        			if(interval < 0.05)
        				interval = 0.05;
        		}

                if(isShown(el_sfc)){
                    if(obj === currentContent){
                        var setByWidth = true;

                        console.log('resizing');

                        //Set to max width
                        obj.media.style.width = window.innerWidth - (el_stagePrev.clientWidth + el_stageNext.clientWidth) + 'px';
                        obj.media.style.height = 'auto';

                        //if media height exceeds the stage height
                        if(obj.media.clientHeight > el_stage.clientHeight){
                            //Set to max height instead
                            obj.media.style.height = el_stage.clientHeight + 'px';
                            obj.media.style.width = 'auto';
                            setByWidth = false;
                        }

                        if(setByWidth){
                            // if full width, set height padding
                            obj.media.style.marginLeft = '0px';
                            var difHeight = (el_stage.clientHeight - obj.media.clientHeight)/2;
                            var topMarg = (difHeight) - ( difHeight%1 ); //Minus any decimals
                            obj.media.style.marginTop = topMarg  + 'px';
                        }else{
                            // if full height, set width padding
                            obj.media.style.marginTop = '0px';
                            var difWidth = (el_stage.clientWidth - obj.media.clientWidth)/2;
                            var leftMarg = (difWidth) - ( difWidth%1 ); //Minus any decimals
                            obj.media.style.marginLeft = leftMarg  + 'px';
                        }

                        if(interval){
                            obj.resizeTimeout = setTimeout(function(){
                                execResize(interval);
                            }, interval*1000);
                        }else{
                            return;
                        }
                    }else{
                        clearTimeout(obj.resizeTimeout);
                    }  
                }else{
                    clearTimeout(obj.resizeTimeout);
                }
        		
        		return;
        	}

        	//Continue resizing every 1 second till video ends
        	execResize(0.2);

        };

        this.slideGallery = function(){

            //resets slider transform
            el_internalSlider.style.transform = '';

            //distance from the left of the browser to the middle of the thumbnail
            var middleOfThumb = getPageTopLeft(obj.thumb).left + (obj.thumb.clientWidth*1.5);

            //The distance between left side of browser and vertical middle of browser
            var middleOfWindow = window.innerWidth/2;

            //Displacement from middle
            var displacement = middleOfWindow - middleOfThumb;

            //Include the current position of the internal slider
            var crntSliderValue = getPageTopLeft(el_internalSlider).left;
            displacement += crntSliderValue;

            //Apply change
            el_internalSlider.style.transform = 'translateX( ' + displacement + 'px)';

        }

        this.previous = function(){
            obj.prevMedia.select();
        }

        this.next = function(){
            obj.nextMedia.select();
        }

        this.getNeighbours = function(){
            if(!canPlay(obj)){
                //If the current object isn't in usedContent -> prev = last in used content, next = first in used content
                obj.prevMedia = usedContent[usedContent.length - 1].select();
                obj.nextMedia = usedContent[0].select();
            }else if(op_random.checked){
                obj.prevMedia = getRandom();
                obj.nextMedia = getRandom(obj.prevMedia);
            }else if(op_loopAll.checked){
                obj.prevMedia = obj.position === 0 ? usedContent[usedContent.length - 1] : usedContent[obj.position - 1];
                obj.nextMedia = obj.position === usedContent.length - 1 ? usedContent[0] : usedContent[obj.position + 1];
            }else if(!op_loopAll.checked){
                obj.prevMedia = obj.position === 0 ? obj : usedContent[obj.position - 1];
                obj.nextMedia = obj.position === usedContent.length - 1 ? obj : usedContent[obj.position + 1];
            }
        }

        this.media.getObj = function(){ return obj; };
        this.thumb.getObj = function(){ return obj; };

        return true;
    }
}

//////////////
// # Main # //
//////////////

(function(){

    //Removes default padding
    document.body.style.padding = "0px";

    insertElements();
    initVars();
    initPlaceholders();
    startInteractions();
    startEventListeners();
    
    var validSettings = applyDefaulSettings();
    if( !validSettings.valid ){
        console.log(validSettings.valid);
        for(var i = 0; i < validSettings.messages.length; i++){
        	console.log(validSettings.messages[i]);
            el_stage.innerHTML = '<h1>' + validSettings.messages[i] + '</h1>';    
        }
        return;
    }

    //Show and hide gallery to force load thumbnails
    //without this .select() does not work until gallery is shown
    showGallery(true);
    showGallery(false);

    magicMouse(false);
    sfc.style.display = "none"; //Force hide SFC
    showSFC(false);             //Force styles to be ready for fade in 

    //If shuffled on start up  -> shuffle
    if(settingsArray[2]){
    	shuffle(true);
    }

    //If open on startup is selected -> open on startup
    if(settingsArray[10]){
        showSFC(true);
        usedContent[0].select();
    }
})();

/////////////////////////////////
// # Initial Setup Functions # //
/////////////////////////////////

//Insert html for buttons and modal
function insertElements(){

    //Start Button
    var btn1 = '[<a id="sfc-start" href="#">start</a>]';
    var btn2 = '[<a id="sfc-resume" href="#">resume</a>]';

    //Add span to nav
    var nav = document.getElementsByClassName('navLinks desktop');
    for(var i = 0; i < nav.length; i++){
        var span = document.createElement('span');
        span.innerHTML = btn1 + " " + btn2;

        span.className = 'sfc-nav';
        span.style.display = nav[i].style.display;

        nav[i].parentNode.insertBefore(span, nav[i]);
        nav[i].parentNode.insertBefore(document.getElementById('op'), nav[i]);
    }

    var html = '<!-- SETTINGS --> <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet"> <div id="sfc-settings-column"> <div id="sfc-settings-row"> <div id="sfc-settings-panel"> Settings <div id="sfc-settings-exit"></div> <!-- GENERAL SETTINGS --> <div> <p class="sfc-settings-title"> General </p> <div id="sfc-option"> <input id="stream4chan-loopAll" class="SFC-input" type="checkbox"> Loop whole thread (L) </div> <div id="sfc-option"> <input id="stream4chan-auto" class="SFC-input" type="checkbox"> Play Automatically (A) </div> <div id="sfc-option"> <input id="stream4chan-random" class="SFC-input" type="checkbox"> Random (R) </div> <div id="sfc-option"> <input id="stream4chan-shuffle" class="SFC-input" type="button" value=" Shuffle "> (S) </div> </div> <!-- WEBM SETTINGS --> <div> <p class="sfc-settings-title"> Webm </p> <div id="sfc-option"> <input id="stream4chan-webms" class="SFC-input" type="checkbox"> Play Webms (W) </div> <div id="sfc-option"> <input id="stream4chan-controls" class="SFC-input" type="checkbox"> Show Controls (C) </div> <div id="sfc-option"> <input id="stream4chan-playSound" class="SFC-input" type="checkbox"> Play sound (S) </div> </div> <!-- GIF SETTINGS --> <div> <p class="sfc-settings-title"> Gif </p> <div id="sfc-option"> <input id="stream4chan-gifs" class="SFC-input" type="checkbox"> Play Gifs (G) </div> <div id="sfc-option"> <input id="stream4chan-gif-duration" class="SFC-input" type="number" min="1" max="60" value="3" step="1"> Gif Duration (up/down) </div> </div> <!-- IMG SETTINGS --> <div> <p class="sfc-settings-title"> Images </p> <div id="sfc-option"> <input id="stream4chan-imgs" class="SFC-input" type="checkbox"> Play Images (I) </div> <div id="sfc-option"> <input id="stream4chan-img-duration" class="SFC-input" type="number" min="1" max="60" value="3" step="1"> Image Duration (Shift + up/down) </div> </div> </div> </div> </div> <!-- Main --> <div id="sfc-main"> <div id="sfc-main-prev" class="sfc-util prev"></div> <div id="sfc-stage"> </div> <div id="sfc-utility"> <div id="sfc-main-settings" class="sfc-util settings"></div> <div id="sfc-main-gallery" class="sfc-util gallery"></div> </div> <div id="sfc-counter"> <p id="sfc-counter-first">1</p> / <p id="sfc-counter-second">2</p> </div> <div id="sfc-main-next" class="sfc-util next"></div> </div> <!-- Gallery Slider --> <div id="sfc-gallery"> <div id="sfc-gallery-prev" class="sfc-util prev"></div> <div id="sfc-slider"> <div id="sfc-slider-internal"> </div> </div> <div id="sfc-gallery-next" class="sfc-util next"></div> </div> <!-- Hidden Cursor Overlay --> <span id="sfc-magicMouse"> </span>';
    // var html = '<!-- SETTINGS --> <div id="sfc-settings-column"><div id="sfc-settings-row"> <div id="sfc-settings-panel"> Settings <div id="sfc-settings-exit"></div> <!-- GENERAL SETTINGS --> <div> <p class="sfc-settings-title"> General </p> <div id="sfc-option"> <input id="stream4chan-loopAll" class="SFC-input" type="checkbox"> Loop whole thread (L) </div> <div id="sfc-option"> <input id="stream4chan-auto" class="SFC-input" type="checkbox"> Play Automatically (A) </div> <div id="sfc-option"> <input id="stream4chan-random" class="SFC-input" type="checkbox"> Random (R) </div> <div id="sfc-option"> <input id="stream4chan-shuffle" class="SFC-input" type="button" value=" Shuffle "> (S) </div> </div> <!-- WEBM SETTINGS --> <div> <p class="sfc-settings-title"> Webm </p> <div id="sfc-option"> <input id="stream4chan-webms" class="SFC-input" type="checkbox"> Play Webms (W) </div> <div id="sfc-option"> <input id="stream4chan-controls" class="SFC-input" type="checkbox"> Show Controls (C) </div> <div id="sfc-option"> <input id="stream4chan-playSound" class="SFC-input" type="checkbox"> Play sound (S) </div> </div> <!-- GIF SETTINGS --> <div> <p class="sfc-settings-title"> Gif </p> <div id="sfc-option"> <input id="stream4chan-gifs" class="SFC-input" type="checkbox"> Play Gifs (G) </div> <div id="sfc-option"> <input id="stream4chan-gif-duration" class="SFC-input" type="number" min="1" max="60" value="3" step="1"> Gif Duration (up/down) </div> </div> <!-- IMG SETTINGS --> <div> <p class="sfc-settings-title"> Images </p> <div id="sfc-option"> <input id="stream4chan-imgs" class="SFC-input" type="checkbox"> Play Images (I) </div> <div id="sfc-option"> <input id="stream4chan-img-duration" class="SFC-input" type="number" min="1" max="60" value="3" step="1"> Image Duration (Shift + up/down) </div> </div> </div> </div> </div> <!-- Main --> <div id="sfc-main"> <div id="sfc-main-prev" class="sfc-util prev"></div> <div id="sfc-stage"> </div> <div id="sfc-utility"> <div id="sfc-main-settings" class="sfc-util settings"></div> <div id="sfc-main-gallery" class="sfc-util gallery"></div> </div> <div id="sfc-main-next" class="sfc-util next"></div> </div> <!-- Gallery Slider --> <div id="sfc-gallery"> <div id="sfc-gallery-prev" class="sfc-util prev"></div> <div id="sfc-slider"> <div id="sfc-slider-internal"> </div> </div> <div id="sfc-gallery-next" class="sfc-util next"></div> </div>';
    // var css = '<!-- CSS --> <style> body, div, img, a, span, html, p{ margin: 0px; border: 0px; padding: 0px; } .sfc-nav{ height: auto; width: auto; } #sfc{ opacity: 1; -moz-transition: opacity 0.50s ease-in-out; -webkit-transition: opacity 0.50s ease-in-out; -o-transition: opacity 0.50s ease-in-out; -ms-transition: opacity 0.50s ease-in-out; transition: opacity 0.50s ease-in-out; } #sfc-main { width: 100%; height: 100%; z-index: 500; position: fixed; top: 0; display: flex; flex-flow: row; background-color: rgba(0,0,0,0.9 ); -webkit-box-shadow: inset 0px 0px 300px 28px rgba(0,0,0,1); -moz-box-shadow: inset 0px 0px 300px 28px rgba(0,0,0,1); box-shadow: inset 0px 0px 300px 28px rgba(0,0,0,1); } #sfc-gallery{ width: 100%; height: auto; z-index: 1000; position: fixed; bottom: 0; display: flex; flex-flow: row; background-color: rgba(0,0,0,0.35); transform: translateY(100%); -webkit-transition: transform 0.4s ease-in-out 0.05s; transition: transform 0.4s ease-in-out 0.05s; } #sfc-settings-column{ height: 100vh; z-index: 1500; top: 0; display: none; flex-flow: column; position: fixed; background-color: rgba(0,0,0,0.7); font-family: "PT Sans", sans-serif; font-size: 16pt; } #sfc-settings-row{ width: 100vw; display: flex; flex-flow: row; flex: 1 1 auto; } #sfc-settings-panel{ margin: auto; padding: 20px; flex: 0 1 auto; background-color: rgba(255,255,255,0.8); } .sfc-settings-title{ margin-top: 7%; text-decoration: underline; } #sfc-settings-exit { width: 20px; height: 20px; opacity: 0.3; float: right; background-image: url("http://www.myiconfinder.com/uploads/iconsets/4c515d45f6a8c4fe16e448a692a9370d.png"); background-size: contain; -webkit-transition: opacity 0.2s linear 0.05s, visibility 0s; transition: opacity 0.2s linear 0.05s, visibility 0s; } #sfc-settings-exit:hover{ opacity: 1; } #sfc-stage, #sfc-slider{ flex: 1 1 auto; margin: 5px; } #sfc-slider-internal{ width: 0px; } #sfc-utility{ position: fixed; bottom: 0; -webkit-transition: transform 0.4s ease-in-out 0.05s; transition: transform 0.4s ease-in-out 0.05s; } .sfc-util{ opacity: 0.1; width: 3vw; height: 3vw; background-color: rgba(255,255,255,0.6); background-clip: content-box; border-radius: 50%; background-size: 1.5vw; background-repeat: no-repeat; background-position:center; margin: auto; padding: 5px; -webkit-transition: opacity 0.2s linear 0.05s, visibility 0s; transition: opacity 0.2s linear 0.05s, visibility 0s; } .sfc-util:hover{ opacity: 1; } .gallery, .settings{ background-size: 2.2vw; } .gallery{ background-image: url("https://maxcdn.icons8.com/Android_L/PNG/24/Photo_Video/gallery-24.png"); } .settings{ background-image: url("https://maxcdn.icons8.com/Android_L/PNG/24/Very_Basic/settings-24.png"); } .prev, .next { flex: 0 0 3vw; background-image: url("http://www.dsetechnology.co.uk/images/disclose-arrow.png"); } .prev{ transform: rotate(180deg); } .sfc-slide-preview{ height: 6vh; width: auto; border: 2px solid transparent; -webkit-transition: border 0.2s linear 0.05s, visibility 0s; transition: border 0.2s linear 0.05s, visibility 0s; } .sfc-slide-preview:hover { border: 2px solid white; } </style> ';
    var css = '<style> <!-- CSS --> <style> body, div, img, a, span, html, p{ margin: 0px; border: 0px; padding: 0px; } #sfc-magicMouse { z-index: 1000; position: fixed; top: 0px; height: 100vh; width: 100vw; cursor: none; } #sfc-counter { min-height: ; position: fixed; top: 0px; right: 0px; color: rgba(255,255,255,0.3); font-family: \'Montserrat\', sans-serif; } #sfc-counter p { display: inline; } .sfc-nav{ height: auto; width: auto; } #sfc{ opacity: 1; -moz-transition: opacity 0.50s ease-in-out; -webkit-transition: opacity 0.50s ease-in-out; -o-transition: opacity 0.50s ease-in-out; -ms-transition: opacity 0.50s ease-in-out; transition: opacity 0.50s ease-in-out; } #sfc-main { width: 100%; height: 100%; z-index: 500; position: fixed; top: 0; display: flex; flex-flow: row; background-color: rgba(0,0,0,0.9 ); -webkit-box-shadow: inset 0px 0px 300px 28px rgba(0,0,0,1); -moz-box-shadow: inset 0px 0px 300px 28px rgba(0,0,0,1); box-shadow: inset 0px 0px 300px 28px rgba(0,0,0,1); } #sfc-gallery{ width: 100%; height: auto; z-index: 1000; position: fixed; bottom: 0; display: flex; flex-flow: row; background-color:rgba(0,0,0,0.35); transform: translateY(100%); -webkit-transition: transform 0.4s ease-in-out 0.05s; transition: transform 0.4s ease-in-out 0.05s; } #sfc-settings-column{ height: 100vh; z-index: 1500; top: 0; display: none; flex-flow: column; position: fixed; background-color: rgba(0,0,0,0.7); font-family: "PT Sans", sans-serif; font-size: 16pt; } #sfc-settings-row{ width: 100vw; display: flex; flex-flow: row; flex: 1 1 auto; } #sfc-settings-panel{ margin: auto; padding: 20px; flex: 0 1 auto; background-color: rgba(255,255,255,0.8); } .sfc-settings-title{ margin-top: 7%; text-decoration: underline; } #sfc-settings-exit { width: 20px; height: 20px; opacity: 0.3; float: right; background-image: url("http://www.myiconfinder.com/uploads/iconsets/4c515d45f6a8c4fe16e448a692a9370d.png"); background-size: contain; -webkit-transition: opacity 0.2s linear 0.05s, visibility 0s; transition: opacity 0.2s linear 0.05s, visibility 0s; } #sfc-settings-exit:hover{ opacity: 1; } #sfc-stage, #sfc-slider{ flex: 1 1 auto; margin: 5px; } #sfc-slider-internal{ width: 0px; -webkit-transition: transform 0.4s ease-in-out 0.05s; transition: transform 0.4s ease-in-out 0.05s; } #sfc-utility{ position: fixed; bottom: 0; -webkit-transition: transform 0.4s ease-in-out 0.05s; transition: transform 0.4s ease-in-out 0.05s; } .sfc-util{ opacity: 0.1; width: 3vw; height: 3vw; background-color: rgba(255,255,255,0.6); background-clip: content-box; border-radius: 50%; background-size: 1.5vw; background-repeat: no-repeat; background-position:center; margin: auto; padding: 5px; -webkit-transition: opacity 0.2s linear 0.05s, visibility 0s; transition: opacity 0.2s linear 0.05s, visibility 0s; } .sfc-util:hover{ opacity: 1; } .gallery, .settings{ background-size: 2.2vw; } .gallery{ background-image: url("https://maxcdn.icons8.com/Android_L/PNG/24/Photo_Video/gallery-24.png"); } .settings{ background-image: url("https://maxcdn.icons8.com/Android_L/PNG/24/Very_Basic/settings-24.png"); } .prev, .next { flex: 0 0 3vw; background-image: url("http://www.dsetechnology.co.uk/images/disclose-arrow.png"); } .prev{ transform: rotate(180deg); } .sfc-slide-preview{ height: 6vh; width: auto; border: 2px solid transparent; -webkit-transition: border 0.2s linear 0.05s, visibility 0s; transition: border 0.2s linear 0.05s, visibility 0s; } .sfc-slide-preview:hover { border: 2px solid white; } </style>';

    var sfc = document.createElement('div');
    sfc.setAttribute('id','sfc');
    sfc.innerHTML = html + css;

    var target = document.getElementsByClassName('thread');
    for(i = 0; i < target.length; i++){
        target[i].prepend(sfc);
    }
}

//Create and initialize global variables for easy access to HTML elements
function initVars(){

    //Custom function to find elements while 
        //alerting console of errors in case of null || undefined
    function getEl(elName){
        var temp = document.getElementById(elName);
        if(temp === null || temp === undefined){
            temp = document.getElementsByClassName(elName)[0];
            if(temp === null || temp === undefined){
                console.log('### ERROR ###');
                console.log('initVars: getEl(\'' + elName +'\') returned... ');
                console.log(temp);
            }
        }
        return temp;
    }

    //Main Page
    el_startBtn = getEl('sfc-start');
    el_resumeBtn = getEl('sfc-resume');

    //Modal
    el_sfc = getEl('sfc');
    el_magicMouse = getEl('sfc-magicMouse');

    //Stage Area
    el_stage = getEl('sfc-stage');
    el_stagePrev = getEl('sfc-main-prev');
    el_stageNext = getEl('sfc-main-next');

    //Utility buttons
    el_util = getEl("sfc-utility");
    el_galleryBtn = getEl("sfc-main-gallery");
    el_settingsBtn = getEl("sfc-main-settings");
    el_counter_first = getEl("sfc-counter-first");
    el_counter_second = getEl("sfc-counter-second");

    //Gallery Area
    el_gallery = getEl("sfc-gallery");
    el_slider = getEl('sfc-slider');
    el_internalSlider = getEl('sfc-slider-internal');
    el_internalSlider.style.transform = "translateX(0px)";
    el_sliderPrev = getEl('sfc-gallery-prev');
    el_sliderNext = getEl('sfc-gallery-next');

    //Settings and option area
    el_settings = getEl("sfc-settings-column");
    el_settingsExit = getEl("sfc-settings-exit");
    op_loopAll = getEl('stream4chan-loopAll');
    op_auto = getEl('stream4chan-auto');
    op_random = getEl('stream4chan-random');
    op_shuffle = getEl('stream4chan-shuffle');

    op_webms = getEl('stream4chan-webms');
    op_controls = getEl('stream4chan-controls');
    op_playSound = getEl('stream4chan-playSound');

    op_gifs = getEl('stream4chan-gifs');
    op_gif_duration = getEl('stream4chan-gif-duration');

    op_imgs = getEl('stream4chan-imgs');
    op_img_duration = getEl('stream4chan-img-duration');
}

//Inititialize values to placeholder variables
function initPlaceholders(){
    //Type placeholders. Less quotations in code
    webm = 'webm';
    gif = 'gif';
    png = 'png';
    jpg ='jpg';

    //Start of thread
    //Object based placeholder for the beginning of the thread (used when loopAll is unchecked)
    SOT = new Media("https://dummyimage.com/1920x1080/000000/ffffff.png","https://dummyimage.com/1920x1080/000000/ffffff.png");
    SOT.media.src = "https://dummyimage.com/1920x1080/000000/ffffff.png&text=Start+of+thread"; 
    SOT.thumb.src = "https://dummyimage.com/480x270/000000/ffffff.png&text=Start+of+thread";
    SOT.type = "SOT";

    //End of thread
    //Object based placeholder for the end of the thread (used when loopAll is unchecked)
    EOT = new Media("https://dummyimage.com/1920x1080/000000/ffffff.png","https://dummyimage.com/1920x1080/000000/ffffff.png");
    EOT.media.src = "https://dummyimage.com/1920x1080/000000/ffffff.png&text=End+of+thread";
    EOT.thumb.src = "https://dummyimage.com/480x270/000000/ffffff.png&text=End+of+thread";
    EOT.type = "EOT";

    //Object based placeholder for when there is no applicable media found or nothing is selected
    noneSelected = new Media("https://dummyimage.com/1920x1080/000000/ffffff.png","https://dummyimage.com/1920x1080/000000/ffffff.png");
    noneSelected.media.src = "https://dummyimage.com/1920x1080/000000/ffffff.png&text=No+Media+Selected";
    noneSelected.thumb.src = "https://dummyimage.com/480x270/000000/ffffff.png&text=No+Media+Selected";

    allContent = getContent();
    usedContent = getUsedContent();
    currentContent = noneSelected;
}

//Links keyboard controls with functions and updates sfc accordinglys
function startEventListeners(){

    window.onresize = function(){
        // updateGallery();
        currentContent.resize();
        currentContent.slideGallery();
    }

    op_loopAll.onchange = updateGallery;
    
    op_controls.onchange = function(){
        if(currentContent.type == webm){
            currentContent.media.controls = op_controls.checked;
        }
    };

    op_playSound.onchange = function(){
        if(currentContent.type == webm){
            currentContent.media.volume = op_playSound.checked ? 1 : 0;
        }
    };

    op_webms.onchange = updateGallery;
    op_gifs.onchange = updateGallery;
    op_imgs.onchange = updateGallery;
    op_auto.onchange = updateAutoplay;
    op_shuffle.onclick = shuffle;

    el_stagePrev.onclick = previous;
    el_stageNext.onclick = next;

    document.onkeydown = function(event){
        switch(event.keyCode){

            //Space Key
            case 32:
                if(currentContent !== null){
                    //if paused
                    if(currentContent.type == webm){
                        if(currentContent.media.paused){
                            currentContent.play();
                        }else{
                            currentContent.pause();
                        }
                    }else{
                        if(currentContent.media.src == currentContent.thumb.src){
                            currentContent.play();
                        }else{
                            currentContent.pause();
                        }
                    }
                }
                break;

            //Enter Key
            case 13:
                if(event.ctrlKey)
                    return;

                if(!isShown(el_sfc)){

                    if(event.altKey){
                        el_resumeBtn.onclick();                        
                    }else{
                        el_startBtn.onclick();
                    }

                }
                break;    

            //Esc Key
            case 27:
                if(isShown(el_settings)){
                    showSettings(false);
                }else if(isShown(el_gallery)){
                    showGallery(false);
                }else if(isShown(el_sfc)){
                    showSFC(false);
                }
                break;

            //Left arrow Key
            case 37:
                if(!event.altKey)
                    previous();
                break;

            //Right arrow Key
            case 39:
                if(!event.altKey)
                    next();
                break;

            //Up arrow Key
            case 38:
                if(event.shiftKey){
                    op_img_duration.value++;
                }else{
                    op_gif_duration.value++;
                }
                break;

            //Down arrow Key
            case 40:
                if(event.shiftKey){
                    op_img_duration.value--;
                }else{
                    op_gif_duration.value--;
                }
                break;

            //L Key
            case 76:
                op_loopAll.checked = !op_loopAll.checked;
                op_loopAll.onchange();
                break;

             //A Key
            case 65:
                op_auto.checked = !op_auto.checked;
                op_auto.onchange();
                break;

            //R Key
            case 82:
                if(!event.ctrlKey)
                    op_random.checked = !op_random.checked;
                break;

            //Q Key
            case 81:
                break;

            //S Key
            case 83:
                op_playSound.checked = !op_playSound.checked;
                op_playSound.onchange();
                break;

            //W Key
            case 87:
                op_webms.checked = !op_webms.checked;
                op_webms.onchange();
                break;

            //C Key
            case 67:
                op_controls.checked = !op_controls.checked;
                op_controls.onchange();
                break;

            //G Key
            case 71:
                op_gifs.checked = !op_gifs.checked;
                op_gifs.onchange();
                break;

            //I Key
            case 73:
                op_imgs.checked = !op_imgs.checked;
                op_imgs.onchange();
                break;

             //Backspace
             case 8:
                settingsArray[11] = !settingsArray[11];
                break;

            //Print what was typed into console
            default:
                var temp = "";
                
                if(event.shiftKey){
                    temp += "Shift + ";
                }

                if(event.altKey){
                    temp += "Alt + ";
                }

                if(event.ctrlKey){
                    temp += "Ctrl + ";
                }

                temp += event.keyCode;

                console.log(temp);
        }
    }

    el_gallery.onwheel = function(event){

        //This number, when used with 
        // if(event.wheelDelta > 0 ){
                        
        // }else{
        //     console.log('scrolling down');
        //     el_internalSlider.style.transform = 'translateX(' + (getPageTopLeft(el_internalSlider).left) + 'px)';    
        // }
        
    }

    el_stage.onclick = function(e) {
        if (e.target === this){
            currentContent.pause();
            showSFC(false);
            return;
        }
    };
}

//////////////////////////////////////////////
// # SFC Control  and Animation Functions # //
//////////////////////////////////////////////

//Links functions with page controllers
//eg: making gallery button show/hide gallery
function startInteractions(){

    //Apply functionality: click start to show modal and play first media item
    el_startBtn.onclick = function(){
        showSFC(true);
        if(op_auto.checked){
            usedContent[0].select();
        }
    };

    el_resumeBtn.onclick = function(){
        showSFC(true);
        currentContent.resize();
        currentContent.play();
        updateAutoplay();
    };

    //Apply functionality: click gallery button to show/hide gallery
    el_gallery.style.transform = "translateY(100%)";
    el_galleryBtn.onclick = showGallery;

    //Apply functionality: click settings button to show settings
        //Click exit button to exit settings
    el_settingsBtn.onclick = function(){ showSettings(true); };
    el_settingsExit.onclick = function(){ showSettings(false); };
}

//Applies default settings
//  • Default settings are on line 5
function applyDefaulSettings(){

    var messages = Array();

    //Loop whole thread
    if(settingsArray[0] !== true && settingsArray[0] !== false){
        messages.push("Loop whole thread");
    }else{
        op_loopAll.checked = settingsArray[0];
    }

    //Play automatically
    if(settingsArray[1] !== true && settingsArray[1] !== false){
        messages.push("Play automatically");
    }else{
        op_auto.checked = settingsArray[1];       
    }

    //Shuffle on startup
    if(settingsArray[2] !== true && settingsArray[2] !== false){
        messages.push("Shuffle on startup");
    }else{
        op_shuffle.value = settingsArray[2] ? "Unshuffle" : "Shuffle";
    }

    //Play Webms
    if(settingsArray[3] !== true && settingsArray[3] !== false){
        messages.push("Play Webms");
    }else{
        op_webms.checked = settingsArray[3];       
    }

    //Show Webm controls
    if(settingsArray[4] !== true && settingsArray[4] !== false){
        messages.push("Show Webm controls");
    }else{
        op_controls.checked = settingsArray[4];      
    }

    //Play webm sound
    if(settingsArray[5] !== true && settingsArray[5] !== false){
        messages.push("Play webm sound");
    }else{
        op_playSound.checked = settingsArray[5];       
    }

    //Play Gifs
    if(settingsArray[6] !== true && settingsArray[6] !== false){
        messages.push("Play Gifs");
    }else{
        op_gifs.checked = settingsArray[6];
    }

    //Gif duration (Seconds)
    if( isNaN(settingsArray[7]) ){
        messages.push("Gif duration (Seconds)");
    }else{
        op_gif_duration.value = settingsArray[7];
    }

    //Play Images
    if(settingsArray[8] !== true && settingsArray[8] !== false){
        messages.push("Play Images");
    }else{
        op_imgs.checked = settingsArray[8];
    }

    //Image duration (Seconds)
    if( isNaN(settingsArray[9]) ){
        messages.push("Image duration (Seconds)");
    }else{
        op_img_duration.value = settingsArray[9];
    }
    
    //Open Stream4chan on startup
    if(settingsArray[10] !== true && settingsArray[10] !== false){
        messages.push("Open Stream4chan on startup");
    }

    //Override Individual Media
    if(settingsArray[11] !== true && settingsArray[11] !== false){
    	messages.push("Override Individual Media");
    }

    //Select Media randomly
    if(settingsArray[12] !== true && settingsArray[12] !== false){
    	messages.push("Select Media Randomly");
    }else{
    	op_random.checked = settingsArray[12];
    }
    
    return {
        valid: (messages.length <= 0),
        messages: messages
    };
}

//Toggles showing the modal
function showSFC(bool){

    function show(){
        document.body.style.overflow = "hidden";
        el_sfc.style.display = "block";
        setTimeout(function(){
            el_sfc.style.opacity = 1;
            magicMouse(true);
        }, 40);
        return true;
    }

    function hide(){
        showGallery(false);
        showSettings(false);
        currentContent.pause();
        el_sfc.style.opacity = 0;
        el_sfc.addEventListener("transitionend", function() {
            if(el_sfc.style.opacity == 0){
                el_sfc.style.display = "none";
                el_sfc.removeEventListener("transitionend", function(){}, false);
                document.body.style.overflow = "auto";
                showMouse(false);
            }
        }, false);

        return true;
    }

    if(bool === true){
        show();
    }else if (bool === false){
        hide();
    }else if (isShown(el_sfc)){
        show();
    }else{
        hide();
    }

    return false;
}

//Toggles showing the gallery
function showGallery(bool){
    

    function show(){

        //Sets internal gallery slider to appropriate width
        //'if' statements causes this to only fire once
        updateGallery();

        el_gallery.style.transform = "translateY(0px)";
        el_util.style.transform = "translateY(-" + el_gallery.clientHeight + "px)";

        return true;
    }

    function hide(){
        el_gallery.style.transform = "translateY(100%)";
        el_util.style.transform = "translateY(0)";
        return true;
    }

    if(bool === true){
        show();
    }else if(bool === false){
        hide();
    }else if(el_gallery.style.transform == "translateY(100%)"){
        show();
    }else{
        hide();
    }

    return false;
}

//Toggles showing the settings
function showSettings(bool){

    function show(){
        el_settings.style.display = "flex";
        return true;
    }

    function hide(){
        el_settings.style.display = "none";
        return true;
    }

    if(bool === true){
        show();
    }else if(bool === false){
        hide();
    }else if(el_settings.style.display == "none" || el_settings.style.display === ""){
        show();
    }else{
        hide();
    }

    return false;
}

//Parse through el_sfc, el_settings or el_gallery
//Return boolean indicating it's state
function isShown(el){
    if(el === el_sfc){
        return !(el_sfc.style.display == "none");
    }

    if(el === el_settings){
        return !(el_settings.style.display == "none" || el_settings.style.display === "");
    }

    if(el === el_gallery){
        return !(el_gallery.style.transform == "translateY(100%)");
    }
}

/////////////////////////////////////////
// # Media and Media Array Functions # //
/////////////////////////////////////////

function previous(){

    currentContent.previous();
}

function next(){

    currentContent.next();
}

//Updates usedContent array, populates gallery and re-adjusts width
function updateGallery(contentToUse){

    //Update contents of usedContent array
    var validParams = contentToUse !== null && contentToUse !== undefined;
    usedContent = validParams ? contentToUse : getUsedContent();

    //Recalculate the previous and next media
    currentContent.getNeighbours();

    //Change currentContent to closest valid content
    if(currentContent !== noneSelected && currentContent !== null){

        if(!canPlay(currentContent)){

            var newContent = null;
            var crntContentFound = false;

            //Find currentContent in allContent array and set newContent to next valid content
            for(var i = 0; i <= allContent.length; i++){

            	//Keep i within bounds if settingsArray[0] (loop whole thread)
            	i = settingsArray[0] ? i%allContent.length : i;

            	//Terminates loop if out of bounds
            	if( i === allContent.length)
            		break;

            	//If crntContent is reached again, nothing was found
            	if(crntContentFound && allContent[i] === currentContent)
            		break;

            	//If content matches, crntContent has been found
                if(allContent[i] === currentContent)
                    crntContentFound = true;

                //If playable content has been found after crntcontent, save to newContent
                if(crntContentFound && canPlay(allContent[i])){
                	newContent = allContent[i];
                	break;
                }
            }
            
            //If newContent is null, change to noneSelected
            newContent = newContent === null ? noneSelected : newContent;

            newContent.select();
        }
    }

    //Clear contents and width of internalSlider
    el_internalSlider.innerHTML = "";
    el_internalSlider.style.width = "-1px";

    //Add all thumbnails to internalSlider
    for(var i = 0; i < usedContent.length; i++){
        el_internalSlider.appendChild(usedContent[i].thumb);
        el_internalSlider.style.width = (el_internalSlider.clientWidth + (usedContent[i].thumb.clientWidth*1.2) ) + "px";
    }

    //Scroll seleceted media into gallery view again
    currentContent.slideGallery();

    updateCounter();
    //Trigger height calculations without changing gallery state
    // showGallery(isShown(el_gallery));
}

//Returns media type when given source
function mediaType(input){
	if(input === undefined){
		console.log('Error: mediaType input argument was undefined');
	}else if(input === null){
		console.log('Error: mediaType input argument was null');
	}else{
		var temp = input.toString();

	    temp = temp.substr(temp.lastIndexOf('.') + 1);

	    if(temp == webm) return webm;
	    if(temp == gif)   return gif;
	    if(temp == png)  return png;
	    if(temp == jpg)  return jpg;
	}

	//Last Resort    
    return null;
}

//Returns if current user settings permits the playing of parsed object
function canPlay(mediaObj){
    var objType = mediaObj.type;

    var canPlay = false;

    //Return 'checked' value of checkbox corresponding to the object type
    switch(objType){

    	case webm:
    		return op_webms.checked;
    	case gif:
    		return op_gifs.checked;
    	case png:
    	case jpg:
    		return op_imgs.checked;
    	case "SOT":
    	case "EOT":
    		return !op_loopAll.checked;
    		break;
    	default:
    		return false;
    }

    // return (objType == webm && op_webms.checked) || (objType == gif && op_gifs.checked) || ( (objType == png || objType == jpg) && op_imgs.checked ) || (objType == "SOT" && !op_loopAll.checked) || (objType == "EOT" && !op_loopAll.checked);
}

//Applies autoplay based on user settings
function updateAutoplay(){

    //Clear timeout to avoid timeout overlaps and
    //unwanted function calls
    clearTimeout(globalTimeout);

    if(currentContent.type == webm){

        //Loop media (incase auto is not turned on)
        currentContent.media.loop = true;

        //If it is turned on, set to false and await end of video
        if(op_auto.checked){
            currentContent.media.loop = false;
            currentContent.media.onended = next;
        }
    }else if(currentContent.type == gif){

        //If auto is checked apply according timeout
        if(op_auto.checked){
            globalTimeout = setTimeout(next, op_gif_duration.value*1000);
        }
    }else if(currentContent.type == png || currentContent.type == jpg){

        //If auto is checked apply according timeout
        if(op_auto.checked){
            globalTimeout = setTimeout(next, op_img_duration.value*1000);
        }
    }
}

//Returns array of ALL elemnts. Including SOT, EOT and noneSelected
//Also sets the onclick method for the thumbnail in the default thread
function getContent(){

    var temp = [];

    var elements = document.getElementsByClassName('fileThumb');

    //Pushes 'start of thread' placeholder
    temp.push(SOT);

    //Loops over all media elements in thread
    //and pushes them to temp array
    for(var i = 0; i < elements.length; i++){

        var vidSrc = elements[i].href;
        var imgSrc = elements[i].getElementsByTagName('img')[0].src;
        var id = elements[i].parentNode.parentNode.id;

        var x = new Media(imgSrc, vidSrc, id);

        function playThis(){
        	showSFC(true);
        	x.select();
        }

        temp.push(x);

        //Change clicking the video element to open SFC
        var href = elements[i].getElementsByTagName('img')[0].parentNode;
        href.setAttribute('oldHref', href.href);
        href.oldHref = href.href;
        href.setAttribute('imgSrc', imgSrc);
        href.imgSrc = imgSrc;
        href.href = imgSrc;
    	href.onclick = function(event){
    		inThreadClick(event);
    	};
    }

    //Pushes 'end of thread' placeholder
    temp.push(EOT);

    return temp;
}

//Returns all media permitted to play by user settings
function getUsedContent(){
    var temp = [];
    var count = 0;

    for(var i = 0; i < allContent.length; i++){
        if(canPlay(allContent[i])){
            temp.push(allContent[i]);
            temp[count].position = count;
            count++;
        }
    }
    return temp;
}

//Shuffles the usedContent array
function shuffle(){

	//Direction is shuffle/unshuffle
	var shuffled = op_shuffle.value === "Unshuffled";

	if(!shuffled){
		var newUsedContent = [];
		var max, min = 0;

		//Push a random index from the usedContent into a new array
		while(usedContent.length > 0){

			//Get random index
			max = usedContent.length - 1;
			var rand = Math.floor(Math.random() * (max - min + 1)) + min;

			//remove one from old and add to new
			newUsedContent.push(usedContent.splice(rand, 1)[0]);

			//Update positions
			newUsedContent[newUsedContent.length - 1].position = newUsedContent.length - 1;

		}
		
		//Overwrite the old and update gallery
		usedContent = newUsedContent;
		updateGallery(usedContent);

		op_shuffle.value = "Unshuffle";

	}else {
		updateGallery();
		op_shuffle.value = "Shuffle";
	}
}

function getRandom(exclude){

	//Array of media with lowest view count
	var lowestPlayCount = [];

	//Fill array with least viewed content
	for(var i = 0; i < usedContent.length; i++){

		//If placeholder media -> continue
		if(usedContent[i] === SOT || usedContent[i] === EOT || usedContent[i] === exclude){
			continue;
		}

		//If array is empty -> add current media
		if(lowestPlayCount.length === 0){
			lowestPlayCount.push(usedContent[i]);
			continue;
		}

		//If new lowest found -> erase and push
		if(usedContent[i].playcount < lowestPlayCount[0].playcount){
			lowestPlayCount = [];
			lowestPlayCount.push(usedContent[i]);
			continue;
		}

		//If matching view count -> push
		if(usedContent[i].playcount === lowestPlayCount[0].playcount){
			lowestPlayCount.push(usedContent[i]);
			continue;
		}
	}

	//Select random media from array
	var min = 0;
	var max = lowestPlayCount.length - 1;
	var rand = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log("Random");
    console.log(lowestPlayCount);
    console.log("");
	return lowestPlayCount[rand];
}

function updateCounter(){
	el_counter_first.innerHTML = currentContent.position + 1;
	el_counter_second.innerHTML = usedContent.length;
}


///////////////////////
// # Miscellaneous # //
///////////////////////

//This function is called when a thumbnail in the thread is clicked
function inThreadClick(event, videoHref){
	if(event.target === null)
		return;

	if(settingsArray[11]){

    	var hrefContainer = event.target.parentNode;
    	var currentID = hrefContainer.parentNode.parentNode.id;

    	setTimeout( function(){
    		hrefContainer.parentNode.classList.remove("image-expanded");	
    	}, 0.0001);

    	for(var j = 0; j < allContent.length; j++){
    		if(allContent[j].id === currentID){
    			showSFC(true);
    			allContent[j].select();
    		}
    	}
        	
	}else{
		event.target.href = event.target.oldHref;
		event.target.click();
	}
}

function magicMouse(bool){

    var timer = setTimeout(function(){},0);

    var showMouse = function(){
        console.log("showing");
        el_magicMouse.style.display = "none";
    }

    var hideMouse = function(){
        console.log("hiding");
        el_magicMouse.style.display = "block";
        document.body.style.cursor = "auto";
    }

    var resetTimer = function(){
        console.log("resetting");

        showMouse();
        clearTimeout(timer);
        timer = setTimeout(hideMouse, 500);
    }

    if(bool === true){
        document.body.onmousemove = resetTimer;
    }else{
        document.body.onmousemove = null;
    }
}

function getPageTopLeft(el) {
    var rect = el.getBoundingClientRect();
    var docEl = document.documentElement;
    return {
        left: rect.left + (window.pageXOffset || docEl.scrollLeft || 0),
        top: rect.top + (window.pageYOffset || docEl.scrollTop || 0)    
    };
}

//Convert css style strings to integer values (top, right, bottom and left)
function getCSSValues(styleStr){

	var values = [];

	do{
		//Find match 
		var match = styleStr.match("\\d+[a-zA-Z]{2}");
		var foundString = match[0];

		//Remove all characters before and including the match
		styleStr = styleStr.substr( match.index + foundString.length, styleStr.length - 1);

		values.push(parseInt(foundString, 10));

	}while(styleStr.length > 3); //If below 3 than it's not a valid style value

	return values;
}
