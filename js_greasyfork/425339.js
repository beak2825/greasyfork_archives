// ==UserScript==
// @name         ExportBrowserTeamsMessage
// @namespace    https://fazerog02.dev
// @version      0.1
// @description  teamsのメッセージをjson形式で出力する
// @author       fazerog02
// @match        https://teams.microsoft.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425339/ExportBrowserTeamsMessage.user.js
// @updateURL https://update.greasyfork.org/scripts/425339/ExportBrowserTeamsMessage.meta.js
// ==/UserScript==


function downloadFile(content, type, filename){
    const blob = new Blob([content], {"type" : type})
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.download = filename;
    a.href = url;
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}


function messageParser(message){
    let json = {}

    let profile_icon = message.getElementsByTagName("profile-picture")[0]
    let icon_url = profile_icon.getElementsByTagName("img")[0].src
    json.icon_url = icon_url

    let author = message.getElementsByClassName("ts-msg-name")[0]
    json.author = author.innerText

    let datetime = message.getElementsByClassName("message-datetime")[0]
    json.datetime = datetime.innerText

    let body = message.querySelector('[data-tid="messageBodyContent"]')
    json.body = body.innerText

    return json
}


function messageToJson(message){
    let json = {}

    let start_message = message.getElementsByClassName("conversation-start")[0]
    json = messageParser(start_message)
    json.thread = []

    let replies = message.getElementsByClassName("conversation-reply")
    for(let i = 0; i < replies.length; i++){
        let reply_json = messageParser(replies[i])
        json.thread.push(reply_json)
    }

    return json
}


function exportMessageJson(){
    let export_json = []

    const messages = document.getElementsByClassName("ts-message")
    for(let i = 0; i < messages.length; i++){
        export_json.push(messageToJson(messages[i]))
    }

    return export_json
}


function exportMessageHtml(){
    const export_json = exportMessageJson()

    let style = "<style>.box{margin: 10px; border: 1px solid #737373;} .icon{width: 32px; height: 32px; border-radius: 50%; display: inline-block;} .mute{color: #737373;} .thread{margin-left: 50px;}</style>"
    let messages_html = ""

    for(let i = 0; i < export_json.length; i++){
        let replies_html = ""
        for(let j = 0; j < export_json[i].thread.length; j++){
            replies_html += `<div><div><img src="${export_json[i].thread[j].icon_url}" class="icon"><span>${export_json[i].thread[j].author}　</span><span class="mute">${export_json[i].thread[j].datetime}</span></div><div>${export_json[i].thread[j].body}</div></div>`
        }
        messages_html += `<div class="box"><div><div><img src="${export_json[i].icon_url}" class="icon"><span>${export_json[i].author}　</span><span class="mute">${export_json[i].datetime}</span></div><div>${export_json[i].body}</div></div><div class="thread">${replies_html}</div></div>`
    }

    let export_html = `<html><head><meta charset="utf-8"/>${style}</head><body>${messages_html}</body></html>`
    return export_html
}


function downloadMessageJson(){
    const export_json = exportMessageJson()
    downloadFile(JSON.stringify(export_json), "application/json", "messages.json")
}


function downloadMessageHtml(){
    const export_html = exportMessageHtml()
    downloadFile(export_html, "text/html", "messages.html")
}


(function() {
    const export_json_button = document.createElement("button")
    export_json_button.innerText = "EXPORT JSON"
    export_json_button.style.position = "fixed"
    export_json_button.style.bottom = "50px"
    export_json_button.style.left = "100px"
    export_json_button.style.width = "100px"
    export_json_button.style.height = "50px"
    export_json_button.onclick = downloadMessageJson;
    document.body.appendChild(export_json_button)

    const export_html_button = document.createElement("button")
    export_html_button.innerText = "EXPORT HTML"
    export_html_button.style.position = "fixed"
    export_html_button.style.bottom = "50px"
    export_html_button.style.left = "200px"
    export_html_button.style.width = "100px"
    export_html_button.style.height = "50px"
    export_html_button.onclick = downloadMessageHtml;
    document.body.appendChild(export_html_button)
})();