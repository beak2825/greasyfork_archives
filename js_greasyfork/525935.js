// ==UserScript==
// @name         daylight_Mode V2 for Greasyfork
// @namespace    http://tampermonkey.net/
// @version      2.3.8
// @description  changes the color theme of the page to cool daylight colors.
// @author       Gullampis810
// @license      MIT
// @match        https://greasyfork.org/*
// @icon         https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/6f/d0/b6/6fd0b6b2-d0f4-54b8-3ae4-4bc709de11c4/AppIcon-0-0-2x_U007euniversal-0-4-85-220.png/1200x630bb.png
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/525935/daylight_Mode%20V2%20for%20Greasyfork.user.js
// @updateURL https://update.greasyfork.org/scripts/525935/daylight_Mode%20V2%20for%20Greasyfork.meta.js
// ==/UserScript==




(function() {
    'use strict';



    // Добавляем кастомный стиль на страницу
    GM_addStyle(`


          /* значок js */
          .badge-js {
          background-color: #deb53b;
          color: #000000 !important;
          mix-blend-mode: inherit; /* Улучшение контраста */
      }

         /* уведомление об ошибках */
         .validation-errors {
             background-color: #af6a186b;
             border: none;
             border-left: 6px solid #FF9800;
         }

td {
    background: #12433c !important;
    border-radius: 20px !important;
    padding: 10px !important;
}
td.ban-text {
    color: red !important;
    background-color: #ff000033 !important; /* Полупрозрачный красный фон */
}


                     .language-selector-locale {
                       padding: 6px;
                       border-radius: 25px !important;
                       border: solid 2px #147572 !important;
                     }

                .text-content.log-table {
                  background: #0e2921 !important;
                }
                                .discussion-list.discussion-list-logged-in {
                                               	background: #153637 !important;
                                               	box-shadow: 4px 4px 7px 0px #0d1211 !important;
                                               }

                               .discussion-list-container.discussion-read {
                                               background: #1c351d;
                                             } /* прочитано */
                .list-option-button {
                  background: #433f4d !important;
                  color: #6ffbee !important;
                  border-radius: 30px !important;
                }

      a.script-link {
              color: #40b16e !important;
    box-shadow: 0px 0px 14px 1px #88c951;
    background: #44404e;
    padding: 5px;
    border-radius: 7px;
      }

           /* input search */

           input[type="search"] {
               box-shadow: inset 0px 0px 14px 1px #0d1211;
               background: #44404e;
               padding: 8px;
               border-radius: 30px;
               border: 2px #6bebe0 solid;
             }


         p#deleted-note {
             color: #671111 !important;
         }


          /* кнопки переключения страницы 12345678910111213  */
         .pagination>*, .script-list+.pagination>*, .user-list+.pagination>* {
             background-color: #564062;
             border-radius: 5px;
         }
         .pagination>a:hover, .pagination>a:focus {
             background-color: #227648;
         }


        a.self-link, a.self-link:visited {
            opacity: 1.2;
            background-color: #53405f;
            border: 2px solid #27857b;
            border-radius: 5px;
        }





        /* Стили для ссылок */
        a {
            color: #000000; /* Начальный цвет ссылки */
            text-decoration: none; /* Убираем подчеркивание */
            transition: all 0.3s ease; /* Плавный переход при изменении */
        }

        /* Подсветка при наведении */

         a:hover {
           color: #8b5ea9;
           background-color: #0e2921;
           padding: 7px 10px;
           border-radius: 5px;
           box-shadow: -1px 9px 9px 0px #000000a2;
       }


        /* Дополнительные стили для боковой панели (например, если это кнопки) */
        .sidebar a {
            display: block;
            padding: 10px;
            color: #8b5ea9;
            border-radius: 4px;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        .sidebar a:hover {
            background-color: #8b5ea9; /* Темный фон при наведении */
            color: #8b5ea9; /* не Белый цвет текста при наведении */
        }




       /* Стили для общего текста */
        * {
            color: #e2e2e2 !important;
        }

                 body, select, input {
                 background-color: #0e2921;
                 border-radius: 7px;
             }


        /* слово require */
        code {
            background-color: #835818;
        }

/* code container info script */
.code-container {
    background: #091c1b;
}

      /* фон страницы градиент */
        body {
             background: -webkit-linear-gradient(44deg, hsla(170, 52%, 38%, 1) 0%, hsla(285, 66%, 31%, 1) 56%, hsla(34, 100%, 38%, 1) 100%);
             background-size: 100% 500%;  /* Растягиваем градиент по всей ширине и высоте элемента */
        }

        #main-header {
            background-color: #5d3e72;
            background-image: linear-gradient(#412451, #009981);
            box-shadow: 0 0 15px 2px #000000a1;
            padding: .25em 0;
        }

         .user-content {
           background: linear-gradient(to right, #247a8c, #1f504f 1em);
           border-left: 2px solid #43edca;
       }


        .user-content > p:first-child {
          background: linear-gradient(268deg, hsla(181, 29%, 39%, 1) 0%, hsl(178.78deg 44.14% 21.76%) 100%);
         }

        #additional-info .user-screenshots {
             background: linear-gradient(259deg, hsla(181, 29%, 39%, 1) 0%, hsl(178.78deg 44.14% 21.76%) 100%);
        }

 .list-option.list-current {
           border-left: 7px solid #800;
           box-shadow: 0 1px 0px 6px #0000001a;
           background: linear-gradient(#1e5952, #7648a0);
       }

form.new_user input[type="submit"] {
              color: rgb(255, 255, 255);
              background-color: rgb(55, 14, 88);
              background-image: linear-gradient(rgb(25, 139, 120), rgb(55, 14, 88));
          }

 /* лист групп */
        .list-option-group a:hover, .list-option-group a:focus {
            background: linear-gradient(#3c646b, #8b75a7);
            text-decoration: none;
            box-shadow: inset 0 -1px #ddd, inset 0 1px #eee;
        }



  #script-info {
            border: 1px solid #BBBBBB;
            border-radius: 5px;
            clear: left;
            background-color: #1f504f;
            margin: 1em 0 0;
            box-shadow: 0px 14px 14px 1px #000000a2;
        }


        .form-control textarea:not([rows]), #ace-editor {
            height: 20em;
            background-color: #1a3a38;
            color: #9fc8bf;
        }

       .previewable textarea {
           margin: 0;
           background-color: #1a3a38;
       }

       .ace_gutter-cell {
           color: aquamarine;
       }

       .ace_folding-enabled {
           background-color: #557657;
       }

        a {
            color: #24d5a8;
        }


        a:visited {
            color: #162c64;
        }

       .reportable {
           background-color: #154540;
       }

       .text-content:last-child {
           background-color: #154540;
       }

       .script-list {
           background-color: #154540;
       }

       .list-option-group ul {
           background-color: #44404e;
       }




       #add-additional-info {
           background-color: #a48cb3;
           padding: 10px 20px;
           border: none;
           border-radius: 5px;
           cursor: pointer;
           font-size: 16px;
           transition: background-color 0.3s;
       }


          input[type="submit"][name="commit"] {
          background-color: #a48cb3;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
      }

          /* При наведении на кнопку */
          input[type="submit"][name="commit"]:hover {
              background-color: #45a049; /* Темнее при наведении */
          }

         /* text Code editor Li */
         li.L1, li.L3, li.L5, li.L7, li.L9 {
             background: #152d2d;
        }
/* цвет фона  выделения текста в редакторе  */
.ace-tm .ace_marker-layer .ace_selection {
    background: #1f6b53;
}

      #version-note {
          background-color: #ffc79980;
          border: 2px dotted #3bd39e;
      }

      nav nav {
      position: absolute;
      right: 0px;
      background-color: #62556f;
      min-width: 100%;
      display: none;
      z-index: 10;
      padding: 5px 0px;
      border-radius: 12px;
      }

       .notice {
           background-color: #148a88a9;
           border-left: 6px solid #ad85d9;
           padding: 0.5em;
       }

        form.external-login-form {
            position: relative;
            display: table;
            background-color: rgb(42, 77, 80);
            text-align: center;
            margin: 0px auto;
            padding: 1em;
            border-width: 1px;
            border-style: solid;
            border-color: rgb(63, 218, 179);
            border-image: initial;
            border-radius: 5px;
        }

          form.new_user {
              position: relative;
              width: 340px;
              background-color: #2a4d50;
              text-align: start;
              margin: 0px auto;
              padding: 1em;
              border-width: 1px;
              border-style: solid;
              border-color: rgb(42, 211, 160);
              border-image: initial;
              border-radius: 5px;
          }



          input#user_email {
          background-color: #4f3a5f;
          opacity: 0.8;
      }
      input#user_password {
          background-color: #4f3a5f;
          opacity: 0.8;
      }

       button.external-login {
           color: white;
           font-size: 1.1em; /* Немного увеличил размер */
           padding: 12px 20px;
           border: none;
           border-radius: 8px;
           cursor: pointer;
           transition: all 0.3s ease-in-out;
           box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
       }

       button.external-login:hover {
           transform: scale(1.05); /* Небольшое увеличение при наведении */
           box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
       }

       button.external-login.google_oauth2-login {
           background-color: #30558e;
       }

       button.external-login.gitlab-login {
           background-color: #af8548;
       }

       button.external-login.github-login {
           background-color: #292e5f;
       }
         .tabs .current {
          box-shadow: #00000060 1px 0px inset, #00000077 -1px 0px inset, #00000052 0px -1px inset;
          border-top: 7px solid #21a392;
          border-radius: 4px 4px 0 0;
      }

      /* tab hover */
      .tabs .current, .tabs>*:not(.current) a:hover, .tabs>*:not(.current) a:focus {
    background: #98ab3761;
    box-shadow: 0px 11px 7px 1px #000000a2;
}


           input[type="file" i]::-webkit-file-upload-button {
               appearance: none;
               font-size: 1.1em;
               font-weight: bold;
               text-align: center;
               cursor: pointer;
               box-sizing: border-box;
               background-color: #215e53;
               color: white;
               padding: 8px 14px;
               border: 2px solid #2cb389;
               border-radius: 6px;
               transition: all 0.3sease-in-out;
               box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
           }
           }

           input[type="file" i]::-webkit-file-upload-button:hover {
               transform: scale(1.05); /* Увеличение при наведении */
               box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
               background-color: #357abd; /* Темнее при наведении */
           }

           input[type="file" i]::-webkit-file-upload-button:active {
               transform: scale(0.98); /* Небольшое уменьшение при клике */
               box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
           }
span.rating-icon.rating-icon-good {
    background: #22731c;
}







input[type="submit"] {
    background-color: #16302f; /* red  фон */
    color: white; /* Белый текст */
    border: none; /* Без границы */
    border-radius: 12px; /* Сглаженные углы */
    padding: 15px 32px; /* Отступы (вверх/низ, влево/вправ) */
    text-align: center; /* Текст по центру */
    text-decoration: none; /* Без подчеркивания */
    display: inline-block; /* Для правильного отображения */
    font-size: 16px; /* Размер шрифта */
    cursor: pointer; /* Курсор в виде руки */
    transition: background-color 0.3s ease, transform 0.2s ease; /* Плавное изменение фона и анимация */
}

input[type="submit"]:hover {
    background-color: #15584f; /* Цвет при наведении */
    transform: translateY(-2px); /* Легкий эффект поднятия кнопки */
}

input[type="submit"]:active {
    background-color: #401c1c; /* Цвет при нажатии */
    transform: translateY(0); /* Кнопка возвращается в исходное положение */
}

input[type="submit"]:focus {
    outline: none; /* Убираем обводку при фокусе */
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); /* Легкая тень при фокусе */
}


    `);




        // Добавляем кастомный scrollbar   на страницу
    GM_addStyle(`


::-webkit-scrollbar {
      width: 25px;
    background: -webkit-linear-gradient(44deg, hsla(170, 52%, 38%, 1) 0%, hsla(285, 66%, 31%, 1) 56%, hsla(34, 100%, 38%, 1) 100%);
}

::-webkit-scrollbar-thumb {
  background-color: #C1A5EF; /* Цвет бегунка */
  border-radius: 22px; /* Скругление бегунка */
  border: 3px solid #4F3E6A; /* Внутренний отступ (цвет трека) */
  height: 80px; /* Высота бегунка */
}

::-webkit-scrollbar-thumb:hover {
  background-color: #C6AEFF; /* Цвет бегунка при наведении */
}

::-webkit-scrollbar-thumb:active {
  background-color: #B097C9; /* Цвет бегунка при активном состоянии */
}

::-webkit-scrollbar-track {
  background:rgba(69, 85, 101, 0); /* Цвет трека */
  border-radius: 0px 0px 8px 0px; /* Скругление только нижнего правого угла */
}

::-webkit-scrollbar-track:hover {
  background-color:rgba(69, 85, 101, 0); /* Цвет трека при наведении */
}

::-webkit-scrollbar-track:active {
  background-color:rgba(69, 85, 101, 0); /* Цвет трека при активном состоянии */
}

/*  фон таблица канвас статистика */
canvas#install-stats-chart-container-canvas {
    background: #004737;
}


/* Базовые стили для всех кнопок */
button {
    background: #673AB7; /* Основной цвет */
    color: #ffffff; /* Белый цвет текста */
    padding: 10px 20px; /* Внутренние отступы */
    border: none; /* Убираем стандартную границу */
    border-radius: 6px; /* Скругленные углы */
    font-size: 14px; /* Размер шрифта */
    font-weight: 500; /* Полужирный шрифт */
    cursor: pointer; /* Курсор в виде руки */
    transition: all 0.3s ease; /* Плавные переходы */
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2); /* Легкая тень */
    position: relative; /* Для эффектов с псевдоэлементами */
    overflow: hidden; /* Скрываем переполнение для эффектов */
}

/* Эффект при наведении: затемнение и подъем */
button:hover {
    background: #5e35a6; /* Чуть темнее */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); /* Увеличиваем тень */
    transform: translateY(-2px); /* Подъем кнопки */
}

/* Эффект при нажатии: опускание */
button:active {
    background: #552e91; /* Еще темнее */
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); /* Уменьшаем тень */
    transform: translateY(1px); /* Опускание кнопки */
}

/* Эффект пульсации для привлечения внимания */
button[name="save"] {
    animation: pulse 2s infinite ease-in-out; /* Пульсация только для кнопки Save */
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(103, 58, 183, 0.7);
    }
    50% {
        box-shadow: 0 0 0 10px rgba(103, 58, 183, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(103, 58, 183, 0);
    }
}

/* Эффект волны при нажатии */
button::after {
    content: '';
    position: absolute;
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    transition: transform 0.5s ease, opacity 0.5s ease;
}

button:active::after {
    transform: translate(-50%, -50%) scale(2);
    opacity: 1;
}

/* Специфические стили для кнопки "Remove selected" */
button[name="remove-selected-scripts"] {
    background: #d32f2f; /* Красный цвет для кнопки удаления */
}

button[name="remove-selected-scripts"]:hover {
    background: #b71c1c; /* Темнее при наведении */
}

button[name="remove-selected-scripts"]:active {
    background: #9a0000; /* Еще темнее при нажатии */
}

  `);

})();

