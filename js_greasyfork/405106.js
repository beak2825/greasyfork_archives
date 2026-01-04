// ==UserScript==
// @name         ghPreview
// @name:ZH-CN   Github HTML 预览
// @name:ZH-TW   Github HTML 預覽
// @namespace    https://github.com/li-zyang
// @version      0.1.1
// @description  Render HTML files in Github
// @description:ZH-CN  渲染 Github 中的 HTML 文档
// @description:ZH-TW  渲染 Github 中的 HTML 文檔
// @author       阿昭
// @include      https://github.com/*
// @include      https://li-zyang.github.io/ghPreview/*
// @include      *://127.0.0.1/ghPreview/*
// @exclude      none
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @connect      raw.githubusercontent.com
// @connect      github.com
// @connect      *
// @noframes
// @run-at       document-start
// @icon         https://github.githubassets.com/pinned-octocat.svg
// @note         v0.1.0      2020-06-11  First finished the available one, tests & improvements & documention needed, however.
// @note         v0.1.1      2020-06-12  Extract the render site definition out; disabled major of console.log(); code neaten.
// @downloadURL https://update.greasyfork.org/scripts/405106/ghPreview.user.js
// @updateURL https://update.greasyfork.org/scripts/405106/ghPreview.meta.js
// ==/UserScript==

// => More metadata:
// @contributor  the contributors of this script
// @homepageURL  the homepage of this script (commonly <sth>.io)
// @supportURL   Defines the URL where the user can report issues and get personal support. (such as https://greasyfork.org/scripts/41537)
// @license      license of this script
// @compatible   describe compatibility
// @match

// See https://www.tampermonkey.net/documentation.php for full documention

(function(window, $) {
  'use strict';
  
  window.ghPreviewJS = {};
  let script = ghPreviewJS;

  script.renderSite = 'https://li-zyang.github.io/ghPreview/';
  
  script.TimeoutError = function(what) {
    Error.call(this, what);
    this.name = 'TimeoutError';
    // this.message = (what || '');
  }
  let TimeoutError = script.TimeoutError;

  TimeoutError.prototype = Object.create(Error.prototype);
  TimeoutError.prototype.constructor = TimeoutError;

  script.wait = async function(discriminant, timeout) {
    let prop = {};
    let res = new Promise(function poll(resolve, reject) {
      let condition = discriminant();
      if (condition) {
        // clearTimeout(prop.timeout);
        resolve(condition);
      } else if (timeout != undefined && (new Date).getTime() - prop.openTime > timeout) {
        reject(new TimeoutError('Timeout exceeded'));
      } else {
        setTimeout(poll, 0, resolve, reject);
      }
    });
    prop.promise  = res;
    prop.openTime = new Date();
    return res;
  }
  let wait = script.wait;

  script.delay = async function(ms) {
    return new Promise(function(resolve, reject) {
      setTimeout(resolve, ms);
    });
  }
  let delay = script.delay;
  
  script.entitize = function(html) {
    var elem = document.createElement("div");
    var txt = document.createTextNode(html);
    elem.appendChild(txt);
    return elem.innerHTML;
  }
  let entitize = script.entitize;
  
  script.unentitize = function(str) {
    var elem = document.createElement("div");
    elem.innerHTML = str;
    return elem.innerText || elem.textContent;
  }
  let unentitize = script.unentitize;
  
  script.genID = function() {
    let charMap = '0123456789abcdefghijklmnopqretuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let rawID = Number(Math.floor(Math.random() * Math.pow(2, 16)).toString() + Date.now().toString());
    let ID = '';
    while(rawID > 1) {
      let rem = rawID % charMap.length;
      rawID /= charMap.length;
      ID += charMap.charAt(rem);
    }
    return ID;
  }
  let genID = script.genID;
  
  script.dedentText = function(str) {
    let splitted = str.split('\n');
    let minSpaces = Infinity;
    while (/^\s*$/.test(splitted[0])) {
      splitted.shift();
    }
    while (/^\s*$/.test(splitted[splitted.length - 1])) {
      splitted.pop();
    }
    for (let i = 0; i < splitted.length; i++) {
      let line = splitted[i];
      if (/^\s*$/.test(line)) {
        continue;
      }
      let matched = /^\s*/.exec(line)[0];
      if (matched.length < minSpaces) {
        minSpaces = matched.length;
      }
    }
    for (let i = 0; i < splitted.length; i++) {
      let line = splitted[i];
      splitted[i] = line.slice(minSpaces);
    }
    return splitted.join('\n');
  }
  let dedentText = script.dedentText;
  
  script.Base64 = function() { }
  let Base64 = script.Base64;

  Base64.encode = function(str) {
    return window.btoa(
      unescape(
        encodeURIComponent(str)
      )
    );
  };

  Base64.decode = function(str) {
    return decodeURIComponent(
      escape(
        window.atob(str)
      )
    );
  };
  
  script.getCodeContent = function(previewerTable) {
    let rawCode = '';
    let lines = $(previewerTable).find('td.blob-code');
    for (let i = 0; i < lines.length; i++) {
      rawCode += $(lines[i]).text();
      if (i < lines.length - 1) {
        rawCode += '\n';
      }
    }
    return rawCode;
  }
  let getCodeContent = script.getCodeContent;
  
  script.reviewCode = function(code) {
    let reviewWindow = window.open('about:blank');
    reviewWindow.document.write(dedentText(`
      <html>
      <body>
        <pre>
      ${script.entitize(code)}
        </pre>
      </body>
      </html>
    `));
    reviewWindow.document.close();
  }
  let reviewCode = script.reviewCode;

  script.Search = function(obj) {
    if (typeof obj == 'object') {
      let keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (this.careAbout.indexOf(key) == -1) {
          continue;
        } else {
          this[key] = obj[key];
        }
      }
    } else if (typeof obj == 'string') {
      if (obj.startsWith('?')) {
        let splitted = null;
        if (obj.indexOf('&') != -1) {
          splitted = obj.slice(1).split('&');
        } else {
          splitted = Base64.decode(obj.slice(1)).split('&');
        }
        for (let i = 0; i < splitted.length; i++) {
          let token = splitted[i];
          let key = token.slice(0, token.indexOf('='));
          let val = token.slice(key.length + 1);
          if (this.careAbout.indexOf(key) == -1) {
            continue;
          } else {
            try {
              this[key] = decodeURIComponent(val.replace('+', ' '));
            } catch (e) {
              if (e.name = 'URIError') {
                console.error(e + ` [${val}]`);
              } else {
                console.error(e);
              }
            }
          }
        }
      } else {
        throw new SyntaxError('Invalid search string');
      }
    } else if (!arguments.length) {
      ;
    } else {
      throw new TypeError('Illegal constructor argument');
    }
  }
  let Search = script.Search;

  script.Search.prototype.careAbout = 
    ['originalUrl', 'source', 'repo', 'file', 'user', 'avatar_url', 
     'authenticity_token', 'timestamp', 'timestamp_secret', 'branch', 
     'provider', 'contentID', 'permission'];

  script.Search.prototype.toString = function() {
    let keys = Object.keys(this);
    let tokenString = '';
    let tokenCount = 0;
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      if (this.careAbout.indexOf(key) != -1) {
        if (tokenCount != 0) {
          tokenString += '&';
        }
        tokenString += `${key}=${encodeURIComponent(this[key])}`;
        tokenCount++;
      }
    }
    return '?' + Base64.encode(tokenString);
  }
  
  script.ElasticInterval = function(callback, sampleInterval = 240, maxInterval = 150, minInterval = 0, factor = 1.1765) {
    this.callback = callback;
    this.sampleInterval = sampleInterval;
    this.factor = factor;
    this.minInterval = minInterval;
    this.maxInterval = maxInterval;
    this.startTime = null;
    this.record = [];   // {time, value}
    this.validIndex = 0;
    this.countedRecord = null;    // {indexEnd, count}
    this.timer = null;
    this.currentTimeout = null;
    this.state = 'reset';   // 'reset', 'running', 'paused'
  }
  let ElasticInterval = script.ElasticInterval;

  ElasticInterval.prototype.calcNextTimeout = function() {
    let now = Date.now();
    if (now - this.startTime < this.sampleInterval) {
      return Math.round(this.sampleInterval / 10);
    }
    let trueCount = this.count();
    // console.log(`true: ${trueCount}, proportion: ${(trueCount / (this.record.length - this.validIndex)).toFixed(3)}, validIndex: ${this.validIndex}`);
    let k = this.factor * (this.minInterval - this.maxInterval);
    // interval is 0 if proportion of true is 1 by default
    return Math.round(Math.max(k * trueCount / (this.record.length - this.validIndex) + this.maxInterval, this.minInterval));
  };

  ElasticInterval.prototype.start = function() {
    if (this.state == 'reset') {
      this.startTime = Date.now();
    }
    this.state = 'running';
    this.timeoutHandler();
    return this;
  };

  ElasticInterval.prototype.timeoutHandler = function() {
    let result = this.callback();
    if (this.state == 'running' || this.state == 'paused') {
      this.record.push({
        time: Date.now(), 
        value: result
      });
    }
    if (this.state == 'running') {
      this.currentTimeout = this.calcNextTimeout();
      this.timer = setTimeout(function(obj) {
        obj.timeoutHandler();
      }, this.currentTimeout, this);
    }
  };

  ElasticInterval.prototype.count = function() {
    let res = 0;
    let now = Date.now();
    if (this.countedRecord != null) {
      let midIndex = Math.floor((this.countedRecord.indexEnd - this.validIndex) / 2);
      if (now - this.record[midIndex].time > this.sampleInterval) {
        this.countedRecord = null;
        this.validIndex = midIndex + 1;
      }
    }
    if (this.validIndex >= 1024) {
      // garbage collection
      this.record.splice(0, this.validIndex);
      this.validIndex = 0;
      this.countedRecord = null;
    }
    for (let i = this.validIndex; i < this.record.length; i++) {
      let cur = this.record[i];
      if (now - cur.time > this.sampleInterval) {
        this.validIndex = i;
        if (this.countedRecord != null && cur.value) {
          this.countedRecord.count--;
        }
      } else {
        if (this.countedRecord != null) {
          if (i < this.countedRecord.indexEnd) {
            res = this.countedRecord.count;
            i = this.countedRecord.indexEnd - 1;    // - 1 to leave space for i++
          } else {
            if (cur.value) {
              res += 1;
              this.countedRecord.count += 1;
            }
            this.countedRecord.indexEnd = i;
          }
        } else {
          if (cur.value) {
            res += 1;
          }
          this.countedRecord = {
            indexEnd: i, 
            count: res
          };
        }
      }
    }
    return res;
  };

  ElasticInterval.prototype.pause = function() {
    if (this.state == 'running') {
      clearTimeout(this.timer);
      this.state = 'paused';
      this.timer = null;
      this.currentTimeout = null;
    }
    return this;
  };

  ElasticInterval.prototype.reset = function() {
    if (this.state == 'running') {
      clearTimeout(this.timer);
    }
    if (this.state == 'running' || this.state == 'paused') {
      this.startTime = null;
      this.record = [];
      this.validIndex = 0;
      this.countedRecord = null;
      this.timer = null;
      this.currentTimeout = null;
      this.state = 'reset';
    }
    return this;
  };
  
  script.testConnection = function(tests) {
    tests = (tests || [
      { target: 'https://raw.githubusercontent.com/li-zyang/ghPreview/master/LICENSE', name: 'raw' }
    ]);
    return new Promise(function(resolve, reject) {
      let res = {};
      let count = 0;
      let add = function() {
        count++;
      }
      let done = function() {
        count--;
        if (count == 0) {
          resolve(res);
        }
      }
      // resolve({raw: {time: -1}});    // FOR DEBUGING
      for (let i = 0; i < tests.length; i++) {
        let test = tests[i];
        let parsed = new URL(test.target);
        parsed.search += ((parsed.search == '') ? '?' : '&') + `testid=${genID()}`;
        res[test.name] = GM_xmlhttpRequest({
          method: 'GET',
          url: parsed.toString(),
          onerror: function(e) {
            if (res[test.name].time == undefined) {
              res[test.name].time = -1;
              res[test.name].error = e;
              done();
            }
          },
          ontimeout: function(e) {
            if (res[test.name].time == undefined) {
              res[test.name].time = -1;
              res[test.name].error = e;
              done();
            }
          },
          onload: function(result) {
            res[test.name].time = Date.now() - res[test.name].startTime;
            done();
          },
          timeout: 5000,
          nocache: true,      // Tampermonkey
          ignoreCache: true   // Scriptish
        });
        add();
        res[test.name].startTime = Date.now();
        res[test.name].requestUrl = parsed.toString();
      }
    });
  }
  let testConnection = script.testConnection;
  
  let svgs = script.svgs = {};
  svgs.code = `<svg class="ghPreview ghPreview-icon-svg" t="1591461488877" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7795" width="512" height="512"><path d="M293.0688 755.2c-12.0832 0-24.2688-4.2496-33.9968-12.9024L0 512l273.4592-243.0976C294.5536 250.2144 326.912 252.0064 345.7024 273.152c18.7904 21.1456 16.896 53.504-4.2496 72.2944L154.112 512l172.9536 153.7024c21.1456 18.7904 23.04 51.1488 4.2496 72.2944C321.2288 749.4144 307.1488 755.2 293.0688 755.2zM751.0528 755.0976 1024.512 512l-259.072-230.2976c-21.1456-18.7904-53.504-16.896-72.2432 4.2496-18.7904 21.1456-16.896 53.504 4.2496 72.2944L870.4 512l-187.3408 166.5024c-21.1456 18.7904-23.04 51.1488-4.2496 72.2944C688.896 762.2144 702.976 768 717.056 768 729.1392 768 741.3248 763.7504 751.0528 755.0976zM511.5392 827.648l102.4-614.4c4.6592-27.904-14.1824-54.272-42.0864-58.9312-28.0064-4.7104-54.3232 14.1824-58.88 42.0864l-102.4 614.4c-4.6592 27.904 14.1824 54.272 42.0864 58.9312C455.5264 870.1952 458.2912 870.4 461.1072 870.4 485.6832 870.4 507.392 852.6336 511.5392 827.648z" p-id="7796"></path></svg>`;
  
  script.removeEmptyLines = function(code) {
    let lines = code.split('\n');
    let i = 0; 
    while(lines[i] != undefined) {
      let line = lines[i];
      if (/^\s*$/.test(line)) {
        lines.splice(i, 1);
      } else {
        i++;
      }
    }
    return lines.join('\n');
  }
  let removeEmptyLines = script.removeEmptyLines;
  
  script.getRepoInfo = function() {
    let res = {};
    let $repoHead = $('.pagehead.repohead');
    let $repoTitle = $repoHead.find('h1');
    if ($repoTitle.hasClass('public')) {
      res.permission = 'public';
    } else if ($repoTitle.hasClass('private')) {
      res.permission = 'private';
    }
    res.author = $repoTitle.find('[itemprop="author"]').text().trim();
    res.name = $repoTitle.find('[itemprop="name"]').text().trim();
    res.fullName = res.author + '/' + res.name;
    let $branchSelect = $('.branch-select-menu > summary');
    res.branch = $branchSelect.find('span:first-of-type').text().trim();
    let $avatar = $('header .avatar-user');
    res.user = $avatar.attr('alt').trim().replace('@', '');
    res.avatar = $avatar.attr('src');
    let $breadcrumb = $('div.repository-content .file-navigation .breadcrumb');
    let $crumbChildrens = null;
    if ($breadcrumb.length) {
      $crumbChildrens = $breadcrumb.children().not('.js-repo-root');
    } else {
      $breadcrumb = $('#blob-path');
      $crumbChildrens = $breadcrumb.children().not('.js-repo-root').not('.final-path');
      if ($crumbChildrens.filter('#jumpto-symbol-select-menu').length) {
        $crumbChildrens = $crumbChildrens.slice(0, -2);
      }
    }
    if ($crumbChildrens.length) {
      res.cwd = $crumbChildrens.text().trim();
    } else {
      res.cwd = '/';
    }
    return res;
  }
  let getRepoInfo = script.getRepoInfo;
  
  script.isHTML = function(filename) {
    let htmlExts = ['.html', '.htm', '.xhtml', '.mhtml'];
    for (let i = 0; i < htmlExts.length; i++) {
      if (filename.endsWith(htmlExts[i])) {
        return true;
      }
    }
    return false;
  }
  let isHTML = script.isHTML;

  script.parseRelativeURL = function(raw) {
    let unrequestableProtocols = ['about:', 'data:'];
    let matchedProtocol = null; 
    unrequestableProtocols.forEach(function(prefix) {
      if (raw.startsWith(prefix)) matchedProtocol = prefix;
    })
    if (matchedProtocol) {
      let _temp = raw.slice(6).split('?');
      let pathname = _temp[0];
      let search = '';
      let hash = '';
      if (_temp[1] && _temp != '') {
        search = _temp[1];
        _temp.shift();
      }
      _temp = _temp[0].split('#');
      if (_temp[1] && _temp != '') {
        hash = _temp[1];
      }
      return {
        hash: hash,
        host: '',
        hostname: '',
        href: raw,
        origin: 'null',
        pathname: pathname,
        port: '',
        protocol: matchedProtocol,
        search: search,
        username: '',
        password: '',
        searchParams: new URLSearchParams()
      };
    }
    let fullPattern = /^(\w+:)?(\/\/[^\/\?#]+)?(\/?[^\?#]*)?(\?[^#]+)?(#.*)?/;
    let matched = null;
    if (matched = fullPattern.exec(raw)) {
      for (let i = 0; i < matched.length; i++) {
        let urlItem = matched[i];
        if (urlItem == undefined) {
          matched[i] = null;
        }
      }
      let username = null;
      let hostname = null;
      let port = null;
      if (matched[2]) {
        let _temp = matched[2].slice(2).split(':');
        if (_temp.length != 1) {
          port = _temp[1];
        } else {
          port = '';
        }
        _temp = _temp[0].split('@')
        if (_temp.length != 1) {
          username = _temp[0];
          hostname = _temp[1];
        } else {
          username = '';
          hostname = _temp[0];
        }
      }
      return {
        hash: (matched[5] || ''),
        host: (hostname) ? (hostname + ((port == '' || port == null) ? '' : (':' + port))) : null,
        hostname: hostname,
        href: raw,
        origin: (matched[1] && hostname) ? (matched[1] + '//' + hostname + ((port == '' || port == null) ? '' : ':' + port)) : null,
        password: '',
        pathname: hostname ? (matched[3] || '/') : matched[3],
        port: hostname ? (port || '') : port,
        protocol: matched[1],
        search: (hostname || matched[3]) ? (matched[4] || '') : matched[4],
        searchParams: new URLSearchParams(),
        username: username
      };
    }
  }
  let parseRelativeURL = script.parseRelativeURL;

  script.setURLBase = function(relativeURL, base) {
    let res = parseRelativeURL(relativeURL);
    let parsedBase = parseRelativeURL(base);
    let orderedProperty = ['protocol', 'hostname', 'host', 'origin', 'pathname', 'search', 'hash'];
    for (let i = 0; i < orderedProperty.length; i++) {
      let key = orderedProperty[i];
      if (res[key] == null) {
        res[key] = parsedBase[key];
      } else {
        break;
      }
    }
    if (res.pathname != null && parsedBase.origin != 'null' && !res.pathname.startsWith('/')) {
      if (parsedBase.pathname) {
        res.pathname = parsedBase.pathname + (parsedBase.pathname.endsWith('/') ? '' : '/') + res.pathname;
      } else {
        res.pathname = '/' + res.pathname;
      }
    }
    return res.protocol + (res.origin == 'null' ? '' : '//') + (res.username || '') + ((res.username && res.username != '') ? '@' : '') + res.host + res.pathname + res.search + res.hash;
  }
  let setURLBase = script.setURLBase;
  
  // ==============================================================================
  
  if (/^https:\/\/github.com\/.*/.test(location.toString())) {
  
  // console.log('working on github');

  script.processPage = async function() {
    // repository & file preview: div.repository-content
    // .js preview:               div.Box-body.p-0.blob-wrapper.data.type-javascript
    // README.md preview:         div.Box-body.readme.blob.js-code-block-container.p-5.p-xl-6
    // directory:                 table.files.js-navigation-container.js-active-navigation-container
    // .png preview:              div.Box-body.p-0.blob-wrapper.data.type-text 
    // ordinary .md preview:      div.Box-body.readme.blob.js-code-block-container.p-5.p-xl-6
    // too large file:            div.Box-body.p-0.blob-wrapper.data.type-text > div.text-center.p-3    [Attention: "view raw" link starts a download]
    // inside-directory:          div.repository-content .file-navigation .breadcrumb .final-path
    // repository root:           div.repository-content .file-navigation .breadcrumb
    let modified = false;
    script.previousURL = (script.previousURL || 'about:blank');
    if (!$('div.repository-content').length) {
      if (script.pageType != 'non-repo') {
        script.pageType = 'non-repo';
      }
      return false;
    } else {
      await wait((() => 
        $('div.repository-content').find('.files').length ||
        $('div.repository-content').find('.data').length ||
        $('div.repository-content').find('.blob').length), 1000)
      .catch(function(e) {
        throw e;
      });
      if ($('div.repository-content').find('.files').length) {
        if (script.pageType != 'directory') {
          // console.log('directory page detected');
          script.pageType = 'directory';
        }
        let $files = $('div.repository-content').find('.files');
        let $rows = $files.find('tr');
        for (let i = 0; i < $rows.length; i++) {
          let $row = $rows.eq(i);
          let type = $row.find('.icon svg').attr('aria-label');
          let $content = $row.find('.content');
          let $originalLink = $content.find('a.js-navigation-open');
          let originalHref = $originalLink.attr('href');
          let filename = $originalLink.text().trim();
          if ($content.find('.ghPreview').length) {
            continue;
          }
          if (type == 'file' && isHTML(filename)) {
            // console.log(filename + ': html file found');
            let repoInfo = getRepoInfo();
            let search = new Search();
            search.originalUrl = location.toString();
            search.repo = repoInfo.fullName;
            search.branch = repoInfo.branch;
            search.file = `${repoInfo.cwd}${filename}`.slice(1);    // remove '/'
            search.user = repoInfo.user;
            search.avatar_url = repoInfo.avatar;
            search.contentID = genID();
            search.permission = repoInfo.permission;
            if (repoInfo.permission == 'public') {
              search.source = `https://cdn.jsdelivr.net/gh/${repoInfo.fullName}@${repoInfo.branch}${repoInfo.cwd}${filename}`;
              search.provider = 'none';
            } else {
              // get auth token after redirect
              search.source = `https://github.com/${repoInfo.fullName}/raw/${repoInfo.branch}${repoInfo.cwd}${filename}`;
              search.provider = 'userscript';
            }
            let newUrl = new URL(script.renderSite);
            newUrl.search = search.toString();
            $originalLink.attr('href', newUrl.toString());
            $content.append($(`<span class="ghPreview ghPreview-icon-wrapper"><a class="ghPreview ghPreview-view-code ghPreview-icon" href="${originalHref}">${svgs.code}</a></span>`));
            modified = true;
          }
        }
      } else if ($('div.repository-content').find('.data').length) {
        if (script.pageType != 'file-preview') {
          // console.log('file previewing page detected');
          script.pageType = 'file-preview';
        }
        await wait(() => $($('.repository-content > .Box')[1]).find('.Box-header .text-mono').length, 1500);
        let $fileInfoContainer = $($('.repository-content > .Box')[1]).find('.Box-header .text-mono');
        let lineCount = Number(/^\d+/.exec($fileInfoContainer[0].childNodes[0].data.trim())[0]);
        let repoInfo = getRepoInfo();
        let $codeTable = $('div.repository-content .data table');
        await wait(() => $codeTable.find('tr').length >= lineCount, 1500);
        let sourceCode = getCodeContent($codeTable);
        let filename = $('div.repository-content .breadcrumb .final-path').text().trim();
        if (isHTML(filename)) {
          let search = new Search();
          search.originalUrl = location.toString().replace(/\?ghPreviewAction=([^&]+)&/, '?').replace(/(&|\?)ghPreviewAction=([^&]+)/, '');
          search.contentID = genID();
          search.repo = repoInfo.fullName;
          search.branch = repoInfo.branch;
          search.file = `${repoInfo.cwd}${filename}`.slice(1);
          search.user = repoInfo.user;
          search.avatar_url = repoInfo.avatar;
          search.permission = repoInfo.permission;
          if (repoInfo.permission == 'public') {
            search.source = `https://cdn.jsdelivr.net/gh/${repoInfo.fullName}@${repoInfo.branch}${repoInfo.cwd}${filename}`;
            search.provider = 'none';
          } else {
            search.source = `https://github.com/${repoInfo.fullName}/raw/${repoInfo.branch}${repoInfo.cwd}${filename}`;
            search.provider = 'userscript';
          }
          let action = '';
          try {
            action = /ghPreviewAction=([^&]+)/.exec(location.search)[1];
          } catch(e) {
            if (e.name == 'ReferenceError' || e.name == 'TypeError') { ; } else { throw e; }
          }
          if (script.previousURL != location.toString()) {
            script.currentAction = '';
          }
          if (action != '' && script.currentAction != action) {
            console.log('got command ' + action);
            script.currentAction = action;
            if (action == 'previewCurrent') {
              GM_setValue('pageSource', {
                code: sourceCode,
                contentID: search.contentID
              });
              console.log('ready to jump ' + script.renderSite + search.toString());
              try{
                location.replace(script.renderSite + search.toString());
              } catch(e) {
                location.assign(script.renderSite + search.toString());
              }
            }
          }
          let $btngroup = $($('.repository-content > .Box')[1]).find('.BtnGroup');
          if (!$btngroup.find('.ghPreview').length) {
            $btngroup.prepend(`<a class="ghPreview ghPreview-btn ghPreview-previewCurrent btn btn-sm BtnGroup-item">Preview</a>`);
            $btngroup.find('.ghPreview-previewCurrent').on('click', function() {
              if (search.provider == 'userscript') {
                GM_setValue('pageSource', {
                  code: sourceCode,
                  contentID: search.contentID
                });
              }
              location = script.renderSite + search.toString();
            });
            modified = true;
          }
        }
      } else if ($('div.repository-content').find('.blob').length) {
        if (script.pageType != 'markup-preview') {
          console.log('markup file viewing page detected');
          script.pageType = 'markup-preview';
        }
      }
    }
    script.previousURL = location.toString();
    return modified;
  }

  wait(() => $('.Progress').length).then(async function() {
    // console.log("ghPreview's processing page");
    script.extraStyle = dedentText(`
      .ghPreview-icon-svg {
        height: 14px;
        width: auto;
        fill: currentColor;
      }
      .ghPreview-icon-wrapper {
        width: 20px;
        display: inline-block;
        height: 1em;
      }
      .ghPreview-icon {
        position: absolute;
        width: 20px;
        height: 18px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px dashed currentColor !important;
        border-radius: 3px;
      }
    `);
    $('head').append($(`<style class="ghPreview ghPreview-style">${script.extraStyle}</style>`));
    let prevConnectionState = GM_getValue('connectionState');
    if (prevConnectionState != undefined) {
      // console.log('connection state:', {...prevConnectionState});
      script.connectionState = prevConnectionState;
    }
    /*
    testConnection().then(function(result) {
      script.connectionState = result;
      // console.log('storing connection state');
      GM_setValue('connectionState', result);
    }); */
    wait(() => $('.application-main').length).then(function() {
      script.processPage();
    });
    let $processbar = $('.Progress');
    script.progressbarListener = new MutationObserver(function(mulist) {
      for (let i = 0; i < mulist.length; i++) {
        let m = mulist[i];
        if (m.type == 'attributes' && !$processbar.hasClass('is-loading')) {
          script.processPage();
        }
      }
    });
    script.progressbarListener.observe($processbar[0], {
      attributes: true
    });
    script.checker = new ElasticInterval(function() {
      script.processPage();
    }, 1000, 1500).start();
  });
  
  // ========================= END github.com ==========================
  
  // if you want to use your own site, the following contition should also be modified
  } else if (
    /^https:\/\/li-zyang.github.io\/ghPreview\/.*/.test(location.toString()) ||
    /^[^:]+:\/\/127.0.0.1\/ghPreview\/.*/.test(location.toString())
  ) {
  
  console.log('working on render page');

  let search = new Search(location.search);
  if (search.provider == 'userscript') {
    let loader = new Promise(function(resolve, reject) {
      let storedSource = GM_getValue('pageSource');
      if (storedSource && storedSource.contentID == search.contentID) {
        console.log('stored source code found, contentID = ' + storedSource.contentID);
        wait(() => window.sourceInfo, 5000).then(function() {
          resolve(storedSource.code);
        }).catch(function(e) {
          reject(e);
        });
      } else {
        console.log('no page source stored, try fetching it from ' + search.source);
        GM_xmlhttpRequest({
          method: 'GET',
          url: search.source,
          revalidate: true,
          timeout: 5000,
          onload: function(result) {
            console.log('successfully fetched page source');
            resolve(result.responseText);
          },
          onerror: function(e) {
            console.error('Error when downloading ' + search.source, e);
            reject(e);
          },
          ontimeout: function(e) {
            console.error('Timeout exceeded when downloading ' + search.source);
            reject(e);
          }
        });
      }
    })
    .then(function(data) {return new Promise(function(resolve, reject) {
      console.log('now replace the sources');
      let parser = new DOMParser();
      let doc = parser.parseFromString(data, 'text/html');
      let requestCount = 0;
      let add  = function() {
        requestCount++
      };
      let done = function() {
        requestCount--;
        console.log('one request is done, now there are ' + requestCount + ' remaining.');
        if (requestCount == 0) {
          resolve(doc);
        }
      };
      let contentScripts = doc.querySelectorAll('script[src]');
      for (let i = 0; i < contentScripts.length; i++) {
        let scriptNode = contentScripts[i];
        console.log(`script source: ${scriptNode.attributes.src.value}`);
        let parsedSource = parseRelativeURL(scriptNode.attributes.src.value);
        if (!parsedSource.hostname) {
          let absoluteUrl = setURLBase(
            scriptNode.attributes.src.value, 
            `https://github.com/${search.repo}/raw/${search.branch}/${search.file.replace(/[^\/]*$/, '')}`
          );
          console.log('starting a download from ' + absoluteUrl);
          GM_xmlhttpRequest({
            method: 'GET',
            url: absoluteUrl,
            timeout: 5000,
            onerror: function(e) {
              console.error('Error when fetching ' + absoluteUrl, e);
              done();
            },
            ontimeout: function(e) {
              console.error('Timed out when fetching ' + absoluteUrl);
              done();
            },
            onload: function(result) {
              console.log('successfully fetched script from ' + result.finalUrl);
              scriptNode.removeAttribute('src');
              scriptNode.innerHTML = result.responseText;
              done();
            }
          });
          add();
        }
      }
      let externalStyles = doc.querySelectorAll('link[rel="stylesheet"][href]');
      for (let i = 0; i < externalStyles.length; i++) {
        let linkNode = externalStyles[i];
        console.log(`external style: ${linkNode.attributes.href.value}`);
        let parsedSource = parseRelativeURL(linkNode.attributes.href.value);
        if (!parsedSource.hostname) {
          let absoluteUrl = setURLBase(
            linkNode.attributes.href.value,
            `https://github.com/${search.repo}/raw/${search.branch}/${search.file.replace(/[^\/]*$/, '')}`
          );
          console.log('starting a download from ' + absoluteUrl);
          GM_xmlhttpRequest({
            method: 'GET',
            url: absoluteUrl,
            timeout: 5000,
            onerror: function(e) {
              console.error('Error when fetching ' + absoluteUrl, e);
              done();
            },
            ontimeout: function(e) {
              console.error('Timed out when fetching ' + absoluteUrl);
              done();
            },
            onload: function(result) {
              console.log('successfully fetched external stylesheet from ' + result.finalUrl);
              let styleNode = doc.createElement('style');
              styleNode.innerHTML = result.responseText;
              linkNode.parentElement.replaceChild(styleNode, linkNode);
              done();
            }
          });
          add();
        }
      }
      let contentImages = doc.querySelectorAll('img[src]');
      for (let i = 0; i < contentImages.length; i++) {
        let imgNode = contentImages[i];
        console.log(`img source: ${imgNode.attributes.src.value}`);
        let parsedSource = parseRelativeURL(imgNode.attributes.src.value);
        if (!parsedSource.hostname) {
          let absoluteUrl = setURLBase(
            imgNode.attributes.src.value,
            `https://github.com/${search.repo}/raw/${search.branch}/${search.file.replace(/[^\/]*$/, '')}`
          );
          console.log('requesting a HEAD to ' + absoluteUrl);
          GM_xmlhttpRequest({
            method: 'HEAD',
            url: absoluteUrl,
            timeout: 5000,
            onerror: function(e) {
              console.error('Error when heading ' + absoluteUrl, e);
              done();
            },
            ontimeout: function(e) {
              console.error('Timed out when heading ' + absoluteUrl);
              done();
            },
            onload: function(result) {
              console.log('successfully got the auth-ed url of image: ' + result.finalUrl);
              imgNode.setAttribute('src', result.finalUrl);
              done();
            }
          });
          add();
        }
      }
      let mediaSources = doc.querySelectorAll('source[src]');
      for (let i = 0; i < mediaSources.length; i++) {
        let sourceNode = mediaSources[i];
        console.log(`video source: ${sourceNode.attributes.src.value}`);
        let parsedSource = parseRelativeURL(sourceNode.attributes.src.value);
        if (!parsedSource.hostname) {
          let absoluteUrl = setURLBase(
            sourceNode.attributes.src.value,
            `https://github.com/${search.repo}/raw/${search.branch}/${search.file.replace(/[^\/]*$/, '')}`
          );
          console.log('requesting a HEAD to ' + absoluteUrl);
          GM_xmlhttpRequest({
            method: 'HEAD',
            url: absoluteUrl,
            timeout: 5000,
            onerror: function(e) {
              console.error('Error when heading ' + absoluteUrl, e);
              done();
            },
            ontimeout: function(e) {
              console.error('Timed out when heading ' + absoluteUrl);
              done();
            },
            onload: function(result) {
              console.log('successfully got the auth-ed url of media source: ' + result.finalUrl);
              sourceNode.setAttribute('src', result.finalUrl);
              done();
            }
          });
          add();
        }
      }
      if (requestCount == 0) {
        resolve(doc);
      }
    })})
    .then(function(doc) {
      window.sourceInfo.pageSource = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
    });
  }

  // ===== END li-zyang.github.io/ghPreview | 127.0.0.1/ghPreview ======
    
  }
  
})(window.unsafeWindow, $);















