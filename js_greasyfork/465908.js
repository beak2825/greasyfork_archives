// ==UserScript==
// @name         qianuni.com-企安e学-m
// @namespace    shuake345，专注刷课的vx
// @version      0.2
// @description  秒刷秒考vx:shuake345|本脚本为全自动看完视频|不自动考试
// @author       shuake345
// @match        *://*.qianuni.com/study/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465908/qianunicom-%E4%BC%81%E5%AE%89e%E5%AD%A6-m.user.js
// @updateURL https://update.greasyfork.org/scripts/465908/qianunicom-%E4%BC%81%E5%AE%89e%E5%AD%A6-m.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var Zyurl = 'courseDetails'
    var Cyurl = 'courseOutlineId'
    document.addEventListener("visibilitychange", function() {
        console.log(document.visibilityState);
        if (document.visibilityState == "hidden") {
        } else if (document.visibilityState == "visible") {
            if (document.URL.search(Zyurl) > 1) {
                setTimeout(sx, 1000)
            }
        }
    });
    function getRelativeDiv(e) {
            var t = r.id;
            return (t = t.replace(/(sp-separator-)(.+)/, (function(t, r, n) {
              return r + String(Number(n) + ("pre" == e ? -1 : 1));
            }))) ? document.getElementById(t) : null;


          function sp_transition(e, t) {
            var r = sp_transition.TweenF;
            r || (r = (r = Tween[TweenM[prefs.s_method]])[TweenEase[prefs.s_ease]] || r, sp_transition.TweenF = r);
            var n = 1e3 / prefs.s_FPS, a = 0, o = e, i = t - e, s = Math.ceil(prefs.s_duration / n),
              c = window.scrollX;
            !function transition() {
              var e = Math.ceil(r(a, o, i, s));
              window.scroll(c, e), a < s && (a++, setTimeout(transition, n));
            }();
          }

          function scrollIt(e, t) {
            sp_transition(e, t);
          }

          switch (e.target.id) {
            case "sp-sp-gotop":
              scrollIt(window.scrollY, 0);
              break;

            case "sp-sp-gopre":
              var n = getRelativeDiv("pre");
              if (!n) return;
              t = window.scrollY;
              var a = n.getBoundingClientRect().top;
              a = t - (r.getBoundingClientRect().top - a);
              scrollIt(t, a);
              break;

            case "sp-sp-gonext":
              var o = getRelativeDiv("next");
              if (!o) return;
              t = window.scrollY;
              var i = o.getBoundingClientRect().top;
              i = t + (-r.getBoundingClientRect().top + i);
              scrollIt(t, i);
              break;

            case "sp-sp-gobottom":
              scrollIt(window.scrollY, Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
          }
    function getRelativeDiv(e) {
            var t = r.id;
            return (t = t.replace(/(sp-separator-)(.+)/, (function(t, r, n) {
              return r + String(Number(n) + ("pre" == e ? -1 : 1));
            }))) ? document.getElementById(t) : null;
          }

          function sp_transition(e, t) {
            var r = sp_transition.TweenF;
            r || (r = (r = Tween[TweenM[prefs.s_method]])[TweenEase[prefs.s_ease]] || r, sp_transition.TweenF = r);
            var n = 1e3 / prefs.s_FPS, a = 0, o = e, i = t - e, s = Math.ceil(prefs.s_duration / n),
              c = window.scrollX;
            !function transition() {
              var e = Math.ceil(r(a, o, i, s));
              window.scroll(c, e), a < s && (a++, setTimeout(transition, n));
            }();
          }

          function scrollIt(e, t) {
            sp_transition(e, t);
          }

          switch (e.target.id) {
            case "sp-sp-gotop":
              scrollIt(window.scrollY, 0);
              break;

            case "sp-sp-gopre":
              var n = getRelativeDiv("pre");
              if (!n) return;
              t = window.scrollY;
              var a = n.getBoundingClientRect().top;
              a = t - (r.getBoundingClientRect().top - a);
              scrollIt(t, a);
              break;

            case "sp-sp-gonext":
              var o = getRelativeDiv("next");
              if (!o) return;
              t = window.scrollY;
              var i = o.getBoundingClientRect().top;
              i = t + (-r.getBoundingClientRect().top + i);
              scrollIt(t, i);
              break;

            case "sp-sp-gobottom":
              scrollIt(window.scrollY, Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
          }


        function windowscroll(fn = () => {
        }) {
          safeWaitFunc(() => document.documentElement, () => {
            var beforeScrollTop = document.documentElement.scrollTop
            window.addEventListener("scroll", function(e) {
              var afterScrollTop = document.documentElement.scrollTop,
                delta = afterScrollTop - beforeScrollTop;
              if (delta === 0) return false;
              fn(delta > 0 ? "down" : "up", e);
              beforeScrollTop = afterScrollTop;
            }, false);
          })
        }
    }

    function sx() {
        window.location.reload()
    }

    function Zy() {
        if(document.querySelector('[style="color: rgb(9, 118, 254);"]')!==null){
            document.querySelector('[style="color: rgb(9, 118, 254);"]').click()
        }

    }
            setInterval(Zy, 2210)

    function Cy() {
        if(document.getElementsByClassName('ccH5TimeTotal')[0]!==undefined){
            var alltime=document.getElementsByClassName('ccH5TimeTotal')[0].innerText.split(':')
            var allmiao
            switch (alltime.length){
                case 2:
                    allmiao = alltime[0]*60+alltime[1]-1
                    document.getElementsByTagName('video')[0].play()
                    break;
                case 3:
                    allmiao = alltime[0]*3600+alltime[1]*60+alltime[0]-1
                    document.getElementsByTagName('video')[0].play()
                    break;
                default:
            }
        }
    }
            setInterval(Cy, 5210)

})();