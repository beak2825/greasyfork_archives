// ==UserScript==
// @name         Twitch GIF picker
// @namespace    https://twitter.com/aloneunix
// @version      0.1.6
// @description  Post your favorite GIFs to Twitch chat
// @author       aloneunix
// @match        https://www.twitch.tv/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @downloadURL https://update.greasyfork.org/scripts/408789/Twitch%20GIF%20picker.user.js
// @updateURL https://update.greasyfork.org/scripts/408789/Twitch%20GIF%20picker.meta.js
// ==/UserScript==


const gifIcon = `data:image/svg+xml;base64,
PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94P
SIwIDAgMTI4IDEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KID
xnPgogIDxwYXRoIGQ9Im01NSA5MHEtOSA1LTIwIDUtMTMgMC0yMS04LTgtOC04LTIyIDA
tMTQgOS0yMyA5LTkgMjItOSAxMCAwIDE2IDN2OHEtNy01LTE3LTUtMTAgMC0xNiA3LTYg
Ny02IDE4IDAgMTEgNiAxOCA2IDYgMTYgNiA3IDAgMTItM3YtMTdoLTEzdi02aDIweiIvP
gogIDxwYXRoIGQ9Im03NiA5NWgtN3YtNjBoN3oiLz4KICA8cGF0aCBkPSJtMTIyIDQxaC
0yM3YyMWgyMnY2aC0yMnYyNmgtN3YtNjBoMzB6Ii8+CiA8L2c+Cjwvc3ZnPgo=`.replace(/\n/g, '');

const crossIcon = `data:image/svg+xml;base64,
PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZlcnNpb249IjEuMSIgdmlld0JveD0iM
CAwIDY0IDY0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogPGcgZm
lsbD0iI2RkZCI+CiAgPHBhdGggZD0ibTUyIDQgOCA4LTQ4IDQ4LTgtOHoiLz4KICA8cGF
0aCBkPSJtNCAxMiA4LTggNDggNDgtOCA4eiIvPgogPC9nPgo8L3N2Zz4K`.replace(/\n/g, '');

const starIcon = `data:image/svg+xml;base64,
PHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA2NCA2NCIgeG1sbnM9Imh0dHA6L
y93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxwYXRoIGQ9Im0zMiA0LjkxYzEuODEgMCA3Lj
QyIDE1LjYgOC44OCAxNi44czE3LjIgMS45OCAxNy43IDMuOGMwLjU1OSAxLjgzLTExLjc
gMTIuMy0xMi4yIDE0LjItMC41NTkgMS44MyAzLjU0IDE4IDIuMDggMTkuMXMtMTQuNi04
LjAxLTE2LjQtOC4wMS0xNSA5LjE0LTE2LjQgOC4wMWMtMS40Ni0xLjEzIDIuNjQtMTcuM
yAyLjA4LTE5LjEtMC41NTktMS44My0xMi44LTEyLjMtMTIuMi0xNC4yIDAuNTU5LTEuOD
MgMTYuMy0yLjY3IDE3LjctMy44czcuMDctMTYuOCA4Ljg4LTE2Ljh6Ii8+Cjwvc3ZnPgo
=`.replace(/\n/g, '');

const pinIcon = `data:image/svg+xml;base64,
PHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA2NCA2NCIgeG1sbnM9Imh0dHA6L
y93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnIHN0cm9rZT0iI2RkZCI+CiAgPHBhdGggZD
0ibTI5IDQ4IDI2LTMzLTctNy0zMyAyNiIgZmlsbD0iI2RkZCIgc3Ryb2tlLXdpZHRoPSI
4Ii8+CiAgPGc+CiAgIDxwYXRoIGQ9Im0xMSAzMCAyMyAyMyIgc3Ryb2tlLXdpZHRoPSI0
Ii8+CiAgIDxwYXRoIGQ9Im0yNyAzNy0yNSAyNSIgc3Ryb2tlLXdpZHRoPSI0Ii8+CiAgI
DxwYXRoIGQ9Im00NyAyIDE1IDE1IiBzdHJva2Utd2lkdGg9IjQiLz4KICA8L2c+CiA8L2
c+Cjwvc3ZnPgo=`.replace(/\n/g, '');

const css = `
  .gif-button {
    /* background-image: url("${gifIcon}");
    background-size: 25px;
    background-position: center;
    background-repeat: no-repeat; */

    fill: currentColor;
    width: 100%;
    height: 100%;
  }

  .gif-button-parent {
    height: var(--button-size-default);
    width: var(--button-size-default);
  }

  .ui-dialog-content input {
    margin-bottom: 12px;
    width: 95%;
    padding: .4em;
  }

  .ui-dialog {
    z-index: 3001 !important;
  }

  #gif-widget-root .menu {
    position: absolute;
    z-index: 3000;
  }

  #gif-widget-root .menu li {
    list-style-position: unset;
    display: none;
  }

  #gif-widget-root .menu .ui-state-active {
    background-color: #a676ee;
    border-color: #a676ee;
  }

  #gif-widget-root .icons {
    float: right;
  }

  #gif-widget-root .icon {
    background-size: 16px;
    background-position: center;
    background-repeat: no-repeat;
    width: 20px;
    height: 20px;
    float: left;
    cursor: pointer;
    opacity: .5;
  }

  #gif-widget-root > .gif-widget-header .icon:hover {
    /* background-color: #aaa; */
    opacity: 1;
  }

  #gif-widget-root .icon.cross {
    background-image: url("${crossIcon}");
  }

  #gif-widget-root .icon.pin {
    background-image: url("${pinIcon}");
    transition: all .25s ease;
  }

  #gif-widget-root .icon.pin:hover,
  #gif-widget-root.pinned .icon.pin {
    transform: rotate(-45deg);
    opacity: 1;
  }

  #gif-widget-root * {
    box-sizing: content-box;
  }

  #gif-widget-root > .ui-icon-triangle-1-se {
      width: 10px;
      height: 10px;
      right: 0px;
      bottom: 0px;
  }

  #gif-widget-root > .gif-widget-header {
    cursor: default;
    color: #ddd;
    height: 20px;
    padding: 3px;
  }

  #gif-widget-root *::-webkit-scrollbar {
    width: 10px;
  }
  #gif-widget-root *::-webkit-scrollbar-track {
    background: #ddd;
  }
  #gif-widget-root *::-webkit-scrollbar-thumb {
    background: #888;
  }
  #gif-widget-root *::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  #gif-widget-root {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #202020;
    height: 600px;
    width: 400px;
    position: absolute;
    z-index: 3000;
  }
  .gif-widget-body {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .gif-wrapper > img,
  .gif-wrapper > video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* box-shadow: 0 2px 16px rgba(0,0,0,.2); */
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
  }

  section.chat-room .gif-wrapper > img,
  section.chat-room .gif-wrapper > video {
    width: auto;
    height: auto;
    object-fit: contain;
    max-height: inherit;
    max-width: 100%;
  }

  .gif-widget-body > .grid-container > .gif-wrapper:hover > img,
  .gif-widget-body > .grid-container > .gif-wrapper:hover > video {
    opacity: 0.8;
    cursor: pointer;
  }

  .gif-wrapper:hover > .star {
    opacity: 1;
    cursor: pointer;
  }

  .gif-wrapper {
    position: relative;
  }

  section.chat-room .gif-wrapper {
    max-height: 250px;
    width: fit-content;
    width: -moz-fit-content;
  }

  .gif-wrapper > .star {
    /* background-image: url("${starIcon}");
    background-size: 20px;
    background-position: center;
    background-repeat: no-repeat; */
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    width: 26px;
    height: 26px;
    opacity: 0;
    transform: scale(0.75);
  }

  .gif-wrapper > .star {
    stroke-width: 4pt;
    stroke: #a676ee;
    fill: #a676ee;
  }

  .gif-widget-body > .grid-container {
    display: grid;
    grid-gap: 5px;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    grid-auto-rows: 120px;
    grid-auto-flow: dense;
  }`;


$(document).ready(() => {
  $('head').append($('<link/>', {'href': 'https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css', 'rel': 'stylesheet', 'type': 'text/css'}));
  $('head').append($('<style/>', {'type': 'text/css'}).text(css));

  class GifWrapper {
    constructor(store, tag, url) {
      let node;
      if (tag == 'img') {
        node = $('<img/>', {'src': url});
      } else if (tag == 'video') {
        node = $('<video/>', {'src': url, 'autoplay': '', 'loop': '', 'muted': '', 'onloadedmetadata': 'this.muted = true', 'preload': 'auto'});
      } else {
        console.error('unsupported tag:', tag);
        return;
      }
      this.node = node;
      this.wrapper = $('<div/>', {'class': 'gif-wrapper'}).append(
          $('<svg class="star" viewBox="0 0 64 64"><use xlink:href="#favstar"></svg>'),
      );
      this.wrapper.append(node);

      this.wrapper.mouseover(() => this.updateStar(store.get(url)));

      this.wrapper.find('.star').click((event) => {
        event.stopPropagation();
        if (store.get(url)) {
          store.delete(url);
          this.updateStar(false);
        } else {
          store.add(tag, url);
          this.updateStar(true);
        }
      });
    }

    onLoad(func) {
      if (this.node.prop('tagName').toLowerCase() == 'img') {
        this.node.on('load', func);
      } else { // video
        this.node.on('loadedmetadata', func);
      }
    }

    onClick(func) {
      this.wrapper.click(func);
    }

    updateStar(state) {
      this.wrapper.find('.star').css('fill', state ? '' : 'none');
    }
  }

  class GifWidget {
    constructor({store, onSelect}) {
      this.store = store;
      this.onSelect = onSelect;

      this.nodes = new Map();
      this.gif_container = $('<div/>', {'class': 'grid-container'});

      const star = $(atob(starIcon.split('base64,')[1])).hide();
      star.find('path').attr('id', 'favstar');

      const addDialogInput = $('<input/>', {'type': 'text'});
      const addDialog = $('<div/>', {'title': 'Add GIF'})
          .append($('<p/>', {'text': 'Please input an image URL'}))
          .append(addDialogInput);
      addDialog.hide();
      const dialogOpts = {
        resizable: false,
        modal: true,
        buttons: [
          {
            text: 'OK',
            click: () => {
              addDialog.dialog('close');
              const url = addDialogInput.val();
              getTag(url, (tag) => {
                this.store.add(tag, url);
              });
              addDialogInput.val('');
            },
          },
        ],
      };

      this.menu = $('<ul/>', {'text': 'GIF list', 'class': 'menu', 'click': () => this.toggleMenu()})
          .append($('<li/>').append($('<div/>', {'text': 'Add...', 'click': () => addDialog.dialog(dialogOpts)})))
          // .append($('<li/>').append($('<div/>', {'text': 'Settings'}))
          //     .append($('<ul/>')
          //         .append($('<li/>').append($('<div/>', {'text': 'Import'})))
          //         .append($('<li/>').append($('<div/>', {'text': 'Export'}))),
          //     ),
          // );

      this.widget = $('<div/>', {'id': 'gif-widget-root'})
          .append(star)
          .append(addDialog)
          .append($('<div/>', {'class': 'gif-widget-header'})
              .append(this.menu)
              .append($('<div/>', {'class': 'icons'})
                  .append($('<div/>', {'class': 'icon pin', 'click': () => this.widget.toggleClass('pinned')}))
                  .append($('<div/>', {'class': 'icon cross', 'click': () => this.toggle()})),
              ),
          )
          .append($('<div/>', {'class': 'gif-widget-body'})
              .append(this.gif_container),
          );
    }

    toggleMenu() {
      if (this.menu.menu('instance') !== undefined) {
        $('#gif-widget-root .menu li').hide();
        this.menu.menu('destroy');
      } else {
        this.menu.menu();
        $('#gif-widget-root .menu li').show();
      }
    }

    render() {
      this.widget.disableSelection();
      this.widget.resizable({minHeight: 180, minWidth: 150, containment: 'main', handles: 'all', classes: {'ui-resizable-se': 'ui-icon ui-icon-triangle-1-se'}});
      this.widget.draggable({handle: '.gif-widget-header', containment: 'main'});
      this.widget.css('position', 'absolute'); // silly draggable sets widget's position to relative
      this.widget.css('display', 'none');
      $('body').append(this.widget);

      // load gifs from store
      this.store.gifs.slice().reverse().forEach((gif) => this.add(gif.tag, gif.src));

      // listen to new gifs in store
      this.store.addListener('on_add', (gif) => this.add(gif.tag, gif.src));
      this.store.addListener('on_delete', (url) => this.delete(url));
      this.store.addListener('on_move', (url, newPosition) => this.move(url, newPosition));
    }

    add(tag, url) {
      if (this.nodes.has(url)) return;
      const gif = new GifWrapper(this.store, tag, url);
      gif.onClick(() => {
        this.onSelect(url);
        this.store.move(url, 0);
        if (!this.widget.hasClass('pinned')) {
          this.toggle();
        }
      });
      this.nodes.set(url, gif.wrapper);
      this.gif_container.prepend(gif.wrapper);
    }

    delete(url) {
      if (this.nodes.has(url)) {
        const gif = this.nodes.get(url);
        gif.fadeOut('fast', () => gif.remove());
        this.nodes.delete(url);
      }
    }

    move(url, newPosition) {
      if (this.nodes.has(url)) {
        const gif = this.nodes.get(url);
        const next = this.gif_container.children().eq(newPosition);

        gif.fadeOut(0, () => gif.insertBefore(next).fadeIn('fast'));
      }
    }

    outsideClickHandler(event) {
      const dialog = document.querySelector('body > div[role=dialog]');
      if (!event.data.self.widget[0].contains(event.target) &&
        event.target != event.data.caller &&
        document.body.contains(event.target) && // check that node wasn't deleted
        event.data.self.widget.is(':visible') &&
        !event.data.self.widget.hasClass('pinned') &&
        !(event.target.classList.contains('ui-widget-overlay') || // don't close when modal is open -- outside
          dialog && dialog.contains(event.target)) //                                            OR -- inside
      ) {
        event.data.self.toggle();
      }
    };

    toggle(caller) {
      if (this.widget.is(':hidden')) {
        $('body').on('click', {self: this, caller: caller}, this.outsideClickHandler);

        const chatList = $('section.chat-room');
        const top = chatList.offset().top - $(document).scrollTop();
        const left = chatList.offset().left - $(document).scrollLeft();
        this.widget.css({top: top, left: left});
        this.widget.width(chatList.width());
        this.widget.height(chatList.height());
        this.widget.show();
      } else {
        this.widget.removeClass('pinned');
        $('body').off('click', this.outsideClickHandler);
        this.widget.hide();
      };
    }
  }

  class GifStore {
    constructor() {
      this.gifs = JSON.parse(localStorage['gifs'] || '[]');
      this.listener = [];
    }

    addListener(type, callback) {
      this.listener.push({type: type, callback: callback});
    }

    emitCallbacks(type, ...params) {
      this.listener.forEach((listener) => {
        if (listener.type == type) listener.callback(...params);
      });
    }

    save() {
      localStorage['gifs'] = JSON.stringify(this.gifs);
    }

    get(url) {
      return this.gifs.find((gif) => gif.src == url);
    }

    add(tag, url) {
      if (this.get(url)) return;
      const newGif = {src: url, tag: tag};
      this.gifs.unshift(newGif);
      this.emitCallbacks('on_add', newGif);
      this.save();
    }

    delete(url) {
      const gif = this.get(url);
      if (gif) {
        const index = this.gifs.indexOf(gif);
        if (index === -1) return;
        this.gifs.splice(index, 1);
        this.emitCallbacks('on_delete', url);
        this.save();
      }
    }

    move(url, newPosition) {
      const gif = this.get(url);
      if (gif) {
        const from = this.gifs.indexOf(gif);
        if (from === -1) return;
        // this.gifs.unshift(this.gifs.splice(from, 1));

        const removed = this.gifs.splice(from, 1);
        this.gifs.splice(newPosition, 0, removed[0]);
        this.emitCallbacks('on_move', url, newPosition);
        this.save();
      }
    }
  }

  class LRU {
    // SO: a/46432113
    constructor(max = 10) {
      this.max = max;
      this.cache = new Map();
    }

    has(key) {
      return this.cache.has(key);
    }

    get(key) {
      const item = this.cache.get(key);
      if (item) {
        // refresh key
        this.cache.delete(key);
        this.cache.set(key, item);
      }
      return item;
    }

    set(key, val) {
      // refresh key
      if (this.cache.has(key)) this.cache.delete(key);
      // evict oldest
      else if (this.cache.size == this.max) this.cache.delete(this.first());
      this.cache.set(key, val);
    }

    first() {
      return this.cache.keys().next().value;
    }
  }

  class ChatObserver {
    constructor(store) {
      this.store = store;
      this.cache = new LRU(500);
    }

    observe() {
      const chatList = document.querySelector('section.chat-room');
      const scrollable = chatList.querySelector('.simplebar-scroll-content');
      new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type == 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.querySelector) {
                const link = node.querySelector('a.link-fragment');
                if (link) {
                  const url = link.href;

                  new Promise((resolve) => {
                    if (this.cache.has(url)) {
                      resolve(this.cache.get(url));
                    } else {
                      getTag(url, (tag) => {
                        this.cache.set(url, tag);
                        resolve(tag);
                      });
                    }
                  }).then((tag) => {
                    // true when chat scrolled to bottom (scrollHeight - max height of log, clientHeight - visible)
                    const isScrollNotPaused = scrollable.scrollTop == scrollable.scrollHeight - scrollable.clientHeight;
                    const gif = new GifWrapper(this.store, tag, link.href);
                    $(node).find('span[data-test-selector="chat-line-message-body"]').first().append(gif.wrapper);
                    $(link).hide();

                    if (isScrollNotPaused) {
                      gif.onLoad(() => {
                        // node.scrollIntoView(); // this one sometimes overscrolls for some reason
                        scrollable.scrollTop += node.scrollHeight;
                      });
                    }
                  });
                }
              }
            });
          }
        });
      }).observe(chatList, {
        childList: true,
        subtree: true,
      });
    }
  }

  const getTag = (url, result) => {
    const extension = new URL(url).pathname.split('.').pop();
    if (['gif', 'jpg', 'png'].indexOf(extension) >= 0) {
      result('img');
      return;
    }
    if (['mp4', 'webm'].indexOf(extension) >= 0) {
      result('video');
      return;
    }

    const image = new Image();
    image.onload = () => result('img');
    image.onerror = () => {
      const video = document.createElement('video');
      video.onloadedmetadata = () => result('video');
      video.onerror = () => console.debug('skip ', url);
      video.src = url;
      // video.load();
    };
    image.src = url;
  };

  const main = () => {
    console.log('a');
    const store = new GifStore();
    const widget = new GifWidget({
      store: store,
      onSelect: (url) => {
        // some hacky shit for React straight from SO
        const textarea = $('.chat-input__textarea textarea')[0];
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
        nativeInputValueSetter.call(textarea, url);
        const ev2 = new Event('input', {bubbles: true});
        textarea.dispatchEvent(ev2);
      }});
    widget.render();

    // add GIF button
    const gifIconSvg = $(atob(gifIcon.split('base64,')[1])).addClass('gif-button');
    const chatButton = document.querySelector('button[data-a-target="chat-send-button"');
    $('<button/>', {'class': 'tw-core-button tw-button-icon gif-button-parent', 'click': () => widget.toggle(event.target)}).append(gifIconSvg)
        .insertBefore(chatButton.parentNode.parentNode.previousSibling);

    const chat = new ChatObserver(store);
    chat.observe();
  };

  new MutationObserver((mutations, observer) => {
    if (document.querySelector('section.chat-room')) {
      observer.disconnect();
      main();
    }
  }).observe(document, {
    childList: true,
    subtree: true,
  });
});
