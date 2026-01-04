// ==UserScript==
// @name        MFC Classified Ads Card Layout Edited
// @namespace   zys52712
// @match       https://myfigurecollection.net/*
// @grant       none
// @version     3.2
// @license     GNU GPLv3
// @author      zys52712
// @description Show MFC classifieds as cards, view & reply to listings without leaving the page
// @downloadURL https://update.greasyfork.org/scripts/518429/MFC%20Classified%20Ads%20Card%20Layout%20Edited.user.js
// @updateURL https://update.greasyfork.org/scripts/518429/MFC%20Classified%20Ads%20Card%20Layout%20Edited.meta.js
// ==/UserScript==

const styles = document.createElement('style');

styles.innerHTML = `
.xy-wrapper {
  filter: blur(18px) grayscale(1);
  display: none;
}

header {
  opacity: 1;
  transition: opacity 0.3s;

  &.hide {
    opacity: 0;
  }

  &.hidden {
    top: -64px !important;
  }
}

#window.initialized:not(:has(#rd-id-currency-USD)) {
  opacity: 0;
  transition: opacity 0.3s;

  &.active {
    opacity: 1;

    .wrapper {
      opacity: 1;
      transform: translateY(-50%);
    }
  }

  .wrapper {
    transition: transform 0.3s, opacity 0.3s;
    margin-top: 50vh;
    transform: translateY(-45%);

    .maximize.desktop {
      display: none;
    }
  }
}

#message {
  display: block !important;
  top: 64px !important;
  opacity: 0 !important;
  transition: opacity 0.3s, top 0.3s;
  pointer-events: none;

  &.active {
    top: 32px !important;
    opacity: 1 !important;
  }
}

#wide:has(.classified-dgst):has(.icon-circle-o, a[href*="classified"]) {
  /*width: 85%;*/

  &:has(a[href*="/?_tb=classified&createdBy="]) {
    width: 100%;
  }

  .results:has(.classified-price) {
    gap: 16px;
    padding: 16px;
    display: grid;
    grid-template-columns: repeat(auto-fit, 236px);

    .result.associate {
      display: none;
    }

    .result {
      gap: 20px;
      height: 400px;
      flex-direction: column;
      padding: 0;
      margin: 0;
      opacity: 1;
      transition: opacity 0.5s;
      border-radius: 8px;

      &:has(.classified-dgst) {

      }

      &.loading {
      .classified-dgst {
        opacity: 0;
      }

        &:not(.modal-transitioning) {
      .classified-dgst {
          transition: none;
      }
        }
      }

      /*
      &:hover {
        &:not(.active) .dgst-data {
          /*transform: translateY(calc(100% - 75px));*/
          /*
          .classified-description {
            max-height: min(var(--max-height), 144px);
            -webkit-line-clamp: 8;
          }
        }
      }
      */

      &:hover {
        a.dgst-icon img {
          transform: scale(1.05);
        }
      }

      &::before {
        content: ' ';
        position: fixed;
        inset: 0;
        opacity: 0;
        transition: all 0.3s !important;
        pointer-events: none;
          background: #00000099;
      }

      /*
      &.transitioning {
        .dgst-data {
          .classified-description {
            -webkit-line-clamp: 8;
          }
        }
      }
      */

      &.active {
        background: linear-gradient(to bottom, rgba(80, 80, 80, .20), rgba(80, 80, 80, .30));
        box-shadow: 5px 5px 5px #00000050;
        z-index: 3;

        &::before {
          pointer-events: initial;
        opacity: 1;
        }

        &.modal-transitioned .classified-dgst {
          transform: translate(-50%, -40%);
          transition: none;
        }

        &:has(.item-info.active).modal-transitioned .classified-dgst {
          transform: translate(-60%, -40%);
          transition: none;
        }

        /*
        &:not(.modal-transitioned) .classified-dgst {
        }
        */

        &:has(.item-info.active) .classified-dgst {
          transform: translate(-60%, -50%);
        }

        .classified-dgst {
          overflow: initial;
          transition: transform 0.3s, opacity 0.5s;
          transform: translate(-50%, -50%);
          position: fixed;
          width: 800px;
          top: 50%;
          left: 50%;

          background: #222;
          padding: 8px;
          border-radius: 10px;

          /*
          &::before {
            display: none;
          }
          */

          .dgst-wrapper {
            overflow: inherit;
            flex-direction: row;

            a.dgst-icon {
              position: absolute;

              img {
                transform: scale(1.05);
                width: 150px;
                height: auto;
                left: -180px;
                top: 30px;
                border-radius: 10px;
                box-shadow: 2px 2px 5px #00000050;
              }
            }
          }

          .item-details {
            display: block;
          }

          .row {
            border-radius: 8px;
            margin: 0;
            display: flex;
            flex-direction: column;
          }

          div.extra-info {
            margin-top: 6px;
            display: grid;
            overflow: hidden;
            gap: 10px;

            .data-field {
              display: flex;
              place-content: space-between;
              background-color: #222;
              align-items: center;
              overflow: initial;

              &:has(.icon-info-circle, .time) {
                display: none;
              }

              .data-value:has(.item-stamp) {
                width: 100%;
              }

              &:has(.item-condition, .box-condition) {

              }

              &:has(.location) {
                .location {
                  font-weight: 400;
                }
              }

              small {
                font-weight: 400;
              }

              .data-label {
                padding: 0 12px;
                display: flex;
                height: 100%;
                align-items: center;
                border-bottom: none;
                border-right: 1px dashed #444;
              }

              .data-value {
                padding: 10px 12px;

                .stamp-category {
                  margin: 0;
                }
              }
            }

            .stamp-anchor .tbx-tooltip {
              white-space: break-spaces;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }
          }

          .item-info {
            width: 320px;
            top: 50%;
            left: calc(100% + 32px);
            background: #222;
            border-radius: 10px;
            position: absolute;
            opacity: 0;
            transform: translateY(-40%);
            background: linear-gradient(180deg, #323232, #383838);
            border-radius: 10px;
            transition: transform 0.3s, opacity 0.3s;
            box-shadow: 5px 5px 5px #00000050;
            padding: 16px;
            pointer-events: none;

            /*
            overflow: scroll;
            height: max(100%, 240px);
            */

            &.active {
              opacity: 1;
              transform: translateY(-50%);
              pointer-events: initial;
            }

            .row {
              background: linear-gradient(to bottom, rgba(44, 44, 44, .5), #2c2c2c);

              img {
                display: inline-block;
                width: 16px;
                height: 16px;
                padding: 0 6px 0 0;
                border-radius: 2px;
              }

              small {
                font-weight: 400;
              }

              .data-field {
                display: flex;
                background-color: #222;
                place-content: space-between;
                overflow: initial;

                /*
                &:has(.item-scale) {
                  order: -1;
                  border-top: none;
                  border-bottom: 1px solid #444;
                }
                */

                .data-label {
                  display: flex;
                  align-items: center;
                  padding: 0 12px;
                  border-bottom: none;
                  border-right: 1px dashed #444;
                }

                .data-value {
                  padding: 10px 12px;
                  text-align: end;
                  margin-left: auto;
                }
              }
            }
          }

          .user-images {
            flex-basis: 55%;
            margin: 8px 6px 8px 8px;
            border-radius: 10px;
            overflow: hidden;

            .images-container {
              max-height: min(80vh, calc(100vh - 196px));
              max-height: min(80vh, calc(100vh - 120px));
              display: grid;
              gap: 10px;
              overflow: scroll;
              -ms-overflow-style: none;
              scrollbar-width: none;

              &::-webkit-scrollbar {
                display: none;
              }

              .user-image {
                border-radius: 10px;
                margin: auto;
                object-fit: contain;
                max-width: 100%;
              }
            }
          }

          .dgst-data {
            display: grid;
            gap: 8px;
            padding: 16px;
            margin: 8px 8px 90px 6px;
            align-self: center;
            border-radius: 10px;
            flex-basis: calc(50% - 32px);
            position: relative;
            background: linear-gradient(to bottom, rgba(80, 80, 80, .35), rgba(80, 80, 80, .45));

            & > * {
              margin: 0;
            }

            .scale-company
              .long {
                display: block;
              }
              .short {
                display: none;
              }
            }

            .classified-description {
              display: initial;
              max-height: none;
              white-space: break-spaces;
            }

            .buttons {
              display: flex;
              gap: 10px;
              padding: 8px;
              border-radius: 30px;
              position: absolute;
              left: 50%;
              bottom: 0;
              transform: translate(-50%, calc(100% + 16px));
              background: linear-gradient(to bottom, rgba(80, 80, 80, .50), rgba(80, 80, 80, .65));

              .button {
                background: #222;
                width: 24px;
                height: 24px;
                border-radius: 30px;
                cursor: pointer;
                padding: 10px;
                transition: opacity 0.3s, box-shadow 0.3s;

                &:hover {
                  box-shadow: 0 0 8px #00000050;
                }

                &.report-button {
                  transform: scale(-1, 1);
                }
              }
            }
          }
        }

        .dgst .dgst-wrapper {
          flex-direction: column;

          a.dgst-icon {
            position: initial;

            img {
              transition: transform 0.5s;
              position: absolute;
              height: 100%;
              object-fit: cover;
              object-position: top;
              border-radius: 8px;
            }
          }
        }

        &.placeholder-image {
          .dgst .dgst-wrapper {
            a.dgst-icon {
              img {
                background: linear-gradient(to bottom, rgba(80, 80, 80, .25), rgba(80, 80, 80, 1));
                width: calc(100% - 60px);
                height: auto;
                padding: 30px;
                border-radius: 10px;
              }
            }
          }
        }

        .dgst-data {
          width: calc(100% - 20px);
          transition: transform 0.3s;
          z-index: 1;
          bottom: 0;
          position: absolute;
          padding: 10px;
          border-radius: 8px;
          background-color: #00000090;
          background: linear-gradient(to bottom, rgba(44, 44, 44, .5), #2c2c2c);

          .classified-description {
            transition: -webkit-line-clamp 0.3s, max-height 0.3s;
            max-height: 54px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
          }

          .meta {
            padding: 0;
          }

          * {
            font-family: sans-serif;
          }

          .dgst-meta {
            column-gap: 5px;
          }
        }

        .dgst-anchor .tbx-tooltip,
        .dgst-meta .meta:not(:nth-child(2)),
        .dgst-meta .anchor.user-anchor {
          color: #f8f8f8;
          font-weight: 500;
        }

        .classified-price.meta {
          font-size: 18px;
          color: white;
          padding: 3px 3px 0 0;
          margin-bottom: 3px;
          display: flex;
        }

        .classified-price.meta small {
          font-size: 12px;
          line-height: 12px;
          border-radius: 4px;
          margin: 0 3px;
          align-self: end;
        }

        .dgst-anchor {
          padding: 0;
          max-height: none;
          margin-bottom: 3px;
          line-height: 20px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }

        .meta.category {
          display: none;
        }

        .ratio {
          margin-top: 3px;
        }

        .scale-company {
          margin-bottom: 2px;

          .long {
            display: none;
          }
        }

        .info-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;

          &.price-date {
            margin-top: 5px;
          }

          &:last-child {
            height: 24px;
            align-items: self-end;
          }

          .time {
            margin-bottom: 2px;
          }

          .msrp {
            font-size: 18px;
            /*min-width: 7ch;*/
            line-height: 24px;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
          }

          .cost {
            font-weight: 500;
            font-size: 20px;
            display: flex;
            gap: 6px;
            align-items: flex-end;

            span {
              font-size: 16px;
              opacity: .7;
              margin-bottom: 1px;
            }
          }
        }
      }
    }
  }

  .classified-dgst {
    position: relative;
    width: 100%;
    border-radius: 8px;
    box-shadow: 5px 5px 5px #00000050;
    background: #40222222 !important;
    backdrop-filter: blur(10px) !important;
          transition: opacity 0.5s;

    &:hover::before {
      opacity: 1;
    }

    &.classified-is-highlighted {
      padding: 0;
    }

    /*
    &::before {
      box-shadow: 0 0 5px #00000050;
      content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%23ffffff' viewBox='0 0 256 256'%3E%3Cpath d='M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z'%3E%3C/path%3E%3C/svg%3E");
      transition: opacity 0.3s, box-shadow 0.3s;
      opacity: 0;
      background: #222;
      left: 10px;
      top: 10px;
      width: 24px;
      height: 24px;
      border-radius: 30px;
      cursor: pointer;
      position: absolute;
      z-index: 1;
      padding: 5px;

      &:hover::before {
        box-shadow: 2px 2px 8px #00000050;
      }
    }
    */

    .item-details {
      display: none;
    }
  }
}

`;

document.body.appendChild(styles);

const showRatio = true;

const messageWindowCache = {};

const loading = document.querySelector('#loading');
const windowDiv = document.querySelector('#window');
const windowWrapper = document.querySelector('#window .tbx-target-WINDOW');

const resultElements = document.querySelectorAll('.wrapper > section > .result');
//console.log(resultElements);

if (resultElements.length > 0) {
  const resultsContainer = document.createElement('div');
  resultsContainer.className = 'results';

  resultElements.forEach(element => {
      resultsContainer.appendChild(element.cloneNode(true));
  });

  document.querySelector('.wrapper > section').insertBefore(resultsContainer, resultElements[0]);

  resultElements.forEach(element => {
    element.parentNode.removeChild(element);
  });
}

function handleMutations(mutations) {
  mutations.forEach(mutation => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.querySelector) {
            const newElements = node.querySelectorAll('.classified-dgst .dgst-anchor .tbx-tooltip');
            //console.log(newElements)
            newElements.forEach((element) => {
              initialize.call(element);
            });
            const allTooltips = node.querySelectorAll('.classified-dgst .dgst-wrapper > .tbx-tooltip, .classified-dgst .dgst-anchor .tbx-tooltip');
            //console.log(allTooltips)
            allTooltips.forEach((element) => modalSetup(element));
          }
        }
      });
    }
  });
}

const observer = new MutationObserver(handleMutations);

observer.observe(document.body, {
  childList: true,
  subtree: true
});

const allTooltips = document.querySelectorAll('.classified-dgst .tbx-tooltip');
allTooltips.forEach((element) => modalSetup(element));

function modalSetup(element) {
  const result = element?.closest('.result');
  const cardData = result?.querySelector('.classified-dgst .dgst-data');
  if (! ( result && cardData )) return;

  //if (result.querySelector('.dgst-anchor .tbx-tooltip').textContent.includes('NSFW+')) return;

  windowDiv.classList.add('initialized');

  unbindEvents.call(element);
  element.addEventListener('click', (event) => fetchPage(event));

  function fetchPage(event) {

    event.preventDefault();

    result.classList.add('loading');
    result.classList.add('modal-transitioning');

    const transitionLength = 100;
    const date = new Date();
    const minActive = Date.now() + transitionLength;

    setTimeout(()=> {
      result.classList.add('active');
      result.classList.remove('modal-transitioning');
      result.classList.add('modal-transitioned');
    }, transitionLength)

    if (!result.classList.contains('detail-loaded')) {
      loading.style.display = 'block';

      fetch(element.href)
        .then(response => response.text()) // or response.json() for JSON content
        .then(html => {
          const parser = new DOMParser();
          const details = parser.parseFromString(html, 'text/html').querySelector('#wide .wrapper');

          if (!details) return;

          lockScroll();

          let pictures = [];
          if (details.querySelector('meta[name="pictures"]')) {
            pictures = JSON.parse(decodeURIComponent(details.querySelector('meta[name="pictures"]').content)).map(obj => obj.src);
          }
          const adID = element.href.split('/').pop();

          let userPhotoDiv = document.createElement("div");
          userPhotoDiv.classList.add('item-details');
          userPhotoDiv.classList.add('user-images');

          if (pictures.length > 0) {
            let imagesContainer = document.createElement("div");
            imagesContainer.classList.add('images-container');

            for (let i = 0; i < pictures.length; i++) {
              let userPhoto = document.createElement("img");
              userPhoto.src = pictures[i];
              if (pictures[0]) {
                userPhoto.onload = handleImageLoad;
              }
              userPhoto.classList.add('user-image');
              imagesContainer.appendChild(userPhoto);
            }

            userPhotoDiv.appendChild(imagesContainer);
          }

          else {
            handleImageLoad();
          }

          function handleImageLoad() {
            setTimeout(()=> {
              result.classList.remove('loading');
              result.classList.remove('modal-transitioned');
              loading.style.display = 'none';
            }, Math.max(120, minActive - Date.now()))
          }

          cardData.before(userPhotoDiv);

          result.classList.add('detail-loaded');

          const buttons = document.createElement('div');
          buttons.classList.add('item-details');
          buttons.classList.add('buttons');

          const messageButton = document.createElement('div');
          messageButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ffffff" viewBox="0 0 256 256"><path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"></path></svg>';
          messageButton.classList.add('button');
          messageButton.classList.add('message-button');

          const reportButton = document.createElement('a');
          reportButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#c66" viewBox="0 0 256 256"><path d="M144,69.09V170.91L50.24,199.67A8,8,0,0,1,40,192V48a8,8,0,0,1,10.24-7.67Z" opacity="0.2"></path><path d="M228.54,86.66l-176.06-54A16,16,0,0,0,32,48V192a16,16,0,0,0,16,16,16,16,0,0,0,4.52-.65L136,181.73V192a16,16,0,0,0,16,16h32a16,16,0,0,0,16-16v-29.9l28.54-8.75A16.09,16.09,0,0,0,240,138V102A16.09,16.09,0,0,0,228.54,86.66ZM136,165,48,192V48l88,27Zm48,27H152V176.82L184,167Zm40-54-.11,0L152,160.08V79.92l71.89,22,.11,0v36Z"></path></svg>';
          reportButton.href = `/alert/submit/5/${adID}`;
          reportButton.classList.add('button');
          reportButton.classList.add('report-button');

          const heartOutline = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ff1493" viewBox="0 0 256 256"><path d="M217.36,133.36,128,224,38.64,133.36a50,50,0,0,1,70.72-70.72L128,80l18.64-17.36a50,50,0,1,1,70.72,70.72Z" opacity="0.15"></path><path d="M223,57a58.07,58.07,0,0,0-81.92-.1L128,69.05,114.91,56.86A58,58,0,0,0,33,139l89.35,90.66a8,8,0,0,0,11.4,0L223,139a58,58,0,0,0,0-82Zm-11.35,70.76L128,212.6,44.3,127.68a42,42,0,0,1,59.4-59.4l.2.2,18.65,17.35a8,8,0,0,0,10.9,0L152.1,68.48l.2-.2a42,42,0,1,1,59.36,59.44Z"></path></svg>';
          const heartFilled = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ff1493" viewBox="0 0 256 256"><path d="M240,98a57.63,57.63,0,0,1-17,41L133.7,229.62a8,8,0,0,1-11.4,0L33,139a58,58,0,0,1,82-82.1L128,69.05l13.09-12.19A58,58,0,0,1,240,98Z"></path></svg>';

          const heartButton = document.createElement('div');

          if(details.querySelector('.is-not-liked')) {
            heartButton.innerHTML = heartOutline;
          }
          else {
            heartButton.innerHTML = heartFilled;
          }

          heartButton.classList.add('button');
          heartButton.classList.add('like-button');

          buttons.appendChild(messageButton);
          buttons.appendChild(heartButton);
          buttons.appendChild(reportButton);
          result.querySelector('.dgst-data > *:last-child').after(buttons);

          const extraInfo = document.createElement('div');
          extraInfo.classList.add('item-details');
          extraInfo.classList.add('extra-info');

          const infoWrapper = document.createElement('div');
          infoWrapper.classList.add('data');
          infoWrapper.classList.add('row');

          const dataFields = details.querySelectorAll('.classified-data .data-field:not(:has(.classified-price, .tbx-window, .icon-info-circle, .time)):not(:has(.classified-price)+.data-field:not(:has(.item-condition)');

          dataFields.forEach((field) => {
            if (field.querySelector('.tbx-tooltip')) {
              field.querySelector('.stamp-anchor .tbx-tooltip').innerHTML = 'View Item Page' + field.querySelector('.tbx-tooltip').querySelector('meta').outerHTML;
            }

            infoWrapper.appendChild(field);
          })
          extraInfo.appendChild(infoWrapper);
          result.querySelector('.dgst-data > *:last-child').after(extraInfo);

          result.querySelector('.extra-info .item-stamp .tbx-tooltip').addEventListener('click', getFigureInfo);

          let windowAdded = false;
          function getFigureInfo(event) {
            event.preventDefault();

            if ( ! windowAdded ) {
              loading.style.display = 'block';
              windowAdded = true;
              let url = event.target.href;
              if (! url) {
                url = event.target.closest('.tbx-tooltip');
              }
              fetch(url)
                .then(response => response.text()) // or response.json() for JSON content
                .then(html => {
                  const parser = new DOMParser();
                  const details = parser.parseFromString(html, 'text/html').querySelector('.data-wrapper .data.row');
                  const dataFields = parser.parseFromString(html, 'text/html').querySelectorAll('.data-wrapper .data.row .data-field');
                  const extraInfo = document.createElement('div');

                  dataFields.forEach((field) => {
                    //result.querySelector('.extra-info .data-field:last-child').after(field)
                  })

                  extraInfo.classList.add('item-details');
                  extraInfo.classList.add('item-info');
                  extraInfo.appendChild(details);

                  result.querySelector('.extra-info').after(extraInfo);
                  loading.style.display = 'none';

                  setTimeout(()=> {
                    result.querySelector('.item-info').classList.add('active');
                  }, 20);

                  //result.querySelector('.extra-info .item-stamp .tbx-tooltip').removeEventListener('click', getFigureInfo);
              });
            }
            else {
              result.querySelector('.item-info').classList.toggle('active');
            }
          }

          //button functionality
          result.querySelector('.message-button').addEventListener('click', getMessageWindow);

          function getMessageWindow(event) {
            event.preventDefault();
            if (! messageWindowCache[adID]) {
              loading.style.display = 'block';

              fetch('https://myfigurecollection.net/messages/', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `commit=loadWindow&window=sendMessage&aboutClassifiedId=${adID}`
              })
              .then(response => response.json())
              .then(function(j) {
                messageWindowCache[adID] = j.htmlValues.WINDOW;
                initializeMessageWindow();
              });
            }
            else {
              initializeMessageWindow();
            }
          }

          function initializeMessageWindow() {
            windowWrapper.innerHTML = messageWindowCache[adID];
            windowDiv.style.display = 'block';

            let textarea = windowDiv.querySelector('textarea');
            textarea.focus();
            textarea.selectionStart = textarea.value.length;

            const submitButton = windowDiv.querySelector('input[type="submit"]');
            submitButton.addEventListener('click', sendMessage);

            function sendMessage(event) {
              event.preventDefault();

              loading.style.display = 'block';
              const userIDs = windowDiv.querySelector('input[name="userIds[]"]').value;
              const subject = windowDiv.querySelector('input[name="subject"]').value;
              const content = windowDiv.querySelector('textarea[name="content"]').value;

              fetch('https://myfigurecollection.net/messages/', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `commit=sendMessage&fromThread=0&addressee=&userIds[]=${userIDs}&subject=${subject}&content=${content}`
              })
              .then(response => response.json())
              .then(function(j) {
                document.querySelector('#message .wrapper').innerHTML = j.message;
                document.querySelector('#message').classList.add('active');

                setTimeout(()=> {
                  document.querySelector('#message').classList.remove('active');
                }, 8000);

                loading.style.display = 'none';
                messageWindowClose('', true);
              });
            }

            setTimeout(()=> {
              windowDiv.classList.add('active');
              loading.style.display = 'none';
            }, 20);

            windowWrapper.querySelector('.actions .close').addEventListener('click', () => {
              windowDiv.classList.remove('active');
              setTimeout(()=> {
                windowDiv.style.display = 'none';
              }, 300)
            });
          }

          windowDiv.addEventListener('click', messageWindowClose);

          function messageWindowClose(event, force = false) {
            if (force || !event.target.closest('.tbx-target-WINDOW')) {
              windowDiv.classList.remove('active');
              setTimeout(()=> {
                windowDiv.style.display = 'none';
              }, 300)
            }
          }

          result.querySelector('.like-button').addEventListener('click', (event) => sendLike(event));

          function sendLike(event) {
            loading.style.display = 'block';

            fetch(`https://myfigurecollection.net/classified/${adID}`, {
              method: "POST",
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: `commit=like`
            })
            .then(response => response.json())
            .then(function(j) {
              let container = document.createElement("div");
              container.innerHTML = j.htmlValues.parent;

              if(container.querySelector('.is-not-liked')) {
                event.target.closest('.button').innerHTML = heartOutline;
              }
              else {
                event.target.closest('.button').innerHTML = heartFilled;
              }

              loading.style.display = 'none';
            });
          }

          result.addEventListener('click', (event) => modalClose(event));

          function modalClose(event) {
            if (!event.target.closest('.classified-dgst')) {
              result.classList.add('loading');
              result.classList.add('modal-transitioning');
              unlockScroll();

              setTimeout(()=> {
                result.classList.remove('modal-transitioning');
                result.classList.remove('loading');
                result.classList.remove('active');
              }, 270)
            }
          }

        })
        .catch(error => console.error('Error fetching the URL:', error));
    }
    else {
      setTimeout(()=> {
        result.classList.remove('loading');
        result.classList.remove('modal-transitioned');
        loading.style.display = 'none';
      lockScroll();
      }, Math.max(120, minActive - Date.now()))
    }
  }
}

const initialElements = document.querySelectorAll('.dgst-data .tbx-tooltip');
initialElements.forEach((element) => {
  initialize.call(element);
});

function unbindEvents() {
  let $this=$(this);
  $(this).unbind();
}

let inProgress = false;
let interval;
let count = 0;

function runWithInterval(times = 5, delay = 2700) {
    if (inProgress) return;
    inProgress = true;

    count = 0;
    interval = setInterval(() => {
        count++;
        fetchRandom(); // Call the function with the current count

        if (count >= times) {
            clearInterval(interval); // Stop the interval after `times` executions
            inProgress = false;
        }
    }, delay);
}

function clearInterval2() {
    clearInterval(interval);
    inProgress = false;
}

  async function fetchRandom() {
    const url = `https://myfigurecollection.net/?mode=browse&current=keywords&itemId=0&type=0&isMIB=0&status=0&sort=date&order=desc&minimumPrice=0&maximumPrice=0&currency=USD&categoryId=0&itemCondition=0&boxCondition=0&myFavorites=0&wished=0&isFeatured=0&_tb=classified&page=${Math.floor(Math.random() * 30) + 1}`
    return await fetch(url, {});
  }

function initialize() {
  const tooltip = this;
  const result = this.closest('.result');
  const cardData = result?.querySelector('.classified-dgst .dgst-data');

  if (! ( result && cardData )) return;

  let $this=$(this);
  $(this).unbind();
  let urlRegex = /(https?:\/\/[^\s)]+)(?<!\))/;

  let timeout = '';
  /*
  result.addEventListener('mouseout', () => {
    result.classList.add('transitioning');
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      result.classList.remove('transitioning');
    }, 300);
  });
  */

  const desc = result.querySelector('.classified-description')?.title;
  if (desc) {
    result.querySelector('.classified-description').removeAttribute('title');
    result.querySelector('.classified-description').innerHTML = desc;
    result.style.setProperty('--max-height', result.querySelector('.dgst-meta .classified-description').scrollHeight + 'px');
  }
  result.classList.add('loading');

  setTimeout(()=> {
    result.classList.remove('loading');
  }, 5000);

  let price = parseFloat(result.querySelector('.classified-price-value').innerHTML);

  let freeShip = false;
  if (result.querySelector('small')) {
    result.querySelector('small').innerHTML = 'FS';
    freeShip = true;
  }

  async function fetchWithRetry(url, options = {}, result, retries = 5, delay = 5000) {
    try {
        const response = await fetch(url, options);
        if (response.ok) {
            clearInterval2();
            result.classList.add('loading');
            return response.json(); // Successfully fetched
        } else if (response.status === 500 && retries > 0) {
            result.classList.remove('loading');
            result.classList.add('placeholder-image');

            runWithInterval();
            console.log(`Retrying... (${5 - retries + 1})`);

            await new Promise((res) => setTimeout(res, delay)); //Wait before retrying
            return fetchWithRetry(url, options, result, retries - 1, delay);
        } else {
            throw new Error(`HTTP error: ${response.status}`);
        }
    } catch (error) {
        if (retries > 0) {
            console.log(`Retrying... (${5 - retries + 1})`);
            await new Promise((res) => setTimeout(res, delay)); // Wait before retrying
            return fetchWithRetry(url, options, result, retries - 1, delay);
        } else {
            throw new Error(`Fetch failed after retries: ${error.message}`);
        }
    }
  }

  const vars = tooltip.querySelector('meta').content.split(":");
  if (true) {
    fetchWithRetry('https://myfigurecollection.net/actions.php', {
      method: "POST",
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `commit=loadTooltip&objectId=${vars[1]}&objectType=${vars[0]}`
    }, result)
    .then(function(j) {
      let container = document.createElement("div");
      container.innerHTML = j.htmlValues.TOOLTIP;

      if (true || !tooltip.classList.contains('loaded') && ! j.htmlValues.TOOLTIP.toString().includes('icon-heart')) {
        const iconImg = result.querySelector('img').cloneNode(true);

        if (j.htmlValues.TOOLTIP?.match(urlRegex)) {
          //tooltipA.parentElement.insertBefore(iconImg, tooltipA);
          result.querySelector('img').src = j.htmlValues.TOOLTIP.match(urlRegex)[1].replace('nsp.php?', '?_tb=commit&commit=nsp&').replace(/&amp;/g, '&');
          //console.log(j.htmlValues.TOOLTIP.match(urlRegex)[1])
          //handleImageLoad();
          //result.classList.add('placeholder-image');

          result.querySelector('img').onload = handleImageLoad;
        }
        else {
          result.classList.add('placeholder-image');
          handleImageLoad();
        }

        function handleImageLoad() {
          result.classList.remove('placeholder-image');
          result.classList.remove('loading');
        }

        const msrp = container.querySelector('.over-data li:last-child');
        msrp.classList.add('msrp');

        //let cost = document.createElement("li");
        //cost.classList.add('cost');

        const releaseDate = container.querySelector('.time');

        let ratio = Math.floor(parseInt(msrp.innerHTML.substring(1)) / price);
        let ratioMarkup = ratio;
        if ( !freeShip ) {
          const offsetRatio = Math.floor(parseInt(msrp.innerHTML.substring(1)) / ( price + 20 ));
          ratioMarkup = `${offsetRatio}<span>${ratio}</span>`;
        }

        //cost.innerHTML = ratioMarkup;

        let totalMarkupContainer = document.createElement("div");
        totalMarkupContainer.classList.add('info-container');
        totalMarkupContainer.classList.add('price-date');
        if (isNaN(ratio)) {
          ratioMarkup = '';
          msrp.innerHTML = '';
        }

        let totalMarkup = '';

        if (showRatio) totalMarkup += `<li class="cost">${ratioMarkup}</li>`;

        totalMarkup += `<li class="msrp">${msrp.innerHTML}</li><li class="time">${releaseDate.innerHTML}</li>`;
        totalMarkupContainer.innerHTML = totalMarkup;

        if ( true ) {
          result.querySelector('.dgst-data .dgst-meta:not(:has(+.dgst-meta))').after(totalMarkupContainer);
          //tooltip.closest('.dgst.classified-dgst').after(msrp);
          //tooltip.closest('.dgst.classified-dgst').after(cost);
        }

        if (!showRatio) {
          result.querySelector('.price-date .msrp').style.position = 'initial';
          result.querySelector('.price-date .msrp').style.transform = 'none';
        }

        tooltip.classList.add('loaded');
      }
    });
  }

  const tooltipA = result.querySelector('.dgst-anchor .tbx-tooltip');
  const productName = tooltipA.textContent;

  const scaleRegex = / - 1\/\d+| - Nendoroid  \(#\d+[a-zA-Z]?\)| - Figma  \(#[^()]*\)/;
  const companyRegex = /\([^()]*\)$/;
  const scaleMatch = productName.match(scaleRegex);
  const companyMatch = productName.match(companyRegex);
  let scale = '';
  let company = '';

  if (scaleMatch) {
    scale = scaleMatch[0];
  }
  const nsfwRegex = /\[?(NSFW\+?)\]? - /;
  let scaleTemp = scale.substring(3).split(/\s+/)[0];
  if (nsfwRegex.test(productName)) {
    if (scaleTemp === '') {
      scaleTemp = productName.match(nsfwRegex)[1];
    }
    else {
      scaleTemp += ` <small>${productName.match(nsfwRegex)[1]}</small>`;
    }
  }

  if (companyMatch) {
    company = companyMatch[0];
  }

  const companyTrimmed = trimCompanyName(company);
  const companyNameShort = companyTrimmed.length > 20 ? companyTrimmed.substring(0, 18) + '...' : companyTrimmed;
  const companyNameLonger = companyTrimmed.length > 36 ? companyTrimmed.substring(0, 34) + '...' : companyTrimmed;

  function trimCompanyName( string ) {
    return string.substring(1, company.length - 1).replace('Good Smile Company', 'GSC').replace(' International Ltd', '');
  }

  let scaleCompanyContainer = document.createElement("div");
  scaleCompanyContainer.classList.add('info-container');
  scaleCompanyContainer.classList.add('scale-company');

  const scaleCompanyMarkup = `<li class="scale">${scaleTemp}</li><li class="company"><span class="short">${companyNameShort}</span><span class="long">${companyNameLonger}</span></li>`;
  scaleCompanyContainer.innerHTML = scaleCompanyMarkup;

  if ( scaleMatch || companyMatch ) {
    tooltipA.innerHTML = productName.replace(scale, '').replace(company, '').replace('[NSFW] - ', '').replace('[NSFW+] - ', '') + tooltipA.querySelector('meta').outerHTML;
    result.querySelector('.dgst-anchor').before(scaleCompanyContainer);
  }
}


let scrollPosition = 0;

function lockScroll() {
  const header = document.querySelector('header');
  // Store the current scroll position
  scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

  // Apply position: fixed to lock scroll
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.width = '100%';
  document.body.style.overflowY = 'scroll'; // Keep scroll bar visible

  header.classList.add('hide');

  if (header.style.top === '-64px') {
    header.classList.add('hidden');
  }
}

function unlockScroll() {
  const header = document.querySelector('header');
  // Remove the position: fixed
  document.body.style.position = '';
  document.body.style.top = '';

  // Restore the scroll position
  window.scrollTo(0, scrollPosition);

  setTimeout(()=> {
    header.classList.remove('hide');
    header.classList.remove('hidden');
  }, 300)
}
