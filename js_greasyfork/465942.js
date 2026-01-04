// ==UserScript==
// @name        Facta
// @description Digitação Produtividade
// @author      murielguedes@pm.me
// @namespace   https://github.com/muriel-guedes/digitacao-produtividade
// @copyright   2023, murielguedes (https://openuserjs.org/users/murielguedes)
// @license     MIT
// @version     1.1
// @run-at      document-end
// @grant       none
// @match       https://desenv.facta.com.br/sistemaNovo/propostaSimulador.php
// @downloadURL https://update.greasyfork.org/scripts/465942/Facta.user.js
// @updateURL https://update.greasyfork.org/scripts/465942/Facta.meta.js
// ==/UserScript==

// @require     https://rawgit.com/eKoopmans/html2canvas/develop/dist/html2canvas.min.js

document.body.addEventListener('keydown', e => {
  if(!e.altKey) return;
  switch(e.key) {
    case 'w':
    case 'W':
      var delay = 0
      for (const [id, value] of [
          ["produto", "D"],
          ["tipoOperacao", 13],
          ["averbador", 20095],
          ["banco", 3]
        ]) {
        setTimeout(() => {
          let e = document.getElementById(id)
          e.value = value
          e.dispatchEvent(new Event('change'))
        }, delay)
        delay += 1000
      }
      break;
    case 'q':
    case 'Q':
      const dcalc = document.body.getElementsByClassName("retornoCalculosFgts")[0]
      const id = parseInt(prompt("id","2")) - 1

      const div = dcalc.children[id].children[0].children[1]
      div.style.width = "auto"
      div.style.display = "flex"
      div.style.backgroundColor = "white"
      div.style.gap = "20px"
      div.style.padding = "20px 20px 0 20px"

      const d1 = div.children[0]
      d1.style.width = "auto"
      d1.style.whiteSpace = "nowrap"

      const d2 = div.children[1]
      d2.style.width = "auto"
      d2.style.whiteSpace = "nowrap"

      html2canvas(div).then(canvas => {
        let a = document.createElement('a')
        a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream")
        a.download = 'print.jpg'
        a.click()
      })
      break
  }
})










