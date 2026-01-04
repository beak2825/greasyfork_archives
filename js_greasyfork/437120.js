// ==UserScript==
// @name         twbuyer
// @namespace    https://mesak.tw
// @version      0.2
// @description  twbuyer include shopping site
// @author       Mesak
// @match        https://24h.pchome.com.tw/prod/*
// @match        https://shopping.pchome.com.tw/prod/*
// @match        https://www.momoshop.com.tw/goods/GoodsDetail.jsp*
// @match        https://tw.buy.yahoo.com/gdsale/gdsale.asp?gdid=*
// @match        https://shopping.udn.com/mall/cus/cat/Cc1c01.do?*
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/437120/twbuyer.user.js
// @updateURL https://update.greasyfork.org/scripts/437120/twbuyer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let twb_main = document.createElement('div');
  let twb_modal = document.createElement('div');
  twb_modal.setAttribute('id', 'twb_modal');
  twb_modal.setAttribute('class', 'twb_modal');
  twb_modal.innerHTML = `<!-- The Modal -->
  <!-- Modal content -->
  <div class="twb_modal-content">
    <span class="twb_close">&times;</span>
    <div id="twb_content"></div>
  </div>`
  twb_main.appendChild(twb_modal);

  let twb_nav_area = document.createElement('div');
  twb_nav_area.setAttribute('id', 'twb_nav_area');
  twb_nav_area.setAttribute('class', 'twb_sidenav');
  twb_nav_area.innerHTML = `<a href="#" id="twb_btn_twbuyer">歷史價</a>`;

  twb_main.appendChild(twb_nav_area);

  document.body.after(twb_main);
  GM_addStyle(`
#twb_nav_area a {
  position: absolute; /* Position them relative to the browser window */
  left: -80px; /* Position them outside of the screen */
  transition: 0.3s; /* Add transition on hover */
  padding: 15px; /* 15px padding */
  width: 100px; /* Set a specific width */
  text-decoration: none; /* Remove underline */
  font-size: 20px; /* Increase font size */
  color: white; /* White text color */
  border-radius: 0 5px 5px 0; /* Rounded corners on the top right and bottom right side */
  z-index: 9998; /* Sit on top */
}
#twb_nav_area a:hover {
  left: 0; /* On mouse-over, make the elements appear as they should */
}
#twb_btn_twbuyer {
  top: 20px;
  background-color: #04AA6D;
}

/* The Modal (background) */
.twb_modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 9999; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

/* Modal Content */
.twb_modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 1000px;
}

/* The Close Button */
.twb_close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.twb_close:hover,
.twb_close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
`);
  document.querySelector('.twb_close').addEventListener('click',() => {
    twb_modal.style.display = "none";
  })
  document.querySelector('#twb_btn_twbuyer').addEventListener('click', () => {
    let baseUrl = location.href;
    let postUrl = 'https://search.twbuyer.info/querybyurl';
    let data = {
      url: baseUrl
    }
    fetch(postUrl, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then(response => response.json())
      .then((response) => {
        // console.log( response )
        if (response.status == 'OK') {
          let targetUrl = `https://twbuyer.info/ec_item/${response.ID}`;
          twb_modal.querySelector('#twb_content').innerHTML = `<iframe src="${targetUrl}" width="960" height="640" frameborder="0" border="0" cellspacing="0"></iframe>`;
          twb_modal.style.display = "block";
        }
      });

  })

})();
