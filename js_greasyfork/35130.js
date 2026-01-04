// ==UserScript==
// @name         Imgur Mirror (Modified)
// @version      2.7.7
// @description  Switches all imgur links to imgurp.com
// @author       Ad3m
// @include      *://*/*
// @exclude      *://imgur.com/*
// @exclude      *://*.imgur.com/*
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant  	     unsafeWindow
// @namespace    https://greasyfork.org/users/159159
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @downloadURL https://update.greasyfork.org/scripts/35130/Imgur%20Mirror%20%28Modified%29.user.js
// @updateURL https://update.greasyfork.org/scripts/35130/Imgur%20Mirror%20%28Modified%29.meta.js
// ==/UserScript==
var cfg = new MonkeyConfig({
    title: 'Imgur Mirror Configuration',
    menuCommand: true,
    params: {
        wikipedia_redirect: {
            type: 'checkbox',
            default: false
        },
        reddit_redirect: {
            type: 'checkbox',
            default: false
        },
      imgur_redirect: {
            type: 'checkbox',
            default: true
        },
      reddit_link_hijack_remover: {
            type: 'checkbox',
            default: true
        },
      google_yandex_link_hijack_remover: {
            type: 'checkbox',
            default: true
        },
      open_links_in_new_tab: {
            type: 'checkbox',
            default: true
        },
      paticik_convert_links_to_video: {
            type: 'checkbox',
            default: true
        },
      paticik_youtube_fullscreen_fix: {
            type: 'checkbox',
            default: true
        }

    }
});

var red_cfg = cfg.get('reddit_redirect');
var wiki_cfg = cfg.get('wikipedia_redirect');
var img_cfg = cfg.get('imgur_redirect');
var red_link_cfg = cfg.get('reddit_link_hijack_remover');
var yan_link_cfg = cfg.get('google_yandex_link_hijack_remover');
var new_tab_cfg = cfg.get('open_links_in_new_tab');
var pati_ytb_fix = cfg.get('paticik_youtube_fullscreen_fix');
var pati_url_fix = cfg.get('paticik_convert_links_to_video');

changeLinks();
document.addEventListener('scroll', changeLinks);
document.addEventListener('click', changeLinks);
function get_ext(ext_url) {
    return (ext_url = ext_url.substr(1 + ext_url.lastIndexOf("/")).split('?')[0]).split('#')[0].substr(ext_url.lastIndexOf("."))
}
//Remove Yandex/Google Redirect by raletag https://greasyfork.org/en/scripts/22737-remove-yandex-redirect
if (yan_link_cfg != false) {
(function() {
    'use strict';
    var win = unsafeWindow || window;
    if (win.top !== win.self) return;

    function remove (e) {
        var links = e.querySelectorAll('a[onmousedown*="/clck/jsredir"]'), i;
        for (i = links.length - 1; i >= 0; --i) {
            links[i].removeAttribute('onmousedown');
        }
        var links = e.querySelectorAll('a[onmousedown*="return rwt"]'), i;
        for (i = links.length - 1; i >= 0; --i) {
            links[i].removeAttribute('onmousedown');
        }
        links = e.querySelectorAll('a[data-counter]');
        for (i = links.length - 1; i >= 0; --i) {
            links[i].removeAttribute('data-counter');
            links[i].removeAttribute('data-bem');
        }
        links = e.querySelectorAll('a[data-vdir-href]');
        for (i = links.length - 1; i >= 0; --i) {
            links[i].removeAttribute('data-vdir-href');
            links[i].removeAttribute('data-orig-href');
        }
    }

    remove (document.body);

    var o = new MutationObserver(function(ms){
        ms.forEach(function(m){
            m.addedNodes.forEach(function(n){
                if (n.nodeType !== Node.ELEMENT_NODE) {
                    return;
                }
                remove(n);
            });
        });
    });
    o.observe(document.body, {childList: true, subtree: true});
})();
}
//Remove Yandex/Google Redirect by raletag https://greasyfork.org/en/scripts/22737-remove-yandex-redirect
function changeLinks() {
  if (window.location.hostname == "forum.paticik.com") {
     $(".img").click(function () {
     $(this).removeClass("img");
     $(this).removeClass("img2");
     $(this).addClass("img-exp");
     });
     $(".img-exp").click(function () {
     $(this).removeClass("img2");
     $(this).removeClass("img-exp");
     $(this).removeClass("img");
     $(this).removeAttr( 'style' );
     $(this).css({'max-width': '450px', 'max-height': '100%'});
     $(this).addClass("img2");
     });
     $(".img2").click(function () {
     $(this).removeAttr( 'style' );
     $(this).removeClass("img2");
     $(this).addClass("img");
     });
  }
  
  if (img_cfg != false) {
//wikipedia
if (wiki_cfg != false) {
  var wurl = window.location.href;
  if ((wurl.indexOf("duckduckgo.com/?") > -1) && (wurl.indexOf("duckduckgo.com/html") == -1)) { 
  window.stop();
  var query = location.search;
  query = query.split('q=');
  window.location.replace("https://duckduckgo.com/html/?q="+query[query.length-1]);
  }
  var wikiList = document.querySelectorAll('a[href*="wikipedia.org"]');
  for (var i = 0; i < wikiList.length; i++)
  {
    wikiList[i].href = wikiList[i].href.replace('wikipedia.org/','vikiansiklopedi.org/');
  }
}
//wikipedia
//imgur
  var imgur_old_href = "imgur.com";
  var imgur_new_href = "imgurp.com";
  var nodeList = document.querySelectorAll('[href*="imgur.com"]');
  for (var i = 0; i < nodeList.length; i++)
  {
  if (nodeList[i].href.indexOf(imgur_new_href)==-1) {
    nodeList[i].href = nodeList[i].href.replace(imgur_old_href,imgur_new_href);
    var o_url = nodeList[i].href.split(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/);
    var lastPart = get_ext(nodeList[i].href);
    var url_part = o_url[5].split("/")[1];
    var url_part2 = '' + o_url[5].split("/")[1];
    if(lastPart == '.gifv' || lastPart == '.mp4') {
      if (url_part != "a" && url_part != "gallery") {
        nodeList[i].href = nodeList[i].href.replace(url_part,url_part2);
        nodeList[i].href = nodeList[i].href.replace(/\.(gifv|mp4)($|\?)/, '.gif');
        
      }
    }
    else {
    if (url_part != "a" && url_part != "gallery" && lastPart.indexOf(".") !== -1) { nodeList[i].href = nodeList[i].href.replace(url_part,url_part2); }
    }
    if (new_tab_cfg != false) { nodeList[i].setAttribute('target', '_blank'); }
  }
  }

  var imgur_old_src = "imgur.com";
  var imgur_new_src = "imgurp.com";
  var nodeList_src = document.querySelectorAll('[src*="imgur.com"]');
  for (var i = 0; i < nodeList_src.length; i++)
  {
var lastPartImg = get_ext(nodeList_src[i].src);
  if (nodeList_src[i].src.indexOf(imgur_new_src)==-1) { 
    nodeList_src[i].src = nodeList_src[i].src.replace(imgur_old_src,imgur_new_src); 
    var imajinez = $('<video controls="" controls src="' + nodeList_src[i].src + '" style="max-width: 100%; max-height: 350px;"></video>');
    if(lastPartImg == '.gif') {
      $(nodeList_src[i]).replaceWith(imajinez); 
    }
  }
  }
    }
  if (red_cfg != false) {
    var list = document.querySelectorAll('[href*="i.redd.it"]');
    for (var i = 0; i < list.length; i++) {
      var node = list.item(i);
      var proxy_node = "https://proxy.duckduckgo.com/iu/?u="
      
      if (node.href.indexOf(proxy_node)==-1) {
        node.setAttribute('href', node.getAttribute('href')
             .replace(node.getAttribute('href'), proxy_node + node.getAttribute('href') + '&f=1')); 
              if (new_tab_cfg != false) { node.setAttribute('target', '_blank'); }
      }
    }
    list = document.querySelectorAll('[src*="i.redd.it"]');
    for (i = 0; i < list.length; i++) {
        var node = list.item(i);
        var proxy_node = "https://proxy.duckduckgo.com/iu/?u="
      if (node.src.indexOf(proxy_node)==-1) {
        node.setAttribute('src', node.getAttribute('src')
            .replace(node.getAttribute('src'), proxy_node + node.getAttribute('src') + '&f=1'));
      }      
    }
    }
}
if (red_link_cfg != false) {
// Reddit Link Hijack Remover by jmesmon https://greasyfork.org/tr/scripts/20752-reddit-link-hijack-remover
(function () {
  'use strict';
  if (window.location.host == "www.reddit.com") {
  function cl(ac) {
    var a = ac.querySelectorAll('a[data-href-url]');
    var ct_out = 0, ct_aff = 0, ct = 0, ct_in;
    for (var i = 0; i < a.length; i++) {
      /*
      // This is reddit's function to determine the url, which is stored in `o`.
      // It then hooks window unload to call sendBeacon with the url in `o` or
      // modifies the href attribute (if sendBeacon is disabled in config or unsupported by the browser).
      function o(e) {
       var t = $(e),
        r = Date.now(),
        o;
       return t.attr('data-inbound-url')
         ? o = t.attr('data-inbound-url')
         : !n && t.attr('data-outbound-expiration') > r && (o = t.attr('data-outbound-url')),
         o && (i ? s = o : e.href = o),
       !0
      }
      */

      // Some minimal counting so we can tell things are working
      if (a[i].getAttribute('data-inbound-url')) {
        ct_in++;
      }
      if (a[i].getAttribute('data-affiliate-url')) {
        ct_aff++;
      }
      if (a[i].getAttribute('data-outbound-url') || a[i].getAttribute('data-outbound-expiration')) {
        ct_out++;
      }

      // Goals:
      //  - make sure `o` stays undefined.
      //  - avoid ever getting this function called
      // Removing all the relevent attributes gets us both of those

      // Unclear what the purpose of these is, but they are being used to
      // re-write urls (and trigger entry to the fn above), so remove.
      a[i].removeAttribute('data-inbound-url');

      // Doesn't appear that reddit is injecting these affiliate links
      // anymore, but no reason to remove this
      a[i].removeAttribute('data-affiliate-url');

      // We don't actually need to remove this, but it does short circuit
      // the condition quicker & cleans up the html, so do it.
      a[i].removeAttribute('data-outbound-expiration');
      a[i].removeAttribute('data-outbound-url');

      ct++;
    }

    console.log('>>>');
    console.log('Outbound redirects removed: ' + ct_out);
    console.log('Inbound redirects removed: ' + ct_out);
    console.log('Affiliate redirects removed: ' + ct_aff);
    console.log('Total redirects removed: ' + ct);
    console.log('<<<');
  }

  var tbls = document.querySelector('#siteTable');
  var obs = new MutationObserver(function (r, self) {
    for (var i = 0; i < r.length; i++) {
      var ad = r[i].addedNodes;
      for (var j = 0; j < ad.length; j++) {
        var n = ad[j];
        cl(n);
      }
    }
  });
  obs.observe(tbls, {
    childList: true
  });

  // TODO: consider patching out window.navigator.sendBeacon (which reddit only uses for this link tracking)
  // TODO: consider blocking the recent_srs cookie used for tracking
  cl(document);
  }
}) ();
}
// Reddit Link Hijack Remover by jmesmon https://greasyfork.org/tr/scripts/20752-reddit-link-hijack-remover
// Restore Youtube Embed Defaults by chaimleib (modified for paticik) https://greasyfork.org/en/scripts/829-restore-youtube-embed-defaults/code
if (window.location.hostname == "forum.paticik.com") {

if (pati_url_fix != false) {
$('body').prepend("<style> .img { cursor:zoom-in; position: absolute; left: 0; right: 0; max-width: 100%; max-height: 100%; margin: auto; overflow: auto; } .img-exp { cursor:zoom-out; position: absolute; margin-left: auto; margin-right: auto; left: 0; right: 0; overflow: auto; }</style>");

pati_img();
document.addEventListener('click', pati_img);
document.addEventListener('scroll', pati_img);
function pati_img() {
$('a').click(function(e)
{
   var pattern = /([-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?(?:webm|mp4|mp4v|gif|gifv|png|jpg|jpeg))/gi;
   var regex = /\.\w{3,4}($|\?)/gmi;
  if (pattern.test(this)) {
   var target = $(this).attr('href');
   var match = target.match(regex);
   if (match) {
     var file = match[0].split(/\#|\?/g)[0];  
     if (file == '.gifv' || file == '.mp4') {
            target = target.replace(/\.(gifv|mp4)($|\?)/, '.mp4');
        }
   }
   if (file == '.gif' && target.indexOf("imgur") > -1) { file = '.gifv'; }
   var video = $('<video controls="" controls autoplay src="' + target + '" style="max-width: 100%; max-height: 350px;"></video>');
   var imajine = $('<img id="img" class="img" src="' + target + '" style="overflow:visible" /></a>');
   /*
   var imaj = $('<img src="' + target + '" style="max-width: 100%; max-height: 350px;" />');
        if (file == '.gif') {
            $(this).replaceWith(imaj);
          e.preventDefault();
        }
   */
    		if (file == '.png' || file == '.jpg' || file == '.jpeg' || file == '.gif') {
		    $(this).replaceWith(imajine);
          e.preventDefault();
		    }
    		if (file == '.gifv' || file == '.mp4' || file == '.webm') {
		    $(this).replaceWith(video);
          e.preventDefault();
		    }
   
  }
});
}
}
if (pati_ytb_fix != false) {
pati_ytb();
document.addEventListener('click', pati_ytb);
document.addEventListener('scroll', pati_ytb);
function pati_ytb() {
var i, j, k, index;
var video_id, video_url, video_link;
var risky_elements, risky_attributes, risky_node;
var risky_tags = ["object", "embed"];
var bad_elements = [];
var bad_ids = [];
for (i = 0; i < risky_tags.length; i++) {
	risky_elements = document.getElementsByTagName(risky_tags[i]);
	for (j = 0; j < risky_elements.length; j++) {
		index = 0;
		risky_attributes = risky_elements[j].attributes;
		for (k = 0; k < risky_attributes.length; k++) {
			risky_node = risky_attributes[k].nodeValue;
			if ((risky_node.indexOf("youtube.com") >= 0) || (risky_node.indexOf("ytimg.com") >= 0) || (risky_node.indexOf("youtube-nocookie.com") >= 0)) {
				risky_elements[j].style.display = "none";
				if (risky_node.indexOf("/v/") >= 0) {
					index = risky_node.indexOf("/v/") + 3;
				} else if (risky_node.indexOf("?v=") >= 0) {
					index = risky_node.indexOf("?v=") + 3;
				} else if (risky_node.indexOf("/embed/") >= 0) {
					index = risky_node.indexOf("/embed/") + 7;
				}
				if (index > 0) {
					video_id = risky_node.substring(index, index + 11);
					bad_elements.push(risky_elements[j]);
					bad_ids.push(video_id);
				}
				break;
			}
		}
	}
}

for (i = 0; i < bad_ids.length; i++) {
	video_id = bad_ids[i];
	video_url = "//www.youtube.com/embed/" + video_id;
	video_link = document.createElement("iframe");
	video_link.setAttribute("src", video_url);
    

	video_link.setAttribute("width", '100%');
	video_link.setAttribute("height", '350');
	video_link.setAttribute("frameborder", "0");
	video_link.setAttribute("allowfullscreen", "1");
    
	bad_elements[i].parentNode.replaceChild(video_link, bad_elements[i]);
}
}
}
}
// Restore Youtube Embed Defaults by chaimleib https://greasyfork.org/en/scripts/829-restore-youtube-embed-defaults/code