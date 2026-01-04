// ==UserScript==
// @name        picManager导入助手
// @namespace   picManagerHelper
// @match       http://*/*
// @match       https://*/*
// @match       file://*/*
// @version     1.4
// @grant       unsafeWindow
// @author      -
// @description 2022/2/11 上午1:07:49
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439834/picManager%E5%AF%BC%E5%85%A5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/439834/picManager%E5%AF%BC%E5%85%A5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
unsafeWindow._g_pm_ = {
    _g: {
      urls: [], // 已经加载的图片url
    },
  
    init: function() {
        // window.onready = () => {
            var timer = setInterval(() => {
                if(!document.querySelector('#_ftb_')){
                  this.load();
                }
            }, 500);
        // }
    },
  
  load: function(){
        var self = this;
                var div = document.createElement('div');
            div.id = '_ftb_';
            div.innerHTML = `<div style="color: #000000;width: 30px;height: 30px;border-radius: 50%;background-color: #ffffff;border: 1px solid #000000; text-align: center;line-height: 30px;cursor: pointer;">↓</div>`;
            div.style.cssText = `position: fixed;bottom: 20px;right: 20px;z-index: 999999;`;
            div.onclick = function(event) {
                var div = document.querySelector('#_container_');
                if (div) {
                    self.closeDialog();
                } else {
                    self.loadImages();
                }
            }
            document.body.appendChild(div);

            setInterval(() => {
                for (var img of document.querySelectorAll('img')) {
                    if (!img.contextmenu1) {
                        img.contextmenu1 = true;
                        img.addEventListener('contextmenu', function(event) {
                            event.preventDefault(true);
                            event.stopPropagation();
                            if (event.ctrlKey) {
                                self.saveImg(this.src);
                            } else {
                                self.showMenu(this);
                            }
                        });
                    }
                }
            }, 1000);

         
  },
  
  loadImages: function(){
    this.openDialog(this.getPageImages());
  },

    toastMsg: function(msg) {
        var div = document.querySelector('#_alert_');
        if (div == null) {
            var div = document.createElement('div');
            div.id = '_alert_';
            div.onclick = function(event) {
                this.remove();
            }
            div.style.cssText = `
                    background-color: #ffffff;
                    text-align: center;
                    position: fixed;
                    z-index: 99999;
                    top: 5%;
                    right: 0;
                    max-width: 30%;
                    padding: 10px;
                    cursor: pointer;
                `;
            document.body.appendChild(div);
        } else {
            clearTimeout(div.timer);
        }
        div.innerHTML = `<b>${msg}</b>`;
        div.timer = setTimeout(() => {
            div.remove();
        }, 3000);
    },

    getPageImages: function() {
        const getBackgroundImage = function(dom) {
            var style = dom.currentStyle || window.getComputedStyle(dom, false);
            return style.backgroundImage.slice(4, -1).replace(/"/g, "");
        }

        var imgs = new Map();
        for (var d of document.querySelectorAll('*')) {
            var title = d.alt || d.title || '';
            if (d.tagName == 'IMG') {
                imgs.set(d.src, title);
                if (d.dataset.src) {
                    imgs.set(d.dataset.src, title);
                }
            }
            var u = getBackgroundImage(d);
            if (u != '') {
                imgs.set(u, title);
            }
        }
        return Object.fromEntries(imgs);
    },

    getImageSize: function(src, prop = {}) {
        return new Promise((resolve, reject) => {
            var img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');
            img.src = src;
            img.onload = function() {
                resolve(Object.assign(prop, { w: this.width, h: this.height }));
            }
            img.onerror = function() {
                reject();
            }
        })
    },

    selectImg: function(dom) {
        dom.classList.toggle('_grid_selected_');
        this.showSelectedImgCount();
    },

    showSelectedImgCount: function() {
        document.querySelector('#_importBtn_').innerHTML = this.getSelectedImgs().length + '/' + document.querySelectorAll('._grid_item_').length;
    },

    toggleSelectAll: function() {
        var selected = this.getSelectedImgs();
        for (var d of document.querySelectorAll('._grid_item_')) {
            d.classList.toggle('_grid_selected_', selected.length === 0)
        }
        this.showSelectedImgCount();
    },
  
  getDialog: function(){
    return document.querySelector('#_container_');
  },

    openDialog: function(data) {
      var self = this;
      const getImageHtml = (url, title) => {
        return  `
            <div class="_grid_item_" style=" position: relative;
    padding: 20px;" onclick="_g_pm_.selectImg(this)">
                <img style="object-fit: cover;
    width: 100%;
    height: 100%;" src="${url}" title="${url}" alt="${title}" onload="_g_pm_.setRange(this.width, this.height);this.nextElementSibling.querySelector('._size_').innerHTML = this.width + 'x' + this.height">
                <span class="detail" style="display: flex;">
                    <span class="_size_" style="width: 30%;"></span>
                    <span class="_title_" style="width: 70%;">${title}</span>
                </span>
                <svg style="position: absolute;right: 0;bottom: 0;display:none;width: 60px;height: 60px;color: #6495ed;" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 1-1.5 1.5H3z"/>
                  <path d="m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
                </svg>
            </div>
            `;
      }
      
      var dialog = self.getDialog();
      if(dialog){ // 对话框已经打开
        var i = 0;
        for(var url in data){
          if(self._g.urls.indexOf(url) == -1){ // 新图片
            self._g.urls.push(url);
            i++;
            document.querySelector('#gallery').insertAdjacentHTML('beforeend', getImageHtml(url, data[url])); // 添加到尾部
          }
        }
        i > 0 && alert('成功加载 ' + i + '张图片!')
        return;
      }
      
      if(!document.querySelector('#_style_')){
        const insertStyle = (cssText) => {
                var head = document.getElementsByTagName("head")[0];
                var style = document.createElement("style");
                var rules = document.createTextNode(cssText);
                style.type = "text/css";
                style.id = "_style_";
                if (style.styleSheet) {
                    style.styleSheet.cssText = rules.nodeValue;
                } else {
                    style.appendChild(rules);
                }
                head.appendChild(style);
                return style;
            }
            insertStyle(`
                        ._grid_selected_ {
                            border: 1px solid #6495ed;
                        }


                        ._grid_selected_>svg {
                            display: unset !important;
                        }

                        @media only screen and (max-width: 375px) {
                            #_toolbar_ {
                                display: inline-table !important;
                            }
                            #_importBtn_ {
                                max-width: unset !important;
                            }
                        }

                        @media only screen and (max-width: 768px) {
                            ._title_ {
                                display: none !important;
                            }
                        }
                        
                    `);
      }
         
      
      
        var h = `
            <div id="_toolbar_" style="color: #000000;position: fixed;z-index: 2;background-color: #ffffff;bottom: 0;left: 0;display: inline-flex;width: 100%;justify-content: space-evenly;align-items: center;border-top: 1px solid #000000;">

                <div style="padding: 10px;text-align: center;">
                    <input type="text" style="width: 100%;margin-bottom:10px;" placeholder="网址过滤" onkeyup="_g_pm_.filterImageWithUrl(this.value)">

                    <button onclick="_g_pm_.showMenu();">更多选项</button>
                </div>

                <div >
                    <div style="text-align: center;">
                      <label>width</label>
                      <input id="range_w" style="border: 1px solid #00000;" type="range" 
                             min="0" max="0" oninput="this.nextElementSibling.innerHTML = this.value;_g_pm_.filterImage()">
                        <span style="margin-left: 10px;">0</span>
                    </div>
                    <div style="text-align: center;">

                      <label>height</label>
                      <input id="range_h"  style="border: 1px solid #00000;" type="range" 
                             min="0" max="0" oninput="this.nextElementSibling.innerHTML=this.value;_g_pm_.filterImage()">
                        <span style="margin-left: 10px;">0</span>
                    </div>
                </div>

                <button id="_importBtn_" onclick="_g_pm_.importSelected()" style="margin-top: 10px;padding: 10px;width: 100%;max-width: 100px;font-size: 2rem;">
                导入
                </button>

            </div>


            <div id="gallery" style="margin-bottom: 70%;
    display: grid;
    grid-template-columns: repeat(3, 33.33%);
    grid-template-rows: repeat(3, 100px;)">`;
       self._g.urls = [];
        for (var url in data) {
           self._g.urls.push(url);
            h += getImageHtml(url, data[url]);
        }
        h += `
            </div>
            `
        var dialog = document.createElement('div');
        dialog.innerHTML = h;
        dialog.style.cssText = `
                padding-top: 10px;
                background-color: #ffffff;
                position: fixed;
                margin-bottom: 100px;
                z-index: 99999;
                top: 0;
                left: 0;
                overflow-y: scroll;
                overflow-x: hidden;
                width: 100%;
                height: 100vh;`;
        dialog.id = '_container_';
        document.body.appendChild(dialog);
        this._g.overFlow = document.body.style.overflow;
        if (this._g.overFlow != 'hidden') {
            document.body.style.overflow = 'hidden';
        }
        this.showSelectedImgCount();

    },

    closeDialog: function() {
        document.querySelector('#_container_').remove();
        document.body.style.overflow = this._g.overFlow;
      document.querySelector('#_style_').rremove();
    },

    importSelected: function() {
        var selected = this.getSelectedImgs();
        if (!selected.length) {
            return alert('没有选中任何图片!');
        }
        var data = {
            type: 'images',
            items: []
        };
        for (var d of selected) {
            var img = d.querySelector('img');
            data.items.push({
                src: img.src,
                name: img.alt
            })
        }
        this.saveImg(data);
    },

    saveImg: function(data) {
        var self = this;
        if (typeof(data) == 'string') data = {
            type: 'images',
            items: (() => {
                var r = [];
                for (var url of data.split('\n')) {
                    r.push({ src: url })
                }
                return r;
            })()
        }
        self.request({
            url: 'http://127.0.0.1:41596/api/item/addFromURLs',
            data: data,
            success: (res) => {
                if (res.status == 'success') {
                    if (data.items.length > 1) {
                        self.closeDialog();
                        alert('导入成功!');
                    } else {
                        self.toastMsg('✔导入成功!');
                    }
                } else {
                    alert('导入失败!');
                }
            },
            error: (error) => {
                error && alert('传输失败。请检测是否有打开软件.');
            }
        })
    },

    request: function(opts) {
        opts = Object.assign({
            success: () => {},
            error: () => {},
            data: null,
        }, opts);
        console.log(opts.data);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", opts.url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.responseType = 'json';
        xhr.onload = function() {
            if (this.status == 200) {
                opts.success(this.response);
            } else {
                opts.error('请求失败!');
            }
        }
        xhr.onerror = function(error) {
            opts.error(error);
        }
        xhr.send(this.formurlencoded(opts.data));

    },

    loadOriginImage: function() {
        for (var img of document.querySelectorAll('#_container_ ._grid_item_ img')) {
            this.getImageSize(img.src, { element: img }).then((img) => {
                img.element.parentElement.querySelector('._size_').innerHTML = img.w + 'x' + img.h;
                this.setRange(img.w, img.h);
            });
        }
    },

    filterImage: function() {
        var w = parseInt(document.querySelector('#range_w').value);
        var h = parseInt(document.querySelector('#range_h').value);
        for (var d of document.querySelectorAll('._size_')) {
            var a = d.innerHTML.split('x');
            if (a.length != 2) continue;
            d.parentElement.parentElement.style.display = parseInt(a[0]) >= w && parseInt(a[1]) >= h ? '' : 'none';
        }
    },

    filterImageWithUrl: function(url) {
        for (var d of document.querySelectorAll('._grid_item_ img')) {
            d.parentElement.style.display = d.src.toLocaleLowerCase().indexOf(url.toLocaleLowerCase()) != -1 ? '' : 'none';
        }
    },

    setRange: function(w, h) {
        var rw = document.querySelector('#range_w');
        if (w > rw.max) rw.max = w * 1.1; // 多出五分之一的空间来
        var rh = document.querySelector('#range_h');
        if (h > rh.max) rh.max = h * 1.1;
    },


    showMenu: function(dom) {
        var self = this;
        if(dom) self._g.src = dom.src;
        var div = document.createElement('div');
        div.id = '_menu';
        div.onclick = function(event) {
            if (event.target == this) {
                var x = event.clientX;
                var y = event.clientY;
                var content = this.children[0];
                var l = content.offsetLeft;
                var t = content.offsetTop;
                if (!(x >= l && x <= l + content.width && y >= t && y <= t + content.height)) {
                    this.remove();
                }
            }
        }
        div.style.cssText = `
                background-color: rgba(0,0,0,.6);
                position: fixed;
                z-index: 99999;
                top: 0;
                left: 0;
                height: 100vh;
                width: 100%;
            `;
        var h = `<div id="_menu_list_" style="position: absolute;background-color: #ffffff;left: 30%;
                    width: 40%;height: 40%;top: 30%;">`;
        for (var d of dom ? [
                { name: '导入图片', onclick: '_g_pm_.saveImg(_g_pm_._g.src)' },
                { name: '复制图片', onclick: '_g_pm_.copyText(_g_pm_._g.src)' },
                { name: '新窗口打开', onclick: "window.open(_g_pm_._g.src, '_blank')" },
            ] : [
                { name: '全选/全不选', onclick: '_g_pm_.toggleSelectAll()' },
                { name: '加载图片大小', onclick: '_g_pm_.loadOriginImage()' },
                { name: '导出列表', onclick: '_g_pm_.exportUrls();' },
                { name: '检测新图片', onclick: '_g_pm_.loadImages();' },
             ]) {
            h += `
             <h2 style="text-align:center;border-bottom: 0.5px solid #000000;padding: 10px;margin-bottom: 10px;" onclick="document.querySelector('#_menu').remove();${d.onclick}">${d.name}</h2>
            `;
        }
        h += "</div>";
        div.innerHTML = h;
        document.body.appendChild(div);
    },
  
  getSelectedImgs: function(){
      return document.querySelectorAll('._grid_selected_');
  },
  
  exportUrls: function(){
     var selected = this.getSelectedImgs();
        if (!selected.length) {
            return alert('没有选中任何图片!');
        }
    var urls = [];
        for (var d of selected) {
            urls.push(d.querySelector('img').src);
        }
    this.downloadData(urls.join("\n"), location.href+'.txt');
  },
  
   downloadData: function(blob, fileName){
    if(typeof(blob) != 'blob'){
        blob = new Blob([blob]);
    }
    var eleLink = document.createElement('a');
    eleLink.download = fileName;
    eleLink.style.display = 'none';
    eleLink.href = URL.createObjectURL(blob);
    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink); 
},


    copyText: function(text) {
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.setAttribute('value', text);
        input.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
        }
        document.body.removeChild(input);
    },

    formurlencoded: function(e) {
        var n = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
        let t = Boolean(n.sorted),
            l = Boolean(n.skipIndex),
            c = Boolean(n.ignorenull),
            a = function(n) { return String(n).replace(/(?:[\0-\x1F"-&\+-\}\x7F-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g, encodeURIComponent).replace(/ /g, "+").replace(/[!'()~\*]/g, function(n) { return "%" + n.charCodeAt().toString(16).slice(-2).toUpperCase() }) },
            f = function(n) { const e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : Object.keys(n); return t ? e.sort() : e },
            d = function(n) { return n.filter(function(n) { return n }).join("&") },
            D = function(n, e) { var t, r, u, o, i = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : void 0 === e ? "undefined" : typeof e; let F = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null; return e === F ? F = c ? F : a(n) + "=" + F : /string|number|boolean/.test(i) ? F = a(n) + "=" + a(e) : Array.isArray(e) ? F = (u = n, (o = e).length ? d(o.map(function(n, e) { return l ? D(u + "[]", n) : D(u + "[" + e + "]", n) })) : a(u + "[]")) : "object" === i && (F = (t = n, r = e, d(f(r).map(function(n) { return D(t + "[" + n + "]", r[n]) })))), F };
        return e && d(f(e).map(function(n) { return D(n, e[n]) }))
    }
}
_g_pm_.init();