// ==UserScript==
// @name         2.选集等功能菜单
// @namespace    http://tampermonkey.net/
// @version      2.3.4
// @description  增加新的选集菜单；上唤出功能菜单：刷新页面，下一集，精确选集；适配网站：莫扎兔，333影视，伊雪湾，6080，厂长资源，神马影院，饭团影视，饺子录像厅，西瓜影院
// @author       AragakiYui
// @match        *://*/*
// @exclude      *://www.yangshizhibo.com/*
// @exclude       *://lf-zt.douyin.com/*
// @exclude       *://www.douyin.com/*
// @exclude       *://greasyfork.org/*
// @exclude      *://live.yj1211.work/*
// @exclude      *://googleads.g.doubleclick.net/*
// @exclude      *://tpc.googlesyndication.com/*
// @exclude       *://sun.20001027.com/*
// @run-at      document-body
// @license MIT
// @grant          GM_xmlhttpRequest
// @grant          GM_setClipboard
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_deleteValue
// @grant          GM_registerMenuCommand
// @icon              data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAAAhFBMVEVHcEwDAgL68vLz5uWeBAXv5eT16unv4+Pr3t57Cg2XBQaOBQd/BAZqBAbs3961q6tuaGhHQUImIyTj0tEXERJhW1xUT08MCgodGxuWjo47Njd9dnaHgYExLS6gmJjfv7y/trWqoaGhFhePMDDOxMTIeXnVnpx2IiK2SUqrJylIDQ2ZYmHjbvk7AAAACnRSTlMA////////YWFjn3/5VwAABvVJREFUSMdlV4eWo7oSNCbsXoIiEkJCZBuH//+/VxKesOdpOPaMTdHVqbrnconnT5rneZrmKckTnC6JpxNcK+a0xMcpibeQ/M/l55yYeJHEJN+nM5Yz1vc9JyR+TcJV5F84fJafVy4T8YNLWgCVcsNC552EG9J4a5r+n72eudH9cG29ZpqxoQdw3wOm+Nx44vITl5ORMsVa680H2Bntxr7HNdNgtPi6NSLPhxSgr7j1nHvRnuaSRHvuRjrTZXZ4pbvM89OjHGT/pqfJPFfOWyUSY7pOn0CvlBpGCmuzCzapTL9s/o0ekvCQnfLWeABe79vBug5AoYKDYzBG2TwiRuREFojPx3pBKPe4t348s6y8v50AY6GcG4ZlAYIOfoSvNNoIiAs5Yem89/Yoq6zMAFwbxy0SynrXD2NPh3FeBgfjwx4DgutyJjW/HVUdIFk8VXo4bU3HKVXjOLJhmBfmUAtsJGcG0ksR3m5V+YUJ6KmumoFpK8RIOVwbnKJUM8Up63cQDSxDcLaqqqsPrnyEF3KdLFNWt/3SLYz2vWVzjydRxaj8UL1WgNVfwLVeb89gXL4M52ymvsW9CxPICYCj4suMSglUy6p63AGEnR+yWba9hG2HpffCDKgmY+dFuXZ2tp/JWa7lOycV0GWW/QaWjfbd0Dvhu9HqRPB50QpAPY6xUUD1eq1/cf0+B5WeD6ozCYA2sZRanvSMKxbKJyfoKfjYNAD+Q7W8jVRzNpgumbkYE4PE+MSylns2I6yIalVPtDmRPzAUT6tFL6Rpk1kL3fGROoumaXnL8gI/F0LkHnAnV5ROiG2oOiPJkrAE/CQxydLPOnQq552KPX1Bs4Dpt8UyWxEq0H74faBmZHLYr+R6JcOoejSN190YuwvBqT7Ab65l9pzuk1bFdb9K1omWL1LOo+vhqumNPAtgDwVQhrBWv73MUrlfr8PZv1LuEzTLLQKlzyQKoCAXQKKHdZb9k8kJeboWRMpQmHijKDzFLBMLPX2MPJumQkP9k8p7AJJpmu44eKOjpswJjphJCpOX5vSwjsF5ZHUdY1qWRzA43d9t25rXcbzuTC+uN1AJXeSkSGHxw/VTAc+1bNbnWgWq+dS3oZ/bNrEI1oLG8rbzvs9ZfjkjeobmQ/VeVc0D9q5EAq045/R1n4TWgzAJ43YQ+RKBoFeG8x2b8v68X1NEvSjcvivdd8d9F45rKCC3nKO5SKAaLGYftfmqVAkhK3AIud9u23a773rkPQrOC+GtJjEdwcHsH/FYN0Dy4go0kQipnOSiZs6M99x2xviiuHy79zsXt7koJEkjEDmUqZxGL63gKHIW1A8FUFVfJYOX9WOwkgVSKGEyQtG6V5lQTK5E2J53ZkGtps8YzYBc0RtrfN8xSsEwvwabcSwWiWB6cJYLNLeSUVeDOH14PqoKfz3uksSiiSYjVJqOMbawwaNhtMtRAPj0+ePc+qjKWykJEHSaQxojtnAePKHoS6+XMAdIEYD5lv2GNvgiIFLAY6XjCIx0RofOGzrCjzQHEFonfyOfbxgsArCIBsNLaxWdl2VsTdvbkUQljwM2Xb+T8byhwcPtSPsmSfw17Rim5MyY5ovWbEagi0t+7gPrtxInHUrtKo+jqY/tFugWU6IoBIByinxwdcVAPacVRIs8InRtMP15dO1xABd/m6aEzUoLocJK0o3R0iU9B2VKNgT3uQnTdq07u3+K5q7zdHTvETInxnFAi0RJgK5GJMYIBsFja8FEQYdDIvBFwLvtUTVaG29dJ3q6CBlXhnOwYkgWJGkrCK7AbnM38/AVUVU+1rpRNvFmEC1LEpMv6Tkf8zjX0yEsN1y0GlNp6yca3buO27q+twPib1uuWhEWoGEIunpSzYudQ20Twzs/uKraNj6N875MwE1VdYMQm5YP3gPYFj3c/NoBsMWFiKHZO66zUt7Wdka1NnV2h3C9GhGcTEQrgpgz/h3VnLRdF4D7yMd3k922FXSn17bK8jgeTc0ZGt90GJWIA6S1uJx7o5Q85KGjSz/SO+xMa/WYbtP6KBGao6oOZr0drHVhi03cUlz+hALIiTIGDc5VP2ALqqDP5Tt7p/WzzKrnA1L9wg5ilW59WGe5L/7GrTMnuxFWeKEdVqlxaJ7QvfS2PcobtKgM6gIg1kp1tB22Ni38uT3K2aHufeLdcAKDxds9e98mbAevEgpqtejw4KZq4m4pzgWZ5F1rEbGmx+o2jOx1KrRcoT4Q5/oFqkxg3rE37ONR9bkik7nFOgR1zRbgXK/9K0htvZZgHEYLJOlQBpNAbXHPqL6W8u0VR3lZYlvE1q9Mc4rttq3nYlHVPACNSAKw/vV/wH8BVtbCQYmYM2EOgS80vDpHWYNy61rUTVP/dyL+BwudtHVhVmwyAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/461871/2%E9%80%89%E9%9B%86%E7%AD%89%E5%8A%9F%E8%83%BD%E8%8F%9C%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/461871/2%E9%80%89%E9%9B%86%E7%AD%89%E5%8A%9F%E8%83%BD%E8%8F%9C%E5%8D%95.meta.js
// ==/UserScript==

// setTimeout(() => {

// if(new RegExp("www.88mv.tv/vod-play-id-217022-src-1-num-1.html").test(window.location.href) || new RegExp("y.fun/v_play/bXZfMzYwOC1ubV8y.html").test(window.location.href) || new RegExp("v_play/bXZfOTE0OC1ubV8x.html").test(window.location.href) ||  new RegExp("play/107601-3-1.html").test(window.location.href) ){

//   document.getElementsByClassName("area_title")[0].innerHTML = document.getElementsByTagName("iframe")[1].offsetWidth + ' '+ document.documentElement.style.fontSize.split("px")[0]
// }

// }, 10000);

console.log(window.location.href, 667788);



// if(new RegExp("sun").test(window.location.href)){

// history.pushState(null, null, location.href);

// window.onpopstate = function () {
//     history.go(1);
// };

// throw new Error("结束");
// }





// if(window.location.href == "https://www.bdys10.com/guoju/play/23749-0.htm"){
//   alert(window.navigator.platform.toLowerCase())
// }

if (
  new RegExp("bdys10").test(window.location.href) ||
  new RegExp("gaze.run").test(window.location.href)
) {
  let div = document.createElement("div");
  div.classList.add("box-l");

  setTimeout(() => {
    document.body.appendChild(div);
  }, 400);

  GM_addStyle(
    ".box-l{position:absolute; width:100vw;height:100vh;background:red; top:0; z-index:9999999; opacity:0}"
  );
  setTimeout(() => {
    if (document.getElementsByClassName("box-l")[0]) {
      document.getElementsByClassName("box-l")[0].click();
    }
  }, 650);

  setTimeout(() => {
    let div = document.createElement("div");
    div.classList.add("box-l");
    document.body.appendChild(div);

    if (document.getElementsByClassName("box-l")[0]) {
      document.getElementsByClassName("box-l")[0].click();
    }
  }, 2200);
}

if (new RegExp("001.2000").test(window.location.href)) {


  let clickTimes = 0;

  document.documentElement.onkeyup = function (e) {
    // 回车提交表单

    var theEvent = window.event || e;
    var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
    console.log(clickTimes);

    if (code == 37) {
      switch (clickTimes) {
        case 0:
          clickTimes = 1;

          break;
        case 1:
          clickTimes = 2;

          break;
        case 2:
          clickTimes = 3;

          break;
        case 3:
          clickTimes = 4;

          break;
        case 4:
          clickTimes = 5;

          break;
        case 5:
          clickTimes = 6;

          break;
        case 6:
          clickTimes = 7;

          break;
        case 7:
          clickTimes = 8;

          break;

        default:
          break;
      }

      if (clickTimes == 8) {
        window.location.href = "http://sun.20001027.com/";
      }
    } else {
      clickTimes = 0;
    }
  };
} else {

  //记录最新集数的播放进度
  if (window.location.origin == "https://ugchwy.gtimg.com") {
    window.onbeforeunload = function () {
      let currentSetTime = {
        set: window.location.href,
        time: document.getElementsByTagName("video")[0].currentTime,
      };
      localStorage.setItem("currentSetTime", JSON.stringify(currentSetTime));

      return false;
    };
  }


  //接受传来的信息并处理 适配新网站
  if (
    new RegExp("dadagui.me/static/player").test(window.location.href) ||
    new RegExp("dadagui.me/webcloud").test(window.location.href) ||
    new RegExp("cz.cz01.site:81").test(window.location.href) ||
    window.location.origin == "https://jx.aidouer.net" ||
    window.location.origin == "https://al.cos20.c-zzy.com:81" ||
    new RegExp("player.yaplayer.one").test(window.location.href) ||
    new RegExp("vip.jsjinfu.com:8443").test(window.location.href) ||
    new RegExp("zj.jsjinfu.com:8443").test(window.location.href) ||
    new RegExp("r.tvkanba.com").test(window.location.href) ||
    new RegExp("91free.vip/static/muiplayer").test(window.location.href) ||
    new RegExp(".xn--fiqs8s").test(window.location.href) ||
    new RegExp("jx1.xn--1lq90i13mxk5bolhm8k.xn--fiqs8s").test(
      window.location.href
    ) ||
    new RegExp("players.immmm.top").test(window.location.href) ||
    new RegExp("jx.huishij.com").test(window.location.href) ||
    new RegExp("sjx.quankan.app").test(window.location.href) ||
    new RegExp("hnjiexi").test(window.location.href) ||
    new RegExp("vip.zykbf").test(window.location.href) ||
    new RegExp("jx.zxdy5.top").test(window.location.href) ||
    new RegExp("jx.wolongzywcdn.com:65").test(window.location.href) ||
    new RegExp("lzplayer.tv").test(window.location.href) ||
    new RegExp("jx3.xn--1lq90i13mxk5bolhm8k.xn--fiqs8s").test(
      window.location.href
    ) ||
    new RegExp("124.222.164.107:81").test(window.location.href) ||
    new RegExp("lziplayer.com").test(window.location.href) ||
    new RegExp("vip.lz-cdn").test(window.location.href) ||
    new RegExp("47.242.56.72").test(window.location.href) ||
    new RegExp("/static/player/dplayer.html").test(window.location.href) 


  ) {
    let isMainAddEvent = false;

    let videoCurrentTimer = setInterval(() => {
      console.log(isMainAddEvent);

      if (document.getElementsByTagName("video")[0]) {
        if (
          document.getElementsByTagName("video")[0].currentTime > 0.8 &&
          isMainAddEvent == true
        ) {
          console.log("canpost");

          window.top.postMessage(
            {
              type: "canpost",
              text: 1345,
            },
            "*"
          );

          clearInterval(videoCurrentTimer);
        }
      }
    }, 300);

    let ticking = 5000;
    setTimeout(() => {
      isMainAddEvent = true;
    }, ticking);
    setInterval(() => {
      console.log(2222)
        window.top.postMessage(
          {
            type: "close",
            text: document.getElementsByTagName("video")[0].currentTime,
          },
          "*"
        );
    }, 4000);
    setTimeout(() => {
      window.addEventListener(
        "message",
        (event) => {
          console.log("接收并处理");

          //接受菜单的显隐情况
          if (event.data.type == "isMenuBlock") {
           if(event.data.text){
            document.getElementsByTagName("video")[0].parentElement.classList.add("menu-block")
           }else{
            document.getElementsByTagName("video")[0].parentElement.classList.remove("menu-block")

           }

          }

          if (event.data.type == "danmu") {
            if (new RegExp("players.immmm.top").test(window.location.href)) {
              document
                .querySelectorAll(
                  ".fsdmplayer-setting-item .fsdmplayer-toggle"
                )[4]
                .click();
            }
          }
          if (event.data.type == "isAddEvent") {
            console.log("isAddEvent");

            isMainAddEvent = true;
          }
          if (event.data.type == "setVideoTime") {
            console.log(3535);

            if (document.getElementsByTagName("video")[0].currentTime > 0.5) {
              setTimeout(() => {
                document.getElementsByTagName("video")[0].currentTime =
                  event.data.text;
              }, 300);
            }
          }
          //清空进度

          if (event.data.type == "clearVideoTime") {
            console.log(3838);

            if (document.getElementsByTagName("video")[0].currentTime > 0.5) {
              setTimeout(() => {
                document.getElementsByTagName("video")[0].currentTime = 0;
              }, 300);
            }
          }
        },
        false
      );
    }, 500);

    //清空进度 适配新网站
    if (
      new RegExp("ugchwy.gtimg").test(window.location.href) ||
      new RegExp("r.tvkanba.com").test(window.location.href) ||
      new RegExp("dadagui").test(window.location.href) ||
      new RegExp("vip.jsjinfu.com:8443").test(window.location.href) ||
      new RegExp("jx1.xn--1lq90i13mxk5bolhm8k.xn--fiqs8s").test(
        window.location.href
      ) ||
      new RegExp("players.immmm.top").test(window.location.href) ||
      new RegExp("jx.huishij.com").test(window.location.href) ||
      new RegExp("jx.wolongzywcdn.com:65").test(window.location.href) ||
      new RegExp("jx.zxdy5.top").test(window.location.href) ||
      new RegExp("hnjiexi").test(window.location.href) ||
      new RegExp("jx3.xn--1lq90i13mxk5bolhm8k.xn--fiqs8s").test(
        window.location.href
      ) ||
      new RegExp("124.222.164.107:81").test(window.location.href) ||
      new RegExp("lziplayer.com").test(window.location.href) ||
      new RegExp("vip.lz-cdn").test(window.location.href) ||
      new RegExp("/static/player/dplayer.html").test(window.location.href) 
    ) {
    } else {
      let videoSetTimeIntt = setInterval(() => {
        if (document.getElementsByTagName("video")[0]) {
          if (document.getElementsByTagName("video")[0].currentTime > 0.5) {
            console.log(9966);
            document.getElementsByTagName("video")[0].currentTime = 0;
            clearInterval(videoSetTimeIntt);
          }
        }
      }, 100);
    }
  }

  //iframe中还嵌套一层iframe的清况
  if (
    new RegExp("test3.gqyy8.com:4438/f/aliplayer").test(window.location.href) ||
    new RegExp("43.240.74.102:4433").test(window.location.href) ||
    new RegExp("jx.xmflv.com").test(window.location.href)
  ) {
    let isMainAddEvent = false;

    let videoCurrentTimer = setInterval(() => {
      console.log(isMainAddEvent);

      if (document.getElementsByTagName("video")[0]) {
        if (
          document.getElementsByTagName("video")[0].currentTime > 0.8 &&
          isMainAddEvent == true
        ) {
          console.log("canpost");

          window.top.postMessage(
            {
              type: "canpost",
              text: 1345,
            },
            "*"
          );

          clearInterval(videoCurrentTimer);
        }
      }
    }, 300);

    let ticking = 5000;
    setTimeout(() => {
      isMainAddEvent = true;
    }, ticking);
    setTimeout(() => {
      window.onbeforeunload = function () {
        window.top.postMessage(
          {
            type: "close",
            text: document.getElementsByTagName("video")[0].currentTime,
          },
          "*"
        );
      };
    }, 2000);
    setTimeout(() => {
      window.addEventListener(
        "message",
        (event) => {
          console.log("接收并处理");
          if (event.data.type == "danmu") {
            if (new RegExp("players.immmm.top").test(window.location.href)) {
              document
                .querySelectorAll(
                  ".fsdmplayer-setting-item .fsdmplayer-toggle"
                )[4]
                .click();
            }
            if(new RegExp("jx.xmflv.com").test(window.location.href)){
              document.querySelector(".player-comment-setting-icon").click()
            }
          }
          if (event.data.type == "isAddEvent") {
            console.log("isAddEvent");

            isMainAddEvent = true;
          }

          if (event.data.type == "isMenuBlock") {
            if(event.data.text){
             document.getElementsByTagName("video")[0].parentElement.classList.add("menu-block")
            }else{
             document.getElementsByTagName("video")[0].parentElement.classList.remove("menu-block")

            }

           }

          if (event.data.type == "setVideoTime") {
            console.log(3535);

            if (document.getElementsByTagName("video")[0].currentTime > 0.5) {
              setTimeout(() => {
                document.getElementsByTagName("video")[0].currentTime =
                  event.data.text;
              }, 300);
            }
          }
        },
        false
      );
    }, 500);

    //清空进度

    let videoSetTimeIntt = setInterval(() => {
      if (document.getElementsByTagName("video")[0]) {
        if (document.getElementsByTagName("video")[0].currentTime > 0.5) {
          console.log(9966);
          document.getElementsByTagName("video")[0].currentTime = 0;
          clearInterval(videoSetTimeIntt);
        }
      }
    }, 100);
  }

  //最里层(包含vide)
  if (
    (new RegExp("test3.gqyy8.com:4438").test(window.location.href) &&
    !new RegExp("f/aliplayer").test(window.location.href)) ||
     new RegExp("jx.m3u8.tv").test(window.location.href)


  ) {
    window.addEventListener(
      "message",
      (event) => {
        console.log("接收并处理");

        if (event.data.type == "isMenuBlock") {

          document
            .getElementsByTagName("iframe")[0]
            .contentWindow.postMessage(
              { type: "isMenuBlock", text: event.data.text },
              "*"
            );
        }

        if (event.data.type == "isAddEvent") {
          console.log("isAddEvent");

          isMainAddEvent = true;
        }
        if (event.data.type == "setVideoTime") {
          console.log(3535);

          document
            .getElementsByTagName("iframe")[0]
            .contentWindow.postMessage(
              { type: "setVideoTime", text: event.data.text },
              "*"
            );
        }

        if (event.data.type == "danmu") {
          if(new RegExp("jx.m3u8.tv").test(window.location.href)){
            document.getElementsByTagName("iframe")[0].contentWindow.postMessage({type:"danmu"},"*")
          }
        }
      },
      false
    );

    window.addEventListener(
      "message",
      (event) => {
        console.log("接收并处理");

        if (event.data.type == "play") {
          console.log("isAddEvent");

          isMainAddEvent = true;
        }
        if (event.data.type == "setVideoTime") {
          console.log(3535);

          document
            .getElementsByTagName("iframe")[0]
            .contentWindow.postMessage(
              { type: "setVideoTime", text: event.data.text },
              "*"
            );
        }
      },
      false
    );
    var iframeLoder = setInterval(() => {
      let iframe = document.getElementsByTagName("iframe")[0];

      if (iframe) {
        console.log("memory执行", iframe);
        setTimeout(() => {
          iframe.contentWindow.postMessage(
            { type: "isAddEvent", text: 1234 },
            "*"
          );

          console.log(2323);
        }, 3000);

        console.log("success");
        clearInterval(iframeLoder);
      }
    }, 500);
  }

  //记录播放的集数

  function ishaveVideoSetMemory(setId, setVideo, goHref, str) {
    if (new RegExp("bdys10.com/play/23687").test(window.location.href)) {
      alert(64646);
    }
    let videoArray = [];
    //取之前记录的集数
    if (JSON.parse(localStorage.getItem("videoArray"))) {
      videoArray = JSON.parse(localStorage.getItem("videoArray"));
    }

    const isExist = videoArray
      .map((item) => {
        return item.id;
      })
      .includes(setId);

    let index = videoArray
      .map((item) => {
        return item.id;
      })
      .indexOf(setId);

    const isVideoInclude = isExist
      ? videoArray[index].video.includes(setVideo)
      : false;

    let data = sessionStorage.getItem("key");
    sessionStorage.setItem("key", "isSun");

    if (isExist == true) {
      setTimeout(() => {
        if (new RegExp(str).test(setVideo)) {
          if (!isVideoInclude) {
            videoArray[index].video.push(setVideo);
          } else {
            videoArray[index].video = videoArray[index].video.filter(
              (item) => item !== setVideo
            );
            videoArray[index].video.push(setVideo);
          }
        }
      }, 3500);

      //判断是否跳转最新地址
      if (!(setVideo == videoArray[index].video.slice(-1)) && data == null) {
        window.location.href = `${goHref}${videoArray[index].video.slice(-1)}`;
      }
    } else {
      if (new RegExp(str).test(setVideo)) {
        videoArray.push({
          id: setId,
          video: [setVideo],
          time: 0,
        });
      }
    }

    if (isVideoInclude) {
      if (new RegExp("bdys10.com/play/23687").test(window.location.href)) {
        alert(64646);
      }
      if (!(setVideo == videoArray[index].video.slice(-1)[0])) {
        let clearVideoTimeInt = setInterval(() => {
          if (document.getElementsByTagName("video")[0]) {
            if (document.getElementsByTagName("video")[0].currentTime > 0.5) {
              document.getElementsByTagName("video")[0].currentTime = 0;
              clearInterval(clearVideoTimeInt);
            }
          }
        }, 500);
      } else {
        let setVideoTimeInt = setInterval(() => {
          if (document.getElementsByTagName("video")[0]) {
            console.log(6464);

            document.getElementsByTagName("video")[0].currentTime =
              videoArray[index].time;

            clearInterval(setVideoTimeInt);
          }
        }, 500);
      }
    }
    let currentIndex = videoArray
      .map((item) => {
        return item.id;
      })
      .indexOf(setId);
    console.log(index, currentIndex);

    window.onbeforeunload = function () {
      if (
        setVideo == videoArray[currentIndex].video.slice(-1) &&
        document.getElementsByTagName("video")[0].currentTime > 3
      ) {
        videoArray[currentIndex].time =
          document.getElementsByTagName("video")[0].currentTime;
      }

      localStorage.setItem("videoArray", JSON.stringify(videoArray));
    };
    localStorage.setItem("videoArray", JSON.stringify(videoArray));
    console.log(videoArray);
  }
  function noVideoSetMemory(setId, setVideo, goHref, str, num) {
    let videoArray = [];
    //取之前记录的集数
    if (JSON.parse(localStorage.getItem("videoArray"))) {
      videoArray = JSON.parse(localStorage.getItem("videoArray"));
    }

    const isExist = videoArray
      .map((item) => {
        return item.id;
      })
      .includes(setId);

    const index = videoArray
      .map((item) => {
        return item.id;
      })
      .indexOf(setId);

    const isVideoInclude = isExist
      ? videoArray[index].video.includes(setVideo)
      : false;

    let data = sessionStorage.getItem("key");
    sessionStorage.setItem("key", "isSun");

    if (isExist == true) {
      setTimeout(() => {
        if (new RegExp(str).test(setVideo)) {
          if (!isVideoInclude) {
            videoArray[index].video.push(setVideo);
          } else {
            videoArray[index].video = videoArray[index].video.filter(
              (item) => item !== setVideo
            );
            videoArray[index].video.push(setVideo);
          }
        }
      }, 1500);

      //判断是否跳转最新地址
      if (!(setVideo == videoArray[index].video.slice(-1)) && data == null) {
        console.log(`${goHref}${videoArray[index].video.slice(-1)}`, data);
        window.location.href = `${goHref}${videoArray[index].video.slice(-1)}`;
      }
    } else {
      if (new RegExp(str).test(setVideo)) {
        videoArray.push({
          id: setId,
          video: [setVideo],
          time: 0,
          lastVideo: null,
        });
      }
    }

    var iframeLoder = setInterval(() => {
      let iframe = document.getElementsByTagName("iframe")[num];
      window.addEventListener(
        "message",
        (event) => {
          if (event.data.type == "close") {
            if (index == -1) {
              videoArray[0].time = event.data.text;
              videoArray[0].lastVideo = setVideo;
            } else {
              if (
                setVideo == videoArray[index].video.slice(-1) &&
                event.data.text > 10
              ) {
                videoArray[index].time = event.data.text;
              }
              videoArray[index].lastVideo = setVideo;
            }

            localStorage.setItem("videoArray", JSON.stringify(videoArray));
          }
          if (event.data.type == "canpost") {
            if (isVideoInclude) {
              console.log(setVideo, videoArray[index].lastVideo);

              if (!(setVideo == videoArray[index].lastVideo)) {
                if (
                  window.location.origin == "https://www.qionggedy.cc" ||
                  window.location.origin == "https://m.qionggedy.cc" ||
                  window.location.origin == "https://www.dadagui.me" ||
                  window.location.origin == "https://dadagui.me" ||
                  window.location.origin == "https://www.88mv.tv" ||
                  new RegExp("555zxdy").test(window.location.href) ||
                  new RegExp("udanmu.com").test(window.location.href)
                ) {
                  return;
                }
                //清空进度请求

                setTimeout(() => {
                  console.log(3636);

                  iframe.contentWindow.postMessage(
                    { type: "clearVideoTime", text: 1234 },
                    "*"
                  );
                }, 500);
              } else {
                setTimeout(() => {
                  console.log(3737, videoArray[index].time);

                  iframe.contentWindow.postMessage(
                    { type: "setVideoTime", text: videoArray[index].time },
                    "*"
                  );
                }, 800);
              }
            }
          }


        },
        false
      );

      if (iframe) {
        console.log(iframe, 232333);

        if (new RegExp("czzy").test(window.location.href)) {
          setTimeout(() => {
            console.log("memory执行", iframe);
            setTimeout(() => {
              iframe.contentWindow.postMessage(
                { type: "isAddEvent", text: 1234 },
                "*"
              );

              console.log(2323);
            }, 3000);
            console.log("success");
          }, 2000);

          clearInterval(iframeLoder);
        } else {
          if (iframe.attachEvent) {
            iframe.attachEvent("onload", function () {
              console.log("success");

              setTimeout(() => {
                iframe.contentWindow.postMessage(
                  { type: "isAddEvent", text: 1234 },
                  "*"
                );

                console.log(2323);
              }, 3000);
            });
          } else {
            iframe.onload = function () {
              console.log("memory执行", iframe);
              setTimeout(() => {
                iframe.contentWindow.postMessage(
                  { type: "isAddEvent", text: 1234 },
                  "*"
                );

                console.log(2323);
              }, 3000);

              console.log("success");
            };
          }
          clearInterval(iframeLoder);
        }
      }
    }, 500);

    localStorage.setItem("videoArray", JSON.stringify(videoArray));
    console.log(videoArray);
  }

  function noVideoSetMemoryTwo(setId, setVideo, goHref, str, num) {
    let videoArray = [];
    //取之前记录的集数
    if (JSON.parse(localStorage.getItem("videoArray"))) {
      videoArray = JSON.parse(localStorage.getItem("videoArray"));
    }

    const isExist = videoArray
      .map((item) => {
        return item.id;
      })
      .includes(setId);

    const index = videoArray
      .map((item) => {
        return item.id;
      })
      .indexOf(setId);

    const isVideoInclude = isExist
      ? videoArray[index].video.includes(setVideo)
      : false;

    let data = sessionStorage.getItem("key");
    sessionStorage.setItem("key", "isSun");

    if (isExist == true) {
      setTimeout(() => {
        if (new RegExp(str).test(setVideo)) {
          if (!isVideoInclude) {
            videoArray[index].video.push(setVideo);
          } else {
            videoArray[index].video = videoArray[index].video.filter(
              (item) => item !== setVideo
            );
            videoArray[index].video.push(setVideo);
          }
        }
      }, 1500);

      //判断是否跳转最新地址
      if (!(setVideo == videoArray[index].video.slice(-1)) && data == null) {
        console.log(`${goHref}${videoArray[index].video.slice(-1)}`, data);
        window.location.href = `${goHref}${videoArray[index].video.slice(-1)}`;
      }
    } else {
      if (new RegExp(str).test(setVideo)) {
        videoArray.push({
          id: setId,
          video: [setVideo],
          time: 0,
          lastVideo: null,
        });
      }
    }

    var iframeLoder = setInterval(() => {
      let iframe = document.getElementsByTagName("iframe")[num];
      window.addEventListener(
        "message",
        (event) => {
          if (event.data.type == "close") {
            if (index == -1) {
              videoArray[0].time = event.data.text;
              videoArray[0].lastVideo = setVideo;
            } else {
              if (
                setVideo == videoArray[index].video.slice(-1) &&
                event.data.text > 10
              ) {
                videoArray[index].time = event.data.text;
              }
              videoArray[index].lastVideo = setVideo;
            }

            localStorage.setItem("videoArray", JSON.stringify(videoArray));
          }
          if (event.data.type == "canpost") {
            if (isVideoInclude) {
              console.log(setVideo, videoArray[index].lastVideo);

              if (!(setVideo == videoArray[index].lastVideo)) {
                if (
                  window.location.origin == "https://www.qionggedy.cc" ||
                  window.location.origin == "https://m.qionggedy.cc" ||
                  window.location.origin == "https://www.dadagui.me" ||
                  window.location.origin == "https://dadagui.me" ||
                  window.location.origin == "https://www.88mv.tv" ||
                  new RegExp("555zxdy").test(window.location.href)
                ) {
                  return;
                }
                //清空进度请求

                setTimeout(() => {
                  console.log(3636);

                  iframe.contentWindow.postMessage(
                    { type: "clearVideoTime", text: 1234 },
                    "*"
                  );
                }, 500);
              } else {
                setTimeout(() => {
                  console.log(3737, videoArray[index].time);

                  iframe.contentWindow.postMessage(
                    { type: "setVideoTime", text: videoArray[index].time },
                    "*"
                  );
                }, 800);
              }
            }
          }
        },
        false
      );

      if (iframe) {
        console.log(iframe, 232333);

        if (new RegExp("czzy").test(window.location.href)) {
          setTimeout(() => {
            console.log("memory执行", iframe);
            setTimeout(() => {
              iframe.contentWindow.postMessage(
                { type: "isAddEvent", text: 1234 },
                "*"
              );

              console.log(2323);
            }, 3000);
            console.log("success");
          }, 2000);

          clearInterval(iframeLoder);
        } else {
          if (iframe.attachEvent) {
            iframe.attachEvent("onload", function () {
              console.log("success");

              setTimeout(() => {
                iframe.contentWindow.postMessage(
                  { type: "isAddEvent", text: 1234 },
                  "*"
                );

                console.log(2323);
              }, 3000);
            });
          } else {
            iframe.onload = function () {
              console.log("memory执行", iframe);
              setTimeout(() => {
                iframe.contentWindow.postMessage(
                  { type: "isAddEvent", text: 1234 },
                  "*"
                );

                console.log(2323);
              }, 3000);

              console.log("success");
            };
          }
          clearInterval(iframeLoder);
        }
      }
    }, 500);

    localStorage.setItem("videoArray", JSON.stringify(videoArray));
    console.log(videoArray);
  }

  if (
    window.location.origin == "https://www.dadagui.me" ||
    window.location.origin == "https://dadagui.me"
  ) {
    if (!new RegExp("dadagui.me/static/player").test(window.location.href)) {
      let setId = window.location.pathname.split("/")[2].split("-")[0];
      let setVideo = window.location.pathname.split("/")[2].split("-")[2];

      let goHref = `${window.location.href.split("-")[0]}-${
        window.location.href.split("-")[1]
      }-`;
      let num = 2;
      let str = "html";
      noVideoSetMemory(setId, setVideo, goHref, str, num);
    }
  }
  if (window.location.origin == "https://dazhutizi.net") {
    let videoArray = [];

    if (JSON.parse(localStorage.getItem("videoArray"))) {
      videoArray = JSON.parse(localStorage.getItem("videoArray"));
    }

    const isExist = videoArray
      .map((item) => {
        return item.id;
      })
      .includes(window.location.pathname.split("/")[2].split("-")[0]);

    const index = videoArray
      .map((item) => {
        return item.id;
      })
      .indexOf(window.location.pathname.split("/")[2].split("-")[0]);

    if (isExist == true) {
      if (
        !videoArray[index].video.includes(
          window.location.pathname.split("/")[2].split("-")[2]
        )
      ) {
        videoArray[index].video.push(
          window.location.pathname.split("/")[2].split("-")[2]
        );
      }
      let data = sessionStorage.getItem("key");
      sessionStorage.setItem("key", "isSun");

      if (
        !(
          window.location.href.split("-")[2] ==
          videoArray[index].video.slice(-1)
        ) &&
        data == null
      ) {
        window.location.href = `${videoArray[index].video.slice(-1)}`;
      }
    } else {
      videoArray.push({
        id: window.location.pathname.split("/")[2].split("-")[0],
        video: [window.location.pathname.split("/")[2].split("-")[2]],
      });
    }

    localStorage.setItem("videoArray", JSON.stringify(videoArray));
    console.log(videoArray);
  } else if (window.location.origin == "https://www.yanaifei.tv") {
    let setId = window.location.pathname.split("/")[3].split("-")[0];
    let setVideo = window.location.pathname.split("/")[3].split("-")[2];

    let goHref = `${window.location.href.split("-")[0]}-${
      window.location.href.split("-")[1]
    }-`;
    let str = ".html";

    let num = 0;
    setTimeout(() => {
      document.getElementsByTagName("iframe")[0].remove();
      document.getElementsByTagName("iframe")[0].remove();
      document.getElementsByTagName("iframe")[0].remove();
      noVideoSetMemory(setId, setVideo, goHref, str, num);
    }, 3000);
  } else if (
    window.location.origin == "https://www.qionggedy.cc" ||
    window.location.origin == "https://m.qionggedy.cc"
  ) {
    let setId = window.location.pathname.split("/")[2].split("-")[0];
    let setVideo = window.location.pathname.split("/")[2].split("-")[1];

    let goHref = `${window.location.href.split("-")[0]}-`;
    let num = 0;
    let str = "html";

    noVideoSetMemory(setId, setVideo, goHref, str, num);
  } else if (window.location.origin == "https://www.bdys10.com") {
    setTimeout(() => {
      let setId = window.location.pathname
        .split("/")
        .slice(-1)[0]
        .split("-")[0];
      let setVideo = window.location.href.split("-")[1];

      let goHref = window.location.href.split("-")[0] + "-";
      let str = ".htm";

      ishaveVideoSetMemory(setId, setVideo, goHref, str);
    }, 2000);
  } else if (
    window.location.origin == "https://czzy.fun" ||
    window.location.origin == "https://www.czzy.fun"
  ) {
    GM_addStyle("#dplayer{display:block !important;}");

    setTimeout(() => {
      if (document.getElementsByClassName("ptit")[0]) {
        let setId =
          document.getElementsByClassName("ptit")[0].children[0].innerText;
        let setVideo = window.location.href.split("/").slice(-1)[0];

        let goHref = window.location.pathname.split("/")[1] + "/";

        let str = "html";

        if (document.getElementsByTagName("video")[0]) {
          ishaveVideoSetMemory(setId, setVideo, goHref, str);
        } else {
          let num = 0;
          console.log(setVideo, 66);

          noVideoSetMemory(setId, setVideo, goHref, str, num);
          console.log("memory执行", num);
        }
      }
    }, 2000);
  } else if (window.location.origin == "https://91free.vip") {
    let setId = window.location.pathname.split("/")[5];
    let setVideo = window.location.pathname.split("/")[9];

    let goHref = `${window.location.pathname.split("nid")[0]}nid/`;
    let num = 2;
    let str = "html";

    noVideoSetMemory(setId, setVideo, goHref, str, num);
  } else if (window.location.origin == "https://www.novipnoad.com") {
    // if(new RegExp(".html").test(window.location.href)){
    //   GM_addStyle("#player{display:block}");
    // let videoArray = [];
    // alert(document.getElementsByClassName("table-bordered")[0].innerHTML)
    // if (JSON.parse(localStorage.getItem("videoArray"))) {
    //   videoArray = JSON.parse(localStorage.getItem("videoArray"));
    // }
    // const isExist = videoArray
    // .map((item) => {
    //   return item.id;
    // })
    // .includes(window.location.pathname.split('/')[3]);
    // const index = videoArray
    // .map((item) => {
    //   return item.id;
    // })
    // .indexOf( window.location.pathname.split('/')[3]);
    // setTimeout(() => {
    //   if (isExist == true) {
    //     if (
    //       !videoArray[index].video.includes(
    //         document.getElementsByClassName("multilink-btn btn btn-sm btn-default bordercolor2hover bgcolor2hover  current-link")[0].innerText
    //       )
    //     ) {
    //       videoArray[index].video.push(
    //         document.getElementsByClassName("multilink-btn btn btn-sm btn-default bordercolor2hover bgcolor2hover  current-link")[0].innerText
    //       );
    //     }
    //     let data = sessionStorage.getItem("key");
    //     sessionStorage.setItem("key", "isSun");
    //     if (
    //       !(
    //         document.getElementsByClassName("current-link")[0].innerText == videoArray[index].video.slice(-1)
    //       ) &&
    //       data == null
    //     ) {
    //     }
    //   } else {
    //     videoArray.push({
    //       id:  window.location.pathname.split("/")[3],
    //       video: [ document.getElementsByClassName("multilink-btn btn btn-sm btn-default bordercolor2hover bgcolor2hover  current-link")[0].innerText],
    //     });
    //   }
    //   console.log(videoArray)
    //   localStorage.setItem("videoArray", JSON.stringify(videoArray));
    // }, 2500);
    // }
  } else if (window.location.origin == "https://gaze.run") {
    if (new RegExp("play").test(window.location.href)) {
      let setId = window.location.pathname.split("/")[2];
      let setVideo = window.location.pathname.split("/")[2];

      let goHref = `${window.location.pathname.split("/")[1]}/`;
      let str = "";

      ishaveVideoSetMemory(setId, setVideo, goHref, str);

      // let videoArray = [];

      // if (JSON.parse(localStorage.getItem("videoArray"))) {
      //   videoArray = JSON.parse(localStorage.getItem("videoArray"));
      // }

      // const isExist = videoArray
      //   .map((item) => {
      //     return item.id;
      //   })
      //   .includes(window.location.pathname.split("/")[2]);

      // const index = videoArray
      //   .map((item) => {
      //     return item.id;
      //   })
      //   .indexOf(window.location.pathname.split("/")[2]);

      // if (isExist == true) {
      //   if (
      //     !videoArray[index].video.includes(
      //       window.location.pathname.split("/")[2]
      //     )
      //   ) {
      //     videoArray[index].video.push(window.location.pathname.split("/")[2]);
      //   }
      //   let data = sessionStorage.getItem("key");
      //   sessionStorage.setItem("key", "isSun");

      //   if (
      //     !(
      //       window.location.pathname.split("/")[2] ==
      //       videoArray[index].video.slice(-1)
      //     ) &&
      //     data == null
      //   ) {
      //     window.location.pathname = `${
      //       window.location.pathname.split("/")[1]
      //     }/${videoArray[index].video.slice(-1)}`;
      //   }
      // } else {
      //   videoArray.push({
      //     id: window.location.pathname.split("/")[2],
      //     video: [window.location.pathname.split("/")[2]],
      //   });
      // }

      // localStorage.setItem("videoArray", JSON.stringify(videoArray));
    }
  } else if (window.location.origin == "https://www.fqfun.com") {
    let videoArray = [];

    if (JSON.parse(localStorage.getItem("videoArray"))) {
      videoArray = JSON.parse(localStorage.getItem("videoArray"));
    }

    const isExist = videoArray
      .map((item) => {
        return item.id;
      })
      .includes(window.location.pathname.split("/")[2].split("-")[0]);

    const index = videoArray
      .map((item) => {
        return item.id;
      })
      .indexOf(window.location.pathname.split("/")[2].split("-")[0]);

    if (isExist == true) {
      if (
        !videoArray[index].video.includes(
          window.location.pathname.split("/")[2].split("-")[2]
        )
      ) {
        videoArray[index].video.push(
          window.location.pathname.split("/")[2].split("-")[2]
        );
      }
      let data = sessionStorage.getItem("key");
      sessionStorage.setItem("key", "isSun");

      if (
        !(
          window.location.href.split("-")[2] ==
          videoArray[index].video.slice(-1)
        ) &&
        data == null
      ) {
        window.location.href = `${window.location.href.split("-")[0]}-${
          window.location.href.split("-")[1]
        }-${videoArray[index].video.slice(-1)}`;
      }
    } else {
      videoArray.push({
        id: window.location.pathname.split("/")[2].split("-")[0],
        video: [window.location.pathname.split("/")[2].split("-")[2]],
      });
    }

    localStorage.setItem("videoArray", JSON.stringify(videoArray));
    console.log(videoArray);
  } else if (window.location.origin == "https://www.88mv.tv") {
    let setId = window.location.pathname.split("id-")[1].split("-src")[0];
    let setVideo = window.location.pathname.split("num-")[1];

    let goHref = `${window.location.href.split("num-")[0]}num-`;
    let num = 1;
    let str = "html";
    noVideoSetMemory(setId, setVideo, goHref, str, num);
  } else if (window.location.origin == "https://www.ttzj365.com") {
    let videoArray = [];

    if (JSON.parse(localStorage.getItem("videoArray"))) {
      videoArray = JSON.parse(localStorage.getItem("videoArray"));
    }

    const isExist = videoArray
      .map((item) => {
        return item.id;
      })
      .includes(window.location.pathname.split("/")[2].split("-")[0]);

    const index = videoArray
      .map((item) => {
        return item.id;
      })
      .indexOf(window.location.pathname.split("/")[2].split("-")[0]);

    if (isExist == true) {
      if (
        !videoArray[index].video.includes(
          window.location.pathname.split("/")[3].split("-")[1]
        )
      ) {
        videoArray[index].video.push(
          window.location.pathname.split("/")[3].split("-")[1]
        );
      }
      let data = sessionStorage.getItem("key");
      sessionStorage.setItem("key", "isSun");

      if (
        !(
          window.location.href.split("-")[1] ==
          videoArray[index].video.slice(-1)
        ) &&
        data == null
      ) {
        if (new RegExp("vodplay").test(window.location.href)) {
          window.location.href = `${
            window.location.href.split("-")[0]
          }-${videoArray[index].video.slice(-1)}/`;
        }
      }
    } else {
      videoArray.push({
        id: window.location.pathname.split("/")[2].split("-")[0],
        video: [window.location.pathname.split("/")[3].split("-")[1]],
      });
    }

    localStorage.setItem("videoArray", JSON.stringify(videoArray));
    console.log(videoArray);
  } else if (window.location.origin == "https://www.3ayy.com") {
    let setId = window.location.pathname.split("/")[2].split("-")[0];
    let setVideo = window.location.pathname.split("/")[2].split("-")[2];

    let goHref = `${window.location.href.split("-")[0]}-${
      window.location.href.split("-")[1]
    }-`;
    let num = 2;
    let str = "html";
    noVideoSetMemory(setId, setVideo, goHref, str, num);
  } else if (window.location.origin == "https://libvio.top") {
    let setId = window.location.pathname.split("/")[2].split("-")[0];
    let setVideo = window.location.pathname.split("/")[2].split("-")[2];

    let goHref = `${window.location.href.split("-")[0]}-${
      window.location.href.split("-")[1]
    }-`;
    let num = 2;
    let str = "html";
    noVideoSetMemory(setId, setVideo, goHref, str, num);
  } else if (window.location.origin == "https://www.lyjxwl.com") {
    let setId = window.location.pathname.split("-")[1];
    let setVideo = window.location.pathname.split("-")[3];

    let goHref = `${window.location.href.split("-")[0]}-${
      window.location.href.split("-")[1]
    }-${window.location.href.split("-")[2]}-`;
    console.log(goHref);
    let num = 1;
    let str = "html";
    noVideoSetMemory(setId, setVideo, goHref, str, num);
  } else if (window.location.origin == "https://www.555zxdy.com") {
    let setId = window.location.pathname.split("/")[4];
    let setVideo = window.location.pathname.split("/")[8];

    let goHref = `${window.location.pathname.split("nid")[0]}nid/`;
    let num = 0;
    let str = "html";
    for (const item of document.getElementsByTagName("iframe")) {
      if (item.parentElement.id == "playleft") {
        break;
      }
      num++;
    }

    noVideoSetMemory(setId, setVideo, goHref, str, num);
  } else if (window.location.origin == "https://100fyy1.com") {
    let setId = window.location.pathname.split("/")[2];
    let setVideo = window.location.pathname.split("/")[3];

    let goHref = `${window.location.href.split(".html")[0].slice(0, -1)}`;
    let num = 0;
    let str = "html";

    noVideoSetMemoryTwo(setId, setVideo, goHref, str, num);
  } else if (window.location.origin == "http://www.udanmu.com") {

    let setId = window.location.pathname.split("/")[5];
    let setVideo = window.location.pathname.split("/")[9];

    let goHref = `${window.location.pathname.split("nid")[0]}nid/`;
    let num = 2;
    let str = "html";
    noVideoSetMemory(setId, setVideo, goHref, str, num);
  }

  var webview = window.location.host;

  let delayTime = 2600;
  if (new RegExp("smdyy1").test(window.location.href)) {
    delayTime = 4000;
  }
  var timer = setTimeout(() => {
    if (
      new RegExp("20001027").test(window.location.href) ||
      new RegExp("player.yaplayer.one").test(window.location.href) ||
      new RegExp("yanaifei.tv/static/player/prestrain").test(
        window.location.href
      ) ||
      new RegExp("player.videoplayer.buzz").test(window.location.href)
    ) {
      sessionStorage.clear();
      clearTimeout(timer);
    }

    if (new RegExp("bdys10").test(window.location.href)) {
      if (document.getElementsByClassName("box-l")[0]) {
        document.getElementsByClassName("box-l")[0].click();
      }

      if (document.getElementsByTagName("video")[0]) {
        document.getElementsByTagName("video")[0].volume = 1;
        document
          .getElementsByTagName("video")[0]
          .addEventListener("play", function () {
            //播放开始执行的函数
            console.log("开始播放");
            isPlay = true;
          });

        document
          .getElementsByTagName("video")[0]
          .addEventListener("pause", function () {
            //暂停开始执行的函数
            console.log("暂停播放");
            isPlay = false;
          });
      }

      let isMenu = false;

      let isPlay = false;
      let isFulled = false;
      let isMenuToFullScreen = false;

      window.onkeydown = () => {
        var theEvent = window.event || e;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if (document.getElementsByClassName("box-l")[0]) {
          document.getElementsByClassName("box-l")[0].click();
        }

        if (code == 40) {
          if (
            document.querySelector(".art-icon-fullscreenOff").style.display ==
            "none"
          ) {
            isFulled = false;
          } else {
            isFulled = true;
          }

          if (
            document.getElementsByClassName("menu-box")[0].style.display ==
            "none"
          ) {
            isMenu = false;
          } else {
            isMenu = true;
          }

          if (isMenu == false) {
            if (
              document.getElementsByClassName(
                "artplayer-plugin-ads-fullscreen"
              )[0]
            ) {
              document
                .getElementsByClassName("artplayer-plugin-ads-fullscreen")[0]
                .click();
              if (document.getElementsByClassName("box-l")[0]) {
                document.getElementsByClassName("box-l")[0].click();
              }
            } else {
              document
                .getElementsByClassName("art-control-fullscreen")[0]
                .click();
              if (document.getElementsByClassName("box-l")[0]) {
                document.getElementsByClassName("box-l")[0].click();
              }
            }
          }

          console.log(isFulled, isMenuToFullScreen);
        }
        if (code == 37) {
          if (
            document.querySelector(".art-icon-fullscreenOff").style.display ==
            "none"
          ) {
            isFulled = false;
          } else {
            isFulled = true;
          }

          if (
            document.getElementsByClassName("menu-box")[0].style.display ==
            "none"
          ) {
            isMenu = false;
          } else {
            isMenu = true;
          }
          if (isFulled == true && isMenu == false) {
            document.getElementsByTagName("video")[0].currentTime -= 5;
          }
        }
        if (code == 38) {
          if (
            document.querySelector(".art-icon-fullscreenOff").style.display ==
            "none"
          ) {
            isFulled = false;
          } else {
            isFulled = true;
          }

          if (isMenuToFullScreen) {
            if (
              document.getElementsByClassName(
                "artplayer-plugin-ads-fullscreen"
              )[0]
            ) {
              document
                .getElementsByClassName("artplayer-plugin-ads-fullscreen")[0]
                .click();
            } else {
              document
                .getElementsByClassName("art-control-fullscreen")[0]
                .click();
            }
            if (document.getElementsByClassName("box-l")[0]) {
              document.getElementsByClassName("box-l")[0].click();
            }
            isMenuToFullScreen = false;
          }

          if (isFulled == true) {
            setTimeout(() => {
              isMenuToFullScreen = true;

              if (
                document.getElementsByClassName(
                  "artplayer-plugin-ads-fullscreen"
                )[0]
              ) {
                document
                  .getElementsByClassName("artplayer-plugin-ads-fullscreen")[0]
                  .click();
              } else {
                document
                  .getElementsByClassName("art-control-fullscreen")[0]
                  .click();
              }
              if (document.getElementsByClassName("box-l")[0]) {
                document.getElementsByClassName("box-l")[0].click();
              }
            }, 500);
          }
        }
        if (code == 39) {
          if (
            document.querySelector(".art-icon-fullscreenOff").style.display ==
            "none"
          ) {
            isFulled = false;
          } else {
            isFulled = true;
          }

          if (
            document.getElementsByClassName("menu-box")[0].style.display ==
            "none"
          ) {
            isMenu = false;
          } else {
            isMenu = true;
          }
          if (isFulled == true && isMenu == false) {
            document.getElementsByTagName("video")[0].currentTime += 5;
          }
        }
        if (code == 13) {
          if (
            document.getElementsByClassName("menu-box")[0].style.display ==
            "none"
          ) {
            isMenu = false;
          } else {
            isMenu = true;
          }

          if (isMenu) {
            return;
          }

          if (document.getElementsByTagName("video")[0].paused) {
            document.getElementsByTagName("video")[0].play();
          } else {
            document.getElementsByTagName("video")[0].pause();
          }
        }
      };
    }

    if (new RegExp("gaze").test(window.location.href)) {
      document.onkeyup = null;

      if (document.getElementsByTagName("video")[0]) {
        document.getElementsByTagName("video")[0].volume = 1;
        document
          .getElementsByTagName("video")[0]
          .addEventListener("play", function () {
            //播放开始执行的函数
            console.log("开始播放");
            isPlay = true;
          });

        document
          .getElementsByTagName("video")[0]
          .addEventListener("pause", function () {
            //暂停开始执行的函数
            console.log("暂停播放");
            isPlay = false;
          });
      }

      let isMenu = false;

      let isPlay = false;
      let isFulled = false;
      let isMenuToFullScreen = false;

      window.onkeydown = () => {
        var theEvent = window.event || e;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;

        if (code == 40) {
          if (
            document.getElementsByTagName("video")[0].offsetWidth /
              document.documentElement.style.fontSize.split("px")[0] <
            32
          ) {
            isFulled = false;
          } else {
            isFulled = true;
          }

          if (
            document.getElementsByClassName("menu-box")[0].style.display ==
            "none"
          ) {
            isMenu = false;
          } else {
            isMenu = true;
          }

          if (isMenu == false) {
            document
              .querySelector(".vjs-fullscreen-control.vjs-control.vjs-button")
              .click();
          }

          console.log(isFulled, isMenuToFullScreen);
        }
        if (code == 37) {
          if (document.getElementsByClassName("box-l")[0]) {
            document.getElementsByClassName("box-l")[0].click();
          }
          if (
            document.getElementsByTagName("video")[0].offsetWidth /
              document.documentElement.style.fontSize.split("px")[0] <
            32
          ) {
            isFulled = false;
          } else {
            isFulled = true;
          }

          if (
            document.getElementsByClassName("menu-box")[0].style.display ==
            "none"
          ) {
            isMenu = false;
          } else {
            isMenu = true;
          }
          if (isFulled == true && isMenu == false) {
            document.getElementsByTagName("video")[0].currentTime -= 5;
          }
        }
        if (code == 38) {
          if (
            document.getElementsByTagName("video")[0].offsetWidth /
              document.documentElement.style.fontSize.split("px")[0] >
            32
          ) {
            isFulled = true;
          } else {
            isFulled = false;
          }

          if (isMenuToFullScreen) {
            document
              .querySelector(".vjs-fullscreen-control.vjs-control.vjs-button")
              .click();
            isMenuToFullScreen = false;
            return;
          }

          if (isFulled == true) {
            setTimeout(() => {
              isMenuToFullScreen = true;

              document
                .querySelector(".vjs-fullscreen-control.vjs-control.vjs-button")
                .click();

              if (document.getElementsByClassName("box-l")[0]) {
                document.getElementsByClassName("box-l")[0].click();
              }
            }, 500);
          }
        }
        if (code == 39) {
          if (document.getElementsByClassName("box-l")[0]) {
            document.getElementsByClassName("box-l")[0].click();
          }
          if (
            document.getElementsByTagName("video")[0].offsetWidth /
              document.documentElement.style.fontSize.split("px")[0] <
            32
          ) {
            isFulled = false;
          } else {
            isFulled = true;
          }

          if (
            document.getElementsByClassName("menu-box")[0].style.display ==
            "none"
          ) {
            isMenu = false;
          } else {
            isMenu = true;
          }
          if (isFulled == true && isMenu == false) {
            document.getElementsByTagName("video")[0].currentTime += 5;
          }
        }
        if (code == 13) {
          if (
            document.getElementsByClassName("menu-box")[0].style.display ==
            "none"
          ) {
            if (document.getElementsByTagName("video")[0].paused) {
              document.getElementsByTagName("video")[0].play();
              if (document.getElementsByClassName("box-l")[0]) {
                document.getElementsByClassName("box-l")[0].click();
              }
            } else {
              document.getElementsByTagName("video")[0].pause();
              if (document.getElementsByClassName("box-l")[0]) {
                document.getElementsByClassName("box-l")[0].click();
              }
            }
          }
        }
      };
    }

    if (new RegExp("czzy").test(window.location.href)) {
      if (document.getElementsByTagName("video")[0]) {
        document.getElementsByTagName("video")[0].click();
      }
    }

    document.body.onkeyup = function (e) {
      checkKeyCode(e.keyCode);
      console.log(e.keyCode);
    };

    var webview = window.location.host;

    console.log(webview, 66);

    GM_addStyle(
      ".menu-box{z-index: 99999999;position: fixed;bottom: 8%;left: 2%;width:97%;overflow-x:hidden;}"
    );
    GM_addStyle(".menu-box::-webkit-scrollbar { width: 0 !important }");
    GM_addStyle(".menu-box ul{display:flex;width: 100%;}");
    GM_addStyle(".menu-box{white-space:nowrap}");
    GM_addStyle(
      ".menu-box ul li{background: #fff;padding: 5px 10px;margin: 3px 10px;border-radius: 5px;width: 75px;text-align: center;flex-grow: 0;flex-shrink: 0}"
    );
    GM_addStyle(".menu-box .playon a {color: #e53935;}");
    GM_addStyle(".menu-box .current a {color: #e53935;}");
    GM_addStyle(".menu-box .active a {color: #e53935;}");
    GM_addStyle(".menu-box .selected {color: #e53935;}");
    GM_addStyle(".menu-box .pbplay  {color: #e53935;}");
    GM_addStyle(".menu-box .alpha  {color: #e53935;}");
    GM_addStyle(".menu-box .cur  {color: #e53935;}");
    GM_addStyle(
      ".menu-box .active, .pbplay { background-color: rgba(244, 206, 102, 1) !important;color:rgba(120, 65, 0, 1)!important; font-size: 22px;font-family: SourceHanSansCN-Bold;font-weight: 700;text-align: left; }"
    );
    GM_addStyle(".menu-box ul li a{color: #333}");
    GM_addStyle(
      ".btn-warm,.btn-gray{background-color: transparent;background:transparent;}"
    );
    GM_addStyle(".btn{padding:0}");
    GM_addStyle(
      ".tip-box{font-size: 0.45rem;position: fixed;left: 2.7%;bottom: 5%;color: white; background:rgba(0,0,0,0.5);}"
    );
    GM_addStyle(
      ".line-one>a{display:inline-block;background: #rgba(38, 38, 44, 1);line-height:1.2rem;margin: 0.06rem 0.2rem !important;border-radius: 0.09rem !important;width: 2.5rem !important; height: 1.2rem !important;text-align: center;}"
    );
    GM_addStyle(".line-one{position: fixed;bottom: 18%;}");


    if (
      new RegExp("91free").test(window.location.href) ||
      new RegExp("libvio.top").test(window.location.href)
    ) {
      GM_addStyle(
        ".tip-box{font-size: 0.45rem;position: fixed;left: 2.7%;bottom: 4%;color: white; background:rgba(0,0,0,0.5);}"
      );
    } else {
      GM_addStyle(
        ".tip-box{font-size: 0.45rem;position: fixed;left: 2.7%;bottom: 4%;color: white; background:rgba(0,0,0,0.5);}"
      );
    }

    GM_addStyle(
      ".click_item{height:0.8rem; border-radius:0 !important; background:pink!important;padding-top:0.2rem;  transform: translateY(0.5rem);line-height:0.8rem !important;}"
    );

    if (new RegExp("qionggedy").test(window.location.href)) {
      GM_addStyle(
        ".webfullscreen_style{ display: block !important;position: fixed !important;width: 100.5vw !important;height: 100.5vh !important;top: -0.25vh !important;left: -0.25vw !important;background: #000 !important;z-index: 9999999 !important;}"
      );
    } else {
      GM_addStyle(
        ".webfullscreen_style{ display: block !important;position: fixed !important;width: 100vw !important;height: 100vh !important;top: 0 !important;left: 0 !important;background: #000 !important;z-index: 9999999 !important;}"
      );
    }

    GM_addStyle(".webfullscreen_style_zindex{z-index: 9999999 !important;}");
    const urlArr = ["vplay", "vodplay", "sid", "v_play", "play"];
    if (urlArr.some((item) => new RegExp(item).test(window.location.href))) {
      // GM_addStyle("body{overflow-x: hidden;overflow-y: hidden;}");
    }
    //GM_addStyle(".menu-box>div{display:block !important}");

    // 菜单活跃序号
    let menuListIndex = 0;
    let isBusy = false;
    let next = 0;
    let params = {};
    window.addEventListener("message", function (event) {
      checkKeyCode(event.data);
    });
    if (webview == "www.jiaozi.me") {
      console.log(document.querySelector(".myui-content__list"));
      var para = document.createElement("div");
      para.classList.add("menu-box");
      para.setAttribute("id", "menu-box");
      para.style.display = "none";
      para.innerHTML = `<ul><li><a href="javascript:location.reload();">刷新</a></li><li><a href="#">下一集</a></li></li>${
        document.querySelector(".myui-content__list").innerHTML
      }</ul>`;
      document.body.appendChild(para);
      let menuListItem = document.querySelectorAll(".menu-box li");
      for (var i = 0; i < menuListItem.length; i++) {
        for (var j = 0; j < menuListItem[i].classList.length; j++) {
          if (menuListItem[i].classList[j] == "playon") {
            menuListIndex = i;
            next = i + 1;
          }
        }
      }
    }
    if (webview == "www.ylwt33.com") {
      console.log(document.querySelector(".myui-content__list"));
      var para = document.createElement("div");
      para.classList.add("menu-box");
      para.setAttribute("id", "menu-box");
      para.style.display = "none";
      para.innerHTML = `<ul><li><a href="javascript:location.reload();">刷新</a></li><li><a href="#">下一集</a></li></li>${
        document.querySelector(".myui-content__list").innerHTML
      }</ul>`;
      document.body.appendChild(para);
      let menuListItem = document.querySelectorAll(".menu-box li");
      for (var i = 0; i < menuListItem.length; i++) {
        for (var j = 0; j < menuListItem[i].classList.length; j++) {
          if (menuListItem[i].classList[j] == "active") {
            menuListIndex = i;
            next = i + 1;
          }
        }
      }
    }
    if (
      webview == "www.fantuanhd.com" ||
      webview == "www.smdyy.cc" ||
      webview == "www.wybg666.com" ||
      webview == "brovod.com" ||
      webview == "www.libvio.me"
    ) {
      var para = document.createElement("div");
      para.classList.add("menu-box");
      para.setAttribute("id", "menu-box");
      para.style.display = "none";
      para.innerHTML = `<ul><li><a href="javascript:location.reload();">刷新</a></li>${
        document.querySelector(".stui-play__list").innerHTML
      }</ul>`;
      document.body.appendChild(para);
      let menuListItem = document.querySelectorAll(".menu-box li");
      for (var i = 0; i < menuListItem.length; i++) {
        if (menuListItem[i].classList.value == "active") {
          menuListIndex = i;
          next = i + 1;
        }
      }
    }
    if (webview == "www.6080yy1.com") {
      GM_addStyle(
        ".menu-box>a{display:inline-block;background: #fff;margin: 0.06rem 0.2rem !important;border-radius: 0.09rem;width: 2.5rem; text-align: center;}"
      );
      GM_addStyle(
        ".menu-box a:not(.click_item){height: 1.2rem; line-height:1.2rem; }"
      );

      GM_addStyle(".menu-box a{color:#333; font-size:0.4rem !important}");

      var para = document.createElement("div");
      para.classList.add("menu-box");
      para.setAttribute("id", "menu-box");
      para.style.display = "none";
      para.innerHTML = `<a href="javascript:location.reload();">刷新</a><a href="#">下一集</a>${
        document.querySelector(".scroll-content").innerHTML
      }`;

      let tipBox = document.createElement("div");
      tipBox.innerHTML = "提示：再次选择当前播放集数可刷新页面";
      tipBox.classList.add("tip-box");
      para.appendChild(tipBox);
      document.body.appendChild(para);
      let menuListItem = document.querySelectorAll(".menu-box a");
      for (var i = 0; i < menuListItem.length; i++) {
        if (menuListItem[i].classList.value == "selected") {
          menuListIndex = i;
          next = i + 1;
        }
      }
    }
    if (
      webview == "www.yixuewan.com" ||
      webview == "www.voflix.com" ||
      webview == "www.xigua133.com" ||
      webview == "www.mhyyy.com" ||
      webview == "dazhutizi.net" ||
      webview == "www.yanaifei.tv"
    ) {
      if (new RegExp("yanaifei.tv/static/player").test(window.location.href)) {
        return;
      }
      GM_addStyle(
        ".menu-box>a{display:inline-block;background: #fff;margin: 0.06rem 0.2rem !important;border-radius: 0.09rem;width: 2.5rem; text-align: center;}"
      );
      GM_addStyle(
        ".menu-box a:not(.click_item){height: 1.2rem; line-height:1.2rem; }"
      );

      GM_addStyle(".menu-box a{color:#333; font-size:0.4rem !important}");

      GM_addStyle(".module-play-list-link.active{font-weight:normal}");
      var para = document.createElement("div");
      para.classList.add("menu-box");
      para.setAttribute("id", "menu-box");
      para.style.display = "none";
      para.innerHTML = `<a>回到主页</a>`;

      var aClick = document.createElement("a");
      aClick.innerHTML = "更换线路";

      para.appendChild(aClick);
      let btnLength =
        document.getElementsByClassName("swiper-wrapper")[1].children.length;

      for (let i = 0; i < btnLength; i++) {
        let clickItem = document.createElement("a");
        clickItem.innerHTML = `线路 ${i + 1}`;
        clickItem.classList.add("click_item");
        clickItem.href =
          window.location.href.split("-")[0] +
          `-${i + 1}-` +
          window.location.href.split("-")[2];
        clickItem.style.display = "none";
        para.appendChild(clickItem);
      }

      GM_addStyle(
        ".click_item{height:0.8rem; border-radius:0 !important; background:pink!important;padding-top:0.2rem;  transform: translateY(0.5rem);line-height:0.8rem !important;}"
      );

      let aDomLength =
        document.getElementsByClassName("play-tab-list")[0].children[0]
          .children[0].children.length;

      if (aDomLength > 1) {
        para.innerHTML += ``;
      }

      if (aDomLength > 100) {
        let setLength = Math.ceil(aDomLength / 50);

        for (let i = 0; i < setLength; i++) {
          const setItem = document.createElement("A");
          setItem.innerHTML = `${i * 50 + 1}-${i * 50 + 50}集`;
          setItem.classList.add("set-item");
          para.appendChild(setItem);
          console.log(setItem);

          if (
            Number(
              window.location.pathname.split("-")[2].replace(/[^0-9]/gi, "")
            ) <= Number(setItem.innerHTML.split("-")[1].split("集")[0]) &&
            Number(
              window.location.pathname.split("-")[2].replace(/[^0-9]/gi, "")
            ) >= Number(setItem.innerHTML.split("-")[0])
          ) {
            let activeNextDom = setItem.nextSibling;

            for (let i = 0; i < 50; i++) {
              let start = Number(setItem.innerHTML.split("-")[0]);
              let oldItem = document.getElementsByClassName(
                "module-list sort-list tab-list play-tab-list active"
              )[0].children[0].children[0].children[start + i - 1];

              if (oldItem == undefined) {
                continue;
              }
              let aItem = document.createElement("A");
              aItem.innerHTML = oldItem.innerHTML;

              if (
                document.querySelector(".module-play-list-content .active")
                  .innerText == oldItem.innerText
              ) {
                console.log(aItem);
                aItem.classList.add("active");
              }

              if (oldItem.href.charAt(oldItem.href.length - 1) == "/") {
                aItem.href = oldItem.href.substring(0, oldItem.href.length - 1);
              } else {
                aItem.href = oldItem.href.split;
              }
              aItem.classList.add("a-item");
              para.insertBefore(aItem, activeNextDom);
            }
          }
        }
      } else {
        let index = 0;
        for (const item of document.getElementsByClassName("play-tab-list")) {
          if (item.classList.contains("active")) {
            break;
          }
          index++;
        }
        para.innerHTML +=
          document.getElementsByClassName("module-list")[
            index
          ].firstElementChild.firstElementChild.innerHTML;
      }

      let tipBox = document.createElement("div");
      tipBox.innerHTML = "提示：再次选择当前播放集数可刷新页面";
      tipBox.classList.add("tip-box");
      para.appendChild(tipBox);

      document.body.appendChild(para);
      GM_addStyle(".playon{display:none}");

      let menuListItem = document.querySelectorAll(".menu-box a");

      for (var i = 0; i < menuListItem.length; i++) {
        menuListItem[i].classList.remove("module-play-list-link");

        for (var j = 0; j < menuListItem[i].classList.length; j++) {
          if (menuListItem[i].classList[j] == "active") {
            menuListIndex = i;
            next = i + 1;
          }
        }
      }
    }
    if (webview == "www.zjtu.cc") {
      var para = document.createElement("div");
      para.classList.add("menu-box");
      para.setAttribute("id", "menu-box");
      para.style.display = "none";
      para.innerHTML = `<ul><li><a href="javascript:location.reload();">刷新</a></li></li><li><a href="#">下一集</a></li>${
        document.querySelector(".play-tv-slide").innerHTML
      }</ul>`;
      document.body.appendChild(para);
      let menuListItem = document.querySelectorAll(".menu-box  li");
      for (var i = 0; i < menuListItem.length; i++) {
        if (menuListItem[i].classList.value == "current") {
          menuListIndex = i;
          next = i + 1;
        }
      }
    }
    if (webview == "czzy.fun" || webview == "www.czzy.fun") {
      GM_addStyle(
        ".menu-box>a{display:inline-block;background: rgba(38, 38, 44, 1);line-height:1.4rem;margin: 0.06rem 0.2rem !important;border-radius: 0.09rem !important;width: 2.5rem !important; height: 1.4rem !important;text-align: center;}"
      );

      GM_addStyle(
        ".line-one>a{display:inline-block;background: rgba(38, 38, 44, 1);line-height:1.4rem;margin: 0.06rem 0.2rem !important;border-radius: 0.09rem !important;width: 2.5rem !important; height: 1.4rem !important;text-align: center;}"
      );

      GM_addStyle(".menu-box a{color:rgba(255, 255, 255, 1); font-size:0.5rem !important}");

      GM_addStyle(".line-one{position: fixed;bottom: 19vh;}");

      GM_addStyle(".module-play-list-link.active{font-weight:normal}");
      var para = document.createElement("div");
      para.classList.add("menu-box");
      para.setAttribute("id", "menu-box");
      para.style.display = "none";


      if(document.querySelector("iframe")){
        if(new RegExp("jx.m3u8.tv").test(document.querySelector("iframe").src)){

          para.innerHTML += ` <div class="line-one"><a >回到主页</a><a >下个播放源</a> <a >弹幕</a> <a >关闭菜单</a> <a >收藏</a></div>  `;

        }

      }else{
        para.innerHTML += `<div class="line-one"><a>回到主页</a><a>下个播放源</a> <a>关闭菜单</a> <a >收藏</a></div> `;

      }



      if (document.querySelector(".juji_list") == undefined) {
        para.innerHTML += `<a href="javascript:location.reload();">刷新</a>`;
      } else {
        para.innerHTML += ``;
      }

      if (document.querySelector(".juji_list")) {
        const aDomLength = document.querySelector(".juji_list").children.length;
        if (aDomLength > 100) {
          for (let i = 0; i < Math.ceil(aDomLength / 50); i++) {
            {
              const setItem = document.createElement("A");
              setItem.innerHTML = `${i * 50 + 1}-${i * 50 + 50}集`;
              setItem.classList.add("set-item");
              para.appendChild(setItem);

              if (
                Number(
                  document
                    .querySelector(".pbplay")
                    .innerHTML.replace(/[^0-9]/gi, "")
                ) <= Number(setItem.innerHTML.split("-")[1].split("集")[0]) &&
                Number(
                  document
                    .querySelector(".pbplay")
                    .innerHTML.replace(/[^0-9]/gi, "")
                ) >= Number(setItem.innerHTML.split("-")[0])
              ) {
                let activeNextDom = setItem.nextSibling;

                for (let i = 0; i < 50; i++) {
                  let start = Number(setItem.innerHTML.split("-")[0]);
                  let oldItem =
                    document.querySelector(".juji_list").children[
                      start + i - 1
                    ];

                  if (oldItem == undefined) {
                    continue;
                  }
                  let aItem = document.createElement("A");
                  aItem.innerHTML = oldItem.innerHTML;

                  if (
                    document.querySelector(".pbplay").innerHTML ==
                    aItem.innerHTML
                  ) {
                    aItem.classList.add("pbplay");
                  }

                  if (oldItem.href.charAt(oldItem.href.length - 1) == "/") {
                    aItem.href = oldItem.href.substring(
                      0,
                      oldItem.href.length - 1
                    );
                  } else {
                    aItem.href = oldItem.href;
                  }
                  aItem.classList.add("a-item");
                  para.insertBefore(aItem, activeNextDom);
                }
              }
            }
          }
        } else {
          para.innerHTML += document.querySelector(".juji_list").innerHTML;
        }
      }

      let tipBox = document.createElement("div");
      tipBox.innerHTML = "提示：再次选择当前播放集数可刷新页面";
      tipBox.classList.add("tip-box");

      para.appendChild(tipBox);

      document.body.appendChild(para);
      let menuListItem = document.querySelectorAll(".menu-box  a");
      for (var i = 0; i < menuListItem.length; i++) {
        for (var j = 0; j < menuListItem[i].classList.length; j++) {
          if (menuListItem[i].classList[j] == "pbplay") {
            menuListIndex = i;
            next = i + 1;
          }
        }
      }
    }

    if (webview == "91free.vip") {
      GM_addStyle(
        ".menu-box>a{display:inline-block;background: #fff;line-height:1.2rem;margin: 0.06rem 0.2rem !important;border-radius: 0.09rem !important;width: 2.5rem !important; height: 1.2rem;text-align: center;}"
      );
      GM_addStyle(
        ".menu-box a{color:#333; font-size:0.4rem; border:none;vertical-align: middle;}"
      );
      GM_addStyle(".menu-box{ overflow: hidden;}");
      GM_addStyle(".module-play-list-link.active{font-weight:normal}");

      let index = 0;
      for (const item of document.getElementById("playSwiper").children[0]
        .children) {
        if (item.classList.contains("active")) {
          break;
        }
        index++;
      }

      var para = document.createElement("div");
      para.classList.add("menu-box");
      para.setAttribute("id", "menu-box");
      para.style.display = "none";
      para.innerHTML = `<a>回到主页</a>`;

      var aClick = document.createElement("a");
      aClick.innerHTML = "更换线路";

      para.appendChild(aClick);
      let btnLength =
        document.getElementsByClassName("swiper-wrapper")[1].children.length;

      for (let i = 0; i < btnLength; i++) {
        let clickItem = document.createElement("a");
        clickItem.innerHTML = `线路 ${i + 1}`;
        clickItem.classList.add("click_item");
        clickItem.href =
          document.getElementsByClassName("swiper-wrapper")[1].children[i].href;
        clickItem.style.height = "0.8rem";
        clickItem.style.display = "none";
        para.appendChild(clickItem);
      }
      para.innerHTML += document.querySelectorAll(".module-play-list-content")[
        index
      ].innerHTML;

      let tipBox = document.createElement("div");
      tipBox.innerHTML = "提示：再次选择当前播放集数可刷新页面";
      tipBox.classList.add("tip-box");

      para.appendChild(tipBox);
      document.body.appendChild(para);
      for (const element of document.querySelector(".menu-box").childNodes) {
        if (element.innerHTML) {
          element.innerHTML = element.innerText.split("（")[0];
        }
      }

      let menuListItem = document.querySelectorAll(".menu-box  a");
      for (var i = 0; i < menuListItem.length; i++) {
        for (var j = 0; j < menuListItem[i].classList.length; j++) {
          if (menuListItem[i].classList[j] == "active") {
            menuListIndex = i;
            next = i + 1;
          }
        }
      }
    }
    if (webview == "www.udanmu.com") {
      GM_addStyle(
        ".menu-box>a{display:inline-block;background: #fff;line-height:1.2rem;margin: 0.06rem 0.2rem !important;border-radius: 0.09rem !important;width: 2.5rem !important; height: 1.2rem;text-align: center;}"
      );

      GM_addStyle(
        ".menu-box a{color:#333; font-size:0.4rem; border:none;vertical-align: middle;}"
      );
      GM_addStyle(".menu-box{ overflow: hidden;}");
      GM_addStyle(".module-play-list-link.active{font-weight:normal}");

      let index = 0;
      for (const item of document.querySelectorAll(".module-list.module-player-list")) {
        if (item.classList.contains("selected")) {
          break;
        }
        index++;
      }

      var para = document.createElement("div");
      para.classList.add("menu-box");
      para.setAttribute("id", "menu-box");
      para.style.display = "none";
      let lineOne = document.createElement("div")
      lineOne.classList.add("line-one")
      lineOne.innerHTML = `<div class="line-one"><a>回到主页</a><a>下个播放源</a> <a>关闭菜单</a> <a >收藏</a></div> `;

      document.body.appendChild(lineOne)
      para.appendChild(document.querySelector(".line-one"))

      // var aClick = document.createElement("a");
      // aClick.innerHTML = "更换线路";

      // para.appendChild(aClick);
      // let btnLength =
      //   document.querySelectorAll(".module-list.module-player-list").length;

      // for (let i = 0; i < btnLength; i++) {
      //   let clickItem = document.createElement("a");
      //   clickItem.innerHTML = `线路 ${i + 1}`;
      //   clickItem.classList.add("click_item");
      //   clickItem.href =
      //   document.querySelectorAll(".module-list.module-player-list")[i].href;
      //   clickItem.style.height = "0.8rem";
      //   clickItem.style.display = "none";
      //   para.appendChild(clickItem);
      // }
      para.innerHTML += document.querySelector(".selected.module-list").children[2].firstElementChild.innerHTML;

      let tipBox = document.createElement("div");
      tipBox.innerHTML = "提示：再次选择当前播放集数可刷新页面";
      tipBox.classList.add("tip-box");

      para.appendChild(tipBox);
      document.body.appendChild(para);
      document.querySelector(".menu-box .selected").classList.add("active")
      // for (const element of document.querySelector(".menu-box").childNodes) {
      //   if (element.innerHTML) {
      //     element.innerHTML = element.innerText.split("（")[0];
      //   }
      // }

      let menuListItem = document.querySelectorAll(".menu-box  a");
      for (var i = 0; i < menuListItem.length; i++) {
        for (var j = 0; j < menuListItem[i].classList.length; j++) {
          if (menuListItem[i].classList[j] == "active") {
            menuListIndex = i;
            next = i + 1;
          }
        }
      }
    }
    if (webview == "100fyy1.com") {
      GM_addStyle(
        ".menu-box>a{display:inline-block;background: #fff;line-height:1.2rem;margin: 0.06rem 0.2rem !important;border-radius: 0.09rem !important;width: 2.5rem !important; height: 1.2rem;text-align: center;}"
      );
      GM_addStyle(
        ".menu-box a{color:#333; font-size:0.4rem; border:none;vertical-align: middle;}"
      );
      GM_addStyle(".menu-box{ overflow: hidden;}");
      GM_addStyle(".module-play-list-link.active{font-weight:normal}");
      GM_addStyle(
        ".tip-box{ bottom:2%; background: rgba(0,0,0,0) !important;}"
      );

      let index = 0;
      for (const item of document.getElementById("stab_1_71").children) {
        if (item.style.display !== "none") {
          break;
        }
        index++;
      }
      let insertDom;

      var para = document.createElement("div");
      para.classList.add("menu-box");
      para.setAttribute("id", "menu-box");
      para.style.display = "none";

      para.innerHTML = `<a>回到主页</a>`;

      var aClick = document.createElement("a");
      aClick.innerHTML = "更换线路";

      para.appendChild(aClick);
      let btnLength = document.querySelector("#play_list_34").children.length;

      let aIndex = 0;
      for (const item of document.querySelector("#stab_1_71 ").children[index]
        .children) {
        if (item.firstElementChild.classList.contains("current")) {
          break;
        }
        aIndex++;
      }

      for (let i = 0; i < btnLength / 2; i++) {
        let clickItem = document.createElement("a");
        clickItem.innerHTML = `线路 ${i + 1}`;
        clickItem.classList.add("click_item");
        if (
          document.getElementsByClassName("tabCon")[0].children[i].children[
            aIndex
          ]
        ) {
          clickItem.href =
            document.getElementsByClassName("tabCon")[0].children[i].children[
              aIndex
            ].firstElementChild.href;
        }

        clickItem.style.height = "0.8rem";
        clickItem.style.display = "none";
        para.appendChild(clickItem);
        if (i == btnLength / 2 - 1) {
          insertDom = clickItem;
        }
      }

      for (const item of document.querySelector("#stab_1_71 ").children[index]
        .children) {
        let aDom = document.createElement("a");
        aDom.innerHTML = item.firstChild.innerHTML;
        aDom.href = item.firstElementChild.href;

        if (item.firstElementChild.classList.contains("current")) {
          aDom.classList.add("active");
        }
        para.insertBefore(aDom, insertDom.nextElementSibling);
      }

      let tipBox = document.createElement("div");
      tipBox.innerHTML = "提示：再次选择当前播放集数可刷新页面";
      tipBox.classList.add("tip-box");

      para.appendChild(tipBox);
      document.body.appendChild(para);
      for (const element of document.querySelector(".menu-box").childNodes) {
        if (element.innerHTML) {
          element.innerHTML = element.innerText.split("（")[0];
        }
      }

      let menuListItem = document.querySelectorAll(".menu-box  a");
      for (var i = 0; i < menuListItem.length; i++) {
        for (var j = 0; j < menuListItem[i].classList.length; j++) {
          if (menuListItem[i].classList[j] == "active") {
            menuListIndex = i;
            next = i + 1;
          }
        }
      }
    }
    if (webview == "www.555zxdy.com") {
      GM_addStyle(
        ".menu-box>a{display:inline-block;background: #fff;line-height:1.2rem;margin: 0.06rem 0.2rem !important;border-radius: 0.09rem !important;width: 2.5rem !important; height: 1.2rem;text-align: center;}"
      );
      GM_addStyle(
        ".menu-box a{color:#333; font-size:0.4rem; border:none;vertical-align: middle;}"
      );
      GM_addStyle(".menu-box{ overflow: hidden;}");
      GM_addStyle(".module-play-list-link.active{font-weight:normal}");

      let index = 0;
      for (const item of document.getElementById("playSwiper").children[0]
        .children) {
        if (item.classList.contains("active")) {
          break;
        }
        index++;
      }

      var para = document.createElement("div");
      para.classList.add("menu-box");
      para.setAttribute("id", "menu-box");
      para.style.display = "none";
      para.innerHTML = `<a>回到主页</a>`;

      var aClick = document.createElement("a");
      aClick.innerHTML = "更换线路";

      para.appendChild(aClick);
      let btnLength =
        document.getElementsByClassName("swiper-wrapper")[1].children.length;

      for (let i = 0; i < btnLength; i++) {
        let clickItem = document.createElement("a");
        clickItem.innerHTML = `线路 ${i + 1}`;
        clickItem.classList.add("click_item");
        clickItem.href = `${window.location.href.split("sid")[0]}sid/${
          i + 1
        }/nid${window.location.href.split("sid")[1].split("nid")[1]}`;
        document.getElementsByClassName("swiper-wrapper")[1].children[i].href;
        clickItem.style.height = "0.8rem";
        clickItem.style.display = "none";
        para.appendChild(clickItem);
      }
      para.innerHTML += document.querySelectorAll(".module-play-list-content")[
        index
      ].innerHTML;

      let tipBox = document.createElement("div");
      tipBox.innerHTML = "提示：再次选择当前播放集数可刷新页面";
      tipBox.classList.add("tip-box");

      para.appendChild(tipBox);
      document.body.appendChild(para);
      for (const element of document.querySelector(".menu-box").childNodes) {
        if (element.innerHTML) {
          element.innerHTML = element.innerText.split("（")[0];
        }
      }

      let menuListItem = document.querySelectorAll(".menu-box  a");
      for (var i = 0; i < menuListItem.length; i++) {
        for (var j = 0; j < menuListItem[i].classList.length; j++) {
          if (menuListItem[i].classList[j] == "active") {
            menuListIndex = i;
            next = i + 1;
          }
        }
      }
    }

    if (webview == "libvio.top") {
      GM_addStyle(
        ".menu-box>a{display:inline-block;background: #fff;line-height:1.2rem;margin: 0.06rem 0.2rem !important;border-radius: 0.09rem !important;width: 2.5rem !important; height: 1.2rem;text-align: center;}"
      );
      GM_addStyle(
        ".menu-box a{color:#333; font-size:0.4rem; border:none;vertical-align: middle;}"
      );
      GM_addStyle(".menu-box{ overflow: hidden;}");
      GM_addStyle(".module-play-list-link.active{font-weight:normal}");

      let index = 0;
      for (const item of document.querySelectorAll(".play-item.cont")) {
        if (item.classList.contains("active")) {
          break;
        }
        index++;
      }

      var para = document.createElement("div");
      para.classList.add("menu-box");
      para.setAttribute("id", "menu-box");
      para.style.display = "none";
      para.innerHTML = `<a>回到主页</a>`;

      var aClick = document.createElement("a");
      aClick.innerHTML = "更换线路";

      para.appendChild(aClick);
      let btnLength = document.querySelector(".tab-top.play-tab.clearfix")
        .children.length;

      for (let i = 0; i < btnLength; i++) {
        let clickItem = document.createElement("a");
        clickItem.innerHTML = `线路 ${i + 1}`;
        clickItem.classList.add("click_item");
        clickItem.href = `${window.location.href.split("-")[0]}-${i + 1}-${
          window.location.href.split("-")[2]
        }`;

        clickItem.style.height = "0.8rem";
        clickItem.style.display = "none";
        para.appendChild(clickItem);
      }

      para.innerHTML += `<a>弹幕</a>`;

      for (const item of document.querySelectorAll(".stui-play__list.clearfix")[
        index
      ].children) {
        let aDom = document.createElement("a");
        aDom.innerHTML = item.firstChild.innerHTML;
        aDom.href = item.firstElementChild.href;

        if (item.classList.contains("active")) {
          aDom.classList.add("active");
        }
        para.appendChild(aDom);
      }

      let tipBox = document.createElement("div");
      tipBox.innerHTML = "提示：再次选择当前播放集数可刷新页面";
      tipBox.classList.add("tip-box");

      para.appendChild(tipBox);
      document.body.appendChild(para);

      for (const element of document.querySelector(".menu-box").childNodes) {
        if (element.innerHTML) {
          element.innerHTML = element.innerText.split("（")[0];
        }
      }

      let menuListItem = document.querySelectorAll(".menu-box  a");
      for (var i = 0; i < menuListItem.length; i++) {
        for (var j = 0; j < menuListItem[i].classList.length; j++) {
          if (menuListItem[i].classList[j] == "active") {
            menuListIndex = i;
            next = i + 1;
          }
        }
      }
    }
    if (webview == "www.lyjxwl.com") {
      GM_addStyle(
        ".menu-box>a{display:inline-block;background: #fff;line-height:1.2rem;margin: 0.06rem 0.2rem !important;border-radius: 0.09rem !important;width: 2.5rem !important; height: 1.2rem;text-align: center;}"
      );
      GM_addStyle(
        ".menu-box a{color:#333; font-size:0.4rem; border:none;vertical-align: middle;}"
      );
      GM_addStyle(".menu-box{ overflow: hidden;}");

      GM_addStyle(".module-play-list-link.active{font-weight:normal}");

      let index = 0;
      for (const item of document.querySelectorAll(".fade-in")) {
        if (!item.classList.contains("hide")) {
          break;
        }
        index++;
      }

      var para = document.createElement("div");
      para.classList.add("menu-box");
      para.setAttribute("id", "menu-box");
      para.style.display = "none";
      para.innerHTML = `<a>回到主页</a>`;

      var aClick = document.createElement("a");
      aClick.innerHTML = "更换线路";

      para.appendChild(aClick);
      let btnLength = document.querySelector("#Tab").children.length;

      let insertDom;

      for (let i = 0; i < btnLength; i++) {
        let clickItem = document.createElement("a");
        clickItem.innerHTML = `线路 ${i + 1}`;
        clickItem.classList.add("click_item");
        clickItem.href = `${window.location.href.split("-")[0]}-${
          window.location.href.split("-")[1]
        }-${i + 1}-${window.location.href.split("-")[3]}`;

        clickItem.style.height = "0.8rem";
        clickItem.style.display = "none";
        para.appendChild(clickItem);
        if (i == btnLength - 1) {
          insertDom = clickItem;
        }
      }

      for (const item of document.querySelectorAll(".fade-in")[index]
        .children) {
        let aDom = document.createElement("a");
        aDom.innerHTML = item.firstChild.innerHTML;
        aDom.href = item.firstElementChild.href;

        if (item.classList.contains("active")) {
          aDom.classList.add("active");
        }
        para.insertBefore(aDom, insertDom.nextElementSibling);
      }

      let tipBox = document.createElement("div");
      tipBox.innerHTML = "提示：再次选择当前播放集数可刷新页面";
      tipBox.classList.add("tip-box");

      para.appendChild(tipBox);
      document.body.appendChild(para);

      for (const element of document.querySelector(".menu-box").childNodes) {
        if (element.innerHTML) {
          element.innerHTML = element.innerText.split("（")[0];
        }
      }

      let menuListItem = document.querySelectorAll(".menu-box  a");
      for (var i = 0; i < menuListItem.length; i++) {
        for (var j = 0; j < menuListItem[i].classList.length; j++) {
          if (menuListItem[i].classList[j] == "active") {
            menuListIndex = i;
            next = i + 1;
          }
        }
      }
    }
    if (webview == "www.qionggedy.cc" || webview == "m.qionggedy.cc") {
      GM_addStyle(
        ".menu-box>a{display:inline-block;background: #fff;line-height:1.2rem;margin: 0.06rem 0.2rem !important;border-radius: 0.09rem !important;width: 2.5rem !important; height: 1.2rem;text-align: center;}"
      );
      GM_addStyle(
        ".menu-box a{color:#333; font-size:0.4rem; border:none;vertical-align: middle;}"
      );
      GM_addStyle(".menu-box{ overflow: hidden;}");
      GM_addStyle(".module-play-list-link.active{font-weight:normal}");

      var para = document.createElement("div");
      para.classList.add("menu-box");
      para.setAttribute("id", "menu-box");
      para.style.display = "none";
      para.innerHTML = `<a>回到主页</a>`;

      var aClick = document.createElement("a");
      aClick.innerHTML = "更换线路";

      para.appendChild(aClick);
      let btnLength = document.getElementsByClassName("expand").length;

      let insetDom;
      let index = 0;
      for (const item of document.querySelector(".album_list .current")
        .parentElement.children) {
        index++;

        if (item.classList.contains("current")) break;
      }

      for (const iten of document.querySelectorAll(".play-more-paly-btn")) {
        iten.click();
      }

      for (let i = 0; i < btnLength; i++) {
        let clickItem = document.createElement("a");
        clickItem.innerHTML = `线路 ${i + 1}`;
        clickItem.classList.add("click_item");
        clickItem.href =
          document.getElementsByClassName("album_list")[i].children[
            index
          ].firstElementChild.href;
        clickItem.style.height = "0.8rem";
        clickItem.style.display = "none";
        para.appendChild(clickItem);
        if (i == btnLength - 1) {
          insetDom = clickItem;
        }
      }
      console.log(insetDom);

      for (const item of document.querySelector(".album_list .current")
        .parentElement.children) {
        let aItem = document.createElement("a");
        aItem.href = item.firstElementChild.href;
        if (item.classList.contains("current")) {
          aItem.classList.add("active");
        }
        aItem.innerHTML = item.firstElementChild.innerHTML;
        para.insertBefore(aItem, insetDom.nextElementSibling);
      }

      let tipBox = document.createElement("div");
      tipBox.innerHTML = "提示：再次选择当前播放集数可刷新页面";
      tipBox.classList.add("tip-box");

      para.appendChild(tipBox);
      document.body.appendChild(para);
      for (const element of document.querySelector(".menu-box").childNodes) {
        if (element.innerHTML) {
          element.innerHTML = element.innerText.split("（")[0];
        }
      }

      let menuListItem = document.querySelectorAll(".menu-box  a");
      for (var i = 0; i < menuListItem.length; i++) {
        for (var j = 0; j < menuListItem[i].classList.length; j++) {
          if (menuListItem[i].classList[j] == "active") {
            menuListIndex = i;
            next = i + 1;
          }
        }
      }
    }

    if (webview == "www.ttzj365.com") {
      GM_addStyle(
        ".menu-box>a{display:inline-block;background: #fff;line-height:1.2rem;margin: 0.06rem 0.2rem !important;border-radius: 0.09rem !important;width: 2.5rem !important; height: 1.2rem;text-align: center;}"
      );
      GM_addStyle(
        ".menu-box a{color:#333; font-size:0.4rem; border:none;vertical-align: middle;}"
      );
      GM_addStyle(".menu-box{ overflow: hidden;}");
      GM_addStyle(".module-play-list-link.active{font-weight:normal}");

      var para = document.createElement("div");
      para.classList.add("menu-box");
      para.setAttribute("id", "menu-box");
      para.style.display = "none";
      para.innerHTML = `<a>回到主页</a>`;

      var aClick = document.createElement("a");
      aClick.innerHTML = "更换线路";

      para.appendChild(aClick);

      for (const item of document.querySelector(
        ".stui-content__playlist .active"
      ).parentElement.children) {
        let aDom = document.createElement("a");
        aDom.innerHTML = item.firstChild.innerHTML;
        aDom.href = item.firstElementChild.href;

        if (item.classList.contains("active")) {
          aDom.classList.add("active");
        }
        para.appendChild(aDom);
      }

      let tipBox = document.createElement("div");
      tipBox.innerHTML = "提示：再次选择当前播放集数可刷新页面";
      tipBox.classList.add("tip-box");

      para.appendChild(tipBox);

      document.body.appendChild(para);
      for (const element of document.querySelector(".menu-box").childNodes) {
        if (element.innerHTML) {
          element.innerHTML = element.innerText.split("（")[0];
        }
      }

      let menuListItem = document.querySelectorAll(".menu-box  a");
      for (var i = 0; i < menuListItem.length; i++) {
        for (var j = 0; j < menuListItem[i].classList.length; j++) {
          if (menuListItem[i].classList[j] == "active") {
            menuListIndex = i;
            next = i + 1;
          }
        }
      }
    }
    if (webview == "www.88mv.tv") {
      GM_addStyle(
        ".menu-box>a{display:inline-block;background: #fff;line-height:1.2rem;margin: 0.06rem 0.2rem !important;border-radius: 0.09rem !important;width: 2.5rem !important; height: 1.2rem;text-align: center;}"
      );
      GM_addStyle(
        ".menu-box a{color:#333; font-size:0.4rem; border:none;vertical-align: middle;}"
      );
      GM_addStyle(".menu-box{ overflow: hidden;}");
      GM_addStyle(".module-play-list-link.active{font-weight:normal}");

      let index = 0;
      for (const item of document.querySelector(".playfrom.tab8.clearfix")
        .children[0].children) {
        if (item.classList.contains("on")) {
          break;
        }
        index++;
      }

      var para = document.createElement("div");
      para.classList.add("menu-box");
      para.setAttribute("id", "menu-box");
      para.style.display = "none";
      para.innerHTML = `<a>回到主页</a>`;

      var aClick = document.createElement("a");
      aClick.innerHTML += "更换线路";

      para.appendChild(aClick);
      let btnLength = document.querySelector(".playfrom.tab8.clearfix")
        .children[0].children.length;

      for (let i = 0; i < btnLength; i++) {
        let clickItem = document.createElement("a");
        clickItem.innerHTML = `线路 ${i + 1}`;
        clickItem.classList.add("click_item");
        clickItem.href = `${window.location.pathname.split("src-")[0]}src-${
          i + 1
        }-num${window.location.pathname.split("src-")[1].split("-num")[1]}`;
        clickItem.style.height = "0.8rem";
        clickItem.style.display = "none";
        para.appendChild(clickItem);
      }

      for (const item of document.querySelectorAll(".videourl.clearfix")[index]
        .children[0].children) {
        let aDom = document.createElement("a");
        aDom.innerHTML = item.innerHTML;
        aDom.href = item.firstElementChild.href;
        if (item.classList.contains("selected")) {
          aDom.classList.add("active");
        }
        para.appendChild(aDom);
      }
      let tipBox = document.createElement("div");
      tipBox.innerHTML = "提示：再次选择当前播放集数可刷新页面";
      tipBox.classList.add("tip-box");

      para.appendChild(tipBox);
      document.body.appendChild(para);
      for (const element of document.querySelector(".menu-box").childNodes) {
        if (element.innerHTML) {
          element.innerHTML = element.innerText.split("（")[0];
        }
      }

      let menuListItem = document.querySelectorAll(".menu-box  a");
      for (var i = 0; i < menuListItem.length; i++) {
        for (var j = 0; j < menuListItem[i].classList.length; j++) {
          if (menuListItem[i].classList[j] == "active") {
            menuListIndex = i;
            next = i + 1;
          }
        }
      }
    }

    if (webview == "www.fqfun.com") {
      GM_addStyle(
        ".menu-box>a{display:inline-block;background: #fff;line-height:1.2rem;margin: 0.06rem 0.2rem !important;border-radius: 0.09rem !important;width: 2.5rem !important; height: 1.2rem;text-align: center;}"
      );
      GM_addStyle(
        ".menu-box a{color:#333; font-size:0.4rem; border:none;vertical-align: middle;}"
      );
      GM_addStyle(".menu-box{ overflow: hidden;}");
      GM_addStyle(".module-play-list-link.active{font-weight:normal}");

      let index = 0;
      for (const item of document.querySelectorAll(".nav-tabs.pull-right")[0]
        .children) {
        if (item.classList.contains("active")) {
          break;
        }
        index++;
      }

      var para = document.createElement("div");
      para.classList.add("menu-box");
      para.setAttribute("id", "menu-box");
      para.style.display = "none";
      para.innerHTML = `<a>回到主页</a>`;

      var aClick = document.createElement("a");
      aClick.innerHTML = "更换线路";

      para.appendChild(aClick);
      let btnLength = document.getElementsByClassName(
        "nav nav-tabs  pull-right"
      )[0].children.length;

      let currentHref = document.querySelector(
        ".stui-content__playlist .active"
      ).firstElementChild.href;
      for (let i = 0; i < btnLength; i++) {
        let clickItem = document.createElement("a");
        clickItem.innerHTML = `线路 ${i + 1}`;
        clickItem.classList.add("click_item");
        clickItem.href = `${currentHref.split("-")[0]}-${i + 1}-${
          currentHref.split("-")[2]
        }`;
        clickItem.style.height = "0.8rem";
        clickItem.style.display = "none";
        para.appendChild(clickItem);
      }
      for (const item of document.getElementsByClassName(
        "stui-content__playlist clearfix column8"
      )[index].children) {
        let aItem = document.createElement("a");
        aItem.href = item.children[0].href;
        if (item.classList.contains("active")) {
          aItem.classList.add("active");
        }
        aItem.innerHTML = item.children[0].innerHTML;
        para.appendChild(aItem);
      }
      let tipBox = document.createElement("div");
      tipBox.innerHTML = "提示：再次选择当前播放集数可刷新页面";
      tipBox.classList.add("tip-box");

      para.appendChild(tipBox);
      document.body.appendChild(para);
      for (const element of document.querySelector(".menu-box").childNodes) {
        if (element.innerHTML) {
          element.innerHTML = element.innerText.split("（")[0];
        }
      }

      let menuListItem = document.querySelectorAll(".menu-box  a");
      for (var i = 0; i < menuListItem.length; i++) {
        for (var j = 0; j < menuListItem[i].classList.length; j++) {
          if (menuListItem[i].classList[j] == "active") {
            menuListIndex = i;
            next = i + 1;
          }
        }
      }
    }

    if (webview == "www.novipnoad.com") {
      GM_addStyle(
        ".menu-box>a{display:inline-block;background: #fff;line-height:1.2rem;margin: 0.06rem 0.2rem !important;border-radius: 0.09rem !important;width: 2.5rem !important; height: 1.2rem;text-align: center;}"
      );
      GM_addStyle(
        ".menu-box a{color:#333; font-size:0.4rem; border:none;vertical-align: middle;}"
      );
      GM_addStyle(".menu-box{ overflow: hidden;}");
      GM_addStyle(".module-play-list-link.active{font-weight:normal}");

      var para = document.createElement("div");
      para.classList.add("menu-box");
      para.setAttribute("id", "menu-box");
      para.style.display = "none";
      para.innerHTML = `<a class="module-play-list-link" href="javascript:location.reload();">刷新</a>`;

      if (document.getElementsByClassName("table-bordered")[0]) {
        para.innerHTML +=
          document.getElementsByClassName(
            "table-bordered"
          )[0].firstChild.firstChild.firstChild.innerHTML;
      }

      document.body.appendChild(para);

      // document.getElementsByClassName("menu-box")[0].lastChild.classList.remove("pull-right")

      for (const element of document.querySelector(".menu-box").childNodes) {
        if (element.innerHTML) {
          element.innerHTML = element.innerText.split("（")[0];
        }
      }

      let menuListItem = document.querySelectorAll(".menu-box  a");
      for (var i = 0; i < menuListItem.length; i++) {
        for (var j = 0; j < menuListItem[i].classList.length; j++) {
          if (menuListItem[i].classList[j] == "active") {
            menuListIndex = i;
            next = i + 1;
          }
        }
      }
    }
    if (webview == "gaze.run") {
      GM_addStyle(
        ".menu-box>a{display:inline-block;background: #fff;line-height:1.2rem;margin: 0.06rem 0.2rem !important;border-radius: 0.09rem !important;width: 2.5rem !important; height: 1.2rem;text-align: center;}"
      );
      GM_addStyle(
        ".menu-box a{color:#333 !important; font-size:0.4rem; border:none;vertical-align: middle;}"
      );
      GM_addStyle(".menu-box{ overflow: hidden;}");
      GM_addStyle(".module-play-list-link.active{font-weight:normal}");

      var para = document.createElement("div");
      para.classList.add("menu-box");
      para.setAttribute("id", "menu-box");
      para.style.display = "none";
      para.innerHTML = `<a>回到主页</a>  `;

      // setTimeout(() => {
      var length = document.getElementById("btngroup").children.length;

      for (let i = 0; i < length; i++) {
        const a = document.createElement("A");
        a.innerHTML = `第${i + 1}集`;
        a.classList.add("module-play-list-link");

        if (
          document
            .getElementById("btngroup")
            .children[i].children[0].classList.contains("playbtn_active")
        ) {
          a.classList.add("active");
        }

        para.appendChild(a);
      }
      document.body.appendChild(para);
      for (const element of document.querySelector(".menu-box").childNodes) {
        if (element.innerHTML) {
          element.innerHTML = element.innerText.split("（")[0];
        }
      }

      let menuListItem = document.querySelectorAll(".menu-box  a");
      for (var i = 0; i < menuListItem.length; i++) {
        for (var j = 0; j < menuListItem[i].classList.length; j++) {
          if (menuListItem[i].classList[j] == "active") {
            menuListIndex = i;
            next = i + 1;
          }
        }
      }

      // let aIndex = 0;
      // for (const item of document.getElementById("btngroup").children) {
      //   if (item.children[0].classList.contains("playbtn_active")) {
      //     para.children[aIndex + 1].classList.add("active");
      //   }
      //   aIndex++;
      // }
      // }, 2000);
    }

    if (webview == "www.3ayy.com") {
      GM_addStyle(
        ".menu-box>a{display:inline-block;background: #fff;line-height:1.2rem;margin: 0.06rem 0.2rem !important;border-radius: 0.09rem !important;width: 2.5rem !important; height: 1.2rem;text-align: center;}"
      );
      GM_addStyle(
        ".menu-box a{color:#333; font-size:0.4rem; border:none;vertical-align: middle;}"
      );
      GM_addStyle(".menu-box{ overflow: hidden;}");
      GM_addStyle(".module-play-list-link.active{font-weight:normal}");

      let index = 0;

      for (const item of document.querySelectorAll(".module-list")) {
        if (item.classList.contains("active")) {
          break;
        }
        index++;
        console.log(item);
      }

      var para = document.createElement("div");
      para.classList.add("menu-box");
      para.setAttribute("id", "menu-box");
      para.style.display = "none";
      para.innerHTML = `<a>回到主页</a><a class="module-play-list-link" >更换线路</a>`;

      let btnLength =
        document.getElementsByClassName("swiper-wrapper")[1].children.length;

      for (let i = 0; i < btnLength; i++) {
        let clickItem = document.createElement("a");
        clickItem.innerHTML = `线路 ${i + 1}`;
        clickItem.classList.add("click_item");
        clickItem.href =
          document.getElementsByClassName("swiper-wrapper")[1].children[i].href;
        clickItem.style.height = "0.8rem";
        clickItem.style.display = "none";
        para.appendChild(clickItem);
      }
      para.innerHTML += document.querySelectorAll(".module-play-list-content")[
        index
      ].innerHTML;

      let tipBox = document.createElement("div");
      tipBox.innerHTML = "提示：再次选择当前播放集数可刷新页面";
      tipBox.classList.add("tip-box");

      para.appendChild(tipBox);
      document.body.appendChild(para);
      for (const element of document.querySelector(".menu-box").childNodes) {
        if (element.innerHTML) {
          element.innerHTML = element.innerText.split("（")[0];
        }
      }

      let menuListItem = document.querySelectorAll(".menu-box  a");
      for (var i = 0; i < menuListItem.length; i++) {
        for (var j = 0; j < menuListItem[i].classList.length; j++) {
          if (menuListItem[i].classList[j] == "active") {
            menuListIndex = i;
            next = i + 1;
          }
        }
      }
    }

    if (webview == "www.smdyy1.cc") {
      GM_addStyle(
        ".menu-box>a{display:inline-block;background: #fff;line-height:1.2rem;margin: 0.06rem 0.2rem !important;border-radius: 0.09rem !important;width: 2.5rem !important; height: 1.2rem;text-align: center;}"
      );
      GM_addStyle(
        ".menu-box a{color:#333; font-size:0.4rem; border:none;vertical-align: middle;}"
      );
      GM_addStyle(".menu-box{ overflow: hidden;}");
      GM_addStyle(".module-play-list-link.active{font-weight:normal}");

      let index = 0;
      for (const item of document.getElementsByClassName("play-content")[0]
        .children) {
        if (item.classList.contains("active")) {
          break;
        }
        index++;
      }

      var para = document.createElement("div");
      para.classList.add("menu-box");
      para.setAttribute("id", "menu-box");
      para.style.display = "none";
      para.innerHTML = `<a class="module-play-list-link" >更换线路</a>`;

      let btnLength =
        document.getElementsByClassName("play-tab")[0].children.length;

      for (let i = 0; i < btnLength; i++) {
        let clickItem = document.createElement("a");
        clickItem.innerHTML = `线路 ${i + 1}`;
        clickItem.classList.add("click_item");
        clickItem.href =
          document.getElementsByClassName("play-tab")[0].children[
            i
          ].children[0].href;
        clickItem.style.height = "0.8rem";
        clickItem.style.display = "none";
        para.appendChild(clickItem);
      }

      for (const iten of document.querySelectorAll(".stui-play__list")[index]
        .children) {
        console.log(iten.className);
        if (iten.className == "active") {
          iten.children[0].classList.add("active");
        }
        para.innerHTML += iten.innerHTML;
      }

      window.addEventListener("beforeunload", () => {
        e.preventDefault();
        e.returnValue = "";
      });

      document.body.appendChild(para);
      for (const element of document.querySelector(".menu-box").childNodes) {
        if (element.innerHTML) {
          element.innerHTML = element.innerText.split("（")[0];
        }
      }

      let menuListItem = document.querySelectorAll(".menu-box  a");
      for (var i = 0; i < menuListItem.length; i++) {
        for (var j = 0; j < menuListItem[i].classList.length; j++) {
          if (menuListItem[i].classList[j] == "active") {
            menuListIndex = i;
            next = i + 1;
          }
        }
      }
    }

    if (webview == "www.bdys10.com") {
      GM_addStyle(
        ".menu-box>a{display:inline-block;background: #fff;line-height:1.2rem;margin: 0.06rem 0.2rem !important;border-radius: 0.09rem !important;width: 2.5rem !important; height: 1.2rem;text-align: center;}"
      );
      GM_addStyle(
        ".menu-box a{color:#333 !important; font-size:0.4rem; border:none;vertical-align: middle;}"
      );
      GM_addStyle(".menu-box{ overflow: hidden;}");
      GM_addStyle(".module-play-list-link.active{font-weight:normal}");

      setTimeout(() => {
        if (
          document.querySelector(".art-icon-danmu-on").style.display == "none"
        ) {
          document.querySelector(".art-icon-danmu-on").click();
        }
      }, 5000);

      var para = document.createElement("div");
      para.classList.add("menu-box");
      para.setAttribute("id", "menu-box");
      para.style.display = "none";
      if (document.querySelector(".btn-group").children.length > 1) {
        para.innerHTML = `<a>回到主页</a><a class="module-play-list-link" >更换线路</a><a class="module-play-list-link"  href="#">弹幕</a>${
          document.querySelector(".btn-group").innerHTML
        }`;
      } else {
        para.innerHTML = `<a>回到主页</a><a class="module-play-list-link" >更换线路</a><a class="module-play-list-link"  href="#">弹幕</a>${
          document.querySelector(".btn-group").innerHTML
        }`;
      }

      let tipBox = document.createElement("div");
      tipBox.innerHTML = "提示：再次选择当前播放集数可刷新页面";
      tipBox.classList.add("tip-box");

      para.appendChild(tipBox);
      document.body.appendChild(para);
      for (const element of document.querySelector(".menu-box").childNodes) {
        if (element.innerHTML) {
          element.innerHTML = element.innerText.split("（")[0];
        }
      }

      let menuListItem = document.querySelectorAll(".menu-box  a");
      for (var i = 0; i < menuListItem.length; i++) {
        for (var j = 0; j < menuListItem[i].classList.length; j++) {
          if (menuListItem[i].classList[j] == "active") {
            menuListIndex = i;
            next = i + 1;
          }
        }
      }
    }

    if (
      (webview == "www.dadagui.me" || webview == "dadagui.me") &&
      new RegExp("vodplay").test(window.location.href)
    ) {
      GM_addStyle(
        ".menu-box>a{display:inline-block;background: #fff;margin: 0.06rem 0.2rem !important;border-radius: 0.09rem;width: 2.5rem; text-align: center;}"
      );
      GM_addStyle(
        ".menu-box a:not(.click_item){height: 1.2rem; line-height:1.2rem; }"
      );

      GM_addStyle(".menu-box{overflow:hidden !important}");
      GM_addStyle(".menu-box a{color:#333; font-size:0.4rem !important}");
      GM_addStyle(".module-play-list-link.active{font-weight:normal}");
      var para = document.createElement("div");
      para.classList.add("menu-box");
      para.setAttribute("id", "menu-box");
      para.style.display = "none";
      para.innerHTML = `<a>回到主页</a>`;

      var aClick = document.createElement("a");
      aClick.innerHTML = "更换线路";

      para.appendChild(aClick);
      let btnLength = document.getElementsByClassName(
        "tab-top play-tab clearfix"
      )[0].children.length;
      if (btnLength == 4) {
        btnLength = 3;
      }
      for (let i = 0; i < btnLength; i++) {
        let clickItem = document.createElement("a");
        clickItem.innerHTML = `线路 ${i + 1}`;
        clickItem.classList.add("click_item");
        clickItem.href =
          window.location.href.split("-")[0] +
          `-${i + 1}-` +
          window.location.href.split("-")[2];
        clickItem.style.height = "0.8rem";
        clickItem.style.display = "none";
        para.appendChild(clickItem);
      }

      GM_addStyle(
        ".click_item{height:0.8rem; border-radius:0 !important; background:pink!important;padding-top:0.2rem;   transform: translateY(0.5rem);line-height:0.8rem !important;}"
      );

      if (
        document.querySelector(".stui-play__list .active").parentElement
          .children.length > 1
      ) {
      }

      const aDomLength = document.querySelector(".stui-play__list .active")
        .parentElement.children.length;

      if (aDomLength > 100) {
        for (let i = 0; i < Math.ceil(aDomLength / 50); i++) {
          const setItem = document.createElement("A");
          setItem.innerHTML = `${i * 50 + 1}-${i * 50 + 50}集`;
          setItem.classList.add("set-item");
          para.appendChild(setItem);
          console.log(555666777);

          if (
            Number(
              document
                .querySelector(".stui-play__list .active")
                .firstElementChild.innerHTML.replace(/[^0-9]/gi, "")
            ) <= Number(setItem.innerHTML.split("-")[1].split("集")[0]) &&
            Number(
              document
                .querySelector(".stui-play__list .active")
                .firstElementChild.innerHTML.replace(/[^0-9]/gi, "")
            ) >= Number(setItem.innerHTML.split("-")[0])
          ) {
            let activeNextDom = setItem.nextSibling;
            for (let i = 0; i < 50; i++) {
              let start = Number(setItem.innerHTML.split("-")[0]);
              let oldItem = document.querySelector(".stui-play__list .active")
                .parentElement.children[start + i - 1].firstElementChild;

              if (oldItem == undefined) {
                continue;
              }
              let aItem = document.createElement("A");
              aItem.innerHTML = oldItem.innerHTML;

              if (
                document.querySelector(".stui-play__list .active")
                  .firstElementChild.innerHTML == aItem.innerHTML
              ) {
                aItem.classList.add("active");
              }

              if (oldItem.href.charAt(oldItem.href.length - 1) == "/") {
                aItem.href = oldItem.href.substring(0, oldItem.href.length - 1);
              } else {
                aItem.href = oldItem.href;
              }
              aItem.classList.add("a-item");
              para.insertBefore(aItem, activeNextDom);
            }
          }
        }
        console.log(555666777);

        console.log(8889999);
      } else {
        for (let item of document.querySelector(".stui-play__list .active")
          .parentElement.children) {
          var a = document.createElement("a");
          for (var j = 0; j < item.classList.length; j++) {
            if (item.classList[j] == "active") {
              a.classList.add("active");
            }
          }

          a.innerHTML = item.innerText;
          a.href = item.firstChild.href;

          para.appendChild(a);
        }
      }

      let tipBox = document.createElement("div");
      tipBox.innerHTML = "提示：再次选择当前播放集数可刷新页面";
      tipBox.classList.add("tip-box");

      para.appendChild(tipBox);
      document.documentElement.appendChild(para);

      let menuListItem = document.querySelectorAll(".menu-box  a");
      for (var i = 0; i < menuListItem.length; i++) {
        for (var j = 0; j < menuListItem[i].classList.length; j++) {
          if (menuListItem[i].classList[j] == "active") {
            menuListIndex = i;
            next = i + 1;
          }
        }
      }
    }
    if (webview == "www.ikyy.cc") {
      var para = document.createElement("div");
      para.classList.add("menu-box");
      para.setAttribute("id", "menu-box");
      para.style.display = "none";
      para.innerHTML = `<ul><li><a href="javascript:location.reload();">刷新</a></li>${
        document.querySelector(".stui-content__playlist").innerHTML
      }</ul>`;
      document.body.appendChild(para);
      let menuListItem = document.querySelectorAll(".menu-box li");
      for (var i = 0; i < menuListItem.length; i++) {
        for (var j = 0; j < menuListItem[i].classList.length; j++) {
          if (menuListItem[i].classList[j] == "active") {
            menuListIndex = i;
            next = i + 1;
          }
        }
      }
    }
    if (webview == "www.ksksl.com") {
      var para = document.createElement("div");
      para.classList.add("menu-box");
      para.setAttribute("id", "menu-box");
      para.style.display = "none";
      para.innerHTML = `<ul><li><a href="javascript:location.reload();">刷新</a></li></li><li><a href="#">下一集</a></li>${
        document.querySelector(".play-list").innerHTML
      }</ul>`;
      document.body.appendChild(para);
      let menuListItem = document.querySelectorAll(".menu-box li");
      for (var i = 0; i < menuListItem.length; i++) {
        for (
          var j = 0;
          j < menuListItem[i].childNodes[0].classList.length;
          j++
        ) {
          if (menuListItem[i].childNodes[0].classList[j] == "alpha") {
            menuListIndex = i;
            next = i + 1;
            console.log(next, menuListItem[i]);
          }
        }
      }
    }
    if (webview == "www.kkw361.com") {
      GM_addStyle(
        ".menu-box a{background: #fff;padding: 5px 10px;margin: 3px 10px;border-radius: 5px;width: 65px;text-align: center;}.new{display:none!important;};"
      );
      var para = document.createElement("div");
      para.classList.add("menu-box");
      para.setAttribute("id", "menu-box");
      para.style.display = "none";
      para.innerHTML = `<a target="_self" href="javascript:location.reload();">刷新</a><a target="_self" href="#">下一集</a>${
        document.querySelector(".play-list").innerHTML
      }`;
      document.body.appendChild(para);
      let menuListItem = document.querySelectorAll(".menu-box a");

      for (var i = 0; i < menuListItem.length; i++) {
        menuListItem[i].getAttributeNode("target").value = "_self";
        for (var j = 0; j < menuListItem[i].classList.length; j++) {
          if (menuListItem[i].classList[j] == "cur") {
            menuListIndex = i;
            next = i + 1;
            console.log(next);
          }
        }
      }
    }
    // if (document.querySelector('iframe')) {
    //   document.querySelector('iframe').classList.add('max')
    // } else {
    //   console.log(location.href)
    // }

    document.querySelectorAll("iframe").forEach((element) => {
      element.allowfullscreen = true;
    });

    let isArrowDown = false;
    let isIframeClass = false;
    let isVideoClass = false;

    let lastIndex = 4;
    let upClickTime = 0;
    let upClickTimeToSun = 0


    function addParentClass(dom) {
      if (dom.parentElement) {
        dom.parentElement.classList.add("webfullscreen_style");
        addParentClass(dom.parentElement);
      } else {
        return;
      }
    }
    function removeParentClass(dom) {
      if (dom.parentElement) {
        dom.parentElement.classList.remove("webfullscreen_style");
        removeParentClass(dom.parentElement);
      } else {
        return;
      }
    }
    //判断菜单显隐
    function menuBlockPost(){
      if(
        new RegExp("czzy.fun").test(window.location.href) ||
        new RegExp("udanmu.com").test(window.location.href)
      ){
        let ifNum = 0
        if(new RegExp("udanmu.com").test(window.location.href)){
          ifNum = 2
        }
      if(document.getElementsByTagName("iframe")[ifNum]){
          document.getElementsByTagName("iframe")[ifNum].contentWindow.postMessage(
            {type: "isMenuBlock", text: document.querySelector(".menu-box").style.display=="block"}, "*"
          )
      }

  }
    }


    function checkKeyCode(code) {
      var doc = document.querySelector(".menu-box");
      const isFullScreen =
        document.querySelector("iframe") &&
        document.querySelector("iframe").classList.contains("max");

      if (doc.style.display == "block" && code == 38) {
        upClickTime++;
      } else {
        upClickTime = 0;
      }
      if(code!==38){
        upClickTimeToSun = 0
      }




      switch (code) {
        // 回车
        case 13: {
          if (doc.style.display == "block") {
            if (webview == "www.jiaozi.me") {
              document.querySelector(".menu-box .playon a").click();
            }
            if (
              webview == "www.fantuanhd.com" ||
              webview == "www.smdyy.cc" ||
              webview == "www.wybg666.com" ||
              webview == "brovod.com" ||
              webview == "www.libvio.me"
            ) {
              document.querySelector(".menu-box .active a").click();
            }
            if (webview == "www.6080yy1.com") {
              document.querySelector(".menu-box .selected").click();
              console.log("!!");
            }
            if (
              webview == "www.yixuewan.com" ||
              webview == "www.voflix.com" ||
              webview == "www.xigua133.com" ||
              webview == "www.mhyyy.com" ||
              webview == "dazhutizi.net" ||
              webview == "www.bdys10.com" ||
              webview == "www.dadagui.me" ||
              webview == "dadagui.me" ||
              webview == "www.yanaifei.tv"
            ) {
              document.querySelector(".menu-box .active").click();
            }
            if (webview == "www.zjtu.cc") {
              document.querySelector(".menu-box .current a").click();
            }
            if (webview == "czzy.fun" || webview == "www.czzy.fun") {
              document.querySelector(".menu-box .pbplay").click();
            }
            if (webview == "91free.vip") {
              document.querySelector(".menu-box .active").click();
            }
            if (webview == "www.udanmu.com") {
              document.querySelector(".menu-box .active").click();
            }
            if (webview == "100fyy1.com") {
              document.querySelector(".menu-box .active").click();
            }
            if (webview == "www.555zxdy.com") {
              document.querySelector(".menu-box .active").click();
            }
            if (webview == "www.lyjxwl.com") {
              document.querySelector(".menu-box .active").click();
            }
            if (webview == "libvio.top") {
              document.querySelector(".menu-box .active").click();
            }
            if (webview == "www.qionggedy.cc" || webview == "m.qionggedy.cc") {
              document.querySelector(".menu-box .active").click();
            }

            if (webview == "www.ttzj365.com") {
              document.querySelector(".menu-box .active").click();
            }
            if (webview == "www.88mv.tv") {
              document.querySelector(".menu-box .active").click();
            }
            if (webview == "www.fqfun.com") {
              document.querySelector(".menu-box .active").click();
            }

            if (webview == "www.novipnoad.com") {
              document.querySelector(".menu-box .active").click();
              if (
                !videoArray[index].video.includes(
                  document.getElementsByClassName("current-link")[0].innerText
                )
              ) {
                videoArray[index].video.push(
                  document.getElementsByClassName("current-link")[0].innerText
                );
              }
            }
            if (webview == "gaze.run") {
              document.querySelector(".menu-box .active").click();
            }
            if (webview == "www.3ayy.com") {
              document.querySelector(".menu-box .active").click();
            }
            if (webview == "www.smdyy1.cc") {
              document.querySelector(".menu-box .active").click();
            }
            if (webview == "www.ikyy.cc") {
              document.querySelector(".menu-box .active a").click();
            }
            if (webview == "www.ylwt33.com") {
              document.querySelector(".menu-box .active a").click();
            }
            if (webview == "www.ksksl.com") {
              document.querySelector(".menu-box .alpha").click();
            }
            if (webview == "www.kkw361.com") {
              document.querySelector(".menu-box .cur").click();
            }
            nextClick();
            break;
          }
          document.querySelectorAll("iframe").forEach((element) => {
            element.contentWindow.postMessage("播放", "*");
          });
          break;
        }
        // 返回
        case 8: {
          break;
        }
        // 左上右下
        case "左":
        case 37:
          if (doc.style.display == "none") {
            document.querySelectorAll("iframe").forEach((element) => {
              element.contentWindow.postMessage("全屏", "*");
            });
            break;
          }
          menuListIndex--;

          if (
            document.querySelector(".menu-box .active") &&
            new RegExp("-").test(
              document.querySelector(".menu-box .active").innerHTML
            )
          ) {
            if (
              document.querySelector(".menu-box .active").previousSibling.style
                .display == "none"
            ) {
              menuListIndex -= 50;
            }
          }

          if (
            menuListIndex == 2 &&
            document.getElementsByClassName("click_item").length == 1 &&
            document.getElementsByClassName("click_item")[0].style.display ==
              "none"
          ) {
            menuListIndex = 1;
          }
          showMenuItem();

          break;
        case "上":
        case 38: {
          upClickTimeToSun
          let i = 0;
          const urlArr = ["vplay", "vodplay", "sid", "v_play", "play", ".html"];
          if (
            urlArr.some((item) => new RegExp(item).test(window.location.href))
          ) {


            if(doc.style.display == "none"){
              const interval = setInterval(() => {
                if (i < 2) {
                  document.onkeyup = function (ev) {
                    console.log(upClickTimeToSun)
                    if (event.keyCode == 38) {
                        sessionStorage.clear();
                        window.open("https://sun.20001027.com/");
                        window.close()
                        clearInterval(interval);

                    }
                  };
                } else {
                  if (doc.style.display == "none") {
                    doc.style.display = "block";
                    showMenuItem();
                    menuBlockPost()

                    for (var item of document.querySelectorAll(".menu-box a")) {
                      if (
                        item.scrollWidth /
                          document.documentElement.style.fontSize.split("p")[0] >
                        2.5
                      ) {
                        GM_addStyle(
                          ".menu-box>a{ white-space: normal; height:1.5rem !important;line-height:0.5rem; !important;   align-items:center;display: inline-grid;  }"
                        );
                        GM_addStyle(".menu-box>a{vertical-align: bottom;}");
                      }
                    }
                  } else {

                    if (menuListIndex < document.querySelectorAll(".line-one a").length-1) {
                      doc.style.display = "none";
                    }
                    if (upClickTime == 1) {
                      if (menuListIndex > document.querySelectorAll(".line-one a").length-1) {
                        lastIndex = menuListIndex;
                      }
                      menuListIndex = 0;

                      showMenuItem();
                    }


                  }

                  document.onkeyup = null;
                  clearInterval(interval);
                }
                i++;
              }, 350);
            }else{
              if (menuListIndex < document.querySelectorAll(".line-one a").length-1) {
                  doc.style.display = "none";
              }
              if (upClickTime == 1) {
                if (menuListIndex > document.querySelectorAll(".line-one a").length-1) {
                  lastIndex = menuListIndex;
                }
                menuListIndex = 0;

                showMenuItem();
              }

            }


          }

          break;
        }
        case "右":
        case 39: {
          if (doc.style.display == "none") {
            document.querySelectorAll("iframe").forEach((element) => {
              element.contentWindow.postMessage("全屏", "*");
            });
            break;
          }
          menuListIndex++;
          if (
            menuListIndex == 2 &&
            document.getElementsByClassName("click_item").length == 1 &&
            document.getElementsByClassName("click_item")[0].style.display ==
              "none"
          ) {
            menuListIndex = 3;
          }
          if (
            document.querySelector(".menu-box .active") &&
            new RegExp("-").test(
              document.querySelector(".menu-box .active").innerHTML
            )
          ) {
            if (
              document.querySelector(".menu-box .active").nextSibling.style
                .display == "none"
            ) {
              menuListIndex += 50;
            }
          }

          showMenuItem();
          break;
        }
        case "下":
        case 40: {

          if(doc.style.display == "block"){
            menuListIndex = lastIndex;
            showMenuItem();
          }


          // location.reload()

          break;
        }
      }



        menuBlockPost()
    }

    let isHave = false;
    let isShow = false;
    let currentText;
    let oldText;
    let activeNextDom;

    function nextClick() {
      if (document.querySelector(".menu-box .pbplay")) {
        if (
          document.querySelector(".menu-box .pbplay").innerHTML == "回到主页"
        ) {
          sessionStorage.clear();
          window.open("https://sun.20001027.com/");
          window.close()

        }


        if (
          document.querySelector(".menu-box .pbplay").innerHTML == "关闭菜单"
        ) {
            document.querySelector(".menu-box").style.display = "none"

        }

        if (
          document.querySelector(".menu-box .pbplay").innerHTML == "弹幕"
        ){

        if( new RegExp("czzy.fun").test(window.location.href) ){
          document
          .getElementsByTagName("iframe")[0]
          .contentWindow.postMessage({ type: "danmu", text: 1234 }, "*");
        }
      }


      }

      if (document.querySelector(".menu-box .active")) {
        if (
          document.querySelector(".menu-box .active").innerHTML == "回到主页"
        ) {
          sessionStorage.clear();
          window.open("https://sun.20001027.com/");
          window.close()
        }

        if (
          document.querySelector(".menu-box .active").innerHTML == "关闭菜单"
        ) {

          document.querySelector(".menu-box").style.display = "none"
        }

        if (document.querySelector(".menu-box .active").innerHTML == "弹幕") {
          if (webview == "www.libvio.top" || webview == "libvio.top") {
            console.log("danmu");
            document
              .getElementsByTagName("iframe")[2]
              .contentWindow.postMessage({ type: "danmu", text: 1234 }, "*");
          }





        }
      }

      if (webview == "www.jiaozi.me") {
        if (
          document.querySelector(".menu-box .playon a").innerHTML == "下一集"
        ) {
          let select = document.querySelectorAll(".menu-box ul li");
          select[next].childNodes[0].click();
        }
      }
      if (webview == "www.ylwt33.com") {
        if (
          document.querySelector(".menu-box .active a").innerHTML == "下一集"
        ) {
          let select = document.querySelectorAll(".menu-box ul li");
          select[next].childNodes[0].click();
        }
      }
      if (webview == "www.fantuanhd.com" || webview == "www.smdyy.cc") {
        if (
          document.querySelector(".menu-box .active a").innerHTML == "下一集"
        ) {
          let select = document.querySelector(".more");
          select.childNodes[3].click();
          return;
        }
      }
      if (webview == "www.wybg666.com") {
        if (
          document.querySelector(".menu-box .active a").innerHTML == "下一集"
        ) {
          let select = document.querySelector(".more");
          select.childNodes[7].click();
          return;
        }
      }
      if (webview == "brovod.com") {
        if (
          document.querySelector(".menu-box .active a").innerHTML == "下一集"
        ) {
          let select = document.querySelector(".more");
          select.childNodes[2].click();
          return;
        }
      }
      if (webview == "www.libvio.me") {
        if (
          document.querySelector(".menu-box .active a").innerHTML == "下一集"
        ) {
          let select = document.querySelector(".more");
          select.childNodes[1].click();
          return;
        }
      }
      if (webview == "www.6080yy1.com") {
        if (
          document.querySelector(".menu-box .selected").innerHTML == "下一集"
        ) {
          document.querySelector(".video-player-handle a").click();
        }
      }

      if (
        webview == "www.yixuewan.com" ||
        webview == "dazhutizi.net" ||
        webview == "www.yanaifei.tv"
      ) {
        if (
          new RegExp("-").test(
            document.querySelector(".menu-box .active").innerHTML
          ) &&
          !document
            .querySelector(".menu-box .active")
            .classList.contains("is-have")
        ) {
          let start = Number(
            document.querySelector(".menu-box .active").innerHTML.split("-")[0]
          );

          currentText = document.querySelector(".menu-box .active").innerHTML;
          activeNextDom =
            document.querySelector(".menu-box .active").nextSibling;

          console.log(currentText, oldText);

          if (oldText == currentText) {
            if (isShow == true) {
              for (let item of document.querySelectorAll(".a-item")) {
                item.remove();
              }

              isShow = false;
            } else {
              for (let i = 0; i < 50; i++) {
                let oldItem = document.getElementsByClassName(
                  "module-list sort-list tab-list play-tab-list active"
                )[0].children[0].children[0].children[start + i - 1];

                if (oldItem == undefined) {
                  break;
                }
                let aItem = document.createElement("A");
                aItem.innerHTML = oldItem.innerHTML;
                if (oldItem.href.charAt(oldItem.href.length - 1) == "/") {
                  aItem.href = oldItem.href.substring(
                    0,
                    oldItem.href.length - 1
                  );
                } else {
                  aItem.href = oldItem.href.split;
                }
                aItem.classList.add("a-item");
                document
                  .getElementsByClassName("menu-box")[0]
                  .insertBefore(aItem, activeNextDom);
              }

              isShow = true;
            }
          } else {
            for (let i = 0; i < 50; i++) {
              let oldItem = document.getElementsByClassName(
                "module-list sort-list tab-list play-tab-list active"
              )[0].children[0].children[0].children[start + i - 1];

              if (oldItem == undefined) {
                break;
              }
              let aItem = document.createElement("A");
              aItem.innerHTML = oldItem.innerHTML;
              if (oldItem.href.charAt(oldItem.href.length - 1) == "/") {
                aItem.href = oldItem.href.substring(0, oldItem.href.length - 1);
              } else {
                aItem.href = oldItem.href.split;
              }
              aItem.classList.add("a-item");
              document
                .getElementsByClassName("menu-box")[0]
                .insertBefore(aItem, activeNextDom);
            }
            isHave = true;

            isShow = true;
          }

          oldText = document.querySelector(".menu-box .active").innerHTML;
        }

        if (document.querySelector(".menu-box .active").innerHTML == "下一集") {
          document.querySelector(".handle-btn-name a").click();
        }
        if (document.querySelector(".menu-box .active").innerHTML == "刷新") {
          let select = document.querySelectorAll(".menu-box a");
          select[next - 1].click();
        }
        if (
          document.querySelector(".menu-box .active").innerHTML == "更换线路"
        ) {
          if (
            document.getElementsByClassName("click_item")[0].style.display ==
            "none"
          ) {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "inline-block";
            }
          } else {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "none";
            }
          }
        }
        if (document.querySelector(".menu-box .active").innerHTML == "下一集") {
          document.querySelector(".handle-btn-name a").click();
        }
      }
      if (
        webview == "www.voflix.com" ||
        webview == "www.xigua133.com" ||
        webview == "www.mhyyy.com"
      ) {
        if (document.querySelector(".menu-box .active").innerHTML == "下一集") {
          let select = document.querySelectorAll(".menu-box a");
          select[next].click();
        }
      }
      if (webview == "www.zjtu.cc") {
        if (
          document.querySelector(".menu-box .current a").innerHTML == "下一集"
        ) {
          let select = document.querySelectorAll(".menu-box ul li");
          console.log(select[next]);
          select[next].childNodes[0].click();
        }
      }


      if (webview == "czzy.fun" || webview == "www.czzy.fun") {
        if (
          new RegExp("-").test(
            document.querySelector(".menu-box .pbplay").innerHTML
          ) &&
          !document
            .querySelector(".menu-box .pbplay")
            .classList.contains("is-have")
        ) {
          let start = Number(
            document.querySelector(".menu-box .pbplay").innerHTML.split("-")[0]
          );

          currentText = document.querySelector(".menu-box .pbplay").innerHTML;
          activeNextDom =
            document.querySelector(".menu-box .pbplay").nextSibling;

          console.log(currentText, oldText);

          if (oldText == currentText) {
            if (isShow == true) {
              for (let item of document.querySelectorAll(".a-item")) {
                item.remove();
              }

              isShow = false;
            } else {
              for (let i = 0; i < 50; i++) {
                let oldItem =
                  document.querySelector(".juji_list").children[start + i - 1];

                if (oldItem == undefined) {
                  break;
                }
                let aItem = document.createElement("A");
                aItem.innerHTML = oldItem.innerHTML;
                if (oldItem.href.charAt(oldItem.href.length - 1) == "/") {
                  aItem.href = oldItem.href.substring(
                    0,
                    oldItem.href.length - 1
                  );
                } else {
                  aItem.href = oldItem.href;
                }
                aItem.classList.add("a-item");
                document
                  .getElementsByClassName("menu-box")[0]
                  .insertBefore(aItem, activeNextDom);
              }

              isShow = true;
            }
          } else {
            for (let i = 0; i < 50; i++) {
              let oldItem =
                document.querySelector(".juji_list").children[start + i - 1];

              if (oldItem == undefined) {
                break;
              }
              let aItem = document.createElement("A");
              aItem.innerHTML = oldItem.innerHTML;
              if (oldItem.href.charAt(oldItem.href.length - 1) == "/") {
                aItem.href = oldItem.href.substring(0, oldItem.href.length - 1);
              } else {
                aItem.href = oldItem.href;
              }
              aItem.classList.add("a-item");
              document
                .getElementsByClassName("menu-box")[0]
                .insertBefore(aItem, activeNextDom);
            }
            isHave = true;

            isShow = true;
          }

          oldText = document.querySelector(".menu-box .pbplay").innerHTML;
        }
        if (document.querySelector(".menu-box .pbplay").innerHTML == "下一集") {
          let select = document.querySelectorAll(".menu-box a");
          select[next].click();
        }
      }
      if (webview == "czzy.fun" || webview == "www.czzy.fun") {
        if(document.querySelector(".menu-box .active")){
          if (document.querySelector(".menu-box .active").innerHTML == "下一集") {
            let select = document.querySelectorAll(".menu-box a");
            select[next].click();
          }
        }

      }

      if (webview == "www.bdys10.com") {
        if (document.querySelector(".menu-box .active").innerHTML == "下一集") {
          let select = document.querySelectorAll(".menu-box a");
          select[next].click();
        }
        if (document.querySelector(".menu-box .active").innerHTML == "刷新") {
          let select = document.querySelectorAll(".menu-box a");
          select[next - 1].click();
        }
        if (
          document.querySelector(".menu-box .active").innerHTML == "更换线路"
        ) {
          if (
            typeof document.getElementsByClassName("circuit")[0] === "object"
          ) {
            if (
              document.querySelector(".circuit").style.display == "inline-block"
            ) {
              for (
                let i = 0;
                i < document.querySelectorAll(".circuit").length;
                i++
              ) {
                document.querySelectorAll(".circuit")[i].style.display = "none";
              }
            } else {
              for (
                let i = 0;
                i < document.querySelectorAll(".circuit").length;
                i++
              ) {
                document.querySelectorAll(".circuit")[i].style.display =
                  "inline-block";
              }
            }
          } else {
            for (
              let i = 0;
              i < document.querySelectorAll(".art-selector-item").length;
              i++
            ) {
              var aDom = document.createElement("a");
              aDom.innerHTML = `线路${i + 1}`;
              aDom.classList.add("circuit");
              aDom.style.display = "inline-block";
              document
                .querySelector(".menu-box")
                .insertBefore(
                  aDom,
                  document.querySelectorAll(".menu-box a")[2 + i]
                );
            }

            GM_addStyle(".menu-box a{color:#333 !important;}");
            GM_addStyle(
              ".circuit{display:inline-block;height: 0.9rem !important;background: pink !important;line-height: 0.9rem !important; transform:translateY(0.17rem)}"
            );
          }
        }
        if (document.querySelector(".menu-box .active").innerHTML == "弹幕") {
          document.querySelector(".art-control-danmuku").click();
        }
        for (
          let i = 0;
          i < document.querySelectorAll(".art-selector-item").length;
          i++
        ) {
          if (
            document.querySelector(".menu-box .active").innerHTML ==
            `线路${i + 1}`
          ) {
            document.querySelectorAll(".art-selector-item")[i].click();
          }
        }
      }
      if (webview == "dadagui.me" || webview == "www.dadagui.me") {
        if (
          new RegExp("-").test(
            document.querySelector(".menu-box .active").innerHTML
          )
        ) {
          console.log(66633);
          let start = Number(
            document.querySelector(".menu-box .active").innerHTML.split("-")[0]
          );

          currentText = document.querySelector(".menu-box .active").innerHTML;
          activeNextDom =
            document.querySelector(".menu-box .active").nextSibling;

          if (oldText == currentText) {
            if (isShow == true) {
              for (let item of document.querySelectorAll(".a-item")) {
                item.remove();
              }

              isShow = false;
            } else {
              for (let i = 0; i < 50; i++) {
                let oldItem =
                  document.querySelector(".play-item.active").children[0]
                    .children[start + i - 1].firstElementChild;

                if (oldItem == undefined) {
                  break;
                }
                let aItem = document.createElement("A");
                aItem.innerHTML = oldItem.innerHTML;
                if (oldItem.href.charAt(oldItem.href.length - 1) == "/") {
                  aItem.href = oldItem.href.substring(
                    0,
                    oldItem.href.length - 1
                  );
                } else {
                  aItem.href = oldItem.href;
                }
                aItem.classList.add("a-item");
                document
                  .getElementsByClassName("menu-box")[0]
                  .insertBefore(aItem, activeNextDom);
              }

              isShow = true;
            }
          } else {
            for (let i = 0; i < 50; i++) {
              let oldItem =
                document.querySelector(".play-item.active").children[0]
                  .children[start + i - 1].firstElementChild;

              if (oldItem == undefined) {
                break;
              }
              let aItem = document.createElement("A");
              aItem.innerHTML = oldItem.innerHTML;
              if (oldItem.href.charAt(oldItem.href.length - 1) == "/") {
                aItem.href = oldItem.href.substring(0, oldItem.href.length - 1);
              } else {
                aItem.href = oldItem.href;
              }
              aItem.classList.add("a-item");
              document
                .getElementsByClassName("menu-box")[0]
                .insertBefore(aItem, activeNextDom);
            }
            isHave = true;

            isShow = true;
          }

          oldText = document.querySelector(".menu-box .active").innerHTML;
        }

        if (document.querySelector(".menu-box .active").innerHTML == "下一集") {
          let select = document.querySelectorAll(".menu-box a");
          select[next].click();
        }
        if (document.querySelector(".menu-box .active").innerHTML == "刷新") {
          let select = document.querySelectorAll(".menu-box a");
          select[next - 1].click();
        }
        if (
          document.querySelector(".menu-box .active").innerHTML == "更换线路"
        ) {
          if (
            document.getElementsByClassName("click_item")[0].style.display ==
            "none"
          ) {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "inline-block";
            }
          } else {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "none";
            }
          }
        }
      }

      if (webview == "91free.vip") {
        if (
          document.querySelector(".menu-box .active").innerHTML == "更换线路"
        ) {
          if (
            document.getElementsByClassName("click_item")[0].style.display ==
            "none"
          ) {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "inline-block";
            }
          } else {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "none";
            }
          }
        }
      }
      if (webview == "www.udanmu.com") {
        if (
          document.querySelector(".menu-box .active").innerHTML == "更换线路"
        ) {
          if (
            document.getElementsByClassName("click_item")[0].style.display ==
            "none"
          ) {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "inline-block";
            }
          } else {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "none";
            }
          }
        }
      }
      if (webview == "100fyy1.com") {
        if (
          document.querySelector(".menu-box .active").innerHTML == "更换线路"
        ) {
          if (
            document.getElementsByClassName("click_item")[0].style.display ==
            "none"
          ) {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "inline-block";
            }
          } else {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "none";
            }
          }
        }
      }
      if (webview == "www.555zxdy.com") {
        if (
          document.querySelector(".menu-box .active").innerHTML == "更换线路"
        ) {
          if (
            document.getElementsByClassName("click_item")[0].style.display ==
            "none"
          ) {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "inline-block";
            }
          } else {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "none";
            }
          }
        }
      }
      if (webview == "libvio.top") {
        if (
          document.querySelector(".menu-box .active").innerHTML == "更换线路"
        ) {
          if (
            document.getElementsByClassName("click_item")[0].style.display ==
            "none"
          ) {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "inline-block";
            }
          } else {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "none";
            }
          }
        }
      }
      if (webview == "www.lyjxwl.com") {
        if (
          document.querySelector(".menu-box .active").innerHTML == "更换线路"
        ) {
          if (
            document.getElementsByClassName("click_item")[0].style.display ==
            "none"
          ) {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "inline-block";
            }
          } else {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "none";
            }
          }
        }
      }
      if (webview == "www.qionggedy.cc" || webview == "m.qionggedy.cc") {
        if (document.querySelector(".menu-box .active").innerHTML == "下一集") {
          let select = document.querySelectorAll(".menu-box a");
          select[next].click();
        }
        if (
          document.querySelector(".menu-box .active").innerHTML == "更换线路"
        ) {
          if (
            document.getElementsByClassName("click_item")[0].style.display ==
            "none"
          ) {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "inline-block";
            }
          } else {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "none";
            }
          }
        }
      }
      if (webview == "www.ttzj365.com") {
        if (
          document.querySelector(".menu-box .active").innerHTML == "更换线路"
        ) {
          if (
            document.getElementsByClassName("click_item")[0].style.display ==
            "none"
          ) {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "inline-block";
            }
          } else {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "none";
            }
          }
        }
      }
      if (webview == "www.88mv.tv") {
        if (document.querySelector(".menu-box .active").innerHTML == "下一集") {
          let select = document.querySelectorAll(".menu-box a");
          select[next].click();
        }
        if (
          document.querySelector(".menu-box .active").innerHTML == "更换线路"
        ) {
          if (
            document.getElementsByClassName("click_item")[0].style.display ==
            "none"
          ) {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "inline-block";
            }
          } else {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "none";
            }
          }
        }
      }
      if (webview == "www.fqfun.com") {
        if (
          document.querySelector(".menu-box .active").innerHTML == "更换线路"
        ) {
          if (
            document.getElementsByClassName("click_item")[0].style.display ==
            "none"
          ) {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "inline-block";
            }
          } else {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "none";
            }
          }
        }
      }

      if (webview == "www.smdyy1.cc") {
        if (
          document.querySelector(".menu-box .active").innerHTML == "更换线路"
        ) {
          if (
            document.getElementsByClassName("click_item")[0].style.display ==
            "none"
          ) {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "inline-block";
            }
          } else {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "none";
            }
          }
        }
      }
      if (webview == "www.3ayy.com") {
        if (
          document.querySelector(".menu-box .active").innerHTML == "更换线路"
        ) {
          if (
            document.getElementsByClassName("click_item")[0].style.display ==
            "none"
          ) {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "inline-block";
            }
          } else {
            for (
              let i = 0;
              i < document.getElementsByClassName("click_item").length;
              i++
            ) {
              document.getElementsByClassName("click_item")[i].style.display =
                "none";
            }
          }
        }
      }

      if (webview == "gaze.run") {
        if (document.querySelector(".menu-box .active").innerHTML == "下一集") {
          let select = document.querySelectorAll(".menu-box a");
          select[next].click();
        }
        if (
          new RegExp("集").test(
            document.querySelector(".menu-box .active").innerHTML
          )
        ) {
          document.getElementsByClassName("fa-play")[menuListIndex - 1].click();
        }
      }
      if (webview == "www.novipnoad.com") {
        if (document.querySelector(".menu-box .active a").innerHTML == "弹幕") {
          document.getElementsByClassName("dplayer-toggle")[2].click();
        }
      }

      if (webview == "www.ikyy.cc") {
        if (
          document.querySelector(".menu-box .active a").innerHTML == "下一集"
        ) {
          let select = document.querySelectorAll(".menu-box ul li");
          select[next].childNodes[0].click();
        }
      }
      if (webview == "www.ksksl.com") {
        if (document.querySelector(".menu-box .alpha").innerHTML == "下一集") {
          let select = document.querySelectorAll(".menu-box ul li");
          select[next].childNodes[0].click();
        }
      }
      if (webview == "www.kkw361.com") {
        if (document.querySelector(".menu-box .cur").innerHTML == "下一集") {
          let select = document.querySelectorAll(".menu-box a");
          select[next - 2].click();
        }
      }
    }
    function showMenuItem() {
      if (webview == "www.jiaozi.me") {
        if (menuListIndex < 0) menuListIndex = 0;
        let menuListItem = document.querySelectorAll(".menu-box li");
        if (menuListIndex >= menuListItem.length) {
          menuListIndex = menuListItem.length - 1;
        }
        menuListItem.forEach((element) => {
          element.classList.remove("playon");
        });
        setTimeout(() => {
          menuListItem[menuListIndex].classList.add("playon");
        }, 0);
        var el = menuListItem[menuListIndex];
        var viewPortWidth = document.getElementById("menu-box").clientWidth;
        var offsetLeft = el.offsetLeft;
        var scrollLeft = document.getElementById("menu-box").scrollLeft;
        var intop = el.offsetWidth;
        let d =
          offsetLeft + intop > scrollLeft &&
          offsetLeft + intop < scrollLeft + viewPortWidth;
        if (d == false) {
          document.getElementById("menu-box").scrollLeft = offsetLeft;
        }
      }

      if (
        webview == "www.fantuanhd.com" ||
        webview == "www.smdyy.cc" ||
        webview == "www.wybg666.com" ||
        webview == "brovod.com" ||
        webview == "www.libvio.me"
      ) {
        if (menuListIndex < 0) menuListIndex = 0;
        let menuListItem = document.querySelectorAll(".menu-box li");
        if (menuListIndex >= menuListItem.length) {
          menuListIndex = menuListItem.length - 1;
        }
        menuListItem.forEach((element) => {
          element.classList.remove("active");
        });
        setTimeout(() => {
          menuListItem[menuListIndex].classList.add("active");
        }, 0);
        var el = menuListItem[menuListIndex];
        var viewPortWidth = document.getElementById("menu-box").clientWidth;
        var offsetLeft = el.offsetLeft;
        var scrollLeft = document.getElementById("menu-box").scrollLeft;
        var intop = el.offsetWidth;
        let d =
          offsetLeft + intop > scrollLeft &&
          offsetLeft + intop < scrollLeft + viewPortWidth;
        if (d == false) {
          document.getElementById("menu-box").scrollLeft = offsetLeft;
        }
      }
      if (webview == "www.6080yy1.com") {
        if (menuListIndex < 0) menuListIndex = 0;
        let menuListItem = document.querySelectorAll(".menu-box a");
        if (menuListIndex >= menuListItem.length) {
          menuListIndex = menuListItem.length - 1;
        }
        menuListItem.forEach((element) => {
          element.classList.remove("selected");
        });
        setTimeout(() => {
          menuListItem[menuListIndex].classList.add("selected");
        }, 0);
        var el = menuListItem[menuListIndex];
        var viewPortWidth = document.getElementById("menu-box").clientWidth;
        var offsetLeft = el.offsetLeft;
        var scrollLeft = document.getElementById("menu-box").scrollLeft;
        var intop = el.offsetWidth;
        let d =
          offsetLeft + intop > scrollLeft &&
          offsetLeft + intop < scrollLeft + viewPortWidth;
        if (d == false) {
          document.getElementById("menu-box").scrollLeft = offsetLeft;
        }
      }
      if (webview == "dadagui.me" || webview == "www.dadagui.me") {
        if (menuListIndex < 0) menuListIndex = 0;
        if (
          document.getElementsByClassName("click_item")[0] &&
          document.getElementsByClassName("click_item")[0].style.display ==
            "none"
        ) {
          let btnLength = document.getElementsByClassName("click_item").length;

          if (menuListIndex == 2) {
            menuListIndex = btnLength + 2;
          }
          if (menuListIndex == btnLength + 1) {
            menuListIndex = 1;
          }
        }
        let menuListItem = document.querySelectorAll(".menu-box a");
        if (menuListIndex >= menuListItem.length) {
          menuListIndex = menuListItem.length - 1;
        }
        menuListItem.forEach((element) => {
          element.classList.remove("active");
        });
        setTimeout(() => {
          menuListItem[menuListIndex].classList.add("active");
        }, 0);
        var el = menuListItem[menuListIndex];
        var viewPortWidth = document.getElementById("menu-box").clientWidth;
        var offsetLeft = el.offsetLeft;
        var scrollLeft = document.getElementById("menu-box").scrollLeft;
        var intop = el.offsetWidth;
        let d =
          offsetLeft + intop > scrollLeft &&
          offsetLeft + intop < scrollLeft + viewPortWidth;
        if (d == false) {
          document.getElementById("menu-box").scrollLeft = offsetLeft;
        }
      }

      if (
        webview == "www.yixuewan.com" ||
        webview == "www.voflix.com" ||
        webview == "www.xigua133.com" ||
        webview == "www.mhyyy.com" ||
        webview == "dazhutizi.net" ||
        webview == "www.bdys10.com" ||
        webview == "www.yanaifei.tv"
      ) {
        if (menuListIndex < 0) menuListIndex = 0;

        if (webview == "www.bdys10.com") {
          if (
            document.getElementsByClassName("circuit")[0] &&
            document.getElementsByClassName("circuit")[0].style.display ==
              "none"
          ) {
            let btnLength = 0;

            btnLength = document.getElementsByClassName("circuit").length;
            if (menuListIndex == 2) {
              menuListIndex = btnLength + 2;
            }
            if (menuListIndex == btnLength + 1) {
              menuListIndex = 1;
            }
          }
        }

        if (webview == "dazhutizi.net" || webview == "www.yanaifei.tv") {
          if (
            document.getElementsByClassName("click_item")[0] &&
            document.getElementsByClassName("click_item")[0].style.display ==
              "none"
          ) {
            btnLength = document.getElementsByClassName("click_item").length;
            if (menuListIndex == 2) {
              menuListIndex = btnLength + 2;
            }
            if (menuListIndex == btnLength + 1) {
              menuListIndex = 1;
            }
          }
        }

        let menuListItem = document.querySelectorAll(".menu-box a");
        if (menuListIndex >= menuListItem.length) {
          menuListIndex = menuListItem.length - 1;
        }
        menuListItem.forEach((element) => {
          element.classList.remove("active");
        });
        setTimeout(() => {
          menuListItem[menuListIndex].classList.add("active");
        }, 0);
        var el = menuListItem[menuListIndex];
        var viewPortWidth = document.getElementById("menu-box").clientWidth;
        var offsetLeft = el.offsetLeft;
        var scrollLeft = document.getElementById("menu-box").scrollLeft;
        var intop = el.offsetWidth;
        let d =
          offsetLeft + intop > scrollLeft &&
          offsetLeft + intop < scrollLeft + viewPortWidth;
        if (d == false) {
          document.getElementById("menu-box").scrollLeft = offsetLeft;
        }
      }
      if (webview == "www.zjtu.cc") {
        if (menuListIndex < 0) menuListIndex = 0;
        let menuListItem = document.querySelectorAll(".menu-box li");
        if (menuListIndex >= menuListItem.length) {
          menuListIndex = menuListItem.length - 1;
        }
        menuListItem.forEach((element) => {
          element.classList.remove("current");
        });
        setTimeout(() => {
          menuListItem[menuListIndex].classList.add("current");
        }, 0);
        var el = menuListItem[menuListIndex];
        var viewPortWidth = document.getElementById("menu-box").clientWidth;
        var offsetLeft = el.offsetLeft;
        var scrollLeft = document.getElementById("menu-box").scrollLeft;
        var intop = el.offsetWidth;
        let d =
          offsetLeft + intop > scrollLeft &&
          offsetLeft + intop < scrollLeft + viewPortWidth;
        if (d == false) {
          document.getElementById("menu-box").scrollLeft = offsetLeft;
        }
      }
      if (webview == "czzy.fun" || webview == "www.czzy.fun") {
        if (menuListIndex < 0) menuListIndex = 0;
        let menuListItem = document.querySelectorAll(".menu-box a");
        if (menuListIndex >= menuListItem.length) {
          menuListIndex = menuListItem.length - 1;
        }
        menuListItem.forEach((element) => {
          element.classList.remove("pbplay");
        });
        setTimeout(() => {
          menuListItem[menuListIndex].classList.add("pbplay");
        }, 0);
        var el = menuListItem[menuListIndex];
        var viewPortWidth = document.getElementById("menu-box").clientWidth;
        var offsetLeft = el.offsetLeft;
        var scrollLeft = document.getElementById("menu-box").scrollLeft;
        var intop = el.offsetWidth;
        let d =
          offsetLeft + intop > scrollLeft &&
          offsetLeft + intop < scrollLeft + viewPortWidth;
        if (d == false) {
          document.getElementById("menu-box").scrollLeft = offsetLeft;
        }
      }

      if (webview == "www.smdyy1.cc") {
        if (menuListIndex < 0) menuListIndex = 0;
        if (
          document.getElementsByClassName("click_item")[0] &&
          document.getElementsByClassName("click_item")[0].style.display ==
            "none"
        ) {
          btnLength = document.getElementsByClassName("click_item").length;
          if (menuListIndex == 1) {
            menuListIndex = btnLength + 1;
          }
          if (menuListIndex == btnLength) {
            menuListIndex = 0;
          }
        }
        let menuListItem = document.querySelectorAll(".menu-box a");
        if (menuListIndex >= menuListItem.length) {
          menuListIndex = menuListItem.length - 1;
        }
        menuListItem.forEach((element) => {
          element.classList.remove("active");
        });
        setTimeout(() => {
          menuListItem[menuListIndex].classList.add("active");
        }, 0);
        var el = menuListItem[menuListIndex];
        var viewPortWidth = document.getElementById("menu-box").clientWidth;
        var offsetLeft = el.offsetLeft;
        var scrollLeft = document.getElementById("menu-box").scrollLeft;
        var intop = el.offsetWidth;
        let d =
          offsetLeft + intop > scrollLeft &&
          offsetLeft + intop < scrollLeft + viewPortWidth;
        if (d == false) {
          document.getElementById("menu-box").scrollLeft = offsetLeft;
        }
      }
      if (webview == "91free.vip") {
        if (menuListIndex < 0) menuListIndex = 0;
        if (
          document.getElementsByClassName("click_item")[0] &&
          document.getElementsByClassName("click_item")[0].style.display ==
            "none"
        ) {
          btnLength = document.getElementsByClassName("click_item").length;
          if (menuListIndex == 2) {
            menuListIndex = btnLength + 2;
          }
          if (menuListIndex == btnLength + 1) {
            menuListIndex = 1;
          }
        }
        let menuListItem = document.querySelectorAll(".menu-box a");
        if (menuListIndex >= menuListItem.length) {
          menuListIndex = menuListItem.length - 1;
        }
        menuListItem.forEach((element) => {
          element.classList.remove("active");
        });
        setTimeout(() => {
          menuListItem[menuListIndex].classList.add("active");
        }, 0);
        var el = menuListItem[menuListIndex];
        var viewPortWidth = document.getElementById("menu-box").clientWidth;
        var offsetLeft = el.offsetLeft;
        var scrollLeft = document.getElementById("menu-box").scrollLeft;
        var intop = el.offsetWidth;
        let d =
          offsetLeft + intop > scrollLeft &&
          offsetLeft + intop < scrollLeft + viewPortWidth;
        if (d == false) {
          document.getElementById("menu-box").scrollLeft = offsetLeft;
        }
      }
      if (webview == "www.udanmu.com") {
        if (menuListIndex < 0) menuListIndex = 0;
        if (
          document.getElementsByClassName("click_item")[0] &&
          document.getElementsByClassName("click_item")[0].style.display ==
            "none"
        ) {
          btnLength = document.getElementsByClassName("click_item").length;
          if (menuListIndex == 2) {
            menuListIndex = btnLength + 2;
          }
          if (menuListIndex == btnLength + 1) {
            menuListIndex = 1;
          }
        }
        let menuListItem = document.querySelectorAll(".menu-box a");
        if (menuListIndex >= menuListItem.length) {
          menuListIndex = menuListItem.length - 1;
        }
        menuListItem.forEach((element) => {
          element.classList.remove("active");
        });
        setTimeout(() => {
          menuListItem[menuListIndex].classList.add("active");
        }, 0);
        var el = menuListItem[menuListIndex];
        var viewPortWidth = document.getElementById("menu-box").clientWidth;
        var offsetLeft = el.offsetLeft;
        var scrollLeft = document.getElementById("menu-box").scrollLeft;
        var intop = el.offsetWidth;
        let d =
          offsetLeft + intop > scrollLeft &&
          offsetLeft + intop < scrollLeft + viewPortWidth;
        if (d == false) {
          document.getElementById("menu-box").scrollLeft = offsetLeft;
        }
      }
      if (webview == "100fyy1.com") {
        if (menuListIndex < 0) menuListIndex = 0;
        if (
          document.getElementsByClassName("click_item")[0] &&
          document.getElementsByClassName("click_item")[0].style.display ==
            "none"
        ) {
          btnLength = document.getElementsByClassName("click_item").length;
          if (menuListIndex == 2) {
            menuListIndex = btnLength + 2;
          }
          if (menuListIndex == btnLength + 1) {
            menuListIndex = 1;
          }
        }
        let menuListItem = document.querySelectorAll(".menu-box a");
        if (menuListIndex >= menuListItem.length) {
          menuListIndex = menuListItem.length - 1;
        }
        menuListItem.forEach((element) => {
          element.classList.remove("active");
        });
        setTimeout(() => {
          menuListItem[menuListIndex].classList.add("active");
        }, 0);
        var el = menuListItem[menuListIndex];
        var viewPortWidth = document.getElementById("menu-box").clientWidth;
        var offsetLeft = el.offsetLeft;
        var scrollLeft = document.getElementById("menu-box").scrollLeft;
        var intop = el.offsetWidth;
        let d =
          offsetLeft + intop > scrollLeft &&
          offsetLeft + intop < scrollLeft + viewPortWidth;
        if (d == false) {
          document.getElementById("menu-box").scrollLeft = offsetLeft;
        }
      }
      if (webview == "www.555zxdy.com") {
        if (menuListIndex < 0) menuListIndex = 0;
        if (
          document.getElementsByClassName("click_item")[0] &&
          document.getElementsByClassName("click_item")[0].style.display ==
            "none"
        ) {
          btnLength = document.getElementsByClassName("click_item").length;
          if (menuListIndex == 2) {
            menuListIndex = btnLength + 2;
          }
          if (menuListIndex == btnLength + 1) {
            menuListIndex = 1;
          }
        }
        let menuListItem = document.querySelectorAll(".menu-box a");
        if (menuListIndex >= menuListItem.length) {
          menuListIndex = menuListItem.length - 1;
        }
        menuListItem.forEach((element) => {
          element.classList.remove("active");
        });
        setTimeout(() => {
          menuListItem[menuListIndex].classList.add("active");
        }, 0);
        var el = menuListItem[menuListIndex];
        var viewPortWidth = document.getElementById("menu-box").clientWidth;
        var offsetLeft = el.offsetLeft;
        var scrollLeft = document.getElementById("menu-box").scrollLeft;
        var intop = el.offsetWidth;
        let d =
          offsetLeft + intop > scrollLeft &&
          offsetLeft + intop < scrollLeft + viewPortWidth;
        if (d == false) {
          document.getElementById("menu-box").scrollLeft = offsetLeft;
        }
      }
      if (webview == "libvio.top") {
        if (menuListIndex < 0) menuListIndex = 0;
        if (
          document.getElementsByClassName("click_item")[0] &&
          document.getElementsByClassName("click_item")[0].style.display ==
            "none"
        ) {
          btnLength = document.getElementsByClassName("click_item").length;
          if (menuListIndex == 2) {
            menuListIndex = btnLength + 2;
          }
          if (menuListIndex == btnLength + 1) {
            menuListIndex = 1;
          }
        }
        let menuListItem = document.querySelectorAll(".menu-box a");
        if (menuListIndex >= menuListItem.length) {
          menuListIndex = menuListItem.length - 1;
        }
        menuListItem.forEach((element) => {
          element.classList.remove("active");
        });
        setTimeout(() => {
          menuListItem[menuListIndex].classList.add("active");
        }, 0);
        var el = menuListItem[menuListIndex];
        var viewPortWidth = document.getElementById("menu-box").clientWidth;
        var offsetLeft = el.offsetLeft;
        var scrollLeft = document.getElementById("menu-box").scrollLeft;
        var intop = el.offsetWidth;
        let d =
          offsetLeft + intop > scrollLeft &&
          offsetLeft + intop < scrollLeft + viewPortWidth;
        if (d == false) {
          document.getElementById("menu-box").scrollLeft = offsetLeft;
        }
      }
      if (webview == "www.lyjxwl.com") {
        if (menuListIndex < 0) menuListIndex = 0;
        if (
          document.getElementsByClassName("click_item")[0] &&
          document.getElementsByClassName("click_item")[0].style.display ==
            "none"
        ) {
          btnLength = document.getElementsByClassName("click_item").length;
          if (menuListIndex == 2) {
            menuListIndex = btnLength + 2;
          }
          if (menuListIndex == btnLength + 1) {
            menuListIndex = 1;
          }
        }
        let menuListItem = document.querySelectorAll(".menu-box a");
        if (menuListIndex >= menuListItem.length) {
          menuListIndex = menuListItem.length - 1;
        }
        menuListItem.forEach((element) => {
          element.classList.remove("active");
        });
        setTimeout(() => {
          menuListItem[menuListIndex].classList.add("active");
        }, 0);
        var el = menuListItem[menuListIndex];
        var viewPortWidth = document.getElementById("menu-box").clientWidth;
        var offsetLeft = el.offsetLeft;
        var scrollLeft = document.getElementById("menu-box").scrollLeft;
        var intop = el.offsetWidth;
        let d =
          offsetLeft + intop > scrollLeft &&
          offsetLeft + intop < scrollLeft + viewPortWidth;
        if (d == false) {
          document.getElementById("menu-box").scrollLeft = offsetLeft;
        }
      }
      if (webview == "www.qionggedy.cc" || webview == "m.qionggedy.cc") {
        if (menuListIndex < 0) menuListIndex = 0;
        if (
          document.getElementsByClassName("click_item")[0] &&
          document.getElementsByClassName("click_item")[0].style.display ==
            "none"
        ) {
          btnLength = document.getElementsByClassName("click_item").length;
          if (menuListIndex == 2) {
            menuListIndex = btnLength + 2;
          }
          if (menuListIndex == btnLength + 1) {
            menuListIndex = 1;
          }
        }
        let menuListItem = document.querySelectorAll(".menu-box a");
        if (menuListIndex >= menuListItem.length) {
          menuListIndex = menuListItem.length - 1;
        }
        menuListItem.forEach((element) => {
          element.classList.remove("active");
        });
        setTimeout(() => {
          menuListItem[menuListIndex].classList.add("active");
        }, 0);
        var el = menuListItem[menuListIndex];
        var viewPortWidth = document.getElementById("menu-box").clientWidth;
        var offsetLeft = el.offsetLeft;
        var scrollLeft = document.getElementById("menu-box").scrollLeft;
        var intop = el.offsetWidth;
        let d =
          offsetLeft + intop > scrollLeft &&
          offsetLeft + intop < scrollLeft + viewPortWidth;
        if (d == false) {
          document.getElementById("menu-box").scrollLeft = offsetLeft;
        }
      }
      if (webview == "www.ttzj365.com") {
        if (menuListIndex < 0) menuListIndex = 0;
        if (
          document.getElementsByClassName("click_item")[0] &&
          document.getElementsByClassName("click_item")[0].style.display ==
            "none"
        ) {
          btnLength = document.getElementsByClassName("click_item").length;
          if (menuListIndex == 1) {
            menuListIndex = btnLength + 1;
          }
          if (menuListIndex == btnLength) {
            menuListIndex = 0;
          }
        }
        let menuListItem = document.querySelectorAll(".menu-box a");
        if (menuListIndex >= menuListItem.length) {
          menuListIndex = menuListItem.length - 1;
        }
        menuListItem.forEach((element) => {
          element.classList.remove("active");
        });
        setTimeout(() => {
          menuListItem[menuListIndex].classList.add("active");
        }, 0);
        var el = menuListItem[menuListIndex];
        var viewPortWidth = document.getElementById("menu-box").clientWidth;
        var offsetLeft = el.offsetLeft;
        var scrollLeft = document.getElementById("menu-box").scrollLeft;
        var intop = el.offsetWidth;
        let d =
          offsetLeft + intop > scrollLeft &&
          offsetLeft + intop < scrollLeft + viewPortWidth;
        if (d == false) {
          document.getElementById("menu-box").scrollLeft = offsetLeft;
        }
      }
      if (webview == "www.88mv.tv") {
        if (menuListIndex < 0) menuListIndex = 0;
        if (
          document.getElementsByClassName("click_item")[0] &&
          document.getElementsByClassName("click_item")[0].style.display ==
            "none"
        ) {
          btnLength = document.getElementsByClassName("click_item").length;
          if (menuListIndex == 2) {
            menuListIndex = btnLength + 2;
          }
          if (menuListIndex == btnLength + 1) {
            menuListIndex = 1;
          }
        }
        let menuListItem = document.querySelectorAll(".menu-box a");
        if (menuListIndex >= menuListItem.length) {
          menuListIndex = menuListItem.length - 1;
        }
        menuListItem.forEach((element) => {
          element.classList.remove("active");
        });
        setTimeout(() => {
          menuListItem[menuListIndex].classList.add("active");
        }, 0);
        var el = menuListItem[menuListIndex];
        var viewPortWidth = document.getElementById("menu-box").clientWidth;
        var offsetLeft = el.offsetLeft;
        var scrollLeft = document.getElementById("menu-box").scrollLeft;
        var intop = el.offsetWidth;
        let d =
          offsetLeft + intop > scrollLeft &&
          offsetLeft + intop < scrollLeft + viewPortWidth;
        if (d == false) {
          document.getElementById("menu-box").scrollLeft = offsetLeft;
        }
      }
      if (webview == "www.fqfun.com") {
        if (menuListIndex < 0) menuListIndex = 0;
        if (
          document.getElementsByClassName("click_item")[0] &&
          document.getElementsByClassName("click_item")[0].style.display ==
            "none"
        ) {
          btnLength = document.getElementsByClassName("click_item").length;
          if (menuListIndex == 2) {
            menuListIndex = btnLength + 2;
          }
          if (menuListIndex == btnLength + 1) {
            menuListIndex = 1;
          }
        }
        let menuListItem = document.querySelectorAll(".menu-box a");
        if (menuListIndex >= menuListItem.length) {
          menuListIndex = menuListItem.length - 1;
        }
        menuListItem.forEach((element) => {
          element.classList.remove("active");
        });
        setTimeout(() => {
          menuListItem[menuListIndex].classList.add("active");
        }, 0);
        var el = menuListItem[menuListIndex];
        var viewPortWidth = document.getElementById("menu-box").clientWidth;
        var offsetLeft = el.offsetLeft;
        var scrollLeft = document.getElementById("menu-box").scrollLeft;
        var intop = el.offsetWidth;
        let d =
          offsetLeft + intop > scrollLeft &&
          offsetLeft + intop < scrollLeft + viewPortWidth;
        if (d == false) {
          document.getElementById("menu-box").scrollLeft = offsetLeft;
        }
      }
      if (webview == "www.novipnoad.com") {
        if (menuListIndex < 0) menuListIndex = 0;

        let menuListItem = document.querySelectorAll(".menu-box a");
        if (menuListIndex >= menuListItem.length) {
          menuListIndex = menuListItem.length - 1;
        }
        menuListItem.forEach((element) => {
          element.classList.remove("active");
        });
        setTimeout(() => {
          menuListItem[menuListIndex].classList.add("active");
        }, 0);
        var el = menuListItem[menuListIndex];
        var viewPortWidth = document.getElementById("menu-box").clientWidth;
        var offsetLeft = el.offsetLeft;
        var scrollLeft = document.getElementById("menu-box").scrollLeft;
        var intop = el.offsetWidth;
        let d =
          offsetLeft + intop > scrollLeft &&
          offsetLeft + intop < scrollLeft + viewPortWidth;
        if (d == false) {
          document.getElementById("menu-box").scrollLeft = offsetLeft;
        }
      }
      if (webview == "gaze.run") {
        if (menuListIndex < 0) menuListIndex = 0;

        let menuListItem = document.querySelectorAll(".menu-box a");
        if (menuListIndex >= menuListItem.length) {
          menuListIndex = menuListItem.length - 1;
        }
        menuListItem.forEach((element) => {
          element.classList.remove("active");
        });
        setTimeout(() => {
          menuListItem[menuListIndex].classList.add("active");
        }, 0);
        var el = menuListItem[menuListIndex];
        var viewPortWidth = document.getElementById("menu-box").clientWidth;
        var offsetLeft = el.offsetLeft;
        var scrollLeft = document.getElementById("menu-box").scrollLeft;
        var intop = el.offsetWidth;
        let d =
          offsetLeft + intop > scrollLeft &&
          offsetLeft + intop < scrollLeft + viewPortWidth;
        if (d == false) {
          document.getElementById("menu-box").scrollLeft = offsetLeft;
        }
      }

      if (webview == "www.3ayy.com") {
        if (menuListIndex < 0) menuListIndex = 0;
        if (
          document.getElementsByClassName("click_item")[0] &&
          document.getElementsByClassName("click_item")[0].style.display ==
            "none"
        ) {
          btnLength = document.getElementsByClassName("click_item").length;
          if (menuListIndex == 2) {
            menuListIndex = btnLength + 2;
          }
          if (menuListIndex == btnLength + 1) {
            menuListIndex = 1;
          }
        }

        let menuListItem = document.querySelectorAll(".menu-box a");
        if (menuListIndex >= menuListItem.length) {
          menuListIndex = menuListItem.length - 1;
        }
        menuListItem.forEach((element) => {
          element.classList.remove("active");
        });
        setTimeout(() => {
          menuListItem[menuListIndex].classList.add("active");
        }, 0);
        var el = menuListItem[menuListIndex];
        var viewPortWidth = document.getElementById("menu-box").clientWidth;
        var offsetLeft = el.offsetLeft;
        var scrollLeft = document.getElementById("menu-box").scrollLeft;
        var intop = el.offsetWidth;
        let d =
          offsetLeft + intop > scrollLeft &&
          offsetLeft + intop < scrollLeft + viewPortWidth;
        if (d == false) {
          document.getElementById("menu-box").scrollLeft = offsetLeft;
        }
      }
      if (webview == "www.ikyy.cc") {
        if (menuListIndex < 0) menuListIndex = 0;
        let menuListItem = document.querySelectorAll(".menu-box li");
        if (menuListIndex >= menuListItem.length) {
          menuListIndex = menuListItem.length - 1;
        }
        menuListItem.forEach((element) => {
          element.classList.remove("active");
        });
        setTimeout(() => {
          menuListItem[menuListIndex].classList.add("active");
        }, 0);
        var el = menuListItem[menuListIndex];
        var viewPortWidth = document.getElementById("menu-box").clientWidth;
        var offsetLeft = el.offsetLeft;
        var scrollLeft = document.getElementById("menu-box").scrollLeft;
        var intop = el.offsetWidth;
        let d =
          offsetLeft + intop > scrollLeft &&
          offsetLeft + intop < scrollLeft + viewPortWidth;
        if (d == false) {
          document.getElementById("menu-box").scrollLeft = offsetLeft;
        }
      }
      if (webview == "www.ylwt33.com") {
        if (menuListIndex < 0) menuListIndex = 0;
        let menuListItem = document.querySelectorAll(".menu-box li");
        if (menuListIndex >= menuListItem.length) {
          menuListIndex = menuListItem.length - 1;
        }
        menuListItem.forEach((element) => {
          element.classList.remove("active");
        });
        setTimeout(() => {
          menuListItem[menuListIndex].classList.add("active");
        }, 0);
        var el = menuListItem[menuListIndex];
        var viewPortWidth = document.getElementById("menu-box").clientWidth;
        var offsetLeft = el.offsetLeft;
        var scrollLeft = document.getElementById("menu-box").scrollLeft;
        var intop = el.offsetWidth;
        let d =
          offsetLeft + intop > scrollLeft &&
          offsetLeft + intop < scrollLeft + viewPortWidth;
        if (d == false) {
          document.getElementById("menu-box").scrollLeft = offsetLeft;
        }
      }
      if (webview == "www.ksksl.com") {
        if (menuListIndex < 0) menuListIndex = 0;
        let menuListItem = document.querySelectorAll(".menu-box li");
        if (menuListIndex >= menuListItem.length) {
          menuListIndex = menuListItem.length - 1;
        }
        menuListItem.forEach((element) => {
          element.childNodes[0].classList.remove("alpha");
        });
        setTimeout(() => {
          menuListItem[menuListIndex].childNodes[0].classList.add("alpha");
        }, 0);
        var el = menuListItem[menuListIndex];
        var viewPortWidth = document.getElementById("menu-box").clientWidth;
        var offsetLeft = el.offsetLeft;
        var scrollLeft = document.getElementById("menu-box").scrollLeft;
        var intop = el.offsetWidth;
        let d =
          offsetLeft + intop > scrollLeft &&
          offsetLeft + intop < scrollLeft + viewPortWidth;
        if (d == false) {
          document.getElementById("menu-box").scrollLeft = offsetLeft;
        }
      }
      if (webview == "www.kkw361.com") {
        if (menuListIndex < 0) menuListIndex = 0;
        let menuListItem = document.querySelectorAll(".menu-box a");
        if (menuListIndex >= menuListItem.length) {
          menuListIndex = menuListItem.length - 1;
        }
        menuListItem.forEach((element) => {
          element.classList.remove("cur");
        });
        setTimeout(() => {
          menuListItem[menuListIndex].classList.add("cur");
        }, 0);
        var el = menuListItem[menuListIndex];
        var viewPortWidth = document.getElementById("menu-box").clientWidth;
        var offsetLeft = el.offsetLeft;
        var scrollLeft = document.getElementById("menu-box").scrollLeft;
        var intop = el.offsetWidth;
        let d =
          offsetLeft + intop > scrollLeft &&
          offsetLeft + intop < scrollLeft + viewPortWidth;
        if (d == false) {
          document.getElementById("menu-box").scrollLeft = offsetLeft;
        }
      }
    }

    ("use strict");
  }, delayTime);
}
