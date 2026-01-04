// ==UserScript==
// @name         知乎免登录
// @namespace    https://www.zhihu.com/
// @version      0.10.2
// @description  去除知乎烦人的登录提示，安卓端免app浏览
// @author       System
// @match        *://*.zhihu.com/*
// @run-at       document-start
// @connect      api.zhihu.com
// @license      GPL-3.0-only
// @note         20220812-0.10.2 移除右下登录浮窗,自动折叠盐选内容
// @note         20220812-0.10.1 修复移动端评论区关闭按钮
// @note         20220114-0.10.0 去除链接重定向;去除奇怪的搜索词;解决部分按钮显示页面崩溃问题;解决油猴插件兼容性问题#113512;删除未使用的代码
// @note         20210707-0.9.9 去除移动端可能不支持的可选链语法，提高兼容性
// @note         20210706-0.9.8 解决iPad专栏无法滚动问题
// @note         20210706-0.9.7 添加移动端专栏防APP跳转；修复移动端专栏无法滚动问题；移除失效功能：隐私保护用户回答显示
// @note         20210706-0.8.6 添加高清图加载（触碰图片时触发）；添加移动端搜索按钮
// @note         20210706-0.8.4 修复弹窗屏蔽

// @downloadURL https://update.greasyfork.org/scripts/396171/%E7%9F%A5%E4%B9%8E%E5%85%8D%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/396171/%E7%9F%A5%E4%B9%8E%E5%85%8D%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const isMobile = /(Android|iPhone|iPad)/i.test(navigator.userAgent);
    const isZhuanlan = location.host.startsWith('zhuanlan');
    const querySelectorAllAndSelf = (target, selector) => [...(target.matches(selector) ? [target] : []), ...target.querySelectorAll(selector)];
    {
        new MutationObserver((events, observer) => events.forEach((e) => e.addedNodes.forEach((target) => {
            if (target && target.nodeType == 1) {
                [
                    () => {
                        //屏蔽右下角弹窗
                        if(target.querySelector("button")?.innerHTML?.includes('登录')){
                            target.style.display = 'none';
                        }
                    },
                    () =>{
                        //折叠盐选内容
                        if(target.matches('.List-item')&&target.querySelector(".KfeCollection-AnswerTopCard-Container")){
                             target.querySelector('.RichContent-collapsedText').click();
                        }
                    },
                    () => {
                        //屏蔽登录弹窗
                        if (target.querySelector(".signFlowModal")) {
                            target.style.display = 'none';
                            document.documentElement.removeAttribute('style')
                            target.querySelector(".Modal-closeButton").click();
                        }
                    },
                    () => {
                        //移除链接重定向
                        querySelectorAllAndSelf(target, 'a[href*="link.zhihu.com"]').forEach(link => {
                            const match = /link\.zhihu\.com\/\?target=(.+)$/.exec(link.href);
                            if (match) {
                                link.href = decodeURIComponent(match[1]);
                            }
                        });
                    },
                    () => {
                        //移除奇怪的搜索词
                        querySelectorAllAndSelf(target, 'a[href*="www.zhihu.com/search"]').forEach(link => {
                            const svg = link.querySelector('svg');
                            if (svg) {
                                link.removeAttribute('href');
                                link.removeAttribute('class');
                                svg.remove();
                            }
                        })
                    }
                ].forEach(func => {
                    try {
                        func();
                    } catch (error) {
                        console.error(error);
                    }
                });
            }
        }))).observe(document.documentElement, { childList: true, subtree: true });
    } //END

    //简单模板渲染器
    function render(temp, data) {
        // console.log(render,temp,data)
        const get = (value) =>
            value
                .split(".")
                .reduce((prev, cur) => (prev ? prev[cur.trim()] : null), data);
        return temp
            .replace(/{%\s*if\s+(.*?)%}([\s\S]*?){%\s*fi\s*%}/gm, (match, v1, v2) =>
                get(v1) ? v2 : ""
            )
            .replace(/{{\s*(.+?)\s*}}/g, (match, value) => get(value));
    }

    //主页推荐内容显示
    function ReplaceHomePage() {
        const body_html = `
          <style>
          body{overflow-y:scroll;}
          .icon-refresh{    transition: filter .5s ease;}
           .icon-refresh:hover{
               filter: saturate(0.1);
           }
          .u-safeAreaInset-top {
              height: constant(safe-area-inset-top) !important;
              height: env(safe-area-inset-top) !important;

          }

          .u-safeAreaInset-bottom {
              height: constant(safe-area-inset-bottom) !important;
              height: env(safe-area-inset-bottom) !important;

          }

          .Card {
              margin-bottom: 10px;
              background: #fff;
              overflow: hidden;
              border-radius: 2px;
              -webkit-box-shadow: 0 1px 3px rgba(26, 26, 26, .1);
              box-shadow: 0 1px 3px rgba(26, 26, 26, .1);
              -webkit-box-sizing: border-box;
              box-sizing: border-box;
          }

          .AnswerCard {
              -webkit-transition: -webkit-box-shadow .3s;
              transition: -webkit-box-shadow .3s;
              transition: box-shadow .3s;
              transition: box-shadow .3s, -webkit-box-shadow .3s;
          }

          .QuestionAnswer-content {
              padding: 16px 20px;
          }
      </style>
      <style>
          .InfoItem {
              padding: 15px 0 14px;
              margin: 0 15px;
              border-bottom: .5px solid #d3d3d3
          }

          .InfoItemHead {
              font-weight: 600;
              font-size: 17px;
              color: #1a1a1a;
              line-height: 22px
          }

          .InfoItemContent {
              display: -ms-flexbox;
              display: flex;
              padding-top: 11px;
              -ms-flex-align: center;
              align-items: center;
              width: 100%
          }

          .InfoItenDirection {
              -ms-flex-direction: column;
              flex-direction: column
          }

          .InfoItemDes {
              flex: 1;
              position: relative;
              -webkit-line-clamp: 3;
              height: 63px;
              padding-right: 15px
          }

          .InfoItemDes,
          .InfoItemDes-circle {
              font-size: 15px;
              overflow: hidden;
              font-weight: 400;
              text-overflow: ellipsis;
              display: -webkit-box;
              line-height: 21px;
              letter-spacing: normal;
              color: #444;
              margin-right: 4px 15px;
              -webkit-box-orient: vertical
          }

          .EllTwo,
          .InfoItemDes-circle {
              -webkit-line-clamp: 2
          }

          .EllTwo {
              overflow: hidden;
              -webkit-box-orient: vertical;
              text-overflow: ellipsis;
              display: -webkit-box
          }

          .InfoItemImg-s {
              width: 112px;
              height: 74px;
              border-radius: 5px;
              background: #ccc
          }

          .InfoItemImg {
              position: relative;
              width: 100%;
              height: 144px;
              border-radius: 5px;
              overflow: hidden
          }

          .InfoItemImg-l {
              background: #ccc;
              position: absolute
          }

          .InfoItemFooter {
              font-size: 14px;
              color: #999;
              padding-top: 9px
          }

          .InfoItemAnswer,
          .InfoItemPoint {
              padding-right: 5px
          }

          .InfoItemPoint {
              padding-left: 5px
          }

          .InfoItemVideo {
              width: 100%;
              height: 194px;
              position: relative;
              display: -ms-flexbox;
              display: flex;
              -ms-flex-pack: center;
              justify-content: center;
              -ms-flex-align: center;
              align-items: center;
              overflow: hidden;
              margin: 10px 0 5px;
              border-radius: 5px;
              background: #ccc
          }

          .InfoItemVideo .VideoCard {
              width: 100%;
              height: 100%;
              overflow: hidden;
              z-index: 10;
              border: none;
              box-shadow: none
          }
      </style>
      <style>
          main {
              width: 1000px;
              margin: 0 auto;
          }

          .MwebVideo {
              border: none;
              height: 100%;
              width: 100%;
          }

          .icon-refresh {
              width: 45px;
              height: 45px;
              position: fixed;
              right: 15px;
              bottom: 120px;
              cursor: pointer;
          }
          .active {color: #444;font-weight: 600;}

          .HotList-item {
              display: -webkit-box;
              display: -ms-flexbox;
              display: flex;
              padding: 12px 16px;
              font-size: 14px
          }

          .HotList-item:not(:first-child) {
              border: none;
              border-top: .5px solid #d3d3d3
          }

          .HotList-itemPre {
              -ms-flex-direction: column;
              flex-direction: column;
              -webkit-box-align: center;
              -ms-flex-align: center;
              align-items: center
          }

          .HotList-itemBody,.HotList-itemPre {
              display: -webkit-box;
              display: -ms-flexbox;
              display: flex;
              -webkit-box-orient: vertical;
              -webkit-box-direction: normal
          }

          .HotList-itemBody {
              -webkit-box-flex: 1;
              -ms-flex: 1 1;
              flex: 1 1;
              -ms-flex-direction: column;
              flex-direction: column;
              overflow: hidden;
              margin: 0 8px
          }

          .HotList-itemIndex {
              line-height: 24px;
              font-size: 18px;
              color: #c2a469;
              font-weight: 600;
              font-synthesis: style
          }
          .HotList-itemTitle {
              font-size: 16px;
              line-height: 24px;
              max-height: 72px;
              font-weight: 600;
              font-synthesis: style;
              margin-bottom: 4px;
              display: -webkit-box;
              text-overflow: ellipsis;
              overflow: hidden;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
          }
          .HotList-itemMetrics {
              display: -webkit-box;
              display: -ms-flexbox;
              display: flex;
              -webkit-box-align: center;
              -ms-flex-align: center;
              align-items: center;
              color: #999;
          }
          .HotList-itemImgContainer {
              position: relative;
              display: -webkit-box;
              display: -ms-flexbox;
              display: flex;
              -webkit-box-align: center;
              -ms-flex-align: center;
              align-items: center;
          }
          .HotList-itemImgContainer img,.HotList-itemImgContainer span {
              border-radius: 5px;
              width: 150px;
              height: 100px;
              -o-object-fit: cover;
              object-fit: cover
          }
          .HotList-item:nth-child(1) .HotList-itemIndex,.HotList-item:nth-child(2) .HotList-itemIndex,.HotList-item:nth-child(3) .HotList-itemIndex,.HotList-itemIndexHot{
              color: #f1403c;
          }
          .HotList-itemExcerpt {
              overflow: hidden;
              text-overflow: ellipsis;
              color: #444;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 6;
          }
      </style>
      <div>
          <div class="LoadingBar"></div>
          <div>
              <header role="banner" class="Sticky AppHeader" data-za-module="TopNavBar">
                  <div class="AppHeader-inner"><a href="//www.zhihu.com" aria-label="知乎"><svg viewBox="0 0 200 91"
                              fill="#0084FF" width="64" height="30">
                              <path
                                  d="M53.29 80.035l7.32.002 2.41 8.24 13.128-8.24h15.477v-67.98H53.29v67.978zm7.79-60.598h22.756v53.22h-8.73l-8.718 5.473-1.587-5.46-3.72-.012v-53.22zM46.818 43.162h-16.35c.545-8.467.687-16.12.687-22.955h15.987s.615-7.05-2.68-6.97H16.807c1.09-4.1 2.46-8.332 4.1-12.708 0 0-7.523 0-10.085 6.74-1.06 2.78-4.128 13.48-9.592 24.41 1.84-.2 7.927-.37 11.512-6.94.66-1.84.785-2.08 1.605-4.54h9.02c0 3.28-.374 20.9-.526 22.95H6.51c-3.67 0-4.863 7.38-4.863 7.38H22.14C20.765 66.11 13.385 79.24 0 89.62c6.403 1.828 12.784-.29 15.937-3.094 0 0 7.182-6.53 11.12-21.64L43.92 85.18s2.473-8.402-.388-12.496c-2.37-2.788-8.768-10.33-11.496-13.064l-4.57 3.627c1.363-4.368 2.183-8.61 2.46-12.71H49.19s-.027-7.38-2.372-7.38zm128.752-.502c6.51-8.013 14.054-18.302 14.054-18.302s-5.827-4.625-8.556-1.27c-1.874 2.548-11.51 15.063-11.51 15.063l6.012 4.51zm-46.903-18.462c-2.814-2.577-8.096.667-8.096.667s12.35 17.2 12.85 17.953l6.08-4.29s-8.02-11.752-10.83-14.33zM199.99 46.5c-6.18 0-40.908.292-40.953.292v-31.56c1.503 0 3.882-.124 7.14-.376 12.773-.753 21.914-1.25 27.427-1.504 0 0 3.817-8.496-.185-10.45-.96-.37-7.24 1.43-7.24 1.43s-51.63 5.153-72.61 5.64c.5 2.756 2.38 5.336 4.93 6.11 4.16 1.087 7.09.53 15.36.277 7.76-.5 13.65-.76 17.66-.76v31.19h-41.71s.88 6.97 7.97 7.14h33.73v22.16c0 4.364-3.498 6.87-7.65 6.6-4.4.034-8.15-.36-13.027-.566.623 1.24 1.977 4.496 6.035 6.824 3.087 1.502 5.054 2.053 8.13 2.053 9.237 0 14.27-5.4 14.027-14.16V53.93h38.235c3.026 0 2.72-7.432 2.72-7.432z"
                                  fill-rule="evenodd"></path>
                          </svg></a>
                      <ul role="navigation" class="Tabs AppHeader-Tabs">
                          <li role="tab" class="Tabs-item AppHeader-Tab Tabs-item--noMeta"><a
                                  class="Tabs-link AppHeader-TabsLink is-active" href="//www.zhihu.com/"
                                  data-za-not-track-link="true">首页</a></li>
                      </ul>

                      <div class="SearchBar" role="search" data-za-module="PresetWordItem">
                          <div class="SearchBar-toolWrapper">
                              <form class="SearchBar-tool" method="get" action="/search" @submit.native.prevent>
                                  <div>
                                      <div class="Popover">
                                          <label class="SearchBar-input Input-wrapper Input-wrapper--grey">
                                              <input type="search" name="q" maxLength="100" value="" autoComplete="off"
                                                  role="combobox" aria-expanded="false" aria-autocomplete="list"
                                                  aria-activedescendant="null--1" id="null-toggle"
                                                  aria-haspopup="true" aria-owns="null-content" class="Input"
                                                  placeholder="搜索内容" />
                                              <input type="text" name="type" value="content" hidden>
                                              <button aria-label="搜索" type="submit" class="Button SearchBar-searchButton Button--primary">
                                                  <span style="display:inline-flex;align-items:center">​
                                                      <svg class="Zi Zi--Search SearchBar-searchIcon" fill="currentColor" viewBox="0 0 24 24" width="18" height="18">
                                                          <path d="M17.068 15.58a8.377 8.377 0 0 0 1.774-5.159 8.421 8.421 0 1 0-8.42 8.421 8.38 8.38 0 0 0 5.158-1.774l3.879 3.88c.957.573 2.131-.464 1.488-1.49l-3.879-3.878zm-6.647 1.157a6.323 6.323 0 0 1-6.316-6.316 6.323 6.323 0 0 1 6.316-6.316 6.323 6.323 0 0 1 6.316 6.316 6.323 6.323 0 0 1-6.316 6.316z" fill-rule="evenodd"></path>
                                                      </svg>
                                                  </span>
                                              </button>
                                          </label>
                                      </div>
                                  </div>
                              </form>
                          </div>
                      </div>
                      <div class="AppHeader-userInfo">
                          <div class="AppHeader-profile">
                              <div></div>
                          </div>
                      </div>
                  </div>
                  <div></div>
              </header>
          </div>
          <main role="main" class="App-main">
              <div class="Card AnswersNavWrapper">
                  <div class="ListShortcut">
                      <div class="List Profile-answers" id="Profile-answers" data-zop-feedlistfather="1">
                          <div class="List-header">
                              <div class="List-headerOptions">
                              </div>
                          </div>
                          <div class="scroll">

                          </div>
                      </div>
                  </div>
              </div>
          </main>
          <img class="icon-refresh"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFkAAABZCAYAAABVC4ivAAAAAXNSR0IArs4c6QAADatJREFUeAHtXQmQFNUZ/npmZ+9dFlgRMXgB3rpoIkbk0sjGBIlXDokG14oENeZQQwEiBGQXjYYqUVNG0RLPUIYyHmgQsQKIQCyv1QoGEA9AEYRl73un8/3b03PszM5Md7+enezuq+rt3u73/ve/b17/73//+9/fGtIpLdEHw49R0DCSbI2AzkPDEF7n8zqf5zweOTyaeDTwWT3P9Xx2gNe7eL2L15/Ag524XTvE/9MiaT3KxUK9CD6cRx7OJ7jjCNSJyvjRsYNgbyK9t9CGLVioVSujbZFQ6kFeqOfCi4sJ6I/J6wQeHos828nuZ6GN7OWr0IE1BLzRDhG7ZVIH8hL9VPbWGWT0Eh7y2vdUamDFq/nTLqdI2ZYKJtwH+S79LPae37ExpalokMU61vKtWoa52vsWy1nK7h7If9JPQjsW8hWdaImjnsisYQMyyOtsbbsb1asH+V49D624lcz+igB73WDaFZoa3zfgERRjKWaqldlqQV6sl3JAu4vMHuUKEKkhuo+dYy7ma2tVVacG5IV6Jl+3eWRKBrbekpZT3FVQE2l12iDnIN+tH0NmHiYjJU6ZScPylew8MzFH2+2EN2cgl+vfZeUreBQ6YSLNy9aSvzLcoW21y6f9icBiXSYUf2PFvRlgwbWws53SXpvJHsjl+tWs+FEOEFk26/3/KibtlPZKu20k6+LCqOheG3X1liKzKDqesdIYayAbIuJRVmDvDbDCWfrm9fMNvp4q3ppkWUweZBnkRAb3FRERD0ENLcRhWrKDYXIgG2qaKOe9fZCLB23XZ7VU70qTUe8Sv/Yy0TD04H6AI2Eu7MRF8EmQEoPswx2k0RsnGgmgSepxCRcdBJ+4Kb64MGwRK+JS6H8IyueyeLaO7kEWa1oLVxN6yNiT74M2ZRQyRx8J30mDkSHH8UXw+nWguR26HA1t0PfUomP7IbS//RXa1n6K1n31XBpIfdpHTXoCZmmyIBCVuge5XF/A3DdElXDxRp4PuOwkZP/0VGSXHo/s7AzqMxbTRwfQ9tRHaFzxIZq+aWQfS1XS8BDmaYtjVRe7EYbBfR1ZTIk9OCcDuHUM8v5wHvKLstXo4K0d0B+vROOiN1Gfkt4t9ugMXBTL8B8b5HJ9JX8RWeR0NXlZ+/WjkbNgPAqGFUT+oBQL+tYv0frBfrR/uB9tcpZeKgzlZUJjr9cKs+A5pRjekiHwTToWmWOGIdPriez9Te3w37MF9YvfREOH2/1aVljmadO6ghYNsrEm90rXjKr/PyofnlVXomjstyLtH5Sx7U/wVV/+Php311qTrwOzoV19OrJnno2804/guB+W3t2H1ukvoXrbwc4VkLAnii+9mNJ1zTAa5HJ9Bat1ddFz/HD4nrsCA4fmh3rvFzVov+V11L6wHS0qOtyUEci85yIUnlocApsDpX/aP1D98k4O6e6ltZwJloWTjwTZWLZfF55B9fVNZyPnvlIM8HmN17qdloD730bD/A2oa2xXW5uHrbtlDHIrJqEwKzCIdrC+3/PHfPAduOd74aFsDnM3iJyMGH4RalsaRk1e5b/8IATwl3VoP/dxHLztDfUAS7Wi7i39NxrHPoGDnxzm/IxJZLaMA3LtWuqCY6gni2dPBipZsSuOJxccB9+aqzA4M9CDd1ahffIzOPSFRblrF5jiHGjrrsagEurd45/EoU17jEHULr0E5Rr4k5aYnkqhniyuUy4BzEHI+/yVGGQCXLkfrePYu1IFsABysAn6xKdQNesN1LoMsFSXx9EmuJISAtnwTZMMSpO8Kk9fiiJT//26Hh2lz6LqQConCoEW1dBA+eetLsricOTC8DRAFu9Kl/TiGznQ8RXttFSJ7nvNi6juCYDD25+i6wkwcA3MrrwYy4pDvVoRF6K33jkJBSa5ik2of+Nz+hf1jeShyBBcA8B6jH9Ut718EvIH5xi68C6O7jLFVV2HSnohLUAR1QCuRu8VB2zFKZf2iLIzkWuSXfIW6l2f1pqV2Tgvmoi85jkYevcFnR79NijEKBLA1QPZQqDSwz1Ql1jTcn3GmyK9WKbKMdhIi1uXnYisBeNQINrP7LEomEoTqxLGBFfi66F1YJQSgl2IXHUass1byzijS9dePLwAnscuwQDyGpQWy6egiGIu+L/ZDltn4is2q5G2CscpVEgrmdiDzSy0RzSb1+l0lmn3s5ejaFBg3DB5O5Ja7sM/7ATevGX/THxFJo+wTyF2yUtGIcu0FYh5ck+dNWtabKrq7945AfnjhkdaAc1arjwZOdfQDGD+7+A8wkPDvHKQvz00ZPlasys9e/GFnObPPT/+IPfA9zHgaIoTBwDL+h9BNvbJOaLTtXDJUFpBAqnygGGYMf9Ph7PYMTgLHUhxEVfuyiz1iR85FBvEV34l2YSoNA0vNHRjIbqXC51KiSsg9thUDOCiQVJLa987Dtk3f8eR1S5fxIVykNlTgg3Ym2byeBhXZKaOtCZrbznXAUbEV15rRyCPHAjvz05BNqfQQdnF0Tr4Gk6jKieLmtIB62mgWcNl+0+re653ixuBGIooCoI8Jno5xC7tIOVr9LndSwJBgKwS2/VrHHFCUUgGJypf0wz/sQ/igDQ0UV63nh83AJ7JxyOrQLyOmbI4Mi250PDz02nEkoVXs+7D5PfvH6PFQcfwS0+WmZhtQz2ZspS4wqxxJqj1JMif18C//IPQDHQE30YTZAF1zr9CIFtqXOzMTdKDY3q9xM4ffXfpVmsMvbADzSnxg4hmtds7HKiDb/I3Tcp1+gZR4YKvRrdcxHnw0Htoev2z5HRhrul1zHgFNXHI9cgj6sLBgXpPjeLxgvjKL+gIZEGl7CXUHE7QA2SVmAb7w4e4DNQjSMap9Cw6x5iPK79WrtcTZAnI4TB9RSe/m1+L30MrNqNu/ReuLl7absXFI0NT63fprWSbUKyCxFfEhUQ8cZye/Q+aOQrHNGdu3I2WRRudyX7HDHZD4BjK49MC3kbiKbpateML8RVxoQRkacMNr6KGg1rEDI/ioUO8dhzqmt1A5Pz2FSeHJiZrObbUtSoXZwRZYvYoSlXN0H+5GhKGxpS7+nUvo1rEiaIqlJIRh8ffnBNSX1fybVRagRAjvh4qLztVEv7nLrTKgmkTZ1YL6HpFv7O0XTi9rgQ55kRK/ORcsXsTX2NquVhfT9l8okqw052W9OIdN4Vmqw+8g/rfvoY6pXxLsKn52iRDCTeiTimln+7E7pyIfLMXH2xEx/z1zlXZqDYHcDVnOm9FZejFN2i3yJwzNmQYm7cedS5N8ztxNUCWuGl0guzFuAabNjQPHnEbMw3273+NVjqcx1Q9g4XsXfipcQuugTm7EZhuoz1a1kvNPg+54l1kvaSzEgLw2p9j0BBxB2SSWaq4jZmqkDPqUaU30quzM+CfKS5E1VgVlc2FGxOPge9umhXX/wKDh+SmDmhuT/NsuhaDzwhMoVs48bh8Fapc294QhmcIZIn859Ail8xvcj8XJ5lPO5ON3XIdis8ZlrwtOhn6sfJIHZumo5gmzc61R7EZl1F/37Bb8RQ6VHkDp2TBKAIhkI3QiqtD+dy5+uu7dHSRYAZMMrpL40V8iEqlOsm+wGWTUbDlWhSbu6tklWYmZ6Yrt7kw8Qg1YLXpAC63IpuWgj0jUqlsmlnJjTn5mSE77vYqtM1eh7oXFdgOxGmFfhNZS7kxh7bizt4r9X5FU+tPnsfhzXtd68FSjYx0EXtGIkGWDCnY/STVcBuv98mpKBpzdKTf2ceH0PbIe2h8+iM0iXe85E02idydMRq50+noGG4jlvJv0khFgKv3N7iuRSXY/STcpGgfn1QlPe7285E3lzqr6Zwo9yWJw/g73C9NudkiGyX/y/3TtVwXlIXQhoAR58wjkcG91xki32XDJGWvT+viSyGbf/64AfWP0+ExJUaqpPbxSQsrdInQMlEuU5Hoe+aZPx5515cgz3TvclpvFdUzLojW3fc2Glsi7IJOKccpn/SOVKGR4r3VJtviSTn9DOTIMdpw9YoWZ2bmGGfZ4ksDVctz29D00g608P/UJct7q4W1Cn0+e/ONqeMysibRoUtPQNY5R8F3cjEyhg+Al47lmkQO4IZ3jWIBn9F/Q8IwyMEdVW2vfoIW1RsuI7mK85/lKAFCq4fjXcRpTjo+ihvvIqQnd2VdAmRI9NX+lBgBwambgCJSuHuQ5amEt5XIfv0pHgLL44XGkYLxQZYcbSjnX9kO3J+iEaikA0FF9O3IO8mN3v1x4SJRM/5TGBdOCBrxg8soOtyMExGrIel5z8ChLJnAe9KAxOLCbKbED/Z3qnR9wrhvNjvG2d+Jg4V4ysmDLLUZQUBnx6i4L92aHcAh6TZbA1nIGmFtZ/Gqr/Voaa/lsL4CWXIDn+TsmiTMr4ex0PpCFFqRwSIqLYTzDYfLPshCpT+mfTiW3V5bFxfhpET4S3jb3qtHy9cZSpONkxwOTfi1M5CFkqh37bi0180MZaYr7XL4+QuByJm4EArhqf+LOeFoBK/VgixkDevdbfz5ZnBQDG4TCNaYrhdiD9b5+bgsfvspjrHHDvvqQTa56P+KmYmEYnERJBt20f89vhSAbOLd/2VJE4kUnPu/kZoCkMOrkLhpEtZLok659bVfPzZzSNtMj54+9LXfcJC7Xif+brVstpdoKrK3o57CTvYgpv13q/8He0Y4OVrhx44AAAAASUVORK5CYII="
              alt="刷新">
          <div data-zop-usertoken="{}"></div>
      </div>`;
        const Hotitem = `
      <div class="HotList-item" data-za-detail-view-path-module="FeedItem">
          <div class="HotList-itemPre">
              <div class="HotList-itemIndex">{{index}}</div>
              <div class="HotList-itemLabel" style="color: rgb(241, 64, 60);">
              </div>
          </div>
          <div class="HotList-itemBody">
              <a class="HotList-itemTitle" target="_blank" href="https://www.zhihu.com/question/{{target.id}}">{{target.title}}</a>
              <div class="HotList-itemExcerpt">{{target.excerpt}}</div>
              <div class="HotList-itemMetrics">{{detail_text}}</div>
          </div>
          <div class="HotList-itemImgContainer">
              <img src="{{children.0.thumbnail}}"
                  alt="{{target.title}}">
          </div>
      </div>
      `;

        if (
            location.href.endsWith("://www.zhihu.com/") ||
            location.href.includes("://www.zhihu.com/signin")
        ) {
            window.addEventListener("DOMContentLoaded", () => {
                document.body.innerHTML = body_html;

                let is_end = false,
                    update = 0,
                    loading = false;
                const target = document.querySelector("div.scroll");
                const pad = (num, n) => (Array(n).join(0) + num).slice(-n);
                function load(reload) {
                    update = new Date().getTime();
                    loading = true;
                    const xhr = new XMLHttpRequest();
                    xhr.open(
                        "GET",
                        "https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=50&desktop=true"
                    );
                    xhr.addEventListener("load", function () {
                        const data = JSON.parse(this.response);
                        is_end = data.paging.is_end;
                        const parser = new DOMParser();
                        data.data
                            .map((val, i) => ((val.index = pad(i + 1, 2)), val))
                            .map((val) => render(Hotitem, val))
                            .forEach((val) => {
                                const doc = parser.parseFromString(val, "text/html");
                                target.append(doc.body.children[0]);
                            });
                        loading = false;
                    });
                    xhr.send();
                }
                const scroll = () => {
                    if (is_end || loading || Date.now() - update < 100 || target.scrollHeight - window.scrollY > 1000) {
                        return;
                    }
                    load();
                };
                window.addEventListener("scroll", scroll);
                const reload = () => {
                    [...target.children].forEach((e) => e.remove());
                    load(true);
                };

                document
                    .querySelector("img.icon-refresh")
                    .addEventListener("click", reload);
                scroll();
            });
        }
    } //END

    //隐私保护用户信息显示
    function NoHiddenUser() {
        window.addEventListener('click', e => e.target.nodeName == "SPAN"
            && e.target.classList.contains('UserLink')
            && window.open('https://www.zhihu.com/people/' + JSON.parse(e.path.find(e => e.classList.contains('AnswerItem')).dataset.zaExtraModule).card.content.author_member_hash_id, '_blank'));
        window.addEventListener('load', e => {
            const css = document.createElement('style');
            css.innerHTML = `span.UserLink{cursor: pointer;}`;
            document.head.append(css);
        });
    } //END

    function AddSearchButton() {

        window.addEventListener("load", () => {
            if (location.pathname == '/search')
                return;
            const node = document.querySelector('.MobileAppHeader-actions');
            if (!node)
                return;
            const link = document.createElement('a');
            link.href = '/search?type=content&q=';
            link.className = "MobileAppHeader-downloadLink";
            link.innerHTML = "搜索";
            node.insertAdjacentElement('afterBegin', link);
        });
    }
    function ChangeUA() {
        Object.defineProperties((unsafeWindow || window).navigator, {
            userAgent: { value: "Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1" },
            platform: { value: 'Mac' }
        });
    }
    function RawImageLoader() {
        document.addEventListener('pointerdown', e => e.target.nodeName == 'IMG' && e.target.dataset.original && (e.target.src = e.target.dataset.original))
    }
    function ZhuanlanNoApp() {
        document.addEventListener('click', e => e.path.find(e => e.classList && e.classList.contains('Post-Sub')) && e.stopPropagation(), true);
    }
    function NoCopyBlocker() {
        document.addEventListener('copy', e => e.stopImmediatePropagation(), true);
    }

    //修复移动端关闭按钮消失
    function FixCloseButton() {
        window.addEventListener('load', e => {
            const css = document.createElement('style');
            css.innerHTML = `[aria-label="关闭"]{right:0 !important;top:2em !important;} [aria-label="关闭"]>svg{fill:black;} div{max-width:100%;}`;
            document.head.append(css);
        });
    } //END
    if (isMobile) {
        FixCloseButton();
        AddSearchButton();
        if (isZhuanlan) {
            ZhuanlanNoApp()
        } else {
            ChangeUA();
        }

    } else {
        ReplaceHomePage();
    }
    NoHiddenUser();
    RawImageLoader();

    NoCopyBlocker();
})();
