// ==UserScript==
// @name        Gitlab
// @namespace   Violentmonkey Scripts
// @match       https://code.byted.org/BES/ustack2.0/pipelines/*
// @grant       none
// @version     1.4
// @author      Wenqing Luo
// @description 3/8/2020, 8:42:28 PM
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@1
// @require https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @grant GM_addStyle
// @grant GM_getResourceText
// @grant GM_getResourceURL
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/425648/Gitlab.user.js
// @updateURL https://update.greasyfork.org/scripts/425648/Gitlab.meta.js
// ==/UserScript==
element = document.querySelector("#content-body > div.container-fluid.container-limited.js-pipeline-container > div.tabs-holder > ul");
// console.log(element.innerHTML)
function cssElement(url) {
  var link = document.createElement("link");
  link.href = url;
  link.rel="stylesheet";
  link.type="text/css";
  return link;
}

// GM_addStyle ( `
//     .banner_url {
//         background: url('http://www.pxleyes.com/images/contests/kiwis/fullsize/sourceimage.jpg') no-repeat center center fixed !important;
//         -webkit-background-size: cover !important;
//         -moz-background-size: cover !important;
//         -o-background-size: cover !important;
//         background-size: cover !important;
//     }
// ` );

function b64DecodeUnicode(str) {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(atob(str).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }


let data = null;

unsafeWindow.$(document).ready(function() {
    let pipeline = window.location.href.replace("/builds", "").split("/").pop();
  console.log(pipeline)
    
    console.log(pipeline)
    GM_xmlhttpRequest({
      method: "GET",
      url: `http://10.227.4.66:8500/v1/kv/pipeline/${pipeline}`,
      onload: function(response) {
        try {
          data = JSON.parse(b64DecodeUnicode(((JSON.parse(response.responseText))[0].Value)))
          console.log(data)
          let total = 0;
          let success = 0;
          for(let job in data) {
            const cur = data[job];


            cur.forEach((item) => {
              total += 1
              success += (item['code'] == 0)
            })
          }

          element.innerHTML += (`<li class="js-builds-tab-link"><a id="test-tab" data-target="#js-tab-test" data-action="test" data-toggle="tab" class="test-tab" href="/BES/ustack2.0/pipelines/${pipeline}">E2E Tests<span class="badge badge-pill js-test-counter" style="background-color: #09af00; color: white; margin: 0px 2px;">${success}</span><span class="badge badge-pill js-test-counter" style="background-color: #e54304; color: white;margin: 0px 1px;">${total-success}</span></a></li>`)

        } catch(e) {
          console.log(e)
          element.innerHTML += (`<li class="js-builds-tab-link"><a  data-target="#js-tab-test" data-action="test" data-toggle="tab" href="/BES/ustack2.0/pipelines/5851694">E2E Tests<span class="badge badge-pill js-test-counter" style="background-color: #e54304; color: white;margin: 0px 3px;">Not Available</span></a></li>`)
        }
        
        
        $("#test-tab").click((e) => {
          console.log(e)
          const content = $(".tab-content");
          let result = ""
          let rows = ""
          let fail_svg = "/assets/icons-d23cd916bb585cd0797512298022ad487818b74e89464b6738f695aa33107e94.svg#status_failed"
          let succ_svg = "/assets/icons-d23cd916bb585cd0797512298022ad487818b74e89464b6738f695aa33107e94.svg#status_success"
          for(let suite in data) {
            const cur = data[suite];
            console.log(cur)
            cur.forEach((item, index) => {
              rows += `<div class="gl-responsive-table-row rounded align-items-md-start mt-xs-3 js-case-row">
          <div class="table-section section-10 section-wrap">
             <div role="rowheader" class="table-mobile-header">Suite</div>
             <div class="table-mobile-content gl-md-pr-2 gl-overflow-wrap-break"><span class="text-break">${suite}</span></div>
          </div>
          <div class="table-section section-20 section-wrap">
             <div role="rowheader" class="table-mobile-header">Name</div>
             <div class="table-mobile-content gl-md-pr-2 gl-overflow-wrap-break"><span class="text-break">${item['name']}</span></div>
          </div>
          <div class="table-section section-30 section-wrap">
             <div role="rowheader" class="table-mobile-header">Description</div>
             <div class="table-mobile-content gl-md-pr-2 gl-overflow-wrap-break">
                ${item['desc']}
             </div>
          </div>
          <div class="table-section section-10 section-wrap">
             <div role="rowheader" class="table-mobile-header">Status</div>
             <div class="table-mobile-content text-center">
                <div class="ci-status-icon d-flex align-items-center justify-content-end justify-content-md-center ci-status-icon-${item['code'] == 0 ? 'success' : 'failed'}">
                   <svg data-testid="status_success-icon" aria-hidden="true" class="gl-icon s24">
                      <use href="${item['code'] == 0 ? succ_svg : fail_svg}"></use>
                   </svg>
        
                </div>
             </div>
          </div>
          <div class="table-section section-10 section-wrap">
             <div role="rowheader" class="table-mobile-header">
                Duration
             </div>
             <div class="table-mobile-content pr-sm-1">
                ${ item['time'] < 0.01 ? item['time'].toExponential(3) : item['time'].toFixed(3)}s
             </div>
          </div>
          <div class="table-section section-10 section-wrap">
             <div role="rowheader" class="table-mobile-header">Details</div>
             <div class="table-mobile-content">
                <button type="button" suite="${suite}" index="${index}" class="btn btn-default btn-md gl-button stcp-detail">
                   <span class="gl-button-text">View details</span>
                </button>
             </div>
          </div>
       </div>`
            })
          }
          result = `<div>
    <div class="row gl-mt-3">
       <div class="col-12">
          <h4>Tests</h4>
       </div>
    </div>
    <div class="test-reports-table gl-mb-3 js-test-cases-table">
       <div role="row" class="gl-responsive-table-row table-row-header font-weight-bold fgray">
          <div role="rowheader" class="table-section section-10">
             Suite
          </div>
          <div role="rowheader" class="table-section section-20">
             Name
          </div>
          <div role="rowheader" class="table-section section-30">
             Description
          </div>
          <div role="rowheader" class="table-section section-10 text-center">
             Status
          </div>
          <div role="rowheader" class="table-section section-10">
             Duration
          </div>
          <div role="rowheader" class="table-section section-10">
             Details
          </div>
       </div>
       ${rows}
    </div>
 </div>

` 
          content.html(result)
          $(".pipeline-tab").click(function(e) {
             console.log(e);
            window.location.href = `/BES/ustack2.0/pipelines/${pipeline}`
          });
          $(".builds-tab").click(function(e) {
             console.log(e);
            window.location.href = `/BES/ustack2.0/pipelines/${pipeline}/builds`
          });
          
          $(".stcp-detail").click(function(e) {
            const suite = $(this).attr("suite");
            const idx = $(this).attr("index");
            const result = (data[suite][idx].result)
            const win = window.open("", `31231`, "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=400,top="+(screen.height-600)+",left="+(screen.width-1040));
            let content = "";
            for(let i = 0; i < result.length; i++) {
              content += `${result[i].result}\n`
            }
            win.document.body.innerHTML = `<pre>${content}<pre>`;
          })
        });
      }
    });
}); 
