// ==UserScript==
// @name         Transfermarkt blocker
// @namespace    postblocker
// @version      0.1
// @description  Remove certain users posts
// @author       hinke @transfermarkt
// @include *transfermarkt.de/*/forum/*/thread_id/*
// @require http://code.jquery.com/jquery-3.2.1.min.js
// @grant       GM_deleteValue
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/396366/Transfermarkt%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/396366/Transfermarkt%20blocker.meta.js
// ==/UserScript==

var gmkick = GM_listValues();
console.log("geblockt:", gmkick)
var boxen = document.getElementsByClassName("box");
var box = Array.from(boxen);


buildOptions()
kickPosts();
addStyles();

function addStyles() {
  var s = $(document.createElement("style"));
  var css =
    "body { max-width: 100vw; }" +
    ".unblockUser { float: left; padding: 5px; border: 1px dashed #345487; margin: 5px; }" +
    ".npst { display: none; } ";

  s.html(css);

  $("head").append(s);
}
function buildOptions() {
  //toggle
  var toggleOptions = $(document.createElement("li"));
  toggleOptions.append(
    $(document.createElement("a"))
      .attr("style", "cursor: pointer;")
      .addClass("showOptions")
      .text("Postblocker")
  );
  $(".box-header-forum").append(toggleOptions);

  //hidden div containing the blocklist
  var hiddenDiv = $(document.createElement("div")).addClass("optionsContainer");
  hiddenDiv.css("display", "none");
  hiddenDiv.css("position", "fixed");
  hiddenDiv.css("padding", "20px");
  hiddenDiv.css("width", "750px");
  hiddenDiv.css("max-width", "80vw");
  hiddenDiv.css("height", "500px");
  hiddenDiv.css("maxheight", "80vh");
  hiddenDiv.css("left", "50%");
  hiddenDiv.css("top","15%");
  hiddenDiv.css("transform", "translate(-50%)");
  hiddenDiv.css("overflow-y", "auto");
  hiddenDiv.css("background-color", "#FFFFFF");
  hiddenDiv.css("color", "#1a3151");
  hiddenDiv.css("z-index", "9001");
  hiddenDiv.css("border", "1px solid #333");
  hiddenDiv.css("border-top", "none");
  hiddenDiv.css("border-bottom-right-radius", "10px");
  hiddenDiv.css("border-bottom-left-radius", "10px");
  var optionsDiv = $(document.createElement("div")).addClass("optionsDiv");
  gmkick.forEach(function(val) {
    if (
      val != "chkremovePosts" &&
      val != "chkremoveThreads" &&
      val != "chkenableToggleRemovedQuotes" &&
      val != "chkPassAufDasKartenhausVonAndreasAuf" &&
      val != "chkDubs"
    )
      optionsDiv.html(optionsDiv.html() + '<div class="unblockUser" data-user="' + val + '" style="cursor: pointer;" title="">[' + val + "]</div>");
  });
  optionsDiv.html(optionsDiv.html().substr(0, optionsDiv.html().length - 2));

  hiddenDiv.html(optionsDiv);

  var closeOptions = $(document.createElement("div")).addClass("hideOptions");
  closeOptions.css("position", "absolute");
  closeOptions.css("right", "0");
  closeOptions.css("top", "0");
  closeOptions.css("padding", "5px");
  closeOptions.css("font-size", "16px");
  closeOptions.css("cursor", "pointer");
  closeOptions.html("X");
  hiddenDiv.append(closeOptions);
  $("body").append(hiddenDiv);
}
if($("box>forum-user").length ===0){
    //$(".box-content.overflow-visible").css("border","3px solid red");
    $(".forum-user-info > a").each(function(i,e){
 $(e).after(
      $(document.createElement("a"))
        .addClass("blockUser")
        .attr("data-user", $(e).text())
        .css("cursor", "pointer")
        .text("block")
    );
    $(e).after($(document.createElement("span")).html(" &nbsp;&ndash;"));
    });
}
$(".blockUser").click(function(){
    var user = $(this).attr("data-user");
    if(confirm("Block " + user + "?")){
        return blockUser(user);
    }
    return false;
});
function blockUser(user){
    GM_setValue(user,1);
    location.reload();
}
function kickPosts(){
    $.each(gmkick,function(i,v){
        console.log(v)
          $(".forum-user:contains(" + v + ")")
        .parent()
        .parent()
        .parent()
        .parent()
        .parent()
              .remove()
    });
}
$(".showOptions, .hideOptions").click(function() {
  console.log("options!");
  $(".optionsContainer").toggle(0);
});
$(".unblockUser").click(function() {
  var user = $(this).attr("data-user");
  if (confirm("Unblock " + user + "?")) {
    return unblockUser(user, $(this));
  }
  return false;
});
function unblockUser(user, elem) {
  GM_deleteValue(user, 1);
  elem.remove();
}
function getPosition(element) {
    var xPosition = 0;
    var yPosition = 0;

    while(element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }

    return { x: xPosition, y: yPosition };
}