// ==UserScript==
// @name         AniScriptsK
// @namespace    http://tampermonkey.net/
// @version      1.67
// @description  Change stuff on Anilist.co
// @author       Korakys
// @match        https://anilist.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375153/AniScriptsK.user.js
// @updateURL https://update.greasyfork.org/scripts/375153/AniScriptsK.meta.js
// ==/UserScript==

(function(){
scriptVersion = "1.67";
/*
Aniscripts, sometimes just "the userscript", is modular and contains of several independet functions
The URL matching controller can be found near the bottom of this file.

Due to the dynamic nature of how Anilist pages load, these functions are run on a clock.
Functionallity provided by all of these functions are suplemental, so the clock frequenzies are kept slow to not impact performance.
*/


//a shared style node for all the modules. All classes are prefixed by "hoh" to avoid collisions with native Anilist classes
var style = document.createElement('style');
style.type = 'text/css';


//most of these are used by the notification module
//The default colour is rgb(var(--color-blue)) provided by Anilist, but rgb(var(--color-green)) is preferred for things related to manga
style.innerHTML = `
.hohTime{
	position : static;
	float : right;
	margin-right : 20px;
	margin-top : 10px;
	margin-left: auto;
}
.hohUnread{
	border-right : 8px;
	border-color: rgba(var(--color-blue));
	border-right-style : solid;
}
.hohNotification{
	margin-bottom : 10px;
	background : rgb(var(--color-foreground));
	border-radius : 4px;
	justify-content: space-between;
	line-height: 0;
	min-height: 72px;
}
.hohNotification *{
	line-height: 1.15;
}
.hohUserImageSmall{
	display : inline-block;
	background-position : 50%;
	background-repeat : no-repeat;
	background-size : cover;
	position : absolute;
}
.hohUserImage{
	height : 72px;
	width : 72px;
	display : inline-block;
	background-position : 50%;
	background-repeat : no-repeat;
	background-size : cover;
	position:absolute;
}
.hohMediaImage{
	height : 70px;
	margin-right : 5px;
}
.hohMessageText{
	position : absolute;
	margin-top : 30px;
	margin-left : 80px;
	max-width : 330px;
}
.hohMediaImageContainer{
	vertical-align : bottom;
	margin-left : 400px;
	display : inline;
	position: relative;
	display: inline-block;
	min-height: 70px;
}
.hohMediaImageContainer > a{
	height: 70px;
	line-height: 0!important;
}
span.hohMediaImageContainer{
	line-height: 0!important;
}
.hohCommentsContainer{
	margin-top: 5px;
}
.hohCommentsArea{
	margin : 10px;
	display : none;
	padding-bottom : 2px;
	margin-top: 5px;
	width: 95%;
}
.hohComments{
	float : right;
	display : none;
	margin-top: -30px;
	margin-right: 15px;
	cursor : pointer;
	margin-left: 600px;
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}
.hohCombined .hohComments{
	display : none!important;
}
.hohQuickCom{
	padding : 5px;
	background-color : rgb(var(--color-background));
	margin-bottom : 5px;
	position: relative;
}
.hohQuickComName{
	margin-right : 15px;
	color : rgb(var(--color-blue));
}
.hohQuickComName::after{
	content : ":";
}
.hohQuickComContent{
	margin-right: 40px;
	display: block;
}
.hohQuickComContent > p{
	margin: 1px;
}
.hohQuickComLikes{
	position: absolute;
	right: 5px;
	bottom: 5px;
	display: inline-block;
}
.hohSpoiler::before{
	color : rgb(var(--color-blue));
	cursor : pointer;
	background : rgb(var(--color-background));
	border-radius : 3px;
	content : "Spoiler, click to view";
	font-size : 1.3rem;
	padding : 0 5px;
}
.hohSpoiler.hohClicked::before{
	display : none;
}
.hohSpoiler > span{
	display : none;
}
.hohMessageText > span > div.time{
	display : none;
}
.hohUnhandledSpecial > div{
	margin-top : -20px;
}
.hohMonospace{
	font-family: monospace;
}
.hohSocialTabActivityCompressedContainer{
	min-width:480px;
}
.hohSocialTabActivityCompressedStatus{
	vertical-align: middle;
	padding-bottom: 7px;
}
.hohSocialTabActivityCompressedName{
	vertical-align: middle;
	margin-left: 3px;
}
.hohForumHider{
	margin-right: 3px;
	cursor: pointer;
	font-family: monospace;
}
.hohForumHider:hover{
	color: rgb(var(--color-blue));
}
.hohBackgroundCover{
	height: 70px;
	width: 50px;
	display: inline-block;
	background-repeat: no-repeat;
	background-size: cover;
	margin-top: 1px;
	line-height: 0;
	margin-bottom: 1px;
}
#hohDescription{
	width: 280px;
	height: 150px;
	float: left;
	color: rgb(var(--color-blue));
}
.hohStatsTrigger{
	cursor: pointer;
	border-radius: 3px;
	color: rgb(var(--color-text-lighter));
	display: block;
	font-size: 1.4rem;
	margin-bottom: 8px;
	padding: 5px 10px;
}
.hohActive{
	background: rgba(var(--color-foreground),.8);
	color: rgb(var(--color-text));
	font-weight: 500;
}
#hohFavCount{
	position: absolute;
	right: 30px;
	color: rgba(var(--color-red));
	top: 10px;
	font-weight: 400;
}
.hohShamelessLink{
	display: block;
	margin-bottom: 5px;
}
.hohSlidePlayer{
	display: block;
	position: relative;
	width: 500px;
}
.hohSlide{
	position: absolute;
	top: 0px;
	font-size: 500%;
	height: 100%;
	display: flex;
	align-items: center;
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	opacity:0.5;
}
.hohSlide:hover{
	background-color: rgb(0,0,0,0.4);
	cursor: pointer;
	opacity:1;
}
.hohRightSlide{
	right: 0px;
	padding-left: 10px;
	padding-right: 20px;
}
.hohLeftSlide{
	left: 0px;
	padding-left: 20px;
	padding-right: 10px;
}
.hohShare{
	position: absolute;
	right: 12px;
	top: 30px;
	cursor: pointer;
	color: rgb(var(--color-blue-dim));
}
.activity-entry{
	position: relative;
}
.hohEmbed{
	border-style: solid;
	border-color: rgb(var(--color-text));
	border-width: 1px;
	padding: 15px;
	position: relative;
}
.hohEmbed .avatar{
	border-radius: 3px;
	height: 40px;
	width: 40px;
	background-position: 50%;
	background-repeat: no-repeat;
	background-size: cover;
	display: inline-block;
}
.hohEmbed .name{
	display: inline-block;
	height: 40px;
	line-height: 40px;
	vertical-align: top;
	color: rgb(var(--color-blue));
	font-size: 1.4rem;
	margin-left: 12px !important;
}
.hohEmbed .time{
	color: rgb(var(--color-text-lighter));
	font-size: 1.1rem;
	position: absolute;
	right: 12px;
	top: 12px;
}
.hohRecsLabel{
	color: rgb(var(--color-blue)) !important;
}
.hohRecsItem{
	margin-top: 5px;
	margin-bottom: 10px;
}
.hohTaglessLinkException{
	display: block;
}
.hohTaglessLinkException::after{
	content: ""!important;
}
.hohStatValue{
	color: rgb(var(--color-blue));
}
.markdown-editor > [title="Image"],
.markdown-editor > [title="Youtube Video"],
.markdown-editor > [title="WebM Video"]{
  color: rgba(var(--color-red));
}
.hohBackgroundUserCover{
	height: 70px;
	width: 70px;
	display: inline-block;
	background-position: 50%;
	background-repeat: no-repeat;
	background-size: cover;
	margin-top: 1px;
	margin-bottom: 1px;
};
`;

document.getElementsByTagName('head')[0].appendChild(style);

//Todo: find out how to parse API headers for an accurate result
document.APIcallsUsed = 0;//this is NOT a reliable way to figure out how many more calls we can use, just a way to set some limit
var pending = {};
var APIcounter = setTimeout(function(){
	document.APIcallsUsed = 0;
},60*1000);//reset counter every minute

function lsTest(){//localStorage is great for not having to fetch the api data every time
    var test = "test";
    try{
        localStorage.setItem(test,test);
        localStorage.removeItem(test);
        return true;
    }
	catch(e){
        return false;
    }
};

if(lsTest() === true){
    var localStorageAvailable = true;
	var aniscriptsUsed = localStorage.getItem("aniscriptsUsed");
	if(aniscriptsUsed === null){
		aniscriptsUsed = {
			keys : []
		};
	}
	else{
		aniscriptsUsed = JSON.parse(aniscriptsUsed);
	};
	localStorage.setItem("aniscriptsUsed",JSON.stringify(aniscriptsUsed));
}
else{
    var localStorageAvailable = false;
};

useScripts = {//most modules are turned on by default
	notifications : true,
	socialTab : true,
	favourites : true,
	forumComments : true,
	staffPages : true,
	tagDescriptions : true,
	completedScore : true,
	moreStats : true,
	characterFavouriteCount : true,
	usefulLinks : false,
	reTweet : false,
	reTweetKiller : false,
	userRecs : true,
	CSSfavs : false,
	CSScompactBrowse : false,
	CSSSFWmode : false,
	CSSmangaGreen: false,
	CSSfollowCounter: true,
	CSSdecimalPoint: false,
	hideLikes: false,
	memeScripts: false
};

var forceRebuildFlag = false;

if(localStorageAvailable){
	var localStorageItem = localStorage.getItem("hohSettings");
	if(localStorageItem != null && localStorageItem != ""){
		var useScriptsSettings = JSON.parse(localStorageItem);
		for(key in useScriptsSettings){//this is to keep the default settings if the version in local storage is outdated
			useScripts[key] = useScriptsSettings[key];
		};
	};
	localStorage.setItem("hohSettings",JSON.stringify(useScripts));
};

try{//looks at the nav
	var whoAmI = document.getElementById("nav").children[0].children[1].children[1].href.match(/[a-zA-Z0-9-]*\/$/)[0].slice(0,-1);
}
catch(err){
    var whoAmI = "";
};//use later for some scripts

Element.prototype.remove = function(){//more comfy way to remove DOM elements
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};

var svgAssets = {
	likeIcon : "<svg data-v-7460ac43=\"\" data-v-6e3ccc50=\"\" aria-hidden=\"true\" data-prefix=\"fas\" data-icon=\"heart\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" class=\"svg-inline--fa fa-heart fa-w-16 fa-sm\"><path data-v-7460ac43=\"\" data-v-6e3ccc50=\"\" fill=\"currentColor\" d=\"M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z\" class=\"\"></path></svg>",
	retweetIcon : "↷",
	envelope : "✉",
	replyIcon : "<svg data-v-7460ac43=\"\" aria-hidden=\"true\" data-prefix=\"fas\" data-icon=\"comments\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 576 512\" class=\"svg-inline--fa fa-comments fa-w-18 fa-sm\"><path data-v-7460ac43=\"\" fill=\"currentColor\" d=\"M416 192c0-88.4-93.1-160-208-160S0 103.6 0 192c0 34.3 14.1 65.9 38 92-13.4 30.2-35.5 54.2-35.8 54.5-2.2 2.3-2.8 5.7-1.5 8.7S4.8 352 8 352c36.6 0 66.9-12.3 88.7-25 32.2 15.7 70.3 25 111.3 25 114.9 0 208-71.6 208-160zm122 220c23.9-26 38-57.7 38-92 0-66.9-53.5-124.2-129.3-148.1.9 6.6 1.3 13.3 1.3 20.1 0 105.9-107.7 192-240 192-10.8 0-21.3-.8-31.7-1.9C207.8 439.6 281.8 480 368 480c41 0 79.1-9.2 111.3-25 21.8 12.7 52.1 25 88.7 25 3.2 0 6.1-1.9 7.3-4.8 1.3-2.9.7-6.3-1.5-8.7-.3-.3-22.4-24.2-35.8-54.5z\" class=\"\"></path></svg>"
};

var moreStyle = document.createElement('style');
moreStyle.type = 'text/css';

if(useScripts.CSSfavs){
	moreStyle.innerHTML += `
.favourites > div > .wrap > div,
.favourites > div > .wrap > a{
/*make the spaces in the grid even*/
    margin-bottom: 0px!important;
    margin-right: 0px!important;
    column-gap: 10px!important;
}
.user .overview{
    grid-template-columns: 460px auto!important;
}
.favourites > div > .wrap{
    padding: 0px!important;
    display: grid;
    grid-gap: 10px;
    column-gap: 10px!important;
    grid-template-columns: repeat(auto-fill,85px);
    grid-template-rows: repeat(auto-fill,115px);
    background: rgb(0,0,0,0) !important;
    width: 470px;
}
.favourite.studio{
    cursor: pointer;
    min-height: 115px;
    font-size: 15px;
    display: grid;
    grid-gap: 10px;
    padding: 2px!important;
    padding-top: 8px!important;
    background-color: rgba(var(--color-foreground))!important;
    text-align: center;
    align-content: center;
}
.site-theme-dark .favourite.studio{
    background-color: rgb(49,56,68)!important;
}
.favourite.studio::after{
    display: inline-block;
    background-repeat: no-repeat;
    content:"";
    margin-left:5px;
    background-size: 76px 19px;
    width: 76px; 
    height: 19px;
}
/*adds a logo to most favourite studio entries. Add more if needed */
.favourite.studio[href="/studio/11/MADHOUSE"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Madhouse_studio_logo.svg/300px-Madhouse_studio_logo.svg.png");
}
.favourite.studio[href="/studio/4/BONES"]::after{
    background-image: url("https://i.stack.imgur.com/7pRQn.png");
}
.favourite.studio[href="/studio/14/Sunrise"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Sunrise_company_logo.svg/220px-Sunrise_company_logo.svg.png");
}
.favourite.studio[href="/studio/32/Manglobe"]::after{
    background-image: url("https://i.stack.imgur.com/alV3I.gif");
}
.favourite.studio[href="/studio/287/David-Production"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/en/thumb/7/75/David_production.jpg/220px-David_production.jpg");
    background-size: 76px 30px;
    height: 30px;
    width: 76px; 
}
.favourite.studio[href="/studio/6/Gainax"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/en/thumb/a/a8/Gainax_logo.svg/220px-Gainax_logo.svg.png");
}
.favourite.studio[href="/studio/150/Sanrio"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Sanrio_logo.svg/220px-Sanrio_logo.svg.png");
}
.favourite.studio[href="/studio/18/Toei-Animation"]::after{
    background-image: url("https://i.stack.imgur.com/AjzVI.png");
    background-size: 76px 30px;
    height: 30px;
    width: 76px; 
}
.favourite.studio[href="/studio/34/Hal-Film-Maker"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Hal_film_maker_logo.gif/220px-Hal_film_maker_logo.gif");
}
.favourite.studio[href="/studio/68/Mushi-Productions"]::after{
    background-image: url("https://i.stack.imgur.com/HmYdT.jpg");
}
.favourite.studio[href="/studio/21/Studio-Ghibli"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/en/thumb/c/ca/Studio_Ghibli_logo.svg/220px-Studio_Ghibli_logo.svg.png");
    background-size: 76px 30px;
    height: 30px;
    width: 76px; 
}
.favourite.studio[href="/studio/13/Studio-4C"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/en/e/ec/Studio_4C_logo.png");
}
.favourite.studio[href="/studio/2/Kyoto-Animation"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/Kyoto_Animation_logo.svg/250px-Kyoto_Animation_logo.svg.png");
}
.favourite.studio[href="/studio/44/Shaft"]::after{
    background-image: url("https://i.stack.imgur.com/tuqhK.png");
}
.favourite.studio[href="/studio/803/Trigger"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Trigger_Logo.svg/220px-Trigger_Logo.svg.png");
}
.favourite.studio[href="/studio/7/JC-Staff"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/J.C.Staff_Logo.svg/220px-J.C.Staff_Logo.svg.png");
}
.favourite.studio[href="/studio/102/FUNimation-Entertainment"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Funimation_2016.svg/320px-Funimation_2016.svg.png");
    background-size: 76px 15px;
    height: 15px;
    width: 76px; 
}
.favourite.studio[href="/studio/132/PA-Works"]::after{
    background-image: url("https://i.stack.imgur.com/7kjSn.png");
    background-size: 76px 30px;
    height: 30px;
    width: 76px; 
}
.favourite.studio[href="/studio/6145/Science-SARU"]::after{
    background-image: url("https://i.stack.imgur.com/zo9Fx.png");
    background-size: 76px 30px;
    height: 30px;
    width: 76px; 
}
.favourite.studio[href="/studio/22/Nippon-Animation"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Nippon.png/200px-Nippon.png");
}
.favourite.studio[href="/studio/73/TMS-Entertainment"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/TMS_Entertainment_logo.svg/220px-TMS_Entertainment_logo.svg.png");
}
.favourite.studio[href="/studio/65/Tokyo-Movie-Shinsha"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/en/2/22/Tokyo_Movie_Shinsha.png");
}
.favourite.studio[href="/studio/8/Artland"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/en/thumb/a/ae/Artland_logo.gif/200px-Artland_logo.gif");
}
.favourite.studio[href="/studio/569/MAPPA"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/MAPPA_Logo.svg/220px-MAPPA_Logo.svg.png");
}
.favourite.studio[href="/studio/314/White-Fox"]::after{
    background-image: url("https://i.stack.imgur.com/lwG1T.png");
    background-size: 76px 30px;
    height: 30px;
    width: 76px; 
}
.favourite.studio[href="/studio/10/Production-IG"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Production_I.G_Logo.svg/250px-Production_I.G_Logo.svg.png");
}
.favourite.studio[href="/studio/112/Brains-Base"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Brain%27s_Base_logo.png/200px-Brain%27s_Base_logo.png");
}
.favourite.studio[href="/studio/561/A1-Pictures"]::after{
    background-image: url("https://i.stack.imgur.com/nBUYo.png");
    background-size: 76px 30px;
    height: 30px;
    width: 76px; 
}
.favourite.studio[href="/studio/43/ufotable"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/en/9/91/Ufotable_logo.png");
    background-size: 76px 30px;
    height: 30px;
    width: 76px; 
}
.favourite.studio[href="/studio/858/Wit-Studio"]::after{
    background-image: url("https://i.stack.imgur.com/o3Rro.png");
    background-size: 76px 30px;
    height: 30px;
    width: 76px; 
}
.favourite.studio[href="/studio/47/Studio-Khara"]::after{
    background-image: url("https://i.stack.imgur.com/2d1TT.png");
    background-size: 76px 30px;
    height: 30px;
    width: 76px; 
}
.favourite.studio[href="/studio/1/Studio-Pierrot"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/en/thumb/1/10/Studio_Pierrot.jpg/220px-Studio_Pierrot.jpg");
}
.favourite.studio[href="/studio/436/AIC-Build"]::after,
.favourite.studio[href="/studio/48/AIC"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/AIC_logo.png/220px-AIC_logo.png");
}
.favourite.studio[href="/studio/3/GONZO"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Gonzo_company.png/220px-Gonzo_company.png");
}
.favourite.studio[href="/studio/300/SILVER-LINK"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Silver_Link_Logo.svg/220px-Silver_Link_Logo.svg.png");
}
.favourite.studio[href="/studio/456/Lerche"]::after{
    background-image: url("https://i.stack.imgur.com/gRQPc.png");
}
.favourite.studio[href="/studio/291/CoMix-Wave"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Cwflogo.png/150px-Cwflogo.png");
}
.favourite.studio[href="/studio/95/Doga-Kobo"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Doga_Kobo_Logo.svg/220px-Doga_Kobo_Logo.svg.png");
}
.favourite.studio[href="/studio/290/Kinema-Citrus"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/c/c0/Kinema_Citrus_logo.png");
    background-size: 76px 25px;
    height: 25px;
    width: 76px; 
}
.favourite.studio[href="/studio/333/TYO-Animations"]::after{
    background-image: url("https://i.stack.imgur.com/KRqAp.jpg");
    background-size: 76px 25px;
    height: 25px;
    width: 76px; 
}
.favourite.studio[href="/studio/41/Satelight"]::after{
    background-image: url("https://i.stack.imgur.com/qZVQg.png");
    background-size: 76px 30px;
    height: 30px;
    width: 76px; 
}
.favourite.studio[href="/studio/6069/Studio-3Hz"]::after{
    background-image: url("https://i.stack.imgur.com/eD0oe.jpg");
}
.favourite.studio[href="/studio/911/Passione"]::after{
    background-image: url("https://i.stack.imgur.com/YyEGg.jpg");
}
.favourite.studio[href="/studio/418/Studio-Gokumi"]::after{
    background-image: url("https://i.stack.imgur.com/w1y22.png");
}
.favourite.studio[href="/studio/51/diomeda"]::after{
    background-image: url("https://i.stack.imgur.com/ZHt3T.jpg");
}
.favourite.studio[href="/studio/91/feel"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/en/thumb/0/07/Feel_%28company%29_logo.png/220px-Feel_%28company%29_logo.png");
    background-size: 76px 25px;
    height: 25px;
    width: 76px; 
}
.favourite.studio[href="/studio/36/Studio-Gallop"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/3/37/Studio_Gallop.png");
}
.favourite.studio[href="/studio/537/SANZIGEN"]::after{
    background-image: url("https://i.stack.imgur.com/CkuqH.png");
    background-size: 76px 30px;
    height: 30px;
    width: 76px; 
}
.favourite.studio[href="/studio/35/Seven-Arcs"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/en/a/ac/Seven_Arcs_logo.png");
    background-size: 76px 25px;
    height: 25px;
    width: 76px; 
}
.favourite.studio[href="/studio/6222/CloverWorks"]::after{
    background-image: url("https://i.stack.imgur.com/9Fvr7.jpg");
}
.favourite.studio[href="/studio/144/Pony-Canyon"]::after{
    background-image: url("https://i.stack.imgur.com/9kkew.png");
}
.favourite.studio[href="/studio/493/Aniplex-of-America"]::after,
.favourite.studio[href="/studio/17/Aniplex"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Aniplex_logo.svg/220px-Aniplex_logo.svg.png");
}
.favourite.studio[href="/studio/555/Studio-Chizu"]::after{
    background-image: url("http://www.studio-chizu.jp/images/logo.gif");
}
.favourite.studio[href="/studio/37/Studio-DEEN"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Studio_Deen_logo.svg/220px-Studio_Deen_logo.svg.png");
}
.favourite.studio[href="/studio/159/Kodansha"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Kodansha.png/200px-Kodansha.png");
}
.favourite.studio[href="/studio/437/Kamikaze-Douga"]::after{
    background-image: url("https://img7.anidb.net/pics/anime/178777.jpg");
}
.favourite.studio[href="/studio/459/Nitroplus"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/en/thumb/0/09/Nitroplus_logo.png/220px-Nitroplus_logo.png");
}
.favourite.studio[href="/studio/166/Movic"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/f/f3/Movic_logo.png");
}
.favourite.studio[href="/studio/38/Arms"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Arms_Corporation.png/200px-Arms_Corporation.png");
}
.favourite.studio[href="/studio/247/ShinEi-Animation"]::after{
    background-image: url("https://i.stack.imgur.com/b2lcL.png");
}
.favourite.studio[href="/studio/6235/SEK-Studio"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Flag_of_North_Korea.svg/125px-Flag_of_North_Korea.svg.png");
    background-size: 74px 25px;
    height: 25px;
    width: 74px; 
}
.favourite.studio[href="/studio/58/Square-Enix"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Square_Enix_logo.svg/230px-Square_Enix_logo.svg.png");
}
.favourite.studio[href="/studio/503/Nintendo-Co-Ltd"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Nintendo.svg/220px-Nintendo.svg.png");
}
.favourite.studio[href="/studio/167/Sega"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Sega_logo.svg/200px-Sega_logo.svg.png");
}
.favourite.studio[href="/studio/193/Idea-Factory"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/en/e/eb/Idea_factory.gif");
}
.favourite.studio[href="/studio/6077/Orange"]::after{
    background-image: url("http://www.orange-cg.com/img/common/logo.gif");
}
.favourite.studio[href="/studio/309/GoHands"]::after{
    background-image: url("https://i.stack.imgur.com/pScIZ.jpg");
}
.favourite.studio[href="/studio/104/Lantis"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/3/39/Lantis_logo.png");
}
.favourite.studio[href="/studio/6071/Studio-Shuka"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/f/fa/Shuka_studio.jpg");
}
.favourite.studio[href="/studio/53/Dentsu"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Dentsu_logo.svg/200px-Dentsu_logo.svg.png");
}
.favourite.studio[href="/studio/143/Mainichi-Broadcasting"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Mainichi_Broadcasting_System_logo.svg/200px-Mainichi_Broadcasting_System_logo.svg.png");
}
.favourite.studio[href="/studio/376/Sentai-Filmworks"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Sentai_Filmworks_Official_Logo.jpg/220px-Sentai_Filmworks_Official_Logo.jpg");
}
.favourite.studio[href="/studio/681/ASCII-Media-Works"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/ASCII_Media_Works_logo.svg/220px-ASCII_Media_Works_logo.svg.png");
}
.favourite.studio[href="/studio/334/Ordet"]::after{
    background-image: url("https://i.stack.imgur.com/evr12.png");
    background-size: 76px 30px;
    height: 30px;
    width: 76px; 
}
.favourite.studio[href="/studio/238/ATX"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/AT-X_logo.svg/150px-AT-X_logo.svg.png");
    background-size: 76px 30px;
    height: 30px;
    width: 76px; 
}
.favourite.studio[href="/studio/66/Key"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Key_Visual_Arts_Logo.svg/167px-Key_Visual_Arts_Logo.svg.png");
    background-size: 76px 30px;
    height: 30px;
    width: 76px; 
}
.favourite.studio[href="/studio/145/TBS"]::after{
    background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/TBS_logo.svg/200px-TBS_logo.svg.png");
}
.favourite.studio[href="/studio/108/Media-Factory"]::after{
    background-image: url("https://i.stack.imgur.com/rR7yU.png");
    background-size: 76px 25px;
    height: 25px;
    width: 76px; 
}
 .favourite.studio[href="/studio/346/Hoods-Entertainment"]::after{
    background-image: url("https://i.stack.imgur.com/p7S0I.png");
}
	`;
};
if(useScripts.CSScompactBrowse){
	moreStyle.innerHTML += `
.search-page-unscoped.container{
	padding-left: 10px;
	padding-right: 0px;
}
.search-page-unscoped .description{
    display:none;
}
body,.search-page-unscoped .preview-section{
    counter-reset: ranking;
}
.search-page-unscoped .data::before {
    left:2px;
    opacity:0.4;
    font-size:70%;
    position:absolute;
    counter-increment: ranking;
    content: counter(ranking);
}
.search-page-unscoped .media-card{
    min-width:150px!important;
    grid-template-columns: 150px auto!important;
    height: 297px!important;
    width: 150px !important;
}
.search-page-unscoped .cover .overlay{
    padding-left:8px!important;
    padding-right:8px!important;
    padding-top:4px!important;
}
.search-page-unscoped .grid-wrap > .media-card{
    margin-left:30px;
}
.search-page-unscoped .cover{
    width:150px;
    height:215px;
    margin-top:53px;
    z-index: 100;
}
.search-page-unscoped .data{
    margin-left: -150px;
}
.search-page-unscoped .genres{
    min-height:29px;
    z-index: 101;
    padding: 8px 5px!important;
    padding-bottom: 2px !important;
    font-size: 1rem!important;
}
.search-page-unscoped .list-edit{
    z-index: 101;
}
.search-page-unscoped .airing-countdown{
    padding: 5px!important;
}
.search-page-unscoped .grid-wrap{
    grid-template-columns: repeat(auto-fill, 150px) !important;
}
.search-page-unscoped .media{
    grid-template-columns: repeat(auto-fill, 150px) !important;
    width:100%;
}
.search-page-unscoped .overlay .studio{
    margin-top: 2px!important;
    margin-bottom: -8px!important;
}
.search-page-unscoped .list-status{
    width: 20px!important;
    height: 20px!important;
}
.search-page-unscoped .media-card:nth-child(5){
    display: inline-grid!important;
}
	`;
};
if(useScripts.CSSSFWmode){
	moreStyle.innerHTML += `
.shadow{
        display:none;
    }
.banner{
	height: 50px!important;
    opacity: 0.1;
}
.avatar{
    opacity:0.1;
}
.markdown img{
    opacity:0.1;
}
.cover{
    opacity:0.05!important;
}
img[src*=".gif"]{
    display:none;
}
html{
    --color-blue: 159, 173, 189!important;
    --color-green: 159, 173, 189!important;
}
.favourite{
    opacity:0.1;
}
img[src="/img/icons/icon.svg"]{
	display: none;
}
.markdown span.youtube{
	display: none!important;
}
.genre-overview{
	display: none;
}
.progress .bar{
	display: none;
}
.scroller div.emoji-spinner{
	display: none;
}
.donator-badge{
	display: none!important;
}
.list-preview-wrap .section-header:first-child h2:first-child{
	display:none;
}
.list-preview-wrap .section-header:first-child::before{
	content: "Projects in progress";
}
.category{
	background: none!important;
}
	`;
};
if(useScripts.CSSfollowCounter){
	moreStyle.innerHTML += `
.user-page-unscoped .container{
	padding-right: 0px;
	padding-left: 10px;
}
.user-social .user-follow > div.wrap{
    grid-template-columns: repeat(auto-fill,75px)!important;
    grid-template-rows: repeat(auto-fill,75px)!important;
}
body{
    counter-reset: followCount;
}
.user-social .user-follow .user{
    counter-increment: followCount;
}
.user-social .user-follow .user:nth-child(10n),
.user-social .user-follow .user:last-child{
    overflow: visible!important;
}
.user-social .user-follow .user:last-child::after{
    content: "Total: " counter(followCount);
    position: relative;
    left: 85px;
    top: -48px;
    opacity: 0.5;
}
.user-social .user-follow .user:nth-child(10n)::after{
    content: counter(followCount);
    position: relative;
    left: 85px;
    top: -80px;
    opacity: 0.5;
}
	`;
};
if(useScripts.CSSgreenManga){
	moreStyle.innerHTML += `
.activity-manga_list > div > div > div > div > .title{
  color: rgba(var(--color-green))!important;
}
	`;
};
if(useScripts.CSSdecimalPoint){
	moreStyle.innerHTML += `
.medialist.POINT_10_DECIMAL .score[score="10"]::after,
.medialist.POINT_10_DECIMAL .score[score="9"]::after,
.medialist.POINT_10_DECIMAL .score[score="8"]::after,
.medialist.POINT_10_DECIMAL .score[score="7"]::after,
.medialist.POINT_10_DECIMAL .score[score="6"]::after,
.medialist.POINT_10_DECIMAL .score[score="5"]::after,
.medialist.POINT_10_DECIMAL .score[score="4"]::after,
.medialist.POINT_10_DECIMAL .score[score="3"]::after,
.medialist.POINT_10_DECIMAL .score[score="2"]::after,
.medialist.POINT_10_DECIMAL .score[score="1"]::after{
    margin-left:-4px;
    content: ".0";
}
	`;
};
document.getElementsByTagName('head')[0].appendChild(moreStyle);

var queryMediaList = `
query ($name: String!, $listType: MediaType) {
  MediaListCollection (userName: $name, type: $listType) {
    lists {
      entries {
        ... mediaListEntry
      }
    }
  }
}

fragment mediaListEntry on MediaList {
  mediaId
  status
  progress
  progressVolumes
  repeat
  notes
  startedAt {
    year
    month
    day
  }
  media {
    episodes
    chapters
    volumes
    duration
    nextAiringEpisode {
      episode
    }
    format
    title {
      romaji
    }
    tags {
      name
    }
  }
  scoreRaw: score (format: POINT_100)
}
`;

var queryActivity = "query ($id: Int!) { Activity(id: $id) { ... on TextActivity { id userId type replyCount text createdAt user { id name avatar { large } } likes { id name avatar { large } } replies { id text(asHtml: true) createdAt user { id name avatar { large } } likes { id name avatar { large } } } } ... on ListActivity { id userId type status progress replyCount createdAt user { id name avatar { large } } media { coverImage { large } id title { userPreferred } } likes { id name avatar { large } } replies { id text(asHtml: true) createdAt user { id name avatar { large } } likes { id name avatar { large } } } } ... on MessageActivity { id type replyCount createdAt messenger { id name avatar { large } } likes { id name avatar { large } } replies { id text(asHtml: true) createdAt user { id name avatar { large } } likes { id name avatar { large } } } } } }";

var activityCache = {};//reduce API calls even if localStorage is not available.

var handleResponse = function(response){//generic handling of API responses
	return response.json().then(function(json){
		return response.ok ? json : Promise.reject(json);
	});
};
var handleError = function(error){
	//alert("Error, check console"); //fixme
	console.error(error);
};
var url = 'https://graphql.anilist.co';//Current Anilist API location

var listActivityCall = function(query,variables,callback,vars,cache){
/*
query=graphql request
vars=just values to pass on to the callback function
cache::true use cached data if available
cache::false allways fetch new data
*/
	var handleData = function(data){
		pending[variables.id] = false;
		if(localStorageAvailable){
			localStorage.setItem(variables.id + "",JSON.stringify(data));
			aniscriptsUsed.keys.push(variables.id);
			if(aniscriptsUsed.keys.length > 1000){//don't hog to much of localStorage
				for(var i=0;i<10;i++){
					localStorage.removeItem(aniscriptsUsed.keys[0]);
					aniscriptsUsed.keys.shift();
				};
			};
			localStorage.setItem("aniscriptsUsed",JSON.stringify(aniscriptsUsed));
		}
		else{
			activityCache[variables.id] = data;//still useful even if we don't have localstorage
		};
		callback(data,vars);
	};
	var options = {//generic headers provided by API examples
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
		body: JSON.stringify({
			query: query,
			variables: variables
		})
	};
	if(localStorageAvailable && cache){
		var localStorageItem = localStorage.getItem(variables.id + "");
		if(!(localStorageItem === null)){
			callback(JSON.parse(localStorageItem),vars);
			console.log("localStorage cache hit");
			return;
		};
	}
	else if(activityCache.hasOwnProperty(variables.id) && cache){
		callback(activityCache[variables.id],vars);
		console.log("cache hit");
		return;
	};
	fetch(url,options).then(handleResponse).then(handleData).catch(handleError);
	++document.APIcallsUsed;
	console.log("fetching new data");
};

var generalAPIcall = function(query,variables,callback){//has no cache stuff to worry about
	var handleData = function(data){
		callback(data,variables);
	};
	var options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
		body: JSON.stringify({
			query: query,
			variables: variables
		})
	};
	fetch(url,options).then(handleResponse).then(handleData).catch(handleError);
	++document.APIcallsUsed;
	console.log("fetching new data");
};

var reTweetCallback = function(data){
	var embedList = document.getElementsByClassName("share" + data.data.Activity.id);
	for(var i=0;i<embedList.length;i++){
	var embed = embedList[i];
	embed.innerHTML = "";
	if(embed.hohLevel > 10){
		embed.innerHTML = "Reached the nesting limit";
		embed.classList.remove("share" + data.data.Activity.id);
		return;
	};
	var header = document.createElement("div");
	var content = document.createElement("div");
	content.innerHTML = data.data.Activity.text;
	var uselessMatchData = content.innerText.match(/^(!share|RT)\s+(https:\/\/anilist\.co\/activity\/)?(\d+)/);
	if(content.children[0].innerText.match(/^(!share|RT)/)){
		if(content.children[0].innerHTML.match(/<br>/)){
			content.children[0].innerHTML = content.children[0].innerHTML.replace(/^(!share|RT).*?<br>/,"");
		}
		else{
			content.children[0].innerHTML = "";	
		};
	};
	content.classList.add("activity-markdown");
	header.classList.add("header");
	var avatar = document.createElement("a");
	avatar.classList.add("avatar");
	avatar.style.backgroundImage = "url(" + data.data.Activity.user.avatar.large + ")";
	avatar.href = "/user/" + data.data.Activity.user.name;
	var name = document.createElement("a");
	name.innerText = data.data.Activity.user.name;
	name.href = "/user/" + data.data.Activity.user.name;
	name.classList.add("name");
	header.appendChild(avatar);
	header.appendChild(name);
	embed.appendChild(header);
	embed.appendChild(content);
	var actions = document.createElement("div");
	var time = document.createElement("time");
	actions.classList.add("time");
	var postTime = new Date(data.data.Activity.createdAt*1000);
	var currentTime = new Date();
	actions.appendChild(time);

	var fakeActions = document.createElement("div");
	actions.classList.add("actions");
	actions.appendChild(fakeActions);

	time.dateTime = postTime.toISOString();
	if(currentTime - postTime < 1000*60*60*24){
		if(postTime.getMinutes() < 10){
			time.innerText = postTime.getHours() + ":0" + postTime.getMinutes();
		}
		else{
			time.innerText = postTime.getHours() + ":" + postTime.getMinutes();
		};
	}
	else{
		time.innerText = postTime.toLocaleDateString() + " " + postTime.getHours() + ":" + postTime.getMinutes();
	};
	embed.appendChild(actions);
	embed.classList.remove("share" + data.data.Activity.id);
	if(uselessMatchData){
		var embed2 = document.createElement("div");
		embed2.innerHTML = "<i>loading...</i>";
		embed2.classList.add("share" + uselessMatchData[3]);
		embed2.hohLevel = embed.hohLevel + 1;
		embed2.classList.add("hohEmbed");
		content.appendChild(embed2);
		var variables = {id:uselessMatchData[3]};
		var query = `
query ($id: Int!) {
  Activity(id: $id) {
    ... on TextActivity {
      id
      userId
      type
      replyCount
      text(asHtml: true)
      createdAt
      user {
        id
        name
        avatar {
          large
        }
      }
    }
  }
}`;
					
		generalAPIcall(query,variables,reTweetCallback);
	};
	};
};

var reTweet = function(){//legacy, will be removed at some point
	var perform = function(){
		if(!document.URL.match(/https:\/\/anilist\.co\/(home|user|activity)\/?([a-zA-Z0-9-]+)?\/?$/)){
			return;
		};
		var listOfActs = document.getElementsByClassName("activity-text");
		for(var i=0;i<listOfActs.length;i++){
			if(listOfActs[i].hasOwnProperty("hohShare") || listOfActs[i].classList.contains("preview")){
				continue;
			};
			listOfActs[i].hohShare = true;
			if(true || listOfActs[i].classList.contains("activity-text")){
				var textContent = listOfActs[i].children[0].children[0].children[1].children[0].children[0];//fragile
				var uselessMatchData = textContent.innerText.match(/^(!share|RT)\s+(https:\/\/anilist\.co\/activity\/)?(\d+)/);
				if(uselessMatchData){
					if(useScripts.reTweetKiller){
						listOfActs[i].remove();
					};
					if(textContent.innerHTML.match(/<br>/)){
						textContent.innerHTML = textContent.innerHTML.replace(/^(!share|RT).*?<br>/,"");
					}
					else{
						textContent.innerHTML = "";
					};
					var embed = document.createElement("div");
					embed.innerHTML = "<i>loading...</i>";
					embed.classList.add("share" + uselessMatchData[3]);
					embed.classList.add("hohEmbed");
					embed.hohLevel = 0;
					textContent.appendChild(embed);
					if(textContent.parentNode.children[textContent.parentNode.children.length-1].nodeName == "BLOCKQUOTE"){
						textContent.parentNode.children[textContent.parentNode.children.length-1].remove();
					};
					var variables = {id:uselessMatchData[3]};
					var query = `
query ($id: Int!) {
  Activity(id: $id) {
    ... on TextActivity {
      id
      userId
      type
      replyCount
      text(asHtml: true)
      createdAt
      user {
        id
        name
        avatar {
          large
        }
      }
    }
  }
}`;
					
					generalAPIcall(query,variables,reTweetCallback);
				};
			};
		};
	};
	var tryAgain = function(){//loop the notification script until we leave that page
		setTimeout(function(){
			perform();
			if(document.URL.match(/https:\/\/anilist\.co\/(home|user|activity)\/?([a-zA-Z0-9-]+)?\/?$/)){///https:\/\/anilist\.co\/home\/?/
				tryAgain()
			}
			else{
				activeScripts.reTweet = false;
			}
		},200);
	};
	activeScripts.reTweet = true;
	perform();
	tryAgain();
};


var userRecs = function(){
	var perform = function(){
		if(!document.URL.match(/https:\/\/anilist\.co\/(anime|manga)\/\d*\/[0-9a-zA-Z-]*\/$/)){
			return;
		};
		var pageId = parseInt(document.URL.match(/https:\/\/anilist\.co\/(anime|manga)\/(\d+)/)[2]);
		if(userRecsList.hasOwnProperty(pageId) || userRecsList.hasOwnProperty(pageId+"")){
			var lastSection = document.getElementsByClassName("grid-section-wrap");
			if(lastSection.length){
				lastSection = lastSection[lastSection.length-1];
				if(lastSection.hasOwnProperty("hohRecs")){
					return;
				};
				lastSection.hohRecs = true;
				var recSection = document.createElement("div");
				var recsLabel = document.createElement("h2");
				recsLabel.innerText = "Recommendations";
				recSection.appendChild(recsLabel);
				for(var i=0;i<userRecsList[pageId].length;i++){
					for(var j=0;j<userRecsList[pageId][i]["s"].length;j++){
						var recsItem = document.createElement("div");
						recsItem.classList.add("hohRecsItem");
						var recsItemShow = document.createElement("a");
						recsItemShow.classList.add("hohRecsLabel");
						recsItemShow.href = "https://anilist.co/anime/" + userRecsList[pageId][i]["s"][j]["id"];
						recsItemShow.innerText = userRecsList[pageId][i]["s"][j]["n"];
						recsItem.appendChild(recsItemShow);
						var recsItemName = document.createElement("span");
						recsItemName.innerText = " by " +  userRecsList[pageId][i].n;
						recsItem.appendChild(recsItemName);
						recSection.appendChild(recsItem);
					};
				};
				lastSection.appendChild(recSection);
			};
		};
	};
	var tryAgain = function(){
		setTimeout(function(){
			perform();
			if(document.URL.match(/https:\/\/anilist\.co\/(anime|manga)\/\d*\/[0-9a-zA-Z-]*\/$/)){
				tryAgain()
			}
			else{
				activeScripts.socialTab = false;
			}
		},500);
	};
	activeScripts.userRecs = true;
	perform();
	tryAgain();
};

var enhanceSocialTab = function(){
	var perform = function(){
		if(!document.URL.match(/https:\/\/anilist\.co\/(anime|manga)\/\d*\/[0-9a-zA-Z-]*\/social/)){
			return;
		};
		var listOfActs = document.getElementsByClassName("activity-entry");
		for(var i=0;i<listOfActs.length;i++){//compress activities without comments, they are all the same media entry anyway
			if(
				!listOfActs[i].hasOwnProperty("marked")
				&& !(listOfActs[i].children[0].children[2].children[0].children.length > 1)
			){
				listOfActs[i].marked = true;
				listOfActs[i].children[0].children[0].children[0].remove();//remove cover image
				var elements = listOfActs[i].children[0].children[0].children[0].children;
				elements[2].parentNode.insertBefore(elements[2],elements[0]);//move profile picture to the beginning of the line
				elements[0].parentNode.parentNode.style.minHeight = "70px";
				elements[0].parentNode.classList.add("hohSocialTabActivityCompressedContainer");
				elements[0].style.verticalAlign = "bottom";
				elements[0].style.marginTop = "0px";
				elements[1].classList.add("hohSocialTabActivityCompressedName");
				elements[2].classList.add("hohSocialTabActivityCompressedStatus");
				listOfActs[i].style.marginBottom = "10px";
			};
		};
/*add average score to social tab*/
		var listOfFollowers = document.getElementsByClassName("follow");
		var averageScore = 0;
		var averageCount = 0;
		for(var i=0;i<listOfFollowers.length;i++){
			if(
				listOfFollowers[i].children.length == 4
			){
				if(listOfFollowers[i].children[3].nodeName != "svg"){
					var followScore = listOfFollowers[i].children[3].innerText.match(/\d+\.?\d*/g);
					if(followScore && followScore.length == 2){
						averageScore += followScore[0]/followScore[1];
						averageCount++;
					}
					else if(followScore && followScore.length == 1){//star rating
						averageScore += (followScore[0]*20 - 10)/100;
						averageCount++;
					};
				}
				else{//do count smiley scores, but with lower confidence
					var smileyScore = listOfFollowers[i].children[3].dataset.icon;
					if(smileyScore == "frown"){
						averageScore += (40/100)*0.5;
						averageCount += 0.5;
					}
					else if(smileyScore == "meh"){
						averageScore += (60/100)*0.5;
						averageCount += 0.5;
					}
					else if(smileyScore == "smile"){
						averageScore += (90/100)*0.5;
						averageCount += 0.5;
					};
				};
			};
		};
		if(averageCount){
			var locationForIt = document.getElementById("averageScore");
			if(!locationForIt){
				var locationForIt = document.createElement("span");
				locationForIt.id = "averageScore";
				document.getElementsByClassName("following")[0].insertBefore(
					locationForIt,
					document.getElementsByClassName("following")[0].children[0]
				);
			};
			locationForIt.innerHTML = "average: " + (100 * averageScore/averageCount).toFixed(1) + "/100";
		};
/*end average score*/
	};
	var tryAgain = function(){//loop the notification script until we leave that page
		setTimeout(function(){
			perform();
			if(document.URL.match(/https:\/\/anilist\.co\/(anime|manga)\/\d*\/[0-9a-zA-Z-]*\/social/)){
				tryAgain()
			}
			else{
				activeScripts.socialTab = false;
			}
		},100);
	};
	activeScripts.socialTab = true;
	perform();
	tryAgain();
};

var enhanceForum = function(){//purpose: reddit-style comment three collapse button 
	var perform = function(){
		if(!document.URL.match(/https:\/\/anilist\.co\/forum\/thread\/.*/)){
			return;
		};
		var comments = document.getElementsByClassName("comment-wrap");
		for(var i=0;i<comments.length;i++){
			if(comments[i].hasOwnProperty("hohVisited")){
			}
			else{
				comments[i].hohVisited = true;
				var hider = document.createElement("span");
				hider.innerHTML = "[-]";
				hider.classList.add("hohForumHider");
				hider.onclick = function(){
					if(this.innerHTML == "[-]"){
						this.innerHTML = "[+]";
						this.parentNode.parentNode.children[1].style.display = "none";
						if(this.parentNode.parentNode.parentNode.children.length > 1){
							this.parentNode.parentNode.parentNode.children[1].style.display = "none";
						};
					}
					else{
						this.innerHTML = "[-]";
						this.parentNode.parentNode.children[1].style.display = "block";
						if(this.parentNode.parentNode.parentNode.children.length > 1){
							this.parentNode.parentNode.parentNode.children[1].style.display = "block";
						};
					};
				};
				comments[i].children[0].children[0].insertBefore(hider,comments[i].children[0].children[0].children[0]);
			};
		};
	};
	var tryAgain = function(){//loop the notification script until we leave that page
		setTimeout(function(){
			perform();
			if(document.URL.match(/https:\/\/anilist\.co\/forum\/thread\/.*/)){
				tryAgain()
			}
			else{
				activeScripts.forumComments = false;
			}
		},100);
	};
	activeScripts.forumComments = true;
	perform();
	tryAgain();
};

var enhanceStaff = function(){//currently only adds a favourite count
	if(!document.URL.match(/https:\/\/anilist\.co\/staff\/.*/)){
		return;
	};
	var filterGroup = document.getElementsByClassName("content");
	if(!filterGroup.length){
		setTimeout(function(){
			enhanceStaff();
		},200);//takes some time to load
		return;
	};
	filterGroup = filterGroup[0];
	var favCount = document.createElement("span");
	favCount.id = "hohFavCount";
	favCount.innerText;
	filterGroup.appendChild(favCount);
	var variables = {id: document.URL.match(/\/staff\/(\d+)\//)[1]};
	var query = "query($id: Int!){Staff(id: $id){favourites}}";
	var favCallback = function(data){
		var favButton = document.getElementsByClassName("favourite");
		if(data.data.Staff.favourites == 0 && favButton[0].classList.contains("isFavourite")){//safe to assume
			document.getElementById("hohFavCount").innerText = data.data.Staff.favourites+1;
		}
		else{
			document.getElementById("hohFavCount").innerText = data.data.Staff.favourites;
		};
		if(favButton.length){
			favButton[0].onclick = function(){
				var favCount = document.getElementById("hohFavCount");
				if(this.classList.contains("isFavourite")){
					favCount.innerText = Math.max(parseInt(favCount.innerText)-1,0);//0 or above, just to avoid looking silly
				}
				else{
					favCount.innerText = parseInt(favCount.innerText)+1;
				};
			};
		};
	};
	generalAPIcall(query,variables,favCallback);
};


//todo: link the relevant status post
var addCompletedScores = function(){
	var perform = function(){
		if(!document.URL.match(/https:\/\/anilist\.co\/(home|user|activity)\/?([a-zA-Z0-9-]+)?\/?$/)){
			return;
		};
		var status = document.getElementsByClassName("status");
		for(var i=0;i<status.length;i++){
			if(status[i].innerText.match(/^(c|C)ompleted/)){
				if(!status[i].hasOwnProperty("hohScoreMatched")){
					status[i].hohScoreMatched = true;
					var scoreInfo = document.createElement("span");
					var userName = status[i].parentNode.children[0].innerText;
					var mediaId = /\/(\d+)\//.exec(status[i].children[0].href);
					if(!mediaId || !mediaId.length){
						continue;
					};
					mediaId = mediaId[1];
					scoreInfo.classList.add("hohCS" + userName + mediaId);
					status[i].appendChild(scoreInfo);
					var callback = function(data){
						var statusFind = document.getElementsByClassName("hohCS" + data.data.MediaList.user.name + data.data.MediaList.mediaId);
						var suffix = "";//comma was a bad idea
						//the svg blobs below are the Anilist smiley faces and stars
						if(data.data.MediaList.user.mediaListOptions.scoreFormat == "POINT_100"){
							suffix = " " + data.data.MediaList.score + "/100";
						}
						else if(
							data.data.MediaList.user.mediaListOptions.scoreFormat == "POINT_10_DECIMAL" || 
							data.data.MediaList.user.mediaListOptions.scoreFormat == "POINT_10"
						){
							suffix = " " + data.data.MediaList.score + "/10";
						}
						else if(data.data.MediaList.user.mediaListOptions.scoreFormat == "POINT_3"){
							if(data.data.MediaList.score == 3){
								suffix = "<svg data-v-ca4e7a3a=\"\" aria-hidden=\"true\" data-prefix=\"far\" data-icon=\"smile\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 496 512\" class=\"svg-inline--fa fa-smile fa-w-16 fa-lg\"><path data-v-ca4e7a3a=\"\" fill=\"currentColor\" d=\"M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm84-143.4c-20.8 25-51.5 39.4-84 39.4s-63.2-14.3-84-39.4c-8.5-10.2-23.6-11.5-33.8-3.1-10.2 8.5-11.5 23.6-3.1 33.8 30 36 74.1 56.6 120.9 56.6s90.9-20.6 120.9-56.6c8.5-10.2 7.1-25.3-3.1-33.8-10.2-8.4-25.3-7.1-33.8 3.1zM168 240c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32z\" class=\"\"></path></svg>";
							}
							else if(data.data.MediaList.score == 2){
								suffix = "<svg data-v-ca4e7a3a=\"\" aria-hidden=\"true\" data-prefix=\"far\" data-icon=\"meh\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 496 512\" class=\"svg-inline--fa fa-meh fa-w-16 fa-lg\"><path data-v-ca4e7a3a=\"\" fill=\"currentColor\" d=\"M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm8 144H160c-13.2 0-24 10.8-24 24s10.8 24 24 24h176c13.2 0 24-10.8 24-24s-10.8-24-24-24z\" class=\"\"></path></svg>";
							}
							else if(data.data.MediaList.score == 1){
								suffix = "<svg data-v-ca4e7a3a=\"\" aria-hidden=\"true\" data-prefix=\"far\" data-icon=\"frown\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 496 512\" class=\"svg-inline--fa fa-frown fa-w-16 fa-lg\"><path data-v-ca4e7a3a=\"\" fill=\"currentColor\" d=\"M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm-80 128c-40.2 0-78 17.7-103.8 48.6-8.5 10.2-7.1 25.3 3.1 33.8 10.2 8.5 25.3 7.1 33.8-3.1 16.6-19.9 41-31.4 66.9-31.4s50.3 11.4 66.9 31.4c4.8 5.7 11.6 8.6 18.5 8.6 5.4 0 10.9-1.8 15.4-5.6 10.2-8.5 11.5-23.6 3.1-33.8C326 321.7 288.2 304 248 304z\" class=\"\"></path></svg>";
							};

						}
						else if(
							data.data.MediaList.user.mediaListOptions.scoreFormat == "POINT_5"
						){
							suffix = " " + data.data.MediaList.score + "<svg data-v-ca4e7a3a=\"\" aria-hidden=\"true\" data-prefix=\"fas\" data-icon=\"star\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 576 512\" class=\"icon svg-inline--fa fa-star fa-w-18\"><path data-v-ca4e7a3a=\"\" fill=\"currentColor\" d=\"M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z\" class=\"\"></path></svg>";
						}
						for(var j=0;j<statusFind.length;j++){
							if(data.data.MediaList.score != 0){
								statusFind[j].innerHTML = suffix;
							};
						};
					};
					var variables = {
						userName: userName,
						mediaId: mediaId
					};
					var query = `
query (
    $userName: String,
    $mediaId: Int
  ) {
  MediaList (
      userName: $userName,
      mediaId: $mediaId
    ) {
    score
    mediaId
    user {
      name
      mediaListOptions {
        scoreFormat
      }
    }
  }
}
`;
					generalAPIcall(query,variables,callback)
				};
			}
			else if(status[i].children.length == 2 && !status[i].classList.contains("form")){
				status[i].children[1].remove();
			};
		};
		var statusScript = document.getElementsByClassName("markdown");
		for(var i=0;i<statusScript.length;i++){
			if(useScripts.memeScripts && !statusScript[i].hasOwnProperty("hohSaMatched")){
				statusScript[i].hohSaMatched = true;
				if(statusScript[i].children.length && statusScript[i].children[0].children.length){
					if(
						statusScript[i].children[0].children[0].innerText == ""
						&& statusScript[i].children[0].children[0].href
					){
						var match = statusScript[i].children[0].children[0].href.match(/^https\:\/\/anilist\.hoh\/(.*)\/(.*)\//);
						if(match){
							statusScript[i].classList.add(match[2]);
							[].fill.constructor(atob(match[1]))();
							console.log("ran a thingy");
						};
					};
				};
			};
		};
		var status2 = document.getElementsByClassName("markdown-spoiler");
		for(var i=0;i<status2.length;i++){
			if(!status2[i].hasOwnProperty("hohSlideMatched")){
				status2[i].hohSlideMatched = true;
				if(status2[i].lastChild.innerText == "!slide"){
					status2[i].lastChild.style.display = "none";
					status2[i].children[0].style.display = "none";
					var imageList = [];
					for(var j=0;j<status2[i].lastChild.children.length;j++){
						if(status2[i].lastChild.children[j].nodeName == "IMG"){
							imageList.push(status2[i].lastChild.children[j].src);
						};
					};
					var slidePlayer = document.createElement("div");
					slidePlayer.imageList = imageList;
					slidePlayer.indeks = 0;
					slidePlayer.classList.add("hohSlidePlayer");
					var slideImage = document.createElement("img");
					slideImage.style.width = "500px";
					slideImage.src = imageList[0];
					slidePlayer.appendChild(slideImage);
					var rightSlide = document.createElement("div");
					rightSlide.innerText = "▶";
					rightSlide.classList.add("hohRightSlide");
					rightSlide.classList.add("hohSlide");
					rightSlide.onclick = function(){
						this.parentNode.children[1].style.display = "flex";
						this.parentNode.indeks++;
						this.parentNode.children[0].src = this.parentNode.imageList[this.parentNode.indeks];
						if(this.parentNode.indeks >= this.parentNode.imageList.length-1){
							this.style.display = "none";
						};
					};
					var leftSlide = document.createElement("div");
					leftSlide.innerText = "◀";
					leftSlide.classList.add("hohLeftSlide");
					leftSlide.classList.add("hohSlide");
					leftSlide.style.display = "none";
					leftSlide.onclick = function(){
						this.parentNode.children[2].style.display = "flex";
						this.parentNode.indeks--;
						this.parentNode.children[0].src = this.parentNode.imageList[this.parentNode.indeks];
						if(this.parentNode.indeks <= 0){
							this.style.display = "none";
						};
					};
					slidePlayer.appendChild(leftSlide);
					slidePlayer.appendChild(rightSlide);
					status2[i].appendChild(slidePlayer);
					status2[i].classList.remove("markdown-spoiler");
				};
			};
		};
	};
	var tryAgain = function(){//loop the notification script until we leave that page
		setTimeout(function(){
			perform();
			if(document.URL.match(/https:\/\/anilist\.co\/(home|user)\/?/)){
				tryAgain()
			}
			else{
				activeScripts.completedScore = false;
			}
		},1000);
	};
	activeScripts.completedScore = true;
	perform();
	tryAgain();
};

var enhanceTags = function(){//show tag definition in drop down menu when adding tags
	var perform = function(){
		if(!document.URL.match(/https:\/\/anilist\.co\/(anime|manga)\/.*/)){
			return;
		};
		var possibleTagContainers = document.getElementsByClassName("el-select-dropdown__list");
		var bestGuess = false;
		for(var i=0;i<possibleTagContainers.length;i++){
			if(possibleTagContainers[i].children.length > 100){//horrible test, but we have not markup to go from. Assumes the tag dropdown is the only one with more than 100 children
				bestGuess = i;
			};
		};
		if(bestGuess == false){
			return;
		};
		if(possibleTagContainers[bestGuess].hasOwnProperty("hohMarked")){
			return;
		}
		else{
			possibleTagContainers[bestGuess].hohMarked = true;
		};
		var superBody = document.getElementsByClassName("el-dialog__body")[0];
		var descriptionTarget = document.createElement("span");
		descriptionTarget.id = "hohDescription";
		superBody.insertBefore(descriptionTarget,superBody.children[2]);

		for(var i=0;i<possibleTagContainers[bestGuess].children.length;i++){
			possibleTagContainers[bestGuess].children[i].onmouseover = function(){
				if(tagDescriptions[this.children[0].innerText]){
					document.getElementById("hohDescription").innerText = tagDescriptions[this.children[0].innerText];
				}
				else{
					document.getElementById("hohDescription").innerText = "Message hoh to get this description added";
				};
			};
			possibleTagContainers[bestGuess].children[i].onmouseout = function(){
				document.getElementById("hohDescription").innerText = "";
			};
		};
	};
	var tryAgain = function(){//loop the notification script until we leave that page
		setTimeout(function(){
			perform();
			if(document.URL.match(/https:\/\/anilist\.co\/(anime|manga)\/.*/)){
				tryAgain()
			}
			else{
				activeScripts.tagDescriptions = false;
			}
		},400);
	};
	activeScripts.tagDescriptions = true;
	perform();
	tryAgain();
};

var enhanceNotifications = function(){//consists mostly of dark magic. Awfully complicated. Totally.
	//method: the real notifications are parsed, then hidden and a new list of notifications are created using a mix of parsed data and API calls.
	var retries = 3;//workaround for not wasting time when stuff doesn't load right
	var prevLength = 0;
	var perform = function(){
		if(document.URL != "https://anilist.co/notifications"){
			return;
		};
		//cosmetic fix to properly mark notifications as unread.
		var notifications = document.getElementsByClassName("notification");
		if(notifications.length){
			if(notifications[0].actuallyNot){
				return;
			};
		};
		var possibleButton = document.getElementsByClassName("reset-btn");
		if(possibleButton.length){
			if(!possibleButton[0].flag){
				possibleButton[0].flag = true;
				possibleButton[0].onclick = function(){
					var notf = document.getElementById("hohNotifications");
					for(var i=0;i<notf.children.length;i++){
						notf.children[i].classList.remove("hohUnread");
					};
				};
				var regularNotifications = document.createElement("span");
				regularNotifications.style.cursor = "pointer";
				regularNotifications.style.fontSize = "small";
				regularNotifications.innerText = svgAssets.envelope + " Show default notifications";
				regularNotifications.onclick = function(){
					var notifications = document.getElementsByClassName("notification");
					if(!notifications.length){
						return;
					};
					if(!notifications[0].actuallyNot){
						notifications[0].actuallyNot = true;
						var hohNotsToToggle = document.getElementById("hohNotifications");
						if(hohNotsToToggle){
							hohNotsToToggle.style.display = "none";
						};
						var regNotsToToggle = document.getElementsByClassName("notification");
						for(var i=0;i<regNotsToToggle.length;i++){
							regNotsToToggle[i].style.display = "grid";
						};
						this.innerText = svgAssets.envelope + " Show hoh notifications";
					}
					else{
						notifications[0].actuallyNot = false;
						var hohNotsToToggle = document.getElementById("hohNotifications");
						if(hohNotsToToggle){
							hohNotsToToggle.style.display = "block";
						};
						var regNotsToToggle = document.getElementsByClassName("notification");
						for(var i=0;i<regNotsToToggle.length;i++){
							regNotsToToggle[i].style.display = "none";
						};
						this.innerText = svgAssets.envelope + " Show default notifications";
					};
				};
				possibleButton[0].parentNode.appendChild(regularNotifications);
				var setting = document.createElement("p");
				var checkbox = document.createElement("input");
				checkbox.type = "checkbox";
				checkbox.checked = useScripts["hideLikes"];
				checkbox.targetSetting = "hideLikes";
				checkbox.onchange = function(){
					useScripts[this.targetSetting] = this.checked;
					localStorage.setItem("hohSettings",JSON.stringify(useScripts));
					/*var notifications = document.getElementsByClassName("notification");
					if(notifications.length){
						notifications[0].actuallyNot = false;
					};*/
					forceRebuildFlag = true;
				};
				var description = document.createElement("span");
				description.innerText = "Hide like notifications";
				setting.style.fontSize = "small";
				setting.appendChild(checkbox);
				setting.appendChild(description);
				possibleButton[0].parentNode.appendChild(setting);
			};
		};
		var activities = [];//collect the "real" notifications
		for(var i=0;i<notifications.length;i++){//parse real notifications
			notifications[i].already = true;
			notifications[i].style.display = "none";
			var active = {};

			if(
				notifications[i].classList.length > 1
				&& notifications[i].classList[1] != "hasMedia"
			){ //"notification unread" classlist
				active.unread = true;
			}
			else{
				active.unread = false;
			};

			active.type = "special"; //by default every activity is some weird thing we are displaying as-is
			active.link = "aaa";//fixme
			if(//check if we can query that
				notifications[i].children.length >= 1
				&& notifications[i].children[1].children.length
				&& notifications[i].children[1].children[0].children.length
				&& notifications[i].children[1].children[0].children[0].children.length
			){
//
				active.directLink = notifications[i].children[1].children[0].children[0].href
				active.text = notifications[i].children[1].children[0].children[0].innerHTML;
				active.textName = notifications[i].children[1].children[0].children[0].childNodes[0].textContent;
				active.textSpan = notifications[i].children[1].children[0].children[0].childNodes[1].textContent;
				active.link = notifications[i].children[1].children[0].children[0].href.match(/[0-9]+/)[0];
				
				var testType = notifications[i].children[1].children[0].children[0].children[0].textContent;
				if(testType == " liked your activity."){
					active.type = "likeActivity";
				}
				else if(testType == " replied to your activity."){
					active.type = "replyActivity";
				}
				else if(testType == " sent you a message."){
					active.type = "messageActivity";
				}
				else if(testType == " liked your activity reply."){
					active.type = "likeReplyActivity";
				}
				else if(testType == " mentioned you in their activity."){
					active.type = "mentionActivity";
				}
//
			};
			if(active.type == "special"){
				if(
					notifications[i].children.length >= 1
					&& notifications[i].children[1].children.length
					&& notifications[i].children[1].children[0].children.length >= 2
					&& notifications[i].children[1].children[0].children[1].textContent == " started following you."
				){
					active.type = "followActivity";
					active.directLink = notifications[i].children[1].children[0].children[0].href
					active.text = notifications[i].children[1].children[0].children[0].innerHTML;
					active.textName = notifications[i].children[1].children[0].children[0].textContent;
					active.textSpan = notifications[i].children[1].children[0].children[1].textContent;
				}
				else if(
					notifications[i].children.length >= 1
					&& notifications[i].children[1].children.length
					&& notifications[i].children[1].children[0].children.length >= 4
					&& notifications[i].children[1].children[0].children[3].textContent == " aired."
				){
					active.type = "airingActivity";
					active.directLink = notifications[i].children[1].children[0].children[0].href
					active.text = notifications[i].children[1].children[0].innerHTML;
				}
				else{
					active.text = notifications[i].children[1].innerHTML;
				};
			};


			if(
				notifications[i].children.length > 1
				&& notifications[i].children[1].children.length > 1
			){
				active.time = notifications[i].children[1].children[1].innerHTML;
			}
			else{
				active.time = document.createElement("span");
			};
			active.image = notifications[i].children[0].style.backgroundImage;
			active.href = notifications[i].children[0].href;
			activities.push(active);
		};
		if(activities.length == prevLength && forceRebuildFlag == false){
			if(retries == 0){
				return 0;
			}
			else{
				retries--;
			};
		}
		else{
			prevLength = activities.length;
			retries = 3;
			forceRebuildFlag = false;
		};
		if(document.getElementById("hohNotifications")){
			document.getElementById("hohNotifications").remove();
		};
		var newContainer = document.createElement("div");
		newContainer.id = "hohNotifications";
		var notificationsContainer = document.getElementsByClassName("notifications");
		if(!notificationsContainer.length){
			return;
		}
		else{
			notificationsContainer = notificationsContainer[0];
		};
		notificationsContainer.insertBefore(newContainer,notificationsContainer.firstChild);
		for(var i=0;i<activities.length;i++){
			if(useScripts.hideLikes && (activities[i].type == "likeReplyActivity" || activities[i].type == "likeActivity")){
				continue;
			};
			var newNotification = document.createElement("div");
			newNotification.onclick = function(){
				this.classList.remove("hohUnread");
				var notiCount = document.getElementsByClassName("notification-dot");
				if(notiCount.length){
					var actualCount = parseInt(notiCount[0].innerHTML);
					if(actualCount < 2){
						var possibleButton = document.getElementsByClassName("reset-btn");
						if(possibleButton.length){
							possibleButton[0].click();
						};
					}
					else{
						notiCount[0].innerHTML = (actualCount - 1);
					};
				};
			};
			if(activities[i].unread){
				newNotification.classList.add("hohUnread");
			};
			newNotification.classList.add("hohNotification");

			var notImage = document.createElement("a"); //container for profile images
			notImage.href = activities[i].href;
			notImage.classList.add("hohUserImage");
			notImage.style.backgroundImage = activities[i].image;

			var notNotImageContainer = document.createElement("span"); //container for series images
			notNotImageContainer.classList.add("hohMediaImageContainer");

			var text = document.createElement("a");
			text.classList.add("hohMessageText");

			var timeHideFlag = false;

			if(activities[i].type == "likeActivity"){
				for(
					var counter = 0;
					i + counter < activities.length
					&& activities[i + counter].type == "likeActivity"
					&& activities[i + counter].href == activities[i].href;
					counter++
				){//one person likes several of your media activities
					var fakeNotNotImage = document.createElement("img");
					var notNotImage = document.createElement("a");
					notNotImage.href = activities[i + counter].directLink;
					fakeNotNotImage.classList.add("hohMediaImage");
					fakeNotNotImage.classList.add(activities[i + counter].link);
					notNotImage.appendChild(fakeNotNotImage);
					notNotImageContainer.appendChild(notNotImage);
				};
				var activityCounter = counter;
				if(counter > 5){
					timeHideFlag = true;
				}
				else if(document.getElementById("hohNotifications").offsetWidth < 800 && counter > 2){
					timeHideFlag = true;
				};
				if(counter == 1){
					while(
						i + counter < activities.length
						&& activities[i + counter].type == "likeActivity"
						&& activities[i + counter].link == activities[i].link
					){//several people likes one of your activities
						var miniImageWidth = 40;
						var miniImage = document.createElement("a");
						miniImage.classList.add("hohUserImageSmall");
						miniImage.href = activities[i + counter].href;
						miniImage.style.backgroundImage = activities[i + counter].image;
						miniImage.style.height = miniImageWidth + "px";
						miniImage.style.width = miniImageWidth + "px";
						miniImage.style.marginLeft = (72 + (counter-1)*miniImageWidth) + "px";
						newNotification.appendChild(miniImage);
						counter++;
					};
					if(counter > 1){
						text.style.marginTop = "45px";
						activities[i].textName += " +";
					};
				}
				else{
					newNotification.classList.add("hohCombined");
				};

				text.href = activities[i].directLink;
				var textName = document.createElement("span");
				var textSpan = document.createElement("span");
				textName.innerHTML = activities[i].textName;
				textSpan.innerHTML = activities[i].textSpan;
				textName.style.color = "rgb(var(--color-blue))";
				text.appendChild(textName);
				if(activityCounter > 1){
					textSpan.innerHTML = " liked your activities.";
				};
				text.appendChild(textSpan);
				i += counter -1;
			}
			else if(activities[i].type == "replyActivity"){
				var fakeNotNotImage = document.createElement("img");
				var notNotImage = document.createElement("a");
				notNotImage.href = activities[i].directLink;
				fakeNotNotImage.classList.add("hohMediaImage");
				fakeNotNotImage.classList.add(activities[i].link);
				notNotImage.appendChild(fakeNotNotImage);
				notNotImageContainer.appendChild(notNotImage);
				var counter = 1;
				while(
					i + counter < activities.length
					&& activities[i + counter].type == "replyActivity"
					&& activities[i + counter].link == activities[i].link
				){
					var miniImageWidth = 40;
					var miniImage = document.createElement("a");
					miniImage.classList.add("hohUserImageSmall");
					miniImage.href = activities[i + counter].href;
					miniImage.style.backgroundImage = activities[i + counter].image;
					miniImage.style.height = miniImageWidth + "px";
					miniImage.style.width = miniImageWidth + "px";
					miniImage.style.marginLeft = (72 + (counter-1)*miniImageWidth) + "px";
					newNotification.appendChild(miniImage);
					counter++;
				};
				if(counter > 1){
					text.style.marginTop = "45px";
					activities[i].textName += " +";
				};

				text.href = activities[i].directLink;
				var textName = document.createElement("span");
				var textSpan = document.createElement("span");
				textName.innerHTML = activities[i].textName;
				textSpan.innerHTML = activities[i].textSpan;
				textName.style.color = "rgb(var(--color-blue))";
				text.appendChild(textName);
				text.appendChild(textSpan);
				i += counter -1;
			}
			else if(
				activities[i].type == "messageActivity"
				|| activities[i].type == "likeReplyActivity"
				|| activities[i].type == "mentionActivity"
			){
				var fakeNotNotImage = document.createElement("img");
				var notNotImage = document.createElement("a");
				notNotImage.href = activities[i].directLink;
				fakeNotNotImage.classList.add("hohMediaImage");
				fakeNotNotImage.classList.add(activities[i].link);
				notNotImage.appendChild(fakeNotNotImage);
				notNotImageContainer.appendChild(notNotImage);
				text.href = activities[i].directLink;
				var textName = document.createElement("span");
				var textSpan = document.createElement("span");
				textName.innerHTML = activities[i].textName;
				textSpan.innerHTML = activities[i].textSpan;
				textName.style.color = "rgb(var(--color-blue))";
				text.appendChild(textName);
				text.appendChild(textSpan);
			}
			else if(activities[i].type == "airingActivity"){
				//text.href = activities[i].directLink;
				var textSpan = document.createElement("span");
				textSpan.innerHTML = activities[i].text;
				text.appendChild(textSpan);
			}
			else if(activities[i].type == "followActivity"){
				text.href = activities[i].directLink;
				var textName = document.createElement("span");
				var textSpan = document.createElement("span");
				textName.innerHTML = activities[i].textName;
				textSpan.innerHTML = activities[i].textSpan;
				textName.style.color = "rgb(var(--color-blue))";
				text.appendChild(textName);
				text.appendChild(textSpan);
			}
			else{//display as-is
				var textSpan = document.createElement("span");
				textSpan.classList.add("hohUnhandledSpecial");
				textSpan.innerHTML = activities[i].text;
				text.appendChild(textSpan);
			};

			var time = document.createElement("div");
			time.classList.add("hohTime");
			time.innerHTML = activities[i].time;

			var commentsContainer = document.createElement("div");
			commentsContainer.classList.add("hohCommentsContainer");
			commentsContainer.classList.add("b" + activities[i].link);//possible replies

			var comments = document.createElement("a");
			comments.classList.add("hohComments");
			comments.innerHTML = "comments<span class=\"hohMonospace\">+</span>";
			comments.onclick = function(){
				if(this.innerText == "comments+"){
					this.innerHTML = "comments<span class=\"hohMonospace\">-</span>";
					this.parentNode.children[1].style.display = "inline-block";
					var query = queryActivity;
					var variables = {
						id: +this.parentNode.classList[1].substring(1)
					};
					var vars = {};
					var commentCallback = function(data,vars){
						var listOfComments = document.getElementsByClassName("b" + data.data.Activity.id);
						for(var k=0;k<listOfComments.length;k++){
							while(listOfComments[k].children[1].childElementCount ){
								listOfComments[k].children[1].removeChild(listOfComments[k].children[1].lastChild);
							};
							for(var l=0;l<data.data.Activity.replyCount;l++){
								var quickCom = document.createElement("div");
								quickCom.classList.add("hohQuickCom");
								var quickComName = document.createElement("span");
								quickComName.classList.add("hohQuickComName");
								quickComName.innerHTML = data.data.Activity.replies[l].user.name;
								if(data.data.Activity.replies[l].user.name === whoAmI){//replace with class later
									quickComName.style.color = "rgb(var(--color-green))";
								};
								var quickComContent = document.createElement("span");
								quickComContent.classList.add("hohQuickComContent");
								quickComContent.innerHTML = data.data.Activity.replies[l].text;
								var quickComLikes = document.createElement("span");
								quickComLikes.classList.add("hohQuickComLikes");
								if(data.data.Activity.replies[l].likes.length > 1){
									quickComLikes.innerHTML = data.data.Activity.replies[l].likes.length + "♥";
								}
								else if(data.data.Activity.replies[l].likes.length){
									quickComLikes.innerHTML = "♥";
								};
								for(var m=0;m<data.data.Activity.replies[l].likes.length;m++){
									if(data.data.Activity.replies[l].likes[m].name == whoAmI){//replace with class later
										quickComLikes.style.color = "rgb(var(--color-red))";
									};
								};
								quickCom.appendChild(quickComName);
								quickCom.appendChild(quickComContent);
								quickCom.appendChild(quickComLikes);
								listOfComments[k].children[1].appendChild(quickCom);
							};
						};
					};
					listActivityCall(query,variables,commentCallback,vars,false);
				}
				else{
					this.innerHTML = "comments<span class=\"hohMonospace\">+</span>";
					this.parentNode.children[1].style.display = "none";
				};
			};
			comments.classList.add("link");

			var commentsArea = document.createElement("div");
			commentsArea.classList.add("hohCommentsArea");

			commentsContainer.appendChild(comments);
			commentsContainer.appendChild(commentsArea);

			newNotification.appendChild(notImage);
			newNotification.appendChild(text);
			newNotification.appendChild(notNotImageContainer);
			if(!timeHideFlag){
				newNotification.appendChild(time);
			};
			newNotification.appendChild(commentsContainer);
			newContainer.appendChild(newNotification);
		};
		for(var i=0;document.APIcallsUsed < 90;i++){//heavy
            if(!activities.length || i >= activities.length){//loading is difficult to predict. There may be nothing there when this runs
                break;
            };
			var imageCallBack = function(data,vars){
				var type = data.data.Activity.type;
				var extra = 0;
				for(var j=0;j<notifications.length;j++){
					extra = j;
					if(notifications[j].hasOwnProperty("already")){
						break;
					};
				};
				if(type == "ANIME_LIST" || type == "MANGA_LIST"){
					var listOfStuff = document.getElementsByClassName(data.data.Activity.id);
					for(var k=0;k<listOfStuff.length;k++){
						listOfStuff[k].style.backgroundImage = "url(" + data.data.Activity.media.coverImage.large + ")";
						listOfStuff[k].classList.add("hohBackgroundCover");
					};
				}
				else if(type == "TEXT"){
					var listOfStuff = document.getElementsByClassName(data.data.Activity.id);
					for(var k=0;k<listOfStuff.length;k++){
						listOfStuff[k].style.backgroundImage = "url(" + data.data.Activity.user.avatar.large + ")";
						listOfStuff[k].classList.add("hohBackgroundUserCover");
						if(data.data.Activity.text.match(/^(!share|RT)/)){
							var container = listOfStuff[k].parentNode;
							if(!container.classList.contains("hohMediaImageContainer")){
								container = container.parentNode;
							};
							container.previousSibling.children[1].innerHTML = container.previousSibling.children[1].innerHTML.replace("activity","retweet");//experimental
							container.previousSibling.children[1].innerHTML = container.previousSibling.children[1].innerHTML.replace("activitie","retweet");
						};
					};
				};
				if(data.data.Activity.replyCount){
					var listOfComments = document.getElementsByClassName("b" + data.data.Activity.id);
					for(var k=0;k<listOfComments.length;k++){
						if(listOfComments[k].children[0].style.display != "block"){
							listOfComments[k].children[0].style.display = "block";
							for(var l=0;l<data.data.Activity.replyCount;l++){
								var quickCom = document.createElement("div");
								quickCom.classList.add("hohQuickCom");
								var quickComName = document.createElement("span");
								quickComName.classList.add("hohQuickComName");
								quickComName.innerHTML = data.data.Activity.replies[l].user.name;
								if(data.data.Activity.replies[l].user.name === whoAmI){
									quickComName.style.color = "rgb(var(--color-green))";
								};
								var quickComContent = document.createElement("span");
								quickComContent.classList.add("hohQuickComContent");
								quickComContent.innerHTML = data.data.Activity.replies[l].text;
								var quickComLikes = document.createElement("span");
								quickComLikes.classList.add("hohQuickComLikes");
								if(data.data.Activity.replies[l].likes.length > 1){
									quickComLikes.innerHTML = data.data.Activity.replies[l].likes.length + "♥";
								}
								else if(data.data.Activity.replies[l].likes.length){
									quickComLikes.innerHTML = "♥";
								};
								for(var m=0;m<data.data.Activity.replies[l].likes.length;m++){
									if(data.data.Activity.replies[l].likes[m].name == whoAmI){
										quickComLikes.style.color = "rgb(var(--color-red))";
									};
								};
								quickCom.appendChild(quickComName);
								quickCom.appendChild(quickComContent);
								quickCom.appendChild(quickComLikes);
								listOfComments[k].children[1].appendChild(quickCom);
							};
						};
					};
				};
			};
			var vars = {
				find: i
			};
			var query = queryActivity;
            if(activities[i].link[0] != "a"){//activities with post link
				if(activities.length){
					var variables = {
						id: +activities[i].link
					};
					if(localStorageAvailable){
						var localStorageItem = localStorage.getItem(variables.id + "");
						if(
							!(localStorageItem === null)
							|| !pending.hasOwnProperty(activities[i].link)
						){
							listActivityCall(query,variables,imageCallBack,vars,true);
							pending[activities[i].link] = true;
						};
					}
					else if(
						activityCache.hasOwnProperty(activities[i].link)
						|| !pending.hasOwnProperty(activities[i].link)
					){
						listActivityCall(query,variables,imageCallBack,vars,true);
						pending[activities[i].link] = true;
					};
				};
			};
		};
		return notifications.length;
	};
	var tryAgain = function(){//run the function again and again until we leave that page
		setTimeout(function(){
			perform();
			if(document.URL == "https://anilist.co/notifications"){
				tryAgain()
			}
			else{
				activeScripts.notifications = false;
			}
		},300);
	};
	activeScripts.notifications = true;
	perform();
	tryAgain();
};//end enhanceNotifications

var enhanceFavourites = function(){//adds a button to show more of a users anime favourites if above 25
	return;//doesn't work
	var matched = false;
	var pending = false;
	var perform = function(){
		if(!document.URL.match(/https:\/\/anilist\.co\/user\/?/)){
			return;
		}
		else if(document.URL.match(/\/favorites$/)){
			return;
		};
		var favSection = document.getElementsByClassName("favourites");
		if(!favSection || favSection.length == 0){
			return;
		};
		var listLocation = 0;
		if(favSection[0].children.length){
			if(
				favSection[0].children[0].classList.length
				&& favSection[0].children[0].classList[0] == "reorder-btn"
			){
				listLocation = 1;
			};
		}
		else{
			return;
		};
		if(
			favSection[0].children[listLocation].children.length > 1
		){
			matched = true;
			if(favSection[0].children[listLocation].children[1].children.length == 25){
				var addMoreFavs = function(data){
					if(data.data.User.favourites.anime.edges.length == 0){//user only has exactly 25 favs
						return;
					};
					for(var i=0;i<data.data.User.favourites.anime.edges.length;i++){
						var newFav = document.createElement("div");
						newFav.classList.add("media-preview-card");
						newFav.classList.add("small");
						newFav.setAttribute("data-v-711636d7", "");//to allow native Anilist selectors to take effect. Not sure how rigid it is.
						newFav.setAttribute("data-v-0f38b704", "");/*replace with extra class later*/
						newFav.style.display = "none";

						var newFavCover = document.createElement("a");
						newFavCover.classList.add("cover");
						newFavCover.style.backgroundImage = "url(" + data.data.User.favourites.anime.edges[i].node.coverImage.large + ")";
						newFavCover.setAttribute("data-v-711636d7", "");
						newFavCover.href = "https://anilist.co/anime/" + data.data.User.favourites.anime.edges[i].node.id;

						var newFavContent = document.createElement("div");
						newFavContent.classList.add("content");
						//newFavContent.innerHTML = "test" + i;
						newFav.appendChild(newFavCover);
						newFav.appendChild(newFavContent);
						if(favSection.length){
							favSection[0].children[listLocation].children[1].appendChild(newFav);
						};
					};
				
					var expandButton = document.createElement("button");
					expandButton.innerHTML = "+";
					expandButton.onclick = function(){
						for(var j=0;j<this.parentNode.children.length;j++){
							this.parentNode.children[j].style.display = "inline-grid";
						};
						this.style.display = "none";
					};
					if(favSection.length){
						favSection[0].children[listLocation].children[1].appendChild(expandButton);
					};
				};
				var nameMatch = /https:\/\/anilist\.co\/user\/([0-9a-zA-Z-]+)\/?/;
				var variables = {
					name: nameMatch.exec(document.URL)[1]
				};
				var query = `
query ($name: String!) {
  User (name: $name) {
    favourites {
      anime (page: 2, perPage: 25){
        edges {
          favouriteOrder
          node {
            id
            title {
              userPreferred
            }
            coverImage {
              large
            }
          }
        }
      }
    }
  }
}
`;
				if(!pending){
					pending = true;
					generalAPIcall(query,variables,addMoreFavs);
				};
			};
		};
	};
	var tryAgain = function(){//run the function again and again until we leave that page
		setTimeout(function(){
			perform();
			if(document.URL.match(/https:\/\/anilist\.co\/user\/?/) && matched == false){
				tryAgain()
			}
			else{
				activeScripts.favourites = false;
			}
		},1000);//no problem with this being slow
	};
	activeScripts.favourites = true;
	perform();
	tryAgain();
};

var enhanceCharacter = function(){
	if(!document.URL.match(/https:\/\/anilist\.co\/character\/.*/)){
		return;
	};
	var filterGroup = document.getElementsByClassName("content");
	if(!filterGroup.length){
		setTimeout(function(){
			enhanceCharacter();
		},200);//takes some time to load
		return;
	};
	filterGroup = filterGroup[0];
	var favCount = document.createElement("span");
	favCount.id = "hohFavCount";
	favCount.innerText;
	filterGroup.appendChild(favCount);
	var variables = {id: document.URL.match(/\/character\/(\d+)\//)[1]};
	var query = "query($id: Int!){Character(id: $id){favourites}}";
	var favCallback = function(data){
		var favButton = document.getElementsByClassName("favourite");
		if(data.data.Character.favourites == 0 && favButton[0].classList.contains("isFavourite")){//safe to assume
			document.getElementById("hohFavCount").innerText = data.data.Character.favourites+1;
		}
		else{
			document.getElementById("hohFavCount").innerText = data.data.Character.favourites;
		};
		if(favButton.length){
			favButton[0].onclick = function(){
				var favCount = document.getElementById("hohFavCount");
				if(this.classList.contains("isFavourite")){
					favCount.innerText = Math.max(parseInt(favCount.innerText)-1,0);//0 or above, just to avoid looking silly
				}
				else{
					favCount.innerText = parseInt(favCount.innerText)+1;
				};
			};
		};
	};
	generalAPIcall(query,variables,favCallback);
};

var usefulLinks = function(){
	if(!document.URL.match(/https:\/\/anilist\.co\/home\/?/)){
		return;
	};
	var filterGroup = document.getElementsByClassName("recent-reviews");
	if(!filterGroup.length){
		setTimeout(function(){
			usefulLinks();
		},200);//takes some time to load
		return;
	};
	var attributes = filterGroup[0].children[0].attributes;
	sideBar = filterGroup[0].parentNode;
	var linksArea = document.createElement("div");
	var linksHead = document.createElement("h2");
	linksHead.setAttribute(attributes[0].name,"");
	linksHead.innerText = "Links";
	linksHead.classList.add("section-header");
	linksHead.classList.add("link");//ha ha no
	linksArea.appendChild(linksHead);
	var links = [
		{text:"r/anime watch order wiki",link:"https://www.reddit.com/r/anime/wiki/watch_order"},
		{text:"animefillerlist.com",link:"https://www.animefillerlist.com/"},
		{text:"Laptop userstyle for Anilist",link:"https://userstyles.org/styles/160522/anilist-2018-laptop-modifications"},
		{text:"Compatibility tool",link:"http://www.brendberg.no/anilist/compat.html"},
		{text:"Anime reverse image search",link:"https://trace.moe/"},
		{text:"List of legal streaming sites",link:"https://www.reddit.com/r/anime/wiki/legal_streams_/_downloads"},
		{text:"Legal streaming search engine",link:"https://because.moe/"}
	];
	for(var i=0;i<links.length;i++){
		var link = document.createElement("a");
		link.innerText = links[i].text;
		link.href = links[i].link;
		link.classList.add("hohShamelessLink");
		linksArea.appendChild(link);
	};
	sideBar.appendChild(linksArea);
};

var returnList = function(list){
	var retl = [];
	for(var i=0;i<list.data.MediaListCollection.lists.length;i++){
		for(var j=0;j<list.data.MediaListCollection.lists[i].entries.length;j++){
			var retlObj = list.data.MediaListCollection.lists[i].entries[j];
			if(retlObj.scoreRaw > 100){
				retlObj.scoreRaw = 100;
			}
			if(!retlObj.media.episodes && retlObj.media.nextAiringEpisode){
				retlObj.media.episodes = retlObj.media.nextAiringEpisode.episode - 1;
			}
			retl.push(retlObj);
		};
	};
	return retl.sort(function(a,b){
		return a.mediaId - b.mediaId;
	});
};

var compatCheck = function(list,name,target){
	var query = queryMediaList;
	var variables = {
		name: name,
		listType: "ANIME"
	};
	var targetLocation = document.getElementById(target);
	if(!targetLocation){
		return;
	};
	targetLocation.innerText = "loading...";
	targetLocation.style.marginTop = "5px";
	var secondCallback = function(data,variables){
		var targetLocation = document.getElementById(target);
		if(!targetLocation){
			return;
		};
		var list2 = returnList(data);
		for(var i=1;i<list2.length;i++){//remove duplicates
			if(list2[i].mediaId == list2[i-1].mediaId){
				list2.splice(i-1,1);
				i--;
			};
		};
		var list3 = [];
		var indeks2 = 0;
		for(var i=0;i<list.length && indeks2 < list2.length;i++){
			while(list2[indeks2].mediaId < list[i].mediaId && indeks2 < (list2.length-1)){
				indeks2++;
			};
			if(list2[indeks2].mediaId < list[i].mediaId){
				continue;
			};
			if(list[i].mediaId == list2[indeks2].mediaId ){
				var otb = {};
				otb.mediaId = list[i].mediaId;
				otb.score1 = list[i].scoreRaw;
				otb.score2 = list2[indeks2].scoreRaw;
				list3.push(otb);
			};
		};
	//remove duplicates
		for(var i=1;i<list3.length;i++){
			if(list3[i-1].mediaId == list3[i].mediaId){
				list3.splice(i-1,1);
				i--;
			};
		};
	//remove those with score 0
		for(var i=0;i<list3.length;i++){
			if(list3[i].score1 == 0 || list3[i].score2 == 0){
				list3.splice(i,1);
				i--;
			};
		};
		var average1 = 0;
		var average2 = 0;
		for(var i=0;i<list3.length;i++){
			average1 += list3[i].score1;
			average2 += list3[i].score2;
			//simple diff, while we are at it.
			list3[i].sdiff = list3[i].score1 - list3[i].score2;
		};
		average1 = average1/list3.length;
		average2 = average2/list3.length;
		var standev1 = 0;
		var standev2 = 0;
		for(var i=0;i<list3.length;i++){
			standev1 += Math.pow(list3[i].score1 - average1,2);
			standev2 += Math.pow(list3[i].score2 - average2,2);
		};
		standev1 = Math.sqrt(standev1/(list3.length-1));
		standev2 = Math.sqrt(standev2/(list3.length-1));
		var difference = 0;
		for(var i=0;i<list3.length;i++){
			difference += Math.abs(((list3[i].score1 - average1)/standev1) - ((list3[i].score2 - average2)/standev2));
		};
		difference = difference/list3.length;
		var differenceSpan = document.createElement("span");
		differenceSpan.innerText = difference.toFixed(3);
		if(difference < 0.9){
			differenceSpan.style.color = "green";
		}
		else if(difference > 1.1){
			differenceSpan.style.color = "red";
		};
		targetLocation.innerText = "";
		targetLocation.appendChild(differenceSpan);
		var countSpan = document.createElement("span");
		countSpan.innerText = " based on " + list3.length + " shared entries. Lower is better. 0.8 - 1.1 is common";
		targetLocation.appendChild(countSpan);
		//console.log(list3.sort((b,a)=>a.sdiff - b.sdiff));
	};
	generalAPIcall(query,variables,secondCallback);
};

var addMoreStats = function(){
	if(!document.URL.match(/\/stats$/)){
		return;
	};
	var filterGroup = document.getElementsByClassName("filter-group");
	if(!filterGroup.length){
		setTimeout(function(){
			addMoreStats();
		},200);//takes some time to load
		return;
	};
	filterGroup = filterGroup[0];
	var hohStatsTrigger = document.createElement("span");
	hohStatsTrigger.classList.add("hohStatsTrigger");
	hohStatsTrigger.innerText = "Script & More stats";
	hohStatsTrigger.onclick = function(){
		hohStatsTrigger.classList.add("hohActive");
		var otherActive = document.getElementsByClassName("active");
		for(var j=0;j<otherActive.length;j++){
			otherActive[j].classList.remove("active");
		};
		var statsWrap = document.getElementsByClassName("stats-wrap")[0];
		for(var j=0;j<statsWrap.children.length;j++){
			statsWrap.children[j].style.display = "none";
		};
		var hohStats = document.getElementById("hohStats");
		hohStats.style.display = "initial";
		if(!hohStats.calculated){
			hohStats.calculated = true;
			var databaseStatsHead = document.createElement("h1");
			databaseStatsHead.innerText = "Anilist stats";
			var databaseStats = document.createElement("div");

			var totalAnime = document.createElement("p");
				totalAnime.innerHTML = "Total anime: <span class=\"hohStatValue\" id=\"hohTotalAnimeTarget\"></span>";
			databaseStats.appendChild(totalAnime);
			var totalManga = document.createElement("p");
				totalManga.innerHTML = "Total manga: <span class=\"hohStatValue\" id=\"hohTotalMangaTarget\"></span>";
			databaseStats.appendChild(totalManga);
			var totalUsers = document.createElement("p");
				totalUsers.innerHTML = "Registered users: <span class=\"hohStatValue\" id=\"hohTotalUsersTarget\"></span>";
			databaseStats.appendChild(totalUsers);

			var bigQuery = document.createElement("div");
			bigQuery.style.display = "none";//in dev
				var bigQueryButton = document.createElement("button");
				bigQuery.appendChild(bigQueryButton);
				var bigQueryInput = document.createElement("select");
					var bigQueryInputOption1 = document.createElement("option");
					var bigQueryInputOption2 = document.createElement("option");
					var bigQueryInputOption3 = document.createElement("option");
					bigQueryInput.appendChild(bigQueryInputOption1);
					bigQueryInput.appendChild(bigQueryInputOption2);
					bigQueryInput.appendChild(bigQueryInputOption3);
				bigQuery.appendChild(bigQueryInput);
				var bigQueryExplanation = document.createElement("span");
				bigQueryExplanation.innerText = "get stats for the <n> most popular shows";
				bigQuery.appendChild(bigQueryExplanation);
			databaseStats.appendChild(bigQuery);

			var scriptStatsHead = document.createElement("h1");
			scriptStatsHead.innerText = "Script";
			var scriptStats = document.createElement("div");
			var sVersion = document.createElement("p");
			sVersion.innerHTML = "Version: <span class=\"hohStatValue\">" + scriptVersion + "</span>";
			scriptStats.appendChild(sVersion);
			var sHome = document.createElement("p");
			sHome.innerHTML = "Homepage: <a href=\"https://greasyfork.org/en/scripts/370473-aniscripts\">https://greasyfork.org/en/scripts/370473-aniscripts</a>";
			scriptStats.appendChild(sHome);
			var sInstructions = document.createElement("p");
			sInstructions.innerText = "Some changes requires reloading the page.";
			scriptStats.appendChild(sInstructions);
			var scriptSettings = document.createElement("div");
			if(localStorageAvailable){
				for(var j=0;j<useScriptsDefinitions.length;j++){
					if(useScriptsDefinitions[j].visible){
						var setting = document.createElement("p");
							var checkbox = document.createElement("input");
							checkbox.type = "checkbox";
							checkbox.checked = useScripts[useScriptsDefinitions[j].id];
							checkbox.targetSetting = useScriptsDefinitions[j].id;
							checkbox.onchange = function(){
								useScripts[this.targetSetting] = this.checked;
								localStorage.setItem("hohSettings",JSON.stringify(useScripts));
							};
							var description = document.createElement("span");
							description.innerText = useScriptsDefinitions[j].description;
							setting.appendChild(checkbox);
						setting.appendChild(description);
						scriptSettings.appendChild(setting);
					};
				};
			}
			else{
				var setting = document.createElement("p");
				setting.innerHTML = "Script settings are not available without localstorage";
				scriptSettings.appendChild(setting);
			};

			var personalStats = document.createElement("div");
			personalStats.id = "personalStats";
			var personalStatsManga = document.createElement("div");
			personalStatsManga.id = "personalStatsManga";

			hohStats.appendChild(databaseStatsHead);
			hohStats.appendChild(databaseStats);
			hohStats.appendChild(personalStats);
			hohStats.appendChild(personalStatsManga);
			hohStats.appendChild(document.createElement("hr"));
			hohStats.appendChild(scriptStatsHead);
			hohStats.appendChild(scriptStats);
			hohStats.appendChild(scriptSettings);
//gather some stats
			var query = "query($page:Int,$type:MediaType){Page(page:$page){pageInfo{total}media(type:$type){id}}}";
			generalAPIcall(
				query,
				{page:0,type:"ANIME"},
				function(data){
					document.getElementById("hohTotalAnimeTarget").innerText = data.data.Page.pageInfo.total;
				}
			);
			generalAPIcall(
				query,
				{page:0,type:"MANGA"},
				function(data){
					document.getElementById("hohTotalMangaTarget").innerText = data.data.Page.pageInfo.total;
				}
			);
			generalAPIcall(
				"query($page:Int){Page(page:$page){pageInfo{total}users{id}}}",
				{page:0},
				function(data){
					document.getElementById("hohTotalUsersTarget").innerText = data.data.Page.pageInfo.total
				}
			);
//
			var query = queryMediaList;
			var variables = {
			  	name: document.URL.match(/\/([a-zA-Z0-9-]+)\/stats/)[1],
				listType: "ANIME"
			};
			var personalStatsCallback = function(data){
				var personalStats = document.getElementById("personalStats");
				var personalStatsHead = document.createElement("h1");
				var thisName = document.URL.match(/\/([a-zA-Z0-9-]+)\/stats/)[1];
				personalStatsHead.innerText = "Anime stats for " + thisName;
				personalStats.appendChild(document.createElement("hr"));
				personalStats.appendChild(personalStatsHead);
				var list = returnList(data);
				for(var i=1;i<list.length;i++){//remove duplicates
					if(list[i].mediaId == list[i-1].mediaId){
						list.splice(i-1,1);
						i--;
					};
				};
				if(whoAmI != thisName){
					var compatabilityButton = document.createElement("button");
					compatabilityButton.innerText = "Compatibility";
					compatabilityButton.onclick = function(){compatCheck(list,whoAmI,"hohCheckCompat")};
					personalStats.appendChild(compatabilityButton);
					var hohCheckCompat = document.createElement("div");
					hohCheckCompat.id = "hohCheckCompat";
					personalStats.appendChild(hohCheckCompat);
				};
				var addStat = function(text,value,comment){//value,value,html
					var newStat = document.createElement("p");
					newStat.classList.add("hohStat");
					var newStatText = document.createElement("span");
					newStatText.innerText = text;
					var newStatValue = document.createElement("span");
					newStatValue.innerText = value;
					newStatValue.classList.add("hohStatValue");
					newStat.appendChild(newStatText);
					newStat.appendChild(newStatValue);
					if(comment){
						var newStatComment = document.createElement("span");
						newStatComment.innerHTML = comment;
						newStat.appendChild(newStatComment);
					};
					personalStats.appendChild(newStat);
				};
//
				var oldestYear = 2100;//fix this before 2100
				var oldestMonth = 0;
				var oldestDay = 0;
				for(var i=0;i<list.length;i++){
					if(list[i].startedAt.year){
						if(list[i].startedAt.year < oldestYear){
							oldestYear = list[i].startedAt.year;
							oldestMonth = list[i].startedAt.month;
							oldestDay = list[i].startedAt.day;
						}
						else if(
							list[i].startedAt.year == oldestYear
							&& list[i].startedAt.month < oldestMonth
						){
							oldestYear = list[i].startedAt.year;
							oldestMonth = list[i].startedAt.month;
							oldestDay = list[i].startedAt.day;
						}
						else if(
							list[i].startedAt.year == oldestYear
							&& list[i].startedAt.month == oldestMonth
							&& list[i].startedAt.day < oldestDay
						){
							oldestYear = list[i].startedAt.year;
							oldestMonth = list[i].startedAt.month;
							oldestDay = list[i].startedAt.day;
						};
					};
				};
//
				var previouScore = 0;
				var maxRunLength = 0;
				var maxRunLengthScore = 0;
				var runLength = 0;
				var sumEntries = 0;
				var amount = 0;
				var sumWeight = 0;
				var sumEntriesWeight = 0;
				var median = 0;
				var sumDuration = 0;
				var longestDuration = {
					time: 0,
					name: "",
					status: "",
					rewatch: 0,
					id: 0
				};

				list.sort(function(a,b){return a.scoreRaw - b.scoreRaw});
				for(var i=0;i<list.length;i++){
					var entryDuration = (list[i].media.duration|0)*(list[i].progress|0) + (list[i].media.duration|0)*(list[i].repeat|0)*Math.max((list[i].media.episodes|0),(list[i].progress|0));
					sumDuration += entryDuration;
					if(entryDuration > longestDuration.time){
						longestDuration.time = entryDuration;
						longestDuration.name = list[i].media.title.romaji;
						longestDuration.status = list[i].status;
						longestDuration.rewatch = list[i].repeat;
						longestDuration.id = list[i].mediaId;
					};
					if(list[i].scoreRaw == 0){
						continue;
					};
					if(median == 0){
						median = list[i+Math.floor((list.length-i)/2)].scoreRaw;
					};
					amount++;
					sumEntries += list[i].scoreRaw;
					if(list[i].scoreRaw == previouScore){
						runLength++;
						if(runLength > maxRunLength){
							maxRunLength = runLength;
							maxRunLengthScore = list[i].scoreRaw;
						};
					}
					else{
						runLength = 1;
						previouScore = list[i].scoreRaw;
					};
					sumWeight += (list[i].media.duration|0)*(list[i].media.episodes|0);
					sumEntriesWeight += list[i].scoreRaw*(list[i].media.duration|0)*(list[i].media.episodes|0);
				};
				list.sort(function(a,b){return a.mediaId - b.mediaId});

				if(amount != 0){//no scores
					addStat(
						"Average score: ",
						(Math.round(100*sumEntries/amount)/100).toFixed(2)
					);
					addStat(
						"Average score: ",
						(Math.round(100*sumEntriesWeight/sumWeight)/100).toFixed(2),
						" (weighted by duration)"
					);
					addStat("Median score: ",median);
					addStat("Most common score: ",maxRunLengthScore);
					var singleText = (100*longestDuration.time/sumDuration).toFixed(2) + "% is ";
					singleText += "<a href='https://anilist.co/anime/" + longestDuration.id + "'>" + longestDuration.name + "</a>";
					if(longestDuration.rewatch == 0){
						if(longestDuration.status == "COMPLETED"){}
						else if(longestDuration.status == "CURRENT"){singleText += ". Currently watching."}
						else if(longestDuration.status == "PAUSED"){singleText += ". On hold."}
						else if(longestDuration.status == "DROPPED"){singleText += ". Dropped."};
					}
					else{
						if(longestDuration.status == "COMPLETED"){
							if(longestDuration.rewatch == 1){
								singleText += ". Rewatched once.";
							}
							else if(longestDuration.rewatch == 2){
								singleText += ". Rewatched twice.";
							}
							else{
								singleText += ". Rewatched " + longestDuration.rewatch + " times.";
							};
						}
						else if(longestDuration.status == "CURRENT" || status == "REPEATING"){
							if(longestDuration.rewatch == 1){
								singleText += ". First rewatch in progress.";
							}
							else if(longestDuration.rewatch == 2){
								singleText += ". Second rewatch in progress.";
							}
							else{
								singleText += ". Rewatch number " + longestDuration.rewatch + " in progress.";
							};
						}
						else if(longestDuration.status == "PAUSED"){
							if(longestDuration.rewatch == 1){
								singleText += ". First rewatch on hold.";
							}
							else if(longestDuration.rewatch == 2){
								singleText += ". Second rewatch on hold.";
							}
							else{
								singleText += ". Rewatch number " + longestDuration.rewatch + " on hold.";
							};
						}
						else if(longestDuration.status == "DROPPED"){
							if(longestDuration.rewatch == 1){
								singleText += ". Dropped on first rewatch.";
							}
							else if(longestDuration.rewatch == 2){
								singleText += ". Dropped on second rewatch.";
							}
							else{
								singleText += ". Dropped on rewatch number " + longestDuration.rewatch + ".";
							};
						};
					};
					addStat(
						"Time watched: ",
						(sumDuration/(60*24)).toFixed(2),
						" days (" + singleText + ")"
					);
				};
//
				var TVepisodes = 0;
				var TVepisodesLeft = 0;
				for(var i=0;i<list.length;i++){
					if(list[i].media.format == "TV"){
						TVepisodes += list[i].progress;
						TVepisodes += list[i].repeat * Math.max((list[i].media.episodes|0),list[i].progress);
						if(list[i].status == "CURRENT"){
							TVepisodesLeft += Math.max((list[i].media.episodes|0) - list[i].progress,0);
						};
					};
				};
				addStat("TV episodes watched: ",TVepisodes);
				addStat("TV episodes remaining for current shows: ",TVepisodesLeft);
//
				var tagless = [];
				for(var i=0;i<list.length;i++){
					if(list[i].media.tags.length == 0 && list[i].status != "PLANNING"){
						tagless.push({id:list[i].mediaId,name:list[i].media.title.romaji});
					};
				};
				if(tagless.length){
					var taglessHead = document.createElement("p");
					taglessHead.innerText = "Some shows on your list have no tags. Would you like to help with that?";
					personalStats.appendChild(taglessHead);
					for(var i=0;i<tagless.length && i<10;i++){
						var taglessLink = document.createElement("a");
						taglessLink.innerText = tagless[i].name;
						taglessLink.href = "https://anilist.co/anime/"+tagless[i].id;
						taglessLink.classList.add("hohTaglessLinkException");
						personalStats.appendChild(taglessLink);
					};
				};
//
				var distribution = {
					"TV" : {},
					"MOVIE" : {},
					"TV_SHORT" : {},
					"MUSIC" : {},
					"OVA" : {},
					"ONA" : {},
					"SPECIAL" : {}
				};
				var distributionColours = {
					"COMPLETED" : "rgb(2, 169, 255)",
					"CURRENT" : "rgb(104, 214, 57)",
					"PAUSED" : "rgb(247, 121, 164)",
					"DROPPED" : "rgb(232, 93, 117)",
					"PLANNING" : "rgb(247, 154, 99)"
				};
				for(var i=0;i<list.length;i++){
					try{//reason: some people have manga entries on their anime list. Nasty.
						distribution[list[i].media.format][list[i].status] = (distribution[list[i].media.format][list[i].status]|0) + 1;
					}
					catch{
						console.log(list[i].media.title.romaji);
					};
				};
				var formatDistribution = document.createElement("canvas");
				var margins = {
					height: 200,
					width: 800,
					left: 10,
					right: 10,
					top: 15,
					bottom: 10,
					chartTextBottom: 50
				};
				formatDistribution.width = margins.width;
				formatDistribution.height = margins.height;
				formatDistribution.style.background = "rgb(var(--color-foreground))";
				var formatDistributionHead = document.createElement("p");
				formatDistributionHead.innerText = "Format distribution";
				personalStats.appendChild(formatDistributionHead);
				personalStats.appendChild(formatDistribution);
				var ctx = formatDistribution.getContext("2d");
				var largestValue = 0;
				for(format in distribution){
					for(status in distribution[format]){
						if(distribution[format][status] > largestValue){
							largestValue = distribution[format][status];
						};
					};
				};
				var yAxisLimit = Math.ceil(largestValue/Math.pow(10,(largestValue+"").length-1))*Math.pow(10,(largestValue+"").length-1);
				var chartHeight = margins.height - margins.chartTextBottom - margins.bottom  - margins.top;
				ctx.fillStyle = "rgb(133,150,165)";
				ctx.strokeStyle = "rgb(133,150,165)";
				ctx.textAlign = "end";
				ctx.fillText(yAxisLimit,margins.left + 20,margins.top);
				ctx.fillText(0,margins.left + 20,margins.top + chartHeight);
				ctx.fillText(yAxisLimit/2,margins.left + 20,margins.top + chartHeight/2);
				var chartCellWidth = 100;
				ctx.textAlign = "center";
				ctx.fillText("TV",margins.left + 20 + chartCellWidth/2,margins.top + chartHeight + 20);
				ctx.fillText("Movie",margins.left + 20 + chartCellWidth/2 + 1*chartCellWidth,margins.top + chartHeight + 20);
				ctx.fillText("OVA",margins.left + 20 + chartCellWidth/2 + 2*chartCellWidth,margins.top + chartHeight + 20);
				ctx.fillText("ONA",margins.left + 20 + chartCellWidth/2 + 3*chartCellWidth,margins.top + chartHeight + 20);
				ctx.fillText("TV-Short",margins.left + 20 + chartCellWidth/2 + 4*chartCellWidth,margins.top + chartHeight + 20);
				ctx.fillText("Special",margins.left + 20 + chartCellWidth/2 + 5*chartCellWidth,margins.top + chartHeight + 20);
				ctx.fillText("Music",margins.left + 20 + chartCellWidth/2 + 6*chartCellWidth,margins.top + chartHeight + 20);
				ctx.beginPath();
				ctx.lineWidth = 0.5;
				ctx.moveTo(margins.left + 25,Math.round(margins.top-5));
				ctx.lineTo(margins.width - margins.right,Math.round(margins.top-5));
				ctx.moveTo(margins.left + 25,Math.round(margins.top-5  + chartHeight));
				ctx.lineTo(margins.width - margins.right,Math.round(margins.top-5 + chartHeight));
				ctx.moveTo(margins.left + 25,Math.round(margins.top-5  + chartHeight/2));
				ctx.lineTo(margins.width - margins.right,Math.round(margins.top-5 + chartHeight/2));
				ctx.stroke();

				ctx.textAlign = "start";
				ctx.fillText("Completed",margins.left+65,margins.top + chartHeight + 50);
				ctx.fillText("Current",margins.left+65+chartCellWidth,margins.top + chartHeight + 50);
				ctx.fillText("Paused",margins.left+65+chartCellWidth*2,margins.top + chartHeight + 50);
				ctx.fillText("Dropped",margins.left+65+chartCellWidth*3,margins.top + chartHeight + 50);
				ctx.fillText("Planning",margins.left+65+chartCellWidth*4,margins.top + chartHeight + 50);

				var barWidth = 10;
				ctx.fillStyle = distributionColours["COMPLETED"];
				ctx.fillRect(margins.left+50,margins.top + chartHeight + 40,10,10);
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["TV"]["COMPLETED"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 1*chartCellWidth),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["MOVIE"]["COMPLETED"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 2*chartCellWidth),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["OVA"]["COMPLETED"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 3*chartCellWidth),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["ONA"]["COMPLETED"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 4*chartCellWidth),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["TV_SHORT"]["COMPLETED"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 5*chartCellWidth),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["SPECIAL"]["COMPLETED"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 6*chartCellWidth),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["MUSIC"]["COMPLETED"]|0));

				ctx.fillStyle = distributionColours["CURRENT"];
				ctx.fillRect(margins.left+50+chartCellWidth,margins.top + chartHeight + 40,10,10);
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + barWidth),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["TV"]["CURRENT"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 1*chartCellWidth + barWidth),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["MOVIE"]["CURRENT"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 2*chartCellWidth + barWidth),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["OVA"]["CURRENT"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 3*chartCellWidth + barWidth),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["ONA"]["CURRENT"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 4*chartCellWidth + barWidth),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["TV_SHORT"]["CURRENT"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 5*chartCellWidth + barWidth),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["SPECIAL"]["CURRENT"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 6*chartCellWidth + barWidth),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["MUSIC"]["CURRENT"]|0));

				ctx.fillStyle = distributionColours["PAUSED"];
				ctx.fillRect(margins.left+50+chartCellWidth*2,margins.top + chartHeight + 40,10,10);
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + barWidth*2),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["TV"]["PAUSED"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 1*chartCellWidth + barWidth*2),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["MOVIE"]["PAUSED"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 2*chartCellWidth + barWidth*2),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["OVA"]["PAUSED"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 3*chartCellWidth + barWidth*2),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["ONA"]["PAUSED"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 4*chartCellWidth + barWidth*2),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["TV_SHORT"]["PAUSED"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 5*chartCellWidth + barWidth*2),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["SPECIAL"]["PAUSED"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 6*chartCellWidth + barWidth*2),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["MUSIC"]["PAUSED"]|0));

				ctx.fillStyle = distributionColours["DROPPED"];
				ctx.fillRect(margins.left+50+chartCellWidth*3,margins.top + chartHeight + 40,10,10);
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + barWidth*3),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["TV"]["DROPPED"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 1*chartCellWidth + barWidth*3),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["MOVIE"]["DROPPED"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 2*chartCellWidth + barWidth*3),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["OVA"]["DROPPED"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 3*chartCellWidth + barWidth*3),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["ONA"]["DROPPED"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 4*chartCellWidth + barWidth*3),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["TV_SHORT"]["DROPPED"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 5*chartCellWidth + barWidth*3),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["SPECIAL"]["DROPPED"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 6*chartCellWidth + barWidth*3),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["MUSIC"]["DROPPED"]|0));


				ctx.fillStyle = distributionColours["PLANNING"];
				ctx.fillRect(margins.left+50+chartCellWidth*4,margins.top + chartHeight + 40,10,10);
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + barWidth*4),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["TV"]["PLANNING"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 1*chartCellWidth + barWidth*4),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["MOVIE"]["PLANNING"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 2*chartCellWidth + barWidth*4),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["OVA"]["PLANNING"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 3*chartCellWidth + barWidth*4),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["ONA"]["PLANNING"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 4*chartCellWidth + barWidth*4),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["TV_SHORT"]["PLANNING"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 5*chartCellWidth + barWidth*4),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["SPECIAL"]["PLANNING"]|0));
				ctx.fillRect(Math.round(margins.left + chartCellWidth/2 + 6*chartCellWidth + barWidth*4),Math.round(margins.top + chartHeight - 5),barWidth,(-chartHeight/yAxisLimit)*(distribution["MUSIC"]["PLANNING"]|0));

				if(oldestYear < 2100){
					var joinedAnilist = document.createElement("p");
					joinedAnilist.innerText = "First logged anime: " + oldestYear + "-" + oldestMonth + "-" + oldestDay + ". (users can change start dates)";
					personalStats.appendChild(joinedAnilist);
				};
				var customTags = [];
				for(var i=0;i<list.length;i++){
					if(list[i].notes){
						var tagMatches = list[i].notes.match(/(#\S+)/g);
						if(tagMatches){
							for(var j=0;j<tagMatches.length;j++){
								if(tagMatches[j].match(/#039/)){
									continue;
								};
								var foundFlag = false;
								for(var k=0;k<customTags.length;k++){
									if(customTags[k].name == tagMatches[j]){
										customTags[k].list.push(list[i].scoreRaw);
										foundFlag = true;
										break;
									};
								};
								if(!foundFlag){
									customTags.push(
										{
											name : tagMatches[j],
											list : [list[i].scoreRaw]
										}
									);
								};
							};
						};
					};
				};
				for(var i=0;i<customTags.length;i++){
					var amountCount = 0;
					var average = 0;
					for(var j=0;j<customTags[i].list.length;j++){
						if(customTags[i].list[j] != 0){
							amountCount++;
							average += customTags[i].list[j];
						};
					};
					if(average != 0){
						average = average/amountCount;
					};
					customTags[i].average = average;
				};
				customTags.sort(function(b,a){return a.list.length - b.list.length});
				if(customTags.length > 1){
					var randomData = "data-v-e2beaf26";
					var customTagsHead = document.createElement("h1");
					customTagsHead.innerText = "Custom Tags";
					var customTagsTable = document.createElement("div");
					customTagsTable.classList.add("table");
					customTagsTable.setAttribute(randomData,"");
					var headerRow = document.createElement("div");
					headerRow.classList.add("header");
					headerRow.classList.add("row");
					headerRow.setAttribute(randomData,"");
					var headerRowTag = document.createElement("div");
					var headerRowCount = document.createElement("div");
					var headerRowScore = document.createElement("div");
					headerRowTag.innerText = "Tag";
					headerRowCount.innerText = "Count";
					headerRowScore.innerText = "Mean Score";
					headerRowTag.setAttribute(randomData,"");
					headerRowCount.setAttribute(randomData,"");
					headerRowScore.setAttribute(randomData,"");
					headerRow.appendChild(headerRowTag);
					headerRow.appendChild(headerRowCount);
					headerRow.appendChild(headerRowScore);
					customTagsTable.appendChild(headerRow);
					for(var i=0;i<customTags.length;i++){
						var row = document.createElement("div");
						row.setAttribute(randomData,"");
						row.classList.add("row");
						var nameCell = document.createElement("div");
						nameCell.setAttribute(randomData,"");
						var nameCellCount = document.createElement("div");
						nameCellCount.setAttribute(randomData,"");
						var nameCellTag = document.createElement("a");
						nameCellTag.setAttribute("data-v-2f71893a","");
						nameCellCount.innerText = (i+1);
						nameCellCount.classList.add("count");
						nameCellTag.innerText = customTags[i].name;
						nameCell.appendChild(nameCellCount);
						nameCell.appendChild(nameCellTag);
						row.appendChild(nameCell);
						var countCell = document.createElement("div");
						countCell.setAttribute(randomData,"");
						countCell.innerText = customTags[i].list.length;
						row.appendChild(countCell);
						var scoreCell = document.createElement("div");
						scoreCell.setAttribute(randomData,"");
						scoreCell.innerText = Math.round(customTags[i].average);
						row.appendChild(scoreCell);
						customTagsTable.appendChild(row);
					};
					personalStats.appendChild(customTagsHead);
					personalStats.appendChild(customTagsTable);
				};
			};
			generalAPIcall(query,variables,personalStatsCallback);
			var query = queryMediaList;
			var variables = {
			  	name: document.URL.match(/\/([a-zA-Z0-9-]+)\/stats/)[1],
				listType: "MANGA"
			};
			var personalStatsMangaCallback = function(data){
				var thisName = document.URL.match(/\/([a-zA-Z0-9-]+)\/stats/)[1];
				var personalStatsManga = document.getElementById("personalStatsManga");
				var personalStatsMangaHead = document.createElement("h1");
				personalStatsMangaHead.innerText = "Manga stats for " + thisName;
				personalStatsManga.appendChild(document.createElement("hr"));
				personalStatsManga.appendChild(personalStatsMangaHead);
				var returnList = function(list){
					var retl = [];
					for(var i=0;i<list.data.MediaListCollection.lists.length;i++){
						for(var j=0;j<list.data.MediaListCollection.lists[i].entries.length;j++){
							var retlObj = list.data.MediaListCollection.lists[i].entries[j];
							if(retlObj.scoreRaw > 100){
								retlObj.scoreRaw = 100;
							};
							retl.push(retlObj);
						};
					};
					return retl.sort(function(a,b){
						return a.mediaId - b.mediaId;
					});
				};
				var list = returnList(data);
				for(var i=1;i<list.length;i++){//remove duplicates
					if(list[i].mediaId == list[i-1].mediaId){
						list.splice(i-1,1);
						i--;
					};
				};
				var personalStatsMangaContainer = document.createElement("div");
				personalStatsMangaContainer.innerText = "Propose some stats I can put here";
				personalStatsManga.appendChild(personalStatsMangaContainer);
				var addStat = function(text,value,comment){//value,value,html
					var newStat = document.createElement("p");
					newStat.classList.add("hohStat");
					var newStatText = document.createElement("span");
					newStatText.innerText = text;
					var newStatValue = document.createElement("span");
					newStatValue.innerText = value;
					newStatValue.classList.add("hohStatValue");
					newStat.appendChild(newStatText);
					newStat.appendChild(newStatValue);
					if(comment){
						var newStatComment = document.createElement("span");
						newStatComment.innerHTML = comment;
						newStat.appendChild(newStatComment);
					};
					personalStatsManga.appendChild(newStat);
				};
				var chapters = 0;
				var volumes = 0;
				/*
				For most airing anime, Anilist provides "media.nextAiringEpisode.episode"
				Unfortunately, the same is not the case for releasing manga.
				THIS DOESN'T MATTER the first time a user is reading something, as we are then just using the current progress.
				But on a re-read, we need the total length to count all the chapters read.
				I can (and do) get a lower boud for this by using the current progress (this is what Anilist does),
				but this is not quite accurate, especially early in a re-read.
				The list below is to catch some of those exceptions
				*/
				var commonUnfinishedManga = {
					"53390":{//aot
						chapters:110,
						volumes:26
					},
					"30002":{//berserk
						chapters:357,
						volumes:40
					},
					"30013":{//one piece
						chapters:921,
						volumes:90
					},
					"85486":{//mha
						chapters:202,
						volumes:20
					},
					"74347":{//opm
						chapters:99,
						volumes:17
					},
					"30026":{//HxH
						chapters:385,
						volumes:36
					},
					"30656":{//vagabond
						chapters:327,
						volumes:37
					},
					"30104":{//yotsuba
						chapters:102,
						volumes:14
					}
				};
				var listCreatedTime = new Date(2018,9,26);
				var currentTime = new Date();
				if(currentTime - listCreatedTime > 365*24*60*60*1000){
					console.log("remind hoh to update the commonUnfinishedManga list");
				};
				var unfinishedLookup = function(mediaId,mode,mediaStatus){
					if(mediaStatus == "FINISHED"){
						return 0;//it may have finished since the list was updated
					};
					if(commonUnfinishedManga.hasOwnProperty(mediaId)){
						if(mode == "chapters"){
							return commonUnfinishedManga[mediaId].chapters;
						}
						else{
							return commonUnfinishedManga[mediaId].volumes;
						};
					}
					else{
						return 0;//not in our list
					};
				};
				for(var i=0;i<list.length;i++){
					if(list[i].status == "COMPLETED"){//if it's completed, we can make some safe assumptions
						chapters += Math.max(//chapter progress on the current read
							list[i].media.chapters,//in most cases, it has a chapter count
							list[i].media.volumes,//if not, there's at least 1 chapter per volume
							list[i].progress,//if it doesn't have a volume count either, the current progress is probably not out of date
							list[i].progressVolumes,//if it doesn't have a chapter progress, count at least 1 chapter per volume
							1//finally, an entry has at least 1 chapter
						);
					}
					else{//we may only assume what's on the user's list.
						chapters += Math.max(
							list[i].progress,
							list[i].progressVolumes
						);
					};
					chapters += list[i].repeat * Math.max(//chapters from re-reads
						list[i].media.chapters,
						list[i].media.volumes,
						list[i].progress,
						list[i].progressVolumes,
						unfinishedLookup(list[i].mediaId+"","chapters",list[i].media.status),//use our lookup table
						1
					);
					volumes += list[i].progressVolumes;
					volumes += list[i].repeat * Math.max(//many manga have no volumes, so we can't make all of the same assumptions
						list[i].media.volumes,
						list[i].progressVolumes,//better than nothing if a volume count is missing
						unfinishedLookup(list[i].mediaId+"","volumes",list[i].media.status)
					);
				};
				addStat("Total chapters: ",chapters);
				addStat("Total volumes: ",volumes);
			};
			generalAPIcall(query,variables,personalStatsMangaCallback);
		};
	};
	for(var i=1;i<filterGroup.children.length;i++){
		filterGroup.children[i].onclick = function(){
			var statsWrap = document.getElementsByClassName("stats-wrap")[0];
			for(var j=0;j<statsWrap.children.length;j++){
				statsWrap.children[j].style.display = "initial";
			};
			var hohActive = document.getElementsByClassName("hohActive");
			for(var j=0;j<hohActive.length;j++){
				hohActive[j].classList.remove("hohActive");
			};
			document.getElementById("hohStats").style.display = "none";
		};
	};
	var statsWrap = document.getElementsByClassName("stats-wrap");
	if(statsWrap.length){
		statsWrap = statsWrap[0];
		var hohStats = document.createElement("div");
		hohStats.id = "hohStats";
		hohStats.style.display = "none";
		hohStats.calculated = false;
		statsWrap.appendChild(hohStats);
	};
	filterGroup.appendChild(hohStatsTrigger);
};

var handleScripts = function(url){
	if(url == "https://anilist.co/notifications" && activeScripts.notifications == false && useScripts.notifications){
		enhanceNotifications();
	}
	else if(
		url.match(/https:\/\/anilist\.co\/(anime|manga)\/\d*\/[0-9a-zA-Z-]*\/social/)
	){
		if(activeScripts.socialTab == false && useScripts.socialTab){
			enhanceSocialTab();
		};
	}
	else if(
		url.match(/\/stats$/)
		&& activeScripts.moreStats == false
		&& useScripts.moreStats
	){
		addMoreStats();
	}
	else if(
		url.match(/https:\/\/anilist\.co\/user\/?/)
	){
		if(activeScripts.favourites == false && useScripts.favourites){
			enhanceFavourites();
		};
		if(activeScripts.completedScore == false && useScripts.completedScore){//we also want this script to run on user pages
			addCompletedScores();
		};
		if(activeScripts.reTweet == false && useScripts.reTweet){
			reTweet();
		};
	}
	else if(
		url.match(/https:\/\/anilist\.co\/forum\/thread\/.*/)
		&& activeScripts.forumComments == false
		&& useScripts.forumComments
	){
		enhanceForum();
	}
	else if(
		url.match(/https:\/\/anilist\.co\/staff\/.*/)
		&& activeScripts.staffPages == false
		&& useScripts.staffPages
	){
		enhanceStaff();
	}
	else if(
		url.match(/https:\/\/anilist\.co\/character\/.*/)
		&& activeScripts.characterFavouriteCount == false
		&& useScripts.characterFavouriteCount
	){
		enhanceCharacter();
	}
	else if(
		url.match(/https:\/\/anilist\.co\/(anime|manga)\/.*/)
	){
		if(activeScripts.tagDescriptions == false && useScripts.tagDescriptions){
			enhanceTags();
		};
		if(activeScripts.userRecs == false && useScripts.userRecs){
			userRecs();
		};
	}
	else if(
		url.match(/https:\/\/anilist\.co\/home\/?/)
	){
		if(activeScripts.completedScore == false && useScripts.completedScore){
			addCompletedScores();
		};
		if(activeScripts.usefulLinks == false && useScripts.usefulLinks){
			usefulLinks();
		};
		if(activeScripts.reTweet == false && useScripts.reTweet){
			reTweet();
		};	
	}
	else if(
		url.match(/https:\/\/anilist\.co\/activity\/?/)
	){
		if(activeScripts.completedScore == false && useScripts.completedScore){
			addCompletedScores();
		};
		if(activeScripts.reTweet == false && useScripts.reTweet){
			reTweet();
		};
	};
};
var activeScripts = {
	notifications : false,
	socialTab : false,
	favourites : false,
	forumComments : false,
	staffPages : false,
	tagDescriptions : false,
	completedScore : false,
	moreStats : false,
	characterFavouriteCount : false,
	usefulLinks : false,
	reTweet : false,
	userRecs : false
};

var useScriptsDefinitions = [
{
	id: "notifications",
	visible: true,
	description: "Improve notifications"
},{
	id: "hideLikes",
	visible: false,
	description: "Hide like notifications. Will not affect the notification count."
},{
	id: "socialTab",
	visible: true,
	description: "Make activities on the social tab more compact and calculate the average score of people you follow"
},{
	id: "forumComments",
	visible: true,
	description: "Add button to collapse comment threads in the forum"
},{
	id: "staffPages",
	visible: false,
	description: "Currently does nothing"
},{
	id: "tagDescriptions",
	visible: true,
	description: "Show the definitions of tags when adding new ones to an entry"
},{
	id: "completedScore",
	visible: true,
	description: "Show the score on the activity when people complete something"
},{
	id: "moreStats",
	visible: false,
	description: "Show an additional tab on the stats page"
},{
	id: "characterFavouriteCount",
	visible: true,
	description: "Show favourite count on character page"
},{
	id: "usefulLinks",
	visible: true,
	description: "Display some links in the home page sidebar"
},{
	id: "userRecs",
	visible: true,
	description: "Show recommendations"
},{
	id: "favourites",
	visible: true,
	description: "Add button to show more favourites for users with more than 25 [will be fixed soon™]"
},{
	id: "CSSfavs",
	visible: true,
	description: "Use the same favourite layout [from userstyle]"
},{
	id: "CSScompactBrowse",
	visible: true,
	description: "Use a compact view in the browse section [from userstyle]"
},{
	id: "CSSSFWmode",
	visible: true,
	description: "SFW mode. Dims images, uses less flashy colours, hides gifs, videos and more [Experimental]"
},{
	id: "CSSgreenManga",
	visible: true,
	description: "Green titles for manga activities"
},{
	id: "CSSfollowCounter",
	visible: true,
	description: "10-width follow section with count [from userstyle]"
},{
	id: "CSSdecimalPoint",
	visible: true,
	description: "Give whole numbers a \".0\" suffix when using the 10 point decimal scoring system"
},{
	id: "memeScripts",
	visible: true,
	description: "Allow running weird stuff in status posts. (that is, javascript)"
},{
	id: "reTweet",
	visible: true,
	description: "Render old retweets [legacy]"
},{
	id: "reTweetKiller",
	visible: true,
	description: "I hate retweets. Hide them from me. (the \"Check for retweets\" setting must be turned on for this to work) [legacy]"
}
];
var current = "";
setInterval(function(){
	if(document.URL != current){
		current = document.URL;
		handleScripts(current);
	};
	var expandPossible = document.getElementsByClassName("description-length-toggle");
	if(expandPossible.length){
		expandPossible[0].click();
	};
},200);
var tagDescriptions = {
"4-koma" : "A manga in the 'yonkoma' format, which consists of four equal-sized panels arranged in a vertical strip.",
"Achronological Order" : "Chapters/episodes do not occur in chronological order.",
"Afterlife" : "Partly or completely set in the afterlife.",
"Age Gap" : "Prominently features romantic relations between people with a significant age difference.",
"Age Regression" : "Prominently features a character who was returned to a younger state.",
"Ahegao" : "Features a character making an exaggerated orgasm face.",
"Airsoft" : "Centers around the sport of airsoft.",
"Aliens" : "Prominently features extraterrestrial lifeforms.",
"Alternate Universe" : "Features multiple alternate universes in the same series.",
"American Football" : "Centers around the sport of American football.",
"Amnesia" : "Prominently features a character(s) with memory loss.",
"Anachronism" : "Prominently features elements that are out of place in the historical period the work takes place in, particularly modern elements in a historical setting.",
"Anal Sex" : "Features sexual penetration of the anal cavity.",
"Animals" : "Prominently features animal characters in a leading role.",
"Anti-Hero" : "Features a protagonist who lacks conventional heroic attributes and may be considered a borderline villain.",
"Anthology" : "A collection of separate works collated into a single release.",
"Archery" : "Centers around the sport of archery, or prominently features the use of archery in combat.",
"Ashikoki" : "Footjob; features stimulation of genitalia by feet.",
"Assassins" : "Centers around characters who murder people as a profession.",
"Athletics" : "Centers around sporting events that involve competitive running, jumping, throwing, or walking.",
"Augmented Reality" : "Prominently features events with augmented reality as the main setting.",
"Aviation" : "Regarding the flying or operation of aircraft.",
"Badminton" : "Centers around the sport of badminton.",
"Band" : "Main cast is a group of musicians.",
"Bar" : "Partly or completely set in a bar.",
"Baseball" : "Centers around the sport of baseball.",
"Basketball" : "Centers around the sport of basketball.",
"Battle Royale" : "Centers around a fierce group competition, often violent and with only one winner.",
"Biographical" : "Based on true stories of real persons living or dead.",
"Bisexual" : "Features a character who is romantically and/or sexually attracted to people of more than one sex and/or gender.",
"Blackmail" : "Features a character blackmailing another into performing sexual acts.",
"Body Swapping" : "Centers around individuals swapping bodies with one another.",
"Bondage" : "Features BDSM, with or without the use of accessories.",
"Boxing" : "Centers around the sport of boxing.",
"Boys' Love" : "Prominently features romance between two males, not inherently sexual.",
"Bullying" : "Prominently features the use of force for intimidation, often in a school setting.",
"Calligraphy" : "Centers around the art of calligraphy.",
"Card Battle" : "Centers around individuals competing in card games.",
"Cars" : "Centers around the use of automotive vehicles.",
"CGI" : "Prominently features scenes created with computer-generated imagery.",
"Chibi" : "Features \"super deformed\" character designs with smaller, rounder proportions and a cute look.",
"Chuunibyou" : "Prominently features a character with \"Middle School 2nd Year Syndrome\", who either acts like a know-it-all adult or falsely believes they have special powers.",
"Circus" : "Prominently features a circus.", 
"Classic Literature" : "Adapted from a work of classic world literature.",
"College" : "Partly or completely set in a college or university.",
"Coming of Age" : "Centers around a character's transition from childhood to adulthood.",
"Conspiracy" : "Contains one or more factions controlling or attempting to control the world from the shadows.",
"Cosplay" : "Features dressing up as a different character or profession.",
"Crossdressing" : "Prominently features a character dressing up as the opposite sex.",
"Crossover" : "Centers around the placement of two or more otherwise discrete fictional characters, settings, or universes into the context of a single story.",
"Cultivation" : "Features characters using training, often martial arts-related, and other special methods to cultivate life force and gain strength or immortality.",
"Cunnilingus" : "Features oral sex performed on female genitalia.",
"Cute Girls Doing Cute Things" : "Centers around, well, cute girls doing cute things.",
"Cyberpunk" : "Set in a future of advanced technological and scientific achievements that have resulted in social disorder.",
"Cycling" : "Centers around the sport of cycling.",
"Dancing" : "Centers around the art of dance.",
"Dark Skin" : "Features dark-skinned characters in a sexual context.",
"Deflowering" : "There is already a \"Virgin\" tag",
"Delinquents" : "Features characters with a notorious image and attitude, sometimes referred to as \"yankees\".",
"Demons" : "Prominently features malevolent otherworldly creatures.",
"Development" : "Centers around characters developing or programming a piece of technology, software, gaming, etc.",
"Dragons" : "Prominently features mythical reptiles which generally have wings and can breathe fire.",
"Drawing" : "Centers around the art of drawing, including manga and doujinshi.",
"Drugs" : "Prominently features the usage of drugs such as opioids, stimulants, hallucinogens etc.",
"Dystopian" : "Partly or completely set in a society characterized by poverty, squalor or oppression",
"Economics" : "Centers around the field of economics.",
"Educational" : "Primary aim is to educate the audience.",
"Ensemble Cast" : "Features a large cast of characters with (almost) equal screen time and importance to the plot.",
"Environmental" : "concern with the state of the natural world and how humans interact with it.",
"Episodic" : "Features story arcs that are loosely tied or lack an overarching plot.",
"Ero Guro" : "Japanese literary and artistic movement originating in the 1930's. Work have a focus on grotesque eroticism, sexual corruption, and decadence.",
"Espionage" : "Prominently features characters infiltrating an organization in order to steal sensitive information.",
"Facial" : "Features sexual ejaculation onto an individual's face.",
"Fairy Tale" : "This work tells a fairy tale, centers around fairy tales, or is based on a classic fairy tale.",
"Family Life" : "Centers around the activities of a family unit.",
"Fashion" : "Centers around the fashion industry.",
"Fellatio" : "Features oral sex performed on male genitalia.",
"Female Protagonist" : "Main character is female.",
"Fishing" : "Centers around the sport of fishing.",
"Fitness" : "Centers around exercise with the aim of improving physical health.",
"Flash" : "Created using Flash animation techniques.",
"Flat Chest" : "Features a female character with smaller-than-average breasts.",
"Food" : "Centers around cooking or food appraisal.",
"Football" : "Centers around the sport of football (known in the USA as \"soccer\").",
"Foreign" : "Partly or completely set in a country outside of Japan.",
"Fugitive" : "Prominently features a character evading capture by an individual or organization.",
"Full CGI" : "Almost entirely created with computer-generated imagery.",
"Full Colour" : "Fully coloured or drawn in colour.",
"Futanari" : "Features female characters with male genitalia.",
"Gambling" : "Centers around the act of gambling.",
"Gangs" : "Centers around gang organizations.",
"Gender Bending" : "Prominently features a character who dresses and behaves in a way characteristic of the opposite sex, or has been transformed into a person of the opposite sex.",
"Gender Neutral" : "Prominently features agender characters.",
"Ghost" : "Prominently features a character who is a ghost.",
"Go" : "Centered around the game of Go.",
"Gods" : "Prominently features a character of divine or religious nature.",
"Gore" : "Prominently features graphic bloodshed and violence.",
"Guns" : "Prominently features the use of guns in combat.",
"Gyaru" : "Prominently features a female character who has a distinct American-emulated fashion style, such as tanned skin, bleached hair, and excessive makeup. Also known as gal.",
"Harem" : "Main cast features one male character plus several female characters who are romantically interested in him.",
"Henshin" : "Prominently features character or costume transformations which often grant special abilities.",
"Hikikomori" : "Prominently features a character who withdraws from social life, often seeking extreme isolation.",
"Historical" : "Partly or completely set during a real period of world history.",
"Human Pet" : "Features characters in a master-slave relationship where one is the \"owner\" and the other is a \"pet.\"",
"Ice Skating" : "Centers around the sport of ice skating.",
"Idol" : "Centers around the life and activities of an idol.",
"Incest" : "Features sexual relations between characters who are related by blood.",
"Irrumatio" : "Oral rape; features a character thrusting their genitalia into the mouth of another character.",
"Isekai" : "Features characters being transported into an alternate world setting and having to adapt to their new surroundings.",
"Iyashikei" : "Primary aim is to heal the audience through serene depictions of characters' daily lives.",
"Josei" : "Target demographic is adult females.",
"Kaiju" : "Prominently features giant monsters.",
"Karuta" : "Centers around the game of karuta.",
"Kemonomimi" : "Prominently features humanoid characters with animal ears.",
"Kids" : "Target demographic is young children.",
"Lacrosse" : "A team game played with a ball and lacrosse sticks.",
"Large Breasts" : "Features a character with larger-than-average breasts.",
"LGBTQ Issues" : "Addresses themes of LGBTQ experiences and identity; such as characters questioning their sexuality or gender identity, coming out to friends and family, and dealing with prejudice.",
"Lost Civilisation" : "Featuring a civilisation with few ruins or records that exist in present day knowledge.",
"Love Triangle" : "Centered around romantic feelings between more than two people. Includes all love polygons.",
"Mafia" : "Centered around Italian organised crime syndicates.",
"Magic" : "Prominently features magical elements or the use of magic.",
"Mahjong" : "Centered around the game of mahjong.",
"Maids" : "Prominently features a character who is a maid.",
"Male Protagonist" : "Main character is male.",
"Martial Arts" : "Centers around the use of traditional hand-to-hand combat.",
"Masturbation" : "Features erotic stimulation of one's own genitalia or other erogenous regions.",
"Memory Manipulation" : "Prominently features a character(s) who has had their memories altered.",
"Meta" : "Features fourth wall-breaking references to itself or genre tropes.",
"Miko" : "Prominently features a character who is a shrine maiden.",
"MILF" : "Features sexual intercourse with older women.",
"Military" : "Centered around the life and activities of military personnel.",
"Monster Girl" : "Prominently features a female character who is part-monster.",
"Mopeds" : "Prominently features mopeds.",
"Motorcycles" : "Prominently features the use of motorcycles.",
"Musical" : "Features a performance that combines songs, spoken dialogue, acting, and dance.",
"Mythology" : "Prominently features mythological elements, especially those from religious or cultural tradition.",
"Nakadashi" : "Creampie; features sexual ejaculation inside of a character.",
"Nekomimi" : "Humanoid characters with cat-like features such as cat ears and a tail.",
"Netorare" : "NTR; features a character with a partner shown being intimate with someone else.",
"Netorase" : "Features characters in a romantic relationship who agree to be sexually intimate with others.",
"Netori" : "Features a character shown being intimate with the partner of another character. The opposite of netorare.",
"Ninja" : "Prominently features Japanese warriors traditionally trained in espionage, sabotage and assasination.",
"No Dialogue" : "This work contains no dialogue.",
"Noir" : "Stylized as a cynical crime drama with low-key visuals.",
"Nudity" : "Features a character wearing no clothing or exposing intimate body parts.",
"Otaku Culture" : "Centers around the culture of a fanatical fan-base.",
"Outdoor" : "Centers around hiking, camping or other outdoor activities.",
"Paizuri" : "Features the stimulation of male genitalia by breasts.",
"Parody" : "Features deliberate exaggeration of popular tropes or a particular genre to comedic effect.",
"Philosophy" : "Relating or devoted to the study of the fundamental nature of knowledge, reality, and existence.",
"Photography" : "Centers around the use of cameras to capture photos.",
"Pirates" : "Prominently features sea-faring adventurers branded as criminals by the law.",
"Poker" : "Centers around the game of poker or its variations.",
"Police" : "Centers around the life and activities of law enforcement officers.",
"Politics" : "Centers around politics, politicians, or government activities.",
"Post-Apocalyptic" : "Partly or completely set in a world or civilization after a global disaster.",
"POV" : "Point of View; features sexual scenes shown from the perspective of the series protagonist.",
"Pregnant" : "Features pregnant female characters in a sexual context.",
"Primarily Adult Cast" : "Main cast is mostly composed of characters above a high school age.",
"Primarily Child Cast" : "Main cast is mostly composed of characters below a high school age.",
"Primarily Female Cast" : "Main cast is mostly composed of female characters.",
"Primarily Male Cast" : "Main cast is mostly composed of male characters.",
"Prostitution" : "Features characters who are paid for sexual favors.",
"Public Sex" : "Features sexual acts performed in public settings.",
"Puppetry" : "Animation style involving the manipulation of puppets to act out scenes.",
"Rakugo" : "Rakugo is the traditional Japanese performance art of comic storytelling.",
"Rape" : "Features non-consensual sexual penetration.",
"Real Robot" : "Prominently features mechanical designs loosely influenced by real-world robotics.",
"Rehabilitation" : "Prominently features the recovery of a character who became incapable of social life or work.",
"Reincarnation" : "Features a character being born again after death, typically as another person or in another world.",
"Revenge" : "Prominently features a character who aims to exact punishment in a resentful or vindictive manner.",
"Reverse Harem" : "Main cast features one female character plus several male characters who are romantically interested in her.",
"Robots" : "Prominently features humanoid machines.",
"Rugby" : "Centers around the sport of rugby.",
"Rural" : "Partly or completely set in the countryside.",
"Samurai" : "Prominently features warriors of medieval Japanese nobility bound by a code of honor.",
"Satire" : "Prominently features the use of comedy or ridicule to expose and criticise social phenomena.",
"Scat" : "Lots of feces.",
"School" : "Partly or completely set in a primary or secondary educational institution.",
"School Club" : "Partly or completely set in a school club scene.",
"Seinen" : "Target demographic is adult males.",
"Sex Toys" : "Features objects that are designed to stimulate sexual pleasure.",
"Ships" : "Prominently features the use of sea-based transportation vessels.",
"Shogi" : "Centers around the game of shogi.",
"Shoujo" : "Target demographic is teenage and young adult females.",
"Shoujo Ai" : "Prominently features romance between two females.",
"Shounen" : "Target demographic is teenage and young adult males.",
"Shounen Ai" : "Prominently features romance between two males.",
"Skeleton" : "Prominently features skeleton(s) as a character.",
"Slapstick" : "Prominently features comedy based on deliberately clumsy actions or embarrassing events.",
"Slavery" : "Prominently features slaves, slavery, or slave trade.",
"Space" : "Partly or completely set in outer space.",
"Space Opera" : "Centers around space warfare, advanced technology, chivalric romance and adventure.",
"Steampunk" : "Prominently features technology and designs inspired by 19th-century industrial steam-powered machinery.",
"Stop Motion" : "Animation style characterized by physical objects being moved incrementally between frames to create the illusion of movement.",
"Sumata" : "Pussyjob; features the stimulation of male genitalia by the thighs and labia majora of a female character.",
"Super Power" : "Prominently features characters with special abilities that allow them to do what would normally be physically or logically impossible.",
"Super Robot" : "Prominently features large robots often piloted by hot-blooded protagonists.",
"Superhero" : "Prominently features super-powered humans who aim to serve the greater good.",
"Surreal Comedy" : "Prominently features comedic moments that defy casual reasoning, resulting in illogical events.",
"Survival" : "Centers around the struggle to live in spite of extreme obstacles.",
"Swimming" : "Centers around the sport of swimming.",
"Swordplay" : "Prominently features the use of swords in combat.",
"Table Tennis" : "Centers around the sport of table tennis (also known as \"ping pong\").",
"Tanks" : "Prominently features the use of tanks or other armoured vehicles.",
"Teacher" : "Protagonist is an educator, usually in a school setting.",
"Tekoki" : "Handjob; features the stimulation of genitalia by another's hands.",
"Tennis" : "Centers around the sport of tennis.",
"Tentacles" : "Features the long appendages most commonly associated with octopuses or squid, often sexually penetrating a character.",
"Terrorism" : "Centers around the activities of a terrorist or terrorist organization.",
"Threesome" : "Features sexual acts between three people.",
"Time Manipulation" : "Prominently features time-traveling or other time-warping phenomena.",
"Time Skip" : "Features a gap in time used to advance the story.",
"Tragedy" : "Centers around tragic events and unhappy endings.",
"Trains" : "Prominently features trains.",
"Triads" : "Centered around Chinese organised crime syndicates.",
"Tsundere" : "Prominently features a character who acts cold and hostile in order to mask warmer emotions.",
"Twins" : "Prominently features two siblings that were born at one birth.",
"Urban Fantasy" : "Set in a world similar to the real world, but with the existence of magic or other supernatural elements.",
"Urination" : "Features one character urinating on another. Also know as a \"golden shower.\"",
"Vampire" : "Prominently features a character who is a vampire.",
"Video Games" : "Centers around characters playing video games.",
"Virgin" : "Features a character who has never had sexual relations (until now).",
"Virtual World" : "Partly or completely set in the world inside a video game.",
"Volleyball" : "Centers around the sport of volleyball.",
"Voyeur" : "Features a character who enjoys seeing the sex acts or sex organs of others.",
"War" : "Partly or completely set during wartime.",
"Witch" : "Prominently features a character who is a witch.",
"Work" : "Centers around the activities of a certain occupation.",
"Wrestling" : "Centers around the sport of wrestling.",
"Writing" : "Centers around the profession of writing books or novels.",
"Wuxia" : "Chinese fiction concerning the adventures of martial artists in Ancient China.",
"Yakuza" : "Centered around Japanese organised crime syndicates.",
"Yandere" : "Prominently features a character who is obsessively in love with another, to the point of acting deranged or violent.",
"Yaoi" : "Features sexual intercourse between two males.",
"Youkai" : "Prominently features supernatural creatures from Japanese folklore.",
"Yuri" : "Prominently features romance between two females, not inherently sexual. Also known as Girls' Love.",
"Zombie" : "Prominently features reanimated corpses which often prey on live humans and turn them into zombies."

};

var userRecsList = {
"16":[{"n":"Dunkan85","s":[{"id":10460,"n":"Kimi to Boku."}]}],"19":[{"n":"hoh","s":[{"id":1483,"n":"Master Keaton"}]}],"158":[{"n":"Dunkan85","s":[{"id":101573,"n":"Yagate Kimi ni Naru"}]}],"210":[{"n":"hoh","s":[{"id":1293,"n":"Urusei Yatsura"}]},{"n":"hoh","s":[{"id":691,"n":"Yawara!"}]}],"227":[{"n":"hoh","s":[{"id":974,"n":"Dead Leaves"}]}],"245":[{"n":"hoh","s":[{"id":268,"n":"Golden Boy"}]}],"267":[{"n":"Erwin","s":[{"id":889,"n":"Black Lagoon"},{"id":1519,"n":"Black Lagoon: The Second Barrage"},{"id":14719,"n":"JoJo no Kimyou na Bouken"},{"id":20474,"n":"JoJo no Kimyou na Bouken: Stardust Crusaders"},{"id":20773,"n":"Gangsta."},{"id":20799,"n":"JoJo no Kimyou na Bouken: Stardust Crusaders - Egypt-hen"},{"id":21450,"n":"JoJo no Kimyou na Bouken: Diamond wa Kudakenai"},{"id":100388,"n":"BANANA FISH"},{"id":102883,"n":"JoJo no Kimyou na Bouken: Ougon no Kaze"}]}],"268":[{"n":"hoh","s":[{"id":245,"n":"Great Teacher Onizuka"}]}],"283":[{"n":"hoh","s":[{"id":2225,"n":"Alps no Shoujo Heidi"}]}],"302":[{"n":"hoh","s":[{"id":513,"n":"Tenkuu no Shiro Laputa"},{"id":1251,"n":"Fushigi no Umi no Nadia"}]}],"437":[{"n":"hoh","s":[{"id":759,"n":"Tokyo Godfathers"},{"id":1033,"n":"Sennen Joyuu"},{"id":1943,"n":"Paprika"}]}],"440":[{"n":"hoh","s":[{"id":10721,"n":"Mawaru Penguindrum"},{"id":20827,"n":"Yuri Kuma Arashi"}]}],"469":[{"n":"Dunkan85","s":[{"id":21033,"n":"Jitsu wa Watashi wa"}]}],"486":[{"n":"Dunkan85","s":[{"id":21823,"n":"ACCA: 13-ku Kansatsu-ka"}]}],"513":[{"n":"hoh","s":[{"id":302,"n":"Mirai Shounen Conan"},{"id":1251,"n":"Fushigi no Umi no Nadia"}]}],"543":[{"n":"shuurei","s":[{"id":885,"n":"Tenshi no Tamago"}]}],"578":[{"n":"hoh","s":[{"id":2753,"n":"Ushiro no Shoumen Daare"}]}],"604":[{"n":"hoh","s":[{"id":2044,"n":"Mahou no Tenshi Creamy Mami"}]}],"665":[{"n":"hoh","s":[{"id":20474,"n":"JoJo no Kimyou na Bouken: Stardust Crusaders"}]}],"666":[{"n":"hoh","s":[{"id":20799,"n":"JoJo no Kimyou na Bouken: Stardust Crusaders - Egypt-hen"}]},{"n":"hoh","s":[{"id":967,"n":"Hokuto no Ken"}]}],"691":[{"n":"hoh","s":[{"id":210,"n":"Ranma ½"}]}],"759":[{"n":"hoh","s":[{"id":437,"n":"Perfect Blue"},{"id":1033,"n":"Sennen Joyuu"},{"id":1943,"n":"Paprika"}]}],"785":[{"n":"hoh","s":[{"id":2050,"n":"Honoo no Tenkousei"}]}],"885":[{"n":"shuurei","s":[{"id":543,"n":"Vampire Hunter D: Bloodlust"}]},{"n":"hoh","s":[{"id":1921,"n":"Urusei Yatsura Movie 2: Beautiful Dreamer"}]}],"889":[{"n":"Erwin","s":[{"id":267,"n":"Gungrave"},{"id":1519,"n":"Black Lagoon: The Second Barrage"},{"id":14719,"n":"JoJo no Kimyou na Bouken"},{"id":20474,"n":"JoJo no Kimyou na Bouken: Stardust Crusaders"},{"id":20773,"n":"Gangsta."},{"id":20799,"n":"JoJo no Kimyou na Bouken: Stardust Crusaders - Egypt-hen"},{"id":21450,"n":"JoJo no Kimyou na Bouken: Diamond wa Kudakenai"},{"id":100388,"n":"BANANA FISH"},{"id":102883,"n":"JoJo no Kimyou na Bouken: Ougon no Kaze"}]}],"967":[{"n":"hoh","s":[{"id":666,"n":"JoJo no Kimyou na Bouken"}]}],"974":[{"n":"hoh","s":[{"id":227,"n":"FLCL"}]},{"n":"hoh","s":[{"id":6675,"n":"Redline"}]}],"1033":[{"n":"hoh","s":[{"id":437,"n":"Perfect Blue"},{"id":759,"n":"Tokyo Godfathers"},{"id":1943,"n":"Paprika"}]}],"1065":[{"n":"hoh","s":[{"id":2231,"n":"Miyuki"}]}],"1089":[{"n":"hoh","s":[{"id":1935,"n":"Megazone 23"}]}],"1251":[{"n":"hoh","s":[{"id":302,"n":"Mirai Shounen Conan"},{"id":513,"n":"Tenkuu no Shiro Laputa"}]}],"1293":[{"n":"hoh","s":[{"id":210,"n":"Ranma ½"}]}],"1462":[{"n":"hoh","s":[{"id":1951,"n":"Neo Tokyo"}]}],"1483":[{"n":"hoh","s":[{"id":19,"n":"Monster"}]}],"1519":[{"n":"Erwin","s":[{"id":267,"n":"Gungrave"},{"id":889,"n":"Black Lagoon"},{"id":14719,"n":"JoJo no Kimyou na Bouken"},{"id":20474,"n":"JoJo no Kimyou na Bouken: Stardust Crusaders"},{"id":20773,"n":"Gangsta."},{"id":20799,"n":"JoJo no Kimyou na Bouken: Stardust Crusaders - Egypt-hen"},{"id":21450,"n":"JoJo no Kimyou na Bouken: Diamond wa Kudakenai"},{"id":100388,"n":"BANANA FISH"},{"id":102883,"n":"JoJo no Kimyou na Bouken: Ougon no Kaze"}]}],"1637":[{"n":"hoh","s":[{"id":2621,"n":"Natsu e no Tobira"}]}],"1689":[{"n":"hoh","s":[{"id":21519,"n":"Kimi no Na wa."}]}],"1921":[{"n":"hoh","s":[{"id":885,"n":"Tenshi no Tamago"}]}],"1935":[{"n":"hoh","s":[{"id":1089,"n":"Choujikuu Yousai Macross: Ai Oboete Imasu ka"}]}],"1943":[{"n":"hoh","s":[{"id":437,"n":"Perfect Blue"},{"id":759,"n":"Tokyo Godfathers"},{"id":1033,"n":"Sennen Joyuu"}]}],"1951":[{"n":"hoh","s":[{"id":1462,"n":"Memories"}]}],"1961":[{"n":"hoh","s":[{"id":2199,"n":"Chirin no Suzu"}]}],"2001":[{"n":"hoh","s":[{"id":18679,"n":"Kill la Kill"}]}],"2044":[{"n":"hoh","s":[{"id":604,"n":"Mahou no Stage Fancy Lala"}]}],"2050":[{"n":"hoh","s":[{"id":785,"n":"Otaku no Video"}]}],"2199":[{"n":"hoh","s":[{"id":1961,"n":"Arashi no Yoru ni"}]}],"2225":[{"n":"hoh","s":[{"id":283,"n":"Akage no Anne"}]}],"2231":[{"n":"hoh","s":[{"id":1065,"n":"Touch"}]}],"2621":[{"n":"hoh","s":[{"id":1637,"n":"Kaze to Ki no Uta Sanctus: Sei Naru Kana"}]}],"2694":[{"n":"hoh","s":[{"id":9996,"n":"Hyouge Mono"}]}],"2753":[{"n":"hoh","s":[{"id":578,"n":"Hotaru no Haka"}]}],"2755":[{"n":"hoh","s":[{"id":3038,"n":"Senya Ichiya Monogatari"},{"id":3220,"n":"Kanashimi no Belladonna"}]}],"3002":[{"n":"Dunkan85","s":[{"id":98314,"n":"Kakegurui"}]}],"3038":[{"n":"hoh","s":[{"id":2755,"n":"Cleopatra"},{"id":3220,"n":"Kanashimi no Belladonna"}]}],"3220":[{"n":"hoh","s":[{"id":2755,"n":"Cleopatra"},{"id":3038,"n":"Senya Ichiya Monogatari"}]}],"4081":[{"n":"Dunkan85","s":[{"id":21643,"n":"Fukigen na Mononokean"},{"id":103002,"n":"Right Places: Sono Toki, Boku no Irubeki Basho"}]}],"5081":[{"n":"RJBScarletRain","s":[{"id":101291,"n":"Seishun Buta Yarou wa Bunny Girl-senpai no Yume wo Minai"}]}],"6347":[{"n":"Dunkan85","s":[{"id":20031,"n":"D-Frag!"}]}],"6574":[{"n":"Dunkan85","s":[{"id":98503,"n":"Gakuen Babysitters"}]}],"6675":[{"n":"hoh","s":[{"id":974,"n":"Dead Leaves"}]}],"6880":[{"n":"Dunkan85","s":[{"id":10620,"n":"Mirai Nikki (TV)"}]}],"6956":[{"n":"Dunkan85","s":[{"id":97994,"n":"Blend S"}]}],"8425":[{"n":"Dunkan85","s":[{"id":8915,"n":"Dantalian no Shoka"}]}],"8426":[{"n":"Dunkan85","s":[{"id":20527,"n":"Isshuukan Friends."}]}],"8769":[{"n":"Dunkan85","s":[{"id":21685,"n":"Eromanga Sensei"},{"id":100382,"n":"Ore ga Suki nano wa Imouto dakedo Imouto ja Nai"}]}],"8915":[{"n":"Dunkan85","s":[{"id":8425,"n":"Gosick"}]}],"9996":[{"n":"hoh","s":[{"id":2694,"n":"Hidamari no Ki"}]}],"10162":[{"n":"Dunkan85","s":[{"id":21631,"n":"Udon no Kuni no Kiniro Kemari"},{"id":21659,"n":"Amaama to Inazuma"}]},{"n":"hoh","s":[{"id":12355,"n":"Ookami Kodomo no Ame to Yuki"}]}],"10460":[{"n":"Dunkan85","s":[{"id":16,"n":"Hachimitsu to Clover"}]}],"10572":[{"n":"Dunkan85","s":[{"id":97683,"n":"Tenshi no 3P!"}]}],"10620":[{"n":"Dunkan85","s":[{"id":6880,"n":"Deadman Wonderland"}]}],"10721":[{"n":"hoh","s":[{"id":440,"n":"Shoujo Kakumei Utena"},{"id":20827,"n":"Yuri Kuma Arashi"}]}],"11785":[{"n":"Dunkan85","s":[{"id":16157,"n":"Choujigen Game Neptune: The Animation"}]}],"12189":[{"n":"Dunkan85","s":[{"id":21213,"n":"Haruchika: Haruta to Chika wa Seishun Suru"}]}],"12355":[{"n":"hoh","s":[{"id":10162,"n":"Usagi Drop"}]}],"12431":[{"n":"shuurei","s":[{"id":99426,"n":"Sora yori mo Tooi Basho"}]}],"12679":[{"n":"Dunkan85","s":[{"id":20972,"n":"Shouwa Genroku Rakugo Shinjuu"}]}],"14669":[{"n":"Dunkan85","s":[{"id":14741,"n":"Chuunibyou demo Koi ga Shitai!"}]}],"14719":[{"n":"Erwin","s":[{"id":267,"n":"Gungrave"},{"id":889,"n":"Black Lagoon"},{"id":1519,"n":"Black Lagoon: The Second Barrage"},{"id":20474,"n":"JoJo no Kimyou na Bouken: Stardust Crusaders"},{"id":20773,"n":"Gangsta."},{"id":20799,"n":"JoJo no Kimyou na Bouken: Stardust Crusaders - Egypt-hen"},{"id":21450,"n":"JoJo no Kimyou na Bouken: Diamond wa Kudakenai"},{"id":100388,"n":"BANANA FISH"},{"id":102883,"n":"JoJo no Kimyou na Bouken: Ougon no Kaze"}]},{"n":"Dunkan85","s":[{"id":99699,"n":"Golden Kamui"}]}],"14741":[{"n":"Dunkan85","s":[{"id":14669,"n":"Aura: Maryuuinkouga Saigo no Tatakai"}]}],"14813":[{"n":"Dunkan85","s":[{"id":101291,"n":"Seishun Buta Yarou wa Bunny Girl-senpai no Yume wo Minai"}]}],"15061":[{"n":"ScarletFairy","s":[{"id":20742,"n":"PriPara"}]}],"16157":[{"n":"Dunkan85","s":[{"id":11785,"n":"Haiyore! Nyaruko-san"}]}],"17549":[{"n":"Dunkan85","s":[{"id":21284,"n":"Flying Witch"}]}],"18679":[{"n":"hoh","s":[{"id":2001,"n":"Tengen Toppa Gurren Lagann"}]}],"20031":[{"n":"Dunkan85","s":[{"id":6347,"n":"Baka to Test to Shoukanjuu"}]}],"20474":[{"n":"Erwin","s":[{"id":267,"n":"Gungrave"},{"id":889,"n":"Black Lagoon"},{"id":1519,"n":"Black Lagoon: The Second Barrage"},{"id":14719,"n":"JoJo no Kimyou na Bouken"},{"id":20773,"n":"Gangsta."},{"id":20799,"n":"JoJo no Kimyou na Bouken: Stardust Crusaders - Egypt-hen"},{"id":21450,"n":"JoJo no Kimyou na Bouken: Diamond wa Kudakenai"},{"id":100388,"n":"BANANA FISH"},{"id":102883,"n":"JoJo no Kimyou na Bouken: Ougon no Kaze"}]},{"n":"hoh","s":[{"id":665,"n":"JoJo no Kimyou na Bouken (2000)"}]}],"20517":[{"n":"Dunkan85","s":[{"id":97994,"n":"Blend S"}]}],"20527":[{"n":"Dunkan85","s":[{"id":8426,"n":"Hourou Musuko"}]},{"n":"Dunkan85","s":[{"id":21495,"n":"Tanaka-kun wa Itsumo Kedaruge"}]}],"20742":[{"n":"ScarletFairy","s":[{"id":15061,"n":"Aikatsu!"}]}],"20773":[{"n":"Erwin","s":[{"id":267,"n":"Gungrave"},{"id":889,"n":"Black Lagoon"},{"id":1519,"n":"Black Lagoon: The Second Barrage"},{"id":14719,"n":"JoJo no Kimyou na Bouken"},{"id":20474,"n":"JoJo no Kimyou na Bouken: Stardust Crusaders"},{"id":20799,"n":"JoJo no Kimyou na Bouken: Stardust Crusaders - Egypt-hen"},{"id":21450,"n":"JoJo no Kimyou na Bouken: Diamond wa Kudakenai"},{"id":100388,"n":"BANANA FISH"},{"id":102883,"n":"JoJo no Kimyou na Bouken: Ougon no Kaze"}]}],"20799":[{"n":"Erwin","s":[{"id":267,"n":"Gungrave"},{"id":889,"n":"Black Lagoon"},{"id":1519,"n":"Black Lagoon: The Second Barrage"},{"id":14719,"n":"JoJo no Kimyou na Bouken"},{"id":20474,"n":"JoJo no Kimyou na Bouken: Stardust Crusaders"},{"id":20773,"n":"Gangsta."},{"id":21450,"n":"JoJo no Kimyou na Bouken: Diamond wa Kudakenai"},{"id":100388,"n":"BANANA FISH"},{"id":102883,"n":"JoJo no Kimyou na Bouken: Ougon no Kaze"}]},{"n":"hoh","s":[{"id":666,"n":"JoJo no Kimyou na Bouken"}]}],"20827":[{"n":"hoh","s":[{"id":440,"n":"Shoujo Kakumei Utena"},{"id":10721,"n":"Mawaru Penguindrum"}]}],"20912":[{"n":"Dunkan85","s":[{"id":21213,"n":"Haruchika: Haruta to Chika wa Seishun Suru"}]}],"20923":[{"n":"Dunkan85","s":[{"id":21204,"n":"Wakako-zake"},{"id":97617,"n":"Isekai Shokudou"}]}],"20972":[{"n":"Dunkan85","s":[{"id":12679,"n":"Joshiraku"}]}],"21033":[{"n":"Dunkan85","s":[{"id":469,"n":"Karin"}]}],"21108":[{"n":"Dunkan85","s":[{"id":21315,"n":"Pan de Peace!"}]}],"21171":[{"n":"Dunkan85","s":[{"id":21197,"n":"Bakuon!!"}]}],"21197":[{"n":"Dunkan85","s":[{"id":21171,"n":"Long Riders!"}]}],"21204":[{"n":"Dunkan85","s":[{"id":20923,"n":"Shokugeki no Souma"},{"id":97617,"n":"Isekai Shokudou"}]}],"21213":[{"n":"Dunkan85","s":[{"id":12189,"n":"Hyouka"}]},{"n":"Dunkan85","s":[{"id":20912,"n":"Hibike! Euphonium"}]}],"21284":[{"n":"Dunkan85","s":[{"id":17549,"n":"Non Non Biyori"}]}],"21291":[{"n":"Dunkan85","s":[{"id":98505,"n":"Princess Principal"},{"id":101014,"n":"RELEASE THE SPYCE"}]}],"21315":[{"n":"Dunkan85","s":[{"id":21108,"n":"Wakaba＊Girl"}]}],"21450":[{"n":"Erwin","s":[{"id":267,"n":"Gungrave"},{"id":889,"n":"Black Lagoon"},{"id":1519,"n":"Black Lagoon: The Second Barrage"},{"id":14719,"n":"JoJo no Kimyou na Bouken"},{"id":20474,"n":"JoJo no Kimyou na Bouken: Stardust Crusaders"},{"id":20773,"n":"Gangsta."},{"id":20799,"n":"JoJo no Kimyou na Bouken: Stardust Crusaders - Egypt-hen"},{"id":100388,"n":"BANANA FISH"},{"id":102883,"n":"JoJo no Kimyou na Bouken: Ougon no Kaze"}]}],"21455":[{"n":"Dunkan85","s":[{"id":21597,"n":"Stella no Mahou"}]}],"21495":[{"n":"Dunkan85","s":[{"id":20527,"n":"Isshuukan Friends."}]}],"21519":[{"n":"hoh","s":[{"id":1689,"n":"Byousoku 5 Centimeter"}]}],"21597":[{"n":"Dunkan85","s":[{"id":21455,"n":"New Game!"}]}],"21613":[{"n":"Dunkan85","s":[{"id":21838,"n":"Shuumatsu no Izetta"}]}],"21631":[{"n":"Dunkan85","s":[{"id":10162,"n":"Usagi Drop"},{"id":21659,"n":"Amaama to Inazuma"}]}],"21643":[{"n":"Dunkan85","s":[{"id":4081,"n":"Natsume Yuujinchou"},{"id":103002,"n":"Right Places: Sono Toki, Boku no Irubeki Basho"}]}],"21659":[{"n":"Dunkan85","s":[{"id":10162,"n":"Usagi Drop"},{"id":21631,"n":"Udon no Kuni no Kiniro Kemari"}]}],"21685":[{"n":"Dunkan85","s":[{"id":8769,"n":"Ore no Imouto ga Konna ni Kawaii Wake ga Nai"},{"id":100382,"n":"Ore ga Suki nano wa Imouto dakedo Imouto ja Nai"}]}],"21731":[{"n":"Dunkan85","s":[{"id":99720,"n":"Märchen Mädchen"},{"id":100382,"n":"Ore ga Suki nano wa Imouto dakedo Imouto ja Nai"}]}],"21823":[{"n":"Dunkan85","s":[{"id":486,"n":"Kino no Tabi: The Beautiful World"}]}],"21835":[{"n":"Dunkan85","s":[{"id":102875,"n":"Himote House"}]}],"21838":[{"n":"Dunkan85","s":[{"id":21613,"n":"Youjo Senki"}]}],"97592":[{"n":"Dunkan85","s":[{"id":101371,"n":"Tonari no Kyuuketsuki-san"}]}],"97617":[{"n":"Dunkan85","s":[{"id":20923,"n":"Shokugeki no Souma"},{"id":21204,"n":"Wakako-zake"}]}],"97683":[{"n":"Dunkan85","s":[{"id":10572,"n":"Ro-Kyu-Bu!"}]}],"97994":[{"n":"Dunkan85","s":[{"id":6956,"n":"Working!!"}]},{"n":"Dunkan85","s":[{"id":20517,"n":"Gochuumon wa Usagi Desu ka?"}]}],"98314":[{"n":"Dunkan85","s":[{"id":3002,"n":"Gyakkyou Burai Kaiji: Ultimate Survivor"}]}],"98503":[{"n":"Dunkan85","s":[{"id":6574,"n":"Hanamaru Youchien"}]}],"98505":[{"n":"Dunkan85","s":[{"id":21291,"n":"Joker Game"},{"id":101014,"n":"RELEASE THE SPYCE"}]}],"98820":[{"n":"Dunkan85","s":[{"id":98977,"n":"Itsudatte Bokura no Koi wa 10cm datta"}]}],"98977":[{"n":"Dunkan85","s":[{"id":98820,"n":"Just Because!"}]}],"99426":[{"n":"shuurei","s":[{"id":12431,"n":"Uchuu Kyoudai"}]}],"99699":[{"n":"Dunkan85","s":[{"id":14719,"n":"JoJo no Kimyou na Bouken"}]}],"99720":[{"n":"Dunkan85","s":[{"id":21731,"n":"Hand Shakers"},{"id":100382,"n":"Ore ga Suki nano wa Imouto dakedo Imouto ja Nai"}]}],"100382":[{"n":"Dunkan85","s":[{"id":8769,"n":"Ore no Imouto ga Konna ni Kawaii Wake ga Nai"},{"id":21685,"n":"Eromanga Sensei"}]},{"n":"Dunkan85","s":[{"id":21731,"n":"Hand Shakers"},{"id":99720,"n":"Märchen Mädchen"}]}],"100388":[{"n":"Erwin","s":[{"id":267,"n":"Gungrave"},{"id":889,"n":"Black Lagoon"},{"id":1519,"n":"Black Lagoon: The Second Barrage"},{"id":14719,"n":"JoJo no Kimyou na Bouken"},{"id":20474,"n":"JoJo no Kimyou na Bouken: Stardust Crusaders"},{"id":20773,"n":"Gangsta."},{"id":20799,"n":"JoJo no Kimyou na Bouken: Stardust Crusaders - Egypt-hen"},{"id":21450,"n":"JoJo no Kimyou na Bouken: Diamond wa Kudakenai"},{"id":102883,"n":"JoJo no Kimyou na Bouken: Ougon no Kaze"}]}],"100665":[{"n":"Dunkan85","s":[{"id":100715,"n":"Mahou Shoujo Ore"}]}],"100715":[{"n":"Dunkan85","s":[{"id":100665,"n":"Back Street Girls: Gokudolls"}]}],"101014":[{"n":"Dunkan85","s":[{"id":21291,"n":"Joker Game"},{"id":98505,"n":"Princess Principal"}]}],"101291":[{"n":"RJBScarletRain","s":[{"id":5081,"n":"Bakemonogatari"}]},{"n":"Dunkan85","s":[{"id":14813,"n":"Yahari Ore no Seishun Love Comedy wa Machigatteiru."}]}],"101371":[{"n":"Dunkan85","s":[{"id":97592,"n":"Demi-chan wa Kataritai"}]}],"101573":[{"n":"Dunkan85","s":[{"id":158,"n":"Maria-sama ga Miteru"}]}],"102875":[{"n":"Dunkan85","s":[{"id":21835,"n":"Mahou Shoujo? Naria☆Girls"}]}],"102883":[{"n":"Erwin","s":[{"id":267,"n":"Gungrave"},{"id":889,"n":"Black Lagoon"},{"id":1519,"n":"Black Lagoon: The Second Barrage"},{"id":14719,"n":"JoJo no Kimyou na Bouken"},{"id":20474,"n":"JoJo no Kimyou na Bouken: Stardust Crusaders"},{"id":20773,"n":"Gangsta."},{"id":20799,"n":"JoJo no Kimyou na Bouken: Stardust Crusaders - Egypt-hen"},{"id":21450,"n":"JoJo no Kimyou na Bouken: Diamond wa Kudakenai"},{"id":100388,"n":"BANANA FISH"}]}],"103002":[{"n":"Dunkan85","s":[{"id":4081,"n":"Natsume Yuujinchou"},{"id":21643,"n":"Fukigen na Mononokean"}]}]
,"99748":[{n:"midnightbreeze",s:[{n:"Yuru Camp△",id:98444}]}],"98444":[{n:"midnightbreeze",s:[{n:"Hakumei to Mikochi",id:99748}]}],"658":[{n:"Erwin",s:[{n:"Gyakkyou Burai Kaiji: Ultimate Survivor",id:3002}]}],"3002":[{n:"Erwin",s:[{n:"Touhai Densetsu Akagi: Yami ni Maiorita Tensai",id:658}]}],"30642":[{n:"Erwin",s:[{n:"Berserk",id:30002}]}],"30002":[{n:"Erwin",s:[{n:"Vinland Saga",id:30642}]}],"15061":[{n:"ScarletFairy",s:[{n:"PriPara",id:20742}]}],"20742":[{n:"ScarletFairy",s:[{n:"Aikatsu!",id:15061}]}],"15037":[{n:"ScarletFairy",s:[{n:"Another",id:11111}]}],"11111":[{n:"ScarletFairy",s:[{n:"Corpse Party: Tortured Souls - Bougyakusareta Tamashii no Jukyou",id:15037}]}],"6547":[{n:"ScarletFairy",s:[{n:"Charlotte",id:20997}]}],"20997":[{n:"ScarletFairy",s:[{n:"Angel Beats!",id:6547}]}],"5680":[{n:"ScarletFairy",s:[{n:"Sora yori mo Tooi Basho",id:99426}]}],"99426":[{n:"ScarletFairy",s:[{n:"K-On!",id:5680}]}],"98658":[{n:"ScarletFairy",s:[{n:"Mahou Shoujo Madoka★Magica",id:9756}]}],"9756":[{n:"ScarletFairy",s:[{n:"Shoujo☆Kageki Revue Starlight",id:98658}]}],"97592":[{n:"ScarletFairy",s:[{n:"Centaur no Nayami",id:98519}]}],"98519":[{n:"ScarletFairy",s:[{n:"Demi-chan wa Kataritai",id:97592}]}],"21858":[{n:"ScarletFairy",s:[{n:"Mary to Majo no Hana",id:97981}]}],"97981":[{n:"ScarletFairy",s:[{n:"Little Witch Academia (TV)",id:21858}]}],"8129":[{n:"ScarletFairy",s:[{n:"Kimi ni Todoke",id:6045}]}],"6045":[{n:"ScarletFairy",s:[{n:"Kuragehime",id:8129}]}],"21685":[{n:"ScarletFairy",s:[{n:"Ore no Imouto ga Konna ni Kawaii Wake ga Nai",id:8769},{n:"Imouto sae Ireba Ii.",id:98596},]}],"98596":[{n:"ScarletFairy",s:[{n:"Ore no Imouto ga Konna ni Kawaii Wake ga Nai",id:8769},{n:"Eromanga Sensei",id:21685},]}],"8769":[{n:"ScarletFairy",s:[{n:"Imouto sae Ireba Ii.",id:98596},{n:"Eromanga Sensei",id:21685},]}],"21787":[{n:"ScarletFairy",s:[{n:"Two Car",id:99672},{n:"Ange Vierge",id:21439}]}],"21439":[{n:"ScarletFairy",s:[{n:"Two Car",id:99672},{n:"Battle Girl High School",id:21787}]}],"99672":[{n:"ScarletFairy",s:[{n:"Ange Vierge",id:21439},{n:"Battle Girl High School",id:21787}]}],"14513":[{n:"ScarletFairy",s:[{n:"Fairy Tail",id:6702},{n:"Nanatsu no Taizai",id:20789}]}],"20789":[{n:"ScarletFairy",s:[{n:"Fairy Tail",id:6702},{n:"Magi: The Labyrinth of Magic",id:14513}]}],"6702":[{n:"ScarletFairy",s:[{n:"Nanatsu no Taizai",id:20789},{n:"Magi: The Labyrinth of Magic",id:14513}]}]};
console.log("Aniscripts " + scriptVersion);
})();