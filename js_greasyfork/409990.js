// ==UserScript==
// @name        CGChat
// @namespace   BlaiseEbuth
// @match       https://www.codingame.com/*
// @grant       none
// @version     1.3.0
// @author      BlaiseEbuth
// @description The CodinGame web-chat without CodinGame.
// @icon https://i.imgur.com/E39sADi.png
// @downloadURL https://update.greasyfork.org/scripts/409990/CGChat.user.js
// @updateURL https://update.greasyfork.org/scripts/409990/CGChat.meta.js
// ==/UserScript==

/*
CGChat is an externalization as a standalone window of the CodinGame's web chat.
Copyright (C) 2020  BlaiseEbuth
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

'use strict'; // Be strict !

// A map to store the clicked links.
var openedLinks = {};

// A function that set "CGChat" as window's title.
function setTitle()
{
    // The window's title is defined by the page's <title> tag.
    var title = document.getElementsByTagName("title");

    if(title.length == 1) // If the page is loaded.
    {
        // We change the title.
        title[0].innerHTML = "CGChat";
    }
}

// A function that clean the connexion page.
function signin()
{
    // Select all elements that are not related to the connexion process:
    var nav = document.getElementById("navigation"); // The navigation bar.
    var cookies = document.getElementsByClassName("cg-cookies-banner"); // The cookies notification.
    var footer = document.getElementsByClassName("cg-login-form_footer"); // The login form footer that allow to create a new account.
    
    // Hide all of this uselles stuff.
    if(nav != null)nav.style.display = "none";
    if(cookies.length == 1)cookies[0].style.display = "none";
    if(footer.length == 1)footer[0].style.display = "none";
}

// A function that adapt the height of the textarea depending on its content.
function adjustMessageBox()
{
    // We get the textarea.
    var messBox = document.getElementById("chat-input");
  
    // We compute the height difference between the textarea and its content.
    var heightDiff = messBox.scrollHeight - messBox.clientHeight;
  
    // If there is a difference:
    if(heightDiff > 0)
    {
        // We get the CSS height value of the textarea.
        var messBoxStyle = window.getComputedStyle(messBox);
        var messBoxHeight = messBoxStyle.getPropertyValue("height");
        var intHeight = parseInt(messBoxHeight.substr(0, messBoxHeight.length - 2));
      
        // If this height is lesser than 150px (the max height we allow):
        if(intHeight < 150)
        {
            // We get the absolute bottom position of the messages zone.
            var messWrap = document.getElementsByClassName("messages-wrap")[0];
            var messWrapStyle = window.getComputedStyle(messWrap);
            var messWrapBot = messWrapStyle.getPropertyValue("bottom");

            // We compute the new height of the textarea and the one of the chat footer which contain it.
            var newHeight = intHeight + heightDiff + 10;
            var newBottom = parseInt(messWrapBot.substr(0, messWrapBot.length - 2)) + heightDiff + 10;

            // We adjust the size and the position of the elements.
            messWrap.style.bottom = newBottom.toString() + "px";
            document.getElementsByClassName("footer")[0].style.height = newBottom.toString() + "px";
            document.getElementsByClassName("send-form")[0].style.height = newHeight.toString() + "px";
            messBox.style.height = newHeight.toString() + "px";

            // We get the messages container.
            var messView = document.getElementById("messages");

            // And we set the scroll bar to the end.
            messView.scrollTop = messView.scrollHeight;
        }
    }
    
    // If the textarea is empty:
    if(messBox.value == "")
    {
        // We reset all the values to the defaults.
        document.getElementsByClassName("messages-wrap")[0].style.bottom = "125px";
        document.getElementsByClassName("footer")[0].style.height = "125px";
        document.getElementsByClassName("send-form")[0].style.height = "45px";
        messBox.style.height = "45px";
    }
}

// The function that manage all the chat-related actions.
function chat()
{
    // If we are in the application and jquerry is not loaded yet.
    if(window.isNwjs && document.getElementById("jquery") == null)
    {
        // We get the page's <head> element.
        var head = document.getElementsByTagName("head");

        if(head.length == 1) // If head is defined.
        {
            // We create a <script> element.
            var jquery = document.createElement("script");
            // With the "jquerry" id.
            jquery.id = "jquery";
            jquery.type = "text/javascript";
            jquery.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js";
            // And we add it to the page's <head>.
            head[0].appendChild(jquery);
        }
    }

    // We select the navigation bar and the site's content.
    var leftCol = document.getElementsByClassName("left-column");
    var nav = document.getElementById("navigation");

    // If they exist we delete them.
    if(leftCol.length == 1)leftCol[0].style.display = "none"; 
    if(nav != null)nav.style.display = "none";
    
    // We select the chat's containers.
    var wrapper = document.getElementsByClassName("chat-wrapper");
    var chat = document.getElementById("chat");

    // If they exist, we make them occupy the full window.
    if(wrapper.length == 1)wrapper[0].style.cssText = "width:100% !important"; 
    if(chat != null)chat.style.cssText = "display:flex !important";
    
    // We check if the chat is minimized.
    var small = document.getElementsByClassName("small-chat");

    // If yes, we maximize it.
    if(small.length == 1)small[0].click();

    // We select the chat itself.
    var chatClass = document.getElementsByClassName("chat");
    // And some of its elements which need to be removed:
    var discord = document.getElementsByTagName("cg-discord-disclaimer"); // The discord disclaimer.
    var hideWrapper = document.getElementsByClassName("hide-wrapper"); // The "Hide/Show" button.
    var help = document.getElementsByClassName("help-center"); // The help center.

    // We make the chat occupy 100% of its container.
    if(chatClass.length == 1)chatClass[0].style.width = "100%";
    // And we delete the useless stuff.
    if(discord.length == 1)discord[0].style.display = "none";
    if(hideWrapper.length == 1)hideWrapper[0].style.display = "none";
    if(help.length == 1)help[0].style.display = "none";

    // We get the settings popup.
    var settings = document.getElementsByClassName("settings-popup");

    if(settings.length == 1) // If it exist.
    {
        for(var i = 0; i < 3; i++)
        {
             // We delete the 3 first elements to only keep the theme settings.
            settings[0].children[i].style.display = "none";
        }
    }
    
    // If the refresh button does not exist yet.
    if(document.getElementById("refreshButton") == null)
    {   
        // We create it.
        var refreshButton = document.createElement("span");
        refreshButton.id = "refreshButton";
        refreshButton.style.cssText = 
          "display : inline-block;\
          width : 15px;\
          height : 15px;\
          margin-left : 8px;\
          background-image : url('https://i.imgur.com/rDqWLLQ.png');\
          background-size : contain;";
      
        // As well as a wrapper, for display purposes.
        var buttonWrapper = document.createElement("span");
        buttonWrapper.classList.add("button-wrapper");
        buttonWrapper.setAttribute("onClick", "window.location.reload(true)");
        buttonWrapper.title = "Reload";
      
        // We get the chat's settings bar.
        var settingsBar = document.getElementsByClassName("settings-bar");
      
        // And we add the button and its wrapper to it.
        buttonWrapper.appendChild(refreshButton);
        settingsBar[0].appendChild(buttonWrapper);
    }

    // We get the messages container.
    var messages = document.getElementById("messages");
    
    if(messages != null) // If it is defined.
    {
        // We make the messages occupy 100% of their container.
        messages.style.width = "100%";
        
        if(window.isNwjs) // If in the application.
        {
          // We select all the links in the messages.
          var links = messages.getElementsByTagName("a");

          if(links.length > 0) // If there's at least one link.
          {
              // We set a click event on each of those links.
              $('a[target=_blank]').on('click', function()
              {
                  // If the link is not in the openedLinks map.
                  if(!(this.href in openedLinks))
                  {
                      // We open it in a browser.
                      require('nw.gui').Shell.openExternal(this.href);
                      // And we add the URL in the map with a value of 100.
                      openedLinks[this.href] = 100;
                  }
                  return false;
              });
          }
        }
    }
  
    adjustMessageBox();
}

// The main() function.
var main = function()
{
    // If we don't know if we are in the application or the browser extension.
    if(window.isNwjs == null)
    {
        try
        {
            // We call a NWJS specific knack and if it is defined we set the 'isNwjs' variable to true.
            window.isNwjs = (typeof require('nw.gui') !== "undefined");
        }
        catch(e)
        {
            // If not, we set the 'isNwjs' variable to false;
            window.isNwjs = false;
        }
    }
  
    setTitle(); // Change the window's title.

    for(var l in openedLinks) // For each URL in the map.
    {
        openedLinks[l]--; // We decrease its countdown.

        if(openedLinks[l] == 0) // If the countdown reach 0.
        {
            // We delete the URL from the map.
            delete openedLinks[l];
        }
    }

    // Get the current URI.
    var path = window.location.pathname;

    if(path  == "/start") // If not logged in.
    {
        // Go to the connexion page.
        window.location.replace("/signin");
    }
    else if(path == "/signin") // If on the connexion page.
    {
        // Call the signin() function.
        signin();
    }
    else // In other cases.
    {
        // Lets chat !
        chat();
    }
}

// Repeat the main() function every 100ms.
setInterval(main, 100);
