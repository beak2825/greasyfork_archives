// ==UserScript==
// @name        Redirect Instagram Web
// @namespace   Userscript
// @match       https://www.instagram.com/*
// @match       https://instagram.com/*
// @match       https://wizstat.com/*
// @match       https://picuki.me/*
// @match       https://*.cdninstagram.com/*
// @version     0.1.3
// @author      CY Fung
// @description To redirect Instagram Web
// @run-at      document-start
// @require     https://cdnjs.cloudflare.com/ajax/libs/quicklink/2.3.0/quicklink.umd.js
// @grant       GM.xmlHttpRequest
// @allFrames   true
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/469643/Redirect%20Instagram%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/469643/Redirect%20Instagram%20Web.meta.js
// ==/UserScript==


/*
 *
 * https://stackoverflow.com/questions/32543090/instagram-username-regex-php
 *
 * The length must be between 3 and 30 characters.
 * The accepted characters are like you said: a-z A-Z 0-9 dot(.) underline(_).
 * It's not allowed to have two or more consecutive dots in a row.
 * It's not allowed to start or end the username with a dot.

*/

const F_AUTO_REDIRECT = true;


if (location.pathname === '/robots.txt' && location.search.startsWith('?z5m4F=')) {
  let search = location.search.substring('?z5m4F='.length);

  let decoded = decodeURIComponent(search);

  let url = `https://${location.hostname}${decoded}`



  document.addEventListener('canplaythrough', (evt)=>{
    let target = evt.target;
    if(target instanceof HTMLVideoElement){}else return;

    evt.target.classList.add('canplaythrough');

  },true)

  document.addEventListener('canplay', (evt)=>{
    let target = evt.target;
    if(target instanceof HTMLVideoElement){}else return;

    evt.target.classList.add('canplay');

  },true)


  console.log(url);
  function onReady() {




    document.body.innerHTML = `<div id="app"></div>`;
    document.head.appendChild(document.createElement('script')).src = 'https://cdn.jsdelivr.net/npm/video.js@8.3.0/dist/video.min.js';
    Object.assign(document.head.appendChild(document.createElement('link')), {
      href: 'https://cdn.jsdelivr.net/npm/video.js@8.3.0/dist/video-js.min.css',
      rel: "stylesheet"
    });


    document.head.appendChild(document.createElement('style')).textContent = `
    html, body, div#app{ margin:0; padding:0; outline:0;}

    video {
    position:relative;
    margin-left:300vw;
    }
    video.canplaythrough{
    margin-left:0;
    }
    `;


    let app = document.querySelector('#app');
    Object.assign(app.style,{
      'height':'100vh',
      'width':'100vw'
    });

    /*
      <video
    id="my-video"
    class="video-js"
    controls
    preload="auto"
    width="640"
    height="264"
    poster="MY_VIDEO_POSTER.jpg"
    data-setup="{}"
  >
    <source src="MY_VIDEO.mp4" type="video/mp4" />
    <source src="MY_VIDEO.webm" type="video/webm" />
    <p class="vjs-no-js">
      To view this video please enable JavaScript, and consider upgrading to a
      web browser that
      <a href="https://videojs.com/html5-video-support/" target="_blank"
        >supports HTML5 video</a
      >
    </p>
  </video>
  */

    app.innerHTML = `<video

    style="max-width:${document.body.clientWidth}px;max-height:${document.body.clientHeight}px;"

    id="my-video"
    class="video-js"
    preload="auto"
    data-setup="{}"

    width="${document.body.clientWidth}"
    height="${document.body.clientHeight}"


    controls="" autoplay="" name="media">
  <source src="${url}" type="video/mp4" />
</video>`;




  }



  if (document.readyState != 'loading') {
    onReady();
  } else {
    window.addEventListener("DOMContentLoaded", onReady, false);
  }





} else if (/\binstagram\.com$/.test(location.hostname) && /^\/[_a-zA-Z0-9][._a-zA-Z0-9]{2,29}\/?$/.test(location.pathname)) {

  F_AUTO_REDIRECT && location.replace('https://picuki.me' + location.pathname)

} else {

  const { requestAnimationFrame } = window;

  async function looper() {

    while (true) {
      if (document.body && document.head) break;
      await new Promise(resolve => requestAnimationFrame(resolve));
    }
    main();
  }

  function main() {

    document.head.appendChild(document.createElement('style')).textContent = `
.user-header div[class], .wrap div[class], .post-items div[class], .list-wrap div[class] {
	min-height: initial;
}

[data-pub]:empty {
	display: none !important;
}

.wrap .post-content .swiper-container .media-wrap img {
	--img-position: absolute;
}

.wrap .post-content .media-wrap img {
	--img-position: relative;
}

html .wrap .post-content .media-wrap img {
	position: var(--img-position);
}

.post-items img {
	object-fit: cover;
}

.post-content > .media-wrap {
	padding-top: 0 !important;
}

.post-items .post-item {
	width: 293px;
}

.post-items {

	/*
	margin: 0 auto 30px;
	max-width: 935px;*/
	width: 100%;
	padding: 0;
	justify-content: center;
}

.z6m4G {
	display: flex;
	flex-direction: column;
	margin: 0 auto;
}

.z6m4G iframe {
	flex-grow: 1;
	border: 0px;
	outline: 0px;
	padding: 0px;
	margin: 0px;
}

.list-wrap > a[href^="/p/"] + div[class^="media-wrap-"] {
	display: none !important;
}

.media-wrap-h12[class], .media-wrap-sulvo[class] {
	min-height: initial;
}

.post-items[class]{
  max-width: initial;
}

  `;


    requestAnimationFrame(() => {
      // let links = document.querySelectorAll('.post-item a[href*="/p/"]');

      quicklink.listen({
        limit: 1000,
        delay: 1,
        throttle: 4,
        timeout: 200,
        ignores: [
          (uri, elem) => {
            if(document.visibilityState === 'hidden') return true;
            let isP = /^https\:\/\/picuki\.me\/p\/[^\/]+\/$/.test(uri);
            if (!isP) return true;
            return false;

          },
        ]
      });

    })


  }

  looper();

  function setupVideo(container) {

    let href = container.href.replace(/\bscontent[\-\w]+\./, 'scontent.');

    let hObj = new URL(href)

    if (!/^[^\/\:.]+\.cdninstagram\.com$/.test(hObj.hostname)) return;

    let div = document.createElement('div')
    div.className='z6m4G';
    div.innerHTML = `
    <iframe src="https://${hObj.hostname}/robots.txt?z5m4F=${encodeURIComponent(hObj.pathname + hObj.search)}"></iframe>
  `;

    let rect = container.getBoundingClientRect();

    let {width, height} = rect;

    let mHeight = screen.height - 40;
    let mWidth = screen.width - 40;

   if(height>mHeight){

     width = width / height *  mHeight;
     height = mHeight
   }else if(width>mWidth){
     height = height / width *  mWidth;
     width = mWidth

   }


    div.style.width = width+'px';
    div.style.height = height+'px';

    container.replaceWith(div)

  }

  document.addEventListener('load', (evt) => {
    if (!evt) return;
    if (evt.target instanceof HTMLImageElement) { } else return;

    if (evt.target.matches('a.media-wrap[href*=".cdninstagram.com/"] img[src]')) {
      setupVideo(evt.target.closest('a.media-wrap[href*=".cdninstagram.com/"]'));
      return;
    }


    let src = evt.target.src;
    if (src.length > 30 && src.indexOf('.picuki.me/') > 0 && src.indexOf('.cdninstagram.com/') > 0) {

      let p = /\b\.cdninstagram\.com\/[^\s"']+\d+_[a-z]\.\w{3,4}\b/.exec(src);
      if (p) {



        if (evt.target.classList.contains('hg3jo')) return;
        let entries = [...document.body.querySelectorAll(`a[href*="${p[0]}"], [data-src*="${p[0]}"]`)].map(e => ({
          elm: e,
          href: e.getAttribute('href') || e.getAttribute('data-src') || ''
        })).filter(o => (o.href.indexOf('picuki.me/') < 0));
        let newUrl = '';


        if (entries && entries.length >= 1) {
          newUrl = entries[0].href;
        }


        if (newUrl) {
          let element = entries[0].elm;

          evt.preventDefault();
          evt.stopPropagation();
          evt.target.classList.add('hg3jo');

          // let m1 = /stp=[^=;|"'&?]+\b/.exec(src);
          // let m2 = /stp=[^=;|"'&?]+\b/.exec(element.getAttribute('href'));
          /*
          if(m1&&m2){

          evt.target.src = src.replace(m1[0],m2[0])
          }else{

          evt.target.src = element.getAttribute('href').replace(/[&?]dl=1\b/,'')
          }


          */
          // evt.target.src = element.getAttribute('href')//.replace(/[&?]dl=1\b/,'');


          const img = evt.target;
          GM.xmlHttpRequest({
            url: newUrl,
            method: "GET",
            headers: {
              "Accept": "*/*"
            },
            referrerPolicy: "no-referrer",
            cache: "default",
            credentials: "omit",
            mode: "cors",
            keepalive: false,
            redirect: "follow",
            responseType: "blob",
            onload: function (response) {

              if (response.status === 200 && response.readyState === 4) {

                let res = response.response;
                if ((response.lengthComputable ? (res.size > 1) : true) && res.type.indexOf('image/') === 0) {
                  let url = URL.createObjectURL(res);
                  if (url) {
                    img.src = url
                  }
                }

              }


            }
          })

        }

      }
    }




  }, true);



  document.addEventListener('click', (evt) => {

    let target = evt.target;
    console.log(target)
    if (target instanceof HTMLElement) {
      if (target.matches('.media-wrap i.play')) {


        evt.preventDefault();

        document.createElement

      }
    }
  })

  /*

  Document.prototype.createElement=((createElement)=>{

    return function(){
      console.log(arguments)
      console.log(new Error().stack)
      return createElement.apply(this, arguments)
                     }
  })(Document.prototype.createElement);


  Node.prototype.appendChild=((appendChild)=>{

    return function(){
      console.log(arguments)
      console.log(new Error().stack)
      return appendChild.apply(this, arguments)
                     }
  })(Node.prototype.appendChild);

  */


}