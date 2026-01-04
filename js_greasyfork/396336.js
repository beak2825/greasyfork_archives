// ==UserScript==
// @name         zhihu one
// @version      0.1.4
// @description  知乎代码高亮
// @author       Limboer
// @match        *://*.zhihu.com/*
// @resource     darkCSS https://gitee.com/limboer/zhihu-highlight/raw/master/dark.css
// @resource     lightCSS https://gitee.com/limboer/zhihu-highlight/raw/master/light.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @namespace    https://greasyfork.org/users/443935
// @downloadURL https://update.greasyfork.org/scripts/396336/zhihu%20one.user.js
// @updateURL https://update.greasyfork.org/scripts/396336/zhihu%20one.meta.js
// ==/UserScript==


(function() {
const createDOMFromString = (html) => {
  const div = document.createElement('div')
  div.insertAdjacentHTML('beforeend', html)
  return div
}

const mount = (component, root, position='beforeend') => {
  root.insertAdjacentElement(position, component.renderDOM())
  component.onStateChange = (oldEl, newEl) => {
    root.insertAdjacentElement(position, newEl)
    root.removeChild(oldEl)
  }
}

class Component {
  constructor(props={}) {
    this.props = props
    this.el = null
    this.state = {}
  }

  onStateChange(oldEl, newEl) {
    console.log('state changed')
  }

  setState(newState) {
    const oldEl = this.el
    this.state = newState
    this.el = this.renderDOM()
    this.onStateChange(oldEl, this.el)
  }

  handleClick() {
    console.log('clicked')
  }

  render() {
    return '<div></div>'
  }

  renderDOM() {
    this.el = createDOMFromString(this.render())
    this.el.addEventListener('click', e => this.handleClick(e), false)

    return this.el
  }
}

class ThemeToogleButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      theme: document.querySelector('html').getAttribute('data-theme') || 'light'
    }
    this.toogleTheme()
    console.log('state', this.state)
  }

  toogleTheme() {
    const darkMode = GM_getResourceText("darkCSS")
    const lightMode = GM_getResourceText("lightCSS")
    if (this.state.theme === 'dark') {
      GM_addStyle(darkMode)
    } else {
      GM_addStyle(lightMode)
    }
    // 发送改变主题的请求, 在用户下一次刷新页面的时候更新该 url 下的主题
    fetch(`/?theme=${this.state.theme}`)
      .then(res => document.querySelector('html').setAttribute('data-theme', this.state.theme))
      .catch(error => console.error('error', error))
  }

  handleClick(e) {
    this.setState({
      theme: this.state.theme === 'light' ? 'dark' : 'light'
    })
    this.toogleTheme()
  }

  render() {
    return `
      <div class="CornerAnimayedFlex">
        <button
          data-tooltip=${this.state.theme === "dark" ? "日常模式" : "黑暗模式"}
          data-tooltip-position="left"
          type="button"
          class="Button CornerButton Button--plain"
        >
          ${this.state.theme === "dark" ? "Light" : "Dark"}
        </button>
      </div>
    `
  }
}

const root = document.querySelector('.CornerButtons')
const themeToogleButton = new ThemeToogleButton()
mount(themeToogleButton, root, 'afterbegin')

})();