// ==UserScript==
// @name           Indavideo Reupload Form
// @name:hu        Indavideo újratöltési űrlap
// @namespace      https://tohka.us
// @version        1.1
// @description    Allows videos to be reuploaded on IndaVideo without using Adobe Flash.
// @description:hu Lehetővé teszi a videók újratöltését az IndaVideóra az Adobe Flash használata nélkül.
// @author         Derzsi Dániel
// @match          https://indavideo.hu/myprofile/myvideos/edit/*
// @license        MIT
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/469677/Indavideo%20Reupload%20Form.user.js
// @updateURL https://update.greasyfork.org/scripts/469677/Indavideo%20Reupload%20Form.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var flashUploadForms = document.querySelectorAll('object[id="SWFUpload_0"]');

  document.head.insertAdjacentHTML(
    "beforeend",
    "<style>.disabledUploading { cursor: not-allowed !important; pointer-events: all !important; }</style>"
  );

  // Iterate over each upload form
  for (var i = 0; i < flashUploadForms.length; i++) {
    var flashUploadForm = flashUploadForms[i];

    // Extract parameters from flash variables
    var paramsQuery = flashUploadForm.querySelectorAll(
      'param[name="flashvars"]'
    );
    var params = Object.fromEntries(new URLSearchParams(paramsQuery[0].value));

    // Create iframe for upload result
    var iframe = document.createElement("iframe");
    iframe.name = "upload-frame";
    iframe.id = "upload-frame";
    iframe.style.display = "none";
    iframe.onload = function () {
      var frame = document.getElementById("upload-frame");
      try {
        // Attempt to access iframe. Since upload.indavideo.com is on another domain, this will always throw an error.
        frame.contentDocument || frame.contentWindow.document;
      } catch {
        // Re-enable upload button
        var submitButton = document.getElementById("uploadFormButton");
        submitButton.disabled = false;
        submitButton.classList.remove("disabledUploading");

        // Set upload file hash in actual upload form
        document.getElementById("upload_file_hash").value =
          document.getElementById("FILE_HASH").value;

        // Hide progress text
        document.getElementById("uploadProgressText").style.display = "none";

        // Show message to user
        alert(
          'A videót feltöltöttük! Ne felejtsd el megnyomni az oldal alján az "Elmentem" gombot a változások elmentéséért!'
        );
      }
    };

    flashUploadForm.parentNode.appendChild(iframe);

    // Create HTML upload form
    var form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", params.uploadURL);
    form.setAttribute("target", "upload-frame");
    form.setAttribute("enctype", "multipart/form-data");

    // Create file input element
    var fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute("name", params.filePostName);
    fileInput.setAttribute("id", "reuploadFileInput");
    fileInput.setAttribute("accept", "video/*");

    // Collect upload parameters
    var allParams = [["Upload", "Submit Query"]];
    var fileParams = params.params.split("&amp;");

    for (var j = 0; j < fileParams.length; ++j) {
      allParams.push(fileParams[j].split("="));
    }

    for (var k = 0; k < allParams.length; ++k) {
      var pair = allParams[k];
      var input = document.createElement("input");

      input.setAttribute("type", "hidden");
      input.setAttribute("name", pair[0]);
      input.setAttribute("id", pair[0]);
      input.setAttribute("value", pair[1]);
      form.appendChild(input);
    }

    // Create submit button
    var submitButton = document.createElement("input");
    submitButton.setAttribute("style", "margin-left: 0.5rem");
    submitButton.setAttribute("id", "uploadFormButton");
    submitButton.setAttribute("type", "submit");
    submitButton.setAttribute("value", "Upload");

    // Add form elements to the form
    form.appendChild(fileInput);
    form.appendChild(submitButton);

    form.addEventListener("submit", function (e) {
      // Check if file has been uploaded
      if (document.getElementById("reuploadFileInput").files.length < 1) {
        e.preventDefault();
        alert("Nem választottál ki még új videót!");
        return;
      }

      // Disable button
      var button = document.getElementById("uploadFormButton");
      button.disabled = true;
      button.classList.add("disabledUploading");

      // Show progress text
      document.getElementById("uploadProgressText").style.display = "block";
    });

    // Create upload progress text
    var progressText = document.createElement("p");
    progressText.setAttribute("id", "uploadProgressText");
    progressText.innerHTML = "Feltöltés alatt...";
    progressText.style.display = "none";

    flashUploadForm.parentNode.appendChild(progressText);

    // Replace flash upload form with HTML upload form
    flashUploadForm.parentNode.replaceChild(form, flashUploadForm);
  }
})();
