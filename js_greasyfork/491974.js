// ==UserScript==
// @name        instuky.com
// @namespace   Instucky addon Script - GetDopamin
// @match       https://instuky.com/*
// @grant       none
// @version     1.0
// @author      GetDopamin
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @description This is Instucky User Script for addon functionality
// @license     MIT 
// @downloadURL https://update.greasyfork.org/scripts/491974/instukycom.user.js
// @updateURL https://update.greasyfork.org/scripts/491974/instukycom.meta.js
// ==/UserScript==

/* ------------- SYTLE INJECT ------------- */
const customStyle = `
    .custom-btn {
      background-color: #fa865f;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      float: center;
      margin-top: 8px;
    }
    .custom-btn:hover {
      background-color: #EF6131;
    }
    .alert-box{
      padding: 12px 18px;
      background-color: #fa865f;
      border-radius: 8px;
      border: 3px solid #000;
      position: fixed;
      top:10px;
      right: 10px;
      z-index:9999;
      text-align: center;
    }

    .single-post__video{
      background-color: #000;
    }
  `;

const style = document.createElement("style");
style.textContent = customStyle;
document.head.appendChild(style);

/* ------------- DOWNLOAD & ALERT FUN ------------- */
async function download(url) {
      return new Promise((resolve, reject) => {
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            alert("Download Starting...", 5000);
            return response.blob();
          })
          .then((blob) => {
            const tempUrl = URL.createObjectURL(blob);
            const aTag = document.createElement("a");
            aTag.href = tempUrl;
            aTag.download = url.substring(url.lastIndexOf("/") + 1);
            document.body.appendChild(aTag);
            aTag.click();
            URL.revokeObjectURL(tempUrl);
            aTag.remove();
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
const alert = (message, time)=>{
    const alertDiv = document.createElement("Div");
    alertDiv.classList.add("alert-box");
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    setTimeout(()=>{
      document.body.removeChild(alertDiv);
    }, time);
}

/* ------------- DOWNLOAD & VIDEO INJECT ------------- */
document.querySelectorAll("a.item-post__download").forEach((dbtn)=>{
  dbtn.addEventListener("click", (e)=>{
        let targetUrl = dbtn.href
        e.preventDefault();
        download(targetUrl);
  })
});
if (window.location.pathname.includes("/post/")) {
  const videoWrapper = document.querySelector(".single-post__video");
  const videoLink = videoWrapper.querySelector(".video-post__link");
  const imgLink = videoLink.querySelector("img");

  const video_ = document.createElement("video");
  video_.controls = true;
  video_.loop = true;
  video_.setAttribute("style","width:100%; height:70vh;")
  video_.crossorigin = "anonymous";

  const videoSrc_ = document.createElement("source");
  videoSrc_.src = videoLink.href;
  videoSrc_.type = "video/mp4";
  videoSrc_.crossorigin = "anonymous";

  video_.appendChild(videoSrc_);
  videoWrapper.innerHTML = "";
  videoWrapper.appendChild(video_);


}
/* ------------- Popular ------------- */
const injectPopular = () => {
const trending = document.querySelector(".trending .container .trending__list");
const users = [
  "lohomord",
  "meetsanika",
  "zendaya",
  "raynavallandingham"
];

  if(trending){
    trending.innerHTML = '';
  }

for (let i = 0; i < users.length; i++) {
  const lisEle = document.createElement("li");
  lisEle.classList.add("trending__item", "item-trending");

  const lisLink = document.createElement("a");
  lisLink.classList.add("item-trending__link");
  lisLink.setAttribute("href", `/profile/${users[i]}`);
  lisLink.setAttribute("title", `@${users[i]}`);

  const lisLinkSpan = document.createElement("span");
  lisLinkSpan.textContent = `@${users[i]}`;
  lisLinkSpan.classList.add("item-trending__title", "text_bold");

  lisLink.appendChild(lisLinkSpan);
  lisEle.appendChild(lisLink);
  if(trending){
  trending.appendChild(lisEle);
  }
}

}

injectPopular();

/* ------------- Other ------------- */
const observeElement = (callback, options) => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      // observer.disconnect();
      callback();
    }
  }, options);

  observer.observe(document.querySelector(".more-posts__button"));
};

const infniteScroll = () => {
  const showMoreBtn = document.querySelector(".more-posts__button");
  if (!showMoreBtn) {
    console.error("No element with class 'more-posts__button' found");
    return;
  }
  showMoreBtn.style.visibility = "hidden";

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  };

  observeElement(() => {
    showMoreBtn.click();
  }, observerOptions);
};
infniteScroll();


const goToTop = () => {
    const button = document.createElement('button');
    button.innerHTML = 'Go to top';
    button.style.position = 'fixed';
    button.style.bottom = '0';
    button.style.right = '0';
    button.style.zIndex = '1000';
    button.style.border = '4px solid rgba(0, 0, 0, 0.7)';
    button.style.background = '#fa865f';
    button.style.color = 'white';
    button.style.margin = '10px';
    button.style.padding = '10px 20px';
    button.style.fontSize = '16px';
    button.style.cursor = 'pointer';
    button.style.borderRadius = '14px';
    document.body.appendChild(button);

    const observe = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            button.style.display = 'none';
        } else {
            button.style.display = 'block';
        }
    })

    observe.observe(document.body);

  button.addEventListener('mouseenter',() => {
        button.style.backgroundColor = '#FB6B3B';
    });

  button.addEventListener('mouseleave',() => {
        button.style.backgroundColor = '#fa865f';
    });

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    })
}
goToTop();