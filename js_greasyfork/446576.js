// ==UserScript==
      // @name         notion TOC sider & go to top
      // @namespace    https://www.notion.so/
      // @version      0.0.4
      // @description  display a fixed sider on the top-right of notion page which has a table of content block inside
      // @author       nan chen
      // @match        *://www.notion.so/*
      // @icon         https://www.google.com/s2/favicons?domain=notion.so
      // @grant        none
      // @run-at       document-idle
      // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446576/notion%20TOC%20sider%20%20go%20to%20top.user.js
// @updateURL https://update.greasyfork.org/scripts/446576/notion%20TOC%20sider%20%20go%20to%20top.meta.js
      // ==/UserScript==
      (function () {
        setTimeout(function () {
          var tocEle = document.querySelector(
            '.notion-table_of_contents-block'
          );
          var parent = document.querySelector('#notion-app');

          function refresh() {
            var tocMenu = document.querySelector('#notion-toc-menu-sider');
            var closeButton = document.querySelector(
              '#notion-toc-menu-sider-close-button'
            );
            if (tocMenu) {
              parent.removeChild(tocMenu);
            }
            if (closeButton) {
              parent.removeChild(closeButton);
            }
          }
          function buildSider() {
            var headings = [];
            var parseLevel = function (outerHtml) {
              if (outerHtml.includes('margin-left: 24px')) {
                return 2;
              }
              if (outerHtml.includes('margin-left: 48px')) {
                return 3;
              }
              return 1;
            };
            var tocEleToBuild = document.querySelector(
              '.notion-table_of_contents-block'
            );
            if (!tocEleToBuild) return;

            tocEleToBuild.childNodes[0].childNodes.forEach(function (n) {
              if (n.nodeType === 1) {
                var an = n.querySelector('a');
                headings.push({
                  title: n.innerText,
                  level: parseLevel(n.outerHTML),
                  href: an.href,
                });
              }
            });

            var menu = document.createElement('aside');
            menu.id = 'notion-toc-menu-sider';
            var isExpanded = true;
            parent.appendChild(menu);

            menu.style.minWidth = '120px';
            menu.style.maxHeight = '600px';
            menu.style.overflowY = 'auto';
            menu.style.position = 'fixed';
            menu.style.top = '55px';
            menu.style.right = '10px';
            menu.style.zIndex = 100000;
            menu.style.boxShadow =
              'rgb(15 15 15 / 5%) 0px 0px 0px 1px, rgb(15 15 15 / 10%) 0px 3px 6px, rgb(15 15 15 / 20%) 0px 9px 24px';
            var menuList = document.createElement('div');
            menuList.style.maxWidth = '160px';
            menuList.style.backgroundColor = '#fff';
            menuList.style.padding = '10px';

            menu.appendChild(menuList);
            var closeButtonWrapper = document.createElement('div');
            closeButtonWrapper.id = 'notion-toc-menu-sider-close-button';
            var closeButton = document.createElement('div');
            closeButtonWrapper.style.borderRadius = '12px';
            closeButtonWrapper.style.backgroundColor = '#fff';
            closeButtonWrapper.style.width = '24px';
            closeButtonWrapper.style.height = '24px';
            closeButtonWrapper.style.cursor = 'pointer';
            closeButtonWrapper.style.zIndex = 100000;
            closeButtonWrapper.style.position = 'absolute';
            closeButtonWrapper.style.top = '30px';
            closeButtonWrapper.style.right = '10px';

            closeButton.style.width = '10px';
            closeButton.style.height = '10px';
            closeButton.style.borderLeft = '1px solid black';
            closeButton.style.borderBottom = '1px solid black';
            closeButton.style.transform = 'rotate(-45deg)';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '10px';
            closeButton.style.left = '7px';
            parent.appendChild(closeButtonWrapper);
            closeButtonWrapper.appendChild(closeButton);

            setTimeout(function () {
              closeButton.addEventListener('click', function () {
                if (!isExpanded) {
                  closeButton.style.transform = 'rotate(-45deg)';
                  menu.style.display = 'block';
                } else {
                  closeButton.style.transform = 'rotate(135deg)';
                  menu.style.display = 'none';
                }

                isExpanded = !isExpanded;
              });
            });

            var lists = headings.map(function (h) {
              var anchor = document.createElement('a');
              anchor.innerText = h.title;
              anchor.style.fontSize = '10px';
              anchor.href = h.href;
              anchor.style.cursor = 'pointer';
              anchor.style.display = 'block';
              anchor.style.textOverflow = 'ellipsis';
              anchor.style.whiteSpace = 'nowrap';
              anchor.style.overflow = 'hidden';
              anchor.style.color = 'rgb(141,141,141)';

              switch (h.level) {
                case 1:
                  break;
                case 2:
                  anchor.style.marginLeft = '16px';
                  break;
                case 3:
                  anchor.style.marginLeft = '24px';
                  break;
                default:
                  break;
              }
              return anchor;
            });
            lists.forEach(function (l) {
              menuList.appendChild(l);
            });

            /**** to top ******/
            var topAnchor = document.createElement('a');
            topAnchor.name = 'top';

            parent.prepend(topAnchor);
            var toTop = document.createElement('div');
            toTop.className = 'to-top';
            toTop.innerHTML = `<a id="go-to-top" href="#top" target="_Self"></a><svg
            class="to-top-button"
                    role="button"
                    viewBox="0 0 1024 1024"
                    xmlns="http://www.w3.org/2000/svg"
                    style="cursor: pointer;
                  position: fixed;
                  bottom: 5rem;
                  right: 2rem;
                  width: 2rem;
                  color: rgb(235, 235, 235);
                  background-color: #fff;
                  border-radius: 50%;
                  overflow: hidden;
                  z-index: 1;
                  fill: currentcolor;"
                  >
                    <path
                      d="M512 0C229.517 0 0 229.517 0 512s227.752 512 512 512c282.483 0 512-227.752 512-512C1024 229.517 794.483
                    0 512 0zM351.338 271.89h305.434c14.125 0 26.483 12.358 26.483 26.482s-12.358 26.483-26.483
                    26.483H351.338c-14.124 0-26.483-12.358-26.483-26.483 0-15.89 12.359-26.482 26.483-26.482z
                    m331.917 303.669c-12.358 12.358-33.545 12.358-45.903 0L531.42 471.393v270.124c0 14.124-12.359
                    26.483-26.483 26.483s-26.483-12.359-26.483-26.483v-271.89l-105.93 104.166c-12.36 12.359-33.546 12.359-45.904
                    0-12.359-12.359-12.359-31.78 0-45.903l155.365-151.835c7.062-7.062 14.124-8.827 22.952-8.827s15.89 3.53 22.952
                    8.827L683.255 527.89c12.359 15.89 12.359 35.31 0 47.669z"
                      fill="currentColor"
                    ></path>
                  </svg>`;
            parent.appendChild(toTop);
            var toTopButton = document.querySelector('.to-top-button');
            document.addEventListener('scroll', scrollFunction);
            function scrollFunction() {
              console.log('scrolling');
              if (
                document.body.scrollTop > 20 ||
                document.documentElement.scrollTop > 20
              ) {
                toTopButton.style.display = 'block';
              } else {
                toTopButton.style.display = 'none';
              }
            }

            toTopButton.addEventListener('click', function (e) {
              document.querySelector('#go-to-top').click();
            });
          }
          buildSider();

          var lastUrlWithoutHash = location.origin + location.pathname;
          var lastUrl = location.href;
          new MutationObserver(() => {
            var url = location.href;
            const urlWithoutHash = location.origin + location.pathname;
            if (lastUrlWithoutHash !== urlWithoutHash) {
              lastUrl = url;
              lastUrlWithoutHash = urlWithoutHash;
              onUrlChange();
            }
          }).observe(document, { subtree: true, childList: true });

          function onUrlChange() {
            setTimeout(function () {
              var toc = document.querySelector(
                '.notion-table_of_contents-block'
              );
              refresh();
              if (toc) {
                buildSider();
              }
            }, 0);

            //   console.log('change');
          }
        }, 2000);
             })();