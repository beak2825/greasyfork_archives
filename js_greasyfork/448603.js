// ==UserScript==
// @name         QLVB Xem tất cả
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://qlvb.hpnet.vn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hpnet.vn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448603/QLVB%20Xem%20t%E1%BA%A5t%20c%E1%BA%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/448603/QLVB%20Xem%20t%E1%BA%A5t%20c%E1%BA%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    function addStyle(styleText){
           let s = document.createElement('style')
           s.appendChild(document.createTextNode(styleText))
           document.getElementsByTagName('head')[0].appendChild(s)
   }

    const fontAw = document.createElement('link');
    fontAw.setAttribute("rel","stylesheet");
    fontAw.setAttribute("href","https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css")

    document.getElementsByTagName('head')[0].appendChild(fontAw)

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const changeToAll = async () => {


        //await delay(3000);
        console.log("Page loaded");

        if (window.location.search === "?action=901") {
            document.querySelectorAll('[data-status="0"]')[0].click()
        }

        if (window.location.search === "?action=102") {
            console.log(`On Văn bản đến`);

        document.querySelectorAll('[data-status="1"]')[0].click()

        const wrap = document.getElementById('wrap');
        const toast = document.createElement('div');
        toast.classList.add('toast');

        toast.innerHTML=`
                   <div class='xyz'>
                       <div class='toast-icon'>
                          <i class="fa-solid fa-circle-info"></i>
                       </div>
                       <div class='toast-message'>
                           <h3>Chuyển sang xem Tất cả Văn bản</h3>
                           <p>Đang chuyển...</p>
                       </div>
                   </div>
        `

        addStyle(`
              .xyz {
                  position: fixed;
                  display: flex;
                  top: 32px;
                  right: 32px;
                  background-color: #fff;
                  min-width: 400px;
                  max-width: 400px;
                  align-items: center;
                  justify-content: center;
                  padding: 16px;
                  border-left: 4px solid #3ab054;
                  border-radius: 2px !important;
                  box-shadow: 0 5px 10px rgba(0,0,0,0.08);
                  z-index:9999;
                  animation: slideIn ease 0.3s, fadeOut linear 6s forwards;
              }

              .xyz:hover {
                  animation-play-state: paused;
                  cursor: pointer;
                  opacity: 1;
              }

              .toast-icon {
                 font-size: 32px;
                 color: #3ab054;
              }

              .toast-message {
                 margin-left: 24px;
                 flex-grow: 1;
                 line-height: 1.5;
              }

              .toast-message h3 {
                 font-weight: bold;
                 opacity: 0.9;
              }

              .toast-message p {
                 opacity: 0.8;
              }

              @keyframes fadeOut {
                  to {
                     opacity: 0;
                  }
              }

              @keyframes slideIn {
                  from {
                     opacity: 0;
                     transform: translateX(calc(100% + 32px));
                  }

                  to {
                      opacity: 1;
                      transfrom: translateX(0);
                  }
              }



        `)

        wrap.appendChild(toast);
      }
    }

    function insertKey(e) {

    // this would test for whichever key is 40 (down arrow) and the ctrl key at the same time
    if (e.which == 107) {
        // call your function to do the thing
        document.getElementById("txtYkien").value = "Đề nghị lãnh đạo Sở xem xét, ký duyệt ban hành."
    }
}

    window.addEventListener('load', function () {
        changeToAll();
    })

    document.addEventListener('keyup', insertKey, false);

})();