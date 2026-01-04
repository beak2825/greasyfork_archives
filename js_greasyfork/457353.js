// ==UserScript==
// @name         IMDb Poll Suggestion Creator
// @namespace    BonaFideBOSS
// @match        https://www.imdb.com/list/*
// @match        https://community-imdb.sprinklr.com/*
// @version      1.0
// @description  A simple JavaScript script to easily post a poll suggestion based on IMDb lists to the IMDb community forum on Sprinklr.
// @author       BonaFideBOSS
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      GNU General Public License v3.0 or later
// @downloadURL https://update.greasyfork.org/scripts/457353/IMDb%20Poll%20Suggestion%20Creator.user.js
// @updateURL https://update.greasyfork.org/scripts/457353/IMDb%20Poll%20Suggestion%20Creator.meta.js
// ==/UserScript==

// ==================================================
// =================== Options ======================
// ==================================================
var media = true
var mediaCount = 5
var footer = false

// ==================================================
// ================ IMDb Functions ==================
// ==================================================
function ps_btn() {
    var btn = '<li><a href="" class="pop-up-menu-list-item-link" id="create-imdbPoll-btn">Create Poll Suggestion</a></li>'
    document.querySelectorAll('.pop-up-menu-list-items')[0].innerHTML += btn
}

function create_ps(e){
    e.preventDefault()
    var url = "https://www.imdb.com" + window.location.pathname
    var title = document.querySelectorAll('.header.list-name')[0].innerHTML
    var description = document.querySelectorAll('.list-description')[0].innerHTML
    var userid = document.querySelectorAll('#list-overview-summary a')[0].href.split("/")[4]
    var username = document.querySelectorAll('#list-overview-summary a')[0].innerHTML

    GM_setValue("url", url)
    GM_setValue("title", title)
    GM_setValue("description", description)
    GM_setValue("userid", userid)
    GM_setValue("username", username)

    var listType = document.querySelectorAll('.desc')[0].innerHTML
    if (listType.includes('titles')) {
        var images = []
        var imgList = Array.from(document.querySelectorAll('.lister-item .lister-item-image img'))
        if (imgList.length < mediaCount) { mediaCount = imgList.length}
        imgList.slice(0,mediaCount).forEach(i => {
            images.push(i.outerHTML)
        })
        GM_setValue('images',images)
    }

    location.href = "https://community-imdb.sprinklr.com/conversations/new"
}

if (window.location.hostname.includes("imdb.com")) {
    ps_btn()
    var createBtn = document.getElementById('create-imdbPoll-btn')
    createBtn.addEventListener('click',create_ps)
}

// ==================================================
// ============== Sprinklr Functions ================
// ==================================================
async function add_details(){
    var url = GM_getValue("url")
    var title = GM_getValue("title")
    var description = GM_getValue("description")
    var userid = GM_getValue("userid")
    var username = GM_getValue("username")
    var userpolls = "https://imdbstats.com/user?id=" + userid

    var footerHTML = ""
    if (footer) {
        footerHTML = '<pre>Track IMDb polls and see statistics and leaderboard: <a target="_blank" href="http://imdbstats.com/">http://imdbstats.com/</a></pre>'+
            '<pre>Follow IMDb Polls: <a target="_blank" href="https://twitter.com/PollBoard">Twitter</a> | <a target="_blank" href="https://www.facebook.com/imdbpolls/">Facebook</a> | <a target="_blank" href="https://www.instagram.com/imdbpolls/">Instagram</a></pre>'
    }

    var images = GM_getValue("images")
    var canvas = ""
    if (media && images) {
        canvas = images.join(" ") + "<br><br>"
    }

    var content = canvas + description +
        '<br><br>' +
        '<b>❒ IMDb List:</b> <a href="'+url+'" target="_blank">'+url+'</a>'+
        '<br><b>❒ IMDb Poll:</b> '+
        '<br><br><br>' +
        '- by <a target="_blank" href="https://www.imdb.com/user/'+userid+'">'+username+'</a> | <a target="_blank" href="'+userpolls+'">My Polls</a>'+
        footerHTML

    document.querySelectorAll('.radio-button-group')[0].querySelectorAll('.radio-button')[2].click()
    document.getElementById('title').value = "Poll Suggestion: " + title
    await delay(1000)
    document.querySelectorAll('.spa.rtePlaceholder')[0].style.display = "none"
    document.querySelectorAll('iframe')[0].contentDocument.getElementById('tinymce').innerHTML = content

    GM_deleteValue("url")
}

if (window.location.hostname.includes("sprinklr.com")) {
    if (window.location.href.includes("conversations/new") && GM_getValue("url")) {
        window.addEventListener("load", () => {
            add_details()
        });
    }
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}