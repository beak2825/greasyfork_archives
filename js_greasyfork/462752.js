// ==UserScript==
// @name         ExportGPT
// @version      1.2
// @description  Export ChatGPT conversations as JSON files
// @author       XSPGMike
// @match        https://chat.openai.com/*
// @license      MIT
// @namespace https://greasyfork.org/users/1049275
// @downloadURL https://update.greasyfork.org/scripts/462752/ExportGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/462752/ExportGPT.meta.js
// ==/UserScript==

const button = document.createElement('button');
button.textContent = 'export .json';
button.style.position = 'fixed';
button.style.top = '10px';
button.style.right = '10px';
button.style.backgroundColor = '#555'
button.style.padding = '5px'
button.style.borderRadius = '2px'

document.body.appendChild(button);

let conversation;
let messages;

button.addEventListener('click', () => {
  const blob = new Blob([
    JSON.stringify(messages.slice(1).map(el => ({
        author: el.author_role,
        content: el.content,
        created_at: el.create_time
      })
    ))
  ], { type: 'text/plain'} )
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a')
  link.href = url
  link.download = `${conversation.title}.json`
  document.body.appendChild(link)
  link.click();
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
});

window.originalFetch = window.fetch;
window.fetch = async function (url, options) {
  try {
    const response = await originalFetch(url, options);
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const responseClone = response.clone();
      const jsonData = await responseClone.json();
      const pattern =
        /^https:\/\/chat\.openai\.com\/backend-api\/conversation\/(.*)/;
      const match = url.match(pattern);
      if (match) {
        const conversationId = match[1];
        conversation = {
          id: conversationId,
          title: jsonData.title,
          create_time: jsonData.create_time,
          moderation_results: JSON.stringify(jsonData.moderation_results),
          current_node: jsonData.current_node,
          plugin_ids: JSON.stringify(jsonData.plugin_ids),
        };


        messages = Object.values(jsonData.mapping)
          .filter((m) => m.message)
          .map((message) => {
            m = message.message;
            let content = "";
            if (m.content) {
              if (m.content.text) {
                content = m.content.text;
              } else {
                content = m.content.parts.join("\n");
              }
            }
            return {
              id: m.id,
              conversation_id: conversationId,
              author_role: m.author ? m.author.role : null,
              author_metadata: JSON.stringify(
                m.author ? m.author.metadata : {}
              ),
              create_time: m.create_time,
              content: content,
              end_turn: m.end_turn,
              weight: m.weight,
              metadata: JSON.stringify(m.metadata),
              recipient: m.recipient,
            };
          });

      }
    }
    return response;
  } catch (error) {
    console.error("Error fetching and saving JSON:", error);
    throw error;
  }
};
