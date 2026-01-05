// ==UserScript==
// @name         KickassTorrents/ExtraTorrents/PirateBay Screenshot Redirect.
// @version      0.3
// @description  Redirects user to one of the screenshot links in the torrent's description after a delay. Also includes a link to search for screenshots on google images using a cleaned up version of the torrent's title.
// @match        katcr.co/*
// @match        kat.am/*
// @match        kickass.cd/*
// @match        http://kickasstorrents.to/*
// @match        thepiratebay.org/torrent/*
// @match        http://extratorrent.cc/torrent/*
// @namespace https://greasyfork.org/users/13708
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/11280/KickassTorrentsExtraTorrentsPirateBay%20Screenshot%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/11280/KickassTorrentsExtraTorrentsPirateBay%20Screenshot%20Redirect.meta.js
// ==/UserScript==

//Amount of seconds to delay before redirecting. 
var TotalSeconds = 5;
//Phrases to look for in links located in the description when deciding which links go to image hosting sites. 
var terms = ["funimg","img24","imagebic","imgsay","imgurx","xxximagetpb","imagepearl","pic2pic","imagep2p","imgextra","imagescream","picturescream","3xplanet","dumppix","xxximagenow","porno-pirat","imgboxxx","imageteam","imgcandy","freeimgup","imgcream","imgserve","xxxhost","imgsin","imgstudio","imgchili","gallerynova","imgdino","imgseeds","imgmega","imgzap","imgtiger","imagedecode","pixsor","imgstudio","imgtrex","damimage","imgclick","imgbb","screen"];
//Secondary link phrases that are only accepted if no links are found containing any of the primary phrases.
var SecondaryTerms = ["pornleech"];
//Phrases to take out of the torrent's title when adding it to the screenshot search link.
var titleterms = ["mp4","KTR","rarbg","INTERNAL","XviD","HEVC","x265","N1C"," xxx "," HD "," XXX ","1080p","720p","Split Scenes","2160p","new release","dvdrip"," sd ","new","web-dl","x264","sparrow"];
//List of JAV studio codes to look for in the title.
var javstudios = ["ZBES","MIDE","HUNTA","BTD","LXVS","ATOM","SW ","LEM","HAR","KV","NRS","ATFB","KCPN","BLK","IPZ","ALB","LZDQ","JUX","MANA","BDSR","CB","MVSD","KIDM","JMRD","MDSH","GAS","VOSS","NNPJ","FTN","PPPD","SNIS","VRTM","AOZ","OFJE","SERO","GDHH","NEO","S-Cute","MXSPS","TUS","FAA","MUNJ","CEAD","MUKD","TEAM","DIC","GVG","ONET","MIAD"];

//Empty variables.
var timer;
var titletermregex;
var dateregex;
var titledate;
var goodlink;
//var torrentitle;

//Transfers the user set TotalSeconds time to variables used in the different tick functions.
var TickSeconds = TotalSeconds;
var GoogleTickSeconds = TotalSeconds;

//Grab the description element.
if(window.location.href.indexOf("http://extratorrent.cc/") != -1){
    var desc = document.getElementsByClassName("bbcode_center")[0];
}else if(window.location.href.indexOf("thepiratebay.org") != -1){
    var desc = document.getElementsByClassName("nfo")[0];
    var col1 = document.getElementsByClassName("col1")[0];
    if(col1.innerHTML.indexOf("Porn") == -1){
        return;
    }
}else{
var desc = document.getElementById("desc");
}

//Create an element for redirect information.
var node = document.createElement("P");
desc.insertBefore(node,desc.childNodes[0]); 

//Grab the title of the torrent.
if(window.location.href.indexOf("http://extratorrent.cc/") != -1){
    var torrenttitle = document.getElementsByTagName("h1")[0].innerHTML;
    torrenttitle = torrenttitle.slice(3);
    torrenttitle = torrenttitle.slice(0,torrenttitle.length - 14);
}else if(window.location.href.indexOf("thepiratebay.org/torrent/") != -1){
    var torrenttitle = document.getElementById("title").innerHTML;
}else{
    var torrenttitle = document.getElementsByClassName("novertmarg")[0].getElementsByTagName("a")[0].textContent;
}

if(window.location.href.indexOf("http://extratorrent.cc/") == -1){
    //Go through the terms list and remove any instances of them from the title.
    for (var i3 = 0 ; i3 < titleterms.length; i3++){
        titletermregex = new RegExp(titleterms[i3],"gi");
        torrenttitle = torrenttitle.replace(titletermregex," ");
    }

    var javfound = false;

    //More title cleaning up.
    torrenttitle = torrenttitle.replace(/[\-\[\]\/\{\}\(\)\=\*\+\.\,\\\^\$\|]/g, " "); //Remove special characters.
    torrenttitle = torrenttitle.replace(/\s+/g, " "); //Removes any uncessesary spaces.

    function JAVStudioFinder(){
        for(var i = 0 ; i < javstudios.length; i++){
            if(torrenttitle.indexOf(javstudios[i]) >= 0){
                regex = new RegExp(javstudios[i] + " \\d*", "g");
                console.log(regex);
                var JAVnum = torrenttitle.match(regex);
                //torrenttitle = JAVnum;
                javfound = true;       
                return;
            }
        }
    }

    JAVStudioFinder();
}

//Create an element for title search information.
var searchnode= document.createElement("P");
searchnode.id = "searchelement";
desc.insertBefore(searchnode,desc.childNodes[0]); 
searchnode.style.textAlign = "center";
searchnode.style.fontWeight = "bold";

//Creates links for Google & Bing searches and places them in an element.
var googlelink = document.createElement('a');
var googlelinktext = document.createTextNode("Search Google Images for screenshots.");
googlelink.appendChild(googlelinktext);
googlelink.id = "GoogleLink";
if(javfound){
    googlelink.href = "https://www.google.com/search?site=imghp&tbm=isch&q=" + torrenttitle + "+JAV";
}else{
    googlelink.href = "https://www.google.com/search?site=imghp&tbm=isch&q=" + torrenttitle + "+Porn";
}

//console.log("googlelink.href = " + googlelink.href);
var binglink = document.createElement('a');
var binglinktext = document.createTextNode("Search Bing Images for Screenshots.");
binglink.appendChild(binglinktext);
binglink.id = "BingLink";
binglink.href = "http://www.bing.com/images/search?q=" + torrenttitle;
//Add the links and some formatting to searchnode.
searchnode.appendChild(document.createElement("hr"));
searchnode.appendChild(document.createElement("br"));
searchnode.appendChild(googlelink);
searchnode.appendChild(document.createElement("br"));
searchnode.appendChild(document.createElement("br"));
searchnode.appendChild(binglink);

//Gather all the links in the descripton.
var templinks = desc.getElementsByTagName('a');
//Transfer the HTMLCollection into an array.
var links = [].slice.call(templinks);

//Removes the Google and Bing search links from the list of links so they don't accidently become the redirect link.
findWithAttr(links, 'id', 'GoogleLink'); 
findWithAttr(links, 'id', 'BingLink'); 
function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i++) {
        if(array[i][attr] == value) {
            links.splice(i, 1);
        }
    }
}
LinkFinder();

//Find the last link in the description that includes one of the terms. 
function LinkFinder(){
    for (var i2 = links.length-1; i2 > -1; i2 = i2-1){
        for (var i = 0 ; i < terms.length; i++){//Go through the list of terms.
            if(links[i2].innerHTML.toLowerCase().indexOf(terms[i]) > -1 && links[i2].href.indexOf("/user/") == -1){ //If the link has a term in it, AND does not link to a userpage.
                goodlink = links[i2]; //Save that link in a variable.
                Tick(); //Start the redirect timer.
                return;
            }
        }
        if (typeof SecondaryGoodLink === 'undefined'){
            for (var i3 = 0 ; i3 < SecondaryTerms.length; i3++){ //Go through the list of secondary terms.
                if(links[i2].innerHTML.toLowerCase().indexOf(SecondaryTerms[i3]) > -1 && links[i2].href.indexOf("/user/") == -1){ //If the link contains a secondaryterm in it, AND does not link to a userpage.
                    var SecondaryGoodLink = links[i2];
                }
            }
        }
    }
    if (typeof SecondaryGoodLink != 'undefined'){
        goodlink = SecondaryGoodLink;
        Tick();
        return;
    }
    GoogleTick();
}

//Countdown for the screenshot redirect.
function Tick() {
    TickSeconds--; //Remove one second from the remaning seconds.
    node.innerHTML = "<hr><center><br><b>Redirecting to screenshot in " + TickSeconds + " seconds.<br><br><p id='timerbutton'>Click here to stay on this page.</p></b></center><hr>"; //Update the amount of time left in the display.
    timer = setTimeout(Tick, 1000); //Start a one second timer to restart this function.
    document.getElementById("timerbutton").onclick=function(){clearTimeout(timer);}; //If the "stay on this page" button is pressed, stop the timer.
    if (TickSeconds === 0){ //If the countdown reaches 0...
        location.assign(goodlink); //Redirect to the screenshot link.
    }
}

//Countdown for the Google redirect.
function GoogleTick() {
    GoogleTickSeconds--; //Remove one second from the remaning seconds.
    node.innerHTML = "<hr><center><br><b>No screenshot link found. Searching Google in " + GoogleTickSeconds + " seconds.<br><br><p id='timerbutton2'>Click here to stay on this page.</p></b></center><hr>"; //Update the amount of time left in the display.
    timer = setTimeout(GoogleTick, 1000); //Start a one second timer to restart this function.
    document.getElementById("timerbutton2").onclick=function(){clearTimeout(timer);}; //If the "stay on this page" button is pressed, stop the timer.
    if (GoogleTickSeconds === 0){ //If the countdown reaches 0...
        location.assign(googlelink.href); //Redirect to the Google link.
    }
}

//Grab Google Image Thumbnails
GM_xmlhttpRequest({
    method: "GET",
    url: googlelink.href + "&sout=1",
    onload: function(response) {
        var googleimagenode = document.createElement("P");
        googleimagenode.style.visibility='hidden';
        googleimagenode.innerHTML = response.responseText;
        var googleimages = googleimagenode.getElementsByTagName("img");
        var googleimageresults = document.createElement("P");
        googleimageresults.id = "googleimageresultslement";
        desc.insertBefore(googleimageresults,desc.childNodes[0]);
        googleimageresults.style.textAlign = 'center';
        googleimageresults.appendChild(document.createElement("hr"));
        googleimageresults.innerHTML = googleimageresults.innerHTML + "<b>Google Image Results:</b><br>";
        googleimageresults.appendChild(document.createElement("br"));
        //for (var i = 2 ; i < googleimages.length; i++){
        for (var i = 2 ; i < 12; i++){
            var img = document.createElement("img");
            img.src = googleimages[i].src;
            var imglink = document.createElement('a');
            imglink.setAttribute('href', googleimages[i].parentNode.href);
            var brokenhref = imglink.href;
            var fixedhref = brokenhref.substr(brokenhref.indexOf("url?q=") + 6);
            var fixedhref = fixedhref.slice(0,fixedhref.indexOf("&sa=U"));
            imglink.setAttribute('href', fixedhref);
            imglink.appendChild(img);
            googleimageresults.appendChild(imglink);
        }
    }
});