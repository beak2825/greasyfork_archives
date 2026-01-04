// ==UserScript==
// @author       @Ericcartman
// @namespace    fghfghfgh
// @name        hdbits: display imdb pictures
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace   ok
// @description  fuck firefox
// @include     https://hdbits.org/browse.php*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/367618/hdbits%3A%20display%20imdb%20pictures.user.js
// @updateURL https://update.greasyfork.org/scripts/367618/hdbits%3A%20display%20imdb%20pictures.meta.js
// ==/UserScript==

// for each category1 (movies)
$( ".category1" ).each(function() {
	try 
	{
		var fullTD = $(this).parent().parent().next().next().html();
		
		var imdbID = (fullTD.match(/www\.imdb\.com\/title\/tt(\d+)/))[1];
		
		if (imdbID > 0)
		{
			//alert (imdbID);
			var hdbitsImg = 'https://hdbits.org/pic/imdb_poster_cache/' + imdbID + '_big.jpg';
			
			$(this).attr("class", "");
			$(this).attr("style", "height: 140px; width: 95px;");
			$(this).prepend('<img style="height: 137px; padding: 2px;" src="' + hdbitsImg +'" />')
			
			// create a SECOND image element, this one has a height of 400 for when the mouse is over the smaller image.
			var img = $('<img>');
			img.attr('src', hdbitsImg);
			img.attr('style', "height: 400px;");
			
			// if mouse leaves big image, remove it
			$(img).mouseleave(function() {
				$(img).remove();
			});
			
			// take $(this) (the div that holds the image) and assigns it to a variable so I have access to it in functions
			var myDivObj = $(this);
			
			// image did not load (not saved on hdbits server for whatever reason) so delete the image and unbind the events
			$(img).error(function(){
				$(myDivObj).html("");
				$(myDivObj).unbind('mouseenter');
				$(myDivObj).unbind('mouseleave');
			});
			
			
			
			// on mouseover the div holding the image, append the bigger image at the same height, but slightly to the left.
			$(this).mouseenter(function() 
			{
				// get the offset of the div holding the image
			var offset = myDivObj.offset();
				
				img.appendTo(myDivObj);
				$(img).offset({ top: offset.top, left: offset.left-230 });
			})
			// if mouse leaves small image, remove the new bigger image
			.mouseleave(function() {
				$(img).remove();
			});
		}
	}
	catch(err) 
	{
   
	}
	
	
});

var count = 0;
$('tr[data-tvdbid]').each(function(index) {
	count++;
  });

  //alert("c" + count);