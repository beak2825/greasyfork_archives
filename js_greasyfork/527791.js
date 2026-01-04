// ==UserScript==
// @name         Rsload net Green Mode theme colors
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Изменяет цвет текста на странице
// @author       Gullampis810
// @license      MIT
// @match        https://rsload.net/*
// @icon https://github.com/sopernik566/icons/blob/main/rsloadiCon.png?raw=true
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/527791/Rsload%20net%20Green%20Mode%20theme%20colors.user.js
// @updateURL https://update.greasyfork.org/scripts/527791/Rsload%20net%20Green%20Mode%20theme%20colors.meta.js
// ==/UserScript==






(function() {
    'use strict';

    // Добавляем стили для изменения цвета текста и других элементов
    GM_addStyle(`
        /* Стили для общего текста */
        * {
            color: #e2e2e2 !important;
        }


            .search-page {
                background-color: #1e3c39;
                border-radius: 4px;
                box-shadow: 0 2px 6px 2px rgb(0 0 0 / 38%);
            }

          ::selection {
            background-color: #5b2f78;
        }

            #fullsearch:not(.fullsearch) #searchinput {
                width: 100%;
                display: block;
                max-width: 600px;
                margin: 0 0 7px 0;
                border-radius: 4px;
                box-shadow: inset 0 2px 6px 2px rgb(0 0 0 / 38%);
                background-color: #243530;
            }

            .sres-wrap {
                background-color: #1e3c39;
                border: 1px solid #2b805e;
            }

       /* поисковая строка */
       .search-inner input, .search-inner input:focus {
        background-color: #1e2a25;
        }

        /* шапка градиента */
        .header-in {
         padding: 0 10px;
        background-color: #1e3c39;
        }

        /* Стили для .cols */
        .cols {
            background-color: #182622;
        }

        /* Стили для .short */
        .short {
            margin-bottom: 20px;
            background-color: #1e3c39;
        }

        /* Стили для .side-bc */
        .side-bc {
            background-color: #1e3c39;
        }

        /* Стили для .lb-user */
        .lb-user {
            margin: -20px -20px 20px -20px;
            padding: 20px;
            background-color: #295443;
            display: flex;
            flex-flow: row wrap;
            justify-content: left;
            align-items: center;
        }

        /* Стили для .bb-editor textarea */
        .bb-editor textarea {
            background-color: #354e47;
        }

        /* Стили для .comm-two */
        .comm-two {
                background-color: #152624;
    border: 1px solid #246a6a;
    box-shadow: 0px 13px 9px 0px rgb(0 0 0 / 79%);
        }

        .comm-item {
    border-bottom: 1px solid #3a746e;
}



            #gotop {
                position: fixed;
                width: 40px;
                height: 40px;
                line-height: 36px;
                right: 10px;
                bottom: 10px;
                cursor: pointer;
                font-size: 20px;
                z-index: 9998;
                display: none;
                opacity: 0.7;
                background-color: #236b63;
                color: #fff;
                border-radius: 50%;
                text-align: center;
            }

        /* Стили для .comments-tree-list */
        .comments-tree-list > .comments-tree-item > .comments-tree-list {
            padding: 20px 20px 20px 40px;
            margin: 0 -20px 20px -20px;
            background-color: #203a37;
            box-shadow: inset 0 25px 20px -20px rgba(0, 0, 0, 0.15), inset 0 -25px 20px -20px rgba(0, 0, 0, 0.15);
        }

        /* Стили для .dle-comments-navigation .pagi-nav */
        .dle-comments-navigation .pagi-nav {
            background-color: #3a3243;
        }

        /* Стили для .quote */
        .quote {
            background-color: #004a54;
        }

        /* Стили для .title_quote */
        .title_quote {
            background: #222528;
        }

        /* Стили для .comm-rate2 a */
        .comm-rate2 a {
            display: block;
            background-color: #269268;
        }

        /* Стили для .bb-pane */
        .bb-pane {
            height: 1%;
            overflow: hidden;
            padding: 0 0 5px 5px;
            margin: 0;
            height: auto !important;
            text-decoration: none;
            background: linear-gradient(to bottom, #61396f 0%, #12330f 100%);
            border-radius: 0px;
            border: 1px solid #32bc98;
            box-shadow: none !important;
        }

        /* Стили для .lb-menu a */
                       .lb-menu a {
                   background-color: #182622;
                   border-bottom: 1px solid #2b805e;
                   position: relative;
                   width: 235px;
                   right: 18px;
               }

               .side-top a:hover {
                 background-color: #41215e;
                 }

                .side-top a {
                    border-bottom: 1px solid #5bfff2;
                }

             .lcomm:hover {
                 background-color: #2a6a64;
                 box-shadow: inset 0 0 7px 1px rgb(0 0 0 / 65%);
             }
             .lcomm {
                 border-bottom: 1px solid #3db199;
             }

           .lc-popup {
               background-color: #2a6a64;
               border: 2px solid #52ffd6;
               box-shadow: 30px 30px 55px 16px rgb(0 0 0 / 79%)
           }

                  .bb-pane>b {
            background: #244665;
            border-radius: 5px;
            width: 40px;
            height: 25px;
            border: 2px solid #458a83;
        }

            .bb-btn:active {
                background: #193930;
                border-color: #9c90a9;
                box-shadow: 0 0 5px #000000 inset;
            }

.bb-btn:hover {
    background-color: #e6e6e6;
    background: linear-gradient(to bottom, #2d1937 0%, #1e6422 100%);
    border: 2px solid #45ba98;
}

.scriptcode, .title_spoiler, .text_spoiler {
    background: #184033;
    border: 1px solid #38ad95;
}

.side-top a:hover, .lforum a:hover, .speedbar a:hover {
    background-color: #13621c;
}

.lb-menu a:hover, .lb-menu a:hover .fa {
    background-color: #5b2f78;
}

.up-second {
    background-color: #1e3c39;
}

.up-third {
    border-bottom: 1px solid #47caae;
    border-top: 1px solid #4cffe9;
    box-shadow: inset 0 5px 5px -5px rgba(0, 0, 0, 0.2);
    background: #1e3c39;
}

.user-prof {
    border: 1px solid #48d0b4;
    background-color: #1e3c39;
}

.up-third li:nth-child(2n) {
    background-color: #173e3e;
}

.up-first {
    background-color: #182622;
}


.button, .pagi-load a, .up-second li a, .up-edit a, .qq-upload-button, button:not(.color-btn), html input[type="button"], input[type="reset"], input[type="submit"] {
    background: linear-gradient(171deg, #2f8a6d 0%, #0c282b 100%);
}
.button:hover, .up-second li a:hover, .up-edit a:hover, .qq-upload-button:hover, button:not(.color-btn):hover, html input[type="button"]:hover, input[type="reset"]:hover, input[type="submit"]:hover {
    background: linear-gradient(to top, #216d48 0%, #185349 100%);
}
.header:before, .side-bt, .short-top, .comm-one {
    background: linear-gradient(to bottom, #1b482b 0%, #2d7c60 100%);
}


.header-menu > li > a:hover, .header-menu .menuactive > a, .hidden-menu a:hover {
    background-color: #122a29;
    border-radius: 15px;
}


.hidden-menu {
    background-color: #224c49;
    box-shadow: 3px 20px 20px 9px rgb(0 0 0 / 61%);
    border-radius: 15px;
}

.hidden-menu a {
    display: block;
    padding: 10px 20px;
    font-weight: 700;
    border: 2px solid #ffffff00;
}

.pagi-nav > span {
    display: inline-block;
    background: #392645;
    border-radius: 5px;
}

.decor, .side-box, .short, .pm-page, .search-page, .static-page, .tags-page, .form-wrap {
    background-color: #1e3c39;
    border-radius: 4px;
    box-shadow: 0 28px 20px 0px rgb(0 0 0 / 29%);
}

.fa-search:before {
    color: #2f6863;
}


    `);
})();