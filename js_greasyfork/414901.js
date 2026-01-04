// ==UserScript==
// @name         Show My Pitchfork Score & Search in Spotify
// @namespace    http://your.homepage/
// @version      0.2
// @description  Get the score of each album on the overview of the reviews & get a link to search album on Spotify
// @author       CyanideCentral, Cisco
// @match        https://pitchfork.com/*
// @require http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414901/Show%20My%20Pitchfork%20Score%20%20Search%20in%20Spotify.user.js
// @updateURL https://update.greasyfork.org/scripts/414901/Show%20My%20Pitchfork%20Score%20%20Search%20in%20Spotify.meta.js
// ==/UserScript==

var scoreDiv= document.createElement('div');
scoreDiv.id='score';

$('body').append(scoreDiv);
$('#score').hide();

function addSAS() {

var recall= setInterval(function(){

    if($('a[href^="/reviews"] > .artwork').length >= 1) {
        
        clearInterval(recall);
        
        $('a[href^="/reviews"] > .artwork:not(.with-score)').each(function(){
            
            var artwork= $(this);

            artwork.addClass('with-score');
            
            var targetURL= artwork.parent().attr('href');

            $('#score').load(targetURL + ' .score', function() {
                
                var scoreThis= $('#score > span').text();
                
                var artist= $.trim(artwork.next().children('h1').text().replace(/[\s\']/g, '+'));
                
                var album= $.trim(artwork.next().children('h2').text().replace(/[\s\']/g, '+'));
                
                artwork.append('<span class="scrapped-score">' + scoreThis + '</span>');
                
                if(artwork.next().next('.p4ktag').length > 0) {
                    //artwork.children('.scrapped-score').addClass('bnm');
                }
                
                artwork.append('<span><a class="spotify-link" href="spotify:search:' + artist + '+' + album + '">&nbsp;</a></span>');

            }); // End of LOAD
            
        }); // End of EACH
        
    }
    
}, 1000);

} // End of Function addSAS()


function checkURLChange(URL) {

    if(URL !== document.location.href) {
        
        currURL= document.location.href;
        
        addSAS();
    }
    
} // End of function CheckURLChange()

// INIT
addSAS();

var currURL= document.location.href;
setInterval(function() {checkURLChange(currURL);}, 1000);

var cssRules= '<style>'

+ '.scrapped-score {'
+ 'line-height: 1;'
+ 'background-color: #fff;'
+ 'padding: 5px;'
+ 'position: absolute;'
+ 'font-size: 16px;'
+ 'top: 3px;'
+ 'left: 3px;'
+ 'border-radius: 4px;'
+ 'border: 2px solid;'
+ 'font-weight: bold;'
+ 'opacity: 0.9;'
// Show small labels over BNM covers, under page-header
+ 'z-index: 15;'
+ '}'

+ '.most-read .scrapped-score {'
+ 'left: 21px;'
+ '}'

+ '.spotify-link {'
+ 'background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAxNzggNjYiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDE3OCA2NiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGc+PHBhdGggZmlsbD0iIzY0OEYwMCIgZD0iTTE3OCw2MmMwLDIuMi0xLjgsNC00LDRINGMtMi4yLDAtNC0xLjgtNC00VjRjMC0yLjIsMS44LTQsNC00aDE3MGMyLjIsMCw0LDEuOCw0LDRWNjJ6Ii8+PGc+PHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTY2LjYsMjIuOXYtOS4zaDMuOGMxLjksMCwyLjksMS4zLDIuOSwyLjhjMCwxLjUtMS4xLDIuOC0yLjksMi44aC0yLjZ2My43SDY2LjZ6IE03Mi4xLDE2LjRjMC0xLjEtMC44LTEuOC0xLjktMS44aC0yLjV2My42aDIuNUM3MS4zLDE4LjIsNzIuMSwxNy40LDcyLjEsMTYuNHoiLz48cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNNzQuOCwyMi45di05LjNoMXY5LjNINzQuOHoiLz48cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNODIuMiwyMi45di0wLjhjLTAuNSwwLjYtMS4zLDAuOS0yLjIsMC45Yy0xLjEsMC0yLjQtMC44LTIuNC0yLjJjMC0xLjUsMS4yLTIuMiwyLjQtMi4yYzAuOSwwLDEuNywwLjMsMi4yLDAuOXYtMS4yYzAtMC45LTAuNy0xLjQtMS43LTEuNGMtMC44LDAtMS41LDAuMy0yLjEsMC45bC0wLjUtMC43YzAuNy0wLjgsMS42LTEuMSwyLjctMS4xYzEuNCwwLDIuNiwwLjYsMi42LDIuM3Y0LjdIODIuMnogTTgyLjIsMjEuNXYtMS4zYy0wLjQtMC41LTEuMS0wLjgtMS44LTAuOGMtMSwwLTEuNywwLjYtMS43LDEuNWMwLDAuOSwwLjcsMS41LDEuNywxLjVDODEsMjIuMyw4MS43LDIyLDgyLjIsMjEuNXoiLz48cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNODUuMSwyNC42YzAuMiwwLjEsMC40LDAuMSwwLjYsMC4xYzAuNSwwLDAuOC0wLjIsMS0wLjdsMC40LTFsLTIuOC02LjhoMS4xbDIuMiw1LjVsMi4zLTUuNWgxLjFsLTMuNCw4LjFjLTAuNCwxLTEuMSwxLjQtMiwxLjRjLTAuMiwwLTAuNiwwLTAuOC0wLjFMODUuMSwyNC42eiIvPjxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik05NS40LDE5LjVjMC0yLDEuMy0zLjUsMy4zLTMuNWMyLjEsMCwzLjMsMS42LDMuMywzLjVzLTEuMywzLjYtMy4zLDMuNkM5Ni43LDIzLjEsOTUuNCwyMS41LDk1LjQsMTkuNXogTTEwMSwxOS41YzAtMS40LTAuOC0yLjYtMi4yLTIuNmMtMS40LDAtMi4yLDEuMi0yLjIsMi42YzAsMS40LDAuOCwyLjYsMi4yLDIuNkMxMDAuMiwyMi4xLDEwMSwyMC45LDEwMSwxOS41eiIvPjxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xMDguNCwyMi45di00LjRjMC0xLjItMC42LTEuNi0xLjUtMS42Yy0wLjgsMC0xLjYsMC41LTIsMS4xdjQuOWgtMS4xdi02LjhoMS4xdjFjMC41LTAuNiwxLjQtMS4xLDIuNC0xLjFjMS40LDAsMi4xLDAuNywyLjEsMi4ydjQuOEgxMDguNHoiLz48cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNNjYuMyw0Ni4xbDItMi43YzEuNCwxLjUsMy41LDIuOCw2LjMsMi44YzIuOSwwLDQtMS40LDQtMi44YzAtNC4yLTExLjYtMS42LTExLjYtOC45YzAtMy4zLDIuOS01LjksNy4zLTUuOWMzLjEsMCw1LjYsMSw3LjUsMi44bC0yLDIuNmMtMS42LTEuNi0zLjctMi4zLTUuOC0yLjNjLTIsMC0zLjQsMS0zLjQsMi41YzAsMy44LDExLjYsMS40LDExLjYsOC45YzAsMy4zLTIuNCw2LjItNy43LDYuMkM3MC44LDQ5LjMsNjguMSw0Ny45LDY2LjMsNDYuMXoiLz48cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNODguNSw0Ni45djcuNWgtMy4ydi0yMGgzLjJ2MmMxLjEtMS40LDIuOC0yLjMsNC42LTIuM2MzLjgsMCw2LjQsMi44LDYuNCw3LjZzLTIuNyw3LjYtNi40LDcuNkM5MS4zLDQ5LjMsODkuNyw0OC40LDg4LjUsNDYuOXogTTk2LjMsNDEuNmMwLTIuOC0xLjYtNC44LTQuMS00LjhjLTEuNSwwLTMsMC44LTMuNywxLjl2NS43YzAuNywxLjEsMi4yLDIsMy43LDJDOTQuNyw0Ni41LDk2LjMsNDQuNSw5Ni4zLDQxLjZ6Ii8+PHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTEwMS45LDQxLjZjMC00LjIsMi44LTcuNiw3LjQtNy42czcuNCwzLjQsNy40LDcuNmMwLDQuMS0yLjgsNy42LTcuNCw3LjZTMTAxLjksNDUuOCwxMDEuOSw0MS42eiBNMTEzLjUsNDEuNmMwLTIuNi0xLjUtNC44LTQuMi00LjhjLTIuNywwLTQuMiwyLjItNC4yLDQuOGMwLDIuNiwxLjUsNC44LDQuMiw0LjhDMTEyLDQ2LjUsMTEzLjUsNDQuMiwxMTMuNSw0MS42eiIvPjxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xMjAuNiw0NS41di04LjRoLTIuNHYtMi43aDIuNHYtNGgzLjJ2NGgyLjl2Mi43aC0yLjl2Ny42YzAsMSwwLjUsMS43LDEuNCwxLjdjMC42LDAsMS4xLTAuMywxLjQtMC41bDAuOCwyLjRjLTAuNiwwLjUtMS41LDAuOS0yLjksMC45QzEyMS45LDQ5LjMsMTIwLjYsNDcuOSwxMjAuNiw0NS41eiIvPjxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0xMjkuMiwzMC43YzAtMS4xLDAuOS0yLDEuOS0yczIsMC45LDIsMnMtMC45LDEuOS0yLDEuOVMxMjkuMiwzMS44LDEyOS4yLDMwLjd6IE0xMjkuNSw0OC45VjM0LjRoMy4ydjE0LjVIMTI5LjV6Ii8+PHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTEzNy41LDQ4LjlWMzcuMWgtMi40di0yLjdoMi40di0wLjhjMC0zLjEsMS44LTUsNC42LTVjMS4zLDAsMi42LDAuMywzLjUsMS4zbC0xLjIsMS45Yy0wLjQtMC40LTEtMC42LTEuNi0wLjZjLTEuMywwLTIsMC44LTIsMi40djAuOGgyLjl2Mi43aC0yLjl2MTEuOEgxMzcuNXoiLz48cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMTQ1LjksNTEuOGMwLjMsMC4yLDAuOCwwLjIsMS4yLDAuMmMxLDAsMS43LTAuMywyLjEtMS4zbDAuNy0xLjdsLTYtMTQuN2gzLjRsNC4yLDEwLjlsNC4yLTEwLjloMy40bC03LDE3LjFjLTEsMi41LTIuNywzLjItNC45LDMuM2MtMC41LDAtMS40LTAuMS0xLjgtMC4yTDE0NS45LDUxLjh6Ii8+PC9nPjxnPjxnPjxnPjxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik0zMi41LDEyLjdjLTExLDAtMjAsOS0yMCwyMGMwLDExLDksMjAsMjAsMjBjMTEsMCwyMC05LDIwLTIwQzUyLjUsMjEuNyw0My42LDEyLjcsMzIuNSwxMi43eiBNNDEuNyw0MS42Yy0wLjQsMC42LTEuMSwwLjgtMS43LDAuNGMtNC43LTIuOS0xMC42LTMuNS0xNy42LTEuOWMtMC43LDAuMi0xLjMtMC4zLTEuNS0wLjljLTAuMi0wLjcsMC4zLTEuMywwLjktMS41YzcuNi0xLjcsMTQuMi0xLDE5LjQsMi4yQzQxLjksNDAuMiw0Miw0MSw0MS43LDQxLjZ6IE00NC4xLDM2LjFjLTAuNSwwLjctMS40LDEtMi4xLDAuNWMtNS40LTMuMy0xMy42LTQuMy0xOS45LTIuM2MtMC44LDAuMi0xLjctMC4yLTEuOS0xYy0wLjItMC44LDAuMi0xLjcsMS0xLjljNy4zLTIuMiwxNi4zLTEuMSwyMi41LDIuN0M0NC4zLDM0LjQsNDQuNiwzNS40LDQ0LjEsMzYuMXogTTQ0LjMsMzAuNWMtNi40LTMuOC0xNy4xLTQuMi0yMy4yLTIuM2MtMSwwLjMtMi0wLjMtMi4zLTEuMmMtMC4zLTEsMC4zLTIsMS4yLTIuM2M3LjEtMi4xLDE4LjgtMS43LDI2LjIsMi43YzAuOSwwLjUsMS4yLDEuNywwLjcsMi42QzQ2LjQsMzAuNyw0NS4yLDMxLDQ0LjMsMzAuNXoiLz48L2c+PC9nPjwvZz48L2c+PC9zdmc+);'
+ 'background-repeat: no-repeat;'
+ 'background-position: right top;'
+ 'background-size: 80px;'
+ 'padding: 0 0 20px 20px;'
+ 'width: 80px;'
+ 'height: 30px;'
+ 'position: absolute;'
+ 'top: 3px;'
+ 'right: 3px;'
+ 'z-index: 15;'
+ 'opacity: 0.9;'
+ 'transition: 200ms all'
+ '}'

+ '.spotify-link:hover {'
+ 'opacity: 1;'
+ '.spotify-link }'

+ '.most-read .spotify-link {'
+ 'right: 21px;'
+ '}'

+ '.bnm {'
+ 'color: #ef4135;'
+ '}'


+ '</style>';

$('head').append(cssRules);