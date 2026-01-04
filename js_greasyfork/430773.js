// ==UserScript==
// @name        Bitchute - Extras
// @author      "Dilxe"
// @namespace   https://github.com/Dilxe/
// @version     0.91.1
// @icon        https://i.imgur.com/iarBFdu.png
// @description Adds extra functionality to Bitchute, such as: mark watched videos and allow to block comments based on username and content.
// @match       https://www.bitchute.com/*
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @grant       GM.getResourceUrl
// @grant       GM_addStyle
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require     https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/430773/Bitchute%20-%20Extras.user.js
// @updateURL https://update.greasyfork.org/scripts/430773/Bitchute%20-%20Extras.meta.js
// ==/UserScript==

// Others //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// For Tampermonkey    https://github.com/Tampermonkey/tampermonkey/issues/848#issuecomment-569205508
/* globals, jQuery, $, waitForKeyElements */

// Mutation Observer ------------------------------------------------------------------------------------------------------------------------------
//// Dynamically detects changes to the HTML. It's used here to, when the user scrolls through the videos list, mark the older videos as they load.
//// Source: https://stackoverflow.com/a/11546242

function detectMutation()
{ 
  if (document.getElementById("mutation-detector") == null)
  {
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    if(!document.URL.includes('video'))
    {
      var observer = new MutationObserver(
        function(mutations, observer)
        {
          // fired when a mutation occurs
          //console.log(mutations, observer);
          markWatchedVideos();
          // ...
        });

      var configMain = { attributes: false, childList: true, characterData: false, subtree: false };

      // define what element should be observed by the observer
      // and what types of mutations trigger the callback

      if (document.URL.includes('channel') == true) { observer.observe(document.getElementsByClassName("channel-videos-list")[0], configMain); }
      
      else if (document.URL.length <= 25) { observer.observe(document.getElementsByClassName("row auto-clear")[1], configMain); }
      
    }


        //Day-Night theme change detector

        var observerTheme = new MutationObserver(
          function(mutations, observerTheme)
          {
            if (document.getElementById("night-theme").classList == "user-link") 
            {
              document.getElementById("btn-debug").setAttribute("style","position:absolute; top:29%; right:25%; background-color:#dee0dd; color:#4d4b4e; font-size: 0.9vw; width: 12vw; height: 1.9vw; outline: #d2d2d2 outset 2px;");
              document.getElementById("txt-amount-removed-comments").setAttribute("style","display:block; position:absolute; bottom:1%; right:0.5%; width:49.3%; height:88%; overflow:auto; background-color:#dee0dd; color:#4d4b4e; border:4px solid #4d4b4e; text-align:center; z-index:inherit;");
          		document.getElementById("div-amount-removed-comments").setAttribute("style","position:absolute; top:1%; right:0.5%; background-color:#dee0dd; color:#4d4b4e; font-size:1vw; font-weight:bold; width:49.3%; height:11%; border:4px solid #4d4b4e; line-height:275%;");
            	document.getElementById("div-debug").setAttribute("style","display:none; position:absolute; top:69%; left:19.9%; width:60.1vw; height:30vw; background-color:#dee0dd; color:#4d4b4e; text-align:center; z-index:inherit;");
            	document.getElementById("txt-debug-list").setAttribute("style","display:block; position:absolute; bottom:-1%; left:-1%; width:102%; height:92%; overflow:auto; background-color:#dee0dd; color:#4d4b4e; border:4px solid #4d4b4e; text-align:center; z-index:inherit;");
            	document.getElementById("div-debug-editable-list").setAttribute("style","display:block; position:absolute; top:1%; left:0.5%; width:49.3%; height:98%; background-color:#dee0dd; color:#4d4b4e; border:4px solid #4d4b4e; text-align:center; z-index:inherit;");
            	document.getElementById("btn-save-list").setAttribute("style","position:absolute; top:1.3%; left:61.5%; background-color:#dee0dd; color:#4d4b4e; font-size:0.9vw; width:11vw; height:1.9vw; outline: #d2d2d2 outset 2px;");
            	document.getElementById("div-marked-videos-title").setAttribute("style","position:absolute; top:-1%; left:-1%; background-color:#dee0dd; color:#4d4b4e; font-size:0.9vw; font-weight:bold; line-height:275%; border:4px solid #4d4b4e; width:61.7%;");
              
              for (commentNum = 0; commentNum < document.getElementsByClassName('comment-wrapper').length; commentNum++)
              {
                document.getElementById("menu_" + commentNum).setAttribute("style","display:inherit; position:relative; background-color:rgb(238, 238, 238); text-align:center; font-size:.9em; line-height:inherit; opacity:0.75; border: outset; margin: auto; width: 85px; border-radius: 15px;");
              }
            }
            
            else 
            {
              document.getElementById("btn-debug").setAttribute("style","position:absolute; top:29%; right:25%; background-color:#211f22; color:#908f90; font-size: 0.9vw; width: 12vw; height: 1.9vw; outline: none;");
              document.getElementById("txt-amount-removed-comments").setAttribute("style","display:block; position:absolute; bottom:1%; right:0.5%; width:49.3%; height:88%; overflow:auto; background-color:#211f22; color:#908f90; border:4px solid white; text-align:center; z-index:inherit;");
          		document.getElementById("div-amount-removed-comments").setAttribute("style","position:absolute; top:1%; right:0.5%; background-color:#211f22; color:#908f90; font-size:1vw; font-weight:bold; width:49.3%; height:11%; border:4px solid white; line-height:275%;");
            	document.getElementById("div-debug").setAttribute("style","display:none; position:absolute; top:69%; left:19.9%; width:60.1vw; height:30vw; background-color:#211f22; color:#908f90; text-align:center; z-index:inherit;");
            	document.getElementById("txt-debug-list").setAttribute("style","display:block; position:absolute; bottom:-1%; left:-1%; width:102%; height:92%; overflow:auto; background-color:#211f22; color:#908f90; border:4px solid white; text-align:center; z-index:inherit;");
            	document.getElementById("div-debug-editable-list").setAttribute("style","display:block; position:absolute; top:1%; left:0.5%; width:49.3%; height:98%; background-color:#211f22; color:#908f90; border:4px solid white; text-align:center; z-index:inherit;");
            	document.getElementById("btn-save-list").setAttribute("style","position:absolute; top:1.3%; left:61.5%; background-color:#211f22; color:#908f90; font-size:0.9vw; width:11vw; height:1.9vw; outline: none;");
            	document.getElementById("div-marked-videos-title").setAttribute("style","position:absolute; top:-1%; left:-1%; background-color:#211f22; color:#908f90; font-size:0.9vw; font-weight:bold; line-height:275%; border:4px solid white; width:61.7%;");
            
              for (commentNum = 0; commentNum < document.getElementsByClassName('comment-wrapper').length; commentNum++)
              {
                document.getElementById("menu_" + commentNum).setAttribute("style","display:inherit; position:relative; background-color:rgb(23, 23, 23); text-align:center; font-size:.9em; line-height:inherit; opacity:0.5; border: outset; margin: auto; width: 85px; border-radius: 15px;");
              }
            }
          }
        );


        var configTheme = { attributes: true, childList: false, characterData: false, subtree: false };

        observerTheme.observe(document.getElementById("night-theme"), configTheme);
  }
  
  elementForDataDisplay("","div","mutation-detector","display:none;",'nav-top-menu');
}






// Detect URL Change ---------------------------------------------------------
//// This is to avoid having to refresh the page (F5) or open in a new window.
/*--- Note, gmMain () will fire under all these conditions:
    1) The page initially loads or does an HTML reload (F5, etc.).
    2) The scheme, host, or port change.  These all cause the browser to
       load a fresh page.
    3) AJAX changes the URL (even if it does not trigger a new HTML load).
    Source: https://stackoverflow.com/a/18997637
*/
var fireOnHashChangesToo    = true;
var pageURLCheckTimer       = setInterval (
    function ()
  	{
													
        if (this.lastPathStr  !== location.pathname || this.lastQueryStr !== location.search || (fireOnHashChangesToo && this.lastHashStr !== location.hash))
        {
            this.lastPathStr  = location.pathname;
            this.lastQueryStr = location.search;
            this.lastHashStr  = location.hash;
          
          	
                // [For Debugging] - If the message (of the amount of removed comments) exists, it'll be removed.
                if(document.getElementById('div-debug') != null)
                {
                  document.getElementById('div-debug').remove();
                  document.getElementById('btn-debug').remove();
                }
          
          
            window.addEventListener ("hashchange", gmMain, false);
          	document.addEventListener("visibilitychange", gmMain);	//https://stackoverflow.com/questions/1760250/how-to-tell-if-browser-tab-is-active#comment111113309_1760250
          	gmMain();
          
        }
    }    , 111);




function gmMain()
{
	if (document.getElementById("loader-container").style.display == "none")
  {
    
    if(document.URL.includes('video') == true)
    {
      /* waitForKeyElements() - Needs jQuery.
      It's used for the same reasons one would use setTimeout, while being more exact due to only running the code after the chosen elements are loaded.
      Source: https://stackoverflow.com/a/17385193			//			https://stackoverflow.com/questions/16290039/script-stops-working-after-first-run */


      waitForKeyElements ( "#comment-list",       filterComments );
      waitForKeyElements ( ".sidebar-video",   	  markWatchedVideos() );
    }

    else if(document.URL.includes('channel') == true)
    {
      waitForKeyElements ( "#channel-videos",    markWatchedVideos() );
    }

    else
    {
      detectMutation();  
      waitForKeyElements ( ".row.auto-clear",    markWatchedVideos() );
    }
  }
  
  else
  {
    setTimeout(gmMain, 1000);
  }
}






// Main //

// Mark Watched Videos ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function markWatchedVideos()
{
  let allVideos = [];	// Creates an array to put all the videos on the page. Needed because channel videos have different classes.
  const	globalVideos = document.getElementsByClassName('video-card'); 	 	 	 	 	 	// Fetches the videos from the element
  const channelVideos = document.getElementsByClassName('channel-videos-image-container'); 	// Same as above but for the channels
  Array.prototype.push.apply(allVideos, Array.from(globalVideos)); 	 	 	 	 	 	 // Add the videos to the array
  Array.prototype.push.apply(allVideos, Array.from(channelVideos)); 	 	 	 	 	 // Same as above but for the channels
  let totalNumVideos = allVideos.length; 	 	 	 	 	 	 	 	 	 	 	  	// Counts the total nº of videos
  let watchedVideos = await GM.getValue("videoHREF"); 	 	 	 	 	 	 	 	 // Loads the list of watched videos

  
  // If it's the first time using the script it would get an undefined error without this.
  if (! watchedVideos)
  {
    await GM.setValue("videoHREF", "");
  }
  
  // Checks the video count. If bigger than X threshold, remove an older video.
  if (watchedVideos.split("|").length > 4000)
  {
    let olderVideoRemoved = watchedVideos.replace("|" + watchedVideos.split("|")[1],"");
    await GM.setValue("videoHREF", olderVideoRemoved);
  }

  
  
  // Checks if it's a video page, has been watched and, therefore on GM(GreaseMonkey)'s list. If it's not, gets added.
  if (document.URL.includes('video') == true && watchedVideos.indexOf(document.baseURI.split("/")[4]) == -1)
  {
    let markCurrentVideo = watchedVideos + '|' + document.baseURI.split("/")[4];
    await GM.setValue("videoHREF", markCurrentVideo);
  }



  // Checks video by video whether they're watched, if so, marks.
  for (videoNum = 0; videoNum < totalNumVideos; videoNum++)
  {
    // If it's in the list, add CSS
    if (watchedVideos.match(allVideos[videoNum].children[0].pathname.slice(7,allVideos[videoNum].children[0].pathname.length-1)) != null)
    {
      const div = document.createElement('thumbnailOverlay');
      div.style.background = '#2c2a2d';
      div.style.borderRadius = '2px';
      div.style.color = '#908f90';
      div.innerHTML = 'WATCHED';
      div.style.fontSize = '11px';
      div.style.right = '4px';
      div.style.padding = '3px 4px 3px 4px';
      div.style.position = 'absolute';
      div.style.top = '4px';
      div.style.fontFamily = 'Roboto, Arial, sans-serif';


      if (allVideos[videoNum].className == "video-card")
      {
        document.getElementsByClassName('video-card-image')[videoNum].style.opacity = '0.25';
      }

      else if (allVideos[videoNum].className == "channel-videos-image-container")
      {
        document.getElementsByClassName('channel-videos-image')[videoNum-globalVideos.length].style.opacity = '0.25';
      }

      allVideos[videoNum].appendChild(div);
    }
  }
}

// Mark Watched Videos - END //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






// Filter Comments by Word ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function filterComments()
{  
  if(document.getElementById('div-amount-removed-comments') == null && document.getElementById("menu_0") == null)
  {
    const comment = document.getElementsByClassName('comment-wrapper');              		// Fetches the comments from the element
    const totalNumComments = comment.length;												// Counts nº of comments
    let regexWholeWord = /\b(example2|example1)\b/gi;
    let regexCombLetters = /(example word|\[comment removed\]|W­w­w|3vvs)/gi;
    let userWhiteList = /(exampleUser4|exampleUser3)/g;
  	let userBlackList = await GM.getValue("blackList");										// Loads the list of watched videos

    let themeColor; let themeTxtClr; let thmBorderClr; let thmBtnOutline;
    let borderTopRemoved = false;

        // [For Debugging] //////////////////////////////////////////////////////////////////////////////////////////
        let allComments = "";			// Variable where the removed comments are stored.
        let nRemoved = 0;					// Counts removed comments.



            if(document.getElementById("night-theme").classList == "user-link") 
            {
              themeColor = "#dee0dd"; themeTxtClr = "#4d4b4e"; thmBorderClr = "#4d4b4e"; thmBtnOutline = "outline: #d2d2d2 outset 2px;";
              createDebug("blackList",userBlackList,"Blacklist: ", " Users", themeColor, themeTxtClr, thmBorderClr, thmBtnOutline);
            }

            else
            {
              themeColor = "#211f22"; themeTxtClr = "#908f90"; thmBorderClr = "white"; thmBtnOutline = "outline: none;";
              createDebug("blackList",userBlackList,"Blacklist: ", " Users", themeColor, themeTxtClr, thmBorderClr, thmBtnOutline);
            }



      	// If it's the first time using the script it would get an undefined error without this.
        if (document.getElementById("txt-debug-list").value == "undefined")
        {
          await GM.setValue("blackList", "/(exampleUser1)/g");
          alert("Script initialized. Please refresh page.");
        }

    let parsedBlacklist = new RegExp(document.getElementById("txt-debug-list").value.substr(1).slice(0,-2),"g");
		
    // Checks comment by comment whether they contain any word from the regex lists; if they do those comments'll be removed.
    for (commentNum = 0; commentNum < totalNumComments; commentNum++)
    {
      const innerHtmlUser = comment[commentNum].innerHTML.split(">")[6].split("<")[0];
      const textContentComment = comment[commentNum].getElementsByTagName("p")[0].textContent;

      
      if (innerHtmlUser.match(parsedBlacklist) != null && comment[commentNum].style.display != 'none' && innerHtmlUser.match(userWhiteList) == null ||
         comment[commentNum].getElementsByClassName("reply-to").length != 0 &&
          comment[commentNum].getElementsByClassName("reply-to")[0].textContent.match(parsedBlacklist) != null)
      {
        // Removes comment
        if (comment[commentNum].parentNode.parentNode.className != "child-comments")
        {
        	comment[commentNum].parentNode.style.display = 'none';
        }
        
        else
        {
        	comment[commentNum].style.display = 'none';
        }

        
            // [For Debugging - Lists all removed comments and the reason for their blocked state] //////////////////////////////////////////////////////////
        		if (comment[commentNum].getElementsByClassName("reply-to").length != 0 &&
                comment[commentNum].getElementsByClassName("reply-to")[0].textContent.match(parsedBlacklist) != null)
            {
              allComments += '\n' + commentNum + ' - innerHTML\n\nUser [ ' + innerHtmlUser + ' ]\n\n * \n\nReason (reply-to): ' +
                comment[commentNum].children[2].innerText.split(comment[commentNum].children[2].children[0].textContent)[1] +
                '\n\n\n' + '-'.repeat(60) + '\n' + '-'.repeat(60) + '\n\n';
            }
        
        		else
            {
              allComments += '\n' + commentNum + ' - innerHTML\n\nUser [ ' + innerHtmlUser + ' ]\n\n * \n\nReason (userBlackList): ' +
                innerHtmlUser.match(parsedBlacklist) + '\n\n\n' + '-'.repeat(60) + '\n' + '-'.repeat(60) + '\n\n';
            }

            nRemoved += 1;
      }



      else if (textContentComment.match(regexWholeWord) != null && comment[commentNum].style.display != 'none' && innerHtmlUser.match(userWhiteList) == null ||
          textContentComment.match(regexCombLetters) != null && comment[commentNum].style.display != 'none' && innerHtmlUser.match(userWhiteList) == null)
      {

        // Removes comment
        if (comment[commentNum].parentNode.parentNode.className != "child-comments") { comment[commentNum].parentNode.style.display = 'none'; }
        else { comment[commentNum].style.display = 'none'; }


            // [For Debugging] //////////////////////////////////////////////////////////////////////////////////////////////////////
            allComments += '\n' + commentNum + ' - textContent\n\nUser [ ' + innerHtmlUser + ' ]\n\n"' +
              textContentComment + '"\n\n * \n\nReason (regexWholeWord): ' +
              textContentComment.match(regexWholeWord) + '\n\nReason (regexCombLetters): ' +
              textContentComment.match(regexCombLetters) + '\n\n\n' + '-'.repeat(60) + '\n' + '-'.repeat(60) + '\n\n';

            nRemoved += 1;
      }
    }



    // If original top comment is hidden, removes top-border of new top comment to match original's look.
    if(document.getElementById('comment-list').childElementCount > 1 && comment[0].parentNode.style.display == 'none')
    {
      for (cmmnt = 0; cmmnt < totalNumComments; cmmnt++)
      {
        if (borderTopRemoved == true) { break; }

        else if (document.getElementById('comment-list').children[cmmnt].style.display == '')
        {
          document.getElementById('comment-list').children[cmmnt].children[0].style.borderTop = 'none';
          borderTopRemoved = true;
        }
      }
    }
    
    
    // [Removed Comments List - For Debugging] - Creates a div, from the function (btnForDataDisplay), with the message below.
    
    
          // Comments list
          const commentsElementType = "div";
          const commentsElementId = "txt-amount-removed-comments";
          const commentsElementStyle = "display:block; position:absolute; bottom:1%; right:0.5%; width:49.3%; height:88%; overflow:auto; " +
                "background-color:" + themeColor + "; color:" + themeTxtClr + "; border:4px solid " + thmBorderClr + "; text-align:center; z-index:inherit;";
          const removedCommentsElementStyle = "position:absolute; top:1%; right:0.5%; background-color:" + themeColor + "; color:" + themeTxtClr +
                "; font-size:1vw; font-weight:bold; width:49.3%; height:11%; border:4px solid " + thmBorderClr + "; line-height:275%;";

          // List
          elementForDataDisplay(nRemoved + ' Comment(s) Removed!','div','div-amount-removed-comments',removedCommentsElementStyle,'div-debug');
          elementForDataDisplay(allComments,commentsElementType,commentsElementId,commentsElementStyle,'div-debug');
          document.getElementById(commentsElementId).scrollTo(0,0);

    
    
    // [W.I.P] - Adds a button to block comments.
    addCommentBlockBtn(totalNumComments);
    
  }
}

// Filter Comments by Word - END //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






// [For Debugging] - Create an element where the removed comments will be displayed (for debugging reasons) //////////////////////////////////////////////////////////
//// Instead of using JS's alert(), an element is instead created to display the comments.
//// Base source: https://stackoverflow.com/a/19020973

async function createDebug(GMvalue, cUserBlackList, listName, listOf, bgColor, txtColor, borderColor, btnOutline)
{
  if(document.getElementById("btn-debug") == null)
  {
     // Background div and btn for textarea & removed comments
     elementForDataDisplay( "", "div", "div-debug", "display:none; position:absolute; top:69%; left:19.9%; width:60.1vw; height:30vw; background-color:" + bgColor + "; " +
            "color:" + txtColor + "; text-align:center; z-index:inherit;", 'nav-top-menu' );
    
    
    // Debug Button
    const btnDebugInnerTxt = 'Debug Menu';
    const btnDebugId = "btn-debug";
    const btnDebugStyle = "position:absolute; top:29%; right:25%; background-color:" + bgColor + "; color:" + txtColor + "; font-size: 0.9vw; width: 12vw; height: 1.9vw;" + btnOutline;
    btnForDataDisplay(btnDebugInnerTxt,btnDebugId,btnDebugStyle,document.getElementById("div-debug"));

    const divTitleElementStyle = "position:absolute; top:-1%; left:-1%; background-color:" + bgColor + "; color:" + txtColor + "; font-size:0.9vw; font-weight:bold; " +
          "line-height:275%; border:4px solid " + borderColor + "; width:61.7%;";

    // Textarea
    const debugListElementType = "textarea";
    const debugListElementId = "txt-debug-list";
    const debugListElementPlacement = "div-debug-editable-list";
    const textDebugListElementStyle = "display:block; position:absolute; bottom:-1%; left:-1%; width:102%; height:92%; overflow:auto; " +
          "background-color:" + bgColor + "; color:" + txtColor + "; border:4px solid " + borderColor + "; text-align:center; z-index:inherit;";


    // Background div for textarea & button
    elementForDataDisplay( "", "div", "div-debug-editable-list", "display:block; position:absolute; top:1%; left:0.5%; width:49.3%; height:98%; background-color:" + bgColor + "; " +
          "color:" + txtColor + "; border:4px solid " + borderColor + "; text-align:center; z-index:inherit;", 'div-debug' );

    btnSaveList(bgColor, txtColor, btnOutline);
    // async onclick - source: https://stackoverflow.com/a/67509739
    document.getElementById("btn-save-list").onclick = async ()=>{alert("List saved!"); await GM.setValue(GMvalue, document.getElementById("txt-debug-list").value)};

    // Textarea with watched videos list
    elementForDataDisplay( cUserBlackList, debugListElementType, debugListElementId, textDebugListElementStyle, debugListElementPlacement );
    document.getElementById(debugListElementId).scrollTo(0,0);

    // Title Element
    elementForDataDisplay(listName + document.getElementById("txt-debug-list").innerHTML.split("|").length + listOf + " | Editable List","div","div-marked-videos-title",divTitleElementStyle,"div-debug-editable-list");
  }
  
  detectMutation();
}



function btnSaveList(btnBgColor, btnTxtColor, svBtnOutline)
{
  var btnElement = document.createElement("button");
  btnElement.setAttribute("id","btn-save-list");
  btnElement.setAttribute("style","position:absolute; top:1.3%; left:61.5%; background-color:" + btnBgColor + "; color:" + btnTxtColor + "; font-size:0.9vw; width:11vw; height:1.9vw;" + svBtnOutline);
  btnElement.innerHTML = "Save List";
  document.getElementById('div-debug-editable-list').appendChild(btnElement);
}


// Reusable block - Create an element where text is displayed
function elementForDataDisplay(textData,elementType,elementId,elementStyle,elementHtmlPlacement)
{
  var txtElemnt = document.createElement(elementType);
  txtElemnt.setAttribute("id",elementId);
  txtElemnt.setAttribute("style",elementStyle);
  txtElemnt.innerText = textData;
  document.getElementById(elementHtmlPlacement).appendChild(txtElemnt);
}


// Reusable block - Create the button to open/close the element where the text is displayed
function btnForDataDisplay(btnTxt, btnId, btnStyle, btnTargetId)
{
  var btnElement = document.createElement("button");
  btnElement.setAttribute("id",btnId);
  btnElement.setAttribute("style",btnStyle);
  btnElement.innerHTML = btnTxt;
  document.getElementById('nav-top-menu').appendChild(btnElement);
  
	document.getElementById(btnId).onclick = function (){if (btnTargetId.style.display !== "none") { btnTargetId.style.display = "none"; } else { btnTargetId.style.display = "block"; } };
}






// [W.I.P.] - Add button to each comment that opens a blocking menu /////////////////////////////////////////////////////////////////////////
//// Later on it'll allow the user to choose a way to block the comment (keywords or username), and do it on the front-end.

// Create comment's menu button
function addCommentBlockBtn(CommentAmmount)
{
  let btnColor;
  let btnOpacity;
  
  
  if(document.getElementById("night-theme").classList == "user-link") { btnColor = "rgb(238, 238, 238)"; btnOpacity = "0.75"; }
  else  { btnColor = "rgb(23, 23, 23)"; btnOpacity = "0.5";  }
  
  
  if(document.getElementsByClassName('comment-wrapper')[0].children[3].children[2].innerHTML.indexOf("btnMenuScript") == -1)
  {
    for (commentNum = 0; commentNum < CommentAmmount; commentNum++)
    {

      var menuElement = document.createElement("button");

      menuElement.setAttribute("id","menu_" + commentNum);
      menuElement.setAttribute("class","action");
      menuElement.setAttribute("style","display:inherit; position:relative; background-color:"+ btnColor + "; text-align:center; font-size:.9em; line-height:inherit; opacity:" + btnOpacity + "; border: outset; margin: auto; width: 85px; border-radius: 15px;");
      menuElement.innerText = "Block User";

  	  document.getElementsByClassName('comment-wrapper')[commentNum].children[3].children[2].appendChild(menuElement);

      blockComment(commentNum);
    }
  }

  else
  {
    return;
  }
}

// Create Comment's 'Block by Username' Button
async function blockComment(num)
{
  var blacklistStart = document.getElementById("txt-debug-list").value.substring(0,2);
  var blacklistAfterNew = document.getElementById("txt-debug-list").value.substring(2);

  // Display confirmation message
  var userName = document.getElementById("menu_" + num).parentElement.parentElement.parentElement.innerHTML.split('>')[6].slice(0,-6).toString();
  var sentence = "Block " + userName + "?";
  document.getElementById("menu_" + num).onclick = async ()=>{if (confirm(sentence) == true) {await GM.setValue("blackList", blacklistStart + userName + "|" + blacklistAfterNew); alert("Blocked! Please refresh page."); document.getElementsByClassName("comment")[num].style.display = "none";}};
}