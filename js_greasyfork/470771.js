// ==UserScript==
// @name         Onch'GPT
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Use Chat GPT to answer on Onche forums
// @author       JackpotRed
// @match        https://onche.org/topic/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470771/Onch%27GPT.user.js
// @updateURL https://update.greasyfork.org/scripts/470771/Onch%27GPT.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const apiKey = 'YOUR_API_KEY_HERE'; // Replace this with your API key

    async function getElements(messages, options = {}) {
        return new Promise((resolve, reject) => {
            let topic = {}

            document.querySelectorAll(".signature").forEach(el => el.remove());
            topic.title = document.querySelector("h1").innerText;
            topic.messages = document.querySelectorAll(".message .message-content");
            topic.authors = document.querySelectorAll(".message .message-username");

            resolve(topic)
        });
    }

    async function callChatGPT(messages, options = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://api.openai.com/v1/chat/completions',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                data: JSON.stringify({
                    'model': 'gpt-3.5-turbo', // you can replace with 'gpt-4'
                    'messages': messages,
                    ...options
                }),
                onload: (response) => {
                    const responseData = JSON.parse(response.responseText);
                    if (response.status === 200 && responseData.choices) {
                        resolve(responseData.choices[0].message.content);
                    } else {
                        reject(new Error('API Error: ' + response.statusText));
                    }
                },
                onerror: (error) => {
                    reject(error);
                }
            });
        });
    }

    async function main() {
        try {
            var topic = await getElements()

            const role = "Réponds au premier message du topic comme si tu étais un utilisateur du forum Onche. Tu es jeune, dans la vingtaine. Réponds de manière vulgaire et marrante sans inclure d'émoticônes. Tu ne dois répondre que par {nbPhrases} phrase maximum. N'inclus surtout pas de propos raciste, antisémite, homophobe, sexiste ou pédophile."
            const instructions = " Dans ta réponse, ne répète ni le titre du topic ni le premier message."
            const sticker = " Inclus un des stickers suivant de temps en temps à la fin d'une phrase: \":sueur:\", \":cafe:\", \":risitas_ahi:\", \":zizou:\", \":nez:\", \":golemvelo:\", \":fdv_poivron:\", \":issourouge:\", \":ahi:\", \":bras:\", \":topproduit:\", \":insecte_risitas:\", \":jesus_calvitie_face:\" . Ne mets pas de point après un sticker."

            const prompt = role + instructions + sticker + " Titre du topic : " + topic.title + ". Premier message du topic : " + topic.messages[0].innerText;

            const messages = [
                { 'role': 'user', 'content': prompt }
            ];
            const options = {
                'temperature': 1, // 1 is more creative
                // Add more parameters here as needed
            };

            const responseText = await callChatGPT(messages, options);

            //console.log(topic)
            //topic.messages.forEach(element => console.log(element.innerText));

            document.querySelector(`textarea[name="message"]`).value = responseText;
            console.log(`Generated response: ${responseText}`);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    main();
})();