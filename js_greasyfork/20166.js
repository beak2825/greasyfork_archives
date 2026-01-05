// ==UserScript==
// @name FP2 Icon Loader
// @author       Creec Winceptor
// @description  Icon loader from local images for FPv2 icon editor.
// @namespace https://greasyfork.org/users/3167
// @grant none
// @include http*://facepunchforum.azurewebsites.net*
// @include http*://lab.facepunch.com*
// @run-at document-idle
// @version 0.0.1.20160604001845
// @downloadURL https://update.greasyfork.org/scripts/20166/FP2%20Icon%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/20166/FP2%20Icon%20Loader.meta.js
// ==/UserScript==

//http://stackoverflow.com/a/14570614
var observeDOM = (function(){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

    return function(obj, callback){
        if( MutationObserver ){
            // define a new observer
            var obs = new MutationObserver(function(mutations, observer){
                if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                    callback();
            });
            // have the observer observe foo for changes in children
            obs.observe( obj, { childList:true, subtree:true });
        }
        else if( eventListenerSupported ){
            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    }
})();

var fp2iconloader = false;

function Init(retries)
{
  	var content_div = document.getElementById("content");
  	if (content_div)
    {
      observeDOM( content_div ,function(){ 
        Load(0);
      });
      
      fp2iconloader = true;
      //console.log("initiated");
      Load(retries);
    }
  	else
    {
      if (retries>0)
      {
        setTimeout(function() {
          Init(retries-1);  
        }, 500)
      }
      else
      {
        //console.log("failed to load");
      } 
    }

}

function Load(retries)
{
	//console.log("loading");

	var file_input = document.getElementById("file_input");
  	if (file_input || !fp2iconloader)
    {
      //console.log("return");
      return;
    }
  	else
    {
    	var tools_panel = document.getElementsByClassName("panel tools")[0];
  		var text_input = document.getElementsByName("textinput")[1];
      if (tools_panel && text_input)
      {
        var file_input = document.createElement("input");
        file_input.type = "file";
        file_input.id = "file_input";


        var hr_break = document.createElement("hr");
        tools_panel.appendChild(hr_break);

        tools_panel.appendChild(file_input);

        file_input.onchange = function(e) {

            var res = 16;
            var URL = window.webkitURL || window.URL;
            var url = URL.createObjectURL(e.target.files[0]);
            var img = new Image();


            img.src = url;

            img.onload = function() {


                pixelarray = []; 
                if(!img.canvas) {
                    img.canvas = $('<canvas />')[0];
                    img.canvas.width = res;
                    img.canvas.height = res;
                    img.canvas.getContext('2d').drawImage(img, 0, 0, res, res);

                }



                var count = 0;
                for (var x=0; x<res; x++)
                {
                    for (var y=0; y<res; y++)
                  {
                    var pixelData = img.canvas.getContext('2d').getImageData(y, x, 1, 1).data;
                    pixelarray[count] = Math.round(pixelData[0]/256 * 9) + Math.round(pixelData[1]/256 * 9) * 10 + Math.round(pixelData[2]/256 * 9) * 100 + 1;

                    if (pixelData[3]<128)
                    {
                        pixelarray[count] = 0;
                    }
                    count++;

                  }
                }

                text_input.value = EncodeIconData(pixelarray);
                text_input.dispatchEvent(new Event('change'));
            }
        };
      }
      else
      {
          if (retries>0)
          {
              setTimeout(function() {
                    Load(retries-1);  
              }, 500)
          }
          else
          {
              //console.log("failed to load");
          }
      }
      //console.log("done");
   }
}

Init(10);