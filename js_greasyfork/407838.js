// ==UserScript==
// @name         Magnet Link Downloader
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  Download magnet link automatically
// @author       sdfsung
// @run-at       document-idle
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @require      https://greasyfork.org/scripts/399614-tampermonkey-utils/code/tampermonkey_utils.js?version=788382
// @require      https://greasyfork.org/scripts/408004-websocket-wrapper/code/Websocket%20wrapper.js
// @connect      getnote.cf
// @match        https://115.com/?cid=1874191811511961169&offset=0&tab=download&mode=wangpan
// @classname    _115CloudDownloadWebPage
// @match        http://lx.heikeyun.com/Main.aspx*
// @classname    HkyMainWebPage
// @match        http://lx.heikeyun.com/HashList.aspx?*
// @classname    HkyHashListWebPage
// @match        http://lx.heikeyun.com*
// @classname    HkyMainWebPage
// @match        http://172.16.0.217:1880/middleware
// @classname    WebSocketListener
// @grant        GM_addValueChangeListener
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        window.focus
// @downloadURL https://update.greasyfork.org/scripts/407838/Magnet%20Link%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/407838/Magnet%20Link%20Downloader.meta.js
// ==/UserScript==

(function() {
  'use strict';

  TmUtils.send = async function(url, callback, { method = 'GET', data = '', headers = {}, timeout = 10000} = {}) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method,
        url,
        headers,
        data,
        timeout,
        onreadystatechange: function(o) {
          if (o.readyState === 4) {
            // o.status === 200
            if(o.status === 404) {
              reject(new Error(`Page Not Found (${url})`));
            }
            resolve(callback(o));
          }
        },
        onerror: function(e) {
          reject(new Error(e));
        },
        ontimeout: function() {
          reject(new Error(`Request timed out (${url})`));
        },
      })
    });
  };

  const convertSnifferLength = function(length) {
    // console.log(length);
    const results = length.split(/(?<=\d)\s*(?=[^.\d\s]+)/i);
    console.log(results);
    const name = {
      kib: 'kb',
      mib: 'mb',
      gib: 'gb',
    };

    const factor = {
      b: 1,
      kb: 1024,
      mb: 1048576,
      gb: 1073741824,
    };

    const unit = results[1].toLowerCase();
    const conver = name[unit] || unit;
    const size = ((results[0] * factor[conver]) / factor['mb']).toFixed(1);
    if (Number.isNaN(size)) throw Error('Can not convert the value (' + length + ')');
    // console.log(size);
    return size;
  };

  class Aria2 {
    constructor(server, token, port = 6800, {protocol = 'http'} = {}) {
      this.url = `${protocol}://${server}:${port}/jsonrpc`;
      this.token = token;
    }

    async sendJsonrpc(method, params = {}) {
      const response = await TmUtils.send(
        this.url,
        function(o){return o},
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          data: JSON.stringify({jsonrpc: '2.0', id: '5', method, params}),
        }
      );
      console.log(response);
      const {error, result:results} = JSON.parse(response.responseText);
      if(error) {
        throw new Error(`(${error.code}) ${error.message}`);
      }
      return results;
    }

    async tellWaiting() {
      return await this.sendJsonrpc('aria2.tellWaiting', [`token:${this.token}`, 0, 100]);
    }

    async tellActive() {
      return await this.sendJsonrpc('aria2.tellActive', [`token:${this.token}`]);
    }
  }

  class ValueStorage {
    constructor(key) {
      this.key = key;
    }

    addChangeListener(valueDelete = false) {
      GM_addValueChangeListener(this.key, (name, oldValue, newValue) => {
        console.log(`name: ${name}, oldValue: ${oldValue}, newValue: ${newValue}`);
        if (newValue) {
          if (valueDelete) GM_deleteValue(this.key);
          this.onchange(newValue);
        }
      });
      return this;
    }

    onchange(value) {}

    set(value) {
      GM_setValue(this.key, value);
    }

    get(def = undefined) {
      return GM_getValue(this.key, def);
    }
  }

  class MagnetStorage extends ValueStorage {
    constructor() {
      super('hky_magnet_args_storage');
    }
  }

  class MagnetFor115Storage extends ValueStorage {
    constructor() {
      super('magnet_for_115');
    }
  }

  class LogStorage extends ValueStorage {
    constructor() {
      super('log_for_magnet');
    }
  }

  class MagnetLog {
    static info(message) {
      MagnetLog._base(message, 'info');
    }

    static err(message) {
      MagnetLog._base(message, 'error');
    }

    static _base(message, type) {
      MagnetLog.logStorage.set(`${getTime()} ${type.toUpperCase()}: ${message}`);
    }
  }

  MagnetLog.logStorage = new LogStorage();

  const getTime = function() {
    const pad2 = function(n) { return n < 10 ? '0' + n : n };
    const date = new Date();
    return date.getFullYear().toString() + '-' +
      pad2(date.getMonth() + 1) + '-' +
      pad2(date.getDate()) + ' ' +
      pad2(date.getHours()) + ':' +
      pad2(date.getMinutes()) + ':' +
      pad2(date.getSeconds());
  };

  class ElemUtils {
    static querySelector(selector, node = document) {
      const el = node.querySelector(selector);
      if (!el) throw Error(`selector '${selector}' is not exist`);
      return el;
    }
  }

  class MagnetParser {
    constructor(hash, server = 'btsow.com', htmlStr) {
      this.hash = hash;
      this.server = server;
      this.htmlStr = htmlStr;
    }

    static getMagnetHash(magnet) {
      let match = /[\da-zA-Z]{32,40}/.exec(magnet)
      return (match ? match[0] : '');
    }

    async parse() {
      return new DOMParser().parseFromString(this.htmlStr, 'text/html');
      // const url = `https://${this.server}/torrent/detail/hash/${this.hash}`;
      // const callback = function(o) {return new DOMParser().parseFromString(o.responseText, 'text/html')};
      // return await TmUtils.send(url, callback);
    }

    async getItems(keyword='') {
      const itemFilter = keyword !== '';
      const re = itemFilter ? new RegExp(keyword.toLowerCase().replace(/[\W_]/g, ''),'g') : null;
      console.log(re);

      const htmlDom = await this.parse();
      console.log(htmlDom);

      const dataLists = htmlDom.querySelectorAll('.data-list');
      const dataList = dataLists[dataLists.length - 1];

      const itemNodes = dataList.querySelectorAll('.row');

      let arr = [];
      for (let len = itemNodes.length, i = 1; i < len; i++) {
        const node = itemNodes[i];

        const size = convertSnifferLength(node.querySelector('.size').innerText);
        console.log(size);
        if (itemFilter && size < 100) continue;

        const title = node.querySelector('.file').innerText;
        console.log(title);
        if (itemFilter && !re.test(title.toLowerCase().replace(/[\W_]hd[\W_]/gi, '').replace(/[\W_]/g, ''))) continue;

        const o = {
          node,
          title,
          size,
        };
        arr.push(o);
      }

      return arr;
    }
  }

  // Main classes
  const classes = (() => {
    const MAGNET_PREV = 'hky_magnet_prev';
    const MAGNET_DOWNLOAD_ALLOW = 'hky_magnet_download_allow';
    const MAGNET_RESOLVING = 'hky_magnet_resolving';
    const MAGNET_ARGS = 'hky_magnet_args';

    const STATUS_NEW = 0;
    const STATUS_DOWNLOADED = 1;

    class WebPage2 {
      constructor() {
        this.magnetStorage = new MagnetStorage().addChangeListener();
        this.hky = new HkyMainWebPage();
        this.init();
      }

      init() {
        this.magnetStorage.onchange = (async (data) => {
          await this.hky.run.bind(this.hky)();
        }).bind(this);
      }
    }

    class WebPage {
      constructor() {
        this.magnetStorage = new MagnetStorage().addChangeListener();
        // this.init();
      }

      init() {
        this.magnetStorage.onchange = (data) => {
          window.focus();
          window.open('http://lx.heikeyun.com/Main.aspx', '_self');
        };
      }
    }

    class HkyMainWebPage extends WebPage {
      constructor() {
        super();
        this.magnet = '';
        this.dir = '';
        this.keyword = '';
        this.status = '';
        this.storage = '';
      }

      setProps({ magnet, dir, keyword, status, storage }) {
        this.magnet = magnet;
        this.dir = dir;
        this.keyword = keyword;
        this.status = status;
        this.storage = storage;
      }

      async run() {
        if (Boolean(GM_getValue(MAGNET_RESOLVING, false))) {
          GM_setValue(MAGNET_RESOLVING, false);
          GM_setValue(MAGNET_DOWNLOAD_ALLOW, false);
          console.log('magnet resolve failed');
          MagnetLog.err('magnet resolve failed');
          return;
        };
        const magnetArgs = await this.getMagnetArgs();
        GM_setValue(MAGNET_ARGS, magnetArgs);

        if (magnetArgs.status === STATUS_DOWNLOADED) {
          console.log('already download');
          MagnetLog.err('already download');
          return;
        };
        if (magnetArgs.magnet === GM_getValue(MAGNET_PREV)) {
          console.log('same magnet with previous');
          MagnetLog.err('same magnet with previous');
          return;
        }
        this.setProps(magnetArgs);
        await this.resolveMagnet();
      }

      getMagnetArgs() {
        return JSON.parse(this.magnetStorage.get('{}'));
      }

      async resolveMagnet() {
        const { magnet, dir, keyword, btsow_domain, html } = GM_getValue(MAGNET_ARGS);
        MagnetLog.info('start to get items info');
        const mp = new MagnetParser(MagnetParser.getMagnetHash(magnet), btsow_domain, html);
        const items = await mp.getItems(keyword);
        console.log(items);

        if (items.length === 0) {
          MagnetLog.err('no match file can download');
          return;
        }
        new MagnetFor115Storage().set({ magnet, dir, keyword });
        MagnetLog.info('Jump to 115 and add magnet');
      }

      //       resolveMagnet() {
      //         MagnetLog.info('start to resolve magnet');
      //         ElemUtils.querySelector('#txtBtHash').value = this.magnet;
      //         const btn = ElemUtils.querySelector('#btnGoHash');

      //         GM_setValue(MAGNET_DOWNLOAD_ALLOW, true);
      //         GM_setValue(MAGNET_RESOLVING, true);
      //         GM_setValue(MAGNET_PREV, this.magnet);
      //         btn.click();
      //       }
    }

    class HkyHashListWebPage extends WebPage {
      constructor() {
        super();
      }

      run() {
        GM_setValue(MAGNET_RESOLVING, false);
        if (!Boolean(GM_getValue(MAGNET_DOWNLOAD_ALLOW, false))) return;
        GM_setValue(MAGNET_DOWNLOAD_ALLOW, false);

        const { magnet, dir, keyword } = GM_getValue(MAGNET_ARGS);
        MagnetLog.info('start to get items info');
        const items = this.getItems(keyword);
        console.log(items);
        // return;
        if (items.length === 0) {
          MagnetLog.err('no match file can download');
          $.messager.show("<i class='icon  icon-exclamation-sign'></i>  无可离线项 ", { type: 'danger', placement: 'button' });
          return;
        }
        new MagnetFor115Storage().set({ magnet, dir, keyword });
        MagnetLog.info('Jump to 115 and add magnet');
        $.messager.show("<i class='icon icon-check-circle'></i>  解析磁力链接 ", { type: 'success', placement: 'button' });
        return;
        if (items.length > 0) {
          const data = items[0].node.attributes.data.value;
          const s1 = items[0].node.attributes.s1.value;
          const url = this.getDownloadLink(s1, data);
          console.log(`url: ${url}`);
          if (url) {
            this.downloadToAria2(url, dir);
          } else {
            $.messager.show("<i class='icon  icon-exclamation-sign'></i>  抱歉，无法读取该文件的下载地址！", { type: 'danger', placement: 'button' });
          }
        }
      }

      getDownloadLink(s1, data) {
        const tp = 'web';
        var reqdata = "";
        if ((s1 + "").length > 39) {
          reqdata = "{'d':'" + data + "','s1':'" + s1 + "','tp':'" + tp + "'}";
        } else {
          reqdata = "{'d':'" + data + "','tp':'" + tp + "'}";
        }
        let downUrl;
        $.ajax({
          type: "post",
          url: "CommonAjax.ashx?type=DownUrl",
          data: reqdata,
          dataType: "json",
          async: false,
          success: function(d) {
            if (d.IsOk) {
              console.log(d.DownUrl);
              downUrl = bcone(d.DownUrl);
            } else {
              if (d.MsgUrl != null) {
                console.log(d.Msg);
              }
            }
          },
          error: function(err) {
            console.log(err);
          },
          complete: function() {
            console.log('btn success');
          }
        });
        if (downUrl) return downUrl;
      }

      downloadToAria2(url, dir) {
        // const filename = decodeURI(url.split('/').pop()).replace(/ /g, '+');
        const reqdata = JSON.stringify({
          jsonrpc: "2.0",
          id: "6",
          method: "aria2.addUri",
          params: [
            "token:WAde1990",
            [url],
            {
              dir: dir,
              // out: filename,
            },
          ]
        });
        console.log(reqdata);
        $.ajax({
          type: "post",
          url: "https://saria2.wxhu.site/jsonrpc",
          data: reqdata,
          dataType: "json",
          async: false,
          success: function(d) {
            if (d.error) {
              throw Error(d.error.message);
            } else {
              console.log(d.result);
              const args = GM_getValue(MAGNET_ARGS);
              args.status = 1;
              this.magnetStorage.set(JSON.stringify(args));
              $.messager.show("<i class='icon icon-check-circle'></i>  文件下载地址已添加至 Aria2", { type: 'success', placement: 'button' });
            }
          },
          error: function(err) {
            console.log(err);
          },
          complete: function() {
            console.log('download success');
          }
        });

      }

      getItems(keyword = '') {
        const itemFilter = keyword !== '';
        const re = itemFilter ? new RegExp(keyword.toLowerCase().replace(/[\W_]/g, ''), 'g') : null;
        console.log(re);

        const listNode = ElemUtils.querySelector('#listData');
        const itemNodes = listNode.querySelectorAll('[id^=btlist]');
        let arr = [];
        for (let node of itemNodes) {
          // const node = itemNodes[i];
          // not for 115
          const downloadable = true;
          // const downloadable = !!node.querySelector('.green');
          // console.log(downloadable);
          // if(itemFilter && !downloadable) continue;

          const size = convertSnifferLength(ElemUtils.querySelector('.text-blue', node).innerText); // mb
          console.log(size);
          if (itemFilter && size < 100) continue;

          const title = ElemUtils.querySelector('.title', node).innerText;
          console.log(title);
          if (itemFilter && !re.test(title.toLowerCase().replace(/[\W_]hd[\W_]/gi, '').replace(/[\W_]/g, ''))) continue;

          const o = {
            node,
            title,
            size,
            downloadable,
          };
          arr.push(o);
        }

        return arr;
      };
    }

    class _115CloudDownloadWebPage extends WebPage2 {
      constructor() {
        super();
        this.offlineBtnNode;
        this.vipDownloadEnabled = false;
      }

      run() {
        const magnetFor115 = new MagnetFor115Storage().addChangeListener(true);
        magnetFor115.onchange = (data) => {
          window.focus();
          MagnetLog.info('focus 115');
          this.download(data);
        };
        this.notifyWhenSecurityCodeShow();
        this.getOfflineBtnNode();
        this.selectVideoType();
        console.log('Script ran ...');
      }

      notifyWhenSecurityCodeShow() {
        waitForKeyElements('iframe[src*="security_code"]', jNode => {
          MagnetLog.err('Security code was shown');
        }, false);
      }

      getOfflineBtnNode() {
        waitForKeyElements('div#js_top_panel_box i.ifo-linktask', jNode => {
          console.log('update offline button node');
          this.offlineBtnNode = jNode[0];
        }, false, 'div#js_center_main_box iframe');
      }

      async download({ magnet, keyword }) {
        console.log(magnet);
        console.log(keyword);
        this.addOffline(magnet);

        try {
          await this.sleep(500);
          let items = [];
          let count = 0;
          const startTime = Date.now();
          while(Date.now() - startTime < 10000) {
            count += 1;
            MagnetLog.info(`refresh items (${count})`);
            this.refresh();
            await this.sleep(1000);
            items = this.getItems(keyword);
            if(items.length > 0) {
              MagnetLog.info('start to download magnet in 115');
              break;
            }
          }
          await this.downloadItems(items);
          const item = await this.monitorAria2Add(keyword);
          MagnetLog.info(JSON.stringify(item));
        }catch(e) {
          MagnetLog.err(e.message);
          console.log(e.message);
        }
      }

      sleep(dur = 0) {
        return new Promise((resolve, reject) => setTimeout(() => resolve('ok'), dur));
      }

      addOffline(link) {
        MagnetLog.info('add offlink to 115');
        if (!this.offlineBtnNode) throw new Error('No offline button node can click');
        this.offlineBtnNode.click();

        waitForKeyElements('textarea#js_offline_new_add', jNode => {
          jNode[0].value = link;
          const dBtn = document.querySelector('div.dialog-bottom div.con a');
          dBtn.click();
        }, true);
      }

      selectVideoType() {
        let dataListed = false;
        waitForKeyElements('div.list-contents', jNode => {
          console.log('data list');
          dataListed = true;
        }, true, 'div#js_center_main_box iframe');

        waitForKeyElements('i.iofl-video', jNode => {
          console.log('select video type');
          const _id = setInterval(() => {
            console.log('waiting for video type...');
            if (dataListed) {
              jNode[0].click();
              clearInterval(_id);
              console.log('video type select');
            }
          }, 200);
        }, false, 'div#js_center_main_box iframe');
      };

      refresh() {
        console.log('refresh...');
        const iframeN = document.querySelector('div#js_center_main_box iframe');
        if (iframeN) {
          const nodes = iframeN.contentWindow.document.querySelectorAll('div#js_filter_suffix a');
          console.log(nodes.length);
          nodes[0].click();
        }
      };

      getItems(keyword = '') {
        console.log('get items...');
        const itemFilter = keyword !== '';
        const re = itemFilter ? new RegExp(keyword.toLowerCase().replace(/[\W_]/g, ''), 'g') : null;
        console.log(re);

        let items = [];
        const iframeN = document.querySelector('div#js_center_main_box iframe');
        if (iframeN) {
          const nodes = iframeN.contentWindow.document.querySelectorAll('div.list-contents ul li');
          if (!nodes) throw new Error('no items');
          console.log(nodes.length);
          let updateTime;
          for (let len = nodes.length, i = 0; i < len; i += 1) { // todo: i = 0
            const node = nodes[i];
            const mTime = node.querySelector('div.file-modified span').innerText;
            if (!updateTime) {
              updateTime = mTime
            } else {
              if (mTime !== updateTime) break;
            }

            const size = convertSnifferLength(node.querySelector('div.file-size span').innerText);
            console.log(size);
            if (itemFilter && size < 100) continue;

            console.log(updateTime);
            const title = node.querySelector('span.file-name a.name').title;
            console.log(title);
            if (itemFilter && !re.test(title.toLowerCase().replace(/[\W_]hd[\W_]/gi, '').replace(/[\W_]/g, ''))) continue;

            const o = {
              node,
              title,
              size,
            };

            items.push(o);
          }
        }
        return items;
      };

      async downloadItems(items) {
        if (!items || (items.length === 0)) throw new Error('no items can download');
        for (let len = items.length, i = 0; i < len; i += 1) {
          const { node } = items[i];
          node.dispatchEvent(new Event('mouseover', { 'bubbles': true }));
          await this.sleep(250);
          // setTimeout(() => {
            const dBtn = node.querySelector('div.file-opr i.ifo-download')
            if (!dBtn) throw new Error('no download button');
            this.vipDownloadEnabled = true;
            dBtn.click();
            MagnetLog.info('downloaded');
          // }, 250);
          // MagnetLog.info('wait for vip download button');
          // this.selectVipDownload();
          break;
        }
      };

      async monitorAria2Add(keyword) {
        const itemFilter = keyword !== '';
        const re = itemFilter ? new RegExp(keyword.toLowerCase().replace(/[\W_]/g, ''), 'g') : null;
        console.log(re);

        const server = '172.16.0.217';
        const port = '8888';
        const token = 'WAde1990';

        const aria2 = new Aria2(server, token, port);

        const types = ['Waiting', 'Active'];
        let item;

        let count = 1;
        const startTime = Date.now();
        while(Date.now() - startTime < 10000) {
          if(count === 1 || count % 4 === 0) MagnetLog.info(`monitor aria2 add (${count})`);

          for(let len = types.length, i = 0; i < len; i++) {
            const results = await aria2[`tell${types[i]}`]();
            const size = results.length;
            if(size === 0) continue;
            for(let k = 0; k < size; k++) {
              const path = results[k].files[0].path;
              if (itemFilter && !re.test(path.toLowerCase().replace(/[\W_]hd[\W_]/gi, '').replace(/[\W_]/g, ''))) continue;
              item = {
                status: results[k].status,
                path
              };
              break;
            }
            if(item) return item;
          }
          count += 1;
          await this.sleep(250);
        }
        if(!item) throw new Error(`item not add to Aria2 (${keyword})`);
      }

      selectVipDownload() {
        waitForKeyElements('a#vip_down', jNode => {
          if (!this.vipDownloadEnabled) return;
          this.vipDownloadEnabled = false;
          console.log('vip download');
          MagnetLog.info('vip download');
          jNode[0].click();
        }, true, 'div.dialog-frame iframe');
      };
    }

    class WebSocketListener {
      constructor() {
        this.magnetStorage = new MagnetStorage();
      }

      run() {
        console.log('WebSocketListener');
        this.listenMagnet();
        this.log();
      }

      listenMagnet() {
        const wsi = new WebSocketIn('987');
        wsi.onmessage = ({ data }) => {
          console.log(data);
          this.magnetStorage.set(data);
          MagnetLog.info('------------------------------------------');
          MagnetLog.info(`Magnet info was saved to storage (${data})`);
        };
      }

      log() {
        const wsi = new WebSocketIn('955');
        const logStorage = new LogStorage().addChangeListener(true);
        logStorage.onchange = (value) => {
          wsi.send(value);
        };

      }
    }

    return {
      HkyMainWebPage,
      HkyHashListWebPage,
      _115CloudDownloadWebPage,
      WebSocketListener,
    };
  })();

  class DynamicClass {
    constructor(className, ...opts) {
      return new classes[className](...opts);
    }
  }

  (async () => {
    try {
      const cls = new DynamicClass(TmUtils.getClassName4Run())
      await cls.run();
      console.log('ok');
    } catch (e) {
      MagnetLog.err(e.message);
      console.log(e.message);
    }
  })();
})();
