// ==UserScript==
// @name        Auto downloader of information hitomi.la
// @name:ru     Авто загрузчик информации hitomi.la
// @namespace   hitomi_la_dw_info_nyako
// @match       https://hitomi.la/cg/*
// @match       https://hitomi.la/imageset/*
// @match       https://hitomi.la/manga/*
// @match       https://hitomi.la/anime/*
// @match       https://hitomi.la/gamecg/*
// @match       https://hitomi.la/doujinshi/*
// @grant       none
// @version     0.1b
// @author      https://t.me/Nyako_TW
// @license     Apache License 2.0
// @description 07.04.2025, 14:52:41
// @description:ru 07.04.2025, 14:52:41
// @downloadURL https://update.greasyfork.org/scripts/532797/Auto%20downloader%20of%20information%20hitomila.user.js
// @updateURL https://update.greasyfork.org/scripts/532797/Auto%20downloader%20of%20information%20hitomila.meta.js
// ==/UserScript==

function download_json(json_ready_data, artist_manga, title_manga) {
  const jsonString = JSON.stringify(json_ready_data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = title_manga+" - "+artist_manga;
  document.body.appendChild(a);
  a.click();
}

document.getElementById("dl-button").onclick = function() {
    url_manga = window.location.href;
    title_manga = document.getElementById("gallery-brand").innerText;
    artist_manga = document.getElementById("artists").innerText;
    artist_manga_url = document.getElementById("artists").getElementsByTagName("a")[0].href;
    date_upload = document.getElementsByClassName("gallery-info")[0].children[1].innerText;
    info_manga = document.getElementsByClassName("gallery-info")[0].children[0];
    tmp1_all_row = info_manga.getElementsByTagName("tr");
    json_row_data = {};
    for (const tmp2_one_row of tmp1_all_row) {
      tmp3_one_row = tmp2_one_row.getElementsByTagName("td");
      ready_name_row = tmp3_one_row[0].innerText;
      tmp4_values_row = tmp3_one_row[1];
      if (tmp4_values_row.children.length == 0) {
        ready_value_row = tmp4_values_row.innerText;
      } else {
        if (tmp4_values_row.getElementsByTagName("li").length == 0) {
          ready_value_row = tmp4_values_row.innerText;
        } else {
        tmp5_values_row = tmp4_values_row.getElementsByTagName("a");
        ready_value_row = [];
        for (const tmp6_one_value of tmp5_values_row) {
          row_data = {
            name:tmp6_one_value.innerText,
            url:tmp6_one_value.href
          };
          ready_value_row.push(row_data);
        }
          }
      }
      json_row_data[ready_name_row] = ready_value_row;
    }
    json_ready_data = {
      site:"hitomi.la",
      name:title_manga,
      url:url_manga,
      artist_manga:artist_manga,
      artist_manga_url:artist_manga_url,
      date_upload:date_upload,
      meta_data:json_row_data
    };
    console.log(json_ready_data);
    download_json(json_ready_data, artist_manga, title_manga);
  };