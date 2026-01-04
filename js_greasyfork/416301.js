// ==UserScript==
// @name        Generate Password Button
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.1
// @author      Degreet Pro <degreetpro@gmail.com>
// @description 17.11.2020, 20:59:04
// @downloadURL https://update.greasyfork.org/scripts/416301/Generate%20Password%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/416301/Generate%20Password%20Button.meta.js
// ==/UserScript==

const chars = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM!@$%^&*()_-+"

const styles = document.createElement("style")
document.head.append(styles)

styles.innerHTML = `
  .generate-password-violentmonkey-script-button {
    position: fixed;
    right: 20px;
    bottom: 0;
    background: #fff;
    width: 60px;
    height: 60px;
    border-top-left-radius: 50%;
    border-top-right-radius: 50%;
    font-size: 30px;
    border: 1px solid #bfbfbf;
    opacity: .2;
    display: flex;
    justify-content: center;
    align-items: center;
    outline: none;
    z-index: 999;
    transform: translateY(50px);
    transition: .3s;
  }

  .generate-password-violentmonkey-script-button:hover {
    opacity: 1;
    transform: translateY(20px);
  }

  .generate-password-violentmonkey-script-button.success {
    border: 1px solid green;
    color: green;
  }

  .generate-password-violentmonkey-script-button.warning {
    border: 1px solid orange;
    color: orange;
  }
`

const genPwdBtn = document.createElement("button")
genPwdBtn.className = "generate-password-violentmonkey-script-button"
genPwdBtn.innerText = "+"
document.body.append(genPwdBtn)

genPwdBtn.onclick = () => {
  const {hostname} = location
  
  if (localStorage[hostname]) {
    const password = localStorage[hostname]
    navigator.clipboard.writeText(password)
    genPwdBtn.classList.add("warning")
    setTimeout(() => genPwdBtn.classList.remove("warning"), 1000)
  } else {
    const password = generatePassword()
    navigator.clipboard.writeText(password)
    localStorage[hostname] = password
    genPwdBtn.classList.add("success")
    setTimeout(() => genPwdBtn.classList.remove("success"), 1000)
  }
}

function generatePassword() {
  let pass = ""
  for (let i = 0; i < 16; i++) pass += chars[Math.floor(Math.random() * chars.length)]
  return pass
}