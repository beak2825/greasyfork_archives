// ==UserScript==
// @name        Hide it
// @namespace   tishkas
// @match       https://admin.crimson.*.prd.maxbit.private/*
// @grant       none
// @version     1.0
// @license     wtf is a license
// @author      tishkaslyrica
// @description 2/21/2024, 3:20:29 PM
// @downloadURL https://update.greasyfork.org/scripts/487952/Hide%20it.user.js
// @updateURL https://update.greasyfork.org/scripts/487952/Hide%20it.meta.js
// ==/UserScript==


class Censor {
  static emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g
  static phoneRegex = /\+\d{10,15}/g
  static phoneListRegex = /\d{8,15}/g

  static censoreString(str){
    return str[0] + "*".repeat(str.length - 2) + str.slice(-1);
  }

  static censoreEmail(email){
    const emailArr = email.split("@")
    return this.censoreString(emailArr[0]) + "@" + this.censoreString(emailArr[1])
  }

  static censorePhone(phone){
    return this.censoreString(String(phone))
  }

  static censorePersonalData(string){
    return this.censoreString(string)
  }

  static hasCensored(string){
    return String(string).match(/\*/)
  }

}


(async function(){
  // while(true){
    // await new Promise(r => setTimeout(r, 50));

    const emails = document.body.innerHTML.match(Censor.emailRegex) || []
    for(let email of emails){
      // if(!email) continue
      console.log(email)
      if(!Censor.hasCensored(email)) document.body.innerHTML = document.body.innerHTML.replace(email, Censor.censoreEmail(email))
    }

    const phones = document.body.innerHTML.match(Censor.phoneRegex) || []
    for(let phone of phones){
      // if(!email) continue
      console.log(phone)
      if(!Censor.hasCensored(phone)) document.body.innerHTML = document.body.innerHTML.replace(phone, Censor.censorePhone(phone))
    }

    const userPageLastname = document.querySelector(".row.row-last_name td")

    if(userPageLastname){
      if(userPageLastname.innerText) {
        const lastname = userPageLastname.innerText
        userPageLastname.innerText = Censor.censorePersonalData(userPageLastname.innerText)
        document.body.innerHTML = document.body.innerHTML.replaceAll(lastname, Censor.censorePersonalData(userPageLastname.innerText))
      }
    }

    const userListLastname = document.querySelectorAll(".col.col-familiya") || []

    for(let lastname of userListLastname){
      if(!lastname) continue
      if(!lastname.innerText) continue
      lastname.innerText = Censor.censorePersonalData(lastname.innerText)
    }

  // }


})();
