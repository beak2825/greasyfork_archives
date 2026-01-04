// ==UserScript==
// @name         Replace Zaptroxix videos with his thumbnails
// @version      0.4
// @description  Zaptroxix uploads Ace Combat soundtracks with nice custom thumbnails, but all the videos have a generic logo once you click on them. This script swaps in the HD thumbnail of the video when it matches the username.
// @author       Bompi
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// @namespace https://greasyfork.org/users/432284
// @downloadURL https://update.greasyfork.org/scripts/394617/Replace%20Zaptroxix%20videos%20with%20his%20thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/394617/Replace%20Zaptroxix%20videos%20with%20his%20thumbnails.meta.js
// ==/UserScript==

function replace_video()
{
  var container;
  var replacement;
  var real_video;
  var update_observer;
  var removal_observer;
  var title_observer;

  if(document.getElementById("channel-name") == null || document.getElementById("channel-name").getElementsByTagName("a").length == 0)
  {
    setTimeout(replace_video, 100);
    return;
  }
  else
  {
    title_observer = new MutationObserver(function(mutationList, observer)
    {
      observer.disconnect();
      if(typeof update_observer !== "undefined") { update_observer.disconnect(); }
      if(typeof removal_observer !== "undefined") { removal_observer.disconnect(); }
      if(typeof container !== "undefined" && typeof replacement !== "undefined") { container.removeChild(replacement); }
      if(typeof real_video !== "undefined"){ real_video.style.display = "block"; }
      replace_video();
    });
    var title_element = document.getElementsByClassName("title style-scope ytd-video-primary-info-renderer")[0].getElementsByTagName("yt-formatted-string")[0];
    title_observer.observe(title_element, {"characterData": true, "childList": true});
  }

  if(document.getElementById("channel-name").getElementsByTagName("a")[0].innerText == "Zaptroxix")
  {
    container = document.getElementsByClassName("html5-video-container")[0];
    real_video = container.getElementsByTagName("video")[0];
    replacement = document.createElement("img");
    replacement.style.cssText = real_video.style.cssText;
    replacement.src = "https://img.youtube.com/vi/" + window.location.href.split("?v=")[1].split("&")[0] + "/maxresdefault.jpg";
    container.appendChild(replacement);
    real_video.style.display = "none";
    replacement.style.display = "inline-block";
    replacement.style.marginRight = "auto";
    replacement.style.marginLeft = "auto";
    replacement.style.position = "relative";

    update_observer = new MutationObserver(function(mutationList, observer)
    {
      for(let mutation of mutationList)
      {
        if(mutation.type == "attributes" && mutation.attributeName == "style")
        {
          replacement.style.cssText = real_video.style.cssText;
          real_video.style.display = "none";
          replacement.style.display = "inline-block";
          replacement.style.marginRight = "auto";
          replacement.style.marginLeft = "auto";
          replacement.style.position = "relative";
        }
      }
    });
    update_observer.observe(real_video, {attributes: true});

    removal_observer = new MutationObserver(function(mutationList, observer)
    {
      for(let mutation of mutationList)
      {
        if(mutation.type == "childList" && mutation.addedNodes.length > 0)
        {
          for(let element of mutation.addedNodes)
          {
            if(element.tagName == "VIDEO")
            {
              observer.disconnect();
              update_observer.disconnect();
              container.removeChild(replacement);
              title_observer.disconnect();
              replace_video();
            }
          }
        }
      }
    });
    removal_observer.observe(container, {childList: true})
  }
}

window.addEventListener('load', replace_video);