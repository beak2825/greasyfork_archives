// ==UserScript==
// @name        "TwitchPleb"
// @namespace   "spacename"
// @description "Free Twitch.tv subscriber emotes"
// @include     https://www.twitch.tv/*
// @include     https://twitch.tv/*
// @exclde
// @version     1.0.2
// @noframes
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26323/%22TwitchPleb%22.user.js
// @updateURL https://update.greasyfork.org/scripts/26323/%22TwitchPleb%22.meta.js
// ==/UserScript==

var emotes = new Map();

var clickEmoteButton = false;

var lastDataId = 0;
var lastDataSender;

var htmlEmoteTag0 = "<img class=\"emoticon ttv-emo-";
var htmlEmoteTag1 = "\" src=\"";
var htmlEmoteTag2 = "\" srcset=\"";
var htmlEmoteTag3 = " 2x\" data-id=\"";
var htmlEmoteTag4 = "\" alt=\"";
var htmlEmoteTag5 = "\" original-title=\"\">";

window.onload = function()
{	
	console.log("Starting script\n");
	window.setTimeout(LoadEmotes, 500);
}

function Emote(url, id)
{
	this.url = url;
	this.id = id;
}

function CleanHtmlChars(theChar)
{
	if(theChar === "<")
	{
		return "&lt;";
	}
	if(theChar === ">")
	{
		return "&gt;";
	}
	if(theChar === "&")
	{
		return "&amp;";
	}
	
	return theChar;
}

function Run()
{
	var messages = document.querySelectorAll("span.message");
	var chatLines = document.getElementsByClassName("chat-line");
	if(messages === undefined)
	{
		console.error("messages elements were not found");
		return;
	}
	
	var processMessages = lastDataSender === undefined ? true : false;
	for(var count=0; count < messages.length; count++)
	{
		if(messages[count] === undefined)
		{
			console.error("message is undefined. [count: " + count + 
				"] [messages.length: " + messages.length + "]");
			return;
		}
		if(processMessages)
		{
			//ignore deleted and system messages
			if(messages[count].getElementsByClassName("deleted")[0] || 
				chatLines[count].getAttribute("data-sender") == "jtv")
			{
				continue;
			}
			
			lastDataId = chatLines[count].getAttribute("data-id");
			lastDataSender = chatLines[count].getAttribute("data-sender");
			console.log("lastDataId:"+lastDataId+" lastDataSender:"+lastDataSender);
			
			var newInnerHTML = "";
			for(var childCount=0; childCount < messages[count].childNodes.length; childCount++)
			{
				var node = messages[count].childNodes[childCount];
				if(node.nodeName === "#text")
				{
					var substr = "";
					for(var charCount=0; charCount < node.data.length; charCount++)
					{
						var currentChar = CleanHtmlChars(node.data.charAt(charCount));
						if(currentChar === undefined)
							console.log("currentChar is undefined");
						if(currentChar !== " ")
						{
							substr += currentChar;
						}
						if(currentChar === " " || node.data.length-1===charCount)
						{
							var emote = emotes.get(substr);
							var space = currentChar === " " ? " " : "";
							if(emote !== undefined)
							{
								newInnerHTML += htmlEmoteTag0+emote.id+htmlEmoteTag1+emote.url+
									"1.0"+htmlEmoteTag2+emote.url+"2.0"+htmlEmoteTag3+emote.id+
									htmlEmoteTag4+substr+htmlEmoteTag5+space;
							}
							else
							{

								newInnerHTML += substr+space;
							}
							substr = "";
						}
					}
				}
				else
				{
					newInnerHTML += node.outerHTML;
				}
			}
			console.log(newInnerHTML);
			messages[count].innerHTML = newInnerHTML;
		}
		else if(chatLines[count].getAttribute("data-id") == lastDataId && 
			chatLines[count].getAttribute("data-sender") == lastDataSender)
		{
			processMessages = true;
		}
	}
}

function LoadEmotes()
{
	if(!clickEmoteButton)
	{
		document.getElementsByClassName("js-emoticon-toggle emoticon-selector-toggle")[0].click();
		clickEmoteButton = true;
	}
	if(!document.getElementsByClassName("emoticon-grid") || 
		document.getElementsByClassName("emoticon-grid").length === 0)
	{
		console.error("emoticon-grid was not found");
		window.setTimeout(LoadEmotes, 100);
		return;
	}
	console.log("Loading Emotes");
	
	var div = document.getElementsByClassName("emoticon-grid")[0];
	
	var emoticonGroup = div.getElementsByClassName("emoticon tooltip locked");
	
	for(var count=0; count < emoticonGroup.length; count++)
	{
		var emoteName = emoticonGroup[count].getAttribute("original-title");
		var css = emoticonGroup[count].style.cssText;
		
		var emoteUrl = emoticonGroup[count].style.cssText.substring(
			css.lastIndexOf("(")+1, css.lastIndexOf(")")-4).replace(/"/g, "");
		
		var startingIndex = emoteUrl.indexOf("v1/")+3;
		var emoteId = emoteUrl.substring(startingIndex, emoteUrl.indexOf("/", startingIndex));
		
		emotes.set(emoteName, new Emote(emoteUrl, emoteId));
		
		var emote = emotes.get(emoteName);
		
		console.log(emoteName +" [id: "+emote.id+"] [url: "+ emote.url +"]");
	}
	
	document.getElementsByClassName("js-emoticon-toggle emoticon-selector-toggle")[0].click();
	window.setInterval(Run, 250);
}
