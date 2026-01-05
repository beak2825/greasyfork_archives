// ==UserScript==
// @name         YouTube HTML5 Video Pan And Zoom
// @namespace    YouTubeHTML5VideoPanAndZoom
// @version      1.1.9
// @license      AGPLv3
// @author       jcunews
// @description  Add controls to pan and zoom HTML5 video.
// @include      https://www.youtube.com/watch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27433/YouTube%20HTML5%20Video%20Pan%20And%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/27433/YouTube%20HTML5%20Video%20Pan%20And%20Zoom.meta.js
// ==/UserScript==

(() => {
  var to = {createHTML: s => s, createScript: s => s}, tp = window.trustedTypes?.createPolicy ? trustedTypes.createPolicy("", to) : to;
  var html = s => tp.createHTML(s), script = s => tp.createScript(s);
  var ele = document.createElement("SCRIPT");
  ele.text = script("(" + (function() {
    var resizeUpdateDelay = 300;
    var eleVideo, baseWidth, baseHeight, posX, posY, deltaX, deltaY, scaleX, scaleY;
    var eleContainer, containerWidth, containerHeight, configs;
    var changing = false, timerIdChange = 0, timerIdUpdateAll = 0;
    var to = {createHTML: s => s, createScript: s => s}, tp = window.trustedTypes?.createPolicy ? trustedTypes.createPolicy("", to) : to;
    var html = s => tp.createHTML(s), script = s => tp.createScript(s);

    function doneChange() {
      changing = false;
      clearTimeout(timerIdChange);
      timerIdChange = 0;
    }

    function doChange() {
      changing = true;
      if (timerIdChange) clearTimeout(timerIdChange);
      timerIdChange = setTimeout(doneChange, 100);
    }

    function setPos(dx, dy) {
      var rw = 1, rh = 1;
      if (document.fullscreen) {
        rw = screen.width / eleContainer.offsetWidth;
        rh = screen.height / eleContainer.offsetHeight;
      }
      if (dx !== undefined) {
        deltaX += dx;
        deltaY += dy;
      } else {
        posX = 0;
        posY = 0;
        deltaX = 0;
        deltaY = 0;
      }
      doChange();
      eleVideo.style.left = ((posX + deltaX) * rw) + "px";
      eleVideo.style.top = ((posY + deltaY) * rh) + "px";
      eleVideo.style.width = "100%";
    }

    function setSize(dx, dy) {
      var rw = 1, rh = 1;
      if (document.fullscreen) {
        rw = screen.width / eleContainer.offsetWidth;
        rh = screen.height / eleContainer.offsetHeight;
      }
      if (dx !== undefined) {
        scaleX += dx;
        scaleY += dy;
      } else {
        scaleX = 1;
        scaleY = 1;
      }
      doChange();
      eleVideo.style.MozTransform = eleVideo.style.WebkitTransform =
        "scaleX(" + (scaleX*rw).toFixed(2) + ") scaleY(" + (scaleY*rh).toFixed(2) + ")";
    }

    function updateAll() {
      var rw = 1, rh = 1, px = posX + deltaX, py = posY + deltaY;
      if (document.fullscreen) {
        rw = screen.width / eleContainer.offsetWidth;
        rh = screen.height / eleContainer.offsetHeight;
      }
      doChange();
      eleVideo.style.left = (px * rw).toFixed(0) + "px";
      eleVideo.style.top = (py * rh).toFixed(0) + "px";
      eleVideo.style.width = "100%";
      eleVideo.style.MozTransform = eleVideo.style.WebkitTransform =
        "scaleX(" + (scaleX*rw).toFixed(2) + ") scaleY(" + (scaleY*rh).toFixed(2) + ")";
      vpzConfigs.style.top = document.fullscreen ? "-3px" : "";
      clearTimeout(timerIdUpdateAll);
      timerIdUpdateAll = 0;
    }

    function delayedUpdateAll() {
      if (timerIdUpdateAll) clearTimeout(timerIdUpdateAll);
      timerIdUpdateAll = setTimeout(updateAll, 100);
    }

    function setup() {
      var vpzPanel = window.vpzPanel;
      if (!vpzPanel) {
        vpzPanel = document.createElement("DIV");
        vpzPanel.id = "vpzPanel";
        vpzPanel.innerHTML = html(`<style>
#vpzPanel{position:relative;float:left;margin:10px 0 0 20px;white-space:nowrap}
#vpzPanel button{vertical-align:top;border:none;border-radius:3px;padding:0;width:18px;height:18px;line-height:0;font-size:15px;font-weight:bold;cursor:pointer}
#vpzPanel button:hover{background:#bdb}
#vpzMoveLeft{margin-left:0}
#vpzMoveL,#vpzShrink,#vpzShrinkH,#vpzShrinkV,#vpzConfig{margin-left:10px!important}
#vpzCfgContainer{display:none;position:absolute;z-index:99;right:0;bottom:55px;padding:5px;line-height:normal;background:#555}
#vpzCfgContainer button{height:21px;padding:0 5px}
#vpzConfigs{position:relative}
#vpzConfigs~button{width:auto}
</style>
<button id="vpzReset" class="yt-uix-button-default" title="Reset">0</button>
<button id="vpzMoveL" class="yt-uix-button-default" title="Move Left">&#x2190;</button>
<button id="vpzMoveU" class="yt-uix-button-default" title="Move Up">&#x2191;</button>
<button id="vpzMoveD" class="yt-uix-button-default" title="Move Down">&#x2193;</button>
<button id="vpzMoveR" class="yt-uix-button-default" title="Move Right">&#x2192;</button>
<button id="vpzShrink" class="yt-uix-button-default" title="Shrink">&#x2199;</button>
<button id="vpzExpand" class="yt-uix-button-default" title="Expand">&#x2197;</button>
<button id="vpzShrinkH" class="yt-uix-button-default" title="Shrink Horizontal">&#x21C7;</button>
<button id="vpzExpandH" class="yt-uix-button-default" title="Expand Horizontal">&#x21C9;</button>
<button id="vpzShrinkV" class="yt-uix-button-default" title="Shrink Vertical">&#x21CA;</button>
<button id="vpzExpandV" class="yt-uix-button-default" title="Expand Vertical">&#x21C8;</button>
<button id="vpzConfig" class="yt-uix-button-default" title="Show/Hide Profiles Panel">P</button>
<div id="vpzCfgContainer">
  Configs: <select id="vpzConfigs"></select>
  <button id="vpzSaveCfg" class="yt-uix-button-default">Save</button>
  <button id="vpzLoadCfg" class="yt-uix-button-default">Load</button>
  <button id="vpzDelCfg" class="yt-uix-button-default">Delete</button>
</div>`);
        var a = window["movie_player"].querySelector(".ytp-chrome-controls .ytp-right-controls");
        a.parentNode.insertBefore(vpzPanel, a);

        vpzReset.onclick = function() {
          setPos();
          setSize();
        };

        vpzMoveL.onclick = function() {
          setPos(-8, 0);
        };
        vpzMoveU.onclick = function() {
          setPos(0, -8);
        };
        vpzMoveD.onclick = function() {
          setPos(0, 8);
        };
        vpzMoveR.onclick = function() {
          setPos(8, 0);
        };

        vpzShrink.onclick = function() {
          setSize(-0.01, -0.01);
        };
        vpzExpand.onclick = function() {
          setSize(0.01, 0.01);
        };

        vpzShrinkH.onclick = function() {
          setSize(-0.01, 0);
        };
        vpzExpandH.onclick = function() {
          setSize(0.01, 0);
        };

        vpzShrinkV.onclick = function() {
          setSize(0, -0.01);
        };
        vpzExpandV.onclick = function() {
          setSize(0, 0.01);
        };

        vpzConfig.onclick = function() {
          vpzCfgContainer.style.display = vpzCfgContainer.style.display ? "" : "block";
        };

        var i, opt;
        for (i = 0; i < configs.length; i++) {
          opt = document.createElement("OPTION");
          opt.value = i;
          opt.textContent = configs[i].name;
          vpzConfigs.appendChild(opt);
        }

        function configIndex(cfgName) {
          for (var i = configs.length-1; i >= 0; i--) {
            if (configs[i].name === cfgName) {
              return i;
              break;
            }
          }
          return -1;
        }
        function optionIndex(idx) {
          for (var i = configs.length-1; i >= 0; i--) {
            if (vpz.options[i].value == idx) {
              return i;
              break;
            }
          }
          return -1;
        }

        vpzSaveCfg.onclick = function() {
          var cfgName, idx, i, opt;
          if (vpzConfigs.selectedIndex >= 0) {
            cfgName = vpzConfigs.selectedOptions[0].textContent;
          } else {
            cfgName = "";
          }
          cfgName = prompt("Enter configuration name.", cfgName);
          if (cfgName === null) return;
          cfgName = cfgName.trim();
          if (!cfgName) return;
          idx = configIndex(cfgName);
          if (idx >= 0) {
            if (!confirm("Replace existing configuration?")) return;
            vpzConfigs.options[optionIndex(idx)].textContent = cfgName;
          } else {
            idx = configs.length;
            opt = document.createElement("OPTION");
            opt.value = idx;
            opt.textContent = cfgName;
            vpzConfigs.appendChild(opt);
            vpzConfigs.selectedIndex = idx;
          }
          configs.splice(idx, 1, {
            name: cfgName,
            data: [deltaX, deltaY, scaleX, scaleY]
          });
          localStorage.vpzConfigs = JSON.stringify(configs);
        };
        vpzLoadCfg.onclick = function() {
          var idx;
          if (vpzConfigs.selectedIndex < 0) return;
          idx = parseInt(vpzConfigs.selectedOptions[0].value);
          setPos();
          setPos(configs[idx].data[0], configs[idx].data[1]);
          scaleX = 0; scaleY = 0;
          setSize(configs[idx].data[2], configs[idx].data[3]);
        };
        vpzDelCfg.onclick = function() {
          if ((vpzConfigs.selectedIndex < 0) || !confirm("Delete selected configuration?")) return;
          configs.splice(vpzConfigs.selectedOptions[0].value, 1);
          localStorage.vpzConfigs = JSON.stringify(configs);
          vpzConfigs.removeChild(vpzConfigs.selectedOptions[0]);
        };

      }
    }

    function init() {
      eleVideo = document.querySelector(".html5-main-video");
      if (eleVideo) {
        baseWidth = eleVideo.offsetWidth;
        baseHeight = eleVideo.offsetHeight;
        posX = eleVideo.offsetLeft;
        posY = eleVideo.offsetTop;
        deltaX = 0;
        deltaY = 0;
        scaleX = 1;
        scaleY = 1;
        eleContainer = eleVideo.parentNode.parentNode;
        containerWidth = eleContainer.offsetWidth;
        containerHeight = eleContainer.offsetHeight;
        configs = JSON.parse(localStorage.vpzConfigs || "[]");
        if (eleVideo.videoHeight) {
          eleVideo.style.left = "0px";
          eleVideo.style.top = "0px";
          eleVideo.style.width = "100%";
          baseWidth = eleVideo.offsetWidth;
          baseHeight = eleVideo.offsetHeight;
          setup();
        } else {
          setTimeout(init, 100);
        }
        (new MutationObserver(function(records, obj) {
          if (!changing) delayedUpdateAll();
        })).observe(eleVideo, {
          attributes: true,
          attributeFilter: ["style"]
        });
      }
    }
    init();
    addEventListener("spfdone", init, false);

    addEventListener("resize", function() {
      if (!eleVideo || !window.vpzConfigs) return;
      setTimeout(updateAll, resizeUpdateDelay);
    }, false);
  }).toString() + ")()");
  document.head.appendChild(ele);
})()
