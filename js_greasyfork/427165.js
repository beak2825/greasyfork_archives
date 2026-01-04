// ==UserScript==
// @author      Trip
// @version     0.2
// @name        Access All
// @description Enabled Downloading of mvideos that you are not meant tom be able to
// @date        2019 July 4
// @include     *pornhub.com/view_video.php*
// @run-at      document-idle
// @grant       none
// @license     Public Domain
// @icon        https://gmgmla.dm2301.livefilestore.com/y2pAKJYeZAp4tG23hG68x1mRuEUQXqb1MxdLbuqVnyyuHFxC7ra5Fc-tfq6hD-r9cNnVufT3egUHaimL547xDlESrOVmQsqNSJ5gzaiSccLYzo/ExtendPornHub-logo.png
// @namespace   649b97180995e878e7e91b2957ef3bbee0f840a0
// @downloadURL https://update.greasyfork.org/scripts/427165/Access%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/427165/Access%20All.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Access All Running");
    function parseScript(script_object)
    {
        if (script_object.innerText == null || !script_object.innerText.trim().startsWith("var flashvars"))
        {return null;} //typeof script_object == 'undefined' ||
        var str=script_object.innerText.trim();
        str=str.substring(str.indexOf("{"));
        var str_end = str.indexOf("var player_mp4_seek = \"ms\";");
        str=str.substring(0,str_end);
        str_end = str.lastIndexOf(";");
        str=str.substring(0,str_end);
        var json = null;
        try {
            json = JSON.parse(str)
        } catch (err) {
            location.reload();
            return null;
        }
        if (json!==null)
        {return json};
        return null;
    };

    function make_links(el,json)
    {
        var out ="";
        for (var i=0;i<json.mediaDefinitions.length;i++)
        {
            if (json.mediaDefinitions[i].videoUrl=="")
                {continue;}
            var a = document.createElement('a');
            var linkText = document.createTextNode(json.mediaDefinitions[i].quality);
            a.appendChild(linkText);
            a.title="Qal";
            a.href = json.mediaDefinitions[i].videoUrl;
            //a.download='Test.mp4' //html5
            el.appendChild(a);
            el.appendChild(document.createElement("br"));
        }
        return out;
    }

    //var all_doc;
    //all_doc = document.body.innerHTML;
    //console.log(all_doc);
    var scripts = document.scripts;
    var json = null;
    for ( var i=0; i<scripts.length; i++)
    {
        json=parseScript(scripts[i]);
        if (json!==null)
            {break;}
    }
    var div = document.createElement("DIV");
    //div.style="position: absolute; visibility: visible; left: 20px; top: 300px; height: 75px; width: 150px; z-index: 200;"
    div.style="display: block; visibility: visible; left: 10px; bottom: 10px; height: 75px; width: 30px; margin-left: 30px; z-index: 200;"
    var out = make_links(div,json);
    //replace video with links
    var elm_vid_parent = document.getElementById("player").parentNode;
    elm_vid_parent.parentNode.replaceChild(div,elm_vid_parent);
    console.log('Finished');
})()