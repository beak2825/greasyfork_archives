// ==UserScript==
// @name         LOLZHelper
// @namespace    https://lolz.guru/
// @version      2.8.7
// @description  raysmorgan gde novie fichi
// @author       MaslovKK
// @license      GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @match        https://lolz.guru/*
// @match        https://zelenka.guru/*
// @icon         https://zelenka.guru/public/2017/og.png
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        window.close
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/jquery@2.1.4/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/440650/LOLZHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/440650/LOLZHelper.meta.js
// ==/UserScript==
(function () {
    'use strict';

    class Category {
        constructor(id, name, settings) {
            this.id = id;
            this.name = name;
            this.settings = settings
        }
    }

    class Font {
        constructor(name, family, url) {
            this.name = name;
            this.family = family;
            this.url = url;
        }
    }

    const Logos = {
        NONE: 'NONE',
        FBI: 'data:image/svg+xml,%0A%3Csvg width=\'460\' height=\'460\' viewBox=\'0 0 460 460\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath fill-rule=\'evenodd\' clip-rule=\'evenodd\' d=\'M276 235.785C249.513 214.27 218.905 202 186.281 202C137.749 202 93.6838 229.207 61 273.5C74.8004 292.205 90.6319 307.862 107.973 319.707L135.826 305.795C129.837 296.48 126.364 285.394 126.364 273.5C126.364 240.443 153.19 213.645 186.281 213.645C211.996 213.645 233.927 229.827 242.427 252.554L276 235.785ZM206.9 270.298C206.231 265.955 204.196 261.908 201.048 258.762C197.133 254.851 191.818 252.662 186.28 252.677V252.677C174.759 252.677 165.419 262.007 165.419 273.519C165.419 279.176 167.676 284.302 171.338 288.059L206.9 270.298ZM164.608 343.168H207.955C200.848 344.377 193.616 345 186.281 345C178.946 345 171.714 344.377 164.608 343.168Z\' fill=\'%232BAD72\'/%3E%3Cpath d=\'M276.277 236.275L276.939 237.6L279 236.574L277.212 235.126L276.277 236.275ZM60.8452 274L59.6497 273.124L59 274L59.6497 274.876L60.8452 274ZM107.912 320.219L107.074 321.447L107.795 321.934L108.576 321.546L107.912 320.219ZM135.822 306.304L136.486 307.631L137.965 306.896L137.072 305.508L135.822 306.304ZM242.637 253.048L241.246 253.567L241.824 255.111L243.301 254.371L242.637 253.048ZM201.175 259.258L202.225 258.215L201.175 259.258ZM207.038 270.797L207.703 272.124L208.671 271.637L208.506 270.569L207.038 270.797ZM186.377 253.171L186.374 251.69L183.009 251.699L185.283 254.172L186.377 253.171ZM186.377 253.172V254.655H189.754L187.473 252.171L186.377 253.172ZM171.405 288.563L170.342 289.6L171.099 290.371L172.07 289.89L171.405 288.563ZM164.661 343.686V342.205L164.412 345.149L164.661 343.686ZM208.095 343.686L208.345 345.149L208.095 342.205V343.686ZM186.378 203.962C218.677 203.962 249.023 216.085 275.343 237.424L277.212 235.126C250.45 213.425 219.459 201 186.378 201V203.962ZM62.0407 274.876C94.5941 230.839 138.346 203.962 186.378 203.962V201C137.151 201 92.5948 228.551 59.6497 273.124L62.0407 274.876ZM108.751 318.997C91.5299 307.254 75.7828 291.716 62.0407 273.124L59.6497 274.876C73.5639 293.703 89.5435 309.488 107.074 321.447L108.751 318.997ZM135.158 304.983L107.248 318.898L108.576 321.546L136.486 307.631L135.158 304.983ZM124.855 274C124.855 286.193 128.422 297.554 134.572 307.106L137.072 305.508C131.22 296.418 127.826 285.607 127.826 274H124.855ZM186.378 212.648C152.4 212.648 124.855 240.116 124.855 274H127.826C127.826 241.752 154.04 215.61 186.378 215.61V212.648ZM244.028 252.53C235.301 229.237 212.784 212.648 186.378 212.648V215.61C211.505 215.61 232.938 231.394 241.246 253.567L244.028 252.53ZM275.615 234.951L241.973 251.724L243.301 254.371L276.939 237.6L275.615 234.951ZM200.125 260.307C203.055 263.232 204.948 266.99 205.571 271.026L208.506 270.569C207.788 265.922 205.604 261.584 202.225 258.215L200.125 260.307ZM186.381 254.655C191.534 254.636 196.481 256.673 200.125 260.307L202.225 258.215C198.022 254.022 192.317 251.675 186.374 251.69L186.381 254.655ZM187.473 252.171L187.472 252.17L185.283 254.172L187.473 252.171ZM166.959 274.019C166.959 263.325 175.653 254.655 186.377 254.655V251.691C174.013 251.691 163.989 261.689 163.989 274.019H166.959ZM172.469 287.532C169.058 284.04 166.959 279.276 166.959 274.019H163.989C163.989 280.078 166.412 285.576 170.342 289.6L172.469 287.532ZM206.374 269.471L170.741 287.242L172.07 289.89L207.703 272.124L206.374 269.471ZM164.661 345.167H208.095V342.205H164.661V345.167ZM207.846 342.23C200.806 343.421 193.643 344.038 186.378 344.038V347C193.812 347 201.142 346.371 208.345 345.149L207.846 342.23ZM186.378 344.038C179.113 344.038 171.95 343.421 164.91 342.23L164.412 345.149C171.614 346.371 178.945 347 186.378 347V344.038Z\' fill=\'white\' fill-opacity=\'0.01\'/%3E%3Cpath d=\'M431 204L26 406H431V204Z\' fill=\'%232BAD72\' stroke=\'white\' stroke-opacity=\'0.01\' stroke-width=\'2.96786\' stroke-miterlimit=\'10\'/%3E%3Cpath d=\'M26 406H431V435H26V406Z\' fill=\'%232BAD72\' stroke=\'white\' stroke-opacity=\'0.01\' stroke-width=\'2.96786\' stroke-miterlimit=\'10\'/%3E%3Cpath d=\'M142.292 157H431V25L358.827 106.942V25L286.648 106.942V25L214.472 106.942V25L142.296 106.942V25L26 157H98.1761H142.292Z\' fill=\'%232BAD72\' stroke=\'white\' stroke-opacity=\'0.01\' stroke-width=\'2.96786\' stroke-miterlimit=\'10\'/%3E%3C/svg%3E%0A',
        OLD: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' version=\'1.1\' id=\'Слой_2\' x=\'0px\' y=\'0px\' viewBox=\'0 0 90 40\' style=\'enable-background:new 0 0 90 40;\' xml:space=\'preserve\'%3E%3Cstyle type=\'text/css\'%3E .st0%7Bfill-rule:evenodd;clip-rule:evenodd;fill:%2323A86D;%7D%0A%3C/style%3E%3Cpath class=\'st0\' d=\'M49,31V13h15.1l4-4H16v4h17L21,32h-8V9H9v27h59l-4-4H49V31 M26,32h19v-1V13h-7L26,32z\'/%3E%3C/svg%3E#svgView(viewBox(20,5,35,35))',
        XMAS: 'https://zelenka.guru/public/zelenka/256-christmas.svg',
        CUM: 'https://zelenka.guru/public/zelenka/64-christmas.svg',
        CUMALT: 'https://zelenka.guru/public/zelenka/64-christmas-v.2.svg'
    };

    const MarketLogos = {
        NONE: 'NONE',
        MARKET_OLD: 'https://zelenka.guru/styles/market/logo2.svg',
        MARKET_CLASSIC: 'https://zelenka.guru/styles/market/logo.png',
        MARKET_XMAS: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'88\' viewBox=\'0 0 536 88\' fill=\'none\'%3E%3Cscript xmlns=\'\' id=\'custom-useragent-string-page-script\'/%3E%3Cg clip-path=\'url(%23clip0_751_262)\'%3E%3Cpath d=\'M0 0C12.1752 22.6527 33.5667 29.3709 59.6633 29.8802C75.0643 30.1955 103.756 28.9586 103.756 37.0349C103.756 43.1225 86.5846 58.8872 86.5846 62.7678C86.5846 62.7678 102.155 49.8892 110.911 42.2737C119.642 34.6338 124.517 30.0985 124.517 25.5873C124.517 16.4195 88.2824 18.1173 59.0328 18.1173C29.7347 18.1173 13.7517 12.636 0 0ZM31.1171 67.5457C25.3933 67.5457 20.7367 72.1053 20.7367 77.7079C20.7367 83.3347 25.3691 87.87 31.1171 87.87C36.8652 87.87 41.4976 83.3104 41.4976 77.7079C41.4976 72.0811 36.8652 67.5457 31.1171 67.5457ZM72.6147 67.5457C66.8909 67.5457 62.2342 72.1053 62.2342 77.7079C62.2342 83.3347 66.8666 87.87 72.6147 87.87C78.3385 87.87 82.9951 83.3104 82.9951 77.7079C82.9951 72.0811 78.3627 67.5457 72.6147 67.5457Z\' fill=\'%2300BA78\'/%3E%3Cpath d=\'M226.357 70.6986H214.061L214.352 30.923L197.738 70.6986H185.951L169.192 30.923C169.386 56.1223 169.483 69.3647 169.483 70.6986H157.162V19.0146H175.91L191.941 56.9469L207.827 19.0146H226.357V70.6986ZM296.328 70.6986H281.825L277.435 60.9487H250.926L246.536 70.6986H232.396L257.377 18.9904H271.371L296.328 70.6986ZM273.263 51.8052L264.265 31.6021L255.122 51.8052H273.263V51.8052ZM358.878 70.6986H343.574L329.798 49.8892H315.003V70.6986H302.125V19.0146H337.704C341.367 19.0146 344.229 19.3299 346.266 19.9605C349.54 20.9306 352.087 22.7496 353.881 25.369C355.676 27.9641 356.598 30.9715 356.598 34.4398C356.598 36.9379 356.137 39.1934 355.215 41.255C354.148 43.7046 352.596 45.4751 350.607 46.5907C348.643 47.7064 346.169 48.5552 343.137 49.0888L358.878 70.6986ZM315.003 28.0854V40.7457H336.322C341.1 40.7457 343.501 38.6841 343.501 34.5853C343.501 30.2439 340.93 28.0611 335.813 28.0611H315.003V28.0854ZM425.914 70.6986H408.549L388.345 48.434L380.512 55.1764V70.6986H367.633V19.0146H380.512V41.643L405.711 19.0146H422.397L397.198 40.8427L425.914 70.6986ZM479.854 70.6986H430.207V19.0146H478.398V28.3037H443.182V39.9453H477.234V49.1616H443.182V61.458H479.878V70.6986H479.854ZM534.763 28.4492H515.652V70.6986H502.627V28.4492H483.443V18.9904H534.787V28.4492H534.763Z\' fill=\'%2300BA78\'/%3E%3Cpath d=\'M155.682 20.8095C155.294 20.4457 155.027 19.9364 154.857 19.4271C154.324 17.7051 154.809 15.8376 155.682 14.2611C156.046 13.582 156.531 12.9514 157.186 12.5634C157.841 12.1753 158.641 12.0783 159.417 12.0298C160.557 11.957 161.697 11.9813 162.812 12.1753C164.074 12.4178 165.262 12.9029 166.499 13.194C168.706 13.7275 171.01 13.6305 173.29 13.5335C174.43 13.485 175.594 13.4365 176.661 13.8245C178.577 14.5521 179.79 16.8077 179.305 18.8207C179.184 19.3058 178.965 19.7909 178.553 20.1062C178.286 20.3002 177.947 20.4215 177.631 20.4942C173.945 21.3431 170.234 18.942 166.475 19.2573C164.365 19.4271 162.473 20.47 160.557 21.2946C159.174 21.8767 156.798 21.8767 155.682 20.8095Z\' fill=\'white\'/%3E%3Cpath d=\'M258.613 20.3971C258.395 20.3971 258.177 20.4214 257.983 20.3001C257.789 20.2031 257.667 20.0333 257.57 19.8393C256.964 18.8449 256.527 17.705 256.552 16.5408C256.576 15.3767 257.134 14.1882 258.104 13.5577C259.098 12.9271 260.384 12.9513 261.548 13.1939C262.712 13.4364 263.852 13.8487 265.04 13.9215C266.787 14.0427 268.63 13.4364 270.255 14.067C271.395 14.5278 272.268 15.6192 272.413 16.8319C272.559 18.0445 271.953 19.3542 270.91 19.9848C270.255 20.3729 269.455 20.5184 268.775 20.8579C267.999 21.246 267.199 21.9978 266.253 21.731C265.647 21.5613 265.453 21.0034 264.992 20.6396C264.167 20.0091 263.1 20.1788 262.13 20.2273C260.942 20.3001 259.777 20.3486 258.613 20.3971Z\' fill=\'white\'/%3E%3Cpath d=\'M255.824 53.1392C255.266 52.8482 254.684 52.3631 254.684 51.7083C254.684 51.2232 255.023 50.7866 255.435 50.5684C255.848 50.3501 256.357 50.3016 256.842 50.3016C258.928 50.3743 260.989 51.5385 263.027 51.0534C264.312 50.7624 265.355 49.8408 266.616 49.4284C268.411 48.8464 270.327 49.4042 272.122 49.9378C272.534 50.059 272.946 50.1803 273.286 50.4471C273.626 50.6896 273.892 51.1019 273.868 51.5142C273.844 51.9508 273.48 52.3389 273.068 52.5086C272.655 52.6784 272.195 52.7027 271.758 52.7027C270.812 52.7027 269.793 52.6056 268.92 52.9694C268.314 53.2362 267.805 53.7213 267.223 53.9881C266.349 54.4004 265.307 54.3276 264.361 54.1336C263.415 53.9396 262.493 53.6 261.523 53.503C259.534 53.309 257.74 54.1094 255.824 53.1392Z\' fill=\'white\'/%3E%3Cpath d=\'M301.954 21.0278C300.838 20.0334 300.547 18.4084 300.693 16.9289C301.008 13.8973 303.021 11.1324 305.81 9.89546C308.6 8.65853 312.019 9.04659 314.445 10.8656C315.415 11.5689 316.215 12.4906 317.258 13.0969C319.708 14.5521 322.788 14.067 325.601 13.6547C329.021 13.1454 332.586 12.7816 335.885 13.8003C337.364 14.2368 338.747 14.9402 340.202 15.3767C342.36 15.9831 344.616 16.0073 346.847 16.1528C349.078 16.2984 351.383 16.6136 353.299 17.7536C355.215 18.8935 356.694 21.052 356.427 23.2591C356.354 23.9139 356.112 24.5445 355.7 25.0538C354.875 26.0725 353.493 26.3878 352.183 26.4605C347.793 26.7031 343.646 24.6415 339.304 23.8169C336.006 23.1863 332.562 23.3076 329.312 24.1322C328.221 24.399 327.178 24.7628 326.062 24.9568C320.653 25.9027 315.342 22.871 309.861 22.7255C308.406 22.677 307.241 22.5315 305.859 22.2162C304.476 21.8766 303.118 22.0707 301.954 21.0278Z\' fill=\'white\'/%3E%3Cpath d=\'M343.186 34.9249C342.215 35.4585 342.555 37.035 341.852 37.9081C341.391 38.4902 340.542 38.6114 339.79 38.5629C338.238 38.4659 336.661 37.8353 335.182 38.2719C334.406 38.5144 333.751 38.9995 332.999 39.2905C332.247 39.5816 331.423 39.6301 330.647 39.4603C329.773 39.2663 328.997 38.8054 328.149 38.5387C327.154 38.2234 326.087 38.2234 325.044 38.1991C322.983 38.1749 320.897 38.1506 318.835 38.1264C318.471 38.1264 318.083 38.1264 317.744 38.2719C317.234 38.5144 316.895 39.0722 316.337 39.2178C316.07 39.2905 315.804 39.2178 315.537 39.2663C314.955 39.339 314.445 39.8969 314.47 40.5032C314.47 41.2308 315.149 41.8371 315.852 42.0312C316.58 42.2009 317.331 42.0797 318.059 41.9584C321.115 41.4491 324.341 41.2065 327.3 42.1282C328.803 42.589 330.234 43.3651 331.811 43.4621C334.333 43.6319 336.686 42.1039 339.232 41.8856C340.663 41.7644 342.143 42.0554 343.477 41.4976C345.029 40.8427 345.781 39.0965 345.853 37.4958C345.878 36.3559 344.544 34.1731 343.186 34.9249Z\' fill=\'white\'/%3E%3Cpath d=\'M367.753 22.4587C366.759 22.1434 365.934 21.2945 365.789 20.2516C365.643 19.1602 366.274 18.0688 367.122 17.3897C368.238 16.4923 369.79 16.1285 371.197 16.4438C371.852 16.5894 372.458 16.8561 373.089 17.0502C374.301 17.3897 375.563 17.3655 376.824 17.2442C378.085 17.1229 379.419 16.9532 380.51 17.5837C381.335 18.0688 381.893 19.0147 381.869 19.9848C381.844 20.955 381.286 21.8766 380.438 22.3374C380.001 22.5799 379.492 22.677 379.007 22.7982C377.285 23.1863 374.811 24.3747 373.259 23.259C372.507 22.7255 371.876 22.5557 370.93 22.5799C370.639 22.5799 367.753 22.7982 367.753 22.4587Z\' fill=\'white\'/%3E%3Cpath d=\'M404.982 22.386C403.358 22.0707 401.733 20.8823 401.636 19.2573C401.611 18.8207 401.684 18.3842 401.805 17.9718C401.975 17.414 402.242 16.8562 402.63 16.4196C403.479 15.5223 404.813 15.2555 406.05 15.3767C407.287 15.4738 408.451 15.9103 409.663 16.1528C411.579 16.5409 413.592 16.4681 415.46 15.9588C416.357 15.7163 417.23 15.3767 418.152 15.1827C419.074 15.0129 420.068 15.0129 420.893 15.4252C421.984 15.9831 422.639 17.2685 422.518 18.4812C422.396 19.6938 421.523 20.8095 420.408 21.2703C419.535 21.6341 418.564 21.6584 417.691 21.9737C416.576 22.3617 415.605 22.9923 414.369 23.0166C413.617 23.0408 412.986 22.7498 412.283 22.5557C409.882 21.8766 407.408 22.8468 404.982 22.386Z\' fill=\'white\'/%3E%3Cpath d=\'M438.914 22.5557C437.24 22.9923 435.445 22.8953 433.845 22.2404C432.583 21.7311 431.347 20.7125 431.177 19.3543C431.056 18.3841 431.541 17.3898 432.268 16.7349C432.996 16.0801 433.966 15.7163 434.936 15.5222C437.361 15.0372 439.884 15.595 442.333 15.498C443.837 15.4252 445.341 15.1099 446.844 15.0372C448.542 14.9402 450.24 15.1342 451.913 14.8917C454.363 14.5279 456.691 13.2182 459.165 13.3394C461.227 13.4607 463.143 14.5764 465.204 14.7461C466.635 14.8674 468.066 14.5279 469.473 14.7946C470.152 14.9159 470.807 15.1827 471.486 15.3525C472.941 15.7163 474.469 15.6193 475.949 15.8618C477.428 16.1043 478.98 16.8562 479.514 18.2629C480.193 20.0091 478.907 22.0222 477.185 22.774C475.488 23.5259 473.499 23.3076 471.68 22.9438C469.861 22.5557 468.018 22.0464 466.15 22.1919C464.671 22.3132 463.264 22.8953 461.785 23.0408C459.505 23.2591 457.273 22.5072 454.994 22.2404C452.059 21.9009 449.076 22.4345 446.141 21.9979C445.074 21.8281 444.031 21.2703 442.964 21.3673C441.606 21.4158 440.296 22.1919 438.914 22.5557Z\' fill=\'white\'/%3E%3Cpath d=\'M442.672 38.4902C442.914 37.1078 444.515 36.0406 445.8 36.5984C446.552 36.9137 447.061 37.6898 447.813 38.0536C449.171 38.7085 450.796 37.8596 452.252 38.1992C453.149 38.3932 453.974 39.048 454.895 39.048C455.55 39.048 456.156 38.7327 456.763 38.4659C458.339 37.7869 460.086 37.4958 461.783 37.6656C462.972 37.7626 464.16 38.1021 465.373 37.9809C466.173 37.9081 466.949 37.6656 467.725 37.423C469.544 36.8895 471.436 36.4529 473.328 36.6954C475.22 36.938 477.087 37.9324 477.936 39.6059C478.373 40.4305 478.47 41.5461 477.863 42.2495C477.451 42.7103 476.772 42.8801 476.141 42.8801C475.511 42.8558 474.904 42.686 474.298 42.5648C473.013 42.3222 471.703 42.298 470.393 42.298C469.375 42.298 468.332 42.2737 467.313 42.4435C465.931 42.6618 464.621 43.1954 463.238 43.4136C460.231 43.923 457.175 42.9771 454.143 43.0256C452.858 43.0498 451.573 43.2439 450.311 43.2681C448.614 43.3166 446.358 43.2439 444.782 42.4678C443.423 41.8372 442.405 39.9211 442.672 38.4902Z\' fill=\'white\'/%3E%3Cpath d=\'M484.315 21.4158C483.272 20.5427 482.351 19.136 482.909 17.9233C483.394 16.8804 484.728 16.5894 485.867 16.6136C487.905 16.6864 489.869 17.4625 491.882 17.8505C497.533 18.9419 503.306 16.8804 509.078 17.0502C510.509 17.0987 511.988 17.2684 513.371 16.8319C514.972 16.3468 516.208 15.1342 517.591 14.1883C519.871 12.6361 522.66 11.7629 525.4 12.054C528.044 12.345 530.494 13.7032 532.531 15.4494C533.283 16.08 533.986 16.8076 534.374 17.705C534.762 18.6024 534.762 19.718 534.18 20.5184C533.428 21.5128 531.997 21.6583 530.736 21.6826C525.958 21.7311 521.059 21.1005 516.475 22.3859C514.123 23.0408 511.94 24.1564 509.587 24.8113C507.744 25.2963 505.828 25.4904 503.936 25.3691C502.093 25.2478 500.25 24.8113 498.431 24.5202C495.545 24.0594 492.731 24.2777 489.845 24.0594C487.856 23.8896 485.795 22.6527 484.315 21.4158Z\' fill=\'white\'/%3E%3Cpath d=\'M259.923 27.5033C260.994 27.5033 261.863 26.6347 261.863 25.5631C261.863 24.4915 260.994 23.6228 259.923 23.6228C258.851 23.6228 257.982 24.4915 257.982 25.5631C257.982 26.6347 258.851 27.5033 259.923 27.5033Z\' fill=\'white\'/%3E%3Cpath d=\'M322.181 28.2796C323.681 28.2796 324.898 27.0634 324.898 25.5632C324.898 24.063 323.681 22.8468 322.181 22.8468C320.681 22.8468 319.465 24.063 319.465 25.5632C319.465 27.0634 320.681 28.2796 322.181 28.2796Z\' fill=\'white\'/%3E%3Cpath d=\'M336.685 35.0219C337.516 35.0219 338.189 34.3487 338.189 33.5182C338.189 32.6878 337.516 32.0145 336.685 32.0145C335.855 32.0145 335.182 32.6878 335.182 33.5182C335.182 34.3487 335.855 35.0219 336.685 35.0219Z\' fill=\'white\'/%3E%3Cpath d=\'M322.181 37.8353C322.904 37.8353 323.49 37.2489 323.49 36.5256C323.49 35.8023 322.904 35.2159 322.181 35.2159C321.457 35.2159 320.871 35.8023 320.871 36.5256C320.871 37.2489 321.457 37.8353 322.181 37.8353Z\' fill=\'white\'/%3E%3Cpath d=\'M405.491 32.0145C406.215 32.0145 406.801 31.4281 406.801 30.7048C406.801 29.9815 406.215 29.3951 405.491 29.3951C404.768 29.3951 404.182 29.9815 404.182 30.7048C404.182 31.4281 404.768 32.0145 405.491 32.0145Z\' fill=\'white\'/%3E%3Cpath d=\'M410.052 41.3036C410.775 41.3036 411.362 40.7172 411.362 39.9939C411.362 39.2706 410.775 38.6842 410.052 38.6842C409.329 38.6842 408.742 39.2706 408.742 39.9939C408.742 40.7172 409.329 41.3036 410.052 41.3036Z\' fill=\'white\'/%3E%3Cpath d=\'M473.426 28.7888C474.484 28.7888 475.342 27.931 475.342 26.8728C475.342 25.8146 474.484 24.9568 473.426 24.9568C472.368 24.9568 471.51 25.8146 471.51 26.8728C471.51 27.931 472.368 28.7888 473.426 28.7888Z\' fill=\'white\'/%3E%3Cpath d=\'M467.41 33.3484C468.08 33.3484 468.623 32.8055 468.623 32.1358C468.623 31.466 468.08 30.9231 467.41 30.9231C466.74 30.9231 466.197 31.466 466.197 32.1358C466.197 32.8055 466.74 33.3484 467.41 33.3484Z\' fill=\'white\'/%3E%3Cpath d=\'M269.017 35.0463C269.526 35.0463 269.939 34.6336 269.939 34.1246C269.939 33.6156 269.526 33.203 269.017 33.203C268.508 33.203 268.096 33.6156 268.096 34.1246C268.096 34.6336 268.508 35.0463 269.017 35.0463Z\' fill=\'white\'/%3E%3Cpath d=\'M271.612 43.7289C272.336 43.7289 272.922 43.1425 272.922 42.4192C272.922 41.6959 272.336 41.1095 271.612 41.1095C270.889 41.1095 270.303 41.6959 270.303 42.4192C270.303 43.1425 270.889 43.7289 271.612 43.7289Z\' fill=\'white\'/%3E%3Cpath d=\'M257.982 47.949C258.839 47.949 259.534 47.2541 259.534 46.3968C259.534 45.5396 258.839 44.8446 257.982 44.8446C257.125 44.8446 256.43 45.5396 256.43 46.3968C256.43 47.2541 257.125 47.949 257.982 47.949Z\' fill=\'white\'/%3E%3Cpath d=\'M205.062 16.0558C205.062 16.0558 213.817 4.41417 232.395 6.57272C241.175 8.22195 244.667 17.4382 244.667 17.4382C244.667 17.4382 247.505 25.8784 247.02 35.5555C246.777 39.3633 246.777 48.2643 246.777 48.2643C246.777 48.2643 247.02 51.296 244.57 51.4173C242.097 51.5385 241.587 48.8221 241.587 48.8221C241.587 48.8221 239.695 37.8111 238.604 35.9193C237.537 34.0276 236.906 30.4866 236.906 30.4866C236.906 30.4866 235 34.5 234.602 36.7925C232.128 33.591 204.868 21.5613 205.062 16.0558Z\' fill=\'%23ED1414\'/%3E%3Cpath opacity=\'0.19\' d=\'M211.271 19.0147C211.271 19.0147 210.18 8.61002 229.607 6.79102C222.646 6.79102 215.807 8.56151 215.807 8.56151L208.094 13.0484L205.184 16.0558L211.271 19.0147Z\' fill=\'%23F3EDED\'/%3E%3Cpath d=\'M205.062 16.0558C205.062 16.0558 213.817 4.41417 232.395 6.57272C241.175 8.22195 244.667 17.4382 244.667 17.4382C244.667 17.4382 247.505 25.8784 247.02 35.5555C246.777 39.3633 246.777 48.2643 246.777 48.2643C246.777 48.2643 247.02 51.296 244.57 51.4173C242.097 51.5385 241.587 48.8221 241.587 48.8221C241.587 48.8221 239.695 37.8111 238.604 35.9193C237.537 34.0276 236.906 30.4866 236.906 30.4866C236.906 30.4866 235 34.5 234.602 36.7925C232.128 33.591 204.868 21.5613 205.062 16.0558Z\' stroke=\'%235C0F0E\' stroke-width=\'1.5\' stroke-miterlimit=\'10\'/%3E%3Cpath d=\'M231.814 42.298C230.99 42.395 230.117 42.0797 229.171 41.7159C226.042 40.4548 223.035 38.7813 220.124 37.0835C218.887 36.3559 217.626 35.6041 216.462 34.731C213.503 32.5724 210.568 30.4139 207.464 28.4493C206.47 27.8188 205.475 27.1882 204.408 26.6788C203.195 26.0968 201.789 25.83 200.624 25.1266C199.63 24.5445 198.854 23.4289 198.563 22.3132C198.272 21.2218 198.539 20.1789 199.169 19.2573C199.703 18.4569 200.43 17.7293 201.207 17.1473C202.589 16.1044 204.287 15.7163 205.912 16.3711C210.35 18.1416 219.906 23.8412 220.585 24.2778C221.264 24.7143 229.268 30.5351 231.839 32.9362C233.609 34.5854 235.38 36.7197 234.555 39.2421C234.337 39.8969 234.07 40.5518 233.658 41.1096C233.1 41.8857 232.469 42.2253 231.814 42.298Z\' fill=\'white\'/%3E%3Cpath d=\'M244.571 51.49C243.989 51.5627 243.431 51.7567 242.898 52.0478C242.073 52.4843 241.394 53.1149 240.958 53.9395C240.691 54.4246 240.545 54.9824 240.473 55.516C240.303 56.9227 240.836 58.2324 241.855 59.2025C242.849 60.1484 244.062 60.6577 245.444 60.779C247.506 60.9488 249.64 60.2454 250.077 57.9899C250.271 56.9712 250.295 55.8798 250.028 54.8612C249.81 54.0123 249.349 53.2362 248.694 52.6541C247.676 51.7567 246.172 51.3687 244.838 51.4657C244.741 51.4657 244.644 51.4657 244.571 51.49Z\' fill=\'%23F3EDED\' stroke=\'%235A0E0B\' stroke-width=\'1.5\' stroke-miterlimit=\'10\'/%3E%3Cpath opacity=\'0.09\' d=\'M239.477 23.1378C239.283 23.4289 239.186 23.7684 239.089 24.108C238.604 25.6845 237.852 27.1882 236.882 28.5464C236.785 28.1098 236.64 27.649 236.47 27.2367C236.324 26.8486 236.082 26.4363 235.67 26.3635C235.209 26.315 234.845 26.7516 234.7 27.2124C234.481 27.8915 234.578 28.6434 234.53 29.3467C234.457 30.5594 234.02 31.7478 233.584 32.8877C233.196 33.8821 232.808 34.9007 232.444 35.8951C232.371 36.1134 232.274 36.3559 232.104 36.5015C231.91 36.6712 231.668 36.744 231.401 36.7683C228.854 37.1806 226.381 35.7254 223.834 35.4586C223.858 35.8466 224.149 36.1619 224.44 36.4045C225.338 37.1806 226.453 37.6171 227.472 38.1992C228.491 38.7813 229.485 39.5816 229.825 40.7216C229.994 41.2551 230.067 41.9342 230.601 42.1283C230.746 42.1768 230.916 42.1768 231.086 42.1768C231.595 42.1525 232.129 42.104 232.614 41.91C233.341 41.6189 233.923 40.9883 234.239 40.2607C234.554 39.5331 234.675 38.7328 234.651 37.9567C234.627 37.3988 234.554 36.8653 234.602 36.3074C234.627 35.7496 234.772 35.1918 234.966 34.6582C235.257 33.7366 235.645 32.8392 236.082 31.9661C236.276 31.6023 236.47 31.2385 236.785 30.9474C237.125 30.6079 237.586 30.3896 237.974 30.0986C238.992 29.3952 239.696 28.2796 240.108 27.1397C240.52 26.024 240.714 24.8113 240.957 23.6472C241.127 22.6043 240.06 22.2647 239.477 23.1378Z\' fill=\'black\'/%3E%3Cpath d=\'M231.814 42.298C230.99 42.395 230.117 42.0797 229.171 41.7159C226.042 40.4548 223.035 38.7813 220.124 37.0835C218.887 36.3559 217.626 35.6041 216.462 34.731C213.503 32.5724 210.568 30.4139 207.464 28.4493C206.47 27.8188 205.475 27.1882 204.408 26.6788C203.195 26.0968 201.789 25.83 200.624 25.1266C199.63 24.5445 198.854 23.4289 198.563 22.3132C198.272 21.2218 198.539 20.1789 199.169 19.2573C199.703 18.4569 200.43 17.7293 201.207 17.1473C202.589 16.1044 204.287 15.7163 205.912 16.3711C210.35 18.1416 219.906 23.8412 220.585 24.2778C221.264 24.7143 229.268 30.5351 231.839 32.9362C233.609 34.5854 235.38 36.7197 234.555 39.2421C234.337 39.8969 234.07 40.5518 233.658 41.1096C233.1 41.8857 232.469 42.2253 231.814 42.298Z\' stroke=\'%235C0F0E\' stroke-width=\'1.5\' stroke-miterlimit=\'10\'/%3E%3Cpath d=\'M236.324 31.6023C236.324 31.6023 237.342 30.4624 236.105 26.1453\' stroke=\'%235C0F0E\' stroke-width=\'1.5\' stroke-miterlimit=\'10\'/%3E%3Cpath d=\'M236.906 30.8504C236.906 30.8504 240.787 29.2739 240.932 22.6527\' stroke=\'%235C0F0E\' stroke-width=\'1.5\' stroke-miterlimit=\'10\'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id=\'clip0_751_262\'%3E%3Crect width=\'536\' height=\'87.7973\' fill=\'white\'/%3E%3C/clipPath%3E%3C/defs%3E%3Cstyle xmlns=\'http://www.w3.org/1999/xhtml\' id=\'lci5ca04.eea\'%3E.xenOverlay .lhmodal %7Bpadding: 15px; border-radius: 0 0 15px 15px; border-style: solid; border-width: 1px; backdrop-filter: blur(15px) brightness(.9);%7D%3C/style%3E%3Cstyle xmlns=\'http://www.w3.org/1999/xhtml\' id=\'lcid14tk.whg\'%3E%23font_select %7Bscrollbar-width: none%7D %23font_select::-webkit-scrollbar %7Bdisplay: none%7D%3C/style%3E%3Cstyle xmlns=\'http://www.w3.org/1999/xhtml\' id=\'lci9gl2p.zxh\'%3E.actionButton--sendMoney.red %7Bbackground-color: rgb(136,68,68); border-left-color: rgb(76,18,18); background-image: unset; line-height: 34px; font-size: 14px;%7D%0A.actionButton--sendMoney.red:hover %7Bbackground-color: rgb(234,76,76); text-decoration: none%7D%3C/style%3E%3Cstyle xmlns=\'http://www.w3.org/1999/xhtml\' id=\'lci4tled.zfg\'%3E%23keyinput %7Bwidth: 50px;text-align: center;background: %23363636;border: none;color: white;font-weight: bold;border-radius: 5px;pointer-events: none;caret-color: transparent;%7D%0A%23keyinput:focus %7Bbackground: %23505050%7D%3C/style%3E%3Cstyle xmlns=\'http://www.w3.org/1999/xhtml\' id=\'lci8kgyy.38g\'%3E.redactor_btn_container_outdent,.redactor_btn_container_indent,.redactor_btn_container_unlink,.redactor_btn_container_fontfamily,.redactor_btn_container_underline %7Bdisplay:unset !important%7D%3C/style%3E%3Cstyle xmlns=\'http://www.w3.org/1999/xhtml\' id=\'lcibl3fu.vaq\'%3E@import url(\'https://fonts.googleapis.com/css2%3Ffamily=Montserrat&amp;display=swap\');%3C/style%3E%3Cstyle xmlns=\'http://www.w3.org/1999/xhtml\' id=\'lci894x7.go8\'%3Ebody %7Bfont-family: \'Montserrat\', sans-serif%7D%3C/style%3E%3Cstyle xmlns=\'http://www.w3.org/1999/xhtml\' id=\'lcicg0pp.y1\'%3E@import url(\'https://fonts.googleapis.com/css2%3Ffamily=Ubuntu&amp;display=swap\');%3C/style%3E%3Cstyle xmlns=\'http://www.w3.org/1999/xhtml\' id=\'lcidx4gm.xrn\'%3E@import url(\'https://fonts.googleapis.com/css2%3Ffamily=JetBrains+Mono&amp;display=swap\');%3C/style%3E%3Cstyle xmlns=\'http://www.w3.org/1999/xhtml\' id=\'lci65ryb.3j7\'%3E@import url(\'https://fonts.googleapis.com/css2%3Ffamily=Google+Sans&amp;display=swap\');%3C/style%3E%3Cstyle xmlns=\'http://www.w3.org/1999/xhtml\' id=\'lci2yd4q.1x\'%3E.text_Ads, .Alert%5Bdata-author=\'Реклама\'%5D, .notice_34, .monthMaecenas--quote %7Bdisplay: none%7D%3C/style%3E%3Cstyle xmlns=\'http://www.w3.org/1999/xhtml\' id=\'lcide7rf.cy\'%3E.cb-avatar %7Bdisplay: none%7D%0A.cb-msg-block %7Bbackground: none; display: contents%7D%0A.cb-msg-info .username %7Bpadding-left: 5px%7D%0A.cb-msg-info %7Bdisplay: contents%7D%0A.cb-message %7Bpadding: 0 !important%7D; %23chatbox li %7Bpadding: 0 !important%7D%0A.MessageTime %7Bposition: absolute; right: 0%7D%3C/style%3E%3C/svg%3E'
    }

    const SETTING_STRINGS = {
        id: "Отображение дополнительной информации",
        contestUpper: "Блок розыгрыша над сообщением",
        nokid: "Отключение стуков при банвордах",
        adblock: "Скрытие рекламы",
        nomirror: "Предотвращать переход на зеркало",
        old_chat: "Старый дизайн чата",
        btnpc: "Участие по кнопке: ",
        closepc: "Закрывать вкладку розыгрыша после участия по кнопке",
        bypassbw: "Обход цензуры при публикации сообщений",
        hideignored: "Скрыть блок \"Вы игнорируете аккаунты...\""
    }

    const CATEGORIES = [
        new Category('main', 'Основные', ['btnpc', 'closepc', 'id', 'contestUpper', 'bypassbw']),
        new Category('market', 'Маркет', ['hideignored']),
        new Category('appearance', 'Внешний вид', ['logo', 'marketlogo', 'font', 'adblock', 'old_chat']),
        new Category('misc', 'Прочее', ['nokid', 'nomirror'])]

    const DEFAULT_SETTINGS = {
        id: true,
        contestUpper: true,
        nokid: true,
        adblock: true,
        logo: Logos.NONE,
        marketlogo: MarketLogos.NONE,
        nomirror: true,
        font: 'NONE',
        old_chat: false,
        btnpc: 'TAB',
        closepc: false,
        bypassbw: true,
        hideignored: false
    };

    const FONTS = [
        new Font('Montserrat', "'Montserrat', sans-serif", 'https://fonts.googleapis.com/css2?family=Montserrat&display=swap'),
        new Font('Ubuntu', "'Ubuntu', sans-serif", 'https://fonts.googleapis.com/css2?family=Ubuntu&display=swap'),
        new Font('JetBrains Mono', "'JetBrains Mono', monospace", 'https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap'),
        new Font('Google Sans', "'Google Sans', sans-serif", 'https://fonts.googleapis.com/css2?family=Google+Sans&display=swap')
    ];

    let storageJSON = {};

    function saveSettings() {
        GM_setValue('lolzhelper', JSON.stringify(storageJSON));
    }

    if (!GM_getValue('lolzhelper')) {
        storageJSON.settings = DEFAULT_SETTINGS;
    } else {
        storageJSON = JSON.parse(GM_getValue('lolzhelper'));
        let currentSettings = storageJSON.settings;
        if (Object.keys(currentSettings).length !== Object.keys(DEFAULT_SETTINGS).length) {
            Object.keys(DEFAULT_SETTINGS).forEach(function (e) {
                if (!currentSettings.hasOwnProperty(e)) {
                    currentSettings[e] = DEFAULT_SETTINGS[e];
                }
            });
            storageJSON.settings = currentSettings;
            saveSettings();
        }
    }

    if (location.hash.startsWith('#access_token=')) {
        storageJSON.api = location.hash.match(/access_token=([a-zA-Z\d]+)&/)[1]
        storageJSON.tokenexpire = Math.trunc(+new Date() / 1000) + 15552000;
        saveSettings();
    }

    if ((!storageJSON.api || Math.trunc(+new Date() / 1000) >= storageJSON.tokenexpire) && !location.pathname.startsWith('/account/authorize')) {
        if (location.host === 'zelenka.guru') {
            location.href = "/account/authorize?client_id=0wk5apc3k0&response_type=token&scope=read"
        } else {
            location.href = "/account/authorize?client_id=l2cdsrzb84&response_type=token&scope=read"
        }
    }

    function APIRequest(url) {
        return new Promise(resolve => {
            let token = storageJSON.api;
            $.ajax({
                url: "https://api.zelenka.guru/" + url,
                headers: {"Authorization": "Bearer " + token},
                async: false,
                success: function (result) {
                    resolve(result)
                },
                error: function () {
                    resolve(null)
                    XenForo.alert('Вы слишком часто отправляете запросы к API, попробуйте позже', '', 2500)
                }
            });
        });
    }

    function openSettings() {
        const form = $(`<form class="settingsform" style="display: flex;flex-direction: column;flex-wrap: wrap;gap: 15px;"></form>`);
        const radio = $(`<div class="radio-group catradio" style="margin: 0 auto"></div>`).appendTo(form)
        CATEGORIES.forEach(function (current) {
            const category = $(`<input type="radio" name="category" id="${current.id}">`).appendTo(radio)
            $(`<label style="${$(document).width() <= 580 ? 'padding: 0 2vw' : ''}" for="${current.id}">${current.name}</label>`).insertAfter(category)
            if (current.id === 'main')
                category.attr('checked', '')
            const content = $(`<div style="all: inherit;${current.id !== 'main' ? 'display: none' : ''}" class="catdiv" id="${current.id}"></div>`).appendTo(form)
            current.settings.forEach(function (setting) {
                if (typeof DEFAULT_SETTINGS[setting] === "boolean") {
                    content.append($(`<label><input type="checkbox" name="${setting}" ${storageJSON.settings[setting] ? 'checked' : ''}>${SETTING_STRINGS[setting]}</label>`));
                    return
                }
                switch (setting) {
                    case 'btnpc':
                        $(`<label style="user-select: none">${SETTING_STRINGS[setting]}<input name="${setting}" id="keyinput" value="${storageJSON.settings[setting]}" readonly></label>`).appendTo(content)
                        break;
                    case 'font':
                        const fontchosen = $(`<label style="display: inline-flex; align-items: center"><span style="width: 55px">Шрифт:</span><div class="controlGroup select-wrapper"><select style="overflow-y: auto;" name="font" id="font_select" data-default-value="${storageJSON.settings.font}" class="ctrlOrder textCtrl extraLarge">
                            <option value="NONE" ${storageJSON.settings.font === 'NONE' ? 'selected' : ''}>По умолчанию</option>
                            </select></div></label>`).appendTo(content);
                        FONTS.forEach(function (e) {
                            fontchosen.find('#font_select').append($(`<option value='${e.name}' style="font-family: ${XenForo.htmlspecialchars(e.family)}" ${storageJSON.settings.font === e.name ? 'selected' : ''}>${e.name}</option>`));
                        });
                        if (window.hasOwnProperty('queryLocalFonts')) {
                            queryLocalFonts.call().then(function (e) {
                                e.forEach(function (e) {
                                    if (!FONTS.map(e => {
                                        return e.name
                                    }).includes(e.family)) {
                                        $('#font_select').append($(`<option value='${e.family}' style="font-family: ${XenForo.htmlspecialchars(e.family)}" ${storageJSON.settings.font === e.family ? 'selected' : ''}>${e.fullName}</option>`));
                                    }
                                });
                            });
                        }
                }
                if ($(document).width() > 580) {
                    switch (setting) {
                        case 'logo':
                            const logoradio = $(`<div class="radio-group" style="display: flex;width: fit-content;margin: 0 auto;"></div>`).appendTo(content);
                            for (const [key, value] of Object.entries(Logos)) {
                                logoradio.append(`<input type="radio" name="logo" id="${key}" ${storageJSON.settings['logo'] === key ? 'checked' : ''}><label for="${key}">${value !== 'NONE' ? `<img style="height: 100%;max-width: 140px" src="${XenForo.htmlspecialchars(value)}">` : 'Default'}</label>`) // текст не влезал))
                            }
                            break;
                        case 'marketlogo':
                            const mlogoradio = $(`<div class="radio-group" style="display: flex;width: fit-content;margin: 0 auto;"></div>`).appendTo(content);
                            for (const [key, value] of Object.entries(MarketLogos)) {
                                mlogoradio.append(`<input type="radio" name="marketlogo" id="${key}" ${storageJSON.settings['marketlogo'] === key ? 'checked' : ''}><label for="${key}">${value !== 'NONE' ? `<img style="height: 100%;max-width: 140px" src="${XenForo.htmlspecialchars(value)}">` : 'Default'}</label>`)
                            }
                            break;
                    }
                }
            });
        });
        form.append($('<button type="submit" class="primary button" style="width: 120px; margin-left: auto">Применить</button>'))
        const overlay = XenForo.createOverlay(null, '<h2 class="heading lhmodal" style="border-radius: 15px 15px 0 0;border-bottom-style: none;">' + 'Настройки LOLZHELPER' + '</h2><div class="baseHtml lhmodal">' + form.prop('outerHTML') + '</div>', {
            onBeforeLoad: function () {
                this.trigger.find('.OverlayCloser').css('z-index', 1);
                this.trigger.find('.chosen-container, .chosen-drop').css('width', 'auto');
                this.trigger.find('.chosen-results').css('margin-left', 0);
            },
            onLoad: function () {
                XenForo.Tooltip($('.settingsform .tooltip'));
                $('.settingsform .catradio input').change(function () {
                    $('.catdiv').hide();
                    $(`.catdiv[id="${this.id}"]`).show();
                });
                $('.settingsform #keyinput').on('keydown', function (e) {
                    e.preventDefault()
                    $(this).val(e.key.toUpperCase())
                });
                $('.settingsform').submit(function (e) {
                    e.preventDefault();
                    $('.settingsform :checkbox').each(function () {
                        storageJSON.settings[$(this).attr('name')] = this.checked;
                    });
                    storageJSON.settings.logo = $('.settingsform input[name="logo"]:checked').attr('id');
                    storageJSON.settings.marketlogo = $('.settingsform input[name="marketlogo"]:checked').attr('id');
                    storageJSON.settings.font = $('.settingsform #font_select option:selected').val();
                    storageJSON.settings.btnpc = $('.settingsform #keyinput').val();
                    saveSettings();
                    overlay.close();
                    location.reload();
                });
            },
            onBeforeClose: function () {
                this.trigger.parent('.modal').remove();
            }
        }).load();
    }

    function initStyles() {
        GM_addStyle('.xenOverlay .lhmodal {padding: 15px; border-radius: 0 0 15px 15px; border-style: solid; border-width: 1px; backdrop-filter: blur(15px) brightness(.9);}');
        GM_addStyle('#font_select {scrollbar-width: none} #font_select::-webkit-scrollbar {display: none}');
        GM_addStyle('.actionButton--sendMoney.red {background-color: rgb(136,68,68); border-left-color: rgb(76,18,18); background-image: unset; line-height: 34px; font-size: 14px;}\n.actionButton--sendMoney.red:hover {background-color: rgb(234,76,76); text-decoration: none}')
        GM_addStyle('#keyinput {width: 50px;text-align: center;background: #363636;border: none;color: white;font-weight: bold;border-radius: 5px;pointer-events: none;caret-color: transparent;}\n#keyinput:focus {background: #505050}')
        if (storageJSON.settings.id)
            GM_addStyle('.redactor_btn_container_outdent,.redactor_btn_container_indent,.redactor_btn_container_unlink,.redactor_btn_container_fontfamily,.redactor_btn_container_underline {display:unset !important}')
        FONTS.forEach(function (e) {
            GM_addStyle(`@import url('${e.url}');`)
            if (e.name === storageJSON.settings.font) {
                GM_addStyle(`body {font-family: ${e.family}}`);
            }
        })
        if (!FONTS.map((e) => {
            return e.name
        }).includes(storageJSON.settings.font) && storageJSON.settings.font !== "NONE") {
            GM_addStyle(`body {font-family: ${storageJSON.settings.font}}`);
        }
        if (storageJSON.settings.adblock) {
            GM_addStyle('.text_Ads, .Alert[data-author="Реклама"], .notice_34, .monthMaecenas--quote {display: none}')
        }
        switch (storageJSON.settings.logo) {
            case 'OLD':
                GM_addStyle('#lzt-logo {background-size: 100%;width: 87px;height: 44px;float: left;margin: unset;margin-left: -8px;background: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' version=\'1.1\' id=\'Слой_2\' x=\'0px\' y=\'0px\' viewBox=\'0 0 90 40\' style=\'enable-background:new 0 0 90 40;\' xml:space=\'preserve\'%3E%3Cstyle type=\'text/css\'%3E .st0%7Bfill-rule:evenodd;clip-rule:evenodd;fill:%2323A86D;%7D%0A%3C/style%3E%3Cpath class=\'st0\' d=\'M49,31V13h15.1l4-4H16v4h17L21,32h-8V9H9v27h59l-4-4H49V31 M26,32h19v-1V13h-7L26,32z\'/%3E%3C/svg%3E") center;}')
                break;
            case 'XMAS':
                GM_addStyle('#lzt-logo {background-size: 100%;width: 87px;height: 44px;float: left;margin: unset;margin-left: -8px;background: url(https://zelenka.guru/public/zelenka/256-christmas.svg);}')
                break;
            case 'CUM':
                GM_addStyle('#lzt-logo {background: url(https://zelenka.guru/public/zelenka/64-christmas.svg);background-size: 100%}')
                break;
            case 'CUMALT':
                GM_addStyle('#lzt-logo {background: url(https://zelenka.guru/public/zelenka/64-christmas-v.2.svg);background-size: 100%}')
                break;
            case 'FBI': // thanks EARTY
                GM_addStyle('#lzt-logo {background-image: url("data:image/svg+xml,%0A%3Csvg width=\'460\' height=\'460\' viewBox=\'0 0 460 460\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath fill-rule=\'evenodd\' clip-rule=\'evenodd\' d=\'M276 235.785C249.513 214.27 218.905 202 186.281 202C137.749 202 93.6838 229.207 61 273.5C74.8004 292.205 90.6319 307.862 107.973 319.707L135.826 305.795C129.837 296.48 126.364 285.394 126.364 273.5C126.364 240.443 153.19 213.645 186.281 213.645C211.996 213.645 233.927 229.827 242.427 252.554L276 235.785ZM206.9 270.298C206.231 265.955 204.196 261.908 201.048 258.762C197.133 254.851 191.818 252.662 186.28 252.677V252.677C174.759 252.677 165.419 262.007 165.419 273.519C165.419 279.176 167.676 284.302 171.338 288.059L206.9 270.298ZM164.608 343.168H207.955C200.848 344.377 193.616 345 186.281 345C178.946 345 171.714 344.377 164.608 343.168Z\' fill=\'%232BAD72\'/%3E%3Cpath d=\'M276.277 236.275L276.939 237.6L279 236.574L277.212 235.126L276.277 236.275ZM60.8452 274L59.6497 273.124L59 274L59.6497 274.876L60.8452 274ZM107.912 320.219L107.074 321.447L107.795 321.934L108.576 321.546L107.912 320.219ZM135.822 306.304L136.486 307.631L137.965 306.896L137.072 305.508L135.822 306.304ZM242.637 253.048L241.246 253.567L241.824 255.111L243.301 254.371L242.637 253.048ZM201.175 259.258L202.225 258.215L201.175 259.258ZM207.038 270.797L207.703 272.124L208.671 271.637L208.506 270.569L207.038 270.797ZM186.377 253.171L186.374 251.69L183.009 251.699L185.283 254.172L186.377 253.171ZM186.377 253.172V254.655H189.754L187.473 252.171L186.377 253.172ZM171.405 288.563L170.342 289.6L171.099 290.371L172.07 289.89L171.405 288.563ZM164.661 343.686V342.205L164.412 345.149L164.661 343.686ZM208.095 343.686L208.345 345.149L208.095 342.205V343.686ZM186.378 203.962C218.677 203.962 249.023 216.085 275.343 237.424L277.212 235.126C250.45 213.425 219.459 201 186.378 201V203.962ZM62.0407 274.876C94.5941 230.839 138.346 203.962 186.378 203.962V201C137.151 201 92.5948 228.551 59.6497 273.124L62.0407 274.876ZM108.751 318.997C91.5299 307.254 75.7828 291.716 62.0407 273.124L59.6497 274.876C73.5639 293.703 89.5435 309.488 107.074 321.447L108.751 318.997ZM135.158 304.983L107.248 318.898L108.576 321.546L136.486 307.631L135.158 304.983ZM124.855 274C124.855 286.193 128.422 297.554 134.572 307.106L137.072 305.508C131.22 296.418 127.826 285.607 127.826 274H124.855ZM186.378 212.648C152.4 212.648 124.855 240.116 124.855 274H127.826C127.826 241.752 154.04 215.61 186.378 215.61V212.648ZM244.028 252.53C235.301 229.237 212.784 212.648 186.378 212.648V215.61C211.505 215.61 232.938 231.394 241.246 253.567L244.028 252.53ZM275.615 234.951L241.973 251.724L243.301 254.371L276.939 237.6L275.615 234.951ZM200.125 260.307C203.055 263.232 204.948 266.99 205.571 271.026L208.506 270.569C207.788 265.922 205.604 261.584 202.225 258.215L200.125 260.307ZM186.381 254.655C191.534 254.636 196.481 256.673 200.125 260.307L202.225 258.215C198.022 254.022 192.317 251.675 186.374 251.69L186.381 254.655ZM187.473 252.171L187.472 252.17L185.283 254.172L187.473 252.171ZM166.959 274.019C166.959 263.325 175.653 254.655 186.377 254.655V251.691C174.013 251.691 163.989 261.689 163.989 274.019H166.959ZM172.469 287.532C169.058 284.04 166.959 279.276 166.959 274.019H163.989C163.989 280.078 166.412 285.576 170.342 289.6L172.469 287.532ZM206.374 269.471L170.741 287.242L172.07 289.89L207.703 272.124L206.374 269.471ZM164.661 345.167H208.095V342.205H164.661V345.167ZM207.846 342.23C200.806 343.421 193.643 344.038 186.378 344.038V347C193.812 347 201.142 346.371 208.345 345.149L207.846 342.23ZM186.378 344.038C179.113 344.038 171.95 343.421 164.91 342.23L164.412 345.149C171.614 346.371 178.945 347 186.378 347V344.038Z\' fill=\'white\' fill-opacity=\'0.01\'/%3E%3Cpath d=\'M431 204L26 406H431V204Z\' fill=\'%232BAD72\' stroke=\'white\' stroke-opacity=\'0.01\' stroke-width=\'2.96786\' stroke-miterlimit=\'10\'/%3E%3Cpath d=\'M26 406H431V435H26V406Z\' fill=\'%232BAD72\' stroke=\'white\' stroke-opacity=\'0.01\' stroke-width=\'2.96786\' stroke-miterlimit=\'10\'/%3E%3Cpath d=\'M142.292 157H431V25L358.827 106.942V25L286.648 106.942V25L214.472 106.942V25L142.296 106.942V25L26 157H98.1761H142.292Z\' fill=\'%232BAD72\' stroke=\'white\' stroke-opacity=\'0.01\' stroke-width=\'2.96786\' stroke-miterlimit=\'10\'/%3E%3C/svg%3E%0A")}');
                break;
        }
        switch (storageJSON.settings.marketlogo) {
            case 'MARKET_OLD':
                GM_addStyle('#lzt-market-logo {background: url(https://zelenka.guru/styles/market/logo2.svg) no-repeat center}')
                break;
            case 'MARKET_CLASSIC':
                GM_addStyle('#lzt-market-logo {background: url(https://zelenka.guru/styles/market/logo.png) no-repeat center; background-size: 90%}')
            case 'MARKET_XMAS':
                GM_addStyle('#lzt-market-logo {background: url(https://zelenka.guru/styles/market/newyear-logomarket-536px.svg) no-repeat center}')
                break;
        }
        if (storageJSON.settings.old_chat)
            GM_addStyle('.cb-avatar {display: none}\n.cb-msg-block {background: none; display: contents}\n.cb-msg-info .username {padding-left: 5px}\n.cb-msg-info {display: contents}\n.cb-message {padding: 0 !important}; #chatbox li {padding: 0 !important}\n.MessageTime {position: absolute; right: 0}')
        if (storageJSON.settings.hideignored)
            GM_addStyle('.itemIgnored {display: none}')
    }

    function placeHooks() {
        if (storageJSON.settings.nokid) {
            const orig = HTMLAudioElement.prototype.play;
            HTMLAudioElement.prototype.play = function () {
                if (!this.src.endsWith('/js/lolzteam/prank.mp3')) {
                    orig.apply(this, arguments)
                }
            };
        }
        $(function () {
            const xfAct = XenForo.activate;
            XenForo.activate = function () {
                const ret = xfAct.apply(this, arguments)
                const $els = arguments[0];
                if (storageJSON.settings.old_chat) {
                    const $chatbox = $($els).filter('.cb-message:not([lh-classic])');
                    if ($chatbox.length) {
                        $chatbox.each(function () {
                            const $message = $(this);
                            $message.find('.cb-mention').removeClass('cb-mention')
                            const info = $message.find('.cb-msg-info');
                            const text = $message.find('.cb-msg-text');
                            if (!$message.find('.username').length) {
                                const usernameHTML = $(`.cb-message[data-user=${$message.data('user')}] .username:first`).prop('outerHTML');
                                $message.find('.cb-msg-text').wrap($(`<div class="cb-msg-info"></div>`))
                                $(usernameHTML).insertBefore($message.find('.cb-msg-text'));
                            }
                            if (!$message.find('.MessageTime').length) {
                                $($message.prev().find('.MessageTime').prop('outerHTML')).appendTo($message.find('.cb-msg-info'))
                            }
                            $message.find('.Popup').insertBefore($message.find('.username'));
                            $(`<a style="user-select: none; padding-left: 5px">@</a>`).insertAfter($message.find('.Popup')).click(() => {
                                $(`.Av${$message.data('user')}s`).parent()[0].click()
                            });
                            $(`<span style="width:5px; color: rgb(214,214,214)">:</span>`).insertAfter($message.find('.username'))
                            $message.find('.MessageTime').appendTo($message.find('.cb-msg-info'));
                            if (text.parent().hasClass('cb-msg-info')) {
                                text.insertAfter(text.parent())
                            }
                            info.prependTo(text)
                            text.contents().filter(function () {
                                return this.nodeType === 3;
                            }).wrap('<span></span>');
                            $message.attr('lh-classic', '')
                        })
                    }
                }
                if (storageJSON.settings.nomirror) {
                    $('.externalLink').each(function (i, e) {
                        e.href = e.href.replaceAll(/^(https?:\/\/)(zelenka|lolz)\.guru/g, `$1${location.host}`)
                    });
                }
                return ret;
            }
            const xfAjax = XenForo.ajax;
            XenForo.ajax = function () {
                const url = arguments[0];
                const data = arguments[1];
                const success = arguments[2];
                const options = arguments[3];
                if (url === 'threads/low-priority') {
                    return;
                }
                if (storageJSON.settings.bypassbw) {
                    const dict = ["вби", "гидр", "обнал", "дроп", "цп", "отмы", "cvc", "никитин", "кардинг", "ланской", "брейнблов", 'lolzteam_old']
                    if (Array.isArray(data) && data.find(e => e.name === 'message_html')) {
                        dict.forEach((e) => {
                            const mhtml = data.find(e => e.name === 'message_html')
                            const regex = new RegExp(e, 'gi')
                            if (mhtml.value.match(regex)) {
                                let arr = e.split('')
                                arr.splice(Math.floor(e.length / 2), 0, '\u206A')
                                mhtml.value = mhtml.value.replaceAll(regex, arr.join(''))
                            }
                        });
                    }
                    if (url.endsWith('/post-message') && data.hasOwnProperty('message')) {
                        dict.forEach((e) => {
                            const regex = new RegExp(e, 'gi')
                            if (data.message.match(regex)) {
                                let arr = e.split('')
                                arr.splice(Math.floor(e.length / 2), 0, '\u206A')
                                data.message = data.message.replaceAll(regex, arr.join(''))
                            }
                        })
                    }
                }
                return xfAjax.apply(this, arguments);
            }
        });
    }

    function initBody() {
        function waitForElm(selector) {
            return new Promise(resolve => {
                if (document.querySelector(selector)) {
                    return resolve(document.querySelector(selector));
                }

                const observer = new MutationObserver(mutations => {
                    if (document.querySelector(selector)) {
                        resolve(document.querySelector(selector));
                        observer.disconnect();
                    }
                });

                observer.observe(document.documentElement, {
                    childList: true,
                    subtree: true
                });
            });
        }

        waitForElm('.userContentLinks .button[href^="market/"]').then(function () {
            if (storageJSON.settings.id) {
                const id = /market\/user\/(\d+)\/items/.exec($('.userContentLinks .button[href^="market/"]').attr('href'))[1];
                $(`<div class="clear_fix profile_info_row"><div class="label fl_l">ID:</div><div class="labeled">${id}</div></div>`).insertAfter($(".profile_info_row:last"));
                if (id !== $('input[name="_xfToken"]').val().split(',')[0]) {
                    let loadinfo = $(`<div class="clear_fix profile_info_row"><div class="labeled"><a href="javascript:void(0)">Получить дополнительную информацию через API</a></div></div>`).insertAfter($(".profile_info_row:last"));
                    loadinfo.find('a').click(function (e) {
                        APIRequest("users/" + id).then(function (userInfoAPI) {
                            if (userInfoAPI) {
                                if (userInfoAPI.user && userInfoAPI.user.custom_fields.lztUnbanAmount) {
                                    $(`<div class="clear_fix profile_info_row"><div class="label fl_l">Цена разбана:</div><div class="labeled">${userInfoAPI.user.custom_fields.lztUnbanAmount}</div></div>`).insertAfter($(".profile_info_row:last"));
                                }
                                loadinfo.remove();
                            }
                        });
                    });
                }
            }
        });
        waitForElm('.followContainer.red:not(.OverlayTrigger)').then(function () {
            const reportBtn = $('.followContainer.red:not(.OverlayTrigger)');
            reportBtn.addClass('withSendMoneyButton').removeClass('full').addClass('block');
            $(`<a class="actionButton--sendMoney red fl_r withLeftButton fas fa-eye-slash" href="${reportBtn.attr('href').replace('&message=', '&message=[CLUB]%0A') + '%0A[/CLUB]'}" style="margin-top: 5px"></a>`).insertBefore(reportBtn)
        })
        waitForElm('.contestThreadBlock').then(function () {
            if (storageJSON.settings.contestUpper && $('.contestThreadBlock').length) {
                $('.contestThreadBlock').insertBefore('.messageText:first');
            }
            if (storageJSON.settings.id) {
                const marginBlock = $('.marginBlock');
                const participants = marginBlock.filter((i, e) => {
                    return e.innerText.startsWith('Приняли участие:') || e.innerText.startsWith('Took part:')
                });
                const prizes = marginBlock.filter((i, e) => {
                    return e.innerText.startsWith('Количество призов:') || e.innerText.startsWith('Number of prizes:')
                });
                participants.append(` (Шанс: ${(100 / (+participants.text()?.match(/\d+/) / (+prizes.text()?.match(/\d+/) || 1))).toFixed(2)}%)`)
            }
            $(document).on('keydown', function (e) {
                if (e.key.toUpperCase() === storageJSON.settings.btnpc && $('.LztContest--Participate').length) {
                    e.preventDefault()
                    document.querySelector('.LztContest--Participate').click();
                    if (storageJSON.settings.closepc) {
                        waitForElm('.LztContest--alreadyParticipating:not(.hidden)').then(function () {
                            window.close()
                        });
                    }
                }
            })
        })
        waitForElm('.likesPagination').then(function () {
            if (storageJSON.settings.id && location.search.includes('type=given') && location.href.startsWith($('#AccountMenu a:first').attr('href'))) {
                $('.likeBar').each((i, e) => {
                    const $el = $(e)
                    const $btn = $(`<a class="fas fa-heart" href="${$el.parent().find('.likeThreadTitle').attr('href')}like" style="float: right;color: rgb(34,142,93);user-select: none;text-decoration: none;font-size: 20px;"></a>`).prependTo($el)
                    $btn.click((e) => {
                        e.preventDefault()
                        XenForo.ajax($btn.attr('href'))
                        $el.remove()
                    })
                })
            }
        })
    }

    function initReady() {
        $(function () {
            if (storageJSON.nextupdatecheck < new Date() / 1000) {
                $.get("https://greasyfork.org/en/scripts/440650-lolzhelper", (e) => {
                    if ($(e).find('.script-show-version:last').text() !== GM_info.script.version) {
                        XenForo.alert('<button class="button primary full" onclick="location.href=`https://greasyfork.org/scripts/440650-lolzhelper/code/lolzhelper.user.js?' + Math.ceil(Math.random() * 9999999999) + '`">Обновить</button>', `Доступно обновление юзерскрипта LOLZHELPER (новая версия ${$(e).find('.script-show-version:last').text()})`, null, null, function () {
                            storageJSON.nextupdatecheck = Math.trunc(new Date() / 1000) + 1800
                        });
                    }
                    saveSettings()
                });
            }
            let settingsButton = $('<li><a class="bold" style="color: rgb(0, 186, 120);">LOLZHELPER</a></li>').insertAfter($('#AccountMenu li:first'));
            settingsButton.click(function () {
                openSettings();
            });
        });
    }

    initStyles();
    placeHooks();
    initBody();
    initReady();
})();