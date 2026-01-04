// ==UserScript==
// @name        Youtube cat caption/transcription "ipicat"
// @namespace   Violentmonkey Scripts
// @match       *://www.youtube.com/watch*
// @grant       none
// @version     1.0
// @grant       GM_registerMenuCommand
// @grant       GM.xmlHttpRequest
// @run-at       document-idle
// @connect     *
// @author      -
// @license MIT
// @description https://www.reddit.com/r/thomastheplankengine/comments/1g77xv3/dreamt_that_youtube_added_a_new_variant_of   /10/27/2024, 7:26:30 PM
// @downloadURL https://update.greasyfork.org/scripts/514393/Youtube%20cat%20captiontranscription%20%22ipicat%22.user.js
// @updateURL https://update.greasyfork.org/scripts/514393/Youtube%20cat%20captiontranscription%20%22ipicat%22.meta.js
// ==/UserScript==


(() =>
{
  //this script is inspired by this reddit post https://www.reddit.com/r/thomastheplankengine/comments/1g77xv3/dreamt_that_youtube_added_a_new_variant_of/ by Beautiful_Pear_269
  //to use this script you need to press on the tampermonkey/greasemonkey/violentmonkey/whoknowswhatmonkey icon and then the "cat caption" button near the script name


  //  see settings below
	// register menu command
	GM_registerMenuCommand("cat caption", () => start());

	function start()
	{

        console.log('All assets are loaded')

        //settings/////////////////////////////////////////////////////////////////

        var image_height  = "30%" //height  of the image in px or % 

        var multiple_images_enable=true//use multiple images instead of one (they will be chosen randomly)

        var multiple_images_use_url = true // use true to get the images from an link , false to get the images from "var image_links" from below
        var multiple_images_url ="https://pastebin.com/raw/fQUkjn5P" //use any raw pastebin / github / etc link . links must be separated by an new line

        var image_source          = "https://media.tenor.com/lZdzbBi3xtUAAAAe/cat-speech-bubble.png" // the image to use when not using multiple_images
        var image_links = `https://media.tenor.com/pSOtjBUadGkAAAAM/ansel-cat.gif
        https://media.tenor.com/lZdzbBi3xtUAAAAM/cat-speech-bubble.gif
        https://media.tenor.com/LHIJkVuoJngAAAAj/speech-bubble-silly-cat.gif
        https://media.tenor.com/Vq9Vdk97qakAAAAj/canny-cat-cat.gif
        https://media.tenor.com/nAmP8J-0yP0AAAAj/angry-cat.gif
        https://media.tenor.com/1wMDeEN59QIAAAAj/speech-bubble-meme-gentlemen-cat.gif
        https://media.tenor.com/XTT6-I7CLu8AAAAj/cat-judging.gif
        https://media.tenor.com/-vznGH86n2YAAAAj/bubble-speech-big-poo.gif
        https://media.tenor.com/QXmezFQdex4AAAAj/fred-speech-bubble.gif
        https://media.tenor.com/J_u2_ZnqVEkAAAAj/bnopka-cat.gif
        https://media.tenor.com/hWLG8xQD7agAAAAj/cat-cute-cat.gif
        https://media.tenor.com/YqvaCPse6qQAAAAj/polite-cat-speech-polite-cat.gif
        https://media.tenor.com/fobTclYypQYAAAAj/speech-bubble-cat-in-sand.gif`

      //////////////////////////////////////////////////////////////////////////////

      //find the show annotation button and click it
      var aaaa = document.getElementsByClassName("ytd-video-description-transcript-section-renderer")
      console.log("aaaa =",aaaa)

      var bbbb = ""
      for(var i = 0;i <= aaaa.length;i++){
        console.log(aaaa[i].localName)
        if(aaaa[i].localName == "ytd-button-renderer"){console.log("I = ",i); bbbb = aaaa[i];break}
      }
      console.log(bbbb)
      var cccc = bbbb.getElementsByClassName("yt-spec-touch-feedback-shape__fill")[0]
      cccc.click()
      //
      //replace the language text , for example "English (auto-generated)" with our precious image
	    var eeee = ""
      var ffff = ""
      setTimeout(function(){


      var dddd = document.getElementsByClassName("style-scope ytd-transcript-search-panel-renderer")

      for(var i = 0;i <= dddd.length;i++){
        console.log(dddd[i].localName)
        if(dddd[i].localName == "ytd-transcript-footer-renderer"){console.log("I = ",i); eeee = dddd[i];break}
      }
      for(var i = 0;i <= dddd.length;i++){
        console.log(dddd[i].localName)
        if(dddd[i].localName == "ytd-transcript-segment-list-renderer"){console.log("I = ",i); ffff = dddd[i];break}
      }
      console.log(eeee)
      console.log(ffff)
      eeee.parentElement.innerHTML = ""
      //  ffff.parentElement.parentElement.parentElement.parentElement.innerHTML += `<img id='our_image_goes_here' src="https://media.tenor.com/lZdzbBi3xtUAAAAe/cat-speech-bubble.png" height="30%" >`


        //loads the image
      var the_links = ""
      var link_array = ""
       var current_link =""
      if(multiple_images_use_url == true){
          GM.xmlHttpRequest({
            method: "GET",
            url: multiple_images_url,
            headers: {
              "Content-Type": "application/json"
            },
            onload: function(response) {
              console.log(response.responseText);
             the_links = response.responseText
           if(the_links != "" ){
              link_array = the_links.split("\n")
               current_link = link_array[(Math.floor(Math.random() * link_array.length))]
              }else{
                multiple_images_enable =false
              }

            }
          });



      }else{
        link_array = image_links.split("\n")
          current_link = link_array[(Math.floor(Math.random() * link_array.length))]
      }
          setTimeout(function(){
        console.log("multiple_images_enable :",multiple_images_enable)
        console.log(link_array)
      var iiii = document.createElement("img")
      iiii.id = 'aaaaa'
      if(multiple_images_enable){
              iiii.src= current_link
      }else{
              iiii.src= image_source
      }

      iiii.style.height = image_height
      //iiii.innerHTML =  `<img id='our_image_goes_here' src="https://media.tenor.com/lZdzbBi3xtUAAAAe/cat-speech-bubble.png" height="30%" >`
      ffff.parentElement.parentElement.parentElement.parentElement.appendChild(iiii)
      console.log(iiii)
       }, 1000);
      }, 3000);

  }
}
)();

