// ==UserScript==
// @name         Javlib Emby Highlighter and Redirector
// @namespace    https://github.com/CtkGHoSt/emby_highlighter
// @version      0.1.3
// @description  在javlib高亮emby存在的视频，并在详情页提供一键跳转功能
// @author       ctkghost
// @match        https://www.javlibrary.com/*
// @require http://code.jquery.com/jquery-latest.js
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474687/Javlib%20Emby%20Highlighter%20and%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/474687/Javlib%20Emby%20Highlighter%20and%20Redirector.meta.js
// ==/UserScript==

var embyAPI = GM_getValue("emby_api");
var embyBaseUrl = GM_getValue("emby_base_url");

if (!embyAPI || !embyBaseUrl) {
  alert("No EmbY_API and EmbY_BASE_URL / 未设置emby_api和emby_base_url");
  let _emby_base_url = prompt(
    'emby_base_url：'
  );
  let _emby_api = prompt("emby_api：");
  if (_emby_api && _emby_base_url) {
    GM_setValue("emby_api", _emby_api);
    GM_setValue("emby_base_url", _emby_base_url);
  }
  alert("Reload Page / 刷新页面");
  location.reload();
  return;
}

(function () {
  let allVideo = $(".video");
  console.log(allVideo);
  if (allVideo.length > 0) {
    // list page
    for (let i = 0; i < allVideo.length; i++) {
      let bango = allVideo[i].children[0].title.split(" ")[0];
      if (bango.length == 0) {
        bango = allVideo[i].children[1].title.split(" ")[0];
      }
      console.log(bango);
      GM_xmlhttpRequest({
        method: "GET",
        url:
            embyBaseUrl+"emby/Users/"+embyAPI+"/Items?api_key="+embyAPI+
            "&Recursive=true&IncludeItemTypes=Movie&SearchTerm="+bango,
        headers: {
          accept: "application/json",
        },
        onload: (res) => {
            let rr = JSON.parse(res.responseText);
            console.log(rr);
            if(rr.Items.length>0){
                allVideo[i].style.backgroundColor = "HotPink";
            }
        },
      });
    }
  } else {
    // info page
    let bango = $("#video_id").children()[0].children[0].children[0].children[1].innerHTML;
    GM_xmlhttpRequest({
        method: "GET",
        url:
          embyBaseUrl+"emby/Users/"+embyAPI+"/Items?api_key="+embyAPI+
          "&Recursive=true&IncludeItemTypes=Movie&SearchTerm="+bango,
        headers: {
          accept: "application/json",
        },
        onload: (res) => {
          let rr = JSON.parse(res.responseText);
          console.log(rr);
          for (let idx = 0; idx < rr.Items.length; idx++) {
            let _emby_url =
              embyBaseUrl +
              "web/index.html#!/item?id=" +
              rr.Items[idx].Id +
              "&serverId=" +
              rr.Items[idx].ServerId;
            console.log(_emby_url);
            $("#video_info").append(
              '<div style="border:3px solid HotPink" class="item"><b><a href="' +
                _emby_url +
                '" target="_blank" >' +
                "<font size=6>跳转到emby👉</font></a></b>" +
                "</div>"
            );
            $("#video_info").append("<br>");
          }
        },
      });
  }
})();
