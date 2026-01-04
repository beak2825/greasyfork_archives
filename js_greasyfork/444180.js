// ==UserScript==
// @name         AnilistLiker
// @namespace    https://github.com/Makhloufbel/AnilistLiker
// @homepage     https://github.com/Makhloufbel
// @version      0.3.9a
// @description  Allows users to quickly like posts on Anilist just by one click ,this version allow you to blacklist  or whitelist any user for ease of use
// @author       Makhloufbel
// @match        https://anilist.co/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anilist.co

// @downloadURL https://update.greasyfork.org/scripts/444180/AnilistLiker.user.js
// @updateURL https://update.greasyfork.org/scripts/444180/AnilistLiker.meta.js
// ==/UserScript==

(function() {

    'use strict';
    const svgns = 'http://www.w3.org/2000/svg';
    const BLACKLIST_BUTTON_CLASSNAMES = ['btn', 'btn-primary', 'mmd1'];
    /******** CSS of buttons divs uls ... ect ********/
    const css = [
        `
.btn-primary {
  color: rgb(var(--color-text));
  background-color: rgb(var(--color-foreground-blue));
}

.btn {
  display: inline-block;
  width: max-content;
  font-weight: bold;
  line-height: 1.5;
  color: rgb(var(--color-text));
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  padding: 0.275rem 0.5rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
}

.btn.mmd1 {
  box-sizing: border-box;
  font-size: 1.2rem;
  border: none;
  opacity: 0;
  position: absolute;
  top: .7em;
  left: 58%;
}

.btn:hover {
  background-color: rgb(var(--color-foreground-blue-dark));
  color: rgb(var(--color-blue));
  transition: .02s;
}

div.details:hover > .mmd1 {
  opacity: 1!important;
  transition: inherit;
  transform-origin: center;
}

.POPUP {
  padding: 5px;
  margin: 5px;
  background: #eee;
  border: 1px solid #aaa;
}

.mackDisplayBox {
  position: fixed;
  top: 80px;
  left: 200px;
  z-index: 999;
  min-width: 300px;
  min-height: 200px;
  padding: 20px;
  background-color: rgb(var(--color-foreground));
  border: solid 1px;
  border-radius: 4px;
  box-shadow: black 2px 2px 20px;
  overflow: hidden;
  filter: brightness(110%);
}

.mackDisplayBox .scrollableContent {
  overflow: auto;
  height: 100%;
  scrollbar-width: thin;
  margin-top: 5px;
  padding: 30px;
  padding-top: 35px;
  padding-left: 15px;
}

.mackDisplayBoxClose {
  position: absolute;
  right: 15px;
  top: 15px;
  cursor: pointer;
  background-color: red;
  border: solid;
  border-width: 1px;
  border-radius: 2px;
  color: white;
  border-color: rgb(var(--color-text));
  filter: drop-shadow(0 0 0.2rem crimson);
  z-index: 20;
}

.mackDisplayBoxClose:hover {
  filter: drop-shadow(0 0 0.75rem crimson);
}

.mackNewChapter .mackDisplayBoxClose {
  display: none;
  top: 7px;
}

.mackNewChapter:hover .mackDisplayBoxClose {
  display: inline;
}

.mackDisplayBoxTitle {
  position: absolute;
  top: 5px;
  left: 5px;
  padding: 1rem;
  font-weight: bold;
  font-size: 1.2em;
  background-color: inherit;
  z-index: 9999;
}

.mackResizePearl {
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 20px;
  height: 20px;
  border: solid;
  border-radius: 10px;
  background: rgb(var(--color-foreground));
  cursor: se-resize;
}

.mackGuideHeading,
          .mackGuideHeading:visited {
  color: rgb(var(--color-blue));
}

* {
  scrollbar-color: rgb(var(--color-blue)) rgba(0, 0, 0, 0);
  scrollbar-width: thin;
}

::-webkit-scrollbar {
  width: 4px;
  height: 8px;
}

::-webkit-scrollbar-button {
  display: none;
}

::-webkit-scrollbar-track {
  background-color: #1110;
  width: 0px;
}

::-webkit-scrollbar-track-piece {
  display: none;
}

::-webkit-scrollbar-thumb {
  background-color: rgb(var(--color-blue));
}

#myContainer {
  position: fixed;
  left: 5px;
  align-items: center;
  height: 7rem;
  width: 100px;
}

.mmd2 {
  border: 2px solid rgb(var(--color-foreground-blue-dark));
  width: 9em;
  height: 2.125em;
  cursor: pointer;
  display: inline-block;
  font-weight: bold;
  font-size: inherit;
  padding: 0 5px;
  line-height: 1.2em;
  text-align: center;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.mmd2.btntop {
  border-radius: 10px 10px 0 0;
}

.mmd2.btnbottom {
  border-radius: 0 0 10px 10px;
}

.mmd2:active {
  box-shadow: rgb(var(--color-foreground-blue)) 2px 2px 0 0;
  transform: translate(2px, 2px);
}

.mmd2.btnbottom[disabled] {
  border: 1px solid #999;
  background-color: darkgrey;
  color: #fff;
  cursor: not-allowed;
}

.scrollableContent >p {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 2em;
  margin: 0;
  font-weight: bold;
  font-size: inherit;
  padding: 10px 50px;
}

.scrollableContent >p {
  font-size: 1.8rem;
}

.scrollableContent p:nth-child(2n) {
  background-color: rgba(var(--color-foreground-blue),.0);
}

.scrollableContent p:nth-child(2n-1) {
  background-color: rgba(var(--color-foreground-blue-dark),.2);
}

p >.mackDisplayBoxClose {
  display: inline-block;
  right: 30px;
  font-weight: normal;
  background-color: red;
  transform: translateY(30%);
}

.mackDisplayBox .scrollableContent {
  padding: 30px 0 0 0;
  margin: 0 -20px 0 -20px;
}

div.scrollableContent {
  counter-reset: section1;
}

p.mackNewChapter::before {
  position: absolute;
  left: 1.4em;
  counter-increment: section1;
  content: counter(section1) " - ";
  transform: translateX(-5%);
}

.profile-btn {
  display: flex;
  transform: translate(0px, -40%);
  place-content: flex-start center;
  background: rgba(var(--color-blue),.8);
  border-radius: 4px;
  color: rgb(var(--color-white));
  cursor: pointer;
  display: inline-block;
  margin-left: 10px;
  margin-right: 10px;
  padding: 10px 12px;
  text-align: center;
  transition: .4s;
  border: none;
}

.el-message.el-message--error {
  display: none !important;
}
	`,
    ];
    /*********** verify if logged in**********/
    let userObject;
    let whoAmI = '';
    let whoAmIid = 0;
    try {
        userObject = JSON.parse(localStorage.getItem('auth'));
    } catch (err) {
        console.warn('could not get userObject');
    }
    if (userObject) {
        whoAmI = userObject.name;
        whoAmIid = userObject.id;
    } else {
        try {
            whoAmI = document
                .querySelector(".nav .links .link[href^='/user/']")
                .href.match(/\/user\/(.*)\//)[1]; //looks at the navbar
        } catch (e) {
            console.warn('could not get username');
            alert('Please login before to use this script!!!');
            return;
        }
    }
    /********* add CSS ********/
    document.head.insertAdjacentHTML('beforeend', '<style>' + css + '</style>');

    let username = String('https://anilist.co/user/' + whoAmI + '/');
    //document.querySelector(".nav .links .link[href^='/user/']").href;

    /********* functions to store data *********/
    const setObj = function (key, obj) {
        localStorage.setItem(key, JSON.stringify(obj));
    };
    const getObj = function (key) {
        return JSON.parse(localStorage.getItem(key));
    };

    if (getObj('blacklist') === null || getObj('blacklist').length == 0) {
        setObj('blacklist', [username]);
    }
    /****** the Main function *******/
    (function main() {
        let div = create(
            'div',
            '#myContainer',
            false,
            document.querySelector('#nav > div.wrap')
        );
        let blacklistbtn = create(
            'button',
            ['btn', 'btn-primary', 'mmd2', 'btntop'],
            'Show blacklist',
            div
        );
        var likeAllbtn = create(
            'button',
            ['btn', 'btn-primary', 'mmd2', 'btnbottom'],
            'Like all posts',
            div
        );
        blacklistbtn.onclick = () => {
            POPUP();
        };

        likeAllbtn.onclick = () => {
            likeBtnHandler();
        };
    })();
    /******** Utilities functions *********/
    function homePageHandler() {
        let divs = document.querySelectorAll('div.details:not(.ided)');
        for (let e of divs) {
            createbtn(e);
        }
    }
    function createbtn(e) {
        if (e.closest('.wrap').getElementsByClassName('name')[0].href ===username) return;

        addAttribute(e);
        let btn = create(
            'button',
            ['btn', 'btn-primary', 'mmd1'],
            String(e.getAttribute('data-status')) === 'blacklisted'
                ? 'whitelist'
                : 'blacklist',
            false,
            'position : absolute;'
        );
        btn.onclick = () => {
            switch (String(e.getAttribute('data-status'))) {
                case 'whitelisted':
                    blacklistbtn(e);
                    btn.remove();
                    addAttribute(e);
                    createbtn(e);
                    break;
                case 'blacklisted':
                    whitelistbtn(e);
                    btn.remove();
                    addAttribute(e);
                    createbtn(e);
                    break;
            }
            deleteAllBtn();
        };
        e.children[0].after(btn);
        e.classList.add('ided');
    }
    function userProfileHandler() {
        let div = document.querySelector('.name-wrapper');
        createProfilebtn(div);
    }
    function createProfilebtn(e) {
        if (String('https://anilist.co/user/' + e.innerText + '/') === username) return;
        addAttributeToProfile(e);
        let btn = create(
            'button',
            ['nav-btn', 'profile-btn'],
            String(e.getAttribute('data-status')) === 'blacklisted'
                ? 'whitelist'
                : 'blacklist',
            false,
            false
        );
        btn.onclick = () => {
            switch (String(e.getAttribute('data-status'))) {
                case 'whitelisted':
                    blacklistbtn(e);
                    break;
                case 'blacklisted':
                    whitelistbtn(e);
                    break;
                default:
                    console.log('Error');
                    break;
            }
            deleteAllBtn();
            userProfileHandler(e);
        };
        e.after(btn);
    }

    function addAttributeToProfile(b) {
        let blacklist = getObj('blacklist');
        if (String('https://anilist.co/user/' + b.innerText + '/') == username) return;

        if (blacklist.includes(String('https://anilist.co/user/' + b.innerText + '/')))
        {
            b.setAttribute('data-status', 'blacklisted');
        } else {
            b.setAttribute('data-status', 'whitelisted');
        }
    }
    function deleteAllBtn() {
        document
            .querySelectorAll('button.btn.btn-primary.mmd1')
            .forEach((e) => {
                e.remove();
            });
        document.querySelectorAll('div.details').forEach((e) => {
            e.classList.remove('ided');
        });
        document.querySelectorAll('.profile-btn').forEach((e) => {
            e.remove();
        });
    }

    function POPUP() {
        let blacklist = getObj('blacklist');
        let box = createDisplayBox(
            'width:600px;height:500px;top:100px;left:220px;',
            'Blacklisted'
        );
        for (let e of blacklist) {
            let listing = create(
                'p',
                'mackNewChapter',
                false,
                false,
                'position:relative;'
            );
            create('a', ['link', 'newTab'], getName(e), listing).href =
                '/user/' + getName(e) + '/';
            let listClose = create(
                'span',
                'mackDisplayBoxClose',
                '✕',
                listing,
                'top:0 !important;'
            );
            listClose.onclick = function () {
                whitelistbtn(listing);
                listing.remove();
                blacklist.filter((item) => item !== e);
                deleteAllBtn();
                userProfileHandler();
            };
            box.appendChild(listing);
        }
    }

    function addAttribute(b) {
        let blacklist = getObj('blacklist');
        if (b.firstChild.href == username) return;

        if (blacklist.includes(b.firstChild.href)) {
            b.setAttribute('data-status', 'blacklisted');
        } else {
            b.setAttribute('data-status', 'whitelisted');
        }
    }
    /********* Create a DOMElement *********/
    function create(HTMLtag, classes, text, appendLocation, cssText) {
        let element = document.createElement(HTMLtag);
        if (Array.isArray(classes)) {
            element.classList.add(...classes);
            if (classes.includes('newTab')) {
                element.setAttribute('target', '_blank');
            }
        } else if (classes) {
            if (classes[0] === '#') {
                element.id = classes.substring(1);
            } else {
                element.classList.add(classes);
                if (classes === 'newTab') {
                    element.setAttribute('target', '_blank');
                }
            }
        }
        if (text || text === 0) {
            element.innerText = text;
        }
        if (appendLocation && appendLocation.appendChild) {
            appendLocation.appendChild(element);
        }
        if (cssText) {
            element.style.cssText = cssText;
        }
        return element;
    }
    /********* Create hovering box *********/
    function createDisplayBox(cssProperties, windowTitle) {
        let displayBox = create(
            'div',
            'mackDisplayBox',
            false,
            document.querySelector('#app') ||
                document.querySelector('.termsFeed') ||
                document.body,
            cssProperties
        );
        if (windowTitle) {
            create('span', 'mackDisplayBoxTitle', windowTitle, displayBox);
        }
        let mousePosition;
        let offset = [0, 0];
        let isDown = false;
        let isDownResize = false;
        let displayBoxClose = create(
            'span',
            'mackDisplayBoxClose',
            '✕',
            displayBox
        );
        displayBoxClose.onclick = function () {
            displayBox.remove();
        };
        let resizePearl = create('span', 'mackResizePearl', false, displayBox);
        displayBox.addEventListener(
            'mousedown',
            function (e) {
                if (!['P', 'PRE'].includes(e.target.tagName)) {
                    //don't annoy people trying to copy-paste
                    isDown = true;
                    offset = [
                        displayBox.offsetLeft - e.clientX,
                        displayBox.offsetTop - e.clientY,
                    ];
                }
            },
            true
        );
        resizePearl.addEventListener(
            'mousedown',
            function (event) {
                event.stopPropagation();
                event.preventDefault();
                isDownResize = true;
                offset = [displayBox.offsetLeft, displayBox.offsetTop];
            },
            true
        );
        document.addEventListener(
            'mouseup',
            function () {
                isDown = false;
                isDownResize = false;
            },
            true
        );
        document.addEventListener(
            'mousemove',
            function (event) {
                if (isDownResize) {
                    mousePosition = {
                        x: event.clientX,
                        y: event.clientY,
                    };
                    displayBox.style.width =
                        mousePosition.x - offset[0] + 5 + 'px';
                    displayBox.style.height =
                        mousePosition.y - offset[1] + 5 + 'px';
                    return;
                }
                if (isDown) {
                    mousePosition = {
                        x: event.clientX,
                        y: event.clientY,
                    };
                    displayBox.style.left = mousePosition.x + offset[0] + 'px';
                    displayBox.style.top = mousePosition.y + offset[1] + 'px';
                }
            },
            true
        );
        let innerSpace = create('div', 'scrollableContent', false, displayBox);
        return innerSpace;
    }

    function getName(link) {
        if (link === null) return;
        return link.split('/')[4];
    }

    function whitelistbtn(b) {
        let blacklist = getObj('blacklist');
        var value = String(
            'https://anilist.co/user/' + b.children[0].innerText + '/'
        );
        var val = b.children[0].innerText;

        if (blacklist.includes(value)) {
            blacklist.splice(blacklist.indexOf(value), 1);
            blacklist = setObj('blacklist', blacklist);
            //alert(val +' has been whitelisted !');
            //console.log(blacklist);
        } else {
            //alert(val +' is not blacklisted !');
        }
    }
    function blacklistbtn(b) {
        let blacklist = getObj('blacklist');
        var value = (value = String(
            'https://anilist.co/user/' + b.children[0].innerText + '/'
        ));
        var val = b.children[0].innerText;

        if (!blacklist.includes(value)) {
            blacklist.push(value);
            setObj('blacklist', blacklist);
            // alert(val +' has been blacklisted !');
            //console.log(blacklist);
        } else {
            // alert(val +' is already blacklisted !');
        }
    }

    function eventFire(el, etype) {

        if (el.fireEvent) {
            el.fireEvent('on' + etype);
        } else {
            var evObj = document.createEvent('Events');
            evObj.initEvent(etype, true, false);
            el.dispatchEvent(evObj);
        }

    }


    let isAlerted = false;
    function countdownHandler(){
        const Alerted = document.querySelectorAll('.el-message.el-message--error')
        if(Alerted.length == 0){
            isAlerted = false;
            return;
        }
        isAlerted = true;
        console.log("please wait 1 min!");

        const countDownDate = (new Date().getTime())+60*1000;
        const count = document.querySelector(".btn.btn-primary.mmd2.btnbottom");
        count.disabled = true;
        const Int = setInterval(function() {

            let now = new Date().getTime();
            let distance = countDownDate - now;

            let seconds = Math.floor((distance % (1000 * 60)) / 1000);
            if(seconds>9){
                count.innerHTML = "wait 00 : " + seconds ;
            }else{
                count.innerHTML = "wait 00 : 0" + seconds ;
            }
            if (distance < 0) {
                clearInterval(Int);
                count.innerHTML = "Like all posts";
                count.disabled = false;
                isAlerted = false;
            }
        }, 1000);


    }

    function likeBtnHandler() {
        let likes = document.querySelectorAll('.button:not(.liked)');
        let notBlacklisted = blacklistedarray(likes);
        //console.log(likes, notBlacklisted);
        for (let e of notBlacklisted) {
                eventFire(e, 'click');
        }
    }

    function blacklistedarray(array) {
        let blacklist = getObj('blacklist');
        if (!blacklist.includes(username)) {
            blacklist.push(username);
        }
        let notBlacklisted = new Array();
        let isBlacklisted;
        for (let c of array) {
            isBlacklisted = false;
            for (let e of blacklist) {
                if (
                    c.closest('.wrap').getElementsByClassName('name')[0].href ==
                    e
                ) {
                    isBlacklisted = true;
                    break;
                }
            }
            if (isBlacklisted == false) {
                notBlacklisted.push(c);
            }
        }
        return notBlacklisted;
    }
    function profileBtnHandler() {
        let isAdded = document.querySelector('button.nav-btn.profile-btn');
        //console.log([...isAdded].length);
        if (isAdded !== null) return;
        window.onload = userProfileHandler();
    }

    const onMutate = function (mutationsList) {
        if (window.location.href == 'https://anilist.co/home') {homePageHandler() }
        if (window.location.href.match(/(^https?:\/\/)?(www\.)?anilist.co\/user\/\w+/gi)!= null) {profileBtnHandler() }
        if( !isAlerted ) {countdownHandler()}

    };
    const observer = new MutationObserver(onMutate);
    observer.observe(document.body, { childList: true, subtree: true })
})();
