// ==UserScript==
// @name        NGA Library
// @namespace   https://greasyfork.org/users/263018
// @version     1.2.1
// @author      snyssss
// @description NGA 库，包括工具类、缓存、API
// @license     MIT

// @match       *://bbs.nga.cn/*
// @match       *://ngabbs.com/*
// @match       *://nga.178.com/*

// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       unsafeWindow
// ==/UserScript==

/**
 * 工具类
 */
class Tools {
  /**
   * 返回当前值的类型
   * @param   {*}      value  值
   * @returns {String}        值的类型
   */
  static getType = (value) => {
    return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
  };

  /**
   * 返回当前值是否为指定的类型
   * @param   {*}               value  值
   * @param   {Array<String>}   types  类型名称集合
   * @returns {Boolean}         值是否为指定的类型
   */
  static isType = (value, ...types) => {
    return types.includes(this.getType(value));
  };

  /**
   * 拦截属性
   * @param {Object}    target    目标对象
   * @param {String}    property  属性或函数名称
   * @param {Function}  beforeGet 获取属性前事件
   * @param {Function}  beforeSet 设置属性前事件
   * @param {Function}  afterGet  获取属性后事件
   * @param {Function}  afterSet  设置属性前事件
   */
  static interceptProperty = (
    target,
    property,
    { beforeGet, beforeSet, afterGet, afterSet }
  ) => {
    // 判断目标对象是否存在
    if (target === undefined) {
      return;
    }

    // 判断是否已被拦截
    const isIntercepted = (() => {
      const descriptor = Object.getOwnPropertyDescriptor(target, property);

      if (descriptor && descriptor.get && descriptor.set) {
        return true;
      }

      return false;
    })();

    // 初始化目标对象的拦截列表
    target.interceptions = target.interceptions || {};
    target.interceptions[property] = target.interceptions[property] || {
      data: target[property],
      beforeGetQueue: [],
      beforeSetQueue: [],
      afterGetQueue: [],
      afterSetQueue: [],
    };

    // 写入事件
    Object.entries({
      beforeGetQueue: beforeGet,
      beforeSetQueue: beforeSet,
      afterGetQueue: afterGet,
      afterSetQueue: afterSet,
    }).forEach(([queue, event]) => {
      if (event) {
        target.interceptions[property][queue].push(event);
      }
    });

    // 拦截
    if (isIntercepted === false) {
      // 定义属性
      Object.defineProperty(target, property, {
        get: () => {
          // 获取事件
          const { data, beforeGetQueue, afterGetQueue } =
            target.interceptions[property];

          // 如果是函数
          if (this.isType(data, "function")) {
            return (...args) => {
              try {
                // 执行前操作
                // 可以在这一步修改参数
                // 可以通过在这一步抛出来阻止执行
                if (beforeGetQueue) {
                  beforeGetQueue.forEach((event) => {
                    args = event.apply(target, args);
                  });
                }

                // 执行函数
                const result = data.apply(target, args);

                // 执行后操作
                if (afterGetQueue) {
                  // 返回的可能是一个 Promise
                  const resultValue =
                    result instanceof Promise
                      ? result
                      : Promise.resolve(result);

                  resultValue.then((value) => {
                    afterGetQueue.forEach((event) => {
                      event.apply(target, [value, args, data]);
                    });
                  });
                }

                // 返回结果
                return result;
              } catch {
                return undefined;
              }
            };
          }

          try {
            // 返回前操作
            // 可以在这一步修改返回结果
            // 可以通过在这一步抛出来返回 undefined
            let result = data;

            if (beforeGetQueue) {
              beforeGetQueue.forEach((event) => {
                result = event.apply(target, [result]);
              });
            }

            // 返回后操作
            // 实际上是在返回前完成的，并不能叫返回后操作，但是我们可以配合 afterGet 来操作处理后的数据
            if (afterGetQueue) {
              afterGetQueue.forEach((event) => {
                event.apply(target, [result, data]);
              });
            }

            // 返回结果
            return result;
          } catch {
            return undefined;
          }
        },
        set: (value) => {
          // 获取事件
          const { data, beforeSetQueue, afterSetQueue } =
            target.interceptions[property];

          // 声明结果
          let result = value;

          try {
            // 写入前操作
            // 可以在这一步修改写入结果
            // 可以通过在这一步抛出来写入 undefined
            if (beforeSetQueue) {
              beforeSetQueue.forEach((event) => {
                result = event.apply(target, [data, result]);
              });
            }

            // 写入可能的事件
            if (this.isType(data, "object")) {
              result.interceptions = data.interceptions;
            }

            // 写入后操作
            if (afterSetQueue) {
              afterSetQueue.forEach((event) => {
                event.apply(target, [result, value]);
              });
            }
          } catch {
            result = undefined;
          } finally {
            // 写入结果
            target.interceptions[property].data = result;

            // 返回结果
            return result;
          }
        },
      });
    }

    // 如果已经有结果，则直接处理写入后操作
    if (Object.hasOwn(target, property)) {
      if (afterSet) {
        afterSet.apply(target, [target.interceptions[property].data]);
      }
    }
  };

  /**
   * 合并数据
   * @param   {*}     target  目标对象
   * @param   {Array} sources 来源对象集合
   * @returns                 合并后的对象
   */
  static merge = (target, ...sources) => {
    for (const source of sources) {
      const targetType = this.getType(target);
      const sourceType = this.getType(source);

      // 如果来源对象的类型与目标对象不一致，替换为来源对象
      if (sourceType !== targetType) {
        target = source;
        continue;
      }

      // 如果来源对象是数组，直接合并
      if (targetType === "array") {
        target = [...target, ...source];
        continue;
      }

      // 如果来源对象是对象，合并对象
      if (sourceType === "object") {
        for (const key in source) {
          if (Object.hasOwn(target, key)) {
            target[key] = this.merge(target[key], source[key]);
          } else {
            target[key] = source[key];
          }
        }
        continue;
      }

      // 其他情况，更新值
      target = source;
    }

    return target;
  };

  /**
   * 数组排序
   * @param {Array}                    collection 数据集合
   * @param {Array<String | Function>} iterators  迭代器，要排序的属性名或排序函数
   */
  static sortBy = (collection, ...iterators) =>
    collection.slice().sort((a, b) => {
      for (let i = 0; i < iterators.length; i += 1) {
        const iteratee = iterators[i];

        const valueA = this.isType(iteratee, "function")
          ? iteratee(a)
          : a[iteratee];
        const valueB = this.isType(iteratee, "function")
          ? iteratee(b)
          : b[iteratee];

        if (valueA < valueB) {
          return -1;
        }

        if (valueA > valueB) {
          return 1;
        }
      }

      return 0;
    });

  /**
   * 读取论坛数据
   * @param {Response}  response  请求响应
   * @param {Boolean}   toJSON    是否转为 JSON 格式
   */
  static readForumData = async (response, toJSON = true) => {
    return new Promise(async (resolve) => {
      const blob = await response.blob();

      const reader = new FileReader();

      reader.onload = () => {
        const text = reader.result.replace(
          "window.script_muti_get_var_store=",
          ""
        );

        if (toJSON) {
          try {
            resolve(JSON.parse(text));
          } catch {
            resolve({});
          }
          return;
        }

        resolve(text);
      };

      reader.readAsText(blob, "GBK");
    });
  };

  /**
   * 获取成对括号的内容
   * @param   {String} content 内容
   * @param   {String} keyword 起始位置关键字
   * @param   {String} start   左括号
   * @param   {String} end     右括号
   * @returns {String}         包含括号的内容
   */
  static searchPair = (content, keyword, start = "{", end = "}") => {
    // 获取成对括号的位置
    const findPairEndIndex = (content, position, start, end) => {
      if (position >= 0) {
        let nextIndex = position + 1;

        while (nextIndex < content.length) {
          if (content[nextIndex] === end) {
            return nextIndex;
          }

          if (content[nextIndex] === start) {
            nextIndex = findPairEndIndex(content, nextIndex, start, end);

            if (nextIndex < 0) {
              break;
            }
          }

          nextIndex = nextIndex + 1;
        }
      }

      return -1;
    };

    // 起始位置
    const str = keyword + start;

    // 起始下标
    const index = content.indexOf(str) + str.length;

    // 结尾下标
    const lastIndex = findPairEndIndex(content, index, start, end);

    if (lastIndex > 0) {
      return start + content.substring(index, lastIndex) + end;
    }

    return null;
  };

  /**
   * 计算字符串的颜色
   *
   * 采用的是泥潭的颜色方案，参见 commonui.htmlName
   * @param   {String} value 字符串
   * @returns {String}       RGB代码
   */
  static generateColor(value) {
    const hash = (() => {
      let h = 5381;

      for (var i = 0; i < value.length; i++) {
        h = ((h << 5) + h + value.charCodeAt(i)) & 0xffffffff;
      }

      return h;
    })();

    const hex = Math.abs(hash).toString(16) + "000000";

    const hsv = [
      `0x${hex.substring(2, 4)}` / 255,
      `0x${hex.substring(2, 4)}` / 255 / 2 + 0.25,
      `0x${hex.substring(4, 6)}` / 255 / 2 + 0.25,
    ];

    const rgb = ((h, s, v) => {
      const f = (n, k = (n + h / 60) % 6) =>
        v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);

      return [f(5), f(3), f(1)];
    })(hsv[0], hsv[1], hsv[2]);

    return ["#", ...rgb].reduce((a, b) => {
      return a + ("0" + b.toString(16)).slice(-2);
    });
  }

  /**
   * 添加样式
   *
   * @param   {String}           css 样式信息
   * @param   {String}           id  样式 ID
   * @returns {HTMLStyleElement}     样式元素
   */
  static addStyle(css, id = "s-" + Math.random().toString(36).slice(2)) {
    let element = document.getElementById(id);

    if (element === null) {
      element = document.createElement("STYLE");
      element.id = id;

      document.head.appendChild(element);
    }

    element.textContent = css;

    return element;
  }

  /**
   * 计算时间是否为今天
   * @param   {Date}    date 时间
   * @returns {Boolean}
   */
  static dateIsToday(date) {
    const now = new Date();

    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  }

  /**
   * 计算时间差
   * @param   {Date}    start 开始时间
   * @param   {Date}    end   结束时间
   * @returns {object}        时间差
   */
  static dateDiff(start, end = new Date()) {
    if (start > end) {
      return dateDiff(end, start);
    }

    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    const startDay = start.getDate();

    const endYear = end.getFullYear();
    const endMonth = end.getMonth();
    const endDay = end.getDate();

    const diff = {
      years: endYear - startYear,
      months: endMonth - startMonth,
      days: endDay - startDay,
    };

    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (
      startYear % 400 === 0 ||
      (startYear % 100 !== 0 && startYear % 4 === 0)
    ) {
      daysInMonth[1] = 29;
    }

    if (diff.months < 0) {
      diff.years -= 1;
      diff.months += 12;
    }

    if (diff.days < 0) {
      if (diff.months === 0) {
        diff.years -= 1;
        diff.months = 11;
      } else {
        diff.months -= 1;
      }

      diff.days += daysInMonth[startMonth];
    }

    return diff;
  }
}

/**
 * 简单队列
 */
class Queue {
  /**
   * 任务队列
   */
  queue = {};

  /**
   * 当前状态 - IDLE, RUNNING, PAUSED
   */
  state = "IDLE";

  /**
   * 异常暂停时间
   */
  pauseTime = 1000 * 60 * 5;

  /**
   * 添加任务
   * @param {string}        key     标识
   * @param {() => Promise} task    任务
   */
  enqueue(key, task) {
    if (Object.hasOwn(this.queue, key)) {
      return;
    }

    this.queue[key] = task;
    this.run();
  }

  /**
   * 移除任务
   * @param {string} key 标识
   */
  dequeue(key) {
    if (Object.hasOwn(this.queue, key) === false) {
      return;
    }

    delete this.queue[key];
  }

  /**
   * 执行任务
   */
  run() {
    // 非空闲状态，直接返回
    if (this.state !== "IDLE") {
      return;
    }

    // 获取任务队列标识
    const keys = Object.keys(this.queue);

    // 任务队列为空，直接返回
    if (keys.length === 0) {
      return;
    }

    // 标记为执行中
    this.state = "RUNNING";

    // 取得第一个任务
    const key = keys[0];

    // 执行任务
    this.queue[key]()
      .then(() => {
        // 移除任务
        this.dequeue(key);
      })
      .catch(async () => {
        // 标记为暂停
        this.state = "PAUSED";

        // 等待指定时间
        await new Promise((resolve) => {
          setTimeout(resolve, this.pauseTime);
        });
      })
      .finally(() => {
        // 标记为空闲
        this.state = "IDLE";

        // 执行下一个任务
        this.run();
      });
  }
}

/**
 * 初始化缓存和 API
 */
const initCacheAndAPI = (() => {
  // KEY
  const USER_AGENT_KEY = "USER_AGENT_KEY";

  /**
   * 数据库名称
   */
  const name = "NGA_Storage";

  /**
   * 模块列表
   */
  const modules = {
    TOPIC_NUM_CACHE: {
      keyPath: "uid",
      version: 1,
      indexes: ["timestamp"],
      expireTime: 1000 * 60 * 60,
      persistent: true,
    },
    USER_INFO_CACHE: {
      keyPath: "uid",
      version: 1,
      indexes: ["timestamp"],
      expireTime: 1000 * 60 * 60,
      persistent: false,
    },
    USER_IPLOC_CACHE: {
      keyPath: "uid",
      version: 1,
      indexes: ["timestamp"],
      expireTime: 1000 * 60 * 60,
      persistent: true,
    },
    PAGE_CACHE: {
      keyPath: "url",
      version: 1,
      indexes: ["timestamp"],
      expireTime: 1000 * 60 * 10,
      persistent: false,
    },
    FORUM_POSTED_CACHE: {
      keyPath: "url",
      version: 1,
      indexes: ["timestamp"],
      expireTime: 1000 * 60 * 60 * 24,
      persistent: true,
    },
    USER_NAME_CHANGED: {
      keyPath: "uid",
      version: 2,
      indexes: ["timestamp"],
      expireTime: 1000 * 60 * 60 * 24,
      persistent: true,
    },
    USER_STEAM_INFO: {
      keyPath: "uid",
      version: 3,
      indexes: ["timestamp"],
      expireTime: 1000 * 60 * 60 * 24,
      persistent: true,
    },
    USER_PSN_INFO: {
      keyPath: "uid",
      version: 3,
      indexes: ["timestamp"],
      expireTime: 1000 * 60 * 60 * 24,
      persistent: true,
    },
    USER_NINTENDO_INFO: {
      keyPath: "uid",
      version: 3,
      indexes: ["timestamp"],
      expireTime: 1000 * 60 * 60 * 24,
      persistent: true,
    },
    USER_GENSHIN_INFO: {
      keyPath: "uid",
      version: 3,
      indexes: ["timestamp"],
      expireTime: 1000 * 60 * 60 * 24,
      persistent: false,
    },
    USER_SKZY_INFO: {
      keyPath: "uid",
      version: 3,
      indexes: ["timestamp"],
      expireTime: 1000 * 60 * 60 * 24,
      persistent: false,
    },
  };

  /**
   * IndexedDB
   *
   * 简单制造轮子，暂不打算引入 dexie.js，待其云方案正式推出后再考虑
   */

  class DBStorage {
    /**
     * 当前实例
     */
    instance = null;

    /**
     * 是否支持
     */
    isSupport() {
      return unsafeWindow.indexedDB !== undefined;
    }

    /**
     * 打开数据库并创建表
     * @returns {Promise<IDBDatabase>} 实例
     */
    async open() {
      // 创建实例
      if (this.instance === null) {
        // 声明一个数组，用于等待全部表处理完毕
        const queue = [];

        // 创建实例
        await new Promise((resolve, reject) => {
          // 版本
          const version = Object.values(modules)
            .map(({ version }) => version)
            .reduce((a, b) => Math.max(a, b), 0);

          // 创建请求
          const request = unsafeWindow.indexedDB.open(name, version);

          // 创建或者升级表
          request.onupgradeneeded = (event) => {
            this.instance = event.target.result;

            const transaction = event.target.transaction;
            const oldVersion = event.oldVersion;

            Object.entries(modules).forEach(([key, values]) => {
              if (values.version > oldVersion) {
                queue.push(this.createOrUpdateStore(key, values, transaction));
              }
            });
          };

          // 成功后处理
          request.onsuccess = (event) => {
            this.instance = event.target.result;
            resolve();
          };

          // 失败后处理
          request.onerror = () => {
            reject();
          };
        });

        // 等待全部表处理完毕
        await Promise.all(queue);
      }

      // 返回实例
      return this.instance;
    }

    /**
     * 获取表
     * @param   {String}          name        表名
     * @param   {IDBTransaction}  transaction 事务，空则根据表名创建新事务
     * @param   {String}          mode        事务模式，默认为只读
     * @returns {Promise<IDBObjectStore>}     表
     */
    async getStore(name, transaction = null, mode = "readonly") {
      const db = await this.open();

      if (transaction === null) {
        transaction = db.transaction(name, mode);
      }

      return transaction.objectStore(name);
    }

    /**
     * 创建或升级表
     * @param   {String}          name        表名
     * @param   {IDBTransaction}  transaction 事务，空则根据表名创建新事务
     * @returns {Promise}
     */
    async createOrUpdateStore(name, { keyPath, indexes }, transaction) {
      const db = transaction.db;
      const data = [];

      // 检查是否存在表，如果存在，缓存数据并删除旧表
      if (db.objectStoreNames.contains(name)) {
        // 获取并缓存全部数据
        const result = await this.bulkGet(name, [], transaction);

        if (result) {
          data.push(...result);
        }

        // 删除旧表
        db.deleteObjectStore(name);
      }

      // 创建表
      const store = db.createObjectStore(name, {
        keyPath,
      });

      // 创建索引
      if (indexes) {
        indexes.forEach((index) => {
          store.createIndex(index, index);
        });
      }

      // 迁移数据
      if (data.length > 0) {
        await this.bulkAdd(name, data, transaction);
      }
    }

    /**
     * 清除指定表的数据
     * @param   {String}                                                  name        表名
     * @param   {(store: IDBObjectStore) => IDBRequest<IDBCursor | null>} range       清除范围
     * @param   {IDBTransaction}                                          transaction 事务，空则根据表名创建新事务
     * @returns {Promise}
     */
    async clear(name, range = null, transaction = null) {
      // 获取表
      const store = await this.getStore(name, transaction, "readwrite");

      // 清除全部数据
      if (range === null) {
        // 清空数据
        await new Promise((resolve, reject) => {
          // 创建请求
          const request = store.clear();

          // 成功后处理
          request.onsuccess = (event) => {
            resolve(event.target.result);
          };

          // 失败后处理
          request.onerror = (event) => {
            reject(event);
          };
        });

        return;
      }

      // 请求范围
      const request = range(store);

      // 成功后删除数据
      request.onsuccess = (event) => {
        const cursor = event.target.result;

        if (cursor) {
          store.delete(cursor.primaryKey);

          cursor.continue();
        }
      };
    }

    /**
     * 插入指定表的数据
     * @param   {String}          name        表名
     * @param   {*}               data        数据
     * @param   {IDBTransaction}  transaction 事务，空则根据表名创建新事务
     * @returns {Promise}
     */
    async add(name, data, transaction = null) {
      // 获取表
      const store = await this.getStore(name, transaction, "readwrite");

      // 插入数据
      const result = await new Promise((resolve, reject) => {
        // 创建请求
        const request = store.add(data);

        // 成功后处理
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };

        // 失败后处理
        request.onerror = (event) => {
          reject(event);
        };
      });

      // 返回结果
      return result;
    }

    /**
     * 删除指定表的数据
     * @param   {String}          name        表名
     * @param   {String}          key         主键
     * @param   {IDBTransaction}  transaction 事务，空则根据表名创建新事务
     * @returns {Promise}
     */
    async delete(name, key, transaction = null) {
      // 获取表
      const store = await this.getStore(name, transaction, "readwrite");

      // 删除数据
      const result = await new Promise((resolve, reject) => {
        // 创建请求
        const request = store.delete(key);

        // 成功后处理
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };

        // 失败后处理
        request.onerror = (event) => {
          reject(event);
        };
      });

      // 返回结果
      return result;
    }

    /**
     * 插入或修改指定表的数据
     * @param   {String}          name        表名
     * @param   {*}               data        数据
     * @param   {IDBTransaction}  transaction 事务，空则根据表名创建新事务
     * @returns {Promise}
     */
    async put(name, data, transaction = null) {
      // 获取表
      const store = await this.getStore(name, transaction, "readwrite");

      // 插入或修改数据
      const result = await new Promise((resolve, reject) => {
        // 创建请求
        const request = store.put(data);

        // 成功后处理
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };

        // 失败后处理
        request.onerror = (event) => {
          reject(event);
        };
      });

      // 返回结果
      return result;
    }

    /**
     * 获取指定表的数据
     * @param   {String}          name        表名
     * @param   {String}          key         主键
     * @param   {IDBTransaction}  transaction 事务，空则根据表名创建新事务
     * @returns {Promise}                     数据
     */
    async get(name, key, transaction = null) {
      // 获取表
      const store = await this.getStore(name, transaction);

      // 查询数据
      const result = await new Promise((resolve, reject) => {
        // 创建请求
        const request = store.get(key);

        // 成功后处理
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };

        // 失败后处理
        request.onerror = (event) => {
          reject(event);
        };
      });

      // 返回结果
      return result;
    }

    /**
     * 批量插入指定表的数据
     * @param   {String}          name        表名
     * @param   {Array}           data        数据集合
     * @param   {IDBTransaction}  transaction 事务，空则根据表名创建新事务
     * @returns {Promise<number>}             成功数量
     */
    async bulkAdd(name, data, transaction = null) {
      // 等待操作结果
      const result = await Promise.all(
        data.map((item) =>
          this.add(name, item, transaction)
            .then(() => true)
            .catch(() => false)
        )
      );

      // 返回受影响的数量
      return result.filter((item) => item).length;
    }

    /**
     * 批量删除指定表的数据
     * @param   {String}          name        表名
     * @param   {Array<String>}   keys        主键集合，空则删除全部
     * @param   {IDBTransaction}  transaction 事务，空则根据表名创建新事务
     * @returns {Promise<number>}             成功数量，删除全部时返回 -1
     */
    async bulkDelete(name, keys = [], transaction = null) {
      // 如果 keys 为空，删除全部数据
      if (keys.length === 0) {
        // 清空数据
        await this.clear(name, null, transaction);

        return -1;
      }

      // 等待操作结果
      const result = await Promise.all(
        keys.map((item) =>
          this.delete(name, item, transaction)
            .then(() => true)
            .catch(() => false)
        )
      );

      // 返回受影响的数量
      return result.filter((item) => item).length;
    }

    /**
     * 批量插入或修改指定表的数据
     * @param   {String}          name        表名
     * @param   {Array}           data        数据集合
     * @param   {IDBTransaction}  transaction 事务，空则根据表名创建新事务
     * @returns {Promise<number>}             成功数量
     */
    async bulkPut(name, data, transaction = null) {
      // 等待操作结果
      const result = await Promise.all(
        data.map((item) =>
          this.put(name, item, transaction)
            .then(() => true)
            .catch(() => false)
        )
      );

      // 返回受影响的数量
      return result.filter((item) => item).length;
    }

    /**
     * 批量获取指定表的数据
     * @param   {String}          name        表名
     * @param   {Array<String>}   keys        主键集合，空则获取全部
     * @param   {IDBTransaction}  transaction 事务，空则根据表名创建新事务
     * @returns {Promise<Array>}              数据集合
     */
    async bulkGet(name, keys = [], transaction = null) {
      // 如果 keys 为空，查询全部数据
      if (keys.length === 0) {
        // 获取表
        const store = await this.getStore(name, transaction);

        // 查询数据
        const result = await new Promise((resolve, reject) => {
          // 创建请求
          const request = store.getAll();

          // 成功后处理
          request.onsuccess = (event) => {
            resolve(event.target.result || []);
          };

          // 失败后处理
          request.onerror = (event) => {
            reject(event);
          };
        });

        // 返回结果
        return result;
      }

      // 返回符合的结果
      const result = [];

      await Promise.all(
        keys.map((key) =>
          this.get(name, key, transaction)
            .then((item) => {
              result.push(item);
            })
            .catch(() => {})
        )
      );

      return result;
    }
  }

  /**
   * 油猴存储
   *
   * 虽然使用了不支持 Promise 的 GM_getValue 与 GM_setValue，但是为了配合 IndexedDB，统一视为 Promise
   */
  class GMStorage extends DBStorage {
    /**
     * 清除指定表的数据
     * @param   {String}                                                  name  表名
     * @param   {(store: IDBObjectStore) => IDBRequest<IDBCursor | null>} range 清除范围
     * @returns {Promise}
     */
    async clear(name, range = null) {
      // 如果支持 IndexedDB，使用 IndexedDB
      if (super.isSupport()) {
        return super.clear(name, range);
      }

      // 清除全部数据
      GM_setValue(name, {});
    }

    /**
     * 插入指定表的数据
     * @param   {String}          name        表名
     * @param   {*}               data        数据
     * @returns {Promise}
     */
    async add(name, data) {
      // 如果不在模块列表里，写入全部数据
      if (Object.hasOwn(modules, name) === false) {
        return GM_setValue(name, data);
      }

      // 如果支持 IndexedDB，使用 IndexedDB
      if (super.isSupport()) {
        return super.add(name, data);
      }

      // 获取对应的主键
      const keyPath = modules[name].keyPath;
      const key = data[keyPath];

      // 如果数据中不包含主键，抛出异常
      if (key === undefined) {
        throw new Error();
      }

      // 获取全部数据
      const values = GM_getValue(name, {});

      // 如果对应主键已存在，抛出异常
      if (Object.hasOwn(values, key)) {
        throw new Error();
      }

      // 插入数据
      values[key] = data;

      // 保存数据
      GM_setValue(name, values);
    }

    /**
     * 删除指定表的数据
     * @param   {String}          name        表名
     * @param   {String}          key         主键
     * @returns {Promise}
     */
    async delete(name, key) {
      // 如果不在模块列表里，忽略 key，删除全部数据
      if (Object.hasOwn(modules, name) === false) {
        return GM_setValue(name, {});
      }

      // 如果支持 IndexedDB，使用 IndexedDB
      if (super.isSupport()) {
        return super.delete(name, key);
      }

      // 获取全部数据
      const values = GM_getValue(name, {});

      // 如果对应主键不存在，抛出异常
      if (Object.hasOwn(values, key) === false) {
        throw new Error();
      }

      // 删除数据
      delete values[key];

      // 保存数据
      GM_setValue(name, values);
    }

    /**
     * 插入或修改指定表的数据
     * @param   {String}          name        表名
     * @param   {*}               data        数据
     * @returns {Promise}
     */
    async put(name, data) {
      // 如果不在模块列表里，写入全部数据
      if (Object.hasOwn(modules, name) === false) {
        return GM_setValue(name, data);
      }

      // 如果支持 IndexedDB，使用 IndexedDB
      if (super.isSupport()) {
        return super.put(name, data);
      }

      // 获取对应的主键
      const keyPath = modules[name].keyPath;
      const key = data[keyPath];

      // 如果数据中不包含主键，抛出异常
      if (key === undefined) {
        throw new Error();
      }

      // 获取全部数据
      const values = GM_getValue(name, {});

      // 插入或修改数据
      values[key] = data;

      // 保存数据
      GM_setValue(name, values);
    }

    /**
     * 获取指定表的数据
     * @param   {String}          name        表名
     * @param   {String}          key         主键
     * @returns {Promise}                     数据
     */
    async get(name, key) {
      // 如果不在模块列表里，忽略 key，返回全部数据
      if (Object.hasOwn(modules, name) === false) {
        return GM_getValue(name);
      }

      // 如果支持 IndexedDB，使用 IndexedDB
      if (super.isSupport()) {
        return super.get(name, key);
      }

      // 获取全部数据
      const values = GM_getValue(name, {});

      // 如果对应主键不存在，抛出异常
      if (Object.hasOwn(values, key) === false) {
        throw new Error();
      }

      // 返回结果
      return values[key];
    }

    /**
     * 批量插入指定表的数据
     * @param   {String}          name        表名
     * @param   {Array}           data        数据集合
     * @returns {Promise<number>}             成功数量
     */
    async bulkAdd(name, data) {
      // 如果不在模块列表里，写入全部数据
      if (Object.hasOwn(modules, name) === false) {
        return GM_setValue(name, {});
      }

      // 如果支持 IndexedDB，使用 IndexedDB
      if (super.isSupport()) {
        return super.bulkAdd(name, data);
      }

      // 获取对应的主键
      const keyPath = modules[name].keyPath;

      // 获取全部数据
      const values = GM_getValue(name, {});

      // 添加数据
      const result = data.map((item) => {
        const key = item[keyPath];

        // 如果数据中不包含主键，抛出异常
        if (key === undefined) {
          return false;
        }

        // 如果对应主键已存在，抛出异常
        if (Object.hasOwn(values, key)) {
          return false;
        }

        // 插入数据
        values[key] = item;

        return true;
      });

      // 保存数据
      GM_setValue(name, values);

      // 返回受影响的数量
      return result.filter((item) => item).length;
    }

    /**
     * 批量删除指定表的数据
     * @param   {String}          name        表名
     * @param   {Array<String>}   keys        主键集合，空则删除全部
     * @returns {Promise<number>}             成功数量，删除全部时返回 -1
     */
    async bulkDelete(name, keys = []) {
      // 如果不在模块列表里，忽略 keys，删除全部数据
      if (Object.hasOwn(modules, name) === false) {
        return GM_setValue(name, {});
      }

      // 如果支持 IndexedDB，使用 IndexedDB
      if (super.isSupport()) {
        return super.bulkDelete(name, keys);
      }

      // 如果 keys 为空，删除全部数据
      if (keys.length === 0) {
        await this.clear(name, null);

        return -1;
      }

      // 获取全部数据
      const values = GM_getValue(name, {});

      // 删除数据
      const result = keys.map((key) => {
        // 如果对应主键不存在，抛出异常
        if (Object.hasOwn(values, key) === false) {
          return false;
        }

        // 删除数据
        delete values[key];

        return true;
      });

      // 保存数据
      GM_setValue(name, values);

      // 返回受影响的数量
      return result.filter((item) => item).length;
    }

    /**
     * 批量插入或修改指定表的数据
     * @param   {String}          name        表名
     * @param   {Array}           data        数据集合
     * @returns {Promise<number>}             成功数量
     */
    async bulkPut(name, data) {
      // 如果不在模块列表里，写入全部数据
      if (Object.hasOwn(modules, name) === false) {
        return GM_setValue(name, data);
      }

      // 如果支持 IndexedDB，使用 IndexedDB
      if (super.isSupport()) {
        return super.bulkPut(name, keys);
      }

      // 获取对应的主键
      const keyPath = modules[name].keyPath;

      // 获取全部数据
      const values = GM_getValue(name, {});

      // 添加数据
      const result = data.map((item) => {
        const key = item[keyPath];

        // 如果数据中不包含主键，抛出异常
        if (key === undefined) {
          return false;
        }

        // 插入数据
        values[key] = item;

        return true;
      });

      // 保存数据
      GM_setValue(name, values);

      // 返回受影响的数量
      return result.filter((item) => item).length;
    }

    /**
     * 批量获取指定表的数据，如果不在模块列表里，返回全部数据
     * @param   {String}          name        表名
     * @param   {Array<String>}   keys        主键集合，空则获取全部
     * @returns {Promise<Array>}              数据集合
     */
    async bulkGet(name, keys = []) {
      // 如果不在模块列表里，忽略 keys，返回全部数据
      if (Object.hasOwn(modules, name) === false) {
        return GM_getValue(name);
      }

      // 如果支持 IndexedDB，使用 IndexedDB
      if (super.isSupport()) {
        return super.bulkGet(name, keys);
      }

      // 获取全部数据
      const values = GM_getValue(name, {});

      // 如果 keys 为空，返回全部数据
      if (keys.length === 0) {
        return Object.values(values);
      }

      // 返回符合的结果
      const result = [];

      keys.forEach((key) => {
        if (Object.hasOwn(values, key)) {
          result.push(values[key]);
        }
      });

      return result;
    }
  }

  /**
   * 缓存管理
   *
   * 在存储的基础上，增加了过期时间和持久化选项，自动清理缓存
   */
  class Cache extends GMStorage {
    /**
     * 清除指定表的数据
     * @param   {String}  name       表名
     * @param   {Boolean} onlyExpire 是否只清除超时数据
     * @returns {Promise}
     */
    async clear(name, onlyExpire = false) {
      // 如果不在模块里，直接清除
      if (Object.hasOwn(modules, name) === false) {
        return super.clear(name);
      }

      // 如果只清除超时数据为否，直接清除
      if (onlyExpire === false) {
        return super.clear(name);
      }

      // 读取模块配置
      const { expireTime, persistent } = modules[name];

      // 持久化
      if (persistent) {
        return;
      }

      // 清除超时数据
      return super.clear(name, (store) =>
        store
          .index("timestamp")
          .openKeyCursor(IDBKeyRange.upperBound(Date.now() - expireTime))
      );
    }

    /**
     * 插入指定表的数据，并增加 timestamp
     * @param   {String}          name        表名
     * @param   {*}               data        数据
     * @returns {Promise}
     */
    async add(name, data) {
      // 如果在模块里，增加 timestamp
      if (Object.hasOwn(modules, name)) {
        data.timestamp = data.timestamp || new Date().getTime();
      }

      return super.add(name, data);
    }

    /**
     * 插入或修改指定表的数据，并增加 timestamp
     * @param   {String}          name        表名
     * @param   {*}               data        数据
     * @returns {Promise}
     */
    async put(name, data) {
      // 如果在模块里，增加 timestamp
      if (Object.hasOwn(modules, name)) {
        data.timestamp = data.timestamp || new Date().getTime();
      }

      return super.put(name, data);
    }

    /**
     * 获取指定表的数据，并移除过期数据
     * @param   {String}          name        表名
     * @param   {String}          key         主键
     * @returns {Promise}                     数据
     */
    async get(name, key) {
      // 获取数据
      const value = await super.get(name, key).catch(() => null);

      // 如果不在模块里，直接返回结果
      if (Object.hasOwn(modules, name) === false) {
        return value;
      }

      // 如果有结果的话，移除超时数据
      if (value) {
        // 读取模块配置
        const { expireTime, persistent } = modules[name];

        // 持久化或未超时
        if (persistent || value.timestamp + expireTime > new Date().getTime()) {
          return value;
        }

        // 移除超时数据
        await super.delete(name, key);
      }

      return null;
    }

    /**
     * 批量插入指定表的数据，并增加 timestamp
     * @param   {String}          name        表名
     * @param   {Array}           data        数据集合
     * @returns {Promise<number>}             成功数量
     */
    async bulkAdd(name, data) {
      // 如果在模块里，增加 timestamp
      if (Object.hasOwn(modules, name)) {
        data.forEach((item) => {
          item.timestamp = item.timestamp || new Date().getTime();
        });
      }

      return super.bulkAdd(name, data);
    }

    /**
     * 批量删除指定表的数据
     * @param   {String}          name        表名
     * @param   {Array<String>}   keys        主键集合，空则删除全部
     * @param   {boolean}         force       是否强制删除，否则只删除过期数据
     * @returns {Promise<number>}             成功数量，删除全部时返回 -1
     */
    async bulkDelete(name, keys = [], force = false) {
      // 如果不在模块里，强制删除
      if (Object.hasOwn(modules, name) === false) {
        force = true;
      }

      // 强制删除
      if (force) {
        return super.bulkDelete(name, keys);
      }

      // 批量获取指定表的数据，并移除过期数据
      const result = this.bulkGet(name, keys);

      // 返回成功数量
      if (keys.length === 0) {
        return -1;
      }

      return keys.length - result.length;
    }

    /**
     * 批量插入或修改指定表的数据，并增加 timestamp
     * @param   {String}          name        表名
     * @param   {Array}           data        数据集合
     * @returns {Promise<number>}             成功数量
     */
    async bulkPut(name, data) {
      // 如果在模块里，增加 timestamp
      if (Object.hasOwn(modules, name)) {
        data.forEach((item) => {
          item.timestamp = item.timestamp || new Date().getTime();
        });
      }

      return super.bulkPut(name, data);
    }

    /**
     * 批量获取指定表的数据，并移除过期数据
     * @param   {String}          name        表名
     * @param   {Array<String>}   keys        主键集合，空则获取全部
     * @returns {Promise<Array>}              数据集合
     */
    async bulkGet(name, keys = []) {
      // 获取数据
      const values = await super.bulkGet(name, keys).catch(() => []);

      // 如果不在模块里，直接返回结果
      if (Object.hasOwn(modules, name) === false) {
        return values;
      }

      // 读取模块配置
      const { keyPath, expireTime, persistent } = modules[name];

      // 筛选出超时数据
      const result = [];
      const expired = [];

      values.forEach((value) => {
        // 持久化或未超时
        if (persistent || value.timestamp + expireTime > new Date().getTime()) {
          result.push(value);
          return;
        }

        // 记录超时数据
        expired.push(value[keyPath]);
      });

      // 移除超时数据
      await super.bulkDelete(name, expired);

      // 返回结果
      return result;
    }
  }

  /**
   * API
   */
  class API {
    /**
     * 缓存管理
     */
    cache;

    /**
     * 队列
     */
    queue;

    /**
     * 初始化并绑定缓存管理
     * @param {Cache} cache 缓存管理
     */
    constructor(cache) {
      this.cache = cache;
      this.queue = new Queue();
    }

    /**
     * 简单的统一请求
     * @param {String}  url    请求地址
     * @param {Object}  config 请求参数
     * @param {Boolean} toJSON 是否转为 JSON 格式
     */
    async request(url, config = {}, toJSON = true) {
      const userAgent =
        (await this.cache.get(USER_AGENT_KEY)) || "Nga_Official";

      const response = await fetch(url, {
        headers: {
          Referer: "",
          "X-User-Agent": userAgent,
        },
        ...config,
      });

      const result = await Tools.readForumData(response, toJSON);

      return result;
    }

    /**
     * 获取用户主题数量
     * @param {number} uid 用户 ID
     */
    async getTopicNum(uid) {
      const name = "TOPIC_NUM_CACHE";
      const { expireTime } = modules[name];

      const api = `/thread.php?lite=js&authorid=${uid}`;

      const cache = await this.cache.get(name, uid);

      // 仍在缓存期间内，直接返回
      if (cache) {
        const expired = cache.timestamp + expireTime < new Date().getTime();

        if (expired === false) {
          return cache.count;
        }
      }

      // 请求用户信息，获取发帖数量
      const { posts } = await this.getUserInfo(uid);

      // 发帖数量不准，且可能错误的返回 0
      const value = posts || 0;

      // 发帖数量在泥潭其他接口里命名为 postnum
      const postnum = (() => {
        if (value > 0) {
          return value;
        }

        if (cache) {
          return cache.postnum || 0;
        }

        return 0;
      })();

      // 当发帖数量发生变化时，再重新请求数据
      const needRequest = (() => {
        if (value > 0 && cache) {
          return cache.postnum !== value;
        }

        return true;
      })();

      // 需要重新请求
      if (needRequest) {
        // 由于泥潭接口限制，同步使用队列请求数据
        const task = () =>
          new Promise(async (resolve, reject) => {
            const result = await this.request(api);

            // 服务器可能返回错误，遇到这种情况下，需要保留缓存
            if (result.data && Number.isInteger(result.data.__ROWS)) {
              this.cache.put(name, {
                uid,
                count: result.data.__ROWS,
                rencentTopics: result.data.__T,
                postnum,
              });

              resolve();
              return;
            }

            reject();
          });

        // 先尝试请求一次，成功后直接返回结果，否则加入队列
        try {
          if (this.queue.state === "IDLE") {
            await task();

            const { count } = await this.cache.get(name, uid);

            return count;
          }

          throw new Error();
        } catch {
          this.queue.enqueue(uid, task);
        }
      }

      // 直接返回缓存结果
      const count = cache ? cache.count : 0;
      const rencentTopics = cache ? cache.rencentTopics : [];

      // 更新缓存
      this.cache.put(name, {
        uid,
        count,
        rencentTopics,
        postnum,
      });

      return count;
    }

    /**
     * 获取用户近期主题
     * @param {number} uid 用户 ID
     */
    async getTopicRencent(uid) {
      const name = "TOPIC_NUM_CACHE";

      // 请求用户主题数量
      const count = await this.getTopicNum(uid);

      // 如果存在结果，读取缓存
      if (count > 0) {
        const cache = await this.cache.get(name, uid);

        if (cache) {
          return cache.rencentTopics || [];
        }
      }

      return [];
    }

    /**
     * 获取用户信息
     * @param {number} uid 用户 ID
     */
    async getUserInfo(uid) {
      const name = "USER_INFO_CACHE";

      const api = `nuke.php?func=ucp&uid=${uid}`;

      const cache = await this.cache.get(name, uid);

      if (cache) {
        return cache.data;
      }

      const result = await this.request(api, {}, false);

      const data = (() => {
        const text = Tools.searchPair(result, `__UCPUSER =`);

        if (text) {
          try {
            return JSON.parse(text);
          } catch {
            return null;
          }
        }

        return null;
      })();

      if (data) {
        this.cache.put(name, {
          uid,
          data,
        });
      }

      return data || {};
    }

    /**
     * 获取属地列表
     * @param {number} uid 用户 ID
     */
    async getIpLocations(uid) {
      const name = "USER_IPLOC_CACHE";
      const { expireTime } = modules[name];

      const cache = await this.cache.get(name, uid);

      // 仍在缓存期间内，直接返回
      if (cache) {
        const expired = cache.timestamp + expireTime < new Date().getTime();

        if (expired === false) {
          return cache.data;
        }
      }

      // 属地列表
      const data = cache ? cache.data : [];

      // 请求属地
      const { ipLoc } = await this.getUserInfo(uid);

      // 写入缓存
      if (ipLoc) {
        const index = data.findIndex((item) => {
          return item.ipLoc === ipLoc;
        });

        if (index >= 0) {
          data.splice(index, 1);
        }

        data.unshift({
          ipLoc,
          timestamp: new Date().getTime(),
        });

        this.cache.put(name, {
          uid,
          data,
        });
      }

      // 返回结果
      return data;
    }

    /**
     * 获取帖子内容、用户信息（主要是发帖数量，常规的获取用户信息方法不一定有结果）、版面声望
     * @param {number} tid 主题 ID
     * @param {number} pid 回复 ID
     */
    async getPostInfo(tid, pid) {
      const name = "PAGE_CACHE";

      const api = pid ? `/read.php?pid=${pid}` : `/read.php?tid=${tid}`;

      const cache = await this.cache.get(name, api);

      if (cache) {
        return cache.data;
      }

      const result = await this.request(api, {}, false);

      const parser = new DOMParser();

      const doc = parser.parseFromString(result, "text/html");

      // 声明返回值
      const data = {
        subject: "",
        content: "",
        userInfo: null,
        reputation: NaN,
      };

      // 验证帖子正常
      const verify = doc.querySelector("#m_posts");

      if (verify) {
        // 取得顶楼 UID
        data.uid = (() => {
          const ele = doc.querySelector("#postauthor0");

          if (ele) {
            const res = ele.getAttribute("href").match(/uid=(\S+)/);

            if (res) {
              return res[1];
            }
          }

          return 0;
        })();

        // 取得顶楼标题
        data.subject = doc.querySelector("#postsubject0").innerHTML;

        // 取得顶楼内容
        data.content = doc.querySelector("#postcontent0").innerHTML;

        // 非匿名用户可以继续取得用户信息和版面声望
        if (data.uid > 0) {
          // 取得用户信息
          data.userInfo = (() => {
            const text = Tools.searchPair(result, `"${data.uid}":`);

            if (text) {
              try {
                return JSON.parse(text);
              } catch {
                return null;
              }
            }

            return null;
          })();

          // 取得用户声望
          data.reputation = (() => {
            const reputations = (() => {
              const text = Tools.searchPair(result, `"__REPUTATIONS":`);

              if (text) {
                try {
                  return JSON.parse(text);
                } catch {
                  return null;
                }
              }

              return null;
            })();

            if (reputations) {
              for (let fid in reputations) {
                return reputations[fid][data.uid] || 0;
              }
            }

            return NaN;
          })();
        }
      }

      // 写入缓存
      this.cache.put(name, {
        url: api,
        data,
      });

      // 返回结果
      return data;
    }

    /**
     * 获取版面信息
     * @param {number} fid 版面 ID
     */
    async getForumInfo(fid) {
      if (Number.isNaN(fid)) {
        return null;
      }

      const api = `/thread.php?lite=js&fid=${fid}`;

      const result = await this.request(api);

      const info = result.data ? result.data.__F : null;

      return info;
    }

    /**
     * 获取版面发言记录
     * @param {number} fid 版面 ID
     * @param {number} uid 用户 ID
     */
    async getForumPosted(fid, uid) {
      const name = "FORUM_POSTED_CACHE";
      const { expireTime } = modules[name];

      const api = `/thread.php?lite=js&authorid=${uid}&fid=${fid}`;

      const cache = await this.cache.get(name, api);

      if (cache) {
        // 发言是无法撤销的，只要有记录就永远不需要再获取
        // 手动处理没有记录的缓存数据
        const expired = cache.timestamp + expireTime < new Date().getTime();

        if (expired && cache.data === false) {
          await this.cache.delete(name, api);
        }

        return cache.data;
      }

      let isComplete = false;
      let isBusy = false;

      const func = async (url) => {
        if (isComplete || isBusy) {
          return;
        }

        const result = await this.request(url, {}, false);

        // 将所有匹配的 FID 写入缓存，即使并不在设置里
        const matched = result.match(/"fid":(-?\d+),/g);

        if (matched) {
          const list = [
            ...new Set(
              matched.map((item) => parseInt(item.match(/-?\d+/)[0], 10))
            ),
          ];

          list.forEach((item) => {
            const key = api.replace(`&fid=${fid}`, `&fid=${item}`);

            // 写入缓存
            this.cache.put(name, {
              url: key,
              data: true,
            });

            // 已有结果，无需继续查询
            if (fid === item) {
              isComplete = true;
            }
          });
        }

        // 泥潭给版面查询接口增加了限制，经常会出现“服务器忙,请稍后重试”的错误
        if (result.indexOf("服务器忙") > 0) {
          isBusy = true;
        }
      };

      // 先获取回复记录的第一页，顺便可以获取其他版面的记录
      // 没有再通过版面接口获取，避免频繁出现“服务器忙,请稍后重试”的错误
      await func(api.replace(`&fid=${fid}`, `&searchpost=1`));
      await func(api + "&searchpost=1");
      await func(api);

      // 无论成功与否都写入缓存
      if (isComplete === false) {
        // 遇到服务器忙的情况，手动调整缓存时间至 1 小时
        const timestamp = isBusy
          ? new Date().getTime() - (expireTime - 1000 * 60 * 60)
          : new Date().getTime();

        // 写入失败缓存
        this.cache.put(name, {
          url: api,
          data: false,
          timestamp,
        });
      }

      return isComplete;
    }

    /**
     * 获取用户的曾用名
     * @param {number} uid 用户 ID
     */
    async getUsernameChanged(uid) {
      const name = "USER_NAME_CHANGED";
      const { expireTime } = modules[name];

      const api = `/nuke.php?lite=js&__lib=ucp&__act=oldname&uid=${uid}`;

      const cache = await this.cache.get(name, uid);

      // 仍在缓存期间内，直接返回
      if (cache) {
        const expired = cache.timestamp + expireTime < new Date().getTime();

        if (expired === false) {
          return cache.data;
        }
      }

      // 请求用户信息
      const { usernameChanged } = await this.getUserInfo(uid);

      // 如果有修改记录
      if (usernameChanged) {
        // 请求数据
        const result = await this.request(api);

        // 取得结果
        const data = result.data ? result.data[0] : null;

        // 更新缓存
        this.cache.put(name, {
          uid,
          data,
        });

        return data;
      }

      return null;
    }

    /**
     * 获取用户绑定的 Steam 信息
     * @param {number} uid 用户 ID
     */
    async getSteamInfo(uid) {
      const name = "USER_STEAM_INFO";
      const { expireTime } = modules[name];

      const api = `/nuke.php?lite=js&__lib=steam&__act=steam_user_info&user_id=${uid}`;

      const cache = await this.cache.get(name, uid);

      // 仍在缓存期间内，直接返回
      if (cache) {
        const expired = cache.timestamp + expireTime < new Date().getTime();

        if (expired === false) {
          return cache.data;
        }
      }

      // 请求数据
      // Steam ID 64 位会超出 JavaScript Number 长度，需要手动处理
      const result = await this.request(
        api,
        {
          method: "POST",
        },
        false
      );

      // 先转换成 JSON
      const resultJSON = JSON.parse(result);

      // 取得结果
      const data = resultJSON.data ? resultJSON.data[0] : null;

      // 如果有绑定的数据，从原始数据中取得数据，并转为 String 格式
      if (data.steam_user_id) {
        const matched = result.match(/"steam_user_id":(\d+),/);

        if (matched) {
          data.steam_user_id = String(matched[1]);
        }
      }

      // 更新缓存
      this.cache.put(name, {
        uid,
        data,
      });

      return data;
    }

    /**
     * 获取用户绑定的 PSN 信息
     * @param {number} uid 用户 ID
     */
    async getPSNInfo(uid) {
      const name = "USER_PSN_INFO";
      const { expireTime } = modules[name];

      const api = `/nuke.php?lite=js&__lib=psn&__act=psn_user_info&user_id=${uid}`;

      const cache = await this.cache.get(name, uid);

      // 仍在缓存期间内，直接返回
      if (cache) {
        const expired = cache.timestamp + expireTime < new Date().getTime();

        if (expired === false) {
          return cache.data;
        }
      }

      // 请求数据
      // PSN ID 64 位会超出 JavaScript Number 长度，需要手动处理
      const result = await this.request(
        api,
        {
          method: "POST",
        },
        false
      );

      // 先转换成 JSON
      const resultJSON = JSON.parse(result);

      // 取得结果
      const data = resultJSON.data ? resultJSON.data[0] : null;

      // 如果有绑定的数据，从原始数据中取得数据，并转为 String 格式
      if (data.psn_user_id) {
        const matched = result.match(/"psn_user_id":(\d+),/);

        if (matched) {
          data.psn_user_id = String(matched[1]);
        }
      }

      // 更新缓存
      this.cache.put(name, {
        uid,
        data,
      });

      return data;
    }

    /**
     * 获取用户绑定的 NS 信息
     * @param {number} uid 用户 ID
     */
    async getNintendoInfo(uid) {
      const name = "USER_NINTENDO_INFO";
      const { expireTime } = modules[name];

      const api = `/nuke.php?lite=js&__lib=nintendo&__act=user_info&user_id=${uid}`;

      const cache = await this.cache.get(name, uid);

      // 仍在缓存期间内，直接返回
      if (cache) {
        const expired = cache.timestamp + expireTime < new Date().getTime();

        if (expired === false) {
          return cache.data;
        }
      }

      // 请求数据
      const result = await this.request(api, {
        method: "POST",
      });

      // 取得结果
      const data = result.data ? result.data[0] : null;

      // 更新缓存
      this.cache.put(name, {
        uid,
        data,
      });

      return data;
    }

    /**
     * 获取用户绑定的原神信息
     * @param {number} uid 用户 ID
     */
    async getGenshinInfo(uid) {
      const name = "USER_GENSHIN_INFO";
      const { expireTime } = modules[name];

      const api = `/nuke.php?lite=js&__lib=genshin&__act=get_user&uid=${uid}`;

      const cache = await this.cache.get(name, uid);

      // 仍在缓存期间内，直接返回
      if (cache) {
        const expired = cache.timestamp + expireTime < new Date().getTime();

        if (expired === false) {
          return cache.data;
        }
      }

      // 请求数据
      const result = await this.request(api, {
        method: "POST",
      });

      // 取得结果
      const data = result.data ? result.data[0] : null;

      // 更新缓存
      this.cache.put(name, {
        uid,
        data,
      });

      return data;
    }

    /**
     * 获取用户绑定的深空之眼信息
     * @param {number} uid 用户 ID
     */
    async getSKZYInfo(uid) {
      const name = "USER_SKZY_INFO";
      const { expireTime } = modules[name];

      const api = `/nuke.php?lite=js&__lib=auth_ys4fun&__act=skzy_user_game&user_id=${uid}`;

      const cache = await this.cache.get(name, uid);

      // 仍在缓存期间内，直接返回
      if (cache) {
        const expired = cache.timestamp + expireTime < new Date().getTime();

        if (expired === false) {
          return cache.data;
        }
      }

      // 请求数据
      const result = await this.request(api, {
        method: "POST",
      });

      // 取得结果
      const data = result.data ? result.data[0] : null;

      // 更新缓存
      this.cache.put(name, {
        uid,
        data,
      });

      return data;
    }

    /**
     * 获取用户绑定的游戏信息
     * @param {number} uid 用户 ID
     */
    async getUserGameInfo(uid) {
      // 请求 Steam 信息
      const steam = await this.getSteamInfo(uid);

      // 请求 PSN 信息
      const psn = await this.getPSNInfo(uid);

      // 请求 NS 信息
      const nintendo = await this.getNintendoInfo(uid);

      // 请求原神信息
      const genshin = await this.getGenshinInfo(uid);

      // 请求深空之眼信息
      const skzy = await this.getSKZYInfo(uid);

      // 返回结果
      return {
        steam,
        psn,
        nintendo,
        genshin,
        skzy,
      };
    }
  }

  /**
   * 注册脚本菜单
   * @param {Cache} cache 缓存管理
   */
  const registerMenu = async (cache) => {
    const data = (await cache.get(USER_AGENT_KEY)) || "Nga_Official";

    GM_registerMenuCommand(`修改UA：${data}`, () => {
      const value = prompt("修改UA", data);

      if (value) {
        cache.put(USER_AGENT_KEY, value);
        location.reload();
      }
    });
  };

  /**
   * 自动清理缓存
   * @param {Cache} cache 缓存管理
   */
  const autoClear = async (cache) =>
    Promise.all(Object.keys(modules).map((name) => cache.clear(name, true)));

  // 初始化事件
  return () => {
    // 防止重复初始化
    if (unsafeWindow.NLibrary === undefined) {
      // 初始化缓存和 API
      const cache = new Cache();
      const api = new API(cache);

      // 自动清理缓存
      autoClear(cache);

      // 写入全局变量
      unsafeWindow.NLibrary = {
        cache,
        api,
      };
    }

    const { cache, api } = unsafeWindow.NLibrary;

    // 注册脚本菜单
    registerMenu(cache);

    // 返回结果
    return {
      cache,
      api,
    };
  };
})();
