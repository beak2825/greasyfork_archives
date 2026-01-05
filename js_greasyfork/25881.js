// ==UserScript==
// @name        Blacklist for Cont.ws
// @namespace   cont.ws
// @version     2.8.5
// @author      Demiurg <spetr@bk.ru>
// @license     GNU General Public License v3
// @description Чистит ленту Cont.ws от упоротых авторов.
// @include     https://cont.ws
// @include     https://cont.ws/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25881/Blacklist%20for%20Contws.user.js
// @updateURL https://update.greasyfork.org/scripts/25881/Blacklist%20for%20Contws.meta.js
// ==/UserScript==

jQuery(function(){
  $(document).ready(function() {
    let storage; 
    if (typeof unsafeWindow !== "undefined") {
        storage = unsafeWindow.localStorage;
    }
    else {
        storage = window.localStorage;
    }
    let config = {
    	  blackList: [ ],
        blackListNames: [ ],
        blackListMapped: [ ],
        count: 1,
        settings: false
    };

    function search(target, arr, cb) {
        let min = 0;
        let max = arr.length - 1;
        let found = -1;
      
        while (min <= max) {
          let mid = Math.round((min + max) / 2);
          let ret = cb (target, arr[mid]);
          if (ret < 0) {
            max = mid - 1;
          }
          else
          if (ret > 0) {
            min = mid + 1;
          }
          else {
            found = mid;
            break;
          }
        }
      
        return found;
    }
    
    function processElement(el) {
      let anchor = $(el)
                    .find('> a[href], div:not([class *= "recm"]) > a[href]')
                    .filter('[href$=".cont.ws"],[href^="/@"],[href^="https://cont.ws/@"],[href^="http://cont.ws/@"]')
                    .filter(':eq(0)');
      
      let href = anchor.attr('href');
      let name = anchor.attr('title') || anchor.text();
      if (! href) {
        return;
      }
      
      let target = href.toLowerCase()
      			.replace(/^https?:\/\/|\/$/ig, '')
      			.replace(/^\/@|\.cont\.ws$|^cont\.ws\/@/g, '');
      if (! target) {
        return;
      }
      
      let found = search(target, config.blackList, (a, b) => a.localeCompare(b));

      if (found !== -1) {
          config.count += 1;
          if (el.tagName === 'LI') {
            config.count += 1;
            $(el).html('Комментарии <a href="' + href + '"><b>' + name + '</b></a> скрыты [ <a id="_restore' + config.count + '" href="#" data-blog="' + target + '" data-name="' + name + '">показать все</a> ]');
            $('#_restore' + config.count).click(deleteFromBlackList);
          }
          else {
            $(el).remove();
          }
      }
      else
      if (! anchor.data('hasBlacklistBtn')) {
          let btnBL = document.createElement("a");
          btnBL.innerHTML = ' [ Скрыть ] ';
          btnBL.href='#';
          $(btnBL).data('name', name.trim());
          $(btnBL).data('blog', target);
          $(btnBL).click(addToBlacklist);
          anchor.after(btnBL);
          anchor.data('hasBlacklistBtn', 1);
      }
    }

    function processElementByName(el) {
      let author = $(el).find("div.author-bar");
      if (author.length > 0) {
        let name = author.text().trim().replace(/\s+\d+$/, '');
        let idxName = search(name, config.blackListName, (a, b) => a.localeCompare(b.name));
        if (idxName !== -1) {
          $(el).remove();
        }
      }
    }
    
    function mappingBlackListName() {
      config.blackListMapped = config.blackListName.map(( { blog }) => blog );
    }
    
    function deleteFromBlackList(ev) {
      ev.preventDefault();
      let blog = $(this).data('blog');
      let name = $(this).data('name');
      if (confirm("Вы действительно хотите снова увидеть статьи и комментарии " + name + "?")) {
        let idx = search(blog, config.blackList, (a, b) => a.localeCompare(b));
        let idxName = config.blackListMapped.indexOf(blog);
        if (idxName !== -1) {
          config.blackListName.splice(idxName, 1);
          mappingBlackListName();
        }
        if (idx !== -1) {
          config.blackList.splice(idx, 1);
          saveBlacklist();
          if (config.settings) {
            $(this).parents('li:eq(0)').remove();
          }
          else {
            window.location.reload(false); 
          }
        }
      }
    }
    
    function addToBlacklist(ev) {
      ev.preventDefault();
      let blog = $(this).data('blog');
      let name = $(this).data('name');
      if (confirm("Вы действительно хотите скрыть статьи и комментарии " + name + "?")) {
        config.blackList.push(blog);
        config.blackListName.push({ blog: blog, name: name });
        mappingBlackListName();
        saveBlacklist();

        triggerExorcism();
      }
    }

    function removeBadAuthor() {
      $('.post_prv:has(".author-bar")')
        .each( (idx, el) => processElement(el) );
      $('.post_prv:has(".author-bar .post_card .media-body")')
        .each( (idx, el) => processElement(el) );
    }
    function removeBadAuthorName() {
      $('div.sidebar > div.post_prv2:has(".author-bar")')
        .each( (idx, el) => processElementByName(el) );
    }
    function removeBadComment() {
      $('.comments li:has("> a")')
        .each( (idx, el) => processElement(el) );
    }

    function triggerExorcism() {
      removeBadAuthor();
      removeBadAuthorName();
      removeBadComment();
    }

    function setInquisitionEvents() {
      let posts_container = document.querySelector('.content > #posts_container');
      if (posts_container) {
        posts_container.addEventListener("DOMNodeInserted", ({ target }) => processElement(target) );
      }
      let posts = document.querySelector('.content > .post, .content #more');
      if (posts) {
        posts.addEventListener("DOMNodeInserted", ({ target }) => processElement(target) );
      }
      let comments = document.querySelector('.comments');
      if (comments) {
        comments.addEventListener("DOMNodeInserted", ({ target }) => processElement(target) );
      }
    }

    function callInquisition() {
        setInquisitionEvents();
        triggerExorcism();
    }
    
    function saveBlacklist() {
        config.blackList.sort();
        config.blackListName.sort((a, b) => a.name.localeCompare(b.name));
        storage.contBlackList = JSON.stringify(config.blackList);
        storage.contBlackListName = JSON.stringify(config.blackListName);
    }
    
    function loadBlacklist() {
        // ---- BlackList ----
        let blackList = storage.contBlackList;
        config.blackList = JSON.parse(blackList ? blackList : '[]');

        if (! config.blackList instanceof Array) {
           config.blackList = [ ];
        }
        // ---- /BlackList ----
        // ---- BlackListName ----
        let blackListName = storage.contBlackListName;
        config.blackListName = JSON.parse(blackListName ? blackListName : '[]');
        mappingBlackListName();
        if (! config.blackListName instanceof Array) {
           config.blackListName = [ ];
        }
        // ---- /BlackListName ----
        for (let i in config.blackList) {
          let item = config.blackList[i].toLowerCase();
          if (item.match(/\.cont\.ws$/)) {
	          config.blackList[i] = item.replace(/\.cont\.ws$/, '');
          }
          else {
            config.blackList[i] = item;
          }
        }
    }
    
    function blacklistSettings() {
        $('ul[role="tablist"]').append('<li role="presentation"><a href="#hidden-users" aria-controls="blacklist" role="tab" data-toggle="tab">Скрытые пользователи</a></li>');
        $('.user_setting > div > .tab-content').append('<div role="tabpanel" class="tab-pane fade" id="hidden-users"><section><div class="jumbotron"><ol id="hidden-users-list"></ol></div></section></div>');
        for (let i in config.blackList) {
          let target = config.blackList[i];
          let idxName = config.blackListMapped.indexOf(target);
          let name = idxName !== -1 ? config.blackListName[idxName].name : target;
          $('#hidden-users-list').append('<li><a href="/@' + target + '">' + name + '</a> <span class="pull-right">[ <a href="#" id="hiddenUser' + i + '" data-blog="' + target + '" data-name="' + name + '">показать</a> ]</span></li>');
          $('#hiddenUser' + i).click(deleteFromBlackList);
        }
    }
    
    function removePromoBar() {
      $('.content div.post_toolbar.post_toolbar__promo').remove();
    }
    
    removePromoBar();
    loadBlacklist();
    config.settings = $('.user_setting').length > 0;
    if (config.settings) {
      blacklistSettings();
    }
    else {
      callInquisition();
    }
  });
});
