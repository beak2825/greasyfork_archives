// ==UserScript==
// @name         Lolzteam GPT
// @version      0.3.2
// @description  Найдет ответ для вашего вопроса
// @author       vuchaev2015
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @namespace https://greasyfork.org/users/997663
// @downloadURL https://update.greasyfork.org/scripts/466294/Lolzteam%20GPT.user.js
// @updateURL https://update.greasyfork.org/scripts/466294/Lolzteam%20GPT.meta.js
// ==/UserScript==
 
var domain = 'zelenka.guru'
 
let accountMenu = document.getElementById("AccountMenu");
let linksList = accountMenu.querySelector(".blockLinksList");
let buttonId = `ChatGPT`;
 
linksList.insertAdjacentHTML('beforeend', `<li><a href="javascript:void(0)" id="${buttonId}">Спросить у ChatGPT</a></li>`);
 
document.getElementById(buttonId).addEventListener("click", async function (event) {
    event.preventDefault();
    let question = prompt('Введите ваш вопрос: ')
    if (question !== null) {
        console.log(await new ThabAi().get_response(question));
    }
});
 
 
class ThabAi {
    constructor() {
        this.session = {
            headers: {
                "content-type": "application/json",
            },
        };
    }
 
    async get_response(prompt, postElement) {
        let response = await fetch("https://chatbot.theb.ai/api/chat-process", {
            method: "POST",
            headers: this.session.headers,
            body: JSON.stringify({ prompt: prompt, options: {} }),
        });
        console.log(`Запрос с подсказкой "${prompt}" отправлен на сервер`);
        XenForo.alert(`Подсказка: "${prompt}"`, 'Lolzteam GPT: запрос отправлен на сервер')
        if (!response.ok) throw new Error(`[get_response]: network response for prompt "${prompt}" was not ok`);
        let response_lines = await response.text();
        let response_data = "";
        for (let line of response_lines.split("\n")) {
            if (line) {
                let data = JSON.parse(line);
                if ("utterances" in data) {
                    response_data += data["utterances"]
                        .map((utterance) => utterance["text"])
                        .join(" ");
                } else if ("delta" in data) {
                    response_data += data["delta"];
                }
            }
        }
 
        console.log(`[get_response] Запрос для подсказки ${prompt} получен:`, response_data);
        return XenForo.alert(`${response_data}`, `Lolzteam GPT: ответ от сервера получен`)
 
    }
}
 
function createButtonElement(buttonId, messageText) {
    const ChatGPTButton = document.createElement("li");
    const button = document.createElement("a");
    button.setAttribute("href", "javascript:void(0)");
    button.setAttribute("id", buttonId);
    button.textContent = "Отправить запрос ChatGPT";
    button.addEventListener("click", async function (event) {
        event.preventDefault();
        console.log(await new ThabAi().get_response(messageText));
    });
    ChatGPTButton.appendChild(button);
    return ChatGPTButton;
}
 
function checkProfileItems() {
    const profilePostList = document.querySelector('ol#ProfilePostList');
    if (profilePostList) {
        const linksLists = [...profilePostList.querySelectorAll(':not(li[id^="ChatGPTButton-"])')];
 
        linksLists.forEach((linksList) => {
            const links = linksList.querySelectorAll("a");
            links.forEach((link) => {
                if (link.href.startsWith(`https://${domain}/profile-posts/`)) {
                    let postId;
                    let newLink;
                    let postElement;
 
                    if (link.href.includes('profile-posts/comments')) {
                        postId = link.href.split('posts/comments/')[1].split('/')[0];
                        newLink = `profile-post-comment-${postId}`
                        postElement = document.querySelector(`#${newLink}.comment`);
                    } else if (!link.href.includes('profile-posts/comments/')) {
                        postId = link.href.split('profile-posts/')[1].split('/')[0];
                        newLink = `profile-post-${postId}`
                        postElement = document.querySelector(`#${newLink}.messageSimple`);
                    }
 
                    if (postElement && !postElement.hasAttribute("ChatGPTButton")) {
                        postElement.setAttribute("ChatGPTButton", "added");
                        const menus = [...document.querySelectorAll('div.Menu')].filter(menu => [...menu.querySelectorAll('a')].some(link => link.href.includes(`${postId}`)));
                        let author = postElement.querySelector('a.username.poster')
                        let messageText;
 
                        try {
                            messageText = postElement.querySelector("div.messageContent > div > article > blockquote").textContent.trim().replace(/\s{2,}/g, ' ');
                        } catch (error) {
                            messageText = postElement.querySelector(" div > div.commentContent > article > blockquote").textContent.replace(/\s{2,}/g, ' ');
                        }
                        document.createElement("li");
                        let buttonId = `ChatGPTButton-${generateRandomString(10)}`;
                        let currentUrl = author.getAttribute('href')
                        menus[menus.length - 1].querySelector('.secondaryContent').appendChild(createButtonElement(buttonId, messageText));
 
 
                    }
                }
            })
        })
    }
}
 
function generateRandomString(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
 
function checkThreadItems() {
    const linksLists = [...document.querySelectorAll(".secondaryContent.blockLinksList")].filter(
        (list) => !list.querySelector('li[id^="ChatGPTButton-"]')
    );
 
    linksLists.forEach((linksList) => {
        const links = linksList.querySelectorAll("a");
 
        links.forEach((link) => {
            if (link.href.startsWith(`https://${domain}/posts/`)) {
                let postId;
                let newLink;
                let postElement;
 
                if (link.href.includes("posts/comments/")) {
                    postId = link.href.split("posts/comments/")[1].split("/")[0];
                    newLink = `post-comment-${postId}`;
                } else {
                    postId = link.href.split("posts/")[1].split("/")[0];
                    newLink = `post-${postId}`;
                }
 
                postElement = document.querySelector(
                    `#${newLink}.${link.href.includes("posts/comments/") ? "comment" : "message"}`
                );
 
                if (postElement && !postElement.hasAttribute("ChatGPTButton")) {
                    postElement.setAttribute("ChatGPTButton", "added");
 
                    const menus = [...document.querySelectorAll("div.Menu")].filter((menu) =>
                                                                                    [...menu.querySelectorAll("a")].some((link) => link.href.includes(`${postId}`))
                                                                                   );
 
                    const author = postElement.querySelector(".username").textContent;
                    {
                        const buttonId = `ChatGPTButton-${generateRandomString(10)}`;
                        console.log(postElement)
                        let messageText;
 
                        try {
                            messageText = postElement.querySelector("div.messageInfo > div.messageContent > article > blockquote").textContent.trim().replace(/\s{2,}/g, ' ');
                        } catch (error) {
                            messageText = postElement.querySelector("div.commentInfo > div.commentContent").textContent.replace(/\s{2,}/g, ' ');
                        }
                        const usernameLink = postElement.querySelector("a");
                        const currentUrl = usernameLink.getAttribute("href");
 
                        menus[menus.length - 1]
                            .querySelector(".secondaryContent")
                            .appendChild(createButtonElement(buttonId, messageText));
                    }
                }
            }
        });
    });
}
 
function checkChatItems() {
    const elements = document.querySelectorAll('div[class^="chat2-message-block "]');
    elements.forEach((message, index) => {
        let usernameLink;
        let messageText;
        const lztui = document.querySelectorAll('div[class^="lztui-Popup lztng-"]');
        const lastElement = lztui[lztui.length - 1];
        const popupElement = message.querySelector('div[class^="PopupControl PopupOpen"]');
        if (!popupElement) return;
 
        if (message){
            usernameLink = message.querySelector('.username[href]');
            usernameLink = usernameLink ? null : usernameLink;
            if (usernameLink) {
                messageText = message.querySelector('.chat2-message-text-inner').textContent.trim().replace(/\s{2,}/g, ' ');
            } else {
                // Ищем элемент выше, пока не найдем href
                let prevIndex = index - 1;
                while (prevIndex >= 0 && !usernameLink) {
                    const prevMessage = elements[prevIndex];
                    usernameLink = prevMessage.querySelector('.username[href]');
                    messageText = prevMessage.querySelector('.chat2-message-text-inner').textContent.trim().replace(/\s{2,}/g, ' ');
                    prevIndex--;
                }
            }
            const ulElement = lastElement.querySelector('ul.secondaryContent.blockLinksList');
            if (!ulElement || ulElement.hasAttribute("ChatGPTButton")) return;
 
            ulElement.setAttribute("ChatGPTButton", "added");
            const username = usernameLink.textContent
            const buttonId = `ChatGPTButton-${generateRandomString(10)}`;
                ulElement.appendChild(createButtonElement(buttonId, messageText));
 
        }
    });
}
 
setInterval(checkThreadItems);
setInterval(checkProfileItems);
setInterval(checkChatItems);