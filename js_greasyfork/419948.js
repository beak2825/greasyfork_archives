// ==UserScript==
// @name Samlib Reader
// @description Делает самиздатовские текста более читабельными: смена фона на тёмный, смена шрифта на verdana, смена цвета текста на светлый, текст выровнен по ширине строки, добавлен автоматический перенос слов. Дополнительно добавлено окно настроек, позволяющее изменить ширину текста, тип и размер шрифта, цвет общего фона страницы, а также принудительно сменить цвет текста, в случае, когда автор вручную установил цвет части текста. Работает также на zhurnal.lib.ru, budclub.ru
// @copyright 2019, Angens (https://openuserjs.org/users/angens)
// @license MIT
// @version 3.0.1
// @match http://samlib.ru/*
// @match http://zhurnal.lib.ru/*
// @match http://budclub.ru/*
// @grant none
// @namespace https://greasyfork.org/users/386214
// @downloadURL https://update.greasyfork.org/scripts/419948/Samlib%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/419948/Samlib%20Reader.meta.js
// ==/UserScript==
//
// ==OpenUserJS==
// @author angens
// ==/OpenUserJS==



/* Функция простановки мягких дефисов в каждое слово */
const rules = [
    [/[йъь][аеёиоуыэюяАЕЁИОУЫЭЮЯбвгджзклмнпрстфхцчшщБВГДЖЗКЛМНПРСТ][аеёиоуыэюяАЕЁИОУЫЭЮЯбвгджзклмнпрстфхцчшщБВГДЖЗКЛМНПРСТ]/g, 1],
    [/[аеёиоуыэюя][аеёиоуыэюяАЕЁИОУЫЭЮЯ]/g, 1],
    [/[бвгджзклмнпрстфхцчшщБВГДЖЗКЛМНПРСТ][аеёиоуыэюяАЕЁИОУЫЭЮЯ][аеёиоуыэюяАЕЁИОУЫЭЮЯ][бвгджзклмнпрстфхцчшщБВГДЖЗКЛМНПРСТ]/g, 2],
    [/[бвгджзклмнпрстфхцчшщБВГДЖЗКЛМНПРСТ][аеёиоуыэюяАЕЁИОУЫЭЮЯ][бвгджзклмнпрстфхцчшщБВГДЖЗКЛМНПРСТ][аеёиоуыэюяАЕЁИОУЫЭЮЯ]/g, 2],
    [/[аеёиоуыэюяАЕЁИОУЫЭЮЯ][бвгджзклмнпрстфхцчшщБВГДЖЗКЛМНПРСТ][бвгджзклмнпрстфхцчшщБВГДЖЗКЛМНПРСТ][бвгджзклмнпрстфхцчшщБВГДЖЗКЛМНПРСТ][аеёиоуыэюяАЕЁИОУЫЭЮЯ]/g, 2],
    [/[аеёиоуыэюяАЕЁИОУЫЭЮЯ][бвгджзклмнпрстфхцчшщБВГДЖЗКЛМНПРСТ][бвгджзклмнпрстфхцчшщБВГДЖЗКЛМНПРСТ][бвгджзклмнпрстфхцчшщБВГДЖЗКЛМНПРСТ][бвгджзклмнпрстфхцчшщБВГДЖЗКЛМНПРСТ][аеёиоуыэюяАЕЁИОУЫЭЮЯ]/g, 3]
  ]
function replacer(match) {
  let pos = 0
  rules.forEach(rule => {
    if(rule[0].test(match)){pos = rule[1]}
  })
  let result = match
  if(pos != 0) {result = match.slice(0, pos) + "&shy;" + match.slice(pos)}
  return result
}
function process_text(text) {
  
  let text_2 = text
  rules.forEach(rule => {
    while(text_2.match(rule[0]) != null) {
      text_2 = text_2.replaceAll(rule[0], replacer)
    }
  })
  
  return text_2
}


class samlibReader {
  constructor() {
    this.init_styles()
    this.init_text_and_description()
    this.init_controls()
    
    let main_container = document.createElement('div')
    main_container.classList.add('samlibReader', 'mainContainer')
    
    let sub_container = document.createElement('div')
    sub_container.classList.add('samlibReader', 'subContainer')
    
    main_container.append(sub_container, this.description)
    sub_container.append(this.controls, this.new_element)
    document.body.append(this.styles, main_container)
    
    this.new_element.innerHTML = process_text(this.new_element.innerHTML)
  }
   
  /* Парсим блок текста и блок описания */
  init_text_and_description() {
    let lines = document.querySelectorAll('hr')
    let tail = document.createElement('div')
    while (lines[lines.length - 3].nextSibling){
      tail.append(lines[lines.length - 3].nextSibling)
    }
    let descLines = tail.querySelectorAll('hr')
    
    // Создаём блок описания
    this.description = document.createElement('div')
    while (descLines[descLines.length - 2].nextSibling){
      this.description.append(descLines[descLines.length - 2].nextSibling)
    }
    this.description.insertBefore(descLines[descLines.length - 2], this.description.firstChild)
    
    // Создаём блок текста
    this.new_element = document.createElement('div')
    while (tail.firstChild){
        this.new_element.append(tail.firstChild)
      }
      tail = null
    
    this.new_element.classList.add('samlibReader', 'newElement')
    this.description.classList.add('samlibReader', 'description')
  }
  
  /* Создём блок настроек */
  init_controls() {
    this.controls = document.createElement('div')
    this.controls.classList.add('samlibReader', 'controls')
    
    let controls_container = document.createElement('div')
    controls_container.classList.add('samlibReader', 'controlsContainer')    
    let controls_overlay = document.createElement('a')
    controls_overlay.classList.add('samlibReader', 'controlsOverlay')    
    this.controls_content = document.createElement('div')
    this.controls_content.classList.add('samlibReader', 'controlsContent')
    
    controls_overlay.addEventListener('click', () => {
      if(controls_overlay.classList.contains('active')){
        this.controls_content.style.setProperty('display', "none")
        this.controls_height = this.controls_height_d
        controls_overlay.classList.remove('active')
        this.set_styles()      
      }else{
        this.controls_content.style.setProperty('display', "flex")
        this.controls_height = this.controls_content.offsetHeight
        controls_overlay.classList.add('active')
        this.set_styles()        
      }
    })
    
    controls_overlay.innerText = "⚙"
    
    this.controls.append(controls_container)
    controls_container.append(controls_overlay, this.controls_content)
    
    this.set_controls()
  }
  set_controls() {
    let width_control = this.create_width_control()
    let font_control = this.create_font_control()
    
    let background_control = this.create_list_block('Сделать весь фон тёмным')
    let font_color_control = this.create_list_block('Принудительно применить стили шрифта')
    let font_bgcolor_control = this.create_list_block('Принудительно сменить цвет фона в тексте')
    
    background_control.addEventListener('click', () => {
      if(background_control.classList.contains("active")){
        this.body_bgcolor = "#212127"
        this.body_color = "white"
        this.body_link_color = this.link_color
        this.body_link_color_v = this.link_color_v
        this.set_styles()
      } else {
        this.body_bgcolor = ""
        this.body_color = ""
        this.body_link_color = ""
        this.body_link_color_v = ""
        this.set_styles()
      }
    })
    font_color_control.addEventListener('click', () => {
      if(font_color_control.classList.contains("active")){
        this.font_font = "inherit"
        this.font_size = "inherit"
        this.font_color = "inherit"
        this.font_align = "justify"
        this.set_styles()
      } else {
        this.font_font = ""
        this.font_size = ""
        this.font_color = ""
        this.font_align = ""
        this.set_styles()
      }
    })
    font_bgcolor_control.addEventListener('click', () => {
      if(font_bgcolor_control.classList.contains("active")){
        this.font_bgcolor = "inherit"
        this.set_styles()
      } else {
        this.font_bgcolor = ""
        this.set_styles()
      }
    })
    
    background_control.click()
    
    this.controls_content.append(width_control, font_control, background_control, font_color_control, font_bgcolor_control)
  }
  create_width_control() {
    let ui = document.createElement('div')
    let buttonbox = document.createElement('div')
    let sliderbox = document.createElement('div')
    let s30 = document.createElement('button')
    let s40 = document.createElement('button')
    let s50 = document.createElement('button')
    let slider = document.createElement('input')
    let value = document.createElement('a')
    let preview = document.createElement('div')
    
    ui.append(buttonbox, sliderbox)
    buttonbox.append(s30, s40, s50)
    sliderbox.append(slider, value)
    this.new_element.prepend(preview)
    
    slider.setAttribute('type', "range")
    slider.min = 1
    slider.max = 100
    slider.value = 40
    slider.step = 1
    
    sliderbox.addEventListener('mouseover', () => {
      document.querySelector(".samlibReader.previewBox").style.setProperty('width', `calc(${slider.value}vw - 66px)`)
      document.querySelector(".samlibReader.previewBox").style.setProperty('display', "block")
    })
    sliderbox.addEventListener('mouseleave', () => {
      document.querySelector(".samlibReader.previewBox").style.setProperty('display', "none")
    })
    slider.addEventListener('input', () => {
      document.querySelector(".samlibReader.previewBox").style.setProperty('width', `calc(${slider.value}vw - 66px)`)
      value.innerText = slider.value + "%"
    })
    slider.addEventListener('change', () => {
      this.text_width = slider.value
      value.innerText = slider.value + "%"
      this.set_styles()
    })
    s30.addEventListener('click', () => {
      this.text_width = 30
      slider.value = 30
      value.innerText = 30 + "%"
      this.set_styles()
    })
    s40.addEventListener('click', () => {
      this.text_width = 40
      slider.value = 40
      value.innerText = 40 + "%"
      this.set_styles()
    })
    s50.addEventListener('click', () => {
      this.text_width = 50
      slider.value = 50
      value.innerText = 50 + "%"
      this.set_styles()
    })
    
    value.innerText = this.text_width
    s30.innerText = 30 + "%"
    s40.innerText = 40 + "%"
    s50.innerText = 50 + "%"
    
    s40.click()
    
    ui.classList.add('samlibReader', 'controls', 'widthControl')
    buttonbox.classList.add('samlibReader', 'controls', 'buttonbox')
    sliderbox.classList.add('samlibReader', 'controls', 'sliderbox')
    preview.classList.add('samlibReader', 'previewBox')
    
    return ui
  }
  create_font_control() {
    let ui = document.createElement('div')
    let family_box = document.createElement('div')
    let size_box = document.createElement('div')
    let family_selector = document.createElement('select')
    let family_input = document.createElement('input')
    let size_minus = document.createElement('button')
    let size_plus = document.createElement('button')
    let size_value = document.createElement('a')
    
    ui.append(family_box, size_box)
    family_box.append(family_selector, family_input)
    size_box.append(size_minus, size_value, size_plus)
    
    ui.classList.add('samlibReader', 'controls', 'fontControl')
    family_box.classList.add('samlibReader', 'controls', 'familyBox')
    size_box.classList.add('samlibReader', 'controls', 'sizeBox')
    
    let options = ["verdana", "arial", "roboto", "roboto condensed", "собственный"]
    options.forEach(optionText => {
      let option = document.createElement('option')
      option.text = optionText
      family_selector.add(option)
    })
    
    family_selector.addEventListener('input', () => {
      if(family_selector.selectedIndex != options.length-1){
        this.text_font = options[family_selector.selectedIndex]
        family_input.style.setProperty('display', "none")
        this.set_styles()
      } else {
        this.text_font = family_input.value
        family_input.style.setProperty('display', "block")
        this.set_styles()
      }
    })
    family_input.addEventListener('input', () => {
      this.text_font = family_input.value
      this.set_styles()
    })
    size_plus.addEventListener('click', () => {
      this.text_size += 1
      size_value.innerText = this.text_size
      this.set_styles()
    })
    size_minus.addEventListener('click', () => {
      this.text_size -= 1
      size_value.innerText = this.text_size
      this.set_styles()
    })
    
    family_input.style.setProperty('display', "none")
    size_plus.innerText = "+"
    size_minus.innerText = "−"
    size_value.innerText = this.text_size
    
    return ui
  }
  create_list_block(text) {
    let ui = document.createElement('div')
    let input = document.createElement('input')
    let label = document.createElement('label')
    
    label.innerText = text
    input.setAttribute('type', "checkbox")
    ui.append(input, label)
    
    ui.classList.add('samlibReader', 'controls', 'listBlock')
    
    ui.addEventListener('click', () => {
      if(ui.classList.contains('active')) {
        ui.classList.remove('active')
        input.checked = false
      } else {
        ui.classList.add('active')
        input.checked = true
      }
    })
    
    return ui
  }
  
  /* Создаём блок стилей */
  init_styles() {
    this.styles = document.createElement('style')
    
    this.controls_width = 40
    this.controls_height = 40
    this.controls_height_d = 40
    this.controls_content_width = 400
    this.background_color = "#212127"
    this.text_width = 100
    this.text_font = "verdana"
    this.text_size = 18
    this.font_font = ""
    this.font_size = ""
    this.font_color = ""
    this.font_bgcolor = ""
    this.font_align = ""
    this.link_color = "#A4A4AA"
    this.link_color_v = "#FEE6FB"
    
    this.body_bgcolor = ""
    this.body_color = ""
    this.body_link_color = ""
    this.body_link_color_v = ""
    
    this.set_styles()
  }
  set_styles() {
    this.styles.innerHTML = `
      body{
        background-color: ${this.body_bgcolor};
        color: ${this.body_color};
      }
      a[href] {
        color: ${this.body_link_color};
      }
      a[href]:visited {
        color: ${this.body_link_color_v};
      }
      font[color="#555555"] {
        color: ${this.body_color};
      }
      .samlibReader.mainContainer{
        display: flex;
        flex-direction: column;
      }
      .samlibReader.subContainer{
        font-family: ${this.text_font};
        font-size: ${this.text_size};
        background-color: ${this.background_color};
        color: wheat;
        display: flex;
        flex-direction: row;
        position: relative;
      }
      .samlibReader a[href]{
        color: ${this.link_color};
      }
      .samlibReader a[href]:visited{
        color: ${this.link_color_v};
      }
      .samlibReader font{
        color: ${this.font_color};
        font-size: ${this.font_size};
        font-family: ${this.font_font};
      }
      .samlibReader.newElement{
        margin: 0 auto 0 auto;
        text-align: justify;
        width: ${this.text_width}vw;
        padding-right: ${this.controls_width}px;
      }
      .samlibReader.newElement *{
        font-family: ${this.font_font};
        font-size: ${this.font_size};
        background-color: ${this.font_bgcolor};
        color: ${this.font_color};
        text-align: ${this.font_align};
        overflow-wrap: break-word;
      }
      .samlibReader.newElement img{
        max-width: 100%;
        height: auto;
      }
      .samlibReader.previewBox{
        display: none;
        box-sizing: border-box;
        left: ${this.controls_width}px;
        right: 0px;
        margin: auto;
        pointer-events: none;
        position: absolute;
        border: 5px solid cyan;
        border-style: solid;
        border-color: cyan;
        border-width: 0px 5px 0px 5px;
        height: 100%;
      }
      .samlibReader.controls > * {
        font-family: Segoe UI;
        font-size: 14px;
        color: white;
        user-select: none;
        margin: 1px;
      }
      .samlibReader.controls{
        width: ${this.controls_width}px;
      }
      .samlibReader.controls > button {
        height: 20px;
        border-width: 1px 1px 0px 1px;
        border-style: solid;
        border-color: white;
        background-color: transparent;
        border-radius: 5px;
      }
      .samlibReader.controls > button:hover {
        border-width: 2px 2px 0px 2px;
      }
      .samlibReader.controls > button:active {
        border-width: 2px 2px 0px 2px;
        background-color: rgba(255,255,255,0.2);
      }
      .samlibReader.controlsContainer{
        width: ${this.controls_width}px;
        position: sticky;
        top: 30%;
        display: flex;
        flex-direction: row;
      }
      .samlibReader.controlsOverlay{
        width: ${this.controls_width}px;
        height: ${this.controls_height}px;
        
        border-color: white;
        border-width: 1px 1px 1px 1px;
        border-style: solid;
        border-radius: 15px 15px 15px 15px;
        
        font-size: ${this.controls_width - 10}px;
        text-align: center;
      }
      .samlibReader.controlsOverlay:hover{
        background-color: rgba(255,255,255,0.1);
      }
      .samlibReader.controlsOverlay.active{
        height: ${this.controls_height - 2}px;
        
        border-color: white;
        border-width: 1px 0px 1px 1px;
        border-style: solid;
        border-radius: 15px 0px 0px 15px;
      }
      .samlibReader.controlsContent{
        width: ${this.controls_content_width}px;
        background-color: ${this.background_color};
        position: absolute;
        left: ${this.controls_width}px;
        
        display: none;
        flex-direction: column;
        
        border-color: white;
        border-width: 1px 1px 1px 0px;
        border-style: solid;
        border-radius: 0px 15px 15px 0px;
      }
      .samlibReader.controls.widthControl{
        width: ${this.controls_content_width}px;
        display: flex;
        flex-direction: column;
      }
      .samlibReader.controls.buttonbox{
        display: flex;
        flex-direction: row;
      }
      .samlibReader.controls.sliderbox{
        width: ${this.controls_content_width}px;
        display: flex;
        flex-direction: row;
      }
      .samlibReader.controls.sliderbox > input{
        flex-grow: 1;
      }
      .samlibReader.controls.sliderbox > a{
        margin: 0px 2px 0px 2px;
      }
      .samlibReader.controls.fontControl{
        width: ${this.controls_content_width}px;
        display: flex;
        flex-direction: column;
      }
      .samlibReader.controls.familyBox{
        display: flex;
        flex-direction: row;
      }
      .samlibReader.controls.familyBox > * {
        color: black;
      }
      .samlibReader.controls.sizeBox{
        display: flex;
        flex-direction: row;
      }
      .samlibReader.controls.listBlock{
        width: ${this.controls_content_width}px;
        display: flex;
        flex-direction: row;
        white-space: nowrap;
      }
      .samlibReader.controls.listBlock:hover{
        text-decoration: underline;
      }
      .samlibReader.controls.listBlock.active{
        text-decoration: underline;
      }
      .samlibReader.controls.listBlock > input{
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 20px;
        background-color: transparent;
        border-style: solid;
        border-width: 1px 1px 0px 1px;
        border-color: white;
      }
      .samlibReader.controls.listBlock > input:hover{
        border-width: 2px 2px 0px 2px;
      }
      .samlibReader.controls.listBlock > input:checked{
        border-width: 2px 2px 0px 2px;
        background-color: #005CC8;
      }
    `
  }
}


function main() {
  let mRef = /http:\/\/(zhurnal\.lib\.ru|samlib\.ru|budclub\.ru)\/.\/.+\/.+\.shtml/
  let exRef = /http:\/\/(zhurnal\.lib\.ru|samlib\.ru|budclub\.ru)\/.\/.+\/(index|stat).+\.shtml/
  let currRef = window.location.href
  
  if (mRef.test(currRef) && !exRef.test(currRef)) {
    let a = new samlibReader()
  }  
}

document.addEventListener("DOMContentLoaded", main())