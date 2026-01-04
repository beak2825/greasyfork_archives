// ==UserScript==
// @name        New script
// @namespace   Violentmonkey Scripts
// @match       https://gel*/*
// @grant       GM_addStyle
// @version     2.0
// @author      -
// @license MIT
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @description piss
// @downloadURL https://update.greasyfork.org/scripts/540266/New%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/540266/New%20script.meta.js
// ==/UserScript==


function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function delete_cookie( name ) {
  if( getCookie( name ) ) {
    document.cookie = name + "=" +
      ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
}

if (localStorage.getItem('blacklistBackup')) {
  setCookie('tag_blacklist', localStorage.getItem('blacklistBackup'), 10)
}

$("#myTopnav").append("<a>Show All <input id='showAllCheck' type='checkbox'/></a>");

const initValue = getCookie("fringeBenefits")

console.log(initValue)

if (initValue == "yup"){
  console.log("Setting value to true")
  $("#showAllCheck").prop('checked', true);
}

$("#showAllCheck").change(function() {
    if(this.checked) {
        //Do stuff
        setCookie("fringeBenefits", 'yup', 10);
        window.location.reload()
    } else {
        delete_cookie("fringeBenefits");
        window.location.reload()
    }
});


const urlParams = new URLSearchParams(window.location.search);

GM_addStyle(`

#bypassButton{
	font-weight: bold;
	width: 105px;
	padding: 7px 15px;
	border: 0px;
	color: #ffffff;
	background: #0773fb;
  margin-left: 3px;
}


.thumbnail-preview > a > img {
  border-radius: 0.5rem;
}

.webm {

  position: relative;
}

.thumbnail-preview > a {
  position: relative;
}

.thumbnail-preview > a:has(> img.webm)::after{
  background: blue;
  content: "WebM";
  font-size: xx-small;
  padding: 0.10rem 0.25rem;
  position: absolute;
  bottom: 5px;
  right: 5px;
  border-radius: 9999px;
}

#searchParent {
  width: calc(100% - 287px);
  margin-right: 20px;
  position: relative;
}

#tags-search {
  width: 100% !important;

}

.searchArea > div > form {
  display: flex;
}

#sort-button {
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translate(0, -50%);
  border: none;
  background-color: transparent;
  cursor: pointer;
  border-radius: 5px;
  padding: 4px;
}

#sort-button:hover {
  background-color: #202020;
}

`);





if (urlParams.get('page') == 'post') {
  $("#tags-search").css("width", "calc(100% - 287px)")
  $( "<button id='bypassButton' onclick=''>BS</button>" ).insertAfter( "input.searchList" );

  const searchTag = $('input#tags-search');
  $( " <div id='searchParent'></div>" ).insertBefore("input.searchList");
  $('#searchParent').append(searchTag);

  $('#searchParent').append($(`<button onclick='' id="sort-button" type='button'>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-down10-icon lucide-arrow-down-1-0"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="M17 10V4h-2"/><path d="M15 10h4"/><rect x="15" y="14" width="4" height="6" ry="2"/></svg>
  </button>`));


  $("#bypassButton").click(function(e) {
    e.preventDefault()
    localStorage.setItem("blacklistBackup", getCookie('tag_blacklist'));
    delete_cookie('tag_blacklist');
    $(".searchList").parent().submit()
  });

  $("#sort-button").click(async function(e) {
    if (searchTag.val().includes("sort:score")) return;

    searchTag.val(searchTag.val() + " sort:score ")
  });
}


$(".thumbnail-preview > a > img").each((i, el)=>{
  const r = el.title.search(/lo.i /)
  if (r != -1) {
    console.log(el.title.substring(r));
    el.style.border = 'solid red 3px'
  }
})




