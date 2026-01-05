// ==UserScript==
// @name         Song365Easy
// @namespace    http://www.tampermonkey.com/
// @version      0.1
// @description  Download files from Song365
// @author       LesserEvil
// @match        https://www.song365.biz/album/*
// @match        https://www.song365.me/album/*
// @match        https://www.song365.co/album/*
// @match        https://www.song365.mobi/album/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/18410/Song365Easy.user.js
// @updateURL https://update.greasyfork.org/scripts/18410/Song365Easy.meta.js
// ==/UserScript==


function SubmitTrackInfo(trackUrl, trackFilename, elementId)
{
    console.log('TrackUrl submitted: '+trackUrl);
    GM_xmlhttpRequest ( {
        method: "GET",
        url:    trackUrl,
        onload: function (response) {
            console.log('TrackUrl Loaded: '+trackUrl);
            var parser  = new DOMParser ();
            /* IMPORTANT!
            1) For Chrome, see
            https://developer.mozilla.org/en-US/docs/Web/API/DOMParser#DOMParser_HTML_extension_for_other_browsers
            for a work-around.

            2) jQuery.parseHTML() and similar are bad because it causes images, etc., to be loaded.
        */
            console.log("loaded html for song: "+trackFilename);
            var lines = response.responseText.split("\n");
            //console.log("Found lines: "+lines.length);
            var theLine = "";
            var realLink = "";
            for( lineIndex in lines )
            {
                var theLine = lines[lineIndex];
                var lqIndex = theLine.indexOf("var url = 'http://");
                // var streamIndex = theLine.indexOf("http://stream.song365.co");
                var hqIndex = theLine.indexOf("var hqurl = 'http://");
                var strLength = theLine.length;
                
                //if ( elementId == 1 )
//                {
  //                  console.log(theLine);
    //            }
                
                if ( lqIndex >= 0 )
                {
                    if ( realLink == "" )
                    {
                        realLink = theLine.substr(lqIndex+11, strLength-(lqIndex+14));
                    }
                }
                else if ( hqIndex >= 0 ) // subVal == "var hqurl = 'http://stre" )
                {
                    realLink = theLine.substr(hqIndex+13, strLength-(hqIndex+16));
                    break;
                }
//                var testLinkIndex=theLine.indexOf("download-link-hq");
                //if ( testLinkIndex >= 0 )
                //{
//                    if ( realLink == "" )
  //                  {
    //                    console.log("Found this: "+theLine);
      //              }
        //        }
//                else if ( streamIndex >= 0 )
                //{
//                    realLink = theLine.substr(streamIndex);
//                    break;
//                }
            }
            if ( realLink != "" )
            {
                console.log("Found link: "+realLink);
                var linkElement = document.querySelector("a.song-dl-"+elementId);
                if ( linkElement != null )
                {
                    linkElement.href = realLink;
                    linkElement.download = trackFilename;
                }
            }
            else
            {
                console.log("Unable to find real link!");
            }
            
            // var doc         = parser.parseFromString (response.responseText, "text/html");
            // var criticTxt   = doc.getElementsByClassName ("critic_consensus")[0].textContent;

            // $("body").prepend ('<h1>' + criticTxt + '</h1>');
        },
        onerror: function (e) {
            console.error ('**** error ', e);
        },
        onabort: function (e) {
            console.error ('**** abort ', e);
        },
        ontimeout: function (e) {
            console.error ('**** timeout ', e);
        }
    } );
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function hasClass(docElement, matchClass)
{
    return ((' ' + docElement.className + ' ').indexOf(' ' + matchClass + ' ') > -1)
}

function getElementByTagAndClass(docElement, tagName, matchClass)
{
    var elements = docElement.getElementsByTagName(tagName), i;
    for( i in elements )
    {
        if ( hasClass(elements[i], matchClass ))
        {
            return elements[i];
        }           
    }
    return null;
}

function getProfileItemValue(title)
{
    console.log('Getting profile item value for: '+title);
    var returnVal = "";
    profileItemList = document.querySelectorAll('div.profile-item');
    console.log('Found profile items: '+profileItemList.length);
    for( var index=0; index<profileItemList.length; index++ )
    {
        profileItemTitle = profileItemList[0].querySelector('em.profile-item-title').innerHTML;
        if ( profileItemTitle == title )
        {
            var valElement = profileItemList[0].querySelector('em.profile-item-value');
            if ( valElement.firstElementChild != null )
            {
                returnVal = valElement.firstElementChild.innerHTML; 
            }
            else
            {
                returnVal = valElement.innerHTML; // profileItemList[0].querySelector('em.profile-item-value').innerHTML;
            }
            break;
        }
    }
    console.log(profileItemTitle+' - '+returnVal);
    return returnVal;
    
}

function songItem(element,artistName)
{
    var numberVal = element.querySelector('div.number').innerHTML;
    var titleElement = element.querySelector('div.song-name');
    var songTitle = "";
    var fullSongFilename = "";
    
    var buttonsDiv = element.querySelector('div.buttons');
    var downloadLink = buttonsDiv.querySelector('a.download').href;
    
    if ( titleElement.firstElementChild != null )
    {
        songTitle = titleElement.firstElementChild.innerHTML.trim(); 
    }
    else
    {
        songTitle = titleElement.innerHTML.trim(); // profileItemList[0].querySelector('em.profile-item-value').innerHTML;
    }
    
    fullSongFilename = ("00" + numberVal).slice(-2) +" - "+artistName+" - "+songTitle+".mp3";
    songUrlId = "song-dl-"+numberVal;
    fullSongLink = "<a href='"+downloadLink+"' class='"+songUrlId+"' >"+fullSongFilename+"</a>";
    SubmitTrackInfo(downloadLink,fullSongFilename,numberVal);
    return fullSongLink; // element.innerHTML;
}

var insertPoint = null;

var elements = document.getElementsByTagName('a'), i;

for( i in elements )
{
    if ( i.href = '//www.liveinternet.ru/click' )
    {
        console.log('Found insert point!');
        insertPoint = i;
        break;
    }           
}

if ( insertPoint != null )
{
    var newDiv = document.createElement("div");
    newDiv.id = "courseDownload";
    newDiv.innerHTML = "Download Songs<br /><ul id='songDownloadList' class='songList'></ul>";
    
    // console.log(insertPoint);
    // console.log(insertPoint.parentNode);
    
    document.body.appendChild(newDiv); // ,insertPoint);

    var newDiv2 = document.createElement("div");
    newDiv2.id = "courseInfo";
    newDiv2.innerHTML = "----------<br />";
    insertAfter(newDiv2,newDiv);
}

artistSongs = document.querySelector('div.artist-songs');
artistName = getProfileItemValue('Artist Name:');
songList = document.querySelector('ul.songList');
elements = artistSongs.querySelectorAll('div.item');

songList.innerHTML = songList.innerHTML+"<li>"+artistName+"</li>\n"

    for( var index=0; index<elements.length; index++ )
    {
        songList.innerHTML = songList.innerHTML+"<li>"+songItem(elements[index],artistName)+"</li>\n"
    }



