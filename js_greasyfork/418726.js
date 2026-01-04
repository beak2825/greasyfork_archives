// ==UserScript==
// @name         4chan json Image Viewer
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  All images in a thread in a simple image only view.
// @author       Czy [2020]
// @match        https://a.4cdn.org/*/thread/*.json
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418726/4chan%20json%20Image%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/418726/4chan%20json%20Image%20Viewer.meta.js
// ==/UserScript==


//START// Thread Location INFORMATION -------------------------------------------------------------------------------------------|
/*
  //LABEL     //           URL ADDRESS + Sub +  /thread/  + Number  + .JSON
  //BREAKDOWN // "https://a.4cdn.org/" + wg  + "/thread/" + 7662864 + ".json"
  //FULL      // https://a.4cdn.org/wg/thread/7662864.json

// DEMO INFO LAYOUT
{
	"posts":[
		{
		Simgle Occurance (first Post)
			"sub": "", 		// Thread Name
			"images": 273,	// Thread Total Images
		EACH Occurance
			"no": 7662864, 	// Post Number (Low -> High) // READ Loop ADD Repeat.
			"ext": ".jpg",	// File Extention	|	S_ext:[ ".jpg", ".png" ]
			"w": 5120,		// Full-Image Width
			"h": 2880,		// Full-Image Height
			"tn_w": 250,	// Mini-Image Width
			"tn_h": 140,	// Mini-Image Height
			"tim": 1601744276955,	// Image File Code
									// Full-Image URL: "https://i.4cdn.org/wg/"+ tim +".jpg"
									// Mini-Image URL: "https://i.4cdn.org/wg/"+ tim +"s.jpg"
		}
	]
}
*/
//END// Thread Location INFORMATION -------------------------------------------------------------------------------------------|

(function() {
    'use strict';


    var el ;
function dirco(a){ return window.location.pathname.split("/")[a]};
// displays Thread number (Lower right corner)
var dirhref = dirco(3).replace(".json", ""); // thread number
var dirthread = dirco(1); // thread


    // convert page json to string
var JObj = document.getElementsByTagName("pre")[0].innerHTML;
console.log( JObj );
    var obj = JSON.parse( JObj );
console.log( obj.posts[0].tim +" /demo/ "+ obj.posts[0].ext );

var dirSUBname = obj.posts[0].sub; // thread name
var dirname = obj.posts[0].semantic_url;

var LocIMG = "https://i.4cdn.org/"+dirthread+"/";

// just data
var ITL = obj.posts[0].images; // thread total images
var val = document.images.length; // total page images
var ListIMG = [];

function dem(){
    var cox = "";
    for(var i = 0; i < obj.posts.length; i++){
        if( obj.posts[i].tim === undefined ){
        }else{
            ListIMG.push( LocIMG + obj.posts[i].tim +"s.jpg" );
                var content = `
                    <a href="`+ LocIMG + obj.posts[i].tim + obj.posts[i].ext +`" target="_blank">
                        <img src="`+ LocIMG + obj.posts[i].tim +`s.jpg" height="`+ obj.posts[i].tn_h +`" width="`+ obj.posts[i].tn_w +`" />
                    </a>
                `;
            cox += "<li>"+ content +"</li>";
        }
    };

    return cox;
};


el =`
<!--- CSS --->
<style>

    /* hide <pre> object */
    pre{
        display: none;
    }

    ul{
        list-style-type: none;
        margin:5px;
        padding-left:0px;
    }
    ul li {
        list-style-type: none;
        padding-left:0px;
        border:solid 1px black;
        display:inline-block;
    }

</style>


<!--- --->
    <div style="background:#eeeeee; position: absolute; top:25px; margin-left:auto; margin-right:auto; left:0; right:0; text-align:center;">
           <h1>`+dirSUBname+` (`+ITL+`) </h1>
            <ul>`+dem()+`</ul>

	</div>

	<div style="background:#eeeeee; position:fixed; bottom:0px; right:0px;">
         <a href="https://boards.4chan.org/`+dirthread+`/thread/`+dirhref+`/`+dirname+`" target="_blank" onclick="window.close();">
            <h1>`+dirhref+`</h1>
        </a>
    </div>`;

    console.log(ListIMG);

//ADDS el to PAGE
document.body.innerHTML += el;
})();