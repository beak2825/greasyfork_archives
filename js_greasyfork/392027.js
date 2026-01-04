// ==UserScript==
// @name Nyaa Extract Links and Images
// @version 2.1
// @description extract links and images from inside the description page to the listing page
// @author JasonC
// @match https://nyaa.si/
// @match https://nyaa.si/?*
// @match https://*.nyaa.si/
// @match https://*.nyaa.si/?*
// @grant none
// @namespace https://greasyfork.org/users/165799
// @downloadURL https://update.greasyfork.org/scripts/392027/Nyaa%20Extract%20Links%20and%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/392027/Nyaa%20Extract%20Links%20and%20Images.meta.js
// ==/UserScript==

var pause = true;
var torRows = new Array();
var torlist = document.getElementsByClassName('torrent-list')[0];

function FilterRows()
{
    var filter = parseInt(prompt("Minimum Seeds","-1"));
    if (!isNaN(filter) && filter > 0){
        for(var i=0;i<torlist.rows.length;i++){
            if (parseInt(parseInt(torlist.rows[i].cells[5].innerText)) < filter) {
                torlist.deleteRow(i);i--;
            }
        }
    }
    filter = parseInt(prompt("Minimum Leeches","-1"));
    if (!isNaN(filter) && filter > 0){
        for(var j=0;j<torlist.rows.length;j++){
            if (parseInt(parseInt(torlist.rows[j].cells[6].innerText)) < filter) {
                torlist.deleteRow(j);j--;
            }
        }
    }
    filter = parseInt(prompt("Minimum Downloads","-1"));
    if (!isNaN(filter) && filter > 0){
        for(var k=0;k<torlist.rows.length;k++){
            if (parseInt(parseInt(torlist.rows[k].cells[7].innerText)) < filter) {
                torlist.deleteRow(k);k--;
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
    var containers = document.getElementsByClassName('container');
    while (containers.length > 0){
        containers[0].classList.remove("container");
    }
    if (pause){return;}
	var torRow = torRows.shift();
    torRow.cells[0].style.overflow = "auto";
    torRow.cells[0].style.maxWidth = "400px";
    torRow.cells[1].style.verticalAlign = "top";
	var torurl = torRow.getElementsByTagName("A")[1].href;
	var ifrm = document.createElement("IFRAME");
	ifrm.src = torurl;
	ifrm.style.width = "0px";
	ifrm.style.height = "0px";
	ifrm.onload = function() {
        try
        {
            var desc = this.contentDocument.getElementById('torrent-description');
            var LINKs = desc.getElementsByTagName("A");
            while (LINKs.length > 0){
                var inlink = LINKs[0];
                var link = document.createElement("A");
                link.style.maxWidth = "400px";
                link.href = inlink.href;
                link.innerHTML = inlink.innerHTML;
                torRow.cells[0].appendChild(document.createElement("br"));
                torRow.cells[0].appendChild(link);
                LINKs[0].parentElement.removeChild(LINKs[0]);
            }
            var IMGs = desc.getElementsByTagName("IMG");
            while(IMGs.length>0){
                var inimg = IMGs[0];
                var img = document.createElement("IMG");
                img.src = inimg.src;
                img.style.maxWidth = "400px";
                torRow.cells[0].appendChild(document.createElement("br"));
                torRow.cells[0].appendChild(img);
                IMGs[0].parentElement.removeChild(IMGs[0]);
            }
        }
        catch(e){}
        finally
        {
            this.parentElement.removeChild(this);
            if (torRows.length > 0){
                ExtractImage();}
        }
	};
	torRow.cells[0].appendChild(ifrm);
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