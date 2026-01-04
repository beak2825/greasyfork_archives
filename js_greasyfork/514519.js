// ==UserScript==
// @name        360 IP查询延迟并且切换ip
// @match       https://quake.360.net/quake/*
// @grant       none
// @version     2.1.7
// @author      songsong
// @description 360 IP查询延迟并且切换ip...
// @license MIT
// @namespace Violentmonkey Scripts
// @downloadURL https://update.greasyfork.org/scripts/514519/360%20IP%E6%9F%A5%E8%AF%A2%E5%BB%B6%E8%BF%9F%E5%B9%B6%E4%B8%94%E5%88%87%E6%8D%A2ip.user.js
// @updateURL https://update.greasyfork.org/scripts/514519/360%20IP%E6%9F%A5%E8%AF%A2%E5%BB%B6%E8%BF%9F%E5%B9%B6%E4%B8%94%E5%88%87%E6%8D%A2ip.meta.js
// ==/UserScript==

(function () {
    "use strict";
    createEle("div", "go!", {
        backgroundColor:"#00ab7a",
        position: "fixed", 
        top: "80px",            
        right: "50%",          
        padding: "10px 20px",
        borderRadius: "5px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
        cursor: "pointer",
        color:"#fff",
        zIndex: "9999" 
    }).addEventListener("click", startQueryIps);
  // .querySelector(".ioc-table-wrap")
    document.addEventListener("click", (e) => {
        let ip = e.target.getAttribute("ip");
        if (!ip) return;
        let type = e.target.getAttribute("type");
        editConfig(type, ip);
      });
  })();
  
  function startQueryIps() {
    let nodes = document.querySelectorAll(".ip");
    nodes.forEach((l) => {
      let a = l.querySelector("span");
      if(!a) return;
      fetch("https://api.v50.baby/port/check?ip=" + a.innerText.trim())
        .then((response) => response.json())
        .then((res) => {
          if (res.data.http && res.data.https) {
            ["", "netflix", "openai", "disney"].forEach((l) => {
              createEle(
                "span",
                l || res.data.time,
                {
                  color: "#fff",
                  padding: "10px",
                  marginLeft: "20px",
                  borderRadius: "6px",
                  backgroundColor: "#00ab7a",
                  cursor: "pointer",
                },
                a.parentElement,
                (ele) => {
                  if(!l) return;
                  ele.setAttribute("ip", a.innerText.trim());
                  ele.setAttribute("type", l);
                }
              );
            });
          }
        });
    });
  }
  
  function createEle(
    type,
    title,
    styleObject,
    parentElement = document.body,
    cb
  ) {
    const ele = document.createElement(type);
    ele.textContent = title;
    Object.assign(ele.style, styleObject);
    cb && cb(ele);
    (parentElement || document.body).appendChild(ele);
    return ele;
  }
  
  function editConfig(type, ip) {
    fetch(`https://api.v50.baby/port/editConfig?${type}=${ip}`)
      .then((rr) => rr.json())
      .then((rr) => {
        let typeMap = {
          netflix: "https://www.netflix.com/search?q=%E5%91%A8%E6%98%9F%E9%A9%B0",
          openai: "https://chat.openai.com",
          disney: "https://www.disneyplus.com/zh-hans/home",
        };
        setTimeout(() => {
          window.open(typeMap[type], "_blank");
        }, 2000);
      });
  }
  