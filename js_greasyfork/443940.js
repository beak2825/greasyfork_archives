// ==UserScript==
// @name        DTF-Album 2.0
// @namespace   https://github.com/TentacleTenticals
// @match       https://dtf.ru/*
// @grant       none
// @version     1.2.3
// @author      Tentacle Tenticals
// @description Заменяет стандартные альбомы на иную их версию. Работает в двух режимах - автоматическом, и ручном (по нажатию кнопки).
// @homepage https://github.com/TentacleTenticals/DTF-showAvatar
// @license MIT
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/443940/DTF-Album%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/443940/DTF-Album%2020.meta.js
// ==/UserScript==
/* jshint esversion:8 */

(function() {
  'use strict';

  {
    const log = console.log.bind(console)
    console.log = (...args) => {
      if(Array.isArray(args)){
        if(args[0]){
          if(typeof args[0] === 'string'){
            if(args[0].match(/\[ Air \] Ready.*/)){
              log('Yes!!!');
              run();
            }
          }
        }
        // if(args[0].match(/\[ Air \] Ready.*/)){
        //   log('Yes!!!');
        //   run();
        // }
      }
      log(...args)
    }
  }
  // let currentUrl = document.location.href;
  // const config = { attributes: true, childList: true, subtree: true };
  // const callback = function(mutationsList, observer) {
  //     for(const mutation of mutationsList) {
  //         if(!mutation.target.baseURI.match(currentUrl)){
  //             console.log('Url changed!', currentUrl, mutation.target.baseURI)
  //             currentUrl = mutation.target.baseURI;
  //             run();
  //         }
  //     }
  // };
  // const observer = new MutationObserver(callback);
  // observer.observe(document.body, config);

    // https://code.jquery.com/jquery-3.6.0.min.js

  let focused,
    imagePreviewer,
    button1Pressed,
    filter = /(.+)\//,
    dtfFilter = /(https:\/\/[^/]+\/[^/]+.+)\?ref.+/,
    layout = document.querySelector(`div[class='site-header-container']`),

    // Настройка поисковиков для меню поиска изображений.
      // url: - ссылка для работы поиска.
      // name: имя поиска в меню поиска изображений.
      // use: true/false (использовать/не использовать поисковик).
    searches = [
      {url:'http://saucenao.com/search.php?db=999&url=', name:'Saucenao', use:true},
      {url:'https://www.bing.com/images/search?view=detailv2&iss=sbi&FORM=SBIHMP&sbisrc=UrlPaste&q=imgurl:', name:'Bing', use:true},
      {url:'https://www.google.com/searchbyimage?site=search&image_url=', name:'Google', use:true},
      {url:'https://yandex.ru/images/search?rdrnd=296405&rpt=imageview&url=', name:'Yandex', use:true},
      {url:'http://tineye.com/search/?url=', name:'TinEye', use:true},
      {url:'http://iqdb.org/?url=', name:'IQDB', use:true}
    ],
    cfg = {// Настройка режимов работы скрипта. true/false.

      // main: - Основной режим.
      // auto:true - Автоматический режим. Скрипт находит в статье альбомы, и сам заменяет их.
      // auto:false - Ручной режим. Скрипт находит в статье альбомы, и добавляет перед ними кнопки, которые при нажатии на них заменяют альбом под ними.
      // button: true/false - Создавать-ли кнопку возвращения альбомов. Работает лишь для АВТО режима, т.к ручной и так создаёт эти кнопки.
      // howMany: число - На сколько именно изображений в альбоме реагировать. Работает для ОБОИХ режимов.
      main:{active:true, auto:false, button:true, howMany:2},

      // Совмещение ВСЕХ стандартных альбомов в статье в один Альбом 2.0.
      // active:true - Появление кнопки для совмещения альбомов.
      // active:false - Кнока не появится, совмещения не произойдёт.
      // Если в ОСНОВНОМ режиме (main) выбран автоматический режим, то кнопка совмещения альбомов НЕ появится.
      // howMany: - На сколько альбомов реагировать для создания кнопки. ДЕФОЛТ: '2'.
      merge:{active:true, howMany:2},

      // Сбор компиляции (набора изображений ВНЕ стандартных альбомов) в один Альбом 2.0.
      // active:true - Появление кнопки для сборка компиляции в альбом.
      // active:false - Кнока не появится, сборки не произойдёт.
      // howMany: - На сколько изображений в подборке реагировать для создания кнопки. ДЕФОЛТ: '2'.
      compilation:{active:true, howMany:2},

      zoom:{
          // Режим работы зума. true/false (выкл/выкл).
          // При зуме, скроллбар старается держаться близ курсора мыши. ДЕФОЛТ: false.
          smartZoom: false,
          // Сила зума. Лучше ставить 0.10/0.15/0.20/0.25/и т.д.
          zoomPower: 0.25
      },
      scroll:{
          // Сила скролла (при скролле клавишами клавиатуры).
          scrollPower: 100
      },

      browser:{
          // ВАЖНАЯ НАСТРОЙКА! true/false. Если включено (true), то скрипт будет считать что используется Firefox браузер, и любые ему подобные на том же движке.
          isFirefox: false
      },

      buttons:{
          main:{
              // Кнопка активации РЕЖИМА ЗУМА при предпросмотре изображения. Зум работает лишь с одновременным скроллом колёсиком мыши на изображении.
              // Используйте кноки Control/Alt/Shift и т.п. Клавиши букв, цифр и символов лучше не использовать.
              button1: /Control/
          },
          zoom:{
              // Зум в РЕЖИМЕ ПРОСМОТРА клавишами клавиатуры.
              in: /KeyE|NumpadAdd/,
              out: /KeyQ|NumpadSubtract/
          },
          scroll:{
              // Скролл клавишами клавиатуры.
              left: /KeyA|Numpad4/,
              right: /KeyD|Numpad6/,
              top: /KeyW|Numpad8/,
              bottom: /KeyS|Numpad2/
          },
          navigation:{
              // Кнопки навигации между выбранными изображениями (в РЕЖИМЕ ПРОСМОТРА). ДЕФОЛТ: ArrowLeft/ArrowRight.
              previous: /ArrowLeft/,
              next: /ArrowRight|Space/,
              // Кнопка для закрытия РЕЖИМА ПРОСМОТРА. Дефолт: Escape.
              esc: /Escape/
          }
      },
    },

    // Настройки текста кнопок.
    buttonsText = {
      copyLink: '🔗', // Текст кнопки копирования ссылки на изображение в буфер обмена. ДЕФОЛТ: '🔗'. 📋
      saveImage: '💾', // Текст кнопки сохранения (скачивания) изображения. ДЕФОЛТ: '💾'. 📥 💽 💿 📀
      searchImage: 's🔎', // Текст кнопки открытия меню поиска по изображениям. ДЕФОЛТ: 's🔎'. 🔬 📡 🗺️ ℹ️ 🖼️ 🔍
      turnOffZoom: '-🔍', // Текст кнопки отключения РЕЖИМА ЗУМА (возврата в СТАНДАРТНЫЙ РЕЖИМ) предпросмотра. ДЕФОЛТ: '-🔍'.
      previous: '🔙', // Текст кнопки перехода на предыдущий итем. ДЕФОЛТ: '🔙'. ⬅️
      next: '🔜', // Текст кнопки перехода на следующий итем. ДЕФОЛТ: '🔜'. ➡️
      close: '✖️', // Текст кнопки закрытия предпросмотра итема. ДЕФОЛТ: '✖️'. 🚪 ❌ ❎

      // Текст кнопки замены стандартного DTF альбома на DTF-Альбом 2.0. ДЕФОЛТ: `Заменить альбом на 'Альбом 2.0'` / `Вернуть стандартный альбом`.
      createAlbum:{
        default:`Заменить альбом на 'Альбом 2.0'`,
        pressed:`Вернуть стандартный альбом`
      },
      // Текст кнопки замены всех альбомов на один Альбом 2.0.
      createAlbumMerge:{
        default:`Заменить все альбомы на один 'Альбом 2.0'`,
        pressed:`Вернуть стандартные альбомы`
      },
      // Текст кнопки замены подборки на Альбом 2.0. ДЕФОЛТ: `Заменить подборку на 'Альбом 2.0'` / `Вернуть подобрку`.
      createAlbumCompilation:{
        default:`Заменить подборку на 'Альбом 2.0'`,
        pressed:`Вернуть подборку`
      },
    },

    imagePreviewerElements = {
      // Текст-описание изображений в альбоме. ДЕФОЛТ: '🖼️: ' (🖼️: "значение" / "значение").
      images:{
        text: '🖼️: ',
        spacer: ' / '
      },
      // Информация о текущем изображении.
      info:{
        text: '',
        spacer: ' x ',
        px: ' px'
      },
      zoomLevel: {text:'Ур.зума: ', x:'x'}, // Текст-описание зума. ДЕФОЛТ: 'Ур.зума: '. (Ур.зума: 'значение').
      linksList: '🔗', // Текст-Title списка ссылок на изображение. ДЕФОЛТ: '🔗'.
      title: '📝: ', // Текст-Title описания изображения. ДЕФОЛТ: '📝: '. 📓 📝 📛
    },

    alertTextUrlCopied = '📋 Ссылка скопирована в буфер обмена', // Текст оповещения при копировании ссылки на изображение в буфер обмена. ДЕФОЛТ: 'Ссылка скопирована в буфер обмена'.

    mainCSS = {
      albums:{
        overscroll: 'auto', // ВАЖНЫЙ ПАРАМЕТР! Определяет что делать, если Вы пролистали весь альбом, т.е скролл альбома дальше не пойдёт.
        info:{
          hover:{
            // ВАЖНЫЙ ПАРАМЕТР! Определяет, скрывать, или нет Album Info (плашку в левом верхнем углу с кол-вом изображений в альбоме) при наведении на содержимое альбома.
            // ДЕФОЛТ: '0'. 'unset' для отключения.
            opacity: '0'
          }
        }
      },
      // contain (скролл при наведении на альбом, идёт лишь внутри альбома).
      // auto (скролл при наведении на альбом, идёт внутри альбома, пока он не закончится, и далее идёт по самой странице).
      // ДЕФОЛТ: 'auto'.
      alert:{
        size:{
          width: 'unset',
          height: 'unset'
        },
        background: 'rgba(159, 219, 159, 0.8)',
        color: 'black',
        fontSize: '12px',
        fontWeight: '500',
        lineHeight: '12px',
        border: 'unset',
        borderRadius: '3px',
        padding: '3px',
        zIndex: '1000'
      }
    },

    // Настройки вида итемов в альбоме.
    albumItemsCSS = {
      itemsInColumn: '4', // Сколько итемов должно быть в строке. Выбирайте 1-4 если не собираетесь менять размер итемов, иначе появится горизонтальный скролл. ДЕФОЛТ: 3.
      size:{ // Размер итема. В идеале, должен быть квадрат. ДЕФОЛТ: 169px x 169px
        width: '169px',
        height: '169px'
      },
      rowsTemplate: '169px', // Высота строки итемов. В идеале, должна совпадать с высотой итема (размером).
      // Т.е, итем 169px x 169px имеет rowsTemplate 169px.
      gap: '9px', // Отступ между итемами. ДЕФОЛТ: 9px
      padding: '4px 0px 4px 0px', // Отступ между альбомом и "сеткой итемов" (изображений) внутри него.
      borderRadius: '3px', // Округление углов итема. ДЕФОЛТ: 3px
      background: 'rgb(0, 0, 0)', // Фон итема. Нужно, когда изображение идёт не во весь размер итема, или не имеет фона. Дефолт: rgb(0,0,0)
      boxShadow: '0px 0px 2px 1px rgba(46, 207, 229, 0.20), 0px 0px 2px 1px rgb(0, 0, 0)', // Тень итема. ДЕФОЛТ: '0px 0px 2px 1px rgb(46 207 229 / 20%), 0px 0px 2px 1px rgb(0 0 0)'
      hover:{// Вид при наведении на элемент.
        boxShadow: '0px 0px 2px 1px rgba(46, 207, 229, 0.20), 0px 0px 2px 1px rgb(0, 0, 0)', // Ховер итема. Тут две тени по-дефолту.
        cursor: 'pointer', // Вид курсора при наведении на итем. ДЕФОЛТ: pointer.
        filter: 'drop-shadow(0px 0px 1px black)',
        zIndex: 'unset' // ВАЖНЫЙ ПАРАМЕТР! Определяет, что делать с Album Info (плашкой в левом верхнем углу альбома с кол-вом изображений);
        // При '1', наведение на "итем" альбома скрывает позади Album Info.
        // ДЕФОЛТ: '1'. 'unset' для отключения.
      },
      image:{// Изображение в итеме.
        size:{ // Размер изображения. Лучше, если максимальный размер изображения будет больше, чем размер самого итема, чтобы не было вертикальных чёрных полосок.
          // Эксперементируйте с размером, чтобы получить наилучший для Вас результат.
          maxWidth: '300px',
          maxHeight: '300px'
        },
        margin: '-25px 0px 0px 0px' // Из-за кнопок в итеме, нужна небольшая правка для возвращения изображения назад на место.
        // Дефолт: -25px 0px 0px 0px ( -25px это высота кнопки (22px) + небольшой отступ (5px)).
        // При изменении высоты кнопок итема (buttonCopyLink (кнопка копирования ссылки на изображение в буфер обмена) и т.п), его отступов, размера шрифта и т.п, всегда меняйте этот margin.
      },
      buttonContainer:{// Контейнер с кнопками итемов.
        size:{// Размер контейнера. Важен, т.к. наведение на него показывает кнопки итемов.
          // При изменении высоты кнопок, нужно менять и размер контейнера.
          width: '100%',
          height: '22px'
        },
        // Кнопки итемов.
        buttonCopyLink:{// Кнопка копирования ссылки на изображение в буфер обмена.
          size:{// Минимальный размер кнопки. ДЕФОЛТ: 20px
            minHeight: '20px',
            maxHeight: '22px'
          },
          background: 'rgb(0, 0, 0)', // Фон кнопки.
          color: 'white', // Цвет текста кнопки.
          border: 'unset', // Бордер кнопки.
          boxShadow: '0px 1px 0px 1px rgb(86, 136, 163)',
          borderRadius: '0px 0px 3px 0px', // Закругление углов кнопки.
          float: 'left', // "Плавание" кнопки. ДЕФОЛТ: 'left' (налево). Параметры: left/right.
          fontSize: '14px', // Размер шрифта.
          lineHeight: '14px', // Высота строки. В идеале, размер шрифта и высота строки должны совпадать.
          margin: '0px 5px 0px 1px', // Внешний отступ кнопки справа. ДЕФОЛТ: '0px 3px 0px 0px'. Т.е, 'Вниз Направо Вверх Налево'.
          padding: '3px', // Внутренний отступ кнопки.
          hover:{// Вид при наведении на кнопку.
            background: 'rgb(75, 75, 75)',
            color: 'rgb(212, 255, 251)'
          }
        },
        buttonImgDownload:{// Кнопка скачивания (сохранения) изображения.
          size:{// Минимальный размер кнопки. ДЕФОЛТ: 20px
            minHeight: '20px',
            maxHeight: '22px'
          },
          background: 'rgb(0, 0, 0)',
          color: 'white',
          border: 'unset', // Бордер кнопки.
          boxShadow: '0px 1px 0px 1px rgb(86, 136, 163)',
          borderRadius: '0px 0px 3px 3px',
          float: 'left',
          fontSize: '14px',
          lineHeight: '14px',
          margin: '0px 5px 0px 1px',
          padding: '3px',
          hover:{// Вид при наведении на кнопку.
            background: 'rgb(75, 75, 75)',
            color: 'rgb(212, 255, 251)'
          }
        },
        buttonSearch:{// Кнопка открытия меню поиска изображения. Список поисков настраивается выше в коде.
          size:{// Минимальный размер кнопки. ДЕФОЛТ: 20px
            minHeight: '20px',
            maxHeight: '22px'
          },
          background: 'rgb(0, 0, 0)',
          color: 'white',
          border: 'unset', // Бордер кнопки.
          boxShadow: '0px 1px 0px 1px rgb(86, 136, 163)',
          borderRadius: '0px 0px 3px 3px',
          float: 'left',
          fontSize: '14px',
          lineHeight: '14px',
          margin: '0px 5px 0px 1px',
          padding: '3px',
          hover:{// Вид при наведении на кнопку.
            background: 'rgb(75, 75, 75)',
            color: 'rgb(212, 255, 251)'
          }
        },
        buttonTurnOffZoom:{// Кнопка отключения РЕЖИМА ЗУМА (возврата к СТАНДАРТНОМУ РЕЖИМУ).
          size:{// Минимальный размер кнопки. ДЕФОЛТ: 20px
            minHeight: '20px',
            maxHeight: '22px'
          },
          background: 'rgb(0, 0, 0)',
          color: 'white',
          border: 'unset', // Бордер кнопки.
          boxShadow: '0px 1px 0px 1px rgb(86, 136, 163)',
          borderRadius: '0px 0px 3px 3px',
          float: 'left',
          fontSize: '14px',
          lineHeight: '14px',
          margin: '0px 5px 0px 1px',
          padding: '3px',
          hover:{// Вид при наведении на кнопку.
            background: 'rgb(75, 75, 75)',
            color: 'rgb(212, 255, 251)'
          }
        },
      },
      buttonContainerZoomed:{
        widthMinusSize: '20px' // Срезает длину контейнера с кнопками итема в РЕЖИМЕ ЗУМА для того, чтобы она не заходила за вертикальный скроллбар. ДЕФОЛТ: '20px'.
      },
      searchMenu:{// Меню поиска изображений, появляющееся при нажатии кнопки поиска изображений.
        size:{// Минимальный размер меню. ДЕФОЛТ: 100px
          minWidth: '100px',
          minHeight: '100px'
        },
        background: 'rgb(45, 5, 66)',
        itemsInColumn: '1', // Сколько поисковиков показывать в одной строке. Дефолт: 1
        gap: '4px', // Отступ между поисковиками.
        padding: '10px',
        border: 'unset',
        borderRadius: '3px',
        items:{// Настройка вида кнопок-поисковиков.
          background: 'white',
          color: 'black',
          borderRadius: '3px',
          padding: '3px 10px 3px 10px',
          fontSize: '12px',
          lineHeight: '12px',
          hover:{// Вид при наведении на кнопку-поисковик.
            background: 'rgb(213, 213, 239)'
          }
        }
      }
    },

    // Настройки альбома.
    albumCSS = {
      size:{// Размер альбома.
        maxWidth: 'unset', // Длина
        maxHeight: '400px' // Ширина
      },
      padding: '3px 0px 3px 0px',
      margin: '27px 0px 20px 0px',
      boxShadow: '0px 0px 1px black',
      info:{// Сколько изображений в альбоме.
        fontSize: '25px',
        lineHeight: '25px',
        padding: '3px',
        margin: '-5px 0px 0px 0px',
        borderRadius: '0px 0px 15px 0px',
        background: 'rgb(0, 0, 0)',
        color: 'rgb(255, 255, 255)',
        boxShadow: '0px 0px 3px rgb(219, 60, 169), 0px 0px 3px 0px rgb(0, 0, 0)'
      },
      list:{// Скроллбар итемов в альбоме.
        scrollbar:{
          sc:{// Сам скроллбар
            size:{
              width: '8px',
              height: '8px',
              firefoxWidth: 'thin' // FIREFOX Толщина скроллбара. ДЕФОЛТ: 'thin'.
            },
            background: 'rgb(235, 235, 235)',
            firefoxColor: 'rgba(11, 20, 200, 0.6) rgb(205, 205, 235)' // FIREFOX Thumb/scrollbar цвета. ДЕФОЛТ: 'rgba(11, 20, 200, 0.6) rgb(235, 235, 235)'.
          },
          track:{// Трэк, т.е. то, по чему ездит тумб.
            background: 'rgb(205, 205, 235)',
            borderRadius: '10px',
            margin: '3px'
          },
          trackPiece:{// Часть трэка, которая не перекрывается тумб.
            background: 'unset',
            border: '3px solid rgba(155, 105, 105, 0)',
            borderRadius: '10px',
            size:{
            width: '1px',
            height: '1px'
            }
          },
          thumb:{// Тумб, т.е. то, благодаря чему осуществляется навигация по скроллбару, т.е его подвижная часть.
            background: 'rgba(11, 20, 200, 0.6)',
            border: '1px solid rgba(10, 20, 200, 0.40)',
            borderRadius: '18px',
            hover: {// Вид при наведении на тумб.
              background: 'rgba(11, 40, 220, 0.6)'
            }
          },
          corner:{// Угол скроллбара, где встречаются горизонтальный и вертикальный скроллбары.
            background: 'rgb(205, 205, 235)'
          }
        }
      },
      preview:{// Предпросмотр изображения (ОБЫЧНЫЙ РЕЖИМ. При нажатии на итем).
        position:{// Позиция превью.
          top: '20px',
          left: '17%'
        },
        size:{// Размер превью.
          width: '840px', // Длина
          height: '840px' // Ширина
        },
        background: 'rgba(0, 0, 0, 0.5)',
        boxShadow: '0px 1px 5px black', // Тень превью.
        imageCount:{// Текущий номер изображения / количество изображений в альбоме.
          size:{
            width: 'max-content'
          },
          position:{
            top: '5px',
            left: '5px'
          },
          background: 'black',
          color: 'white',
          fontSize: '13px',
          fontWeight: '500',
          lineHeight: '13px',
          border: '2px solid rgb(64, 63, 63)',
          borderRadius: '6px',
          padding: '3px 3px 3px 3px',
          margin: '0px 0px 0px 0px'
        },
        imageInfo:{// Информация о текущем изображении.
          size:{
            width: 'max-content'
          },
          position:{
            top: '30px',
            left: '5px'
          },
          background: 'black',
          color: 'white',
          fontSize: '13px',
          fontWeight: '500',
          lineHeight: '13px',
          border: '2px solid rgb(64, 63, 63)',
          borderRadius: '6px',
          padding: '3px 3px 3px 3px',
          margin: '0px 0px 0px 0px'
        },
        imageZoomLevel:{// Информация о уровне зума текущего изображения.
          size:{
            width: 'max-content'
          },
          position:{
            top: '55px',
            left: '5px'
          },
          background: 'black',
          color: 'white',
          fontSize: '13px',
          fontWeight: '500',
          lineHeight: '13px',
          border: '2px solid rgb(64, 63, 63)',
          borderRadius: '6px',
          padding: '3px 3px 3px 3px',
          margin: '0px 0px 0px 0px'
        },
        imageTitle:{// Title изображения
          size:{
            width: 'max-content',
            maxWidth: '200px',
            maxHeight: '247px'
          },
          position:{
            top: '80px',
            left: '5px'
          },
          background: 'black',
          color: 'white',
          fontSize: '13px',
          fontWeight: '500',
          lineHeight: '13px',
          border: '2px solid rgb(64, 63, 63)',
          borderRadius: '6px',
          padding: '3px 3px 3px 3px',
          margin: '0px 0px 0px 0px'
        },
        imageLinksField:{// Ссылки изображения (у подборок)
          size:{
            width: 'unset',
            height: 'unset'
          },
          position:{
            top: '87.6%',
            left: '5px'
          },
          background: 'black',
          color: 'white',
          fontSize: '13px',
          fontWeight: '500',
          lineHeight: '13px',
          border: '2px solid rgb(64, 63, 63)',
          borderRadius: '6px',
          padding: '3px 3px 3px 3px',
          margin: '0px 0px 0px 0px',

          title:{// Title
            size:{
              width: '100%',
              maxHeight: '20px'
            },
            position:{
              top: '-2px',
              left: '0px'
            },
            background: 'black',
            color: 'white',
            fontSize: '13px',
            fontWeight: '500',
            lineHeight: '13px',
            border: '1px solid rgb(64, 63, 63)',
            borderRadius: '0px',
            padding: '3px 3px 3px 3px',
            margin: '0px 0px 3px 0px',
          },

          list:{
            size:{
              width: '197px',
              height: '65px'
            },
            position:{
              top: 'unset',
              left: 'unset'
            },
            background: 'black',
            color: 'white',
            fontSize: '13px',
            fontWeight: '500',
            lineHeight: '13px',
            border: 'unset',
            borderRadius: 'unset',
            padding: '3px 3px 3px 3px',
            margin: '0px 0px 0px 0px',

            items:{
              color: 'white',
              fontSize: '13px',
              fontWeight: '500',
              lineHeight: '13px',
              border: 'unset',
              margin: '0px 0px 0px 3px',
              hover:{
                color: 'red',
                cursor: 'pointer'
              }
            }
          }
        },
        navigationButtons:{// Кнопки навигации в предпросмотре изображений (когда выбран итем в альбоме).
          previous:{// Кнопка "Назад"
            size:{
              width: '50px',
              height: '200px'
            },
            borderRadius: '100% 0px 0px 100%',
            position:{
              top: 'calc(50% - 200px / 2)',
              left: 'calc(100% - 17% - 840px - 50px - 5px)'
            },
            background: 'rgba(255, 255, 255, 0.4)',
            color: 'rgba(60, 60, 60, 0.6)',
            fontSize: '25px',
            border: '1px solid black',
            zIndex: '2',
            hover:{
              background: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer'
            }
          },
          next:{// Кнопка "Вперёд"
            size:{
              width: '50px',
              height: '200px'
            },
            borderRadius: '0px 100% 100% 0px',
            position:{
              top: 'calc(50% - 200px / 2)',
              right: 'calc(100% - 17% - 840px - 50px - 2px)'
            },
            background: 'rgba(255, 255, 255, 0.4)',
            color: 'rgba(60, 60, 60, 0.6)',
            fontSize: '25px',
            border: '1px solid black',
            zIndex: '2',
             hover:{
              background: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer'
            }
          },
          close:{// Кнопка "ЗАкрыть".
            size:{
              width: '50px',
              height: '50px'
            },
            borderRadius: '50%',
            position:{
              top: '20px',
              right: 'calc(100% - 17% - 840px - 50px - 15px)'
            },
            background: 'rgba(225, 22, 22, 0.4)',
            color: 'black',
            fontSize: '25px',
            lineHeight: '25px',
            border: '1px solid black',
            zIndex: '2',
            hover:{
              background: 'rgba(225, 22, 22, 0.50)',
              cursor: 'pointer'
            }
          }
        },
        scrollbar:{// Скроллбар предпросмотра изображений (когда итем выбран и включён РЕЖИМ ЗУМА).
          sc:{// Сам скроллбар
            size:{
              width: '8px',
              height: '8px',
              firefoxWidth: 'thin' // FIREFOX Толщина скроллбара. ДЕФОЛТ: 'thin'.
            },
            background: 'rgb(235, 235, 235)',
            firefoxColor: 'rgba(11, 20, 200, 0.6) rgb(205, 205, 235)' // FIREFOX Thumb/scrollbar цвета. ДЕФОЛТ: 'rgba(11, 20, 200, 0.6) rgb(235, 235, 235)'.
          },
          track:{// Трэк, т.е. то, по чему ездит тумб.
            background: 'rgb(205, 205, 235)',
            borderRadius: '10px',
            margin: '3px'
          },
          trackPiece:{// Часть трэка, которая не перекрывается тумб.
            background: 'unset',
            border: '3px solid rgba(155, 105, 105, 0)',
            borderRadius: '10px',
            size:{
            width: '1px',
            height: '1px'
            }
          },
          thumb:{// Тумб, т.е. то, благодаря чему осуществляется навигация по скроллбару, т.е его подвижная часть.
            background: 'rgba(11, 20, 200, 0.6)',
            border: '1px solid rgba(10, 20, 200, 0.40)',
            borderRadius: '18px',
            hover: {// Вид при наведении на тумб.
              background: 'rgba(11, 40, 220, 0.6)'
            }
          },
          corner:{// Угол скроллбара, где встречаются горизонтальный и вертикальный скроллбары.
            background: 'rgb(205, 205, 235)'
          }
        }
      },
      previewZoomed:{// Предпросмотр изображений при зуме. (РЕЖИМ ЗУМА. При включении зума на выбранном итеме).
        // КРАЙНЕ НЕОБХОДИМО, чтобы размер и положение предпросмотра при зуме, совпадали с размером и положением ОБЫЧНОГО РЕЖИМА предпросмотра.
        position:{// Позиция предпросмотра изображений.
          top: '20px',
          left: '17%'
        },
        size:{// Размер предпросмотра изображений.
          width: '840px',
          height: '840px'
        },
        background: 'rgb(0, 0, 0)',
        boxShadow: '0px 1px 5px black'
      },
      albumCreatingBtn:{
        size:{
          maxHeight: '20px'
        },
        background: 'black',
        color: 'white',
        fontSize: '13px',
        lineHeight: '13px',
        padding: '3px',
        border: '1px solid rgb(157, 154, 154)',
        borderRadius: '3px',
        top: '22px',
        margin: '0px 5px 0px 0px',
        hover:{
          background: 'rgb(72, 72, 72)',
          cursor: 'pointer'
        }
      },
      albumCreatingMergeBtn:{
        size:{
          maxHeight: '20px'
        },
        background: 'black',
        color: 'white',
        fontSize: '13px',
        lineHeight: '13px',
        padding: '3px',
        border: '1px solid rgb(157, 154, 154)',
        borderRadius: '3px',
        top: '22px',
        margin: '0px 5px 10px 0px',
        hover:{
          background: 'rgb(72, 72, 72)',
          cursor: 'pointer'
        }
      },
      compilationToAlbumBtn:{
        size:{
          maxHeight: '20px'
        },
        background: 'black',
        color: 'white',
        fontSize: '13px',
        lineHeight: '13px',
        padding: '3px',
        border: '1px solid rgb(157, 154, 154)',
        borderRadius: '3px',
        top: '22px',
        margin: '0px 5px 10px 0px',
        hover:{
          background: 'rgb(72, 72, 72)',
          cursor: 'pointer'
        }
      }
    };

function checkLinks(t, tar){
  if(t){
    tar.textContent = '';
    for(let i = 0, arr = t.split(' ').filter(a => a); i < arr.length; i++){
      new ImgLinksItem ({
        name: arr[i].replace(/(http|https):\/\/([^/]+).*/, '$2'),
        href: arr[i],
        target: tar
      })
    }
  }
}
class Alert{
  constructor({text, target, top, left, timer}){
    this.alert=document.createElement('div');
    this.alert.className='dtf-album-alert';
    this.alert.textContent=text;
    this.alert.style.top=top;
    this.alert.style.left=left;
    setTimeout(() => {
        try {
          this.alert.remove();
        }
        catch (err) {
          console.log(err);
        }
    }, timer);

    target.appendChild(this.alert);
    return this.alert;
  }
}
class ButtonCreateAlbum{
  constructor({target, where}){
    this.a=document.createElement('button');
    this.a.className='dtf-album-button-create';
    if(where.style.display){
        if(where.style.display === 'none'){
          this.a.textContent=buttonsText.createAlbum.pressed;
        }else
        if(!where.style.display === 'none'){
          this.a.textContent=buttonsText.createAlbum.default;
        }
    }else
    if(!where.style.display){
      this.a.textContent=buttonsText.createAlbum.default;
    }
    // this.a.textContent=buttonsText.createAlbum.default
    this.a.onclick = function(e){
        if(e.target.nextElementSibling.classList.value.match(/figure-gallery/)){
            if(!e.target.nextElementSibling.style.display){
                if(e.target.nextElementSibling.querySelector(`.content.content--full figure[class='figure-gallery'] textarea[name='gallery-data-holder']`)){
                    console.log('Album is founded');
                    let album = new Album({
                      where: e.target.nextElementSibling.nextElementSibling,
                      target: e.target.nextElementSibling
                    });
                    let artsN = 0;

                    for(let i = 0, arr = JSON.parse(e.target.nextElementSibling.querySelector(`textarea[name='gallery-data-holder']`).textContent.trim()); i < arr.length; i++){
                        if(arr[i].image.type === 'image'){
                            new AlbumItem({
                                imgUrl: `https://leonardo.osnova.io/${arr[i].image.data.uuid}`,
                                imgSize: arr[i].image.size,
                                imgTitle: `${arr[i].title}`,
                                target: album.list
                            })
                          artsN++;
                        }
                      if(i+1 === arr.length){
                          album.info.textContent = artsN;
                      }
                   }

               }
              e.target.nextElementSibling.style.display = 'none';
              e.target.textContent = buttonsText.createAlbum.pressed
            }else
            if(e.target.nextElementSibling.style.display === 'none'){
                e.target.nextElementSibling.style.display = '';
              e.target.textContent = buttonsText.createAlbum.default
                if(e.target.nextElementSibling.nextElementSibling.classList.value.match(/dtf-album$/)){
                    e.target.nextElementSibling.nextElementSibling.remove();
                }
            }
        }
    }
    // target.parentNode.parentNode.parentNode.parentNode.insertBefore(this.a, target.parentNode.parentNode.parentNode);
    target.parentNode.insertBefore(this.a, where);

    return this.a;
  }
}
class ButtonContainer{
  constructor({target}){
  this.container=document.createElement('div');
  this.container.className='dtf-album-buttonContainer';

  target.children[0].parentNode.insertBefore(this.container, target.children[0]);
  return this.container;
  }
}
class CreateAlbumButtonMerged{
  constructor({target}){
    this.a=document.createElement('button');
    this.a.className='dtf-album-button-create-merge';
    this.a.textContent=buttonsText.createAlbumMerge.default;
    this.a.onclick = function(e){
      if(!document.querySelector(`div[class='dtf-album-merged']`)){
          if(document.querySelector(`.content.content--full figure[class='figure-gallery'] textarea[name='gallery-data-holder']`)){
            console.log('Yes, founded');
              let album = new AlbumMerged({
                  where: e.target.parentNode.nextElementSibling.nextElementSibling,
                  target: e.target.parentNode.nextElementSibling
              });
              let artsN = 0;
              for(let a = 0, albums = document.querySelectorAll(`.content.content--full figure[class='figure-gallery'] textarea[name='gallery-data-holder']`); a < albums.length; a++){
                  for(let i = 0, albumItems = JSON.parse(albums[a].textContent.trim()); i < albumItems.length; i++){
                      if(albumItems[i].image.type === 'image'){
                          new AlbumItem({
                              imgUrl: `https://leonardo.osnova.io/${albumItems[i].image.data.uuid}`,
                              imgSize: albumItems[i].image.size,
                              imgTitle: `${albumItems[i].title}`,
                              target: album.list
                          })
                          artsN++;
                      }
                      if(i+1 === albumItems.length){
                          album.info.textContent = artsN;
                          if(!albums[a].parentNode.parentNode.parentNode.style.display){
                              albums[a].parentNode.parentNode.parentNode.style.display = 'none';
                          }else
                          if(!albums[a].parentNode.parentNode.parentNode.style.display === 'none'){
                              albums[a].parentNode.parentNode.parentNode.style.display = 'none';
                          }
                          if(albums[a].parentNode.parentNode.parentNode.previousElementSibling){
                              if(albums[a].parentNode.parentNode.parentNode.previousElementSibling.classList){
                                  if(albums[a].parentNode.parentNode.parentNode.previousElementSibling.classList.value.match(/dtf-album-button-create/)){
                                      if(!albums[a].parentNode.parentNode.parentNode.previousElementSibling.style.display){
                                          albums[a].parentNode.parentNode.parentNode.previousElementSibling.style.display = 'none';
                                      }else
                                      if(!albums[a].parentNode.parentNode.parentNode.previousElementSibling.style.display === 'none'){
                                          albums[a].parentNode.parentNode.parentNode.previousElementSibling.style.display = 'none';
                                      }
                                  }
                              }
                          }
                      }
                  }
              }
            e.target.textContent=buttonsText.createAlbumMerge.pressed;
          }
      }else
      if(document.querySelector(`div[class='dtf-album-merged']`)){
          for(let r = 0, returnAlbums = document.querySelectorAll(`.content.content--full figure[class='figure-gallery']`); r < returnAlbums.length; r++){
              if(returnAlbums[r].style.display === 'none'){
                  returnAlbums[r].style.display = '';
              }
          }
          if(cfg.main.active && !cfg.main.auto || cfg.main.active && cfg.main.auto && cfg.main.buttons){
            console.log('I see you');
              for(let r = 0, returnAlbumButtons = document.querySelectorAll(`button[class='dtf-album-button-create']`); r < returnAlbumButtons.length; r++){
                  if(returnAlbumButtons[r].style.display === 'none'){
                      returnAlbumButtons[r].style.display = '';
                  }
              }
          }
          e.target.textContent=buttonsText.createAlbumMerge.default;
          document.querySelector(`div[class='dtf-album-merged']`).remove();
      }
    }
    target.appendChild(this.a);
    //target.children[0].parentNode.insertBefore(this.a, target.children[0]);
    return this.a;
  }
}
class CreateAlbumButtonCompilation{
  constructor({target}){
    this.a=document.createElement('button');
    this.a.className='dtf-album-button-create-compilation';
    this.a.textContent=buttonsText.createAlbumCompilation.default;
    this.a.onclick = function(e){
        console.log('Compilation is founded');
        function getLinks(t){
          if(!t.nextElementSibling) return;
          if(t.nextElementSibling.querySelector(`div[class='l-island-a'] a`)){
              let linksArr = [];
              for(let l = 0, links = t.nextElementSibling.querySelectorAll(`div[class='l-island-a'] a`); l < links.length; l++){
                linksArr.push(links[l].href.replace(dtfFilter, '$1'));
              }
              if(!t.nextElementSibling.querySelector(`div[class='l-island-a'] a`).parentNode.style.display){
                  t.nextElementSibling.querySelector(`div[class='l-island-a'] a`).parentNode.style.display = 'none';
              }
              return `${linksArr.join(' ')}`;
            }
        }
        if(!document.querySelector(`div[class='dtf-album-compilation']`)){
            let album = new AlbumCompilation({
                where: e.target.parentNode.nextElementSibling.nextElementSibling,
                target: e.target.parentNode.nextElementSibling
            });
            for(let i = 0, images = document.querySelectorAll(`.content.content--full figure[class='figure-image'] .andropov_image`); i < images.length; i++){
                console.log(images.length);
                let el = images[i].parentNode.parentNode.parentNode;
                if(!el.style.display){
                    el.style.display = 'none';
                }
                new AlbumItem({
                    imgUrl: images[i].getAttribute('data-image-src').replace(filter, '$1'),
                    imgLinks: getLinks(el),
                    // title: getTitle(el),
                    target: album.list
                })
                if(i+1 === images.length){
                    album.info.textContent = images.length;
                    e.target.textContent = buttonsText.createAlbumCompilation.pressed;
                }
            }
            // target.children[0].parentNode.insertBefore(this.a, target.children[0]);
        }else
        if(document.querySelector(`div[class='dtf-album-compilation']`)){
          console.log('Album compilation 2.0 detected!');
            for(let i = 0, images = document.querySelectorAll(`.content.content--full figure[class='figure-image'] img`); i < images.length; i++){
                let el = images[i].parentNode.parentNode.parentNode.parentNode.parentNode;
                if(el.style.display === 'none'){
                    el.style.display = '';
                }
            }
            document.querySelector(`div[class='dtf-album-compilation']`).remove();
            e.target.textContent = buttonsText.createAlbumCompilation.default;
        }
    }
    target.appendChild(this.a);
    //target.children[0].parentNode.insertBefore(this.a, target.children[0]);
    return this.a;
  }
}
class Album{
    constructor({where, target}){
        this.album=document.createElement('div');
        this.album.className='dtf-album';
        target.parentNode.insertBefore(this.album, where);

        this.albumInfo=document.createElement('div');
        this.albumInfo.className='album-info';
        this.textContent = '';
        this.album.appendChild(this.albumInfo);

        this.itemsList=document.createElement('div');
        this.itemsList.className='album-items-list';
        this.album.appendChild(this.itemsList);

        return {info:this.albumInfo, list:this.itemsList};
    }
}
class AlbumCompilation{
    constructor({where, target}){
        this.album=document.createElement('div');
        this.album.className='dtf-album-compilation';
        target.parentNode.insertBefore(this.album, where);

        this.albumInfo=document.createElement('div');
        this.albumInfo.className='album-info';
        this.textContent = '';
        this.album.appendChild(this.albumInfo);

        this.itemsList=document.createElement('div');
        this.itemsList.className='album-items-list';
        this.album.appendChild(this.itemsList);

        return {info:this.albumInfo, list:this.itemsList};
    }
}
class AlbumMerged{
    constructor({where, target}){
        this.album=document.createElement('div');
        this.album.className='dtf-album-merged';
        target.parentNode.insertBefore(this.album, where);

        this.albumInfo=document.createElement('div');
        this.albumInfo.className='album-info';
        this.textContent = '';
        this.album.appendChild(this.albumInfo);

        this.itemsList=document.createElement('div');
        this.itemsList.className='album-items-list';
        this.album.appendChild(this.itemsList);

        return {info:this.albumInfo, list:this.itemsList};
    }
}
class SearchMenu{
    constructor({btn, link, target}){
        this.menu=document.createElement('div');
        this.menu.className='srcSearch';
        this.menu.style.top=`${btn.getBoundingClientRect().top + 10}px`;
        this.menu.style.left=`${btn.getBoundingClientRect().left + 10}px`;
        this.menu.setAttribute('tabindex', '-1');
        this.menu.onblur = function(e){
            setTimeout(() => {
                e.target.remove();
            }, 1000)
        }
        target.appendChild(this.menu);

        for(let i = 0; i < searches.length; i++){
                if(searches[i].use){
                  new SearchMenuItem({
                    name: searches[i].name,
                    searchUrl: searches[i].url,
                    targetUrl: link,
                    elem: this.menu
                  });
                }
            }

        return this.menu;
    }
}
class SearchMenuItem{
    constructor({name, searchUrl, targetUrl, elem}) {
      this.e=document.createElement('a');
      this.e.className=`searchmenuItem`;
      this.e.textContent=name;
      this.e.href=`${searchUrl}${targetUrl}`;
      this.e.target='_blank';
      this.e.onclick = function(s){
        s.preventDefault();
        s.stopImmediatePropagation();
        window.open(s.target.href, '_blank');
      }
      elem.appendChild(this.e);
      return this.e;
    }
}

class AlbumItem{
  constructor({imgUrl, imgSize, imgLinks, imgTitle, target}){
    this.e=document.createElement('div');
    this.e.className='album-item';
    this.e.setAttribute('tabindex', '-1');
    target.appendChild(this.e);

    this.bContainer=document.createElement('div');
    this.bContainer.className='album-item-buttonContainer';
    this.e.appendChild(this.bContainer);

    this.bCopyLink=document.createElement('button');
    this.bCopyLink.className='album-item-button-copyLink';
    this.bCopyLink.textContent = buttonsText.copyLink;
    this.bCopyLink.onclick = async function(e){
        navigator.clipboard.writeText(e.target.parentNode.nextElementSibling.src);
        new Alert ({
          text: alertTextUrlCopied,
          target: document.body,
          top: `${e.target.getBoundingClientRect().top + 27}px`,
          left: `${e.target.getBoundingClientRect().left + 0}px`,
          timer: 4000
        });
    }
    this.bContainer.appendChild(this.bCopyLink);

    this.dImgDownload=document.createElement('button');
    this.dImgDownload.className='album-item-button-download';
    this.dImgDownload.textContent = buttonsText.saveImage;
    // this.dImgDownload.href=ev.target.parentNode.nextElementSibling.src
    // this.dImgDownload.download='Test'
    this.dImgDownload.onclick = async function(ev){
      // ev.target.href=ev.target.parentNode.nextElementSibling.src
        let res = await fetch(ev.target.parentNode.nextElementSibling.src);
        let blob = await res.blob();
        let blobUrl = URL.createObjectURL(blob);
        let d = new Date().toString();
        let link = document.createElement('a');
        link.href = blobUrl;
        // link.download=`DTF-image (day ${d.getDay()}, month ${d.getMonth()}, ${d.getUTCHours()}#${d.getUTCMinutes()}#${d.getUTCSeconds()}).${blob.type.replace(/[^]+\/(.+)/, '$1')}`;
        link.download=`DTF-Image (${
            d.replace(/([^]+) GMT.+/, function(def, g){
                return g.replace(/:/gm, '#');
            })
        }).${blob.type.replace(/[^]+\/(.+)/, '$1')}`
        link.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        }));
    }
    this.bContainer.appendChild(this.dImgDownload);

    this.bImgSearch=document.createElement('button');
    this.bImgSearch.className='album-item-button-imgSearch';
    this.bImgSearch.textContent = buttonsText.searchImage;
    this.bImgSearch.onclick = function(ev){
        let menu = new SearchMenu({
            btn: ev.target,
            link: ev.target.parentNode.nextElementSibling.src,
            target: ev.target.parentNode.parentNode.parentNode
        })
        menu.focus();
    }
    this.bContainer.appendChild(this.bImgSearch);

    this.bTurnOffZoom=document.createElement('button');
    this.bTurnOffZoom.className='album-item-button-turnOffZoom';
    this.bTurnOffZoom.textContent = buttonsText.turnOffZoom;
    this.bTurnOffZoom.onclick = function(e){
        if(focused){
            if(focused.classList.value.match(/zoomed/)){
                focused.scrollTo(0, 0);
                zooming('setZoom', focused.children[1]);
                focused.classList.remove('zoomed');
            }
            imagePreviewer.zoom.textContent = `${imagePreviewerElements.zoomLevel.text}${zooming('getZoom', focused.children[1])}${imagePreviewerElements.zoomLevel.x}`;
        }
    }
    this.bContainer.appendChild(this.bTurnOffZoom);

    this.i=document.createElement('img');
    this.i.className='item-image';
    this.i.src=imgUrl;
    if(imgSize) this.i.setAttribute('imgSize', imgSize);
    if(imgLinks) this.i.setAttribute('imgLinks', imgLinks);
    if(imgTitle) this.i.setAttribute('imgTitle', imgTitle);
    this.i.loading = 'lazy';
    //this.i.style.transform = 'scale(1.00)';
    zooming('setZoom', this.i);
//     this.i.onwheel = function(s){
//         if(focused && button1Pressed && 10){
//             s.preventDefault();
//             s.stopImmediatePropagation();
//             if(s.target.parentNode.classList.value.match(/picked/) && !s.target.parentNode.classList.value.match(/zoomed/)){
//                 // s.preventDefault();
//                 // s.stopImmediatePropagation();
//                 s.target.parentNode.classList.add('zoomed');
//             }else
//             if(s.target.parentNode.classList.value.match(/picked/) && s.target.parentNode.classList.value.match(/zoomed/)){
//               console.log(s)
//                 // s.preventDefault();
//                 // s.stopImmediatePropagation();
//                 if(s.deltaY < 0 && button1Pressed){
//                     if(!s.target.style.transform){
//                         s.target.style.transform = `scale(1.25)`;
//                         if(cfg.smartZoom) focused.scrollTo(s.x, s.y);
//                         imagePreviewer.zoom.textContent = `${imagePreviewerElements.zoomLevel.text}${s.target.style.transform}${imagePreviewerElements.zoomLevel.x}`;
//                     }else
//                     if(s.target.style.transform){
//                         s.target.style.transform = `scale(${+s.target.style.transform.replace(/scale\(([0-9.]+)\)/, '$1') + 0.25})`;
//                         if(cfg.smartZoom) focused.scrollTo(s.x, s.y);
//                         imagePreviewer.zoom.textContent = `${imagePreviewerElements.zoomLevel.text}${s.target.style.transform}${imagePreviewerElements.zoomLevel.x}`;
//                     }
//                 }else
//                 if(s.deltaY > 0 && button1Pressed){
//                     if(!s.target.style.transform){
//                         s.target.style.transform = `scale(0.75)`;
//                         if(cfg.smartZoom) focused.scrollTo(s.x, s.y);
//                         imagePreviewer.zoom.textContent = `${imagePreviewerElements.zoomLevel.text}${s.target.style.transform}${imagePreviewerElements.zoomLevel.x}`;
//                     }else
//                     if(s.target.style.transform){
//                         if(+s.target.style.transform.replace(/scale\(([0-9.]+)\)/, '$1') > 0.25){
//                             s.target.style.transform = `scale(${+s.target.style.transform.replace(/scale\(([0-9.]+)\)/, '$1') - 0.25})`;
//                             if(cfg.smartZoom) focused.scrollTo(s.x, s.y);
//                             imagePreviewer.zoom.textContent = `${imagePreviewerElements.zoomLevel.text}${s.target.style.transform}${imagePreviewerElements.zoomLevel.x}`;
//                         }
//                     }
//                 }
//             }
//         }
//     }
    this.e.appendChild(this.i);

    return this.i;
  }
}
class AlbumPreview{
  constructor({previewer, target}){
    this.a=document.createElement('div');
    this.a.className='albumPreview-field';
    this.a.setAttribute('tabindex', '-1');
    target.appendChild(this.a);

    this.bL=document.createElement('button');
    this.bL.className = 'albumPreview-nav-previous-button';
    this.bL.textContent=buttonsText.previous;
    this.bL.onclick = function(){
        if(focused){
            if(focused.previousElementSibling){
                if(focused.classList.value.match(/zoomed/)){
                    focused.scrollTo(0, 0);
                    zooming('setZoom', focused.children[1]);
                    focused.classList.remove('zoomed');
                }
                imagePreviewer.zoom.textContent = `${imagePreviewerElements.zoomLevel.text}${zooming('getZoom', focused.children[1])}${imagePreviewerElements.zoomLevel.x}`;
                focused.classList.remove('picked');
                focused.previousElementSibling.focus();
            }else
            if(!focused.previousElementSibling){
                if(focused.classList.value.match(/zoomed/)){
                    focused.scrollTo(0, 0);
                    zooming('setZoom', focused.children[1]);
                    focused.classList.remove('zoomed');
                }
                imagePreviewer.zoom.textContent = `${imagePreviewerElements.zoomLevel.text}${zooming('getZoom', focused.children[1])}${imagePreviewerElements.zoomLevel.x}`;
                focused.classList.remove('picked');
                focused.parentNode.children[focused.parentNode.children.length-1].focus();
            }
        }
    }
    this.a.appendChild(this.bL)

    this.bR=document.createElement('button');
    this.bR.className = 'albumPreview-nav-next-button';
    this.bR.textContent=buttonsText.next;
    this.bR.onclick = function(){
        if(focused){
            if(focused.nextElementSibling){
                if(focused.classList.value.match(/zoomed/)){
                    focused.scrollTo(0, 0);
                    zooming('setZoom', focused.children[1]);
                    focused.classList.remove('zoomed');
                }
                imagePreviewer.zoom.textContent = `${imagePreviewerElements.zoomLevel.text}${zooming('getZoom', focused.children[1])}${imagePreviewerElements.zoomLevel.x}`;
                focused.classList.remove('picked');
                focused.nextElementSibling.focus();
            }else
            if(!focused.nextElementSibling){
                if(focused.classList.value.match(/zoomed/)){
                    focused.scrollTo(0, 0);
                    zooming('setZoom', focused.children[1]);
                    focused.classList.remove('zoomed');
                }
                imagePreviewer.zoom.textContent = `${imagePreviewerElements.zoomLevel}${zooming('getZoom', focused.children[1])}${imagePreviewerElements.zoomLevel.x}`;
                focused.classList.remove('picked');
                focused.parentNode.children[0].focus();
            }
        }
    }
    this.a.appendChild(this.bR);

    this.imgCount=document.createElement('div');
    this.imgCount.className='albumPreview-field-imgCount';
    this.imgCount.textContent = '';
    this.a.appendChild(this.imgCount);

    this.imgInfo=document.createElement('div');
    this.imgInfo.className='albumPreview-field-imgInfo';
    this.imgInfo.textContent = '';
    this.a.appendChild(this.imgInfo);

    this.imgZoom=document.createElement('div');
    this.imgZoom.className='albumPreview-field-imgZoom';
    this.imgZoom.textContent = '';
    this.a.appendChild(this.imgZoom);

    this.imgTitle=document.createElement('div');
    this.imgTitle.className='albumPreview-field-imgTitle';
    this.imgTitle.textContent = 'Links:';
    this.a.appendChild(this.imgTitle);

    this.imgLinksField=document.createElement('div');
    this.imgLinksField.className='albumPreview-field-imgLinksField';
    this.a.appendChild(this.imgLinksField);

    this.imgLinksFieldTitle=document.createElement('div');
    this.imgLinksFieldTitle.className='albumPreview-field-imgLinksField-title';
    this.imgLinksFieldTitle.textContent=imagePreviewerElements.linksList;
    this.imgLinksField.appendChild(this.imgLinksFieldTitle);

    this.imgLinksList=document.createElement('div');
    this.imgLinksList.className='albumPreview-field-imgLinksField-list';
    this.imgLinksField.appendChild(this.imgLinksList);

    this.buttonClose=document.createElement('button');
    this.buttonClose.className = 'albumPreview-nav-close-button';
    this.buttonClose.textContent=buttonsText.close;
    this.buttonClose.onclick = function(e){
      if(focused){
        // e.preventDefault();
        // e.stopPropagation();
        // e.stopImmediatePropagation();
        layout.style.zIndex = '';
        if(document.querySelector(`div[class='albumPreview-field']`)){
          document.querySelector(`div[class='albumPreview-field']`).remove();
          focused.classList.remove('picked');
          focused.parentNode.parentNode.classList.remove('preview-opened');
          document.body.classList.remove('blockScroll');
          if(focused.classList.value.match(/zoomed/)){
              focused.scrollTo(0, 0);
              zooming('setZoom', focused.children[1]);
              //zooming('getZoom', focused.children[1]);
              focused.classList.remove('zoomed');
          }
          focused.blur();
          focused = false;
        }
      }
    }
    this.a.appendChild(this.buttonClose);

    return {main:this.a, count:this.imgCount, info:this.imgInfo, zoom:this.imgZoom, title:this.imgTitle, imgLinks:this.imgLinksList};
  }
}
class ImgLinksItem{
  constructor({href, target}){
    this.i=document.createElement('a');
    this.i.textContent=href.replace(/(http|https):\/\/([^/]+).*/gm, '$2');
    this.i.href=href;
    this.i.target='_blank';

    target.appendChild(this.i);

    return this.i;
  }
}

    let css = document.createElement('style');
    css.textContent = `
.main.layout {
  /*z-index: 20;*/
}
.layout__right-column {
  z-index: 0;
}

body.blockScroll {
  overflow: hidden !important;
}

.dtf-album-alert {
  background: ${mainCSS.alert.background};
  color: ${mainCSS.alert.color};
  font-size: ${mainCSS.alert.fontSize};
  font-weight: ${mainCSS.alert.fontWeight};
  line-height: ${mainCSS.alert.lineHeight};
  width: ${mainCSS.alert.size.width};
  height: ${mainCSS.alert.size.height};
  border: ${mainCSS.alert.border};
  border-radius: ${mainCSS.alert.borderRadius};
  padding: ${mainCSS.alert.padding};
  position: fixed;
  z-index: ${mainCSS.alert.zIndex};
}

.dtf-album-buttonContainer {
  display: flex;
  justify-content: center;
  -webkit-justify-content: center;
}

.dtf-album-button-create {
  max-height: ${albumCSS.albumCreatingBtn.size.maxHeight};
  background: ${albumCSS.albumCreatingBtn.background};
  color: ${albumCSS.albumCreatingBtn.color};
  font-size: ${albumCSS.albumCreatingBtn.fontSize};
  line-height: ${albumCSS.albumCreatingBtn.lineHeight};
  padding: ${albumCSS.albumCreatingBtn.padding};
  border: ${albumCSS.albumCreatingBtn.border};
  border-radius: ${albumCSS.albumCreatingBtn.borderRadius};
  position: relative;
  top: ${albumCSS.albumCreatingBtn.top};
  margin: ${albumCSS.albumCreatingBtn.margin};
}
.dtf-album-button-create:hover {
  background: ${albumCSS.albumCreatingBtn.hover.background};
  cursor: ${albumCSS.albumCreatingBtn.hover.cursor};
}

.dtf-album-button-create-merge {
  max-height: ${albumCSS.albumCreatingMergeBtn.size.maxHeight};
  background: ${albumCSS.albumCreatingMergeBtn.background};
  color: ${albumCSS.albumCreatingMergeBtn.color};
  font-size: ${albumCSS.albumCreatingMergeBtn.fontSize};
  line-height: ${albumCSS.albumCreatingMergeBtn.lineHeight};
  padding: ${albumCSS.albumCreatingMergeBtn.padding};
  border: ${albumCSS.albumCreatingMergeBtn.border};
  border-radius: ${albumCSS.albumCreatingMergeBtn.borderRadius};
  position: relative;
  top: ${albumCSS.albumCreatingMergeBtn.top};
  margin: ${albumCSS.albumCreatingMergeBtn.margin};
}
.dtf-album-button-create-merge:hover {
  background: ${albumCSS.albumCreatingMergeBtn.hover.background};
  cursor: ${albumCSS.albumCreatingMergeBtn.hover.cursor};
}

.dtf-album-button-create-compilation {
  max-height: ${albumCSS.compilationToAlbumBtn.size.maxHeight};
  background: ${albumCSS.compilationToAlbumBtn.background};
  color: ${albumCSS.compilationToAlbumBtn.color};
  font-size: ${albumCSS.compilationToAlbumBtn.fontSize};
  line-height: ${albumCSS.compilationToAlbumBtn.lineHeight};
  padding: ${albumCSS.compilationToAlbumBtn.padding};
  border: ${albumCSS.compilationToAlbumBtn.border};
  border-radius: ${albumCSS.compilationToAlbumBtn.borderRadius};
  position: relative;
  top: ${albumCSS.compilationToAlbumBtn.top};
  margin: ${albumCSS.compilationToAlbumBtn.margin};
}
.dtf-album-button-create-compilation:hover {
  background: ${albumCSS.compilationToAlbumBtn.hover.background};
  cursor: ${albumCSS.compilationToAlbumBtn.hover.cursor};
}

.dtf-album, .dtf-album-merged, .dtf-album-compilation {
  padding: ${albumCSS.padding};
  box-shadow: ${albumCSS.boxShadow};
  -webkit-box-shadow: ${albumCSS.boxShadow};
  margin: ${albumCSS.margin};
}

.album-info {
  display: block;
  position: absolute;
  background: ${albumCSS.info.background};
  color: ${albumCSS.info.color};
  font-size: ${albumCSS.info.fontSize};
  line-height: ${albumCSS.info.lineHeight};
  margin: ${albumCSS.info.margin};
  padding: ${albumCSS.info.padding};
  border-radius: ${albumCSS.info.borderRadius};
  box-shadow: ${albumCSS.info.boxShadow};
  -webkit-box-shadow: ${albumCSS.info.boxShadow};
  z-index: 1;
}

.dtf-album:hover .album-info, .dtf-album-merged:hover .album-info, .dtf-album-compilation:hover .album-info {
    opacity: ${mainCSS.albums.info.hover.opacity};
}

.album-items-list {
  display: grid;
  grid-template-columns: repeat(${albumItemsCSS.itemsInColumn}, auto);
  grid-template-rows: ${albumItemsCSS.rowsTemplate};
  grid-gap: ${albumItemsCSS.gap};
  max-height: ${albumCSS.size.maxHeight};
  overflow: auto;
  text-align: center;
  justify-content: center;
  -webkit-justify-content: center;
  padding: ${albumItemsCSS.padding};
  overscroll-behavior: ${mainCSS.albums.overscroll};

  scrollbar-width: ${albumCSS.list.scrollbar.sc.size.firefoxWidth};
  scrollbar-color: ${albumCSS.list.scrollbar.sc.firefoxColor};
}

.dtf-album.preview-opened:after, .dtf-album-merged.preview-opened:after, .dtf-album-compilation.preview-opened:after {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background: ${albumCSS.preview.background};
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}

.album-items-list::-webkit-scrollbar {
  width: ${albumCSS.list.scrollbar.sc.size.width};
  height: ${albumCSS.list.scrollbar.sc.size.height};
  background: ${albumCSS.list.scrollbar.sc.background};
}
.album-items-list::-webkit-scrollbar-track {
  background: ${albumCSS.list.scrollbar.track.background};
  border-radius: ${albumCSS.list.scrollbar.track.borderRadius};
  margin: ${albumCSS.list.scrollbar.track.margin};
}
.album-items-list::-webkit-scrollbar-track-piece {
  background: ${albumCSS.list.scrollbar.trackPiece.background};
  border: ${albumCSS.list.scrollbar.trackPiece.border};
  border-radius: ${albumCSS.list.scrollbar.trackPiece.borderRadius};
  width: ${albumCSS.list.scrollbar.trackPiece.size.width};
  height: ${albumCSS.list.scrollbar.trackPiece.size.height};
}
.album-items-list::-webkit-scrollbar-thumb {
  background: ${albumCSS.list.scrollbar.thumb.background};
  border: ${albumCSS.list.scrollbar.thumb.border};
  border-radius: ${albumCSS.list.scrollbar.thumb.borderRadius};
}
.album-items-list::-webkit-scrollbar-thumb:hover {
  background: ${albumCSS.list.scrollbar.thumb.hover.background};
}
.album-items-list::-webkit-scrollbar-corner {
  background: ${albumCSS.list.scrollbar.corner.background};
}

.album-item {
  width: ${albumItemsCSS.size.width};
  height: ${albumItemsCSS.size.height};
  background: ${albumItemsCSS.background};
  text-align: center;
  box-shadow: ${albumItemsCSS.boxShadow};
  -webkit-box-shadow: ${albumItemsCSS.boxShadow};
  border-radius: ${albumItemsCSS.borderRadius};
  overflow: hidden;
  display: block;
  justify-content: center;
  -webkit-justify-content: center;
  align-content: center;
}
.album-item:not(.album-item.picked, .album-item.picked.zoomed):hover {
    box-shadow: ${albumItemsCSS.hover.boxShadow};
    -webkit-box-shadow: ${albumItemsCSS.hover.boxShadow};
    cursor: ${albumItemsCSS.hover.cursor};
    filter: ${albumItemsCSS.hover.filter};
    z-index: ${albumItemsCSS.hover.zIndex};
}

.album-item:not(.album-item.picked, .album-item.zoomed) img {
  max-width: ${albumItemsCSS.image.size.maxWidth};
  max-height: ${albumItemsCSS.image.size.maxHeight};
  margin: ${albumItemsCSS.image.margin};
}

.album-item.picked {
  background: ${albumItemsCSS.background};
  outline: unset;
  width: ${albumCSS.preview.size.width};
  height: ${albumCSS.preview.size.height};
  position: fixed;
  z-index: 1000;
  top: ${albumCSS.preview.position.top};
  left: ${albumCSS.preview.position.left};
  box-shadow: ${albumCSS.preview.boxShadow};
  -webkit-box-shadow: ${albumCSS.preview.boxShadow};
  display: grid;
  overflow: hidden;

  scrollbar-width: ${albumCSS.preview.scrollbar.sc.size.firefoxWidth};
  scrollbar-color: ${albumCSS.preview.scrollbar.sc.firefoxColor};
}

.album-item.picked .album-item-buttonContainer {
  position: absolute;
  z-index: 1001;
}

.album-item.picked img {
  max-width: ${albumCSS.preview.size.width};
  max-height: ${albumCSS.preview.size.height};
  z-index: 1000;
}

.album-item.picked.zoomed {
  background: ${albumCSS.previewZoomed.background};
  outline: unset;
  width: ${albumCSS.previewZoomed.size.width};
  height: ${albumCSS.previewZoomed.size.height};
  position: fixed;
  z-index: 1000;
  top: ${albumCSS.previewZoomed.position.top};
  left: ${albumCSS.previewZoomed.position.left};
  box-shadow: ${albumCSS.previewZoomed.boxShadow};
  -webkit-box-shadow: ${albumCSS.previewZoomed.boxShadow};
  display: block;
  overflow: scroll;
  align-content: stretch;
}

.album-item.picked.zoomed .album-item-buttonContainer {
  z-index: 1001;
  position: fixed;
  width: calc(${albumCSS.preview.size.width} - ${albumItemsCSS.buttonContainerZoomed.widthMinusSize});
}

.album-item.picked.zoomed img {
  max-width: unset;
  max-height: unset;
  z-index: 1000;
}

.album-item-buttonContainer {
  position: relative;
  width: ${albumItemsCSS.buttonContainer.size.width};
  height: ${albumItemsCSS.buttonContainer.size.height};
  opacity: 0;
  z-index: 10;
}
.album-item-buttonContainer:hover {
  opacity: 1;
}

.album-item-button-copyLink {
  min-height: ${albumItemsCSS.buttonContainer.buttonCopyLink.size.minHeight};
  max-height: ${albumItemsCSS.buttonContainer.buttonCopyLink.size.maxHeight};
  background: ${albumItemsCSS.buttonContainer.buttonCopyLink.background};
  color: ${albumItemsCSS.buttonContainer.buttonCopyLink.color};
  border: ${albumItemsCSS.buttonContainer.buttonCopyLink.border};
  box-shadow: ${albumItemsCSS.buttonContainer.buttonCopyLink.boxShadow};
  -webkit-box-shadow: ${albumItemsCSS.buttonContainer.buttonCopyLink.boxShadow};
  border-radius: ${albumItemsCSS.buttonContainer.buttonCopyLink.borderRadius};
  float: left;
  font-size: ${albumItemsCSS.buttonContainer.buttonCopyLink.fontSize};
  line-height: ${albumItemsCSS.buttonContainer.buttonCopyLink.lineHeight};
  margin: ${albumItemsCSS.buttonContainer.buttonCopyLink.margin};
  padding: ${albumItemsCSS.buttonContainer.buttonCopyLink.padding};
}
.album-item-button-copyLink:hover {
  background: ${albumItemsCSS.buttonContainer.buttonCopyLink.hover.background};
  color: ${albumItemsCSS.buttonContainer.buttonCopyLink.hover.color};
}

.album-item-button-imgSearch {
  min-height: ${albumItemsCSS.buttonContainer.buttonSearch.size.minHeight};
  max-height: ${albumItemsCSS.buttonContainer.buttonSearch.size.maxHeight};
  background: ${albumItemsCSS.buttonContainer.buttonSearch.background};
  color: ${albumItemsCSS.buttonContainer.buttonSearch.color};
  border: ${albumItemsCSS.buttonContainer.buttonSearch.border};
  box-shadow: ${albumItemsCSS.buttonContainer.buttonSearch.boxShadow};
  -webkit-box-shadow: ${albumItemsCSS.buttonContainer.buttonSearch.boxShadow};
  border-radius: ${albumItemsCSS.buttonContainer.buttonSearch.borderRadius};
  float: left;
  font-size: ${albumItemsCSS.buttonContainer.buttonSearch.fontSize};
  line-height: ${albumItemsCSS.buttonContainer.buttonSearch.lineHeight};
  margin: ${albumItemsCSS.buttonContainer.buttonSearch.margin};
  padding: ${albumItemsCSS.buttonContainer.buttonSearch.padding};
}
.album-item-button-imgSearch:hover {
  background: ${albumItemsCSS.buttonContainer.buttonSearch.hover.background};
  color: ${albumItemsCSS.buttonContainer.buttonSearch.hover.color};
}

.album-item-button-download {
  min-height: ${albumItemsCSS.buttonContainer.buttonImgDownload.size.minHeight};
  max-height: ${albumItemsCSS.buttonContainer.buttonImgDownload.size.maxHeight};
  background: ${albumItemsCSS.buttonContainer.buttonImgDownload.background};
  color: ${albumItemsCSS.buttonContainer.buttonImgDownload.color};
  border: ${albumItemsCSS.buttonContainer.buttonImgDownload.border};
  box-shadow: ${albumItemsCSS.buttonContainer.buttonImgDownload.boxShadow};
  -webkit-box-shadow: ${albumItemsCSS.buttonContainer.buttonImgDownload.boxShadow};
  border-radius: ${albumItemsCSS.buttonContainer.buttonImgDownload.borderRadius};
  float: left;
  font-size: ${albumItemsCSS.buttonContainer.buttonImgDownload.fontSize};
  line-height: ${albumItemsCSS.buttonContainer.buttonImgDownload.lineHeight};
  margin: ${albumItemsCSS.buttonContainer.buttonImgDownload.margin};
  padding: ${albumItemsCSS.buttonContainer.buttonImgDownload.padding};
}
.album-item-button-download:hover {
  background: ${albumItemsCSS.buttonContainer.buttonImgDownload.hover.background};
  color: ${albumItemsCSS.buttonContainer.buttonImgDownload.hover.color};
}

.album-item-button-turnOffZoom {
  min-height: ${albumItemsCSS.buttonContainer.buttonTurnOffZoom.size.minHeight};
  max-height: ${albumItemsCSS.buttonContainer.buttonTurnOffZoom.size.maxHeight};
  background: ${albumItemsCSS.buttonContainer.buttonTurnOffZoom.background};
  color: ${albumItemsCSS.buttonContainer.buttonTurnOffZoom.color};
  border: ${albumItemsCSS.buttonContainer.buttonTurnOffZoom.border};
  box-shadow: ${albumItemsCSS.buttonContainer.buttonTurnOffZoom.boxShadow};
  -webkit-box-shadow: ${albumItemsCSS.buttonContainer.buttonTurnOffZoom.boxShadow};
  border-radius: ${albumItemsCSS.buttonContainer.buttonTurnOffZoom.borderRadius};
  float: left;
  font-size: ${albumItemsCSS.buttonContainer.buttonTurnOffZoom.fontSize};
  line-height: ${albumItemsCSS.buttonContainer.buttonTurnOffZoom.lineHeight};
  margin: ${albumItemsCSS.buttonContainer.buttonTurnOffZoom.margin};
  padding: ${albumItemsCSS.buttonContainer.buttonTurnOffZoom.padding};
}
.album-item-button-turnOffZoom:hover {
  background: ${albumItemsCSS.buttonContainer.buttonTurnOffZoom.hover.background};
}

.srcSearch {
  min-width: ${albumItemsCSS.searchMenu.size.minWidth};
  min-height: ${albumItemsCSS.searchMenu.size.minHeight};
  background: ${albumItemsCSS.searchMenu.background};
  position: fixed;
  display: grid;
  grid-template-columns: repeat(${albumItemsCSS.searchMenu.itemsInColumn}, auto);
  grid-gap: ${albumItemsCSS.searchMenu.gap};
  align-content: center;
  justify-content: center;
  -webkit-justify-content: center;
  align-items: center;
  justify-items: center;
  padding: ${albumItemsCSS.searchMenu.padding};
  border-radius: ${albumItemsCSS.searchMenu.borderRadius};
  z-index: 1000;
}

.searchmenuItem {
  display: block;
  background: ${albumItemsCSS.searchMenu.items.background};
  color: ${albumItemsCSS.searchMenu.items.color};
  border-radius: ${albumItemsCSS.searchMenu.items.borderRadius};
  text-decoration: unset;
  border: ${albumItemsCSS.searchMenu.items.border};
  padding: ${albumItemsCSS.searchMenu.items.padding};
  width: 100%;
  text-align: center;
  font-size: ${albumItemsCSS.searchMenu.items.fontSize};
  line-height: ${albumItemsCSS.searchMenu.items.lineHeight};
}
.searchmenuItem:hover {
  background: ${albumItemsCSS.searchMenu.items.hover};
}

.albumPreview-field {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
  -ms-touch-action: none;
  touch-action: none;
  -webkit-text-size-adjust: 100%;
  -webkit-backface-visibility: hidden;
  outline: none;
}

.albumPreview-field-imgCount {
  top: ${albumCSS.preview.imageCount.position.top};
  left: ${albumCSS.preview.imageCount.position.left};
  background: ${albumCSS.preview.imageCount.background};
  color: ${albumCSS.preview.imageCount.color};
  font-size: ${albumCSS.preview.imageCount.fontSize};
  font-weight: ${albumCSS.preview.imageCount.fontWeight};
  text-align: center;
  border: ${albumCSS.preview.imageCount.border};
  border-radius: ${albumCSS.preview.imageCount.borderRadius};
  width: ${albumCSS.preview.imageCount.size.width};
  padding: ${albumCSS.preview.imageCount.padding};
  margin: ${albumCSS.preview.imageCount.margin};
  display: block;
  z-index: 1000;
  position: fixed;
}

.albumPreview-field-imgZoom {
  top: ${albumCSS.preview.imageZoomLevel.position.top};
  left: ${albumCSS.preview.imageZoomLevel.position.left};
  background: ${albumCSS.preview.imageZoomLevel.background};
  color: ${albumCSS.preview.imageZoomLevel.color};
  font-size: ${albumCSS.preview.imageZoomLevel.fontSize};
  font-weight: ${albumCSS.preview.imageZoomLevel.fontWeight};
  text-align: center;
  border: ${albumCSS.preview.imageZoomLevel.border};
  border-radius: ${albumCSS.preview.imageZoomLevel.borderRadius};
  width: ${albumCSS.preview.imageZoomLevel.size.width};
  padding: ${albumCSS.preview.imageZoomLevel.padding};
  margin: ${albumCSS.preview.imageZoomLevel.margin};
  display: block;
  z-index: 1000;
  position: fixed;
}

.albumPreview-field-imgInfo {
  top: ${albumCSS.preview.imageInfo.position.top};
  left: ${albumCSS.preview.imageInfo.position.left};
  background: ${albumCSS.preview.imageInfo.background};
  color: ${albumCSS.preview.imageInfo.color};
  font-size: ${albumCSS.preview.imageInfo.fontSize};
  font-weight: ${albumCSS.preview.imageInfo.fontWeight};
  text-align: center;
  border: ${albumCSS.preview.imageInfo.border};
  border-radius: ${albumCSS.preview.imageInfo.borderRadius};
  width: ${albumCSS.preview.imageInfo.size.width};
  padding: ${albumCSS.preview.imageInfo.padding};
  margin: ${albumCSS.preview.imageInfo.margin};
  display: block;
  z-index: 1000;
  position: fixed;
}

.albumPreview-field-imgTitle {
  top: ${albumCSS.preview.imageTitle.position.top};
  left: ${albumCSS.preview.imageTitle.position.left};
  background: ${albumCSS.preview.imageTitle.background};
  color: ${albumCSS.preview.imageTitle.color};
  font-size: ${albumCSS.preview.imageTitle.fontSize};
  font-weight: ${albumCSS.preview.imageTitle.fontWeight};
  text-align: left;
  word-break: break-word;
  border: ${albumCSS.preview.imageTitle.border};
  border-radius: ${albumCSS.preview.imageTitle.borderRadius};
  width: ${albumCSS.preview.imageTitle.size.width};
  max-width: ${albumCSS.preview.imageTitle.size.maxWidth};
  max-height: ${albumCSS.preview.imageTitle.size.maxHeight};
  padding: ${albumCSS.preview.imageTitle.padding};
  margin: ${albumCSS.preview.imageTitle.margin};
  display: block;
  z-index: 1000;
  position: fixed;
  overflow: auto;
}

.albumPreview-field-imgLinksField {
  background: ${albumCSS.preview.imageLinksField.background};
  color: ${albumCSS.preview.imageLinksField.color};
  font-size: ${albumCSS.preview.imageLinksField.fontSize};
  font-weight: ${albumCSS.preview.imageLinksField.fontWeight};
  text-align: center;
  top: ${albumCSS.preview.imageLinksField.position.top};
  left: ${albumCSS.preview.imageLinksField.position.left};
  border: ${albumCSS.preview.imageLinksField.border};
  border-radius: ${albumCSS.preview.imageLinksField.borderRadius};
  width: ${albumCSS.preview.imageLinksField.size.width};
  height: ${albumCSS.preview.imageLinksField.size.height};
  padding: ${albumCSS.preview.imageLinksField.padding};
  margin: ${albumCSS.preview.imageLinksField.margin};
  display: block;
  z-index: 1000;
  position: fixed;
}

.albumPreview-field-imgLinksField-title {
  background: ${albumCSS.preview.imageLinksField.title.background};
  color: ${albumCSS.preview.imageLinksField.title.color};
  font-size: ${albumCSS.preview.imageLinksField.title.fontSize};
  font-weight: ${albumCSS.preview.imageLinksField.title.fontWeight};
  text-align: center;
  top: ${albumCSS.preview.imageLinksField.title.position.top};
  left: ${albumCSS.preview.imageLinksField.title.position.left};
  border: ${albumCSS.preview.imageLinksField.title.border};
  border-radius: ${albumCSS.preview.imageLinksField.title.borderRadius};
  width: ${albumCSS.preview.imageLinksField.title.size.width};
  max-height: ${albumCSS.preview.imageLinksField.title.size.maxHeight};
  padding: ${albumCSS.preview.imageLinksField.title.padding};
  margin: ${albumCSS.preview.imageLinksField.title.margin};
  display: block;
  position: relative;
}

.albumPreview-field-imgLinksField-list {
  background: ${albumCSS.preview.imageLinksField.list.background};
  color: ${albumCSS.preview.imageLinksField.list.color};
  font-size: ${albumCSS.preview.imageLinksField.list.fontSize};
  font-weight: ${albumCSS.preview.imageLinksField.list.fontWeight};
  text-align: center;
  word-break: break-word;
  top: ${albumCSS.preview.imageLinksField.list.position.top};
  left: ${albumCSS.preview.imageLinksField.list.position.left};
  border: ${albumCSS.preview.imageLinksField.list.border};
  border-radius: ${albumCSS.preview.imageLinksField.list.borderRadius};
  width: ${albumCSS.preview.imageLinksField.list.size.width};
  height: ${albumCSS.preview.imageLinksField.list.size.height};
  padding: ${albumCSS.preview.imageLinksField.list.padding};
  margin: ${albumCSS.preview.imageLinksField.list.margin};
  display: grid;
  justify-content: center;
  -webkit-justify-content: center;
  overflow: auto;
}
.albumPreview-field-imgLinksField-list a {
  display: block;
  width: max-content;
  height: max-content;
  color: ${albumCSS.preview.imageLinksField.list.items.color};
  font-size: ${albumCSS.preview.imageLinksField.list.items.fontSize};
  font-weight: ${albumCSS.preview.imageLinksField.list.items.fontWeight};
  margin: ${albumCSS.preview.imageLinksField.list.items.margin};
}
.albumPreview-field-imgLinksField-list a:hover {
  color: ${albumCSS.preview.imageLinksField.list.items.hover.color};
  cursor: ${albumCSS.preview.imageLinksField.list.items.hover.cursor};
}

.album-item.picked::-webkit-scrollbar {
  width: ${albumCSS.preview.scrollbar.sc.size.width};
  height: ${albumCSS.preview.scrollbar.sc.size.height};
  background: ${albumCSS.preview.scrollbar.sc.background};
}
.album-item.picked::-webkit-scrollbar-track {
  background: ${albumCSS.preview.scrollbar.track.background};
  border-radius: ${albumCSS.preview.scrollbar.track.borderRadius};
  margin: ${albumCSS.preview.scrollbar.track.margin};
}
.album-item.picked::-webkit-scrollbar-track-piece {
  background: ${albumCSS.preview.scrollbar.trackPiece.background};
  border: ${albumCSS.preview.scrollbar.trackPiece.border};
  border-radius: ${albumCSS.preview.scrollbar.trackPiece.borderRadius};
  width: ${albumCSS.preview.scrollbar.trackPiece.size.width};
  height: ${albumCSS.preview.scrollbar.trackPiece.size.height};
}
.album-item.picked::-webkit-scrollbar-thumb {
  background: ${albumCSS.preview.scrollbar.thumb.background};
  border: ${albumCSS.preview.scrollbar.thumb.border};
  border-radius: ${albumCSS.preview.scrollbar.thumb.borderRadius};
}
.album-item.picked::-webkit-scrollbar-thumb:hover {
  background: ${albumCSS.preview.scrollbar.thumb.hover.background};
}
.album-item.picked::-webkit-scrollbar-corner {
  background: ${albumCSS.preview.scrollbar.corner.background};
}

.albumPreview-nav-previous-button {
  width: ${albumCSS.preview.navigationButtons.previous.size.width};
  height: ${albumCSS.preview.navigationButtons.previous.size.height};
  position: fixed;
  border-radius: ${albumCSS.preview.navigationButtons.previous.borderRadius};
  top: ${albumCSS.preview.navigationButtons.previous.position.top};
  left: ${albumCSS.preview.navigationButtons.previous.position.left};
  background: ${albumCSS.preview.navigationButtons.previous.background};
  color: ${albumCSS.preview.navigationButtons.previous.color};
  font-size: ${albumCSS.preview.navigationButtons.previous.fontSize};
  border: ${albumCSS.preview.navigationButtons.previous.border};
  z-index: 2;
}
.albumPreview-nav-previous-button:hover {
  background: ${albumCSS.preview.navigationButtons.previous.hover.background};
  cursor: ${albumCSS.preview.navigationButtons.previous.hover.cursor};
}

.albumPreview-nav-next-button {
  width: ${albumCSS.preview.navigationButtons.next.size.width};
  height: ${albumCSS.preview.navigationButtons.next.size.height};
  position: fixed;
  border-radius: ${albumCSS.preview.navigationButtons.next.borderRadius};
  top: ${albumCSS.preview.navigationButtons.next.position.top};
  right: ${albumCSS.preview.navigationButtons.next.position.right};
  background: ${albumCSS.preview.navigationButtons.next.background};
  color: ${albumCSS.preview.navigationButtons.next.color};
  font-size: ${albumCSS.preview.navigationButtons.next.fontSize};
  border: ${albumCSS.preview.navigationButtons.next.border};
  z-index: 2;
}
.albumPreview-nav-next-button:hover {
  background: ${albumCSS.preview.navigationButtons.next.hover.background};
  cursor: ${albumCSS.preview.navigationButtons.next.hover.cursor};
}

.albumPreview-nav-close-button {
  width: ${albumCSS.preview.navigationButtons.close.size.width};
  height: ${albumCSS.preview.navigationButtons.close.size.height};
  position: fixed;
  border-radius: ${albumCSS.preview.navigationButtons.close.borderRadius};
  top: ${albumCSS.preview.navigationButtons.close.position.top};
  right: ${albumCSS.preview.navigationButtons.close.position.right};
  background: ${albumCSS.preview.navigationButtons.close.background};
  color: ${albumCSS.preview.navigationButtons.close.color};
  font-size: ${albumCSS.preview.navigationButtons.close.fontSize};
  line-height: ${albumCSS.preview.navigationButtons.close.lineHeight};
  border: ${albumCSS.preview.navigationButtons.close.border};
  z-index: 2;
}
.albumPreview-nav-close-button:hover {
  background: ${albumCSS.preview.navigationButtons.close.hover.background};
  cursor: ${albumCSS.preview.navigationButtons.close.hover.cursor};
}`
document.body.appendChild(css);
function zooming(mode, target){
    //console.log(mode, target)
  let zoomRep = /([0-9.]+)/;
  let scaleRep = /scale\(([0-9.]+)\)/;
  if(!cfg.browser.isFirefox && mode.match('zoomIn')){
      if(target.style.zoom){
          target.style.zoom = (+target.style.zoom.replace(zoomRep, '$1') + cfg.zoom.zoomPower);
          imagePreviewer.zoom.textContent = `${imagePreviewerElements.zoomLevel.text}${target.style.zoom}${imagePreviewerElements.zoomLevel.x}`;
      }
  }else
  if(!cfg.browser.isFirefox && mode.match('zoomOut')){
      if(target.style.zoom){
          if(+target.style.zoom.replace(zoomRep, '$1') > cfg.zoom.zoomPower){
              target.style.zoom = (+target.style.zoom.replace(zoomRep, '$1') - cfg.zoom.zoomPower);
              imagePreviewer.zoom.textContent = `${imagePreviewerElements.zoomLevel.text}${target.style.zoom}${imagePreviewerElements.zoomLevel.x}`;
          }
      }
  }else
  if(cfg.browser.isFirefox && mode.match('zoomIn')){
      if(target.style.transform){
          target.style.transform = `scale(${+target.style.transform.replace(scaleRep, '$1') + cfg.zoom.zoomPower})`;
          imagePreviewer.zoom.textContent = `${imagePreviewerElements.zoomLevel.text}${target.style.transform.replace(scaleRep, '$1')}${imagePreviewerElements.zoomLevel.x}`;
      }
  }else
  if(cfg.browser.isFirefox && mode.match('zoomOut')){
      if(target.style.transform){
          if(+target.style.transform.replace(scaleRep, '$1') > cfg.zoom.zoomPower){
              target.style.transform = `scale(${+target.style.transform.replace(scaleRep, '$1') - cfg.zoom.zoomPower})`;
              imagePreviewer.zoom.textContent = `${imagePreviewerElements.zoomLevel.text}${target.style.transform.replace(scaleRep, '$1')}${imagePreviewerElements.zoomLevel.x}`;
          }
      }
  }else

  if(cfg.browser.isFirefox && mode.match('getZoom')){
      return target.style.transform.replace(scaleRep, '$1');
  }else
  if(!cfg.browser.isFirefox && mode.match('getZoom')){
      return target.style.zoom.replace(zoomRep, '$1');
  }else

  if(cfg.browser.isFirefox && mode.match('setZoom')){
      target.style.transform = 'scale(1.00)';
  }else
  if(!cfg.browser.isFirefox && mode.match('setZoom')){
      target.style.zoom = '1.00';
  }
}

window.addEventListener('wheel', mouseWheel, {capture:true, passive:false});
function mouseWheel(s){
    if(focused && button1Pressed){
        s.preventDefault();
        s.stopPropagation();
        s.stopImmediatePropagation();
        if(s.target.classList.value.match(/item-image/) && !cfg.zoom.smartZoom){
            //alert('Item ', 'not smartZoom');
            if(!s.target.parentNode.classList.value.match(/zoomed/)){
                s.target.parentNode.classList.add('zoomed');
            }else
            if(s.target.parentNode.classList.value.match(/zoomed/)){
              console.log(s)
                if(s.deltaY < 0){
                    zooming('zoomIn', s.target);
                }else
                if(s.deltaY > 0){
                    zooming('zoomOut', s.target);
                }
            }
        }else
        if(!s.target.classList.value.match(/item-image/) && !cfg.zoom.smartZoom){
            //alert('Not item ', 'not smartZoom');
            if(!focused.classList.value.match(/zoomed/)){
                focused.classList.add('zoomed');
            }else
            if(focused.classList.value.match(/zoomed/)){
              console.log(s)
                if(s.deltaY < 0){
                    zooming('zoomIn', focused.children[1]);
                }else
                if(s.deltaY > 0){
                    zooming('zoomOut', focused.children[1]);
                }
            }
        }else
        if(!s.target.classList.value.match(/item-image/) && cfg.zoom.smartZoom){
            new Alert ({
                text: `SmartZoom активен! Наведите мышь на изображение, и уже потом активируйте зум!`,
                target: document.body,
                top: `60px`,
                left: `20px`,
                timer: 4000
            });
        }else
        if(s.target.classList.value.match(/item-image/) && cfg.zoom.smartZoom){
            //alert('Item ', 'smartZoom');
            if(!s.target.parentNode.classList.value.match(/zoomed/)){
                s.target.parentNode.classList.add('zoomed');
            }else
            if(s.target.parentNode.classList.value.match(/zoomed/)){
              console.log(s)
                if(s.deltaY < 0){
                    zooming('zoomIn', s.target);
                    focused.scrollTo(s.x, s.y);
                }else
                if(s.deltaY > 0){
                    zooming('zoomIn', s.target);
                    focused.scrollTo(s.x, s.y);
                }
            }
        }
    }
}

window.addEventListener('focus', getFocus, true);
function getFocus(e){
  if(e.target.classList){
    if(e.target.classList.value.match(/album-item$/)){
      focused = e.target;
      focused.classList.add('picked');
      if(!document.querySelector(`div[class='albumPreview-field']`)) {
        imagePreviewer = new AlbumPreview ({
            target: document.body
        })
        document.body.classList.add('blockScroll');
        e.target.parentNode.parentNode.classList.add('preview-opened');
      }
      // img.src = focused.querySelector(`img`).src;
      // img.style.maxWidth = '840px'
      // img.style.maxHeight = '810px'
      // img.style.transform = 'unset'
      // console.log(focused.querySelector(`img`).src)
      layout.style.zIndex = '0';
      imagePreviewer.count.textContent = `${imagePreviewerElements.images.text}${Array.prototype.indexOf.call(focused.parentNode.children, focused) + 1}${imagePreviewerElements.images.spacer}${focused.parentNode.childElementCount}`;
      imagePreviewer.info.textContent = `${imagePreviewerElements.info.text}${focused.children[1].naturalWidth}${imagePreviewerElements.info.spacer}${focused.children[1].naturalHeight}${imagePreviewerElements.info.px}`;
      imagePreviewer.zoom.textContent = `${imagePreviewerElements.zoomLevel.text}${zooming('getZoom', focused.children[1])}${imagePreviewerElements.zoomLevel.x}`;
      imagePreviewer.title.textContent = `${imagePreviewerElements.title}${focused.children[1].getAttribute('imgTitle')||''}`;
      checkLinks(focused.children[1].getAttribute('imgLinks'), imagePreviewer.imgLinks);
    }
  }
}
window.addEventListener('keydown', keyDown, true);
function keyDown(e){
  if(e.code.match(cfg.buttons.navigation.previous)){
    if(focused){
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if(focused.previousElementSibling){
        if(focused.classList.value.match(/zoomed/)){
            focused.scrollTo(0, 0);
            zooming('setZoom', focused.children[1]);
            focused.classList.remove('zoomed');
        }
        imagePreviewer.zoom.textContent = `${imagePreviewerElements.zoomLevel.text}${zooming('getZoom', focused.children[1])}${imagePreviewerElements.zoomLevel.x}`;
        focused.classList.remove('picked');
        focused.previousElementSibling.focus();
      }else
      if(!focused.previousElementSibling){
        if(focused.classList.value.match(/zoomed/)){
            focused.scrollTo(0, 0);
            zooming('setZoom', focused.children[1]);
            focused.classList.remove('zoomed');
        }
        imagePreviewer.zoom.textContent = `${imagePreviewerElements.zoomLevel.text}${zooming('getZoom', focused.children[1])}${imagePreviewerElements.zoomLevel.x}`;
        focused.classList.remove('picked');
        focused.parentNode.children[focused.parentNode.children.length-1].focus();
      }
    }
  }else
  if(e.code.match(cfg.buttons.navigation.next)){
    if(focused){
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if(focused.nextElementSibling){
        if(focused.classList.value.match(/zoomed/)){
            focused.scrollTo(0, 0);
            zooming('setZoom', focused.children[1]);
            focused.classList.remove('zoomed');
        }
        imagePreviewer.zoom.textContent = `${imagePreviewerElements.zoomLevel.text}${zooming('getZoom', focused.children[1])}${imagePreviewerElements.zoomLevel.x}`;
        focused.classList.remove('picked');
        focused.nextElementSibling.focus();
      }else
      if(!focused.nextElementSibling){
        if(focused.classList.value.match(/zoomed/)){
            focused.scrollTo(0, 0);
            zooming('setZoom', focused.children[1]);
            focused.classList.remove('zoomed');
        }
        imagePreviewer.zoom.textContent = `${imagePreviewerElements.zoomLevel.text}${zooming('getZoom', focused.children[1])}${imagePreviewerElements.zoomLevel.x}`;
        focused.classList.remove('picked');
        focused.parentNode.children[0].focus();
      }
    }
  }else
  if(e.code.match(cfg.buttons.navigation.esc)){
    if(focused){
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      layout.style.zIndex = '';
      // focused.blur();
      // focused = false;
      if(document.querySelector(`div[class='albumPreview-field']`)){
        document.querySelector(`div[class='albumPreview-field']`).remove();
        focused.classList.remove('picked');
        focused.parentNode.parentNode.classList.remove('preview-opened');
        document.body.classList.remove('blockScroll');
        if(focused.classList.value.match(/zoomed/)){
            focused.scrollTo(0, 0);
            zooming('setZoom', focused.children[1]);
            focused.classList.remove('zoomed');
        }
        focused.blur();
        focused = false;
      }
    }
  }
  if(e.code.match(cfg.buttons.zoom.in)){
      if(focused){
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          //zooming('zoomIn', focused.children[1]);
          if(!focused.classList.value.match(/zoomed/)){
              focused.classList.add('zoomed');
          }else
          if(focused.classList.value.match(/zoomed/)){
              zooming('zoomIn', focused.children[1]);
          }
      }
  }else
  if(e.code.match(cfg.buttons.zoom.out)){
      if(focused){
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          //zooming('zoomIn', focused.children[1]);
          if(!focused.classList.value.match(/zoomed/)){
              focused.classList.add('zoomed');
          }else
          if(focused.classList.value.match(/zoomed/)){
              zooming('zoomOut', focused.children[1]);
          }
      }
  }else
  if(e.code.match(cfg.buttons.scroll.left)){
      if(focused){
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          focused.scrollLeft -= cfg.scroll.scrollPower;
          //for(let i = 0; i < 100; i++){
            //  focused.scrollLeft -= 0.01;
          //}
          //$(focused).animate({
            //  scrollLeft: focused.scrollLeft-50
          //}, 400)
      }
  }else
  if(e.code.match(cfg.buttons.scroll.right)){
      if(focused){
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          focused.scrollLeft += cfg.scroll.scrollPower;
      }
  }else
  if(e.code.match(cfg.buttons.scroll.top)){
      if(focused){
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          focused.scrollTop -= cfg.scroll.scrollPower;
      }
  }else
  if(e.code.match(cfg.buttons.scroll.bottom)){
      if(focused){
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          focused.scrollTop += cfg.scroll.scrollPower;
      }
  }else
  if(e.code.match(cfg.buttons.main.button1)){
    button1Pressed = true;
  }
}
window.addEventListener('keyup', keyUp, true);
function keyUp(e){
    if(e.code.match(cfg.buttons.main.button1)){
    button1Pressed = false;
  }
}

function checkAlbums(albums){
  let albumsN = 0;
  for(let a = 0; a < albums.length; a++){
    if(albums[a]){
      albumsN++;
    }
    if(a+1 === albums.length){
      return albumsN;
    }
  }
}
function checkItems(res){
    let albumsN = 0,
        artsN = 0;
    for(let i = 0, items = JSON.parse(res.textContent.trim()); i < items.length; i++){
        if(items[i].image.type === 'image'){
            artsN++;
        }
        if(i+1 === items.length){
            return artsN;
        }
    }
}

window.addEventListener('load', run, true);
window.addEventListener('beforeunload', run, true);
function run(){
  console.log('DTF-Album 2.0 is ok');
    if(cfg.main.active && !cfg.main.auto){
        if(document.querySelector(`.content.content--full figure[class='figure-gallery'] textarea[name='gallery-data-holder']`)){
            for(let i = 0, arr = document.querySelectorAll(`.content.content--full figure[class='figure-gallery'] textarea[name='gallery-data-holder']`); i < arr.length; i++){
                // arr[i].parentNode.parentNode.parentNode.insertBefore()
                // console.log(checkItems(arr[i]));
                if(checkItems(arr[i]) >= cfg.main.howMany){
                    if(!arr[i].parentNode.parentNode.parentNode.previousElementSibling){
                        new ButtonCreateAlbum({
                            where: arr[i].parentNode.parentNode.parentNode,
                            target: arr[i].parentNode.parentNode.parentNode
                        });
                      // target.parentNode.parentNode.parentNode.parentNode.insertBefore(this.a, target.parentNode.parentNode.parentNode);
                    }else
                    if(arr[i].parentNode.parentNode.parentNode.previousElementSibling){
                        if(arr[i].parentNode.parentNode.parentNode.previousElementSibling.classList){
                            if(!arr[i].parentNode.parentNode.parentNode.previousElementSibling.classList.value.match(/dtf-album-button-create/)){
                                new ButtonCreateAlbum({
                                    where: arr[i].parentNode.parentNode.parentNode,
                                    target: arr[i].parentNode.parentNode.parentNode
                                });
                            }
                        }
                    }
                }
            }
        }
    }else
    if(cfg.main.active && cfg.main.auto){
        if(document.querySelector(`.content.content--full figure[class='figure-gallery'] textarea[name='gallery-data-holder']`)){
            for(let a = 0, albumArr = document.querySelectorAll(`.content.content--full figure[class='figure-gallery'] textarea[name='gallery-data-holder']`); a < albumArr.length; a++){
                if(checkItems(albumArr[a]) >= cfg.main.howMany){
                    if(!albumArr[a].parentNode.parentNode.parentNode.previousElementSibling){
                        let al = albumArr[a].parentNode.parentNode.parentNode;
                        if(!al.style.display){
                            al.style.display = 'none';

                            console.log('Album is founded');
                            if(cfg.main.button){
                              // console.log('Adding buttons', al);
                                new ButtonCreateAlbum ({
                                target: al,
                                where: al
                              });
                            }
                            let album = new Album({
                                where: al.nextElementSibling,
                                target: al
                            });
                            let artsN = 0;
                            for(let i = 0, arr = JSON.parse(al.querySelector(`textarea[name='gallery-data-holder']`).textContent.trim()); i < arr.length; i++){
                                if(arr[i].image.type === 'image'){
                                    new AlbumItem({
                                        imgUrl: `https://leonardo.osnova.io/${arr[i].image.data.uuid}`,
                                        imgSize: arr[i].image.data.size,
                                        target: album.list
                                    })
                                  artsN++;
                                }
                                // console.log(i, arr.length)
                                if(i+1 === arr.length){
                                    album.info.textContent = artsN;
                                }
                            }
                        }
                    }else
                    if(albumArr[a].parentNode.parentNode.parentNode.previousElementSibling){
                        if(albumArr[a].parentNode.parentNode.parentNode.previousElementSibling.classList){
                            if(!albumArr[a].parentNode.parentNode.parentNode.previousElementSibling.classList.value.match(/dtf-album$/)){
                                let al = albumArr[a].parentNode.parentNode.parentNode;
                                // let album;
                                if(!al.style.display){
                                    al.style.display = 'none';
                                    console.log('Album is founded');
                                    if(cfg.main.button){
                                      // console.log('Adding buttons2', al);
                                      new ButtonCreateAlbum ({
                                          target: al,
                                          where: al
                                      });
                                    }
                                    let album = new Album({
                                        where: al.nextElementSibling,
                                        target: al
                                    });
                                    let artsN = 0;
                                    for(let i = 0, arr = JSON.parse(al.querySelector(`textarea[name='gallery-data-holder']`).textContent.trim()); i < arr.length; i++){
                                        if(arr[i].image.type === 'image'){
                                            new AlbumItem({
                                                imgUrl: `https://leonardo.osnova.io/${arr[i].image.data.uuid}`,
                                                imgSize: arr[i].image.data.size,
                                                target: album.list
                                            })
                                          artsN++;
                                        }
                                        // console.log(i, arr.length)
                                        if(i+1 === arr.length){
                                            album.info.textContent = artsN;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if(cfg.merge.active && !cfg.main.auto){
        if(document.querySelector(`.content.content--full figure[class='figure-gallery'] textarea[name='gallery-data-holder']`)){
            if(!document.querySelector(`button[class='dtf-album-button-create-merge']`)){
                if(checkAlbums(document.querySelectorAll(`.content.content--full figure[class='figure-gallery'] textarea[name='gallery-data-holder']`)) >= cfg.merge.howMany){
                    console.log('Creating merge button...');
                    if(!document.querySelector(`div[class='dtf-album-buttonContainer']`)){
                    let container = new ButtonContainer ({
                        target: document.querySelector(`.content.content--full`)
                        });
                        new CreateAlbumButtonMerged({
                            target: container
                        });
                    }
                    if(document.querySelector(`div[class='dtf-album-buttonContainer']`)){
                        new CreateAlbumButtonMerged({
                            target: document.querySelector(`.content.content--full`)
                        });
                    }
                }
            }
        }
    }
    if(cfg.compilation.active){
        if(document.querySelectorAll(`.content.content--full figure[class='figure-image'] .andropov_image`).length >= cfg.compilation.howMany){
            if(!document.querySelector(`button[class='dtf-album-button-create-compilation']`)){
                console.log('Creating compilation button...');
                if(!document.querySelector(`div[class='dtf-album-buttonContainer']`)){
                    let container = new ButtonContainer ({
                        target: document.querySelector(`.content.content--full`)
                        });
                        new CreateAlbumButtonCompilation({
                            target: container
                        });
                }else
                if(document.querySelector(`div[class='dtf-album-buttonContainer']`)){
                    new CreateAlbumButtonCompilation({
                        target: document.querySelector(`div[class='dtf-album-buttonContainer']`)
                    });
                }
            }
        }
    }
}
//
})();