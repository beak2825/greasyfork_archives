// ==UserScript==
// @name         Google Image Direct View
// @version      3.6
// @namespace    Google_Image_Direct_View
// @description  A different take on Google direct image viewer
// @author       navchandar
// @include      https://www.google.tld/*tbm=isch*
// @include      https://www.google.tld/search?tbm=isch*
// @include      https://www.google.co.*/*tbm=isch*
// @include      https://www.google.co.*/search?tbm=isch*
// @match        https://lens.google.com/search*
// @include      https://lens.google.com/search*
// @run-at       document-end
// @license      MIT
// @grant        none
// @homepage     https://navchandar.github.io/
// @homepage     https://github.com/navchandar/
// @homepageURL  https://navchandar.github.io/
// @contributionURL https://paypal.me/navchandar
// @contributionAmount $5.00
// @copyright    2019+, navchandar (https://openuserjs.org/users/navchandar)
// @supportURL   https://openuserjs.org/scripts/navchandar/Google_Image_Direct_View/issues
// @setupURL     https://openuserjs.org/install/navchandar/Google_Image_Direct_View.user.js
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAYFBMVEUAAAAAzAAAzAAAzAAAywAAzQAAzgAAzAAAzAAAzAAAzgAAzAAAzgAAzAAAywAAywAAzAD///9/5X8/2D+f65/v++8v1S+/8r8f0h/P9c/f+N9f31+v76+P6I9v4m9P20/YL+UMAAAAEHRSTlMAD++/z38v359vH18/r49PSnNavQAAA7hJREFUeNrt2wuSoyAUBVDAH6LGi79oYtL73+XMVGUqncJEHiJOV81ZQHOVx2uDyJykZZ6com9OSV6mLIi0kDHeiGWxbwqeVwIrRJVztguVx7AU54r5VlcgqWq/tz4DWeZtKvhJwIk4eYmQYINk+9wLbCLqbYu+wmbVhtaQw4vcdeHH8CR2agulgDeiPOj2u08Dj+FZzKnjH5kgFdiBSInjH5ZACexEqLDzT68D+vj0BMTxwyeQ2Jmkjh82QYEAilANgN4OeIYgMh6kAOhlUCOYenECBIIRS5NQIaCKGUoEZT6jZQgqM3//BJYEqEBKHSYILjnwBpi3IMEBksOWgLkQCgRl/l+OQNfeu/NF/3U5N9cRRBF7UKAau4s2TQ0xg3Itwat+o7+BInErwWHS7/UD7GVOM3Dt9ScXSgLlsBPQ6RV9C2s5fQ1Met2AJ5t1AM/j6x7WqE8inbYyw1ZJW4T31wudr4+bPX7N+kULSwmpBIaXQW7ja2t6aUkgFIGArfPH1Ta71KFgjMNWa1zi+wLpYIkTanBe63ezw0Io7dvQqJ++sGTs6XOQs8RhCZyxrHnUx9wQlkEFS5f1yxv11N1bUFQsAnkGJvgTrQcwnwHu8CdiWGMushEeWQc405aY/wDGGiDwHKADgYcARh9uQBAgQNssCheg0Yv+B7AOkB0bILNoxUYf8BkgOj6AxArzv7HPANLigcR4Ih09BkjWd0fMca74bmyfOnKAgpX0ddjZpISdknGQq7D3GIDb/zCZjTnwEEAw5vJMdvEWIKL8OO2NZrg9QEL5eX7TT4OnACVpg6LXK2XQkPsAaYvm+feXn82HM7kRRcRNqunDNsjQETvhc5MqBQjN6KnvWjy03eTUilPiRqXZ989/TLT/BeZ++QnWOm1pgoXTI0AK7wluljPwEHtOcGlhI3Z7YXHv/Vw+UDi+sxrP+oO+gSXBnV9ajd3bm/8cnvTSSoFouC1MxHQFhdp4duHrNn2/9Pk6gET6eHU7tA8gE/zfenkd/OWt4AGOEBEPE8UIKGYmhYAU/RC5/wo8cBLiQGc56Sc7awRRs7dOCODEPqiwu+qQI6XmodKjzhRmPPSxavM0ZegE9MPdaYydxGnow/1m/R2ZIOY/5wOH3wkkPJOk8f0/IRWMLBVhl59JRfAkUj/zU69/4GO33/IMm2T59u8tsYGXby65FHAiJGd+KClchlfMH15kIMkKzjwrJazJku2ilhlWZbJmO1KFzD4NXii2P17mSRThRRQleeky7b8AeEEvYPjorH8AAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/398189/Google%20Image%20Direct%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/398189/Google%20Image%20Direct%20View.meta.js
// ==/UserScript==

// If your device/extension is not running the script on Image search, try adding this above: // @include  https://www.google.* 
// Check out this link: https://openuserjs.org/scripts/navchandar/Google_Image_Direct_View/issues/Alternative_to_tld_for_matching_domains_(for_non-Tampermonkey_users)_ for more details.

// Updated image xpath locator to work on Google Images and Google Lens
var img_locator = "//c-wiz[@jsname]/parent::div[not(contains(@style, 'display: none'))]//a[(contains(@jsaction, 'focus'))]//img[not(contains(@src, 'gstatic.com/favicon')) and not(contains(@style, 'hidden'))] | //c-wiz[@jsname]/parent::div[not(contains(@style, 'display: none'))]//a//img[contains(@jsaction, 'load') and not(contains(@src, 'gstatic.com/favicon')) and not(contains(@style, 'hidden'))]";
var del_locator = "//c-wiz[@jsname]/parent::div[not(contains(@style, 'display: none'))]//a//img[contains(@style, 'hidden')]"
var lens_locator1 = "//a/div//img[not(contains(@alt, 'tag') or contains(@alt, 'domain'))]";
var lens_locator2 = "//a/div/img";

// Function to get elements by XPath
function get_elements_by_xpath(xpath, parent) {
  let results = [];
  let query = document.evaluate(xpath, parent || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (let i = 0, length = query.snapshotLength; i < length; ++i) {
    results.push(query.snapshotItem(i));
  }
  return results;
}

// Function to check if a string contains a search term
function has(string, search) {
  try {
    return string.includes(search);
  }
  catch (err) {
    return false;
  }
}

function is_lens() {
  return has(window.location.href, "lens.google.");
}

// Function to get the XPath locator for images
function get_img_locator() {
  return is_lens() ? (lens_locator1 + " | " + lens_locator2) : img_locator;
}

// Function to get the XPath locator for image links
function get_img_link_locator() {
  if (is_lens()) {
    return `${lens_locator2}//../../../a[@href] | ${lens_locator1}//../../../../../a[@href]`;
  }
  else {
    let img_xp = `(${img_locator})`;
    return `${img_xp}//../../../a[@href] | ${img_xp}//../../a[@href]`;
  }
}

// Check if the attribute exists and remove
function remove_attr(elem, attr) {
  if (elem.hasAttribute(attr)) {
    elem.removeAttribute(attr);
  }
}

// Function to update image elements on the page
function update_elements() {
  var int = 0;

  // remove duplicate hidden image elements
  var del_elems = get_elements_by_xpath(del_locator);
  if (del_elems) {
    console.log(del_elems.length.toString() + " del elems items found");
    for (var x = 0; x < del_elems.length; x++) {
      try {
        del_elems[x].remove();
      }
      catch (err) {
        console.log(err);
      }
    }
  }

  let imgXpath = get_img_locator();
  let linkXpath = get_img_link_locator()
  var Img_items = get_elements_by_xpath(imgXpath);
  console.log(Img_items.length.toString() + " Image items found");

  if (Img_items.length > 0) {
    var Link_items = get_elements_by_xpath(linkXpath);
    console.log(Link_items.length.toString() + " link items found");

    for (var i = 0; i < Img_items.length; i++) {
      try {
        if (Link_items && Link_items[i]) {
          console.log(Link_items[i].jsaction);
          var src = Img_items[i].src;
          var uri = Link_items[i].href;

          // Add target to open images in new tab
          Link_items[i].target = "_blank";
          Img_items[i].target = "_blank";
          if (uri != src) {
            int++;
            Link_items[i].title = "Image Loading... Wait...";

            if (has(src, "data:image")) {
              Link_items[i].href = src;
              Link_items[i].download = "Base64_Image.jpg";
              Link_items[i].title = "Base64 Image will be downloaded!";
            }
            else if (is_lens() && has(src, "https://encrypted")) {
              Link_items[i].href = src;
              Link_items[i].title = "Image URL updated!";
              remove_attr(Link_items[i], "jsaction");
              remove_attr(Link_items[i], "download");
            }
            else {
              if (!has(src, "https://encrypted")) {
                Link_items[i].href = src;
                Link_items[i].title = "Image URL updated!";
                remove_attr(Link_items[i], "jsaction");
                remove_attr(Link_items[i], "download");
              }
            }
          }
          else if (!Link_items[i].title || has(Link_items[i].title, "Wait")) {
            // Link is already updated. Update the title.
            if (has(uri, "data:image")) {
              Link_items[i].title = "Base64 Image will be downloaded!";
            }
            else {
              Link_items[i].title = "Image URL updated!";
            }
          }
        }
      }
      catch (err) {
        console.log(err);
      }
    }
    if (int > 0) {
      console.log("Updated " + int + " image links.");
    }
  }
}

// Start the script and update elements every 500 milli seconds
(function () {
  'use strict';
  setInterval(function () {
    update_elements();
  }, 500);
})()
