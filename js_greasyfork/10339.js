
// ==UserScript==
// @name         Image drag-n-drop uploader for vozforums.net
// @version      1.3
// @description  Upload image without watermarking for vozforums.net
// @namespace    image-uploader-voz
// @author       Huy không at fb.me/huykhoong
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     dropzone  http://phpvenus.com/voz/dropzone.css

// Website list

// @match        *://*.vozforums.com/*

// End list


// @downloadURL https://update.greasyfork.org/scripts/10339/Image%20drag-n-drop%20uploader%20for%20vozforumsnet.user.js
// @updateURL https://update.greasyfork.org/scripts/10339/Image%20drag-n-drop%20uploader%20for%20vozforumsnet.meta.js
// ==/UserScript==
// 
var jqUI_CssSrc = GM_getResourceText ("dropzone");
GM_addStyle (jqUI_CssSrc);

function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

// the guts of this userscript
function main() {
  jQ.cachedScript = function( url, options ) {
 
    // Allow user to set any option except for dataType, cache, and url
    options = jQ.extend( options || {}, {
      dataType: "script",
      cache: true,
      url: url
    });
   
    // Use jQ.ajax() since it is more flexible than jQ.getScript
    // Return the jqXHR object so we can chain callbacks
    return jQ.ajax( options );
  };
   
  // Usage
  jQ.cachedScript( "http://phpvenus.com/voz/dropzone.js" ).done(function( script, textStatus ) {
    jQ('div.dz-message').html('<b>Công cụ upload ảnh.</b><br><span class="note">Kéo thả ảnh hoặc click vào khung này</span> ');
    Dropzone.autoDiscover = false;
    var md = new Dropzone("#mydropzone", {
        init: function() {
          this.on("addedfile", function(file) {  });
          this.on("success", function(file, response) { 
            if(response.indexOf('http') > -1){
              var textarea = document.querySelector('.vBulletin_editor textarea');
              textarea.value += '[IMG]'+response+'[/IMG]' + "\n";              
            }else{
              alert(response);
            }
          });
        },
        method: 'post',
        url: "http://phpvenus.com/voz/uploader.php", 
        maxFilesize: "5", 
        addRemoveLinks: true,
        paramName: "file",
        maxFiles : "10",
        previewsContainer: null,
        autoProcessQueue : true
    });
   
  });

 
}

function add_uploader(){
    var t = jQ("a[href='http://pik.vn/']").first().parent();
    t.append('<div id="dropzone"><form action="/file-upload" class="dropzone" id="mydropzone"><div class="dz-message">Đang tải ...</div></form></div>');
}

// load jQuery and execute the main function
// 
addGlobalStyle('#dropzone{margin-top:10px');
addGlobalStyle('.dropzone {  border: 2px dashed #0087F7;  border-radius: 5px;  background: white; padding:10px;');
addGlobalStyle('.dropzone .dz-preview {  margin: 5px; }');
addGlobalStyle('.dz-remove{display:none !important}');
addJQuery(add_uploader);
addJQuery(main);
