// ==UserScript==
// @name         GGn Torrent Gallery
// @namespace    idkwhatimmeanttoputhere
// @version      0.01
// @description GGn Torrent Gallery Script
// @include      https://gazellegames.net/torrents.php*
// @grant GM.xmlHttpRequest
// @grant GM_xmlhttpRequest
// @author       RobotFish
// @downloadURL https://update.greasyfork.org/scripts/372435/GGn%20Torrent%20Gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/372435/GGn%20Torrent%20Gallery.meta.js
// ==/UserScript==
// 
// This is basically a frankenstein script combinding parts of NeutronNoir's image
// hover script with parts of Akko's OT Torrent Gallery script and held together by
// some terrible code I've written.
//
// Please someone who can actually code, get angry at this script for not doing
// something you want and re-write it :^) (no comments btw)
//
// I made it grab more info than it actually uses because I planned to make it do
// other things like different header colours for different systems and seperating
// sticky's from non-stickys (and giving the ability to hide them) but I've already
// spent like 5 hours on this and I'm bored now.
// Maybe I'll come back to it another day.
// 
// Violentmonkey users scroll down to initImages and comment out GM.xmlHttpRequest
// and uncomment GM_xmlhttpRequest.
// Tampermonkey users, don't use Tampermonkey.
// 

function Torrent(link, name, platform, year, ageRating, userRating, checked, sticky){
	this.link = link;
	this.name = name;
	this.img = "";
	this.platform = platform;
	this.year = year;
	this.ageRating = ageRating;
	this.userRating = userRating;
	this.checked = checked;
	this.sticky = sticky;
}
let groups = [];
let showGallery = localStorage.getItem("galleryView") == "false" ? false : true;
let altPage = window.location.href.split("&type=").length > 1 || window.location.href.split("?type=").length > 1
var init = function(){
	initTorrentInfo();
	initGallery();
	initGroups();
	initImages();
	//I can't be bothered anymore, this works.
	toggleGallery();
	toggleGallery();
}

var toggleGallery = function(){
	if(showGallery){
		localStorage.setItem("galleryView", false);
		showGallery = !showGallery
		document.getElementById("collageBody").style.display = "none";
		if(altPage){
			document.getElementById("content").children[0].children[4].children[0].style.display = ""
		} else {
			document.getElementById("content").children[1].children[4].children[0].style.display = ""
		}
	} else {
		showGallery = !showGallery
		localStorage.setItem("galleryView", true);
		document.getElementById("collageBody").style.display = "";
		if(altPage){
			document.getElementById("content").children[0].children[4].children[0].style.display = "none"
		} else {
			document.getElementById("content").children[1].children[4].children[0].style.display = "none"
		}
	}
}

var initImages = function(){
	document.querySelectorAll("[title='View Torrent']").forEach(function (item) {
		var link = item.getAttribute("href");

        GM.xmlHttpRequest({
		//GM_xmlhttpRequest({
			method: "GET",
			url: "/" + link,
			onload: function (response) {
				if (!response.responseXML) response.responseXML = new DOMParser().parseFromString(response.responseText, "text/html");
					var image_src = response.responseXML.querySelector(".box_albumart img").getAttribute("src");
					for(let i=0;i<groups.length;i++){
						if(groups[i].link == link){
							document.getElementById("collageBody").children[i].getElementsByTagName("img")[0].src = image_src;
							break;
						}
					}
			}
		});
	});
}

var initGallery = function(){
	let gallery = document.createElement("div");
	gallery.id = "gallery_view";

	let galleryInfo = document.createElement("div");
	galleryInfo.id = "gallery_info";

	let galleryTitle = document.createElement("strong");
	galleryTitle.innerHTML = "Gallery";

	let galleryToggle = document.createElement("a");
	galleryToggle.id = "galleryToggle";
	galleryToggle.innerHTML = "[Toggle]";
	galleryToggle.style += "float:right; margin-left:5px";

	let collage = document.createElement("div");
	collage.id = "collageBody";

	galleryInfo.append(galleryTitle);
	galleryInfo.append(galleryToggle);
	gallery.append(galleryInfo);
	gallery.append(collage);
	if (altPage){
		document.getElementById("content").children[0].insertBefore(gallery, document.getElementById("content").children[0].children[3])
		document.getElementById("content").children[0].children[4].style = "margin-top:5px;"
	} else {
		document.getElementById("content").children[1].insertBefore(gallery, document.getElementById("content").children[1].children[3])
	}

	let containerWidth = document.getElementById("gallery_view").offsetWidth;
    var torrentsPerRow = Math.floor(containerWidth / 160);
    var torrentWidth = Math.floor(containerWidth / torrentsPerRow);
  
    let style = document.createElement("style");
	style.type = "text/css"
	style.innerHTML = ".groupWrapper{height:auto;width:" + torrentWidth + "px;box-sizing:border-box;float:left;overflow:hidden;padding:3px;margin:0}.releaseMedia{height:auto;width:auto;overflow:hidden}.coverImage{display:block;position:relative;width:100%;height:auto}.releaseDetails{font-size:7pt;overflow:hidden;line-height:1.5em;height:2.9em;margin-bottom:0;padding:3px}#collageBody{position:relative;display:grid;grid-template-columns:repeat(" + torrentsPerRow + ",minmax(" + torrentWidth + "px,1fr));grid-auto-columns:max-content;grid-template-rows:repeat(2);float:left;margin-top:10px;background:rgba(27, 47, 63, 0.6)}.releaseTitle{text-align:center;fontSize:10pt;display:block;padding:10px;overflow:hidden;line-height:12px;white-space:nowrap;text-overflow:ellipsis;background:linear-gradient(#2b4e66, #1c3145);width:" + torrentWidth + "}.hiddenType{color:#525252 !important;text-decoration:line-through}#gallery_view{background:linear-gradient(#2b4e66,#1c3145);padding:5px}#galleryToggle{float:right;margin-left:5px;}";
	document.getElementsByTagName("head")[0].append(style);

    document.getElementById("galleryToggle").addEventListener("click", toggleGallery);
}

var initGroups = function(){
	document.getElementById("collageBody").innerHTML="";
	for(let i=0;i<groups.length;i++){

		let groupWrapper = document.createElement("div");
		let releaseTitle = document.createElement("div");
		let releaseTitleLink = document.createElement("a");
		let releaseMedia = document.createElement("div");
		let imageLink = document.createElement("a");
		let image = document.createElement("img");

		groupWrapper.classList.add("groupWrapper");
		groupWrapper.append(releaseTitle, releaseMedia);

		releaseMedia.classList.add("releaseMedia");
		releaseMedia.append(imageLink);

		releaseTitleLink.href = groups[i].link
		releaseTitleLink.innerHTML = groups[i].name;

		releaseTitle.classList.add("releaseTitle");
		releaseTitle.append(releaseTitleLink);

		image.classList.add("coverImage");
		image.src = groups[i].img;

		imageLink.href = groups[i].link;
		imageLink.append(image);

		document.getElementById("collageBody").append(groupWrapper);
	}
}

var initTorrentInfo = function(){
	if(altPage){
		let torrentList = document.getElementById("content").children[0].children[3].children[0];
		for(let i=1;i<torrentList.children.length;i++){
			if(torrentList.children[i].children[0].children[0].classList[0] == "cats_ost" || torrentList.children[i].children[0].children[0].classList[0] == "cats_applications" || torrentList.children[i].children[0].children[0].classList[0] == "cats_ebooks"){
				groups.push(new Torrent(
				torrentList.children[i].children[1].children[1].children[0].getAttribute("href"),
				torrentList.children[i].children[1].children[1].children[0].innerHTML.split(" <")[0],
				torrentList.children[i].children[0].children[0].classList[0],
				"N/A",
				"N/A",
				"N/A",
				"N/A",
				"N/A"
				))
			} else {
				groups.push(new Torrent(
				torrentList.children[i].children[1].children[2].children[0].getAttribute("href"),
				torrentList.children[i].children[1].children[2].children[0].innerHTML.split(" <")[0],
				torrentList.children[i].children[0].children[0].classList[0],
				"N/A",
				"N/A",
				"N/A",
				"N/A",
				"N/A"
				))
			}
			}
	} else {
		for(let i=0;i<document.getElementsByClassName("group").length;i++){
			let torrent = document.getElementsByClassName("group")[i];
			if(torrent.children[1].children[0].classList[0] == "cats_ost" || torrent.children[1].children[0].classList[0] == "cats_applications" || torrent.children[1].children[0].classList[0] == "cats_ebooks"){
				groups.push(new Torrent(
				torrent.children[2].children[0].children[0].getAttribute("href"),
				torrent.children[2].children[0].children[0].innerHTML,
				torrent.children[1].children[0].classList[0],
				torrent.children[2].children[1].innerHTML.substring(1,5),
				"N/A",
				torrent.children[3].innerHTML,
				torrent.children[10].children[0].classList.contains("checked"),
				torrent.classList.contains("sticky")
				))
			} else {
				groups.push(new Torrent(
				torrent.children[2].children[2].children[0].getAttribute("href"),
				torrent.children[2].children[2].children[0].innerHTML,
				torrent.children[1].children[0].classList[0],
				torrent.children[2].children[3].innerHTML.substring(1,5),
				torrent.children[2].children[4].innerHTML,
				torrent.children[3].innerHTML,
				torrent.children[10].children[0].classList.contains("checked"),
				torrent.classList.contains("sticky")
				))
			}
		}
	}
}

init();