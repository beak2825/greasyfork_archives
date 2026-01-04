// ==UserScript==
// @name         Etsy Getter Module
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  try to take over the world!
// @author       You
// @connect      http://192.168.0.125:7335/
// @match        https://www.etsy.com/au/listing/*/*?*
// @match        https://www.etsy.com/au/listing/*/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466017/Etsy%20Getter%20Module.user.js
// @updateURL https://update.greasyfork.org/scripts/466017/Etsy%20Getter%20Module.meta.js
// ==/UserScript==

if (window.attachEvent) {window.attachEvent('onload', afterLoad);}
else if (window.addEventListener) {window.addEventListener('load', afterLoad, false);}
else {document.addEventListener('load', afterLoad, false);}

function afterLoad () {
  initialiseToastPopup()
  addStyle(`
    .collect_button  {
      position: absolute;
      top: 4px;
      left: 18px;
      z-index: 12345;
      color: white;
      background: black;
      border-radius: 4px;
      padding: 2px;
    }
    .collect_button:hover {
      color: green;
    }
  `);

  getReviewData();
  showToast("Reviewer Module Loaded");
  getShopData()
  showToast("Shop Module Loaded");
}

function initialiseToastPopup(){
  let toast_html = `<div id="toast"><div id="toast-message"></div></div>`;
  let toast_css = `#toast {
      position: fixed;
      z-index: 9999999;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 16px;
      background-color: #333;
      color: #fff;
      border-radius: 8px;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    }
    #toast.standard {
      background-color: #333;
    }
    #toast.bad {
      background-color: red;
      color: white;
    }
    #toast.good {
      background-color: green;
      color: white;
    }

    #toast.show {
      opacity: 1;
    }
  `;
  let toast_elm = document.createElement("div");
  toast_elm.innerHTML = toast_html;
  addStyle(toast_css);
  document.body.appendChild(toast_elm);
}

function showToast(message, message_type="standard") {
  var toast = document.getElementById("toast");
  var toastMessage = document.getElementById("toast-message");

  toastMessage.innerHTML = message;
  while (toast.classList.length > 0) {
    toast.classList.remove(toast.classList.item(0));
  }
  toast.classList.add("show");
  toast.classList.add(message_type);

  setTimeout(function() {
    toast.classList.remove("show");
  }, 3000);
}

function getShopData() {
  //let shop_id = document.getElementsByClassName("follow-shop-listing-header")[0].getElementsByTagName("a")[0].href.split("?")[0].split('/').reverse()[0];
  let shop_id = "_oops";
  try {shop_id = document.querySelectorAll('[data-action="follow-shop-listing-header"]')[0].getElementsByTagName("a")[0].href.split("?")[0].split('/').reverse()[0];}
  catch (e) {shop_id = document.getElementsByClassName("wt-display-inline-flex-xs wt-align-items-center wt-flex-wrap")[0].getElementsByTagName("a")[0].href.split("?")[0].split('/').reverse()[0];}
  let listing_date = dateCConvert(document.getElementsByClassName("wt-pr-xs-2 wt-text-caption")[0].innerText.trim().replace("Listed on ", ""));
  let all_listing_media = document.getElementsByClassName("carousel-pane");
  for (let list_media of all_listing_media) {
    let media_url = "";
    try {
      media_url = list_media.getElementsByTagName("img")[0].src;
    }
    catch (e) {
      media_url = list_media.getElementsByTagName("source")[0].src;
      let media_filename = media_url.split('/').reverse()[0]
      media_url = "https://v-cg.etsystatic.com/video/upload/" + media_filename
      //https://v-cg.etsystatic.com/video/upload/ac_none,du_15,q_auto:good/IMG_1516_opepfo.mp4
    }
    let data_package = {"img_url":media_url, "shop_id":shop_id, "getter":"Etsy", "post_date":listing_date};
    // Add button
    let new_elm = document.createElement("div");
    new_elm.innerHTML = "COLLECT";
    new_elm.classList.add("collect_button");
    new_elm.addEventListener("click", function(e) {
      e.target.style.color = "blue";
      sendPostData(data_package, e.target);
      event.stopPropagation();
    });
    list_media.appendChild(new_elm);
  }
}

function getReviewData() {
  //let all_data = [];
  let all_panes = document.getElementsByClassName("appreciation-pane"); // This is all the review panes
  for (let a_pane of all_panes) {
    let img_elm = a_pane.getElementsByTagName("img")[0];
    let the_img = img_elm.src;
    let buyer_url = "_Inactive";
    try {buyer_url = a_pane.getElementsByClassName("buyer-name")[0].getElementsByTagName("a")[0].href;}
    catch(e) {}

    // 15 Dec, 2022
    let post_date = a_pane.getElementsByClassName("buyer-info")[0].getElementsByTagName("div")[0].innerText.trim();
    post_date = dateCConvert(post_date);

    let data_package = {"img_url":the_img, "buyer_url":buyer_url, "getter":"EtsyReviewers", "post_date":post_date};
    //all_data.push (data_package);

    // Add button
    let new_elm = document.createElement("div");
    new_elm.innerHTML = "COLLECT";
    new_elm.classList.add("collect_button");
    new_elm.addEventListener("click", function(e) {
        e.target.style.color = "blue";
        sendPostData(data_package, e.target);
    });
    a_pane.appendChild(new_elm);

    // Account name part
    let accnameelm = document.createElement("p");
    let acc_name = buyer_url.split('/').reverse()[0];
    let get_href = "http://192.168.0.125:7335/gotoconnect/EtsyReviewers/" + acc_name
    accnameelm.innerHTML = '<a target="_blank" href="' + get_href + '">' + acc_name + '</a>';
    accnameelm.style.zIndex  = "23456";
    a_pane.getElementsByClassName("buyer-name")[0].appendChild(accnameelm);

    // Update the image to show the full thing
    img_elm.src = the_img.replace("_640x640", "_Nx640");
    img_elm.style.width = "auto !important";
    img_elm.setAttribute('style', 'width:auto !important');
    img_elm.style.height = "100%";

  }
}

function addStyle(style_string) {
  var sheet = document.createElement('style');
  sheet.innerHTML = style_string;
  document.body.appendChild(sheet);
}

function dateCConvert(date_string) {
  var dateObj = new Date(date_string);
  var isoDateString = dateObj.toISOString().slice(0,10);
  return isoDateString;
}

function sendPostData(data, target_elm=null) {
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://192.168.0.125:7335/moduleconnect',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data),
        onload: function(response) {
          var data = JSON.parse(response.responseText);
          console.log(data);
          if (data.status == "Good") {
            if (data.downloaded) {
              let text_disp = "Image Downloaded";
              if (data.new) {text_disp += " (new)";}
              showToast(text_disp, "good");
              if (target_elm) {target_elm.innerText = text_disp;}
            }
            else {
              showToast("Already Exists");
              if (target_elm) {target_elm.innerText = "Already Exists";}
            }
          }
          else {
            showToast(data.status, "bad");
          }

            //console.log(response.responseText);
        }
    });
}