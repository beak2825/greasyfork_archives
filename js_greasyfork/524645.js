// ==UserScript==
// @name         汉字聚合查询
// @namespace    http://martingrocery.top/
// @version      2025.03.19
// @description  本工具旨在为用户提供关于当前正在搜索的汉字的其他网站链接。
// @author       Martin的杂货铺
// @match        https://zi.tools/*
// @match        http://*.zisea.com/*
// @match        http://*.yedict.com/*
// @match        https://*.zdic.net/*
// @match        http://*.ccamc.org/*
// @match        https://*.ccamc.org/*
// @match        https://*.unicode.org/*
// @match        https://*.glyphwiki.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zi.tools
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524645/%E6%B1%89%E5%AD%97%E8%81%9A%E5%90%88%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/524645/%E6%B1%89%E5%AD%97%E8%81%9A%E5%90%88%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function ord(char) {
      return char.codePointAt(0);
    }

    function hexToCharacter(hex) {
        hex = hex.replace(/^[U]\+|0x/gi, '')
        if (/[^0-9A-Fa-f]+/.test(hex)) {
            return null;
        }
        const codePoint = parseInt(hex, 16);

        try {
            return String.fromCodePoint(codePoint);
        } catch (e) {
            return null;
        }
    }


    function ziToolsMain() {
        const app = document.querySelector('#app');

        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
              let error = false;
              const url_path = window.location.pathname;
              const Match = url_path.match(regex);
              let character;
              if (Match === null) {
                error = true;
              } else {
                character = decodeURIComponent(url_path.match(regex)[1]);
                if ([...character].length !== 1 || character === null) {
                  error = true;
                }
              }
              if (!error) {
                if (document.querySelector('#mtgc-zi') !== null) {
                  document.querySelector('#mtgc-zi').innerHTML = linksZiTools(character);
                } else {
                  let MTGC_zi = document.createElement('div');
                  MTGC_zi.innerHTML = linksZiTools(character);
                  MTGC_zi.id = 'mtgc-zi';
                  app.appendChild(MTGC_zi);
                }
              } else {
                if (document.querySelector('#mtgc-zi') !== null) {
                  document.querySelector('#mtgc-zi').remove();
                }
              }
            }
          });
        });

        observer.observe(document.documentElement, { attributes: true, subtree: true });

        function linksZiTools(character) {
          return `
            <p>“${character}”在其他网站的信息</p>
            <ul>
              <li>
                <a href="http://zisea.com/zscontent.asp?uni=${ord(character).toString(16).toUpperCase()}" target="_blank">
                  字海网
                </a>
              </li>
              <li>
                <a href="http://ccamc.org/cjkv.php?cjkv=${encodeURIComponent(character)}" target="_blank">
                  古今文字集成
                </a>
              </li>
              <li>
                <a href="https://www.zdic.net/hans/${encodeURIComponent(character)}" target="_blank">
                  汉典
                </a>
              </li>
              <li>
                <a href="https://www.unicode.org/cgi-bin/GetUnihanData.pl?codepoint=${encodeURIComponent(character)}" target="_blank">
                  Unihan Database
                </a>
              </li>
              <li>
                <a href="https://glyphwiki.org/wiki/u${ord(character).toString(16).toLowerCase()}" target="_blank">
                  GlyphWiki
                </a>
              </li>
            </ul>
          `
        }

        let MTGC_zi_style = document.createElement('style');

        const styleText = `
          #mtgc-zi {
            color: grey;
            position: fixed;
            bottom: 0.5rem;
            left: 0.5rem;
            width: 11rem;
            background-color: white;
            transition: left 0.5s ease-in-out;
            border: 2px solid #ba2a25;
            box-sizing: border-box;
            border-radius: 5px;
          }

          #mtgc-zi a::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 0.1rem;
            border-radius: 50rem;
            transition: width 0.25s ease-in-out;
            background-color: #ba2a25;
          }

          #mtgc-zi a:hover::after {
            width: 100%;
          }

          #mtgc-zi a {
            position: relative;
          }

          #mtgc-zi>* {
            margin-bottom: 0.5rem;
          }

          @media (max-width: 1200px) {
            #mtgc-zi {
              left: -11rem;
              border-radius: 5px 0 5px 5px;
            }

            #mtgc-zi::after {
              content: "其他网站";
              color: white;
              border-radius: 0 5px 5px 0;
              font-size: 0.7em;
              height: 5rem;
              width: 1rem;
              background-color: #ba2a25;
              position: absolute;
              right: -1rem;
              top: -2px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              text-align: center;
            }

            #mtgc-zi:hover {
              left: 0.5rem;
            }
          }
        `;
        let MTGC_zi_style_text = document.createTextNode(styleText);
        MTGC_zi_style.appendChild(MTGC_zi_style_text);
        document.head.appendChild(MTGC_zi_style);

        let error = false;
        const regex = /\/zi\/(.*)(?=$|\?)/;
        const url_path = window.location.pathname;
        const Match = url_path.match(regex);
        let character;
        if (Match === null) {
          error = true;
        } else {
          character = decodeURIComponent(url_path.match(regex)[1]);
          if ([...character].length !== 1 || character === null) {
            error = true;
          }
        }
        if (!error) {
          if (document.querySelector('#mtgc-zi') !== null) {
            document.querySelector('#mtgc-zi').innerHTML = linksZiTools(character);
          } else {
            let MTGC_zi = document.createElement('div');
            MTGC_zi.innerHTML = linksZiTools(character);
            MTGC_zi.id = 'mtgc-zi';
            app.appendChild(MTGC_zi);
          }
        } else {
          if (document.querySelector('#mtgc-zi') !== null) {
            document.querySelector('#mtgc-zi').remove();
          }
        }
    }

    function ziseaMain() {
        if (window.location.pathname === "/zscontent.asp"){
            const urlParams = new URLSearchParams(window.location.search);
            const unicode = urlParams.get('uni');
            const td = document.querySelector('table:first-child td:nth-child(2)');
            const character = hexToCharacter(unicode);
            if (character) {
                td.innerHTML += `
                <br/>
                其他网站：<a href="https://zi.tools/zi/${encodeURIComponent(character)}" target="_blank">字统网</a>
                ·
                <a href="http://ccamc.org/cjkv.php?cjkv=${encodeURIComponent(character)}" target="_blank">古今文字集成</a>
                ·
                <a href="https://www.zdic.net/hans/${encodeURIComponent(character)}" target="_blank">汉典</a>
                ·
                <a href="https://www.unicode.org/cgi-bin/GetUnihanData.pl?codepoint=${encodeURIComponent(character)}" target="_blank">Unihan Database</a>
                ·
                <a href="https://glyphwiki.org/wiki/u${encodeURIComponent(unicode.toLowerCase())}" target="_blank">GlyphWiki</a>
                `;
            } else {
                // something coming soon here
            }
        }
    }

    function zdicMain() {
        const regex = /^\/han[st]\/(.*)/;
        if (regex.test(window.location.pathname)){
            const Match = window.location.pathname.match(regex);
            const character = decodeURIComponent(Match[1]);
            console.log(window.location.pathname);
            if ([...character].length !== 1) {
                return;
            }
            let MTGC_zdic_style = document.createElement('style');
            const blockContent = document.createElement('div');


            const styleText = `
              #mtgc-zi {
                color: grey;
                position: fixed;
                bottom: 0.5rem;
                left: 0.5rem;
                width: 11rem;
                background-color: white;
                transition: left 0.5s ease-in-out;
                border: 2px solid #8b411c;
                box-sizing: border-box;
                border-radius: 5px;
              }

              #mtgc-zi a::after {
                content: "";
                position: absolute;
                bottom: 0;
                left: 0;
                width: 0;
                height: 0.1rem;
                border-radius: 50rem;
                transition: width 0.25s ease-in-out;
                background-color: #8b411c;
              }

              #mtgc-zi a:hover::after {
                width: 100%;
              }

              #mtgc-zi a {
                position: relative;
                text-decoration: none;
                color: #8b411c;
              }

              #mtgc-zi>* {
                margin-bottom: 0.5rem;
              }

              #mtgc-zi ul {
                list-style-type: disc;
                padding-left: 1.5em;
              }

              @media (max-width: 950px) {
                #mtgc-zi {
                  left: -11rem;
                  border-radius: 5px 0 5px 5px;
                }

                #mtgc-zi::after {
                  content: "其他网站";
                  color: white;
                  border-radius: 0 5px 5px 0;
                  font-size: 0.7em;
                  height: 5rem;
                  width: 1rem;
                  background-color: #8b411c;
                  position: absolute;
                  right: -1rem;
                  top: -2px;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  text-align: center;
                  line-height: 1.5em;
                }

                #mtgc-zi:hover {
                  left: 0.5rem;
                }
              }
            `;
            let MTGC_zdic_style_text = document.createTextNode(styleText);
            MTGC_zdic_style.appendChild(MTGC_zdic_style_text);
            document.head.appendChild(MTGC_zdic_style);
            let MTGC_zi = document.createElement('div');
            MTGC_zi.innerHTML = linksZdic(character);
            MTGC_zi.id = 'mtgc-zi';
            document.body.appendChild(MTGC_zi);

            function linksZdic(character) {
              return `
                <p>“${character}”在其他网站的信息</p>
                <ul>
                  <li>
                    <a href="https://zi.tools/zi/${encodeURIComponent(character)}" target="_blank">
                      字统网
                    </a>
                  </li>
                  <li>
                    <a href="http://zisea.com/zscontent.asp?uni=${ord(character).toString(16).toUpperCase()}" target="_blank">
                      字海网
                    </a>
                  </li>
                  <li>
                    <a href="http://ccamc.org/cjkv.php?cjkv=${encodeURIComponent(character)}" target="_blank">
                      古今文字集成
                    </a>
                  </li>
                  <li>
                    <a href="https://www.unicode.org/cgi-bin/GetUnihanData.pl?codepoint=${encodeURIComponent(character)}" target="_blank">
                      Unihan Database
                    </a>
                  </li>
                  <li>
                    <a href="https://glyphwiki.org/wiki/u${ord(character).toString(16).toLowerCase()}" target="_blank">
                      GlyphWiki
                    </a>
                  </li>
                </ul>
              `
            }
        }
    }

    function ccamcMain() {
        if (window.location.pathname === '/cjkv.php') {
            const urlParams = new URLSearchParams(window.location.search);
            const character = urlParams.get('cjkv');
            const emptyDiv = document.querySelector('.info .tab-pane:first-child>div:nth-child(2)>div.row:nth-child(7)');
            if (emptyDiv.innerHTML.trim() === "") {
                emptyDiv.remove();
            }
            document.querySelector('.info .tab-pane:first-child>div:nth-child(2)').innerHTML +=
            `
            <div class="row">
		        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		            <p class="title">其他网站直达链接</p>
		            <p style="font-weight: bold">
                        <a href="https://zi.tools/zi/${encodeURIComponent(character)}" target="_blank">字统网</a>
                        ·
                        <a href="http://zisea.com/zscontent.asp?uni=${ord(character).toString(16).toUpperCase()}" target="_blank">字海网</a>
                        ·
                        <a href="https://www.zdic.net/hans/${encodeURIComponent(character)}" target="_blank">汉典</a>
                        ·
                        <a href="https://www.unicode.org/cgi-bin/GetUnihanData.pl?codepoint=${encodeURIComponent(character)}" target="_blank">Unihan Database</a>
                        ·
                        <a href="https://glyphwiki.org/wiki/u${ord(character).toString(16).toLowerCase()}" target="_blank">GlyphWiki</a>
                    </p>
                </div>
		    </div>
            <hr/>
            `
        }
    }

    function unihanMain() {
        if (window.location.pathname === '/cgi-bin/GetUnihanData.pl') {
            const urlParams = new URLSearchParams(window.location.search);
            const character = urlParams.get('codepoint');
            let copyright = document.querySelector('.contents > *:last-child');
            copyright.remove();
            let hr = document.querySelector('.contents > *:last-child');
            hr.remove();
            document.querySelector('.contents').innerHTML += `
            <p>
                Look up simplified Chinese character information using U+${ord(character).toString(16).toUpperCase()} at
                <a href="https://zi.tools/zi/${encodeURIComponent(character)}" target="_blank">Zi.TOOLS</a>
            </p>
            <p>
                Look up traditional Chinese character information using U+${ord(character).toString(16).toUpperCase()} at
                <a href="https://zi.tools/zi/${encodeURIComponent(character)}" target="_blank">Zi.TOOLS</a>
            </p>
            <p>
                Look up simplified Chinese character information using U+${ord(character).toString(16).toUpperCase()} at
                <a href="http://zisea.com/zscontent.asp?uni=${ord(character).toString(16).toUpperCase()}" target="_blank">ZISEA</a>
                /
                <a href="http://yedict.com/zscontent.asp?uni=${ord(character).toString(16).toUpperCase()}" target="_blank">YEDICT</a>
            </p>
            <p>
                Look up traditional Chinese character information using U+${ord(character).toString(16).toUpperCase()} at
                <a href="http://zisea.com/zscontent.asp?uni=${ord(character).toString(16).toUpperCase()}" target="_blank">ZISEA</a>
                /
                <a href="http://yedict.com/zscontent.asp?uni=${ord(character).toString(16).toUpperCase()}" target="_blank">YEDICT</a>
            </p>
            `;
            document.querySelector('.contents').appendChild(hr);
            document.querySelector('.contents').appendChild(copyright);
        }
    }

    function glyphWikiMain() {
        const regex = /^\/wiki\/u([0-9a-f]+?)(?:-.+)?$/;
        if (regex.test(window.location.pathname)) {
            const Match = window.location.pathname.match(regex);
            const unicode = decodeURIComponent(Match[1]);
            const character = hexToCharacter(unicode);
            if (!/\p{Script=Han}/gu.test(character)) {
                return;
            }
            let title = '';
            switch (window.location.hostname) {
                case 'glyphwiki.org':
                    title = '他のサイト';
                    break;
                case 'zhs.glyphwiki.org':
                    title = '其他网站';
                    break;
                case 'zht.glyphwiki.org':
                    title = '其他網站';
                    break;
                case 'en.glyphwiki.org':
                    title = 'other sites';
                    break;
                default:
                    title = 'unknown error occured'
            }
            const leftPane = document.querySelector('.left_pane');
            leftPane.innerHTML += `
            <div class="box">
                ${title}
                <div class="box_inside">
                    <ul>
                        <li>
                            <a href="https://zi.tools/zi/${encodeURIComponent(character)}" target="_blank">
                                字统网
                            </a>
                        </li>
                        <li>
                            <a href="http://zisea.com/zscontent.asp?uni=${ord(character).toString(16).toUpperCase()}">
                                字海网
                            </a>
                        </li>
                        <li>
                            <a href="http://ccamc.org/cjkv.php?cjkv=${encodeURIComponent(character)}">
                                古今文字集成
                            </a>
                        </li>
                        <li>
                            <a href="https://www.zdic.net/hans/${encodeURIComponent(character)}">
                                汉典
                            </a>
                        </li>
                        <li>
                            <a href="https://unicode.org/cgi-bin/GetUnihanData.pl?codepoint=${encodeURIComponent(character)}">
                                Unihan Database
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            `
        }
    }

    if (window.location.hostname === 'zi.tools') {
        ziToolsMain();
    }

    if (['zisea.com', 'www.zisea.com', "yedict.com", "www.yedict.com", ].includes(window.location.hostname)) {
        ziseaMain();
    }

    if (window.location.hostname === 'www.zdic.net') {
        zdicMain();
    }

    if (['ccamc.org', 'www.ccamc.org'].includes(window.location.hostname)){
        ccamcMain();
    }

    if (['unicode.org', 'www.unicode.org'].includes(window.location.hostname)) {
        unihanMain();
    }

    if (['glyphwiki.org', 'zhs.glyphwiki.org', 'zht.glyphwiki.org', 'en.glyphwiki.org'].includes(window.location.hostname)) {
        glyphWikiMain();
    }
})();