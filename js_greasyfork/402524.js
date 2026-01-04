// ==UserScript==
// @name        Danbooru hover preview
// @namespace   makamys
// @description hover over pics to preview them à la 4chan X
// @match       *://*.donmai.us/*
// @version     8
// @grant       none
// @license     Unlicense
// @downloadURL https://update.greasyfork.org/scripts/402524/Danbooru%20hover%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/402524/Danbooru%20hover%20preview.meta.js
// ==/UserScript==

// from http://greasemonkey.win-start.de/patterns/add-css.html
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle(`
#ihover {
  position: fixed;
  max-height: 100%;
  z-index: 10000;
  pointer-events: none;
}
`);

function main(){
  let ihover = null;
  let urlCache = {};

  $("body").prepend(`
<div id="hoverUI"></div>
`);

  function installListener(thumbs){
    thumbs.mouseenter(function(event){
      $("#hoverUI").append(`<img id="ihover"></img>`);
      ihover = $("#ihover");

      let article = $(this).closest("article");
      let id = article.attr("data-id");
      let elem = $(article).find(".post-preview-image")[0];

      let previewURL = urlCache[id];

      ihover.attr("data-id", id)
      if(!previewURL){
        $.ajax({
          dataType: "json",
          url: "https://danbooru.donmai.us/posts/" + id + ".json",
          success: function(data) {
            previewURL = data["large_file_url"];
            urlCache[id] = previewURL;
            if(ihover.attr("data-id") == id) {
              ihover.attr("src", previewURL);
            }
          }
        });
      } else {
        ihover.attr("src", previewURL);
      }
    });

    thumbs.mouseleave(function(event){
      $("#hoverUI").empty();
    });
  }

  installListener($("article img.post-preview-image"));

  new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      installListener($(mutation.addedNodes).filter("article").find("img.post-preview-image"));
    });
  }).observe(document.querySelector('.posts-container'), {childList: true});

//TODO
//  thumbs.mousemove(function(event){
//    console.log(ihover.width());
//
//    let x = event.pageX + (event.pageX > $(window).width() / 2 ? -0 : 0);
//
//    ihover.css({left: x});
//  });
}

// Inject our main script (workaround for Greasemonkey not finding the page's jQuery instance otherwise)
var script = document.createElement('script');
script.type = "text/javascript";
script.textContent = '(' + main.toString() + ')();';
document.body.appendChild(script);
