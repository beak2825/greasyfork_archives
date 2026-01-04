// ==UserScript==
// @name         Highlight deleted posts
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Highlight deleted posts in the activity log
// @author       Alex Kwon
// @match        https://www.facebook.com/*
// @grant        none
// @run-at       document-idle

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442683/Highlight%20deleted%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/442683/Highlight%20deleted%20posts.meta.js
// ==/UserScript==



function main() {
    console.log('main');


let currentPage = document.querySelector(".lhclo0ds > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1) > h2:nth-child(1)").textContent
if (!currentPage.includes('Activity log')) {
  return
} else if (currentPage === null) {
    console.log('null')
    setTimeout( function(){
 main()
}, 2000 );
    console.log('after main()')
    return
}


let backgroundHighlight = '.addCSS { background-color: greenyellow;}'
let modalCSS = '.modal{float:right;display:none;position:relative;z-index:1;padding-top:10px;left:0;top:0;width:50%;height:50%;overflow:auto;background-color:rgb(0,0,0);background-color:rgba(0,0,0,0.4)}.modal-content{background-color:#fefefe;margin:auto;padding:2px;border:1px solid #888;width:80%}.close{color:#aaaaaa;float:right;font-size:28px;font-weight:bold}.close:focus'


function addGlobalStyle(css) {
    [...document.querySelectorAll('span.knj5qynh')]
    .filter(txt => txt.innerHTML.includes('approved a pending post'))
        .forEach(txt => txt.classList.add('addCSS'));

    let head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
        return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

// list of profile URLs and names
function getProfiles() {
    let myArray = [];
    [...document.querySelectorAll('span.knj5qynh')]
    .filter(txt => txt.innerHTML.includes('approved a pending post'))
        .forEach(txt => {
             let profileURL = txt.querySelector('a:nth-child(2)') ? txt.querySelector('a:nth-child(2)').href  : 'blank'
            //let profileURL = txt.querySelector('a:nth-child(2)').href 

            console.log(profileURL)
            let name = txt.querySelector('a:nth-child(2)') ? txt.querySelector('a:nth-child(2)').textContent : 'deactivated'

            let profileID = profileURL.replace('https://www.facebook.com/groups/1986308354764659/user/', '').slice(0,-1)
            let postHistory = 'https://www.facebook.com/groups/1986308354764659/admin_activities/?activity_subject=' + profileID
            let link = "<a  target='_blank' href=" + postHistory + ">" + name + "</a>"
            myArray.push(link)



        });

    return myArray
}

// button creation code
function createButtons() {

    let button = document.createElement("Button");
    let activityLogText = document.querySelector("div.gderk4og.f7vcsfb0.fjf4s8hc.k4urcfbm")
    button.innerHTML = "List";
    button.id = "deletedPosts"
    button.style = "position:sticky;z-index:99999;padding:5px;";
    activityLogText.appendChild(button);

    let modalDiv = document.createElement('div')
    modalDiv.id = 'myModal'
    modalDiv.classList.add('modal')
    modalDiv.innerHTML = '<div class=modal-content><span class=close>×</span><p id="modalText">placeholder</div>'
    activityLogText.appendChild(modalDiv);
    let closeModalButton = document.getElementsByClassName("close")[0];

    let modal = document.getElementById('myModal');
    let modalButton = document.getElementById('deletedPosts');

    modalButton.onclick = function() {
        modal.style.display = "block";
    }

    closeModalButton.onclick = function() {
        modal.style.display = "none";
    }


}

// loop
let intervalId = setInterval(function() {
    try {
    addGlobalStyle(backgroundHighlight);
    } catch(e) {
        alert(e)
    }

    if (!document.getElementById('myModal')) {
        addGlobalStyle(modalCSS);
        createButtons();
    }
    let listHTML = '<ol>'
    getProfiles().forEach( item => {
      listHTML += '<li>' + item + '</li>'

      }
    )
    listHTML += '</ol>'
    document.getElementById('modalText').innerHTML = listHTML


}, 2000);

}



setTimeout( function(){
 main()
}, 3000 );



//})();