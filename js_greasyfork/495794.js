// ==UserScript==
// @name         Bluesky Image Downloader
// @namespace    coredumperror
// @version      1.0
// @description  Adds a download button to images posted to Bluesky, which immediately downloads the image in max quality and with a descriptive filename for easy sorting.
// @author       coredumperror
// @license      MIT
// @match        https://bsky.app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495794/Bluesky%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/495794/Bluesky%20Image%20Downloader.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // This script is a heavily modified version of https://greasyfork.org/en/scripts/377958-twitterimg-downloader

  /** Edit filename_template to change the file name format:
   *
   *  <%username>  Bluesky username           eg: oh8.bsky.social
   *  <%uname>     Bluesky short username     eg: oh8
   *  <%post_id>   Post ID                    eg: 3krmccyl4722w
   *  <%timestamp> Current timestamp          eg: 1550557810891
   *  <%img_num>   Image number within post   eg: 0, 1, 2, or 3
   *
   *  default: "<%uname> <%post_id>_p<%img_num>"
   *  result: "oh8 3krmccyl4722w_p0.jpg"
   *      Could end in .png or any other image file extension,
   *      as the script downloads the original image from Bluesky's API.
   *
   *  example: "<%username> <%timestamp> <%post_id>_p<%image_num>"
   *  result: "oh8.bsky.social 1716298367 3krmccyl4722w_p1.jpg"
   *      This will make it so the images are sorted in the order in
   *      which you downloaded them, instead of the order in which
   *      they were posted.
   */
  let filename_template = "<%uname> <%post_id>_p<%img_num>";

  const post_url_regex = /\/profile\/[^/]+\/post\/[A-Za-z0-9]+/;
  // Set up the download button's HTML to display a floppy disk vector graphic within a grey circle.
  const download_button_html = `
    <div class="download-button"
      style="
        cursor: pointer;
        z-index: 999;
        display: table;
        font-size: 15px;
        color: white;
        position: absolute;
        right: 5px;
        bottom: 5px;
        background: #0000007f;
        height: 30px;
        width: 30px;
        border-radius: 15px;
        text-align: center;"
    >
      <svg class="icon"
        style="width: 15px;
          height: 15px;
          vertical-align: top;
          display: inline-block;
          margin-top: 7px;
          fill: currentColor;
          overflow: hidden;"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="3658"
      >
        <path p-id="3659"
              d="M925.248 356.928l-258.176-258.176a64
                 64 0 0 0-45.248-18.752H144a64
                 64 0 0 0-64 64v736a64
                 64 0 0 0 64 64h736a64
                 64 0 0 0 64-64V402.176a64
                 64 0 0 0-18.752-45.248zM288
                 144h192V256H288V144z m448
                 736H288V736h448v144z m144 0H800V704a32
                 32 0 0 0-32-32H256a32 32 0 0 0-32
                 32v176H144v-736H224V288a32
                 32 0 0 0 32 32h256a32 32 0 0 0
                 32-32V144h77.824l258.176 258.176V880z"
         ></path>
      </svg>
    </div>`;

  function download_image_from_api(image_url, filename) {
    // From the image URL, we retrieve the image's did and cid, which
    // are needed for the getBlob API call.
    const url_array = image_url.split('/');
    const did = url_array[6];
    // Must remove the @jpeg at the end of the URL to get the actual cid.
    const cid = url_array[7].split('@')[0];

    fetch(`https://bsky.social/xrpc/com.atproto.sync.getBlob?did=${did}&cid=${cid}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Couldn't retrieve blob! Response: ${response}`);
      }
      return response.blob();
    })
    .then((blob) => {
      // Unfortunately, even this image blob isn't the original image. Bluesky
      // doesn't seem to store that on their servers at all. They scale the
      // original down to at most 1000px wide or 2000px tall, whichever makes it
      // smaller, and store a compressed, but relatively high quality jpeg of that.
      // It's less compressed than the one you get from clicking the image, at least.
      send_file_to_user(filename, blob);
    });
  }

  function send_file_to_user(filename, blob) {
    // Create a URL to represent the downloaded blob data, then attach it
    // to the download_link and "click" it, to make the browser's
    // link workflow download the file to the user's hard drive.
    let anchor = create_download_link();
    anchor.download = filename;
    anchor.href = URL.createObjectURL(blob);
    anchor.click();
  }

  // This function creates an anchor for the code to manually click() in order to trigger
  // the image download. Every download button uses the same, single <a> that is
  // generated the first time this function runs.
  function create_download_link() {
    let dl_btn_elem = document.getElementById('img-download-button');
    if (dl_btn_elem == null) {
      // If the image download button doesn't exist yet, create it as a child of the root.
      dl_btn_elem = document.createElement('a', {id: 'img-download-button'});
      // Like twitter, everything in the Bluesky app is inside the #root element.
      // TwitterImg Downloader put the download anchor there, so we do too.
      document.getElementById('root').appendChild(dl_btn_elem);
    }
    return dl_btn_elem;
  }

  function get_img_num(image_elem) {
    // This is a bit hacky, since I'm not sure how to better determine whether
    // a post has more than one image. I could do an API call, but that seems
    // like overkill. This should work well enough.
    // As of 2024-05-22, if you go up 7 levels from the <img> in a POST, you'll hit the
    // closest ancestor element that all the images in the post descend from.
    const nearest_common_ancestor = image_elem.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
    // But images in the lightbox are different. 7 levels is much too far.
    // In fact, there doesn't seem to be ANY way to determine how many images are in the lightbox,
    // so I've actually gone back and changed add_download_button_to_image() so it doesn't put a download button
    // onto lightbox images at all.

    // Loop through all the <img> tags inside the ancestor, and return the index of the specified imnage_elem.
    const post_images = nearest_common_ancestor.getElementsByTagName('img');
    // TODO: This doesn't work if the image_elem is a click-zoomed image viewed from a feed.
    // 7 ancestors up brings us high enough to capture the entire feed in post_images.
    for (let x = 0; x < post_images.length; x += 1) {
      if (post_images[x].src == image_elem.src) {
        return x;
      }
    }
    // Fallback value, in case we somehow don't find any <img>s.
    return 0;
  }

  // Adds the download button to the specified image element.
  function add_download_button_to_image(image_elem) {
    // If this doesn't look like an actual <img> element, do nothing.
    // Also note that embeded images in Bluesky posts always have an alt tag (though it's blank),
    // so the image_elem.alt == null check ensures we don't slap a download button onto user avatars and such.
    if (image_elem == null || image_elem.src == null || image_elem.alt == null) {
      return;
    }
    // Create a DOM element in which we'll store the download button.
    let download_btn = document.createElement('div');
    let download_btn_parent;
    // We grab and store the image_elem's src here so that the click handler
    // and retrieve it later, even once image_elem has gone out of scope.
    let image_url = image_elem.src;

    if (image_url.includes('feed_thumbnail')) {
      // If this is a thumbnail, add the download button as a child of the image's grandparent,
      // which is the relevant "position: relative" ancestor, placing it in the bottom-right of the image.
      const html = download_button_html.replace('<%pos>', 'right: 5px; bottom: 5px;');
      download_btn_parent = image_elem.parentElement.parentElement;
      download_btn_parent.appendChild(download_btn);
      // AFTER appending the download_btn div to the relevant parent, we change out its HTML.
      // This is needed because download_btn itself stops referencing the actual element when we replace its HTML.
      // There's probably a better way to do this, but I don't know it.
      download_btn.outerHTML = html;
    }
    else if (image_url.includes('feed_fullsize')) {
      // Don't add a download button to these. There's no way to determine how many images are in a post from a
      // fullsize <img> tag, so we can't build the filename properly. Users will just have to click the Download button
      // that's on the thumbnail.
      return;
    }

    // Because we replaced all of download_btn's HTML, the download_btn variable doesn't actually point
    // to our element any more. This line fixes that, by grabbing the download button from the DOM.
    download_btn = download_btn_parent.getElementsByClassName('download-button')[0];

    let post_path;
    const current_path = window.location.pathname;
    if (current_path.match(post_url_regex)) {
      // If we're on a post page, just use the current location for post_url.
      // This is necessary because there's a weird issue that happens when a user clicks from a feed to a post.
      // The feed sticks around in the DOM, so that the browser can restore it if the user clicks Back.
      // But that lets find_time_since_post_link() find the *wrong link* sometimes.
      // To prevent this, check if we're on a post page by looking at the URL path.
      // If we are, we know there's no time-since-post link, so we just use the current path.
      post_path = current_path;
    }
    else {
      // Due to the issue described above, we only call find_time_since_post_link()
      // if we KNOW we're not on a post page.
      const post_link = find_time_since_post_link(image_elem);
      // Remove the scheme and domain so we just have the path left to parse.
      post_path = post_link.href.replace('https://bsky.app', '');
    }

    // post_path will look like this:
    //   /profile/oh8.bsky.social/post/3krmccyl4722w
    // We parse the username and Post ID from that info.
    const post_array = post_path.split('/');
    const username = post_array[2];
    const uname = username.split('.')[0];
    const post_id = post_array[4];

    const timestamp = new Date().getTime();
    const img_num = get_img_num(image_elem);

    // Format the content we just parsed into the default filename template.
    const base_filename = filename_template
      .replace("<%username>", username)
      .replace("<%uname>", uname)
      .replace("<%post_id>", post_id)
      .replace("<%timestamp>", timestamp)
      .replace("<%img_num>", img_num);

    // Not sure what these handlers from TwitterImagedownloader are for...
    // Something about preventing non-click events on the download button from having any effect?
    download_btn.addEventListener('touchstart', function(e) {
      download_btn.onclick = function(e) {
        return false;
      }
      return false;
    });
    download_btn.addEventListener('mousedown', function(e) {
      download_btn.onclick = function(e) {
        return false;
      }
      return false;
    });

    // Add a click handler to the download button, which performs the actual download.
    download_btn.addEventListener('click', function(e) {
      e.stopPropagation();
      download_image_from_api(image_url, base_filename);
      return false;
    });
  }

  function find_feed_images() {
    // Images in feeds and posts have URLs that look like this:
    // https://cdn.bsky.app/img/feed_thumbnail/...
    // When the user clicks an image to see it full screen, that loads the same image with a different prefix:
    // https://cdn.bsky.app/img/feed_fullsize/...
    // Thus, this CSS selector will find only the images we want to add a download button to:
    const selector = 'img[src^="https://cdn.bsky.app/img/feed_thumbnail"]';

    document.querySelectorAll(selector).forEach((feed_image) => {
      // Before processing this image, make sure it's actually an embedded image, rather than a video thumbnail.
      // They use identical image URLs, so to differentiate, we look for an alt attribute.
      // Feed images have one (that might be ""), while video thumbnails don't have one at all.
      if (feed_image.getAttribute('alt') === null) {
        // This is how to "continue" a forEach loop.
        return;
      }

      // We add a "processed" attribute to each feed image that's already been found and processed,
      // so that this function, which repeats itself every 300 ms, doesn't add the download button
      // to the same <img> over and over.
      let processed = feed_image.getAttribute('processed');
      if (processed === null) {
        add_download_button_to_image(feed_image);
        console.log(`Added download button to ${feed_image.src}`);
        // Add the "processed" flag.
        feed_image.setAttribute('processed', '');
      }
    });
  }

  function find_time_since_post_link(element) {
    // What we need to do is drill upward in the stack until we find a div that has an <a> inside it that
    // links to a post, and has an aria-label attribute. We know for certain that this will be the "time since post"
    // link, and not a link that's part of the post's text.
    // As of 2024-05-21, these links are 13 levels above the images in each post within a feed.

    // If we've run out of ancestors, bottom out the recursion.
    if (element == null) {
      return null;
    }
    // Look for all the <a>s inside this element...
    for (const link of element.getElementsByTagName('a')) {
      // If one of them links to a Bluesky post AND has an aria-label attribute, that's the time-since-post link.
      // Post URLs look like /profile/oh8.bsky.social/post/3krmccyl4722w
      if (link.getAttribute('href') &&
          link.getAttribute('href').match(post_url_regex) &&
          link.getAttribute('aria-label') !== null) {
        return link;
      }
    }
    // We didn't find the time-since-post link, so look one level further up.
    return find_time_since_post_link(element.parentElement)
  }

  // Run find_feed_images(), which adds the download button to each image found in the feed/post, every 300ms.
  // It needs to run repeatedly so that when the user scrolls a feed, new images get the button after they load in.
  setInterval(find_feed_images, 300);

// The downloader's code is over, but there's one last thing that might prove useful later...

//////////////////////////////////////////////////////////////////////////////
// How to use the Bluesky API if you need to do something that requires authorization:
//////////////////////////////////////////////////////////////////////////////
function authorize_with_bluesky_api() {
    // To use the Bluesky API, we start by creating a session, to generate a bearer token.
    const credentials = {
      // Replace these with actual credentials when using this.
      identifier: 'EMAIL',
      password: 'PASSWORD',
    };

    fetch(
      'https://bsky.social/xrpc/com.atproto.server.createSession',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      }
    ).then((response) => {
      if (!response.ok) {
        throw new Error(`Unable to create Bluesky session! Status: ${response.json()}`);
      }
      return response.json();
    }).then((body) => {
      const auth_token = body.accessJwt;

      // Then use auth_token like this:

      fetch(
        `https://bsky.social/xrpc/com.atproto.whatever...`,
        {
          headers: {
            'Authorization': `Bearer ${auth_token}`,
          }
        }
      )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`API call failed! Status: ${response.json()}`);
        }
        return response.json();
      })
      .then((body) => {
        // Use the body of the response here...
      });

    });
  }

})();
