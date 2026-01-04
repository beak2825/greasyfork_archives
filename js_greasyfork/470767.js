// ==UserScript==
// @name         Sign up/Login  Library
// @namespace    http://tampermonkey.net/
// @version      1
// @description  A library for securely storing and retrieving user credentials from JSONBin
// @author       longkidkoolstar
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==

const binId = 'YOUR_BIN_ID_HERE';
const accessKey = 'YOUR_ACCESS_KEY_HERE';

class LoginLibrary {
  constructor() {
    // Check if user is logged in
    if (this.isLoggedIn()) {
      console.log('User is logged in');
      this.retrieveUserCredentials();
    } else {
      console.log('User is not logged in');
      this.promptUserCredentials();
    }
  }

  isLoggedIn() {
    return GM_getValue('username') && GM_getValue('password');
  }

  promptUserCredentials() {
    // Prompt user to enter username and password
    const username = prompt('Enter your username:');
    const password = prompt('Enter your password:');
    // Save username and password to Tampermonkey
    GM_setValue('username', username);
    GM_setValue('password', password);
    // Save username and password to JSONBin
    this.saveUserCredentialsToJSONBin(username, password);
  }

  retrieveUserCredentials() {
    const username = GM_getValue('username');
    const password = GM_getValue('password');
    console.log(`Username: ${username}, Password: ${password}`);
  }

  saveUserCredentialsToJSONBin(username, password) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://api.jsonbin.io/v3/b/${binId}`,
      headers: {
        'X-Bin-Access-Token': accessKey,
        'X-Access-Key': accessKey
      },
      onload: function (response) {
        const existingData = JSON.parse(response.responseText).record;
        let isUsernameFound = false;
        let isPasswordCorrect = false;
        let isUsernameTaken = false;
        for (const user in existingData.users) {
          if (existingData.users.hasOwnProperty(user)) {
            if (existingData.users[user].username === username) {
              isUsernameFound = true;
              if (existingData.users[user].password === password) {
                isPasswordCorrect = true;
              }
              break;
            }
          }
        }
        if (isUsernameFound && isPasswordCorrect) {
          console.log('User logged in successfully.');
          // Save username and password to Tampermonkey
          GM_setValue('username', username);
          GM_setValue('password', password);
        } else if (!isUsernameFound || !isPasswordCorrect) {
          for (const user in existingData.users) {
            if (existingData.users.hasOwnProperty(user)) {
              if (existingData.users[user].username === username) {
                isUsernameTaken = true;
                break;
              }
            }
          }
          if (!isUsernameTaken) {
            const userData = {
              username: username,
              password: password
            };
            const mergedData = {
              ...existingData,
              users: {
                ...existingData.users,
                [username]: userData
              }
            };
            GM_xmlhttpRequest({
              method: 'PUT',
              url: `https://api.jsonbin.io/v3/b/${binId}`,
              headers: {
                'Content-Type': 'application/json',
                'X-Bin-Access-Token': accessKey,
                'X-Access-Key': accessKey
              },
              data: JSON.stringify(mergedData),
              onload: function (response) {
                console.log('User registered successfully.');
              }
            });
          } else {
            const newUsername = prompt('That username is already taken. Please enter a new username:');
            this.saveUserCredentialsToJSONBin(newUsername, password);
          }
        }
      }
    });
  }
}

new LoginLibrary();