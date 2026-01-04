// ==UserScript==
// @name	Netflix saw it button
// @author	TheGeekProfessor
// @version 1.0
// @namespace tgp_netflix
// @description	Fix netflix thumbnails so you can mark them as watched
// @include	https://www.netflix.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @downloadURL https://update.greasyfork.org/scripts/411397/Netflix%20saw%20it%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/411397/Netflix%20saw%20it%20button.meta.js
// ==/UserScript==

// license	Creative Commons Attribution License


$(document).ready(function() {  
  $('[data-ui-tracking-context]').each(function(){
    // It's  query string that's actually JSON that's actually an array
    id= JSON.parse(decodeURI($(this).data('ui-tracking-context')));
    id = id.video_id;
  	if(localStorage.getItem(id))
      $(this).closest('.title-card-container').addClass('g_watched');
  });
  $('[data-tracking-uuid]').closest('.title-card-container').append('<div class="watched_eye">&#128065;</div>');
  $('.watched_eye').click(function(){
  	$(this).closest('.title-card-container').toggleClass('g_watched');
    id = $(this).closest('.title-card-container').find('[data-ui-tracking-context').data('ui-tracking-context');
 	  id= JSON.parse(decodeURI(id));
    id = id.video_id;
    localStorage.setItem(id,$(this).closest('.title-card-container').hasClass('g_watched'));
    console.log(id);
    console.log(localStorage.getItem(id));
  });
 
  $('head').append( `
    <style>
    .watched_eye {
      font-size: 57px;
      padding: 10px;
      position: absolute;
      bottom: -40px;
      left: 0;
      background: gray;
      border-radius: 6px;
      height: 30px;
      line-height: 30px;
    }
		.watched_eye:hover {
			opacity: .3;
			cursor:pointer;
		}
		.title-card-container.g_watched {
			opacity: .3;
		}
    </style>
  ` );
 
});