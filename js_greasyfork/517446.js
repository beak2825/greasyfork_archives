// ==UserScript==
// @name         Nebula Client
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  A client for scenexe2, cope harder
// @author       1contra (discord)
// @match        https://scenexe2.io/*
// @grant        none
// @license All Rights Reserved. This code is for personal, non-commercial use only. Modifications, redistributions, or unauthorized use are prohibited without explicit permission.
// @downloadURL https://update.greasyfork.org/scripts/517446/Nebula%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/517446/Nebula%20Client.meta.js
// ==/UserScript==
(function () {
  'use strict';

  var v = document.createElement("style");
  document.head.appendChild(v);
  const v2 = document.createElement("style");
  v.innerHTML = "\n        @font-face {\n            font-family: 'Fredoka One';\n            src: url('https://fonts.gstatic.com/s/fredokaone/v14/k3kUo8kEI-tA1RRcTZGmTlHGCac.woff2') format('woff2');\n            font-weight: normal;\n            font-style: normal;\n        }\n\n        * {\n            font-family: 'Fredoka One', sans-serif !important;\n        }\n    ";
  v2.textContent = "\n        @font-face {\n            font-family: 'Fredoka One';\n            src: url('https://fonts.gstatic.com/s/fredokaone/v14/k3kUo8kEI-tA1RRcTZGmTlHGCac.woff2') format('woff2');\n            font-weight: normal;\n            font-style: normal;\n        }\n\n        #client-container {\n            transition: transform 0.3s, box-shadow 0.3s;\n        }\n\n        .stats-content {\n            margin: 10px 0;\n            font-size: 16px;\n            padding: 10px;\n            background-color: rgba(255, 255, 255, 0.1);\n            border-radius: 10px;\n            border: 1px solid rgba(255, 255, 255, 0.5);\n        }\n\n        #client-container {\n            opacity: 1;\n            transition: opacity 0.5s ease;\n        }\n\n        #client-container.hidden {\n            opacity: 0;\n            pointer-events: none;\n        }\n\n        #settings-container {\n            display: none;\n            text-align: center;\n            font-family: 'Fredoka One', sans-serif;\n        }\n        .size-knob {\n            margin-top: 10px;\n            width: 100%;\n        }\n\n    ";
  let v3 = 20;
  let v4 = false;
  const vF = p => {
    if (v4) {
      return;
    }
    v4 = true;
    const v5 = document.createElement("style");
    v5.textContent = "\n        @font-face {\n            font-family: 'Fredoka One';\n            src: url('https://fonts.gstatic.com/s/fredokaone/v14/k3kUo8kEI-tA1RRcTZGmTlHGCac.woff2') format('woff2');\n            font-weight: normal;\n            font-style: normal;\n        }\n        .plinko-container {\n            position: fixed;\n            top: 20%; /* Position from the top of the viewport */\n            left: 50px;\n            z-index: 10000;\n            background-color: rgba(128, 128, 128, 0.5); /* Semi-transparent grey */\n            border-radius: 10px; /* Optional: to round the corners */\n            padding: 10px; /* Optional: to add padding around the canvas */\n        }\n        .plinko-close {\n            position: absolute;\n            top: 5px;\n            right: 5px;\n            background-color: #f7c7d7; /* Low contrast pink */\n            color: #333; /* Dark text for contrast */\n            border: none;\n            padding: 8px 12px;\n            border-radius: 8px;\n            cursor: pointer;\n            font-size: 16px;\n            font-weight: bold;\n            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow */\n            transition: background-color 0.3s ease, transform 0.2s ease;\n        }\n        .plinko-close:hover {\n            background-color: #e7a1b7; /* Slightly darker pink on hover */\n            transform: scale(1.05); /* Slightly enlarge on hover */\n        }\n        .gamble-input {\n            margin-top: 10px;\n            padding: 8px;\n            font-size: 18px;\n            width: 120px;\n            border: 2px solid #007BFF; /* Blue border */\n            border-radius: 8px;\n            text-align: center;\n            background-color: white;\n            color: #333;\n            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow */\n            outline: none;\n            transition: border-color 0.2s;\n        }\n        .gamble-input:focus {\n            border-color: #0056b3; /* Darker blue when focused */\n        }\n    ";
    document.head.appendChild(v5);
    let v6 = p > 20 ? p : 20;
    let v7 = 0;
    let v8 = 0;
    let v9 = 0;
    const v10 = document.createElement("div");
    v10.className = "plinko-container";
    document.body.appendChild(v10);
    const v11 = document.createElement("canvas");
    v11.width = 500;
    v11.height = 500;
    v10.appendChild(v11);
    const v12 = v11.getContext("2d");
    const v13 = document.createElement("button");
    v13.className = "plinko-close";
    v13.innerHTML = "X";
    v10.appendChild(v13);
    v13.addEventListener("click", () => {
      document.body.removeChild(v10);
      v4 = false;
    });
    const v14 = document.createElement("input");
    v14.type = "number";
    v14.className = "gamble-input";
    v14.value = 1;
    v14.min = 1;
    v14.max = v6;
    v10.appendChild(v14);
    function f() {
      v14.max = v6;
      if (parseInt(v14.value) > v6) {
        v14.value = v6;
      }
    }
    v14.addEventListener("input", () => {
      let vParseInt = parseInt(v14.value);
      if (isNaN(vParseInt) || vParseInt < 1) {
        v14.value = 1;
      } else if (vParseInt > v6) {
        v14.value = v6;
      } else {
        v14.value = vParseInt;
      }
    });
    const v15 = 5;
    const v16 = 5;
    const v17 = [];
    const v18 = [];
    const v19 = 0.05;
    const v20 = 0.4;
    let v21 = 0;
    const v22 = [];
    function f2() {
      const v23 = 35;
      const v24 = 15;
      const v25 = 7;
      const v26 = Math.max(...v17.map(p2 => p2.y));
      const v27 = v26 + 20;
      const v28 = [999, 100, 2, 0.75, 0.25, 0.75, 2, 100, 999];
      const v29 = [-5, -4, -3, -2, -1, 0, 1, 2, 3];
      v28.forEach((p3, p4) => {
        v22.push({
          x: v11.width / 2 + (v29[p4] * (v23 + v25) + 5),
          y: v27,
          width: v23,
          height: v24,
          value: p3,
          color: f3(p4),
          borderColor: f4(p4),
          isAnimating: false,
          animationOffset: 0,
          downwards: false
        });
      });
    }
    function f3(p5) {
      if (p5 === 0 || p5 === 8) {
        return "#ff3b38";
      } else if (p5 === 1 || p5 === 7) {
        return "#ff6638";
      } else if (p5 === 2 || p5 === 6) {
        return "#ff9f38";
      } else if (p5 === 3 || p5 === 5) {
        return "#ffd987";
      } else {
        return "#fff5e0";
      }
    }
    function f4(p6) {
      if (p6 === 0 || p6 === 8) {
        return "#ff2a26";
      } else if (p6 === 1 || p6 === 7) {
        return "#ff5826";
      } else if (p6 === 2 || p6 === 6) {
        return "#ff9019";
      } else if (p6 === 3 || p6 === 5) {
        return "#ffc64d";
      } else {
        return "#ffe2a6";
      }
    }
    function f5() {
      const v30 = 8;
      const v31 = 40;
      const v32 = 37;
      for (let v33 = 0; v33 < v30; v33++) {
        let v34 = v33 + 3;
        if (v33 === 0) {
          v34 = 3;
        }
        const v35 = (v11.width - v34 * v31) / 2;
        for (let v36 = 0; v36 < v34; v36++) {
          const v37 = v35 + v36 * v31;
          const v38 = v33 * v32 + 50;
          v17.push({
            x: v37,
            y: v38
          });
        }
        if (v33 === v30 - 1) {
          v21 = v35 + v34 * v31 / 2 - 20;
        }
      }
    }
    function f6() {
      const vParseInt2 = parseInt(v14.value);
      if (v6 < vParseInt2) {
        return;
      }
      v6 -= vParseInt2;
      const v39 = Math.floor(Math.random() * 500000);
      let v40;
      if (v39 === 0) {
        v40 = Math.random() < 0.5 ? v11.width / 2 - 25.1 : v11.width / 2 - 14.9;
      } else if (v39 < 200) {
        v40 = Math.random() < 0.5 ? v11.width / 2 - 24.1 : v11.width / 2 - 15.9;
      } else if (v39 < 1000) {
        v40 = Math.random() < 0.5 ? v11.width / 2 - 23.1 : v11.width / 2 - 16.9;
      } else if (v39 < 50000) {
        v40 = Math.random() < 0.5 ? v11.width / 2 - 22.1 : v11.width / 2 - 17.9;
      } else if (v39 < 500000) {
        v40 = Math.random() < 0.5 ? v11.width / 2 - 21.1 : v11.width / 2 - 18.9;
      } else {
        v40 = Math.random() < 0.5 ? v11.width / 2 - 20.1 : v11.width / 2 - 19.9;
      }
      v18.push({
        x: v40,
        y: 0,
        vx: 0,
        vy: 0,
        value: vParseInt2,
        glow: true,
        color: "#fff387"
      });
    }
    function f7() {
      v18.forEach(p7 => {
        p7.vy += v19;
        const v41 = v11.width / 2;
        const v42 = 0.009;
        const v43 = Math.random() < 0.5 ? v16 * 3 + 2 : v16 * 3 - 4;
        if (Math.abs(p7.x - v21) > v43) {
          if (p7.x < v21) {
            p7.vx += v42;
          } else if (p7.x > v21) {
            p7.vx -= v42;
          }
        }
        p7.x += p7.vx;
        p7.y += p7.vy;
        v17.forEach(p8 => {
          const v44 = p8.x - p7.x;
          const v45 = p8.y - p7.y;
          const v46 = Math.sqrt(v44 * v44 + v45 * v45);
          if (v46 < v15 + v16) {
            const v47 = Math.atan2(v45, v44);
            const v48 = v15 + v16 - v46;
            p7.x -= Math.cos(v47) * v48;
            p7.y -= Math.sin(v47) * v48;
            const v49 = p7.vx * Math.cos(v47) + p7.vy * Math.sin(v47);
            p7.vx -= v49 * 2 * Math.cos(v47) * v20;
            p7.vy -= v49 * 2 * Math.sin(v47) * v20;
          }
        });
        const vParseInt3 = parseInt(v14.value);
        v22.forEach(p9 => {
          if (p7.x > p9.x && p7.x < p9.x + p9.width && p7.y + v16 > p9.y && p7.y < p9.y + p9.height) {
            p9.isAnimating = true;
            p9.animationOffset += 2;
            v18.splice(v18.indexOf(p7), 1);
            if (p9.value !== 0) {
              v6 += p9.value * p7.value;
              v3 = v6;
              if (p9.value * p7.value >= 1) {
                v8 += p9.value * p7.value;
              }
            }
            if (p9.value > vParseInt3) {} else {
              const v50 = vParseInt3 - p9.value * p7.value;
              v7 += v50;
            }
            p7.y = p9.y - v16;
            p7.vy *= -v20;
          }
          if (p9.isAnimating && p9.animationOffset > 1) {
            p9.isAnimating = false;
            setTimeout(() => {
              p9.animationOffset = 0;
            }, 100);
          }
        });
        if (p7.x < v16) {
          p7.x = v16;
          p7.vx = -p7.vx * v20;
        }
        if (p7.x > v11.width - v16) {
          p7.x = v11.width - v16;
          p7.vx = -p7.vx * v20;
        }
        if (p7.y > v11.height - v16) {
          p7.y = v11.height - v16;
          p7.vy = -p7.vy * v20;
        }
      });
    }
    function f8(p10, p11, p12, p13, p14, p15) {
      p10.beginPath();
      p10.moveTo(p11 + p15, p12);
      p10.lineTo(p11 + p13 - p15, p12);
      p10.arcTo(p11 + p13, p12, p11 + p13, p12 + p14, p15);
      p10.lineTo(p11 + p13, p12 + p14 - p15);
      p10.arcTo(p11 + p13, p12 + p14, p11, p12 + p14, p15);
      p10.lineTo(p11 + p15, p12 + p14);
      p10.arcTo(p11, p12 + p14, p11, p12, p15);
      p10.lineTo(p11, p12 + p15);
      p10.arcTo(p11, p12, p11 + p15, p12, p15);
      p10.closePath();
      p10.fill();
      p10.stroke();
    }
    function f9(p16) {
      if (!p16.isAnimating) {
        p16.isAnimating = true;
        p16.animationOffset = 0;
        const v51 = 300;
        const v52 = 15;
        const v53 = 3;
        const vSetInterval = setInterval(() => {
          if (p16.animationOffset < v53) {
            p16.animationOffset += v53 / v52;
          } else {
            clearInterval(vSetInterval);
            const vSetInterval2 = setInterval(() => {
              if (p16.animationOffset > 0) {
                p16.animationOffset -= v53 / v52;
              } else {
                clearInterval(vSetInterval2);
                p16.isAnimating = false;
              }
            }, v51 / v52);
          }
        }, v51 / v52);
      }
    }
    function f10() {
      v12.clearRect(0, 0, v11.width, v11.height);
      v12.fillStyle = "white";
      v12.strokeStyle = "white";
      v12.lineWidth = 2;
      v12.shadowBlur = 1;
      v12.shadowColor = "white";
      v17.forEach(p17 => {
        v12.beginPath();
        v12.arc(p17.x, p17.y, v15, 0, Math.PI * 2);
        v12.fill();
        v12.stroke();
      });
      v12.shadowBlur = 0;
      v22.forEach(p18 => {
        v12.fillStyle = p18.color;
        v12.strokeStyle = p18.borderColor;
        f8(v12, p18.x, p18.y + p18.animationOffset, p18.width, p18.height, 4);
        v12.fillStyle = "#000";
        v12.font = "14px \"Fredoka One\", sans-serif";
        v12.textAlign = "center";
        v12.fillText(p18.value + "x", p18.x + p18.width / 2, p18.y + p18.animationOffset + p18.height / 2 + 4);
      });
      v18.forEach(p19 => {
        if (p19.glow) {
          v12.shadowBlur = 15;
          v12.shadowColor = p19.color;
        }
        v12.fillStyle = p19.color;
        v12.beginPath();
        v12.arc(p19.x, p19.y, v16, 0, Math.PI * 2);
        v12.fill();
        v12.shadowBlur = 0;
      });
      v12.fillStyle = "black";
      v12.font = "20px \"Fredoka One\", sans-serif";
      v12.fillText("Score: " + v6, 200, 400);
      v12.font = "15px \"Fredoka One\", sans-serif";
      v12.fillText("Total Gained: " + v8, 200, 420);
      v12.fillText("Total Lost: " + v7, 200, 440);
    }
    function f11() {
      f7();
      f10();
      requestAnimationFrame(f11);
    }
    f5();
    f2();
    f11();
    v11.addEventListener("click", function () {
      f6();
    });
  };
  const v54 = document.createElement("div");
  let v55 = null;
  let v56 = null;
  let v57 = 0;
  let v58 = false;
  let v59 = false;
  let v60 = {
    x: 0,
    y: 0
  };
  document.head.appendChild(v2);
  function f12() {
    window.alert = function () {};
    window.confirm = function () {
      return false;
    };
    window.prompt = function () {
      return null;
    };
  }
  f12();
  setInterval(f12, 10000);
  const vF2 = () => {
    const v61 = ["-0", "-1", "-2"];
    v61.forEach(p20 => {
      const v62 = document.getElementById(p20);
      if (v62) {
        v62.style.position = "absolute";
        v62.style.left = "-10000px";
      }
    });
  };
  vF2();
  setInterval(vF2, 10000);
  const v63 = document.createElement("div");
  v63.style.position = "fixed";
  v63.id = "client-container";
  v63.style.width = "250px";
  v63.style.height = "420px";
  v63.style.right = "20px";
  v63.style.top = "50%";
  v63.style.transform = "translateY(-50%)";
  v63.style.backgroundColor = "rgba(30, 30, 30, 0.9)";
  v63.style.border = "2px solid #ffcc00";
  v63.style.borderRadius = "10px";
  v63.style.padding = "15px";
  v63.style.zIndex = "1000";
  v63.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.5)";
  v63.style.color = "#ffffff";
  v63.style.fontFamily = "Fredoka One, sans-serif";
  const v64 = document.createElement("div");
  v64.innerHTML = "`p - hide menu<br>`o - reposition menu";
  v64.style.position = "absolute";
  v64.style.bottom = "10px";
  v64.style.left = "50%";
  v64.style.transform = "translateX(-50%)";
  v64.style.textAlign = "center";
  v64.style.fontSize = "12px";
  v64.style.color = "#ffffff";
  v64.style.opacity = "0.6";
  v64.style.fontFamily = "Fredoka One, sans-serif";
  v63.appendChild(v64);
  const v65 = document.createElement("div");
  v65.innerText = "Nebula Client";
  v65.style.cursor = "move";
  v65.style.padding = "10px 20px";
  v65.style.background = "linear-gradient(135deg, rgba(255, 204, 0, 0.8), rgba(255, 140, 0, 0.8))";
  v65.style.borderRadius = "10px 10px 5px 5px";
  v65.style.textAlign = "center";
  v65.style.fontFamily = "Fredoka One, sans-serif";
  v65.style.fontSize = "24px";
  v65.style.color = "#333";
  v65.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
  v65.style.position = "relative";
  v65.style.userSelect = "none";
  v65.style.marginBottom = "10px";
  v63.appendChild(v65);
  const v66 = 20;
  const v67 = 220;
  v65.addEventListener("mousedown", p21 => {
    v59 = true;
    const v68 = v63.getBoundingClientRect();
    v60.x = p21.clientX - v68.left;
    v60.y = p21.clientY - v68.top - v67;
    document.body.style.userSelect = "none";
  });
  document.addEventListener("mousemove", p22 => {
    if (v59) {
      let v69 = p22.clientX - v60.x;
      let v70 = p22.clientY - v60.y;
      const v71 = window.innerWidth;
      const v72 = window.innerHeight;
      v69 = Math.max(v66, Math.min(v69, v71 - v63.offsetWidth - v66));
      v70 = Math.max(v66, Math.min(v70, v72 - 220 - v66));
      v70 = Math.max(v70, v67 + 20);
      v63.style.left = v69 + "px";
      v63.style.top = v70 + "px";
    }
  });
  document.addEventListener("mouseup", () => {
    v59 = false;
    document.body.style.userSelect = "";
  });
  const v73 = {
    normal: {
      backgroundColor: "#ffcc00",
      borderColor: "#e6b800"
    },
    hover: {
      backgroundColor: "#ffc107",
      borderColor: "#d5a600"
    }
  };
  const vF3 = (p23, p24) => {
    const v74 = document.createElement("button");
    v74.innerText = p23;
    v74.style.width = "100%";
    v74.style.margin = "5px 0";
    v74.style.padding = "10px";
    v74.style.border = "3px solid " + v73.normal.borderColor;
    v74.style.borderRadius = "5px";
    v74.style.backgroundColor = v73.normal.backgroundColor;
    v74.style.color = "#000000";
    v74.style.cursor = "pointer";
    v74.style.transition = "background-color 0.3s, border-color 0.3s, transform 0.3s";
    v74.style.transformOrigin = "center";
    v74.style.fontFamily = "Fredoka One, sans-serif";
    v74.onmouseover = () => {
      v74.style.backgroundColor = v73.hover.backgroundColor;
      v74.style.borderColor = v73.hover.borderColor;
      v74.style.transform = "scale(1.02)";
      v74.style.boxShadow = "0 0 12px rgba(255, 204, 0, 0.1), 0 0 24px rgba(255, 204, 0, 0.2)";
    };
    v74.onmouseout = () => {
      v74.style.backgroundColor = v73.normal.backgroundColor;
      v74.style.borderColor = v73.normal.borderColor;
      v74.style.transform = "scale(1)";
      v74.style.boxShadow = "none";
    };
    v74.onclick = p24;
    return v74;
  };
  const vF4 = () => {
    v54.style.display = "none";
    v77.style.display = "block";
    vF9();
  };
  const vF5 = () => {
    alert("Darkness Toggled!");
  };
  const vF6 = () => {
    vF(v3);
  };
  const vF7 = () => {
    v54.style.display = "none";
    v75.style.display = "block";
  };
  const vVF3 = vF3("Start Abyss Farming", () => {
    alert("Abyss Farming Started!");
  });
  const vVF32 = vF3("Toggle Darkness", vF5);
  const vVF33 = vF3("Game status", vF4);
  const vVF34 = vF3("Settings", vF7);
  const vVF35 = vF3("Plinko", vF6);
  v54.appendChild(vVF3);
  v54.appendChild(vVF32);
  v54.appendChild(vVF33);
  v54.appendChild(vVF34);
  v54.appendChild(vVF35);
  v63.appendChild(v54);
  const v75 = document.createElement("div");
  v75.style.display = "none";
  v75.style.textAlign = "center";
  v75.style.fontFamily = "Fredoka One, sans-serif";
  const v76 = document.createElement("h4");
  v76.innerText = "settings";
  v76.style.fontFamily = "Fredoka One, sans-serif";
  v75.appendChild(v76);
  v63.appendChild(v75);
  const v77 = document.createElement("div");
  v77.style.display = "none";
  v77.style.textAlign = "center";
  v77.style.fontFamily = "Fredoka One, sans-serif";
  const v78 = document.createElement("h4");
  v78.innerText = "Stats Page";
  v78.style.fontFamily = "Fredoka One, sans-serif";
  v77.appendChild(v78);
  const v79 = document.createElement("button");
  v79.innerText = "Exit";
  v79.style.position = "absolute";
  v79.style.left = "20px";
  v79.style.top = "76px";
  v79.style.border = "none";
  v79.style.borderRadius = "5px";
  v79.style.backgroundColor = "transparent";
  v79.style.color = "#000000";
  v79.style.cursor = "pointer";
  v79.style.padding = "10px 15px";
  v79.style.fontSize = "16px";
  v79.style.transition = "background-color 0.3s, transform 0.3s";
  v79.style.fontFamily = "Fredoka One, sans-serif";
  v79.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
  v79.onmouseover = () => {
    v79.style.backgroundColor = "#ffc107";
    v79.style.transform = "scale(1.05)";
  };
  v79.onmouseout = () => {
    v79.style.backgroundColor = "transparent";
    v79.style.transform = "scale(1)";
  };
  v79.onclick = () => {
    v75.style.display = "none";
    v54.style.display = "block";
  };
  v75.appendChild(v79);
  document.head.appendChild(v);
  v.disabled = true;
  function f13(p25) {
    v.disabled = !p25;
  }
  const v80 = document.createElement("div");
  v80.style.textAlign = "left";
  v80.style.margin = "20px 0";
  v80.style.display = "flex";
  v80.style.alignItems = "center";
  v80.style.justifyContent = "center";
  const v81 = document.createElement("label");
  v81.innerText = "Override Font: ";
  v81.style.marginRight = "10px";
  v81.style.fontFamily = "Fredoka One, sans-serif";
  v81.style.color = "#ffffff";
  v81.style.fontSize = "16px";
  const v82 = document.createElement("div");
  v82.style.position = "relative";
  v82.style.display = "inline-block";
  v82.style.width = "40px";
  v82.style.height = "20px";
  v82.style.marginLeft = "10px";
  v82.style.cursor = "pointer";
  const v83 = document.createElement("input");
  v83.type = "checkbox";
  v83.style.opacity = "0";
  v83.style.position = "absolute";
  v83.style.zIndex = "2";
  v83.style.width = "100%";
  v83.style.height = "100%";
  const v84 = document.createElement("span");
  v84.style.position = "absolute";
  v84.style.top = "0";
  v84.style.left = "0";
  v84.style.right = "0";
  v84.style.bottom = "0";
  v84.style.marginTop = "-2px";
  v84.style.marginLeft = "-2px";
  v84.style.backgroundColor = "#777";
  v84.style.borderRadius = "20px";
  v84.style.transition = "0.4s";
  const v85 = document.createElement("span");
  v85.style.position = "absolute";
  v85.style.height = "18px";
  v85.style.width = "18px";
  v85.style.backgroundColor = "#fff";
  v85.style.borderRadius = "50%";
  v85.style.transition = "0.4s";
  v85.style.zIndex = "1";
  const vF8 = () => {
    if (v83.checked) {
      v84.style.backgroundColor = "#4caf50";
      v85.style.transform = "translateX(20px)";
    } else {
      v84.style.backgroundColor = "#777";
      v85.style.transform = "translateX(0)";
    }
  };
  v83.addEventListener("change", p26 => {
    f13(p26.target.checked);
    vF8();
  });
  vF8();
  v82.appendChild(v83);
  v82.appendChild(v84);
  v82.appendChild(v85);
  v80.appendChild(v81);
  v80.appendChild(v82);
  v75.appendChild(v80);
  const v86 = document.createElement("button");
  v86.innerText = "Exit";
  v86.style.position = "absolute";
  v86.style.left = "20px";
  v86.style.top = "76px";
  v86.style.border = "none";
  v86.style.borderRadius = "5px";
  v86.style.backgroundColor = "transparent";
  v86.style.color = "#000000";
  v86.style.cursor = "pointer";
  v86.style.padding = "10px 15px";
  v86.style.fontSize = "16px";
  v86.style.transition = "background-color 0.3s, transform 0.3s";
  v86.style.fontFamily = "Fredoka One, sans-serif";
  v86.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
  v86.onmouseover = () => {
    v86.style.backgroundColor = "#ffc107";
    v86.style.transform = "scale(1.05)";
  };
  v86.onmouseout = () => {
    v86.style.backgroundColor = "transparent";
    v86.style.transform = "scale(1)";
  };
  v86.onclick = () => {
    v77.style.display = "none";
    v54.style.display = "block";
  };
  v77.appendChild(v86);
  const v87 = ["Player Counts", "Rare Spawns", "Gate Openings"];
  const v88 = document.createElement("div");
  v88.style.margin = "10px 0";
  v88.style.fontSize = "16px";
  v88.style.padding = "10px";
  v88.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
  v88.style.fontFamily = "Fredoka One, sans-serif";
  const v89 = document.createElement("div");
  v89.style.marginTop = "10px";
  v89.style.fontSize = "16px";
  v89.style.fontFamily = "Fredoka One, sans-serif";
  const vF9 = async () => {
    let v90;
    switch (v57) {
      case 0:
        v90 = "https://expandedwater.online:3000/api/messages/1117612925666996254";
        break;
      case 1:
        v90 = "https://expandedwater.online:3000/api/messages/1187917859742027786";
        break;
      case 2:
        v90 = "https://expandedwater.online:3000/api/messages/1221635977987100874";
        break;
    }
    const v91 = await fetch(v90);
    const v92 = await v91.json();
    v88.innerText = vF10(v92);
  };
  setInterval(vF9, 10000);
  const vF10 = p27 => {
    if (!p27.length) {
      return "No data available.";
    }
    const v93 = p27[0];
    const v94 = v93.content;
    const v95 = v93.timestamp;
    const vF11 = p28 => p28.replace(/^`|`$/g, "").replace(/\s*\{\s*/g, "").replace(/\}\s*$/, "").replace(/^\[\d{2}:\d{2}:\d{2}\]\s*/, "");
    const vF12 = p29 => {
      const v96 = p29.match(/will open again in (\d+\.?\d*) (minutes|seconds)/);
      if (!v96) {
        return "Gate opening time not found.";
      }
      const [v97, v98, v99] = v96;
      const v100 = v99 === "minutes" ? parseFloat(v98) * 60 * 1000 : parseFloat(v98) * 1000;
      const v101 = new Date(v95);
      const v102 = Date.now() - v101.getTime();
      const v103 = v100 - v102;
      if (v103 <= 0) {
        v88.innerText = "Gate is open!";
        clearInterval(v55);
        v55 = null;
        return;
      }
      if (!v56 || v103 > v56 - Date.now()) {
        v56 = Date.now() + v103;
        vF13();
      }
    };
    const vF13 = () => {
      v55 = setInterval(() => {
        const v104 = v56 - Date.now();
        if (v104 <= 0) {
          clearInterval(v55);
          v55 = null;
          v88.innerText = "Gate is open!";
        } else {
          const v105 = Math.floor(v104 / 60000 % 60);
          const v106 = Math.floor(v104 / 1000 % 60);
          v89.innerText = v105 + "m " + v106 + "s until next gate opening";
        }
      }, 1000);
    };
    if (!v89.parentElement) {
      v77.appendChild(v89);
    }
    vF12(v94);
    const vVF11 = vF11(v94);
    switch (v57) {
      case 0:
        if (Array.isArray(v94)) {
          return v94.filter(p30 => !p30.name.toLowerCase().includes("sand")).map(p31 => vF11(p31.name) + ": " + vF11(p31.playerCount)).join("\n");
        } else {
          return v94.split(",").filter(p32 => !p32.toLowerCase().includes("sand")).map(vF11).join("\n");
        }
      case 1:
      case 2:
        return vVF11;
      default:
        return "No data available.";
    }
  };
  const vF14 = (p33, p34) => {
    const v107 = document.createElement("button");
    v107.innerText = p33 === "prev" ? "<" : ">";
    v107.style.width = "40px";
    v107.style.height = "40px";
    v107.style.border = "2px solid #000000";
    v107.style.borderRadius = "5px";
    v107.style.backgroundColor = "transparent";
    v107.style.color = "#ffcc00";
    v107.style.cursor = "pointer";
    v107.style.fontSize = "24px";
    v107.style.position = "absolute";
    v107.style.bottom = "20px";
    v107.style.margin = "0 5px";
    v107.style.display = "flex";
    v107.style.alignItems = "center";
    v107.style.justifyContent = "center";
    v107.style.transition = "background-color 0.3s, transform 0.3s";
    v107.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.3)";
    v107.style.transformOrigin = "center";
    if (p33 === "prev") {
      v107.style.left = "20px";
    } else {
      v107.style.right = "20px";
    }
    v107.onmouseover = () => {
      v107.style.backgroundColor = "rgba(255, 204, 0, 0.5)";
      v107.style.transform = "scale(1.1)";
    };
    v107.onmouseout = () => {
      v107.style.backgroundColor = "transparent";
      v107.style.transform = "scale(1)";
    };
    v107.onclick = p34;
    return v107;
  };
  v88.className = "stats-content";
  const vVF14 = vF14("prev", () => {
    v57 = (v57 - 1 + v87.length) % v87.length;
    v88.innerText = "";
    vF9();
  });
  const vVF142 = vF14("next", () => {
    v57 = (v57 + 1) % v87.length;
    v88.innerText = "";
    vF9();
  });
  const vF15 = () => {
    const {
      innerWidth: _0x2bcf7d,
      innerHeight: _0x5da14f
    } = window;
    const v108 = _0x2bcf7d - v63.offsetWidth - 20;
    const v109 = (_0x5da14f - v63.offsetHeight) / 2 + 220;
    const v110 = 500;
    const v111 = 20;
    const v112 = v110 / v111;
    const v113 = parseFloat(v63.style.left) || 0;
    const v114 = parseFloat(v63.style.top) || 0;
    let v115 = 0;
    const vF16 = () => {
      v115++;
      const v116 = Math.min(v115 / v111, 1);
      v63.style.left = v113 + (v108 - v113) * v116 + "px";
      v63.style.top = v114 + (v109 - v114) * v116 + "px";
      if (v116 < 1) {
        requestAnimationFrame(vF16);
      }
    };
    vF16();
  };
  document.addEventListener("keydown", p35 => {
    if (p35.key === "`") {
      v58 = true;
      return;
    }
    if (v58) {
      if (p35.key.toLowerCase() === "p") {
        v63.classList.toggle("hidden");
        if (v63.classList.contains("hidden")) {
          setTimeout(() => v63.style.display = "none", 500);
        } else {
          v63.style.display = "block";
        }
      } else if (p35.key.toLowerCase() === "o") {
        vF15();
      }
      v58 = false;
    }
  });
  document.addEventListener("keyup", p36 => {
    if (p36.key === "`") {
      setTimeout(() => v58 = false, 500);
    }
  });
  const v117 = document.createElement("div");
  v117.style.display = "flex";
  v117.style.justifyContent = "center";
  v117.style.marginTop = "10px";
  v117.appendChild(vVF14);
  v117.appendChild(vVF142);
  v77.appendChild(v117);
  v77.appendChild(v88);
  v63.appendChild(v77);
  document.body.appendChild(v63);
  window.addEventListener("resize", vF15);
})();