// ==UserScript==
// @name          Image Webinfo
// @name:zh-CN    图片网页信息提取
// @version       1.4.0
// @description   Extract JSON-/string-style info from Pixiv/Twitter/Booru image pages.
// @description:zh-CN 将 Pixiv/Twitter/Booru 图片页面中的信息以 JSON 或字符串形式导出。
// @author        wklchris
// @match         https://danbooru.donmai.us/posts/*
// @match         https://www.pixiv.net/artworks/*
// @match         https://x.com/*/status/*
// @grant         none
// @license       MIT
// @namespace https://greasyfork.org/users/672201
// @downloadURL https://update.greasyfork.org/scripts/502234/Image%20Webinfo.user.js
// @updateURL https://update.greasyfork.org/scripts/502234/Image%20Webinfo.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  // --- Customization ---
  // Specify returned keys when copy string
  const pixiv_str_keys = [
    // 'artist',
    // 'illust_id',
    'artist_id',
    'post_date',
    'post_title'
  ];
  const booru_str_keys = [
    // 'artists',
    // 'copyrights',
    // 'characters',
    // 'general',
    'booru_id',
    'rating_level'
  ];
  const website_prefix_dict = {
    'pixiv.net': '',
    'fanbox.cc': 'PF',
    'patreon.com': 'PT',
    'twitter.com': 'T',
    'x.com': 'T',
    'arca.live': 'AC',
    'artstation.com': 'AS',
    'bilibili.com': 'B',
    'deviantart.com': 'D',
    'weibo.com': 'WB'
  };
  
  // --- Main ---
  let artwork_data = {};
  let export_json_btn = document.createElement("button");
  export_json_btn.innerHTML = "Export WebInfo as JSON";
  let export_str_btn = document.createElement("button");
  export_str_btn.innerHTML = "Export WebInfo as String";

  // General functions
  function logMessage(msg) {
    console.log("[ImageWebInfo] " + msg);
  }
  
  let popMessage = 'Image webinfo exported to clipboard.';
  function copyToClipboard(s) {
    try {
      navigator.clipboard.writeText(s);
    } catch (err) {
      popMessage = 'Image webinfo export failed.';
      logMessage(popMessage);
    }
  }

  function attemptedQuerySelector(qs, callback) {
    // querySelector may not find the element when the website loads slowly.
    // Keep attempting until found or exceed the given maximum attempts.
    var attempts = 0, max_attempts = 20;
    var attemptCall = function() {
        var elem = document.querySelector(qs);
        if (elem) {
          console.log(`Found querySelector '${qs}' in ${attempts} attempts`);
          return callback(elem);
        } else {
            attempts++;
            if (attempts >= max_attempts) {
                console.warn(`Could not find: ${qs} within ${max_attempts} attempts`);
            } else {
                setTimeout(attemptCall, 4000*(attempts + 1)/max_attempts + 1000)
            }
        }
    };
    attemptCall();
  }

  async function downloadWithCustomName(url, filename) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
      console.error('Fail in downloading with customized name: ', error);
      // Open the link directly when fail
      window.open(url, '_blank');
    }
  }

  // --- Pixiv posts ---

  if (location.hostname.includes("pixiv")) {
    function getPixivInfo(as_JSON=true) {
      let data = {};
      // Get user
      let user_tag = document.querySelector('aside div[aria-haspopup="true"] > div > a');
      data['artist'] = user_tag.childNodes[0].innerText 
      let split_user_url = user_tag.href.split('/');
      data['artist_id'] = split_user_url[split_user_url.length - 1];
      // Get post id
      let split_url = location.href.split('/');
      data['illust_id'] = split_url[split_url.length - 1];
      // Get upload date
      let timestr = document.getElementsByTagName('time')[0].innerText;
      let time_seps = {'year': '年', 'month': '月', 'day': '日'};
      let i_start = 0, i_end = -1, tmp_data = {};
      for (const [key, sep] of Object.entries(time_seps)) {
        i_start = i_end+1;
        i_end = timestr.search(sep);
        tmp_data[key] = timestr.substring(i_start, i_end);
      }
      data['post_date'] = `${tmp_data['year']}-${tmp_data['month'].padStart(2, 0)}-${tmp_data['day'].padStart(2, 0)}`;
      // Get post title (if having a title)
      let title_dom = document.querySelector('figcaption h1');
      data['post_title'] = title_dom ? title_dom.innerText : '' ;

      let s = "";
      if (as_JSON == true) {
        s = JSON.stringify(data)
      } else {
        s = pixiv_str_keys.map((x, i) => data[x]).join("\t");
      }
      copyToClipboard(s);
      return data;
    }

    // Add buttons & their click functions
    let search_booru_btn = document.createElement("button");
    search_booru_btn.innerHTML = "Search artist on Booru";
    let search_booru_illust_btn = document.createElement("button");
    search_booru_illust_btn.innerHTML = "Search illust on Booru";

    attemptedQuerySelector('aside section button', (exist_dom) => {
      exist_dom.parentNode.insertBefore(export_json_btn, exist_dom.nextSibling);
      exist_dom.parentNode.insertBefore(export_str_btn, export_json_btn.nextSibling);
      exist_dom.parentNode.insertBefore(search_booru_btn, export_str_btn.nextSibling);
      exist_dom.parentNode.insertBefore(search_booru_illust_btn, search_booru_btn.nextSibling);
    });

    export_json_btn.onclick = function() {
      artwork_data = getPixivInfo(true);
      export_json_btn.style.background = 'lightgreen';
      export_str_btn.style.removeProperty("background");
    };
    export_str_btn.onclick = function() {
      artwork_data = getPixivInfo(false);
      export_str_btn.style.background = 'lightgreen';
      export_json_btn.style.removeProperty("background");
    };
    search_booru_btn.onclick = function() {
      if (!('artist_id' in artwork_data)) {
        artwork_data = getPixivInfo(false);
      }
      let _prefix = "https://danbooru.donmai.us/artists?commit=Search&search%5Border%5D=created_at&search%5Burl_matches%5D=https%3A%2F%2Fwww.pixiv.net%2Fusers%2F";
      let _url = _prefix + artwork_data["artist_id"];
      window.open(_url, "_blank");
    };
    search_booru_illust_btn.onclick = function() {
      if (!('illust_id' in artwork_data)) {
        artwork_data = getPixivInfo(false);
      }
      let illust_search_prefix = "https://danbooru.donmai.us/posts?tags=pixiv%3A";
      let illust_search_url = illust_search_prefix + artwork_data["illust_id"];
      window.open(illust_search_url, "_blank");
    };
  }

  // --- Twitter/X Post ---
  if (["twitter.com", "x.com"].includes(location.hostname)) {
    let twitter_url_id = '';
    function getTwitterInfo(as_JSON=true) {
      let data = {};
      // Get user
      let user_tag = document.querySelector('article > div div[data-testid="User-Name"]');
      data['artist'] = user_tag.childNodes[0].innerText;
      // -- Twitter user only has username, doesn't have a user ID number.
      //    The matched id is only used for creating search buttons.
      data['artist_id'] = '';
      let split_user_url = user_tag.childNodes[1].querySelector('a').href.split('/');
      twitter_url_id = split_user_url[split_user_url.length - 1];
      // Get post id
      data['illust_id'] = "T" + location.href.split('status/')[1].split('/')[0];
      // Get upload date
      data['post_date'] = document.getElementsByTagName('time')[0].dateTime.split('T')[0];
      // Get post title (if having a title)
      let tweet_nodes = document.querySelector('article div[data-testid="tweetText"]').querySelectorAll('span, img');
      data['post_title'] = Array.from(tweet_nodes).map(
        elem => elem.alt || elem.innerText.trim()).filter(d => d.length && d[0] != '#'
      ).join('').split('\n')[0];

      let s = "";
      if (as_JSON == true) {
        s = JSON.stringify(data)
      } else {
        s = pixiv_str_keys.map((x, i) => data[x]).join("\t");
      }
      copyToClipboard(s);
      return data;
    }

    // Add buttons & their click functions
    let search_booru_btn = document.createElement("button");
    search_booru_btn.innerHTML = "Search artist on Booru";
    let search_booru_illust_btn = document.createElement("button");
    search_booru_illust_btn.innerHTML = "Search illust on Booru";

    attemptedQuerySelector('div[data-testid="User-Name"]', (exist_dom) => {
      exist_dom.parentNode.insertBefore(export_json_btn, exist_dom.nextSibling);
      exist_dom.parentNode.insertBefore(export_str_btn, export_json_btn.nextSibling);
      exist_dom.parentNode.insertBefore(search_booru_btn, export_str_btn.nextSibling);
      exist_dom.parentNode.insertBefore(search_booru_illust_btn, search_booru_btn.nextSibling);
    });

    export_json_btn.onclick = function() {
      artwork_data = getTwitterInfo(true);
      export_json_btn.style.background = 'lightgreen';
      export_str_btn.style.removeProperty("background");
    };
    export_str_btn.onclick = function() {
      artwork_data = getTwitterInfo(false);
      export_str_btn.style.background = 'lightgreen';
      export_json_btn.style.removeProperty("background");
    };
    search_booru_btn.onclick = function() {
      if (!('artist_id' in artwork_data)) {
        artwork_data = getTwitterInfo(false);
      }
      let _prefix = "https://danbooru.donmai.us/artists?commit=Search&search%5Border%5D=created_at&search%5Burl_matches%5D=https%3A%2F%2Fwww.twitter.com%2F";
      let _url = _prefix + twitter_url_id;
      window.open(_url, "_blank");
    };
    search_booru_illust_btn.onclick = function() {
      if (!('illust_id' in artwork_data)) {
        artwork_data = getTwitterInfo(false);
      }
      let illust_search_prefix = "https://danbooru.donmai.us/posts?tags=source%3A";
      let illust_search_url = illust_search_prefix + encodeURIComponent(location.href.replace('x.com/','twitter.com/'));
      window.open(illust_search_url, "_blank");
    };
  }

  // --- Booru posts ---
  if (location.hostname.includes("booru")) {
    // Add renamed link
    let renamed_download_link = document.createElement("a");
    const item_href = document.getElementById('post-option-download').querySelector('a').href;
    renamed_download_link.href = item_href;
    renamed_download_link.style.display = 'block';
    renamed_download_link.style.paddingBottom = '3px';
    renamed_download_link.text = "RENAMED FILENAME";
    // Replace the original left-click (so that we can use custom filename).
    // Note: the right-click context file save behavior is not implemented.
    renamed_download_link.removeAttribute('onclick');
    renamed_download_link.addEventListener('click', function(e) {
      e.preventDefault();
      downloadWithCustomName(
        item_href,
        renamed_download_link.innerText.replace(/\.[^/.]+$/, ''));
    });

    // Copy the renamed filename (without file extension)
    const fname_copy_button = document.createElement('button');
    fname_copy_button.innerText = '📋'; // Copy icon
    fname_copy_button.addEventListener('click', () => {
      navigator.clipboard.writeText(
        renamed_download_link.innerText.replace(/\.[^/.]+$/, '')
      );
    });

    function getBooruInfo(as_JSON=true) {
      let data = {};
      let tag_list = document.getElementById("tag-list").querySelector("div");

      function query_tags(ul_class, sep=", ") {
        // Get tag list by ul_class name. Join by sep if multiple.
        let query_str = `ul.${ul_class} a.search-tag`;
        let _tags = tag_list.querySelectorAll(query_str);
        return Array.from(_tags).map((x, i) => x.innerText).join(sep)
      }
      data["artists"] = query_tags("artist-tag-list");
      data["copyrights"] = query_tags("copyright-tag-list");
      data["characters"] = query_tags("character-tag-list");
      data["general"] = query_tags("general-tag-list");

      // Get information (rating-levels, etc.)
      function query_by_id(dom_id, remove_str) {
        let _text = document.getElementById(dom_id).innerText;
        return _text.replace(remove_str, "").trim();
      }
      data["booru_id"] = query_by_id("post-info-id", "ID:");
      data["rating_level"] = query_by_id("post-info-rating", "Rating:");

      let s = "";
      if (as_JSON == true) {
        s = JSON.stringify(data)
      } else {
        s = booru_str_keys.map((x, i) => data[x]).join("\t");
      }
      copyToClipboard(s);
      return data;
    }

    function updateRenamedDownloadLink() {
      let renamed_filename = '';
      const file_link = document.getElementById('post-info-size').querySelector('a').href;
      const post_sources = document.getElementById('post-info-source').querySelectorAll('a');
      const post_url = post_sources[0].href;
      const post_imgurl = post_sources[post_sources.length - 1].href;

      function getSitePostId() {
        const _site_url = post_sources[0].href;
        const _site_id = _site_url.substring(_site_url.lastIndexOf('/') + 1);
        return _site_id;
      }

      function getSiteFilenamePrefix(site_url) {
        for (const key in website_prefix_dict) {
          if (site_url.includes(key)) {
            return website_prefix_dict[key];
          }
        }
        return '#';
      }

      if (post_url.includes('pixiv.net') ) {
        // If pixiv, simply return original filename (from last <a> in sources)
        renamed_filename = post_imgurl.substring(post_imgurl.lastIndexOf('/') + 1);
      } else {
        // Otherwise, find the parent/children relations of the current post
        const children_previews = document.querySelector('.posts-container');
        let id_child = 0;  // If not found parent
        if (children_previews) {
          const articles = children_previews.querySelectorAll('article');
          for (let i = 0; i < articles.length; i++) {
              if (articles[i].classList.contains('current-post')) {
                id_child = i;
                break;
              };
          }
        }
        // Concat the filename
        const file_prefix = getSiteFilenamePrefix(post_url);
        const site_id = getSitePostId();
        const file_ext = file_link.substring(file_link.lastIndexOf('.'));
        renamed_filename = file_prefix + site_id + "_p" + id_child + file_ext;
        // Post-process: Remove everything after '?' if there is any
        const qm_index = renamed_filename.indexOf('?');
        if (qm_index >= 0) {
          renamed_filename = renamed_filename.substring(0, qm_index);
        }
      }
      // Update the renamed link element
      renamed_download_link.download = renamed_filename;
      const meta_tags = document.querySelectorAll('ul.meta-tag-list a');
      // If it is bad id (the post has revised version), mark it out in the text
      let msg_bad_id = '';
      for (const _meta_tag of meta_tags) {
        if (_meta_tag.innerText == 'bad id') {
          msg_bad_id = '(bad) ';
          break;
        }
      }
      renamed_download_link.text = msg_bad_id + renamed_filename;
    }
    // Update link for (renamed) image file download
    updateRenamedDownloadLink();

    // Add renamed link and buttons
    attemptedQuerySelector('section[id="search-box"]', (exist_dom) => {
      exist_dom.parentNode.insertBefore(renamed_download_link, exist_dom.nextSibling);
      exist_dom.parentNode.insertBefore(fname_copy_button, renamed_download_link.nextSibling);
      exist_dom.parentNode.insertBefore(export_json_btn, fname_copy_button.nextSibling);
      exist_dom.parentNode.insertBefore(export_str_btn, export_json_btn.nextSibling);
    });

    export_json_btn.onclick = function() {
      artwork_data = getBooruInfo(true);
      export_json_btn.style.background = 'lightgreen';
      export_str_btn.style.removeProperty("background");
    };
    export_str_btn.onclick = function() {
      artwork_data = getBooruInfo(false);
      export_str_btn.style.background = 'lightgreen';
      export_json_btn.style.removeProperty("background");
    };
  }

})();