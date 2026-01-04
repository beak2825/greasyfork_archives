// ==UserScript==  
// @name      Emoji Enabler  
// @namespace   enables emojis for the keyboard in bodega bot
// @version    0.1  
// @description  Enables emoji access on TinyChat.com chat input field  
// @author     Bort
// @match      https://tinychat.com/*  
// @grant      none  
// @downloadURL https://update.greasyfork.org/scripts/502369/Emoji%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/502369/Emoji%20Enabler.meta.js
// ==/UserScript==    
  
// Add emoji picker library  
const emojiPickerScript = document.createElement('script');  
emojiPickerScript.src = 'https://cdn.jsdelivr.net/npm/emoji-picker@3.1.1/dist/umd/emoji-picker.min.js';  
document.head.appendChild(emojiPickerScript);  
  
// Identify the chat input field  
const chatInputField = document.querySelector('.chat-input-field'); // Replace with the actual CSS selector  
  
// Create an emoji picker instance  
const emojiPicker = new EmojiPicker({  
  trigger: chatInputField,  
  emojiSize: 24,  
  skinTone: 1,  
  search: true,  
  recent: true,  
  categories: ['smileys', 'animals', 'food', 'objects', 'flags'],  
});  
  
// Add event listener to insert emojis into the chat input field  
emojiPicker.on('emoji:select', (emoji) => {  
  chatInputField.value += emoji.emoji;  
  chatInputField.focus();  
});
