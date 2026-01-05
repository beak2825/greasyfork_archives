// ==UserScript==
// @name         A9 Image Survey - 1 Location
// @namespace    https://greasyfork.org/en/scripts/19949-a9-image-survey-1-location
// @version      0.41
// @description  Makes the A9 Image Survey - 1 (Location HITs) easier to do (only keyboard).
// @author       walco005
// incl. is removed but kept here in case it is REALLY needed     *.mturkcontent.com/*
// @include      https://s3.amazonaws.com/mturk_bulk/*
// @include      https://www.mturk.com/mturk/*groupId=3SI493PTTXCN8RR0YUKNNXB592FZDB*
// @grant        GM-Log
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/19949/A9%20Image%20Survey%20-%201%20Location.user.js
// @updateURL https://update.greasyfork.org/scripts/19949/A9%20Image%20Survey%20-%201%20Location.meta.js
// ==/UserScript==

//Using just the What location portion of the h4 since using the whole thing was creating issues.
var x = false;
if ($("h4:contains(What location)").length){
    window.focus();
    $("h4:contains(What location)").append(
      "<br> Press the following key to select each location, then press ENTER to submit. <br> 1 - Bedroom <br> 2 - Bathroom<br> 3 - Kitchen<br > 4 - Living Room<br> 5 - Dining Area<br> 6 - Store<br> 7 - Other Location<br> 8 - Cannot Identify"
    );
    $(document).keydown(function(e) {
      switch(e.keyCode) {
          case 49:
              $("select[data-reactid='.0.0.1.2:$q1scene.2']").val("context_bedroom");
              if(!x) changeButton();
              break;
          case 50:
              $("select[data-reactid='.0.0.1.2:$q1scene.2']").val("context_bathroom");
              if(!x) changeButton();
              break;
          case 51:
              $("select[data-reactid='.0.0.1.2:$q1scene.2']").val("context_kitchen");
              if(!x) changeButton();
              break;
          case 52:
              $("select[data-reactid='.0.0.1.2:$q1scene.2']").val("context_living_room");
              if(!x) changeButton();
              break;
          case 53:
              $("select[data-reactid='.0.0.1.2:$q1scene.2']").val("context_dining_area");
              if(!x) changeButton();
              break;
          case 54:
              $("select[data-reactid='.0.0.1.2:$q1scene.2']").val("context_store");
              if(!x) changeButton();
              break;
          case 55:
              $("select[data-reactid='.0.0.1.2:$q1scene.2']").val("context_other");
              if(!x) changeButton();
              break;
          case 56:
              $("select[data-reactid='.0.0.1.2:$q1scene.2']").val("context_unknown");
              if(!x) changeButton();
              break;
          default:
              break;
          case 13:
              if(x) $("input[value='Submit']").click();
              break;
      }
    });
}

if ($("td:contains(All HITs Available to You)").length){
    location.reload();
    i++;
}

function changeButton() {
      $("h4:contains(What location)").removeClass("qHeadlineTodo");
      $("h4:contains(What location)").addClass("qHeadlineDone");
      $("input[data-reactid='.0.0.1.4.0']").removeClass("btn-default");
      $("input[data-reactid='.0.0.1.4.0']").addClass("btn-success");
      $("input[data-reactid='.0.0.1.4.0']").prop("disabled", false);
      x = true;
}