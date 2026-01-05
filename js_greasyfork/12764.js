// ==UserScript==
// @name        fixed_magnet_for_baiducloud
// @namespace   https://github.com/22earth
// @description fix magnet link in dmhy and popgo for baiducloud offline download
// @include     https://share.dmhy.org/topics/view/*
// @include     http://share.popgo.org/program*
// @include     http://pan.baidu.com/disk/home
// @version     0.2
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/12764/fixed_magnet_for_baiducloud.user.js
// @updateURL https://update.greasyfork.org/scripts/12764/fixed_magnet_for_baiducloud.meta.js
// ==/UserScript==

(function () {
  var btsite = {
    init: function () {
      this.addSearchAnchor(this.fixMagnet());
    },

    fixMagnet: function () {
      var torrentHash = null, magnetNode = null;
      if (window.location.href.match("popgo") && document.getElementById("si_downseed")) {
        torrentHash = document.getElementById("si_downseed").children[0].href.split("=")[1];
        magnetNode = document.getElementById("si_magnet").children[0];
        GM_setValue('magneturl', "magnet:?xt=urn:btih:" + torrentHash);

      }    
      if (window.location.href.match("dmhy") && document.getElementById("tabs-1")) {
        torrentHash = document.getElementById('tabs-1').children[0].children[1].pathname.replace(/\/(.*)\/(.*)\.torrent/, "$2");
        magnetNode = document.getElementById("a_magnet");
        GM_setValue('magneturl', "magnet:?xt=urn:btih:" + torrentHash);
      }
      console.log(GM_getValue("magneturl"));
      return magnetNode;
    },

    addSearchAnchor: function (aNode) {
      if (aNode) {
        // todo: create a function to make the anchor.
        var frag = document.createDocumentFragment();
        var anchor = document.createElement("a");
        anchor.className = "magnet-download";
        anchor.textContent = "百度云";
        anchor.href = "http://pan.baidu.com/disk/home";
        anchor.target = "_blank";
        // add another anchor for magnet.
        var magnetAnchor = document.createElement("a");
        magnetAnchor.textContent =  "磁力链接";
        magnetAnchor.className = "magnet-download";
        magnetAnchor.href = GM_getValue("magneturl");
        this.addStyle();
        frag.appendChild(anchor);
        frag.appendChild(magnetAnchor);
        aNode.parentNode.appendChild(frag);
        console.log("creat a anchor");
      }
    },

    addStyle: function (css) {
      if (css) {
        GM_addStyle(css);
      }
      else {
        GM_addStyle([
          '.magnet-download{color: rgb(0, 180, 30) !important;margin-left: 4px;}',
          '.magnet-download:hover{color:red !important;}',
        ].join(''));
      }
    },
  };


  var bdcloud = {
    init: function () {
      var magneturl = GM_getValue('magneturl');
      console.log(magneturl);
      GM_setValue('magneturl', '');
      if (magneturl) {
        var scriptnode = document.createElement("script");
        scriptnode.innerHTML = '(' + this.addToOffline.toString() + ')(\'' + magneturl + '\');';
        document.body.appendChild(scriptnode);
      }
    },

    addToOffline: function (magneturl) {
      $(".icon-btn-download").click();
      setTimeout(function () {
        $("#_disk_id_13").click();
        setTimeout(function () {
          if (!($('#share-offline-link')[0].value) && window.stop) {
            window.stop();
            $('#share-offline-link')[0].value = magneturl;
          }
          $("#_disk_id_17").click();
        }, 500);
      }, 500);
    },
  };

  if (window.location.hostname.match(/dmhy|popgo/)) {
    btsite.init();
  }
  if (window.location.hostname.match("baidu")) {
    bdcloud.init();
  }

})();