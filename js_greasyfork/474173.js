// ==UserScript==
// @name         sort fandoms by number of works
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  adaptation of a js script sorting fandoms by number of works to work in Tampermonkey
// @author       unknown
// @match        https://archiveofourown.org/media/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474173/sort%20fandoms%20by%20number%20of%20works.user.js
// @updateURL https://update.greasyfork.org/scripts/474173/sort%20fandoms%20by%20number%20of%20works.meta.js
// ==/UserScript==

(function()
 {
    function extractLinkcounts(e)
        {
            var t=fandomList[e].innerHTML;
            var n=t.indexOf("</a>")+4;
            var r=t.slice(t.indexOf("href=\"")+6,t.indexOf("\"",t.indexOf("href=\"")+6));
            var i=t.slice(t.indexOf(">")+1,t.lastIndexOf("<"));
            var s=t.substr(n);
            var o=s.slice(s.indexOf("(")+1,s.indexOf(")"));
            numericalList.push({href:r,text:i,count:+o})
        }
    var fandomGroup=document.querySelectorAll("ol.fandom.index.group");
    if(fandomGroup[0]!=undefined&&fandomGroup[0].classList.contains("zzz-numerical")==false)
    {
        fandomGroup[0].classList.add("zzz-numerical");
        var fandomList=document.querySelectorAll("ul.tags.index.group > li");
        var numericalList=[];
        for(var i=0;i<fandomList.length;i++)
        {
            extractLinkcounts(i);
        }
        numericalList.sort(function(e,t){return t.count-e.count;});
        var alphabetElems=document.querySelectorAll(".letter.listbox.group, .alphabet.navigation");
        for(var j=0;j<alphabetElems.length;j++)
        {
            alphabetElems[j].style.display="none";
        }
        var fandomNumerical=document.createElement("li");
        fandomNumerical.setAttribute("class","letter listbox group");
        var numericalHeading=document.createElement("h3");
        numericalHeading.setAttribute("class","heading");
        numericalHeading.innerHTML="Descending Order by Number of Works";
        fandomNumerical.appendChild(numericalHeading);
        var fandomIndex=document.createElement("ul");
        fandomIndex.setAttribute("class","tags index group");
        fandomGroup[0].appendChild(fandomNumerical);
        fandomNumerical.appendChild(fandomIndex);
        for(var k=0;k<numericalList.length;k++)
        {
            var fandomItem=document.createElement("li");
            if(k%2==0)
            {
                fandomItem.setAttribute("class","odd");
            }
            else
            {
                fandomItem.setAttribute("class","even");
            }
            var fandomAnchor=document.createElement("a");
            fandomAnchor.setAttribute("href",numericalList[k].href);
            fandomAnchor.setAttribute("class","tag");
            fandomAnchor.innerHTML=numericalList[k].text;
            fandomItem.appendChild(fandomAnchor);
            if(numericalList[k].count>0)
            {
                var fandomCount=document.createTextNode("  ("+numericalList[k].count+")");
                fandomItem.appendChild(fandomCount);
            }
            fandomIndex.appendChild(fandomItem);}
    }
})
();