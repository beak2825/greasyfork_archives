// ==UserScript==
// @name         Brick Hill Forum Edits
// @version      1.0
// @description  Makes you able to edit your forum posts!
// @author       Noah Cool Boy
// @match        https://www.brick-hill.com/forum/thread/*
// @namespace https://greasyfork.org/users/725966
// @downloadURL https://update.greasyfork.org/scripts/421642/Brick%20Hill%20Forum%20Edits.user.js
// @updateURL https://update.greasyfork.org/scripts/421642/Brick%20Hill%20Forum%20Edits.meta.js
// ==/UserScript==

let replies = [...document.querySelectorAll(".thread-row")]
let userId = document.querySelector('meta[name="user-data"]').attributes["data-id"].value
for(let x = 0; x < replies.length; x++) {
    let reply = replies[x]
    if(reply.querySelector("a").href.includes(`/${userId}/`)) { // Check if the reply is theirs
        let barLinks = reply.querySelector(".forum-options")
        barLinks.children[barLinks.childElementCount-1].className += " mr4"
        let button = document.createElement("a")
        button.className = "forum-reply"
        button.innerText = "EDIT"
        barLinks.appendChild(button)
        button.onclick = function() {

            let rep = reply.querySelector(".p")
            let replyContent = rep.lastChild

            // NOO YOU CANT JUST USE LINEBREAKS FOR EMTPY LINES IN TEXT
            // Jefemy: haha line breaks go <br><br><br><br>
            let clone = rep.cloneNode(true)
            let text = ""
            if(clone.firstElementChild && clone.firstElementChild.localName == "blockquote") {
                clone.firstElementChild.remove()
                text = clone.innerText
            } else {
                text = clone.innerText
            }

            let button = document.createElement("button")
            button.className = "blue"
            button.onclick = function() {
                let token = document.cookie.match(/bh_edit_token=(.+?);/) && document.cookie.match(/bh_edit_token=(.+?);/)[1]
                if(token) {
                    let req = new XMLHttpRequest()
                    req.open("POST", "https://noah.ovh/bhforum/edits.php", false) // Chrome, I do NOT care if it isn't async
                    let form = new FormData()
                    form.append("token", token)
                    form.append("thread", location.href.match(/\d+/)[0])
                    form.append("page", (location.href.match(/\d+\/(\d+)/) && location.href.match(/\d+\/(\d+)/)[1]) || "1")
                    form.append("post", x)
                    form.append("edit", reply.querySelector("textarea").value)

                    req.send(form)
                    console.log("[BH EDITS] Server replied: "+req.responseText)
                    if(req.responseText.startsWith("Success")) { // Wack
                        setTimeout(()=>{
                            location.reload()
                        }, 1000)
                    } else {
                        alert("An error occured! This is the error: "+req.responseText)
                    }
                } else {
                    let token = prompt("You do not seem to have set your edit token. If you need one, please message noah#8315 (discord) or Noah Cool Boy (brick hill). If you do have one, please input it below!")
                    if(!token || token.length != 32 || !token.match(/^[0-9a-f]+$/)) {
                        alert("Invalid token")
                    } else {
                        document.cookie = `bh_edit_token=${token}; path=/;`
                   }
                }
            }
            button.innerText = "Done"
            rep.innerHTML = `<textarea style="width: 100%; height: ${text.split("\n").length*18 < 200 ? 200 : text.split("\n").length*18}px">${text}</textarea>`
            rep.appendChild(button)

        }
        button.addEventListener("click", ()=>button.remove())
    }
}
let threadId = location.href.match(/\d+/)[0]
let page = (location.href.match(/\d+\/(\d+)/) && location.href.match(/\d+\/(\d+)/)[1]) || "1"
let req = new XMLHttpRequest()
req.open("GET", `https://noah.ovh/bhforum/edits.php?thread=${threadId}&page=${page}`, false) // Sus
req.send()
try {
    let data = JSON.parse(req.responseText)
    data.forEach(v => {
        let reply = replies[parseInt(v.reply)]
        let quote = (reply.querySelector(".p").innerHTML.match(/<blockquote.+?<\/blockquote>/s) && reply.querySelector(".p").innerHTML.match(/<blockquote.+?<\/blockquote>/s)[0]) || ""

        reply.querySelector(".p").innerHTML = quote + v.newText.replace(/\n/g,"<br>") + "<br>(Edited)"
    })
} catch(err) {
    console.log("An error occured for BH Edits! Please dm him this: "+err)
}