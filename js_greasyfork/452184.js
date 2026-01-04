
// ==UserScript==
// @name         Menu - [ X ]
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Add custome menu extender video list from video/image in new tab/page.
// @copyright    2022, terifash (https://greasyfork.org/en/users/964055-teri-fash)
// @author       teri.fash <teri.fash@gmail.com>
// @license      MIT
// @match        *://*.xvideos.com/video*
// @icon         https://www.xvideos.com/favicon-32x32.png
// @supportURL   https://github.com/TeriFash/x.scripts.user/issues
// @homepageURL  https://github.com/TeriFash/x.scripts.user
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/452184/Menu%20-%20%5B%20X%20%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/452184/Menu%20-%20%5B%20X%20%5D.meta.js
// ==/UserScript==

(function() {
  let listVideo = [];
  const actionsDefault = {
      position: 'left',
      size: 'main',
      hides: 'shows'
  }

  // Получаем значения со стора

  function getStoreData(value) {
      let result = window.localStorage.getItem(`video-menu-${value}`);

      if(!result) {
        window.localStorage.setItem(`video-menu-${value}`, actionsDefault[value]);
        result = actionsDefault[value]
      }
      return result
  };

  // Создаем нужный узел

  function elGenerator(parent = 'body', type = 'div', classes = '', data, title, styled, subClass) {
    let el;

    switch (type) {
      case 'link':
        el = $(`<a href="#" class="menu-list__btn ${classes}" data-title="${data}">${title}</a>`)[0];
        break;
      case 'menu':
        el = $(`<div id="menu-content-list" class="menu-list"><div class="menu-list__btn-wrapper"></div><div class="menu-list__mozaique mozaique"></div></div>`)[0];
        break;
      case 'error':
      case 'div':
      case 'info':
      default:
        el = $(`<div class="${classes}" style="${styled}"></div>`)[0];
        break;
    }

    $(parent).append(el);
  }

  // Действие по клику на кнопку

  function configClick({event, getClass, setClass, dataType, title, iconOld, icon}) {
      window.localStorage.setItem(`video-menu-${dataType}`, setClass);
      $('#menu-content-list').toggleClass(`${getClass} ${setClass}`).data(dataType, setClass);

      if(iconOld && icon) {
        const iconBtn = $(`.menu-list__btn-wrapper > .${iconOld}`);
        if(iconBtn) iconBtn.toggleClass(`${iconOld} ${icon}`);
      } else {
        event.toggleClass(`${getClass} ${setClass}`);
        event.innerHTML = title;
      }
    }

  // Слушалель клика на кнопку

  function greetingClick(event) {
      const menu = $(`#menu-content-list`);
      const type = event.target.getAttribute('data-title');
      const dataOptions = {
        event: event.target,
        getClass: '',
        setClass: '',
        dataType: type,
        title: '',
        iconOld: ``,
        icon: ``
      };

      switch(type) {
        case 'reload':
          updateList();
          setTimeout(() => {
            $('.menu-list__btn-wrapper > .reload').attr('disabled', false);
          }, 400);
        break;
        case 'hides':
          if(menu.hasClass("shows")) {
            Object.assign(dataOptions, {
              getClass: 'shows',
              setClass: 'hides',
              iconOld: `icf-eye`,
              icon: `icf-eye-blocked`
            });
            configClick(dataOptions);
          } else {
            Object.assign(dataOptions, {
              getClass: 'hides',
              setClass: 'shows',
              iconOld: `icf-eye-blocked`,
              icon: `icf-eye`
            });
            configClick(dataOptions);
            setVideoList();
          }
        break;
        case 'size':
          if(menu.hasClass("main")) {
            Object.assign(dataOptions, {
              getClass: 'main',
              setClass: 'small',
              iconOld: `icf-device-mobile`,
              icon: `icf-device-desktop`
            });
            configClick(dataOptions);
          } else {
            Object.assign(dataOptions, {
              getClass: 'small',
              setClass: 'main',
              iconOld: `icf-device-desktop`,
              icon: `icf-device-mobile`
            });
            configClick(dataOptions);
          }
        break;
        case 'position':
          $('.btn-settings-top').toggleClass('btn-settings-top--left btn-settings-top--right');

          if(menu.hasClass("left")) {
            Object.assign(dataOptions, {
              getClass: 'left',
              setClass: 'right',
              iconOld: `icf-arrow-right`,
              icon: `icf-arrow-left`
            });
            configClick(dataOptions);
          } else {
            Object.assign(dataOptions, {
              getClass: 'right',
              setClass: 'left',
              iconOld: `icf-arrow-left`,
              icon: `icf-arrow-right`
            });
            configClick(dataOptions);
          }
        break;
          default:
        break;
      }

      // configClick(dataOptions);
    }

  function updateList() {
      $('.menu-list__btn-wrapper > .reload').attr('disabled', true);
      $('#menu-content-list').children('.mozaique').children().remove();

      // video = u('#html5video video');
      // videoHandler = u('#html5video .video-click-handler').on(['mouseover', 'mouseout'], playVideoHandler);

      // updateOnHover();
      setTimeout(() => {
        const clone = $('#related-videos > .mozaique').clone(true);

        for (let i = 0; i <= clone.children('.thumb-block').length; i++) {
          $('#menu-content-list > .mozaique').last().append(clone.children('.thumb-block')[i]);
          if(i === clone.children('.thumb-block').length) $('#menu-content-list > .mozaique').append(clone.children('.thumb-block')[i - 1]);
        };
      }, 500);
    };

  // Создаем кнопку

  function createBtn(type, value) {
     let title = '';
     let classList = `${value} icon-f icf`;

    // @icf-dashboard: "\e903";
    // @icf-device-desktop: "\e956";
    // @icf-device-mobile: "\e958";
    // @icf-device-tablet: "\e95a";
    // @icf-device-tv-v2: "\e9af";

     switch(type) {
       case 'hides':
         classList = `${classList}-${value === 'shows' ? 'eye-blocked' : 'eye'}`;
       break;
        case 'size':
         classList = `${classList}-device-${value === 'small' ? 'desktop' : 'mobile'}`;
       break;
        case 'position':
        default:
        classList = `${classList}-arrow-${value === 'left' ? 'right' : 'left'}`;
       break;
     }

      elGenerator('.menu-list__btn-wrapper', 'link', classList, type, title);
      $('#menu-content-list').data([type], value).addClass(value);
  }

  // Загружаем основной конфиг

  function init() {
    elGenerator('#page', 'menu');
    const videoList = $('#related-videos');
    let video;
    let videoHandler;
    const btnShow = videoList.children("a.btn-default.show-more").on('click', (event) => {
      videoList.addClass('active expanded');
    });

    async function setVideoList() {
      try {
        const clone = $('#related-videos > .mozaique').clone(true);

				for (let i = 0; i <= clone.children('.thumb-block').length; i++) {
					$('#menu-content-list > .mozaique').last().append(clone.children('.thumb-block')[i]);
					if(i === clone.children('.thumb-block').length) $('#menu-content-list > .mozaique').append(clone.children('.thumb-block')[i - 1]);
				};

        $('#related-videos > .mozaique').find(".thumb-block").addClass('thumb-block--wrapper');
        $('#menu-content-list > .mozaique').find(".thumb-block--wrapper").removeClass('thumb-block--wrapper');
      } catch(e) {
        console.log(e);
      }
    }

    function playVideoHandler(event) {
      switch(event.type) {
        case 'mouseout':
          setRewriteVideoList();
        break;
          case 'mouseover':
          default:
          setVideoList();
        break;
      }
  // Выбираем целевой элемент
  //     const target = document.getElementById('menu-content-list');

  //     // Конфигурация observer (за какими изменениями наблюдать)
  //     const config = {
  //         attributes: true,
  //         childList: true,
  //         subtree: true
  //     };

  //     // Колбэк-функция при срабатывании мутации
  //     const callback = function(mutationsList, observer) {
  //         for (let mutation of mutationsList) {
  //             if (mutation.type === 'childList') {
  //                 console.log('A child node has been added or removed.', mutation);
  //             } else if (mutation.type === 'attributes') {
  //                 console.log('The ' + mutation.attributeName + ' attribute was modified.', mutation);
  //             }
  //         }
  //     };

  //     // Создаём экземпляр наблюдателя с указанной функцией колбэка
  //     const observer = new MutationObserver(callback);

  //     // Начинаем наблюдение за настроенными изменениями целевого элемента
  //     observer.observe(target, config);

      // Позже можно остановить наблюдение
      // observer.disconnect();
	};

    // function updateOnHover() {
    //   // u('#menu-content-list').children('.thumb-block').on(['mouseover', 'mouseout'], playVideoHandler);
    //   $('#html5video').hover(
    //     function () {
    //       $(this).addClass('video__hover');
    //       // u('#html5video .video-click-handler').trigger('focus');
    //       // u('#html5video').trigger('touchstart'); // .embed-responsive-item'
    //   // u(event.target).trigger('touchstart');
    //     },
    //     function () {
    //       $(this).removeClass('video__hover');
    //       // u('#html5video .video-click-handler').trigger('blur');
    //       // u('#html5video').trigger('touchstart');
    //     }
    //   )
    // }

    function getList() {
      Object.keys(actionsDefault).forEach((action) => createBtn(action, getStoreData(action)));

			elGenerator('.menu-list__btn-wrapper', 'link', 'icon-f icf-refresh-circle reload', 'reload');
      setTimeout(() => {
        btnShow.trigger('click');
      }, 400);
      setTimeout(() => {
        setVideoList();
      }, 1200);

      $('a.menu-list__btn').on('click', greetingClick);
    };
    getList();
  };

  window.addEventListener('DOMContentLoaded', init);
})();
