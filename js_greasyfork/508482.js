// ==UserScript==
// @name        Light Niconico
// @namespace   yakisova.com
// @author      yakisova41
// @license     MIT
// @match       https://www.nicovideo.jp/*
// @grant       none
// @version     0.1
// @description 2024/9/15 3:50:38
// @require https://cdn.jsdelivr.net/npm/video.js@8.17.4/dist/video.min.js
// @resource VIDEO_JS_CSS https://cdn.jsdelivr.net/npm/video.js@8.17.4/dist/video-js.min.css
// @grant      GM_getResourceText
// @grant      GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/508482/Light%20Niconico.user.js
// @updateURL https://update.greasyfork.org/scripts/508482/Light%20Niconico.meta.js
// ==/UserScript==

const root = document.querySelector("#root");

const rightNicocontainer = document.createElement("div");
rightNicocontainer.id = "right-nico-container"
document.body.appendChild(rightNicocontainer);

let vjs = null;

function initializeHead() {
  //document.head.innerHTML = ""

  const videoJsCssContent = GM_getResourceText("VIDEO_JS_CSS");
  GM_addStyle(videoJsCssContent);
}

async function initializeRoot(videoId) {
  if(vjs !== null) {
    vjs.dispose();
  }


  const router = getReactRouter();
  const videoElem = document.querySelector('video[data-name="video-content"]');

  if(videoElem !== null){
    console.log(videoElem);

    root.style.display = "none";

    rightNicocontainer.innerHTML = ""

    rightNicocontainer.appendChild(videoElem);

    vjs = await reconstructVideo(videoElem);
    vjs.pause();
    vjs.play()

    const recommends = await getRecommend(videoId);

    const recommendsElem = document.createElement("ul")
    recommends.data.items.forEach(({content}) => {
      if(content.type === "essential") {
        const v = document.createElement("li")
        v.addEventListener("click" ,() => {
          router.navigate("/watch/" + content.id)
        })

        v.innerHTML = `<img src=${content.thumbnail.url}><h3>${content.title}</h3>`;
        recommendsElem.appendChild(v);
      }
    })

    rightNicocontainer.appendChild(recommendsElem)

  }
}

function getReactRouter() {
  const containerKey = Object.keys(root).filter(k => k.match("^__reactContainer.*"))[0];
  const container = root[containerKey];
  return container.child.return.child.return.child.return.child.return.child.child.child.child.memoizedProps.children.props.router;
}

function watchPageReconstruct(videoId) {
    initializeHead();
    initializeRoot(videoId);
}

function reconstructVideo(videoElem) {
  videoElem.setAttribute("style", "");
  videoElem.setAttribute("data-name", "");
  videoElem.setAttribute("autoplay", true);
  videoElem.setAttribute("controls", true);
  videoElem.className = "video-js"

  return new Promise((resolve) => {
    const vjs = videojs(videoElem , {
      controls: true,
      autoplay:true
    } , () => {
      resolve(vjs);
    })
  })
}

function onPageChange() {
  const { pathname } = location;

  if(pathname.split("/")[1] === "watch") {
    // watch page
    console.log("p change");

    setTimeout(() => {
      watchPageReconstruct(pathname.split("/")[2]);
    }, 1000)

  }

}

async function getRecommend(id) {
  const res =  await fetch(`https://nvapi.nicovideo.jp/v1/recommend?recipeId=video_watch_recommendation&videoId=${id}&limit=25&site=nicovideo&_frontendId=6&_frontendVersion=0`);
  return await res.json();
}

let beforePath = "";
setInterval(() => {
  const {pathname} = location;
  if(pathname !== beforePath) {
    console.log(pathname)
    onPageChange();
  }
  beforePath = pathname;
}, 500);

