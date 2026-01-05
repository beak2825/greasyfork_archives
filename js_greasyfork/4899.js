/*******************************************************************************
 * Copyright (c) 2012 - 2016 Radu Murzea. All rights reserved.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 *******************************************************************************/
 
 /*******************************************************************************
 * DESCRIPTION:
 * 
 * This script is intended for use only on ProjectEuler.net and it was build to be used together
 * with Firefox's GreaseMonkey extension.
 *
 * It places 5 flags (British, Romanian, Russian, Korean and German) on top of every problem's page.
 * By clicking on the flag, the corresponding translation of a problem is retrieved.
 *
 * Obviously, not at all problems are available in the above mentioned languages. In this case, clicking on the flag will do nothing.
 *
 * Notes about implementation:
 *
 * - The technique used for implementing this is **JSONP** (JSON with padding), since AJAX wouldn't work (see Same Origin Policy).
 * - The processing function (only 2 - 3 lines of code) is found in the **processtranslation.js** file. That function will be executed when the response comes back.
 * - The 5 flag images are stored inside the script in Base64 format, to avoid additional HTTP requests.
 *
 * LIMITATIONS:
 *
 * - does not work on HTTPS version of ProjectEuler (Firefox 23+), unless you disable Mixed Active Content blocker
 * - for some unknown reason, it needs at least Firefox 9+ to work.
 *
 * The translations are parsed from the corresponding translations websites:
 *
 * - http://projecteuler.radumurzea.net/ for Romanian
 * - http://euler.jakumo.org/ for Russian,
 * - http://euler.synap.co.kr/ for Korean and
 * - http://projekteuler.de for German
 *
 * You can see a demo on how the script works in the video on this page: http://projecteuler.radumurzea.net/greasemonkey.php
 * 
 * The script is also hosted here, for easier installation:
 *
 * - https://greasyfork.org/en/scripts/4899-project-euler-problem-translator
 * - https://openuserjs.org/scripts/SoboLAN/Project_Euler_Problem_Translator
 *
 *
 *******************************************************************************/
 
 /***************************************************
 *
 * Version 1.7 (24 September 2016)
 * - The domain name where the scripts and romanian translations live has been changed, so this new version updates them.
 * _______________________________
 *
 * Version 1.6 (15 June 2014)
 * - Since Firefox introduced the Mixed Active Content blocker in Firefox 23, this script will
 * only run when viewing problems in HTTP mode and it will fail in HTTPS. So it's now
 * disabled on HTTPS.
 * @see https://blog.mozilla.org/tanvi/2013/04/10/mixed-content-blocking-enabled-in-firefox-23/
 * A solution would be to buy a HTTPS certificate for my domain, but atm the costs are not justified.
 * _______________________________
 *
 * Version 1.5 (15 June 2014)
 * - Added translations in German.
 *_______________________________
 *
 * Version 1.4 (24 May 2014)
 * - Due to significant and frequent accessibility issues, support for Spanish translations is now
 * dropped.
 * _______________________________
 * 
 * Version 1.3 (18 March 2013)
 * - support for Korean added. At this date, 110 problems are translated in this language.
 * _______________________________
 *
 * Version 1.2.5 (13 January 2013)
 * - the flags will no longer appear on the page exactly after
 * you enter a (correct or incorrect) answer. This issue existed because the URL remains
 * the same.
 * - a few minor changes
 * _______________________________
 *
 * Version 1.2 (28 December 2012)
 * - translations are now offered in Russian and Spanish as well. These translations are parsed from
 * euler.jakumo.org and euleres.tk, respectively. Because of this, additional roundtrips must be made to
 * retrieve these translations, which is why it will feel slower... sometimes very slow.
 * - some small changes here and there.
 * - the backend part has been changed from "read.php" to "getjsontranslation.php". Although the old version
 * is still functional, it is highly recommended to switch to the new one (spanish and russian are accessible
 * only in the new one). Please note that the old version will be taken out of rotation on the 20th of January.
 *
 * WARNING: I have no control over how many problems are accessible in the 2 new languages and the quality
 * of these translations. Any problem regarding these 2 languages (Russian and Spanish) should be directed
 * to their authors.
 *
 * WARNING: In my tests, the Spanish version would sometimes fail for some problems and then work again
 * a few minutes later. Apparently, this issue has something to do
 * with network connection timeouts (low quality hosting ?), so this is not a bug in the script
 * itself. Please do not report this as a bug.
 * _______________________________
 *
 * Version 1.0.2 (17 December 2012)
 * - script functionality was broken by some changes in
 * the HTML code on projecteuler.net that occured on 16 December 2012. This version
 * fixes this issue.
 * _______________________________
 *
 * Version 1.0.1 (22 September 2012)
 * - added some extra safety by checking that the parsing of
 * the problem's ID did not return NaN
 * _______________________________
 *
 * Version 1.0 (18 September 2012)
 * - initial release
 *
 ****************************************************/


// ==UserScript==
// @name Project Euler Problem Translator
// @description Provides translations in Romanian, Russian, Korean and German for Project Euler problems
// @author Radu Murzea
// @version 1.7
// @icon http://projecteuler.radumurzea.net/favicon.ico
// @include http://projecteuler.net/problem=*
// @grant none
// @namespace https://greasyfork.org/users/5099
// @downloadURL https://update.greasyfork.org/scripts/4899/Project%20Euler%20Problem%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/4899/Project%20Euler%20Problem%20Translator.meta.js
// ==/UserScript==   



function setNewTranslation(problem, lang)
{
    var script = document.createElement('script');
    
    script.setAttribute('src', 'http://projecteuler.radumurzea.net/getjsontranslation.php?problem=' + problem + '&lang=' + lang);
    
    document.getElementsByTagName('head')[0].appendChild(script); 
}

function getProblemID()
{
    var h3Nodes = document.getElementsByTagName('h3');
    
    for (var nodeIndex = 0; nodeIndex < h3Nodes.length; nodeIndex++) {
        var nodePieces = h3Nodes[nodeIndex].innerHTML.split(" ");
        
        if (nodePieces[0] === "Problem") {
            var problemID = parseInt(nodePieces[1]);
            
            return problemID;
        }
    }
    
    return -1;
}

function getROFlag()
{
    var RO = document.createElement("img");
    RO.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAIAAAD5gJpuAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHd" +
            "hcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGBSURBVHjaYmTQPs7w6Q8DCDAxMLC8P2DOwcbA8I/hHxix/GD4pw3kIRBAALEwvPtT3aQIV" +
            "P7vH+O//0yc0hWsrD8ZGP78//8HRH75/T/mz//fv///AZFfNm0CCCAWBhYGhv8MT17//vvv/99/TP/+PWJg+P7//28o+vP7/+1f/3/9Aqp" +
            "mlJUF2gAQQCwgs/8zAFX/+QtCQIP///8FJn+DGP+Aqn9DNDD8/g3UABBALAx//oFV//vzhwGs4RfCeBAbRQPQdIAAYmH49Q+o7vef/zANv" +
            "5H0gBm/oE5i+PMHaANAAIE0/AUZ//8XUM9fBiQNYBLJSYxgJwEEEEjD778Mv/6A9Pz+wwB1BpoNYOOBbgAGHEAAsTD8BNL/gJqBrvr9lxF" +
            "JA8QGsIY/QA1/Gf7+BfoBIICAofQHqFRShBXkjb/MTEzSDAzfGBmB/gMa95uB5Q+D0h+QUjACOgkggBgZGLYyMPwCS4Nc+HxvMAsLw78/4" +
            "HgFkh8Y/oVD4xgCAAIMACetb51Fz+5FAAAAAElFTkSuQmCC";
    
    RO.alt = "Romania";
    RO.title = "Romanian";
    RO.style.cursor = "pointer";
    
    RO.onclick = function() {
        var problemID = getProblemID();
        
        if (! isNaN(problemID) && problemID !== -1) {
            setNewTranslation(problemID, "ro");
        }
    };

    return RO;
}

function getDEFlag()
{
    var DE = document.createElement("img");
    DE.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAIAAAD5gJpuAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHd" +
            "hcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGzSURBVHjaYvTxcWb4+53h3z8GZpZff/79+v3n/7/fDAz/GHAAgABi+f37e3FxOZD1Dwz+/" +
            "v3z9y+E/AMFv3//+Qumfv9et241QACxMDExAVWfOHkJJAEW/gUEP0EQDn78+AHE/gFOQJUAAcQiy8Ag8O+fLFj1n1+/QDp+/gQioK7fP37" +
            "8+vkDqOH39x9A/RJ/gE5lAAhAYhzcAACCQBDkgRXRjP034R0IaDTZTFZn0DItot37S94KLOINerEcI7aKHAHE8v/3r/9//zIA1f36/R+o4" +
            "tevf1ANYNVA9P07RD9IJQMDQACxADHD3z8Ig4GMHz+AqqHagKp//fwLVA0U//v7LwMDQACx/LZiYFD7/5/53/+///79BqK/EMZ/UPACSYa" +
            "/v/8DyX9A0oTxx2EGgABi+a/H8F/m339BoCoQ+g8kgRaCQvgPJJiBYmAuw39hxn+uDAABxMLwi+E/0PusRkwMvxhBGoDkH4b/v/+D2EDyz" +
            "///QB1/QLb8+sP0lQEggFh+vGXYM2/SP6A2Zoaf30Ex/J+PgekHwz9gQDAz/P0FYrAyMfz7wcDAzPDtFwNAgAEAd3SIyRitX1gAAAAASUV" +
            "ORK5CYII=";
    
    DE.alt = "Germany";
    DE.title = "German";
    DE.style.cursor = "pointer";
    
    DE.onclick = function() {
        var problemID = getProblemID();
        
        if (! isNaN(problemID) && problemID !== -1) {
            setNewTranslation(problemID, "de");
        }
    };

    return DE;
}

function getKRFlag()
{
    var KR = document.createElement("img");
    KR.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAIAAAD5gJpuAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHd" + 
            "hcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHDSURBVHjaYjSs/f/lBwME/Pn379cfIMnw6xfDrz9A9r/fIA4SYmMACCDGgzf/q4iBlf///" +
            "5+B4d9/KPMfCIMY/xn+//sH4f4/duMLQAAxfmRgZO/v+/fiFcNfkJkMLEz/v3wB6fn95//fPyDy9+9/f37///WbSUry+ZzZAAHEApRifPW" +
            "KiYmBOSiEUV6e8efPX6tX/9m9m+HXb4bfv0Do129GoBN//2b49YOJgQEggJj+AZ3x9y+zv/+/W7f+P7j/a8cO5qCg/2xs/379AqK/P3/9/" +
            "QVCf4Dc30DdDAABBNLA8Ocvg6gIk77+z1Wrmays/vPwMIiI/P8N0gB0z3+wTiD5/8+fPwwMAAHEBHIu0K0vXv7evIklIODP9u0M37//e/7" +
            "838+fIEU/f0JVg20AKgYIIKAfGBiBdi1ZwpaY+F9SgkVN7Wdt7f83bxjBZgOdDvEA0HgmIGJgAAggFqAt/3h4/j169K29AxRQwOD78pWBi" +
            "+s/K+s/sDpwKAFj588/QUFghAEEEMups9+1pFlAgQ0Nc0iog6MCLAQR/weSY9hx6jVAADEyx3/9+wEWkcB4BRryC4kLj+l/QDYDAx8DQIA" +
            "BAA2EWORnICKSAAAAAElFTkSuQmCC";
    
    KR.alt = "Korea";
    KR.title = "Korean";
    KR.style.cursor = "pointer";
    
    KR.onclick = function() {
        var problemID = getProblemID();
        
        if (! isNaN(problemID) && problemID !== -1) {
            setNewTranslation(problemID, "kr");
        }
    };
    
    return KR;
}

function getRUFlag()
{
    var RU = document.createElement("img");
    RU.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAIAAAD5gJpuAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHd" +
            "hcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAE2SURBVHjaYvz69T8DAvz79w9CQVj/0MCffwwAAcQClObiAin6/x+okxHMgPCAbOb//5n+I" +
            "4EXL74ABBALxGSwagTjPzbAyMgItAQggBg9Pf9nZPx//x7kjL9////9C2QAyf9//qCQQCQkxFhY+BEggFi2b/+nq8v46BEDSPQ3w+8//3/" +
            "/BqFfv9BJeXmQEwACCOSkP38YgHy4Bog0RN0vIOMXVOTPH6Cv/gEEEEgDxFKgHEgDXCmGDUAE1AAQQCybGZg1f/d8//XsH0jTn3+///z79" +
            "RtE/v4NZfz68xfI/vOX+4/0ZoZFAAHE4gYMvD+3/v2+h91wCANo9Z+/jH9VxBkYAAKIBRg9TL//MEhKAuWAogxgZzGC2CCfgUggAoYdGAE" +
            "VAwQQ41egu5AQAyoXTQoIAAIMAD+JZR7YOGEWAAAAAElFTkSuQmCC";
    
    RU.alt = "Russia";
    RU.title = "Russian";
    RU.style.cursor = "pointer";
    
    RU.onclick = function() {
        var problemID = getProblemID();
        
        if (! isNaN(problemID) && problemID !== -1) {
            setNewTranslation(problemID, "ru");
        }
    };
    
    return RU;
}

function getUKFlag()
{
    var UK = document.createElement("img");
    UK.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAIAAAD5gJpuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJ" +
            "lYWR5ccllPAAAAflJREFUeNpinDRzn5qN3uFDt16+YWBg+Pv339+KGN0rbVP+//2rW5tf0Hfy/2+mr99+yKpyOl3Ydt8njEWIn8f9zj639" +
            "NC7j78eP//8739GVUUhNUNuhl8//ysKeZrJ/v7z10Zb2PTQTIY1XZO2Xmfad+f7XgkXxuUrVB6cjPVXef78JyMjA8PFuwyX7gAZj97+T2e" +
            "9o3d4BWNp84K1NzubTjAB3fH0+fv6N3qP/ir9bW6ozNQCijB8/8zw/TuQ7r4/ndvN5mZgkpPXiis3Pv34+ZPh5t23//79Rwehof/9/NDEg" +
            "MrOXHvJcrllgpoRN8PFOwy/fzP8+gUlgZI/f/5xcPj/69e/37//AUX+/mXRkN555gsOG2xt/5hZQMwF4r9///75++f3nz8nr75gSms82jf" +
            "vQnT6zqvXPjC8e/srJQHo9P9fvwNtAHmG4f8zZ6dDc3bIyM2LTNlsbtfM9OPHH3FhtqUz3eXX9H+cOy9ZMB2o6t/Pn0DHMPz/b+2wXGTvP" +
            "lPGFxdcD+mZyjP8+8MUE6sa7a/xo6Pykn1s4zdzIZ6///8zMGpKM2pKAB0jqy4UE7/msKat6Jw5mafrsxNtWZ6/fjvNLW29qv25pQd///n" +
            "+5+/fxDDVbcc//P/zx/36m5Ub9zL8+7t66yEROcHK7q5bldMBAgwADcRBCuVLfoEAAAAASUVORK5CYII=";
    
    UK.alt = "United Kingdom";
    UK.title = "British English";
    UK.style.cursor = "pointer";
    
    UK.onclick = function() {
        var problemID = getProblemID();
        
        if (! isNaN(problemID) && problemID !== -1) {
            setNewTranslation(problemID, "en");
        }
    };
    
    return UK;
}

function insertFlags()
{
    var UK = getUKFlag();   //UK
    var RO = getROFlag();   //Romania
    var RU = getRUFlag();   //Russia
    var KR = getKRFlag();   //Korea
    var DE = getDEFlag();   //Germany
    
    var flagsParagraph = document.createElement("p");
    
    UK.style.marginRight = "12px";
    RO.style.marginRight = "12px";
    RU.style.marginRight = "12px";
    KR.style.marginRight = "12px";
    
    flagsParagraph.appendChild(UK);
    flagsParagraph.appendChild(RO);
    flagsParagraph.appendChild(RU);
    flagsParagraph.appendChild(KR);
    flagsParagraph.appendChild(DE);
    
    flagsParagraph.style.display = "block";
    flagsParagraph.style.marginLeft = "auto";
    flagsParagraph.style.marginRight = "auto";
    flagsParagraph.style.textAlign = "center";
    
    // reference node
    var refNode = document.getElementById("content");
    
    // insert before
    refNode.parentNode.insertBefore(flagsParagraph, refNode);
}

function insertTranslationProcessing()
{
    var pscript = document.createElement('script');
    
    pscript.setAttribute('type', 'text/javascript');
    
    pscript.setAttribute('src', 'https://raw.githubusercontent.com/SoboLAN/projecteuler-translation-script/master/processtranslation.js');
    
    var bodyElement = document.getElementsByTagName('body')[0];
    
    bodyElement.insertBefore(pscript, bodyElement.firstChild);
}

var problemID = getProblemID();

if (! isNaN(problemID) && problemID !== -1) {
    insertFlags();
    
    insertTranslationProcessing();
}