// ==UserScript==
// @name The West Auto Registration
// @namespace The West Auto Registration
// @author Thivinskiy123
// @description The West Auto Registration in one click
// @match *.the-west.ru.com
// @include https://www.the-west.*
// @include https://www.the-west.*.*
// @version 1.3
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/479551/The%20West%20Auto%20Registration.user.js
// @updateURL https://update.greasyfork.org/scripts/479551/The%20West%20Auto%20Registration.meta.js
// ==/UserScript==
(function (fn) {
  var script = document.createElement('script');
  script.type = 'application/javascript';
  script.textContent = '(' + fn + ')();';
  document.body.appendChild(script);
  script.parentNode.removeChild(script);
})(function () {

class AutoRegistration {
  usedNicknames = new Set();
  PASSWORD = '123qwe';

  constructor() {
    this.addRegistrationButton();
    console.log('AutoRegistration added')
  }

  async registerInOneClick() {
    const randomUserName = this.generateUniqueUserName();
    const isFree = await this.checkUserName(randomUserName);

    if (isFree) {
      console.log(`name ${randomUserName} is free for registration`)
      this.registerUser(randomUserName)
    } else {
      console.log(`registration ${randomUserName} failed. Trying again...`)
      await this.registerInOneClick();
    }
  }

  addRegistrationButton() {
    const generalInfo = document.getElementsByClassName('pb-news')[0];
    const oneClickRegisterBtn = document.createElement('button');
    oneClickRegisterBtn.innerText = 'One Click Registration';
    oneClickRegisterBtn.style = 'margin-left: 20px;border:1px solid #59595B;padding: 2px 20px;cursor: pointer;border-radius: 4px;';
    oneClickRegisterBtn.onclick = () => this.registerInOneClick();
    generalInfo.after(oneClickRegisterBtn);
  }

  getEmail(username) {
    return `thewestttt4+${username}@gmail.com`
  }

  generateUniqueUserName() {
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    const vowels = 'aeiou';

    const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

    const capitalizeFirstLetter = (word) => word.charAt(0).toUpperCase() + word.slice(1);

    let attempt = 0;
    let nickname;

    do {
      nickname = capitalizeFirstLetter(getRandomElement(consonants)) +
        getRandomElement(vowels) +
        getRandomElement(consonants) +
        getRandomElement(vowels) +
        getRandomElement(consonants) +
        getRandomElement(vowels);

      attempt += 1;
    } while (this.usedNicknames.has(nickname) && attempt < 1000000);

    if (attempt < 1000000) {
      this.usedNicknames.add(nickname);
      return nickname;
    } else {
      throw new Error('Unable to generate a unique pseudonym.');
    }
  }

  async checkUserName(name) {
    const resp = await Ajax.request({
      url: 'index.php?page=register&ajax=check_input&locale=' + Game.locale,
      data: {
        type: 'name',
        value: name
      }
    });

    return !resp.error
  }

  registerUser(username) {
    const defaultWorld = 0
    Registration.makeRegistration(defaultWorld, {
      name: username,
      email: this.getEmail(username),
      agb: 1, // terms checkbox on
      emails_optin: 1, // news checkbox on
      password: this.PASSWORD,
      password_confirm: this.PASSWORD
    });
  }

}

  $(document).ready(function () {
    new AutoRegistration();
  });
});