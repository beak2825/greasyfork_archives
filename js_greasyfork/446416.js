// ==UserScript==
// @name        Bumble Bonus (Voice Speedcontrol + Large Images)
// @name:de     Bumble Bonus (Große Bilder + Sprachnachrichtengeschwindigkeit)
// @namespace   Violentmonkey Scripts
// @match       https://*bumble.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @run-at      document-start
// @grant       GM_addStyle
// @version     2.0.4
// @author      -
// @description 28.1.23
// @description:de 28.1.23
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/446416/Bumble%20Bonus%20%28Voice%20Speedcontrol%20%2B%20Large%20Images%29.user.js
// @updateURL https://update.greasyfork.org/scripts/446416/Bumble%20Bonus%20%28Voice%20Speedcontrol%20%2B%20Large%20Images%29.meta.js
// ==/UserScript==


var picssectionstring = `<div class="profile__section--text profile__section--location">
    <div class="profile__subtitle">
        <div class="profile__subtitle-icon"><span class="icon icon--size-stretch" role="presentation"
                data-qa-role="icon" data-qa-icon-name="profile-badge-location"><svg data-origin="pipeline"
                    viewBox="0 0 32 32" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16zM9.608 13.72c-.259 3.7 5.772 10.168 6.141 10.194.37.026 6.825-5.569 7.084-9.27.259-3.7-2.492-6.906-6.144-7.161-3.652-.256-6.822 2.537-7.08 6.237zM16 16a2.133 2.133 0 110-4.267A2.133 2.133 0 0116 16z"
                        fill="currentColor"></path>
                </svg></span></div>
        <div class="profile__subtitle-text">
            <div class="p-2 text-ellipsis font-weight-medium"><span>Pics</span></div>
        </div>
    </div>
    <div class="profile__about">
      <ul id="picture_list" class="profile__badges">
      </ul>
    </div>
</div> `;

function InsertImages(){
    var x = $(".profile__photo");
    var i;

    if(!x.hasClass("processed")){
      var picSection= $($(".profile__section")[0]).append(picssectionstring);
      for (i = 0; i < x.length; i++) {
          src = x[i].src;
          slug = src.split('&size')[0];
          $("#picture_list" ).append('<li class="profile__badge">\
                                              <div class="pill"> \
                                                  <div class="pill__title">\
                                                    <div class="p-3 text-ellipsis font-weight-medium">\
                                                      <a href="'+slug+'" style="text-decoration:underline;color:#454650;" target="_blank">Pic '+i+'</a>\
                                                    </div>\
                                                  </div>\
                                           </div></li>');

      }
      x.addClass("processed");
    }
}

function swapAudio () {
  var x = $(".message-audio > audio");
  color = (x.parents().eq(3).hasClass("message--out"))?"#282828":"#ffc629";
  var i;
  for (i = 0; i < x.length; i++) {
    var audioUrl =  $(x[i]).attr("src");
    var audioTag = '<div style="background-color:"'+color+'";border-radius:15px;padding-top:5px;" > \
                      <audio controls id="audio'+i+'" src="'+audioUrl+'" style="border-radius:15px;margin-left:10px;"></audio> \
                        <button style="margin-right:5px;margin-top:-30px;background:#e6b225;text-align: center;width: 60px;height: 40px;border-radius:15px;display: inline-block;vertical-align:middle;color:#000;" data-current-speed="1" data-audiosource="audio'+i+'" class="speedControl" "> 1x </button> \
                      </div>';
    $(x[i]).parent().html(audioTag);
    $(x[i]).removeClass("message-audio");
    }
}

$(document).ready(function(){
    $(document).on("click", ".speedControl" , function() {
      var currentSpeed = $(this).data("current-speed");
      var source = $(this).data("audiosource");
      var newSpeed= currentSpeed+0.25;
      var audioElement = document.getElementById(source);
      if (newSpeed>2) newSpeed = 1;
      audioElement.playbackRate = newSpeed;
      audioElement.play();
      $(this).html(newSpeed+"x");
      $(this).data("current-speed", newSpeed);
    });

  window.setInterval(() => {
    InsertImages();
    swapAudio();
  }, 500);

});

