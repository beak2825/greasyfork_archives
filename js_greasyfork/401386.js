// ==UserScript==
// @name                     Google Classroom | Interface modification
// @description              Modification of the interface for the 𝗚𝗼𝗼𝗴𝗹𝗲 𝗖𝗹𝗮𝘀𝘀𝗿𝗼𝗼𝗺.

// @name:en                  Google Classroom | Interface modification
// @description:en           Modification of the interface for the 𝗚𝗼𝗼𝗴𝗹𝗲 𝗖𝗹𝗮𝘀𝘀𝗿𝗼𝗼𝗺.

// @name:ru                  Google Classroom | Модификация интерфейса
// @description:ru           Модификация интерфейса для 𝗚𝗼𝗼𝗴𝗹𝗲 𝗖𝗹𝗮𝘀𝘀𝗿𝗼𝗼𝗺.

// @name:uk                  Google Classroom | | Модифікація інтерфейсу
// @description:uk           Модифікація інтерфейсу для 𝗚𝗼𝗼𝗴𝗹𝗲 𝗖𝗹𝗮𝘀𝘀𝗿𝗼𝗼𝗺.

// @name:bg                  Google Classroom | | Модификация на интерфейса
// @description:bg           Модификация на интерфейса за 𝗚𝗼𝗼𝗴𝗹𝗲 𝗖𝗹𝗮𝘀𝘀𝗿𝗼𝗼𝗺.

// @iconURL                  https://ssl.gstatic.com/classroom/favicon.png
// @version                  1.5
// @match                    https://classroom.google.com/*
// @require                  https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @noframes
// @namespace                https://stomaks.me
// @supportURL               https://stomaks.me?feedback
// @contributionURL          https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=stomaks@gmail.com&item_name=Greasy+Fork+donation
// @author                   Maksim_Stoyanov_(stomaks)
// @developer                Maksim_Stoyanov_(stomaks)
// @copyright                2020, Maxim Stoyanov (stomaks.me)
// @license                  MIT
// @compatible               chrome
// @compatible               firefox
// @compatible               opera
// @compatible               safari
// @downloadURL https://update.greasyfork.org/scripts/401386/%11Google%20Classroom%20%7C%20Interface%20modification%11.user.js
// @updateURL https://update.greasyfork.org/scripts/401386/%11Google%20Classroom%20%7C%20Interface%20modification%11.meta.js
// ==/UserScript==



(function() {
  'use strict';

  // Интеграция иконок
  $(`head`).append(`
<link rel="preload" as="font" href="//stomaks.app/fonts/MaterialIcons/MaterialIcons1.woff2" type="font/woff2" crossorigin="anonymous">
<link rel="preload" as="font" href="//stomaks.app/fonts/MaterialIcons/MaterialIcons2.woff2" type="font/woff2" crossorigin="anonymous">
<link href="//stomaks.app/styles/icons.min.css" rel="stylesheet">`);

  // Интеграция стилей
  {
    $(`head`).append(`
<style>

.tdS5P {
  z-index: 900;
}

ol.FpfvHe > li .ClSQxf > [expanded] {
  border-radius: 100px;
}

ol.FpfvHe > li .ClSQxf > [expanded] > i {
  transition:
    opacity 250ms 0ms cubic-bezier(.4, 0, .2, 1),
    transform 250ms 0ms cubic-bezier(.4, 0, .2, 1);
  padding: 8px;
  border-radius: 100px;
}

ol.FpfvHe > li[expanded="false"] .ClSQxf > [expanded] > i {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}

ol.FpfvHe > li[expanded]:not([expanded="true"]) > .zq2w8b {
  display: none;
}

.xUYklb {
  font-size: 20px;
}

.SRX5Hd {
  position: fixed;
  bottom: 45px;
  right: 45px;
  height: auto;
  width: auto;
  z-index: 900;
}

.SRX5Hd .aS18D.p0oLxb {
  min-width: inherit;
}

.SRX5Hd .GcVcmc .RdyDwe {
  display: none;
}

.SRX5Hd .aS18D.p0oLxb .Fxmcue.cd29Sd {
  padding: 20px;
  text-align: center;
}

.SRX5Hd .aS18D.p0oLxb .Ce1Y1c {
  margin: 0;
}

.Kb1iQ {
  margin: 0 0 0 auto;
}

.JPdR6b.e5Emjc.hVNH5c.bzD7fd.qjTEB {
  position: fixed !important;
  max-height: initial !important;
  top: initial !important;
  left: initial !important;
  right: 25px !important;
  bottom: 35px !important;
}

.JPdR6b.e5Emjc.hVNH5c.bzD7fd.qjTEB > .XvhY1d {
  max-height: initial !important;
}

.JPdR6b.e5Emjc.hVNH5c.bzD7fd.qjTEB #stomaks_classroom_automation [icon="open_in_new"] {
  opacity: .25;
  font-size: 18px;
  margin: auto;
  position: absolute;
  right: 10px;
  top: 8px;
  z-index: 1;
}

main {
  padding-bottom: 75px;
}

.ClSQxf {
  display: flex;
  flex-direction: row;
}

/* # alt */
body > [name="alt"] {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 2px;
  padding: 5px 10px;
  max-width: 500px;
  background: rgba(97, 97, 97, 0.9);
  -webkit-transition: opacity 250ms 250ms cubic-bezier(.4, 0, .2, 1),
    transform 250ms 250ms cubic-bezier(.4, 0, .2, 1),
    top 250ms 0ms cubic-bezier(.4, 0, .2, 1),
    left 250ms 0ms cubic-bezier(.4, 0, .2, 1);
  transition: opacity 250ms 250ms cubic-bezier(.4, 0, .2, 1),
    transform 250ms 250ms cubic-bezier(.4, 0, .2, 1),
    top 250ms 0ms cubic-bezier(.4, 0, .2, 1),
    left 250ms 0ms cubic-bezier(.4, 0, .2, 1);
  -webkit-transform: scale3d(0, 0, 0);
  transform: scale3d(0, 0, 0);
  -webkit-transform-origin: top left;
  transform-origin: top left;
  opacity: 0;
  pointer-events: none;
  z-index: 970;
}

body > [name="alt"],
body > [name="alt"] > * {
  color: #fff;
  font-family: Roboto, Helvetica, Arial, sans-serif;
  font-size: 10px;
  line-height: initial;
  letter-spacing: .5px;
}

body > [name="alt"][state="show"] {
  -webkit-transform: scale3d(1, 1, 1);
  transform: scale3d(1, 1, 1);
  opacity: 1;
}

</style>`);
  }




  // Интеграция кнопки споилера
  $(`body`).append(`<div name="alt"></div>`);





  //+----------------------------------------------------------------------------------------------+
  // Установка подсказок
  function tick () {
    // Скрыть темы
    {
      Object.keys(localStorage).forEach(function ( key, i ) {
        const value = window.localStorage.getItem(key);

        $(`ol.FpfvHe > li[data-dom-id='${key}']`).attr("expanded", value);
        $(`ol.FpfvHe > li[data-dom-id='${key}'] .ClSQxf > [expanded]`).attr("expanded", value);
      });
    }

    // Для основного меню
    {
      const el = $(`div[role="menu"].OX4Vcb a[aria-label]`);

      el.each(function () {
        const el_text = $(this).attr("aria-label");

        $(this).attr("alt", el_text);
      });
    }

    // Установка подсказок - Для меню
    {
      const el = $(`aside.GP1o5c ul > li`);

      el.each(function () {
        const el_text = $(this).find(`div.YVvGBb`).text();

        $(this).attr("alt", el_text);
      });
    }

    // Установка подсказок - Для тем
    {
      const el = $(`ol.FpfvHe > li > div[data-topic-id]`);

      el.each(function () {
        const el_text = $(this).find(`> div > a`).text();

        $(this).attr("alt", el_text);
      });
    }

    // Установка подсказок - Для елементов темы
    {
      const el = $(`ol.Xzp3fc > li > div`);

      el.each(function () {
        const el_text = $(this).find(`.kByKEb > span`).text();

        $(this).attr("alt", el_text);
      });
    }

    //  Кнопка +
    {
      const el = $(`.SRX5Hd`);

      const el_text = el.find(`.GcVcmc .RdyDwe`).text();

      el.attr("alt", el_text);
    }

    // Установка кнопок для споилера
    {
      const el = $(`.ClSQxf`);

      if ( !el.find(`[expanded]`).length ) {
        el.prepend(`<div class="wwnMtb" expanded="true"><i icon="expand_less"></i></div>`);
      }
    }

    // Добавить опцию создания
    {
      const el = $(`.JPdR6b.e5Emjc.hVNH5c.bzD7fd.qjTEB > div > div`);

      if ( !el.find(`#stomaks_classroom_automation`).length ) {
        el.append(`
<div role="separator" class="kCtYwe"></div>
<span jsslot id="stomaks_classroom_automation" tabindex="-1" class="z80M1 FeRvI" aria-label="Автоматизация" role="menuitem">
  <div class="aBBjbd MbhUzd" jsname="ksKsZd"></div>
  <div class="PCdOIb Ce1Y1c" aria-hidden="true">
    <i icon="-cogs" class="mxmXhf NMm5M hhikbc"></i>
  </div>
  <div class="uyYuVb oJeWuf">
    <div class="jO7h3c">Автоматизация</div>
  </div>
  <div>
    <i icon="open_in_new"></i>
  </div>
</span>`);
      }
    }

    setTimeout(tick, 1000);
  };

  setTimeout(tick, 100);
  //+----------------------------------------------------------------------------------------------+





  //+----------------------------------------------------------------------------------------------+
  /** Метод-утилита "getCoordinates" - Получает координаты курсора или элемента.
     *
     * @param {string|jQuery} Путь к элементу, ссылка на элемент или объект с настройками.
     *
     * @param {object} callback Данные для подписанных функций или функция обратного вызова.
     *
     * @return {object|null|function} Объект, или выполняет функцию обратного вызова.
     */
  function getCoordinates ( data, callback = null, event = window.event ) {
    let result = {};

    try {
      result.data = {};

      if ( data == null ) {
        result.data = {
          X: event.clientX || null,
          Y: event.clientY || null,
          x: event.pageX || null,
          y: event.pageY || null
        };
      } else {
        switch ( typeof data ) {
          case "string":
            data = $(data);

          case "object":
            if ( data instanceof jQuery && data.is(":visible") ) {
              result.data = {
                X: data.position().left || null,
                Y: data.position().top || null,
                x: data.offset().left || null,
                y: data.offset().top || null
              };
            }
            break;

          default: break;
        }
      }



      // Без обратного вызова
      if ( !callback ) {
        return result.data;
      }

      // Функция обратного вызова
      if ( typeof callback === "function" ) {
        return callback( result );
      }
    } catch ( error ) {
      result.error = error;
      result.data = null;
    }

    return result.data;
  };
  //+----------------------------------------------------------------------------------------------+





  //+----------------------------------------------------------------------------------------------+
  /** Метод-действие "showAlt" - Отображает подсказку.
     *
     * @param {string|jQuery} Путь к элементу, или ссылка на элемент, или объект с настройками.
     *
     * @param {object} callback Данные для подписанных функций или функция обратного вызова.
     *
     * @return {object|null|function} Объект, или выполняет функцию обратного вызова.
     */
  function showAlt ( data, callback = null, event = window.event ) {
    let result = {};

    result.data = {};

    try {
      function _ ( x, y ) {
        let float = [];
        let temp = x / $(`body`).width() * 100;

        if ( temp <= 10 ) {
          float.push("left");
        } else if ( temp > 10 && temp < 90 ) {
          float.push("center");
        } else {
          float.push("right");
        }

        temp = y / $(`body`).height() * 100;

        if ( temp <= 10 ) {
          float.push("top");
        } else if ( temp > 10 && temp < 90 ) {
          float.push("center");
        } else {
          float.push("bottom");
        }

        return float;
      }

      // Контейнер
      switch ( typeof data ) {
        case "string":
          if ( data.length > 0 ) {
            result.data.container = $(data);
            break;
          }

        case "object":
          if ( data instanceof jQuery ) {
            result.data.container = data;
            break;
          }

        default:
          throw new TypeError(`Входящие данные не определены или имеют неверный тип данных.`);
      }

      // Подсказка
      result.data.alt = result.data.container.attr("alt");

      // Направление подсказки
      result.data.float = [];
      {
        let temp = result.data.container.attr("alt-float");

        if ( typeof temp === "string" ) {
          temp = temp.split(" ");

          result.data.float = [temp[0], temp[1]];
        }
      }

      // Определение соответствия текста в alt и в элементе
      function isAlt ( el, alt ) {
        if ( el.children().length > 0 ) {
          // Видимые в элементы
          el = el.children(`:visible:not(.content)`).filter(function() {
            return !($(this).css(`opacity`) === "0" || $(this).css(`visibility`) === "hidden");
          });
        }

        // Текст
        result.data.text = el.text().replace(/^\s+|\s+$/g, ``);

        return (typeof alt === "string" && alt.length ); // && alt !== result.data.text
      }

      if ( isAlt(result.data.container, result.data.alt) ) {
        $(`body > div[name="alt"]`)
          .attr("state", "show")
          .html( result.data.alt );



        // Получить координаты контейнера
        result.data.coordinates = getCoordinates( data );

        // Валидация направления подсказки
        {
          let isX = false;
          if ( result.data.float[0] === "left" || result.data.float[0] === "center" || result.data.float[0] === "right" ) {
            isX = true;
          }

          let isY = false;
          if ( result.data.float[1] === "top" || result.data.float[1] === "center" || result.data.float[1] === "bottom" ) {
            isY = true;
          }

          if ( !isX || !isY || result.data.float.length !== 2 ) {
            // Получить положение контейнера
            let temp = _(result.data.coordinates.x, result.data.coordinates.y);

            if ( !isX ) {
              result.data.float = [temp[0], result.data.float[1]];
            }

            if ( !isY ) {
              result.data.float = [result.data.float[0], temp[1]];
            }
          }
        }



        let app_width = $(`body`).outerWidth() || $(`body`).width();
        let app_height = $(`body`).outerHeight() || $(`body`).height();

        let alt_width = $(`body > div[name="alt"]`).outerWidth() || $(`body > div[name="alt"]`).width();
        let alt_height = $(`body > div[name="alt"]`).outerHeight() || $(`body > div[name="alt"]`).height();

        let container_width = result.data.container.outerWidth() || result.data.container.width();
        let container_height = result.data.container.outerHeight() || result.data.container.height();

        switch ( result.data.float.join(" ")  ) {
          case "left top": // ↘
            result.data.coordinates.y += container_height + 10;
            break;

          case "left center": // →
            result.data.coordinates.x += container_width + 20;
            result.data.coordinates.y += (container_height - alt_height ) / 2;
            break;

          case "left bottom": // ↗
            result.data.coordinates.x += container_width + 20;
            result.data.coordinates.y += (container_height - alt_height ) / 2;
            break;

          case "center top": // ↓
            result.data.coordinates.x += ((container_width - alt_width) / 2);
            result.data.coordinates.y += container_height + 10;
            break;

          case "center center": // •
            result.data.coordinates.x += ((container_width - alt_width) / 2);
            result.data.coordinates.y += container_height + 10;
            break;

          case "center bottom": // ↑
            result.data.coordinates.x += ((container_width - alt_width) / 2);
            result.data.coordinates.y -= alt_height + 10;
            break;

          case "right top": // ↙
            result.data.coordinates.x += container_width - alt_width;
            result.data.coordinates.y += container_height + 10;
            break;

          case "right center": // ←
            result.data.coordinates.x -= alt_width + 25;
            result.data.coordinates.y += (container_height - alt_height ) / 2;
            break;

          case "right bottom": // ↖
            result.data.coordinates.x -= alt_width + 25;
            result.data.coordinates.y += (container_height - alt_height ) / 2;
            break;
        }

        if ( result.data.coordinates.x < 20 ) {
          result.data.coordinates.x = 20;
        }
        if ( result.data.coordinates.x + 40 >= app_width ) {
          result.data.coordinates.x = app_width - (alt_width + 20);
        }

        if ( result.data.coordinates.y < 20 ) {
          result.data.coordinates.y = 20;
        }
        if ( result.data.coordinates.y + 40 >= app_height ) {
          result.data.coordinates.y = app_height - (alt_height + 20);
        }



        $(`body > div[name="alt"]`)
          .css({
          "left": result.data.coordinates.x,
          "top": result.data.coordinates.y,
          "-webkit-transform-origin": result.data.float.join(" "),
          "transform-origin": result.data.float.join(" ")
        });
      } else {
        $(`body > div[name="alt"]`)
          .attr("state", "hide");
      }



      // Без обратного вызова
      if ( !callback ) {
        return result.data;
      }

      // Функция обратного вызова
      if ( typeof callback === "function" ) {
        return callback( result );
      }
    } catch ( error ) {
      result.error = error;
      result.data = null;
    }

    return result.data;
  };
  //+----------------------------------------------------------------------------------------------+





  $(`html > body`)

  // Показать подсказку
    .on("mouseover focus", "*", function ( event = window.event ) {
    // Контейнер
    let el_container = $(this).find(event.target).closest(`[alt]`);

    showAlt( el_container );
  })

  // [Свернуть|Развернуть споилер]
    .on("mouseup", ".ClSQxf > [expanded]", function ( event = window.event ) {
    const el = $(this);
    const el_container = el.closest(`li`);

    let expanded = el.attr("expanded");
    const id = el_container.attr("data-dom-id");

    if ( expanded == "true" ) {
      expanded = "false";
    } else {
      expanded = "true";
    }

    el.attr("expanded", expanded);
    el_container.attr("expanded", expanded);

    localStorage.setItem(id, expanded);
    console.log( id, expanded );
  })

  // Показать подсказку
    .on("mouseover focus", "#stomaks_classroom_automation", function ( event = window.event ) {
    const el = $(this);

    el.addClass("FwR7Pc");
  })

  // Кнопка "Автоматизация"
    .on("mouseover focus", "#stomaks_classroom_automation", function ( event = window.event ) {
    const el = $(this);

    el.addClass("FwR7Pc");
  })
    .on("mouseleave focusout", "#stomaks_classroom_automation", function ( event = window.event ) {
    const el = $(this);

    el.removeClass("FwR7Pc");
  })
    .on("mouseup", "#stomaks_classroom_automation", function ( event = window.event ) {
    window.open("https://g-apps-script.com/blog/google-klass", "_blank");
  })
  ;

})();