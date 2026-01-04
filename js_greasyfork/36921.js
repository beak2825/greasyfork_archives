// ==UserScript==
// @name           PTPIMG Paster
// @description    ctrl+v your images on ptpimg
// @author         mrpoot
// @version        0.0.3
// @match          https://ptpimg.me/
// @grant          none
// @run-at         document-end
// @namespace https://greasyfork.org/users/148773
// @downloadURL https://update.greasyfork.org/scripts/36921/PTPIMG%20Paster.user.js
// @updateURL https://update.greasyfork.org/scripts/36921/PTPIMG%20Paster.meta.js
// ==/UserScript==

(() => {

/* COPY & PASTE ZONE
 *
 * This code is ripped from PTPIMG index.js because too lazy to re-implement.
 */
const $btn = $('#form_file_upload .btn[type="submit"]');

const LOADING = () => {
  const start = Date.now();
  $btn.prop('disabled', true);
  $btn.data('interval', setInterval(function() {
    $btn.text('Uploading... ' + ((Date.now() - start) / 1e3).toFixed(1) + 's');
  }, 100));
};

const HANDLE_RESPONSE = resp => {
  clearInterval($btn.data('interval'));
  $btn.text('Upload');
  $btn.prop('disabled', false);
  var $payloadArea = $('#payload_area');
  $('.row', $payloadArea).remove();
  if (!resp.length) {
      $('#panel_error', $payloadArea).css('display', '');
  } else {
      $('#panel_error', $payloadArea).css('display', 'none');
  }
  var begRow = '<div class="row">';
  var imageRow = begRow;
  var bbcode1 = '<div class="row" id="upload-links"><div id="bbcode" class="col-xs-6"><div class="form-group"><div class="well"><textarea rows="5" name="bbcode-links" style="width: 100%;" class="form-control" onclick="this.select();">';
  var bbcode2 = "</textarea></div></div></div>";
  var direct1 = '<div id="direct" class="col-xs-6 form-group"><div class="form-group"><div class="well"><textarea rows="5" name="direct-links" style="width: 100%;" class="form-control" onclick="this.select();">';
  var direct2 = "</textarea></div></div></div></div>";
  var images1 = '<div class="row" id="upload-images">';
  var images2 = "</div>";
  var bbcode = "";
  var direct = "";
  var images = "";
  $.each(resp, function(i, data) {
      var local_url = data.code + '.' + data.ext;
      var full_url = 'https://ptpimg.me/' + local_url;
      var newImage = '<div class="col-xs-6 col-md-3 col-same"><div class="well"><a href="' + local_url + '" class="thumbnail"><img src="' + local_url + '" /></a></div></div>';
      imageRow += newImage;
      bbcode += "[img]" + full_url + "[/img]\n";
      direct += full_url + "\n";
      if ((i + 1) % 4 === 0 || (i + 1) === resp.length) {
          images += imageRow;
          imageRow = begRow;
      }
  });
  $payloadArea.append(bbcode1 + bbcode + bbcode2 + direct1 + direct + direct2 + images1 + images + images2);
};

/* END OF COPY & PASTE ZONE */

document.addEventListener('paste', ({ clipboardData = {} }) => {
  if ($btn.prop('disabled')) {
    return;
  }

  const { items } = clipboardData;

  const files = items &&
    [...items].filter(item => /^image\//.test(item.type))
    .map(item => item.getAsFile());

  if (files && files.length) {
    const form = document.querySelector('form');
    const body = new FormData(form);

    body.delete('file-upload[]');

    files.forEach(file =>
      body.append('file-upload[]', file, file.name || btoa(Math.random()))
    );

    LOADING();

    fetch('/upload.php', {
      credentials: 'include',
      method: 'POST',
      body
    })
    .then(response => response.json())
    .then(HANDLE_RESPONSE)
    .catch((e) => {
      alert('see console for error info');
      console.error('something fucked up:', e);
    });
  }
});

})();