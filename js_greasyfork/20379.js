// ==UserScript==
// @name        WME Bookmarklets
// @author      Tom 'Glodenox' Puttemans
// @namespace   http://www.tomputtemans.com/
// @description Put bookmarklets in a tab and provide a better code execution environment
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version     1.0.7
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20379/WME%20Bookmarklets.user.js
// @updateURL https://update.greasyfork.org/scripts/20379/WME%20Bookmarklets.meta.js
// ==/UserScript==
(function() {
  var bookmarklets = [];
  if (localStorage.WME_Bookmarklets) {
    importBookmarklets(JSON.parse(localStorage.WME_Bookmarklets).bookmarklets);
  }

  function init(e) {
    if (e && e.user == null) {
      return;
    }
    if (document.getElementById('user-info') == null) {
      setTimeout(init, 500);
      log('user-info element not yet available, page still loading');
      return;
    }
    if (typeof W.loginManager === 'undefined') {
      setTimeout(init, 300);
      return;
    }
    if (!W.loginManager.user) {
      W.loginManager.events.register('login', null, init);
      W.loginManager.events.register('loginStatus', null, init);
      // Double check as event might have triggered already
      if (!W.loginManager.user) {
        return;
      }
    }

    var bookmarklets_strings = {
      en: {
        tab_title: 'Bookmarklets',
        add_bookmarklet: 'Add bookmarklet',
        empty_list: 'No bookmarklets added yet',
        bookmarklet_name: 'Name',
        bookmarklet_script: 'Script',
        bookmarklet_error: 'Bookmarklet threw an error',
        message: 'Activate a bookmarklet or add a new one:',
        bookmarklet_sources: 'Many Wazers have created bookmarklets to perform small tasks within the WME. Most of these can be found on <a href="https://wiki.waze.com/wiki/Bookmarklets" target="_blank">the wiki</a> or by <a href="https://www.waze.com/forum/search.php?keywords=Bookmarklet&terms=all&sv=0&sc=1&sf=all&sr=posts&sk=t&sd=d&st=0&ch=300&t=0&submit=Search" target="_blank">seaching the forums</a>.',
        bookmarklet_remove: 'Remove bookmarklet'
      }
    };
    setTranslations(bookmarklets_strings);

    var tab = addTab();
    var message = document.createElement('p');
    message.appendChild(document.createTextNode(I18n.t('bookmarklets.message')));
    tab.appendChild(message);

    var emptyList = document.createElement('span');
    emptyList.id = 'emptyBookmarklets';
    emptyList.style.fontStyle = 'italic';
    emptyList.style.display = (bookmarklets.length == 0 ? 'block' : 'none');
    emptyList.appendChild(document.createTextNode(I18n.t('bookmarklets.empty_list')));
    tab.appendChild(emptyList);

    var bookmarkletList = document.createElement('div');
    bookmarkletList.className = 'result-list';
    bookmarkletList.style.marginBottom = '1em';
    bookmarklets.forEach(function(bookmarklet) {
      addBookmarklet(bookmarklet);
    });
    tab.appendChild(bookmarkletList);

    var addBookmarkletForm = document.createElement('form');
    var addBookmarkletTitle = document.createElement('h4');
    addBookmarkletTitle.appendChild(document.createTextNode(I18n.t('bookmarklets.add_bookmarklet')));
    addBookmarkletForm.appendChild(addBookmarkletTitle);
    addBookmarkletForm.style.display = 'none';
    var nameGroup = document.createElement('div');
    nameGroup.className = 'form-group';
    var nameFieldLabel = document.createElement('label');
    nameFieldLabel.htmlFor = 'name';
    nameFieldLabel.appendChild(document.createTextNode(I18n.t('bookmarklets.bookmarklet_name')));
    nameGroup.appendChild(nameFieldLabel);
    var nameField = document.createElement('input');
    nameField.type = 'text';
    nameField.autocomplete = 'off';
    nameField.style.width = '100%';
    nameField.name = 'name';
    nameField.className = 'from-control';
    nameGroup.appendChild(nameField);
    addBookmarkletForm.appendChild(nameGroup);
    var scriptGroup = document.createElement('div');
    scriptGroup.className = 'form-group';
    var scriptFieldLabel = document.createElement('label');
    scriptFieldLabel.htmlFor = 'script';
    scriptFieldLabel.appendChild(document.createTextNode(I18n.t('bookmarklets.bookmarklet_script')));
    scriptGroup.appendChild(scriptFieldLabel);
    var scriptField = document.createElement('textarea');
    scriptField.name = 'script';
    scriptField.className = 'from-control';
    scriptField.style.width = '100%';
    scriptField.style.height = 'auto';
    scriptGroup.appendChild(scriptField);
    addBookmarkletForm.appendChild(scriptGroup);
    var createBookmarklet = document.createElement('input');
    createBookmarklet.type = 'submit';
    createBookmarklet.className = 'btn btn-default';
    createBookmarklet.value = I18n.t('bookmarklets.add_bookmarklet');
    addBookmarkletForm.appendChild(createBookmarklet);

    var addBookmarkletButton = document.createElement('button');
    addBookmarkletButton.className = 'btn btn-default';
    var addSpan = document.createElement('span');
    addSpan.appendChild(document.createTextNode(''));
    addSpan.className = 'fa';
    addSpan.style.marginRight = '5px';
    addBookmarkletButton.appendChild(addSpan);
    addBookmarkletButton.appendChild(document.createTextNode(I18n.t('bookmarklets.add_bookmarklet')));
    addBookmarkletButton.addEventListener('click', function() {
      addBookmarkletButton.style.display = 'none';
      addBookmarkletForm.style.display = 'block';
    });
    tab.appendChild(addBookmarkletButton);
    tab.appendChild(addBookmarkletForm);
    addBookmarkletForm.addEventListener('submit', function(e) {
      e.preventDefault();
      addBookmarkletForm.style.display = 'none';
      addBookmarkletButton.style.display = 'block';
      var newBookmarklet = {};
      newBookmarklet.name = nameField.value;
      newBookmarklet.script = scriptField.value;
      addBookmarklet(newBookmarklet);
      bookmarklets.push(newBookmarklet);
      saveBookmarklets();
      return false;
    }, true);

    var bookmarkletSources = document.createElement('p');
    bookmarkletSources.innerHTML = I18n.t('bookmarklets.bookmarklet_sources');
    bookmarkletSources.style.marginTop = '1em';
    tab.appendChild(bookmarkletSources);
    var versionInfo = document.createElement('a');
    versionInfo.appendChild(document.createTextNode(GM_info.script.name + ' (v' + GM_info.script.version + ')'));
    versionInfo.href = 'https://greasyfork.org/nl/scripts/20379-wme-bookmarklets/';
    versionInfo.target = '_blank';
    tab.appendChild(versionInfo);

    // Create a tab and possibly receive a previous tab to restore (usually in case of a mode change)
    function addTab(recoveredTab) {
      var userInfo = document.getElementById('user-info'),
          tabHandles = userInfo.querySelector('.nav-tabs'),
          tabs = userInfo.querySelector('.tab-content'),
          tabHandle = document.createElement('li'),
          tab = document.createElement('div');
      tabHandle.innerHTML = '<a href="#sidepanel-bookmarklets" data-toggle="tab" title="' + I18n.t('bookmarklets.tab_title') + '"><span class="fa"></span></a>';
      if (recoveredTab) {
        tab = recoveredTab;
      } else {
        tab.id = 'sidepanel-bookmarklets';
        tab.className = 'tab-pane';
      }
      tabHandles.appendChild(tabHandle);
      $(tabHandle.childNodes[0]).tooltip();
      tabs.appendChild(tab);
      return tab;
    }

    function addBookmarklet(bookmarklet) {
      document.getElementById('emptyBookmarklets').style.display = 'none';
      var bookmarkletContainer = document.createElement('div');
      bookmarkletContainer.className = 'result session-available';
      var bookmarkletRemove = document.createElement('button');
      bookmarkletRemove.style.position = 'absolute';
      bookmarkletRemove.style.display = 'none';
      bookmarkletRemove.style.fontSize = '14px';
      bookmarkletRemove.style.top = '4px';
      bookmarkletRemove.style.right = '4px'
      bookmarkletRemove.className = 'btn btn-default fa';
      bookmarkletRemove.addEventListener('click', function(e) {
        e.stopPropagation();
        removeBookmarklet(bookmarklet);
      });
      bookmarkletRemove.appendChild(document.createTextNode(''));
      bookmarkletRemove.title = I18n.t('bookmarklets.bookmarklet_remove');
      $(bookmarkletRemove).tooltip();
      bookmarkletContainer.appendChild(bookmarkletRemove);
      bookmarkletContainer.addEventListener('mouseenter', function() {
        bookmarkletRemove.style.display = 'block';
      });
      bookmarkletContainer.addEventListener('mouseleave', function() {
        bookmarkletRemove.style.display = 'none';
      });
      var bookmarkletName = document.createElement('div');
      bookmarkletName.appendChild(document.createTextNode(bookmarklet.name));
      bookmarkletContainer.appendChild(bookmarkletName);
      var bookmarkletError = document.createElement('div');
      bookmarkletError.style.display = 'none';
      bookmarkletError.style.backgroundColor = 'red';
      bookmarkletError.style.color = '#f2dede';
      bookmarkletError.style.border = '2px solid #f2dede';
      bookmarkletError.style.padding = '4px';
      bookmarkletError.style.margin = '4px 0 4px 0';
      bookmarkletContainer.appendChild(bookmarkletError);
      var bookmarkletErrorClose = document.createElement('button');
      bookmarkletErrorClose.style.fontFamily = 'FontAwesome';
      bookmarkletErrorClose.style.color = '#f2dede';
      bookmarkletErrorClose.style.border = 'none';
      bookmarkletErrorClose.style.background = 'none';
      bookmarkletErrorClose.style.padding = '3px';
      bookmarkletErrorClose.style.float = 'right';
      bookmarkletErrorClose.style.cursor = 'pointer';
      bookmarkletErrorClose.style.height = 'auto';
      bookmarkletErrorClose.style.outline = 'none';
      bookmarkletErrorClose.appendChild(document.createTextNode(''));
      bookmarkletError.addEventListener('click', function(e) {
        e.stopPropagation();
        bookmarkletError.style.display = 'none';
      }, true);
      bookmarkletError.appendChild(bookmarkletErrorClose);
      var bookmarkletErrorTitle = document.createElement('strong');
      bookmarkletErrorTitle.appendChild(document.createTextNode(I18n.t('bookmarklets.bookmarklet_error')));
      bookmarkletError.appendChild(bookmarkletErrorTitle);
      bookmarkletError.appendChild(document.createElement('br'));
      bookmarkletContainer.addEventListener('click', function() {
        try {
          var cleanedUpScript = decodeURI(bookmarklet.script);
          cleanedUpScript = cleanedUpScript.replace('javascript:', '');
          eval(cleanedUpScript);
        } catch (e) {
          log(e);
          if (bookmarkletError.childNodes[3]) { // Remove previous error message
            bookmarkletError.removeChild(bookmarkletError.childNodes[3]);
          }
          bookmarkletError.appendChild(document.createTextNode((e && e.message ? e.message : e)));
          bookmarkletError.style.display = 'block';
        }
      });
      bookmarkletList.appendChild(bookmarkletContainer);
      bookmarklet.container = bookmarkletContainer;
    }

    function removeBookmarklet(bookmarklet) {
      var idx = bookmarklets.indexOf(bookmarklet);
      if (idx > -1) {
        bookmarklets.splice(idx, 1);
      }
      saveBookmarklets();
      bookmarkletList.removeChild(bookmarklet.container);
      if (bookmarklets.length == 0) {
        document.getElementById('emptyBookmarklets').style.display = 'block';
      }
    }
  }

  function setTranslations(translations) {
    I18n.translations[I18n.currentLocale()].bookmarklets = translations.en;
    for (var i = 0; i < Object.keys(translations).length; i++) {
      var locale = Object.keys(translations)[i];
      if (I18n.currentLocale() == locale) {
        I18n.translations[locale].bookmarklets = translations[locale];
        return;
      }
    }
  }

  function importBookmarklets(data) {
    data.forEach(function(bookmarklet) {
      bookmarklets.push(bookmarklet);
    });
  }

  function saveBookmarklets() {
    var storage;
    if (typeof localStorage.WME_Bookmarklets == 'undefined') {
      storage = {};
    } else {
      storage = JSON.parse(localStorage.WME_Bookmarklets);
    }
    storage.bookmarklets = bookmarklets.map(function(bookmarklet) {
      return {
        'name': bookmarklet.name,
        'script': bookmarklet.script
      };
    });
    localStorage.WME_Bookmarklets = JSON.stringify(storage);
  }

  function log(message) {
    if (typeof message === 'string') {
      console.log('%c' + GM_info.script.name + ' (v' + GM_info.script.version + '): %c' + message, 'color:black', 'color:#d97e00');
    } else {
      console.log('%c' + GM_info.script.name + ' (v' + GM_info.script.version + ')', 'color:black', message);
    }
  }

  init();
})();