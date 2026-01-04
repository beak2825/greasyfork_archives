/* exported PushQueue */
/**
 * PushQueue
 *
 * 推入队列，循环数组实现。
 * @template T 数据类型
 * @version 1.1.2.20230313
 * @author Laster2800
 * @see {@link https://gitee.com/liangjiancang/userscript/tree/master/lib/PushQueue PushQueue}
 */
class PushQueue {
  /** @type {number} 起始元素位置（指向起始元素后方） */
  index = 0
  /** @type {number} 队列长度 */
  size = 0
  /** @type {number} 最大长度 */
  maxSize = 0
  /** @type {T[]} 内部数据 */
  data = null

  /**
   * @param {number} maxSize 队列的最大长度，达到此长度后继续推入数据，将舍弃队头处的数据
   */
  constructor(maxSize) {
    this.maxSize = maxSize
    this.data = new Array(maxSize)
  }

  /**
   * 设置推入队列的最大长度
   * @param {number} maxSize 最大长度
   */
  setMaxSize(maxSize) {
    if (this.size > maxSize) {
      this.size = maxSize
    }
    const data = this.toArray().reverse()
    this.maxSize = maxSize
    this.index = data.length
    data.length = maxSize
    this.data = data
  }

  /**
   * 向队尾推入数据，若队列已达到最大长度，则舍弃队头处数据
   * @param {T} value 推入队列的数据
   */
  enqueue(value) {
    this.data[this.index] = value
    this.index += 1
    if (this.index >= this.maxSize) {
      this.index = 0
    }
    if (this.size < this.maxSize) {
      this.size += 1
    }
  }

  /**
   * 将队头处的数据弹出
   * @returns {T} 弹出的数据
   */
  dequeue() {
    if (this.size <= 0) return
    let index = this.index - this.size
    if (index < 0) {
      index += this.maxSize
    }
    this.size -= 1
    const result = this.data[index]
    delete this.data[index]
    return result
  }

  /**
   * 获取第 `n` 个元素（范围 `[0, size - 1]`）
   * @param {number} n 元素位置
   * @returns {T} 第 `n` 个元素
   */
  get(n) {
    if (n < 0 || n >= this.size) return
    let index = this.index - n - 1
    if (index < 0) {
      index += this.maxSize
    }
    return this.data[index]
  }

  /**
   * 设置第 `n` 个元素的值为 `value`（范围 `[0, size - 1]`，且第 `n` 个元素必须已存在）
   * @param {number} n 元素位置
   * @param {T} value 要设置的值
   * @returns {boolean} 是否设置成功
   */
  set(n, value) {
    if (n < 0 || n >= this.size) return false
    let index = this.index - n - 1
    if (index < 0) {
      index += this.maxSize
    }
    this.data[index] = value
    return true
  }

  /**
   * 将推入队列以数组的形式返回
   * @param {number} [maxLength=size] 读取的最大长度
   * @param {number} [offset=0] 起始点
   * @returns {Array<T>} 队列数据的数组形式
   */
  toArray(maxLength = this.size, offset = 0) {
    if (offset < 0) {
      offset = 0
    }
    if (offset + maxLength > this.size) {
      maxLength = this.size - offset
    }
    const ar = []
    let start = this.index - offset
    if (start < 0) {
      start += this.maxSize
    }
    let end = start - maxLength
    for (let i = start - 1; i >= end && i >= 0; i--) {
      ar.push(this.data[i])
    }
    if (end < 0) {
      end += this.maxSize
      for (let i = this.maxSize - 1; i >= end; i--) {
        ar.push(this.data[i])
      }
    }
    return ar
  }

  /**
   * 标准迭代器：`item`
   * @returns {IterableIterator<T>}
   */
  [Symbol.iterator]() {
    const iterator = this.entries()
    return {
      next: () => {
        const n = iterator.next()
        if (!n.done) {
          n.value = n.value[1]
        }
        return n
      },
    }
  }

  /**
   * 迭代器：`[index, item]`
   * @returns {IterableIterator<[index: number, item: T]>}
   */
  entries() {
    let current = this.index - 1
    let end = this.index - this.size
    return {
      next: () => {
        if (current < 0 && end < 0) {
          current += this.maxSize
          end += this.maxSize
        }
        if (current < end || current < 0) return { done: true }
        const n = { value: [current, this.data[current]], done: false }
        current -= 1
        return n
      },

      [Symbol.iterator]() { return this },
    }
  }
}
