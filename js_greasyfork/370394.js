// ==UserScript==
// @name     	Yah's Evernote Audio Player
// @description Simple Audio File player for Evernote shared notebooks
// @version  	1.0
// @include	https://www.evernote.com/pub/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js
// @namespace https://greasyfork.org/users/196900
// @downloadURL https://update.greasyfork.org/scripts/370394/Yah%27s%20Evernote%20Audio%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/370394/Yah%27s%20Evernote%20Audio%20Player.meta.js
// ==/UserScript==
//==========================================================================
// * It is important to include an early version of jQuery... < 3.0. We need .live()!
// 
// * Requirements:
//		1. Evernote account. Free version is fine, but it will take a looooong
//				 time to get many audio files uploaded due to the monthly limit.
//		2. Audio Files: MP3 are the only types supported in the script for now.
//		3. Greasemonkey or Tampermonkey installed.
//		4. Browser: Firefox has been tested.
//
// * How to use:
//		1. Create a Notebook in Evernote and Share it publically.
//		2. Create a note in the shared notebook to hold songs. You can create
//				 as many notes as you need.
//		3. Insert/upload audio files into the note. Arrange them in the order
//				 you want them to play. The Web interface works better for audio
//				 uploads in our experience but YMMV.
//		4. Install this script.
//		5. Browse to the notebook's public link.
//		6. If the initial note that is displayed has any audio files, the
//				 player automatically starts. If not, you can just click on a
//				 note to get the player to start. You will see it at the top in
//				 the center of the page.
//
// * Features:
//		* Loops all songs continuously
//		* Pause / Play
//		* Volume adjust
//
// * Working on:
//		* Hover over player to open up playlist and enable direct select.
//		* #Settings - Allow manually entering in #settings in note:
//				* Looping method (#loopall, #loopsingle, #random)
//		* Other file types (OGG, etc);
//
//==========================================================================
function audio_file_next(){
		L("audio_file_next()");
  	this.qty = $("#audio_files_qty").html();
  	this.current = $("#audio_files_current").html();
  	L("	var audio_files_current: " + this.current);
  	L("	var audio_files_qty: " + this.qty);

  	this.current++;
  	if (this.current > this.qty){ this.current = 1; }
  	$("#audio_files_current").html(this.current);
  	this.audio_file = $("#audio_file_" + this.current).html();
  	L("	audio_file: " + this.audio_file);

  	//Display the Song Title
  	this.song_title = decodeURIComponent(this.audio_file.split('/').pop().split('#')[0].split('?')[0]);
    $("#song_title").html(this.song_title);

    //Start playing
  	this.p = document.getElementById("audio_player");
  	this.p.src = this.audio_file;
  	this.p.play();
}
function audio_files_get(){
  	L("Audio_files_get()");
    //Cleanup
    $("#div_audio_player").remove();
    $("#div_audio_player_vars").remove();

    this.t =setTimeout( function(){
      //Grabbing page contents
      this.h = $(document.documentElement)[0].innerHTML;

      //Parsing page contents to extract MP3 files
      this.reg = /(https:\/\/)?(www)?[-a-zA-Z0-9@:%_\+.~#?\/=]+\.mp3/gi
      this.lastMatch = "";
      this.audio_files = [];
      while((this.result = reg.exec(this.h)) !== null) {
        if (this.result[0] != this.lastMatch){
          if (this.result[0].substring(0,5) == "https"){
            this.audio_files.push(result[0]);
            this.lastMatch = result[0];
          }
        }
      }
      //L(audio_files);

      L(audio_files.length);
      if (this.audio_files.length > 0){
        this.h = "";
        this.h += "<audio id='audio_player' controls>";
        this.h += "		<source src='' type='audio/mpeg'>";
        this.h += "		Your browser does not support the audio element.";
        this.h += "</audio>";

        $("#div_audio_player").remove();
        this.div_player = div_new("div_audio_player", 		 document.body,   this.h);
        this.div_vars =   div_new("div_audio_player_vars", document.body,   "", 1);
        this.t = 			    div_new("audio_files_current", 	 this.div_vars,   "0");
        this.t =          div_new("audio_files_qty", 		   this.div_vars,   this.audio_files.length.toString());
        this.t = 				  div_new("audio_files_list", 	 	 this.div_vars,   "");
        this.t =					div_new("song_title",						 this.div_player, "")
        //
        this.count = 0;
        this.audio_files.forEach((file) => {
          this.count++;
          $("#audio_files_list").append("<div id='audio_file_" + this.count + "'>" + file + "</div>");
        });

        //Play the first audio file
        audio_file_next();

        //Add event audio player listeners
        this.a = document.getElementsByTagName("audio")[0];
        this.a.addEventListener("ended", function(){
          L("ended!");
          audio_file_next();
        }, true);
      }
    }, 1000);
}
function css_add(){
		this.css = `
        #div_audio_player{
            background-color: black;
            border-radius: 5px;
            left: 600px;
            opacity: 0.8;
            position: absolute;
            text-align: center;
            top: 0px;
            z-index: 1000;
            }
        #song_title{
            color: white;
            font-family: Tahoma, Verdana, Segoe, sans-serif;
            font-size: 12px;
            font-weight: bolder;
            line-height: 20px;
            width: 270px;
        }
		`;
  	$('<style>'+ this.css +'</style>').appendTo(document.head);
}
function div_new(div_name, div_parent, html, invisible){
  	L("div_new(" + div_name + ", " + div_parent + ", " + html + ")");
  	this.div = document.createElement("div");
  	this.div.id = div_name;
  	this.div.innerHTML = html;
  	if (invisible == 1){ this.div.style.visibility = "hidden"; }
  	div_parent.appendChild(this.div);
  	return this.div;
}
function L(logStr){
  	console.log(logStr);
}

//===================== Main =====================
(function() {
  	//Add CSS
  	css_add();

    //Get rid of the annoying popup
		this.t = setTimeout( function(){
				$("#gwt-debug-arrowDialog").remove();
      	audio_files_get();		//Check for audio files in the initial note
		}, 2000);

    //Action after click on noteSnippet
    $( ".noteSnippet" ).live( "click", function() {
      	L( "User clicked on noteSnippet" );
        audio_files_get();
    });
})();