// ==UserScript==
// @name         Workflowy dentistas autocomplete and other niceties.
// @namespace    http://alhur.es/
// @version      0.5
// @description  Autocomplete and other goodies.
// @author       fiatjaf
// @match        https://workflowy.com/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/22400/Workflowy%20dentistas%20autocomplete%20and%20other%20niceties.user.js
// @updateURL https://update.greasyfork.org/scripts/22400/Workflowy%20dentistas%20autocomplete%20and%20other%20niceties.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (location.pathname !== '/s/GPEC8RCSsR') {
        return
    }

    function waitForData (cb) {
        setTimeout(function () {
            if (unsafeWindow.PROJECT_TREE_DATA) {
                cb(unsafeWindow.PROJECT_TREE_DATA.mainProjectTreeInfo)
            } else {
                waitForData(cb)
            }
        }, 5000)
    }

    // autocomplete date
    document.addEventListener('input', function (e) {
        if (e.target.innerHTML.length <= 3 &&
            e.target.innerHTML.match(/\d{1,2}\//) &&
            e.target.classList.contains('content')) {

            let next = e.target.parentNode.parentNode.nextSibling.querySelector('.content').innerHTML
            let nextDateMatch = next.match(/\d{1,2}\/(\d{1,2}\/\d\d\d\d)/)
            if (nextDateMatch) {
                e.target.innerHTML = e.target.innerHTML + nextDateMatch[1]
                var range = document.createRange()
                range.selectNodeContents(e.target)
                range.collapse(false)
                var selection = window.getSelection()
                selection.removeAllRanges()
                selection.addRange(range)
            }
        }
    })

    // index pacientes
    var pacienteIndex = {}
    waitForData(function (tree) {
        console.log('indexing')
        tree.rootProjectChildren.forEach(ch => {
            if (ch.nm === 'pacientes') {
                ch.ch.forEach(pac => {
                    let fichaMatch = pac.nm.match(/#\w+/)
                    if (fichaMatch) {
                        pacienteIndex[fichaMatch[0]] = pac.nm
                    }
                })
            }
        })
    })

    // search paciente and show as the title of ficha tags (#3333VV etc.)
    // also show as a widget on the side
    GM_addStyle(`
.floating-widget {
  position: fixed;
  padding: 20px;
  border-radius: 5px;
  color: #333333;
  font-family: monospace;
  z-index: 10;
  border: 1px solid ridge;
  box-shadow: 10px 10px 10px 0;
  display: none;
}

.left-floating-widget {
  top: 100px;
  left: 100px;
  background: #e9ffcf;
}
    `)
    var leftwidget = document.createElement('div')
    leftwidget.className = 'floating-widget left-floating-widget'
    document.body.appendChild(leftwidget)

    document.addEventListener('mouseover', function (e) {
        var tag
        if (e.target.classList.contains('contentTag')) {
            tag = e.target
        } else if (e.target.classList.contains('contentTagText')) {
            tag = e.target.parentNode
        } else if (e.target.classList.contains('autocompleteTag')) {
            tag = e.target
        } else if (leftwidget.style.display = 'block') {
            if (leftwidget.dataset.wait) {
              var waitingkey = leftwidget.dataset.key
              setTimeout(() => {
                  if (leftwidget.dataset.key === waitingkey) {
                      leftwidget.style.display = 'none'
                      leftwidget.dataset.key = null
                  }
              }, leftwidget.dataset.wait)
            } else {
              leftwidget.style.display = 'none'
              leftwidget.dataset.key = null
            }
            return
        }

        let ficha = tag.innerText
        let paciente = pacienteIndex[ficha]
        if (paciente) {
            tag.title = paciente
            leftwidget.style.display = 'block'
            leftwidget.innerHTML = paciente
            leftwidget.dataset.key = null
        } else {
            if (ficha.match(/\d{4,5}[A-Z]{2}/i)) {
                leftwidget.style.display = 'block'
                leftwidget.innerHTML = 'Ficha sem paciente.  <br><a style="color: #27af85;" href="#/ec4a4d9f157d">Clique aqui e adicione o paciente à lista.</a>'
                leftwidget.dataset.wait = 5000
                leftwidget.dataset.key = ficha
            }
        }
    })

    // sum selected rows and show on a widget on the side
    GM_addStyle(`
.right-floating-widget {
  top: 100px;
  right: 100px;
  background: beige;
}
    `)
    var rightwidget = document.createElement('div')
    rightwidget.className = 'floating-widget right-floating-widget'
    document.body.appendChild(rightwidget)

    document.addEventListener('mouseup', function () {
        var sum = 0.0
        var marceloPag = 0.0
        var cartaoCheque = 0.0

        let selected = document.querySelectorAll('.addedToSelection')
        for (let i = 0; i < selected.length; i++) {
            let sel = selected[i]
            let text = sel.querySelector('.name .content').innerText.trim()
            let money = parseMoney(text)

            sum += money
            marceloPag += isMarceloPag(text) ? money : 0
            cartaoCheque += isCartaoCheque(text) ? money : 0
        }

        if (sum) {
            var rows = []

            rows.push(['SOMA:', '<b>R$ ' + sum.toFixed(2).replace('.', ',') + '</b>'])
            if (marceloPag) {
                rows.push(['MARCELO:', '<b>R$ ' + marceloPag.toFixed(2).replace('.', ',') + '</b>'])
                rows.push(['LÍQUIDO:', '<b>R$ ' + (sum - marceloPag).toFixed(2).replace('.', ',') + '</b>'])
            } else if (cartaoCheque) {
                rows.push(['CARTÃO/CHEQUE:', '<b>R$ ' + cartaoCheque.toFixed(2).replace('.', ',') + '</b>'])
                rows.push(['LÍQUIDO:', '<b>R$ ' + (sum - cartaoCheque).toFixed(2).replace('.', ',') + '</b>'])
            }

            rightwidget.innerHTML = writeTable(rows)
            rightwidget.style.display = 'block'
        } else {
            rightwidget.style.display = 'none'
        }
    })

    GM_addStyle(`
.floating-table {
  border: none;
}
.floating-table td:not(:first-child) {
  padding-left: 5px;
  text-align: right;
}
    `)
    function writeTable (rows) {
        return '<table class="floating-table">' + rows.map(row =>
            '<tr>' + row.map(cell =>
                '<td>' + cell + '</td>'
            ).join('') + '</tr>'
        ).join('') + '</table>'
    }

    const DRE = /(\d{1,2})\/(\d{1,2})\/(\d{2,4})/
    function parseDay (name) {
        var day
        name.replace(DRE, (_, d, m, y) => {
            day = [parseInt(y), parseInt(m), parseInt(d)]
        })
        return day
    }

    const MRE = /R\$ *([\d\.]+),(\d\d)/
    function parseMoney (str = '') {
        let m = str.match(MRE)
        if (m) {
            return parseFloat(m[1].replace('.', '') + '.' + m[2])
        }
        return 0
    }

    function isMarceloPag (str) {
        return str.search('Marcelo pag') !== -1 ||
            str.search('Marcelo Pag') !== -1 ||
            str.search('#marcelo') !== -1
    }

    function isCartaoCheque (str) {
        return str.search('#cartão') !== -1 || str.search('#cheque') !== -1
    }
})();