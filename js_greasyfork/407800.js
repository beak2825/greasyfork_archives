// ==UserScript==
// @name         Api проверка стажа
// @version      0.2
// @description  тест
// @author       lavr
// @include        https://taximeter-admin.taxi.yandex-team.ru/qc?exam=dkvu
// @grant        none
// @namespace https://greasyfork.org/users/395826
// @downloadURL https://update.greasyfork.org/scripts/407800/Api%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B0%20%D1%81%D1%82%D0%B0%D0%B6%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/407800/Api%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B0%20%D1%81%D1%82%D0%B0%D0%B6%D0%B0.meta.js
// ==/UserScript==

const inputNumberDriverLicence = document.getElementById('dkvu-license-number'),
  parentInputNumberDriverLicance = inputNumberDriverLicence.closest('div'),
  btnCheckDriver = document.createElement('button')

parentInputNumberDriverLicance.append(btnCheckDriver)
btnCheckDriver.textContent = 'CHECK'
btnCheckDriver.className = 'btn btn-primary'


// name = prompt('Введите свою фамилию!!', 'Иванов')

function getCookie(name) {
  let matches = document.cookie.match(/yandex_login=([^;]*)/)

  return matches ? decodeURIComponent(matches[1]) : undefined
}

async function getData(login, name, number) {
  let res = await fetch(`https://api-driver-node.herokuapp.com/api/v1/driver?login=${login}&name=${name}&number=${number}`, {
    method: 'GET'
  })

  return res.ok || res.status(400) || res.status(401) ? res.json() : 'ошибка'
}

function rus_to_latin(str) {
  const ru = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ё': 'e', 'ж': 'j', 'з': 'z', 'и': 'i',
    'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh',
    'щ': 'shch', 'ы': 'y', 'э': 'e', 'ю': 'u', 'я': 'ya'
  },
    n_str = []

  str = str.replace(/[ъь]+/g, '').replace(/й/g, 'i')

  for (let i = 0; i < str.length; ++i) {
    n_str.push(
      ru[str[i]]
      || ru[str[i].toLowerCase()] == undefined && str[i]
      || ru[str[i].toLowerCase()].replace(/^(.)/, function (match) { return match.toUpperCase() })
    )
  }

  return n_str.join('')
}

btnCheckDriver.addEventListener('click', async () => {
  const login = getCookie('yandex_login')
  let name

  if (localStorage.getItem('nameApiDriver')) {
    name = JSON.parse(localStorage.getItem('nameApiDriver'))
  } else {
    localStorage.setItem('nameApiDriver', JSON.stringify(rus_to_latin(prompt('Введите свою фамилию!!', 'Иванов'))))
    return
  }
  let data = await getData(login, name, inputNumberDriverLicence.value)
  let { message, status, driver_exp_date } = data

  if (status === 401) {
    alert('Вас еще не авторизованы в системе. Если Вы прочитали это сообщение, напишите в личку @Lavrenty_Tsiporin')
  }

  if (status === 400) {
    alert('Что-то пошло не так... Повторите запрос')
  }

  if (message === 'Not Found') {
    inputNumberDriverLicence.style.backgroundColor = 'rgb(217, 83, 79)'
  }

  if (driver_exp_date) {
    inputNumberDriverLicence.style.backgroundColor = '#5cb85c'
    document.getElementById('dkvu-driver-experience-date').value = driver_exp_date
    // console.log(driver_exp_date)
  }
  console.log(data)
  // console.log(message)
  // console.log(status)
})

$(document).bind("item_info", function (e, params) {
  inputNumberDriverLicence.style.backgroundColor = 'white'
})