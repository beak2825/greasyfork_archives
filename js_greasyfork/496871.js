// ==UserScript==
// @name        bangumi-comment-enhance
// @version     0.2.7.1
// @description Improve comment reading experience, hide certain comments, sort featured comments by reaction count or reply count, and more.
// @author      Flynn Cao
// @namespace   https://flynncao.uk/
// @match       https://bangumi.tv/*
// @match       https://chii.in/*
// @match       https://bgm.tv/*
// @include     /^https?:\/\/(((fast\.)?bgm\.tv)|chii\.in|bangumi\.tv)*/
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/496871/bangumi-comment-enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/496871/bangumi-comment-enhance.meta.js
// ==/UserScript==
'use strict'

class CustomCheckboxContainer {
  constructor(id, label, checked) {
    this.id = id
    this.label = label
    this.checked = checked
    this.input = null
  }

  createElement() {
    if (this.element) {
      return this.element
    }
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.id = this.id
    checkbox.checked = this.checked
    this.input = checkbox
    return checkbox
  }

  createLabel() {
    const label = document.createElement('label')
    label.htmlFor = this.id
    label.textContent = this.label
    return label
  }

  getContainer() {
    const container = document.createElement('div')
    container.className = 'checkbox-container'
    container.append(this.createElement())
    container.append(this.createLabel())
    return container
  }

  getInput() {
    return this.input
  }
}

// https://www.iconfont.cn/collections/detail?spm=a313x.user_detail.i1.dc64b3430.57e63a81itWm4A&cid=12086
const Icons = {
  eyeOpen:
    '<svg t="1747629142037" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1338" width="256" height="256"><path d="M947.6 477.1c-131.1-163.4-276.3-245-435.6-245s-304.5 81.7-435.6 245c-16.4 20.5-16.4 49.7 0 70.1 131.1 163.4 276.3 245 435.6 245s304.5-81.7 435.6-245c16.4-20.4 16.4-49.6 0-70.1zM512 720c-130.6 0-251.1-67.8-363.5-207.8 112.4-140 232.9-207.8 363.5-207.8s251.1 67.8 363.5 207.8C763.1 652.2 642.6 720 512 720z" fill="#333333" p-id="1339"></path><path d="M512 592c44.1 0 79.8-35.7 79.8-79.8 0-44.1-35.7-79.8-79.8-79.8-44.1 0-79.8 35.7-79.8 79.8-0.1 44.1 35.7 79.8 79.8 79.8z m0 72c-83.8 0-151.8-68-151.8-151.8 0-83.8 68-151.8 151.8-151.8 83.8 0 151.8 68 151.8 151.8 0 83.8-68 151.8-151.8 151.8z m0 0" fill="#333333" p-id="1340"></path></svg>',
  newest:
    '<svg t="1747628315444" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1861" width="256" height="256"><path d="M512.736 992a483.648 483.648 0 0 1-164.672-28.8 36.88 36.88 0 1 1 25.104-69.36 407.456 407.456 0 1 0-184.608-136.512A36.912 36.912 0 0 1 129.488 801.6a473.424 473.424 0 0 1-97.472-290A480 480 0 1 1 512.736 992z" fill="#5F5F5F" p-id="1862"></path><path d="M685.6 638.592a32 32 0 0 1-14.032-2.96l-178.048-73.888a36.8 36.8 0 0 1-22.912-34.016V236.672a36.944 36.944 0 1 1 73.888 0v266.72l155.2 64.272a36.336 36.336 0 0 1 19.952 48 37.616 37.616 0 0 1-34.048 22.928z" fill="#5F5F5F" p-id="1863"></path></svg>',
  answerSheet:
    '<svg t="1741855047626" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2040" width="256" height="256"><path d="M188.8 135.7c-29.7 0-53.8 24.1-53.8 53.7v644.7c0 29.7 24.1 53.7 53.8 53.7h645.4c29.7 0 53.8-24.1 53.8-53.7V189.4c0-29.7-24.1-53.7-53.8-53.7H188.8z m-13-71.1h671.5c61.8 0 111.9 50.1 111.9 111.8v670.8c0 61.7-50.1 111.8-111.9 111.8H175.8C114 959 63.9 909 63.9 847.2V176.4c0-61.8 50.1-111.8 111.9-111.8z m0 0" fill="#333333" p-id="2041"></path><path d="M328 328h-88c-19.8 0-36-16.2-36-36s16.2-36 36-36h88c19.8 0 36 16.2 36 36s-16.2 36-36 36zM556 332h-88c-19.8 0-36-16.2-36-36s16.2-36 36-36h88c19.8 0 36 16.2 36 36s-16.2 36-36 36zM784 332h-88c-19.8 0-36-16.2-36-36s16.2-36 36-36h88c19.8 0 36 16.2 36 36s-16.2 36-36 36z" fill="#333333" p-id="2042"></path><path d="M328 546h-88c-19.8 0-36-16.2-36-36s16.2-36 36-36h88c19.8 0 36 16.2 36 36s-16.2 36-36 36zM556 550h-88c-19.8 0-36-16.2-36-36s16.2-36 36-36h88c19.8 0 36 16.2 36 36s-16.2 36-36 36zM784 550h-88c-19.8 0-36-16.2-36-36s16.2-36 36-36h88c19.8 0 36 16.2 36 36s-16.2 36-36 36z" fill="#333333" p-id="2043"></path><path d="M328 764h-88c-19.8 0-36-16.2-36-36s16.2-36 36-36h88c19.8 0 36 16.2 36 36s-16.2 36-36 36zM556 768h-88c-19.8 0-36-16.2-36-36s16.2-36 36-36h88c19.8 0 36 16.2 36 36s-16.2 36-36 36zM784 768h-88c-19.8 0-36-16.2-36-36s16.2-36 36-36h88c19.8 0 36 16.2 36 36s-16.2 36-36 36z" fill="#333333" p-id="2044"></path></svg>',
  sorting:
    '<svg t="1741855109866" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2338" width="256" height="256"><path d="M375 898c-19.8 0-36-16.2-36-36V162c0-19.8 16.2-36 36-36s36 16.2 36 36v700c0 19.8-16.2 36-36 36z" fill="#333333" p-id="2339"></path><path d="M398.2 889.6c-15.2 12.7-38 10.7-50.7-4.4L136.6 633.9c-12.7-15.2-10.7-38 4.4-50.7 15.2-12.7 38-10.7 50.7 4.4l210.8 251.3c12.8 15.2 10.8 38-4.3 50.7zM649 126c19.8 0 36 16.2 36 36v700c0 19.8-16.2 36-36 36s-36-16.2-36-36V162c0-19.8 16.2-36 36-36z" fill="#333333" p-id="2340"></path><path d="M625.8 134.4c15.2-12.7 38-10.7 50.7 4.4l210.8 251.3c12.7 15.2 10.7 38-4.4 50.7-15.2 12.7-38 10.7-50.7-4.4L621.4 185.1c-12.7-15.2-10.7-38 4.4-50.7z" fill="#333333" p-id="2341"></path></svg>',
  font: '<svg t="1741855156691" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2635" width="256" height="256"><path d="M859 201H165c-19.8 0-36-16.2-36-36s16.2-36 36-36h694c19.8 0 36 16.2 36 36s-16.2 36-36 36z" fill="#585757" p-id="2636"></path><path d="M476 859V165c0-19.8 16.2-36 36-36s36 16.2 36 36v694c0 19.8-16.2 36-36 36s-36-16.2-36-36z" fill="#585757" p-id="2637"></path></svg>',
  gear: '<svg t="1741861365461" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2783" data-darkreader-inline-fill="" width="256" height="256"><path d="M594.9 64.8c36.8-0.4 66.9 29.1 67.3 65.9v7.8c0 38.2 31.5 69.4 70.2 69.4 12.3 0 24.5-3.3 35-9.3l7.1-4.1c10.3-5.9 22.1-9 33.9-9 23.9 0 46.2 12.5 58.3 32.8L949.9 359c18.7 31.6 7.6 71.9-24.6 90.1l-6.9 3.9c-34 19.2-45.7 61.2-26.4 93.8 6.1 10.3 14.9 18.9 25.4 24.8l7 3.9c32.3 18 43.6 58.5 24.8 90.2L866 806.3c-9.1 15.2-23.8 26.2-41 30.6-17.1 4.4-35.3 2.2-50.7-6.4l-7-3.9c-21.9-12.2-48.5-12.4-70.6-0.4-10.7 5.9-19.7 14.5-25.9 25-6.1 10.4-9.4 22.1-9.3 33.8v7.8c0.1 17.8-7.2 34.7-20 47.1-12.6 12.2-29.6 19-47.2 19H428c-36.6 0.3-66.7-29-67.2-65.5l-0.1-7.8c-0.1-18.4-7.6-36-20.8-48.8-22.5-22-56.9-26.5-84.3-10.9l-7 4.1c-10.3 5.8-22 8.9-33.8 8.9-23.9 0-46.1-12.4-58.2-32.8L73.2 665.2c-8.9-15.1-11.3-33.2-6.7-50.1 4.6-16.9 15.8-31.3 31.2-39.8l6.8-3.9c16.2-9 28.2-24.2 33.1-42.1 4.9-17.4 2.4-36.1-6.9-51.6-6.2-10.4-15.1-19-25.7-24.9l-6.9-3.9c-15.5-8.4-27-22.8-31.7-39.8-4.7-17-2.3-35.2 6.7-50.4L156.3 218c9-15.1 23.8-26.2 41-30.6 17.1-4.4 35.3-2.1 50.7 6.5l7.1 3.9c21.9 12.3 48.6 12.5 70.7 0.5 10.8-5.9 19.8-14.6 26-25.1 6.1-10.4 9.3-22.2 9.2-34.1v-7.9c-0.2-17.8 7-34.8 19.8-47.2 12.6-12.3 29.7-19.1 47.5-19.1h166.6z m-163.2 71c-3.1 0-6.1 1.2-8.4 3.3-1.9 1.8-2.9 4.2-2.9 6.8l0.1 7.6c0.2 21.2-5.4 42-16.3 60.3a120.02 120.02 0 0 1-45.2 43.7c-37.4 20.4-82.6 20.2-119.7-0.7l-6.8-3.8c-2.8-1.6-6.1-2-9.2-1.2-2.8 0.7-5.3 2.5-6.8 5l-80 135.1c-2.7 4.5-1.1 10.2 4.1 13l6.7 3.7c18.6 10.3 34 25.3 44.7 43.4 16.3 27.6 20.6 59.9 12.1 90.8-8.5 30.8-29 56.9-56.9 72.5l-6.6 3.7c-5 2.9-6.6 8.5-3.9 12.9l80 135.1c1.9 3.2 5.7 5.3 10 5.3 2.1 0 4.3-0.5 6.1-1.6l6.8-3.8c18.1-10.3 38.8-15.8 59.9-15.8 31.8 0 62 12.3 84.7 34.4 23 22.5 35.9 52.6 36 84.7v7.5c0 5.2 4.9 9.9 11.3 9.9h160c3.2 0 6.2-1.2 8.3-3.3 1.8-1.7 2.9-4.2 2.9-6.7v-7.5c-0.1-20.9 5.6-41.6 16.4-59.8 10.8-18.3 26.4-33.4 45.1-43.7 37.3-20.4 82.4-20.2 119.5 0.6l6.7 3.8c2.8 1.5 6.1 1.9 9.2 1.1 2.8-0.7 5.3-2.5 6.8-5l80-135c2.7-4.5 1.1-10.2-4-13l-6.7-3.7c-18.4-10.2-33.7-25.2-44.4-43.3-33.8-57.1-13.4-130.5 45-163.5l6.6-3.7c5.1-2.9 6.6-8.5 3.9-13l-79.9-135.1c-2.2-3.4-6-5.4-10-5.3-2.1 0-4.3 0.5-6.1 1.6l-6.8 3.8c-18.3 10.5-39.1 16-60.2 16-66.5 0.2-120.6-53.5-120.8-119.9v-7.5c0-5.3-4.8-10-11.3-10l-160 0.3z m-3.4-15.5" p-id="2784"></path><path d="M512 584c39.8 0 72-32.2 72-72s-32.2-72-72-72-72 32.2-72 72 32.2 72 72 72z m0 72c-79.5 0-144-64.5-144-144s64.5-144 144-144 144 64.5 144 144-64.5 144-144 144z m0 0" p-id="2785"></path></svg>',
}

const NAMESPACE = 'BangumiCommentEnhance'

// eslint-disable-next-line unicorn/no-static-only-class
class Storage {
  static set(key, value) {
    localStorage.setItem(`${NAMESPACE}_${key}`, JSON.stringify(value))
  }

  static get(key) {
    const value = localStorage.getItem(`${NAMESPACE}_${key}`)
    return value ? JSON.parse(value) : undefined
  }

  static async init(settings) {
    const keys = Object.keys(settings)
    for (const key of keys) {
      const value = Storage.get(key)
      if (value === undefined) {
        Storage.set(key, settings[key])
      }
    }
  }
}

// create a noname header, emit a even to control the movement of whole setting dialog when dragging this header

const createNonameHeader = () => {
  const nonameHeader = document.createElement('div')
  nonameHeader.className = 'padding-row'
  nonameHeader.addEventListener('mousedown', (event) => {
    event.preventDefault()

    const container = event.target.parentElement

    // Store initial positions
    const startX = event.clientX
    const startY = event.clientY
    const startLeft = Number.parseInt(window.getComputedStyle(container).left) || 0
    const startTop = Number.parseInt(window.getComputedStyle(container).top) || 0

    // When we start dragging, remove the centering transform
    if (container.style.transform.includes('translate')) {
      const rect = container.getBoundingClientRect()
      container.style.transform = 'none'
      container.style.left = `${rect.left}px`
      container.style.top = `${rect.top}px`
    }

    const handleMouseMove = (event) => {
      // Calculate how far the mouse has moved
      const deltaX = event.clientX - startX
      const deltaY = event.clientY - startY

      // Apply that delta to the original position
      const newLeft = startLeft + deltaX
      const newTop = startTop + deltaY

      // Get container dimensions
      const containerWidth = container.offsetWidth
      const containerHeight = container.offsetHeight

      // Check if new position would be outside viewport
      if (
        newLeft < containerWidth / 2 ||
        newTop < containerHeight / 2 ||
        newLeft + containerWidth / 2 > window.innerWidth ||
        newTop + containerHeight / 2 > window.innerHeight
      ) {
        // Cancel the movement by not updating position
        return
      }

      // If we get here, the position is safe, so update it
      container.style.left = `${newLeft}px`
      container.style.top = `${newTop}px`
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', handleMouseMove)
    })
  })
  return nonameHeader
}

var styles =
  '.fixed-container {\r\n  position: fixed;\r\n  z-index: 100;\r\n  width: calc(100vw - 50px);\r\n  max-width: 380px;\r\n  background-color: rgba(255, 255, 255, 0.8);\r\n  backdrop-filter: blur(8px);\r\n  left: 50%;\r\n  top: 50%;\r\n  transform: translate(-50%, -50%);\r\n  border-radius: 12px;\r\n  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);\r\n  padding: 30px;\r\n  padding-top: 0px;\r\n  text-align: center;\r\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;\r\n  box-sizing: border-box;\r\n  display: none;\r\n}\r\n\r\n[data-theme="dark"] .fixed-container {\r\n  background-color: rgba(30, 30, 30, 0.8);\r\n  color: #fff;\r\n}\r\n\r\n.padding-row{\r\n\twidth:100%;\r\n\theight:40px;\r\n}\r\n\r\n.dropdown-group {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n  margin-bottom: 16px;\r\n}\r\n\r\n.dropdown-select {\r\n  padding: 8px;\r\n  padding-right: 16px;\r\n  border-radius: 6px;\r\n  border: 1px solid #e2e2e2;\r\n  background-color: #f5f5f5;\r\n  font-size: 14px;\r\n  width: 100%;\r\n}\r\n\r\n[data-theme="dark"] .dropdown-select {\r\n  background-color: #333;\r\n  border-color: #555;\r\n  color: #fff;\r\n}\r\n\r\n.checkbox-container {\r\n  display: flex;\r\n  align-items: center;\r\n  margin-bottom: 16px;\r\n  text-align: left;\r\n  font-size: 14px;\r\n}\r\n\r\n.checkbox-container input[type="checkbox"] {\r\n  margin-right: 12px;\r\n  transform: translateY(1.5px);\r\n}\r\n\r\n.input-group {\r\n  display: flex;\r\n  align-items: center;\r\n  margin-bottom: 16px;\r\n  justify-content: flex-start;\r\n}\r\n\r\n.input-group label {\r\n  text-align: left;\r\n  font-size: 14px;\r\n  margin-right: 8px;\r\n}\r\n\r\n.input-group input {\r\n  max-width: 40px;\r\n  padding: 6px;\r\n  border-radius: 6px;\r\n  border: 1px solid #e2e2e2;\r\n  text-align: center;\r\n}\r\n\r\n[data-theme="dark"] .input-group input {\r\n  background-color: #333;\r\n  border-color: #555;\r\n  color: #fff;\r\n}\r\n\r\n.button-group {\r\n  display: flex;\r\n  justify-content: space-between;\r\n  gap: 12px;\r\n}\r\n\r\n.button-group button {\r\n  flex: 1;\r\n  padding: 10px;\r\n  border-radius: 6px;\r\n  border: none;\r\n  font-size: 16px;\r\n  cursor: pointer;\r\n}\r\n\r\n.cancel-btn {\r\n  background-color: white;\r\n  border: 1px solid #e2e2e2;\r\n}\r\n\r\n[data-theme="dark"] .cancel-btn {\r\n  background-color: #333;\r\n  border-color: #555;\r\n  color: #fff;\r\n}\r\n\r\n.save-btn {\r\n  background-color: #333;\r\n  color: white;\r\n}\r\n\r\n[data-theme="dark"] .save-btn {\r\n  background-color: #555;\r\n}\r\n\r\nbutton:hover {\r\n  filter: brightness(1.5);\r\n  transition: all 0.3s;\r\n}\r\n\r\nstrong svg {\r\n  max-width: 21px;\r\n  max-height: 21px;\r\n  transform: translateY(2px);\r\n  margin-right: 10px;\r\n}\r\n\r\n[data-theme="dark"] strong svg {\r\n  filter: invert(1);\r\n}\r\n\r\ninput[type="checkbox"] {\r\n  width: 20px;\r\n  height: 20px;\r\n  margin: 0;\r\n  cursor: pointer;\r\n}\r\n'

function createSettingMenu(userSettings, episodeMode = false) {
  const injectStyles = () => {
    const styleEl = document.createElement('style')
    styleEl.textContent = styles
    document.head.append(styleEl)
  }

  const createSettingsDialog = () => {
    const container = document.createElement('div')
    container.className = 'fixed-container'
    // const nonameHeader = document.createElement('div')
    // nonameHeader.className = 'padding-row'
    const nonameHeader = createNonameHeader()

    const dropdownContainer = document.createElement('div')
    dropdownContainer.className = 'dropdown-group'
    const spacerLeft = document.createElement('div')
    spacerLeft.style.width = '24px'
    const dropdown = document.createElement('select')
    dropdown.className = 'dropdown-select'

    const options = [
      { value: 'reactionCount', text: '按热度(贴贴数)排序' },
      { value: 'newFirst', text: '按时间排序(最新在前)' },
      { value: 'oldFirst', text: '按时间排序(最旧在前)' },
      { value: 'replyCount', text: '按评论数排序' },
    ]

    dropdown.append(
      ...options.map((opt) => {
        const option = document.createElement('option')
        option.value = opt.value
        option.textContent = opt.text
        return option
      }),
    )
    dropdown.value = userSettings.sortMode || 'reactionCount'
    const spacerRight = document.createElement('div')
    spacerRight.style.width = '24px'

    dropdownContainer.append($('<strong></strong>').html(Icons.sorting)[0])
    dropdownContainer.append(dropdown)
    dropdownContainer.append(spacerRight)

    // Create checkbox
    const checkboxContainers = []

    const hidePlainCommentsCheckboxContainer = new CustomCheckboxContainer(
      'hidePlainComments',
      '隐藏普通评论',
      userSettings.hidePlainComments || false,
    )

    const pinMyCommentsCheckboxContainer = new CustomCheckboxContainer(
      'showMine',
      '置顶我发表/回复我的帖子',
      userSettings.stickyMentioned || false,
    )

    const hidePrematureCommentsCheckboxContainer = new CustomCheckboxContainer(
      'hidePremature',
      '隐藏开播前发表的评论',
      userSettings.hidePremature || false,
    )

    checkboxContainers.push(
      hidePlainCommentsCheckboxContainer.getContainer(),
      pinMyCommentsCheckboxContainer.getContainer(),
    )

    if (episodeMode) {
      checkboxContainers.push(hidePrematureCommentsCheckboxContainer.getContainer())
    }

    // Create min effective number int
    const minEffGroup = document.createElement('div')
    minEffGroup.className = 'input-group'

    const minEffLabel = document.createElement('label')
    minEffLabel.htmlFor = 'minEffectiveNumber'
    minEffLabel.textContent = '最低有效字数 (>=0)'

    const minEffInput = document.createElement('input')
    minEffInput.type = 'number'
    minEffInput.id = 'minEffectiveNumber'
    minEffInput.value = userSettings.minimumFeaturedCommentLength || 0

    minEffGroup.append($('<strong></strong>').html(Icons.font)[0])
    minEffGroup.append(minEffLabel)
    minEffGroup.append(minEffInput)

    // Create max selected posts input
    const maxPostsGroup = document.createElement('div')
    maxPostsGroup.className = 'input-group'

    const maxPostsLabel = document.createElement('label')
    maxPostsLabel.htmlFor = 'maxSelectedPosts'
    maxPostsLabel.textContent = '最大精选评论数 (>0)'

    const maxPostsInput = document.createElement('input')
    maxPostsInput.type = 'number'
    maxPostsInput.id = 'maxSelectedPosts'
    maxPostsInput.value = userSettings.maxFeaturedComments || 1

    maxPostsGroup.append($('<strong></strong>').html(Icons.answerSheet)[0])
    maxPostsGroup.append(maxPostsLabel)
    maxPostsGroup.append(maxPostsInput)

    const spaceHr = document.createElement('hr')
    spaceHr.style.marginBottom = '16px'
    spaceHr.style.border = 'none'

    // Create buttons
    const buttonGroup = document.createElement('div')
    buttonGroup.className = 'button-group'

    const cancelBtn = document.createElement('button')
    cancelBtn.className = 'cancel-btn'
    cancelBtn.textContent = '取消'

    const saveBtn = document.createElement('button')
    saveBtn.className = 'save-btn'
    saveBtn.textContent = '保存'

    buttonGroup.append(cancelBtn)
    buttonGroup.append(saveBtn)

    // Assemble everything
    container.append(nonameHeader)
    container.append(dropdownContainer)
    container.append(minEffGroup)
    container.append(maxPostsGroup)
    container.append(...checkboxContainers)
    container.append(spaceHr)
    container.append(buttonGroup)

    // Add to document
    document.body.append(container)

    return {
      container,
      dropdown,
      pinMyCommentsCheckboxContainer,
      hidePlainCommentsCheckboxContainer,
      hidePrematureCommentsCheckboxContainer,
      minEffInput,
      maxPostsInput,
      cancelBtn,
      saveBtn,
    }
  }
  // Initialize settings from localStorage
  const initSettings = (elements) => {
    const {
      dropdown,
      pinMyCommentsCheckboxContainer,
      hidePlainCommentsCheckboxContainer,
      hidePrematureCommentsCheckboxContainer,
      minEffInput,
      maxPostsInput,
    } = elements

    if (localStorage.getItem('sortBy')) {
      dropdown.value = localStorage.getItem('sortBy')
    }

    if (localStorage.getItem('showMine') !== null) {
      pinMyCommentsCheckboxContainer.getInput().checked =
        localStorage.getItem('showMine') === 'true'
    }

    if (localStorage.getItem('hidePremature') !== null) {
      hidePrematureCommentsCheckboxContainer.getInput().checked =
        localStorage.getItem('hidePremature') === 'true'
    }

    if (localStorage.getItem('hidePlainComments') !== null) {
      hidePlainCommentsCheckboxContainer.getInput().checked =
        localStorage.getItem('hidePlainComments') === 'true'
    }

    if (localStorage.getItem('minEffectiveNumber')) {
      minEffInput.value = localStorage.getItem('minEffectiveNumber')
    }

    if (localStorage.getItem('maxSelectedPosts')) {
      maxPostsInput.value = localStorage.getItem('maxSelectedPosts')
    }
  }

  // Save settings
  const saveSettings = (elements) => {
    const {
      container,
      dropdown,
      pinMyCommentsCheckboxContainer,
      hidePrematureCommentsCheckboxContainer,
      hidePlainCommentsCheckboxContainer,
      minEffInput,
      maxPostsInput,
    } = elements

    Storage.set(
      'minimumFeaturedCommentLength',
      Math.max(Number.parseInt(minEffInput.value) || 0, 0),
    )
    Storage.set(
      'maxFeaturedComments',
      Number.parseInt(maxPostsInput.value) > 0 ? Number.parseInt(maxPostsInput.value) : 1,
    )

    Storage.set('hidePlainComments', hidePlainCommentsCheckboxContainer.getInput().checked)
    Storage.set('stickyMentioned', pinMyCommentsCheckboxContainer.getInput().checked)
    Storage.set('sortMode', dropdown.value)
    Storage.set('stickyMentioned', pinMyCommentsCheckboxContainer.getInput().checked)

    if (episodeMode) {
      Storage.set('hidePremature', hidePrematureCommentsCheckboxContainer.getInput().checked)
    }

    // Trigger custom event
    const event = new CustomEvent('settingsSaved')
    document.dispatchEvent(event)

    // jQuery compatibility
    if (window.jQuery) {
      jQuery(document).trigger('settingsSaved')
    }

    hideDialog(container)
  }

  // Show dialog
  const showDialog = (container) => {
    container.style.display = 'block'
  }

  // Hide dialog
  const hideDialog = (container) => {
    container.style.display = 'none'
  }

  // Main initialization function
  const init = () => {
    // Inject the styles
    injectStyles()
    // Create the dialog
    const elements = createSettingsDialog()
    // Initialize settings
    initSettings(elements)

    // Setup event listeners
    elements.saveBtn.addEventListener('click', () => saveSettings(elements))
    elements.cancelBtn.addEventListener('click', () => hideDialog(elements.container))

    // // Add window resize handler to center the dialog when window is resized
    // window.addEventListener('resize', () => {
    //   if (elements.container.style.display === 'block') {
    //     elements.container.style.left = '50%'
    //     elements.container.style.top = '50%'
    //     elements.container.style.transform = 'translate(-50%, -50%)'
    //   }
    // })

    // Expose API
    window.BCE.settingsDialog = {
      show: () => showDialog(elements.container),
      hide: () => hideDialog(elements.container),
      save: () => saveSettings(elements),
      getElements: () => elements,
    }
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
}

const BGM_EP_REGEX = /^https:\/\/(((fast\.)?bgm\.tv)|(chii\.in)|(bangumi\.tv))\/ep\/\d+/
const BGM_GROUP_REGEX =
  /^https:\/\/(((fast\.)?bgm\.tv)|(chii\.in)|(bangumi\.tv))\/group\/topic\/\d+/

// quickSort is not strictly needed cause JavaScript has built-in sort method based on quicksort/selection algorithm
function quickSort(arr, sortKey, changeCompareDirection = false) {
  if (arr.length <= 1) {
    return arr
  }
  const pivot = arr[0]
  const left = []
  const right = []
  for (let i = 1; i < arr.length; i++) {
    const element = arr[i]
    const elementImportant = element.important || false
    const pivotImportant = pivot.important || false
    let compareResult

    if (elementImportant !== pivotImportant) {
      compareResult = elementImportant // true if element is important and pivot is not
    } else if (changeCompareDirection) {
      compareResult = element[sortKey] < pivot[sortKey]
    } else {
      compareResult = element[sortKey] > pivot[sortKey]
    }

    if (compareResult) {
      left.push(element)
    } else {
      right.push(element)
    }
  }
  return quickSort(left, sortKey, changeCompareDirection).concat(
    pivot,
    quickSort(right, sortKey, changeCompareDirection),
  )
}
function purifiedDatetimeInMillionSeconds(timestamp) {
  return new Date(timestamp.trim().replace('- ', '')).getTime()
}

function processComments(userSettings) {
  // check if the target element is valid
  const username = $('.idBadgerNeue .avatar').attr('href')
    ? $('.idBadgerNeue .avatar').attr('href').split('/user/')[1]
    : ''
  const preservedPostID =
    $(location).attr('href').split('#').length > 1 ? $(location).attr('href').split('#')[1] : null
  const allCommentRows = $('.row.row_reply.clearit')
  let plainCommentsCount = 0
  const featuredCommentsCount = 0
  let prematureCommentsCount = 0
  const minimumContentLength = userSettings.minimumFeaturedCommentLength
  const container = $('#comment_list')
  const plainCommentElements = []
  const featuredCommentElements = []
  const lastRow = allCommentRows.last()
  let preservedRow = null
  let isLastRowFeatured = false

  // Get first broadcast time for episode pages
  let firstBroadcastDate = null
  if (BGM_EP_REGEX.test(location.href) && userSettings.hidePremature) {
    try {
      const broadcastTimeMatch = document
        .querySelectorAll('.tip')[0]
        .innerHTML.match(/\d{4}-\d{1,2}-\d{1,2}/)
      if (broadcastTimeMatch && broadcastTimeMatch[0]) {
        const dateParts = broadcastTimeMatch[0].split('-')
        firstBroadcastDate = new Date(
          Number.parseInt(dateParts[0]),
          Number.parseInt(dateParts[1]) - 1, // Month is 0-indexed in JS
          Number.parseInt(dateParts[2]),
        )
        firstBroadcastDate.setHours(0, 0, 0, 0) // Set to beginning of the day
      }
    } catch (error) {
      console.error('Error parsing broadcast date:', error)
    }
  }

  allCommentRows.each(function (index, row) {
    const that = $(this)
    const content = $(row)
      .find(BGM_EP_REGEX.test(location.href) ? '.message.clearit' : '.inner')
      .text()

    // Check if comment is before broadcast date
    let isBeforeBroadcast = false
    if (firstBroadcastDate && BGM_EP_REGEX.test(location.href) && userSettings.hidePremature) {
      try {
        const postTimeMatch = that
          .find('.re_info')
          .text()
          .match(/\d{4}-\d{1,2}-\d{1,2}/)
        if (postTimeMatch && postTimeMatch[0]) {
          const postDateParts = postTimeMatch[0].split('-')
          const postDate = new Date(
            Number.parseInt(postDateParts[0]),
            Number.parseInt(postDateParts[1]) - 1,
            Number.parseInt(postDateParts[2]),
          )
          postDate.setHours(0, 0, 0, 0)

          if (postDate < firstBroadcastDate) {
            isBeforeBroadcast = true
            prematureCommentsCount++
          }
        }
      } catch (error) {
        console.error('Error parsing post date:', error)
      }
    }

    let commentScore = 0
    // prioritize @me comments on
    const highlightMentionedColor = '#ff8c00'
    const subReplyContent = that.find('.topic_sub_reply')
    const replyCount = subReplyContent.find('.sub_reply_bg').length
    const mentionedInMainComment =
      userSettings.stickyMentioned &&
      that.find('.avatar').attr('href').split('/user/')[1] === username
    let mentionedInSubReply = false
    if (mentionedInMainComment) {
      that.css('border-color', highlightMentionedColor)
      that.css('border-width', '1px')
      that.css('border-style', 'dashed')
      commentScore += 10000
    }
    that.find(`.topic_sub_reply .sub_reply_bg.clearit`).each(function (index, element) {
      if (userSettings.stickyMentioned && $(element).attr('data-item-user') === username) {
        $(element).css('border-color', highlightMentionedColor)
        $(element).css('border-width', '1px')
        $(element).css('border-style', 'dashed')
        commentScore += 1000
        mentionedInSubReply = true
      }
    })
    const important = mentionedInMainComment || mentionedInSubReply
    that.find('span.num').each(function (index, element) {
      commentScore += Number.parseInt($(element).text())
    })
    const hasPreservedReply = preservedPostID && that.find(`#${preservedPostID}`).length > 0
    if (hasPreservedReply) preservedRow = row
    if (!hasPreservedReply) subReplyContent.hide()
    const timestampArea = that.find('.action').first()
    if (replyCount !== 0) {
      const a = $(
        `<a class="expand_all" href="javascript:void(0)" style="margin:0 3px 0 5px;"><span class="ico ico_reply">展开(+${replyCount})</span></a>`,
      )
      mentionedInSubReply && a.css('color', highlightMentionedColor)
      a.on('click', function () {
        subReplyContent.slideToggle()
      })
      const el = $(`<div class="action"></div>`).append(a)
      timestampArea.after(el)
    }
    // check if this comment meets the requirement of minimumContentLength
    const isShortReply = content.trim().length < minimumContentLength
    let isFeatured = userSettings.sortMode === 'reactionCount' ? commentScore >= 1 : replyCount >= 1
    if (isShortReply || featuredCommentsCount >= userSettings.maxFeaturedComments) {
      isFeatured = false
    }
    // conserved reply must be fixed
    if (hasPreservedReply || important) {
      isFeatured = true
    }

    const timestamp = isFeatured
      ? $(row)
          .find('.action:eq(0) small')
          .first()
          .contents()
          .filter(function () {
            return this.nodeType === 3 // Node.TEXT_NODE === 3
          })
          .first()
          .text()
      : $(row).find('small').text().trim()

    if (isBeforeBroadcast && userSettings.hidePremature) {
      $(row).addClass('premature-comment').hide()
    }

    if (isFeatured) {
      // check if current row is the last row by comparing the id
      if (row.id === lastRow[0].id) {
        isLastRowFeatured = true
      }
      featuredCommentElements.push({
        element: row,
        score: commentScore,
        replyCount,
        timestampNumber: purifiedDatetimeInMillionSeconds(timestamp),
        important,
      })
    } else {
      plainCommentsCount++
      plainCommentElements.push({
        element: row,
        score: commentScore,
        timestamp,
        timestampNumber: purifiedDatetimeInMillionSeconds(timestamp),
      })
    }
  })

  return {
    plainCommentsCount,
    featuredCommentsCount,
    prematureCommentsCount,
    container,
    plainCommentElements,
    featuredCommentElements,
    preservedRow,
    lastRow,
    isLastRowFeatured,
  }
}

;(async function () {
  if (!BGM_EP_REGEX.test(location.href) && !BGM_GROUP_REGEX.test(location.href)) {
    return
  }
  Storage.init({
    hidePlainComments: true,
    minimumFeaturedCommentLength: 15,
    maxFeaturedComments: 99,
    sortMode: 'reactionCount',
    stickyMentioned: false,
    hidePremature: false,
  })
  window.BCE = window.BCE || {}

  const userSettings = {
    hidePlainComments: Storage.get('hidePlainComments'),
    minimumFeaturedCommentLength: Storage.get('minimumFeaturedCommentLength'),
    maxFeaturedComments: Storage.get('maxFeaturedComments'),
    sortMode: Storage.get('sortMode'),
    stickyMentioned: Storage.get('stickyMentioned'),
    hidePremature: Storage.get('hidePremature'),
  }
  const sortModeData = userSettings.sortMode || 'reactionCount'
  /**
   * Process comments and prepare the container
   */
  let {
    plainCommentsCount,
    container,
    plainCommentElements,
    featuredCommentElements,
    preservedRow,
    lastRow,
    isLastRowFeatured,
  } = processComments(userSettings)
  let stateBar = container.find('.row_state.clearit')
  if (stateBar.length === 0) {
    stateBar = $(`<div id class="row_state clearit"></div>`)
  }
  // Create toggle button with appropriate text based on current state
  const toggleButtonText = userSettings.hidePlainComments
    ? `点击展开剩余${plainCommentsCount}条普通评论`
    : `点击折叠${plainCommentsCount}条普通评论`

  const toggleHiddenCommentsInfoText = () => {
    const curText = $(hiddenCommentsInfo).text()
    if (curText.includes('展开')) {
      hiddenCommentsInfo.text(`点击折叠${plainCommentsCount}条普通评论`)
    } else {
      hiddenCommentsInfo.text(`点击展开剩余${plainCommentsCount}条普通评论`)
    }
  }

  const hiddenCommentsInfo = $(
    `<div class="filtered" id="toggleFilteredBtn" style="cursor:pointer;color:#48a2c3;">${toggleButtonText}</div>`,
  ).click(function () {
    const commentList = $('#comment_list_plain')
    commentList.slideToggle()
    toggleHiddenCommentsInfoText()
  })

  stateBar.append(hiddenCommentsInfo)
  container.find('.row').detach()
  const menuBarCSSProperties = {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    transform: 'translate(0, -3px)',
    margin: '0 0 0 5px',
    cursor: 'pointer',
  }
  /**
   * Button event handlers
   */
  const settingBtn = $('<strong></strong>')
    .css(menuBarCSSProperties)
    .html(Icons.gear)
    .attr('title', '设置')
    .click(() => window.BCE.settingsDialog.show())

  const jumpToNewestBtn = $('<strong></strong>')
    .css(menuBarCSSProperties)
    .html(Icons.newest)
    .attr('title', '跳转到最新评论')
    .click(() => {
      $('#comment_list_plain').slideDown()
      hiddenCommentsInfo.text(`点击折叠${plainCommentsCount}条普通评论`)
      // get the target element with the same id as lastRow inside the FeatureElements
      const targetId = lastRow[0].id
      const targetItem = isLastRowFeatured
        ? featuredCommentElements.find((item) => item.element.id === targetId)
        : plainCommentElements.at(-1)
      $('html, body').animate({
        scrollTop: $(targetItem.element).offset().top,
      })
      $(lastRow).css({
        'background-color': '#ffd966',
        transition: 'background-color 0.5s ease-in-out',
      })
      setTimeout(() => {
        $(lastRow).css('background-color', '')
      }, 750)
    })

  const menuBar = $(
    '<h3 style="padding:10px;display:flex;width:100%;align-items:center;">所有精选评论</h3>',
  )

  if (BGM_EP_REGEX.test(location.href)) {
    const showPrematureBtn = $('<strong></strong>')
      .css(menuBarCSSProperties)
      .html(Icons.eyeOpen)
      .attr('title', '显示开播前发表的评论')
      .click(() => {
        $('.premature-comment').toggle()
      })
    menuBar.append(showPrematureBtn)
  }
  menuBar.append(settingBtn)
  menuBar.append(jumpToNewestBtn)
  container.append(menuBar)
  const trinity = {
    reactionCount() {
      featuredCommentElements = quickSort(featuredCommentElements, 'score', false)
    },
    replyCount() {
      featuredCommentElements = quickSort(featuredCommentElements, 'replyCount', false)
    },
    oldFirst() {
      featuredCommentElements = quickSort(featuredCommentElements, 'timestampNumber', true)
    },
    newFirst() {
      featuredCommentElements = quickSort(featuredCommentElements, 'timestampNumber', false)
    },
  }
  trinity[sortModeData]()
  /**
   * Append components
   */
  featuredCommentElements.forEach(function (element) {
    container.append($(element.element))
  })
  plainCommentElements.forEach(function (element) {
    container.append($(element.element))
  })
  container.append(stateBar)
  // Create container for plain comments
  const plainCommentsContainer = $('<div id="comment_list_plain" style="margin-top:2rem;"></div>')

  // Only hide plain comments if the setting is enabled
  if (userSettings.hidePlainComments) {
    plainCommentsContainer.hide()
  }

  // Add plain comments to the container
  plainCommentElements.forEach(function (element) {
    plainCommentsContainer.append($(element.element))
  })

  container.append(plainCommentsContainer)
  // Scroll to conserved row if exists
  if (preservedRow) {
    $('html, body').animate({
      scrollTop: $(preservedRow).offset().top,
    })
  }
  $('#sortMethodSelect').val(sortModeData)
  // Auto-expand plain comments if there are few featured comments and plain comments are hidden
  if (userSettings.hidePlainComments === true) {
    $('#toggleFilteredBtn').click()
  }
  createSettingMenu(userSettings, BGM_EP_REGEX.test(location.href))
  // control center
  $(document).on('settingsSaved', () => {
    location.reload()
  })
})()
