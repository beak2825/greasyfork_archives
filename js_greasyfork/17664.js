// ==UserScript==
// @name         Distribution Inovation 2
// @namespace    http://theanykey.se
// @version      0.2
// @description  Make distribution inovation better
// @author       Andreas Mustola
// @match        https://app.di.no/app/ExportStatus.do?action=statusList*
// @match        https://app.di.no/app/RouteMessage.do?action=createRouteMessageForm
// @match        https://app.di.no/app/RouteMessage.do
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17664/Distribution%20Inovation%202.user.js
// @updateURL https://update.greasyfork.org/scripts/17664/Distribution%20Inovation%202.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Set text size
if (readCookie("CurrentFontSize")==null)
{
    var TextSize = "100";
}
else
{
    var TextSize = readCookie("CurrentFontSize");
}

if (document.URL.indexOf("app.di.no/app/ExportStatus.do?action=statusList")!=-1)
{
    // Remove old new message cookie (if corupted)
    eraseCookie("CreateNewMessage");
    
    // Give ids to duplicates
    GiveClassId("rs_est_start",1);
    GiveClassId("rs_acknowledge",1);
    GiveTextId("th","Meddelande",1);

    // Give ids to special notification elements
    GiveClassId("rs_start");
    
    // Set page as mobile friendly size
    AddAttributeInTag("div","id","pagebar","style","width:100%");
    addGlobalStyle('#rs_header {white-space: normal ! important}');
    
    // Get if active
    var StillActive=Toggle_Cookie("ShowActive",false);

    // Buttons
    Create_Button("[Create new Message]").onclick=CreateMessage;
    Create_Button("[-=Active=-]","ShowActive").onclick=Toggle_Active;
    Create_Button("[Font Size +]").onclick=AddFontSize;
    Create_Button("[Font Size -]").onclick=DrawFontSize;
    Create_Button("[Top Menu]").onclick=Toggle_TopMenu;
    Create_Element("BR");
    Create_Element("BR");
    if (StillActive==true)
    {
        Create_Button("[HS]").onclick=Toggle_HS;
        Create_Button("[Distrikt]").onclick=Toggle_Distrikt;
        Create_Button("[Nedl.]").onclick=Toggle_Nedl;
        Create_Button("[Beräknad start]").onclick=Toggle_BeraknadStart;
        Create_Button("[Sluttid]").onclick=Toggle_Sluttid;
        Create_Button("[Bud]").onclick=Toggle_Bud;
        Create_Button("[Starta]").onclick=Toggle_Starta;
        Create_Button("[Färd.]").onclick=Toggle_Fard;
        Create_Button("[Meddelande]").onclick=Toggle_Meddelande;
        Create_Button("[Kvitt. klagomål]").onclick=Toggle_KvittKlagomal;
        Create_Button("[Kvittera produkt]").onclick=Toggle_KvittProdukt;
        Create_Button("[Meddelande 2]").onclick=Toggle_Meddelande2;
        Create_Button("[Betjänas]").onclick=Toggle_Betjanas;
        Create_Button("[Frånvaro]").onclick=Toggle_Franvaro;
        Create_Button("[Distriktsavvik]").onclick=Toggle_Distriksavvik;
        Create_Button("[Avvik färdig]").onclick=Toggle_Avvikfardig;
        Create_Button("[Avvikelser]").onclick=Toggle_Avvikelser;
        Create_Button("[Historik]").onclick=Toggle_Historik;
        Create_Button("[Fritext]").onclick=Toggle_Fritext;
    }
}

// Font size buttons
function AddFontSize() {TextSize=String(parseInt(TextSize)+25); createCookie("CurrentFontSize",TextSize,900); SetDefaultValues();}
function DrawFontSize() {TextSize=String(parseInt(TextSize)-25); createCookie("CurrentFontSize",TextSize,900); SetDefaultValues();}

// Buttons Scripts
function Toggle_Active() {Toggle_Cookie("ShowActive",true);}
function Toggle_HS() {Toggle_Info("Show_HS",true,"th","HS",null,"rs_manual_order",null,null,"[HS]");}
function Toggle_Distrikt() {Toggle_Info("Show_Distrikt",true,"th","Distrikt",null,"rs_route",null,null,"[Distrikt]");}
function Toggle_Nedl() {Toggle_Info("Show_Nedl",true,"th","Nedl.",null,"rs_downloaded",null,null,"[Nedl.]");}
function Toggle_BeraknadStart() {Toggle_Info("Show_BeraknadStart",true,"th","Beräknad start",null,"rs_est_start","TD0",null,"[Beräknad start]");}
function Toggle_Sluttid() {Toggle_Info("Show_Sluttid",true,"th","Sluttid",null,"rs_est_start","TD1",null,"[Sluttid]");}
function Toggle_Bud() {Toggle_Info("Show_Bud",true,"th","Sluttid",null,"rs_est_start","TD1",1,"[Bud]");}
function Toggle_Starta() {Toggle_Info("Show_Starta",true,"th","Starta",null,"rs_start",null,null,"[Starta]");}
function Toggle_Fard() {Toggle_Info("Show_Fard",true,"th","Färd.",null,"rs_end",null,null,"[Färd.]");}
function Toggle_Meddelande() {Toggle_Info("Show_Meddelande",true,"th","Meddelande","TH0","rs_msg",null,null,"[Meddelande]");}
function Toggle_KvittKlagomal() {Toggle_Info("Show_KvittKlagomal",true,"th","Kvitt. klagomål",null,"rs_acknowledge","TD0",null,"[Kvitt. klagomål]");}
function Toggle_KvittProdukt() {Toggle_Info("Show_KvittProdukt",true,"th","Kvittera produkt",null,"rs_acknowledge","TD1",null,"[Kvittera produkt]");}
function Toggle_Meddelande2() {Toggle_Info("Show_Meddelande2",true,"th","Meddelande","TH1","messageIconWrapper",null,null,"[Meddelande 2]");}
function Toggle_Betjanas() {Toggle_Info("Show_Betjanas",true,"th","Betjänas",null,"rs_service",null,null,"[Betjänas]");}
function Toggle_Franvaro() {Toggle_Info("Show_Franvaro",true,"th","Frånvaro",null,"rs_absence",null,null,"[Frånvaro]");}
function Toggle_Distriksavvik() {Toggle_Info("Show_Distriksavvik",true,"th","Distriksavvik",null,"rs_dev",null,null,"[Distriktsavvik]");}
function Toggle_Avvikfardig() {Toggle_Info("Show_Avvikfardig",true,"th","Avvik fardig",null,"rs_dev_end",null,null,"[Avvik färdig]");}
function Toggle_Avvikelser() {Toggle_Info("Show_Avvikelser",true,"th","Avvikelser",null,"rs_dev_search",null,null,"[Avvikelser]");}
function Toggle_Historik() {Toggle_Info("Show_Historik",true,"th","Historik",null,"rs_history",null,null,"[Historik]");}
function Toggle_Fritext() {Toggle_Info("Show_Fritext",true,"th","Fritext",null,"rs_comment",null,null,"[Fritext]");}

// Special button scripts
function Toggle_TopMenu(buttonCall) 
{ 
    var cookieName="ShowTopMenu";
    var buttonText="[Top Menu]";

    var showThis=readCookie(cookieName);
    if (showThis==null)
    {
        createCookie(cookieName,"True",900);
        showThis="True";
    }
    else
    {    
        //console.log("Check if swap");
        if (buttonCall!=false)
        {        
            //console.log("Swap");
            // Swap it
            if (showThis=="True")
            {
                createCookie(cookieName,"False",900);
                showThis="False";
            }
            else
            {
                createCookie(cookieName,"True",900);
                showThis="True";
            }
            // Reload now
            //location.reload();
        }
    }
    
    // Change button
    var AllLinks = document.getElementsByTagName("input");
    for (var i=AllLinks.length; --i>=0;) 
    {
        var n = AllLinks[i];
        if (n.value==buttonText)
        {
            if (showThis=="False")
            {
                n.setAttribute("style", "float:left;color: #888888");
            }
            else
            {
                n.setAttribute("style", "float:left;font-weight: bold;");
            }
        }
    }    
    
    if (showThis=="True")
    {
        AddAttributeInTag("div","id","hd","style","");
        AddAttributeInTag("form","id","exportStatusForm","style","");
    }
    else
    {
        AddAttributeInTag("div","id","hd","style","display: none ! important;");
        AddAttributeInTag("form","id","exportStatusForm","style","display: none ! important;");
    }
}

function SetDefaultValues()
{
    Toggle_TopMenu(false);
    Toggle_Info("Show_HS",false,"th","HS",null,"rs_manual_order",null,null,"[HS]");
    Toggle_Info("Show_Distrikt",false,"th","Distrikt",null,"rs_route",null,null,"[Distrikt]");
    Toggle_Info("Show_Nedl",false,"th","Nedl.",null,"rs_downloaded",null,null,"[Nedl.]");
    Toggle_Info("Show_BeraknadStart",false,"th","Beräknad start",null,"rs_est_start","TD0",null,"[Beräknad start]");
    Toggle_Info("Show_Sluttid",false,"th","Sluttid",null,"rs_est_start","TD1",null,"[Sluttid]");
    Toggle_Info("Show_Bud",false,"th","Sluttid",null,"rs_est_start","TD1",1,"[Bud]");
    Toggle_Info("Show_Starta",false,"th","Starta",null,"rs_start",null,null,"[Starta]");
    Toggle_Info("Show_Fard",false,"th","Färd.",null,"rs_end",null,null,"[Färd.]");
    Toggle_Info("Show_Meddelande",false,"th","Meddelande","TH0","rs_msg",null,null,"[Meddelande]");
    Toggle_Info("Show_KvittKlagomal",false,"th","Kvitt. klagomål",null,"rs_acknowledge","TD0",null,"[Kvitt. klagomål]");
    Toggle_Info("Show_KvittProdukt",false,"th","Kvittera produkt",null,"rs_acknowledge","TD1",null,"[Kvittera produkt]");
    Toggle_Info("Show_Meddelande2",false,"th","Meddelande","TH1","messageIconWrapper",null,null,"[Meddelande 2]");
    Toggle_Info("Show_Betjanas",false,"th","Betjänas",null,"rs_service",null,null,"[Betjänas]");
    Toggle_Info("Show_Franvaro",false,"th","Frånvaro",null,"rs_absence",null,null,"[Frånvaro]");
    Toggle_Info("Show_Distriksavvik",false,"th","Distriksavvik",null,"rs_dev",null,null,"[Distriktsavvik]");
    Toggle_Info("Show_Avvikfardig",false,"th","Avvik fardig",null,"rs_dev_end",null,null,"[Avvik färdig]");
    Toggle_Info("Show_Avvikelser",false,"th","Avvikelser",null,"rs_dev_search",null,null,"[Avvikelser]");
    Toggle_Info("Show_Historik",false,"th","Historik",null,"rs_history",null,null,"[Historik]");
    Toggle_Info("Show_Fritext",false,"th","Fritext",null,"rs_comment",null,null,"[Fritext]");
}

if (document.URL.indexOf("app.di.no/app/ExportStatus.do?action=statusList")!=-1)
{
    // Load all saved info
    if (StillActive==true)
    {
        SetDefaultValues();
    }
}

// Check if continue create message
CreateMessage();

function CreateMessage(StartCreate)
{
    if (StartCreate!=null)
    {
        createCookie("CreateNewMessage","True",900);
        window.location.href="https://app.di.no/app/RouteMessage.do?action=createRouteMessageForm";
    }
    else
    {
        if (readCookie("CreateNewMessage")!=null)
        {         
            if (document.URL=="https://app.di.no/app/RouteMessage.do?action=createRouteMessageForm")
            {                  
                ClickButton("Sök område");
                //console.log("1");
            }
            if (document.URL=="https://app.di.no/app/RouteMessage.do")
            {
                if (readCookie("CreateNewMessage")=="True")
                {
                    //console.log("2");
                    AddAttributeInTag("input","name","searchArea.name","value","nc Kumla");
                    createCookie("CreateNewMessage","Step2",900);
                    ClickButton("Sök");
                }
                else if (readCookie("CreateNewMessage")=="Step2")
                {
                    //console.log("3");
                    AddAttributeInTag("input","name","area[0].chosen","checked","true");
                    createCookie("CreateNewMessage","Step3",900);
                    ClickButton("Lagra");
                }
                else if (readCookie("CreateNewMessage")=="Step3")
                {
                    AddAttributeInTag("input","name","copyText","checked","true");
                    eraseCookie("CreateNewMessage");  
                }                    
            }        
        }
    }    
}

function ClickButton(TextOnButton,TagToClick)
{
    if (TagToClick==null) TagToClick="input";
  
    var AllLinks = document.getElementsByTagName(TagToClick);
    
    for (var i=AllLinks.length; --i>=0;) 
    {
        var n = AllLinks[i];
        if (n.value)
        {
            if (n.value==TextOnButton) 
            {
                n.click();
            }
        }
    }
}
 
function AddAttributeInTag(SearchTag,FindAttribute,FindAttributeText,AddAttribute,AddAttributeText)
{
    var AllLinks = document.getElementsByTagName(SearchTag);
    
    var AutoClicked=false;
    for (var i=AllLinks.length; --i>=0;) 
    {
        var n = AllLinks[i];
        if (n.hasAttribute(FindAttribute))
        {
            if (n.getAttribute(FindAttribute).indexOf(FindAttributeText)!=-1)
            {
                n.setAttribute(AddAttribute,AddAttributeText);
            }
        }
    }
}
        
function Toggle_Info(cookieName,buttonCall,tagName,SearchText,extraTagID,className,extraClassID,useNextSibling,buttonText)
{
    // Get cookie info
    var showThis=readCookie(cookieName);
    if (showThis==null)
    {
        createCookie(cookieName,"True",900);
        showThis="True";
    }
    else
    {
        if (buttonCall==true)
        {        
            // Swap it
            if (showThis=="True")
            {
                createCookie(cookieName,"False",900);
                showThis="False";
            }
            else
            {
                createCookie(cookieName,"True",900);
                showThis="True";
            }
            // Reload now
            //location.reload();
        }
    }

    // Change button
    var AllLinks = document.getElementsByTagName("input");
    for (var i=AllLinks.length; --i>=0;) 
    {
        var n = AllLinks[i];
        if (n.value==buttonText)
        {
            if (showThis=="False")
            {
                n.setAttribute("style", "float:left;color: #888888");
            }
            else
            {
                n.setAttribute("style", "float:left;font-weight: bold;");
            }
        }
    }
    
    if (showThis=="False")
    {
        RemoveTagOnPage(tagName,SearchText,extraTagID,useNextSibling);
        RemoveClassOnPage(className,extraClassID,useNextSibling);
    }
    else
    {
        RemoveTagOnPage(tagName,SearchText,extraTagID,useNextSibling,true);
        RemoveClassOnPage(className,extraClassID,useNextSibling,true);
    }        
}

function Create_Element(ElementType)
{
    var input=document.createElement(ElementType);
    document.body.appendChild(input);
}

function Create_Button(buttonText,cookieName)
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
    document.body.appendChild(input);
    return input;
}

function Toggle_Cookie(cookieName,buttonCall)
{
    // Get cookie info
    var showThis=readCookie(cookieName);
    if (showThis==null)
    {
        createCookie(cookieName,"True",900);
        showThis="True";
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

function RemoveClassOnPage(Classname,extraID,useNextSibling,ShowInstead)
{
    var AllLinks = document.getElementsByClassName(Classname);
    for (var i=AllLinks.length; --i>=0;) 
    {
        var n = AllLinks[i];
        // Check for text
        if (n)
        {
            if (extraID==null)
            {
                if (useNextSibling!=null)
                {
                    // Next sibling
                    for (var j=useNextSibling; --j>=0;) 
                    {       
                        n=n.nextElementSibling;
                    }
                }
                if (ShowInstead==null)
                {
                    n.setAttribute("style", "display: none ! important;");
                    //n.parentNode.removeChild(n);
                }
                else
                {
                    n.setAttribute("style", "font-size: " + TextSize + "%  ! important;");
                }
            }
            else
            {
                if (extraID==n.getAttribute("id"))
                {
                    if (useNextSibling!=null)
                    {
                        // Next sibling
                        for (var j=useNextSibling; --j>=0;) 
                        {       
                            n=n.nextElementSibling;
                        }
                    }
                    if (ShowInstead==null)
                    {
                        n.setAttribute("style", "display: none ! important;");
                        //n.parentNode.removeChild(n);
                    }
                    else
                    {
                        n.setAttribute("style", "font-size: " + TextSize + "%  ! important;");
                    }
                }
            }
        }
    } 
}

function RemoveTagOnPage(Tagname,SearchText,extraTagID,useNextSibling,ShowInstead)
{
    var AllLinks = document.getElementsByTagName(Tagname);
    for (var i=AllLinks.length; --i>=0;) 
    {
        var n = AllLinks[i];
        // Check for text
        if (n.innerHTML)
        {
            if (extraTagID==null)
            {            
                if (n.innerHTML.indexOf(SearchText)!=-1)
                {
                    if (useNextSibling!=null)
                    {
                        // Next sibling
                        for (var j=useNextSibling; --j>=0;) 
                        {       
                            n=n.nextElementSibling;
                        }
                    }                
                    if (ShowInstead==null)
                    {
                        n.setAttribute("style", "display: none ! important;");
                        //n.parentNode.removeChild(n);
                    }
                    else
                    {
                        n.setAttribute("style", "font-size: " + TextSize + "%  ! important;");
                    }
                }
            }
            else
            {
                if (extraTagID==n.getAttribute("id"))
                {                
                    if (n.innerHTML.indexOf(SearchText)!=-1)
                    {
                        //console.log(n.innerHTML);
                        //console.log("Found id");
                        if (useNextSibling!=null)
                        {
                            // Next sibling
                            for (var j=useNextSibling; --j>=0;) 
                            {       
                                n=n.nextElementSibling;
                            }
                        }                
                        if (ShowInstead==null)
                        {
                            n.setAttribute("style", "display: none ! important;");
                            //console.log("HIDE");
                            //console.log(n.innerHTML);
                            //n.parentNode.removeChild(n);
                        }
                        else
                        {
                            console.log("NORMAL");
                            n.setAttribute("style", "font-size: " + TextSize + "%  ! important;");
                        }
                    }
                }
            }
        }
    } 
}

function GiveTextId(TagName, SearchText, ResetEvery)
{
    var AllLinks = document.getElementsByTagName(TagName);
    var mycounter=0;
    for (var i=AllLinks.length; --i>=0;) 
    {
        var n = AllLinks[i];
        // Check for text
        if (n.innerHTML)
        {
            if (n.innerHTML.indexOf(SearchText)!=-1)
            {
                mycounter+=1;
                if (ResetEvery!=null)
                {
                    if (mycounter>ResetEvery) mycounter=0;
                }
                if (n.getAttribute("id")==null)
                {
                    n.setAttribute("id", n.nodeName + mycounter);
                }
            }
        }
    }  
}

function addGlobalStyle(css) 
{
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function GiveClassId(ClassName, ResetEvery)
{
    var AllLinks = document.getElementsByClassName(ClassName);
    var mycounter=0;
    for (var i=AllLinks.length; --i>=0;) 
    {
        var n = AllLinks[i];
        // Check for text
        if (n)
        {
            mycounter+=1;
            if (ResetEvery!=null)
            {
                if (mycounter>ResetEvery) mycounter=0;
            }
            if (n.getAttribute("id")==null)
            {
                n.setAttribute("id", n.nodeName + mycounter);
            }
        }
    }  
}

function GiveGlobalClassId(ClassName, ResetWhenFountTag)
{
    var currentNode,
    ni = document.createNodeIterator(document.documentElement, NodeFilter.SHOW_ELEMENT);
    var mycounter=0;
    while(currentNode = ni.nextNode()) {
        mycounter+=1;
        if (currentNode.getAttribute("tagName")==ResetWhenFountTag) mycounter=0;
        if (currentNode.getAttribute("id")==null)
        {
            if (currentNode.getAttribute("class")!=null)
            {            
                if (currentNode.getAttribute("class")==ClassName)
                {
                    currentNode.setAttribute("id", currentNode.nodeName + mycounter);
                }
            }
        }
    }    
}

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
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