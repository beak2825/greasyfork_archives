// ==UserScript==
// @name        移动端聚合搜索引擎导航 SearchSwitcher
// @namespace   Violentmonkey Scripts
// @include      *
// @grant        GM_setValue
// @grant        GM_getValue
// @version     1.3.6
// @author      酷安Mc_Myth
// @license MIT
// @description 移动端-手机版聚合搜索引擎切换导航，支持自定义隐藏和排序，可以全部展开或横向排列滑动选择。
// @downloadURL https://update.greasyfork.org/scripts/499230/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%AF%BC%E8%88%AA%20SearchSwitcher.user.js
// @updateURL https://update.greasyfork.org/scripts/499230/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%81%9A%E5%90%88%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E5%AF%BC%E8%88%AA%20SearchSwitcher.meta.js
// ==/UserScript==
(function() {
  'use strict';
  // 搜索引擎配置对象
  var searchEngines = {
    Google: {
      hide: 0,
      name: "Google",
      icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA4LTAyVDA3OjQzOjU0KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wOC0wMlQwNzo0NDoyMCswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wOC0wMlQwNzo0NDoyMCswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2ZjQ0NTJmYy0xY2IzLWQyNDMtODRiMy02MGMxY2Q0Yzk0MTQiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDowNGU0NWRjMy02MmY5LTU2NGQtYmY5NS01YWU0ZGVhOTYxOWEiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxY2NhMTM3YS0xODJjLTE4NGQtOGM1YS1jOTQzZGRlMDBlYjAiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjFjY2ExMzdhLTE4MmMtMTg0ZC04YzVhLWM5NDNkZGUwMGViMCIgc3RFdnQ6d2hlbj0iMjAyMC0wOC0wMlQwNzo0Mzo1NCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2ZjQ0NTJmYy0xY2IzLWQyNDMtODRiMy02MGMxY2Q0Yzk0MTQiIHN0RXZ0OndoZW49IjIwMjAtMDgtMDJUMDc6NDQ6MjArMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6Adq1DAAAClUlEQVRYw2P4//8/w0BihlEHDDkHfF06z/RDSVb+m1CPSa/cLJa8cjVf9ibYber7oozCrwtnWdHMAR8bK+JfuZgte+VsuhKI/+PAK0FqPtaXJVHNAd93bZV+7W03l4DFGA557WM/98f+XWIUOeDr8gXGJFqM4ohPXY0hZDsA5HMclq98lxrZ+GX2ZIfvW9Ypf9+6XvHL7CkO79KiGpHUr/zU1xZAURS89rJdgG7x25iAnp9nTrDj0vPz9HH2NxE+fZ+n9HhSlAa+TMjNQvP9yvc5iRV0y4a/d7Lf+ViuAPc9KMvRrRz4e78t4Pce1ntA/P/rZNH/rz1NVn7fsVmWbg74c9ZtKshyGP65TnE/XUvC34dkDiM74M/lyEZ8Bji1fplJLN5/9bcAYQfsZb+D7IC/d2ojiXDAf2Lw0qO/dAbUAfMP/jQmPQouRTRTGAVwB6w68UuDcCI8546SCJ8c0ltPbgJDc8DMg9d/8xKRDTv8YNlw81bF/zYrAhZsuLtHkVTLVxz/pYXuAKILom97OG+2bTD+b7IiGIzdNiRNJdUBIRO+tiMHf8LMb1VEO6D/eFMI0OKVMAeA2DE7S+uItbx8+fd4dN+vxBL/eCsjuzXRc5EcAHaEz6b0vkNPz/Diszx544oyp9aPKIkPFBok14bbHxySQAsFuENCtuW1956b777q1naN1bd3qE29tNQuZU91memKEJD6leYLyv87dj6G+/7wjT/cZDVIFt/YqI/DEQSx6dKE/3Z9p+Ziy/skNcl2PjwiZrcmZi6JDllpvjJs2exLG82p1iitPtYfbbYyZBkBh4CjIH1fXSHNmuULr683zDnQlOu5MXWSxaqwJSCfum1Inpq6t7YYlBZGe0ajDiAVAwCcsjeFTD7reAAAAABJRU5ErkJggg==",
      url: "https://google.com/search?q=",
      parameter: "q",
      hostnameRegex: /(?:www\.)?google\.(com|co\.[a-z]{2}|[a-z]{2,3})(\.[a-z]{2})?/,
      insertPoint: function(container) {
        insertAfter(container, document.getElementById("msc"));
        container.style.marginBottom = "10px";
      }
    },
    Baidu: {
      hide: 0,
      name: "百度",
      icon: "data:image/x-icon;base64,AAABAAEAGBgAAAEACADIBgAAFgAAACgAAAAYAAAAMAAAAAEACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/51YAP+JNQD/rnUA/9zCAP+4hQD/tH4A/4gzAP+INAD/0bAA/9KyAP+KNwD/jj0A/5hPAP+2ggD/l0wA/7F5AP+XTQD/tX8A/4o2AP+kYwD/0K8A/61zAP/LpgD/izgA/8WbAP+SRAD/jTsA/9KzAP+TRgD/oV4A/6BcAP+cVAD/wZQA/9vCAP/HoAD/yKEA/59aAP+jYgD/3cUA/6hqAP+rbwD/wZUA/6VkAP/PrQD/0bEA/55YAP+PPgD/3cQA/82pAP/KpQD/wJMA/6ZmAP+udAD/kEEA/9a4AP/GngD/kUIA/+zfAP+kZAD/jDoA/6VlAP+6iQD/nlkA//TsAP+oawD/qWsA/7yMAP/IogD/9e8A/5pTAP+NPAD/nFYA/7aBAP/17gD/07QA/9vBAP/48gD/ol8A////AP/o2QD/xJkA/5hOAP/t4AD/zKcA/6puAP/JogD/7+QA/8KXAP+TRwD/8ukA//r3AP/gygD/zqwA//bvAP+VSQD/sHgA/9CuAP/OqwD/kUMA/6doAP+PPwD/lUoA/4s5AP+USAD/2r8A/9W2AP+9jgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATGlpAAAAAABqKmtUAAAAAAAAAAAAADdlBwcHBzYPZmcHBwcHaAAAAAAAAAAAADYHGGBhHGJjZCwcHBYHBykAAAAAAAAACgcHWFo4Ck0BW1xdXlEHB18AAAAAAAAAVgcHV1gHNE1OT1IHUFEHB1kAAAAAAAAAMAIHU1QHNE1OTxEHUFEHB1UAAAAAAAAAACkHSUpLTE1OTxEHUFEHUgAAAAAAAAAAAABCCCtDREVGEEcHQkg/AAAAAAAAAAAAAAAAPgIHP0ARBwcHB0EAAAAAAAAAAAAAAAAAADgCOQYMBwcHHjo7PDw9AAAAAAAAMzQ1AAAGBwcHBwc2ADcHBwcHBAAAAAAtBwcHHgAALgcHBy8wADEHBwcHMgAAAAApBwcHCwAAACorEAAAACwHBwcHFQAAAAAoBwcHBwAAAAAAAAAAAAACBwcYAAAAAAAhBwcHEQAAIgAAAAAjIwAkJSYnAAAAAAAAGgcbHAAdBx4AAB8HByAAAAAAAAAAAAAAABUAABYHBwcXABgHBwcZAAAAAAAAAAAAAAAAABEHBwcSABMHBwcUAAAAAAAAAAAAAAAAAA0HBwcOAA8HBwcQAAAAAAAAAAAAAAAAAAYHBwgJAAoLBwwAAAAAAAAAAAAAAAAAAAABAgMAAAAEBQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////APx8PwDwAB8A8AAPAOAADwDgAA8A4AAPAPAAHwD4AD8A/AB/AP4ABwDjAQMAwYEDAMHHAwDB/4cAwbyHAOEYfwD2CD8A/gg/AP4IPwD+CH8A/xz/AP///wD///8A",
      url: "https://www.baidu.com/s?word=",
      parameter: "word|wd",
      hostnameRegex: /(?:www\.)?baidu\.com/,
      insertPoint: function(container) {
        document.getElementById("page-hd").appendChild(container);
        let initialMarginTop = null; // 初始的 margin-top 值

        // 检查元素是否匹配所需的样式条件
        function isMatchingElement(element) {
          const style = window.getComputedStyle(element);
          const maxHeight = element.style.maxHeight || style.maxHeight;
          return (
            style.backgroundColor !== 'transparent' &&
            style.paddingTop !== '' &&
            style.marginTop !== '' &&
            style.minHeight !== '' &&
            maxHeight.includes('calc')
          );
        }

        // 修复部分特殊页面背景颜色错位
        function adjustMarginTop() {
          const searchEngineContainer = document.getElementById('searchengine_container');
          if (searchEngineContainer) {
            const searchEngineContainerHeight = searchEngineContainer.offsetHeight; // 获取searchengine_container的高度
            const allElements = document.querySelectorAll('*');
            // 遍历所有元素
            allElements.forEach(element => {
              if (isMatchingElement(element)) {
                if (initialMarginTop === null) {
                  initialMarginTop = parseFloat(window.getComputedStyle(element).marginTop); // 记录初始的 margin-top 值
                }
                element.style.marginTop = `${initialMarginTop - searchEngineContainerHeight}px`;
              }
            });

          }
        }

        // 每隔一定时间进行检查和调整
        let intervalId = setInterval(adjustMarginTop, 200); // 每秒检查一次
        setTimeout(() => {
          clearInterval(intervalId);
        }, 2500);
        // 初始检查：在元素已经存在于DOM中的情况下立即调整
        adjustMarginTop();
        //修复搜索栏悬浮状态时遮挡搜索框

      }

    },
    Bing: {
      hide: 0,
      name: "Bing",
      icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB5ElEQVQ4jZ2Tv0sbYRyHX5Uzl8bLVNrSToUOHbr0T2gHqf1Baf8AvcUruNcpd5e75BK9H0Q9gptCogZKh6J2kWtDhkpxkmCwOIidijpYECoI5unQNo0QauwHnuUD78PL9/2+on9w0ItrWiSraiSNjER9w8NRTFUjuQvimhaJuKZ9ThaLJHyfGzMz3AxDRC6H7LooQYDi+50JApJhiJBVNVJ8nx7TZKhU4svhIYX1dW4XCsRsm4FstjOOg+K6fwXCMHiysMCfvKhUELp+OcHjcrkleL60hEil/l/wslKhxzAQuk6vaRLPZC5/g9dra5jVKvdnZ5FtG5FKIVkWSjeCB3NzvFpeBuD7yQnvd3YYW13lztQUsm1fLHhUKnE1n6e+v0973mxtIaXTJDKZLoY4Ps71yUneNhqt/uPuLrJlceUiwcP5ea5NTJCt1fh2fNzq321vI6XT/xacNZuUNzdpHBy0Dp41m1Tqde4Vi/RbVucZPG1bpPbU9vZ4triIlE7TZ5qdXyFmWdzyfYobG/w4PQXg69ERYysrKI6D0PXzu9Am+KAEAYrjELNthGEwVC5jVqvcDUOErv/6E45znlwOxfMQ8ujop2QYorguiueRcF16HQeRzSLl8wz87hXXPY/nkZye5icfi28JEi0cegAAAABJRU5ErkJggg==",
      url: "https://cn.bing.com/search?q=",
      parameter: "q",
      hostnameRegex: /(?:www\.)?bing\.com/,
      insertPoint: function(container) {
        document.getElementsByTagName("header")[0].appendChild(container);
      }
    },
    Zhihu: {
      hide: 0,
      name: "知乎",
      icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzYwLCAyMDIwLzAyLzEzLTAxOjA3OjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTA2LTI3VDE4OjE4OjAyKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wNi0yN1QxODoxOTozMyswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNi0yN1QxODoxOTozMyswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozY2VjYjNmOS0wNzUxLTQzNDItOWIzZi0wNTgyMTRmODZmOWEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6M2NlY2IzZjktMDc1MS00MzQyLTliM2YtMDU4MjE0Zjg2ZjlhIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6M2NlY2IzZjktMDc1MS00MzQyLTliM2YtMDU4MjE0Zjg2ZjlhIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDozY2VjYjNmOS0wNzUxLTQzNDItOWIzZi0wNTgyMTRmODZmOWEiIHN0RXZ0OndoZW49IjIwMjQtMDYtMjdUMTg6MTg6MDIrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6ivk0LAAACTUlEQVQ4jYXTX4hVVRQG8N8+59x7ZxzvjEVpWhcGFIIhzILqJVALhOixmaCXKDDffFQLzQFJo5ey3vpDoo8qYg9JBEJSUPgS1BgkEoGa6aCOd05z5/47u4dzMH1qw2LB2nt/a31rfSuYjXBAZrvUSin/ZyHTiYnP9ezL9LwntVeCIf7BKowoT7zfh9I1Q2pvrCuCXTGXGpOUtzObOH2J/m2MVUAFEmSiFCOCFUi0M0N1cIuZLRyfZvNROg9Sb/LrDdZNsHacJGOhJ/yxxO0OGhqZgWWFmi5vPl3Wd3KaLGPub078zv7naffI+8LGh/ngZ97+Bqv1EgO0mZrimRZbP+XiPJ/8yLb3mc8pIs8e47mPOX+NxyfQL3uWGCJjqcNj+/judEl37i+W57i6QK/gZpvlBfFmh35RNXxAFiKxx602u15gcoYNDzH7ItseZbHGlTs0ErqJkAWK6rNBmYwerSZPrhPXNmk2+OUK9YKxlOKejGJl9wGMc+EyM3t4+aOyxKPneePd0rdW0e0gFweDUk/6FUBUzblW6uTQNHmXL1/j9Z0sLjHeKB/XGsIjTdJQVm1IRiWSG0w+xTsv8cpn4uV54dxuXj1Ct8/1WRaWWD3KqQv/0chQl7O+xbd7OHeRU2fR5eDXXLrOEwf5agcffs/Z31hM8QCGRoId8Y6u8ckWU2s485MoFdSxLGoIYkUTxkQ1wShSeYLDRvjzKmd+QF0IoxWthiBUW5hhJVJBcncKhzOJWYVUzVsmjCLEWO1eenf7ykC/AgtyfCG3/1+c2dZRiDfRJgAAAABJRU5ErkJggg==",
      url: "https://www.zhihu.com/search?type=content&utm_id=0&q=",
      parameter: "q",
      hostnameRegex: /(?:www\.)?zhihu\.com/,
      insertPoint: function(container) {
        fixedContainer(container, () => document.getElementById('SearchMain'), 500, 3000);
      }

    },
    Yandex: {
      hide: 0,
      name: "Yandex",
      icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAADAFBMVEX4YEr4YUv7tKr8ycH5inr5hnX6qp74X0n6qZ3////80Mn8xr/6o5b4b1v+7+3++vn5f274dGH+9fT+8/H4cF37r6T7w7v7s6n7uK74b1z+8e/++fj4emf4cFz+8O7+9/b4d2X7ua/7tav7rKD+/f37xb35fmz97ev4eWb4cl74aFP8y8T6pJj5iXn+/fz92tX4blr4bFf++vr4ZU/6l4n4ZVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAA3C0QAAHYAAAAAAAAh+IAAAQsAAAAAAAAAAAD5EAC/CyF3lXYAAAELRACudjd3lXcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACVBhT4qHcAAN8A1gAAAAAAAAAAAAAAAAAAAAAAAABkAAAAAAAAAAKXkAAAAN8AAAAAAAIAAACAAAAA3/Pf+Kf4qACAAN8A35fWAAD5cAAsCyELIfmQ8UYGCXcAd5IAAAAAAAAAAAAAAAAAAAAAAAAQCQCCaxd2Je8h+dDv3QsAdiUAAAAGC3y6LFBSAHB2JfAAAGAABQCAAAAAAAAQAIAAAMAAAAAAAAAABZgAAAACAAAAAAB2AHT4qAD4AN8LIfkAAAAAAACoAAAA3/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAAABwAAALIfkAAEAAAADAAAALIfkAAAAAAAAMAAAAAAAAAAIBAQA2AAADn5Ih+hTpPgsAdiUAAAAAAAL5+AAACyEAAAAGC3y6LFAAAHAAAAAABZgAGACAAAAAAAAAAAAAAAAAAAAAAADyEusEAAAAAWJLR0Q2R7+I0QAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAHNJREFUGNNjYKARYGRiZgHRrMxs7AhRDk4uIMnOzcmDpJSXj1+AgUFQSFgESZBdlFOMgV2cU4Id2VRJKWkZWTl5BRSr2BU5lZRVVNlRHaDGr66hqYXuLG1OHUy36urpYwoaSAsZYhE0kiVO0NjExJRKQQkAVH4HZC9bKmcAAAAASUVORK5CYII=",
      url: "https://yandex.com/search/touch/?text=",
      parameter: "text",
      hostnameRegex: /yandex\.com/,
      insertPoint: function(container) {
        let mainElement = document.getElementsByTagName("main")[0];
        let parentElement = mainElement.parentElement;
        parentElement.insertBefore(container, mainElement);
      }
    },
    KuaKe: {
      hide: 0,
      name: "夸克",
      icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAC4jAAAuIwF4pT92AAAClElEQVQ4y7VUPWgTYRg+nbqojWhdMqQgiJs4uDgkVZPBISLaQRGKUdJBkOKimEBtpV20k+KQguJahC4iYgWVav1BRaFzBzVpkmt+G8ldyN3j93z33aW5VHHpCw8c933vc+/7vM+9GgDNhz6BQwI3BRYEfgiYAoZ6XlBnIYFt/nw/WVAgJbAooAtY6A1LnT0RSKicTQn7BdICNfxf2Io4rXK7CIPqYEXeFFfLxTa+vjEwP9vA7EQdmVt1zN1v4P3zJvRcW95RsaJygy5hn2pTVrZetfDuWROTF8s4cyCPE3tyiOxycHx3DqcG80ifK2H5gwnL8lhriiOgqQEsupWRbORIEccCOQz1O0ThHVkJPvMdcftyGYWfXZWSY0RTE6MWss3JRFmSMTm6N4dkWMfdqxXMjFVxJaojts85O70/j0fTdZQLbZeQHEskfOFOk5qxTVZAsmvxNXx6acBs2jANG9/eGrh+toTogEN64XABX14bG6ff0pS3ZHAArmbJcNEhMzo9tUwbn18ZGBVnvBMTxPOZRtfoNWVaGZmJmqcZ22Rl/jDEO56FdzqaMsdP6NWcGe8QzoxVuqqTPbVtVNcsTCXLHcLxXkKv5bl769IavMgBUDO2yahXLDx9/FsObfhgXt6hPMzxE3pDoWnjg85QOE0OgJqxze+C/NLRoudJgsRLIsc/FM82eraN1PkShpRtKPpoRMcdodmN4RJOBlc9b8ZDeTxI1VDM9tompH50myZd/mhK09JnbiVSL6WZQ7aKh1N1lAqesW3FEdHUCkq4VfJ3KvxqS9PSZ7GBTovUjG2yslKhaxHpimP735eD+DpNS59lNiwHasY2/7UctmR9bcmCdRHg1uDEaINNCFvqLELN/Pl/AGSMLPSsRFKQAAAAAElFTkSuQmCC",
      url: "https://quark.sm.cn/s?q=",
      parameter: "q",
      hostnameRegex: /quark\.sm\.cn/,
      insertPoint: function(container) {
        document.getElementById("page-channel-tab").parentElement.appendChild(container);
      }
    },
    QiHu360: {
      hide: 0,
      name: "360",
      icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAADAFBMVEX////x+vbK7t2+6tXJ7dzu+fTe9Op10qUpunQPsmQluXJv0KLZ8ua2588vvHjF7NoiuHASs2Y9wIJVyJFAwYMTs2csu3fR8OH2/PlDwoU4v3696dT7/v38/v3D7Ng/wYPw+vWx5cwnuXPh9euk4cR106aB1q2O2rZpzp5bypWw5cy+6dVOxo0hsGApr16w5csqr14esGBNxoya0KHenDjwmjTkypbk0aP0mTSSypXz4MH/mTL/oUT/7dr/8eT/pk3x2LL//Pn/sWT/qFH/4MD//Pr//fz/48j/rFn/rl3/+PL/+fT//v7/58//njz/mTP/t2//mjX/oUP/6tT/0aT/pEj/yJH/27j/p07/o0j/4cP/nDj/r2D/8+j/p0//pUv/xYr/8OL/vn3/s2b/5s7/+/f/7Nr/587/69f/+vX/6dT/+fPi+IAAAQYAAAAAAAAAAAD5EAC/BuJ3lXYAAAELRACudjd3lXcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACVBhRmcHcAAOAA1gAAAAAAAAAAAAAAAAAAAAAAAABkAAAAAAAAAAOOsAAAAN8AAAAAAAEAAADIAAAA4F/gZm9mcACgAOAA347WAAD5cAAsBuIG4vmQ8UYGCXcAd5IAAAAAAAAAAAAAAAAAAAAAAAAQCQCCZtR2Je/i+dDv3QYAdiUAAAAGC3y6LFBSAHB2JfAAAGAABQCAAAAAAAAQAIAAAMAAAAAAAAAABZwAAAACAAAAAAB4AHZmcAD4AOAG4vkAAAAAAABwAAAA4GYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAAABwAAAG4vkAAEAAAADAAAAG4vkAAAAAAAAMAAAAAAAAAAIBAQA2AAAOXJLi+hTpPgYAdiUAAAAAAAL5+AAABuIAAAAGC3y6LFAAAHAAAAAABZwAGACAAAAAAAAAAAAAAAAAAAAAAAB6L2TFAAAAAWJLR0RuIg9RFwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAANxJREFUGNOV0GkzwlEYBfAbUcdayRoiLUQhWY+tSKVNKBWVQrbv/575P5fhZefVmd/Mc2buVarbmHp6zX3/qd9iBTAwOPTHhkcgsY7+mtkG2B1jznFgYlLb1DQw45pVc/NOwL0guAh4ZGzpe8Yr6AP8+igALEtbAYIaV4E1jaHwukbXxmZE2lZ0e0fj7l50X9oBeXhktOMT8lQwFifPzhPqIpki05eZrKG5PFlIXaWL5PXNbamcMPSuQkm1Fqvw/kEW6uVGgWw+tlS2zafnn/e/dF7f3o3y8dnFj38BOb4gIfEaIJ0AAAAASUVORK5CYII=",
      url: "https://m.so.com/s?q=",
      parameter: "q",
      hostnameRegex: /m\.so\.com/,
      insertPoint: function(container) {
        document.getElementsByTagName("header")[0].appendChild(container);
      }
    },
    SouGou: {
      hide: 0,
      name: "搜狗",
      icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAC4jAAAuIwF4pT92AAAEvElEQVQ4y3WUe1CUVRjGsaYo0CbFskbRUCCnGKfy7mgwplkjM9oUaagg5RVvLCPgpMCyF0UF3V1ELiIKiw6ioogiAyorZNSCuqI1k8ruYoAiut5YLsI+T2eXJHe0P86c75x5z++8z/O+53Mh6eI0urtceefaOF5IkbMgTMeM6c1MHmNj0phupvo388AiHXUqGS0NI184K4bzxqOm4QKk4IH5tcyaZWZ+SCVPxWh5douK5Uo1T0TlMTe4kpoAMw8uOUl93go+bPJ8ObDryQBWqbYwZYKVud9eYW2OhBazD3uevtYXY/++b/Jh9V4Jd35upvwjK8u3K9kpzjoB7ZnZYdmzb7A8IYNNl6fwabvbyyT1Xm51Y92JecxeUMZk/+ss3arkg0bPXmB3pyt/0SioHmdlmTSd7RYPRyYtf/nxj5Ig6rWrWJW2gVXp0fwtZxUNx4NprPan1TKQD5qG8WhMOjd6t/H0Nhk7Hg9w4e2r45kbVMv931xh4+XJbH84kIajocxdqONmvw7KvEnpKDLOi4z9gNzkZeP2qfU8q/lZQAfRVDOZSV8YsGNWDX7VLnVhlVrOtBlm6vdJ2CVkGo4spmpqI2W+oFTAUr+u44lNu3kqQcXCmExqlxYyZbaeOUuOsOWmr10+KtIlkI41I2Gc0YUHQnTMW1gpzPZ2+HMqLpUJz7ISnXEmWUag1zv73NX+JhuvfkLzxYmixRwFQ8tNH+wMrMTqwSJIM62ZRVHavmqeU0kZ721jrJC4UUhUf1nH0kQl9flhrK+exsd3h9DW88rzRYIAY99yLVZ6iA3F6B6WylV9Aa1GH0dWaXOqGedrZYwoXtRQcv1QG+LHNEMzV4fC2GQ0GD7Ds8zt0PwNKix7WyxkH3azRKZ2agvY+rGx7lOe27WBe0OKuXG0BZL3iIghxNp3iTXvEBkhhbhr7HstOBilxpK3xGL7pCYejtA6NfDzjdxqGom6kjmoSIvE7u9LsWowEe4h4CMeoiwl0iHXPjJ+0iJsgDiUNa+Cmd9VOqTaISb9FNYUhPKWYSw6re7PZNln6LLCsXIQsWIgsXyQDUfiEvG0wxV3bnhDObMSoe4CUJYkY+IkM89nStjZ5s7jcTsQ69eCpJm12BNyHHlrs3EoJgW5a7KgmHYZywRs6duEPECPP3XT0dnmhtMpEYjwbYBktMmF98wjuXfRSSommHHp2DzcEmZXpEegQEAyhU87As9D6X8JCv+L2PpVFXb9cAwFm7ahvna8yLofHrUORoFUjqzwDNSdmdnr1YX9KxDtZcXuoDJYGof1SRQ9J4wfBWPtBJgujsftGz7oeNLfqbr2uDtGL1zTBcDS/H7vpuVvTxRvVkI28ToORqaj/vfJwr///Tk4Lnp8z8MBazGNwKH4BCTOLcL+9cn/BYmHjSKFEuuGtUE+1YCyXRJhtg/+fQ19DXxbFKBEsw6HZfG4ax6OfAEL7t8O6YwzuFAQ5HzzfZFpkTIBioAaRH9sxmZRuYwftdCuVyEnUoPU0DxIp4snNsqMPeFpuHouAMrAYsQLWE1xIHq6X31RTrvIVJe9DNF+RoT1Jxa7E4vciAVvEMGuxPzXidXeJlwpn4HWBk9krVXbM7PD7Of/Aa7HXbW/LOVCAAAAAElFTkSuQmCC",
      url: "https://m.sogou.com/web/searchList.jsp?keyword=",
      parameter: "keyword",
      hostnameRegex: /m\.sogou\.com/,
      insertPoint: function(container) {
        fixedContainer(container, () => document.getElementById("mainBody"), false, 3000);
      }

    },
    WeiXin: {
      hide: 0,
      name: "微信",
      icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAC4jAAAuIwF4pT92AAACYElEQVQ4y2P4//8/AzUxhsCX31+4L7y7YLzywYr4rqtdjeXnyqdln8peknMqZzGIDRIDyd3/fF/5379/jHgN/PjrI/+MWzMK3fe6nVVYL/9Daq3kf2wYJJdwLH7DlidbgkB6MAz88+8P042PN7QbLjb06GzWfoXLIGQss1b6j+l20wcgPSC9IDPgBu58utPXY6/Habl1sr+QNPwF0v+wGPYPKgfmg/SA9ILMABv46vsr8eTjyWtgCqTXSv1z3eNyHmhzb8Th8F2K6xW+w+RAbJAYSM5su+l9ZItAZlz7cE2PYd6dedm6m3VewiRAXp53e27O199fuY+8POLotNvxEkwOxAaJgeQKzxTORTYQZEbwoeD9DEAbdyJLaGxUfz/x+oSq9z/fC25/ut3feqfVLZgciA0SA8llnsxYji1sGYy3GT1GDyPTbSYPYo7GbAG5CDlcQWyQGEgOV+QxqG5Q+URMrBKLGYCueUhVA+OPxm8ExSwVDPsHNOcvw4I78zO1Nmm+pdRAjU3q71z3upxnePL1sRwwxpZRamD6ibQVJ16fsAXnlCvvr+gXnimYR2y2Q8Zam7Xe5J/OW3D5/WUDlMLh7Y+3IuXnyqaTYpjqRpVPjRcbe15+fymBtbSZf2deFiy9qW9U+wCkf6IbIr9e7ofVDstbxWeKZq9+uCr22ddn0jiLr+6r3Q1GWw2fVJyrmAaKrL5rfbVFZ4rmJB5L2ADMq2uLzxbP7r/eV7P3+V5PULlJsIDd9HhT6MbHG8OA3hcGFp4Mv//+ZgaxH315pPAYGHnvfr4TAoqxkFRiU4oBJH6RE5TfS94AAAAASUVORK5CYII=",
      url: "https://weixin.sogou.com/weixinwap?type=2&_sug_=y&_sug_type_=&s_from=input&query=",
      parameter: "query",
      hostnameRegex: /weixin\.sogou\.com/,
      insertPoint: function(container) {
        document.getElementsByClassName("hhy-navcontainer")[0].appendChild(container);
      }
    },
    TouTiao: {
      hide: 0,
      name: "头条",
      icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAADAFBMVEX////+/v7x8fHt7e3u7u719fXw8PDy8vLz8/P29vbl5eX/+/v/9PT/7e3/5ub/39//2Nj/0dH9ycn5wsLxyMj/u7v/tLT/ra3/pqb/n5//mZn/kZH/ior/g4P/fHz/dXX/bm7/Z2f/YGD/Xl7xiIj/gID/c3P/aGj/dnb/cnL/eHj/l5f/i4v/bGz/kJD/nZ3/9fX/7+//8vL//v7/rKz/j4//4eH/lpb/trb/xMT/kpL/oqL/3d3/3Nz/eXn/jo7/cHD/v7//Y2P/oaH//f3/sbH/5+f/mJj/ycn/7u7/y8v/zMz/yMj/X1//amr/fX3/vLz/29v/4+P/urr/wcH/5eX/7Oz/9vb/3t7/qKj/tbX/wsL/5OT/4uL/sLD/lJT/ZGT/gYH/e3v/jIz/6ur/vb3/w8P/np7/d3f/enr/ysr/8/P/Zmb/qan/dHT/YmL/YWH/b2//hIT/k5P/mpr/paXwu7v/r6//0tL/2dn/4OD//Pz9/f35+fnk5OT8/Pz09PTr6+vn5+f7+/sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACVBhR+CHcAAOAA1gAAAAAAAAAAAAAAAAAAAAAAAABkAAAAAAAAAASg8AAAAN8AAAAAAAAAAADgAAAA4Hfgfgd+CADgAOAA36DWAAD5cAAsA60DrfmQ8UYGCXcAd5IAAAAAAAAAAAAAAAAAAAAAAAAQCQCCY5t2Je+t+dDv3QMAdiUAAAAGC3y6LFBSAHB2JfAAAGAABQCAAAAAAAAQAIAAAMAAAAAAAAAABXQAAAACAAAAAAByAHB+CAD4AOADrfkAAAAAAAAIAAAA4H4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAAABwAAADrfkAAEAAAADAAAADrfkAAAAAAAAMAAAAAAAAAAIBAQA2AAALE5Kt+hTpPgMAdiUAAAAAAAL5+AAAA60AAAAGC3y6LFAAAHAAAAAABXQAGACAAAAAAAAAAAAAAAAAAAAAAAANN29TAAAAAWJLR0SEYtBacQAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAShJREFUGNNjYGBkYmZBAsysDAwMjGysjAxIgJGdg4GBnZMBDbBzMbAheNw8vHz8AoJCwgwiomLiEpJS0jKycvIKikrKIMCgogwHqmrqChqqmmBBLW0dXT19ZWUNXgNeQyNjE7CgqRmvuYWlsrKVgZm1pI2tHVhQ3sreQdRRWdnJmcfFxcBVByxo5cbjbmmhrOzh6eVqIubtAxb09fP3twmQkTMRlwgMCg6xAAmqhYYZhnPzRURGeUTHxIrFxYMEExKTklNEJdyVnVKdA9LS3TIg7sw0y1KUzFaV9JS3CM7xyQUL5nmIKirn22doySur56D5qEC9UMO/SKe4xLmUoazcItXSq6Kyys3ToBoSeDUMTLXoQcdax1DPgibKyVbPwNDQiCrY1MwAAIhjO1uH8gJKAAAAAElFTkSuQmCC",
      url: "https://so.toutiao.com/search?source=input&pd=synthesis&original_source=&keyword=",
      parameter: "keyword",
      hostnameRegex: /so\.toutiao\.com/,
      insertPoint: function(container) {
        fixedContainer(container, () => document.getElementById("head-bar"), 100, false, 3000);
      }
    },
    ShenMa: {
      hide: 0,
      name: "神马",
      icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzYwLCAyMDIwLzAyLzEzLTAxOjA3OjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTA2LTI4VDE0OjQ5OjE4KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wNi0yOFQxNDo0OTozNSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNi0yOFQxNDo0OTozNSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphNmVjYzViMy0wYjAxLTkwNGQtOWUyNC1kNDBiOWNmNGRiYTIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6YTZlY2M1YjMtMGIwMS05MDRkLTllMjQtZDQwYjljZjRkYmEyIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YTZlY2M1YjMtMGIwMS05MDRkLTllMjQtZDQwYjljZjRkYmEyIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphNmVjYzViMy0wYjAxLTkwNGQtOWUyNC1kNDBiOWNmNGRiYTIiIHN0RXZ0OndoZW49IjIwMjQtMDYtMjhUMTQ6NDk6MTgrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz60LnLGAAADW0lEQVQ4jXWVS2hcZRTHf+f7vjuPZNJ0Okns1KRVmhhSfMWqNSi0IrRIKYiLIgi+4sqIiHVRdFHQndiNCzeSFqugBNGN2hrRFqmtUqQ2hZY2xQRrYkpK83CaSeY+jot7MzMJ7Vmde7/7/fj/zzmcK/oOHsoreLyEYyO3CwEU8JPcS94rEPA3Pp8iDDqUfrJ8TA7B3hYXh3FocydogMxdiWEAIRsosY0yGBz9VZgCEbAELCZqtKZMsxuo7P4ev+8gBMm3Clggh+DoN3i0V2EKZNYSde4kfOA5tNi70qpxaK4dmb0BMwmQOqhHu6EmHELQpruJ2nYQrXuSqGlrDAqATJbojkcBQRvXo5v7IJWCcEVR1FWBCqQ9NNsGc1OY8l+YyVNQhqhnO8F9b6CFByH00dZuKnu+xFz7HffLADI/DekaMLErBD2vEt7/JurWQEMBM34Me+kIYffz2D+/QfPnCZ54G3vuczSbJ+h7HRamcWfeQ5auxX2rirVgpi/ifbeP9Bd7kBtX0GwRJY8Z/Rnzz29oYRPYFNGmx9FCJ7IwS9j7GmHn3riRsgwUIFLM5ROYy98StW1Gm4q4s4dxpz9B8PF3vU905yOwOI/79UO8o/sw0xexI0PY88djhkDNcqqRsHcXUddewrt2QyZH1LENgknCrqfxhvcTPPYW0cbtmLGjRF1PQbCAG96P/DcGLfG4xUAfwu5nCbcMoDYHJoMZPY6KI7z3ZXRtD5prQfMdII5gxwG0uAV38gNkbgxak+LpsmUPzORJvKEXsOeOgDW40wfxvh7Anv0MKiX8nR8RrX8YtRYkhfvhAGZ0GNbVYLCs0IDMjsE8aGsHRAJL1xE7ix3/CjN+Am17iMozhzETZ3A/vhsPcktC0KQP1S5rkhUM2noPVBaRpTloABpAouvIzRFEIqQ8AyliZbUproZb8WQEe2EI4x9DSv/GFwHSoIUimm1GFudqUlbBloFSHR0NsSODcDNWtmJheGvANkBl/pagJKQGXLaeiRXVjTwoaDoPnoVgceXZKqDBZ4KwDiuJstWRakSmLmEm/6gtV+ruhIDPhCNgkBJbya0CSV2eBnP1J1IXTsVD3LzqPARKQMCgQzhEGQh4EUfHrY2AzEzFSzedXK6vY8DV5Bdw6H+C7ToUtYG1fgAAAABJRU5ErkJggg==",
      url: "https://m.sm.cn/s?&from=smor&safe=1&q=",
      parameter: "q",
      hostnameRegex: /\.sm\.cn/,
      insertPoint: function(container) {
        document.getElementById("header").appendChild(container);
      }
    },
    DuckDuckGo: {
      hide: 0,
      name: "DuckDuckGo",
      icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzYwLCAyMDIwLzAyLzEzLTAxOjA3OjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTA2LTI4VDE0OjU3OjE1KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0LTA2LTI4VDE0OjU3OjE1KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wNi0yOFQxNDo1NzoxNSswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1NWY5NzNmMi1kMzZjLTZjNDctODAxMi1lN2I1N2ZkZmY2MjQiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoxYWY2YWU2Zi02ZTUyLTc5NDUtODBkZC00M2NkMTFhMWYxOWQiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozY2I0OGE3MS1mZDZjLWRlNGMtYThhYi1hNjc4ZmMyYmE2MTYiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjNjYjQ4YTcxLWZkNmMtZGU0Yy1hOGFiLWE2NzhmYzJiYTYxNiIgc3RFdnQ6d2hlbj0iMjAyNC0wNi0yOFQxNDo1NzoxNSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1NWY5NzNmMi1kMzZjLTZjNDctODAxMi1lN2I1N2ZkZmY2MjQiIHN0RXZ0OndoZW49IjIwMjQtMDYtMjhUMTQ6NTc6MTUrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4h8DtFAAAE90lEQVQ4jW2UbWydZRnHf/d9Py/nvaen9HRrx14AccDG0pa5AVsnWQGnTFkFImhICG9Ro/umJCRKjPJFDX5CP0iMMS4gmRFfaDBqKbg5RsWN1cq6tmvX9nRna3t6Xp9znue5n9sPWwgS/5+v//+6cl1XfmLmS/18XMZvYfzmfhlP3a468v1Wx7qNCKF0eaUYLl98L6qVx1D2sIzFGx/3Wv+bZIjqld1WruvbqX1fvs/ZvNWSiRQoCZEBITFe7Z6gOE9t9A+jrbnJF2Qi/ZqwbDAGAPHhhFGErpUfTe4e/FF26InOsLhI/dgw/sJ5Iq+KsGOoTBars5tE316cjTdQHfm9X/nzK88L2/2ecFyDMajD27rBGHSt/JXM4Bdfyj341XRl+AjexHu4W25CZdoJiwX8C5NE1TWChWka746gy6tkhx5XVr7n096pYxLEiJDWlcCoUe1N7tp/pP2hr6VKv/4JldePYHX1EB98gOz9j5HY/imiRo2oVAQpkbEEral/0zp7iraDjyLjyYHm+MmzwnbG1Tc/2aFUJvfTziee7a3+5SiVN15G5jpJ9O0lueN27GwHVi5Pcu/nMIk2vFPHESZCJtMEhTmCxVnaH3hK+PNT/cHShVelaTXvTO/7/Gd1eZXqX48ibYfkrv3UDn2LQmwD4uq9Whq8XYeI7b4HWg0wBtWWwxs/iff+CdJ33b8F+IIUseSA+4ntVv2fo0SNGsaJ4e64g1Q6TtT08H0NgCMMpbJH/eZ9WKkMUSvEaIGwbBon/4aV78Fet2FQWrl8n4zFCBZmEJYNysLKZMmmFL86OsY7p+cBkFIwWTAsBnmc+DUIEWBlQcRi+PMzmMDHvX7b9ZbKdW4CgS4tI2wHo0OCtRJx4O69N7Ll2hw0piCcZqhfoFcX8aoNMilFcxZKbyt0rYwuLaPaO1OWEEIYYzAmAiEhbNFcnCUH7Nm5BVpnYPLrBIuXCAou2AZsm+acQ/UMIK5u2UQghLR0eXVRSNmr2nKEl5eQQuBfKtDSEa6S4PvAGuFak5UTcaKWQDgCNOg6gEYmkqhsB3pirC7DleLpqNXEWb8RE7QQlo1emMK/vHSlc7oPrv0xznW30nlA03VQ0PUZSPeCsCHymtjdm5FuAn964oKM6pXjwdw54n0DCGWBVJjiPP7MxNWHEZC9G118iPpv6jRGDSsjUBkDEwKhR6J3D3ptmaAw+6YUtjtSHfndqN3VQ2rPAXStgvCb+PMztNBMVydZ8pZYcCPOqBg/73F4LW8hGwJTXcO98VaSO++i+tYfl4zWv7WEG/P8pbnnysMvD7c/+HQsuHgB790R1NRZ5kuzfP8/z1LxVhFGU30kTqHb4c5Jzb3vLONm83Q89R2890/QGHvzBzKZnlaHt3UjbWe2de6Mp1Jt92aHniRcXiI8N4F/yw7+FByjWJ6jK3Mdm1Zgw/gC+UKV2xLbWfeN5/EvLbDyyx/+Qij1XaEccwVfQmCCANNsPJM58PBzmf2H3OYHp9Fb+3m74yJtWnFb/g7k2D8ovfIi9O2io38Q7/RxSq/+7CV0eFjEEnWM+QgPhYAwJGrUhtwbbnkmNXDfTmfzVhJbd0LCvVLjNfHHT6IvFSideGOq8a+/vyBj8ReF4/4fwH5EkVfPEUUHVbptwFm/6SZ1zfqMEUJGlVItuFw4ry8X3jJR9LqMJ88jJGA+9P4XWQFAhlNU5A8AAAAASUVORK5CYII=",
      url: "https://duckduckgo.com/?t=h_&q=",
      parameter: "q",
      hostnameRegex: /duckduckgo\.com/,
      insertPoint: function(container) {
        document.getElementById("header").appendChild(container);
      }
    },
    Bilibili: {
      hide: 0,
      name: "B站",
      icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzYwLCAyMDIwLzAyLzEzLTAxOjA3OjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTA4LTA1VDExOjI1OjI1KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0wOC0wNVQxMToyNTo1NSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wOC0wNVQxMToyNTo1NSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2NTExMmQ2Yy1jODFhLTAyNDctOTg4ZC05MDdiODQyMDQ3ODIiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDphMjcwZjJkMi0zMGZiLTAyNDItOGZlNS0wOTcxMGYxYzk5Y2IiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxZGRmMmQ3MS1lN2Y5LTQxNGQtOGQ3ZC1hMGQ2NzY5NDY3YzUiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjFkZGYyZDcxLWU3ZjktNDE0ZC04ZDdkLWEwZDY3Njk0NjdjNSIgc3RFdnQ6d2hlbj0iMjAyNC0wOC0wNVQxMToyNToyNSswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2NTExMmQ2Yy1jODFhLTAyNDctOTg4ZC05MDdiODQyMDQ3ODIiIHN0RXZ0OndoZW49IjIwMjQtMDgtMDVUMTE6MjU6NTUrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5t2pzwAAABhUlEQVQ4jaXUvWsUURTG4WfHC0EUrbTUCAn40USiGMkfYGkRsLCRELSzsVEbCxsVVLBViASrdNbaiJ1iYbVaJJ1FjKggiBauYzFnd6/LXZNdXxjmcN/3/ObjnpmWlbZMp3Adr3AHv5VV4Wrkb0W+Z+Saw1ks4vQQmPAWIzs3eKVc6/iKaTzGfAE2H950ZNdzM2X1FDp4jTMZ9CY+RWYfboQnsp3oXYOWlXbCFVwMYxyt4RHuJ1zQbMD/aCoYX1LcGbRxG5sjwvbjGo5iKeFAGE/xZMw7PBzAg/ku/8zqSc1uThSaJ8KbLPVWqKPeEec9WMZzLBSAC+EtRzbvrQfnsAucxU7MFPyZ8GYzYE8l4A9sRP2h4HfXNiL7l9LgAj7jMo5gteCvooV3kR0KrLP6WRwlfcSDgbVeb6X/2L+GALajbm9V6b+HY9g1Bmx39ML3hBc4hHOa2fo2InAvTkb9MuGuZhSO+/c/cCu9xb2k+YbP4xJO6A/pdtXBGzzE+1Zd11vkR9MfcA5NaUkxMGUAAAAASUVORK5CYII=",
      url: "https://m.bilibili.com/search?keyword=",
      parameter: "keyword",
      hostnameRegex: /m\.bilibili\.com/,
      insertPoint: function(container) {
        fixedContainer(container, () => document.getElementsByClassName("order-tabs")[0], 100, true, 3000);
      }
    }
  };

  // 获取URL参数的值
  function getQueryString(params) {
    var queryString = window.location.search.substring(1).split("&");
    var paramArray = params.split("|");
    for (var i = 0; i < queryString.length; i++) {
      var pair = queryString[i].split("=");
      if (paramArray.includes(pair[0])) {
        return pair[1];
      }
    }
    return false;
  }
  // 在指定元素之前插入元素
  function insertAfter(newNode, referenceNode) {
    var parent = referenceNode.parentNode;
    parent.lastChild == referenceNode ? parent.appendChild(newNode) : parent.insertBefore(newNode, referenceNode.nextSibling);
  }

  //为元素添加滑动隐藏事件
  function SwipeUpToHide(element, callback, excludeElement) {
    if (!element) return;
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let hasMoved = false;

    element.addEventListener('touchstart', (e) => {
      if (excludeElement && (excludeElement.contains(e.target) || excludeElement === e.target)) {
        return;
      }
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      hasMoved = false;
    });

    element.addEventListener('touchmove', (e) => {
      if (excludeElement && (excludeElement.contains(e.target) || excludeElement === e.target)) {
        return;
      }
      endX = e.touches[0].clientX;
      endY = e.touches[0].clientY;
      if (Math.abs(startY - endY) > 30) { // 检测微小移动
        hasMoved = true;
      }

      // 阻止默认的纵向滚动，但不阻止 div 内部的横向滚动
      let canScrollVertically = element.scrollHeight > element.clientHeight;
      let canScrollHorizontally = element.scrollWidth > element.clientWidth;
      let isScrollingUp = startY > endY;
      let isScrollingDown = startY < endY;
      let isAtTop = element.scrollTop === 0;
      let isAtBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
      let isScrollingHorizontally = Math.abs(startX - endX) > Math.abs(startY - endY);

      if (!isScrollingHorizontally && ((isScrollingUp && isAtTop) || (isScrollingDown && isAtBottom))) {
        e.preventDefault(); // 阻止默认的纵向滚动行为
      }
    });

    element.addEventListener('touchend', (e) => {
      if (excludeElement && (excludeElement.contains(e.target) || excludeElement === e.target)) {
        return;
      }
      if (hasMoved && startY > endY && startY - endY > 50) { // 上滑检测
        element.style.transform = 'translateY(-100%)';
        callback(e);
      }
      // 重置变量以确保后续触摸操作正常
      startX = 0;
      startY = 0;
      endX = 0;
      endY = 0;
      hasMoved = false;
    });
  }

  //创建设置按钮
  function createSettingButton(container, searchEngines) {
    // 创建设置页面搜索引擎列表
    function createSearchEngineList(engine, currentParameter, engineKey) {
      var child = document.createElement("div");
      child.setAttribute("style", "font-size:16px;background-color:#DEEDFF;padding:5px;border-radius:5px;margin:5px;align-items:center;display:flex;");
      child.setAttribute("engine", engineKey.toString());

      var icon = document.createElement("img");
      icon.setAttribute("style", "margin:0 2px;vertical-align:middle;width:20px;height:20px;");
      icon.setAttribute("src", engine.icon);
      child.appendChild(icon);

      var title = document.createElement("span");
      title.style = "width: calc(100% - 220px);word-wrap: break-word;color:black";
      title.innerText = engine.name;
      child.appendChild(title);
      //创建顺序调整和隐藏/显示按钮
      var buttonContainer = document.createElement("div");
      buttonContainer.style = "margin-left: auto;";
      var buttonUP = document.createElement("button");
      var buttonDown = document.createElement("button");
      var toggleHide = document.createElement("button");
      buttonUP.style = buttonDown.style = toggleHide.style = "width:45px;height:27px;line-height:27px;color: #fff;background-color:#1677ff;border-radius:6px;margin:5px;font-size: 14px;border:0;padding:0;";

      toggleHide.innerHTML = "隐藏";
      buttonUP.innerHTML = "↑";
      buttonDown.innerHTML = "↓";

      // 添加隐藏/显示切换功能
      toggleHide.addEventListener("click", function() {
        if (toggleHide.innerHTML === "隐藏") {
          toggleHide.innerHTML = "显示";
          child.style.backgroundColor = "#dbdbdb";
        } else {
          toggleHide.innerHTML = "隐藏";
          child.style.backgroundColor = "#DEEDFF";
        }
        checkVisibleEngines();
      }, false);
      // 实现顺序调整
      buttonUP.addEventListener("click", function() {
        var parent = child.parentNode;
        if (child.previousElementSibling) {
          parent.insertBefore(child, child.previousElementSibling);
        }
      }, false);

      buttonDown.addEventListener("click", function() {
        var parent = child.parentNode;
        if (child.nextElementSibling) {
          parent.insertBefore(child.nextElementSibling, child);
        }
      }, false);

      buttonContainer.appendChild(toggleHide);
      buttonContainer.appendChild(buttonUP);
      buttonContainer.appendChild(buttonDown);
      child.appendChild(buttonContainer);

      return child;
    }
    //保存配置
    function saveEngineOrder() {
      var engineOrder = [];
      var hiddenStates = {};
      var engineList = document.querySelector("#settings_dialog div");
      engineList.childNodes.forEach(function(child) {
        var engineKey = child.getAttribute("engine");
        engineOrder.push(engineKey);
        var toggleHide = child.querySelector("button");
        hiddenStates[engineKey] = (toggleHide.innerHTML === "隐藏") ? false : true;
      });
      GM_setValue("engineOrder", engineOrder);
      GM_setValue("hiddenStates", hiddenStates);
      GM_setValue("expandSearchEngineChecked", expandSearchEngineCheckbox.checked);
      GM_setValue("floatChecked", floatCheckbox.checked);
      GM_setValue("hideOnScrollCheckboxed", hideOnScrollCheckbox.checked);
    }
    // 加载配置
    function loadEngineOrder() {
      var engineOrder = GM_getValue("engineOrder", []);
      var hiddenStates = GM_getValue("hiddenStates", {});
      var expandSearchEngineChecked = GM_getValue("expandSearchEngineChecked", false);
      var floatChecked = GM_getValue("floatChecked", false);
      const hideOnScrollCheckboxed = GM_getValue("hideOnScrollCheckboxed", false);
      return {
        engineOrder,
        hiddenStates,
        expandSearchEngineChecked,
        floatChecked,
        hideOnScrollCheckboxed
      };
    }
    var confirm_button_disabled
    // 检查是否符合保存条件
    function checkVisibleEngines() {
      var engineList = document.querySelector("#settings_dialog div");
      var visibleEngines = Array.from(engineList.childNodes).filter(function(child) {
        var toggleHide = child.querySelector("button");
        return toggleHide.innerHTML === "隐藏";
      });
      confirm_button_disabled = visibleEngines.length < 2; // 必须选择至少两个搜索引擎
    }
    //创建设置按钮
    var setting_button = document.createElement("div");
    setting_button.setAttribute("style", "font-size:16px;background-color:#DEEDFF;display:inline-flex;padding:5px;border-radius:5px;margin:5px;align-items: center;height:25px;box-sizing:unset;");
    var icon = document.createElement("img");
    icon.setAttribute("style", "margin:0 2px;vertical-align:middle;width:20px;height:20px;");
    icon.setAttribute("src", "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' width='100' height='100' viewBox='0 0 24 24'%3E%3Cpath d='M 9.6679688 2 L 9.1757812 4.5234375 C 8.3550224 4.8338012 7.5961042 5.2674041 6.9296875 5.8144531 L 4.5058594 4.9785156 L 2.1738281 9.0214844 L 4.1132812 10.707031 C 4.0445153 11.128986 4 11.558619 4 12 C 4 12.441381 4.0445153 12.871014 4.1132812 13.292969 L 2.1738281 14.978516 L 4.5058594 19.021484 L 6.9296875 18.185547 C 7.5961042 18.732596 8.3550224 19.166199 9.1757812 19.476562 L 9.6679688 22 L 14.332031 22 L 14.824219 19.476562 C 15.644978 19.166199 16.403896 18.732596 17.070312 18.185547 L 19.494141 19.021484 L 21.826172 14.978516 L 19.886719 13.292969 C 19.955485 12.871014 20 12.441381 20 12 C 20 11.558619 19.955485 11.128986 19.886719 10.707031 L 21.826172 9.0214844 L 19.494141 4.9785156 L 17.070312 5.8144531 C 16.403896 5.2674041 15.644978 4.8338012 14.824219 4.5234375 L 14.332031 2 L 9.6679688 2 z M 12 8 C 14.209 8 16 9.791 16 12 C 16 14.209 14.209 16 12 16 C 9.791 16 8 14.209 8 12 C 8 9.791 9.791 8 12 8 z'%3E%3C/path%3E%3C/svg%3E");
    setting_button.appendChild(icon);
    // 创建设置对话框
    var dialog = document.createElement("div");
    var title = document.createElement("h2");
    title.innerHTML = "设置<a target='_blank' style='float:right;color:#1677FF;font-size:15px;text-decoration: underline;' href='https://greasyfork.org/zh-CN/scripts/499230'>更新脚本</a>";
    dialog.appendChild(title);
    dialog.id = "settings_dialog";
    dialog.setAttribute("style", "position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);padding:20px;background:white;border:1px solid #ccc;z-index:1000;width:80%;white-space: normal;display:none;border-radius: 15px;box-shadow: 0px 0px 25px 0px rgba(0,0,0,0.7);font-size: 15px;line-height: normal;opacity:1;height: auto; max-height: 90vh; overflow-y: auto;");
    var engineList = document.createElement("div");
    engineList.style = "max-height: 65vh;overflow-y: auto;";

    // 读取配置
    var {
      engineOrder,
      hiddenStates,
      expandSearchEngineChecked,
      floatChecked,
      hideOnScrollCheckboxed
    } = loadEngineOrder();
    // 将列表元素按照配置顺序添加到设置页面搜索引擎列表
    if (engineOrder.length > 0) { // 如果engineOrder数组不为空，则按照engineOrder的顺序添加搜索引擎
      engineOrder.forEach(function(engineKey) { // 遍历engineOrder数组，对每个engineKey进行处理
        if (searchEngines[engineKey]) { // 检查searchEngines对象中是否存在对应的engineKey
          var engineElement = createSearchEngineList(searchEngines[engineKey], "#", engineKey); // 创建搜索引擎列表元素
          if (hiddenStates[engineKey]) { // 如果hiddenStates中对应的engineKey为true，则设置元素为隐藏状态
            engineElement.querySelector("button").innerHTML = "显示";
            engineElement.style.backgroundColor = "#dbdbdb";
          }
          engineList.appendChild(engineElement); // 将创建的搜索引擎元素添加到搜索引擎列表中
        }
      });
    } else {
      for (let engine in searchEngines) { // 如果engineOrder数组为空，则按照searchEngines对象的顺序添加搜索引擎
        engineList.appendChild(createSearchEngineList(searchEngines[engine], "#", engine)); // 创建并添加搜索引擎列表元素
      }
    }

    // 将创建的搜索引擎列表添加到对话框
    dialog.appendChild(engineList);

    // 创建确认和取消按钮
    var confirmButton = document.createElement("button");
    var cancelButton = document.createElement("button");

    // 设置按钮的样式和文本
    var settingButtonWrapper = document.createElement("div");
    settingButtonWrapper.style.cssText = "display: flex; align-items: center; flex: 1 0 100%; margin-bottom: 8px;float:right;";
    confirmButton.id = "confirm_button";
    cancelButton.style = confirmButton.style = "padding:10px 25px;border-radius:6px;margin:10px 5px 10px 5px;background-color:#1677ff;color: #fff;border:0;";
    confirmButton.textContent = "确定";
    cancelButton.textContent = "取消";
    settingButtonWrapper.appendChild(cancelButton);
    settingButtonWrapper.appendChild(confirmButton);

    // 为取消按钮添加点击事件监听器，点击时隐藏对话框
    cancelButton.addEventListener("click", function() {
      dialog.style.display = "none";
    }, false);

    // 创建展开搜索引擎的复选框及其标签
    var expandSearchEngineCheckbox = document.createElement("input");
    expandSearchEngineCheckbox.type = "checkbox";
    expandSearchEngineCheckbox.id = "expandSearchEngine";
    expandSearchEngineCheckbox.style.cssText = "width: 20px; height: 20px; border: 2px solid #1677FF; border-radius: 3px; outline: none; cursor: pointer; appearance: auto;";
    var expandSearchEngineCheckboxLabel = document.createElement("label");
    expandSearchEngineCheckboxLabel.htmlFor = "expandSearchEngine";
    expandSearchEngineCheckboxLabel.appendChild(document.createTextNode("展开搜索引擎"));

    // 创建复选框和标签的函数
    function createCheckbox(id, labelText, initialChecked) {
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = id;
      checkbox.style.cssText = "width: 20px; height: 20px; border: 2px solid #1677FF; border-radius: 3px; outline: none; cursor: pointer; appearance: auto;";
      checkbox.checked = initialChecked;

      var label = document.createElement("label");
      label.htmlFor = id;
      label.appendChild(document.createTextNode(labelText));

      var wrapper = document.createElement("div");
      wrapper.style.cssText = "display: flex; align-items: center; flex: 1 1 100px;";
      wrapper.appendChild(checkbox);
      wrapper.appendChild(label);

      return {
        checkbox,
        wrapper
      };
    }

    // 创建复选框及其容器
    var floatCheckboxObj = createCheckbox("floatCheckbox", "半悬浮在顶部", floatChecked);
    var hideOnScrollCheckboxObj = createCheckbox("hideOnScrollCheckbox", "向下滚动时隐藏", hideOnScrollCheckboxed);

    // 设置expandSearchEngineCheckbox的初始状态
    expandSearchEngineCheckbox.checked = expandSearchEngineChecked;

    // 创建expandSearchEngineCheckbox的容器
    var expandWrapper = document.createElement("div");
    expandWrapper.style.cssText = "display: flex; align-items: center; flex: 1 1 200px;";
    expandWrapper.appendChild(expandSearchEngineCheckbox);
    expandWrapper.appendChild(expandSearchEngineCheckboxLabel);

    // 创建总容器
    var wrapper = document.createElement("div");
    wrapper.style.cssText = "display: flex; flex-wrap: wrap; margin-top: 16px;";
    wrapper.appendChild(expandWrapper);
    var show_mode_tips = document.createElement("div");
    show_mode_tips.style.cssText = "flex: 1 1 100%;margin-top: 10px;"
    show_mode_tips.textContent = "浮动显示模式:";
    wrapper.appendChild(show_mode_tips);
    wrapper.appendChild(floatCheckboxObj.wrapper);
    wrapper.appendChild(hideOnScrollCheckboxObj.wrapper);

    // 添加互斥逻辑
    function addMutualExclusion(checkbox1, checkbox2) {
      checkbox1.addEventListener("change", function() {
        if (checkbox1.checked) {
          checkbox2.checked = false;
        }
      });
      checkbox2.addEventListener("change", function() {
        if (checkbox2.checked) {
          checkbox1.checked = false;
        }
      });
    }

    addMutualExclusion(floatCheckboxObj.checkbox, hideOnScrollCheckboxObj.checkbox);

    // 将复选框容器添加到对话框
    dialog.appendChild(wrapper);

    // 为确认按钮添加点击事件监听器
    confirmButton.addEventListener("click", function() {
      if (confirm_button_disabled) { // 检查确认按钮是否被禁用
        alert("必须至少显示两个搜索引擎。");
        return;
      }
      alert("刷新页面生效。"); // 显示提示信息
      saveEngineOrder(); // 保存搜索引擎顺序
      dialog.style.display = "none"; // 隐藏对话框
    }, false);

    var float_tips = document.createElement("span");
    float_tips.textContent = "(开启悬浮或滚动隐藏后向上滑动引擎栏可关闭搜索栏)";
    dialog.appendChild(float_tips);
    dialog.appendChild(settingButtonWrapper);
    // 将对话框添加到容器
    container.appendChild(dialog);

    // 为设置按钮添加点击事件监听器
    setting_button.addEventListener("click", function() {
      dialog.style.display = (dialog.style.display === "block") ? "none" : "block";
      checkVisibleEngines(); // 检查可见的搜索引擎
    }, false);
    return setting_button;
  }

  // 创建搜索引擎容器元素
  function createSearchEngineContainer() {
    var container = document.createElement("div");
    container.id = "searchengine_container";
    var wrap = GM_getValue("expandSearchEngineChecked", false) ? '' : 'white-space: nowrap; overflow-x: auto;'
    var floatWrapper = GM_getValue("floatChecked", false)
    let hideOnScroll = GM_getValue("hideOnScrollCheckboxed", false);
    if (floatWrapper || hideOnScroll) {
      var top_container = document.createElement("div");
      top_container.id = "searchengine_top_container"
      document.documentElement.insertBefore(top_container, document.body);
      document.body.style.position = 'relative';
      wrap = wrap + "position: fixed;top: 0;z-index: 10000;"
    }
    container.setAttribute("style", "padding:5px;text-align:left;width: 100vw;box-sizing:border-box;font-size:0;transition: transform 0.3s ease,opacity 0.3s ease;" + wrap);
    return container;
  }

  // 创建单个搜索引擎子元素
  function createSearchEngineChild(engine, currentParameter, ignoreHide = false) {
    if (!ignoreHide && engine.hide) return null; // 如果hide为true，则跳过创建
    var child = document.createElement("div");
    child.setAttribute("style", "font-size:16px;background-color:#DEEDFF;display:inline-flex;padding:5px;border-radius:5px;margin:5px;align-items: center;height:25px;white-space: nowrap;box-sizing:unset;");

    var icon = document.createElement("img");
    icon.setAttribute("style", "margin:0 2px;vertical-align:middle;width:20px;height:20px;");
    icon.setAttribute("src", engine.icon);
    child.appendChild(icon);

    var title = document.createElement("span");
    title.style = "width: calc(100% - 220px);word-wrap: break-word;color:black";
    title.innerText = engine.name;
    child.appendChild(title);

    child.addEventListener("click", function() {
      window.location.href = engine.url + getQueryString(currentParameter);
    }, !1);
    return child;
  }

  // 监听容器是否被移除
  function fixedContainer(container, getElementById, intervalTime = 1000, insertBefore = true, destroyAfterSeconds = null) {
    function insertContainer() {
      const targetElement = getElementById();
      if (!targetElement) return;

      const parentElement = targetElement.parentElement;
      if (!parentElement) return;
      if (insertBefore) { // 如果insertBefore为true
        // 插入到目标元素之前（父容器）
        if (container.parentElement !== parentElement || container.nextSibling !== targetElement) {
          parentElement.insertBefore(container, targetElement);
          // console.log("Container inserted before the target element.");
        }
      } else { // 如果insertBefore为false
        // 插入到目标元素里
        if (container.parentElement !== targetElement) {
          targetElement.appendChild(container);
          // console.log("Container appended to the target element.");
        }
      }
    }

    // 立即执行一次插入操作
    insertContainer();
    const timer = setInterval(insertContainer, intervalTime);

    // 根据参数决定是否销毁定时器
    if (destroyAfterSeconds !== null) {
      setTimeout(() => {
        clearInterval(timer);
        // console.log(`Timer destroyed after ${destroyAfterSeconds} seconds.`);
      }, destroyAfterSeconds * 1000);
    }
  }

  function fixTopOffset(top) {
    let timer, interval;
    let scrollYPosition = window.scrollY;
    document.addEventListener('touchstart', function() {
      clearTimeout(timer);
      clearInterval(interval);
      let allElements = document.querySelectorAll(".searchboxtop, .fix-wrap, .sbox");
      let searchengineTopContainer = document.getElementById("searchengine_top_container");
      let searchengineContainer = document.getElementById("searchengine_container");

      function fixElements() {
        if (!searchengineTopContainer) return;

        // 获取所有需要处理的元素，包括子元素
        let elementsToProcess = [];
        allElements.forEach(element => {
          elementsToProcess.push(element);
          element.querySelectorAll("*").forEach(child => elementsToProcess.push(child));
        });

        // 处理所有元素
        elementsToProcess.forEach(element => {
          if (element.id !== "searchengine_container") {
            let style = window.getComputedStyle(element);
            let isPositionFixed = style.position === "fixed";
            let isTopZeroOrAuto = style.top === "0px" || style.top === "auto";
            let isTopSet = style.top === `${top}px`;

            if (isPositionFixed && isTopZeroOrAuto) {
              element.style.top = `${top}px`;
              if (searchengineContainer) {
                setTimeout(() => {
                  searchengineContainer.style.opacity = '1';
                  searchengineContainer.style.transform = 'unset';
                }, 100);
                return true
              }
            } else if (!isPositionFixed && isTopSet) {
              element.style.top = "0px";
              window.scrollTo(0, window.scrollY - top);
              return false
            }
          }
        });
      }
      scrollYPosition = window.scrollY;
      fixElements();
      interval = setInterval(fixElements, 100);
      timer = setTimeout(() => clearInterval(interval), 1000);
    });
  }

  function initialContainer() {
    let fixStatus = false
    let hideOnScroll = GM_getValue("hideOnScrollCheckboxed", false);
    const engineOrder = GM_getValue("engineOrder", []);
    const hiddenStates = GM_getValue("hiddenStates", {});
    for (const key in searchEngines) {
      // 检测是否新增引擎
      if (!engineOrder.includes(key)) {
        // 将新增的引擎添加到 engineOrder 的尾部,默认显示
        engineOrder.push(key);
        hiddenStates[key] = false;
      }
    }
    GM_setValue("engineOrder", engineOrder);
    GM_setValue("hiddenStates", hiddenStates);
    const floatChecked = GM_getValue("floatChecked", false);
    if (document.getElementById("searchengine_container")) document.getElementById("searchengine_container").remove()
    // 获取当前页面的查询参数和主机名
    var currentParameter = "",
      currentHost = location.hostname,
      currentEngine = null;
    // 通过正则匹配确定当前搜索引擎，并获取其查询参数
    for (let engine in searchEngines) {
      if (searchEngines[engine].hostnameRegex.test(currentHost)) {
        currentParameter = searchEngines[engine].parameter;
        currentEngine = engine
        break;
      }
    }
    if (!getQueryString(currentParameter)) return
    if (currentParameter !== "" && !searchEngines[currentEngine].hide) {
      // 创建搜索引擎容器
      var container = createSearchEngineContainer();
      // 加载并按顺序添加搜索引擎子元素
      const engines = engineOrder.length > 0 ? engineOrder : Object.keys(searchEngines);
      // 遍历所有引擎键
      engines.forEach(engineKey => {
        const engine = searchEngines[engineKey]; // 获取当前引擎对象
        // 如果引擎存在且不在隐藏状态且当前主机名不匹配引擎的主机名正则表达式
        if (engine && !hiddenStates[engineKey] && !engine.hostnameRegex.test(currentHost)) {
          const child = createSearchEngineChild(engine, currentParameter); // 创建引擎子元素

          if (child) container.appendChild(child); // 如果子元素创建成功，将其添加到容器中
        }
      });

      container.appendChild(createSettingButton(container, searchEngines));
      // 将容器插入到当前搜索引擎页面的指定位置
      try {
        if (!hiddenStates[currentEngine]) {
          // 如果开启浮动或滚动隐藏
          if (floatChecked || hideOnScroll) {
            const topContainer = document.getElementById("searchengine_top_container");
            // 为顶部占位容器创建搜索栏并滚动到顶部
            topContainer.appendChild(container);
            window.scrollTo({
              top: 0
            });
            let searchEngineContainer = document.getElementById("searchengine_container");
            // 设定向上滑动并移除的行为
            SwipeUpToHide(searchEngineContainer, () => {
              setTimeout(() => topContainer.remove(), 300);
            }, document.getElementById("settings_dialog"));
            // 调根据搜索栏实际高度为占位容器设定高度
            topContainer.style.height = searchEngineContainer.offsetHeight + 'px';
            // 如果当前引擎是Baidu，修正其顶部偏移
            if (currentEngine === "Baidu" || currentEngine === "Google") {
              fixStatus = fixTopOffset(searchEngineContainer.offsetHeight);
            }
            // 优化哔哩哔哩搜索框位置
            const intervalId = setInterval(() => {
              const tabs = document.getElementsByClassName("tabs")[0];
              if (tabs) {
                const tabs = document.getElementsByClassName("tabs")[0];
                const search_bar = document.getElementsByClassName("m-search-search-bar")[0]
                if (searchEngineContainer && tabs) {
                  if (searchEngineContainer.style.transform === 'unset') {
                    tabs.style.transition = "margin-top 0.3s";
                    search_bar.style.transition = "margin-top 0.3s";
                    tabs.style.marginTop = searchEngineContainer.offsetHeight + "px";
                    search_bar.style.marginTop = searchEngineContainer.offsetHeight + "px"
                  } else {
                    tabs.style.marginTop = 'unset';
                    search_bar.style.marginTop = "unset"
                  }
                }
              }
            }, 100);
          } else {
            //非浮动模式，插入到指定点
            searchEngines[currentEngine].insertPoint(container);
          }
        }
      } catch (error) {
        console.error("Failed to insert search engine container:", error);
      }
    }

    // 下拉显示搜索栏或在滚动页面时隐藏
    const settingsDialog = document.getElementById('settings_dialog');
    let touchTimeout;
    let startY = 0;

    // 更新容器样式
    function updateContainer() {
      let searchEngineContainer = document.getElementById("searchengine_container");
      if (!searchEngineContainer) return
      if (settingsDialog.style.display === 'block' && !fixStatus) {
        container.style.opacity = '1';
        container.style.transform = 'unset';
        return;
      }

      // 滚动隐藏模式
      if (hideOnScroll) {
        const currentY = window.scrollY;
        let containerHeight = searchEngineContainer.offsetHeight;

        if (currentY > startY && currentY > 15) { // 向下滚动并且滚动距离大于15
          const fixWrapElement = document.querySelector(".fix-wrap-p.fix-wrap");
          if (currentEngine !== "Baidu" || !fixWrapElement || parseFloat(fixWrapElement.style.top) === 0) {
            container.style.opacity = '0.3';
            searchEngineContainer.style.transform = `translateY(-${containerHeight}px)`;
          }
        } else {
          container.style.opacity = '1';
          container.style.transform = 'unset';
        }
        startY = currentY; // 更新 startY 为当前滚动位置
      } else {
        // 半悬浮隐藏模式
        if (window.scrollY > 25 && floatChecked) {
          container.style.opacity = '0.3';
          let containerHeight = searchEngineContainer.offsetHeight;
          searchEngineContainer.style.transform = `translateY(-${containerHeight - 30}px)`;
        } else {
          container.style.opacity = '1';
          container.style.transform = 'unset';
        }
      }
    }

    function restoreContainer() {
      if (settingsDialog.style.display !== 'block') {
        container.style.opacity = '1';
        container.style.transform = 'unset';
        clearTimeout(touchTimeout);
        touchTimeout = setTimeout(updateContainer, 3000);
      }
    }

    // 监听触摸和页面滚动
    container.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
      restoreContainer();
    });
    window.addEventListener('scroll', updateContainer);

    // 初始调用以设置正确的状态
    updateContainer();

  }
  initialContainer()

})();