// ==UserScript==
// @id             xuboying
// @name           instagram in twitter
// @version        0.0.1
// @description    Display instgram picture in twitter
// @include        https://twitter.com/*
// @grant          GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/50045
// @downloadURL https://update.greasyfork.org/scripts/20772/instagram%20in%20twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/20772/instagram%20in%20twitter.meta.js
// ==/UserScript==
// set security.csp.enable = false in firefox
// support: https://stackoverflow.com/questions/5890110/greasemonkey-script-to-work-on-dynamically-loaded-posts-on-facebook
if (window.top != window.self) //don't run on frames or iframes
return;
function foo() {
  var elements = document.querySelectorAll('a');
  var re = new RegExp('instagram.com');
  for (i = 0; i < elements.length; i++) {
    var url = elements[i].getAttribute('data-expanded-url');
    if (url != null) {
      if (url.match(re)) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          onload:
          function (j) {
            return function (response) {
              if (response.status != 200) {
                return;
              }
              if (response.responseText == '') {
                return;
              }
              resp = response.responseText;
              var imgsrc = resp.match(/"display_src":\s*"(.*?)"/) [1];
              imgsrc = imgsrc.replace(/\\/g, '');
              if (!elements[j].parentNode.innerHTML.match(/replaced/)) {
                elements[j].parentNode.innerHTML += '<div id="replaced"><img width = "100%" src=\'' + imgsrc + '\'/></div>';
              } //console.log(img);

            }
          }(i)
        }
        );
      }
    }
  }
}
foo();
var PostsChangedByAJAX_Timer = '';
//--- Change this next line to find the correct element; sample shown.
var PostContainerNode = document.getElementById('timeline');
//var PostContainerNode = document.getElementsByClassName('stream');
PostContainerNode.addEventListener('DOMSubtreeModified', PageBitHasLoaded, false);
function PageBitHasLoaded(zEvent) {
  /*--- Set and reset a timer so that we run our code (LocalMain() ) only
        AFTER the last post -- in a batch -- is added.  Adjust the time if needed, but
        half a second is a good all-round value.
    */
  if (typeof PostsChangedByAJAX_Timer == 'number')
  {
    clearTimeout(PostsChangedByAJAX_Timer);
    PostsChangedByAJAX_Timer = '';
  }
  PostsChangedByAJAX_Timer = setTimeout(function () {
    foo();
  }, 555);
}
