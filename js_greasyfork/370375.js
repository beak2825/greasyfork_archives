// ==UserScript==
// @name         Roll20 Quick Character Selection
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Pressing the graves key (`) in the chatbox will query the character list for a Roll20 game and select the first match. Easy.
// @author       Ephemeralis
// @match        https://app.roll20.net/editor/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370375/Roll20%20Quick%20Character%20Selection.user.js
// @updateURL https://update.greasyfork.org/scripts/370375/Roll20%20Quick%20Character%20Selection.meta.js
// ==/UserScript==

console.log("Roll20 Quick Char Selection loaded!");
window.G20_ClearChat = false;
window.G20_SearchResults = [];
window.G20_SearchIndex = 0;

function searchForCharacter(qn)
{
    var changed = false;
    //the below clause detects only the first match, we need to detect multiple
    $('#speakingas > option').each(function () {
        if (this.text.toLowerCase().indexOf(qn.toLowerCase()) !== -1)
        {
            //found a match, so set the speaking as value and we're good
            //$('#textchat-input > textarea').text = "test"
            $('#speakingas').val(this.value).change();
            //then clear the textbox of the search value afterwards
            //$('#textchat-input > textarea').text("").change();
            changed = true;
            return false;
        }
    });
    return changed;
}

function searchForCharacterAll(qn)
{
    var results = [];
    $('#speakingas > option').each(function () {
        if (this.text.toLowerCase().indexOf(qn.toLowerCase()) !== -1)
        {
            results.push([this.text, this.value]);
        }
    });
    return results;
}

window.searchForCharacter = searchForCharacter;
window.searchForCharacterAll = searchForCharacterAll;

function doc_keyDown(e)
{
    switch (e.keyCode)
    {
        case 192: //graves
            if (document.activeElement.parentNode.id == "textchat-input")
            {
                var search = $('#textchat-input > textarea').val();
                var results = searchForCharacterAll(search);

                if (search != "")
                {
                    //not just a lone graves here so we're clearly searching for something
                    if (results.length == 1)
                    {
                        window.G20_SearchResults = [];
                        //lone match, set and forget
                        $('#speakingas').val(results[0][1]).change();
                        window.G20_ClearChat = true;
                    }
                    else if (results.length >= 2)
                    {
                        //multiple matches so shunt them into storage to pull on later on a lone graves press
                        window.G20_SearchResults = results;
                        //but also set it for to the first now as well, and denote that we were already at index 0
                        $('#speakingas').val(results[0][1]).change();
                        window.G20_ClearChat = true;
                        window.G20_SearchIndex = 1;
                    }
                }
                else
                {
                    //this is a lone graves search so cycle through the results we've got, if we have any
                    if (window.G20_SearchResults.length >= 2)
                    {
                        if (window.G20_SearchIndex <= window.G20_SearchResults.length-1)
                        {
                            $('#speakingas').val(window.G20_SearchResults[window.G20_SearchIndex][1]).change();
                            window.G20_SearchIndex++;

                            if (window.G20_SearchIndex == window.G20_SearchResults.length)
                            {
                                window.G20_SearchIndex = 0;
                            }
                            window.G20_ClearChat = true;
                        }
                        else
                        {
                            window.G20_SearchIndex = 0;
                            window.G20_ClearChat = true;
                        }
                    }
                }
            }
            break;
    }
}

function doc_keyUp(e)
{
    switch (e.keyCode)
    {
        case 192:
            if (document.activeElement.parentNode.id == "textchat-input" && window.G20_ClearChat == true)
            {
                //reset the chatbox text on good match
                $('#textchat-input > textarea').val("").change();
                window.G20_ClearChat = false;
            }
          break;
    }
}


document.addEventListener('keydown', doc_keyDown, false);
document.addEventListener('keyup', doc_keyUp, false);

