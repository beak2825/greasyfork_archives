// ==UserScript==
// @name        时间倒流
// @namespace   Violentmonkey Scripts
// @match       https://cszwbirbwl-github-io.pages.dev/*
// @grant       none
// @version     1.3
// @author      -
// @description 2024/10/29 23:28:49
// @downloadURL https://update.greasyfork.org/scripts/514716/%E6%97%B6%E9%97%B4%E5%80%92%E6%B5%81.user.js
// @updateURL https://update.greasyfork.org/scripts/514716/%E6%97%B6%E9%97%B4%E5%80%92%E6%B5%81.meta.js
// ==/UserScript==
    function byId(id){
        return document.getElementById(id);
    }

    function getVal(id){
        return byId(id).value;
    }

        var moneyButton = document.createElement('button');
        moneyButton.textContent = "复制仓库和神力存档";
        moneyButton.id = "moneyButton"
        moneyButton.style.margin = '0px 0px 0px 0px';
        moneyButton.style.color = 'coral'
        moneyButton.onclick = function(){
          let a = localStorage.getItem("game");
          localStorage.setItem("gamesave", a);
        }

        var moneyButton2 = document.createElement('button');
        moneyButton2.textContent = "覆盖现仓库和神力存档";
        moneyButton2.id = "moneyButton2"
        moneyButton2.style.margin = '0px 0px 0px 0px';
        moneyButton2.style.color = 'coral'
        moneyButton2.onclick = function(){
          let b = localStorage.getItem("gamesave");
          localStorage.setItem("game", b);
        }

        var shanghai = document.createElement('input');
        shanghai.style.width = '60px';
        shanghai.id = "shanghai";

        var moneyButton3 = document.createElement('button');
        moneyButton3.textContent = "...";
        moneyButton3.id = "moneyButton2"
        moneyButton3.style.margin = '0px 0px 0px 0px';
        moneyButton3.style.color = 'coral'
        moneyButton3.onclick = function(){
          let b = getVal("shanghai");
          if (b){
    // 解析 JSON 字符串
          let data = JSON.parse(b);
    // 将每个键值对存入 localStorage
          for (let key in data) {
          localStorage.setItem(key, data[key]);
          }
          console.log("数据已成功保存到 localStorage");}
        }

        const  thisdiv = document.createElement('div');
        thisdiv.style.position = 'absolute';
        thisdiv.style.top = '5px';
        thisdiv.style.left = '150px';
        thisdiv.style.zIndex = '99998';
        thisdiv.id='scriptDiv';
        thisdiv.style.textAlign = 'left'
        thisdiv.style.width = "400px";
        thisdiv.style.color = 'coral'

        document.body.appendChild(thisdiv);
        thisdiv.appendChild(document.createTextNode("先导出存档备份防止坏档"));
        thisdiv.appendChild(document.createElement("br"));
        thisdiv.appendChild(document.createTextNode("把红包或者盲盒放到仓库，再点击复制"));
        thisdiv.appendChild(document.createElement("br"));
        thisdiv.appendChild(moneyButton);
        thisdiv.appendChild(document.createElement("br"));
        thisdiv.appendChild(document.createTextNode("把红包或者盲盒拿出来，点击覆盖后，刷新页面"));
        thisdiv.appendChild(document.createElement("br"));
        thisdiv.appendChild(moneyButton2);
        thisdiv.appendChild(document.createElement("br"));
        thisdiv.appendChild(shanghai);
        thisdiv.appendChild(moneyButton3);