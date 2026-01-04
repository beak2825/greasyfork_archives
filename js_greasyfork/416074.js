// ==UserScript==
// @name         Nitro Type Streamer Mode
// @namespace    https://youtu.be/G79kuxzcl80/song
// @version      1.4
// @description  This script allows you to embed a Nitro Type (or other) YouTube livestreams on Nitro Type – live chat and live video. That way when you're racing on Nitro Type, you don't have to switch back and forth trying to see who's in the chat... TRY IT OUT.
// @author       Ginfio
// @match        https://www.nitrotype.com/*
// @downloadURL https://update.greasyfork.org/scripts/416074/Nitro%20Type%20Streamer%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/416074/Nitro%20Type%20Streamer%20Mode.meta.js
// ==/UserScript==


// code.importfrom(codeeide_bd.com)
/*var x = 0;
   function (){
   x++;

  if (x == 0){
   code.importfrom(code89_bd.com);

} else {
code.importfrom(code52_bd.com
}


}


 X_Ju?*2jx/adfUnofrom(SX.j) => nones*AS****/










window.onload = function(){
	
	var style = document.createElement('style');
  style.innerHTML = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap');

.iframe{
  position: fixed;
  z-index: 19;
  left: 0;
  border: 1px solid #ccc;
}



.video{
	top: 1px;

}

*#root{
margin-left: 300px;
	
}

body{
  margin: 0;
  padding: 0;
  font-family: "Montserrat", verdana;
  background: #1f212d;
  color: white;

}


*{
  
  box-sizing: border-box;
  
}

.motherOfAll{
	position: fixed;
	height: 100%;
	width: 100%;
	top: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.9);
	z-index: 19;
	
	
}

.show-hide-btn{
	height: 30px;
	width: 30px;
	bottom: 2px;
	left: 2px;
	position: fixed;
	z-index: 20;
	background: black;
	border-radius: 50%;
	opacity: 1;
	cursor: pointer;
	border: 2px solid white;
}

.wrap{
  padding: 5px;
  height: auto;
  width: 370px;
  background: url("https://www.nitrotype.com/dist/site/images/backgrounds/bg-tires.png"), linear-gradient(130deg, #2E3141 0%, #2E3141 20%, #303343 20%, #303343 25%, #2E3141 25%, #2E3141 27%, #303343 27%, #303343 50%, #2E3141 50%, #2E3141 85%, #303343 85%, #303343 90%, #2E3141 90%);
  position: relative;
  margin: 10% 35%;
 
}

.all-container{
  height: auto;
  width: auto;
}

.category-name-container{
  height: auto;
  width: auto;
  display: flex;
  gap: 2px;
  padding: 5px;
  background: #1f212d;  


}

.category-wrapper{
  height: auto;
  width: auto;
  background: #1f212d;  
  padding: 10px;
}

.category-name{
  padding: 2px;
  height: auto;
  width: 370px;
  position: relative;
  overflow: hidden;
  display: block;
  font-size: 16px;
  

}



/* RADIO */



.on-off-radio{
  display: none!important;

}


.on-off-container{
 opacity: 1;

}
.on-off-right{
  width: 20%;
  display: flex;
  justify-content: space-around;


}


.on-off-left{
  width: 75%;
}
/*
radio

*/



  .radio{
    height: 19px;
    width: 19px;
    position: relative;
    cursor: pointer;
    display: inline-block;

    
  }

label{
  cursor: pointer;
}

.label-radio{
  display: inline-block;
  color: white;
  transform: translateY(-3px);
  cursor: pointer;
  width: 90%;
  padding: 1px;
  text-indent:  5px;
  
}



input[type="radio"]:checked+label {
  color: #59ffa0;
  

}


.test{
  height: 100px;
  width: 100px;
}


.input-radio[type='radio'] {
  -webkit-appearance:none;
  width:20px;
  height:20px;
  border:1px solid #59ffa0;;
  border-radius:50%;
  outline:none;
  box-shadow:0 0 5px 0px #59ffa0 inset;
}

.input-radio[type='radio']:hover {
  box-shadow:0 0 5px 0px #59ffa0 inset;
}

.input-radio[type='radio']:before {
  content:'';
  display:block;
  width:60%;
  height:60%;
  margin: 20% auto;    
  border-radius:50%;    
}
.input-radio[type='radio']:checked:before {
  background:#59ffa0;
}

/* check box */


input[type='checkbox']{


  filter: hue-rotate(300deg);
  border: 1px solid #59ffa0;

 
}


input[type="checkbox"]:checked+label {
  color: #59ffa0;  
}

/* url input */


input.url{
  height: 30px;
  background: transparent;
  box-shadow: none;
  border: 1px solid #777;
  border-radius: 5px;
  outline: none;
  color: white;
  font-family: "Montserrat", verdana;
  font-size: 16px;
  padding: 10px;
  display: inline-block;

}

input.url:focus{
  border: 1px solid rgb(0, 183, 255);
}


.save-btn{
  display: inline-block;
  height: auto;
  width: 99%;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  background: #d62f3a;
  box-shadow: inset 0px -3px 0px 0px rgba(2, 2, 2, 0.25);
  outline: none;
  border: none;
  padding: 20px;
  font-size: 16px;
  font-family: "Montserrat";
  font-weight: 900;
  transition: all 0.4s;
}

.save-btn:hover{
  background: #c51e29;
}


.save-btn:active{
  zoom: 110%;
}




/* iframes */


  `;
  document.head.appendChild(style);
	
	  var localStorage = window.localStorage;

/* tes */

//document.querySelectorAll(".ad")[1].remove()
	
	// btn--fw

	var showHideBtn = document.createElement('div');
		showHideBtn.className = "show-hide-btn";
		document.body.appendChild(showHideBtn);
		
	
		
		
	var containTool = document.createElement("div");
		containTool.className = "motherOfAll";
		containTool.style.display = "none"
	
	var myTool = `<div class = "wrap">
      <div class = "all-container">
        <div class = "category-wrapper">

            <h2 class = "type-title"> Streamer Mode </h2>

          <div class = "category-name-container on-off-container"> 
            <div class = "category-name on-off-left"> 
              <span class = "category-name-span"> Streamer Mode </span>
              
            </div> 

            <div class = "on-off-right"> 

              <div class = "switch-containe">
                <input type = "radio" name = "switch" class = "radio on-off-radio" id = "off">
                <label for = "off" class = "label-on-off"> off </label>
              </div>

              <div class = "switch-container">
                <input type = "radio" name = "switch" class = "radio on-off-radio" id = "on">
                <label for = "on" class = "label-on-off"> on </label>
              </div>

            </div>
          </div>
        <div class = "controls-container">
          <div class = "category-name-container style-name-container"> 
            <div class = "category-name"> 
              <span style = "display: block"> Live stream ID: </span> 
              <br>
              <input class = "url" type = "text" size = "17" value = "">            </div>
          </div>


          
          <div class = "category-name-container style-name-container"> 
            <div class = "category-name"> 
              <input type = "radio" name = "option" class = "radio input-radio" id = "option">
              <label for = "option" class = "label-for-option label-radio"> Chat only </label>
            </div>
          </div>

          <div class = "category-name-container style-name-container"> 
            <div class = "category-name"> 
              <input type = "radio" name = "option" class = "radio input-radio" id = "option-2">
              <label for = "option-2" class = "label-for-option-2 label-radio"> Chat & Video </label>
            </div>
          </div>

        <hr>

            <div class = "category-name-container style-name-container"> 
            <div class = "category-name"> 
              <input type = "checkbox" name = "checkbox" class = "checkbox radio input-radio" id = "check-distract">
              <label for = "check-distract" class = "label-for-checkbox label-radio"> Don't distract while racing </label>
            </div>
          </div>
          <button class = "save-btn"> Save </button> 
        </div> <!-- controls -->



        </div>
      </div>
    </div>



    <div class = "test"> </div>`;
    
    
    containTool.innerHTML = myTool;
    document.body.appendChild(containTool);
    
    
    showHideBtn.addEventListener("click", openOrHide);
 
    function openOrHide() {
  if (containTool.style.display === "none") {
    containTool.style.display = "block";
  } else {
    containTool.style.display = "none";
  }
}
	
	
    test_elem = document.querySelector(".test");

  // https://youtu.be/ftMnmPC82qM
  // qKvzIckPBlQ // news



  //var label = document.querySelector("");

  var streamerMode;
  var gg;
  var checked_switched;
//  var chatAndVideo;
//  var chatAndVideoCall;

    /* all input */
  
  on_off_btns = document.getElementsByName("switch");
  label_on_off_btns = document.querySelectorAll(".label-on-off")

  option_btns = document.getElementsByName("option");

  url_input = document.querySelector(".url")

  save_btn = document.querySelector(".save-btn");
  
  checkbox = document.querySelector(".checkbox")

var streamerMode = {
    Switch: 0,
    videoID: "",
    CoV: 0, // chat only or video
    DDWR: 0// don't distract while racing
}





save_btn.addEventListener("click", function(){
  this.disabled = true;
  this.style.opacity = "0.1"



// if off do things here...

 if (on_off_btns[0].checked == true){
   streamerMode.Switch = 0;
   chatOnly = undefined;
   chatAndVideo = undefined;
     document.querySelector(".controls-container").style.display = "none";
   document.querySelector("#root").style.marginLeft = "0";

   
    
 }

 // on
else if (on_off_btns[1].checked === true){
  streamerMode.Switch = 1;
}

// option btns


 if (option_btns[0].checked === true){
   streamerMode.CoV = 0;
  
 }
else if (option_btns[1].checked === true){
  streamerMode.CoV = 1;
}

// url input

if (url_input.value.length > 7 && url_input.value.length < 15){
  streamerMode.videoID = url_input.value;
}

// Don't distract while racing

if (checkbox.checked === true){
	streamerMode.DDWR = 1;
} else {
	streamerMode.DDWR = 0;
}

localStorage.setItem('streamerMode-state', JSON.stringify(streamerMode));

console.log(url_input.value)

})









on_off_btns[1].addEventListener("click", function(){
  document.querySelector(".controls-container").style.display = "block";
})



// opacity | event listener
label_on_off_btns.forEach(function(elm){
  elm.addEventListener("click", function(){
  save_btn.style.opacity = "1";
  save_btn.disabled = false;
  })
})


option_btns.forEach(function(element){
  element.addEventListener("click", function(){
  save_btn.style.opacity = "1";
  save_btn.disabled = false;
  })
})

// on input display 
url_input.oninput = function(){
save_btn.style.opacity = "1";
  save_btn.disabled = false;
}

// reuse ...
var gg = JSON.parse(localStorage.getItem('streamerMode-state'));

  on_off_btns[gg.Switch].checked = true; // on | off
  option_btns[gg.CoV].checked = true; // Chat only | Chat & video
  url_input.value = gg.videoID;
  // checkbox
  if (gg.DDWR == 1){
  	checkbox.checked = true
  } else {
  	  	checkbox.checked =  false;
  }


if (gg.Switch == 1){
	 document.querySelector("#root").style.marginLeft = "300px";
  if (gg.CoV == 0){
    chatOnly()
  } else if (gg.CoV == 1){
    chatAndVideo()
  }
}


// is off
  if (gg.Switch == 0){
    chatOnly = undefined;
    document.querySelector(".controls-container").style.display = "none";
    document.querySelector("#root").style.marginLeft = "0";

  
    chatAndVideo = undefined;
  } else if (gg.Switch == 1){
    chatAndVideo = undefined;
    chatOnly = undefined;

  }

// off

// ... checkbox

















function chatOnly(){
  chatAndVideoCaller = undefined;
  for (var i = 0; i < 1; i++){
  i++;
  liveChat = document.createElement("iframe");
	liveChat.width = "350";
	liveChat.height = "462";
	liveChat.src = "https://www.youtube.com/live_chat?v="+gg.videoID+"&embed_domain=www.nitrotype.com";
	
	liveChat.className = "chat iframe";
	liveChat.id = "chat-id";
  document.body.appendChild(liveChat)

  if(document.querySelectorAll(".chat").length > 1){
    document.querySelectorAll(".chat")[0].remove();
  }
  
  }

	liveChat.style.top = "1px";
	 control()
	

} // chatonly close




function chatAndVideo(){
for (var i = 0; i < 1; i++){
  i++;
  liveChat = document.createElement("iframe");
	liveChat.width = "350";
	liveChat.height = "462";
	liveChat.src = "https://www.youtube.com/live_chat?v="+gg.videoID+"&embed_domain=www.nitrotype.com";
	
	liveChat.className = "chat iframe";
	liveChat.id = "chat-id";
	// styles

  document.body.appendChild(liveChat)

  if(document.querySelectorAll(".chat").length > 1){
    document.querySelectorAll(".chat")[0].remove()
  }
  liveChat.style.top = "225px"
  
  }

var liveStream = document.createElement("iframe");
	liveStream.width = "350";
	liveStream.height = "225";
	liveStream.src = "https://www.youtube.com/embed/"+gg.videoID+"";
	
	liveStream.className = "video iframe"
  document.body.appendChild(liveStream);
  control()


} // chatandvideo


// https://www.youtube.com/live_chat?is_popout=1&v=gK4qmvvfxtc




function control(){


if(window.location.href.includes("https://www.nitrotype.com/race")){
	blurInput()
}



function blurInput(){
		document.querySelector(".dash-copy-input").disabled = true; // not racing
		if (gg.DDWR == 1){
			document.querySelectorAll(".iframe").forEach(function(toBeBlurred){
				toBeBlurred.style.filter = "blur(0)"
			})
		}
	
}



var checkExistence = setInterval(function(){
	if(document.querySelectorAll(".dash-copy").length > 0){
		setTimeout(function(){
			clearInterval(checkExistence);
			focusInput()
		}, 500)

	}
}) 


function focusInput(){
	document.querySelector(".dash-copy-input").disabled = false;
		setInterval(function(){
		document.querySelector(".dash-copy-input").focus();
		// localStorage // if close

		}, 1);
		
		if (gg.DDWR == 1){
			document.querySelectorAll(".iframe").forEach(function(toBeBlurred){
				toBeBlurred.style.filter = "blur(10px)"
			})
		}

}

	var checkExistenceForRaceResults = setInterval(function(){
	if(document.querySelectorAll(".race-results").length > 0){
		clearInterval(checkExistenceForRaceResults);
		blurInput();
		getBack()
		
	}
		}, 500) 

  } // control



} // window