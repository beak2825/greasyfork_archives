// ==UserScript==
// @name 1337x Extract Links and Images
// @version 1.6
// @description CLICK START BUTTON TO BEGIN! Filters listings by seeders/looters count. Extract magnet, links and images from inside the description page to the listing page
// @author JasonC
// @match https://1337x.to/
// @match https://1337x.to/*
// @grant none

// @namespace https://greasyfork.org/users/165799
// @downloadURL https://update.greasyfork.org/scripts/468092/1337x%20Extract%20Links%20and%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/468092/1337x%20Extract%20Links%20and%20Images.meta.js
// ==/UserScript==

var pause = true;
var torRows = new Array();
var torlist = document.getElementsByClassName('table-list-wrap')[0].children[0];

function FilterRows()
{
    var filter = parseInt(prompt("Minimum Seeds","-1"));
    if (!isNaN(filter) && filter > 0){
        for(var i=1;i<torlist.rows.length;i++){
            if (parseInt(parseInt(torlist.rows[i].cells[1].innerText)) < filter) {
                torlist.deleteRow(i);i--;
            }
        }
    }
    filter = parseInt(prompt("Minimum Leeches","-1"));
    if (!isNaN(filter) && filter > 0){
        for(var j=1;j<torlist.rows.length;j++){
            if (parseInt(parseInt(torlist.rows[j].cells[2].innerText)) < filter) {
                torlist.deleteRow(j);j--;
            }
        }
    }
    for (var l=1;l<torlist.rows.length;l++)
    {
        torRows.push(torlist.rows[l]);
    }
}

function ExtractImage()
{
    if (pause){return;}
	var torRow = torRows.shift();
    torRow.cells[0].style.overflow = "auto";
    torRow.cells[0].style.maxWidth = "400px";
    torRow.cells[1].style.verticalAlign = "top";
	var torurl = torRow.cells[0].children[1].href;
    console.log(torurl);
    $.get(torurl, function (html) {
        if (html) {
            try
            {
                 $(html).find("A").each(function() {
                     if (this.href.indexOf("magnet:") != -1)
                     {
                         torRow.cells[0].appendChild(this);
                         return false;
                     }
                 });
                var UsedArr = new Array();
                $(html).find("#description").find("A").each(function() {
                    UsedArr.push($(this)[0].outerHTML);
                    var link = document.createElement("A");
                    link.style.maxWidth = "400px";
                    link.href = $(this).attr('href');
                    link.innerHTML = $(this).html();
                    torRow.cells[0].appendChild(document.createElement("br"));
                    torRow.cells[0].appendChild(link);
                    var IMGs = link.getElementsByTagName("IMG");
                    for (var i=0;i<IMGs.length;i++)
                    {
                        if (IMGs[i].attributes["data-original"])
                            IMGs[i].src = IMGs[i].attributes["data-original"].value;
                    }
                });
                $(html).find("#description").find("IMG").each(function() {
                    var imgHTML = $(this)[0].outerHTML;
                    var SkipThis = false;
                    for(var i=0;i<UsedArr.length;i++)
                    {
                        if (UsedArr[i].indexOf(imgHTML) != -1){
                            SkipThis = true;
                        }
                    }
                    if (!SkipThis)
                    {
                        var img = document.createElement("IMG");
                        img.src = $(this).attr('data-original');
                        img.style.maxWidth = "400px";
                        torRow.cells[0].appendChild(document.createElement("br"));
                        torRow.cells[0].appendChild(img);
                    }
                });
            }
            catch(e){}
            finally
            {
                //this.parentElement.removeChild(this);
                if (torRows.length > 0){
                    ExtractImage();}
            }
        }
    },'html');
}

(function() {
    var MainBtn = document.createElement('INPUT');
    MainBtn.type = 'button';
    MainBtn.style.position = 'fixed';
    MainBtn.style.top = '10px';
    MainBtn.style.left = '10px';
    MainBtn.style.zIndex = "9999";
    MainBtn.value = 'Start';
    MainBtn.onclick = function() {
        pause = !pause;
        if (pause){
            MainBtn.value = "Stop";
        }
        else{
            MainBtn.value = "Start";
        }
        FilterRows();
        ExtractImage();
    };
    document.body.appendChild(MainBtn);
})();