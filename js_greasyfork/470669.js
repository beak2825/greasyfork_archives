// ==UserScript==
// @name         Wallhaven壁纸一键下载加标签屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Wallhaven壁纸一键下载，标签屏蔽
// @author       乃木流架
// @match        https://wallhaven.cc/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADKElEQVR4nO2YTWgTQRTHt6CCgkW9iJ8XD5aePHhQBKvepb16sr30KnjwIMhs/MCIgopUiBYPVqrMbEmatmmy29T6QRpt0522gQoqoiLag1+tdWe32TzZTWtTmsY2nexa2D88CNl9s//fzNuZnREET548efLkyZMnT44LEK4GRM4CwmFAmIKIxwGRb4BwI8eHtO0EkRBAeAIQ7uXWrkjOASIZEAnMC0Qwb/Nf5xqfA4Dw4AamDNUyhd7TFKoyWf2syWqWKRQWi9x1ddxoffJ+gXHRbj8LCO/jB2D1vN047rJg7P9wep2mqI1MVr/km/NX1i4prHvNG10LzYv2c0a5mbfNWmVj90zOPIsP79UUdaxQ7y4HIOsPFQQw/e0KXwCR/JwZ2t1ajB7TFPqjWIksNcxrHQUBppt7skwePsUPAOGQ3bg/GNBk+p2HeSsMqR/AJy0EePDUfk90efgEJwCpCkTyQQ8PfORlfjb09heQaYpC9nIQ4LwE2asdoHenci+7QqcYTlZzgdBjqUu8zS9plFqfTa54RoJoeovdGw4aP3ySQE09AaaoYPqDJiDyCFDbgZIANFltcLrna+oJHKmX7N+ZQE/+O9JUAgANuVE+bLaMSCJ/hf5dygi8chNAD7+cN0uVAjDhJgCLDq0YYHJVAzCFvl7VJcQU2ucmgEH68z/0ppYPIFPkJkDmbt40ivCdZQMYcmq/mwDmlZC1PwiBTzoklCIAqLA3K27Uf1vCAJ90VFipWIwedwXgfrxB4CVNViOOAshqs8BT0DmymcnqGyfMawqlkEisF3iLRUeqmELfldm8OiWntgvl0q/uwW16eOBTWWo+mHwLz8c2CuUW+PCZzO0Y6F2DfIx3DIB5K2LN86fLbn4G4KC9sPgkMG9G7H2sHkqCHkkBk2eMxdSoFh/dY90/2TOylcm0N2dYtcGNYBKmW/rAvN45t1D5cI0zACi4qfCZTv4BVe4Y5m/OhYe7/plzEe9wCODxmuLmiVE4jxjF81oqnQEQoKK4EZwuDIDTRfMCgbWOANhmRBJf5GhwHJBUVxhAqrOvF87rd8y8J0+ehP9OfwDBJGLFiOaZxAAAAABJRU5ErkJggg==
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_listValues
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/470669/Wallhaven%E5%A3%81%E7%BA%B8%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E5%8A%A0%E6%A0%87%E7%AD%BE%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/470669/Wallhaven%E5%A3%81%E7%BA%B8%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E5%8A%A0%E6%A0%87%E7%AD%BE%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==


(function () {
  // "use strict";

  GM_addStyle(`
      header .bantag:hover {
      background-color: #5a0a0a;
    }
  `)

  const static = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADKElEQVR4nO2YTWgTQRTHt6CCgkW9iJ8XD5aePHhQBKvepb16sr30KnjwIMhs/MCIgopUiBYPVqrMbEmatmmy29T6QRpt0522gQoqoiLag1+tdWe32TzZTWtTmsY2nexa2D88CNl9s//fzNuZnREET548efLkyZMnT44LEK4GRM4CwmFAmIKIxwGRb4BwI8eHtO0EkRBAeAIQ7uXWrkjOASIZEAnMC0Qwb/Nf5xqfA4Dw4AamDNUyhd7TFKoyWf2syWqWKRQWi9x1ddxoffJ+gXHRbj8LCO/jB2D1vN047rJg7P9wep2mqI1MVr/km/NX1i4prHvNG10LzYv2c0a5mbfNWmVj90zOPIsP79UUdaxQ7y4HIOsPFQQw/e0KXwCR/JwZ2t1ajB7TFPqjWIksNcxrHQUBppt7skwePsUPAOGQ3bg/GNBk+p2HeSsMqR/AJy0EePDUfk90efgEJwCpCkTyQQ8PfORlfjb09heQaYpC9nIQ4LwE2asdoHenci+7QqcYTlZzgdBjqUu8zS9plFqfTa54RoJoeovdGw4aP3ySQE09AaaoYPqDJiDyCFDbgZIANFltcLrna+oJHKmX7N+ZQE/+O9JUAgANuVE+bLaMSCJ/hf5dygi8chNAD7+cN0uVAjDhJgCLDq0YYHJVAzCFvl7VJcQU2ucmgEH68z/0ppYPIFPkJkDmbt40ivCdZQMYcmq/mwDmlZC1PwiBTzoklCIAqLA3K27Uf1vCAJ90VFipWIwedwXgfrxB4CVNViOOAshqs8BT0DmymcnqGyfMawqlkEisF3iLRUeqmELfldm8OiWntgvl0q/uwW16eOBTWWo+mHwLz8c2CuUW+PCZzO0Y6F2DfIx3DIB5K2LN86fLbn4G4KC9sPgkMG9G7H2sHkqCHkkBk2eMxdSoFh/dY90/2TOylcm0N2dYtcGNYBKmW/rAvN45t1D5cI0zACi4qfCZTv4BVe4Y5m/OhYe7/plzEe9wCODxmuLmiVE4jxjF81oqnQEQoKK4EZwuDIDTRfMCgbWOANhmRBJf5GhwHJBUVxhAqrOvF87rd8y8J0+ehP9OfwDBJGLFiOaZxAAAAABJRU5ErkJggg==`;

  const animate = `https://i.postimg.cc/13Vdn4Cb/save.gif`;

  const tagBlacklist = 'https://wallhaven.cc/settings/browsing#blacklist'

  function log(...args) {
    const name = "WLS";
    const logPrefix = [
      "%c" + name,
      `background:#ff80ab;border-radius: 0.5em;color: white;font-weight: bold;padding: 2px 0.5em`,
    ];
    console.log(...logPrefix, ...args);
  }

  function vueInject() {
    let script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    // script.src = "https://unpkg.com/vue@3/dist/vue.global.js";
    script.src = "https://unpkg.com/vue@3.2.36/dist/vue.global.prod.js";
    document.documentElement.appendChild(script);

    let link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.href =
      "https://gcore.jsdelivr.net/gh/NogiRuka/images@main/script/Wallhaven%20Like%20%26%20Save/save.css";
    document.documentElement.appendChild(link);
  }

  // https://bbs.tampermonkey.net.cn/forum.php?mod=viewthread&tid=835&page=1#pid4661
  Element.prototype.matches = Element.prototype.matches || Element.prototype.matchesSelector || Element.prototype.webkitMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector;
  function getElement(parent, selector, timeout = 0) {
    return new Promise(resolve => {
      let result = parent.querySelector(selector);
      if (result) return resolve(result);
      let timer;
      const mutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver;
      if (mutationObserver) {
        const observer = new mutationObserver(mutations => {
          for (let mutation of mutations) {
            for (let addedNode of mutation.addedNodes) {
              if (addedNode instanceof Element) {
                result = addedNode.matches(selector) ? addedNode : addedNode.querySelector(selector);
                if (result) {
                  observer.disconnect();
                  timer && clearTimeout(timer);
                  return resolve(result);
                }
              }
            }
          }
        });
        observer.observe(parent, {
          childList: true,
          subtree: true
        });
        if (timeout > 0) {
          timer = setTimeout(() => {
            observer.disconnect();
            return resolve(null);
          }, timeout);
        }
      } else {
        const listener = e => {
          if (e.target instanceof Element) {
            result = e.target.matches(selector) ? e.target : e.target.querySelector(selector);
            if (result) {
              parent.removeEventListener('DOMNodeInserted', listener, true);
              timer && clearTimeout(timer);
              return resolve(result);
            }
          }
        };
        parent.addEventListener('DOMNodeInserted', listener, true);
        if (timeout > 0) {
          timer = setTimeout(() => {
            parent.removeEventListener('DOMNodeInserted', listener, true);
            return resolve(null);
          }, timeout);
        }
      }
    });
  }
  /**
   * 调用示例
    function example1() {
      getElement(document, '#test').then(element => {
        //...
      });
    }
   * 推荐
    async function example2() {
      const element = await getElement(document, '#test');
      //...
    }
   */

  function banInit() {
    let ban = document.createElement("li");
    ban.innerHTML = `<a class="bantag" href="${tagBlacklist}" style="color: #a3a3a3" one-link-mark="yes"><i class="far fa-ban "></i><span>Bantag</span></a>`

    return ban
  }
  
  function tagsHandle() {
    const tags = document.querySelectorAll('#tags a[rel="tag"]');

    // log('tags---->', tags)

    // 处理标签
    tags.forEach(t => {

      var tagName = t.innerText;

      let confirmStr = '你确定要把 <strong style="color:#ff80ab">' + t.innerText + '</strong> 标签\n加入屏蔽名单吗?'

      let banIcon = document.createElement("a");
      banIcon.setAttribute("class", 'jsAnchor tag-rm tag-ban')
      banIcon.setAttribute("original-title", 'Ban tag')
      banIcon.innerHTML = `<i class="fal fa-ban"></i>`

      t.insertAdjacentElement('beforebegin', banIcon);

      // log(t);

      banIcon.addEventListener("click", (e) => {
        log("banIcon clicked---->", e.target);

        Swal.fire({
          title: confirmStr,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "别废话",
          cancelButtonText: "手滑了",
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {

            // log(GM_getValue('storedTagsArr'))
            // GM_setValue('storedTagsArr', '[]')

            let storedTagsArr = JSON.parse(GM_getValue('storedTagsArr') === undefined ? '[]' : GM_getValue('storedTagsArr'))

            if (!storedTagsArr.includes(tagName)) {
              storedTagsArr.push(tagName);
            }

            GM_setValue('storedTagsArr', JSON.stringify(storedTagsArr))
            log('storedTagsArr---->', storedTagsArr)

            const Toast = Swal.mixin({
              html: '<p style="font-weight: bold;">屏蔽名单：</p>' + GM_getValue('storedTagsArr') + '<p style="font-weight: bold;">屏蔽名单历史：</p>' + GM_getValue('storedTagsArrLast'),
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "success",
              title: "<h1 style='font-size: large;'>加入成功</h1>"
            });
          }
        });

      })

      t.addEventListener("mouseover", function (e) {
        log('Tag---->', e.target.innerText);

      });
      
      // 添加鼠标移出事件处理程序
      t.addEventListener("mouseout", function () {

      });
    })

  }

  async function banAdd1(ban) {
    const startpageMenu = await getElement(document, '.startpage-menu');
    // log('startpageMenu---->', startpageMenu)
    startpageMenu.append(ban);

  }
  async function banAdd2(ban) {
    const topmenuPrimary = await getElement(document, '.topmenu-primary');
    // log('topmenuPrimary---->', topmenuPrimary)
    topmenuPrimary.append(ban);

  }
  async function tagBlacklistHandle() {

    let script1 = document.createElement("script");
    script1.setAttribute("type", "text/javascript");
    script1.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
    document.documentElement.appendChild(script1);

    if (/wallhaven.cc\/settings\/browsing/.test(window.location.href)) {
      
      // 清空屏蔽名单历史
      // GM_setValue('storedTagsArrLast', '[]')
      
      const tagBlacklist = await getElement(document, '#blacklist');
      let storedTagsArr = JSON.parse(GM_getValue('storedTagsArr'))
      let storedTagsArrLast = JSON.parse(GM_getValue('storedTagsArrLast') === undefined ? '[]' : GM_getValue('storedTagsArrLast'))
      let bl = tagBlacklist.innerHTML
      log('原始黑名单---->', bl)
      log('屏蔽名单---->', storedTagsArr)
      log('屏蔽名单历史---->', storedTagsArrLast)
      
      storedTagsArr = storedTagsArr.filter(function (element) {
        return !storedTagsArrLast.includes(element);
      });
      storedTagsArr.forEach(tag => {
        bl = tag + '\n' + bl
      })
      log('处理后黑名单---->', bl)
      tagBlacklist.innerHTML = bl

      // storedTagsArrLast = storedTagsArrLast.concat(storedTagsArr)
      storedTagsArrLast = Array.from(new Set([...storedTagsArrLast, ...storedTagsArr]));

      GM_setValue('storedTagsArrLast', JSON.stringify(storedTagsArrLast))
      GM_setValue('storedTagsArr', '[]')
      log('处理后屏蔽名单历史---->', JSON.parse(GM_getValue('storedTagsArrLast')))
      log('处理后屏蔽名单---->', JSON.parse(GM_getValue('storedTagsArr')))

      setTimeout(() => {
        const Toast = Swal.mixin({
          html: '<p>屏蔽名单已清空，请点击<button class="green button" ><i class="far fa-fw fa-check"></i>Update</button>按钮屏蔽标签</p><p style="font-weight: bold;">屏蔽名单：</p>' + GM_getValue('storedTagsArr') + '<p style="font-weight: bold;">屏蔽名单历史：</p>' + GM_getValue('storedTagsArrLast'),
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "<h1 style='font-size: large;'>屏蔽标签添加成功</h1>"
        });
      }, 1000);
    }
  }
  async function pigAdd() {
    let text = `
        <div id="app" style="position: fixed;bottom: 100px;right: 100px;z-index: 999">
          <img id='save' src='${static}' alt="WLS" style="width: 60px;height: 60px;cursor: pointer;border-radius:50%;background: white;" @click="save"/>
        </div>
      `;
    //图片阴影
    let style = document.createElement("style");
    style.innerHTML = `
        #save:hover {
          box-shadow: 0 0 10px #ff80ab;
        }
        .tag > .tag-ban{
          font-color: white;
          right: 1.5em
        }
        .tag>.tag-rm+.tagname {
          padding-right: 3.5em;
        }   
      `;

    document.head.append(style);
    // 添加小猪图标
    let el = document.createElement("div");
    el.innerHTML = text;
    
    const element = await getElement(document, 'body');
    element.append(el);
  }

  log("[Wallhaven壁纸一键下载加标签屏蔽] userscript is running...");

  vueInject();

  banAdd1(banInit())
  banAdd2(banInit())
  pigAdd()
  tagBlacklistHandle()

  window.onload = () => {
    tagsHandle()

    const { createApp } = Vue;
    createApp({
      data() {
        return {
          message: "Hello Vue!",
          // 🥚彩蛋
          emoticons: ["⁄(⁄⁄•⁄ω⁄•⁄⁄)⁄", "(＊／ω＼＊)", "(▼ヘ▼#)", "(ฅωฅ*)", "(๑′ᴗ‵๑)Ｉ Lᵒᵛᵉᵧₒᵤ❤", "(•ॢ◡-ॢ)-♡", "(｀⌒´メ)", "＼(＾▽＾)／", "T^T", "༼༎ຶᴗ༎ຶ༽", "(ಥ﹏ಥ)", "٩(๑❛ᴗ❛๑)۶", "(～￣▽￣)～ ", "(◕ᴗ◕✿)", "✧*｡٩(ˊᗜˋ*)و✧*｡", "(o°ω°o)", "(〃'▽'〃)", "ー=≡Σ( ε¦) 0", "(´･ω･)ﾉ(._.`)", "(ง •_•)ง,加油", "＼(＞０＜)／　加油", "Hi~ o(*￣▽￣*)ブ", "|。•ω•)っ◆ 我喜欢你♪", "(〃￣ω￣〃）ゞ你是变态", "(σ°∀°)σ..:*☆哎哟不错哦", "(*^▽^*)", "(^_−)☆", "*✧⁺˚⁺ପ(๑･ω･)੭ु⁾⁾ 好好学习天天向上", "( • ̀ω•́ )✧", "(〃'▽'〃)", "（づ￣3￣）づ╭❤～", "(✪ω✪)", "✧*｡٩(ˊᗜˋ*)و✧*｡"]
        };
      },
      methods: {
        save() {
          log("Pig clicked");
          
          if (!/wallhaven.cc\/w\//.test(window.location.href)) {
            const Toast = Swal.mixin({
              toast: true,
              position: "bottom-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: false,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              iconHtml: '<img src="' + static + '" style="width: 50px; height: 50px; cursor: pointer; border-radius: 50%; background: white;" />',
              html: this.emoticons[Math.floor(Math.random() * this.emoticons.length)]
            });
          }
          
          // Change icon
          let img = document.querySelector("#save");
          img.src = animate;
          setTimeout(() => {
            img.src = static;
          }, 1500);

          if (/wallhaven.cc\/w\//.test(window.location.href)) {
            
            // Add to Favorites
            this.add();

            // Download
            this.download();
          }
        },
        add() {
          let add = document.querySelector(".add-fav");
          log(`output->add`, add);
          if (add != null) {
            add.click();
          }
        },
        download() {
          let img = document.querySelector("#wallpaper");
          if (img != null) {
            imgUrl = img.src
            log(`output->imgUrl`, imgUrl);
          }
          
          // 下载图片
          fetch(imgUrl).then((res) =>
            res.blob().then((blob) => {
              // 动态创建a标签，防止下载大文件时，用户没看到下载提示连续点击
              const a = document.createElement("a"),
                url = window.URL.createObjectURL(blob),
                filename = imgUrl.substring(imgUrl.lastIndexOf("/") + 1);
              log(`output->filename`, filename);
              a.href = url;
              a.download = filename;
              a.click();
              window.URL.revokeObjectURL(url);
            })
          );
          document.querySelector("#header").click();
        },
      },
    }).mount("#app");
  };

})();
