// ==UserScript==
// @name                PoeUI
// @namespace           http://xiaomizha.ltd/
// @version             0.1
// @description         美化Poe网页版UI样式
// @author              xuyou
// @description:en      We embellished the Poe web UI style.
// @description:zh-CN   美化Poe网页版UI样式
// @license             MIT
// @match               https://poe.com/*
// @icon                data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAolBMVEVHcEz6Uvy1QfqUQuefTOPxUPxNVb5GYLh6S9dPVL+2Qvn1UvywQfaLQuONQuP+UfpXRMbQS//8Uvy+QP////+3QPudQeyxQPekQPCUQedZRMeqQfOCQN5iQsxPRcGLQuJHSLvDQ/96QtlyQ9VqQ9DRTf/uV//KR//jVv9GVLbZU//6U/7Oivutfurz6v2YLOy3WfeUb9+/m++zLPvXrfniyfqv1uwAAAAAE3RSTlMA75uUH2/I/WaW66DF68XA6s3NFufBpwAABBtJREFUWIWVl4t2qkoMhqetdmvbfTvIrWItImpVmAr4/q92ZibJ3EA5J6zVtWzN1+TPnwEYc2Mymz//Wb3L+FDxqeJLxo8fz/PZhN2L+VbGSsS7YTgIEfOb6U+FCCIoxMe7IYwiZptiU/iIj6FGRMz6+b82MnoEt41PTXj2839mWTaA6DM0ws3PVGx6iPeeFF8a4fz/9XptGMUtKTw1rf7XMjLB2Jg+toUz0iFXaP3TdK0R/0cKmkUqwydsiGBJ4RO+0D9pehtxe6aSAY6KokjlD/dhzO1XQSU8RREi7CI2Q1L01ZxDAT4hc2sonBoA8YlViP1NksRhZGl1qS7DUXz4WzphM5EPhBQI9eJO1FuPMGOPiQoqgt/NFwS7D8GYs7clEhJVRHQ/f7EonNPm85m9LEWYIqoxwMXMQyL+sKUCaEQzBmhW7kjZMrYIyZgEQoSV6woWx4oAbfBuUXfVcIjZVlVTLzqZbBZEAgDBq3NXL66cRyAH+co9arbXRd1UF0CsNEAioHhOaqY9d6M3oZGC+mBhqPJbyL9yVJNzToiUzK0YxRW+SFIIgCK0IFGXoCu6um44ENZp1tR1B4Bsg3Pa4ppKgGLAr8+JkhOG0aSohMqpsQ8E0JYqQGwAMFK0EwctOXyqYM8NQBGwgtACiMAv0ZKihTI1E/wbnd0sCANFQA1gpGf4hCtGABgIAfC0YQESsAIYKQFwpjcACiEAQLAAsQVQS4oAmCgCyFsSIGMQgKYgEVMzEgFAZwEgDAIbEIOtOlpSGCPvAwSC5VABGalFY13rWnlCumLJpZFoPwiAS8ICIJCVW/RF27ZL66gQzqYzD6wsbaUQsoJcXt8AbsmZsV7TJR16AIDvXWjFWJ7nWMS5u+oSKN86beDslgVcu0bfjjO2zyUCGG0rtv38fScadWLYN1O2V4TcleJO1FzfxRSBlfu9XUQ3BuhITSyClZKw10WcxwAVaKEPLHYsy9IilGOAb+9eyo6SQIh8FFBzM1JJ+Mn+Ho9YxP6/AL7xPkhV/GKvh6ONOKJU5+Hg5Cu8o0dPbHo4HI6mDwB0LW5I0IbiitW1FOaO7fuYyE9mbLI72AgFqDE/oMMCjk3jbWNu8frwoAiIAEBAvrIRgwsSiWek6W5HRQiEBJTGmeqoMITQLAj08SQf03Y7CyEA51zNw4M4jWgl1HPiq00ou27vuRu6GKziER5VTyeDOJRl6bhbMnJbCbsIfFaenmyEdoW9pRYhDvVA9IvP75OHKAcRQRA4iDfzwvDgEA6Ou3M91NCqQuS/2K8sJ4hbCGCIH2Fu1HRfmh4AQIjjwetD90CEF+bFb5dwWwpAvPn5MAtfTE8Ko8W0ny8ddRqRgop4HExXVXhSeH2Ao26ny5hMX/95wD56iJe/j1P/9f9fo6ydU4aSQJkAAAAASUVORK5CYII=
// @grant               GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/464727/PoeUI.user.js
// @updateURL https://update.greasyfork.org/scripts/464727/PoeUI.meta.js
// ==/UserScript==

;(() => {
  ;('use strict')

  // 重构 Login UI

  // 默认配置
  const borderRadius = '4px'
  const paddingCustom = '16px'
  const marginCustom = '20px'
  const colorCustomLi = '#EFEFFC'
  const colorCustom = '#5D5CDE'
  const borderCustom = '1px solid #e6e7e9'
  const fontFamilyLists = [
    {
      name: 'Loto',
      href: 'https://fonts.googleapis.com/css2?family=Lato&display=swap'
    },
    {
      name: 'Pathway Extreme',
      href: 'https://fonts.googleapis.com/css2?family=Pathway+Extreme&display=swap'
    }
  ]
  const fontFamily = 'Lato, "Pathway Extreme", "Microsoft YaHei", sans-serif'

  // 修改初始样式
  // Modify initial style
  const setInitialStyle = () => {
    // 创建<style>标签
    let styles = document.createElement('style')
    // 设置字体样式
    let css = `
    * {
        transition                 : all .3s;
        caret-color                : ${colorCustom};
        font-family                : ${fontFamily} !important;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0) !important;
        text-shadow                : 0 0 1.15px #a4a09ad9, 0 0 1px #7b7b7bcc, 0 0 0.75px #302f2d45 !important;
    }
    ::selection {
        color      : #FFFFFF !important;
        background : ${colorCustom} !important;
        text-shadow: none !important;
    }
    `
    // 添加CSS规则
    styles.append(document.createTextNode(css))
    // 将<style>标签加到head中
    document.head.appendChild(styles)
    // 动态添加 @import 规则
    fontFamilyLists.forEach((item) => {
      styles.sheet.insertRule(`@import url(${item.href});`)
    })
  }

  // 美化登录页
  const setLoginStyle = () => {
    let buttonBase = document.querySelectorAll('[class^=Button_buttonBase__]')
    buttonBase.forEach((elem) => {
      setCss(elem, {
        borderRadius: borderRadius,
        paddingTop: paddingCustom,
        paddingBottom: paddingCustom
      })
    })
  }

  // 全选所有历史记录
  GM_registerMenuCommand('全选所有历史记录', () => {
    // 执行全选操作
    let checkbox = document.querySelectorAll('.Checkbox_checkbox__zM_Lo')
    for (var i = 0; i < checkbox.length; i++) {
      if (!checkbox[i].checked) {
        checkbox[i].click()
      }
    }
  })

  // 聊天区最大化
  const setChatStyle = () => {
    let leftSidebar = document.querySelector(
      '[class^=PageWithSidebarLayout_leftSidebar__]'
    )
    setCss(leftSidebar, { flexGrow: 1 })
    let mainSection = document.querySelector(
      '[class^=PageWithSidebarLayout_mainSection__]'
    )
    setCss(mainSection, { flexGrow: 2, maxWidth: 'initial' })
    let rightSidebar = document.querySelector(
      '[class^=PageWithSidebarLayout_rightSidebar__]'
    )
    setCss(rightSidebar, { display: 'none' })
    let welcomeButtonsContainer = document.querySelectorAll(
      '[class^=ChatWelcomeView_welcomeButtonsContainer__]'
    )
    welcomeButtonsContainer.forEach((elem) => {
      setCss(elem, { borderRadius: borderRadius })
    })
    let humanMessageBubble = document.querySelectorAll(
      '[class^=Message_humanMessageBubble__]'
    )
    humanMessageBubble.forEach((elem) => {
      setCss(elem, { borderRadius: borderRadius })
    })
    let botMessageBubble = document.querySelectorAll(
      '[class^=Message_botMessageBubble__]'
    )
    botMessageBubble.forEach((elem) => {
      setCss(elem, { borderRadius: borderRadius })
    })
    let textInput = document.querySelector(
      '[class^=ChatMessageInputView_textInput__]'
    )
    setCss(textInput, { paddingTop: marginCustom, borderRadius: borderRadius })
    let sendButtonWrapper = document.querySelector(
      '[class^=ChatMessageInputView_sendButtonWrapper__]'
    )
    setCss(sendButtonWrapper, {
      bottom: 'initial',
      top: '50%',
      transform: 'translateY(-50%)',
      right: '10px'
    })
    let sendButton = document.querySelector(
      '[class*=ChatMessageInputView_sendButton__]'
    )
    setCss(sendButton, { borderRadius: '50%' })
    let messageOverflowButton = document.querySelectorAll(
      '[class^=ChatMessage_messageOverflowButton__]'
    )
    messageOverflowButton.forEach((elem) => {
      setCss(elem, { alignSelf: 'flex-end' })
    })
    let itemList = document.querySelectorAll(
      '[class^=DropdownMenuItemList_itemList__]'
    )
    itemList.forEach((elem) => {
      setCss(elem, { borderRadius: borderRadius })
    })
  }

  // 美化侧边栏
  const setChatSidebarStyle = () => {
    let sidebarContainer = document.querySelector(
      '[class^=ChatPageSidebar_sidebarContainer__]'
    )
    setCss(sidebarContainer, { maxWidth: 'initial' })
    let sidebar = document.querySelector('[class^=ChatPageSidebar_sidebar__]')
    setCss(sidebar, {
      maxWidth: 'initial',
      paddingLeft: 'initial',
      paddingRight: 'initial',
      gap: 'initial'
    })
    let section = document.querySelectorAll(
      '[class^=PageWithSidebarNavGroup_section__]'
    )
    section.forEach((elem) => {
      setCss(elem, {
        borderRadius: 'initial',
        borderBottom: borderCustom
      })
    })
    lastSection = section[section.length - 1]
    setCss(lastSection, { borderBottom: 'initial' })
    let logo = document.querySelector('[class^=ChatPageSidebar_logo__]')
    setCss(logo, { marginBottom: paddingCustom })
    let navItem = document.querySelectorAll(
      '[class^=PageWithSidebarNavItem_navItem__]'
    )
    navItem.forEach((elem) => {
      setCss(elem, { borderRadius: borderRadius, backgroundColor: 'initial' })
    })
    let active = document.querySelector(
      '[class*=PageWithSidebarNavItem_active__]'
    )
    setCss(active, { backgroundColor: colorCustomLi })
    let downloadButton = document.querySelector(
      '[class*=ChatPageDownloadLinks_downloadButton__]'
    )
    setCss(downloadButton, {
      margin: `${marginCustom} 0`,
      borderRadius: borderRadius,
      paddingTop: paddingCustom,
      paddingBottom: paddingCustom
    })
  }

  // 其他UI
  const setOtherStyle = () => {
    let reactModal = document.querySelector('[class^=ReactModal__Content]')
    setCss(reactModal, { borderRadius: borderRadius })
    let container = document.querySelectorAll(
      '[class^=SettingsSection_container__]'
    )
    container.forEach((elem) => {
      setCss(elem, { borderRadius: borderRadius })
    })
    let sectionBubble = document.querySelector(
      '[class^=SettingsSubscriptionSection_sectionBubble__]'
    )
    setCss(sectionBubble, { borderRadius: borderRadius })
  }

  // 自定义方法
  // 判断是否是DOM元素
  const isElement = (selector) => {
    if (typeof selector === 'string' || selector instanceof String) {
      return !!document.querySelector(selector)
    } else if (selector instanceof Element) {
      return true
    } else if (
      selector instanceof NodeList ||
      selector instanceof HTMLCollection
    ) {
      return (
        selector.length > 0 &&
        Array.from(selector).every((elem) => elem instanceof Element)
      )
    } else if (Array.isArray(selector)) {
      return selector.length > 0 && selector.every((elem) => isElement(elem))
    } else {
      return false
    }
  }

  // 修改CSS
  // 调用: setCss(['#box1', '#box2'], { background: 'white', color: 'black' })
  const setCss = (selectors, cssObj) => {
    // 处理selectors为数组的情况
    if (!Array.isArray(selectors)) {
      selectors = [selectors]
    }
    selectors.forEach((selector) => {
      let elem = isElement(selector)
        ? selector
        : document.querySelector(selector)
      if (elem) {
        for (let prop in cssObj) {
          elem.style[prop] = cssObj[prop]
        }
      }
    })
  }

  // 修改属性
  // 调用: setAttr(['#box1', '#box2'], { class: 'a', href: 'http://example.com' })
  const setAttr = (selectors, attrObj) => {
    // 处理selectors为数组的情况
    if (!Array.isArray(selectors)) {
      selectors = [selectors]
    }
    selectors.forEach((selector) => {
      let elem = isElement(selector)
        ? selector
        : document.querySelector(selector)
      if (elem) {
        for (let attr in attrObj) {
          elem.setAttribute(attr, attrObj[attr])
        }
      }
    })
  }

  // 初始化
  const initial = () => {
    setInitialStyle()

    let timer = setInterval(() => {
      setLoginStyle()
      setChatStyle()
      setChatSidebarStyle()
      setOtherStyle()
    }, 1000)
  }

  // 网页加载成功
  window.onload = () => {
    initial()
  }
})()
