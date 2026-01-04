// ==UserScript==
// @name        browser-GPT-Lite
// @namespace   moony
// @version     0.1
// @description Interact with Local LLM API Enable tampermonkey ext setting of Allow access to file URLs
// @match       *://*/*
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_registerMenuCommand
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/538969/browser-GPT-Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/538969/browser-GPT-Lite.meta.js
// ==/UserScript==

const apiUrl = "http://127.0.0.1:5000/v1";
const apiKey = "YOUR_OPENAI_API_KEY";
GM_registerMenuCommand("Delete All History", () => { const keys = GM_listValues(); if (confirm(`Do you want to delete all ${keys.length} values shown in console?`)) { keys.forEach(key => GM_deleteValue(key)); console.log(`${keys.length} values have been deleted.`); } else { console.log(`No values have been deleted.`); } });

async function getResponse(inputText, isChat = false, characterIndex = 0) {
 const url = isChat !== null ? (isChat ? `${apiUrl}/chat/completions` : `${apiUrl}/completions`) : `${apiUrl}/internal/logits`;
 const historyKey = 'history' + characterIndex;
 const history = GM_getValue(historyKey, []);
 const data = isChat !== null ? (isChat ? { "messages": history.concat([{"role": "user", "content": inputText}]), "mode": "chat", "character": "Example" } : { "prompt": inputText, "max_tokens": 50 }) : { "prompt": inputText, "use_samplers": false };
 let completion;

 return new Promise((resolve, reject) => GM_xmlhttpRequest({
  method: "POST", url: url, headers: {"Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` }, data: JSON.stringify(data),
  onload: response => {
    let result = JSON.parse(response.responseText);
    if (isChat !== null && isChat) {
      completion = result.choices[0].message.content.trim();
      history.push({"role": "assistant", "content": completion});
      GM_setValue(historyKey, history);
    } else if (isChat === false) { completion = result.choices[0].text.trim();}
    resolve(isChat !== null ? completion : result);}, onerror: error => reject(error)
 }));
}

(async function() { let inputText = "1+1="; let isChat = null; // true=Chat, false=Completions, null=Logits
  while (true) { try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      let Intruction_string = "### Instruction: \n Choose one of the number\n ### Input: ";
      // Usage LLM Chat
      let outputString = await getResponse(Intruction_string /*+"\n Let's rationally think through this carefully, step by step. "*/, true);
            // Log the output
      console.log("%c" + outputString, "color: white"); // Story Content
      // Perform your action here
    } catch (error) { console.error(error); } } })();

