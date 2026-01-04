// ==UserScript==
// @name         IMDB Copy Buttons V2
// @namespace    http://kmcgurty.com/
// @version      1.4.4
// @description  Buttons
// @author       Kmcgurty
// @match        https://www.imdb.com/title/*
// @match        https://www.imdb.com/name/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/374988/IMDB%20Copy%20Buttons%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/374988/IMDB%20Copy%20Buttons%20V2.meta.js
// ==/UserScript==

var css = {};
css.transitiontime = 750;
css.directorleft = "2";

//not sure why firefox and chrome display this button differently
var isFirefox = typeof InstallTrigger !== 'undefined';
if(isFirefox){css.directorleft = "-1"};

GM_addStyle(`.copybutton:active,.copybutton{font-size:13px;padding:0;margin:0 0 0 2px;width:50px;height:18px;position:relative;overflow:hidden}.copybutton::before{content:"Copy";position:absolute;left:7px}.copybutton::after{content:"Copied";position:absolute;left:3px;top:15px;font-size:12px;pointer-events:none}.copybutton::after,.copybutton::before{transition:top ${css.transitiontime*.35}ms}.copybutton.clicked::after{top:0}.copybutton.unclicked::after{top:18px}.copybutton.clicked::before{top:-18px !important}.copybutton.unclicked::before{top:-1px}.copybutton:focus{outline:0}#yearbutton::before{content:"+Year";left:4px}#idbutton::before{content:"ID";left:15px}#directorbutton::before{content:"+Director";left:${css.directorleft}px;top:2px;font-size:9px}.itemprop .copybutton{margin-left:5px}`);

(function main(){
    addButtons();

    if(window.location.href.match("/name/")) {
        relocateAltNames();
    }
})();

function addButtons(){
    var titleNode = document.querySelector("h3[itemprop='name'], #overview-top h1");

    var br = document.createElement("br");
    titleNode.appendChild(br);

    //title button
    var copyText = titleNode.childNodes[0].textContent.trim() || titleNode.querySelector("span").textContent.trim();
    var button = createButton(copyText, "titlebutton");
    titleNode.appendChild(button);

    if(window.location.href.match("/title/")){
        //+year button
        copyText = titleNode.textContent.replace(/ +\n +/, " ").trim();
        button = createButton(copyText, "yearbutton");
        titleNode.appendChild(button);


        //+director button
        var directorName = document.querySelector(".titlereference-overview-section li").textContent.replace(/\n/g,"").trim();
        var title = titleNode.childNodes[0].textContent.trim();
        copyText = title + " - " + directorName;
        button = createButton(copyText, "directorbutton");
        titleNode.appendChild(button);


        //alt title button
        var altTitleNode = titleNode.nextSibling;
        if(altTitleNode.textContent.trim()){
            copyText = altTitleNode.textContent.replace(/ +\n +/, " ").trim();
            button = createButton(copyText);
            altTitleNode.parentNode.insertBefore(button, altTitleNode.nextSibling.nextSibling);
        }


        //director/creator button
        var directorNode = document.querySelector(".titlereference-overview-section li")
        copyText = directorName;
        button = createButton(copyText);
        directorNode.appendChild(button);
    }


    //id button
    copyText = window.location.pathname.split('/')[2];
    button = createButton(copyText, "idbutton");
    titleNode.appendChild(button);


    //actor names and movies, everything below the title

    var listToAppend = document.querySelectorAll(".itemprop a, .crew_list a, .writers_list a, .filmo-row b");

    for(var i = 0; i < listToAppend.length; i++){
        var copyText = listToAppend[i].textContent.trim();
        button = createButton(copyText);

        if(window.location.href.match("/title/")){
            var td = document.createElement("td");
            td.appendChild(button);

            listToAppend[i].parentElement.parentElement.appendChild(td);
        } else if(window.location.href.match("/name/")) {
            listToAppend[i].parentElement.querySelector(".year_column").appendChild(button);
        }
    }
}

function relocateAltNames(){
    var altNames = document.querySelector("#details-akas");
    if(altNames){
        var names = altNames.textContent.replace(/\n|Alternate Names:\W +/gm, "").trim().split(" | ").join(", ");

        var h4 = document.createElement("h4");
        h4.setAttribute("class", "inline");
        var text = document.createTextNode("Alternative names:");
        h4.appendChild(text);

        var altNamesDiv = document.createElement("div");
        altNamesDiv.setAttribute("class", "alt-names txt-block");
        altNamesDiv.appendChild(h4)
        text = document.createTextNode(names);
        altNamesDiv.appendChild(text);

        var copyButton = createButton(names);
        altNamesDiv.appendChild(copyButton);

        document.querySelector("#overview-top").appendChild(altNamesDiv);
    }
}

function createButton(copytext, elementID){
    var elementID = elementID || "";

    var button = document.createElement('button');
    button.setAttribute("class", "copybutton linkasbutton-secondary unclicked");
    button.setAttribute("id", elementID);
	button.setAttribute("data-copytext", copytext);

    button.addEventListener("click", function(e){
        GM_setClipboard(e.target.getAttribute("data-copytext"));
        e.target.setAttribute("class", "copybutton linkasbutton-secondary clicked");

        setTimeout(function(){
            e.target.setAttribute("class", "copybutton linkasbutton-secondary unclicked");
        }, css.transitiontime);
    });

    return button;
}