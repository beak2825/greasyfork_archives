// ==UserScript==
// @name        c.ai Generate Message
// @namespace   c.ai Neo Panel
// @match       https://*.character.ai/ch*
// @version     0.1
// @description Generates a message with the Greeting Generator
// @author      vishanka and jenpai
// @license     MIT
// @grant       none
// @icon        https://i.imgur.com/iH2r80g.png
// @downloadURL https://update.greasyfork.org/scripts/475893/cai%20Generate%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/475893/cai%20Generate%20Message.meta.js
// ==/UserScript==

// Create a textarea for "message to respond to"
const messageTextarea = document.createElement('textarea');
messageTextarea.placeholder = 'Paste message to respond to';
messageTextarea.style.position = 'fixed';
messageTextarea.style.top = '20px'; // Positioned at the top
messageTextarea.style.left = '20px';
messageTextarea.style.resize = 'both'; // Allows for vertical and horizontal resizing
messageTextarea.style.width = '300px'; // Set an initial width
messageTextarea.style.height = '100px'; // Set an initial height

document.body.appendChild(messageTextarea);

// Create an input text box
const styleTextbox = document.createElement('input');
styleTextbox.type = 'text';
styleTextbox.placeholder = 'Enter response style';
styleTextbox.style.position = 'fixed';
styleTextbox.style.top = '150px';
styleTextbox.style.left = '20px';

document.body.appendChild(styleTextbox);

// Create the 'Generate Response' button
const generate_message_button = document.createElement('button');
generate_message_button.innerHTML = 'Generate Response';
generate_message_button.style.position = 'fixed';
generate_message_button.style.top = '220px';
generate_message_button.style.left = '20px';

document.body.appendChild(generate_message_button);

// Create the 'Generated Response' textarea
const generatedResponseTextarea = document.createElement('textarea');
generatedResponseTextarea.placeholder = 'Generated Response:';
generatedResponseTextarea.readOnly = true; // Make it uneditable
generatedResponseTextarea.style.position = 'fixed';
generatedResponseTextarea.style.top = '260px'; // Position it below the button
generatedResponseTextarea.style.left = '20px';
generatedResponseTextarea.style.resize = 'both';
generatedResponseTextarea.style.width = '300px';
generatedResponseTextarea.style.height = '100px';

document.body.appendChild(generatedResponseTextarea);

const localStorage_authorization = JSON.parse(localStorage.getItem('char_token')).value;
console.log("Authorization token =", localStorage_authorization);

generate_message_button.onclick = function () {
  event.stopPropagation();
  const endpointInfo = {
    scheme: "https",
    host: "plus.character.ai",
    filename: "/chat/character/generate/field",
  };
  const endpointUrl = `${endpointInfo.scheme}://${endpointInfo.host}${endpointInfo.filename}`;
  const messageToRespondTo = messageTextarea.value;
  const responsePromptStyle = styleTextbox.value;
  const responsePrompt = `Come up with a concise reply in the style: ${responsePromptStyle} and is less than 10 words. Don't mention any words from the style in the reply. Be succinct. Only say the reply and nothing else. The reply should be in English. The message is: ${messageToRespondTo}`;
  fetch(endpointUrl, {
    "headers": {
      "authorization": `Token ${localStorage_authorization}`,
      "content-type": "application/json",
    },
    "body": JSON.stringify({
      "field_to_generate": "reply",
      "num_candidates": 1,
      "metadata": {
        "message": `${responsePrompt}`
      },
    }),
    "method": "POST"
  })
  .then(response => response.json())
  .then(data => {
    const generatedResponse = data.result[0].text; // Extract the generated response
    generatedResponseTextarea.value = generatedResponse; // Set the value of the textarea
    console.log("Generated Response:", generatedResponse); // Log the generated response
  });
};