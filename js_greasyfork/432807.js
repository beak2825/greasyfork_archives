/**
 * @file 自定义数值输入框元素 InputNumber
 * @version 1.1.1.20230313
 * @author Laster2800
 * @see {@link https://gitee.com/liangjiancang/userscript/tree/master/lib/CustomElements/InputNumber InputNumber}
 */

if (!customElements.get('laster2800-input-number')) {
  customElements.define('laster2800-input-number', class InputNumber extends HTMLInputElement {
    #arrowTid = false

    static get observedAttributes() {
      return ['type', 'step']
    }

    constructor() {
      super()
      this.#update()
      this.addEventListener('input', this.#onInput)
      this.addEventListener('blur', this.#onInputDone)
      this.addEventListener('keydown', this.#onArrowDown)
      this.addEventListener('keyup', this.#onArrowUp)
    }

    #onInput() {
      let val = this.value
      const regex = this.min < 0 ? /-?\d+(\.(\d+)?)?|-/ : /\d+(\.(\d+)?)?/
      val = regex.exec(val)?.[0] ?? ''
      if (val) {
        if (val !== '-') {
          // input listener 只应处理外极值
          if (val.startsWith('-')) {
            if (val < this.min) {
              val = String(this.min)
            }
          } else {
            if (val > this.max) {
              val = String(this.max)
            }
          }
          if (this.digits !== Number.POSITIVE_INFINITY) { // Number#toFixed() 不便于动态精度
            if (this.digits > 0) {
              const m = new RegExp(String.raw`(.+\.\d{${this.digits}}).+`).exec(val)
              if (m) {
                val = m[1]
              }
            } else {
              const idx = val.indexOf('.')
              if (idx >= 0) {
                val = val.slice(0, idx)
              }
            }
          }
        }
        this.value = val
      } else {
        this.value = ''
      }
    }

    #onInputDone() {
      let val = this.value
      if (val === '') {
        val = this.defaultValue
      }
      val = Number.parseFloat(val)
      if (!Number.isNaN(val)) {
        if (val === 0) {
          if (this.allowZero === 'true') {
            this.value = '0'
            return
          } else if (this.allowZero === 'false') {
            val = Number.parseFloat(this.defaultValue)
            if (val === 0) {
              this.value = '0'
            } else {
              this.value = ''
              this.#onInputDone()
            }
            return
          }
        }
        if (val > this.max) {
          val = this.max
        } else if (val < this.min) {
          val = this.min
        }
        if (this.digits !== Number.POSITIVE_INFINITY) {
          val = String(val)
          if (this.digits > 0) {
            const m = new RegExp(String.raw`(.+\.\d{${this.digits}}).+`).exec(val)
            if (m) {
              val = m[1]
            }
          } else {
            const idx = val.indexOf('.')
            if (idx >= 0) {
              val = val.slice(0, idx)
            }
          }
        }
        this.value = val
      }
    }

    /** @param {KeyboardEvent} e */
    #onArrowDown(e) {
      let move = ({ ArrowUp: 1, ArrowDown: -1 })[e.key]
      if (move) {
        e.preventDefault()
        if (this.#arrowTid) return
        this.#arrowTid = setTimeout(() => { this.#arrowTid = null }, 100)

        if (e.altKey) {
          move *= 0.1
        } else if (e.shiftKey) {
          move *= 10
        } else if (e.ctrlKey) {
          move *= 100
        }

        let val = this.value
        if (val === '') {
          val = this.defaultValue
        }
        val = Number.parseFloat(val)
        if (Number.isNaN(val)) return
        val += move
        if (val > this.max) {
          val = this.max
        } else if (val < this.min) {
          val = this.min
        }
        this.value = this.digits === Number.POSITIVE_INFINITY ? val : val.toFixed(this.digits)

        this.dispatchEvent(new Event('change'))
      }
    }

    /** @param {KeyboardEvent} e */
    #onArrowUp(e) {
      if (['ArrowUp', 'ArrowDown'].includes(e.key) && this.#arrowTid) {
        clearTimeout(this.#arrowTid)
        this.#arrowTid = null
      }
    }

    set digits(val) {
      this.setAttribute('digits', val)
    }

    get digits() {
      return this.#getNumberAttr('digits', 0, 0)
    }

    set max(val) {
      this.setAttribute('max', val)
    }

    get max() {
      return this.#getNumberAttr('max', Number.POSITIVE_INFINITY)
    }

    set min(val) {
      this.setAttribute('min', val)
    }

    get min() {
      return this.#getNumberAttr('min', 0)
    }

    set allowZero(val) {
      this.setAttribute('allow-zero', val)
    }

    get allowZero() {
      return this.getAttribute('allow-zero')
    }

    attributeChangedCallback(name, oldValue, newValue) {
      newValue && this.removeAttribute(name)
    }

    /**
     * 内部更新
     */
    #update() {
      if (this.getAttribute('type')) {
        this.removeAttribute('type')
      }
    }

    /**
     * 获取数值属性值
     * @param {string} name 属性名
     * @param {number | string} [defaultVal=0] 默认值
     * @param {number} [digits=Number.POSITIVE_INFINITY] 保留到小数点后几位
     * @returns {number} 数值属性值
     */
    #getNumberAttr(name, defaultVal = 0, digits = Number.POSITIVE_INFINITY) {
      let val = this.getAttribute(name)
      if (val == null) return defaultVal
      val = Number.parseFloat(val)
      if (Number.isNaN(val)) return defaultVal
      if (digits === 0) {
        val = Math.round(val)
      } else if (digits !== Number.POSITIVE_INFINITY) {
        val = Number.parseFloat(val.toFixed(digits))
      }
      return val
    }
  }, { extends: 'input' })
}
