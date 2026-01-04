// ==UserScript==
// @name         Iwara Cuck
// @namespace    none
// @version      1.0
// @description  yes
// @match        https://www.iwara.tv/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/531260/Iwara%20Cuck.user.js
// @updateURL https://update.greasyfork.org/scripts/531260/Iwara%20Cuck.meta.js
// ==/UserScript==

var storedUsernames = localStorage.getItem('usernames');
var usernames = storedUsernames ? JSON.parse(storedUsernames) : [];
let iframe, a, b, c, d, targetSection, i, urlParams, currentIndex = 0, t = 3, filter = 1, Group = 1;
let pageKey = `myData_${window.location.href}`;
let url = window.location.href;

const buttonStyles = `
    background: rgba(255, 143, 143, 0.8);
    color: white;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    font-size: 16px;
    border-radius: 5px;
    transition: background 0.3s ease;
`;

const blackButton = `
background: rgba(100, 100, 100, 0.8);
color: white;
border: none;
padding: 10px 15px;
cursor: pointer;
font-size: 16px;
border-radius: 5px;
transition: background 0.3s ease;
`;

const style = document.createElement('style');
style.innerHTML = `
    video::-webkit-media-controls-panel {
        background: transparent !important;
    }
`;
document.head.appendChild(style);



if (localStorage.getItem("t")) {
  t = parseInt(localStorage.getItem("t"));
}
if (localStorage.getItem("Filter")) {
  filter = parseInt(localStorage.getItem("Filter"));
}
if (localStorage.getItem("Group")) {
  Group = parseInt(localStorage.getItem("Group"));
}

function updateMenu() {
    GM_registerMenuCommand("Page Count: " + t, setT);
    GM_registerMenuCommand("Filter: " + filter, setFilter);
    GM_registerMenuCommand("Autoload: " + Group, setGroup);
}

function removeMenu() {
    GM_unregisterMenuCommand("Page Count: " + t);
    GM_unregisterMenuCommand("Filter: " + filter);
    GM_unregisterMenuCommand("Autoload: " + Group);
}

function setT() {
    let newT = prompt("Set t:", t);
    if (newT !== null) {
        removeMenu();
        t = parseInt(newT);
        localStorage.setItem("t", t);
        updateMenu();
    }
}

function setFilter() {
    if (filter === 1) {
      removeMenu();
      filter = 0;
      localStorage.setItem("Filter", filter);
      updateMenu();
    } else {
      removeMenu();
      filter = 1;
      localStorage.setItem("Filter", filter);
      updateMenu();
    }
}

function setGroup() {
    if (Group === 1) {
      removeMenu();
      Group = 0;
      localStorage.setItem("Group", Group);
      updateMenu();
    } else {
      removeMenu();
      Group = 1;
      localStorage.setItem("Group", Group);
      updateMenu();
    }
}


updateMenu();
function checkPagination() {
  pageKey = `myData_${window.location.href}`;
  var pagination = document.querySelector('.pagination ul.pagination__items');
  if (pagination !== null) {

    console.log("Probably Working.");
  var parentDivs = document.querySelectorAll('.col-6.col-sm-4.col-md-3.page-videoList__item');

  var usernameLinks = document.querySelectorAll('a.username');

if (filter === 1) {
    usernameLinks.forEach(function(usernameLink) {
    var button = document.createElement('button');
    button.textContent = '-';

    button.onclick = function() {
      var username = usernameLink.textContent;
      usernames.push(username);

      localStorage.setItem('usernames', JSON.stringify(usernames));
      parentDivs.forEach(function(parentDiv) {
        var username = parentDiv.querySelector('a.username').textContent;
        if (usernames.includes(username)) {
          parentDiv.style.visibility = 'hidden';
          parentDiv.style.position = 'absolute';
          parentDiv.querySelector("div.videoTeaser__content > a").className = "hidden";
          console.log(parentDiv.querySelector("div.videoTeaser__content > a").className);
        }
      });
    };
    usernameLink.parentNode.insertBefore(button, usernameLink.nextSibling);

  });

            parentDivs.forEach(function(parentDiv) {
        var username = parentDiv.querySelector('a.username').textContent;
        if (usernames.includes(username)) {
          parentDiv.style.visibility = 'hidden';
          parentDiv.style.position = 'absolute';
          parentDiv.querySelector("div.videoTeaser__content > a").className = "hidden";
          console.log(parentDiv.querySelector("div.videoTeaser__content > a").className);
        }
      });

};
  var xOption = document.createElement('li');
  xOption.className = 'pagination__item';
  xOption.textContent = 'x';

  pagination.appendChild(xOption);

  xOption.onclick = function() {
    localStorage.removeItem('usernames');
    console.log('Stored usernames cleared');

    usernames = [];
  };

  }
}

function check(iframe) {
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      try {
        if (iframe.contentDocument.querySelectorAll("div.byline button")[0]) {
          clearInterval(intervalId);
          resolve(true);
        }
      } catch (e) {
      }
    }, 500);
  });
}
function tree() {
let iframe = document.createElement('iframe');
if (!window.frameElement) {
  urlParams = new URLSearchParams(window.location.search);
  let sortParam = urlParams.get('sort');
  a = parseInt(urlParams.get('page'));
  if (sortParam) {
    (async function () {
      if (t > 1) {
        for (i = 1; i <= t - 1; i++) {
        urlParams.set('page', a + i);
        console.log(a + i);
        if (iframe && typeof iframe.src !== "undefined") {
        iframe.style.visibility = 'hidden';
        iframe.src = `${window.location.pathname}?${urlParams.toString()}`;
        document.body.appendChild(iframe);

        try {
          await check(iframe);

          let colElements = iframe.contentDocument?.querySelectorAll("div.col-6");
          if (colElements && colElements.length > 0) {
            targetSection = document.querySelector("section.content div.col-12 div:nth-child(1)");

            colElements.forEach(colElement => {
              targetSection.appendChild(colElement);
            });
          }
        } catch (e) {
          console.error("Error accessing iframe content:", e);
        } finally {
          iframe.remove();
          console.log("Iframe processed and removed.");
        };
          }
      }
      }
    let button = document.createElement('button');
    button.className = 'plusten';
    button.innerHTML = '+ ' + t;
    button.addEventListener('click', function() {
      urlParams = new URLSearchParams(window.location.search);
      b = parseInt(urlParams.get('page')) + t || t;
      urlParams.set('page', b);
      window.location.href = `${window.location.pathname}?${urlParams.toString()}`;
    })
    targetSection.appendChild(button);
    if (Group === 1) {
      loads();
    };
    })();
  }
}
}

    const button = document.createElement('a');
    const originalPushState = history.pushState;
    button.innerHTML = '+';
    button.id = 'fer';
    button.class = 'header__link';
    const timer = setInterval(() => {
    if (document.querySelector("div.col-6.col-sm-4")) {
    checkPagination();
    document.querySelector("div.header__content__items__right").appendChild(button);
      clearInterval(timer);
    }
    }, 100);
    history.pushState = function() {

    if (document.querySelector("#fer")) {
      document.querySelector("#fer").remove();
    };
    const timer = setInterval(() => {
    if (document.querySelector("div.col-6.col-sm-4")) {
    checkPagination();
    document.querySelector("div.header__content__items__right").appendChild(button);
      clearInterval(timer);
    }
    }, 100);
    return originalPushState.apply(this, arguments);
    };

    button.addEventListener('click', loads);


function loads() {

if (localStorage.getItem(pageKey)) {
currentIndex = parseInt(localStorage.getItem(pageKey));
console.log(pageKey);
} else {
currentIndex = 0;
}
        const videoLinks = document.querySelectorAll('a.videoTeaser__title');
        document.querySelector("body").innerHTML = ``;
        let button = document.createElement('button');
        button.className = 'plusten';
        button.innerHTML = '+' + t;
        button.addEventListener('click', function() {
      urlParams = new URLSearchParams(window.location.search);
      b = parseInt(urlParams.get('page')) + t || t;
      urlParams.set('page', b);
      if (filter === 1) {
        //localStorage.clear("usernames");
      }
      window.location.href = `${window.location.pathname}?${urlParams.toString()}`;
    })
        const videos = document.createElement('div');
        videos.className = 'videos';
        videoLinks.forEach((link, index) => {
                iframe = document.createElement('iframe');
                iframe.src = link.href;
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
        });
        const framechk = setInterval(() => {
            if (document.querySelectorAll("iframe")[videoLinks.length - 1].contentDocument.querySelector('video')) {
const videoLinks = document.querySelectorAll("iframe");
let videos = [];
for (let i = 0; i < videoLinks.length; i++) {
    let iframe = videoLinks[i];
    let auth = iframe.contentDocument?.querySelector("a.username div");
    let videoElement = iframe.contentDocument?.querySelector('video');

    if (videoElement) {
        let author = auth.innerText;
        let videoSrc = videoElement.src;
        videos.push({ author, videoSrc });
    }
}

const container = document.createElement('div');
const videoPlayer = document.createElement('video');
const nextBtn = document.createElement('button');
const prevBtn = document.createElement('button');
const rmvUser = document.createElement('button');
const controlsContainer = document.createElement('div');
controlsContainer.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 10px;
    z-index: 1000;
`;

videoPlayer.style.width = '100%';
videoPlayer.controls = true;
if (videos.length > 0) {
  if (currentIndex > videos.length) {
    currentIndex = 0;
  }
    videoPlayer.src = videos[currentIndex].videoSrc;
    console.log(videos[currentIndex].author);
}

rmvUser.innerText = '⃠   ';
nextBtn.innerText = 'Next';
prevBtn.innerText = 'Previous';
nextBtn.style.margin = '10px';
prevBtn.style.margin = '10px';

nextBtn.addEventListener('click', () => {
    if (currentIndex < videos.length - 1) {
        currentIndex++;
        localStorage.setItem(pageKey, currentIndex);
        videoPlayer.src = videos[currentIndex].videoSrc;
        videoPlayer.play();
    }
});



prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        videoPlayer.src = videos[currentIndex].videoSrc;
        localStorage.setItem(pageKey, currentIndex);
        videoPlayer.play();
    }
});
document.body.style.cssText = `
overflow:hidden
`;
    rmvUser.onclick = function() {
      let username = videos[currentIndex].author;
      usernames.push(username);

      localStorage.setItem('usernames', JSON.stringify(usernames));
      videos = videos.filter(video => video.author !== username);
        videoPlayer.src = videos[currentIndex].videoSrc;
    }
nextBtn.style.cssText = buttonStyles;
prevBtn.style.cssText = buttonStyles;
button.style.cssText = blackButton;
rmvUser.style.cssText = blackButton;
controlsContainer.appendChild(rmvUser);
controlsContainer.appendChild(button);
controlsContainer.appendChild(prevBtn);
controlsContainer.appendChild(nextBtn);
document.body.appendChild(controlsContainer);
container.appendChild(videoPlayer);
document.body.appendChild(container);

              document.querySelectorAll('iframe').forEach(iframe => iframe.remove());
              clearInterval(framechk);
            }
        }, 5000);
    };

    const currentUrl = window.location.href;
    const domain = window.location.hostname;
    const storageKey = `lastVisited_${domain}`;
    const lastVisited = localStorage.getItem(storageKey);

    localStorage.setItem(storageKey, currentUrl);

    if (lastVisited && lastVisited !== currentUrl) {
        const banner = document.createElement('div');
        banner.textContent = `Click here to return to your last visited page.`;
        banner.style.position = 'fixed';
        banner.style.bottom = '10px';
        banner.style.left = '50%';
        banner.style.transform = 'translateX(-50%)';
        banner.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        banner.style.color = 'white';
        banner.style.padding = '10px 20px';
        banner.style.borderRadius = '5px';
        banner.style.cursor = 'pointer';
        banner.style.zIndex = '10000';
        banner.style.fontSize = '14px';
        banner.style.transition = 'opacity 0.5s ease-in-out';

        banner.onclick = () => {
            localStorage.removeItem(storageKey);
            window.location.href = lastVisited;
        };

        document.body.appendChild(banner);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            banner.style.opacity = '0';
            setTimeout(() => banner.remove(), 500);
        }, 5000);
    }

tree();
