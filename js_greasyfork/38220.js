
var mscststs = new class {
  sleep(miliseconds) {
    return new Promise(resolve => {
      setTimeout(() => { resolve(); }, miliseconds);
    });
  }
  async _Step(selector, callback, need_content, timeout) {
    while (timeout--) {
      if (document.querySelector(selector) === null) {
        await this.sleep(100);
        continue;
      } else {
        if (need_content) {
          if (document.querySelector(selector).innerText.length == 0) {
            await this.sleep(100);
            continue;
          }
        }
      }
      break;
    }

    callback(selector);
  }
  wait(selector, need_content = false, timeout = Infinity) {
    return new Promise(resolve => {
      this._Step(selector, function (selector) { resolve(document.querySelector(selector)); }, need_content, timeout);
    });
  }

  hijackXMLHttpRequest(options, selfWindow = self) {
    const rawXHR = selfWindow.XMLHttpRequest;
    selfWindow.XMLHttpRequest = function (...args) {
      const xhrInstance = new rawXHR(...args);
      // 下面将 xhrInstance 添加
      const xhrProxy = new Proxy(xhrInstance, {
        get: function (target, property) {
          if (typeof target[property] === "function") {
            return function (...args) {
              const before = options['before' + property] || ((...args) => { return args });
              const after = options['after' + property] || (_=>_);
              return after(target[property](...before(...args)));
              //return target[property](...args)
            }

          } else {
            return target[property]
          }
        }
      });
      return xhrProxy;
    }
    return function abort() {
      selfWindow.XMLHttpRequest = rawXHR;
    }
  }
}();
