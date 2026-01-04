// ==UserScript==
// @name         MESSAGE_PLAYBACK_RATE
// @namespace    MPLRATEVK
// @version      0.1
// @description  MESSAGE PLAYBACK RATE CHANGE
// @author       You
// @match        https://vk.com/im*
// @match        https://vk.com/im
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385123/MESSAGE_PLAYBACK_RATE.user.js
// @updateURL https://update.greasyfork.org/scripts/385123/MESSAGE_PLAYBACK_RATE.meta.js
// ==/UserScript==

setTimeout(function(){
//------------------------ EXISTS VK EDITED CODE
    !function (t) {
  var e = {
  };
  function i(o) {
    if (e[o]) return e[o].exports;
    var n = e[o] = {
      i: o,
      l: !1,
      exports: {
      }
    };
    return t[o].call(n.exports, n, n.exports, i),
    n.l = !0,
    n.exports
  }
  i.m = t,
  i.c = e,
  i.d = function (t, e, o) {
    i.o(t, e) || Object.defineProperty(t, e, {
      enumerable: !0,
      get: o
    })
  },
  i.r = function (t) {
    'undefined' != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
      value: 'Module'
    }),
    Object.defineProperty(t, '__esModule', {
      value: !0
    })
  },
  i.t = function (t, e) {
    if (1 & e && (t = i(t)), 8 & e) return t;
    if (4 & e && 'object' == typeof t && t && t.__esModule) return t;
    var o = Object.create(null);
    if (i.r(o), Object.defineProperty(o, 'default', {
      enumerable: !0,
      value: t
    }), 2 & e && 'string' != typeof t) for (var n in t) i.d(o, n, function (e) {
      return t[e]
    }.bind(null, n));
    return o
  },
  i.n = function (t) {
    var e = t && t.__esModule ? function () {
      return t.default
    }
    : function () {
      return t
    };
    return i.d(e, 'a', e),
    e
  },
  i.o = function (t, e) {
    return Object.prototype.hasOwnProperty.call(t, e)
  },
  i.p = '',
  i(i.s = 159)
}({
  159: function (t, e, i) {
    t.exports = i('3KRu')
  },
  '3KRu': function (t, e, i) {
    'use strict';
    i.r(e);
    var o = 'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator ? function (t) {
      return typeof t
    }
     : function (t) {
      return t && 'function' == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? 'symbol' : typeof t
    },
    n = function () {
      function t(t, e) {
        for (var i = 0; i < e.length; i++) {
          var o = e[i];
          o.enumerable = o.enumerable || !1,
          o.configurable = !0,
          'value' in o && (o.writable = !0),
          Object.defineProperty(t, o.key, o)
        }
      }
      return function (e, i, o) {
        return i && t(e.prototype, i),
        o && t(e, o),
        e
      }
    }();
    var a = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
    s = function () {
      function t(e) {
        !function (t, e) {
          if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function')
        }(this, t),
        this.opts = e || {
        },
        this._trackOptions = {
        },
        this._audioNodes = [
        ],
        this._currentAudioEl = this._createAudioNode(),
        this._prefetchAudioEl = this._createAudioNode()
      }
      return t.isSupported = function (t) {
        var e = document.createElement('audio');
        return !!e.canPlayType && (t = t || 'audio/mpeg; codecs="mp3"', !!e.canPlayType(t).replace(/no/, ''))
      },
      t.prototype.destroy = function () {
      },
      t.prototype.getPlayedTime = function () {
        for (var t = this._currentAudioEl.played, e = 0, i = 0; i < t.length; i++) e += t.end(i) - t.start(i);
        return e
      },
      t.prototype._setAudioNodeUrl = function (t, e) {
        window.data && data(t, 'setUrlTimesetUrlTime', e == a ? 0 : vkNow()),
        t.src = e
      },
      t.prototype._createAudioNode = function (t) {
        var e = new Audio,
        i = this;
        return this.opts.onBufferUpdate && addEvent(e, 'progress', function () {
          i._currentAudioEl == e && i.opts.onBufferUpdate(i.getCurrentBuffered());
          var t = e.buffered;
          t.length;
          1 == t.length && 0 == t.start(0) && t.end(0) == e.duration && (e._fullyLoaded = !0)
        }),
        addEvent(e, 'stalled', function () {
          i._currentAudioEl == e && i._isInvalidDuration() && i._currentAudioEl.currentTime >= i.duration - 1 && i._currentAudioEl.dispatchEvent(new Event('ended'))
        }),
        this.opts.onProgressUpdate && addEvent(e, 'timeupdate', function () {
          i._currentAudioEl == e && i.opts.onProgressUpdate(i.getCurrentProgress())
        }),
        this.opts.onEnd && addEvent(e, 'ended', function () {
          i._currentAudioEl == e && i.opts.onEnd()
        }),
        this.opts.onSeeked && addEvent(e, 'seeked', function () {
          i._currentAudioEl == e && i.opts.onSeeked()
        }),
        this.opts.onSeek && addEvent(e, 'seeking', function () {
          i._currentAudioEl == e && i.opts.onSeek()
        }),
        addEvent(e, 'error', function () {
          i._prefetchAudioEl == e ? i._prefetchAudioEl = i._createAudioNode()  : i._currentAudioEl == e && i.opts.onFail && i.opts.onFail()
        }),
        addEvent(e, 'canplay', function () {
          if (window.data) {
            var t = data(e, 'setUrlTime');
            t && (cur.audioLoadTimings = cur.audioLoadTimings || [
            ], cur.audioLoadTimings.push(vkNow() - t), data(e, 'setUrlTime', 0))
          }
          i._prefetchAudioEl,
          i._currentAudioEl == e && (i.opts.onCanPlay && i.opts.onCanPlay(), i._seekOnReady && (i.seek(i._seekOnReady), i._seekOnReady = !1))
        }),
        t && (this._setAudioNodeUrl(e, t), e.preload = 'auto', e.volume = this._volume || 1, e.load()),
        this._audioNodes.push(e),
        e
      },
      t.prototype.onReady = function (t) {
        t(!0)
      },
      t.prototype.prefetch = function (t) {
        this._prefetchAudioEl && this._setAudioNodeUrl(this._prefetchAudioEl, a),
        this._prefetchAudioEl = this._createAudioNode(t)
      },
      t.prototype.seek = function (t) {
        var e = this._currentAudioEl;
        this.duration ? e.currentTime = this.duration * t : this._seekOnReady = t
      },
      t.prototype.setVolume = function (t) {
        void 0 === t && (t = this._currentAudioEl.volume),
        this._currentAudioEl.volume = t,
        this._prefetchAudioEl && (this._prefetchAudioEl.volume = t),
        this._volume = t
      },
      t.prototype._isInvalidDuration = function () {
        var t = this._currentAudioEl;
        return isNaN(t.duration) || t.duration == 1 / 0 || 0 == t.duration
      },
      t.prototype.getCurrentProgress = function () {
        var t = this._currentAudioEl;
        return this.duration ? Math.max(0, Math.min(1, t.currentTime / this.duration))  : 0
      },
      t.prototype.getCurrentBuffered = function () {
        var t = this._currentAudioEl;
        return t && t.buffered.length ? Math.min(1, t.buffered.end(0) / t.duration)  : 0
      },
      t.prototype.isFullyLoaded = function () {
        return this._currentAudioEl._fullyLoaded
      },
      t.prototype.setUrl = function (e, i) {
        var n = this._currentAudioEl;
        if (this._seekOnReady = !1, this._trackOptions = {
        }, i && 'object' === (void 0 === i ? 'undefined' : o(i)) && (this._trackOptions = i, i = i.callback), n.src == e) return this.opts.onCanPlay && this.opts.onCanPlay(),
        i && i(!0);
        if (this._prefetchAudioEl && this._prefetchAudioEl.readyState > t.STATE_HAVE_NOTHING) if (this._prefetchAudioEl.src == e) {
          this._currentAudioEl.pause(0),
          this._setAudioNodeUrl(this._currentAudioEl, a);
          var s = this;
          this._prefetchAudioEl.readyState >= t.STATE_HAVE_FUTURE_DATA && setTimeout(function () {
            s.opts.onCanPlay && s.opts.onCanPlay()
          }),
          n = this._currentAudioEl = this._prefetchAudioEl,
          this._prefetchAudioEl = !1
        } else this._prefetchAudioEl.src && this._setAudioNodeUrl(this._prefetchAudioEl, a);
        return n.src != e && (this._setAudioNodeUrl(n, e), n.load()),
        i && i(!0)
      },
      t.prototype.play = function (e) {
        this._prefetchAudioEl.src == e && this._prefetchAudioEl.readyState > t.STATE_HAVE_NOTHING && (this._setAudioNodeUrl(this._currentAudioEl, a), this._currentAudioEl = this._prefetchAudioEl, this._prefetchAudioEl = this._createAudioNode(), this.opts.onCanPlay && this.opts.onCanPlay());
        var i = this._currentAudioEl;
        if (i.src) try {
          i.play()
        } catch (t) {
          debugLog('Audio: url set failed (html5 impl)')
        }
      },
      t.prototype.pause = function () {
        var t = this._currentAudioEl;
        t.src && t.pause()
      },
      t.prototype.stop = function () {
        var t = this._currentAudioEl;
        this._setAudioNodeUrl(t, a)
      },
      t.prototype._setFadeVolumeInterval = function (t) {
        if (t) {
          if (!this._fadeVolumeWorker && window.Worker && window.Blob) {
            var e = new Blob(['         var interval;         onmessage = function(e) {           clearInterval(interval);           if (e.data == \'start\') {             interval = setInterval(function() { postMessage({}); }, 20);           }         }       ']);
            try {
              this._fadeVolumeWorker = new Worker(window.URL.createObjectURL(e))
            } catch (t) {
              this._fadeVolumeWorker = !1
            }
          }
          this._fadeVolumeWorker ? (this._fadeVolumeWorker.onmessage = t, this._fadeVolumeWorker.postMessage('start'))  : this._fadeVolumeInterval = setInterval(t, 60)
        } else this._fadeVolumeWorker && (this._fadeVolumeWorker.terminate(), this._fadeVolumeWorker = null),
        this._fadeVolumeInterval && clearInterval(this._fadeVolumeInterval)
      },
      t.prototype.fadeVolume = function (t, e) {
        t = Math.max(0, Math.min(1, t));
        var i = this._currentAudioEl,
        o = 0;
        if (o = t < i.volume ? - 0.04 : 0.001, Math.abs(t - i.volume) <= 0.001) return this._setFadeVolumeInterval(),
        e && e();
        var n = i.volume;
        this._setFadeVolumeInterval(function () {
          o > 0 && (o *= 1.2),
          n += o;
          if (o < 0 ? n <= t : n >= t) return this.setVolume(t),
          this._setFadeVolumeInterval(),
          e && e();
          this.setVolume(n)
        }.bind(this))
      },
      n(t, [
        {
          key: 'type',
          get: function () {
            return 'html5'
          }
        },
        {
          key: 'loaded',
          get: function () {
            return !0
          }
        },
        {
          key: 'duration',
          get: function () {
            var t = this._currentAudioEl,
            e = isNaN(t.duration) || t.duration == 1 / 0 ? 0 : t.duration;
            return !e && this._trackOptions.duration && (e = parseInt(this._trackOptions.duration)),
            e
          }
        }
      ]),
      t
    }();
    s.STATE_HAVE_NOTHING = 0,
    s.STATE_HAVE_FUTURE_DATA = 3,
    s.HAVE_ENOUGH_DATA = 4,
    s.AUDIO_EL_ID = 'ap_audio';
    var r = 'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator ? function (t) {
      return typeof t
    }
     : function (t) {
      return t && 'function' == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? 'symbol' : typeof t
    },
    u = function () {
      function t(t, e) {
        for (var i = 0; i < e.length; i++) {
          var o = e[i];
          o.enumerable = o.enumerable || !1,
          o.configurable = !0,
          'value' in o && (o.writable = !0),
          Object.defineProperty(t, o.key, o)
        }
      }
      return function (e, i, o) {
        return i && t(e.prototype, i),
        o && t(e, o),
        e
      }
    }();
    var l = function () {
      function t(e) {
        !function (t, e) {
          if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function')
        }(this, t),
        this.opts = e || {
        },
        window._flashVoiceInstance = this
      }
      return t.prototype.fadeVolume = function (t, e) {
        return this.setVolume(t),
        e()
      },
      t.prototype.destroy = function () {
        re(t.PLAYER_EL_ID)
      },
      t.prototype.onReady = function (e) {
        if (this._player) return e(!0);
        if (!1 === this._player) return e(!1);
        this._onReady = e;
        ge(t.PLAYER_EL_ID) || document.body.appendChild(ce('div', {
          id: t.PLAYER_EL_ID,
          className: 'fixed'
        }));
        var i = this;
        renderFlash(t.PLAYER_EL_ID, {
          url: '/swf/audio_lite.swf',
          id: 'flash_voice_player',
          height: 2
        }, {
          swliveconnect: 'true',
          allowscriptaccess: 'always',
          wmode: 'opaque'
        }, {
          onPlayFinish: 'VoicePlayerFlash.onAudioFinishCallback',
          onLoadProgress: 'VoicePlayerFlash.onAudioLoadProgressCallback',
          onPlayProgress: 'VoicePlayerFlash.onAudioProgressCallback'
        }) && setTimeout(function () {
          i._checkFlashLoaded()
        }, 50)
      },
      t.prototype.setUrl = function (t, e) {
        this._trackOptions = {
        },
        e && 'object' === (void 0 === e ? 'undefined' : r(e)) && (this._trackOptions = e, e = e.callback),
        this._url != t ? (this._url = t, this._player && this._player.loadAudio(t), e && e(!0))  : e && e(!0)
      },
      t.prototype.setVolume = function (t) {
        this._player && this._player.setVolume && this._player.setVolume(t)
      },
      t.prototype.play = function () {
        this._player && this._player.playAudio()
      },
      t.prototype.seek = function (t) {
        var e = (this._total || 0) * t;
        this._player && this._player.playAudio(e)
      },
      t.prototype.pause = function () {
        this._player && this._player.pauseAudio()
      },
      t.prototype.isFullyLoaded = function () {
        return !1
      },
      t.prototype.getPlayedTime = function () {
        return 0
      },
      t.prototype.getCurrentProgress = function () {
        return this._currProgress || 0
      },
      t.prototype.getCurrentBuffered = function () {
        return this._currBuffered || 0
      },
      t.prototype.stop = function () {
        this._player && this._player.stopAudio()
      },
      t.prototype._checkFlashLoaded = function () {
        var t = ge('flash_voice_player');
        if (this._checks = this._checks || 0, this._checks++, this._checks > 10) return this._player = !1,
        (e = this._onReady) && e(!1);
        if (t && t.paused) {
          var e;
          this._player = t,
          (e = this._onReady) && e(!0),
          this._onReady = null
        } else {
          var i = this;
          setTimeout(function () {
            i._checkFlashLoaded()
          }, 100)
        }
      },
      t.onAudioFinishCallback = function () {
        var t = window._flashVoiceInstance;
        t.opts.onEnd && t.opts.onEnd()
      },
      t.onAudioProgressCallback = function (t, e) {
        var i = window._flashVoiceInstance;
        e && (i._total = e, i._currProgress = t / e, i.opts.onProgressUpdate && i.opts.onProgressUpdate(i._currProgress))
      },
      t.onAudioLoadProgressCallback = function (t, e) {
        var i = window._flashVoiceInstance;
        i._currBuffered = t / e,
        i.opts.onBufferUpdate && i.opts.onBufferUpdate(i._currBuffered)
      },
      u(t, [
        {
          key: 'type',
          get: function () {
            return 'flash'
          }
        },
        {
          key: 'loaded',
          get: function () {
            return !!this._player
          }
        }
      ]),
      t
    }();
    window.VoicePlayerFlash = l,
    l.PLAYER_EL_ID = 'flash_voice';
    var h = function () {
      function t(t, e) {
        for (var i = 0; i < e.length; i++) {
          var o = e[i];
          o.enumerable = o.enumerable || !1,
          o.configurable = !0,
          'value' in o && (o.writable = !0),
          Object.defineProperty(t, o.key, o)
        }
      }
      return function (e, i, o) {
        return i && t(e.prototype, i),
        o && t(e, o),
        e
      }
    }();
    var d = 35;
    void 0 === window.isTouch && (window.isTouch = !1);
    var c,
    p = function () {
      function t(e, i) {
        if (function (t, e) {
          if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function')
        }(this, t), !e) throw new Error('No element was provided for Slider');
        e = ge(e),
        this.options = i || {
          size: 1
        },
        void 0 === this.options.logfbase && (this.options.logfbase = d),
        this.options.backValue = this.options.backValue || 0;
        var o = 100 * this.options.backValue,
        n = '<div class="slider_slide"><div class="slider_loading_bar" style="opacity: 0; display: none;"></div> ' + (this.options.withBackLine ? '<div class="slider_back" style="width:' + o + '%"></div>' : '') + ' <div class="slider_amount"></div> <div class="slider_handler"></div> </div>';
        this._el = ce('div', {
          innerHTML: n,
          className: 'slider',
          id: e.getAttribute('id') || ''
        });
        var a = this;
        if (e.classList) for (var s = e.classList, r = 0, u = s.length; r < u; r++) addClass(this._el, s[r]);
         else this._el.className = e.className;
        each(this._el.attributes, function (t, e) {
          'id' == e.name && 'class' == e.name || a._el.setAttribute(e.name, e.value)
        }),
        e.parentNode.replaceChild(this._el, e),
        this._amountEl = geByClass1('slider_amount', this._el),
        this._handlerEl = geByClass1('slider_handler', this._el),
        this._slideEl = geByClass1('slider_slide', this._el),
        this._backEl = geByClass1('slider_back', this._el),
        this._progressEl = geByClass1('slider_loading_bar', this._el),
        this.options.color && (setStyle(this._amountEl, {
          backgroundColor: this.options.color
        }), setStyle(this._handlerEl, {
          backgroundColor: this.options.color
        })),
        this.options.backColor && setStyle(this._slideEl, {
          backgroundColor: this.options.backColor
        }),
        addClass(this._el, 'slider_size_' + this.options.size),
        this.options.debounce && (this._onValueChangeDebounced = debounce(this._onValueChange, this.options.debounce)),
        !isTouch && i.formatHint && (addEvent(this._el, 'mousemove', this._ev_onMouseOver = this._onMouseOver.bind(this)), addEvent(this._el, 'mouseleave', this._ev_onMouseLeave = this._onMouseLeave.bind(this))),
        addEvent(this._el, isTouch ? 'touchstart' : 'mousedown', this._ev_onMouseDown = this._onMouseDown.bind(this)),
        addEvent(this._el, 'click', cancelEvent),
        this.setValue(this.options.value || 0, !this.options.fireChangeEventOnInit, !1),
        this.setBackValue(this.options.backValue)
      }
      return t.prototype.toggleLoading = function (t) {
        t = !!t,
        toggle(this._progressEl, t),
        setStyle(this._progressEl, 'opacity', t ? 1 : 0)
      },
      t.prototype.destroy = function () {
        !isTouch && this.options.formatHint && (removeEvent(this._el, 'mousemove', this._ev_onMouseOver), removeEvent(this._el, 'mouseleave', this._ev_onMouseLeave), removeEvent(this._el, 'mousedown', this._ev_onMouseDown));
        var t = window.re || window.remove;
        t(this._el),
        t(this._currHintEl)
      },
      t.prototype._updateHint = function (t, e) {
        this._currHintEl || (this._currHintEl = ce('div', {
          className: 'slider_hint',
          id: 'slider_hint'
        }), this.options.hintClass && addClass(this._currHintEl, this.options.hintClass), this._el.appendChild(this._currHintEl));
        var i = this._getPos(),
        o = Math.round((t.pageX || t.touches[0].pageX) - i[0]),
        n = this._width;
        if ((o = e ? Math.min(Math.max(0, o), n)  : o) >= 0 && o <= n) {
          var a = o / n;
          this._currHintEl.innerHTML = this.options.formatHint ? this.options.formatHint.call(this, a)  : a;
          var s = this._currHintEl.getBoundingClientRect();
          setStyle(this._currHintEl, {
            left: this._slideEl.offsetLeft + o - (s.right - s.left) / 2,
            top: this._slideEl.offsetTop - (s.bottom - s.top) - 10
          }),
          !e && this._toggleHint(!0)
        } else !e && this._toggleHint(!1);
        this.options.formatHint || this._toggleHint(!1)
      },
      t.prototype._toggleHint = function (t) {
        toggleClass(this._currHintEl, 'visible', t)
      },
      t.prototype._onMouseOver = function (e) {
        t._currenSliderDrag || hasClass(this._el, 'active') || this._updateHint(e)
      },
      t.prototype._onMouseLeave = function (t) {
        hasClass(this._el, 'active') || this._toggleHint(!1)
      },
      t.prototype._onMouseDown = function (e) {
        (0 == e.button || e.touches) && (delete cur._sliderMouseUpNowEl, addEvent(window, isTouch ? 'touchmove' : 'mousemove', this._ev_onMouseMove = this._onMouseMove.bind(this)), addEvent(window, isTouch ? 'touchend touchcancel' : 'mouseup', this._ev_onMouseUp = this._onMouseUp.bind(this)), this._onMouseMove(e), t._currenSliderDrag = this, addClass(this._el, 'active'), cancelEvent(e))
      },
      t.prototype._onMouseUp = function (e) {
        cur._sliderMouseUpNowEl = this._el,
        removeEvent(window, isTouch ? 'touchmove' : 'mousemove', this._ev_onMouseMove),
        removeEvent(window, isTouch ? 'touchend touchcancel' : 'mouseup', this._ev_onMouseUp),
        this._onValueChange(),
        removeClass(this._el, 'active'),
        t._currenSliderDrag = !1,
        this._toggleHint(!1),
        this.options.onEndDragging && this.options.onEndDragging(this._currValue),
        cancelEvent(e)
      },
      t.prototype._onMouseMove = function (t) {
        var e = this._getPos(),
        i = e[0];
        i = void 0 !== t.touches && t.touches.length > 0 ? t.touches[0].pageX : t.pageX,
        i = Math.max(i, e[0]),
        i = Math.min(i, e[0] + this._width),
        i -= e[0],
        this.setValue(i / this._width, !0, !0),
        this._onValueChangeDebounced ? this._onValueChangeDebounced()  : this._onValueChange(),
        this._toggleHint(!0),
        this._updateHint(t, !0),
        cancelEvent(t)
      },
      t.prototype._getPos = function () {
        return this._slidePos = getXY(this._slideEl)
      },
      t.prototype._logf = function (t) {
        if (!this.options.log) return t;
        var e = this.options.logfbase;
        return (Math.pow(e, t) - 1) / (e - 1)
      },
      t.prototype._unlogf = function (t) {
        if (!this.options.log) return t;
        var e = this.options.logfbase;
        return function (t, e) {
          return Math.log(e) / Math.log(t)
        }(e, 1 + t * (e - 1))
      },
      t.prototype.setValue = function (t, e, i) {
        if (!hasClass(this._el, 'active') || i) {
          var o = i ? this._logf(t)  : t;
          if (this._currValue != o) {
            this._currValue = o;
            var n = i ? t : this._unlogf(t);
            n = 100 * n + '%',
            setStyle(this._amountEl, {
              width: n
            }),
            setStyle(this._handlerEl, {
              left: n
            }),
            !e && this._onValueChange()
          }
        }
      },
      t.prototype.setBackValue = function (t) {
        toggleClass(this._backEl, 'slider_back_transition', t > this._backValue),
        this._backValue = t;
        var e = 100 * t + '%';
        setStyle(this._backEl, {
          width: e
        })
      },
      t.prototype._onValueChange = function () {
        this._lastValue = this._lastValue || 0,
        this._lastValue != this._currValue && (this._lastValue = this._currValue, this.options.onChange && this.options.onChange(this._currValue))
      },
      h(t, [
        {
          key: '_width',
          get: function () {
            if (!this._widthCache) {
              var t = this._el.getBoundingClientRect();
              this._widthCache = t.right - t.left
            }
            return this._widthCache
          }
        }
      ]),
      t
    }(),
    _ = function () {
      function t(t, e) {
        for (var i = 0; i < e.length; i++) {
          var o = e[i];
          o.enumerable = o.enumerable || !1,
          o.configurable = !0,
          'value' in o && (o.writable = !0),
          Object.defineProperty(t, o.key, o)
        }
      }
      return function (e, i, o) {
        return i && t(e.prototype, i),
        o && t(e, o),
        e
      }
    }();
    var f = !1,
    y = function () {
      function t() {
        var e = this;
        !function (t, e) {
          if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function')
        }(this, t),
        this._reattach = !1,
        this._audioEl = null,
        this._playing = !1,
        this._timer = null,
        this._duration = 0,
        this._detaching = !1;
        var i = {
          onEnd: function () {
            e.detach()
          },
          onFail: function () {
            i.onEnd()
          },
          onCanPlay: function () {
          },
          onProgressUpdate: function (t) {
            e._updateProgress(t)
          }
        };
        c = !1,
        s.isSupported() ? (s.isSupported('audio/ogg;codecs="opus"') && !s.isSupported('audio/ogg;codecs="codec_check"') && (c = !0), this._impl = new s(i))  : browser.flash && window.renderFlash && (this._impl = new l(i)),
        this.onPlayPause = function (t) {
          return cancelEvent(t),
          e.toggle()
        },
        this.onDurationClick = function (t) {
          e.durationType = !e.durationType,
          cancelEvent(t)
        },
        this._initEvents()
      }
      return t.prototype._updateProgress = function (t) {
        this._durationEl && (this.durationType ? this._durationEl.innerHTML = '-' + formatTime(Math.round(this._duration * (1 - t)))  : this._durationEl.innerHTML = formatTime(Math.round(this._duration * t))),
        this._progressSlider && this._progressSlider.setValue(t)
      },
      t.prototype._initInterface = function () {
        var t = this;
        this._el = ce('div', {
          innerHTML: '<div class="audio-msg-player audio-msg-track"><button class="audio-msg-track--btn"></button><div class="audio-msg-track--duration"></div><div class="audio-msg-track--wave-wrapper"><div class="audio-msg-track--slider"></div></div></div>'
        }).firstChild,
        window.getLang && attr(this._el, 'aria-label', getLang('mail_audio_message')),
        this._playBtn = geByClass1('audio-msg-track--btn', this._el),
        window.getLang && attr(this._playBtn, 'aria-label', getLang('global_audio_play')),
        this._durationEl = geByClass1('audio-msg-track--duration', this._el),
        this._durationEl.innerHTML = formatTime(this._duration),
        this._progressSlider = new p(geByClass1('audio-msg-track--slider', this._el), {
          value: 0,
          size: 0,
          hintClass: 'audio_player_hint',
          formatHint: function (e) {
            return formatTime(Math.round(e * t._duration))
          },
          onEndDragging: function (e) {
            t._impl.seek(e)
          }
        });
        var e = geByClass1('audio-msg-track--wave-wrapper', this._audioEl).children[0];
        geByClass1('slider_slide', this._el).appendChild(e.cloneNode(!0)),
        geByClass1('slider_amount', this._el).appendChild(e.cloneNode(!0)),
        addEvent(this._playBtn, 'click', this.onPlayPause),
        addEvent(this._durationEl, 'click', this.onDurationClick),
        this._audioEl.parentNode.appendChild(this._el)
      },
      t.prototype._destroyInterface = function () {
        hide(this._el),
        this._audioEl.parentNode.removeChild(this._el),
        removeEvent(this._playBtn, 'click', this.onPlayPause),
        this._progressSlider && (this._progressSlider.destroy(), this._progressSlider = null),
        this._playBtn = null,
        this._durationEl = null,
        this._el = null
      },
      t.prototype.attachTo = function (t) {
        var e = this;
        if (this._audioEl != t) {
          null != this._audioEl && (this._reattach = !0),
          this.detach(),
          this._audioEl = t,
          addClass(this._audioEl, 'audio-msg-track_player-attached'),
          this._duration = attr(t, 'data-duration'),
          this._initInterface();
          var i = this._audioEl.id.split('_');
          if (i && i.length > 1 && (this._owner_id = i[1]), this._reattach = !1, !this._impl.loaded) return new Promise(function (i, o) {
            e._impl.onReady(function () {
              e._impl.setUrl(attr(t, c ? 'data-ogg' : 'data-mp3'), {
                duration: e._duration,
                callback: i
              })
            })
          });
          this._impl.setUrl(attr(t, c ? 'data-ogg' : 'data-mp3'), {
            duration: this._duration
          })
        }
        return !0
      },
      t.prototype.detach = function () {
        var t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
        if (this._audioEl && this._el && !this._detaching) {
          if (t && this.isAttached()) return;
          this._detaching = !0,
          this.stop(),
          this._destroyInterface(),
          removeClass(this._audioEl, 'audio-msg-track_player-attached'),
          this._audioEl = null
        }
        this._detaching = !1
      },
      t.prototype.play = function () {
        this._audioEl && (this._reattach || t.pauseGlobalMedia(), addClass(this._el, 'audio-msg-track_playing'), window.getLang && attr(this._playBtn, 'aria-label', getLang('global_audio_pause')), this._playing = !0, this._createTimer(), this._owner_id && statlogsValueEvent('audio_message_play', this._owner_id), this._impl.play())
      },
      t.prototype.pause = function () {
        this._audioEl && (!this._reattach && this._playing && t.resumeGlobalMedia(), window.getLang && attr(this._playBtn, 'aria-label', getLang('global_audio_play')), removeClass(this._el, 'audio-msg-track_playing'), this._playing = !1, this._impl.pause(), this._killTimer())
      },
      t.prototype.stop = function () {
        this.pause(),
        this._impl.stop()
      },
      t.prototype.toggle = function () {
        this._playing ? this.pause()  : this.play()
      },
      t.prototype._createTimer = function () {
        var t = this;
        this._duration > 0 && (this._killTimer(), this._timer = setInterval(function () {
          var e = t._impl.getCurrentProgress();
          t._updateProgress(e)
        }, 100))
      },
      t.prototype._killTimer = function () {
        this._timer && (clearInterval(this._timer), this._timer = null)
      },
      t.prototype._initEvents = function () {
        var t = this;
        window.ap ? ap.on(this, AudioPlayer.EVENT_PLAY, function () {
          delete ap.pausedByMsg,
          t.pause()
        })  : window.audio && audio.onPlay(function () {
          delete audio.pausedByMsg,
          t.pause()
        }),
        window.Notifier && (Notifier.addRecvClbk('audio_start', 'audio_msg', function () {
          t.pause()
        }), Notifier.addRecvClbk('video_start', 'audio_msg', function () {
          t.pause()
        }))
      },
      t.prototype.isAttached = function () {
        if (this._audioEl) {
          for (var t = this._audioEl; t.parentNode; ) t = t.parentNode;
          return !!t.body
        }
        return !1
      },
      t.pauseGlobalMedia = function () {
        window.Notifier && (f = !0, Notifier.lcSend('video_start')),
        window.ap && ap.isPlaying() ? (ap.pause(), ap.pausedByMsg = !0)  : window.audio && audio.playing && audio.playing() && (audio.pause(), audio.pausedByMsg = !0)
      },
      t.resumeGlobalMedia = function () {
        window.Notifier && f && (f = !1, Notifier.lcSend('video_hide')),
        window.ap && ap.pausedByMsg ? (ap.play(), delete ap.pausedByMsg)  : window.audio && audio.playing && audio.pausedByMsg && (audio.play(), delete audio.pausedByMsg)
      },
      _(t, [
        {
          key: 'type',
          get: function () {
            return this._impl.type
          }
        },
        {
          key: 'durationType',
          get: function () {
            return window.AudioPlayer ? !!ls.get(AudioPlayer.LS_PREFIX + AudioPlayer.LS_DURATION_TYPE)  : '1' == lsGet('audio_time_left')
          },
          set: function (t) {
            window.AudioPlayer ? ls.set(AudioPlayer.LS_PREFIX + AudioPlayer.LS_DURATION_TYPE, !!t)  : lsSet('audio_time_left', t ? '1' : '0')
          }
        }
      ]),
      t
    }(),
    g = i('i/qW'),
    m = null;
    function v(t) {
      for (var e = geByClass('audio-msg-track--wave-wrapper', t), i = 0, o = 0; o < e.length; o++) {
        try {
          i = parseInt(window.getComputedStyle(e[o], null).getPropertyValue('width'))
        } catch (t) {
          i = parseInt(e[o].currentStyle.width)
        }
        if (i > 0) break
      }
      return i
    }
    function E(t, e) {
      e = Math.round(e),
      t.length != e && (t = Object(g.b) (t, e));
      for (var i = '', o = 0, n = 0; n < t.length; n++) 0 == (o = Math.floor(10 * t[n] * 0.95)) && (o = 0.5),
      i += 'M' + (3 * n + 1) + ',' + (10 - o) + 'v' + 2 * o + 'Z';
      return '<svg class="audio-msg-track--wave" width="' + 3 * t.length + 'px"><path d="' + i + '"></path></svg>'
    }
    function w() {
      for (var t = geByClass('audio-msg-track'), e = 0; e < t.length; e++) {
        var i = attr(t[e], 'data-wave');
        hasClass(t[e], 'audio-msg-player') && e > 0 && (i = attr(t[e - 1], 'data-wave'));
        var o = v(t[e]);
        if (i && o) {
          i = i.split(',');
          for (var n = geByClass('audio-msg-track--wave', t[e]), a = E(i, o / 3), s = 0; s < n.length; s++) {
            var r = ce('div', {
              innerHTML: a
            }).firstChild;
            n[s].parentNode.replaceChild(r, n[s])
          }
        }
      }
    }
    function A() {
      return m || (m = new y),
      m
    }
    addEvent(window, 'orientationchange', function () {
      return setTimeout(w, 500)
    }),
    window.mail && window.mail.onMessagesRepainted && (onDOMReady(w), window.mail.onMessagesRepainted(w)),
    window.AudioMessagePlayer = {
      loaded: !0,
      togglePlay: function (t, e) {
        var i = A(),
        o = i.attachTo(t);
        !0 === o ? i.play()  : o.then(function () {
          i.play()
        });
          i._impl._currentAudioEl.playbackRate=window.__mpl_plrate;
        window.____MESSAGE_PLAYER_=i._impl._currentAudioEl;
      },
      detachPlayer: function (t) {
        A().detach(t)
      },
      pauseGlobalMedia: function () {
        y.pauseGlobalMedia()
      },
      resumeGlobalMedia: function () {
        y.resumeGlobalMedia()
      },
      redrawWaves: w,
      getWave: E
    };
    try {
      stManager.done('voice_message_player.js')
    } catch (t) {
    }
  },
  'i/qW': function (t, e, i) {
    'use strict';
    var o = function () {
      function t() {
        !function (t, e) {
          if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function')
        }(this, t),
        this.clear()
      }
      return t.prototype.push = function (t) {
        this._count++,
        this._accum += t
      },
      t.prototype.get = function () {
        return this._accum / this._count
      },
      t.prototype.clear = function () {
        this._count = 0,
        this._accum = 0
      },
      t
    }();
    var n = function () {
      function t() {
        !function (t, e) {
          if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function')
        }(this, t),
        this.clear()
      }
      return t.prototype.push = function (t) {
        this._max = Math.max(this._max, Math.abs(t))
      },
      t.prototype.get = function () {
        return this._max
      },
      t.prototype.clear = function () {
        this._max = 0
      },
      t
    }();
    var a = function () {
      function t() {
        !function (t, e) {
          if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function')
        }(this, t),
        this.clear()
      }
      return t.prototype.push = function (t) {
        this._count++,
        this._accum += t,
        this._accum_q += t * t
      },
      t.prototype.get = function () {
        return 1 == this._count ? this._accum : Math.sqrt((this._accum_q - this._accum * this._accum / this._count) / this._count)
      },
      t.prototype.clear = function () {
        this._count = 0,
        this._accum = 0,
        this._accum_q = 0
      },
      t
    }();
    i.d(e, 'a', function () {
      return r
    }),
    i.d(e, 'b', function () {
      return u
    });
    var s = {
      avg: o,
      peak: n,
      quad: a
    },
    r = function () {
      function t(e) {
        !function (t, e) {
          if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function')
        }(this, t),
        this._normalizeAlgorithm = !1,
        s[e.normalizeAlgorithm] && (this._normalizeAlgorithm = new s[e.normalizeAlgorithm]),
        this._srcSampleRate = parseInt(e.srcSampleRate || 0),
        this._dstSampleRate = parseInt(e.dstSampleRate || 0),
        this._truncateTo = 1,
        void 0 !== e.truncateTo && (this._truncateTo = e.truncateTo),
        this._dstSampleRate > 0 ? this._sampleRate = this._srcSampleRate / this._dstSampleRate : this._sampleRate = 0,
        s[e.algorithm] || (e.algorithm = 'peak'),
        this._algorithm = new s[e.algorithm],
        this._sampleCount = 0,
        this._data = [
        ]
      }
      return t.prototype.push = function (t) {
        if (this._sampleRate <= 0) return [];
        for (var e = [
        ], i = void 0, o = 0; o < t.length; o++) if (this._truncateTo > 0 && (t[o] = Math.min(this._truncateTo, Math.abs(t[o]))), this._sampleCount += 1, this._sampleCount >= this._sampleRate) for (; this._sampleCount >= this._sampleRate; ) this._sampleCount -= this._sampleRate,
        this._sampleCount <= 0.8 && this._algorithm.push(t[o]),
        i = this._algorithm.get(),
        e.push(i),
        this._normalizeAlgorithm && this._normalizeAlgorithm.push(i),
        this._algorithm.clear(),
        this._sampleCount > 0.2 && this._algorithm.push(t[o]);
         else this._algorithm.push(t[o]);
        if (this._normalizeAlgorithm) {
          var n = this._normalizeAlgorithm.get();
          if (this._normalizeAlgorithm.clear(), n > 0) for (var a = 0; a < e.length; a++) e[a] = e[a] / n,
          this._truncateTo > 0 && (e[a] = Math.min(this._truncateTo, Math.abs(e[a])))
        }
        return e
      },
      t
    }();
    function u(t, e) {
      var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 'peak';
      return new r({
        srcSampleRate: t.length,
        dstSampleRate: e,
        normalizeAlgorithm: i,
        truncateTo: 0
      }).push(t)
    }
  }
});

//------------------------

    /*setInterval(function(){
        var _el=document.querySelectorAll(".audio-msg-track:not(.audio-msg-u)");
        _el.forEach(function(el){
            el.onclick="return AudioMessagePlayer.togglePlay(this,event,window.__mpl_plrate);";
            el.classList.add('audio-msg-u');
        });
    },100);*/

    range=document.createElement("span"); //Создание элемента span
    range.innerHTML='Playback rate:<input type=range min=0.5 max=2 step=0.01 class="pl_rate"><span class="pl_rateval">1</span>'; //Присваивание основных компонентов
    range.style.position='fixed';// Стили
    range.id="pl_rate_container";
    range.style.bottom='0';
    range.style.left='0';
    range.style.zIndex='99999999';
    range.querySelector('input').addEventListener('input',function(){
        window.__mpl_plrate=this.value;
        localStorage.setItem('m_plrate',this.value);
        range.querySelector('span').innerText=this.value;
        window.____MESSAGE_PLAYER_.playbackRate=this.value;
    });
    if(localStorage.getItem('m_plrate')!==undefined){
        range.querySelector('input').value=parseFloat(localStorage.getItem('m_plrate'));//Восстановление значения из localstorage
    }else{
        range.querySelector('input').value=1;//Если нет значения, то значение по умолчанию 1 (нормальная скорость)
    }
    range.querySelector('span').innerText=range.querySelector('input').value;
    window.__mpl_plrate=range.querySelector('input').value;
    if(location.href.search(/widget/)==-1){//Если не виджет
        document.body.append(range);// Добавление в конец body
    }
},100);