// ==UserScript==
// @name         GreasyFork Password Generator
// @namespace    http://your-namespace.com
// @version      0.1
// @description  Generates random passwords for GreasyFork users
// @author       Your Name
// @match        https://greasyfork.org/*, https://www.google.com/*
// @downloadURL https://update.greasyfork.org/scripts/488049/GreasyFork%20Password%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/488049/GreasyFork%20Password%20Generator.meta.js
// ==/UserScript==

// Password generator for GreasyFork
function generatePassword(length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }
  
  return password;
}

// Example usage with a password length of 12 characters
const newPassword = generatePassword(12);
console.log(newPassword);
