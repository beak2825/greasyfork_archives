// ==UserScript==
// @name        KAT - Add IMG bbcode
// @namespace   IMGbbcode
// @version     1.03
// @description  Allows highlighting url and then clicking or using Ctrl + I to make IMG bbcode
// @require https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @match      http://kat.cr/*
// @match      https://kat.cr/*
// @downloadURL https://update.greasyfork.org/scripts/11247/KAT%20-%20Add%20IMG%20bbcode.user.js
// @updateURL https://update.greasyfork.org/scripts/11247/KAT%20-%20Add%20IMG%20bbcode.meta.js
// ==/UserScript==

// Enabled - 1 - No highlighting / invalid highlight prompts the user to enter the URL - Default
// Disabled - 0 - No highlighting / invalid highlight just adds [IMG][/IMG]
var promptUser = 1;

function addIMG(jNode) 
{ 
    $(jNode).append('<span class="bbedit-img" title="Use URL" style="background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAD9SURBVDhP7ZChskVQFIbvo4iiIAiCKHgAQfAAgiAIZkRBFAVBFERBEAQPIYiCIAqC+7l75ow5o5gTz/3Tv9b+vzVrr5/jA/3DD/UxvCyL7/uYYRhM05ym6e/pVJZlrusKT8zzPMMwLMtq25bOCZOmhSmKQlVVEmf2OLZt03VdkiT8uq6yLNd1ve/7PM9VVdF8h6MoIgRGmed5mqYCTpIkjmPMVe8wiTAMMZSaprGqgFm+aRqM4ziExaAbeBxHsL7vbdumKWCOwiIY9MrfwBhKRVG6rsMLmFvyHX5+zd/DZVkSxSABI145p5gbBAGdE34kTs3BhX8MX/V98HH8ApmOKX9Nyo+KAAAAAElFTkSuQmCC\')"></span>'); 
    $('.bbedit-img').unbind("click");
    $('.bbedit-img').bind("click", imgClick);
    $("textarea").unbind("keydown");
    $("textarea").bind("keydown", taKeyDown);
}

function imgClick()
{ 
    if (window.getSelection) 
    {
        var ta = $(this).parent().parent().children("textarea").get(0);
        var start = ta.selectionStart;
        var end = ta.selectionEnd;
        var text = ta.value.substring(start, end);
        if(/^https?:\/\/|www/i.test(text)) 
        {
            ta.value = ta.value.substring(0, start)
            + '[IMG]' + text + '[/IMG]'
            + ta.value.substring(end, ta.value.length);
        }
        else
        {
            var newValue = ta.value.substring(0, start);
            if (promptUser == 1)
            {
                var url=prompt('Image URL: ','');
                if(url!==null && url!=='' && /^https?:\/\/|www/i.test(url))
                {
                    newValue += '[IMG]' + url + '[/IMG] ';
                }
                else
                {
                    newValue += '[IMG][/IMG] ';
                }  
            }
            else
            {
                newValue += '[IMG][/IMG] ';
            } 
            newValue += text + ta.value.substring(end, ta.value.length);
            ta.value = newValue;
            if (promptUser == 0 && ta.setSelectionRange) ta.setSelectionRange(start + 5, start + 5);
            
        }
    }
}

function taKeyDown (event)
{
    if (event.ctrlKey && event.which == 73) 
    {
        event.preventDefault();
        $(this).parent().find(".bbedit-img").trigger("click");
    }
}

waitForKeyElements (".bbedit-toolbar", addIMG);