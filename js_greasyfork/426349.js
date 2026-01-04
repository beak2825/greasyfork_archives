// ==UserScript==
// @name         Flashback hide
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Hide specific users on Flashback
// @author       Andreas Mustola
// @match        https://www.flashback.org/*
// @icon         https://www.google.com/s2/favicons?domain=flashback.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426349/Flashback%20hide.user.js
// @updateURL https://update.greasyfork.org/scripts/426349/Flashback%20hide.meta.js
// ==/UserScript==

// Permanent hide
// Ex: ["name1","name2","name3"];
var permanent_hide_array=[];

// Dynamic hide array, from hide clicks
var hide_array;
// Check if got saved cookie
var json_str = readCookie('hide_array');
if (json_str!=null)
{
    // parse json
    hide_array=JSON.parse(json_str);
}
else
{
    // No cookie, use permanent array
    hide_array=permanent_hide_array;
}

// Add invisible
var mybutton;
var invisible_hidden=readCookie("invisible");
if (invisible_hidden=="True")
{
    mybutton=Create_Button("[Hidden are invisible]");
    mybutton.onclick=function(){Toggle_Cookie("invisible",true)};

}
else
{
    mybutton=Create_Button("[Hidden are visible]");
    mybutton.onclick=function(){Toggle_Cookie("invisible",true)};
}

// Check for usernames
var p = document.getElementsByClassName('post-user-username');
var n;
var found_in_array=false;
var name_="";
var ii;
var i;
// Check if on main page
if (p.length>0)
{
    // On subject page
    for (i=p.length; --i>=0;)
    {
        n = p[i];
        found_in_array=false;
        name_="";
        //while(n.className.split(" ").indexOf(hide)==-1) {
        //    n = n.parentNode;
        //}
        if (n)
        {
            // Get name
            name_=n.innerHTML.trim();
            for(ii=0;ii < hide_array.length;ii++)
            {
                //if (n.innerHTML.indexOf(hide_array[ii])>-1)
                if (name_==hide_array[ii])
                {
                    found_in_array=true;
                    break;
                }
            }
            if (found_in_array==true)
            {
                // Check if show
                if (invisible_hidden=="False")
                {
                    // Create show button
                    mybutton=Create_Button("[Show " + name_ + "]",null,n.parentNode.parentNode.parentNode.parentNode.parentNode.previousElementSibling);
                    // Add name in button
                    mybutton.setAttribute("poster_name", name_);
                    // Remove name from array if clicked
                    mybutton.onclick=function(){RemoveFromHideArray(this.getAttribute("poster_name"))};
                    // Add line break
                    Create_Element("BR",n.parentNode.parentNode.parentNode.parentNode.parentNode.previousElementSibling);
                }
                //n.parentNode.removeChild(n.nextElementSibling);
                n.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(n.parentNode.parentNode.parentNode.parentNode.parentNode);
            }
            else
            {
                // Create hide button
                mybutton=Create_Button("[Hide " + name_ + "]",null,n.parentNode.parentNode.parentNode.parentNode.parentNode.previousElementSibling);
                // Add name in button
                mybutton.setAttribute("poster_name", name_);
                // Add name to array if clicked
                mybutton.onclick=function(){AddToHideArray(this.getAttribute("poster_name"))};
                // Add line break
                Create_Element("BR",n.parentNode.parentNode.parentNode.parentNode.parentNode.previousElementSibling);
            }
        }
    }

    // Check quotes
    p = document.getElementsByClassName('glyphicon-arrow-left');
    for (i=p.length; --i>=0;)
    {
        n = p[i];
        found_in_array=false;
        name_="";
        //while(n.className.split(" ").indexOf(hide)==-1) {
        //    n = n.parentNode;
        //}
        if (n)
        {
            // Get name
            name_=n.parentNode.parentNode.childNodes[3].innerHTML.trim();
            for(ii=0;ii < hide_array.length;ii++)
            {
                //if (n.innerHTML.indexOf(hide_array[ii])>-1)
                if (name_==hide_array[ii])
                {
                    found_in_array=true;
                    break;
                }
            }
            if (found_in_array==true)
            {
                // Check if show
                if (invisible_hidden=="False")
                {
                    // Add line break
                    Create_Element("BR",n.parentNode.parentNode.parentNode.parentNode);
                    // Create show button
                    mybutton=Create_Button("[Show " + name_ + "]",null,n.parentNode.parentNode.parentNode.parentNode);
                    // Add name in button
                    mybutton.setAttribute("poster_name", name_);
                    // Remove name from array if clicked
                    mybutton.onclick=function(){RemoveFromHideArray(this.getAttribute("poster_name"))};
                }
                n.parentNode.parentNode.parentNode.parentNode.removeChild(n.parentNode.parentNode.parentNode);
            }
            else
            {
                // Add line break
                //Create_Element("BR",n.parentNode.parentNode.parentNode.parentNode);
                // Create hide button
                mybutton=Create_Button("[Hide " + name_ + "]",null,n.parentNode.parentNode.parentNode.parentNode);
                // Add name in button
                mybutton.setAttribute("poster_name", name_);
                // Add name to array if clicked
                mybutton.onclick=function(){AddToHideArray(this.getAttribute("poster_name"))};
                // Add line break
                Create_Element("BR",n.parentNode.parentNode.parentNode.parentNode);
            }
        }
    }
}
else
{
    // On main page
    p = document.getElementsByClassName('thread-poster');
    // On subject page
    for (i=p.length; --i>=0;)
    {
        n = p[i];
        found_in_array=false;
        name_="";
        //while(n.className.split(" ").indexOf(hide)==-1) {
        //    n = n.parentNode;
        //}
        if (n)
        {
            // Get name
            name_=n.childNodes[1].innerHTML.trim();
            for(ii=0;ii < hide_array.length;ii++)
            {
                //if (n.innerHTML.indexOf(hide_array[ii])>-1)
                if (name_==hide_array[ii])
                {
                    found_in_array=true;
                    break;
                }
            }
            if (found_in_array==true)
            {
                // Check if show
                if (invisible_hidden=="False")
                {
                    // Create show button
                    mybutton=Create_Button("[Show " + name_ + "]",null,n.parentNode.previousElementSibling.parentNode);
                    // Add name in button
                    mybutton.setAttribute("poster_name", name_);
                    // Remove name from array if clicked
                    mybutton.onclick=function(){RemoveFromHideArray(this.getAttribute("poster_name"))};
                }
                var post_data_array=n.parentNode.previousElementSibling.parentNode.childNodes;
                var number_to_remove=post_data_array.length-1;
                for(ii=0;ii < number_to_remove;ii++)
                {
                    post_data_array[0].parentNode.removeChild(post_data_array[0]);
                }
            }
            else
            {
                // Create hide button
                mybutton=Create_Button("[Hide " + name_ + "]",null,n.parentNode.previousElementSibling.parentNode);
                // Add name in button
                mybutton.setAttribute("poster_name", name_);
                // Add name to array if clicked
                mybutton.onclick=function(){AddToHideArray(this.getAttribute("poster_name"))};
            }
        }
    }
}

function Toggle_Cookie(cookieName,buttonCall)
{
    // Get cookie info
    var showThis=readCookie(cookieName);
    if (showThis==null)
    {
        createCookie(cookieName,"True",900);
        showThis="True";
        // Reload now
        location.reload();
    }
    else
    {
        if (buttonCall==true)
        {
            // Swap it
            if (showThis=="True")
            {
                createCookie(cookieName,"False",900);
            }
            else
            {
                createCookie(cookieName,"True",900);
            }
            // Reload now
            location.reload();
        }
    }

    if (showThis=="False")
    {
        return false;
    }
    else
    {
        return true;
    }
}

function AddToHideArray(value_)
{
    // Add to array
    hide_array.push(value_)
    // Save to cookie
    var new_array_str=JSON.stringify(hide_array);
    createCookie("hide_array",new_array_str,999);
    // Reload page
    location.reload();
}

function RemoveFromHideArray(value_)
{
    for( var i = 0; i < hide_array.length; i++)
    {

        if ( hide_array[i] === value_)
        {
            hide_array.splice(i, 1);
            i--;
        }
    }
    // Save to cookie
    var new_array_str=JSON.stringify(hide_array);
    createCookie("hide_array",new_array_str,999);
    // Reload page
    location.reload();
}

function Create_Element(ElementType,addInNode)
{
    var input=document.createElement(ElementType);
    if (addInNode!=null)
    {
        addInNode.appendChild(input);
    }
    else
    {
        document.body.appendChild(input);
    }
}

function Create_Button(buttonText,cookieName,addInNode)
{
    // Get cookie info
    if (cookieName!=null)
    {
        var showThis=readCookie(cookieName);
        if (showThis==null)
        {
            showThis="True";
        }
    }
    else
    {
        showThis="True";
    }

    var input=document.createElement("input");
    input.type="button";
    input.value=buttonText;
    //input.onclick = Toggle_Nedl;
    if (showThis=="True")
    {
        input.setAttribute("style", "float:left;font-weight: bold;");
    }
    else
    {
        input.setAttribute("style", "float:left;color: #888888");
    }
    if (addInNode!=null)
    {

        addInNode.appendChild(input);
    }
    else
    {
        document.body.appendChild(input);
    }
    return input;
}

function createCookie(name,value,days) {
	var expires;
    if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		expires = "; expires="+date.toGMTString();
	}
	else expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}