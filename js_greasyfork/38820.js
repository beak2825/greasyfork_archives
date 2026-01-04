// ==UserScript==
// @name          Click visible button using shortkeys
// @namespace http://userscripts.org/users/524433
// @description Click visible inputs that are defined as button and has value "VP" using ctrl+shift+z or "Hide" using ctrl+shift+x
// @include http://www.tangthuvien.com/*
// @include http://www.tangthuvien.vn/*
// @include http://www.lsb-thuquan.eu/*
// @version     2.0.1
// @grant none
// @run-at      document-end
// @require http://code.jquery.com/jquery-2.0.3.min.js
// // @resource dark_bg http://truyencv.com/templates/truyencv-green/assets/images/bg-content-style-7.png
// @downloadURL https://update.greasyfork.org/scripts/38820/Click%20visible%20button%20using%20shortkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/38820/Click%20visible%20button%20using%20shortkeys.meta.js
// ==/UserScript==
//
//

(function(d) {
  d.fn.visible = function(e, i) {
    var a = d(this).eq(0),
      f = a.get(0),
      c = d(window),
      g = c.scrollTop();
    c = g + c.height();
    var b = a.offset().top,
      h = b + a.height();
    a = e === true ? h : b;
    b = e === true ? b : h;
    return !!(i === true ? f.offsetWidth * f.offsetHeight : true) && b <= c && a >= g;
  };
})(jQuery);

jQuery(document).ready(function($) {
 
  var storyPosts = getPosts();
  console.log(storyPosts);
  var expandButtons = storyPosts.find("input[type=button]").filter(function() {
    if (this.value) text = this.value.toLowerCase();
    else text = this.innerHTML.toLowerCase();

    text = trim(text);
    text = removeVietnamese(text);

    if (RegExp("\\b" + "han" + "\\b").test(text)) {
      return false;
    }

    if (isNumber(text)) return true;

    if (RegExp("[0-9]+([-,_][0-9]+)+").test(text)) return true;

    return (
      text.indexOf("viet") != -1 ||
      text.indexOf("vp") != -1 ||
      text.indexOf("chuong") != -1 ||
      text.indexOf("hien") != -1 ||
      text.indexOf("chap") != -1 ||
      text.indexOf("doc") != -1 ||
      text.indexOf("mo") != -1 ||
      text.indexOf("...") != -1 ||
      text.indexOf("xem") != -1 ||
      text.indexOf("moi") != -1 ||
      text.indexOf("edit") != -1 ||
      text.indexOf("click") != -1
    );
  });
  console.log(expandButtons);
  

  JKscroll = { index: -1, newIndex: -1, scrollSpeed: 150, debug: false, offset: 180 }; // you can modify scrollSpeed as you wish
  $(document)
    .not('input[name*="username"][name*="password"]')
    .off("keydown")
    .on("keydown", function(e) {
      //document.addEventListener('keydown', function(e) {

      // pressed ctrl+shift+z
      if (e.keyCode == 90 && e.shiftKey && e.ctrlKey && !e.altKey && !e.metaKey) {
        ShowCurrentPost();
        e.preventDefault();
      }

      //pressed ctrl+shift+x
      if (e.keyCode == 88 && e.shiftKey && e.ctrlKey && !e.altKey && !e.metaKey) {
        HideAllPosts();
        e.preventDefault();
      }

      //J
      if (e.keyCode == 74 && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
        MoveDown();
        e.preventDefault();
      }

      //K
      if (e.keyCode == 75 && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
        MoveUp();
        e.preventDefault();
      }

      // shift + z:  hide post + move down + open visible
      if (e.keyCode == 90 && e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
        HideAllPosts();

        setTimeout(function() {
          if (MoveDown()) {
            ShowCurrentPost();
          }
        }, 250);

        e.preventDefault();
      }

      //shift + A
      if (e.keyCode == 65 && e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
        if (window.location.href.indexOf("page=") != -1) {
          var nextPage = parseInt(getParameterByName("page")) + 1;
          nextPage = isNaN(nextPage) ? 2 : nextPage;
          var url = updateURLParameter(window.location.href, "page", nextPage);
          window.open(url);
          /*
	       if (!$('#goToNextPage').length)
    	       $('body').append('<a id="goToNextPage" href="' + url + '" target="_blank">x </a>');
    	       
    	   $('#goToNextPage').get(0).click();*/
        }
      }

      //d
      if (e.which == 68 && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
        //pagedown
        if (!jQuery("input.textbox").is(":focus"))
          $("html, body").animate(
            {
              scrollTop: window.scrollY + window.innerHeight * 0.9
            },
            JKscroll.scrollSpeed
          );
        //  window.scrollTo(0,window.scrollY+window.innerHeight*.9);
      }

      //e
      if (e.which == 69 && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
        //pageup
        //window.scrollTo(0,window.scrollY-window.innerHeight*.9);
        if (!jQuery("input.textbox").is(":focus"))
          $("html, body").animate(
            {
              scrollTop: window.scrollY - window.innerHeight * 0.9
            },
            JKscroll.scrollSpeed
          );
      }
    });

  function getPosts() {
    if (window.location.hostname.indexOf("tangthuvien") != -1) return jQuery("[id^='post_message_']");
    return jQuery('#postlist')
    // return jQuery("input[type=button]");
  }

  function ShowCurrentPost() {
    var currentPost = jQuery(expandButtons[JKscroll.index]);
    if (currentPost.is(":visible")) currentPost.click();
  }  

  function HideAllPosts() {
    var hidePosts = storyPosts.find("input[type=button]").filter(function(index) {
      if (this.value) text = this.value.toLowerCase();
      else text = this.innerHTML.toLowerCase();
      text = text.trim();    
      return text.indexOf("hide") != -1 || text.indexOf("ẩn") != -1;
    });
    hidePosts.each(function(index) {
      this.click();
    }); 
  }

  function Scroll() {
    $("html, body").animate(
      {
        scrollTop: jQuery(expandButtons[JKscroll.newIndex]).offset().top - JKscroll.offset
      },
      JKscroll.buttons
    );
  }

  function MoveDown() {
    if (JKscroll.index < expandButtons.length - 1) {
      JKscroll.index++;
      JKscroll.newIndex = JKscroll.index;
      Scroll();
      return true;
    }

    return false;
  }

  function MoveUp() {
    if (JKscroll.index > 0) {
      JKscroll.index--;
      JKscroll.newIndex = JKscroll.index;
      Scroll();
    }
  }

  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  function updateURLParameter(url, param, paramVal) {
    var TheAnchor = null;
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";

    if (additionalURL) {
      var tmpAnchor = additionalURL.split("#");
      var TheParams = tmpAnchor[0];
      TheAnchor = tmpAnchor[1];
      if (TheAnchor) additionalURL = TheParams;

      tempArray = additionalURL.split("&");

      for (i = 0; i < tempArray.length; i++) {
        if (tempArray[i].split("=")[0] != param) {
          newAdditionalURL += temp + tempArray[i];
          temp = "&";
        }
      }
    } else {
      var tmpAnchor = baseURL.split("#");
      var TheParams = tmpAnchor[0];
      TheAnchor = tmpAnchor[1];

      if (TheParams) baseURL = TheParams;
    }

    if (TheAnchor) paramVal += "#" + TheAnchor;

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
  }

  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  function removeVietnamese(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    return str;
  }
});

jQuery(window).load(function($) {
  if (window.location.hostname.indexOf("tangthuvien") != -1) {
    //  $("div[id^='post_message']").find('font').attr('size', 5)
    jQuery("div[id^='post_message']").css("font-size", "large");
    jQuery("div[id^='post_message']").css("font-family", "Palatino Linotype");
    //Attempt for night mode
    jQuery("html, body").css({
      background: "#131313"
    });
    jQuery(
      "#navbar_notice_1, .posthead, .postbody, #thread_controls, .postbit>div, .textcontrols, .postbit, .postbit .posttitle, .navlinks, .thread_info .threadinfohead, .thread_info_block , .inner_block, .footer"
    ).css({
      background: "rgb(32,32,32)",
      color: "#999",
      border: "0"
    });

    jQuery(".userinfo").css({
      "border-bottom": "1px solid rgba(255, 255, 255, 0.08)"
    });

    jQuery(".signature.restore").css({
      "border-top": "1px solid rgba(255, 255, 255, 0.08)"
    });

    jQuery(".body_wrapper").attr("class", "body-wrapper");

    jQuery(".breadcrumb, .above_postlist, .body-wrapper, .body-wrapper > center, .userinfo").css({
      background: "rgb(32,32,32)",
      "background-color": "rgb(32,32,32)"
    });
    jQuery(".body-wrapper").css({
      margin: "10px 20px 0 13px",
      //'border': '3px solid #385e99',
      padding: "10px 20px 10px 20px",
      "border-radius": "5px"
    });
  }

  if (window.location.hostname.indexOf("lsb-thuquan") != -1) {
    jQuery(".maincontent").css("font-size", "165%");
  }
});
