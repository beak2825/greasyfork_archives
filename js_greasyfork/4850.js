// ==UserScript==
// @name        ZSMTurker's MTG Forum Image Video Spoilerizer (with labels mod)
// @description Spoilerize all images and videos in posts (except TO) on mturk-related forums: MTurkGrind, MTurkForum, and TurkerNation.
// @version     1.1.1c
// @author      ZSMTurker + clickhappier
// @namespace   mturkgrind
// @require     http://code.jquery.com/jquery-latest.min.js
// @match       http://www.mturkgrind.com/*
// @match       http://mturkgrind.com/*
// @match       http://www.mturkforum.com/*
// @match       http://mturkforum.com/*
// @match       http://www.turkernation.com/*
// @match       http://turkernation.com/*
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/4850/ZSMTurker%27s%20MTG%20Forum%20Image%20Video%20Spoilerizer%20%28with%20labels%20mod%29.user.js
// @updateURL https://update.greasyfork.org/scripts/4850/ZSMTurker%27s%20MTG%20Forum%20Image%20Video%20Spoilerizer%20%28with%20labels%20mod%29.meta.js
// ==/UserScript==

// v0.1c: modified by clickhappier to change generic 'Spoiler' designations to specify 'Image Spoiler' or 'Video Spoiler', and added mturkforum urls

// v1.0c: updated (with help from Lowlife) to handle both Xenforo and vBulletin forums; plus, improved handling of images inside links.


$( document ).ready( function() {
// xenforo version
    var postDivsXF = $(document).find('div[class*="messageContent"]');
    var imageArrayXF = $(postDivsXF).find('img:not([title])').not('img[src*="turkopticon"]').not('img[src*="data.istrack.in"]').not('img[onerror*="avatars"]');
    var videoArrayXF = $(postDivsXF).find('iframe');
  
    for (var i=0; i<imageArrayXF.length; i++)
    {
        if ( imageArrayXF.eq(i).parents('a').length )  // if the image has any parent elements that are 'a' links
        { 
            var linkUrl = imageArrayXF.eq(i).closest('a').attr('href');
            var linkContents = imageArrayXF.eq(i).closest('a').contents();   // http://stackoverflow.com/questions/170004/how-to-remove-only-the-parent-element-and-not-its-child-elements-in-javascript/170056#170056
            imageArrayXF.eq(i).closest('a').replaceWith(linkContents);       // ^ ctd
            imageArrayXF.eq(i).before('<div style="margin: 5px 20px 20px;">' + '<div class="smallfont" style="margin-bottom: 2px;">' +'<a href="'+linkUrl+'"><b>Image Spoiler:</b></a>' +'<input type="button" onclick="if (this.parentNode.parentNode.getElementsByTagName(\'div\')[1].getElementsByTagName(\'div\')[0].style.display != \'\') { this.parentNode.parentNode.getElementsByTagName(\'div\')[1].getElementsByTagName(\'div\')[0].style.display = \'\';this.innerText = \'\'; this.value = \'Hide\'; } else { this.parentNode.parentNode.getElementsByTagName(\'div\')[1].getElementsByTagName(\'div\')[0].style.display = \'none\'; this.innerText = \'\'; this.value = \'Show\'; }" style="margin: 0px; padding: 0px; width: 45px; font-size: 10px;" value="Show"></div><div class="alt2" style="border: 1px inset ; margin: 0px; padding: 6px;"><div style="display: none;"><br><img src="'+imageArrayXF.eq(i).attr('src')+'" border="0" alt="">'); 
        }
        else { imageArrayXF.eq(i).before('<div style="margin: 5px 20px 20px;">' + '<div class="smallfont" style="margin-bottom: 2px;">' +'<b>Image Spoiler:</b>' +'<input type="button" onclick="if (this.parentNode.parentNode.getElementsByTagName(\'div\')[1].getElementsByTagName(\'div\')[0].style.display != \'\') { this.parentNode.parentNode.getElementsByTagName(\'div\')[1].getElementsByTagName(\'div\')[0].style.display = \'\';this.innerText = \'\'; this.value = \'Hide\'; } else { this.parentNode.parentNode.getElementsByTagName(\'div\')[1].getElementsByTagName(\'div\')[0].style.display = \'none\'; this.innerText = \'\'; this.value = \'Show\'; }" style="margin: 0px; padding: 0px; width: 45px; font-size: 10px;" value="Show"></div><div class="alt2" style="border: 1px inset ; margin: 0px; padding: 6px;"><div style="display: none;"><br><img src="'+imageArrayXF.eq(i).attr('src')+'" border="0" alt="">'); }
        imageArrayXF.eq(i).after('<br></div></div></div>');
        imageArrayXF.eq(i).remove();
    }
    for (var i=0; i<videoArrayXF.length; i++)
    {
        videoArrayXF.eq(i).before('<div style="margin: 5px 20px 20px;">' + '<div class="smallfont" style="margin-bottom: 2px;">' +'<b>Video Spoiler:</b>' +'<input type="button" onclick="if (this.parentNode.parentNode.getElementsByTagName(\'div\')[1].getElementsByTagName(\'div\')[0].style.display != \'\') { this.parentNode.parentNode.getElementsByTagName(\'div\')[1].getElementsByTagName(\'div\')[0].style.display = \'\';this.innerText = \'\'; this.value = \'Hide\'; } else { this.parentNode.parentNode.getElementsByTagName(\'div\')[1].getElementsByTagName(\'div\')[0].style.display = \'none\'; this.innerText = \'\'; this.value = \'Show\'; }" style="margin: 0px; padding: 0px; width: 45px; font-size: 10px;" value="Show"></div><div class="alt2" style="border: 1px inset ; margin: 0px; padding: 6px;"><div style="display: none;"><br><iframe src='+videoArrayXF.eq(i).attr('src')+'>');
        videoArrayXF.eq(i).insertAfter('<br></div></div></div>');
        videoArrayXF.eq(i).remove();
    }
    
// vbulletin version
    var postDivsVB = $(document).find('div[id*="post_message"]');
    var imageArrayVB = $(postDivsVB).find('img:not([title])').not('img[src*="turkopticon"]').not('img[src*="data.istrack.in"]');
    var videoArrayVB = $(postDivsVB).find('iframe');
    
    for (var i=0; i<imageArrayVB.length; i++)
    {
        if ( imageArrayVB.eq(i).parents('a').length )  // if the image has any parent elements that are 'a' links 
        { 
            var linkUrl = imageArrayVB.eq(i).closest('a').attr('href');
            var linkContents = imageArrayVB.eq(i).closest('a').contents();   // http://stackoverflow.com/questions/170004/how-to-remove-only-the-parent-element-and-not-its-child-elements-in-javascript/170056#170056
            imageArrayVB.eq(i).closest('a').replaceWith(linkContents);       // ^ ctd
            imageArrayVB.eq(i).before('<div style="margin: 5px 20px 20px;">' + '<div class="smallfont" style="margin-bottom: 2px;">' +'<a href="'+linkUrl+'"><b>Image Spoiler:</b></a>' +'<input type="button" onclick="if (this.parentNode.parentNode.getElementsByTagName(\'div\')[1].getElementsByTagName(\'div\')[0].style.display != \'\') { this.parentNode.parentNode.getElementsByTagName(\'div\')[1].getElementsByTagName(\'div\')[0].style.display = \'\';this.innerText = \'\'; this.value = \'Hide\'; } else { this.parentNode.parentNode.getElementsByTagName(\'div\')[1].getElementsByTagName(\'div\')[0].style.display = \'none\'; this.innerText = \'\'; this.value = \'Show\'; }" style="margin: 0px; padding: 0px; width: 45px; font-size: 10px;" value="Show"></div><div class="alt2" style="border: 1px inset ; margin: 0px; padding: 6px;"><div style="display: none;"><br><img src="'+imageArrayVB.eq(i).attr('src')+'" border="0" alt="">'); 
        }
        else { imageArrayVB.eq(i).before('<div style="margin: 5px 20px 20px;">' + '<div class="smallfont" style="margin-bottom: 2px;">' +'<b>Image Spoiler:</b>' +'<input type="button" onclick="if (this.parentNode.parentNode.getElementsByTagName(\'div\')[1].getElementsByTagName(\'div\')[0].style.display != \'\') { this.parentNode.parentNode.getElementsByTagName(\'div\')[1].getElementsByTagName(\'div\')[0].style.display = \'\';this.innerText = \'\'; this.value = \'Hide\'; } else { this.parentNode.parentNode.getElementsByTagName(\'div\')[1].getElementsByTagName(\'div\')[0].style.display = \'none\'; this.innerText = \'\'; this.value = \'Show\'; }" style="margin: 0px; padding: 0px; width: 45px; font-size: 10px;" value="Show"></div><div class="alt2" style="border: 1px inset ; margin: 0px; padding: 6px;"><div style="display: none;"><br><img src="'+imageArrayVB.eq(i).attr('src')+'" border="0" alt="">'); }
        imageArrayVB.eq(i).after('<br></div></div></div>');
        imageArrayVB.eq(i).remove();
    }
    for (var i=0; i<videoArrayVB.length; i++)
    {
        videoArrayVB.eq(i).before('<div style="margin: 5px 20px 20px;">' + '<div class="smallfont" style="margin-bottom: 2px;">' +'<b>Video Spoiler:</b>' +'<input type="button" onclick="if (this.parentNode.parentNode.getElementsByTagName(\'div\')[1].getElementsByTagName(\'div\')[0].style.display != \'\') { this.parentNode.parentNode.getElementsByTagName(\'div\')[1].getElementsByTagName(\'div\')[0].style.display = \'\';this.innerText = \'\'; this.value = \'Hide\'; } else { this.parentNode.parentNode.getElementsByTagName(\'div\')[1].getElementsByTagName(\'div\')[0].style.display = \'none\'; this.innerText = \'\'; this.value = \'Show\'; }" style="margin: 0px; padding: 0px; width: 45px; font-size: 10px;" value="Show"></div><div class="alt2" style="border: 1px inset ; margin: 0px; padding: 6px;"><div style="display: none;"><br><iframe src='+videoArrayVB.eq(i).attr('src')+'>');
        videoArrayVB.eq(i).insertAfter('<br></div></div></div>');
        videoArrayVB.eq(i).remove();
    }
} );