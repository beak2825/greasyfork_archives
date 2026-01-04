// ==UserScript==
// @name         Быстрые шаблоны(кустарного производства)
// @version      6.6.6
// @description  ДКВУ
// @author       k
// @include      https://taximeter-admin.taxi.yandex-team.ru/qc?exam=dkvu
// @grant        none
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/439871/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B5%20%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D1%8B%28%D0%BA%D1%83%D1%81%D1%82%D0%B0%D1%80%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/439871/%D0%91%D1%8B%D1%81%D1%82%D1%80%D1%8B%D0%B5%20%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D1%8B%28%D0%BA%D1%83%D1%81%D1%82%D0%B0%D1%80%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BF%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%29.meta.js
// ==/UserScript==

//быстрые метки
const style = document.createElement('style')
style.innerHTML = `
.my-tag-element_red.selected{
  background-color: red!important;
  opacity: 1!important;
}

.my-tag-element_green.selected{
  background-color: #5cb85c!important;
  opacity: 1!important;
  color: #fff;
}

.my-tag-element_blue.selected{
  background-color: blue!important;
  opacity: 1!important;
  color: #fff;
}

.my-tag-element_white.selected{
  background-color: #aba1a1!important;
  opacity: 1!important;
  color: #fff;
}

.my-tag-element_yellow.selected{
  background-color: #ffff008f!important;
  opacity: 1!important;
  color: #fff;
}

.my-tag-element:hover{
  opacity: 1!important;
}

.fast_template_panel.opened{
  right: 0;
  background: #ef707045!important;
}

.fast-template-container.opened{
  right: 0!important;
}

.fast-template-container>div:nth-child(11){
  grid-column: 1 / span 2;
}
.fast-template-container>div:nth-child(12){
  grid-column: 1 / span 2;
}
.fast-template-container>div:nth-child(13){
  grid-column: 1 / span 2;
}
`
document.querySelector('head').append(style)

const tags = document.getElementById('tags'),
  myTags = document.createElement('div')

myTags.classList.add('my-tags-container')
myTags.style.maxWidth = '300px'

tags.before(myTags)

tags.style.display = 'none'

function createTag(name, value, tag) {
  const div = document.createElement('div'),
    span = document.createElement('span')

  span.style = `background-color: black; opacity: 0.2; color: white; border: 1px solid rgb(128, 128, 128); margin: 2px; padding: 3px 8px; border-radius: 3px; display: inline-block; cursor: pointer;`
  span.textContent = name
  span.setAttribute('value', value)
  span.className = `my-tag-element ${tag}`

  span.addEventListener('click', () => {
    document.querySelector(`a.js-tag>input[value="${value}"]`).closest('a').click()
    updateSelectedTags()
  })

  div.append(span)

  return div
}






let arrayTags = []

function updateSelectedTags() {
  arrayTags = []
  document.querySelectorAll('.my-tag-element').forEach(item => item.classList.remove('selected'))

  let arrInput = document.querySelectorAll('a.js-tag>input:checked')
  if (arrInput.length < 0) return

  arrInput.forEach(item => arrayTags.push(item.value))

  selectedTags(arrayTags)
}

function selectedTags(arr) {
  arr.forEach(item => {
    if(document.querySelector(`.my-tag-element[value="${item}"]`) === null) return
    document.querySelector(`.my-tag-element[value="${item}"]`).classList.add('selected')
  })
}

$(document).on('item_info', updateSelectedTags);

//быстрые шаблоны
const content = document.getElementById('content'),
  divTemplate = document.createElement('div'),
  divFastTemplatePanel = document.createElement('div')

content.before(divFastTemplatePanel)
divFastTemplatePanel.append(divTemplate)
divFastTemplatePanel.className = 'fast_template_panel opened'
divFastTemplatePanel.style = `position: absolute; top: 180px; right: 0; background: #ff0000b0; width: 15px; height: 10px; font: 14px Arial; color: #fff; text-align: center; padding: 5px; cursor: pointer; transition: all 0.5s ease-in; border-radius: 5px 0 0 5px; z-index: 99999;`

divFastTemplatePanel.addEventListener('click', function (event) {
  if (event.target.classList.contains('fast_template_panel')) {
    this.classList.toggle('opened')
    divTemplate.classList.toggle('opened')
  }
})

divTemplate.className = 'fast-template-container opened'
divTemplate.style = `position: absolute; top: 15px; right: -190px; background-color: #2b2d307a; color: #000; padding: 10px; text-align: center; transition: all 0.5s ease-in; border-radius: 5px; width: 200px; z-index: 99999; display: grid; grid-template-columns: 1fr 1fr;`

function createTemplate(name, value, color, fif) {
  const div = document.createElement('div'),
    span = document.createElement('span')

  span.style = `background-color: ${color}; opacity: 0.4; color: white; border: 1px solid rgb(128, 128, 128); margin: 2px; padding: 3px 8px; border-radius: 3px; display: inline-block; cursor: pointer; width: -moz-available; width: -webkit-fill-available; width: available; display: flex; align-items: center; justify-content: center; height: 40px;`
  span.textContent = name
  span.setAttribute('value', value)
  span.dataset.template = value
  span.className = `my-tag-element`

  switch (color) {
      case '#f0ad4e':
          span.addEventListener('click', function () {
              if (confirm('Точно хотите отправить данное замечание?')) {
                  resolveTemplateBlock(this.dataset.template, 'btn-block')
              }
          })
          break;
      case '#d9534f':
          span.addEventListener('click', function () {
              if (confirm('Точно хотите отправить данное замечание?')) {
                  resolveTemplateBlock(this.dataset.template, 'btn-blacklist', fif)
              }
          })
          break;
  }

  div.append(span)

  return div
}

async function resolveTemplateBlock(data, button, fif) {
  let btn = document.getElementById(button)
  await new Promise(res => {
    setTimeout(() => {
      btn.click()
      res(true);
    }, 300);
  })
  await new Promise(res => {
    setTimeout(() => {
      if (fif) document.querySelector('.btn-in-modal-dialog').click()
      document.querySelector(`li[data-template="${data}"]`).click()
      res(true)
    }, 400);
  })
  await new Promise(res => {
    setTimeout(() => {
      //alert('true')
       document.getElementById('btn-error').click()
      res(true)
    }, 500);
  })
}

const dataTemplate = [
  {
    name: 'фото размыто',
    value: 'фото размыто или сделано издалека. ФИО и номер должны чётко читаться',
    color: '#f0ad4e',
    fif: false
  },
  {
    name: 'фото размыто',
    value: 'фото размыто или сделано издалека. ФИО и номер должны чётко читаться',
    color: '#d9534f',
    fif: true
  },
  {
    name: 'нет фото ву',
    value: 'нет фотографий водительского удостоверения',
    color: '#f0ad4e',
    fif: false
  },
  {
    name: 'нет фото ву',
    value: 'нет фотографий водительского удостоверения',
    color: '#d9534f',
    fif: true
  },
  {
    name: 'нет одной стороны',
    value: 'на фотографиях нет одной из сторон водительского удостоверения. Для проверки нужны обе стороны: лицевая и обратная',
    color: '#f0ad4e',
    fif: false
  },
  {
    name: 'нет одной стороны',
    value: 'на фотографиях нет одной из сторон водительского удостоверения. Для проверки нужны обе стороны: лицевая и обратная',
    color: '#d9534f',
    fif: true
  },
  /*{
    name: 'не в кадре',
    value: 'водительское удостоверение не полностью попало в кадр',
    color: '#f0ad4e',
    fif: false
  },
  {
    name: 'не в кадре',
    value: 'водительское удостоверение не полностью попало в кадр',
    color: '#d9534f',
    fif: true
  },*/
  {
    name: 'селфи размыто',
    value: 'фотография с водительским удостоверением получилась нечёткой',
    color: '#f0ad4e',
    fif: false
  },
  {
    name: 'селфи размыто',
    value: 'фотография с водительским удостоверением получилась нечёткой',
    color: '#d9534f',
    fif: true
  },
  {
    name: 'нет селфи',
    value: 'нет вашей фотографии с водительским удостоверением',
    color: '#f0ad4e',
    fif: false
  },
  {
    name: 'нет селфи',
    value: 'нет вашей фотографии с водительским удостоверением',
    color: '#d9534f',
    fif: true
  },
  {
    name: 'фейк',
    value: 'есть сомнения в подлинности удостоверения',
    color: '#d9534f',
    fif: false
  },
  {
    name: 'плохое состояние',
    value: 'данные на фотографии сложно прочитать, так как водительское удостоверение в плохом состоянии',
    color: '#d9534f',
    fif: false
  },
  {
    name: 'правила  сервиса',
    value: `ваше водительское удостоверение не соответствует <a href=` + "https://taxi.yandex.ru/rabota/?utm_medium=driver.yandex#faqq" + `>правилам сервиса</a>`,
    color: '#d9534f',
    fif: false
  },
]

dataTemplate.forEach(({ name, value, color, fif }) => divTemplate.append(createTemplate(name, value, color, fif)))

$(document).on('item_info', (e, params) => {
  if (params.city === 'Кишинёв') {
    document.querySelector('.my-tag-element[value="blue_professional_certificate"]').style.display = 'block'
    document.querySelector('.my-tag-element[value="no_professional_certificate"]').style.display = 'block'
    document.querySelector('.my-tag-element[value="yellow_professional_certificate"]').style.display = 'block'
  } else {
    document.querySelector('.my-tag-element[value="blue_professional_certificate"]').style.display = 'none'
    document.querySelector('.my-tag-element[value="no_professional_certificate"]').style.display = 'none'
    document.querySelector('.my-tag-element[value="yellow_professional_certificate"]').style.display = 'none'
  }
  params.city === 'Бухарест' ? divTemplate.style.pointerEvents = 'none' : divTemplate.style.pointerEvents = 'all'
  document.querySelector('.js-tag-container').style.display = 'none'
});