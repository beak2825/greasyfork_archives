// ==UserScript==
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @name         Agarplus.io v2 Universal Edit
// @namespace    Agarplus.io v2 - Acydwarp
// @version      2.0.1
// @description  Agarplus v2 Universal Edit by Zephyr
// @author       Zephyr
// @match        http*://agar.io
// @include      http://*agar.io/agarplus.io
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/16784/Agarplusio%20v2%20Universal%20Edit.user.js
// @updateURL https://update.greasyfork.org/scripts/16784/Agarplusio%20v2%20Universal%20Edit.meta.js
// ==/UserScript==

// variables
var sideContainer = '.side-container.left-side'; //container to append skin changer menu
var leftContainer = '.forums'; //used to find left container
var loadCheckInterval = 100; //interval to check if container has loaded
var sideContainer2 = '.side-container'; //used to find side container
var Title = 'h2.aTitle'
var Tags = 'div#teamNameContainer.input-group'
var Ad = 'center'
var Leaderboard = 'div.header'
var Team = 'input#team_name.form-control'
var TagBox = 'input#team_name.form-control'
var Thing = 'h2.aTitle'
var ServerIP = 'input#serverIP.form-control'
var Button = 'button.btn.btn-nosx.cry'
var PS = 'div#privateServerBox.agario-panel.agario-side-panel.ps'
var Rem = 'hr'
var Title = ''
var This2 = ''
var This3 = 'div#treemempe.agario-panel.agario-side-panel.agarioProfilePanel'
var This4 = ''
var Rem3 = ''
var This5 = ''
var Over = ''

//check if page loaded
var ci = setInterval(function()
{
    if ($(sideContainer).has(leftContainer).has(sideContainer2).length)
    {
        clearInterval(ci);
        
        // Remove This2
        $(This2).replaceWith('');
        // Remove Over
        $(Over).replaceWith('');
        // Remove Rem3
        $(Rem3).replaceWith('');
        // Remove Thing
        $(Thing).replaceWith('<div align="middle"><script src="https://apis.google.com/js/platform.js" gapi_processed="true"></script><div id="___ytsubscribe_0" style="text-indent: 0px; margin: 0px; padding: 0px; border-style: none; float: none; line-height: normal; font-size: 1px; vertical-align: baseline; display: inline-block; width: 176px; height: 48px; background: transparent;"><iframe frameborder="0" hspace="0" marginheight="0" marginwidth="0" scrolling="no" style="position: static; top: 0px; width: 176px; margin: 0px; border-style: none; left: 0px; visibility: visible; height: 48px;" tabindex="0" vspace="0" width="100%" id="I0_1453914609634" name="I0_1453914609634" src="https://www.youtube.com/subscribe_embed?usegapi=1&amp;channelid=UCA3r61eTWHcdyczNuITm12A&amp;layout=full&amp;theme=dark&amp;count=default&amp;height=48&amp;width=163&amp;origin=http%3A%2F%2Fagar.io&amp;gsrc=3p&amp;ic=1&amp;jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.en.JpdoJPJ5hQs.O%2Fm%3D__features__%2Fam%3DAQ%2Frt%3Dj%2Fd%3D1%2Ft%3Dzcms%2Frs%3DAGLTcCMrDhGj8PwnRZ6lDn8FgkiuwDfUVw#_methods=onPlusOne%2C_ready%2C_close%2C_open%2C_resizeMe%2C_renderstart%2Concircled%2Cdrefresh%2Cerefresh%2Conload&amp;id=I0_1453914609634&amp;parent=http%3A%2F%2Fagar.io&amp;pfname=&amp;rpctoken=32074165" data-gapiattached="true"></iframe></div></div></div><font face="header"><font color="#0579fa"><h2 align="middle"><font size="6">Ʊniversal</font>');
        // Change Title
        $(Title).replaceWith('');
        // Remove This
        $(Rem).replaceWith('<div align="top" id="Radio" class="" style="display: block;"><audio style="margin-middle: 3px" controls="" autoplay="" src="http://192.99.0.170:5529/;"><a href="music.html" target="radio" align="middle">');
        // Remove This4
        $(This4).replaceWith('');
          
        
        
    }
    else
    {
        
        // Remove This2
        $(This2).replaceWith('');
        // Remove Over
        $(Over).replaceWith('');
        // Remove Rem3
        $(Rem3).replaceWith('');
        // Remove Thing
        $(Thing).replaceWith('<div align="middle"><script src="https://apis.google.com/js/platform.js" gapi_processed="true"></script><div id="___ytsubscribe_0" style="text-indent: 0px; margin: 0px; padding: 0px; border-style: none; float: none; line-height: normal; font-size: 1px; vertical-align: baseline; display: inline-block; width: 176px; height: 48px; background: transparent;"><iframe frameborder="0" hspace="0" marginheight="0" marginwidth="0" scrolling="no" style="position: static; top: 0px; width: 176px; margin: 0px; border-style: none; left: 0px; visibility: visible; height: 48px;" tabindex="0" vspace="0" width="100%" id="I0_1453914609634" name="I0_1453914609634" src="https://www.youtube.com/subscribe_embed?usegapi=1&amp;channelid=UCA3r61eTWHcdyczNuITm12A&amp;layout=full&amp;theme=dark&amp;count=default&amp;height=48&amp;width=163&amp;origin=http%3A%2F%2Fagar.io&amp;gsrc=3p&amp;ic=1&amp;jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.en.JpdoJPJ5hQs.O%2Fm%3D__features__%2Fam%3DAQ%2Frt%3Dj%2Fd%3D1%2Ft%3Dzcms%2Frs%3DAGLTcCMrDhGj8PwnRZ6lDn8FgkiuwDfUVw#_methods=onPlusOne%2C_ready%2C_close%2C_open%2C_resizeMe%2C_renderstart%2Concircled%2Cdrefresh%2Cerefresh%2Conload&amp;id=I0_1453914609634&amp;parent=http%3A%2F%2Fagar.io&amp;pfname=&amp;rpctoken=32074165" data-gapiattached="true"></iframe></div></div></div><font face="header"><font color="#0579fa"><h2 align="middle"><font size="6">Ʊniversal</font>');
        // Change Title
        $(Title).replaceWith('');
        // Remove This
        $(Rem).replaceWith('<div align="middle" id="Radio" class="" style="display: block;"><audio style="margin-middle: 3px" controls="" autoplay="" src="http://192.99.0.170:5529/;"><a href="music.html" target="radio" align="middle">');
        // Remove This4
        $(This4).replaceWith('');
          
        
        
     }
    
}, loadCheckInterval);
