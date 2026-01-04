// ==UserScript==
// @name         Twitter Zen Mode
// @namespace    http://tampermonkey.net/
// @version      2024-12-18
// @description  twitter is back, and better
// @author       SodaCris
// @match        https://x.com/**
// @match        https://twitter.com/**
// @icon         https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/521670/Twitter%20Zen%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/521670/Twitter%20Zen%20Mode.meta.js
// ==/UserScript==



(function() {
    'use strict';
 let mapping = {}
    function get_top_bar() {
        let top_bar = document.querySelectorAll('div[role="tablist"]')[0]
        return top_bar
    }

    function get_ad_elem() {
        let top_bar = get_top_bar()
        for(let i=0; i<2; i++) {
            if(top_bar.childNodes[i].querySelector('a').text == "For you") {
                return top_bar.childNodes[i];
            }
        }
    }

    function get_following_elem() {
        let top_bar = get_top_bar()
        for(let i=0; i<2; i++) {
            if(top_bar.childNodes[i].querySelector('a').text == "Following") {
                return top_bar.childNodes[i];
            }
        }
    }

        document.title = "Twitter"
        setTimeout(()=> {

            // Fix home order
            let top_bar = document.querySelectorAll('div[role="tablist"]')[0]
            console.log(top_bar)
            let following = get_following_elem()
            let ad_for_you = get_ad_elem()
            top_bar.childNodes.forEach(child => top_bar.removeChild(child))
            if(following !== undefined) {
            top_bar.appendChild(following)
            following.querySelector('a')?.click()
        }

            // Remove "my followers"
            if(window.location.href.indexOf("following") != -1) {
                top_bar.remove()
            }


            // Fix Contents

            //// remove AI
  let content = document.evaluate('//*[@id="react-root"]/div/div/div[2]/main/div/div/div/div/div/div[3]/div/div/section/div', document).iterateNext().childNodes[0]

            let have_ad = (elem) => {
                return elem.querySelector('a').href.indexOf('grok') != -1
            }

            let elem = null

            for(let i=0; i<content.childNodes.length; i++ ){
                if(have_ad(content.childNodes[i])) {
                   elem = content.childNodes[i];
                }
            }
            if(elem !== null ) {
                console.log(elem)
                content.removeChild(elem)
            }
        }, 3000);

        // Fix title
        setInterval( ()=> {
            document.title = "Twitter"
            document.querySelector('link[rel="shortcut icon"]').href="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIHZpZXdCb3g9IjAgMCAyNDggMjA0Ij4KICA8cGF0aCBmaWxsPSIjMWQ5YmYwIiBkPSJNMjIxLjk1IDUxLjI5Yy4xNSAyLjE3LjE1IDQuMzQuMTUgNi41MyAwIDY2LjczLTUwLjggMTQzLjY5LTE0My42OSAxNDMuNjl2LS4wNGMtMjcuNDQuMDQtNTQuMzEtNy44Mi03Ny40MS0yMi42NCAzLjk5LjQ4IDggLjcyIDEyLjAyLjczIDIyLjc0LjAyIDQ0LjgzLTcuNjEgNjIuNzItMjEuNjYtMjEuNjEtLjQxLTQwLjU2LTE0LjUtNDcuMTgtMzUuMDcgNy41NyAxLjQ2IDE1LjM3IDEuMTYgMjIuOC0uODctMjMuNTYtNC43Ni00MC41MS0yNS40Ni00MC41MS00OS41di0uNjRjNy4wMiAzLjkxIDE0Ljg4IDYuMDggMjIuOTIgNi4zMkMxMS41OCA2My4zMSA0Ljc0IDMzLjc5IDE4LjE0IDEwLjcxYzI1LjY0IDMxLjU1IDYzLjQ3IDUwLjczIDEwNC4wOCA1Mi43Ni00LjA3LTE3LjU0IDEuNDktMzUuOTIgMTQuNjEtNDguMjUgMjAuMzQtMTkuMTIgNTIuMzMtMTguMTQgNzEuNDUgMi4xOSAxMS4zMS0yLjIzIDIyLjE1LTYuMzggMzIuMDctMTIuMjYtMy43NyAxMS42OS0xMS42NiAyMS42Mi0yMi4yIDI3LjkzIDEwLjAxLTEuMTggMTkuNzktMy44NiAyOS03Ljk1LTYuNzggMTAuMTYtMTUuMzIgMTkuMDEtMjUuMiAyNi4xNnoiLz4KPC9zdmc+"
         ////// Remove following suggestion
             let content = document.querySelectorAll('div > div > article')
                content.forEach((x) => {
                    x.querySelectorAll("button").forEach( (x) => {
                        x.remove();
                    }
                )})
            // remove analytics
            document.querySelectorAll('a[href*="analytics"]').forEach((x) => x.remove())

            // Remove "following" in top scroll bar
            let button = document.querySelector('button[aria-label*="Following"]')
            if(button !== null) { button.remove() }

            // Remove "Who to follow"
            let content2_1 = document.querySelector('div[aria-label*="Timeline"]')

            if (content2_1 !== null) {
                let content2 = content2_1.firstChild.childNodes

            for(let i=0; i<content2.length; i++) {
                if(content2[i].textContent == "Who to follow") {
                    content2[i].style.display="none"
                    continue
                }
                let buttons = content2[i].querySelectorAll("button")

                let have_follows = function() {
                    for(let i=0; i<buttons.length; i++) {
                        if(buttons[i].textContent === "Follow") {
                            return true;
                        }
                    }
                    return false;
                }();

                if(have_follows) {
                    content2[i].style.display = "none";
                }
            }
            }

            // redirect home to following

            if(window.location.href == "https://x.com/home") {
                window.location.assign("https://x.com/[replace for your user name]/following")
            }

            // Remove sidebar
            let sidebar = document.querySelector('div[data-testid="sidebarColumn"]')
            if(sidebar !== null) {sidebar.style.display = "none"}

            // Remove header
            document.querySelector("header").style.display = "none"

            // Fix Content padding
            document.querySelector("main").style.paddingLeft = "20%"
            document.querySelector("main > div").style.width = "100%"

            // hide post comments
            let nodes = document.querySelector('div[aria-label="Timeline: Conversation"]')
            if (nodes !== null ) {nodes = nodes.firstChild.childNodes}
            if(nodes !==null){
                for(let i=2; i<nodes.length; i++ ) {
                    nodes[i].style.display = "none"
                }
            }

            // Fix URL
            let urls = document.querySelectorAll('a[href^="https://t.co"]')

            for(let i=0; i<urls.length; i++) {
                let url = urls[i]
                if(url.textContent.startsWith("http")) {
                    let dest = url.textContent
                   if( url.textContent.endsWith('…')) {
                       dest = url.textContent.slice(0, -1)
                   }
                   let src = url.href
                   mapping[src] = dest
                }
            }
            for(let i=0; i<urls.length; i++) {
                let url = urls[i]
                if(mapping[url.href] !== undefined) {
                    url.href = mapping[url.href]
                } else {
                    // elem.style.backgroundColor = "red"
                    url.textContent = url.href
                }
            }

        }, 1000);
})();