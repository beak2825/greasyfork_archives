// ==UserScript==
// @name         easy-logger
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @license      MIT
// @description  簡易的なロギングユーティリティです。
// @author       You
// ==/UserScript==

class EasyLogger {
  static #levels = {
    all: { priority: 0, color: 'grey' },
    trace: { priority: 1, color: 'blue' },
    debug: { priority: 2, color: 'cyan' },
    info: { priority: 3, color: 'green' },
    warn: { priority: 4, color: 'yellow' },
    error: { priority: 5, color: 'red' },
    fatal: { priority: 6, color: 'magenta' },
    mark: { priority: 7, color: 'grey' },
    off: { priority: 8 }
  }
  #category = 'default'

  setCategory(category) {
    this.#category = category

    return this
  }

  #level = 'all'
  #levelPriority = 0

  setLevel(level) {
    this.#level = level
    this.#levelPriority = this.constructor.#levels[level].priority

    return this
  }

  static #colorReset = '\u001b[0m'
  static #colorMap = {
    'grey': '\u001b[90m',
    'blue': '\u001b[34m',
    'cyan': '\u001b[36m',
    'green': '\u001b[32m',
    'yellow': '\u001b[33m',
    'red': '\u001b[31m',
    'magenta': '\u001b[35m'
  }

  static #colorText(text, color) {
    return `${this.#colorMap[color]}${text}${this.#colorReset}`
  }

  #createLog(text, level) {
    return this.constructor.#colorText(
      `[${new Date().toISOString().slice(0, -1)}] [${level.toUpperCase()}] ${this.#category} - ${text}`,
      this.constructor.#levels[level].color
    )
  }

  #log(text, level) {
    if (this.#levelPriority <= this.constructor.#levels[level].priority) {
      console.log(this.#createLog(text, level))
    }

    return this
  }

  trace(text) {
    return this.#log(text, 'trace')
  }

  debug(text) {
    return this.#log(text, 'debug')
  }

  info(text) {
    return this.#log(text, 'info')
  }

  warn(text) {
    return this.#log(text, 'warn')
  }

  error(text) {
    return this.#log(text, 'error')
  }

  fatal(text) {
    return this.#log(text, 'fatal')
  }

  mark(text) {
    return this.#log(text, 'mark')
  }
}

window.EasyLogger = EasyLogger