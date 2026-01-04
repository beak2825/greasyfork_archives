// ==UserScript==
// @name                SaveDoubanBroadcast
// @name:zh-cn          备份个人豆瓣广播至本地
// @namespace           https://github.com/JimSunJing
// @version             0.1.4
// @description         Save douban Broadcast from douban website. Target page: douban.com/mine/statuses
// @description:zh-cn   保存豆瓣广播内容到本地. 需要打开 douban.com/mine/statuses
// @author              JimSunJing
// @match               https://www.douban.com/people/*/statuses*
// @require             https://unpkg.com/dexie/dist/dexie.js
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/450765/SaveDoubanBroadcast.user.js
// @updateURL https://update.greasyfork.org/scripts/450765/SaveDoubanBroadcast.meta.js
// ==/UserScript==

(() => {
  'use strict';
  // 获取网页中每个广播对象
  let statuses;
  const DB_NAME = "dbBroadast";

  // inject style
  const injectStyle = () => {
    const style = document.createElement('style');
    style.innerHTML = `
      .btnS {
        background-color: #edf4ed;
        color: black;
        padding: 3px 6px;
        margin: 3px;
        border-radius: 7px;
        border: none;
      }
      .newBtnContainer {
        background-color: #fff6ed;
        padding: 10px;
        margin: 30px 0px;
        border-radius: 10px
      }
      .newInput {
        margin: 3px 0px;
        padding: 3px;
        width: 70%;
      }
    `;
    document.head.appendChild(style);
  }

  // create button
  const createBtnS = (innerT = '') => {
    let btn = document.createElement("button");
    btn.classList.add("btnS");
    btn.innerText = innerT;
    return btn;
  }


  const addScriptBtn = () => {
    // 在网页旁边的用户信息栏下添加按钮
    const aside = document.querySelector(".aside");

    // 添加一个控制新增按钮的div
    const newBtnContainer = document.createElement("div");
    newBtnContainer.classList.add("newBtnContainer");
    aside.appendChild(newBtnContainer);
    
    // 开始备份信息的按钮
    const btnBackup = createBtnS("备份该页广播");
    btnBackup.addEventListener("click", saveDexie);
    
    newBtnContainer.appendChild(btnBackup);
    newBtnContainer.appendChild(document.createElement("br"));
    
    // 添加清空 Dexie 按钮
    const btnClearDexie = createBtnS("清空数据");
    btnClearDexie.addEventListener("click", clearDexie);
    
    newBtnContainer.appendChild(btnClearDexie);
    newBtnContainer.appendChild(document.createElement("br"));
    
    // 添加导出 csv 按钮
    const btnExportCSV = createBtnS("保存为csv");
    btnExportCSV.addEventListener("click", exportCSV);
    
    newBtnContainer.appendChild(btnExportCSV);
    newBtnContainer.appendChild(document.createElement("br"));
    
    // notification
    const noti = document.createElement("p");
    noti.id = 'scriptNoti';
    newBtnContainer.appendChild(noti);
    
    // 自动翻页保存的表格
    autoForm();
    
    // 为每个广播添加伪删除按钮​
    for (let i = 0; i < statuses.length; i++) {
      // 创建隐藏按钮
      const container = document.createElement("div");
      container.style.display = 'flex';
      container.style.justifyContent = 'flex-end';

      const hide = createBtnS("隐藏");
      container.appendChild(hide);

      // 如果是转发的动态, 在按按钮的时候会跳转, 需要修改按钮位置
      if (/^status-real.*/.test(statuses[i].parentElement.className) && statuses[i - 1]) {
        hide.innerText = '↓隐藏↓';
        statuses[i - 1].appendChild(container);
        hide.addEventListener("click", () => {
          container.parentElement.nextElementSibling.remove();
          container.remove();
        })
      } else {
        statuses[i].appendChild(container);
        hide.addEventListener("click", () => {
          container.parentElement.remove();
        })
      }
      // console.log('appended hide:',i);

    }
  }

  // 设置自动备份
  const autoForm = () => {
    // add input
    let area = document.querySelector(".newBtnContainer");
    if (!area) {
      alert("脚本运行错误, 请刷新重试!");
      return null;
    }
    if (document.getElementById('auto-form') !== null) {
      return null;
    }
    let inputForm = document.createElement("form");
    inputForm.id = 'auto-form';
    inputForm.addEventListener("submit", e => {
      e.preventDefault();
      // alert(`form cont ${inputForm.elements.CONT.value}`);
      localStorage.setItem("cont", Math.floor(Number(inputForm.elements.CONT.value)));
      alert(`开始连续备份: ${localStorage.getItem("cont")}`);
      if(location.href.indexOf("?p=") < 0) {
        window.location.href = location.href + '?p=1&cont=' + localStorage.getItem("cont");
      }else {
        window.location.href = location.href + '&cont=' + localStorage.getItem("cont");
      }
    })
    area.appendChild(inputForm);

    let contInput = document.createElement("input");
    contInput.classList.add("newInput");
    contInput.setAttribute("placeholder", "输入要自动备份的页数");
    contInput.setAttribute("required", '');
    contInput.setAttribute("type", "number");
    contInput.setAttribute("name", "CONT");
    contInput.setAttribute("step", "1");
    inputForm.appendChild(contInput);

    let submitBtn = createBtnS("开始");
    submitBtn.setAttribute("type", "submit");
    inputForm.appendChild(document.createElement("br"));
    inputForm.appendChild(submitBtn);

  }

  const updateStatuses = () => {
    statuses = document.getElementsByClassName("status-item");
  }


  const clearStorage = (name) => {
    localStorage.removeItem(name);
  }

  const notification = (msg) => {
    document.getElementById("scriptNoti").innerText = msg;
  }

  // 备份该页的广播信息
  const backupStatuses = () => {
    updateStatuses();

    // extract status info from web
    const savedStatuses = [];
    for (let i = 0; i < statuses.length; i++) {
      if (/deleted/.test(statuses[i].classList)){
        continue;
      }
      // extract pure text of status
      const match = statuses[i].innerText;
      const full = match ? match.replace('\n', '')
        .match(/^.*(?=\s\d*?回应.*)|^.+/s)[0] : "";
      let saying = "";
      if (match.indexOf("\n\n") > -1) {
        saying = match ? match.split('\n\n')[1] : "";
      } else {
        const t = match ? match.replace('\n', '')
          .match(/^(.*\s转发:)(.*)(?=\s\d*?回应.*)|^.+/s)[2] : "";
        saying = t ? t.match(/^.*(?=\n.*)/)[0] : "";
      }
      let uid, sid, time, link;
      // status sid
      sid = statuses[i].getAttribute("data-sid");
      // author uid
      uid = statuses[i].getAttribute("data-uid");
      if (uid === null) {
        uid = document.querySelector(".aside .content a").href
          .match(/(?<=https:\/\/www.douban.com\/people\/).*(?=\/)/);
      }
      link = `https://www.douban.com/people/${uid}/status/${sid}/`;
      // status create time
      time = statuses[i].querySelector(".created_at").getAttribute("title");

      let row = {
        id: sid,
        sid: sid,
        saying: saying,
        full: full,
        uid: uid,
        link: link,
        created: time
      }
      // img links
      let pics = statuses[i].querySelectorAll(".pics-wrapper img");
      // console.log('pics', i, ':', pics);
      if (pics && pics.length > 0) {
        // console.log('status', i, 'adding pics');
        for (let j = 0; j < pics.length; j++){
          row[`img${j}`] = pics[j].src.replace('.webp','.jpg');
        }
      }
      if (match) savedStatuses.push(row);
    }

    // save statuses in Dexie
    // console.log('saved statuses', savedStatuses);
    return savedStatuses;
  }


  // save into Dexie
  const saveDexie = () => {
    const db = new Dexie(DB_NAME);

    db.version(1).stores({
      status: `
        id,sid,saying,full,uid,link,created
      `
    });

    const statuses = backupStatuses();
    db.status.bulkPut(statuses)
      .then(() => {
        console.log(`saved ${statuses.length} statuses.`);
        db.status.toCollection().count(count => {
          console.log(`Dexie current stores:`, count);
          notification(`已保存 ${count} 个广播.`);
        })
        let nextPage = document.querySelector(".paginator span.next a").href;
        const cont = localStorage.getItem("cont");
        if (statuses.length > 0 && nextPage && cont !== null && Number(cont) > 0) {
          nextPage = nextPage + `&cont=${Number(cont) - 1}`;
          localStorage.setItem("cont", Number(cont) - 1);
          window.location.href = nextPage;
        }
      }).catch(e => {
        console.error("error:", e);
      });
  
  }


  const clearDexie = () => {
    Dexie.delete(DB_NAME).then(() => {
      console.log("Database successfully deleted");
      notification("已清空保存的广播.");
    }).catch((err) => {
      console.error("Could not delete database",err);
    });
  }


  const exportCSV = () => {
    const db = new Dexie(DB_NAME);
    db.version(1).stores({
      status: `
        id,sid,saying,full,uid,link,created
      `
    });
    let pack = db.status.orderBy('created').reverse();
    pack.toArray().then(data => {
      data = data.map(e => {~
        delete e.id;
        return e;
      })

      let title = ['广播内容','广播带前缀','广播id','用户id','链接','时间','图片1','图片2',
      '图片3','图片4','图片5','图片6','图片7','图片8','图片9'];
      let key = ['saying','full','sid','uid','link','created', 'img0', 'img1','img2',
      'img3','img4','img5','img6','img7','img8'];

      JSonToCSV.setDataConver({
        data: data,
        fileName: 'broadcastBackUp_' + new Date().toISOString(),
        columns: {title, key}
      })
      // console.log("pack:", data);
    })
  }


  // 导出CSV函数
  // https://github.com/liqingzheng/pc/blob/master/JsonExportToCSV.js
  let JSonToCSV = {
    /*
     * obj是一个对象，其中包含有：
     * ## data 是导出的具体数据
     * ## fileName 是导出时保存的文件名称 是string格式
     * ## showLabel 表示是否显示表头 默认显示 是布尔格式
     * ## columns 是表头对象，且title和key必须一一对应，包含有
          title:[], // 表头展示的文字
          key:[], // 获取数据的Key
          formatter: function() // 自定义设置当前数据的 传入(key, value)
     */
    setDataConver: function (obj) {
      var bw = this.browser();
      if (bw['ie'] < 9) return; // IE9以下的
      var data = obj['data'],
        ShowLabel = typeof obj['showLabel'] === 'undefined' ? true : obj['showLabel'],
        fileName = (obj['fileName'] || 'UserExport') + '.csv',
        columns = obj['columns'] || {
          title: [],
          key: [],
          formatter: undefined
        };
      ShowLabel = typeof ShowLabel === 'undefined' ? true : ShowLabel;
      var row = "",
        CSV = '',
        key;
      // 如果要现实表头文字
      if (ShowLabel) {
        // 如果有传入自定义的表头文字
        if (columns.title.length) {
          columns.title.map(function (n) {
            row += n + ',';
          });
        } else {
          // 如果没有，就直接取数据第一条的对象的属性
          for (key in data[0]) row += key + ',';
        }
        row = row.slice(0, -1); // 删除最后一个,号，即a,b, => a,b
        CSV += row + '\r\n'; // 添加换行符号
      }
      // 具体的数据处理
      data.map(function (n) {
        row = '';
        // 如果存在自定义key值
        if (columns.key.length) {
          columns.key.map(function (m) {
            row += '"' + (typeof columns.formatter === 'function' ? columns.formatter(m, n[m]) || n[m] || '' : n[m] || '') + '",';
          });
        } else {
          for (key in n) {
            row += '"' + (typeof columns.formatter === 'function' ? columns.formatter(key, n[key]) || n[key] || '' : n[key] || '') + '",';
          }
        }
        row = row.slice(0, row.length - 1); // 删除最后一个,
        CSV += row + '\r\n'; // 添加换行符号
      });
      if (!CSV) return;
      this.SaveAs(fileName, CSV);
    },
    SaveAs: function (fileName, csvData) {
      var bw = this.browser();
      if (!bw['edge'] || !bw['ie']) {
        var alink = document.createElement("a");
        alink.id = "linkDwnldLink";
        alink.href = this.getDownloadUrl(csvData);
        document.body.appendChild(alink);
        var linkDom = document.getElementById('linkDwnldLink');
        linkDom.setAttribute('download', fileName);
        linkDom.click();
        document.body.removeChild(linkDom);
      } else if (bw['ie'] >= 10 || bw['edge'] == 'edge') {
        var _utf = "\uFEFF";
        var _csvData = new Blob([_utf + csvData], {
          type: 'text/csv'
        });
        navigator.msSaveBlob(_csvData, fileName);
      } else {
        var oWin = window.top.open("about:blank", "_blank");
        oWin.document.write('sep=,\r\n' + csvData);
        oWin.document.close();
        oWin.document.execCommand('SaveAs', true, fileName);
        oWin.close();
      }
    },
    getDownloadUrl: function (csvData) {
      var _utf = "\uFEFF"; // 为了使Excel以utf-8的编码模式，同时也是解决中文乱码的问题
      if (window.Blob && window.URL && window.URL.createObjectURL) {
        csvData = new Blob([_utf + csvData], {
          type: 'text/csv'
        });
        return URL.createObjectURL(csvData);
      }
      // return 'data:attachment/csv;charset=utf-8,' + _utf + encodeURIComponent(csvData);
    },
    browser: function () {
      var Sys = {};
      var ua = navigator.userAgent.toLowerCase();
      var s;
      (s = ua.indexOf('edge') !== -1 ? Sys.edge = 'edge' : ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
          (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
            (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
              (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
      return Sys;
    }
  };


  const init = () => {
    // 自动翻页判断
    if (location.href.indexOf('cont=') > -1) {
      if (location.href.indexOf('cont=0') > -1){
        saveDexie();
        window.location.href = location.href.split("&cont=0")[0];
      }
      // 自动翻页保存
      setTimeout(() => {
        saveDexie();
      }, 1500)
    } else {
      // 初次使用 && 自定义页面
      clearStorage("cont");
      injectStyle();
      updateStatuses();
      addScriptBtn();
    }
  }
  
  setTimeout(() => {
    if (document.querySelector('.pl2') !== null) {
      init();
    }
  }, 500)
  
})();
