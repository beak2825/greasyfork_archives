// ==UserScript==

// @name         115VR播放(公众号:代码简单说)
// @description   简单实现115网盘VR播放功能
// @match        https://115vod.com/?*
// @author       公众号:代码简单说
// @require      https://cdn.jsdelivr.net/npm/mxreality.js@1.2.20/build/three.js

// @require      https://cdn.jsdelivr.net/npm/mxreality.js@1.2.20/build/hls.js
// @require      https://cdn.jsdelivr.net/npm/m3u8-parser@4.2.0/dist/m3u8-parser.min.js

// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @version 0.0.2.202505211952
// @namespace https://greasyfork.org/users/461328
// @downloadURL https://update.greasyfork.org/scripts/419872/115VR%E6%92%AD%E6%94%BE%28%E5%85%AC%E4%BC%97%E5%8F%B7%3A%E4%BB%A3%E7%A0%81%E7%AE%80%E5%8D%95%E8%AF%B4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/419872/115VR%E6%92%AD%E6%94%BE%28%E5%85%AC%E4%BC%97%E5%8F%B7%3A%E4%BB%A3%E7%A0%81%E7%AE%80%E5%8D%95%E8%AF%B4%29.meta.js
// ==/UserScript==


! function (e, t) {
  "object" == typeof exports && "undefined" != typeof module ? t(exports) : "function" == typeof define && define.amd ? define(["exports"], t) : t(e)
}(this, function (e) {
  var t = function (e, t, i, n, r) {
    console.log("version 1.2.20"), this.scene = e, this.renderer = t, this.container = i, o.initDomStyle(i), o.setCameraPara(this, n, r), this.vrbox = {
      radius: 2,
      widthSegments: 180,
      heightSegments: 180,
      width: 2,
      height: 2,
      depth: 2
    }, this.liveSettings = {
      forceUseHls: !1,
      forceUseVndAppleMpegUrl: !1,
      forceUseXmpegUrl: !1,
      usePlugin: !1,
      loadPlugin: function (e) {
        console.log("load video", e)
      }
    }, this.hlsConfig = {
      autoStartLoad: !0
    }, this.flvConfig = {
      type: "flv",
      isLive: !0
    }, this.destoryed = !1, this.video = null, this.audio = null, this.toolBar = null, this.clock = new THREE.Clock, this.VRObject = new THREE.Object3D, this.defaultAutoHideLeftTime = 3, this.defaultVoiceHideLeftTime = 2, this.defaultVolume = .3, this.sliceSegment = 0, this._controlTarget = new THREE.Vector3(0, 0, 1e-4), this._cubeCameraTimes = .96, this.playCfg = {
      muted: !1,
      autoplay: !1
    }, this.resType = {
      video: "video",
      box: "box",
      slice: "slice",
      sliceVideo: "sliceVideo",
      flvVideo: "flvVideo"
    }, this.videoPlayHook = function () {
      console.log("video play")
    }, this.videoPauseHook = function () {
      console.log("video pause")
    }, this.asteroidConfig = {
      enable: !1,
      asteroidFPS: 10,
      asteroidFov: 135,
      asteroidForwardTime: 2600,
      asteroidWaitTime: 2e3,
      asteroidDepressionRate: .5,
      asteroidTop: 1,
      cubeResolution: 2048,
      rotationAngleOfZ: 0
    }, this.VRhint = "请取消屏幕翻转锁定后装入VR盒子中", this.camera = new THREE.PerspectiveCamera(this.cameraPara.fov, this.cameraPara.aspect, this.cameraPara.near, this.cameraPara.far), this.camera.lookAt(this._controlTarget), this.cameraEvt = {
      controlGroup: function () {},
      updatePosition: function () {},
      hover: function () {},
      leave: function () {}
    }, this._takeScreenShot = !1, this.timerList = {}, this.camera.position.set(this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z), this.loadProgressManager = new THREE.LoadingManager(function (e) {
      console.log("loaded")
    }, function (e, t, i) {
      console.log("item=", e, "loaded", t, "total=", i)
    }, function (e, t) {
      console.log(e, t)
    }), this.scene.add(this.camera), this.scene.add(this.VRObject), this.effect = o.stereoEffect(this.renderer), o.bindOrientationEvent(this, this._controlTarget)
  };
  t.prototype.destroy = function () {
    var e = this;
    e.video && (e.video.pause(), e.video = null), e.audio && (e.audio.pause(), e.audio = null), e.hlsPlayer && e.hlsPlayer.destroy(), e.flvPlayer && e.flvPlayer.destroy();
    for (var t in e.timerList) clearInterval(e.timerList[t]);
    e.destoryed = !0
  }, t.prototype.init = function (e) {
    function t() {
      p.controls && p.controls.reset()
    }

    function i(e) {
      T.isMouseDown = !0;
      var t = e.clientX || e.changedTouches[0].clientX,
        i = e.clientY || e.changedTouches[0].clientY;
      f.set(t, i), g.set(t, i), p.autoHideLeftTime = p.defaultAutoHideLeftTime, T.isActive = !0
    }

    function n(e) {
      T.isMouseDown = !1
    }

    function r(e) {
      if (e.preventDefault(), p.autoHideLeftTime = p.defaultAutoHideLeftTime, p.toolBar.isActive = !0, T.isMouseDown) {
        var t = e.clientX || e.changedTouches[0].clientX,
          i = e.clientY || e.changedTouches[0].clientY,
          o = g.y - i;
        o >= 5 && s(6), o <= -5 && s(-10), g.set(t, i)
      }
    }

    function a(e) {
      if (void 0 === p.controls.defaultDampingFactor && (p.controls.defaultDampingFactor = p.controls.dampingFactor), void 0 === p.controls.object.defaultFov && (p.controls.object.defaultFov = p.controls.object.fov), e) {
        var t = 0,
          i = [];
        [].forEach.call(e, function (e) {
          var o = w[e.identifier];
          if (o && (o.y = e.pageY, o.x = e.pageX, i.push(e.identifier)), t++, t >= 2) {
            var n = w[i[0]],
              r = w[i[1]],
              a = Math.sqrt(Math.pow(n.x - r.x, 2) + Math.pow(n.y - r.y, 2)),
              s = (a - b) / 4;
            return p.controls.object.fov - s < 140 && p.controls.object.fov - s > 10 && b && (p.controls.enable = !1, p.controls.object.fov -= s, p.controls.dampingFactor = p.controls.defaultDampingFactor * p.controls.object.defaultFov / p.controls.object.fov), b = a, void(t = 0)
          }
        })
      }
    }

    function s(e) {
      clearInterval(p.timerList.slideBarAniateTimer), p.timerList.slideBarAniateTimer = animateTimer = setInterval(function () {
        var t = T.toolbar.clientHeight + e;
        t >= T.defaultHeight && t <= T.defaultMaxHeight ? (T.toolbar.style.height = t + "px", T.isActive = !0) : (clearInterval(animateTimer), e > 0 ? (T.isActive = !0, T.moreBtn.style.transform = "rotate(-180deg)", T.moreBtn.style.webkitTransform = "rotate(-180deg)", T.toolbar.style.height = T.defaultMaxHeight + "px", T.about.style.display = "block") : (T.isActive = !1, T.moreBtn.style.transform = "rotate(0deg)", T.moreBtn.style.webkitTransform = "rotate(0deg)", T.toolbar.style.height = T.defaultHeight + "px", T.about.style.display = "none")), p.autoHideLeftTime = p.defaultAutoHideLeftTime
      }, 1)
    }

    function c(e) {
      p.autoHideLeftTime = p.defaultAutoHideLeftTime, T.isActive = !0;
      var t = e.clientX || e.changedTouches[0].clientX,
        i = e.clientY || e.changedTouches[0].clientY;
      T.isMouseDown && (T.moreList.scrollLeft += 2.5 * (g.x - t)), g.set(t, i)
    }

    function l(e) {
      p.camera.fov += .05 * e, p.camera.updateProjectionMatrix()
    }

    function d(e) {
      if (e.style.borderBottom = "1px solid #ccc", p.cameraEvt.controlGroup.length) {
        var t = p.cameraEvt.controlGroup.getObjectByName("__focus");
        t.visible = !0
      }
    }

    function u(e) {
      if (e.style.borderBottom = "none", p.cameraEvt.controlGroup.length) {
        var t = p.cameraEvt.controlGroup.getObjectByName("__focus");
        t.visible = !1
      }
    }

    function h() {
      var e = p.video || p.audio;
      if (e) {
        var t = o.getBoundingClientRect(p.container);
        T.voice_bar.style.display = "block";
        var i, n = T.voice_bar,
          r = n.firstChild,
          a = r.firstChild,
          s = (a.firstChild, !1),
          c = 0,
          l = 0;
        e.volume = p.defaultVolume;
        var d = T.voice_bar.clientHeight,
          u = (p.container.clientHeight - d) / 2,
          h = d + u;
        a.style.height = e.volume * d + "px", n.addEventListener("mousedown", function (e) {
          n.style.opacity = 1
        }, !1), r.addEventListener("click", function (i) {
          var o = (i.clientY || i.changedTouches[0].clientY) - t.top;
          p.voiceHideLeftTime = p.defaultVoiceHideLeftTime;
          var n = h - o;
          n / d <= 1 && (a.style.height = n + "px", e.volume = n / d)
        }, !1), n.addEventListener("mouseout", function (e) {
          s = !1
        }, !1), n.addEventListener("mousedown", function (e) {
          s = !0
        }, !1), n.addEventListener("mouseup", function (e) {
          s = !1
        }, !1), n.addEventListener("mousemove", function (i) {
          var o = (i.clientY || i.changedTouches[0].clientY) - t.top;
          if (p.voiceHideLeftTime = p.defaultVoiceHideLeftTime, s) {
            var n = h - o;
            a.style.height = n + "px", n / d <= 1 && (e.volume = n / d)
          }
        }, !1), n.addEventListener("touchstart", function (e) {
          e.preventDefault(), p.voiceHideLeftTime = p.defaultVoiceHideLeftTime, i = a.clientHeight, c = e.touches[0].pageY, n.style.opacity = 1
        }, !1), n.addEventListener("touchmove", function (t) {
          t.preventDefault(), p.voiceHideLeftTime = p.defaultVoiceHideLeftTime, l = t.touches[0].pageY;
          var o = i + (c - l);
          o / d <= 1 && (a.style.height = o + "px", e.volume = o / d)
        }, !1), n.addEventListener("touchend", function (e) {
          i = 0
        }, !1), clearInterval(p.timerList.voiceBarActiveTimer), p.timerList.voiceBarActiveTimer = setInterval(function () {
          p.voiceHideLeftTime <= 0 ? n.style.opacity = 0 : p.toolBar.isActive ? null : p.voiceHideLeftTime--
        }, 1e3)
      }
    }

    function m() {
      if (!p.destoryed) {
        var t = p.container.offsetWidth,
          i = p.container.offsetHeight;
        if (p.camera.aspect = t / i, o.isMobileDevice() && o.isCrossScreen() ? (p.cameraEvt.updatePosition(), p.effect.setSize(t, i), p.effect.render(p.scene, p.camera)) : (p.renderer.setSize(t, i), p.renderer.setClearColor(new THREE.Color(16777215)), p.renderer.render(p.scene, p.camera)), p._takeScreenShot) {
          p._takeScreenShot = !1;
          var n = p.renderer.domElement.toDataURL("image/jpeg");
          p._takeScreenShotCallback(n)
        }
        p.camera.updateProjectionMatrix(), p.controls && p.controls.update(), e()
      }
    }

    function v() {
      m(), requestAnimationFrame(v)
    }
    var p = this,
      f = new THREE.Vector2,
      g = new THREE.Vector2;
    p.toolBar = o.toolBar(p.container);
    var E, y, T = p.toolBar,
      w = {},
      b = 0;
    T.defaultHeight = T.toolbar.clientHeight, T.defaultMaxHeight = 5 * T.defaultHeight, T.isMouseDown = !1, p.container.addEventListener("click", function () {
      p.autoHideLeftTime = p.defaultAutoHideLeftTime, T.toolbar.style.display = "block"
    }), T.gyroBtn.addEventListener("click", function () {
      p.gyroBtnClick()
    }, !1), T.vrBtn.addEventListener("click", function () {
      p.vrBtnClick()
    }, !1), T.moreBtn.addEventListener("click", function () {
      p.moreBtnClick()
    }, !1), p.container.addEventListener("touchstart", function (e) {
      p.touchStart(e)
    }, !1), p.container.addEventListener("touchmove", function (e) {
      p.touchMove(e)
    }, !1), p.container.addEventListener("touchend", function (e) {
      p.touchEnd(e)
    }, !1), T.gyroResetBtn.addEventListener("click", t, !1), T.toolbar.addEventListener("mousedown", i, !1), T.toolbar.addEventListener("touchstart", i, !1), T.toolbar.addEventListener("mousemove", r, !1), T.toolbar.addEventListener("touchmove", r, !1), T.toolbar.addEventListener("mouseup", n, !1), T.toolbar.addEventListener("touchend", n, !1), T.toolbar.addEventListener("mouseout", function (e) {
      p.autoHideLeftTime = p.defaultAutoHideLeftTime, T.isActive = !1
    }, !1), p.renderer.domElement.addEventListener("wheel", function (e) {
      var t = e.deltaY > 0 ? 100 : -100;
          const scale = 0.05; // 每步乘的系数（可调）
      p.camera.fov + scale * t >= 10 && p.camera.fov + scale * t <= 120 && l(t)
    }, !1), T.moreList.addEventListener("mousemove", c, !1), T.moreList.addEventListener("touchmove", c, !1), p.moreBtnClick = function (e) {
      s(T.toolbar.clientHeight > T.defaultHeight ? -10 : 6)
    }, p.vrBtnClick = function (e) {
      var t = p.toolBar.vrBtn;
      o.isMobileDevice() ? o.OS.isWeixin() && !o.OS.isiOS() ? "landscape" == p.video.getAttribute("x5-video-orientation") ? (p.video.setAttribute("x5-video-orientation", "portraint"), u(t)) : (p.video.setAttribute("x5-video-orientation", "landscape"), d(t)) : o.isCrossScreen() ? (d(t), o.fullscreen(p.container)) : (u(t), o.msgBox(p.VRhint, 5, p.container)) : (t.getAttribute("fullscreen") ? (u(t), t.removeAttribute("fullscreen")) : (d(t), t.setAttribute("fullscreen", "true")), o.fullscreen(p.container))
    }, p.gyroBtnClick = function (e) {
      var t = p.toolBar.gyroBtn;
      "active" == t.getAttribute("active") ? (p.controls.gyroFreeze(), u(t), t.removeAttribute("active")) : (p.controls.gyroUnfreeze(), t.setAttribute("active", "active"), d(t))
    }, p.touchStart = function (e) {
      e.targetTouches && ([].forEach.call(e.targetTouches, function (e) {
        w[e.identifier] || (w[e.identifier] = new THREE.Vector2(0, 0))
      }), clearInterval(p.timerList.renderTouchersRimer), p.timerList.renderTouchersRimer = setInterval(function () {
        a(E)
      }, 1))
    }, p.touchEnd = function (e) {
      e.targetTouches && ([].forEach.call(e.changedTouches, function (e) {
        var t = w[e.identifier];
        t && delete w[e.identifier]
      }), 0 === e.targetTouches.length && (b = 0, p.controls.enable = !0, clearInterval(y)))
    }, p.touchMove = function (e) {
      E = e.touches
    }, p.windowResize = function () {
      o.isFullscreen() ? o.isMobileDevice() ? o.isCrossScreen() ? d(p.toolBar.vrBtn) : u(p.toolBar.vrBtn) : d(p.toolBar.vrBtn) : o.OS.isWeixin() && !o.OS.isiOS() ? ("landscape" == p.video.getAttribute("x5-video-orientation") ? d(p.toolBar.vrBtn) : u(p.toolBar.vrBtn), o.isCrossScreen() ? d(p.toolBar.vrBtn) : u(p.toolBar.vrBtn)) : (o.isCrossScreen() ? d(p.toolBar.vrBtn) : u(p.toolBar.vrBtn), u(p.toolBar.vrBtn))
    }, window.addEventListener("resize", function () {
      h()
    }, !1), p._play = function () {
      T.btn.innerHTML = o.playerIcon.pauseSvg
    }, p._pause = function () {
      T.btn.innerHTML = o.playerIcon.playSvg
    }, p.bindVolumeBar = h, v(), clearInterval(p.timerList.toolBarAutoHideTimer), p.timerList.toolBarAutoHideTimer = setInterval(function () {
      T.isActive || (p.autoHideLeftTime < 0 ? (T.toolbar.style.display = "none", p.autoHideLeftTime = p.defaultAutoHideLeftTime, T.isActive = !1) : p.autoHideLeftTime--), p.windowResize()
    }, 1e3)
  }, t.prototype.takeScreenShot = function (e) {
    this._takeScreenShot = !0, this._takeScreenShotCallback = e
  }, Object.defineProperty(t.prototype, "playPanorama", {
    get: function () {
      return console.warn("playPanorama() no longer supports. Use play() instead."), t.prototype.play
    }
  }), t.prototype.play = function (e, t, i) {
    function n() {
      f.hlsPlayer = new Hls(f.hlsConfig), f.hlsPlayer.loadSource(e), f.hlsPlayer.attachMedia(P), f.hlsPlayer.on(Hls.Events.MANIFEST_PARSED, function () {
        P.play()
      })
    }

    function r() {
      var t = o.createTag("source", {
        src: e,
        type: "application/x-mpegURL"
      }, null);
      P.appendChild(t)
    }

    function a() {
      P.src = e, P.addEventListener("loadedmetadata", function () {})
    }

    function s(e) {
      P.paused ? (f._play(), P.play(), f.videoPlayHook()) : (f._pause(), P.pause(), f.videoPauseHook())
    }

    function c(e) {
      rect = o.getBoundingClientRect(f.container);
      var t = (e.clientX || e.changedTouches[0].clientX) - rect.left;
      P.currentTime = P.duration * (t / this.clientWidth)
    }

    function l(e) {
      f.video.buffTimer || (clearInterval(f.timerList.videoBuffTimer), f.timerList.videoBuffTimer = f.video.buffTimer = setInterval(function (e) {
        var t = 0;
        0 != P.buffered.length && (t += P.buffered.end(0)), t >= P.duration && clearInterval(f.video.buffTimer), g.loadedProgress.style.width = t / P.duration * 100 + "%"
      }, 500))
    }

    function d(e, t) {
      t = t || !1, material = new THREE.MeshBasicMaterial({
        overdraw: !0,
        map: e
      });
      var i = f.VRObject.getObjectByName("__mxrealityDefault");
      if (i) i.material = material, i.visible = !0;
      else {
        var o = -Math.PI / 2,
          n = new THREE.SphereBufferGeometry(f.vrbox.radius, f.vrbox.widthSegments, f.vrbox.heightSegments, o);
        n.scale(-1, 1, 1), mesh = new THREE.Mesh(n, material), mesh.visible = !0, mesh.name = "__mxrealityDefault", t && (mesh.matrixAutoUpdate = !1, mesh.updateMatrix(), f.toolBar.timeInfo.style.display = "none"), f.VRObject.add(mesh)
      }
      f.asteroidConfig.enable && (f.asteroidForward = function (e) {
        u(e)
      })
    }

    function u(e) {
      f.controls && (f.controls.reset(), f.controls.enable = !1);
      var t = f.asteroidConfig,
        i = f.camera.fov,
        o = f._containerRadius * (.9 * f._cubeCameraTimes);
      f.camera.position.y = o * t.asteroidTop, f.camera.rotation.x = THREE.Math.degToRad(-90), f.camera.fov = t.asteroidFov;
      var n = t.asteroidForwardTime * t.asteroidFPS / 300,
        r = o / n,
        a = f.camera.fov - i,
        s = a / n,
        c = (Math.PI / 2 / n, !1),
        l = !1,
        d = new THREE.Vector3(f._controlTarget.x, f._controlTarget.y, f._controlTarget.z);
      setTimeout(function () {
        f.timerList.asteroidForwardTimer = asteroidForwardTimer = setInterval(function () {
          t.asteroidTop * f.camera.position.y - r >= 0 ? (f.camera.position.y -= r * t.asteroidTop, f.camera.lookAt(d), d.z *= 1.25) : c = !0, f.camera.fov - s >= i ? f.camera.fov -= s : l = !0, c && l && (clearInterval(asteroidForwardTimer), f.controls.enable = !0, f.camera.position.y = 0, f.camera.fov = i, void 0 !== e && e())
        }, t.asteroidFPS)
      }, t.asteroidWaitTime)
    }
    var h = Object.assign(this.playCfg, i),
      m = ["__mxrealitySkybox", "__mxrealitySlice", "__mxrealityDefault"];
    for (var v in m) {
      var p = this.VRObject.getObjectByName(m[v]);
      p && (p.visible = !1), this.cubeCameraSphere && (this.cubeCameraSphere.visible = !1)
    }
    var f = this,
      g = f.toolBar;
    if (f._containerRadius = f.resType.box == t || f.resType.slice == t ? f.vrbox.width / 2 : f.vrbox.radius, f.autoHideLeftTime = f.defaultAutoHideLeftTime, f.voiceHideLeftTime = f.defaultVoiceHideLeftTime, f.resType.box == t) {
      f.toolBar.timeInfo.style.display = "none";
      var E = [],
        y = [],
        T = new Image;
      T.crossOrigin = "Anonymous", T.src = e, T.onload = function () {
        for (var e, t, i = T.height, o = 0; o < 6; o++) E[o] = new THREE.Texture, e = document.createElement("canvas"), t = e.getContext("2d"), e.height = i, e.width = i, t.drawImage(T, i * o, 0, i, i, 0, 0, i, i), E[o].image = e, E[o].needsUpdate = !0, y.push(new THREE.MeshBasicMaterial({
          map: E[o]
        }));
        var n = f.VRObject.getObjectByName("__mxrealitySkybox");
        if (n) n.material = y;
        else {
          var n = new THREE.Mesh(new THREE.CubeGeometry(f.vrbox.width, f.vrbox.height, f.vrbox.depth), new THREE.MultiMaterial(y));
          n.applyMatrix((new THREE.Matrix4).makeScale(1, 1, -1)), n.visible = !0, n.name = "__mxrealitySkybox", n.matrixAutoUpdate = !1, n.updateMatrix(), f.VRObject.add(n), g.btn.addEventListener("click", function (e) {
            f.controls.autoRotate ? f._pause() : f._play(), f.controls.autoRotate = !f.controls.autoRotate
          })
        }
        f.loadProgressManager.onLoad()
      }
    } else if (f.resType.slice == t) {
      f.toolBar.timeInfo.style.display = "none";
      var w = new THREE.TextureLoader(f.loadProgressManager);
      w.mapping = THREE.UVMapping;
      for (var y = [], v = 0; v < e.length; v++) {
        var b = w.load(e[v]);
        y.push(new THREE.MeshBasicMaterial({
          map: b
        }))
      }
      for (var x = new THREE.CubeGeometry(f.vrbox.width, f.vrbox.height, f.vrbox.depth, f.sliceSegment, f.sliceSegment, f.sliceSegment), R = 0, H = [new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1), new THREE.Vector2(0, 1)], v = 0, L = x.faces.length; v < L; v += 2) x.faces[v].materialIndex = R, x.faces[v + 1].materialIndex = R, x.faceVertexUvs[0][v] = [H[3], H[0], H[2]], x.faceVertexUvs[0][v + 1] = [H[0], H[1], H[2]], R++;
      var p = f.VRObject.getObjectByName("__mxrealitySlice");
      if (p) p.material = y, p.geometry = x, p.updateMatrix();
      else {
        var S = new THREE.Mesh(x, y);
        S.applyMatrix((new THREE.Matrix4).makeScale(1, 1, -1)), S.name = "__mxrealitySlice", S.visible = !0, S.matrixAutoUpdate = !1, S.updateMatrix(), f.VRObject.add(S), f.cubeCamera = new THREE.CubeCamera(f._containerRadius, f.cameraPara.far, f.asteroidConfig.cubeResolution);
        var C = f.cubeCamera.renderTarget.texture;
        C.minFilter = THREE.LinearMipMapLinearFilter, f.VRObject.add(f.cubeCamera), material = new THREE.MeshBasicMaterial({
          envMap: f.cubeCamera.renderTarget.texture,
          side: THREE.BackSide
        }), f.cubeCameraSphere = new THREE.Mesh(new THREE.SphereGeometry(f._containerRadius * f._cubeCameraTimes, 180, 180), material), f.cubeCameraSphere.position.set(0, 0, 0), f.cubeCameraSphere.name = "__mxrealitySlice", f.cubeCameraSphere.visible = !0, f.cubeCameraSphere.matrixAutoUpdate = !1, f.cubeCameraSphere.updateMatrix(), f.VRObject.add(f.cubeCameraSphere), g.btn.addEventListener("click", function (e) {
          f.controls.autoRotate ? f._pause() : f._play(), f.controls.autoRotate = !f.controls.autoRotate
        })
      }
      f.asteroidConfig.enable ? (f.cubeCameraSphere.visible = !0, f.asteroidForward = function (e) {
        f.cubeCamera.update(f.renderer, f.scene), u(e)
      }) : f.cubeCameraSphere.visible = !1
    } else {
      var M = [f.resType.video, f.resType.sliceVideo, f.resType.flvVideo];
      if (M.indexOf(t) >= 0) {
        if (f.video)
          for (var P = f.video, A = 0; A < P.childNodes.length; A++) P.removeChild(P.childNodes[A]);
        else var P = f.video = o.createTag("video", {
          "webkit-playsinline": !0,
          playsinline: !0,
          preload: "auto",
          "x-webkit-airplay": "allow",
          "x5-video-player-type": "h5",
          "x5-video-player-fullscreen": !0,
          "x5-video-orientation": "portrait",
          style: "object-fit: fill",
          loop: "loop"
        }, {
          allowsInlineMediaPlayback: !0,
          crossOrigin: "Anonymous"
        });
        if (P.muted = h.muted, h.autoplay ? (P.setAttribute("autoplay", !0), P.play()) : P.removeAttribute("autoplay"), f.resType.sliceVideo == t) f.liveSettings.usePlugin ? f.liveSettings.loadPlugin(P) : f.liveSettings.forceUseHls ? (n(), console.info("force use hls")) : f.liveSettings.forceUseVndAppleMpegUrl ? (a(), console.info("force use application/vnd.apple.mpegurl")) : f.liveSettings.forceUseXmpegUrl ? (r(), console.info("force use application/x-mpegURL")) : Hls.isSupported() ? n() : P.canPlayType("application/vnd.apple.mpegurl") ? a() : P.canPlayType("application/x-mpegURL") ? r() : console.error("The browser does not support the current live stream," + e);
        else if (f.resType.flvVideo == t) {
          if (!flvjs.isSupported()) return void console.error("Your browser does not support flvjs");
          f.flvConfig.url = e, f.flvPlayer = flvjs.createPlayer(f.flvConfig), f.flvPlayer.attachMediaElement(P), f.flvPlayer.load(), f.flvPlayer.play()
        } else P.canPlayType("application/vnd.apple.mpegurl") ? P.src = e : P.src = e;
        P.removeEventListener("canplaythrough", l), g.progressBar.removeEventListener("click", c), g.btn.removeEventListener("click", s), P.addEventListener("canplaythrough", l, !1), g.progressBar.addEventListener("click", c, !1), g.btn.addEventListener("click", s, !1), P.load(), f.video.buffTimer = null;
        var b = new THREE.VideoTexture(P);
        b.generateMipmaps = !1, b.minFilter = THREE.LinearFilter, b.magFilter = THREE.LinearFilter, b.format = THREE.RGBAFormat, d(b), clearInterval(f.timerList.videoProgressTimer), f.timerList.videoProgressTimer = f.video.progressTimer = setInterval(function (e) {
          g.playProgress.style.width = P.currentTime / P.duration * 100 + "%", g.curTime.innerText = o.formatSeconds(P.currentTime), g.totalTime.innerText = o.formatSeconds(P.duration), f.autoHideLeftTime < 0 && !P.paused ? g.toolbar.style.display = "none" : f.autoHideLeftTime--
        }, 1e3), f.loadProgressManager.onLoad()
      } else new THREE.TextureLoader(f.loadProgressManager).load(e, function (e) {
        d(e, !0)
      })
    }
  }, t.prototype.sphere2BoxPano = function (e, t, i, o) {
    function n(e, t, i, o) {
      var n = e.createTexture();
      if (!n) return console.log("Failed to create the texture object!"), !1;
      var a = e.getUniformLocation(t, "u_Sampler");
      return r(e, i, n, a, o), !0
    }

    function r(e, t, i, n, r) {
      h.asteroidConfig.enable && e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, -1), e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, i), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), e.texImage2D(e.TEXTURE_2D, 0, e.RGB, e.RGB, e.UNSIGNED_BYTE, r), e.uniform1i(n, 0), e.clear(e.COLOR_BUFFER_BIT), e.drawArrays(e.TRIANGLE_STRIP, 0, t), p < 5 ? p++ : o(u())
    }

    function a(e, t) {
      var i = new Float32Array([-1, 1, 0, 1, -1, -1, 0, 0, 1, 1, 1, 1, 1, -1, 1, 0]),
        o = 4,
        n = e.createBuffer();
      if (!n) return console.log("Failed to create the buffer object!"), -1;
      e.bindBuffer(e.ARRAY_BUFFER, n), e.bufferData(e.ARRAY_BUFFER, i, e.STATIC_DRAW);
      var r = i.BYTES_PER_ELEMENT,
        a = e.getAttribLocation(t, "a_Position");
      e.vertexAttribPointer(a, 2, e.FLOAT, !1, 4 * r, 0), e.enableVertexAttribArray(a);
      var s = e.getAttribLocation(t, "a_TexCoord");
      return e.vertexAttribPointer(s, 2, e.FLOAT, !1, 4 * r, 2 * r), e.enableVertexAttribArray(s), o
    }

    function s(e, t) {
      var i, o = c(e, t),
        n = c(e);
      return i = e.createProgram(), e.attachShader(i, n), e.attachShader(i, o), e.linkProgram(i), e.getProgramParameter(i, e.LINK_STATUS) ? (e.useProgram(i), e.enableVertexAttribArray(i.vertexPositionAttribute), i.vertexColorAttribute = e.getAttribLocation(i, "aVertexColor"), i.pMatrixUniform = e.getUniformLocation(i, "uPMatrix"), i.mvMatrixUniform = e.getUniformLocation(i, "uMVMatrix"), i) : null
    }

    function c(e, t) {
      var i, o;
      if (t) {
        if (i = l(t), !i) return null;
        o = e.createShader(e.FRAGMENT_SHADER)
      } else i = d(), o = e.createShader(e.VERTEX_SHADER);
      return e.shaderSource(o, i), e.compileShader(o), e.getShaderParameter(o, e.COMPILE_STATUS) ? o : (console.log(e.getShaderInfoLog(o)), null)
    }

    function l(e) {
      var t = "",
        i = "\n        precision mediump float;\n        varying vec2 v_TexCoord;\n        uniform sampler2D u_Sampler;\n        uniform float PI;\n",
        o = "\n        if(abs(theta)>PI){\n            if(theta>PI){\n                theta -= 2.0*PI;\n            }else{\n                theta += 2.0*PI;\n            }\n        }\n        if(abs(phi)>PI/2.0){\n            if(phi>PI/2.0){\n                phi -= PI;\n            }else{                phi += PI;\n            }\n        }\n        float x = theta/PI*0.5 + 0.5;\n        float y = phi/PI*2.0*0.5 + 0.5;\n        gl_FragColor = texture2D(u_Sampler, vec2(x,y));\n";
      return "z" == e ? t = i + "\n\t\t\tvoid main() {\n\t\t\t\tfloat r = 0.5;\n\t\t\t\tvec2 orig = vec2(0.5-v_TexCoord.x,v_TexCoord.y-0.5);\n\t\t\t\tfloat theta = atan(orig.x,r);\n\t\t\t\tfloat phi = atan(orig.y*cos(theta),r);" + o + "\n\t\t\t}\n" : "nz" == e ? t = i + "\n\t\t\tvoid main() {\n\t\t\t\tfloat r = 0.5;\n\t\t\t\tvec2 orig = vec2(0.5-v_TexCoord.x,v_TexCoord.y-0.5);\n\t\t\t\tfloat theta = atan(orig.x,r);\n\t\t\t\tfloat phi = atan(orig.y*cos(theta),r);\n        \t\ttheta = theta+PI;\n" + o + "\n\t\t\t}\n" : "x" == e ? t = i + "\n\t\t\tvoid main() {\n\t\t\t\tfloat r = 0.5;\n\t\t\t\tvec2 orig = vec2(v_TexCoord.x-0.5,v_TexCoord.y-0.5);\n\t\t\t\tfloat theta = atan(r,orig.x);\n\t\t\t\tfloat phi = atan(orig.y*sin(theta),r);" + o + "\n\t\t\t}\n" : "nx" == e ? t = i + "\n\t\t\tvoid main() {\n\t\t\t\tfloat r = 0.5;\n\t\t\t\tvec2 orig = vec2(v_TexCoord.x-0.5,v_TexCoord.y-0.5);\n\t\t\t\tfloat theta = atan(r,orig.x);\n\t\t\t\tfloat phi = atan(orig.y*sin(theta),r);\n        \t\ttheta = theta+PI;" + o + "\n\t\t\t}\n" : "y" == e ? t = i + "\n\t\t\tvoid main() {\n\t\t\t\tfloat r = 0.5;\n\t\t\t\tvec2 orig = vec2(0.5-v_TexCoord.x,0.5-v_TexCoord.y);\n        \t\tfloat theta = atan(orig.x,orig.y);\n        \t\tfloat phi = atan(r*sin(theta),orig.x);" + o + "\n\t\t\t}\n" : "ny" == e ? t = i + "\n\t\t\tvoid main() {\n\t\t\t\tfloat r = 0.5;\n\t\t\t\tvec2 orig = vec2(0.5-v_TexCoord.x,v_TexCoord.y-0.5);\n\t\t\t\tfloat theta = atan(orig.x,orig.y);\n\t\t\t\tfloat phi = atan(r*sin(theta),orig.x);\n\t\t\t\tphi = -phi;" + o + "\n\t\t\t}\n" : console.error("shader fragment type error!"), t
    }

    function d() {
      var e = "\n        attribute vec4 a_Position;\n        attribute vec2 a_TexCoord;\n        varying vec2 v_TexCoord;\n        void main() {\n            gl_Position= a_Position;\n            v_TexCoord = a_TexCoord;\n        }\n";
      return e
    }

    function u() {
      var e = document.createElement("canvas"),
        o = e.getContext("2d");
      e.width = 6 * t, e.height = i;
      var n = document.createElement("canvas"),
        r = n.getContext("2d");
      n.width = t, n.height = i;
      var a = 180 * Math.PI / 180;
      if (r.rotate(a), h.sliceSegment) {
        var s = [],
          c = document.createElement("canvas");
        c.width = i / h.sliceSegment, c.height = i / h.sliceSegment;
        var l = c.getContext("2d");
        for (var d in v) {
          r.drawImage(v[d], 0, 0, -t, -i);
          for (var u = 0; u < h.sliceSegment; u++)
            for (var m = 0; m < h.sliceSegment; m++) l.putImageData(r.getImageData(m * (i / h.sliceSegment), u * (i / h.sliceSegment), i * (m + 1) / h.sliceSegment, i * (u + 1) / h.sliceSegment), 0, 0), s.push(c.toDataURL("image/jpeg"))
        }
        return s
      }
      for (var d in v) r.drawImage(v[d], 0, 0, -t, -i), o.drawImage(n, t * d, 0, t, i);
      return e.toDataURL("image/jpeg")
    }
    var h = this,
      m = {
        x: "x",
        nx: "nx",
        ny: "ny",
        y: "y",
        z: "z",
        nz: "nz"
      },
      v = [],
      p = 0,
      f = 0,
      g = new Image;
    g.crossOrigin = "Anonymous", g.src = e, g.onload = function () {
      for (var e in m) {
        var o = document.createElement("canvas");
        o.width = t, o.height = i, o.id = "face_" + e, v[f] = o;
        var r = o.getContext("webgl", {
            preserveDrawingBuffer: !0
          }),
          c = s(r, e),
          l = a(r, c),
          d = r.getUniformLocation(c, "PI");
        r.uniform1f(d, Math.PI), r.clearColor(0, 0, 0, 1), n(r, c, l, g) || console.log("Failed to intialize the texture."), f++
      }
    }
  };
  var i = function (e, t, i, n, r) {
    var a = this;
    this.scene = e, this.renderer = t, this.container = i, o.setCameraPara(a, n, r), this.constraints = {}, this.video = null, this.openAudio = !1, this.cameraIndex = 1, this._controlTarget = new THREE.Vector3(1e-4, 0, 0), this.camera = new THREE.PerspectiveCamera(this.cameraPara.fov, this.cameraPara.aspect, this.cameraPara.near, this.cameraPara.far), this.camera.position.set(this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z), this.cameraReady = !1, this.scene.add(this.camera), this.clock = new THREE.Clock, this.tempCanvas = document.createElement("canvas"), this.effect = o.stereoEffect(this.renderer), this._takeScreenShot = !1
  };
  i.prototype.init = function () {
    function e(e) {
      i.video.srcObject = e
    }

    function t(e) {
      alert(e)
    }
    var i = this;
    if (o.bindOrientationEvent(i, i._controlTarget), this.video = o.createTag("video", {
        "webkit-playsinline": !0,
        playsinline: !0,
        preload: "auto",
        "x-webkit-airplay": "allow",
        "x5-playsinline": !0,
        "x5-video-player-type": "h5",
        "x5-video-player-fullscreen": !0,
        "x5-video-orientation": "portrait",
        style: "object-fit: fill",
        autoplay: "autoplay"
      }, {
        allowsInlineMediaPlayback: !0
      }), this.video.style.zIndex = "-99999", this.video.style.position = "absolute", this.video.style.left = "0px", this.video.style.top = "0px", this.video.style.width = "2px", this.video.style.height = "2px", document.body.appendChild(this.video), this.video.oncanplaythrough = function () {
        i.cameraReady = !0, i.video.readyState === i.video.HAVE_ENOUGH_DATA && (i.cameraTexture = new THREE.VideoTexture(i.video), i.cameraTexture.generateMipmaps = !1, i.cameraTexture.format = THREE.RGBAFormat, i.cameraTexture.maxFilter = THREE.NearestFilter, i.cameraTexture.minFilter = THREE.NearestFilter, i.scene.background = i.cameraTexture, i.cameraTexture.needsUpdate = !0)
      }, navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia, window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL, navigator.getUserMedia) {
      var n = {
        audio: i.openAudio,
        video: {
          facingMode: {
            exact: i.cameraIndex ? "environment" : "user"
          }
        }
      };
      navigator.getUserMedia(n, e, t)
    } else alert("Native device meadia streaming(getUserMdeia) not supported in this browser.")
  }, i.prototype.takeCameraPhoto = function () {
    var e = this.tempCanvas.getContext("2d");
    return e.clearRect(0, 0, window.innerWidth, window.innerHeight), e.drawImage(this.video, 0, 0, window.innerWidth, window.innerHeight), e.toDataURL("image/jpeg")
  }, i.prototype.takeScreenShot = function (e) {
    this._takeScreenShot = !0, this._takeScreenShotCallback = e
  }, i.prototype.play = function () {
    function e() {
      if (i._takeScreenShot) {
        i._takeScreenShot = !1;
        var e = i.renderer.domElement.toDataURL("image/jpeg");
        i._takeScreenShotCallback(e)
      }
      if (i.cameraReady) {
        var t = window.innerWidth,
          n = window.innerHeight;
        i.camera.aspect = t / n, i.cameraTexture.repeat.y = n / i.video.videoHeight, i.cameraTexture.offset.x = 0, i.cameraTexture.offset.y = 0, o.isMobileDevice() && o.isCrossScreen() ? (i.cameraTexture.repeat.x = t / (2 * i.video.videoWidth), i.effect.setSize(t, n), i.effect.render(i.scene, i.camera)) : (i.cameraTexture.repeat.x = t / i.video.videoWidth, i.renderer.setSize(t, n), i.renderer.setClearColor(new THREE.Color(16777215)), i.renderer.render(i.scene, i.camera)), i.camera.updateProjectionMatrix()
      }
      i.controls && i.controls.update(i.clock.getDelta())
    }

    function t() {
      requestAnimationFrame(t), e()
    }
    var i = this;
    t()
  };
  var o = {
      debug: !1,
      playerIcon: {
        playSvg: '<svg t="1596623860726" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32635" width="32" height="32"><path fill="#ffffff" d="M744.727273 551.563636L325.818182 795.927273c-30.254545 18.618182-69.818182-4.654545-69.818182-39.563637v-488.727272c0-34.909091 39.563636-58.181818 69.818182-39.563637l418.909091 244.363637c30.254545 16.290909 30.254545 62.836364 0 79.127272z" p-id="32636"></path></svg>',
        pauseSvg: '<svg t="1596624663266" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32779" width="32" height="32"><path fill="#ffffff" d="M442.181818 709.818182c0 37.236364-30.254545 69.818182-69.818182 69.818182s-69.818182-30.254545-69.818181-69.818182v-395.636364c0-37.236364 30.254545-69.818182 69.818181-69.818182s69.818182 30.254545 69.818182 69.818182v395.636364z m279.272727 0c0 37.236364-30.254545 69.818182-69.818181 69.818182s-69.818182-30.254545-69.818182-69.818182v-395.636364c0-37.236364 30.254545-69.818182 69.818182-69.818182s69.818182 30.254545 69.818181 69.818182v395.636364z" p-id="32780"></path></svg>',
        resetLookAtSvg: '<svg t="1596624710564" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32923" width="22" height="22"><path fill="#ffffff" d="M512 512m-163.2 0a163.2 163.2 0 1 0 326.4 0 163.2 163.2 0 1 0-326.4 0Z" fill="#333333" p-id="32924"></path><path fill="#ffffff" d="M512 153.6A358.4 358.4 0 1 1 153.6 512 358.4 358.4 0 0 1 512 153.6M512 64a448 448 0 1 0 448 448A448 448 0 0 0 512 64z" fill="#333333" p-id="32925"></path></svg>',
        gyroSvg: '<svg t="1596624744888" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="33068" width="26" height="26"><path d="M506.148571 516.754286m-384.365714 0a384.365714 384.365714 0 1 0 768.731429 0 384.365714 384.365714 0 1 0-768.731429 0Z" fill="#FFFFFF" p-id="33069"></path><path d="M890.697143 597.942857c0 167.497143-172.068571 303.36-384 303.36s-384-135.862857-384-303.36z" fill="#EAEAEA" p-id="33070"></path><path d="M506.148571 928.731429a411.977143 411.977143 0 1 1 411.977143-411.977143 412.16 412.16 0 0 1-411.977143 411.977143z m0-768a357.12 357.12 0 1 0 357.12 356.022857A357.485714 357.485714 0 0 0 506.148571 159.817143z" fill="#808080" p-id="33071"></path><path d="M418.925714 697.782857A97.828571 97.828571 0 0 1 347.428571 671.085714c-52.48-52.662857-25.051429-162.56 62.537143-250.148571s197.485714-115.2 250.148572-62.537143c52.662857 52.662857 25.234286 162.56-62.354286 250.148571-57.417143 57.6-124.525714 89.234286-178.834286 89.234286z m170.24-310.857143c-36.571429 0-91.428571 24.502857-140.251428 73.142857-67.291429 67.291429-88.502857 146.285714-62.354286 172.617143s105.325714 4.754286 172.617143-62.537143 88.32-146.285714 62.354286-172.617142a44.982857 44.982857 0 0 0-32.365715-11.154286z" fill="#808080" p-id="33072"></path><path d="M682.788571 722.468571a27.245714 27.245714 0 0 1-19.382857-8.045714l-167.314285-167.314286a27.428571 27.428571 0 1 1 38.765714-38.765714L702.171429 676.571429a27.611429 27.611429 0 0 1 0 38.765714 27.977143 27.977143 0 0 1-19.382858 7.131428zM416.731429 457.142857a26.88 26.88 0 0 1-19.382858-8.045714L310.857143 361.325714a27.245714 27.245714 0 0 1 0-38.765714 27.611429 27.611429 0 0 1 38.765714 0l87.04 87.04a27.245714 27.245714 0 0 1 0 38.765714 26.514286 26.514286 0 0 1-19.931428 8.777143z" fill="#808080" p-id="33073"></path></svg>',
        vrSvg: '<svg t="1596624776691" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="33216" width="28" height="28"><path d="M932.224 283.392c-4.352-0.896-8.832-1.408-13.44-1.408H159.488c-38.912 0-70.4 35.072-70.4 78.208v369.92c0 2.688 0.128 5.376 0.384 7.936 3.584 39.424 33.536 70.272 70.016 70.272h759.296c38.912 0 70.4-35.072 70.4-78.208v-369.92c0.128-38.016-24.448-69.76-56.96-76.8z m-417.408 20.224h150.144c43.008 0 72.96 6.144 89.856 18.432 11.648 8.192 20.608 19.072 27.008 32.512 6.272 13.44 9.472 28.288 9.472 44.288 0 32.384-7.424 57.472-22.144 75.264-9.216 10.624-21.376 18.56-36.352 24.064 12.032 4.736 20.992 9.856 27.136 15.104 6.144 5.248 11.648 13.056 16.64 23.296 3.712 8.192 6.4 16 8.064 23.552 1.664 7.552 2.944 18.56 3.968 33.28 1.792 24.576 4.352 41.856 7.424 51.712h-73.216c-2.176-7.808-4.48-24.064-6.912-48.64-1.536-19.84-4.736-34.944-9.472-45.568s-11.904-18.944-21.376-25.088c-12.032-7.168-29.312-10.624-51.968-10.24h-52.48V645.12h-65.408V303.616z m-287.872 0l90.24 256.896 91.648-256.896H482.56L348.16 644.992h-65.408L153.344 303.616h73.6z m477.568 143.36c9.856-7.552 14.72-20.608 14.72-39.424 0-20.864-7.424-34.048-22.144-39.936-5.248-2.048-13.696-3.072-25.344-3.072h-91.648v90.112h91.648c15.488 0 26.368-2.56 32.768-7.68z" fill="#cccccc" p-id="33217"></path><path d="M932.224 283.392c-3.584-39.424-33.536-70.272-70.016-70.272H102.912c-38.912 0-70.4 35.072-70.4 78.208v369.92c0 38.144 24.576 69.888 56.96 76.8 4.352 0.896 8.832 1.408 13.44 1.408h759.296c38.912 0 70.4-35.072 70.4-78.208v-369.92c0-2.56-0.128-5.248-0.384-7.936zM348.16 644.992h-65.408L153.344 303.616h73.728l90.24 256.896 91.648-256.896H482.56L348.16 644.992z m374.4 0c-2.176-7.808-4.48-24.064-6.912-48.64-1.536-19.84-4.736-34.944-9.472-45.568s-11.904-18.944-21.376-25.088c-12.032-7.168-29.312-10.624-51.968-10.24h-52.48v129.536h-65.408V303.616h150.144c43.008 0 72.96 6.144 89.856 18.432 11.648 8.192 20.608 19.072 27.008 32.512 6.272 13.44 9.472 28.288 9.472 44.288 0 32.384-7.424 57.472-22.144 75.264-9.216 10.624-21.376 18.56-36.352 24.064 12.032 4.736 20.992 9.856 27.136 15.104 6.144 5.248 11.648 13.056 16.64 23.296 3.712 8.192 6.4 16 8.064 23.552 1.664 7.552 2.944 18.56 3.968 33.28 1.792 24.576 4.352 41.856 7.424 51.712h-73.6z" fill="#ffffff" p-id="33218"></path><path d="M719.36 407.552c0 18.816-4.864 31.872-14.72 39.424-6.4 5.12-17.408 7.68-32.64 7.68h-91.648v-90.112H672c11.648 0 20.096 1.024 25.344 3.072 14.592 5.888 22.016 19.072 22.016 39.936z" fill="#ffffff" p-id="33219"></path></svg>',
        audioPlaySvg: '<svg t="1596624803551" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="33362" width="24" height="24"><path d="M491.857752 129.427768L245.206166 319.922357v4.37361h-90.428545c-49.776683 0-90.49199 38.923498-90.491991 86.594217v216.422098c0 47.733141 40.715307 86.594217 90.491991 86.594217h90.428545v4.373611l246.651586 192.617949c6.980995 6.404873 15.566534 10.887978 24.888854 12.994966 24.824385 6.560416 45.182039-6.497994 45.182038-30.302144V146.734946c0-8.622378-2.233877-17.243733-6.764054-21.617344-13.529131-17.306154-42.949184-15.182794-63.306838 4.310166zM767.738034 200.902636c-16.20303-8.231475-36.153408-2.50096-45.246507 12.994965-9.0624 15.181771-2.297322 34.549887 13.592576 43.297109 92.725868 49.731658 153.798828 151.507646 153.798828 261.906012S828.809971 731.274052 736.084103 781.069155c-15.889899 8.622378-22.654976 28.115338-13.592576 43.234687 6.106068 10.345626 17.222243 16.885576 29.420053 17.306154v0.062422a43.382043 43.382043 0 0 0 15.826454-4.373611c117.614721-62.727647 189.982936-183.996594 189.982935-318.198085s-72.368214-255.470439-189.982935-318.198086z" p-id="33363"></path><path d="M822.351885 517.591345c0-101.966323-60.489676-189.33109-146.55075-213.646891-18.563798-4.825912-37.190017 7.30129-41.862433 26.728758-4.799306 18.922978 6.479575 38.189787 25.572421 43.681871 55.879682 16.953114 95.343485 75.237565 95.343486 145.649218 0 70.349231-39.46278 131.046638-95.343486 145.586796-19.092847 5.493108-30.371728 24.758893-25.572421 43.681872 2.336208 17.015535 16.290011 26.728758 32.581046 26.728758v0.061398c2.336208 0 6.945179 0 9.344832-4.825912 85.998653-21.839401 146.487306-111.678522 146.487305-213.645868z" p-id="33364"></path></svg>',
        audioPauseSvg: '<svg t="1596624838920" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="33507" width="24" height="24"><path d="M225.680461 326.598406c-0.419556-0.019443-0.818645-0.019443-1.237177-0.019443L101.812315 326.578963c-22.753213 0-40.876989 18.24248-40.876989 40.777729l0 286.336424c0 22.534226 18.302855 40.777729 40.876989 40.777729l122.629945 0c0.079818 0 0.119727 0 0.198521 0l0 0.157589 300.289204 194.444551c7.125281 6.108115 16.405645 9.781784 26.526143 9.781784 22.573111 0 40.874943-18.301831 40.874943-40.878013 0-1.87572-0.119727-3.711532-0.360204-5.509481L591.970868 168.58151c0.239454-1.795902 0.360204-3.632737 0.360204-5.509481 0-22.574135-18.302855-40.876989-40.874943-40.876989-9.301853 0-17.884322 3.113921-24.750707 8.343015L225.680461 326.598406zM859.567485 510.524392l91.952248-91.951225c11.495822-11.517311 11.576663-30.558993-0.13917-42.274826-11.795651-11.795651-30.636764-11.755742-42.273802-0.140193l-91.953272 91.953272-91.950202-91.953272c-11.639085-11.616572-30.479175-11.655458-42.275849 0.140193-11.715833 11.715833-11.633968 30.757514-0.13917 42.274826l91.952248 91.951225-91.952248 91.953272c-11.494799 11.515265-11.576663 30.556946 0.13917 42.272779 11.796674 11.796674 30.636764 11.756765 42.275849 0.140193l91.950202-91.951225 91.953272 91.951225c11.636015 11.617595 30.477129 11.657504 42.273802-0.140193 11.715833-11.714809 11.634991-30.757514 0.13917-42.272779L859.567485 510.524392z" p-id="33508"></path></svg>'
      },
      startGyro: function (e) {
        function t(t) {
          e(t)
        }
        window.addEventListener("deviceorientation", t, !1)
      },
      stereoEffect: function (e) {
        this.separation = 1, this.focalLength = 15;
        var t, i, o, n, r, a, s, c, l, d, u, h, m = new THREE.Vector3,
          v = new THREE.Quaternion,
          p = new THREE.Vector3,
          f = new THREE.PerspectiveCamera,
          g = new THREE.PerspectiveCamera;
        return e.autoClear = !1, this.setSize = function (o, n) {
          t = o / 2, i = n, e.setSize(o, n)
        }, this.render = function (E, y) {
          E.updateMatrixWorld(), void 0 === y.parent && y.updateMatrixWorld(), y.matrixWorld.decompose(m, v, p), o = THREE.Math.radToDeg(2 * Math.atan(Math.tan(.5 * THREE.Math.degToRad(y.fov)))), c = y.near / this.focalLength, d = Math.tan(.5 * THREE.Math.degToRad(o)) * this.focalLength, l = .5 * d * y.aspect, a = d * c, s = -a, u = (l + this.separation / 2) / (2 * l), h = 1 - u, n = 2 * l * c * h, r = 2 * l * c * u, f.projectionMatrix.makePerspective(-n, r, a, s, y.near, y.far), f.position.copy(m), f.quaternion.copy(v), f.translateX(-this.separation / 2), g.projectionMatrix.makePerspective(-r, n, a, s, y.near, y.far), g.position.copy(m), g.quaternion.copy(v), g.translateX(this.separation / 2), e.setViewport(0, 0, 2 * t, i), e.setViewport(0, 0, t, i), e.render(E, f), e.setViewport(t, 0, t, i), e.render(E, g)
        }, this
      },
      orbitControls: function (e, t) {
        var i = function (e, t) {
          function i() {
            return 2 * Math.PI / 60 / 60 * g.autoRotateSpeed
          }

          function n(e) {
            g.defaultDirectionOfRotation ? g.usingGyro ? w.theta -= e : w.theta += e : w.theta -= e
          }

          function r(e) {
            g.defaultDirectionOfRotation ? g.usingGyro ? w.phi -= e : w.phi += e : w.phi -= e
          }

          function a(e, t, i, o) {
            var n, r, a, s = e * t + i * o;
            if (s > .499) {
              a = 2 * Math.atan2(e, o), n = Math.PI / 2, r = 0;
              var c = new THREE.Vector3(n, r, a);
              return c
            }
            if (s < -.499) {
              a = -2 * Math.atan2(e, o), n = -Math.PI / 2, r = 0;
              var c = new THREE.Vector3(n, r, a);
              return c
            }
            var l = e * e,
              d = t * t,
              u = i * i;
            a = Math.atan2(2 * t * o - 2 * e * i, 1 - 2 * d - 2 * u), n = Math.asin(2 * s), r = Math.atan2(2 * e * o - 2 * t * i, 1 - 2 * l - 2 * u);
            var c = new THREE.Vector3(n, r, a);
            return c
          }

          function s(e, t) {
            return 2 * Math.PI * e / t * g.rotateSpeed
          }

          function c(e, t) {
            return 2 * Math.PI * e / t * g.rotateSpeed
          }

          function l(e) {
            _ = !0;
            var t = e.clientX || e.changedTouches[0].clientX,
              i = e.clientY || e.changedTouches[0].clientY;
            b.set(t, i)
          }

          function d(e) {
            var t = e.clientX || e.changedTouches[0].clientX,
              i = e.clientY || e.changedTouches[0].clientY;
            x.set(t, i), R.subVectors(x, b);
            var o = void 0 !== g.domElement.clientWidth ? g.domElement.clientWidth : window.innerWidth;
            n(s(R.x, o));
            var a = void 0 !== g.domElement.clientHeight ? g.domElement.clientHeight : window.innerHeight;
            r(c(R.y, a)), b.copy(x)
          }

          function u(e) {
            _ = !1
          }

          function h(e) {
            _ = !0, b.set(e.touches[0].pageX, e.touches[0].pageY), g.usingGyro = !1
          }

          function m(e) {
            e.preventDefault(), x.set(e.touches[0].pageX, e.touches[0].pageY), R.subVectors(x, b);
            var t = void 0 != g.domElement.clientWidth ? g.domElement.clientWidth : window.innerWidth;
            n(s(R.x, t));
            var i = void 0 !== g.domElement.clientHeight ? g.domElement.clientHeight : window.innerHeight;
            r(c(R.y, i)), b.copy(x), H.x += s(R.x, t) + c(R.y, i), g.usingGyro = !1
          }

          function v(e) {
            g.usingGyro = !!o.OS.isMobile(), _ = !1
          }

          function p(e) {
            g.deviceOrientation = e, void 0 === g.beginAlpha && (g.beginAlpha = g.deviceOrientation.alpha)
          }

          function f(e) {
            g.screenOrientation = window.orientation || 0
          }
          this.domElement = void 0 !== t ? t : document, this.object = e, this.object.rotation.reorder("YXZ"), this.enable = !0, this.target = new THREE.Vector3, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -(1 / 0), this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = .05, this.rotateSpeed = .25, this.autoRotate = !1, this.autoRotateSpeed = 1, this.deviceOrientation = {}, this.screenOrientation = 0;
          var g = this;
          g.defaultDirectionOfRotation = !0, g.gyroEnable = !1, g.usingGyro = !!o.OS.isMobile(), g._defaultTargetY = g.target.y, g._defaultCameraFov = g.object.fov, g._defaultCameraY = g.object.position.y;
          var E = {
              type: "change"
            },
            y = 1e-6,
            T = new THREE.Spherical,
            w = new THREE.Spherical,
            b = new THREE.Vector2,
            x = new THREE.Vector2,
            R = new THREE.Vector2,
            H = new THREE.Vector3(0, 0, 0),
            L = 0,
            S = 0,
            C = 0,
            M = 0,
            P = 0;
          this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.rotation0 = this.object.rotation.clone(), this.zoom0 = this.object.zoom, this.arrowLeft = 37, this.arrowUp = 38, this.arrowRight = 39, this.arrowDown = 40, this.arrowSpeed = .05, this.getPolarAngle = function () {
            return T.phi
          }, this.getAzimuthalAngle = function () {
            return T.theta
          }, this.saveState = function () {
            g.target0.copy(g.target), g.position0.copy(g.object.position), g.rotation0.copy(g.object.rotation), g.zoom0 = g.object.zoom
          }, this.reset = function (e) {
            this.resetVar(), g.dispatchEvent(E), e && e.target0 ? g.target.copy(e.target0) : g.target.copy(g.target0), e && e.position0 ? g.object.position.copy(e.position0) : g.object.position.copy(g.position0), e && e.rotation0 ? g.object.rotation.copy(e.rotation0) : g.object.rotation.copy(g.rotation0), e && e.zoom0 ? g.zoom = zoom0 : g.zoom0
          }, this.resetVar = function () {
            C = 0, M = 0, P = 0, L = 0, S = 0
          };
          var A = function () {
            var e = new THREE.Vector3(0, 0, 1),
              t = new THREE.Euler,
              i = new THREE.Quaternion,
              o = new THREE.Quaternion((-Math.sqrt(.5)), 0, 0, Math.sqrt(.5));
            return function (n, r, a, s, c) {
              t.set(a, r, -s, "YXZ"), n.setFromEuler(t), n.multiply(o), n.multiply(i.setFromAxisAngle(e, -c))
            }
          }();
          this.update = function () {
            var t = new THREE.Vector3,
              o = (new THREE.Quaternion).setFromUnitVectors(e.up, new THREE.Vector3(0, 1, 0)),
              r = o.clone().inverse(),
              s = new THREE.Vector3,
              c = new THREE.Quaternion;
            return function (e) {
              if (g.enable) {
                e = e || {};
                var l = g.deviceOrientation.alpha ? THREE.Math.degToRad(void 0 === g.beginAlpha ? g.deviceOrientation.alpha : g.deviceOrientation.alpha - g.beginAlpha) : 0,
                  d = g.deviceOrientation.beta ? THREE.Math.degToRad(g.deviceOrientation.beta) : 0,
                  u = g.deviceOrientation.gamma ? THREE.Math.degToRad(g.deviceOrientation.gamma) : 0,
                  h = g.screenOrientation ? THREE.Math.degToRad(g.screenOrientation) : 0;
                g.gyroEnable ? (C = l, M = d, P = u) : (l = C, d = M, u = P);
                var m = (new THREE.Quaternion).copy(g.object.quaternion);
                A(m, l, d, u, h);
                var v = a(m.x, m.y, m.z, m.w);
                e.init || n(L - v.z), S = v.y, L = v.z;
                var p = g.object.position;
                return t.copy(p).sub(g.target), t.applyQuaternion(o), T.setFromVector3(t), g.autoRotate && n(i()), T.theta += w.theta, T.phi += w.phi, T.theta = Math.max(g.minAzimuthAngle, Math.min(g.maxAzimuthAngle, T.theta)), T.phi = Math.max(g.minPolarAngle, Math.min(g.maxPolarAngle, T.phi)), T.makeSafe(), t.setFromSpherical(T), t.applyQuaternion(r), p.copy(g.target).add(t), g.deviceOrientation && g.gyroEnable ? A(g.object.quaternion, l + Math.PI + H.x, d + H.y, u + H.z, h) : g.object.lookAt(g.target), g.enableDamping && !g.gyroEnable ? (w.theta *= 1 - g.dampingFactor, w.phi *= 1 - g.dampingFactor) : w.set(0, 0, 0), (s.distanceToSquared(g.object.position) > y || 8 * (1 - c.dot(g.object.quaternion)) > y) && (g.dispatchEvent(E), s.copy(g.object.position), c.copy(g.object.quaternion), !0)
              }
            }
          }();
          var _ = !1,
            B = null;
          "undefined" != typeof DeviceMotionEvent && (B = DeviceMotionEvent), "undefined" != typeof DeviceOrientationEvent && (B = DeviceOrientationEvent), window.addEventListener("orientationchange", f, !1), window.addEventListener("deviceorientation", p, !1), B && "function" == typeof B.requestPermission && window.addEventListener("click", function () {
            B.requestPermission().then(function (e) {
              "granted" === e && (window.addEventListener("devicemotion", f, !1), window.addEventListener("deviceorientation", p, !1))
            })["catch"](function (e) {
              o.msgBox(e, 3, document.body)
            })
          }), this.gyroFreeze = function () {
            g.gyroEnable = !1
          }, this.gyroUnfreeze = function () {
            g.gyroEnable = !0
          }, this.rotationLeft = n, this.rotationUp = r;
          var I = 0,
            k = 0;
          document.addEventListener("keydown", function (e) {
            var t = e || window.event || arguments.callee.caller.arguments[0];
            t && (t.keyCode == g.arrowLeft && (k = 1), t.keyCode == g.arrowRight && (k = -1), t.keyCode == g.arrowUp && (I = 1), t.keyCode == g.arrowDown && (I = -1), n(k * g.arrowSpeed), r(I * g.arrowSpeed))
          }), document.addEventListener("keyup", function (e) {
            var t = e || window.event || arguments.callee.caller.arguments[0];
            t && (t.keyCode == g.arrowLeft && (k = 0), t.keyCode == g.arrowRight && (k = 0), t.keyCode == g.arrowUp && (I = 0), t.keyCode == g.arrowDown && (I = 0))
          }), this.domElement.addEventListener("mousedown", l, !1), this.domElement.addEventListener("mousemove", function (e) {
            g.enable && _ && d(e)
          }, !1), this.domElement.addEventListener("mouseup", u, !1), this.domElement.addEventListener("mouseleave", u, !1), this.domElement.addEventListener("touchstart", h, !1), this.domElement.addEventListener("touchend", v, !1), this.domElement.addEventListener("touchmove", m, !1);
          var V = void 0 !== this.domElement.clientWidth ? this.domElement.clientWidth : window.innerWidth,
            F = void 0 !== this.domElement.clientHeight ? this.domElement.clientHeight : window.innerHeight;
          return b.set(V / 2, F / 2), setTimeout(function () {
            g.update({
              init: !0
            }), g.saveState()
          }, 10), this
        };
        return i.prototype = Object.create(THREE.EventDispatcher.prototype), i.prototype.constructor = i, new i(e, t)
      },
      setCameraPara: function (e, t, i) {
        if (e.cameraPara = {
            fov: 90,
            aspect: e.container.innerWidth / e.container.innerHeight,
            near: .001,
            far: 1e3
          }, e.cameraPosition = {
            x: 0,
            y: 0,
            z: 0
          }, t)
          for (var o in t) e.cameraPara[o] = t[o];
        if (i)
          for (var o in i) e.cameraPosition[o] = i[o]
      },
      formatSeconds: function (e) {
        var t = parseInt(e);
        if (!t) return "00:00";
        var i = 0,
          o = 0;
        t > 60 && (i = parseInt(t / 60), t = parseInt(t % 60), i > 60 && (o = parseInt(i / 60), i = parseInt(i % 60)));
        var n = "" + (parseInt(t) < 10 ? "0" + parseInt(t) : parseInt(t));
        return n = i >= 0 && o > 0 ? (parseInt(o) < 10 ? "0" + parseInt(o) : parseInt(o)) + ":" + (parseInt(i) < 10 ? "0" + parseInt(i) : parseInt(i)) + ":" + n : i > 0 && 0 == o ? 60 == i ? "01:00:" + n : (parseInt(i) < 10 ? "0" + parseInt(i) : parseInt(i)) + ":" + n : 60 == t ? "01:00" : "00:" + n
      },
      cameraVector: function (e, t) {
        var i = new THREE.Vector3(0, 0, (-1)),
          o = i.applyQuaternion(e.quaternion),
          n = o.clone(),
          r = new THREE.Vector3;
        return t && (r.x = o.x * t, r.y = o.y * t, r.z = o.z * t), {
          vector: n,
          timesVector: r
        }
      },
      bindRaycaster: function (e, t, i) {
        var n = o.screenPosTo3DCoordinate(e, t.container, t.camera),
          r = new THREE.Raycaster(t.camera.position, n.sub(t.camera.position).normalize()),
          a = r.intersectObjects(t.scene.children, !0);
        a.length ? i.success(a) : i.empty()
      },
      bindCameraEvent: function (e, t) {
        t = t || {
          trigger: function (e) {},
          empty: function (e) {},
          move: function (e) {}
        };
        var i = this,
          o = t.scale || .022,
          n = t.vectorRadius,
          r = n * o,
          a = n * (o / 6),
          s = 2,
          c = t.tubularSegments || 60,
          l = t.speed || 36,
          d = new THREE.Group;
        d.name = "__controlHandle";
        for (var u = new THREE.TorusGeometry(r, a, s, c, 2 * Math.PI), h = [], m = 0; m < u.faces.length / 2; m++) h[m] = new THREE.MeshBasicMaterial({
          color: 15194842,
          depthTest: !1
        });
        for (var v = 0, p = [new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 1), new THREE.Vector2(0, 1)], m = 0, f = u.faces.length; m < f; m += 2) u.faces[m].materialIndex = v, u.faces[m + 1].materialIndex = v, u.faceVertexUvs[0][m] = [p[3], p[0], p[2]], u.faceVertexUvs[0][m + 1] = [p[0], p[1], p[2]], v++;
        var g = new THREE.Mesh(u, h);
        g.name = "__wait", g.visible = !1, d.add(g);
        var E = new THREE.Mesh(new THREE.CircleGeometry(a, 4), new THREE.MeshBasicMaterial({
          color: 15194842,
          wireframe: !0,
          depthTest: !1
        }));
        E.lookAt(e.camera.position), E.name = "__focus", E.material.depthTest = !1, E.visible = !1, d.add(E), d.position.set(0, 0, .1);
        var y = (new THREE.Vector3, function () {
            d.lookAt(0, 0, 0), g.lookAt(0, 0, 0);
            var o = i.cameraVector(e.camera, n);
            E.visible = !0, d.position.set(o.timesVector.x, o.timesVector.y, o.timesVector.z);
            var r = new THREE.Raycaster(e.camera.position, o.vector),
              a = r.intersectObjects(e.scene.children, !0);
            a.length ? t.move(a) : t.empty(a)
          }),
          T = null,
          w = function (e) {
            g.visible = !0;
            var i = 0,
              o = 0;
            T || (T = setInterval(function () {
              o < u.faces.length / 4 ? (h[o].color = new THREE.Color(14710133), u.needsUpdate = !0, u.faces[i].materialIndex = o, u.faces[i + 1].materialIndex = o, u.faceVertexUvs[0][i] = [p[3], p[0], p[2]], u.faceVertexUvs[0][i + 1] = [p[0], p[1], p[2]], i += 2) : (clearInterval(T), T = null, t.trigger(e)), o++
            }, l))
          },
          b = function (e) {
            clearInterval(T), T = null, v = 0;
            for (var t = 0, i = u.faces.length; t < i; t += 2) h[v].color = new THREE.Color(15194842), u.needsUpdate = !0, u.faces[t].materialIndex = v, u.faces[t + 1].materialIndex = v, u.faceVertexUvs[0][t] = [p[3], p[0], p[2]], u.faceVertexUvs[0][t + 1] = [p[0], p[1], p[2]], v++;
            g.visible = !1
          };
        e.VRObject.add(d), e.cameraEvt.controlGroup = d, e.cameraEvt.updatePosition = y, e.cameraEvt.hover = w, e.cameraEvt.leave = b
      },
      screenPosTo3DCoordinate: function (e, t, i) {
        var n = e.clientX || (e.touches ? e.touches[0].clientX : 0),
          r = e.clientY || (e.touches ? e.touches[0].clientY : 0);
        rect = o.getBoundingClientRect(t), x = n - rect.left, y = r - rect.top;
        var a = t.clientWidth,
          s = t.clientHeight,
          c = new THREE.Vector2;
        c.x = 2 * x / a - 1, c.y = 1 - 2 * y / s;
        var l = new THREE.Vector3(c.x, c.y, 0).unproject(i);
        return l.sub(i.position).normalize()
      },
      objectPosToScreenPos: function (e, t, i) {
        var o = new THREE.Vector3;
        o.setFromMatrixPosition(e.matrixWorld).project(i);
        var n = o.x,
          r = o.y,
          a = t.clientWidth,
          s = t.clientHeight,
          c = new THREE.Vector2;
        return c.x = a / 2 * (n + 1), c.y = s / 2 * (1 - r), c
      },
      fullscreen: function (e) {
        var t = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen || !1;
        t ? document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen ? document.webkitExitFullscreen() : "" : e.requestFullscreen && e.requestFullscreen() || e.mozRequestFullScreen && e.mozRequestFullScreen() || e.webkitRequestFullscreen && e.webkitRequestFullscreen() || e.msRequestFullscreen && e.msRequestFullscreen()
      },
      isFullscreen: function () {
        return document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || !1
      },
      toolBar: function (e) {
        function t(e) {
          for (var t = e.match(/&#(\d+);/g), i = "", o = 0; o < t.length; o++) i += String.fromCharCode(t[o].replace(/[&#;]/g, ""));
          return i
        }
        var i = "_toolBar",
          n = this.createTag("div", {
            style: "-moz-user-select:none;-webkit-user-select:none;user-select:none;position:absolute;background:rgba(0,0,0,.2);width:100%;height:2.2rem;bottom:0rem",
            "class": i + "Area"
          }),
          r = this.createTag("div", {
            style: "position:inherit;left:1rem;color:#fff;cursor:pointer;bottom:0rem;line-height:100%;",
            "class": i + "Btn"
          }, {
            innerHTML: o.playerIcon.playSvg
          });
        n.appendChild(r);
        var a = this.createTag("div", {
            style: "position:inherit;bottom:0.5rem;left:2.8rem;color:#fff;font-size:0.75rem"
          }),
          s = this.createTag("span", null, {
            innerText: "00:00"
          });
        a.appendChild(s);
        var c = this.createTag("span", null, {
          innerText: "/"
        });
        a.appendChild(c);
        var l = this.createTag("span", null, {
          innerText: "00:00"
        });
        a.appendChild(l), n.appendChild(a);
        var u = this.createTag("span", {
            style: "width:2.2rem;height:2.2rem;position:inherit;left:50%;margin-left:-1.1rem;margin-top:-0.75rem;color:#fff;font-size:1.5rem;cursor:pointer;margin-top:1rem;border:0.0625rem dotted #ccc;height:0.0625rem;"
          }, {
            innerHTML: ""
          }),
          h = this.createTag("div", {
            style: "width:100%;height:auto;position:inherit;background:rgba(0,0,0,0);top:2.4rem;bottom:1.8rem;overflow: hidden;"
          }, null),
          m = this.createTag("ul", {
            style: "display:flex;display: -webkit-flex;display: -webkit-box;display: -moz-box;display: -ms-flexbox;margin:0;padding:0;list-style:none;height:100%;"
          }, null);
        h.appendChild(m), n.appendChild(u), n.appendChild(h);
        var v = this.createTag("div", {
          style: "width:2.2rem;height:2.2rem;position:inherit;right:1rem;margin-left:-1.1rem;margin-top:0.6rem;color:#fff;font-size:1.2rem;cursor:pointer;display:none",
          copy: "&#67;&#111;&#112;&#121;&#114;&#105;&#103;&#104;&#116;&#32;&#169;&#32;&#50;&#48;&#49;&#56;&#32;&#87;&#87;&#87;&#46;&#77;&#88;&#82;&#69;&#65;&#76;&#73;&#84;&#89;&#46;&#67;&#78;&#46;&#32;&#65;&#108;&#108;&#32;&#114;&#105;&#103;&#104;&#116;&#115;&#32;&#114;&#101;&#115;&#101;&#114;&#118;&#101;&#100;&#46;"
        }, {
          innerText: "？"
        });
        v.addEventListener("click", function () {
          var e = this.getAttribute("copy");
          alert(t(e))
        }, !1), v.addEventListener("mouseover", function () {
          var e = this.getAttribute("copy");
          this.setAttribute("title", t(e))
        }, !1), n.appendChild(v);
        var p = this.createTag("div", {
          style: "position:inherit;right:5.8rem;cursor:pointer;bottom:0.2rem;line-height:100%"
        }, {
          innerHTML: o.playerIcon.resetLookAtSvg
        });
        n.appendChild(p);
        var f = this.createTag("div", {
          style: "position:inherit;right:3.5rem;cursor:pointer;bottom:0.1rem;line-height:100%"
        }, {
          innerHTML: o.playerIcon.gyroSvg
        });
        n.appendChild(f);
        var g = this.createTag("div", {
          style: "position:inherit;right:1rem;cursor:pointer;bottom:0.1rem;line-height:100%"
        }, {
          innerHTML: o.playerIcon.vrSvg
        });
        n.appendChild(g);
        var E = this.createTag("div", {
            style: "position:inherit;top:0rem;width:100%;height:0.5rem;background:rgba(255,255,255,.3);cursor:pointer"
          }),
          y = this.createTag("div", {
            style: "position:inherit;width:0%;height:0.5rem;background:rgba(255,255,255,.3)"
          });
        E.appendChild(y);
        var T = this.createTag("div", {
          style: "position:inherit;width:0%;height:0.5rem;background:rgba(28, 175, 252,.6)"
        });
        E.appendChild(T), n.appendChild(E), e.appendChild(n);
        var w = this.createTag("div", {
            style: "-moz-user-select:none;-webkit-user-select:none;user-select:none;position:absolute;width:2rem;height:60%;background:rgba(0,0,0,0);left:0rem;top:20%;text-align:center;display:none;border-radius:1rem;"
          }),
          b = this.createTag("div", {
            style: "position:inherit;width:0.25rem;background:rgba(255,255,255,.1);height:100%;left:0.875rem;cursor:pointer;border-radius:1rem;"
          });
        w.appendChild(b);
        var x = this.createTag("div", {
          style: "position:inherit;width:100%;background:rgba(255, 255, 255,.6);bottom:0rem;;border-radius:1rem;"
        });
        return b.appendChild(x), e.appendChild(w), {
          toolbar: n,
          btn: r,
          timeInfo: a,
          curTime: s,
          splitTime: c,
          totalTime: l,
          moreBtn: u,
          moreList: h,
          moreListUl: m,
          vrBtn: g,
          progressBar: E,
          loadedProgress: y,
          playProgress: T,
          gyroResetBtn: p,
          gyroBtn: f,
          voice_bar: w,
          about: v
        }
      },
      msgBox: function (e, t, i) {
        if (e) {
          var o = this.createTag("div", {
            style: "position:absolute;bottom:50%;width:100%;padding:0.25rem;background:rgba(0,0,0,.6);color:#fff;text-align:center;"
          }, {
            innerHTML: e
          });
          i.appendChild(o), setTimeout(function () {
            o.remove()
          }, 1e3 * t)
        }
      },
      isMobileDevice: function (e) {
        var t = navigator.userAgent.toLowerCase();
        if (e) return t.match(/ipad/i) || t.match(/iphone os/i) || t.match(/midp/i) || t.match(/rv:1.2.3.4/i) || t.match(/ucweb/i) || t.match(/android/i) || t.match(/windows ce/i) || t.match(/windows mobile/i);
        var i = "ipad" == t.match(/ipad/i),
          o = "iphone os" == t.match(/iphone os/i),
          n = "midp" == t.match(/midp/i),
          r = "rv:1.2.3.4" == t.match(/rv:1.2.3.4/i),
          a = "ucweb" == t.match(/ucweb/i),
          s = "android" == t.match(/android/i),
          c = "windows ce" == t.match(/windows ce/i),
          l = "windows mobile" == t.match(/windows mobile/i);
        return !!(i || o || n || r || a || s || c || l)
      },
      bindOrientationEvent: function (e) {
        void 0 === e.controls && (e.controls = o.orbitControls(e.camera, e.renderer.domElement), e.controls.target = e._controlTarget.clone())
      },
      isCrossScreen: function (e) {
        return 180 != window.orientation && 0 != window.orientation && (90 == window.orientation || window.orientation == -90 || void 0)
      },
      initDomStyle: function (e) {
        function t(e) {
          e.preventDefault()
        }
        document.body.style.overflow = "hidden", document.body.style.margin = 0, document.body.style.padding = 0, e.style.position = "absolute", e.style.width = "100%", e.style.height = "100%", e.style.left = "0px", e.style.top = "0px", e.style.overflow = "hidden";
        var i = document.createElement("style");
        document.getElementsByTagName("head")[0].appendChild(i), document.body.addEventListener("touchmove", t), document.oncontextmenu = function () {
          return !1
        }, document.onkeydown = function () {
          if (!this.debug && window.event && 123 == window.event.keyCode) return event.keyCode = 0, event.returnValue = !1, !1
        }
      },
      createTag: function (e, t, i) {
        var o = document.createElement(e);
        if (t && "object" == typeof t)
          for (var n in t) o.setAttribute(n, t[n]);
        if (i && "object" == typeof i)
          for (var n in i) o[n] = i[n];
        return o
      },
      OS: {
        weixin: navigator.userAgent.indexOf("MicroMessenger") > -1,
        android: /android/i.test(navigator.userAgent.toLowerCase()),
        ios: /(iphone|ipad|ipod|ios)/i.test(navigator.userAgent.toLowerCase()),
        googlePixel: navigator.userAgent.match(/;\sPixel\sBuild\//),
        MiOS: navigator.userAgent.match(/;\sMI\s\d\sBuild\//),
        samsungOS: navigator.userAgent.match(/;\sSM\-\w+\sBuild\//),
        isGooglePixel: function () {
          return null != this.googlePixel
        },
        isMiOS: function () {
          return null != this.MiOS
        },
        isSamsung: function () {
          return null != this.samsungOS
        },
        isMobile: function () {
          return this.android || this.ios
        },
        isAndroid: function () {
          return this.android
        },
        isiOS: function () {
          return this.ios
        },
        isWeixin: function () {
          return this.weixin
        }
      },
      Broswer: {
        win: window,
        nav: window.navigator,
        REG_APPLE: /^Apple/,
        ie: navigator.userAgent.match(/MSIE\s([\d.]+)/) || navigator.userAgent.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
        edge: navigator.userAgent.match(/Edge\/([\d.]+)/),
        chrome: navigator.userAgent.match(/Chrome\/([\d.]+)/) || navigator.userAgent.match(/CriOS\/([\d.]+)/),
        webview: !this.chrome && navigator.userAgent.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
        safari: this.webview || navigator.userAgent.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/),
        chromiumType: null,
        _getChromiumType: function () {
          if (null != this.chromiumType) return this.chromiumType;
          var e = this.win;
          return this.isIE() || void 0 === e.scrollMaxX || this.REG_APPLE.test(this.nav.vendor || "") ? "" : this._testExternal(/^sogou/i, 0) ? "sogou" : this._testExternal(/^liebao/i, 0) ? "liebao" : this.nav.mimeTypes[30] || !this.nav.mimeTypes.length ? "360" : e.clientInformation && e.clientInformation.permissions ? "chrome" : ""
        },
        _testExternal: function (e, t) {
          var i = this.win.external || {};
          for (var o in i)
            if (e.test(t ? i[o] : o)) return !0;
          return !1
        },
        isIE: function () {
          return null != this.ie
        },
        ieVersion: function () {
          return null != this.ie && parseInt(this.ie[1])
        },
        isEdge: function () {
          return null != this.edge
        },
        isSafari: function () {
          return null != this.safari
        },
        is360: function () {
          return this.chromiumType = this._getChromiumType(), "360" === this.chromiumType
        },
        isSogou: function () {
          return this.chromiumType = this._getChromiumType(), "sogou" === this.chromiumType
        },
        isChromium: function () {
          return "chrome" === this._getChromiumType()
        },
        webglAvailable: function () {
          try {
            var e = document.createElement("canvas");
            return !(!window.WebGLRenderingContext || !e.getContext("webgl") && !e.getContext("experimental-webgl"))
          } catch (t) {
            return !1
          }
        }
      },
      getBoundingClientRect: function (e) {
        var t = e.getBoundingClientRect(),
          i = t.top - document.documentElement.clientTop + document.documentElement.scrollTop,
          o = t.bottom,
          n = t.left - document.documentElement.clientLeft + document.documentElement.scrollLeft,
          r = t.right,
          a = t.width || r - n,
          s = t.height || o - i;
        return {
          top: i,
          right: r,
          bottom: o,
          left: n,
          width: a,
          height: s
        }
      }
    },
    n = document.getElementsByTagName("head")[0];
  n.appendChild(o.createTag("meta", {
    name: "viewport",
    content: "width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0,minimal-ui,user-scalable=no"
  })), n.appendChild(o.createTag("meta", {
    name: "google",
    content: "notranslate"
  })), n.appendChild(o.createTag("meta", {
    name: "full-screen",
    content: "yes"
  })), o.debug && (window.onerror = function (e, t, i) {
    var n = "There was an error on this page.\n\n";
    return n += "Error: " + e + "\n", n += "URL: " + t + "\n", n += "Line: " + i + "\n\n", o.msgBox(n, 36, document.body), !0
  }), e.VR = t, e.AR = i, e.AVR = o
});


(function () {
  'use strict';
  $('body').append(`<div id="vr-video" style='display:none;width:100vh;height:700px'></div>`)
  $('.video-title').append(`<button style='position: fixed;
top: 10px;
right: 10px;
height: 30px;
padding: 0 15px;
border: 1px solid #2777F8;
border-radius: 4px;
line-height: 30px;
text-align: center;
vertical-align: middle;
outline: 0;
background: #2777F8;color:#fff;' id="open-vr" data-vropen="0">开启VR模式</button>`);


  $('body').on('click', '#open-vr', function() {
    getVRUrl();
    let isOpened= $(this).data('vropen');
    if(isOpened){
      location.reload()
    }else{
      $('#open-vr').data('vropen',"1");
      $('#open-vr').text("退出VR模式");
    }

  });
  function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return decodeURIComponent(r[2]);
    };
    return null;
  };
  function getVRUrl() {
    $.ajax({
      url: `https://115vod.com/site/api/video/m3u8/${getQueryString('pickcode')}.m3u8`,
      success: (data) => {
        const parser = new m3u8Parser.Parser();
        parser.push(data);
        parser.end();
        let playlists = parser.manifest.playlists;
        if (Array.isArray(playlists) && playlists.length > 0) {
          playlists.sort((a, b) => {
            if (a.attributes.BANDWIDTH < b.attributes.BANDWIDTH) {
              return -1
            } else if (a.attributes.BANDWIDTH > b.attributes.BANDWIDTH) {
              return 1
            } else if (a.attributes.BANDWIDTH == b.attributes.BANDWIDTH) {
              return 0
            }
          });
            console.log(playlists)
          $("#js-video")[0] && $("#js-video").trigger('pause');
          init(playlists[playlists.length - 1].uri.replace('http://', 'https://'))
        }
      }
    })
  }


  function init(videoUrl) {

    var scene, renderer;
    var container;
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    container = document.querySelector('#vr-video');
    container.appendChild(renderer.domElement);
    $("#js-wrap").hide()
    $("#vr-video").show()
    scene = new THREE.Scene();

    // fov 选项可调整初始视频远近
    var vr = new VR(scene, renderer, container, {
      "fov": 100
    });
    vr.vrbox.radius = 300;
    if (AVR.isCrossScreen()) {
      // 调整vr视窗偏移量
      vr.effect.separation = 1.5
    }

    //AVR.useGyroscope=false;
    vr.init(function () {

    });

    vr.play(videoUrl,
      vr.resType.sliceVideo, {
        'muted': false,
        'autoplay': true
      });
vr.video.currentTime = document.querySelector('#js-video').currentTime;
    vr.video.crossOrigin = "Anonymous";
    vr.video.onended = function () {}
  }

})();
