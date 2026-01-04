// ==UserScript==
// @name        Pixeldrain unlimited download
// @namespace   Violentmonkey Scripts
// @match       https://pixeldrain.com/u/*
// @match       https://pixeldrain.com/l/*
// @grant       none
// @version     1.7.2
// @author      -
// @description 8/24/2025, 1:10:16 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547073/Pixeldrain%20unlimited%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/547073/Pixeldrain%20unlimited%20download.meta.js
// ==/UserScript==
// jshint esversion:6

const api_base = "https://cdn.pd1.workers.dev/api/file/";

function aria2_try_add() {
  const toolbar = document.querySelector(".toolbar")
  const current = toolbar.querySelector("a#aria2-input-file");
  if (current !== null) {
    return;
  }

  const button = toolbar.querySelector("button.button.svelte-1bj9uys");

  const album_urls = Array.from(
    document.querySelectorAll("a.file.svelte-zfpa77 > div")
  ).map(div =>
    api_base + div.style["background-image"].split("/")[3]
  );

  if (album_urls.length === 0) {
    return;
  }

  const file_id = document.location.href.split("/").pop().split("#")[0];
  const aria2_input = document.createElement('a');

  aria2_input.id = "aria2-input-file";
  aria2_input.href = "data:text/plain;base64,"+btoa(album_urls.join("\n") + "\n");
  aria2_input.download = `${file_id}.txt`;
  aria2_input.innerHTML = '<button class="toolbar_button svelte-jngqwx" title="export DDL links as an aria2 input file"><i class="icon">download</i> <span class="svelte-jngqwx">Aria2 input</span></button>';
  toolbar.insertBefore(aria2_input, button);
}

function add_ddl_zip() {
  const file_id = document.location.href.split("/").pop().split("#")[0];
  const toolbar = document.querySelector(".toolbar");
  const button = toolbar.querySelector("button.button.svelte-1bj9uys");

  const link = document.createElement('a');
  link.href = `https://cdn.pd1.workers.dev/api/list/${file_id}/zip`;
  link.innerHTML = '<button class="toolbar_button svelte-jngqwx" title="Download all files in this album as a zip archive, from cloudflare"><i class="icon">download</i> <span class="svelte-jngqwx">DDL all files</span></button>';

  toolbar.insertBefore(link, button);
  aria2_try_add();
}

function add_ddl_button() {
  const description = document.querySelector("div.description");
  if (description === null) {
    return;
  }

  const current = description.querySelector("#cf-ddl-button");
  if (current !== null) {
    description.removeChild(current);
  }
  // Create the anchor element
  const link = document.createElement('a');
  link.id = "cf-ddl-button";

  if (document.location.hash.startsWith("#item=")) {
    const file_id = document.querySelector(".block.svelte-40do4p > img").src.split("/api/file/")[1].split("/")[0];
    link.href = api_base + file_id;
  } else {
    const file_id = document.location.href.split("/").pop().split("#")[0];
    link.href = api_base + file_id;
  }
  link.innerHTML = '<button class="button_highlight"><i class="icon">download</i> <span>Direct Download</span></button>';


  description.appendChild(link);
}

window.addEventListener('load', () => {
  if (
    document.location.pathname.startsWith("/u/")
  ) {
    add_ddl_button();
  }
  else if (
    document.location.pathname.startsWith("/l/")
  ) {
    add_ddl_button();
    add_ddl_zip();
    window.addEventListener('hashchange', function(event) {
      if (event.newURL.search("#item=") !== -1) {
        add_ddl_button();
      } else {
        aria2_try_add();
      }
    });
  }

}, false);
