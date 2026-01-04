// 源代码
(function () {
  const KEY_LOCALCDN = 'LOCAL-CDN';
  const KEY_LOCALCDN_VERSION = 'version';
  const VALUE_LOCALCDN_VERSION = '0.1';
  const KEY_POLYFILL = 'wenku8-plus-injecter';
  GM_PolyFill(KEY_POLYFILL);
  DoLog();
  DoLog(LogLevel.Success, 'wenku8+ loader loaded successfully on this page');

  const main_url   = 'https://greasyfork.org/scripts/416310/code/script.user.js';
  const loader_url = 'https://greasyfork.org/scripts/437461/code/script.js';
  
  dealDocument();

  function dealDocument(oDom=document) {
    // Hook window.open
    const open = window.open;
    window.open = openWithInjector;
    function openWithInjector(strUrl, strWindowName, strWindowFeatures) {
      const newTab = open(strUrl, strWindowName, strWindowFeatures);
      const oDom = newTab.document;
      const oWin = newTab.window;
      oWin.addEventListener('load', function() {
        const script = oDom.createElement('script');
        script.src = loader_url;
        oWin.document.head.appendChild(script);
      });
      return newTab;
    }

    // Hook <a>
    hooklinks();
    setInterval(hooklinks, 200);

    // Load wenku8+
    const script = oDom.createElement('script');
    script.src = main_url;
    document.head.appendChild(script);

    function hooklinks() {
      // Hook <a>
      for (const a of document.querySelectorAll('a')) {
        !a.wenku8_loader_hooked && a.addEventListener('click', onclick);
        a.wenku8_loader_hooked = true;
      }

      function onclick(e) {
        const a = e.currentTarget;
        const href = a.href;;
        if (!a.href.match(/^https?:\/\//)) {return;}

        destroyEvent(e);
        window.open(href);
      }
    }
  }



  // Just stopPropagation and preventDefault
  function destroyEvent(e) {
    if (!e) {return false;};
    if (!e instanceof Event) {return false;};
    e.stopPropagation();
    e.preventDefault();
  }

  // Load/Read and Save javascript from given url
  // Auto reties when xhr fails.
  // If load success then callback(true), else callback(false)
  function loadJSPlus(url, callback, oDoc=document, maxRetry=3, retried=0) {
    const fn = callback || function () {};
    const localCDN = GM_getValue(KEY_LOCALCDN, {});
    if (localCDN[url]) {
      DoLog(LogLevel.Info, 'Loading js from localCDN: ' + url);
      const js = localCDN[url];
      appendScript(js);
      fn(true);
      return;
    }

    DoLog(LogLevel.Info, 'Loading js from web: ' + url);
    GM_xmlhttpRequest({
      method       : 'GET',
            url          : url,
            responseType : 'text',
      onload       : function(e) {
        if (e.status === 200) {
          const js = e.responseText;
          localCDN[url] = js;
          localCDN[KEY_LOCALCDN_VERSION] = VALUE_LOCALCDN_VERSION;
          GM_setValue(KEY_LOCALCDN, localCDN);

          appendScript(js);
          fn(true);
        } else {
          retry();
        }
      },
      onerror      : retry
    })

    function appendScript(code) {
      const script = oDoc.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = code;
      oDoc.head.appendChild(script);
    }

    function retry() {
      retried++;
      if (retried <= maxRetry) {
        loadJSPlus(url, callback, oDoc, maxRetry, retried);
      } else {
        fn(false);
      }
    }
  }

  // GM_Polyfill By PY-DNG
  // 2021.07.18
  // Simply provides the following GM_functions using localStorage, XMLHttpRequest and window.open:
  // Returns object GM_POLYFILLED which has the following properties that shows you which GM_functions are actually polyfilled:
  // GM_setValue, GM_getValue, GM_deleteValue, GM_listValues, GM_xmlhttpRequest, GM_openInTab, GM_setClipboard
  function GM_PolyFill(name='default') {
    const GM_POLYFILL_KEY_STORAGE = 'GM_STORAGE_POLYFILL';
    const GM_POLYFILL_storage = GM_POLYFILL_getStorage();
    const GM_POLYFILLED = {
      GM_setValue: true,
      GM_getValue: true,
      GM_deleteValue: true,
      GM_listValues: true,
      GM_xmlhttpRequest: true,
      GM_openInTab: true,
      GM_setClipboard: true,
    };

    GM_setValue_polyfill();
    GM_getValue_polyfill();
    GM_deleteValue_polyfill();
    GM_listValues_polyfill();
    GM_xmlhttpRequest_polyfill();
    GM_openInTab_polyfill();
    GM_setClipboard_polyfill();

    function GM_POLYFILL_getStorage() {
      let gstorage = localStorage.getItem(GM_POLYFILL_KEY_STORAGE);
      gstorage = gstorage ? JSON.parse(gstorage) : {};
      let storage = gstorage[name] ? gstorage[name] : {};
      return storage;
    };

    function GM_POLYFILL_saveStorage() {
      let gstorage = localStorage.getItem(GM_POLYFILL_KEY_STORAGE);
      gstorage = gstorage ? JSON.parse(gstorage) : {};
      gstorage[name] = GM_POLYFILL_storage;
      localStorage.setItem(GM_POLYFILL_KEY_STORAGE, JSON.stringify(gstorage));
    };

    // GM_setValue
    function GM_setValue_polyfill() {
      typeof (GM_setValue) === 'function' ? GM_POLYFILLED.GM_setValue = false: window.GM_setValue = PF_GM_setValue;;

      function PF_GM_setValue(name, value) {
        name = String(name);
        GM_POLYFILL_storage[name] = value;
        GM_POLYFILL_saveStorage();
      };
    };

    // GM_getValue
    function GM_getValue_polyfill() {
      typeof (GM_getValue) === 'function' ? GM_POLYFILLED.GM_getValue = false: window.GM_getValue = PF_GM_getValue;

      function PF_GM_getValue(name, defaultValue) {
        name = String(name);
        if (GM_POLYFILL_storage.hasOwnProperty(name)) {
          return GM_POLYFILL_storage[name];
        } else {
          return defaultValue;
        };
      };
    };

    // GM_deleteValue
    function GM_deleteValue_polyfill() {
      typeof (GM_deleteValue) === 'function' ? GM_POLYFILLED.GM_deleteValue = false: window.GM_deleteValue = PF_GM_deleteValue;

      function PF_GM_deleteValue(name) {
        name = String(name);
        if (GM_POLYFILL_storage.hasOwnProperty(name)) {
          delete GM_POLYFILL_storage[name];
          GM_POLYFILL_saveStorage();
        };
      };
    };

    // GM_listValues
    function GM_listValues_polyfill() {
      typeof (GM_listValues) === 'function' ? GM_POLYFILLED.GM_listValues = false: window.GM_listValues = PF_GM_listValues;

      function PF_GM_listValues() {
        return Object.keys(GM_POLYFILL_storage);
      };
    };

    // GM_xmlhttpRequest
    // not supported properties of details: synchronous binary nocache revalidate context fetch
    // not supported properties of response(onload arguments[0]): finalUrl
    // ---!IMPORTANT!--- DOES NOT SUPPORT CROSS-ORIGIN REQUESTS!!!!! ---!IMPORTANT!---
    function GM_xmlhttpRequest_polyfill() {
      typeof (GM_xmlhttpRequest) === 'function' ? GM_POLYFILLED.GM_xmlhttpRequest = false: window.GM_xmlhttpRequest = PF_GM_xmlhttpRequest;

      // details.synchronous is not supported as Tempermonkey
      function PF_GM_xmlhttpRequest(details) {
        const xhr = new XMLHttpRequest();

        // open request
        const openArgs = [details.method, details.url, true];
        if (details.user && details.password) {
          openArgs.push(details.user);
          openArgs.push(details.password);
        }
        xhr.open.apply(xhr, openArgs);

        // set headers
        if (details.headers) {
          for (const key of Object.keys(details.headers)) {
            xhr.setRequestHeader(key, details.headers[key]);
          };
        };
        details.cookie ? xhr.setRequestHeader('cookie', details.cookie) : function () {};
        details.anonymous ? xhr.setRequestHeader('cookie', '') : function () {};

        // properties
        xhr.timeout = details.timeout;
        xhr.responseType = details.responseType;
        details.overrideMimeType ? xhr.overrideMimeType(details.overrideMimeType) : function () {};

        // events
        xhr.onabort = details.onabort;
        xhr.onerror = details.onerror;
        xhr.onloadstart = details.onloadstart;
        xhr.onprogress = details.onprogress;
        xhr.onreadystatechange = details.onreadystatechange;
        xhr.ontimeout = details.ontimeout;
        xhr.onload = function (e) {
          const response = {
            readyState: xhr.readyState,
            status: xhr.status,
            statusText: xhr.statusText,
            responseHeaders: xhr.getAllResponseHeaders(),
            response: xhr.response
          };
          (details.responseType === '' || details.responseType === 'text') ? (response.responseText = xhr.responseText) : function () {};
          (details.responseType === '' || details.responseType === 'document') ? (response.responseXML = xhr.responseXML) : function () {};
          details.onload(response);
        };

        // send request
        details.data ? xhr.send(details.data) : xhr.send();

        return {
          abort: xhr.abort
        };
      };
    };

    // NOTE: options(arg2) is NOT SUPPORTED! if provided, then will just be skipped.
    function GM_openInTab_polyfill() {
      typeof (GM_openInTab) === 'function' ? GM_POLYFILLED.GM_openInTab = false: window.GM_openInTab = PF_GM_openInTab;

      function PF_GM_openInTab(url) {
        window.open(url);
      };
    };

    // NOTE: needs to be called in an event handler function, and info(arg2) is NOT SUPPORTED!
    function GM_setClipboard_polyfill() {
      typeof (GM_setClipboard) === 'function' ? GM_POLYFILLED.GM_setClipboard = false: window.GM_setClipboard = PF_GM_setClipboard;

      function PF_GM_setClipboard(text) {
        // Create a new textarea for copying
        const newInput = document.createElement('textarea');
        document.body.appendChild(newInput);
        newInput.value = text;
        newInput.select();
        document.execCommand('copy');
        document.body.removeChild(newInput);
      };
    };

    return GM_POLYFILLED;
  };

  // Arguments: level=LogLevel.Info, logContent, asObject=false
  // Needs one call "DoLog();" to get it initialized before using it!
  function DoLog() {
    // Global log levels set
    window.LogLevel = {
      None: 0,
      Error: 1,
      Success: 2,
      Warning: 3,
      Info: 4,
    }
    window.LogLevelMap = {};
    window.LogLevelMap[LogLevel.None]     = {prefix: ''          , color: 'color:#ffffff'}
    window.LogLevelMap[LogLevel.Error]    = {prefix: '[Error]'   , color: 'color:#ff0000'}
    window.LogLevelMap[LogLevel.Success]  = {prefix: '[Success]' , color: 'color:#00aa00'}
    window.LogLevelMap[LogLevel.Warning]  = {prefix: '[Warning]' , color: 'color:#ffa500'}
    window.LogLevelMap[LogLevel.Info]     = {prefix: '[Info]'    , color: 'color:#888888'}
    window.LogLevelMap[LogLevel.Elements] = {prefix: '[Elements]', color: 'color:#000000'}

    // Current log level
    DoLog.logLevel = window.isPY_DNG ? LogLevel.Info : LogLevel.Warning; // Info Warning Success Error

    // Log counter
    DoLog.logCount === undefined && (DoLog.logCount = 0);
    if (++DoLog.logCount > 512) {
        console.clear();
        DoLog.logCount = 0;
    }

    // Get args
    let level, logContent, asObject;
    switch (arguments.length) {
      case 1:
        level = LogLevel.Info;
        logContent = arguments[0];
        asObject = false;
        break;
      case 2:
        level = arguments[0];
        logContent = arguments[1];
        asObject = false;
        break;
      case 3:
        level = arguments[0];
        logContent = arguments[1];
        asObject = arguments[2];
        break;
      default:
        level = LogLevel.Info;
        logContent = 'DoLog initialized.';
        asObject = false;
        break;
    }

    // Log when log level permits
    if (level <= DoLog.logLevel) {
      let msg = '%c' + LogLevelMap[level].prefix;
      let subst = LogLevelMap[level].color;

      if (asObject) {
        msg += ' %o';
      } else {
        switch(typeof(logContent)) {
          case 'string': msg += ' %s'; break;
          case 'number': msg += ' %d'; break;
          case 'object': msg += ' %o'; break;
        }
      }

      console.log(msg, subst, logContent);
    }
  }
})();