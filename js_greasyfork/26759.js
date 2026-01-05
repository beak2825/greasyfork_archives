// ==UserScript==
// @name         GAB User Autocomplete
// @namespace    https://gab.ai/Jeremy20_9
// @version      0.1
// @description  User Autocomplete requirement 2 of 2: show a pop-up of users that match the @mention found at the end of the text entry
// @author       Jeremiah 20:9
// @match        https://gab.ai/home
// @grant        none
// @require      https://code.jquery.com/jquery-1.8.2.js
// @downloadURL https://update.greasyfork.org/scripts/26759/GAB%20User%20Autocomplete.user.js
// @updateURL https://update.greasyfork.org/scripts/26759/GAB%20User%20Autocomplete.meta.js
// ==/UserScript==
var followers = localStorage.getItem("gab-user-followers");
var following = localStorage.getItem("gab-user-following");
var availableTags = [];

if(followers)
{
    availableTags = availableTags.concat(JSON.parse(followers));
}
if(following)
{
    availableTags = availableTags.concat(JSON.parse(following));
}
var subset = [];
var itvcheck = -1;
var choiceidx = 0;
function checkfortxt()
{
    if($( ".composer--open > .composer__content > textarea" ).length > 0)
    {
        clearInterval(itvcheck);
        var ops = document.createElement("div");
        $(ops).css("position", "absolute");
        $(ops).css("left", "50px");
        $(ops).css("bottom", "0px");
        $(ops).css("width", "300px");
        $(ops).css("height", "100px");
        $(ops).css("background-color", "white");
        $(ops).css("box-shadow", "0px 0px 2px rgba(0,0,0,.5)");
        $(ops).css("display", "none");
        
        $(".composer__content").append(ops);
        
        $( ".composer__content > textarea" ).on("keydown", function(evt){
            var txt = $(".composer__content > textarea").val();
            
            var regex = new RegExp("^[a-zA-Z0-9_-]+$");
            var str = String.fromCharCode(!evt.charCode ? evt.which : evt.charCode);
            if (!regex.test(str) && evt.which != 38 && evt.which != 40 && evt.which != 13 && evt.which != 8 && evt.which != 46) {
                $(ops).css("display", "none");
                return;
            }
            else if(evt.which != 38 && evt.which != 40 && evt.which != 13 && evt.which != 8 && evt.which != 46)
                txt += evt.key;
            
            var rex = /@[A-Za-z]+[A-Za-z0-9_-]*$/g;
            var userinfo = rex.exec(txt);

            if(!userinfo)
            {
                $(ops).css("display", "none");
                return;
            }
            var user = userinfo[0].substr(1); // strip the "@"
            subset = [];
            for(var a = 0; a < availableTags.length && subset.length < 3; a++)
            {
                if(user.toLowerCase() == availableTags[a].atname.toLowerCase().substr(0,user.length) || user.toLowerCase() == availableTags[a].name.toLowerCase().substr(0,user.length))
                {
                    var found = false;
                    for(var s in subset)
                    {
                        if(availableTags[a].atname == subset[s].atname)
                        {
                            found = true;
                            break;
                        }
                    }
                    if(!found)
                        subset.push(availableTags[a]);
                }
            }
            if(subset.length === 0)
            {
                $(ops).css("display", "none");
                return;
            }
            else
            {
                $(ops).css("height", (subset.length * 30) + "px");
            }
            if(evt.which == 38) // up
            {
                evt.preventDefault();
                choiceidx--;
                if(choiceidx < 0)
                    choiceidx = subset.length - 1;
            }
            else if(evt.which == 40) //down
            {
                evt.preventDefault();
                choiceidx++;
                if(choiceidx >= subset.length)
                    choiceidx = 0;
            }
            else if(evt.which == 13)
            {
                evt.preventDefault();
                $(".composer__content > textarea").val(txt.substr(0, txt.length-user.length) + subset[choiceidx].atname + " ");
                $(ops).css("display", "none");
                return;
            }
            var render = "";
            for(var c = 0; c < subset.length; c++)
            {
                render += "<div style='padding:3px; position:absolute;width:300px;height:30px;top:" + (c * 30) + "px;";
                if(c == choiceidx)
                    render += "background-color:blue;color:white;";
                else
                    render += "color:black;";
                render += "'>";
                render += "<img src='"+subset[c].pic+"' style='height:24px; width:24px; border-radius:12px; margin-right:4px' align='left' />";
                render += "" + subset[c].name + "";
                render += "<span style='margin-left:4px;font-style:italic;opacity:0.7;'>@" + subset[c].atname + "</span>";
                render += "</div>";
            }
            $(ops).html(render);
            $(ops).css("display", "block");
        });
    }
}
$("document").ready(function(){
    itvcheck = setInterval(checkfortxt, 500);
});