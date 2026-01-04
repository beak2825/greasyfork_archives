// ==UserScript==
// @name        Fernus URL
// @description Fernus tarafından yayınlanan video çözüm kategorilerini link olarak kaydetmenizi ve tek tıkla açmanızı sağlar
// @include        *.frns.in*
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @grant       none
// @version 1.0.2
// @namespace https://greasyfork.org/users/1266596
// @downloadURL https://update.greasyfork.org/scripts/488222/Fernus%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/488222/Fernus%20URL.meta.js
// ==/UserScript==

const fernus_url_script_query = new URLSearchParams(window.location.search);
if (fernus_url_script_query.has("fc")) {
  get_contents(fernus_url_script_query.get("fc"));
  window["fernus_url_loc"] = `/?fc=${fernus_url_script_query.get("fc")}`;
} else if (fernus_url_script_query.has("fs")) {
  get_sources(fernus_url_script_query.get("fs"));
  window["fernus_url_loc"] = `/?fs=${fernus_url_script_query.get("fs")}`;
}
$("header")
  .first()
  .append(
    `<button id="frns-url-grab" class="pix-btn btn-outline m-0 mt-1 text-center p-2 float-left" style="color: white !important; width: 110px; height: calc(100% - 15px); position: absolute; top: 5px; left: 7px; z-index: 9999;">🔗 Kaydet</button>`
  );
if (navigator["share"]) {
  $("header")
    .first()
    .append(
      `<button id="frns-url-share" class="pix-btn btn-outline m-0 mt-1 text-center p-2 float-left" style="color: white !important; width: 110px; height: calc(100% - 15px); position: absolute; top: 5px; left: 125px; z-index: 9999;">🌐 Paylaş</button>`
    );
  $("#frns-url-share").on("click", function () {
    const url = !window["fernus_url_loc"]
      ? window.location.origin
      : window.location.origin + window["fernus_url_loc"];
    try {
      navigator.share({
        url: url,
      });
    } catch (err) {}
  });
}
const oldgc = get_contents;
const oldgs = get_sources;
window["get_contents"] = function (id) {
  window["fernus_url_loc"] = `/?fc=${id}`;
  oldgc(id);
};
window["get_sources"] = function (id) {
  window["fernus_url_loc"] = `/?fs=${id}`;
  oldgs(id);
};
$("#frns-url-grab").on("click", function () {
  if (window["fernus_url_loc"]) {
    const url = window.location.origin + window["fernus_url_loc"];
    try {
      navigator.clipboard.writeText(url);
      alert("URL panoya kopyalandı!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  } else {
    try {
      navigator.clipboard.writeText(window.location.origin);
      alert("URL panoya kopyalandı!");
    } catch (err) {}
  }
});