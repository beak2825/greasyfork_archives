// ==UserScript==
// @name New twitter improvements
// @description Improves new version of twitter a little bit
// @namespace Violentmonkey Scripts
// @match https://mobile.twitter.com/*
// @match https://twitter.com/*
// @grant none
// @inject-into content
// @license WTFPL
// @version 0.22
// @downloadURL https://update.greasyfork.org/scripts/387641/New%20twitter%20improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/387641/New%20twitter%20improvements.meta.js
// ==/UserScript==
//
//
// *********************************************************************************
// * TODO: stop reply, retweet and like count from updating, it's very annoying    *
// *                                                                               *
// *********************************************************************************
//

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

(function() {

  //useless shit to remove
  var remove_elements = [
    'a[role="link"][data-testid="SideNav_NewTweet_Button"]',
    'a[role="link"][href="/explore"]',
    //ads and analytics are blocked anyway
    'a[role="link"][href*="ads.twitter.com"]',
    'a[role="link"][href*="analytics.twitter.com"]',
    'a[role="link"][href$="/topics"]',
    'a[role="link"][href="/i/premium_sign_up"]'
    //'a[role="link"][href="/i/verified-choose"]'
  ]

  let ob = new window.MutationObserver(function() {

    let sidebar = document.querySelector('div[data-testid="sidebarColumn"]');
    if (sidebar) {
      let verified_a = sidebar.querySelector('a[role="link"][href="/i/verified-choose"]');
      if (verified_a) {
        for (let i = 0; i <= 1; i++) {
          verified_a = verified_a.parentElement;
        }
        verified_a.remove();
      }
    }

    //remove useless elements
    remove_elements.forEach(function(sel) {
      let el = document.querySelector(sel);
      if (el) {
        el.remove();
      }
    })

    let verified_link = document.querySelector('a[role="link"][href="/i/verified-choose"]');
    if (verified_link && !verified_link.getAttribute('x-hidden')) {
      verified_link.style.display = 'none';
      verified_link.setAttribute('x-hidden', '1');
    }

    //trends are more complicated
    if (!window.location.pathname.startsWith("/settings")) {
      let sections = document.querySelectorAll('section[role="region"]');
      sections.forEach(function(s) {
        if (s.querySelector('a[href="/i/trends"]')) {
          //s.parentElement.parentElement.parentElement.remove();
          s.parentElement.parentElement.remove();
        }
      });
    }

    //profile pic is even worse
    if (window.location.pathname == "/home") {
      let pb = document.querySelector('div[role="progressbar"]');
      let form = pb.parentElement;
      if (form.querySelector('div[data-testid="toolBar"]')) {
        let imgs = form.querySelectorAll('img');
        imgs.forEach(function(i) {
          if (i.getAttribute('src').startsWith('https://pbs.twimg.com/profile_images/')) {
            i.parentElement.remove();
          }
        })
      }
    }

    let tp = document.querySelector('a[role="link"][href="/i/topics/picker/home"]');
    if (tp) {
      for (let i = 0; i <= 3; i++) {
        tp = tp.parentElement;
      }
      if (tp.getAttribute('role') == 'region') {
        tp.parentElement.parentElement.remove();
      }
    }

    let as = document.querySelector('div[data-testid="SideNav_AccountSwitcher_Button"]');
    let i = null;
    if (as) {
      let i = as.querySelector('img');
    }
    if (i) {
      i.parentElement.parentElement.parentElement.parentElement.remove();
    }
    if (as && !as.querySelector('svg[data-added="true"]') && as.querySelectorAll('div').length <= 1) {
      let more_button = document.querySelector('div[data-testid="AppTabBar_More_Menu"]').querySelector('svg').cloneNode(true);
      more_button.setAttribute('data-added', 'true');
      as.appendChild(more_button);
    }
    if (as && as.querySelectorAll('div').length > 1) {
      let s = as.querySelector('svg[data-added="true"]');
      if (s) {
        s.remove();
      }
      let spans = as.querySelectorAll('span');
      let sp = spans[2];
      if (sp) {
        sp.remove();
      }
      if (spans[1].innerHTML != "Account") {
        spans[1].innerHTML = "Account";
      }
    }

    //put direct links to images
    let links = document.querySelectorAll('a');
    links.forEach(function(a) {
      if (/^\/.*\/status\/\d*\/photo\/\d$/.test(a.getAttribute('href'))) {
        let img = a.querySelector('img');
        if (img) {
          let src = /^(.+)\?format=(\w+).*$/.exec(img.getAttribute('src'));
          a.setAttribute('href', src[1]+'.'+src[2]+':orig');
          a.setAttribute('x-image', 'true');
        }
      }
    });

    //add button to open all images
    let tweets = document.querySelectorAll('article[data-testid="tweet"]');
    tweets.forEach(function(tw){
      /*if (!tw.querySelector('div[data-testid="tweet"]')) {
        return;
      }*/
      let d = tw.querySelector('div[data-openimg="1"]');
      if (!d) {
        let gr = tw.querySelector('div[role="group"]');

        var is_single_tweet = false;
        if (getComputedStyle(gr).maxWidth == "none") {
          is_single_tweet = true;
        }

        let buttons = gr.querySelectorAll('div[role="button"]')
        let r = buttons[buttons.length-1].parentNode;

        let odiv = r.cloneNode(true);

        //let analyticslink = gr.querySelector('a[role="link"]');

        let f = odiv.querySelectorAll('div');
        f = f[f.length-1]
        let s = f.querySelector('span');
        if (s) {
          s.remove();
        }

        odiv.setAttribute('data-openimg', '1');
        odiv.querySelector('g').innerHTML = '<path d="M19.75 2H4.25C3.01 2 2 3.01 2 4.25v15.5C2 20.99 3.01 22 4.25 22h15.5c1.24 0 2.25-1.01 2.25-2.25V4.25C22 3.01 20.99 2 19.75 2zM4.25 3.5h15.5c.413 0 .75.337.75.75v9.676l-3.858-3.858c-.14-.14-.33-.22-.53-.22h-.003c-.2 0-.393.08-.532.224l-4.317 4.384-1.813-1.806c-.14-.14-.33-.22-.53-.22-.193-.03-.395.08-.535.227L3.5 17.642V4.25c0-.413.337-.75.75-.75zm-.744 16.28l5.418-5.534 6.282 6.254H4.25c-.402 0-.727-.322-.744-.72zm16.244.72h-2.42l-5.007-4.987 3.792-3.85 4.385 4.384v3.703c0 .413-.337.75-.75.75z"></path><circle cx="8.868" cy="8.309" r="1.542"></circle>';
        odiv.querySelectorAll('div')[0].addEventListener('click', function() {
          let images = tw.querySelectorAll('a[x-image="true"]');
          images.forEach(function(im) {
            window.open(im.getAttribute('href'));
          });
        });

        gr.appendChild(odiv);

      }
    });

  });

  window.onbeforeunload = function(e) {
    if (window.location.pathname.startsWith("/home")) {
      return "";
    } else {
      return null;
    }
  }

  ob.observe(document, {
    childList: true,
    subtree: true,
  });
})();