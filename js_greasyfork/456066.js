// ==UserScript==
// @name         Great Darkstar
// @namespace    mailto:DarkStar@Darky.com
// @version      1.9
// @description  تحسين جودة القراءة على المواقع الي اقرا عليها....
// @author       Darkstar
// @match        https://aresmanga.com/*
// @match        https://mnhaestate.com/series/*
// @match        https://ozulscans.com/*
// @match        https://azoraworlds.net/series/*
// @match        https://galaxymanga.org/*
// @match        https://swatmanga.me/*/m/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456066/Great%20Darkstar.user.js
// @updateURL https://update.greasyfork.org/scripts/456066/Great%20Darkstar.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let currentUrl = location.hostname;
  var aresmanga = /aresmanga.*/g,
    swatmanga = /swatmanga.*/g,
    mnhaestate = /mnhaestate.*/g,
    galaxymanga = /galaxymanga.*/g,
    azoraworlds = /azoraworlds.*/g,
    ozulscans = /ozulscans.*/g;
  function get() {
    if (aresmanga.test(currentUrl)) {
      console.log("aresmanga");
      let script = document.createElement("script");
      script.src = "https://static.staticsave.com/manga/aresmanga.js";
      document.body.appendChild(script);
    } else if (swatmanga.test(currentUrl)) {
      console.log("swatmanga");
      swatmangaF();
    } else if (galaxymanga.test(currentUrl)) {
      console.log("galaxymanga");
      let script = document.createElement("script");
      script.src = "https://static.staticsave.com/manga/galaxymanga.js";
      document.body.appendChild(script);
    } else if (mnhaestate.test(currentUrl)) {
      console.log("mnhaestate");
      let script = document.createElement("script");
      script.src = "https://static.staticsave.com/manga/mnhaestate.js";
      document.body.appendChild(script);
    } else if (azoraworlds.test(currentUrl)) {
      console.log("azoraworlds");
      let script = document.createElement("script");
      script.src = "https://static.staticsave.com/manga/azoraworlds.js";
      document.body.appendChild(script);
    } else if (ozulscans.test(currentUrl)) {
      console.log("ozulscans");
      let script = document.createElement("script");
      script.src = "https://static.staticsave.com/manga/ozulscans.js";
      document.body.appendChild(script);
    } else {
      console.log("Error");
    }
  }
  get();

  function swatmangaF() {
    let nextBtn = document
      .querySelector(".ch-next-btn ")
      .classList.contains("disabled");
    let chapters;
    let currentChp;
    let nextChapter;
    let wraper;
    let title;
    let nextUrl;
    let urlList = [];
    let oneLastTime = false;
    let waiting = false;

    var kickstart = setInterval(Start, 2000);
    function Start() {
      chapters = document.getElementById("chapter").options;
      if (nextBtn == false && chapters != null) {
        currentChp = chapters.selectedIndex;
        nextChapter = currentChp - 1;
        console.clear();
        getUrl();
        clearJunk();
        clearInterval(kickstart);
      } else if (nextBtn == true) {
        newNotificon("الفصل الاخير");
        clearInterval(kickstart);
      } else {
        newNotificon("تجميع البيانات");
      }
    }
    function clearJunk() {
      document.querySelectorAll(".ad-banner")[2].remove();
      document.getElementById("comments").remove();
      document.getElementById("footer").remove();
      document.querySelector(".bixbox").remove();
      document.querySelector(".chaptertags").remove();
      document.querySelector(".cbot").remove();
    }

    var position = setInterval(evE, 1000);

    function evE() {
      if (oneLastTime == false && waiting == false) {
        if (
          window.innerHeight + window.pageYOffset >=
          document.body.offsetHeight
        ) {
          getUrl();
          appendChp();
          console.log("Event called");
        }
      } else {
        reloadFunctions(); // reload the page
        clearInterval(position);
      }
    }

    function getUrl() {
      if (nextChapter != 0) {
        nextUrl = chapters[nextChapter].value;
        title = chapters[nextChapter].textContent;
        fetchit(nextUrl);
        console.log(title);
      } else {
        oneLastTime = true;
        newNotificon("الفصل الاخير");
      }
    }
    function fetchit(nextchapter) {
      var fetchTimer = setTimeout(() => {
        waiting = true;
        newNotificon("يتم تحميل الفصل التالي");
      }, 1000);
      nextChapter -= 1;
      fetch(nextchapter)
        .then((response) => response.text())
        .then((text) => {
          let parser = new DOMParser();
          let htmlDocument = parser.parseFromString(text, "text/html");
          let docElement = htmlDocument.documentElement;
          let strings =
            docElement.querySelector(".wrapper").childNodes[3].innerHTML;
          getUrls(strings);
          newNotificon("تم تحميل الفصل التالي");
          clearTimeout(fetchTimer);
        });
    }

    function getUrls(urls) {
      function unescapeSlashes(str) {
        let parsedStr = str.replace(/(^|[^\\])(\\\\)*\\$/, "$&\\");
        parsedStr = parsedStr.replace(/(^|[^\\])((\\\\)*")/g, "$1\\$2");
        try {
          parsedStr = JSON.parse(`"${parsedStr}"`);
        } catch (e) {
          return str;
        }
        return parsedStr;
      }
      let vr = unescapeSlashes(urls);
      let vs = vr.substring(vr.indexOf('images":['), vr.indexOf("]") + 1);
      let sb = vs.substring(vs.indexOf("["), vs.indexOf("]") + 1);
      let NewUrl = sb.replace(/[\[\]']+/g, "");
      NewUrl = unescapeSlashes(NewUrl);
      urlList = NewUrl.split(",");
      console.table(urlList);
      waiting = false;
      creatimgImg();
    }

    function creatimgImg() {
      wraper = document.createElement("div");
      wraper.className = title;
      urlList.forEach((url) => {
        let img = document.createElement("img");
        url = url.replace(/"/g, "");
        img.src = url;
        img.classList.add("ts-main-image");
        wraper.appendChild(img);
      });
    }

    function appendChp() {
      document.querySelector("#readerarea").appendChild(wraper);
      window.history.pushState({}, "", nextUrl);
      newNotificon("تم عرض الفصل التالي");
    }

    function reloadFunctions() {
      console.log("reloadFunctions called");
      var timer;
      let called;
      var reload = setInterval(reloadBtn, 2000);
      function reloadBtn() {
        if (
          window.innerHeight + window.pageYOffset >=
          document.body.offsetHeight
        ) {
          timer = setTimeout(() => {
            location.reload();
            clearInterval(reload);
          }, 2000);
          newNotificon("جاري الانتقال الى الفصل الاخير");
          called = true;
        } else if (called == true) {
          clearTimeout(timer);
          reloadFunctions();
          called = false;
          newNotificon("تم الغاء العملية...");
          clearInterval(reload);
          console.log("reloadFunctions called else");
        }
      }
    }

    class XNotify {
      constructor(t) {
        (this.position = this.empty(t) ? "TopRight" : t),
          (this.defaults = {
            width: "250px",
            borderRadius: "10px",
            duration: 5e3,
            color: "rgb(255,255,255)",
            success: {
              title: "Success Notification",
              description: "Whatever you did, it worked.",
              background: "rgb(40,200,80)",
            },
            error: {
              title: "Error Notification",
              description: "That didn't work out, did it?",
              background: "rgb(230,50,50)",
            },
            alert: {
              title: "Alert Notification",
              description: "This is probably important...",
              background: "rgb(240,180,10)",
            },
            info: {
              title: "",
              description: "Just so you know...",
              background: "rgb(170,80,220)",
            },
          });
      }
      setOptions(t, e) {
        (this.width = this.empty(t.width) ? this.defaults.width : t.width),
          (this.borderRadius = this.empty(t.borderRadius)
            ? this.defaults.borderRadius
            : t.borderRadius),
          (this.title = this.empty(t.title) ? this.defaults[e].title : t.title),
          (this.description = this.empty(t.description)
            ? this.defaults[e].description
            : t.description),
          (this.duration = this.empty(t.duration)
            ? this.defaults.duration
            : t.duration),
          (this.background = this.empty(t.background)
            ? this.defaults[e].background
            : t.background),
          (this.color = this.empty(t.color) ? this.defaults.color : t.color);
      }
      success(t) {
        this.setOptions(t, "success");
        let e = this.createElement();
        this.showNotification(e);
      }
      error(t) {
        this.setOptions(t, "error");
        let e = this.createElement();
        this.showNotification(e);
      }
      alert(t) {
        this.setOptions(t, "alert");
        let e = this.createElement();
        this.showNotification(e);
      }
      info(t) {
        this.setOptions(t, "info");
        let e = this.createElement();
        this.showNotification(e);
      }
      createElement() {
        if (!document.getElementById("x-notify-container")) {
          let t = document.getElementsByTagName("body")[0],
            e = "calc(100% - 20px)",
            i = "20px",
            o = "0",
            s = "0",
            n = "0",
            r = "auto",
            a = "auto";
          switch (this.position) {
            case "BottomRight":
              (e = "auto"), (s = "auto"), (r = "0");
              break;
            case "BottomLeft":
              (e = "auto"),
                (i = "0"),
                (o = "20px"),
                (s = "auto"),
                (n = "auto"),
                (r = "0"),
                (a = "0");
              break;
            case "TopLeft":
              (i = "0"), (o = "20px"), (n = "auto"), (a = "0");
              break;
          }
          let l = document.createElement("div");
          (l.id = "x-notify-container"),
            (l.style =
              "position:fixed; z-index:999; width:calc(" +
              this.width +
              " + 70px); height:" +
              e +
              "; pointer-events:none; overflow-x:hidden; overflow-y:auto; scrollbar-width:none; -webkit-overflow-scrolling:touch; scroll-behavior:smooth; padding-top:20px; padding-right:" +
              i +
              "; padding-left:" +
              o +
              "; top:" +
              s +
              "; right:" +
              n +
              "; bottom:" +
              r +
              "; left:" +
              a +
              ";"),
            t.appendChild(l);
        }
        let t =
            "TopRight" === this.position || "BottomRight" === this.position
              ? "right"
              : "left",
          e = document.createElement("div");
        (e.id = this.generateID()),
          (e.style =
            "display:block; padding:0 0 20px 0; text-align:" +
            t +
            "; width:100%;");
        let i = document.createElement("div");
        return (
          i.classList.add("x-notification"),
          (i.style =
            "background:" +
            this.background +
            "; color:" +
            this.color +
            "; width:" +
            this.width +
            "; border-radius:" +
            this.borderRadius +
            '; padding:10px 12px 12px 12px; font-family:"Helvetica Neue", "Lucida Grande", "Arial", "Verdana", "Tahoma", sans-serif; display:inline-block; text-align:left; opacity:0; pointer-events:auto; -webkit-user-select:none; -khtml-user-select:none; -moz-user-select:none; -ms-user-select:none; user-select:none; outline:none;'),
          (i.innerHTML =
            '<span style="font-size:18px; font-weight:bold; color:' +
            this.color +
            '; display:block; line-height:25px;">' +
            this.title +
            '</span><span style="font-size:16px; color:' +
            this.color +
            '; display:block; margin-top:5px; line-height:25px;">' +
            this.description +
            "</span>"),
          e.append(i),
          e
        );
      }
      showNotification(t) {
        let e = document.getElementById("x-notify-container"),
          i = t.getElementsByClassName("x-notification")[0];
        "BottomRight" === this.position || "BottomLeft" === this.position
          ? (e.append(t),
            e.scrollHeight > window.innerHeight &&
              (e.style.height = "calc(100% - 20px)"),
            e.scrollTo(0, e.scrollHeight))
          : e.prepend(t);
        let o = 0.05,
          s = setInterval(() => {
            (o += 0.05),
              (i.style.opacity = o),
              o >= 1 && ((i.style.opacity = 1), clearInterval(s));
          }, 10);
        setTimeout(() => {
          this.hideNotification(t);
        }, this.duration);
      }
      hideNotification(t) {
        let e = document.getElementById("x-notify-container"),
          i = t.getElementsByClassName("x-notification")[0],
          o = 1,
          s = setInterval(() => {
            (o -= 0.05),
              (i.style.opacity = o),
              o <= 0 && (t.remove(), clearInterval(s));
          }, 10);
        e.scrollHeight <= window.innerHeight && (e.style.height = "auto"),
          this.empty(e.innerHTML) && e.remove();
      }
      clear() {
        let t = document
          .getElementById("x-notify-container")
          .getElementsByClassName("x-notification");
        for (let e = 0; e < t.length; e++) this.hideNotification(t[e]);
      }
      generateID() {
        let t = this.epoch() + "-" + this.shuffle(this.epoch());
        if (this.empty(document.getElementById("x-notify-container").innerHTML))
          return t;
        let e = !0;
        for (; e; ) {
          if (!document.getElementById(t)) {
            e = !1;
            break;
          }
          t = this.epoch() + "-" + this.shuffle(this.epoch());
        }
        return t;
      }
      shuffle(t) {
        let e = t.toString().split("");
        for (let t = e.length; t > 0; ) {
          let i = parseInt(Math.random() * t),
            o = e[--t];
          (e[t] = e[i]), (e[i] = o);
        }
        return e.join("");
      }
      epoch() {
        var t = new Date();
        return Math.round(t.getTime() / 1e3);
      }
      empty(t) {
        return null == t || "" === t.toString().trim();
      }
    }

    const Notify = new XNotify();

    function newNotificon(note) {
      Notify.info({
        description: note,
        width: "fit-content",
        borderRadius: "10px",
        color: "rgb(255,255,255)",
        background: "#0b0a0d7a",
      });
    }
  }
})();
