// ==UserScript==
// @name        [ABP issue report] Hide visited report + responsive
// @name:vi     [Công cụ báo cáo vấn đề ABP] Ẩn link báo cáo đã xem + responsive
// @namespace   ABPVN
// @match       https://reports.adblockplus.org/*
// @grant       none
// @icon        https://abpvn.com/icon.png
// @version     2.8
// @author      ABPVN
// @run-at      document-end
// @description Hide visisted link in ABP issue report tools, dark mode and responsive support
// @description:vi Ẩn link đã xem trên công cụ báo cáo vấn đề của ABP, hỗ trợ chế độ tối và thiết bị di động
// @downloadURL https://update.greasyfork.org/scripts/405553/%5BABP%20issue%20report%5D%20Hide%20visited%20report%20%2B%20responsive.user.js
// @updateURL https://update.greasyfork.org/scripts/405553/%5BABP%20issue%20report%5D%20Hide%20visited%20report%20%2B%20responsive.meta.js
// ==/UserScript==
var meta = document.createElement('meta');
meta.setAttribute('name', 'viewport');
meta.setAttribute('content','width=device-width, initial-scale=1');
document.head.appendChild(meta);
var styleTag = document.createElement('style');
styleTag.innerHTML = `
th, td {
  word-break: break-word;
}
.cell-url a:visited {
  color: white
}
.quick-update-btn {
  font-size: 20px;
  padding: 10px;
  margin: 15px 0;
  width: 300px;
  color: #23ce1e !important;
  cursor: pointer;
  max-width: 100%;
  border: 1px solid;
  bottom: 0;
  margin: auto;
  left: 0;
  right: 0;
  opacity: 0.7;
  position: fixed;
}
.quick-update-btn:hover,
.quick-update-btn:focus,
.quick-update-btn:active {
  color: #0aea04 !important;
  opacity: 0.85;
}
.quick-update-btn[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
body {
  padding-bottom: 50px;
}
@media screen and (max-width: 768px) {
  .quick-update-btn {
      width: 100%;
  }
}
@media (prefers-color-scheme: dark) {
  body, #tip, #reports, .ui-widget-content, .label, th, td {
    background: #121212 !important;
    color: #e0e0e0 !important;
  }
  .ui-state-default, select, input, textarea, button {
     background: #222 !important;
     color: #e0e0e0 !important;
  }
  .ui-icon {
    filter: invert(1);
  }
  .selected {
    background: #333 !important;
  }
  .ui-widget-content a {
    color: #e0e0e0;
  }
  .cell-url a:visited {
    color: #121212;
  }
  th, td {
    border: 1px solid #e0e0e0;
  }
  a {
    color: #78a9ff;
  }
  .slick-headerrow-column {
    background: #375360 !important;
  }
}`;
document.head.appendChild(styleTag);
function mobileAutoScroll() {
  if (window.innerWidth <= 768) {
    // Auto scroll to link column on mobile screen
    var container = document.querySelector('.slick-viewport');
    if (!container) {
      return;
    }
    container.scrollLeft = document.querySelector('.grid-canvas').scrollWidth - container.offsetWidth
  }
}
if (location.pathname === "/digest") {
  mobileAutoScroll();
} else {
  const SUBMITED_VALUE = "IS_SUBMITED";
  function quickUpdateReport() {
    document.querySelector('.quick-update-btn').setAttribute('disabled', true);
    // Trigger update form
    document.querySelector('.updateLink > a').click();
    document.querySelector('#statusField').value = ".";
    localStorage.setItem(location.pathname, SUBMITED_VALUE);
    document.querySelector('#updateForm').submit();
  }
  if (localStorage.getItem(location.pathname) === SUBMITED_VALUE) {
      // Remove key and back to list report page
      localStorage.removeItem(location.pathname);
      if (history.length > 2) {
        history.go(-2);
      } else {
        history.back();
      }
      return;
    } else {
      console.log("Adding quickUpdateReport button");
      // Add quick submit button
      const button = document.createElement('button');
      button.innerText = "Quick update";
      button.className = 'quick-update-btn';
      button.addEventListener('click', quickUpdateReport);
      document.body.appendChild(button);
  }
  document.addEventListener("keyup", function(e) {
    if (e.key === ".") {
      quickUpdateReport();
    }
  });
}
