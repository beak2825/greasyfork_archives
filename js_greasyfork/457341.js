// ==UserScript==
// @name           2022 Snopes tldr; (fact-check page:Show hidden Answers at top)
// @namespace      http://www.hivemindtechnology.com
// @author         m1m1k
// @license MIT
// @version        2.0
// @description    Enhance Snopes.com site by grabbing the "answer" from topics so that I dont have to read the entire article, I can just skim the interesting ones.
// @include        https://www.snopes.com/fact-check/*
// @include        https://snopes.com/fact-check/*
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/457341/2022%20Snopes%20tldr%3B%20%28fact-check%20page%3AShow%20hidden%20Answers%20at%20top%29.user.js
// @updateURL https://update.greasyfork.org/scripts/457341/2022%20Snopes%20tldr%3B%20%28fact-check%20page%3AShow%20hidden%20Answers%20at%20top%29.meta.js
// ==/UserScript==


function isNullOrWhitespace( input ) {
  return !input || !input.trim();
}
function defaultIfNull(arg, defaultValue) { return isNullOrWhitespace(arg) ? defaultValue : arg; }

function RegexReplace(strInput, iMatchNum = 1, strPattern) {
  strInput = defaultIfNull(strInput, "https://www.snopes.com/fact-check/rating/unknown");
  strPattern = defaultIfNull(strPattern, "https?://(.*)/fact-check/rating/(.*)");
  var esc_Input = unescape(strInput);
  var exp = new RegExp(strPattern, "gi");
  return esc_Input.replace(exp,"$"+iMatchNum);
}

function Trim(strInput, strCharToTrim = '\s')
{
    strInput = defaultIfNull(strInput, "");
    // only kill them at beginning or end, similar to trim()
    var myRegex = new RegExp("/^"+ strCharToTrim + "+|" +
                           strCharToTrim + "+$", "gm");
    return strInput.replace(myRegex,'');
}

function getBuriedAnswerFromPageContent() {
    var factCheckAnswer = "unknown";
    // String-of-waterfalls Fallback-to-older-styled-articles scheme: (Latest-To-Oldest)
    // 2022 LATEST "fact-check" Articles have a "rating" (stopsign) SVG vector icon, the a link to the icon is named "false", "true", "misattributed", "etc"
    var v2015_imgLinks = document.querySelectorAll("#article-content img");
    var v2013_SVGLinks = document.querySelectorAll("a.rating_link_wrapper");
    var v2010_Table = document.querySelectorAll("#article-content font.status_color");
    var v2009_PTags = document.querySelectorAll("#article-content font");

    var v2008_Status = document.querySelectorAll("#article-content font.sect_font_style");
    var innerTextTitles = [];
    if(v2015_imgLinks.length != 0) // this is an "older" style page, which doesn't contain the newer fact-check icons, try for a table instead
    {
        // https://www.snopes.com/fact-check/trump-mexicans-puerto-rico/
        factCheckAnswer = RegexReplace(v2015_imgLinks[0].src, 1, "https://www.snopes.com/images/m/(.*).png");
    }
    if(v2013_SVGLinks.length != 0) // this is an "older" style page, which doesn't contain the newer fact-check icons, try for a table instead
    {
        factCheckAnswer = RegexReplace(v2013_SVGLinks[0].href, 2);
    }
    else if(v2010_Table.length != 0)
    {
        // https://www.snopes.com/fact-check/vin-car-thieves/
        // example: https://www.snopes.com/fact-check/vitamin-see/
        // <table><tbody><tr><td valign="CENTER"><img src="/images/mixture.gif" pinger-seen="true"></td><td valign="TOP"><font size="5" color="" class="status_color"><b>MIXTURE</b></font></td></tr></tbody></table>
        // factCheckAnswer = v2010_Table[0].innerText;  // works for the "first" one

        v2010_Table.forEach(function (tableRow) {
            innerTextTitles.push(Trim(tableRow.innerText, "[\:]"));
        });
        factCheckAnswer = innerTextTitles.join();
    }
    else if(v2009_PTags.length != 0)
    {
        // https://www.snopes.com/fact-check/four-legged-flusher/
        //factCheckAnswer = Trim(v2009_PTags[1].nextSibling.innerText);
        var RED = "#FF0000";
        var RED2 = "#CC0000";
        var GREEN = "#37628D";
        v2009_PTags.forEach(function (fontElement) {
            if (fontElement.hasAttribute("color") &&
                (fontElement.getAttribute("color") == RED ||
                 fontElement.getAttribute("color") == RED2 ||
                 fontElement.getAttribute("color") == GREEN)) {
                //innerTextTitles.push(RegexReplace(fontElement.innerText, 1, "(\s*)[\:\.]"));
                innerTextTitles.push(Trim(fontElement.innerText, "[\:\.]"));
            }
        });
        factCheckAnswer = innerTextTitles.join();
    }
    else if(v2008_Status.length != 0)
    {
        // example: https://www.snopes.com/fact-check/anti-freeze-in-vitamin-water/
        factCheckAnswer = Trim(v2008_Status[0].innerText, '[\.]');
    }
    else{
        // "UNKNOWN"
        // TBD: Handle these Fallthrough example, no "answer"
        // https://www.snopes.com/fact-check/recall-church-vitamin-gummies/
        // https://www.snopes.com/fact-check/republicans-trump-supporters-grammar/
        // https://www.snopes.com/fact-check/trump-national-guard-troops-hotel/
        // https://www.snopes.com/fact-check/who-brought-the-cat/
        // https://www.snopes.com/fact-check/nokia/
        // https://www.snopes.com/fact-check/jest-in-time-iii/
        // https://www.snopes.com/fact-check/trump-cecil-legal-fees/

        // FIX ME: Broken
        // https://www.snopes.com/fact-check/isis-middle-eastern-men-dealership/
    }
    console.log('factCheckAnswer:' + factCheckAnswer);
    factCheckAnswer = defaultIfNull(factCheckAnswer, "unknown");
    return factCheckAnswer;
}
const factCheckAnswer = getBuriedAnswerFromPageContent();




// allow text selection by disabling anything that can prevent copy+pasta
void(document.onselectstart=null)

function colorFactCheckTags( colorLeft = "gray", colorRight ) {
    colorRight = defaultIfNull(colorRight, colorLeft);
GM_addStyle ( `
main .section_title_wrap span.section_title:after {
    background: `+colorRight+`;
}
main .section_title_wrap .section_title_arrow,
main .section_title_wrap span.section_title {
    background: `+colorLeft+`;
}
`
);
}

// Implement Missing Handy Language Funcs (Dictionary)
// https://stackoverflow.com/questions/11393200/how-to-find-value-using-key-in-javascript-dictionary
var dict = {};
var DictSetPair = function (myKey, myValue) {
    dict[myKey.toLowerCase()] = myValue;
};
var DictGetValue = function (myKey) {
    return dict[myKey.toLowerCase()];
};


// ---------------- Harmless / Satire / Inaccurate ----------------
DictSetPair("misattributed", "#bedbed"); // lightblue
DictSetPair("miscaptioned", "#bedbed");  // lightblue
DictSetPair("INCORRECTLY ATTRIBUTED", "#bedbed");  // lightblue
DictSetPair("labeled-satire", "lavender");
DictSetPair("originated-as-satire", "lavender");
DictSetPair("Real video; inaccurate description", "lavender");
DictSetPair("REAL PHOTOGRAPHS; INACCURATE DESCRIPTION", "lavender");

// ----------------BAD / FALSE / INCORRECT ----------------
DictSetPair("false", "red");             // red
DictSetPair("scam", "red");              // red
DictSetPair("unproven", "#fedfed");      // lightred
DictSetPair("LEGEND", "#fedfed");        // lightred
DictSetPair("mostly-false", "#fedfed");  // lightred

// ----------------GOOD / TRUE / CORRECT ----------------
DictSetPair("true", "#58f58f");          // green
DictSetPair("mostly-true", "lightgreen");          // green
DictSetPair("correct-attribution", "#58f58f");// green
DictSetPair("recall", "#58f58f");// green

// ----------------UNKNOWN / NA / Not enough data ----------------
DictSetPair("news", "#fbd458");          // default/normal/yellow
DictSetPair("post", "#fbd458");          // default/normal/yellow
DictSetPair("MIX", "gray");
DictSetPair("Undetermined", "gray");
DictSetPair("outdated", "#fedfed");
DictSetPair("unknown", "gray");


// Set the SectionTitle text to the "answer" plus color it accordingly.
const sectionTitle = document.querySelectorAll("span.section_title")[0];
sectionTitle.innerHTML = factCheckAnswer;
var colorPairReturned = DictGetValue(factCheckAnswer);
console.log('colorPairReturned:' + colorPairReturned);
if(typeof(colorPairReturned) !== 'undefined')
{
    colorFactCheckTags(colorPairReturned);
}
else
{
    // Iterate through the object
    for (const key in dict) {
        if (dict.hasOwnProperty(key) && factCheckAnswer.toLowerCase().includes(key))
        {
            colorFactCheckTags(DictGetValue(factCheckAnswer), "lightgreen");
        }
    };
}