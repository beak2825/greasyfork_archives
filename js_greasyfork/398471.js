// ==UserScript==
// @name         Работа с Frodders
// @version      0.1
// @description  ...
// @author       yandex
// @include      https://taximeter-admin.taxi.yandex-team.ru/qc?exam=dkvu
// @include     https://taximeter-admin.taxi.yandex-team.ru/qc/history?exam=*
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkk
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkk/priority
// @namespace https://greasyfork.org/users/395826
// @downloadURL https://update.greasyfork.org/scripts/398471/%D0%A0%D0%B0%D0%B1%D0%BE%D1%82%D0%B0%20%D1%81%20Frodders.user.js
// @updateURL https://update.greasyfork.org/scripts/398471/%D0%A0%D0%B0%D0%B1%D0%BE%D1%82%D0%B0%20%D1%81%20Frodders.meta.js
// ==/UserScript==

let url = document.location.href

url.includes('history?exam=') ? inHIstory() : inMainTS()

function copyData(el) {

    let nameTaxipark, numberCar, licenseDriver

    el.addEventListener('click', () => {
        if (url.includes('dkk')) {
            navigator.clipboard.writeText(`/frodDkk ${nameTaxipark.trim()}, ${numberCar}`)
        } else {
            navigator.clipboard.writeText(`/emul ${nameTaxipark.trim()}, ${numberCar}, ${licenseDriver}`)
        }
    })

    const checkSelect = () => {
        const itemSelect = document.querySelector('tr.selected')

        let number = itemSelect.dataset.car

        nameTaxipark = itemSelect.dataset.company
        numberCar = number.slice(number.lastIndexOf('(')+1,number.lastIndexOf(')'))
        licenseDriver = itemSelect.dataset.driverLicense

        if (url.includes('dkk')) {
            console.log(`Таксопарк: ${nameTaxipark}, госномер а/м: ${numberCar}`)
        } else {
            console.log(`Таксопарк: ${nameTaxipark}, госномер а/м: ${numberCar}, номер в/у: ${licenseDriver}`)
        }
    }

    $(document).bind("item_info", function (e, params) {
        checkSelect()
    })
}

function inMainTS() {
    const emul = document.createElement('button'),
          btnBlacklist = document.getElementById('btn-blacklist')

    btnBlacklist.before(emul)
    emul.textContent = 'E'
    emul.className = 'btn btn-info'
    emul.style.backgroundColor = '#d03636'
    emul.style.float = 'left'
    emul.style.marginRight = '5px'

    copyData(emul)
}

function inHIstory() {

    const emul = document.createElement('button'),
          user = document.getElementById('user')

    user.before(emul)
    emul.textContent = 'E'
    emul.className = 'btn btn-info'
    emul.style.backgroundColor = '#d03636'
    emul.style.float = 'left'
    emul.style.marginRight = '5px'

    copyData(emul)
}