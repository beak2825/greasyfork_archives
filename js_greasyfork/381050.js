// ==UserScript==
// @name         新浪股票 API 数据实时展示
// @namespace    https://github.com/yujinpan/tampermonkey-extension
// @version      1.1
// @license      MIT
// @description  将新浪股票接口的数据直接实时展示在浏览器的标签与页面上。
// @author       yujinpan
// @include      http*://hq.sinajs.cn/*
// @downloadURL https://update.greasyfork.org/scripts/381050/%E6%96%B0%E6%B5%AA%E8%82%A1%E7%A5%A8%20API%20%E6%95%B0%E6%8D%AE%E5%AE%9E%E6%97%B6%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/381050/%E6%96%B0%E6%B5%AA%E8%82%A1%E7%A5%A8%20API%20%E6%95%B0%E6%8D%AE%E5%AE%9E%E6%97%B6%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

class App {
  intervalId = 0;
  intervalTime = 3000;
  data = {};
  tableWrap = null;

  constructor(code) {
    this.code = code;
  }

  // 获取数据
  getData() {
    return fetch(`/list=${this.code}`)
    .then((res) => res.blob())
    .then((blob) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function () {
          resolve(reader.result);
        };
        reader.readAsText(blob, 'GBK');
      });
    });
  }

  // 格式化数据
  formatData(resultData) {
    try {
      const arr = resultData
      .match(/".*"/)[0]
      .replace(/"/g, '')
      .split(',');
      const reduce = arr[3] - arr[2];
      const percent = ((reduce / arr[2]) * 100).toFixed(2);
      this.data = {
        reduce,
        percent,
        date: arr[30],
        time: arr[31],
        name: arr[0],
        start: arr[1],
        end: arr[2],
        current: arr[3],
        max: arr[4],
        min: arr[5]
      };
    } catch (e) {
      console.log(e);
    }
  }

  // 设置title
  setTitle() {
    document.title = `${this.data.name} ${this.data.current} ${
      this.data.percent
    }%`;
  }

  // 渲染table
  renderTable() {
    const params = this.data;
    const sign = Math.sign(params.percent);
    const color = sign < 0 ? 'green' : sign === 0 ? 'gray' : 'red';

    // 如果没有容器就创建一个
    if (!this.tableWrap) {
      this.tableWrap = document.createElement('section');
      this.tableWrap.style = `
          padding: 0 20px;
          margin-right: 20px;
          border-right: 1px solid #ddd;
        `;
      document.body.appendChild(this.tableWrap);
    }

    this.tableWrap.innerHTML = `
        <h4>${params.date} ${params.time}</h4>
        <h4>${params.name} 
            <font color="${color}">
                ${params.current} ${params.percent}% ${params.reduce.toFixed(3)}
            </font>
        </h4>
        <table border="1">
        <thead>
            <tr>
                <td>今日开盘</td>
                <td>昨日收盘</td>
                <td>今日最高</td>
                <td>今日最低</td>
            </tr>
        </thead>
        </tbody>
            <tr>
                <td>${params.start}</td>
                <td>${params.end}</td>
                <td>${params.max}</td>
                <td>${params.min}</td>
            </tr>
        </tbody>
        </table>
        <hr style="margin-top: 30px;" />
        <div><img width="600px" height="330px" src="${this.getMinImageUrl()}" /></div>
        <div><img width="600px" height="330px" src="${this.getDayKImageUrl()}" /></div>
    `;
  }

  // 创建搜索
  renderSearch() {
    const searchHistoryElem = this.getSearchHistory()
    .map((item) => {
      return `<li><a href="/list=${item.code}">${item.name}（${
        item.code
      }）</a></li>`;
    })
    .join('');
    const elem = `
        <h5>搜索股票</h5>
        <input id="search" autocomplete="false" style="width: 180px;" placeholder="输入股票代码，例如 sh000001" />
        <button>搜索</button>
  
        <h5>搜索历史</h5>
        <ul>
          ${searchHistoryElem}
        </ul>
  
        <h5>指数</h5>
        <ul>
          <li><a href="/list=sh000001">上证指数</a></li>
        </ul>
      `;
    const searchWrap = document.createElement('section');
    searchWrap.innerHTML = elem;
    const inputElem = searchWrap.querySelector('input');

    // 点击与回车事件
    searchWrap.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON' && inputElem.value) {
        this.targetTo(inputElem.value);
      }
    });
    searchWrap.addEventListener('keyup', (e) => {
      if (e.keyCode === 13 && e.target.tagName === 'INPUT' && inputElem.value) {
        this.targetTo(inputElem.value);
      }
    });
    document.body.appendChild(searchWrap);
  }

  // 跳转
  targetTo(code) {
    location.href = `/list=${code}`;
  }

  // 获取搜索历史
  getSearchHistory() {
    const history = localStorage.getItem('history');
    if (history) {
      return JSON.parse(history);
    } else {
      return [];
    }
  }

  // 存储搜索历史
  setSearchHistory(code, name) {
    const history = this.getSearchHistory();
    const index = history.findIndex((item) => item.code === code);
    if (index !== -1) {
      history.splice(index, 1);
    }
    history.unshift({code, name});
    localStorage.setItem('history', JSON.stringify(history));
  }

  // 获取分时图
  getMinImageUrl() {
    return `http://image.sinajs.cn/newchart/min/n/${this.code}.gif?v=${Date.now()}`;
  }

  // 获取分时图
  getDayKImageUrl() {
    return `http://image.sinajs.cn/newchart/daily/n/${this.code}.gif?v=${Date.now()}`;
  }

  // 开始
  start() {
    const handle = () => {
      return this.getData().then((res) => {
        this.formatData(res);
        if (this.data.current) {
          this.setTitle();
          this.renderTable();
          return Promise.resolve(true);
        } else {
          alert('代码错误！');
          this.stop();
          return Promise.resolve(false);
        }
      });
    };
    this.intervalId = setInterval(() => handle(), this.intervalTime);

    document.body.innerHTML = '';
    document.body.style = `
        display: flex;
      `;
    handle().then((res) => {
      this.renderSearch();
      if (res) {
        this.setSearchHistory(
          location.pathname.replace('/list=', ''),
          this.data.name
        );
      }
    });
  }

  // 停止
  stop() {
    clearInterval(this.intervalId);
  }
}

// 初始化
(function () {
  const code = location.pathname.replace('/list=', '');
  const app = new App(code || 'sh000001');
  app.start();
})();
